import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import { Review } from '@/app/models/Review';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token and verify it
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    const { email, role, id } = decodedToken as jwt.JwtPayload; 
    console.log('Decoded token:', decodedToken);
    console.log(email, role, id);
    // Initialize variables for stats
    let totalRequests = 0;
    let approvedRequests = 0;
    let rejectedRequests = 0;
    let pendingRequests = 0;

    if (role === 'team member') {
      // Fetch stats only for the current user's requests
      totalRequests = await Review.countDocuments({ author: id });
      approvedRequests = await Review.countDocuments({ author: id, status: 'approved' });
      rejectedRequests = await Review.countDocuments({ author: id, status: 'rejected' });
      pendingRequests = await Review.countDocuments({ author: id, status: 'pending' });
    } else if (role === 'admin') {
      // Admin can see all stats
      totalRequests = await Review.countDocuments();
      approvedRequests = await Review.countDocuments({ status: 'approved' });
      rejectedRequests = await Review.countDocuments({ status: 'rejected' });
      pendingRequests = await Review.countDocuments({ status: 'pending' });
    }

    return NextResponse.json({
      totalRequests,
      approvedRequests,
      rejectedRequests,
      pendingRequests,
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

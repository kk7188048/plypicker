import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import { Review } from '@/models/Review';
import { decrypt } from '@/app/lib/utils';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Retrieve the session from the cookies
    const sessionCookie = cookies().get('session');
    console.log('Session Cookie:', sessionCookie); // Log the entire cookie object

    // Check if the session cookie exists and has a value
    if (!sessionCookie || !sessionCookie.value) {
      console.error('Session cookie is missing or undefined');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Decrypt the session to get the user info
    const session = await decrypt(sessionCookie.value);
    console.log('Decrypted Session:', session); // Log the decrypted session

    // Check if the session contains the expected properties
    if (!session || !session.email) {
      console.error('Decrypted session does not contain email:', session);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { email } = session;

    // Fetch stats for the logged-in user
    const totalRequests = await Review.countDocuments({ author: email });
    const approvedRequests = await Review.countDocuments({ author: email, status: 'approved' });
    const rejectedRequests = await Review.countDocuments({ author: email, status: 'rejected' });

    return NextResponse.json({
      totalRequests,
      approvedRequests,
      rejectedRequests,
    });
  } catch (error) {
    console.error('Error in GET request:', error); // Log the error
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
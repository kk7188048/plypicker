import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import { dbConnect } from "@/utils/mongoose";
import User from "@/models/User";

const secret = process.env.JWT_SECRET || "default_secret"; // Use a secure secret

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    console.log(body)

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log('Newly Hashed Password:', hashedPassword);
    console.log('Stored Hashed Password:', user.password);

    const match = await bcryptjs.compare(password, user.password);
    
    if (!match) {
      console.error('Invalid password for user:', email); // Log the user's email for security purposes
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    
    const tokenData = {
      id: user._id,
      username: user.username, // Ensure this field exists in your User model
      email: user.email,
    };

    const token = jwt.sign(tokenData, secret, { expiresIn: "1d" });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",  // Prevent CSRF
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      path: "/", // Set the cookie path
    });

    return response;
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ message: 'Error logging in user' }, { status: 500 });
  }
}
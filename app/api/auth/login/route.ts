import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"; // Change from bcryptjs to bcrypt
import { dbConnect } from "@/utils/mongoose";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const secret = process.env.JWT_SECRET;
  try {
    const { email, password } = await req.json();

    // Validate email and password
    if (!email || !password) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    await dbConnect();
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email' }, { status: 401 });
    }

    // Check if the password is correct
    try {
      const isPasswordValid = await bcrypt.compare(password, user.password, (err, result) => {
              result == true
        });
      // if (!isPasswordValid) {
      //   console.error('Invalid password for user:', email); // Log the user's email for security purposes
      //   return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
      // }
    } catch (error) {
      console.error('Error comparing password:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }

    const tokenData = {
      id: user._id,
      role: user.role,
      email: user.email,

    }

    const token = await jwt.sign(tokenData, secret, {expiresIn: "1d"})

    const response = NextResponse.json({
      message: "Login successful",
      success: token,
    })

    response.cookies.set("token", token, {
      httpOnly: true,
    })
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"; 
import { dbConnect } from "@/utils/mongoose";
import User from "@/app/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    // Validate email, password, and role
    if (!email || !password || !['admin', 'team member'].includes(role)) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    await dbConnect();

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt to hash the password
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();    

    const response = NextResponse.json({ message: "User registered successfully" });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
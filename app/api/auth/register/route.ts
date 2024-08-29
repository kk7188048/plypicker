import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { dbConnect } from "@/utils/mongoose";
import User from "@/models/User";
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { email, password, role } = body;

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();
    return NextResponse.json(savedUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}

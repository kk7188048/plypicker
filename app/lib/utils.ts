import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { dbConnect } from "@/utils/mongoose";
import User from "@/models/User"; // Define this Mongoose model

const secretKey = process.env.JWT_SECRET!;
export const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // Set the expiration time as needed
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


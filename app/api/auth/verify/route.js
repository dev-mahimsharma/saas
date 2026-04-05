import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { email, otpCode } = await req.json();

    if (!email || !otpCode) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: "User already verified", success: true }, { status: 200 });
    }

    if (user.otpCode !== otpCode) {
      return NextResponse.json({ message: "Invalid OTP code" }, { status: 400 });
    }

    if (user.otpExpires < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "User verified successfully", success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
}

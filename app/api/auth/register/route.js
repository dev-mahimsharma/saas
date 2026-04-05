import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await User.create({
      name,
      email,
      password: hashedPassword,
      otpCode,
      otpExpires,
      isVerified: false,
    });

    // Console log the OTP so it works locally without SMTP environment variables configured
    console.log(`\n\n----------------------------`);
    console.log(`Generated OTP for ${email}: ${otpCode}`);
    console.log(`----------------------------\n\n`);

    // In a real app, send email with Nodemailer here
    if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: '"bootNode" <noreply@bootnode.dev>',
        to: email,
        subject: "Your verification code",
        html: `Your verification code is <b>${otpCode}</b>`,
      });
    }

    return NextResponse.json({ message: "User registered, OTP generated", success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
}

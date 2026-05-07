import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { validateEmail, validatePassword, validateUserName } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, confirmPassword, otp } = await req.json();

    if (!name || !email || !password || !confirmPassword || !otp) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: "Passwords do not match" }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 400 });
    }

    if (!validateUserName(name)) {
      return NextResponse.json({ success: false, error: "Invalid name" }, { status: 400 });
    }

    // verify otp
    const otpEntry = await prisma.otp.findFirst({ where: { email, code: otp, purpose: "signup", used: false } });

    if (!otpEntry) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
    }

    if (new Date() > otpEntry.expiresAt) {
      return NextResponse.json({ success: false, error: "OTP expired" }, { status: 400 });
    }

    // create user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 409 });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({ data: { name, email, password: hashed, role: "USER" } });

    await prisma.otp.update({ where: { id: otpEntry.id }, data: { used: true } });

    const { password: _, ...userWithoutPassword } = user as any;

    return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

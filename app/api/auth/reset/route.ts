import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const otpEntry = await prisma.otp.findFirst({ where: { email, code: otp, purpose: "reset", used: false } });

    if (!otpEntry) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
    }

    if (new Date() > otpEntry.expiresAt) {
      return NextResponse.json({ success: false, error: "OTP expired" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { email }, data: { password: hashed } });
    await prisma.otp.update({ where: { id: otpEntry.id }, data: { used: true } });

    return NextResponse.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

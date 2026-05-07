import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, purpose } = await req.json();

    if (!email || !purpose) {
      return NextResponse.json({ success: false, error: "Email and purpose required" }, { status: 400 });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otp.create({
      data: {
        email,
        code,
        purpose,
        expiresAt,
      },
    });

    // Send email via Resend
    const resendKey = process.env.RESEND_API_KEY || "re_LximTxc2_EqQGTQPHiSzof1pFw1kMSkjs";

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "TeamFlow <onboarding@resend.dev>",
          to: email,
          subject: `Your OTP for TeamFlow (${purpose})`,
          html: `<p>Your verification code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
        }),
      });
    } catch (err) {
      console.error("Resend send error:", err);
      // do not fail the whole request if email sending fails
    }

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("OTP error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

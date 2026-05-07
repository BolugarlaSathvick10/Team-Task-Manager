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

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: false, error: "Resend API key not configured" }, { status: 500 });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    // Send email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: `Your OTP for TeamFlow (${purpose})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>TeamFlow Verification</h2>
            <p>Your verification code is:</p>
            <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${code}</span>
            </div>
            <p style="color: #666;">This code expires in 10 minutes.</p>
          </div>
        `,
      }),
    });

    const responseText = await resendResponse.text();
    let resendData: { id?: string; message?: string } = {};

    if (responseText) {
      try {
        resendData = JSON.parse(responseText) as { id?: string; message?: string };
      } catch {
        resendData = { message: responseText };
      }
    }

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      const resendMessage = String(resendData?.message || responseText || "Unknown error");
      const isDomainRestriction = resendResponse.status === 403 && /domain restriction|verify a domain|testing domain/i.test(resendMessage);
      const errorMessage = isDomainRestriction
        ? "Resend is blocking this email because the account is still using the testing domain. Verify your own domain in Resend, or test only with the account email allowed by Resend."
        : `Email sending failed: ${resendMessage}`;
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: resendResponse.status }
      );
    }

    await prisma.otp.create({
      data: {
        email,
        code,
        purpose,
        expiresAt,
      },
    });

    console.log("OTP sent successfully via Resend to:", email);

    return NextResponse.json({ success: true, message: "OTP sent", data: { id: resendData.id || null } });
  } catch (error) {
    console.error("OTP error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

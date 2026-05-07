import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, exists: false }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email } });
    return NextResponse.json({ success: true, exists: !!user });
  } catch (err) {
    console.error("check-email error:", err);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

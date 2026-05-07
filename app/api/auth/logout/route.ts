import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import type { ApiResponse } from "@/lib/types";

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
  try {
    await clearAuthCookie();

    return NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

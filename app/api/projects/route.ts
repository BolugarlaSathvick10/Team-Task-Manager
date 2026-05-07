import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { validateProjectTitle } from "@/lib/validations";
import type { ApiResponse, Project } from "@/lib/types";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Project[]>>> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany();

    return NextResponse.json(
      { success: true, data: projects as Project[] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<Project>>> {
  try {
    const currentUser = await getCurrentUser();

    // Only admin can create projects
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { title, description, deadline } = await req.json();

    // Validate input
    if (!validateProjectTitle(title)) {
      return NextResponse.json(
        { success: false, error: "Invalid project title" },
        { status: 400 }
      );
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: project as Project,
        message: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

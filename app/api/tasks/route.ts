import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { validateTaskTitle } from "@/lib/validations";
import type { ApiResponse, Task } from "@/lib/types";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Task[]>>> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const assignedToId = searchParams.get("assignedToId");

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (assignedToId) where.assignedToId = assignedToId;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        project: true,
      },
    });

    return NextResponse.json(
      { success: true, data: tasks as Task[] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    const currentUser = await getCurrentUser();

    // Only admin can create tasks
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { title, description, priority, dueDate, assignedToId, projectId } =
      await req.json();

    // Validate input
    if (!validateTaskTitle(title)) {
      return NextResponse.json(
        { success: false, error: "Invalid task title" },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId: assignedToId || null,
        projectId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        project: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: task as Task,
        message: "Task created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

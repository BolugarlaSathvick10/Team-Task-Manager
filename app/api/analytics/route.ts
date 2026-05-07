import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse } from "@/lib/types";

interface AnalyticsData {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  projectCompletionPercentage: number;
  tasksByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;
  projectStats: Array<{
    id: string;
    title: string;
    totalTasks: number;
    completedTasks: number;
    completionPercentage: number;
  }>;
}

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<AnalyticsData>>> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all data
    const [projects, tasks] = await Promise.all([
      prisma.project.findMany(),
      prisma.task.findMany(),
    ]);

    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (t: any) => t.status === "COMPLETED"
    ).length;
    const pendingTasks = tasks.filter(
      (t: any) => t.status === "PENDING"
    ).length;
    const inProgressTasks = tasks.filter(
      (t: any) => t.status === "IN_PROGRESS"
    ).length;

    const projectCompletionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const tasksByPriority: Record<string, number> = {
      LOW: tasks.filter((t: any) => t.priority === "LOW").length,
      MEDIUM: tasks.filter((t: any) => t.priority === "MEDIUM").length,
      HIGH: tasks.filter((t: any) => t.priority === "HIGH").length,
    };

    const tasksByStatus: Record<string, number> = {
      PENDING: pendingTasks,
      IN_PROGRESS: inProgressTasks,
      COMPLETED: completedTasks,
    };

    const projectStats = projects.map((project: any) => {
      const projectTasks = tasks.filter((t: any) => t.projectId === project.id);
      const completedProjectTasks = projectTasks.filter(
        (t: any) => t.status === "COMPLETED"
      ).length;
      const completionPercentage =
        projectTasks.length > 0
          ? Math.round((completedProjectTasks / projectTasks.length) * 100)
          : 0;

      return {
        id: project.id,
        title: project.title,
        totalTasks: projectTasks.length,
        completedTasks: completedProjectTasks,
        completionPercentage,
      };
    });

    const data: AnalyticsData = {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      projectCompletionPercentage,
      tasksByPriority,
      tasksByStatus,
      projectStats,
    };

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

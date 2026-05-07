"use client";

import { useEffect, useState } from "react";
import {
  FolderOpen,
  CheckCircle,
  Clock,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/Card";
import toast from "react-hot-toast";

interface AnalyticsData {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  projectCompletionPercentage: number;
  projectStats: Array<{
    id: string;
    title: string;
    totalTasks: number;
    completedTasks: number;
    completionPercentage: number;
  }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      } else {
        toast.error("Failed to load analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Error loading analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, Admin!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardBody className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 font-medium">Total Projects</h3>
              <FolderOpen className="text-blue-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {analytics?.totalProjects}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardBody className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 font-medium">Total Tasks</h3>
              <ListTodo className="text-purple-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {analytics?.totalTasks}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardBody className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 font-medium">Completed</h3>
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-green-900">
              {analytics?.completedTasks}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardBody className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 font-medium">Pending</h3>
              <Clock className="text-yellow-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-yellow-900">
              {analytics?.pendingTasks}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardBody className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 font-medium">Completion %</h3>
              <TrendingUp className="text-red-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-red-900">
              {analytics?.projectCompletionPercentage}%
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Project Stats */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">Project Progress</h2>
        </CardHeader>
        <CardBody>
          {analytics?.projectStats && analytics.projectStats.length > 0 ? (
            <div className="space-y-6">
              {analytics.projectStats.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {project.title}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {project.completedTasks}/{project.totalTasks}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${project.completionPercentage}%`,
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {project.completionPercentage}% Complete
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No projects yet</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

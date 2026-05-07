"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  ListTodo,
  FolderOpen,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/Card";
import toast from "react-hot-toast";
import type { Task, Project, User } from "@/lib/types";

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (!user) return;

      // Fetch tasks
      const tasksRes = await fetch(
        `/api/tasks?assignedToId=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const tasksData = await tasksRes.json();
      if (tasksData.success) {
        setTasks(tasksData.data);
      }

      // Fetch projects
      const projectsRes = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const projectsData = await projectsRes.json();
      if (projectsData.success) {
        setProjects(projectsData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completionPercentage =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

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
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardBody className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 font-medium">My Tasks</h3>
              <ListTodo className="text-purple-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {tasks.length}
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
              {completedTasks}
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
              {pendingTasks}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardBody className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 font-medium">Completion %</h3>
              <FolderOpen className="text-blue-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {completionPercentage}%
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{completedTasks} of {tasks.length} tasks completed</span>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
        </CardBody>
      </Card>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
        </CardHeader>
        <CardBody>
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      task.status === "COMPLETED"
                        ? "bg-green-500"
                        : task.status === "IN_PROGRESS"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      {task.status} • {task.priority} priority
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tasks assigned yet</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

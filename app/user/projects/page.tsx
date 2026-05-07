"use client";

import { useEffect, useState } from "react";
import { Calendar, FolderOpen } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/Card";
import toast from "react-hot-toast";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600 mt-2">
          {projects.length} project{projects.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                  {project.title}
                </h2>
              </CardHeader>
              <CardBody className="space-y-3">
                {project.description && (
                  <p className="text-gray-600 line-clamp-3">
                    {project.description}
                  </p>
                )}
                {project.deadline && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-sm">
                      Deadline:{" "}
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t text-sm text-gray-600">
                  <p>
                    Created:{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No projects available</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash, Calendar, FolderOpen } from "lucide-react";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input, TextArea } from "@/components/Input";
import { Modal } from "@/components/Modal";
import toast from "react-hot-toast";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });

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

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description || "",
        deadline: project.deadline
          ? new Date(project.deadline).toISOString().split("T")[0]
          : "",
      });
    } else {
      setEditingProject(null);
      setFormData({ title: "", description: "", deadline: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({ title: "", description: "", deadline: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Project title is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          editingProject
            ? "Project updated successfully"
            : "Project created successfully"
        );
        fetchProjects();
        handleCloseModal();
      } else {
        toast.error(data.error || "Failed to save project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Error saving project");
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Project deleted successfully");
        fetchProjects();
      } else {
        toast.error(data.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage all projects</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2"
          variant="primary"
        >
          <Plus size={20} /> New Project
        </Button>
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
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardBody>
              <CardFooter className="justify-between">
                <Button
                  onClick={() => handleOpenModal(project)}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Edit size={16} /> Edit
                </Button>
                <Button
                  onClick={() => handleDelete(project.id)}
                  variant="danger"
                  className="flex items-center gap-2"
                >
                  <Trash size={16} /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No projects yet</p>
            <Button
              onClick={() => handleOpenModal()}
              className="mt-4"
              variant="primary"
            >
              Create First Project
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? "Edit Project" : "Create New Project"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Title"
            placeholder="Enter project title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <TextArea
            label="Description"
            placeholder="Enter project description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
          />

          <Input
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
          />

          <div className="flex gap-2 justify-end">
            <Button onClick={handleCloseModal} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingProject ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

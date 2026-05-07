"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash, Flag } from "lucide-react";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input, TextArea, Select } from "@/components/Input";
import { Modal } from "@/components/Modal";
import toast from "react-hot-toast";
import type { Task, Project, User } from "@/lib/types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    projectId: "",
    assignedToId: "",
  });

  useEffect(() => {
    Promise.all([fetchTasks(), fetchProjects(), fetchUsers()]);
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

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
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.filter((u: User) => u.role === "USER"));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        projectId: task.projectId,
        assignedToId: task.assignedToId || "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
        projectId: "",
        assignedToId: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (!formData.projectId) {
      toast.error("Project is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
      const method = editingTask ? "PUT" : "POST";

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
          editingTask
            ? "Task updated successfully"
            : "Task created successfully"
        );
        fetchTasks();
        handleCloseModal();
      } else {
        toast.error(data.error || "Failed to save task");
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Error saving task");
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Task deleted successfully");
        fetchTasks();
      } else {
        toast.error(data.error || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.title || "N/A";
  };

  const getUserName = (userId?: string) => {
    if (!userId) return "Unassigned";
    return users.find((u) => u.id === userId)?.name || "N/A";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">Manage all tasks</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2"
          variant="primary"
        >
          <Plus size={20} /> New Task
        </Button>
      </div>

      {/* Tasks Table */}
      {tasks.length > 0 ? (
        <Card>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-gray-600 font-semibold">
                    <th className="pb-3 px-3">Title</th>
                    <th className="pb-3 px-3">Project</th>
                    <th className="pb-3 px-3">Assigned To</th>
                    <th className="pb-3 px-3">Priority</th>
                    <th className="pb-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3 font-medium text-gray-900">
                        {task.title}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {getProjectName(task.projectId)}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {getUserName(task.assignedToId)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 space-x-2">
                        <Button
                          onClick={() => handleOpenModal(task)}
                          variant="secondary"
                          className="text-xs py-1 px-2 inline-flex items-center gap-1"
                        >
                          <Edit size={14} /> Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(task.id)}
                          variant="danger"
                          className="text-xs py-1 px-2 inline-flex items-center gap-1"
                        >
                          <Trash size={14} /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <Flag size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No tasks yet</p>
            <Button
              onClick={() => handleOpenModal()}
              className="mt-4"
              variant="primary"
            >
              Create First Task
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <TextArea
            label="Description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
          />

          <Select
            label="Project"
            value={formData.projectId}
            onChange={(e) =>
              setFormData({ ...formData, projectId: e.target.value })
            }
            options={projects.map((p) => ({
              label: p.title,
              value: p.id,
            }))}
            required
          />

          <Select
            label="Assign To"
            value={formData.assignedToId}
            onChange={(e) =>
              setFormData({ ...formData, assignedToId: e.target.value })
            }
            options={users.map((u) => ({
              label: u.name,
              value: u.id,
            }))}
          />

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            options={[
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
            ]}
          />

          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />

          <div className="flex gap-2 justify-end">
            <Button onClick={handleCloseModal} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingTask ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

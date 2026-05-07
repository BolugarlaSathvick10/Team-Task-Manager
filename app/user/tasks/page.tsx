"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Edit } from "lucide-react";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/Card";
import { Button } from "@/components/Button";
import { Select } from "@/components/Input";
import { Modal } from "@/components/Modal";
import toast from "react-hot-toast";
import type { Task, User } from "@/lib/types";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (!user) return;

      const res = await fetch(`/api/tasks?assignedToId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task: Task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setNewStatus("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedTask) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Task updated successfully");
        fetchTasks();
        handleCloseModal();
      } else {
        toast.error(data.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const pendingTasks = tasks.filter((t) => t.status === "PENDING");

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600 mt-2">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} assigned
        </p>
      </div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <Card className="border-l-4 border-yellow-500">
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">
              Pending ({pendingTasks.length})
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleOpenModal(task)}
                      className="flex items-center gap-2"
                      variant="secondary"
                    >
                      <Edit size={16} /> Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* In Progress Tasks */}
      {inProgressTasks.length > 0 && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">
              In Progress ({inProgressTasks.length})
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleOpenModal(task)}
                      className="flex items-center gap-2"
                      variant="secondary"
                    >
                      <Edit size={16} /> Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card className="border-l-4 border-green-500">
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">
              Completed ({completedTasks.length})
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-through">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1 line-through">
                          {task.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <CheckCircle2 size={24} className="text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {tasks.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No tasks assigned yet</p>
          </CardBody>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Update Task Status"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {selectedTask?.title}
            </h3>
            {selectedTask?.description && (
              <p className="text-sm text-gray-600">{selectedTask.description}</p>
            )}
          </div>

          <Select
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Completed", value: "COMPLETED" },
            ]}
          />

          <div className="flex gap-2 justify-end">
            <Button onClick={handleCloseModal} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} variant="primary">
              Update Status
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

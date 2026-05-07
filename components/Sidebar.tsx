"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { User } from "@/lib/types";

export function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    {
      label: "Dashboard",
      href: user?.role === "ADMIN" ? "/admin" : "/user",
      icon: LayoutDashboard,
      show: true,
    },
    {
      label: "Projects",
      href: user?.role === "ADMIN" ? "/admin/projects" : "/user/projects",
      icon: FolderOpen,
      show: true,
    },
    {
      label: "My Tasks",
      href: "/user/tasks",
      icon: CheckSquare,
      show: user?.role === "USER",
    },
    {
      label: "Tasks",
      href: "/admin/tasks",
      icon: CheckSquare,
      show: user?.role === "ADMIN",
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
      show: user?.role === "ADMIN",
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-gray-100 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } z-40 md:z-0`}
      >
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-white">TeamFlow</h1>
            <p className="text-slate-400 text-sm mt-2">
              {user?.role === "ADMIN" ? "Admin Panel" : "User Dashboard"}
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              if (!item.show) return null;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-slate-700 pt-6">
            <div className="mb-4">
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors bg-slate-700"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

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
        className="fixed left-4 top-4 z-50 rounded-xl border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-md backdrop-blur md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-[17rem] border-r border-slate-700 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } z-40 md:z-0`}
      >
        <div className="space-y-8 p-6">
          {/* Logo */}
          <div className="mt-8">
            <h1 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-bold text-transparent">
              TeamFlow
            </h1>
            <p className="mt-2 text-sm text-slate-400">
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
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 ${
                    pathname === item.href
                      ? "bg-white/15 text-white shadow-inner"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    className={pathname === item.href ? "text-cyan-300" : "text-slate-400 group-hover:text-cyan-300"}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-slate-700 pt-6">
            <div className="mb-4">
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="truncate font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl bg-slate-700 px-4 py-3 hover:bg-red-600"
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

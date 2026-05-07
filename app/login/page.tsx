"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@teamflow.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrors({ submit: data.error || "Login failed" });
        toast.error(data.error || "Login failed");
        return;
      }

      // Store token and user
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      toast.success("Login successful!");

      // Redirect based on role
      if (data.data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">TeamFlow</h1>
            <p className="text-gray-600">Task Management Platform</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="admin@teamflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              variant="primary"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-8 border-t space-y-3">
            <p className="text-sm text-gray-600 font-medium">Demo Credentials:</p>
            <div className="space-y-2 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-semibold text-blue-900">Admin Account</p>
                <p className="text-blue-700">Email: admin@teamflow.com</p>
                <p className="text-blue-700">Password: admin123</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-semibold text-green-900">User Account</p>
                <p className="text-green-700">Email: user@teamflow.com</p>
                <p className="text-green-700">Password: user123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

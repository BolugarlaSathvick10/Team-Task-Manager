"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    if (!email) return toast.error("Enter email first");
    const res = await fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, purpose: "reset" }) });
    const data = await res.json();
    if (!data.success) return toast.error(data.error || "Could not send OTP");
    toast.success("OTP sent to your email");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp, newPassword }) });
      const data = await res.json();
      if (!data.success) return toast.error(data.error || "Reset failed");
      toast.success("Password reset successful. Login with new password.");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Reset password</h2>
          </div>

          <form onSubmit={handleReset} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="flex gap-2">
              <Input label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <div className="flex flex-col justify-end">
                <Button type="button" onClick={requestOtp} className="h-10">Get OTP</Button>
              </div>
            </div>
            <Input label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />

            <div className="flex items-center justify-between">
              <a href="/login" className="text-sm text-gray-600">Back to login</a>
              <Button type="submit" disabled={loading} variant="primary">{loading ? "Resetting..." : "Reset password"}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

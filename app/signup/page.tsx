"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const requestOtp = async () => {
    if (!email) return toast.error("Enter email first");
    const res = await fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, purpose: "signup" }) });
    const data = await res.json();
    if (!data.success) return toast.error(data.error || "Could not send OTP");
    toast.success("OTP sent to your email");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password, confirmPassword, otp }) });
      const data = await res.json();
      if (!data.success) return toast.error(data.error || "Signup failed");
      toast.success("Signup successful. You can now login.");
      router.push("/login");
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
            <h2 className="text-2xl font-bold">Create an account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="flex gap-2">
              <Input label="Password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Input label="Confirm" type="password" placeholder="Confirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <div className="flex gap-2">
              <Input label="OTP" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <div className="flex flex-col justify-end">
                <Button type="button" onClick={requestOtp} className="h-10">Get OTP</Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <a href="/login" className="text-sm text-gray-600">Back to login</a>
              <Button type="submit" disabled={loading} variant="primary">{loading ? "Signing up..." : "Sign up"}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

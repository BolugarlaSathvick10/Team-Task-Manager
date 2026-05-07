"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import toast from "react-hot-toast";

type Mode = "login" | "signup" | "forgot";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [signupSuccess, setSignupSuccess] = useState(false);

  // common
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // login
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // signup
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [signupOtp, setSignupOtp] = useState("");

  // forgot
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
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
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      toast.success("Login successful!");
      if (data.data.user.role === "ADMIN") router.push("/admin");
      else router.push("/user");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP: request OTP then submit
  const requestSignupOtp = async () => {
    if (!email) return toast.error("Enter email first");
    const res = await fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, purpose: "signup" }) });
    const data = await res.json();
    if (!data.success) return toast.error(data.error || "Could not send OTP");
    toast.success("OTP sent to your email");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password, confirmPassword, otp: signupOtp }) });
      const data = await res.json();
      if (!data.success) return toast.error(data.error || "Signup failed");
      toast.success("Signup successful. You can now login.");
      setSignupSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally { setLoading(false); }
  };

  // FORGOT: check email -> request otp -> reset
  const checkEmailExists = async () => {
    if (!email) return toast.error("Enter email first");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/check-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!data.success) return toast.error(data.error || "Check failed");
      setIsExistingUser(!!data.exists);
      if (!data.exists) toast.error("Email not found");
      else toast.success("Email verified. You can request OTP.");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally { setLoading(false); }
  };

  const requestForgotOtp = async () => {
    if (!email) return toast.error("Enter email first");
    const res = await fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, purpose: "reset" }) });
    const data = await res.json();
    if (!data.success) return toast.error(data.error || "Could not send OTP");
    toast.success("OTP sent to your email");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isExistingUser) return toast.error("Please verify your email first");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp: forgotOtp, newPassword }) });
      const data = await res.json();
      if (!data.success) return toast.error(data.error || "Reset failed");
      toast.success("Password reset successful. Please login.");
      setMode("login");
      setEmail("");
      setPassword("");
      setIsExistingUser(null);
      setForgotOtp("");
      setNewPassword("");
      setShowNewPassword(false);
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
            <h1 className="text-3xl font-bold text-blue-600 mb-1">TeamFlow</h1>
            <p className="text-gray-600">Task Management Platform</p>
          </div>

          {/* Mode tabs (Login / Sign up only - forgot accessed via link) */}
          <div className="flex gap-2 mb-4 bg-white rounded-xl p-1">
            <button
              className={`flex-1 py-2 rounded-xl font-semibold transition-shadow ${mode === "login" ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow" : "bg-white text-gray-700"}`}
              onClick={() => {
                setMode("login");
                setEmail("");
                setPassword("");
                setSignupSuccess(false);
              }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-xl font-semibold transition-shadow ${mode === "signup" ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow" : "bg-white text-gray-700"}`}
              onClick={() => {
                setMode("signup");
                setSignupSuccess(false);
              }}
            >
              Sign up
            </button>
          </div>

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              {errors.submit && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{errors.submit}</div>}
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-4 py-3 border rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3C6 3 2.73 5.11 1 8.5 2.73 11.89 6 14 10 14s7.27-2.11 9-5.5C17.27 5.11 14 3 10 3zM10 12a3 3 0 110-6 3 3 0 010 6z"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <a className="text-sm text-green-600 hover:underline cursor-pointer" onClick={() => setMode('forgot')}>Forgot password?</a>
              </div>
              <div className="mt-4">
                <button type="submit" disabled={loading} className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-green-400 to-green-600 shadow-lg font-semibold">{loading ? "Logging in..." : "Login"}</button>
              </div>
              <div className="text-center text-sm text-gray-600 mt-2">Or use Sign up in this box</div>
            </form>
          )}

          {mode === "signup" && !signupSuccess && (
            <form onSubmit={handleSignup} className="space-y-4">
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input label="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="flex-1">
                  <Input label="Confirm" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OTP</label>
                <div className="flex gap-2 items-center">
                  <input value={signupOtp} onChange={(e) => setSignupOtp(e.target.value)} placeholder="Enter OTP" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-transparent" />
                  <Button type="button" variant="success" onClick={requestSignupOtp} className="px-4 py-1 whitespace-nowrap">Get OTP</Button>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button type="submit" disabled={loading} variant="success" className="px-12 py-3">{loading ? "Signing up..." : "Sign up"}</Button>
              </div>
            </form>
          )}

          {mode === "signup" && signupSuccess && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">✓ Account created successfully!</p>
                <p className="text-sm">You can now login with your credentials.</p>
              </div>
              <div className="flex justify-center">
                <Button type="button" variant="success" onClick={() => {
                  setMode("login");
                  setEmail("");
                  setPassword("");
                  setName("");
                  setConfirmPassword("");
                  setSignupOtp("");
                  setShowPassword(false);
                  setShowConfirm(false);
                  setSignupSuccess(false);
                }} className="px-12 py-3">Back to login</Button>
              </div>
            </div>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleReset} className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setIsExistingUser(null); }} required />

              <div className="flex gap-2 items-center">
                <Button type="button" variant="success" onClick={checkEmailExists} className="px-6">Verify Email</Button>
                <div className="flex-1 text-sm text-gray-600">{isExistingUser === null ? "" : isExistingUser ? "✓ User found" : "✗ User not found"}</div>
              </div>

              {isExistingUser && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">OTP</label>
                    <div className="flex gap-2 items-center">
                      <input value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} placeholder="Enter OTP" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-transparent" />
                      <Button type="button" variant="success" onClick={requestForgotOtp} className="px-4 py-1 whitespace-nowrap">Get OTP</Button>
                    </div>
                  </div>

                  <div>
                    <Input label="New password" type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <button type="button" className="text-sm text-gray-600 hover:underline cursor-pointer" onClick={() => {
                      setMode("login");
                      setEmail("");
                      setIsExistingUser(null);
                      setForgotOtp("");
                      setNewPassword("");
                      setShowNewPassword(false);
                    }}>Back to login</button>
                    <Button type="submit" disabled={loading} variant="success" className="px-8">{loading ? "Resetting..." : "Reset password"}</Button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t space-y-2">
            <p className="text-sm text-gray-600 font-medium">Demo Credentials:</p>
            <div className="flex gap-3 text-sm">
              <div className="flex-1 bg-blue-50 p-3 rounded-lg">
                <p className="font-semibold text-blue-900">Admin Account</p>
                <p className="text-blue-700">Email: admin@teamflow.com</p>
                <p className="text-blue-700">Password: admin123</p>
              </div>
              <div className="flex-1 bg-green-50 p-3 rounded-lg">
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

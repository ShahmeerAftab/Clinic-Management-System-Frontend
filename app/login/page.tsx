"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // JWT lives in an httpOnly cookie set by the server — only save display info here
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", data.role || role);
      if (data.name) localStorage.setItem("userName", data.name);

      router.push("/" + (data.role || role));
    } catch (err) {
      setError("Something went wrong, try again");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const roles = [
    { value: "admin", label: "Admin", icon: "🛡️" },
    { value: "doctor", label: "Doctor", icon: "⚕️" },
    { value: "receptionist", label: "Receptionist", icon: "🗂️" },
    { value: "patient", label: "Patient", icon: "🏥" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex w-[45%] relative flex-col items-center justify-center p-16 overflow-hidden bg-sidebar">
        {/* Decorative glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-aq/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-80px] right-[-60px] w-96 h-96 rounded-full bg-aq/8 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-aq/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center text-white max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-aq/20 border border-aq/30 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-aq"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V7a1 1 0 011-1z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight">
            MediCare Pro
          </h1>
          <p className="mt-2 text-aq/80 text-lg font-medium">
            Clinic Management System
          </p>
          <p className="mt-5 text-white/50 text-sm leading-relaxed">
            Manage appointments, patient records, billing, and your entire
            clinic team — all in one place.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 divide-x divide-white/10 border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
            <div className="py-5">
              <p className="text-2xl font-bold text-aq">500+</p>
              <p className="text-white/40 text-xs mt-1">Clinics</p>
            </div>
            <div className="py-5">
              <p className="text-2xl font-bold text-aq">2k+</p>
              <p className="text-white/40 text-xs mt-1">Doctors</p>
            </div>
            <div className="py-5">
              <p className="text-2xl font-bold text-aq">50k+</p>
              <p className="text-white/40 text-xs mt-1">Patients</p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex justify-center gap-5 text-white/40 text-xs">
            <span className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-aq"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              HIPAA Compliant
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-aq"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              256-bit Encrypted
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-aq"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              99.9% Uptime
            </span>
          </div>

          {/* Link to landing */}
          <Link
            href="/"
            className="mt-10 block text-xs text-white/30 hover:text-aq transition-colors"
          >
            Back to homepage &rarr;
          </Link>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F5F5] px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-sidebar flex items-center justify-center">
            <svg
              className="w-5 h-5 text-aq"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V7a1 1 0 011-1z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-ink">MediCare Pro</span>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-ink">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to your clinic account
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* Role selector */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Sign in as
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        role === r.value
                          ? "bg-aq-faint border-aq text-ink ring-1 ring-aq"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <span>{r.icon}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="sr-only"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-ink mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aq focus:border-aq/50 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-ink"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-aq-darker hover:text-aq-dark transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-aq focus-within:border-aq/50 transition-all">
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm text-ink placeholder-gray-400 bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="px-3.5 text-xs font-semibold text-aq-darker hover:text-ink bg-gray-50 border-l border-gray-200 shrink-0 transition-colors"
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-aq-darker"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  <svg
                    className="w-5 h-5 shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-ink bg-aq hover:bg-aq-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-aq focus:ring-offset-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in&hellip;
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="mt-6 space-y-2 text-center">
              <p className="text-sm text-gray-500">
                New to MediCare Pro?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-aq-darker hover:text-aq-dark transition-colors"
                >
                  Create an account
                </Link>
              </p>
              <p className="text-xs text-gray-400">
                Need access?{" "}
                <a
                  href="#"
                  className="font-medium text-aq-darker hover:text-aq-dark transition-colors"
                >
                  Contact your administrator
                </a>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            &copy; 2026 MediCare Pro &middot; HIPAA Compliant &middot; Secure
            Login
          </p>
        </div>
      </div>
    </div>
  );
}

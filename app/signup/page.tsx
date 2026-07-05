"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ROLES = [
  { value: "patient",      label: "Patient",      icon: "🏥", description: "Book appointments & view records" },
  { value: "doctor",       label: "Doctor",       icon: "⚕️", description: "Manage patients & prescriptions"   },
  { value: "receptionist", label: "Receptionist", icon: "🗂️", description: "Handle appointments & check-ins"   },
  { value: "admin",        label: "Admin",        icon: "🛡️", description: "Full clinic access & settings"     },
];

export default function SignupPage() {
  const router = useRouter();

  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [role,        setRole]        = useState("patient");
  const [showPwd,     setShowPwd]     = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState("");
  const [step,        setStep]        = useState<1 | 2>(1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim())          return setError("Please enter your full name.");
    if (!email.trim())         return setError("Please enter your email address.");
    if (password.length < 6)  return setError("Password must be at least 6 characters.");
    if (password !== confirm)  return setError("Passwords do not match.");

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex w-[45%] relative flex-col items-center justify-center p-16 overflow-hidden bg-sidebar">

        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-aq/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full bg-aq/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-white text-center max-w-xs">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-aq/20 border border-aq/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-aq" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V7a1 1 0 011-1z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight">MediCare Pro</h1>
          <p className="mt-2 text-aq/80 text-lg font-medium">Create your account</p>
          <p className="mt-4 text-white/50 text-sm leading-relaxed">
            Join thousands of healthcare professionals managing their clinics smarter.
          </p>

          <ul className="mt-10 space-y-3 text-left">
            {[
              "Manage patients & appointments",
              "Real-time analytics & insights",
              "Secure HIPAA-compliant platform",
              "Works on any device, anywhere",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                <svg className="w-4 h-4 text-aq shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs text-white/30">
            Already have an account?{" "}
            <Link href="/login" className="text-aq font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F5F5] px-5 py-12">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-sidebar flex items-center justify-center">
            <svg className="w-5 h-5 text-aq" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V7a1 1 0 011-1z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-ink">MediCare Pro</span>
        </div>

        <div className="w-full max-w-[460px]">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-ink">Create account</h2>
              <p className="text-gray-500 text-sm mt-1">
                {step === 1 ? "Step 1 of 2 — Choose your role" : "Step 2 of 2 — Your details"}
              </p>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-aq to-aq-dark rounded-full transition-all duration-500"
                  style={{ width: step === 1 ? "50%" : "100%" }}
                />
              </div>
            </div>

            {/* Step 1 — Role selection */}
            {step === 1 && (
              <div className="space-y-5">
                <p className="text-sm font-semibold text-ink">I am a&hellip;</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                        role === r.value
                          ? "bg-aq-faint border-aq ring-1 ring-aq"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-2xl leading-none">{r.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold ${role === r.value ? "text-ink" : "text-gray-800"}`}>
                          {r.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{r.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-ink bg-aq hover:bg-aq-dark active:scale-[0.98] transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-aq focus:ring-offset-2"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2 — Details */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Back */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-aq-darker transition-colors mb-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Change role
                </button>

                {/* Selected role badge */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-aq-faint border border-aq/30">
                  <span className="text-lg">{ROLES.find((r) => r.value === role)?.icon}</span>
                  <span className="text-sm font-semibold text-ink">
                    Signing up as: {ROLES.find((r) => r.value === role)?.label}
                  </span>
                </div>

                {/* Full name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-ink mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Ali Hassan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-aq focus:border-aq/50 transition-all placeholder-gray-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@clinic.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-aq focus:border-aq/50 transition-all placeholder-gray-400"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-ink mb-1.5">
                    Password
                  </label>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-aq focus-within:border-aq/50 transition-all">
                    <input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      required
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-sm text-ink placeholder-gray-400 bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="px-3.5 text-xs font-semibold text-aq-darker hover:text-ink bg-gray-50 border-l border-gray-200 shrink-0 transition-colors"
                    >
                      {showPwd ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label htmlFor="confirm" className="block text-sm font-semibold text-ink mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    id="confirm"
                    type={showPwd ? "text" : "password"}
                    required
                    placeholder="Re-enter password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm border rounded-xl text-ink focus:outline-none focus:ring-2 focus:border-aq/50 transition-all placeholder-gray-400 ${
                      confirm && confirm !== password
                        ? "border-rose-300 bg-rose-50 focus:ring-rose-300"
                        : "border-gray-200 focus:ring-aq"
                    }`}
                  />
                  {confirm && confirm !== password && (
                    <p className="text-xs text-rose-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-ink bg-aq hover:bg-aq-dark disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-aq focus:ring-offset-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating account&hellip;
                    </span>
                  ) : "Create Account"}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-aq-darker hover:text-aq-dark transition-colors">
                    Sign in
                  </Link>
                </p>

              </form>
            )}

          </div>

          <p className="mt-5 text-center text-xs text-gray-400">
            &copy; 2026 MediCare Pro &middot; HIPAA Compliant &middot; Secure Platform
          </p>
        </div>
      </div>

    </div>
  );
}

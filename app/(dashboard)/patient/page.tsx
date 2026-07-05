"use client";

/**
 * Patient Dashboard — fully dynamic
 *
 * Fetches stats and today's appointments from the backend on load.
 * Shows: upcoming count, health records, prescriptions, today's visits.
 */

import { formatDate } from "@/frontend/lib/utils";
import { usePatientDashboard } from "@/frontend/lib/hooks/useStats";
import type { Appointment } from "@/frontend/types";

// ─── Stat card component ─────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-aq/30 transition-all">
      <div className="w-10 h-10 rounded-xl bg-aq-faint text-aq-darker flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-2xl font-bold text-ink tracking-tight">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      <p className="text-xs font-medium text-gray-400 mt-1.5">{sub}</p>
    </div>
  );
}

// ─── Skeleton loader for a stat card ─────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-gray-100 mb-4" />
      <div className="h-7 w-16 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-28 bg-gray-100 rounded mb-1.5" />
      <div className="h-3 w-20 bg-gray-100 rounded" />
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Scheduled: "bg-aq-faint text-aq-darker border-aq/30",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const dots: Record<string, string> = {
    Scheduled: "bg-aq",
    Completed: "bg-emerald-500",
    Cancelled: "bg-rose-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full border ${styles[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? "bg-gray-400"}`} />
      {status}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PatientDashboard() {
  const { data: stats, isLoading: loading, isError } = usePatientDashboard();

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Health Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back! Here is your health summary at a glance.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-aq-faint text-aq-darker text-xs font-semibold rounded-full border border-aq/30 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-aq animate-pulse inline-block" />
          Live data
        </span>
      </div>

      {/* ── Error ── */}
      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 text-sm text-rose-700 font-medium">
          Failed to load dashboard data. Please try again.
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Upcoming Appointments"
              value={stats?.upcomingCount ?? 0}
              sub="Scheduled visits"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard
              label="Health Records"
              value={stats?.recordsCount ?? 0}
              sub="Medical documents"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatCard
              label="Prescriptions"
              value={stats?.prescriptionsCount ?? 0}
              sub="Active & past"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
            />
            <StatCard
              label="Today's Visits"
              value={stats?.todayAppointments.length ?? 0}
              sub={new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </>
        )}
      </div>

      {/* ── Today's appointments ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">Today&apos;s Appointments</h2>
            <p className="text-xs text-gray-400 mt-0.5">Your scheduled visits for today</p>
          </div>
          {!loading && (
            <span className="text-xs font-semibold text-aq-darker bg-aq-faint px-2.5 py-1 rounded-full border border-aq/20">
              {stats?.todayAppointments.length ?? 0} today
            </span>
          )}
        </div>

        {loading ? (
          <div className="px-6 py-8 space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-40" />
                  <div className="h-3 bg-gray-100 rounded w-28" />
                </div>
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : !stats || stats.todayAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-4 gap-2">
            <div className="w-12 h-12 rounded-2xl bg-aq-faint flex items-center justify-center mb-1">
              <svg className="w-6 h-6 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">No appointments today</p>
            <p className="text-xs text-gray-400">Go to Appointments to book your next visit.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {(stats.todayAppointments as unknown as Appointment[]).map((appt) => (
              <div key={appt._id} className="flex items-center gap-4 px-6 py-4 hover:bg-aq-faint/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-aq-faint flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{appt.doctor}</p>
                  <p className="text-xs text-gray-500">{appt.reason || "General visit"}</p>
                </div>
                <div className="text-right shrink-0 mr-2">
                  <p className="text-xs font-semibold text-ink">{formatDate(appt.date)}</p>
                  <p className="text-xs text-gray-500 font-mono">{appt.time}</p>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Book an Appointment",  href: "/patient/appointments", icon: "📅", color: "bg-aq-faint text-aq-darker border-aq/20" },
          { label: "View Health Records",  href: "/patient/records",      icon: "📋", color: "bg-violet-50 text-violet-700 border-violet-200" },
          { label: "My Prescriptions",     href: "/patient/prescriptions",icon: "💊", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border font-semibold text-sm transition-all hover:shadow-md ${link.color}`}
          >
            <span className="text-xl">{link.icon}</span>
            {link.label}
            <svg className="w-4 h-4 ml-auto opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>

    </div>
  );
}

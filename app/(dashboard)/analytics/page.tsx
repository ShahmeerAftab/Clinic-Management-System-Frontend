"use client";

/**
 * Analytics Page
 * -------------
 * Fetches real data from two APIs:
 *   1. /api/dashboard/stats  → summary counts (no auth header needed)
 *   2. /api/appointment      → full appointment list (JWT required)
 *
 * From the appointment list we compute:
 *   - Status breakdown  (Scheduled / Completed / Cancelled)
 *   - Per-doctor counts (bar chart)
 *   - This-week trend   (bar chart, last 7 days)
 */

import { useDashboardStats } from "@/lib/hooks/useStats";
import { useAllAppointments } from "@/lib/hooks/useAppointments";
import type { Appointment } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

// ─── Data helpers ────────────────────────────────────────────────────────────

/**
 * Groups appointments by doctor name and returns an array sorted by count desc.
 * e.g. [{ doctor: "Dr. Ahmed", count: 12 }, ...]
 */
function getPerDoctorData(appts: Appointment[]) {
  const map: Record<string, number> = {};
  for (const a of appts) {
    const name = a.doctor?.trim() || "Unknown";
    map[name] = (map[name] || 0) + 1;
  }
  return Object.entries(map)
    .map(([doctor, count]) => ({ doctor, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Builds a 7-entry array for the last 7 days (oldest → today).
 * Each entry has a short day label and the count of appointments on that date.
 */
function getWeeklyData(appts: Appointment[]) {
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  // Build one slot per day, from 6 days ago up to today
  const slots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return { day: DAY_NAMES[d.getDay()], dateStr: d.toDateString(), count: 0 };
  });

  // Tally appointments into the matching slot
  for (const a of appts) {
    const apptDateStr = new Date(a.date).toDateString();
    const slot = slots.find((s) => s.dateStr === apptDateStr);
    if (slot) slot.count++;
  }

  // Strip the internal dateStr before passing to Recharts
  return slots.map(({ day, count }) => ({ day, count }));
}

// ─── Small reusable stat card ─────────────────────────────────────────────────

function StatCard({
  label,
  value,
  loading,
  icon,
  accent = "bg-aq-faint text-aq-darker",
}: {
  label: string;
  value?: number;
  loading: boolean;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-aq/30 transition-all">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${accent}`}>
        {icon}
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse mb-1" />
      ) : (
        <p className="text-2xl font-bold text-ink tracking-tight">{value ?? "—"}</p>
      )}
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

// ─── Skeleton for chart panels ───────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="flex items-end justify-around gap-3 h-40 px-2">
      {[60, 85, 40, 95, 55, 75, 30].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-gray-100 rounded-t-lg animate-pulse"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

// ─── Custom Recharts tooltip ─────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-md rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-ink mb-0.5">{label}</p>
      <p className="text-aq-darker font-bold">{payload[0].value} appointments</p>
    </div>
  );
}

// ─── Main page component ─────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { data: stats,        isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: appointments = [], isLoading: apptLoading,  isError: apptError  } = useAllAppointments();

  const error = (statsError || apptError) ? "Could not load some data. Please refresh." : "";

  // ── Derived / computed values ──────────────────────────────────────────────

  // Count each status from the appointment array
  const scheduled = appointments.filter((a) => a.status === "Scheduled").length;
  const completed = appointments.filter((a) => a.status === "Completed").length;
  const cancelled = appointments.filter((a) => a.status === "Cancelled").length;

  // Chart datasets (computed once appointments are loaded)
  const perDoctorData = getPerDoctorData(appointments);
  const weeklyData    = getWeeklyData(appointments);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-aq-faint text-aq-darker text-xs font-semibold rounded-full border border-aq/30 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-aq animate-pulse inline-block" />
          Live Data
        </span>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* ── Summary stat cards ── */}
      {/* Row 1: patient + appointment totals from the stats API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          label="Total Patients"
          value={stats?.totalPatients}
          loading={statsLoading}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        <StatCard
          label="Appointments Today"
          value={stats?.todaysAppointments}
          loading={statsLoading}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        {/* Status counts come from the appointment array, so use apptLoading */}
        <StatCard
          label="Scheduled"
          value={scheduled}
          loading={apptLoading}
          accent="bg-aq-faint text-aq-darker"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          label="Completed"
          value={completed}
          loading={apptLoading}
          accent="bg-emerald-50 text-emerald-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Row 2: Cancelled + total appointments (more spacing from status row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Cancelled"
          value={cancelled}
          loading={apptLoading}
          accent="bg-rose-50 text-rose-500"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Appointments"
          value={stats?.totalAppointments}
          loading={statsLoading}
          accent="bg-violet-50 text-violet-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Bar chart — appointments per doctor */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-ink mb-1">Appointments by Doctor</h2>
          <p className="text-xs text-gray-400 mb-5">Total appointments handled per doctor</p>

          {apptLoading ? (
            <ChartSkeleton />
          ) : perDoctorData.length === 0 ? (
            // Empty state
            <div className="h-40 flex flex-col items-center justify-center gap-2 text-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm text-gray-400">No appointment data available</p>
            </div>
          ) : (
            /* ResponsiveContainer fills the parent width automatically */
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={perDoctorData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                {/* Light horizontal guide lines */}
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />

                {/* X-axis: doctor names — truncate long names so they fit */}
                <XAxis
                  dataKey="doctor"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: string) =>
                    v.length > 10 ? v.slice(0, 10) + "…" : v
                  }
                />

                {/* Y-axis: appointment count */}
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                />

                {/* Our custom tooltip (defined above) */}
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#E8FFF8" }} />

                {/* The actual bars — aqua fill matching brand color */}
                <Bar
                  dataKey="count"
                  fill="#7FFFD4"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Line chart — appointments trend this week */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-ink mb-1">Appointments This Week</h2>
          <p className="text-xs text-gray-400 mb-5">Last 7 days — daily count</p>

          {apptLoading ? (
            <ChartSkeleton />
          ) : weeklyData.every((d) => d.count === 0) ? (
            <div className="h-40 flex flex-col items-center justify-center gap-2 text-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-sm text-gray-400">No appointments in the last 7 days</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={weeklyData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={() => "Appointments"}
                  wrapperStyle={{ fontSize: 10, color: "#6b7280" }}
                />
                {/* Smooth curved line in brand aqua */}
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#5BCDB5"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#7FFFD4", strokeWidth: 2, stroke: "#5BCDB5" }}
                  activeDot={{ r: 6, fill: "#3BA898" }}
                  name="Appointments"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Status breakdown — visual pill bars ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-ink mb-1">Appointment Status Breakdown</h2>
        <p className="text-xs text-gray-400 mb-5">Proportion of each status across all appointments</p>

        {apptLoading ? (
          // Skeleton for the status bars
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n}>
                <div className="flex justify-between mb-1.5">
                  <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No data available</p>
        ) : (
          <div className="space-y-4">
            {[
              { label: "Scheduled", count: scheduled, color: "from-aq to-aq-dark" },
              { label: "Completed", count: completed, color: "from-emerald-400 to-emerald-500" },
              { label: "Cancelled", count: cancelled, color: "from-rose-400 to-rose-500" },
            ].map(({ label, count, color }) => {
              // Percentage of total appointments
              const pct = appointments.length > 0
                ? Math.round((count / appointments.length) * 100)
                : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-700 font-medium">{label}</span>
                    <span className="text-sm font-semibold text-ink">
                      {count}
                      <span className="text-xs text-gray-400 font-normal ml-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
                      style={{ width: `${pct}%`, minWidth: pct > 0 ? 8 : 0 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Info banner ── */}
      <div className="bg-aq-faint border border-aq/20 rounded-2xl px-5 py-4 flex items-center gap-3">
        <svg className="w-5 h-5 text-aq-darker shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-aq-darker font-medium">
          All data is fetched live from the database. Add more appointments to see the charts fill in.
        </p>
      </div>

    </div>
  );
}

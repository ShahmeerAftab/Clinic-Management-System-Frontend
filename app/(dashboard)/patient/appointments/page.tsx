"use client";

/**
 * Patient Appointments Page — fully dynamic
 *
 * Features:
 *  - View all appointments (sorted: Scheduled first, then by date)
 *  - Book a new appointment via a slide-in form
 *  - Cancel a Scheduled appointment
 *  - Summary cards showing counts by status
 */

import { useState } from "react";
import { useToast } from "@/frontend/components/ui/Toast";
import { useMyAppointments, useBookAppointment, useCancelAppointment } from "@/frontend/lib/hooks/useAppointments";
import { useDoctors } from "@/frontend/lib/hooks/useDoctors";
import { formatDate, getInitials, getErrorMessage } from "@/frontend/lib/utils";
import type { Appointment, AppointmentStatus } from "@/frontend/types";

// Sort: Scheduled first → then Completed/Cancelled, newest date first
function sortAppointments(list: Appointment[]): Appointment[] {
  return [...list].sort((a, b) => {
    if (a.status === "Scheduled" && b.status !== "Scheduled") return -1;
    if (a.status !== "Scheduled" && b.status === "Scheduled") return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// ─── Status badge ─────────────────────────────────────────────────────────────
const statusStyle: Record<AppointmentStatus, { badge: string; dot: string }> = {
  Scheduled: { badge: "bg-aq-faint text-aq-darker border-aq/30",        dot: "bg-aq"         },
  Completed: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  Cancelled: { badge: "bg-rose-50 text-rose-700 border-rose-200",       dot: "bg-rose-400"   },
};

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const s = statusStyle[status] ?? { badge: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ─── Time slot options ────────────────────────────────────────────────────────
const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

// ─── Booking form component ───────────────────────────────────────────────────
function BookingForm({
  onSubmit,
  onCancel,
  submitting,
  doctors,
}: {
  onSubmit: (data: { doctorId: string; doctor: string; date: string; time: string; reason: string }) => void;
  onCancel: () => void;
  submitting: boolean;
  doctors: { _id: string; name: string; specialization?: string }[];
}) {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate]         = useState("");
  const [time, setTime]         = useState("");
  const [reason, setReason]     = useState("");

  const inputCls =
    "w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-ink " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-aq focus:border-aq/50 focus:bg-white transition-all";
  const labelCls = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const selected = doctors.find((d) => d._id === doctorId);
    onSubmit({
      doctorId,
      doctor: selected ? selected.name : doctorId,
      date,
      time,
      reason,
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-lg">
      <div className="h-1 bg-gradient-to-r from-aq to-aq-dark" />
      <div className="p-7">
        {/* Form header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-aq-faint flex items-center justify-center">
            <svg className="w-5 h-5 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-ink">Book an Appointment</h3>
            <p className="text-xs text-gray-400">Fill in the details below to book your visit.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Doctor dropdown */}
          <div>
            <label className={labelCls}>Select Doctor <span className="text-rose-500">*</span></label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className={inputCls}
              required
            >
              <option value="">-- Choose a doctor --</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}{d.specialization ? ` — ${d.specialization}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Date and time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date <span className="text-rose-500">*</span></label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} // no past dates
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Time <span className="text-rose-500">*</span></label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputCls}
                required
              >
                <option value="">Select time</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className={labelCls}>Reason for Visit</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe the reason for your visit…"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-ink bg-aq hover:bg-aq-dark disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-aq focus:ring-offset-2"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Booking…
                </span>
              ) : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PatientAppointments() {
  const toast = useToast();

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data: rawAppointments = [], isLoading: loading } = useMyAppointments();
  const { data: doctors         = []                     } = useDoctors();
  const bookMutation   = useBookAppointment();
  const cancelMutation = useCancelAppointment();

  const [showForm, setShowForm] = useState(false);

  const appointments = sortAppointments(rawAppointments);

  // Book a new appointment
  function handleBook(formData: { doctorId: string; doctor: string; date: string; time: string; reason: string }) {
    bookMutation.mutate(formData, {
      onSuccess: () => { setShowForm(false); toast.success("Appointment booked successfully!"); },
      onError:   (err) => toast.error(getErrorMessage(err, "Booking failed.")),
    });
  }

  // Cancel an appointment
  function handleCancel(id: string) {
    if (!confirm("Cancel this appointment?")) return;
    cancelMutation.mutate(id, {
      onSuccess: () => toast.success("Appointment cancelled."),
      onError:   () => toast.error("Could not cancel appointment."),
    });
  }

  // Summary counts
  const total     = appointments.length;
  const scheduled = appointments.filter((a) => a.status === "Scheduled").length;
  const completed = appointments.filter((a) => a.status === "Completed").length;
  const cancelled = appointments.filter((a) => a.status === "Cancelled").length;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Appointments</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage all your scheduled visits.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-aq hover:bg-aq-dark text-ink text-sm font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Book Appointment
          </button>
        )}
      </div>

      {/* ── Booking form ── */}
      {showForm && (
        <BookingForm
          onSubmit={handleBook}
          onCancel={() => setShowForm(false)}
          submitting={bookMutation.isPending}
          doctors={doctors}
        />
      )}

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total",     value: total,     color: "text-ink",         bg: "bg-white" },
          { label: "Scheduled", value: scheduled, color: "text-aq-darker",   bg: "bg-aq-faint" },
          { label: "Completed", value: completed, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Cancelled", value: cancelled, color: "text-rose-700",    bg: "bg-rose-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-gray-100 shadow-sm`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Appointment list ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-aq to-aq-dark" />
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <p className="font-semibold text-ink">Appointment History</p>
          <span className="text-xs text-gray-400">{total} records</span>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-50 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-40" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-aq-faint flex items-center justify-center">
              <svg className="w-6 h-6 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">No appointments yet</p>
            <p className="text-xs text-gray-400">Click &quot;Book Appointment&quot; above to schedule your first visit.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  {["Doctor", "Date", "Time", "Reason", "Status", "Action"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((appt) => {
                  const initials = getInitials(appt.doctor);

                  return (
                    <tr key={appt._id} className="hover:bg-aq-faint/40 transition-colors">

                      {/* Doctor */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-aq-faint flex items-center justify-center text-[10px] font-bold text-aq-darker shrink-0">
                            {initials}
                          </div>
                          <span className="font-medium text-ink">{appt.doctor}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(appt.date)}
                      </td>

                      {/* Time */}
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        {appt.time}
                      </td>

                      {/* Reason */}
                      <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">
                        {appt.reason || "—"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={appt.status} />
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        {appt.status === "Scheduled" && (
                          <button
                            onClick={() => handleCancel(appt._id)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

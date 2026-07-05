"use client";

/**
 * Patient Prescriptions Page — fully dynamic
 *
 * Shows all prescriptions issued to the logged-in patient.
 * Patients can only VIEW prescriptions (doctors create them).
 */

import { usePrescriptions } from "@/frontend/lib/hooks/usePrescriptions";
import { formatDate } from "@/frontend/lib/utils";
import type { Prescription, Medicine } from "@/frontend/types";

// ─── Medicine chip ─────────────────────────────────────────────────────────────
function MedicineChip({ med }: { med: Medicine }) {
  return (
    <div className="bg-aq-faint border border-aq/20 rounded-xl px-3 py-2">
      <p className="text-xs font-bold text-ink">{med.name}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{med.dose} · {med.duration}</p>
    </div>
  );
}

// ─── Prescription card ─────────────────────────────────────────────────────────
function PrescriptionCard({ rx }: { rx: Prescription }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-aq/30 transition-all">
      <div className="h-1 bg-gradient-to-r from-aq to-aq-dark" />
      <div className="p-5">

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-aq-faint flex items-center justify-center text-lg shrink-0">
              💊
            </div>
            <div>
              <p className="text-sm font-bold text-ink">{rx.doctor}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(rx.date)}</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-aq-darker bg-aq-faint px-2.5 py-1 rounded-full border border-aq/20">
            {rx.medicines.length} {rx.medicines.length === 1 ? "medicine" : "medicines"}
          </span>
        </div>

        {/* Medicines list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {rx.medicines.map((med, i) => (
            <MedicineChip key={i} med={med} />
          ))}
        </div>

        {/* Notes */}
        {rx.notes && (
          <div className="border-t border-gray-50 pt-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Doctor&apos;s Notes</p>
            <p className="text-sm text-gray-600">{rx.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-1 bg-gray-100" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100" />
          <div className="space-y-1.5">
            <div className="h-4 bg-gray-100 rounded w-32" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-12 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PatientPrescriptions() {
  const { data: prescriptions = [], isLoading: loading, isError } = usePrescriptions();

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Prescriptions</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Prescriptions issued by your doctors.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-aq-faint text-aq-darker text-xs font-semibold rounded-full border border-aq/30 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-aq animate-pulse inline-block" />
          {prescriptions.length} prescriptions
        </span>
      </div>

      {/* ── Error ── */}
      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 text-sm text-rose-700 font-medium">
          Failed to load prescriptions.
        </div>
      )}

      {/* ── Prescription cards ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center px-4 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-aq-faint flex items-center justify-center text-2xl">💊</div>
          <p className="text-sm font-semibold text-gray-700">No prescriptions yet</p>
          <p className="text-xs text-gray-400">
            Your doctor will add prescriptions after your consultations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {prescriptions.map((rx) => (
            <PrescriptionCard key={rx._id} rx={rx} />
          ))}
        </div>
      )}

      {/* ── Info ── */}
      <div className="bg-aq-faint border border-aq/20 rounded-2xl px-5 py-4 flex items-center gap-3">
        <svg className="w-5 h-5 text-aq-darker shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-aq-darker font-medium">
          Always follow your doctor&apos;s instructions. Contact the clinic if you have questions about your prescription.
        </p>
      </div>

    </div>
  );
}

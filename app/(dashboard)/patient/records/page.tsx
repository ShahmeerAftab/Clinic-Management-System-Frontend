"use client";

/**
 * Patient Health Records Page — fully dynamic
 *
 * Fetches the patient's own health records from the backend.
 * Supports filtering by record type.
 * Records are READ-ONLY for patients (doctors/admin create them).
 */

import { useState } from "react";
import { useHealthRecords } from "@/frontend/lib/hooks/useHealthRecords";
import { formatDate } from "@/frontend/lib/utils";
import type { HealthRecord, RecordType } from "@/frontend/types";

// ─── Style map by record type ─────────────────────────────────────────────────
const typeStyles: Record<
  RecordType,
  { badge: string; iconBg: string; icon: string }
> = {
  "Lab Report":        { badge: "bg-aq-faint text-aq-darker border-aq/30",           iconBg: "bg-aq-faint",   icon: "🧪" },
  "Imaging":           { badge: "bg-violet-50 text-violet-700 border-violet-200",    iconBg: "bg-violet-50",  icon: "🩻" },
  "Prescription":      { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", iconBg: "bg-emerald-50", icon: "💊" },
  "Discharge Summary": { badge: "bg-amber-50 text-amber-700 border-amber-200",       iconBg: "bg-amber-50",   icon: "📋" },
  "Other":             { badge: "bg-gray-50 text-gray-600 border-gray-200",          iconBg: "bg-gray-50",    icon: "📄" },
};

const ALL_TYPES: RecordType[] = [
  "Lab Report", "Imaging", "Prescription", "Discharge Summary", "Other",
];

// ─── Record card ──────────────────────────────────────────────────────────────
function RecordCard({ record }: { record: HealthRecord }) {
  const [expanded, setExpanded] = useState(false);
  const style = typeStyles[record.type] ?? typeStyles["Other"];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:border-aq/30 transition-all">

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl ${style.iconBg} flex items-center justify-center text-xl shrink-0`}>
          {style.icon}
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style.badge} whitespace-nowrap`}>
          {record.type}
        </span>
      </div>

      {/* Title + hospital */}
      <div>
        <p className="font-semibold text-ink leading-snug">{record.title}</p>
        {record.hospital && (
          <p className="text-xs text-gray-400 mt-1">{record.hospital}</p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-50 pt-3 flex items-center justify-between text-xs">
        <div>
          <p className="font-medium text-gray-700">{record.doctor}</p>
          <p className="text-gray-400 mt-0.5">{formatDate(record.visitDate)}</p>
        </div>
        {(record.diagnosis || record.notes) && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-1.5 text-aq-darker hover:text-ink font-semibold transition-colors"
          >
            {expanded ? "Less" : "Details"}
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Expandable details */}
      {expanded && (record.diagnosis || record.notes) && (
        <div className="border-t border-gray-50 pt-3 space-y-2">
          {record.diagnosis && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Diagnosis</p>
              <p className="text-sm text-gray-700">{record.diagnosis}</p>
            </div>
          )}
          {record.notes && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Notes</p>
              <p className="text-sm text-gray-600">{record.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-gray-100" />
        <div className="h-6 w-24 bg-gray-100 rounded-full" />
      </div>
      <div>
        <div className="h-4 bg-gray-100 rounded w-48 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-32" />
      </div>
      <div className="border-t border-gray-50 pt-3 flex justify-between">
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-100 rounded w-28" />
          <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PatientHealthRecords() {
  const { data: records = [], isLoading: loading, isError } = useHealthRecords();
  const [activeType, setActiveType] = useState<RecordType | "All">("All");

  // Apply type filter
  const filtered =
    activeType === "All"
      ? records
      : records.filter((r) => r.type === activeType);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Health Records</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Your complete medical history and health documents.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-aq-faint text-aq-darker text-xs font-semibold rounded-full border border-aq/30 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-aq animate-pulse inline-block" />
          {records.length} documents
        </span>
      </div>

      {/* ── Error ── */}
      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 text-sm text-rose-700 font-medium">
          Failed to load health records.
        </div>
      )}

      {/* ── Type filter ── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveType("All")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            activeType === "All"
              ? "bg-sidebar text-aq"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({records.length})
        </button>
        {ALL_TYPES.map((type) => {
          const count = records.filter((r) => r.type === type).length;
          if (count === 0) return null;
          const s = typeStyles[type];
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeType === type
                  ? `${s.badge} ring-2 ring-offset-1 ring-current`
                  : `${s.badge} opacity-70 hover:opacity-100`
              }`}
            >
              {s.icon} {type} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Records grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center px-4 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-aq-faint flex items-center justify-center text-2xl">📋</div>
          <p className="text-sm font-semibold text-gray-700">No records found</p>
          <p className="text-xs text-gray-400">
            {activeType === "All"
              ? "Your doctor will add health records after your visits."
              : `No ${activeType} records yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((record) => (
            <RecordCard key={record._id} record={record} />
          ))}
        </div>
      )}

      {/* ── Info ── */}
      <div className="bg-aq-faint border border-aq/20 rounded-2xl px-5 py-4 flex items-center gap-3">
        <svg className="w-5 h-5 text-aq-darker shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-aq-darker font-medium">
          Health records are added by your doctor after each visit. Contact the clinic if a record is missing.
        </p>
      </div>

    </div>
  );
}

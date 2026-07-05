"use client";

/**
 * Doctor Health Records Page
 *
 * Features:
 *  - Select a patient from the database
 *  - Fill in record details and save to MongoDB
 *  - View all health records in a grid
 *  - Delete a record
 */

import { useState } from "react";
import { useToast } from "@/frontend/components/ui/Toast";
import { useHealthRecords, useCreateHealthRecord, useDeleteHealthRecord } from "@/frontend/lib/hooks/useHealthRecords";
import { useAllPatients } from "@/frontend/lib/hooks/usePatients";
import { formatDate, getInitials, getErrorMessage } from "@/frontend/lib/utils";
import type { HealthRecord, RecordType } from "@/frontend/types";

// ─── Record type options ──────────────────────────────────────────────────────
const RECORD_TYPES: RecordType[] = [
  "Lab Report", "Imaging", "Prescription", "Discharge Summary", "Other",
];

const typeStyles: Record<RecordType, { badge: string; icon: string }> = {
  "Lab Report":        { badge: "bg-aq-faint text-aq-darker border-aq/30",           icon: "🧪" },
  "Imaging":           { badge: "bg-violet-50 text-violet-700 border-violet-200",    icon: "🩻" },
  "Prescription":      { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "💊" },
  "Discharge Summary": { badge: "bg-amber-50 text-amber-700 border-amber-200",       icon: "📋" },
  "Other":             { badge: "bg-gray-50 text-gray-600 border-gray-200",          icon: "📄" },
};

function getPatientName(patientId: HealthRecord["patientId"]): string {
  if (typeof patientId === "object" && patientId !== null) return patientId.name;
  return "Unknown Patient";
}

// ─── Health Record Card ───────────────────────────────────────────────────────
function RecordCard({ record, onDelete }: { record: HealthRecord; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const style = typeStyles[record.type] ?? typeStyles["Other"];
  const patientName = getPatientName(record.patientId);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-aq/30 transition-all flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-aq-faint flex items-center justify-center text-xs font-bold text-aq-darker shrink-0">
            {getInitials(patientName)}
          </div>
          <div>
            <p className="font-semibold text-ink text-sm">{patientName}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(record.visitDate)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.badge}`}>
            {style.icon} {record.type}
          </span>
          <button
            onClick={() => onDelete(record._id)}
            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <p className="font-semibold text-ink leading-snug">{record.title}</p>
        {record.hospital && <p className="text-xs text-gray-400 mt-0.5">{record.hospital}</p>}
        <p className="text-xs text-gray-500 mt-1">Dr. {record.doctor}</p>
      </div>

      {(record.diagnosis || record.notes) && (
        <div>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-1.5 text-xs font-semibold text-aq-darker hover:text-ink transition-colors"
          >
            {expanded ? "Hide details" : "View details"}
            <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expanded && (
            <div className="mt-3 border-t border-gray-50 pt-3 space-y-2">
              {record.diagnosis && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Diagnosis</p>
                  <p className="text-sm text-gray-700">{record.diagnosis}</p>
                </div>
              )}
              {record.notes && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Notes</p>
                  <p className="text-sm text-gray-600">{record.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DoctorHealthRecordsPage() {
  const toast = useToast();

  // ── Data ────────────────────────────────────────────────────────────────
  const { data: records  = [], isLoading } = useHealthRecords();
  const { data: patients = []            } = useAllPatients();
  const createMutation = useCreateHealthRecord();
  const deleteMutation = useDeleteHealthRecord();

  // ── Form state ───────────────────────────────────────────────────────────
  const [patientId,  setPatientId]  = useState("");
  const [title,      setTitle]      = useState("");
  const [type,       setType]       = useState<RecordType>("Lab Report");
  const [doctorName, setDoctorName] = useState(
    typeof window !== "undefined" ? (localStorage.getItem("userName") ?? "") : ""
  );
  const [hospital,   setHospital]   = useState("");
  const [visitDate,  setVisitDate]  = useState(new Date().toISOString().split("T")[0]);
  const [diagnosis,  setDiagnosis]  = useState("");
  const [notes,      setNotes]      = useState("");

  const inputCls = "w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-aq focus:border-aq/50 focus:bg-white transition-all";
  const labelCls = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate(
      { patientId: patientId || patients[0]?._id, title, type, doctor: doctorName, hospital, visitDate, diagnosis, notes },
      {
        onSuccess: () => {
          setTitle(""); setHospital(""); setDiagnosis(""); setNotes("");
          setVisitDate(new Date().toISOString().split("T")[0]);
          toast.success("Health record added successfully!");
        },
        onError: (err) => toast.error(getErrorMessage(err, "Failed to create health record.")),
      }
    );
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this health record? This cannot be undone.")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Record deleted."),
      onError:   () => toast.error("Could not delete record."),
    });
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Health Records</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage patient health records.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-aq-faint text-aq-darker text-xs font-semibold rounded-full border border-aq/30 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-aq animate-pulse inline-block" />
          {records.length} records
        </span>
      </div>

      {/* Add record form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-aq to-aq-dark" />
        <div className="p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-aq-faint flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Add Health Record</h3>
              <p className="text-xs text-gray-400">Fill in the details to create a new record.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
              <svg className="w-5 h-5 animate-spin text-aq-darker" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm">Loading patients…</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Patient <span className="text-rose-500">*</span></label>
                  <select value={patientId || patients[0]?._id || ""} onChange={(e) => setPatientId(e.target.value)} className={inputCls} required>
                    {patients.length === 0 && <option value="">No patients found</option>}
                    {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Doctor Name <span className="text-rose-500">*</span></label>
                  <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="e.g. Dr. Sarah Mitchell" className={inputCls} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Record Title <span className="text-rose-500">*</span></label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Complete Blood Count" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Record Type <span className="text-rose-500">*</span></label>
                  <select value={type} onChange={(e) => setType(e.target.value as RecordType)} className={inputCls} required>
                    {RECORD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Hospital / Clinic</label>
                  <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} placeholder="e.g. City General Hospital" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Visit Date <span className="text-rose-500">*</span></label>
                  <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className={inputCls} required />
                </div>
              </div>

              <div>
                <label className={labelCls}>Diagnosis / Findings</label>
                <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Mild iron-deficiency anemia." rows={2} className={`${inputCls} resize-none`} />
              </div>

              <div>
                <label className={labelCls}>Additional Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Follow-up in 4 weeks." rows={2} className={`${inputCls} resize-none`} />
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending || patients.length === 0}
                className="w-full sm:w-auto px-8 py-2.5 rounded-xl text-sm font-bold text-ink bg-aq hover:bg-aq-dark disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm"
              >
                {createMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving…
                  </span>
                ) : "Save Health Record"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Records grid */}
      <div>
        <h2 className="text-base font-semibold text-ink mb-4">
          All Records <span className="ml-2 text-sm font-normal text-gray-400">({records.length})</span>
        </h2>
        {records.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center px-4 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-aq-faint flex items-center justify-center text-xl">📋</div>
            <p className="text-sm font-semibold text-gray-700">No health records yet</p>
            <p className="text-xs text-gray-400">Use the form above to add the first record.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((record) => (
              <RecordCard key={record._id} record={record} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

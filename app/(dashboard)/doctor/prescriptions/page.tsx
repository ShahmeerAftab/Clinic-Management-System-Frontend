"use client";

/**
 * Doctor Prescriptions Page — fully dynamic
 *
 * Features:
 *  - Select patient from the database
 *  - Add multiple medicines per prescription (name, dose, duration)
 *  - Add optional notes
 *  - Save prescription to MongoDB via the API
 *  - View all issued prescriptions
 *  - Delete a prescription
 */

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { usePrescriptions, useCreatePrescription, useDeletePrescription } from "@/lib/hooks/usePrescriptions";
import { useAllPatients } from "@/lib/hooks/usePatients";
import { formatDate, getInitials, getErrorMessage } from "@/lib/utils";
import type { Prescription, Medicine } from "@/types";

function getPatientName(patientId: Prescription["patientId"]): string {
  if (typeof patientId === "object" && patientId !== null) return patientId.name;
  return "Unknown Patient";
}

// ─── Empty medicine row ───────────────────────────────────────────────────────
function emptyMed(): Medicine {
  return { name: "", dose: "", duration: "" };
}

// ─── Medicine row inside the form ─────────────────────────────────────────────
function MedicineRow({
  med,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  med: Medicine;
  index: number;
  onChange: (i: number, field: keyof Medicine, value: string) => void;
  onRemove: (i: number) => void;
  canRemove: boolean;
}) {
  const inputCls =
    "w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-ink " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-aq focus:border-aq/50 focus:bg-white transition-all";

  return (
    <div className="flex items-start gap-2 p-3 bg-gray-50/60 border border-gray-100 rounded-xl">
      {/* Index badge */}
      <div className="w-6 h-6 rounded-full bg-aq-faint text-aq-darker text-[11px] font-bold flex items-center justify-center shrink-0 mt-2">
        {index + 1}
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="text"
          value={med.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          placeholder="Medicine name *"
          className={inputCls}
          required
        />
        <input
          type="text"
          value={med.dose}
          onChange={(e) => onChange(index, "dose", e.target.value)}
          placeholder="Dose (e.g. 1 tab twice) *"
          className={inputCls}
          required
        />
        <input
          type="text"
          value={med.duration}
          onChange={(e) => onChange(index, "duration", e.target.value)}
          placeholder="Duration (e.g. 7 days) *"
          className={inputCls}
          required
        />
      </div>

      {/* Remove button */}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mt-1.5 w-7 h-7 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center shrink-0 transition-colors"
          title="Remove medicine"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Prescription card (in the issued list) ───────────────────────────────────
function PrescriptionCard({
  rx,
  onDelete,
}: {
  rx: Prescription;
  onDelete: (id: string) => void;
}) {
  const patientName = getPatientName(rx.patientId);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-aq/30 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-aq-faint flex items-center justify-center text-xs font-bold text-aq-darker shrink-0">
            {getInitials(patientName)}
          </div>
          <div>
            <p className="font-semibold text-ink">{patientName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(rx.date)}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(rx._id)}
          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors"
          title="Delete prescription"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Medicines */}
      <div className="space-y-2 mb-3">
        {rx.medicines.map((med, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="w-5 h-5 rounded-full bg-aq-faint text-aq-darker text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div>
              <span className="font-semibold text-ink">{med.name}</span>
              <span className="text-gray-500 ml-2">— {med.dose} · {med.duration}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {rx.notes && (
        <div className="border-t border-gray-50 pt-3">
          <p className="text-xs text-gray-500 italic">{rx.notes}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DoctorPrescriptionsPage() {
  const toast = useToast();

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data: prescriptions = [], isLoading } = usePrescriptions();
  const { data: patients      = []            } = useAllPatients();
  const createMutation = useCreatePrescription();
  const deleteMutation = useDeletePrescription();

  // ── Form state ───────────────────────────────────────────────────────────────
  const [selectedPatient, setSelectedPatient] = useState("");
  const [doctorName,      setDoctorName]      = useState(
    typeof window !== "undefined" ? (localStorage.getItem("userName") ?? "") : ""
  );
  const [date,      setDate]      = useState(new Date().toISOString().split("T")[0]);
  const [medicines, setMedicines] = useState<Medicine[]>([emptyMed()]);
  const [notes,     setNotes]     = useState("");

  // ── Medicine row handlers ────────────────────────────────────────────────────

  function handleMedicineChange(i: number, field: keyof Medicine, value: string) {
    setMedicines((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], [field]: value };
      return updated;
    });
  }

  function addMedicineRow()        { setMedicines((prev) => [...prev, emptyMed()]); }
  function removeMedicineRow(i: number) { setMedicines((prev) => prev.filter((_, idx) => idx !== i)); }

  // ── Submit form ──────────────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validMeds = medicines.filter((m) => m.name && m.dose && m.duration);
    if (validMeds.length === 0) {
      toast.error("Please add at least one medicine with all fields filled.");
      return;
    }

    createMutation.mutate(
      { patientId: selectedPatient || patients[0]?._id, doctor: doctorName, date, medicines: validMeds, notes },
      {
        onSuccess: () => {
          setMedicines([emptyMed()]);
          setNotes("");
          setDate(new Date().toISOString().split("T")[0]);
          toast.success("Prescription issued successfully!");
        },
        onError: (err) => toast.error(getErrorMessage(err, "Failed to issue prescription.")),
      }
    );
  }

  // ── Delete prescription ──────────────────────────────────────────────────────

  function handleDelete(id: string) {
    if (!confirm("Delete this prescription? This cannot be undone.")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Prescription deleted."),
      onError:   () => toast.error("Could not delete prescription."),
    });
  }

  // ── Input styles ─────────────────────────────────────────────────────────────
  const inputCls =
    "w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-ink " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-aq focus:border-aq/50 focus:bg-white transition-all";
  const labelCls = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Prescriptions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Issue digital prescriptions to your patients.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-aq-faint text-aq-darker text-xs font-semibold rounded-full border border-aq/30 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-aq animate-pulse inline-block" />
          {prescriptions.length} total
        </span>
      </div>

      {/* ── Prescription form ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-aq to-aq-dark" />
        <div className="p-7">

          {/* Form header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-aq-faint flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">New Prescription</h3>
              <p className="text-xs text-gray-400">Fill in the details below to issue a prescription.</p>
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

              {/* Patient + Doctor row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Patient <span className="text-rose-500">*</span></label>
                  <select
                    value={selectedPatient || patients[0]?._id || ""}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className={inputCls}
                    required
                  >
                    {patients.length === 0 && (
                      <option value="">No patients found</option>
                    )}
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Doctor Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Mitchell"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              {/* Date */}
              <div className="max-w-xs">
                <label className={labelCls}>Date <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              {/* Medicines section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls}>
                    Medicines <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-gray-400">
                    {medicines.length} {medicines.length === 1 ? "entry" : "entries"}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Column headers (desktop) */}
                  <div className="hidden sm:grid sm:grid-cols-3 gap-2 px-9">
                    {["Medicine Name", "Dose", "Duration"].map((h) => (
                      <p key={h} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                        {h}
                      </p>
                    ))}
                  </div>

                  {medicines.map((med, i) => (
                    <MedicineRow
                      key={i}
                      med={med}
                      index={i}
                      onChange={handleMedicineChange}
                      onRemove={removeMedicineRow}
                      canRemove={medicines.length > 1}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addMedicineRow}
                  className="mt-3 flex items-center gap-2 text-sm font-semibold text-aq-darker hover:text-ink transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add another medicine
                </button>
              </div>

              {/* Notes */}
              <div>
                <label className={labelCls}>Doctor&apos;s Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Take after meals. Avoid alcohol. Come back in 7 days if no improvement."
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={createMutation.isPending || patients.length === 0}
                className="w-full sm:w-auto px-8 py-2.5 rounded-xl text-sm font-bold text-ink bg-aq hover:bg-aq-dark disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-aq focus:ring-offset-2"
              >
                {createMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Issuing…
                  </span>
                ) : "Issue Prescription"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Issued prescriptions list ── */}
      <div>
        <h2 className="text-base font-semibold text-ink mb-4">
          Issued Prescriptions
          <span className="ml-2 text-sm font-normal text-gray-400">({prescriptions.length})</span>
        </h2>

        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center px-4 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-aq-faint flex items-center justify-center">
              <svg className="w-6 h-6 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">No prescriptions issued yet</p>
              <p className="text-xs text-gray-400 mt-1">Use the form above to issue your first prescription.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prescriptions.map((rx) => (
              <PrescriptionCard key={rx._id} rx={rx} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

"use client";

import { useState } from "react";
import type { PopulatedPatient } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/Modal";
import {
  useAllAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from "@/lib/hooks/useAppointments";
import { useAllPatients } from "@/lib/hooks/usePatients";
import { useDoctors } from "@/lib/hooks/useDoctors";
import AppointmentList from "./AppointmentList";
import AppointmentForm from "./AppointmentForm";

type Mode = "list" | "book";

export default function AppointmentManager({}: { role: string }) {
  const toast = useToast();

  // ── Data (TanStack Query) ─────────────────────────────────────────────────
  const { data: appointments = [] } = useAllAppointments();
  const { data: patients     = [] } = useAllPatients();
  const { data: doctors      = [] } = useDoctors();
  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();
  const deleteMutation = useDeleteAppointment();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [mode,         setMode]        = useState<Mode>("list");
  const [editingId,    setEditingId]   = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [formPatient,  setFormPatient]  = useState("");
  const [formDob,      setFormDob]      = useState("");
  const [formDoctor,   setFormDoctor]   = useState("");
  const [formDoctorId, setFormDoctorId] = useState("");
  const [formDate,     setFormDate]     = useState("");
  const [formTime,     setFormTime]     = useState("");
  const [formReason,   setFormReason]   = useState("");
  const [formStatus,   setFormStatus]   = useState<"Scheduled" | "Cancelled">("Scheduled");
  const [patientError, setPatientError] = useState("");

  function clearForm() {
    setFormPatient(""); setFormDob(""); setFormDoctor(""); setFormDoctorId(""); setFormDate("");
    setFormTime(""); setFormReason(""); setFormStatus("Scheduled");
    setPatientError(""); setEditingId(null);
  }

  function openBook()   { clearForm(); setMode("book"); }
  function backToList() { clearForm(); setMode("list"); }

  function handleEditOpen(id: string) {
    const appt = appointments.find((a) => a._id === id);
    if (!appt) return;
    setFormPatient(
      typeof appt.patientID === "object" && appt.patientID !== null
        ? appt.patientID._id
        : appt.patientID ?? ""
    );
    setFormDoctor(appt.doctor);
    setFormDoctorId(appt.doctorId ?? "");
    setFormDate(appt.date);
    setFormTime(appt.time);
    setFormReason(appt.reason);
    setFormStatus(appt.status === "Cancelled" ? "Cancelled" : "Scheduled");
    setEditingId(id);
    setMode("book");
  }

  // ── Book / Edit ───────────────────────────────────────────────────────────
  function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!formPatient) { setPatientError("Please select a patient from the list."); return; }
    setPatientError("");

    const payload = {
      patientID: formPatient,
      doctorId: formDoctorId || undefined,
      doctor: formDoctor,
      date: formDate,
      time: formTime,
      reason: formReason,
      status: formStatus,
    };

    if (editingId !== null) {
      updateMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => { clearForm(); setMode("list"); toast.success("Appointment updated."); },
          onError:   () => toast.error("Could not update appointment."),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { clearForm(); setMode("list"); toast.success("Appointment booked successfully."); },
        onError:   () => toast.error("Could not book appointment."),
      });
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  function requestDelete(id: string) { setDeleteTarget(id); }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget, {
      onSuccess: () => { toast.success("Appointment deleted."); setDeleteTarget(null); },
      onError:   () => { toast.error("Could not delete appointment."); setDeleteTarget(null); },
    });
  }

  // ── Mark completed ────────────────────────────────────────────────────────
  function updateStatus(id: string) {
    const appt = appointments.find((a) => a._id === id);
    if (!appt || appt.status !== "Scheduled") return;

    updateMutation.mutate(
      {
        id,
        data: {
          ...appt,
          status: "Completed",
          patientID:
            typeof appt.patientID === "object" && appt.patientID !== null
              ? (appt.patientID as PopulatedPatient)._id
              : appt.patientID,
        },
      },
      {
        onSuccess: () => toast.success("Appointment marked as completed."),
        onError:   () => toast.error("Could not update appointment status."),
      }
    );
  }

  const sortedAppointments = [...appointments].sort((a, b) => {
    const aS = a.status === "Scheduled", bS = b.status === "Scheduled";
    if (aS && !bS) return -1;
    if (!aS && bS) return 1;
    if (aS && bS) return new Date(a.date).getTime() - new Date(b.date).getTime();
    return 0;
  });

  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <ConfirmModal
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Delete Appointment"
        description="This will permanently remove the appointment. This cannot be undone."
        confirmLabel="Delete Appointment"
        danger
      />

      {mode === "list" && (
        <AppointmentList
          appointments={sortedAppointments}
          patients={patients}
          onBook={openBook}
          onEdit={handleEditOpen}
          onDelete={requestDelete}
          onUpdateStatus={updateStatus}
        />
      )}

      {mode === "book" && (
        <AppointmentForm
          editingId={editingId}
          patients={patients}
          doctors={doctors}
          formPatient={formPatient}
          formDob={formDob}
          formDoctor={formDoctor}
          formDoctorId={formDoctorId}
          formDate={formDate}
          formTime={formTime}
          formReason={formReason}
          formStatus={formStatus}
          patientError={patientError}
          submitting={submitting}
          onPatientChange={(id, dob) => { setFormPatient(id); setFormDob(dob); if (id) setPatientError(""); }}
          onDoctorChange={(name, id) => { setFormDoctor(name); setFormDoctorId(id); }}
          onDateChange={setFormDate}
          onTimeChange={setFormTime}
          onReasonChange={setFormReason}
          onStatusChange={setFormStatus}
          onSubmit={handleBook}
          onCancel={backToList}
        />
      )}
    </>
  );
}

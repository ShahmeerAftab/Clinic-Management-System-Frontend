"use client";

import type { Patient } from "@/frontend/types";
import { useToast } from "@/frontend/components/ui/Toast";
import { ConfirmModal } from "@/frontend/components/ui/Modal";
import { SectionLoader } from "@/frontend/components/ui/Spinner";
import { getErrorMessage } from "@/frontend/lib/utils";
import { useState } from "react";
import {
  useAllPatients,
  useCreatePatient,
  useUpdatePatient,
  useDeletePatient,
} from "@/frontend/lib/hooks/usePatients";
import PatientList from "./PatientList";
import PatientForm from "./PatientForm";
import PatientView from "./PatientView";

type Mode = "list" | "add" | "edit" | "view";

export default function PatientManager({ role }: { role: string }) {
  const toast = useToast();

  // ── Data (TanStack Query handles loading, caching, and re-fetching) ──────────
  const { data: patients = [], isLoading, error } = useAllPatients();
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();

  // ── UI state (not data — just what's on screen) ───────────────────────────
  const [mode,            setMode]            = useState<Mode>("list");
  const [searchQuery,     setSearchQuery]     = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formError,       setFormError]       = useState<string | null>(null);
  const [deleteTarget,    setDeleteTarget]    = useState<string | null>(null);

  const [formName,    setFormName]    = useState("");
  const [formAge,     setFormAge]     = useState("");
  const [formGender,  setFormGender]  = useState("Male");
  const [formContact, setFormContact] = useState("");

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function clearForm() {
    setFormName(""); setFormAge(""); setFormGender("Male"); setFormContact("");
    setSelectedPatient(null); setFormError(null);
  }

  function openAdd()            { clearForm(); setMode("add"); }
  function openEdit(p: Patient) {
    setSelectedPatient(p);
    setFormName(p.name); setFormAge(p.age); setFormGender(p.gender); setFormContact(p.contact);
    setMode("edit");
  }
  function openView(p: Patient) { setSelectedPatient(p); setMode("view"); }
  function backToList()         { clearForm(); setMode("list"); }

  // ── Add ───────────────────────────────────────────────────────────────────
  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    createMutation.mutate(
      { name: formName, age: formAge, gender: formGender, contact: formContact, createdBy: role },
      {
        onSuccess: () => { clearForm(); setMode("list"); toast.success("Patient added successfully."); },
        onError:   (err) => { const msg = getErrorMessage(err, "Could not save patient."); setFormError(msg); toast.error(msg); },
      }
    );
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    updateMutation.mutate(
      { id: selectedPatient!._id, data: { name: formName, age: formAge, gender: formGender, contact: formContact } },
      {
        onSuccess: () => { clearForm(); setMode("list"); toast.success("Patient updated successfully."); },
        onError:   (err) => { const msg = getErrorMessage(err, "Could not update patient."); setFormError(msg); toast.error(msg); },
      }
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  function requestDelete(id: string) { setDeleteTarget(id); }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget, {
      onSuccess: () => { toast.success("Patient deleted."); setDeleteTarget(null); },
      onError:   (err) => { toast.error(getErrorMessage(err, "Could not delete patient.")); setDeleteTarget(null); },
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (isLoading) return <SectionLoader message="Loading patients…" />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 max-w-sm mx-auto text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
          <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Failed to load patients</p>
          <p className="text-sm text-gray-500 mt-1">{getErrorMessage(error, "Please try again.")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Delete Patient"
        description="This will permanently remove the patient record and all associated data. This cannot be undone."
        confirmLabel="Delete Patient"
        danger
      />

      {mode === "list" && (
        <PatientList
          patients={patients}
          filteredPatients={filteredPatients}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={openAdd}
          onView={openView}
          onEdit={openEdit}
          onDelete={requestDelete}
        />
      )}

      {(mode === "add" || mode === "edit") && (
        <PatientForm
          mode={mode}
          selectedPatient={selectedPatient}
          formName={formName}
          formAge={formAge}
          formGender={formGender}
          formContact={formContact}
          formError={formError}
          submitting={createMutation.isPending || updateMutation.isPending}
          onNameChange={setFormName}
          onAgeChange={setFormAge}
          onGenderChange={setFormGender}
          onContactChange={setFormContact}
          onSubmit={mode === "add" ? handleAdd : handleEdit}
          onCancel={backToList}
        />
      )}

      {mode === "view" && selectedPatient && (
        <PatientView
          patient={selectedPatient}
          onBack={backToList}
          onEdit={openEdit}
        />
      )}
    </>
  );
}

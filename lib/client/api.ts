// Typed HTTP calls to the backend — prefer the hooks in frontend/lib/hooks/ over calling these directly

import axiosClient from "./axios";
import type {
  Appointment,
  HealthRecord,
  Patient,
  PatientDashboardStats,
  Prescription,
} from "@/types";

// ─── Types not in @/types ─────────────────────────────────────────────────────

export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  todaysAppointments: number;
  completedAppointments: number;
}

export interface DoctorOption {
  _id: string;
  name: string;
  specialization?: string;
}

// ─── Auth (no token required) ─────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const { data } = await axiosClient.post<{ token: string; role: string; name: string }>(
    "/api/auth/login",
    { email, password }
  );
  return data;
}

export async function signup(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const { data } = await axiosClient.post<{ message: string }>("/api/auth/signup", payload);
  return data;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const { data } = await axiosClient.get<DashboardStats>("/api/dashboard/stats");
  return data;
}

// ─── Patient Profile ──────────────────────────────────────────────────────────

export async function getMyProfile() {
  const { data } = await axiosClient.get<Patient>("/api/patient/me");
  return data;
}

export async function updateMyProfile(payload: Partial<Patient>) {
  const { data } = await axiosClient.put<Patient>("/api/patient/me", payload);
  return data;
}

// ─── Patient Dashboard ────────────────────────────────────────────────────────

export async function getPatientDashboard() {
  const { data } = await axiosClient.get<PatientDashboardStats>("/api/patient/dashboard");
  return data;
}

// ─── Patient Appointments ─────────────────────────────────────────────────────

export async function getMyAppointments() {
  const { data } = await axiosClient.get<Appointment[]>("/api/patient/appointments");
  return data;
}

export async function bookAppointment(payload: {
  doctorId: string; // the doctor's User ID, so the backend can link the record
  doctor: string; // the doctor's display name, so the UI doesn't need a lookup
  date: string;
  time: string;
  reason: string;
}) {
  const { data } = await axiosClient.post<Appointment>("/api/patient/appointments", payload);
  return data;
}

export async function cancelAppointment(id: string) {
  await axiosClient.delete(`/api/patient/appointments/${id}`);
}

// ─── Health Records ───────────────────────────────────────────────────────────

export async function getHealthRecords() {
  const { data } = await axiosClient.get<HealthRecord[]>("/api/health-records");
  return data;
}

export async function createHealthRecord(payload: Partial<HealthRecord>) {
  const { data } = await axiosClient.post<HealthRecord>("/api/health-records", payload);
  return data;
}

export async function deleteHealthRecord(id: string) {
  await axiosClient.delete(`/api/health-records/${id}`);
}

// ─── Prescriptions ────────────────────────────────────────────────────────────

export async function getPrescriptions() {
  const { data } = await axiosClient.get<Prescription[]>("/api/prescriptions");
  return data;
}

export async function createPrescription(payload: Partial<Prescription>) {
  const { data } = await axiosClient.post<Prescription>("/api/prescriptions", payload);
  return data;
}

export async function deletePrescription(id: string) {
  await axiosClient.delete(`/api/prescriptions/${id}`);
}

// ─── Doctors ─────────────────────────────────────────────────────────────────

export async function getDoctors() {
  const { data } = await axiosClient.get<DoctorOption[]>("/api/users?role=doctor");
  return data;
}

// ─── Staff: Patient Management ────────────────────────────────────────────────

export async function getAllPatients() {
  const { data } = await axiosClient.get<Patient[]>("/api/patients");
  return data;
}

export async function createPatient(payload: Partial<Patient>) {
  const { data } = await axiosClient.post<Patient>("/api/patients", payload);
  return data;
}

export async function updatePatient(id: string, payload: Partial<Patient>) {
  const { data } = await axiosClient.put<Patient>(`/api/patients/${id}`, payload);
  return data;
}

export async function deletePatient(id: string) {
  await axiosClient.delete(`/api/patients/${id}`);
}

// ─── Staff: Appointment Management ───────────────────────────────────────────

export async function getAllAppointments() {
  const { data } = await axiosClient.get<Appointment[]>("/api/appointment");
  return data;
}

export async function createAppointment(payload: Partial<Appointment>) {
  const { data } = await axiosClient.post<Appointment>("/api/appointment", payload);
  return data;
}

export async function updateAppointment(id: string, payload: Partial<Appointment>) {
  const { data } = await axiosClient.put<Appointment>(`/api/appointment/${id}`, payload);
  return data;
}

export async function deleteAppointment(id: string) {
  await axiosClient.delete(`/api/appointment/${id}`);
}

// ─── AI Chatbot ───────────────────────────────────────────────────────────────

export async function sendChatMessage(
  message: string,
  history: { role: "user" | "model"; text: string }[] // "model" (not "assistant") matches the Gemini API's role naming
) {
  const { data } = await axiosClient.post<{ reply: string }>("/api/chatbot", {
    message,
    history,
  });
  return data.reply;
}

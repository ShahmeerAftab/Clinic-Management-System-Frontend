// ─── Patient ────────────────────────────────────────────────────────────────

export type Patient = {
  _id: string;
  name: string;
  age: string;
  gender: string;
  contact: string;
  createdBy: string;
  userId?: string; // linked User account ID — only set if the patient has their own login (vs. a record a staff member added manually)
  dob?: string;
};

// Mongoose can "populate" a reference field, swapping the stored ID string for the full document —
// that's why patient/doctor fields below are typed as `string | PopulatedPatient` instead of just `string`
export type PopulatedPatient = {
  _id: string;
  name: string;
};

// ─── Appointment ─────────────────────────────────────────────────────────────

export type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled";

export type Appointment = {
  _id: string;
  patientID: string | PopulatedPatient | null;
  doctor: string; // display name shown in the UI (always present)
  doctorId?: string; // the doctor's User ID — optional since older appointments only stored the name
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
};

// ─── Health Record ───────────────────────────────────────────────────────────

export type RecordType =
  | "Lab Report"
  | "Imaging"
  | "Prescription"
  | "Discharge Summary"
  | "Other";

export type HealthRecord = {
  _id: string;
  patientId: string | PopulatedPatient;
  title: string;
  type: RecordType;
  doctor: string;
  hospital: string;
  visitDate: string;
  diagnosis: string;
  notes: string;
  createdAt: string;
};

// ─── Prescription ─────────────────────────────────────────────────────────────

export type Medicine = {
  name: string;     // e.g. "Amoxicillin 500mg"
  dose: string;     // e.g. "1 tablet twice daily"
  duration: string; // e.g. "7 days"
};

export type Prescription = {
  _id: string;
  patientId: string | PopulatedPatient;
  appointmentId?: string | null; // set only when this prescription was written during a specific booked appointment
  doctor: string;
  date: string;
  medicines: Medicine[];
  notes: string;
  createdAt: string;
};

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export type PatientDashboardStats = {
  upcomingCount: number;
  todayAppointments: Appointment[];
  recordsCount: number;
  prescriptionsCount: number;
};

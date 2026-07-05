import type { Patient } from "@/frontend/types";
import { Button } from "@/frontend/components/ui/Button";
import { Input, Textarea, Select } from "@/frontend/components/ui/Input";
import { Card } from "@/frontend/components/ui/Card";
import { BackButton } from "@/frontend/components/ui/PageHeader";
import PatientAutocomplete from "@/frontend/components/ui/PatientAutocomplete";

interface DoctorOption {
  _id: string;
  name: string;
  specialization?: string;
}

// Turn an ISO date string (e.g. from the DB) into a friendly "04 Jul 2026" format for display.
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const iso = dateStr.split("T")[0];
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

type Props = {
  editingId:         string | null;
  patients:          Patient[];
  doctors:           DoctorOption[];
  formPatient:       string;
  formDob:           string;
  formDoctor:        string;
  formDoctorId:      string;
  formDate:          string;
  formTime:          string;
  formReason:        string;
  formStatus:        "Scheduled" | "Cancelled";
  patientError:      string;
  submitting?:       boolean;
  onPatientChange:   (id: string, dob: string) => void;
  onDoctorChange:    (name: string, id: string) => void;
  onDateChange:      (v: string) => void;
  onTimeChange:      (v: string) => void;
  onReasonChange:    (v: string) => void;
  onStatusChange:    (v: "Scheduled" | "Cancelled") => void;
  onSubmit:          (e: React.FormEvent) => void;
  onCancel:          () => void;
};

// A "dumb"/controlled form: all values and change handlers come from props (owned by AppointmentManager),
// so this component just renders inputs and forwards user input upward — it holds no state of its own.
export default function AppointmentForm({
  editingId, patients, doctors,
  formPatient, formDob, formDoctorId, formDate, formTime, formReason, formStatus,
  patientError, submitting,
  onPatientChange, onDoctorChange, onDateChange, onTimeChange,
  onReasonChange, onStatusChange, onSubmit, onCancel,
}: Props) {
  return (
    <div className="max-w-lg">
      <BackButton onClick={onCancel} label="Back to Appointments" />

      <Card accent padding="none">
        <div className="p-7">
          {/* Form header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-aq-faint flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {editingId !== null ? "Edit Appointment" : "Book New Appointment"}
              </h3>
              <p className="text-xs text-gray-400">
                {editingId !== null ? "Update appointment details." : "Fill in the details to schedule."}
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">

            {/* Patient autocomplete */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Patient Name <span className="text-rose-500">*</span>
              </label>
              <PatientAutocomplete
                patients={patients}
                value={formPatient}
                onChange={onPatientChange}
                error={patientError}
              />
            </div>

            {/* DOB (read-only auto-fill) — only shown once a patient has been picked, since it's derived from them */}
            {formDob && (
              <Input
                label="Date of Birth"
                type="text"
                readOnly
                value={formatDate(formDob)}
                className="cursor-not-allowed text-gray-500 bg-gray-100"
              />
            )}

            <Select
              label="Doctor"
              required
              value={formDoctorId}
              onChange={(e) => {
                // The <select> only gives us the doctor's id, so look up the matching doctor
                // to also pass its display name up to the parent.
                const selected = doctors.find((d) => d._id === e.target.value);
                onDoctorChange(selected ? selected.name : "", e.target.value);
              }}
            >
              <option value="">-- Select doctor --</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}{d.specialization ? ` — ${d.specialization}` : ""}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                required
                type="date"
                value={formDate}
                onChange={(e) => onDateChange(e.target.value)}
              />
              <Input
                label="Time"
                required
                type="time"
                value={formTime}
                onChange={(e) => onTimeChange(e.target.value)}
              />
            </div>

            <Textarea
              label="Reason for Visit"
              required
              rows={3}
              placeholder="Describe the reason for this appointment…"
              value={formReason}
              onChange={(e) => onReasonChange(e.target.value)}
            />

            <Select
              label="Status"
              value={formStatus}
              onChange={(e) => onStatusChange(e.target.value as "Scheduled" | "Cancelled")}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Cancelled">Cancelled</option>
            </Select>

            <div className="flex gap-3 pt-2">
              <Button type="submit" fullWidth loading={submitting}>
                {editingId !== null ? "Update Appointment" : "Book Appointment"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

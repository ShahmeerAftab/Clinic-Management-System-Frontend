import type { Patient } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { BackButton } from "@/components/ui/PageHeader";

type Mode = "add" | "edit";

type Props = {
  mode:            Mode;
  selectedPatient: Patient | null;
  formName:        string;
  formAge:         string;
  formGender:      string;
  formContact:     string;
  formError:       string | null;
  submitting?:     boolean;
  onNameChange:    (v: string) => void;
  onAgeChange:     (v: string) => void;
  onGenderChange:  (v: string) => void;
  onContactChange: (v: string) => void;
  onSubmit:        (e: React.FormEvent) => void;
  onCancel:        () => void;
};

export default function PatientForm({
  mode, selectedPatient,
  formName, formAge, formGender, formContact,
  formError, submitting,
  onNameChange, onAgeChange, onGenderChange, onContactChange,
  onSubmit, onCancel,
}: Props) {
  return (
    <div className="max-w-lg">
      <BackButton onClick={onCancel} label="Back to Patient List" />

      <Card accent padding="none">
        <div className="p-7">
          {/* Form header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-aq-faint flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {mode === "add" ? "Add New Patient" : `Edit — ${selectedPatient?.name}`}
              </h3>
              <p className="text-xs text-gray-400">
                {mode === "add" ? "Fill in the patient details below." : "Update the patient's information."}
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              type="text"
              placeholder="e.g. Ali Hassan"
              value={formName}
              onChange={(e) => onNameChange(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Age"
                required
                type="number"
                min="0"
                max="150"
                placeholder="e.g. 34"
                value={formAge}
                onChange={(e) => onAgeChange(e.target.value)}
              />
              <Select
                label="Gender"
                value={formGender}
                onChange={(e) => onGenderChange(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>

            <Input
              label="Contact Number"
              required
              type="tel"
              placeholder="e.g. 0312-1234567"
              value={formContact}
              onChange={(e) => onContactChange(e.target.value)}
            />

            {/* Error */}
            {formError && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{formError}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" fullWidth loading={submitting}>
                {mode === "add" ? "Add Patient" : "Save Changes"}
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

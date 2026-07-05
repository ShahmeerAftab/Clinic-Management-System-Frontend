import type { Patient } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BackButton } from "@/components/ui/PageHeader";

type Props = {
  patient: Patient;
  onBack:  () => void;
  onEdit:  (p: Patient) => void;
};

const AVATAR_PALETTES = [
  { bg: "bg-aq-faint",    text: "text-aq-darker"   },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-violet-100",  text: "text-violet-700"  },
  { bg: "bg-orange-100",  text: "text-orange-700"  },
  { bg: "bg-rose-100",    text: "text-rose-700"    },
];
function avatarPalette(name: string) {
  return AVATAR_PALETTES[(name.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length];
}

export default function PatientView({ patient, onBack, onEdit }: Props) {
  const p = avatarPalette(patient.name ?? "");

  return (
    <div className="max-w-lg space-y-4">
      <BackButton onClick={onBack} label="Back to Patient List" />

      {/* Profile card */}
      <Card accent padding="none">
        <div className="p-7">
          {/* Avatar row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${p.bg} ${p.text} flex items-center justify-center text-xl font-bold`}>
                {(patient.name ?? "?").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {patient.gender} &middot; {patient.age} years old
                </p>
                <div className="mt-2">
                  <Badge
                    label={patient.createdBy}
                    variant="aqua"
                    size="sm"
                    dot
                  />
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(patient)}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
                </svg>
              }
            >
              Edit
            </Button>
          </div>

          {/* Details */}
          <div className="divide-y divide-gray-50">
            {[
              { label: "Contact",    value: patient.contact, mono: true  },
              { label: "Gender",     value: patient.gender,  mono: false },
              { label: "Age",        value: `${patient.age} years old`, mono: false },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-center gap-4 py-3.5">
                <span className="text-sm text-gray-400 w-28 shrink-0">{label}</span>
                <span className={`text-sm font-medium text-gray-800 ${mono ? "font-mono" : ""}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Medical history placeholder */}
      <Card padding="none">
        <div className="p-6">
          <h4 className="font-semibold text-gray-900 mb-0.5">Medical History</h4>
          <p className="text-xs text-gray-400 mb-6">
            Prescriptions and appointments will appear here once connected to the backend.
          </p>

          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">No records yet</p>
            <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
              Visit notes, prescriptions, and appointment records will show here once the backend is integrated.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

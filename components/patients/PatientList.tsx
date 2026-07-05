import type { Patient } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/PageHeader";

type Props = {
  patients:         Patient[];
  filteredPatients: Patient[];
  searchQuery:      string;
  onSearchChange:   (q: string) => void;
  onAdd:            () => void;
  onView:           (p: Patient) => void;
  onEdit:           (p: Patient) => void;
  onDelete:         (id: string) => void;
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

function genderVariant(gender: string) {
  if (gender === "Female") return "pink" as const;
  if (gender === "Male")   return "sky"  as const;
  return "gray" as const;
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const p = avatarPalette(name);
  const sz = size === "sm" ? "w-7 h-7 text-[10px]" : size === "lg" ? "w-12 h-12 text-sm" : "w-8 h-8 text-xs";
  return (
    <div className={`rounded-full ${p.bg} ${p.text} ${sz} flex items-center justify-center font-bold shrink-0`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

/* ── Action buttons shared ── */
function Actions({ patient, onView, onEdit, onDelete }: {
  patient:  Patient;
  onView:   (p: Patient) => void;
  onEdit:   (p: Patient) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Button size="xs" variant="secondary" onClick={() => onView(patient)}>View</Button>
      <Button size="xs" variant="outline"   onClick={() => onEdit(patient)}>Edit</Button>
      <Button size="xs" variant="danger"    onClick={() => onDelete(patient._id)}>Delete</Button>
    </div>
  );
}

export default function PatientList({
  patients,
  filteredPatients,
  searchQuery,
  onSearchChange,
  onAdd,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search patients by name…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-aq focus:border-aq/50 placeholder:text-gray-400 transition-all"
          />
        </div>
        <Button
          variant="primary"
          onClick={onAdd}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add Patient
        </Button>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400">
        Showing{" "}
        <span className="font-medium text-gray-600">{filteredPatients.length}</span>{" "}
        of{" "}
        <span className="font-medium text-gray-600">{patients.length}</span>{" "}
        patient{patients.length !== 1 ? "s" : ""}
      </p>

      {/* ══ Mobile card grid (< sm) ══ */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <EmptyState
            icon={
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            title={searchQuery ? `No results for "${searchQuery}"` : "No patients yet"}
            description={searchQuery ? "Try a different search term." : "Click Add Patient to get started."}
          />
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden grid grid-cols-1 gap-3">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3"
              >
                {/* Header row */}
                <div className="flex items-center gap-3">
                  <Avatar name={patient.name ?? "?"} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{patient.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge label={patient.gender} variant={genderVariant(patient.gender)} size="xs" />
                      <span className="text-xs text-gray-500">{patient.age} yrs</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                  <span className="text-gray-400">Contact</span>
                  <span className="font-mono text-gray-700 text-right">{patient.contact}</span>
                  <span className="text-gray-400">Added by</span>
                  <span className="text-right">
                    <Badge label={patient.createdBy} variant="aqua" size="xs" />
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-1 border-t border-gray-50">
                  <Actions patient={patient} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-aq to-aq-dark" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Patient", "Age", "Gender", "Contact", "Added By", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-aq-faint/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={patient.name ?? "?"} />
                          <span className="font-medium text-gray-900">{patient.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{patient.age} yrs</td>
                      <td className="px-5 py-3.5">
                        <Badge label={patient.gender} variant={genderVariant(patient.gender)} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{patient.contact}</td>
                      <td className="px-5 py-3.5">
                        <Badge label={patient.createdBy} variant="aqua" size="sm" />
                      </td>
                      <td className="px-5 py-3.5">
                        <Actions patient={patient} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

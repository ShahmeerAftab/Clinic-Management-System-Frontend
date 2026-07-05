import type { Appointment, Patient, PopulatedPatient } from "@/frontend/types";
import { Button } from "@/frontend/components/ui/Button";
import { StatusBadge } from "@/frontend/components/ui/Badge";
import { EmptyState } from "@/frontend/components/ui/PageHeader";

// Turn an ISO date string into a friendly "04 Jul 2026" format for display.
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const iso = dateStr.split("T")[0];
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// patientID can either be a raw id string, or an already-"populated" patient object
// (depending on how the API returned the appointment), so handle both shapes here.
function getPatientName(
  patientID: string | PopulatedPatient | null | undefined,
  patients:  Patient[],
): string {
  if (!patientID) return "Unknown";
  if (typeof patientID === "object") return patientID.name ?? "Unknown";
  return patients.find((p) => p._id === patientID)?.name ?? "Unknown";
}

const AVATAR_PALETTES = [
  { bg: "bg-aq-faint",    text: "text-aq-darker"   },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-violet-100",  text: "text-violet-700"  },
  { bg: "bg-orange-100",  text: "text-orange-700"  },
  { bg: "bg-rose-100",    text: "text-rose-700"    },
];
// Pick a consistent color for a patient's avatar based on the first letter of their name
// (so the same patient always gets the same color, without storing a color per patient).
function palette(name: string) {
  return AVATAR_PALETTES[(name.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length];
}

type Props = {
  appointments:   Appointment[];
  patients:       Patient[];
  onBook:         () => void;
  onEdit:         (id: string) => void;
  onDelete:       (id: string) => void;
  onUpdateStatus: (id: string) => void;
};

// Renders the list of appointments as cards on mobile and a table on desktop;
// all data and actions come from props — this component is purely presentational.
export default function AppointmentList({
  appointments, patients, onBook, onEdit, onDelete, onUpdateStatus,
}: Props) {
  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
        </span>

        <Button
          variant="primary"
          onClick={onBook}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Book Appointment
        </Button>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <EmptyState
            icon={
              <svg className="w-6 h-6 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            title="No appointments yet"
            description="Click Book Appointment to schedule one."
          />
        </div>
      ) : (
        <>
          {/* ── Mobile cards ── */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {/* filter(Boolean) guards against any null/undefined entries slipping into the array */}
            {appointments.filter(Boolean).map((appt) => {
              const name = getPatientName(appt.patientID, patients);
              const p    = palette(name);
              return (
                <div key={appt._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${p.bg} ${p.text} flex items-center justify-center text-xs font-bold shrink-0`}>
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{name}</p>
                      <p className="text-xs text-gray-500 truncate">{appt.doctor}</p>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                    <span className="text-gray-400">Date</span>
                    <span className="font-mono text-gray-700 text-right">{formatDate(appt.date)}</span>
                    <span className="text-gray-400">Time</span>
                    <span className="font-mono text-gray-700 text-right">{appt.time}</span>
                    <span className="text-gray-400">Reason</span>
                    <span className="text-gray-700 text-right truncate">{appt.reason}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-gray-50">
                    {/* Only scheduled appointments can be marked done; completed/cancelled ones hide this button */}
                    {appt.status === "Scheduled" && (
                      <Button size="xs" variant="secondary" onClick={() => onUpdateStatus(appt._id)}>
                        Mark Done
                      </Button>
                    )}
                    <Button size="xs" variant="outline" onClick={() => onEdit(appt._id)}>Edit</Button>
                    <Button size="xs" variant="danger"  onClick={() => onDelete(appt._id)}>Delete</Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop table ── */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-aq to-aq-dark" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Patient", "Doctor", "Date", "Time", "Reason", "Status", "Actions"].map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.filter(Boolean).map((appt) => {
                    const name = getPatientName(appt.patientID, patients);
                    const p    = palette(name);
                    return (
                      <tr key={appt._id} className="hover:bg-aq-faint/40 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full ${p.bg} ${p.text} flex items-center justify-center text-[10px] font-bold shrink-0`}>
                              {name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-800">{name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-gray-600">{appt.doctor}</td>
                        <td className="px-5 py-4 whitespace-nowrap font-mono text-xs text-gray-600">{formatDate(appt.date)}</td>
                        <td className="px-5 py-4 whitespace-nowrap font-mono text-xs text-gray-600">{appt.time}</td>
                        <td className="px-5 py-4 text-gray-600 max-w-[160px] truncate text-xs">{appt.reason}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <StatusBadge status={appt.status} />
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {appt.status === "Scheduled" && (
                              <Button
                                size="xs"
                                variant="secondary"
                                onClick={() => onUpdateStatus(appt._id)}
                                icon={
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                }
                              >
                                Done
                              </Button>
                            )}
                            <Button size="xs" variant="outline" onClick={() => onEdit(appt._id)}>Edit</Button>
                            <Button size="xs" variant="danger"  onClick={() => onDelete(appt._id)}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

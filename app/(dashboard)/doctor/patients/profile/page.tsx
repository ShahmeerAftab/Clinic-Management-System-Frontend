// Static placeholder — no patient id is read from the route/query yet, so this
// always renders the same "no history" empty state until backend wiring is added.
export default function PatientProfilePage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Patient Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Detailed medical history and appointment records.</p>
      </div>

      {/* Medical history card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-aq to-aq-dark" />
        <div className="p-6">
          <h2 className="text-base font-semibold text-ink mb-1">Medical History Timeline</h2>
          <p className="text-xs text-gray-400 mb-8">
            Appointment and prescription history will appear here once patient data is loaded from the backend.
          </p>

          <div className="flex flex-col items-center py-12 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-aq-faint flex items-center justify-center">
              <svg className="w-6 h-6 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">No history available</p>
              <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
                Appointment and prescription history will appear here once the patient&apos;s data is connected.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-aq-faint border border-aq/20 rounded-2xl px-5 py-4 flex items-center gap-3">
        <svg className="w-5 h-5 text-aq-darker shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-aq-darker font-medium">
          Backend integration is in progress — patient data will load once connected.
        </p>
      </div>

    </div>
  );
}

const stats = [
  {
    label:   "Appointments Today",
    value:   "34",
    change:  "8 completed · 26 remaining",
    trendUp: null,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label:   "Check-ins Completed",
    value:   "12",
    change:  "+4 since morning",
    trendUp: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label:   "New Patients Today",
    value:   "6",
    change:  "+2 vs yesterday",
    trendUp: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    label:   "Reports Pending",
    value:   "5",
    change:  "Action required",
    trendUp: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const queue = [
  { no: 1, patient: "Imran Syed",     time: "12:00 PM", doctor: "Dr. Ahmed",    waiting: "12 min" },
  { no: 2, patient: "Hira Batool",    time: "12:30 PM", doctor: "Dr. Rehman",   waiting: "5 min"  },
  { no: 3, patient: "Bilal Chaudhry", time: "01:00 PM", doctor: "Dr. Siddiqui", waiting: "—"      },
  { no: 4, patient: "Zainab Qureshi", time: "01:30 PM", doctor: "Dr. Ahmed",    waiting: "—"      },
  { no: 5, patient: "Tariq Mehmood",  time: "02:00 PM", doctor: "Dr. Rehman",   waiting: "—"      },
];

function AvatarCircle({ name }: { name: string }) {
  return (
    <div className="w-7 h-7 rounded-full bg-aq-faint flex items-center justify-center text-[10px] font-bold text-aq-darker shrink-0">
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function ReceptionistDashboard() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Front Desk Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-aq-faint text-aq-darker text-xs font-semibold rounded-full border border-aq/30 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-aq animate-pulse inline-block" />
          Desk Open
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-aq/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-aq-faint text-aq-darker flex items-center justify-center">
                {card.icon}
              </div>
              {card.trendUp === true && (
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              )}
              {card.trendUp === false && (
                <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
              )}
            </div>
            <p className="text-2xl font-bold text-ink tracking-tight">{card.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            <p className={`text-xs font-medium mt-2 ${
              card.trendUp === true ? "text-emerald-600" : card.trendUp === false ? "text-rose-500" : "text-gray-500"
            }`}>{card.change}</p>
          </div>
        ))}
      </div>

      {/* Patient queue */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">Waiting Queue</h2>
            <p className="text-xs text-gray-400 mt-0.5">Upcoming appointments in order</p>
          </div>
          <span className="text-xs font-semibold text-aq-darker bg-aq-faint px-2.5 py-1 rounded-full border border-aq/20">
            {queue.length} in queue
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["#", "Patient", "Time", "Doctor", "Waiting"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {queue.map((row) => (
                <tr key={row.no} className="hover:bg-aq-faint/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="w-6 h-6 rounded-full bg-aq-faint text-aq-darker text-xs font-bold flex items-center justify-center">
                      {row.no}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <AvatarCircle name={row.patient} />
                      <span className="font-medium text-ink">{row.patient}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{row.time}</td>
                  <td className="px-5 py-3.5 text-gray-600">{row.doctor}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium ${row.waiting !== "—" ? "text-amber-600" : "text-gray-400"}`}>
                      {row.waiting}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-aq-faint border border-aq/20 rounded-2xl px-5 py-4 flex items-center gap-3">
        <svg className="w-5 h-5 text-aq-darker shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-aq-darker font-medium">
          Backend integration is in progress — data shown is placeholder.
        </p>
      </div>

    </div>
  );
}

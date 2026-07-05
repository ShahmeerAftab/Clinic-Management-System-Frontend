const stats = [
  {
    label:      "Appointments Today",
    value:      "34",
    change:     "+4 vs yesterday",
    trend:      "up",
    trendColor: "text-emerald-600",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label:      "Total Patients",
    value:      "1,248",
    change:     "+18 this month",
    trend:      "up",
    trendColor: "text-emerald-600",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label:      "Active Doctors",
    value:      "12",
    change:     "2 on leave",
    trend:      "neutral",
    trendColor: "text-gray-500",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label:      "Revenue This Month",
    value:      "$24,800",
    change:     "+12% vs last month",
    trend:      "up",
    trendColor: "text-emerald-600",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const recentActivity = [
  { time: "09:15", event: "New patient registered",   detail: "Fatima Malik · Dr. Ahmed",   dot: "bg-aq"       },
  { time: "09:48", event: "Appointment completed",    detail: "Hassan Ali · Cardiology",    dot: "bg-emerald-500" },
  { time: "10:22", event: "Prescription issued",      detail: "Sara Khan · Dr. Rehman",     dot: "bg-aq-dark"  },
  { time: "11:05", event: "Appointment rescheduled",  detail: "Usman Tariq · Orthopaedics", dot: "bg-amber-400"   },
  { time: "11:40", event: "New patient registered",   detail: "Ayesha Noor · Dr. Siddiqui", dot: "bg-aq"       },
];

const upcomingSlots = [
  { time: "12:00 PM", patient: "Imran Syed",     doctor: "Dr. Ahmed",    status: "Confirmed" },
  { time: "12:30 PM", patient: "Hira Batool",    doctor: "Dr. Rehman",   status: "Confirmed" },
  { time: "01:00 PM", patient: "Bilal Chaudhry", doctor: "Dr. Siddiqui", status: "Pending"   },
  { time: "01:30 PM", patient: "Zainab Qureshi", doctor: "Dr. Ahmed",    status: "Confirmed" },
];

export default function AdminDashboard() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-aq-faint text-aq-darker text-xs font-semibold rounded-full border border-aq/30 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-aq animate-pulse inline-block" />
          Clinic is Open
        </span>
      </div>

      {/* Stat cards */}
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
              {card.trend === "up" && (
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              )}
            </div>
            <p className="text-2xl font-bold text-ink tracking-tight">{card.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            <p className={`text-xs font-medium mt-2 ${card.trendColor}`}>{card.change}</p>
          </div>
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Recent activity */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-ink">Recent Activity</h2>
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.dot} mt-0.5`} />
                  {i < recentActivity.length - 1 && (
                    <span className="w-px flex-1 bg-gray-100 mt-1.5" style={{ minHeight: 20 }} />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{item.event}</p>
                    <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming slots */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-ink">Upcoming Slots</h2>
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <div className="space-y-3">
            {upcomingSlots.map((slot, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-aq-faint transition-colors">
                <span className="text-xs font-mono font-bold text-aq-darker w-16 shrink-0">{slot.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink truncate">{slot.patient}</p>
                  <p className="text-[10px] text-gray-500 truncate">{slot.doctor}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  slot.status === "Confirmed"
                    ? "bg-aq-faint text-aq-darker border-aq/30"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Info banner */}
      <div className="bg-aq-faint border border-aq/20 rounded-2xl px-5 py-4 flex items-center gap-3">
        <svg className="w-5 h-5 text-aq-darker shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-aq-darker font-medium">
          Data shown is for demonstration purposes. Connect the backend to see live stats.
        </p>
      </div>

    </div>
  );
}

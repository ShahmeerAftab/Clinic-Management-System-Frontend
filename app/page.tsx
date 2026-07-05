import Link from "next/link";

function MedicalCross({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V7a1 1 0 011-1z" />
    </svg>
  );
}

const features = [
  {
    title: "Smart Scheduling",
    desc:  "Book, reschedule, and manage appointments in seconds with our intelligent calendar system.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Patient Records",
    desc:  "Securely store and access complete patient histories, prescriptions, and lab results.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Analytics & Insights",
    desc:  "Understand clinic performance with real-time charts, revenue tracking, and patient trends.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Multi-Role Access",
    desc:  "Tailored dashboards for admins, doctors, receptionists, and patients — all in one platform.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Prescriptions",
    desc:  "Issue and manage digital prescriptions instantly, with full patient medication history.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: "HIPAA Compliant",
    desc:  "Enterprise-grade security with 256-bit encryption, audit logs, and full HIPAA compliance.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "500+",  label: "Clinics Served" },
  { value: "2,000+", label: "Active Doctors" },
  { value: "50k+",  label: "Patients Managed" },
  { value: "99.9%", label: "Uptime Guaranteed" },
];

const steps = [
  { step: "01", title: "Create Your Account", desc: "Sign up in minutes and choose your role. No credit card required to get started." },
  { step: "02", title: "Set Up Your Clinic",  desc: "Add your team, configure your schedule, and import existing patient data securely." },
  { step: "03", title: "Start Managing",      desc: "Book appointments, manage records, and track analytics — all from one dashboard." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aq to-aq-darker flex items-center justify-center shadow-sm">
              <MedicalCross className="w-5 h-5 text-ink" />
            </div>
            <span className="text-lg font-bold text-ink tracking-tight">MediCare Pro</span>
          </div>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-ink transition-colors">Features</a>
            <a href="#how"      className="hover:text-ink transition-colors">How It Works</a>
            <a href="#stats"    className="hover:text-ink transition-colors">Platform</a>
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-ink border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-semibold bg-aq text-ink rounded-xl hover:bg-aq-dark transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-sidebar text-white">
        {/* Background blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-aq/10 blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-[-120px] w-96 h-96 rounded-full bg-aq/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-aq-dark/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-24 lg:py-32">
          <div className="max-w-3xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-aq/30 bg-aq/10 text-aq text-xs font-semibold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-aq animate-pulse" />
              Trusted by 500+ clinics worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              The Modern{" "}
              <span className="text-aq">Clinic Management</span>{" "}
              Platform
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
              Streamline appointments, manage patient records, and track your clinic&apos;s performance —
              all in one beautifully simple platform designed for healthcare teams.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-aq text-ink font-bold text-sm rounded-xl hover:bg-aq-dark transition-colors shadow-lg shadow-aq/20"
              >
                Start for Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white font-semibold text-sm rounded-xl hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap gap-6 text-white/50 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-aq" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                HIPAA Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-aq" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                256-bit Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-aq" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                99.9% Uptime SLA
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-aq" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                No Credit Card Required
              </span>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 50 960 60 720 45C480 30 240 10 0 30L0 60Z" fill="#F5F5F5" />
          </svg>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section id="stats" className="bg-[#F5F5F5] py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-aq-darker tracking-tight">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

          <div className="text-center mb-14">
            <span className="inline-block px-3.5 py-1 text-xs font-bold text-aq-darker bg-aq-faint rounded-full border border-aq/30 mb-4">
              Everything You Need
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Built for Modern Clinics
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Every feature your clinic needs, from patient management to revenue analytics,
              all designed with healthcare workflows in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-aq/40 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-aq-faint text-aq-darker flex items-center justify-center mb-4 group-hover:bg-aq group-hover:text-ink transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

          <div className="text-center mb-14">
            <span className="inline-block px-3.5 py-1 text-xs font-bold text-aq-darker bg-aq-faint rounded-full border border-aq/30 mb-4">
              Simple Onboarding
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Up and Running in Minutes
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              No complicated setup. Get your clinic management system live in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-aq/30 z-0" />

            {steps.map((s) => (
              <div key={s.step} className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-sidebar text-aq flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <span className="text-xl font-black">{s.step}</span>
                </div>
                <h3 className="text-base font-bold text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-100px] left-[-100px] w-80 h-80 rounded-full bg-aq blur-3xl" />
          <div className="absolute bottom-[-80px] right-[-60px] w-96 h-96 rounded-full bg-aq-dark blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to Transform Your Clinic?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Join hundreds of healthcare providers who have modernized their clinic operations with MediCare Pro.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-aq text-ink font-bold text-sm rounded-xl hover:bg-aq-dark transition-colors shadow-xl shadow-aq/20"
            >
              Create Free Account
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white font-semibold text-sm rounded-xl hover:bg-white/10 transition-colors"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-ink text-white/50 py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-aq flex items-center justify-center">
              <MedicalCross className="w-4 h-4 text-ink" />
            </div>
            <span className="text-white font-semibold text-sm">MediCare Pro</span>
          </div>
          <p className="text-xs text-center">
            &copy; 2026 MediCare Pro &middot; HIPAA Compliant &middot; All rights reserved
          </p>
          <div className="flex items-center gap-5 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

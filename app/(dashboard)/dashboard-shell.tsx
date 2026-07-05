"use client";

import { useEffect, useState, useSyncExternalStore, startTransition, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

/* ── Role config ── */
const ROLES = {
  admin:        { label: "Admin",        badge: "bg-violet-50 text-violet-700 border border-violet-200",   avatarBg: "#1E2A38" },
  doctor:       { label: "Doctor",       badge: "bg-aq-faint text-aq-darker border border-aq/30",          avatarBg: "#0D6E5A" },
  receptionist: { label: "Receptionist", badge: "bg-amber-50 text-amber-700 border border-amber-200",      avatarBg: "#2C5364" },
  patient:      { label: "Patient",      badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", avatarBg: "#3A6B5A" },
} as const;
type Role = keyof typeof ROLES;

/* ── SVG Icons ── */
function IcoDashboard() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function IcoPatients() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IcoCalendar() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function IcoChart() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function IcoFileText() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function IcoHeart() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}
function IcoPill() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}
function IcoChatbot() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15m-6.75-3.375h.008v.008H13.05V11.625zm0 0H11.625M19.8 15l-1.8 1.5M19.8 15V21M5 14.5l-1.8 1.5m0 0V21M3.2 16l1.8 1.5M19.8 21H4.2" />
    </svg>
  );
}
function IcoUser() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function IcoLogout() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
function IcoMenu() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function IcoClose() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function IcoChevronLeft() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}
function IcoChevronRight() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

/* ── localStorage hook (SSR-safe, no setState in effect) ── */
function useLocalStorage(key: string): string | null {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange);
      return () => window.removeEventListener("storage", onChange);
    },
    () => localStorage.getItem(key), // client snapshot
    () => null,                       // server snapshot
  );
}

/* ── Nav items ── */
type NavItem = { label: string; icon: ReactNode; path: string };

// Builds the sidebar links for a role — patients get a dedicated menu, other
// roles (admin/doctor/receptionist) share a common base with doctor-only extras
function buildNav(role: string): NavItem[] {
  const dashboard: NavItem = { label: "Dashboard", icon: <IcoDashboard />, path: `/${role}` };
  if (role === "patient") {
    return [
      dashboard,
      { label: "Appointments",   icon: <IcoCalendar />,  path: "/patient/appointments"   },
      { label: "Health Records", icon: <IcoFileText />,  path: "/patient/records"        },
      { label: "Prescriptions",  icon: <IcoPill />,      path: "/patient/prescriptions"  },
      { label: "Health Tips",    icon: <IcoHeart />,     path: "/patient/tips"           },
      { label: "AI Assistant",   icon: <IcoChatbot />,   path: "/patient/chatbot"        },
      { label: "My Profile",     icon: <IcoUser />,      path: "/patient/profile"        },
    ];
  }
  const base: NavItem[] = [
    dashboard,
    { label: "Patients",     icon: <IcoPatients />, path: `/${role}/patients` },
    { label: "Appointments", icon: <IcoCalendar />, path: `/${role}/appointments` },
  ];

  if (role === "doctor") {
    base.push(
      { label: "Health Records", icon: <IcoFileText />, path: "/doctor/health-records" },
      { label: "Prescriptions",  icon: <IcoPill />,     path: "/doctor/prescriptions" },
    );
  }

  base.push({ label: "Analytics", icon: <IcoChart />, path: "/analytics" });

  return base;
}

// Show initials from the user's name if available, otherwise fall back to email
function getInitials(nameOrEmail: string) {
  if (!nameOrEmail) return "??";
  const parts = nameOrEmail.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return nameOrEmail.slice(0, 2).toUpperCase();
}

/* ── Sidebar content ── */
type SidebarProps = {
  navItems:   NavItem[];
  pathname:   string;
  dashPath:   string;
  collapsed:  boolean;
  isMobile:   boolean;
  userEmail:  string;
  userName:   string;
  role:       Role;
  onLogout:   () => void;
  onClose?:   () => void;
};

function SidebarContent({
  navItems, pathname, dashPath, collapsed, isMobile,
  userEmail, userName, role, onLogout, onClose,
}: SidebarProps) {
  const badge = ROLES[role];
  const slim  = collapsed && !isMobile;

  return (
    <div className="flex flex-col h-full select-none bg-sidebar">

      {/* Logo area */}
      <div className={`flex items-center gap-3 px-4 py-[18px] border-b border-white/10 ${slim ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-xl bg-aq/20 border border-aq/30 flex items-center justify-center shrink-0">
          <svg className="w-[17px] h-[17px] text-aq" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V7a1 1 0 011-1z" />
          </svg>
        </div>
        {!slim && (
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm truncate leading-tight">MediCare Pro</p>
            <p className="text-[10px] text-white/40 leading-tight">Clinic Management</p>
          </div>
        )}
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IcoClose />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {!slim && (
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
            Navigation
          </p>
        )}

        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== dashPath && pathname.startsWith(item.path));

          return (
            <Link
              key={item.label}
              href={item.path}
              title={slim ? item.label : undefined}
              onClick={isMobile ? onClose : undefined}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                slim ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-aq text-ink"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={isActive ? "text-ink" : "text-white/50 group-hover:text-white"}>
                {item.icon}
              </span>
              {!slim && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer: user + logout */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        {!slim && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/8 mb-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ring-2 ring-aq/30"
              style={{ backgroundColor: badge.avatarBg }}
            >
              {getInitials(userName || userEmail)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white/80 truncate">{userName || userEmail}</p>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.badge}`}>
                {badge.label}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          title={slim ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-red-500/20 hover:text-red-300 transition-colors ${slim ? "justify-center" : ""}`}
        >
          <IcoLogout />
          {!slim && "Logout"}
        </button>
      </div>
    </div>
  );
}

/* ── Loading screen ── */
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-sidebar flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-aq animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-sm text-gray-400 font-medium">Loading&hellip;</p>
      </div>
    </div>
  );
}

/* ── Main shell ── */
export default function DashboardShell({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  // Read localStorage during render — no setState in effects
  // Auth itself is enforced server-side (httpOnly cookie + middleware.ts);
  // these are display-only values, not a security check.
  const savedRole  = useLocalStorage("userRole");
  const savedEmail = useLocalStorage("userEmail");
  const savedName  = useLocalStorage("userName");

  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // savedRole is null on server (server snapshot) → renders LoadingScreen
  // After hydration useSyncExternalStore switches to client snapshot automatically
  const validRole  = savedRole && savedRole in ROLES ? savedRole as Role : null;
  const isReady    = !!validRole;

  // Redirect only — wrap in startTransition to avoid sync setState-in-effect warning
  useEffect(() => {
    // savedRole === null means still in server/hydration pass; skip
    if (savedRole !== null && !isReady) {
      startTransition(() => {
        router.push("/login");
      });
    }
  }, [isReady, savedRole, router]);

  function handleLogout() {
    fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      router.push("/login");
    });
  }

  // Show loading screen until client snapshot is available
  if (!isReady) return <LoadingScreen />;

  const userRole  = validRole!;
  const userEmail = savedEmail ?? "";
  const userName  = savedName  ?? "";

  const badge    = ROLES[userRole];
  const dashPath = `/${userRole}`;
  const navItems = buildNav(userRole);

  const currentPage = navItems.find(
    (item) =>
      pathname === item.path ||
      (item.path !== dashPath && pathname.startsWith(item.path)),
  );
  const pageTitle = currentPage?.label ?? "Dashboard";

  const sidebarProps: SidebarProps = {
    navItems,
    pathname,
    dashPath,
    userEmail,
    userName,
    role: userRole,
    onLogout: handleLogout,
    collapsed,
    isMobile: false,
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">

      {/* ─── Desktop sidebar ─── */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 relative transition-all duration-300 ease-in-out shadow-xl ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <SidebarContent {...sidebarProps} />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-[62px] w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-400 hover:text-aq-darker hover:border-aq/30 transition-colors z-20"
        >
          {collapsed ? <IcoChevronRight /> : <IcoChevronLeft />}
        </button>
      </aside>

      {/* ─── Mobile sidebar overlay ─── */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 shadow-2xl flex flex-col">
            <SidebarContent
              {...sidebarProps}
              collapsed={false}
              isMobile={true}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}

      {/* ─── Main content ─── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-sm">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-xl text-gray-500 hover:bg-aq-faint hover:text-aq-darker transition-colors"
              aria-label="Open menu"
            >
              <IcoMenu />
            </button>
            <div>
              <h1 className="text-base font-semibold text-ink leading-tight">{pageTitle}</h1>
              <p className="text-[11px] text-gray-400 hidden sm:block">MediCare Pro</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className={`hidden sm:block px-2.5 py-1 text-xs font-semibold rounded-full ${badge.badge}`}>
              {badge.label}
            </span>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white ring-2 ring-aq/40 shadow-sm"
                style={{ backgroundColor: badge.avatarBg }}
              >
                {getInitials(userName || userEmail)}
              </div>
              <span className="hidden md:block text-sm text-gray-600 truncate max-w-[150px]">
                {userName || userEmail}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 animate-fade-up">
          {children}
        </main>

      </div>
    </div>
  );
}

type SpinnerSize = "xs" | "sm" | "md" | "lg";

const sizeMap: Record<SpinnerSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

interface SpinnerProps {
  size?:      SpinnerSize;
  color?:     string;
  className?: string;
}

export function Spinner({
  size      = "md",
  color     = "text-aq-darker",
  className = "",
}: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${color} ${sizeMap[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ── Full-page loading screen ── */
export function LoadingScreen({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-sidebar flex items-center justify-center shadow-lg shadow-aq/20">
          <Spinner size="sm" color="text-aq" />
        </div>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
}

/* ── Inline section loader ── */
export function SectionLoader({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-10 h-10 rounded-xl bg-sidebar flex items-center justify-center">
        <Spinner size="sm" color="text-aq" />
      </div>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

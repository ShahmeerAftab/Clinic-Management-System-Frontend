export type BadgeVariant =
  | "aqua" | "blue" | "emerald" | "violet" | "orange"
  | "rose" | "amber" | "gray" | "sky" | "pink";

type BadgeSize = "xs" | "sm" | "md";

interface BadgeProps {
  label:    string;
  variant?: BadgeVariant;
  size?:    BadgeSize;
  dot?:     boolean;
  pulse?:   boolean;
}

const variantCls: Record<BadgeVariant, { bg: string; dot: string }> = {
  aqua:    { bg: "bg-aq-faint text-aq-darker border-aq/30",          dot: "bg-aq"          },
  blue:    { bg: "bg-blue-50 text-blue-700 border-blue-200",         dot: "bg-blue-500"    },
  emerald: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  violet:  { bg: "bg-violet-50 text-violet-700 border-violet-200",   dot: "bg-violet-500"  },
  orange:  { bg: "bg-orange-50 text-orange-700 border-orange-200",   dot: "bg-orange-500"  },
  rose:    { bg: "bg-rose-50 text-rose-600 border-rose-200",         dot: "bg-rose-500"    },
  amber:   { bg: "bg-amber-50 text-amber-700 border-amber-200",      dot: "bg-amber-500"   },
  gray:    { bg: "bg-gray-100 text-gray-600 border-gray-200",        dot: "bg-gray-400"    },
  sky:     { bg: "bg-sky-50 text-sky-700 border-sky-200",            dot: "bg-sky-500"     },
  pink:    { bg: "bg-pink-50 text-pink-700 border-pink-200",         dot: "bg-pink-500"    },
};

const sizeCls: Record<BadgeSize, string> = {
  xs: "text-[10px] px-1.5 py-0.5 font-semibold",
  sm: "text-[11px] px-2   py-0.5 font-semibold",
  md: "text-xs     px-2.5 py-1   font-semibold",
};

export function Badge({
  label,
  variant = "gray",
  size    = "md",
  dot,
  pulse,
}: BadgeProps) {
  const cfg = variantCls[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${cfg.bg} ${sizeCls[size]}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot} ${pulse ? "animate-pulse" : ""}`}
        />
      )}
      {label}
    </span>
  );
}

/* ── Appointment status → badge variant ── */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    Scheduled:     "aqua",
    Completed:     "emerald",
    Cancelled:     "rose",
    Confirmed:     "aqua",
    Pending:       "amber",
    "In Progress": "aqua",
  };
  return <Badge label={status} variant={map[status] ?? "gray"} dot />;
}

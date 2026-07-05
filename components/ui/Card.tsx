import { type ReactNode } from "react";

/* ── Card ── */
type Padding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children:   ReactNode;
  className?: string;
  accent?:    boolean;   // aquamarine gradient top bar
  padding?:   Padding;
  hover?:     boolean;
}

const padCls: Record<Padding, string> = {
  none: "",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-7",
};

export function Card({
  children,
  className = "",
  accent,
  padding   = "md",
  hover,
}: CardProps) {
  return (
    <div
      className={[
        "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden",
        hover ? "hover:shadow-md hover:border-aq/30 transition-all" : "",
        className,
      ].join(" ")}
    >
      {accent && <div className="h-1 bg-gradient-to-r from-aq to-aq-dark" />}
      <div className={padCls[padding]}>{children}</div>
    </div>
  );
}

/* ── CardHeader ── */
interface CardHeaderProps {
  title:        string;
  description?: string;
  action?:      ReactNode;
  className?:   string;
  border?:      boolean;
}

export function CardHeader({
  title,
  description,
  action,
  className = "",
  border,
}: CardHeaderProps) {
  return (
    <div
      className={[
        "flex items-start justify-between gap-3",
        border ? "border-b border-gray-50 pb-4 mb-4" : "",
        className,
      ].join(" ")}
    >
      <div>
        <h3 className="text-sm font-semibold text-ink leading-tight">{title}</h3>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ── StatCard ── */
interface StatCardProps {
  label:      string;
  value:      string;
  change?:    string;
  trendUp?:   boolean | null;
  icon:       ReactNode;
  iconBg:     string;
  iconColor:  string;
}

export function StatCard({
  label, value, change, trendUp, icon, iconBg, iconColor,
}: StatCardProps) {
  return (
    <Card hover padding="none">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
            {icon}
          </div>
          {trendUp === true && (
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          )}
          {trendUp === false && (
            <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-9.2 9.2M7 7v10h10" />
            </svg>
          )}
        </div>
        <p className="text-2xl font-bold text-ink tracking-tight">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {change && (
          <p className={`text-xs font-medium mt-2 ${
            trendUp === true ? "text-emerald-600" :
            trendUp === false ? "text-rose-500" :
            "text-gray-500"
          }`}>
            {change}
          </p>
        )}
      </div>
    </Card>
  );
}

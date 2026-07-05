import { type ReactNode } from "react";

interface PageHeaderProps {
  title:        string;
  description?: string;
  action?:      ReactNode;
  badge?:       ReactNode;
  className?:   string;
}

export function PageHeader({
  title,
  description,
  action,
  badge,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 ${className}`}>
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold text-ink leading-tight">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 self-start sm:self-auto">{action}</div>}
    </div>
  );
}

/* ── Back button ── */
interface BackButtonProps {
  onClick:   () => void;
  label?:    string;
}

export function BackButton({ onClick, label = "Back" }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-aq-darker mb-6 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}

/* ── Empty state ── */
interface EmptyStateProps {
  icon?:        ReactNode;
  title:        string;
  description?: string;
  action?:      ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-3">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

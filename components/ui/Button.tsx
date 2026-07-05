import { type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
export type ButtonSize    = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:      ButtonVariant;
  size?:         ButtonSize;
  loading?:      boolean;
  icon?:         ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?:    boolean;
}

const variantCls: Record<ButtonVariant, string> = {
  primary:   "bg-aq text-ink font-semibold hover:bg-aq-dark shadow-sm hover:shadow-md focus:ring-aq",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400",
  danger:    "bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow-md focus:ring-rose-500",
  ghost:     "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400",
  outline:   "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
};

const sizeCls: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1.5 text-xs rounded-lg  gap-1.5",
  sm: "px-3.5 py-2   text-xs rounded-xl  gap-1.5",
  md: "px-5   py-2.5 text-sm rounded-xl  gap-2",
  lg: "px-6   py-3   text-sm rounded-xl  gap-2.5",
};

function LoadingSpinner() {
  return (
    <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function Button({
  variant      = "primary",
  size         = "md",
  loading,
  icon,
  iconPosition = "left",
  fullWidth,
  children,
  className    = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center font-semibold",
        "transition-all active:scale-[0.98]",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantCls[variant],
        sizeCls[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === "left"  && <span className="shrink-0">{icon}</span>}
      {children}
      {!loading && icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </button>
  );
}

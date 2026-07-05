import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  error?:    string | null;
  hint?:     string;
  leading?:  ReactNode;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leading, trailing, id, className = "", ...rest },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
        >
          {label}
          {rest.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}

      <div
        className={[
          "flex items-center bg-gray-50 border rounded-xl",
          "transition-colors",
          "focus-within:ring-2 focus-within:ring-aq focus-within:border-aq/50 focus-within:bg-white",
          error ? "border-rose-300 focus-within:ring-rose-400" : "border-gray-200",
        ].join(" ")}
      >
        {leading && (
          <span className="pl-3.5 text-gray-400 shrink-0 flex items-center">
            {leading}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={[
            "flex-1 py-2.5 text-sm bg-transparent outline-none",
            "text-gray-900 placeholder:text-gray-400",
            "disabled:cursor-not-allowed disabled:opacity-60",
            leading ? "pl-2 pr-4" : "px-4",
            trailing ? "pr-2" : "",
            className,
          ].join(" ")}
          {...rest}
        />

        {trailing && (
          <span className="pr-3.5 text-gray-400 shrink-0 flex items-center">
            {trailing}
          </span>
        )}
      </div>

      {error  && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  );
});

/* ── Textarea variant ── */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | null;
}

export function Textarea({ label, error, id, className = "", ...rest }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
        >
          {label}
          {rest.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        className={[
          "w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl resize-none",
          "focus:outline-none focus:ring-2 focus:ring-aq focus:border-aq/50 focus:bg-white",
          "placeholder:text-gray-400 transition-colors",
          error ? "border-rose-300 focus:ring-rose-400" : "",
          className,
        ].join(" ")}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}

/* ── Select variant ── */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string | null;
  children: React.ReactNode;
}

export function Select({ label, error, id, className = "", children, ...rest }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
        >
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={[
          "w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl",
          "focus:outline-none focus:ring-2 focus:ring-aq focus:border-aq/50 focus:bg-white",
          "transition-colors appearance-none",
          error ? "border-rose-300" : "",
          className,
        ].join(" ")}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}

"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Patient } from "@/frontend/types";

type Props = {
  patients: Patient[];
  value: string;
  onChange: (id: string, dob: string) => void;
  error?: string;
};

const MAX_SUGGESTIONS = 10;

export default function PatientAutocomplete({ patients, value, onChange, error }: Props) {
  const [query, setQuery]                   = useState("");
  const [open, setOpen]                     = useState(false);
  const [highlightedIndex, setHighlighted]  = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const listRef      = useRef<HTMLUListElement>(null);
  const listboxId     = useId();

  // Resync the display text when the external value (or the patients list) changes —
  // adjusting state during render avoids the extra render pass a useEffect would cause.
  const [prevValue, setPrevValue] = useState(value);
  const [prevPatients, setPrevPatients] = useState(patients);
  if (value !== prevValue || patients !== prevPatients) {
    setPrevValue(value);
    setPrevPatients(patients);
    if (value) {
      const match = patients.find((p) => p._id === value);
      if (match) setQuery(match.name);
    } else {
      setQuery("");
    }
  }

  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return patients.slice(0, MAX_SUGGESTIONS);
    return patients.filter((p) => p.name.toLowerCase().includes(trimmed)).slice(0, MAX_SUGGESTIONS);
  }, [query, patients]);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.children[highlightedIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    onChange("", "");
    setOpen(true);
    setHighlighted(0);
  }

  function handleSelect(patient: Patient) {
    onChange(patient._id, patient.dob ?? "");
    setQuery(patient.name);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((i) => Math.min(i + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (suggestions[highlightedIndex]) handleSelect(suggestions[highlightedIndex]);
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  }

  const hasError = Boolean(error);

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        autoComplete="off"
        spellCheck={false}
        placeholder="Search patient name..."
        value={query}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        className={`w-full px-4 py-2.5 pr-9 text-sm bg-gray-50 border rounded-xl
          focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white
          transition-colors placeholder:text-gray-400
          ${hasError ? "border-rose-300 focus:ring-rose-400" : "border-gray-200 focus:ring-aq focus:border-aq/50"}`}
      />

      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </span>

      {hasError && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}

      {open && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto py-1"
        >
          {suggestions.map((patient, idx) => (
            <li
              key={patient._id}
              role="option"
              aria-selected={idx === highlightedIndex}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(patient); }}
              onMouseEnter={() => setHighlighted(idx)}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                ${idx === highlightedIndex ? "bg-aq-faint text-aq-darker font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              {patient.name}
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() !== "" && suggestions.length === 0 && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-400">
          No patients match &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}

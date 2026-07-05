"use client";

import { useEffect, type ReactNode } from "react";
import { Button } from "./Button";

/* ── Base Modal ── */
type ModalSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ModalProps {
  open:         boolean;
  onClose:      () => void;
  title?:       string;
  description?: string;
  size?:        ModalSize;
  children:     ReactNode;
  hideClose?:   boolean;
}

const sizeCls: Record<ModalSize, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size      = "md",
  children,
  hideClose,
}: ModalProps) {
  /* Lock body scroll while open */
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  /* Escape key closes */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeCls[size]} animate-fade-up`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">{title}</h2>
              {description && (
                <p className="text-sm text-gray-500 mt-0.5 leading-snug">{description}</p>
              )}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ── Confirm Modal ── */
interface ConfirmModalProps {
  open:           boolean;
  onConfirm:      () => void;
  onCancel:       () => void;
  title?:         string;
  description?:   string;
  confirmLabel?:  string;
  cancelLabel?:   string;
  danger?:        boolean;
  loading?:       boolean;
}

export function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  title        = "Are you sure?",
  description  = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel  = "Cancel",
  danger,
  loading,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="xs"
      hideClose
    >
      {/* Icon */}
      <div className="flex flex-col items-center text-center gap-3 mb-5">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${danger ? "bg-rose-50" : "bg-aq-faint"}`}>
          {danger ? (
            <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1m-4 0h10" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500 mt-1 leading-snug">{description}</p>
        </div>
      </div>

      <div className="flex gap-2.5">
        <Button
          variant="outline"
          fullWidth
          onClick={onCancel}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          fullWidth
          loading={loading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

/**
 * lib/hooks/useAppointments.ts
 * TanStack Query hooks for appointments.
 *
 * Patient hooks:  useMyAppointments, useBookAppointment, useCancelAppointment
 * Staff hooks:    useAllAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/client/api";
import type { Appointment } from "@/types";

// ─── Patient ──────────────────────────────────────────────────────────────────

/** Get the logged-in patient's own appointments */
export function useMyAppointments() {
  return useQuery({
    queryKey: ["my-appointments"],
    queryFn: api.getMyAppointments,
  });
}

/** Book a new appointment (patient) */
export function useBookAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.bookAppointment,
    onSuccess: () => {
      // Refresh the appointment list after booking
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patient-dashboard"] });
    },
  });
}

/** Cancel an appointment (patient) */
export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
  });
}

// ─── Staff ────────────────────────────────────────────────────────────────────

/** Get all appointments (staff: admin, doctor, receptionist) */
export function useAllAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: api.getAllAppointments,
  });
}

/** Create a new appointment (staff) */
export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Appointment>) => api.createAppointment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

/** Update an appointment (staff) */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) =>
      api.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

/** Delete an appointment (staff) */
export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

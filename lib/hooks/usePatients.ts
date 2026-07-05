/**
 * lib/hooks/usePatients.ts
 * TanStack Query hooks for patient management (staff only).
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/frontend/lib/client/api";
import type { Patient } from "@/frontend/types";

/** Get all patients */
export function useAllPatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: api.getAllPatients,
  });
}

/** Add a new patient */
export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Patient>) => api.createPatient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

/** Edit a patient */
export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Patient> }) =>
      api.updatePatient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

/** Delete a patient */
export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

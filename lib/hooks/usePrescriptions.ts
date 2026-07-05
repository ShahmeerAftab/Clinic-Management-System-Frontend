/**
 * lib/hooks/usePrescriptions.ts
 * TanStack Query hooks for prescriptions.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/client/api";
import type { Prescription } from "@/types";

/** Get prescriptions (patient sees own, doctor/admin sees all) */
export function usePrescriptions() {
  return useQuery({
    queryKey: ["prescriptions"],
    queryFn: api.getPrescriptions,
  });
}

/** Create a new prescription (doctor only) */
export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Prescription>) => api.createPrescription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({ queryKey: ["patient-dashboard"] });
    },
  });
}

/** Delete a prescription (doctor/admin only) */
export function useDeletePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deletePrescription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });
}

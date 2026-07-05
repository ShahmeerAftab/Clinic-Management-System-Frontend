/**
 * lib/hooks/useProfile.ts
 * TanStack Query hooks for the logged-in patient's profile.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/client/api";
import type { Patient } from "@/types";

/** Get the current patient's profile */
export function useMyProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: api.getMyProfile,
  });
}

/** Update the current patient's profile */
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Patient>) => api.updateMyProfile(payload),
    onSuccess: (updatedProfile) => {
      // Update the cache directly so the page reflects new data immediately
      queryClient.setQueryData(["profile"], updatedProfile);
    },
  });
}

import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetTodaySteps as useGenGetTodaySteps,
  useLogSteps as useGenLogSteps,
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";

function useAuthHeaders() {
  const { token } = useAuth();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useAppGetTodaySteps() {
  const headers = useAuthHeaders();
  const { isAuthenticated } = useAuth();
  return useGenGetTodaySteps({
    query: { enabled: isAuthenticated, retry: false },
    request: { headers }
  });
}

export function useAppLogSteps() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  
  return useGenLogSteps({
    request: { headers },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/steps/today"] });
        queryClient.invalidateQueries({ queryKey: ["/api/streaks"] });
      }
    }
  });
}

import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetTodayFajr as useGenGetTodayFajr,
  useLogFajr as useGenLogFajr,
  useGetFajrHistory as useGenGetFajrHistory
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";

function useAuthHeaders() {
  const { token } = useAuth();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useAppGetTodayFajr() {
  const headers = useAuthHeaders();
  const { isAuthenticated } = useAuth();
  return useGenGetTodayFajr({
    query: { enabled: isAuthenticated, retry: false },
    request: { headers }
  });
}

export function useAppLogFajr() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  
  return useGenLogFajr({
    request: { headers },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/fajr/today"] });
        queryClient.invalidateQueries({ queryKey: ["/api/streaks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/fajr/history"] });
      }
    }
  });
}

export function useAppGetFajrHistory(days = 30) {
  const headers = useAuthHeaders();
  const { isAuthenticated } = useAuth();
  return useGenGetFajrHistory({ days }, {
    query: { enabled: isAuthenticated },
    request: { headers }
  });
}

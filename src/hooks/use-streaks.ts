import { useGetStreaks as useGenGetStreaks } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";

function useAuthHeaders() {
  const { token } = useAuth();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useAppGetStreaks() {
  const headers = useAuthHeaders();
  const { isAuthenticated } = useAuth();
  return useGenGetStreaks({
    query: { enabled: isAuthenticated },
    request: { headers }
  });
}

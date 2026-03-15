import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetMyCircles as useGenGetMyCircles,
  useGetCircle as useGenGetCircle,
  useCreateCircle as useGenCreateCircle,
  useJoinCircle as useGenJoinCircle
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";

function useAuthHeaders() {
  const { token } = useAuth();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useAppGetMyCircles() {
  const headers = useAuthHeaders();
  const { isAuthenticated } = useAuth();
  return useGenGetMyCircles({
    query: { enabled: isAuthenticated },
    request: { headers }
  });
}

export function useAppGetCircle(id: string) {
  const headers = useAuthHeaders();
  const { isAuthenticated } = useAuth();
  return useGenGetCircle(id, {
    query: { enabled: isAuthenticated && !!id },
    request: { headers }
  });
}

export function useAppCreateCircle() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  
  return useGenCreateCircle({
    request: { headers },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/circles"] });
      }
    }
  });
}

export function useAppJoinCircle() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  
  return useGenJoinCircle({
    request: { headers },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/circles"] });
      }
    }
  });
}

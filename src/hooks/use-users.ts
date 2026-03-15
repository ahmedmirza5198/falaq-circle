import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetMe as useGenGetMe,
  useUpdateMe as useGenUpdateMe,
  useCreateSession as useGenCreateSession,
  useDeleteSession as useGenDeleteSession
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";

function useAuthHeaders() {
  const { token } = useAuth();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useAppGetMe() {
  const headers = useAuthHeaders();
  const { isAuthenticated } = useAuth();
  return useGenGetMe({
    query: { enabled: isAuthenticated },
    request: { headers }
  });
}

export function useAppUpdateMe() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();
  
  return useGenUpdateMe({
    request: { headers },
    mutation: {
      onSuccess: (data) => {
        updateUser(data);
        queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      }
    }
  });
}

export function useAppCreateSession() {
  return useGenCreateSession();
}

export function useAppDeleteSession() {
  const headers = useAuthHeaders();
  return useGenDeleteSession({
    request: { headers }
  });
}

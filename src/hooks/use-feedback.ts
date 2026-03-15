import { useSubmitFeedback as useGenSubmitFeedback } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";

function useAuthHeaders() {
  const { token } = useAuth();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useAppSubmitFeedback() {
  const headers = useAuthHeaders();
  
  return useGenSubmitFeedback({
    request: { headers }
  });
}

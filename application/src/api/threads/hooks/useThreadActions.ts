import { useAPIClient } from "@/api/useAPIClient"
import { useMutation } from "@tanstack/react-query"
import { ThreadClient } from "../client";
import { ThreadStatus } from "../types";

interface UpdateStatusVariables {
  id: number;
  status: ThreadStatus;
}

interface ToggleAutomatedVariables {
  id: number;
  isAutomated: boolean;
}

export const useThreadActions = () => {
  const apiClient = useAPIClient();
  const threadClient = new ThreadClient(apiClient)

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: UpdateStatusVariables) => {
      return threadClient.updatedThread({ id, status });
    }
  });

  const toggleAutomated = useMutation({
    mutationFn: ({ id, isAutomated }: ToggleAutomatedVariables) => {
      return threadClient.updatedThread({ id, isAutomated })
    }
  });

  return {
    updateStatus, toggleAutomated
  }
}
import { useAPIClient } from "@/api/useAPIClient"
import { useMutation } from "@tanstack/react-query"
import { ThreadClient } from "../client";
import { ThreadStatus } from "../types";
import { toast } from "sonner";
import { HUMAN_READABLE_STATUS } from "../consts";

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
    },
    onSuccess: (res) => {
      toast.success(`Thread marked as ${HUMAN_READABLE_STATUS[res.status]} successfully.`);
    },
    onError: (err) => {
      console.error(err);
      toast.error("We are unable to update status at this moment. Please try again later.");
    }
  });

  const toggleAutomated = useMutation({
    mutationFn: ({ id, isAutomated }: ToggleAutomatedVariables) => {
      return threadClient.updatedThread({ id, isAutomated })
    },
    onError: (err) => {
      console.error(err);
      toast.error("We are unable to change thread management strategy at the moment. Please try again later.");
    }
  });

  return {
    updateStatus, toggleAutomated
  }
}
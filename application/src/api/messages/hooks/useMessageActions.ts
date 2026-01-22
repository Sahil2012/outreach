import { useAPIClient } from "@/api/useAPIClient"
import { useMutation } from "@tanstack/react-query"
import { MessageClient } from "../client";
import { GenerateMessageReq } from "../types";

interface SendMessageVariables {
  id: number;
  threadId: number
  attachResume: boolean
}

interface DeleteDraftVariables {
  id: number;
}

interface MarkAsSentVariables {
  id: number;
}

interface UpdateDraftVariables {
  id: number;
  subject: string;
  body: string;
}

export const useMessageActions = () => {
  const client = useAPIClient();
  const messageClient = new MessageClient(client);

  const generateMessage = useMutation({
    mutationFn: (message: GenerateMessageReq) => {
      return messageClient.createMessage(message);
    }
  });

  const sendMessage = useMutation({
    mutationFn: ({ id, threadId, attachResume }: SendMessageVariables) => {
      return messageClient.sendMessage(threadId, id, attachResume);
    }
  });

  const deleteDraft = useMutation({
    mutationFn: ({ id }: DeleteDraftVariables) => {
      return messageClient.deleteMessage(id)
    }
  });

  const markAsSent = useMutation({
    mutationFn: ({ id }: MarkAsSentVariables) => {
      return messageClient.updateMessage({ id, status: "SENT" })
    }
  });

  const updateDraft = useMutation({
    mutationFn: ({ id, subject, body }: UpdateDraftVariables) => {
      return messageClient.updateMessage({ id, subject, body })
    }
  });

  return {
    generateMessage,
    sendMessage,
    deleteDraft,
    markAsSent,
    updateDraft
  }
}
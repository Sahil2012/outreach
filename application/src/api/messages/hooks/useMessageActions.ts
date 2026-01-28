import { useAPIClient } from "@/api/useAPIClient"
import { useMutation } from "@tanstack/react-query"
import { MessageClient } from "../client";
import { GenerateMessageReq } from "../types";
import { toast } from "sonner";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

  const generateMessage = useMutation({
    mutationFn: (message: GenerateMessageReq) => {
      return messageClient.createMessage(message);
    },
    onSuccess: (res) => {
      navigate(`/outreach/preview/${res?.id}`, { state: res });
      toast.success("Follow-up generated successfully.");
    },
    onError: (err) => {
      console.error(err);
      toast.error("We are unable to generate a message at this moment. Please try again later.");
    }
  });

  const sendMessage = useMutation({
    mutationFn: ({ id, threadId, attachResume }: SendMessageVariables) => {
      return messageClient.sendMessage(threadId, id, attachResume);
    },
    onSuccess: () => {
      toast.success("Message sent successfully");
    },
    onError: (err) => {
      console.error(err);
      toast.error("We are unable to send your message at this moment. Please try again later.");
    }
  });

  const deleteDraft = useMutation({
    mutationFn: ({ id }: DeleteDraftVariables) => {
      return messageClient.deleteMessage(id)
    },
    onSuccess: () => {
      toast.success("Draft deleted successfully");
    },
    onError: (err) => {
      console.error(err);
      toast.error("We are unable to delete draft at this moment. Please try again later.");
    }
  });

  const markAsSent = useMutation({
    mutationFn: ({ id }: MarkAsSentVariables) => {
      return messageClient.updateMessage({ id, status: "SENT" })
    },
    onSuccess: () => {
      toast.success("Draft marked as sent");
    },
    onError: (err) => {
      console.error(err);
      toast.error("We are unable to mark this message as sent at this moment. Please try again later.");
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
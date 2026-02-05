import { useAPIClient } from "@/hooks/useAPIClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageService } from "@/services/messageService";
import { GenerateMessageReq, Message } from "@/lib/types/messagesTypes";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { messageKeys } from "./messagesQueryKeys";
import { useGoogleActions } from "@/hooks/google/useGoogleActions";

interface SendMessageVariables {
  id: number;
  threadId: number;
  attachResume: boolean;
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
  const messageClient = new MessageService(client);
  const queryClient = useQueryClient();

  const { reauthorizeWithGoogle } = useGoogleActions();

  const generateMessage = useMutation({
    mutationFn: (message: GenerateMessageReq) => {
      return messageClient.createMessage(message);
    },
    onSuccess: (res) => {
      if (res.id) {
        queryClient.setQueryData(
          messageKeys.detail(res.id),
          (prevData: Message) => {
            return {
              ...prevData,
              ...res,
            };
          },
        );
      }
      toast.success("Message generated successfully.");
    },
    onError: (err) => {
      console.error("Error generating message", err);
      if (isAxiosError(err) && err.response?.status === 429) {
        toast.error(
          "You have reached the limit. Please recharge your credits.",
        );
      } else {
        toast.error(
          "We are unable to generate a message at this moment. Please try again later.",
        );
      }
    },
  });

  const sendMessage = useMutation({
    mutationFn: ({ id, threadId, attachResume }: SendMessageVariables) => {
      return messageClient.sendMessage(threadId, id, attachResume);
    },
    onSuccess: () => {
      toast.success("Message sent successfully");
    },
    onError: (err: any) => {
      console.error("Error sending message", err);
      if (
        (err?.response?.status === 400 &&
          err?.response.data.error === "User not connected with Google") ||
        (err?.response?.status === 422 &&
          err?.response?.data?.error?.code === "oauth_missing_refresh_token")
      ) {
        toast.error("Failed to send email. Please reauthroize with Google.");
        reauthorizeWithGoogle.reauthorize();
      } else {
        toast.error(
          "We are unable to send your message at this moment. Please try again later.",
        );
      }
    },
  });

  const deleteDraft = useMutation({
    mutationFn: ({ id }: DeleteDraftVariables) => {
      return messageClient.deleteMessage(id);
    },
    onSuccess: () => {
      toast.success("Draft deleted successfully");
    },
    onError: (err) => {
      console.error("Error deleting draft", err);
      toast.error(
        "We are unable to delete draft at this moment. Please try again later.",
      );
    },
  });

  const markAsSent = useMutation({
    mutationFn: ({ id }: MarkAsSentVariables) => {
      return messageClient.updateMessage({ id, status: "SENT" });
    },
    onSuccess: () => {
      toast.success("Draft marked as sent");
    },
    onError: (err) => {
      console.error("Error marking message as sent", err);
      toast.error(
        "We are unable to mark this message as sent at this moment. Please try again later.",
      );
    },
  });

  const updateDraft = useMutation({
    mutationFn: ({ id, subject, body }: UpdateDraftVariables) => {
      return messageClient.updateMessage({ id, subject, body });
    },
    onSuccess: () => {
      toast.success("Draft updated successfully");
    },
    onError: (err) => {
      console.error("Error updating draft", err);
      toast.error(
        "We are unable to update this draft at this moment. Please try again later.",
      );
    },
  });

  return {
    generateMessage,
    sendMessage,
    deleteDraft,
    markAsSent,
    updateDraft,
  };
};

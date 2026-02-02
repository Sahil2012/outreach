import { useMessageActions } from "@/api/messages/hooks/useMessageActions";
import { useMessage } from "@/api/messages/hooks/useMessageData";
import { Button } from "@/components/ui/button";
import { Loader, Send } from "lucide-react";
import { toast } from "sonner";
import { SendEmailButtonProps } from ".";

const SendEmail = ({ id, onSend }: SendEmailButtonProps) => {
  const { data: draft } = useMessage(id);
  const { sendMessage } = useMessageActions();

  const handleSendEmail = async () => {
    if (!draft) {
      toast.error("Missing thread or message ID. Cannot send email.");
      return;
    }

    sendMessage.mutate(
      {
        threadId: draft.threadId,
        id: draft.id,
        // manageThread,
        attachResume: true,
      },
      {
        onSuccess: () => {
          toast.success("Email sent successfully!");
          onSend?.();
        },
      },
    );
  };

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handleSendEmail}
      disabled={sendMessage.isPending}
    >
      {sendMessage.isPending ? (
        <Loader className="mr-2" />
      ) : (
        <Send className="mr-2 w-4 h-4" />
      )}
      {sendMessage.isPending ? "Sending..." : "Send Email Now"}
    </Button>
  );
};

export default SendEmail;

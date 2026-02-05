import GenerateMessage from "@/components/function/generate-message-button";
import { useThread } from "@/hooks/threads/useThreadData";
import { PropsWithId } from "@/lib/types/commonTypes";
import { GenerateMessageReq, MessageType } from "@/lib/types/messagesTypes";

const GenerateFollowUp = ({ id }: PropsWithId) => {
  const { data: thread } = useThread(id);

  const canBeFollowedUp =
    thread?.status === "PENDING" ||
    thread?.status === "SENT" ||
    thread?.status === "FIRST_FOLLOW_UP" ||
    thread?.status === "SECOND_FOLLOW_UP";

  const handleGenerateFollowUp = (): GenerateMessageReq => {
    return {
      type: MessageType.FOLLOW_UP,
      threadId: id,
    };
  };

  if (!thread || thread.isAutomated || !canBeFollowedUp) {
    return null;
  }

  return (
    <GenerateMessage
      onGenerate={handleGenerateFollowUp}
      label="Generate Follow Up"
    />
  );
};

export default GenerateFollowUp;

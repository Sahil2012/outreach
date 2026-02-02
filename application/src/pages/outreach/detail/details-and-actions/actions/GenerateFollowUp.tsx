import { useThread } from "@/api/threads/hooks/useThreadData";
import { PropsWithId } from "../..";
import GenerateMessage from "@/components/function/generate-message-button";
import { GenerateMessageReq, MessageType } from "@/api/messages/types";

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

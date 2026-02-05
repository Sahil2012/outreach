import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useMessageActions } from "@/hooks/messages/useMessageActions";
import { GenerateMessageReq } from "@/lib/types/messagesTypes";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { CreditInfo } from "./CreditInfo";

interface GenerateMessageProps {
  onGenerate: () => GenerateMessageReq | undefined;
  label?: string;
}

const GenerateMessage = ({ onGenerate, label }: GenerateMessageProps) => {
  const { generateMessage } = useMessageActions();
  const navigate = useNavigate();

  const buttonLabel = label || "Generate Email";

  const handleGenerate = async () => {
    const messageReq = onGenerate();
    if (messageReq) {
      generateMessage.mutate(messageReq, {
        onSuccess: (res) =>
          navigate(`/outreach/preview/${res.id}`, {
            state: { templateType: messageReq.type },
          }),
      });
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <CreditInfo className="mt-4" />
      <Button
        size="lg"
        onClick={handleGenerate}
        disabled={generateMessage.isPending}
      >
        {generateMessage.isPending ? <Loader className="mr-2" /> : null}
        {generateMessage.isPending ? "Generating..." : buttonLabel}
        {!generateMessage.isPending && (
          <ArrowRight className="w-4 h-4 ml-1 -mr-1" />
        )}
      </Button>
    </div>
  );
};

export default GenerateMessage;

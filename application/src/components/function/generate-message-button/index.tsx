import { Button } from "@/components/ui/button";
import { CreditInfo } from "./CreditInfo";
import { useMessageActions } from "@/api/messages/hooks/useMessageActions";
import { Loader } from "@/components/ui/loader";
import { ArrowRight } from "lucide-react";
import { GenerateMessageReq } from "@/api/messages/types";
import { useNavigate } from "react-router";

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

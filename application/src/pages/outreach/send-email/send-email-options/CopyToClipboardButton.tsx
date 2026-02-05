import { Button } from "@/components/ui/button";
import { useMessage } from "@/hooks/messages/useMessageData";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyToClipboardButtonProps {
  id: number;
}

const CopyToClipboardButton = ({ id }: CopyToClipboardButtonProps) => {
  const [copied, setCopied] = useState(false);

  const { data: draft } = useMessage(id);

  const handleCopyToClipboard = () => {
    if (draft?.body) {
      navigator.clipboard.writeText(draft.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full"
      onClick={handleCopyToClipboard}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copy to Clipboard
        </>
      )}
    </Button>
  );
};

export default CopyToClipboardButton;

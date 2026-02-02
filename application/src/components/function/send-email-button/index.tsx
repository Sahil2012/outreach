import SendEmail from "./SendEmail";
import ConnectToGmailButton from "./ConnectToGmail";
import { useGoogle } from "@/api/google/hooks/useGoogleData";
import { Mail } from "lucide-react";

export interface SendEmailButtonProps {
  id: number;
  onSend: () => void;
  manageThread: boolean;
}

const SendEmailButton = ({
  id,
  manageThread,
  onSend,
}: SendEmailButtonProps) => {
  const { isConnectedToGoogle } = useGoogle();

  const Comp = isConnectedToGoogle ? (
    <SendEmail id={id} manageThread={manageThread} onSend={onSend} />
  ) : (
    <ConnectToGmailButton />
  );

  return (
    <div>
      {Comp}
      <p className="text-[10px] text-center text-muted-foreground">
        <Mail className="inline w-3 h-3 mr-1 align-text-bottom" />
        via your connected Google account
      </p>
    </div>
  );
};

export default SendEmailButton;

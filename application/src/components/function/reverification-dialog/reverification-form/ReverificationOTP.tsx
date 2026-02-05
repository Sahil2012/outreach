import { useAuthActions } from "@/hooks/auth/useAuthActions";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface ReverificationOTPProps {
  code: string;
  onChange: (number: string) => void;
}

const ReverificationOTP = ({ code, onChange }: ReverificationOTPProps) => {
  const { verification } = useAuthActions();

  return (
    <InputOTP
      maxLength={6}
      value={code}
      onChange={(value) => onChange(value)}
      disabled={verification.isVerifying || verification.isSendingCode}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
};

export default ReverificationOTP;

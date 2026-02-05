import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface ReverificationOTPProps {
  code: string;
  onChange: (number: string) => void;
  isLoading: boolean;
}

const ReverificationOTP = ({
  code,
  onChange,
  isLoading,
}: ReverificationOTPProps) => {
  return (
    <InputOTP
      maxLength={6}
      value={code}
      onChange={(value) => onChange(value)}
      disabled={isLoading}
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

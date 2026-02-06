import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FormControlProps } from "@/lib/types/commonTypes";

const OTPInput = ({ value, onChange, disabled }: FormControlProps<string>) => {
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onChange={(value) => onChange(value)}
      disabled={disabled}
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

export default OTPInput;

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/clerk-react";

interface ProfileInfoFormProps {
  firstName: string;
  lastName: string;
  onChangeFirstName: (firstName: string) => void;
  onChangeLastName: (lastName: string) => void;
}

const ProfileInfoForm = ({
  firstName,
  lastName,
  onChangeFirstName,
  onChangeLastName,
}: ProfileInfoFormProps) => {
  const { user } = useUser();

  return (
    <div className="flex flex-col grow gap-6">
      <div className="flex flex-col">
        <p className="text-base font-semibold">Email</p>
        <p className="text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={firstName}
          className="max-w-96"
          onChange={(e) => onChangeFirstName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={lastName}
          className="max-w-96"
          onChange={(e) => onChangeLastName(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProfileInfoForm;

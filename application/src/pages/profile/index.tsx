import { Loader } from "../../components/ui/loader";
import { useProfile } from "@/api/profile/hooks/useProfileData";
import ProfessionalInfo from "./professional-info";
import PersonalInfo from "./profile-info";

export default function ProfilePage() {
  const { isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Profile & Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and professional profile
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        <PersonalInfo />
        <ProfessionalInfo />
      </div>
    </div>
  );
}

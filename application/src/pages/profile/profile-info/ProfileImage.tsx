import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import { Camera } from "lucide-react";
import { toast } from "sonner";

const ProfileImage = () => {
  const { user } = useUser();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        await user.setProfileImage({ file });
        toast.success("Profile image updated successfully!");
      } catch (error) {
        console.error("Failed to update profile image:", error);
        toast.error("Failed to update profile image.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative group">
        <Avatar className="w-36 h-36 border-4 border-background shadow-xl">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {user?.firstName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer backdrop-blur-sm">
          <Camera className="w-6 h-6" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-xs max-w-48 text-muted-foreground">
          Click the avatar to change your photo
        </p>
      </div>
    </div>
  );
};

export default ProfileImage;

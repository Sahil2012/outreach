import { useAPIClient } from "@/api/useAPIClient"
import { useMutation } from "@tanstack/react-query"
import { ProfileClient } from "../client";
import { Profile } from "../types";

interface UploadResumeVariables {
  resume: File;
  attachResume: boolean;
}

export const useProfileActions = () => {
  const client = useAPIClient();
  const profileClient = new ProfileClient(client);

  const uploadResume = useMutation({
    mutationFn: ({ resume, attachResume }: UploadResumeVariables) => {
      return profileClient.uploadResume(resume, attachResume);
    }
  });

  const updateProfile = useMutation({
    mutationFn: (profile: Partial<Profile>) => {
      return profileClient.updateProfile(profile);
    }
  });

  return { uploadResume, updateProfile }
}
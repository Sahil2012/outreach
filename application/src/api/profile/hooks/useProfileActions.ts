import { useAPIClient } from "@/api/useAPIClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileClient } from "../client";
import { Profile } from "../types";
import { toast } from "sonner";
import { profileKeys } from "../queryKeys";

interface UploadResumeVariables {
  resume: File;
  autofill: boolean;
}

export const useProfileActions = () => {
  const client = useAPIClient();
  const profileClient = new ProfileClient(client);
  const queryClient = useQueryClient();

  const uploadResume = useMutation({
    mutationFn: ({ resume, autofill }: UploadResumeVariables) => {
      return profileClient.uploadResume(resume, autofill);
    },
    onSuccess: (_, variables) => {
      if (variables.autofill) {
        toast.success(
          "Your resume has been successfully uploaded and sent for processing.",
        );
      } else {
        toast.success("Your resume has been uploaded successfully.");
      }
    },
    onError: (err) => {
      console.error("Failed to upload resume", err);
      toast.error(
        "We are unable to upload your resume at this moment. Please try again later.",
      );
    },
  });

  const updateProfile = useMutation({
    mutationFn: (profile: Partial<Profile>) => {
      return profileClient.updateProfile(profile);
    },
    onSuccess: (newData) => {
      toast.success("Your profile has been updated successfully.");
      queryClient.setQueryData(
        profileKeys.detail,
        (prevData: Profile): Profile => {
          return {
            ...prevData,
            ...newData,
          };
        },
      );
    },
    onError: (err) => {
      console.error("Failed to update profile", err);
      toast.error(
        "We are facing some issues in updating your profile at this moment. Please try again later.",
      );
    },
  });

  return { uploadResume, updateProfile };
};

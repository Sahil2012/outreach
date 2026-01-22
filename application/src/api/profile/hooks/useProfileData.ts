import { useQuery } from "@tanstack/react-query"
import { profileKeys } from "../queryKeys"
import { useAPIClient } from "@/api/useAPIClient"
import { ProfileClient } from "../client";

export const useProfile = () => {
  const client = useAPIClient();
  const profileClient = new ProfileClient(client);

  return useQuery({
    queryKey: profileKeys.detail,
    queryFn: () => {
      return profileClient.getProfile();
    },
  });
}

export const useProfileStats = () => {
  const client = useAPIClient();
  const profileClient = new ProfileClient(client);

  return useQuery({
    queryKey: profileKeys.stats,
    queryFn: () => {
      return profileClient.getProfileStats();
    }
  })
}
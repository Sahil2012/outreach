import { useQuery } from "@tanstack/react-query";
import { profileKeys } from "../queryKeys";
import { useAPIClient } from "@/api/useAPIClient";
import { ProfileClient } from "../client";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

const POLL_INTERVAL = 10 * 1000;

interface UseProfileProps {
  pollCount: number;
  setPollCount: Dispatch<SetStateAction<number>>;
  maxPoll: number;
}

export const useProfile = (props?: UseProfileProps) => {
  const client = useAPIClient();
  const profileClient = new ProfileClient(client);
  const [isPolling, setIsPolling] = useState(props?.pollCount === 0);

  return {
    isPolling,
    ...useQuery({
      queryKey: profileKeys.detail,
      queryFn: () => {
        console.log("fetching data");
        const res = profileClient.getProfile();
        if (props) {
          props?.setPollCount?.((prev) => prev + 1);
        }
        return res;
      },
      staleTime: 5 * 60 * 1000,
      refetchInterval: (query) => {
        const newData = query.state.data;

        if (
          props &&
          props.pollCount >= 0 &&
          props.pollCount < props.maxPoll &&
          newData?.status === "PROCESSING"
        ) {
          setIsPolling(true);
          return POLL_INTERVAL;
        }

        if (isPolling && props && props.pollCount >= props.maxPoll) {
          toast.error("We were unable to process your resume at the moment ");
          setIsPolling(false);
        }
        return false;
      },
    }),
  };
};

export const useProfileStats = () => {
  const client = useAPIClient();
  const profileClient = new ProfileClient(client);

  return useQuery({
    queryKey: profileKeys.stats,
    queryFn: () => {
      return profileClient.getProfileStats();
    },
    staleTime: 5 * 60 * 1000,
  });
};

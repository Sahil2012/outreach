import { useQuery } from "@tanstack/react-query"
import { messageKeys } from "../queryKeys"
import { useAPIClient } from "@/api/useAPIClient"
import { MessageClient } from "../client";

export const useMessage = (id: number) => {
  const client = useAPIClient();
  const messageClient = new MessageClient(client);

  return useQuery({
    queryKey: messageKeys.detail(id),
    queryFn: () => {
      return messageClient.getMessage(id);
    },
    staleTime: 5 * 60 * 1000
  });
}

export const useMessageTypes = () => {
  const client = useAPIClient();
  const messageClient = new MessageClient(client);

  return useQuery({
    queryKey: messageKeys.types(),
    queryFn: () => {
      return messageClient.getMessageTypes();
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
};

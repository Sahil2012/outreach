import { ThreadsParams } from "../../lib/types/threadsTypes";

export const threadKeys = {
  all: ["threads"] as const,
  lists: () => [...threadKeys.all, "list"] as const,
  list: (params: ThreadsParams) => [...threadKeys.lists(), { filters: params }] as const,
  details: () => [...threadKeys.all, "detail"] as const,
  detail: (id: number) => [...threadKeys.details(), id] as const,
}
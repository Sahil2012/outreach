export const messageKeys = {
  all: ["messages"] as const,
  detail: (id: number) => [...messageKeys.all, id] as const,
  types: () => [...messageKeys.all, "types"] as const
}
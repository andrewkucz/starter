import { getQueryClient } from "@/lib/tanstack-query/client";

export const getContext = () => {
  return {
    queryClient: getQueryClient(),
  };
};

export type RouterContext = ReturnType<typeof getContext>;

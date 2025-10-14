import { createBrowsers, deleteBrowsers, updateBrowsers } from "@/lib/api/browsers";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export type BrowserData = {
  title: string;
  body: string;
  userId: number 
};

export type BrowserUpdateData = {
  id: number,
  title: string;
  body: string;
  userId: number 
};

export const useBrowsersMutation = function () {
  const queryClient = useQueryClient();
  const queryKey = ['browsers'];

  const create = useMutation({
    mutationFn: ({ data }: { data: BrowserData}) => createBrowsers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error(`Fail to create browser, error message: ${error.message}`);
    }
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BrowserData }) => updateBrowsers(id, data),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error(`Fail to update browser, error message: ${error.message}`);
    }
  });

  const remove = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteBrowsers(id),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      // previous data for rollback if remove fail
      const previousData = queryClient.getQueryData<BrowserUpdateData[]>(queryKey)

      // Optimistically remove from cache
      if (previousData) {
        queryClient.setQueryData(
          queryKey,
          previousData.filter(brower => brower.id !== variables.id)
        )
      }
      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error, variables, context) => {
      console.error(`Fail to delete browser, error message: ${error.message}`);
      
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  })

  return { create, update, remove };
}
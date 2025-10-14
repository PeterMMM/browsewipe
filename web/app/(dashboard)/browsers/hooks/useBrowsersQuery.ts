'use client'
import { getBrowsers } from "@/lib/api/browsers";
import { GetBrowsersFilters } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useBrowsersQuery({ browsersFilters, initialData }: { browsersFilters: GetBrowsersFilters; initialData? : any;}) {
  return useQuery({
    queryKey: ['browsers', browsersFilters],
    queryFn: ({ queryKey: [, filters]}) => {
      return getBrowsers(filters as GetBrowsersFilters);
    },
    initialData,
  });
}
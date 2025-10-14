import { GetBrowsersFilters } from "@/types";
import { create } from "zustand";

type FilterStore = {
  browsersFilters: GetBrowsersFilters;
  setBrowsersFilters: (newBrowsersFilter?: GetBrowsersFilters) => void;
  resetBrowsersFilter: () => void;
}

export const useBrowsersFilter = create<FilterStore>((set) => ({
  browsersFilters: {
    userId: '',
    searchTerm: '',
  },
  setBrowsersFilters: (newBrowsersFilter) => set((state) => ({
    browsersFilters: {
      ...state.browsersFilters,
      ...newBrowsersFilter,
    }
  })),
  resetBrowsersFilter: () => set({ 
    browsersFilters : {
      userId: '',
      searchTerm: '',
    }
  })
}))
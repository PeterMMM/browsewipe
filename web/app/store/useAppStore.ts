import { create } from "zustand";

export const useAppStore = create((set) => ({
  // fiters: GetBroswersFilters
  // browsers: [],
  // totalBrowser: 0,
  // setBrowsers: (newBrowsers) => set({
  //   browsers: newBrowsers,
  //   totalBrowser: newBrowsers.length,
  // }),

  // profileInfo: {
  //   name: 'Guest',
  //   username: 'username',
  //   email: 'user@example.com',
  // },
  // updateProfileInfo: (newProfileInfo) => set((state) => ({
  //   profileInfo: {
  //     ...state.profileInfo,
  //     ...newProfileInfo
  //   }
  // })),

  // Auth State
  // isAuthenticated: false,
  // rememberLogin: false,
  // toggleRememberLogin: () => set((state) => ({ 
  //   rememberLogin: !state.rememberLogin 
  // })),

  // login: (userInfo) => set({
  //   profileInfo: userInfo,
  //   isAuthenticated: true,
  // })
}))
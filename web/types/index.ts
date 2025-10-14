export type BrowserData = {
  title: string;
  body: string;
  userId: number
}

export type GetBrowsersFilters = {
  userId?: string | '';
  searchTerm?: string | '';
}

import { BrowserData, GetBrowsersFilters } from "@/types/index";

export async function getBrowsers(filters?: GetBrowsersFilters) {
  let params = '';
  if (filters) {
    params += (filters.userId || filters.searchTerm) ? '?' : '';
    params += filters?.userId ? 'userId='+filters.userId : '';
    params += (filters.userId && filters.searchTerm) ? '&' : '';
    params += filters?.searchTerm ? 'searchTerm='+filters.searchTerm : '';
  }
  const response = await fetch(`/api/browsers${params}`);
  if (! response.ok) {
    throw new Error(`Failed to fetch browsers: ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}

export async function createBrowsers(data: BrowserData) {
  const response = await fetch('/api/browsers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (! response.ok) {
    throw new Error(`Failed to create browser: ${response.statusText}`);
  }

  const json = await response.json();
  return json;
}

export async function updateBrowsers(id: number, data: BrowserData) {
  const response = await fetch(`/api/browsers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (! response.ok) {
    throw new Error(`Failed to update browser: ${response.statusText}`);
  }

  const json = await response.json();
  return json;
}

export async function deleteBrowsers(id: number) {
  const response = await fetch(`/api/browsers/${id}`, {
    method: 'DELETE'
  });
  
  if (! response.ok) {
    throw new Error(`Failed to delete browser ID ${id} with status ${response.statusText}`);
  }

  return true;
}
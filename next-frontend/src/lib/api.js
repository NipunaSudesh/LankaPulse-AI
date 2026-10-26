const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
}

export const API_ENDPOINTS = {
  news: `${API_BASE_URL}/news`,
  categories: `${API_BASE_URL}/categories`,

  newsById: (id) =>
    `${API_BASE_URL}/news/${encodeURIComponent(String(id))}`,
};

async function fetchJSON(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchNews(category) {
  const url = new URL(API_ENDPOINTS.news);

  if (category) {
    url.searchParams.set("category", category);
  }

  const result = await fetchJSON(url.toString());

  return result.data;
}

export async function fetchCategories() {
  const result = await fetchJSON(API_ENDPOINTS.categories);

  return result.data;
}

export async function fetchNewsById(id) {
  return fetchJSON(API_ENDPOINTS.newsById(id));
}
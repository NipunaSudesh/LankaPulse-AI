
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  news: `${API_BASE_URL}/news`,

  newsById: (id) =>
    `${API_BASE_URL}/news/${encodeURIComponent(String(id))}`,
};

export async function fetchNews(category) {
  const url = new URL(API_ENDPOINTS.news);

  if (category) {
    url.searchParams.set("category", category);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.status}`);
  }

  return response.json();
}

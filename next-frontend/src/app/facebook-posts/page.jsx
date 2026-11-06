import Link from "next/link";
import FacebookPostCard from "@/components/FacebookPostCard";
import { getFacebookPosts } from "@/lib/api";

export const metadata = { title: "Latest Facebook Posts" };

export default async function FacebookPostsPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const { data: posts, pagination } = await getFacebookPosts(page);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Latest Facebook Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <FacebookPostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        {pagination.current_page > 1 ? (
          <Link
            href={`?page=${pagination.current_page - 1}`}
            className="rounded bg-gray-200 px-4 py-2 text-sm"
          >
            ← Previous
          </Link>
        ) : (
          <span />
        )}

        <span className="text-sm text-gray-500">
          Page {pagination.current_page} of {pagination.last_page}
        </span>

        {pagination.current_page < pagination.last_page ? (
          <Link
            href={`?page=${pagination.current_page + 1}`}
            className="rounded bg-gray-200 px-4 py-2 text-sm"
          >
            Next →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
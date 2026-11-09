
import Link from "next/link";
import { Suspense } from "react";
import FacebookPostCard from "@/components/FacebookPostCard";
import { getFacebookPosts } from "@/lib/api";

export const metadata = {
  title: "Latest Facebook Posts",
};

function LoadingPosts() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Latest Facebook Posts
      </h1>

      <p className="py-12 text-center text-gray-500">
        Loading Facebook posts...
      </p>
    </main>
  );
}

async function FacebookPostsContent({ searchParams }) {
  const params = await searchParams;

  const page = Math.max(
    1,
    Number(params?.page) || 1
  );

  const response = await getFacebookPosts(page);

  const posts = response?.data ?? [];
  const pagination = response?.pagination ?? {
    current_page: page,
    last_page: 1,
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Latest Facebook Posts
      </h1>

      {/* Facebook Posts */}
      {posts.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          No posts yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <FacebookPostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-8 flex items-center justify-between">

          {pagination.current_page > 1 ? (
            <Link
              href={`?page=${pagination.current_page - 1}`}
              className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 transition hover:bg-gray-300"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-gray-500">
            Page {pagination.current_page} of{" "}
            {pagination.last_page}
          </span>

          {pagination.current_page < pagination.last_page ? (
            <Link
              href={`?page=${pagination.current_page + 1}`}
              className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 transition hover:bg-gray-300"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}

        </div>
      )}
    </main>
  );
}

export default function FacebookPostsPage({ searchParams }) {
  return (
    <Suspense fallback={<LoadingPosts />}>
      <FacebookPostsContent searchParams={searchParams} />
    </Suspense>
  );
}

export default function FacebookPostCard({ post }) {
  const article = post.news_article;

  const date = post.published_at
    ? new Date(post.published_at).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  return (
    <article className="mx-auto w-full max-w- overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm font-sans">

      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          LP
        </div>

        <div className="min-w-0 flex-1">
          <p className="text- font-semibold leading-tight text-gray-900">
            LankaPulse AI
          </p>
          <p className="flex items-center gap-1 text- leading-tight text-gray-500">
            {date} <span>·</span> <span>🌐</span>
          </p>
        </div>

        <button className="px-2 text-xl leading-none text-gray-500">...</button>
        <button className="text-xl leading-none text-gray-500">✕</button>
      </div>

      {/* ===== CAPTION : TITLE + CONTENT ===== */}
      <div className="px-4 pb-3">
        <h3 className="text- font-semibold leading-snug text-gray-900">
          {article?.title}
        </h3>
        <p className="mt-1 whitespace-pre-line text- leading-snug text-gray-800 line-clamp-6">
          {post.message}
        </p>
      </div>

      {/* ===== IMAGE : 75% WIDTH / 75% HEIGHT, LEFT TOP, TITLE ON IMAGE ===== */}
      {article?.image_url && (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gray-100"
        >
          <div className="relative mx-auto aspect-[4/3]  overflow-hidden bg-gray-200 ">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image_url}
              alt={article.title}
              className="h-full w-full object-cover object-top-left transition-transform duration-300 ease-in-out scale-105"
              loading="lazy"
            />

            {/* Title on Top of Image */}
            <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/75 via-black/30 to-transparent p-3 pb-8">
              <p className="line-clamp-2 text- font-semibold leading-snug text-white drop-shadow">
                {article?.title}
              </p>
            </div>


          </div>
        </a>
      )}




    </article>
  );
}
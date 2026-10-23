
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.onlanka.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.lankabusinessonline.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "www.vikalpa.org",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/products/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noimageindex" },
        ],
      },
      {
        source: "/categories/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noimageindex" },
        ],
      },
      {
        source: "/img/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, noimageindex" },
        ],
      },
    ];
  },
};

export default nextConfig;

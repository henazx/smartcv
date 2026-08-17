/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable webpack cache in development to prevent corruption on Windows
  ...(process.env.NODE_ENV === "development" && {
    webpack: (config) => {
      config.cache = false;
      return config;
    },
  }),
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        ],
      },
    ];
  },
};

export default nextConfig;

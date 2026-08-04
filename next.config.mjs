/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable webpack cache in development to prevent corruption on Windows
  ...(process.env.NODE_ENV === "development" && {
    webpack: (config) => {
      config.cache = false;
      return config;
    },
  }),
};

export default nextConfig;

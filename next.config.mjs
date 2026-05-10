/** @type {import('next').NextConfig} */
const vercelUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || vercelUrl || "http://localhost:3000",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;

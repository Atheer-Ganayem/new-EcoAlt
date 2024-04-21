/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AWS: "https://eco-alt-project.s3.eu-central-1.amazonaws.com/",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eco-alt-project.s3.eu-central-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to allow npm start
  // output: 'export', // Uncomment this line for static export
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

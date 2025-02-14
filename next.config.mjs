/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // 🔹 Asegura que Next.js se ejecute como servidor en producción
};

module.exports = nextConfig;

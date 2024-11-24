/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        PUBLIC_DB_CONNECTION: process.env.MONGODB_URI,
    },
};

export default nextConfig;


  
/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        PUBLIC_DB_CONNECTION: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET, 
    },
};

export default nextConfig;


  
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/todo_nextjs_frontend',
    assetPrefix: '/todo_nextjs_frontend/',
    trailingSlash: true,
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
};

export default nextConfig;

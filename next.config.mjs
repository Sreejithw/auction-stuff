/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-dd33c48a7b8641d2915fbbf0cb5cf49b.r2.dev',
                port: '',
            }
        ]
    }
};

export default nextConfig;

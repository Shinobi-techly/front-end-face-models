/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    // Note: .next is a symlink to C:/Temp/face-attendance-next to work around
    // E: drive filesystem corruption (lmdb database fails with os error 1392)
    turbopack: {},
    // Disable TypeScript completely
    typescript: {
        ignoreBuildErrors: true,
    },
    async headers() {
        return [
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/javascript; charset=utf-8',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;

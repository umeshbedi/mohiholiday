/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        unoptimized: false,
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**',
            port: '',
            pathname: '/**',
          },
        ],
      },
      allowedDevOrigins: ['10.93.90.234'],
};

export default nextConfig;

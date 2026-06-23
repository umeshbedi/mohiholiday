/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        unoptimized: false,
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'picsum.photos',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'i.imgur.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: '*.googleusercontent.com',
            port: '',
            pathname: '/**',
          },

        ],
      },
      allowedDevOrigins: ['10.93.90.234'],
};

export default nextConfig;

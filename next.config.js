/** @type {import('next').NextConfig} */
const nextConfig = {
  // 💡 아래 images 설정을 추가합니다.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
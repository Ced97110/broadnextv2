/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        hostname: 'voc-repository.s3.us-east-2.amazonaws.com',

      }
    ],
    dangerouslyAllowSVG: true
  }
};

module.exports = nextConfig;

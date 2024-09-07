/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        hostname: 'voc-repository.s3.us-east-2.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'soyacincau.com'
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com'
      },
      {
        protocol: 'https',
        hostname: 'electrek.co'
      },
      {
        protocol: 'https',
        hostname: 'img.etimg.com'
      },
      {
        protocol: 'https',
        hostname: 'i.insider.com'
      },
      {
        protocol: 'https',
        hostname: 'ichef.bbci.co.uk'
      },
      {
        protocol: 'https',
        hostname: 's.yimg.com'
      },
      {
        protocol: 'https',
        hostname: 'images.axios.com'
      },
      {
        protocol: 'https',
        hostname: 'www.investopedia.com'
      },
      {
        protocol: 'https',
        hostname: 'i.kinja-img.com'
      },
      {
        protocol: 'https',
        hostname: 'nextbigfuture.s3.amazonaws.com'
      },
      {
        hostname:'www.americanbankingnews.com'
      },
      {
        hostname:"media.zenfs.com"
      },
      {
        hostname:"edgecast-img.yahoo.net"
      },
      {
        hostname:"voc-repository.s3.us-east-2.amazonaws.com"
      },
    ],
    dangerouslyAllowSVG: true,
  }
};

module.exports = nextConfig;

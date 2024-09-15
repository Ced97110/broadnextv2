/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'voc-repository.s3.us-east-2.amazonaws.com',
        pathname: '/companymedia/**',
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
      {
        hostname:"cleantechnica.com"
      },
      {
        hostname:"i-invdn-com.investing.com"
      },
      {
        hostname:"voc-repository.s3.us-east-2.amazonaws.com"
      },
      {
        hostname:'apicms.thestar.com.my'
      },
      {
        hostname:"onecms-res.cloudinary.com"
      },
      {
        hostname:"lh3.googleusercontent.com"
      },
      {
        hostname:"image.cnbcfm.com"
      },
      {
        hostname:"c.ndtvimg.com"
      },
      {
        hostname:"cdn.decrypt.co"
      },
      {
        hostname:'imageio.forbes.com'
      },
      {
        hostname:"techcrunch.com"
      },
      {
        hostname:"media.breitbart.com"
      },
      {
        hostname:'img.thedailybeast.com'
      },
      {
        hostname:"ml.globenewswire.com"
      },
      {
        hostname:'ml.globenewswire.com'
      },
      {
        hostname:"cdn.bmwblog.com"
      },
      {
        hostname:"static.toiimg.com"
      },
      {
        protocol: 'https',
        hostname: 'voc-repository.s3.us-east-2.amazonaws.com',
        pathname: '/companymedia/**',
      },
    ],
    dangerouslyAllowSVG: true,
  }
};

module.exports = nextConfig;

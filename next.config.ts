const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? '/auction-market-simulation/' : '',
  basePath: isProd ? '/auction-market-simulation' : '',
  output: 'export'
};

export default nextConfig;
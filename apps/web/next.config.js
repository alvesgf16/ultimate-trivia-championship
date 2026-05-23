import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(webpackConfig) {
    webpackConfig.performance = {
      ...webpackConfig.performance,
      hints: 'warning',
      maxAssetSize: 307200,
      maxEntrypointSize: 307200,
    };
    return webpackConfig;
  },
};

export default withBundleAnalyzer(nextConfig);

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require('remark-gfm')],
    rehypePlugins: [require('rehype-slug'), require('rehype-highlight')],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: '/git-github/:slug',
        destination: '/git-github',
        permanent: true,
      },
    ]
  },
}

module.exports = withMDX(nextConfig)

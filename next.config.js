const fs = require('fs')
const path = require('path')

/**
 * Tracks whose tutorial lives entirely on the landing page have no sub-article
 * URLs, but Google still holds stale ones from an earlier structure. Redirect
 * those to the landing page — and stop as soon as a real sub-article exists, so
 * adding `content/git-github/<slug>.mdx` is never silently swallowed by a 301.
 */
function legacySubArticleRedirects() {
  return ['git-github'].flatMap((track) => {
    const dir = path.join(__dirname, 'content', track)
    const hasArticles =
      fs.existsSync(dir) &&
      fs
        .readdirSync(dir)
        .some((file) => /\.mdx?$/.test(file) && !file.startsWith('index.'))

    return hasArticles
      ? []
      : [{ source: `/${track}/:slug`, destination: `/${track}`, permanent: true }]
  })
}

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
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  async redirects() {
    return legacySubArticleRedirects()
  },
}

module.exports = withMDX(nextConfig)

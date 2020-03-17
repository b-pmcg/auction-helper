require('dotenv').config()

const withMDX = require('@next/mdx')()

module.exports = withMDX({
  // assetPrefix: './',
  // exportTrailingSlash: true,

  env: {
    IPFS: process.env.IPFS,
  },
})

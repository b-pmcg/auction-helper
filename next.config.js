require('dotenv').config();

const withMDX = require('@next/mdx')();

module.exports = withMDX({
  // assetPrefix: './',
  // exportTrailingSlash: true,

  env: {
    IPFS: process.env.IPFS,
    INFURA_KEY: '6ba7a95268bf4ccda9bf1373fe582b43'
  }
});

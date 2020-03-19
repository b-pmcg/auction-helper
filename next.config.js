require('dotenv').config();

const withMDX = require('@next/mdx')();

module.exports = withMDX({
  // assetPrefix: './',
  // exportTrailingSlash: true,
  publicRuntimeConfig: {
    INFURA_KEY: process.env.INFURA_KEY,
    SYNC_INTERVAL: process.env.SYNC_INTERVAL,
    kovan: {
      CACHE_API: process.env.KOVAN_CACHE_API
    },
    mainnet: {
      CACHE_API: process.env.CACHE_API
    },
  },  
  env: {
    IPFS: process.env.IPFS,    
  }
});

require('dotenv').config()

module.exports = {
  assetPrefix: './',
  exportTrailingSlash: true,

  env: {
    IPFS: process.env.IPFS,
  },

}

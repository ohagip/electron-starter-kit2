/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge')
const commonConfiguration = require('./common.js')

module.exports = merge(commonConfiguration, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    // host: 'local-ip',
    // open: true,
    // liveReloadを有効にするときはHMRを無効する
    // liveReload: true,
    // hot: false,
  },
})

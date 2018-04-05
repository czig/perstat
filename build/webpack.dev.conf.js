'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.DefinePlugin({
      'check_portal': '"SANE"',
      'axios_url': '"http://localhost:5005/api"',
      'axios_url_civ_inv': '"http://localhost:5005/api/civilian_inv_post"',
      'axios_url_enl_promo': '"http://localhost:5005/api/enlisted_promo_post"',
      'axios_url_enl_ret': '"http://localhost:5005/api/enlisted_ret_post"',
      'axios_url_enl_man': '"http://localhost:5005/api/enlisted_post"',
      'axios_url_off_pro': '"http://localhost:5005/api/officer_promo"',
      'axios_url_off_man': '"http://localhost:5005/api/officer_post"',
      'axios_url_join_spouse': '"http://localhost:5005/api/join_spouse"',  
      'axios_url_off_tos': '"http://localhost:5005/api/officer_tos"',
      'axios_url_enl_tos': '"http://localhost:5005/api/enlisted_tos"',
      'axios_url_adman': '"http://localhost:5005/api/admanning_post"'
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})

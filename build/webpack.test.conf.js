'use strict'
// This is the webpack config used for unit tests.

const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const webpackConfig = merge(baseWebpackConfig, {
  // use inline sourcemap for karma-sourcemap-loader
  module: {
    rules: utils.styleLoaders()
  },
  devtool: '#inline-source-map',
  resolveLoader: {
    alias: {
      // necessary to to make lang="scss" work in test when using vue-loader's ?inject option
      // see discussion at https://github.com/vuejs/vue-loader/issues/724
      'scss-loader': 'sass-loader'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/test.env')
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
      'axios_url_adman': '"http://localhost:5005/api/admanning_post"',
      'axios_url_efmp': '"http://localhost:5005/api/EFMP"',
      'axios_url_off_stem': '"http://localhost:5005/api/officer_stem"',
      'axios_url_enl_stem': '"http://localhost:5005/api/enlisted_stem"',
    }),
  ]
})

// no need for app entry during tests
delete webpackConfig.entry

module.exports = webpackConfig

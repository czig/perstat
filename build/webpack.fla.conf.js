'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

var fla = '';
if (process.env.PROD_TYPE)
  fla = process.env.PROD_TYPE;

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.DefinePlugin({
      
      //FLA BUILD - HIS MUST be run for PROD DEPLOYMENT
      'axios_url': '"https://starsraw.afpc.randolph.af.mil/"',
      'axios_url_civ_inv': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/ps_civilian_inv.json"',
      'axios_url_enl_promo': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/ps_enlisted_promo.json"',
      'axios_url_enl_ret': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/PS_ENL_RET.js"',
      'axios_url_enl_man': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/PS_ENL.js"',
      'axios_url_off_pro': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/ps_off_promo.json"',
      'axios_url_off_man': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/PS_OFF.js"',
      'axios_url_adman': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/PS_ALL.js"',
      'axios_url_off_tos': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/officer_tos.js"',
      'axios_url_enl_tos': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/enlisted_tos.js"',
      'axios_url_join_spouse': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/join_spouse.js"', 
      'axios_url_efmp': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/EFMP.js"',    
      'axios_url_adman': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/ps_off_enl_ad.js"',
      'axios_url_angman': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/ps_off_enl_ang.js"',
      'axios_url_afrman': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/ps_off_enl_ar.js"',      
      'axios_url_high_ed_level': '"https://starsraw.afpc.randolph.af.mil/FLA/perstat_json/ps_high_ed_level.js"',
    }),
    // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'production'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      //changed minify props from true to false
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true 
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig

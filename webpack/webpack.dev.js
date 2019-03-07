'use strict';
const utils = require('./vue.utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const jhiUtils = require('./utils.js');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

/**
 * 通过选择 development 或 production 之中的一个，来设置 mode 参数，你可以启用相应模式下的 webpack 内置的优化
 */
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  //https://www.webpackjs.com/concepts/
  devtool: config.dev.devtool,
  //入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。
  entry: {
    global: './src/main/webapp/content/scss/global.scss',
    main: './src/main/webapp/app/main'
  },
  //output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist
  output: {
    path: jhiUtils.root('target/www'),
    filename: 'app/[name].bundle.js',
    chunkFilename: 'app/[id].chunk.js'
  },
  devServer: {
    contentBase: './target/www',
    port: 9060,
    proxy: [
      {
        context: [
          /* jhipster-needle-add-entity-to-webpack - JHipster will add entity api paths here */
          '/api',
          '/management',
          '/swagger-resources',
          '/v2/api-docs',
          '/h2-console',
          '/auth'
        ],
        target: 'http://127.0.0.1:8080',
        secure: false,
        headers: { host: 'localhost:9000' }
      }
    ],
    watchOptions: {
      ignored: /node_modules/
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 9000,
        proxy: {
          target: 'http://localhost:9060'
        },
        socket: {
          clients: {
            heartbeatTimeout: 60000
          }
        }
      },
      {
        reload: false
      }
    ),
    // https://github.com/ampedandwired/html-webpack-plugin
    //指定模板页面
    new HtmlWebpackPlugin({
      template: 'src/main/webapp/index.html',
      chunks: ['vendors', 'main', 'global'],
      chunksSortMode: 'manual',
      inject: true
    })
  ]
});

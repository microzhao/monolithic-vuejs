'use strict';
const path = require('path');
const vueLoaderConfig = require('./loader.conf');
const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main/webapp/app/main.ts'
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src/main/webapp/app')
    }
  },
  /**
   * loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。
   * loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。
   *  webpack 的配置中 loader 有两个目标：
        1. test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
        2. use 属性，表示进行转换时，应该使用哪个 loader。
   */
  module: {
    // 一大波的转换规则
    rules: [
      {
        // 嘿，webpack 编译器，当你碰到「在 require()/import 语句中被解析为 '.vue' 的路径」时，在你对它打包之前，先使用 vue-loader 转换一下。
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: ['\\.vue$'],
              happyPackMode: false
            }
          }
        ],
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'content/[hash].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'content/[hash].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'content/[hash].[ext]'
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  /**
   * loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。
   * 插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。
想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。多数插件可以通过选项(option)自定义。
你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。
   */
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      { from: './node_modules/swagger-ui/dist/css', to: 'swagger-ui/dist/css' },
      { from: './node_modules/swagger-ui/dist/lib', to: 'swagger-ui/dist/lib' },
      { from: './node_modules/swagger-ui/dist/swagger-ui.min.js', to: 'swagger-ui/dist/swagger-ui.min.js' },
      { from: './src/main/webapp/swagger-ui/', to: 'swagger-ui' },
      { from: './src/main/webapp/content/', to: 'content' },
      { from: './src/main/webapp/favicon.ico', to: 'favicon.ico' },
      {
        from: './src/main/webapp/manifest.webapp',
        to: 'manifest.webapp'
      },
      // jhipster-needle-add-assets-to-webpack - JHipster will add/remove third-party resources in this array
      { from: './src/main/webapp/robots.txt', to: 'robots.txt' }
    ])
  ]
};

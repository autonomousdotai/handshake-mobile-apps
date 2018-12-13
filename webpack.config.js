const path = require('path');
const fs = require('fs');
// const UnusedWebpackPlugin = require('unused-webpack-plugin');
const xPath = filepath => path.resolve(__dirname, filepath);

// Webpack
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PwaManifestPlugin = require('webpack-pwa-manifest');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// configs
const envConfig = require('./.env.js');

module.exports = function webpackConfig(env, argv = {}) {
  const isProduction = argv.mode === 'production';

  const stats = {
    modules: false,
    children: false,
    chunks: false,
    assets: false
  };

  let appEnvConfig = {
    NODE_ENV: argv.mode,
    isProduction,
    ...envConfig
  };

  const development = {
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      // new UnusedWebpackPlugin({
      //   // Source directories
      //   directories: [path.join(__dirname, 'src')],
      //   // Exclude patterns
      //   exclude: ['*.test.js'],
      //   // Root directory (optional)
      //   root: __dirname,
      // }),
    ],
    devServer: {
      watchContentBase: true,
      stats,
      publicPath: '/',
      historyApiFallback: {
        disableDotRule: true
      },
      hot: true,
      host: '0.0.0.0'
    }
  };

  const production = {
    optimization: {
      minimize: true,
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true,
          uglifyOptions: {
            compress: {
              drop_console: appEnvConfig.dropConsole
            }
          }
        })
      ],
      splitChunks: {
        chunks: 'all'
      },
      noEmitOnErrors: true
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new OptimizeCSSAssetsPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[hash].[name].css'
      }),
      new PwaManifestPlugin({
        name: appEnvConfig.title,
        short_name: 'Ninja',
        description: '',
        background_color: '#1A1919',
        theme_color: '#1A1919',
        'theme-color': '#1A1919',
        start_url: '/',
        icons: [
          {
            src: xPath('src/assets/images/app/logo.svg'),
            sizes: [192, 256, 384, 512],
            destination: path.join('assets', 'icons')
          }
        ]
      }),
      new CopyWebpackPlugin([
        { from: 'src/assets/images/template/og_image.jpg', to: 'images' },
        { from: 'src/robots.txt', to: '.' }
      ])
    ],
    performance: { hints: false },
    devtool: false
  };

  if (isProduction && fs.existsSync(xPath('.env.production.js'))) {
    appEnvConfig = { ...appEnvConfig, ...require('./.env.production.js') }; // eslint-disable-line
  }

  // common config
  const finalConfig = merge(
    {
      entry: {
        main: xPath('src/index.js'),
        'app-sw': xPath('src/sw.js'),
        'firebase-messaging-sw': xPath('src/sw-fcm.js'),
        'serviceWorker.min': xPath('src/serviceWorker.js')
      },
      output: {
        filename: `[name].js?v=[hash]`,
        chunkFilename: `[name].chunk.js?v=[hash]`,
        publicPath: '/',
        globalObject: 'this'
      },
      resolve: {
        alias: { '@': xPath('src') },
        extensions: ['.js', '.jsx', '.scss', '.css'],
        modules: [xPath('node_modules')]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(appEnvConfig)
        }),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
          chunks: ['main', 'vendors~main'],
          minify: isProduction
            ? {
              collapseWhitespace: true,
              preserveLineBreaks: true,
              removeComments: true
            }
            : null,
          filename: 'index.html',
          template: xPath('src/templates/index.hbs'),
          favicon: xPath('src/assets/favicon.png'),
          env: appEnvConfig
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
      ],
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader'
              }
            ]
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
                options: { minimize: isProduction }
              }
            ]
          },
          {
            test: /\.hbs$/,
            use: [
              {
                loader: 'handlebars-loader'
              }
            ]
          },
          {
            test: /\.(raw)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: 'raw-loader'
          },
          {
            test: /\.(png|gif|jpe?g|svg|webp)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [
              'image-webpack-loader',
              {
                loader: 'file-loader',
                options: {
                  name: '[hash].[ext]',
                  outputPath: 'images/',
                  verbose: false
                }
              }
            ]
          },
          {
            test: /\.css$/,
            use: [
              isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
              { loader: require.resolve('css-loader'), options: { sourceMap: true, importLoaders: 2 } },
              { loader: require.resolve('postcss-loader'), options: { sourceMap: true } },
              {
                loader: require.resolve('resolve-url-loader'),
                options: { keepQuery: true, root: path.join(__dirname, 'src') }
              }
            ]
          },
          {
            test: /\.scss$/,
            use: [
              isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
              { loader: require.resolve('css-loader'), options: { sourceMap: true, importLoaders: 3 } },
              { loader: require.resolve('postcss-loader'), options: { sourceMap: true } },
              {
                loader: require.resolve('resolve-url-loader'),
                options: { keepQuery: true, root: path.join(__dirname, 'src') }
              },
              { loader: require.resolve('sass-loader'), options: { sourceMap: true } }
            ]
          },
          {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [{
              loader: 'url-loader',
              limit: 100000,
              mimetype: 'application/font-woff'
            }]
          },
          {
            test: /\.(eot|tiff|ttf|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [
              {
                loader: require.resolve('file-loader'),
                options: {
                  name: '[name].[ext]',
                  outputPath: 'fonts/'
                }
              }
            ]
          }
        ]
      },
      stats,
      devtool: 'source-map'
    },
    isProduction ? production : development
  );

  return finalConfig;
};

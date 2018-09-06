const path = require('path');
const fs = require('fs');
// const packageConfig = require('./package.json');

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
// const OfflinePlugin = require('offline-plugin');

// configs
const envConfig = require('./.env.js');

module.exports = function webpackConfig(env, argv = {}) {
  const isProduction = argv.mode === 'production';

  const stats = {
    modules: false,
    children: false,
    chunks: false,
  };

  let appEnvConfig = {
    NODE_ENV: argv.mode,
    isProduction,
    ...envConfig,
  };

  const development = {
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
      watchContentBase: true,
      stats,
      publicPath: '/',
      historyApiFallback: {
        disableDotRule: true,
      },
      hot: true,
      host: '0.0.0.0',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            {
              loader: 'resolve-url-loader',
              options: {
                keepQuery: true,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            {
              loader: 'resolve-url-loader',
              options: {
                keepQuery: true,
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
  };

  const production = {
    optimization: {
      minimize: true,
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true,
          uglifyOptions: {
            compress: {
              drop_console: appEnvConfig.dropConsole,
            },
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
      },
      noEmitOnErrors: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            // MiniCssExtractPlugin.loader, TO-DO
            'style-loader',
            'css-loader',
            'postcss-loader',
            {
              loader: 'resolve-url-loader',
              options: {
                keepQuery: true,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            // MiniCssExtractPlugin.loader, TO-DO
            'style-loader',
            'css-loader',
            'postcss-loader',
            {
              loader: 'resolve-url-loader',
              options: {
                keepQuery: true,
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new OptimizeCSSAssetsPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[hash].[name].css',
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
            src: xPath('src/assets/images/logo.png'),
            sizes: [192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
      new CopyWebpackPlugin([
        { from: 'src/assets/images/ninja-star', to: 'ninja-star' },
        { from: 'src/assets/images/template/og_image.png', to: 'images' },
        { from: 'src/robots.txt', to: '.' },
        { from: 'src/google59d0f1640e2aac21.html', to: '.' },
      ]),
      // new OfflinePlugin({
      //   appShell: '/',
      //   responseStrategy: 'network-first',
      //   autoUpdate: true,
      // }),
    ],
    performance: { hints: false },
    devtool: false,
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
        'serviceWorker.min': xPath('src/serviceWorker.js'),
      },
      output: {
        filename: `[name].js?v=[hash]`,
        chunkFilename: `[name].chunk.js?v=[hash]`,
        publicPath: '/',
        globalObject: 'this',
      },
      resolve: {
        alias: { '@': xPath('src') },
        extensions: ['.js', '.jsx', '.scss', '.css'],
        modules: [xPath('node_modules')],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(appEnvConfig),
        }),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
        }),
        new HtmlWebpackPlugin({
          chunks: ['main', 'vendors~main'],
          minify: isProduction
            ? {
              collapseWhitespace: true,
              preserveLineBreaks: true,
              removeComments: true,
            }
            : null,
          filename: 'index.html',
          template: xPath('src/templates/index.hbs'),
          favicon: xPath('src/assets/favicon.png'),
          env: appEnvConfig,
        }),
      ],
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
              },
            ],
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
                options: { minimize: isProduction },
              },
            ],
          },
          {
            test: /\.hbs$/,
            use: [
              {
                loader: 'handlebars-loader',
              },
            ],
          },
          {
            test: /\.(raw)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: 'raw-loader',
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
                  verbose: false,
                },
              },
            ],
          },
          {
            test: /\.(eot|tiff|woff2|woff|ttf|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[hash].[ext]',
                  outputPath: 'fonts/',
                  verbose: false,
                },
              },
            ],
          },
        ],
      },
      stats,
      devtool: 'source-map',
    },
    isProduction ? production : development,
  );

  return finalConfig;
};

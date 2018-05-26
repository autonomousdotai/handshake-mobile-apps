const path = require('path');

const xPath = filepath => path.resolve(__dirname, filepath);

// Webpack
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const dotenv = require('dotenv');

const stats = {
  modules: false,
  children: false,
  chunks: false,
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
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};

const production = {
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new ManifestPlugin(),
    new OptimizeCSSAssetsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[hash].[name].css',
    }),
  ],
  performance: { hints: false },
};

module.exports = function webpackConfig(env, argv) {
  const isProduction = argv.mode === 'production';

  if (!isProduction) {
    dotenv.config();
  } else {
    dotenv.config({ path: xPath('.env.production') });
  }

  return merge(
    {
      output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[hash].[name].js',
        publicPath: '/',
      },
      resolve: {
        alias: { '@': xPath('src') },
        extensions: ['.js', '.jsx', '.scss', '.css'],
        modules: [xPath('node_modules')],
      },
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
          'process.env.ENV': `"${argv.mode}"`,
          'process.env.ROOT': `"${process.env.ROOT}"`,
          'process.env.BASE_URL': `"${process.env.BASE_URL}"`,
        }),
        new HtmlWebpackPlugin({
          minify: isProduction
            ? {
              collapseWhitespace: true,
              preserveLineBreaks: true,
              removeComments: true,
            }
            : null,
          filename: 'index.html',
          template: xPath('src/templates/main.html'),
          favicon: xPath('src/assets/favicon.ico'),
        }),
      ],
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
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
    },
    isProduction ? production : development,
  );
};

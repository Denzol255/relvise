const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const target = isProd ? 'browserslist' : 'web';

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [new OptimizeCssAssetsPlugin(), new TerserPlugin()];
  }

  return config;
};

const filename = (ext) =>
  isDev ? `[name]${ext}` : `[name].[contenthash]${ext}`;

const cssLoaders = (addition) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: (resourcePath, context) => {
          return path.relative(path.dirname(resourcePath), context) + '/';
        },
      },
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
  ];
  if (addition) {
    loaders.push(addition);
  }
  return loaders;
};

const babelOptions = (preset) => {
  const options = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-class-properties'],
  };
  if (preset) {
    options.presets.push(preset);
  }
  return options;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions(),
    },
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, 'src/json/'),
          to: path.resolve(__dirname, 'dist/json'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: `./css/${filename('.css')}`,
    }),
  ];

  return base;
};

module.exports = {
  entry: ['./js/main.js'],
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  target: target,
  output: {
    filename: `./js/${filename('.js')}`,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    clean: true,
  },
  resolve: {
    extensions: ['...'],
    alias: {},
  },
  optimization: optimization(),
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'src'),
    },
    port: 3000,
    open: true,
    compress: true,
    hot: isDev,
    historyApiFallback: true,
  },
  devtool: isProd ? false : 'source-map',
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader',
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders({
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }),
      },
      {
        test: /\.(?:|ico|png|svg|jpeg|jpg|webp|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: `./img/${filename('[ext]')}`,
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: `./fonts/${filename('[ext]')}`,
        },
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript'),
        },
      },
      // {
      //   test: /\.jsx$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: babelOptions('@babel/preset-react'),
      //   },
      // },
    ],
  },
};

'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const srcPath = path.join(__dirname, './src');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    helpers: ['./src/helpers/componentStore.js', './src/helpers/formRenderer.js'],
    bundle: ['./src/index.jsx']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'FormControls'
  },
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
    },
    "@bahmni/design-system": {
      root: "BahmniDesignSystem",
      commonjs2: "@bahmni/design-system",
      commonjs: "@bahmni/design-system",
      amd: "@bahmni/design-system",
    },
    "@carbon/react": {
      root: "CarbonReact",
      commonjs2: "@carbon/react",
      commonjs: "@carbon/react",
      amd: "@carbon/react",
    },
    "@carbon/icons-react": {
      root: "CarbonIconsReact",
      commonjs2: "@carbon/icons-react",
      commonjs: "@carbon/icons-react",
      amd: "@carbon/icons-react",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: true,
              import: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/inline'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  resolve: {
    alias: {
      components: srcPath + '/components/',
      src: srcPath
    },
    extensions: ['.js', '.jsx', '.json']
  }
};
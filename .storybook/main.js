const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            configFile: path.resolve(__dirname, '../.babelrc'),
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.(scss|css)$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      src: path.join(__dirname, '../src'),
      components: path.join(__dirname, '../src/components'),
    };
    return config;
  },
};

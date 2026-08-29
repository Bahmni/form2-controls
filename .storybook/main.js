const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.js', '../stories/**/*.mdx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  // Name the autodocs page "Overview" (Carbon-style). Only Atomic Controls
  // opt into autodocs, so this affects those pages only.
  docs: {
    defaultName: 'Overview',
  },
  webpackFinal: async (config) => {
    // Add babel loader for JS/JSX
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

    // Find and modify the CSS rule to handle SCSS separately
    const cssRule = config.module.rules.find((rule) => {
      return rule.test && rule.test.test('.css');
    });

    if (cssRule) {
      // Modify CSS rule to only match .css files, not .scss
      cssRule.test = /\.css$/;
      // Ensure sass-loader is not in the CSS-only rule
      cssRule.use = cssRule.use.filter((loader) => {
        const loaderName = typeof loader === 'string' ? loader : loader.loader;
        return !loaderName.includes('sass-loader');
      });
    }

    // Add explicit SCSS rule
    config.module.rules.push({
      test: /\.scss$/,
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

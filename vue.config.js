module.exports = {
  publicPath: '/wordguesser',
  css: {
    extract: false,
  },
  chainWebpack: (config) => {
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true,
    });
  },
};

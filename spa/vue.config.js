module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8001,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
    },
  },
};

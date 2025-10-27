const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function proxy(app) {
  const target = 'http://localhost:4000';

  app.use(
    ['/send-result', '/send-pdf-report'],
    createProxyMiddleware({
      target,
      changeOrigin: true,
    }),
  );
};

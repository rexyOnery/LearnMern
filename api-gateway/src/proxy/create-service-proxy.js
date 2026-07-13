import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from '@mern-microservices/shared';

const attachUserHeaders = (proxyReq, req) => {
  if (!req.user) {
    return;
  }

  proxyReq.setHeader('x-user-id', req.user.id);
  proxyReq.setHeader('x-user-email', req.user.email || '');
  proxyReq.setHeader('x-user-name', req.user.name || '');
};

export const createServiceProxy = ({ target, pathRewrite }) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    timeout: 15000,
    proxyTimeout: 15000,
    on: {
      proxyReq: attachUserHeaders,
      error(error, req, res) {
        logger.error('Service proxy error', {
          target,
          path: req.originalUrl,
          message: error.message
        });

        if (!res.headersSent) {
          res.status(502).json({
            success: false,
            message: 'Upstream service unavailable'
          });
        }
      }
    }
  });

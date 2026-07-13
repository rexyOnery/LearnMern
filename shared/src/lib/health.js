export const buildHealthResponse = (serviceName) => ({
  service: serviceName,
  status: 'ok',
  uptime: process.uptime(),
  timestamp: new Date().toISOString()
});

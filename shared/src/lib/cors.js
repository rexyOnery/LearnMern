const normalizeOrigin = (origin) => {
  if (!origin) {
    return null;
  }

  try {
    const url = new URL(origin);
    return `${url.protocol}//${url.host}`.toLowerCase();
  } catch (_error) {
    return null;
  }
};

const requestHostMatchesOrigin = (req, origin) => {
  const normalizedOrigin = normalizeOrigin(origin);

  if (!normalizedOrigin) {
    return false;
  }

  const forwardedHost = req.headers['x-forwarded-host'];
  const host = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost || req.headers.host;

  if (!host) {
    return false;
  }

  try {
    return new URL(normalizedOrigin).host === host;
  } catch (_error) {
    return false;
  }
};

export const createCorsOptions = ({ origins = [], credentials = false } = {}) => {
  const configuredOrigins = new Set(
    origins
      .map((origin) => (origin === '*' ? '*' : normalizeOrigin(origin)))
      .filter(Boolean)
  );

  return (req, callback) => {
    const origin = req.headers.origin;

    if (!origin) {
      callback(null, { origin: true, credentials });
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    const isAllowed =
      configuredOrigins.has('*') ||
      configuredOrigins.has(normalizedOrigin) ||
      requestHostMatchesOrigin(req, origin);

    callback(null, { origin: isAllowed, credentials });
  };
};

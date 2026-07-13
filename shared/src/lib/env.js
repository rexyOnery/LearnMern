export const parseCorsOrigins = (originValue = '') =>
  originValue
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const buildCorsOrigins = (...values) => {
  const vercelOrigins = [
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : ''
  ];

  return [...values, ...vercelOrigins]
    .flatMap((value) => parseCorsOrigins(value))
    .filter(Boolean);
};

export const requireEnv = (name, fallback) => {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

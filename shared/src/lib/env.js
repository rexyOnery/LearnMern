export const parseCorsOrigins = (originValue = '') =>
  originValue
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const requireEnv = (name, fallback) => {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

import mongoose from 'mongoose';
import { loadEnvFiles } from '@mern-microservices/shared';

loadEnvFiles(process.cwd());

const services = [
  {
    name: 'Auth Service',
    envName: 'AUTH_MONGODB_URI',
    fallbackName: 'MONGODB_URI',
    fallback: 'mongodb://localhost:27017/auth_service'
  },
  {
    name: 'User Service',
    envName: 'USER_MONGODB_URI',
    fallbackName: 'MONGODB_URI',
    fallback: 'mongodb://localhost:27017/user_service'
  },
  {
    name: 'Product Service',
    envName: 'PRODUCT_MONGODB_URI',
    fallbackName: 'MONGODB_URI',
    fallback: 'mongodb://localhost:27017/product_service'
  }
];

const redactUri = (uri) => {
  try {
    const url = new URL(uri);

    if (url.username || url.password) {
      url.username = '***';
      url.password = '***';
    }

    return url.toString();
  } catch (_error) {
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
  }
};

const checkConnection = async ({ name, envName, fallbackName, fallback }) => {
  const uri = process.env[envName] || process.env[fallbackName] || fallback;
  const source = process.env[envName]
    ? envName
    : process.env[fallbackName]
      ? fallbackName
      : 'built-in fallback';

  const connection = mongoose.createConnection();

  try {
    await connection.openUri(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`[ok] ${name}: connected using ${source} (${redactUri(uri)})`);
  } catch (error) {
    console.error(`[fail] ${name}: ${error.message}`);
    console.error(`       Source: ${source}`);
    console.error(`       URI: ${redactUri(uri)}`);
    process.exitCode = 1;
  } finally {
    await connection.close().catch(() => {});
  }
};

for (const service of services) {
  await checkConnection(service);
}

await mongoose.disconnect().catch(() => {});
process.exit(process.exitCode ?? 0);

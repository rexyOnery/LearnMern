import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, parse, resolve } from 'node:path';
import dotenv from 'dotenv';

const findRepoRoot = (startDir = process.cwd()) => {
  let currentDir = resolve(startDir);

  while (true) {
    const packageJsonPath = join(currentDir, 'package.json');

    if (existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

        if (packageJson.name === 'mern-microservices-app') {
          return currentDir;
        }
      } catch (_error) {
        return currentDir;
      }
    }

    const parentDir = dirname(currentDir);

    if (parentDir === currentDir) {
      return startDir;
    }

    currentDir = parentDir;
  }
};

const loadIfPresent = (filePath) => {
  if (!existsSync(filePath)) {
    return;
  }

  dotenv.config({ path: filePath, override: false });
};

export const loadEnvFiles = (serviceDir = process.cwd()) => {
  const repoRoot = findRepoRoot(serviceDir);
  const serviceRoot = resolve(serviceDir);
  const serviceName = parse(serviceRoot).base;

  [
    join(repoRoot, '.env'),
    join(repoRoot, '.env.local'),
    join(serviceRoot, '.env'),
    join(serviceRoot, '.env.local')
  ].forEach(loadIfPresent);

  process.env.SERVICE_NAME = process.env.SERVICE_NAME || serviceName;
};

# MERN Microservices App

A production-minded starter repository for a microservices-based MERN application. It includes a React/Vite frontend, an Express API Gateway, three independent Express services, MongoDB with Mongoose, JWT authentication, Docker Compose, Vercel Services configuration, GitHub Actions, and Azure DevOps examples.

## Workspace Inspection

This repository was generated in an empty workspace. No existing project files were found, so nothing was deleted or overwritten.

## What MERN Means Here

- MongoDB stores service-owned data.
- Express.js powers the API Gateway and backend services.
- React with Vite powers the frontend application.
- Node.js runs each backend process.

## Architecture

The frontend talks only to the API Gateway. The gateway owns public API ingress, verifies JWTs for protected routes, injects trusted identity headers, and forwards requests to the correct service.

```text
Browser
  |
  | /api/auth/*, /api/users/*, /api/products/*
  v
API Gateway
  |-- /api/auth/*     -> Auth Service     -> auth_service MongoDB
  |-- /api/users/*    -> User Service     -> user_service MongoDB
  |-- /api/products/* -> Product Service  -> product_service MongoDB

Frontend routes:
  /login
  /register
  /dashboard  protected
  /products   public list, protected create
```

Each backend service has its own entry point, routes, controllers, service layer, models, validation, middleware, centralized error handling, logging, health route, Dockerfile, and environment example.

## Folder Structure

```text
mern-microservices-app/
|-- frontend/
|-- api-gateway/
|-- services/
|   |-- auth-service/
|   |-- user-service/
|   `-- product-service/
|-- shared/
|-- devops/
|   |-- github-actions/
|   `-- azure-pipelines/
|-- .github/workflows/
|-- docker-compose.yml
|-- vercel.json
|-- .env.example
|-- .gitignore
|-- package.json
`-- README.md
```

## Environment Setup

Copy the root example file:

```bash
cp .env.example .env
```

For Docker Compose, the defaults in `.env.example` work. For Vercel or any hosted deployment, use managed MongoDB connection strings such as MongoDB Atlas:

```text
AUTH_MONGODB_URI=mongodb+srv://...
USER_MONGODB_URI=mongodb+srv://...
PRODUCT_MONGODB_URI=mongodb+srv://...
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1h
VITE_API_BASE_URL=/api
```

Never commit `.env` files or real secrets.

For detailed MongoDB setup steps for registration, see [MONGODB_SETUP_GUIDE.md](./MONGODB_SETUP_GUIDE.md).

## Manual Local Setup

These commands require internet access the first time because they install npm dependencies.

```bash
cd mern-microservices-app
npm install
npm run dev
```

After the first install, commit `package-lock.json` and use `npm ci` in CI for fully reproducible installs.

By default:

- Frontend: `http://localhost:5173`
- API Gateway: `http://localhost:4000`
- Auth Service: `http://localhost:4101`
- User Service: `http://localhost:4102`
- Product Service: `http://localhost:4103`

For manual service-by-service startup, run:

```bash
npm run dev --workspace services/auth-service
npm run dev --workspace services/user-service
npm run dev --workspace services/product-service
npm run dev --workspace api-gateway
npm run dev --workspace frontend
```

## Docker Setup

Start the full system:

```bash
cd mern-microservices-app
cp .env.example .env
docker compose up --build
```

Open:

```text
http://localhost:3000
```

Stop everything:

```bash
docker compose down --remove-orphans
```

Build and run one backend container manually:

```bash
docker build -f services/auth-service/Dockerfile -t mern-auth-service .
docker run --rm -p 4101:4101 \
  -e PORT=4101 \
  -e JWT_SECRET=replace-with-a-long-random-secret \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/auth_service \
  mern-auth-service
```

Build and run the frontend container manually:

```bash
docker build -f frontend/Dockerfile \
  --build-arg VITE_API_BASE_URL=http://localhost:4000/api \
  -t mern-frontend .
docker run --rm -p 3000:80 mern-frontend
```

## Authentication Flow

1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Auth Service hashes passwords with bcrypt and returns a JWT.
4. Frontend stores the token in browser storage.
5. Protected frontend routes require a token.
6. API Gateway verifies the token before `/api/users/*` and protected `/api/products` writes.
7. Gateway forwards identity as `x-user-id`, `x-user-email`, and `x-user-name`.

## API Summary

Gateway:

- `GET /health`
- `/api/auth/*` -> Auth Service
- `/api/users/*` -> User Service, protected
- `/api/products/*` -> Product Service, public reads and protected writes

Auth Service:

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/validate`

User Service:

- `GET /health`
- `GET /users/profile`
- `PATCH /users/profile`

Product Service:

- `GET /health`
- `GET /products`
- `POST /products`

## Vercel Deployment

The repository includes `vercel.json` using Vercel Services. Public traffic routes `/api/*` to the API Gateway service and all other paths to the Vite frontend. The gateway uses service bindings so its internal service URLs are injected by Vercel rather than hardcoded.

For the full step-by-step deployment workflow, see [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md).

Vercel references:

- Services: https://vercel.com/docs/services
- Service bindings: https://vercel.com/docs/services/bindings
- Project configuration: https://vercel.com/docs/project-configuration
- Environment variables: https://vercel.com/docs/environment-variables
- Container Registry: https://vercel.com/docs/container-registry

Deploy steps:

```bash
cd mern-microservices-app
npm install -g vercel
vercel login
vercel link
vercel env add JWT_SECRET production
vercel env add AUTH_MONGODB_URI production
vercel env add USER_MONGODB_URI production
vercel env add PRODUCT_MONGODB_URI production
vercel env add VITE_API_BASE_URL production
vercel deploy --prod
```

Use `/api` for `VITE_API_BASE_URL` on Vercel so the browser calls the same deployment domain.

For Azure DevOps, create secret pipeline variables named:

```text
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-team-or-user-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

The Azure pipeline uses those values to run `vercel pull`, `vercel build`, and `vercel deploy --prebuilt`.

## CI/CD

GitHub Actions:

- Active workflow: `.github/workflows/ci.yml`
- Template copy: `devops/github-actions/ci.yml`
- Triggers on push to `main` and pull requests.
- Installs dependencies, lints, tests, builds, builds Docker images, and pushes images.
- Uses `DOCKER_USERNAME`, `DOCKER_PASSWORD`, and `DOCKER_REGISTRY` secrets.

Azure DevOps:

- Example pipeline: `devops/azure-pipelines/azure-pipelines.yml`
- Validates the app, then deploys directly to Vercel with the Vercel CLI.
- Pulls Vercel project settings, runs `vercel build`, and deploys the prebuilt output.
- Deploys preview environments for pull requests and production for pushes to `main`.
- Requires secret pipeline variables: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.

## Verification Checklist

Without Docker:

```bash
npm install
npm run lint
npm test
npm run build
npm run dev
```

With Docker:

```bash
docker compose up --build
```

Check service health:

```bash
curl http://localhost:4000/health
curl http://localhost:4101/health
curl http://localhost:4102/health
curl http://localhost:4103/health
```

Verify the user flow:

1. Open `http://localhost:3000` for Docker or `http://localhost:5173` for Vite dev.
2. Register a user.
3. Confirm redirect to Dashboard.
4. Update the profile.
5. Open Products.
6. Create a product.
7. Refresh Products and confirm the product list loads through the gateway.

## Troubleshooting

- If registration fails, confirm the auth MongoDB container or hosted MongoDB URI is reachable.
- If protected routes return `401`, confirm `JWT_SECRET` is identical in the gateway, user service, product service, and auth service.
- If the frontend cannot reach the API, confirm `VITE_API_BASE_URL` points to the gateway. Docker uses `http://localhost:4000/api`; Vercel should use `/api`.
- If CORS blocks requests during local development, add the frontend URL to `CORS_ORIGIN`.
- If Docker health checks stay unhealthy, inspect logs with `docker compose logs <service-name>`.

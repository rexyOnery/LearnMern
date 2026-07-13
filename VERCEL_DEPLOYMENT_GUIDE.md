# Vercel Deployment Guide

This guide walks through deploying this MERN microservices monorepo to Vercel. It covers the Vercel project setup, MongoDB hosting, environment variables, CLI deployment, Azure DevOps deployment, and post-deploy verification.

The repository uses Vercel Services in `vercel.json`:

- `frontend` serves the React/Vite app.
- `api_gateway` receives public `/api/*` traffic.
- `auth_service`, `user_service`, and `product_service` run as internal backend services.
- Service bindings inject private service URLs into the API Gateway.
- Top-level rewrites route browser traffic to the correct service.

## 1. Prerequisites

Install or prepare:

1. Node.js 20 or newer.
2. npm 10 or newer.
3. A Vercel account.
4. A MongoDB Atlas account or another hosted MongoDB provider.
5. Git and a remote repository provider such as GitHub or Azure Repos.
6. The Vercel CLI if deploying from your local terminal.

Install the Vercel CLI:

```bash
npm install -g vercel
```

Confirm versions:

```bash
node --version
npm --version
vercel --version
```

## 2. Understand The Deployment Shape

Vercel will read the root `vercel.json`:

```json
{
  "services": {
    "frontend": {
      "root": "frontend/",
      "framework": "vite",
      "buildCommand": "npm run build",
      "outputDirectory": "dist"
    },
    "api_gateway": {
      "root": "api-gateway/",
      "framework": "express",
      "bindings": [
        {
          "type": "service",
          "service": "auth_service",
          "format": "url",
          "env": "AUTH_SERVICE_URL"
        }
      ]
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": {
        "service": "api_gateway"
      }
    },
    {
      "source": "/(.*)",
      "destination": {
        "service": "frontend"
      }
    }
  ]
}
```

The actual file includes bindings for all three backend services. Public users only see one deployment URL:

```text
https://your-project.vercel.app
https://your-project.vercel.app/api/auth/register
https://your-project.vercel.app/api/products
```

The API Gateway privately calls the Auth, User, and Product services through Vercel service bindings.

## 3. Prepare MongoDB Databases

Vercel deployments should not use the Docker Compose MongoDB containers. Use hosted MongoDB instead.

With MongoDB Atlas:

1. Create or open an Atlas project.
2. Create a cluster.
3. Create a database user with a strong password.
4. Add an IP access rule that allows Vercel to connect.
5. Copy your connection string.
6. Create three logical database names:
   - `auth_service`
   - `user_service`
   - `product_service`

Example connection strings:

```text
AUTH_MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.example.mongodb.net/auth_service?retryWrites=true&w=majority
USER_MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.example.mongodb.net/user_service?retryWrites=true&w=majority
PRODUCT_MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.example.mongodb.net/product_service?retryWrites=true&w=majority
```

Use separate database users per service in production if you want stricter isolation.

## 4. Prepare Environment Variables

Required Vercel variables:

```text
JWT_SECRET=replace-with-a-long-random-production-secret
JWT_EXPIRES_IN=1h
AUTH_MONGODB_URI=mongodb+srv://...
USER_MONGODB_URI=mongodb+srv://...
PRODUCT_MONGODB_URI=mongodb+srv://...
VITE_API_BASE_URL=/api
NODE_ENV=production
```

Usually optional on Vercel because service bindings provide the internal URLs:

```text
AUTH_SERVICE_URL
USER_SERVICE_URL
PRODUCT_SERVICE_URL
```

Optional CORS value:

```text
CORS_ORIGIN=https://your-project.vercel.app
```

For the first deployment, you can omit `CORS_ORIGIN` if you are still using preview URLs and testing. Once your production URL is stable, set it explicitly.

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 5. Run Local Preflight Checks

From the repository root:

```bash
cd mern-microservices-app
npm install
npm run lint
npm test
npm run build
```

If you already installed dependencies and committed `package-lock.json`, CI systems should use:

```bash
npm ci
```

## 6. Link The Project To Vercel

Login:

```bash
vercel login
```

From the repository root, link the local folder to a Vercel project:

```bash
vercel link
```

Choose:

1. Your Vercel scope or team.
2. Link to an existing project or create a new one.
3. Use the current directory as the project root.

This creates a local `.vercel/` folder. It is ignored by `.gitignore` and should not be committed.

## 7. Add Environment Variables With The CLI

Add production variables:

```bash
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel env add AUTH_MONGODB_URI production
vercel env add USER_MONGODB_URI production
vercel env add PRODUCT_MONGODB_URI production
vercel env add VITE_API_BASE_URL production
vercel env add NODE_ENV production
```

Use these values:

```text
JWT_EXPIRES_IN=1h
VITE_API_BASE_URL=/api
NODE_ENV=production
```

Add preview variables too if you want pull request or branch previews to work:

```bash
vercel env add JWT_SECRET preview
vercel env add JWT_EXPIRES_IN preview
vercel env add AUTH_MONGODB_URI preview
vercel env add USER_MONGODB_URI preview
vercel env add PRODUCT_MONGODB_URI preview
vercel env add VITE_API_BASE_URL preview
vercel env add NODE_ENV preview
```

For local Vercel development, pull development variables:

```bash
vercel env pull
```

## 8. Deploy A Preview Build

Run:

```bash
vercel
```

Vercel will build and deploy a preview URL. Use that URL to test before promoting production.

Check:

```text
https://your-preview-url.vercel.app
https://your-preview-url.vercel.app/api/products
```

Expected behavior:

- Frontend loads.
- Products page loads with an empty list or existing products.
- Register page can create a user.
- Login page returns a JWT.
- Dashboard route is protected.
- Product creation works after login.

## 9. Deploy To Production

Run:

```bash
vercel --prod
```

Vercel will create a production deployment and assign your production domain.

Production URLs:

```text
https://your-project.vercel.app
https://your-project.vercel.app/api/products
```

## 10. Verify Production

Use the browser:

1. Open the production URL.
2. Go to Register.
3. Create a user.
4. Confirm you land on Dashboard.
5. Update the profile.
6. Go to Products.
7. Create a product.
8. Refresh and confirm the product remains visible.

Use terminal checks:

```bash
curl https://your-project.vercel.app/api/products
```

Expected product response shape:

```json
{
  "success": true,
  "data": {
    "products": []
  }
}
```

Register through the API:

```bash
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ada Lovelace\",\"email\":\"ada@example.com\",\"password\":\"password123\"}"
```

On Windows PowerShell:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://your-project.vercel.app/api/auth/register" `
  -ContentType "application/json" `
  -Body '{"name":"Ada Lovelace","email":"ada@example.com","password":"password123"}'
```

## 11. Deploy Through Git Integration

You can also deploy by connecting the repository in the Vercel dashboard.

Steps:

1. Push this repository to GitHub, GitLab, Bitbucket, or Azure Repos through a compatible Git mirror.
2. Open the Vercel dashboard.
3. Choose Add New, then Project.
4. Import the repository.
5. Keep the root directory as the monorepo root, not `frontend/`.
6. Confirm that Vercel detects the root `vercel.json`.
7. Add the environment variables from section 4.
8. Deploy.

After that:

- Pull requests and non-production branches create preview deployments.
- Pushes to the production branch create production deployments.

## 12. Deploy Through Azure DevOps

This repository includes:

```text
devops/azure-pipelines/azure-pipelines.yml
```

The pipeline:

1. Installs dependencies.
2. Runs linting.
3. Runs tests.
4. Builds all workspaces.
5. Pulls Vercel project settings.
6. Runs `vercel build`.
7. Deploys the prebuilt output to Vercel.

Create these secret Azure Pipeline variables:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

How to get them:

1. `VERCEL_TOKEN`: create a token in your Vercel account settings.
2. `VERCEL_ORG_ID`: run `vercel link`, then inspect `.vercel/project.json`, or read it from Vercel project settings.
3. `VERCEL_PROJECT_ID`: run `vercel link`, then inspect `.vercel/project.json`, or read it from Vercel project settings.

In Azure DevOps:

1. Open Pipelines.
2. Create a new pipeline.
3. Select your repository.
4. Choose Existing Azure Pipelines YAML file.
5. Select `devops/azure-pipelines/azure-pipelines.yml`.
6. Add the three secret variables in Pipeline settings.
7. Run the pipeline.

The production stage runs only for `main`. Preview deployments run for other branches and pull requests.

## 13. Custom Domain

After production deployment:

1. Open your project in Vercel.
2. Go to Settings, then Domains.
3. Add your domain, such as `app.example.com`.
4. Follow the DNS instructions Vercel shows.
5. After DNS propagates, update `CORS_ORIGIN`:

```text
CORS_ORIGIN=https://app.example.com
```

Redeploy after changing environment variables.

## 14. Common Problems

### The frontend loads, but API calls fail

Check:

- `VITE_API_BASE_URL` is `/api` on Vercel.
- The root `vercel.json` rewrites `/api/(.*)` to `api_gateway`.
- The deployment was made from the monorepo root.

### Registration fails

Check:

- `AUTH_MONGODB_URI` is set in the Vercel project.
- MongoDB Atlas allows connections.
- The database username and password are correct.
- The connection string includes the `auth_service` database name.

### Login works, but Dashboard or Product creation returns 401

Check:

- `JWT_SECRET` is the same for all services.
- The API Gateway service has access to `JWT_SECRET`.
- The frontend is sending the `Authorization: Bearer <token>` header.

### Products list works, but create product fails

Check:

- You are logged in.
- `PRODUCT_MONGODB_URI` is set.
- The Product Service can read the identity headers forwarded by the gateway.

### Azure DevOps pipeline cannot authenticate with Vercel

Check:

- `VERCEL_TOKEN` is marked secret but still available to pipeline tasks.
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` match the linked Vercel project.
- The token belongs to a user or team with permission to deploy the project.

## 15. Production Hardening Checklist

Before a serious production launch:

1. Use separate MongoDB users per service.
2. Rotate `JWT_SECRET` and keep it outside source control.
3. Set `CORS_ORIGIN` to the final production domain.
4. Enable Vercel deployment protection for preview environments if needed.
5. Add observability and error tracking.
6. Add integration tests for auth, gateway routing, and product creation.
7. Add database backups and restore testing.
8. Replace sample UI copy and sample product behavior with your real domain model.

## Official Vercel References

- Vercel CLI overview: https://vercel.com/docs/cli
- Deploying with Vercel CLI: https://vercel.com/docs/cli/deploy
- Vercel Services: https://vercel.com/docs/services
- Environment variables: https://vercel.com/docs/environment-variables
- Project configuration: https://vercel.com/docs/project-configuration

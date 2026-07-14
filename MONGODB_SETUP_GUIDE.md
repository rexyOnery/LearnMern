# MongoDB Setup Guide For Registration

This app writes new user records during registration through this flow:

```text
Register page
  -> POST /api/auth/register
  -> API Gateway
  -> Auth Service
  -> MongoDB database from AUTH_MONGODB_URI or MONGODB_URI
  -> users collection
```

If MongoDB is not reachable, blocked by network access rules, or missing the correct environment variable, registration can fail with `Request failed with status code 500`.

## 1. Know Which Database Registration Uses

Registration does not write to the user service database. It writes to the Auth Service database.

The Auth Service reads the MongoDB URI from:

```text
AUTH_MONGODB_URI
```

If that is not set, it falls back to:

```text
MONGODB_URI
```

Recommended database name:

```text
auth_service
```

Expected collection after first successful registration:

```text
auth_service.users
```

Mongoose creates the database and collection on the first successful write, so they might not appear in MongoDB Atlas until registration succeeds once.

## 2. Recommended Hosted Setup: MongoDB Atlas

Use MongoDB Atlas for Vercel deployments. Do not use the Docker Compose MongoDB containers for production or Vercel.

### Step 1: Create an Atlas project

1. Go to https://cloud.mongodb.com.
2. Create an account or sign in.
3. Create a new project, for example `mern-microservices-app`.

### Step 2: Create a cluster

1. In the project, choose Build a Database.
2. Choose a free or paid cluster.
3. Pick a cloud provider and region.
4. Create the cluster and wait until it is ready.

### Step 3: Create a database user

1. Go to Database Access.
2. Click Add New Database User.
3. Choose Password authentication.
4. Create a username and strong password.
5. Give the user read/write access.

For a starter app, one shared database user is acceptable. For production, create separate database users for each service.

Example users:

```text
auth_service_user
user_service_user
product_service_user
```

### Step 4: Configure network access

1. Go to Network Access.
2. Click Add IP Address.
3. For local development, add your current IP address.
4. For Vercel hobby/pro deployments without static outbound IPs, you commonly need:

```text
c0
```

This allows connections from anywhere, so use a strong database password. For stricter production networking, use Vercel Static IPs or Secure Compute, then allowlist only the dedicated Vercel IP addresses.

### Step 5: Copy the connection string

1. Go to Database.
2. Click Connect on your cluster.
3. Choose Drivers.
4. Choose Node.js.
5. Copy the connection string.

It will look like:

```text
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

Add the database name after `.net/`:

```text
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/auth_service?retryWrites=true&w=majority&appName=Cluster0
```

Do the same for each service database:

```text
AUTH_MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/auth_service?retryWrites=true&w=majority&appName=Cluster0
USER_MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/user_service?retryWrites=true&w=majority&appName=Cluster0
PRODUCT_MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/product_service?retryWrites=true&w=majority&appName=Cluster0
```

If your password contains special characters such as `@`, `#`, `%`, `/`, or `:`, URL-encode it before putting it in the connection string.

Important: every URI must be assigned to an environment variable. Raw MongoDB URI lines are ignored by Node.

Incorrect:

```text
mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/auth_service?retryWrites=true&w=majority
```

Correct:

```text
AUTH_MONGODB_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/auth_service?retryWrites=true&w=majority
```

## 3. Configure Vercel Environment Variables

In the Vercel dashboard:

1. Open your project.
2. Go to Settings.
3. Go to Environment Variables.
4. Add these variables for Production and Preview.

Required:

```text
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=1h
AUTH_MONGODB_URI=mongodb+srv://...
USER_MONGODB_URI=mongodb+srv://...
PRODUCT_MONGODB_URI=mongodb+srv://...
VITE_API_BASE_URL=/api
NODE_ENV=production
```

Generate a JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

After changing Vercel environment variables, redeploy the project. Existing deployments do not automatically pick up new values.

## 4. Configure Local Development With Atlas

Create a local `.env` file in the repo root:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Edit `.env`:

```text
NODE_ENV=development

FRONTEND_PORT=3000
API_GATEWAY_PORT=4000
AUTH_SERVICE_PORT=4101
USER_SERVICE_PORT=4102
PRODUCT_SERVICE_PORT=4103

FRONTEND_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:4000/api

API_GATEWAY_URL=http://localhost:4000
AUTH_SERVICE_URL=http://localhost:4101
USER_SERVICE_URL=http://localhost:4102
PRODUCT_SERVICE_URL=http://localhost:4103

JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=1h

AUTH_MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/auth_service?retryWrites=true&w=majority&appName=Cluster0
USER_MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/user_service?retryWrites=true&w=majority&appName=Cluster0
PRODUCT_MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/product_service?retryWrites=true&w=majority&appName=Cluster0

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=120
```

The backend services now load these files from the repository root and from each service folder:

```text
.env
.env.local
services/<service-name>/.env
services/<service-name>/.env.local
```

Check that MongoDB is reachable before starting the app:

```bash
npm run check:mongo
```

Start the app:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

## 5. Configure Local Development With Docker MongoDB

Use this option if you want local MongoDB containers.

1. Start Docker Desktop.
2. Create `.env` from `.env.example`.
3. Keep these local Docker URIs:

```text
AUTH_MONGODB_URI=mongodb://mongo-auth:27017/auth_service
USER_MONGODB_URI=mongodb://mongo-user:27017/user_service
PRODUCT_MONGODB_URI=mongodb://mongo-product:27017/product_service
```

4. Start the system:

```bash
docker compose up --build
```

5. Open:

```text
http://localhost:3000
```

In Docker Compose, the frontend is served on port `3000`, and the API Gateway is served on port `4000`.

## 6. Test Registration Through The API

After the app is running, test the gateway directly.

Local:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ada Lovelace\",\"email\":\"ada@example.com\",\"password\":\"password123\"}"
```

Vercel:

```bash
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ada Lovelace\",\"email\":\"ada@example.com\",\"password\":\"password123\"}"
```

PowerShell:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4000/api/auth/register" `
  -ContentType "application/json" `
  -Body '{"name":"Ada Lovelace","email":"ada@example.com","password":"password123"}'
```

Expected success:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    },
    "token": "..."
  }
}
```

## 7. Confirm The User Record Exists

In MongoDB Atlas:

1. Go to Database.
2. Open your cluster.
3. Click Browse Collections.
4. Open the `auth_service` database.
5. Open the `users` collection.

You should see a document similar to:

```json
{
  "_id": "...",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "passwordHash": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

The app stores `passwordHash`, not the plain password. That is correct.

## 8. Common Causes Of Registration 500 Errors

### Missing `AUTH_MONGODB_URI`

Fix: add `AUTH_MONGODB_URI` in Vercel or `.env`.

### Wrong database password

Fix: reset the Atlas database user password and update the URI.

### Special characters in password

Fix: URL-encode the password in the MongoDB URI.

### Atlas network access blocks the request

Fix: add your local IP for local testing. For Vercel without static outbound IPs, use `0.0.0.0/0` or configure Vercel Static IPs/Secure Compute.

### URI has no database name

Bad:

```text
mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Good:

```text
mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/auth_service?retryWrites=true&w=majority
```

### Existing user email

Expected response should be `409`, not `500`.

Fix: register with a new email or delete the existing user document.

### Vercel env vars were added after deploy

Fix: redeploy after adding or changing environment variables.

## 9. Quick Checklist

Before clicking Register, confirm:

1. `AUTH_MONGODB_URI` points to `auth_service`.
2. `JWT_SECRET` exists.
3. Atlas database user exists.
4. Atlas Network Access allows the app to connect.
5. The app was redeployed after env var changes.
6. `VITE_API_BASE_URL` is `/api` on Vercel.
7. You are looking for records in `auth_service.users`.

## Official References

- MongoDB Atlas getting started: https://www.mongodb.com/docs/get-started/
- MongoDB Atlas IP access list: https://www.mongodb.com/docs/atlas/security/ip-access-list/
- MongoDB connection strings: https://www.mongodb.com/docs/manual/reference/connection-string/
- Vercel Secure Compute and static outbound IP options: https://vercel.com/docs/networking/secure-compute

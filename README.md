# Real Estate Platform

This repository contains a complete Real-Estate Listing web application (backend + frontend).

Structure:

- backend: Node.js + Express + MongoDB (Mongoose)
- frontend: React (Vite) + Tailwind CSS

--------------------------------------------------------------------------------
Backend Setup
--------------------------------------------------------------------------------

1. Copy environment file and set values:

```
cd backend
copy .env.sample .env
# edit .env and set MONGO_URI and JWT_SECRET (and optional ADMIN_EMAIL/ADMIN_PASS)
```

Example `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/realestate
JWT_SECRET=change_this_secret
ADMIN_EMAIL=admin@realestate.test
ADMIN_PASS=admin123
```

2. Install & run:

```
cd backend
npm install
npm run dev    # requires nodemon, or use npm start
```

API endpoints (summary):

- POST /api/auth/register  -> { name,email,password,role }
- POST /api/auth/login     -> { email,password }
- GET  /api/properties     -> list (requires auth header)
- POST /api/properties    -> create property (seller/agent/admin)
- GET  /api/properties/:id -> get details
- PUT  /api/properties/:id -> update (owner/admin)
- DELETE /api/properties/:id -> delete (owner/admin)
- PUT  /api/properties/:id/approve -> admin approves (body: {status:'approved'|'rejected'})

--------------------------------------------------------------------------------
Frontend Setup
--------------------------------------------------------------------------------

1. Configure API base (optional): create a `.env` file in `frontend` with:

```
VITE_API_BASE=http://localhost:5000
```

2. Install & run:

```
cd frontend
npm install
npm run dev
```

Notes:

- The frontend uses JWT stored in `localStorage` and attaches it to API requests.
- Admin account is seeded on backend startup using `ADMIN_EMAIL` and `ADMIN_PASS` environment variables (see `.env.sample`).

--------------------------------------------------------------------------------
Developer Notes
--------------------------------------------------------------------------------

- This implementation keeps images as URLs for simplicity. To support uploads, integrate `multer` or a cloud storage provider.
- The backend currently requires authentication to view property lists; adjust `routes/propertyRoutes.js` if you want public access.

## Additional Notes - Uploads, S3, Tests & Deployment

- Image uploads: Backend supports local uploads (stored in `backend/uploads`) and optional S3 uploads when environment variables are set. See `backend/services/s3.js`.

S3 (optional)
Set these environment variables in `backend/.env`:

```
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
```

When `S3_BUCKET` is present, uploaded files will be sent to S3 and stored publicly; otherwise files are served from `/uploads`.

Frontend image gallery
- `PropertyCard` and `PropertyDetails` now render thumbnails and handle both local `/uploads` URLs and external S3 URLs.
- If you run frontend on a different port, set `VITE_API_BASE` in `frontend/.env` to point to the backend base URL, e.g. `http://localhost:5001`.

Cypress E2E tests
- Basic Cypress scaffold is added under `frontend/cypress`. Install dev deps and run:

```powershell
cd frontend
npm install
npx cypress open    # interactive
# or
npx cypress run     # headless
```

CI / Deployment
- A basic GitHub Actions workflow is available at `.github/workflows/ci.yml` to install and build frontend/backend on push to `main`.
- Backend `Procfile` is included for Heroku-style deployment: `web: node server.js`.
- Frontend can be deployed to Vercel/Netlify; run `npm run build` in `frontend` and deploy the output.

If you want, I can now:
- Run the Cypress tests in this environment (requires dev deps installed), or
- Help configure a real S3 bucket and test a file upload to S3, or
- Create a production-ready deployment config for Vercel / Heroku.

--------------------------------------------------------------------------------
Docker & CI
--------------------------------------------------------------------------------

Quick local Docker Compose (builds backend + frontend and serves frontend via nginx on port 8080):

```bash
cd "E:\Users\anush\OneDrive\Desktop\Real-Estate Listing"
docker-compose up --build -d
```

Stop and remove:

```bash
docker-compose down
```

Notes:
- The `frontend/Dockerfile` uses a build-arg `VITE_API_BASE` (set in `docker-compose.yml` to `http://localhost:5000` for local runs). Change this to your backend URL for production deploys.
- Ensure `backend/.env` contains production secrets (do not commit `.env`).

GitHub Actions (CI): a workflow is included to build and test the project; modify it to push Docker images to your registry if desired.

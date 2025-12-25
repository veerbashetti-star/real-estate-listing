# Deployment Guide

This document explains how to publish Docker images and run the application in production using Docker Compose. The repository includes `docker-compose.prod.yml` which expects images to be available in a registry.

Recommended registry: GitHub Container Registry (GHCR) or Docker Hub.

1) Prepare repository secrets
- Create a personal access token (PAT) with package:write (for GHCR) or repository access for Docker Hub.
- In GitHub repo Settings → Secrets, add `GHCR_PAT` (or `DOCKERHUB_USERNAME` + `DOCKERHUB_TOKEN`).

2) Build & push images locally (optional)

From repository root:
```bash
# Frontend
cd frontend
docker build -t ghcr.io/<your-org>/real-estate-frontend:latest --build-arg VITE_API_BASE=https://your-backend.example.com .

# Backend
cd ../backend
docker build -t ghcr.io/<your-org>/real-estate-backend:latest .

# Push
docker push ghcr.io/<your-org>/real-estate-frontend:latest
docker push ghcr.io/<your-org>/real-estate-backend:latest
```

3) Server-side (production host)
- Copy `docker-compose.prod.yml` to the server (or keep in repo and pull repo on host).
- Create a `.env` file next to the `docker-compose.prod.yml` with production environment variables (at minimum `MONGO_URI`, `JWT_SECRET`, and admin credentials).

Example `.env` (on host):
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/realestate
JWT_SECRET=supersecret
ADMIN_EMAIL=admin@realestate.test
ADMIN_PASS=admin123
```

4) Run on the host
```bash
docker-compose -f docker-compose.prod.yml up -d
```

5) Post-deploy checks
- Visit the frontend URL (port 80) and confirm it loads.
- Verify backend health: `curl http://localhost:5000/` on host.

Notes
- Replace `ghcr.io/<your-org>/...` with your registry & namespace.
- The `frontend` image must be built with the correct `VITE_API_BASE` so the frontend points at your production backend.

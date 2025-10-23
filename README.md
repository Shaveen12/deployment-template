# Dockerized Auto-TLS React + Node Stack

A production-ready stack featuring a React frontend and Node.js API backend, automatically secured with Let's Encrypt TLS certificates via nginx-proxy and acme-companion.

## Features

- **React Frontend** (Vite) served at `https://app.<domain>`
- **Node.js API** (Express) served at `https://api.<domain>`
- **Automatic HTTPS** via Let's Encrypt
- **Zero manual configuration** - just set environment variables and run
- **One-command deployment** with Docker Compose

## Architecture

```
┌─────────────────────────────────────────────┐
│           nginx-proxy (80/443)              │
│         + acme-companion (TLS)              │
└─────────────┬───────────────────────────────┘
              │
        ┌─────┴──────┐
        │            │
    ┌───▼──┐     ┌───▼──┐
    │ app  │     │ api  │
    │:80   │     │:3000 │
    └──────┘     └──────┘
```

## Prerequisites

- Docker & Docker Compose installed
- A domain with DNS access
- VPS with ports 80 and 443 open

## Quick Start

### 1. DNS Setup

Create A (or AAAA for IPv6) records pointing to your server's IP:

```
app.yourdomain.com  →  YOUR_SERVER_IP
api.yourdomain.com  →  YOUR_SERVER_IP
```

### 2. Install Docker (Ubuntu example)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```bash
DOMAIN=yourdomain.com
ACME_EMAIL=you@yourdomain.com
```

### 4. Deploy

```bash
docker compose up -d --build
```

That's it! The stack will:
- Start nginx-proxy and acme-companion
- Build and launch the frontend and API containers
- Automatically request and configure Let's Encrypt certificates
- Certificates are auto-renewed before expiration

## Verification

Check that services are running:

```bash
docker compose ps
```

Test the API:

```bash
curl https://api.yourdomain.com/api/hello
curl https://api.yourdomain.com/health
```

Visit your frontend:

```
https://app.yourdomain.com
```

## API Endpoints

- `GET /api/hello` - Returns a greeting with timestamp
- `GET /health` - Health check endpoint
- `POST /api/echo` - Echoes back the JSON payload

## Project Structure

```
.
├── docker-compose.yml          # Main orchestration file
├── .env.example                # Environment template
├── README.md
├── frontend/
│   ├── Dockerfile              # Multi-stage build
│   ├── nginx.conf              # SPA fallback config
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       └── index.css
└── api/
    ├── Dockerfile
    ├── package.json
    └── server.js               # Express API
```

## Updating Containers

### Update Frontend

```bash
docker compose up -d --build frontend
```

### Update API

```bash
docker compose up -d --build api
```

### Update Everything

```bash
docker compose up -d --build
```

## Logs

View logs for all services:

```bash
docker compose logs -f
```

View specific service logs:

```bash
docker compose logs -f frontend
docker compose logs -f api
docker compose logs -f nginx-proxy
docker compose logs -f acme-companion
```

## Troubleshooting

### Certificates Not Generating

1. **Check DNS propagation:**
   ```bash
   nslookup app.yourdomain.com
   nslookup api.yourdomain.com
   ```

2. **Check acme-companion logs:**
   ```bash
   docker compose logs acme-companion
   ```

3. **Verify ports 80 and 443 are accessible:**
   ```bash
   curl -I http://yourdomain.com
   ```

4. **Let's Encrypt rate limits:** You may be hitting rate limits. Wait a few hours or use staging:
   - Add to `acme-companion` environment in `docker-compose.yml`:
     ```yaml
     - ACME_CA_URI=https://acme-staging-v02.api.letsencrypt.org/directory
     ```

### CORS Issues

If the frontend can't reach the API:

1. Verify `ALLOWED_ORIGIN` in the API container matches the frontend URL
2. Check browser console for specific CORS errors
3. Ensure both containers are on the same `proxy-tier` network

### SPA Routing Issues

If direct navigation to routes returns 404:

1. Verify `nginx.conf` has `try_files $uri /index.html;`
2. Rebuild frontend container: `docker compose up -d --build frontend`

### Container Won't Start

Check logs for the specific container:

```bash
docker compose logs [service_name]
```

Common issues:
- Port conflicts (another service using 80/443)
- Invalid environment variables
- Build failures (check Node/npm versions)

## Development

For local development without TLS:

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

### API

```bash
cd api
npm install
npm start
```

Runs on `http://localhost:3000`

## Security Notes

- Never commit `.env` files to version control
- Keep Docker images updated regularly
- Review acme-companion logs periodically
- Consider adding rate limiting to the API
- Use firewall rules to restrict access if needed

## License

MIT

# Universal iDRAC Console

**Universal iDRAC Console** is an **open-source** project by **[Sumit Kumawat](https://www.sumitkumawat.com)**. It is a zero–client-install, Docker-hosted web platform for managing Dell PowerEdge servers across **iDRAC 6, 7, 8, and 9** from one browser UI.

| Generation | Console |
|------------|---------|
| iDRAC 8/9 | Native HTML5 (iframe) |
| iDRAC 6/7 | noVNC bridge (Java viewer runs server-side in Docker) |

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Commercial edition with edge agents: **[conzex/uidrac](https://github.com/conzex/uidrac)** — see [`REPOS.md`](REPOS.md).

---

## Host on your own VM (recommended)

Run the full stack on a **Linux VM** (Ubuntu 22.04/24.04 LTS, Debian 12, RHEL 8+, etc.) with Docker. The API talks to iDRAC addresses on your network directly directly from the API container (no edge agent).

### VM requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| vCPU | 2 | 4 |
| RAM | 4 GB | 8 GB |
| Disk | 40 GB | 80 GB+ |
| OS | Linux x86_64 | Ubuntu 24.04 LTS |
| Network | Reach iDRAC HTTPS (443) from the VM | Same VLAN as management |

**Firewall (production):** open **80** and **443** to users **unless** you use [Cloudflare Tunnel](docs/CLOUDFLARE-TUNNEL.md) (then inbound 80/443 can stay closed; tunnel origin is **`https://127.0.0.1:443`**).

### 1. Install Docker on the VM

```bash
sudo apt update && sudo apt install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
# log out and back in, then:
docker compose version
```

### 2. Get the application

```bash
git clone https://github.com/sumit-kumawat/uidrac.git
cd uidrac
cp .env.selfhosted.example .env
bash scripts/generate-keys.sh
# Paste JWT_SECRET, REFRESH_SECRET, MASTER_ENCRYPTION_KEY, POSTGRES_PASSWORD into .env
```

Edit `.env`:

- Set `PUBLIC_APP_URL`, `PUBLIC_API_URL`, `NEXT_PUBLIC_*`, and `CORS_ORIGINS` to your **HTTPS** URL (e.g. `https://idrac.company.com`).
- Set `POSTGRES_URL` password to match `POSTGRES_PASSWORD`.
- The API must reach iDRAC HTTPS from the Docker network.

Update `nginx/nginx.conf`: replace `idrac.yourdomain.com` in `server_name` with your hostname (or keep `_` for any host).

### 3. TLS certificates

See [`nginx/certs/README.md`](nginx/certs/README.md). Quick self-signed lab cert:

```bash
mkdir -p nginx/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/certs/privkey.pem \
  -out nginx/certs/fullchain.pem \
  -subj "/CN=idrac.yourdomain.com"
```

For production, use **Let's Encrypt** (documented in the certs README).

### 4. Start production stack

```bash
chmod +x scripts/vm-prod.sh scripts/host.sh scripts/generate-keys.sh
bash scripts/vm-prod.sh
```

This builds the **legacy console** image (`universal-idrac-console:legacy`), then starts **postgres**, **redis**, **api**, **web**, **console-gw**, and **nginx**.

Verify:

```bash
curl -sk https://idrac.yourdomain.com/api/health
```

Open the portal URL from `.env`, **Register** your organization, then **Add Server** with iDRAC IP + credentials.

### 5. Updates & backups

```bash
# Pull/copy new release, then:
docker compose -f docker-compose.prod.yml up -d --build

# Database backup (example)
docker compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U idrac idrac > idrac-backup-$(date +%F).sql
```

**Full guide:** [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) (firewall, DNS, cloud mode, troubleshooting).

### Publish with Cloudflare Tunnel (optional)

No public inbound ports: run **`bash scripts/vm-prod.sh`**, then **cloudflared** on the VM pointing at nginx on host port **443**.

| Item | Value |
|------|--------|
| Tunnel origin | `https://127.0.0.1:443` |
| TLS on origin | Self-signed OK — enable **No TLS Verify** on the tunnel |
| Public URL in `.env` | `https://idrac.yourdomain.com` (same as tunnel hostname) |

Steps, dashboard setup, and config: **[`docs/CLOUDFLARE-TUNNEL.md`](docs/CLOUDFLARE-TUNNEL.md)** · example [`cloudflare/config.yml.example`](cloudflare/config.yml.example)

---

## Quick start (lab / single machine)

For local testing with ports **3000** (UI) and **4000** (API) exposed:

```bash
cp .env.example .env
bash scripts/generate-keys.sh   # paste into .env
bash scripts/host.sh
# Portal: http://localhost:3000
```

Build legacy console once if you use iDRAC 6/7:

```bash
docker build -f docker/idrac-legacy.Dockerfile -t universal-idrac-console:legacy .
```

---

## Architecture

```
Browser ──HTTPS──► nginx (:443)
                      ├── /        → Next.js (web)
                      ├── /api/*   → NestJS (api)
                      └── /console → Console GW (:6080) → legacy Docker + noVNC

api ──► PostgreSQL, Redis
api ──► iDRAC HTTPS (Redfish / legacy) on your LAN
console-gw ──► Docker socket (spawns legacy viewer containers)
```

---

## Deployment

| Mode | Env template |
|------|----------------|
| **Production VM** | `.env.selfhosted.example` |
| **VM + Cloudflare Tunnel** | `.env.selfhosted.example` + [`docs/CLOUDFLARE-TUNNEL.md`](docs/CLOUDFLARE-TUNNEL.md) |
| **Lab / dev** | `.env.example` |

This edition does **not** include the Conzex cloud edge agent. The API connects to iDRAC directly.

---

## Environment files

| File | Use |
|------|-----|
| [`.env.example`](.env.example) | Local Docker Compose (`docker compose up`) |
| [`.env.selfhosted.example`](.env.selfhosted.example) | **Production on your VM** |

Never commit `.env`. Generate secrets with [`scripts/generate-keys.sh`](scripts/generate-keys.sh).

Key variables:

| Variable | Purpose |
|----------|---------|
| `POSTGRES_URL` / `POSTGRES_PASSWORD` | Database |
| `REDIS_URL` | Sessions & cache |
| `JWT_SECRET`, `REFRESH_SECRET` | Auth |
| `MASTER_ENCRYPTION_KEY` | AES-256 for stored iDRAC credentials (64 hex chars) |
| `PUBLIC_APP_URL`, `NEXT_PUBLIC_*`, `CORS_ORIGINS` | Public URLs (must match browser) |
| `TLS_CERT_PATH`, `TLS_KEY_PATH` | nginx TLS (production) |

---

## Adding servers

1. Log in → **Dashboard** → **Add Server**
2. Enter iDRAC IP and credentials; generation is auto-detected
3. Choose **Save** (encrypted in DB) or **session-only** (Redis TTL)

Bulk CSV import:

```bash
bash scripts/import-csv.sh servers.csv https://idrac.yourdomain.com/api YOUR_JWT
```

---

## Security (summary)

- User passwords: **argon2id**
- Stored iDRAC credentials: **AES-256-GCM**
- JWT access + refresh cookies; RBAC (owner / admin / operator / viewer)
- Tenant isolation; immutable audit log
- TLS via nginx; rate limits on login and API

---

## Development

```bash
pnpm install
pnpm db:generate
pnpm dev          # or: docker compose up -d --build
pnpm typecheck
pnpm test
```

Version history: in-app **Version manager** (`/versions`) and [`docs/VERSIONING.md`](docs/VERSIONING.md).

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| API unhealthy | `docker compose logs api` — DB URL, secrets, Prisma migrate |
| Cannot reach iDRAC | From VM: `docker compose exec api wget -qO- -k https://IDRAC_IP/redfish/v1` |
| Legacy console fails | Legacy image built? `docker images \| grep legacy`; Docker socket mounted on `console-gw` |
| Wrong API in browser | `NEXT_PUBLIC_API_URL` must match how users reach the site |
| TLS errors | Certs in `nginx/certs/`; `server_name` matches certificate CN/SAN |

More: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Support & contributions

Issues and PRs: [github.com/sumit-kumawat/uidrac](https://github.com/sumit-kumawat/uidrac/issues) · [hello@sumitkumawat.com](mailto:hello@sumitkumawat.com)

---

## License

[MIT](LICENSE) — Copyright Sumit Kumawat. Conzex product (with edge agent): [conzex/uidrac](https://github.com/conzex/uidrac).

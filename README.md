# Universal iDRAC Console (uidrac)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Open source** by [Sumit Kumawat](https://www.sumitkumawat.com) — one web UI for Dell **iDRAC 6–9**. Self-hosted Docker; **API talks to iDRAC on your LAN** (no edge agent).

| iDRAC | Remote console |
|-------|----------------|
| 8 / 9 | HTML5 in browser |
| 6 / 7 | noVNC (Java runs in Docker on the server) |

## Repositories

| | Name | URL |
|---|------|-----|
| **This repo (open source)** | `sumit-kumawat/uidrac` | **https://github.com/sumit-kumawat/uidrac** |
| **Conzex product (+ edge agent)** | Conzex (commercial) | **https://www.conzex.com** |

Dual-repo engineering notes: [REPOS.md](REPOS.md)

---

## Try it locally (5 minutes)

```bash
git clone https://github.com/sumit-kumawat/uidrac.git && cd uidrac
cp .env.example .env
bash scripts/generate-keys.sh --write   # required before production; replaces public lab defaults
bash scripts/host.sh
```

> **Security (open source only):** `.env.example` contains **temporary lab keys that are public in GitHub**. They are fine for `localhost` trials only. For anything on a network or the internet, run `generate-keys.sh --write` and treat the old defaults as compromised.

Open **http://localhost:3000** → Register → Add Server (iDRAC IP + credentials).

---

## Production on your VM

| Step | Action |
|------|--------|
| 1 | Linux VM with Docker; VM must reach **iDRAC HTTPS (443)** on your LAN |
| 2 | `cp .env.selfhosted.example .env` then `bash scripts/generate-keys.sh --write` |
| 3 | Set all `PUBLIC_*` / `NEXT_PUBLIC_*` / `CORS_ORIGINS` to your **https://** site URL |
| 4 | TLS in `nginx/certs/` ([help](nginx/certs/README.md)); `server_name` in `nginx/nginx.conf` |
| 5 | `bash scripts/vm-prod.sh` → `curl -sk https://YOUR_HOST/api/health` |

If `docker compose` fails with **sysctl permission denied** and `systemd-detect-virt -c` shows **`lxc`**, see **[docs/PROXMOX-LXC-DOCKER.md](docs/PROXMOX-LXC-DOCKER.md)** — a Proxmox **KVM VM** is the simplest path.

If `docker compose` reports **`cgroupns_mode not allowed`**, run `git pull` (fixed in recent commits).

Optional: **Cloudflare Tunnel** → origin `https://127.0.0.1:443` — [docs/CLOUDFLARE-TUNNEL.md](docs/CLOUDFLARE-TUNNEL.md).

Full guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) (this edition has **no** cloud edge-agent docs).

---

## What runs in Docker

`postgres` · `redis` · `api` · `web` · `console-gw` · `nginx` (production)

Legacy iDRAC 6/7 image (once):  
`docker build -f docker/idrac-legacy.Dockerfile -t universal-idrac-console:legacy .`

---

## Docs map

| Topic | File |
|-------|------|
| VM hosting | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| Cloudflare Tunnel | [docs/CLOUDFLARE-TUNNEL.md](docs/CLOUDFLARE-TUNNEL.md) |
| Versions | `/versions` · [docs/VERSIONING.md](docs/VERSIONING.md) |
| Two repos | [REPOS.md](REPOS.md) |

---

## Develop

```bash
pnpm install && pnpm db:generate
pnpm dev
pnpm typecheck
```

Issues & PRs: **https://github.com/sumit-kumawat/uidrac/issues** · hello@sumitkumawat.com

**License:** [MIT](LICENSE)

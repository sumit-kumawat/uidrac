#!/usr/bin/env bash
# host.sh — Build and start Universal iDRAC Console (Docker)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env — run: cp .env.example .env"
  echo "Then: bash scripts/generate-keys.sh --write  (replaces public lab keys in .env)"
  exit 1
fi

if grep -q '^JWT_SECRET=dev-jwt-secret-change-in-production' .env 2>/dev/null; then
  echo "⚠️  OPEN SOURCE: .env still has public lab defaults from .env.example."
  echo "   Generating unique secrets now (bash scripts/generate-keys.sh --write)…"
  bash "$(dirname "$0")/generate-keys.sh" --write
  echo ""
fi

echo "Building and starting services (postgres, redis, api, web, console-gw)…"
if ! sysctl net.ipv4.ip_unprivileged_port_start >/dev/null 2>&1; then
  echo "⚠️  Docker sysctl check failed. Run as root:"
  echo "   bash scripts/fix-docker-sysctl.sh"
  echo "   See docs/DOCKER-TROUBLESHOOTING.md"
  echo ""
fi

if [[ -f /sys/module/apparmor/parameters/enabled ]] && grep -qE '^Y' /sys/module/apparmor/parameters/enabled 2>/dev/null; then
  echo "⚠️  AppArmor + runc 1.5+ can block all containers. Run as root before compose:"
  echo "   bash scripts/fix-docker-sysctl.sh"
  echo ""
fi
if ! docker image inspect uidrac:legacy >/dev/null 2>&1; then
  echo "Building legacy console image (first run)…"
  docker build -f docker/idrac-legacy.Dockerfile -t uidrac:legacy .
fi
docker compose up -d --build

echo ""
echo "Waiting for API health…"
for i in $(seq 1 30); do
  if curl -sf http://localhost:4000/api/health >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo ""
echo "Universal iDRAC Console (development compose)"
echo "  Portal:  http://localhost:3000"
echo "  API:     http://localhost:4000/api"
echo "  Health:  http://localhost:4000/api/health"
echo ""
echo "Production on a VM:  cp .env.selfhosted.example .env  &&  bash scripts/vm-prod.sh"
echo "  See README.md and docs/DEPLOYMENT.md"
echo ""
docker compose ps

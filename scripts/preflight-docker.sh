#!/usr/bin/env bash
# Fail fast before a long docker compose build if the host cannot run containers.
# Usage: bash scripts/preflight-docker.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

err() {
  echo "" >&2
  echo "ERROR: $*" >&2
  echo "" >&2
  exit 1
}

if ! command -v docker >/dev/null 2>&1; then
  err "Docker is not installed. On a KVM VM see docs/DEPLOYMENT-KVM-VM.md"
fi

if ! docker info >/dev/null 2>&1; then
  err "Docker daemon is not running. Try: systemctl start docker"
fi

VIRT="none"
if command -v systemd-detect-virt >/dev/null 2>&1; then
  VIRT="$(systemd-detect-virt -c 2>/dev/null || true)"
  VIRT="${VIRT:-none}"
fi

if [[ "$VIRT" == "lxc" || "$VIRT" == "container" ]]; then
  echo ""
  echo "╔══════════════════════════════════════════════════════════════════════════╗"
  echo "║  Proxmox LXC detected — uidrac is not supported here without hypervisor  ║"
  echo "║  changes, and Docker 29 + runc often fails entirely (sysctl error).      ║"
  echo "║                                                                          ║"
  echo "║  Recommended: create a KVM/QEMU Linux VM and run scripts/host.sh there.  ║"
  echo "║  Docs: docs/DEPLOYMENT-KVM-VM.md  |  LXC: docs/PROXMOX-LXC-DOCKER.md     ║"
  echo "╚══════════════════════════════════════════════════════════════════════════╝"
  echo ""
  echo "Note: pct / /etc/pve/lxc/*.conf are edited on the Proxmox HOST, not inside this CT."
  echo ""
fi

HELLO_LOG="$(mktemp)"
if ! docker run --rm hello-world >"$HELLO_LOG" 2>&1; then
  cat "$HELLO_LOG" >&2
  rm -f "$HELLO_LOG"
  if [[ "$VIRT" == "lxc" || "$VIRT" == "container" ]]; then
    err "Docker cannot run inside this LXC. Deploy on a KVM VM (docs/DEPLOYMENT-KVM-VM.md)."
  fi
  err "Docker cannot start containers. As root run: bash scripts/fix-docker-sysctl.sh — see docs/DOCKER-TROUBLESHOOTING.md"
fi
rm -f "$HELLO_LOG"

echo "✓ Docker preflight OK (hello-world)"

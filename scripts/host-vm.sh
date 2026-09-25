#!/usr/bin/env bash
# host-vm.sh — Same as host.sh but intended for a KVM/bare-metal Linux VM (not Proxmox LXC).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

bash "$ROOT/scripts/preflight-docker.sh"
exec bash "$ROOT/scripts/host.sh"

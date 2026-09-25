#!/usr/bin/env bash
# Host fixes for Docker on RHEL/LXC VMs (sysctl + AppArmor/runc CVE-2025-52881).
# Usage (as root):
#   bash scripts/fix-docker-sysctl.sh
#   bash scripts/fix-docker-sysctl.sh --selinux-permissive
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash scripts/fix-docker-sysctl.sh" >&2
  exit 1
fi

CONF=/etc/sysctl.d/99-uidrac-docker.conf
cat >"$CONF" <<'EOF'
net.ipv4.ip_unprivileged_port_start=0
EOF

echo "Applying $CONF …"
sysctl --system 2>/dev/null | grep ip_unprivileged_port_start || sysctl -p "$CONF"

# runc 1.5+ + AppArmor mis-detects detached procfs sysctl writes (opencontainers/runc#4968).
# Common on Docker 29, Proxmox/LXC nests, and some cloud images — not fixed by SELinux alone.
if [[ -f /sys/module/apparmor/parameters/enabled ]]; then
  if grep -qE '^Y' /sys/module/apparmor/parameters/enabled 2>/dev/null; then
    echo "AppArmor is enabled — applying Docker/runc workaround (bind-mount trick) …"
    mount --bind /dev/null /sys/module/apparmor/parameters/enabled 2>/dev/null || true
    RC=/etc/rc.local
    if [[ ! -f "$RC" ]] || ! grep -q 'apparmor/parameters/enabled' "$RC" 2>/dev/null; then
      cat >>"$RC" <<'RCLOCAL'

# uidrac: AppArmor workaround for runc 1.5+ (sysctl reopen fd permission denied)
if [ -f /sys/module/apparmor/parameters/enabled ]; then
  mount --bind /dev/null /sys/module/apparmor/parameters/enabled 2>/dev/null || true
fi
RCLOCAL
      chmod +x "$RC" 2>/dev/null || true
      echo "Persisted workaround in $RC (runs on boot)."
    fi
  else
    echo "AppArmor module present but not enforcing (Y flag off)."
  fi
else
  echo "No AppArmor module — skipping AppArmor workaround."
fi

if command -v getenforce >/dev/null 2>&1; then
  echo "SELinux: $(getenforce)"
  if [[ "$(getenforce)" == "Enforcing" && "${1:-}" == "--selinux-permissive" ]]; then
    setenforce 0
    echo "SELinux now: $(getenforce) (until reboot)"
  fi
fi

if command -v systemd-detect-virt >/dev/null 2>&1; then
  VIRT="$(systemd-detect-virt -c 2>/dev/null || true)"
  if [[ "$VIRT" == "lxc" || "$VIRT" == "container" ]]; then
    echo "Nested LXC detected ($VIRT) — see docs/PROXMOX-LXC-DOCKER.md (pct runs on Proxmox host only)."
  fi
fi

if docker info 2>/dev/null | grep -qi 'rootless'; then
  echo "⚠️  Rootless Docker — use rootful docker-ce for uidrac (console gateway needs docker.sock)."
fi

if command -v systemctl >/dev/null 2>&1; then
  if systemctl is-active --quiet docker; then
    echo "Restarting docker …"
    systemctl restart docker
  fi
fi

echo "Done. Retry: docker compose up -d"

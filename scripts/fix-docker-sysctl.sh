#!/usr/bin/env bash
# Host fixes for Docker on RHEL-family VMs (sysctl + optional SELinux permissive test).
# Usage (as root):
#   bash scripts/fix-docker-sysctl.sh
#   bash scripts/fix-docker-sysctl.sh --selinux-permissive   # if sysctl alone is not enough
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash scripts/fix-docker-sysctl.sh" >&2
  exit 1
fi

CONF=/etc/sysctl.d/99-uidrac-docker.conf
cat >"$CONF" <<'EOF'
# Allow containers to bind service ports without runc sysctl init failures (RHEL/Rocky/Alma).
net.ipv4.ip_unprivileged_port_start=0
EOF

echo "Applying $CONF …"
sysctl --system 2>/dev/null | grep ip_unprivileged_port_start || sysctl -p "$CONF"

if command -v getenforce >/dev/null 2>&1; then
  echo "SELinux: $(getenforce)"
  if [[ "$(getenforce)" == "Enforcing" && "${1:-}" == "--selinux-permissive" ]]; then
    echo "Setting SELinux permissive until next reboot (test only) …"
    setenforce 0
    echo "SELinux now: $(getenforce)"
    echo "If compose works, keep docker-compose userns_mode: host (in repo) or configure permanent SELinux policy."
  elif [[ "$(getenforce)" == "Enforcing" ]]; then
    echo "If containers still fail, retry: bash scripts/fix-docker-sysctl.sh --selinux-permissive"
    echo "Or: git pull (compose uses userns_mode: host + label=disable) then docker compose up -d"
  fi
fi

if docker info 2>/dev/null | grep -qi 'rootful'; then
  true
elif docker info 2>/dev/null | grep -qi 'rootless'; then
  echo "⚠️  Rootless Docker detected. This stack needs rootful docker-ce (console gateway uses docker.sock)."
fi

if command -v systemctl >/dev/null 2>&1; then
  if systemctl is-active --quiet docker; then
    echo "Restarting docker …"
    systemctl restart docker
  fi
fi

echo "Done. Retry: docker compose up -d  (from your uidrac clone)"

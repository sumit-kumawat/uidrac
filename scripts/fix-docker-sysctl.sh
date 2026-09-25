#!/usr/bin/env bash
# Applies sysctl settings commonly required for Docker/runc on RHEL-family VMs.
# Usage (as root): bash scripts/fix-docker-sysctl.sh
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
sysctl --system >/dev/null 2>&1 || sysctl -p "$CONF"

if command -v systemctl >/dev/null 2>&1; then
  if systemctl is-active --quiet docker; then
    echo "Restarting docker …"
    systemctl restart docker
  fi
fi

echo "Done. Retry: docker compose up -d  (from your uidrac clone)"

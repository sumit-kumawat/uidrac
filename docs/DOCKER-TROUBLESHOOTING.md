# Docker troubleshooting (Linux VM)

## `ip_unprivileged_port_start` / `permission denied` when starting containers

Example:

```text
OCI runtime create failed: runc create failed: ...
open sysctl net.ipv4.ip_unprivileged_port_start file: reopen fd 8: permission denied
```

This comes from the **host** Docker/runc/kernel setup, not from uidrac application code. It often appears on **RHEL, Rocky, Alma, CentOS Stream** with certain Docker or SELinux combinations.

### Fix (recommended)

As **root** on the VM:

```bash
cd ~/uidrac   # or your clone path
bash scripts/fix-docker-sysctl.sh
docker compose down
bash scripts/host.sh
```

The script sets `net.ipv4.ip_unprivileged_port_start=0`, reloads sysctl, and restarts Docker.

### Manual steps

```bash
echo 'net.ipv4.ip_unprivileged_port_start=0' > /etc/sysctl.d/99-docker-unprivileged-ports.conf
sysctl --system
systemctl restart docker
```

Then bring the stack up again.

### If it still fails

1. **Update Docker** to the current `docker-ce` from Docker’s official repo (not an old distro package).
2. **SELinux:** test permissive mode (`getenforce`; temporarily `setenforce 0`). If that fixes it, add proper SELinux booleans or use `:Z` volume labels — do not leave permissive on in production without a plan.
3. **Rootless Docker:** this stack expects **rootful** Docker (console gateway mounts `/var/run/docker.sock`). Install and use `docker-ce` as root.
4. Collect versions: `docker version`, `runc --version`, `uname -r`.

## Postgres / Redis not published on the host

`docker-compose.yml` keeps Postgres and Redis on the internal `uidrac-net` network only (ports **5432** / **6379** are not bound on the VM). The API reaches them by service name. To connect with `psql` from the host, add a local override:

```yaml
# docker-compose.override.yml
services:
  postgres:
    ports:
      - "5432:5432"
```

# Docker troubleshooting (Linux VM)

## `ip_unprivileged_port_start` / `permission denied` when starting containers

Example:

```text
OCI runtime create failed: runc create failed: ...
open sysctl net.ipv4.ip_unprivileged_port_start file: reopen fd 8: permission denied
```

This comes from the **host** Docker/runc/kernel setup, not from uidrac application code. It often appears on **RHEL, Rocky, Alma, CentOS Stream** with certain Docker, **SELinux**, or user-namespace combinations.

### Fix (step by step)

As **root** on the VM:

```bash
cd ~/uidrac
git pull
bash scripts/fix-docker-sysctl.sh
docker compose down
docker compose up -d
```

`docker-compose.yml` sets **`userns_mode: host`** and **`security_opt: label=disable`** on every service (RHEL workaround). Pull the latest repo if those lines are missing.

### If sysctl alone is not enough

```bash
bash scripts/fix-docker-sysctl.sh --selinux-permissive
docker compose down && docker compose up -d
```

That sets SELinux to **permissive until reboot** as a diagnostic step. If that fixes startup, do not leave permissive on in production without a proper policy — keep the compose `userns_mode` / `label=disable` settings from the repo.

### Manual sysctl

```bash
echo 'net.ipv4.ip_unprivileged_port_start=0' > /etc/sysctl.d/99-docker-unprivileged-ports.conf
sysctl --system
systemctl restart docker
```

### If it still fails

1. **Update Docker** to current `docker-ce` from Docker’s official repo (`docker version`, `runc --version`).
2. **Rootless Docker:** use **rootful** `docker-ce` (console gateway needs `/var/run/docker.sock`).
3. Check **`/etc/docker/daemon.json`** for `"userns-remap"` — it conflicts with `userns_mode: host`; disable remapping for this stack.
4. Collect: `docker version`, `runc --version`, `getenforce`, `uname -r`.

## Postgres / Redis not published on the host

`docker-compose.yml` keeps Postgres and Redis on the internal `uidrac-net` network only (ports **5432** / **6379** are not bound on the VM). The API reaches them by service name. To connect with `psql` from the host, add a local override:

```yaml
# docker-compose.override.yml
services:
  postgres:
    ports:
      - "5432:5432"
```

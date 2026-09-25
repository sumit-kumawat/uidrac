# Docker troubleshooting (Linux VM)

## `ip_unprivileged_port_start` / `permission denied` when starting containers

Example:

```text
OCI runtime create failed: runc create failed: ...
open sysctl net.ipv4.ip_unprivileged_port_start file: reopen fd 8: permission denied
```

This is usually **not** uidrac application code. With **Docker 27+ / runc 1.5+**, a known interaction with **AppArmor** (and nested **LXC/Proxmox** guests) makes runc fail when applying sysctls — [opencontainers/runc#4968](https://github.com/opencontainers/runc/issues/4968) (CVE-2025-52881). **SELinux off does not fix it** if AppArmor is still active.

### Fix (do this first)

As **root**:

```bash
cd ~/uidrac
git pull
bash scripts/fix-docker-sysctl.sh    # sysctl + AppArmor workaround + restart Docker
docker compose down
docker compose up -d
```

The script:

1. Sets `net.ipv4.ip_unprivileged_port_start=0`
2. If AppArmor is enabled, applies the bind-mount workaround so Docker/runc can start containers
3. Restarts Docker

`docker-compose.yml` also sets `apparmor=unconfined`, `userns_mode: host`, and related options on each service.

### Verify AppArmor was the cause

```bash
cat /sys/module/apparmor/parameters/enabled   # Y = enabled
docker run --rm hello-world                 # should work after fix script
```

### Nested LXC / Proxmox / Incus

If this VM is itself an **LXC container**, the **host** must allow nesting, for example:

- **Proxmox:** `lxc.apparmor.profile: unconfined` on the CT (or updated `lxc-pve` with Incus nesting fixes)
- **Incus:** `security.nesting=true` on the parent instance

Run inside the guest:

```bash
systemd-detect-virt -c
```

### If it still fails

1. **Pin Docker** to 27.x / runc 1.2 until the host AppArmor profile is updated (distro-specific).
2. Use a **bare-metal or KVM VM**, not nested LXC, for production uidrac.
3. Collect: `docker version`, `runc --version`, `cat /sys/module/apparmor/parameters/enabled`, `systemd-detect-virt -c`.

## Postgres / Redis not published on the host

Postgres and Redis are only on `uidrac-net`. The API uses `postgres:5432` and `redis:6379`. To expose Postgres on the host, add `docker-compose.override.yml` with `ports: ["5432:5432"]` on `postgres`.

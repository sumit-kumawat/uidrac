# Docker troubleshooting (Linux VM)

## `ip_unprivileged_port_start` / `permission denied`

```text
open sysctl net.ipv4.ip_unprivileged_port_start file: reopen fd 8: permission denied
```

Common with **Docker 29 + runc 1.5+** and **AppArmor** ([runc #4968](https://github.com/opencontainers/runc/issues/4968)).

### If `systemd-detect-virt -c` shows `lxc` (Proxmox CT)

**You are in a nested LXC.** Scripts inside the CT cannot fully fix this. Read **[PROXMOX-LXC-DOCKER.md](./PROXMOX-LXC-DOCKER.md)** and either configure the CT on the **Proxmox host** or use a **KVM VM**.

Quick test:

```bash
docker run --rm hello-world
```

If that fails, uidrac will not start until the host/LXC issue is fixed.

### Bare metal or KVM VM

As root:

```bash
cd ~/uidrac
bash scripts/fix-docker-sysctl.sh
systemctl restart docker
docker run --rm hello-world
docker compose up -d
```

### Compose error: `cgroupns_mode not allowed`

Your `docker compose` CLI is older. The repo no longer sets `cgroupns_mode`. Run `git pull` and retry.

## Postgres / Redis ports

Not published on the host by default; API uses `postgres:5432` on `uidrac-net`.

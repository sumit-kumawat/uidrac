# Proxmox LXC vs KVM for uidrac

**uidrac requires Docker.** Docker **inside a Proxmox LXC** often fails with:

```text
open sysctl net.ipv4.ip_unprivileged_port_start file: reopen fd 8: permission denied
```

That is a **nested container + runc** limitation, not an application bug. **We do not support running the Docker stack inside an unconfigured LXC.**

## What to do

| Environment | Action |
|-------------|--------|
| **Proxmox LXC (your current `uidrac` CT)** | Do **not** run `host.sh` here until you move, or fix the CT on the **Proxmox host** (below). |
| **Production / recommended** | Create a **KVM/QEMU VM** → [DEPLOYMENT-KVM-VM.md](./DEPLOYMENT-KVM-VM.md) |
| **Advanced** | Reconfigure this LXC on the **hypervisor** (Option A) |

## Important: where commands run

| Command | Where |
|---------|--------|
| `pct`, `/etc/pve/lxc/*.conf` | **Proxmox host** (SSH to `pve`, hostname usually not `uidrac`) |
| `docker compose`, `host.sh`, `git clone` | **Inside** the Linux guest (VM or CT) |

If `pct: command not found`, you are **inside** the CT — switch to the Proxmox host shell.

## Option A — Fix LXC on the Proxmox host (advanced)

1. On the **Proxmox host**, find CT ID: `pct list` (look for your CT name/IP).

2. Replace **`100`** with your real ID (not the literal `???`):

```bash
CTID=100

pct set "$CTID" -features nesting=1

CFG="/etc/pve/lxc/${CTID}.conf"
grep -q 'lxc.apparmor.profile' "$CFG" 2>/dev/null || echo 'lxc.apparmor.profile: unconfined' >> "$CFG"
grep -q 'lxc.cgroup2.devices.allow' "$CFG" 2>/dev/null || echo 'lxc.cgroup2.devices.allow: a' >> "$CFG"

pct reboot "$CTID"
```

3. **Inside** the CT after reboot:

```bash
bash scripts/fix-docker-sysctl.sh
bash scripts/preflight-docker.sh
bash scripts/host.sh
```

If `preflight-docker.sh` still fails, use a **KVM VM** instead.

## Option B — KVM VM (recommended)

[DEPLOYMENT-KVM-VM.md](./DEPLOYMENT-KVM-VM.md)

## Verify environment

```bash
systemd-detect-virt -c    # want: none or kvm — not lxc
docker run --rm hello-world
bash scripts/preflight-docker.sh
```

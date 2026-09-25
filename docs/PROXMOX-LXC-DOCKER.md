# Running uidrac in a Proxmox LXC container

If `systemd-detect-virt -c` prints **`lxc`**, this VM is a **nested container**. Docker 29 + runc 1.5 often fails with:

```text
open sysctl net.ipv4.ip_unprivileged_port_start file: reopen fd 8: permission denied
```

The bind-mount AppArmor workaround **inside** the CT is **not enough** on many Proxmox setups. You must change the **Proxmox host** configuration for this CT, or run uidrac on a **KVM/QEMU VM** instead (recommended for production).

## Option A — Fix the LXC on the Proxmox host (advanced)

On the **Proxmox node** (SSH to `pve`, not inside `uidrac`):

1. Find the CT ID (Proxmox UI → your CT → ID, or `pct list | grep uidrac`).

2. Enable nesting and relax AppArmor for Docker (replace `CTID`):

```bash
CTID=100   # ← your CT id

pct set "$CTID" -features nesting=1

CFG="/etc/pve/lxc/${CTID}.conf"
grep -q 'lxc.apparmor.profile' "$CFG" 2>/dev/null || echo 'lxc.apparmor.profile: unconfined' >> "$CFG"
grep -q 'lxc.cgroup2.devices.allow' "$CFG" 2>/dev/null || echo 'lxc.cgroup2.devices.allow: a' >> "$CFG"

pct reboot "$CTID"
```

3. After reboot, **inside** the CT:

```bash
bash scripts/fix-docker-sysctl.sh
docker run --rm hello-world
cd ~/uidrac && docker compose up -d
```

If `hello-world` still fails, use **Option B**.

## Option B — Use a KVM VM (recommended)

Create a normal **Linux VM** (not LXC) on Proxmox, install Docker, clone uidrac, run `bash scripts/host.sh`. No nesting/AppArmor conflicts.

## Option C — Install on the Proxmox host itself

Only if policy allows — run Docker directly on the Proxmox node (not ideal for cluster hygiene).

## Verify

```bash
systemd-detect-virt -c    # should be "none" or "kvm" on a proper VM
docker run --rm hello-world
```

# Deploy uidrac on a KVM / bare-metal Linux VM

Use this guide when **`systemd-detect-virt -c`** reports **`none`** or **`kvm`**. Do **not** use Proxmox **LXC** for Docker — see [PROXMOX-LXC-DOCKER.md](./PROXMOX-LXC-DOCKER.md).

## 1. Create the VM (Proxmox example)

- Proxmox → **Create VM** → type **Linux**, machine **q35**, **VirtIO** disk and network.
- OS: Rocky 9, Alma 9, Ubuntu 22.04/24.04, or RHEL 9 (2+ vCPU, 4+ GB RAM, 40+ GB disk).

## 2. Install Docker (example: Rocky/Alma/RHEL)

```bash
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
```

## 3. Clone and start uidrac

```bash
sudo dnf install -y git curl   # or apt on Ubuntu
git clone https://github.com/sumit-kumawat/uidrac.git
cd uidrac
cp .env.example .env
sudo bash scripts/generate-keys.sh --write
sudo bash scripts/host-vm.sh
```

`host-vm.sh` runs **preflight** (`docker run hello-world`) before building images.

## 4. Verify

```bash
curl -s http://localhost:4000/api/health
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
docker compose ps
```

Portal: **http://\<VM-IP\>:3000** — default login **admin** / **admin** (change after first sign-in).

## 5. Production (HTTPS)

```bash
cp .env.selfhosted.example .env
sudo bash scripts/generate-keys.sh --write
# Edit PUBLIC_* URLs and TLS paths
sudo bash scripts/vm-prod.sh
```

See [DEPLOYMENT.md](./DEPLOYMENT.md).

## Troubleshooting

- **sysctl / permission denied:** [DOCKER-TROUBLESHOOTING.md](./DOCKER-TROUBLESHOOTING.md) — on a KVM VM, `bash scripts/fix-docker-sysctl.sh` as root is usually enough.
- **Still on LXC:** preflight will stop before `docker compose build` — move to a KVM VM.

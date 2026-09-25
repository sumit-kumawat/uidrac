# Dual repository workflow (engineering)

Two code lines share history but different distribution. **Do not publish Conzex product clone URLs to customers.**

| | Conzex product | Open-source fork (this repo) |
|---|----------------|------------------------------|
| **Role** | Proprietary product + edge agent | MIT, no edge agent |
| **Remote name** | Conzex engineering remote (private) | `sumit-kumawat/uidrac` |
| **OSS URL** | — | https://github.com/sumit-kumawat/uidrac |
| **Local folder** | `universal-idrac-console/` | `uidrac/` |

## What differs

| Area | Conzex product | OSS fork |
|------|----------------|----------|
| Edge agent | Yes | Removed |
| Branding / contact | Conzex | Sumit Kumawat / MIT |
| Customer docs | Usage guide in app; no public GitHub install | Self-host README + this repo |

## After shared feature work

Report changes in three blocks:

**Conzex** — Conzex product tree (engineering)  
**Personal** — https://github.com/sumit-kumawat/uidrac  
**Shared behavior** — what both user bases get

## Remotes (engineers)

```bash
# Conzex product — use your authorized Conzex engineering remote (not customer-facing)
git remote set-url origin <conzex-engineering-remote>

# OSS fork (this repository)
git remote set-url origin https://github.com/sumit-kumawat/uidrac.git
```

The Conzex product tree maintains the same engineering notes in its `REPOS.md` (without customer-facing GitHub URLs for the product line).

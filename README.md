# game-timer (tabletop-timer.com)

A plain static HTML/CSS/JS tabletop game timer. No build step.

## How it is deployed

This repo is the **single source of truth** for the live site at
<https://tabletop-timer.com>. It is **not** deployed by pushing here alone — the
home server (`serverannah`) is configured by a separate Ansible repo
(`ansible-autoconfig`), whose `game_timer` role **clones this repo directly** and
serves it with nginx.

```
edit here  ──push──▶  GitHub (this repo)  ──ansible clone──▶  serverannah ──nginx──▶ tabletop-timer.com
```

### To ship a change

```bash
# 1. commit + push this repo
git add . && git commit -m "..." && git push        # (or the `lazyg` alias)

# 2. tell the server to re-clone + redeploy
ssh serverannah 'sudo systemctl start autoconfig-pull.service'
```

Then hard-refresh the browser (`Ctrl+Shift+R`). nginx serves the files from a
read-only mount, so updates go live the instant Ansible republishes them — no
container restart.

### What gets served

Everything in the repo root **except** `.git/`, this `README.md`, and the
dev-only dirs `main/` and `newTimerParadigm/` (the exclude list lives in
`ansible-autoconfig`'s `game_timer_deploy_excludes`). So the served files are
`index.html`, `script.js`, `styles.css`, `beep.mp3`, and `html/`.

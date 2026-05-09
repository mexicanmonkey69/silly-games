# Silly Games / Ethical Ops Web Console

This repository now includes a browser-based **Ethical Ops Web Console**: a safe, defensive dashboard for authorized security labs. It is intentionally focused on visibility, planning, notes, and remediation reporting instead of offensive automation.

## Features

- **Dashboard:** authorized-scope confirmation, engagement health, asset counts, packet review totals, enabled plugin counts, and risk posture.
- **Packet analysis board:** sample traffic triage table for defensive observations and reporting practice.
- **SDR integration notes:** receive-only spectrum bookmarks for documenting lab observations.
- **Wi-Fi auditing checklist:** posture checks for encryption, isolation, default credential removal, and firmware cadence.
- **Plugin manager:** modular safe tools that can be toggled in the browser.
- **AI assistant panel:** local defensive guidance prompts for scoping, checklists, packet review, Wi-Fi hardening, and report writing.
- **Cloud-sync-ready snapshots:** saves a portable local JSON snapshot in browser storage and exports reports as JSON.
- **Cross-platform web UI:** static HTML, CSS, and JavaScript that runs in modern desktop and mobile browsers.

## Run locally

Open `index.html` directly in a browser, or serve it with any static file server:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Ethics and safety

Use this project only on systems you own or have explicit written permission to assess. The toolkit is designed for authorized labs, defensive workflows, and remediation-focused reporting.

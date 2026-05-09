# EthosOps Ethical Hacking Toolkit

EthosOps is a browser-based, authorization-first security operations dashboard prototype. It brings together defensive packet review, SDR observation, Wi‑Fi configuration auditing, signed plugins, AI-assisted triage, encrypted cloud sync concepts, and cross-platform delivery in one safe workspace.

## Safety model

This project is intentionally scoped for ethical, owned, or explicitly approved environments only. The interface emphasizes:

- written authorization and in-scope assets before any workflow starts;
- passive packet and RF analysis rather than offensive exploitation;
- Wi‑Fi posture checks for networks you own or administer;
- signed, sandboxed plugins;
- auditable assistant prompts and report exports;
- client-side encrypted cloud sync concepts for evidence bundles.

## Features

- **Executive dashboard:** mission scope, activity counters, posture metrics, and audit event tracking.
- **Packet analysis:** sample flow classification and evidence annotations for PCAP-style metadata.
- **SDR integration:** simulated passive spectrum visualization for approved lab receivers.
- **Wi‑Fi auditing:** compliance-oriented checks for segmentation, credentials, ciphers, and rogue AP watchlists.
- **Plugin marketplace:** signed extension cards for reporting, enrichment, mapping, and detections.
- **AI assistant:** defensive guidance and remediation-oriented summaries.
- **Cloud sync:** zero-trust sync concept with encrypted evidence bundles and cross-platform support.

## Run locally

You only need Node.js. This project has no external npm dependencies, so you do not need to run `npm install` first.

```bash
npm start
```

When the terminal prints `EthosOps dashboard available at http://localhost:4173`, open this URL in your browser:

```text
http://localhost:4173
```

Keep that terminal window open while you use the dashboard. Stop the server with `Ctrl+C`.

## Try the demo

After the page loads, you can verify each feature is working with these safe demo actions:

1. Click **Start authorized session**. The current engagement changes to `Authorized session active`, and the audit event count increases.
2. Review the **Packet analysis** cards. They show sample PCAP-style flow metadata and defensive verdicts.
3. Look at **SDR integration**. The spectrum graph is simulated passive RF data, not live radio capture.
4. Review **Wi‑Fi auditing**. The checklist shows pass/review states for common configuration controls.
5. Click any **Plugin marketplace** card. The audit log count increases to show plugin activity is tracked.
6. Type a question in **AI Assistant**, such as `What should I investigate first?`, then click **Ask**. A defensive remediation-focused response is added to the chat.
7. Click **Sync now**. The cloud sync indicator changes from `82%` to `100%`.
8. Click **Export report**. The app shows a local report-prepared message.

## What this prototype does and does not do

This is currently a front-end prototype that demonstrates the workflow and safety model. It does not capture live packets, control SDR hardware, audit real Wi‑Fi networks, call an AI API, or upload data to a cloud service yet. Those integrations should only be added for systems you own or have explicit written permission to test.

## Troubleshooting

- If `npm start` fails, confirm Node.js is installed with `node --version`.
- If port `4173` is already in use, run with another port, for example `PORT=8080 npm start`, then open `http://localhost:8080`.
- If the browser cannot connect, make sure the terminal running `npm start` is still open and showing the dashboard URL.

## Validate

```bash
npm test
```

The test script performs a JavaScript syntax check with Node.

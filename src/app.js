const flows = [
  { source: '10.10.0.14', destination: '10.10.0.42', protocol: 'TLS', verdict: 'Expected backup traffic' },
  { source: '10.10.0.21', destination: '198.51.100.8', protocol: 'DNS', verdict: 'Review unusual query volume' },
  { source: '10.10.0.88', destination: '10.10.0.5', protocol: 'SSH', verdict: 'Admin bastion approved' },
];

const wifiChecks = [
  ['WPA3 transition policy', 'pass'],
  ['Guest network segmentation', 'pass'],
  ['Default credential exposure', 'pass'],
  ['Legacy cipher inventory', 'review'],
  ['Rogue AP watchlist', 'pass'],
];

const plugins = [
  ['Evidence Builder', 'Creates audit-ready timelines'],
  ['CVE Mapper', 'Maps findings to advisories'],
  ['Sigma Exporter', 'Generates detection logic'],
  ['Asset Tags', 'Adds business context'],
  ['Risk Matrix', 'Scores remediation priority'],
  ['Report Studio', 'Builds client-ready PDFs'],
];

const chatSeed = [
  ['assistant', 'I can summarize defensive findings, explain packet patterns, or draft remediation steps for authorized environments.'],
  ['user', 'Summarize the current lab posture.'],
  ['assistant', 'The lab is healthy overall: Wi‑Fi controls pass most checks, packet review has one DNS volume item to investigate, and plugins are signed.'],
];

let auditEvents = 0;

function addAuditEvent(label) {
  auditEvents += 1;
  document.querySelector('#eventCount').textContent = `${auditEvents} event${auditEvents === 1 ? '' : 's'}`;
  console.info(`[audit] ${new Date().toISOString()} ${label}`);
}

function renderFlows() {
  const flowList = document.querySelector('#flowList');
  flowList.innerHTML = flows.map((flow) => `
    <div class="flow-item">
      <span>${flow.protocol}</span>
      <strong>${flow.source} → ${flow.destination}</strong>
      <small>${flow.verdict}</small>
    </div>
  `).join('');
}

function renderWifiChecks() {
  const checkList = document.querySelector('#wifiChecks');
  checkList.innerHTML = wifiChecks.map(([label, state]) => `
    <li class="${state}"><span>${state === 'pass' ? '✓' : '!'}</span>${label}<strong>${state}</strong></li>
  `).join('');
}

function renderPlugins() {
  const pluginGrid = document.querySelector('#pluginGrid');
  pluginGrid.innerHTML = plugins.map(([name, description]) => `
    <button class="plugin-card" type="button">
      <strong>${name}</strong>
      <small>${description}</small>
      <span>Signed</span>
    </button>
  `).join('');

  pluginGrid.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => addAuditEvent(`plugin viewed: ${button.querySelector('strong').textContent}`));
  });
}

function drawSpectrum() {
  const canvas = document.querySelector('#spectrum');
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#28d7ff');
  gradient.addColorStop(0.5, '#8d5cff');
  gradient.addColorStop(1, '#42f59e');

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let x = 0; x < canvas.width; x += 40) {
    context.fillRect(x, 0, 1, canvas.height);
  }

  context.beginPath();
  context.moveTo(0, 145);
  for (let x = 0; x < canvas.width; x += 8) {
    const wave = Math.sin(x / 18) * 18 + Math.cos(x / 37) * 24;
    const spike = x % 112 === 0 ? 64 : 0;
    context.lineTo(x, 130 - wave - spike);
  }
  context.strokeStyle = gradient;
  context.lineWidth = 3;
  context.stroke();
}

function renderChat() {
  const chatLog = document.querySelector('#chatLog');
  chatLog.innerHTML = chatSeed.map(([role, message]) => `
    <div class="message ${role}"><strong>${role}</strong><p>${message}</p></div>
  `).join('');
  chatLog.scrollTop = chatLog.scrollHeight;
}

function wireInteractions() {
  document.querySelector('#startSession').addEventListener('click', () => {
    document.querySelector('#missionName').textContent = 'Authorized session active';
    addAuditEvent('authorized session started');
  });

  document.querySelector('#exportReport').addEventListener('click', () => {
    addAuditEvent('report export prepared');
    alert('Report bundle prepared locally with scope, evidence, and remediation summary.');
  });

  document.querySelector('#syncNow').addEventListener('click', () => {
    document.querySelector('#syncPercent').textContent = '100%';
    addAuditEvent('encrypted sync completed');
  });

  document.querySelector('#assistantForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.querySelector('#assistantInput');
    const prompt = input.value.trim();
    if (!prompt) return;

    chatSeed.push(['user', prompt]);
    chatSeed.push(['assistant', 'Defensive recommendation: keep the activity within the approved scope, preserve evidence, prioritize validation over exploitation, and document remediation owners.']);
    input.value = '';
    renderChat();
    addAuditEvent('assistant prompt answered');
  });
}

renderFlows();
renderWifiChecks();
renderPlugins();
drawSpectrum();
renderChat();
wireInteractions();

const packets = [
  { time: '09:12:04', protocol: 'DNS', note: 'Unexpected resolver fallback in lab VLAN', severity: 'medium' },
  { time: '09:15:22', protocol: 'TLS', note: 'Legacy cipher observed on staging host', severity: 'high' },
  { time: '09:18:47', protocol: 'HTTP', note: 'Missing security headers in test app', severity: 'medium' },
  { time: '09:21:11', protocol: 'NTP', note: 'Healthy time sync from approved source', severity: 'low' },
];

const wifiChecks = [
  ['WPA3 / WPA2-Enterprise enabled', 'Pass'],
  ['Guest network isolated from internal assets', 'Pass'],
  ['Default SSIDs removed', 'Pass'],
  ['Old IoT lab AP scheduled for firmware update', 'Review'],
];

const plugins = [
  ['Asset Scope', 'Tracks approved targets and assessment windows.', false],
  ['PCAP Notes', 'Annotates packet captures without active probing.', false],
  ['SDR Bookmarks', 'Stores receive-only lab frequency notes.', false],
  ['Wi-Fi Hygiene', 'Scores configuration against defensive baselines.', false],
  ['Evidence Vault', 'Bundles screenshots, hashes, and reviewer notes.', true],
  ['Compliance Mapper', 'Maps findings to common control families.', true],
];

const timeline = [
  ['09:00 UTC', 'Workspace opened', 'Synced'],
  ['09:12 UTC', 'Packet observation added to evidence queue', 'Queued'],
  ['09:25 UTC', 'Wi-Fi audit checklist updated', 'Synced'],
  ['09:38 UTC', 'Draft executive report generated', 'Local'],
];

const safeReplies = [
  'Start by confirming written authorization, scope, maintenance windows, and emergency contacts.',
  'For packet work, import captures from your own lab and summarize protocols, hosts, and defensive findings.',
  'For Wi-Fi audits, prioritize encryption, segmentation, firmware age, rogue AP detection, and guest isolation.',
  'For SDR, keep monitoring receive-only unless your license and authorization explicitly permit transmission.',
];

function renderPackets() {
  const rows = document.querySelector('#packetRows');
  rows.innerHTML = packets.map(item => `
    <tr>
      <td>${item.time}</td>
      <td>${item.protocol}</td>
      <td>${item.note}</td>
      <td><span class="badge ${item.severity}">${item.severity}</span></td>
    </tr>
  `).join('');
}

function drawTrafficChart() {
  const canvas = document.querySelector('#trafficChart');
  const ctx = canvas.getContext('2d');
  const values = [24, 42, 38, 66, 58, 82, 64, 74, 96, 70, 88, 62, 76, 54, 68, 90];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(255,255,255,0.11)';
  ctx.lineWidth = 1;
  for (let y = 40; y < canvas.height; y += 40) {
    ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(canvas.width - 20, y); ctx.stroke();
  }
  const step = (canvas.width - 60) / (values.length - 1);
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = 30 + index * step;
    const y = canvas.height - 24 - value * 1.8;
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#62f3c5';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.lineTo(canvas.width - 30, canvas.height - 24);
  ctx.lineTo(30, canvas.height - 24);
  ctx.closePath();
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(98,243,197,0.3)');
  gradient.addColorStop(1, 'rgba(98,243,197,0.02)');
  ctx.fillStyle = gradient;
  ctx.fill();
}

function renderSpectrum() {
  const spectrum = document.querySelector('#spectrum');
  spectrum.innerHTML = Array.from({ length: 36 }, (_, index) => {
    const height = 18 + Math.abs(Math.sin(index * 0.7)) * 78 + (index % 7) * 3;
    return `<span class="bar" style="height:${height}%"></span>`;
  }).join('');
}

function renderWifi() {
  document.querySelector('#wifiChecks').innerHTML = wifiChecks.map(([label, status]) => `
    <div class="audit-item"><span>${label}</span><strong>${status}</strong></div>
  `).join('');
}

function renderPlugins(showBeta = true) {
  document.querySelector('#pluginGrid').innerHTML = plugins
    .filter(([, , beta]) => showBeta || !beta)
    .map(([name, description, beta]) => `
      <div class="plugin-card">
        <strong>${name} ${beta ? '<span class="badge medium">beta</span>' : ''}</strong>
        <p>${description}</p>
      </div>
    `).join('');
}

function renderTimeline() {
  document.querySelector('#timeline').innerHTML = timeline.map(([time, event, state]) => `
    <div class="timeline-item"><strong>${time}</strong><span>${event}</span><span class="badge low">${state}</span></div>
  `).join('');
}

function addMessage(text, sender = 'assistant') {
  const chat = document.querySelector('#chatLog');
  const node = document.createElement('div');
  node.className = `message ${sender}`;
  node.textContent = text;
  chat.appendChild(node);
  chat.scrollTop = chat.scrollHeight;
}

function toast(message) {
  const toastNode = document.querySelector('#toast');
  toastNode.textContent = message;
  toastNode.classList.add('show');
  setTimeout(() => toastNode.classList.remove('show'), 2400);
}

function initInteractions() {
  let betaVisible = true;
  document.querySelector('#togglePlugins').addEventListener('click', () => {
    betaVisible = !betaVisible;
    renderPlugins(betaVisible);
    toast(betaVisible ? 'Beta plugins visible.' : 'Beta plugins hidden.');
  });

  document.querySelector('#runDemo').addEventListener('click', () => {
    document.querySelector('#assetCount').textContent = '48';
    document.querySelector('#packetCount').textContent = '21.7k';
    document.querySelector('#wifiScore').textContent = '94%';
    packets.unshift({ time: '09:44:02', protocol: 'SSH', note: 'Approved admin bastion confirmed with MFA banner', severity: 'low' });
    renderPackets();
    drawTrafficChart();
    toast('Safe demo scan refreshed dashboard data.');
  });

  document.querySelector('#exportReport').addEventListener('click', () => {
    const report = {
      generatedAt: new Date().toISOString(),
      scope: 'Internal lab readiness review',
      packets,
      wifiChecks,
      plugins: plugins.map(([name]) => name),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: 'ethicalops-report.json' });
    link.click();
    URL.revokeObjectURL(url);
    toast('Report exported as JSON.');
  });

  document.querySelector('#assistantForm').addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('#assistantInput');
    const question = input.value.trim();
    if (!question) return;
    addMessage(question, 'user');
    input.value = '';
    const reply = safeReplies[Math.floor(Math.random() * safeReplies.length)];
    setTimeout(() => addMessage(reply), 250);
  });
}

renderPackets();
drawTrafficChart();
renderSpectrum();
renderWifi();
renderPlugins();
renderTimeline();
addMessage('Hi! I can help plan defensive, authorized security workflows and reporting.');
initInteractions();

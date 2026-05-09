const state = {
  authorized: false,
  assets: ['lab-router.local', 'training-vm', 'demo-api.local'],
  packets: [
    { time: '09:12:04', protocol: 'DNS', source: 'training-vm', destination: 'resolver.local', observation: 'Expected lab domain lookup' },
    { time: '09:13:41', protocol: 'TLS', source: 'demo-api.local', destination: 'updates.example', observation: 'Certificate expiry review needed' },
    { time: '09:15:18', protocol: 'ICMP', source: 'lab-router.local', destination: 'training-vm', observation: 'Heartbeat inside approved scope' }
  ],
  frequencies: ['315.000 MHz', '433.920 MHz', '915.000 MHz'],
  plugins: [
    { name: 'Scope Validator', description: 'Checks that notes, targets, and exports stay tied to approved assets.', enabled: true },
    { name: 'PCAP Summarizer', description: 'Creates defensive traffic summaries from imported packet captures.', enabled: true },
    { name: 'SDR Notebook', description: 'Tracks spectrum bookmarks and lab observations without transmitting.', enabled: false },
    { name: 'Report Builder', description: 'Turns findings into remediation-focused stakeholder updates.', enabled: true }
  ],
  wifiChecks: [
    { label: 'WPA3 or WPA2-AES configured', status: 'Review' },
    { label: 'Guest network isolated from lab systems', status: 'Pass' },
    { label: 'Default SSIDs and passwords removed', status: 'Pass' },
    { label: 'Firmware update cadence documented', status: 'Review' }
  ]
};

const packetSamples = [
  { protocol: 'HTTP', source: 'training-vm', destination: 'demo-api.local', observation: 'Plaintext request found; recommend TLS-only lab policy' },
  { protocol: 'NTP', source: 'lab-router.local', destination: 'time.example', observation: 'Time sync normal for reporting accuracy' },
  { protocol: 'ARP', source: 'workshop-laptop', destination: 'broadcast', observation: 'Inventory newly observed device before testing' },
  { protocol: 'TLS', source: 'demo-api.local', destination: 'cdn.example', observation: 'Approved outbound dependency' }
];

const safeReplies = [
  'Start by confirming written authorization, scope boundaries, testing windows, and emergency contacts.',
  'For packet review, focus on asset inventory, encryption posture, unexpected destinations, and clear remediation notes.',
  'For Wi-Fi, prioritize strong encryption, guest isolation, firmware updates, and removal of default credentials.',
  'For reports, explain business impact, evidence, severity rationale, and practical next steps without exploit instructions.'
];

const $ = (selector) => document.querySelector(selector);

function renderStats() {
  $('#assetCount').textContent = state.assets.length;
  $('#packetCount').textContent = state.packets.length;
  $('#pluginCount').textContent = state.plugins.filter((plugin) => plugin.enabled).length;
  $('#riskScore').textContent = state.authorized ? 'Medium' : 'Locked';
}

function renderPackets() {
  $('#packetTable').innerHTML = state.packets.map((packet) => `
    <tr>
      <td>${packet.time}</td>
      <td>${packet.protocol}</td>
      <td>${packet.source}</td>
      <td>${packet.destination}</td>
      <td>${packet.observation}</td>
    </tr>
  `).join('');
}

function renderFrequencies() {
  $('#frequencyList').innerHTML = state.frequencies
    .map((frequency) => `<li>${frequency} <span class="muted">receive-only bookmark</span></li>`)
    .join('');
}

function renderWifiChecklist() {
  $('#wifiChecklist').innerHTML = state.wifiChecks.map((check) => `
    <div class="check-item">
      <span>${check.label}</span>
      <span class="badge ${check.status === 'Review' ? 'warn' : ''}">${check.status}</span>
    </div>
  `).join('');
}

function renderPlugins() {
  $('#pluginList').innerHTML = state.plugins.map((plugin, index) => `
    <div class="plugin-card">
      <div>
        <strong>${plugin.name}</strong>
        <p class="muted">${plugin.description}</p>
      </div>
      <button class="mini" data-plugin-index="${index}">${plugin.enabled ? 'Disable' : 'Enable'}</button>
    </div>
  `).join('');
}

function addChatMessage(text, sender = 'assistant') {
  const message = document.createElement('div');
  message.className = `message ${sender}`;
  message.textContent = text;
  $('#chatLog').appendChild(message);
  $('#chatLog').scrollTop = $('#chatLog').scrollHeight;
}

function setAuthorization(authorized) {
  state.authorized = authorized;
  $('#scopeStatus').textContent = authorized
    ? 'Authorized scope confirmed. Toolkit actions remain defensive and documentation-focused.'
    : 'Awaiting authorized scope confirmation.';
  $('.status-dot').classList.toggle('approved', authorized);
  renderStats();
}

function exportReport() {
  const report = {
    generatedAt: new Date().toISOString(),
    authorizationConfirmed: state.authorized,
    assets: state.assets,
    packetsReviewed: state.packets,
    wifiChecks: state.wifiChecks,
    enabledPlugins: state.plugins.filter((plugin) => plugin.enabled).map((plugin) => plugin.name),
    note: 'Defensive lab report. Do not use outside owned or explicitly authorized environments.'
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'ethical-ops-report.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

function initialize() {
  renderStats();
  renderPackets();
  renderFrequencies();
  renderWifiChecklist();
  renderPlugins();
  addChatMessage('Hi! I can help with authorized-scope planning, defensive checklists, and remediation-focused reporting.');

  $('#scopeToggle').addEventListener('change', (event) => setAuthorization(event.target.checked));
  $('#runOverview').addEventListener('click', () => {
    setAuthorization($('#scopeToggle').checked);
    addChatMessage('Overview complete: assets inventoried, sample packets triaged, Wi-Fi posture reviewed, and enabled plugins counted.');
  });
  $('#exportReport').addEventListener('click', exportReport);
  $('#addPacket').addEventListener('click', () => {
    const sample = packetSamples[state.packets.length % packetSamples.length];
    state.packets.push({
      time: new Date().toLocaleTimeString([], { hour12: false }),
      ...sample
    });
    renderPackets();
    renderStats();
  });
  $('#saveFrequency').addEventListener('click', () => {
    const value = $('#frequencyInput').value.trim();
    if (value && !state.frequencies.includes(value)) {
      state.frequencies.push(value);
      renderFrequencies();
    }
  });
  $('#pluginList').addEventListener('click', (event) => {
    const button = event.target.closest('[data-plugin-index]');
    if (!button) return;
    const plugin = state.plugins[Number(button.dataset.pluginIndex)];
    plugin.enabled = !plugin.enabled;
    renderPlugins();
    renderStats();
  });
  $('#chatForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = $('#chatInput');
    const prompt = input.value.trim();
    if (!prompt) return;
    addChatMessage(prompt, 'user');
    const reply = safeReplies[prompt.length % safeReplies.length];
    addChatMessage(reply);
    input.value = '';
  });
  $('#syncNow').addEventListener('click', () => {
    const snapshot = { ...state, syncedAt: new Date().toISOString() };
    localStorage.setItem('ethicalOpsSnapshot', JSON.stringify(snapshot));
    $('#syncStatus').textContent = `Local sync point saved at ${new Date(snapshot.syncedAt).toLocaleString()}.`;
  });
}

document.addEventListener('DOMContentLoaded', initialize);

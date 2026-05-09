const packetEvents = [
  ["DNS baseline captured", "Compared lab resolver activity against approved domains."],
  ["TLS inventory refreshed", "Flagged expiring certificates for owned services."],
  ["Anomaly note created", "Unusual outbound volume queued for analyst review."],
];

const plugins = [
  ["Asset Mapper", "Inventory"],
  ["PCAP Lens", "Analysis"],
  ["SDR Watch", "Signals"],
  ["Wi‑Fi Posture", "Audit"],
  ["Report Builder", "Docs"],
  ["Cloud Vault", "Sync"],
  ["Policy Guard", "Safety"],
  ["Lab Runner", "Training"],
];

const chatSeed = [
  ["assistant", "Hi! I can help summarize findings, write defensive remediation steps, and create safe lab checklists for systems you own or are authorized to test."],
];

function renderPacketEvents() {
  const list = document.querySelector("#packetEvents");
  const template = document.querySelector("#eventTemplate");
  packetEvents.forEach(([title, detail]) => {
    const node = template.content.cloneNode(true);
    node.querySelector("strong").textContent = title;
    node.querySelector("small").textContent = detail;
    list.appendChild(node);
  });
}

function renderPlugins() {
  const list = document.querySelector("#pluginList");
  plugins.forEach(([name, type]) => {
    const item = document.createElement("div");
    const title = document.createElement("strong");
    const detail = document.createElement("small");
    item.className = "plugin";
    title.textContent = name;
    detail.textContent = `${type} plugin · verified`;
    item.append(title, detail);
    list.appendChild(item);
  });
}

function addMessage(role, text) {
  const chat = document.querySelector("#chatWindow");
  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.textContent = text;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function setupAssistant() {
  chatSeed.forEach(([role, text]) => addMessage(role, text));
  document.querySelector("#assistantForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#assistantInput");
    const question = input.value.trim();
    if (!question) return;
    addMessage("user", question);
    input.value = "";
    addMessage(
      "assistant",
      "Safe plan: confirm written authorization, define scope, collect read-only evidence, prioritize risk, document remediation, and re-test only approved assets."
    );
  });
}

function setupActions() {
  document.querySelector("#runDemo").addEventListener("click", () => {
    document.querySelector("#findingCount").textContent = "9";
    document.querySelector("#syncState").textContent = "Queued";
    addMessage("assistant", "Safe demo scan complete: two new hygiene findings were added to the review queue. No live exploitation was performed.");
  });

  document.querySelector("#exportReport").addEventListener("click", () => {
    const report = {
      generatedAt: new Date().toISOString(),
      scope: "Authorized lab and owned assets only",
      findingsToReview: document.querySelector("#findingCount").textContent,
      modules: ["packets", "sdr", "wifi", "plugins", "assistant", "cloud"],
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ethicalops-report.json";
    link.click();
    URL.revokeObjectURL(url);
  });
}

renderPacketEvents();
renderPlugins();
setupAssistant();
setupActions();

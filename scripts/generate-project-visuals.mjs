import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "assets/project-visuals");
mkdirSync(outDir, { recursive: true });

const font = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
const mono = "JetBrains Mono, SFMono-Regular, Consolas, monospace";

function escape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function label(x, y, text, size = 24, color = "#dbeafe", weight = 700) {
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${color}">${escape(text)}</text>`;
}

function monoText(x, y, text, size = 22, color = "#d1fae5") {
  return `<text x="${x}" y="${y}" font-family="${mono}" font-size="${size}" fill="${color}">${escape(text)}</text>`;
}

function panel(x, y, w, h, fill = "#111827", stroke = "#334155", opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="${stroke}" opacity="${opacity}"/>`;
}

function base(slug, accent, body) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#07111f"/>
      <stop offset="0.56" stop-color="#101827"/>
      <stop offset="1" stop-color="#172033"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="22"/>
    </filter>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <circle cx="1070" cy="110" r="260" fill="${accent}" opacity="0.17" filter="url(#soft)"/>
  <circle cx="160" cy="650" r="220" fill="${accent}" opacity="0.10" filter="url(#soft)"/>
  <path d="M0 84H1280M0 180H1280M0 276H1280M0 372H1280M0 468H1280M0 564H1280M160 0V720M320 0V720M480 0V720M640 0V720M800 0V720M960 0V720M1120 0V720" stroke="#253244" stroke-width="1" opacity="0.35"/>
  ${body}
</svg>`;
  writeFileSync(join(outDir, `${slug}.svg`), `${svg}\n`);
}

base("kuzushi", "#0f766e", `
  ${label(72, 82, "Kuzushi scan trace", 25, "#a7f3d0")}
  ${panel(72, 118, 674, 474, "#0b1220", "#1f766e")}
  ${label(104, 168, "DAG activity", 20, "#e5f9f4")}
  ${monoText(104, 220, "[context-lite:index] repository map complete", 21, "#b9f6de")}
  ${monoText(104, 268, "[agentic-sast:scan] source -> sink path kept", 21, "#fef3c7")}
  ${monoText(104, 316, "[triage:run] exploitability: high confidence", 21, "#fca5a5")}
  ${monoText(104, 364, "[verify:finding] PoC harness written", 21, "#bae6fd")}
  ${monoText(104, 412, "[report:sarif] evidence bundle emitted", 21, "#d9f99d")}
  <rect x="104" y="470" width="568" height="18" rx="9" fill="#1f2937"/>
  <rect x="104" y="470" width="452" height="18" rx="9" fill="#0f766e"/>
  ${label(104, 530, "proof state: traced -> verified -> reportable", 24, "#f8fafc")}
  ${panel(784, 118, 420, 474, "#f8fafc", "#d7dee8")}
  ${label(822, 170, "Findings queue", 22, "#111827")}
  <rect x="822" y="210" width="330" height="58" rx="12" fill="#fff7ed" stroke="#fed7aa"/>
  ${label(846, 246, "SQL injection", 19, "#7c2d12")}
  <rect x="822" y="292" width="330" height="58" rx="12" fill="#fef2f2" stroke="#fecaca"/>
  ${label(846, 328, "Auth bypass", 19, "#7f1d1d")}
  <rect x="822" y="374" width="330" height="58" rx="12" fill="#ecfeff" stroke="#a5f3fc"/>
  ${label(846, 410, "Path traversal", 19, "#164e63")}
  <rect x="822" y="474" width="250" height="48" rx="24" fill="#0f766e"/>
  ${label(852, 505, "SARIF ready", 19, "#ffffff")}
`);

base("mcp-pentest", "#9f1239", `
  ${label(72, 82, "Authorized pentest MCP workflow", 25, "#fecdd3")}
  ${panel(72, 126, 360, 430, "#0b1220", "#9f1239")}
  ${label(108, 176, "Scope", 22, "#fff1f2")}
  ${monoText(108, 232, "target: 10.10.14.0/24", 20, "#fecdd3")}
  ${monoText(108, 280, "policy: no-exploit", 20, "#fecdd3")}
  ${monoText(108, 328, "tools: nmap,gobuster", 20, "#fecdd3")}
  ${monoText(108, 376, "output: report.md", 20, "#fecdd3")}
  <circle cx="640" cy="226" r="76" fill="#9f1239"/>
  ${label(590, 235, "MCP", 35, "#fff")}
  <circle cx="890" cy="170" r="48" fill="#1e293b" stroke="#fda4af"/>
  <circle cx="900" cy="360" r="48" fill="#1e293b" stroke="#fda4af"/>
  <circle cx="520" cy="438" r="48" fill="#1e293b" stroke="#fda4af"/>
  <path d="M432 260L570 226M714 218L842 178M700 268L860 334M610 296L540 396" stroke="#fda4af" stroke-width="8" stroke-linecap="round"/>
  ${label(842, 110, "Nmap", 21, "#fff1f2")}
  ${label(834, 300, "Gobuster", 21, "#fff1f2")}
  ${label(454, 532, "Report", 21, "#fff1f2")}
  ${panel(760, 470, 372, 92, "#fff1f2", "#fecdd3")}
  ${label(792, 514, "AI triage", 22, "#881337")}
  ${label(792, 544, "evidence grouped by host", 18, "#9f1239", 600)}
`);

base("signaltrace", "#1d4ed8", `
  ${label(72, 82, "SignalTrace live OSINT view", 25, "#bfdbfe")}
  ${panel(72, 122, 760, 500, "#0d1b2f", "#1d4ed8")}
  <path d="M112 190L226 154L354 218L504 156L710 214L792 172" stroke="#3b82f6" stroke-width="3" fill="none" opacity="0.7"/>
  <path d="M130 420L260 360L420 392L590 304L770 382" stroke="#38bdf8" stroke-width="3" fill="none" opacity="0.5"/>
  <circle cx="256" cy="258" r="12" fill="#f97316"/><circle cx="256" cy="258" r="34" fill="#f97316" opacity="0.16"/>
  <circle cx="604" cy="318" r="12" fill="#ef4444"/><circle cx="604" cy="318" r="44" fill="#ef4444" opacity="0.16"/>
  <circle cx="712" cy="468" r="12" fill="#facc15"/><circle cx="712" cy="468" r="32" fill="#facc15" opacity="0.16"/>
  <circle cx="398" cy="474" r="12" fill="#22c55e"/><circle cx="398" cy="474" r="32" fill="#22c55e" opacity="0.16"/>
  <rect x="112" y="548" width="640" height="18" rx="9" fill="#13233b"/>
  <rect x="112" y="548" width="470" height="18" rx="9" fill="#1d4ed8"/>
  ${panel(870, 122, 338, 500, "#f8fafc", "#cbd5e1")}
  ${label(910, 178, "Event feed", 22, "#111827")}
  ${label(910, 238, "Maritime anomaly", 19, "#1e3a8a")}
  ${label(910, 292, "Aviation diversion", 19, "#7f1d1d")}
  ${label(910, 346, "Infrastructure alert", 19, "#78350f")}
  ${label(910, 400, "Humanitarian update", 19, "#14532d")}
  <rect x="910" y="470" width="220" height="50" rx="25" fill="#1d4ed8"/>
  ${label(942, 503, "map filtered", 18, "#fff")}
`);

base("volatilityai", "#6d28d9", `
  ${label(72, 82, "VolatilityAI memory triage", 25, "#ddd6fe")}
  ${panel(72, 122, 560, 500, "#0b1220", "#6d28d9")}
  ${label(108, 178, "Process evidence", 22, "#f5f3ff")}
  ${monoText(108, 236, "PID  432  powershell.exe   suspicious", 19, "#ddd6fe")}
  ${monoText(108, 286, "PID  884  rundll32.exe     injected", 19, "#fecaca")}
  ${monoText(108, 336, "PID 1308  svchost.exe      hollowed", 19, "#fed7aa")}
  ${monoText(108, 386, "PID 2040  explorer.exe     clean", 19, "#bbf7d0")}
  <rect x="108" y="462" width="412" height="62" rx="14" fill="#221446" stroke="#7c3aed"/>
  ${label(130, 501, "MITRE: T1055 process injection", 21, "#f5f3ff")}
  ${panel(680, 122, 528, 500, "#f8fafc", "#d8b4fe")}
  ${label(720, 178, "Timeline", 22, "#111827")}
  <path d="M760 242V520" stroke="#6d28d9" stroke-width="6" stroke-linecap="round"/>
  <circle cx="760" cy="260" r="14" fill="#6d28d9"/>
  <circle cx="760" cy="346" r="14" fill="#6d28d9"/>
  <circle cx="760" cy="432" r="14" fill="#6d28d9"/>
  ${label(800, 268, "credential dump artifact", 19, "#312e81")}
  ${label(800, 354, "network beacon recovered", 19, "#312e81")}
  ${label(800, 440, "report diff generated", 19, "#312e81")}
`);

base("zkdpop-go", "#0891b2", `
  ${label(72, 82, "zkDPoP auth flow", 25, "#cffafe")}
  ${panel(72, 132, 1136, 450, "#f8fafc", "#bae6fd")}
  <rect x="126" y="188" width="190" height="70" rx="16" fill="#ecfeff" stroke="#67e8f9"/>
  <rect x="546" y="188" width="190" height="70" rx="16" fill="#ecfeff" stroke="#67e8f9"/>
  <rect x="966" y="188" width="190" height="70" rx="16" fill="#ecfeff" stroke="#67e8f9"/>
  ${label(174, 232, "Client", 24, "#164e63")}
  ${label(594, 232, "Auth", 24, "#164e63")}
  ${label(1018, 232, "API", 24, "#164e63")}
  <path d="M316 332H546" stroke="#0891b2" stroke-width="7" stroke-linecap="round"/>
  <path d="M736 332H966" stroke="#0891b2" stroke-width="7" stroke-linecap="round"/>
  <path d="M966 430H736" stroke="#0f766e" stroke-width="7" stroke-linecap="round"/>
  <path d="M546 430H316" stroke="#0f766e" stroke-width="7" stroke-linecap="round"/>
  ${label(360, 315, "Schnorr proof", 20, "#0e7490")}
  ${label(784, 315, "DPoP-bound JWT", 20, "#0e7490")}
  ${label(772, 416, "cnf.jkt verified", 20, "#0f766e")}
  ${label(350, 416, "short-lived token", 20, "#0f766e")}
  <rect x="446" y="512" width="388" height="44" rx="22" fill="#0891b2"/>
  ${label(492, 541, "sender-constrained access", 20, "#ffffff")}
`);

base("detonate", "#b91c1c", `
  ${label(72, 82, "detonate sandbox telemetry", 25, "#fecaca")}
  ${panel(72, 126, 360, 430, "#0b1220", "#991b1b")}
  ${label(108, 176, "Execution", 22, "#fff1f2")}
  ${monoText(108, 232, "vm: qemu-isolated", 20, "#fecaca")}
  ${monoText(108, 280, "network: fakenet", 20, "#fecaca")}
  ${monoText(108, 328, "sample: 7f3a...e21", 20, "#fecaca")}
  ${monoText(108, 376, "status: contained", 20, "#bbf7d0")}
  ${panel(480, 126, 334, 190, "#f8fafc", "#fecaca")}
  ${label(514, 174, "Process tree", 22, "#111827")}
  ${monoText(514, 226, "dropper.exe", 20, "#991b1b")}
  ${monoText(552, 266, "`- powershell.exe", 20, "#991b1b")}
  ${panel(480, 366, 334, 190, "#f8fafc", "#fecaca")}
  ${label(514, 414, "Detections", 22, "#111827")}
  ${label(514, 466, "YARA: loader", 20, "#7f1d1d")}
  ${label(514, 506, "Suricata: C2", 20, "#7f1d1d")}
  ${panel(864, 126, 344, 430, "#111827", "#334155")}
  ${label(900, 176, "Network", 22, "#fff1f2")}
  <path d="M914 462C954 360 994 400 1034 306C1074 212 1114 260 1170 192" stroke="#ef4444" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="1034" cy="306" r="12" fill="#facc15"/>
  <circle cx="1170" cy="192" r="12" fill="#facc15"/>
  ${monoText(900, 518, "report.html + stix.json", 20, "#fecaca")}
`);

base("oxidized-joern", "#ea580c", `
  ${label(72, 82, "oxidized-joern CPG pipeline", 25, "#fed7aa")}
  ${panel(72, 126, 356, 430, "#0b1220", "#ea580c")}
  ${label(108, 176, "Frontend", 22, "#fff7ed")}
  ${monoText(108, 232, "parser: rust module", 20, "#fed7aa")}
  ${monoText(108, 280, "ir: ast -> cpg", 20, "#fed7aa")}
  ${monoText(108, 328, "edges: calls,dataflow", 20, "#fed7aa")}
  ${monoText(108, 376, "export: graph layer", 20, "#fed7aa")}
  <circle cx="626" cy="214" r="48" fill="#ea580c"/>
  <circle cx="816" cy="304" r="48" fill="#ea580c"/>
  <circle cx="606" cy="444" r="48" fill="#ea580c"/>
  <circle cx="988" cy="444" r="48" fill="#ea580c"/>
  <path d="M670 238L772 282M776 326L650 422M858 330L946 420M642 444H940" stroke="#fdba74" stroke-width="8" stroke-linecap="round"/>
  ${label(580, 220, "AST", 19, "#fff")}
  ${label(778, 310, "CPG", 19, "#fff")}
  ${label(558, 450, "flows", 19, "#fff")}
  ${label(950, 450, "query", 19, "#fff")}
  ${panel(738, 520, 342, 58, "#fff7ed", "#fed7aa")}
  ${label(770, 556, "security analysis substrate", 20, "#9a3412")}
`);

base("klee-ng", "#7c3aed", `
  ${label(72, 82, "klee-ng symbolic execution", 25, "#ddd6fe")}
  ${panel(72, 126, 1136, 430, "#0b1220", "#7c3aed")}
  <path d="M178 234H342M342 234L508 174M342 234L508 296M508 174L714 174M508 296L714 296M714 174L914 226M714 296L914 226M914 226L1068 226" stroke="#c4b5fd" stroke-width="7" stroke-linecap="round" fill="none"/>
  <circle cx="178" cy="234" r="34" fill="#7c3aed"/>
  <circle cx="342" cy="234" r="34" fill="#7c3aed"/>
  <circle cx="508" cy="174" r="34" fill="#7c3aed"/>
  <circle cx="508" cy="296" r="34" fill="#7c3aed"/>
  <circle cx="714" cy="174" r="34" fill="#7c3aed"/>
  <circle cx="714" cy="296" r="34" fill="#7c3aed"/>
  <circle cx="914" cy="226" r="34" fill="#7c3aed"/>
  <circle cx="1068" cy="226" r="34" fill="#22c55e"/>
  ${label(134, 336, "input", 19, "#ddd6fe")}
  ${label(456, 386, "path constraints", 19, "#ddd6fe")}
  ${label(858, 336, "solver", 19, "#ddd6fe")}
  ${label(1016, 336, "test", 19, "#bbf7d0")}
  ${panel(156, 430, 860, 70, "#f5f3ff", "#ddd6fe")}
  ${monoText(190, 475, "assert(x < size)  ->  generate counterexample input", 22, "#4c1d95")}
`);

base("ligolo-ng-relay", "#2563eb", `
  ${label(72, 82, "ligolo-ng-relay network path", 25, "#bfdbfe")}
  ${panel(72, 134, 300, 370, "#0b1220", "#2563eb")}
  ${label(126, 198, "Operator", 28, "#eff6ff")}
  ${monoText(118, 268, "tun0 10.42.0.1", 20, "#bfdbfe")}
  ${panel(490, 134, 300, 370, "#eff6ff", "#bfdbfe")}
  ${label(558, 198, "Relay", 28, "#1e3a8a")}
  ${monoText(540, 268, "session: scoped", 20, "#1d4ed8")}
  ${panel(908, 134, 300, 370, "#0b1220", "#2563eb")}
  ${label(966, 198, "Target net", 28, "#eff6ff")}
  ${monoText(956, 268, "10.10.14.0/24", 20, "#bfdbfe")}
  <path d="M372 318H490" stroke="#60a5fa" stroke-width="10" stroke-linecap="round"/>
  <path d="M790 318H908" stroke="#60a5fa" stroke-width="10" stroke-linecap="round"/>
  <path d="M428 360C542 444 662 444 850 360" stroke="#93c5fd" stroke-width="6" stroke-dasharray="16 14" fill="none"/>
  <rect x="450" y="564" width="380" height="52" rx="26" fill="#2563eb"/>
  ${label(496, 598, "authorized pivoting only", 20, "#ffffff")}
`);

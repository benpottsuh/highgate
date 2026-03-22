/**
 * Canva OAuth2 + Asset Helper
 * 
 * Usage:
 *   node scripts/canva-auth.js          → starts OAuth flow
 *   node scripts/canva-auth.js list     → lists your Canva designs
 *   node scripts/canva-auth.js assets   → lists your Canva assets
 *   node scripts/canva-auth.js export <designId> [format] → exports a design
 *   node scripts/canva-auth.js exchange <code> → manually exchange an auth code
 */

import http from "http";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TOKEN_FILE = path.join(ROOT, "canva-tokens.json");
const STATE_FILE = path.join(ROOT, ".canva-auth-state.json");

// Load .env
const envPath = path.join(ROOT, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

const CLIENT_ID = process.env.CANVA_CLIENT_ID;
const CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET;
const REDIRECT_URI = process.env.CANVA_REDIRECT_URI || "http://127.0.0.1:3000/callback";
const API_BASE = "https://api.canva.com/rest/v1";

function base64url(buf) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function generateCodeVerifier() { return base64url(crypto.randomBytes(32)); }
function generateCodeChallenge(v) { return base64url(crypto.createHash("sha256").update(v).digest()); }

function saveTokens(t) { fs.writeFileSync(TOKEN_FILE, JSON.stringify(t, null, 2)); }
function loadTokens() { return fs.existsSync(TOKEN_FILE) ? JSON.parse(fs.readFileSync(TOKEN_FILE, "utf-8")) : null; }

async function refreshAccessToken() {
  const tokens = loadTokens();
  if (!tokens?.refresh_token) throw new Error("No refresh token. Run auth flow first.");
  const res = await fetch(`${API_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token", refresh_token: tokens.refresh_token,
      client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
    }).toString(),
  });
  if (!res.ok) throw new Error(`Refresh failed: ${res.status} ${await res.text()}`);
  const t = await res.json();
  saveTokens({ ...tokens, ...t, updated_at: new Date().toISOString() });
  return t.access_token;
}

async function getAccessToken() {
  const tokens = loadTokens();
  if (!tokens) throw new Error("No tokens. Run: node scripts/canva-auth.js");
  const expiresAt = new Date(tokens.updated_at).getTime() + (tokens.expires_in - 300) * 1000;
  if (Date.now() > expiresAt) return refreshAccessToken();
  return tokens.access_token;
}

async function apiRequest(endpoint, options = {}) {
  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...options.headers };
  let res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    headers.Authorization = `Bearer ${newToken}`;
    res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  }
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

// ─── OAuth Flow ───
async function startAuthFlow() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  fs.writeFileSync(STATE_FILE, JSON.stringify({ codeVerifier, created: new Date().toISOString() }));

  // Exact scopes from Canva's generated URL
  const scopes = [
    "folder:read", "asset:read", "folder:write", "asset:write",
    "comment:write", "folder:permission:read", "app:read",
    "brandtemplate:content:read", "design:content:read",
    "brandtemplate:content:write", "design:meta:read",
    "profile:read", "comment:read", "app:write",
    "design:permission:read", "brandtemplate:meta:read",
    "folder:permission:write", "design:permission:write",
    "design:content:write",
  ];

  const authUrl = new URL("https://www.canva.com/api/oauth/authorize");
  authUrl.searchParams.set("code_challenge_method", "s256");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", scopes.join(" "));
  authUrl.searchParams.set("code_challenge", codeChallenge);

  console.log("\n🎨 Canva OAuth Flow\n");
  console.log("Open this URL in your browser:\n");
  console.log(authUrl.toString());
  console.log("\n─────────────────────────────────────");
  console.log("Waiting for callback on port 3000...\n");

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1:3000");
    if (url.pathname !== "/callback") { res.writeHead(404); res.end(); return; }

    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error || !code) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end(`<h1>Error: ${error || "no code"}</h1>`);
      server.close(); return;
    }

    try {
      const tokenRes = await fetch(`${API_BASE}/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code", code,
          redirect_uri: REDIRECT_URI, client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET, code_verifier: codeVerifier,
        }).toString(),
      });

      if (!tokenRes.ok) throw new Error(`Token exchange: ${tokenRes.status} ${await tokenRes.text()}`);

      const tokens = await tokenRes.json();
      saveTokens({ ...tokens, updated_at: new Date().toISOString() });
      if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end('<html><body style="font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;background:#272b31;color:#fff"><div style="text-align:center"><h1>✅ Canva Connected!</h1><p>Close this tab.</p></div></body></html>');
      console.log("\n✅ Canva connected! Tokens saved.\n");
      server.close();
      process.exit(0);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end(`<h1>Error</h1><pre>${err.message}</pre>`);
      console.error("Error:", err.message);
      server.close(); process.exit(1);
    }
  });

  server.on("error", (err) => {
    console.error(err.code === "EADDRINUSE" ? "❌ Port 3000 in use" : err);
    process.exit(1);
  });

  server.listen(3000, "0.0.0.0", () => {
    console.log("⏳ Listening on 0.0.0.0:3000...\n");
  });
}

// ─── Manual code exchange ───
async function exchangeCode(code) {
  if (!fs.existsSync(STATE_FILE)) { console.error("❌ No state. Run auth first."); process.exit(1); }
  const { codeVerifier } = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  console.log("🔄 Exchanging code...");
  const res = await fetch(`${API_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code", code,
      redirect_uri: REDIRECT_URI, client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET, code_verifier: codeVerifier,
    }).toString(),
  });
  if (!res.ok) { console.error(`❌ Failed: ${res.status}`, await res.text()); process.exit(1); }
  const tokens = await res.json();
  saveTokens({ ...tokens, updated_at: new Date().toISOString() });
  if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE);
  console.log("✅ Connected! Tokens saved.\n");
}

// ─── Commands ───
async function listDesigns() {
  console.log("📋 Designs:\n");
  const data = await apiRequest("/designs");
  if (!data.items?.length) { console.log("None found."); return; }
  for (const d of data.items) console.log(`  ${d.id}  ${d.title || "(untitled)"}`);
  console.log(`\n${data.items.length} total.`);
}

async function listAssets() {
  console.log("📁 Assets:\n");
  const data = await apiRequest("/assets");
  if (!data.items?.length) { console.log("None found."); return; }
  for (const a of data.items) console.log(`  ${a.id}  ${a.name || "(unnamed)"}  [${a.type}]`);
  console.log(`\n${data.items.length} total.`);
}

async function exportDesign(designId, format = "png") {
  console.log(`📦 Exporting ${designId} as ${format}...`);
  const data = await apiRequest("/exports", {
    method: "POST", body: JSON.stringify({ design_id: designId, format: format.toUpperCase() }),
  });
  const jobId = data.job?.id || data.id;
  let result;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    result = await apiRequest(`/exports/${jobId}`);
    if (result.status === "success" || result.urls?.length) break;
    if (result.status === "failed") throw new Error("Failed: " + JSON.stringify(result));
    process.stdout.write(".");
  }
  const urls = result.urls || result.export?.urls || [];
  for (let i = 0; i < urls.length; i++) {
    const fname = `canva-${designId}${urls.length > 1 ? `-${i}` : ""}.${format}`;
    const dest = path.join(ROOT, "src", "assets", fname);
    const buf = Buffer.from(await (await fetch(urls[i])).arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`   ✅ src/assets/${fname}`);
  }
}

const [,, cmd, ...args] = process.argv;
switch (cmd) {
  case "list": listDesigns().catch(console.error); break;
  case "assets": listAssets().catch(console.error); break;
  case "export": args[0] ? exportDesign(args[0], args[1] || "png").catch(console.error) : console.error("Need designId"); break;
  case "exchange": args[0] ? exchangeCode(args[0]).catch(console.error) : console.error("Need code"); break;
  default: startAuthFlow().catch(console.error);
}

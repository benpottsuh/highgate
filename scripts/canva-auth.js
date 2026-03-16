/**
 * Canva OAuth2 + Asset Helper
 * 
 * Usage:
 *   node scripts/canva-auth.js          → starts OAuth flow (prints URL + starts server)
 *   node scripts/canva-auth.js list     → lists your Canva designs
 *   node scripts/canva-auth.js assets   → lists your Canva assets
 *   node scripts/canva-auth.js export <designId> [format] → exports a design (png|jpg|svg|pdf)
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

// Load .env manually
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

// ─── PKCE helpers ───
function base64url(buf) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function generateCodeVerifier() {
  return base64url(crypto.randomBytes(32));
}
function generateCodeChallenge(verifier) {
  return base64url(crypto.createHash("sha256").update(verifier).digest());
}

// ─── Token management ───
function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}
function loadTokens() {
  if (!fs.existsSync(TOKEN_FILE)) return null;
  return JSON.parse(fs.readFileSync(TOKEN_FILE, "utf-8"));
}

async function refreshAccessToken() {
  const tokens = loadTokens();
  if (!tokens?.refresh_token) throw new Error("No refresh token. Run auth flow first.");
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: tokens.refresh_token,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  const res = await fetch(`${API_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
  const newTokens = await res.json();
  saveTokens({ ...tokens, ...newTokens, updated_at: new Date().toISOString() });
  return newTokens.access_token;
}

async function getAccessToken() {
  const tokens = loadTokens();
  if (!tokens) throw new Error("No tokens found. Run: node scripts/canva-auth.js");
  const updatedAt = new Date(tokens.updated_at).getTime();
  const expiresAt = updatedAt + (tokens.expires_in - 300) * 1000;
  if (Date.now() > expiresAt) {
    console.log("Token expired, refreshing...");
    return refreshAccessToken();
  }
  return tokens.access_token;
}

async function apiRequest(endpoint, options = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    const retryRes = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${newToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!retryRes.ok) throw new Error(`API error: ${retryRes.status} ${await retryRes.text()}`);
    return retryRes.json();
  }
  if (!res.ok) throw new Error(`API error: ${res.status} ${await res.text()}`);
  return res.json();
}

// ─── OAuth Flow ───
async function startAuthFlow() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Persist state so we can recover if the callback fails
  fs.writeFileSync(STATE_FILE, JSON.stringify({ codeVerifier, codeChallenge, created: new Date().toISOString() }));

  const scopes = [
    "asset:read", "asset:write",
    "design:content:read", "design:content:write",
    "design:meta:read",
    "design:permission:read", "design:permission:write",
    "folder:read", "folder:write",
    "folder:permission:read", "folder:permission:write",
    "brandtemplate:content:read", "brandtemplate:meta:read",
    "comment:read", "comment:write",
    "profile:read",
    "app:read",
  ];

  const authUrl = new URL("https://www.canva.com/api/oauth/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", scopes.join(" "));
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "s256");

  console.log("\n🎨 Canva OAuth Flow\n");
  console.log("Open this URL in your browser:\n");
  console.log(authUrl.toString());
  console.log("\nAfter authorizing, you'll be redirected to 127.0.0.1:3000/callback");
  console.log("The server below is waiting to catch that callback...\n");

  // Start callback server
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:3000`);

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<h1>Error: ${error}</h1>`);
        server.close();
        return;
      }

      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h1>No code received</h1>");
        server.close();
        return;
      }

      try {
        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code_verifier: codeVerifier,
        });

        const tokenRes = await fetch(`${API_BASE}/oauth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });

        if (!tokenRes.ok) {
          const err = await tokenRes.text();
          throw new Error(`Token exchange failed: ${tokenRes.status} ${err}`);
        }

        const tokens = await tokenRes.json();
        saveTokens({ ...tokens, updated_at: new Date().toISOString() });

        // Clean up state file
        if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`<html><body style="font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;background:#272b31;color:#fff;"><div style="text-align:center"><h1>✅ Canva Connected!</h1><p>You can close this tab.</p></div></body></html>`);

        console.log("\n✅ Successfully authenticated with Canva!");
        console.log("   Tokens saved to canva-tokens.json\n");
        server.close();
        process.exit(0);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(`<h1>Error</h1><pre>${err.message}</pre>`);
        console.error("Error:", err.message);
        server.close();
        process.exit(1);
      }
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error("❌ Port 3000 is already in use. Kill the other process and try again.");
    } else {
      console.error("Server error:", err);
    }
    process.exit(1);
  });

  server.listen(3000, "0.0.0.0", () => {
    console.log("⏳ Server listening on http://0.0.0.0:3000 (waiting for callback)...\n");
  });
}

// ─── Exchange code manually (if callback server failed) ───
async function exchangeCode(code) {
  if (!fs.existsSync(STATE_FILE)) {
    console.error("❌ No auth state found. Run the auth flow first.");
    process.exit(1);
  }
  const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));

  console.log("🔄 Exchanging authorization code for tokens...");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code_verifier: state.codeVerifier,
  });

  const res = await fetch(`${API_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ Token exchange failed: ${res.status}`, err);
    process.exit(1);
  }

  const tokens = await res.json();
  saveTokens({ ...tokens, updated_at: new Date().toISOString() });
  if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE);

  console.log("✅ Successfully authenticated with Canva!");
  console.log("   Tokens saved to canva-tokens.json\n");
}

// ─── Commands ───
async function listDesigns() {
  console.log("📋 Fetching your Canva designs...\n");
  const data = await apiRequest("/designs");
  if (!data.items?.length) {
    console.log("No designs found.");
    return;
  }
  for (const design of data.items) {
    console.log(`  ${design.id}  ${design.title || "(untitled)"}  [${design.created_at}]`);
    if (design.thumbnail?.url) console.log(`    🖼  ${design.thumbnail.url}`);
  }
  console.log(`\n${data.items.length} designs total.`);
}

async function exportDesign(designId, format = "png") {
  console.log(`📦 Exporting design ${designId} as ${format}...`);
  const exportData = await apiRequest(`/exports`, {
    method: "POST",
    body: JSON.stringify({ design_id: designId, format: format.toUpperCase() }),
  });
  const jobId = exportData.job?.id || exportData.id;
  console.log(`   Export job: ${jobId}`);

  let result;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    result = await apiRequest(`/exports/${jobId}`);
    if (result.status === "success" || result.urls?.length) break;
    if (result.status === "failed") throw new Error("Export failed: " + JSON.stringify(result));
    process.stdout.write(".");
  }
  console.log();

  const urls = result.urls || result.export?.urls || [];
  const assetsDir = path.join(ROOT, "src", "assets");
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = `canva-export-${designId}${urls.length > 1 ? `-${i}` : ""}.${format}`;
    const dest = path.join(assetsDir, filename);
    const dlRes = await fetch(url);
    const buffer = Buffer.from(await dlRes.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log(`   ✅ Saved: src/assets/${filename}`);
  }
}

async function listAssets() {
  console.log("📁 Fetching your Canva assets...\n");
  const data = await apiRequest("/assets");
  if (!data.items?.length) {
    console.log("No assets found.");
    return;
  }
  for (const asset of data.items) {
    console.log(`  ${asset.id}  ${asset.name || "(unnamed)"}  [${asset.type}]`);
    if (asset.thumbnail?.url) console.log(`    🖼  ${asset.thumbnail.url}`);
  }
  console.log(`\n${data.items.length} assets total.`);
}

// ─── Main ───
const [, , command, ...args] = process.argv;

switch (command) {
  case "list":
    listDesigns().catch(console.error);
    break;
  case "assets":
    listAssets().catch(console.error);
    break;
  case "export":
    if (!args[0]) {
      console.error("Usage: node scripts/canva-auth.js export <designId> [format]");
      process.exit(1);
    }
    exportDesign(args[0], args[1] || "png").catch(console.error);
    break;
  case "exchange":
    if (!args[0]) {
      console.error("Usage: node scripts/canva-auth.js exchange <code>");
      process.exit(1);
    }
    exchangeCode(args[0]).catch(console.error);
    break;
  default:
    startAuthFlow().catch(console.error);
}

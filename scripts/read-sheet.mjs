/**
 * Google Sheets Reader — zero external dependencies
 * Uses Node built-in crypto + https to authenticate via service account JWT
 * 
 * Usage:
 *   node scripts/read-sheet.mjs <SPREADSHEET_ID>
 *   node scripts/read-sheet.mjs              # uses default Highgate sheet
 */

import { readFileSync } from 'fs';
import { createSign } from 'crypto';
import https from 'https';

// ── Config ──────────────────────────────────────────────────────────────
const DEFAULT_SPREADSHEET_ID = '1MtmcbnIJsEAmSWICr3g4JalkOqpOlxUDiqE2TA4Lfc4';
const CREDENTIALS_PATH = new URL('../google-credentials.json', import.meta.url);
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

// ── JWT Token Creation ──────────────────────────────────────────────────
function createJWT(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: credentials.client_email,
    scope: SCOPES,
    aud: credentials.token_uri,
    iat: now,
    exp: now + 3600,
  })).toString('base64url');

  const signInput = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signInput);
  const signature = sign.sign(credentials.private_key, 'base64url');

  return `${signInput}.${signature}`;
}

// ── Get Access Token ────────────────────────────────────────────────────
async function getAccessToken(credentials) {
  const jwt = createJWT(credentials);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  }).toString();

  return new Promise((resolve, reject) => {
    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (parsed.access_token) resolve(parsed.access_token);
        else reject(new Error(`Auth failed: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Fetch from Sheets API ───────────────────────────────────────────────
async function fetchJSON(url, token) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        } else {
          resolve(JSON.parse(data));
        }
      });
    }).on('error', reject);
  });
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  const spreadsheetId = process.argv[2] || DEFAULT_SPREADSHEET_ID;

  console.log('📄 Loading credentials...');
  const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf-8'));

  console.log('🔑 Authenticating...');
  const token = await getAccessToken(credentials);

  // Step 1: Get spreadsheet metadata (all sheet/tab names)
  console.log('📊 Fetching spreadsheet info...');
  const meta = await fetchJSON(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`,
    token
  );

  const sheetNames = meta.sheets.map(s => s.properties.title);
  console.log(`\n📑 Found ${sheetNames.length} tabs: ${sheetNames.join(', ')}\n`);

  // Step 2: Batch-fetch all tabs
  const ranges = sheetNames.map(name => `ranges=${encodeURIComponent(name)}`).join('&');
  const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${ranges}`;
  const batch = await fetchJSON(batchUrl, token);

  // Step 3: Print each tab
  for (const range of batch.valueRanges) {
    const tabName = range.range.split('!')[0].replace(/'/g, '');
    const rows = range.values || [];
    
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  📋 TAB: ${tabName}  (${rows.length} rows)`);
    console.log(`${'═'.repeat(60)}`);

    if (rows.length === 0) {
      console.log('  (empty)');
      continue;
    }

    // Print header
    const headers = rows[0];
    console.log(`  Columns: ${headers.join(' | ')}`);
    console.log(`  ${'─'.repeat(56)}`);

    // Print data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowObj = {};
      headers.forEach((h, j) => {
        if (row[j] !== undefined && row[j] !== '') rowObj[h] = row[j];
      });
      if (Object.keys(rowObj).length > 0) {
        console.log(`  Row ${i}: ${JSON.stringify(rowObj)}`);
      }
    }
  }

  console.log(`\n✅ Done! All ${sheetNames.length} tabs read successfully.`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

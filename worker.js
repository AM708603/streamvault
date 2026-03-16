// ============================================================
//  StreamVault — Cloudflare Worker Backend
//  Paste this entire file into your Cloudflare Worker editor
// ============================================================
//
//  SETUP STEPS:
//  1. Go to workers.cloudflare.com → Create Worker → paste this code
//  2. In Worker settings → Variables → KV Namespace Bindings:
//     Add binding with Variable name: SV_KV
//     Select your KV namespace (create one first at KV tab)
//  3. Save & Deploy
//  4. Copy your Worker URL (e.g. https://streamvault.yourname.workers.dev)
//  5. Paste that URL into admin.html and streamvault-netflix.html
//     where it says YOUR_WORKER_URL
// ============================================================

// ── CHANGE THIS PASSWORD ──────────────────────────────────
const ADMIN_PASSWORD = "streamvault2025";
// ─────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
  "Content-Type": "application/json",
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // ── PUBLIC ROUTES (no auth needed) ──────────────────
    // GET /api/content  → returns all movies, tv, anime
    if (request.method === "GET" && path === "/api/content") {
      return await getContent(env);
    }

    // GET /api/content/:type  → returns specific type
    if (request.method === "GET" && path.startsWith("/api/content/")) {
      const type = path.split("/")[3];
      return await getContentByType(env, type);
    }

    // GET /api/health → health check
    if (request.method === "GET" && path === "/api/health") {
      return json({ status: "ok", timestamp: Date.now() });
    }

    // ── ADMIN ROUTES (password required) ────────────────
    const adminPass = request.headers.get("X-Admin-Password");
    if (adminPass !== ADMIN_PASSWORD) {
      return json({ error: "Unauthorized" }, 401);
    }

    // POST /api/content/:type  → add item
    if (request.method === "POST" && path.startsWith("/api/content/")) {
      const type = path.split("/")[3];
      return await addItem(env, type, request);
    }

    // PUT /api/content/:type/:id  → update item
    if (request.method === "PUT" && path.startsWith("/api/content/")) {
      const parts = path.split("/");
      const type = parts[3];
      const id = parseInt(parts[4]);
      return await updateItem(env, type, id, request);
    }

    // DELETE /api/content/:type/:id  → delete item
    if (request.method === "DELETE" && path.startsWith("/api/content/")) {
      const parts = path.split("/");
      const type = parts[3];
      const id = parseInt(parts[4]);
      return await deleteItem(env, type, id);
    }

    // POST /api/auth  → verify password
    if (request.method === "POST" && path === "/api/auth") {
      return json({ success: true, message: "Authenticated" });
    }

    // POST /api/content/bulk  → replace entire dataset
    if (request.method === "POST" && path === "/api/bulk") {
      return await bulkSave(env, request);
    }

    return json({ error: "Not Found" }, 404);
  },
};

// ── HELPERS ────────────────────────────────────────────────

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS,
  });
}

async function getDB(env) {
  try {
    const raw = await env.SV_KV.get("db");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  // Return default empty structure
  return { movies: [], tvshows: [], anime: [] };
}

async function saveDB(env, db) {
  await env.SV_KV.put("db", JSON.stringify(db));
}

async function getContent(env) {
  const db = await getDB(env);
  return json(db);
}

async function getContentByType(env, type) {
  const db = await getDB(env);
  const validTypes = { movies: "movies", movie: "movies", tv: "tvshows", tvshows: "tvshows", anime: "anime" };
  const key = validTypes[type];
  if (!key) return json({ error: "Invalid type" }, 400);
  return json(db[key] || []);
}

async function addItem(env, type, request) {
  const db = await getDB(env);
  const key = typeKey(type);
  if (!key) return json({ error: "Invalid type" }, 400);
  const item = await request.json();
  if (!item.id) item.id = Date.now();
  db[key].push(item);
  await saveDB(env, db);
  return json({ success: true, item });
}

async function updateItem(env, type, id, request) {
  const db = await getDB(env);
  const key = typeKey(type);
  if (!key) return json({ error: "Invalid type" }, 400);
  const updated = await request.json();
  const idx = db[key].findIndex((x) => x.id === id);
  if (idx === -1) return json({ error: "Not found" }, 404);
  db[key][idx] = { ...updated, id };
  await saveDB(env, db);
  return json({ success: true });
}

async function deleteItem(env, type, id) {
  const db = await getDB(env);
  const key = typeKey(type);
  if (!key) return json({ error: "Invalid type" }, 400);
  db[key] = db[key].filter((x) => x.id !== id);
  await saveDB(env, db);
  return json({ success: true });
}

async function bulkSave(env, request) {
  const data = await request.json();
  await saveDB(env, data);
  return json({ success: true, counts: { movies: data.movies?.length, tvshows: data.tvshows?.length, anime: data.anime?.length } });
}

function typeKey(type) {
  const map = { movie: "movies", movies: "movies", tv: "tvshows", tvshows: "tvshows", anime: "anime" };
  return map[type] || null;
}

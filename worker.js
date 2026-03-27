// ============================================================
//  StreamVault — Cloudflare Worker Backend  (FIXED)
// ============================================================

const ADMIN_PASSWORD = "streamvault2025";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
  "Content-Type": "application/json",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url  = new URL(request.url);
    const path = url.pathname;

    // ── PUBLIC ROUTES (no auth) ──────────────────────────

    if (request.method === "GET" && path === "/api/content") {
      return await getContent(env);
    }

    if (request.method === "GET" && path.startsWith("/api/content/") && path.split("/").length === 4) {
      const type = path.split("/")[3];
      return await getContentByType(env, type);
    }

    if (request.method === "GET" && path === "/api/health") {
      return json({ status: "ok", timestamp: Date.now() });
    }

    // ── PUBLIC: Submit a content request ────────────────
    if (request.method === "POST" && path === "/api/requests") {
      return await submitRequest(env, request);
    }

    // ── ALL REMAINING ROUTES REQUIRE AUTH ───────────────
    const adminPass = request.headers.get("X-Admin-Password");
    if (adminPass !== ADMIN_PASSWORD) {
      return json({ error: "Unauthorized" }, 401);
    }

    // POST /api/auth
    if (request.method === "POST" && path === "/api/auth") {
      return json({ success: true, message: "Authenticated" });
    }

    // ── ADMIN: Manage content requests ──────────────────
    if (request.method === "GET" && path === "/api/requests") {
      return await getRequests(env);
    }
    if (request.method === "PUT" && path.startsWith("/api/requests/")) {
      const id = path.split("/")[3];
      return await updateRequest(env, id, request);
    }
    if (request.method === "DELETE" && path.match(/^\/api\/requests\/[^/]+$/)) {
      const id = path.split("/")[3];
      return await deleteRequest(env, id);
    }
    if (request.method === "DELETE" && path === "/api/requests") {
      return await clearRequests(env);
    }

    // ── ADMIN: Content CRUD ──────────────────────────────

    // POST /api/content/:type → add item
    if (request.method === "POST" && path.startsWith("/api/content/")) {
      const type = path.split("/")[3];
      return await addItem(env, type, request);
    }

    // PUT /api/content/:type/:id → update item
    if (request.method === "PUT" && path.startsWith("/api/content/")) {
      const parts = path.split("/");
      // ✅ FIX: parse id to Number so strict === works in filter
      return await updateItem(env, parts[3], Number(parts[4]), request);
    }

    // DELETE /api/content/:type/:id → delete item
    if (request.method === "DELETE" && path.startsWith("/api/content/")) {
      const parts = path.split("/");
      // ✅ FIX: parse id to Number so strict === works in filter
      return await deleteItem(env, parts[3], Number(parts[4]));
    }

    // POST /api/bulk → replace entire database
    if (request.method === "POST" && path === "/api/bulk") {
      return await bulkSave(env, request);
    }

    return json({ error: "Not Found" }, 404);
  },
};

// ── HELPERS ───────────────────────────────────────────────

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

async function getDB(env) {
  try {
    const raw = await env.SV_KV.get("db");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { movies: [], tvshows: [], anime: [] };
}

async function saveDB(env, db) {
  await env.SV_KV.put("db", JSON.stringify(db));
}

function typeKey(type) {
  const map = {
    movie: "movies", movies: "movies",
    tv: "tvshows",  tvshows: "tvshows",
    anime: "anime",
  };
  return map[type] || null;
}

// ── CONTENT HANDLERS ─────────────────────────────────────

async function getContent(env) {
  return json(await getDB(env));
}

async function getContentByType(env, type) {
  const db  = await getDB(env);
  const key = typeKey(type);
  if (!key) return json({ error: "Invalid type" }, 400);
  return json(db[key] || []);
}

async function addItem(env, type, request) {
  const db  = await getDB(env);
  const key = typeKey(type);
  if (!key) return json({ error: "Invalid type" }, 400);

  const item = await request.json();

  // ✅ FIX: always store id as a Number
  if (!item.id) {
    item.id = Date.now();
  } else {
    item.id = Number(item.id);
    if (isNaN(item.id)) item.id = Date.now();
  }

  // ✅ FIX: prevent duplicate ids — update in place if id already exists
  const existingIdx = db[key].findIndex((x) => Number(x.id) === item.id);
  if (existingIdx !== -1) {
    db[key][existingIdx] = item;
  } else {
    db[key].push(item);
  }

  await saveDB(env, db);
  return json({ success: true, item });
}

async function updateItem(env, type, id, request) {
  const db  = await getDB(env);
  const key = typeKey(type);
  if (!key) return json({ error: "Invalid type" }, 400);

  const updated = await request.json();
  // ✅ FIX: compare as Number on both sides
  const idx = db[key].findIndex((x) => Number(x.id) === Number(id));
  if (idx === -1) return json({ error: "Not found" }, 404);

  db[key][idx] = { ...updated, id: Number(id) };
  await saveDB(env, db);
  return json({ success: true });
}

async function deleteItem(env, type, id) {
  const db  = await getDB(env);
  const key = typeKey(type);
  if (!key) return json({ error: "Invalid type" }, 400);

  const before = db[key].length;
  // ✅ FIX: compare as Number on both sides — this is the core delete bug
  db[key] = db[key].filter((x) => Number(x.id) !== Number(id));
  const deleted = before - db[key].length;

  await saveDB(env, db);

  // ✅ FIX: always return success true (item may have already been removed),
  //         but include a flag so the client knows if it was actually found
  return json({ success: true, deleted });
}

async function bulkSave(env, request) {
  const data = await request.json();

  // ✅ FIX: normalise all ids to Number during bulk import
  const normalise = (arr) => (Array.isArray(arr) ? arr : []).map((item) => ({
    ...item,
    id: item.id ? Number(item.id) : Date.now(),
  }));

  const db = {
    movies:  normalise(data.movies),
    tvshows: normalise(data.tvshows),
    anime:   normalise(data.anime),
  };

  await saveDB(env, db);
  return json({
    success: true,
    counts: { movies: db.movies.length, tvshows: db.tvshows.length, anime: db.anime.length },
  });
}

// ── REQUEST HANDLERS ─────────────────────────────────────

async function getRequestsDB(env) {
  try {
    const raw = await env.SV_KV.get("requests");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

async function saveRequestsDB(env, requests) {
  await env.SV_KV.put("requests", JSON.stringify(requests));
}

async function submitRequest(env, request) {
  const body  = await request.json();
  const title = (body.title || "").trim();
  const type  = (body.type  || "movie").trim();
  const note  = (body.note  || "").trim().slice(0, 500);
  const name  = (body.name  || "").trim().slice(0, 80);

  if (!title) return json({ error: "Title is required" }, 400);

  const requests = await getRequestsDB(env);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const pendingFromIp = requests.filter(r => r.ip === ip && r.status === "pending").length;
  if (pendingFromIp >= 3) {
    return json({ error: "You have too many pending requests. Please wait for them to be reviewed." }, 429);
  }

  const req = {
    id:        Date.now().toString(),
    title, type, note, name, ip,
    status:    "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    adminNote: "",
  };

  requests.unshift(req);
  if (requests.length > 500) requests.length = 500;
  await saveRequestsDB(env, requests);
  return json({ success: true, id: req.id });
}

async function getRequests(env) {
  return json(await getRequestsDB(env));
}

async function updateRequest(env, id, request) {
  const requests = await getRequestsDB(env);
  const idx = requests.findIndex(r => r.id === id);
  if (idx === -1) return json({ error: "Not found" }, 404);
  const updates = await request.json();
  requests[idx] = {
    ...requests[idx],
    status:    updates.status    !== undefined ? updates.status    : requests[idx].status,
    adminNote: updates.adminNote !== undefined ? updates.adminNote : requests[idx].adminNote,
    updatedAt: new Date().toISOString(),
  };
  await saveRequestsDB(env, requests);
  return json({ success: true });
}

async function deleteRequest(env, id) {
  const requests = await getRequestsDB(env);
  await saveRequestsDB(env, requests.filter(r => r.id !== id));
  return json({ success: true });
}

async function clearRequests(env) {
  await saveRequestsDB(env, []);
  return json({ success: true });
}

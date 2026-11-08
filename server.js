import express from "express";
import pino from "pino";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import crypto from "crypto";
import { jwennRepons, chajeKonfig, sovKonfig, getKonfig, REPONS_MEDYA } from "./repons.js";
import { useFirebaseAuthState } from "./auth-firebase.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const MAX_SESYON = Number(process.env.MAX_SESYON || 20);
const AUTH_DIR = path.join(__dirname, "auth");
const logger = pino({ level: "silent" });
const dòmi = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------- Firebase (opsyonèl, men rekòmande) ----------------
let db = null;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    databaseURL:
      process.env.FIREBASE_DATABASE_URL ||
      "https://guivens-domino-default-rtdb.firebaseio.com",
  });
  db = admin.database();
  console.log("🔥 Sesyon yo ap sove nan Firebase");
} else {
  console.log("📁 FIREBASE_SERVICE_ACCOUNT pa defini: sesyon yo ap sove nan dosye auth/ (yo ka pèdi lè sèvè a redémarre)");
}

// ---------------- Sesyon WhatsApp (yon sèl pou chak nimewo) ----------------
const sesyon = new Map(); // nimewo -> { sock, estati }

async function chajeAuth(nimewo) {
  if (db) return useFirebaseAuthState(db, nimewo);
  return useMultiFileAuthState(path.join(AUTH_DIR, nimewo));
}

async function efaseSesyon(nimewo) {
  if (db) {
    await db.ref(`wa_sessions/${nimewo}`).remove();
    await db.ref(`wa_index/${nimewo}`).remove();
  } else {
    fs.rmSync(path.join(AUTH_DIR, nimewo), { recursive: true, force: true });
  }
}

async function lisNimewoSove() {
  if (db) {
    const snap = await db.ref("wa_index").get();
    return Object.keys(snap.val() || {});
  }
  if (!fs.existsSync(AUTH_DIR)) return [];
  return fs.readdirSync(AUTH_DIR).filter((n) => /^\d+$/.test(n));
}

async function jereMesaj(sok, msg) {
  const jid = msg.key.remoteJid;
  // Sèlman konvèsasyon prive (pa gwoup, pa estati)
  if (!jid || jid.endsWith("@g.us") || jid === "status@broadcast") return;

  const tèks =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message.imageMessage?.caption ||
    msg.message.videoMessage?.caption ||
    "";
  let repons;
  if (tèks.trim()) repons = jwennRepons(tèks);
  else if (msg.message.imageMessage) repons = REPONS_MEDYA.foto;
  else if (msg.message.audioMessage) repons = REPONS_MEDYA.vokal;
  else if (msg.message.videoMessage) repons = REPONS_MEDYA.videyo;
  else return; // sticker, kontak, elatriye: inyore

  await sok.sendPresenceUpdate("composing", jid);
  await dòmi(1000 + Math.random() * 1000);
  await sok.sendMessage(jid, { text: repons }, { quoted: msg });
  await sok.sendPresenceUpdate("paused", jid);
}

async function kòmanse(nimewo, restore = false) {
  const { state, saveCreds } = await chajeAuth(nimewo);

  if (restore && !state.creds.registered) {
    await efaseSesyon(nimewo);
    return null;
  }

  const { version } = await fetchLatestBaileysVersion();
  const sok = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: ["Guivens Bot", "Chrome", "1.0.0"],
  });

  let s = sesyon.get(nimewo);
  if (!s) {
    s = { sock: sok, estati: "poko" };
    sesyon.set(nimewo, s);
  } else {
    s.sock = sok;
  }

  sok.ev.on("creds.update", saveCreds);

  sok.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (sesyon.get(nimewo) !== s || s.sock !== sok) return; // sokèt ki ansyen

    if (connection === "open") {
      s.estati = "konekte";
      if (db) db.ref(`wa_index/${nimewo}`).set(true).catch(() => {});
      console.log(`✅ ${nimewo} konekte`);
    }

    if (connection === "close") {
      const kòd = lastDisconnect?.error?.output?.statusCode;
      const dekonekte = kòd === DisconnectReason.loggedOut;
      const rejistre = sok.authState.creds.registered;

      if (dekonekte || !rejistre) {
        console.log(`🧹 Sesyon ${nimewo} netwaye`);
        sesyon.delete(nimewo);
        await efaseSesyon(nimewo).catch(() => {});
        return;
      }
      s.estati = "poko";
      setTimeout(() => kòmanse(nimewo).catch(console.error), 2000);
    }
  });

  sok.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify" || s.estati !== "konekte") return; // reponn sèlman lè en ligne
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;
      try {
        await jereMesaj(sok, msg);
      } catch (e) {
        console.error(`Erè mesaj (${nimewo}):`, e.message);
      }
    }
  });

  return s;
}

// ---------------- Sèvè entènèt ----------------
const app = express();
app.set("trust proxy", 1);
app.use(express.json());

// CORS: pou paj la ka sou Cloudflare Pages pandan sèvè a sou Render/Railway
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/sante", (_req, res) => res.send("ok"));

// Limit senp: 5 demann pou chak IP chak 10 minit
const tantativ = new Map();
function twoPlen(ip) {
  const now = Date.now();
  const lis = (tantativ.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  lis.push(now);
  tantativ.set(ip, lis);
  return lis.length > 5;
}

app.post("/api/konekte", async (req, res) => {
  try {
    if (twoPlen(req.ip)) {
      return res.status(429).json({ erè: "Twòp tantativ. Tann kèk minit epi eseye ankò." });
    }

    const nimewo = String(req.body?.nimewo || "").replace(/\D/g, "");
    if (nimewo.length < 8 || nimewo.length > 15) {
      return res.status(400).json({ erè: "Nimewo a pa valid. Mete kòd peyi a (egz: 509...)." });
    }

    const egziste = sesyon.get(nimewo);
    if (egziste?.estati === "konekte") {
      return res.status(400).json({ erè: "Nimewo sa a deja konekte." });
    }
    if (egziste) {
      // Tantativ anvan ki pa fini: rekòmanse nèt
      sesyon.delete(nimewo);
      try { egziste.sock.end(undefined); } catch {}
      await efaseSesyon(nimewo);
    }
    if (sesyon.size >= MAX_SESYON) {
      return res.status(503).json({ erè: "Bòt la plen pou kounye a. Eseye pita." });
    }

    const s = await kòmanse(nimewo);
    await dòmi(2000);
    const brit = await s.sock.requestPairingCode(nimewo);
    s.estati = "ap-konekte";

    const kòd = brit.match(/.{1,4}/g).join("-");
    console.log(`🔑 Kòd jenere pou ${nimewo}`);
    res.json({ kòd });
  } catch (e) {
    console.error("Erè /api/konekte:", e);
    res.status(500).json({ erè: "Pa t kapab jenere kòd la. Eseye ankò." });
  }
});

app.get("/api/estati", (req, res) => {
  const nimewo = String(req.query.nimewo || "").replace(/\D/g, "");
  res.json({ estati: sesyon.get(nimewo)?.estati || "poko" });
});

// ---------------- Panèl admin ----------------
const ADMIN_KODE = String(process.env.ADMIN_KODE || "2008");
const tokenYo = new Map(); // token -> ekspirasyon
const echèk = new Map(); // ip -> [timestamps]
const DWA_TOKEN = 12 * 60 * 60 * 1000;

app.get("/admin.js", (_req, res) => res.sendFile(path.join(__dirname, "admin.js")));

function kòdEgal(a, b) {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

function mandeAdmin(req, res, next) {
  const t = req.get("x-admin-token");
  const exp = t && tokenYo.get(t);
  if (!exp || exp < Date.now()) {
    if (t) tokenYo.delete(t);
    return res.status(401).json({ erè: "Pa otorize." });
  }
  next();
}

app.post("/api/admin/login", (req, res) => {
  const now = Date.now();
  const lis = (echèk.get(req.ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  if (lis.length >= 5) {
    return res.status(429).json({ erè: "Twòp tantativ. Tann 15 minit." });
  }
  if (!kòdEgal(req.body?.kòd ?? "", ADMIN_KODE)) {
    lis.push(now);
    echèk.set(req.ip, lis);
    return res.status(401).json({ erè: "Kòd la pa bon." });
  }
  const token = crypto.randomBytes(32).toString("hex");
  tokenYo.set(token, now + DWA_TOKEN);
  res.json({ token });
});

app.get("/api/admin/konfig", mandeAdmin, (_req, res) => res.json(getKonfig()));

app.put("/api/admin/konfig", mandeAdmin, async (req, res) => {
  try {
    const sove = await sovKonfig(db, req.body);
    res.json(sove);
  } catch (e) {
    res.status(400).json({ erè: e.message });
  }
});

app.get("/api/admin/sesyon", mandeAdmin, (_req, res) => {
  res.json({
    max: MAX_SESYON,
    lis: [...sesyon.entries()].map(([nimewo, s]) => ({ nimewo, estati: s.estati })),
  });
});

app.delete("/api/admin/sesyon/:nimewo", mandeAdmin, async (req, res) => {
  const nimewo = String(req.params.nimewo).replace(/\D/g, "");
  const s = sesyon.get(nimewo);
  if (!s) return res.status(404).json({ erè: "Sesyon pa egziste." });
  sesyon.delete(nimewo);
  try { await s.sock.logout(); } catch { try { s.sock.end(undefined); } catch {} }
  await efaseSesyon(nimewo).catch(() => {});
  res.json({ ok: true });
});

app.listen(PORT, async () => {
  console.log(`🚀 Sèvè a mache sou pò ${PORT}`);
  await chajeKonfig(db);
  // Rekonekte tout sesyon ki te sove yo
  try {
    const lis = await lisNimewoSove();
    for (const n of lis) {
      await kòmanse(n, true).catch((e) => console.error(`Pa t rekonekte ${n}:`, e.message));
      await dòmi(500);
    }
    if (lis.length) console.log(`♻️ ${lis.length} sesyon restore`);
  } catch (e) {
    console.error("Erè restorasyon:", e);
  }
});

// Lojik repons otomatik yo. Done yo (repons pa defo) nan repons-defo.js
// Apre sa, ou modifye yo dirèkteman nan panèl admin lan (yo sove otomatikman).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { REPONS_PAR_DEFO, MESAJ_PAR_DEFO, REPONS_MEDYA } from "./repons-defo.js";

export { REPONS_MEDYA };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FICHYE = path.join(__dirname, "data", "repons.json");

let konfig = {
  repons: structuredClone(REPONS_PAR_DEFO),
  defo: MESAJ_PAR_DEFO,
};

export const getKonfig = () => konfig;

// Verifye epi netwaye done k ap soti nan panèl admin lan
export function validasyon(k) {
  if (!k || !Array.isArray(k.repons)) throw new Error("Fòma pa bon.");
  if (k.repons.length > 400) throw new Error("Twòp règ (maksimòm 400).");

  const repons = k.repons.map((r, i) => {
    const mo = (Array.isArray(r?.mo) ? r.mo : [])
      .map((x) => String(x).trim())
      .filter(Boolean);
    const rep = (Array.isArray(r?.repons) ? r.repons : [])
      .map((x) => String(x).trim())
      .filter(Boolean);
    if (!mo.length || !rep.length) {
      throw new Error(`Règ #${i + 1} pa konplè (bezwen omwen yon mo ak yon repons).`);
    }
    if (mo.length > 50 || rep.length > 20) throw new Error(`Règ #${i + 1} gen twòp antre.`);
    if (mo.some((x) => x.length > 100)) throw new Error(`Yon mo twò long nan règ #${i + 1}.`);
    if (rep.some((x) => x.length > 2000)) throw new Error(`Yon repons twò long nan règ #${i + 1}.`);
    return { mo, repons: rep };
  });

  const defo = String(k.defo || "").trim().slice(0, 2000) || MESAJ_PAR_DEFO;
  return { repons, defo };
}

export async function chajeKonfig(db) {
  try {
    let brit = null;
    if (db) {
      brit = (await db.ref("wa_config/repons").get()).val();
    } else if (fs.existsSync(FICHYE)) {
      brit = fs.readFileSync(FICHYE, "utf8");
    }
    if (brit) konfig = validasyon(JSON.parse(brit));
  } catch (e) {
    console.error("Pa t kapab chaje repons yo, m ap itilize sa ki pa defo:", e.message);
  }
}

export async function sovKonfig(db, k) {
  const pwòp = validasyon(k);
  const brit = JSON.stringify(pwòp);
  if (db) {
    await db.ref("wa_config/repons").set(brit);
  } else {
    fs.mkdirSync(path.dirname(FICHYE), { recursive: true });
    fs.writeFileSync(FICHYE, brit);
  }
  konfig = pwòp;
  return pwòp;
}

function netwaye(tèks) {
  return (
    " " +
    tèks
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}\s']/gu, " ")
      .replace(/'/g, " ")
      .replace(/\s+/g, " ")
      .trim() +
    " "
  );
}

export function jwennRepons(tèksBrit) {
  const t = netwaye(tèksBrit);
  for (const règ of konfig.repons) {
    for (const mo of règ.mo) {
      if (t.includes(netwaye(mo))) {
        return règ.repons[Math.floor(Math.random() * règ.repons.length)];
      }
    }
  }
  return konfig.defo;
}

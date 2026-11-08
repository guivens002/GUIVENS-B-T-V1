// Panèl admin: kenbe dwèt ou sou ikòn 🤖 la pandan 5 segonn pou louvri l
(() => {
  const ikon = document.getElementById("ikonBot");
  if (!ikon) return;

  ikon.style.cssText +=
    ";display:inline-block;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;touch-action:manipulation;";
  ikon.addEventListener("contextmenu", (e) => e.preventDefault());

  let tim = null;
  const kòmanse = () => {
    clearTimeout(tim);
    tim = setTimeout(ouvriAdmin, 5000);
  };
  const anile = () => clearTimeout(tim);
  ikon.addEventListener("pointerdown", kòmanse);
  ["pointerup", "pointerleave", "pointercancel"].forEach((e) => ikon.addEventListener(e, anile));

  // ---------- Stil ----------
  const stil = document.createElement("style");
  stil.textContent = `
  .adm-fon{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:9999;overflow:auto;padding:16px;display:flex;justify-content:center}
  .adm-bwat{width:100%;max-width:640px;background:#1f2c33;border-radius:14px;padding:18px;color:#e9edef;height:fit-content;margin:auto}
  .adm-bwat h2{margin:0;font-size:19px}
  .adm-tèt{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;gap:8px}
  .adm-bwat label{display:block;font-size:13px;color:#8696a0;margin:10px 0 4px}
  .adm-bwat textarea,.adm-bwat input{width:100%;background:#2a3942;border:1px solid #2a3942;color:#e9edef;border-radius:10px;padding:10px 12px;font-size:15px;font-family:inherit;outline:none}
  .adm-bwat textarea{min-height:80px;resize:vertical}
  .adm-bwat button{padding:10px 14px;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;background:#2a3942;color:#e9edef;width:auto;margin:0}
  .adm-bwat button.vèt{background:#25D366;color:#05210f}
  .adm-bwat button.wouj{background:#b3261e;color:#fff}
  .adm-rangé{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
  .adm-kat{background:#111b21;border-radius:12px;padding:12px;margin-top:12px}
  .adm-tab{display:flex;gap:6px;margin-bottom:6px}
  .adm-tab button.aktif{background:#25D366;color:#05210f}
  .adm-mesaj{margin-top:10px;font-size:14px;min-height:18px}
  .adm-sesyon{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid #2a3942}
  .adm-ti{font-size:12px;color:#8696a0}
  `;
  document.head.appendChild(stil);

  // ---------- Èd ----------
  const el = (tag, attrs = {}, ...ti) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") n.className = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n[k] = v;
    }
    ti.forEach((t) => n.append(t));
    return n;
  };

  let token = sessionStorage.getItem("admToken") || "";
  let fon = null;

  async function api(metòd, url, kò) {
    const r = await fetch((window.API_URL || "") + url, {
      method: metòd,
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: kò ? JSON.stringify(kò) : undefined,
    });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401 && url !== "/api/admin/login") {
      token = "";
      sessionStorage.removeItem("admToken");
      throw new Error("401");
    }
    if (!r.ok) throw new Error(d.erè || "Yon erè pase.");
    return d;
  }

  function fèmen() {
    if (fon) fon.remove();
    fon = null;
  }

  async function ouvriAdmin() {
    if (fon) return;
    if (navigator.vibrate) navigator.vibrate(40);
    fon = el("div", { class: "adm-fon" });
    document.body.appendChild(fon);
    if (token) {
      try {
        await api("GET", "/api/admin/konfig");
        return panèl();
      } catch {}
    }
    login();
  }

  // ---------- Login ----------
  function login() {
    const kòd = el("input", {
      type: "password",
      inputMode: "numeric",
      placeholder: "Kòd admin",
      autocomplete: "off",
    });
    const mesaj = el("div", { class: "adm-mesaj" });
    const antre = async () => {
      mesaj.style.color = "#8696a0";
      mesaj.textContent = "Ap verifye...";
      try {
        const d = await api("POST", "/api/admin/login", { kòd: kòd.value });
        token = d.token;
        sessionStorage.setItem("admToken", token);
        panèl();
      } catch (e) {
        mesaj.style.color = "#ff8a80";
        mesaj.textContent = e.message;
      }
    };
    kòd.addEventListener("keydown", (e) => e.key === "Enter" && antre());
    fon.replaceChildren(
      el(
        "div",
        { class: "adm-bwat", style: "max-width:360px" },
        el("div", { class: "adm-tèt" }, el("h2", {}, "🔒 Panèl Admin"), el("button", { onclick: fèmen }, "✕")),
        el("label", {}, "Antre kòd la"),
        kòd,
        el("div", { class: "adm-rangé" }, el("button", { class: "vèt", onclick: antre }, "Antre")),
        mesaj
      )
    );
    kòd.focus();
  }

  // ---------- Panèl prensipal ----------
  let onglè = "repons";

  function panèl() {
    const kò = el("div");
    const tabRepons = el("button", { onclick: () => chanjeOnglè("repons") }, "💬 Repons");
    const tabSesyon = el("button", { onclick: () => chanjeOnglè("sesyon") }, "📱 Nimewo yo");

    function chanjeOnglè(o) {
      onglè = o;
      tabRepons.className = o === "repons" ? "aktif" : "";
      tabSesyon.className = o === "sesyon" ? "aktif" : "";
      kò.replaceChildren();
      o === "repons" ? montreRepons(kò) : montreSesyon(kò);
    }

    fon.replaceChildren(
      el(
        "div",
        { class: "adm-bwat" },
        el(
          "div",
          { class: "adm-tèt" },
          el("h2", {}, "⚙️ Panèl Admin"),
          el(
            "div",
            { class: "adm-rangé", style: "margin:0" },
            el(
              "button",
              {
                onclick: () => {
                  token = "";
                  sessionStorage.removeItem("admToken");
                  fèmen();
                },
              },
              "Dekonekte"
            ),
            el("button", { onclick: fèmen }, "✕")
          )
        ),
        el("div", { class: "adm-tab" }, tabRepons, tabSesyon),
        kò
      )
    );
    chanjeOnglè(onglè);
  }

  const sesyonFini = () => {
    login();
  };

  // ---------- Onglè repons ----------
  async function montreRepons(kò) {
    kò.textContent = "Ap chaje...";
    let konfig;
    try {
      konfig = await api("GET", "/api/admin/konfig");
    } catch (e) {
      return e.message === "401" ? sesyonFini() : (kò.textContent = e.message);
    }

    const lisKat = el("div");
    const defo = el("textarea", {}, "");
    defo.value = konfig.defo;
    const mesaj = el("div", { class: "adm-mesaj" });

    function ajouteKat(r = { mo: [], repons: [] }) {
      const mo = el("textarea", { placeholder: "salut\nbonjou\nalo" });
      mo.value = r.mo.join("\n");
      const rep = el("textarea", { placeholder: "Salut! Kòman w ye?\n---\nBonjou! 😊" });
      rep.value = r.repons.join("\n---\n");
      const kat = el(
        "div",
        { class: "adm-kat" },
        el("label", { style: "margin-top:0" }, "Sa moun lan ekri (yon mo oswa fraz pou chak liy)"),
        mo,
        el("label", {}, "Sa bòt la reponn (separe plizyè repons ak yon liy ---)"),
        rep,
        el(
          "div",
          { class: "adm-rangé" },
          el(
            "button",
            {
              class: "wouj",
              onclick: () => {
                if (confirm("Efase règ sa a?")) kat.remove();
              },
            },
            "🗑 Efase"
          )
        )
      );
      kat._mo = mo;
      kat._rep = rep;
      lisKat.appendChild(kat);
      return kat;
    }

    konfig.repons.forEach(ajouteKat);

    async function sove() {
      const repons = [];
      for (const kat of lisKat.children) {
        const mo = kat._mo.value.split("\n").map((x) => x.trim()).filter(Boolean);
        const rep = kat._rep.value
          .split(/\n\s*---+\s*(?:\n|$)/)
          .map((x) => x.trim())
          .filter(Boolean);
        if (!mo.length && !rep.length) continue; // règ vid: inyore
        repons.push({ mo, repons: rep });
      }
      mesaj.style.color = "#8696a0";
      mesaj.textContent = "Ap sove...";
      try {
        await api("PUT", "/api/admin/konfig", { repons, defo: defo.value });
        mesaj.style.color = "#25D366";
        mesaj.textContent = "✅ Sove! Bòt la ap itilize chanjman yo touswit.";
      } catch (e) {
        if (e.message === "401") return sesyonFini();
        mesaj.style.color = "#ff8a80";
        mesaj.textContent = "❌ " + e.message;
      }
    }

    kò.replaceChildren(
      el("div", { class: "adm-ti" }, "Bòt la tcheke règ yo de ibò anba, epi li pran premye ki matche."),
      lisKat,
      el(
        "div",
        { class: "adm-rangé" },
        el(
          "button",
          {
            onclick: () => {
              const k = ajouteKat();
              k.scrollIntoView({ behavior: "smooth", block: "center" });
            },
          },
          "➕ Ajoute yon règ"
        )
      ),
      el("label", {}, "Repons lè bòt la pa konprann mesaj la"),
      defo,
      el("div", { class: "adm-rangé" }, el("button", { class: "vèt", onclick: sove }, "💾 Sove tout")),
      mesaj
    );
  }

  // ---------- Onglè sesyon ----------
  async function montreSesyon(kò) {
    kò.textContent = "Ap chaje...";
    let d;
    try {
      d = await api("GET", "/api/admin/sesyon");
    } catch (e) {
      return e.message === "401" ? sesyonFini() : (kò.textContent = e.message);
    }
    const non = { konekte: "✅ konekte", "ap-konekte": "⏳ ap tann kòd", poko: "🔄 ap rekonekte" };
    const lis = el("div");
    if (!d.lis.length) lis.append(el("div", { class: "adm-ti", style: "padding:10px 0" }, "Pa gen nimewo konekte."));
    d.lis.forEach((s) =>
      lis.append(
        el(
          "div",
          { class: "adm-sesyon" },
          el("div", {}, "+" + s.nimewo, el("div", { class: "adm-ti" }, non[s.estati] || s.estati)),
          el(
            "button",
            {
              class: "wouj",
              onclick: async () => {
                if (!confirm("Dekonekte +" + s.nimewo + "?")) return;
                try {
                  await api("DELETE", "/api/admin/sesyon/" + s.nimewo);
                  montreSesyon(kò);
                } catch (e) {
                  alert(e.message);
                }
              },
            },
            "Dekonekte"
          )
        )
      )
    );
    kò.replaceChildren(
      el("div", { class: "adm-ti" }, `${d.lis.length} / ${d.max} nimewo`),
      lis,
      el("div", { class: "adm-rangé" }, el("button", { onclick: () => montreSesyon(kò) }, "🔄 Rafrechi"))
    );
  }
})();

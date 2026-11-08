// Sove sesyon WhatsApp nan Firebase Realtime Database (pou l pa pèdi lè sèvè a redémarre)
import { BufferJSON, initAuthCreds, proto } from "@whiskeysockets/baileys";

const enc = (n) => encodeURIComponent(n).replace(/\./g, "%2E");

export async function useFirebaseAuthState(db, nimewo) {
  const root = `wa_sessions/${nimewo}`;
  const ref = (n) => db.ref(`${root}/${enc(n)}`);

  const write = (data, name) =>
    ref(name).set(JSON.stringify(data, BufferJSON.replacer));

  const read = async (name) => {
    const snap = await ref(name).get();
    const v = snap.val();
    return v ? JSON.parse(v, BufferJSON.reviver) : null;
  };

  const remove = (name) => ref(name).remove();

  const creds = (await read("creds")) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {};
          await Promise.all(
            ids.map(async (id) => {
              let v = await read(`${type}-${id}`);
              if (type === "app-state-sync-key" && v) {
                v = proto.Message.AppStateSyncKeyData.fromObject(v);
              }
              data[id] = v;
            })
          );
          return data;
        },
        set: async (data) => {
          const tasks = [];
          for (const cat in data) {
            for (const id in data[cat]) {
              const v = data[cat][id];
              const name = `${cat}-${id}`;
              tasks.push(v ? write(v, name) : remove(name));
            }
          }
          await Promise.all(tasks);
        },
      },
    },
    saveCreds: () => write(creds, "creds"),
  };
}

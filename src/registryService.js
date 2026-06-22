import {
  collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db, isConfigured } from "./firebase";

const COLLECTION = "registros_plantillas";
const LS_KEY = "plantillas_registry";

// ── localStorage helpers ──────────────────────────────────────────────────────
function lsLoad() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function lsSave(entries) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(entries)); } catch {}
}

// ── public API ────────────────────────────────────────────────────────────────
export async function loadRegistry() {
  if (!isConfigured) return lsLoad();
  try {
    const q = query(collection(db, COLLECTION), orderBy("_ts", "desc"));
    const snap = await getDocs(q);
    const entries = snap.docs.map(d => ({ ...d.data(), _firestoreId: d.id }));
    lsSave(entries); // cache local
    return entries;
  } catch (e) {
    console.warn("Firestore unavailable, usando caché local", e);
    return lsLoad();
  }
}

export async function addEntry(entry) {
  if (!isConfigured) {
    const entries = [entry, ...lsLoad()];
    lsSave(entries);
    return entry;
  }
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...entry,
      _ts: serverTimestamp(),
    });
    const saved = { ...entry, _firestoreId: docRef.id };
    // actualizar caché
    const cached = lsLoad();
    lsSave([saved, ...cached]);
    return saved;
  } catch (e) {
    console.warn("Error guardando en Firestore, guardando localmente", e);
    const entries = [entry, ...lsLoad()];
    lsSave(entries);
    return entry;
  }
}

export async function removeEntry(entry) {
  if (!isConfigured) {
    const entries = lsLoad().filter(e => e.id !== entry.id);
    lsSave(entries);
    return;
  }
  try {
    if (entry._firestoreId) {
      await deleteDoc(doc(db, COLLECTION, entry._firestoreId));
    }
    const cached = lsLoad().filter(e => e.id !== entry.id);
    lsSave(cached);
  } catch (e) {
    console.warn("Error eliminando en Firestore", e);
    const cached = lsLoad().filter(e => e.id !== entry.id);
    lsSave(cached);
  }
}

export { isConfigured };

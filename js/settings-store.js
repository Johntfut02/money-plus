import { app } from "./firebase-config.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore, doc, getDocFromServer, setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
const auth = getAuth(app);
const db = getFirestore(app);
export function validOpening(value) {
  if (!Number.isFinite(value.openingBalance) || Math.abs(value.openingBalance) > 999999999) return false;
  const date = value.openingDate;
  return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number(date.slice(0, 4)) >= 1900 && Number(date.slice(0, 4)) <= 9999 && Number.isFinite(Date.parse(date + "T12:00:00Z")) && new Date(date + "T12:00:00Z").toISOString().slice(0, 10) === date;
}
function reference() {
  if (!auth.currentUser) throw new Error("Entre na sua conta.");
  return doc(db, "users", auth.currentUser.uid, "settings", "finance");
}
export async function carregarSaldoInicial() {
  const result = await getDocFromServer(reference());
  if (!result.exists()) return { openingBalance: 0, openingDate: null };
  const value = result.data();
  if (!validOpening(value)) throw new Error("Saldo inicial inválido.");
  return { openingBalance: value.openingBalance, openingDate: value.openingDate };
}
export async function salvarSaldoInicial(value) {
  if (!validOpening(value)) throw new Error("Informe saldo e data válidos.");
  await setDoc(reference(), { openingBalance: Math.round(value.openingBalance * 100) / 100, openingDate: value.openingDate });
}

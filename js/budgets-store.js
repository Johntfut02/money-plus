import { app } from "./firebase-config.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore, collection, doc, getDocsFromServer, setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);
const categories = ["Housing", "Food", "Transportation", "Entertainment", "Subscriptions", "Shopping"];
const validMonth = (month) => /^\d{4}-(0[1-9]|1[0-2])$/.test(month);

function meusOrcamentos() {
  const user = auth.currentUser;
  if (!user) throw new Error("Entre na sua conta para acessar os orçamentos.");
  return collection(db, "users", user.uid, "budgets");
}

// One document per month, with category limits inside it.
export async function carregarOrcamentos() {
  const result = await getDocsFromServer(meusOrcamentos());
  const months = {};
  result.docs.forEach((document) => {
    const { limits } = document.data();
    if (!validMonth(document.id) || !limits || typeof limits !== "object" || Array.isArray(limits)) {
      throw new Error("Orçamento inválido no banco de dados.");
    }
    months[document.id] = {};
    categories.forEach((category) => {
      const amount = limits[category] ?? 0;
      if (!Number.isFinite(amount) || amount < 0 || amount > 999999999) throw new Error("Limite inválido no banco de dados.");
      months[document.id][category] = Math.round(amount * 100) / 100;
    });
  });
  return months;
}

export async function salvarLimite(month, category, amount) {
  if (!validMonth(month) || !categories.includes(category) || !Number.isFinite(amount) || amount < 0 || amount > 999999999) {
    throw new Error("Informe um mês, categoria e limite válidos.");
  }
  // Merge changes only this category, preserving the month's other limits.
  await setDoc(doc(meusOrcamentos(), month), {
    limits: { [category]: Math.round(amount * 100) / 100 }
  }, { merge: true });
}

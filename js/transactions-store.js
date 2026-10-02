import { app } from "./firebase-config.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  getDocsFromServer,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

// Encontra a pasta de transações da conta conectada.
function minhasTransacoes() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Entre na sua conta para acessar as transações.");
  }

  return collection(db, "users", user.uid, "transactions");
}

// Carrega as transações salvas na nuvem.
export async function carregarTransacoes() {
  const resultado = await getDocsFromServer(minhasTransacoes());

  return resultado.docs.map((documento) => ({
    ...documento.data(),
    id: documento.id
  }));
}

// Salva uma transação no espaço da sua conta.
export async function salvarTransacao(transacao) {
  const referencia = doc(minhasTransacoes(), transacao.id);
  await setDoc(referencia, transacao);
}

// Exclui somente a transação indicada.
export async function excluirTransacao(id) {
  const referencia = doc(minhasTransacoes(), id);
  await deleteDoc(referencia);
}
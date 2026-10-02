import { app } from "./firebase-config.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const button = document.getElementById("google-login");
const status = document.getElementById("login-status");

// Aguarda o Firebase verificar se já existe uma sessão.
button.disabled = true;
status.textContent = "Verificando sua conta…";

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace("index.html");
    return;
  }

  button.disabled = false;
  status.textContent = "";
});

// Abre o Google quando você clica no botão.
button.addEventListener("click", async () => {
  button.disabled = true;
  status.textContent = "Abrindo o Google…";

  try {
    await signInWithPopup(auth, provider);
    // O observador acima detecta o login e abre o painel.
  } catch (error) {
    status.textContent =
      error.code === "auth/popup-closed-by-user"
        ? "Login cancelado. Você pode tentar novamente."
        : `Não foi possível entrar (${error.code}).`;

    button.disabled = false;
    console.error(error);
  }
});
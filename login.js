// === FUNÇÕES DE CARREGAMENTO ===
function mostrarCarregando() {
  document.getElementById("loading-overlay").style.display = "flex";
}

function esconderCarregando() {
  document.getElementById("loading-overlay").style.display = "none";
}

// === LOGIN ===
document.getElementById("auth-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  mostrarCarregando();

  fetch("https://script.google.com/macros/s/AKfycbwiag2HeetqnZQvBqB31uiVQuuL7j-epCIqcgYLsGfzez7K0rvIY_bgWuPgLsqVO4Aa/exec", {
    method: "POST",
    body: new URLSearchParams({
      usuario,
      senha,
      acao: "validar"
    })
  })
    .then(response => response.text())
    .then(data => {
      esconderCarregando();
      if (data === "Login válido") {
        window.location.href = "saida.html";
      } else {
        alert(data);
      }
    })
    .catch(error => {
      esconderCarregando();
      console.error("Erro ao validar login:", error);
      alert("Erro ao validar login.");
    });
});

// === ABRIR POPUP DE CADASTRO ===
document.getElementById("create-user-link").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("popup-cadastro").style.display = "flex";
});

// === FECHAR POPUP MANUALMENTE ===
document.getElementById("fechar-popup").addEventListener("click", function () {
  document.getElementById("popup-cadastro").style.display = "none";
});

// === CADASTRAR NOVO USUÁRIO ===
document.getElementById("btn-cadastrar").addEventListener("click", function () {
  const usuario = document.getElementById("novo-usuario").value.trim();
  const senha = document.getElementById("nova-senha").value.trim();

  if (!usuario || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  mostrarCarregando();

  fetch("https://script.google.com/macros/s/AKfycbwiag2HeetqnZQvBqB31uiVQuuL7j-epCIqcgYLsGfzez7K0rvIY_bgWuPgLsqVO4Aa/exec", {
    method: "POST",
    body: new URLSearchParams({
      usuario,
      senha,
      acao: "criar"
    })
  })
    .then(response => response.text())
    .then(data => {
      esconderCarregando();
      alert(data);
      document.getElementById("popup-cadastro").style.display = "none";
      document.getElementById("novo-usuario").value = "";
      document.getElementById("nova-senha").value = "";
    })
    .catch(error => {
      esconderCarregando();
      console.error("Erro ao criar usuário:", error);
      alert("Erro ao criar usuário.");
    });
});

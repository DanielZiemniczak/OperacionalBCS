const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbz6U7B6q5AwYdAc0a6Hx_wHqq8cZvtP2GTVv8anj7zD6Rdoju_xs7-NVcvusrewqdKaVQ/exec";

const form = document.getElementById("equip-form");
const grupoInput = document.getElementById("grupo");
const nomeInput = document.getElementById("nome");
const codigoInput = document.getElementById("codigo");
const valorInput = document.getElementById("valor");
const gruposMenu = document.getElementById("grupos-menu");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const grupo = grupoInput.value.trim();
  const nome = nomeInput.value.trim();
  const codigo = codigoInput.value.trim();
  const valor = valorInput.value.trim();

  if (grupo && nome && codigo && valor) {
    const formData = new FormData();
    formData.append("acao", "adicionar");
    formData.append("grupo", grupo);
    formData.append("nome", nome);
    formData.append("codigo", codigo);
    formData.append("valor", valor);

    fetch(WEBAPP_URL, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        alert("Equipamento cadastrado com sucesso!");
        form.reset();
        carregarEquipamentosPorGrupo();
      })
      .catch(() => alert("Erro ao cadastrar"));
  }
});

function carregarEquipamentosPorGrupo() {
  fetch(WEBAPP_URL)
    .then(res => res.json())
    .then(data => {
      const grupos = {};
      data.forEach(item => {
        if (!grupos[item.grupo]) grupos[item.grupo] = [];
        grupos[item.grupo].push(item);
      });

      gruposMenu.innerHTML = "";

      for (const grupo in grupos) {
        const grupoDiv = document.createElement("div");
        grupoDiv.className = "grupo-bloco";

        const titulo = document.createElement("h3");
        titulo.textContent = `▶ ${grupo}`;
        titulo.className = "grupo-titulo";
        titulo.onclick = () => {
          const lista = grupoDiv.querySelector("ul");
          const isExpanded = lista.classList.contains("expanded");
          lista.classList.toggle("expanded");
          titulo.textContent = `${isExpanded ? "▶" : "▼"} ${grupo}`;
        };
        grupoDiv.appendChild(titulo);

        const ul = document.createElement("ul");

        grupos[grupo].forEach(equip => {
          const li = document.createElement("li");
          li.textContent = `${equip.codigo} - ${equip.nome} (R$ ${equip.valor})`;

          const editBtn = document.createElement("button");
          editBtn.textContent = "✏️";
          editBtn.onclick = () => {
            const novoGrupo = prompt("Novo grupo:", equip.grupo);
            const novoNome = prompt("Novo nome:", equip.nome);
            const novoCodigo = prompt("Novo código:", equip.codigo);
            const novoValor = prompt("Novo valor:", equip.valor);
            if (novoGrupo && novoNome && novoCodigo && novoValor) {
              editarEquipamento(equip.codigo, novoGrupo, novoNome, novoCodigo, novoValor);
            }
          };

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "⌫";
          deleteBtn.onclick = () => {
            if (confirm("Confirmar exclusão?")) {
              excluirEquipamento(equip.codigo);
            }
          };

          li.appendChild(editBtn);
          li.appendChild(deleteBtn);
          ul.appendChild(li);
        });

        grupoDiv.appendChild(ul);
        gruposMenu.appendChild(grupoDiv);
      }
    })
    .catch(() => {
      gruposMenu.innerHTML = "<p>Erro ao carregar os dados.</p>";
    });
}

function editarEquipamento(codigoOriginal, novoGrupo, novoNome, novoCodigo, novoValor) {
  const url = `${WEBAPP_URL}?acao=editar&codigoOriginal=${encodeURIComponent(codigoOriginal)}&grupo=${encodeURIComponent(novoGrupo)}&nome=${encodeURIComponent(novoNome)}&codigo=${encodeURIComponent(novoCodigo)}&valor=${encodeURIComponent(novoValor)}`;
  fetch(url, { method: "POST" })
    .then(() => {
      alert("Equipamento editado!");
      carregarEquipamentosPorGrupo();
    });
}

function excluirEquipamento(codigo) {
  const url = `${WEBAPP_URL}?acao=excluir&codigo=${encodeURIComponent(codigo)}`;
  fetch(url, { method: "POST" })
    .then(() => {
      alert("Equipamento excluído!");
      carregarEquipamentosPorGrupo();
    });
}

carregarEquipamentosPorGrupo();

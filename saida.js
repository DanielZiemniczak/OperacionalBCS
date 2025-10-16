// Página de seleção de equipamentos
if (window.location.pathname.includes("selecao.html")) {
  const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbz6U7B6q5AwYdAc0a6Hx_wHqq8cZvtP2GTVv8anj7zD6Rdoju_xs7-NVcvusrewqdKaVQ/exec";
  const container = document.getElementById("grupos-container");
  const selecionados = new Set();

  fetch(WEBAPP_URL)
    .then(res => res.json())
    .then(equipamentos => {
      localStorage.setItem("todosEquipamentos", JSON.stringify(equipamentos));

      const grupos = {};
      equipamentos.forEach(e => {
        if (!grupos[e.grupo]) grupos[e.grupo] = [];
        grupos[e.grupo].push(e);
      });

      for (const grupo in grupos) {
        const bloco = document.createElement("div");
        bloco.className = "grupo-bloco";

        const titulo = document.createElement("h3");
        titulo.className = "grupo-titulo";
        titulo.textContent = `▶ ${grupo}`;
        bloco.appendChild(titulo);

        const ul = document.createElement("ul");

        grupos[grupo].forEach(equip => {
          const li = document.createElement("li");
          li.className = "linha-equipamento";
          li.dataset.codigo = equip.codigo;
          li.innerHTML = `
            <span>${equip.codigo}</span>
            <span>${equip.nome}</span>
            <span>R$ ${equip.valor}</span>
          `;
          li.onclick = () => {
            li.classList.toggle("selecionado");
            if (selecionados.has(equip.codigo)) {
              selecionados.delete(equip.codigo);
            } else {
              selecionados.add(equip.codigo);
            }
          };
          ul.appendChild(li);
        });

        titulo.onclick = () => {
          ul.classList.toggle("expanded");
          titulo.textContent = ul.classList.contains("expanded") ? `▼ ${grupo}` : `▶ ${grupo}`;
        };

        bloco.appendChild(ul);
        container.appendChild(bloco);
      }
    });

  document.getElementById("confirmar-selecao").onclick = () => {
    localStorage.setItem("equipamentosSelecionados", JSON.stringify([...selecionados]));

    const destino = localStorage.getItem("saidaDestino");
    const responsavel = localStorage.getItem("saidaResponsavel");
    const data = localStorage.getItem("saidaData");
    const todosEquipamentos = JSON.parse(localStorage.getItem("todosEquipamentos") || "[]");

    const dadosDaSaida = {
      destino,
      responsavel,
      data,
      codigos: [...selecionados],
      todosEquipamentos
    };

    // Mostra popup antes de gerar o PDF
    alert("O arquivo PDF está sendo gerado e será salvo na pasta Downloads do seu dispositivo.");

    gerarPDFSaida(dadosDaSaida);

    alert("Saída registrada com sucesso!");
    window.location.href = "saida.html";
  };

  function gerarPDFSaida(dados) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const equipamentos = dados.codigos.map(codigo => {
    const equip = dados.todosEquipamentos.find(e => e.codigo === codigo);
    return {
      grupo: equip.grupo,
      codigo: equip.codigo,
      nome: equip.nome,
      valor: parseFloat(equip.valor || 0)
    };
  });

  const totalPorGrupo = {};
  const quantidadePorGrupo = {};
  let valorTotal = 0;

  equipamentos.forEach(e => {
    if (!totalPorGrupo[e.grupo]) totalPorGrupo[e.grupo] = 0;
    if (!quantidadePorGrupo[e.grupo]) quantidadePorGrupo[e.grupo] = 0;
    totalPorGrupo[e.grupo] += e.valor;
    quantidadePorGrupo[e.grupo] += 1;
    valorTotal += e.valor;
  });

  // Título principal
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo Saída", 105, 20,);

  // Informações gerais
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Destino: ${dados.destino}`, 20, 35);
  doc.text(`Responsável: ${dados.responsavel}`, 20, 42);
  doc.text(`Data: ${dados.data}`, 20, 49);
  doc.text(`Valor total da NFS: R$ ${valorTotal.toFixed(2)}`, 20, 56);

  // Resumo por grupo
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo para NFS", 20, 70);

  const resumoData = Object.keys(totalPorGrupo).map(grupo => [
    grupo,
    quantidadePorGrupo[grupo],
    `R$ ${totalPorGrupo[grupo].toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 75,
    head: [["GRUPO", "QUANTIDADE", "VALOR POR GRUPO"]],
    body: resumoData,
    styles: { fontSize: 11 },
    headStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: "bold" },
    margin: { left: 20, right: 20 }
  });

  // Listagem detalhada
  const equipamentosData = equipamentos.map(e => [
    e.nome,
    e.codigo,
    `R$ ${e.valor.toFixed(2)}`
  ]);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Listagem Detalhada", 20, doc.lastAutoTable.finalY + 15);

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [["NOME", "CÓDIGO", "VALOR UNITÁRIO"]],
    body: equipamentosData,
    styles: { fontSize: 11 },
    headStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: "bold" },
    margin: { left: 20, right: 20 }
  });

  doc.save("saida-equipamentos.pdf");
}
}

// Página de registro de saída
if (document.getElementById("saida-form")) {
  const form = document.getElementById("saida-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const destino = document.getElementById("destino").value.trim();
    const responsavel = document.getElementById("responsavel").value.trim();
    const data = document.getElementById("data-saida").value;

    if (!destino || !responsavel || !data) return;

    localStorage.setItem("saidaDestino", destino);
    localStorage.setItem("saidaResponsavel", responsavel);
    localStorage.setItem("saidaData", data);

    window.location.href = "selecao.html";
  });
}

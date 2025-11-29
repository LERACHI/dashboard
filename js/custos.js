(function(){
  const cost = window.costData || {};

  const recurringBody = document.getElementById("recurringBody");
  const packagesGrid = document.getElementById("packagesGrid");
  const resumoBody = document.getElementById("resumoBody");
  const scriptsList = document.getElementById("scriptsList");
  const followupList = document.getElementById("followupList");
  const feeUnicoEl = document.getElementById("feeUnico");

  function renderRecorrentes(){
    if (!recurringBody || !cost.recorrentes) return;
    recurringBody.innerHTML = "";
    cost.recorrentes.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${item.categoria}</strong></td>
        <td>${item.descricao}</td>
        <td>${item.preco}</td>
      `;
      recurringBody.appendChild(tr);
    });
  }

  function renderPacotes(){
    if (!packagesGrid || !cost.pacotes) return;
    packagesGrid.innerHTML = "";
    cost.pacotes.forEach(pkg => {
      const card = document.createElement("div");
      card.className = "card pricing-card";
      card.innerHTML = `
        <h3>${pkg.nome}</h3>
        <p class="muted">Público: ${pkg.publico}</p>
        <p>${pkg.inclui}</p>
        <p><strong>Preço sugerido:</strong> ${pkg.preco}</p>
      `;
      packagesGrid.appendChild(card);
    });
  }

  function renderResumos(){
    if (!resumoBody || !cost.resumosCliente) return;
    resumoBody.innerHTML = "";
    cost.resumosCliente.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.cliente}</td>
        <td>${row.criacao}</td>
        <td>${row.manutencao}</td>
        <td>${row.foco}</td>
      `;
      resumoBody.appendChild(tr);
    });
  }

  function renderScripts(){
    if (!scriptsList || !cost.scriptsCusto) return;
    scriptsList.innerHTML = "";
    Object.entries(cost.scriptsCusto).forEach(([key, texto]) => {
      const li = document.createElement("li");
      li.textContent = texto;
      scriptsList.appendChild(li);
    });
  }

  function renderFollowups(){
    if (!followupList || !cost.followups) return;
    followupList.innerHTML = "";
    cost.followups.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${item.titulo}:</strong> ${item.mensagem}`;
      followupList.appendChild(li);
    });
  }

  if (feeUnicoEl && cost.feeUnico) {
    feeUnicoEl.textContent = cost.feeUnico.faixa;
  }

  renderRecorrentes();
  renderPacotes();
  renderResumos();
  renderScripts();
  renderFollowups();
})();

(function(){
  const leads = window.leadsData || [];
  const tbody = document.querySelector("#strategyTable tbody");

  function openWA(estabelecimento, mensagem) {
    const texto = `${mensagem}\n(${estabelecimento})`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }

  function renderRows(){
    tbody.innerHTML = "";
    leads.forEach(item => {
      const tr = document.createElement("tr");
      const tagClass = item.potencial === "Altíssimo" ? "tag veryhigh" : "tag high";
      tr.innerHTML = `
        <td><strong>${item.estabelecimento}</strong></td>
        <td>${item.status_online}</td>
        <td>
          <span class="${tagClass}">${item.potencial}</span><br />
          <span class="small">${item.potencial_detalhe}</span>
        </td>
        <td></td>
      `;
      const actionCell = tr.querySelector("td:last-child");
      const btn = document.createElement("button");
      btn.className = "wa-btn";
      btn.textContent = "WhatsApp";
      btn.addEventListener("click", () => openWA(item.estabelecimento, item.pitch));
      actionCell.appendChild(btn);
      tbody.appendChild(tr);
    });
  }

  renderRows();
})();

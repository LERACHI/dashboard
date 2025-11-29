// Renderiza cartões de leads usando a fonte de dados compartilhada
(function(){
  const grid = document.getElementById("cardsGrid");
  const leads = window.leadsData || [];

  function openWA(estabelecimento, mensagem) {
    const texto = `${mensagem}\n(${estabelecimento})`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }

  function renderCards(){
    grid.innerHTML = "";

    leads.forEach(item => {
      const tagClass = item.potencial === "Altíssimo" ? "tag veryhigh" : "tag high";
      const card = document.createElement("div");
      card.className = "card lead-card";
      card.innerHTML = `
        <div class="card-head">
          <h3>${item.estabelecimento}</h3>
          <span class="${tagClass}">${item.potencial}</span>
        </div>
        <p class="muted">Status indicado: <strong>${item.status_online}</strong></p>
        <p>Potencial: ${item.potencial_detalhe}</p>
        <p>Dor: ${item.tipo_dor}</p>
        <p>Pitch: ${item.pitch}</p>
        <div class="card-actions"></div>
      `;

      const actions = card.querySelector(".card-actions");
      const btn = document.createElement("button");
      btn.className = "wa-btn";
      btn.textContent = "WhatsApp";
      btn.addEventListener("click", () => openWA(item.estabelecimento, item.pitch));
      actions.appendChild(btn);

      grid.appendChild(card);
    });
  }

  renderCards();
})();

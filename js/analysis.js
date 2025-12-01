(function(){
  const grid = document.getElementById("analysisGrid");
  const leads = window.leadsData || [];

  function openWA(estabelecimento, mensagem) {
    const texto = `${mensagem}\n(${estabelecimento})`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }

  function renderCards(){
    grid.innerHTML = "";
    leads.forEach(item => {
      const card = document.createElement("div");
      card.className = "card analysis-card";
      const tagClass = item.potencial === "Altíssimo" ? "tag veryhigh" : "tag high";
      card.innerHTML = `
        <div class="card-head">
          <h3>${item.estabelecimento}</h3>
          <span class="${tagClass}">${item.potencial}</span>
        </div>
        <p class="muted">${item.status_online}</p>
        <div class="callout-block">
          <strong>Potencial detalhado:</strong>
          <p>${item.potencial_detalhe || "-"}</p>
          <strong>Dor atual:</strong>
          <p>${item.tipo_dor || "-"}</p>
          <strong>Status Atual:</strong>
          <p>${item.status_atual || "-"}</p>
          <strong>Oportunidade:</strong>
          <p>${item.oportunidade || "-"}</p>
          <strong>Análise:</strong>
          <p>${item.analise || "-"}</p>
          <strong>Pitch/CTA:</strong>
          <p>${item.pitch || "-"}</p>
          <strong>Sua Proposta:</strong>
          <p>${item.proposta || "-"}</p>
        </div>
        <div class="card-actions"></div>
      `;

      const actions = card.querySelector(".card-actions");
      const btn = document.createElement("button");
      btn.className = "wa-btn";
      btn.textContent = "Enviar no WhatsApp";
      btn.addEventListener("click", () => openWA(item.estabelecimento, item.proposta));
      actions.appendChild(btn);

      grid.appendChild(card);
    });
  }

  renderCards();
})();

(function(){
  const leads = window.leadsData || [];
  const grid = document.getElementById("contactGrid");

  function openWA(estabelecimento, texto) {
    const url = `https://wa.me/?text=${encodeURIComponent(texto + "\n(" + estabelecimento + ")")}`;
    window.open(url, "_blank");
  }

  async function copyText(texto){
    try {
      await navigator.clipboard.writeText(texto);
      alert("Mensagem copiada!");
    } catch (e) {
      alert("Não foi possível copiar. Copie manualmente.");
    }
  }

  function render(){
    grid.innerHTML = "";
    leads.forEach(item => {
      const card = document.createElement("div");
      card.className = "card contact-card";
      card.innerHTML = `
        <div class="card-head">
          <h3>${item.estabelecimento}</h3>
          <span class="tag ${item.potencial === "Altíssimo" ? "veryhigh" : "high"}">${item.potencial}</span>
        </div>
        <p class="muted">Dor atual: ${item.cta.dor}</p>
        <p><strong>Solução:</strong> ${item.cta.solucao}</p>
        <p><strong>CTA:</strong> ${item.cta.pergunta}</p>
        <div class="cta-actions"></div>
      `;

      const actions = card.querySelector(".cta-actions");
      const copyBtn = document.createElement("button");
      copyBtn.className = "notes-btn";
      copyBtn.textContent = "Copiar mensagem";
      copyBtn.addEventListener("click", () => copyText(item.cta.mensagem));

      const sendBtn = document.createElement("button");
      sendBtn.className = "wa-btn";
      sendBtn.textContent = "Abrir no WhatsApp";
      sendBtn.addEventListener("click", () => openWA(item.estabelecimento, item.cta.mensagem));

      actions.appendChild(copyBtn);
      actions.appendChild(sendBtn);

      grid.appendChild(card);
    });
  }

  render();
})();

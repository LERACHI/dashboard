(function(){
  const leads = window.leadsData || [];
  const tbody = document.querySelector("#strategyTable tbody");

  function openWA(estabelecimento, mensagem) {
    const texto = `${mensagem}\n(${estabelecimento})`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }

  function renderRows(){
    if (!tbody) return;
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

  // --- Simulacao de economia ---
  const simInputs = {
    pedidosDia: document.getElementById("simPedidosDia"),
    ticket: document.getElementById("simTicket"),
    taxaPlataforma: document.getElementById("simTaxaPlataforma"),
    conversaoSite: document.getElementById("simConversaoSite"),
    custoSite: document.getElementById("simCustoSite"),
    custoAnota: document.getElementById("simCustoAnota")
  };

  const simOutputs = {
    pedidosMes: document.getElementById("simPedidosMes"),
    pedidosMigrados: document.getElementById("simPedidosMigrados"),
    faturamento: document.getElementById("simFaturamentoMigrado"),
    economiaBruta: document.getElementById("simEconomiaBruta"),
    economiaLiquida: document.getElementById("simEconomiaLiquida"),
    resumoCustos: document.getElementById("simResumoCustos")
  };

  const simCtx = document.getElementById("simChart");
  let simChart = null;

  function toNumber(value) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : 0;
  }

  function money(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function wholeNumber(value) {
    return Math.round(value).toLocaleString("pt-BR");
  }

  function updateSimChart(dataset) {
    if (!simCtx) return;
    if (simChart) simChart.destroy();

    simChart = new Chart(simCtx, {
      type: "bar",
      data: {
        labels: ["Faturamento migrado", "Economia bruta", "Economia liquida"],
        datasets: [{
          label: "Resultados (R$)",
          data: dataset,
          backgroundColor: ["#06b6d4", "#8b5cf6", "#10b981"],
          borderRadius: 10
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#cbd5e1" },
            grid: { color: "rgba(255,255,255,0.08)" }
          },
          x: {
            ticks: { color: "#cbd5e1" },
            grid: { display: false }
          }
        }
      }
    });
  }

  function updateSimulation() {
    if (!simInputs.pedidosDia) return;

    const pedidosDia = toNumber(simInputs.pedidosDia.value);
    const ticket = toNumber(simInputs.ticket.value);
    const taxaPlataforma = toNumber(simInputs.taxaPlataforma.value) / 100;
    const conversao = toNumber(simInputs.conversaoSite.value) / 100;
    const custoSite = toNumber(simInputs.custoSite.value);
    const custoAnota = toNumber(simInputs.custoAnota.value);

    const pedidosMes = pedidosDia * 30;
    const pedidosMigrados = pedidosMes * conversao;
    const faturamentoMigrado = pedidosMigrados * ticket;
    const economiaBruta = faturamentoMigrado * taxaPlataforma;
    const economiaLiquida = economiaBruta - custoSite - custoAnota;

    simOutputs.pedidosMes.textContent = wholeNumber(pedidosMes);
    simOutputs.pedidosMigrados.textContent = wholeNumber(pedidosMigrados);
    simOutputs.faturamento.textContent = money(faturamentoMigrado);
    simOutputs.economiaBruta.textContent = money(economiaBruta);
    simOutputs.economiaLiquida.textContent = money(economiaLiquida);
    simOutputs.resumoCustos.textContent = `- ${money(custoSite)} site | - ${money(custoAnota)} Anota AI`;

    updateSimChart([faturamentoMigrado, economiaBruta, economiaLiquida]);
  }

  function initSimulation() {
    if (!simInputs.pedidosDia) return;
    Object.values(simInputs).forEach(input => {
      if (!input) return;
      input.addEventListener("input", updateSimulation);
    });
    updateSimulation();
  }

  initSimulation();
})();

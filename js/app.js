/* ------------------------------------------------------------
   BLOCO 1 - BASE DE DADOS
------------------------------------------------------------ */

const leads = window.leadsData || [];

/* ------------------------------------------------------------
   BLOCO 2 - WHATSAPP E CONTROLES
------------------------------------------------------------ */

function openWA(estabelecimento, mensagem) {
  const texto = `${mensagem}\n(${estabelecimento})`;
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
}

const filterPot = document.getElementById("filterPot");
const search = document.getElementById("search");
const resetBtn = document.getElementById("reset");
const exportBtn = document.getElementById("exportCSV");
const tableBody = document.querySelector("#leadsTable tbody");
const detailGrid = document.getElementById("filteredDetails");
const packSuggestions = document.getElementById("packSuggestions");

filterPot.addEventListener("change", applyFilters);
search.addEventListener("input", applyFilters);

function normalize(texto){
  return (texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function applyFilters() {
  let arr = [...leads];

  if (filterPot.value !== "Todos") {
    arr = arr.filter(item => normalize(item.potencial) === normalize(filterPot.value));
  }

  if (search.value.trim() !== "") {
    arr = arr.filter(item =>
      item.estabelecimento.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  renderTable(arr);
  updateSummary(arr);
  updateChart(arr);
  renderDetails(arr);
  renderPacks(arr);
}

resetBtn.onclick = () => {
  filterPot.value = "Todos";
  search.value = "";
  applyFilters();
};

exportBtn.onclick = () => {
  let csv = "Estabelecimento,Status,Potencial,Dor,Pitch\n";
  leads.forEach(r => {
    csv += `${r.estabelecimento},${r.status_online},${r.potencial},${r.tipo_dor},${r.pitch}\n`;
  });

  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = "clientes_gastronomia.csv";
  a.click();
};

function updateSummary(arr) {
  document.getElementById("totalCount").innerText = arr.length;
  document.getElementById("countVeryHigh").innerText =
    arr.filter(r => normalize(r.potencial) === "Altissimo").length;
  document.getElementById("countHigh").innerText =
    arr.filter(r => normalize(r.potencial) === "Alto").length;
}

/* ------------------------------------------------------------
   BLOCO 3 - RENDERIZACAO DA TABELA + BOTAO DE NOTAS
------------------------------------------------------------ */

function renderTable(arr){
  tableBody.innerHTML = "";

  arr.forEach(r => {
    const cls = normalize(r.potencial) === "Altissimo" ? "tag veryhigh" : "tag high";

    tableBody.innerHTML += `
      <tr>
        <td><strong>${r.estabelecimento}</strong></td>
        <td>${r.status_online}</td>
        <td><span class="${cls}">${r.potencial}</span></td>
        <td>${r.tipo_dor}</td>
        <td>${r.pitch}</td>
        <td>
          <button class="notes-btn" onclick="openNotes('${r.estabelecimento}')">
            📝 Nota
          </button>
        </td>
      </tr>
    `;
  });
}

/* ------------------------------------------------------------
   BLOCO 4 - GRAFICO (Chart.js)
------------------------------------------------------------ */

let chart;

function updateChart(arr){
  const counts = {
    Altissimo: arr.filter(r => normalize(r.potencial) === "Altissimo").length,
    Alto: arr.filter(r => normalize(r.potencial) === "Alto").length
  };

  const ctx = document.getElementById("potChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Altissimo", "Alto"],
      datasets: [{
        label: "Quantidade",
        data: [counts.Altissimo, counts.Alto],
        backgroundColor: ["#ec4899", "#06b6d4"],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
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

/* ------------------------------------------------------------
   BLOCO 5 - SISTEMA DE NOTAS (LOCALSTORAGE)
------------------------------------------------------------ */

const notesModal = document.getElementById("notesModal");
const notesText = document.getElementById("notesText");
const notesTitle = document.getElementById("notesTitle");
const saveNoteBtn = document.getElementById("saveNote");
const closeModalBtn = document.getElementById("closeModal");

let currentNoteKey = null;

function openNotes(estabelecimento) {
  currentNoteKey = "nota_" + estabelecimento.replace(/\s+/g, "_");

  const saved = localStorage.getItem(currentNoteKey) || "";

  notesText.value = saved;
  notesTitle.innerHTML = `Notas - <b>${estabelecimento}</b>`;
  notesModal.classList.add("active");
}

saveNoteBtn.addEventListener("click", () => {
  if (!currentNoteKey) return;

  localStorage.setItem(currentNoteKey, notesText.value);

  notesModal.classList.remove("active");
});

closeModalBtn.addEventListener("click", () => {
  notesModal.classList.remove("active");
});

/* ------------------------------------------------------------
   BLOCO 6 - DETALHES DO FILTRO
------------------------------------------------------------ */

function renderDetails(arr){
  if (!detailGrid) return;
  if (!arr.length) {
    detailGrid.innerHTML = `<p class="small muted">Nenhum resultado encontrado com esse filtro.</p>`;
    return;
  }

  detailGrid.innerHTML = "";
  arr.forEach(item => {
    const card = document.createElement("div");
    card.className = "card detail-card";
    card.innerHTML = `
      <div class="card-head">
        <h3>${item.estabelecimento}</h3>
        <span class="tag ${normalize(item.potencial) === "Altissimo" ? "veryhigh" : "high"}">${item.potencial}</span>
      </div>
      <p class="muted">${item.status_online || ""}</p>
      <p><strong>Dor:</strong> ${item.tipo_dor || "-"}</p>
      <p><strong>Pitch/CTA:</strong> ${item.pitch || "-"}</p>
      <p><strong>Status atual:</strong> ${item.status_atual || "-"}</p>
      <p><strong>Oportunidade:</strong> ${item.oportunidade || "-"}</p>
      <p><strong>Analise:</strong> ${item.analise || "-"}</p>
      <p><strong>Proposta:</strong> ${item.proposta || "-"}</p>
    `;
    detailGrid.appendChild(card);
  });
}

function renderPacks(arr){
  if (!packSuggestions) return;
  const resumos = window.costData?.resumosCliente || [];
  if (!arr.length) {
    packSuggestions.innerHTML = `<p class="small muted">Nenhum lead filtrado.</p>`;
    return;
  }

  packSuggestions.innerHTML = "";

  const normalizeName = (str) => normalize(str || "").toLowerCase();

  arr.forEach(item => {
    const nomeLead = normalizeName(item.estabelecimento);
    const match = resumos.find(r => nomeLead.includes(normalizeName(r.cliente)));
    if (!match) return;

    const card = document.createElement("div");
    card.className = "card pricing-card";
    card.innerHTML = `
      <h3>${match.cliente}</h3>
      <p><strong>Criação:</strong> ${match.criacao}</p>
      <p><strong>Manutenção:</strong> ${match.manutencao}</p>
      <p class="small">${match.foco}</p>
    `;
    packSuggestions.appendChild(card);
  });

  if (!packSuggestions.children.length) {
    packSuggestions.innerHTML = `<p class="small muted">Sem pacote sugerido para esses leads.</p>`;
  }
}

/* ------------------------------------------------------------
   BLOCO 7 - INICIALIZACAO
------------------------------------------------------------ */

applyFilters();

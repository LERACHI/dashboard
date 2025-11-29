/* ------------------------------------------------------------
   BLOCO 1 — BASE DE DADOS
------------------------------------------------------------ */

const leads = [
  {
    estabelecimento: "Tio Gil Lanches",
    status_online: "iFood",
    potencial: "Altíssimo",
    tipo_dor: "Alta dependência de iFood",
    pitch: "Você pode economizar taxas com pedidos diretos"
  },
  {
    estabelecimento: "Dom Garcia",
    status_online: "Site WordPress antigo",
    potencial: "Altíssimo",
    tipo_dor: "Site desatualizado",
    pitch: "Atualização profissional e moderna aumenta pedidos"
  },
  {
    estabelecimento: "2 Brothers",
    status_online: "Cardápio digital genérico",
    potencial: "Alto",
    tipo_dor: "Identidade visual fraca",
    pitch: "Site-cardápio mais bonito aumenta percepção de valor"
  },
  {
    estabelecimento: "Tio Sogro",
    status_online: "Site pouco utilizado",
    potencial: "Altíssimo",
    tipo_dor: "Baixa conversão",
    pitch: "Análise gratuita e otimização"
  }
];
/* ------------------------------------------------------------
   BLOCO 2 — FUNÇÕES DE FILTRO, BUSCA, RESUMO E EXPORTAÇÃO
------------------------------------------------------------ */

const filterPot = document.getElementById("filterPot");
const search = document.getElementById("search");
const resetBtn = document.getElementById("reset");
const exportBtn = document.getElementById("exportCSV");
const tableBody = document.querySelector("#leadsTable tbody");

function applyFilters() {
  let arr = [...leads];

  if (filterPot.value !== "Todos") {
    arr = arr.filter(item => item.potencial === filterPot.value);
  }

  if (search.value.trim() !== "") {
    arr = arr.filter(item =>
      item.estabelecimento.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  renderTable(arr);
  updateSummary(arr);
  updateChart(arr);
}

resetBtn.onclick = () => {
  filterPot.value = "Todos";
  search.value = "";
  applyFilters();
};

/* EXPORTAR CSV */
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

/* RESUMO */
function updateSummary(arr) {
  document.getElementById("totalCount").innerText = arr.length;
  document.getElementById("countVeryHigh").innerText =
    arr.filter(r => r.potencial === "Altíssimo").length;
  document.getElementById("countHigh").innerText =
    arr.filter(r => r.potencial === "Alto").length;
}
/* ------------------------------------------------------------
   BLOCO 3 — RENDERIZAÇÃO DA TABELA + BOTÃO DE NOTAS
------------------------------------------------------------ */

function renderTable(arr){
  tableBody.innerHTML = "";

  arr.forEach(r => {
    const cls = r.potencial === "Altíssimo" ? "tag veryhigh" : "tag high";

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
   BLOCO 4 — GRÁFICO (Chart.js)
------------------------------------------------------------ */

let chart;

function updateChart(arr){
  const counts = {
    Altíssimo: arr.filter(r => r.potencial === "Altíssimo").length,
    Alto: arr.filter(r => r.potencial === "Alto").length
  };

  const ctx = document.getElementById("potChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Altíssimo", "Alto"],
      datasets: [{
        label: "Quantidade",
        data: [counts.Altíssimo, counts.Alto]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}
/* ------------------------------------------------------------
   BLOCO 5 — SISTEMA DE NOTAS (LOCALSTORAGE)
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
  notesTitle.innerHTML = "Notas — <b>" + estabelecimento + "</b>";
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
   BLOCO 6 — INICIALIZAÇÃO
------------------------------------------------------------ */

applyFilters();

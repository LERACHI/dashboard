(function(){
  const leads = window.leadsData || [];

  const totalEl = document.getElementById("sumTotal");
  const veryHighEl = document.getElementById("sumVeryHigh");
  const highEl = document.getElementById("sumHigh");

  const counts = {
    Altíssimo: leads.filter(l => l.potencial === "Altíssimo").length,
    Alto: leads.filter(l => l.potencial === "Alto").length
  };

  totalEl.textContent = leads.length;
  veryHighEl.textContent = counts.Altíssimo;
  highEl.textContent = counts.Alto;

  const ctx = document.getElementById("summaryChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Altíssimo", "Alto"],
      datasets: [{
        data: [counts.Altíssimo, counts.Alto],
        backgroundColor: ["#ec4899", "#06b6d4"],
        borderWidth: 0
      }]
    },
    options: {
      plugins: { legend: { position: "bottom", labels: { color: "#e2e8f0" } } }
    }
  });
})();

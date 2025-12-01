(function(){
  const leads = window.leadsData || [];
  const grid = document.getElementById("contactGrid");
  const notesModal = document.getElementById("notesModal");
  const notesText = document.getElementById("notesText");
  const notesTitle = document.getElementById("notesTitle");
  const saveNoteBtn = document.getElementById("saveNote");
  const closeModalBtn = document.getElementById("closeModal");
  let currentNoteKey = null;

  function openNotes(estabelecimento) {
    currentNoteKey = "nota_contato_" + estabelecimento.replace(/\s+/g, "_");
    const saved = localStorage.getItem(currentNoteKey) || "";
    notesText.value = saved;
    notesTitle.innerHTML = `Notas - <b>${estabelecimento}</b>`;
    notesModal.classList.add("active");
  }

  function render(){
    if (!grid) return;
    grid.innerHTML = "";
    leads.forEach(item => {
      const card = document.createElement("div");
      card.className = "card contact-card";
      const tagClass = item.potencial === "Altíssimo" ? "tag veryhigh" : "tag high";
      card.innerHTML = `
        <div class="card-head">
          <h3>${item.estabelecimento}</h3>
          <span class="${tagClass}">${item.potencial}</span>
        </div>
        <div class="cta-actions"></div>
      `;

      const actions = card.querySelector(".cta-actions");
      const noteBtn = document.createElement("button");
      noteBtn.className = "notes-btn";
      noteBtn.textContent = "Nota";
      noteBtn.addEventListener("click", () => openNotes(item.estabelecimento));
      actions.appendChild(noteBtn);

      grid.appendChild(card);
    });
  }

  saveNoteBtn.addEventListener("click", () => {
    if (!currentNoteKey) return;
    localStorage.setItem(currentNoteKey, notesText.value);
    notesModal.classList.remove("active");
  });

  closeModalBtn.addEventListener("click", () => {
    notesModal.classList.remove("active");
  });

  render();
})();

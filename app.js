const KEY = "her-closet-v1";

const categories = ["Tops", "Bas", "Vestes", "Chaussures", "Sacs", "Bijoux"];

const starter = {
  Tops: [
    ["Blouse crème", "🤍", "#e7ded2"],
    ["Pull bordeaux", "🧶", "#743e3d"],
    ["T-shirt blanc", "☁️", "#ece8e2"]
  ],
  Bas: [
    ["Jupe marron", "🤎", "#725344"],
    ["Jean bleu", "👖", "#8193a8"],
    ["Jupe crème", "✨", "#d9d1c7"]
  ],
  Vestes: [
    ["Trench beige", "🧥", "#b9a58f"],
    ["Veste cuir", "🧥", "#584a43"]
  ],
  Chaussures: [
    ["Bottes noires", "🥾", "#373331"],
    ["Baskets", "👟", "#e0dbd5"]
  ],
  Sacs: [
    ["Sac bordeaux", "👜", "#713f3c"],
    ["Sac noir", "👜", "#373331"]
  ],
  Bijoux: [
    ["Collier doré", "✧", "#c4a15d"],
    ["Boucles", "♡", "#bda77d"]
  ]
};

let savedData;

try {
  savedData = JSON.parse(localStorage.getItem(KEY));
} catch (e) {
  savedData = null;
}

let db = savedData || {
  clothes: starter,
  look: {
    Tops: 0,
    Bas: 0,
    Vestes: 0,
    Chaussures: 0,
    Sacs: 0,
    Bijoux: 0
  },
  saved: []
};

let currentCategory = "Tops";

function saveDatabase() {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function select(id) {
  return document.getElementById(id);
}

function showMessage(message) {
  const toast = select("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function renderCategories() {
  const container = select("categoryRow");

  if (!container) return;

  container.innerHTML = "";

  categories.forEach(category => {
    const button = document.createElement("button");

    button.className =
      "cat" + (category === currentCategory ? " active" : "");

    button.textContent = category;

    button.addEventListener("click", () => {
      currentCategory = category;

      renderCategories();
      renderTabs();
      renderItems();
    });

    container.appendChild(button);
  });

  let total = 0;

  categories.forEach(category => {
    total += db.clothes[category]?.length || 0;
  });

  select("itemCount").textContent =
    total + (total > 1 ? " pièces" : " pièce");
}

function renderTabs() {
  const container = select("tabs");

  if (!container) return;

  container.innerHTML = "";

  categories.forEach(category => {
    const button = document.createElement("button");

    button.className =
      "tab" + (category === currentCategory ? " active" : "");

    button.textContent = category;

    button.addEventListener("click", () => {
      currentCategory = category;

      renderTabs();
      renderItems();
    });

    container.appendChild(button);
  });
}

function renderItems() {
  const container = select("items");

  if (!container) return;

  container.innerHTML = "";

  const clothes = db.clothes[currentCategory] || [];

  clothes.forEach((item, index) => {
    const button = document.createElement("button");

    button.className =
      "cloth-item" +
      (db.look[currentCategory] === index ? " selected" : "");

    button.innerHTML = `
      <div class="swatch" style="background:${item[2]}">
        ${item[1]}
      </div>
      <small>${item[0]}</small>
    `;

    button.addEventListener("click", () => {
      db.look[currentCategory] = index;

      saveDatabase();
      renderItems();
      updateLook();
    });

    container.appendChild(button);
  });
}

function updateLook() {
  const top =
    db.clothes.Tops[db.look.Tops] ||
    ["Blouse", "", "#e7ded2"];

  const bottom =
    db.clothes.Bas[db.look.Bas] ||
    ["Jupe", "", "#725344"];

  const label = select("lookLabel");

  if (label) {
    label.textContent = `${top[0]} · ${bottom[0]}`;
  }

  const topOverlay = select("overlayTop");
  const bottomOverlay = select("overlayBottom");

  if (topOverlay) {
    topOverlay.style.background = top[2];
    topOverlay.style.top = "34%";
    topOverlay.style.height = "17%";
  }

  if (bottomOverlay) {
    bottomOverlay.style.background = bottom[2];
    bottomOverlay.style.top = "50%";
    bottomOverlay.style.height = "25%";
  }
}

function saveLook() {
  const top = db.clothes.Tops[db.look.Tops];
  const bottom = db.clothes.Bas[db.look.Bas];
  const shoes = db.clothes.Chaussures[db.look.Chaussures];

  db.saved.unshift({
    name: `${top[0]} + ${bottom[0]}`,
    emoji: `${top[1]} ${bottom[1]} ${shoes ? shoes[1] : "👟"}`
  });

  db.saved = db.saved.slice(0, 12);

  saveDatabase();
  renderSaved();

  showMessage("Look enregistré ♡");
}

function renderSaved() {
  const container = select("savedGrid");

  if (!container) return;

  container.innerHTML = "";

  if (db.saved.length === 0) {
    container.innerHTML =
      '<div class="empty">Tes looks préférés apparaîtront ici ♡</div>';
  }

  db.saved.forEach(look => {
    const card = document.createElement("div");

    card.className = "saved-card";

    card.innerHTML = `
      <div class="saved-preview">${look.emoji}</div>
      <p>${look.name}</p>
      <small>♡ favori</small>
    `;

    container.appendChild(card);
  });

  select("lookCount").textContent =
    db.saved.length +
    " sauvegardé" +
    (db.saved.length > 1 ? "s" : "");
}

function surpriseMe() {
  categories.forEach(category => {
    const list = db.clothes[category] || [];

    if (list.length > 0) {
      db.look[category] =
        Math.floor(Math.random() * list.length);
    }
  });

  saveDatabase();

  renderItems();
  updateLook();

  showMessage("Nouveau look créé ✨");
}

function resetLook() {
  categories.forEach(category => {
    db.look[category] = 0;
  });

  saveDatabase();

  renderItems();
  updateLook();

  showMessage("Tenue réinitialisée");
}

function openAddModal() {
  const modal = select("addModal");

  if (!modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeAddModal() {
  const modal = select("addModal");

  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

let selectedPhoto = null;

function setupPhotoInput() {
  const input = select("photoInput");

  if (!input) return;

  input.addEventListener("change", event => {
    const file = event.target.files?.[0];

    if (!file) return;

    selectedPhoto = file;

    const url = URL.createObjectURL(file);

    select("photoPreview").innerHTML =
      `<img src="${url}" alt="Vêtement sélectionné">`;
  });
}

function addClothing() {
  const nameInput = select("clothName");
  const categoryInput = select("clothCategory");

  const name =
    nameInput.value.trim() || "Nouvelle pièce";

  const category = categoryInput.value;

  if (!db.clothes[category]) {
    db.clothes[category] = [];
  }

  db.clothes[category].push([
    name,
    selectedPhoto ? "📷" : "♡",
    "#eee6de"
  ]);

  saveDatabase();

  renderCategories();
  renderTabs();
  renderItems();

  closeAddModal();

  nameInput.value = "";
  selectedPhoto = null;

  select("photoPreview").textContent = "📷";

  showMessage("Vêtement ajouté au dressing ✨");
}

function scrollToSection(id) {
  const element = select(id);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function initialise() {
  renderCategories();
  renderTabs();
  renderItems();
  updateLook();
  renderSaved();
  setupPhotoInput();

  select("saveLook")?.addEventListener("click", saveLook);

  select("surpriseTop")?.addEventListener(
    "click",
    surpriseMe
  );

  select("clearLook")?.addEventListener(
    "click",
    resetLook
  );

  select("addClothes")?.addEventListener(
    "click",
    openAddModal
  );

  select("navAdd")?.addEventListener(
    "click",
    openAddModal
  );

  select("closeModal")?.addEventListener(
    "click",
    closeAddModal
  );

  select("takePhoto")?.addEventListener(
    "click",
    () => select("photoInput")?.click()
  );

  select("confirmAdd")?.addEventListener(
    "click",
    addClothing
  );

  select("navDressing")?.addEventListener(
    "click",
    () => scrollToSection("dressing")
  );

  select("navLooks")?.addEventListener(
    "click",
    () => scrollToSection("looks")
  );

  select("shareLook")?.addEventListener(
    "click",
    async () => {
      const text =
        "Mon look Her Closet : " +
        select("lookLabel").textContent;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Her Closet",
            text: text
          });
        } catch (error) {}
      } else {
        showMessage(text);
      }
    }
  );
}

initialise();

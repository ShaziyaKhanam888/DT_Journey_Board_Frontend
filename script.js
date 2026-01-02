const arrow = document.getElementById("toggle-arrow");
const sidebar = document.getElementById("sidebar");
arrow.addEventListener("click", function () {
  sidebar.classList.toggle("expanded");
  if (sidebar.classList.contains("expanded")) {
    arrow.classList.remove("fa-arrow-right");
    arrow.classList.add("fa-arrow-left");
  } else {
    arrow.classList.remove("fa-arrow-left");
    arrow.classList.add("fa-arrow-right");
  }
});
let currentTask = null;

fetch("assets/data/project.json")
  .then((res) => res.json())
  .then((data) => {
    currentTask = data.tasks[0];
    renderMainContent(currentTask);
  })
  .catch((err) => console.error(err));

function createAssetCard(title, desc) {
  const card = document.createElement("div");
  card.className = "asset-card";

  card.innerHTML = `
    <div class="asset-header">${title}</div>
    <div class="asset-body">
      <p>${desc || ""}</p>
    </div>
  `;

  return card;
}
function renderMainContent(task) {
  const main = document.getElementById("main-content");

  const headerHTML = main.querySelector(".content-header").outerHTML;

  main.innerHTML = headerHTML;

  // title + desc
  main.innerHTML += `
  <div class="explore-box">
    <h2>${task.task_title}</h2>
    <p>${task.task_description}</p>
  </div>

  <div class="asset-grid"></div>
`;

  const grid = main.querySelector(".asset-grid");

  task.assets.forEach((asset) => {
    /* ========= VIDEO ========= */
    if (asset.asset_content_type === "video") {
      const card = createAssetCard(asset.asset_title, asset.asset_description);

      card.querySelector(".asset-body").innerHTML += `
        <iframe
          src="${asset.asset_content.trim()}"
          width="100%"
          height="220"
          allowfullscreen>
        </iframe>
      `;

      grid.appendChild(card);
    }

    /* ========= THREADBUILD ========= */
    if (asset.asset_content_type === "threadbuilder") {
      const card = createAssetCard(asset.asset_title, asset.asset_description);

      card.querySelector(".asset-body").innerHTML += `
        <input placeholder="Sub thread 1" />
        <input placeholder="Sub interpretation 1" />

        <div class="thread-actions">
          <button>Sub thread</button>
          <button>Summary</button>
        </div>

        <textarea placeholder="Summary for Thread A"></textarea>
      `;

      grid.appendChild(card);
    }

    /* ========= ARTICLE ========= */
    if (
      asset.asset_content_type === "article" &&
      !asset.asset_title.includes("4SA")
    ) {
      const card = createAssetCard(asset.asset_title, asset.asset_description);

      card.querySelector(".asset-body").innerHTML += `
        <input placeholder="Title" />
        <textarea placeholder="Write content here..."></textarea>
      `;

      grid.appendChild(card);
    }

    /* ========= 4SA METHOD ========= */
    if (asset.asset_title.includes("4SA")) {
      const card = createAssetCard(asset.asset_title, asset.asset_description);

      card.querySelector(".asset-body").innerHTML += `
        <h4>Introduction</h4>
        <p>The 4SA Method, how to bring an idea into process?</p>

        <h4>Thread A</h4>
        <p>How are you going to develop your strategy?</p>

        <span class="see-more">See more</span>
      `;

      grid.appendChild(card);
    }
  });
}
document.querySelectorAll(".jb-list li").forEach((item) => {
  item.addEventListener("click", () => {
    const type = item.dataset.type;

    if (type === "all") {
      renderMainContent(currentTask); // show all 4 assets
      return;
    }

    filterAssets(type);
  });
});

function filterAssets(type) {
  const grid = document.querySelector(".asset-grid");
  grid.innerHTML = "";

  currentTask.assets.forEach((asset) => {
    // TPM video
    if (type === "video" && asset.asset_content_type === "video") {
      addVideo(asset);
    }

    // Threadbuild
    if (
      type === "threadbuilder" &&
      asset.asset_content_type === "threadbuilder"
    ) {
      addThread(asset);
    }

    // Article
    if (
      type === "article" &&
      asset.asset_content_type === "article" &&
      !asset.asset_title.includes("4SA")
    ) {
      addArticle(asset);
    }

    // 4SA
    if (type === "4sa" && asset.asset_title.includes("4SA")) {
      add4SA(asset);
    }
  });
}
function addVideo(asset) {
  const card = createAssetCard(asset.asset_title, asset.asset_description);
  card.querySelector(".asset-body").innerHTML += `
    <iframe src="${asset.asset_content}" width="100%" height="220"></iframe>
  `;
  document.querySelector(".asset-grid").appendChild(card);
}

function addThread(asset) {
  const card = createAssetCard(asset.asset_title, asset.asset_description);
  card.querySelector(".asset-body").innerHTML += `
    <input placeholder="Sub thread" />
    <textarea placeholder="Summary"></textarea>
  `;
  document.querySelector(".asset-grid").appendChild(card);
}

function addArticle(asset) {
  const card = createAssetCard(asset.asset_title, asset.asset_description);
  card.querySelector(".asset-body").innerHTML += `
    <input placeholder="Title" />
    <textarea placeholder="Write here..."></textarea>
  `;
  document.querySelector(".asset-grid").appendChild(card);
}

function add4SA(asset) {
  const card = createAssetCard(asset.asset_title, asset.asset_description);
  card.querySelector(".asset-body").innerHTML += `
    <h4>Introduction</h4>
    <p>4SA Method explanation</p>
  `;
  document.querySelector(".asset-grid").appendChild(card);
}

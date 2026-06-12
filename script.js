const HOUR = 60 * 60 * 1000;
const PEST_INTERVAL = 5/60 * HOUR;
const STORAGE_KEY = "twenty-plot-farm-v3";
const PLOT_COUNT = 20;
const STARTING_PLOTS = 6;

const seeds = [
  { id: "radish", name: "萝卜", icon: "🥕", cost: 2, sell: 4, growHours: 1 / 60 },
  { id: "potato", name: "土豆", icon: "🥔", cost: 10, sell: 24, growHours: 5 / 60 },
  { id: "sweet-potato", name: "红薯", icon: "🍠", cost: 20, sell: 48, growHours: 10 / 60 },
  { id: "cabbage", name: "青菜", icon: "🥬", cost: 60, sell: 155, growHours: 0.5 },
  { id: "corn", name: "玉米", icon: "🌽", cost: 120, sell: 340, growHours: 1 },
  { id: "tomato", name: "番茄", icon: "🍅", cost: 240, sell: 720, growHours: 2 },
  { id: "pumpkin", name: "南瓜", icon: "🎃", cost: 600, sell: 2400, growHours: 5 },
];

const now = () => Date.now();

let selectedSeed = null;
let pendingPurchaseSeed = null;
let state = loadGame();

const coinsEl = document.querySelector("#coins");
const unlockedCountEl = document.querySelector("#unlockedCount");
const nicknameEl = document.querySelector("#nickname");
const levelEl = document.querySelector("#level");
const xpTextEl = document.querySelector("#xpText");
const xpFillEl = document.querySelector("#xpFill");
const statusText = document.querySelector("#statusText");
const shopList = document.querySelector("#shopList");
const bagList = document.querySelector("#bagList");
const plotsEl = document.querySelector("#plots");
const shopTemplate = document.querySelector("#shopTemplate");
const bagTemplate = document.querySelector("#bagTemplate");
const shopModal = document.querySelector("#shopModal");
const nameModal = document.querySelector("#nameModal");
const nameInput = document.querySelector("#nameInput");
const confirmPurchaseBtn = document.querySelector("#confirmPurchase");
const purchaseSummary = document.querySelector("#purchaseSummary");

document.querySelector("#shopHouse").addEventListener("click", () => {
  shopModal.classList.remove("hidden");
});

document.querySelector("#closeShop").addEventListener("click", () => {
  shopModal.classList.add("hidden");
});

confirmPurchaseBtn.addEventListener("click", () => {
  const seed = seedById(pendingPurchaseSeed);
  if (!seed) return;
  buySeed(seed);
});

document.querySelector("#toggleBag").addEventListener("click", () => {
  state.bagCollapsed = !state.bagCollapsed;
  saveGame();
  render();
});

shopModal.addEventListener("click", (event) => {
  if (event.target === shopModal) shopModal.classList.add("hidden");
});

document.querySelector("#nameForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const nickname = nameInput.value.trim() || "新农友";
  state.nickname = nickname.slice(0, 12);
  nameModal.classList.add("hidden");
  status(`${state.nickname}，欢迎来到农场。`);
  saveGame();
  render();
});

document.querySelector("#clearSelection").addEventListener("click", () => {
  selectedSeed = null;
  status("已把种子放回背包。");
  render();
});

document.querySelector("#weedAll").addEventListener("click", () => {
  const changed = state.plots.reduce((count, plot) => {
    if (plot.unlocked && plot.weeds) {
      plot.weeds = false;
      return count + 1;
    }
    return count;
  }, 0);
  if (changed) addExperience(changed * 5);
  status(changed ? `清理了 ${changed} 块地的草，获得 ${changed * 5} 点经验。` : "田里没有草。");
  saveGame();
  render();
});

document.querySelector("#bugAll").addEventListener("click", () => {
  const changed = state.plots.reduce((count, plot) => {
    if (plot.unlocked && plot.bugs) {
      plot.bugs = false;
      return count + 1;
    }
    return count;
  }, 0);
  if (changed) addExperience(changed * 5);
  status(changed ? `驱走了 ${changed} 块地的虫，获得 ${changed * 5} 点经验。` : "田里没有虫。");
  saveGame();
  render();
});

document.querySelector("#saveGame").addEventListener("click", () => {
  saveGame();
  status("游戏已保存。");
});

document.querySelector("#resetGame").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("twenty-plot-farm-v2");
  localStorage.removeItem("twenty-plot-farm-v1");
  selectedSeed = null;
  state = newGame();
  status("新游戏开始。");
  saveGame();
  render();
  showNameModalIfNeeded();
});

function createPlot(index, unlocked = index < STARTING_PLOTS) {
  return {
    id: index + 1,
    unlocked,
    seedId: null,
    plantedAt: null,
    progressMs: 0,
    lastTick: now(),
    nextPestAt: now() + PEST_INTERVAL,
    weeds: false,
    bugs: false,
  };
}

function newGame() {
  return {
    coins: 100,
    level: 1,
    xp: 0,
    nickname: "",
    bagCollapsed: false,
    bag: Object.fromEntries(seeds.map((seed) => [seed.id, 0])),
    plots: Array.from({ length: PLOT_COUNT }, (_, index) => createPlot(index)),
    message: "从背包取出种子，点击空地播种。",
  };
}

function loadGame() {
  const fallback = newGame();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved.plots)) return fallback;
    return {
      coins: Number.isFinite(saved.coins) ? saved.coins : 100,
      level: Number.isFinite(saved.level) ? saved.level : 1,
      xp: Number.isFinite(saved.xp) ? saved.xp : 0,
      nickname: typeof saved.nickname === "string" ? saved.nickname : "",
      bagCollapsed: Boolean(saved.bagCollapsed),
      bag: { ...fallback.bag, ...(saved.bag || {}) },
      plots: Array.from({ length: PLOT_COUNT }, (_, index) => ({
        ...createPlot(index),
        ...(saved.plots[index] || {}),
      })),
      message: saved.message || fallback.message,
    };
  } catch {
    return fallback;
  }
}

function saveGame() {
  state.message = statusText.textContent;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function seedById(id) {
  return seeds.find((seed) => seed.id === id);
}

function growDuration(seed) {
  return seed.growHours * HOUR;
}

function xpNeeded() {
  return 100 * state.level;
}

function addExperience(amount) {
  state.xp += amount;
  let leveled = false;
  while (state.xp >= xpNeeded()) {
    state.xp -= xpNeeded();
    state.level += 1;
    leveled = true;
  }
  return leveled;
}

function unlockCost(plot) {
  const unlockNumber = plot.id - STARTING_PLOTS;
  return 100 * 2 ** (unlockNumber - 1);
}

function tickPlot(plot, currentTime) {
  if (!plot.unlocked || !plot.seedId) {
    plot.lastTick = currentTime;
    plot.nextPestAt = currentTime + PEST_INTERVAL;
    return;
  }

  while (plot.nextPestAt <= currentTime) {
    plot.weeds = true;
    plot.bugs = true;
    plot.nextPestAt += PEST_INTERVAL;
  }

  const seed = seedById(plot.seedId);
  const elapsed = Math.max(0, currentTime - plot.lastTick);
  const slowed = plot.weeds || plot.bugs;
  plot.progressMs = Math.min(growDuration(seed), plot.progressMs + elapsed * (slowed ? 0.5 : 1));
  plot.lastTick = currentTime;
}

function tickGame() {
  const currentTime = now();
  state.plots.forEach((plot) => tickPlot(plot, currentTime));
  render();
  saveGame();
}

function buySeed(seed) {
  if (state.coins < seed.cost) {
    status(`${seed.name}种子需要 ${seed.cost} 金币。`);
    return;
  }
  state.coins -= seed.cost;
  state.bag[seed.id] += 1;
  selectedSeed = seed.id;
  pendingPurchaseSeed = null;
  status(`买入 1 包${seed.name}种子，已放进背包。`);
  saveGame();
  render();
}

function selectSeed(seed) {
  if ((state.bag[seed.id] || 0) <= 0) {
    status(`背包里没有${seed.name}种子，点击黄色商店买一包。`);
    return;
  }
  selectedSeed = seed.id;
  status(`已从背包取出${seed.name}种子，点击空地即可播种。`);
  render();
}

function plant(plot) {
  if (!plot.unlocked) {
    unlockPlot(plot);
    return;
  }
  if (plot.seedId) return;
  if (!selectedSeed) {
    status("先从背包里取出一种种子。");
    return;
  }

  const seed = seedById(selectedSeed);
  if (!seed || (state.bag[seed.id] || 0) <= 0) {
    status("这包种子已经用完了。");
    selectedSeed = null;
    render();
    return;
  }

  const currentTime = now();
  state.bag[seed.id] -= 1;
  Object.assign(plot, {
    seedId: seed.id,
    plantedAt: currentTime,
    progressMs: 0,
    lastTick: currentTime,
    nextPestAt: currentTime + PEST_INTERVAL,
    weeds: false,
    bugs: false,
  });
  if (state.bag[seed.id] <= 0) selectedSeed = null;
  status(`播下了${seed.name}。`);
  saveGame();
  render();
}

function unlockPlot(plot) {
  const cost = unlockCost(plot);
  if (state.coins < cost) {
    status(`开垦第 ${plot.id} 块地需要 ${cost} 金币。`);
    return;
  }
  state.coins -= cost;
  plot.unlocked = true;
  plot.lastTick = now();
  plot.nextPestAt = now() + PEST_INTERVAL;
  status(`花费 ${cost} 金币，开垦了第 ${plot.id} 块地。`);
  saveGame();
  render();
}

function harvest(plot) {
  const seed = seedById(plot.seedId);
  if (!seed || plot.progressMs < growDuration(seed)) return;

  state.coins += seed.sell;
  const leveled = addExperience(seed.sell);
  const plotId = plot.id;
  Object.assign(plot, createPlot(plotId - 1, true));
  status(`收获${seed.name}，卖出 ${seed.sell} 金币，获得 ${seed.sell} 点经验${leveled ? "，升级了！" : "。"}`);
  saveGame();
  render();
}

function clearWeeds(plot) {
  if (!plot.weeds) return;
  plot.weeds = false;
  plot.lastTick = now();
  const leveled = addExperience(5);
  status(`第 ${plot.id} 块地已除草，获得 5 点经验${leveled ? "，升级了！" : "。"}`);
  saveGame();
  render();
}

function clearBugs(plot) {
  if (!plot.bugs) return;
  plot.bugs = false;
  plot.lastTick = now();
  const leveled = addExperience(5);
  status(`第 ${plot.id} 块地已驱虫，获得 5 点经验${leveled ? "，升级了！" : "。"}`);
  saveGame();
  render();
}

function status(text) {
  statusText.textContent = text;
}

function formatTime(ms) {
  if (ms <= 0) return "可收获";
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}分钟`;
  return `${hours}小时${minutes ? `${minutes}分钟` : ""}`;
}

function formatHours(hours) {
  if (hours < 1) return `${Math.round(hours * 60)}分钟`;
  return `${hours}小时`;
}

function growthStage(progressRatio) {
  if (progressRatio >= 1) return "成熟";
  if (progressRatio >= 0.66) return "结果";
  if (progressRatio >= 0.33) return "长叶";
  return "发芽";
}

function stageIcon(seed, progressRatio) {
  if (progressRatio >= 1) return seed.icon;
  if (progressRatio >= 0.66) return "🌿";
  if (progressRatio >= 0.33) return "🌱";
  return "·";
}

function renderShop() {
  shopList.replaceChildren();
  seeds.forEach((seed) => {
    const node = shopTemplate.content.firstElementChild.cloneNode(true);
    node.classList.toggle("pending", pendingPurchaseSeed === seed.id);
    node.disabled = state.coins < seed.cost;
    node.querySelector(".item-icon").textContent = seed.icon;
    node.querySelector("strong").textContent = seed.name;
    node.querySelector("small").textContent = `${formatHours(seed.growHours)}成熟`;
    node.querySelector(".item-price").textContent = `${seed.cost}金`;
    node.addEventListener("click", () => {
      pendingPurchaseSeed = seed.id;
      render();
    });
    shopList.append(node);
  });
  renderPurchaseConfirm();
}

function renderPurchaseConfirm() {
  const seed = seedById(pendingPurchaseSeed);
  if (!seed) {
    purchaseSummary.textContent = "请选择一种种子";
    confirmPurchaseBtn.disabled = true;
    return;
  }
  purchaseSummary.textContent = `购买 1 包 ${seed.name}：${seed.cost} 金币`;
  confirmPurchaseBtn.disabled = state.coins < seed.cost;
}

function renderBag() {
  bagList.replaceChildren();
  seeds.forEach((seed) => {
    const count = state.bag[seed.id] || 0;
    const node = bagTemplate.content.firstElementChild.cloneNode(true);
    node.classList.toggle("selected", selectedSeed === seed.id);
    node.disabled = count <= 0;
    node.querySelector(".item-icon").textContent = seed.icon;
    node.querySelector("strong").textContent = seed.name;
    node.querySelector("small").textContent = `x${count}`;
    node.addEventListener("click", () => selectSeed(seed));
    bagList.append(node);
  });
}

function renderPlots() {
  plotsEl.replaceChildren();
  state.plots.forEach((plot) => {
    const seed = seedById(plot.seedId);
    const ready = seed && plot.progressMs >= growDuration(seed);
    const ratio = seed ? Math.min(1, plot.progressMs / growDuration(seed)) : 0;
    const plotEl = document.createElement("article");
    plotEl.className = `plot${plot.unlocked ? "" : " locked"}${seed ? "" : " empty"}${ready ? " ready" : ""}`;
    plotEl.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      plant(plot);
    });

    if (!plot.unlocked) {
      const unlock = document.createElement("div");
      unlock.className = "unlock-card";
      unlock.innerHTML = `<strong>+</strong><small>${unlockCost(plot)}金</small>`;
      plotEl.append(unlock);
      plotsEl.append(plotEl);
      return;
    }

    const content = document.createElement("div");
    content.className = "plot-content";

    const cropArt = document.createElement("div");
    cropArt.className = "crop-art";
    cropArt.textContent = seed ? stageIcon(seed, ratio) : selectedSeed ? "+" : "";

    const name = document.createElement("div");
    name.className = "plot-name";
    name.textContent = seed ? `${seed.name}${growthStage(ratio)}` : "空地";

    const progress = document.createElement("div");
    progress.className = "progress";
    progress.innerHTML = `<span style="width:${Math.floor(ratio * 100)}%"></span>`;

    const time = document.createElement("div");
    time.className = "plot-time";
    const slowed = seed && (plot.weeds || plot.bugs);
    const remaining = seed ? (growDuration(seed) - plot.progressMs) * (slowed ? 2 : 1) : 0;
    time.textContent = seed ? formatTime(remaining) : selectedSeed ? "点击播种" : `#${plot.id}`;

    const badges = document.createElement("div");
    badges.className = "badge-row";
    badges.innerHTML = [
      plot.weeds ? `<span class="badge" title="有草">🌾</span>` : "",
      plot.bugs ? `<span class="badge" title="有虫">🐛</span>` : "",
    ].join("");

    const actions = document.createElement("div");
    actions.className = "plot-actions";
    actions.append(
      actionButton("收", () => harvest(plot), !ready),
      actionButton("草", () => clearWeeds(plot), !plot.weeds),
      actionButton("虫", () => clearBugs(plot), !plot.bugs),
    );

    content.append(cropArt, name, progress, time);
    plotEl.append(content, badges, actions);
    plotsEl.append(plotEl);
  });
}

function actionButton(text, onClick, disabled) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  return button;
}

function render() {
  const needed = xpNeeded();
  const bagOverlay = document.querySelector(".bag-overlay");
  const toggleBag = document.querySelector("#toggleBag");
  coinsEl.textContent = state.coins;
  unlockedCountEl.textContent = `${state.plots.filter((plot) => plot.unlocked).length}/${PLOT_COUNT}`;
  nicknameEl.textContent = state.nickname || "未命名";
  levelEl.textContent = state.level;
  xpTextEl.textContent = `经验 ${state.xp}/${needed}`;
  xpFillEl.style.width = `${Math.min(100, Math.floor((state.xp / needed) * 100))}%`;
  bagOverlay.classList.toggle("collapsed", state.bagCollapsed);
  toggleBag.textContent = state.bagCollapsed ? "展开" : "收起";
  toggleBag.setAttribute("aria-expanded", String(!state.bagCollapsed));
  renderShop();
  renderBag();
  renderPlots();
}

function showNameModalIfNeeded() {
  if (!state.nickname) {
    nameInput.value = "";
    nameModal.classList.remove("hidden");
    window.setTimeout(() => nameInput.focus(), 0);
  }
}

status(state.message);
tickGame();
showNameModalIfNeeded();
setInterval(tickGame, 1000);

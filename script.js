<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>开心农场 - 多地块农场</title>
    <style>
        * {
            box-sizing: border-box;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background: linear-gradient(145deg, #1a472a 0%, #0e2a1a 100%);
            font-family: system-ui, 'Segoe UI', 'Helvetica Neue', sans-serif;
            margin: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px;
        }

        /* 主面板 */
        .farm-container {
            max-width: 1300px;
            width: 100%;
            background: #fef3c7;
            background-image: radial-gradient(circle at 10% 20%, rgba(255,245,200,0.6) 2%, transparent 2.5%);
            background-size: 28px 28px;
            border-radius: 64px 64px 48px 48px;
            box-shadow: 0 20px 35px rgba(0,0,0,0.4), inset 0 1px 4px rgba(255,255,200,0.8);
            overflow: hidden;
            padding: 16px 20px 24px;
            transition: all 0.2s;
        }

        /* 顶部状态栏 */
        .status-bar {
            background: #2d1f12e6;
            backdrop-filter: blur(8px);
            border-radius: 120px;
            padding: 10px 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            color: #ffefcf;
            text-shadow: 0 2px 3px #1f1409;
            box-shadow: 0 6px 12px rgba(0,0,0,0.2);
            font-weight: bold;
        }

        .coin {
            background: #ffcd7e;
            padding: 6px 18px;
            border-radius: 40px;
            color: #8b5a2b;
            font-size: 1.4rem;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: inset 0 1px 3px #fff3bf, 0 4px 8px #00000030;
        }

        .coin::before {
            content: "🪙";
            font-size: 1.4rem;
        }

        .unlock-badge {
            background: #4b3621;
            padding: 6px 16px;
            border-radius: 30px;
            font-size: 0.9rem;
        }

        .profile {
            background: #4b3621;
            padding: 5px 16px;
            border-radius: 32px;
            display: flex;
            gap: 15px;
        }

        /* 经验条 */
        .xp-container {
            background: #34200c;
            border-radius: 20px;
            height: 12px;
            width: 180px;
            overflow: hidden;
            box-shadow: inset 0 1px 4px #00000055;
        }

        .xp-fill {
            background: #f5b042;
            width: 0%;
            height: 100%;
            border-radius: 20px;
            transition: width 0.2s ease;
        }

        /* 工具栏 */
        .toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 20px;
            background: #e9d6a7;
            padding: 12px 20px;
            border-radius: 60px;
            justify-content: center;
        }

        .tool-btn {
            background: #feffd2;
            border: none;
            font-size: 1rem;
            padding: 8px 18px;
            border-radius: 40px;
            font-weight: bold;
            color: #4a2e1a;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: 0.07s linear;
        }

        .tool-btn:active {
            transform: scale(0.96);
            background: #f9e6b3;
        }

        /* 田地网格 */
        .plots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 14px;
            margin: 20px 0;
        }

        .plot {
            background: #7b3f1a;
            background-image: radial-gradient(circle at 25% 30%, #9b5e2c 2%, transparent 2.5%);
            background-size: 20px 20px;
            border-radius: 28px;
            aspect-ratio: 1 / 1;
            position: relative;
            box-shadow: inset 0 0 0 2px #deb887, 0 8px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: 0.07s linear;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .plot:active {
            transform: scale(0.97);
        }

        .plot.locked {
            background: #4a3a2a;
            filter: grayscale(0.3);
            justify-content: center;
            align-items: center;
        }

        .unlock-card {
            text-align: center;
            background: #2f2a1fcc;
            backdrop-filter: blur(5px);
            width: 100%;
            padding: 12px;
            border-radius: 24px;
            font-weight: bold;
            color: gold;
        }

        .plot-content {
            padding: 10px 8px 4px;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .crop-art {
            font-size: 3rem;
            filter: drop-shadow(2px 6px 8px #00000040);
            margin: 4px 0;
        }

        .plot-name {
            font-size: 0.75rem;
            background: #221c0eaa;
            backdrop-filter: blur(4px);
            display: inline-block;
            padding: 2px 8px;
            border-radius: 50px;
            color: #f9e2a1;
            font-weight: bold;
        }

        .progress {
            background: #3d2a18;
            border-radius: 12px;
            height: 8px;
            width: 90%;
            margin: 8px 0;
            overflow: hidden;
        }

        .progress span {
            display: block;
            background: #85c441;
            height: 100%;
            width: 0%;
            border-radius: 12px;
        }

        .plot-time {
            font-size: 0.7rem;
            background: #00000077;
            padding: 2px 8px;
            border-radius: 20px;
            color: #f7eac5;
        }

        .badge-row {
            display: flex;
            gap: 6px;
            justify-content: center;
            margin: 4px 0;
        }

        .badge {
            background: #663f00cc;
            backdrop-filter: blur(2px);
            border-radius: 30px;
            padding: 2px 6px;
            font-size: 0.7rem;
        }

        .plot-actions {
            display: flex;
            justify-content: space-around;
            background: #4f340bc9;
            padding: 6px;
            gap: 5px;
        }

        .plot-actions button {
            background: #edd9a3;
            border: none;
            border-radius: 40px;
            font-weight: bold;
            flex: 1;
            padding: 5px 0;
            font-size: 0.75rem;
            cursor: pointer;
            transition: 0.05s linear;
        }

        .plot-actions button:active {
            transform: scale(0.92);
        }

        /* 背包区域 */
        .bag-section {
            background: #ebd5a0b3;
            backdrop-filter: blur(4px);
            border-radius: 48px;
            margin-top: 16px;
            overflow: hidden;
            transition: 0.2s;
        }

        .bag-header {
            background: #c7a252;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            font-weight: bold;
            font-size: 1.1rem;
        }

        .bag-items {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            padding: 16px;
            transition: 0.2s;
        }

        .bag-section.collapsed .bag-items {
            display: none;
        }

        .seed-card {
            background: #fff7e8;
            border-radius: 60px;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 8px 18px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            cursor: pointer;
            transition: 0.07s;
            border: 2px solid #dbb46a;
        }

        .seed-card.selected {
            background: #ffde9c;
            border: 3px solid #f7b32b;
            box-shadow: 0 0 0 3px #fff3bf;
        }

        .seed-card:active {
            transform: scale(0.96);
        }

        /* 商店弹窗 */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000000aa;
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .modal.hidden {
            display: none;
        }

        .modal-content {
            background: #fef0cf;
            border-radius: 48px;
            max-width: 500px;
            width: 90%;
            padding: 20px;
            box-shadow: 0 20px 30px black;
            animation: bounce 0.2s ease;
        }

        .shop-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
            gap: 12px;
            margin: 20px 0;
            max-height: 60vh;
            overflow-y: auto;
        }

        .shop-item {
            background: #fffaec;
            border-radius: 32px;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            transition: 0.05s linear;
            border: 2px solid #e7bc7e;
        }

        .shop-item.pending {
            background: #f7d48b;
            border: 3px solid #ff9100;
        }

        .shop-item:active {
            transform: scale(0.96);
        }

        .item-price {
            font-weight: bold;
            color: #b45f1b;
        }

        .purchase-controls {
            margin: 10px 0;
            padding: 15px;
            background: #e8dbbf;
            border-radius: 40px;
            text-align: center;
        }

        .purchase-controls button {
            background: #c9a96b;
            border: none;
            padding: 8px 12px;
            border-radius: 30px;
            font-weight: bold;
            cursor: pointer;
            font-size: 1rem;
            margin: 0 3px;
        }

        .purchase-controls button:active {
            transform: scale(0.95);
        }

        #purchaseQty {
            text-align: center;
            font-size: 1rem;
            padding: 6px;
            border-radius: 30px;
            border: 1px solid #b68b40;
            width: 70px;
        }

        .confirm-btn {
            background: #2e7d32;
            color: white;
            width: 100%;
            padding: 12px;
            font-size: 1.2rem;
            margin-top: 10px;
        }

        @keyframes bounce {
            from {
                transform: scale(0.9);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }

        footer {
            font-size: 0.7rem;
            text-align: center;
            margin-top: 16px;
            color: #443017;
        }
    </style>
</head>
<body>
<div class="farm-container">
    <div class="status-bar">
        <div class="coin"><span id="coins">0</span></div>
        <div class="unlock-badge">🌾 <span id="unlockedCount">0</span>/20</div>
        <div class="profile">
            <span>👤 <span id="nickname">农夫</span></span>
            <span>⭐ Lv.<span id="level">1</span></span>
            <div class="xp-container"><div class="xp-fill" id="xpFill"></div></div>
        </div>
    </div>
    <div id="statusText" class="status-text" style="background:#e9cf97; padding:8px 16px; border-radius:50px; margin-bottom:12px; text-align:center;">🌱 点击空地播种</div>
    <div class="toolbar">
        <button class="tool-btn" id="toggleBag">🎒 收起</button>
        <button class="tool-btn" id="weedAll">🌾 除草</button>
        <button class="tool-btn" id="bugAll">🐛 驱虫</button>
        <button class="tool-btn" id="shopHouse">🏪 商店</button>
        <button class="tool-btn" id="clearSelection">❌ 取消种子</button>
        <button class="tool-btn" id="saveGame">💾 保存</button>
        <button class="tool-btn" id="resetGame">🔄 重置</button>
    </div>

    <div class="plots-grid" id="plots"></div>

    <div class="bag-section" id="bagSection">
        <div class="bag-header">
            <span>🎒 我的背包</span>
            <button id="toggleBagHeader" style="background: none; border:none; font-size:1.2rem;">▼</button>
        </div>
        <div class="bag-items" id="bagList"></div>
    </div>
    <footer>🌻 长按或点击地块可收获/除草/驱虫 🌻</footer>
</div>

<!-- 商店弹窗 -->
<div id="shopModal" class="modal hidden">
    <div class="modal-content">
        <h2>🌱 种子商店</h2>
        <div class="shop-list" id="shopList"></div>
        <div class="purchase-controls">
            <label>购买数量：</label>
            <button type="button" id="decreaseQty">-</button>
            <input type="number" id="purchaseQty" value="1" min="1" max="99">
            <button type="button" id="increaseQty">+</button>
            <button type="button" id="maxQty">最大</button>
            <div id="maxHint" style="font-size:0.8rem; margin-top:5px;"></div>
        </div>
        <div id="purchaseSummary" style="text-align:center; margin:10px 0;"></div>
        <button id="confirmPurchase" class="confirm-btn">✅ 确认购买</button>
        <button id="closeShop" class="tool-btn" style="width:100%; margin-top:10px;">关闭</button>
    </div>
</div>

<!-- 命名弹窗 -->
<div id="nameModal" class="modal hidden">
    <div class="modal-content">
        <h2>🌾 欢迎来到农场</h2>
        <form id="nameForm">
            <input type="text" id="nameInput" placeholder="取个名字吧" maxlength="12" autocomplete="off">
            <button type="submit" style="margin-top:12px;">开始务农</button>
        </form>
    </div>
</div>

<!-- 模板 -->
<template id="shopTemplate">
    <div class="shop-item">
        <div class="item-icon" style="font-size:2rem;"></div>
        <strong></strong><br>
        <small></small><br>
        <span class="item-price"></span>
    </div>
</template>
<template id="bagTemplate">
    <div class="seed-card">
        <span class="item-icon" style="font-size:1.5rem;"></span>
        <strong></strong>
        <small></small>
    </div>
</template>

<script>
    const HOUR = 60 * 60 * 1000;
    const PEST_INTERVAL = 3 * HOUR;
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
        initQuantityControls();
    });

    document.querySelector("#closeShop").addEventListener("click", () => {
        shopModal.classList.add("hidden");
    });

    confirmPurchaseBtn.addEventListener("click", () => {
        const seed = seedById(pendingPurchaseSeed);
        if (!seed) return;
        const qty = parseInt(document.querySelector("#purchaseQty")?.value) || 1;
        if (qty <= 0) {
            status("请选择有效数量");
            return;
        }
        buySeed(seed, qty);
    });

    document.querySelector("#toggleBag").addEventListener("click", () => {
        state.bagCollapsed = !state.bagCollapsed;
        saveGame();
        render();
    });

    document.querySelector("#toggleBagHeader").addEventListener("click", () => {
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

    function buySeed(seed, quantity = 1) {
        const totalCost = seed.cost * quantity;
        
        if (state.coins < totalCost) {
            status(`${seed.name}种子${quantity}包需要 ${totalCost} 金币，金币不足。`);
            return;
        }
        
        state.coins -= totalCost;
        state.bag[seed.id] += quantity;
        selectedSeed = seed.id;
        pendingPurchaseSeed = null;
        
        // 重置数量选择器
        const qtyInput = document.querySelector("#purchaseQty");
        if (qtyInput) qtyInput.value = 1;
        
        status(`买入 ${quantity} 包${seed.name}种子，花费 ${totalCost} 金币，已放进背包。`);
        saveGame();
        render();
        shopModal.classList.add("hidden");
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

    function initQuantityControls() {
        const qtyInput = document.querySelector("#purchaseQty");
        const decreaseBtn = document.querySelector("#decreaseQty");
        const increaseBtn = document.querySelector("#increaseQty");
        const maxBtn = document.querySelector("#maxQty");
        
        if (!qtyInput) return;
        
        const updateMax = () => {
            const seed = seedById(pendingPurchaseSeed);
            if (seed) {
                const maxQty = Math.floor(state.coins / seed.cost);
                qtyInput.max = maxQty > 0 ? maxQty : 1;
                let currentQty = parseInt(qtyInput.value);
                if (currentQty > maxQty && maxQty > 0) {
                    qtyInput.value = maxQty;
                } else if (maxQty === 0) {
                    qtyInput.value = 0;
                }
            }
            renderPurchaseConfirm();
        };
        
        if (decreaseBtn) {
            decreaseBtn.replaceWith(decreaseBtn.cloneNode(true));
            const newDecreaseBtn = document.querySelector("#decreaseQty");
            newDecreaseBtn.addEventListener("click", () => {
                let val = parseInt(qtyInput.value);
                if (val > 1) {
                    qtyInput.value = val - 1;
                    updateMax();
                }
            });
        }
        
        if (increaseBtn) {
            increaseBtn.replaceWith(increaseBtn.cloneNode(true));
            const newIncreaseBtn = document.querySelector("#increaseQty");
            newIncreaseBtn.addEventListener("click", () => {
                let val = parseInt(qtyInput.value);
                const seed = seedById(pendingPurchaseSeed);
                const maxQty = seed ? Math.floor(state.coins / seed.cost) : 99;
                if (val < maxQty) {
                    qtyInput.value = val + 1;
                    updateMax();
                }
            });
        }
        
        if (maxBtn) {
            maxBtn.replaceWith(maxBtn.cloneNode(true));
            const newMaxBtn = document.querySelector("#maxQty");
            newMaxBtn.addEventListener("click", () => {
                const seed = seedById(pendingPurchaseSeed);
                if (seed) {
                    const maxQty = Math.floor(state.coins / seed.cost);
                    qtyInput.value = maxQty > 0 ? maxQty : 1;
                    updateMax();
                }
            });
        }
        
        qtyInput.addEventListener("change", () => {
            let val = parseInt(qtyInput.value);
            const seed = seedById(pendingPurchaseSeed);
            const maxQty = seed ? Math.floor(state.coins / seed.cost) : 99;
            if (isNaN(val) || val < 1) val = 1;
            if (val > maxQty && maxQty > 0) val = maxQty;
            qtyInput.value = val;
            updateMax();
        });
        
        updateMax();
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
                initQuantityControls();
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
            const maxHint = document.querySelector("#maxHint");
            if (maxHint) maxHint.textContent = "";
            return;
        }
        
        const qty = parseInt(document.querySelector("#purchaseQty")?.value) || 1;
        const totalCost = seed.cost * qty;
        const maxQty = Math.floor(state.coins / seed.cost);
        
        purchaseSummary.textContent = `购买 ${qty} 包 ${seed.name}：总计 ${totalCost} 金币`;
        confirmPurchaseBtn.disabled = state.coins < totalCost;
        
        const maxHint = document.querySelector("#maxHint");
        if (maxHint) {
            maxHint.textContent = maxQty > 0 ? `💰 最多可买 ${maxQty} 包` : "💰 金币不足";
        }
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
        const bagOverlay = document.querySelector(".bag-section");
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
</script>
</body>
</html>

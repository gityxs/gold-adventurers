/**
 * 时光秘境 · 徽章系统
 * 局内击杀 / 事件 / 通关超低概率获得徽章，永久加成主世界地图属性
 */
const TSR_BADGE_DEFS = {
    life: {
        id: 'life',
        name: '生命徽章',
        icon: '🛡️',
        desc: '主世界总生命 +10% / 枚',
        perBonus: 0.1,
        attr: 'health',
        max: 9999999
    },
    attack: {
        id: 'attack',
        name: '攻击徽章',
        icon: '⚔️',
        desc: '主世界总攻击 +10% / 枚',
        perBonus: 0.1,
        attr: 'attack',
        max: 9999999
    },
    crit: {
        id: 'crit',
        name: '爆伤徽章',
        icon: '💥',
        desc: '主世界总爆伤 +10% / 枚',
        perBonus: 0.1,
        attr: 'critDamage',
        max: 9999999
    },
    exp: {
        id: 'exp',
        name: '经验徽章',
        icon: '📜',
        desc: '世界地图经验 +1% / 枚',
        perBonus: 0.01,
        attr: 'worldExp',
        max: 999
    }
};

/** 徽章掉率：击杀 / 事件 / 通关（已整体上调，仍保持稀有感） */
const TSR_BADGE_DROP_RATES = {
    killNormal: 0.004,
    killElite: 0.012,
    killBoss: 0.028,
    event: 0.01,
    clear: 0.06
};

function ensureTsrBadges() {
    const tsr = player.timeSecretRealm;
    if (!tsr) return { counts: {}, history: [] };
    if (!tsr.badges || typeof tsr.badges !== 'object') {
        tsr.badges = { counts: {}, history: [] };
    }
    if (!tsr.badges.counts) tsr.badges.counts = {};
    if (!Array.isArray(tsr.badges.history)) tsr.badges.history = [];
    Object.keys(TSR_BADGE_DEFS).forEach(id => {
        if (tsr.badges.counts[id] == null) tsr.badges.counts[id] = 0;
    });
    return tsr.badges;
}

function getTsrBadgeCount(id) {
    return Math.max(0, Number(ensureTsrBadges().counts[id]) || 0);
}

function getTsrBadgeAttrBonus(attr) {
    let sum = 0;
    Object.values(TSR_BADGE_DEFS).forEach(def => {
        if (def.attr !== attr) return;
        sum += getTsrBadgeCount(def.id) * def.perBonus;
    });
    return sum;
}

function getTsrBadgeWorldExpMultiplier() {
    return 1 + getTsrBadgeAttrBonus('worldExp');
}

function applyTsrBadgeMainWorldBonuses() {
    if (!player?.attributes) return;
    const atk = getTsrBadgeAttrBonus('attack');
    const hp = getTsrBadgeAttrBonus('health');
    const crit = getTsrBadgeAttrBonus('critDamage');
    if (atk > 0) player.attributes.attackBonus = (Number(player.attributes.attackBonus) || 0) + atk;
    if (hp > 0) player.attributes.healthBonus = (Number(player.attributes.healthBonus) || 0) + hp;
    if (crit > 0) player.attributes.critDamageBonus = (Number(player.attributes.critDamageBonus) || 0) + crit;
}

function pickTsrBadgeDropId() {
    const pool = [
        { id: 'life', w: 28 },
        { id: 'attack', w: 28 },
        { id: 'crit', w: 28 },
        { id: 'exp', w: 16 }
    ];
    const total = pool.reduce((s, p) => s + p.w, 0);
    let roll = Math.random() * total;
    for (const p of pool) {
        roll -= p.w;
        if (roll <= 0) return p.id;
    }
    return 'life';
}

function grantTsrBadge(id, source) {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) {
        const def = TSR_BADGE_DEFS[id];
        if (def) addTsrLog?.(`${def.icon}${def.name}（教学局演示掉落，不计入永久徽章）`, 'info');
        return false;
    }
    const def = TSR_BADGE_DEFS[id];
    if (!def) return false;
    const data = ensureTsrBadges();
    const cur = Number(data.counts[id]) || 0;
    if (cur >= def.max) {
        addTsrLog?.(`${def.icon}${def.name}已集满（${def.max}），本次转化为 800 秘境币`, 'warning');
        addTsrPermanentCurrency?.(800);
        return false;
    }
    data.counts[id] = cur + 1;
    data.history.unshift({
        id,
        source: source || 'unknown',
        at: Date.now()
    });
    if (data.history.length > 40) data.history.length = 40;
    if (!player.timeSecretRealm.lifetimeStats) player.timeSecretRealm.lifetimeStats = {};
    player.timeSecretRealm.lifetimeStats.badgesGained = (player.timeSecretRealm.lifetimeStats.badgesGained || 0) + 1;

    const tip = `${def.icon} 获得【${def.name}】！${def.desc}（持有 ${data.counts[id]}/${def.max}）`;
    addTsrLog?.(tip, 'success');
    logAction?.(tip, 'success');
    try {
        if (typeof updateTechniqueBonuses === 'function') updateTechniqueBonuses();
        else applyTsrBadgeMainWorldBonuses();
    } catch (e) { /* ignore */ }
    renderTsrBadgePanel();
    return true;
}

function tryRollTsrBadge(source, opts) {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return false;
    const rates = TSR_BADGE_DROP_RATES;
    let chance = 0;
    if (source === 'kill') {
        if (opts?.boss) chance = rates.killBoss;
        else if (opts?.elite) chance = rates.killElite;
        else chance = rates.killNormal;
    } else if (source === 'event') {
        chance = rates.event;
    } else if (source === 'clear') {
        chance = rates.clear;
    } else {
        return false;
    }
    if (Math.random() >= chance) return false;
    return grantTsrBadge(pickTsrBadgeDropId(), source);
}

function renderTsrBadgePanel() {
    const el = document.getElementById('tsrBadgePanel');
    if (!el) return;
    ensureTsrBadges();
    const data = player.timeSecretRealm.badges;
    const cards = Object.values(TSR_BADGE_DEFS).map(def => {
        const n = getTsrBadgeCount(def.id);
        const bonusPct = (n * def.perBonus * 100).toFixed(def.attr === 'worldExp' ? 1 : 0);
        return `<div class="tsr-badge-card">
            <div class="tsr-badge-icon">${def.icon}</div>
            <div class="tsr-badge-name">${def.name}</div>
            <div class="tsr-badge-count">×${n}${n >= def.max ? '（满）' : ''}</div>
            <div class="tsr-badge-desc">${def.desc}</div>
            <div class="tsr-badge-total">当前合计 +${bonusPct}%</div>
        </div>`;
    }).join('');
    const hist = (data.history || []).slice(0, 8).map(h => {
        const def = TSR_BADGE_DEFS[h.id];
        const src = h.source === 'kill' ? '击杀'
            : (h.source === 'event' ? '事件'
            : (h.source === 'clear' ? '通关'
            : (h.source === 'gamble' ? '时空赌局' : h.source)));
        const t = h.at ? new Date(h.at).toLocaleString() : '';
        return `<li>${def?.icon || '🏅'} ${def?.name || h.id} · ${src} · ${t}</li>`;
    }).join('');
    el.innerHTML = `
        <p class="tsr-tab-hint">徽章仅加成主世界世界地图。击杀 / 奇遇事件 / 通关有概率掉落，可叠加至上限。</p>
        <div class="tsr-badge-grid">${cards}</div>
        <div class="tsr-block-title" style="margin-top:14px;">最近获得</div>
        <ul class="tsr-badge-history">${hist || '<li class="tsr-dash-hint">尚无徽章记录，继续探索秘境吧</li>'}</ul>`;
}

function injectTsrBadgeLobbyUI() {
    const lobby = document.getElementById('tsrLobbyPanel');
    if (!lobby) return;
    if (!document.getElementById('tsrTabBadges')) {
        const panel = document.createElement('div');
        panel.id = 'tsrTabBadges';
        panel.className = 'tsr-tab-panel';
        panel.innerHTML = '<div class="tsr-block-title">🏅 徽章收藏</div><div id="tsrBadgePanel"></div>';
        lobby.appendChild(panel);
    }
}

function initTsrBadgeExtensions() {
    ensureTsrBadges();
    injectTsrBadgeLobbyUI();

    if (typeof TSR_EXTRA_LOBBY_TABS === 'object') {
        TSR_EXTRA_LOBBY_TABS.badges = 'tsrTabBadges';
    }
    if (typeof TSR_LOBBY_TAB_REFRESH === 'object') {
        TSR_LOBBY_TAB_REFRESH.badges = () => renderTsrBadgePanel();
    }

    // 挂到布局「养成」二级
    if (typeof window !== 'undefined') {
        window.__tsrBadgeHubChild = { id: 'badges', label: '🏅 徽章' };
    }

    if (typeof applyTsrMainWorldShopBonuses === 'function' && !applyTsrMainWorldShopBonuses.__tsrBadgePatched) {
        const _orig = applyTsrMainWorldShopBonuses;
        applyTsrMainWorldShopBonuses = function () {
            _orig();
            applyTsrBadgeMainWorldBonuses();
        };
        applyTsrMainWorldShopBonuses.__tsrBadgePatched = true;
    }

    if (typeof addTsrRunCurrency === 'function' && !addTsrRunCurrency.__tsrBadgePatched) {
        const _orig = addTsrRunCurrency;
        addTsrRunCurrency = function (amount, opts) {
            const r = _orig.apply(this, arguments);
            const o = opts || {};
            if (o.fromBattle || o.bossBonus || o.eliteBonus) {
                tryRollTsrBadge('kill', { boss: !!o.bossBonus, elite: !!o.eliteBonus && !o.bossBonus });
            }
            return r;
        };
        addTsrRunCurrency.__tsrBadgePatched = true;
    }

    if (typeof finishTsrMemeRoom === 'function' && !finishTsrMemeRoom.__tsrBadgePatched) {
        const _orig = finishTsrMemeRoom;
        finishTsrMemeRoom = function () {
            const room = player.timeSecretRealm?.currentRun?.currentRoom;
            if (room && !room._tsrBadgeEventRolled) {
                room._tsrBadgeEventRolled = true;
                tryRollTsrBadge('event');
            }
            return _orig.apply(this, arguments);
        };
        finishTsrMemeRoom.__tsrBadgePatched = true;
    }

    if (typeof generateNewRoom === 'function' && !generateNewRoom.__tsrBadgePatched) {
        const _orig = generateNewRoom;
        generateNewRoom = function () {
            const prev = player.timeSecretRealm?.currentRun?.currentRoom;
            const battleTypes = new Set(['battle', 'elite', 'boss', 'rest', 'shop', 'treasure']);
            if (prev?.type && !battleTypes.has(prev.type) && !prev._tsrBadgeEventRolled) {
                prev._tsrBadgeEventRolled = true;
                tryRollTsrBadge('event', { roomType: prev.type });
            }
            return _orig.apply(this, arguments);
        };
        generateNewRoom.__tsrBadgePatched = true;
    }

    if (typeof endTimeSecretRealm === 'function' && !endTimeSecretRealm.__tsrBadgePatched) {
        const _orig = endTimeSecretRealm;
        endTimeSecretRealm = function (reason) {
            const tsr = player.timeSecretRealm;
            const run = tsr?.currentRun;
            const clearFloor = run?.clearFloor || tsr?.difficulty?.levels?.[run?.difficulty]?.clearFloor;
            const cleared = run && clearFloor && run.currentFloor >= clearFloor
                && (typeof isTsrSuccessfulClear !== 'function' || isTsrSuccessfulClear(reason));
            if (cleared) tryRollTsrBadge('clear');
            return _orig.apply(this, arguments);
        };
        endTimeSecretRealm.__tsrBadgePatched = true;
    }

    if (typeof calculateWorldMapExpReward === 'function' && !calculateWorldMapExpReward.__tsrBadgePatched) {
        const _orig = calculateWorldMapExpReward;
        calculateWorldMapExpReward = function (zone, dimension) {
            const base = _orig(zone, dimension);
            if (!base) return base;
            return Math.floor(base * getTsrBadgeWorldExpMultiplier());
        };
        calculateWorldMapExpReward.__tsrBadgePatched = true;
    }

    if (typeof updateTsrLobbyDashboard === 'function' && !updateTsrLobbyDashboard.__tsrBadgePatched) {
        const _orig = updateTsrLobbyDashboard;
        updateTsrLobbyDashboard = function () {
            _orig();
            const side = document.getElementById('tsrDashboardContent');
            if (!side || side.querySelector('.tsr-dash-badge')) return;
            ensureTsrBadges();
            const total = Object.keys(TSR_BADGE_DEFS).reduce((s, id) => s + getTsrBadgeCount(id), 0);
            if (total <= 0) return;
            const card = document.createElement('div');
            card.className = 'tsr-dash-card tsr-dash-badge';
            card.onclick = () => switchTsrLobbyTab('badges');
            card.innerHTML = `<div class="tsr-block-title">🏅 徽章</div>
                <p>共持有 ${total} 枚 · 攻+${(getTsrBadgeAttrBonus('attack') * 100).toFixed(0)}% 血+${(getTsrBadgeAttrBonus('health') * 100).toFixed(0)}%</p>`;
            side.appendChild(card);
        };
        updateTsrLobbyDashboard.__tsrBadgePatched = true;
    }

    setTimeout(() => {
        injectTsrBadgeLobbyUI();
        renderTsrBadgePanel();
        // 布局层若已初始化，把徽章挂进养成子导航
        try {
            if (window.__tsrLayoutRegisterHubChild) {
                window.__tsrLayoutRegisterHubChild('grow', { id: 'badges', label: '🏅 徽章' });
            }
        } catch (e) { /* ignore */ }
    }, 80);
}

initTsrBadgeExtensions();

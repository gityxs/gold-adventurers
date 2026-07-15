/**
 * 时光秘境 · 收束统一层（须最后加载）
 * - 大厅 Tab 单一切换 + onEnter 刷新
 * - 特殊房：核心权重 + 扩展权重表合并（禁百分比截胡）
 * - 结算真相源见核心 resolveTsrEndClearFlags
 */
const TSR_EXTRA_LOBBY_TABS = {
    systems: 'tsrTabSystems',
    season: 'tsrTabSeason',
    faction: 'tsrTabFaction',
    endgame: 'tsrTabEndgame',
    legends: 'tsrTabLegends',
    combattrain: 'tsrTabCombatTrain',
    badges: 'tsrTabBadges'
};

const TSR_LOBBY_TAB_REFRESH = {
    adventure: () => typeof updateTsrLobbyDashboard === 'function' && updateTsrLobbyDashboard(),
    welfare: () => typeof updateTsrWelfareDisplay === 'function' && updateTsrWelfareDisplay(),
    shop: () => typeof updateTsrShopPreview === 'function' && updateTsrShopPreview(),
    spirit: () => typeof updateTsrSpiritDisplay === 'function' && updateTsrSpiritDisplay(),
    codex: () => typeof updateTsrCodexDisplay === 'function' && updateTsrCodexDisplay(),
    achievements: () => typeof updateTsrAchievementsDisplay === 'function' && updateTsrAchievementsDisplay(),
    quests: () => typeof updateTsrQuestsDisplay === 'function' && updateTsrQuestsDisplay(),
    systems: () => typeof updateTsrDestinyGridDisplay === 'function' && updateTsrDestinyGridDisplay(),
    season: () => typeof renderTsrSeasonPanel === 'function' && renderTsrSeasonPanel(),
    faction: () => typeof renderTsrFactionPanel === 'function' && renderTsrFactionPanel(),
    endgame: () => typeof refreshTsrEndgamePanels === 'function' && refreshTsrEndgamePanels(),
    legends: () => typeof refreshTsrLegendsPanels === 'function' && refreshTsrLegendsPanels(),
    combattrain: () => typeof refreshTsrCombatTrainPanels === 'function' && refreshTsrCombatTrainPanels(),
    badges: () => typeof renderTsrBadgePanel === 'function' && renderTsrBadgePanel()
};

/**
 * 扩展特殊房权重表（并入统一权重池）。
 * w(ctx) 返回 0 = 本局不出。
 */
const TSR_EXT_ROOM_WEIGHT_RULES = [
    { key: 'mutationlab', w: (c) => (c.ls.mutationKills || 0) >= 3 ? 0.55 + c.lv * 0.006 : 0 },
    { key: 'mutationhunt', w: (c) => (c.ls.mutationKills || 0) >= 5 ? 0.5 + c.lv * 0.008 : 0 },
    { key: 'lifeforge', w: (c) => (c.ls.multiLifeKills || 0) >= 2 ? 0.48 + c.lv * 0.006 : 0 },
    { key: 'seasonhall', w: (c) => 0.32 + c.lv * 0.003 },
    { key: 'factionembassy', w: (c) => 0.3 + c.lv * 0.003 },
    { key: 'enclave', w: (c) => 0.28 + c.lv * 0.003 },
    { key: 'bossrushgate', w: (c) => 0.26 + c.lv * 0.002 },
    { key: 'debriefarchive', w: (c) => (c.tsr.debriefHistory || []).length ? 0.3 : 0 },
    { key: 'ghostarena', w: (c) => 0.34 + ((c.tsr.ghostCollection || []).length ? 0.08 : 0) },
    { key: 'dustworkshop', w: () => 0.36 },
    { key: 'weeklygate', w: () => 0.28 },
    { key: 'rankshrine', w: () => 0.3 },
    { key: 'echoarchive', w: () => 0.28 },
    { key: 'cruciblehall', w: () => 0.3 },
    { key: 'bountyboard', w: () => 0.34 },
    { key: 'sigilforge', w: () => 0.32 },
    { key: 'trialgate', w: () => 0.28 },
    { key: 'exchangepost', w: () => 0.3 },
    { key: 'fatedicehall', w: () => 0.26 },
    { key: 'streakshrine', w: () => 0.28 },
    { key: 'shadowaltar', w: () => 0.3 },
    { key: 'omencrypt', w: () => 0.26 },
    { key: 'legendvault', w: () => 0.28 },
    { key: 'chronoarena', w: () => 0.3 },
    { key: 'traindojo', w: () => 0.36 },
    { key: 'stancehall', w: () => 0.32 },
    { key: 'artforge', w: () => 0.3 },
    { key: 'furycrucible', w: () => 0.3 },
    { key: 'battlerankgate', w: () => 0.28 },
    { key: 'meditatepeak', w: () => 0.32 },
    { key: 'sparringpit', w: () => 0.34 },
    { key: 'comboarchive', w: (c) => (c.run?.battleWinStreak || 0) >= 1 ? 0.4 : 0.22 }
];

function getTsrSpecialRoomWeightContext() {
    const tsr = player.timeSecretRealm;
    const sp = typeof ensureTsrSpiritPet === 'function' ? ensureTsrSpiritPet() : { level: 1, bond: 0 };
    return {
        tsr,
        run: tsr?.currentRun,
        ls: tsr?.lifetimeStats || {},
        sp,
        lv: sp.level || 1,
        bond: sp.bond || 0
    };
}

function applyTsrExtRoomWeights(weights, ctx) {
    TSR_EXT_ROOM_WEIGHT_RULES.forEach(rule => {
        let w = 0;
        try { w = Number(rule.w(ctx)) || 0; } catch (e) { w = 0; }
        if (w > 0) weights[rule.key] = (weights[rule.key] || 0) + w;
    });
    const sight = ctx.tsr?.permanentBonuses?.mutationSight || 0;
    if (sight > 0) {
        ['mutationlab', 'mutationhunt', 'lifeforge'].forEach(k => {
            if (weights[k]) weights[k] *= (1 + Math.min(0.35, sight));
        });
    }
    return weights;
}

function pickWeightedTsrRoomKey(weights) {
    const entries = Object.entries(weights).filter(([, w]) => w > 0);
    if (!entries.length) return (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined' && TSR_SPECIAL_ROOM_TYPES[0]) || 'oracle';
    const total = entries.reduce((s, [, w]) => s + w, 0);
    let roll = Math.random() * total;
    for (const [key, w] of entries) {
        roll -= w;
        if (roll <= 0) return key;
    }
    return entries[entries.length - 1][0];
}

/** 策划/调试：当前期望特殊房分布（控制台可调 getTsrSpecialRoomWeightSnapshot()） */
function getTsrSpecialRoomWeightSnapshot() {
    const ctx = getTsrSpecialRoomWeightContext();
    const weights = typeof buildTsrCoreSpecialRoomWeights === 'function'
        ? buildTsrCoreSpecialRoomWeights(ctx)
        : {};
    applyTsrExtRoomWeights(weights, ctx);
    const total = Object.values(weights).reduce((s, w) => s + w, 0) || 1;
    return Object.entries(weights)
        .filter(([, w]) => w > 0)
        .map(([key, w]) => ({ key, w: +w.toFixed(3), pct: +((w / total) * 100).toFixed(2) }))
        .sort((a, b) => b.w - a.w);
}

function initTsrUnifyExtensions() {
    switchTsrLobbyTab = function (tabId) {
        document.querySelectorAll('.tsr-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tsrTab === tabId);
        });
        const panelMap = Object.assign({
            adventure: 'tsrTabAdventure',
            welfare: 'tsrTabWelfare',
            shop: 'tsrTabShop',
            spirit: 'tsrTabSpirit',
            codex: 'tsrTabCodex',
            achievements: 'tsrTabAchievements',
            quests: 'tsrTabQuests'
        }, TSR_EXTRA_LOBBY_TABS);
        const targetId = panelMap[tabId];
        document.querySelectorAll('#tsrLobbyPanel .tsr-tab-panel').forEach(panel => {
            panel.classList.toggle('active', !!targetId && panel.id === targetId);
        });
        const refresher = TSR_LOBBY_TAB_REFRESH[tabId];
        if (typeof refresher === 'function') {
            try { refresher(); } catch (e) { /* ignore */ }
        }
    };
    switchTsrLobbyTab.__tsrUnifyPatched = true;

    pickTsrSpecialRoom = function () {
        const ctx = getTsrSpecialRoomWeightContext();
        const weights = typeof buildTsrCoreSpecialRoomWeights === 'function'
            ? buildTsrCoreSpecialRoomWeights(ctx)
            : (() => {
                const w = {};
                (TSR_SPECIAL_ROOM_TYPES || []).forEach(k => { w[k] = 1; });
                return w;
            })();
        applyTsrExtRoomWeights(weights, ctx);
        return pickWeightedTsrRoomKey(weights);
    };
    pickTsrSpecialRoom.__tsrUnifyPatched = true;

    if (typeof window !== 'undefined') {
        window.getTsrSpecialRoomWeightSnapshot = getTsrSpecialRoomWeightSnapshot;
    }
}

initTsrUnifyExtensions();

/**
 * 时光秘境 · 新系统扩展
 * 命格盘 / 装备词条精通 / 套装共鸣 / 遭遇链 / 周界词补全
 */
const TSR_DESTINY_ROUTES = {
    combat: { id: 'combat', name: '战意命格', icon: '⚔️', desc: '攻击、暴击、连击向永久与局内加成', unlockHint: '默认解锁' },
    fortune: { id: 'fortune', name: '彩运命格', icon: '🎰', desc: '秘境币、赌局、特殊房遭遇强化', unlockHint: '通关3次后解锁', needClears: 3 },
    void: { id: 'void', name: '虚空命格', icon: '🕳️', desc: '虚空共鸣、遗物、时光与反击减免', unlockHint: '冒险8次后解锁', needRuns: 8 }
};

const TSR_DESTINY_NODES = {
    c_blade: { id: 'c_blade', route: 'combat', name: '剑锋', icon: '⚔️', cost: 45000, prev: null, desc: '永久攻击+3%', permanent: { eternalAttackBonus: 0.03 } },
    c_precision: { id: 'c_precision', route: 'combat', name: '精准', icon: '💥', cost: 70000, prev: 'c_blade', desc: '开局暴击+5%', runBuff: { effect: 'critRate', value: 0.05 } },
    c_fury: { id: 'c_fury', route: 'combat', name: '狂怒', icon: '🔥', cost: 110000, prev: 'c_precision', desc: '开局暴伤+12%', runBuff: { effect: 'critDamage', value: 0.12 } },
    c_slayer: { id: 'c_slayer', route: 'combat', name: '猎杀', icon: '👑', cost: 160000, prev: 'c_fury', desc: '开局首领攻+14%', runBuff: { effect: 'bossAttack', value: 0.14 } },
    c_combo: { id: 'c_combo', route: 'combat', name: '连斩', icon: '🔗', cost: 220000, prev: 'c_slayer', desc: '永久连击收益+6%', permanent: { comboBonus: 0.06 } },

    f_coin: { id: 'f_coin', route: 'fortune', name: '聚财', icon: '💰', cost: 40000, prev: null, desc: '永久局内币+6%', permanent: { runCurrencyBonus: 0.06 } },
    f_gamble: { id: 'f_gamble', route: 'fortune', name: '赌运', icon: '🎲', cost: 65000, prev: 'f_coin', desc: '永久赌局+7%', permanent: { gambleBonus: 0.07 } },
    f_event: { id: 'f_event', route: 'fortune', name: '奇遇', icon: '✨', cost: 100000, prev: 'f_gamble', desc: '开局事件+12%', runMod: { eventBonusRun: 0.12 } },
    f_room: { id: 'f_room', route: 'fortune', name: '秘境', icon: '🧭', cost: 150000, prev: 'f_event', desc: '永久特殊房+3%', permanent: { spiritPact: 0.03 } },
    f_meme: { id: 'f_meme', route: 'fortune', name: '梗运', icon: '🃏', cost: 200000, prev: 'f_room', desc: '开局梗房权重+25%', runMod: { memeMult: 1.25 } },

    v_echo: { id: 'v_echo', route: 'void', name: '回响', icon: '🕳️', cost: 50000, prev: null, desc: '开局虚空共鸣+16%', runMod: { resonanceGainMult: 0.16 } },
    v_relic: { id: 'v_relic', route: 'void', name: '遗引', icon: '🏺', cost: 80000, prev: 'v_echo', desc: '永久遗物率+6%', permanent: { relicMagnet: 0.06 } },
    v_time: { id: 'v_time', route: 'void', name: '时砂', icon: '⏳', cost: 120000, prev: 'v_relic', desc: '永久每层+3秒', permanent: { floorTimeBonus: 3 } },
    v_ward: { id: 'v_ward', route: 'void', name: '避反', icon: '🛡️', cost: 170000, prev: 'v_time', desc: '永久反击-7%', permanent: { counterReduce: 0.07 } },
    v_spirit: { id: 'v_spirit', route: 'void', name: '灵脉', icon: '🧚', cost: 230000, prev: 'v_ward', desc: '永久精灵充能+9%', permanent: { spiritChargeAmp: 0.09 } },

    c_apex: { id: 'c_apex', route: 'combat', name: '登峰', icon: '🏔️', cost: 300000, prev: 'c_combo', desc: '永久攻击+4%，连击+3%', permanent: { eternalAttackBonus: 0.04, comboBonus: 0.03 } },
    f_jackpot: { id: 'f_jackpot', route: 'fortune', name: '鸿运', icon: '🌟', cost: 280000, prev: 'f_meme', desc: '永久通关奖励+7%', permanent: { clearRewardBonus: 0.07 } },
    v_singularity: { id: 'v_singularity', route: 'void', name: '奇点', icon: '💠', cost: 320000, prev: 'v_spirit', desc: '永久遗物率+7%，每层+2秒', permanent: { relicMagnet: 0.07, floorTimeBonus: 2 } }
};

const TSR_AFFIX_MASTERY_CATEGORIES = {
    combat: { name: '锋芒', icon: '⚔️', stats: ['attack', 'critRate', 'critDamage', 'pen', 'damageAmp', 'bossDamage', 'eliteDamage', 'mythicDamage', 'execution', 'firstStrike', 'multiHit', 'physicalPower', 'spellPower', 'lifeSteal', 'vampiric', 'afflictDamage', 'counterAmp'] },
    defense: { name: '铁壁', icon: '🛡️', stats: ['health', 'armor', 'counterReduce', 'dodge', 'block', 'parry', 'evasion', 'regen', 'thorns', 'shield', 'reflect', 'absorb', 'resilience', 'fireResist', 'iceResist', 'poisonResist', 'curseResist'] },
    utility: { name: '玄机', icon: '🔮', stats: ['spiritCharge', 'spiritBond', 'spiritHeal', 'currencyGain', 'battleReward', 'treasureBonus', 'eventLuck', 'exploreBonus', 'restBonus', 'gambleLuck', 'fortune', 'timeSave', 'chronoBoost', 'floorBonus', 'timeGain', 'memeBonus', 'specialRoom', 'relicLuck', 'equipDrop', 'wisdom'] },
    elemental: { name: '元素', icon: '🌈', stats: ['fireDamage', 'iceDamage', 'lightningDamage', 'poisonDamage', 'arcaneDamage', 'holyPower', 'shadowPower', 'elemental', 'chaosPower', 'cursePower'] },
    mythic: { name: '神话', icon: '🌸', stats: ['voidPower', 'doomPower', 'entropy', 'resonanceGain', 'spiritStrike', 'affixHunter', 'comboBoost'] }
};

const TSR_AFFIX_MASTERY_THRESHOLDS = [
    { level: 1, need: 3, bonus: { runCurrencyBonus: 0.01 }, label: '入门' },
    { level: 2, need: 8, bonus: { eternalAttackBonus: 0.01 }, label: '熟稔' },
    { level: 3, need: 15, bonus: { affixTome: 0.02 }, label: '精通' },
    { level: 4, need: 25, bonus: { relicMagnet: 0.02 }, label: '大师' },
    { level: 5, need: 40, bonus: { comboBonus: 0.02 }, label: '宗师' }
];

const TSR_SET_RESONANCE_TIERS = [
    { need: 3, name: '微鸣', bonus: { eternalAttackBonus: 0.01 }, desc: '攻击+1%' },
    { need: 6, name: '共鸣', bonus: { eternalHealthBonus: 0.015 }, desc: '生命+1.5%' },
    { need: 10, name: '潮涌', bonus: { runCurrencyBonus: 0.03 }, desc: '局内币+3%' },
    { need: 15, name: '星链', bonus: { floorTimeBonus: 2 }, desc: '每层+2秒' },
    { need: 20, name: '天织', bonus: { clearRewardBonus: 0.05 }, desc: '通关奖励+5%' }
];

const TSR_ENCOUNTER_CHAIN_MILESTONES = [
    { chain: 3, reward: { currency: 35, log: '遭遇链×3！额外秘境币', theme: 'gold' } },
    { chain: 5, reward: { eventBonusRun: 0.05, log: '遭遇链×5！本局事件+5%', theme: 'legend' } },
    { chain: 7, reward: { voidResonance: 6, log: '遭遇链×7！虚空共鸣+6', theme: 'void' } },
    { chain: 10, reward: { spiritCharge: 40, log: '遭遇链×10！精灵充能+40', theme: 'spirit' } },
    { chain: 15, reward: { currency: 120, buff: { effect: 'attack', value: 0.15, duration: 4 }, log: '遭遇链×15！大丰收+攻击buff', theme: 'epic' } }
];

const TSR_SYSTEMS_ACHIEVEMENTS = [
    { id: 'destinyFirst', name: '命格初醒', desc: '解锁第一个命格节点', icon: '🔮' },
    { id: 'destinyRouteComplete', name: '一路通天', desc: '完整解锁一条命格路线', icon: '☯️' },
    { id: 'affixMastery3', name: '词条大师', desc: '任一词条精通达到3级', icon: '📘' },
    { id: 'setResonance10', name: '套装共鸣', desc: '图鉴记录10种套装', icon: '🧩' },
    { id: 'encounterChain7', name: '奇遇连珠', desc: '单局遭遇链达到7', icon: '✨' },
    { id: 'encounterChain15', name: '链界至尊', desc: '单局遭遇链达到15', icon: '⛓️' },
    { id: 'destinyAllRoutes', name: '三界命格', desc: '三条命格路线各解锁至少3个节点', icon: '🔮' }
];

function ensureTsrDestinyGrid() {
    const tsr = player.timeSecretRealm;
    if (!tsr.destinyGrid) {
        tsr.destinyGrid = { unlocked: {}, activeRoute: 'combat' };
    }
    if (!tsr.destinyGrid.unlocked) tsr.destinyGrid.unlocked = {};
    if (!tsr.destinyGrid.activeRoute) tsr.destinyGrid.activeRoute = 'combat';
    return tsr.destinyGrid;
}

function canUnlockTsrDestinyRoute(routeId) {
    const route = TSR_DESTINY_ROUTES[routeId];
    const tsr = player.timeSecretRealm;
    if (!route) return false;
    if (!route.needClears && !route.needRuns) return true;
    if (route.needClears && (tsr.clearCount || 0) < route.needClears) return false;
    if (route.needRuns && (tsr.totalRuns || 0) < route.needRuns) return false;
    return true;
}

function canUnlockTsrDestinyNode(nodeId) {
    const node = TSR_DESTINY_NODES[nodeId];
    if (!node) return false;
    const dg = ensureTsrDestinyGrid();
    if (dg.unlocked[nodeId]) return false;
    if (!canUnlockTsrDestinyRoute(node.route)) return false;
    if (node.prev && !dg.unlocked[node.prev]) return false;
    const tsr = player.timeSecretRealm;
    return (tsr.currency || 0) >= node.cost;
}

function unlockTsrDestinyNode(nodeId) {
    const node = TSR_DESTINY_NODES[nodeId];
    if (!node || !canUnlockTsrDestinyNode(nodeId)) {
        logAction('无法解锁该命格节点', 'error');
        return false;
    }
    const tsr = player.timeSecretRealm;
    const dg = ensureTsrDestinyGrid();
    tsr.currency -= node.cost;
    dg.unlocked[nodeId] = Date.now();
    if (node.permanent) {
        if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
        Object.entries(node.permanent).forEach(([k, v]) => {
            if (k === 'eternalAttackBonus' || k === 'eternalHealthBonus') {
                tsr.permanentBonuses[k] = typeof clampTsrEternalBonus === 'function'
                    ? clampTsrEternalBonus((tsr.permanentBonuses[k] || 0) + v)
                    : Math.min((typeof TSR_ETERNAL_BONUS_MAX === 'number' ? TSR_ETERNAL_BONUS_MAX : 0.75), (tsr.permanentBonuses[k] || 0) + v);
            } else if (k === 'counterReduce') {
                tsr.permanentBonuses[k] = Math.min(
                    (typeof TSR_COUNTER_REDUCE_MAX === 'number' ? TSR_COUNTER_REDUCE_MAX : 0.55),
                    (tsr.permanentBonuses[k] || 0) + v
                );
            } else if (k === 'floorTimeBonus') {
                const floorCap = typeof TSR_FLOOR_TIME_BONUS_MAX === 'number' ? TSR_FLOOR_TIME_BONUS_MAX : 36;
                tsr.permanentBonuses[k] = Math.min(floorCap, (tsr.permanentBonuses[k] || 0) + v);
            } else {
                tsr.permanentBonuses[k] = (tsr.permanentBonuses[k] || 0) + v;
            }
        });
    }
    logAction(`命格【${node.name}】已解锁：${node.desc}`, 'success');
    checkTsrSystemsAchievements();
    invalidateTsrUiCache(['systems', 'shop']);
    updateTsrDestinyGridDisplay();
    if (typeof updateTimeSecretRealmUI === 'function') updateTimeSecretRealmUI();
    return true;
}

function selectTsrDestinyRoute(routeId) {
    if (!TSR_DESTINY_ROUTES[routeId]) return;
    if (!canUnlockTsrDestinyRoute(routeId)) {
        logAction(TSR_DESTINY_ROUTES[routeId].unlockHint || '路线尚未解锁', 'warning');
        return;
    }
    ensureTsrDestinyGrid().activeRoute = routeId;
    updateTsrDestinyGridDisplay();
    logAction(`已切换命格路线：${TSR_DESTINY_ROUTES[routeId].name}`, 'success');
}

function getTsrActiveDestinyNodes() {
    const dg = ensureTsrDestinyGrid();
    return Object.keys(TSR_DESTINY_NODES).filter(id => {
        const n = TSR_DESTINY_NODES[id];
        return dg.unlocked[id] && n.route === dg.activeRoute;
    });
}

function applyTsrDestinyAtRunStart() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    const active = getTsrActiveDestinyNodes();
    active.forEach(id => {
        const node = TSR_DESTINY_NODES[id];
        if (node.runBuff) {
            if (node.runBuff.effect === 'bossAttack') {
                tsr.currentRun.destinyBossAttack = (tsr.currentRun.destinyBossAttack || 0) + node.runBuff.value;
            } else {
                addTempBuff({ name: '命格·' + node.name, effect: node.runBuff.effect, value: node.runBuff.value, duration: 0, isDebuff: false });
            }
        }
        if (node.runMod) {
            Object.entries(node.runMod).forEach(([k, v]) => {
                if (k === 'eventBonusRun') tsr.currentRun.eventBonusRun = (tsr.currentRun.eventBonusRun || 0) + v;
                if (k === 'resonanceGainMult') tsr.currentRun.resonanceGainMult = (tsr.currentRun.resonanceGainMult || 1) + v;
                if (k === 'memeMult' && tsr.currentRun.contractMods) {
                    tsr.currentRun.contractMods.memeMult = (tsr.currentRun.contractMods.memeMult || 1) * v;
                }
            });
        }
    });
    if (active.length) {
        const route = TSR_DESTINY_ROUTES[ensureTsrDestinyGrid().activeRoute];
        addTsrLog(`🔮 命格路线【${route.name}】生效（${active.length}节点）`, 'info', 'legend');
    }
}

function getTsrAffixMasteryProgress() {
    const tsr = player.timeSecretRealm;
    const codex = tsr?.codex?.equipmentAffixes || {};
    const progress = {};
    Object.entries(TSR_AFFIX_MASTERY_CATEGORIES).forEach(([catId, cat]) => {
        let discovered = 0;
        if (typeof TSR_EQUIP_AFFIX_POOL !== 'undefined') {
            TSR_EQUIP_AFFIX_POOL.forEach(ax => {
                const keys = Object.keys(ax.stats || {});
                if (keys.some(k => cat.stats.includes(k)) && (codex[ax.id] || 0) > 0) discovered++;
            });
        }
        let level = 0;
        TSR_AFFIX_MASTERY_THRESHOLDS.forEach(t => { if (discovered >= t.need) level = t.level; });
        progress[catId] = { discovered, level, cat };
    });
    return progress;
}

function applyTsrAffixMasteryPermanent() {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return;
    const tsr = player.timeSecretRealm;
    if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
    const progress = getTsrAffixMasteryProgress();
    if (!tsr._affixMasteryApplied) tsr._affixMasteryApplied = {};
    Object.entries(progress).forEach(([catId, p]) => {
        const tier = TSR_AFFIX_MASTERY_THRESHOLDS.find(t => t.level === p.level);
        if (!tier) return;
        const key = catId + '_' + p.level;
        if (tsr._affixMasteryApplied[key]) return;
        Object.entries(tier.bonus).forEach(([bk, bv]) => {
            if (bk === 'eternalAttackBonus' || bk === 'eternalHealthBonus') {
                tsr.permanentBonuses[bk] = typeof clampTsrEternalBonus === 'function'
                    ? clampTsrEternalBonus((tsr.permanentBonuses[bk] || 0) + bv)
                    : Math.min((typeof TSR_ETERNAL_BONUS_MAX === 'number' ? TSR_ETERNAL_BONUS_MAX : 0.75), (tsr.permanentBonuses[bk] || 0) + bv);
            } else {
                tsr.permanentBonuses[bk] = (tsr.permanentBonuses[bk] || 0) + bv;
            }
        });
        tsr._affixMasteryApplied[key] = true;
    });
}

function getTsrSetResonanceTier() {
    const count = Object.keys(player.timeSecretRealm?.codex?.equipmentSets || {}).length;
    let tier = null;
    TSR_SET_RESONANCE_TIERS.forEach(t => { if (count >= t.need) tier = t; });
    return { count, tier };
}

function applyTsrSetResonancePermanent() {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return;
    const tsr = player.timeSecretRealm;
    const { tier } = getTsrSetResonanceTier();
    if (!tier) return;
    if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
    if (!tsr._setResonanceTier) tsr._setResonanceTier = 0;
    if (tsr._setResonanceTier >= tier.need) return;
    TSR_SET_RESONANCE_TIERS.forEach(t => {
        if (t.need > tsr._setResonanceTier && tier.need >= t.need) {
            Object.entries(t.bonus).forEach(([k, v]) => {
                if (k === 'eternalAttackBonus' || k === 'eternalHealthBonus') {
                    tsr.permanentBonuses[k] = typeof clampTsrEternalBonus === 'function'
                        ? clampTsrEternalBonus((tsr.permanentBonuses[k] || 0) + v)
                        : Math.min((typeof TSR_ETERNAL_BONUS_MAX === 'number' ? TSR_ETERNAL_BONUS_MAX : 0.75), (tsr.permanentBonuses[k] || 0) + v);
                } else {
                    tsr.permanentBonuses[k] = (tsr.permanentBonuses[k] || 0) + v;
                }
            });
        }
    });
    tsr._setResonanceTier = tier.need;
}

function applyTsrSystemsAtRunStart() {
    applyTsrAffixMasteryPermanent();
    applyTsrSetResonancePermanent();
    applyTsrDestinyAtRunStart();
    const tsr = player.timeSecretRealm;
    if (tsr?.currentRun) {
        tsr.currentRun.encounterChain = 0;
        tsr.currentRun.encounterChainPeak = 0;
        tsr.currentRun._chainMilestones = {};
    }
}

function isTsrEncounterChainRoom(roomType) {
    if (!roomType) return false;
    if (typeof TSR_MEME_ROOM_TYPES !== 'undefined' && TSR_MEME_ROOM_TYPES.includes(roomType)) return true;
    if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined' && TSR_SPECIAL_ROOM_TYPES.includes(roomType)) return true;
    if (typeof TSR_CONTENT_ROOM_DEFS !== 'undefined' && TSR_CONTENT_ROOM_DEFS[roomType]) return true;
    return roomType.startsWith('spirit');
}

function bumpTsrEncounterChain(roomType) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive || !isTsrEncounterChainRoom(roomType)) return;
    tsr.currentRun.encounterChain = (tsr.currentRun.encounterChain || 0) + 1;
    tsr.currentRun.encounterChainPeak = Math.max(tsr.currentRun.encounterChainPeak || 0, tsr.currentRun.encounterChain);
    const chain = tsr.currentRun.encounterChain;
    if (chain >= 2) addTsrLog(`✨ 遭遇链 ×${chain}`, 'info', 'legend');
    updateTsrEncounterChainDisplay();
}

function breakTsrEncounterChain() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    if ((tsr.currentRun.encounterChain || 0) > 0) {
        tsr.currentRun.encounterChain = 0;
        updateTsrEncounterChainDisplay();
    }
}

function applyTsrEncounterChainMilestones() {
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    if (!run?.isActive) return;
    const chain = run.encounterChain || 0;
    if (!run._chainMilestones) run._chainMilestones = {};
    const dm = run.difficultyMultiplier || 1;
    const mult = run.chainBonusMult || 1;
    TSR_ENCOUNTER_CHAIN_MILESTONES.forEach(ms => {
        if (chain < ms.chain || run._chainMilestones[ms.chain]) return;
        run._chainMilestones[ms.chain] = true;
        const r = ms.reward;
        if (r.currency) addTsrRunCurrency(Math.floor(r.currency * dm * mult));
        if (r.eventBonusRun) run.eventBonusRun = (run.eventBonusRun || 0) + r.eventBonusRun * mult;
        if (r.voidResonance) addTsrVoidResonance(Math.floor(r.voidResonance * mult));
        if (r.spiritCharge) chargeTsrSpirit(Math.floor(r.spiritCharge * mult));
        if (r.buff) addTempBuff({ name: '遭遇链', effect: r.buff.effect, value: r.buff.value * mult, duration: r.buff.duration, isDebuff: false });
        if (r.log) addTsrLog(r.log, 'success', r.theme);
    });
    if (chain >= 7) checkTsrSystemsAchievements({ chainPeak: chain });
    if (chain >= 15) checkTsrSystemsAchievements({ chainPeak: chain });
    updateTsrEncounterChainDisplay();
}

function updateTsrEncounterChainDisplay() {
    const wrap = document.getElementById('tsrEncounterChainWrap');
    const fill = document.getElementById('tsrEncounterChainFill');
    const val = document.getElementById('tsrEncounterChainVal');
    if (!wrap || !fill || !val) return;
    const run = player.timeSecretRealm?.currentRun;
    if (!run?.isActive) {
        wrap.style.display = 'none';
        return;
    }
    const chain = run.encounterChain || 0;
    const peak = run.encounterChainPeak || 0;
    wrap.style.display = 'flex';
    val.textContent = `×${chain}`;
    const pct = Math.min(100, (chain / 15) * 100);
    fill.style.width = pct + '%';
    wrap.classList.toggle('tsr-chain-hot', chain >= 5);
    wrap.classList.toggle('tsr-chain-max', chain >= 10);
    wrap.title = `本局峰值 ×${peak} · 战斗会打断链条`;
}

function checkTsrSystemsAchievements(ctx) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.achievements) tsr.achievements = {};
    const unlock = (id) => {
        if (!tsr.achievements[id]) {
            tsr.achievements[id] = Date.now();
            const a = (typeof TSR_ACHIEVEMENTS !== 'undefined' ? TSR_ACHIEVEMENTS : []).find(x => x.id === id)
                || TSR_SYSTEMS_ACHIEVEMENTS.find(x => x.id === id);
            if (a) addTsrLog(`🏅 成就解锁：${a.name} — ${a.desc}`, 'success');
            invalidateTsrUiCache('codex');
        }
    };
    const dg = ensureTsrDestinyGrid();
    if (Object.keys(dg.unlocked).length >= 1) unlock('destinyFirst');
    ['combat', 'fortune', 'void'].forEach(route => {
        const nodes = Object.values(TSR_DESTINY_NODES).filter(n => n.route === route);
        if (nodes.every(n => dg.unlocked[n.id])) unlock('destinyRouteComplete');
    });
    const mastery = getTsrAffixMasteryProgress();
    if (Object.values(mastery).some(p => p.level >= 3)) unlock('affixMastery3');
    if (Object.keys(tsr.codex?.equipmentSets || {}).length >= 10) unlock('setResonance10');
    if ((ctx?.chainPeak || tsr.currentRun?.encounterChainPeak || 0) >= 7) unlock('encounterChain7');
    if ((ctx?.chainPeak || tsr.currentRun?.encounterChainPeak || 0) >= 15) unlock('encounterChain15');
    const routeCounts = ['combat', 'fortune', 'void'].map(route =>
        Object.values(TSR_DESTINY_NODES).filter(n => n.route === route && dg.unlocked[n.id]).length
    );
    if (routeCounts.every(c => c >= 3)) unlock('destinyAllRoutes');
}

function updateTsrDestinyGridDisplay() {
    const container = document.getElementById('tsrSystemsContent');
    if (!container) return;
    const tsr = player.timeSecretRealm;
    const dg = ensureTsrDestinyGrid();
    const mastery = getTsrAffixMasteryProgress();
    const resonance = getTsrSetResonanceTier();

    let routeHtml = '<div class="tsr-systems-routes">';
    Object.values(TSR_DESTINY_ROUTES).forEach(route => {
        const unlocked = canUnlockTsrDestinyRoute(route.id);
        const active = dg.activeRoute === route.id;
        routeHtml += `<button type="button" class="tsr-btn ${active ? 'tsr-btn-gold' : 'tsr-btn-ghost'} tsr-systems-route-btn" onclick="selectTsrDestinyRoute('${route.id}')" ${unlocked ? '' : 'disabled'} title="${route.unlockHint}">${route.icon} ${route.name}</button>`;
    });
    routeHtml += '</div>';

    let nodeHtml = '<div class="tsr-destiny-grid">';
    Object.values(TSR_DESTINY_NODES).filter(n => n.route === dg.activeRoute).forEach(node => {
        const owned = !!dg.unlocked[node.id];
        const canBuy = canUnlockTsrDestinyNode(node.id);
        let cls = 'tsr-destiny-node';
        if (owned) cls += ' owned';
        else if (canBuy) cls += ' available';
        else cls += ' locked';
        nodeHtml += `<div class="${cls}">
            <div class="tsr-destiny-node-head">${node.icon} <strong>${node.name}</strong></div>
            <p>${node.desc}</p>
            <small>${owned ? '已解锁' : node.cost.toLocaleString() + '币'}</small>
            ${owned ? '' : `<button type="button" class="tsr-btn tsr-btn-sm tsr-btn-purple" onclick="unlockTsrDestinyNode('${node.id}')" ${canBuy ? '' : 'disabled'}>解锁</button>`}
        </div>`;
    });
    nodeHtml += '</div>';

    let masteryHtml = '<div class="tsr-mastery-grid">';
    Object.entries(mastery).forEach(([id, p]) => {
        const tier = TSR_AFFIX_MASTERY_THRESHOLDS.find(t => t.level === p.level);
        masteryHtml += `<div class="tsr-mastery-card">
            <strong>${p.cat.icon} ${p.cat.name}</strong>
            <span>Lv${p.level}${tier ? ' · ' + tier.label : ''}</span>
            <small>已见词条 ${p.discovered}</small>
        </div>`;
    });
    masteryHtml += '</div>';

    const resTier = resonance.tier;
    container.innerHTML = `
        <section class="tsr-systems-section">
            <h3 class="tsr-block-title">🔮 命格盘 <span class="tsr-block-sub">消耗秘境币解锁，选一路线激活局内加成</span></h3>
            ${routeHtml}
            ${nodeHtml}
        </section>
        <section class="tsr-systems-section">
            <h3 class="tsr-block-title">📘 词条精通 <span class="tsr-block-sub">图鉴见过的装备词条越多，永久加成越高</span></h3>
            ${masteryHtml}
        </section>
        <section class="tsr-systems-section">
            <h3 class="tsr-block-title">🧩 套装共鸣 <span class="tsr-block-sub">图鉴套装种类解锁阶梯奖励</span></h3>
            <p>已记录 <strong>${resonance.count}</strong> 种套装${resTier ? ` · 当前【${resTier.name}】${resTier.desc}` : ''}</p>
            <div class="tsr-resonance-tiers">${TSR_SET_RESONANCE_TIERS.map(t => {
                const done = resonance.count >= t.need;
                return `<span class="tsr-res-tier ${done ? 'done' : ''}">${t.need}套·${t.name}</span>`;
            }).join('')}</div>
        </section>
        <section class="tsr-systems-section">
            <h3 class="tsr-block-title">✨ 遭遇链 <span class="tsr-block-sub">连续特殊/梗/奇遇房叠加奖励，战斗打断</span></h3>
            <p>连续探索奇遇房间可触发额外奖励：3链+币 · 5链+事件 · 7链+虚空 · 10链+充能</p>
        </section>`;
}

function injectTsrSystemsTab() {
    const nav = document.querySelector('.tsr-tab-nav-v3');
    if (!nav || document.getElementById('tsrTabSystems')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tsr-tab-btn';
    btn.dataset.tsrTab = 'systems';
    btn.onclick = () => switchTsrLobbyTab('systems');
    btn.textContent = '🔮 命格秘术';
    const shopBtn = nav.querySelector('[data-tsr-tab="shop"]');
    if (shopBtn?.nextSibling) nav.insertBefore(btn, shopBtn.nextSibling);
    else nav.appendChild(btn);

    const lobby = document.getElementById('tsrLobbyPanel');
    if (!lobby || document.getElementById('tsrTabSystems')) return;
    const panel = document.createElement('div');
    panel.id = 'tsrTabSystems';
    panel.className = 'tsr-tab-panel';
    panel.innerHTML = '<p class="tsr-tab-hint">命格盘永久养成、词条精通与套装共鸣、遭遇链局内联动。秘境币在商店与命格间取舍。</p><div id="tsrSystemsContent" class="tsr-systems-panel"></div>';
    lobby.appendChild(panel);
}

function initTsrSystemsExtensions() {
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') {
        TSR_ACHIEVEMENTS.push(...TSR_SYSTEMS_ACHIEVEMENTS);
    }
    if (typeof TSR_TICKER_LINES !== 'undefined') {
        TSR_TICKER_LINES.push(
            '新系统：命格盘可在「命格秘术」页消耗秘境币解锁',
            '连续探索奇遇房间可触发遭遇链额外奖励',
            '装备词条图鉴收集越多，词条精通永久加成越高'
        );
    }

    injectTsrSystemsTab();

    if (typeof applyTsrFateCard === 'function' && !applyTsrFateCard.__tsrSystemsPatched) {
        const _origFate = applyTsrFateCard;
        applyTsrFateCard = function () {
            _origFate();
            applyTsrSystemsAtRunStart();
        };
        applyTsrFateCard.__tsrSystemsPatched = true;
    }

    if (typeof applyTsrWeeklyModifier === 'function' && !applyTsrWeeklyModifier.__tsrSystemsPatched) {
        const _origWeekly = applyTsrWeeklyModifier;
        applyTsrWeeklyModifier = function () {
            _origWeekly();
            const tsr = player.timeSecretRealm;
            const modId = tsr?.engagement?.weeklyModId;
            const effects = TSR_WEEKLY_MODIFIER_EFFECTS?.[modId];
            const meta = typeof getTsrWeeklyModifier === 'function' ? getTsrWeeklyModifier() : null;
            if (!effects || !tsr?.currentRun?.weeklyBonus) return;
            const wb = tsr.currentRun.weeklyBonus;
            if (effects.health) {
                addTempBuff({ name: meta?.name || '界词', effect: 'health', value: effects.health, duration: 0, isDebuff: false });
            }
            if (effects.pen) {
                tsr.currentRun.weeklyPen = (tsr.currentRun.weeklyPen || 0) + effects.pen;
            }
            if (effects.resonanceGain) {
                tsr.currentRun.resonanceGainMult = (tsr.currentRun.resonanceGainMult || 1) + effects.resonanceGain;
            }
            if (effects.gamble && tsr.currentRun.contractMods) {
                tsr.currentRun.contractMods.gamble = (tsr.currentRun.contractMods.gamble || 0) + effects.gamble;
            }
            if (effects.eventBonus) {
                tsr.currentRun.eventBonusRun = (tsr.currentRun.eventBonusRun || 0) + effects.eventBonus;
            }
            if (effects.currencyMod && tsr.currentRun.contractMods) {
                tsr.currentRun.contractMods.currencyMod = (tsr.currentRun.contractMods.currencyMod || 0) + effects.currencyMod;
            }
            if (effects.treasureBonus) {
                tsr.currentRun.treasureBonusRun = (tsr.currentRun.treasureBonusRun || 0) + effects.treasureBonus;
            }
            if (effects.eliteCurrencyBonus && tsr.currentRun.contractMods) {
                tsr.currentRun.contractMods.eliteCurrencyBonus = (tsr.currentRun.contractMods.eliteCurrencyBonus || 0) + effects.eliteCurrencyBonus;
            }
            if (effects.critDamage) {
                addTempBuff({ name: meta?.name || '界词', effect: 'critDamage', value: effects.critDamage, duration: 0, isDebuff: false });
            }
            if (effects.floorTime && tsr.currentRun.contractMods) {
                tsr.currentRun.contractMods.floorTime = (tsr.currentRun.contractMods.floorTime || 0) + effects.floorTime;
            }
            if (effects.spiritHealBonus) {
                tsr.currentRun.spiritHealBonusRun = (tsr.currentRun.spiritHealBonusRun || 0) + effects.spiritHealBonus;
            }
        };
        applyTsrWeeklyModifier.__tsrSystemsPatched = true;
    }

    if (typeof getTsrBattleAttackBonus === 'function' && !getTsrBattleAttackBonus.__tsrSystemsPatched) {
        const _origBattleAtk = getTsrBattleAttackBonus;
        getTsrBattleAttackBonus = function (isBoss, isElite) {
            let bonus = _origBattleAtk(isBoss, isElite);
            if (isBoss) bonus += Number(player.timeSecretRealm?.currentRun?.destinyBossAttack) || 0;
            return bonus;
        };
        getTsrBattleAttackBonus.__tsrSystemsPatched = true;
    }

    if (typeof getTsrEquipBonus === 'function' && !getTsrEquipBonus.__tsrSystemsPatched) {
        const _origEquipBonus = getTsrEquipBonus;
        getTsrEquipBonus = function (stat) {
            let v = _origEquipBonus(stat);
            if (stat === 'pen') v += Number(player.timeSecretRealm?.currentRun?.weeklyPen) || 0;
            return v;
        };
        getTsrEquipBonus.__tsrSystemsPatched = true;
    }

    if (typeof recordTsrCodex === 'function' && !recordTsrCodex.__tsrSystemsPatched) {
        const _origCodex = recordTsrCodex;
        recordTsrCodex = function (roomType) {
            bumpTsrEncounterChain(roomType);
            return _origCodex(roomType);
        };
        recordTsrCodex.__tsrSystemsPatched = true;
    }

    if (typeof handleBattleRoom === 'function' && !handleBattleRoom.__tsrSystemsPatched) {
        const _origBattle = handleBattleRoom;
        handleBattleRoom = function (options) {
            breakTsrEncounterChain();
            return _origBattle(options);
        };
        handleBattleRoom.__tsrSystemsPatched = true;
    }

    if (typeof finishTsrMemeRoom === 'function' && !finishTsrMemeRoom.__tsrSystemsPatched) {
        const _origFinish = finishTsrMemeRoom;
        finishTsrMemeRoom = function () {
            applyTsrEncounterChainMilestones();
            return _origFinish();
        };
        finishTsrMemeRoom.__tsrSystemsPatched = true;
    }

    if (typeof addTsrEquipment === 'function' && !addTsrEquipment.__tsrSystemsPatched) {
        const _origEquip = addTsrEquipment;
        addTsrEquipment = function (item, source) {
            const r = _origEquip(item, source);
            applyTsrSetResonancePermanent();
            checkTsrSystemsAchievements();
            return r;
        };
        addTsrEquipment.__tsrSystemsPatched = true;
    }

    if (typeof updateTsrLobbyDashboard === 'function' && !updateTsrLobbyDashboard.__tsrSystemsPatched) {
        const _origDash = updateTsrLobbyDashboard;
        updateTsrLobbyDashboard = function () {
            _origDash();
            const side = document.getElementById('tsrDashboardContent');
            const dg = ensureTsrDestinyGrid();
            const route = TSR_DESTINY_ROUTES[dg.activeRoute];
            const activeCount = getTsrActiveDestinyNodes().length;
            if (side && route) {
                const card = document.createElement('div');
                card.className = 'tsr-dash-card';
                card.innerHTML = `<div class="tsr-block-title">🔮 命格</div><p>${route.icon} ${route.name} · 激活${activeCount}节点</p>`;
                side.appendChild(card);
            }
        };
        updateTsrLobbyDashboard.__tsrSystemsPatched = true;
    }

    if (typeof checkTsrAchievements === 'function' && !checkTsrAchievements.__tsrSystemsPatched) {
        const _origAch = checkTsrAchievements;
        checkTsrAchievements = function (ctx) {
            _origAch(ctx);
            checkTsrSystemsAchievements(ctx);
        };
        checkTsrAchievements.__tsrSystemsPatched = true;
    }

    if (typeof updateTsrRunPanelUI === 'function' && !updateTsrRunPanelUI.__tsrSystemsPatched) {
        const _origRunUI = updateTsrRunPanelUI;
        updateTsrRunPanelUI = function (options) {
            _origRunUI(options);
            updateTsrEncounterChainDisplay();
        };
        updateTsrRunPanelUI.__tsrSystemsPatched = true;
    }
}

initTsrSystemsExtensions();

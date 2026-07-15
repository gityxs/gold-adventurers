/**
 * 时光秘境 · 世界大图景扩展
 * 赛季通行证 / 三势力声望 / 每日修饰局 / Boss Rush / 环境气候
 * 局终复盘 / 怪物·变异图鉴 UI / 新手引导 / 构筑与房间补强
 */
const TSR_SEASON_LEN_DAYS = 28;
/** 赛季经验获取总倍率（下降为五分之一） */
const TSR_SEASON_XP_GAIN_SCALE = 0.2;
/** 赛季纪元：自该日起为 S1（原按 2026-01-01 会落到 S7） */
const TSR_SEASON_EPOCH_UTC = Date.UTC(2026, 5, 18);
const TSR_SEASON_MAX_LEVEL = 50;
/** 关键碑称号（其余等级用「第N阶」） */
const TSR_SEASON_LABELS = {
    1: '赛季启程', 2: '初涉', 3: '进阶', 4: '变异试炼', 5: '猎手',
    6: '秘境人', 7: '强者', 8: '命格贤者', 9: '赛季英杰', 10: '终焉旅人',
    15: '时序行者', 20: '裂隙主宰', 25: '星域客卿', 30: '虚空使徒',
    35: '赛季霸主', 40: '永恒猎手', 45: '时渊卫士', 50: '赛季传说'
};
const TSR_SEASON_PASS = (() => {
    const tiers = [];
    let xp = 0;
    for (let lv = 1; lv <= TSR_SEASON_MAX_LEVEL; lv++) {
        if (lv > 1) {
            // 经验门槛：早期贴近原曲线，后期稳步抬升（约Lv50≈45万经验）
            xp += Math.round(900 + (lv - 1) * 260 + Math.pow(lv - 1, 1.32) * 48);
        }
        const currency = Math.round((4000 + lv * 9000 + lv * lv * 120) / 1000) * 1000;
        const reward = { currency };
        if (lv === 2) reward.consumable = 'healPotion';
        else if (lv === 4) reward.consumable = 'mutationSerum';
        else if (lv === 8) reward.consumable = 'lifeAnchor';
        else if (lv % 5 === 0 && lv < 50) {
            const pool = ['healPotion', 'timeCapsule', 'luckyCoin', 'spiritSnack', 'affixScope', 'mutationSerum', 'lifeAnchor'];
            reward.consumable = pool[(lv / 5 - 1) % pool.length];
        }
        if (lv === 6) reward.permanent = { floorTimeBonus: 1 };
        else if (lv === 9) reward.permanent = { runCurrencyBonus: 0.02 };
        else if (lv === 10) reward.permanent = { mutationSight: 0.02 };
        else if (lv === 20) reward.permanent = { floorTimeBonus: 1 };
        else if (lv === 30) reward.permanent = { runCurrencyBonus: 0.02 };
        else if (lv === 40) reward.permanent = { mutationSight: 0.02 };
        else if (lv === 50) reward.permanent = { floorTimeBonus: 2, runCurrencyBonus: 0.03 };
        tiers.push({
            xp,
            reward,
            label: TSR_SEASON_LABELS[lv] || `第${lv}阶`,
            icon: lv === 50 ? '👑' : (lv % 10 === 0 ? '🏆' : (lv % 5 === 0 ? '🏅' : '🎁'))
        });
    }
    return tiers;
})();

const TSR_FACTIONS = {
    chronos: {
        id: 'chronos', name: '时序议会', icon: '⏳', color: '#38bdf8',
        desc: '掌控秒数与层词缀，奖励：时间与行动节约',
        rooms: ['timebank', 'timeloom', 'chronolibrary', 'chronogarden', 'doomclock', 'timewarp', 'mutationlab'],
        shopUnlock: { need: 40, item: 'factionChronos' }
    },
    beast: {
        id: 'beast', name: '兽潮教团', icon: '🐺', color: '#f97316',
        desc: '崇拜猎杀与词条，奖励：战斗与赏金',
        rooms: ['beastlair', 'monsterhunt', 'affixhunt', 'bloodarena', 'battlerift', 'mutationhunt', 'huntlodge'],
        shopUnlock: { need: 40, item: 'factionBeast' }
    },
    void: {
        id: 'void', name: '虚空星会', icon: '🕳️', color: '#a78bfa',
        desc: '共鸣与星域，奖励：精灵与虚空',
        rooms: ['voidrift', 'voidecho', 'spiritnexus', 'spiritstar', 'starfall', 'voidobservatory', 'singularitywell'],
        shopUnlock: { need: 40, item: 'factionVoid' }
    }
};

const TSR_DAILY_RUN_MODS = [
    { id: 'speedrun', name: '竞速黎明', icon: '🏃', desc: '行动耗时-12%，奖励-8%', mods: { timeSave: 0.12, currencyPenalty: 0.08 } },
    { id: 'bloodMoon', name: '血月之夜', icon: '🩸', desc: '怪物+12%，精英币+18%', mods: { monsterMult: 0.12, eliteCurrency: 0.18 } },
    { id: 'affixStorm', name: '词条暴风', icon: '🏷️', desc: '词条率+25%，词条赏金+15%', mods: { affixRollBoost: 0.25, affixReward: 0.15 } },
    { id: 'spiritTide', name: '灵潮', icon: '🧚', desc: '精灵充能+30%，亲密度事件+', mods: { spiritCharge: 0.3 } },
    { id: 'memeCarnival', name: '梗嘉年华', icon: '🃏', desc: '梗房×1.5，事件+12%', mods: { memeMult: 1.5, eventBonus: 0.12 } },
    { id: 'voidPulse', name: '虚空脉动', icon: '💠', desc: '共鸣获取+25%，怪物+6%', mods: { resonanceGain: 0.25, monsterMult: 0.06 } },
    { id: 'goldenHunt', name: '黄金狩猎', icon: '💰', desc: '秘境币+15%，陷阱风险+5%', mods: { currency: 0.15, trapChance: 0.05 } },
    { id: 'ironTrial', name: '铁壁试炼', icon: '🛡️', desc: '玩家反击-10%，攻击-5%', mods: { counterReduce: 0.1, attackPenalty: 0.05 } }
];

const TSR_ENVIRONMENTS = {
    fog: { id: 'fog', name: '迷雾', icon: '🌫️', desc: '暴击-4%，闪避感知+', floors: 2, battle: { critRate: -0.04 }, weight: 8 },
    magma: { id: 'magma', name: '熔岩带', icon: '🌋', desc: '每战灼烧风险，攻击+5%', floors: 2, battle: { attack: 0.05, burnPct: 0.02 }, weight: 7 },
    frost: { id: 'frost', name: '永霜', icon: '❄️', desc: '每2回合-2秒，生命+6%', floors: 2, battle: { frostDrain: 2, health: 0.06 }, weight: 7 },
    thunder: { id: 'thunder', name: '雷雨', icon: '⚡', desc: '反击+8%，雷击偶发', floors: 2, battle: { counterMult: 0.08, shockPct: 0.02 }, weight: 6 },
    voidRift: { id: 'voidRift', name: '裂隙雾', icon: '🕳️', desc: '共鸣+10%，噬灵风险', floors: 3, battle: { resonanceGain: 0.1, spiritDrain: 0.04 }, weight: 5 },
    bloom: { id: 'bloom', name: '灵息花期', icon: '🌸', desc: '回血+4%，事件+', floors: 2, battle: { healAmp: 0.04 }, weight: 6 },
    eclipse: { id: 'eclipse', name: '日蚀', icon: '🌑', desc: '暗影伤，词条率+', floors: 2, battle: { shadowPct: 0.02, affixRollBoost: 0.1 }, weight: 5 },
    chronosFlow: { id: 'chronosFlow', name: '时流加速', icon: '⏳', desc: '行动-6%，奖励+5%', floors: 2, battle: { timeSave: 0.06, currency: 0.05 }, weight: 6 }
};

const TSR_WORLD_RELICS = {
    seasonBadge: { name: '赛季徽章', icon: '🏅', desc: '赛季经验+20%，秘境币+6%', effect: 'currency', value: 0.06 },
    factionSigil: { name: '派系符印', icon: '🛡️', desc: '声望获取+25%，特殊房+4%', effect: 'specialRoom', value: 0.04 },
    envWard: { name: '气候护符', icon: '🌈', desc: '环境负面减半，反击-4%', effect: 'counterReduce', value: 0.04 },
    rushCrown: { name: '冲刺冠', icon: '👑', desc: '首领冲刺奖励+20%，攻击+8%', effect: 'attack', value: 0.08 },
    debriefQuill: { name: '复盘羽笔', icon: '🪶', desc: '撤离结算+10%，通关+4%', effect: 'exitBonus', value: 0.1 },
    tacticianLens: { name: '战术透镜', icon: '🔍', desc: '战前战术效果+15%', effect: 'attack', value: 0.05 }
};

const TSR_WORLD_TACTICS = {
    envSync: { id: 'envSync', name: '气候同调', icon: '🌈', desc: '吃到环境正面，忽略负面一半', attack: 0.06, counterReduce: 0.05 },
    factionWar: { id: 'factionWar', name: '派系宣战', icon: '⚔️', desc: '攻击+15%，受到反击+10%', attack: 0.15, counterPenalty: 0.1 },
    seasonStrike: { id: 'seasonStrike', name: '赛季突袭', icon: '🏅', desc: '暴击+8%，战斗奖励+12%', critRate: 0.08, battleReward: 0.12 }
};

const TSR_WORLD_SPECIAL_ROOMS = ['seasonhall', 'factionembassy', 'enclave', 'bossrushgate', 'debriefarchive'];
const TSR_WORLD_ROOM_META = {
    seasonhall: { name: '赛季大厅', icon: '🏅', color: '#fbbf24' },
    factionembassy: { name: '势力使馆', icon: '🏛️', color: '#38bdf8' },
    enclave: { name: '气候飞地', icon: '🌈', color: '#22d3ee' },
    bossrushgate: { name: '首领冲刺门', icon: '👹', color: '#ef4444' },
    debriefarchive: { name: '复盘档案馆', icon: '📜', color: '#a78bfa' }
};

const TSR_WORLD_ACHIEVEMENTS = [
    { id: 'seasonTier5', name: '赛季中坚', desc: '赛季通行证达到第5档', icon: '🏅' },
    { id: 'faction40', name: '派系拥护者', desc: '任一势力声望达到40', icon: '🏛️' },
    { id: 'bossRushClear', name: '冲刺征服', desc: '完成一次首领冲刺', icon: '👹' },
    { id: 'envSurvive10', name: '气候行者', desc: '累计经历10次环境', icon: '🌈' },
    { id: 'monsterCodex20', name: '怪物学者', desc: '图鉴收录20种怪物', icon: '👹' },
    { id: 'debrief10', name: '复盘达人', desc: '查看局终复盘10次', icon: '📜' }
];

const TSR_WORLD_MONSTER_POOL = {
    battle: [
        { id: 'seasonimp', name: '赛季小鬼', icon: '🏅', tier: 'uncommon', intro: '「通行证进度是我的KPI。」', win: '小鬼被排行榜压扁。', skill: 'coinSteal', skillChance: 0.22, skillValue: 15 },
        { id: 'envwisp', name: '气候游灵', icon: '🌈', tier: 'rare', intro: '「今天天气：暴击下雨。」', win: '游灵散作晴空。', skill: 'slow', skillChance: 0.24 }
    ],
    elite: [
        { id: 'factioncaptain', name: '派系队长', icon: '🛡️', tier: 'epic', intro: '「选择势力吧——或者被选。」', win: '队长辞职了。', skill: 'shield', skillChance: 0.32, skillValue: 0.14 },
        { id: 'rushsentinel', name: '冲刺哨兵', icon: '👹', tier: 'legendary', intro: '「连续首领，欢迎排队。」', win: '哨兵下班打卡。', skill: 'rage', skillChance: 0.36 }
    ],
    boss: [
        { id: 'seasonoverlord', name: '赛季霸主', icon: '👑', tier: 'mythic', intro: '「本赛季 MVP，非我不可。」', win: '霸主被新赛季覆盖。', skill: 'affixStorm', skillChance: 0.42 },
        { id: 'enveidolon', name: '气候魔神', icon: '🌪️', tier: 'mythic', intro: '「我是灾害预警本人。」', win: '魔神被气象局封杀。', skill: 'tidalWave', skillChance: 0.4 }
    ]
};

/* ========== 赛季 ========== */
function getTsrSeasonKey(d) {
    d = d || new Date();
    const days = Math.floor((d.getTime() - TSR_SEASON_EPOCH_UTC) / 86400000);
    const idx = Math.floor(Math.max(0, days) / TSR_SEASON_LEN_DAYS) + 1;
    return 'S' + idx;
}

function ensureTsrSeason() {
    const tsr = player.timeSecretRealm;
    if (!tsr.season) tsr.season = { key: '', xp: 0, claimed: {}, history: [] };
    const key = getTsrSeasonKey();
    if (tsr.season.key !== key) {
        if (tsr.season.key) tsr.season.history.push({ key: tsr.season.key, xp: tsr.season.xp });
        if ((tsr.season.history || []).length > 12) tsr.season.history = tsr.season.history.slice(-12);
        tsr.season = { key, xp: 0, claimed: {}, history: tsr.season.history || [] };
        logAction?.(`🏅 新赛季 ${key} 开启！通行证进度已重置`, 'success');
    }
    return tsr.season;
}

function getTsrSeasonTier() {
    const s = ensureTsrSeason();
    let tier = 0;
    for (let i = 0; i < TSR_SEASON_PASS.length; i++) {
        if (s.xp >= TSR_SEASON_PASS[i].xp) tier = i;
    }
    return tier;
}

function addTsrSeasonXP(amount, reason) {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return 0;
    const s = ensureTsrSeason();
    const bonus = (player.timeSecretRealm?.currentRun?.relics || []).includes('seasonBadge') ? 1.2 : 1;
    const gain = Math.max(0, Math.floor(amount * bonus * TSR_SEASON_XP_GAIN_SCALE));
    if (!gain) return 0;
    const before = getTsrSeasonTier();
    s.xp += gain;
    const after = getTsrSeasonTier();
    if (reason) addTsrLog?.(`🏅 赛季经验+${gain}（${reason}）`, 'success');
    if (after > before) {
        addTsrLog?.(`🏅 赛季通行证升至第${after + 1}档「${TSR_SEASON_PASS[after].label}」！可前往赛季页领取`, 'success');
        checkTsrWorldAchievements();
    }
    return gain;
}

function claimTsrSeasonReward(tier) {
    const tsr = player.timeSecretRealm;
    const s = ensureTsrSeason();
    const row = TSR_SEASON_PASS[tier];
    if (!row || s.xp < row.xp || s.claimed[tier]) return false;
    s.claimed[tier] = Date.now();
    if (row.reward.currency) addTsrPermanentCurrency?.(row.reward.currency);
    if (row.reward.consumable) {
        tsr.pendingConsumables = tsr.pendingConsumables || [];
        tsr.pendingConsumables.push(row.reward.consumable);
    }
    if (row.reward.permanent) {
        tsr.permanentBonuses = tsr.permanentBonuses || {};
        Object.entries(row.reward.permanent).forEach(([k, v]) => {
            tsr.permanentBonuses[k] = (tsr.permanentBonuses[k] || 0) + v;
        });
    }
    logAction(`领取赛季奖励：${row.label}`, 'success');
    renderTsrSeasonPanel();
    return true;
}

function renderTsrSeasonPanel() {
    const el = document.getElementById('tsrSeasonPanel');
    if (!el) return;
    const s = ensureTsrSeason();
    const tier = getTsrSeasonTier();
    const next = TSR_SEASON_PASS[Math.min(tier + 1, TSR_SEASON_PASS.length - 1)];
    const cur = TSR_SEASON_PASS[tier];
    const pct = next.xp === cur.xp ? 100 : Math.min(100, ((s.xp - cur.xp) / Math.max(1, next.xp - cur.xp)) * 100);
    el.innerHTML = `
        <div class="tsr-season-head">
            <strong>🏅 赛季 ${s.key}</strong>
            <span>经验 ${s.xp} · 档位 ${tier + 1}/${TSR_SEASON_PASS.length}</span>
        </div>
        <div class="tsr-season-track"><div class="tsr-season-fill" style="width:${pct}%"></div></div>
        <div class="tsr-season-tiers">${TSR_SEASON_PASS.map((r, i) => {
            const locked = s.xp < r.xp;
            const claimed = !!s.claimed[i];
            const can = !locked && !claimed;
            return `<button type="button" class="tsr-season-tier ${claimed ? 'claimed' : ''} ${can ? 'ready' : ''}"
                ${can ? `onclick="claimTsrSeasonReward(${i})"` : 'disabled'}>
                ${r.icon || '🎁'} Lv${i + 1}<br><small>${r.label}</small>
            </button>`;
        }).join('')}</div>`;
}

/* ========== 声望 ========== */
function ensureTsrFactions() {
    const tsr = player.timeSecretRealm;
    if (!tsr.factions) tsr.factions = { chronos: 0, beast: 0, void: 0, pledged: null };
    return tsr.factions;
}

function addTsrFactionRep(factionId, amount, reason) {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return;
    const f = ensureTsrFactions();
    if (!TSR_FACTIONS[factionId]) return;
    const bonus = (player.timeSecretRealm?.currentRun?.relics || []).includes('factionSigil') ? 1.25 : 1;
    const gain = Math.max(0, Math.floor(amount * bonus));
    f[factionId] = Math.min(100, (f[factionId] || 0) + gain);
    if (reason && gain) addTsrLog?.(`${TSR_FACTIONS[factionId].icon} ${TSR_FACTIONS[factionId].name}声望+${gain}`, 'info');
    checkTsrWorldAchievements();
}

function pledgeTsrFaction(factionId) {
    const f = ensureTsrFactions();
    if (!TSR_FACTIONS[factionId]) return;
    f.pledged = factionId;
    logAction(`已宣誓效忠：${TSR_FACTIONS[factionId].name}`, 'success');
    renderTsrFactionPanel();
}

function getTsrFactionBonus(stat) {
    const f = ensureTsrFactions();
    const pledged = f.pledged;
    if (!pledged) return 0;
    const rep = f[pledged] || 0;
    const t = Math.min(1, rep / 100);
    if (pledged === 'chronos') {
        if (stat === 'timeSave') return 0.04 * t;
        if (stat === 'floorTime') return Math.floor(3 * t);
    }
    if (pledged === 'beast') {
        if (stat === 'attack') return 0.05 * t;
        if (stat === 'affixReward') return 0.08 * t;
    }
    if (pledged === 'void') {
        if (stat === 'spiritCharge') return 0.1 * t;
        if (stat === 'resonanceGain') return 0.12 * t;
    }
    return 0;
}

function renderTsrFactionPanel() {
    const el = document.getElementById('tsrFactionPanel');
    if (!el) return;
    const f = ensureTsrFactions();
    el.innerHTML = Object.values(TSR_FACTIONS).map(fc => {
        const rep = f[fc.id] || 0;
        const pledged = f.pledged === fc.id;
        return `<div class="tsr-faction-card ${pledged ? 'pledged' : ''}" style="border-color:${fc.color}">
            <div class="tsr-faction-title">${fc.icon} ${fc.name} ${pledged ? '★' : ''}</div>
            <div class="tsr-faction-desc">${fc.desc}</div>
            <div class="tsr-faction-bar"><div style="width:${rep}%;background:${fc.color}"></div></div>
            <div>声望 ${rep}/100</div>
            <button type="button" class="tsr-btn tsr-btn-safe" onclick="pledgeTsrFaction('${fc.id}')">${pledged ? '已效忠' : '宣誓效忠'}</button>
        </div>`;
    }).join('');
}

/* ========== 每日修饰 ========== */
function getTsrDailyRunMod() {
    const day = new Date().toISOString().slice(0, 10);
    const seed = day.split('-').reduce((s, x) => s + Number(x), 0);
    return TSR_DAILY_RUN_MODS[seed % TSR_DAILY_RUN_MODS.length];
}

function applyTsrDailyRunMod() {
    const tsr = player.timeSecretRealm;
    const mod = getTsrDailyRunMod();
    tsr.currentRun.dailyMod = mod;
    Object.entries(mod.mods || {}).forEach(([k, v]) => {
        if (k === 'affixRollBoost') tsr.currentRun.affixRollBoost = (tsr.currentRun.affixRollBoost || 0) + v;
        else if (k === 'affixReward') tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + v;
        else if (k === 'currency' || k === 'currencyPenalty') {
            tsr.currentRun.currencyBonus = (tsr.currentRun.currencyBonus || 0) + (k === 'currency' ? v : -v);
        } else if (k === 'monsterMult') tsr.currentRun.monsterFlatMult = (tsr.currentRun.monsterFlatMult || 0) + v;
        else if (k === 'memeMult') tsr.currentRun.memeMult = (tsr.currentRun.memeMult || 1) * v;
        else if (k === 'eventBonus') tsr.currentRun.eventBonusRun = (tsr.currentRun.eventBonusRun || 0) + v;
        else if (k === 'resonanceGain') tsr.currentRun.resonanceGainMult = (tsr.currentRun.resonanceGainMult || 0) + v;
        else if (k === 'spiritCharge') tsr.currentRun.spiritChargeAmp = (tsr.currentRun.spiritChargeAmp || 0) + v;
        else if (k === 'eliteCurrency') tsr.currentRun.eliteCurrencyBonus = (tsr.currentRun.eliteCurrencyBonus || 0) + v;
        else if (k === 'timeSave') tsr.currentRun.timeSaveBonus = (tsr.currentRun.timeSaveBonus || 0) + v;
        else if (k === 'counterReduce') tsr.currentRun.counterReduceBonus = (tsr.currentRun.counterReduceBonus || 0) + v;
        else if (k === 'attackPenalty') addTempBuff?.({ name: mod.name, effect: 'attack', value: -v, duration: 99, isDebuff: true });
    });
    addTsrLog(`📅 每日修饰「${mod.icon}${mod.name}」：${mod.desc}`, 'info');
}

/* ========== 环境气候 ========== */
function rollTsrEnvironment(floor) {
    const tsr = player.timeSecretRealm;
    if (tsr.currentRun.env && tsr.currentRun.env.floorsLeft > 0) {
        tsr.currentRun.env.floorsLeft--;
        if (tsr.currentRun.env.floorsLeft <= 0) {
            addTsrLog(`气候「${tsr.currentRun.env.name}」散去`, 'info');
            tsr.currentRun.env = null;
        }
        return;
    }
    if (Math.random() > 0.28 + Math.min(0.15, floor * 0.008)) return;
    const keys = Object.keys(TSR_ENVIRONMENTS);
    const weights = keys.map(k => TSR_ENVIRONMENTS[k].weight || 1);
    let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
    let pick = keys[0];
    for (let i = 0; i < keys.length; i++) {
        roll -= weights[i];
        if (roll <= 0) { pick = keys[i]; break; }
    }
    const env = TSR_ENVIRONMENTS[pick];
    tsr.currentRun.env = { ...env, floorsLeft: env.floors };
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.envSeen = (tsr.lifetimeStats.envSeen || 0) + 1;
    addTsrLog(`🌈 气候降临「${env.icon}${env.name}」：${env.desc}（持续${env.floors}层）`, 'warning');
    updateTsrEnvDisplay();
    checkTsrWorldAchievements();
}

function updateTsrEnvDisplay() {
    let bar = document.getElementById('tsrEnvBar');
    if (!bar) {
        const host = document.querySelector('.tsr-run-status') || document.getElementById('tsrFloorAffix')?.parentElement;
        if (!host) return;
        bar = document.createElement('div');
        bar.id = 'tsrEnvBar';
        bar.className = 'tsr-env-bar';
        host.appendChild(bar);
    }
    const env = player?.timeSecretRealm?.currentRun?.env;
    if (!env) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex';
    bar.innerHTML = `<span>${env.icon} ${env.name}</span><span>剩${env.floorsLeft}层</span><span class="tsr-env-desc">${env.desc}</span>`;
}

function applyTsrEnvBattleEffects(monsterHp, monsterMaxHp, rounds) {
    const tsr = player?.timeSecretRealm;
    const env = tsr?.currentRun?.env;
    if (!env?.battle || !rounds) return monsterHp;
    const b = env.battle;
    const ward = (tsr.currentRun.relics || []).includes('envWard') ? 0.5 : 1;
    if (b.burnPct && rounds % 3 === 0) {
        applyDamage(bMul(tsr.currentRun.playerHealth, b.burnPct * ward));
        addTsrLog(`🌋 熔岩气候灼烧${Math.floor(b.burnPct * ward * 100)}%`, 'error');
    }
    if (b.frostDrain && rounds % 2 === 0) {
        tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - Math.ceil(b.frostDrain * ward));
        addTsrLog(`❄️ 永霜窃时`, 'warning');
    }
    if (b.shockPct && rounds % 4 === 0) {
        applyDamage(bMul(tsr.currentRun.playerHealth, b.shockPct * ward));
        addTsrLog(`⚡ 雷雨击中`, 'error');
    }
    if (b.shadowPct && rounds % 4 === 0) {
        applyDamage(bMul(tsr.currentRun.playerHealth, b.shadowPct * ward));
        addTsrLog(`🌑 日蚀暗影`, 'error');
    }
    if (b.spiritDrain && rounds % 3 === 0) {
        const d = Math.max(3, Math.floor((tsr.currentRun.spiritCharge || 0) * b.spiritDrain * ward));
        tsr.currentRun.spiritCharge = Math.max(0, (tsr.currentRun.spiritCharge || 0) - d);
        addTsrLog(`🕳️ 裂隙噬灵-${d}%`, 'warning');
    }
    if (b.healAmp && rounds === 1) tsrHealPlayer(b.healAmp);
    return monsterHp;
}

/* ========== Boss Rush ========== */
function startTsrBossRush() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.difficulty?.current) { logAction('请先选择难度！', 'error'); return; }
    if ((player.items?.fuben2 || 0) < 1) { alert('需要至少 1 把秘境钥匙！'); return; }
    tsr.pendingBossRush = true;
    startTimeSecretRealm();
}

function initTsrBossRushRun() {
    const tsr = player.timeSecretRealm;
    if (!tsr.pendingBossRush) return;
    tsr.pendingBossRush = false;
    tsr.currentRun.isBossRush = true;
    tsr.currentRun.bossRushWave = 0;
    tsr.currentRun.bossRushTarget = 5;
    tsr.currentRun.timeLeft = Math.floor(tsr.currentRun.timeLeft * 0.85);
    addTsrLog('👹 首领冲刺开幕！连续挑战5名首领，波次间可换装，中途撤离无通关奖励', 'warning');
}

function continueTsrBossRush() {
    const tsr = player.timeSecretRealm;
    const run = tsr.currentRun;
    if (!run?.isBossRush || !run.isActive) return;
    // 换装倒计时中勿开下一波
    if (run._challengeGearBreakActive) return;
    // 上一波演出未结束时先挂起，避免连环开战秒退
    if (run.battleInProgress || run._resolvingBattle || run._bossRushAdvancing) {
        setTimeout(() => continueTsrBossRush(), 120);
        return;
    }
    run.bossRushWave = (run.bossRushWave || 0) + 1;
    if (run.bossRushWave > run.bossRushTarget) {
        run.bossRushCleared = true;
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.bossRushClears = (tsr.lifetimeStats.bossRushClears || 0) + 1;
        addTsrSeasonXP(180, '首领冲刺通关');
        addTsrPermanentCurrency?.(1000);
        addTsrLog('👹 首领冲刺全通！+1000秘境币', 'success');
        checkTsrWorldAchievements();
        endTimeSecretRealm('bossRushClear');
        return;
    }
    const floor = Math.max(1, Math.min(8, (tsr.currentRun.currentFloor || 1) + run.bossRushWave - 1));
    const dm = tsr.currentRun.difficultyMultiplier;
    const monster = pickTsrMonster(true, false, floor, dm);
    const room = {
        type: 'boss', isBoss: true, explored: true, monster, battleCleared: false,
        rewards: generateRoomRewards('boss', dm)
    };
    room.rewards.currency = Math.floor(room.rewards.currency * (1 + run.bossRushWave * 0.04));
    run.currentRoom = room;
    run.currentFloor = floor;
    run._bossRushAdvancing = true;
    const fightId = typeof beginTsrChallengeFight === 'function' ? beginTsrChallengeFight(run) : 0;
    addTsrLog(`👹 冲刺波次 ${run.bossRushWave}/${run.bossRushTarget}`, 'warning');
    handleBattleRoom();
    let settleTries = 0;
    const settle = () => {
        const r = player.timeSecretRealm?.currentRun;
        if (!r?.isActive || !r.isBossRush) return;
        if (r.battleInProgress || r._resolvingBattle) {
            if (++settleTries < 200) setTimeout(settle, 120);
            else r._bossRushAdvancing = false;
            return;
        }
        const summary = r.lastBattleSummary;
        if (fightId && (!summary || summary.fightId !== fightId)) {
            if (++settleTries < 200) setTimeout(settle, 120);
            else r._bossRushAdvancing = false;
            return;
        }
        r._bossRushAdvancing = false;
        const won = !!summary?.victory && !bLteZero(r.playerHealth);
        if (!won) {
            if (summary && r.isActive && !bLteZero(r.playerHealth)) endTimeSecretRealm('战斗失败');
            return;
        }
        if (typeof tsrHealPlayer === 'function') tsrHealPlayer(0.16);
        r.currentFloor++;
        const nextWave = (r.bossRushWave || 0) + 1;
        const goNext = () => {
            const cur = player.timeSecretRealm?.currentRun;
            if (cur?.isActive && cur.isBossRush) continueTsrBossRush();
        };
        if (nextWave > (r.bossRushTarget || 5)) {
            setTimeout(goNext, 280);
        } else if (typeof scheduleTsrChallengeGearBreak === 'function') {
            scheduleTsrChallengeGearBreak(goNext, {
                label: '首领冲刺 · 换装',
                wave: nextWave,
                target: r.bossRushTarget
            });
        } else {
            setTimeout(goNext, 320);
        }
    };
    if (typeof waitTsrBattleSettled === 'function') waitTsrBattleSettled(settle);
    else setTimeout(settle, 80);
}

/* ========== 局终复盘 ========== */
function buildTsrDebrief(reason, cleared) {
    const tsr = player.timeSecretRealm;
    const run = tsr.currentRun;
    if (!run) return null;
    const floors = (run.floorHistory || []).map(f => {
        const type = f.type || f.roomType || '?';
        if (typeof getTsrRoomTypeMeta === 'function') {
            const meta = getTsrRoomTypeMeta(type);
            return meta?.name || type;
        }
        return type;
    });
    const score = Math.floor(
        (run.currentFloor || 1) * 12 +
        (run.currencyEarned || 0) * 0.02 +
        (run.maxBattleStreak || 0) * 8 +
        (run.affixKillsThisRun || 0) * 5 +
        (cleared ? 100 : 0) +
        (run.isBossRush && run.bossRushCleared ? 150 : 0)
    );
    const reasonText = typeof formatTsrEndReason === 'function' ? formatTsrEndReason(reason) : (reason || '未知');
    const diffName = tsr.difficulty?.levels?.[run.difficulty]?.name || run.difficulty || '未知';
    const contractName = (typeof TSR_RUN_CONTRACTS !== 'undefined' && TSR_RUN_CONTRACTS[tsr.selectedContract]?.name)
        || (tsr.selectedContract === 'none' || !tsr.selectedContract ? '无' : tsr.selectedContract);
    const fateName = run.fateCard
        ? ((typeof TSR_FATE_CARDS !== 'undefined' && TSR_FATE_CARDS[run.fateCard]?.name) || run.fateCard)
        : '无';
    return {
        at: Date.now(),
        reason: reason || 'unknown',
        reasonText,
        cleared: !!cleared,
        difficulty: run.difficulty,
        difficultyName: diffName,
        floor: run.currentFloor,
        currency: run.currencyEarned,
        streak: run.maxBattleStreak || 0,
        affixKills: run.affixKillsThisRun || 0,
        contract: tsr.selectedContract,
        contractName,
        fate: run.fateCard || null,
        fateName,
        dailyMod: run.dailyMod?.name || null,
        env: run.env?.name || null,
        bossRush: !!run.isBossRush,
        score,
        floors: floors.slice(-20),
        title: cleared ? '通关凯旋'
            : (reason === 'death' || reason === '战斗失败' || reason === '生命值过低' ? '力竭倒下'
                : (reason === '时间耗尽' ? '时光耗尽'
                    : (reason === 'bossRushClear' || reason === 'trialTowerClear' || reason === 'weeklyBossClear'
                        ? reasonText
                        : '中途撤离')))
    };
}

function showTsrDebrief(debrief) {
    if (!debrief) return;
    let overlay = document.getElementById('tsrDebriefOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'tsrDebriefOverlay';
        overlay.className = 'tsr-debrief-overlay';
        document.body.appendChild(overlay);
    }
    const tsr = player.timeSecretRealm;
    tsr.debriefHistory = tsr.debriefHistory || [];
    tsr.debriefHistory.unshift(debrief);
    if (tsr.debriefHistory.length > 20) tsr.debriefHistory.length = 20;
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.debriefsViewed = (tsr.lifetimeStats.debriefsViewed || 0) + 1;

    overlay.style.display = 'flex';
    const diffLabel = debrief.difficultyName
        || player.timeSecretRealm?.difficulty?.levels?.[debrief.difficulty]?.name
        || debrief.difficulty
        || '未知';
    const contractLabel = debrief.contractName
        || (typeof TSR_RUN_CONTRACTS !== 'undefined' && TSR_RUN_CONTRACTS[debrief.contract]?.name)
        || (debrief.contract && debrief.contract !== 'none' ? debrief.contract : '无');
    const fateLabel = debrief.fateName
        || (debrief.fate && typeof TSR_FATE_CARDS !== 'undefined' && TSR_FATE_CARDS[debrief.fate]?.name)
        || debrief.fate
        || '无';
    const reasonLabel = debrief.reasonText
        || (typeof formatTsrEndReason === 'function' ? formatTsrEndReason(debrief.reason) : debrief.reason)
        || '未知';
    overlay.innerHTML = `
        <div class="tsr-debrief-card">
            <h3>📜 局终复盘 · ${debrief.title}</h3>
            <div class="tsr-debrief-score">评分 ${debrief.score}</div>
            <div class="tsr-debrief-grid">
                <div>结束原因 <b>${reasonLabel}</b></div>
                <div>难度 <b>${diffLabel}</b></div>
                <div>层数 <b>${debrief.floor}</b></div>
                <div>秘境币 <b>${debrief.currency}</b></div>
                <div>最高连击 <b>${debrief.streak}</b></div>
                <div>词条击杀 <b>${debrief.affixKills}</b></div>
                <div>契约 <b>${contractLabel}</b></div>
                <div>命运卡 <b>${fateLabel}</b></div>
                <div>每日修饰 <b>${debrief.dailyMod || '无'}</b></div>
                <div>气候 <b>${debrief.env || '无'}</b></div>
                <div>模式 <b>${debrief.bossRush ? '首领冲刺' : '标准'}</b></div>
            </div>
            <div class="tsr-debrief-floors">近期房间：${(debrief.floors || []).join(' → ') || '无'}</div>
            <button type="button" class="tsr-btn tsr-btn-gold" onclick="closeTsrDebrief()">收下并关闭</button>
        </div>`;
    checkTsrWorldAchievements();
}

function closeTsrDebrief() {
    const overlay = document.getElementById('tsrDebriefOverlay');
    if (overlay) overlay.style.display = 'none';
}

/* ========== 图鉴扩展 ========== */
function recordTsrMonsterCodex(monster) {
    if (!monster?.id) return;
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return;
    const tsr = player.timeSecretRealm;
    if (!tsr.codex) tsr.codex = { rooms: {}, relics: {} };
    if (!tsr.codex.monsters) tsr.codex.monsters = {};
    tsr.codex.monsters[monster.id] = (tsr.codex.monsters[monster.id] || 0) + 1;
    invalidateTsrUiCache?.('codex');
}

function appendTsrCodexWorldSections(html) {
    const tsr = player.timeSecretRealm;
    const codex = tsr.codex || {};
    const allMonsters = [];
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        ['battle', 'elite', 'boss'].forEach(k => (TSR_MONSTER_POOL[k] || []).forEach(m => allMonsters.push(m)));
    }
    const seen = new Set();
    const unique = allMonsters.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });

    html += '<div class="tsr-codex-section-title">怪物图鉴</div>';
    html += unique.map(m => {
        const count = codex.monsters?.[m.id] || 0;
        const unlocked = count > 0;
        return `<div class="tsr-codex-item ${unlocked ? 'unlocked' : 'locked'}">
            <div style="font-size:1.3rem;">${m.icon}</div>
            <div style="font-weight:600;margin:2px 0;font-size:12px;">${m.name}</div>
            <div style="color:#64748b;font-size:11px;">${unlocked ? '击败 ' + count + ' 次 · ' + (m.tier || '') : '未遭遇'}</div>
        </div>`;
    }).join('');

    if (typeof TSR_MONSTER_MUTATIONS !== 'undefined') {
        html += '<div class="tsr-codex-section-title">变异图鉴</div>';
        html += Object.entries(TSR_MONSTER_MUTATIONS).map(([k, mut]) => {
            const count = codex.mutations?.[k] || 0;
            return `<div class="tsr-codex-item ${count ? 'unlocked' : 'locked'}">
                <div style="font-size:1.2rem;">${mut.icon}</div>
                <div style="font-weight:600;font-size:12px;">${mut.name}</div>
                <div style="color:#64748b;font-size:11px;">${count ? '遭遇 ' + count + ' 次' : mut.desc}</div>
            </div>`;
        }).join('');
    }
    if (typeof TSR_MONSTER_LIFE_PROFILES !== 'undefined') {
        html += '<div class="tsr-codex-section-title">命格图鉴</div>';
        html += Object.entries(TSR_MONSTER_LIFE_PROFILES).map(([k, life]) => {
            const count = codex.lifeProfiles?.[k] || 0;
            return `<div class="tsr-codex-item ${count ? 'unlocked' : 'locked'}">
                <div style="font-weight:600;font-size:12px;">❤️ ${k} · ${life.stages}段</div>
                <div style="color:#64748b;font-size:11px;">${count ? '遭遇 ' + count + ' 次' : (life.labels || []).join('/')}</div>
            </div>`;
        }).join('');
    }
    const monCount = Object.keys(codex.monsters || {}).length;
    html = html.replace('</div>', ` · 怪物: ${monCount}/${unique.length}</div>`);
    return html;
}

/* ========== 特殊房 ========== */
function handleSeasonhallRoom() {
    const s = ensureTsrSeason();
    const tier = getTsrSeasonTier();
    showTsrMemePanel('🏅 赛季大厅', `当前赛季 <strong>${s.key}</strong> · 档位 ${tier + 1}<br>经验 ${s.xp}`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSeasonHall('xp')">献币祈愿 · -40币 赛季经验+40</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSeasonHall('bless')">赛季祝福 · -15秒 攻击+12%×3</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}

function tsrChooseSeasonHall(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'seasonhall' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'xp') {
        if ((tsr.currentRun.currencyEarned || 0) < 40) { addTsrLog('秘境币不足', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 40;
        addTsrSeasonXP(40, '赛季大厅');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'bless') {
        if (tsr.currentRun.timeLeft <= 16) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 15;
        addTempBuff({ name: '赛季祝福', effect: 'attack', value: 0.12, duration: 3, isDebuff: false });
        addTsrLog('赛季祝福：攻击+12%×3', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleFactionembassyRoom() {
    const f = ensureTsrFactions();
    const btns = Object.values(TSR_FACTIONS).map(fc =>
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseFactionEmbassy('${fc.id}')">${fc.icon}献礼${fc.name} · -20秒 声望+8</button>`
    ).join('');
    showTsrMemePanel('🏛️ 势力使馆', `效忠：${f.pledged ? TSR_FACTIONS[f.pledged].name : '无'}`,
        `${btns}<button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}

function tsrChooseFactionEmbassy(fid) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'factionembassy' || !room.explored) return;
    hideTsrChoicePanels();
    if (tsr.currentRun.timeLeft <= 22) { finishTsrMemeRoom(); return; }
    tsr.currentRun.timeLeft -= 20;
    addTsrFactionRep(fid, 8, '使馆献礼');
    if (ensureTsrFactions().pledged === fid) addTsrFactionRep(fid, 4, '效忠加成');
    finishTsrMemeRoom();
}

function handleEnclaveRoom() {
    showTsrMemePanel('🌈 气候飞地', '飞地中气候可以人为诱导。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseEnclave('roll')">诱导气候 · -12秒</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseEnclave('clear')">驱散气候 · 回血10%</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}

function tsrChooseEnclave(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'enclave' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'roll') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        tsr.currentRun.env = null;
        rollTsrEnvironment(tsr.currentRun.currentFloor);
        if (!tsr.currentRun.env) {
            const keys = Object.keys(TSR_ENVIRONMENTS);
            const env = TSR_ENVIRONMENTS[keys[Math.floor(Math.random() * keys.length)]];
            tsr.currentRun.env = { ...env, floorsLeft: env.floors };
            addTsrLog(`诱导成功：${env.icon}${env.name}`, 'success');
            updateTsrEnvDisplay();
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'clear') {
        tsr.currentRun.env = null;
        updateTsrEnvDisplay();
        tsrHealPlayer(0.1);
        addTsrLog('气候驱散，回血10%', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleBossrushgateRoom() {
    showTsrMemePanel('👹 首领冲刺门', '门后是连绵的首领威压。现在进入将打断当前探索，改为首领冲刺。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseBossRushGate('enter')">踏入冲刺 · 转换为首领冲刺</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseBossRushGate('peek')">窥探 · -8秒 +50币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}

function tsrChooseBossRushGate(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'bossrushgate' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'enter') {
        tsr.currentRun.isBossRush = true;
        tsr.currentRun.bossRushWave = 0;
        tsr.currentRun.bossRushTarget = 4;
        addTsrLog('门扉闭合，首领冲刺开启！', 'warning');
        finishTsrMemeRoom();
        setTimeout(() => continueTsrBossRush(), 300);
        return;
    }
    if (path === 'peek') {
        if (tsr.currentRun.timeLeft <= 10) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 8;
        addTsrRunCurrency(50);
        addTsrLog('窥探冲刺门，获得情报与50币', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleDebriefarchiveRoom() {
    const hist = player.timeSecretRealm?.debriefHistory || [];
    const last = hist[0];
    const tip = last ? `最近一局评分 ${last.score} · ${last.title}` : '尚无复盘记录';
    showTsrMemePanel('📜 复盘档案馆', tip,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseDebriefArchive('study')">研读 · -10秒 攻击+10%×3</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseDebriefArchive('view')">回看最近复盘</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}

function tsrChooseDebriefArchive(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'debriefarchive' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'study') {
        if (tsr.currentRun.timeLeft <= 12) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 10;
        addTempBuff({ name: '复盘洞见', effect: 'attack', value: 0.1, duration: 3, isDebuff: false });
        addTsrLog('复盘洞见：攻击+10%×3', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'view') {
        const last = (tsr.debriefHistory || [])[0];
        if (last) showTsrDebrief(last);
        else addTsrLog('没有可回看的复盘', 'warning');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

/* ========== 成就 / 引导 / UI ========== */
function checkTsrWorldAchievements() {
    const tsr = player?.timeSecretRealm;
    if (!tsr) return;
    if (!tsr.achievements) tsr.achievements = {};
    const unlock = (id) => {
        if (tsr.achievements[id]) return;
        tsr.achievements[id] = Date.now();
        const a = TSR_WORLD_ACHIEVEMENTS.find(x => x.id === id) || TSR_ACHIEVEMENTS?.find(x => x.id === id);
        if (a) addTsrLog?.(`🏅 成就解锁：${a.name}`, 'success');
    };
    if (getTsrSeasonTier() >= 4) unlock('seasonTier5');
    const f = ensureTsrFactions();
    if (Object.values(TSR_FACTIONS).some(fc => (f[fc.id] || 0) >= 40)) unlock('faction40');
    if ((tsr.lifetimeStats?.bossRushClears || 0) >= 1) unlock('bossRushClear');
    if ((tsr.lifetimeStats?.envSeen || 0) >= 10) unlock('envSurvive10');
    if (Object.keys(tsr.codex?.monsters || {}).length >= 20) unlock('monsterCodex20');
    if ((tsr.lifetimeStats?.debriefsViewed || 0) >= 10) unlock('debrief10');
}

function maybeShowTsrGuide() {
    try {
        if (localStorage.getItem('tsr_guide_v1')) return;
    } catch (e) { return; }
    let tip = document.getElementById('tsrGuideTip');
    if (!tip) {
        tip = document.createElement('div');
        tip.id = 'tsrGuideTip';
        tip.className = 'tsr-guide-tip';
        document.body.appendChild(tip);
    }
    const steps = [
        '① 先选难度，再选契约与命运卡，再点开始冒险',
        '② 战斗可带词条/变异/多命；注意气候条与命格阶段',
        '③ 福利中心有赛季通行证，图鉴可查怪物与变异',
        '④ 尝试首领冲刺模式挑战连串首领',
        '⑤ 势力使馆可累积声望，换永久加成'
    ];
    let i = 0;
    const render = () => {
        tip.style.display = 'block';
        tip.innerHTML = `<strong>时光秘境入门</strong><p>${steps[i]}</p>
            <button type="button" class="tsr-btn tsr-btn-gold" id="tsrGuideNext">${i < steps.length - 1 ? '下一步' : '知道了'}</button>`;
        tip.querySelector('#tsrGuideNext').onclick = () => {
            if (i < steps.length - 1) { i++; render(); }
            else {
                tip.style.display = 'none';
                try { localStorage.setItem('tsr_guide_v1', '1'); } catch (e) {}
            }
        };
    };
    render();
}

function injectTsrWorldLobbyUI() {
    const lobby = document.getElementById('tsrLobbyPanel');
    if (!lobby) return;

    const tabRow = lobby.querySelector('.tsr-tab-nav');
    if (tabRow && !document.getElementById('tsrTabBtnSeason')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tsr-tab-btn';
        btn.id = 'tsrTabBtnSeason';
        btn.dataset.tsrTab = 'season';
        btn.textContent = '🏅 赛季';
        btn.onclick = () => switchTsrLobbyTab('season');
        tabRow.appendChild(btn);

        const btn2 = document.createElement('button');
        btn2.type = 'button';
        btn2.className = 'tsr-tab-btn';
        btn2.id = 'tsrTabBtnFaction';
        btn2.dataset.tsrTab = 'faction';
        btn2.textContent = '🏛️ 势力';
        btn2.onclick = () => switchTsrLobbyTab('faction');
        tabRow.appendChild(btn2);
    }

    if (!document.getElementById('tsrTabSeason')) {
        const panel = document.createElement('div');
        panel.id = 'tsrTabSeason';
        panel.className = 'tsr-tab-panel';
        panel.innerHTML = '<div class="tsr-block-title">🏅 赛季通行证</div><div id="tsrSeasonPanel"></div>';
        lobby.appendChild(panel);
    }
    if (!document.getElementById('tsrTabFaction')) {
        const panel = document.createElement('div');
        panel.id = 'tsrTabFaction';
        panel.className = 'tsr-tab-panel';
        panel.innerHTML = '<div class="tsr-block-title">🏛️ 三势力声望</div><div id="tsrFactionPanel" class="tsr-faction-grid"></div>';
        lobby.appendChild(panel);
    }

    const adv = document.getElementById('tsrTabAdventure');
    if (adv && !document.getElementById('tsrBossRushBtn')) {
        const box = document.createElement('div');
        box.className = 'tsr-mode-box';
        box.innerHTML = `
            <div class="tsr-block-title">玩法模式</div>
            <p id="tsrDailyModHint" class="tsr-contract-hint"></p>
            <button type="button" id="tsrBossRushBtn" class="tsr-btn tsr-btn-gold" onclick="startTsrBossRush()">👹 首领冲刺（耗1钥）</button>
            <button type="button" class="tsr-btn tsr-btn-safe" onclick="maybeShowTsrGuide()">📘 新手指引</button>`;
        const main = adv.querySelector('.tsr-adventure-main') || adv;
        main.insertBefore(box, main.firstChild);
    }
    const mod = getTsrDailyRunMod();
    const hint = document.getElementById('tsrDailyModHint');
    if (hint) hint.textContent = `今日修饰：${mod.icon}${mod.name} — ${mod.desc}`;
}

function initTsrWorldExtensions() {
    ensureTsrSeason();
    ensureTsrFactions();

    if (typeof TSR_RELIC_POOL !== 'undefined') Object.assign(TSR_RELIC_POOL, TSR_WORLD_RELICS);
    if (typeof TSR_BATTLE_TACTICS !== 'undefined') Object.assign(TSR_BATTLE_TACTICS, TSR_WORLD_TACTICS);
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') TSR_ACHIEVEMENTS.push(...TSR_WORLD_ACHIEVEMENTS);
    if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined') TSR_SPECIAL_ROOM_TYPES.push(...TSR_WORLD_SPECIAL_ROOMS);
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_WORLD_MONSTER_POOL.battle);
        TSR_MONSTER_POOL.elite.push(...TSR_WORLD_MONSTER_POOL.elite);
        TSR_MONSTER_POOL.boss.push(...TSR_WORLD_MONSTER_POOL.boss);
    }
    if (typeof TSR_CODEX_ROOMS !== 'undefined') {
        TSR_WORLD_SPECIAL_ROOMS.forEach(key => {
            const meta = TSR_WORLD_ROOM_META[key];
            if (meta && !TSR_CODEX_ROOMS.find(r => r.key === key)) {
                TSR_CODEX_ROOMS.push({ key, name: meta.name, icon: meta.icon });
            }
        });
    }
    if (typeof TSR_CONTENT_ROOM_META !== 'undefined') Object.assign(TSR_CONTENT_ROOM_META, TSR_WORLD_ROOM_META);

    if (typeof getTsrRoomTypeMeta === 'function' && !getTsrRoomTypeMeta.__tsrWorldPatched) {
        const _orig = getTsrRoomTypeMeta;
        getTsrRoomTypeMeta = function (type) {
            const m = _orig(type);
            const extra = TSR_WORLD_ROOM_META[type];
            if (extra && (m.name === type || m.icon === '📍')) return { ...m, ...extra };
            return m;
        };
        getTsrRoomTypeMeta.__tsrWorldPatched = true;
    }

    if (typeof handleTsrSpecialRoom === 'function' && !handleTsrSpecialRoom.__tsrWorldPatched) {
        const _orig = handleTsrSpecialRoom;
        handleTsrSpecialRoom = function (type) {
            if (type === 'seasonhall') return handleSeasonhallRoom();
            if (type === 'factionembassy') return handleFactionembassyRoom();
            if (type === 'enclave') return handleEnclaveRoom();
            if (type === 'bossrushgate') return handleBossrushgateRoom();
            if (type === 'debriefarchive') return handleDebriefarchiveRoom();
            return _orig(type);
        };
        handleTsrSpecialRoom.__tsrWorldPatched = true;
    }

    if (typeof recordTsrCodex === 'function' && !recordTsrCodex.__tsrWorldPatched) {
        const _orig = recordTsrCodex;
        recordTsrCodex = function (roomType) {
            _orig(roomType);
            Object.values(TSR_FACTIONS).forEach(fc => {
                if (fc.rooms.includes(roomType)) addTsrFactionRep(fc.id, 2, null);
            });
        };
        recordTsrCodex.__tsrWorldPatched = true;
    }

    if (typeof startTimeSecretRealm === 'function' && !startTimeSecretRealm.__tsrWorldPatched) {
        const _orig = startTimeSecretRealm;
        startTimeSecretRealm = function () {
            _orig();
            const tsr = player?.timeSecretRealm;
            if (!tsr?.currentRun?.isActive) return;
            applyTsrDailyRunMod();
            initTsrBossRushRun();
            if (tsr.pendingConsumables?.length) {
                tsr.pendingConsumables.forEach(k => addTsrConsumable?.(k));
                tsr.pendingConsumables = [];
            }
            const fBonus = getTsrFactionBonus('floorTime');
            if (fBonus) tsr.currentRun.timeLeft += fBonus;
            if (tsr.currentRun.isBossRush) setTimeout(() => continueTsrBossRush(), 500);
            updateTsrEnvDisplay();
        };
        startTimeSecretRealm.__tsrWorldPatched = true;
    }

    if (typeof tsrNextFloor === 'function' && !tsrNextFloor.__tsrWorldPatched) {
        const _orig = tsrNextFloor;
        tsrNextFloor = function () {
            _orig();
            const tsr = player?.timeSecretRealm;
            if (tsr?.currentRun?.isActive) rollTsrEnvironment(tsr.currentRun.currentFloor);
        };
        tsrNextFloor.__tsrWorldPatched = true;
    }

    if (typeof handleBattleRoom === 'function' && !handleBattleRoom.__tsrWorldPatched) {
        const _orig = handleBattleRoom;
        handleBattleRoom = function (options) {
            const tsr = player?.timeSecretRealm;
            if (tsr?.currentRun?.env?.battle?.attack) {
                addTempBuff?.({ name: '气候加持', effect: 'attack', value: tsr.currentRun.env.battle.attack, duration: 1, isDebuff: false });
            }
            const r = _orig(options);
            return r;
        };
        handleBattleRoom.__tsrWorldPatched = true;
    }

    if (typeof applyTsrMonsterAffixRound === 'function' && !applyTsrMonsterAffixRound.__tsrWorldPatched) {
        const _orig = applyTsrMonsterAffixRound;
        applyTsrMonsterAffixRound = function (monster, rounds, monsterHp, monsterMaxHp) {
            let hp = _orig(monster, rounds, monsterHp, monsterMaxHp);
            hp = applyTsrEnvBattleEffects(hp, monsterMaxHp, rounds);
            return hp;
        };
        applyTsrMonsterAffixRound.__tsrWorldPatched = true;
    }

    if (typeof onTsrMonsterBattleVictory === 'function' && !onTsrMonsterBattleVictory.__tsrWorldPatched) {
        const _prev = onTsrMonsterBattleVictory;
        onTsrMonsterBattleVictory = function (monster) {
            if (typeof _prev === 'function') _prev(monster);
            recordTsrMonsterCodex(monster);
            addTsrSeasonXP(8 + (monster?.tier === 'mythic' ? 20 : monster?.tier === 'legendary' ? 12 : 0), null);
            if (player.timeSecretRealm?.currentRun?.isBossRush) addTsrSeasonXP(25, '冲刺击破');
        };
        onTsrMonsterBattleVictory.__tsrWorldPatched = true;
    } else if (typeof onTsrMonsterBattleVictory !== 'function') {
        onTsrMonsterBattleVictory = function (monster) {
            recordTsrMonsterCodex(monster);
            addTsrSeasonXP(8, null);
        };
    }

    if (typeof endTimeSecretRealm === 'function' && !endTimeSecretRealm.__tsrWorldPatched) {
        const _orig = endTimeSecretRealm;
        endTimeSecretRealm = function (reason) {
            const tsr = player.timeSecretRealm;
            const run = tsr?.currentRun;
            const flags = typeof resolveTsrEndClearFlags === 'function'
                ? resolveTsrEndClearFlags(reason)
                : { seasonFullXp: false, debriefAsCleared: false, factionRep: false };
            const debrief = buildTsrDebrief(reason, !!flags.debriefAsCleared);
            if (flags.seasonFullXp) {
                addTsrSeasonXP(80 + (run?.currentFloor || 0) * 2, flags.isChallenge ? '挑战结算' : '通关结算');
                const pledged = ensureTsrFactions().pledged;
                if (flags.factionRep && pledged) addTsrFactionRep(pledged, 6, flags.isChallenge ? '挑战' : '通关');
            } else {
                addTsrSeasonXP(15 + Math.floor((run?.currentFloor || 1) * 1.5), '撤离结算');
            }
            _orig(reason);
            setTimeout(() => showTsrDebrief(debrief), 200);
        };
        endTimeSecretRealm.__tsrWorldPatched = true;
    }

    if (typeof updateTsrCodexDisplay === 'function' && !updateTsrCodexDisplay.__tsrWorldPatched) {
        const _orig = updateTsrCodexDisplay;
        updateTsrCodexDisplay = function () {
            _orig();
            // 若已启用新图鉴 UI，不再二次拼贴怪物/变异区块
            if (updateTsrCodexDisplay.__tsrCodexUiPatched || document.querySelector('.tsr-codex-ui')) return;
            const container = document.getElementById('tsrCodexContent');
            if (!container) return;
            const tsr = player.timeSecretRealm;
            const codex = tsr.codex || {};
            const allMonsters = [];
            if (typeof TSR_MONSTER_POOL !== 'undefined') {
                ['battle', 'elite', 'boss'].forEach(k => (TSR_MONSTER_POOL[k] || []).forEach(m => allMonsters.push(m)));
            }
            const seen = new Set();
            const unique = allMonsters.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
            let extra = '<div class="tsr-codex-section-title">怪物图鉴</div>';
            extra += unique.map(m => {
                const count = codex.monsters?.[m.id] || 0;
                return `<div class="tsr-codex-item ${count ? 'unlocked' : 'locked'}">
                    <div style="font-size:1.3rem;">${m.icon}</div>
                    <div style="font-weight:600;margin:2px 0;font-size:12px;">${m.name}</div>
                    <div style="color:#64748b;font-size:11px;">${count ? '击败 ' + count + ' 次' : '未遭遇'}</div>
                </div>`;
            }).join('');
            if (typeof TSR_MONSTER_MUTATIONS !== 'undefined') {
                extra += '<div class="tsr-codex-section-title">变异图鉴</div>';
                extra += Object.entries(TSR_MONSTER_MUTATIONS).map(([k, mut]) => {
                    const count = codex.mutations?.[k] || 0;
                    return `<div class="tsr-codex-item ${count ? 'unlocked' : 'locked'}">
                        <div style="font-size:1.2rem;">${mut.icon}</div>
                        <div style="font-weight:600;font-size:12px;">${mut.name}</div>
                        <div style="color:#64748b;font-size:11px;">${count ? '遭遇 ' + count + ' 次' : mut.desc}</div>
                    </div>`;
                }).join('');
            }
            if (typeof TSR_MONSTER_LIFE_PROFILES !== 'undefined') {
                extra += '<div class="tsr-codex-section-title">命格图鉴</div>';
                extra += Object.entries(TSR_MONSTER_LIFE_PROFILES).map(([k, life]) => {
                    const count = codex.lifeProfiles?.[k] || 0;
                    return `<div class="tsr-codex-item ${count ? 'unlocked' : 'locked'}">
                        <div style="font-weight:600;font-size:12px;">❤️ ${k} · ${life.stages}段</div>
                        <div style="color:#64748b;font-size:11px;">${count ? '遭遇 ' + count + ' 次' : (life.labels || []).join('/')}</div>
                    </div>`;
                }).join('');
            }
            const stats = container.querySelector('.tsr-codex-stats');
            if (stats) {
                stats.insertAdjacentHTML('beforebegin', extra);
                stats.innerHTML += ` · 怪物: ${Object.keys(codex.monsters || {}).length}/${unique.length}`;
                stats.innerHTML += ` · 变异: ${Object.keys(codex.mutations || {}).length}`;
            } else {
                container.insertAdjacentHTML('beforeend', extra);
            }
        };
        updateTsrCodexDisplay.__tsrWorldPatched = true;
    }

    if (typeof getTsrEquipBonus === 'function' && !getTsrEquipBonus.__tsrWorldPatched) {
        const _orig = getTsrEquipBonus;
        getTsrEquipBonus = function (stat) {
            return _orig(stat) + getTsrFactionBonus(stat);
        };
        getTsrEquipBonus.__tsrWorldPatched = true;
    }

    if (typeof getDefaultTsrShopItems === 'function' && !getDefaultTsrShopItems.__tsrWorldPatched) {
        const _orig = getDefaultTsrShopItems;
        getDefaultTsrShopItems = function () {
            return {
                ..._orig(),
                factionChronos: {
                    name: '时序议会盟约', description: '永久每层+2秒（需时序声望40）',
                    cost: 280000, type: 'permanent', effect: 'tsr_faction_chronos', maxPurchase: 1, purchased: 0,
                    category: 'codex', icon: '⏳', needFaction: { chronos: 40 }
                },
                factionBeast: {
                    name: '兽潮血契', description: '永久攻击+2%（需兽潮声望40）',
                    cost: 280000, type: 'permanent', effect: 'tsr_faction_beast', maxPurchase: 1, purchased: 0,
                    category: 'codex', icon: '🐺', needFaction: { beast: 40 }
                },
                factionVoid: {
                    name: '虚空星盟', description: '永久精灵充能+5%（需虚空声望40）',
                    cost: 280000, type: 'permanent', effect: 'tsr_faction_void', maxPurchase: 1, purchased: 0,
                    category: 'codex', icon: '🕳️', needFaction: { void: 40 }
                }
            };
        };
        getDefaultTsrShopItems.__tsrWorldPatched = true;
    }

    if (typeof getTsrShopItemBlockReason === 'function' && !getTsrShopItemBlockReason.__tsrWorldPatched) {
        const _orig = getTsrShopItemBlockReason;
        getTsrShopItemBlockReason = function (item) {
            const r = _orig(item);
            if (r) return r;
            if (item?.needFaction) {
                const f = ensureTsrFactions();
                for (const [k, need] of Object.entries(item.needFaction)) {
                    if ((f[k] || 0) < need) return `${TSR_FACTIONS[k]?.name || k}声望不足（${f[k] || 0}/${need}）`;
                }
            }
            return null;
        };
        getTsrShopItemBlockReason.__tsrWorldPatched = true;
    }

    if (typeof buyTsrShopItem === 'function' && !buyTsrShopItem.__tsrWorldPatched) {
        const _orig = buyTsrShopItem;
        buyTsrShopItem = function (itemKey) {
            const tsr = player?.timeSecretRealm;
            const item = tsr?.shopItems?.[itemKey];
            if (item && String(item.effect || '').startsWith('tsr_faction_')) {
                ensureTimeSecretRealmData?.();
                const block = getTsrShopItemBlockReason?.(item);
                if (block) { logAction(block, 'error'); return; }
                if ((tsr.currency || 0) < item.cost) { logAction('秘境币不足', 'error'); return; }
                tsr.currency = clampTsrCurrency(tsr.currency - item.cost);
                if (item.maxPurchase) item.purchased = (item.purchased || 0) + 1;
                tsr.permanentBonuses = tsr.permanentBonuses || {};
                if (item.effect === 'tsr_faction_chronos') {
                    const floorCap = typeof TSR_FLOOR_TIME_BONUS_MAX === 'number' ? TSR_FLOOR_TIME_BONUS_MAX : 36;
                    tsr.permanentBonuses.floorTimeBonus = Math.min(floorCap, (tsr.permanentBonuses.floorTimeBonus || 0) + 2);
                }
                if (item.effect === 'tsr_faction_beast') {
                    tsr.permanentBonuses.eternalAttackBonus = typeof clampTsrEternalBonus === 'function'
                        ? clampTsrEternalBonus((tsr.permanentBonuses.eternalAttackBonus || 0) + 0.02)
                        : Math.min(
                            (typeof TSR_ETERNAL_BONUS_MAX === 'number' ? TSR_ETERNAL_BONUS_MAX : 0.75),
                            (tsr.permanentBonuses.eternalAttackBonus || 0) + 0.02
                        );
                }
                if (item.effect === 'tsr_faction_void') tsr.permanentBonuses.spiritChargeAmp = (tsr.permanentBonuses.spiritChargeAmp || 0) + 0.05;
                logAction(`购买成功：${item.name}`, 'success');
                updateTimeSecretRealmUI?.();
                return;
            }
            return _orig(itemKey);
        };
        buyTsrShopItem.__tsrWorldPatched = true;
    }

    if (typeof checkTsrAchievements === 'function' && !checkTsrAchievements.__tsrWorldPatched) {
        const _orig = checkTsrAchievements;
        checkTsrAchievements = function (ctx) {
            _orig(ctx);
            checkTsrWorldAchievements();
        };
        checkTsrAchievements.__tsrWorldPatched = true;
    }

    if (typeof updateTsrLobbyDashboard === 'function' && !updateTsrLobbyDashboard.__tsrWorldPatched) {
        const _orig = updateTsrLobbyDashboard;
        updateTsrLobbyDashboard = function () {
            _orig();
            const side = document.getElementById('tsrDashboardContent');
            if (!side) return;
            const s = ensureTsrSeason();
            const card = document.createElement('div');
            card.className = 'tsr-dash-card';
            card.innerHTML = `<div class="tsr-block-title">🏅 赛季 ${s.key}</div><p>档位 ${getTsrSeasonTier() + 1} · XP ${s.xp}</p>`;
            side.appendChild(card);
        };
        updateTsrLobbyDashboard.__tsrWorldPatched = true;
    }

    setTimeout(() => {
        injectTsrWorldLobbyUI();
        maybeShowTsrGuide();
        renderTsrSeasonPanel();
        renderTsrFactionPanel();
    }, 0);
}

initTsrWorldExtensions();

/**
 * 时光秘境 · 战斗 & 养成扩展
 * 战斗姿态 / 武技招式 / 修炼道场 / 战意怒气 / 战阶军衔 / 静心冥想
 * + 特殊房 · 遗物 · 战术 · 战中事件 · 怪物 · 成就
 */
const TSR_COMBAT_STANCES = {
    assault: { id: 'assault', name: '猛攻', icon: '⚔️', desc: '攻击+13%，暴击+4%，反击抗性-3%', attack: 0.13, critRate: 0.04, counterReduce: -0.03 },
    ironwall: { id: 'ironwall', name: '铁壁', icon: '🛡️', desc: '反击抗性+15%，生命+8%，攻击-4%', attack: -0.04, health: 0.08, counterReduce: 0.15 },
    pierce: { id: 'pierce', name: '破势', icon: '🗡️', desc: '对精英/Boss额外+16%，首回合+10%', eliteBoss: 0.16, firstStrike: 0.1, attack: 0.04 },
    balance: { id: 'balance', name: '均衡', icon: '☯️', desc: '攻击+6%，反击抗性+6%，币+4%', attack: 0.06, counterReduce: 0.06, currency: 0.04 }
};

const TSR_MARTIAL_ARTS = [
    { id: 'artSlash', name: '裂空斩', icon: '⚔️', cost: 70000, dust: 12, desc: '第2回合额外+24%伤害', round: 2, dmg: 0.24 },
    { id: 'artGuard', name: '叠甲式', icon: '🛡️', cost: 75000, dust: 14, desc: '第3回合反击抗性+18%', round: 3, counter: 0.18 },
    { id: 'artCrit', name: '瞳光闪', icon: '💥', cost: 90000, dust: 16, desc: '第4回合强制暴击一次', round: 4, forceCrit: true },
    { id: 'artDrain', name: '噬魂诀', icon: '🩸', cost: 95000, dust: 18, desc: '第5回合回血10%', round: 5, heal: 0.1 },
    { id: 'artSpirit', name: '灵啸', icon: '🧚', cost: 85000, dust: 15, desc: '第3回合精灵充能+24', round: 3, spirit: 24 },
    { id: 'artExecute', name: '斩杀意', icon: '☠️', cost: 120000, dust: 22, desc: '怪物血量<35%时伤害+28%', execBelow: 0.35, execDmg: 0.28 },
    { id: 'artFury', name: '燃怒引', icon: '🔥', cost: 100000, dust: 20, desc: '开战怒气+30', startFury: 30 },
    { id: 'artCombo', name: '连峰式', icon: '🔗', cost: 110000, dust: 20, desc: '连胜≥3时攻击+10%', streakNeed: 3, streakAtk: 0.1 }
];

const TSR_TRAIN_TRACKS = [
    { id: 'blade', name: '剑意修炼', icon: '⚔️', max: 15, costBase: 28000, dustBase: 6, perLevel: { attack: 0.008 }, desc: '每级攻击+0.8%' },
    { id: 'body', name: '体魄修炼', icon: '❤️', max: 15, costBase: 28000, dustBase: 6, perLevel: { health: 0.01 }, desc: '每级生命+1.0%' },
    { id: 'eye', name: '瞳术修炼', icon: '👁️', max: 12, costBase: 36000, dustBase: 8, perLevel: { critRate: 0.005 }, desc: '每级暴击+0.5%' },
    { id: 'guard', name: '护身修炼', icon: '🛡️', max: 12, costBase: 34000, dustBase: 8, perLevel: { counterReduce: 0.006 }, desc: '每级反击抗性+0.6%' },
    { id: 'combo', name: '连斩修炼', icon: '🔗', max: 10, costBase: 42000, dustBase: 10, perLevel: { comboBonus: 0.005 }, desc: '每级连击收益+0.5%' },
    { id: 'fury', name: '怒脉修炼', icon: '🔥', max: 10, costBase: 40000, dustBase: 10, perLevel: { furyGain: 3, furyDmg: 0.012 }, desc: '每级怒气增速+3、爆发伤+1.2%' }
];

const TSR_COMBAT_RANKS = [
    { rank: 1, need: 0, name: '见习刃客', icon: '🥉', attack: 0, health: 0 },
    { rank: 2, need: 80, name: '行刃者', icon: '🥈', attack: 0.015, health: 0.012 },
    { rank: 3, need: 200, name: '破障剑士', icon: '🥇', attack: 0.03, health: 0.02 },
    { rank: 4, need: 400, name: '猎杀校尉', icon: '🎖️', attack: 0.04, health: 0.03 },
    { rank: 5, need: 700, name: '秘境中尉', icon: '🏅', attack: 0.055, health: 0.04 },
    { rank: 6, need: 1100, name: '裂隙都督', icon: '🏵️', attack: 0.07, health: 0.05 },
    { rank: 7, need: 1600, name: '时砂元帅', icon: '👑', attack: 0.09, health: 0.065 },
    { rank: 8, need: 2300, name: '传说战魂', icon: '🌟', attack: 0.12, health: 0.085 }
];

const TSR_COMBAT_TRAIN_MID_EVENTS = [
    { id: 'furySpark', name: '怒火迸发', icon: '🔥', chance: 0.14, minRound: 2, maxRound: 10,
      apply: (ctx) => {
          const run = ctx.tsr.currentRun;
          run.battleFury = Math.min(100, (run.battleFury || 0) + 18);
          return `战意上涨，怒气→${run.battleFury}`;
      } },
    { id: 'stanceSync', name: '姿态共鸣', icon: '☯️', chance: 0.11, minRound: 3, maxRound: 11,
      apply: (ctx) => {
          addTempBuff({ name: '姿态共鸣', effect: 'attack', value: 0.08, duration: 2, isDebuff: false });
          return '当前姿态共鸣，攻击+8%×2';
      } },
    { id: 'artFocus', name: '招式破绽', icon: '🗡️', chance: 0.1, minRound: 2, maxRound: 9, eliteOnly: true,
      apply: (ctx) => {
          ctx.tsr.currentRun.artFocusNext = true;
          return '看穿破绽！下回合伤害+20%';
      } },
    { id: 'medBreath', name: '战中吐纳', icon: '🧘', chance: 0.09, minRound: 4, maxRound: 12,
      apply: (ctx) => {
          tsrHealPlayer(0.05);
          chargeTsrSpirit(8);
          return '吐纳回血5%，充能+8';
      } }
];

const TSR_COMBAT_TRAIN_RELICS = [
    { key: 'stanceBanner', relic: { name: '战姿旌旗', icon: '🚩', desc: '攻击+6%，姿态效果感知+', effect: 'attack', value: 0.06 } },
    { key: 'artScroll', relic: { name: '武技残卷', icon: '📜', desc: '暴击+4%，战斗奖励+6%', effect: 'critRate', value: 0.04 } },
    { key: 'furyDrum', relic: { name: '怒战战鼓', icon: '🥁', desc: '首回合伤害+12%', effect: 'attack', value: 0.05 } },
    { key: 'rankSeal', relic: { name: '军衔印', icon: '🎖️', desc: '精英攻击+8%', effect: 'eliteAttack', value: 0.08 } },
    { key: 'dojoBell', relic: { name: '道场铜铃', icon: '🔔', desc: '连击收益+，生命+5%', effect: 'health', value: 0.05 } },
    { key: 'meditateBead', relic: { name: '静心佛珠', icon: '🧘', desc: '反击-6%，充能+', effect: 'counterReduce', value: 0.06 } },
    { key: 'sparGlove', relic: { name: '切磋拳套', icon: '🥊', desc: '攻击+8%，生命-3%', effect: 'attack', value: 0.08 } },
    { key: 'comboManual', relic: { name: '连斩秘本', icon: '📘', desc: '暴击+3%，秘境币+5%', effect: 'critRate', value: 0.03 } }
];

const TSR_COMBAT_TRAIN_TACTICS = {
    stanceBreak: { id: 'stanceBreak', name: '破姿', icon: '🗡️', desc: '攻击+20%，反击抗性-5%', attack: 0.2, counterReduce: -0.05 },
    furyRush: { id: 'furyRush', name: '燃怒', icon: '🔥', desc: '首回合+34%，后续-3%', firstStrike: 0.34, attackPenaltyAfterFirst: -0.03 },
    artFocus: { id: 'artFocus', name: '专注招', icon: '🎯', desc: '暴击+15%', critRate: 0.15 },
    mediateGuard: { id: 'mediateGuard', name: '吐纳守', icon: '🧘', desc: '反击-18%，攻击-4%', counterReduce: 0.18, attack: -0.04 }
};

const TSR_COMBAT_TRAIN_ROOMS = [
    'traindojo', 'stancehall', 'artforge', 'furycrucible',
    'battlerankgate', 'meditatepeak', 'sparringpit', 'comboarchive'
];

const TSR_COMBAT_TRAIN_ROOM_META = {
    traindojo: { name: '修炼道场', icon: '🥋', color: '#f59e0b' },
    stancehall: { name: '姿态演武厅', icon: '☯️', color: '#38bdf8' },
    artforge: { name: '武技铸堂', icon: '📜', color: '#a78bfa' },
    furycrucible: { name: '怒火坩埚', icon: '🔥', color: '#ef4444' },
    battlerankgate: { name: '战阶之门', icon: '🎖️', color: '#eab308' },
    meditatepeak: { name: '静心峰', icon: '🧘', color: '#34d399' },
    sparringpit: { name: '切磋坑', icon: '🥊', color: '#fb923c' },
    comboarchive: { name: '连斩阁', icon: '🔗', color: '#f472b6' }
};

const TSR_COMBAT_TRAIN_ACHIEVEMENTS = [
    { id: 'stanceSwitch3', name: '三姿游刃', desc: '累计切换战斗姿态3次', icon: '☯️' },
    { id: 'artUnlock4', name: '四艺俱全', desc: '解锁4种武技', icon: '📜' },
    { id: 'trainLv20', name: '道场深造', desc: '修炼道场总等级达20', icon: '🥋' },
    { id: 'furyBurst10', name: '十次燃怒', desc: '触发怒气爆发10次', icon: '🔥' },
    { id: 'combatRank5', name: '尉官之路', desc: '战阶达到5', icon: '🎖️' },
    { id: 'meditate10', name: '静心十息', desc: '完成10次冥想', icon: '🧘' },
    { id: 'sparWin15', name: '切磋达人', desc: '切磋坑胜利15次', icon: '🥊' },
    { id: 'comboArtWin', name: '连峰之姿', desc: '以连峰式加成赢得战斗', icon: '🔗' }
];

const TSR_COMBAT_TRAIN_MONSTERS = {
    battle: [
        { id: 'stanceshadow', name: '姿影傀', icon: '☯️', tier: 'uncommon', intro: '「你站姿有破绽。」', win: '傀儡断线。', skill: 'burst', skillChance: 0.24 },
        { id: 'furyimp', name: '怒焰小鬼', icon: '🔥', tier: 'uncommon', intro: '「越打越兴奋！」', win: '小鬼熄火了。', skill: 'rage', skillChance: 0.28 },
        { id: 'dojoguard', name: '道场杂役', icon: '🥋', tier: 'rare', intro: '「先把地板拖了再走。」', win: '拖把投降了。', skill: 'shield', skillChance: 0.26, skillValue: 0.12 }
    ],
    elite: [
        { id: 'artmaster', name: '武技导师', icon: '📜', tier: 'epic', intro: '「一招不足以定胜负。」', win: '导师点头认可。', skill: 'multiStrike', skillChance: 0.34 },
        { id: 'rankofficer', name: '战阶校尉', icon: '🎖️', tier: 'legendary', intro: '「军衔不是白给的。」', win: '校尉递上军状。', skill: 'affixStorm', skillChance: 0.35 },
        { id: 'combostriker', name: '连斩刺客', icon: '🔗', tier: 'epic', intro: '「第三刀才是杀招。」', win: '刺客消失在刃影里。', skill: 'phaseBlink', skillChance: 0.33 }
    ],
    boss: [
        { id: 'furytyrant', name: '怒火暴君', icon: '🔥', tier: 'mythic', intro: '「怒气满溢时，世界为之燃烧。」', win: '暴君怒火燃尽。', skill: 'tidalWave', skillChance: 0.44 },
        { id: 'dojosovereign', name: '道场宗主', icon: '🥋', tier: 'mythic', intro: '「姿态、招式、心性，缺一不可。」', win: '宗主收招退隐。', skill: 'resonanceBurst', skillChance: 0.42, skillValue: 0.09 }
    ]
};

/* ========== 数据 ========== */
function ensureTsrCombatTrainData() {
    const tsr = player.timeSecretRealm;
    if (!tsr.combatTrain) {
        tsr.combatTrain = {
            stance: 'balance',
            arts: {},
            tracks: {},
            rankXp: 0,
            meditateDay: '',
            meditateCount: 0,
            stanceSwitches: 0
        };
    }
    const ct = tsr.combatTrain;
    if (!ct.arts) ct.arts = {};
    if (!ct.tracks) ct.tracks = {};
    if (!ct.stance) ct.stance = 'balance';
    if (ct.rankXp == null) ct.rankXp = 0;
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    return ct;
}

function getTsrActiveStance() {
    const ct = ensureTsrCombatTrainData();
    return TSR_COMBAT_STANCES[ct.stance] || TSR_COMBAT_STANCES.balance;
}

function setTsrCombatStance(stanceId) {
    ensureTsrCombatTrainData();
    if (!TSR_COMBAT_STANCES[stanceId]) { logAction('无效姿态', 'error'); return; }
    const ct = player.timeSecretRealm.combatTrain;
    if (ct.stance === stanceId) { logAction('已是该姿态', 'info'); return; }
    ct.stance = stanceId;
    ct.stanceSwitches = (ct.stanceSwitches || 0) + 1;
    const s = TSR_COMBAT_STANCES[stanceId];
    logAction(`切换战斗姿态：${s.icon}${s.name}`, 'success');
    renderTsrStancePanel();
    checkTsrCombatTrainAchievements();
}

function getTsrTrainTrackLevel(id) {
    return ensureTsrCombatTrainData().tracks[id] || 0;
}

function getTsrTrainBonus(stat) {
    ensureTsrCombatTrainData();
    let sum = 0;
    TSR_TRAIN_TRACKS.forEach(t => {
        const lv = getTsrTrainTrackLevel(t.id);
        if (lv > 0 && t.perLevel[stat]) sum += t.perLevel[stat] * lv;
    });
    return sum;
}

function upgradeTsrTrainTrack(trackId) {
    ensureTsrCombatTrainData();
    const tsr = player.timeSecretRealm;
    const track = TSR_TRAIN_TRACKS.find(x => x.id === trackId);
    if (!track) return;
    const lv = getTsrTrainTrackLevel(trackId);
    if (lv >= track.max) { logAction('该道已满级', 'error'); return; }
    const cost = Math.floor(track.costBase * (1 + lv * 0.35));
    const dust = Math.floor(track.dustBase * (1 + lv * 0.25));
    if ((tsr.currency || 0) < cost) { logAction(`秘境币不足（${cost}）`, 'error'); return; }
    if ((tsr.refineDust || 0) < dust) { logAction(`精炼尘不足（${dust}）`, 'error'); return; }
    tsr.currency = clampTsrCurrency(tsr.currency - cost);
    tsr.refineDust -= dust;
    tsr.combatTrain.tracks[trackId] = lv + 1;
    tsr.lifetimeStats.trainUpgrades = (tsr.lifetimeStats.trainUpgrades || 0) + 1;
    logAction(`${track.icon}${track.name}升至${lv + 1}级`, 'success');
    renderTsrTrainDojoPanel();
    checkTsrCombatTrainAchievements();
}

function unlockTsrMartialArt(artId) {
    ensureTsrCombatTrainData();
    const tsr = player.timeSecretRealm;
    const art = TSR_MARTIAL_ARTS.find(a => a.id === artId);
    if (!art) return;
    if (tsr.combatTrain.arts[artId]) { logAction('已解锁该武技', 'error'); return; }
    if ((tsr.currency || 0) < art.cost) { logAction('秘境币不足', 'error'); return; }
    if ((tsr.refineDust || 0) < art.dust) { logAction('精炼尘不足', 'error'); return; }
    tsr.currency = clampTsrCurrency(tsr.currency - art.cost);
    tsr.refineDust -= art.dust;
    tsr.combatTrain.arts[artId] = Date.now();
    logAction(`领悟武技：${art.icon}${art.name}`, 'success');
    renderTsrMartialArtsPanel();
    checkTsrCombatTrainAchievements();
}

function getTsrCombatRankInfo() {
    const xp = ensureTsrCombatTrainData().rankXp || 0;
    let cur = TSR_COMBAT_RANKS[0];
    for (const r of TSR_COMBAT_RANKS) {
        if (xp >= r.need) cur = r;
    }
    const next = TSR_COMBAT_RANKS.find(r => r.need > xp) || null;
    return { cur, next, xp };
}

function addTsrCombatRankXp(amount, reason) {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return;
    ensureTsrCombatTrainData();
    const ct = player.timeSecretRealm.combatTrain;
    const before = getTsrCombatRankInfo().cur.rank;
    ct.rankXp = (ct.rankXp || 0) + Math.max(0, Math.floor(amount));
    const after = getTsrCombatRankInfo().cur.rank;
    if (after > before) {
        const info = getTsrCombatRankInfo();
        addTsrLog?.(`🎖️ 战阶晋升：${info.cur.icon}${info.cur.name}`, 'success');
    } else if (reason) {
        addTsrLog?.(`🎖️ 战阶经验+${Math.floor(amount)}（${reason}）`, 'info');
    }
    checkTsrCombatTrainAchievements();
}

function getTsrMeditateDayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function doTsrMeditation() {
    ensureTsrCombatTrainData();
    const tsr = player.timeSecretRealm;
    const ct = tsr.combatTrain;
    const day = getTsrMeditateDayKey();
    if (ct.meditateDay !== day) {
        ct.meditateDay = day;
        ct.meditateCount = 0;
    }
    if ((ct.meditateCount || 0) >= 5) { logAction('今日冥想已达上限（5次）', 'error'); return; }
    const cost = 35;
    if ((tsr.refineDust || 0) < cost && (tsr.currency || 0) < 45000) {
        logAction('需要35精炼尘或45000秘境币进行冥想', 'error');
        return;
    }
    if ((tsr.refineDust || 0) >= cost) tsr.refineDust -= cost;
    else tsr.currency = clampTsrCurrency(tsr.currency - 45000);

    ct.meditateCount = (ct.meditateCount || 0) + 1;
    tsr.lifetimeStats.meditates = (tsr.lifetimeStats.meditates || 0) + 1;
    tsr.permanentBonuses = tsr.permanentBonuses || {};

    const roll = Math.random();
    let msg;
    const medAtk = tsr.lifetimeStats?.meditateAtkGain || 0;
    const medHp = tsr.lifetimeStats?.meditateHpGain || 0;
    if (roll < 0.35) {
        if (medAtk >= 0.06) {
            addTsrCombatRankXp(18, '冥想');
            msg = '剑意已至极限，改为战阶经验+18';
        } else {
            const add = Math.min(0.003, 0.06 - medAtk);
            tsr.permanentBonuses.eternalAttackBonus = typeof clampTsrEternalBonus === 'function'
                ? clampTsrEternalBonus((tsr.permanentBonuses.eternalAttackBonus || 0) + add)
                : Math.min((typeof TSR_ETERNAL_BONUS_MAX === 'number' ? TSR_ETERNAL_BONUS_MAX : 0.75), (tsr.permanentBonuses.eternalAttackBonus || 0) + add);
            tsr.lifetimeStats.meditateAtkGain = medAtk + add;
            msg = `感悟剑意：永恒攻击+${(add * 100).toFixed(1)}%`;
        }
    } else if (roll < 0.65) {
        if (medHp >= 0.1) {
            addTsrRefineDust?.(8, '冥想余韵');
            msg = '气血已足，改为精炼尘+8';
        } else {
            const add = Math.min(0.004, 0.1 - medHp);
            tsr.permanentBonuses.eternalHealthBonus = typeof clampTsrEternalBonus === 'function'
                ? clampTsrEternalBonus((tsr.permanentBonuses.eternalHealthBonus || 0) + add)
                : Math.min((typeof TSR_ETERNAL_BONUS_MAX === 'number' ? TSR_ETERNAL_BONUS_MAX : 0.75), (tsr.permanentBonuses.eternalHealthBonus || 0) + add);
            tsr.lifetimeStats.meditateHpGain = medHp + add;
            msg = `调息养气：永恒生命+${(add * 100).toFixed(1)}%`;
        }
    } else if (roll < 0.85) {
        tsr.permanentBonuses.counterReduce = Math.min(
            (typeof TSR_COUNTER_REDUCE_MAX === 'number' ? TSR_COUNTER_REDUCE_MAX : 0.55),
            (tsr.permanentBonuses.counterReduce || 0) + 0.003
        );
        msg = '定心守势：反击抗性+0.3%';
    } else {
        addTsrCombatRankXp(25, '冥想');
        addTsrRefineDust?.(6, '冥想余韵');
        msg = '空明顿悟：战阶经验+25，尘+6';
    }
    logAction(`🧘 冥想完成：${msg}（今日${ct.meditateCount}/5）`, 'success');
    renderTsrMeditatePanel();
    checkTsrCombatTrainAchievements();
}

/* ========== 战斗结算辅助 ========== */
function getTsrCombatTrainAttackBonus(isBoss, isElite) {
    const stance = getTsrActiveStance();
    let b = (stance.attack || 0) + getTsrTrainBonus('attack');
    const rank = getTsrCombatRankInfo().cur;
    b += rank.attack || 0;
    if ((isBoss || isElite) && stance.eliteBoss) b += stance.eliteBoss;
    const arts = ensureTsrCombatTrainData().arts;
    const streak = player.timeSecretRealm?.currentRun?.battleWinStreak || 0;
    if (arts.artCombo && streak >= 3) {
        b += 0.08;
        player.timeSecretRealm.currentRun._comboArtActive = true;
    }
    if ((player.timeSecretRealm?.currentRun?.relics || []).includes('stanceBanner')) b += 0.02;
    return b;
}

function getTsrCombatTrainCounterReduce() {
    const stance = getTsrActiveStance();
    return (stance.counterReduce || 0) + getTsrTrainBonus('counterReduce');
}

function getTsrCombatTrainHealthMult() {
    const stance = getTsrActiveStance();
    const rank = getTsrCombatRankInfo().cur;
    return 1 + (stance.health || 0) + getTsrTrainBonus('health') + (rank.health || 0);
}

function applyTsrCombatTrainRunStart() {
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    if (!run?.isActive) return;
    ensureTsrCombatTrainData();
    const stance = getTsrActiveStance();
    addTsrLog(`☯️ 战斗姿态：${stance.icon}${stance.name}`, 'info');
    if (stance.currency && run.contractMods) {
        run.contractMods.currencyMod = (run.contractMods.currencyMod || 0) + stance.currency;
    } else if (stance.currency) {
        run.contractMods = Object.assign(run.contractMods || {}, { currencyMod: stance.currency });
    }
    const crit = getTsrTrainBonus('critRate') + (stance.critRate || 0);
    if (crit > 0) addTempBuff({ name: '瞳术/姿态', effect: 'critRate', value: crit, duration: 99, isDebuff: false });

    const hpMult = getTsrCombatTrainHealthMult();
    if (hpMult !== 1 && run.combat) {
        run.combat.baseMaxHp = Math.max(1, Math.floor(run.combat.baseMaxHp * hpMult));
        run.playerHealth = run.combat.baseMaxHp;
    }

    const arts = tsr.combatTrain.arts;
    run.battleFury = 0;
    if (arts.artFury) {
        run.battleFury = Math.min(100, (run.battleFury || 0) + 25);
        addTsrLog('🔥 燃怒引：开战怒气+25', 'info');
    }
    if ((run.relics || []).includes('furyDrum')) run.battleFury = Math.min(100, (run.battleFury || 0) + 10);

    const comboPb = getTsrTrainBonus('comboBonus');
    if (comboPb > 0) {
        tsr.permanentBonuses = tsr.permanentBonuses || {};
        // 局内标记，结算时叠加感知（不改永久存档值用 run 标记）
        run.trainComboBonus = comboPb;
    }
}

function tickTsrBattleFury(ctx) {
    const run = ctx.tsr.currentRun;
    if (!run) return;
    const gain = 10 + getTsrTrainBonus('furyGain') + ((run.relics || []).includes('furyDrum') ? 3 : 0);
    run.battleFury = Math.min(100, (run.battleFury || 0) + gain);
    if (run.battleFury >= 100 && !run.furyBurstLeft) {
        run.battleFury = 0;
        run.furyBurstLeft = 2;
        ctx.tsr.lifetimeStats.furyBursts = (ctx.tsr.lifetimeStats.furyBursts || 0) + 1;
        addTsrLog('🔥 怒气爆发！接下来2回合伤害大幅提升', 'success');
        if (typeof pushTsrFeelEvent === 'function') {
            pushTsrFeelEvent({ type: 'fury', label: '🔥 怒气爆发！' });
        }
        checkTsrCombatTrainAchievements();
    }
}

function tryTsrMartialArtsOnRound(ctx) {
    const arts = ensureTsrCombatTrainData().arts;
    const run = ctx.tsr.currentRun;
    const triggered = run.battleArtsTriggered || (run.battleArtsTriggered = {});
    TSR_MARTIAL_ARTS.forEach(art => {
        if (!arts[art.id] || !art.round || art.round !== ctx.rounds) return;
        if (triggered[art.id]) return;
        triggered[art.id] = true;
        ctx.tsr.lifetimeStats.artsTriggered = (ctx.tsr.lifetimeStats.artsTriggered || 0) + 1;
        if (typeof pushTsrFeelEvent === 'function') {
            pushTsrFeelEvent({ type: 'art', label: `${art.icon}武技「${art.name}」` });
        }
        if (art.dmg) {
            run.artRoundDmg = (run.artRoundDmg || 0) + art.dmg;
            addTsrLog(`${art.icon}武技「${art.name}」：本回合伤害+${Math.floor(art.dmg * 100)}%`, 'success');
        }
        if (art.counter) {
            run.counterReduceBonus = (run.counterReduceBonus || 0) + art.counter;
            addTsrLog(`${art.icon}武技「${art.name}」：反击抗性+${Math.floor(art.counter * 100)}%`, 'success');
        }
        if (art.forceCrit) {
            run.battleCritFlash = true;
            addTsrLog(`${art.icon}武技「${art.name}」：强制暴击！`, 'success');
        }
        if (art.heal) {
            tsrHealPlayer(art.heal);
            addTsrLog(`${art.icon}武技「${art.name}」：回血${Math.floor(art.heal * 100)}%`, 'success');
        }
        if (art.spirit) {
            chargeTsrSpirit(art.spirit);
            addTsrLog(`${art.icon}武技「${art.name}」：充能+${art.spirit}`, 'success');
        }
    });
}

function getTsrCombatTrainDmgMult(opts) {
    const run = player.timeSecretRealm?.currentRun;
    if (!run) return 1;
    let m = 1;
    const stance = getTsrActiveStance();
    if (opts?.rounds === 1 && stance.firstStrike) m += stance.firstStrike;
    if (run.artRoundDmg) {
        m += run.artRoundDmg;
        run.artRoundDmg = 0;
    }
    if (run.artFocusNext) {
        m += 0.2;
        run.artFocusNext = false;
    }
    if (run.furyBurstLeft > 0) {
        m += 0.28 + getTsrTrainBonus('furyDmg');
        run.furyBurstLeft -= 1;
    }
    const arts = ensureTsrCombatTrainData().arts;
    if (arts.artExecute && opts?.monsterMaxHp > 0 && opts.monsterHp / opts.monsterMaxHp < 0.35) {
        m += 0.28;
    }
    if ((run.relics || []).includes('sparGlove')) m += 0.03;
    return m;
}

/* ========== 渲染 ========== */
function renderTsrStancePanel() {
    const el = document.getElementById('tsrStancePanel');
    if (!el) return;
    const ct = ensureTsrCombatTrainData();
    el.innerHTML = `<div class="tsr-ct-head">当前：${getTsrActiveStance().icon}${getTsrActiveStance().name}</div>
        <div class="tsr-ct-grid">${Object.values(TSR_COMBAT_STANCES).map(s => `
            <div class="tsr-ct-card ${ct.stance === s.id ? 'active' : ''}">
                <div class="tsr-ct-title">${s.icon} ${s.name}</div>
                <div class="tsr-ct-desc">${s.desc}</div>
                <button type="button" class="tsr-btn tsr-btn-gold" ${ct.stance === s.id ? 'disabled' : ''}
                    onclick="setTsrCombatStance('${s.id}')">${ct.stance === s.id ? '已启用' : '切换'}</button>
            </div>`).join('')}</div>`;
}

function renderTsrMartialArtsPanel() {
    const el = document.getElementById('tsrMartialArtsPanel');
    if (!el) return;
    const arts = ensureTsrCombatTrainData().arts;
    el.innerHTML = `<div class="tsr-ct-grid">${TSR_MARTIAL_ARTS.map(a => {
        const unlocked = !!arts[a.id];
        return `<div class="tsr-ct-card">
            <div class="tsr-ct-title">${a.icon} ${a.name}</div>
            <div class="tsr-ct-desc">${a.desc}</div>
            <div>${unlocked ? '已领悟' : `${a.cost}币 + ${a.dust}尘`}</div>
            ${unlocked ? '' : `<button type="button" class="tsr-btn tsr-btn-gold" onclick="unlockTsrMartialArt('${a.id}')">领悟</button>`}
        </div>`;
    }).join('')}</div>`;
}

function renderTsrTrainDojoPanel() {
    const el = document.getElementById('tsrTrainDojoPanel');
    if (!el) return;
    ensureTsrCombatTrainData();
    const tsr = player.timeSecretRealm;
    el.innerHTML = `<div class="tsr-ct-head">币 ${tsr.currency || 0} · 尘 ${tsr.refineDust || 0}</div>
        <div class="tsr-ct-grid">${TSR_TRAIN_TRACKS.map(t => {
            const lv = getTsrTrainTrackLevel(t.id);
            const full = lv >= t.max;
            const cost = Math.floor(t.costBase * (1 + lv * 0.35));
            const dust = Math.floor(t.dustBase * (1 + lv * 0.25));
            return `<div class="tsr-ct-card">
                <div class="tsr-ct-title">${t.icon} ${t.name}</div>
                <div class="tsr-ct-desc">${t.desc}</div>
                <div>等级 ${lv}/${t.max}</div>
                <button type="button" class="tsr-btn tsr-btn-gold" ${full ? 'disabled' : ''}
                    onclick="upgradeTsrTrainTrack('${t.id}')">${full ? '满级' : `升级 ${cost}币/${dust}尘`}</button>
            </div>`;
        }).join('')}</div>`;
}

function renderTsrCombatRankPanel() {
    const el = document.getElementById('tsrCombatRankPanel');
    if (!el) return;
    const info = getTsrCombatRankInfo();
    const nextLine = info.next
        ? `下一阶 ${info.next.icon}${info.next.name} 需 ${info.next.need}（还差 ${Math.max(0, info.next.need - info.xp)}）`
        : '已达最高战阶';
    el.innerHTML = `
        <div class="tsr-ct-head">${info.cur.icon} ${info.cur.name} · XP ${info.xp}</div>
        <p>永久战斗加成：攻击+${((info.cur.attack || 0) * 100).toFixed(1)}% · 生命+${((info.cur.health || 0) * 100).toFixed(1)}%</p>
        <p class="tsr-ct-hint">${nextLine}<br>击杀战斗/精英/Boss 获战阶经验；冥想也可少量获取。</p>`;
}

function renderTsrMeditatePanel() {
    const el = document.getElementById('tsrMeditatePanel');
    if (!el) return;
    const ct = ensureTsrCombatTrainData();
    const day = getTsrMeditateDayKey();
    if (ct.meditateDay !== day) { ct.meditateDay = day; ct.meditateCount = 0; }
    el.innerHTML = `
        <div class="tsr-ct-head">今日冥想 ${ct.meditateCount || 0}/5</div>
        <p>消耗 35尘 或 45000币，随机获得微弱永久属性或战阶经验。</p>
        <button type="button" class="tsr-btn tsr-btn-purple" onclick="doTsrMeditation()">🧘 静心冥想</button>
        <p class="tsr-ct-hint">累计冥想 ${player.timeSecretRealm.lifetimeStats?.meditates || 0} 次</p>`;
}

function refreshTsrCombatTrainPanels() {
    renderTsrStancePanel();
    renderTsrMartialArtsPanel();
    renderTsrTrainDojoPanel();
    renderTsrCombatRankPanel();
    renderTsrMeditatePanel();
}

/* ========== 特殊房 ========== */
function markTsrCombatRoomVisit() {
    const tsr = player.timeSecretRealm;
    tsr.lifetimeStats = tsr.lifetimeStats || {};
    tsr.lifetimeStats.combatRooms = (tsr.lifetimeStats.combatRooms || 0) + 1;
}

function handleTraindojoRoom() {
    showTsrMemePanel('🥋 修炼道场', '石人形缓缓抬手：「今日练什么？」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseTrainDojo('spar')">对桩 · 战斗 战阶+12</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseTrainDojo('form')">演练 · -14秒 攻击+10%×3</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseTrainDojo(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'traindojo' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrCombatRoomVisit();
    if (path === 'form') {
        if (tsr.currentRun.timeLeft <= 16) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 14;
        addTempBuff({ name: '道场演练', effect: 'attack', value: 0.1, duration: 3, isDebuff: false });
        finishTsrMemeRoom();
        return;
    }
    if (path === 'spar') {
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        room.isElite = false;
        room.monster = getTsrMonsterById?.('dojoguard') || pickTsrMonster(false, false, tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('battle', dm);
        room.isTrainSpar = true;
        handleBattleRoom();
        if (!bLteZero(tsr.currentRun.playerHealth)) addTsrCombatRankXp(12, '道场对桩');
        return;
    }
    finishTsrMemeRoom();
}

function handleStancehallRoom() {
    const s = getTsrActiveStance();
    showTsrMemePanel('☯️ 姿态演武厅', `当前姿态 ${s.icon}<strong>${s.name}</strong>`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseStanceHall('sync')">同步 · -10秒 姿态攻击翻倍本场</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseStanceHall('switch')">临时破势 · 本局改破势</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseStanceHall(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'stancehall' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrCombatRoomVisit();
    if (path === 'sync') {
        if (tsr.currentRun.timeLeft <= 12) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 10;
        const atk = Math.max(0.06, (getTsrActiveStance().attack || 0) * 2);
        addTempBuff({ name: '姿态同步', effect: 'attack', value: atk, duration: 4, isDebuff: false });
        finishTsrMemeRoom();
        return;
    }
    if (path === 'switch') {
        tsr.currentRun.runStanceOverride = 'pierce';
        addTsrLog('本局临时切换为破势（演武厅）', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleArtforgeRoom() {
    showTsrMemePanel('📜 武技铸堂', '残页在火光中翻飞。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseArtForge('inscribe')">铭刻 · -16秒 下战招式强化</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseArtForge('study')">研读 · -8秒 充能+20</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseArtForge(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'artforge' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrCombatRoomVisit();
    if (path === 'study') {
        if (tsr.currentRun.timeLeft <= 10) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 8;
        chargeTsrSpirit(20);
        finishTsrMemeRoom();
        return;
    }
    if (path === 'inscribe') {
        if (tsr.currentRun.timeLeft <= 18) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 16;
        tsr.currentRun.artFocusNext = true;
        tsr.currentRun.battleFury = Math.min(100, (tsr.currentRun.battleFury || 0) + 15);
        addTsrLog('武技铭刻：下次伤害+20%，怒气+15', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleFurycrucibleRoom() {
    const fury = player.timeSecretRealm.currentRun.battleFury || 0;
    showTsrMemePanel('🔥 怒火坩埚', `当前怒气 <strong>${fury}</strong>/100`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseFuryCrucible('stoke')">煽火 · -12秒 怒气+40</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseFuryCrucible('erupt')">引爆 · 立即爆发进入战斗</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseFuryCrucible(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'furycrucible' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrCombatRoomVisit();
    if (path === 'stoke') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        tsr.currentRun.battleFury = Math.min(100, (tsr.currentRun.battleFury || 0) + 40);
        addTsrLog(`怒气→${tsr.currentRun.battleFury}`, 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'erupt') {
        tsr.currentRun.battleFury = 100;
        tsr.currentRun.furyBurstLeft = 2;
        tsr.lifetimeStats.furyBursts = (tsr.lifetimeStats.furyBursts || 0) + 1;
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        room.isElite = true;
        room.monster = getTsrMonsterById?.('furyimp') || pickTsrMonster(false, true, tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('elite', dm);
        handleBattleRoom({ forceElite: true });
        return;
    }
    finishTsrMemeRoom();
}

function handleBattlerankgateRoom() {
    const info = getTsrCombatRankInfo();
    showTsrMemePanel('🎖️ 战阶之门', `${info.cur.icon}<strong>${info.cur.name}</strong> · XP ${info.xp}`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseBattleRankGate('challenge')">军阶考核 · 精英战 XP+28</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseBattleRankGate('salute')">敬礼 · -10秒 XP+10</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseBattleRankGate(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'battlerankgate' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrCombatRoomVisit();
    if (path === 'salute') {
        if (tsr.currentRun.timeLeft <= 12) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 10;
        addTsrCombatRankXp(10, '敬礼');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'challenge') {
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        room.isElite = true;
        room.monster = getTsrMonsterById?.('rankofficer') || pickTsrMonster(false, true, tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('elite', dm);
        room.isRankExam = true;
        handleBattleRoom({ forceElite: true });
        if (!bLteZero(tsr.currentRun.playerHealth)) addTsrCombatRankXp(28, '军阶考核');
        return;
    }
    finishTsrMemeRoom();
}

function handleMeditatepeakRoom() {
    showTsrMemePanel('🧘 静心峰', '风停了，只剩心跳。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseMeditatePeak('sit')">打坐 · -18秒 回血15% 充能+25</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseMeditatePeak('insight')">顿悟 · -22秒 反击抗性+10%</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseMeditatePeak(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'meditatepeak' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrCombatRoomVisit();
    if (path === 'sit') {
        if (tsr.currentRun.timeLeft <= 20) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 18;
        tsrHealPlayer(0.15);
        chargeTsrSpirit(25);
        finishTsrMemeRoom();
        return;
    }
    if (path === 'insight') {
        if (tsr.currentRun.timeLeft <= 24) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 22;
        tsr.currentRun.counterReduceBonus = (tsr.currentRun.counterReduceBonus || 0) + 0.1;
        addTsrLog('顿悟：反击抗性+10%', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleSparringpitRoom() {
    showTsrMemePanel('🥊 切磋坑', '沙地上画着一个圈：「下去的，才能上来。」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSparringPit('fight')">切磋 · 精英战</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSparringPit('fierce')">死磕 · Boss级 伤高赏厚</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseSparringPit(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'sparringpit' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrCombatRoomVisit();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    room.isSparPit = true;
    if (path === 'fierce') {
        room.isBoss = true;
        room.monster = getTsrMonsterById?.('furytyrant') || pickTsrMonster(true, false, tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('boss', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.35);
        handleBattleRoom();
    } else {
        room.isElite = true;
        room.monster = pickTsrMonster(false, true, tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('elite', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.2);
        handleBattleRoom({ forceElite: true });
    }
    if (!bLteZero(tsr.currentRun.playerHealth)) {
        tsr.lifetimeStats.sparWins = (tsr.lifetimeStats.sparWins || 0) + 1;
        addTsrCombatRankXp(path === 'fierce' ? 35 : 18, '切磋');
        checkTsrCombatTrainAchievements();
    }
}

function handleComboarchiveRoom() {
    const streak = player.timeSecretRealm.currentRun.battleWinStreak || 0;
    showTsrMemePanel('🔗 连斩阁', `当前战斗连胜 ×${streak}`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseComboArchive('bank')">封存连斩 · 连胜+2</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseComboArchive('cash')">兑现 · 按连胜得币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseComboArchive(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'comboarchive' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrCombatRoomVisit();
    const streak = tsr.currentRun.battleWinStreak || 0;
    if (path === 'bank') {
        tsr.currentRun.battleWinStreak = streak + 2;
        addTsrLog(`连斩封存：连胜→×${tsr.currentRun.battleWinStreak}`, 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'cash') {
        const g = addTsrRunCurrency(20 + streak * 18);
        addTsrLog(`兑现连斩×${streak}，获得${g}秘境币`, 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

/* ========== 成就 ========== */
function checkTsrCombatTrainAchievements() {
    const tsr = player?.timeSecretRealm;
    if (!tsr) return;
    if (!tsr.achievements) tsr.achievements = {};
    ensureTsrCombatTrainData();
    const unlock = (id) => {
        if (tsr.achievements[id]) return;
        tsr.achievements[id] = Date.now();
        const a = TSR_COMBAT_TRAIN_ACHIEVEMENTS.find(x => x.id === id);
        if (a) addTsrLog?.(`🏅 成就解锁：${a.name} — ${a.desc}`, 'success');
    };
    const ct = tsr.combatTrain;
    const ls = tsr.lifetimeStats || {};
    if ((ct.stanceSwitches || 0) >= 3) unlock('stanceSwitch3');
    if (Object.keys(ct.arts || {}).length >= 4) unlock('artUnlock4');
    const trainSum = Object.values(ct.tracks || {}).reduce((a, b) => a + b, 0);
    if (trainSum >= 20) unlock('trainLv20');
    if ((ls.furyBursts || 0) >= 10) unlock('furyBurst10');
    if (getTsrCombatRankInfo().cur.rank >= 5) unlock('combatRank5');
    if ((ls.meditates || 0) >= 10) unlock('meditate10');
    if ((ls.sparWins || 0) >= 15) unlock('sparWin15');
    if (ls.comboArtWins) unlock('comboArtWin');
}

/* ========== UI ========== */
function injectTsrCombatTrainLobbyUI() {
    const lobby = document.getElementById('tsrLobbyPanel');
    if (!lobby) return;
    const tabRow = lobby.querySelector('.tsr-tab-nav');
    if (tabRow && !document.getElementById('tsrTabBtnCombatTrain')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tsr-tab-btn';
        btn.id = 'tsrTabBtnCombatTrain';
        btn.dataset.tsrTab = 'combattrain';
        btn.textContent = '⚔️ 战修';
        btn.onclick = () => switchTsrLobbyTab('combattrain');
        tabRow.appendChild(btn);
    }
    if (!document.getElementById('tsrTabCombatTrain')) {
        const panel = document.createElement('div');
        panel.id = 'tsrTabCombatTrain';
        panel.className = 'tsr-tab-panel';
        panel.innerHTML = `
            <div class="tsr-combat-train-layout">
                <section><div class="tsr-block-title">☯️ 战斗姿态</div><div id="tsrStancePanel"></div></section>
                <section><div class="tsr-block-title">📜 武技招式</div><div id="tsrMartialArtsPanel"></div></section>
                <section><div class="tsr-block-title">🥋 修炼道场</div><div id="tsrTrainDojoPanel"></div></section>
                <section><div class="tsr-block-title">🎖️ 战阶军衔</div><div id="tsrCombatRankPanel"></div></section>
                <section><div class="tsr-block-title">🧘 静心冥想</div><div id="tsrMeditatePanel"></div></section>
            </div>`;
        lobby.appendChild(panel);
    }
}

function initTsrCombatTrainExtensions() {
    ensureTsrCombatTrainData();

    if (typeof TSR_RELIC_POOL !== 'undefined') {
        TSR_COMBAT_TRAIN_RELICS.forEach(({ key, relic }) => { TSR_RELIC_POOL[key] = relic; });
    }
    if (typeof TSR_BATTLE_TACTICS !== 'undefined') Object.assign(TSR_BATTLE_TACTICS, TSR_COMBAT_TRAIN_TACTICS);
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') TSR_ACHIEVEMENTS.push(...TSR_COMBAT_TRAIN_ACHIEVEMENTS);
    if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined') TSR_SPECIAL_ROOM_TYPES.push(...TSR_COMBAT_TRAIN_ROOMS);
    if (typeof TSR_BATTLE_MID_EVENTS !== 'undefined') TSR_BATTLE_MID_EVENTS.push(...TSR_COMBAT_TRAIN_MID_EVENTS);
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_COMBAT_TRAIN_MONSTERS.battle);
        TSR_MONSTER_POOL.elite.push(...TSR_COMBAT_TRAIN_MONSTERS.elite);
        TSR_MONSTER_POOL.boss.push(...TSR_COMBAT_TRAIN_MONSTERS.boss);
    }
    if (typeof TSR_CODEX_ROOMS !== 'undefined') {
        TSR_COMBAT_TRAIN_ROOMS.forEach(key => {
            const meta = TSR_COMBAT_TRAIN_ROOM_META[key];
            if (meta && !TSR_CODEX_ROOMS.find(r => r.key === key)) {
                TSR_CODEX_ROOMS.push({ key, name: meta.name, icon: meta.icon });
            }
        });
    }
    if (typeof TSR_CONTENT_ROOM_META !== 'undefined') Object.assign(TSR_CONTENT_ROOM_META, TSR_COMBAT_TRAIN_ROOM_META);

    // 姿态覆盖（演武厅临时破势）
    const _getStance = getTsrActiveStance;
    getTsrActiveStance = function () {
        const override = player.timeSecretRealm?.currentRun?.runStanceOverride;
        if (override && TSR_COMBAT_STANCES[override]) return TSR_COMBAT_STANCES[override];
        return _getStance();
    };

    if (typeof getTsrBattleAttackBonus === 'function' && !getTsrBattleAttackBonus.__tsrCtPatched) {
        const _orig = getTsrBattleAttackBonus;
        getTsrBattleAttackBonus = function (isBoss, isElite) {
            return (_orig(isBoss, isElite) || 0) + getTsrCombatTrainAttackBonus(isBoss, isElite);
        };
        getTsrBattleAttackBonus.__tsrCtPatched = true;
    }

    if (typeof getTsrPermanentCounterReduce === 'function' && !getTsrPermanentCounterReduce.__tsrCtPatched) {
        const _orig = getTsrPermanentCounterReduce;
        getTsrPermanentCounterReduce = function () {
            const run = player.timeSecretRealm?.currentRun;
            return (_orig() || 0) + Math.max(0, getTsrCombatTrainCounterReduce())
                + (run?.counterReduceBonus || 0);
        };
        getTsrPermanentCounterReduce.__tsrCtPatched = true;
    }

    if (typeof getTsrCounterDamageMultiplier === 'function' && !getTsrCounterDamageMultiplier.__tsrCtPatched) {
        const _orig = getTsrCounterDamageMultiplier;
        getTsrCounterDamageMultiplier = function () {
            let m = _orig();
            const cr = getTsrCombatTrainCounterReduce();
            // 仅姿态负抗性加伤；正抗性已并入 getTsrPermanentCounterReduce
            if (cr < 0) m = Math.min(1.45, m - cr);
            return m;
        };
        getTsrCounterDamageMultiplier.__tsrCtPatched = true;
    }

    if (typeof getTsrBattleEquipDamageMult === 'function' && !getTsrBattleEquipDamageMult.__tsrCtPatched) {
        const _orig = getTsrBattleEquipDamageMult;
        getTsrBattleEquipDamageMult = function (opts) {
            return (_orig(opts) || 1) * getTsrCombatTrainDmgMult(opts);
        };
        getTsrBattleEquipDamageMult.__tsrCtPatched = true;
    }

    if (typeof getTsrRoomTypeMeta === 'function' && !getTsrRoomTypeMeta.__tsrCtPatched) {
        const _orig = getTsrRoomTypeMeta;
        getTsrRoomTypeMeta = function (type) {
            const m = _orig(type);
            const extra = TSR_COMBAT_TRAIN_ROOM_META[type];
            if (extra && (m.name === type || m.icon === '📍')) return { ...m, ...extra };
            return m;
        };
        getTsrRoomTypeMeta.__tsrCtPatched = true;
    }

    if (typeof handleTsrSpecialRoom === 'function' && !handleTsrSpecialRoom.__tsrCtPatched) {
        const _orig = handleTsrSpecialRoom;
        const map = {
            traindojo: handleTraindojoRoom,
            stancehall: handleStancehallRoom,
            artforge: handleArtforgeRoom,
            furycrucible: handleFurycrucibleRoom,
            battlerankgate: handleBattlerankgateRoom,
            meditatepeak: handleMeditatepeakRoom,
            sparringpit: handleSparringpitRoom,
            comboarchive: handleComboarchiveRoom
        };
        handleTsrSpecialRoom = function (type) {
            if (map[type]) return map[type]();
            return _orig(type);
        };
        handleTsrSpecialRoom.__tsrCtPatched = true;
    }

    if (typeof tryTsrBattleMidEvent === 'function' && !tryTsrBattleMidEvent.__tsrCtPatched) {
        const _orig = tryTsrBattleMidEvent;
        tryTsrBattleMidEvent = function (ctx) {
            tickTsrBattleFury(ctx);
            tryTsrMartialArtsOnRound(ctx);
            return _orig(ctx);
        };
        tryTsrBattleMidEvent.__tsrCtPatched = true;
    }

    if (typeof onTsrMonsterBattleVictory === 'function' && !onTsrMonsterBattleVictory.__tsrCtPatched) {
        const _prev = onTsrMonsterBattleVictory;
        onTsrMonsterBattleVictory = function (monster) {
            _prev(monster);
            const room = player.timeSecretRealm?.currentRun?.currentRoom;
            let xp = 8;
            if (room?.isElite) xp = 16;
            if (room?.isBoss || room?.type === 'boss') xp = 30;
            if (room?.isSparPit) xp += 6;
            if (room?.isRankExam) xp += 8;
            addTsrCombatRankXp(xp, '战斗胜利');
            if (player.timeSecretRealm?.currentRun?._comboArtActive) {
                player.timeSecretRealm.lifetimeStats.comboArtWins = (player.timeSecretRealm.lifetimeStats.comboArtWins || 0) + 1;
                player.timeSecretRealm.currentRun._comboArtActive = false;
                checkTsrCombatTrainAchievements();
            }
        };
        onTsrMonsterBattleVictory.__tsrCtPatched = true;
    }

    if (typeof startTimeSecretRealm === 'function' && !startTimeSecretRealm.__tsrCtPatched) {
        const _orig = startTimeSecretRealm;
        startTimeSecretRealm = function () {
            _orig();
            if (player?.timeSecretRealm?.currentRun?.isActive) applyTsrCombatTrainRunStart();
        };
        startTimeSecretRealm.__tsrCtPatched = true;
    }

    if (typeof addTsrRunCurrency === 'function' && !addTsrRunCurrency.__tsrCtPatched) {
        const _orig = addTsrRunCurrency;
        addTsrRunCurrency = function (amount, options) {
            const run = player.timeSecretRealm?.currentRun;
            let a = amount;
            if (run?.trainComboBonus && (run.battleWinStreak || 0) >= 2) {
                a = Math.floor(a * (1 + run.trainComboBonus));
            }
            return _orig(a, options);
        };
        addTsrRunCurrency.__tsrCtPatched = true;
    }

    if (typeof checkTsrAchievements === 'function' && !checkTsrAchievements.__tsrCtPatched) {
        const _orig = checkTsrAchievements;
        checkTsrAchievements = function (ctx) {
            _orig(ctx);
            checkTsrCombatTrainAchievements();
        };
        checkTsrAchievements.__tsrCtPatched = true;
    }

    if (typeof getDefaultTsrShopItems === 'function' && !getDefaultTsrShopItems.__tsrCtPatched) {
        const _orig = getDefaultTsrShopItems;
        getDefaultTsrShopItems = function () {
            return {
                ..._orig(),
                combatManual: {
                    name: '战修手记', description: '立刻获得60战阶经验（限购5）',
                    cost: 80000, type: 'permanent', effect: 'tsr_rank_xp', maxPurchase: 5, purchased: 0,
                    category: 'enhance', icon: '🎖️'
                },
                stanceDrill: {
                    name: '姿态训练册', description: '永久攻击+0.5%（限购8）',
                    cost: 100000, type: 'permanent', effect: 'tsr_stance_atk', maxPurchase: 8, purchased: 0,
                    category: 'enhance', icon: '☯️'
                }
            };
        };
        getDefaultTsrShopItems.__tsrCtPatched = true;
    }

    if (typeof buyTsrShopItem === 'function' && !buyTsrShopItem.__tsrCtPatched) {
        const _orig = buyTsrShopItem;
        buyTsrShopItem = function (itemKey) {
            const tsr = player?.timeSecretRealm;
            const item = tsr?.shopItems?.[itemKey];
            if (item && (item.effect === 'tsr_rank_xp' || item.effect === 'tsr_stance_atk')) {
                ensureTimeSecretRealmData?.();
                const block = getTsrShopItemBlockReason?.(item);
                if (block) { logAction(block, 'error'); return; }
                if ((tsr.currency || 0) < item.cost) { logAction('秘境币不足', 'error'); return; }
                tsr.currency = clampTsrCurrency(tsr.currency - item.cost);
                if (item.maxPurchase) item.purchased = (item.purchased || 0) + 1;
                if (item.effect === 'tsr_rank_xp') {
                    addTsrCombatRankXp(60, '战修手记');
                    logAction('阅读战修手记：战阶经验+60', 'success');
                } else {
                    tsr.permanentBonuses = tsr.permanentBonuses || {};
                    const cur = tsr.permanentBonuses.eternalAttackBonus || 0;
                    const add = typeof clampTsrEternalBonus === 'function'
                        ? Math.max(0, clampTsrEternalBonus(cur + 0.005) - clampTsrEternalBonus(cur))
                        : Math.min(0.005, Math.max(0, 0.35 - cur));
                    if (add <= 0) {
                        logAction('永恒攻击已达上限，退还秘境币', 'error');
                        tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                        if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                        return;
                    }
                    tsr.permanentBonuses.eternalAttackBonus = (tsr.permanentBonuses.eternalAttackBonus || 0) + add;
                    logAction(`姿态训练册：永恒攻击+${(add * 100).toFixed(1)}%`, 'success');
                }
                updateTimeSecretRealmUI?.();
                return;
            }
            return _orig(itemKey);
        };
        buyTsrShopItem.__tsrCtPatched = true;
    }

    if (typeof updateTsrLobbyDashboard === 'function' && !updateTsrLobbyDashboard.__tsrCtPatched) {
        const _orig = updateTsrLobbyDashboard;
        updateTsrLobbyDashboard = function () {
            _orig();
            const side = document.getElementById('tsrDashboardContent');
            if (!side) return;
            const info = getTsrCombatRankInfo();
            const s = getTsrActiveStance();
            const card = document.createElement('div');
            card.className = 'tsr-dash-card';
            card.innerHTML = `<div class="tsr-block-title">⚔️ 战修</div>
                <p>${s.icon}${s.name} · ${info.cur.icon}${info.cur.name}</p>
                <p>道场等级合计 ${Object.values(ensureTsrCombatTrainData().tracks).reduce((a, b) => a + b, 0)} · 武技 ${Object.keys(ensureTsrCombatTrainData().arts).length}</p>`;
            side.appendChild(card);
        };
        updateTsrLobbyDashboard.__tsrCtPatched = true;
    }

    setTimeout(() => {
        injectTsrCombatTrainLobbyUI();
        refreshTsrCombatTrainPanels();
    }, 70);
}

initTsrCombatTrainExtensions();

/**
 * 时光秘境 · 传说扩展（继续大量）
 * 通缉追猎板 / 时纹印记 / 时隙试炼塔 / 裂隙连胜 / 时砂交易所 / 命运骰
 * + 大量特殊房 · 遗物 · 战术 · 怪物 · 成就
 */
const TSR_BOUNTY_TEMPLATES = [
    { id: 'killElite', name: '精英清剿', icon: '⚔️', desc: '击败精英怪', need: 3, match: (m, room) => !!(room?.isElite || m?._tsrElite), reward: { dust: 18, xp: 40, currency: 22000 } },
    { id: 'killBoss', name: '首领悬赏', icon: '👑', desc: '击败Boss', need: 1, match: (m, room) => !!(room?.isBoss || room?.type === 'boss'), reward: { dust: 28, xp: 70, currency: 35000 } },
    { id: 'killAffix', name: '词条猎手', icon: '🏷️', desc: '击败带词条怪', need: 4, match: (m) => !!(m?.affixes?.length || m?.affix), reward: { dust: 16, xp: 45, currency: 20000 } },
    { id: 'killMut', name: '变异猎杀', icon: '🧬', desc: '击败变异怪', need: 2, match: (m) => !!(m?.mutation || m?.mutations?.length), reward: { dust: 22, xp: 55, currency: 26000 } },
    { id: 'killLife', name: '多命收割', icon: '💀', desc: '击败多命怪', need: 2, match: (m) => !!(m?.lifeProfile || m?._lifeProfile), reward: { dust: 24, xp: 60, currency: 28000 } },
    { id: 'killStreak', name: '连斩标靶', icon: '🔥', desc: '任意战斗击杀', need: 8, match: () => true, reward: { dust: 14, xp: 35, currency: 16000 } },
    { id: 'killMythic', name: '神话通缉', icon: '🌟', desc: '击败传说/神话怪', need: 2, match: (m) => m?.tier === 'legendary' || m?.tier === 'mythic', reward: { dust: 30, xp: 80, currency: 40000 } },
    { id: 'killGhost', name: '猎影通缉', icon: '👻', desc: '击败残影/镜像', need: 1, match: (m, room) => m?.id === 'playerghost' || room?.isGhostDuel, reward: { dust: 20, xp: 50, currency: 30000 } }
];

const TSR_CHRONO_SIGILS = [
    { id: 'sigAtk', name: '锋芒时纹', icon: '⚔️', cost: 90000, dust: 20, desc: '永久攻击+1.2%', effect: { eternalAttackBonus: 0.012 } },
    { id: 'sigHp', name: '血脉时纹', icon: '❤️', cost: 90000, dust: 20, desc: '永久生命+1.8%', effect: { eternalHealthBonus: 0.018 } },
    { id: 'sigTime', name: '沙漏时纹', icon: '⏳', cost: 110000, dust: 28, desc: '永久每层+2秒', effect: { floorTimeBonus: 2 } },
    { id: 'sigCoin', name: '金砂时纹', icon: '🪙', cost: 100000, dust: 24, desc: '永久局内币+2%', effect: { runCurrencyBonus: 0.02 } },
    { id: 'sigCrit', name: '裂击时纹', icon: '💥', cost: 130000, dust: 32, desc: '局内暴击感知+（开局暴击buff）', effect: { startCritBuff: 0.06 } },
    { id: 'sigAffix', name: '词海时纹', icon: '🏷️', cost: 120000, dust: 30, desc: '永久词条赏金+2%', effect: { affixTome: 0.02 } },
    { id: 'sigSpirit', name: '灵弦时纹', icon: '🧚', cost: 115000, dust: 26, desc: '永久精灵充能+2%', effect: { spiritChargeAmp: 0.02 } },
    { id: 'sigWard', name: '护障时纹', icon: '🛡️', cost: 105000, dust: 22, desc: '开局反击减免+6%', effect: { startCounterReduce: 0.06 } },
    { id: 'sigBounty', name: '悬赏时纹', icon: '📜', cost: 140000, dust: 35, desc: '通缉完成赏金+15%', effect: { bountyAmp: 0.15 } },
    { id: 'sigStreak', name: '连胜时纹', icon: '🔗', cost: 150000, dust: 38, desc: '裂隙连胜奖励+12%', effect: { streakAmp: 0.12 } }
];

const TSR_TRIAL_MODIFIERS = [
    { id: 'glass', name: '玻璃体', desc: '你的生命-18%，攻击+12%', apply: (run) => { run.trialHpMult = 0.82; run.trialAtkMult = 1.12; } },
    { id: 'slowclock', name: '慢时钟', desc: '剩余时间×0.9，奖励+10%', apply: (run) => { run.timeLeft = Math.floor(run.timeLeft * 0.9); run.trialRewardMult = 1.1; } },
    { id: 'affixrain', name: '词条雨', desc: '怪物词条更容易，赏金+8%', apply: (run) => { run.affixRollBoost = (run.affixRollBoost || 0) + 0.25; run.trialRewardMult = (run.trialRewardMult || 1) * 1.08; } },
    { id: 'muttide', name: '变异潮', desc: '变异感知强，妖力+10%', apply: (run) => { run.mutationBoost = (run.mutationBoost || 0) + 0.2; run.monsterFlatMult = (run.monsterFlatMult || 0) + 0.1; } },
    { id: 'bloodtax', name: '血税', desc: '每层结束扣4%生命', apply: (run) => { run.trialBloodTax = 0.04; } },
    { id: 'greedfire', name: '贪火', desc: '币+20%，受伤+8%', apply: (run) => { run.contractMods = run.contractMods || {}; run.contractMods.currencyMod = (run.contractMods.currencyMod || 0) + 0.2; run.trialHurtAmp = 0.08; } }
];

const TSR_FATE_DICE_FACES = [
    { id: 'gold', name: '金砂一面', icon: '🪙', weight: 22, apply: (tsr) => { addTsrPermanentCurrency?.(18000); return '秘境币+18000'; } },
    { id: 'dust', name: '尘砂一面', icon: '✨', weight: 20, apply: () => { addTsrRefineDust?.(16, '命运骰'); return '精炼尘+16'; } },
    { id: 'xp', name: '星愿一面', icon: '⭐', weight: 18, apply: () => { addTsrSeasonXP?.(55, '命运骰'); return '赛季经验+55'; } },
    { id: 'atk', name: '锋芒一面', icon: '⚔️', weight: 12, apply: (tsr) => {
        tsr.permanentBonuses = tsr.permanentBonuses || {};
        const gained = tsr.lifetimeStats?.fateAtkGain || 0;
        if (gained >= 0.05) return '锋芒感悟已满（攻击永久+5%顶）';
        const add = Math.min(0.003, 0.05 - gained);
        tsr.permanentBonuses.eternalAttackBonus = typeof clampTsrEternalBonus === 'function'
            ? clampTsrEternalBonus((tsr.permanentBonuses.eternalAttackBonus || 0) + add)
            : Math.min((typeof TSR_ETERNAL_BONUS_MAX === 'number' ? TSR_ETERNAL_BONUS_MAX : 0.75), (tsr.permanentBonuses.eternalAttackBonus || 0) + add);
        tsr.lifetimeStats = tsr.lifetimeStats || {};
        tsr.lifetimeStats.fateAtkGain = gained + add;
        return `永恒攻击+${(add * 100).toFixed(1)}%`;
    } },
    { id: 'time', name: '时砂一面', icon: '⏳', weight: 14, apply: (tsr) => {
        tsr.permanentBonuses = tsr.permanentBonuses || {};
        const gained = tsr.lifetimeStats?.fateTimeGain || 0;
        if (gained >= 8) return '时砂感悟已满（每层+8秒顶）';
        const floorCap = typeof TSR_FLOOR_TIME_BONUS_MAX === 'number' ? TSR_FLOOR_TIME_BONUS_MAX : 36;
        tsr.permanentBonuses.floorTimeBonus = Math.min(floorCap, (tsr.permanentBonuses.floorTimeBonus || 0) + 1);
        tsr.lifetimeStats = tsr.lifetimeStats || {};
        tsr.lifetimeStats.fateTimeGain = gained + 1;
        return '每层时间+1秒';
    } },
    { id: 'key', name: '钥光一面', icon: '🔑', weight: 6, apply: () => { player.items.fuben2 = (player.items.fuben2 || 0) + 1; return '秘境钥匙+1'; } },
    { id: 'curse', name: '裂痕一面', icon: '🕳️', weight: 8, apply: (tsr) => {
        tsr.permanentBonuses = tsr.permanentBonuses || {};
        tsr.permanentBonuses.runCurrencyBonus = Math.max(0, (tsr.permanentBonuses.runCurrencyBonus || 0) - 0.005);
        return '局内币-0.5%（裂痕）';
    } }
];

const TSR_EXCHANGE_OFFERS = [
    { id: 'coin2dust', name: '币兑尘', icon: '✨', costLabel: '52000币', can: (t) => (t.currency || 0) >= 52000, pay: (t) => { t.currency = clampTsrCurrency(t.currency - 52000); }, gain: () => addTsrRefineDust(12, '交易所') },
    { id: 'dust2coin', name: '尘兑币', icon: '🪙', costLabel: '15尘', can: (t) => (t.refineDust || 0) >= 15, pay: (t) => { t.refineDust -= 15; }, gain: () => addTsrPermanentCurrency(28000) },
    { id: 'dust2xp', name: '尘兑赛季经验', icon: '⭐', costLabel: '22尘', can: (t) => (t.refineDust || 0) >= 22, pay: (t) => { t.refineDust -= 22; }, gain: () => addTsrSeasonXP?.(40, '交易所') },
    { id: 'coin2xp', name: '币兑赛季经验', icon: '🌠', costLabel: '80000币', can: (t) => (t.currency || 0) >= 80000, pay: (t) => { t.currency = clampTsrCurrency(t.currency - 80000); }, gain: () => addTsrSeasonXP?.(50, '交易所') },
    { id: 'xpFrag', name: '经验碎兑尘', icon: '💎', costLabel: '赛季经验牺牲30', can: (t) => (ensureTsrSeason?.().xp || 0) >= 80, pay: () => {
        const s = ensureTsrSeason();
        s.xp = Math.max(0, (s.xp || 0) - 30);
    }, gain: () => addTsrRefineDust(10, '经验碎') }
];

const TSR_LEGENDS_RELICS = [
    { key: 'bountyBadge', relic: { name: '通缉徽章', icon: '📜', desc: '战斗奖励+6%，悬赏感知+', effect: 'currency', value: 0.06 } },
    { key: 'sigilLens', relic: { name: '印记透镜', icon: '🔮', desc: '攻击+7%，反击-3%', effect: 'attack', value: 0.07 } },
    { key: 'trialCrest', relic: { name: '试炼纹章', icon: '🗼', desc: '试炼奖励+，生命+5%', effect: 'health', value: 0.05 } },
    { key: 'streakChain', relic: { name: '连胜锁链', icon: '🔗', desc: '连击收益+，暴击+3%', effect: 'critRate', value: 0.03 } },
    { key: 'exchangeSeal', relic: { name: '交易所封印', icon: '💱', desc: '秘境币+8%', effect: 'currency', value: 0.08 } },
    { key: 'fateCube', relic: { name: '命运方骰', icon: '🎲', desc: '赌局胜率+，特殊房+4%', effect: 'specialRoom', value: 0.04 } },
    { key: 'shadowPact', relic: { name: '影卫契约', icon: '👤', desc: '开局协助一次：首战伤害+15%', effect: 'attack', value: 0.05 } },
    { key: 'towerKeystone', relic: { name: '塔基钥石', icon: '🗝️', desc: 'Boss房奖励+，词条赏金+5%', effect: 'currency', value: 0.05 } },
    { key: 'omenBell', relic: { name: '预兆铜铃', icon: '🔔', desc: '时间+（局内+体感），陷阱减伤', effect: 'trapReduce', value: 0.12 } },
    { key: 'legendBanner', relic: { name: '传说旌旗', icon: '🚩', desc: '精英/Boss攻击+8%', effect: 'attack', value: 0.08 } }
];

const TSR_LEGENDS_TACTICS = {
    bountyFocus: { id: 'bountyFocus', name: '悬赏锁定', icon: '🎯', desc: '首回合+30%，后续-4%', firstStrike: 0.3, attackPenaltyAfterFirst: -0.04 },
    trialGuard: { id: 'trialGuard', name: '试炼铁壁', icon: '🛡️', desc: '反击减免+10%，攻击-4%', counterReduce: 0.1, attack: -0.04 },
    streakDash: { id: 'streakDash', name: '连胜突进', icon: '🔗', desc: '暴击+8%，战斗奖励+12%', critRate: 0.08, battleReward: 0.12 },
    shadowStrike: { id: 'shadowStrike', name: '影袭', icon: '👤', desc: '攻击+14%，生命-6%', attack: 0.14, healthPenalty: 0.06 }
};

const TSR_LEGENDS_SPECIAL_ROOMS = [
    'bountyboard', 'sigilforge', 'trialgate', 'exchangepost', 'fatedicehall',
    'streakshrine', 'shadowaltar', 'omencrypt', 'legendvault', 'chronoarena'
];

const TSR_LEGENDS_ROOM_META = {
    bountyboard: { name: '通缉板', icon: '📜', color: '#f59e0b' },
    sigilforge: { name: '时纹锻炉', icon: '🔮', color: '#a78bfa' },
    trialgate: { name: '试炼之门', icon: '🗼', color: '#38bdf8' },
    exchangepost: { name: '时砂驿站', icon: '💱', color: '#34d399' },
    fatedicehall: { name: '命运骰厅', icon: '🎲', color: '#f472b6' },
    streakshrine: { name: '连胜神龛', icon: '🔗', color: '#fb923c' },
    shadowaltar: { name: '影卫祭坛', icon: '👤', color: '#94a3b8' },
    omencrypt: { name: '预兆地窟', icon: '🔔', color: '#67e8f9' },
    legendvault: { name: '传说金库', icon: '🏦', color: '#eab308' },
    chronoarena: { name: '时隙竞技场', icon: '🏟️', color: '#c084fc' }
};

const TSR_LEGENDS_ACHIEVEMENTS = [
    { id: 'bountyClear3', name: '悬赏小队', desc: '完成3次通缉', icon: '📜' },
    { id: 'sigilEquip3', name: '三纹齐全', desc: '同时装备3枚时纹', icon: '🔮' },
    { id: 'trialFloor5', name: '塔攀五层', desc: '试炼塔抵达第5波', icon: '🗼' },
    { id: 'streak5', name: '裂隙五连', desc: '裂隙连胜达到5', icon: '🔗' },
    { id: 'exchange10', name: '驿站常客', desc: '交易所兑换10次', icon: '💱' },
    { id: 'fateDice5', name: '骰运者', desc: '掷命运骰5次', icon: '🎲' },
    { id: 'shadowAssist3', name: '影卫同盟', desc: '发动影卫协战3次', icon: '👤' },
    { id: 'legendRooms8', name: '传说漫游', desc: '进入传说扩展特殊房累计8次', icon: '🚩' }
];

const TSR_LEGENDS_MONSTERS = {
    battle: [
        { id: 'bountyhound', name: '通缉猎犬', icon: '🐕', tier: 'uncommon', intro: '「你的脸，出现在告示上了。」', win: '猎犬丢下通缉令跑了。', skill: 'rage', skillChance: 0.24 },
        { id: 'sigilmoth', name: '时纹蛾', icon: '🦋', tier: 'uncommon', intro: '「别碰炉火，它会咬你的纹。」', win: '蛾灰落进熔炉。', skill: 'reflect', skillChance: 0.22, skillValue: 0.04 },
        { id: 'diceling', name: '骰灵', icon: '🎲', tier: 'rare', intro: '「六点是祝福，一点是毁灭。」', win: '骰灵停在六点。', skill: 'coinSteal', skillChance: 0.26, skillValue: 14 },
        { id: 'streakwisp', name: '连胜磷火', icon: '🔥', tier: 'uncommon', intro: '「打断连胜的人，都会被点着。」', win: '磷火熄灭。', skill: 'burst', skillChance: 0.28 }
    ],
    elite: [
        { id: 'trialwarden', name: '试炼看守', icon: '🗼', tier: 'epic', intro: '「塔里没有捷径。」', win: '看守钥匙掉了下来。', skill: 'shield', skillChance: 0.34, skillValue: 0.16 },
        { id: 'exchangegolem', name: '兑换魔像', icon: '💱', tier: 'legendary', intro: '「汇率今日生效，拒退。」', win: '魔像被清算破产。', skill: 'coinSteal', skillChance: 0.36, skillValue: 36 },
        { id: 'shadowenvoy', name: '影卫使节', icon: '👤', tier: 'epic', intro: '「我可以帮你——也可以杀你。」', win: '使节鞠躬离去。', skill: 'phaseBlink', skillChance: 0.33 },
        { id: 'omenherald', name: '预兆传讯使', icon: '🔔', tier: 'legendary', intro: '「铃响三次，厄运落定。」', win: '铃舌裂开了。', skill: 'timeDrain', skillChance: 0.35, skillValue: 7 }
    ],
    boss: [
        { id: 'bountyking', name: '悬赏之王', icon: '📜', tier: 'mythic', intro: '「全城的通缉令，都盖着我的印。」', win: '悬赏榜被撕碎。', skill: 'affixStorm', skillChance: 0.44 },
        { id: 'towersovereign', name: '塔上主权者', icon: '👑', tier: 'mythic', intro: '「第五波之后，才是真正的塔。」', win: '主权者被打下塔巅。', skill: 'tidalWave', skillChance: 0.42 },
        { id: 'fatearchon', name: '命运执政官', icon: '🎲', tier: 'mythic', intro: '「骰子没有公平，只有配额。」', win: '执政官掷出零点。', skill: 'resonanceBurst', skillChance: 0.4, skillValue: 0.1 }
    ]
};

/* ===== 数据 ===== */
function getTsrDayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function ensureTsrLegendsData() {
    const tsr = player.timeSecretRealm;
    if (!tsr.bounties) tsr.bounties = { dayKey: '', list: [] };
    if (!tsr.sigils) tsr.sigils = { unlocked: {}, equipped: [null, null, null] };
    if (!tsr.fractureStreak) tsr.fractureStreak = { current: 0, best: 0 };
    if (!tsr.fateDice) tsr.fateDice = { weekKey: '', rolls: 0 };
    if (!tsr.trialBest) tsr.trialBest = 0;
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    return tsr;
}

function getTsrSigilBonus(key) {
    ensureTsrLegendsData();
    const eq = player.timeSecretRealm.sigils.equipped || [];
    let sum = 0;
    eq.forEach(id => {
        if (!id) return;
        const s = TSR_CHRONO_SIGILS.find(x => x.id === id);
        if (s?.effect?.[key]) sum += s.effect[key];
    });
    return sum;
}

function refreshTsrDailyBounties(force) {
    ensureTsrLegendsData();
    const tsr = player.timeSecretRealm;
    const day = getTsrDayKey();
    if (!force && tsr.bounties.dayKey === day && tsr.bounties.list?.length) return tsr.bounties.list;
    const seed = (typeof hashTsrSeed === 'function' ? hashTsrSeed(day + ':bounty') : day.length * 97);
    const pool = [...TSR_BOUNTY_TEMPLATES];
    const list = [];
    for (let i = 0; i < 3 && pool.length; i++) {
        const idx = (seed + i * 17) % pool.length;
        const t = pool.splice(idx, 1)[0];
        list.push({ ...t, progress: 0, done: false, claimed: false });
    }
    tsr.bounties = { dayKey: day, list };
    return list;
}

function progressTsrBounty(monster, room) {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return;
    ensureTsrLegendsData();
    const list = refreshTsrDailyBounties();
    let changed = false;
    list.forEach(b => {
        if (b.done || b.claimed) return;
        try {
            if (b.match && b.match(monster, room)) {
                b.progress = (b.progress || 0) + 1;
                changed = true;
                if (b.progress >= b.need) {
                    b.done = true;
                    addTsrLog?.(`📜 通缉完成：${b.icon}${b.name}（可回大厅领取）`, 'success');
                }
            }
        } catch (e) { /* ignore match errors */ }
    });
    if (changed) checkTsrLegendsAchievements();
}

/** 传说通缉领赏（勿覆盖福利中心 claimTsrBounty） */
function claimTsrLegendBounty(bountyId) {
    ensureTsrLegendsData();
    const tsr = player.timeSecretRealm;
    const b = (tsr.bounties.list || []).find(x => x.id === bountyId);
    if (!b) return;
    if (!b.done) { logAction('尚未完成该通缉', 'error'); return; }
    if (b.claimed) { logAction('已领取过该赏金', 'error'); return; }
    b.claimed = true;
    const amp = 1 + getTsrSigilBonus('bountyAmp') + (tsr.permanentBonuses?.bountyAmp || 0)
        + ((tsr.currentRun?.relics || []).includes('bountyBadge') ? 0.1 : 0);
    const r = b.reward || {};
    if (r.dust) addTsrRefineDust?.(Math.floor(r.dust * amp), '通缉');
    if (r.xp && typeof addTsrSeasonXP === 'function') addTsrSeasonXP(Math.floor(r.xp * amp), '通缉');
    if (r.currency) addTsrPermanentCurrency?.(Math.floor(r.currency * amp));
    tsr.lifetimeStats.bountiesClaimed = (tsr.lifetimeStats.bountiesClaimed || 0) + 1;
    logAction(`领取通缉赏金：${b.icon}${b.name}`, 'success');
    renderTsrBountyPanel();
    checkTsrLegendsAchievements();
}

function unlockTsrSigil(sigilId) {
    ensureTsrLegendsData();
    const tsr = player.timeSecretRealm;
    const s = TSR_CHRONO_SIGILS.find(x => x.id === sigilId);
    if (!s) return;
    if (tsr.sigils.unlocked[sigilId]) { logAction('该时纹已解锁', 'error'); return; }
    if ((tsr.currency || 0) < s.cost) { logAction('秘境币不足', 'error'); return; }
    if ((tsr.refineDust || 0) < s.dust) { logAction('精炼尘不足', 'error'); return; }
    tsr.currency = clampTsrCurrency(tsr.currency - s.cost);
    tsr.refineDust -= s.dust;
    tsr.sigils.unlocked[sigilId] = Date.now();
    logAction(`解锁时纹：${s.icon}${s.name}`, 'success');
    renderTsrSigilPanel();
}

function equipTsrSigil(slot, sigilId) {
    ensureTsrLegendsData();
    const tsr = player.timeSecretRealm;
    const eq = tsr.sigils.equipped;
    if (slot < 0 || slot > 2) return;
    if (sigilId && !tsr.sigils.unlocked[sigilId]) { logAction('尚未解锁该时纹', 'error'); return; }
    if (sigilId && eq.includes(sigilId)) { logAction('已装备同款时纹', 'error'); return; }
    eq[slot] = sigilId || null;
    tsr.lifetimeStats.sigilEquips = (tsr.lifetimeStats.sigilEquips || 0) + 1;
    logAction(sigilId ? `装备时纹至槽位${slot + 1}` : `卸下槽位${slot + 1}`, 'success');
    renderTsrSigilPanel();
    checkTsrLegendsAchievements();
}

function applyTsrSigilRunStart() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    ensureTsrLegendsData();
    const crit = getTsrSigilBonus('startCritBuff');
    const ward = getTsrSigilBonus('startCounterReduce');
    if (crit > 0) addTempBuff?.({ name: '裂击时纹', effect: 'critRate', value: crit, duration: 99, isDebuff: false });
    if (ward > 0) tsr.currentRun.counterReduceBonus = (tsr.currentRun.counterReduceBonus || 0) + ward;
    if ((tsr.currentRun.relics || []).includes('shadowPact')) {
        tsr.currentRun.shadowAssistReady = true;
        addTsrLog('👤 影卫契约生效：本局可在影卫祭坛/首战发动协战', 'info');
    }
    const atkMult = tsr.currentRun.trialAtkMult || 1;
    const hpMult = tsr.currentRun.trialHpMult || 1;
    if (atkMult !== 1 || hpMult !== 1) {
        if (tsr.currentRun.combat) {
            tsr.currentRun.combat.baseAttack = Math.max(1, Math.floor(tsr.currentRun.combat.baseAttack * atkMult));
            tsr.currentRun.combat.baseMaxHp = Math.max(1, Math.floor(tsr.currentRun.combat.baseMaxHp * hpMult));
            tsr.currentRun.playerAttack = tsr.currentRun.combat.baseAttack;
            tsr.currentRun.playerHealth = tsr.currentRun.combat.baseMaxHp;
        }
    }
}

/* ===== 试炼塔 ===== */
function startTsrTrialTower() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.difficulty?.current) { logAction('请先选择难度！', 'error'); return; }
    if ((player.items?.fuben2 || 0) < 1) { alert('需要至少 1 把秘境钥匙！'); return; }
    tsr.pendingTrialTower = true;
    startTimeSecretRealm();
}

function initTsrTrialTowerRun() {
    const tsr = player.timeSecretRealm;
    if (!tsr.pendingTrialTower) return;
    tsr.pendingTrialTower = false;
    const run = tsr.currentRun;
    run.isTrialTower = true;
    run.trialWave = 0;
    run.trialTarget = 6;
    run.trialRewardMult = 1.15;
    const mod = TSR_TRIAL_MODIFIERS[Math.floor(Math.random() * TSR_TRIAL_MODIFIERS.length)];
    run.trialModId = mod.id;
    mod.apply(run);
    addTsrLog(`🗼 时隙试炼开幕：修饰「${mod.name}」— ${mod.desc}（波次间可换装）`, 'warning');
    applyTsrSigilRunStart();
    setTimeout(() => continueTsrTrialTower(), 400);
}

function continueTsrTrialTower() {
    const tsr = player.timeSecretRealm;
    const run = tsr.currentRun;
    if (!run?.isTrialTower || !run.isActive) return;
    if (run._challengeGearBreakActive) return;
    if (run.battleInProgress || run._resolvingBattle || run._trialAdvancing) {
        setTimeout(() => continueTsrTrialTower(), 120);
        return;
    }
    run.trialWave = (run.trialWave || 0) + 1;
    if (run.trialWave > run.trialTarget) {
        run.trialCleared = true;
        tsr.lifetimeStats.trialClears = (tsr.lifetimeStats.trialClears || 0) + 1;
        tsr.trialBest = Math.max(tsr.trialBest || 0, run.trialTarget);
        const amp = run.trialRewardMult || 1;
        addTsrRefineDust?.(Math.floor(36 * amp), '试炼通关');
        addTsrSeasonXP?.(Math.floor(160 * amp), '试炼通关');
        addTsrPermanentCurrency?.(Math.floor(1000 * amp));
        addTsrLog('🗼 试炼塔全通！', 'success');
        checkTsrLegendsAchievements();
        endTimeSecretRealm('trialTowerClear');
        return;
    }
    const floor = 3 + run.trialWave;
    const dm = run.difficultyMultiplier || 1;
    const isBoss = run.trialWave === run.trialTarget || run.trialWave % 3 === 0;
    const monster = isBoss
        ? (pickTsrMonster?.(true, false, floor, dm) || TSR_LEGENDS_MONSTERS.boss[0])
        : (pickTsrMonster?.(false, true, floor, dm) || TSR_LEGENDS_MONSTERS.elite[0]);
    if (run.monsterFlatMult && monster) monster._trialFlat = run.monsterFlatMult;
    const room = {
        type: isBoss ? 'boss' : 'elite',
        isBoss: !!isBoss,
        isElite: !isBoss,
        explored: true,
        battleCleared: false,
        monster,
        isTrialWave: true,
        rewards: generateRoomRewards(isBoss ? 'boss' : 'elite', dm)
    };
    room.rewards.currency = Math.floor(room.rewards.currency * (1 + run.trialWave * 0.03));
    run.currentRoom = room;
    run.currentFloor = floor;
    run._trialAdvancing = true;
    const fightId = typeof beginTsrChallengeFight === 'function' ? beginTsrChallengeFight(run) : 0;
    addTsrLog(`🗼 试炼波次 ${run.trialWave}/${run.trialTarget}`, 'warning');
    handleBattleRoom({ forceElite: !isBoss });
    let settleTries = 0;
    const settle = () => {
        const r = player.timeSecretRealm?.currentRun;
        if (!r?.isActive || !r.isTrialTower) return;
        if (r.battleInProgress || r._resolvingBattle) {
            if (++settleTries < 200) setTimeout(settle, 120);
            else r._trialAdvancing = false;
            return;
        }
        const summary = r.lastBattleSummary;
        if (fightId && (!summary || summary.fightId !== fightId)) {
            if (++settleTries < 200) setTimeout(settle, 120);
            else r._trialAdvancing = false;
            return;
        }
        r._trialAdvancing = false;
        const won = !!summary?.victory && !bLteZero(r.playerHealth);
        if (!won) {
            // 无摘要=异常中断，不误判「战斗失败」秒退
            if (summary && r.isActive && !bLteZero(r.playerHealth)) endTimeSecretRealm('战斗失败');
            return;
        }
        player.timeSecretRealm.trialBest = Math.max(player.timeSecretRealm.trialBest || 0, r.trialWave);
        if (r.trialBloodTax && typeof applyDamage === 'function') {
            applyDamage(bMul(r.playerHealth, r.trialBloodTax));
            addTsrLog('🩸 试炼血税', 'warning');
            if (bLteZero(r.playerHealth) || !r.isActive) return;
        }
        if (typeof tsrHealPlayer === 'function') tsrHealPlayer(0.1);
        const nextWave = (r.trialWave || 0) + 1;
        const goNext = () => {
            const cur = player.timeSecretRealm?.currentRun;
            if (cur?.isActive && cur.isTrialTower) continueTsrTrialTower();
        };
        if (nextWave > (r.trialTarget || 6)) {
            setTimeout(goNext, 280);
        } else if (typeof scheduleTsrChallengeGearBreak === 'function') {
            scheduleTsrChallengeGearBreak(goNext, {
                label: '时隙试炼 · 换装',
                wave: nextWave,
                target: r.trialTarget
            });
        } else {
            setTimeout(goNext, 320);
        }
    };
    if (typeof waitTsrBattleSettled === 'function') waitTsrBattleSettled(settle);
    else setTimeout(settle, 80);
}

/* ===== 裂隙连胜 / 命运骰 / 交易所 ===== */
function updateTsrFractureStreak(cleared) {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return;
    ensureTsrLegendsData();
    const tsr = player.timeSecretRealm;
    if (cleared) {
        tsr.fractureStreak.current = (tsr.fractureStreak.current || 0) + 1;
        tsr.fractureStreak.best = Math.max(tsr.fractureStreak.best || 0, tsr.fractureStreak.current);
        const n = tsr.fractureStreak.current;
        const amp = 1 + getTsrSigilBonus('streakAmp');
        if (n >= 2) {
            const dust = Math.floor((4 + n * 2) * amp);
            const xp = Math.floor((12 + n * 6) * amp);
            addTsrRefineDust?.(dust, `连胜×${n}`);
            addTsrSeasonXP?.(xp, `连胜×${n}`);
            addTsrLog(`🔗 裂隙连胜 ×${n}！`, 'success');
        }
    } else {
        if ((tsr.fractureStreak.current || 0) > 0) {
            addTsrLog(`🔗 裂隙连胜中断（曾达×${tsr.fractureStreak.current}）`, 'warning');
        }
        tsr.fractureStreak.current = 0;
    }
    checkTsrLegendsAchievements();
}

function ensureTsrFateDice() {
    ensureTsrLegendsData();
    const tsr = player.timeSecretRealm;
    const wk = typeof getTsrWeekKey === 'function' ? getTsrWeekKey() : getTsrDayKey();
    if (tsr.fateDice.weekKey !== wk) tsr.fateDice = { weekKey: wk, rolls: 0 };
    return tsr.fateDice;
}

function rollTsrFateDice() {
    const state = ensureTsrFateDice();
    if ((state.rolls || 0) >= 3) { logAction('本周命运骰已用尽（3次）', 'error'); return; }
    const tsr = player.timeSecretRealm;
    const total = TSR_FATE_DICE_FACES.reduce((a, f) => a + f.weight, 0);
    let roll = Math.random() * total;
    let face = TSR_FATE_DICE_FACES[0];
    for (const f of TSR_FATE_DICE_FACES) {
        roll -= f.weight;
        if (roll <= 0) { face = f; break; }
    }
    state.rolls = (state.rolls || 0) + 1;
    const msg = face.apply(tsr);
    tsr.lifetimeStats.fateDiceRolls = (tsr.lifetimeStats.fateDiceRolls || 0) + 1;
    logAction(`🎲 命运骰「${face.icon}${face.name}」：${msg}`, 'success');
    renderTsrFateDicePanel();
    checkTsrLegendsAchievements();
}

function executeTsrExchange(offerId) {
    ensureTsrLegendsData();
    const tsr = player.timeSecretRealm;
    const offer = TSR_EXCHANGE_OFFERS.find(o => o.id === offerId);
    if (!offer) return;
    const day = typeof getTsrDayKey === 'function' ? getTsrDayKey() : String(new Date().toDateString());
    if (!tsr.exchangeDay || tsr.exchangeDay.key !== day) tsr.exchangeDay = { key: day, count: 0 };
    if ((tsr.exchangeDay.count || 0) >= 5) {
        logAction('今日交易所已达 5 次上限', 'error');
        return;
    }
    if (!offer.can(tsr)) { logAction('兑换条件不足', 'error'); return; }
    offer.pay(tsr);
    offer.gain();
    tsr.exchangeDay.count = (tsr.exchangeDay.count || 0) + 1;
    tsr.lifetimeStats.exchanges = (tsr.lifetimeStats.exchanges || 0) + 1;
    logAction(`💱 兑换成功：${offer.icon}${offer.name}（今日 ${tsr.exchangeDay.count}/5）`, 'success');
    renderTsrExchangePanel();
    checkTsrLegendsAchievements();
}

function activateTsrShadowAssist() {
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    if (!run?.isActive) { logAction('需在冒险中发动', 'error'); return false; }
    if (run.shadowAssistUsed) { logAction('本局影卫已发动', 'error'); return false; }
    run.shadowAssistUsed = true;
    run.shadowAssistReady = false;
    addTempBuff?.({ name: '影卫协战', effect: 'attack', value: 0.18, duration: 2, isDebuff: false });
    tsr.lifetimeStats.shadowAssists = (tsr.lifetimeStats.shadowAssists || 0) + 1;
    addTsrLog('👤 影卫切入战场！攻击+18%×2', 'success');
    checkTsrLegendsAchievements();
    return true;
}

/* ===== 渲染 ===== */
function renderTsrBountyPanel() {
    const el = document.getElementById('tsrBountyPanel');
    if (!el) return;
    const list = refreshTsrDailyBounties();
    el.innerHTML = `<div class="tsr-leg-head">今日通缉 · ${getTsrDayKey()}</div>
        <div class="tsr-bounty-list">${list.map(b => `
            <div class="tsr-bounty-card ${b.done ? 'done' : ''}">
                <div class="tsr-bounty-title">${b.icon} ${b.name}</div>
                <div class="tsr-bounty-desc">${b.desc}（${b.progress || 0}/${b.need}）</div>
                <button type="button" class="tsr-btn tsr-btn-gold" ${(!b.done || b.claimed) ? 'disabled' : ''}
                    onclick="claimTsrLegendBounty('${b.id}')">${b.claimed ? '已领' : (b.done ? '领赏' : '进行中')}</button>
            </div>`).join('')}</div>
        <p class="tsr-leg-hint">在局内击杀对应目标自动推进；领赏回大厅「传说」页。</p>`;
}

function renderTsrSigilPanel() {
    const el = document.getElementById('tsrSigilPanel');
    if (!el) return;
    ensureTsrLegendsData();
    const tsr = player.timeSecretRealm;
    const eq = tsr.sigils.equipped;
    const slots = eq.map((id, i) => {
        const s = id ? TSR_CHRONO_SIGILS.find(x => x.id === id) : null;
        return `<div class="tsr-sigil-slot">槽${i + 1}：${s ? `${s.icon}${s.name}` : '空'}
            <button type="button" class="tsr-btn tsr-btn-ghost" onclick="equipTsrSigil(${i}, null)">卸下</button></div>`;
    }).join('');
    const cards = TSR_CHRONO_SIGILS.map(s => {
        const unlocked = !!tsr.sigils.unlocked[s.id];
        const equipped = eq.includes(s.id);
        const slotBtns = unlocked && !equipped
            ? [0, 1, 2].map(i => `<button type="button" class="tsr-btn tsr-btn-safe" onclick="equipTsrSigil(${i},'${s.id}')">装${i + 1}</button>`).join('')
            : '';
        return `<div class="tsr-sigil-card">
            <div class="tsr-sigil-title">${s.icon} ${s.name}</div>
            <div class="tsr-sigil-desc">${s.desc}</div>
            <div>${unlocked ? '已解锁' : `解锁 ${s.cost}币 + ${s.dust}尘`}</div>
            ${unlocked ? '' : `<button type="button" class="tsr-btn tsr-btn-gold" onclick="unlockTsrSigil('${s.id}')">解锁</button>`}
            ${slotBtns}
            ${equipped ? '<span class="tsr-leg-tag">装备中</span>' : ''}
        </div>`;
    }).join('');
    el.innerHTML = `<div class="tsr-leg-head">时纹槽位（最多3）</div>${slots}
        <div class="tsr-sigil-grid">${cards}</div>`;
}

function renderTsrTrialPanel() {
    const el = document.getElementById('tsrTrialPanel');
    if (!el) return;
    ensureTsrLegendsData();
    const tsr = player.timeSecretRealm;
    el.innerHTML = `
        <div class="tsr-leg-head">🗼 时隙试炼塔</div>
        <p>连续6波递增压力（含随机修饰），通关发尘/赛季经验/币。</p>
        <p>历史最佳波次：<strong>${tsr.trialBest || 0}</strong> · 通关次数 ${tsr.lifetimeStats.trialClears || 0}</p>
        <button type="button" class="tsr-btn tsr-btn-purple" onclick="startTsrTrialTower()">开始试炼（耗1钥）</button>`;
}

function renderTsrStreakPanel() {
    const el = document.getElementById('tsrStreakPanel');
    if (!el) return;
    ensureTsrLegendsData();
    const s = player.timeSecretRealm.fractureStreak;
    el.innerHTML = `
        <div class="tsr-leg-head">🔗 裂隙连胜</div>
        <p>当前连胜 <strong>×${s.current || 0}</strong> · 历史最佳 ×${s.best || 0}</p>
        <p class="tsr-leg-hint">通关（含周Boss/Rush/试炼通关）叠层；失败或非通关撤离清零。×2起发尘与经验。</p>`;
}

function renderTsrExchangePanel() {
    const el = document.getElementById('tsrExchangePanel');
    if (!el) return;
    ensureTsrLegendsData();
    const tsr = player.timeSecretRealm;
    el.innerHTML = `<div class="tsr-leg-head">💱 时砂交易所 · 币 ${tsr.currency || 0} · 尘 ${tsr.refineDust || 0}</div>
        <div class="tsr-exchange-grid">${TSR_EXCHANGE_OFFERS.map(o => `
            <div class="tsr-exchange-card">
                <div class="tsr-exchange-title">${o.icon} ${o.name}</div>
                <div>消耗：${o.costLabel}</div>
                <button type="button" class="tsr-btn tsr-btn-gold" onclick="executeTsrExchange('${o.id}')">兑换</button>
            </div>`).join('')}</div>`;
}

function renderTsrFateDicePanel() {
    const el = document.getElementById('tsrFateDicePanel');
    if (!el) return;
    const st = ensureTsrFateDice();
    el.innerHTML = `
        <div class="tsr-leg-head">🎲 命运骰 · 本周 ${st.rolls || 0}/3</div>
        <p>每周三次：金砂、尘、经验、微永久、钥匙或裂痕。</p>
        <button type="button" class="tsr-btn tsr-btn-gold" ${(st.rolls || 0) >= 3 ? 'disabled' : ''} onclick="rollTsrFateDice()">掷骰</button>`;
}

function refreshTsrLegendsPanels() {
    renderTsrBountyPanel();
    renderTsrSigilPanel();
    renderTsrTrialPanel();
    renderTsrStreakPanel();
    renderTsrExchangePanel();
    renderTsrFateDicePanel();
}

/* ===== 特殊房 ===== */
function handleBountyboardRoom() {
    const list = refreshTsrDailyBounties();
    const lines = list.map(b => `${b.icon}${b.name} ${b.progress || 0}/${b.need}${b.done ? ' ✓' : ''}`).join('<br>');
    showTsrMemePanel('📜 通缉板', `今日悬赏进度：<br>${lines}`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseBountyBoard('hunt')">狩猎冲刺 · 精英战</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseBountyBoard('intel')">情报 · -12秒 攻击+10%×3</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseBountyBoard(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'bountyboard' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrLegendRoomVisit('bountyboard');
    if (path === 'intel') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        addTempBuff({ name: '通缉情报', effect: 'attack', value: 0.1, duration: 3, isDebuff: false });
        finishTsrMemeRoom();
        return;
    }
    if (path === 'hunt') {
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        room.isElite = true;
        room.monster = pickTsrMonster(false, true, tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('elite', dm);
        handleBattleRoom({ forceElite: true });
        return;
    }
    finishTsrMemeRoom();
}

function handleSigilforgeRoom() {
    showTsrMemePanel('🔮 时纹锻炉', '炉火映出未成型的印记。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSigilForge('temper')">淬纹 · -16秒 反击减免+8%</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSigilForge('dust')">炼尘 · -50币 尘+8</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseSigilForge(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'sigilforge' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrLegendRoomVisit('sigilforge');
    if (path === 'temper') {
        if (tsr.currentRun.timeLeft <= 18) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 16;
        tsr.currentRun.counterReduceBonus = (tsr.currentRun.counterReduceBonus || 0) + 0.08;
        addTsrLog('时纹淬炼：反击减免+8%', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'dust') {
        if ((tsr.currentRun.currencyEarned || 0) < 50) { addTsrLog('秘境币不足', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 50;
        addTsrRefineDust?.(8, '锻炉');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleTrialgateRoom() {
    showTsrMemePanel('🗼 试炼之门', '门缝吹出塔内寒风。局内只能窥探，完整试炼请在大厅开启。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseTrialGate('spar')">试手 · 精英波</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseTrialGate('med')">冥想 · -10秒 生命回复12%</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseTrialGate(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'trialgate' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrLegendRoomVisit('trialgate');
    if (path === 'med') {
        if (tsr.currentRun.timeLeft <= 12) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 10;
        if (typeof tsrHealPlayer === 'function') tsrHealPlayer(0.12);
        else if (tsr.currentRun.combat) {
            const max = tsr.currentRun.combat.baseMaxHp;
            tsr.currentRun.playerHealth = Math.min(max, Math.floor((tsr.currentRun.playerHealth || 0) + max * 0.12));
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'spar') {
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        room.isElite = true;
        room.monster = pickTsrMonster(false, true, tsr.currentRun.currentFloor + 2, dm);
        room.rewards = generateRoomRewards('elite', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.25);
        handleBattleRoom({ forceElite: true });
        return;
    }
    finishTsrMemeRoom();
}

function handleExchangepostRoom() {
    showTsrMemePanel('💱 时砂驿站', '驿站掌柜敲响算盘：「局内小额兑换，大厅有更大盘口。」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseExchangePost('c2d')">40币→6尘</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseExchangePost('d2c')">8尘→55币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseExchangePost(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'exchangepost' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrLegendRoomVisit('exchangepost');
    if (path === 'c2d') {
        if ((tsr.currentRun.currencyEarned || 0) < 40) { addTsrLog('秘境币不足', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 40;
        addTsrRefineDust?.(6, '驿站');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'd2c') {
        ensureTsrEndgameData?.();
        if ((tsr.refineDust || 0) < 8) { addTsrLog('精炼尘不足', 'warning'); finishTsrMemeRoom(); return; }
        tsr.refineDust -= 8;
        addTsrRunCurrency(55);
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleFatedicehallRoom() {
    showTsrMemePanel('🎲 命运骰厅', '厅中央悬着一枚永不落地的巨骰。局内可赊一次好运。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseFateDiceHall('luck')">赌好运 · -14秒 50% 币翻倍小奖</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseFateDiceHall('steady')">求稳 · -8秒 +25币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseFateDiceHall(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'fatedicehall' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrLegendRoomVisit('fatedicehall');
    if (path === 'steady') {
        if (tsr.currentRun.timeLeft <= 10) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 8;
        addTsrRunCurrency(25);
        finishTsrMemeRoom();
        return;
    }
    if (path === 'luck') {
        if (tsr.currentRun.timeLeft <= 16) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 14;
        if (Math.random() < 0.5) {
            const g = addTsrRunCurrency(40 + Math.floor(Math.random() * 50));
            addTsrLog(`骰运眷顾，获得${g}秘境币`, 'success');
        } else {
            applyDamage?.(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('骰运翻车，受到轻伤', 'error');
        }
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleStreakshrineRoom() {
    const s = ensureTsrLegendsData().fractureStreak;
    showTsrMemePanel('🔗 连胜神龛', `当前裂隙连胜 ×${s.current || 0}（最佳 ×${s.best || 0}）`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseStreakShrine('pray')">祈胜 · -12秒 按连胜得 buff</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseStreakShrine('bank')">铸链 · 局内连杀感知+</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseStreakShrine(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'streakshrine' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrLegendRoomVisit('streakshrine');
    const n = tsr.fractureStreak?.current || 0;
    if (path === 'pray') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        const v = 0.06 + Math.min(0.12, n * 0.02);
        addTempBuff({ name: '连胜祈愿', effect: 'attack', value: v, duration: 3, isDebuff: false });
        finishTsrMemeRoom();
        return;
    }
    if (path === 'bank') {
        tsr.currentRun.battleWinStreak = (tsr.currentRun.battleWinStreak || 0) + 1;
        addTsrLog('铸链共鸣：战斗连胜计数+1', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleShadowaltarRoom() {
    const ready = !player.timeSecretRealm.currentRun.shadowAssistUsed;
    showTsrMemePanel('👤 影卫祭坛', ready ? '影卫愿为你挡一刀。' : '影卫已歇息。',
        `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseShadowAltar('assist')" ${ready ? '' : 'disabled'}>召影协战（本局一次）</button>
         <button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseShadowAltar('duel')">影卫试炼 · 精英战</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseShadowAltar(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'shadowaltar' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrLegendRoomVisit('shadowaltar');
    if (path === 'assist') {
        activateTsrShadowAssist();
        finishTsrMemeRoom();
        return;
    }
    if (path === 'duel') {
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        room.isElite = true;
        room.monster = getTsrMonsterById?.('shadowenvoy') || pickTsrMonster(false, true, tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('elite', dm);
        handleBattleRoom({ forceElite: true });
        return;
    }
    finishTsrMemeRoom();
}

function handleOmencryptRoom() {
    showTsrMemePanel('🔔 预兆地窟', '铜铃轻颤，像在倒计时某件尚未发生的事。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseOmenCrypt('listen')">聆铃 · -10秒 预览+1</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseOmenCrypt('silence')">消音 · -15秒 时间+28</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseOmenCrypt(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'omencrypt' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrLegendRoomVisit('omencrypt');
    if (path === 'listen') {
        if (tsr.currentRun.timeLeft <= 12) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 10;
        tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, 1);
        updateTsrRoomPreview?.();
        addTsrLog('预兆显现：预览增强', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'silence') {
        if (tsr.currentRun.timeLeft <= 16) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft = tsr.currentRun.timeLeft - 15 + 28;
        addTsrLog('消音成功：净赚时间', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleLegendvaultRoom() {
    showTsrMemePanel('🏦 传说金库', '金库门半掩，里面堆着不肯公开估值的东西。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseLegendVault('open')">撬锁 · 60% 重赏 / 40% 精英伏击</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseLegendVault('bribe')">贿赂 · -70币 稳得尘×10</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseLegendVault(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'legendvault' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrLegendRoomVisit('legendvault');
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'bribe') {
        if ((tsr.currentRun.currencyEarned || 0) < 70) { addTsrLog('秘境币不足', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 70;
        addTsrRefineDust?.(10, '金库贿');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'open') {
        if (Math.random() < 0.6) {
            addTsrRunCurrency(Math.floor(90 * dm));
            addTsrRefineDust?.(8, '金库');
            if (typeof addTsrSeasonXP === 'function') addTsrSeasonXP(20, '金库');
            finishTsrMemeRoom();
        } else {
            room.isElite = true;
            room.monster = pickTsrMonster(false, true, tsr.currentRun.currentFloor, dm);
            room.rewards = generateRoomRewards('elite', dm);
            handleBattleRoom({ forceElite: true });
        }
        return;
    }
    finishTsrMemeRoom();
}

function handleChronoarenaRoom() {
    showTsrMemePanel('🏟️ 时隙竞技场', '观众是时间本身。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseChronoArena('fight')">角斗 · 精英战 奖励×1.4</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseChronoArena('boss')">挑战看守 · Boss级</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}
function tsrChooseChronoArena(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'chronoarena' || !room.explored) return;
    hideTsrChoicePanels();
    markTsrLegendRoomVisit('chronoarena');
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'fight') {
        room.isElite = true;
        room.monster = pickTsrMonster(false, true, tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('elite', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.4);
        handleBattleRoom({ forceElite: true });
        return;
    }
    if (path === 'boss') {
        room.isBoss = true;
        room.monster = getTsrMonsterById?.('towersovereign') || pickTsrMonster(true, false, tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('boss', dm);
        handleBattleRoom();
        return;
    }
    finishTsrMemeRoom();
}

function markTsrLegendRoomVisit(type) {
    const tsr = player.timeSecretRealm;
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.legendRooms = (tsr.lifetimeStats.legendRooms || 0) + 1;
    checkTsrLegendsAchievements();
}

/* ===== 成就 ===== */
function checkTsrLegendsAchievements() {
    const tsr = player?.timeSecretRealm;
    if (!tsr) return;
    if (!tsr.achievements) tsr.achievements = {};
    const unlock = (id) => {
        if (tsr.achievements[id]) return;
        tsr.achievements[id] = Date.now();
        const a = TSR_LEGENDS_ACHIEVEMENTS.find(x => x.id === id);
        if (a) addTsrLog?.(`🏅 成就解锁：${a.name} — ${a.desc}`, 'success');
    };
    const ls = tsr.lifetimeStats || {};
    if ((ls.bountiesClaimed || 0) >= 3) unlock('bountyClear3');
    if ((tsr.sigils?.equipped || []).filter(Boolean).length >= 3) unlock('sigilEquip3');
    if ((tsr.trialBest || 0) >= 5) unlock('trialFloor5');
    if ((tsr.fractureStreak?.best || 0) >= 5) unlock('streak5');
    if ((ls.exchanges || 0) >= 10) unlock('exchange10');
    if ((ls.fateDiceRolls || 0) >= 5) unlock('fateDice5');
    if ((ls.shadowAssists || 0) >= 3) unlock('shadowAssist3');
    if ((ls.legendRooms || 0) >= 8) unlock('legendRooms8');
}

/* ===== UI ===== */
function injectTsrLegendsLobbyUI() {
    const lobby = document.getElementById('tsrLobbyPanel');
    if (!lobby) return;
    const tabRow = lobby.querySelector('.tsr-tab-nav');
    if (tabRow && !document.getElementById('tsrTabBtnLegends')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tsr-tab-btn';
        btn.id = 'tsrTabBtnLegends';
        btn.dataset.tsrTab = 'legends';
        btn.textContent = '🚩 传说';
        btn.onclick = () => switchTsrLobbyTab('legends');
        tabRow.appendChild(btn);
    }
    if (!document.getElementById('tsrTabLegends')) {
        const panel = document.createElement('div');
        panel.id = 'tsrTabLegends';
        panel.className = 'tsr-tab-panel';
        panel.innerHTML = `
            <div class="tsr-legends-layout">
                <section><div class="tsr-block-title">📜 通缉追猎</div><div id="tsrBountyPanel"></div></section>
                <section><div class="tsr-block-title">🔮 时纹印记</div><div id="tsrSigilPanel"></div></section>
                <section><div class="tsr-block-title">🗼 试炼塔</div><div id="tsrTrialPanel"></div></section>
                <section><div class="tsr-block-title">🔗 裂隙连胜</div><div id="tsrStreakPanel"></div></section>
                <section><div class="tsr-block-title">💱 时砂交易所</div><div id="tsrExchangePanel"></div></section>
                <section><div class="tsr-block-title">🎲 命运骰</div><div id="tsrFateDicePanel"></div></section>
            </div>`;
        lobby.appendChild(panel);
    }
    const adv = document.getElementById('tsrTabAdventure');
    const modeBox = adv?.querySelector('.tsr-mode-box');
    if (modeBox && !document.getElementById('tsrTrialTowerBtn')) {
        const b = document.createElement('button');
        b.type = 'button';
        b.id = 'tsrTrialTowerBtn';
        b.className = 'tsr-btn tsr-btn-purple';
        b.textContent = '🗼 时隙试炼（耗1钥）';
        b.onclick = () => startTsrTrialTower();
        modeBox.appendChild(b);
    }
}

function initTsrLegendsExtensions() {
    ensureTsrLegendsData();
    refreshTsrDailyBounties();
    ensureTsrFateDice();

    if (typeof TSR_RELIC_POOL !== 'undefined') {
        TSR_LEGENDS_RELICS.forEach(({ key, relic }) => { TSR_RELIC_POOL[key] = relic; });
    }
    if (typeof TSR_BATTLE_TACTICS !== 'undefined') Object.assign(TSR_BATTLE_TACTICS, TSR_LEGENDS_TACTICS);
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') TSR_ACHIEVEMENTS.push(...TSR_LEGENDS_ACHIEVEMENTS);
    if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined') TSR_SPECIAL_ROOM_TYPES.push(...TSR_LEGENDS_SPECIAL_ROOMS);
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_LEGENDS_MONSTERS.battle);
        TSR_MONSTER_POOL.elite.push(...TSR_LEGENDS_MONSTERS.elite);
        TSR_MONSTER_POOL.boss.push(...TSR_LEGENDS_MONSTERS.boss);
    }
    if (typeof TSR_CODEX_ROOMS !== 'undefined') {
        TSR_LEGENDS_SPECIAL_ROOMS.forEach(key => {
            const meta = TSR_LEGENDS_ROOM_META[key];
            if (meta && !TSR_CODEX_ROOMS.find(r => r.key === key)) {
                TSR_CODEX_ROOMS.push({ key, name: meta.name, icon: meta.icon });
            }
        });
    }
    if (typeof TSR_CONTENT_ROOM_META !== 'undefined') Object.assign(TSR_CONTENT_ROOM_META, TSR_LEGENDS_ROOM_META);

    if (typeof getTsrEternalAttackBonus === 'function' && !getTsrEternalAttackBonus.__tsrLegPatched) {
        const _orig = getTsrEternalAttackBonus;
        getTsrEternalAttackBonus = function () {
            const cap = (typeof TSR_ETERNAL_BONUS_MAX === 'number' ? TSR_ETERNAL_BONUS_MAX : 0.35) + 0.06;
            return Math.min(cap, (_orig() || 0) + getTsrSigilBonus('eternalAttackBonus'));
        };
        getTsrEternalAttackBonus.__tsrLegPatched = true;
    }
    if (typeof getTsrEternalHealthBonus === 'function' && !getTsrEternalHealthBonus.__tsrLegPatched) {
        const _orig = getTsrEternalHealthBonus;
        getTsrEternalHealthBonus = function () {
            const cap = (typeof TSR_ETERNAL_BONUS_MAX === 'number' ? TSR_ETERNAL_BONUS_MAX : 0.35) + 0.06;
            return Math.min(cap, (_orig() || 0) + getTsrSigilBonus('eternalHealthBonus'));
        };
        getTsrEternalHealthBonus.__tsrLegPatched = true;
    }
    if (typeof getTsrPermanentFloorTimeBonus === 'function' && !getTsrPermanentFloorTimeBonus.__tsrLegPatched) {
        const _orig = getTsrPermanentFloorTimeBonus;
        getTsrPermanentFloorTimeBonus = function () {
            return Math.min(24, (_orig() || 0) + getTsrSigilBonus('floorTimeBonus'));
        };
        getTsrPermanentFloorTimeBonus.__tsrLegPatched = true;
    }

    if (typeof getTsrRoomTypeMeta === 'function' && !getTsrRoomTypeMeta.__tsrLegPatched) {
        const _orig = getTsrRoomTypeMeta;
        getTsrRoomTypeMeta = function (type) {
            const m = _orig(type);
            const extra = TSR_LEGENDS_ROOM_META[type];
            if (extra && (m.name === type || m.icon === '📍')) return { ...m, ...extra };
            return m;
        };
        getTsrRoomTypeMeta.__tsrLegPatched = true;
    }

    if (typeof handleTsrSpecialRoom === 'function' && !handleTsrSpecialRoom.__tsrLegPatched) {
        const _orig = handleTsrSpecialRoom;
        handleTsrSpecialRoom = function (type) {
            const map = {
                bountyboard: handleBountyboardRoom,
                sigilforge: handleSigilforgeRoom,
                trialgate: handleTrialgateRoom,
                exchangepost: handleExchangepostRoom,
                fatedicehall: handleFatedicehallRoom,
                streakshrine: handleStreakshrineRoom,
                shadowaltar: handleShadowaltarRoom,
                omencrypt: handleOmencryptRoom,
                legendvault: handleLegendvaultRoom,
                chronoarena: handleChronoarenaRoom
            };
            if (map[type]) return map[type]();
            return _orig(type);
        };
        handleTsrSpecialRoom.__tsrLegPatched = true;
    }

    if (typeof onTsrMonsterBattleVictory === 'function' && !onTsrMonsterBattleVictory.__tsrLegPatched) {
        const _prev = onTsrMonsterBattleVictory;
        onTsrMonsterBattleVictory = function (monster) {
            _prev(monster);
            const room = player.timeSecretRealm?.currentRun?.currentRoom;
            progressTsrBounty(monster, room);
        };
        onTsrMonsterBattleVictory.__tsrLegPatched = true;
    }

    if (typeof applyTsrMonsterAffixToStats === 'function' && !applyTsrMonsterAffixToStats.__tsrLegPatched) {
        const _orig = applyTsrMonsterAffixToStats;
        applyTsrMonsterAffixToStats = function (stats, monster) {
            let out = _orig(stats, monster);
            const flat = player.timeSecretRealm?.currentRun?.monsterFlatMult || monster?._trialFlat;
            if (flat && flat !== 1) {
                out = {
                    ...out,
                    hp: Math.max(1, Math.floor(out.hp * flat)),
                    atk: Math.max(1, Math.floor(out.atk * flat))
                };
            }
            return out;
        };
        applyTsrMonsterAffixToStats.__tsrLegPatched = true;
    }

    if (typeof startTimeSecretRealm === 'function' && !startTimeSecretRealm.__tsrLegPatched) {
        const _orig = startTimeSecretRealm;
        startTimeSecretRealm = function () {
            _orig();
            const run = player?.timeSecretRealm?.currentRun;
            if (!run?.isActive) return;
            if (player.timeSecretRealm.pendingTrialTower) initTsrTrialTowerRun();
            else applyTsrSigilRunStart();
            const coin = getTsrSigilBonus('runCurrencyBonus');
            if (coin && run.contractMods) {
                run.contractMods.currencyMod = (run.contractMods.currencyMod || 0) + coin;
            } else if (coin) {
                run.contractMods = { currencyMod: coin };
            }
        };
        startTimeSecretRealm.__tsrLegPatched = true;
    }

    if (typeof endTimeSecretRealm === 'function' && !endTimeSecretRealm.__tsrLegPatched) {
        const _orig = endTimeSecretRealm;
        endTimeSecretRealm = function (reason) {
            const flags = typeof resolveTsrEndClearFlags === 'function'
                ? resolveTsrEndClearFlags(reason)
                : { fractureStreak: false };
            updateTsrFractureStreak(!!flags.fractureStreak);
            _orig(reason);
            checkTsrLegendsAchievements();
        };
        endTimeSecretRealm.__tsrLegPatched = true;
    }

    if (typeof checkTsrAchievements === 'function' && !checkTsrAchievements.__tsrLegPatched) {
        const _orig = checkTsrAchievements;
        checkTsrAchievements = function (ctx) {
            _orig(ctx);
            checkTsrLegendsAchievements();
        };
        checkTsrAchievements.__tsrLegPatched = true;
    }

    if (typeof getDefaultTsrShopItems === 'function' && !getDefaultTsrShopItems.__tsrLegPatched) {
        const _orig = getDefaultTsrShopItems;
        getDefaultTsrShopItems = function () {
            return {
                ..._orig(),
                bountyPermit: {
                    name: '通缉特许证', description: '永久通缉赏金+5%（限购5）',
                    cost: 160000, type: 'permanent', effect: 'tsr_bounty_amp', maxPurchase: 5, purchased: 0,
                    category: 'enhance', icon: '📜'
                },
                sigilSlotHint: {
                    name: '时纹拓本', description: '立刻获得25精炼尘（限购2）',
                    cost: 50000, type: 'permanent', effect: 'tsr_sigil_pack', maxPurchase: 2, purchased: 0,
                    category: 'enhance', icon: '🔮'
                }
            };
        };
        getDefaultTsrShopItems.__tsrLegPatched = true;
    }

    if (typeof buyTsrShopItem === 'function' && !buyTsrShopItem.__tsrLegPatched) {
        const _orig = buyTsrShopItem;
        buyTsrShopItem = function (itemKey) {
            const tsr = player?.timeSecretRealm;
            const item = tsr?.shopItems?.[itemKey];
            if (item && (item.effect === 'tsr_bounty_amp' || item.effect === 'tsr_sigil_pack')) {
                ensureTimeSecretRealmData?.();
                const block = getTsrShopItemBlockReason?.(item);
                if (block) { logAction(block, 'error'); return; }
                if ((tsr.currency || 0) < item.cost) { logAction('秘境币不足', 'error'); return; }
                tsr.currency = clampTsrCurrency(tsr.currency - item.cost);
                if (item.maxPurchase) item.purchased = (item.purchased || 0) + 1;
                if (item.effect === 'tsr_sigil_pack') {
                    addTsrRefineDust?.(25, '时纹拓本');
                    logAction('购买时纹拓本：精炼尘+25', 'success');
                } else {
                    tsr.permanentBonuses = tsr.permanentBonuses || {};
                    tsr.permanentBonuses.bountyAmp = (tsr.permanentBonuses.bountyAmp || 0) + 0.05;
                    logAction('通缉特许证生效！赏金+5%', 'success');
                }
                updateTimeSecretRealmUI?.();
                return;
            }
            return _orig(itemKey);
        };
        buyTsrShopItem.__tsrLegPatched = true;
    }

    if (typeof updateTsrLobbyDashboard === 'function' && !updateTsrLobbyDashboard.__tsrLegPatched) {
        const _orig = updateTsrLobbyDashboard;
        updateTsrLobbyDashboard = function () {
            _orig();
            const side = document.getElementById('tsrDashboardContent');
            if (!side) return;
            ensureTsrLegendsData();
            const tsr = player.timeSecretRealm;
            const done = (tsr.bounties.list || []).filter(b => b.done && !b.claimed).length;
            const card = document.createElement('div');
            card.className = 'tsr-dash-card';
            card.innerHTML = `<div class="tsr-block-title">🚩 传说</div>
                <p>通缉待领 ${done} · 连胜×${tsr.fractureStreak.current || 0}</p>
                <p>时纹 ${(tsr.sigils.equipped || []).filter(Boolean).length}/3 · 塔最佳 ${tsr.trialBest || 0}</p>`;
            side.appendChild(card);
        };
        updateTsrLobbyDashboard.__tsrLegPatched = true;
    }

    setTimeout(() => {
        injectTsrLegendsLobbyUI();
        refreshTsrLegendsPanels();
    }, 60);
}

initTsrLegendsExtensions();

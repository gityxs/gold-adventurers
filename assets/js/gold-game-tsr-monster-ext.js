/**
 * 时光秘境 · 怪物/Boss 扩展（称号前缀 / 战斗特性 / 额外词条）
 */
const TSR_MONSTER_TITLE_PREFIXES = {
    battle: [
        '游荡的', '潜伏的', '暴躁的', '狡诈的', '腐化的', '觉醒的', '迷途的', '饥渴的', '癫狂的', '沉默的',
        '锈蚀的', '凋零的', '复燃的', '扭曲的', '异化的', '梦魇的', '幽影', '裂隙', '时蚀', '虚空',
        '霜冻的', '灼焰的', '雷鸣的', '剧毒的', '圣化的', '诅咒的', '混沌的', '星碎的', '月蚀的', '日灼的'
    ],
    elite: [
        '精锐', '统领', '督军', '猎杀', '镇守', '巡礼', '裁决', '征伐', '禁卫', '先锋',
        '深渊', '星陨', '灵域', '时序', '终焉', '虚空', '暴君', '帝皇', '天罚', '灭世',
        '霜冠', '炎狱', '雷狱', '毒沼', '圣裁', '咒缚', '混沌', '奇点', 'Ω序', '溢彩'
    ],
    boss: [
        '万古', '究极', '灭世', '天罚', '终焉', '起源', '虚空', '奇点', 'Ω序', '神裁',
        '不朽', '湮灭', '轮回', '归墟', '星穹', '帝皇', '暴君', '主宰', '灾变', '末日',
        '时序', '灵渊', '深渊', '圣陨', '魔神', '天启', '禁忌', '传说', '神话', '超越',
        '炫彩', '悖论', '混沌', '永劫', '裂空', '镇魂', '噬灵', '断缘', '覆海', '焚天',
        '剑魔', '丹圣', '雷劫', '心魔', '阵帝', '妖皇', '道尊', '灵渊', '混元', '天劫'
    ]
};

const TSR_MONSTER_COMBAT_TRAIT_META = {
    critRate:    { label: '暴击', icon: '💥', short: '暴' },
    critDamage:  { label: '暴伤', icon: '🔥', short: '暴伤' },
    armor:       { label: '护甲', icon: '🛡️', short: '甲' },
    lifeSteal:   { label: '吸血', icon: '🩸', short: '吸' },
    dodge:       { label: '闪避', icon: '💨', short: '闪' },
    pen:         { label: '穿透', icon: '🗡️', short: '穿' },
    regen:       { label: '再生', icon: '♻️', short: '再生' },
    thorns:      { label: '荆棘', icon: '🌵', short: '棘' },
    firePower:   { label: '烈焰', icon: '🔥', short: '火' },
    icePower:    { label: '冰霜', icon: '❄️', short: '冰' },
    lightning:   { label: '雷霆', icon: '⚡', short: '雷' },
    poison:      { label: '剧毒', icon: '☠️', short: '毒' },
    holy:        { label: '圣光', icon: '☀️', short: '圣' },
    shadow:      { label: '暗影', icon: '🌑', short: '影' },
    voidTouch:   { label: '虚空', icon: '🕳️', short: '虚空' },
    execution:   { label: '斩杀', icon: '💀', short: '斩' }
};

const TSR_MONSTER_AFFIX_EXTRA = {
    stoneHide: { id: 'stoneHide', name: '岩甲', icon: '🪨', desc: '生命+28%，攻击-8%', hpMult: 0.28, atkMult: -0.08, weight: 7 },
    glassFang: { id: 'glassFang', name: '玻牙', icon: '🥀', desc: '生命-18%，攻击+28%，赏金+25%', hpMult: -0.18, atkMult: 0.28, rewardMult: 0.25, weight: 5 },
    vampiricLord: { id: 'vampiricLord', name: '血爵', icon: '🦇', desc: '每3回合自回6%，反击+10%', regenPct: 0.06, regenEvery: 3, counterMult: 0.1, weight: 6 },
    critFang: { id: 'critFang', name: '裂牙', icon: '💥', desc: '反击可暴击，暴击反击+35%', counterCrit: 0.35, weight: 6 },
    armorPlate: { id: 'armorPlate', name: '板甲', icon: '🛡️', desc: '生命+20%，玩家穿透-8%', hpMult: 0.2, playerPenReduce: 0.08, weight: 7 },
    poisonMist: { id: 'poisonMist', name: '毒雾', icon: '☠️', desc: '每3回合毒蚀4%生命', poisonEvery: 3, poisonPct: 0.04, weight: 7 },
    blazingCore: { id: 'blazingCore', name: '炎核', icon: '🔥', desc: '攻击+14%，每4回合灼烧5%', atkMult: 0.14, burnEvery: 4, burnPct: 0.05, weight: 6 },
    frozenHeart: { id: 'frozenHeart', name: '冰心', icon: '❄️', desc: '每3回合霜冻-3秒，反击+10%', frostEvery: 3, frostDrain: 3, counterMult: 0.1, weight: 6 },
    thunderCoil: { id: 'thunderCoil', name: '雷缠', icon: '⚡', desc: '每4回合雷击6%生命', shockEvery: 4, shockPct: 0.06, weight: 6 },
    holySeal: { id: 'holySeal', name: '圣印', icon: '☀️', desc: '生命+12%，精灵充能获取-15%', hpMult: 0.12, spiritGainReduce: 0.15, weight: 5 },
    shadowVeil: { id: 'shadowVeil', name: '影纱', icon: '🌑', desc: '每4回合暗影侵蚀5%', shadowEvery: 4, shadowPct: 0.05, weight: 5 },
    necrotic: { id: 'necrotic', name: '腐亡', icon: '💀', desc: '每4回合减治疗8%×3', healBlockEvery: 4, healBlockValue: 0.08, healBlockDuration: 3, weight: 5 },
    dualStrike: { id: 'dualStrike', name: '双刃', icon: '⚔️', desc: '每3回合追加一次反击', dualCounterEvery: 3, weight: 6 },
    executioner: { id: 'executioner', name: '行刑', icon: '🔪', desc: '玩家生命≤35%时反击+28%', playerLowHpThreshold: 0.35, playerLowHpCounter: 0.28, weight: 5 },
    spectral: { id: 'spectral', name: '幽魂', icon: '👻', desc: '每5回合闪避下回合攻击', phaseWalkEvery: 5, weight: 5 },
    bountyKing: { id: 'bountyKing', name: '赏金王', icon: '👑', desc: '击败赏金+55%', rewardMult: 0.55, bossOnly: true, weight: 4 },
    mythicAura: { id: 'mythicAura', name: '神话光环', icon: '🌸', desc: '全属性+10%，反击+8%', hpMult: 0.1, atkMult: 0.1, counterMult: 0.08, minTier: 'legendary', weight: 4 },
    chronosDevour: { id: 'chronosDevour', name: '时噬', icon: '⏳', desc: '每2回合窃取4秒', timeDrain: 4, timeDrainEvery: 2, weight: 6, bossOnly: true },
    spiritSiphon: { id: 'spiritSiphon', name: '灵吸', icon: '🧿', desc: '每2回合噬灵14%', spiritDrainPct: 0.14, spiritDrainEvery: 2, weight: 6 },
    coinCurse: { id: 'coinCurse', name: '币咒', icon: '🧲', desc: '每3回合吸走25秘境币', coinStealEvery: 3, coinSteal: 25, weight: 5 },
    healBlock: { id: 'healBlock', name: '愈封', icon: '🚫', desc: '每5回合禁疗12%×2', healBlockEvery: 5, healBlockValue: 0.12, healBlockDuration: 2, weight: 5 },
    armorBreak: { id: 'armorBreak', name: '碎甲', icon: '🔨', desc: '反击+15%，无视玩家8%护甲', counterMult: 0.15, ignorePlayerArmor: 0.08, weight: 5 },
    ragestorm: { id: 'ragestorm', name: '怒潮', icon: '🌊', desc: '攻击+16%，低血反击+25%', atkMult: 0.16, lowHpThreshold: 0.4, lowHpCounterMult: 0.25, weight: 5 },
    omegaMark: { id: 'omegaMark', name: 'Ω序刻印', icon: '⚙️', desc: 'Ω序专属：三维+12%', hpMult: 0.12, atkMult: 0.12, counterMult: 0.12, minDiffTier: 10, weight: 3 },
    singularityEcho: { id: 'singularityEcho', name: '奇点回响', icon: '💠', desc: '奇点专属：每4回合虚空8%', voidEvery: 4, voidDmgPct: 0.08, hpMult: 0.1, minDiffTier: 11, weight: 3 },
    emperorWrath: { id: 'emperorWrath', name: '帝怒', icon: '🌌', desc: '神话首领：攻击+18%，赏金+30%', atkMult: 0.18, rewardMult: 0.3, minTier: 'mythic', bossOnly: true, weight: 3 },
    tyrantRoar: { id: 'tyrantRoar', name: '暴君咆哮', icon: '🔱', desc: '首领专属：开战反击+25%×2回合', firstCounterBonus: 0.25, firstCounterRounds: 2, bossOnly: true, weight: 4 },
    starfall: { id: 'starfall', name: '星坠', icon: '☄️', desc: '每4回合星陨5%生命', starfallEvery: 4, starfallPct: 0.05, weight: 5 },
    doomTimer: { id: 'doomTimer', name: '末日钟', icon: '⏰', desc: '每层额外-1秒，赏金+20%', rewardMult: 0.2, floorTimeDrain: 1, weight: 4, bossOnly: true },
    prismaticCurse: { id: 'prismaticCurse', name: '溢彩诅咒', icon: '🌈', desc: '暴击时反刺8%生命', thornPct: 0.08, counterMult: 0.08, minTier: 'epic', weight: 4 },
    voidEmbrace: { id: 'voidEmbrace', name: '虚空拥抱', icon: '🕳️', desc: '生命+15%，每5回合虚空7%', hpMult: 0.15, voidEvery: 5, voidDmgPct: 0.07, weight: 5 },
    ironFist: { id: 'ironFist', name: '铁拳', icon: '👊', desc: '攻击+20%，反击+8%', atkMult: 0.2, counterMult: 0.08, weight: 6 },
    soulBurn: { id: 'soulBurn', name: '焚魂', icon: '🔥', desc: '每3回合亲密度-3', bondLoss: 3, bondEvery: 3, weight: 5 },
    timeLock: { id: 'timeLock', name: '时锁', icon: '🔒', desc: '每4回合冻结探索-5秒', timeFreezeEvery: 4, timeFreeze: 5, weight: 4 },
    chaosRoll: { id: 'chaosRoll', name: '混沌骰', icon: '🎲', desc: '每3回合随机增益或诅咒', chaosEvery: 3, weight: 4 },
    affixMagnet: { id: 'affixMagnet', name: '词条磁石', icon: '🧲', desc: '赏金+22%，生命+8%', rewardMult: 0.22, hpMult: 0.08, eliteOnly: true, weight: 5 },
    relentless: { id: 'relentless', name: '不息', icon: '♾️', desc: '每2回合回复3%生命', regenPct: 0.03, regenEvery: 2, weight: 6 },
    paralytic: { id: 'paralytic', name: '麻痹', icon: '⚡', desc: '每4回合攻击-10%×2', curseValue: 0.1, curseEvery: 4, curseDuration: 2, weight: 5 },
    dominion: { id: 'dominion', name: '统御', icon: '👑', desc: '生命+16%，攻击+12%，反击+10%', hpMult: 0.16, atkMult: 0.12, counterMult: 0.1, minTier: 'epic', bossOnly: true, weight: 3 },
    cataclysm: { id: 'cataclysm', name: '灾变', icon: '🌋', desc: '每5回合全屏8%伤害', cataclysmEvery: 5, cataclysmPct: 0.08, weight: 4, bossOnly: true },
    mirrorImage: { id: 'mirrorImage', name: '镜像', icon: '🪞', desc: '生命+10%，每4回合反射4%', reflectEvery: 4, reflectPct: 0.04, weight: 4 },
    entropy: { id: 'entropy', name: '熵增', icon: '🌀', desc: '每回合反击+1%（最多+20%）', momentumCounterPerRound: 0.01, momentumCounterCap: 0.2, weight: 5 },
    latencySpike: { id: 'latencySpike', name: '延迟尖峰', icon: '📶', desc: '每3回合窃取2秒，反击+8%', timeDrain: 2, timeDrainEvery: 3, counterMult: 0.08, weight: 6 },
    memoryLeak: { id: 'memoryLeak', name: '内存泄漏', icon: '💾', desc: '每4回合造成5%生命伤害', overloadEvery: 4, overloadDmg: 0.05, hpMult: 0.08, weight: 6 },
    rateLimit: { id: 'rateLimit', name: '限流', icon: '🛑', desc: '攻击-8%，生命+20%', hpMult: 0.2, atkMult: -0.08, weight: 6 },
    hotfixRush: { id: 'hotfixRush', name: '热修', icon: '🚑', desc: '首回合反击+30%', firstCounterBonus: 0.3, weight: 5 },
    rollback: { id: 'rollback', name: '回滚', icon: '⏪', desc: '每3回合自回5%生命', regenPct: 0.05, regenEvery: 3, weight: 6 },
    canaryTest: { id: 'canaryTest', name: '金丝雀', icon: '🐤', desc: '生命-12%，攻击+22%，赏金+20%', hpMult: -0.12, atkMult: 0.22, rewardMult: 0.2, weight: 4 },
    blueGreen: { id: 'blueGreen', name: '蓝绿', icon: '🔵', desc: '每4回合展开8%护盾', shieldPulse: 0.08, shieldEvery: 4, weight: 5 },
    shardSplit: { id: 'shardSplit', name: '分片', icon: '🔀', desc: '生命+14%，攻击+10%', hpMult: 0.14, atkMult: 0.1, eliteOnly: true, weight: 5 },
    metricAlert: { id: 'metricAlert', name: '告警', icon: '📊', desc: '每4回合窃取3秒', timeDrain: 3, timeDrainEvery: 4, rewardMult: 0.15, weight: 5 },
    chaosInject: { id: 'chaosInject', name: '混沌注入', icon: '🐒', desc: '每3回合随机增益或诅咒', chaosEvery: 3, weight: 4 },
    complianceLock: { id: 'complianceLock', name: '合规锁', icon: '📜', desc: '生命+16%，精灵充能获取-12%', hpMult: 0.16, spiritGainReduce: 0.12, weight: 5 },
    legacyDebt: { id: 'legacyDebt', name: '技术债', icon: '🐲', desc: '攻击+18%，每层额外-1秒', atkMult: 0.18, floorTimeDrain: 1, weight: 4, bossOnly: true },
    outageCascade: { id: 'outageCascade', name: '级联宕机', icon: '💥', desc: '每5回合全屏7%伤害', cataclysmEvery: 5, cataclysmPct: 0.07, weight: 4, bossOnly: true },
    srePage: { id: 'srePage', name: 'SRE呼叫', icon: '📟', desc: '每3回合吸走20秘境币', coinStealEvery: 3, coinSteal: 20, counterMult: 0.1, weight: 5 },
    jianQi: { id: 'jianQi', name: '剑气', icon: '⚔️', desc: '攻击+16%，暴击反击+20%', atkMult: 0.16, counterCrit: 0.2, weight: 5 },
    danPoison: { id: 'danPoison', name: '丹毒', icon: '💊', desc: '每3回合毒蚀5%生命', poisonEvery: 3, poisonPct: 0.05, weight: 6 },
    leiPunish: { id: 'leiPunish', name: '雷罚', icon: '⚡', desc: '每3回合雷击7%生命，窃取3秒', shockEvery: 3, shockPct: 0.07, timeDrain: 3, timeDrainEvery: 3, weight: 5 },
    zhenTrap: { id: 'zhenTrap', name: '困阵', icon: '🔯', desc: '每4回合冻结探索-6秒', timeFreezeEvery: 4, timeFreeze: 6, counterMult: 0.1, weight: 5 },
    xinmoCurse: { id: 'xinmoCurse', name: '心魔', icon: '😈', desc: '每4回合攻击-12%×2', curseValue: 0.12, curseEvery: 4, curseDuration: 2, weight: 5 },
    yaoFang: { id: 'yaoFang', name: '妖锋', icon: '👹', desc: '攻击+18%，穿透玩家8%护甲', atkMult: 0.18, ignorePlayerArmor: 0.08, weight: 5 },
    daoShield: { id: 'daoShield', name: '道盾', icon: '☯️', desc: '生命+18%，每4回合展开10%护盾', hpMult: 0.18, shieldPulse: 0.1, shieldEvery: 4, weight: 5 },
    gachaPity: { id: 'gachaPity', name: '保底', icon: '🎰', desc: '生命-10%，攻击+24%，赏金+22%', hpMult: -0.1, atkMult: 0.24, rewardMult: 0.22, weight: 4 },
    vipAura: { id: 'vipAura', name: 'VIP光环', icon: '👑', desc: '生命+14%，每3回合吸走18秘境币', hpMult: 0.14, coinStealEvery: 3, coinSteal: 18, weight: 4 },
    whaleSplash: { id: 'whaleSplash', name: '鲸落', icon: '🐋', desc: '击败赏金+45%', rewardMult: 0.45, eliteOnly: true, weight: 4 },
    seasonRush: { id: 'seasonRush', name: '赛季冲', icon: '🎫', desc: '攻击+14%，每层额外-1秒', atkMult: 0.14, floorTimeDrain: 1, weight: 4 },
    chainLink: { id: 'chainLink', name: '链缚', icon: '⛓️', desc: '每3回合窃取2秒，事件房感知+', timeDrain: 2, timeDrainEvery: 3, rewardMult: 0.12, weight: 5 },
    minggeCurse: { id: 'minggeCurse', name: '命格咒', icon: '🔮', desc: '攻击+14%，反击+10%', atkMult: 0.14, counterMult: 0.1, weight: 4 },
    eliteBounty: { id: 'eliteBounty', name: '精英赏', icon: '🧲', desc: '赏金+22%，生命+10%', rewardMult: 0.22, hpMult: 0.1, eliteOnly: true, weight: 4 }
};

const TSR_MONSTER_AFFIX_INCOMPAT_EXTRA = [
    ['stoneHide', 'glassFang'], ['stoneHide', 'fragile'], ['armorPlate', 'glassFang'],
    ['relentless', 'glassFang'], ['dominion', 'fragile']
];

function initTsrMonsterExtensions() {
    if (typeof TSR_MONSTER_AFFIXES !== 'undefined') {
        Object.assign(TSR_MONSTER_AFFIXES, TSR_MONSTER_AFFIX_EXTRA);
    }
    if (typeof TSR_MONSTER_AFFIX_INCOMPAT !== 'undefined') {
        TSR_MONSTER_AFFIX_INCOMPAT.push(...TSR_MONSTER_AFFIX_INCOMPAT_EXTRA);
    }
}

function applyTsrMonsterTitlePrefix(monster, isBoss, isElite) {
    if (!monster) return;
    const pool = isBoss ? TSR_MONSTER_TITLE_PREFIXES.boss
        : (isElite ? TSR_MONSTER_TITLE_PREFIXES.elite : TSR_MONSTER_TITLE_PREFIXES.battle);
    const chance = isBoss ? 0.94 : (isElite ? 0.78 : 0.38);
    const tierRank = typeof getTsrMonsterTierRank === 'function' ? getTsrMonsterTierRank(monster.tier) : 0;
    if (tierRank >= 4 || Math.random() < chance) {
        monster.titlePrefix = pool[Math.floor(Math.random() * pool.length)];
        monster.displayName = monster.titlePrefix + (monster.name || '');
    } else {
        monster.displayName = monster.name || '';
    }
}

function rollTsrMonsterCombatTraits(monster, isBoss, isElite, floor) {
    if (!monster) return;
    if (monster.combatTraits && Object.keys(monster.combatTraits).length) return;
    const tierRank = typeof getTsrMonsterTierRank === 'function' ? getTsrMonsterTierRank(monster.tier) : 0;
    const floorScale = 1 + (Math.max(1, floor) - 1) * 0.006;
    const bossMult = isBoss ? 1.35 : (isElite ? 1.15 : 1);
    const traits = {};
    const rollTrait = (chance, key, lo, hi) => {
        if (Math.random() >= chance) return;
        const v = (lo + Math.random() * (hi - lo)) * floorScale * bossMult;
        traits[key] = Math.round(v * 1000) / 1000;
    };
    rollTrait(0.12 + tierRank * 0.04, 'critRate', 0.02, 0.1);
    rollTrait(0.1 + tierRank * 0.03, 'critDamage', 0.08, 0.25);
    rollTrait(0.14 + tierRank * 0.04, 'armor', 0.04, 0.18);
    rollTrait(0.08 + tierRank * 0.025, 'lifeSteal', 0.02, 0.08);
    rollTrait(0.07 + tierRank * 0.02, 'dodge', 0.02, 0.08);
    rollTrait(0.1 + tierRank * 0.03, 'pen', 0.03, 0.12);
    rollTrait(0.09 + tierRank * 0.025, 'regen', 0.01, 0.04);
    rollTrait(0.07 + tierRank * 0.02, 'thorns', 0.02, 0.07);
    rollTrait(0.08 + tierRank * 0.025, 'firePower', 0.03, 0.1);
    rollTrait(0.08 + tierRank * 0.025, 'icePower', 0.03, 0.1);
    rollTrait(0.07 + tierRank * 0.02, 'lightning', 0.03, 0.09);
    rollTrait(0.08 + tierRank * 0.025, 'poison', 0.02, 0.08);
    rollTrait(0.06 + tierRank * 0.02, 'holy', 0.03, 0.09);
    rollTrait(0.06 + tierRank * 0.02, 'shadow', 0.03, 0.09);
    rollTrait(0.05 + tierRank * 0.018, 'voidTouch', 0.02, 0.07);
    if (isBoss) rollTrait(0.25, 'execution', 0.05, 0.15);
    monster.combatTraits = traits;
}

function formatTsrMonsterTraitsHtml(monster) {
    const traits = monster?.combatTraits;
    if (!traits || !Object.keys(traits).length) return '';
    const parts = Object.entries(traits).filter(([, v]) => v > 0).slice(0, 6).map(([k, v]) => {
        const meta = TSR_MONSTER_COMBAT_TRAIT_META[k] || { icon: '◆', short: k };
        return `<span class="tsr-mon-trait-chip" title="${meta.label}">${meta.icon}${meta.short}${(v * 100).toFixed(0)}%</span>`;
    });
    return parts.length ? `<span class="tsr-monster-traits">${parts.join('')}</span>` : '';
}

function formatTsrMonsterTraitsPlain(monster) {
    const traits = monster?.combatTraits;
    if (!traits) return '';
    return Object.entries(traits).filter(([, v]) => v > 0).slice(0, 4).map(([k, v]) => {
        const meta = TSR_MONSTER_COMBAT_TRAIT_META[k] || { short: k };
        return meta.short + (v * 100).toFixed(0) + '%';
    }).join('·');
}

function applyTsrMonsterTraitsToStats(stats, monster) {
    if (!stats || !monster?.combatTraits) return stats;
    const t = monster.combatTraits;
    let hpMult = 1 + (t.armor || 0) * 0.5 + (t.regen || 0) * 2;
    let atkMult = 1 + (t.pen || 0) * 0.6 + (t.firePower || 0) * 0.3 + (t.icePower || 0) * 0.3
        + (t.lightning || 0) * 0.35 + (t.poison || 0) * 0.25 + (t.holy || 0) * 0.25 + (t.shadow || 0) * 0.25;
    return {
        ...stats,
        hp: Math.max(1, Math.floor(stats.hp * hpMult)),
        atk: Math.max(1, Math.floor(stats.atk * atkMult))
    };
}

function getTsrMonsterTraitCounterBonus(monster, rounds, monsterHp, monsterMaxHp, playerHpPct) {
    const t = monster?.combatTraits || {};
    let bonus = (t.thorns || 0) * 0.5 + (t.firePower || 0) * 0.2 + (t.lightning || 0) * 0.25;
    if (t.execution && playerHpPct <= 0.35) bonus += t.execution;
    if (t.critDamage && rounds === 1) bonus += (t.critRate || 0) * 0.5;
    return bonus;
}

function getTsrMonsterTraitCounterCrit(monster) {
    const t = monster?.combatTraits || {};
    const affixCrit = getTsrMonsterAffixList?.(monster)?.reduce((s, ax) => s + (ax.counterCrit || 0), 0) || 0;
    return Math.min(0.45, (t.critRate || 0) + affixCrit);
}

function applyTsrMonsterTraitRound(monster, rounds, monsterHp, monsterMaxHp) {
    const tsr = player?.timeSecretRealm;
    if (!tsr?.currentRun || !monster) return monsterHp;
    let hp = monsterHp;
    const t = monster.combatTraits || {};
    const affixes = typeof getTsrMonsterAffixList === 'function' ? getTsrMonsterAffixList(monster) : [];
    affixes.forEach(ax => {
        if (ax.poisonEvery && rounds % ax.poisonEvery === 0) {
            applyDamage?.(bMul(tsr.currentRun.playerHealth, ax.poisonPct || 0.04));
            addTsrLog?.(`【${ax.icon}${ax.name}】毒蚀${Math.floor((ax.poisonPct || 0.04) * 100)}%生命`, 'error');
        }
        if (ax.burnEvery && rounds % ax.burnEvery === 0) {
            applyDamage?.(bMul(tsr.currentRun.playerHealth, ax.burnPct || 0.05));
            addTsrLog?.(`【${ax.icon}${ax.name}】灼烧${Math.floor((ax.burnPct || 0.05) * 100)}%生命`, 'error');
        }
        if (ax.shockEvery && rounds % ax.shockEvery === 0) {
            applyDamage?.(bMul(tsr.currentRun.playerHealth, ax.shockPct || 0.06));
            addTsrLog?.(`【${ax.icon}${ax.name}】雷击${Math.floor((ax.shockPct || 0.06) * 100)}%生命`, 'error');
        }
        if (ax.shadowEvery && rounds % ax.shadowEvery === 0) {
            applyDamage?.(bMul(tsr.currentRun.playerHealth, ax.shadowPct || 0.05));
            addTsrLog?.(`【${ax.icon}${ax.name}】暗影侵蚀${Math.floor((ax.shadowPct || 0.05) * 100)}%`, 'error');
        }
        if (ax.starfallEvery && rounds % ax.starfallEvery === 0) {
            applyDamage?.(bMul(tsr.currentRun.playerHealth, ax.starfallPct || 0.05));
            addTsrLog?.(`【${ax.icon}${ax.name}】星陨${Math.floor((ax.starfallPct || 0.05) * 100)}%生命`, 'error');
        }
        if (ax.dualCounterEvery && rounds % ax.dualCounterEvery === 0) {
            tsr.currentRun.monsterMultiStrike = true;
            addTsrLog?.(`【${ax.icon}${ax.name}】双刃！下回合追加反击`, 'warning');
        }
        if (ax.healBlockEvery && rounds % ax.healBlockEvery === 0) {
            addTempBuff?.({ name: ax.name + '禁疗', effect: 'healAmp', value: -(ax.healBlockValue || 0.08), duration: ax.healBlockDuration || 3, isDebuff: true });
            addTsrLog?.(`【${ax.icon}${ax.name}】治疗-${Math.floor((ax.healBlockValue || 0.08) * 100)}%`, 'warning');
        }
        if (ax.cataclysmEvery && rounds % ax.cataclysmEvery === 0) {
            applyDamage?.(bMul(tsr.currentRun.playerHealth, ax.cataclysmPct || 0.08));
            addTsrLog?.(`【${ax.icon}${ax.name}】灾变冲击${Math.floor((ax.cataclysmPct || 0.08) * 100)}%`, 'error');
        }
        if (ax.reflectEvery && rounds % ax.reflectEvery === 0) {
            applyDamage?.(bMul(tsr.currentRun.playerHealth, ax.reflectPct || 0.04));
            addTsrLog?.(`【${ax.icon}${ax.name}】镜像反射${Math.floor((ax.reflectPct || 0.04) * 100)}%`, 'error');
        }
        if (ax.chaosEvery && rounds % ax.chaosEvery === 0) {
            if (Math.random() < 0.5) {
                applyDamage?.(bMul(tsr.currentRun.playerHealth, 0.04));
                addTsrLog?.(`【${ax.icon}${ax.name}】混沌诅咒！`, 'error');
            } else {
                hp += Math.floor(monsterMaxHp * 0.03);
                addTsrLog?.(`【${ax.icon}${ax.name}】混沌回血！`, 'warning');
            }
        }
        if (ax.timeFreezeEvery && rounds % ax.timeFreezeEvery === 0) {
            tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - (ax.timeFreeze || 5));
            addTsrLog?.(`【${ax.icon}${ax.name}】时锁！-${ax.timeFreeze || 5}秒`, 'warning');
        }
        if (ax.playerLowHpThreshold && (tsr.currentRun.playerHealth) && monsterMaxHp > 0) {
            /* handled in counter mult */
        }
    });
    if (t.regen && rounds % 3 === 0 && hp > 0) {
        const heal = Math.floor(monsterMaxHp * t.regen);
        hp += heal;
    }
    if (t.lifeSteal && rounds % 2 === 0 && hp > 0 && hp < monsterMaxHp) {
        hp += Math.floor(monsterMaxHp * t.lifeSteal * 0.15);
    }
    return Math.max(0, hp);
}

initTsrMonsterExtensions();

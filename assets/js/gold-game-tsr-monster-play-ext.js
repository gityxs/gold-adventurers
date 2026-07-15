/**
 * 时光秘境 · 怪物玩法扩展（词条羁绊 / 多段首领 / 新技能 / 怪物池 / 狩猎强化）
 */
const TSR_MONSTER_AFFIX_PLAY = {
    tideCrush: { id: 'tideCrush', name: '潮压', icon: '🌊', desc: '反击+12%，每4回合回响4%', counterMult: 0.12, echoEvery: 4, echoDmgPct: 0.04, weight: 6 },
    voidChains: { id: 'voidChains', name: '虚空链', icon: '⛓️', desc: '每4回合虚空6%并断缘', voidEvery: 4, voidDmgPct: 0.06, bondLoss: 2, bondEvery: 4, weight: 5 },
    bloodMoon: { id: 'bloodMoon', name: '血月', icon: '🌙', desc: '每3回合血契5%联结', bloodPactEvery: 3, bloodPactRegen: 0.05, bloodPactDmg: 0.04, counterMult: 0.08, weight: 5 },
    thunderVeil: { id: 'thunderVeil', name: '雷幕', icon: '⚡', desc: '每3回合雷击5%，每4回合护盾', shockEvery: 3, shockPct: 0.05, shieldEvery: 4, shieldPulse: 0.05, weight: 5 },
    plagueWind: { id: 'plagueWind', name: '疫风', icon: '☠️', desc: '每3回合毒蚀5%，每4回合噬灵8%', poisonEvery: 3, poisonPct: 0.05, spiritDrainPct: 0.08, spiritDrainEvery: 4, weight: 6 },
    flameEcho: { id: 'flameEcho', name: '焰响', icon: '🔥', desc: '每3回合灼烧6%，每4回合回响', burnEvery: 3, burnPct: 0.06, echoEvery: 4, echoDmgPct: 0.04, weight: 5 },
    frostShackle: { id: 'frostShackle', name: '霜缚', icon: '❄️', desc: '每3回合霜噬3秒，每4回合诅咒', frostEvery: 3, frostDrain: 3, curseEvery: 4, curseValue: 0.08, curseDuration: 2, weight: 5 },
    coinStorm: { id: 'coinStorm', name: '币暴', icon: '💸', desc: '每3回合吸走18币，赏金+18%', coinStealEvery: 3, coinSteal: 18, rewardMult: 0.18, weight: 5 },
    phaseWeaver: { id: 'phaseWeaver', name: '织相', icon: '🌫️', desc: '生命+10%，每4回合相位闪避', hpMult: 0.1, phaseWalkEvery: 4, counterMult: 0.1, weight: 5 },
    soulReaper: { id: 'soulReaper', name: '摄魂', icon: '💀', desc: '每2回合噬灵12%，赏金+15%', spiritDrainEvery: 2, spiritDrainPct: 0.12, rewardMult: 0.15, eliteOnly: true, weight: 4 },
    rustArmor: { id: 'rustArmor', name: '锈铠', icon: '🛡️', desc: '生命+20%，每5回合展开6%护盾', hpMult: 0.2, atkMult: -0.05, shieldPulse: 0.06, shieldEvery: 5, weight: 6 },
    chainBreaker: { id: 'chainBreaker', name: '断链', icon: '⛓️', desc: '每3回合亲密度-3，反击+12%', bondLoss: 3, bondEvery: 3, counterMult: 0.12, weight: 5 },
    destinyMark: { id: 'destinyMark', name: '命印', icon: '🔮', desc: '攻击+14%，反击+10%，赏金+15%', atkMult: 0.14, counterMult: 0.1, rewardMult: 0.15, weight: 4 },
    mechCore: { id: 'mechCore', name: '机核', icon: '⚙️', desc: '攻击+16%，每4回合过载5%', atkMult: 0.16, overloadEvery: 4, overloadDmg: 0.05, weight: 5 },
    ancientRune: { id: 'ancientRune', name: '古符', icon: '📜', desc: '生命+12%，每4回合自愈4%', hpMult: 0.12, regenEvery: 4, regenPct: 0.04, weight: 5 },
    paradoxLoop: { id: 'paradoxLoop', name: '悖论环', icon: '🌀', desc: '每3回合混沌骰或窃时2秒', chaosEvery: 3, timeDrain: 2, timeDrainEvery: 3, weight: 4 },
    novaBurst: { id: 'novaBurst', name: '新星', icon: '☄️', desc: '每4回合星陨6%，攻击+10%', starfallEvery: 4, starfallPct: 0.06, atkMult: 0.1, weight: 5 },
    shadowBind: { id: 'shadowBind', name: '影缚', icon: '🌑', desc: '每4回合暗影6%，每5回合诅咒', shadowEvery: 4, shadowPct: 0.06, curseEvery: 5, curseValue: 0.1, curseDuration: 2, weight: 5 },
    relentlessHunter: { id: 'relentlessHunter', name: '追猎', icon: '🎯', desc: '攻击+12%，玩家低血反击+22%', atkMult: 0.12, playerLowHpThreshold: 0.4, playerLowHpCounter: 0.22, weight: 5 },
    ascendantFury: { id: 'ascendantFury', name: '升怒', icon: '👑', desc: '首领：低血反击+30%，首2回合反击+20%', lowHpThreshold: 0.45, lowHpCounterMult: 0.3, firstCounterBonus: 0.2, firstCounterRounds: 2, bossOnly: true, weight: 3 },
    mirrorStorm: { id: 'mirrorStorm', name: '镜暴', icon: '🪞', desc: '每4回合反射5%，反击+10%', reflectEvery: 4, reflectPct: 0.05, counterMult: 0.1, weight: 5 },
    cataclysmEcho: { id: 'cataclysmEcho', name: '灾响', icon: '🌋', desc: '首领：每5回合灾变7%', cataclysmEvery: 5, cataclysmPct: 0.07, counterMult: 0.08, bossOnly: true, weight: 3 },
    synergySeed: { id: 'synergySeed', name: '羁绊种', icon: '🔗', desc: '生命+8%，赏金+25%，精英专属', hpMult: 0.08, rewardMult: 0.25, eliteOnly: true, weight: 4 },
    phaseCrown: { id: 'phaseCrown', name: '相位冠', icon: '👑', desc: '首领：每4回合相位，反击+12%', phaseWalkEvery: 4, counterMult: 0.12, bossOnly: true, weight: 3 }
};

const TSR_MONSTER_AFFIX_INCOMPAT_PLAY = [
    ['rustArmor', 'glassFang'], ['phaseWeaver', 'ironFist'], ['synergySeed', 'fragile']
];

/** 双词条同时存在时触发额外效果 */
const TSR_MONSTER_AFFIX_SYNERGIES = [
    { id: 'toxicBloom', name: '剧毒绽放', icon: '☠️', affixes: ['poisonMist', 'danPoison'],
      desc: '毒蚀伤害+2%', onRound: (r, ctx) => { if (r % 3 === 0) { applyDamage(bMul(ctx.tsr.currentRun.playerHealth, 0.02)); addTsrLog('🔗【剧毒绽放】额外毒蚀2%', 'error'); } } },
    { id: 'timeVortex', name: '时涡', icon: '⏳', affixes: ['timeThief', 'chronosDevour'],
      desc: '窃时+1秒', onRound: (r, ctx) => { if (r % 2 === 0) { ctx.tsr.currentRun.timeLeft = Math.max(0, ctx.tsr.currentRun.timeLeft - 1); addTsrLog('🔗【时涡】额外窃取1秒', 'warning'); } } },
    { id: 'frostFire', name: '冰火同源', icon: '❄️', affixes: ['frozenHeart', 'blazingCore'],
      desc: '每4回合冰火冲击5%', onRound: (r, ctx) => { if (r % 4 === 0) { applyDamage(bMul(ctx.tsr.currentRun.playerHealth, 0.05)); addTsrLog('🔗【冰火同源】冰火冲击5%', 'error'); } } },
    { id: 'ironFortress', name: '铁壁共鸣', icon: '🧱', affixes: ['thickHide', 'ironWall'],
      desc: '偶数回合展开8%护盾', onRound: (r, ctx) => { if (r % 2 === 0) { ctx.tsr.currentRun.monsterShield = Math.min(0.5, (ctx.tsr.currentRun.monsterShield || 0) + 0.08); addTsrLog('🔗【铁壁共鸣】护盾强化', 'warning'); } } },
    { id: 'soulChain', name: '魂链', icon: '⛓️', affixes: ['spiritErode', 'soulBurn'],
      desc: '每3回合噬灵6%+亲密度-1', onRound: (r, ctx) => { if (r % 3 === 0) { const pct = 0.06; const drain = Math.max(4, Math.floor((ctx.tsr.currentRun.spiritCharge || 0) * pct)); ctx.tsr.currentRun.spiritCharge = Math.max(0, (ctx.tsr.currentRun.spiritCharge || 0) - drain); const sp = ensureTsrSpiritPet(); sp.bond = Math.max(0, (sp.bond || 0) - 1); invalidateTsrUiCache('spirit'); addTsrLog(`🔗【魂链】噬灵-${drain}%，亲密度-1`, 'warning'); } } },
    { id: 'thunderStorm', name: '雷暴', icon: '⚡', affixes: ['thunderCoil', 'leiPunish'],
      desc: '雷击伤害+2%', onRound: (r, ctx) => { if (r % 3 === 0) { applyDamage(bMul(ctx.tsr.currentRun.playerHealth, 0.02)); addTsrLog('🔗【雷暴】追加雷击2%', 'error'); } } },
    { id: 'bountyHunter', name: '赏金共鸣', icon: '💰', affixes: ['greedy', 'bounty'],
      counterBonus: 0.15, desc: '反击+15%' },
    { id: 'chaosDice', name: '混沌叠加', icon: '🎲', affixes: ['chaosRoll', 'chaosInject'],
      desc: '混沌效果强化', onRound: (r, ctx) => { if (r % 3 === 0 && Math.random() < 0.35) { applyDamage(bMul(ctx.tsr.currentRun.playerHealth, 0.03)); addTsrLog('🔗【混沌叠加】追加混沌冲击3%', 'error'); } } },
    { id: 'regenTide', name: '潮愈', icon: '💚', affixes: ['regen', 'relentless'],
      onRound: (r, ctx, hp, maxHp) => { if (r % 2 === 0 && hp > 0) { const heal = Math.floor(maxHp * 0.02); ctx.hp += heal; addTsrLog(`🔗【潮愈】额外回复${formatTsrCombatNum(heal)}`, 'warning'); return ctx.hp; } return hp; } },
    { id: 'voidStar', name: '虚空星爆', icon: '🕳️', affixes: ['voidEmbrace', 'singularityEcho'],
      desc: '虚空伤害+2%', onRound: (r, ctx) => { if (r % 4 === 0) { applyDamage(bMul(ctx.tsr.currentRun.playerHealth, 0.02)); addTsrLog('🔗【虚空星爆】追加虚空2%', 'error'); } } },
    { id: 'furyEnrage', name: '狂怒共振', icon: '🔥', affixes: ['fury', 'enrage'],
      counterBonus: 0.12, desc: '反击+12%' },
    { id: 'bloodVamp', name: '血月爵影', icon: '🦇', affixes: ['bloodMoon', 'vampiricLord'],
      onRound: (r, ctx, hp, maxHp) => { if (r % 3 === 0 && hp > 0) { const heal = Math.floor(maxHp * 0.03); ctx.hp += heal; addTsrLog(`🔗【血月爵影】额外回血${formatTsrCombatNum(heal)}`, 'warning'); return ctx.hp; } return hp; } },
    { id: 'mechOverload', name: '机核过载', icon: '⚙️', affixes: ['mechCore', 'overload'],
      desc: '每4回合追加过载3%', onRound: (r, ctx) => { if (r % 4 === 0) { applyDamage(bMul(ctx.tsr.currentRun.playerHealth, 0.03)); addTsrLog('🔗【机核过载】追加冲击3%', 'error'); } } },
    { id: 'plagueSeal', name: '疫封', icon: '🚫', affixes: ['plagueWind', 'healBlock'],
      desc: '每4回合禁疗10%×2', onRound: (r, ctx) => { if (r % 4 === 0) { addTempBuff({ name: '疫封', effect: 'healAmp', value: -0.1, duration: 2, isDebuff: true }); addTsrLog('🔗【疫封】治疗-10%×2', 'warning'); } } },
    { id: 'destinyChain', name: '命格链', icon: '🔮', affixes: ['destinyMark', 'minggeCurse'],
      counterBonus: 0.1, desc: '反击+10%，赏金感知提升' }
];

const TSR_MONSTER_PLAY_POOL = {
    battle: [
        { id: 'affixmite', name: '词条螨', icon: '🏷️', tier: 'uncommon', intro: '「你身上的词条……看起来很好吃。」', win: '螨被词条杀虫剂清除。', skill: 'armorBreak', skillChance: 0.22 },
        { id: 'synergywisp', name: '羁绊游灵', icon: '🔗', tier: 'rare', intro: '「两个词条在一起，威力翻倍哦。」', win: '游灵散成铭文碎片。', skill: 'affixStorm', skillChance: 0.26 },
        { id: 'phasecrawler', name: '相位爬兽', icon: '🌫️', tier: 'rare', intro: '「你打的是上一阶段的我。」', win: '爬兽被锁定在当前相位。', skill: 'phaseBlink', skillChance: 0.28 },
        { id: 'counterleech', name: '反击水蛭', icon: '🪱', tier: 'uncommon', intro: '「你每砍一刀，我就胖一圈。」', win: '水蛭被反吸血榨干。', skill: 'vampiric', skillChance: 0.24, skillValue: 0.12 },
        { id: 'timeweave', name: '时织蛛', icon: '🕸️', tier: 'epic', intro: '「你的秒数被我织进网里了。」', win: '蛛网被时间剪断。', skill: 'soulBind', skillChance: 0.3, skillValue: 0.15 },
        { id: 'novasprite', name: '新星幼灵', icon: '✨', tier: 'rare', intro: '「爆一爆，更健康。」', win: '幼灵化为星尘。', skill: 'overloadStrike', skillChance: 0.25 },
        { id: 'plaguebat', name: '疫蝠群', icon: '🦇', tier: 'uncommon', intro: '「带毒带噬灵，套餐价。」', win: '蝠群被净化喷雾驱散。', skill: 'spiritDrain', skillChance: 0.26, skillValue: 0.14 },
        { id: 'miragehound', name: '幻猎犬', icon: '🐕', tier: 'epic', intro: '「闻到了你护甲的裂缝。」', win: '猎犬追错了猎物。', skill: 'phaseBlink', skillChance: 0.3 }
    ],
    elite: [
        { id: 'affixwarden', name: '词条典狱长', icon: '⚖️', tier: 'epic', intro: '「每只带词条的怪物，都是我的囚犯。」', win: '典狱长被假释了。', skill: 'affixStorm', skillChance: 0.34 },
        { id: 'synergyknight', name: '羁绊骑士', icon: '🛡️', tier: 'legendary', intro: '「双词条共鸣，听说过吗？」', win: '骑士的羁绊断裂。', skill: 'resonanceBurst', skillChance: 0.32, skillValue: 0.06 },
        { id: 'phasehunter', name: '相位猎手', icon: '🎯', tier: 'epic', intro: '「你进二阶段的时候，我已经在三阶段了。」', win: '猎手被相位锚定。', skill: 'phaseBlink', skillChance: 0.36 },
        { id: 'cataclysmherald', name: '灾响先驱', icon: '🌋', tier: 'legendary', intro: '「全屏AOE，请查收。」', win: '先驱被灾变反噬。', skill: 'overloadStrike', skillChance: 0.35 },
        { id: 'soulreaverelite', name: '摄魂督军', icon: '💀', tier: 'mythic', intro: '「精灵充能？我的下午茶。」', win: '督军吐出了灵息。', skill: 'soulBind', skillChance: 0.38, skillValue: 0.2 },
        { id: 'bountymarshal', name: '赏金元帅', icon: '💰', tier: 'legendary', intro: '「击败我，赏金翻倍——如果你还活着。」', win: '元帅签发了悬赏令。', skill: 'coinSteal', skillChance: 0.33, skillValue: 28 }
    ],
    boss: [
        { id: 'affixoverlord', name: '词条霸主', icon: '👑', tier: 'mythic', intro: '「所有词条，皆臣服于我。」', win: '霸主词条剥落，化为图鉴。', skill: 'affixStorm', skillChance: 0.42 },
        { id: 'phaselord', name: '相位领主', icon: '🌫️', tier: 'mythic', intro: '「四阶段够吗？不够再加一管。」', win: '领主被钉死在当前相位。', skill: 'phaseBlink', skillChance: 0.4 },
        { id: 'synergytitan', name: '羁绊泰坦', icon: '🔗', tier: 'mythic', intro: '「我的每个词条都在为另一个词条打工。」', win: '泰坦共鸣过载崩塌。', skill: 'resonanceBurst', skillChance: 0.38, skillValue: 0.08 },
        { id: 'cataclysmking', name: '灾变君王', icon: '🌋', tier: 'mythic', intro: '「这一层，连时间都要交税。」', win: '君王被时序法庭起诉。', skill: 'tidalWave', skillChance: 0.4 }
    ]
};

const TSR_MONSTER_PLAY_MID_EVENTS = [
    { id: 'affixResonance', name: '词条共鸣', icon: '🔗', chance: 0.1, minRound: 2, maxRound: 10, eliteOnly: true,
      apply: (ctx) => {
          ctx.tsr.currentRun.affixRewardBonus = (ctx.tsr.currentRun.affixRewardBonus || 0) + 0.12;
          return '词条共鸣！本场词条赏金+12%';
      } },
    { id: 'phaseEcho', name: '相位回响', icon: '🌫️', chance: 0.08, minRound: 3, maxRound: 12, bossOnly: true,
      apply: (ctx) => {
          ctx.tsr.currentRun.monsterCounterSurgeRound = ctx.rounds + 1;
          return '相位回响！下回合怪物反击强化';
      } },
    { id: 'synergyFlash', name: '羁绊闪光', icon: '✨', chance: 0.09, minRound: 2, maxRound: 11,
      apply: (ctx) => {
          ctx.tsr.currentRun.battleCritFlash = true;
          chargeTsrSpirit(8);
          return '羁绊闪光！下回合必暴击，充能+8';
      } },
    { id: 'bountyMark', name: '赏金印记', icon: '💰', chance: 0.1, minRound: 3, maxRound: 10, eliteOnly: true,
      apply: (ctx) => {
          const g = addTsrRunCurrency(Math.floor(55 * ctx.dm));
          return `赏金印记烙下！额外+${g}秘境币`;
      } }
];

const TSR_MONSTER_PLAY_ACHIEVEMENTS = [
    { id: 'affixDual10', name: '双词条老手', desc: '击败10只双词条怪物', icon: '⚔️', need: { dualAffixKills: 10 } },
    { id: 'synergySlayer5', name: '羁绊克星', desc: '击败5只触发词条羁绊的怪物', icon: '🔗', need: { synergyAffixKills: 5 } },
    { id: 'bossPhase3', name: '阶段征服者', desc: '在首领三阶段战斗中获胜', icon: '💢', need: { bossPhase3Wins: 1 } },
    { id: 'affixKill50', name: '词条宗师', desc: '击败50只带词条怪物', icon: '🏆', need: { affixKills: 50 } }
];

const TSR_MONSTER_TITLE_PREFIXES_PLAY = {
    battle: ['羁绊的', '共鸣的', '相位中的', '词条化的', '追猎的', '潮涌的', '镜面的', '疫化的'],
    elite: ['羁绊统领', '相位督军', '词条裁决', '灾响先锋', '摄魂禁卫', '赏金猎杀', '机核征伐', '命格巡礼'],
    boss: ['羁绊神裁', '相位天罚', '词条终焉', '灾变君王', '多段霸主', '共鸣灭世', '猎杀之主', '潮压魔神']
};

function getTsrMonsterAffixSynergies(monster) {
    const keys = new Set(monster?.affixKeys || []);
    if (keys.size < 2) return [];
    return TSR_MONSTER_AFFIX_SYNERGIES.filter(syn => syn.affixes.every(a => keys.has(a)));
}

function applyTsrMonsterAffixSynergyRound(monster, rounds, monsterHp, monsterMaxHp) {
    const tsr = player?.timeSecretRealm;
    if (!tsr?.currentRun || !monster) return monsterHp;
    let hp = monsterHp;
    const synergies = getTsrMonsterAffixSynergies(monster);
    if (!synergies.length) return hp;
    tsr.currentRun.activeAffixSynergies = synergies.map(s => s.id);
    const ctx = { tsr, monster, rounds, hp, maxHp: monsterMaxHp };
    synergies.forEach(syn => {
        if (typeof syn.onRound === 'function') {
            ctx.hp = hp;
            const next = syn.onRound(rounds, ctx, hp, monsterMaxHp);
            if (typeof next === 'number') hp = next;
        }
    });
    return Math.max(0, hp);
}

function getTsrMonsterAffixSynergyCounterBonus(monster) {
    return getTsrMonsterAffixSynergies(monster).reduce((s, syn) => s + (syn.counterBonus || 0), 0);
}

function formatTsrMonsterSynergyHtml(monster) {
    const synergies = getTsrMonsterAffixSynergies(monster);
    if (!synergies.length) return '';
    return `<span class="tsr-monster-synergies">${synergies.map(s =>
        `<span class="tsr-monster-synergy-tag" title="${s.desc || s.name}">${s.icon}${s.name}</span>`
    ).join('')}</span>`;
}

function formatTsrMonsterPhaseHtml() {
    const tsr = player?.timeSecretRealm;
    const phase = tsr?.currentRun?.monsterPhaseLevel || 0;
    if (!phase) return '';
    const labels = ['', '二阶段', '三阶段', '四阶段'];
    return `<span class="tsr-monster-phase-badge">💢${labels[phase] || phase + '阶段'}</span>`;
}

function tryTsrMonsterMultiPhaseShift(monster, monsterHp, monsterMaxHp, isBoss, isElite) {
    const tsr = player?.timeSecretRealm;
    if (!tsr?.currentRun || monsterHp <= 0 || monsterMaxHp <= 0) return;
    const pct = monsterHp / monsterMaxHp;
    const thresholds = isBoss ? [0.75, 0.5, 0.25] : (isElite ? [0.6, 0.35] : [0.5]);
    const phase = tsr.currentRun.monsterPhaseLevel || 0;
    const nextThreshold = thresholds[phase];
    if (nextThreshold == null || pct > nextThreshold) return;

    tsr.currentRun.monsterPhaseLevel = phase + 1;
    const bonus = isBoss ? (0.12 + phase * 0.1) : (0.1 + phase * 0.08);
    tsr.currentRun.monsterPhaseCounterBonus = (tsr.currentRun.monsterPhaseCounterBonus || 0) + bonus;
    tsr.currentRun.monsterEnraged = true;

    if (phase === 0 && (isBoss || isElite)) {
        tsr.currentRun.monsterShield = Math.min(0.4, (tsr.currentRun.monsterShield || 0) + (isBoss ? 0.1 : 0.06));
    }
    if (phase === 1 && isBoss) {
        tsr.currentRun.monsterReflectPct = Math.max(tsr.currentRun.monsterReflectPct || 0, 0.04);
    }
    if (phase >= 2 && isBoss) {
        tsr.currentRun.monsterMultiStrike = true;
        tsr.currentRun.reachedBossPhase3 = true;
    }

    const phaseNames = ['一', '二', '三', '四'];
    const line = (typeof TSR_BOSS_LINES !== 'undefined' && TSR_BOSS_LINES.phase)
        ? TSR_BOSS_LINES.phase[Math.floor(Math.random() * TSR_BOSS_LINES.phase.length)]
        : '狂暴计时开始。';
    addTsrLog(`💢 ${monster?.displayName || monster?.name || '守关者'}进入${phaseNames[phase + 1] || (phase + 2)}阶段！${line}`, 'warning');
    if (typeof pushTsrFeelEvent === 'function') {
        pushTsrFeelEvent({
            type: 'phase',
            label: `💢 ${phaseNames[phase + 1] || (phase + 2)}阶段！`,
            phase: phase + 1,
            isBoss: !!isBoss,
            isElite: !!isElite
        });
    }
    // 演出回放前不改横幅，避免阶段剧透
    if (!tsr.currentRun.deferBattleLogs && typeof updateTsrMonsterBanner === 'function' && monster) {
        const stats = tsr.currentRun._lastMonsterBannerStats;
        if (stats) updateTsrMonsterBanner(monster, stats, isBoss, isElite);
    }
}

function applyTsrMonsterPlayExtraSkill(monster, rounds, monsterHp, playerAtk, difficultyMultiplier, isBoss, isElite) {
    const tsr = player.timeSecretRealm;
    const label = `${monster.icon} ${monster.displayName || monster.name}`;
    const hpNum = Number(monsterHp) || 0;
    const atkNum = Number(playerAtk) || 0;
    switch (monster.skill) {
        case 'soulBind': {
            const pct = monster.skillValue || 0.15;
            const drain = Math.max(5, Math.floor((tsr.currentRun.spiritCharge || 0) * pct));
            tsr.currentRun.spiritCharge = Math.max(0, (tsr.currentRun.spiritCharge || 0) - drain);
            addTempBuff({ name: monster.name + '缚灵', effect: 'attack', value: -0.1, duration: 2, isDebuff: true });
            addTsrLog(`${label}发动「缚灵」！充能-${drain}%，攻击-10%×2`, 'warning');
            break;
        }
        case 'phaseBlink':
            tsr.currentRun.monsterDodgeNext = true;
            tsr.currentRun.monsterReflectPct = Math.max(tsr.currentRun.monsterReflectPct || 0, monster.skillValue || 0.04);
            addTsrLog(`${label}发动「相位闪烁」！下回合闪避，暴击反刺${Math.floor((monster.skillValue || 0.04) * 100)}%`, 'warning');
            break;
        case 'overloadStrike':
        case 'overload': {
            // 百分比冲击不乘难度倍率，封顶 12%，避免高难度一次技能秒杀
            const overPct = Math.min(0.12, monster.skillValue || 0.09);
            applyDamage(bMul(tsr.currentRun.playerHealth, overPct));
            addTsrLog(`${label}发动「过载冲击」！受到${Math.floor(overPct * 100)}%生命伤害`, 'error');
            break;
        }
        case 'affixStorm': {
            const effects = ['timeDrain', 'spiritDrain', 'shield', 'curse'];
            const pick = effects[Math.floor(Math.random() * effects.length)];
            if (pick === 'timeDrain') {
                tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - 4);
                addTsrLog(`${label}词条风暴·窃时！-4秒`, 'warning');
            } else if (pick === 'spiritDrain') {
                const d = Math.max(6, Math.floor((tsr.currentRun.spiritCharge || 0) * 0.12));
                tsr.currentRun.spiritCharge = Math.max(0, (tsr.currentRun.spiritCharge || 0) - d);
                addTsrLog(`${label}词条风暴·噬灵！-${d}%`, 'warning');
            } else if (pick === 'shield') {
                tsr.currentRun.monsterShield = Math.min(0.45, (tsr.currentRun.monsterShield || 0) + 0.12);
                addTsrLog(`${label}词条风暴·护盾！`, 'warning');
            } else {
                addTempBuff({ name: '词条风暴', effect: 'attack', value: -0.12, duration: 2, isDebuff: true });
                addTsrLog(`${label}词条风暴·诅咒！攻击-12%×2`, 'warning');
            }
            break;
        }
        case 'resonanceBurst': {
            const pct = Math.min(0.1, monster.skillValue || 0.06);
            applyDamage(bMul(tsr.currentRun.playerHealth, pct));
            const sp = ensureTsrSpiritPet();
            sp.bond = Math.max(0, (sp.bond || 0) - 2);
            invalidateTsrUiCache('spirit');
            addTsrLog(`${label}发动「共鸣爆裂」！${Math.floor(pct * 100)}%伤害，亲密度-2`, 'error');
            break;
        }
        case 'tidalWave':
            tsr.currentRun.monsterCounterSurgeRound = rounds + 1;
            addTsrLog(`${label}发动「潮涌」！下回合反击大幅强化`, 'warning');
            break;
        case 'vampiric': {
            const ratio = monster.skillValue || 0.1;
            const heal = Math.floor(atkNum * ratio);
            monsterHp = hpNum + heal;
            addTsrLog(`${label}发动「吸血」！回复${formatTsrCombatNum(heal)}`, 'warning');
            return monsterHp;
        }
        default:
            return null;
    }
    return monsterHp;
}

function checkTsrMonsterPlayAchievements(ctx) {
    const tsr = player?.timeSecretRealm;
    if (!tsr) return;
    const ls = tsr.lifetimeStats || {};
    const unlock = (id) => {
        if (typeof unlockTsrAchievement === 'function') unlockTsrAchievement(id);
    };
    if ((ls.dualAffixKills || 0) >= 10) unlock('affixDual10');
    if ((ls.synergyAffixKills || 0) >= 5) unlock('synergySlayer5');
    if ((ls.bossPhase3Wins || 0) >= 1) unlock('bossPhase3');
    if ((ls.affixKills || 0) >= 50) unlock('affixKill50');
}

function injectTsrMonsterPlayAffixHuntButton() {
    if ((player?.timeSecretRealm?.lifetimeStats?.dualAffixKills || 0) < 5) return;
    const panel = document.querySelector('.tsr-meme-panel-body');
    if (!panel || panel.querySelector('[data-tsr-synergy-hunt]')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tsr-btn tsr-btn-purple';
    btn.setAttribute('data-tsr-synergy-hunt', '1');
    btn.textContent = '羁绊狩猎 · 三词条精英战';
    btn.onclick = () => tsrChooseAffixHunt('synergy');
    const ghost = panel.querySelector('.tsr-btn-ghost');
    if (ghost) panel.insertBefore(btn, ghost);
}

function initTsrMonsterPlayExtensions() {
    if (typeof TSR_MONSTER_AFFIXES !== 'undefined') {
        Object.assign(TSR_MONSTER_AFFIXES, TSR_MONSTER_AFFIX_PLAY);
    }
    if (typeof TSR_MONSTER_AFFIX_INCOMPAT !== 'undefined') {
        TSR_MONSTER_AFFIX_INCOMPAT.push(...TSR_MONSTER_AFFIX_INCOMPAT_PLAY);
    }
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_MONSTER_PLAY_POOL.battle);
        TSR_MONSTER_POOL.elite.push(...TSR_MONSTER_PLAY_POOL.elite);
        TSR_MONSTER_POOL.boss.push(...TSR_MONSTER_PLAY_POOL.boss);
    }
    if (typeof TSR_BATTLE_MID_EVENTS !== 'undefined') {
        TSR_BATTLE_MID_EVENTS.push(...TSR_MONSTER_PLAY_MID_EVENTS);
    }
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') {
        TSR_ACHIEVEMENTS.push(...TSR_MONSTER_PLAY_ACHIEVEMENTS);
    }
    if (typeof TSR_MONSTER_TITLE_PREFIXES !== 'undefined') {
        ['battle', 'elite', 'boss'].forEach(k => {
            TSR_MONSTER_TITLE_PREFIXES[k].push(...TSR_MONSTER_TITLE_PREFIXES_PLAY[k]);
        });
    }

    if (typeof applyTsrMonsterTitlePrefix === 'function' && !applyTsrMonsterTitlePrefix.__tsrPlayPatched) {
        const _origPrefix = applyTsrMonsterTitlePrefix;
        applyTsrMonsterTitlePrefix = function (monster, isBoss, isElite) {
            _origPrefix(monster, isBoss, isElite);
            if (getTsrMonsterAffixSynergies(monster).length && !monster.titlePrefix?.includes('羁绊')) {
                const tag = isBoss ? '羁绊' : '共鸣';
                if (Math.random() < 0.55) {
                    monster.titlePrefix = (monster.titlePrefix || '') + tag;
                    monster.displayName = monster.titlePrefix + (monster.name || '');
                }
            }
        };
        applyTsrMonsterTitlePrefix.__tsrPlayPatched = true;
    }

    if (typeof applyTsrMonsterAffixRound === 'function' && !applyTsrMonsterAffixRound.__tsrPlayPatched) {
        const _origAffixRound = applyTsrMonsterAffixRound;
        applyTsrMonsterAffixRound = function (monster, rounds, monsterHp, monsterMaxHp) {
            let hp = _origAffixRound(monster, rounds, monsterHp, monsterMaxHp);
            hp = applyTsrMonsterAffixSynergyRound(monster, rounds, hp, monsterMaxHp);
            return hp;
        };
        applyTsrMonsterAffixRound.__tsrPlayPatched = true;
    }

    if (typeof getTsrMonsterAffixCounterMult === 'function' && !getTsrMonsterAffixCounterMult.__tsrPlayPatched) {
        const _origCounter = getTsrMonsterAffixCounterMult;
        getTsrMonsterAffixCounterMult = function (monster, rounds, monsterHp, monsterMaxHp) {
            return _origCounter(monster, rounds, monsterHp, monsterMaxHp) + getTsrMonsterAffixSynergyCounterBonus(monster);
        };
        getTsrMonsterAffixCounterMult.__tsrPlayPatched = true;
    }

    if (typeof tryTsrMonsterPhaseShift === 'function' && !tryTsrMonsterPhaseShift.__tsrPlayPatched) {
        tryTsrMonsterPhaseShift = function (monster, monsterHp, monsterMaxHp, isBoss, isElite) {
            tryTsrMonsterMultiPhaseShift(monster, monsterHp, monsterMaxHp, isBoss, isElite);
        };
        tryTsrMonsterPhaseShift.__tsrPlayPatched = true;
    }

    if (typeof resetTsrBattleTransientState === 'function' && !resetTsrBattleTransientState.__tsrPlayPatched) {
        const _origReset = resetTsrBattleTransientState;
        resetTsrBattleTransientState = function () {
            _origReset();
            const tsr = player?.timeSecretRealm;
            if (tsr?.currentRun) {
                tsr.currentRun.monsterPhaseLevel = 0;
                tsr.currentRun.reachedBossPhase3 = false;
                tsr.currentRun.activeAffixSynergies = null;
            }
        };
        resetTsrBattleTransientState.__tsrPlayPatched = true;
    }

    if (typeof applyTsrMonsterSkill === 'function' && !applyTsrMonsterSkill.__tsrPlayPatched) {
        const _origSkill = applyTsrMonsterSkill;
        const playSkills = new Set(['soulBind', 'phaseBlink', 'overloadStrike', 'overload', 'affixStorm', 'resonanceBurst', 'tidalWave', 'vampiric']);
        applyTsrMonsterSkill = function (monster, rounds, monsterHp, playerAtk, difficultyMultiplier, isBoss, isElite) {
            if (monster?.skill && playSkills.has(monster.skill)) {
                const extra = applyTsrMonsterPlayExtraSkill(monster, rounds, monsterHp, playerAtk, difficultyMultiplier, isBoss, isElite);
                if (extra != null) return extra;
            }
            return _origSkill(monster, rounds, monsterHp, playerAtk, difficultyMultiplier, isBoss, isElite);
        };
        applyTsrMonsterSkill.__tsrPlayPatched = true;
    }

    if (typeof updateTsrMonsterBanner === 'function' && !updateTsrMonsterBanner.__tsrPlayPatched) {
        const _origBanner = updateTsrMonsterBanner;
        updateTsrMonsterBanner = function (monster, stats, isBoss, isElite) {
            const tsr = player?.timeSecretRealm;
            if (tsr?.currentRun) tsr.currentRun._lastMonsterBannerStats = stats;
            _origBanner(monster, stats, isBoss, isElite);
            const banner = document.getElementById('tsrMonsterBanner');
            if (!banner || !monster) return;
            const left = banner.querySelector('.tsr-monster-banner-left');
            if (left) {
                const synHtml = formatTsrMonsterSynergyHtml(monster);
                const phaseHtml = formatTsrMonsterPhaseHtml();
                if (synHtml && !left.querySelector('.tsr-monster-synergies')) {
                    left.insertAdjacentHTML('beforeend', synHtml);
                }
                if (phaseHtml && !left.querySelector('.tsr-monster-phase-badge')) {
                    left.insertAdjacentHTML('beforeend', phaseHtml);
                }
            }
        };
        updateTsrMonsterBanner.__tsrPlayPatched = true;
    }

    if (typeof onTsrMonsterAffixVictory === 'function' && !onTsrMonsterAffixVictory.__tsrPlayPatched) {
        const _origVictory = onTsrMonsterAffixVictory;
        onTsrMonsterAffixVictory = function (monster) {
            _origVictory(monster);
            const tsr = player?.timeSecretRealm;
            if (!tsr) return;
            if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
            const synergies = getTsrMonsterAffixSynergies(monster);
            if (synergies.length) {
                tsr.lifetimeStats.synergyAffixKills = (tsr.lifetimeStats.synergyAffixKills || 0) + 1;
                tsr.currentRun.synergyKillThisRun = true;
            }
            if (tsr.currentRun?.reachedBossPhase3 && (tsr.currentRun.currentRoom?.isBoss || tsr.currentRun.currentRoom?.type === 'boss')) {
                tsr.lifetimeStats.bossPhase3Wins = (tsr.lifetimeStats.bossPhase3Wins || 0) + 1;
            }
            checkTsrMonsterPlayAchievements();
        };
        onTsrMonsterAffixVictory.__tsrPlayPatched = true;
    }

    if (typeof tsrChooseAffixHunt === 'function' && !tsrChooseAffixHunt.__tsrPlayPatched) {
        const _origHunt = tsrChooseAffixHunt;
        tsrChooseAffixHunt = function (path) {
            if (path !== 'synergy') return _origHunt(path);
            const tsr = player.timeSecretRealm;
            const room = tsr.currentRun.currentRoom;
            if (!room || room.type !== 'affixhunt' || !room.explored) return;
            const target = tsr.currentRun.huntTarget || pickTsrMonster(false, true, tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
            tsr.currentRun.huntTarget = null;
            hideTsrChoicePanels();
            ensureTsrMonsterAffixes(target, { isElite: true, floor: tsr.currentRun.currentFloor });
            let guard = 0;
            while ((target.affixKeys || []).length < 3 && guard++ < 12) {
                const extra = rollTsrMonsterAffixKeys(target, false, true, tsr.currentRun.currentFloor)
                    .filter(k => !(target.affixKeys || []).includes(k));
                if (!extra.length) break;
                target.affixKeys.push(extra[0]);
            }
            room.monster = target;
            room.isElite = true;
            room.isSynergyHunt = true;
            room.rewards = generateRoomRewards('elite', tsr.currentRun.difficultyMultiplier);
            room.rewards.currency = Math.floor(room.rewards.currency * 1.85);
            const syn = getTsrMonsterAffixSynergies(target);
            if (syn.length) addTsrLog(`羁绊狩猎！激活${syn.map(s => s.name).join('、')}`, 'info');
            handleBattleRoom({ forceElite: true });
            if (bLteZero(tsr.currentRun.playerHealth)) return;
            if (Math.random() < 0.5) addTsrConsumable('affixScope');
            if (Math.random() < 0.22) addTsrRunCurrency(Math.floor(80 * tsr.currentRun.difficultyMultiplier));
            addTsrLog('羁绊狩猎完成！', 'success');
            afterAction();
        };
        tsrChooseAffixHunt.__tsrPlayPatched = true;
    }

    if (typeof handleAffixHuntRoom === 'function' && !handleAffixHuntRoom.__tsrPlayPatched) {
        const _origHuntRoom = handleAffixHuntRoom;
        handleAffixHuntRoom = function () {
            _origHuntRoom();
            setTimeout(injectTsrMonsterPlayAffixHuntButton, 0);
        };
        handleAffixHuntRoom.__tsrPlayPatched = true;
    }

    if (typeof checkTsrAchievements === 'function' && !checkTsrAchievements.__tsrPlayPatched) {
        const _origAch = checkTsrAchievements;
        checkTsrAchievements = function (ctx) {
            _origAch(ctx);
            checkTsrMonsterPlayAchievements(ctx);
        };
        checkTsrAchievements.__tsrPlayPatched = true;
    }

    if (typeof ensureTsrMonsterAffixes === 'function' && !ensureTsrMonsterAffixes.__tsrPlayPatched) {
        const _origEnsure = ensureTsrMonsterAffixes;
        ensureTsrMonsterAffixes = function (monster, opts) {
            const r = _origEnsure(monster, opts);
            const syn = getTsrMonsterAffixSynergies(monster);
            if (syn.length && player?.timeSecretRealm?.currentRun?.isActive) {
                addTsrLog(`🔗 词条羁绊激活：${syn.map(s => s.icon + s.name).join('、')}`, 'warning');
            }
            return r;
        };
        ensureTsrMonsterAffixes.__tsrPlayPatched = true;
    }
}

initTsrMonsterPlayExtensions();

/**
 * 时光秘境 · 怪物变异 & 多段生命扩展
 */
const TSR_MONSTER_MUTATIONS = {
    giant: { id: 'giant', name: '巨大化', icon: '🦣', desc: '生命+32%，攻击+6%', hpMult: 0.32, atkMult: 0.06, weight: 9 },
    swift: { id: 'swift', name: '疾风化', icon: '💨', desc: '生命-14%，攻击+20%，反击+12%', hpMult: -0.14, atkMult: 0.2, counterMult: 0.12, weight: 8 },
    armored: { id: 'armored', name: '甲壳化', icon: '🐢', desc: '生命+24%，开战护盾10%', hpMult: 0.24, startShield: 0.1, weight: 8 },
    frenzied: { id: 'frenzied', name: '癫狂化', icon: '🤪', desc: '攻击+24%，生命-16%，赏金+20%', atkMult: 0.24, hpMult: -0.16, rewardMult: 0.2, weight: 7 },
    spectral: { id: 'spectral', name: '幽魂化', icon: '👻', desc: '每5回合相位闪避，反击+10%', phaseWalkEvery: 5, counterMult: 0.1, weight: 6 },
    venomous: { id: 'venomous', name: '剧毒化', icon: '☠️', desc: '每3回合毒蚀5%生命', poisonEvery: 3, poisonPct: 0.05, weight: 7 },
    blazing: { id: 'blazing', name: '烈焰化', icon: '🔥', desc: '攻击+12%，每4回合灼烧5%', atkMult: 0.12, burnEvery: 4, burnPct: 0.05, weight: 7 },
    frozen: { id: 'frozen', name: '冰霜化', icon: '❄️', desc: '每3回合霜噬3秒，反击+8%', frostEvery: 3, frostDrain: 3, counterMult: 0.08, weight: 6 },
    split: { id: 'split', name: '分裂化', icon: '🧫', desc: '双段生命，单段生命-22%', hpMult: -0.22, lifeProfile: 'dual', weight: 5 },
    hydra: { id: 'hydra', name: '九头化', icon: '🐍', desc: '三段再生生命，攻击渐强', lifeProfile: 'hydra', atkMult: 0.08, weight: 4, eliteOnly: true },
    golden: { id: 'golden', name: '金色化', icon: '✨', desc: '赏金+38%，生命-8%', rewardMult: 0.38, hpMult: -0.08, weight: 5 },
    voidborn: { id: 'voidborn', name: '虚空化', icon: '🕳️', desc: '每4回合虚空6%，噬灵8%', voidEvery: 4, voidDmgPct: 0.06, spiritDrainPct: 0.08, spiritDrainEvery: 4, weight: 5 },
    berserk: { id: 'berserk', name: '狂暴化', icon: '💢', desc: '攻击+18%，低血反击+28%', atkMult: 0.18, lowHpThreshold: 0.45, lowHpCounterMult: 0.28, weight: 6 },
    mimic: { id: 'mimic', name: '拟态化', icon: '🪞', desc: '每4回合反射5%，生命+8%', reflectEvery: 4, reflectPct: 0.05, hpMult: 0.08, weight: 5 },
    chronos: { id: 'chronos', name: '时序化', icon: '⏳', desc: '每2回合窃取3秒，三段生命', timeDrain: 3, timeDrainEvery: 2, lifeProfile: 'triple', weight: 3, bossOnly: true },
    immortal: { id: 'immortal', name: '不朽化', icon: '♾️', desc: '首领四段生命，赏金+25%', lifeProfile: 'quad', rewardMult: 0.25, bossOnly: true, weight: 2 },
    plague: { id: 'plague', name: '瘟疫化', icon: '🦠', desc: '每3回合毒蚀+禁疗', poisonEvery: 3, poisonPct: 0.04, healBlockEvery: 4, healBlockValue: 0.08, healBlockDuration: 2, weight: 5 },
    storm: { id: 'storm', name: '雷暴化', icon: '⚡', desc: '每3回合雷击6%', shockEvery: 3, shockPct: 0.06, counterMult: 0.08, weight: 6 },
    shadow: { id: 'shadow', name: '暗影化', icon: '🌑', desc: '每4回合暗影侵蚀5%', shadowEvery: 4, shadowPct: 0.05, atkMult: 0.1, weight: 5 },
    nova: { id: 'nova', name: '新星化', icon: '☄️', desc: '每4回合星陨5%，双段生命', starfallEvery: 4, starfallPct: 0.05, lifeProfile: 'dual', weight: 4 }
};

const TSR_MONSTER_LIFE_PROFILES = {
    dual: {
        stages: 2,
        hpRatio: [1, 0.72],
        atkRatio: [1, 1.14],
        labels: ['本体', '再生体'],
        rewardBonus: 0.18,
        reviveLog: '躯壳碎裂，再生组织蠕动重组'
    },
    triple: {
        stages: 3,
        hpRatio: [1, 0.66, 0.58],
        atkRatio: [1, 1.12, 1.24],
        labels: ['甲形态', '乙形态', '终焉体'],
        rewardBonus: 0.3,
        reviveLog: '形态蜕变，杀意愈发浓烈'
    },
    quad: {
        stages: 4,
        hpRatio: [1, 0.62, 0.52, 0.45],
        atkRatio: [1, 1.1, 1.18, 1.3],
        labels: ['一命', '二命', '三命', '不灭'],
        rewardBonus: 0.45,
        bossOnly: true,
        reviveLog: '不灭意志燃烧，拒绝倒下'
    },
    hydra: {
        stages: 3,
        hpRatio: [1, 0.78, 0.78],
        atkRatio: [1, 1.06, 1.12],
        labels: ['主头', '副头', '再生头'],
        rewardBonus: 0.22,
        reviveBurst: 0.03,
        reviveLog: '断头再生，嘶鸣更刺耳'
    }
};

const TSR_MONSTER_MUTATION_POOL = {
    battle: [
        { id: 'mutantslime', name: '变异史莱姆', icon: '🧫', tier: 'uncommon', mutation: 'split', intro: '「分裂是我的被动技能。」', win: '史莱姆再也合不拢了。', skill: 'heal', skillChance: 0.2, skillValue: 0.06 },
        { id: 'venomimp', name: '疫魔小鬼', icon: '🦠', tier: 'rare', mutation: 'venomous', intro: '「这毒不是DEBUFF，是特性。」', win: '小鬼被中和了。', skill: 'curse', skillChance: 0.24 },
        { id: 'giantworm', name: '巨化蠕虫', icon: '🦣', tier: 'rare', mutation: 'giant', intro: '「我比上一层又大了两号。」', win: '蠕虫缩回正常尺寸。', skill: 'rage', skillChance: 0.26 },
        { id: 'spectershade', name: '幽魂残影', icon: '👻', tier: 'epic', mutation: 'spectral', lifeProfile: 'dual', intro: '「你打中的是上一秒的我的。」', win: '残影被相位锚定。', skill: 'phaseBlink', skillChance: 0.28 }
    ],
    elite: [
        { id: 'hydracaptain', name: '九头队长', icon: '🐍', tier: 'legendary', mutation: 'hydra', lifeProfile: 'hydra', intro: '「砍掉一个头，还有两个——等等，是三个。」', win: '队长所有头都沉默了。', skill: 'multiStrike', skillChance: 0.34 },
        { id: 'goldenwarden', name: '金色典狱长', icon: '✨', tier: 'epic', mutation: 'golden', intro: '「击败我的赏金，够你付三个月房租。」', win: '典狱长金色涂层剥落。', skill: 'coinSteal', skillChance: 0.3, skillValue: 22 },
        { id: 'stormmarshal', name: '雷暴元帅', icon: '⚡', tier: 'legendary', mutation: 'storm', lifeProfile: 'triple', intro: '「三段生命，一段比一段带电。」', win: '元帅雷电耗尽。', skill: 'overloadStrike', skillChance: 0.32 },
        { id: 'voidchimera', name: '虚空奇美拉', icon: '🕳️', tier: 'mythic', mutation: 'voidborn', lifeProfile: 'dual', intro: '「虚空里也有KPI。」', win: '奇美拉被观测坍缩。', skill: 'soulBind', skillChance: 0.36, skillValue: 0.18 }
    ],
    boss: [
        { id: 'immortalking', name: '不朽君王', icon: '♾️', tier: 'mythic', mutation: 'immortal', lifeProfile: 'quad', intro: '「四段生命，一段比一段不讲理。」', win: '君王终于肯躺平了。', skill: 'affixStorm', skillChance: 0.4 },
        { id: 'chronostitan', name: '时序泰坦', icon: '⏳', tier: 'mythic', mutation: 'chronos', lifeProfile: 'triple', intro: '「你的时间线，我看过三个版本。」', win: '泰坦时序崩塌。', skill: 'timeDrain', skillChance: 0.42, skillValue: 7 },
        { id: 'cataclysmhydra', name: '灾变九首龙', icon: '🐉', tier: 'mythic', mutation: 'hydra', lifeProfile: 'hydra', intro: '「九个脑袋，九份加班。」', win: '九首龙被集体裁员。', skill: 'tidalWave', skillChance: 0.38 },
        { id: 'novaoverlord', name: '新星霸主', icon: '☄️', tier: 'mythic', mutation: 'nova', lifeProfile: 'triple', intro: '「爆一爆，还能再爆两爆。」', win: '霸主超新星熄灭。', skill: 'resonanceBurst', skillChance: 0.4, skillValue: 0.07 }
    ]
};

const TSR_MONSTER_MUTATION_ACHIEVEMENTS = [
    { id: 'mutationKill10', name: '变异猎手', desc: '击败10只变异怪物', icon: '🧬', need: { mutationKills: 10 } },
    { id: 'multiLifeWin5', name: '多命终结者', desc: '击败5只多段生命怪物', icon: '❤️', need: { multiLifeKills: 5 } },
    { id: 'triLifeBoss1', name: '三段斩首', desc: '击败一只3段以上生命的首领', icon: '💢', need: { triLifeBossKills: 1 } },
    { id: 'lifeRevive20', name: '见证重生', desc: '目睹怪物生命重整20次', icon: '🔄', need: { monsterLifeRevivesSeen: 20 } }
];

function getTsrMonsterMutationDef(monster) {
    if (!monster?.mutationKey) return null;
    return TSR_MONSTER_MUTATIONS[monster.mutationKey] || null;
}

function getTsrMonsterLifeProfile(monster) {
    const key = monster?.lifeProfileKey;
    if (!key) return null;
    return TSR_MONSTER_LIFE_PROFILES[key] || null;
}

function rollTsrMonsterMutation(monster, isBoss, isElite, floor) {
    if (!monster || monster.mutationKey) return;
    if (monster.mutation) {
        monster.mutationKey = monster.mutation;
        return;
    }
    const diffTier = typeof getTsrDifficultyTier === 'function' ? getTsrDifficultyTier() : 0;
    let chance = isBoss ? 0.42 : (isElite ? 0.26 : 0.09);
    chance += Math.min(0.12, (floor || 1) * 0.004) + diffTier * 0.015;
    if ((monster.affixKeys || []).length >= 2) chance += 0.08;
    if (Math.random() >= chance) return;
    const pool = Object.keys(TSR_MONSTER_MUTATIONS).filter(k => {
        const m = TSR_MONSTER_MUTATIONS[k];
        if (m.eliteOnly && !isElite && !isBoss) return false;
        if (m.bossOnly && !isBoss) return false;
        return (m.weight || 0) > 0;
    });
    if (!pool.length) return;
    const weights = pool.map(k => TSR_MONSTER_MUTATIONS[k].weight || 1);
    let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
    let pick = pool[pool.length - 1];
    for (let i = 0; i < pool.length; i++) {
        roll -= weights[i];
        if (roll <= 0) { pick = pool[i]; break; }
    }
    monster.mutationKey = pick;
    const mut = TSR_MONSTER_MUTATIONS[pick];
    if (mut.lifeProfile && !monster.lifeProfileKey) monster.lifeProfileKey = mut.lifeProfile;
}

function rollTsrMonsterLifeProfile(monster, isBoss, isElite, floor) {
    if (!monster || monster.lifeProfileKey) return;
    if (monster.lifeProfile) {
        monster.lifeProfileKey = monster.lifeProfile;
        return;
    }
    const mut = getTsrMonsterMutationDef(monster);
    if (mut?.lifeProfile) {
        monster.lifeProfileKey = mut.lifeProfile;
        return;
    }
    const diffTier = typeof getTsrDifficultyTier === 'function' ? getTsrDifficultyTier() : 0;
    let roll = Math.random();
    if (isBoss) {
        if (roll < 0.28 + diffTier * 0.02) monster.lifeProfileKey = 'quad';
        else if (roll < 0.58) monster.lifeProfileKey = 'triple';
        else if (roll < 0.82) monster.lifeProfileKey = 'dual';
    } else if (isElite) {
        if (roll < 0.12 + diffTier * 0.015) monster.lifeProfileKey = 'triple';
        else if (roll < 0.38) monster.lifeProfileKey = 'dual';
        else if (roll < 0.48) monster.lifeProfileKey = 'hydra';
    } else if (floor >= 10 && roll < 0.06) {
        monster.lifeProfileKey = 'dual';
    }
}

function applyTsrMonsterMutationToStats(stats, monster) {
    if (!stats || !monster) return stats;
    const mut = getTsrMonsterMutationDef(monster);
    if (!mut) return stats;
    let hpMult = 1 + (mut.hpMult || 0);
    let atkMult = 1 + (mut.atkMult || 0);
    return {
        ...stats,
        hp: Math.max(1, Math.floor(stats.hp * hpMult)),
        atk: Math.max(1, Math.floor(stats.atk * atkMult))
    };
}

function getTsrMonsterMutationAffixEffects(monster) {
    const mut = getTsrMonsterMutationDef(monster);
    if (!mut) return [];
    return [mut];
}

function formatTsrMonsterMutationHtml(monster) {
    const mut = getTsrMonsterMutationDef(monster);
    if (!mut) return '';
    return `<span class="tsr-monster-mutation-tag" title="${mut.desc}">${mut.icon}${mut.name}</span>`;
}

function formatTsrMonsterLifeHtml(monster) {
    const profile = getTsrMonsterLifeProfile(monster);
    if (!profile) return '';
    const tsr = player?.timeSecretRealm;
    const stage = tsr?.currentRun?.monsterLifeStage || 1;
    const dots = Array.from({ length: profile.stages }, (_, i) => {
        const idx = i + 1;
        let cls = 'tsr-life-pip';
        if (idx < stage) cls += ' tsr-life-pip-dead';
        else if (idx === stage) cls += ' tsr-life-pip-active';
        return `<span class="${cls}"></span>`;
    }).join('');
    return `<span class="tsr-monster-life-bar" title="多段生命 ${stage}/${profile.stages}">${dots}<span class="tsr-life-label">命${stage}/${profile.stages}</span></span>`;
}

function initTsrMonsterLifeBattle(monster, stats, isBoss, isElite) {
    const tsr = player?.timeSecretRealm;
    if (!tsr?.currentRun || !monster) return stats;
    // 挑战模式开局无构筑，且战斗上限约12回合：多段生命几乎必超时判负，表现为「一进就失败」
    const challenge = typeof isTsrChallengeRun === 'function'
        ? isTsrChallengeRun(tsr.currentRun)
        : !!(tsr.currentRun.isBossRush || tsr.currentRun.isWeeklyBoss || tsr.currentRun.isTrialTower);
    if (challenge) {
        delete monster.lifeProfileKey;
        delete monster.lifeProfile;
        delete monster.mutationKey;
        delete monster.mutation;
    } else {
        rollTsrMonsterMutation(monster, isBoss, isElite, tsr.currentRun.currentFloor);
        rollTsrMonsterLifeProfile(monster, isBoss, isElite, tsr.currentRun.currentFloor);
    }
    const profile = challenge ? null : getTsrMonsterLifeProfile(monster);
    const mut = challenge ? null : getTsrMonsterMutationDef(monster);
    tsr.currentRun.monsterLifeStage = 1;
    tsr.currentRun.monsterLifeBase = { hp: stats.hp, atk: stats.atk };
    tsr.currentRun.monsterLifeRewardBonus = (profile?.rewardBonus || 0) + (mut?.rewardMult || 0) * 0.5;
    if (profile) {
        tsr.currentRun.monsterLifeStagesMax = profile.stages;
        addTsrLog(`🧬 多段生命：${monster.displayName || monster.name}拥有${profile.stages}段生命`, 'warning');
    }
    if (mut) {
        addTsrLog(`🧬 变异觉醒：【${mut.icon}${mut.name}】${mut.desc}`, 'warning');
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.mutationsSeen = (tsr.lifetimeStats.mutationsSeen || 0) + 1;
    }
    if (mut?.startShield) {
        tsr.currentRun.monsterShield = Math.max(tsr.currentRun.monsterShield || 0, mut.startShield);
    }
    return stats;
}

function onTsrMonsterHpReachedZero(monster, ctx) {
    const tsr = player?.timeSecretRealm;
    if (!tsr?.currentRun || !monster) return null;
    const profile = getTsrMonsterLifeProfile(monster);
    if (!profile) return null;
    const stage = tsr.currentRun.monsterLifeStage || 1;
    if (stage >= profile.stages) return null;

    const nextStage = stage + 1;
    const nextIdx = nextStage - 1;
    const base = tsr.currentRun.monsterLifeBase || { hp: ctx.monsterMaxHp, atk: ctx.monsterAtk };
    const newHp = Math.max(1, Math.floor(base.hp * (profile.hpRatio[nextIdx] || 0.7)));
    const newAtk = Math.max(1, Math.floor(base.atk * (profile.atkRatio[nextIdx] || 1.1)));

    tsr.currentRun.monsterLifeStage = nextStage;
    tsr.currentRun.monsterPhaseCounterBonus = (tsr.currentRun.monsterPhaseCounterBonus || 0) + 0.1 * stage;
    tsr.currentRun.monsterShield = Math.min(0.42, (tsr.currentRun.monsterShield || 0) + 0.05 + stage * 0.02);
    tsr.currentRun.monsterDodgeNext = stage >= 2 && Math.random() < 0.35;

    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.monsterLifeRevivesSeen = (tsr.lifetimeStats.monsterLifeRevivesSeen || 0) + 1;

    const label = profile.labels[nextIdx] || `第${nextStage}命`;
    const mutName = getTsrMonsterMutationDef(monster)?.name || '变异体';
    addTsrLog(`🧬【${mutName}】${monster.displayName || monster.name}进入「${label}」！${profile.reviveLog || '生命重整'}`, 'warning');

    if (nextStage >= 3 && (ctx.isBoss || monster.tier === 'mythic')) {
        tsr.currentRun.reachedBossPhase3 = true;
    }

    if (typeof pushTsrFeelEvent === 'function') {
        pushTsrFeelEvent({
            type: 'revive',
            label: `🧬 ${label}`,
            lifeStage: nextStage,
            monsterHp: newHp,
            monsterMaxHp: newHp,
            isBoss: !!ctx.isBoss,
            isElite: !!ctx.isElite
        });
    }

    // sync 阶段不立刻改横幅，交给演出回放刷新血条/命段
    if (!tsr.currentRun.deferBattleLogs && typeof updateTsrMonsterBanner === 'function') {
        updateTsrMonsterBanner(monster, { hp: newHp, atk: newAtk }, ctx.isBoss, ctx.isElite);
    }

    return { monsterHp: newHp, monsterMaxHp: newHp, monsterAtk: newAtk };
}

function checkTsrMonsterMutationAchievements() {
    const tsr = player?.timeSecretRealm;
    if (!tsr) return;
    const ls = tsr.lifetimeStats || {};
    const unlock = (id) => { if (typeof unlockTsrAchievement === 'function') unlockTsrAchievement(id); };
    if ((ls.mutationKills || 0) >= 10) unlock('mutationKill10');
    if ((ls.multiLifeKills || 0) >= 5) unlock('multiLifeWin5');
    if ((ls.triLifeBossKills || 0) >= 1) unlock('triLifeBoss1');
    if ((ls.monsterLifeRevivesSeen || 0) >= 20) unlock('lifeRevive20');
}

function trackTsrMonsterMutationVictory(monster) {
    const tsr = player?.timeSecretRealm;
    if (!tsr || !monster) return;
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    const ls = tsr.lifetimeStats;
    if (monster.mutationKey) ls.mutationKills = (ls.mutationKills || 0) + 1;
    const profile = getTsrMonsterLifeProfile(monster);
    if (profile && profile.stages > 1) {
        ls.multiLifeKills = (ls.multiLifeKills || 0) + 1;
        if (profile.stages >= 3 && (tsr.currentRun?.currentRoom?.isBoss || tsr.currentRun?.currentRoom?.type === 'boss')) {
            ls.triLifeBossKills = (ls.triLifeBossKills || 0) + 1;
        }
    }
    const bonus = tsr.currentRun?.monsterLifeRewardBonus || 0;
    if (bonus > 0 && tsr.currentRun?.currentRoom?.rewards) {
        const extra = Math.floor((tsr.currentRun.currentRoom.rewards.currency || 0) * bonus * (tsr.currentRun.difficultyMultiplier || 1));
        if (extra > 0) {
            addTsrRunCurrency(extra);
            addTsrLog(`多段生命赏金+${extra}秘境币`, 'success');
        }
    }
    checkTsrMonsterMutationAchievements();
}

function initTsrMonsterMutationExtensions() {
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_MONSTER_MUTATION_POOL.battle);
        TSR_MONSTER_POOL.elite.push(...TSR_MONSTER_MUTATION_POOL.elite);
        TSR_MONSTER_POOL.boss.push(...TSR_MONSTER_MUTATION_POOL.boss);
    }
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') {
        TSR_ACHIEVEMENTS.push(...TSR_MONSTER_MUTATION_ACHIEVEMENTS);
    }

    if (typeof applyTsrMonsterAffixToStats === 'function' && !applyTsrMonsterAffixToStats.__tsrMutPatched) {
        const _origStats = applyTsrMonsterAffixToStats;
        applyTsrMonsterAffixToStats = function (stats, monster) {
            return applyTsrMonsterMutationToStats(_origStats(stats, monster), monster);
        };
        applyTsrMonsterAffixToStats.__tsrMutPatched = true;
    }

    if (typeof getTsrMonsterAffixList === 'function' && !getTsrMonsterAffixList.__tsrMutPatched) {
        const _origList = getTsrMonsterAffixList;
        getTsrMonsterAffixList = function (monster) {
            const base = _origList(monster);
            const mutFx = getTsrMonsterMutationAffixEffects(monster);
            return mutFx.length ? base.concat(mutFx) : base;
        };
        getTsrMonsterAffixList.__tsrMutPatched = true;
    }

    if (typeof getTsrMonsterAffixRewardMult === 'function' && !getTsrMonsterAffixRewardMult.__tsrMutPatched) {
        const _origReward = getTsrMonsterAffixRewardMult;
        getTsrMonsterAffixRewardMult = function (monster) {
            let mult = _origReward(monster);
            const mut = getTsrMonsterMutationDef(monster);
            if (mut?.rewardMult) mult += mut.rewardMult;
            const profile = getTsrMonsterLifeProfile(monster);
            if (profile?.rewardBonus) mult += profile.rewardBonus;
            return mult;
        };
        getTsrMonsterAffixRewardMult.__tsrMutPatched = true;
    }

    if (typeof ensureTsrMonsterAffixes === 'function' && !ensureTsrMonsterAffixes.__tsrMutPatched) {
        const _origEnsure = ensureTsrMonsterAffixes;
        ensureTsrMonsterAffixes = function (monster, opts) {
            const r = _origEnsure(monster, opts);
            if (monster) {
                rollTsrMonsterMutation(monster, !!opts?.isBoss, !!opts?.isElite, opts?.floor || 1);
                rollTsrMonsterLifeProfile(monster, !!opts?.isBoss, !!opts?.isElite, opts?.floor || 1);
            }
            return r;
        };
        ensureTsrMonsterAffixes.__tsrMutPatched = true;
    }

    if (typeof updateTsrMonsterBanner === 'function' && !updateTsrMonsterBanner.__tsrMutPatched) {
        const _origBanner = updateTsrMonsterBanner;
        updateTsrMonsterBanner = function (monster, stats, isBoss, isElite) {
            _origBanner(monster, stats, isBoss, isElite);
            const banner = document.getElementById('tsrMonsterBanner');
            if (!banner || !monster) return;
            const left = banner.querySelector('.tsr-monster-banner-left');
            if (!left) return;
            const mutHtml = formatTsrMonsterMutationHtml(monster);
            if (mutHtml && !left.querySelector('.tsr-monster-mutation-tag')) {
                left.insertAdjacentHTML('beforeend', mutHtml);
            }
            const lifeEl = left.querySelector('.tsr-monster-life-bar');
            const lifeHtml = formatTsrMonsterLifeHtml(monster);
            if (lifeHtml) {
                if (lifeEl) lifeEl.outerHTML = lifeHtml;
                else left.insertAdjacentHTML('beforeend', lifeHtml);
            }
        };
        updateTsrMonsterBanner.__tsrMutPatched = true;
    }

    if (typeof resetTsrBattleTransientState === 'function' && !resetTsrBattleTransientState.__tsrMutPatched) {
        const _origReset = resetTsrBattleTransientState;
        resetTsrBattleTransientState = function () {
            _origReset();
            const tsr = player?.timeSecretRealm;
            if (tsr?.currentRun) {
                tsr.currentRun.monsterLifeStage = 0;
                tsr.currentRun.monsterLifeBase = null;
                tsr.currentRun.monsterLifeRewardBonus = 0;
                tsr.currentRun.monsterLifeStagesMax = 0;
            }
        };
        resetTsrBattleTransientState.__tsrMutPatched = true;
    }

    if (typeof checkTsrAchievements === 'function' && !checkTsrAchievements.__tsrMutPatched) {
        const _origAch = checkTsrAchievements;
        checkTsrAchievements = function (ctx) {
            _origAch(ctx);
            checkTsrMonsterMutationAchievements();
        };
        checkTsrAchievements.__tsrMutPatched = true;
    }
}

initTsrMonsterMutationExtensions();

function onTsrMonsterBattleVictory(monster) {
    trackTsrMonsterMutationVictory(monster);
}

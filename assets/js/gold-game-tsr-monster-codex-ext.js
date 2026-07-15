/**
 * 时光秘境 · 怪物变异图鉴 / 特殊房 / 命格熔炉 / 变异狩猎
 */
const TSR_MONSTER_CODEX_MUTATIONS = {
    crystalline: { id: 'crystalline', name: '结晶化', icon: '💎', desc: '生命+18%，护盾脉冲+8%', hpMult: 0.18, shieldPulse: 0.08, shieldEvery: 4, weight: 6 },
    parasitic: { id: 'parasitic', name: '寄生化', icon: '🪱', desc: '每3回合吸血自愈，攻击+10%', atkMult: 0.1, regenPct: 0.04, regenEvery: 3, weight: 5 },
    radioactive: { id: 'radioactive', name: '辐射化', icon: '☢️', desc: '每4回合灾变5%，赏金+15%', cataclysmEvery: 4, cataclysmPct: 0.05, rewardMult: 0.15, weight: 4, eliteOnly: true },
    echoform: { id: 'echoform', name: '回响体', icon: '🔊', desc: '每3回合回响5%，反击+10%', echoEvery: 3, echoDmgPct: 0.05, counterMult: 0.1, weight: 5 },
    timeloop: { id: 'timeloop', name: '时环化', icon: '🔁', desc: '三段生命，每3回合窃时2秒', timeDrain: 2, timeDrainEvery: 3, lifeProfile: 'triple', weight: 3, bossOnly: true },
    apex: { id: 'apex', name: '顶点化', icon: '🔺', desc: '首领五段生命，攻击渐强', lifeProfile: 'pent', rewardMult: 0.2, bossOnly: true, weight: 2 },
    symbiote: { id: 'symbiote', name: '共生化', icon: '🧬', desc: '双段生命，每3回合血契4%', lifeProfile: 'dual', bloodPactEvery: 3, bloodPactRegen: 0.04, bloodPactDmg: 0.03, weight: 4 },
    nullify: { id: 'nullify', name: '归零化', icon: '⭕', desc: '每4回合禁疗10%×2，攻击+14%', healBlockEvery: 4, healBlockValue: 0.1, healBlockDuration: 2, atkMult: 0.14, weight: 4 }
};

const TSR_MONSTER_CODEX_LIFE_PROFILES = {
    pent: {
        stages: 5,
        hpRatio: [1, 0.58, 0.48, 0.4, 0.35],
        atkRatio: [1, 1.1, 1.16, 1.22, 1.32],
        labels: ['原初', '裂变', '畸变', '狂乱', '神灭'],
        rewardBonus: 0.55,
        bossOnly: true,
        reviveLog: '命格崩解又重组，仿佛从未受过伤',
        reviveBurst: 0.04
    },
    phoenix: {
        stages: 3,
        hpRatio: [1, 0.5, 0.85],
        atkRatio: [1, 1.2, 1.05],
        labels: ['焰羽', '灰烬', '涅槃'],
        rewardBonus: 0.35,
        reviveLog: '灰烬中升起新的羽翼',
        onFinalReviveHeal: 0.08
    }
};

const TSR_MUTATION_LIFE_SYNERGIES = [
    { mutation: 'hydra', life: 'hydra', name: '九头再生', icon: '🐍', counterBonus: 0.12, desc: '九头+九命：反击+12%' },
    { mutation: 'immortal', life: 'quad', name: '不朽不灭', icon: '♾️', rewardBonus: 0.2, desc: '不朽+四命：赏金+20%' },
    { mutation: 'split', life: 'dual', name: '分裂双生', icon: '🧫', hpMult: 0.08, desc: '分裂+双命：生命+8%' },
    { mutation: 'chronos', life: 'triple', name: '时序三重', icon: '⏳', timeDrain: 1, desc: '时序+三命：每回合额外窃时1秒' },
    { mutation: 'nova', life: 'triple', name: '新星三连', icon: '☄️', starfallPct: 0.02, desc: '新星+三命：星陨+2%' },
    { mutation: 'apex', life: 'pent', name: '顶点神灭', icon: '🔺', counterBonus: 0.18, desc: '顶点+五命：反击+18%' },
    { mutation: 'symbiote', life: 'dual', name: '共生双体', icon: '🧬', regenPct: 0.02, desc: '共生+双命：每3回合额外自愈2%' },
    { mutation: 'timeloop', life: 'triple', name: '时环闭环', icon: '🔁', shieldPulse: 0.05, desc: '时环+三命：转段展开5%护盾' }
];

const TSR_MONSTER_CODEX_POOL = {
    battle: [
        { id: 'crystalmite', name: '结晶螨', icon: '💎', tier: 'rare', mutation: 'crystalline', intro: '「硬？那是我的皮肤。」', win: '螨碎成一地晶粉。', skill: 'shield', skillChance: 0.24, skillValue: 0.1 },
        { id: 'parasitepod', name: '寄生荚', icon: '🪱', tier: 'uncommon', mutation: 'parasitic', lifeProfile: 'dual', intro: '「你打的是我，喂的是我。」', win: '荚被强制脱落。', skill: 'vampiric', skillChance: 0.22, skillValue: 0.1 }
    ],
    elite: [
        { id: 'radioactivecol', name: '辐射殖民体', icon: '☢️', tier: 'legendary', mutation: 'radioactive', lifeProfile: 'triple', intro: '「辐射不是污染，是进化。」', win: '殖民体铅棺封存。', skill: 'overloadStrike', skillChance: 0.34 },
        { id: 'echoknight', name: '回响骑士', icon: '🔊', tier: 'epic', mutation: 'echoform', intro: '「你听到的伤害，是回音。」', win: '骑士回声消散。', skill: 'resonanceBurst', skillChance: 0.3, skillValue: 0.05 },
        { id: 'symbiotehost', name: '共生宿主', icon: '🧬', tier: 'mythic', mutation: 'symbiote', lifeProfile: 'dual', intro: '「我们是一体的——字面意思。」', win: '宿主与共生体分离。', skill: 'soulBind', skillChance: 0.36, skillValue: 0.16 }
    ],
    boss: [
        { id: 'apexdevourer', name: '顶点吞噬者', icon: '🔺', tier: 'mythic', mutation: 'apex', lifeProfile: 'pent', intro: '「五段生命，一段比一段离谱。」', win: '吞噬者被顶点封印。', skill: 'affixStorm', skillChance: 0.44 },
        { id: 'phoenixlord', name: '涅槃领主', icon: '🔥', tier: 'mythic', mutation: 'blazing', lifeProfile: 'phoenix', intro: '「灰烬只是中场休息。」', win: '领主涅槃失败。', skill: 'tidalWave', skillChance: 0.4 },
        { id: 'timeloopgod', name: '时环古神', icon: '🔁', tier: 'mythic', mutation: 'timeloop', lifeProfile: 'triple', intro: '「这段你已经打过了——在上一圈。」', win: '古神时环断裂。', skill: 'timeDrain', skillChance: 0.42, skillValue: 8 }
    ]
};

const TSR_MONSTER_CODEX_CONSUMABLES = {
    mutationSerum: { name: '变异血清', icon: '🧪', effect: 'mutationSerum', value: 1, desc: '下一场战斗怪物必定觉醒变异' },
    lifeAnchor: { name: '命格锚石', icon: '⚓', effect: 'lifeAnchor', value: 1, desc: '下一场战斗怪物必定获得多段生命' },
    mutationLens: { name: '变异透镜', icon: '🔬', effect: 'mutationLens', value: 1, desc: '揭示变异+命格，本场变异赏金+20%' }
};

const TSR_MONSTER_CODEX_RELIC = {
    mutationCodex: { name: '变异图鉴', icon: '📗', desc: '变异赏金+12%，多命赏金+8%', effect: 'affixReward', value: 0.12, bonus: { effect: 'eliteCurrency', value: 0.08 } }
};

const TSR_MONSTER_CODEX_SPECIAL_ROOMS = ['mutationlab', 'mutationhunt', 'lifeforge'];

const TSR_MONSTER_CODEX_ROOM_META = {
    mutationlab: { name: '变异实验室', icon: '🧪', color: '#4ade80' },
    mutationhunt: { name: '变异狩猎场', icon: '🏹', color: '#22c55e' },
    lifeforge: { name: '命格熔炉', icon: '⚗️', color: '#f97316' }
};

const TSR_MONSTER_CODEX_ACHIEVEMENTS = [
    { id: 'mutationCodex8', name: '变异学者', desc: '图鉴收录8种变异', icon: '📗', need: { mutationCodexCount: 8 } },
    { id: 'multiLifeWin15', name: '命格粉碎者', desc: '击败15只多段生命怪物', icon: '💀', need: { multiLifeKills: 15 } },
    { id: 'pentLifeBoss1', name: '五命斩首', desc: '击败一只五段生命首领', icon: '🔺', need: { pentLifeBossKills: 1 } },
    { id: 'mutationRoom10', name: '实验室常客', desc: '进入10次变异相关特殊房', icon: '🧪', need: { mutationRooms: 10 } }
];

function getTsrMutationLifeSynergies(monster) {
    if (!monster?.mutationKey || !monster?.lifeProfileKey) return [];
    return TSR_MUTATION_LIFE_SYNERGIES.filter(s =>
        s.mutation === monster.mutationKey && s.life === monster.lifeProfileKey
    );
}

function formatTsrMutationLifeSynergyHtml(monster) {
    const syn = getTsrMutationLifeSynergies(monster);
    if (!syn.length) return '';
    return `<span class="tsr-mut-life-synergy">${syn.map(s =>
        `<span class="tsr-mut-life-syn-tag" title="${s.desc}">${s.icon}${s.name}</span>`
    ).join('')}</span>`;
}

function recordTsrMonsterMutationCodex(mutationKey) {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return;
    const tsr = player?.timeSecretRealm;
    if (!tsr || !mutationKey) return;
    if (!tsr.codex) tsr.codex = { rooms: {}, relics: {}, elites: 0, gambles: 0 };
    if (!tsr.codex.mutations) tsr.codex.mutations = {};
    tsr.codex.mutations[mutationKey] = (tsr.codex.mutations[mutationKey] || 0) + 1;
    invalidateTsrUiCache?.('codex');
}

function recordTsrMonsterLifeCodex(lifeKey) {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return;
    const tsr = player?.timeSecretRealm;
    if (!tsr || !lifeKey) return;
    if (!tsr.codex) tsr.codex = { rooms: {}, relics: {}, elites: 0, gambles: 0 };
    if (!tsr.codex.lifeProfiles) tsr.codex.lifeProfiles = {};
    tsr.codex.lifeProfiles[lifeKey] = (tsr.codex.lifeProfiles[lifeKey] || 0) + 1;
    invalidateTsrUiCache?.('codex');
}

function forceTsrMonsterMutation(monster, isBoss, isElite) {
    if (!monster || monster.mutationKey) return;
    const pool = Object.keys(TSR_MONSTER_MUTATIONS).filter(k => {
        const m = TSR_MONSTER_MUTATIONS[k];
        if (m.eliteOnly && !isElite && !isBoss) return false;
        if (m.bossOnly && !isBoss) return false;
        return (m.weight || 0) > 0;
    });
    if (!pool.length) return;
    monster.mutationKey = pool[Math.floor(Math.random() * pool.length)];
    const mut = TSR_MONSTER_MUTATIONS[monster.mutationKey];
    if (mut?.lifeProfile && !monster.lifeProfileKey) monster.lifeProfileKey = mut.lifeProfile;
}

function forceTsrMonsterLifeProfile(monster, isBoss, isElite, minStages) {
    if (!monster) return;
    const candidates = Object.entries(TSR_MONSTER_LIFE_PROFILES)
        .filter(([, p]) => {
            if (p.bossOnly && !isBoss) return false;
            if (minStages && p.stages < minStages) return false;
            return true;
        })
        .sort((a, b) => b[1].stages - a[1].stages);
    if (!candidates.length) return;
    const pick = minStages >= 4 && isBoss
        ? (candidates.find(([k]) => k === 'pent' || k === 'quad') || candidates[0])
        : candidates[Math.floor(Math.random() * Math.min(3, candidates.length))];
    monster.lifeProfileKey = pick[0];
}

function applyTsrMutationLifeSynergyToStats(stats, monster) {
    if (!stats || !monster) return stats;
    let hpMult = 1;
    let atkMult = 1;
    getTsrMutationLifeSynergies(monster).forEach(s => { hpMult += s.hpMult || 0; atkMult += s.atkMult || 0; });
    return {
        ...stats,
        hp: Math.max(1, Math.floor(stats.hp * hpMult)),
        atk: Math.max(1, Math.floor(stats.atk * atkMult))
    };
}

function getTsrMutationLifeSynergyRewardBonus(monster) {
    return getTsrMutationLifeSynergies(monster).reduce((s, syn) => s + (syn.rewardBonus || 0), 0);
}

function getTsrMutationLifeSynergyCounterBonus(monster) {
    return getTsrMutationLifeSynergies(monster).reduce((s, syn) => s + (syn.counterBonus || 0), 0);
}

function applyTsrMutationLifeSynergyRound(monster, rounds, monsterHp, monsterMaxHp) {
    const tsr = player?.timeSecretRealm;
    if (!tsr?.currentRun || !monster) return monsterHp;
    let hp = monsterHp;
    getTsrMutationLifeSynergies(monster).forEach(syn => {
        if (syn.timeDrain && rounds % 2 === 0) {
            tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - syn.timeDrain);
            addTsrLog(`🧬【${syn.name}】额外窃时${syn.timeDrain}秒`, 'warning');
        }
        if (syn.starfallPct && rounds % 4 === 0) {
            applyDamage(bMul(tsr.currentRun.playerHealth, syn.starfallPct));
            addTsrLog(`🧬【${syn.name}】追加星陨${Math.floor(syn.starfallPct * 100)}%`, 'error');
        }
        if (syn.regenPct && rounds % 3 === 0 && hp > 0) {
            const heal = Math.floor(monsterMaxHp * syn.regenPct);
            hp += heal;
            addTsrLog(`🧬【${syn.name}】共生自愈+${formatTsrCombatNum(heal)}`, 'warning');
        }
        if (syn.shieldPulse && rounds % 4 === 0) {
            tsr.currentRun.monsterShield = Math.min(0.5, (tsr.currentRun.monsterShield || 0) + syn.shieldPulse);
            addTsrLog(`🧬【${syn.name}】命格护盾展开`, 'warning');
        }
    });
    return hp;
}

function handleMutationlabRoom() {
    const tsr = player.timeSecretRealm;
    const codexCount = Object.keys(tsr.codex?.mutations || {}).length;
    showTsrMemePanel('🧪 变异实验室', `培养槽里浮着未定型黏液。已收录变异 <strong>${codexCount}</strong> 种。`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseMutationLab('inject')">注射血清 · -14秒 下战必变异</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseMutationLab('study')">变异研习 · -10秒 图鉴+1 充能+20</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseMutationLab('fight')">活体实验 · 变异精英战</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('变异实验室：空气里有股甜腥味', 'info');
}

function tsrChooseMutationLab(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'mutationlab' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const floor = tsr.currentRun.currentFloor;
    if (path === 'inject') {
        if (tsr.currentRun.timeLeft <= 16) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 14;
        tsr.currentRun.nextBattleForceMutation = true;
        addTsrConsumable('mutationSerum');
        addTsrLog('注射变异血清！下一场战斗怪物必定觉醒变异', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'study') {
        if (tsr.currentRun.timeLeft <= 12) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 10;
        const keys = Object.keys(TSR_MONSTER_MUTATIONS);
        const k = keys[Math.floor(Math.random() * keys.length)];
        recordTsrMonsterMutationCodex(k);
        chargeTsrSpirit(20);
        tsr.currentRun.mutationRewardBonus = (tsr.currentRun.mutationRewardBonus || 0) + 0.12;
        addTsrLog(`变异研习！【${TSR_MONSTER_MUTATIONS[k]?.name || k}】录入图鉴，充能+20`, 'success');
        checkTsrMonsterCodexAchievements();
        finishTsrMemeRoom();
        return;
    }
    if (path === 'fight') {
        const monster = pickTsrMonster(false, true, floor, dm);
        ensureTsrMonsterAffixes(monster, { isElite: true, floor });
        forceTsrMonsterMutation(monster, false, true);
        forceTsrMonsterLifeProfile(monster, false, true, 2);
        room.monster = monster;
        room.isElite = true;
        room.rewards = generateRoomRewards('elite', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.65);
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        if (Math.random() < 0.45) addTsrConsumable('mutationSerum');
        addTsrLog('活体实验完成！', 'success');
        afterAction();
        return;
    }
    finishTsrMemeRoom();
}

function handleMutationhuntRoom() {
    const tsr = player.timeSecretRealm;
    const target = tsr.currentRun.huntTarget || pickTsrMonster(false, true, tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
    tsr.currentRun.huntTarget = target;
    ensureTsrMonsterAffixes(target, { isElite: true, floor: tsr.currentRun.currentFloor });
    forceTsrMonsterMutation(target, false, true);
    const mutName = getTsrMonsterMutationDef(target)?.name || '未知变异';
    const multiBtn = (tsr.lifetimeStats?.multiLifeKills || 0) >= 3
        ? `<button type="button" class="tsr-btn tsr-btn-purple" data-tsr-life-hunt onclick="tsrChooseMutationHunt('life')">命格狩猎 · 三命精英战</button>` : '';
    showTsrMemePanel('🏹 变异狩猎场', `悬赏：${formatTsrMonsterNameHtml(target)}<br>变异：<strong>${mutName}</strong><br>「专猎觉醒者，赏金丰厚。」`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseMutationHunt('fight')">变异狩猎 · 变异精英战</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseMutationHunt('study')">变异追踪 · -12秒 图鉴+1</button>
         ${multiBtn}
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('变异狩猎场：布告栏上全是变异特征速写', 'info');
}

function tsrChooseMutationHunt(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'mutationhunt' || !room.explored) return;
    const target = tsr.currentRun.huntTarget || pickTsrMonster(false, true, tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
    tsr.currentRun.huntTarget = null;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const floor = tsr.currentRun.currentFloor;
    if (path === 'fight') {
        ensureTsrMonsterAffixes(target, { isElite: true, floor });
        forceTsrMonsterMutation(target, false, true);
        while ((target.affixKeys || []).length < 2) {
            const extra = rollTsrMonsterAffixKeys(target, false, true, floor).filter(k => !(target.affixKeys || []).includes(k));
            if (!extra.length) break;
            target.affixKeys.push(extra[0]);
        }
        room.monster = target;
        room.isElite = true;
        room.rewards = generateRoomRewards('elite', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.75);
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        if (Math.random() < 0.4) addTsrConsumable('mutationLens');
        addTsrLog('变异狩猎完成！', 'success');
        afterAction();
        return;
    }
    if (path === 'life') {
        ensureTsrMonsterAffixes(target, { isElite: true, floor });
        forceTsrMonsterMutation(target, false, true);
        forceTsrMonsterLifeProfile(target, false, true, 3);
        room.monster = target;
        room.isElite = true;
        room.isLifeHunt = true;
        room.rewards = generateRoomRewards('elite', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 2);
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        if (Math.random() < 0.35) addTsrConsumable('lifeAnchor');
        addTsrLog('命格狩猎完成！', 'success');
        afterAction();
        return;
    }
    if (path === 'study') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        if (target.mutationKey) recordTsrMonsterMutationCodex(target.mutationKey);
        recordTsrMonsterAffixCodex(target.affixKeys || []);
        tsr.currentRun.mutationRewardBonus = (tsr.currentRun.mutationRewardBonus || 0) + 0.18;
        chargeTsrSpirit(12);
        addTsrLog('变异追踪完成！图鉴收录，变异赏金+18%', 'success');
        checkTsrMonsterCodexAchievements();
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleLifeforgeRoom() {
    const tsr = player.timeSecretRealm;
    const lifeCount = Object.keys(tsr.codex?.lifeProfiles || {}).length;
    const bossBtn = (tsr.lifetimeStats?.mutationKills || 0) >= 8
        ? `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseLifeForge('boss')">熔铸首领 · 五命首领战</button>` : '';
    showTsrMemePanel('⚗️ 命格熔炉', `熔炉中翻滚着赤色命格铭文。已收录命格 <strong>${lifeCount}</strong> 种。`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseLifeForge('anchor')">锚定命格 · -16秒 下战必多命</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseLifeForge('temper')">淬炼 · -12秒 回血15% 转段伤害-5%</button>
         ${bossBtn}
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('命格熔炉：热浪灼面，铭文噼啪作响', 'info');
}

function tsrChooseLifeForge(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'lifeforge' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const floor = tsr.currentRun.currentFloor;
    if (path === 'anchor') {
        if (tsr.currentRun.timeLeft <= 18) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 16;
        tsr.currentRun.nextBattleForceLife = true;
        addTsrConsumable('lifeAnchor');
        const k = Object.keys(TSR_MONSTER_LIFE_PROFILES)[Math.floor(Math.random() * Object.keys(TSR_MONSTER_LIFE_PROFILES).length)];
        recordTsrMonsterLifeCodex(k);
        addTsrLog('锚定命格！下一场战斗怪物必定获得多段生命', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'temper') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        tsrHealPlayer(0.15);
        tsr.currentRun.lifeReviveBurstReduce = (tsr.currentRun.lifeReviveBurstReduce || 0) + 0.05;
        tsr.permanentBonuses = tsr.permanentBonuses || {};
        tsr.permanentBonuses.mutationSight = Math.min(0.15, (tsr.permanentBonuses.mutationSight || 0) + 0.01);
        addTsrLog('淬炼完成！回血15%，转段冲击减免5%，永久变异感知+1%', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'boss') {
        const monster = pickTsrMonster(true, false, floor, dm);
        ensureTsrMonsterAffixes(monster, { isBoss: true, floor });
        forceTsrMonsterMutation(monster, true, false);
        forceTsrMonsterLifeProfile(monster, true, false, 5);
        room.monster = monster;
        room.isBoss = true;
        room.type = 'boss';
        room.rewards = generateRoomRewards('boss', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.5);
        handleBattleRoom();
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        addTsrLog('五命首领熔铸战胜利！', 'success');
        afterAction();
        return;
    }
    finishTsrMemeRoom();
}

function checkTsrMonsterCodexAchievements() {
    const tsr = player?.timeSecretRealm;
    if (!tsr) return;
    const ls = tsr.lifetimeStats || {};
    const codexMut = Object.keys(tsr.codex?.mutations || {}).length;
    const unlock = (id) => { if (typeof unlockTsrAchievement === 'function') unlockTsrAchievement(id); };
    if (codexMut >= 8) unlock('mutationCodex8');
    if ((ls.multiLifeKills || 0) >= 15) unlock('multiLifeWin15');
    if ((ls.pentLifeBossKills || 0) >= 1) unlock('pentLifeBoss1');
    if ((ls.mutationRooms || 0) >= 10) unlock('mutationRoom10');
}

function initTsrMonsterCodexExtensions() {
    if (typeof TSR_MONSTER_MUTATIONS !== 'undefined') {
        Object.assign(TSR_MONSTER_MUTATIONS, TSR_MONSTER_CODEX_MUTATIONS);
    }
    if (typeof TSR_MONSTER_LIFE_PROFILES !== 'undefined') {
        Object.assign(TSR_MONSTER_LIFE_PROFILES, TSR_MONSTER_CODEX_LIFE_PROFILES);
    }
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_MONSTER_CODEX_POOL.battle);
        TSR_MONSTER_POOL.elite.push(...TSR_MONSTER_CODEX_POOL.elite);
        TSR_MONSTER_POOL.boss.push(...TSR_MONSTER_CODEX_POOL.boss);
    }
    if (typeof TSR_RUN_CONSUMABLES !== 'undefined') {
        Object.assign(TSR_RUN_CONSUMABLES, TSR_MONSTER_CODEX_CONSUMABLES);
    }
    if (typeof TSR_RELIC_POOL !== 'undefined') {
        Object.assign(TSR_RELIC_POOL, TSR_MONSTER_CODEX_RELIC);
    }
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') {
        TSR_ACHIEVEMENTS.push(...TSR_MONSTER_CODEX_ACHIEVEMENTS);
    }
    if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined') {
        TSR_SPECIAL_ROOM_TYPES.push(...TSR_MONSTER_CODEX_SPECIAL_ROOMS);
    }
    if (typeof TSR_CODEX_ROOMS !== 'undefined') {
        TSR_MONSTER_CODEX_SPECIAL_ROOMS.forEach(key => {
            const meta = TSR_MONSTER_CODEX_ROOM_META[key];
            if (meta && !TSR_CODEX_ROOMS.find(r => r.key === key)) {
                TSR_CODEX_ROOMS.push({ key, name: meta.name, icon: meta.icon });
            }
        });
    }
    if (typeof TSR_CONTENT_ROOM_META !== 'undefined') {
        Object.assign(TSR_CONTENT_ROOM_META, TSR_MONSTER_CODEX_ROOM_META);
    }

    if (typeof getTsrRoomTypeMeta === 'function' && !getTsrRoomTypeMeta.__tsrCodexPatched) {
        const _origMeta = getTsrRoomTypeMeta;
        getTsrRoomTypeMeta = function (type) {
            const meta = _origMeta(type);
            const extra = TSR_MONSTER_CODEX_ROOM_META[type];
            if (!extra) return meta;
            if (meta.name === type || !meta.icon || meta.icon === '📍') {
                return { ...meta, name: extra.name, icon: extra.icon, color: extra.color };
            }
            return meta;
        };
        getTsrRoomTypeMeta.__tsrCodexPatched = true;
    }

    if (typeof handleTsrSpecialRoom === 'function' && !handleTsrSpecialRoom.__tsrCodexPatched) {
        const _origSpecial = handleTsrSpecialRoom;
        handleTsrSpecialRoom = function (type) {
            if (type === 'mutationlab') return handleMutationlabRoom();
            if (type === 'mutationhunt') return handleMutationhuntRoom();
            if (type === 'lifeforge') return handleLifeforgeRoom();
            return _origSpecial(type);
        };
        handleTsrSpecialRoom.__tsrCodexPatched = true;
    }

    if (typeof recordTsrCodex === 'function' && !recordTsrCodex.__tsrCodexPatched) {
        const _origCodex = recordTsrCodex;
        recordTsrCodex = function (roomType) {
            _origCodex(roomType);
            if (TSR_MONSTER_CODEX_SPECIAL_ROOMS.includes(roomType)) {
                const tsr = player?.timeSecretRealm;
                if (!tsr?.lifetimeStats) tsr.lifetimeStats = {};
                tsr.lifetimeStats.mutationRooms = (tsr.lifetimeStats.mutationRooms || 0) + 1;
                checkTsrMonsterCodexAchievements();
            }
        };
        recordTsrCodex.__tsrCodexPatched = true;
    }

    if (typeof rollTsrMonsterMutation === 'function' && !rollTsrMonsterMutation.__tsrCodexPatched) {
        const _origRoll = rollTsrMonsterMutation;
        rollTsrMonsterMutation = function (monster, isBoss, isElite, floor) {
            const tsr = player?.timeSecretRealm;
            if (tsr?.currentRun?.nextBattleForceMutation && monster && !monster.mutationKey) {
                forceTsrMonsterMutation(monster, isBoss, isElite);
                tsr.currentRun.nextBattleForceMutation = false;
                return;
            }
            const sight = tsr?.permanentBonuses?.mutationSight || 0;
            if (monster && !monster.mutationKey && sight > 0 && Math.random() < sight) {
                forceTsrMonsterMutation(monster, isBoss, isElite);
                return;
            }
            return _origRoll(monster, isBoss, isElite, floor);
        };
        rollTsrMonsterMutation.__tsrCodexPatched = true;
    }

    if (typeof rollTsrMonsterLifeProfile === 'function' && !rollTsrMonsterLifeProfile.__tsrCodexPatched) {
        const _origLife = rollTsrMonsterLifeProfile;
        rollTsrMonsterLifeProfile = function (monster, isBoss, isElite, floor) {
            const tsr = player?.timeSecretRealm;
            if (tsr?.currentRun?.nextBattleForceLife && monster && !monster.lifeProfileKey) {
                forceTsrMonsterLifeProfile(monster, isBoss, isElite, isBoss ? 3 : 2);
                tsr.currentRun.nextBattleForceLife = false;
                return;
            }
            return _origLife(monster, isBoss, isElite, floor);
        };
        rollTsrMonsterLifeProfile.__tsrCodexPatched = true;
    }

    if (typeof initTsrMonsterLifeBattle === 'function' && !initTsrMonsterLifeBattle.__tsrCodexPatched) {
        const _origInit = initTsrMonsterLifeBattle;
        initTsrMonsterLifeBattle = function (monster, stats, isBoss, isElite) {
            const r = _origInit(monster, stats, isBoss, isElite);
            const tsr = player?.timeSecretRealm;
            if (monster?.mutationKey) recordTsrMonsterMutationCodex(monster.mutationKey);
            if (monster?.lifeProfileKey) recordTsrMonsterLifeCodex(monster.lifeProfileKey);
            const syn = getTsrMutationLifeSynergies(monster);
            if (syn.length && tsr?.currentRun?.isActive) {
                addTsrLog(`🧬 变异命格共鸣：${syn.map(s => s.icon + s.name).join('、')}`, 'warning');
                tsr.currentRun.mutationLifeSynergyActive = true;
            }
            if (tsr?.currentRun?.mutationRewardBonus) {
                tsr.currentRun.monsterLifeRewardBonus = (tsr.currentRun.monsterLifeRewardBonus || 0) + tsr.currentRun.mutationRewardBonus;
            }
            return applyTsrMutationLifeSynergyToStats(r, monster);
        };
        initTsrMonsterLifeBattle.__tsrCodexPatched = true;
    }

    if (typeof onTsrMonsterHpReachedZero === 'function') {
        const _origRevive = onTsrMonsterHpReachedZero;
        onTsrMonsterHpReachedZero = function (monster, ctx) {
            const tsr = player?.timeSecretRealm;
            const profile = typeof getTsrMonsterLifeProfile === 'function' ? getTsrMonsterLifeProfile(monster) : null;
            const stage = tsr?.currentRun?.monsterLifeStage || 1;
            const revived = _origRevive(monster, ctx);
            if (revived && profile?.onFinalReviveHeal && stage + 1 >= profile.stages) {
                tsrHealPlayer(profile.onFinalReviveHeal);
                addTsrLog(`🔥【${profile.labels[profile.stages - 1]}】涅槃回血${Math.floor(profile.onFinalReviveHeal * 100)}%`, 'success');
            }
            if (revived && profile?.reviveBurst) {
                const reduce = tsr?.currentRun?.lifeReviveBurstReduce || 0;
                const dmg = Math.max(0, profile.reviveBurst - reduce);
                if (dmg > 0) {
                    applyDamage(bMul(tsr.currentRun.playerHealth, dmg));
                    addTsrLog(`💥 转段冲击${Math.floor(dmg * 100)}%生命`, 'error');
                }
            }
            return revived;
        };
    }

    if (typeof applyTsrMonsterAffixRound === 'function' && !applyTsrMonsterAffixRound.__tsrCodexPatched) {
        const _origRound = applyTsrMonsterAffixRound;
        applyTsrMonsterAffixRound = function (monster, rounds, monsterHp, monsterMaxHp) {
            let hp = _origRound(monster, rounds, monsterHp, monsterMaxHp);
            hp = applyTsrMutationLifeSynergyRound(monster, rounds, hp, monsterMaxHp);
            return hp;
        };
        applyTsrMonsterAffixRound.__tsrCodexPatched = true;
    }

    if (typeof getTsrMonsterAffixCounterMult === 'function' && !getTsrMonsterAffixCounterMult.__tsrCodexPatched) {
        const _origCnt = getTsrMonsterAffixCounterMult;
        getTsrMonsterAffixCounterMult = function (monster, rounds, monsterHp, monsterMaxHp) {
            return _origCnt(monster, rounds, monsterHp, monsterMaxHp) + getTsrMutationLifeSynergyCounterBonus(monster);
        };
        getTsrMonsterAffixCounterMult.__tsrCodexPatched = true;
    }

    if (typeof getTsrMonsterAffixRewardMult === 'function' && !getTsrMonsterAffixRewardMult.__tsrCodexPatched) {
        const _origRw = getTsrMonsterAffixRewardMult;
        getTsrMonsterAffixRewardMult = function (monster) {
            let mult = _origRw(monster);
            mult += getTsrMutationLifeSynergyRewardBonus(monster);
            if (player?.timeSecretRealm?.codex?.relics?.mutationCodex) mult += 0.08;
            mult += player?.timeSecretRealm?.permanentBonuses?.multiLifeBounty || 0;
            return mult;
        };
        getTsrMonsterAffixRewardMult.__tsrCodexPatched = true;
    }

    if (typeof updateTsrMonsterBanner === 'function' && !updateTsrMonsterBanner.__tsrCodexPatched) {
        const _origBan = updateTsrMonsterBanner;
        updateTsrMonsterBanner = function (monster, stats, isBoss, isElite) {
            _origBan(monster, stats, isBoss, isElite);
            const banner = document.getElementById('tsrMonsterBanner');
            if (!banner || !monster) return;
            const left = banner.querySelector('.tsr-monster-banner-left');
            if (!left) return;
            const synHtml = formatTsrMutationLifeSynergyHtml(monster);
            if (synHtml && !left.querySelector('.tsr-mut-life-synergy')) {
                left.insertAdjacentHTML('beforeend', synHtml);
            }
        };
        updateTsrMonsterBanner.__tsrCodexPatched = true;
    }

    if (typeof tsrUseConsumable === 'function' && !tsrUseConsumable.__tsrCodexPatched) {
        const _origUse = tsrUseConsumable;
        tsrUseConsumable = function (index) {
            const tsr = player?.timeSecretRealm;
            const list = tsr?.currentRun?.consumables || [];
            const key = list[index];
            const def = TSR_RUN_CONSUMABLES?.[key];
            if (!def) return _origUse(index);
            if (def.effect === 'mutationSerum') {
                list.splice(index, 1);
                tsr.currentRun.nextBattleForceMutation = true;
                tsr.currentRun.mutationRewardBonus = (tsr.currentRun.mutationRewardBonus || 0) + 0.2;
                addTsrLog(`使用${def.name}！下一场战斗必定变异，变异赏金+20%`, 'success');
                updateTsrConsumablesDisplay?.();
                updateTimeSecretRealmUI?.({ runOnly: true, skipEnsure: true, light: true });
                return;
            }
            if (def.effect === 'lifeAnchor') {
                list.splice(index, 1);
                tsr.currentRun.nextBattleForceLife = true;
                tsr.currentRun.lifeReviveBurstReduce = (tsr.currentRun.lifeReviveBurstReduce || 0) + 0.03;
                addTsrLog(`使用${def.name}！下一场战斗必定多段生命，转段冲击-3%`, 'success');
                updateTsrConsumablesDisplay?.();
                updateTimeSecretRealmUI?.({ runOnly: true, skipEnsure: true, light: true });
                return;
            }
            if (def.effect === 'mutationLens') {
                list.splice(index, 1);
                tsr.currentRun.mutationRewardBonus = (tsr.currentRun.mutationRewardBonus || 0) + 0.2;
                const room = tsr.currentRun.currentRoom;
                if (room?.monster) {
                    rollTsrMonsterMutation?.(room.monster, !!room.isBoss, !!room.isElite, tsr.currentRun.currentFloor);
                    rollTsrMonsterLifeProfile?.(room.monster, !!room.isBoss, !!room.isElite, tsr.currentRun.currentFloor);
                    const mut = getTsrMonsterMutationDef?.(room.monster);
                    const life = getTsrMonsterLifeProfile?.(room.monster);
                    addTsrLog(`使用${def.name}！洞察：${mut ? mut.icon + mut.name : '无变异'} / ${life ? life.stages + '段命' : '单命'}`, 'success');
                    updateCurrentRoomDisplay?.();
                } else {
                    addTsrLog(`使用${def.name}！下一场将揭示变异与命格`, 'success');
                }
                updateTsrConsumablesDisplay?.();
                updateTimeSecretRealmUI?.({ runOnly: true, skipEnsure: true, light: true });
                return;
            }
            return _origUse(index);
        };
        tsrUseConsumable.__tsrCodexPatched = true;
    }

    if (typeof trackTsrMonsterMutationVictory === 'function' && !trackTsrMonsterMutationVictory.__tsrCodexPatched) {
        const _origTrack = trackTsrMonsterMutationVictory;
        trackTsrMonsterMutationVictory = function (monster) {
            _origTrack(monster);
            const tsr = player?.timeSecretRealm;
            if (!tsr) return;
            if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
            const profile = getTsrMonsterLifeProfile?.(monster);
            if (profile?.stages >= 5 && (tsr.currentRun?.currentRoom?.isBoss || tsr.currentRun?.currentRoom?.type === 'boss')) {
                tsr.lifetimeStats.pentLifeBossKills = (tsr.lifetimeStats.pentLifeBossKills || 0) + 1;
            }
            checkTsrMonsterCodexAchievements();
        };
        trackTsrMonsterMutationVictory.__tsrCodexPatched = true;
    }

    if (typeof checkTsrAchievements === 'function' && !checkTsrAchievements.__tsrCodexPatched) {
        const _origAch = checkTsrAchievements;
        checkTsrAchievements = function (ctx) {
            _origAch(ctx);
            checkTsrMonsterCodexAchievements();
        };
        checkTsrAchievements.__tsrCodexPatched = true;
    }

    if (typeof getDefaultTsrShopItems === 'function' && !getDefaultTsrShopItems.__tsrCodexPatched) {
        const _origShop = getDefaultTsrShopItems;
        getDefaultTsrShopItems = function () {
            return {
                ..._origShop(),
                mutationSightTome: {
                    name: '变异通晓书', description: '永久变异出现率+2%（限购5，可叠加）',
                    cost: 240000, type: 'permanent', effect: 'tsr_mutation_sight', maxPurchase: 5, purchased: 0,
                    category: 'codex', icon: '📗'
                },
                multiLifeBounty: {
                    name: '多命赏金契', description: '永久多段生命击败赏金+5%（限购4，可叠加）',
                    cost: 260000, type: 'permanent', effect: 'tsr_multi_life_bounty', maxPurchase: 4, purchased: 0,
                    category: 'codex', icon: '⚓'
                }
            };
        };
        getDefaultTsrShopItems.__tsrCodexPatched = true;
    }

    function applyTsrMonsterCodexShopEffect(itemKey, item, tsr) {
        if (!item?.effect || !tsr) return false;
        if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
        if (item.effect === 'tsr_mutation_sight') {
            tsr.permanentBonuses.mutationSight = Math.min(0.2, (tsr.permanentBonuses.mutationSight || 0) + 0.02);
            logAction(`变异通晓书生效！变异感知+${(tsr.permanentBonuses.mutationSight * 100).toFixed(0)}%`, 'success');
            return true;
        }
        if (item.effect === 'tsr_multi_life_bounty') {
            tsr.permanentBonuses.multiLifeBounty = Math.min(0.25, (tsr.permanentBonuses.multiLifeBounty || 0) + 0.05);
            logAction(`多命赏金契生效！多命赏金+${(tsr.permanentBonuses.multiLifeBounty * 100).toFixed(0)}%`, 'success');
            return true;
        }
        return false;
    }

    if (typeof buyTsrShopItem === 'function' && !buyTsrShopItem.__tsrCodexPatched) {
        const _origBuy = buyTsrShopItem;
        buyTsrShopItem = function (itemKey) {
            const tsr = player?.timeSecretRealm;
            const item = tsr?.shopItems?.[itemKey];
            if (item && (item.effect === 'tsr_mutation_sight' || item.effect === 'tsr_multi_life_bounty')) {
                ensureTimeSecretRealmData?.();
                const blockReason = getTsrShopItemBlockReason?.(item);
                if (blockReason) { logAction(blockReason, 'error'); return; }
                if ((tsr.currency || 0) < item.cost) { logAction('秘境币不足', 'error'); return; }
                tsr.currency = clampTsrCurrency(tsr.currency - item.cost);
                if (item.maxPurchase) item.purchased = (item.purchased || 0) + 1;
                applyTsrMonsterCodexShopEffect(itemKey, item, tsr);
                updateTimeSecretRealmUI?.();
                return;
            }
            return _origBuy(itemKey);
        };
        buyTsrShopItem.__tsrCodexPatched = true;
    }
}

initTsrMonsterCodexExtensions();

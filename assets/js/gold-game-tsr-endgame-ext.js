/**
 * 时光秘境 · 终局深度扩展
 * 赛季排行榜 / 异步镜像残影 / 精炼尘工坊 / 周Boss轮换
 * + 大量房间·遗物·战术·怪物·成就
 */
const TSR_LEADERBOARD_NPC_NAMES = [
    '时砂旅人', '加班暴君', '虚空钓客', '词条猎人阿福', '命格学徒',
    '梗王本王', 'SRE守夜人', '丹师路过', '镜中人', '末班车幽灵',
    'KPI魔像杀手', '霓虹剪影', '星愿许愿池管理员', '赛季冲分哥', '撤离艺术家'
];

const TSR_REFINE_DUST_RECIPES = [
    { id: 'dustAtk', name: '锋芒精炼', icon: '⚔️', cost: 40, max: 20, desc: '永久攻击+0.5%', effect: { eternalAttackBonus: 0.005 } },
    { id: 'dustHp', name: '护体精炼', icon: '❤️', cost: 40, max: 20, desc: '永久生命+0.8%', effect: { eternalHealthBonus: 0.008 } },
    { id: 'dustTime', name: '时砂精炼', icon: '⏳', cost: 55, max: 12, desc: '永久每层+1秒', effect: { floorTimeBonus: 1 } },
    { id: 'dustCoin', name: '聚财精炼', icon: '🪙', cost: 50, max: 15, desc: '永久局内币+1%', effect: { runCurrencyBonus: 0.01 } },
    { id: 'dustSpirit', name: '灵脉精炼', icon: '🧚', cost: 60, max: 12, desc: '永久精灵充能+1.5%', effect: { spiritChargeAmp: 0.015 } },
    { id: 'dustAffix', name: '词条精炼', icon: '🏷️', cost: 70, max: 10, desc: '永久词条赏金+1.5%', effect: { affixTome: 0.015 } },
    { id: 'dustMut', name: '变异精炼', icon: '🧬', cost: 80, max: 8, desc: '永久变异感知+1%', effect: { mutationSight: 0.01 } },
    { id: 'dustRelic', name: '遗宝精炼', icon: '🏺', cost: 75, max: 10, desc: '永久遗物率+1%', effect: { relicMagnet: 0.01 } }
];

const TSR_WEEKLY_BOSSES = [
    { id: 'wb_chronos', name: '周界·时序监工', icon: '⏳', tier: 'mythic', skill: 'timeDrain', skillChance: 0.48, skillValue: 9,
      intro: '「本周工时未达标，留下来加班。」', win: '监工被劳动法带走了。', mut: 'chronos', life: 'triple', xp: 220 },
    { id: 'wb_hydra', name: '周界·九头审计官', icon: '🐍', tier: 'mythic', skill: 'multiStrike', skillChance: 0.45,
      intro: '「九份报告，一个都不能少。」', win: '审计官被合并冲突了。', mut: 'hydra', life: 'hydra', xp: 240 },
    { id: 'wb_void', name: '周界·虚空验收官', icon: '🕳️', tier: 'mythic', skill: 'soulBind', skillChance: 0.46, skillValue: 0.22,
      intro: '「验收不通过，回首轮。」', win: '验收官掉进了自己的裂隙。', mut: 'voidborn', life: 'dual', xp: 230 },
    { id: 'wb_apex', name: '周界·顶点评审', icon: '🔺', tier: 'mythic', skill: 'affixStorm', skillChance: 0.5,
      intro: '「五段评分，你一关都过不了。」', win: '评审官被打回草稿。', mut: 'apex', life: 'pent', xp: 280 },
    { id: 'wb_nova', name: '周界·超新星甲方', icon: '☄️', tier: 'mythic', skill: 'resonanceBurst', skillChance: 0.44, skillValue: 0.09,
      intro: '「再改一版，再爆一次。」', win: '甲方预算爆炸了。', mut: 'nova', life: 'triple', xp: 250 },
    { id: 'wb_immortal', name: '周界·不朽产品经理', icon: '♾️', tier: 'mythic', skill: 'tidalWave', skillChance: 0.47,
      intro: '「需求永远不会死。」', win: 'PM去度假了（暂时）。', mut: 'immortal', life: 'quad', xp: 300 },
    { id: 'wb_radio', name: '周界·辐射合规官', icon: '☢️', tier: 'mythic', skill: 'overloadStrike', skillChance: 0.45,
      intro: '「辐射超标？加个开关就行。」', win: '合规官铅衣被熔了。', mut: 'radioactive', life: 'triple', xp: 260 }
];

const TSR_GHOST_ARCHETYPES = [
    { name: '残影·猛攻型', atkMult: 1.18, hpMult: 0.92, skill: 'rage' },
    { name: '残影·铁壁型', atkMult: 0.9, hpMult: 1.28, skill: 'shield', skillValue: 0.18 },
    { name: '残影·时贼型', atkMult: 1.05, hpMult: 1.05, skill: 'timeDrain', skillValue: 6 },
    { name: '残影·词条型', atkMult: 1.1, hpMult: 1.1, skill: 'affixStorm' },
    { name: '残影·灵噬型', atkMult: 1.08, hpMult: 1.12, skill: 'spiritDrain', skillValue: 0.2 }
];

const TSR_ENDGAME_RELICS = [
    { key: 'leaderMedal', relic: { name: '榜首勋章', icon: '🥇', desc: '通关评分+8%，秘境币+5%', effect: 'currency', value: 0.05 } },
    { key: 'ghostLantern', relic: { name: '残影提灯', icon: '🏮', desc: '镜像战奖励+20%，反击-4%', effect: 'counterReduce', value: 0.04 } },
    { key: 'dustCrucible', relic: { name: '精炼坩埚', icon: '⚗️', desc: '分解精炼尘+35%', effect: 'currency', value: 0.04 } },
    { key: 'weekSigil', relic: { name: '周界符印', icon: '📆', desc: '周Boss奖励+25%，攻击+6%', effect: 'attack', value: 0.06 } },
    { key: 'echoBlade', relic: { name: '回响残刃', icon: '🗡️', desc: '暴击+4%，词条赏金+6%', effect: 'critRate', value: 0.04 } },
    { key: 'forgeHeart', relic: { name: '工坊之心', icon: '❤️‍🔥', desc: '精炼费-10%（等价尘-1档优惠感知）', effect: 'health', value: 0.05 } },
    { key: 'rankCompass', relic: { name: '排行罗盘', icon: '🧭', desc: '特殊房+5%，赛季经验感知+', effect: 'specialRoom', value: 0.05 } },
    { key: 'mirrorShard', relic: { name: '镜像碎片', icon: '🪞', desc: '残影战攻击+10%', effect: 'attack', value: 0.1 } }
];

const TSR_ENDGAME_TACTICS = {
    ghostHunt: { id: 'ghostHunt', name: '猎影', icon: '👻', desc: '对残影/镜像攻击+20%', attack: 0.12, battleReward: 0.1 },
    dustSeek: { id: 'dustSeek', name: '觅尘', icon: '✨', desc: '首回合伤害+25%，后续-5%', firstStrike: 0.25, attackPenaltyAfterFirst: -0.05 },
    weekHunt: { id: 'weekHunt', name: '周猎', icon: '📆', desc: '暴击+10%，战斗奖励+15%', critRate: 0.1, battleReward: 0.15 }
};

const TSR_ENDGAME_SPECIAL_ROOMS = ['ghostarena', 'dustworkshop', 'weeklygate', 'rankshrine', 'echoarchive', 'cruciblehall'];
const TSR_ENDGAME_ROOM_META = {
    ghostarena: { name: '残影竞技场', icon: '👻', color: '#94a3b8' },
    dustworkshop: { name: '精炼工坊', icon: '⚗️', color: '#fbbf24' },
    weeklygate: { name: '周界之门', icon: '📆', color: '#ef4444' },
    rankshrine: { name: '排行神龛', icon: '🥇', color: '#eab308' },
    echoarchive: { name: '回响档案', icon: '📼', color: '#a78bfa' },
    cruciblehall: { name: '坩埚大厅', icon: '🔥', color: '#f97316' }
};

const TSR_ENDGAME_ACHIEVEMENTS = [
    { id: 'rankTop10', name: '进榜十强', desc: '赛季本地榜进入前10', icon: '🥇' },
    { id: 'ghostWin10', name: '猎影十胜', desc: '击败10个残影', icon: '👻' },
    { id: 'dustCraft20', name: '精炼工匠', desc: '完成20次精炼', icon: '⚗️' },
    { id: 'weeklyBoss3', name: '周猎手', desc: '击败3次周Boss', icon: '📆' },
    { id: 'dustStock200', name: '尘屯户', desc: '累计持有精炼尘达到200', icon: '✨' },
    { id: 'ghostSave5', name: '残影收藏家', desc: '收藏5个通关残影', icon: '📼' }
];

const TSR_ENDGAME_MONSTERS = {
    battle: [
        { id: 'dustmite', name: '精炼尘螨', icon: '✨', tier: 'uncommon', intro: '「你的装备，我的零食。」', win: '尘螨被吸尘器吸走。', skill: 'coinSteal', skillChance: 0.22, skillValue: 12 },
        { id: 'rankimp', name: '冲榜小鬼', icon: '🥇', tier: 'rare', intro: '「分！我要更多分！」', win: '小鬼掉出榜外。', skill: 'rage', skillChance: 0.26 },
        { id: 'echobat', name: '回响蝠', icon: '🦇', tier: 'uncommon', intro: '「你说过的话，我会原样咬回去。」', win: '蝠群消音。', skill: 'reflect', skillChance: 0.24, skillValue: 0.05 }
    ],
    elite: [
        { id: 'ghostcaptain', name: '残影队长', icon: '👻', tier: 'legendary', intro: '「我是你上周的高光时刻。」', win: '队长残影消散。', skill: 'phaseBlink', skillChance: 0.34 },
        { id: 'dustbaron', name: '尘霾男爵', icon: '⚗️', tier: 'epic', intro: '「精炼尘是硬通货。」', win: '男爵被熔进坩埚。', skill: 'coinSteal', skillChance: 0.32, skillValue: 30 },
        { id: 'weekherald', name: '周界传令官', icon: '📯', tier: 'mythic', intro: '「本周 Boss 换班了，你跟上了吗？」', win: '传令官声嘶力竭。', skill: 'affixStorm', skillChance: 0.36 }
    ],
    boss: [
        { id: 'ghostking', name: '残影之王', icon: '👑', tier: 'mythic', intro: '「所有通关录像，皆臣服于我。」', win: '残影之王被格式化。', skill: 'affixStorm', skillChance: 0.45 },
        { id: 'cruciblelord', name: '坩埚领主', icon: '🔥', tier: 'mythic', intro: '「跳进我的炉子，成为更好的自己。」', win: '领主炉火熄灭。', skill: 'tidalWave', skillChance: 0.42 }
    ]
};

/* ===== 数据保证 ===== */
function ensureTsrEndgameData() {
    const tsr = player.timeSecretRealm;
    if (!tsr.refineDust) tsr.refineDust = 0;
    if (!tsr.refineCrafted) tsr.refineCrafted = {};
    if (!tsr.ghostCollection) tsr.ghostCollection = [];
    if (!tsr.leaderboardBest) tsr.leaderboardBest = {};
    if (!tsr.weeklyBoss) tsr.weeklyBoss = { weekKey: '', kills: 0, claimed: false };
    return tsr;
}

function getTsrWeekKey(d) {
    d = d || new Date();
    const onejan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return d.getFullYear() + '-W' + week;
}

function hashTsrSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
}

/* ===== 赛季排行榜 ===== */
function getTsrSeasonScoreSnapshot() {
    const tsr = player.timeSecretRealm;
    const s = typeof ensureTsrSeason === 'function' ? ensureTsrSeason() : { key: 'S?', xp: 0 };
    const best = tsr.bestFloor || 0;
    const clears = tsr.clearCount || 0;
    const ghosts = (tsr.ghostCollection || []).length;
    const dustCraft = Object.values(tsr.refineCrafted || {}).reduce((a, b) => a + b, 0);
    const score = Math.floor(s.xp * 1.2 + best * 35 + clears * 80 + ghosts * 40 + dustCraft * 15 + (tsr.lifetimeStats?.bossRushClears || 0) * 60);
    return { name: '你', score, xp: s.xp || 0, best, clears, isPlayer: true };
}

function buildTsrLeaderboard() {
    ensureTsrEndgameData();
    const tsr = player.timeSecretRealm;
    const seasonKey = typeof getTsrSeasonKey === 'function' ? getTsrSeasonKey() : 'S1';
    const playerRow = getTsrSeasonScoreSnapshot();
    tsr.leaderboardBest[seasonKey] = Math.max(tsr.leaderboardBest[seasonKey] || 0, playerRow.score);

    const seed = hashTsrSeed(seasonKey + ':' + (player.name || 'traveler'));
    const npcs = TSR_LEADERBOARD_NPC_NAMES.map((name, i) => {
        const wobble = ((seed >> (i % 16)) & 255) / 255;
        const base = 800 + i * 180 + Math.floor(wobble * 900);
        const boost = Math.floor((tsr.leaderboardBest[seasonKey] || playerRow.score) * (0.35 + wobble * 0.55));
        return {
            name,
            score: Math.floor(base + boost * (0.6 + (i % 5) * 0.08)),
            xp: Math.floor(base / 3),
            best: 8 + (i % 12),
            clears: 1 + (i % 9),
            isPlayer: false
        };
    });
    const board = [...npcs, { ...playerRow, score: tsr.leaderboardBest[seasonKey] }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
        .map((row, idx) => ({ ...row, rank: idx + 1 }));
    return board;
}

function getTsrPlayerLeaderboardRank() {
    const board = buildTsrLeaderboard();
    const me = board.find(r => r.isPlayer);
    return me ? me.rank : 99;
}

function renderTsrLeaderboardPanel() {
    const el = document.getElementById('tsrLeaderboardPanel');
    if (!el) return;
    const board = buildTsrLeaderboard();
    const seasonKey = typeof getTsrSeasonKey === 'function' ? getTsrSeasonKey() : '';
    el.innerHTML = `<div class="tsr-lb-head">赛季 ${seasonKey} · 本地榜（含生成对手）</div>
        <div class="tsr-lb-list">${board.map(r => `
            <div class="tsr-lb-row ${r.isPlayer ? 'me' : ''}">
                <span class="tsr-lb-rank">#${r.rank}</span>
                <span class="tsr-lb-name">${r.name}${r.isPlayer ? '（你）' : ''}</span>
                <span class="tsr-lb-score">${r.score}</span>
            </div>`).join('')}</div>
        <p class="tsr-lb-hint">通关、赛季经验、首领冲刺、收藏残影都会抬高你的历史最高分。</p>`;
    if (getTsrPlayerLeaderboardRank() <= 10) checkTsrEndgameAchievements();
}

/* ===== 精炼尘 ===== */
function getTsrEquipSalvageDust(item) {
    if (!item) return 0;
    const tierDust = { common: 2, uncommon: 4, rare: 7, epic: 12, legendary: 18, mythic: 28 };
    let dust = tierDust[item.tier] || 3;
    dust += Math.floor((item.enhance || 0) * 1.5);
    dust += Math.min(8, (item.affixes || []).length * 2);
    if ((player.timeSecretRealm?.currentRun?.relics || []).includes('dustCrucible')) dust = Math.floor(dust * 1.35);
    if ((player.timeSecretRealm?.currentRun?.relics || []).includes('forgeHeart')) dust += 1;
    return Math.max(1, dust);
}

function addTsrRefineDust(amount, reason) {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return 0;
    ensureTsrEndgameData();
    const tsr = player.timeSecretRealm;
    const gain = Math.max(0, Math.floor(amount));
    if (!gain) return 0;
    tsr.refineDust += gain;
    if (reason) addTsrLog?.(`✨ 精炼尘+${gain}（${reason}）· 库存${tsr.refineDust}`, 'success');
    checkTsrEndgameAchievements();
    return gain;
}

function craftTsrRefineRecipe(recipeId) {
    ensureTsrEndgameData();
    const tsr = player.timeSecretRealm;
    const recipe = TSR_REFINE_DUST_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return false;
    const crafted = tsr.refineCrafted[recipeId] || 0;
    if (crafted >= recipe.max) { logAction('该精炼已达上限', 'error'); return false; }
    let cost = recipe.cost;
    if ((tsr.permanentBonuses?.refineDiscount || 0) > 0) cost = Math.max(5, Math.floor(cost * (1 - tsr.permanentBonuses.refineDiscount)));
    if (tsr.refineDust < cost) { logAction(`精炼尘不足（${tsr.refineDust}/${cost}）`, 'error'); return false; }
    tsr.refineDust -= cost;
    tsr.refineCrafted[recipeId] = crafted + 1;
    tsr.permanentBonuses = tsr.permanentBonuses || {};
    Object.entries(recipe.effect).forEach(([k, v]) => {
        if (k === 'eternalAttackBonus' || k === 'eternalHealthBonus') {
            tsr.permanentBonuses[k] = typeof clampTsrEternalBonus === 'function'
                ? clampTsrEternalBonus((tsr.permanentBonuses[k] || 0) + v)
                : Math.min((typeof TSR_ETERNAL_BONUS_MAX === 'number' ? TSR_ETERNAL_BONUS_MAX : 0.75), (tsr.permanentBonuses[k] || 0) + v);
        } else if (k === 'floorTimeBonus') {
            const floorCap = typeof TSR_FLOOR_TIME_BONUS_MAX === 'number' ? TSR_FLOOR_TIME_BONUS_MAX : 36;
            tsr.permanentBonuses[k] = Math.min(floorCap, (tsr.permanentBonuses[k] || 0) + v);
        } else {
            tsr.permanentBonuses[k] = (tsr.permanentBonuses[k] || 0) + v;
        }
    });
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.dustCrafts = (tsr.lifetimeStats.dustCrafts || 0) + 1;
    logAction(`精炼成功：${recipe.icon}${recipe.name}（${tsr.refineCrafted[recipeId]}/${recipe.max}）`, 'success');
    renderTsrDustWorkshopPanel();
    checkTsrEndgameAchievements();
    return true;
}

function renderTsrDustWorkshopPanel() {
    const el = document.getElementById('tsrDustWorkshopPanel');
    if (!el) return;
    ensureTsrEndgameData();
    const tsr = player.timeSecretRealm;
    el.innerHTML = `
        <div class="tsr-dust-head">✨ 精炼尘库存：<strong>${tsr.refineDust}</strong></div>
        <div class="tsr-dust-grid">${TSR_REFINE_DUST_RECIPES.map(r => {
            const n = tsr.refineCrafted[r.id] || 0;
            const full = n >= r.max;
            return `<div class="tsr-dust-card">
                <div class="tsr-dust-title">${r.icon} ${r.name}</div>
                <div class="tsr-dust-desc">${r.desc}</div>
                <div>进度 ${n}/${r.max} · 消耗 ${r.cost}尘</div>
                <button type="button" class="tsr-btn tsr-btn-gold" ${full ? 'disabled' : ''} onclick="craftTsrRefineRecipe('${r.id}')">${full ? '已满级' : '精炼'}</button>
            </div>`;
        }).join('')}</div>`;
}

/* ===== 残影收藏 / 异步镜像 ===== */
function captureTsrGhostSnapshot(cleared, score) {
    if (!cleared) return;
    ensureTsrEndgameData();
    const tsr = player.timeSecretRealm;
    const run = tsr.currentRun;
    if (!run) return;
    const ghost = {
        id: 'g_' + Date.now().toString(36),
        at: Date.now(),
        floor: run.currentFloor,
        difficulty: run.difficulty,
        score: score || 0,
        contract: tsr.selectedContract || 'none',
        relics: (run.relics || []).slice(0, 4),
        streak: run.maxBattleStreak || 0,
        name: `残影·${run.difficulty || '迷雾'}·${run.currentFloor}层`
    };
    tsr.ghostCollection.unshift(ghost);
    if (tsr.ghostCollection.length > 12) tsr.ghostCollection.length = 12;
    checkTsrEndgameAchievements();
}

function buildTsrGhostMonster(ghost, floor, dm) {
    const arch = TSR_GHOST_ARCHETYPES[hashTsrSeed((ghost?.id || '') + floor) % TSR_GHOST_ARCHETYPES.length];
    const mon = {
        id: 'playerghost',
        name: ghost?.name || arch.name,
        icon: '👻',
        tier: ghost?.floor >= 20 ? 'mythic' : (ghost?.floor >= 12 ? 'legendary' : 'epic'),
        intro: `「我是${ghost?.difficulty || '某次'}冒险留下的回响。」`,
        win: '残影碎裂为光尘。',
        skill: arch.skill,
        skillChance: 0.34,
        skillValue: arch.skillValue,
        _ghostAtkMult: arch.atkMult,
        _ghostHpMult: arch.hpMult,
        mutation: Math.random() < 0.45 ? 'spectral' : undefined,
        lifeProfile: Math.random() < 0.35 ? 'dual' : undefined
    };
    return mon;
}

function startTsrGhostDuel(ghostId, fallbackGhost) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) {
        logAction('需在冒险中开启残影决斗（进入残影竞技场）', 'error');
        return;
    }
    ensureTsrEndgameData();
    const ghost = (tsr.ghostCollection || []).find(g => g.id === ghostId)
        || fallbackGhost
        || tsr.ghostCollection[0]
        || { id: 'npcg', name: '无名残影', floor: tsr.currentRun.currentFloor, difficulty: tsr.currentRun.difficulty, score: 500 };
    const room = tsr.currentRun.currentRoom;
    if (!room) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const floor = tsr.currentRun.currentFloor;
    const monster = buildTsrGhostMonster(ghost, floor, dm);
    room.monster = monster;
    room.isElite = true;
    room.isGhostDuel = true;
    room.rewards = generateRoomRewards('elite', dm);
    room.rewards.currency = Math.floor(room.rewards.currency * (1.4 + (ghost?.score || 0) * 0.00005));
    tsr.currentRun.ghostFightTarget = ghost?.id || null;
    addTsrLog(`👻 迎战残影：${monster.name}`, 'warning');
    hideTsrChoicePanels?.();
    handleBattleRoom({ forceElite: true });
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.ghostWins = (tsr.lifetimeStats.ghostWins || 0) + 1;
    addTsrRefineDust(8, '猎影');
    if (typeof addTsrSeasonXP === 'function') addTsrSeasonXP(30, '残影决斗');
    checkTsrEndgameAchievements();
    afterAction?.();
}

function renderTsrGhostPanel() {
    const el = document.getElementById('tsrGhostPanel');
    if (!el) return;
    ensureTsrEndgameData();
    const list = player.timeSecretRealm.ghostCollection || [];
    if (!list.length) {
        el.innerHTML = '<p class="tsr-lb-hint">通关后会自动收录残影。局内进入「残影竞技场」可决斗。</p>';
        return;
    }
    el.innerHTML = `<div class="tsr-ghost-list">${list.map(g => `
        <div class="tsr-ghost-card">
            <div class="tsr-ghost-title">👻 ${g.name}</div>
            <div>层${g.floor} · ${g.difficulty} · 分${g.score}</div>
            <div>契约 ${g.contract} · 连击${g.streak}</div>
        </div>`).join('')}</div>`;
}

/* ===== 周 Boss ===== */
function ensureTsrWeeklyBoss() {
    ensureTsrEndgameData();
    const tsr = player.timeSecretRealm;
    const wk = getTsrWeekKey();
    if (tsr.weeklyBoss.weekKey !== wk) {
        tsr.weeklyBoss = { weekKey: wk, kills: 0, claimed: false };
    }
    const idx = hashTsrSeed(wk) % TSR_WEEKLY_BOSSES.length;
    return { meta: TSR_WEEKLY_BOSSES[idx], state: tsr.weeklyBoss };
}

function startTsrWeeklyBossChallenge() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.difficulty?.current) { logAction('请先选择难度！', 'error'); return; }
    if ((player.items?.fuben2 || 0) < 1) { alert('需要至少 1 把秘境钥匙！'); return; }
    tsr.pendingWeeklyBoss = true;
    startTimeSecretRealm();
}

function initTsrWeeklyBossRun() {
    const tsr = player.timeSecretRealm;
    if (!tsr.pendingWeeklyBoss) return;
    tsr.pendingWeeklyBoss = false;
    tsr.currentRun.isWeeklyBoss = true;
    const { meta } = ensureTsrWeeklyBoss();
    addTsrLog(`📆 周界挑战开幕：${meta.icon}${meta.name}`, 'warning');
    setTimeout(() => beginTsrWeeklyBossFight(), 450);
}

function beginTsrWeeklyBossFight() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive || !tsr.currentRun.isWeeklyBoss) return;
    if (tsr.currentRun.battleInProgress || tsr.currentRun._resolvingBattle || tsr.currentRun._weeklyBossSettling) {
        setTimeout(() => beginTsrWeeklyBossFight(), 120);
        return;
    }
    const { meta } = ensureTsrWeeklyBoss();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    // 挑战开局无构筑：层数过高会被进度曲线打爆；多段生命在下方统一剥离
    const floor = Math.max(6, Math.min(10, tsr.currentRun.currentFloor || 6));
    const monster = {
        id: meta.id,
        name: meta.name,
        icon: meta.icon,
        tier: meta.tier,
        intro: meta.intro,
        win: meta.win,
        skill: meta.skill,
        skillChance: meta.skillChance,
        skillValue: meta.skillValue
        // 故意不带 mutation/lifeProfile：挑战模式会 strip，这里也不再塞多段生命
    };
    const room = {
        type: 'boss', isBoss: true, explored: true, monster, isWeeklyBoss: true, battleCleared: false,
        rewards: generateRoomRewards('boss', dm)
    };
    room.rewards.currency = Math.floor(room.rewards.currency * 1.15);
    tsr.currentRun.currentRoom = room;
    tsr.currentRun.currentFloor = floor;
    tsr.currentRun._weeklyBossSettling = true;
    const fightId = typeof beginTsrChallengeFight === 'function' ? beginTsrChallengeFight(tsr.currentRun) : 0;
    handleBattleRoom();
    let settleTries = 0;
    const settle = () => {
        const r = player.timeSecretRealm?.currentRun;
        if (!r?.isActive || !r.isWeeklyBoss) return;
        if (r.battleInProgress || r._resolvingBattle) {
            if (++settleTries < 200) setTimeout(settle, 120);
            else r._weeklyBossSettling = false;
            return;
        }
        const summary = r.lastBattleSummary;
        if (fightId && (!summary || summary.fightId !== fightId)) {
            if (++settleTries < 200) setTimeout(settle, 120);
            else r._weeklyBossSettling = false;
            return;
        }
        r._weeklyBossSettling = false;
        const won = !!summary?.victory && !bLteZero(r.playerHealth);
        if (!won) {
            if (summary && r.isActive && !bLteZero(r.playerHealth)) endTimeSecretRealm('战斗失败');
            return;
        }
        const st = ensureTsrWeeklyBoss().state;
        st.kills = (st.kills || 0) + 1;
        if (!player.timeSecretRealm.lifetimeStats) player.timeSecretRealm.lifetimeStats = {};
        player.timeSecretRealm.lifetimeStats.weeklyBossKills = (player.timeSecretRealm.lifetimeStats.weeklyBossKills || 0) + 1;
        addTsrRefineDust(25, '周Boss');
        if (typeof addTsrSeasonXP === 'function') addTsrSeasonXP(meta.xp || 200, '周Boss');
        if (typeof addTsrFactionRep === 'function') {
            addTsrFactionRep('beast', 5, '周猎');
            addTsrFactionRep('chronos', 3, '周猎');
        }
        checkTsrEndgameAchievements();
        addTsrLog('📆 周界Boss击破！正在结算…', 'success');
        setTimeout(() => endTimeSecretRealm('weeklyBossClear'), 300);
    };
    if (typeof waitTsrBattleSettled === 'function') waitTsrBattleSettled(settle);
    else setTimeout(settle, 80);
}

function claimTsrWeeklyBossChest() {
    const { meta, state } = ensureTsrWeeklyBoss();
    if ((state.kills || 0) < 1) { logAction('本周尚未击败周Boss', 'error'); return; }
    if (state.claimed) { logAction('本周宝箱已领取', 'error'); return; }
    state.claimed = true;
    const tsr = player.timeSecretRealm;
    addTsrPermanentCurrency?.(1000);
    addTsrRefineDust(22, '周界宝箱');
    tsr.pendingConsumables = tsr.pendingConsumables || [];
    tsr.pendingConsumables.push('mutationSerum', 'lifeAnchor');
    logAction(`领取周界宝箱：${meta.name} 谢礼`, 'success');
    renderTsrWeeklyBossPanel();
}

function renderTsrWeeklyBossPanel() {
    const el = document.getElementById('tsrWeeklyBossPanel');
    if (!el) return;
    const { meta, state } = ensureTsrWeeklyBoss();
    el.innerHTML = `
        <div class="tsr-week-boss">
            <div class="tsr-week-boss-icon">${meta.icon}</div>
            <div>
                <div class="tsr-week-boss-name">${meta.name}</div>
                <div class="tsr-week-boss-desc">${meta.intro}</div>
                <div>本周击杀 ${state.kills || 0} · 宝箱 ${state.claimed ? '已领' : '未领'}</div>
                <button type="button" class="tsr-btn tsr-btn-gold" onclick="startTsrWeeklyBossChallenge()">挑战周Boss（耗1钥）</button>
                <button type="button" class="tsr-btn tsr-btn-safe" onclick="claimTsrWeeklyBossChest()">领取周界宝箱</button>
            </div>
        </div>`;
}

/* ===== 特殊房 ===== */
function handleGhostarenaRoom() {
    ensureTsrEndgameData();
    const list = player.timeSecretRealm.ghostCollection || [];
    const ghostBtns = list.slice(0, 4).map(g =>
        `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseGhostArena('duel','${g.id}')">决斗·${g.name}</button>`
    ).join('');
    showTsrMemePanel('👻 残影竞技场', list.length ? '选择一道残影决斗，或以随机残影试锋。' : '尚无收藏残影，可与随机回响决斗。',
        `${ghostBtns}
         <button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseGhostArena('random')">随机残影战</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseGhostArena('train')">观摩 · -10秒 精炼尘+6</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}

function tsrChooseGhostArena(path, ghostId) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'ghostarena' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'train') {
        if (tsr.currentRun.timeLeft <= 12) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 10;
        addTsrRefineDust(6, '观摩残影');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'random' || path === 'duel') {
        const ghost = (tsr.ghostCollection || []).find(g => g.id === ghostId) || {
            id: 'npcg', name: '无名残影', floor: tsr.currentRun.currentFloor, difficulty: tsr.currentRun.difficulty, score: 500
        };
        room.isGhostArena = true;
        startTsrGhostDuel(ghost.id === 'npcg' ? null : ghost.id, ghost);
        return;
    }
    finishTsrMemeRoom();
}

function handleDustworkshopRoom() {
    ensureTsrEndgameData();
    const dust = player.timeSecretRealm.refineDust || 0;
    showTsrMemePanel('⚗️ 精炼工坊', `随身坩埚嗡嗡作响。当前精炼尘 <strong>${dust}</strong>。`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseDustWorkshop('smash')">砸装备胚 · -18秒 精炼尘+12~20</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseDustWorkshop('brew')">兑币成尘 · -60币 精炼尘+10</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseDustWorkshop('rush')">熔炉冲刺 · 精英战 尘翻倍</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}

function tsrChooseDustWorkshop(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'dustworkshop' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'smash') {
        if (tsr.currentRun.timeLeft <= 20) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 18;
        addTsrRefineDust(12 + Math.floor(Math.random() * 9), '砸胚');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'brew') {
        if ((tsr.currentRun.currencyEarned || 0) < 60) { addTsrLog('秘境币不足', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 60;
        addTsrRefineDust(10, '兑尘');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'rush') {
        room.isElite = true;
        room.monster = pickTsrMonster(false, true, tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('elite', dm);
        room.isDustRush = true;
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        addTsrRefineDust(22, '熔炉冲刺');
        afterAction?.();
        return;
    }
    finishTsrMemeRoom();
}

function handleWeeklygateRoom() {
    const { meta, state } = ensureTsrWeeklyBoss();
    showTsrMemePanel('📆 周界之门', `门后隐现：${meta.icon}<strong>${meta.name}</strong><br>本周击杀 ${state.kills}`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseWeeklyGate('fight')">立刻宣战 · 周Boss战</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseWeeklyGate('scout')">侦察 · -12秒 攻击+12%×3</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}

function tsrChooseWeeklyGate(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'weeklygate' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'scout') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        addTempBuff({ name: '周界侦察', effect: 'attack', value: 0.12, duration: 3, isDebuff: false });
        addTsrLog('侦察完成：攻击+12%×3', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'fight') {
        tsr.currentRun.isWeeklyBoss = true;
        finishTsrMemeRoom();
        setTimeout(() => beginTsrWeeklyBossFight(), 200);
        return;
    }
    finishTsrMemeRoom();
}

function handleRankshrineRoom() {
    const rank = getTsrPlayerLeaderboardRank();
    showTsrMemePanel('🥇 排行神龛', `你的赛季本地排名：<strong>#${rank}</strong>`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseRankShrine('pray')">祈榜 · -15秒 赛季经验+35</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseRankShrine('boast')">夸耀 · 按名次得币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}

function tsrChooseRankShrine(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'rankshrine' || !room.explored) return;
    hideTsrChoicePanels();
    const rank = getTsrPlayerLeaderboardRank();
    if (path === 'pray') {
        if (tsr.currentRun.timeLeft <= 16) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 15;
        if (typeof addTsrSeasonXP === 'function') addTsrSeasonXP(35, '祈榜');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'boast') {
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        const g = addTsrRunCurrency(Math.floor((25 + Math.max(0, 21 - rank) * 8) * dm));
        addTsrLog(`夸耀排名#${rank}，获得${g}秘境币`, 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleEchoarchiveRoom() {
    showTsrMemePanel('📼 回响档案', '档案柜里锁着无数失败者的喘息。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseEchoArchive('listen')">聆听 · -10秒 充能+25</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseEchoArchive('extract')">提取残影样本 · 精英战</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}

function tsrChooseEchoArchive(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'echoarchive' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'listen') {
        if (tsr.currentRun.timeLeft <= 12) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 10;
        chargeTsrSpirit?.(25);
        addTsrLog('聆听回响，精灵充能+25', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'extract') {
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        room.monster = buildTsrGhostMonster({ name: '档案残响', floor: tsr.currentRun.currentFloor, difficulty: 'archive', score: 800 }, tsr.currentRun.currentFloor, dm);
        room.isElite = true;
        room.isGhostDuel = true;
        room.rewards = generateRoomRewards('elite', dm);
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        addTsrRefineDust(10, '档案提取');
        afterAction?.();
        return;
    }
    finishTsrMemeRoom();
}

function handleCruciblehallRoom() {
    showTsrMemePanel('🔥 坩埚大厅', '巨型坩埚翻涌，愿意下注吗？',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseCrucibleHall('gamble')">豪赌熔炼 · 50%尘×3或失去20币</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseCrucibleHall('temper')">淬火 · -14秒 反击-12%×3</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
}

function tsrChooseCrucibleHall(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'cruciblehall' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'gamble') {
        if (Math.random() < 0.5) {
            addTsrRefineDust(18, '豪赌成功');
        } else {
            const lose = Math.min(20, tsr.currentRun.currencyEarned || 0);
            tsr.currentRun.currencyEarned -= lose;
            addTsrLog(`熔炼失败，失去${lose}秘境币`, 'error');
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'temper') {
        if (tsr.currentRun.timeLeft <= 16) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 14;
        tsr.currentRun.counterReduceBonus = (tsr.currentRun.counterReduceBonus || 0) + 0.12;
        addTempBuff({ name: '坩埚淬火', effect: 'attack', value: 0.08, duration: 3, isDebuff: false });
        addTsrLog('淬火完成：反击减免提升，攻击+8%×3', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

/* ===== 成就 ===== */
function checkTsrEndgameAchievements() {
    const tsr = player?.timeSecretRealm;
    if (!tsr) return;
    if (!tsr.achievements) tsr.achievements = {};
    const unlock = (id) => {
        if (tsr.achievements[id]) return;
        tsr.achievements[id] = Date.now();
        const a = TSR_ENDGAME_ACHIEVEMENTS.find(x => x.id === id);
        if (a) addTsrLog?.(`🏅 成就解锁：${a.name} — ${a.desc}`, 'success');
    };
    if (getTsrPlayerLeaderboardRank() <= 10) unlock('rankTop10');
    if ((tsr.lifetimeStats?.ghostWins || 0) >= 10) unlock('ghostWin10');
    if ((tsr.lifetimeStats?.dustCrafts || 0) >= 20) unlock('dustCraft20');
    if ((tsr.lifetimeStats?.weeklyBossKills || 0) >= 3) unlock('weeklyBoss3');
    if ((tsr.refineDust || 0) >= 200) unlock('dustStock200');
    if ((tsr.ghostCollection || []).length >= 5) unlock('ghostSave5');
}

/* ===== UI 注入 ===== */
function injectTsrEndgameLobbyUI() {
    const lobby = document.getElementById('tsrLobbyPanel');
    if (!lobby) return;
    const tabRow = lobby.querySelector('.tsr-tab-nav');
    if (tabRow && !document.getElementById('tsrTabBtnEndgame')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tsr-tab-btn';
        btn.id = 'tsrTabBtnEndgame';
        btn.dataset.tsrTab = 'endgame';
        btn.textContent = '♾️ 终局';
        btn.onclick = () => switchTsrLobbyTab('endgame');
        tabRow.appendChild(btn);
    }
    if (!document.getElementById('tsrTabEndgame')) {
        const panel = document.createElement('div');
        panel.id = 'tsrTabEndgame';
        panel.className = 'tsr-tab-panel';
        panel.innerHTML = `
            <div class="tsr-endgame-layout">
                <section>
                    <div class="tsr-block-title">🥇 赛季排行榜</div>
                    <div id="tsrLeaderboardPanel"></div>
                </section>
                <section>
                    <div class="tsr-block-title">⚗️ 精炼工坊</div>
                    <div id="tsrDustWorkshopPanel"></div>
                </section>
                <section>
                    <div class="tsr-block-title">📆 本周Boss</div>
                    <div id="tsrWeeklyBossPanel"></div>
                </section>
                <section>
                    <div class="tsr-block-title">👻 残影收藏</div>
                    <div id="tsrGhostPanel"></div>
                </section>
            </div>`;
        lobby.appendChild(panel);
    }

    const adv = document.getElementById('tsrTabAdventure');
    const modeBox = adv?.querySelector('.tsr-mode-box');
    if (modeBox && !document.getElementById('tsrWeeklyBossBtn')) {
        const b = document.createElement('button');
        b.type = 'button';
        b.id = 'tsrWeeklyBossBtn';
        b.className = 'tsr-btn tsr-btn-purple';
        b.textContent = '📆 周Boss挑战（耗1钥）';
        b.onclick = () => startTsrWeeklyBossChallenge();
        modeBox.appendChild(b);
    }
}

function refreshTsrEndgamePanels() {
    renderTsrLeaderboardPanel();
    renderTsrDustWorkshopPanel();
    renderTsrWeeklyBossPanel();
    renderTsrGhostPanel();
}

function initTsrEndgameExtensions() {
    ensureTsrEndgameData();
    ensureTsrWeeklyBoss();

    if (typeof TSR_RELIC_POOL !== 'undefined') {
        TSR_ENDGAME_RELICS.forEach(({ key, relic }) => { TSR_RELIC_POOL[key] = relic; });
    }
    if (typeof TSR_BATTLE_TACTICS !== 'undefined') Object.assign(TSR_BATTLE_TACTICS, TSR_ENDGAME_TACTICS);
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') TSR_ACHIEVEMENTS.push(...TSR_ENDGAME_ACHIEVEMENTS);
    if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined') TSR_SPECIAL_ROOM_TYPES.push(...TSR_ENDGAME_SPECIAL_ROOMS);
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_ENDGAME_MONSTERS.battle);
        TSR_MONSTER_POOL.elite.push(...TSR_ENDGAME_MONSTERS.elite);
        TSR_MONSTER_POOL.boss.push(...TSR_ENDGAME_MONSTERS.boss);
    }
    if (typeof TSR_CODEX_ROOMS !== 'undefined') {
        TSR_ENDGAME_SPECIAL_ROOMS.forEach(key => {
            const meta = TSR_ENDGAME_ROOM_META[key];
            if (meta && !TSR_CODEX_ROOMS.find(r => r.key === key)) {
                TSR_CODEX_ROOMS.push({ key, name: meta.name, icon: meta.icon });
            }
        });
    }
    if (typeof TSR_CONTENT_ROOM_META !== 'undefined') Object.assign(TSR_CONTENT_ROOM_META, TSR_ENDGAME_ROOM_META);

    if (typeof getTsrRoomTypeMeta === 'function' && !getTsrRoomTypeMeta.__tsrEndPatched) {
        const _orig = getTsrRoomTypeMeta;
        getTsrRoomTypeMeta = function (type) {
            const m = _orig(type);
            const extra = TSR_ENDGAME_ROOM_META[type];
            if (extra && (m.name === type || m.icon === '📍')) return { ...m, ...extra };
            return m;
        };
        getTsrRoomTypeMeta.__tsrEndPatched = true;
    }

    if (typeof handleTsrSpecialRoom === 'function' && !handleTsrSpecialRoom.__tsrEndPatched) {
        const _orig = handleTsrSpecialRoom;
        handleTsrSpecialRoom = function (type) {
            if (type === 'ghostarena') return handleGhostarenaRoom();
            if (type === 'dustworkshop') return handleDustworkshopRoom();
            if (type === 'weeklygate') return handleWeeklygateRoom();
            if (type === 'rankshrine') return handleRankshrineRoom();
            if (type === 'echoarchive') return handleEchoarchiveRoom();
            if (type === 'cruciblehall') return handleCruciblehallRoom();
            return _orig(type);
        };
        handleTsrSpecialRoom.__tsrEndPatched = true;
    }

    if (typeof salvageTsrEquipFromBag === 'function' && !salvageTsrEquipFromBag.__tsrEndPatched) {
        const _orig = salvageTsrEquipFromBag;
        salvageTsrEquipFromBag = function (bagIndex) {
            const bag = player.timeSecretRealm?.currentRun?.equipmentBag;
            const item = bag?.[bagIndex];
            const dust = item ? getTsrEquipSalvageDust(item) : 0;
            _orig(bagIndex);
            if (dust > 0) addTsrRefineDust(dust, '分解装备');
        };
        salvageTsrEquipFromBag.__tsrEndPatched = true;
    }

    if (typeof applyTsrMonsterAffixToStats === 'function' && !applyTsrMonsterAffixToStats.__tsrEndPatched) {
        const _orig = applyTsrMonsterAffixToStats;
        applyTsrMonsterAffixToStats = function (stats, monster) {
            let out = _orig(stats, monster);
            if (monster?._ghostHpMult || monster?._ghostAtkMult) {
                out = {
                    ...out,
                    hp: Math.max(1, Math.floor(out.hp * (monster._ghostHpMult || 1))),
                    atk: Math.max(1, Math.floor(out.atk * (monster._ghostAtkMult || 1)))
                };
            }
            if ((player.timeSecretRealm?.currentRun?.relics || []).includes('mirrorShard') && (monster?.id === 'playerghost' || player.timeSecretRealm?.currentRun?.currentRoom?.isGhostDuel)) {
                // player-side boost handled via temp buff on fight start
            }
            return out;
        };
        applyTsrMonsterAffixToStats.__tsrEndPatched = true;
    }

    if (typeof handleBattleRoom === 'function' && !handleBattleRoom.__tsrEndPatched) {
        const _orig = handleBattleRoom;
        handleBattleRoom = function (options) {
            const room = player?.timeSecretRealm?.currentRun?.currentRoom;
            if (room?.isGhostDuel && (player.timeSecretRealm.currentRun.relics || []).includes('ghostLantern')) {
                addTempBuff?.({ name: '残影提灯', effect: 'attack', value: 0.08, duration: 2, isDebuff: false });
            }
            if (room?.isGhostDuel && (player.timeSecretRealm.currentRun.relics || []).includes('mirrorShard')) {
                addTempBuff?.({ name: '镜像碎片', effect: 'attack', value: 0.1, duration: 3, isDebuff: false });
            }
            return _orig(options);
        };
        handleBattleRoom.__tsrEndPatched = true;
    }

    if (typeof startTimeSecretRealm === 'function' && !startTimeSecretRealm.__tsrEndPatched) {
        const _orig = startTimeSecretRealm;
        startTimeSecretRealm = function () {
            _orig();
            if (player?.timeSecretRealm?.currentRun?.isActive) initTsrWeeklyBossRun();
        };
        startTimeSecretRealm.__tsrEndPatched = true;
    }

    if (typeof endTimeSecretRealm === 'function' && !endTimeSecretRealm.__tsrEndPatched) {
        const _orig = endTimeSecretRealm;
        endTimeSecretRealm = function (reason) {
            const tsr = player.timeSecretRealm;
            const flags = typeof resolveTsrEndClearFlags === 'function'
                ? resolveTsrEndClearFlags(reason)
                : { captureGhost: false };
            const scoreSnap = typeof buildTsrDebrief === 'function'
                ? (buildTsrDebrief(reason, !!flags.debriefAsCleared)?.score || 0)
                : Math.floor((tsr?.currentRun?.currentFloor || 1) * 12);
            if (flags.captureGhost) captureTsrGhostSnapshot(true, scoreSnap);
            if (typeof ensureTsrSeason === 'function') {
                const sk = getTsrSeasonKey?.() || 'S';
                tsr.leaderboardBest = tsr.leaderboardBest || {};
                tsr.leaderboardBest[sk] = Math.max(tsr.leaderboardBest[sk] || 0, getTsrSeasonScoreSnapshot().score);
            }
            _orig(reason);
            checkTsrEndgameAchievements();
        };
        endTimeSecretRealm.__tsrEndPatched = true;
    }

    if (typeof tsrChooseSpiritDuel === 'function' && !tsrChooseSpiritDuel.__tsrEndPatched) {
        const _orig = tsrChooseSpiritDuel;
        tsrChooseSpiritDuel = function (path) {
            if (path !== 'fight') return _orig(path);
            const tsr = player.timeSecretRealm;
            const room = tsr.currentRun.currentRoom;
            if (!room || room.type !== 'spiritduel' || !room.explored) return;
            // 有残影时优先镜像残影决斗
            if ((tsr.ghostCollection || []).length && Math.random() < 0.55) {
                hideTsrChoicePanels();
                room.isSpiritDuel = true;
                startTsrGhostDuel(tsr.ghostCollection[0].id);
                return;
            }
            return _orig(path);
        };
        tsrChooseSpiritDuel.__tsrEndPatched = true;
    }

    if (typeof checkTsrAchievements === 'function' && !checkTsrAchievements.__tsrEndPatched) {
        const _orig = checkTsrAchievements;
        checkTsrAchievements = function (ctx) {
            _orig(ctx);
            checkTsrEndgameAchievements();
        };
        checkTsrAchievements.__tsrEndPatched = true;
    }

    if (typeof getDefaultTsrShopItems === 'function' && !getDefaultTsrShopItems.__tsrEndPatched) {
        const _orig = getDefaultTsrShopItems;
        getDefaultTsrShopItems = function () {
            return {
                ..._orig(),
                dustStarter: {
                    name: '精炼尘补给包', description: '立刻获得80精炼尘（限购3）',
                    cost: 120000, type: 'permanent', effect: 'tsr_dust_pack', maxPurchase: 3, purchased: 0,
                    category: 'enhance', icon: '✨'
                },
                refineDiscount: {
                    name: '坩埚补贴券', description: '永久精炼消耗-5%（限购4）',
                    cost: 200000, type: 'permanent', effect: 'tsr_refine_discount', maxPurchase: 4, purchased: 0,
                    category: 'enhance', icon: '⚗️'
                }
            };
        };
        getDefaultTsrShopItems.__tsrEndPatched = true;
    }

    if (typeof buyTsrShopItem === 'function' && !buyTsrShopItem.__tsrEndPatched) {
        const _orig = buyTsrShopItem;
        buyTsrShopItem = function (itemKey) {
            const tsr = player?.timeSecretRealm;
            const item = tsr?.shopItems?.[itemKey];
            if (item && (item.effect === 'tsr_dust_pack' || item.effect === 'tsr_refine_discount')) {
                ensureTimeSecretRealmData?.();
                const block = getTsrShopItemBlockReason?.(item);
                if (block) { logAction(block, 'error'); return; }
                if ((tsr.currency || 0) < item.cost) { logAction('秘境币不足', 'error'); return; }
                tsr.currency = clampTsrCurrency(tsr.currency - item.cost);
                if (item.maxPurchase) item.purchased = (item.purchased || 0) + 1;
                if (item.effect === 'tsr_dust_pack') {
                    addTsrRefineDust(80, '商店补给');
                    logAction('获得80精炼尘', 'success');
                } else {
                    tsr.permanentBonuses = tsr.permanentBonuses || {};
                    tsr.permanentBonuses.refineDiscount = Math.min(0.35, (tsr.permanentBonuses.refineDiscount || 0) + 0.05);
                    logAction(`坩埚补贴生效！精炼消耗-${(tsr.permanentBonuses.refineDiscount * 100).toFixed(0)}%`, 'success');
                }
                updateTimeSecretRealmUI?.();
                return;
            }
            return _orig(itemKey);
        };
        buyTsrShopItem.__tsrEndPatched = true;
    }

    if (typeof updateTsrLobbyDashboard === 'function' && !updateTsrLobbyDashboard.__tsrEndPatched) {
        const _orig = updateTsrLobbyDashboard;
        updateTsrLobbyDashboard = function () {
            _orig();
            const side = document.getElementById('tsrDashboardContent');
            if (!side) return;
            ensureTsrEndgameData();
            const { meta, state } = ensureTsrWeeklyBoss();
            const card = document.createElement('div');
            card.className = 'tsr-dash-card';
            card.innerHTML = `<div class="tsr-block-title">♾️ 终局</div>
                <p>精炼尘 ${player.timeSecretRealm.refineDust} · 榜#${getTsrPlayerLeaderboardRank()}</p>
                <p>${meta.icon}周Boss击杀 ${state.kills || 0}</p>`;
            side.appendChild(card);
        };
        updateTsrLobbyDashboard.__tsrEndPatched = true;
    }

    setTimeout(() => {
        injectTsrEndgameLobbyUI();
        refreshTsrEndgamePanels();
    }, 50);
}

initTsrEndgameExtensions();

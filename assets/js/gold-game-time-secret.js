// 时光秘境
const TSR_CURRENCY_MAX = 1000000;
/** 局内秘境币获取总倍率（相对历史数值下调） */
const TSR_RUN_CURRENCY_GAIN_SCALE = 0.1;

/** 是否处于教学局（含即将开局的 pendingTutorial）：教学进度一律不外带 */
function isTsrTutorialRun() {
    const tsr = typeof player !== 'undefined' ? player?.timeSecretRealm : null;
    if (!tsr) return false;
    return !!(tsr.pendingTutorial || tsr.currentRun?.isTutorial);
}

function cloneTsrJsonValue(value) {
    if (value == null || typeof value !== 'object') return value;
    try {
        return JSON.parse(JSON.stringify(value));
    } catch (e) {
        return value;
    }
}

/** 开教学局前快照永久养成（不含 currentRun） */
function captureTsrTutorialMetaSnapshot() {
    const tsr = player?.timeSecretRealm;
    if (!tsr) return null;
    const keys = [];
    const snap = {};
    Object.keys(tsr).forEach((k) => {
        if (k === 'currentRun' || k === 'pendingTutorial' || k === '_tutorialMetaSnapshot') return;
        keys.push(k);
        snap[k] = cloneTsrJsonValue(tsr[k]);
    });
    snap.__keys = keys;
    return snap;
}

/** 教学局结束后还原永久养成；仅保留 tutorialCompleted / tutorialRuns */
function restoreTsrTutorialMetaSnapshot(snap, keep) {
    const tsr = player?.timeSecretRealm;
    if (!tsr || !snap || !Array.isArray(snap.__keys)) return false;
    keep = keep || {};
    const currentRun = tsr.currentRun;
    const pendingTutorial = tsr.pendingTutorial;
    Object.keys(tsr).forEach((k) => {
        if (k === 'currentRun' || k === 'pendingTutorial' || k === '_tutorialMetaSnapshot') return;
        if (!snap.__keys.includes(k)) delete tsr[k];
    });
    snap.__keys.forEach((k) => {
        tsr[k] = cloneTsrJsonValue(snap[k]);
    });
    if (keep.tutorialCompleted != null) tsr.tutorialCompleted = keep.tutorialCompleted;
    if (keep.tutorialRuns != null) tsr.tutorialRuns = keep.tutorialRuns;
    tsr.currentRun = currentRun;
    tsr.pendingTutorial = pendingTutorial;
    return true;
}

/** 时空赌局：每 N 层可参与 1 次（全随机玩法，不可自选） */
const TSR_SPACE_GAMBLE_FLOOR_INTERVAL = 5;
const TSR_SPACE_GAMBLE_PER_WINDOW = 1;
const TSR_SPACE_GAMBLE_KINDS = ['time', 'might', 'spirit', 'equip', 'badge', 'blood', 'surge', 'fate'];
const TSR_SPACE_GAMBLE_KIND_NAMES = {
    time: '时间骰', might: '战意骰', spirit: '灵潮骰', equip: '装匣',
    badge: '徽印', blood: '回春押', surge: '狂潮台', fate: '命运轮'
};
/** 永恒符文：仅作用于秘境内战力（随 clearFloor/高 dm 上调） */
const TSR_ETERNAL_BONUS_PER_PURCHASE = 0.05;
const TSR_ETERNAL_BONUS_MAX = 0.85;
const TSR_ETERNAL_BONUS_MAX_PERCENT = Math.round(TSR_ETERNAL_BONUS_MAX * 100);
const TSR_ETERNAL_RUNE_MAX_PURCHASE = 16;
/** 时间沙漏 / 层时 / 通关赏等永久店硬顶 */
const TSR_BASE_TIME_PER_PURCHASE = 90;
const TSR_BASE_TIME_BONUS_MAX = 1440;
const TSR_FLOOR_TIME_PER_PURCHASE = 4;
const TSR_FLOOR_TIME_BONUS_MAX = 48;
const TSR_CLEAR_REWARD_BONUS_MAX = 0.55;
const TSR_EXPLORE_TIME_SAVE_MAX = 0.28;
const TSR_COUNTER_REDUCE_MAX = 0.6;
const TSR_SPIRIT_HEAL_AMP_MAX = 0.4;
const TSR_STAR_SPIRIT_STRIKE_MAX = 0.5;
const TSR_STAR_DOMAIN_SIGIL_MAX = 0.15;
const TSR_ARCHON_FRAGMENT_MAX = 0.3;
const TSR_AFFIX_TOME_MAX = 0.4;
const TSR_RELIC_SLOTS_BONUS_MAX = 2;
/** 主世界地图商店：每次+100%，上限 100000%（对应系数 1000） */
const TSR_MAINWORLD_BONUS_PER_PURCHASE = 1;
const TSR_MAINWORLD_BONUS_MAX = 1000;
const TSR_MAINWORLD_BONUS_MAX_PERCENT = TSR_MAINWORLD_BONUS_MAX * 100;
const TSR_MAINWORLD_MAX_PURCHASE = 1000;
const TSR_SPIRIT_MAX_LEVEL = 40;
const TSR_SPIRIT_MAX_BOND = 100;
const TSR_SPIRIT_EVOLVE_NAMES = ['时光幼灵', '流萤精灵', '星辉守护', '永恒神使', '终焉星灵'];
const TSR_SPIRIT_EVOLVE_LEVELS = [1, 10, 20, 30, 40];
const TSR_SPIRIT_EVOLVE_META = [
    { icon: '🌱', tagClass: 'evo-0', combatBonus: 0, spiritStrikeBonus: 0, desc: '初生的时光微光' },
    { icon: '✨', tagClass: 'evo-1', combatBonus: 0.06, spiritStrikeBonus: 6, desc: '流萤之躯，灵息初成' },
    { icon: '🌟', tagClass: 'evo-2', combatBonus: 0.1, spiritStrikeBonus: 12, desc: '星辉守护，战阵共鸣' },
    { icon: '👼', tagClass: 'evo-3', combatBonus: 0.15, spiritStrikeBonus: 20, desc: '永恒神使，灵域通行' },
    { icon: '💫', tagClass: 'evo-4', combatBonus: 0.22, spiritStrikeBonus: 34, desc: '终焉星灵，万灵归一' }
];
const TSR_SPIRIT_LEVEL_MILESTONES = [
    { level: 5, currency: 15000, skillPoints: 1, label: '初识灵息' },
    { level: 10, currency: 35000, skillPoints: 2, label: '流萤之约' },
    { level: 15, currency: 58000, skillPoints: 2, label: '星辉共鸣' },
    { level: 20, currency: 88000, skillPoints: 3, label: '守护觉醒' },
    { level: 25, currency: 120000, skillPoints: 3, label: '羁绊永恒' },
    { level: 30, currency: 200000, skillPoints: 5, label: '神使降临' },
    { level: 35, currency: 280000, skillPoints: 4, label: '超越之兆' },
    { level: 40, currency: 450000, skillPoints: 6, label: '终焉星临' }
];
const TSR_SPIRIT_SKILLS = {
    charge1: { id: 'charge1', name: '灵息感应', icon: '💫', desc: '精灵充能效率+10%', cost: 1, need: [], effect: { chargeMult: 0.1 } },
    heal1: { id: 'heal1', name: '愈灵之光', icon: '💗', desc: '触发回血+6%', cost: 1, need: [], effect: { healBonus: 0.06 } },
    time1: { id: 'time1', name: '时光回响', icon: '⏱️', desc: '触发加时+6秒', cost: 1, need: [], effect: { timeBonus: 6 } },
    charge2: { id: 'charge2', name: '灵脉涌流', icon: '🌊', desc: '充能效率+15%', cost: 2, need: ['charge1'], effect: { chargeMult: 0.15 } },
    bond1: { id: 'bond1', name: '羁绊深化', icon: '🔗', desc: '触发时亲密度+3', cost: 2, need: ['heal1'], effect: { bondOnTrigger: 3 } },
    start1: { id: 'start1', name: '伴行初光', icon: '🌅', desc: '开局+12秒', cost: 2, need: ['time1'], effect: { startTime: 12 } },
    double1: { id: 'double1', name: '双波共鸣', icon: '〰️', desc: '共鸣概率+8%', cost: 3, need: ['charge2', 'heal1'], effect: { doubleChance: 0.08 } },
    special1: { id: 'special1', name: '秘境眷顾', icon: '🍀', desc: '特殊房间率+3%', cost: 3, need: ['bond1'], effect: { specialRoom: 0.03 } },
    currency1: { id: 'currency1', name: '星币牵引', icon: '💰', desc: '局内币收益+5%', cost: 3, need: ['start1'], effect: { currencyBonus: 0.05 } },
    master: { id: 'master', name: '灵王真意', icon: '👑', desc: '全精灵效果+15%', cost: 5, need: ['double1', 'special1', 'currency1'], effect: { allMult: 0.15 } },
    exp1: { id: 'exp1', name: '灵悟之心', icon: '📖', desc: '精灵触发时额外经验+12', cost: 2, need: ['heal1'], effect: { triggerExpBonus: 12 } },
    rally1: { id: 'rally1', name: '战阵共鸣', icon: '⚔️', desc: '战斗胜利精灵充能+8', cost: 2, need: ['charge1'], effect: { battleChargeBonus: 8 } },
    harvest1: { id: 'harvest1', name: '灵园亲和', icon: '🌺', desc: '精灵房间收益+50%', cost: 3, need: ['bond1', 'time1'], effect: { spiritRoomMult: 0.5 } },
    warBless: { id: 'warBless', name: '战灵加护', icon: '⚔️', desc: '战斗攻击+11%，灵击伤害+30%', cost: 3, need: ['rally1'], effect: { battleAttack: 0.11, spiritStrikeMult: 0.3 } },
    ward1: { id: 'ward1', name: '灵盾庇护', icon: '🛡️', desc: '反击伤害-5%', cost: 2, need: ['heal1'], effect: { counterReduce: 0.05 } },
    heal2: { id: 'heal2', name: '深愈之泉', icon: '💧', desc: '触发回血+7%', cost: 2, need: ['heal1'], effect: { healBonus: 0.07 } },
    time2: { id: 'time2', name: '时光延展', icon: '⌛', desc: '触发加时+10秒', cost: 2, need: ['time1'], effect: { timeBonus: 10 } },
    bond2: { id: 'bond2', name: '羁绊升华', icon: '💞', desc: '触发时亲密度+5', cost: 3, need: ['bond1'], effect: { bondOnTrigger: 5 } },
    charge3: { id: 'charge3', name: '灵潮奔涌', icon: '🌊', desc: '充能效率+18%', cost: 3, need: ['charge2'], effect: { chargeMult: 0.18 } },
    strike2: { id: 'strike2', name: '灵刃锐化', icon: '🗡️', desc: '灵击伤害+40%', cost: 3, need: ['warBless'], effect: { spiritStrikeMult: 0.4 } },
    battle2: { id: 'battle2', name: '战意沸腾', icon: '🔥', desc: '战斗攻击+11%', cost: 3, need: ['warBless'], effect: { battleAttack: 0.11 } },
    spiritSight: { id: 'spiritSight', name: '灵视洞察', icon: '👁️', desc: '特殊房间+4%，精灵房收益+25%', cost: 3, need: ['special1', 'harvest1'], effect: { specialRoom: 0.04, spiritRoomMult: 0.25 } },
    symbiosis: { id: 'symbiosis', name: '共生战阵', icon: '🤝', desc: '战斗胜利充能+12，攻击+5%', cost: 4, need: ['rally1', 'bond2'], effect: { battleChargeBonus: 12, battleAttack: 0.05 } },
    critBless: { id: 'critBless', name: '灵爆共鸣', icon: '💥', desc: '共鸣概率+5%，触发经验+20', cost: 3, need: ['double1'], effect: { doubleChance: 0.05, triggerExpBonus: 20 } },
    eternalPulse: { id: 'eternalPulse', name: '永恒灵脉冲', icon: '🌟', desc: '全效果+12%，灵击+22%', cost: 5, need: ['strike2', 'battle2', 'charge3'], effect: { allMult: 0.12, spiritStrikeMult: 0.22 } },
    ward2: { id: 'ward2', name: '灵盾升华', icon: '🛡️', desc: '反击伤害-10%', cost: 3, need: ['ward1'], effect: { counterReduce: 0.1 } },
    bond3: { id: 'bond3', name: '永恒羁绊', icon: '💎', desc: '触发时亲密度+8', cost: 4, need: ['bond2'], effect: { bondOnTrigger: 8 } },
    sagePath: { id: 'sagePath', name: '学者灵脉', icon: '📚', desc: '精灵房+40%，特殊房+5%', cost: 4, need: ['spiritSight', 'harvest1'], effect: { spiritRoomMult: 0.4, specialRoom: 0.05 } },
    rally2: { id: 'rally2', name: '战阵进阶', icon: '🏹', desc: '战斗胜利充能+18', cost: 3, need: ['symbiosis'], effect: { battleChargeBonus: 18 } },
    bossSoul: { id: 'bossSoul', name: '猎王灵魄', icon: '👑', desc: '首领战攻击+18%，灵击+35%', cost: 4, need: ['strike2', 'battle2'], effect: { bossSpiritAttack: 0.18, spiritStrikeMult: 0.35 } },
    transcendentEye: { id: 'transcendentEye', name: '超越灵视', icon: '👁️', desc: '特殊房+6%，触发经验+30', cost: 4, need: ['spiritSight', 'critBless'], effect: { specialRoom: 0.06, triggerExpBonus: 30 } },
    nexusHeart: { id: 'nexusHeart', name: '灵枢之心', icon: '💠', desc: '全效果+10%，精灵房+30%', cost: 5, need: ['sagePath', 'rally2'], effect: { allMult: 0.1, spiritRoomMult: 0.3 } },
    apocalypseCrown: { id: 'apocalypseCrown', name: '终焉灵冠', icon: '💀', desc: '全效果+18%，战斗攻击+13%', cost: 6, need: ['eternalPulse', 'nexusHeart'], effect: { allMult: 0.18, battleAttack: 0.13 } },
    starOrigin: { id: 'starOrigin', name: '星灵本源', icon: '🌌', desc: '全效果+22%，灵击+40%（需终焉星灵）', cost: 7, need: ['apocalypseCrown'], needEvo: 4, effect: { allMult: 0.22, spiritStrikeMult: 0.4 } },
    starVeil: { id: 'starVeil', name: '星幕庇护', icon: '🛡️', desc: '反击-12%，触发回血+8%（需星灵本源）', cost: 5, need: ['starOrigin'], needEvo: 4, effect: { counterReduce: 0.12, healBonus: 0.08 } },
    apocalypsePulse: { id: 'apocalypsePulse', name: '终焉脉冲', icon: '💥', desc: '战斗攻击+12%，触发经验+35', cost: 5, need: ['starOrigin'], needEvo: 4, effect: { battleAttack: 0.12, triggerExpBonus: 35 } },
    starDominion: { id: 'starDominion', name: '星域统御', icon: '👑', desc: '全效果+12%，特殊房+8%，精灵房+35%', cost: 8, need: ['starVeil', 'apocalypsePulse'], needEvo: 4, effect: { allMult: 0.12, specialRoom: 0.08, spiritRoomMult: 0.35 } },
    starJudgment: { id: 'starJudgment', name: '星域审判', icon: '⚖️', desc: '首领攻击+22%，灵击+45%（需星域统御）', cost: 6, need: ['starDominion'], needEvo: 4, effect: { bossSpiritAttack: 0.22, spiritStrikeMult: 0.45 } },
    affixHunter: { id: 'affixHunter', name: '词条猎脉', icon: '🎯', desc: '词条赏金+12%，对词条怪反击-8%', cost: 3, need: ['critBless'], effect: { affixReward: 0.12, affixCounterReduce: 0.08 } },
    codexPath: { id: 'codexPath', name: '图鉴灵径', icon: '📖', desc: '词条赏金+10%，特殊房+4%', cost: 3, need: ['affixHunter'], effect: { affixReward: 0.1, specialRoom: 0.04 } },
    starAffixBreak: { id: 'starAffixBreak', name: '词条破界', icon: '🏷️', desc: '对带词条怪：攻击+10%，灵击+28%，赏金+20%，反击-12%', cost: 6, need: ['starJudgment'], needEvo: 4, effect: { affixAttack: 0.1, affixSpiritStrike: 0.28, affixReward: 0.2, affixCounterReduce: 0.12 } },
    libraryPath: { id: 'libraryPath', name: '秘闻灵径', icon: '📚', desc: '特殊房+5%，局内币+3%', cost: 3, need: ['codexPath'], effect: { specialRoom: 0.05, currencyBonus: 0.03 } },
    wishStar: { id: 'wishStar', name: '星愿感应', icon: '🌠', desc: '充能+12%，触发经验+15', cost: 3, need: ['spiritSight'], effect: { chargeMult: 0.12, triggerExpBonus: 15 } },
    chronosLeaf: { id: 'chronosLeaf', name: '时序之叶', icon: '🍃', desc: '触发加时+8秒，充能+10%', cost: 3, need: ['time2'], effect: { timeBonus: 8, chargeMult: 0.1 } },
    voidPulse: { id: 'voidPulse', name: '虚空脉冲', icon: '🕳️', desc: '虚空共鸣+25%，战斗攻击+8%', cost: 4, need: ['rally1'], effect: { resonanceGain: 0.25, battleAttack: 0.08 } },
    chromaticHeart: { id: 'chromaticHeart', name: '炫彩之心', icon: '🌈', desc: '事件+10%，特殊房+6%，灵击+16%', cost: 4, need: ['spiritSight'], effect: { eventBonus: 0.1, specialRoom: 0.06, spiritStrikeMult: 0.16 } },
    singularityCore: { id: 'singularityCore', name: '奇点灵核', icon: '💠', desc: '全效果+10%，虚空共鸣+20%（需终焉星灵）', cost: 6, need: ['starDominion'], needEvo: 4, effect: { allMult: 0.1, resonanceGain: 0.2 } }
};
const TSR_SPIRIT_TRIAL_LINES = {
    intro: ['「我是你羁绊的倒影，打赢我就证明你配驭灵。」', '「灵脉试炼开始——别怕，我也才三成力。」', '「时光管理局特派试炼官，请出示你的精灵等级。」'],
    win: ['「试炼通过！灵力认可你了。」', '「不错，这羁绊够格继续往下走。」', '「过关！精灵在你肩上转了三圈表示满意。」'],
    lose: ['「试炼失败……下次记得先喂饱精灵再来。」', '「灵力不足，回去练练灵脉吧。」']
};
let _tsrShopActiveTab = 'all';
const TSR_BOSS_FLOOR_INTERVAL = 10;
const TSR_SHRINE_FLOOR_INTERVAL = 8;
const TSR_ELITE_FLOOR_INTERVAL = 5;
const TSR_RELIC_MAX = 3;
const TSR_EQUIP_BAG_BASE = 8;
const TSR_EQUIP_BAG_BONUS_MAX = 4;
const TSR_EQUIP_SLOTS = ['weapon', 'armor', 'ring', 'chronos'];
const TSR_EQUIP_SLOT_META = {
    weapon: { name: '武器', icon: '⚔️', primary: 'attack' },
    armor: { name: '护甲', icon: '🛡️', primary: 'health' },
    ring: { name: '戒指', icon: '💍', primary: 'critRate' },
    chronos: { name: '时环', icon: '⏱️', primary: 'critDamage' }
};
const TSR_EQUIP_PREFIXES = ['流光', '逆流', '星辉', '虚空', '秘银', '锈迹', '终焉', '时序', '灵锻', '裂隙'];
const TSR_EQUIP_SUFFIX = {
    weapon: ['之刃', '战刃', '断剑', '长枪', '权杖'],
    armor: ['战甲', '披风', '护胸', '壁垒', '鳞甲'],
    ring: ['之戒', '诺言', '信物', '灵环'],
    chronos: ['时环', '沙漏', '罗盘', '刻印']
};
// 局内装备基础词条（高难下再抬一轮）
const TSR_EQUIP_TIER_STAT = {
    common: { mult: 1.5, attack: 0.1, health: 0.11, critRate: 0.035, critDamage: 0.11, counterReduce: 0.035 },
    uncommon: { mult: 1.9, attack: 0.13, health: 0.14, critRate: 0.05, critDamage: 0.14, counterReduce: 0.05 },
    rare: { mult: 2.4, attack: 0.17, health: 0.18, critRate: 0.065, critDamage: 0.18, counterReduce: 0.07 },
    epic: { mult: 3.0, attack: 0.2, health: 0.21, critRate: 0.08, critDamage: 0.21, counterReduce: 0.09 },
    legendary: { mult: 3.7, attack: 0.25, health: 0.26, critRate: 0.1, critDamage: 0.26, counterReduce: 0.11 },
    mythic: { mult: 4.55, attack: 0.31, health: 0.32, critRate: 0.12, critDamage: 0.32, counterReduce: 0.13 }
};
/** 额外全局装备强度系数（叠在品质倍率上） */
const TSR_EQUIP_POWER_MULT = 1.45;
const TSR_EQUIP_TIER_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
const TSR_EQUIP_ENHANCE_MAX = 5;
const TSR_EQUIP_ENHANCE_PER_LEVEL = 0.125;
/** 分解实得局内币（skipGainScale，与按钮显示一致；整体低于旧版折算后到手） */
const TSR_EQUIP_SALVAGE_VALUE = { common: 2, uncommon: 3, rare: 5, epic: 8, legendary: 12, mythic: 18 };
const TSR_EQUIP_SETS = {
    liuguang: { prefix: '流光', name: '流光套', icon: '✨', desc2: '攻击+7%', desc4: '攻击+8%，暴击+5%', bonus2: { attack: 0.07 }, bonus4: { attack: 0.08, critRate: 0.05 } },
    niliu: { prefix: '逆流', name: '逆流套', icon: '🌊', desc2: '生命+8%', desc4: '生命+10%，反击-8%', bonus2: { health: 0.08 }, bonus4: { health: 0.1, counterReduce: 0.08 } },
    xinghui: { prefix: '星辉', name: '星辉套', icon: '🌟', desc2: '暴击+4%', desc4: '暴伤+15%，暴击+5%', bonus2: { critRate: 0.04 }, bonus4: { critDamage: 0.15, critRate: 0.05 } },
    xukong: { prefix: '虚空', name: '虚空套', icon: '🕳️', desc2: '反击-5%', desc4: '攻击+10%，反击-10%', bonus2: { counterReduce: 0.05 }, bonus4: { attack: 0.1, counterReduce: 0.1 } },
    miyin: { prefix: '秘银', name: '秘银套', icon: '🪙', desc2: '生命+7%', desc4: '攻血+8%', bonus2: { health: 0.07 }, bonus4: { attack: 0.08, health: 0.08 } },
    zhongyan: { prefix: '终焉', name: '终焉套', icon: '💀', desc2: '攻击+8%', desc4: '攻血+10%，暴伤+12%', bonus2: { attack: 0.08 }, bonus4: { attack: 0.1, health: 0.1, critDamage: 0.12 } },
    shixu: { prefix: '时序', name: '时序套', icon: '⌛', desc2: '暴伤+8%', desc4: '暴击+6%，暴伤+15%', bonus2: { critDamage: 0.08 }, bonus4: { critRate: 0.06, critDamage: 0.15 } },
    lingduan: { prefix: '灵锻', name: '灵锻套', icon: '⚒️', desc2: '攻血+5%', desc4: '攻血+7%，暴击+4%', bonus2: { attack: 0.05, health: 0.05 }, bonus4: { attack: 0.07, health: 0.07, critRate: 0.04 } },
    liexi: { prefix: '裂隙', name: '裂隙套', icon: '💠', desc2: '暴击+3%，反击-4%', desc4: '攻击+13%，暴击+6%', bonus2: { critRate: 0.03, counterReduce: 0.04 }, bonus4: { attack: 0.13, critRate: 0.06 } },
    xiuji: { prefix: '锈迹', name: '锈迹套', icon: '🗡️', desc2: '攻击+4%', desc4: '攻击+10%，生命+7%', bonus2: { attack: 0.04 }, bonus4: { attack: 0.1, health: 0.07 } },
    xingyu: { prefix: '星域', name: '星域神装', icon: '👑', exclusive: true, dropHint: '击败终焉星域主宰', desc2: '攻击+10%', desc4: '攻击+13%，暴击+8%', bonus2: { attack: 0.1 }, bonus4: { attack: 0.13, critRate: 0.08 } },
    baojun: { prefix: '暴君', name: '暴君战装', icon: '🔱', exclusive: true, dropHint: '击败天穹暴君', desc2: '攻击+9%，生命+6%', desc4: '攻击+15%，暴伤+18%', bonus2: { attack: 0.09, health: 0.06 }, bonus4: { attack: 0.15, critDamage: 0.18 } },
    dihuang: { prefix: '帝皇', name: '帝皇灵装', icon: '🌌', exclusive: true, dropHint: '击败精灵帝皇', desc2: '暴击+6%，生命+6%', desc4: '攻血+11%，暴伤+15%', bonus2: { critRate: 0.06, health: 0.06 }, bonus4: { attack: 0.11, health: 0.11, critDamage: 0.15 } },
    omegax: { prefix: 'Ω序', name: 'Ω序机装', icon: '⚙️', exclusive: true, dropHint: 'Ω序难度首领战', desc2: '攻击+10%，暴击+4%', desc4: '攻击+14%，暴击+6%，暴伤+12%', bonus2: { attack: 0.1, critRate: 0.04 }, bonus4: { attack: 0.14, critRate: 0.06, critDamage: 0.12 } },
    qidian: { prefix: '奇点', name: '奇点湮灭装', icon: '💠', exclusive: true, dropHint: '奇点难度神话首领', desc2: '攻血+8%', desc4: '攻血+15%，暴击+7%，反击-10%', bonus2: { attack: 0.08, health: 0.08 }, bonus4: { attack: 0.15, health: 0.15, critRate: 0.07, counterReduce: 0.1 } }
};
const TSR_EQUIP_EXCLUSIVE_STAT_MULT = 1.42;
const TSR_EQUIP_REFORGE_MAX_PER_ITEM = 8;
const TSR_EQUIP_EXCLUSIVE_NAMES = {
    xingyu: {
        weapon: { name: '星域审判之刃', icon: '⚔️' },
        armor: { name: '星域王冠战甲', icon: '🛡️' },
        ring: { name: '星域统御之戒', icon: '💍' },
        chronos: { name: '星域终焉时环', icon: '⏱️' }
    },
    baojun: {
        weapon: { name: '暴君裂天刃', icon: '⚔️' },
        armor: { name: '暴君星冠战甲', icon: '🛡️' },
        ring: { name: '暴君裁决之戒', icon: '💍' },
        chronos: { name: '暴君时蚀刻印', icon: '⏱️' }
    },
    dihuang: {
        weapon: { name: '帝皇灵刃', icon: '⚔️' },
        armor: { name: '帝皇灵袍', icon: '🛡️' },
        ring: { name: '帝皇敕令之戒', icon: '💍' },
        chronos: { name: '帝皇时冕', icon: '⏱️' }
    },
    omegax: {
        weapon: { name: 'Ω序崩坏之刃', icon: '⚔️' },
        armor: { name: 'Ω序齿轮战甲', icon: '🛡️' },
        ring: { name: 'Ω序契约之戒', icon: '💍' },
        chronos: { name: 'Ω序时序轮', icon: '⏱️' }
    },
    qidian: {
        weapon: { name: '奇点湮灭刃', icon: '⚔️' },
        armor: { name: '奇点归墟甲', icon: '🛡️' },
        ring: { name: '奇点坍缩之戒', icon: '💍' },
        chronos: { name: '奇点零时环', icon: '⏱️' }
    }
};
const TSR_EQUIP_EXCLUSIVE_DROPS = {
    stararchon: { setId: 'xingyu', chance: 0.22, tier: 'legendary' },
    celestialtyrant: { setId: 'baojun', chance: 0.2, tier: 'legendary' },
    spiritemperor: { setId: 'dihuang', chance: 0.18, tier: 'legendary' }
};
const TSR_LOG_DOM_MAX = 120;

/** 日志彩色高亮：按关键词自动着色（先 escape 再包裹 span） */
const TSR_RICH_RULES = [
    { re: /【([^】]+)】/g, wrap: 'bracket', full: true },
    { re: /(成就解锁|契约羁绊|动态遭遇|本周界词|今日星运|传奇见闻|彩运轮盘|传奇见闻馆)/g, cls: 'em' },
    { re: /(层间词缀|怪物词条|词条赏金|词条行者|词条熔炉|词条狩猎)/g, cls: 'affix' },
    { re: /(精灵|灵击|充能|亲密度|羁绊|灵息|灵脉)/g, cls: 'spirit' },
    { re: /(遗物|祭坛|磁石|通晓书|棱镜)/g, cls: 'relic' },
    { re: /(局内装备|装备|武器|护甲|戒指|时环)/g, cls: 'equip' },
    { re: /(首领|精英|神话|终焉|暴君|帝皇|主宰|三连战)/g, cls: 'boss' },
    { re: /(秘境币|\+?\d+币|\d+秘境币)/g, cls: 'gold' },
    { re: /(\+\d+秒|-\d+秒|\+\d+%|-\d+%)/g, cls: 'num' },
    { re: /(冠军|殿堂|奖章)/g, cls: 'champion' },
    { re: /(梗|恶趣味|PPT|OKR|996|路演)/g, cls: 'meme' },
    { re: /(契约|双契约|彩运)/g, cls: 'contract' },
    { re: /(伤害|诅咒|厄运|反击|窃取|噬灵|虚空|奇点|末日)/g, cls: 'danger' },
    { re: /(恢复|回血|祈福|奖励|胜利|共鸣爆发)/g, cls: 'heal' },
    { re: /(命运卡牌|虚空共鸣|元素试炼|彩光神龛|悖论之门|禁忌图录)/g, cls: 'fortune' },
    { re: /(Ω序|奇点|虚空难度|终焉+)/g, cls: 'epic' },
    { re: /(虹彩|霓虹|溢彩|炫彩)/g, cls: 'rainbow' }
];

const TSR_LOG_THEME_CLASS = {
    success: 'tsr-log-success', warning: 'tsr-log-warning', error: 'tsr-log-error',
    info: 'tsr-log-info', shop: 'tsr-log-shop',
    affix: 'tsr-log-theme-affix', spirit: 'tsr-log-theme-spirit', relic: 'tsr-log-theme-relic',
    boss: 'tsr-log-theme-boss', gold: 'tsr-log-theme-gold', meme: 'tsr-log-theme-meme',
    contract: 'tsr-log-theme-contract', champion: 'tsr-log-theme-champion', fortune: 'tsr-log-theme-fortune',
    legend: 'tsr-log-theme-legend', epic: 'tsr-log-theme-epic', rainbow: 'tsr-log-theme-rainbow', void: 'tsr-log-theme-void'
};

const TSR_FLOOR_AFFIX_THEMES = {
    affixStorm: 'affix', relicGlow: 'relic', championAura: 'champion', bondTide: 'spirit',
    rainbowTide: 'rainbow', legendEcho: 'legend', starCrown: 'epic', apocalypseMoon: 'boss',
    chronoFlux: 'gold', memeFiesta: 'meme', relicStorm: 'relic', libraryGlow: 'legend', wishTide: 'spirit',
    voidSurge: 'void', singularityPulse: 'epic', chromaticStorm: 'rainbow', doomEcho: 'boss'
};

/** 每日星运：大厅展示，每局开局自动注入 */
const TSR_STAR_FORTUNES = [
    { id: 'goldStar', name: '财星高照', icon: '🌟', desc: '秘境币+15%', theme: 'gold' },
    { id: 'spiritBloom', name: '灵息花绽', icon: '🌸', desc: '精灵充能效率+35%', theme: 'spirit' },
    { id: 'battleFlare', name: '战意炽焰', icon: '🔥', desc: '战斗奖励+12%，攻击+8%', theme: 'boss' },
    { id: 'memeRainbow', name: '梗色霓虹', icon: '🌈', desc: '梗房遭遇+40%，梗房收益+15%', theme: 'meme' },
    { id: 'relicGlimmer', name: '遗宝微光', icon: '✨', desc: '精英遗物率+10%', theme: 'relic' },
    { id: 'bondWarmth', name: '羁绊暖潮', icon: '💞', desc: '触发回血+6%，亲密度触发+2', theme: 'spirit' },
    { id: 'fortuneWild', name: '野运翻涌', icon: '🎲', desc: '赌局+12%，随机事件币+10%', theme: 'fortune' },
    { id: 'chronoBloom', name: '时序花绽', icon: '🌺', desc: '行动耗时-10%，每层+3秒', theme: 'gold' },
    { id: 'codexLight', name: '图鉴微光', icon: '📖', desc: '特殊房+12%，词条赏金+8%', theme: 'relic' },
    { id: 'stormPulse', name: '乱流脉冲', icon: '🌪️', desc: '战斗奖励+15%，陷阱率-10%', theme: 'boss' },
    { id: 'voidWhisper', name: '虚空低语', icon: '🕳️', desc: '怪物+8%，奖励+18%', theme: 'void' },
    { id: 'singularityGleam', name: '奇点微光', icon: '💠', desc: '攻击+10%，每层-2秒，币+12%', theme: 'epic' },
    { id: 'chromaticDawn', name: '虹彩黎明', icon: '🌈', desc: '事件+15%，特殊房+10%', theme: 'rainbow' }
];

const TSR_STAR_FORTUNE_EFFECTS = {
    goldStar: { currencyMod: 0.15 },
    spiritBloom: { spiritMult: 1.35 },
    battleFlare: { battleReward: 0.12, attack: 0.08 },
    memeRainbow: { memeMult: 1.4, currencyMod: 0.05 },
    relicGlimmer: { relicMagnet: 0.1 },
    bondWarmth: { spiritHealBonus: 0.06, bondOnTrigger: 2 },
    fortuneWild: { gamble: 0.12, eventCurrency: 0.1 },
    chronoBloom: { timeSave: 0.1, floorTime: 3 },
    codexLight: { specialRoomMult: 1.12, affixReward: 0.08 },
    stormPulse: { battleReward: 0.15, trapRate: -0.1 },
    voidWhisper: { monsterMult: 0.08, currencyMod: 0.18 },
    singularityGleam: { attack: 0.1, floorTime: -2, currencyMod: 0.12 },
    chromaticDawn: { eventBonus: 0.15, specialRoomMult: 1.1 }
};

/** 命运卡牌：开局三选一，高风险高回报 */
const TSR_FATE_CARDS = {
    bloodOath: { id: 'bloodOath', name: '血誓', icon: '🩸', desc: '攻击+22%，每层-3秒', attack: 0.22, floorTime: -3, theme: 'danger' },
    timeVault: { id: 'timeVault', name: '时库', icon: '🏦', desc: '开局+45秒，奖励-10%', timeMod: 45, currencyPenalty: 0.1, theme: 'gold' },
    voidWhisper: { id: 'voidWhisper', name: '虚空低语', icon: '🕳️', desc: '怪物+15%，奖励+20%', monsterMult: 0.15, currencyMod: 0.2, theme: 'void' },
    spiritBloom: { id: 'spiritBloom', name: '灵绽', icon: '🌸', desc: '精灵充能+50%，起始-20秒', spiritMult: 1.5, timeMod: -20, theme: 'spirit' },
    gamblerFate: { id: 'gamblerFate', name: '赌徒', icon: '🎲', desc: '赌局+15%，生命-12%', gamble: 0.15, health: -0.12, theme: 'fortune' },
    affixOracle: { id: 'affixOracle', name: '词条预言', icon: '🏷️', desc: '词条率+25%，反击+5%', affixRollBoost: 0.25, counterPenalty: 0.05, theme: 'affix' },
    rainbowBless: { id: 'rainbowBless', name: '虹彩祝福', icon: '🌈', desc: '事件+18%，特殊房+12%', eventBonus: 0.18, specialRoomMult: 1.12, theme: 'rainbow' },
    ironCurse: { id: 'ironCurse', name: '铁幕', icon: '⛓️', desc: '生命+20%，行动+8%', health: 0.2, timeCost: 0.08, theme: 'contract' },
    doomClock: { id: 'doomClock', name: '末日钟', icon: '⏰', desc: '每层-4秒，战斗奖励+18%', floorTime: -4, battleReward: 0.18, theme: 'boss' },
    nexusLink: { id: 'nexusLink', name: '共鸣链', icon: '💠', desc: '虚空共鸣+35%，灵击+15%', resonanceGain: 0.35, spiritStrikeMult: 0.15, theme: 'relic' },
    paradoxSeed: { id: 'paradoxSeed', name: '悖论种', icon: '♾️', desc: '预览2层，怪物+10%，币+15%', roomPreview: 2, monsterMult: 0.1, currencyMod: 0.15, theme: 'epic' },
    chromaticFlare: { id: 'chromaticFlare', name: '炫彩', icon: '✨', desc: '梗房×1.3，事件+12%，每层+2秒', memeMult: 1.3, eventBonus: 0.12, floorTime: 2, theme: 'rainbow' }
};
const TSR_VOID_RESONANCE_MAX = 100;
const TSR_VOID_RESONANCE_BURST = { heal: 0.25, time: 35, currency: 180, spiritCharge: 40 };
const TSR_FLOOR_HISTORY_MAX = 40;
const TSR_DIFFICULTY_TIERS = { easy: 0, normal: 1, hard: 2, nightmare: 3, hell: 4, abyss: 5, eternal: 6, transcendent: 7, apocalypse: 8, void: 9, omega: 10, singularity: 11 };
const TSR_BOSS_CURRENCY_BONUS = 1.5;
const TSR_ELITE_CURRENCY_BONUS = 2.0;
const TSR_MEME_ROOM_TYPES = ['ppt', 'client', 'pdd', 'recall', 'kpi', 'duanzi', 'echo', 'weekly', 'blinddate', 'overtime996', 'lottery', 'standup', 'gacha', 'escape', 'auction', 'gamblersden', 'codereview', 'standup996', 'retrospective', 'interview', 'perfreview', 'teamBuilding', 'layoff', 'okrreview', 'pitchdeck', 'meetingmarathon', 'slackoutage', 'hotfix911'];
const TSR_MEME_ROOM_WEIGHT = 0.02;
const TSR_SPECIAL_ROOM_TYPES = ['oracle', 'fusion', 'timebank', 'storm', 'spiritgarden', 'spiritsanctuary', 'spirittrial', 'monsterhunt', 'roulette', 'vending', 'phantom', 'shrineduel', 'beastlair', 'spiritwell', 'spiritrift', 'spiritmemory', 'spiritbazaar', 'spiritboss', 'spiritoracle', 'spiritforge', 'spiritarena', 'spiritnexus', 'spiritcodex', 'spiritascend', 'spiritstar', 'spiritthrone', 'starfall', 'spiritduel', 'celestialvault', 'timewarp', 'tyrantcourt', 'spiritparade', 'voidrift', 'affixforge', 'affixhunt', 'relicaltar', 'bondsanctuary', 'championhall', 'synergyshrine', 'fortunewheel', 'legendarchive', 'chronolibrary', 'starwishpool', 'mirrormaze', 'runescriptorium', 'timeloom', 'combostorm', 'battlerift', 'wararchive', 'bloodarena', 'doomclock', 'elementaltrial', 'necronomicon', 'stormnexus', 'paradoxgate', 'chromaticshrine', 'voidecho', 'cataclysmgate'];
const TSR_SPECIAL_ROOM_WEIGHT = 0.016;
const TSR_DYNAMIC_ENCOUNTER_CHANCE = 0.09;
/** 秘境内暴击伤害上限 */
const TSR_CRIT_DAMAGE_CAP = 2.5;
const TSR_CRIT_DAMAGE_FLOOR = 1.5;
const TSR_DEATH_COUNTER_RATIO = 0.58;
/** 秘境独立战斗（类似无限深渊，不沿用主世界 player.battle） */
const TSR_COMBAT_BASE = { attack: 68, maxHp: 820, critRate: 0.11, critDamage: 1.62 };
const TSR_COMBAT_META = { perClear: 2.8, perBestFloor: 1.4, perSpiritLv: 2.0, perTotalRuns: 0.35 };
// 旧固定底数仅作兜底；实际战斗按玩家属性 + 通关进度动态锚定
const TSR_MONSTER_STAT_BASE = {
    battle: { hp: 400, atk: 34 },
    elite:  { hp: 780, atk: 52 },
    boss:   { hp: 1580, atk: 86 }
};
const TSR_MONSTER_FLOOR_SCALE = 0.11;
/**
 * 怪物平衡锚定「开局基础战阶」(不含装备/临时增益/精灵战中加成)，
 * 再乘通关进度曲线。局内装备与精灵强化只抬玩家，不被怪同步吃掉。
 */
const TSR_MONSTER_BALANCE = {
    // 怪血/攻相对开局战阶的锚点系数（此前过软，普攻 1～2 下可清房）
    battle: { hpFromAtk: 3.65, atkFromHp: 0.102 },
    elite:  { hpFromAtk: 5.55, atkFromHp: 0.118 },
    boss:   { hpFromAtk: 7.6, atkFromHp: 0.108 },
    curveMin: 0.62,   // 第 1 层：仍留成型窗口，但不再是免费房
    curveMid: 1.02,   // 约 45% 通关进度
    curveMax: 1.38,   // 通关层应有明显血压与反击威胁
    dmPow: 0.24,      // 难度倍率软幂：高难差拉开（如 3.5^0.24≈1.36）
    /** 反击伤害用的难度软幂（勿与怪物 atk 上的 dm 再叠一次硬乘） */
    counterDmPow: 0.16,
    minHp: 55,
    minAtk: 10
};
const TSR_MONSTER_TIER_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
const TSR_MONSTER_TIER_META = {
    common: { label: '普通', cssClass: 'tsr-tier-common', color: '#cbd5e1' },
    uncommon: { label: '优良', cssClass: 'tsr-tier-uncommon', color: '#4ade80' },
    rare: { label: '稀有', cssClass: 'tsr-tier-rare', color: '#38bdf8' },
    epic: { label: '史诗', cssClass: 'tsr-tier-epic', color: '#c084fc' },
    legendary: { label: '传说', cssClass: 'tsr-tier-legendary', color: '#fbbf24' },
    mythic: { label: '神话', cssClass: 'tsr-tier-mythic', color: '#f472b6' }
};
const TSR_MONSTER_TIER_WEIGHT = { common: 10, uncommon: 6, rare: 3.5, epic: 1.8, legendary: 0.65, mythic: 0.22 };
const TSR_MONSTER_TIER_MULT = { common: 1, uncommon: 1.08, rare: 1.18, epic: 1.3, legendary: 1.45, mythic: 1.65 };

const TSR_MONSTER_POOL = {
    battle: [
        { id: 'slime', name: '时光史莱姆', icon: '🫠', tier: 'common', intro: '「咕噜……再拖五分钟……」', win: '史莱姆化为一滩过期的时间。', skill: 'slow', skillChance: 0.22 },
        { id: 'procrast', name: '拖延小妖', icon: '😴', tier: 'common', intro: '「明天再打也来得及吧？」', win: '小妖被你的效率吓跑了。', skill: 'timeDrain', skillChance: 0.25, skillValue: 4 },
        { id: 'deadline', name: 'Deadline亡魂', icon: '💀', tier: 'uncommon', intro: '「截止日前夜，我的主场。」', win: '亡魂消散，闹钟终于安静了。', skill: 'rage', skillChance: 0.3 },
        { id: 'fishworm', name: '摸鱼蠕虫', icon: '🐛', tier: 'common', intro: '「带薪拉屎，了解一下？」', win: '蠕虫钻回工位缝隙。', skill: 'heal', skillChance: 0.18, skillValue: 0.08 },
        { id: 'involute', name: '内卷蠕虫', icon: '🌀', tier: 'uncommon', intro: '「我可以更卷，你能吗？」', win: '蠕虫卷不动了。', skill: 'shield', skillChance: 0.2, skillValue: 0.15 },
        { id: 'bugspirit', name: 'Bug怨灵', icon: '👻', tier: 'uncommon', intro: '「这不是Bug，是特性。」', win: '怨灵被标记为已修复。', skill: 'curse', skillChance: 0.2 },
        { id: 'coffeeghost', name: '咖啡因幽灵', icon: '☕', tier: 'common', intro: '「再来一杯，我还能熬。」', win: '幽灵化为冷掉的咖啡。', skill: 'burst', skillChance: 0.15 },
        { id: 'slackimp', name: '划水小恶魔', icon: '😈', tier: 'common', intro: '「工作？那是下一层的事。」', win: '恶魔被 KPI 吓跑了。', skill: 'slow', skillChance: 0.2 },
        { id: 'spamfly', name: '垃圾邮件蝇', icon: '🪰', tier: 'common', intro: '「您有一封未读……永远未读。」', win: '蝇群被一键清空。', skill: 'curse', skillChance: 0.18 },
        { id: 'alarmwraith', name: '闹钟怨灵', icon: '⏰', tier: 'uncommon', intro: '「再睡五分钟——不，再睡五小时。」', win: '怨灵被关进静音模式。', skill: 'timeDrain', skillChance: 0.28, skillValue: 5 },
        { id: 'cachegoblin', name: '缓存哥布林', icon: '💾', tier: 'rare', intro: '「清缓存？那我的家就没了！」', win: '哥布林被强制刷新。', skill: 'shield', skillChance: 0.25, skillValue: 0.12 },
        { id: 'latencybat', name: '延迟蝙蝠', icon: '🦇', tier: 'rare', intro: '「你的攻击……还在路上……」', win: '蝙蝠被 ping 通了。', skill: 'slow', skillChance: 0.32 },
        { id: 'overtimeimp', name: '加班小鬼', icon: '👹', tier: 'rare', intro: '「自愿加班，真的自愿。」', win: '小鬼签下了劳动法。', skill: 'rage', skillChance: 0.28 },
        { id: 'mimic', name: '宝箱怪', icon: '📦', tier: 'uncommon', intro: '「惊喜吧！」', win: '宝箱怪吐出了硬币。', skill: 'burst', skillChance: 0.3 },
        { id: 'spritelarva', name: '灵息幼虫', icon: '🐛', tier: 'common', intro: '「嗡嗡……你的充能看起来很好吃。」', win: '幼虫化为光点飞走。', skill: 'spiritDrain', skillChance: 0.24, skillValue: 0.15 },
        { id: 'manafly', name: '魔能萤虫', icon: '✨', tier: 'uncommon', intro: '「闪一下，时间就没了。」', win: '萤虫群被拍散。', skill: 'timeDrain', skillChance: 0.26, skillValue: 4 },
        { id: 'cursedsprite', name: '诅咒小精灵', icon: '😈', tier: 'rare', intro: '「我不是你的宠物——至少现在不是。」', win: '诅咒被净化。', skill: 'curse', skillChance: 0.28 },
        { id: 'ticketgnome', name: '工单地精', icon: '🎫', tier: 'common', intro: '「又一张工单，嘿嘿。」', win: '地精被标记为已处理。', skill: 'slow', skillChance: 0.2 },
        { id: 'vpnshade', name: 'VPN幽影', icon: '👤', tier: 'uncommon', intro: '「连接不稳定，你的攻击也是。」', win: '幽影断线了。', skill: 'shield', skillChance: 0.22, skillValue: 0.1 },
        { id: 'standbyghoul', name: '待命食尸鬼', icon: '🧟', tier: 'uncommon', intro: '「随时待命——指永远待命。」', win: '食尸鬼终于下班。', skill: 'heal', skillChance: 0.2, skillValue: 0.07 },
        { id: 'mergeconflict', name: '合并冲突怪', icon: '🔀', tier: 'rare', intro: '「<<<<<< HEAD 你的攻击 =======」', win: '冲突已解决（强制）。', skill: 'rage', skillChance: 0.3 },
        { id: 'cloudbill', name: '云账单精', icon: '☁️', tier: 'rare', intro: '「本月账单已出，请查收。」', win: '账单被申诉成功。', skill: 'timeDrain', skillChance: 0.32, skillValue: 6 },
        { id: 'autoreplybot', name: '自动回复Bot', icon: '🤖', tier: 'common', intro: '「您好，我是智能客服，请问有什么可以帮您？」', win: 'Bot被转人工了。', skill: 'slow', skillChance: 0.25 },
        { id: 'slackbot', name: 'Slack通知精', icon: '💬', tier: 'common', intro: '「@channel 紧急会议，现在。」', win: '通知被设为静音。', skill: 'timeDrain', skillChance: 0.22, skillValue: 3 },
        { id: 'pipelinedemon', name: '流水线恶魔', icon: '⚙️', tier: 'uncommon', intro: '「构建失败，但不知道为什么。」', win: '流水线终于绿了。', skill: 'burst', skillChance: 0.24 },
        { id: 'scopecreep', name: '范围蠕虫', icon: '🐌', tier: 'uncommon', intro: '「再加一个小需求……」', win: '蠕虫被砍回原型。', skill: 'heal', skillChance: 0.2, skillValue: 0.06 },
        { id: 'lintspirit', name: 'Lint怨灵', icon: '👻', tier: 'rare', intro: '「你的代码有3000个警告。」', win: '怨灵被 eslint --fix 了。', skill: 'curse', skillChance: 0.26 },
        { id: 'standupghost', name: '站会幽灵', icon: '👥', tier: 'uncommon', intro: '「昨天做了什么？今天做什么？」', win: '幽灵宣布散会。', skill: 'slow', skillChance: 0.28 },
        { id: 'spiritmote', name: '灵尘微粒', icon: '✨', tier: 'common', intro: '「嗡嗡……灵脉碎片……」', win: '微粒被精灵吸收。', skill: 'spiritDrain', skillChance: 0.2, skillValue: 0.12 },
        { id: 'bondleech', name: '羁绊水蛭', icon: '🪱', tier: 'rare', intro: '「你的亲密度，归我了。」', win: '水蛭被净化。', skill: 'bondBreak', skillChance: 0.3, skillValue: 4 },
        { id: 'deadlinewisp', name: 'Deadline游魂', icon: '👻', tier: 'epic', intro: '「还有五分钟……永远还有五分钟。」', win: '游魂被延期了。', skill: 'timeDrain', skillChance: 0.35, skillValue: 7 },
        { id: 'reviewbot', name: 'CodeReview机', icon: '🤖', tier: 'rare', intro: '「这里命名不规范，建议重构。」', win: 'Bot被 approve 了。', skill: 'shield', skillChance: 0.28, skillValue: 0.14 },
        { id: 'starling', name: '星尘幼灵', icon: '⭐', tier: 'uncommon', intro: '「嗡嗡……星光还没长大。」', win: '幼灵化为流星消失。', skill: 'spiritDrain', skillChance: 0.22, skillValue: 0.1 },
        { id: 'voidmote', name: '虚空微粒', icon: '🌑', tier: 'rare', intro: '「存在与否，取决于你信不信。」', win: '微粒被观测坍缩。', skill: 'curse', skillChance: 0.26 },
        { id: 'chronowisp', name: '时序游萤', icon: '🕯️', tier: 'epic', intro: '「你的下一秒，我已经看过了。」', win: '游萤燃尽成灰。', skill: 'timeDrain', skillChance: 0.32, skillValue: 5 },
        { id: 'memeghoul', name: '梗灵食尸鬼', icon: '👻', tier: 'uncommon', intro: '「这梗我三年前就听过了。」', win: '食尸鬼被新梗噎住。', skill: 'slow', skillChance: 0.24 },
        { id: 'wishsprite', name: '星愿小妖', icon: '🌠', tier: 'rare', intro: '「许个愿吧——但要先交手续费。」', win: '小妖收下许愿税跑路。', skill: 'spiritDrain', skillChance: 0.26, skillValue: 0.12 },
        { id: 'dodgeshade', name: '闪避幽影', icon: '💨', tier: 'uncommon', intro: '「你打中了——吗？」', win: '幽影被锁定现形。', skill: 'dodge', skillChance: 0.28 },
        { id: 'coinleech', name: '吸币水蛭', icon: '🪙', tier: 'common', intro: '「你的秘境币看起来很有营养。」', win: '水蛭吐出了硬币。', skill: 'coinSteal', skillChance: 0.24, skillValue: 20 },
        { id: 'armorcrack', name: '破甲甲虫', icon: '🪲', tier: 'uncommon', intro: '「你的输出面板有漏洞。」', win: '甲虫壳碎了一地。', skill: 'armorBreak', skillChance: 0.22 },
        { id: 'mirrorscout', name: '镜像斥候', icon: '🪞', tier: 'rare', intro: '「反弹伤害，谢绝退货。」', win: '斥候碎成镜片。', skill: 'reflect', skillChance: 0.2, skillValue: 0.05 },
        { id: 'quantumbug', name: '量子Bug', icon: '🐛', tier: 'epic', intro: '「在观测前，我不存在也不修复。」', win: 'Bug被强制观测坍缩。', skill: 'phaseWalk', skillChance: 0.28 },
        { id: 'deadlineHydra', name: 'Deadline九头蛇', icon: '🐍', tier: 'legendary', intro: '「砍掉一个头，长出三个DDL。」', win: '九头蛇被延期了。', skill: 'timeDrain', skillChance: 0.35, skillValue: 6 },
        { id: 'voidmite', name: '虚空螨', icon: '🕳️', tier: 'rare', intro: '「你的秒数有螨虫。」', win: '螨被时序杀虫剂清除。', skill: 'spiritDrain', skillChance: 0.26, skillValue: 0.14 },
        { id: 'singularityMote', name: '奇点微粒', icon: '💠', tier: 'mythic', intro: '「密度无限，耐心有限。」', win: '微粒被奇点过滤器拦截。', skill: 'overload', skillChance: 0.32 },
        { id: 'chromaticWisp', name: '溢彩游灵', icon: '🌈', tier: 'epic', intro: '「七种颜色，一种疼。」', win: '游灵散成霓虹。', skill: 'curse', skillChance: 0.3 }
    ],
    elite: [
        { id: 'kpigolem', name: 'KPI魔像', icon: '🗿', tier: 'uncommon', intro: '「指标未达标，战斗继续。」', win: '魔像报表碎了一地。', skill: 'timeDrain', skillChance: 0.35, skillValue: 6 },
        { id: 'clientphantom', name: '甲方幻影', icon: '👤', tier: 'rare', intro: '「感觉还是第一版好，但再改改。」', win: '幻影签字通过了。', skill: 'shield', skillChance: 0.3, skillValue: 0.2 },
        { id: 'timeraider', name: '时光掠夺者', icon: '⏳', tier: 'rare', intro: '「你的秒数，归我了。」', win: '掠夺者交出了偷走的时间。', skill: 'timeDrain', skillChance: 0.4, skillValue: 8 },
        { id: 'auditbeast', name: '审核巨兽', icon: '🦁', tier: 'epic', intro: '「内容不符合规范，打回去。」', win: '巨兽盖了「通过」章。', skill: 'rage', skillChance: 0.35 },
        { id: 'meetingking', name: '会议之王', icon: '📅', tier: 'uncommon', intro: '「开个短会，大概两小时。」', win: '会议终于散场了。', skill: 'slow', skillChance: 0.3 },
        { id: 'scopebeast', name: '需求膨胀兽', icon: '🐲', tier: 'epic', intro: '「顺便再加个小功能。」', win: '需求被砍回 MVP。', skill: 'heal', skillChance: 0.25, skillValue: 0.12 },
        { id: 'burnoutknight', name: '燃尽骑士', icon: '🛡️', tier: 'rare', intro: '「我已经燃尽了，但还能打。」', win: '骑士终于去休假了。', skill: 'burst', skillChance: 0.32 },
        { id: 'scopehydra', name: '范围蔓延九头蛇', icon: '🐍', tier: 'epic', intro: '「砍掉一个头，长出三个需求。」', win: '九头蛇被砍成 MVP。', skill: 'heal', skillChance: 0.3, skillValue: 0.1 },
        { id: 'standupjudge', name: '站会判官', icon: '⚖️', tier: 'rare', intro: '「昨天做了什么？今天做什么？卡在哪？」', win: '判官宣布散会。', skill: 'timeDrain', skillChance: 0.38, skillValue: 7 },
        { id: 'deploydragon', name: '上线恶龙', icon: '🐉', tier: 'legendary', intro: '「周五下午五点，该发版了。」', win: '恶龙回滚到了上一版。', skill: 'rage', skillChance: 0.4 },
        { id: 'ghostwriter', name: '代笔幽灵', icon: '✍️', tier: 'epic', intro: '「这文档不是我写的，但署名是我。」', win: '幽灵交出了真·作者。', skill: 'curse', skillChance: 0.33 },
        { id: 'crisismanager', name: '危机公关兽', icon: '📢', tier: 'legendary', intro: '「先压热搜，再发声明。」', win: '兽被舆论反噬了。', skill: 'shield', skillChance: 0.35, skillValue: 0.22 },
        { id: 'spiritdevourer', name: '噬灵魔兽', icon: '🐺', tier: 'epic', intro: '「你的精灵充能，归我了。」', win: '魔兽吐出了被偷走的灵息。', skill: 'spiritDrain', skillChance: 0.38, skillValue: 0.25 },
        { id: 'bondreaver', name: '断缘者', icon: '⛓️', tier: 'legendary', intro: '「羁绊？那是弱者的借口。」', win: '断缘者的锁链碎裂。', skill: 'curse', skillChance: 0.36 },
        { id: 'arcanewraith', name: '奥术怨灵', icon: '🔮', tier: 'epic', intro: '「灵脉？我比灵脉更古老。」', win: '怨灵回归星尘。', skill: 'burst', skillChance: 0.34 },
        { id: 'sprinttyrant', name: '冲刺暴君', icon: '🏃', tier: 'rare', intro: '「两周的活儿，两天做完，很合理。」', win: '暴君被延期了。', skill: 'timeDrain', skillChance: 0.35, skillValue: 8 },
        { id: 'techdebtgolem', name: '技术债魔像', icon: '🗿', tier: 'epic', intro: '「先上线，以后再重构。」', win: '魔像被重构了。', skill: 'heal', skillChance: 0.28, skillValue: 0.11 },
        { id: 'oncallphantom', name: '值班幽灵', icon: '📱', tier: 'rare', intro: '「凌晨三点，谁打的电话？」', win: '幽灵被设为勿扰模式。', skill: 'spiritDrain', skillChance: 0.3, skillValue: 0.18 },
        { id: 'compliancehydra', name: '合规九头蛇', icon: '🐍', tier: 'legendary', intro: '「每一条合规，都是一条新需求。」', win: '九头蛇被一刀切了。', skill: 'shield', skillChance: 0.32, skillValue: 0.2 },
        { id: 'transcendentwisp', name: '超越残影', icon: '🌬️', tier: 'legendary', intro: '「你看得见我，但打不中我。」', win: '残影被灵视锁定。', skill: 'slow', skillChance: 0.36 },
        { id: 'spiritreaver', name: '灵脉收割者', icon: '⚔️', tier: 'epic', intro: '「灵脉是公共资源——我的资源。」', win: '收割者被反收割。', skill: 'spiritDrain', skillChance: 0.4, skillValue: 0.28 },
        { id: 'apocalypseherald', name: '终焉先驱', icon: '📯', tier: 'legendary', intro: '「终焉将至，请提交遗言。」', win: '先驱被反终焉了。', skill: 'rage', skillChance: 0.38 },
        { id: 'nexusguard', name: '灵枢守卫', icon: '🛡️', tier: 'epic', intro: '「灵枢重地，闲灵勿入。」', win: '守卫让开了路。', skill: 'shield', skillChance: 0.34, skillValue: 0.18 },
        { id: 'codexphantom', name: '图鉴魅影', icon: '📖', tier: 'rare', intro: '「你的图鉴还差几页？」', win: '魅影化为完整一页。', skill: 'curse', skillChance: 0.3 },
        { id: 'arenachampion', name: '竞技场冠军', icon: '🏆', tier: 'legendary', intro: '「连胜纪录？我来刷新。」', win: '冠军头衔易主。', skill: 'burst', skillChance: 0.36 },
        { id: 'symbioteel', name: '共生鳗', icon: '🐍', tier: 'epic', intro: '「一起变强，或者一起沉没。」', win: '鳗被精灵驱散。', skill: 'heal', skillChance: 0.32, skillValue: 0.13 },
        { id: 'starwraith', name: '星湮怨灵', icon: '👻', tier: 'legendary', intro: '「星光熄灭之处，怨念滋生。」', win: '怨灵被星灵本源净化。', skill: 'spiritDrain', skillChance: 0.38, skillValue: 0.22 },
        { id: 'voidsentinel', name: '虚空星卫', icon: '🛡️', tier: 'mythic', intro: '「非终焉星灵，不得通行。」', win: '星卫为你让开星门。', skill: 'bondBreak', skillChance: 0.38, skillValue: 6 },
        { id: 'starguardian', name: '星辉守卫', icon: '🌟', tier: 'legendary', intro: '「星门之内，闲人免进。」', win: '守卫收剑退后。', skill: 'shield', skillChance: 0.36, skillValue: 0.2 },
        { id: 'dominionphantom', name: '统御幻影', icon: '👻', tier: 'mythic', intro: '「星域统御者，方可直视我。」', win: '幻影消散于星辉。', skill: 'spiritDrain', skillChance: 0.4, skillValue: 0.3 },
        { id: 'celestialhunter', name: '天穹猎手', icon: '🏹', tier: 'legendary', intro: '「猎物？不，是考核对象。」', win: '猎手认可你的身法。', skill: 'burst', skillChance: 0.38 },
        { id: 'affixwraith', name: '词条怨灵', icon: '🏷️', tier: 'epic', intro: '「未记录的词条，皆为诅咒。」', win: '怨灵消散，铭文落地。', skill: 'curse', skillChance: 0.36 },
        { id: 'libraryphantom', name: '秘闻书灵', icon: '📚', tier: 'rare', intro: '「第404章：你找不到出口。」', win: '书灵合上了这一页。', skill: 'shield', skillChance: 0.3, skillValue: 0.14 },
        { id: 'loomweaver', name: '时光织者', icon: '🧵', tier: 'legendary', intro: '「每一秒都是我织的线。」', win: '织者剪断了自己的时间线。', skill: 'timeDrain', skillChance: 0.38, skillValue: 7 },
        { id: 'phasewalker', name: '相位行者', icon: '🌫️', tier: 'epic', intro: '「你在打空气，我在打你。」', win: '行者被强制锚定。', skill: 'dodge', skillChance: 0.36 },
        { id: 'multistriker', name: '连击魔将', icon: '⚔️', tier: 'legendary', intro: '「一下怎么够？再来一下。」', win: '魔将的连击链断了。', skill: 'multiStrike', skillChance: 0.32 },
        { id: 'enragebeast', name: '狂暴异兽', icon: '🐻', tier: 'epic', intro: '「半血？那才是开始。」', win: '异兽力竭倒地。', skill: 'enrage', skillChance: 0.34, skillValue: 0.22 },
        { id: 'treasuryphantom', name: '宝库魅影', icon: '💰', tier: 'rare', intro: '「打赢我，币还是我的。」', win: '魅影交出了赃物。', skill: 'coinSteal', skillChance: 0.35, skillValue: 35 },
        { id: 'voidSentinel', name: '虚空哨兵', icon: '🛡️', tier: 'mythic', intro: '「非虚空行者，不得通过。」', win: '哨兵化为星尘。', skill: 'shield', skillChance: 0.38, skillValue: 0.22 },
        { id: 'omegaWarden', name: 'Ω序守卫', icon: '⚙️', tier: 'mythic', intro: '「序列之外，皆为噪音。」', win: '守卫的齿轮停转。', skill: 'multiStrike', skillChance: 0.36 },
        { id: 'cataclysmHerald', name: '灾变先驱', icon: '📯', tier: 'legendary', intro: '「末日只是预告片。」', win: '先驱被反终焉。', skill: 'enrage', skillChance: 0.34, skillValue: 0.24 },
        { id: 'prismaticTyrant', name: '溢彩暴君', icon: '🌈', tier: 'mythic', intro: '「彩虹尽头是账单。」', win: '暴君霓虹熄灭。', skill: 'burst', skillChance: 0.4 }
    ],
    boss: [
        { id: 'ddlgod', name: '终极DDL之神', icon: '⚡', tier: 'epic', intro: '「所有截止日，皆为我臣。」', win: 'DDL之神延期了——一次。', skill: 'timeDrain', skillChance: 0.45, skillValue: 10 },
        { id: 'timeauditor', name: '时光审计官', icon: '📋', tier: 'epic', intro: '「请出示本层考勤记录。」', win: '审计官在你的通关证明上盖了章。', skill: 'burst', skillChance: 0.4 },
        { id: 'chaospm', name: '混沌项目经理', icon: '🎭', tier: 'legendary', intro: '「需求变了，计划也变了，变就对了。」', win: '项目经理解散，留下一堆会议纪要。', skill: 'shield', skillChance: 0.35, skillValue: 0.25 },
        { id: 'eternalhr', name: '永恒HR', icon: '👔', tier: 'legendary', intro: '「我们来对齐一下颗粒度。」', win: 'HR 批准了你的离职……不对，通关申请。', skill: 'curse', skillChance: 0.38 },
        { id: 'overlord996', name: '996魔神', icon: '🔥', tier: 'legendary', intro: '「奋斗吧，年轻人，时间是用不完的。」', win: '魔神的打卡机终于坏了。', skill: 'rage', skillChance: 0.42 },
        { id: 'mirrorboss', name: '镜像心魔', icon: '🪞', tier: 'epic', intro: '「打败我，就是打败昨天的自己。」', win: '心魔碎成无数加班回忆。', skill: 'heal', skillChance: 0.3, skillValue: 0.15 },
        { id: 'eternitywatcher', name: '永恒守望者', icon: '👁️', tier: 'mythic', intro: '「我见过无数冒险者，你是第几号？」', win: '守望者为你的通关记录让路。', skill: 'timeDrain', skillChance: 0.48, skillValue: 12 },
        { id: 'voidemperor', name: '虚空时光帝', icon: '🌌', tier: 'mythic', intro: '「时间于我，不过是一页待删的草稿。」', win: '帝座崩塌，时光重新流动。', skill: 'burst', skillChance: 0.45 },
        { id: 'paradoxlord', name: '悖论领主', icon: '♾️', tier: 'mythic', intro: '「你击败了我，但也从未击败过我。」', win: '悖论被强行闭环。', skill: 'shield', skillChance: 0.4, skillValue: 0.28 },
        { id: 'lastreviewer', name: '终审委员会', icon: '🏛️', tier: 'legendary', intro: '「请提交本层验收材料，一式五份。」', win: '委员会盖章：验收通过。', skill: 'slow', skillChance: 0.38 },
        { id: 'spiritsovereign', name: '灵域霸主', icon: '👑', tier: 'mythic', intro: '「灵脉归一，臣服或消散。」', win: '霸主认可了你的羁绊。', skill: 'spiritDrain', skillChance: 0.42, skillValue: 0.3 },
        { id: 'twinspirits', name: '双生圣灵', icon: '☯️', tier: 'mythic', intro: '「光与影，我们即是完整的试炼。」', win: '双生圣灵化为你的灵翼。', skill: 'heal', skillChance: 0.35, skillValue: 0.14 },
        { id: 'abyssalguardian', name: '深渊灵卫', icon: '🛡️', tier: 'mythic', intro: '「永恒难度的门槛，由我镇守。」', win: '灵卫让开了道路。', skill: 'shield', skillChance: 0.4, skillValue: 0.3 },
        { id: 'timewarden', name: '时光典狱长', icon: '⛓️', tier: 'legendary', intro: '「超时者，留下。」', win: '典狱长撕掉了你的罚单。', skill: 'timeDrain', skillChance: 0.44, skillValue: 11 },
        { id: 'cataclysmhr', name: '终焉HR', icon: '💼', tier: 'mythic', intro: '「末位淘汰，现在开始。」', win: 'HR被反淘汰了。', skill: 'rage', skillChance: 0.46 },
        { id: 'quantumpm', name: '量子项目经理', icon: '🌐', tier: 'legendary', intro: '「需求同时存在又同时不存在。」', win: '项目被坍缩为已交付。', skill: 'burst', skillChance: 0.4 },
        { id: 'transcendentone', name: '超越者', icon: '🌟', tier: 'mythic', intro: '「你已触及时光尽头，但还不够。」', win: '超越者为你让路。', skill: 'shield', skillChance: 0.42, skillValue: 0.32 },
        { id: 'apocalypsecore', name: '终焉核心', icon: '💀', tier: 'mythic', intro: '「一切归墟，包括你的倒计时。」', win: '核心碎裂，时光重启。', skill: 'timeDrain', skillChance: 0.5, skillValue: 14 },
        { id: 'eternalbond', name: '永恒羁绊兽', icon: '💞', tier: 'mythic', intro: '「没有羁绊的人，不配站在终焉。」', win: '羁绊兽认可了你与精灵。', skill: 'bondBreak', skillChance: 0.4, skillValue: 8 },
        { id: 'voidarchon', name: '虚空执政官', icon: '🌌', tier: 'mythic', intro: '「秘境规则由我书写。」', win: '执政官撕掉了这一页规则。', skill: 'burst', skillChance: 0.44 },
        { id: 'spiritemperor', name: '精灵帝皇', icon: '👑', tier: 'mythic', intro: '「万灵之祖，试炼开始。」', win: '帝皇将灵冠赠予你的精灵。', skill: 'spiritDrain', skillChance: 0.45, skillValue: 0.35 },
        { id: 'stararchon', name: '终焉星域主宰', icon: '💫', tier: 'mythic', intro: '「星灵不在，域不生灵。」', win: '星域认主，万灵朝宗。', skill: 'spiritDrain', skillChance: 0.48, skillValue: 0.38 },
        { id: 'celestialtyrant', name: '天穹暴君', icon: '🌠', tier: 'mythic', intro: '「天穹之下，皆为试炼。」', win: '暴君星冠碎裂。', skill: 'rage', skillChance: 0.46 },
        { id: 'chronolord', name: '时序领主', icon: '⏳', tier: 'mythic', intro: '「图书馆里的每一本书，都在倒数。」', win: '领主的书架塌成沙漏。', skill: 'timeDrain', skillChance: 0.47, skillValue: 11 },
        { id: 'wishdragon', name: '星愿巨龙', icon: '🐉', tier: 'legendary', intro: '「三个愿望？先签免责协议。」', win: '巨龙收走愿望清单。', skill: 'burst', skillChance: 0.4 },
        { id: 'voidEmpress', name: '虚空女帝', icon: '👸', tier: 'mythic', intro: '「虚空不是空，是满的。」', win: '女帝退位，裂隙闭合。', skill: 'spiritDrain', skillChance: 0.46, skillValue: 0.32 },
        { id: 'omegaArchitect', name: 'Ω序架构师', icon: '🏗️', tier: 'mythic', intro: '「你的Build不符合规范。」', win: '架构师被重构。', skill: 'shield', skillChance: 0.44, skillValue: 0.3 },
        { id: 'singularityCore', name: '奇点核心', icon: '💠', tier: 'mythic', intro: '「一切归一，包括你的倒计时。」', win: '奇点被奇点反奇点。', skill: 'timeDrain', skillChance: 0.52, skillValue: 15 },
        { id: 'chromaticOverlord', name: '炫彩主宰', icon: '🌈', tier: 'mythic', intro: '「七种元素，一种结局。」', win: '主宰散成七色光。', skill: 'rage', skillChance: 0.48 }
    ]
};

const TSR_RUN_CONTRACTS = {
    none: { name: '无契约', desc: '标准冒险，不附加条件', icon: '📜' },
    speedrun: { name: '疾行者契约', desc: '起始-40秒，全程秘境币+20%', icon: '⚡', timeMod: -40, currencyMod: 0.2 },
    hoarder: { name: '囤时者契约', desc: '每层额外+7秒，战斗反击伤害+5%', icon: '🐹', floorTime: 7, counterPenalty: 0.05 },
    gambler: { name: '赌神契约', desc: '赌局胜率+22%，生命上限-8%', icon: '🎰', gamble: 0.22, health: -0.08 },
    memeLord: { name: '梗王契约', desc: '恶趣味房间率+80%，精英币收益-6%', icon: '🃏', memeMult: 1.8, eliteCurrencyPenalty: 0.06 },
    ironMan: { name: '铁人契约', desc: '生命+24%，行动耗时+5%', icon: '🦾', health: 0.24, timeCost: 0.05 },
    spiritGuard: { name: '驭灵者契约', desc: '精灵充能+70%，起始-25秒，秘境币+16%', icon: '🧚', spiritMult: 1.7, timeMod: -25, currencyMod: 0.16 },
    spiritSage: { name: '精灵学者契约', desc: '精灵房收益+120%，特殊房+35%，生命-5%', icon: '📚', spiritRoomMult: 1.2, specialRoomMult: 1.35, health: -0.05 },
    spiritHunter: { name: '猎灵者契约', desc: '精英币+30%，精灵充能+45%，起始-20秒', icon: '🏹', spiritMult: 1.45, currencyMod: 0.1, timeMod: -20, eliteCurrencyBonus: 0.3 },
    starSpirit: { name: '星灵契约', desc: '终焉星灵专属：充能+85%，特殊房+25%，起始-35秒', icon: '💫', spiritMult: 1.85, specialRoomMult: 1.25, spiritHealBonus: 0.1, timeMod: -35, currencyMod: 0.18 },
    affixLord: { name: '词条行者契约', desc: '怪物词条率+45%，词条赏金+24%，反击+5%', icon: '🏷️', affixRollBoost: 0.45, affixReward: 0.24, counterPenalty: 0.05, timeMod: -15 },
    fortuneSeeker: { name: '彩运契约', desc: '秘境币+20%，赌局+18%，梗房×1.4，事件收益+25%', icon: '🎨', currencyMod: 0.2, gamble: 0.18, memeMult: 1.4, eventBonus: 0.25, timeMod: -20 },
    chronoHunter: { name: '时序猎手契约', desc: '行动耗时-15%，每层+6秒，战斗奖励+18%，起始-25秒', icon: '🕰️', timeSave: 0.15, floorTime: 6, battleReward: 0.18, timeMod: -25 },
    codexKeeper: { name: '图鉴守护者契约', desc: '特殊房+50%，事件收益+25%，探索耗时+3%', icon: '📚', specialRoomMult: 1.5, eventBonus: 0.25, timeCost: 0.03 },
    voidWalker: { name: '虚空行者契约', desc: '怪物+8%，奖励+35%，虚空共鸣+75%', icon: '🕳️', monsterMult: 0.08, currencyMod: 0.35, resonanceGain: 0.75, timeMod: -30 },
    doomPact: { name: '末日契约', desc: '每层-3秒，攻击+28%，战斗奖励+35%', icon: '💀', floorTime: -3, attack: 0.28, battleReward: 0.35, health: -0.06 },
    singularityOath: { name: '奇点誓约', desc: '终焉星灵专属：怪物+6%，币+40%，预览2层', icon: '💠', monsterMult: 0.06, currencyMod: 0.4, roomPreview: 2, timeMod: -40, needEvo: 4 }
};

const TSR_ACHIEVEMENTS = [
    { id: 'firstClear', name: '时光旅人', desc: '首次通关任意难度', icon: '🏆' },
    { id: 'hellClear', name: '地狱行者', desc: '通关地狱难度', icon: '☠️' },
    { id: 'abyssClear', name: '深渊征服者', desc: '通关深渊难度', icon: '🕳️' },
    { id: 'eternalClear', name: '永恒见证者', desc: '通关永恒难度', icon: '♾️' },
    { id: 'transcendentClear', name: '超越飞升者', desc: '通关超越难度', icon: '🌟' },
    { id: 'apocalypseClear', name: '终焉幸存者', desc: '通关终焉难度', icon: '💀' },
    { id: 'spiritBoss1', name: '灵域征服', desc: '击败灵域霸主', icon: '👑' },
    { id: 'spiritBoss3', name: '灵域霸主', desc: '累计击败灵域霸主3次', icon: '🏆' },
    { id: 'mythic10', name: '神话猎手', desc: '累计击败10个神话级怪物', icon: '🌸' },
    { id: 'spiritSageClear', name: '学者行者', desc: '精灵学者契约通关一次', icon: '📚' },
    { id: 'spiritHunterClear', name: '猎灵行者', desc: '猎灵者契约通关一次', icon: '🏹' },
    { id: 'codexFull', name: '全知行者', desc: '图鉴全部解锁', icon: '📕' },
    { id: 'meme5', name: '梗房间常客', desc: '累计遭遇5次恶趣味房间', icon: '🃏', need: { memeRooms: 5 } },
    { id: 'meme20', name: '梗学大师', desc: '累计遭遇20次恶趣味房间', icon: '🎭', need: { memeRooms: 20 } },
    { id: 'relicFull', name: '遗物满载', desc: '单局携带满遗物通关', icon: '🏺' },
    { id: 'equipFull', name: '全副武装', desc: '单局四槽装备齐全并通关', icon: '⚔️' },
    { id: 'equipSet4', name: '套装大师', desc: '激活四件套装效果并通关', icon: '🧩' },
    { id: 'equipEnhance5', name: '锻星匠师', desc: '单局将一件装备强化至+5', icon: '🔨' },
    { id: 'equipLegendary4', name: '传说武装', desc: '激活传说套装四件套并通关', icon: '👑' },
    { id: 'equipReforge8', name: '洗炼大师', desc: '单局洗炼装备累计8次', icon: '🔄' },
    { id: 'streak10', name: '连击狂人', desc: '单局战斗连击达到10', icon: '🌀', need: { battleStreak: 10 } },
    { id: 'spirit5', name: '精灵挚友', desc: '累计触发5次时光精灵', icon: '✨', need: { spiritTriggers: 5 } },
    { id: 'spirit15', name: '精灵导师', desc: '时光精灵达到15级', icon: '🧚', need: { spiritLevel: 15 } },
    { id: 'spiritMax', name: '永恒羁绊', desc: '精灵满级且进化至终焉星灵', icon: '👼', need: { spiritMax: true } },
    { id: 'spiritEvo4', name: '终焉星灵', desc: '精灵进化至第4形态', icon: '💫' },
    { id: 'spiritAscend1', name: '帝皇试炼', desc: '飞升试炼中击败精灵帝皇', icon: '🌌' },
    { id: 'spiritStarOrigin', name: '本源觉醒', desc: '习得星灵本源灵脉', icon: '🌌' },
    { id: 'starSpiritClear', name: '星灵行者', desc: '星灵契约通关一次', icon: '💫' },
    { id: 'starBoss1', name: '星域征服', desc: '击败终焉星域主宰', icon: '💫' },
    { id: 'starBranchMaster', name: '星脉圆满', desc: '习得全部终焉星灵分支灵脉', icon: '🌌' },
    { id: 'starBoss3', name: '三界归一', desc: '累计击败终焉星域主宰3次', icon: '💫' },
    { id: 'throneClear1', name: '王座加冕', desc: '星灵王座三连战通关1次', icon: '👑' },
    { id: 'throneClear5', name: '永恒王座', desc: '王座三连战累计通关5次', icon: '🏛️' },
    { id: 'archonRelic', name: '星域王冠', desc: '获得主宰专属遗物「星域王冠」', icon: '👑' },
    { id: 'emperorRelic', name: '帝皇认可', desc: '获得帝皇专属遗物「帝皇灵印」', icon: '🌌' },
    { id: 'starfallVisit', name: '星陨见证', desc: '进入星陨祭坛5次', icon: '☄️', need: { starfallRooms: 5 } },
    { id: 'celestialVaultWin', name: '天穹宝库', desc: '天穹宝库完美开启1次', icon: '🏦' },
    { id: 'spiritDuelMaster', name: '对决大师', desc: '精灵对决全胜3次', icon: '⚔️', need: { spiritDuelWins: 3 } },
    { id: 'timewarpMaster', name: '时光扭曲者', desc: '时光扭曲房成功跃层3次', icon: '⏳', need: { timewarpJumps: 3 } },
    { id: 'tyrantBoss1', name: '天穹裁决', desc: '击败天穹暴君', icon: '🌠' },
    { id: 'tyrantRelic', name: '暴君封印', desc: '获得天穹暴君专属遗物', icon: '🔱' },
    { id: 'throneExtreme1', name: '王座极境', desc: '完成王座极境挑战1次', icon: '💀' },
    { id: 'paradeVisit', name: '巡礼宾客', desc: '进入星灵巡礼3次', icon: '🎊', need: { paradeRooms: 3 } },
    { id: 'voidriftSurvive', name: '裂隙生还', desc: '虚空裂隙深潜成功3次', icon: '🕳️', need: { voidriftDives: 3 } },
    { id: 'starJudgmentMaster', name: '审判星脉', desc: '习得星域审判灵脉', icon: '⚖️' },
    { id: 'spirit30', name: '精灵召唤师', desc: '累计触发30次时光精灵', icon: '🌟', need: { spiritTriggers: 30 } },
    { id: 'spiritBondMax', name: '心心相印', desc: '精灵亲密度达到满值', icon: '💞', need: { spiritBondMax: true } },
    { id: 'spiritSkill5', name: '灵脉大师', desc: '解锁5个灵脉技能', icon: '📿', need: { spiritSkills: 5 } },
    { id: 'spiritContract', name: '驭灵行者', desc: '使用驭灵者契约通关一次', icon: '🛡️' },
    { id: 'spiritMaster', name: '灵王觉醒', desc: '解锁全部灵脉技能', icon: '👑' },
    { id: 'spiritTrial3', name: '试炼征服者', desc: '累计通过3次精灵试炼', icon: '⚔️' },
    { id: 'spiritRename', name: '命名之约', desc: '为时光精灵取名', icon: '🏷️' },
    { id: 'noRest', name: '不眠探险', desc: '通关过程中从未休息', icon: '🌙' },
    { id: 'pddWin', name: '砍成了', desc: '在砍一刀密室砍满100%', icon: '🪓' },
    { id: 'rich', name: '秘境富翁', desc: '永久秘境币达到50万', icon: '💰', need: { currency: 500000 } },
    { id: 'synergy', name: '契约羁绊', desc: '触发一次契约组合加成', icon: '🔗' },
    { id: 'codexHalf', name: '博闻行者', desc: '图鉴解锁过半', icon: '📖' },
    { id: 'questWeek', name: '周常猎人', desc: '完成一次周常任务', icon: '📅' },
    { id: 'affixKill5', name: '词条猎手', desc: '击败5只带词条怪物', icon: '🏷️', need: { affixKills: 5 } },
    { id: 'affixDual1', name: '双词条征服', desc: '击败1只双词条怪物', icon: '⚔️', need: { dualAffixKills: 1 } },
    { id: 'affixCodex8', name: '词条学者', desc: '图鉴收录8种怪物词条', icon: '📚', need: { affixCodex: 8 } },
    { id: 'affixKill20', name: '词条大师', desc: '击败20只带词条怪物', icon: '🏆', need: { affixKills: 20 } },
    { id: 'affixCodexFull', name: '词条全知', desc: '图鉴收录全部怪物词条', icon: '📕', need: { affixCodexFull: true } },
    { id: 'starAffixBreakLearn', name: '破界灵脉', desc: '解锁词条破界灵脉', icon: '🏷️' },
    { id: 'codexPathLearn', name: '图鉴灵径', desc: '解锁图鉴灵径灵脉', icon: '📖' },
    { id: 'championHall1', name: '殿堂冠军', desc: '冠军殿堂三连战通关1次', icon: '🏆', need: { championClears: 1 } },
    { id: 'affixLordClear', name: '词条行者', desc: '词条行者契约通关一次', icon: '🏷️' },
    { id: 'synergyShrine3', name: '羁绊朝圣', desc: '进入羁绊神殿3次', icon: '🔗', need: { synergyShrineRooms: 3 } },
    { id: 'legendArchive5', name: '传奇学者', desc: '进入传奇见闻馆5次', icon: '📜', need: { legendArchiveRooms: 5 } },
    { id: 'fortuneSeekerClear', name: '彩运行者', desc: '彩运契约通关一次', icon: '🎨' },
    { id: 'starFortune7', name: '七星照运', desc: '累计7局携带今日星运通关', icon: '🌟', need: { starFortuneClears: 7 } },
    { id: 'chronoLibrary5', name: '时序学者', desc: '进入时序图书馆5次', icon: '📚', need: { chronoLibraryRooms: 5 } },
    { id: 'starWish3', name: '星愿旅人', desc: '进入星愿池3次', icon: '🌠', need: { starWishRooms: 3 } },
    { id: 'mirrorMaze1', name: '迷城破局', desc: '镜像迷城完美通关1次', icon: '🪞', need: { mirrorMazeWins: 1 } },
    { id: 'runeScribe1', name: '符文抄录', desc: '符文抄录室铭刻1次', icon: '📜', need: { runeScribeRooms: 1 } },
    { id: 'timeLoom3', name: '织时匠人', desc: '进入时光织机3次', icon: '🧵', need: { timeLoomRooms: 3 } },
    { id: 'chronoHunterClear', name: '时序行者', desc: '时序猎手契约通关一次', icon: '🕰️' },
    { id: 'codexKeeperClear', name: '图鉴守护', desc: '图鉴守护者契约通关一次', icon: '📚' },
    { id: 'libraryPathLearn', name: '秘闻灵脉', desc: '解锁秘闻灵径灵脉', icon: '📚' },
    { id: 'hotfixWin3', name: '热修老兵', desc: '紧急热修房成功3次', icon: '🚑', need: { hotfixWins: 3 } },
    { id: 'battleTactic3', name: '战术大师', desc: '累计使用战前战术3次', icon: '⚔️', need: { battleTactics: 3 } },
    { id: 'comboStorm1', name: '风暴行者', desc: '连击风暴房选择狂风暴1次', icon: '🌪️', need: { comboStormStorm: 1 } },
    { id: 'battleRift3', name: '裂隙决斗者', desc: '战斗裂隙房完成3次决斗', icon: '🌀', need: { battleRiftDuels: 3 } },
    { id: 'midEvent5', name: '战中见证者', desc: '累计触发5次战中事件', icon: '✨', need: { battleMidEvents: 5 } },
    { id: 'bloodArena1', name: '血战勇士', desc: '血战竞技场通关1次', icon: '🩸', need: { bloodArenaWins: 1 } },
    { id: 'voidClear', name: '虚空行者', desc: '通关虚空难度', icon: '🕳️' },
    { id: 'omegaClear', name: 'Ω序见证', desc: '通关Ω序难度', icon: '⚙️' },
    { id: 'singularityClear', name: '奇点飞升', desc: '通关奇点难度', icon: '💠' },
    { id: 'fateCardWin', name: '命运赌徒', desc: '携带命运卡牌通关10次', icon: '🃏', need: { fateCardClears: 10 } },
    { id: 'voidResonanceBurst5', name: '共鸣大师', desc: '单局触发5次虚空共鸣爆发', icon: '💠', need: { resonanceBursts: 5 } },
    { id: 'doomClockRoom3', name: '末日幸存者', desc: '进入末日倒计时房3次', icon: '⏰', need: { doomClockRooms: 3 } },
    { id: 'chromaticShrine5', name: '炫彩朝圣', desc: '进入彩光神龛5次', icon: '🌈', need: { chromaticShrineRooms: 5 } }
];

/** 成就永久战力加成上限（与永恒符文分池，按已解锁成就汇总） */
const TSR_ACHIEVEMENT_ATK_MAX = 1.5;
const TSR_ACHIEVEMENT_HP_MAX = 1.5;
const TSR_ACHIEVEMENT_DEF_MAX = 0.45;
/** 无单独配置时的默认小额奖励 */
const TSR_ACHIEVEMENT_REWARD_DEFAULT = { attack: 0.02, health: 0.02, defense: 0.01 };
/**
 * 重点成就奖励表（攻/血/防百分比；防御计入反击减伤）。
 * 未列出的成就走默认小额，保证「有解锁就有永久属性」。
 */
const TSR_ACHIEVEMENT_REWARD_TABLE = {
    firstClear: { attack: 0.01, health: 0.01, defense: 0.005 },
    hellClear: { attack: 0.015, health: 0.015, defense: 0.008 },
    abyssClear: { attack: 0.02, health: 0.02, defense: 0.01 },
    eternalClear: { attack: 0.025, health: 0.025, defense: 0.012 },
    transcendentClear: { attack: 0.03, health: 0.03, defense: 0.015 },
    apocalypseClear: { attack: 0.035, health: 0.035, defense: 0.018 },
    voidClear: { attack: 0.04, health: 0.04, defense: 0.02 },
    omegaClear: { attack: 0.045, health: 0.045, defense: 0.022 },
    singularityClear: { attack: 0.05, health: 0.05, defense: 0.025 },
    spiritBoss1: { attack: 0.012, health: 0.01, defense: 0.006 },
    spiritBoss3: { attack: 0.02, health: 0.018, defense: 0.01 },
    mythic10: { attack: 0.015, health: 0.01, defense: 0.005 },
    spiritSageClear: { attack: 0.008, health: 0.012, defense: 0.006 },
    spiritHunterClear: { attack: 0.012, health: 0.008, defense: 0.005 },
    codexFull: { attack: 0.015, health: 0.015, defense: 0.01 },
    meme5: { attack: 0.005, health: 0.005, defense: 0.003 },
    meme20: { attack: 0.01, health: 0.01, defense: 0.006 },
    relicFull: { attack: 0.01, health: 0.012, defense: 0.008 },
    equipFull: { attack: 0.01, health: 0.01, defense: 0.012 },
    equipSet4: { attack: 0.012, health: 0.012, defense: 0.01 },
    equipEnhance5: { attack: 0.01, health: 0.008, defense: 0.006 },
    equipLegendary4: { attack: 0.015, health: 0.015, defense: 0.012 },
    streak10: { attack: 0.012, health: 0.006, defense: 0.004 },
    noRest: { attack: 0.01, health: 0.008, defense: 0.01 },
    spiritMax: { attack: 0.02, health: 0.02, defense: 0.012 },
    throneClear1: { attack: 0.015, health: 0.015, defense: 0.01 },
    tyrantBoss1: { attack: 0.018, health: 0.012, defense: 0.008 },
    starBoss1: { attack: 0.015, health: 0.012, defense: 0.008 }
};

function getTsrAchievementRewardDef(achOrId) {
    const id = typeof achOrId === 'string' ? achOrId : achOrId?.id;
    if (!id) return { ...TSR_ACHIEVEMENT_REWARD_DEFAULT };
    const table = TSR_ACHIEVEMENT_REWARD_TABLE[id];
    if (table) return { attack: 0, health: 0, defense: 0, ...table };
    const inline = typeof achOrId === 'object' && achOrId?.reward ? achOrId.reward : null;
    if (inline) return { attack: 0, health: 0, defense: 0, ...inline };
    return { ...TSR_ACHIEVEMENT_REWARD_DEFAULT };
}

function formatTsrAchievementRewardText(reward) {
    if (!reward) return '';
    const fmt = (v) => {
        const p = (Number(v) || 0) * 100;
        if (!p) return '';
        return Number.isInteger(p) ? String(p) : p.toFixed(1);
    };
    const parts = [];
    if (reward.attack) parts.push(`攻+${fmt(reward.attack)}%`);
    if (reward.health) parts.push(`血+${fmt(reward.health)}%`);
    if (reward.defense) parts.push(`防+${fmt(reward.defense)}%`);
    return parts.join(' · ');
}

/** 按已解锁成就汇总的永久攻/血/防（防御=反击减伤） */
function getTsrAchievementCombatBonuses() {
    const unlocked = player.timeSecretRealm?.achievements || {};
    let attack = 0;
    let health = 0;
    let defense = 0;
    TSR_ACHIEVEMENTS.forEach(a => {
        if (!unlocked[a.id]) return;
        const r = getTsrAchievementRewardDef(a);
        attack += Number(r.attack) || 0;
        health += Number(r.health) || 0;
        defense += Number(r.defense) || 0;
    });
    return {
        attack: Math.min(TSR_ACHIEVEMENT_ATK_MAX, attack),
        health: Math.min(TSR_ACHIEVEMENT_HP_MAX, health),
        defense: Math.min(TSR_ACHIEVEMENT_DEF_MAX, defense)
    };
}

const TSR_CONTRACT_SYNERGIES = [
    { keys: ['speedrun', 'gambler'], name: '极速赌徒', desc: '币+11%，赌局+13%', bonus: { currencyMod: 0.11, gamble: 0.13 } },
    { keys: ['memeLord', 'gambler'], name: '梗赌双绝', desc: '梗房×1.25，赌局+10%', bonus: { memeMult: 1.25, gamble: 0.1 } },
    { keys: ['hoarder', 'ironMan'], name: '钛合金仓鼠', desc: '每层+4秒，生命+10%', bonus: { floorTime: 4, health: 0.1 } },
    { keys: ['speedrun', 'memeLord'], name: '急梗人', desc: '耗时-7%，梗房×1.2', bonus: { timeSave: 0.07, memeMult: 1.2 } },
    { keys: ['gambler', 'ironMan'], name: '硬汉赌徒', desc: '赌局+13%，生命+8%', bonus: { gamble: 0.13, health: 0.08 } },
    { keys: ['hoarder', 'memeLord'], name: '囤梗党', desc: '每层+5秒，梗房×1.3', bonus: { floorTime: 5, memeMult: 1.3 } },
    { keys: ['spiritGuard', 'hoarder'], name: '灵时共鸣', desc: '精灵充能+20%，每层+5秒', bonus: { spiritMult: 1.2, floorTime: 5 } },
    { keys: ['spiritGuard', 'memeLord'], name: '梗灵双修', desc: '精灵充能+14%，梗房×1.25', bonus: { spiritMult: 1.14, memeMult: 1.25 } },
    { keys: ['spiritGuard', 'ironMan'], name: '钢灵护卫', desc: '生命+13%，触发回血+5%', bonus: { health: 0.13, spiritHealBonus: 0.05 } },
    { keys: ['spiritSage', 'spiritGuard'], name: '灵域双修', desc: '精灵房+30%，充能+15%', bonus: { spiritRoomMult: 0.3, spiritMult: 1.15 } },
    { keys: ['spiritSage', 'memeLord'], name: '梗灵学者', desc: '精灵房+35%，特殊房+18%', bonus: { spiritRoomMult: 0.35, specialRoomMult: 1.18 } },
    { keys: ['spiritHunter', 'spiritGuard'], name: '猎灵共鸣', desc: '精英币+13%，充能+13%', bonus: { eliteCurrencyBonus: 0.13, spiritMult: 1.13 } },
    { keys: ['spiritHunter', 'speedrun'], name: '疾猎双星', desc: '币+8%，精英币+10%', bonus: { currencyMod: 0.08, eliteCurrencyBonus: 0.1 } },
    { keys: ['starSpirit', 'spiritGuard'], name: '星灵驭灵', desc: '充能+22%，每层+6秒', bonus: { spiritMult: 1.22, floorTime: 6 } },
    { keys: ['starSpirit', 'spiritSage'], name: '星灵学者', desc: '精灵房+40%，特殊房+12%', bonus: { spiritRoomMult: 0.4, specialRoomMult: 1.12 } },
    { keys: ['starSpirit', 'spiritHunter'], name: '星灵猎阵', desc: '精英币+15%，充能+15%', bonus: { eliteCurrencyBonus: 0.15, spiritMult: 1.15 } },
    { keys: ['spiritHunter', 'ironMan'], name: '钢骨猎词条', desc: '词条赏金+18%，生命+10%', bonus: { affixReward: 0.18, health: 0.1 } },
    { keys: ['affixLord', 'memeLord'], name: '梗词条双煞', desc: '词条赏金+15%，梗房×1.2', bonus: { affixReward: 0.15, memeMult: 1.2 } },
    { keys: ['affixLord', 'spiritHunter'], name: '猎词条阵', desc: '词条赏金+13%，精英币+12%', bonus: { affixReward: 0.13, eliteCurrencyBonus: 0.12 } },
    { keys: ['affixLord', 'gambler'], name: '赌词条局', desc: '词条赏金+10%，赌局+12%', bonus: { affixReward: 0.1, gamble: 0.12 } },
    { keys: ['fortuneSeeker', 'gambler'], name: '彩赌双星', desc: '赌局+15%，秘境币+10%', bonus: { gamble: 0.15, currencyMod: 0.1 } },
    { keys: ['fortuneSeeker', 'memeLord'], name: '梗运同频', desc: '梗房×1.25，事件收益+13%', bonus: { memeMult: 1.25, eventBonus: 0.13 } },
    { keys: ['fortuneSeeker', 'spiritGuard'], name: '灵运共鸣', desc: '充能+15%，每层+4秒', bonus: { spiritMult: 1.15, floorTime: 4 } },
    { keys: ['chronoHunter', 'speedrun'], name: '极速时序', desc: '耗时-8%，每层+4秒', bonus: { timeSave: 0.08, floorTime: 4 } },
    { keys: ['chronoHunter', 'spiritHunter'], name: '时序猎阵', desc: '战斗奖励+11%，精英币+12%', bonus: { battleReward: 0.11, eliteCurrencyBonus: 0.12 } },
    { keys: ['codexKeeper', 'spiritSage'], name: '博闻灵域', desc: '特殊房+15%，精灵房+30%', bonus: { specialRoomMult: 1.15, spiritRoomMult: 0.3 } },
    { keys: ['codexKeeper', 'affixLord'], name: '词条博识', desc: '词条赏金+13%，特殊房+12%', bonus: { affixReward: 0.13, specialRoomMult: 1.12 } },
    { keys: ['codexKeeper', 'fortuneSeeker'], name: '彩图同辉', desc: '事件收益+13%，币+8%', bonus: { eventBonus: 0.13, currencyMod: 0.08 } }
];

const TSR_FLOOR_AFFIXES = {
    tailwind: { name: '顺风情境', icon: '🍃', desc: '行动耗时-12%', timeSave: 0.12 },
    greed: { name: '贪婪裂隙', icon: '🪙', desc: '秘境币+12%，陷阱率+15%', currencyMod: 0.12, trapRate: 0.15 },
    chaos: { name: '混沌漩涡', icon: '🌀', desc: '梗房遭遇+50%', memeMult: 1.5 },
    bloodMoon: { name: '血月低语', icon: '🌙', desc: '攻击+15%，每层-3秒', attack: 0.15, floorTime: -3 },
    blessing: { name: '祝福残响', icon: '✨', desc: '精灵充能+60%', spiritMult: 1.6 },
    focus: { name: '专注力场', icon: '🎯', desc: '战斗奖励+10%，探索耗时+8%', battleReward: 0.1, timeCost: 0.08 },
    spiritStorm: { name: '灵潮涌动', icon: '🌊', desc: '精灵充能+80%，特殊房间+30%', spiritMult: 1.8, specialRoomMult: 1.3 },
    doom: { name: '末日倒计时', icon: '💀', desc: '攻击+20%，怪物+12%，每层-5秒', attack: 0.2, monsterMult: 0.12, floorTime: -5 },
    fortune: { name: '鸿运当头', icon: '🍀', desc: '秘境币+18%，赌局胜率+12%', currencyMod: 0.18, gamble: 0.12 },
    hunting: { name: '狩猎狂潮', icon: '🏹', desc: '战斗奖励+15%，稀有怪率+40%', battleReward: 0.15, rareMonsterMult: 1.4 },
    spiritWhisper: { name: '灵语低鸣', icon: '🧚', desc: '精灵充能+50%，灵击伤害+35%', spiritMult: 1.5, spiritStrikeMult: 0.35 },
    apocalypseMoon: { name: '终焉之月', icon: '🌑', desc: '怪物+18%，奖励+15%，每层-6秒', monsterMult: 0.18, currencyMod: 0.15, floorTime: -6 },
    symbioticField: { name: '共生力场', icon: '🤝', desc: '精灵充能+100%，触发回血+8%', spiritMult: 2, spiritHealBonus: 0.08 },
    transcendentWind: { name: '超越之风', icon: '🌬️', desc: '行动耗时-15%，稀有怪+50%', timeSave: 0.15, rareMonsterMult: 1.5 },
    spiritNexus: { name: '灵枢共振', icon: '💠', desc: '精灵房+50%，灵击+25%', spiritRoomMult: 1.5, spiritStrikeMult: 0.25 },
    apocalypseFlame: { name: '终焉业火', icon: '🔥', desc: '攻击+25%，怪物+15%，每层-4秒', attack: 0.25, monsterMult: 0.15, floorTime: -4 },
    mythicHunt: { name: '神话狩猎', icon: '🎯', desc: '神话怪率+80%，战斗奖励+12%', rareMonsterMult: 1.8, battleReward: 0.12 },
    codexGlow: { name: '图鉴辉光', icon: '📖', desc: '秘境币+10%，特殊房+20%', currencyMod: 0.1, specialRoomMult: 1.2 },
    starCrown: { name: '星冠加冕', icon: '💫', desc: '精灵充能+120%，灵击+40%，每层+4秒', spiritMult: 2.2, spiritStrikeMult: 0.4, floorTime: 4 },
    starDomain: { name: '星域潮汐', icon: '🌊', desc: '特殊房+25%，精灵房+20%，每层+3秒', specialRoomMult: 1.25, spiritRoomMult: 1.2, floorTime: 3 },
    tyrantGaze: { name: '暴君凝视', icon: '👁️', desc: '攻击+18%，怪物+10%，战斗奖励+20%', attack: 0.18, monsterMult: 0.1, battleReward: 0.2 },
    affixStorm: { name: '词条风暴', icon: '🏷️', desc: '怪物词条率+50%，词条赏金+15%', affixRollBoost: 0.5, affixReward: 0.15 },
    relicGlow: { name: '遗宝辉光', icon: '🏺', desc: '精英遗物率+18%，秘境币+8%', relicMagnet: 0.18, currencyMod: 0.08 },
    bondTide: { name: '羁绊潮汐', icon: '💞', desc: '精灵充能+70%，触发回血+6%', spiritMult: 1.7, spiritHealBonus: 0.06 },
    championAura: { name: '冠军气场', icon: '🏆', desc: '战斗奖励+18%，攻击+12%', battleReward: 0.18, attack: 0.12 },
    rainbowTide: { name: '虹彩潮汐', icon: '🌈', desc: '事件收益+20%，秘境币+10%', currencyMod: 0.1, eventBonus: 0.2 },
    legendEcho: { name: '传奇回响', icon: '📜', desc: '特殊房+25%，精灵充能+50%', specialRoomMult: 1.25, spiritMult: 1.5 },
    chronoFlux: { name: '时序乱流', icon: '🌀', desc: '行动耗时-10%，每层-2秒', timeSave: 0.1, floorTime: -2 },
    memeFiesta: { name: '梗节狂欢', icon: '🎭', desc: '梗房×1.6，事件收益+12%', memeMult: 1.6, eventBonus: 0.12 },
    relicStorm: { name: '遗物风暴', icon: '🏺', desc: '精英遗物率+22%，陷阱率+12%', relicMagnet: 0.22, trapRate: 0.12 },
    libraryGlow: { name: '秘闻辉光', icon: '📚', desc: '特殊房+18%，秘境币+8%', specialRoomMult: 1.18, currencyMod: 0.08 },
    wishTide: { name: '星愿潮汐', icon: '🌠', desc: '精灵充能+70%，每层+4秒', spiritMult: 1.7, floorTime: 4 },
    voidSurge: { name: '虚空涌潮', icon: '🕳️', desc: '怪物+14%，奖励+18%，虚空共鸣+40%', monsterMult: 0.14, currencyMod: 0.18, resonanceGain: 0.4 },
    singularityPulse: { name: '奇点脉冲', icon: '💠', desc: '攻击+22%，每层-5秒，神话怪+60%', attack: 0.22, floorTime: -5, rareMonsterMult: 1.6 },
    chromaticStorm: { name: '炫彩风暴', icon: '🌈', desc: '事件+22%，特殊房+15%，梗房×1.4', eventBonus: 0.22, specialRoomMult: 1.15, memeMult: 1.4 },
    doomEcho: { name: '末日回响', icon: '⏰', desc: '战斗奖励+20%，每层-4秒，怪物+10%', battleReward: 0.2, floorTime: -4, monsterMult: 0.1 }
};

/** 怪物词条：附着于单只怪物，影响属性与战斗行为（与层间词缀独立） */
const TSR_MONSTER_AFFIXES = {
    thickHide: { id: 'thickHide', name: '厚皮', icon: '🛡️', desc: '生命+18%', hpMult: 0.18, weight: 11 },
    fury: { id: 'fury', name: '狂怒', icon: '🔥', desc: '攻击+15%，反击+10%', atkMult: 0.15, counterMult: 0.1, weight: 10 },
    swift: { id: 'swift', name: '迅捷', icon: '💨', desc: '反击伤害+18%', counterMult: 0.18, weight: 9 },
    timeThief: { id: 'timeThief', name: '窃时', icon: '⏳', desc: '每2回合窃取3秒', timeDrain: 3, timeDrainEvery: 2, weight: 8 },
    spiritErode: { id: 'spiritErode', name: '灵蚀', icon: '🧿', desc: '每3回合噬灵10%', spiritDrainPct: 0.1, spiritDrainEvery: 3, weight: 7 },
    regen: { id: 'regen', name: '自愈', icon: '💚', desc: '每3回合回复5%生命', regenPct: 0.05, regenEvery: 3, weight: 9 },
    aegis: { id: 'aegis', name: '护盾', icon: '🔰', desc: '开战获得14%减伤护盾', startShield: 0.14, weight: 8 },
    greedy: { id: 'greedy', name: '贪婪', icon: '🪙', desc: '赏金+28%，生命+6%', rewardMult: 0.28, hpMult: 0.06, weight: 7 },
    cursed: { id: 'cursed', name: '诅咒', icon: '☠️', desc: '每4回合施加攻击-12%×3', curseValue: 0.12, curseEvery: 4, curseDuration: 3, weight: 7 },
    enrage: { id: 'enrage', name: '狂化', icon: '😤', desc: '低血量时反击+35%', lowHpThreshold: 0.35, lowHpCounterMult: 0.35, weight: 8 },
    fragile: { id: 'fragile', name: '脆弱', icon: '🥚', desc: '生命-15%，攻击+20%，赏金+22%', hpMult: -0.15, atkMult: 0.2, rewardMult: 0.22, weight: 6 },
    ironWall: { id: 'ironWall', name: '铁壁', icon: '🧱', desc: '生命+22%，攻击-6%', hpMult: 0.22, atkMult: -0.06, weight: 8 },
    bounty: { id: 'bounty', name: '赏金', icon: '💰', desc: '击败赏金+42%', rewardMult: 0.42, eliteOnly: true, weight: 6 },
    voidTouch: { id: 'voidTouch', name: '虚空', icon: '🕳️', desc: '每5回合造成7%生命伤害', voidDmgPct: 0.07, voidEvery: 5, weight: 5 },
    resonance: { id: 'resonance', name: '断缘', icon: '💔', desc: '每4回合亲密度-2', bondLoss: 2, bondEvery: 4, weight: 6 },
    apocalypseMark: { id: 'apocalypseMark', name: '终焉', icon: '💀', desc: '全属性强化，反击+12%', hpMult: 0.1, atkMult: 0.1, counterMult: 0.12, minTier: 'epic', weight: 4 },
    tyrantCrown: { id: 'tyrantCrown', name: '暴君星冠', icon: '👑', desc: '天穹暴君专属：三维强化+赏金+35%', exclusiveMonster: 'celestialtyrant', hpMult: 0.15, atkMult: 0.2, counterMult: 0.15, rewardMult: 0.35, weight: 0 },
    starCrown: { id: 'starCrown', name: '星域王冠', icon: '💫', desc: '主宰专属：强化属性并噬灵', exclusiveMonster: 'stararchon', hpMult: 0.12, atkMult: 0.18, spiritDrainPct: 0.08, spiritDrainEvery: 3, weight: 0 },
    firstBite: { id: 'firstBite', name: '先制', icon: '⚡', desc: '首回合反击+40%', firstCounterBonus: 0.4, weight: 7 },
    starVeil: { id: 'starVeil', name: '星幕', icon: '🌠', desc: '生命+10%，每4回合展开6%护盾', hpMult: 0.1, shieldPulse: 0.06, shieldEvery: 4, minTier: 'rare', weight: 5 },
    emperorEdict: { id: 'emperorEdict', name: '帝皇敕令', icon: '🌌', desc: '帝皇专属：全属性强化+噬灵', exclusiveMonster: 'spiritemperor', hpMult: 0.14, atkMult: 0.16, spiritDrainPct: 0.09, spiritDrainEvery: 3, rewardMult: 0.25, weight: 0 },
    thornMail: { id: 'thornMail', name: '荆棘', icon: '🌵', desc: '反击+12%，暴击时反刺6%生命', counterMult: 0.12, thornPct: 0.06, weight: 6 },
    mirage: { id: 'mirage', name: '幻惑', icon: '🌫️', desc: '每3回合回复4%生命并迷惑', regenPct: 0.04, regenEvery: 3, weight: 5 },
    prismatic: { id: 'prismatic', name: '溢彩', icon: '🌈', desc: '赏金+32%，攻击+8%', rewardMult: 0.32, atkMult: 0.08, minTier: 'rare', weight: 4 },
    bloodPact: { id: 'bloodPact', name: '血契', icon: '🩸', desc: '每3回合自回4%并造成3%联结伤害', bloodPactEvery: 3, bloodPactRegen: 0.04, bloodPactDmg: 0.03, weight: 5 },
    momentum: { id: 'momentum', name: '势能', icon: '📈', desc: '每回合反击+2%（最多+24%）', momentumCounterPerRound: 0.02, momentumCounterCap: 0.24, weight: 5 },
    frostbite: { id: 'frostbite', name: '霜噬', icon: '❄️', desc: '每3回合窃取2秒，反击+8%', frostEvery: 3, frostDrain: 2, counterMult: 0.08, weight: 6 },
    soulLink: { id: 'soulLink', name: '魂链', icon: '⛓️', desc: '每4回合亲密度-2', bondLoss: 2, bondEvery: 4, weight: 5 },
    phaseShift: { id: 'phaseShift', name: '相位', icon: '🌫️', desc: '生命-10%，攻击+18%，反击+10%', hpMult: -0.1, atkMult: 0.18, counterMult: 0.1, weight: 5 },
    overload: { id: 'overload', name: '过载', icon: '⚡', desc: '每4回合造成6%生命伤害', overloadEvery: 4, overloadDmg: 0.06, atkMult: 0.12, weight: 5 },
    echoStrike: { id: 'echoStrike', name: '回响', icon: '🔊', desc: '每3回合追加5%联结伤害，赏金+18%', echoEvery: 3, echoDmgPct: 0.05, rewardMult: 0.18, weight: 6 },
    chronosMark: { id: 'chronosMark', name: '时印', icon: '⏳', desc: '每3回合窃取2秒，赏金+15%', timeDrain: 2, timeDrainEvery: 3, rewardMult: 0.15, weight: 5 },
    battleSurge: { id: 'battleSurge', name: '战潮', icon: '🌊', desc: '反击+15%，赏金+12%', counterMult: 0.15, rewardMult: 0.12, weight: 6 },
    phaseWalk: { id: 'phaseWalk', name: '相位步', icon: '👣', desc: '每4回合进入相位，下回合闪避攻击', phaseWalkEvery: 4, weight: 5 },
    coinMagnet: { id: 'coinMagnet', name: '吸币', icon: '🧲', desc: '每4回合吸走15秘境币', coinStealEvery: 4, coinSteal: 15, weight: 5 },
    furyPulse: { id: 'furyPulse', name: '怒脉', icon: '💢', desc: '生命≤50%时反击+20%', lowHpThreshold: 0.5, lowHpCounterMult: 0.2, weight: 5 }
};

const TSR_MONSTER_AFFIX_INCOMPAT = [
    ['thickHide', 'fragile'], ['ironWall', 'fragile'], ['aegis', 'fragile']
];

const TSR_BOSS_LINES = {
    intro: [
        '「本周KPI还没打完，你先帮我垫一下。」',
        '「我是这一层的甲方，你就说改不改吧。」',
        '「时光管理局派我来考核你的加班时长。」',
        '「上一任挑战者还在写复盘报告。」',
        '「别慌，我也就比精英怪硬一点点——大概三倍。」',
        '「通关奖励不少，但你得先过我这关考勤。」'
    ],
    mid: [
        '「你这伤害，像周报里的同比增长。」',
        '「还能打？看来今天咖啡喝多了。」',
        '「我血条还很健康，就像我的发际线——暂时。」',
        '「建议你先写份风险评估再来。」'
    ],
    win: [
        '「行，这版方案通过了……下次别选地狱难度。」',
        '「首领倒下了，但闹钟还没响。」',
        '「你赢了，顺便帮我把打卡记录改一下。」'
    ],
    phase: [
        '「二阶段开启——加班模式，启动。」',
        '「你以为我只有一管血？太天真了。」',
        '「狂暴计时开始，请自备急救包。」'
    ]
};

const TSR_BATTLE_TACTICS = {
    aggressive: { id: 'aggressive', name: '猛攻', icon: '⚔️', desc: '攻击+30%，受到反击+8%', attack: 0.3, counterPenalty: 0.08 },
    defensive: { id: 'defensive', name: '守势', icon: '🛡️', desc: '反击-32%，攻击-4%', attack: -0.04, counterReduce: 0.32 },
    feint: { id: 'feint', name: '虚晃', icon: '💨', desc: '首回合伤害+50%，后续攻击-5%', firstStrike: 0.5, attackPenaltyAfterFirst: -0.05 },
    focus: { id: 'focus', name: '专注', icon: '🎯', desc: '暴击率+18%，战斗奖励+25%', critRate: 0.18, battleReward: 0.25 },
    gamble: { id: 'gamble', name: '搏命', icon: '🎲', desc: '50%攻击+50%或-8%生命', gamble: true }
};

const TSR_BATTLE_MID_EVENTS = [
    { id: 'timeRift', name: '时光裂隙', icon: '🌀', chance: 0.13, minRound: 2, maxRound: 10,
      apply: (ctx) => {
          const gain = Math.random() < 0.55 ? 8 : -6;
          ctx.tsr.currentRun.timeLeft += gain;
          return `${gain > 0 ? '裂隙溢出' : '裂隙反噬'}！时间${gain > 0 ? '+' : ''}${gain}秒`;
      } },
    { id: 'spiritWhisper', name: '战阵低语', icon: '✨', chance: 0.11, minRound: 2, maxRound: 11,
      apply: (ctx) => {
          chargeTsrSpirit(12);
          return `${getTsrSpiritDisplayName()}低语加持，精灵充能+12%`;
      } },
    { id: 'coinRain', name: '币雨', icon: '💰', chance: 0.1, minRound: 3, maxRound: 10, eliteOnly: true,
      apply: (ctx) => {
          const g = addTsrRunCurrency(Math.floor(45 * ctx.dm));
          return `战中币雨！额外+${g}秘境币`;
      } },
    { id: 'counterSurge', name: '反击狂潮', icon: '💥', chance: 0.09, minRound: 4, maxRound: 11, bossOnly: true,
      apply: (ctx) => {
          ctx.tsr.currentRun.monsterCounterSurgeRound = ctx.rounds;
          return '狂潮涌动！本回合怪物反击大幅强化';
      } },
    { id: 'healingWind', name: '治愈微风', icon: '🍃', chance: 0.12, minRound: 2, maxRound: 12,
      apply: (ctx) => {
          tsrHealPlayer(0.06);
          return '治愈微风吹过，回复6%生命';
      } },
    { id: 'critFlash', name: '暴击闪光', icon: '⚡', chance: 0.1, minRound: 1, maxRound: 8,
      apply: (ctx) => {
          ctx.tsr.currentRun.battleCritFlash = true;
          return '闪光加持！下回合必暴击';
      } },
    { id: 'shieldBreak', name: '盾碎时刻', icon: '🔨', chance: 0.08, minRound: 3, maxRound: 10,
      apply: (ctx) => {
          ctx.tsr.currentRun.monsterShield = 0;
          return '盾碎时刻！怪物护盾被震碎';
      } }
];

const TSR_BATTLE_COMBO_MILESTONES = [
    { streak: 3, currency: 35, msg: '连击×3！战意觉醒', charge: 0 },
    { streak: 5, currency: 60, charge: 15, msg: '连击×5！灵息涌动' },
    { streak: 8, currency: 120, charge: 30, buff: { name: '连击狂潮', effect: 'attack', value: 0.2, duration: 3, isDebuff: false }, msg: '连击×8！狂潮降临' }
];

const TSR_QUEST_POOL = {
    daily: [
        { id: 'd_explore3', name: '探索日常', desc: '单局探索3个房间', target: 3, track: 'runExplore' },
        { id: 'd_battle2', name: '战斗日常', desc: '单局赢得2场战斗', target: 2, track: 'runBattles' },
        { id: 'd_gamble1', name: '小赌怡情', desc: '参与1次时空赌局', target: 1, track: 'runGambles' },
        { id: 'd_meme1', name: '梗房打卡', desc: '遭遇1次恶趣味房间', target: 1, track: 'runMeme' },
        { id: 'd_elite1', name: '精英猎手', desc: '击败1个精英', target: 1, track: 'runElites' },
        { id: 'd_floor5', name: '登高望远', desc: '单局到达第5层', target: 5, track: 'runFloor' },
        { id: 'd_spirit1', name: '精灵唤醒', desc: '单局触发1次精灵', target: 1, track: 'runSpiritTriggers' },
        { id: 'd_feed1', name: '投喂日常', desc: '喂养精灵1次', target: 1, track: 'spiritFeed' },
        { id: 'd_trial1', name: '试炼挑战', desc: '单局通过1次精灵试炼', target: 1, track: 'runSpiritTrials' },
        { id: 'd_boss1', name: '首领日常', desc: '单局击败1个首领', target: 1, track: 'runBosses' },
        { id: 'd_spiritroom1', name: '灵域漫步', desc: '单局进入1次精灵特殊房', target: 1, track: 'runSpiritRooms' },
        { id: 'd_spiritstar1', name: '飞升打卡', desc: '单局进入飞升台或星域', target: 1, track: 'runStarSpiritRooms' },
        { id: 'd_starfall1', name: '星陨祈福', desc: '单局进入星陨祭坛', target: 1, track: 'runStarfallRooms' },
        { id: 'd_throne1', name: '王座觐见', desc: '单局进入星灵王座', target: 1, track: 'runThroneRooms' },
        { id: 'd_parade1', name: '巡礼打卡', desc: '单局进入星灵巡礼', target: 1, track: 'runParadeRooms' },
        { id: 'd_affix2', name: '词条日常', desc: '单局击败2只带词条怪物', target: 2, track: 'runAffixKills' },
        { id: 'd_affixforge1', name: '熔炉打卡', desc: '单局进入词条熔炉', target: 1, track: 'runAffixForgeRooms' },
        { id: 'd_champion1', name: '殿堂打卡', desc: '单局进入冠军殿堂', target: 1, track: 'runChampionHallRooms' },
        { id: 'd_chronoLib1', name: '秘闻打卡', desc: '单局进入时序图书馆', target: 1, track: 'runChronoLibraryRooms' },
        { id: 'd_starWish1', name: '星愿祈福', desc: '单局进入星愿池', target: 1, track: 'runStarWishRooms' }
    ],
    weekly: [
        { id: 'w_clear2', name: '双线通关', desc: '本周通关2次', target: 2, track: 'weeklyClears' },
        { id: 'w_boss3', name: '首领猎人', desc: '本周击败3个首领', target: 3, track: 'weeklyBosses' },
        { id: 'w_meme8', name: '梗海遨游', desc: '本周遭遇8次梗房', target: 8, track: 'weeklyMeme' },
        { id: 'w_runs5', name: '秘境常客', desc: '本周冒险5次', target: 5, track: 'weeklyRuns' },
        { id: 'w_synergy1', name: '羁绊试炼', desc: '本周触发1次契约羁绊', target: 1, track: 'weeklySynergy' },
        { id: 'w_spirit8', name: '精灵之约', desc: '本周触发8次精灵', target: 8, track: 'weeklySpiritTriggers' },
        { id: 'w_skill1', name: '灵脉钻研', desc: '本周解锁1个灵脉技能', target: 1, track: 'weeklySpiritSkills' },
        { id: 'w_trial3', name: '试炼周课', desc: '本周通过3次精灵试炼', target: 3, track: 'weeklySpiritTrials' },
        { id: 'w_mythic3', name: '神话猎杀', desc: '本周击败3个神话级怪物', target: 3, track: 'weeklyMythicKills' },
        { id: 'w_spiritroom5', name: '灵域探索', desc: '本周进入5次精灵房', target: 5, track: 'weeklySpiritRooms' },
        { id: 'w_spiritstar2', name: '星域漫步', desc: '本周进入2次飞升台/星域', target: 2, track: 'weeklyStarSpiritRooms' },
        { id: 'w_throne1', name: '王座试炼', desc: '本周王座三连战通关1次', target: 1, track: 'weeklyThroneClears' },
        { id: 'w_starfall3', name: '星陨巡礼', desc: '本周进入3次星陨祭坛', target: 3, track: 'weeklyStarfallRooms' },
        { id: 'w_tyrant1', name: '天穹猎杀', desc: '本周击败1次天穹暴君', target: 1, track: 'weeklyTyrantKills' },
        { id: 'w_affix5', name: '词条讨伐', desc: '本周击败5只带词条怪物', target: 5, track: 'weeklyAffixKills' },
        { id: 'w_champion2', name: '殿堂试炼', desc: '本周冠军殿堂三连战通关2次', target: 2, track: 'weeklyChampionClears' },
        { id: 'w_chronoLib3', name: '秘闻巡礼', desc: '本周进入3次时序图书馆', target: 3, track: 'weeklyChronoLibraryRooms' },
        { id: 'w_timeLoom2', name: '织机匠人', desc: '本周进入2次时光织机', target: 2, track: 'weeklyTimeLoomRooms' }
    ]
};

const TSR_CODEX_MILESTONES = [
    { ratio: 0.5, id: 'half', reward: 12000, label: '图鉴过半' },
    { ratio: 0.75, id: 'threequarter', reward: 28000, label: '博闻多识' },
    { ratio: 1, id: 'full', reward: 66000, label: '图鉴全开' }
];

const TSR_PLAYER_TITLES = [
    { minClear: 0, minFloor: 0, title: '时光新人', icon: '🌱' },
    { minClear: 1, minFloor: 10, title: '裂隙行者', icon: '⏳' },
    { minClear: 5, minFloor: 15, title: '秘境猎手', icon: '🗡️' },
    { minClear: 15, minFloor: 20, title: '逐层征服者', icon: '🔥' },
    { minClear: 30, minFloor: 25, title: '噩梦领主', icon: '💀' },
    { minClear: 50, minFloor: 30, title: '地狱审判官', icon: '☠️' },
    { minClear: 100, minFloor: 30, title: '永恒守时者', icon: '👑' },
    { minClear: 0, minFloor: 45, title: '超越旅人', icon: '🌟', minDiffClear: 'transcendent' },
    { minClear: 0, minFloor: 50, title: '终焉见证者', icon: '💀', minDiffClear: 'apocalypse' },
    { needThroneClears: 1, title: '王座挑战者', icon: '⚔️', priority: 70 },
    { needEvo: 4, needSpiritLevel: 40, title: '终焉星灵', icon: '🌌', priority: 90 },
    { needAchievement: 'archonRelic', title: '星冠加冕者', icon: '✨', priority: 88 },
    { needStarBossWins: 5, title: '星域主宰', icon: '💫', priority: 85 },
    { needThroneClears: 3, title: '王座永恒', icon: '👑', priority: 95 },
    { needAchievement: 'tyrantRelic', title: '天穹裁决者', icon: '🌠', priority: 92 },
    { needThroneExtreme: 1, title: '极境星灵', icon: '💀', priority: 98 },
    { needAffixKills: 20, title: '词条猎人', icon: '🏷️', priority: 75 },
    { needAchievement: 'affixCodexFull', title: '词条全识', icon: '📕', priority: 86 },
    { needAchievement: 'championHall1', title: '殿堂冠军', icon: '🏆', priority: 78 },
    { needAchievement: 'affixLordClear', title: '词条行者', icon: '🏷️', priority: 72 },
    { needAchievement: 'fortuneSeekerClear', title: '彩运行者', icon: '🎨', priority: 70 },
    { needAchievement: 'starFortune7', title: '七星照运', icon: '🌟', priority: 68 },
    { needAchievement: 'chronoHunterClear', title: '时序行者', icon: '🕰️', priority: 71 },
    { needAchievement: 'codexKeeperClear', title: '图鉴守护', icon: '📚', priority: 73 },
    { needAchievement: 'mirrorMaze1', title: '迷城破局者', icon: '🪞', priority: 74 },
    { needAchievement: 'chronoLibrary5', title: '时序学者', icon: '📖', priority: 76 }
];

const TSR_SIGN_IN_REWARDS = [
    { currency: 1000 },
    { currency: 1200 },
    { currency: 1500 },
    { currency: 1800, keys: 1 },
    { currency: 2000 },
    { currency: 2500 },
    { currency: 3000, keys: 2 }
];

const TSR_FORTUNE_PRIZES = [
    { label: '1000币', weight: 28, currency: 1000, icon: '🪙' },
    { label: '1500币', weight: 22, currency: 1500, icon: '💰' },
    { label: '2200币', weight: 14, currency: 2200, icon: '✨' },
    { label: '1钥匙', weight: 10, keys: 1, icon: '🔑' },
    { label: '精灵经验', weight: 12, spiritExp: 80, icon: '🧚' },
    { label: '暴击遗物券', weight: 8, runBuff: 'attack', icon: '⚔️' },
    { label: '超级大奖', weight: 4, currency: 3000, keys: 1, icon: '🎁' },
    { label: '再接再厉', weight: 12, currency: 800, icon: '🍀' }
];

const TSR_FORTUNE_PAID_COST = 1500;

const TSR_BOUNTY_POOL = [
    { id: 'b_clear1', name: '速通悬赏', desc: '今日通关1次', track: 'dailyClear', target: 1, reward: { currency: 1800 } },
    { id: 'b_run2', name: '裂隙穿梭', desc: '今日冒险2次', track: 'dailyRuns', target: 2, reward: { currency: 1400 } },
    { id: 'b_floor10', name: '登高赏时', desc: '单局到达10层', track: 'runFloor', target: 10, reward: { currency: 1600 } },
    { id: 'b_elite2', name: '精英讨伐', desc: '今日击败2个精英', track: 'dailyElites', target: 2, reward: { currency: 1600 } },
    { id: 'b_meme2', name: '梗海冲浪', desc: '今日遭遇2次梗房', track: 'dailyMeme', target: 2, reward: { currency: 1400 } },
    { id: 'b_gamble2', name: '赌局老手', desc: '今日参与2次赌局', track: 'dailyGambles', target: 2, reward: { currency: 1300 } },
    { id: 'b_spirit2', name: '精灵共鸣', desc: '今日触发2次精灵', track: 'dailySpirit', target: 2, reward: { currency: 1700, spiritExp: 50 } },
    { id: 'b_feed1', name: '投喂悬赏', desc: '今日喂养精灵1次', track: 'spiritFeed', target: 1, reward: { currency: 1200, spiritExp: 40 } },
    { id: 'b_starboss1', name: '星域猎手', desc: '今日击败1个星域级首领', track: 'dailyStarBoss', target: 1, reward: { currency: 2200, spiritExp: 80 } },
    { id: 'b_throne1', name: '王座悬赏', desc: '今日王座三连战通关1次', track: 'dailyThroneClear', target: 1, reward: { currency: 2600, spiritExp: 100 } },
    { id: 'b_tyrant1', name: '暴君悬赏', desc: '今日击败1次天穹暴君', track: 'dailyTyrant', target: 1, reward: { currency: 2800, spiritExp: 120 } },
    { id: 'b_affix3', name: '词条悬赏', desc: '今日击败3只带词条怪物', track: 'dailyAffixKills', target: 3, reward: { currency: 2000, spiritExp: 60 } },
    { id: 'b_champion1', name: '殿堂悬赏', desc: '今日冠军殿堂三连战通关1次', track: 'dailyChampionClear', target: 1, reward: { currency: 2400, spiritExp: 70 } },
    { id: 'b_chronoLib1', name: '秘闻悬赏', desc: '今日进入时序图书馆1次', track: 'dailyChronoLibrary', target: 1, reward: { currency: 1800, spiritExp: 55 } },
    { id: 'b_starWish1', name: '星愿悬赏', desc: '今日进入星愿池1次', track: 'dailyStarWish', target: 1, reward: { currency: 1900, spiritExp: 60 } }
];

const TSR_DAILY_CHALLENGES = [
    { id: 'dc_gambler', name: '赌神试炼', desc: '使用赌神契约通关', icon: '🎰', reward: 1800, check: ctx => ctx.cleared && ctx.contract === 'gambler' },
    { id: 'dc_speed', name: '疾行传说', desc: '使用疾行者契约通关', icon: '⚡', reward: 1600, check: ctx => ctx.cleared && ctx.contract === 'speedrun' },
    { id: 'dc_noRest', name: '不眠远征', desc: '全程不休息通关', icon: '🌙', reward: 1800, check: ctx => ctx.cleared && ctx.noRest },
    { id: 'dc_meme', name: '梗王加冕', desc: '使用梗王契约通关', icon: '🃏', reward: 1700, check: ctx => ctx.cleared && ctx.contract === 'memeLord' },
    { id: 'dc_streak8', name: '连击风暴', desc: '单局战斗连击达8', icon: '🌀', reward: 1500, check: ctx => ctx.cleared && (ctx.maxBattleStreak || 0) >= 8 },
    { id: 'dc_hell', name: '地狱证章', desc: '地狱难度通关', icon: '☠️', reward: 2200, check: ctx => ctx.cleared && ctx.difficulty === 'hell' },
    { id: 'dc_spirit', name: '驭灵试炼', desc: '驭灵者契约通关', icon: '🧚', reward: 1900, check: ctx => ctx.cleared && ctx.spiritContractClear },
    { id: 'dc_relic3', name: '遗物满载', desc: '携带满遗物通关', icon: '🏺', reward: 2000, check: ctx => ctx.cleared && (ctx.runRelics || 0) >= getTsrRelicMax() },
    { id: 'dc_transcendent', name: '超越试炼', desc: '超越难度通关', icon: '🌟', reward: 2600, check: ctx => ctx.cleared && ctx.difficulty === 'transcendent' },
    { id: 'dc_apocalypse', name: '终焉证章', desc: '终焉难度通关', icon: '💀', reward: 3000, check: ctx => ctx.cleared && ctx.difficulty === 'apocalypse' },
    { id: 'dc_sage', name: '学者远征', desc: '精灵学者契约通关', icon: '📚', reward: 2000, check: ctx => ctx.cleared && ctx.spiritSageClear },
    { id: 'dc_hunter', name: '猎灵试炼', desc: '猎灵者契约通关', icon: '🏹', reward: 1900, check: ctx => ctx.cleared && ctx.spiritHunterClear },
    { id: 'dc_starSpirit', name: '星灵同行', desc: '终焉星灵状态下通关', icon: '💫', reward: 2800, check: ctx => ctx.cleared && ctx.starSpiritClear },
    { id: 'dc_starContract', name: '星灵契约', desc: '星灵契约通关', icon: '🌌', reward: 2600, check: ctx => ctx.cleared && ctx.starSpiritContractClear },
    { id: 'dc_throne', name: '王座征服', desc: '本局完成王座三连战', icon: '👑', reward: 2500, check: ctx => ctx.cleared && ctx.throneClearThisRun },
    { id: 'dc_tyrant', name: '暴君试炼', desc: '本局击败天穹暴君', icon: '🌠', reward: 2700, check: ctx => ctx.cleared && ctx.tyrantKillThisRun },
    { id: 'dc_affixDual', name: '双词条猎杀', desc: '本局击败双词条首领或精英', icon: '🏷️', reward: 2400, check: ctx => ctx.cleared && ctx.dualAffixKillThisRun },
    { id: 'dc_affixLord', name: '词条行者', desc: '词条行者契约通关', icon: '🏷️', reward: 2100, check: ctx => ctx.cleared && ctx.affixLordClear },
    { id: 'dc_champion', name: '殿堂征服', desc: '本局冠军殿堂三连战通关', icon: '🏆', reward: 2300, check: ctx => ctx.cleared && ctx.championClearThisRun },
    { id: 'dc_chronoHunter', name: '时序试炼', desc: '使用时序猎手契约通关', icon: '🕰️', reward: 2000, check: ctx => ctx.cleared && ctx.chronoHunterClear },
    { id: 'dc_codexKeeper', name: '图鉴守护', desc: '使用图鉴守护者契约通关', icon: '📚', reward: 1900, check: ctx => ctx.cleared && ctx.codexKeeperClear },
    { id: 'dc_mirrorMaze', name: '迷城征服', desc: '本局镜像迷城完美通关', icon: '🪞', reward: 2000, check: ctx => ctx.cleared && ctx.mirrorMazeWinThisRun }
];

const TSR_WEEKLY_MODIFIERS = [
    { id: 'affixWeek', name: '词条周', icon: '🏷️', desc: '怪物词条率+25%，词条赏金+10%' },
    { id: 'spiritWeek', name: '灵息周', icon: '🧚', desc: '精灵充能效率+40%' },
    { id: 'relicWeek', name: '遗宝周', icon: '🏺', desc: '精英遗物掉落率+15%' },
    { id: 'battleWeek', name: '战意周', icon: '⚔️', desc: '战斗奖励+12%，攻击+8%' },
    { id: 'bondWeek', name: '羁绊周', icon: '💞', desc: '触发回血+5%，亲密度触发+3' },
    { id: 'huntWeek', name: '狩猎周', icon: '🏹', desc: '精英币+12%，稀有怪率+30%' },
    { id: 'codexWeek', name: '图鉴周', icon: '📖', desc: '特殊房+20%，词条赏金+8%' },
    { id: 'chronoWeek', name: '时序周', icon: '⏳', desc: '行动耗时-10%，每层+3秒' }
];

const TSR_WEEKLY_MODIFIER_EFFECTS = {
    affixWeek: { affixRollBoost: 0.25, affixReward: 0.1 },
    spiritWeek: { spiritMult: 1.4 },
    relicWeek: { relicMagnet: 0.15 },
    battleWeek: { battleReward: 0.12, attack: 0.08 },
    bondWeek: { spiritHealBonus: 0.05, bondOnTrigger: 3 },
    huntWeek: { eliteCurrencyBonus: 0.12, rareMonsterMult: 1.3 },
    codexWeek: { specialRoomMult: 1.2, affixReward: 0.08 },
    chronoWeek: { timeSave: 0.1, floorTime: 3 }
};

const TSR_TICKER_LINES = [
    '通关可推进难度解锁与图鉴里程碑',
    '双契约组合可触发羁绊加成，收益更高',
    '每日签到连击7天有超级大奖',
    '完成今日挑战可获得额外秘境币',
    '精灵Lv5解锁驭灵契约与试炼厅',
    '层间词缀每3层刷新，留意右侧预览',
    '悬赏任务每日刷新，别忘了领取',
    '免费转盘每日1次，祝你好运',
    '探索后有概率触发动态遭遇，留意弹窗选择',
    '狩猎布告栏可挑战悬赏精英，奖励丰厚',
    '战斗怪物各有技能：窃时、护盾、自愈……',
    '秘境战斗使用独立战阶，与主世界属性脱钩',
    '精灵14级可进竞技场，24级可进灵枢节点',
    '猎灵者契约8级解锁，精英战收益更高',
    '超越/终焉难度神话怪出现率大幅提升',
    '终焉灵冠为灵脉技能树终极分支之一',
    '精灵Lv35+永恒神使可进终焉飞升台，进化第4形态',
    '终焉星灵需Lv40、亲密度75及终焉证明（三选一）',
    '星灵本源为终焉星灵专属灵脉，需习得终焉灵冠',
    '飞升试炼击败精灵帝皇可解锁终焉进化条件',
    '终焉星灵可解锁星灵契约与终焉星域专属房间',
    '星灵本源后可领悟星幕庇护、终焉脉冲、星域统御',
    '超越/终焉难度首领层可能出现终焉星域主宰',
    '星灵王座需终焉星灵且习得星灵本源或星域统御',
    '王座挑战为三连战：星卫→怨灵→主宰，通关可获星域王冠',
    '王座三连战通关3次后可挑战极境·天穹暴君',
    '天穹审判庭、星灵巡礼、虚空裂隙为最新特殊房间',
    '击败天穹暴君可获专属遗物「暴君封印」',
    '战斗怪物可能携带词条：厚皮、狂怒、窃时等，击败有额外赏金',
    '双词条精英/首领更难打，但掉落秘境币更丰厚',
    '词条熔炉可剥离、净化、重铸或铸造怪物词条',
    '词条狩猎场专猎双词条精英，赏金更丰厚',
    '词条透视镜可提前洞察守关者词条',
    '灵脉「词条猎脉/词条破界」可克制带词条怪物',
    '每周秘境界词轮换，可在大厅查看本周加成',
    '冠军殿堂三连战、遗物祭坛、羁绊圣所为新特殊房间',
    '词条行者契约需累计击败8只带词条怪物后解锁',
    '今日星运在大厅可见，每局冒险开局自动生效',
    '彩运轮盘、传奇见闻馆为最新彩色特殊房间',
    '彩运契约需转动彩运轮盘2次或访问传奇见闻馆后解锁',
    '时序图书馆、星愿池、镜像迷城、符文抄录室、时光织机为最新特殊房间',
    '时序猎手契约需时光扭曲成功3次或冒险15次后解锁',
    '图鉴守护者契约需图鉴过半或传奇见闻馆3次后解锁',
    '秘闻灵径、星愿感应、时序之叶为新增灵脉分支',
    '时序乱流、梗节狂欢、遗物风暴、秘闻辉光、星愿潮汐为新增层间词缀',
    '相位、过载、回响、时印为新增怪物词条',
    '马拉松会议、消息宕机、紧急热修为新增恶趣味房间',
    '局内装备系统：武器/护甲/戒指/时环四槽，精英首领宝箱与商店可获取',
    '时光熔炉新增「铸装」选项，可锻造随机局内装备',
    '装备可强化至+5、背包分解换币、熔炉熔炼升品质',
    '流光/逆流/星辉等前缀套装：2件小套、4件大套加成',
    '传说专属：星域/暴君/帝皇神装由神话首领掉落，可洗炼重铸属性',
    'Ω序/奇点难度首领可掉落对应传说套装部件'
];

const TSR_BUFF_TEMPLATES = {
    attack: { name: '攻击强化', description: '攻击力提升50%，探索时间+30秒', effect: 'attack', value: 0.5, duration: 0, timeBonus: 30 },
    health: { name: '生命强化', description: '生命值提升50%，探索时间+60秒', effect: 'health', value: 0.5, duration: 0, timeBonus: 60 },
    critRate: { name: '暴击强化', description: '暴击率提升10%，探索时间+90秒', effect: 'critRate', value: 0.1, duration: 0, timeBonus: 90 },
    critDamage: { name: '爆伤强化', description: '爆伤提升50%，探索时间+120秒', effect: 'critDamage', value: 0.5, duration: 0, timeBonus: 120 },
    speed: { name: '速度强化', description: '探索速度提升，探索时间+150秒', effect: 'speed', value: 10, duration: 0, timeBonus: 150 },
    luck: { name: '幸运强化', description: '获得双倍秘境币', effect: 'luck', value: 1, duration: 0, timeBonus: 0 }
};

/** 正常通关秘境币软顶（简单最高100 · 奇点最高80万） */
const TSR_DIFFICULTY_RUN_CURRENCY_CAP = {
    easy: 100,
    normal: 230,
    hard: 510,
    nightmare: 1200,
    hell: 2600,
    abyss: 6000,
    eternal: 13500,
    transcendent: 30500,
    apocalypse: 69000,
    void: 156000,
    omega: 355000,
    singularity: 800000
};

function getTsrDifficultyRunCurrencyCap(diffKey) {
    const key = diffKey || player?.timeSecretRealm?.currentRun?.difficulty
        || player?.timeSecretRealm?.difficulty?.current;
    const cap = TSR_DIFFICULTY_RUN_CURRENCY_CAP[key];
    return Number.isFinite(cap) ? cap : null;
}

function getDefaultTsrDifficultyLevels() {
    // rewardMultiplier 按「典型通关≈软顶九成」标定；结算再按 CAP 封顶
    return {
        easy: { name: '简单', multiplier: 1.15, rewardMultiplier: 0.16, description: '新手友好，通关约百币', unlockCondition: '无', clearFloor: 26 },
        normal: { name: '普通', multiplier: 1.45, rewardMultiplier: 0.18, description: '标准难度，攻守平衡', unlockCondition: '通关简单难度3次', clearFloor: 40 },
        hard: { name: '困难', multiplier: 1.9, rewardMultiplier: 0.22, description: '更具挑战性', unlockCondition: '通关普通难度5次', clearFloor: 55 },
        nightmare: { name: '噩梦', multiplier: 2.55, rewardMultiplier: 0.27, description: '高压节奏', unlockCondition: '通关困难难度10次', clearFloor: 70 },
        hell: { name: '地狱', multiplier: 3.5, rewardMultiplier: 0.33, description: '高强度考验', unlockCondition: '通关噩梦难度20次', clearFloor: 85 },
        abyss: { name: '深渊', multiplier: 4.6, rewardMultiplier: 0.41, description: '稀有遭遇增多', unlockCondition: '通关地狱难度30次', clearFloor: 105 },
        eternal: { name: '永恒', multiplier: 5.9, rewardMultiplier: 0.54, description: '神话威胁开始出现', unlockCondition: '通关深渊难度25次', clearFloor: 125 },
        transcendent: { name: '超越', multiplier: 7.4, rewardMultiplier: 0.74, description: '灵域与时光交织', unlockCondition: '通关永恒难度30次', clearFloor: 145 },
        apocalypse: { name: '终焉', multiplier: 9.5, rewardMultiplier: 0.96, description: '神话首领常态化', unlockCondition: '通关超越难度20次', clearFloor: 170 },
        void: { name: '虚空', multiplier: 12.0, rewardMultiplier: 1.35, description: '虚空裂隙与神话怪', unlockCondition: '通关终焉难度15次', clearFloor: 195 },
        omega: { name: 'Ω序', multiplier: 14.5, rewardMultiplier: 2.0, description: '时序崩坏，双词条精英', unlockCondition: '通关虚空难度12次', clearFloor: 220 },
        singularity: { name: '奇点', multiplier: 18.0, rewardMultiplier: 2.87, description: '终极试炼，通关封顶80万', unlockCondition: '通关Ω序难度10次', clearFloor: 250 }
    };
}

function getTsrIdleCurrentRun() {
    return {
        isActive: false,
        currentFloor: 1,
        timeLeft: 0,
        tempBuffs: [],
        relics: [],
        equipped: { weapon: null, armor: null, ring: null, chronos: null },
        equipmentBag: [],
        currentRoom: null,
        exploredRooms: 0,
        currencyEarned: 0,
        playerHealth: 0,
        playerAttack: 0,
        combat: null
    };
}

/** 存档前剥离活跃局内的闭包与不可序列化字段（保留 combat / currentRoom） */
function sanitizeTsrActiveRunForSave(run) {
    if (!run?.isActive) return;
    run.pendingEncounter = null;
    run.pendingInteractiveEvent = null;
    run.currentShop = null;
    run.pddProgress = null;
    run.recallOutcomes = null;
    run.overtimeStage = null;
    if (Array.isArray(run.floorHistory) && run.floorHistory.length > TSR_FLOOR_HISTORY_MAX) {
        run.floorHistory = run.floorHistory.slice(-TSR_FLOOR_HISTORY_MAX);
    }
    if (Array.isArray(run.tempBuffs) && run.tempBuffs.length > 24) {
        run.tempBuffs = run.tempBuffs.slice(-24);
    }
    if (Array.isArray(run.consumables) && run.consumables.length > 16) {
        run.consumables = run.consumables.slice(-16);
    }
    if (Array.isArray(run.equipmentBag) && run.equipmentBag.length > getTsrEquipBagMax() + 4) {
        run.equipmentBag = run.equipmentBag.slice(-getTsrEquipBagMax());
    }
}

/** 释放局内闭包与大对象引用（结束冒险 / 完全重置时调用） */
function releaseTsrRunHeavyRefs(run) {
    if (!run) return;
    // 先解挂 Promise / 弹层，再清计时器，避免 await 永远不结束
    if (typeof run._feelEmergencyResolve === 'function') {
        try { run._feelEmergencyResolve('release'); } catch (e) { /* ignore */ }
    }
    if (typeof run._feelCinemaResolve === 'function') {
        try { run._feelCinemaResolve('release'); } catch (e) { /* ignore */ }
    }
    if (typeof run._feelResultResolve === 'function') {
        try { run._feelResultResolve('release'); } catch (e) { /* ignore */ }
    }
    if (run._battleFeelSafetyTimer != null) {
        clearTimeout(run._battleFeelSafetyTimer);
        run._battleFeelSafetyTimer = null;
    }
    if (typeof clearTsrBattleFeelTimers === 'function') clearTsrBattleFeelTimers(run);
    else {
        (run._battleFeelTimers || []).forEach(t => clearTimeout(t));
        run._battleFeelTimers = [];
        (run._battleFeelResolvers || []).splice(0);
    }
    sanitizeTsrActiveRunForSave(run);
    run.pendingEncounter = null;
    run.pendingInteractiveEvent = null;
    run.currentShop = null;
    run.spiritPactCombat = null;
    run.combat = null;
    run.pendingFeelEvents = null;
    run.deferredBattleLogs = null;
    run.battleLootBuffer = null;
    run.pendingOverflowItems = null;
    run.lastBattleSummary = null;
    run._combatHitsDraft = null;
    run._feelEmergencyResolve = null;
    run._feelCinemaResolve = null;
    run._feelResultResolve = null;
    run.battleInProgress = false;
    run.battleFeelSkip = true;
    if (run.currentRoom) {
        run.currentRoom.monster = null;
        run.currentRoom.trap = null;
        run.currentRoom = null;
    }
}

/** 重置为空闲局，供结束冒险 / 读档 / 存档前调用 */
function resetTsrCurrentRun() {
    const tsr = player.timeSecretRealm;
    if (!tsr) return;
    releaseTsrRunHeavyRefs(tsr.currentRun);
    tsr.currentRun = getTsrIdleCurrentRun();
}

/** 清理秘境 UI 中可能持有 onclick / 大 HTML 的节点 */
function disposeTsrRunUiState() {
    // 局终必须打断战斗演出，否则 present 异步仍握着旧 run / combatHits
    if (typeof skipTsrBattleFeel === 'function') {
        try { skipTsrBattleFeel(true); } catch (e) { /* ignore */ }
    }
    if (typeof resolveTsrFeelModals === 'function') {
        try { resolveTsrFeelModals(); } catch (e) { /* ignore */ }
    }
    clearTimeout(window._tsrMonsterHpChipTimer);
    clearTimeout(window._tsrPlayerHpChipTimer);
    window._tsrMonsterHpChipTimer = null;
    window._tsrPlayerHpChipTimer = null;
    const toast = document.getElementById('tsrAmbientToast');
    if (toast?._hideTimer) {
        clearTimeout(toast._hideTimer);
        toast._hideTimer = null;
        toast.classList.remove('show');
    }
    hideTsrChoicePanels(true);
    hideTsrRunShopPanel(true);
    hideTsrMonsterBanner(true);
    const fx = document.getElementById('tsrCombatFxLayer');
    if (fx) fx.innerHTML = '';
    clearTsrBattleLog();
    const combatBar = document.getElementById('tsrCombatBar');
    if (combatBar) combatBar.style.display = 'none';
    const floorMap = document.getElementById('tsrFloorMap');
    if (floorMap) floorMap.innerHTML = '';
    invalidateTsrUiCache();
}

function extractTsrShopPurchasedMap(tsr) {
    const purchased = {};
    if (tsr.shopPurchased && typeof tsr.shopPurchased === 'object') {
        Object.entries(tsr.shopPurchased).forEach(([key, n]) => {
            const v = Number(n) || 0;
            if (v > 0) purchased[key] = v;
        });
        return purchased;
    }
    if (tsr.shopItems && typeof tsr.shopItems === 'object') {
        Object.entries(tsr.shopItems).forEach(([key, item]) => {
            const v = Number(item?.purchased) || 0;
            if (v > 0) purchased[key] = v;
        });
    }
    return purchased;
}

/** 保存前剥离静态配置与局外冗余，减小存档体积 */
function pruneTimeSecretRealmForSave() {
    const tsr = player.timeSecretRealm;
    if (!tsr) return;
    // 切勿裸 delete timer：会丢引用却不停 interval，多开几局后时间倍速流逝
    // 暂存运行中计时器，stringify 后由 restoreTsrTimerAfterSave 回填
    window._tsrTimerSaveStash = tsr.timer != null ? tsr.timer : null;
    window._tsrTimerGenStash = tsr._timerGen || 0;
    delete tsr.timer;
    delete tsr._timerGen;
    if (tsr._welfareWheelSpinTimer) {
        clearTimeout(tsr._welfareWheelSpinTimer);
        tsr._welfareWheelSpinTimer = null;
    }
    delete tsr.tempBuffs;
    delete tsr.roomTypes;
    delete tsr.unlockedItems;

    tsr.shopPurchased = extractTsrShopPurchasedMap(tsr);
    delete tsr.shopItems;

    if (tsr.traps) {
        const ps = tsr.traps.playerSkills || { detection: 'basic', disarm: 'basic' };
        tsr.traps = {
            playerSkills: {
                detection: ps.detection || 'basic',
                disarm: ps.disarm || 'basic'
            }
        };
    }

    if (tsr.difficulty) {
        tsr.difficulty = {
            current: tsr.difficulty.current || 'easy',
            unlocked: Array.isArray(tsr.difficulty.unlocked) ? tsr.difficulty.unlocked.slice() : ['easy']
        };
    }

    if (!tsr.currentRun?.isActive) {
        resetTsrCurrentRun();
    } else {
        sanitizeTsrActiveRunForSave(tsr.currentRun);
    }
}

/** stringify 后恢复局内计时引用（与 pruneTimeSecretRealmForSave 配对） */
function restoreTsrTimerAfterSave() {
    const tsr = player?.timeSecretRealm;
    const stashedTimer = window._tsrTimerSaveStash;
    const stashedGen = window._tsrTimerGenStash;
    window._tsrTimerSaveStash = null;
    window._tsrTimerGenStash = null;

    const clearStashed = (id) => {
        if (id == null) return;
        if (typeof unregisterInterval === 'function') unregisterInterval(id);
        else clearInterval(id);
    };

    if (!tsr) {
        clearStashed(stashedTimer);
        if (window._tsrIntervalId != null && window._tsrIntervalId !== stashedTimer) {
            clearStashed(window._tsrIntervalId);
        }
        window._tsrIntervalId = null;
        return;
    }

    // 大厅/已结束局：禁止把 interval 写回，否则「通关后秒表还在跑 → 再进局立刻时间耗尽」
    if (!tsr.currentRun?.isActive) {
        clearStashed(stashedTimer);
        if (window._tsrIntervalId != null && window._tsrIntervalId !== stashedTimer) {
            clearStashed(window._tsrIntervalId);
        }
        tsr.timer = null;
        window._tsrIntervalId = null;
        tsr._timerGen = (Math.max(Number(stashedGen) || 0, Number(tsr._timerGen) || 0)) + 1;
        return;
    }

    if (stashedTimer != null) {
        tsr.timer = stashedTimer;
        window._tsrIntervalId = stashedTimer;
    }
    if (stashedGen != null) {
        tsr._timerGen = stashedGen;
    }
}

/** 读档后清除误入存档的静态数据（运行时由 ensure 重建） */
function stripTimeSecretRealmSaveBloat(tsr) {
    if (!tsr) return;
    // ensure 会频繁调用：活动局正在跑的 interval 绝不能 delete（否则孤儿叠加）
    const timerId = tsr.timer;
    const isLive = timerId != null && Array.isArray(window._gameIntervals)
        && window._gameIntervals.indexOf(timerId) >= 0;
    if (!isLive) {
        // 存档脏字段 / 跨会话废 ID：仅丢弃引用，勿 clear 误伤其它定时器
        tsr.timer = null;
    }
    if (tsr._welfareWheelSpinTimer) {
        clearTimeout(tsr._welfareWheelSpinTimer);
        tsr._welfareWheelSpinTimer = null;
    }
    delete tsr.tempBuffs;
    delete tsr.roomTypes;
    delete tsr.unlockedItems;
    if (!tsr.currentRun?.isActive) {
        resetTsrCurrentRun();
    } else {
        sanitizeTsrActiveRunForSave(tsr.currentRun);
    }
}

function pickTsrMemeRoom() {
    return TSR_MEME_ROOM_TYPES[Math.floor(Math.random() * TSR_MEME_ROOM_TYPES.length)];
}

function getTsrMemeRoomWeight() {
    let w = TSR_MEME_ROOM_WEIGHT;
    const tsr = player.timeSecretRealm;
    if (tsr?.permanentBonuses?.memePass) w *= 2;
    if (tsr?.currentRun?.isActive && tsr.currentRun.contractMods?.memeMult) {
        w *= tsr.currentRun.contractMods.memeMult;
    }
    const affix = getTsrActiveAffix();
    if (affix?.memeMult) w *= affix.memeMult;
    return w;
}

function getTsrSpecialRoomWeight() {
    const spiritBonus = getTsrSpiritBonuses().specialRoomBonus || 0;
    const affix = getTsrActiveAffix();
    const affixMult = affix?.specialRoomMult || 1;
    const contractMult = player.timeSecretRealm?.currentRun?.contractMods?.specialRoomMult || 1;
    return TSR_SPECIAL_ROOM_WEIGHT * (1 + getTsrPermanentSpiritPactBonus() * 0.5 + spiritBonus + getTsrPermanentStarDomainSigil() + getTsrPermanentArchonFragment() * 0.5) * affixMult * contractMult;
}

/** 核心特殊房动态权重（供 unify 扩展表合并，避免洋葱截胡） */
function buildTsrCoreSpecialRoomWeights(ctx) {
    const sp = ctx?.sp || ensureTsrSpiritPet();
    const tsr = ctx?.tsr || player.timeSecretRealm;
    const weights = {};
    TSR_SPECIAL_ROOM_TYPES.forEach(key => { weights[key] = 1; });
    if (sp.level >= 5) weights.spirittrial = 2.5 + sp.level * 0.06;
    if (sp.level >= 10) {
        weights.spiritgarden = (weights.spiritgarden || 1) + 1.2;
        weights.spiritsanctuary = (weights.spiritsanctuary || 1) + 1;
    }
    if (sp.level >= 8) weights.spiritwell = 1.4 + (sp.bond || 0) * 0.015;
    if (sp.level >= 15) weights.spiritrift = 1.1 + (sp.evolution || 0) * 0.35;
    if ((sp.bond || 0) >= 40) weights.spiritmemory = 1.3 + sp.level * 0.02;
    if (sp.level >= 12) weights.spiritbazaar = 1.2 + (sp.bond || 0) * 0.01;
    if (sp.level >= 18) weights.spiritoracle = 1.1 + (sp.evolution || 0) * 0.25;
    if (sp.level >= 22) weights.spiritforge = 1.2 + sp.level * 0.015;
    if (sp.level >= 20 && (sp.evolution || 0) >= 2) weights.spiritboss = 0.7 + sp.level * 0.025;
    if (sp.level >= 14) weights.spiritarena = 1.1 + sp.level * 0.02;
    if (sp.level >= 16) weights.spiritcodex = 0.9 + (sp.bond || 0) * 0.008;
    if (sp.level >= 24 && (sp.evolution || 0) >= 2) weights.spiritnexus = 1.0 + sp.level * 0.018;
    if (sp.level >= 35 && sp.evolution >= 3 && sp.evolution < 4) weights.spiritascend = 1.5 + sp.level * 0.02;
    if (sp.evolution >= 4) {
        weights.spiritboss = (weights.spiritboss || 0.5) + 0.4;
        if (sp.level >= 38) weights.spiritstar = 1.3 + sp.level * 0.018;
        if (sp.level >= 36 && hasTsrStarSpiritBuild()) weights.spiritthrone = 0.9 + sp.level * 0.015;
        if (sp.level >= 34) weights.starfall = 1.0 + sp.level * 0.012;
        if (sp.level >= 32) weights.spiritduel = 0.85 + (sp.bond || 0) * 0.008;
        if (sp.level >= 30) weights.celestialvault = 0.7 + sp.level * 0.01;
        if ((tsr.lifetimeStats?.throneClears || 0) >= 1 && sp.level >= 38) weights.tyrantcourt = 0.85 + sp.level * 0.012;
        if (sp.level >= 36) weights.spiritparade = 0.9 + (sp.bond || 0) * 0.01;
    }
    if (sp.level >= 28) weights.timewarp = 0.65 + sp.level * 0.008;
    if (sp.level >= 25) weights.voidrift = (weights.voidrift || 0.55) + sp.level * 0.002;
    if ((tsr.lifetimeStats?.affixKills || 0) >= 3) weights.affixforge = 0.75 + sp.level * 0.008;
    if ((tsr.lifetimeStats?.affixKills || 0) >= 5) weights.affixhunt = 0.65 + sp.level * 0.01;
    if ((tsr.lifetimeStats?.championClears || 0) >= 1) weights.championhall = 0.6 + sp.level * 0.008;
    if (sp.level >= 12) weights.relicaltar = 0.55 + sp.level * 0.006;
    if (sp.level >= 10) weights.bondsanctuary = 0.6 + (sp.bond || 0) * 0.008;
    if (canUseTsrSubContract()) weights.synergyshrine = 0.5 + sp.level * 0.005;
    if (sp.level >= 6) weights.fortunewheel = 0.65 + sp.level * 0.006;
    if (sp.level >= 8) weights.legendarchive = 0.6 + (tsr.codex?.rooms ? Object.keys(tsr.codex.rooms).length * 0.02 : 0);
    if (sp.level >= 7) weights.chronolibrary = 0.55 + sp.level * 0.006;
    if (sp.level >= 9) weights.starwishpool = 0.5 + (sp.bond || 0) * 0.007;
    if (sp.level >= 11) weights.mirrormaze = 0.48 + sp.level * 0.005;
    if ((tsr.lifetimeStats?.affixKills || 0) >= 4) weights.runescriptorium = 0.52 + sp.level * 0.006;
    if ((tsr.totalRuns || 0) >= 8) weights.timeloom = 0.45 + sp.level * 0.004;
    if ((tsr.currentRun?.battleWinStreak || 0) >= 2) weights.combostorm = 0.5 + sp.level * 0.005;
    if ((tsr.lifetimeStats?.affixKills || 0) >= 2) weights.battlerift = 0.55 + sp.level * 0.006;
    if (sp.level >= 10) weights.wararchive = 0.48 + sp.level * 0.005;
    if (sp.level >= 14 && (tsr.lifetimeStats?.affixKills || 0) >= 4) weights.bloodarena = 0.42 + sp.level * 0.004;
    if (getTsrDifficultyTier() >= 8) weights.doomclock = 0.55 + sp.level * 0.006;
    if (getTsrDifficultyTier() >= 9) {
        weights.voidecho = 0.5 + sp.level * 0.005;
        weights.cataclysmgate = 0.45 + sp.level * 0.004;
    }
    if ((tsr.totalRuns || 0) >= 12) weights.elementaltrial = 0.48 + sp.level * 0.005;
    if ((tsr.lifetimeStats?.affixKills || 0) >= 6) weights.necronomicon = 0.42 + sp.level * 0.004;
    if ((tsr.currentRun?.battleWinStreak || 0) >= 3) weights.stormnexus = 0.46 + sp.level * 0.004;
    if (sp.level >= 8) weights.paradoxgate = 0.4 + sp.level * 0.004;
    if (sp.level >= 6) weights.chromaticshrine = 0.52 + sp.level * 0.005;
    return weights;
}

function pickTsrSpecialRoom() {
    const weights = buildTsrCoreSpecialRoomWeights();
    const total = Object.values(weights).reduce((s, w) => s + w, 0);
    let roll = Math.random() * total;
    for (const [key, w] of Object.entries(weights)) {
        roll -= w;
        if (roll <= 0) return key;
    }
    return TSR_SPECIAL_ROOM_TYPES[0];
}
pickTsrSpecialRoom.__tsrCoreImpl = true;

function getTsrMonsterTierRank(tier) {
    const idx = TSR_MONSTER_TIER_ORDER.indexOf(tier || 'common');
    return idx >= 0 ? idx : 0;
}

function getTsrMonsterTierMeta(tier) {
    return TSR_MONSTER_TIER_META[tier || 'common'] || TSR_MONSTER_TIER_META.common;
}

function formatTsrMonsterNameHtml(monster, opts) {
    if (!monster) return '';
    opts = opts || {};
    const tier = monster.tier || 'common';
    const meta = getTsrMonsterTierMeta(tier);
    const title = opts.showTier !== false ? meta.label : '';
    const icon = monster.icon || '👾';
    const name = monster.displayName || monster.name || '未知怪物';
    const prefixCls = monster.titlePrefix ? ' tsr-mon-has-prefix' : '';
    return `<span class="tsr-mon-name ${meta.cssClass}${prefixCls}" title="${title}">${icon} ${name}</span>`;
}

function formatTsrMonsterNamePlain(monster) {
    if (!monster) return '';
    const tier = getTsrMonsterTierMeta(monster.tier).label;
    const affix = formatTsrMonsterAffixPlain(monster);
    const traits = typeof formatTsrMonsterTraitsPlain === 'function' ? formatTsrMonsterTraitsPlain(monster) : '';
    const affixPart = affix ? `〈${affix}〉` : '';
    const traitPart = traits ? `【${traits}】` : '';
    const displayName = monster.displayName || monster.name || '未知怪物';
    return `${monster.icon || '👾'} [${tier}] ${displayName}${affixPart}${traitPart}`;
}

function pickTsrMonsterFromPool(pool, floor, dm) {
    const f = floor || player.timeSecretRealm?.currentRun?.currentFloor || 1;
    const d = dm || player.timeSecretRealm?.currentRun?.difficultyMultiplier || 1;
    const affix = getTsrActiveAffix();
    const weeklyRare = player.timeSecretRealm?.currentRun?.weeklyBonus?.rareMonsterMult || 1;
    const rareMult = (affix?.rareMonsterMult || 1) * weeklyRare;
    const diffTier = getTsrDifficultyTier();
    const tierBoost = diffTier >= 8 ? 1.85 : (diffTier >= 7 ? 1.45 : 1);
    const weights = pool.map(m => {
        const tier = m.tier || 'common';
        let w = TSR_MONSTER_TIER_WEIGHT[tier] || 5;
        const floorBonus = Math.max(1, 1 + (f - 1) * 0.035);
        if (tier === 'legendary' || tier === 'mythic') w *= floorBonus * Math.min(2.2, d * 0.45) * rareMult * tierBoost;
        else if (tier === 'epic' || tier === 'rare') w *= Math.sqrt(floorBonus) * Math.min(1.6, rareMult) * (diffTier >= 7 ? 1.2 : 1);
        return w;
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
        roll -= weights[i];
        if (roll <= 0) return Object.assign({}, pool[i]);
    }
    return Object.assign({}, pool[pool.length - 1]);
}

function pickTsrMonster(isBoss, isElite, floor, dm) {
    const poolKey = isBoss ? 'boss' : (isElite ? 'elite' : 'battle');
    return pickTsrMonsterFromPool(TSR_MONSTER_POOL[poolKey], floor, dm);
}

function pickTsrMonsterMinTier(isBoss, isElite, minTier, floor, dm) {
    const poolKey = isBoss ? 'boss' : (isElite ? 'elite' : 'battle');
    const minRank = getTsrMonsterTierRank(minTier);
    const filtered = TSR_MONSTER_POOL[poolKey].filter(m => getTsrMonsterTierRank(m.tier) >= minRank);
    if (!filtered.length) return pickTsrMonster(isBoss, isElite, floor, dm);
    return pickTsrMonsterFromPool(filtered, floor, dm);
}

function getTsrMonsterById(id) {
    for (const key of ['boss', 'elite', 'battle']) {
        const found = TSR_MONSTER_POOL[key].find(m => m.id === id);
        if (found) return Object.assign({}, found);
    }
    return null;
}

function getTsrMonsterAffixDef(key) {
    return TSR_MONSTER_AFFIXES[key] || null;
}

function getTsrMonsterAffixList(monster) {
    if (!monster?.affixKeys?.length) return [];
    return monster.affixKeys.map(k => TSR_MONSTER_AFFIXES[k]).filter(Boolean);
}

function areTsrMonsterAffixesIncompatible(a, b) {
    return TSR_MONSTER_AFFIX_INCOMPAT.some(pair => (pair[0] === a && pair[1] === b) || (pair[0] === b && pair[1] === a));
}

function getTsrMonsterAffixRollCount(isBoss, isElite, floor) {
    const tsr = player.timeSecretRealm;
    const diffTier = getTsrDifficultyTier();
    const boost = (tsr?.currentRun?.affixRollBoost || 0) + (getTsrActiveAffix()?.affixRollBoost || 0);
    const f = floor || tsr?.currentRun?.currentFloor || 1;
    let count = 0;
    if (isBoss) {
        if (f >= 22 && Math.random() < 0.42 + boost * 0.12) count = 3;
        else if (f >= 14 && Math.random() < 0.58 + boost * 0.14) count = 2;
        else count = 1;
    } else if (isElite) {
        if (Math.random() < 0.28 + diffTier * 0.04 + boost * 0.14) count = 2;
        else count = Math.random() < 0.8 + boost * 0.1 ? 1 : 0;
    } else {
        const chance = 0.22 + f * 0.008 + diffTier * 0.03 + boost * 0.18;
        if (Math.random() < chance) {
            count = (diffTier >= 8 && f >= 12 && Math.random() < 0.12 + boost * 0.06) ? 2 : 1;
        }
    }
    if (tsr?.currentRun?.nextBattleExtraAffix) {
        count = Math.min(2, Math.max(count, 1) + 1);
        tsr.currentRun.nextBattleExtraAffix = false;
    }
    return count;
}

function rollTsrMonsterAffixKeys(monster, isBoss, isElite, floor) {
    const target = getTsrMonsterAffixRollCount(isBoss, isElite, floor);
    if (target <= 0) return [];
    const monsterId = monster?.id;
    const tierRank = getTsrMonsterTierRank(monster?.tier);
    const diffTier = getTsrDifficultyTier();
    const keys = [];
    if (monsterId === 'celestialtyrant') keys.push('tyrantCrown');
    else if (monsterId === 'stararchon' && Math.random() < 0.68) keys.push('starCrown');
    else if (monsterId === 'spiritemperor') keys.push('emperorEdict');
    else if (monsterId === 'voidsentinel' && Math.random() < 0.42) keys.push('voidTouch');
    const pool = Object.keys(TSR_MONSTER_AFFIXES).filter(k => {
        if (keys.includes(k)) return false;
        const ax = TSR_MONSTER_AFFIXES[k];
        if (ax.exclusiveMonster && ax.exclusiveMonster !== monsterId) return false;
        if (ax.minTier && tierRank < getTsrMonsterTierRank(ax.minTier)) return false;
        if (ax.eliteOnly && !isElite && !isBoss) return false;
        if (ax.bossOnly && !isBoss) return false;
        if (ax.minDiffTier != null && diffTier < ax.minDiffTier) return false;
        return (ax.weight || 0) > 0;
    });
    const weights = pool.map(k => {
        let w = TSR_MONSTER_AFFIXES[k].weight || 1;
        if (isBoss && (k === 'apocalypseMark' || k === 'enrage' || k === 'fury')) w *= 1.35;
        if (isElite && k === 'bounty') w *= 2.2;
        if (tierRank >= getTsrMonsterTierRank('legendary')) w *= 1.15;
        if (diffTier >= 8) w *= 1.1;
        return w;
    });
    let guard = 0;
    while (keys.length < target && pool.length && guard++ < 40) {
        const total = weights.reduce((a, b) => a + b, 0);
        if (total <= 0) break;
        let roll = Math.random() * total;
        let pickIdx = pool.length - 1;
        for (let i = 0; i < pool.length; i++) {
            roll -= weights[i];
            if (roll <= 0) { pickIdx = i; break; }
        }
        const pick = pool[pickIdx];
        if (!keys.some(k => areTsrMonsterAffixesIncompatible(k, pick))) {
            keys.push(pick);
        }
        pool.splice(pickIdx, 1);
        weights.splice(pickIdx, 1);
    }
    return keys.slice(0, isBoss ? 3 : 2);
}

function assignTsrMonsterAffixes(monster, isBoss, isElite, floor) {
    if (!monster) return monster;
    if (!monster.affixKeys || !monster.affixKeys.length) {
        monster.affixKeys = rollTsrMonsterAffixKeys(monster, isBoss, isElite, floor);
    }
    return monster;
}

function ensureTsrMonsterAffixes(monster, opts) {
    opts = opts || {};
    if (!monster) return monster;
    assignTsrMonsterAffixes(monster, !!opts.isBoss, !!opts.isElite, opts.floor || player.timeSecretRealm?.currentRun?.currentFloor || 1);
    if (typeof applyTsrMonsterTitlePrefix === 'function') applyTsrMonsterTitlePrefix(monster, !!opts.isBoss, !!opts.isElite);
    if (typeof rollTsrMonsterCombatTraits === 'function') rollTsrMonsterCombatTraits(monster, !!opts.isBoss, !!opts.isElite, opts.floor || 1);
    return monster;
}

function applyTsrMonsterAffixToStats(stats, monster) {
    if (!stats || !monster) return stats;
    const affixes = getTsrMonsterAffixList(monster);
    let hpMult = 1;
    let atkMult = 1;
    affixes.forEach(ax => {
        hpMult += ax.hpMult || 0;
        atkMult += ax.atkMult || 0;
    });
    let out = {
        ...stats,
        hp: Math.max(1, Math.floor(stats.hp * hpMult)),
        atk: Math.max(1, Math.floor(stats.atk * atkMult))
    };
    if (typeof applyTsrMonsterTraitsToStats === 'function') out = applyTsrMonsterTraitsToStats(out, monster);
    return out;
}

function getTsrMonsterAffixRewardMult(monster) {
    const keys = monster?.affixKeys || [];
    if (!keys.length) return 0;
    let mult = getTsrMonsterAffixList(monster).reduce((sum, ax) => sum + (ax.rewardMult || 0), 0);
    const tsr = player.timeSecretRealm;
    mult += getTsrRelicBonus('affixReward');
    mult += tsr?.currentRun?.affixRewardBonus || 0;
    mult += getTsrSpiritSkillBonuses().affixReward || 0;
    mult += tsr?.permanentBonuses?.affixTome || 0;
    mult += tsr?.currentRun?.contractMods?.affixReward || 0;
    const floorAffix = getTsrActiveAffix();
    if (floorAffix?.affixReward) mult += floorAffix.affixReward;
    return mult;
}

function getTsrMonsterAffixCounterReduce(monster) {
    if (!(monster?.affixKeys || []).length) return 0;
    return getTsrRelicBonus('affixCounterReduce') + (getTsrSpiritSkillBonuses().affixCounterReduce || 0);
}

function getTsrAffixAttackBonus(monster) {
    if (!(monster?.affixKeys || []).length) return 0;
    return getTsrSpiritSkillBonuses().affixAttack || 0;
}

function getTsrAffixSpiritStrikeMult(monster) {
    if (!(monster?.affixKeys || []).length) return 1;
    return 1 + (getTsrSpiritSkillBonuses().affixSpiritStrike || 0);
}

function getTsrMonsterAffixThornPct(monster) {
    return getTsrMonsterAffixList(monster).reduce((sum, ax) => sum + (ax.thornPct || 0), 0);
}

function rerollTsrMonsterAffixes(monster, isBoss, isElite, floor, minCount) {
    if (!monster) return monster;
    monster.affixKeys = [];
    let guard = 0;
    while ((monster.affixKeys.length < (minCount || 1)) && guard++ < 6) {
        monster.affixKeys = rollTsrMonsterAffixKeys(monster, isBoss, isElite, floor);
    }
    return monster;
}

function stripTsrMonsterAffix(monster) {
    if (!monster?.affixKeys?.length) return null;
    const idx = Math.floor(Math.random() * monster.affixKeys.length);
    const removed = monster.affixKeys.splice(idx, 1)[0];
    return getTsrMonsterAffixDef(removed);
}

function getTsrMonsterAffixStartShield(monster) {
    let shield = 0;
    getTsrMonsterAffixList(monster).forEach(ax => {
        if (ax.startShield) shield = Math.max(shield, ax.startShield);
    });
    return shield;
}

function getTsrMonsterAffixCounterMult(monster, rounds, monsterHp, monsterMaxHp) {
    let bonus = 0;
    getTsrMonsterAffixList(monster).forEach(ax => {
        bonus += ax.counterMult || 0;
        if (ax.firstCounterBonus && rounds === 1) bonus += ax.firstCounterBonus;
        if (ax.lowHpThreshold && monsterMaxHp > 0 && monsterHp <= monsterMaxHp * ax.lowHpThreshold) {
            bonus += ax.lowHpCounterMult || 0;
        }
        if (ax.firstCounterBonus && rounds <= (ax.firstCounterRounds || 1)) bonus += ax.firstCounterBonus;
        if (ax.playerLowHpThreshold) {
            const tsr = player.timeSecretRealm;
            const maxHp = calculateTsrPlayerHealth();
            const cur = tsr?.currentRun?.playerHealth;
            if (maxHp && cur && cmpBigSci(cur, bMul(maxHp, ax.playerLowHpThreshold)) <= 0) {
                bonus += ax.playerLowHpCounter || 0;
            }
        }
        if (ax.momentumCounterPerRound) {
            bonus += Math.min(ax.momentumCounterCap || 0.24, Math.max(0, rounds - 1) * ax.momentumCounterPerRound);
        }
    });
    return bonus;
}

function applyTsrMonsterAffixRound(monster, rounds, monsterHp, monsterMaxHp) {
    const tsr = player.timeSecretRealm;
    let hp = monsterHp;
    getTsrMonsterAffixList(monster).forEach(ax => {
        if (ax.regenEvery && rounds % ax.regenEvery === 0 && hp > 0) {
            const heal = Math.floor(monsterMaxHp * (ax.regenPct || 0.04));
            hp += heal;
            addTsrLog(`【${ax.icon}${ax.name}】回复${formatTsrCombatNum(heal)}生命`, 'warning');
        }
        if (ax.timeDrainEvery && rounds % ax.timeDrainEvery === 0) {
            const drain = ax.timeDrain || 3;
            tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - drain);
            addTsrLog(`【${ax.icon}${ax.name}】窃取${drain}秒`, 'warning');
        }
        if (ax.spiritDrainEvery && rounds % ax.spiritDrainEvery === 0) {
            const pct = ax.spiritDrainPct || 0.1;
            const drain = Math.max(4, Math.floor((tsr.currentRun.spiritCharge || 0) * pct));
            tsr.currentRun.spiritCharge = Math.max(0, (tsr.currentRun.spiritCharge || 0) - drain);
            addTsrLog(`【${ax.icon}${ax.name}】噬灵-${drain}%`, 'warning');
        }
        if (ax.curseEvery && rounds % ax.curseEvery === 0) {
            addTempBuff({ name: ax.name + '诅咒', effect: 'attack', value: -(ax.curseValue || 0.1), duration: ax.curseDuration || 3, isDebuff: true });
            addTsrLog(`【${ax.icon}${ax.name}】攻击-${Math.floor((ax.curseValue || 0.1) * 100)}%×${ax.curseDuration || 3}`, 'warning');
        }
        if (ax.voidEvery && rounds % ax.voidEvery === 0) {
            applyDamage(bMul(tsr.currentRun.playerHealth, ax.voidDmgPct || 0.06));
            addTsrLog(`【${ax.icon}${ax.name}】虚空侵蚀${Math.floor((ax.voidDmgPct || 0.06) * 100)}%生命`, 'error');
        }
        if (ax.bondEvery && rounds % ax.bondEvery === 0) {
            const sp = ensureTsrSpiritPet();
            const loss = ax.bondLoss || 2;
            sp.bond = Math.max(0, (sp.bond || 0) - loss);
            invalidateTsrUiCache('spirit');
            addTsrLog(`【${ax.icon}${ax.name}】亲密度-${loss}`, 'warning');
        }
        if (ax.shieldEvery && rounds % ax.shieldEvery === 0) {
            tsr.currentRun.monsterShield = Math.min(0.5, (tsr.currentRun.monsterShield || 0) + (ax.shieldPulse || 0.05));
            addTsrLog(`【${ax.icon}${ax.name}】展开护盾！伤害-${Math.floor((tsr.currentRun.monsterShield) * 100)}%`, 'warning');
        }
        if (ax.bloodPactEvery && rounds % ax.bloodPactEvery === 0 && hp > 0) {
            const heal = Math.floor(monsterMaxHp * (ax.bloodPactRegen || 0.04));
            hp += heal;
            applyDamage(bMul(tsr.currentRun.playerHealth, ax.bloodPactDmg || 0.03));
            addTsrLog(`【${ax.icon}${ax.name}】血契联结！怪物回复${formatTsrCombatNum(heal)}，你受到${Math.floor((ax.bloodPactDmg || 0.03) * 100)}%伤害`, 'warning');
        }
        if (ax.frostEvery && rounds % ax.frostEvery === 0) {
            const drain = ax.frostDrain || 2;
            tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - drain);
            addTsrLog(`【${ax.icon}${ax.name}】霜噬！-${drain}秒`, 'warning');
        }
        if (ax.overloadEvery && rounds % ax.overloadEvery === 0) {
            applyDamage(bMul(tsr.currentRun.playerHealth, ax.overloadDmg || 0.06));
            addTsrLog(`【${ax.icon}${ax.name}】过载冲击${Math.floor((ax.overloadDmg || 0.06) * 100)}%生命`, 'error');
        }
        if (ax.echoEvery && rounds % ax.echoEvery === 0) {
            applyDamage(bMul(tsr.currentRun.playerHealth, ax.echoDmgPct || 0.05));
            addTsrLog(`【${ax.icon}${ax.name}】回响打击${Math.floor((ax.echoDmgPct || 0.05) * 100)}%生命`, 'error');
        }
        if (ax.phaseWalkEvery && rounds % ax.phaseWalkEvery === 0) {
            tsr.currentRun.monsterDodgeNext = true;
            addTsrLog(`【${ax.icon}${ax.name}】进入相位，下回合闪避攻击`, 'warning');
        }
        if (ax.coinStealEvery && rounds % ax.coinStealEvery === 0) {
            const steal = Math.min(tsr.currentRun.currencyEarned || 0, ax.coinSteal || 15);
            if (steal > 0) {
                tsr.currentRun.currencyEarned -= steal;
                addTsrLog(`【${ax.icon}${ax.name}】吸走${steal}秘境币`, 'warning');
            }
        }
    });
    hp = typeof applyTsrMonsterTraitRound === 'function'
        ? applyTsrMonsterTraitRound(monster, rounds, hp, monsterMaxHp)
        : hp;
    return Math.max(0, hp);
}

function formatTsrMonsterAffixHtml(monster) {
    const affixes = getTsrMonsterAffixList(monster);
    if (!affixes.length) return '';
    return `<span class="tsr-monster-affixes">${affixes.map(ax =>
        `<span class="tsr-monster-affix-tag" title="${ax.desc}">${ax.icon}${ax.name}</span>`
    ).join('')}</span>`;
}

function formatTsrMonsterAffixPlain(monster) {
    const affixes = getTsrMonsterAffixList(monster);
    if (!affixes.length) return '';
    return affixes.map(ax => ax.icon + ax.name).join('·');
}

function recordTsrMonsterAffixCodex(affixKeys) {
    if (isTsrTutorialRun()) return;
    const tsr = player.timeSecretRealm;
    if (!tsr.codex) tsr.codex = { rooms: {}, relics: {}, elites: 0, gambles: 0 };
    if (!tsr.codex.monsterAffixes) tsr.codex.monsterAffixes = {};
    (affixKeys || []).forEach(k => {
        tsr.codex.monsterAffixes[k] = (tsr.codex.monsterAffixes[k] || 0) + 1;
    });
    invalidateTsrUiCache('codex');
}

function onTsrMonsterAffixVictory(monster) {
    const keys = monster?.affixKeys || [];
    if (!keys.length) return;
    const tsr = player.timeSecretRealm;
    // 教学局仅记本局标记，不写永久 lifetime / 图鉴 / 任务
    if (isTsrTutorialRun()) {
        tsr.currentRun.affixKillsThisRun = (tsr.currentRun.affixKillsThisRun || 0) + 1;
        if (keys.length >= 2) {
            if (monster?.tier === 'mythic' || monster?.tier === 'legendary' || (tsr.currentRun.currentRoom?.isBoss || tsr.currentRun.currentRoom?.isElite)) {
                tsr.currentRun.dualAffixKillThisRun = true;
            }
        }
        return;
    }
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.affixKills = (tsr.lifetimeStats.affixKills || 0) + 1;
    tsr.currentRun.affixKillsThisRun = (tsr.currentRun.affixKillsThisRun || 0) + 1;
    bumpTsrQuestProgress('runAffixKills', 1);
    bumpTsrQuestProgress('weeklyAffixKills', 1);
    bumpTsrEngagement('dailyAffixKills', 1);
    if (keys.length >= 2) {
        tsr.lifetimeStats.dualAffixKills = (tsr.lifetimeStats.dualAffixKills || 0) + 1;
        if (monster?.tier === 'mythic' || monster?.tier === 'legendary' || (tsr.currentRun.currentRoom?.isBoss || tsr.currentRun.currentRoom?.isElite)) {
            tsr.currentRun.dualAffixKillThisRun = true;
        }
    }
    recordTsrMonsterAffixCodex(keys);
    checkTsrAchievements();
}

/** 战斗胜利钩子（不论是否带词条） */
function onTsrMonsterBattleVictory(monster) {}

function hasTsrStarSpiritBuild() {
    const sp = ensureTsrSpiritPet();
    if (!sp || (sp.evolution || 0) < getTsrSpiritMaxEvolution()) return false;
    const skills = sp.skills || [];
    return skills.includes('starOrigin') || skills.includes('starDominion');
}

function pickTsrBossMonster(floor, dm) {
    const diffTier = getTsrDifficultyTier();
    const sp = ensureTsrSpiritPet();
    const evo4 = (sp?.evolution || 0) >= getTsrSpiritMaxEvolution();
    if (evo4 && floor >= 15) {
        const roll = Math.random();
        if (diffTier >= 8 && roll < 0.28) {
            const archon = getTsrMonsterById('stararchon');
            if (archon) return archon;
        }
        if (diffTier >= 8 && roll < 0.38) {
            const tyrant = getTsrMonsterById('celestialtyrant');
            if (tyrant && (player.timeSecretRealm?.lifetimeStats?.throneClears || 0) >= 1) return tyrant;
        }
        if (diffTier >= 7 && hasTsrStarSpiritBuild() && roll < 0.22) {
            return getTsrMonsterById('stararchon') || getTsrMonsterById('spiritemperor')
                || pickTsrMonsterMinTier(true, false, 'mythic', floor, dm);
        }
        if (roll < 0.12) {
            const emperor = getTsrMonsterById('spiritemperor');
            if (emperor) return emperor;
        }
    }
    return pickTsrMonster(true, false, floor, dm);
}

function getTsrPermanentStarSpiritStrike() {
    return Number(player.timeSecretRealm?.permanentBonuses?.starSpiritStrike || 0);
}

function getTsrPermanentStarDomainSigil() {
    return Number(player.timeSecretRealm?.permanentBonuses?.starDomainSigil || 0);
}

function getTsrPermanentArchonFragment() {
    return Number(player.timeSecretRealm?.permanentBonuses?.archonFragment || 0);
}

function updateTsrMonsterBanner(monster, stats, isBoss, isElite) {
    const banner = document.getElementById('tsrMonsterBanner');
    if (!banner || !monster) return;
    const tierMeta = getTsrMonsterTierMeta(monster.tier);
    const role = isBoss ? '首领' : (isElite ? '精英' : '遭遇');
    const hp = stats?.hp || 0;
    const icon = monster.icon || '👾';
    banner.style.display = 'block';
    banner.className = `tsr-monster-banner tsr-monster-banner-${monster.tier || 'common'}${isBoss ? ' is-boss' : ''}${isElite ? ' is-elite' : ''}`;
    banner.innerHTML = `
        <div class="tsr-duel-stage">
            <div class="tsr-duel-top">
                <div class="tsr-duel-who me">
                    <span class="tsr-duel-avatar me-avatar">🗡️</span>
                    <div class="tsr-duel-who-meta">
                        <span class="tsr-duel-name">你</span>
                        <div class="tsr-duel-mini-hp">
                            <div id="tsrFeelPlayerHpChip" class="tsr-duel-mini-chip" style="width:100%"></div>
                            <div id="tsrFeelPlayerHpBar" class="tsr-duel-mini-fill me" style="width:100%"></div>
                        </div>
                        <span id="tsrFeelPlayerHpText" class="tsr-duel-hp-text">生命就绪</span>
                    </div>
                </div>
                <div class="tsr-duel-vs">
                    <button type="button" id="tsrFeelRoundText" class="tsr-feel-round tsr-feel-round-btn" onclick="tsrKickBattleFeel()" title="点击开战">准备开战</button>
                    <button type="button" id="tsrBattleSkipBtn" class="tsr-battle-skip" onclick="skipTsrBattleFeel()" title="跳过演出">跳过</button>
                </div>
                <div class="tsr-duel-who foe">
                    <div class="tsr-duel-who-meta">
                        <span class="tsr-duel-name">${formatTsrMonsterNameHtml(monster)}</span>
                        <div class="tsr-duel-mini-hp">
                            <div id="tsrFeelMonsterMiniChip" class="tsr-duel-mini-chip foe" style="width:100%"></div>
                            <div id="tsrFeelMonsterMiniBar" class="tsr-duel-mini-fill foe" style="width:100%"></div>
                        </div>
                        <span id="tsrMonsterHpText" class="tsr-duel-hp-text">❤️ ${formatTsrCombatNum(hp)}</span>
                    </div>
                    <span class="tsr-duel-avatar foe-avatar">${icon}</span>
                </div>
            </div>
            <div class="tsr-monster-banner-left">
                <span class="tsr-monster-role">${role}</span>
                ${formatTsrMonsterAffixHtml(monster)}
                ${typeof formatTsrMonsterTraitsHtml === 'function' ? formatTsrMonsterTraitsHtml(monster) : ''}
                <span class="tsr-monster-tier-badge ${tierMeta.cssClass}">${tierMeta.label}</span>
                <span>⚔️ ${formatTsrCombatNum(stats?.atk || 0)}</span>
            </div>
            <div class="tsr-monster-hp-wrap">
                <div class="tsr-monster-hp-chip" id="tsrMonsterHpChip" style="width:100%"></div>
                <div class="tsr-monster-hp-bar" id="tsrMonsterHpBar" style="width:100%"></div>
            </div>
            <div class="tsr-fury-wrap" title="怒气">
                <span class="tsr-fury-label">怒</span>
                <div class="tsr-fury-track"><div id="tsrFeelFuryBar" class="tsr-fury-fill" style="width:0%"></div></div>
            </div>
            <div id="tsrCombatCue" class="tsr-combat-cue" style="display:none;"></div>
            <div id="tsrCombatFxLayer" class="tsr-combat-fx-layer" aria-hidden="true"></div>
        </div>`;
}

function refreshTsrMonsterHpBar(cur, max) {
    const bar = document.getElementById('tsrMonsterHpBar');
    const mini = document.getElementById('tsrFeelMonsterMiniBar');
    const chip = document.getElementById('tsrMonsterHpChip');
    const miniChip = document.getElementById('tsrFeelMonsterMiniChip');
    const text = document.getElementById('tsrMonsterHpText');
    const maxN = Number(max) || 0;
    const curN = Math.max(0, Number(cur) || 0);
    const pct = maxN > 0 ? Math.max(0, Math.min(100, (curN / maxN) * 100)) : 0;
    if (bar) bar.style.width = pct + '%';
    if (mini) mini.style.width = pct + '%';
    if (text) text.textContent = `❤️ ${formatTsrCombatNum(curN)} / ${formatTsrCombatNum(maxN)}`;
    // 残影条滞后收：实血先掉，chip 后跟
    const run = player.timeSecretRealm?.currentRun;
    const applyChip = () => {
        if (chip) chip.style.width = pct + '%';
        if (miniChip) miniChip.style.width = pct + '%';
    };
    if (run?.battleInProgress && !run.battleFeelSkip) {
        clearTimeout(window._tsrMonsterHpChipTimer);
        window._tsrMonsterHpChipTimer = setTimeout(applyChip, 260);
    } else {
        applyChip();
    }
}

function refreshTsrFeelPlayerHp(hp, maxHp) {
    const bar = document.getElementById('tsrFeelPlayerHpBar');
    const chip = document.getElementById('tsrFeelPlayerHpChip');
    const text = document.getElementById('tsrFeelPlayerHpText');
    const mainFill = document.getElementById('tsrHealthBarFill');
    const mainText = document.getElementById('tsrHealthText');
    const pct = typeof getTsrHealthPercent === 'function'
        ? getTsrHealthPercent(hp, maxHp)
        : 100;
    const clamped = Math.max(0, Math.min(100, pct));
    if (bar) bar.style.width = clamped + '%';
    if (text) text.textContent = `${pct.toFixed(0)}% · ${formatTsrCombatNum(hp)}`;
    if (mainFill) {
        mainFill.style.width = `${pct}%`;
        if (pct <= 30) mainFill.style.background = 'linear-gradient(to right, #ff4500, #8b0000)';
        else if (pct <= 50) mainFill.style.background = 'linear-gradient(to right, #ffa500, #ff4500)';
        else mainFill.style.background = 'linear-gradient(to right, #32cd32, #ffa500)';
    }
    if (mainText) {
        mainText.textContent = `${pct.toFixed(1)}% (${formatTsrCombatNum(hp)}/${formatTsrCombatNum(maxHp)})`;
    }
    const warn = document.getElementById('tsrHealthWarning');
    if (warn) warn.style.display = pct <= 30 ? 'inline' : 'none';
    const run = player.timeSecretRealm?.currentRun;
    const applyChip = () => { if (chip) chip.style.width = clamped + '%'; };
    if (run?.battleInProgress && !run.battleFeelSkip) {
        clearTimeout(window._tsrPlayerHpChipTimer);
        window._tsrPlayerHpChipTimer = setTimeout(applyChip, 280);
    } else {
        applyChip();
    }
}

function refreshTsrFeelFury(pct) {
    const bar = document.getElementById('tsrFeelFuryBar');
    if (bar) bar.style.width = Math.max(0, Math.min(100, Number(pct) || 0)) + '%';
}

function setTsrFeelRound(text) {
    const el = document.getElementById('tsrFeelRoundText');
    if (!el) return;
    el.textContent = text || '';
    el.classList.remove('tsr-round-pop');
    void el.offsetWidth;
    el.classList.add('tsr-round-pop');
}

function showTsrCombatCue(text, kind) {
    const cue = document.getElementById('tsrCombatCue');
    if (!cue || !text) return;
    cue.style.display = 'block';
    cue.className = 'tsr-combat-cue' + (kind ? ' ' + kind : '');
    cue.textContent = text;
    cue.classList.remove('pop');
    void cue.offsetWidth;
    cue.classList.add('pop');
}

function hideTsrCombatCue() {
    const cue = document.getElementById('tsrCombatCue');
    if (cue) {
        cue.style.display = 'none';
        cue.textContent = '';
    }
}

function pushTsrFeelEvent(evt) {
    const run = player.timeSecretRealm?.currentRun;
    if (!run || !evt) return;
    if (!run.pendingFeelEvents) run.pendingFeelEvents = [];
    run.pendingFeelEvents.push(evt);
}

function tsrCombatDelay(ms) {
    const run = player.timeSecretRealm?.currentRun;
    if (run?.battleFeelSkip) return Promise.resolve();
    return new Promise(resolve => {
        let settled = false;
        const done = () => {
            if (settled) return;
            settled = true;
            resolve();
        };
        const t = setTimeout(done, Math.max(0, Number(ms) || 0));
        if (run) {
            run._battleFeelTimers = run._battleFeelTimers || [];
            run._battleFeelTimers.push(t);
            run._battleFeelResolvers = run._battleFeelResolvers || [];
            run._battleFeelResolvers.push(done);
        }
    });
}

function flushTsrBattleFeelResolvers(run) {
    const target = run || player.timeSecretRealm?.currentRun;
    if (!target) return;
    const list = (target._battleFeelResolvers || []).splice(0);
    list.forEach(fn => {
        try { if (typeof fn === 'function') fn(); } catch (e) { /* ignore */ }
    });
}

function clearTsrBattleFeelTimers(run) {
    const target = run || player.timeSecretRealm?.currentRun;
    if (!target) return;
    (target._battleFeelTimers || []).forEach(t => clearTimeout(t));
    target._battleFeelTimers = [];
    // 必须一并 resolve 挂起的 delay Promise，否则 skip/清计时器后演出永远 await 卡住
    flushTsrBattleFeelResolvers(target);
}

function trackTsrBattleFeelTimer(timerId) {
    const run = player.timeSecretRealm?.currentRun;
    if (!run || timerId == null) return timerId;
    run._battleFeelTimers = run._battleFeelTimers || [];
    run._battleFeelTimers.push(timerId);
    return timerId;
}

function skipTsrBattleFeel(force) {
    const run = player.timeSecretRealm?.currentRun;
    if (!run) return;
    if (!force && !run.battleInProgress) return;
    run.battleFeelSkip = true;
    // 先解挂过场/结算卡/急救弹层，再清计时器并刷掉 delay Promise
    if (typeof resolveTsrFeelModals === 'function') {
        try { resolveTsrFeelModals(); } catch (e) { /* ignore */ }
    }
    clearTsrBattleFeelTimers(run);
    hideTsrCombatCue();
    const cueBtn = document.getElementById('tsrBattleSkipBtn');
    if (cueBtn) cueBtn.textContent = '结算中…';
}

function spawnTsrDamageFloater(text, opts) {
    opts = opts || {};
    const layer = document.getElementById('tsrCombatFxLayer') || document.getElementById('tsrMonsterBanner');
    if (!layer) return;
    const el = document.createElement('div');
    el.className = 'tsr-dmg-floater'
        + (opts.crit ? ' crit' : '')
        + (opts.hurt ? ' hurt' : '')
        + (opts.win ? ' win' : '')
        + (opts.skill ? ' skill' : '')
        + (opts.heal ? ' heal' : '');
    el.textContent = text;
    el.style.left = (20 + Math.random() * 55) + '%';
    el.style.top = (12 + Math.random() * 42) + '%';
    layer.appendChild(el);
    trackTsrBattleFeelTimer(setTimeout(() => el.remove(), 1100));
}

function flashTsrCombatHit(opts) {
    opts = opts || {};
    const banner = document.getElementById('tsrMonsterBanner');
    const panel = document.getElementById('tsrAdventurePanel');
    const stage = banner?.querySelector('.tsr-duel-stage');
    const me = banner?.querySelector('.tsr-duel-avatar.me-avatar') || banner?.querySelector('.tsr-duel-who.me .tsr-duel-avatar');
    const foe = banner?.querySelector('.tsr-duel-avatar.foe-avatar');
    if (banner) {
        banner.classList.remove('tsr-hit-shake', 'tsr-hit-crit', 'tsr-hit-hurt', 'tsr-hit-skill', 'tsr-hit-finisher', 'tsr-cam-zoom');
        void banner.offsetWidth;
        banner.classList.add(opts.crit ? 'tsr-hit-crit' : (opts.hurt ? 'tsr-hit-hurt' : (opts.skill ? 'tsr-hit-skill' : 'tsr-hit-shake')));
        if (opts.finisher || opts.crit) banner.classList.add('tsr-cam-zoom');
        if (opts.finisher) banner.classList.add('tsr-hit-finisher');
    }
    if (stage) {
        stage.classList.remove('tsr-lunge-me', 'tsr-lunge-foe', 'tsr-recoil');
        void stage.offsetWidth;
        if (opts.hurt) stage.classList.add('tsr-lunge-foe', 'tsr-recoil');
        else if (!opts.skill) stage.classList.add('tsr-lunge-me');
    }
    if (me) {
        me.classList.remove('punch');
        void me.offsetWidth;
        if (!opts.hurt) me.classList.add('punch');
    }
    if (foe) {
        foe.classList.remove('recoil', 'punch');
        void foe.offsetWidth;
        if (opts.hurt) foe.classList.add('punch');
        else foe.classList.add('recoil');
    }
    if (panel && (opts.crit || opts.hurt || opts.skill || opts.finisher)) {
        panel.classList.remove('tsr-screen-shake');
        void panel.offsetWidth;
        panel.classList.add('tsr-screen-shake');
        setTimeout(() => panel.classList.remove('tsr-screen-shake'), 320);
    }
    playTsrCombatSfx(opts.crit || opts.finisher ? 'crit' : (opts.hurt ? 'hurt' : (opts.skill ? 'skill' : 'hit')));
}

function playTsrCombatSfx(kind) {
    try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!window._tsrAudioCtx) window._tsrAudioCtx = new AC();
        const ctx = window._tsrAudioCtx;
        if (ctx.state === 'suspended') ctx.resume();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        const now = ctx.currentTime;
        const map = {
            hit: { f: 220, t: 0.06, type: 'square', v: 0.035 },
            crit: { f: 440, t: 0.11, type: 'sawtooth', v: 0.05 },
            hurt: { f: 120, t: 0.1, type: 'triangle', v: 0.045 },
            skill: { f: 520, t: 0.14, type: 'square', v: 0.04 },
            win: { f: 660, t: 0.18, type: 'sine', v: 0.05 },
            start: { f: 180, t: 0.12, type: 'sine', v: 0.03 }
        };
        const cfg = map[kind] || map.hit;
        o.type = cfg.type;
        o.frequency.setValueAtTime(cfg.f, now);
        if (kind === 'crit') o.frequency.exponentialRampToValueAtTime(cfg.f * 1.6, now + cfg.t);
        if (kind === 'win') o.frequency.exponentialRampToValueAtTime(880, now + cfg.t);
        g.gain.setValueAtTime(cfg.v, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + cfg.t);
        o.start(now);
        o.stop(now + cfg.t + 0.02);
        o.onended = () => {
            try { o.disconnect(); g.disconnect(); } catch (e2) { /* ignore */ }
        };
    } catch (e) { /* ignore audio errors */ }
}

async function presentTsrBattleFeel(hits, opts) {
    opts = opts || {};
    const run = player.timeSecretRealm?.currentRun;
    // skip 状态由 queue / skipTsrBattleFeel 管理，开演中勿强行清零
    const maxHp = opts.monsterMaxHp || 1;
    const playerMax = opts.playerMaxHp || calculateTsrPlayerHealth();
    const startHp = opts.playerHpStart != null ? opts.playerHpStart : playerMax;
    refreshTsrMonsterHpBar(maxHp, maxHp);
    refreshTsrFeelPlayerHp(startHp, playerMax);
    refreshTsrFeelFury(opts.furyStart || 0);
    setTsrFeelRound(opts.isBoss ? '首领战 · 开幕' : (opts.isElite ? '精英战 · 开幕' : '遭遇战 · 开幕'));
    showTsrCombatCue(opts.isBoss ? '⚔️ 首领降临' : (opts.isElite ? '💀 精英现身' : '⚔️ 战斗开始'), opts.isBoss ? 'boss' : (opts.isElite ? 'elite' : 'start'));
    playTsrCombatSfx('start');
    await tsrCombatDelay(opts.isBoss ? 520 : (opts.isElite ? 380 : 260));
    hideTsrCombatCue();

    for (let i = 0; i < (hits || []).length; i++) {
        if (run?.battleFeelSkip) break;
        const h = hits[i];
        setTsrFeelRound(`第 ${h.round || (i + 1)} 回合`);
        refreshTsrFeelFury(h.fury != null ? h.fury : 0);

        if (h.events && h.events.length) {
            for (const ev of h.events) {
                if (run?.battleFeelSkip) break;
                showTsrCombatCue(ev.label || ev.type, ev.type || 'skill');
                flashTsrCombatHit({ skill: true });
                spawnTsrDamageFloater(ev.label || '技能!', { skill: true });
                await tsrCombatDelay(ev.type === 'fury' || ev.type === 'phase' ? 420 : 300);
                hideTsrCombatCue();
            }
        }

        if (h.dodged) {
            showTsrCombatCue('闪避!', 'dodge');
            spawnTsrDamageFloater('MISS', { skill: true });
            await tsrCombatDelay(220);
            hideTsrCombatCue();
        }

        if ((h.playerDmg || 0) > 0) {
            refreshTsrMonsterHpBar(h.monsterHp, maxHp);
            flashTsrCombatHit({ crit: !!h.crit });
            spawnTsrDamageFloater((h.crit ? '暴击 ' : '-') + formatTsrCombatNum(h.playerDmg), { crit: !!h.crit });
            if (h.crit) showTsrCombatCue('暴击!', 'crit');
            await tsrCombatDelay(h.crit ? 300 : 200);
            if (h.crit) hideTsrCombatCue();
        } else if (!h.dodged && (h.events || []).length === 0) {
            await tsrCombatDelay(120);
        }

        if ((h.counter || 0) > 0) {
            flashTsrCombatHit({ hurt: true });
            spawnTsrDamageFloater('-' + formatTsrCombatNum(h.counter), { hurt: true });
            if (h.playerHp != null) refreshTsrFeelPlayerHp(h.playerHp, playerMax);
            else if (h.playerHpPct != null) {
                // fallback percent-only
                const approx = bMul(playerMax, (h.playerHpPct || 0) / 100);
                refreshTsrFeelPlayerHp(approx, playerMax);
            }
            await tsrCombatDelay(200);
        } else if (h.playerHp != null) {
            refreshTsrFeelPlayerHp(h.playerHp, playerMax);
        }
    }

    if (opts.victory && !run?.battleFeelSkip) {
        const banner = document.getElementById('tsrMonsterBanner');
        if (banner) banner.classList.add('tsr-victory-flash');
        showTsrCombatCue('胜利!', 'win');
        spawnTsrDamageFloater('击败!', { win: true });
        playTsrCombatSfx('win');
        setTsrFeelRound('战斗胜利');
        await tsrCombatDelay(480);
    } else if (!opts.victory) {
        showTsrCombatCue('未能击破', 'hurt');
        setTsrFeelRound('战斗受挫');
        await tsrCombatDelay(280);
    }
    hideTsrCombatCue();
    if (typeof updateHealthBar === 'function') updateHealthBar();
}

function queueTsrBattleFeel(hits, opts, done) {
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    let finished = false;
    let safetyTimer = null;
    const finish = () => {
        if (finished) return;
        finished = true;
        if (safetyTimer != null) clearTimeout(safetyTimer);
        if (run) {
            clearTsrBattleFeelTimers(run);
            run.battleInProgress = false;
            run.battleFeelSkip = false;
            run._battleFeelSafetyTimer = null;
            run._pendingBattleFeel = null;
        }
        if (typeof done === 'function') done();
        updateActionButtons();
    };
    if (!run || !hits?.length || !document.getElementById('tsrMonsterBanner')) {
        finish();
        return;
    }
    run.battleInProgress = true;
    run.battleFeelSkip = false;
    run._pendingBattleFeel = { hits, opts: opts || {}, done };
    updateActionButtons();
    // 防止演出 Promise 挂死导致下一层永久灰掉
    safetyTimer = setTimeout(() => {
        if (finished) return;
        run.battleFeelSkip = true;
        if (typeof resolveTsrFeelModals === 'function') {
            try { resolveTsrFeelModals(); } catch (e) { /* ignore */ }
        }
        clearTsrBattleFeelTimers(run);
        finish();
    }, 45000);
    run._battleFeelSafetyTimer = safetyTimer;
    // 推迟一帧再演，避免探索结算立刻刷 UI 打断开战
    const startPresent = () => {
        if (finished || !run.isActive || !run.battleInProgress) return;
        const banner = document.getElementById('tsrMonsterBanner');
        if (banner) banner.style.display = 'block';
        presentTsrBattleFeel(hits, opts).then(finish).catch(finish);
    };
    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => setTimeout(startPresent, 0));
    } else {
        setTimeout(startPresent, 0);
    }
}

/** 卡在「准备开战」时可点击续演；或解挂遗留状态 */
function tsrKickBattleFeel() {
    const run = player.timeSecretRealm?.currentRun;
    if (!run?.isActive) return;
    const pending = run._pendingBattleFeel;
    const banner = document.getElementById('tsrMonsterBanner');
    if (pending && pending.hits?.length && banner) {
        if (run.battleInProgress && !run.battleFeelSkip) {
            // 已在演但可能被错误跳过打断：解挂弹层后继续
            if (typeof resolveTsrFeelModals === 'function') {
                try { resolveTsrFeelModals(); } catch (e) { /* ignore */ }
            }
            flushTsrBattleFeelResolvers(run);
            setTsrFeelRound('遭遇战 · 交锋');
            return;
        }
        run.battleInProgress = true;
        run.battleFeelSkip = false;
        banner.style.display = 'block';
        updateActionButtons();
        const finish = () => {
            clearTsrBattleFeelTimers(run);
            run.battleInProgress = false;
            run.battleFeelSkip = false;
            run._pendingBattleFeel = null;
            if (typeof pending.done === 'function') pending.done();
            updateActionButtons();
        };
        presentTsrBattleFeel(pending.hits, pending.opts).then(finish).catch(finish);
        return;
    }
    // 无待演缓冲：若房间已探索但战斗未清，直接补开战斗
    const room = run.currentRoom;
    if (room && room.explored && !room.battleCleared && typeof isTsrCombatRoom === 'function' && isTsrCombatRoom(room)
        && typeof handleBattleRoom === 'function' && !run.battleInProgress) {
        handleBattleRoom();
        updateActionButtons();
    }
}

function hideTsrMonsterBanner(clearContent, opts) {
    opts = opts || {};
    const run = player.timeSecretRealm?.currentRun;
    // UI 刷新路径会误调 hide：演出中直接忽略（强制中止请传 opts.abort / clearContent）
    if (run?.battleInProgress && !opts.abort && !clearContent) {
        return;
    }
    // 战斗提前结束（战死等）：刷出已记入 hit 的日志 + 缓冲中未刷日志
    if (run?.deferBattleLogs) {
        const draft = run._combatHitsDraft || [];
        draft.forEach(h => {
            if (h.logs?.length) {
                flushTsrDeferredLogsNow(h.logs);
                h.logs = [];
            }
        });
        run.deferBattleLogs = false;
        flushTsrDeferredLogsNow(drainTsrDeferredLogs());
        run._combatHitsDraft = null;
    }
    const banner = document.getElementById('tsrMonsterBanner');
    if (!banner) return;
    banner.style.display = 'none';
    banner.classList.remove('tsr-hit-shake', 'tsr-hit-crit', 'tsr-hit-hurt', 'tsr-hit-skill', 'tsr-victory-flash', 'is-boss', 'is-elite');
    if (clearContent) banner.innerHTML = '';
}

function updateTsrCombatBar() {
    const bar = document.getElementById('tsrCombatBar');
    if (!bar) return;
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) {
        bar.style.display = 'none';
        return;
    }
    bar.style.display = 'flex';
    const atkEl = document.getElementById('tsrCombatAtk');
    const critEl = document.getElementById('tsrCombatCrit');
    const cdEl = document.getElementById('tsrCombatCritDmg');
    const powerEl = document.getElementById('tsrCombatPower');
    if (atkEl) atkEl.textContent = formatTsrCombatNum(calculateTsrPlayerAttack());
    if (critEl) critEl.textContent = (calculateTsrPlayerCritRate() * 100).toFixed(1) + '%';
    if (cdEl) cdEl.textContent = getTsrEffectiveCritDamage().toFixed(2) + 'x';
    if (powerEl) powerEl.textContent = Math.floor(getTsrMetaCombatPower());
    const dodgeEl = document.getElementById('tsrCombatDodge');
    const lsEl = document.getElementById('tsrCombatLifeSteal');
    const penEl = document.getElementById('tsrCombatPen');
    if (dodgeEl) dodgeEl.textContent = (calculateTsrPlayerDodgeRate() * 100).toFixed(1) + '%';
    if (lsEl) lsEl.textContent = ((getTsrEquipBonus('lifeSteal') + getTsrEquipBonus('vampiric')) * 100).toFixed(1) + '%';
    if (penEl) penEl.textContent = ((getTsrEquipBonus('pen') + getTsrEquipBonus('damageAmp')) * 100).toFixed(0) + '%';
}

function getTsrEffectiveCritDamage() {
    const raw = Number(calculateTsrPlayerCritDamage()) || TSR_CRIT_DAMAGE_FLOOR;
    if (!Number.isFinite(raw)) return TSR_CRIT_DAMAGE_FLOOR;
    return Math.min(TSR_CRIT_DAMAGE_CAP, Math.max(TSR_CRIT_DAMAGE_FLOOR, raw));
}

function getTsrMetaCombatPower() {
    const tsr = player.timeSecretRealm;
    if (!tsr) return 0;
    const spirit = ensureTsrSpiritPet();
    return (tsr.clearCount || 0) * TSR_COMBAT_META.perClear
        + (tsr.bestFloor || 0) * TSR_COMBAT_META.perBestFloor
        + (spirit.level || 1) * TSR_COMBAT_META.perSpiritLv
        + Math.sqrt(tsr.totalRuns || 0) * TSR_COMBAT_META.perTotalRuns;
}

function computeTsrRunBaseCombat() {
    const meta = getTsrMetaCombatPower();
    let attack = TSR_COMBAT_BASE.attack + meta * 3.6;
    let maxHp = TSR_COMBAT_BASE.maxHp + meta * 42;
    const ach = getTsrAchievementCombatBonuses();
    attack *= 1 + getTsrEternalAttackBonus() + ach.attack;
    maxHp *= 1 + getTsrEternalHealthBonus() + ach.health;
    const critRate = Math.min(0.42, TSR_COMBAT_BASE.critRate + meta * 0.0018);
    const critDamage = Math.min(TSR_CRIT_DAMAGE_CAP, TSR_COMBAT_BASE.critDamage + meta * 0.0035);
    return {
        attack: Math.max(1, Math.floor(attack)),
        maxHp: Math.max(1, Math.floor(maxHp)),
        critRate,
        critDamage
    };
}

function ensureTsrRunCombat() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return null;
    if (!tsr.currentRun.combat?.baseAttack) {
        initTsrRunCombat(tsr.currentRun);
    }
    return tsr.currentRun.combat;
}

function initTsrRunCombat(run) {
    const base = computeTsrRunBaseCombat();
    run.combat = {
        baseAttack: base.attack,
        baseMaxHp: base.maxHp,
        baseCritRate: base.critRate,
        baseCritDamage: base.critDamage
    };
    // 怪物平衡锚点锁定在开局基础战阶（不含后续装备/精灵增益）
    run.monsterAnchorAtk = Math.max(1, Math.floor(base.attack));
    run.monsterAnchorHp = Math.max(1, Math.floor(base.maxHp));
}

function formatTsrCombatNum(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return '0';
    if (v >= 1e6) return formatSci(v);
    return Math.floor(v).toLocaleString('zh-CN');
}

/**
 * 怪物数值锚定：只用开局基础战阶（meta 定稿的 baseAttack / baseMaxHp）。
 * 刻意排除装备、临时 buff、精灵战中加成，否则「越强怪越强」会让构筑失效。
 */
function getTsrMonsterBalanceAnchor() {
    const run = player?.timeSecretRealm?.currentRun;
    const combat = run?.isActive ? ensureTsrRunCombat() : null;
    let atk = Number(combat?.baseAttack);
    let hp = Number(combat?.baseMaxHp);
    if (!Number.isFinite(atk) || atk <= 0 || !Number.isFinite(hp) || hp <= 0) {
        const base = typeof computeTsrRunBaseCombat === 'function'
            ? computeTsrRunBaseCombat()
            : TSR_COMBAT_BASE;
        atk = Number(base.attack) || TSR_COMBAT_BASE.attack;
        hp = Number(base.maxHp) || TSR_COMBAT_BASE.maxHp;
    }
    // 写入本局快照，后续装备变化也不会回头抬怪
    if (run?.isActive) {
        if (!run.monsterAnchorAtk) run.monsterAnchorAtk = Math.max(1, Math.floor(atk));
        if (!run.monsterAnchorHp) run.monsterAnchorHp = Math.max(1, Math.floor(hp));
        atk = run.monsterAnchorAtk;
        hp = run.monsterAnchorHp;
    }
    return {
        atk: Math.max(TSR_COMBAT_BASE.attack * 0.5, atk),
        hp: Math.max(TSR_COMBAT_BASE.maxHp * 0.5, hp)
    };
}

/** 首领冲刺 / 周Boss / 时隙试炼 */
function isTsrChallengeRun(run) {
    run = run || player?.timeSecretRealm?.currentRun;
    return !!(run && (run.isBossRush || run.isWeeklyBoss || run.isTrialTower));
}

/** 挑战模式：开局无构筑，仍需软化；周Boss单独加压，冲刺/试炼略抬难度 */
function getTsrChallengeMonsterScale(run) {
    if (!run?.isActive) return { hp: 1, atk: 1 };
    // 相对旧软化：周Boss约 ×2.8，冲刺/试炼约 ×1.5
    if (run.isBossRush) return { hp: 0.62, atk: 0.52 };
    if (run.isWeeklyBoss) return { hp: 1.28, atk: 1.08 };
    if (run.isTrialTower) return { hp: 0.64, atk: 0.54 };
    return { hp: 1, atk: 1 };
}

/** 挑战波次间隙换装倒计时（秒） */
const TSR_CHALLENGE_GEAR_BREAK_SEC = 6;

/**
 * 首领冲刺 / 时隙试炼：波次间给几秒换装（暂停墙钟），可提前开战。
 * @param {Function} onContinue
 * @param {{ label?: string, wave?: number, target?: number }} [meta]
 */
function scheduleTsrChallengeGearBreak(onContinue, meta) {
    meta = meta || {};
    const run = player?.timeSecretRealm?.currentRun;
    if (!run?.isActive) return;
    if (typeof onContinue !== 'function') return;
    if (run._challengeGearBreakTimer) {
        clearTimeout(run._challengeGearBreakTimer);
        run._challengeGearBreakTimer = null;
    }
    run._challengeGearBreakActive = true;
    run._challengeGearBreakContinue = onContinue;
    if (typeof switchTsrSideTab === 'function') {
        try { switchTsrSideTab('equipment'); } catch (e) { /* ignore */ }
    }
    let left = TSR_CHALLENGE_GEAR_BREAK_SEC;
    const label = meta.label || '换装间隙';
    const waveText = (meta.wave && meta.target)
        ? `下一波 ${meta.wave}/${meta.target}`
        : '下一场战斗';
    const paint = () => {
        const r = player?.timeSecretRealm?.currentRun;
        if (!r?.isActive || !r._challengeGearBreakActive) return;
        if (left <= 0) {
            finishTsrChallengeGearBreak(false);
            return;
        }
        if (typeof showTsrMemePanel === 'function') {
            showTsrMemePanel(
                `🛡️ ${label}`,
                `右侧「装备」栏可换装/强化。<br><span style="font-size:1.35em;color:#fde68a;font-weight:700;">${left}</span> 秒后自动开战 · ${waveText}`,
                '<button type="button" class="tsr-btn tsr-btn-gold" onclick="finishTsrChallengeGearBreak(true)">准备就绪 · 立刻开战</button>',
                'safe'
            );
        } else {
            addTsrLog?.(`${label}：${left}秒后开战`, 'info');
        }
        left -= 1;
        r._challengeGearBreakTimer = setTimeout(paint, 1000);
    };
    addTsrLog?.(`🛡️ ${label}：${TSR_CHALLENGE_GEAR_BREAK_SEC}秒换装时间`, 'info');
    paint();
}

function finishTsrChallengeGearBreak(manual) {
    const run = player?.timeSecretRealm?.currentRun;
    if (!run) return;
    if (run._challengeGearBreakTimer) {
        clearTimeout(run._challengeGearBreakTimer);
        run._challengeGearBreakTimer = null;
    }
    if (!run._challengeGearBreakActive && !run._challengeGearBreakContinue) return;
    const cb = run._challengeGearBreakContinue;
    run._challengeGearBreakActive = false;
    run._challengeGearBreakContinue = null;
    if (typeof hideTsrChoicePanels === 'function') hideTsrChoicePanels(true);
    if (manual) addTsrLog?.('换装结束，继续挑战', 'info');
    if (typeof cb === 'function') {
        try { cb(); } catch (e) { console.warn('[TSR] finishTsrChallengeGearBreak', e); }
    }
}

/**
 * 挑战开战前占用一场 fightId，避免 settle 用到空摘要/上一场结果误判失败。
 * @returns {number} fightId
 */
function beginTsrChallengeFight(run) {
    if (!run) return 0;
    run._challengeFightSeq = (run._challengeFightSeq || 0) + 1;
    run._challengeAwaitFightId = run._challengeFightSeq;
    run.lastBattleSummary = null;
    return run._challengeAwaitFightId;
}

/** 等战斗结算与演出结束再回调（挑战波次推进专用） */
function waitTsrBattleSettled(cb, tries) {
    const n = Number(tries) || 0;
    const run = player?.timeSecretRealm?.currentRun;
    if (!run?.isActive) return;
    const awaitId = run._challengeAwaitFightId;
    const summaryReady = awaitId == null
        || (!!run.lastBattleSummary && run.lastBattleSummary.fightId === awaitId);
    if (!run.battleInProgress && !run._resolvingBattle && summaryReady) {
        try { cb(run); } catch (e) { console.warn('[TSR] waitTsrBattleSettled', e); }
        return;
    }
    if (n >= 240) {
        try { cb(run); } catch (e) { console.warn('[TSR] waitTsrBattleSettled timeout', e); }
        return;
    }
    setTimeout(() => waitTsrBattleSettled(cb, n + 1), 100);
}

/** 通关进度曲线：前段弱、中段持平、接近通关层再抬压 */
function getTsrMonsterProgressCurve(floor, clearFloor) {
    const b = TSR_MONSTER_BALANCE;
    const cf = Math.max(5, Number(clearFloor) || 26);
    const t = Math.min(1.25, Math.max(0, (Math.max(1, floor) - 1) / Math.max(1, cf - 1)));
    if (t <= 0.45) {
        const u = t / 0.45;
        return b.curveMin + (b.curveMid - b.curveMin) * u;
    }
    const u = Math.min(1, (t - 0.45) / 0.55);
    // 后半段略加速，让通关层有存在感但不碾压
    return b.curveMid + (b.curveMax - b.curveMid) * (u * u * (3 - 2 * u));
}

function computeTsrMonsterStats(opts) {
    const floor = opts.floor || 1;
    const dm = Math.max(0.8, Number(opts.difficultyMultiplier) || 1);
    const isBoss = !!opts.isBoss;
    const isElite = !!opts.isElite;
    const tier = isBoss ? 'boss' : (isElite ? 'elite' : 'battle');
    const monsterTier = opts.monster?.tier || 'common';
    const tierMult = TSR_MONSTER_TIER_MULT[monsterTier] || 1;
    const affix = getTsrActiveAffix();
    const affixMult = 1 + (affix?.monsterMult || 0);
    const tsr = player.timeSecretRealm;
    const clearFloor = tsr?.currentRun?.clearFloor
        || tsr?.difficulty?.levels?.[tsr?.currentRun?.difficulty || tsr?.difficulty?.current]?.clearFloor
        || 26;
    const role = TSR_MONSTER_BALANCE[tier] || TSR_MONSTER_BALANCE.battle;
    const anchor = getTsrMonsterBalanceAnchor();
    const progress = getTsrMonsterProgressCurve(floor, clearFloor);
    // 难度做软幂调节；高梯额外抬一档区分度
    const dmSoft = Math.pow(dm, TSR_MONSTER_BALANCE.dmPow);
    const diffTier = getTsrDifficultyTier();
    const tierNudge = 1 + Math.min(0.25, Math.max(0, diffTier - 1) * 0.022);

    let hp = anchor.atk * role.hpFromAtk * progress * dmSoft * tierNudge * tierMult * affixMult;
    let atk = anchor.hp * role.atkFromHp * progress * dmSoft * tierNudge * tierMult * affixMult;

    // 定期首领软化：防开局反击秒杀，但保留可感知威胁
    if (isBoss && floor <= TSR_BOSS_FLOOR_INTERVAL) {
        hp *= 0.88;
        atk *= 0.66;
    } else if (isBoss && floor <= TSR_BOSS_FLOOR_INTERVAL * 2) {
        hp *= 0.93;
        atk *= 0.76;
    } else if (isBoss) {
        atk *= 0.86;
        hp *= 0.97;
    }

    // 高难后期加厚：越往后越吃构筑
    if (diffTier >= 8) {
        hp *= 1 + (diffTier - 7) * 0.04;
        atk *= 1 + (diffTier - 7) * 0.032;
    }
    if (diffTier >= 10) {
        hp *= 1 + (diffTier - 9) * 0.03;
        atk *= 1 + (diffTier - 9) * 0.025;
    }

    // 挑战模式无局内成型：给独立软化，避免一进就被秒退
    const chal = getTsrChallengeMonsterScale(tsr?.currentRun);
    if (chal.hp !== 1 || chal.atk !== 1) {
        hp *= chal.hp;
        atk *= chal.atk;
    }

    const fateMods = tsr?.currentRun?.fateMods;
    if (fateMods?.monsterMult) { hp *= 1 + fateMods.monsterMult; atk *= 1 + fateMods.monsterMult; }
    const contractMonster = tsr?.currentRun?.contractMods?.monsterMult || 0;
    if (contractMonster) { hp *= 1 + contractMonster; atk *= 1 + contractMonster; }
    if (opts.timeLoanPenalty && floor === 1) { hp *= 1.08; atk *= 1.06; }
    if (opts.kpiBattlePenalty) { hp *= opts.kpiBattlePenalty; atk *= opts.kpiBattlePenalty; }
    if (tsr?.currentRun?.monsterFlatMult) {
        hp *= 1 + tsr.currentRun.monsterFlatMult;
        atk *= 1 + tsr.currentRun.monsterFlatMult;
    }

    // 兜底：极端情况下不低于旧表的一部分，避免数值异常
    const fallback = TSR_MONSTER_STAT_BASE[tier] || TSR_MONSTER_STAT_BASE.battle;
    hp = Math.max(TSR_MONSTER_BALANCE.minHp, Math.floor(hp), Math.floor(fallback.hp * 0.35));
    atk = Math.max(TSR_MONSTER_BALANCE.minAtk, Math.floor(atk), Math.floor(fallback.atk * 0.35));

    const base = { hp, atk, tier, monsterTier };
    return opts.monster ? applyTsrMonsterAffixToStats(base, opts.monster) : base;
}

/** 反击难度软化：怪物 atk 已吃过 dm^dmPow，反击系数不可再乘完整 dm */
function getTsrCounterDifficultySoft(dm) {
    const d = Math.max(0.8, Number(dm) || 1);
    return Math.pow(d, TSR_MONSTER_BALANCE.counterDmPow || 0.12);
}

function getTsrBattleCounterRatio(isBoss, isElite, dm) {
    const base = isBoss ? 0.44 : (isElite ? 0.54 : 0.52);
    return base * getTsrCounterDifficultySoft(dm);
}

/** 灵击随层软缩放：怪血涨、灵击也应跟得上（避免高楼层化成刮痧） */
function getTsrSpiritStrikeFloorScale() {
    const run = player.timeSecretRealm?.currentRun;
    const floor = Math.max(1, run?.currentFloor || 1);
    const clearFloor = Math.max(10, run?.clearFloor || 40);
    let progress = 0.6;
    if (typeof getTsrMonsterProgressCurve === 'function') {
        progress = getTsrMonsterProgressCurve(floor, clearFloor) || 0.6;
    }
    // progress≈0.58→~1.05；1.0→~1.45；1.32→~1.7；再叠一层对数防极端
    const scale = 0.9 + progress * 0.62 + Math.min(0.65, Math.log2(1 + floor * 0.14) * 0.22);
    return Math.min(2.9, Math.max(1.0, scale));
}

function getTsrSpiritCombatBonuses() {
    const sp = ensureTsrSpiritPet();
    const lv = sp.level || 1;
    const bond = sp.bond || 0;
    const evo = sp.evolution || 0;
    const sk = getTsrSpiritSkillBonuses();
    const affix = getTsrActiveAffix();
    const equipStrike = typeof getTsrEquipBonus === 'function' ? (getTsrEquipBonus('spiritStrike') || 0) : 0;
    // allMult 半额吃进灵击（文案「全效果」在高层也该惠及直伤）
    const allMultHalf = 1 + (sk.allMult || 0) * 0.55;
    let spiritStrikeMult = 1 + (sk.spiritStrikeMult || 0) + (affix?.spiritStrikeMult || 0)
        + getTsrPermanentStarSpiritStrike() + getTsrPermanentArchonFragment() + equipStrike;
    spiritStrikeMult *= allMultHalf;
    const evoMeta = getTsrSpiritEvolutionMeta(evo);
    const pact = player.timeSecretRealm?.currentRun?.spiritPactCombat;
    if (pact?.strikeMult) spiritStrikeMult *= pact.strikeMult;
    if ((sp.skills || []).includes('starDominion') && evo >= getTsrSpiritMaxEvolution()) spiritStrikeMult *= 1.15;
    spiritStrikeMult *= getTsrSpiritStrikeFloorScale();
    // 战阵攻击：软顶放宽，超出部分半额计入
    const rawAtk = lv * 0.0095 + bond * 0.0013 + evo * 0.048 + (sk.battleAttack || 0) + (evoMeta.combatBonus || 0);
    const attackBonus = rawAtk <= 0.55 ? rawAtk : (0.55 + (rawAtk - 0.55) * 0.55);
    const flatBase = lv * 4.0 + bond * 0.28 + evo * 15 + (evoMeta.spiritStrikeBonus || 0);
    return {
        attackBonus: Math.min(0.75, attackBonus),
        spiritStrike: Math.max(1, Math.floor(flatBase * spiritStrikeMult)),
        counterReduce: Math.min(0.32, bond * 0.0014 + (sk.counterReduce || 0) + (evo >= 4 ? 0.06 : 0))
    };
}

function tryTsrSpiritBattleStrike(rounds, monsterHp, isBoss, monster, monsterMaxHp) {
    const tsr = player.timeSecretRealm;
    const sp = ensureTsrSpiritPet();
    const pulseActive = (sp.skills || []).includes('apocalypsePulse');
    const strikeInterval = pulseActive ? 2 : 3;
    if (rounds % strikeInterval !== 0 || monsterHp <= 0) return monsterHp;
    if (sp.level < 3 || (tsr.currentRun.spiritCharge || 0) < 12) return monsterHp;
    const combat = getTsrSpiritCombatBonuses();
    // 首领灵击几乎全额，高难仍靠灵击线输出
    let strike = Math.max(1, Math.floor(combat.spiritStrike * (isBoss ? 0.98 : 1)));
    // 相对怪血的保底刮肉：随层升至约 4.5%（首领 3.6%）
    const maxHp = Math.max(0, Number(monsterMaxHp) || Number(tsr.currentRun.monsterMaxHpCache) || 0);
    if (maxHp > 0) {
        const floor = tsr.currentRun.currentFloor || 1;
        const pct = Math.min(0.045, 0.015 + floor * 0.00015);
        strike += Math.floor(maxHp * pct * (isBoss ? 0.8 : 1) * (0.9 + Math.min(0.45, (sp.level || 1) * 0.01)));
    }
    if (monster && (monster.affixKeys || []).length) {
        strike = Math.floor(strike * getTsrAffixSpiritStrikeMult(monster));
    }
    if (tsr.currentRun.spiritRiftAssist) strike *= 2;
    if (tsr.currentRun.spiritArenaAssist) strike = Math.floor(strike * 1.8);
    if (tsr.currentRun.spiritBossAssist) strike = Math.floor(strike * 2.5);
    if (tsr.currentRun.spiritAscendAssist) strike = Math.floor(strike * 3);
    if (tsr.currentRun.spiritStarAssist) strike = Math.floor(strike * (tsr.currentRun.spiritStarAssistMult || 3.5));
    if (tsr.currentRun.spiritStrikeAmp && tsr.currentRun.spiritStrikeAmp > 0) {
        strike = Math.floor(strike * tsr.currentRun.spiritStrikeAmp);
    }
    const starAssistMult = tsr.currentRun.spiritStarAssistMult || 3.5;
    const assistTag = tsr.currentRun.spiritStarAssist ? `（星域×${starAssistMult}）` : (tsr.currentRun.spiritAscendAssist ? '（飞升×3）' : (tsr.currentRun.spiritBossAssist ? '（王座协同×2.5）' : (tsr.currentRun.spiritArenaAssist ? '（竞技×1.8）' : (tsr.currentRun.spiritRiftAssist ? '（协同×2）' : (pulseActive ? '（脉冲）' : '')))));
    addTsrLog(`✨ ${getTsrSpiritDisplayName()}灵击！造成${formatTsrCombatNum(strike)}伤害${assistTag}`, 'success');
    if (typeof pushTsrFeelEvent === 'function') {
        pushTsrFeelEvent({ type: 'spirit', label: `✨ ${getTsrSpiritDisplayName()}灵击` });
    }
    chargeTsrSpirit(pulseActive ? 8 : 6);
    return Math.max(0, monsterHp - strike);
}

function tsrInvokeSpirit() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    if ((tsr.currentRun.spiritCharge || 0) < 30) {
        addTsrLog('精灵充能不足30%，无法呼唤', 'warning');
        return;
    }
    if (tsr.currentRun.timeLeft <= 18) {
        addTsrLog('剩余时间不足，无法呼唤精灵', 'warning');
        return;
    }
    tsr.currentRun.timeLeft -= 15;
    tsr.currentRun.spiritCharge = Math.max(0, (tsr.currentRun.spiritCharge || 0) - 30);
    const bonuses = getTsrSpiritBonuses();
    tsrHealPlayer(bonuses.healRate * 0.55);
    tsr.currentRun.timeLeft += Math.floor(bonuses.timeBonus * 0.45);
    addTsrSpiritBond(2);
    const combat = getTsrSpiritCombatBonuses();
    addTempBuff({
        name: getTsrSpiritDisplayName() + '战意',
        effect: 'attack',
        value: Math.max(0.08, combat.attackBonus * 0.75),
        duration: 2,
        isDebuff: false
    });
    addTsrLog(`🧚 ${getTsrSpiritDisplayName()}响应呼唤！回血、加时、攻击提升（2回合）`, 'success');
    updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
}

function getTsrBattleAttackBonus(isBoss, isElite) {
    let bonus = getTsrSpiritCombatBonuses().attackBonus;
    const sk = getTsrSpiritSkillBonuses();
    if (isBoss) {
        bonus += getTsrRelicBonus('bossAttack');
        bonus += sk.bossSpiritAttack || 0;
    }
    if (isElite) bonus += getTsrRelicBonus('eliteAttack');
    bonus += player.timeSecretRealm?.currentRun?.weeklyBonus?.attack || 0;
    const streak = player.timeSecretRealm?.currentRun?.battleWinStreak || 0;
    bonus += Math.min(0.3, streak * getTsrRelicBonus('streakAttack'));
    if (player.timeSecretRealm?.currentRun?.flashBombActive) bonus += 0.25;
    return bonus;
}

function applyTsrMonsterSkill(monster, rounds, monsterHp, playerAtk, difficultyMultiplier, isBoss, isElite) {
    const tsr = player.timeSecretRealm;
    if (!monster?.skill || Math.random() >= (monster.skillChance || 0)) return monsterHp;
    const label = `${monster.icon} ${monster.name}`;
    if (typeof pushTsrFeelEvent === 'function') {
        pushTsrFeelEvent({ type: 'skill', label: `${monster.icon} 发动技能！` });
    }
    const hpNum = Number(monsterHp) || 0;
    const atkNum = Number(playerAtk) || 0;
    switch (monster.skill) {
        case 'timeDrain': {
            const drain = monster.skillValue || 5;
            tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - drain);
            addTsrLog(`${label}发动「窃时」！-${drain}秒`, 'warning');
            break;
        }
        case 'rage': {
            const rageDm = Math.pow(Math.max(0.8, Number(difficultyMultiplier) || 1), 0.1);
            const extra = Math.max(1, Math.floor(hpNum * 0.1 * rageDm * (isBoss ? 1.05 : 1) * getTsrCounterDamageMultiplier()));
            applyDamage(extra);
            addTsrLog(`${label}暴怒反扑！额外反击${formatTsrCombatNum(extra)}`, 'error');
            break;
        }
        case 'shield':
            tsr.currentRun.monsterShield = Math.min(0.45, (monster.skillValue || 0.15) + (tsr.currentRun.monsterShield || 0));
            addTsrLog(`${label}展开护盾！你的伤害-${Math.floor(tsr.currentRun.monsterShield * 100)}%`, 'warning');
            break;
        case 'heal': {
            const healRatio = monster.skillValue || 0.1;
            monsterHp = hpNum + Math.floor(atkNum * healRatio);
            addTsrLog(`${label}自我恢复！回复${Math.floor(healRatio * 100)}%血量`, 'warning');
            break;
        }
        case 'curse':
            addTempBuff({ name: monster.name + '诅咒', effect: 'attack', value: -0.15, duration: 3, isDebuff: true });
            addTsrLog(`${label}施加诅咒！攻击-15%×3`, 'warning');
            break;
        case 'slow':
            tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - 6);
            addTsrLog(`${label}拖慢节奏！-6秒`, 'warning');
            break;
        case 'burst':
            if (rounds >= 4) {
                // 百分比伤不再吃难度倍率（难度已体现在反击绝对值里；否则高难度一次几百%秒杀）
                applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
                addTsrLog(`${label}延迟爆发！受到8%生命伤害`, 'error');
            }
            break;
        case 'spiritDrain': {
            const pct = monster.skillValue || 0.2;
            const drain = Math.max(5, Math.floor((tsr.currentRun.spiritCharge || 0) * pct));
            tsr.currentRun.spiritCharge = Math.max(0, (tsr.currentRun.spiritCharge || 0) - drain);
            addTsrLog(`${label}发动「噬灵」！精灵充能-${drain}%`, 'warning');
            break;
        }
        case 'bondBreak': {
            const sp = ensureTsrSpiritPet();
            const loss = monster.skillValue || 3;
            sp.bond = Math.max(0, (sp.bond || 0) - loss);
            invalidateTsrUiCache('spirit');
            addTsrLog(`${label}发动「断缘」！精灵亲密度-${loss}`, 'warning');
            break;
        }
        case 'dodge':
            tsr.currentRun.monsterDodgeNext = true;
            addTsrLog(`${label}发动「闪避」！下回合将躲开攻击`, 'warning');
            break;
        case 'reflect':
            tsr.currentRun.monsterReflectPct = Math.max(tsr.currentRun.monsterReflectPct || 0, monster.skillValue || 0.05);
            addTsrLog(`${label}展开「反伤镜」！暴击时将反刺${Math.floor((monster.skillValue || 0.05) * 100)}%生命`, 'warning');
            break;
        case 'enrage':
            if (hpNum <= (Number(player.timeSecretRealm?.currentRun?.monsterMaxHpCache) || hpNum * 2) * 0.55) {
                tsr.currentRun.monsterPhaseCounterBonus = (tsr.currentRun.monsterPhaseCounterBonus || 0) + (monster.skillValue || 0.22);
                addTsrLog(`${label}进入「狂暴」！反击大幅强化`, 'warning');
            }
            break;
        case 'coinSteal': {
            const steal = Math.min(tsr.currentRun.currencyEarned || 0, monster.skillValue || 20);
            if (steal > 0) {
                tsr.currentRun.currencyEarned -= steal;
                addTsrLog(`${label}发动「吸币」！-${steal}秘境币`, 'warning');
            }
            break;
        }
        case 'armorBreak':
            addTempBuff({ name: monster.name + '破甲', effect: 'attack', value: -0.12, duration: 3, isDebuff: true });
            addTsrLog(`${label}发动「破甲」！攻击-12%×3`, 'warning');
            break;
        case 'multiStrike':
            tsr.currentRun.monsterMultiStrike = true;
            addTsrLog(`${label}发动「连击」！本回合反击翻倍`, 'warning');
            break;
    }
    return monsterHp;
}

function tryTsrDynamicEncounter() {
    const tsr = player.timeSecretRealm;
    const sp = ensureTsrSpiritPet();
    const evo = sp?.evolution || 0;
    let chance = TSR_DYNAMIC_ENCOUNTER_CHANCE;
    if (evo >= 4) chance += 0.035;
    if ((sp?.skills || []).includes('starOrigin')) chance += 0.02;
    if (Math.random() >= chance) return false;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const encounters = [
        {
            name: '时空旅人',
            log: '一位迷路的时空旅人向你求助……',
            choices: [
                { label: '指路 · -8秒 +80币', fn: () => { tsr.currentRun.timeLeft -= 8; return addTsrRunCurrency(Math.floor(80 * dm)); } },
                { label: '无视 · +12秒', fn: () => { tsr.currentRun.timeLeft += 12; return 0; } },
                { label: '打劫 · 50%得150币或-8%血', fn: () => {
                    if (Math.random() < 0.5) return addTsrRunCurrency(Math.floor(150 * dm));
                    applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
                    return -1;
                } }
            ]
        },
        {
            name: '宝箱怪伏击',
            log: '地面突然裂开——是宝箱怪！',
            choices: [
                { label: '迎战 · 迷你战斗', fn: () => { tsr.currentRun.pendingMiniBattle = true; return -2; } },
                { label: '逃跑 · -15秒', fn: () => { tsr.currentRun.timeLeft -= 15; return 0; } },
                { label: '投喂 · -40币换道具', fn: () => {
                    if (tsr.currentRun.currencyEarned < 40) return -3;
                    tsr.currentRun.currencyEarned -= 40;
                    const keys = Object.keys(TSR_RUN_CONSUMABLES);
                    addTsrConsumable(keys[Math.floor(Math.random() * keys.length)]);
                    return -4;
                } }
            ]
        },
        {
            name: '时光流星雨',
            log: '头顶划过一片时光流星——快许愿！',
            choices: [
                { label: '许愿财富', fn: () => addTsrRunCurrency(Math.floor(60 * dm + Math.random() * 80 * dm)) },
                { label: '许愿时间', fn: () => { tsr.currentRun.timeLeft += 28 + Math.floor(Math.random() * 20); return 0; } },
                { label: '许愿力量', fn: () => { addTempBuff({ name: '流星祝福', effect: 'attack', value: 0.25, duration: 3, isDebuff: false }); return 0; } }
            ]
        },
        {
            name: '迷途异兽',
            log: '一只受伤的高阶异兽拦住了去路，眼中闪烁着危险的光芒……',
            choices: [
                { label: '驯服 · 50%得道具或战斗', fn: () => {
                    if (Math.random() < 0.5) { addTsrConsumable('spiritSnack'); return -4; }
                    tsr.currentRun.pendingMiniBattle = true;
                    return -2;
                } },
                { label: '绕行 · -18秒', fn: () => { tsr.currentRun.timeLeft -= 18; return 0; } },
                { label: '狩猎 · 稀有精英战', fn: () => { tsr.currentRun.pendingRareHunt = true; return -5; } }
            ]
        },
        {
            name: '时光商人',
            log: '斗篷商人推着小车：「秘境特供，童叟无欺。」',
            choices: [
                { label: '买补给 · 60币', fn: () => {
                    if (tsr.currentRun.currencyEarned < 60) return -3;
                    tsr.currentRun.currencyEarned -= 60;
                    tsrHealPlayer(0.15);
                    return -4;
                } },
                { label: '买情报 · 40币', fn: () => {
                    if (tsr.currentRun.currencyEarned < 40) return -3;
                    tsr.currentRun.currencyEarned -= 40;
                    tsr.currentRun.battleRewardBonus = 0.25;
                    return -4;
                } },
                { label: '讨价还价 · 50%半价或被骗', fn: () => {
                    if (Math.random() < 0.5) { addTsrRunCurrency(Math.floor(80 * dm)); return Math.floor(80 * dm); }
                    tsr.currentRun.timeLeft -= 12;
                    return 0;
                } }
            ]
        },
        {
            name: '迷途幼灵',
            log: `${getTsrSpiritDisplayName()}的同类在迷雾中瑟瑟发抖……`,
            choices: [
                { label: '安抚 · -12秒 充能+45', fn: () => {
                    tsr.currentRun.timeLeft -= 12;
                    chargeTsrSpirit(45);
                    addTsrSpiritBond(3);
                    return -4;
                } },
                { label: '引导回灵脉 · 经验+60', fn: () => {
                    addTsrSpiritExp(Math.floor(60 * getTsrSpiritRoomMult()));
                    return -4;
                } },
                { label: '无视 · +8秒', fn: () => { tsr.currentRun.timeLeft += 8; return 0; } }
            ]
        },
        {
            name: '灵脉异变',
            log: '地面灵脉突然暴走，你必须做出选择！',
            choices: [
                { label: '压制 · 50%得技能点或-8%血', fn: () => {
                    if (Math.random() < 0.5) {
                        ensureTsrSpiritPet().skillPoints = (ensureTsrSpiritPet().skillPoints || 0) + 1;
                        invalidateTsrUiCache('spirit');
                        return -4;
                    }
                    applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
                    return -1;
                } },
                { label: '吸收 · 充能+55 亲密度+5', fn: () => {
                    chargeTsrSpirit(55);
                    addTsrSpiritBond(5);
                    return -4;
                } },
                { label: '逃离 · -20秒', fn: () => { tsr.currentRun.timeLeft -= 20; return 0; } }
            ]
        },
        {
            name: '精灵引路',
            log: '你的精灵突然飞向某个方向，似乎在引路……',
            choices: [
                { label: '跟随 · 预览下两层+充能+25', fn: () => {
                    tsr.currentRun.oraclePreview = 2;
                    chargeTsrSpirit(25);
                    updateTsrRoomPreview();
                    return -4;
                } },
                { label: '询问 · +70币', fn: () => addTsrRunCurrency(Math.floor(70 * dm)) },
                { label: '按住 · +30秒', fn: () => { tsr.currentRun.timeLeft += 30; return 0; } }
            ]
        },
        {
            name: '灵脉暴走',
            log: '灵脉突然喷涌，精灵与怪物同时被吸引而来！',
            choices: [
                { label: '协同镇压 · 精英战+充能+20', fn: () => {
                    tsr.currentRun.pendingRareHunt = true;
                    chargeTsrSpirit(20);
                    return -5;
                } },
                { label: '引导分流 · -15秒 经验+80', fn: () => {
                    tsr.currentRun.timeLeft -= 15;
                    addTsrSpiritExp(Math.floor(80 * getTsrSpiritRoomMult()));
                    return -4;
                } },
                { label: '逃离 · +10秒', fn: () => { tsr.currentRun.timeLeft += 10; return 0; } }
            ]
        },
        {
            name: '时光精灵商队',
            log: '一支精灵商队路过，愿意以物易物。',
            choices: [
                { label: '换灵食 · -35币 充能+50', fn: () => {
                    if (tsr.currentRun.currencyEarned < 35) return -3;
                    tsr.currentRun.currencyEarned -= 35;
                    chargeTsrSpirit(50);
                    return -4;
                } },
                { label: '换情报 · -25币 预览2层', fn: () => {
                    if (tsr.currentRun.currencyEarned < 25) return -3;
                    tsr.currentRun.currencyEarned -= 25;
                    tsr.currentRun.oraclePreview = 2;
                    updateTsrRoomPreview();
                    return -4;
                } },
                { label: '围观 · +5秒', fn: () => { tsr.currentRun.timeLeft += 5; return 0; } }
            ]
        },
        {
            name: '噬灵魔兽踪迹',
            log: '地面残留着噬灵魔兽的灵力痕迹，精灵变得警惕……',
            choices: [
                { label: '追踪 · 稀有战+亲密度+6', fn: () => {
                    addTsrSpiritBond(6);
                    tsr.currentRun.pendingRareHunt = true;
                    return -5;
                } },
                { label: '设伏 · 50%得150币或战斗', fn: () => {
                    if (Math.random() < 0.5) return addTsrRunCurrency(Math.floor(150 * dm));
                    tsr.currentRun.pendingMiniBattle = true;
                    return -2;
                } },
                { label: '回避 · +15秒', fn: () => { tsr.currentRun.timeLeft += 15; return 0; } }
            ]
        },
        {
            name: '羁绊试炼',
            log: `${getTsrSpiritDisplayName()}感应到远处有羁绊共鸣的试炼场。`,
            choices: [
                { label: '前往 · 经验+90 充能+30', fn: () => {
                    if (tsr.currentRun.timeLeft <= 20) return 0;
                    tsr.currentRun.timeLeft -= 18;
                    addTsrSpiritExp(Math.floor(90 * getTsrSpiritRoomMult()));
                    chargeTsrSpirit(30);
                    return -4;
                } },
                { label: '远程感悟 · 亲密度+8', fn: () => { addTsrSpiritBond(8); return -4; } },
                { label: '忽略 · +8秒', fn: () => { tsr.currentRun.timeLeft += 8; return 0; } }
            ]
        },
        {
            name: '终焉裂隙',
            log: '一道终焉裂隙撕开空间，高阶怪物若隐若现（高难度专属感）。',
            choices: [
                { label: '闯入 · 史诗精英战', fn: () => {
                    tsr.currentRun.pendingRareHunt = true;
                    tsr.currentRun.battleRewardBonus = 0.35;
                    return -5;
                } },
                { label: '封印 · -20秒 攻击+20%×3', fn: () => {
                    tsr.currentRun.timeLeft -= 20;
                    addTempBuff({ name: '封印余威', effect: 'attack', value: 0.2, duration: 3, isDebuff: false });
                    return 0;
                } },
                { label: '绕行 · +12秒', fn: () => { tsr.currentRun.timeLeft += 12; return 0; } }
            ]
        },
        {
            name: '灵域残影',
            log: '灵域霸主的残影一闪而过，似乎在寻找挑战者。',
            choices: [
                { label: '挑衅 · 50%神话战或-8%血', fn: () => {
                    if (Math.random() < 0.5) {
                        tsr.currentRun.pendingSpiritBossEcho = true;
                        return -6;
                    }
                    applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
                    return -1;
                } },
                { label: '致敬 · 充能+40 经验+50', fn: () => {
                    chargeTsrSpirit(40);
                    addTsrSpiritExp(Math.floor(50 * getTsrSpiritRoomMult()));
                    return -4;
                } },
                { label: '静观 · +10秒', fn: () => { tsr.currentRun.timeLeft += 10; return 0; } }
            ]
        },
        {
            name: '共生灵域',
            log: '一片共生灵域展开，精灵提议共享灵力。',
            choices: [
                { label: '共生 · 满充能+回血15%', fn: () => {
                    chargeTsrSpirit(100);
                    tsrHealPlayer(0.15);
                    return -4;
                } },
                { label: '采撷 · 经验+70 币+60×难度', fn: () => {
                    addTsrSpiritExp(Math.floor(70 * getTsrSpiritRoomMult()));
                    return addTsrRunCurrency(Math.floor(60 * dm));
                } },
                { label: '拒绝 · +6秒', fn: () => { tsr.currentRun.timeLeft += 6; return 0; } }
            ]
        },
        {
            req: () => evo >= 4,
            name: '星灵回响',
            log: `${getTsrSpiritDisplayName()}与终焉星域产生共鸣，星辉在空气中流转……`,
            choices: [
                { label: '共鸣 · 满充能+亲密度+10', fn: () => {
                    chargeTsrSpirit(100);
                    addTsrSpiritBond(10);
                    return -4;
                } },
                { label: '采撷星辉 · 经验+120', fn: () => {
                    addTsrSpiritExp(Math.floor(120 * getTsrSpiritRoomMult()));
                    return -4;
                } },
                { label: '静默 · +15秒', fn: () => { tsr.currentRun.timeLeft += 15; return 0; } }
            ]
        },
        {
            req: () => evo >= 4,
            name: '终焉星瀑',
            log: '星瀑从天而降，洗涤灵脉或冲刷敌人——你选哪个？',
            choices: [
                { label: '沐浴 · 回血25% 加时+35', fn: () => {
                    tsrHealPlayer(0.25);
                    tsr.currentRun.timeLeft += 35;
                    addTsrSpiritBond(6);
                    return -4;
                } },
                { label: '冲刷 · 星湮精英战', fn: () => {
                    tsr.currentRun.pendingStarWraith = true;
                    return -5;
                } },
                { label: '避雨 · +8秒', fn: () => { tsr.currentRun.timeLeft += 8; return 0; } }
            ]
        },
        {
            req: () => evo >= 4,
            name: '帝皇遗训',
            log: '精灵帝皇的虚影低语：「星灵，可敢再受一训？」',
            choices: [
                { label: '接受遗训 · 帝皇残影战', fn: () => -7 },
                { label: '聆听 · 50%技能点或+100经验', fn: () => {
                    if (Math.random() < 0.5) {
                        sp.skillPoints = (sp.skillPoints || 0) + 1;
                        invalidateTsrUiCache('spirit');
                        return -4;
                    }
                    addTsrSpiritExp(Math.floor(100 * getTsrSpiritRoomMult()));
                    return -4;
                } },
                { label: '告退 · 充能+50', fn: () => { chargeTsrSpirit(50); return -4; } }
            ]
        },
        {
            req: () => evo >= 4,
            name: '星门低语',
            log: '星门在远处震颤，似乎有宝库或王座在等待……',
            choices: [
                { label: '循声 · 预览3层+充能+40', fn: () => {
                    tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, 3);
                    updateTsrRoomPreview();
                    chargeTsrSpirit(40);
                    return -4;
                } },
                { label: '叩门 · 50%天穹精英战', fn: () => {
                    if (Math.random() < 0.5) {
                        tsr.currentRun.pendingRareHunt = true;
                        tsr.currentRun.battleRewardBonus = 0.3;
                        return -5;
                    }
                    return addTsrRunCurrency(Math.floor(100 * dm));
                } },
                { label: '离开 · +12秒', fn: () => { tsr.currentRun.timeLeft += 12; return 0; } }
            ]
        },
        {
            req: () => evo >= 4 && (sp?.skills || []).includes('starDominion'),
            name: '统御回响',
            log: '星域统御灵脉与秘境共鸣，可选择强化或征伐。',
            choices: [
                { label: '统御加持 · 攻击+18%×5', fn: () => {
                    addTempBuff({ name: '星域统御', effect: 'attack', value: 0.18, duration: 5, isDebuff: false });
                    return -4;
                } },
                { label: '征伐幻影 · 统御幻影战', fn: () => {
                    tsr.currentRun.pendingDominionPhantom = true;
                    return -5;
                } },
                { label: '收束 · +20秒 经验+80', fn: () => {
                    tsr.currentRun.timeLeft += 20;
                    addTsrSpiritExp(Math.floor(80 * getTsrSpiritRoomMult()));
                    return -4;
                } }
            ]
        },
        {
            req: () => (player.timeSecretRealm?.lifetimeStats?.tyrantKills || 0) >= 1,
            name: '暴君残响',
            log: '天穹深处传来暴君陨落后的回响，星域仍在震颤……',
            choices: [
                { label: '追猎残影 · 50%暴君精英战', fn: () => {
                    if (Math.random() < 0.5) {
                        tsr.currentRun.pendingTyrantEcho = true;
                        return -5;
                    }
                    applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
                    return -1;
                } },
                { label: '封印残响 · 攻击+20%×4', fn: () => {
                    addTempBuff({ name: '封印余威', effect: 'attack', value: 0.2, duration: 4, isDebuff: false });
                    return -4;
                } },
                { label: '远离 · +15秒', fn: () => { tsr.currentRun.timeLeft += 15; return 0; } }
            ]
        },
        {
            req: () => evo >= 4 && sp.level >= 36,
            name: '巡礼邀约',
            log: '远处传来星灵巡礼的鼓点，精灵跃跃欲试。',
            choices: [
                { label: '赴约 · 经验+90 亲密度+10', fn: () => {
                    if (tsr.currentRun.timeLeft <= 18) return 0;
                    tsr.currentRun.timeLeft -= 15;
                    addTsrSpiritExp(Math.floor(90 * getTsrSpiritRoomMult()));
                    addTsrSpiritBond(10);
                    return -4;
                } },
                { label: '隔空喝彩 · 充能+45', fn: () => { chargeTsrSpirit(45); return -4; } },
                { label: '婉拒 · +8秒', fn: () => { tsr.currentRun.timeLeft += 8; return 0; } }
            ]
        },
        {
            req: () => (player.timeSecretRealm?.lifetimeStats?.affixKills || 0) >= 2,
            name: '词条商人',
            log: '兜帽商人摊开一本发光图鉴：「识词条者，方可识财宝。」',
            choices: [
                { label: '购买透视镜 · -40币', fn: () => {
                    if (tsr.currentRun.currencyEarned < 40) return -3;
                    tsr.currentRun.currencyEarned -= 40;
                    addTsrConsumable('affixScope');
                    return -4;
                } },
                { label: '委托猎杀 · 下战额外词条+赏金+15%', fn: () => {
                    tsr.currentRun.nextBattleExtraAffix = true;
                    tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + 0.15;
                    return -4;
                } },
                { label: '谢绝 · +10秒', fn: () => { tsr.currentRun.timeLeft += 10; return 0; } }
            ]
        },
        {
            req: () => (player.timeSecretRealm?.lifetimeStats?.championClears || 0) >= 1,
            name: '冠军信使',
            log: '殿堂信使递来一封战书：「下一战，敢来吗？」',
            choices: [
                { label: '接受战书 · 下战奖励+40%', fn: () => {
                    tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + 0.4;
                    return -4;
                } },
                { label: '讨教战术 · -12秒 攻击+18%×3', fn: () => {
                    if (tsr.currentRun.timeLeft <= 14) return 0;
                    tsr.currentRun.timeLeft -= 12;
                    addTempBuff({ name: '冠军战术', effect: 'attack', value: 0.18, duration: 3, isDebuff: false });
                    return -4;
                } },
                { label: '婉拒 · +8秒', fn: () => { tsr.currentRun.timeLeft += 8; return 0; } }
            ]
        },
        {
            req: () => (player.timeSecretRealm?.totalRuns || 0) >= 2,
            name: '星运占卜师',
            log: '占卜师展开<span class="tsr-txt-fortune">七色星盘</span>：「今日星运，可再窥一线天机。」',
            choices: [
                { label: '窥探天机 · -10秒 充能+30', fn: () => {
                    if (tsr.currentRun.timeLeft <= 12) return 0;
                    tsr.currentRun.timeLeft -= 10;
                    chargeTsrSpirit(30);
                    return -4;
                } },
                { label: '交换命运 · 50% +150×难度币或-8%血', fn: () => {
                    const dm = tsr.currentRun.difficultyMultiplier || 1;
                    if (Math.random() < 0.5) {
                        const g = addTsrRunCurrency(Math.floor(150 * dm * (1 + getTsrEventBonus())));
                        return `+${g}币`;
                    }
                    applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
                    return -1;
                } },
                { label: '谢绝 · +6秒', fn: () => { tsr.currentRun.timeLeft += 6; return 0; } }
            ]
        },
        {
            req: () => (player.timeSecretRealm?.lifetimeStats?.chronoLibraryRooms || 0) >= 1,
            name: '秘闻书灵',
            log: '一本发光的书从图书馆飞出，页面上写着你的名字……',
            choices: [
                { label: '借阅 · -10秒 +120×难度币', fn: () => {
                    if (tsr.currentRun.timeLeft <= 12) return 0;
                    tsr.currentRun.timeLeft -= 10;
                    return addTsrRunCurrency(Math.floor(120 * dm * (1 + getTsrEventBonus())));
                } },
                { label: '抄录 · 预览2层', fn: () => {
                    tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, 2);
                    updateTsrRoomPreview();
                    return -4;
                } },
                { label: '归还 · +8秒', fn: () => { tsr.currentRun.timeLeft += 8; return 0; } }
            ]
        },
        {
            req: () => (player.timeSecretRealm?.lifetimeStats?.starWishRooms || 0) >= 1,
            name: '星愿回音',
            log: '池面荡起涟漪，某个愿望的残响向你飘来……',
            choices: [
                { label: '回应 · 充能+50 亲密度+6', fn: () => {
                    chargeTsrSpirit(50);
                    addTsrSpiritBond(6);
                    return -4;
                } },
                { label: '打捞 · +90×难度币', fn: () => addTsrRunCurrency(Math.floor(90 * dm)) },
                { label: '无视 · +5秒', fn: () => { tsr.currentRun.timeLeft += 5; return 0; } }
            ]
        },
        {
            req: () => (player.timeSecretRealm?.totalRuns || 0) >= 10,
            name: '织时学徒',
            log: '时光织机的小学徒拦住你：「要织一截时间吗？」',
            choices: [
                { label: '试织 · -12秒 +28秒', fn: () => {
                    if (tsr.currentRun.timeLeft <= 14) return 0;
                    tsr.currentRun.timeLeft -= 12;
                    tsr.currentRun.timeLeft += 28;
                    return -4;
                } },
                { label: '买线 · +70×难度币 -8秒', fn: () => {
                    if (tsr.currentRun.timeLeft <= 10) return 0;
                    tsr.currentRun.timeLeft -= 8;
                    return addTsrRunCurrency(Math.floor(70 * dm));
                } },
                { label: '路过 · +6秒', fn: () => { tsr.currentRun.timeLeft += 6; return 0; } }
            ]
        }
    ];
    const pool = encounters.filter(e => !e.req || e.req());
    if (!pool.length) return false;
    const enc = pool[Math.floor(Math.random() * pool.length)];
    tsr.currentRun.pendingEncounter = enc;
    showTsrMemePanel(`✨ 动态遭遇 · ${enc.name}`, enc.log,
        enc.choices.map((c, i) =>
            `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrResolveDynamicEncounter(${i})">${c.label}</button>`
        ).join(''), 'epic');
    addTsrLog(`动态遭遇：${enc.name}`, 'info', 'epic');
    return true;
}

function tsrResolveDynamicEncounter(choiceIdx) {
    const tsr = player.timeSecretRealm;
    const enc = tsr.currentRun.pendingEncounter;
    if (!enc) { hideTsrChoicePanels(); return; }
    tsr.currentRun.pendingEncounter = null;
    hideTsrChoicePanels();
    const choice = enc.choices[choiceIdx];
    if (!choice) return;
    const result = choice.fn();
    if (result === -2) {
        addTsrLog('宝箱怪扑来！', 'warning');
        tsr.currentRun.currentRoom = {
            type: 'battle', name: '宝箱怪伏击', explored: true, hasTrap: false,
            trap: null, trapDetected: false, trapDisarmed: false,
            isBoss: false, isElite: false, isShrine: false,
            rewards: generateRoomRewards('battle', tsr.currentRun.difficultyMultiplier),
            monster: { id: 'mimic', name: '宝箱怪', icon: '📦', tier: 'uncommon', intro: '「惊喜吧！」', win: '宝箱怪吐出了硬币。', skill: 'burst', skillChance: 0.3 }
        };
        handleBattleRoom();
        return;
    }
    if (result === -5) {
        const floor = tsr.currentRun.currentFloor;
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        let monster;
        let roomName = '异兽狩猎';
        if (tsr.currentRun.pendingStarWraith) {
            tsr.currentRun.pendingStarWraith = false;
            addTsrLog('星湮怨灵从星瀑中浮现！', 'warning');
            roomName = '星瀑冲刷';
            monster = getTsrMonsterById('starwraith') || pickTsrMonsterMinTier(false, true, 'legendary', floor, dm);
        } else if (tsr.currentRun.pendingDominionPhantom) {
            tsr.currentRun.pendingDominionPhantom = false;
            addTsrLog('统御幻影具象化！', 'warning');
            roomName = '统御征伐';
            monster = getTsrMonsterById('dominionphantom') || pickTsrMonsterMinTier(false, true, 'mythic', floor, dm);
        } else if (tsr.currentRun.pendingTyrantEcho) {
            tsr.currentRun.pendingTyrantEcho = false;
            addTsrLog('暴君残影从虚空浮现！', 'warning');
            roomName = '暴君残响';
            monster = getTsrMonsterById('celestialtyrant') || pickTsrMonsterMinTier(true, false, 'mythic', floor, dm);
            tsr.currentRun.currentRoom = {
                type: 'boss', name: roomName, explored: true, hasTrap: false,
                trap: null, trapDetected: false, trapDisarmed: false,
                isBoss: true, isElite: false, isShrine: false,
                rewards: generateRoomRewards('boss', dm),
                monster
            };
            tsr.currentRun.currentRoom.rewards.currency = Math.floor(tsr.currentRun.currentRoom.rewards.currency * 1.8);
            tsr.currentRun.spiritStarAssist = true;
            tsr.currentRun.spiritStarAssistMult = 3.2;
            handleBattleRoom();
            return;
        } else {
            addTsrLog('异兽暴起！稀有精英出现！', 'warning');
            monster = pickTsrMonsterMinTier(false, true, 'rare', floor, dm);
        }
        tsr.currentRun.currentRoom = {
            type: 'elite', name: roomName, explored: true, hasTrap: false,
            trap: null, trapDetected: false, trapDisarmed: false,
            isBoss: false, isElite: true, isShrine: false,
            rewards: generateRoomRewards('elite', dm),
            monster
        };
        if (roomName === '星瀑冲刷') {
            tsr.currentRun.currentRoom.rewards.currency = Math.floor(tsr.currentRun.currentRoom.rewards.currency * 2);
            tsr.currentRun.spiritAscendAssist = true;
        }
        handleBattleRoom({ forceElite: true });
        tsr.currentRun.spiritAscendAssist = false;
        return;
    }
    if (result === -7) {
        addTsrLog('帝皇遗训具象化！精灵帝皇残影降临！', 'warning');
        const floor = tsr.currentRun.currentFloor;
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        const boss = getTsrMonsterById('spiritemperor');
        tsr.currentRun.currentRoom = {
            type: 'elite', name: '帝皇遗训', explored: true, hasTrap: false,
            trap: null, trapDetected: false, trapDisarmed: false,
            isBoss: false, isElite: true, isShrine: false, isSpiritAscendTrial: true,
            rewards: generateRoomRewards('elite', dm),
            monster: boss || pickTsrMonsterMinTier(false, true, 'mythic', floor, dm)
        };
        tsr.currentRun.currentRoom.rewards.currency = Math.floor(tsr.currentRun.currentRoom.rewards.currency * 2.5);
        tsr.currentRun.spiritAscendAssist = true;
        handleBattleRoom({ forceElite: true });
        tsr.currentRun.spiritAscendAssist = false;
        return;
    }
    if (result === -6) {
        addTsrLog('灵域残影具象化！灵域霸主幻影降临！', 'warning');
        const floor = tsr.currentRun.currentFloor;
        const dm = tsr.currentRun.difficultyMultiplier;
        const boss = getTsrMonsterById('spiritsovereign');
        tsr.currentRun.currentRoom = {
            type: 'elite', name: '霸主残影', explored: true, hasTrap: false,
            trap: null, trapDetected: false, trapDisarmed: false,
            isBoss: false, isElite: true, isShrine: false, isSpiritBoss: true,
            rewards: generateRoomRewards('elite', dm),
            monster: boss || pickTsrMonsterMinTier(false, true, 'mythic', floor, dm)
        };
        tsr.currentRun.currentRoom.rewards.currency = Math.floor(tsr.currentRun.currentRoom.rewards.currency * 2.2);
        tsr.currentRun.spiritBossAssist = true;
        handleBattleRoom({ forceElite: true });
        tsr.currentRun.spiritBossAssist = false;
        tsr.currentRun.pendingSpiritBossEcho = false;
        return;
    }
    if (result === -1) addTsrLog('打劫失败，挨了一顿打', 'error');
    else if (result === -3) addTsrLog('秘境币不够，宝箱怪追着你跑', 'warning');
    else if (result === -4) addTsrLog('宝箱怪满意地离开了，留下一件道具', 'success');
    else if (typeof result === 'string' && result) addTsrLog(result, 'success');
    else if (result > 0) addTsrLog(`获得${result}秘境币`, 'success');
    else addTsrLog('遭遇结束', 'info');
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
    else afterAction(true);
}

function selectTsrContract(key) {
    const tsr = player.timeSecretRealm;
    if (!TSR_RUN_CONTRACTS[key]) return;
    if (key === 'spiritGuard' && !canUseTsrSpiritContract()) {
        logAction('驭灵者契约需要精灵达到5级', 'error');
        return;
    }
    if (key === 'spiritSage' && !canUseTsrSpiritSageContract()) {
        logAction('精灵学者契约需要精灵达到10级', 'error');
        return;
    }
    if (key === 'spiritHunter' && !canUseTsrSpiritHunterContract()) {
        logAction('猎灵者契约需要精灵达到8级', 'error');
        return;
    }
    if (key === 'starSpirit' && !canUseTsrStarSpiritContract()) {
        logAction('星灵契约需要精灵进化至终焉星灵', 'error');
        return;
    }
    if (key === 'affixLord' && !canUseTsrAffixLordContract()) {
        logAction('词条行者契约需要累计击败8只带词条怪物', 'error');
        return;
    }
    if (key === 'fortuneSeeker' && !canUseTsrFortuneSeekerContract()) {
        logAction('彩运契约需要转动彩运轮盘2次或访问传奇见闻馆', 'error');
        return;
    }
    if (key === 'chronoHunter' && !canUseTsrChronoHunterContract()) {
        logAction('时序猎手契约需要时光扭曲成功3次或累计冒险15次', 'error');
        return;
    }
    if (key === 'codexKeeper' && !canUseTsrCodexKeeperContract()) {
        logAction('图鉴守护者契约需要图鉴过半或访问传奇见闻馆3次', 'error');
        return;
    }
    tsr.selectedContract = key;
    document.querySelectorAll('.tsr-contract-card[data-role="primary"]').forEach(el => {
        el.classList.toggle('active', el.dataset.contract === key);
    });
    updateTsrContractHint();
}

function selectTsrSubContract(key) {
    const tsr = player.timeSecretRealm;
    if (!canUseTsrSubContract()) return;
    if (key !== 'none' && !TSR_RUN_CONTRACTS[key]) return;
    if (key === 'spiritGuard' && !canUseTsrSpiritContract()) {
        logAction('驭灵者契约需要精灵达到5级', 'error');
        return;
    }
    if (key === 'spiritSage' && !canUseTsrSpiritSageContract()) {
        logAction('精灵学者契约需要精灵达到10级', 'error');
        return;
    }
    if (key === 'spiritHunter' && !canUseTsrSpiritHunterContract()) {
        logAction('猎灵者契约需要精灵达到8级', 'error');
        return;
    }
    if (key === 'starSpirit' && !canUseTsrStarSpiritContract()) {
        logAction('星灵契约需要精灵进化至终焉星灵', 'error');
        return;
    }
    if (key === 'affixLord' && !canUseTsrAffixLordContract()) {
        logAction('词条行者契约需要累计击败8只带词条怪物', 'error');
        return;
    }
    if (key === 'fortuneSeeker' && !canUseTsrFortuneSeekerContract()) {
        logAction('彩运契约需要转动彩运轮盘2次或访问传奇见闻馆', 'error');
        return;
    }
    if (key === 'chronoHunter' && !canUseTsrChronoHunterContract()) {
        logAction('时序猎手契约需要时光扭曲成功3次或累计冒险15次', 'error');
        return;
    }
    if (key === 'codexKeeper' && !canUseTsrCodexKeeperContract()) {
        logAction('图鉴守护者契约需要图鉴过半或访问传奇见闻馆3次', 'error');
        return;
    }
    if (key === tsr.selectedContract) {
        logAction('副契约不能与主契约相同', 'error');
        return;
    }
    tsr.selectedSubContract = key || 'none';
    document.querySelectorAll('.tsr-contract-card[data-role="sub"]').forEach(el => {
        el.classList.toggle('active', el.dataset.contract === (key || 'none'));
    });
    updateTsrContractHint();
}

function canUseTsrSubContract() {
    const tsr = player.timeSecretRealm;
    return (tsr.clearCount || 0) >= 1 || tsr.achievements?.firstClear;
}

function updateTsrContractHint() {
    const tsr = player.timeSecretRealm;
    const hint = document.getElementById('tsrContractHint');
    if (!hint) return;
    const primary = TSR_RUN_CONTRACTS[tsr.selectedContract || 'none'];
    const subKey = tsr.selectedSubContract || 'none';
    const sub = subKey !== 'none' ? TSR_RUN_CONTRACTS[subKey] : null;
    const synergy = getTsrContractSynergy(tsr.selectedContract, subKey);
    let text = primary.desc;
    if (sub) text += ` ｜ 副契约：${sub.name}（50%效果）`;
    if (synergy) text += ` ｜ 羁绊【${synergy.name}】：${synergy.desc}`;
    hint.textContent = text;
}

function getTsrContractSynergy(primary, sub) {
    if (!primary || !sub || primary === 'none' || sub === 'none') return null;
    const pair = [primary, sub].sort().join('|');
    return TSR_CONTRACT_SYNERGIES.find(s => s.keys.slice().sort().join('|') === pair) || null;
}

function canUseTsrSpiritContract() {
    const sp = ensureTsrSpiritPet();
    return sp && sp.level >= 5;
}

function canUseTsrSpiritSageContract() {
    const sp = ensureTsrSpiritPet();
    return sp && sp.level >= 10;
}

function canUseTsrSpiritHunterContract() {
    const sp = ensureTsrSpiritPet();
    return sp && sp.level >= 8;
}

function canUseTsrStarSpiritContract() {
    const sp = ensureTsrSpiritPet();
    return sp && (sp.evolution || 0) >= getTsrSpiritMaxEvolution();
}

function canUseTsrAffixLordContract() {
    return (player.timeSecretRealm?.lifetimeStats?.affixKills || 0) >= 8;
}

function canUseTsrFortuneSeekerContract() {
    const ls = player.timeSecretRealm?.lifetimeStats || {};
    return (ls.fortuneWheelSpins || 0) >= 2 || (ls.legendArchiveRooms || 0) >= 1;
}

function canUseTsrChronoHunterContract() {
    const ls = player.timeSecretRealm?.lifetimeStats || {};
    return (ls.timewarpJumps || 0) >= 3 || (player.timeSecretRealm?.totalRuns || 0) >= 15;
}

function canUseTsrCodexKeeperContract() {
    const ls = player.timeSecretRealm?.lifetimeStats || {};
    return getTsrCodexDiscoverRatio() >= 0.5 || (ls.legendArchiveRooms || 0) >= 3 || (ls.chronoLibraryRooms || 0) >= 2;
}

function getTsrEventBonus() {
    const tsr = player.timeSecretRealm;
    const affix = getTsrActiveAffix();
    return getTsrRelicBonus('eventBonus')
        + (tsr?.currentRun?.eventBonusRun || 0)
        + (tsr?.currentRun?.contractMods?.eventBonus || 0)
        + (tsr?.currentRun?.starFortune?.eventBonus || 0)
        + (tsr?.currentRun?.starFortune?.eventCurrency || 0)
        + (affix?.eventBonus || 0);
}

function updateTsrSpiritContractUI() {
    const guardUnlocked = canUseTsrSpiritContract();
    const sageUnlocked = canUseTsrSpiritSageContract();
    const hunterUnlocked = canUseTsrSpiritHunterContract();
    const starUnlocked = canUseTsrStarSpiritContract();
    const affixLordUnlocked = canUseTsrAffixLordContract();
    const fortuneSeekerUnlocked = canUseTsrFortuneSeekerContract();
    const chronoHunterUnlocked = canUseTsrChronoHunterContract();
    const codexKeeperUnlocked = canUseTsrCodexKeeperContract();
    document.querySelectorAll('.tsr-contract-card[data-contract="spiritGuard"]').forEach(el => {
        el.classList.toggle('tsr-contract-locked', !guardUnlocked);
        el.disabled = !guardUnlocked;
        el.title = guardUnlocked ? '精灵充能+40%，起始-25秒，币+8%' : '精灵5级后解锁';
    });
    document.querySelectorAll('.tsr-contract-card[data-contract="spiritSage"]').forEach(el => {
        el.classList.toggle('tsr-contract-locked', !sageUnlocked);
        el.disabled = !sageUnlocked;
        el.title = sageUnlocked ? '精灵房+80%，特殊房+25%，生命-8%' : '精灵10级后解锁';
    });
    document.querySelectorAll('.tsr-contract-card[data-contract="spiritHunter"]').forEach(el => {
        el.classList.toggle('tsr-contract-locked', !hunterUnlocked);
        el.disabled = !hunterUnlocked;
        el.title = hunterUnlocked ? '精英币+18%，精灵充能+25%，起始-20秒' : '精灵8级后解锁';
    });
    document.querySelectorAll('.tsr-contract-card[data-contract="starSpirit"]').forEach(el => {
        el.classList.toggle('tsr-contract-locked', !starUnlocked);
        el.disabled = !starUnlocked;
        el.title = starUnlocked ? '充能+55%，特殊房+15%，起始-35秒' : '终焉星灵后解锁';
    });
    document.querySelectorAll('.tsr-contract-card[data-contract="affixLord"]').forEach(el => {
        el.classList.toggle('tsr-contract-locked', !affixLordUnlocked);
        el.disabled = !affixLordUnlocked;
        el.title = affixLordUnlocked ? '词条率+35%，词条赏金+12%，反击+8%' : '累计击败8只带词条怪物后解锁';
    });
    document.querySelectorAll('.tsr-contract-card[data-contract="fortuneSeeker"]').forEach(el => {
        el.classList.toggle('tsr-contract-locked', !fortuneSeekerUnlocked);
        el.disabled = !fortuneSeekerUnlocked;
        el.title = fortuneSeekerUnlocked ? '币+12%，赌局+10%，梗房×1.25' : '彩运轮盘2次或传奇见闻馆1次后解锁';
    });
    document.querySelectorAll('.tsr-contract-card[data-contract="chronoHunter"]').forEach(el => {
        el.classList.toggle('tsr-contract-locked', !chronoHunterUnlocked);
        el.disabled = !chronoHunterUnlocked;
        el.title = chronoHunterUnlocked ? '耗时-8%，每层+4秒，战斗奖励+10%' : '时光扭曲3次或冒险15次后解锁';
    });
    document.querySelectorAll('.tsr-contract-card[data-contract="codexKeeper"]').forEach(el => {
        el.classList.toggle('tsr-contract-locked', !codexKeeperUnlocked);
        el.disabled = !codexKeeperUnlocked;
        el.title = codexKeeperUnlocked ? '特殊房+35%，事件+15%' : '图鉴过半或传奇见闻馆3次后解锁';
    });
}

function mergeTsrContractMods(target, source, scale) {
    scale = scale == null ? 1 : scale;
    if (!source) return;
    Object.entries(source).forEach(([k, v]) => {
        if (k === 'memeMult' || k === 'spiritMult' || k === 'specialRoomMult') target[k] = (target[k] || 1) * (1 + (v - 1) * scale);
        else target[k] = (target[k] || 0) + v * scale;
    });
}

function applyTsrRunContract() {
    const tsr = player.timeSecretRealm;
    const primaryKey = tsr.selectedContract || 'none';
    const subKey = canUseTsrSubContract() ? (tsr.selectedSubContract || 'none') : 'none';
    const primary = TSR_RUN_CONTRACTS[primaryKey];
    tsr.currentRun.contractMods = null;
    if ((!primary || primaryKey === 'none') && subKey === 'none') return;

    tsr.currentRun.contractMods = {
        currencyMod: 0, floorTime: 0, counterPenalty: 0, gamble: 0, health: 0,
        timeCost: 0, memeMult: 1, spiritMult: 1, spiritHealBonus: 0, eventBonus: 0,
        eliteCurrencyPenalty: 0, eliteCurrencyBonus: 0, timeSave: 0, spiritRoomMult: 0, specialRoomMult: 1,
        monsterMult: 0, resonanceGain: 0, attack: 0, roomPreview: 0, affixReward: 0, affixRollBoost: 0
    };
    const mods = tsr.currentRun.contractMods;

    if (primary && primaryKey !== 'none') {
        mergeTsrContractMods(mods, {
            currencyMod: primary.currencyMod, floorTime: primary.floorTime,
            counterPenalty: primary.counterPenalty, gamble: primary.gamble,
            health: primary.health, timeCost: primary.timeCost, timeSave: primary.timeSave,
            memeMult: primary.memeMult || 1, spiritMult: primary.spiritMult || 1,
            spiritRoomMult: primary.spiritRoomMult || 0, specialRoomMult: primary.specialRoomMult || 1,
            eliteCurrencyPenalty: primary.eliteCurrencyPenalty, eliteCurrencyBonus: primary.eliteCurrencyBonus,
            affixReward: primary.affixReward, affixRollBoost: primary.affixRollBoost, eventBonus: primary.eventBonus,
            monsterMult: primary.monsterMult, resonanceGain: primary.resonanceGain, attack: primary.attack, roomPreview: primary.roomPreview
        }, 1);
        if (primary.battleReward) {
            tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + primary.battleReward;
        }
        if (primary.attack) {
            addTempBuff({ name: primary.name, effect: 'attack', value: primary.attack, duration: 0, isDebuff: false });
        }
        if (primary.roomPreview) tsr.currentRun.roomPreviewBonus = (tsr.currentRun.roomPreviewBonus || 0) + primary.roomPreview;
        if (primary.resonanceGain) tsr.currentRun.resonanceGainMult = (tsr.currentRun.resonanceGainMult || 1) + primary.resonanceGain;
        if (primary.timeMod) {
            tsr.currentRun.timeLeft += primary.timeMod;
            tsr.currentRun.initialTime += primary.timeMod;
        }
        if (primary.health) {
            addTempBuff({ name: primary.name, effect: 'health', value: primary.health, duration: 0, isDebuff: primary.health < 0 });
        }
        addTsrLog(`主契约·${primary.name}：${primary.desc}`, 'info', 'contract');
    }

    if (subKey !== 'none') {
        const sub = TSR_RUN_CONTRACTS[subKey];
        mergeTsrContractMods(mods, {
            currencyMod: sub.currencyMod, floorTime: sub.floorTime,
            counterPenalty: sub.counterPenalty, gamble: sub.gamble,
            health: sub.health, timeCost: sub.timeCost, timeSave: sub.timeSave,
            memeMult: sub.memeMult || 1, spiritMult: sub.spiritMult || 1,
            spiritRoomMult: sub.spiritRoomMult || 0, specialRoomMult: sub.specialRoomMult || 1,
            eliteCurrencyPenalty: sub.eliteCurrencyPenalty, eliteCurrencyBonus: sub.eliteCurrencyBonus,
            affixReward: sub.affixReward, affixRollBoost: sub.affixRollBoost, eventBonus: sub.eventBonus,
            monsterMult: sub.monsterMult, resonanceGain: sub.resonanceGain, attack: sub.attack, roomPreview: sub.roomPreview
        }, 0.5);
        if (sub.battleReward) {
            tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + sub.battleReward * 0.5;
        }
        if (sub.attack) {
            addTempBuff({ name: '副·' + sub.name, effect: 'attack', value: sub.attack * 0.5, duration: 0, isDebuff: false });
        }
        if (sub.roomPreview) tsr.currentRun.roomPreviewBonus = (tsr.currentRun.roomPreviewBonus || 0) + Math.floor((sub.roomPreview || 0) * 0.5);
        if (sub.resonanceGain) tsr.currentRun.resonanceGainMult = (tsr.currentRun.resonanceGainMult || 1) + sub.resonanceGain * 0.5;
        if (sub.timeMod) {
            const t = Math.floor(sub.timeMod * 0.5);
            tsr.currentRun.timeLeft += t;
            tsr.currentRun.initialTime += t;
        }
        if (sub.health) {
            addTempBuff({ name: '副·' + sub.name, effect: 'health', value: sub.health * 0.5, duration: 0, isDebuff: sub.health < 0 });
        }
        addTsrLog(`副契约·${sub.name}（50%效果）`, 'info', 'contract');
    }

    const synergy = getTsrContractSynergy(primaryKey, subKey);
    if (synergy) {
        const amp = tsr.currentRun.synergyAmp || 1;
        const bonus = amp > 1 ? Object.fromEntries(Object.entries(synergy.bonus).map(([k, v]) => {
            if (k === 'memeMult' || k === 'spiritMult' || k === 'specialRoomMult') return [k, 1 + (v - 1) * amp];
            return [k, v * amp];
        })) : synergy.bonus;
        mergeTsrContractMods(mods, bonus, 1);
        tsr.currentRun.synergyTriggered = true;
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.synergyCount = (tsr.lifetimeStats.synergyCount || 0) + 1;
        bumpTsrQuestProgress('weeklySynergy', 1);
        checkTsrAchievements();
        unlockTsrAchievement('synergy');
        addTsrLog(`契约羁绊【${synergy.name}】触发！${synergy.desc}`, 'success', 'contract');
    }
}

function unlockTsrAchievement(id) {
    if (isTsrTutorialRun()) return false;
    const tsr = player.timeSecretRealm;
    if (!tsr.achievements) tsr.achievements = {};
    if (tsr.achievements[id]) return false;
    tsr.achievements[id] = Date.now();
    const a = TSR_ACHIEVEMENTS.find(x => x.id === id);
    if (a) {
        const rewardTxt = formatTsrAchievementRewardText(getTsrAchievementRewardDef(a));
        addTsrLog(
            `🏅 成就解锁：${a.name}${rewardTxt ? `（永久 ${rewardTxt}）` : ''}`,
            'success',
            'legend'
        );
    }
    invalidateTsrUiCache(['codex', 'permBonus', 'shop']);
    return true;
}

function getTsrSpiritExpNeeded(level) {
    if (level >= TSR_SPIRIT_MAX_LEVEL) return Infinity;
    return 60 + level * 45;
}

function ensureTsrSpiritPet() {
    const tsr = player.timeSecretRealm;
    if (!tsr) return null;
    if (!tsr.spiritPet) {
        tsr.spiritPet = { level: 1, exp: 0, bond: 0, evolution: 0, feedCount: 0, totalTriggers: 0, skillPoints: 0, skills: [], milestonesClaimed: [], name: '', trialWins: 0, skillResets: 0 };
    }
    const sp = tsr.spiritPet;
    if (sp.level == null) sp.level = 1;
    if (sp.exp == null) sp.exp = 0;
    if (sp.bond == null) sp.bond = 0;
    if (sp.evolution == null) sp.evolution = 0;
    if (sp.feedCount == null) sp.feedCount = 0;
    if (sp.totalTriggers == null) sp.totalTriggers = 0;
    if (sp.skillPoints == null) sp.skillPoints = Math.max(0, sp.level - 1);
    if (!sp.skills) sp.skills = [];
    if (!sp.milestonesClaimed) sp.milestonesClaimed = [];
    if (sp.name == null) sp.name = '';
    if (sp.trialWins == null) sp.trialWins = 0;
    if (sp.skillResets == null) sp.skillResets = 0;
    sp.level = Math.min(TSR_SPIRIT_MAX_LEVEL, Math.max(1, sp.level));
    sp.bond = Math.min(TSR_SPIRIT_MAX_BOND, Math.max(0, sp.bond));
    sp.evolution = Math.min(getTsrSpiritMaxEvolution(), Math.max(0, sp.evolution));
    return sp;
}

function getTsrSpiritMaxEvolution() {
    return TSR_SPIRIT_EVOLVE_NAMES.length - 1;
}

function getTsrSpiritEvolutionMeta(evo) {
    return TSR_SPIRIT_EVOLVE_META[evo] || TSR_SPIRIT_EVOLVE_META[0];
}

function hasTsrSpiritAscensionProof() {
    const tsr = player.timeSecretRealm;
    const sp = ensureTsrSpiritPet();
    if (!tsr || !sp) return false;
    return (tsr.clearCountByDifficulty?.apocalypse || 0) >= 1
        || (tsr.lifetimeStats?.spiritBossWins || 0) >= 1
        || (tsr.lifetimeStats?.spiritAscendWins || 0) >= 1
        || (sp.skills || []).includes('apocalypseCrown');
}

function getTsrSpiritEvolveBlockReason(nextEvo) {
    const sp = ensureTsrSpiritPet();
    if (!sp) return '精灵未初始化';
    if (nextEvo > getTsrSpiritMaxEvolution()) return '已达最高进化阶';
    if ((sp.evolution || 0) >= nextEvo) return '已完成该进化';
    const needLevel = TSR_SPIRIT_EVOLVE_LEVELS[nextEvo];
    if (sp.level < needLevel) return `需要 Lv${needLevel}（当前 Lv${sp.level}）`;
    if (nextEvo === 4) {
        if ((sp.bond || 0) < 75) return `需要亲密度≥75（当前${sp.bond}）`;
        if (!hasTsrSpiritAscensionProof()) return '需要终焉条件：通关终焉/击败灵域霸主/飞升试炼胜帝皇/习得终焉灵冠（任选其一）';
    }
    return null;
}

function canEvolveTsrSpiritTo(nextEvo) {
    return !getTsrSpiritEvolveBlockReason(nextEvo);
}

function getTsrSpiritEvolutionName(evo) {
    return TSR_SPIRIT_EVOLVE_NAMES[evo] || TSR_SPIRIT_EVOLVE_NAMES[0];
}

function getTsrSpiritDisplayName() {
    const sp = ensureTsrSpiritPet();
    if (sp?.name && String(sp.name).trim()) return String(sp.name).trim();
    return getTsrSpiritEvolutionName(sp.evolution);
}

function getTsrSpiritRoomMult() {
    const contract = player.timeSecretRealm?.currentRun?.contractMods?.spiritRoomMult || 0;
    return 1 + (getTsrSpiritSkillBonuses().spiritRoomMult || 0) + contract;
}

function renameTsrSpiritPet() {
    const sp = ensureTsrSpiritPet();
    const current = getTsrSpiritDisplayName();
    const input = prompt('为你的时光精灵取名（2-8个字）', current);
    if (input == null) return;
    const name = String(input).trim();
    if (name.length < 2 || name.length > 8) {
        logAction('精灵名字需要2-8个字', 'error');
        return;
    }
    sp.name = name;
    if (!tsrSpiritRenamedBefore()) unlockTsrAchievement('spiritRename');
    logAction(`精灵现在叫【${name}】了！`, 'success');
    invalidateTsrUiCache('spirit');
    updateTsrSpiritDisplay();
    saveGame();
}

function tsrSpiritRenamedBefore() {
    return !!player.timeSecretRealm?.achievements?.spiritRename;
}

function resetTsrSpiritSkills() {
    const tsr = player.timeSecretRealm;
    const sp = ensureTsrSpiritPet();
    if (!sp.skills.length) {
        logAction('尚未学习任何灵脉技能', 'warning');
        return;
    }
    const cost = 80000;
    if (tsr.currency < cost) {
        logAction(`重置灵脉需要${cost}秘境币`, 'error');
        return;
    }
    if (!confirm(`花费${cost}秘境币重置全部灵脉技能？技能点将全部返还。`)) return;
    tsr.currency = clampTsrCurrency(tsr.currency - cost);
    sp.skills = [];
    sp.skillResets = (sp.skillResets || 0) + 1;
    logAction('灵脉已重置，技能点已返还', 'success');
    invalidateTsrUiCache(['spirit', 'shop']);
    updateTsrSpiritDisplay();
    updateTimeSecretRealmUI({ skipEnsure: true });
    saveGame();
}

function getTsrSpiritSpentSkillPoints() {
    const sp = ensureTsrSpiritPet();
    if (!sp?.skills?.length) return 0;
    return sp.skills.reduce((sum, id) => sum + (TSR_SPIRIT_SKILLS[id]?.cost || 0), 0);
}

function getTsrSpiritAvailableSkillPoints() {
    const sp = ensureTsrSpiritPet();
    return Math.max(0, (sp.skillPoints || 0) - getTsrSpiritSpentSkillPoints());
}

function getTsrSpiritSkillBonuses() {
    const sp = ensureTsrSpiritPet();
    const agg = { chargeMult: 0, healBonus: 0, timeBonus: 0, startTime: 0, currencyBonus: 0, doubleChance: 0, specialRoom: 0, bondOnTrigger: 0, allMult: 0 };
    (sp.skills || []).forEach(id => {
        const sk = TSR_SPIRIT_SKILLS[id];
        if (!sk?.effect) return;
        Object.entries(sk.effect).forEach(([k, v]) => { agg[k] = (agg[k] || 0) + v; });
    });
    return agg;
}

function canUnlockTsrSpiritSkill(skillId) {
    const sk = TSR_SPIRIT_SKILLS[skillId];
    const sp = ensureTsrSpiritPet();
    if (!sk || !sp) return false;
    if (sp.skills.includes(skillId)) return false;
    if (getTsrSpiritAvailableSkillPoints() < sk.cost) return false;
    if (sk.needEvo != null && (sp.evolution || 0) < sk.needEvo) return false;
    return (sk.need || []).every(req => sp.skills.includes(req));
}

function unlockTsrSpiritSkill(skillId) {
    if (!canUnlockTsrSpiritSkill(skillId)) {
        logAction('无法解锁该灵脉技能', 'error');
        return false;
    }
    const sp = ensureTsrSpiritPet();
    const sk = TSR_SPIRIT_SKILLS[skillId];
    sp.skills.push(skillId);
    bumpTsrQuestProgress('weeklySpiritSkills', 1);
    logAction(`解锁灵脉技能【${sk.name}】：${sk.desc}`, 'success');
    checkTsrAchievements();
    invalidateTsrUiCache('spirit');
    updateTsrSpiritDisplay();
    saveGame();
    return true;
}

function checkTsrSpiritMilestones(level) {
    const sp = ensureTsrSpiritPet();
    const tsr = player.timeSecretRealm;
    TSR_SPIRIT_LEVEL_MILESTONES.forEach(ms => {
        if (level >= ms.level && !sp.milestonesClaimed.includes(ms.level)) {
            sp.milestonesClaimed.push(ms.level);
            const added = addTsrPermanentCurrency(ms.currency);
            if (ms.skillPoints) sp.skillPoints = (sp.skillPoints || 0) + ms.skillPoints;
            addTsrLog(`精灵里程碑【${ms.label}】！+${added}秘境币${ms.skillPoints ? '，+' + ms.skillPoints + '技能点' : ''}`, 'success');
            invalidateTsrUiCache('spirit');
        }
    });
}

function addTsrSpiritExp(amount) {
    if (isTsrTutorialRun()) return 0;
    const sp = ensureTsrSpiritPet();
    if (!sp || amount <= 0) return 0;
    let added = 0;
    let remaining = amount;
    while (remaining > 0 && sp.level < TSR_SPIRIT_MAX_LEVEL) {
        const need = getTsrSpiritExpNeeded(sp.level);
        const canAdd = Math.min(remaining, need - sp.exp);
        sp.exp += canAdd;
        added += canAdd;
        remaining -= canAdd;
        if (sp.exp >= need) {
            sp.exp -= need;
            sp.level += 1;
            sp.skillPoints = (sp.skillPoints || 0) + 1;
            checkTsrSpiritMilestones(sp.level);
            addTsrLog(`时光精灵升级至 Lv${sp.level}！获得1技能点`, 'success');
            invalidateTsrUiCache('spirit');
            updateTsrSpiritContractUI();
        }
    }
    if (sp.level >= TSR_SPIRIT_MAX_LEVEL) sp.exp = 0;
    checkTsrAchievements();
    return added;
}

function addTsrSpiritBond(amount) {
    if (isTsrTutorialRun()) return 0;
    const sp = ensureTsrSpiritPet();
    if (!sp || amount <= 0) return 0;
    const before = sp.bond;
    sp.bond = Math.min(TSR_SPIRIT_MAX_BOND, sp.bond + amount);
    return sp.bond - before;
}

function getTsrSpiritBonuses() {
    const sp = ensureTsrSpiritPet() || { level: 1, bond: 0, evolution: 0 };
    const lv = sp.level || 1;
    const bond = sp.bond || 0;
    const evo = sp.evolution || 0;
    const pb = player.timeSecretRealm?.permanentBonuses || {};
    const sk = getTsrSpiritSkillBonuses();
    const runMods = player.timeSecretRealm?.currentRun?.contractMods || {};
    const chargeAmp = pb.spiritChargeAmp || 0;
    const healAmp = pb.spiritHealAmp || 0;
    const allMult = 1 + (sk.allMult || 0);
    // 等级/亲密度软顶放宽；天赋充能% 与永久充能放大器叠加
    const growthCharge = Math.min(0.72, lv * 0.022 + bond * 0.0018);
    let chargeMult = 1 + growthCharge + chargeAmp + (sk.chargeMult || 0);
    let healRate = 0.22 + (lv >= 3 ? 0.03 : 0) + (lv >= 25 ? 0.06 : 0) + healAmp + bond * 0.0009 + (sk.healBonus || 0) + (runMods.spiritHealBonus || 0);
    const affixHeal = getTsrActiveAffix()?.spiritHealBonus || 0;
    healRate += affixHeal;
    healRate += player.timeSecretRealm?.currentRun?.weeklyBonus?.spiritHealBonus || 0;
    healRate += player.timeSecretRealm?.currentRun?.starFortune?.spiritHealBonus || 0;
    let timeBonus = 18 + (lv >= 5 ? 5 : 0) + (lv >= 25 ? 5 : 0) + evo * 3 + (sk.timeBonus || 0);
    let startTime = (lv >= 8 ? 10 : 0) + evo * 5 + (sk.startTime || 0);
    let currencyBonus = (lv >= 15 ? 0.03 : 0) + bond * 0.0004 + (sk.currencyBonus || 0);
    let doubleChance = (lv >= 20 ? 0.12 : 0) + (evo >= 2 ? 0.08 : 0) + (evo >= 4 ? 0.1 : 0) + (sk.doubleChance || 0) + getTsrRelicBonus('spiritDouble');
    let specialRoomBonus = (lv >= 10 ? 0.02 : 0) + (sk.specialRoom || 0) + (evo >= 4 ? 0.04 : 0);
    if (evo >= 4) specialRoomBonus += getTsrPermanentStarDomainSigil();
    if (evo >= 4) {
        healRate += 0.05;
        chargeMult += 0.08;
    }
    if (allMult > 1) {
        chargeMult = 1 + (chargeMult - 1) * allMult;
        healRate *= allMult;
        timeBonus = Math.floor(timeBonus * allMult);
        startTime = Math.floor(startTime * allMult);
        currencyBonus *= allMult;
        doubleChance = Math.min(0.45, doubleChance * allMult);
        specialRoomBonus *= allMult;
    }
    return {
        chargeMult,
        healRate,
        timeBonus,
        startTime,
        currencyBonus,
        doubleChance,
        specialRoomBonus,
        bondOnTrigger: sk.bondOnTrigger || 0
    };
}

function triggerTsrSpiritEffect() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    const bonuses = getTsrSpiritBonuses();
    tsrHealPlayer(bonuses.healRate);
    tsr.currentRun.timeLeft += bonuses.timeBonus;
    const combat = getTsrSpiritCombatBonuses();
    addTempBuff({
        name: '精灵觉醒',
        effect: 'attack',
        value: combat.attackBonus,
        duration: 3,
        isDebuff: false
    });
    const sp = ensureTsrSpiritPet();
    if (sp) {
        sp.totalTriggers = (sp.totalTriggers || 0) + 1;
        addTsrSpiritBond(2 + (bonuses.bondOnTrigger || 0) + (tsr.currentRun?.weeklyBonus?.bondOnTrigger || 0) + (tsr.currentRun?.starFortune?.bondOnTrigger || 0));
        const sk = getTsrSpiritSkillBonuses();
        addTsrSpiritExp(8 + Math.floor(sp.level / 2) + (sk.triggerExpBonus || 0));
    }
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.spiritTriggers = (tsr.lifetimeStats.spiritTriggers || 0) + 1;
    bumpTsrQuestProgress('runSpiritTriggers', 1);
    bumpTsrQuestProgress('weeklySpiritTriggers', 1);
    addTsrLog(`时光精灵苏醒！恢复${(bonuses.healRate * 100).toFixed(0)}%生命、+${bonuses.timeBonus}秒、攻击+${(combat.attackBonus * 100).toFixed(0)}%×3`, 'success');
    if (Math.random() < bonuses.doubleChance) {
        tsrHealPlayer(bonuses.healRate * 0.5);
        tsr.currentRun.timeLeft += Math.floor(bonuses.timeBonus * 0.5);
        addTsrLog('精灵共鸣！额外触发半次效果', 'success');
    }
    checkTsrAchievements();
    invalidateTsrUiCache('spirit');
}

function chargeTsrSpirit(amount) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    const affix = getTsrActiveAffix();
    if (affix?.spiritMult) amount = Math.floor(amount * affix.spiritMult);
    const weeklySpirit = getTsrWeeklySpiritMult();
    if (weeklySpirit > 1) amount = Math.floor(amount * weeklySpirit);
    const starSpirit = getTsrStarFortuneSpiritMult();
    if (starSpirit > 1) amount = Math.floor(amount * starSpirit);
    const mods = tsr.currentRun.contractMods;
    if (mods?.spiritMult) amount = Math.floor(amount * mods.spiritMult);
    amount = Math.floor(amount * getTsrSpiritBonuses().chargeMult * (1 + getTsrRelicBonus('spiritCharge')));
    tsr.currentRun.spiritCharge = Math.min(100, (tsr.currentRun.spiritCharge || 0) + amount);
    if (tsr.currentRun.spiritCharge >= 100) {
        tsr.currentRun.spiritCharge = 0;
        triggerTsrSpiritEffect();
    }
}

function applyTsrSpiritAscendTrialVictory() {
    const tsr = player.timeSecretRealm;
    const sp = ensureTsrSpiritPet();
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.spiritAscendWins = (tsr.lifetimeStats.spiritAscendWins || 0) + 1;
    addTsrSpiritExp(Math.floor((240 + sp.level * 15) * getTsrSpiritRoomMult()));
    addTsrSpiritBond(15);
    chargeTsrSpirit(65);
    sp.skillPoints = (sp.skillPoints || 0) + 1;
    addTsrLog('🌌 精灵帝皇认可！飞升证明已获得，+1技能点', 'success');
    tryGrantTsrExclusiveRelic('emperorSigil', 0.42, '精灵帝皇');
    if (canEvolveTsrSpiritTo(4)) {
        addTsrLog('终焉条件已满足，可在飞升台觉醒终焉星灵', 'info');
    }
    checkTsrAchievements();
    invalidateTsrUiCache('spirit');
}

function applyTsrStarBossVictory() {
    const tsr = player.timeSecretRealm;
    const sp = ensureTsrSpiritPet();
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.starBossWins = (tsr.lifetimeStats.starBossWins || 0) + 1;
    bumpTsrEngagement('dailyStarBoss', 1);
    addTsrSpiritExp(Math.floor((220 + sp.level * 15) * getTsrSpiritRoomMult()));
    addTsrSpiritBond(15);
    chargeTsrSpirit(55);
    if (Math.random() < 0.4 + sp.level * 0.008) {
        sp.skillPoints = (sp.skillPoints || 0) + 1;
        addTsrLog('星域认主！+1技能点', 'success');
    }
    addTsrLog('💫 终焉星域主宰被击败！星灵威仪登顶', 'success');
    if (!tsr.currentRun.throneClearThisRun) {
        tryGrantTsrExclusiveRelic('archonCrown', 0.18, '星域主宰');
    }
    checkTsrAchievements();
    invalidateTsrUiCache('spirit');
}

function applyTsrTyrantVictory(fromExtreme) {
    const tsr = player.timeSecretRealm;
    const sp = ensureTsrSpiritPet();
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.tyrantKills = (tsr.lifetimeStats.tyrantKills || 0) + 1;
    tsr.currentRun.tyrantKillThisRun = true;
    bumpTsrEngagement('dailyTyrant', 1);
    bumpTsrQuestProgress('weeklyTyrantKills', 1);
    addTsrSpiritExp(Math.floor((280 + sp.level * 18) * getTsrSpiritRoomMult()));
    addTsrSpiritBond(18);
    chargeTsrSpirit(70);
    if (fromExtreme) {
        tsr.lifetimeStats.throneExtremeClears = (tsr.lifetimeStats.throneExtremeClears || 0) + 1;
        tsr.currentRun.throneExtremeThisRun = true;
        addTsrLog('👑 王座极境通关！天穹暴君陨落', 'success');
    } else {
        addTsrLog('🌠 天穹暴君被裁决！星域为之震颤', 'success');
    }
    if (Math.random() < 0.45 + sp.level * 0.008) {
        sp.skillPoints = (sp.skillPoints || 0) + 1;
        addTsrLog('暴君核心共鸣！+1技能点', 'success');
    }
    tryGrantTsrExclusiveRelic('tyrantSeal', fromExtreme ? 0.65 : 0.22, '天穹暴君');
    checkTsrAchievements();
    invalidateTsrUiCache('spirit');
}

function applyTsrSpiritBossVictory() {
    const tsr = player.timeSecretRealm;
    const sp = ensureTsrSpiritPet();
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.spiritBossWins = (tsr.lifetimeStats.spiritBossWins || 0) + 1;
    addTsrSpiritExp(Math.floor((180 + sp.level * 12) * getTsrSpiritRoomMult()));
    addTsrSpiritBond(12);
    chargeTsrSpirit(50);
    if (Math.random() < 0.35 + sp.level * 0.01) {
        sp.skillPoints = (sp.skillPoints || 0) + 1;
        addTsrLog('灵域认可！+1技能点', 'success');
    }
    addTsrLog('👑 灵域霸主被击败！羁绊登顶灵脉', 'success');
    checkTsrAchievements();
    invalidateTsrUiCache('spirit');
}

function applyTsrSpiritTrialVictory() {
    const tsr = player.timeSecretRealm;
    const sp = ensureTsrSpiritPet();
    sp.trialWins = (sp.trialWins || 0) + 1;
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.spiritTrials = (tsr.lifetimeStats.spiritTrials || 0) + 1;
    addTsrSpiritExp(Math.floor((100 + sp.level * 8) * getTsrSpiritRoomMult()));
    addTsrSpiritBond(8);
    bumpTsrQuestProgress('runSpiritTrials', 1);
    bumpTsrQuestProgress('weeklySpiritTrials', 1);
    chargeTsrSpirit(35);
    if (Math.random() < 0.25 + sp.level * 0.01) {
        sp.skillPoints = (sp.skillPoints || 0) + 1;
        addTsrLog('试炼开悟！+1技能点', 'success');
    }
    const winLine = TSR_SPIRIT_TRIAL_LINES.win[Math.floor(Math.random() * TSR_SPIRIT_TRIAL_LINES.win.length)];
    addTsrLog(`⚔️ ${winLine}`, 'success');
    checkTsrAchievements();
    invalidateTsrUiCache('spirit');
}

function feedTsrSpiritWithCurrency() {
    const tsr = player.timeSecretRealm;
    const cost = 25000;
    if (!tsr || tsr.currency < cost) {
        logAction(`喂养需要${cost}秘境币`, 'error');
        return;
    }
    tsr.currency = clampTsrCurrency(tsr.currency - cost);
    const sp = ensureTsrSpiritPet();
    sp.feedCount = (sp.feedCount || 0) + 1;
    addTsrSpiritExp(55 + Math.floor(sp.level * 1.5));
    addTsrSpiritBond(3);
    bumpTsrQuestProgress('spiritFeed', 1);
    logAction('喂养时光精灵成功！获得经验与亲密度', 'success');
    invalidateTsrUiCache(['shop', 'spirit']);
    updateTsrSpiritDisplay();
    updateTimeSecretRealmUI({ skipEnsure: true });
    saveGame();
}

function evolveTsrSpirit() {
    const sp = ensureTsrSpiritPet();
    const nextEvo = (sp.evolution || 0) + 1;
    const block = getTsrSpiritEvolveBlockReason(nextEvo);
    if (block) {
        logAction(`无法进化：${block}`, 'error');
        return false;
    }
    sp.evolution = nextEvo;
    addTsrSpiritBond(nextEvo === 4 ? 15 : 10);
    sp.skillPoints = (sp.skillPoints || 0) + (nextEvo === 4 ? 3 : 0);
    const meta = getTsrSpiritEvolutionMeta(nextEvo);
    logAction(`精灵进化至【${getTsrSpiritEvolutionName(nextEvo)}】！${meta.desc}${nextEvo === 4 ? '，+3技能点' : ''}`, 'success');
    invalidateTsrUiCache('spirit');
    updateTsrSpiritDisplay();
    checkTsrAchievements();
    saveGame();
    return true;
}

function updateTsrSpiritDisplay() {
    const container = document.getElementById('tsrSpiritContent');
    if (!container) return;
    const sp = ensureTsrSpiritPet();
    const bonuses = getTsrSpiritBonuses();
    const need = getTsrSpiritExpNeeded(sp.level);
    const pct = sp.level >= TSR_SPIRIT_MAX_LEVEL ? 100 : Math.floor((sp.exp / need) * 100);
    const evoName = getTsrSpiritEvolutionName(sp.evolution);
    const evoMeta = getTsrSpiritEvolutionMeta(sp.evolution);
    const maxEvo = getTsrSpiritMaxEvolution();
    const nextEvo = sp.evolution < maxEvo ? sp.evolution + 1 : null;
    const nextEvoLevel = nextEvo != null ? TSR_SPIRIT_EVOLVE_LEVELS[nextEvo] : null;
    const evolveBlock = nextEvo != null ? getTsrSpiritEvolveBlockReason(nextEvo) : null;
    const perks = [];
    perks.push(evoMeta.desc);
    if (sp.level >= 3) perks.push(`触发回血 ${(bonuses.healRate * 100).toFixed(0)}%`);
    if (sp.level >= 5) perks.push(`触发加时 +${bonuses.timeBonus}秒`);
    if (sp.level >= 8) perks.push(`开局 +${bonuses.startTime}秒`);
    if (sp.level >= 10) perks.push('特殊房间率提升');
    if (sp.level >= 15) perks.push(`局内币收益 +${(bonuses.currencyBonus * 100).toFixed(0)}%`);
    if (sp.level >= 20) perks.push(`共鸣概率 ${(bonuses.doubleChance * 100).toFixed(0)}%`);
    if (sp.level >= 35) perks.push('可进入终焉飞升台');
    if (sp.evolution >= 4) perks.push('终焉星灵：特殊房+4%，充能/回血强化');
    if ((sp.skills || []).includes('starDominion')) perks.push('星域统御：终焉星域收益+35%');
    if ((sp.skills || []).includes('apocalypsePulse')) perks.push('终焉脉冲：灵击间隔缩短至2回合');
    if (getTsrPermanentStarSpiritStrike() > 0) perks.push(`星灵王冠：灵击+${(getTsrPermanentStarSpiritStrike() * 100).toFixed(0)}%`);
    const availSp = getTsrSpiritAvailableSkillPoints();
    const skillHtml = Object.values(TSR_SPIRIT_SKILLS).map(sk => {
        const owned = sp.skills.includes(sk.id);
        const canUnlock = canUnlockTsrSpiritSkill(sk.id);
        const needText = (sk.need || []).length ? `需: ${sk.need.map(n => TSR_SPIRIT_SKILLS[n]?.name || n).join('、')}` : '';
        const evoNeed = sk.needEvo != null ? `需进化: ${getTsrSpiritEvolutionName(sk.needEvo)}` : '';
        return `<div class="tsr-spirit-skill ${owned ? 'owned' : ''} ${canUnlock ? 'can-unlock' : ''}">
            <span class="tsr-spirit-skill-icon">${sk.icon}</span>
            <div class="tsr-spirit-skill-body">
                <strong>${sk.name}</strong> <span class="tsr-spirit-skill-cost">${sk.cost}点</span>
                <div class="tsr-spirit-skill-desc">${sk.desc}</div>
                ${needText ? `<div class="tsr-spirit-skill-need">${needText}</div>` : ''}
                ${evoNeed ? `<div class="tsr-spirit-skill-need">${evoNeed}</div>` : ''}
            </div>
            ${owned ? '<span class="tsr-spirit-skill-badge">已学</span>' : `<button type="button" class="tsr-btn tsr-btn-sm tsr-btn-purple" onclick="unlockTsrSpiritSkill('${sk.id}')" ${canUnlock ? '' : 'disabled'}>领悟</button>`}
        </div>`;
    }).join('');
    const milestoneHtml = TSR_SPIRIT_LEVEL_MILESTONES.map(ms => {
        const done = sp.milestonesClaimed.includes(ms.level);
        const reached = sp.level >= ms.level;
        return `<span class="tsr-spirit-milestone ${done ? 'claimed' : reached ? 'ready' : ''}">Lv${ms.level} ${ms.label}</span>`;
    }).join('');
    const displayName = getTsrSpiritDisplayName();
    container.innerHTML = `
        <div class="tsr-spirit-hero">
            <div class="tsr-spirit-avatar ${evoMeta.tagClass}">${evoMeta.icon}</div>
            <div class="tsr-spirit-info">
                <h4>${displayName} <span class="tsr-spirit-lv">Lv.${sp.level}</span> <span class="tsr-spirit-evo-tag ${evoMeta.tagClass}">${evoName}</span></h4>
                <p class="tsr-spirit-tagline">技能点 ${availSp} / ${sp.skillPoints || 0} · 已学 ${sp.skills.length}/${Object.keys(TSR_SPIRIT_SKILLS).length} 项灵脉 · 试炼胜${sp.trialWins || 0} · 进化 ${sp.evolution}/${maxEvo}</p>
            </div>
        </div>
        <div class="tsr-spirit-milestones">${milestoneHtml}</div>
        <div class="tsr-spirit-bars">
            <div class="tsr-spirit-bar-row">
                <label>经验</label>
                <div class="tsr-progress-track"><div class="tsr-progress-fill" style="width:${pct}%;"></div></div>
                <span>${sp.level >= TSR_SPIRIT_MAX_LEVEL ? 'MAX' : `${sp.exp}/${need}`}</span>
            </div>
            <div class="tsr-spirit-bar-row">
                <label>亲密度</label>
                <div class="tsr-progress-track tsr-bond-track"><div class="tsr-progress-fill tsr-bond-fill" style="width:${sp.bond}%;"></div></div>
                <span>${sp.bond}/${TSR_SPIRIT_MAX_BOND}</span>
            </div>
        </div>
        <div class="tsr-spirit-stats">
            <div class="tsr-chip"><span class="tsr-chip-label">充能效率</span><span class="tsr-chip-value">×${bonuses.chargeMult.toFixed(2)}</span></div>
            <div class="tsr-chip"><span class="tsr-chip-label">累计触发</span><span class="tsr-chip-value">${sp.totalTriggers || 0}</span></div>
            <div class="tsr-chip"><span class="tsr-chip-label">喂养次数</span><span class="tsr-chip-value">${sp.feedCount || 0}</span></div>
        </div>
        ${perks.length ? `<div class="tsr-spirit-perks"><div class="tsr-block-title">等级被动</div><ul>${perks.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
        <div class="tsr-spirit-skills-wrap">
            <div class="tsr-block-title">灵脉技能树 <span class="tsr-block-sub">升级获技能点，永久生效</span></div>
            <div class="tsr-spirit-skills">${skillHtml}</div>
        </div>
        <div class="tsr-spirit-actions">
            <button type="button" class="tsr-btn tsr-btn-gold" onclick="feedTsrSpiritWithCurrency()">🍼 喂养精灵（25000币）</button>
            <button type="button" class="tsr-btn tsr-btn-safe" onclick="renameTsrSpiritPet()">🏷️ 精灵改名</button>
            <button type="button" class="tsr-btn tsr-btn-ghost" onclick="resetTsrSpiritSkills()" ${sp.skills.length ? '' : 'disabled'}>🔄 重置灵脉（80000币）</button>
            ${nextEvo != null ? `<button type="button" class="tsr-btn tsr-btn-purple" onclick="evolveTsrSpirit()" ${evolveBlock ? 'disabled title="' + evolveBlock + '"' : ''}>🔮 进化至${getTsrSpiritEvolutionName(nextEvo)}（需Lv${nextEvoLevel}${nextEvo === 4 ? '·羁绊75·终焉条件' : ''}）</button>` : '<span class="tsr-spirit-max-evo">✨ 已达终焉星灵</span>'}
            ${nextEvo === 4 && evolveBlock ? `<p class="tsr-spirit-evolve-hint">${evolveBlock}</p>` : ''}
            <button type="button" class="tsr-btn tsr-btn-ghost" onclick="switchTsrLobbyTab('shop');openTsrShop();switchTsrShopTab('spirit')">🏪 精灵商店</button>
        </div>
    `;
}

function switchTsrShopTab(tabId) {
    _tsrShopActiveTab = tabId || 'all';
    document.querySelectorAll('.tsr-shop-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.shopTab === _tsrShopActiveTab);
    });
    _tsrUiCache.shop = '';
    updateTsrShop();
}

function checkTsrAchievements(runContext) {
    if (isTsrTutorialRun()) return;
    const tsr = player.timeSecretRealm;
    if (!tsr.achievements) tsr.achievements = {};
    const ls = tsr.lifetimeStats || {};
    const ctx = runContext || {};
    const unlock = (id) => unlockTsrAchievement(id);
    if (tsr.clearCount >= 1) unlock('firstClear');
    if ((tsr.clearCountByDifficulty?.hell || 0) >= 1) unlock('hellClear');
    if ((tsr.clearCountByDifficulty?.abyss || 0) >= 1) unlock('abyssClear');
    if ((tsr.clearCountByDifficulty?.eternal || 0) >= 1) unlock('eternalClear');
    if ((tsr.clearCountByDifficulty?.transcendent || 0) >= 1) unlock('transcendentClear');
    if ((tsr.clearCountByDifficulty?.apocalypse || 0) >= 1) unlock('apocalypseClear');
    if ((tsr.clearCountByDifficulty?.void || 0) >= 1) unlock('voidClear');
    if ((tsr.clearCountByDifficulty?.omega || 0) >= 1) unlock('omegaClear');
    if ((tsr.clearCountByDifficulty?.singularity || 0) >= 1) unlock('singularityClear');
    if ((ls.fateCardClears || 0) >= 10) unlock('fateCardWin');
    if ((tsr.currentRun?.resonanceBursts || 0) >= 5 || (ls.maxResonanceBursts || 0) >= 5) unlock('voidResonanceBurst5');
    if ((ls.doomClockRooms || 0) >= 3) unlock('doomClockRoom3');
    if ((ls.chromaticShrineRooms || 0) >= 5) unlock('chromaticShrine5');
    if ((ls.memeRooms || 0) >= 5) unlock('meme5');
    if ((ls.memeRooms || 0) >= 20) unlock('meme20');
    if ((ls.spiritTriggers || 0) >= 5) unlock('spirit5');
    const sp = ensureTsrSpiritPet();
    if (sp && sp.level >= 15) unlock('spirit15');
    if (sp && sp.level >= TSR_SPIRIT_MAX_LEVEL && sp.evolution >= getTsrSpiritMaxEvolution()) unlock('spiritMax');
    if (sp && sp.evolution >= 4) unlock('spiritEvo4');
    if (sp && (sp.skills || []).includes('starOrigin')) unlock('spiritStarOrigin');
    if (sp && (sp.skills || []).includes('starJudgment')) unlock('starJudgmentMaster');
    if (sp && (sp.skills || []).includes('starAffixBreak')) unlock('starAffixBreakLearn');
    if (sp && (sp.skills || []).includes('codexPath')) unlock('codexPathLearn');
    if ((ls.spiritAscendWins || 0) >= 1) unlock('spiritAscend1');
    if ((ls.starBossWins || 0) >= 1) unlock('starBoss1');
    if ((ls.starBossWins || 0) >= 3) unlock('starBoss3');
    if ((ls.throneClears || 0) >= 1) unlock('throneClear1');
    if ((ls.throneClears || 0) >= 5) unlock('throneClear5');
    if ((tsr.currentRun?.relics || []).includes('archonCrown') || tsr.codex?.relics?.archonCrown) unlock('archonRelic');
    if ((tsr.currentRun?.relics || []).includes('emperorSigil') || tsr.codex?.relics?.emperorSigil) unlock('emperorRelic');
    if ((ls.starfallRooms || 0) >= 5) unlock('starfallVisit');
    if (ls.celestialVaultWin) unlock('celestialVaultWin');
    if ((ls.spiritDuelWins || 0) >= 3) unlock('spiritDuelMaster');
    if ((ls.timewarpJumps || 0) >= 3) unlock('timewarpMaster');
    if ((ls.tyrantKills || 0) >= 1) unlock('tyrantBoss1');
    if ((ls.throneExtremeClears || 0) >= 1) unlock('throneExtreme1');
    if ((tsr.currentRun?.relics || []).includes('tyrantSeal') || tsr.codex?.relics?.tyrantSeal) unlock('tyrantRelic');
    if ((ls.paradeRooms || 0) >= 3) unlock('paradeVisit');
    if ((ls.affixKills || 0) >= 5) unlock('affixKill5');
    if ((ls.dualAffixKills || 0) >= 1) unlock('affixDual1');
    if (Object.keys(tsr.codex?.monsterAffixes || {}).length >= 8) unlock('affixCodex8');
    if ((ls.affixKills || 0) >= 20) unlock('affixKill20');
    const affixCodexTotal = Object.keys(TSR_MONSTER_AFFIXES).filter(k => (TSR_MONSTER_AFFIXES[k].weight || 0) > 0 || TSR_MONSTER_AFFIXES[k].exclusiveMonster).length;
    if (Object.keys(tsr.codex?.monsterAffixes || {}).length >= affixCodexTotal) unlock('affixCodexFull');
    if ((ls.championClears || 0) >= 1) unlock('championHall1');
    if ((ls.synergyShrineRooms || 0) >= 3) unlock('synergyShrine3');
    if (ctx?.affixLordClear) unlock('affixLordClear');
    if (ctx?.fortuneSeekerClear) unlock('fortuneSeekerClear');
    if (ctx?.chronoHunterClear) unlock('chronoHunterClear');
    if (ctx?.codexKeeperClear) unlock('codexKeeperClear');
    if ((ls.legendArchiveRooms || 0) >= 5) unlock('legendArchive5');
    if ((ls.chronoLibraryRooms || 0) >= 5) unlock('chronoLibrary5');
    if ((ls.starWishRooms || 0) >= 3) unlock('starWish3');
    if ((ls.mirrorMazeWins || 0) >= 1) unlock('mirrorMaze1');
    if ((ls.runeScribeRooms || 0) >= 1) unlock('runeScribe1');
    if ((ls.timeLoomRooms || 0) >= 3) unlock('timeLoom3');
    if ((ls.hotfixWins || 0) >= 3) unlock('hotfixWin3');
    if ((ls.battleTactics || 0) >= 3) unlock('battleTactic3');
    if ((ls.comboStormStorm || 0) >= 1) unlock('comboStorm1');
    if ((ls.battleRiftDuels || 0) >= 3) unlock('battleRift3');
    if ((ls.battleMidEvents || 0) >= 5) unlock('midEvent5');
    if ((ls.bloodArenaWins || 0) >= 1) unlock('bloodArena1');
    if (sp && (sp.skills || []).includes('libraryPath')) unlock('libraryPathLearn');
    if ((ls.starFortuneClears || 0) >= 7) unlock('starFortune7');
    if ((ls.voidriftDives || 0) >= 3) unlock('voidriftSurvive');
    if (sp && ['starOrigin', 'starVeil', 'apocalypsePulse', 'starDominion'].every(id => (sp.skills || []).includes(id))) unlock('starBranchMaster');
    if ((ls.spiritTriggers || 0) >= 30) unlock('spirit30');
    if (sp && sp.bond >= TSR_SPIRIT_MAX_BOND) unlock('spiritBondMax');
    if (sp && (sp.skills || []).length >= 5) unlock('spiritSkill5');
    if (sp && (sp.skills || []).length >= Object.keys(TSR_SPIRIT_SKILLS).length) unlock('spiritMaster');
    if ((sp?.trialWins || 0) >= 3) unlock('spiritTrial3');
    if ((ls.spiritBossWins || 0) >= 1) unlock('spiritBoss1');
    if ((ls.spiritBossWins || 0) >= 3) unlock('spiritBoss3');
    if ((ls.mythicKills || 0) >= 10) unlock('mythic10');
    if (ctx.spiritSageClear) unlock('spiritSageClear');
    if (ctx.spiritHunterClear) unlock('spiritHunterClear');
    if (ctx.starSpiritContractClear) unlock('starSpiritClear');
    if (getTsrCodexDiscoverRatio() >= 1) unlock('codexFull');
    if (tsr.currency >= 500000) unlock('rich');
    if (ctx.cleared && (ctx.runRelics || 0) >= getTsrRelicMax()) unlock('relicFull');
    if (ctx.cleared && ctx.runEquipFull) unlock('equipFull');
    if (ctx.cleared && ctx.runEquipSet4) unlock('equipSet4');
    if (ctx.runEquipEnhance5) unlock('equipEnhance5');
    if (ctx.cleared && ctx.runEquipLegendary4) unlock('equipLegendary4');
    if ((ctx.runEquipReforgeCount || 0) >= 8) unlock('equipReforge8');
    if (ctx.cleared && ctx.noRest) unlock('noRest');
    if (ctx.spiritContractClear) unlock('spiritContract');
    if ((ctx.maxBattleStreak || 0) >= 10) unlock('streak10');
    if (getTsrCodexDiscoverRatio() >= 0.5) unlock('codexHalf');
    if (ls.pddWins >= 1) unlock('pddWin');
}

function updateTsrAchievementsDisplay() {
    const container = document.getElementById('tsrAchievementsContent');
    if (!container) return;
    const tsr = player.timeSecretRealm;
    const unlocked = tsr.achievements || {};
    const total = getTsrAchievementCombatBonuses();
    const totalTxt = formatTsrAchievementRewardText(total);
    const summary = totalTxt
        ? `<div class="tsr-achieve-summary">当前成就永久加成：${totalTxt}（上限 攻/血 ${Math.round(TSR_ACHIEVEMENT_ATK_MAX * 100)}% · 防 ${Math.round(TSR_ACHIEVEMENT_DEF_MAX * 100)}%）</div>`
        : '<div class="tsr-achieve-summary">解锁成就可永久提升秘境内攻击、生命与防御（反击减伤）</div>';
    container.innerHTML = summary + TSR_ACHIEVEMENTS.map(a => {
        const done = !!unlocked[a.id];
        const rewardTxt = formatTsrAchievementRewardText(getTsrAchievementRewardDef(a));
        return `<div class="tsr-achieve-item ${done ? 'unlocked' : 'locked'}">
            <span class="tsr-achieve-icon">${a.icon}</span>
            <div>
                <strong>${a.name}</strong>
                <div class="tsr-achieve-desc">${a.desc}</div>
                ${rewardTxt ? `<div class="tsr-achieve-reward">永久 ${rewardTxt}</div>` : ''}
            </div>
            <span class="tsr-achieve-status">${done ? '已达成' : '未达成'}</span>
        </div>`;
    }).join('');
}

function getTsrDateKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getTsrWeekKey() {
    const d = new Date();
    const onejan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${week}`;
}

function pickTsrQuestIds(pool, count) {
    const shuffled = pool.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(q => q.id);
}

function ensureTsrQuests() {
    const tsr = player.timeSecretRealm;
    if (!tsr.quests) tsr.quests = { dailyIds: [], weeklyIds: [], dailyProg: {}, weeklyProg: {}, dailyClaimed: [], weeklyClaimed: [] };
    const q = tsr.quests;
    const today = getTsrDateKey();
    const week = getTsrWeekKey();
    if (q.dailyDate !== today) {
        q.dailyDate = today;
        q.dailyIds = pickTsrQuestIds(TSR_QUEST_POOL.daily, 3);
        q.dailyProg = {};
        q.dailyClaimed = [];
    }
    if (q.weeklyKey !== week) {
        q.weeklyKey = week;
        q.weeklyIds = pickTsrQuestIds(TSR_QUEST_POOL.weekly, 2);
        q.weeklyProg = {};
        q.weeklyClaimed = [];
    }
}

function bumpTsrQuestProgress(track, amount) {
    if (isTsrTutorialRun()) return;
    amount = amount || 1;
    const tsr = player.timeSecretRealm;
    ensureTsrQuests();
    const q = tsr.quests;
    const bump = (ids, prog, pool) => {
        ids.forEach(id => {
            const def = pool.find(x => x.id === id);
            if (def && def.track === track) {
                prog[id] = Math.min(def.target, (prog[id] || 0) + amount);
            }
        });
    };
    bump(q.dailyIds, q.dailyProg, TSR_QUEST_POOL.daily);
    bump(q.weeklyIds, q.weeklyProg, TSR_QUEST_POOL.weekly);
    bumpTsrEngagement(track, amount);
}

function syncTsrRunQuestFloor() {
    if (isTsrTutorialRun()) return;
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    const floor = tsr.currentRun.currentFloor;
    ensureTsrQuests();
    TSR_QUEST_POOL.daily.filter(x => x.track === 'runFloor').forEach(def => {
        if (tsr.quests.dailyIds.includes(def.id)) {
            tsr.quests.dailyProg[def.id] = Math.max(tsr.quests.dailyProg[def.id] || 0, Math.min(def.target, floor));
        }
    });
    syncTsrEngagementFloor(floor);
}

function getTsrQuestReward(def, type) {
    if (type === 'daily') {
        // 约 1000～1600
        return { currency: 1000 + def.target * 120 };
    }
    // 周常约 1800～3000
    return { currency: Math.min(3000, 1800 + def.target * 150), keys: def.target >= 3 ? 1 : 0 };
}

function claimTsrQuest(type, questId) {
    const tsr = player.timeSecretRealm;
    ensureTsrQuests();
    const q = tsr.quests;
    const pool = TSR_QUEST_POOL[type];
    const def = pool.find(x => x.id === questId);
    if (!def) return;
    const ids = type === 'daily' ? q.dailyIds : q.weeklyIds;
    const prog = type === 'daily' ? q.dailyProg : q.weeklyProg;
    const claimed = type === 'daily' ? q.dailyClaimed : q.weeklyClaimed;
    if (!ids.includes(questId)) return;
    if (claimed.includes(questId)) { logAction('该任务奖励已领取', 'warning'); return; }
    if ((prog[questId] || 0) < def.target) { logAction('任务尚未完成', 'warning'); return; }
    const reward = getTsrQuestReward(def, type);
    const added = addTsrPermanentCurrency(reward.currency);
    if (reward.keys) player.items.fuben2 = (player.items.fuben2 || 0) + reward.keys;
    claimed.push(questId);
    if (type === 'weekly') unlockTsrAchievement('questWeek');
    logAction(`领取${type === 'daily' ? '日常' : '周常'}【${def.name}】：+${added}秘境币${reward.keys ? '，+' + reward.keys + '钥匙' : ''}`, 'success');
    updateTsrQuestsDisplay();
    updateTimeSecretRealmUI({ skipEnsure: true });
    saveGame();
}

function getTsrWeeklyModifier() {
    ensureTsrEngagement();
    const id = player.timeSecretRealm.engagement.weeklyModId;
    return TSR_WEEKLY_MODIFIERS.find(m => m.id === id) || TSR_WEEKLY_MODIFIERS[0];
}

function applyTsrWeeklyModifier() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    ensureTsrEngagement();
    const modId = tsr.engagement.weeklyModId;
    const effects = TSR_WEEKLY_MODIFIER_EFFECTS[modId];
    const meta = getTsrWeeklyModifier();
    if (!effects) return;
    tsr.currentRun.weeklyBonus = { ...effects };
    if (effects.affixRollBoost) {
        tsr.currentRun.affixRollBoost = (tsr.currentRun.affixRollBoost || 0) + effects.affixRollBoost;
    }
    if (effects.affixReward) {
        tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + effects.affixReward;
    }
    if (effects.attack) {
        addTempBuff({ name: meta.name, effect: 'attack', value: effects.attack, duration: 0, isDebuff: false });
    }
    if (effects.battleReward) {
        tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + effects.battleReward;
    }
    addTsrLog(`📅 本周界词【${meta.name}】：${meta.desc}`, 'info');
}

function getTsrWeeklyRelicMagnetBonus() {
    return Number(player.timeSecretRealm?.currentRun?.weeklyBonus?.relicMagnet) || 0;
}

function getTsrFloorRelicMagnetBonus() {
    return Number(getTsrActiveAffix()?.relicMagnet) || 0;
}

function getTsrWeeklySpiritMult() {
    return Number(player.timeSecretRealm?.currentRun?.weeklyBonus?.spiritMult) || 1;
}

function getTsrStarFortune() {
    ensureTsrEngagement();
    const id = player.timeSecretRealm.engagement.starFortuneId;
    return TSR_STAR_FORTUNES.find(f => f.id === id) || TSR_STAR_FORTUNES[0];
}

function getTsrStarFortuneSpiritMult() {
    return Number(player.timeSecretRealm?.currentRun?.starFortune?.spiritMult) || 1;
}

function getTsrStarFortuneRelicMagnetBonus() {
    return Number(player.timeSecretRealm?.currentRun?.starFortune?.relicMagnet) || 0;
}

function applyTsrStarFortune(forceId) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    ensureTsrEngagement();
    const meta = forceId ? (TSR_STAR_FORTUNES.find(f => f.id === forceId) || getTsrStarFortune()) : getTsrStarFortune();
    const effects = TSR_STAR_FORTUNE_EFFECTS[meta.id];
    if (!effects) return;
    tsr.currentRun.starFortune = { ...effects, id: meta.id, theme: meta.theme };
    if (!tsr.currentRun.contractMods) {
        tsr.currentRun.contractMods = { currencyMod: 0, gamble: 0, memeMult: 1, spiritMult: 1 };
    }
    const mods = tsr.currentRun.contractMods;
    if (effects.currencyMod) mods.currencyMod = (mods.currencyMod || 0) + effects.currencyMod;
    if (effects.gamble) mods.gamble = (mods.gamble || 0) + effects.gamble;
    if (effects.battleReward) tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + effects.battleReward;
    if (effects.attack) addTempBuff({ name: meta.name, effect: 'attack', value: effects.attack, duration: 0, isDebuff: false });
    if (effects.memeMult) mods.memeMult = (mods.memeMult || 1) * effects.memeMult;
    if (effects.timeSave) mods.timeSave = (mods.timeSave || 0) + effects.timeSave;
    if (effects.floorTime) mods.floorTime = (mods.floorTime || 0) + effects.floorTime;
    if (effects.specialRoomMult) mods.specialRoomMult = (mods.specialRoomMult || 1) * effects.specialRoomMult;
    if (effects.affixReward) tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + effects.affixReward;
    addTsrLog(`✨ 今日星运【${meta.icon} ${meta.name}】：${meta.desc}`, 'success', meta.theme || 'fortune');
}

function removeTsrRunRelic(relicKey) {
    const tsr = player.timeSecretRealm;
    const idx = (tsr?.currentRun?.relics || []).indexOf(relicKey);
    if (idx >= 0) {
        tsr.currentRun.relics.splice(idx, 1);
        return true;
    }
    return false;
}

function ensureTsrEngagement() {
    const tsr = player.timeSecretRealm;
    if (!tsr.engagement) {
        tsr.engagement = {
            signDay: 0,
            lastSignDate: '',
            wheelDate: '',
            freeWheelUsed: false,
            paidWheelCount: 0,
            bountyDate: '',
            bountyIds: [],
            bountyProg: {},
            bountyClaimed: [],
            clearStreak: 0,
            lastClearDate: '',
            challengeDate: '',
            challengeId: '',
            challengeDone: false,
            challengeClaimed: false,
            tickerIdx: 0,
            weeklyModKey: '',
            weeklyModId: TSR_WEEKLY_MODIFIERS[0].id,
            starFortuneDay: '',
            starFortuneId: TSR_STAR_FORTUNES[0].id
        };
    }
    const e = tsr.engagement;
    const weekKey = getTsrWeekKey();
    if (e.weeklyModKey !== weekKey) {
        e.weeklyModKey = weekKey;
        e.weeklyModId = TSR_WEEKLY_MODIFIERS[Math.abs(hashTsrString(weekKey)) % TSR_WEEKLY_MODIFIERS.length].id;
    }
    const today = getTsrDateKey();
    if (e.starFortuneDay !== today) {
        e.starFortuneDay = today;
        e.starFortuneId = TSR_STAR_FORTUNES[Math.abs(hashTsrString(today + '_star')) % TSR_STAR_FORTUNES.length].id;
    }
    if (e.bountyDate !== today) {
        e.bountyDate = today;
        e.bountyIds = pickTsrQuestIds(TSR_BOUNTY_POOL, 3);
        e.bountyProg = {};
        e.bountyClaimed = [];
    }
    if (e.wheelDate !== today) {
        e.wheelDate = today;
        e.freeWheelUsed = false;
        e.paidWheelCount = 0;
    }
    if (e.challengeDate !== today) {
        e.challengeDate = today;
        const idx = Math.abs(hashTsrString(today)) % TSR_DAILY_CHALLENGES.length;
        e.challengeId = TSR_DAILY_CHALLENGES[idx].id;
        e.challengeDone = false;
        e.challengeClaimed = false;
    }
}

function hashTsrString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h) + str.charCodeAt(i) | 0;
    return h;
}

function getTsrPlayerTitle() {
    const tsr = player.timeSecretRealm;
    const sp = ensureTsrSpiritPet();
    const ls = tsr.lifetimeStats || {};
    const ach = tsr.achievements || {};
    let best = TSR_PLAYER_TITLES[0];
    let bestPriority = -1;
    TSR_PLAYER_TITLES.forEach(t => {
        if (t.minDiffClear && !(tsr.clearCountByDifficulty?.[t.minDiffClear] || 0)) return;
        if (t.minClear != null && tsr.clearCount < t.minClear) return;
        if (t.minFloor != null && tsr.bestFloor < t.minFloor) return;
        if (t.needEvo != null && (sp?.evolution || 0) < t.needEvo) return;
        if (t.needSpiritLevel != null && (sp?.level || 0) < t.needSpiritLevel) return;
        if (t.needStarBossWins != null && (ls.starBossWins || 0) < t.needStarBossWins) return;
        if (t.needThroneClears != null && (ls.throneClears || 0) < t.needThroneClears) return;
        if (t.needThroneExtreme != null && (ls.throneExtremeClears || 0) < t.needThroneExtreme) return;
        if (t.needAffixKills != null && (ls.affixKills || 0) < t.needAffixKills) return;
        if (t.needAchievement && !ach[t.needAchievement]) return;
        const priority = t.priority != null ? t.priority : (t.minClear * 2 + t.minFloor);
        if (priority >= bestPriority) {
            bestPriority = priority;
            best = t;
        }
    });
    return best;
}

function getTsrDailyChallenge() {
    ensureTsrEngagement();
    return TSR_DAILY_CHALLENGES.find(c => c.id === player.timeSecretRealm.engagement.challengeId) || TSR_DAILY_CHALLENGES[0];
}

function bumpTsrEngagement(track, amount) {
    if (isTsrTutorialRun()) return;
    amount = amount || 1;
    ensureTsrEngagement();
    const e = player.timeSecretRealm.engagement;
    const alias = {
        runElites: 'dailyElites',
        runMeme: 'dailyMeme',
        runGambles: 'dailyGambles',
        runSpiritTriggers: 'dailySpirit'
    };
    const tracks = [track];
    if (alias[track]) tracks.push(alias[track]);
    e.bountyIds.forEach(id => {
        const def = TSR_BOUNTY_POOL.find(x => x.id === id);
        if (def && tracks.includes(def.track)) {
            e.bountyProg[id] = Math.min(def.target, (e.bountyProg[id] || 0) + amount);
        }
    });
}

function syncTsrEngagementFloor(floor) {
    if (isTsrTutorialRun()) return;
    ensureTsrEngagement();
    const e = player.timeSecretRealm.engagement;
    e.bountyIds.forEach(id => {
        const def = TSR_BOUNTY_POOL.find(x => x.id === id);
        if (def && def.track === 'runFloor') {
            e.bountyProg[id] = Math.max(e.bountyProg[id] || 0, Math.min(def.target, floor));
        }
    });
}

function recordTsrDailyClear() {
    ensureTsrEngagement();
    const e = player.timeSecretRealm.engagement;
    const today = getTsrDateKey();
    if (e.lastClearDate === today) return;
    const yesterday = getTsrDateKeyOffset(-1);
    e.clearStreak = e.lastClearDate === yesterday ? (e.clearStreak || 0) + 1 : 1;
    e.lastClearDate = today;
    bumpTsrEngagement('dailyClear', 1);
}

function getTsrDateKeyOffset(dayOffset) {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getTsrClearStreakBonus() {
    const streak = player.timeSecretRealm?.engagement?.clearStreak || 0;
    return Math.min(0.35, streak * 0.05);
}

function canClaimTsrSignIn() {
    ensureTsrEngagement();
    return player.timeSecretRealm.engagement.lastSignDate !== getTsrDateKey();
}

function claimTsrSignIn() {
    if (!canClaimTsrSignIn()) {
        logAction('今日已签到', 'warning');
        return;
    }
    ensureTsrEngagement();
    const tsr = player.timeSecretRealm;
    const e = tsr.engagement;
    const today = getTsrDateKey();
    const yesterday = getTsrDateKeyOffset(-1);
    if (e.lastSignDate === yesterday) {
        e.signDay = Math.min(6, (e.signDay || 0) + 1);
    } else if (e.lastSignDate !== today) {
        e.signDay = 0;
    }
    e.lastSignDate = today;
    const reward = TSR_SIGN_IN_REWARDS[e.signDay] || TSR_SIGN_IN_REWARDS[0];
    const added = addTsrPermanentCurrency(reward.currency || 0);
    if (reward.keys) player.items.fuben2 = (player.items.fuben2 || 0) + reward.keys;
    logAction(`签到成功！第${e.signDay + 1}天奖励：+${added}秘境币${reward.keys ? '，+' + reward.keys + '钥匙' : ''}`, 'success');
    updateTsrWelfareDisplay();
    updateTsrLobbyDashboard();
    updateTsrTabBadges();
    updateTimeSecretRealmUI({ skipEnsure: true });
    saveGame();
}

function rollTsrFortunePrize() {
    const total = TSR_FORTUNE_PRIZES.reduce((s, p) => s + p.weight, 0);
    let roll = Math.random() * total;
    for (const p of TSR_FORTUNE_PRIZES) {
        roll -= p.weight;
        if (roll <= 0) return p;
    }
    return TSR_FORTUNE_PRIZES[0];
}

function spinTsrFortuneWheel(usePaid) {
    ensureTsrEngagement();
    const tsr = player.timeSecretRealm;
    const e = tsr.engagement;
    const paidCost = typeof TSR_FORTUNE_PAID_COST === 'number' ? TSR_FORTUNE_PAID_COST : 1500;
    if (!usePaid) {
        if (e.freeWheelUsed) {
            logAction(`今日免费转盘已使用，可花费${paidCost}秘境币再转`, 'warning');
            return;
        }
        e.freeWheelUsed = true;
    } else {
        if (e.paidWheelCount >= 2) {
            logAction('今日付费转盘次数已用完', 'warning');
            return;
        }
        if (tsr.currency < paidCost) {
            logAction(`秘境币不足，付费转盘需要${paidCost}币`, 'error');
            return;
        }
        tsr.currency -= paidCost;
        e.paidWheelCount++;
    }
    const prize = rollTsrFortunePrize();
    const detailParts = [];
    if (prize.currency) {
        const added = addTsrPermanentCurrency(prize.currency);
        detailParts.push(`+${added}秘境币`);
    }
    if (prize.keys) {
        player.items.fuben2 = (player.items.fuben2 || 0) + prize.keys;
        detailParts.push(`+${prize.keys}钥匙`);
    }
    if (prize.spiritExp) {
        addTsrSpiritExp(prize.spiritExp);
        detailParts.push(`精灵+${prize.spiritExp}经验`);
    }
    if (prize.runBuff && tsr.currentRun?.isActive) {
        addTempBuff({ name: '转盘祝福', effect: prize.runBuff, value: 0.3, duration: 0, timeBonus: 20 });
        detailParts.push('本局攻击祝福已生效');
    } else if (prize.runBuff) {
        detailParts.push('需在冒险中旋转才生效祝福');
    }
    const detail = detailParts.join('，') || prize.label;
    const msg = `转盘获得：${prize.icon} ${prize.label}${detailParts.length ? '（' + detail + '）' : ''}`;
    e.lastWheelPrize = {
        icon: prize.icon,
        label: prize.label,
        detail,
        at: Date.now()
    };
    logAction(msg, 'success');
    const wheelEl = document.getElementById('tsrFortuneWheel');
    if (wheelEl) {
        if (tsr._welfareWheelSpinTimer) clearTimeout(tsr._welfareWheelSpinTimer);
        wheelEl.classList.add('spinning');
        wheelEl.textContent = '🎡';
        tsr._welfareWheelSpinTimer = setTimeout(() => {
            wheelEl.classList.remove('spinning');
            wheelEl.textContent = prize.icon || '🎁';
            tsr._welfareWheelSpinTimer = null;
        }, 1200);
    }
    updateTsrWelfareDisplay();
    updateTsrLobbyDashboard();
    updateTsrTabBadges();
    updateTimeSecretRealmUI({ skipEnsure: true });
    saveGame();
}

function claimTsrBounty(bountyId) {
    ensureTsrEngagement();
    const tsr = player.timeSecretRealm;
    const e = tsr.engagement;
    const def = TSR_BOUNTY_POOL.find(x => x.id === bountyId);
    if (!def || !e.bountyIds.includes(bountyId)) return;
    if (e.bountyClaimed.includes(bountyId)) {
        logAction('该悬赏已领取', 'warning');
        return;
    }
    if ((e.bountyProg[bountyId] || 0) < def.target) {
        logAction('悬赏尚未完成', 'warning');
        return;
    }
    const added = addTsrPermanentCurrency(def.reward.currency || 0);
    if (def.reward.spiritExp) addTsrSpiritExp(def.reward.spiritExp);
    e.bountyClaimed.push(bountyId);
    logAction(`领取悬赏【${def.name}】：+${added}秘境币${def.reward.spiritExp ? '，精灵经验+' + def.reward.spiritExp : ''}`, 'success');
    updateTsrWelfareDisplay();
    updateTsrLobbyDashboard();
    updateTsrTabBadges();
    updateTimeSecretRealmUI({ skipEnsure: true });
    saveGame();
}

function claimTsrDailyChallenge() {
    ensureTsrEngagement();
    const e = player.timeSecretRealm.engagement;
    const ch = getTsrDailyChallenge();
    if (!e.challengeDone) {
        logAction('今日挑战尚未完成', 'warning');
        return;
    }
    if (e.challengeClaimed) {
        logAction('今日挑战奖励已领取', 'warning');
        return;
    }
    const added = addTsrPermanentCurrency(ch.reward);
    e.challengeClaimed = true;
    logAction(`领取今日挑战【${ch.name}】：+${added}秘境币`, 'success');
    updateTsrLobbyDashboard();
    updateTsrTabBadges();
    updateTimeSecretRealmUI({ skipEnsure: true });
    saveGame();
}

function checkTsrDailyChallenge(ctx) {
    if (isTsrTutorialRun()) return;
    ensureTsrEngagement();
    const e = player.timeSecretRealm.engagement;
    const ch = getTsrDailyChallenge();
    if (!e.challengeDone && ch.check(ctx)) {
        e.challengeDone = true;
        logAction(`完成今日挑战【${ch.name}】！可领取${ch.reward}秘境币`, 'success');
    }
}

function countTsrClaimableRewards() {
    ensureTsrEngagement();
    ensureTsrQuests();
    const tsr = player.timeSecretRealm;
    let n = 0;
    if (canClaimTsrSignIn()) n++;
    const e = tsr.engagement;
    if (!e.freeWheelUsed) n++;
    e.bountyIds.forEach(id => {
        const def = TSR_BOUNTY_POOL.find(x => x.id === id);
        if (def && (e.bountyProg[id] || 0) >= def.target && !e.bountyClaimed.includes(id)) n++;
    });
    if (e.challengeDone && !e.challengeClaimed) n++;
    const q = tsr.quests;
    const checkQuest = (ids, prog, claimed, pool) => {
        ids.forEach(id => {
            const def = pool.find(x => x.id === id);
            if (def && (prog[id] || 0) >= def.target && !claimed.includes(id)) n++;
        });
    };
    checkQuest(q.dailyIds, q.dailyProg, q.dailyClaimed, TSR_QUEST_POOL.daily);
    checkQuest(q.weeklyIds, q.weeklyProg, q.weeklyClaimed, TSR_QUEST_POOL.weekly);
    return n;
}

function updateTsrTabBadges() {
    const n = countTsrClaimableRewards();
    document.querySelectorAll('.tsr-tab-badge').forEach(el => {
        el.textContent = n > 0 ? String(n) : '';
        el.style.display = n > 0 ? 'inline-flex' : 'none';
    });
    const welfareN = (canClaimTsrSignIn() ? 1 : 0) + (player.timeSecretRealm?.engagement?.freeWheelUsed ? 0 : 1);
    const welfareBadge = document.getElementById('tsrWelfareBadge');
    if (welfareBadge) {
        welfareBadge.textContent = welfareN > 0 ? String(welfareN) : '';
        welfareBadge.style.display = welfareN > 0 ? 'inline-flex' : 'none';
    }
    const questBadge = document.getElementById('tsrQuestBadge');
    if (questBadge) {
        let qn = 0;
        const q = player.timeSecretRealm?.quests;
        if (q) {
            q.dailyIds.forEach(id => {
                const def = TSR_QUEST_POOL.daily.find(x => x.id === id);
                if (def && (q.dailyProg[id] || 0) >= def.target && !q.dailyClaimed.includes(id)) qn++;
            });
            q.weeklyIds.forEach(id => {
                const def = TSR_QUEST_POOL.weekly.find(x => x.id === id);
                if (def && (q.weeklyProg[id] || 0) >= def.target && !q.weeklyClaimed.includes(id)) qn++;
            });
        }
        questBadge.textContent = qn > 0 ? String(qn) : '';
        questBadge.style.display = qn > 0 ? 'inline-flex' : 'none';
    }
}

function updateTsrLobbyDashboard() {
    ensureTsrEngagement();
    const container = document.getElementById('tsrDashboardContent');
    if (!container) return;
    const tsr = player.timeSecretRealm;
    const e = tsr.engagement;
    const title = getTsrPlayerTitle();
    const ch = getTsrDailyChallenge();
    const weeklyMod = getTsrWeeklyModifier();
    const starFortune = getTsrStarFortune();
    const achCount = Object.keys(tsr.achievements || {}).length;
    const codexRatio = Math.round(getTsrCodexDiscoverRatio() * 100);
    const sp = tsr.spiritPet || { level: 1, bond: 0, name: '' };
    const spiritName = sp.name || getTsrSpiritEvolutionName(sp.evolution || 0);

    let questPreview = '';
    ensureTsrQuests();
    tsr.quests.dailyIds.slice(0, 2).forEach(id => {
        const def = TSR_QUEST_POOL.daily.find(x => x.id === id);
        if (!def) return;
        const cur = tsr.quests.dailyProg[id] || 0;
        const pct = Math.min(100, (cur / def.target) * 100);
        questPreview += `<div class="tsr-dash-quest"><span>${def.name}</span><div class="tsr-progress-track"><div class="tsr-progress-fill" style="width:${pct}%"></div></div><small>${cur}/${def.target}</small></div>`;
    });

    const bountyPreview = e.bountyIds.slice(0, 2).map(id => {
        const def = TSR_BOUNTY_POOL.find(x => x.id === id);
        if (!def) return '';
        const cur = e.bountyProg[id] || 0;
        const done = cur >= def.target;
        const claimed = e.bountyClaimed.includes(id);
        return `<div class="tsr-dash-bounty ${done ? 'done' : ''}"><span>${def.icon || '🎯'} ${def.name}</span><small>${cur}/${def.target}</small>${done && !claimed ? '<em>可领</em>' : ''}</div>`;
    }).join('');

    container.innerHTML = `
        <div class="tsr-dash-card tsr-dash-rank">
            <div class="tsr-dash-rank-icon">${title.icon}</div>
            <div><strong>${title.title}</strong><p>成就 ${achCount}/${TSR_ACHIEVEMENTS.length} · 图鉴 ${codexRatio}%</p></div>
        </div>
        <div class="tsr-dash-card tsr-dash-challenge tsr-dash-fortune">
            <div class="tsr-block-title">${starFortune.icon} 今日星运</div>
            <p class="tsr-dash-fortune-name">${starFortune.name}</p>
            <p>${starFortune.desc}</p>
            <p class="tsr-dash-hint">每局冒险开局自动生效</p>
        </div>
        <div class="tsr-dash-card tsr-dash-challenge">
            <div class="tsr-block-title">${weeklyMod.icon} 本周界词</div>
            <p>${weeklyMod.desc}</p>
            <p class="tsr-dash-hint">每局冒险开始时自动生效</p>
        </div>
        <div class="tsr-dash-card tsr-dash-challenge">
            <div class="tsr-block-title">${ch.icon} 今日挑战</div>
            <p>${ch.desc}</p>
            <div class="tsr-dash-challenge-reward">奖励 ${ch.reward.toLocaleString()} 币</div>
            <div class="tsr-dash-challenge-status">${e.challengeClaimed ? '✅ 已领取' : (e.challengeDone ? '<button type="button" class="tsr-btn tsr-btn-gold tsr-btn-sm" onclick="claimTsrDailyChallenge()">领取奖励</button>' : '进行中…')}</div>
        </div>
        <div class="tsr-dash-card">
            <div class="tsr-block-title">🔥 通关连击</div>
            <div class="tsr-dash-streak"><span class="tsr-dash-streak-num">${e.clearStreak || 0}</span><span>天</span></div>
            <p class="tsr-dash-hint">连续通关日加成 +${(getTsrClearStreakBonus() * 100).toFixed(0)}% 币收益</p>
        </div>
        <div class="tsr-dash-card tsr-dash-spirit" onclick="switchTsrLobbyTab('spirit')">
            <div class="tsr-block-title">🧚 ${spiritName}</div>
            <p>Lv.${sp.level || 1} · ${getTsrSpiritEvolutionName(sp.evolution || 0)} · 亲密度 ${sp.bond || 0}%</p>
            <div class="tsr-progress-track tsr-bond-track"><div class="tsr-progress-fill tsr-bond-fill" style="width:${sp.bond || 0}%"></div></div>
        </div>
        <div class="tsr-dash-card">
            <div class="tsr-block-title">📋 日常速览</div>
            ${questPreview || '<p class="tsr-dash-hint">暂无日常</p>'}
            <button type="button" class="tsr-btn tsr-btn-ghost tsr-btn-sm" onclick="switchTsrLobbyTab('quests')">查看全部</button>
        </div>
        <div class="tsr-dash-card">
            <div class="tsr-block-title">🎯 悬赏速览</div>
            ${bountyPreview || '<p class="tsr-dash-hint">今日悬赏加载中</p>'}
            <button type="button" class="tsr-btn tsr-btn-ghost tsr-btn-sm" onclick="switchTsrLobbyTab('welfare')">福利中心</button>
        </div>
    `;
}

function updateTsrWelfareDisplay() {
    ensureTsrEngagement();
    const signEl = document.getElementById('tsrSignInCalendar');
    const bountyEl = document.getElementById('tsrBountyBoard');
    const wheelInfo = document.getElementById('tsrWheelInfo');
    if (!signEl && !bountyEl) return;
    const tsr = player.timeSecretRealm;
    const e = tsr.engagement;

    if (signEl) {
        let cal = '<div class="tsr-sign-grid">';
        TSR_SIGN_IN_REWARDS.forEach((r, i) => {
            const dayNum = i + 1;
            let cls = 'tsr-sign-day';
            if (i < e.signDay && e.lastSignDate) cls += ' claimed';
            else if (i === e.signDay && canClaimTsrSignIn()) cls += ' today-ready';
            else if (i === e.signDay && !canClaimTsrSignIn() && e.lastSignDate === getTsrDateKey()) cls += ' today-done';
            const rewardText = `${(r.currency / 1000).toFixed(0)}k币${r.keys ? '+' + r.keys + '钥' : ''}`;
            cal += `<div class="${cls}"><span class="tsr-sign-day-num">D${dayNum}</span><span class="tsr-sign-day-reward">${rewardText}</span></div>`;
        });
        cal += '</div>';
        cal += `<button type="button" class="tsr-btn tsr-btn-gold" onclick="claimTsrSignIn()" ${canClaimTsrSignIn() ? '' : 'disabled'}>${canClaimTsrSignIn() ? '✨ 立即签到' : '今日已签到'}</button>`;
        cal += `<p class="tsr-dash-hint">连续签到7天一轮，断签从第1天重来 · 当前第${Math.min(7, e.signDay + (canClaimTsrSignIn() ? 1 : 0))}天</p>`;
        signEl.innerHTML = cal;
    }

    if (bountyEl) {
        let html = '';
        e.bountyIds.forEach(id => {
            const def = TSR_BOUNTY_POOL.find(x => x.id === id);
            if (!def) return;
            const cur = e.bountyProg[id] || 0;
            const done = cur >= def.target;
            const claimed = e.bountyClaimed.includes(id);
            html += `<div class="tsr-bounty-card ${done ? 'done' : ''} ${claimed ? 'claimed' : ''}">
                <div class="tsr-bounty-head"><strong>🎯 ${def.name}</strong><span>${def.reward.currency.toLocaleString()}币</span></div>
                <p>${def.desc}</p>
                <div class="tsr-bounty-prog">${cur}/${def.target}</div>
                <button type="button" class="tsr-btn tsr-btn-gold tsr-btn-sm" onclick="claimTsrBounty('${id}')" ${done && !claimed ? '' : 'disabled'}>${claimed ? '已领取' : (done ? '领取' : '未完成')}</button>
            </div>`;
        });
        bountyEl.innerHTML = html;
    }

    if (wheelInfo) {
        const freeLeft = e.freeWheelUsed ? 0 : 1;
        const paidLeft = Math.max(0, 2 - (e.paidWheelCount || 0));
        const last = e.lastWheelPrize;
        const resultHtml = last
            ? `<div class="tsr-wheel-result"><span class="tsr-wheel-result-icon">${last.icon || '🎁'}</span><div><strong>本次获得：${last.label}</strong><p>${last.detail || ''}</p></div></div>`
            : '<p class="tsr-dash-hint">转动后奖励会显示在这里</p>';
        const wheelEl = document.getElementById('tsrFortuneWheel');
        if (wheelEl && last?.icon && !wheelEl.classList.contains('spinning')) {
            wheelEl.textContent = last.icon;
        }
        wheelInfo.innerHTML = `
            ${resultHtml}
            <p>免费次数 <strong>${freeLeft}</strong> · 付费次数 <strong>${paidLeft}</strong>/2（${typeof TSR_FORTUNE_PAID_COST === 'number' ? TSR_FORTUNE_PAID_COST : 1500}币/次）</p>
            <div class="tsr-wheel-actions">
                <button type="button" class="tsr-btn tsr-btn-purple" onclick="spinTsrFortuneWheel(false)" ${freeLeft ? '' : 'disabled'}>🎡 免费转盘</button>
                <button type="button" class="tsr-btn tsr-btn-gamble" onclick="spinTsrFortuneWheel(true)" ${paidLeft ? '' : 'disabled'}>💎 付费转盘</button>
            </div>`;
    }
}

function updateTsrShopPreview() {
    const container = document.getElementById('tsrShopPreview');
    if (!container) return;
    const tsr = player.timeSecretRealm;
    if (!tsr.shopItems) return;
    const featured = Object.entries(tsr.shopItems)
        .filter(([, item]) => !item.maxPurchase || (item.purchased || 0) < item.maxPurchase)
        .sort((a, b) => a[1].cost - b[1].cost)
        .slice(0, 6);
    let html = '<div class="tsr-shop-preview-grid">';
    featured.forEach(([key, item]) => {
        const canAfford = tsr.currency >= item.cost;
        html += `<div class="tsr-shop-preview-item ${canAfford ? 'affordable' : ''}">
            <span class="tsr-shop-preview-icon">${item.icon || '📦'}</span>
            <div><strong>${item.name}</strong><p>${item.cost.toLocaleString()}币</p></div>
            <button type="button" class="tsr-btn tsr-btn-sm tsr-btn-gold" onclick="openTsrShop();switchTsrShopTab('${item.category || 'enhance'}')">去看看</button>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
    const bonusEl = document.getElementById('tsrShopBonusesPreview');
    if (bonusEl) {
        const pb = tsr.permanentBonuses || {};
        const lines = [];
        if (pb.baseTime) lines.push(`⏱️ 起始+${pb.baseTime}秒`);
        if (pb.eternalAttackBonus) lines.push(`⚔️ 攻击+${(pb.eternalAttackBonus * 100).toFixed(0)}%`);
        if (pb.eternalHealthBonus) lines.push(`❤️ 生命+${(pb.eternalHealthBonus * 100).toFixed(0)}%`);
        const ach = typeof getTsrAchievementCombatBonuses === 'function' ? getTsrAchievementCombatBonuses() : null;
        if (ach?.attack) lines.push(`🏅攻+${(ach.attack * 100).toFixed(1)}%`);
        if (ach?.health) lines.push(`🏅血+${(ach.health * 100).toFixed(1)}%`);
        if (ach?.defense) lines.push(`🏅防+${(ach.defense * 100).toFixed(1)}%`);
        if (pb.mainWorldAttackBonus) lines.push(`🗺️⚔️ 主世攻+${(pb.mainWorldAttackBonus * 100).toFixed(0)}%`);
        if (pb.mainWorldHealthBonus) lines.push(`🗺️❤️ 主世血+${(pb.mainWorldHealthBonus * 100).toFixed(0)}%`);
        if (pb.mainWorldCritDamageBonus) lines.push(`🗺️💥 主世爆伤+${(pb.mainWorldCritDamageBonus * 100).toFixed(0)}%`);
        bonusEl.innerHTML = lines.length ? lines.map(l => `<span class="tsr-bonus-chip">${l}</span>`).join('') : '<span class="tsr-dash-hint">暂无永久加成，去商店强化吧</span>';
    }
}

function updateTsrTicker(advance) {
    const el = document.getElementById('tsrNewsTicker');
    if (!el) return;
    ensureTsrEngagement();
    const e = player.timeSecretRealm.engagement;
    if (advance) e.tickerIdx = ((e.tickerIdx || 0) + 1) % TSR_TICKER_LINES.length;
    el.textContent = TSR_TICKER_LINES[e.tickerIdx || 0];
}

function updateTsrHeroBar() {
    const titleEl = document.getElementById('tsrPlayerTitle');
    const claimEl = document.getElementById('tsrClaimableCount');
    if (titleEl) {
        const t = getTsrPlayerTitle();
        titleEl.innerHTML = `${t.icon} ${t.title}`;
    }
    if (claimEl) {
        const n = countTsrClaimableRewards();
        claimEl.textContent = n > 0 ? `${n} 项可领` : '暂无待领';
        claimEl.classList.toggle('has-reward', n > 0);
    }
    const streakEl = document.getElementById('tsrHeroStreak');
    if (streakEl) {
        streakEl.textContent = player.timeSecretRealm?.engagement?.clearStreak || 0;
    }
}

function updateTsrQuestsDisplay() {
    const container = document.getElementById('tsrQuestsContent');
    if (!container) return;
    ensureTsrQuests();
    const tsr = player.timeSecretRealm;
    const q = tsr.quests;
    const renderGroup = (type, title) => {
        const ids = type === 'daily' ? q.dailyIds : q.weeklyIds;
        const prog = type === 'daily' ? q.dailyProg : q.weeklyProg;
        const claimed = type === 'daily' ? q.dailyClaimed : q.weeklyClaimed;
        const pool = TSR_QUEST_POOL[type];
        let html = `<h4 class="tsr-quest-group-title">${title}</h4>`;
        ids.forEach(id => {
            const def = pool.find(x => x.id === id);
            if (!def) return;
            const cur = prog[id] || 0;
            const done = cur >= def.target;
            const isClaimed = claimed.includes(id);
            const reward = getTsrQuestReward(def, type);
            html += `<div class="tsr-quest-item ${done ? 'done' : ''}">
                <div><strong>${def.name}</strong><div class="tsr-quest-desc">${def.desc}</div>
                <div class="tsr-quest-prog">${cur}/${def.target} · 奖励 ${reward.currency}币${reward.keys ? ' +1钥匙' : ''}</div></div>
                <button type="button" class="tsr-btn tsr-btn-gold tsr-quest-claim" onclick="claimTsrQuest('${type}','${id}')" ${!done || isClaimed ? 'disabled' : ''}>${isClaimed ? '已领' : '领取'}</button>
            </div>`;
        });
        return html;
    };
    container.innerHTML = renderGroup('daily', '📌 今日日常') + renderGroup('weekly', '📅 本周周常');
}

function getTsrActiveAffix() {
    const run = player.timeSecretRealm?.currentRun;
    if (!run?.affixKey || (run.affixFloorsLeft || 0) <= 0) return null;
    return TSR_FLOOR_AFFIXES[run.affixKey];
}

function rollTsrFloorAffix() {
    const tier = getTsrDifficultyTier();
    const keys = Object.keys(TSR_FLOOR_AFFIXES);
    const weights = keys.map(k => {
        let w = 1;
        if (tier >= 7 && (k === 'transcendentWind' || k === 'spiritWhisper' || k === 'spiritNexus')) w = 2.2;
        if (tier >= 8 && (k === 'apocalypseMoon' || k === 'apocalypseFlame' || k === 'doom' || k === 'mythicHunt')) w = 2.5;
        if (tier >= 6 && k === 'affixStorm') w = 2.0;
        if (tier >= 5 && (k === 'rainbowTide' || k === 'legendEcho')) w = 1.85;
        return w;
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (let i = 0; i < keys.length; i++) {
        roll -= weights[i];
        if (roll <= 0) return keys[i];
    }
    return keys[keys.length - 1];
}

function applyTsrFloorAffix(key) {
    const tsr = player.timeSecretRealm;
    const affix = TSR_FLOOR_AFFIXES[key];
    if (!affix) return;
    tsr.currentRun.affixKey = key;
    tsr.currentRun.affixFloorsLeft = 3;
    if (affix.attack) {
        addTempBuff({ name: affix.name, effect: 'attack', value: affix.attack, duration: 0, isDebuff: false });
    }
    addTsrLog(`层间词缀【${affix.icon} ${affix.name}】：${affix.desc}（持续3层）`, 'warning', TSR_FLOOR_AFFIX_THEMES[key] || 'affix');
    updateTsrAffixDisplay();
}

function tickTsrFloorAffix() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.affixFloorsLeft) return;
    tsr.currentRun.affixFloorsLeft--;
    if (tsr.currentRun.affixFloorsLeft <= 0) {
        tsr.currentRun.affixKey = null;
        addTsrLog('层间词缀效果结束', 'info');
    }
    updateTsrAffixDisplay();
}

function updateTsrAffixDisplay() {
    const el = document.getElementById('tsrFloorAffix');
    if (!el) return;
    const affix = getTsrActiveAffix();
    if (!affix) { el.style.display = 'none'; return; }
    const left = player.timeSecretRealm.currentRun.affixFloorsLeft || 0;
    const theme = TSR_FLOOR_AFFIX_THEMES[player.timeSecretRealm.currentRun.affixKey] || 'default';
    el.className = `tsr-floor-affix tsr-affix-theme-${theme}`;
    el.style.display = 'block';
    el.innerHTML = `<span class="tsr-affix-name">${affix.icon} ${affix.name}</span><span class="tsr-affix-left">（${left}层）</span><span class="tsr-affix-desc">${affix.desc}</span>`;
}

function getTsrCodexDiscoverRatio() {
    const tsr = player.timeSecretRealm;
    const codex = tsr.codex?.rooms || {};
    const total = TSR_CODEX_ROOMS.length;
    const found = TSR_CODEX_ROOMS.filter(r => (codex[r.key] || 0) > 0).length;
    return found / total;
}

function checkTsrCodexMilestones() {
    if (isTsrTutorialRun()) return;
    const tsr = player.timeSecretRealm;
    if (!tsr.codexMilestones) tsr.codexMilestones = {};
    const ratio = getTsrCodexDiscoverRatio();
    TSR_CODEX_MILESTONES.forEach(ms => {
        if (ratio >= ms.ratio && !tsr.codexMilestones[ms.id]) {
            tsr.codexMilestones[ms.id] = true;
            const added = addTsrPermanentCurrency(ms.reward);
            addTsrLog(`图鉴里程碑【${ms.label}】！+${added}秘境币`, 'success');
            if (ms.ratio >= 0.5) unlockTsrAchievement('codexHalf');
        }
    });
}

function updateTsrSubContractUI() {
    const section = document.getElementById('tsrSubContractSection');
    if (!section) return;
    const unlocked = canUseTsrSubContract();
    section.style.display = unlocked ? 'block' : 'none';
    const lockHint = document.getElementById('tsrSubContractLock');
    if (lockHint) lockHint.style.display = unlocked ? 'none' : 'block';
}

function stopTsrTimer() {
    const tsr = player?.timeSecretRealm;
    // 世代号作废：即使引用丢失，旧回调也会因 gen 不匹配而不再扣时
    if (tsr) tsr._timerGen = (tsr._timerGen || 0) + 1;
    const id = (tsr && tsr.timer != null) ? tsr.timer : window._tsrIntervalId;
    if (id != null) {
        if (typeof unregisterInterval === 'function') {
            unregisterInterval(id);
        } else {
            clearInterval(id);
        }
    }
    // 双清：避免 tsr.timer 与 window 单例不一致时漏掉一个
    if (tsr && tsr.timer != null && tsr.timer !== id) {
        if (typeof unregisterInterval === 'function') unregisterInterval(tsr.timer);
        else clearInterval(tsr.timer);
    }
    if (window._tsrIntervalId != null && window._tsrIntervalId !== id) {
        if (typeof unregisterInterval === 'function') unregisterInterval(window._tsrIntervalId);
        else clearInterval(window._tsrIntervalId);
    }
    if (tsr) tsr.timer = null;
    window._tsrIntervalId = null;
}

function isTsrUiOpen() {
    const ui = document.getElementById('timeSecretRealmUI');
    return !!(ui && ui.style.display === 'block');
}

function clearTsrBattleLog() {
    const logContainer = document.getElementById('tsrBattleLog');
    if (logContainer) logContainer.innerHTML = '';
}

function trimTsrFloorHistory(history) {
    if (!history || history.length <= TSR_FLOOR_HISTORY_MAX) return history;
    return history.slice(history.length - TSR_FLOOR_HISTORY_MAX);
}

const _tsrUiCache = { buff: '', skill: '', relic: '', consumable: '', equipment: '', codex: '', shop: '', permBonus: '' };

function invalidateTsrUiCache(keys) {
    if (!keys) {
        Object.keys(_tsrUiCache).forEach(k => { _tsrUiCache[k] = ''; });
        return;
    }
    (Array.isArray(keys) ? keys : [keys]).forEach(k => { _tsrUiCache[k] = ''; });
}

function getTsrBuffSignature() {
    const run = player.timeSecretRealm?.currentRun;
    const buffs = run?.tempBuffs || [];
    let luckLeft = 0;
    if (run?.luckExpiresAt && Date.now() < run.luckExpiresAt) {
        luckLeft = Math.ceil((run.luckExpiresAt - Date.now()) / 1000);
    }
    const buffSig = buffs.map(b => `${b.name}|${b.effect}|${b.value}|${b.duration || 0}|${b.isDebuff ? 1 : 0}`).join(';');
    return buffSig + '|luck:' + luckLeft;
}

function getTsrSkillSignature() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.traps?.playerSkills) return '';
    const ps = tsr.traps.playerSkills;
    const boost = tsr.currentRun?.detectionBoost ? (tsr.currentRun.detectionBoostAmount || 0.3) : 0;
    return `${ps.detection}|${ps.disarm}|${boost}`;
}

function getTsrRelicSignature() {
    return (player.timeSecretRealm?.currentRun?.relics || []).join(',');
}

function getTsrConsumableSignature() {
    return (player.timeSecretRealm?.currentRun?.consumables || []).join(',');
}

function getTsrCodexSignature() {
    const codex = player.timeSecretRealm?.codex || {};
    return JSON.stringify({
        rooms: codex.rooms || {},
        relics: codex.relics || {},
        monsterAffixes: codex.monsterAffixes || {},
        elites: codex.elites || 0,
        gambles: codex.gambles || 0,
        equipmentDrops: codex.equipmentDrops || 0,
        equipmentSets: codex.equipmentSets || {},
        equipmentLegends: codex.equipmentLegends || {},
        equipmentAffixes: codex.equipmentAffixes || {},
        equipmentTiers: codex.equipmentTiers || {}
    });
}

function getTsrShopSignature() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.shopItems) return '';
    const purchased = Object.entries(tsr.shopItems).map(([k, v]) => `${k}:${v.purchased || 0}`).join(',');
    return `${Math.floor(tsr.currency)}|${_tsrShopActiveTab}|${purchased}`;
}

function getTsrPermBonusSignature() {
    const pb = player.timeSecretRealm?.permanentBonuses || {};
    const atk = getTsrEternalAttackBonus();
    const hp = getTsrEternalHealthBonus();
    const ach = getTsrAchievementCombatBonuses();
    const achCount = Object.keys(player.timeSecretRealm?.achievements || {}).length;
    return JSON.stringify({ ...pb, atk, hp, relicMax: getTsrRelicMax(), ach, achCount });
}

function getTsrDifficultyTier(diffKey) {
    const key = diffKey || player.timeSecretRealm?.currentRun?.difficulty || player.timeSecretRealm?.difficulty?.current || 'easy';
    return TSR_DIFFICULTY_TIERS[key] != null ? TSR_DIFFICULTY_TIERS[key] : 0;
}

function getTsrFloorRewardScale(floor, clearFloor) {
    const capped = Math.min(Math.max(1, floor), clearFloor || floor);
    return 1 + (capped - 1) * 0.06;
}

function getTsrEliteRelicDropChance() {
    const tier = getTsrDifficultyTier();
    return Math.min(0.72, 0.28 + tier * 0.04 + getTsrPermanentRelicMagnetBonus() + getTsrWeeklyRelicMagnetBonus() + getTsrFloorRelicMagnetBonus() + getTsrStarFortuneRelicMagnetBonus());
}

function getTsrBossRelicDropChance() {
    const tier = getTsrDifficultyTier();
    return Math.min(0.65, 0.18 + tier * 0.05 + getTsrPermanentRelicMagnetBonus() * 0.85 + getTsrWeeklyRelicMagnetBonus() * 0.85);
}

function getTsrBattleBuffChance(isBoss, isElite, difficultyMultiplier) {
    const tier = getTsrDifficultyTier();
    if (isBoss) return Math.min(0.65, 0.45 + tier * 0.04);
    if (isElite) return Math.min(0.5, 0.3 + tier * 0.025);
    return Math.min(0.32, 0.2 / Math.max(0.8, difficultyMultiplier));
}

function estimateTsrClearReward(diffKey) {
    const tsr = player.timeSecretRealm;
    const diff = tsr?.difficulty?.levels?.[diffKey];
    if (!diff) return 0;
    const cf = diff.clearFloor;
    const avgFloor = Math.ceil(cf * 0.55);
    const scale = getTsrFloorRewardScale(avgFloor, cf);
    const dm = diff.multiplier;
    const rm = diff.rewardMultiplier;
    const battles = Math.floor(cf * 0.42);
    const elites = Math.floor(cf / TSR_ELITE_FLOOR_INTERVAL);
    const bosses = Math.floor(cf / TSR_BOSS_FLOOR_INTERVAL);
    const treasures = Math.floor(cf * 0.1);
    let total = 0;
    total += battles * 20 * dm * rm * scale;
    total += elites * 45 * dm * rm * scale * TSR_ELITE_CURRENCY_BONUS;
    total += bosses * 80 * dm * rm * scale * TSR_BOSS_CURRENCY_BONUS;
    total += treasures * 50 * dm * rm * scale;
    total += cf * 12;
    const clearRate = 0.5 + Math.min(0.25, getTsrPermanentClearRewardBonus());
    let est = Math.floor(total * (1 + clearRate * 0.85) * TSR_RUN_CURRENCY_GAIN_SCALE);
    const cap = getTsrDifficultyRunCurrencyCap(diffKey);
    if (cap != null) est = Math.min(est, cap);
    return est;
}

function estimateTsrRunTime(diffKey) {
    const tsr = player.timeSecretRealm;
    const diff = tsr?.difficulty?.levels?.[diffKey];
    if (!diff) return 0;
    return getTsrAdjustedBaseTime(diff);
}

function getTsrRelicMax() {
    const tsr = player.timeSecretRealm;
    return TSR_RELIC_MAX + (tsr?.permanentBonuses?.relicSlots || 0);
}

function getTsrPermanentComboCapBonus() {
    return Number(player.timeSecretRealm?.permanentBonuses?.comboBonus) || 0;
}

function getTsrPermanentRunCurrencyBonus() {
    return Number(player.timeSecretRealm?.permanentBonuses?.runCurrencyBonus) || 0;
}

function getTsrPermanentGambleBonus() {
    return Number(player.timeSecretRealm?.permanentBonuses?.gambleBonus) || 0;
}

function getTsrPermanentFloorTimeBonus() {
    return Number(player.timeSecretRealm?.permanentBonuses?.floorTimeBonus) || 0;
}

function getTsrPermanentExploreTimeSave() {
    return Number(player.timeSecretRealm?.permanentBonuses?.exploreTimeSave) || 0;
}

function getTsrPermanentClearRewardBonus() {
    return Math.min(TSR_CLEAR_REWARD_BONUS_MAX, Number(player.timeSecretRealm?.permanentBonuses?.clearRewardBonus) || 0);
}

function getTsrPermanentSpiritPactBonus() {
    return Number(player.timeSecretRealm?.permanentBonuses?.spiritPact) || 0;
}

function getTsrPermanentVaultBonus() {
    return Number(player.timeSecretRealm?.permanentBonuses?.vaultBonus) || 0;
}

function getTsrPermanentRelicMagnetBonus() {
    return Number(player.timeSecretRealm?.permanentBonuses?.relicMagnet) || 0;
}

function hasTsrRelic(relicKey) {
    const relics = player.timeSecretRealm?.currentRun?.relics || [];
    return relics.includes(relicKey);
}

function hasTsrRoomPreview() {
    return !!(player.timeSecretRealm?.permanentBonuses?.roomPreview);
}

function addTsrConsumable(key) {
    const tsr = player.timeSecretRealm;
    const def = TSR_RUN_CONSUMABLES[key];
    if (!def || !tsr?.currentRun) return false;
    if (!tsr.currentRun.consumables) tsr.currentRun.consumables = [];
    tsr.currentRun.consumables.push(key);
    return true;
}

function updateTsrConsumablesDisplay() {
    const container = document.getElementById('tsrCurrentConsumables');
    if (!container) return;
    const sig = getTsrConsumableSignature();
    if (_tsrUiCache.consumable === sig) return;
    _tsrUiCache.consumable = sig;
    const items = player.timeSecretRealm?.currentRun?.consumables || [];
    if (!items.length) {
        container.innerHTML = '<div class="tsr-empty">暂无道具</div>';
        return;
    }
    container.innerHTML = items.map((key, idx) => {
        const c = TSR_RUN_CONSUMABLES[key];
        if (!c) return '';
        return `<button type="button" class="tsr-consumable-item" onclick="tsrUseConsumable(${idx})">
            <span class="tsr-consumable-icon">${c.icon}</span>
            <span class="tsr-consumable-name">${c.name}</span>
            <span class="tsr-consumable-desc">${c.desc}</span>
        </button>`;
    }).join('');
}

function updateTsrRoomPreview() {
    const el = document.getElementById('tsrRoomPreview');
    if (!el) return;
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive || !hasTsrRoomPreview()) {
        el.style.display = 'none';
        return;
    }
    const room = tsr.currentRun.currentRoom;
    if (!room) { el.style.display = 'none'; return; }
    if (tsr.currentRun.oraclePreview > 0) {
        el.style.display = 'flex';
        el.innerHTML = `<span class="tsr-preview-label">精灵引路</span><span>已感知未来${tsr.currentRun.oraclePreview}层方向 ✨</span>`;
        return;
    }
    const meta = getTsrRoomTypeMeta(room.type);
    el.style.display = 'flex';
    el.innerHTML = `<span class="tsr-preview-label">罗盘预知</span><span>${meta.icon} ${meta.name}</span>`;
}

function tsrUseConsumable(index) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    const list = tsr.currentRun.consumables || [];
    const key = list[index];
    const def = TSR_RUN_CONSUMABLES[key];
    if (!def) return;
    list.splice(index, 1);
    switch (def.effect) {
        case 'heal':
            tsrHealPlayer(def.value);
            addTsrLog(`使用${def.name}，恢复${def.value * 100}%生命`, 'success');
            updateHealthBar();
            break;
        case 'time':
            tsr.currentRun.timeLeft += def.value;
            addTsrLog(`使用${def.name}，增加${def.value}秒`, 'success');
            break;
        case 'detect': {
            const room = tsr.currentRun.currentRoom;
            if (room?.hasTrap && !room.trapDisarmed) {
                room.trapDetected = true;
                addTsrLog(`使用${def.name}，发现${room.trap.name}`, 'success');
                updateCurrentRoomDisplay();
            } else {
                addTsrLog(`使用${def.name}，但当前房间没有可侦查的陷阱`, 'warning');
            }
            break;
        }
        case 'luck':
            tsr.currentRun.luckExpiresAt = Date.now() + 60000;
            addTsrLog(`使用${def.name}，60秒内秘境币收益翻倍`, 'success');
            break;
        case 'barrier':
            tsr.currentRun.trapBarrier = true;
            addTsrLog(`使用${def.name}，下一次陷阱将被完全抵消`, 'success');
            break;
        case 'rage':
            addTempBuff({ name: '战意药剂', effect: 'attack', value: def.value, duration: 3, isDebuff: false });
            addTsrLog(`使用${def.name}，接下来3次行动攻击+35%`, 'success');
            break;
        case 'coffee':
            tsrHealPlayer(def.value);
            tsr.currentRun.timeLeft += 20;
            addTsrLog(`使用${def.name}，恢复15%生命并+20秒`, 'success');
            break;
        case 'memeTea':
            tsr.currentRun.memeRoomBonus = 0.5;
            addTsrLog(`使用${def.name}，下次恶趣味房间秘境币+50%`, 'success');
            break;
        case 'bait':
            tsr.currentRun.battleRewardBonus = def.value;
            addTsrLog(`使用${def.name}，下次战斗奖励+${Math.floor(def.value * 100)}%`, 'success');
            break;
        case 'counterShield':
            tsr.currentRun.counterShield = { mult: def.value, count: 3 };
            addTsrLog(`使用${def.name}，下3次反击伤害减半`, 'success');
            break;
        case 'chaos': {
            const chaos = [
                () => { tsr.currentRun.timeLeft += 50; return '+50秒'; },
                () => { tsrHealPlayer(0.3); return '恢复30%生命'; },
                () => { const g = addTsrRunCurrency(120); return `+${g}秘境币`; },
                () => { addTempBuff({ name: '混沌之力', effect: 'attack', value: 0.5, duration: 4, isDebuff: false }); return '攻击+50%×4'; },
                () => { applyDamage(bMul(tsr.currentRun.playerHealth, 0.08)); return '混沌反噬8%伤害'; },
                () => { chargeTsrSpirit(40); return '精灵充能+40'; }
            ];
            const r = chaos[Math.floor(Math.random() * chaos.length)]();
            addTsrLog(`混沌骰子：${r}`, 'success');
            break;
        }
        case 'spiritCharge':
            chargeTsrSpirit(def.value);
            addTsrLog(`使用${def.name}，精灵充能+${def.value}`, 'success');
            break;
        case 'spiritAwaken': {
            chargeTsrSpirit(def.value);
            const bonuses = getTsrSpiritBonuses();
            tsrHealPlayer(bonuses.healRate * 0.4);
            tsr.currentRun.timeLeft += Math.floor(bonuses.timeBonus * 0.35);
            addTsrSpiritBond(2);
            addTsrLog(`使用${def.name}！充能+${def.value}，并触发部分精灵觉醒效果`, 'success');
            break;
        }
        case 'flash':
            tsr.currentRun.flashBombActive = true;
            addTsrLog(`使用${def.name}，下一场战斗首回合伤害+25%`, 'success');
            break;
        case 'spiritBond':
            addTsrSpiritBond(def.value);
            addTsrSpiritExp(40);
            addTsrLog(`使用${def.name}，亲密度+${def.value}，经验+40`, 'success');
            invalidateTsrUiCache('spirit');
            break;
        case 'spiritStrikeAmp':
            tsr.currentRun.spiritStrikeAmp = def.value;
            tsr.currentRun.spiritStrikeAmpFloors = 3;
            addTsrLog(`使用${def.name}，接下来3层灵击伤害×${def.value}`, 'success');
            break;
        case 'oracleDust':
            tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, def.value);
            updateTsrRoomPreview();
            addTsrLog(`使用${def.name}，预览未来${def.value}层`, 'success');
            break;
        case 'apocalypseSeed':
            addTempBuff({ name: '终焉之种', effect: 'attack', value: 0.3, duration: 3, isDebuff: false });
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog(`使用${def.name}，攻击+30%×3，受到8%反噬伤害`, 'warning');
            break;
        case 'starBurst': {
            chargeTsrSpirit(100);
            addTsrSpiritBond(8);
            const sp = ensureTsrSpiritPet();
            if ((sp?.evolution || 0) >= getTsrSpiritMaxEvolution()) {
                tsr.currentRun.timeLeft += 15;
                addTsrLog(`使用${def.name}！终焉星灵星辉爆发，+15秒`, 'success');
            } else {
                addTsrLog(`使用${def.name}！精灵充能满溢并触发觉醒`, 'success');
            }
            invalidateTsrUiCache('spirit');
            break;
        }
        case 'archonTear':
            tsrHealPlayer(0.35);
            chargeTsrSpirit(100);
            addTsrSpiritBond(6);
            addTsrLog(`使用${def.name}！回血35%，满充能觉醒，亲密度+6`, 'success');
            invalidateTsrUiCache('spirit');
            break;
        case 'throneIncense':
            tsr.currentRun.spiritStrikeAmp = 1.8;
            tsr.currentRun.spiritStrikeAmpFloors = 4;
            addTsrSpiritBond(10);
            addTsrLog(`使用${def.name}！灵击×1.8×4层，亲密度+10`, 'success');
            invalidateTsrUiCache('spirit');
            break;
        case 'starGateKey':
            tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, 3);
            tsr.currentRun.nextSpecialRoomBoost = true;
            updateTsrRoomPreview();
            addTsrLog(`使用${def.name}！预览3层，下次特殊房权重提升`, 'success');
            break;
        case 'dominionElixir':
            addTempBuff({ name: '统御灵剂', effect: 'attack', value: 0.25, duration: 4, isDebuff: false });
            chargeTsrSpirit(45);
            addTsrLog(`使用${def.name}！攻击+25%×4，精灵充能+45`, 'success');
            invalidateTsrUiCache('spirit');
            break;
        case 'tyrantCore':
            addTempBuff({ name: '暴君核心', effect: 'attack', value: 0.35, duration: 3, isDebuff: false });
            tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, 2);
            updateTsrRoomPreview();
            addTsrSpiritBond(5);
            addTsrLog(`使用${def.name}！攻击+35%×3，预览2层，亲密度+5`, 'success');
            invalidateTsrUiCache('spirit');
            break;
        case 'paradeSparkler':
            addTsrSpiritExp(100);
            addTsrSpiritBond(10);
            chargeTsrSpirit(40);
            addTsrLog(`使用${def.name}！经验+100，亲密度+10，充能+40`, 'success');
            invalidateTsrUiCache('spirit');
            break;
        case 'affixScope': {
            const room = tsr.currentRun.currentRoom;
            const isCombat = room && (room.type === 'battle' || room.type === 'elite' || room.type === 'boss' || room.isBoss || room.isElite);
            tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + 0.25;
            if (isCombat && room.monster) {
                const floor = tsr.currentRun.currentFloor;
                rerollTsrMonsterAffixes(room.monster, !!room.isBoss || room.type === 'boss', !!room.isElite || room.type === 'elite', floor, 1);
                const affixes = getTsrMonsterAffixList(room.monster);
                recordTsrMonsterAffixCodex(room.monster.affixKeys);
                addTsrLog(`使用${def.name}！洞察词条：${affixes.length ? affixes.map(a => a.icon + a.name).join(' · ') : '（未侦测到）'}`, 'success');
                updateCurrentRoomDisplay();
            } else {
                tsr.currentRun.nextBattleExtraAffix = true;
                addTsrLog(`使用${def.name}！下一场战斗怪将额外附着词条，词条赏金+25%`, 'success');
            }
            break;
        }
        case 'affixSwap':
            tsr.currentRun.nextAffixSwap = true;
            addTsrLog(`使用${def.name}！下一场战斗将重铸怪物全部词条`, 'success');
            break;
        case 'synergyToken':
            tsr.currentRun.synergyAmp = 1.5;
            addTsrLog(`使用${def.name}！本局契约羁绊效果+50%`, 'success');
            break;
        case 'championMedal':
            tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + 0.35;
            addTempBuff({ name: '冠军战意', effect: 'attack', value: 0.28, duration: 3, isDebuff: false });
            addTsrLog(`使用${def.name}！攻击+28%×3，战斗奖励+35%`, 'success', 'champion');
            break;
        case 'fortuneToken': {
            const meta = TSR_STAR_FORTUNES[Math.floor(Math.random() * TSR_STAR_FORTUNES.length)];
            tsr.currentRun.starFortune = { ...(TSR_STAR_FORTUNE_EFFECTS[meta.id] || {}), id: meta.id, theme: meta.theme, tokenBonus: true };
            addTempBuff({ name: meta.name, effect: 'attack', value: 0.15, duration: 3, isDebuff: false });
            chargeTsrSpirit(30);
            addTsrLog(`星运符共鸣【${meta.icon}${meta.name}】！攻击+15%×3，充能+30`, 'success', 'fortune');
            break;
        }
        case 'chronoCapsule':
            tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, 2);
            tsr.currentRun.chronoCapsuleFloors = 3;
            updateTsrRoomPreview();
            addTsrLog('使用时序胶囊！预览2层，接下来3层行动耗时-10%', 'success');
            break;
        case 'libraryScroll':
            tsr.currentRun.specialRoomBonus = (tsr.currentRun.specialRoomBonus || 0) + 0.4;
            tsr.currentRun.specialRoomBonusUses = (tsr.currentRun.specialRoomBonusUses || 0) + 2;
            addTsrLog('展开秘闻卷轴！下2次特殊房收益+40%', 'success', 'legend');
            break;
        case 'wishCoin': {
            chargeTsrSpirit(100);
            addTsrSpiritBond(8);
            const g = addTsrRunCurrency(Math.floor(60 + Math.random() * 80));
            addTsrLog(`投掷星愿硬币！满充能觉醒，亲密度+8，+${g}秘境币`, 'success', 'spirit');
            invalidateTsrUiCache('spirit');
            break;
        }
    }
    updateTsrConsumablesDisplay();
    updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
}

const TSR_RELIC_POOL = {
    hourglass: { name: '逆流沙漏', icon: '⏳', desc: '行动时间消耗-10%', effect: 'timeSave', value: 0.1 },
    coin: { name: '聚财符', icon: '🪙', desc: '秘境币收益+18%', effect: 'currency', value: 0.18 },
    blade: { name: '锋锐碎片', icon: '🗡️', desc: '攻击+22%', effect: 'attack', value: 0.22 },
    heart: { name: '守护者之心', icon: '💎', desc: '生命+28%', effect: 'health', value: 0.28 },
    spirit: { name: '时光精灵', icon: '✨', desc: '每层额外+6秒', effect: 'floorTime', value: 6 },
    mirror: { name: '命运之镜', icon: '🪞', desc: '赌局胜率+15%', effect: 'gamble', value: 0.15 },
    compass: { name: '侦查罗盘', icon: '🧭', desc: '陷阱侦查成功率+20%', effect: 'detection', value: 0.2 },
    lantern: { name: '探路提灯', icon: '🏮', desc: '行动时间消耗-8%', effect: 'timeSave', value: 0.08 },
    phoenix: { name: '涅槃之羽', icon: '🪶', desc: '濒危时复活一次（30%生命）', effect: 'phoenix', value: 1 },
    vortex: { name: '连击漩涡', icon: '🌀', desc: '连击收益额外+5%', effect: 'comboBoost', value: 0.05 },
    mask: { name: '赌徒面具', icon: '🎭', desc: '赌局失败不再额外扣时间', effect: 'gambleSafe', value: 1 },
    keyboard: { name: '键盘侠之魂', icon: '⌨️', desc: '赌局胜率+12%，秘境币收益-5%', effect: 'gamble', value: 0.12, penalty: { effect: 'currencyPenalty', value: 0.05 } },
    fish: { name: '摸鱼圣典', icon: '🐟', desc: '行动耗时-12%，每层时光-3秒', effect: 'timeSave', value: 0.12, penalty: { effect: 'floorTimePenalty', value: 3 } },
    anchor: { name: '定锚宝珠', icon: '⚓', desc: '撤离结算秘境币+8%', effect: 'exitBonus', value: 0.08 },
    thunder: { name: '雷鸣碎片', icon: '⚡', desc: '暴击率+8%', effect: 'critRate', value: 0.08 },
    prism: { name: '棱彩晶石', icon: '🔶', desc: '精英战利品+25%', effect: 'eliteCurrency', value: 0.25 },
    aegis: { name: '反击盾徽', icon: '🛡️', desc: '受到反击伤害-15%', effect: 'counterReduce', value: 0.15 },
    coffee: { name: '续命咖啡', icon: '☕', desc: '每层额外+4秒，冥想效果+50%', effect: 'floorTime', value: 4 },
    dice: { name: '玄学骰子', icon: '🎲', desc: '赌局胜率+10%，随机事件收益+15%', effect: 'gamble', value: 0.1, bonus: { effect: 'eventBonus', value: 0.15 } },
    slacker: { name: '摸鱼执照', icon: '📋', desc: '休息房效果+40%，战斗币收益-6%', effect: 'restBonus', value: 0.4, penalty: { effect: 'battleCurrencyPenalty', value: 0.06 } },
    spiritCore: { name: '灵核残片', icon: '🔮', desc: '精灵充能+25%', effect: 'spiritCharge', value: 0.25 },
    spiritWing: { name: '精灵之翼', icon: '🪽', desc: '精灵共鸣概率+6%', effect: 'spiritDouble', value: 0.06 },
    timeThief: { name: '窃时之牙', icon: '🦷', desc: '战斗胜利额外+5秒', effect: 'timeSteal', value: 5 },
    bossHunter: { name: '猎王徽章', icon: '🏹', desc: '首领战攻击+18%', effect: 'bossAttack', value: 0.18 },
    mimicCharm: { name: '宝箱迷香', icon: '📦', desc: '宝箱房奖励+50%', effect: 'treasureBonus', value: 0.5 },
    ghostWard: { name: '幽光护符', icon: '👻', desc: '陷阱伤害-25%', effect: 'trapReduce', value: 0.25 },
    streakBlade: { name: '连斩之刃', icon: '⚔️', desc: '每连击+3%攻击（最高+30%）', effect: 'streakAttack', value: 0.03 },
    vampireFang: { name: '噬血尖牙', icon: '🩸', desc: '暴击时恢复3%生命', effect: 'lifeSteal', value: 0.03 },
    pandora: { name: '潘多拉魔盒', icon: '🎁', desc: '乱流房收益+35%，但乱流伤害+5%', effect: 'stormBonus', value: 0.35, penalty: { effect: 'stormRisk', value: 0.05 } },
    hunterMark: { name: '狩猎印记', icon: '🎯', desc: '精英战攻击+12%，精英币+15%', effect: 'eliteAttack', value: 0.12, bonus: { effect: 'eliteCurrency', value: 0.15 } },
    spiritCrown: { name: '精灵王冠', icon: '👑', desc: '精灵充能+35%，共鸣+8%', effect: 'spiritCharge', value: 0.35, bonus: { effect: 'spiritDouble', value: 0.08 } },
    apocalypseSigil: { name: '终焉印记', icon: '💀', desc: '首领战攻击+15%，每层-2秒', effect: 'bossAttack', value: 0.15, penalty: { effect: 'floorTimePenalty', value: 2 } },
    transcendentLens: { name: '超越透镜', icon: '🔭', desc: '行动耗时-10%，暴击率+5%', effect: 'timeSave', value: 0.1, bonus: { effect: 'critRate', value: 0.05 } },
    nexusCore: { name: '灵枢核心', icon: '💠', desc: '精灵充能+30%，每层+5秒', effect: 'spiritCharge', value: 0.3, bonus: { effect: 'floorTime', value: 5 } },
    mythicFang: { name: '神话之牙', icon: '🦷', desc: '暴击率+6%，首领攻击+10%', effect: 'critRate', value: 0.06, bonus: { effect: 'bossAttack', value: 0.1 } },
    bondCrystal: { name: '羁绊晶石', icon: '💞', desc: '精灵充能+25%，每层+3秒', effect: 'spiritCharge', value: 0.25, bonus: { effect: 'floorTime', value: 3 } },
    starShard: { name: '星灵残片', icon: '💫', desc: '精灵充能+40%，共鸣+10%', effect: 'spiritCharge', value: 0.4, bonus: { effect: 'spiritDouble', value: 0.1 } },
    archonCrown: { name: '星域王冠', icon: '👑', desc: '【主宰专属】首领攻击+20%，充能+30%，每层+3秒', effect: 'bossAttack', value: 0.2, bonus: { effect: 'spiritCharge', value: 0.3 }, exclusive: 'stararchon' },
    emperorSigil: { name: '帝皇灵印', icon: '🌌', desc: '【帝皇专属】充能+35%，首领攻击+12%', effect: 'spiritCharge', value: 0.35, bonus: { effect: 'bossAttack', value: 0.12 }, exclusive: 'spiritemperor' },
    dominionOrb: { name: '统御之珠', icon: '🔮', desc: '连击+8%，精英币+12%，充能+20%', effect: 'comboBoost', value: 0.08, bonus: { effect: 'eliteCurrency', value: 0.12 } },
    starVeilShard: { name: '星幕碎片', icon: '🛡️', desc: '反击-12%，共鸣+8%', effect: 'counterReduce', value: 0.12, bonus: { effect: 'spiritDouble', value: 0.08 } },
    tyrantSeal: { name: '暴君封印', icon: '🔱', desc: '【暴君专属】攻击+18%，首领攻+15%，每层+2秒', effect: 'attack', value: 0.18, bonus: { effect: 'bossAttack', value: 0.15 }, exclusive: 'celestialtyrant' },
    paradeBanner: { name: '巡礼旌旗', icon: '🎊', desc: '精灵充能+28%，连击+6%', effect: 'spiritCharge', value: 0.28, bonus: { effect: 'comboBoost', value: 0.06 } },
    affixGoggles: { name: '词条猎镜', icon: '🔍', desc: '对带词条怪物：赏金+15%，反击-10%', effect: 'affixReward', value: 0.15, bonus: { effect: 'affixCounterReduce', value: 0.1 } },
    affixSeal: { name: '词条封印', icon: '🔒', desc: '词条赏金+12%，反击-8%', effect: 'affixReward', value: 0.12, bonus: { effect: 'affixCounterReduce', value: 0.08 } },
    bondChalice: { name: '羁绊圣杯', icon: '🏆', desc: '精灵充能+22%，每层+2秒', effect: 'spiritCharge', value: 0.22, bonus: { effect: 'floorTime', value: 2 } },
    mirrorOfFate: { name: '命运棱镜', icon: '🔮', desc: '赌局+10%，随机事件收益+12%', effect: 'gamble', value: 0.1, bonus: { effect: 'eventBonus', value: 0.12 } },
    chromaticLens: { name: '彩光透镜', icon: '🌈', desc: '事件收益+10%，秘境币+8%', effect: 'eventBonus', value: 0.1, bonus: { effect: 'currency', value: 0.08 } },
    chronoCompass: { name: '时序罗盘', icon: '🧭', desc: '行动耗时-10%，每层+3秒', effect: 'timeSave', value: 0.1, bonus: { effect: 'floorTime', value: 3 } },
    librarySeal: { name: '秘闻封印', icon: '📚', desc: '特殊房权重感知+，事件收益+10%', effect: 'eventBonus', value: 0.1, bonus: { effect: 'comboBoost', value: 0.04 } },
    wishPendant: { name: '星愿挂坠', icon: '🌠', desc: '精灵充能+30%，共鸣+6%', effect: 'spiritCharge', value: 0.3, bonus: { effect: 'spiritDouble', value: 0.06 } },
    loomThread: { name: '织时丝线', icon: '🧵', desc: '每层+5秒，探索耗时-6%', effect: 'floorTime', value: 5, bonus: { effect: 'timeSave', value: 0.06 } },
    voidShard: { name: '虚空残片', icon: '🕳️', desc: '虚空共鸣+30%，反击-8%', effect: 'resonanceGain', value: 0.3, bonus: { effect: 'counterReduce', value: 0.08 } },
    omegaGear: { name: 'Ω序齿轮', icon: '⚙️', desc: '攻击+16%，每层-2秒', effect: 'attack', value: 0.16, penalty: { effect: 'floorTimePenalty', value: 2 } },
    singularityLens: { name: '奇点透镜', icon: '💠', desc: '暴击+7%，首领攻+14%，币+10%', effect: 'critRate', value: 0.07, bonus: { effect: 'bossAttack', value: 0.14 } },
    chromaticPrism: { name: '炫彩棱镜', icon: '🌈', desc: '事件+12%，特殊房感知+，币+8%', effect: 'eventBonus', value: 0.12, bonus: { effect: 'currency', value: 0.08 } },
    doomTicker: { name: '末日节拍器', icon: '⏰', desc: '战斗奖励+15%，每层-3秒', effect: 'battleReward', value: 0.15, penalty: { effect: 'floorTimePenalty', value: 3 } }
};

function getTsrEquipBagMax() {
    const bonus = Math.min(TSR_EQUIP_BAG_BONUS_MAX, Number(player.timeSecretRealm?.permanentBonuses?.equipBagBonus) || 0);
    return TSR_EQUIP_BAG_BASE + bonus * 2;
}

function ensureTsrRunEquipment(run) {
    if (!run) return;
    if (!run.equipped || typeof run.equipped !== 'object') {
        run.equipped = { weapon: null, armor: null, ring: null, chronos: null };
    }
    TSR_EQUIP_SLOTS.forEach(slot => {
        if (!(slot in run.equipped)) run.equipped[slot] = null;
        const item = run.equipped[slot];
        if (item) normalizeTsrEquipItem(item);
    });
    if (!Array.isArray(run.equipmentBag)) run.equipmentBag = [];
    run.equipmentBag.forEach(normalizeTsrEquipItem);
}

function getTsrEquipEnhanceMax() {
    return TSR_EQUIP_ENHANCE_MAX + (Number(player.timeSecretRealm?.permanentBonuses?.equipEnhanceMax) || 0);
}

function getTsrEquipSetByPrefix(prefix) {
    if (!prefix) return null;
    return Object.values(TSR_EQUIP_SETS).find(s => s.prefix === prefix) || null;
}

function getTsrEquipSetMeta(setId) {
    return TSR_EQUIP_SETS[setId] || null;
}

function getTsrEquipSetId(prefix) {
    const entry = Object.entries(TSR_EQUIP_SETS).find(([, s]) => s.prefix === prefix);
    return entry ? entry[0] : null;
}

function isTsrExclusiveEquipSet(setIdOrPrefix) {
    const set = TSR_EQUIP_SETS[setIdOrPrefix] || getTsrEquipSetByPrefix(setIdOrPrefix);
    return !!set?.exclusive;
}

function normalizeTsrEquipItem(item) {
    if (!item) return;
    if (item.enhanceLevel == null) item.enhanceLevel = 0;
    if (item.reforgeCount == null) item.reforgeCount = 0;
    if (!item.prefix && item.name) {
        const allPrefixes = [...TSR_EQUIP_PREFIXES, ...Object.values(TSR_EQUIP_SETS).filter(s => s.exclusive).map(s => s.prefix)];
        const hit = allPrefixes.find(p => item.name.startsWith(p));
        if (hit) item.prefix = hit;
    }
    if (!item.setId && item.prefix) item.setId = getTsrEquipSetId(item.prefix);
    if (item.setId && TSR_EQUIP_SETS[item.setId]?.exclusive) item.exclusive = true;
    if (!Array.isArray(item.affixes)) item.affixes = [];
    if (!item.stats) item.stats = createEmptyTsrEquipStats();
}

function getNextTsrEquipTier(tier) {
    const idx = TSR_EQUIP_TIER_ORDER.indexOf(tier);
    if (idx < 0 || idx >= TSR_EQUIP_TIER_ORDER.length - 1) return null;
    return TSR_EQUIP_TIER_ORDER[idx + 1];
}

function getTsrEquipBonus(key) {
    return Number(getTsrEquipmentBonuses()[key]) || 0;
}

function getTsrEquipEffectiveStats(item) {
    if (!item) return createEmptyTsrEquipStats();
    const lvl = Math.min(getTsrEquipEnhanceMax(), Number(item.enhanceLevel) || 0);
    const mult = 1 + lvl * TSR_EQUIP_ENHANCE_PER_LEVEL;
    const out = createEmptyTsrEquipStats();
    if (item.stats) mergeTsrEquipStatsInto(out, item.stats, mult);
    (item.affixes || []).forEach(ax => mergeTsrEquipStatsInto(out, ax.stats, mult));
    return out;
}

function getTsrEquipSetStatus() {
    const tsr = player.timeSecretRealm;
    ensureTsrRunEquipment(tsr?.currentRun);
    const counts = {};
    TSR_EQUIP_SLOTS.forEach(slot => {
        const item = tsr?.currentRun?.equipped?.[slot];
        if (!item?.prefix) return;
        counts[item.prefix] = (counts[item.prefix] || 0) + 1;
    });
    return counts;
}

function getTsrEquipSetBonuses() {
    const counts = getTsrEquipSetStatus();
    const totals = createEmptyTsrEquipStats();
    let activeSet4 = null;
    let activeLegendarySet4 = null;
    Object.entries(counts).forEach(([prefix, count]) => {
        const set = getTsrEquipSetByPrefix(prefix);
        if (!set) return;
        const bonus = count >= 4 ? set.bonus4 : (count >= 2 ? set.bonus2 : null);
        if (!bonus) return;
        if (count >= 4) {
            activeSet4 = set.name;
            if (set.exclusive) activeLegendarySet4 = set.name;
        }
        mergeTsrEquipStatsInto(totals, bonus);
    });
    return { totals, activeSet4, activeLegendarySet4 };
}

function hasTsrActiveLegendarySet4() {
    return !!getTsrEquipSetBonuses().activeLegendarySet4;
}

function recordTsrEquipCodex(item) {
    if (!item || isTsrTutorialRun()) return;
    const tsr = player.timeSecretRealm;
    if (!tsr.codex) tsr.codex = { rooms: {}, relics: {}, elites: 0, gambles: 0 };
    tsr.codex.equipmentDrops = (tsr.codex.equipmentDrops || 0) + 1;
    if (!tsr.codex.equipmentTiers) tsr.codex.equipmentTiers = {};
    tsr.codex.equipmentTiers[item.tier] = (tsr.codex.equipmentTiers[item.tier] || 0) + 1;
    if (item.setId) {
        if (!tsr.codex.equipmentSets) tsr.codex.equipmentSets = {};
        tsr.codex.equipmentSets[item.setId] = (tsr.codex.equipmentSets[item.setId] || 0) + 1;
        if (item.exclusive || TSR_EQUIP_SETS[item.setId]?.exclusive) {
            if (!tsr.codex.equipmentLegends) tsr.codex.equipmentLegends = {};
            tsr.codex.equipmentLegends[item.setId] = (tsr.codex.equipmentLegends[item.setId] || 0) + 1;
        }
    }
    recordTsrEquipAffixCodex(item.affixes);
}

function getTsrEquipEnhanceCost(item) {
    const tierIdx = Math.max(1, TSR_EQUIP_TIER_ORDER.indexOf(item?.tier) + 1);
    const lvl = Number(item?.enhanceLevel) || 0;
    const floor = player.timeSecretRealm?.currentRun?.currentFloor || 1;
    const discount = Number(player.timeSecretRealm?.permanentBonuses?.equipEnhanceDiscount) || 0;
    // 相对旧价约 1.7～2×：低难少卖装备后强化更需攒币
    let cost = Math.floor(40 + floor * 7 + lvl * 28 + tierIdx * 18);
    return Math.max(22, Math.floor(cost * (1 - discount)));
}

function getTsrEquipSalvageValue(item) {
    const base = TSR_EQUIP_SALVAGE_VALUE[item?.tier] || 3;
    const lvl = Number(item?.enhanceLevel) || 0;
    let val = Math.floor(base * (1 + lvl * 0.18));
    if (item?.exclusive) val = Math.floor(val * 1.3);
    return Math.max(1, val);
}

function rollTsrEquipItemStats(slot, tier, floor, statMult) {
    const tierStat = TSR_EQUIP_TIER_STAT[tier] || TSR_EQUIP_TIER_STAT.common;
    const meta = TSR_EQUIP_SLOT_META[slot];
    const floorScale = 1 + (Math.max(1, floor) - 1) * 0.022;
    const mult = (statMult || 1) * (TSR_EQUIP_POWER_MULT || 1);
    const tierIdx = getTsrEquipTierIdx(tier);
    const stats = createEmptyTsrEquipStats();
    const rollStat = (key, base) => {
        const sm = TSR_EQUIP_STAT_META[key];
        if (!sm) return;
        const variance = 0.9 + Math.random() * 0.28;
        const b = base != null ? base : (sm.base || 0.03);
        stats[key] = Math.round((b * tierStat.mult * floorScale * variance * mult) * 1000) / 1000;
    };
    rollStat(meta.primary, tierStat[meta.primary] || tierStat.attack);
    const statKeys = getTsrEquipStatKeys().filter(k => k !== meta.primary);
    const extraCount = 3 + Math.min(8, tierIdx + 1);
    const shuffled = statKeys.slice().sort(() => Math.random() - 0.5);
    for (let i = 0; i < extraCount && i < shuffled.length; i++) {
        const key = shuffled[i];
        const sm = TSR_EQUIP_STAT_META[key];
        const base = tierStat[key] || sm?.base || 0.01;
        if (Math.random() < 0.72 - i * 0.08) rollStat(key, base * (0.45 + Math.random() * 0.35));
    }
    return stats;
}

function getTsrEquipReforgeCost(item) {
    const tierIdx = Math.max(1, TSR_EQUIP_TIER_ORDER.indexOf(item?.tier) + 1);
    const times = Number(item?.reforgeCount) || 0;
    if (times >= TSR_EQUIP_REFORGE_MAX_PER_ITEM) return Infinity;
    const discount = Number(player.timeSecretRealm?.permanentBonuses?.equipReforgeDiscount) || 0;
    let cost = Math.floor(42 + tierIdx * 16 + times * 14 + (item?.exclusive ? 25 : 0));
    return Math.max(15, Math.floor(cost * (1 - discount)));
}

function reforgeTsrEquipItem(item) {
    if (!item) return false;
    const times = Number(item.reforgeCount) || 0;
    if (times >= TSR_EQUIP_REFORGE_MAX_PER_ITEM) return false;
    const floor = player.timeSecretRealm?.currentRun?.currentFloor || 1;
    const mult = item.exclusive ? TSR_EQUIP_EXCLUSIVE_STAT_MULT : 1;
    item.stats = rollTsrEquipItemStats(item.slot, item.tier, floor, mult);
    item.reforgeCount = times + 1;
    const tsr = player.timeSecretRealm;
    tsr.currentRun.equipReforgeCount = (tsr.currentRun.equipReforgeCount || 0) + 1;
    if (tsr.currentRun.equipReforgeCount >= 8) checkTsrAchievements({ runEquipReforgeCount: tsr.currentRun.equipReforgeCount });
    return true;
}

function rollTsrEquipTier(opts) {
    const floor = opts?.floor || player.timeSecretRealm?.currentRun?.currentFloor || 1;
    const tier = getTsrDifficultyTier();
    const weights = { common: 12, uncommon: 8, rare: 4.5, epic: 2.2, legendary: 0.9, mythic: 0.25 };
    if (opts?.isBoss) {
        weights.common = 2; weights.uncommon = 5; weights.rare = 6; weights.epic = 4; weights.legendary = 2.2; weights.mythic = 0.8;
    } else if (opts?.isElite) {
        weights.common = 5; weights.uncommon = 7; weights.rare = 5.5; weights.epic = 3; weights.legendary = 1.4; weights.mythic = 0.4;
    }
    if (floor >= 8) { weights.rare += 1.2; weights.epic += 0.6; }
    if (floor >= 15) { weights.legendary += 0.5; weights.mythic += 0.15; }
    weights.rare += tier * 0.35;
    weights.epic += tier * 0.2;
    weights.legendary += tier * 0.1;
    if (opts?.tierHint && TSR_EQUIP_TIER_STAT[opts.tierHint]) {
        weights[opts.tierHint] = (weights[opts.tierHint] || 1) * 3;
    }
    const entries = Object.entries(weights).filter(([, w]) => w > 0);
    const total = entries.reduce((s, [, w]) => s + w, 0);
    let roll = Math.random() * total;
    for (const [key, w] of entries) {
        roll -= w;
        if (roll <= 0) return key;
    }
    return 'common';
}

function generateTsrExclusiveEquipment(setId, slot, opts) {
    const set = TSR_EQUIP_SETS[setId];
    const piece = TSR_EQUIP_EXCLUSIVE_NAMES[setId]?.[slot];
    if (!set || !piece) return null;
    const floor = opts?.floor || player.timeSecretRealm?.currentRun?.currentFloor || 1;
    const tier = opts?.tier && TSR_EQUIP_TIER_STAT[opts.tier] ? opts.tier : 'legendary';
    const stats = rollTsrEquipItemStats(slot, tier, floor, TSR_EQUIP_EXCLUSIVE_STAT_MULT);
    const affixes = rollTsrEquipAffixes(tier, { floor });
    const item = {
        id: 'eq_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        slot,
        tier,
        prefix: set.prefix,
        setId,
        exclusive: true,
        name: piece.name,
        icon: piece.icon || TSR_EQUIP_SLOT_META[slot].icon,
        enhanceLevel: 0,
        reforgeCount: 0,
        affixes,
        stats
    };
    normalizeTsrEquipItem(item);
    return item;
}

function generateTsrEquipment(opts) {
    const slot = opts?.slot && TSR_EQUIP_SLOT_META[opts.slot]
        ? opts.slot
        : TSR_EQUIP_SLOTS[Math.floor(Math.random() * TSR_EQUIP_SLOTS.length)];
    const tier = opts?.tier && TSR_EQUIP_TIER_STAT[opts.tier] ? opts.tier : rollTsrEquipTier(opts);
    const meta = TSR_EQUIP_SLOT_META[slot];
    const setPrefixes = TSR_EQUIP_PREFIXES;
    const extraPrefixes = (typeof TSR_EQUIP_NAME_PREFIXES !== 'undefined' ? TSR_EQUIP_NAME_PREFIXES : setPrefixes)
        .filter(p => !setPrefixes.includes(p));
    const prefix = (Math.random() < 0.68 || !extraPrefixes.length)
        ? setPrefixes[Math.floor(Math.random() * setPrefixes.length)]
        : extraPrefixes[Math.floor(Math.random() * extraPrefixes.length)];
    const floor = opts?.floor || player.timeSecretRealm?.currentRun?.currentFloor || 1;
    const stats = rollTsrEquipItemStats(slot, tier, floor, 1);
    const affixes = rollTsrEquipAffixes(tier, { floor });
    const name = buildTsrEquipDisplayName({ prefix, slot, tier, affixes });
    const item = {
        id: 'eq_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        slot,
        tier,
        prefix,
        setId: getTsrEquipSetId(prefix),
        name,
        icon: meta.icon,
        enhanceLevel: 0,
        reforgeCount: 0,
        affixes,
        stats
    };
    normalizeTsrEquipItem(item);
    return item;
}

function formatTsrEquipStats(item, useEffective) {
    if (!item) return '';
    const s = useEffective ? getTsrEquipEffectiveStats(item) : (item.stats || createEmptyTsrEquipStats());
    return formatTsrEquipStatText(s, { enhanceLevel: useEffective ? (item.enhanceLevel || 0) : 0, exclusive: item.exclusive });
}

function formatTsrEquipStatsCompact(item, useEffective, maxStats) {
    if (!item) return '';
    const s = useEffective ? getTsrEquipEffectiveStats(item) : (item.stats || createEmptyTsrEquipStats());
    const parts = [];
    getTsrEquipStatKeys().forEach(k => {
        const v = Number(s[k]) || 0;
        if (!v) return;
        const meta = TSR_EQUIP_STAT_META[k];
        if (!meta) return;
        parts.push({ k, v, meta });
    });
    parts.sort((a, b) => b.v - a.v);
    const show = parts.slice(0, maxStats || 5);
    return show.map(p => `${p.meta.short}+${(p.v * 100).toFixed(p.v < 0.01 ? 1 : 0)}%`).join(' · ')
        + (parts.length > show.length ? ' …' : '');
}

function getTsrEquipmentBonuses() {
    const tsr = player.timeSecretRealm;
    ensureTsrRunEquipment(tsr?.currentRun);
    const totals = createEmptyTsrEquipStats();
    TSR_EQUIP_SLOTS.forEach(slot => {
        const item = tsr?.currentRun?.equipped?.[slot];
        if (!item) return;
        mergeTsrEquipStatsInto(totals, getTsrEquipEffectiveStats(item));
    });
    const filled = TSR_EQUIP_SLOTS.filter(s => tsr?.currentRun?.equipped?.[s]).length;
    if (filled >= 4) {
        totals.attack += 0.06;
        totals.health += 0.06;
    }
    mergeTsrEquipStatsInto(totals, getTsrEquipSetBonuses().totals);
    return totals;
}

function getTsrRunMaxEquipEnhance() {
    const tsr = player.timeSecretRealm;
    ensureTsrRunEquipment(tsr?.currentRun);
    let max = 0;
    const scan = item => { if (item) max = Math.max(max, Number(item.enhanceLevel) || 0); };
    TSR_EQUIP_SLOTS.forEach(s => scan(tsr.currentRun.equipped[s]));
    (tsr.currentRun.equipmentBag || []).forEach(scan);
    return max;
}

function hasTsrActiveEquipSet4() {
    return !!getTsrEquipSetBonuses().activeSet4;
}

function getTsrEquipTierLabel(tier) {
    const style = getTsrEquipTierStyle(tier);
    return style.label || (TSR_MONSTER_TIER_META[tier] || TSR_MONSTER_TIER_META.common).label;
}

function getTsrEquipTierColor(tier) {
    const style = getTsrEquipTierStyle(tier);
    return style.color || (TSR_MONSTER_TIER_META[tier] || TSR_MONSTER_TIER_META.common).color;
}

function addTsrEquipment(item, sourceLabel) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive || !item) return false;
    ensureTsrRunEquipment(tsr.currentRun);
    const bagMax = getTsrEquipBagMax();
    const tierMeta = TSR_MONSTER_TIER_META[item.tier] || TSR_MONSTER_TIER_META.common;
    if (tsr.currentRun.equipmentBag.length >= bagMax) {
        tsr.currentRun.pendingEquipDrop = item;
        showTsrEquipOverflowPanel(item);
        return false;
    }
    tsr.currentRun.equipmentBag.push(item);
    recordTsrEquipCodex(item);
    const src = sourceLabel ? `【${sourceLabel}】` : '';
    addTsrLog(`${src}获得装备：${item.icon} ${tierMeta.label}·${item.name}（${formatTsrEquipStats(item)}）`, 'success');
    invalidateTsrUiCache(['equipment', 'codex']);
    updateTsrEquipmentDisplay();
    syncTsrRunStatsAfterBuffChange(calculateTsrPlayerHealth());
    return true;
}

function tryDropTsrEquipment(sourceLabel, opts) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return false;
    let chance = opts?.chance ?? 0.48;
    if (opts?.isElite) chance = 0.85 + getTsrDifficultyTier() * 0.02;
    if (opts?.isBoss) chance = 0.95 + getTsrDifficultyTier() * 0.01;
    if (opts?.isTreasure) chance = 0.58;
    if (opts?.isForge) chance = 1;
    const dropBonus = (typeof getTsrEquipBonus === 'function' ? getTsrEquipBonus('equipDrop') : 0)
        + (typeof getTsrRelicBonus === 'function' ? getTsrRelicBonus('equipDrop') : 0);
    if (dropBonus) chance = Math.min(0.95, chance + dropBonus);
    if (Math.random() >= chance) return false;
    const item = generateTsrEquipment({
        floor: tsr.currentRun.currentFloor,
        isBoss: opts?.isBoss,
        isElite: opts?.isElite,
        tier: opts?.tier,
        slot: opts?.slot
    });
    return addTsrEquipment(item, sourceLabel);
}

function tryDropTsrExclusiveEquipment(monsterId, isBoss) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return false;
    let drop = TSR_EQUIP_EXCLUSIVE_DROPS[monsterId];
    if (!drop && isBoss) {
        const diffTier = getTsrDifficultyTier();
        if (diffTier >= 11 && Math.random() < 0.09) {
            drop = { setId: 'qidian', chance: 1, tier: 'mythic' };
        } else if (diffTier >= 10 && Math.random() < 0.11) {
            drop = { setId: 'omegax', chance: 1, tier: 'legendary' };
        }
    }
    if (!drop || Math.random() >= drop.chance) return false;
    const slot = TSR_EQUIP_SLOTS[Math.floor(Math.random() * TSR_EQUIP_SLOTS.length)];
    const item = generateTsrExclusiveEquipment(drop.setId, slot, {
        tier: drop.tier,
        floor: tsr.currentRun.currentFloor
    });
    if (!item) return false;
    const setMeta = getTsrEquipSetMeta(drop.setId);
    return addTsrEquipment(item, setMeta?.name || '传说专属');
}

function equipTsrFromBag(bagIndex) {
    const tsr = player.timeSecretRealm;
    ensureTsrRunEquipment(tsr?.currentRun);
    const bag = tsr?.currentRun?.equipmentBag || [];
    const item = bag[bagIndex];
    if (!item) return;
    const slot = item.slot;
    const prev = tsr.currentRun.equipped[slot];
    if (prev) bag.push(prev);
    tsr.currentRun.equipped[slot] = item;
    bag.splice(bagIndex, 1);
    addTsrLog(`装备 ${item.icon} ${item.name}（${TSR_EQUIP_SLOT_META[slot].name}）`, 'success');
    invalidateTsrUiCache('equipment');
    updateTsrEquipmentDisplay();
    syncTsrRunStatsAfterBuffChange(calculateTsrPlayerHealth());
    updateTsrCombatBar();
    updateHealthBar();
}

function unequipTsrSlot(slot) {
    const tsr = player.timeSecretRealm;
    ensureTsrRunEquipment(tsr?.currentRun);
    const item = tsr?.currentRun?.equipped?.[slot];
    if (!item) return;
    const bagMax = getTsrEquipBagMax();
    if ((tsr.currentRun.equipmentBag || []).length >= bagMax) {
        addTsrLog('背包已满，无法卸下装备', 'warning');
        return;
    }
    tsr.currentRun.equipmentBag.push(item);
    tsr.currentRun.equipped[slot] = null;
    addTsrLog(`卸下 ${item.icon} ${item.name}`, 'info');
    invalidateTsrUiCache('equipment');
    updateTsrEquipmentDisplay();
    syncTsrRunStatsAfterBuffChange(calculateTsrPlayerHealth());
    updateTsrCombatBar();
    updateHealthBar();
}

function enhanceTsrEquipped(slot) {
    const tsr = player.timeSecretRealm;
    ensureTsrRunEquipment(tsr?.currentRun);
    const item = tsr?.currentRun?.equipped?.[slot];
    if (!item) return;
    const maxLv = getTsrEquipEnhanceMax();
    const lvl = Number(item.enhanceLevel) || 0;
    if (lvl >= maxLv) {
        addTsrLog(`已达强化上限+${maxLv}`, 'warning');
        return;
    }
    const cost = getTsrEquipEnhanceCost(item);
    if ((tsr.currentRun.currencyEarned || 0) < cost) {
        addTsrLog(`秘境币不足，强化需要${cost}币`, 'warning');
        return;
    }
    tsr.currentRun.currencyEarned -= cost;
    item.enhanceLevel = lvl + 1;
    addTsrLog(`强化成功！${item.icon} ${item.name} → +${item.enhanceLevel}（${formatTsrEquipStats(item, true)}）`, 'success');
    if (item.enhanceLevel >= 5) checkTsrAchievements({ runEquipEnhance5: true });
    invalidateTsrUiCache('equipment');
    updateTsrEquipmentDisplay();
    syncTsrRunStatsAfterBuffChange(calculateTsrPlayerHealth());
    updateTsrCombatBar();
    updateHealthBar();
    updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
}

function reforgeTsrEquipped(slot) {
    const tsr = player.timeSecretRealm;
    ensureTsrRunEquipment(tsr?.currentRun);
    const item = tsr?.currentRun?.equipped?.[slot];
    if (!item) return;
    const cost = getTsrEquipReforgeCost(item);
    if (!Number.isFinite(cost)) {
        addTsrLog('该装备洗炼次数已达上限', 'warning');
        return;
    }
    if ((tsr.currentRun.currencyEarned || 0) < cost) {
        addTsrLog(`秘境币不足，洗炼需要${cost}币`, 'warning');
        return;
    }
    tsr.currentRun.currencyEarned -= cost;
    reforgeTsrEquipItem(item);
    addTsrLog(`洗炼成功！${item.icon} ${item.name} 属性重铸（${formatTsrEquipStats(item, true)}）`, 'success');
    invalidateTsrUiCache('equipment');
    updateTsrEquipmentDisplay();
    syncTsrRunStatsAfterBuffChange(calculateTsrPlayerHealth());
    updateTsrCombatBar();
    updateHealthBar();
    updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
}

function reforgeTsrFromBag(bagIndex) {
    const tsr = player.timeSecretRealm;
    const bag = tsr?.currentRun?.equipmentBag;
    const item = bag?.[bagIndex];
    if (!item) return;
    const cost = getTsrEquipReforgeCost(item);
    if (!Number.isFinite(cost)) {
        addTsrLog('该装备洗炼次数已达上限', 'warning');
        return;
    }
    if ((tsr.currentRun.currencyEarned || 0) < cost) {
        addTsrLog(`秘境币不足，洗炼需要${cost}币`, 'warning');
        return;
    }
    tsr.currentRun.currencyEarned -= cost;
    reforgeTsrEquipItem(item);
    addTsrLog(`洗炼背包装备：${item.icon} ${item.name}（${formatTsrEquipStats(item, true)}）`, 'success');
    invalidateTsrUiCache('equipment');
    updateTsrEquipmentDisplay();
    updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
}

function tsrChooseEquipReforge(target, index) {
    hideTsrEquipReforgePanel();
    if (target === 'equipped') reforgeTsrEquipped(index);
    else reforgeTsrFromBag(Number(index));
    const tsr = player.timeSecretRealm;
    if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
    else afterAction();
}

function showTsrEquipReforgePanel() {
    const tsr = player.timeSecretRealm;
    ensureTsrRunEquipment(tsr?.currentRun);
    const panel = document.getElementById('tsrEquipReforgePanel');
    const container = document.getElementById('tsrEquipReforgeChoices');
    if (!panel || !container) return;
    const runCurrency = tsr.currentRun.currencyEarned || 0;
    const choices = [];
    TSR_EQUIP_SLOTS.forEach(slot => {
        const item = tsr.currentRun.equipped[slot];
        if (!item) return;
        const cost = getTsrEquipReforgeCost(item);
        if (!Number.isFinite(cost)) return;
        choices.push({ target: 'equipped', index: slot, item, cost });
    });
    (tsr.currentRun.equipmentBag || []).forEach((item, idx) => {
        const cost = getTsrEquipReforgeCost(item);
        if (!Number.isFinite(cost)) return;
        choices.push({ target: 'bag', index: idx, item, cost });
    });
    if (!choices.length) {
        addTsrLog('没有可洗炼的装备', 'warning');
        return;
    }
    panel.style.display = 'block';
    container.innerHTML = choices.map(c => {
        const color = getTsrEquipTierColor(c.item.tier);
        const canAfford = runCurrency >= c.cost;
        const slotLabel = c.target === 'equipped' ? TSR_EQUIP_SLOT_META[c.index].name : '背包';
        return `<button type="button" class="tsr-equip-reforge-btn" ${canAfford ? '' : 'disabled'} onclick="tsrChooseEquipReforge('${c.target}', '${c.index}')">
            <span style="color:${color};">${c.item.icon} ${c.item.name}${c.item.exclusive ? ' ★' : ''} · ${slotLabel}</span>
            <span class="tsr-equip-stat-line">${formatTsrEquipStats(c.item, true)} · 洗炼${c.cost}币（${c.item.reforgeCount || 0}/${TSR_EQUIP_REFORGE_MAX_PER_ITEM}）</span>
        </button>`;
    }).join('');
}

function hideTsrEquipReforgePanel() {
    const panel = document.getElementById('tsrEquipReforgePanel');
    if (panel) {
        panel.style.display = 'none';
        const container = document.getElementById('tsrEquipReforgeChoices');
        if (container) container.innerHTML = '';
    }
}

function salvageTsrEquipFromBag(bagIndex) {
    const tsr = player.timeSecretRealm;
    const bag = tsr?.currentRun?.equipmentBag;
    if (!bag || !bag[bagIndex]) return;
    const item = bag.splice(bagIndex, 1)[0];
    const value = getTsrEquipSalvageValue(item);
    const gained = addTsrRunCurrency(value, { skipGainScale: true });
    addTsrLog(`分解 ${item.icon} ${item.name}，获得${gained}秘境币`, 'info');
    invalidateTsrUiCache('equipment');
    updateTsrEquipmentDisplay();
    updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
}

function findTsrEquipFusionPair() {
    const bag = player.timeSecretRealm?.currentRun?.equipmentBag || [];
    const groups = {};
    bag.forEach((item, idx) => {
        if (!getNextTsrEquipTier(item.tier) || item.exclusive) return;
        if (!groups[item.tier]) groups[item.tier] = [];
        groups[item.tier].push(idx);
    });
    for (const tier of TSR_EQUIP_TIER_ORDER) {
        const arr = groups[tier];
        if (arr && arr.length >= 2) return { tier, idxA: arr[0], idxB: arr[1] };
    }
    return null;
}

function fuseTsrEquipPair(idxA, idxB) {
    const tsr = player.timeSecretRealm;
    ensureTsrRunEquipment(tsr?.currentRun);
    const bag = tsr.currentRun.equipmentBag;
    const a = bag[idxA];
    const b = bag[idxB];
    if (!a || !b || a.tier !== b.tier || a.exclusive || b.exclusive) return false;
    const nextTier = getNextTsrEquipTier(a.tier);
    if (!nextTier) return false;
    const hi = Math.max(idxA, idxB);
    const lo = Math.min(idxA, idxB);
    bag.splice(hi, 1);
    bag.splice(lo, 1);
    const fused = generateTsrEquipment({
        tier: nextTier,
        floor: tsr.currentRun.currentFloor,
        slot: Math.random() < 0.5 ? a.slot : b.slot,
        tierHint: nextTier
    });
    if (fused.prefix === a.prefix || fused.prefix === b.prefix) {
        fused.prefix = a.prefix;
        fused.setId = a.setId || b.setId;
        fused.name = buildTsrEquipDisplayName({ prefix: fused.prefix, slot: fused.slot, tier: fused.tier, affixes: fused.affixes });
    }
    addTsrLog(`熔炼成功！${getTsrEquipTierLabel(a.tier)}×2 → ${getTsrEquipTierLabel(nextTier)}·${fused.name}`, 'success');
    return addTsrEquipment(fused, '熔炼');
}

function tsrChooseEquipFusion(idxA, idxB) {
    hideTsrEquipFusionPanel();
    fuseTsrEquipPair(idxA, idxB);
    const tsr = player.timeSecretRealm;
    if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
    else afterAction();
}

function showTsrEquipFusionPanel() {
    const tsr = player.timeSecretRealm;
    const bag = tsr?.currentRun?.equipmentBag || [];
    const panel = document.getElementById('tsrEquipFusionPanel');
    const container = document.getElementById('tsrEquipFusionChoices');
    if (!panel || !container) return;
    const groups = {};
    bag.forEach((item, idx) => {
        if (!getNextTsrEquipTier(item.tier) || item.exclusive) return;
        if (!groups[item.tier]) groups[item.tier] = [];
        groups[item.tier].push({ item, idx });
    });
    const pairs = [];
    Object.entries(groups).forEach(([tier, arr]) => {
        for (let i = 0; i + 1 < arr.length; i += 2) {
            pairs.push({ tier, a: arr[i], b: arr[i + 1] });
        }
    });
    if (!pairs.length) {
        addTsrLog('背包中没有可熔炼的同品质装备对', 'warning');
        return;
    }
    panel.style.display = 'block';
    container.innerHTML = pairs.map(p => {
        const next = getNextTsrEquipTier(p.tier);
        return `<button type="button" class="tsr-equip-fusion-btn" onclick="tsrChooseEquipFusion(${p.a.idx}, ${p.b.idx})">
            <span>🔥 ${getTsrEquipTierLabel(p.tier)}×2 → ${getTsrEquipTierLabel(next)}</span>
            <span class="tsr-equip-stat-line">${p.a.item.icon} ${p.a.item.name} + ${p.b.item.icon} ${p.b.item.name}</span>
        </button>`;
    }).join('');
}

function hideTsrEquipFusionPanel() {
    const panel = document.getElementById('tsrEquipFusionPanel');
    if (panel) {
        panel.style.display = 'none';
        const container = document.getElementById('tsrEquipFusionChoices');
        if (container) container.innerHTML = '';
    }
}

function tsrResolveEquipOverflow(action, bagIndex) {
    const tsr = player.timeSecretRealm;
    const pending = tsr?.currentRun?.pendingEquipDrop;
    if (!pending) return;
    hideTsrEquipOverflowPanel();
    if (action === 'discard') {
        addTsrLog(`背包已满，丢弃 ${pending.icon} ${pending.name}`, 'warning');
    } else if (action === 'replace' && bagIndex != null) {
        const bag = tsr.currentRun.equipmentBag || [];
        const old = bag[bagIndex];
        if (old) addTsrLog(`替换丢弃：${old.icon} ${old.name}`, 'warning');
        bag[bagIndex] = pending;
        addTsrLog(`获得装备：${pending.icon} ${pending.name}（${formatTsrEquipStats(pending)}）`, 'success');
        recordTsrEquipCodex(pending);
    }
    tsr.currentRun.pendingEquipDrop = null;
    invalidateTsrUiCache(['equipment', 'codex']);
    updateTsrEquipmentDisplay();
}

function showTsrEquipOverflowPanel(item) {
    const panel = document.getElementById('tsrEquipOverflowPanel');
    const container = document.getElementById('tsrEquipOverflowChoices');
    if (!panel || !container) {
        addTsrLog(`背包已满，无法拾取 ${item.icon} ${item.name}`, 'warning');
        player.timeSecretRealm.currentRun.pendingEquipDrop = null;
        return;
    }
    const tierColor = getTsrEquipTierColor(item.tier);
    const bag = player.timeSecretRealm?.currentRun?.equipmentBag || [];
    panel.style.display = 'block';
    container.innerHTML = `
        <div class="tsr-equip-overflow-new" style="border-color:${tierColor};">
            <div style="font-weight:bold;color:${tierColor};">${item.icon} ${getTsrEquipTierLabel(item.tier)}·${item.name}</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">${formatTsrEquipStats(item)}</div>
            <p style="font-size:12px;color:#fbbf24;margin:8px 0 0;">背包已满，选择一件替换或放弃新装备</p>
        </div>
        <div class="tsr-equip-overflow-bag">
            ${bag.map((b, i) => `
                <button type="button" class="tsr-equip-overflow-btn" onclick="tsrResolveEquipOverflow('replace', ${i})">
                    <span style="color:${getTsrEquipTierColor(b.tier)};">${b.icon} ${b.name}</span>
                    <span style="font-size:11px;color:#94a3b8;">${formatTsrEquipStats(b)}</span>
                </button>
            `).join('')}
        </div>
        <button type="button" class="tsr-btn tsr-btn-ghost" style="margin-top:8px;width:100%;" onclick="tsrResolveEquipOverflow('discard')">放弃新装备</button>
    `;
}

function hideTsrEquipOverflowPanel() {
    const panel = document.getElementById('tsrEquipOverflowPanel');
    if (panel) {
        panel.style.display = 'none';
        const container = document.getElementById('tsrEquipOverflowChoices');
        if (container) container.innerHTML = '';
    }
}

function getTsrBattleEquipDamageMult(opts) {
    const eq = getTsrEquipmentBonuses();
    let m = 1 + (eq.pen || 0) + (eq.damageAmp || 0) + (eq.physicalPower || 0) * 0.5 + (eq.spellPower || 0) * 0.5
        + (eq.elemental || 0) * 0.4 + (eq.holyPower || 0) * 0.35 + (eq.shadowPower || 0) * 0.35
        + (eq.fireDamage || 0) * 0.3 + (eq.iceDamage || 0) * 0.3 + (eq.lightningDamage || 0) * 0.32
        + (eq.poisonDamage || 0) * 0.28 + (eq.arcaneDamage || 0) * 0.3
        + (eq.chaosPower || 0) * 0.25 + (eq.cursePower || 0) * 0.22 + (eq.doomPower || 0) * 0.22 + (eq.entropy || 0) * 0.2;
    if (opts?.isBoss) m += (eq.bossDamage || 0) + (eq.mythicDamage || 0) * 0.5;
    if (opts?.isElite) m += eq.eliteDamage || 0;
    if (opts?.rounds === 1) m += eq.firstStrike || 0;
    if (opts?.monsterMaxHp > 0 && opts.monsterHp / opts.monsterMaxHp < 0.3) m += eq.execution || 0;
    const voidRes = player.timeSecretRealm?.currentRun?.voidResonance || 0;
    if (voidRes >= 40) m += (eq.voidPower || 0) * Math.min(1, voidRes / 100);
    if ((opts?.monster?.affixKeys || []).length) m += (eq.afflictDamage || 0) * 0.6;
    return m;
}

/** 装备侧栏展开态（详情操作），避免每格常驻三按钮把面板拉很长 */
window._tsrEquipUi = window._tsrEquipUi || { openSlot: null, openBagIdx: null };

function toggleTsrEquipSlotDetail(slot) {
    const ui = window._tsrEquipUi;
    ui.openSlot = ui.openSlot === slot ? null : slot;
    ui.openBagIdx = null;
    invalidateTsrUiCache('equipment');
    updateTsrEquipmentDisplay();
}

function toggleTsrEquipBagDetail(idx) {
    const ui = window._tsrEquipUi;
    const n = Number(idx);
    ui.openBagIdx = ui.openBagIdx === n ? null : n;
    ui.openSlot = null;
    invalidateTsrUiCache('equipment');
    updateTsrEquipmentDisplay();
}

function buildTsrEquipAttrSummaryHtml() {
    const bonuses = getTsrEquipmentBonuses();
    const chips = [];
    getTsrEquipStatKeys().forEach(k => {
        const v = Number(bonuses[k]) || 0;
        if (!v) return;
        const meta = TSR_EQUIP_STAT_META[k];
        if (!meta) return;
        chips.push({ meta, v });
    });
    if (!chips.length) return '';
    chips.sort((a, b) => b.v - a.v);
    const chipHtml = chips.map(({ meta, v }) =>
        `<span class="tsr-equip-attr-chip" title="${meta.label}">${meta.icon}${meta.short}+${(v * 100).toFixed(v < 0.01 ? 1 : 0)}%</span>`
    ).join('');
    return `<details class="tsr-equip-attr-details">
        <summary>📊 属性汇总 <span class="tsr-equip-attr-count">${chips.length}</span></summary>
        <div class="tsr-equip-attr-grid">${chipHtml}</div>
    </details>`;
}

function getTsrEquipSignature() {
    const run = player.timeSecretRealm?.currentRun;
    if (!run) return '';
    ensureTsrRunEquipment(run);
    const itemSig = item => {
        if (!item) return '';
        const ax = (item.affixes || []).map(a => a.id).join('+');
        return `${item.id}:${item.enhanceLevel || 0}:${item.reforgeCount || 0}:${ax}`;
    };
    const eq = TSR_EQUIP_SLOTS.map(s => itemSig(run.equipped?.[s]) || `${s}:`).join('|');
    const bag = (run.equipmentBag || []).map(itemSig).join(',');
    const currency = run.currencyEarned || 0;
    const ui = window._tsrEquipUi || {};
    return `${eq}#${bag}#${currency}#${ui.openSlot || ''}:${ui.openBagIdx ?? ''}`;
}

function updateTsrEquipmentDisplay() {
    const container = document.getElementById('tsrCurrentEquipment');
    if (!container) return;
    const sig = getTsrEquipSignature();
    if (_tsrUiCache.equipment === sig) return;
    _tsrUiCache.equipment = sig;
    const tsr = player.timeSecretRealm;
    ensureTsrRunEquipment(tsr?.currentRun);
    const equipped = tsr?.currentRun?.equipped || {};
    const bag = tsr?.currentRun?.equipmentBag || [];
    const bagMax = getTsrEquipBagMax();
    const runCurrency = tsr?.currentRun?.currencyEarned || 0;
    const setStatus = getTsrEquipSetStatus();
    const setBonus = getTsrEquipSetBonuses();
    const openSlot = window._tsrEquipUi?.openSlot || null;
    const openBagIdx = window._tsrEquipUi?.openBagIdx;
    let html = buildTsrEquipAttrSummaryHtml();
    if (Object.keys(setStatus).length) {
        html += '<div class="tsr-equip-set-chips">';
        Object.entries(setStatus).forEach(([prefix, count]) => {
            const set = getTsrEquipSetByPrefix(prefix);
            if (!set) return;
            const active = count >= 4 ? '4' : (count >= 2 ? '2' : '');
            const legendCls = set.exclusive ? ' tsr-equip-set-legend' : '';
            html += `<span class="tsr-equip-set-chip ${active ? 'active' : ''}${legendCls}" title="${set.name}">
                ${set.icon}${count}/4${active ? `·${active}` : ''}
            </span>`;
        });
        html += '</div>';
    }
    html += '<div class="tsr-equip-section-label">已装备</div>';
    html += '<div class="tsr-equip-slots tsr-equip-slots-grid">';
    TSR_EQUIP_SLOTS.forEach(slot => {
        const meta = TSR_EQUIP_SLOT_META[slot];
        const item = equipped[slot];
        const expanded = openSlot === slot;
        if (item) {
            const color = getTsrEquipTierColor(item.tier);
            const lvl = Number(item.enhanceLevel) || 0;
            const maxLv = getTsrEquipEnhanceMax();
            const canEnhance = lvl < maxLv;
            const cost = canEnhance ? getTsrEquipEnhanceCost(item) : 0;
            const reforgeCost = getTsrEquipReforgeCost(item);
            const canReforge = Number.isFinite(reforgeCost);
            const borderColor = item.exclusive ? '#fbbf24' : color;
            const enhanceBtn = canEnhance
                ? `<button type="button" class="tsr-equip-enhance" onclick="event.stopPropagation();enhanceTsrEquipped('${slot}')" ${runCurrency < cost ? 'disabled' : ''}>强化 ${cost}</button>`
                : `<span class="tsr-equip-enhance-max">+${lvl}满</span>`;
            const reforgeBtn = canReforge
                ? `<button type="button" class="tsr-equip-reforge" onclick="event.stopPropagation();reforgeTsrEquipped('${slot}')" ${runCurrency < reforgeCost ? 'disabled' : ''}>洗炼 ${reforgeCost}</button>`
                : '';
            html += `<div class="tsr-equip-slot filled${item.exclusive ? ' tsr-equip-exclusive' : ''}${expanded ? ' expanded' : ''}" style="border-color:${borderColor};" onclick="toggleTsrEquipSlotDetail('${slot}')" title="点击展开/收起">
                <div class="tsr-equip-slot-top">
                    <span class="tsr-equip-slot-kind">${meta.icon} ${meta.name}</span>
                    ${formatTsrEquipTierBadge(item.tier)}
                </div>
                <div class="tsr-equip-slot-main">
                    <span class="tsr-equip-slot-ico">${item.icon || meta.icon}</span>
                    <div class="tsr-equip-slot-brief">
                        <div class="tsr-equip-name-row">${formatTsrEquipNameHtml(item)}</div>
                        <div class="tsr-equip-stat-line">${formatTsrEquipStatsCompact(item, true, 3)}</div>
                    </div>
                </div>
                ${expanded ? `<div class="tsr-equip-slot-detail" onclick="event.stopPropagation()">
                    ${item.affixes?.length ? `<div class="tsr-equip-affix-row">${formatTsrEquipAffixLine(item.affixes, 5)}</div>` : ''}
                    <div class="tsr-equip-stat-line">${formatTsrEquipStatsCompact(item, true, 8)}</div>
                    <div class="tsr-equip-slot-actions">
                        ${enhanceBtn}
                        ${reforgeBtn}
                        <button type="button" class="tsr-equip-unequip" onclick="unequipTsrSlot('${slot}')">卸下</button>
                    </div>
                </div>` : ''}
            </div>`;
        } else {
            html += `<div class="tsr-equip-slot empty">
                <span class="tsr-equip-slot-kind">${meta.icon} ${meta.name}</span>
                <span class="tsr-equip-empty-label">空</span>
            </div>`;
        }
    });
    html += '</div>';
    if (setBonus.activeLegendarySet4) {
        html += `<div class="tsr-equip-set-bonus tsr-equip-legend-bonus">★ ${setBonus.activeLegendarySet4} 传说四件套已激活</div>`;
    } else if (setBonus.activeSet4) {
        html += `<div class="tsr-equip-set-bonus">${setBonus.activeSet4} 四件套已激活</div>`;
    } else {
        const filled = TSR_EQUIP_SLOTS.filter(s => equipped[s]).length;
        if (filled >= 4) html += '<div class="tsr-equip-set-bonus">四槽齐全：攻血+4%</div>';
    }
    html += `<div class="tsr-equip-bag-head"><span>背包</span><span>${bag.length}/${bagMax}</span></div>`;
    if (!bag.length) {
        html += '<div class="tsr-empty tsr-equip-bag-empty">背包暂无装备</div>';
    } else {
        html += '<div class="tsr-equip-bag-grid">';
        bag.forEach((item, idx) => {
            const color = getTsrEquipTierColor(item.tier);
            const salvage = getTsrEquipSalvageValue(item);
            const reforgeCost = getTsrEquipReforgeCost(item);
            const canReforge = Number.isFinite(reforgeCost);
            const borderColor = item.exclusive ? '#fbbf24' : color;
            const slotLabel = TSR_EQUIP_SLOT_META[item.slot]?.name || '';
            const expanded = openBagIdx === idx;
            html += `<div class="tsr-equip-bag-card${item.exclusive ? ' tsr-equip-bag-exclusive' : ''}${expanded ? ' expanded' : ''}" style="border-color:${borderColor};">
                <button type="button" class="tsr-equip-bag-card-main" onclick="toggleTsrEquipBagDetail(${idx})" title="点击查看 · 再点穿戴区可装备">
                    <span class="tsr-equip-bag-ico">${item.icon || '📦'}</span>
                    <span class="tsr-equip-bag-meta">
                        <span class="tsr-equip-bag-name">${formatTsrEquipTierBadge(item.tier)} ${formatTsrEquipNameHtml(item)}</span>
                        <span class="tsr-equip-stat-line">${slotLabel} · ${formatTsrEquipStatsCompact(item, true, 2)}</span>
                    </span>
                </button>
                ${expanded ? `<div class="tsr-equip-bag-card-detail">
                    ${item.affixes?.length ? `<div class="tsr-equip-affix-row">${formatTsrEquipAffixLine(item.affixes, 4)}</div>` : ''}
                    <div class="tsr-equip-stat-line">${formatTsrEquipStatsCompact(item, true, 6)}</div>
                    <div class="tsr-equip-bag-actions">
                        <button type="button" class="tsr-equip-wear" onclick="equipTsrFromBag(${idx})">穿戴</button>
                        ${canReforge ? `<button type="button" class="tsr-equip-reforge-sm" onclick="reforgeTsrFromBag(${idx})" ${runCurrency < reforgeCost ? 'disabled' : ''}>洗${reforgeCost}</button>` : ''}
                        <button type="button" class="tsr-equip-salvage" onclick="salvageTsrEquipFromBag(${idx})">${salvage}币</button>
                    </div>
                </div>` : `<div class="tsr-equip-bag-actions tsr-equip-bag-actions-mini">
                    <button type="button" class="tsr-equip-wear" onclick="equipTsrFromBag(${idx})" title="穿戴">穿</button>
                    <button type="button" class="tsr-equip-salvage" onclick="salvageTsrEquipFromBag(${idx})" title="分解">分</button>
                </div>`}
            </div>`;
        });
        html += '</div>';
    }
    container.innerHTML = html;
}

const TSR_RUN_CONSUMABLES = {
    healPotion: { name: '急救药包', icon: '🩹', effect: 'heal', value: 0.4, desc: '恢复40%生命' },
    timeCapsule: { name: '时光胶囊', icon: '💊', effect: 'time', value: 45, desc: '增加45秒' },
    scoutScroll: { name: '探测卷轴', icon: '📜', effect: 'detect', value: 1, desc: '自动侦查当前陷阱' },
    luckyCoin: { name: '幸运硬币', icon: '🍀', effect: 'luck', value: 60, desc: '60秒内双倍秘境币' },
    barrierCharm: { name: '避陷符咒', icon: '🔮', effect: 'barrier', value: 1, desc: '抵消下一次陷阱' },
    rageElixir: { name: '战意药剂', icon: '🔥', effect: 'rage', value: 0.35, desc: '攻击+35%持续3次行动' },
    coffeeShot: { name: '浓缩咖啡', icon: '☕', effect: 'coffee', value: 0.15, desc: '恢复15%生命并+20秒' },
    memeTea: { name: '梗味奶茶', icon: '🧋', effect: 'memeTea', value: 1, desc: '下次恶趣味房间收益+50%' },
    monsterBait: { name: '猎怪诱饵', icon: '🍖', effect: 'bait', value: 0.55, desc: '下次战斗奖励+55%' },
    ironShield: { name: '铁壁药盾', icon: '🛡️', effect: 'counterShield', value: 0.5, desc: '下3次反击伤害减半' },
    chaosDice: { name: '混沌骰子', icon: '🎲', effect: 'chaos', value: 1, desc: '随机触发强力的混沌效果' },
    spiritSnack: { name: '精灵零食', icon: '🍬', effect: 'spiritCharge', value: 35, desc: '精灵充能+35' },
    flashBomb: { name: '闪光弹', icon: '💥', effect: 'flash', value: 0.25, desc: '下一场战斗怪物首回合眩晕（伤害+25%）' },
    spiritElixir: { name: '精灵灵液', icon: '🧪', effect: 'spiritAwaken', value: 50, desc: '精灵充能+50并立即部分觉醒（回血+加时）' },
    bondElixir: { name: '羁绊灵药', icon: '💞', effect: 'spiritBond', value: 12, desc: '亲密度+12，精灵经验+40' },
    strikeAmp: { name: '灵击增幅器', icon: '⚡', effect: 'spiritStrikeAmp', value: 1.5, desc: '下3层灵击伤害×1.5' },
    oracleDust: { name: '神谕粉尘', icon: '✨', effect: 'oracleDust', value: 2, desc: '预览未来2层房间' },
    apocalypseSeed: { name: '终焉之种', icon: '🌑', effect: 'apocalypseSeed', value: 1, desc: '攻击+30%×3，但-8%生命' },
    starEssence: { name: '星灵精华', icon: '💫', effect: 'starBurst', value: 1, desc: '满充能觉醒+亲密度+8（终焉星灵额外+15秒）' },
    archonTear: { name: '主宰之泪', icon: '💧', effect: 'archonTear', value: 1, desc: '恢复35%生命，满充能觉醒，亲密度+6' },
    throneIncense: { name: '王座熏香', icon: '🕯️', effect: 'throneIncense', value: 1, desc: '灵击×1.8×4层，亲密度+10' },
    starGateKey: { name: '星门钥匙', icon: '🗝️', effect: 'starGateKey', value: 1, desc: '预览3层，下次特殊房权重提升' },
    dominionElixir: { name: '统御灵剂', icon: '🧪', effect: 'dominionElixir', value: 1, desc: '攻击+25%×4，精灵充能+45' },
    tyrantCore: { name: '暴君核心', icon: '🌠', effect: 'tyrantCore', value: 1, desc: '攻击+35%×3，预览2层，亲密度+5' },
    paradeSparkler: { name: '巡礼花火', icon: '🎆', effect: 'paradeSparkler', value: 1, desc: '经验+100，亲密度+10，充能+40' },
    affixScope: { name: '词条透视镜', icon: '🔎', effect: 'affixScope', value: 1, desc: '洞察守关怪词条，下一场词条赏金+25%' },
    affixSwap: { name: '词条置换符', icon: '🔄', effect: 'affixSwap', value: 1, desc: '下一场战斗重铸怪物全部词条' },
    synergyToken: { name: '羁绊信物', icon: '🔗', effect: 'synergyToken', value: 1, desc: '本局契约羁绊效果+50%（需双契约）' },
    championMedal: { name: '冠军奖章', icon: '🏅', effect: 'championMedal', value: 1, desc: '攻击+28%×3，战斗奖励+35%' },
    fortuneToken: { name: '星运符', icon: '🌟', effect: 'fortuneToken', value: 1, desc: '重掷今日星运并立即生效（本局）' },
    chronoCapsule: { name: '时序胶囊', icon: '💊', effect: 'chronoCapsule', value: 1, desc: '预览2层，行动耗时-10%×3层' },
    libraryScroll: { name: '秘闻卷轴', icon: '📜', effect: 'libraryScroll', value: 1, desc: '下2次特殊房收益+40%' },
    wishCoin: { name: '星愿硬币', icon: '🪙', effect: 'wishCoin', value: 1, desc: '满充能+亲密度+8，随机小额币奖励' }
};

const TSR_CODEX_ROOMS = [
    { key: 'battle', name: '战斗房', icon: '⚔️' },
    { key: 'elite', name: '精英房', icon: '💠' },
    { key: 'boss', name: '首领房', icon: '👹' },
    { key: 'shrine', name: '神龛房', icon: '🏛️' },
    { key: 'event', name: '事件房', icon: '✨' },
    { key: 'treasure', name: '宝箱房', icon: '💎' },
    { key: 'rest', name: '休息房', icon: '🛏️' },
    { key: 'shop', name: '商店房', icon: '🏪' },
    { key: 'portal', name: '岔路房', icon: '⛩️' },
    { key: 'relic', name: '遗物祭坛', icon: '🏺' },
    { key: 'mystery', name: '谜题祭坛', icon: '🔮' },
    { key: 'vault', name: '时之宝库', icon: '🏦' },
    { key: 'forge', name: '时光熔炉', icon: '🔥' },
    { key: 'arena', name: '竞技场', icon: '🏟️' },
    { key: 'ppt', name: '答辩炼狱', icon: '📊' },
    { key: 'client', name: '甲方圣所', icon: '📝' },
    { key: 'pdd', name: '砍一刀密室', icon: '🪓' },
    { key: 'recall', name: '撤回虚空', icon: '💬' },
    { key: 'kpi', name: 'KPI审判庭', icon: '📈' },
    { key: 'duanzi', name: '段子讲台', icon: '🎤' },
    { key: 'echo', name: '回音廊', icon: '🔊' },
    { key: 'weekly', name: '周报评审', icon: '📋' },
    { key: 'blinddate', name: '相亲角', icon: '💘' },
    { key: 'overtime996', name: '996神殿', icon: '⏰' },
    { key: 'lottery', name: '体彩祈福', icon: '🎫' },
    { key: 'standup', name: '开放麦', icon: '🎙️' },
    { key: 'oracle', name: '预言台', icon: '🔭' },
    { key: 'fusion', name: '遗物熔合', icon: '⚗️' },
    { key: 'timebank', name: '时光银行', icon: '🏧' },
    { key: 'storm', name: '时空乱流', icon: '🌪️' },
    { key: 'spiritgarden', name: '精灵花园', icon: '🌸' },
    { key: 'spiritsanctuary', name: '精灵圣殿', icon: '🏛️' },
    { key: 'spirittrial', name: '精灵试炼', icon: '⚔️' },
    { key: 'gacha', name: '秘境抽卡机', icon: '🎰' },
    { key: 'escape', name: '密室逃脱', icon: '🔐' },
    { key: 'auction', name: '时光拍卖', icon: '🔨' },
    { key: 'monsterhunt', name: '狩猎布告栏', icon: '🏹' },
    { key: 'roulette', name: '命运轮盘', icon: '🎡' },
    { key: 'vending', name: '自动售货机', icon: '🥤' },
    { key: 'phantom', name: '幻境迷宫', icon: '🌫️' },
    { key: 'shrineduel', name: '神龛对决', icon: '⚔️' },
    { key: 'beastlair', name: '异兽巢穴', icon: '🕳️' },
    { key: 'gamblersden', name: '秘境赌坊', icon: '🎲' },
    { key: 'spiritwell', name: '灵泉圣域', icon: '💧' },
    { key: 'spiritrift', name: '灵隙裂谷', icon: '🌌' },
    { key: 'spiritmemory', name: '记忆回廊', icon: '📿' },
    { key: 'spiritbazaar', name: '灵脉集市', icon: '🏮' },
    { key: 'spiritboss', name: '灵域王座', icon: '👑' },
    { key: 'spiritoracle', name: '精灵神谕', icon: '🔮' },
    { key: 'spiritforge', name: '灵锻工坊', icon: '⚒️' },
    { key: 'spiritarena', name: '精灵竞技场', icon: '🏟️' },
    { key: 'spiritnexus', name: '灵枢节点', icon: '💠' },
    { key: 'spiritcodex', name: '精灵图鉴殿', icon: '📖' },
    { key: 'spiritascend', name: '终焉飞升台', icon: '🌌' },
    { key: 'spiritstar', name: '终焉星域', icon: '💫' },
    { key: 'spiritthrone', name: '星灵王座', icon: '👑' },
    { key: 'starfall', name: '星陨祭坛', icon: '☄️' },
    { key: 'spiritduel', name: '精灵对决', icon: '⚔️' },
    { key: 'celestialvault', name: '天穹宝库', icon: '🏦' },
    { key: 'timewarp', name: '时光扭曲', icon: '🌀' },
    { key: 'tyrantcourt', name: '天穹审判庭', icon: '⚖️' },
    { key: 'spiritparade', name: '星灵巡礼', icon: '🎊' },
    { key: 'voidrift', name: '虚空裂隙', icon: '🕳️' },
    { key: 'affixforge', name: '词条熔炉', icon: '🔥' },
    { key: 'affixhunt', name: '词条狩猎场', icon: '🏷️' },
    { key: 'relicaltar', name: '遗物祭坛', icon: '🏺' },
    { key: 'bondsanctuary', name: '羁绊圣所', icon: '💞' },
    { key: 'championhall', name: '冠军殿堂', icon: '🏆' },
    { key: 'synergyshrine', name: '羁绊神殿', icon: '🔗' },
    { key: 'fortunewheel', name: '彩运轮盘', icon: '🎨' },
    { key: 'legendarchive', name: '传奇见闻馆', icon: '📜' },
    { key: 'chronolibrary', name: '时序图书馆', icon: '📚' },
    { key: 'starwishpool', name: '星愿池', icon: '🌠' },
    { key: 'mirrormaze', name: '镜像迷城', icon: '🪞' },
    { key: 'runescriptorium', name: '符文抄录室', icon: '📜' },
    { key: 'timeloom', name: '时光织机', icon: '🧵' },
    { key: 'combostorm', name: '连击风暴', icon: '🌪️' },
    { key: 'battlerift', name: '战斗裂隙', icon: '🌀' },
    { key: 'wararchive', name: '战策古卷', icon: '📜' },
    { key: 'bloodarena', name: '血战竞技场', icon: '🩸' },
    { key: 'meetingmarathon', name: '马拉松会议', icon: '🏃' },
    { key: 'slackoutage', name: '消息宕机', icon: '💬' },
    { key: 'hotfix911', name: '紧急热修', icon: '🚑' },
    { key: 'layoff', name: '毕业欢送会', icon: '📦' },
    { key: 'okrreview', name: 'OKR复盘室', icon: '📊' },
    { key: 'perfreview', name: '绩效谈话', icon: '📈' },
    { key: 'teamBuilding', name: '团建密室', icon: '🎳' },
    { key: 'retrospective', name: '复盘会议室', icon: '📋' },
    { key: 'interview', name: '秘境面试间', icon: '💼' },
    { key: 'codereview', name: '代码评审炼狱', icon: '🔍' },
    { key: 'standup996', name: '996开放麦', icon: '🌙' },
    { key: 'doomclock', name: '末日倒计时', icon: '⏰' },
    { key: 'elementaltrial', name: '元素试炼', icon: '🔥' },
    { key: 'necronomicon', name: '禁忌图录', icon: '📕' },
    { key: 'stormnexus', name: '乱流枢纽', icon: '🌪️' },
    { key: 'paradoxgate', name: '悖论之门', icon: '♾️' },
    { key: 'chromaticshrine', name: '彩光神龛', icon: '🌈' },
    { key: 'voidecho', name: '虚空回响', icon: '🕳️' },
    { key: 'cataclysmgate', name: '灾变之门', icon: '💀' }
];

function getTsrRelicBonus(effect) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.relics) return 0;
    let total = 0;
    tsr.currentRun.relics.forEach(key => {
        const relic = TSR_RELIC_POOL[key];
        if (relic && relic.effect === effect) total += relic.value;
        if (relic?.penalty?.effect === effect) total += relic.penalty.value;
        if (relic?.bonus?.effect === effect) total += relic.bonus.value;
    });
    return total;
}

function switchTsrLobbyTab(tabId) {
    document.querySelectorAll('.tsr-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tsrTab === tabId);
    });
    const panelMap = {
        adventure: 'tsrTabAdventure',
        welfare: 'tsrTabWelfare',
        shop: 'tsrTabShop',
        spirit: 'tsrTabSpirit',
        codex: 'tsrTabCodex',
        achievements: 'tsrTabAchievements',
        quests: 'tsrTabQuests'
    };
    document.querySelectorAll('#tsrLobbyPanel .tsr-tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === panelMap[tabId]);
    });
    if (tabId === 'codex') updateTsrCodexDisplay();
    if (tabId === 'achievements') updateTsrAchievementsDisplay();
    if (tabId === 'quests') updateTsrQuestsDisplay();
    if (tabId === 'spirit') updateTsrSpiritDisplay();
    if (tabId === 'welfare') updateTsrWelfareDisplay();
    if (tabId === 'shop') updateTsrShopPreview();
    if (tabId === 'adventure') updateTsrLobbyDashboard();
}

function switchTsrSideTab(tabId) {
    document.querySelectorAll('.tsr-side-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.side === tabId);
    });
    const map = { buffs: 'tsrSideBuffs', relics: 'tsrSideRelics', equipment: 'tsrSideEquipment', skills: 'tsrSideSkills', items: 'tsrSideItems' };
    document.querySelectorAll('.tsr-side-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === map[tabId]);
    });
}

function recordTsrCodex(roomType) {
    if (isTsrTutorialRun()) return;
    const tsr = player.timeSecretRealm;
    if (!tsr.codex) tsr.codex = { rooms: {}, relics: {}, elites: 0, gambles: 0 };
    tsr.codex.rooms[roomType] = (tsr.codex.rooms[roomType] || 0) + 1;
    if (!tsr.lifetimeStats) tsr.lifetimeStats = { memeRooms: 0, specialRooms: 0, spiritTriggers: 0, pddWins: 0 };
    if (TSR_MEME_ROOM_TYPES.includes(roomType)) tsr.lifetimeStats.memeRooms++;
    if (TSR_SPECIAL_ROOM_TYPES.includes(roomType)) tsr.lifetimeStats.specialRooms++;
    if (roomType && roomType.startsWith('spirit')) {
        bumpTsrQuestProgress('runSpiritRooms', 1);
        bumpTsrQuestProgress('weeklySpiritRooms', 1);
    }
    if (roomType === 'spiritascend' || roomType === 'spiritstar' || roomType === 'spiritthrone') {
        bumpTsrQuestProgress('runStarSpiritRooms', 1);
        bumpTsrQuestProgress('weeklyStarSpiritRooms', 1);
    }
    if (roomType === 'spiritthrone') {
        bumpTsrQuestProgress('runThroneRooms', 1);
    }
    if (roomType === 'starfall') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.starfallRooms = (tsr.lifetimeStats.starfallRooms || 0) + 1;
        bumpTsrQuestProgress('runStarfallRooms', 1);
        bumpTsrQuestProgress('weeklyStarfallRooms', 1);
    }
    if (roomType === 'spiritparade') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.paradeRooms = (tsr.lifetimeStats.paradeRooms || 0) + 1;
        bumpTsrQuestProgress('runParadeRooms', 1);
    }
    if (roomType === 'affixforge') {
        bumpTsrQuestProgress('runAffixForgeRooms', 1);
    }
    if (roomType === 'affixhunt') {
        bumpTsrQuestProgress('runAffixHuntRooms', 1);
    }
    if (roomType === 'championhall') {
        bumpTsrQuestProgress('runChampionHallRooms', 1);
    }
    if (roomType === 'synergyshrine') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.synergyShrineRooms = (tsr.lifetimeStats.synergyShrineRooms || 0) + 1;
    }
    if (roomType === 'legendarchive') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.legendArchiveRooms = (tsr.lifetimeStats.legendArchiveRooms || 0) + 1;
    }
    if (roomType === 'chronolibrary') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.chronoLibraryRooms = (tsr.lifetimeStats.chronoLibraryRooms || 0) + 1;
        bumpTsrQuestProgress('runChronoLibraryRooms', 1);
        bumpTsrQuestProgress('weeklyChronoLibraryRooms', 1);
        bumpTsrEngagement('dailyChronoLibrary', 1);
    }
    if (roomType === 'starwishpool') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.starWishRooms = (tsr.lifetimeStats.starWishRooms || 0) + 1;
        bumpTsrQuestProgress('runStarWishRooms', 1);
        bumpTsrEngagement('dailyStarWish', 1);
    }
    if (roomType === 'runescriptorium') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.runeScribeRooms = (tsr.lifetimeStats.runeScribeRooms || 0) + 1;
    }
    if (roomType === 'timeloom') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.timeLoomRooms = (tsr.lifetimeStats.timeLoomRooms || 0) + 1;
        bumpTsrQuestProgress('weeklyTimeLoomRooms', 1);
    }
    if (roomType === 'combostorm') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.comboStormRooms = (tsr.lifetimeStats.comboStormRooms || 0) + 1;
    }
    if (roomType === 'battlerift') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.battleRiftRooms = (tsr.lifetimeStats.battleRiftRooms || 0) + 1;
    }
    if (roomType === 'wararchive') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.warArchiveRooms = (tsr.lifetimeStats.warArchiveRooms || 0) + 1;
    }
    if (roomType === 'bloodarena') {
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.bloodArenaRooms = (tsr.lifetimeStats.bloodArenaRooms || 0) + 1;
    }
    invalidateTsrUiCache('codex');
    checkTsrCodexMilestones();
    checkTsrAchievements();
}

function addTsrRelic(relicKey) {
    const tsr = player.timeSecretRealm;
    if (!TSR_RELIC_POOL[relicKey]) return false;
    if (!tsr.currentRun.relics) tsr.currentRun.relics = [];
    if (tsr.currentRun.relics.includes(relicKey)) return false;
    if (tsr.currentRun.relics.length >= getTsrRelicMax()) return false;
    tsr.currentRun.relics.push(relicKey);
    if (!isTsrTutorialRun()) {
        if (!tsr.codex) tsr.codex = { rooms: {}, relics: {}, elites: 0, gambles: 0 };
        tsr.codex.relics[relicKey] = (tsr.codex.relics[relicKey] || 0) + 1;
    }
    const relic = TSR_RELIC_POOL[relicKey];
    addTsrLog(`获得遗物：${relic.icon} ${relic.name}（${relic.desc}）`, 'success');
    syncTsrRunStatsAfterBuffChange(calculateTsrPlayerHealth());
    invalidateTsrUiCache(isTsrTutorialRun() ? ['relic'] : ['relic', 'codex']);
    updateTsrRelicsDisplay();
    return true;
}

function tryGrantTsrExclusiveRelic(relicKey, baseChance, sourceLabel) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive || !TSR_RELIC_POOL[relicKey]) return false;
    if ((tsr.currentRun.relics || []).includes(relicKey)) return false;
    if ((tsr.currentRun.relics || []).length >= getTsrRelicMax()) return false;
    const sp = ensureTsrSpiritPet();
    const chance = baseChance + ((sp?.evolution || 0) >= 4 ? 0.08 : 0);
    if (Math.random() >= chance) return false;
    addTsrRelic(relicKey);
    addTsrLog(`【${sourceLabel}】专属遗物降临！`, 'success');
    checkTsrAchievements();
    return true;
}

function rollTsrRelicChoices(count) {
    const owned = player.timeSecretRealm?.currentRun?.relics || [];
    const pool = Object.keys(TSR_RELIC_POOL).filter(k => !owned.includes(k));
    const picks = [];
    while (picks.length < count && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        picks.push(pool.splice(idx, 1)[0]);
    }
    return picks;
}

function getTsrRelicPickCount() {
    return 3 + (player.timeSecretRealm?.permanentBonuses?.relicChoices ? 1 : 0);
}

function getTsrPermanentCounterReduce() {
    return Number(player.timeSecretRealm?.permanentBonuses?.counterReduce) || 0;
}

function getTsrPermanentMilestoneBonus() {
    return Number(player.timeSecretRealm?.permanentBonuses?.milestoneBonus) || 0;
}

function getTsrPermanentForgeBonus() {
    return Number(player.timeSecretRealm?.permanentBonuses?.forgeBonus) || 0;
}

function getTsrPermanentArenaBonus() {
    return Number(player.timeSecretRealm?.permanentBonuses?.arenaBonus) || 0;
}

function getTsrCounterDamageMultiplier() {
    const contractPenalty = player.timeSecretRealm?.currentRun?.contractMods?.counterPenalty || 0;
    const achDef = getTsrAchievementCombatBonuses().defense;
    return Math.max(0.35, 1 - getTsrRelicBonus('counterReduce') - getTsrPermanentCounterReduce()
        - getTsrSpiritCombatBonuses().counterReduce
        - getTsrEquipmentBonuses().counterReduce
        - achDef
        - getTsrEquipBonus('armor') - getTsrEquipBonus('resilience')
        - (player.timeSecretRealm?.currentRun?.roomCounterReduce || 0)
        - (player.timeSecretRealm?.currentRun?.spiritPactCombat?.counterReduce || 0) + contractPenalty);
}

function hideTsrChoicePanels(clearContent) {
    // 收起前若有可见抉择，立刻锁撤离，避免同一次点击穿透触发「中途撤离」
    const wasPending = typeof isTsrChoicePanelPending === 'function' && isTsrChoicePanelPending();
    // 先锁底栏，再 display:none，减少点击穿透窗口
    if (wasPending && player?.timeSecretRealm?.currentRun?.isActive
        && typeof armTsrExitClickGuard === 'function') {
        armTsrExitClickGuard(1400);
    }
    // 静态抉择面板（岔路/谜题/宝库/熔炉/遗物壳）禁止 innerHTML 清空，否则开局后永久无按钮
    const DYNAMIC_WIPE = {
        tsrMemePanel: true,
        tsrEquipOverflowPanel: true,
        tsrEquipFusionPanel: true,
        tsrEquipReforgePanel: true
    };
    ['tsrPortalPanel', 'tsrRelicPickPanel', 'tsrMysteryPanel', 'tsrVaultPanel', 'tsrForgePanel', 'tsrMemePanel', 'tsrEquipOverflowPanel', 'tsrEquipFusionPanel', 'tsrEquipReforgePanel'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.display = 'none';
        if (!clearContent) return;
        if (id === 'tsrMemePanel') {
            const btns = document.getElementById('tsrMemeBtns');
            const desc = document.getElementById('tsrMemeDesc');
            const title = document.getElementById('tsrMemeTitle');
            if (btns) {
                btns.innerHTML = '';
                btns.className = 'tsr-choice-btns';
            }
            if (desc) desc.innerHTML = '';
            if (title) title.textContent = '';
            el.classList.remove('tsr-tactic-panel', 'tsr-panel-tactic');
        } else if (id === 'tsrRelicPickPanel') {
            const opts = document.getElementById('tsrRelicPickOptions');
            if (opts) opts.innerHTML = '';
        } else if (DYNAMIC_WIPE[id]) {
            el.innerHTML = '';
        }
    });
}

/** 抉择按钮统一：先锁撤离，延后隐藏与结算，避开 click 穿透 */
function deferTsrChoiceResolve(workFn, guardMs) {
    if (typeof armTsrExitClickGuard === 'function') {
        armTsrExitClickGuard(guardMs || 1400);
    }
    setTimeout(() => {
        if (!player?.timeSecretRealm?.currentRun?.isActive) return;
        try { workFn(); } catch (e) { console.error('[TSR] choice resolve', e); }
    }, 60);
}

/** 恢复 HTML 里被误清掉的静态抉择按钮 */
function ensureTsrStaticChoicePanelHtml(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return null;
    const hasBtn = !!panel.querySelector('button, .tsr-relic-option, [onclick], [data-tsr-tactic]');
    if (hasBtn && panelId !== 'tsrRelicPickPanel') return panel;
    if (panelId === 'tsrPortalPanel') {
        panel.innerHTML = `<h4>⛩️ 时光岔路</h4>
            <p>选择你的道路，命运将随之改变</p>
            <div class="tsr-choice-btns">
                <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChoosePortal('safe')">安全之路 · +35秒</button>
                <button type="button" class="tsr-btn tsr-btn-risk" onclick="tsrChoosePortal('risky')">危险之路 · 战斗+遗物</button>
            </div>`;
    } else if (panelId === 'tsrMysteryPanel') {
        panel.innerHTML = `<h4>🔮 谜题祭坛</h4>
            <p>三重考验摆在眼前，你的抉择将影响命运</p>
            <div class="tsr-choice-btns">
                <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseMystery('wisdom')">智慧之路 · 增益+20秒</button>
                <button type="button" class="tsr-btn tsr-btn-risk" onclick="tsrChooseMystery('courage')">勇气之路 · 精英战斗</button>
                <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseMystery('greed')">贪婪之路 · +币 -8%血</button>
            </div>`;
    } else if (panelId === 'tsrVaultPanel') {
        panel.innerHTML = `<h4>🏦 时之宝库</h4>
            <p>时间与财富在此流转，选择你的交易方式</p>
            <div class="tsr-choice-btns">
                <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseVault('buyTime')">购入时间 · 80币→50秒</button>
                <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseVault('sellTime')">出售时间 · 40秒→100币</button>
                <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseVault('gamble')">宝库博弈 · 30秒赌大小</button>
            </div>`;
    } else if (panelId === 'tsrForgePanel') {
        panel.innerHTML = `<h4>🔥 时光熔炉</h4>
            <p>烈焰升腾，选择你的锻造方式</p>
            <div class="tsr-choice-btns">
                <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseForge('temper')">淬火 · 35秒 / 回血+币</button>
                <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseForge('reforge')">重铸 · 50秒 / 随机遗物</button>
                <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseForge('imbue')">灌注 · 25秒 / 攻击+55%</button>
                <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseForge('arm')">铸装 · 40秒 / 随机装备</button>
                <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseForge('smelt')">熔炼 · 55秒 / 2件同品质升阶</button>
                <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseForge('wash')">洗炼 · 45秒 / 重铸装备属性</button>
            </div>`;
    }
    return panel;
}

/** 已探索却未完成抉择时，把对应面板重新亮起（防卡死） */
function resyncTsrPendingChoicePanel() {
    const run = player?.timeSecretRealm?.currentRun;
    const room = run?.currentRoom;
    if (!run?.isActive || !room?.explored || room.choiceResolved || run.battleInProgress) return;
    if (isTsrChoicePanelPending()) return;
    // 互动事件 / 动态遭遇：面板被轻量刷新藏掉时重新亮起
    if (run.pendingInteractiveEvent) {
        const ev = run.pendingInteractiveEvent;
        showTsrMemePanel(ev.title, ev.desc,
            (ev.choices || []).map((c, i) =>
                `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrResolveInteractiveEvent(${i})">${c.label}</button>`
            ).join(''));
        return;
    }
    if (run.pendingEncounter) {
        const enc = run.pendingEncounter;
        showTsrMemePanel(`✨ 动态遭遇 · ${enc.name}`, enc.log,
            (enc.choices || []).map((c, i) =>
                `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrResolveDynamicEncounter(${i})">${c.label}</button>`
            ).join(''), 'epic');
        return;
    }
    const map = {
        portal: () => handlePortalRoom({ silent: true }),
        mystery: () => handleMysteryRoom({ silent: true }),
        vault: () => handleVaultRoom({ silent: true }),
        forge: () => handleForgeRoom({ silent: true }),
        relic: () => {
            if ((run.relicChoices || []).length) {
                const panel = document.getElementById('tsrRelicPickPanel');
                if (panel) panel.style.display = 'block';
            }
        }
    };
    const show = map[room.type];
    if (show) show();
}

function showTsrMemePanel(title, desc, buttonsHtml, theme) {
    const panel = document.getElementById('tsrMemePanel');
    const titleEl = document.getElementById('tsrMemeTitle');
    const descEl = document.getElementById('tsrMemeDesc');
    const btnsEl = document.getElementById('tsrMemeBtns');
    if (!panel || !titleEl || !descEl || !btnsEl) return;
    panel.className = 'tsr-choice-panel tsr-meme-panel'
        + (theme ? ` tsr-panel-${theme}` : '')
        + (theme === 'tactic' ? ' tsr-tactic-panel' : '');
    btnsEl.className = 'tsr-choice-btns' + (theme === 'tactic' ? ' tsr-choice-btns--tactic' : '');
    titleEl.innerHTML = formatTsrRichText(title, 'info', theme);
    descEl.innerHTML = typeof desc === 'string' && desc.includes('<') ? desc : formatTsrRichText(desc, 'info', theme);
    btnsEl.innerHTML = buttonsHtml;
    panel.style.display = 'block';
}

function finishTsrMemeRoom() {
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    if (!run?.isActive) return;
    if (run._finishingMeme) return;
    run._finishingMeme = true;
    deferTsrChoiceResolve(() => {
        const r = player.timeSecretRealm?.currentRun;
        if (!r) return;
        r._finishingMeme = false;
        if (!r.isActive) return;
        r.pddProgress = null;
        r.recallOutcomes = null;
        r.overtimeStage = null;
        hideTsrChoicePanels(true);
        if (r.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
        else afterAction();
    });
}

function updateTsrFloorMap() {
    const container = document.getElementById('tsrFloorMap');
    if (!container) return;
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun?.isActive) { container.innerHTML = ''; return; }
    const clearFloor = tsr.currentRun.clearFloor || 10;
    const current = tsr.currentRun.currentFloor;
    const history = tsr.currentRun.floorHistory || [];
    const showMax = Math.min(clearFloor, Math.max(current + 2, 10));
    let html = '';
    for (let f = 1; f <= showMax; f++) {
        const entry = history.find(h => h.floor === f);
        let cls = 'tsr-floor-node';
        if (f < current) cls += ' cleared';
        if (f === current) cls += ' current';
        if (entry?.type === 'boss' || f % TSR_BOSS_FLOOR_INTERVAL === 0) cls += ' boss';
        if (entry?.type === 'shrine' || (f % TSR_SHRINE_FLOOR_INTERVAL === 0 && f % TSR_BOSS_FLOOR_INTERVAL !== 0)) cls += ' shrine';
        const tip = entry
            ? ((typeof getTsrRoomTypeMeta === 'function' ? getTsrRoomTypeMeta(entry.type).name : null) || entry.type)
            : '';
        html += `<div class="${cls}" title="${tip}">${f}</div>`;
    }
    container.innerHTML = html;
}

function updateTsrTimeRing() {
    const tsr = player.timeSecretRealm;
    const ring = document.getElementById('tsrTimeRingFill');
    const timeEl = document.getElementById('tsrTimeLeft');
    if (!ring || !tsr.currentRun?.isActive) return;
    const initial = tsr.currentRun.initialTime || 300;
    const left = Math.max(0, tsr.currentRun.timeLeft);
    const pct = Math.max(0, Math.min(1, left / initial));
    const circumference = 264;
    ring.style.strokeDashoffset = String(circumference * (1 - pct));
    ring.style.stroke = pct < 0.2 ? '#f87171' : (pct < 0.45 ? '#fbbf24' : '#38bdf8');
    if (timeEl) timeEl.textContent = String(left);
}

function updateTsrComboDisplay() {
    const el = document.getElementById('tsrComboDisplay');
    if (!el) return;
    const streak = player.timeSecretRealm?.currentRun?.battleWinStreak || 0;
    const comboCapPct = (0.5 + getTsrPermanentComboCapBonus()) * 100;
    const bonus = Math.min(comboCapPct, streak * 5);
    el.textContent = streak > 0 ? `×${streak} +${bonus.toFixed(0)}%` : '×0';
}

function updateTsrRelicsDisplay() {
    const container = document.getElementById('tsrCurrentRelics');
    if (!container) return;
    const sig = getTsrRelicSignature();
    if (_tsrUiCache.relic === sig) return;
    _tsrUiCache.relic = sig;
    const relics = player.timeSecretRealm?.currentRun?.relics || [];
    if (!relics.length) {
        container.innerHTML = '<div class="tsr-empty">本局尚未获得遗物</div>';
        return;
    }
    container.innerHTML = relics.map(key => {
        const r = TSR_RELIC_POOL[key];
        if (!r) return '';
        return `<div class="tsr-relic-item"><strong>${r.icon} ${r.name}</strong><div style="color:#c4b5fd;margin-top:4px;">${r.desc}</div></div>`;
    }).join('');
}

function updateTsrCodexDisplay() {
    const container = document.getElementById('tsrCodexContent');
    if (!container) return;
    const sig = getTsrCodexSignature();
    if (_tsrUiCache.codex === sig) return;
    _tsrUiCache.codex = sig;
    const tsr = player.timeSecretRealm;
    const codex = tsr.codex || { rooms: {}, relics: {} };
    let html = TSR_CODEX_ROOMS.map(room => {
        const count = codex.rooms[room.key] || 0;
        const unlocked = count > 0;
        return `<div class="tsr-codex-item ${unlocked ? 'unlocked' : 'locked'}">
            <div style="font-size:1.4rem;">${room.icon}</div>
            <div style="font-weight:600;margin:4px 0;">${room.name}</div>
            <div style="color:#64748b;">${unlocked ? '遭遇 ' + count + ' 次' : '未发现'}</div>
        </div>`;
    }).join('');
    html += '<div class="tsr-codex-section-title">遗物图鉴</div>';
    html += Object.entries(TSR_RELIC_POOL).map(([key, relic]) => {
        const count = codex.relics?.[key] || 0;
        const unlocked = count > 0;
        return `<div class="tsr-codex-item tsr-codex-relic ${unlocked ? 'unlocked' : 'locked'}">
            <div style="font-size:1.2rem;">${relic.icon}</div>
            <div style="font-weight:600;margin:2px 0;font-size:12px;">${relic.name}</div>
            <div style="color:#64748b;font-size:11px;">${unlocked ? '获得 ' + count + ' 次' : relic.desc}</div>
        </div>`;
    }).join('');
    html += '<div class="tsr-codex-section-title">装备套装图鉴</div>';
    html += Object.entries(TSR_EQUIP_SETS).map(([key, set]) => {
        const count = codex.equipmentSets?.[key] || 0;
        const unlocked = count > 0;
        return `<div class="tsr-codex-item tsr-codex-equip ${unlocked ? 'unlocked' : 'locked'}">
            <div style="font-size:1.2rem;">${set.icon}</div>
            <div style="font-weight:600;margin:2px 0;font-size:12px;">${set.name}</div>
            <div style="color:#64748b;font-size:11px;">${unlocked ? '获得 ' + count + ' 件 · 2件:' + set.desc2 : '2件:' + set.desc2}</div>
            <div style="color:#64748b;font-size:10px;">4件:${set.desc4}</div>
        </div>`;
    }).join('');
    html += '<div class="tsr-codex-section-title">装备词条图鉴</div>';
    html += TSR_EQUIP_AFFIX_POOL.map(ax => {
        const count = codex.equipmentAffixes?.[ax.id] || 0;
        const unlocked = count > 0;
        const statHint = Object.keys(ax.stats).map(k => TSR_EQUIP_STAT_META[k]?.short || k).join('/');
        return `<div class="tsr-codex-item tsr-codex-affix ${unlocked ? 'unlocked' : 'locked'}">
            <div style="font-weight:600;margin:2px 0;font-size:12px;">${ax.name}</div>
            <div style="color:#64748b;font-size:11px;">${unlocked ? '获得 ' + count + ' 次 · ' + statHint : statHint + '（未解锁）'}</div>
        </div>`;
    }).join('');
    html += '<div class="tsr-codex-section-title">传说套装图鉴</div>';
    html += Object.entries(TSR_EQUIP_SETS).filter(([, set]) => set.exclusive).map(([key, set]) => {
        const count = codex.equipmentLegends?.[key] || 0;
        const unlocked = count > 0;
        return `<div class="tsr-codex-item tsr-codex-equip tsr-codex-legend ${unlocked ? 'unlocked' : 'locked'}">
            <div style="font-size:1.2rem;">${set.icon}</div>
            <div style="font-weight:600;margin:2px 0;font-size:12px;">${set.name} ★</div>
            <div style="color:#64748b;font-size:11px;">${unlocked ? '获得 ' + count + ' 件 · 2件:' + set.desc2 : set.dropHint || '???'}</div>
            <div style="color:#64748b;font-size:10px;">4件:${set.desc4}</div>
        </div>`;
    }).join('');
    html += '<div class="tsr-codex-section-title">怪物词条图鉴</div>';
    html += Object.entries(TSR_MONSTER_AFFIXES).filter(([, ax]) => (ax.weight || 0) > 0 || ax.exclusiveMonster).map(([key, ax]) => {
        const count = codex.monsterAffixes?.[key] || 0;
        const unlocked = count > 0;
        return `<div class="tsr-codex-item tsr-codex-affix ${unlocked ? 'unlocked' : 'locked'}">
            <div style="font-size:1.2rem;">${ax.icon}</div>
            <div style="font-weight:600;margin:2px 0;font-size:12px;">${ax.name}</div>
            <div style="color:#64748b;font-size:11px;">${unlocked ? '遭遇 ' + count + ' 次' : ax.desc}</div>
        </div>`;
    }).join('');
    html += '<div class="tsr-codex-stats">';
    const achCount = Object.keys(tsr.achievements || {}).length;
    html += `精英击杀: ${codex.elites || 0} · 赌局: ${codex.gambles || 0} · 遗物: ${Object.keys(codex.relics || {}).length}/${Object.keys(TSR_RELIC_POOL).length}`;
    html += ` · 装备掉落: ${codex.equipmentDrops || 0}`;
    html += ` · 套装: ${Object.keys(codex.equipmentSets || {}).length}/${Object.keys(TSR_EQUIP_SETS).length}`;
    const legendTotal = Object.values(TSR_EQUIP_SETS).filter(s => s.exclusive).length;
    html += ` · 传说: ${Object.keys(codex.equipmentLegends || {}).length}/${legendTotal}`;
    html += ` · 装词条: ${Object.keys(codex.equipmentAffixes || {}).length}/${TSR_EQUIP_AFFIX_POOL.length}`;
    html += ` · 词条: ${Object.keys(codex.monsterAffixes || {}).length}/${Object.keys(TSR_MONSTER_AFFIXES).length}`;
    html += ` · 成就: ${achCount}/${TSR_ACHIEVEMENTS.length} · 梗房间: ${tsr.lifetimeStats?.memeRooms || 0}`;
    html += '</div>';
    container.innerHTML = html;
}

function getTsrStatBuffMultiplier(effect) {
    let multiplier = 1;
    const tsr = player.timeSecretRealm;
    if (tsr?.currentRun?.tempBuffs) {
        tsr.currentRun.tempBuffs.forEach(buff => {
            if (buff.effect === effect) multiplier += Number(buff.value) || 0;
        });
    }
    if (effect === 'attack') multiplier += getTsrRelicBonus('attack') + getTsrEquipmentBonuses().attack;
    if (effect === 'health') multiplier += getTsrRelicBonus('health') + getTsrEquipmentBonuses().health;
    return Math.max(0.1, multiplier);
}

function showTsrLobbyView() {
    const lobby = document.getElementById('tsrLobbyPanel');
    const adventure = document.getElementById('tsrAdventurePanel');
    const badge = document.getElementById('tsrRunDifficultyBadge');
    if (lobby) lobby.style.display = 'block';
    if (adventure) adventure.style.display = 'none';
    if (badge) badge.style.display = 'none';
    hideTsrChoicePanels(true);
    updateTsrLobbyDashboard();
    updateTsrWelfareDisplay();
    updateTsrShopPreview();
}

function getTsrHealthPercent(current, max) {
    if (bLteZero(max)) return 0;
    if (bLteZero(current)) return 0;
    if (cmpBigSci(current, max) >= 0) return 100;
    const cur = parseBigSci(current);
    const mx = parseBigSci(max);
    const expDiff = Number(cur.e - mx.e);
    let ratio = Math.pow(10, expDiff) * (cur.m / mx.m);
    if (!Number.isFinite(ratio) || ratio < 0) ratio = 0;
    return Math.min(100, ratio * 100);
}

function tsrClampHealth(current, max) {
    return cmpBigSci(current, max) > 0 ? max : current;
}

function tsrHealPlayer(ratio) {
    const tsr = player.timeSecretRealm;
    ratio = (Number(ratio) || 0) * (1 + getTsrEquipBonus('healAmp'));
    const maxHealth = calculateTsrPlayerHealth();
    const healAmount = bMul(maxHealth, ratio);
    tsr.currentRun.playerHealth = tsrClampHealth(bAdd(tsr.currentRun.playerHealth, healAmount), maxHealth);
}

function syncTsrRunStatsAfterBuffChange(prevMaxHealth) {
    const tsr = player.timeSecretRealm;
    const newMax = calculateTsrPlayerHealth();
    if (cmpBigSci(newMax, prevMaxHealth) > 0) {
        tsr.currentRun.playerHealth = bAdd(tsr.currentRun.playerHealth, bSub(newMax, prevMaxHealth));
    } else if (cmpBigSci(tsr.currentRun.playerHealth, newMax) > 0) {
        tsr.currentRun.playerHealth = newMax;
    }
    tsr.currentRun.playerAttack = calculateTsrPlayerAttack();
}

/** 行动耗时对难度的软缩放（避免全额吃 difficultyMultiplier） */
function getTsrActionDifficultyScale(dm) {
    const d = Math.max(1, Number(dm) || 1);
    return Math.min(1.75, Math.pow(d, 0.18));
}

/**
 * 开局时间：以通关层数为主预算，难度只做轻微压力。
 * 旧公式会随 multiplier 大幅砍时，与上调后的 clearFloor 不匹配。
 */
function getTsrAdjustedBaseTime(difficulty) {
    const tsr = player.timeSecretRealm;
    const baseTime = 300 + (Number(tsr?.permanentBonuses?.baseTime) || 0);
    const clearFloor = Math.max(10, Number(difficulty?.clearFloor) || 40);
    const dm = Math.max(1, Number(difficulty?.multiplier) || 1);
    const journeyBonus = Math.floor(clearFloor * 7.5 + Math.pow(clearFloor / 12, 1.45) * 18);
    const pressure = 0.88 + 0.35 / Math.sqrt(dm);
    return Math.max(280, Math.floor(baseTime * pressure + journeyBonus));
}

/** 下层时额外回时：随通关里程与装备层间/时赠成长 */
function getTsrFloorTimeReturn() {
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    if (!run) return 0;
    const dm = run.difficultyMultiplier || 1;
    const clearFloor = run.clearFloor || 40;
    const scale = getTsrActionDifficultyScale(dm);
    let gain = Math.floor(10 * scale + clearFloor * 0.09);
    const eqFloor = typeof getTsrEquipBonus === 'function' ? getTsrEquipBonus('floorBonus') : 0;
    const eqTimeGain = typeof getTsrEquipBonus === 'function' ? getTsrEquipBonus('timeGain') : 0;
    gain = Math.floor(gain * (1 + Math.min(0.6, eqFloor + eqTimeGain * 1.25)));
    gain += getTsrRelicBonus('floorTime') + getTsrPermanentFloorTimeBonus()
        - getTsrRelicBonus('floorTimePenalty')
        + (run.contractMods?.floorTime || 0);
    const affixFt = getTsrActiveAffix();
    if (affixFt?.floorTime) gain += affixFt.floorTime;
    if (run.spiritPactTime) gain += run.spiritPactTime;
    return Math.max(0, Math.floor(gain));
}

function isTsrSuccessfulClear(reason) {
    return reason !== '战斗失败' && reason !== '时间耗尽' && reason !== '生命值过低';
}

/**
 * 局终结算标志（可被 unify-ext 覆盖增强；挑战通关不算 clearCount）。
 * 各扩展结束钩子应优先调用此函数，避免各算一套。
 */
function resolveTsrEndClearFlags(reason) {
    const challengeMap = {
        weeklyBossClear: true,
        bossRushClear: true,
        trialTowerClear: true
    };
    if (challengeMap[reason]) {
        return {
            reason,
            isChallenge: true,
            countsAsClearCount: false,
            metaClear: true,
            seasonFullXp: true,
            factionRep: true,
            captureGhost: true,
            fractureStreak: true,
            debriefAsCleared: true
        };
    }
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    const isTutorial = !!(run?.isTutorial || tsr?.pendingTutorial);
    const difficulty = tsr?.difficulty?.levels?.[run?.difficulty];
    const clearFloor = run?.clearFloor || difficulty?.clearFloor;
    const floorOk = !!(
        run && clearFloor
        && run.currentFloor >= clearFloor
        && isTsrSuccessfulClear(reason)
    );
    // 教学局：可显示通关复盘，但不计入任何正式元进度
    if (isTutorial) {
        return {
            reason,
            isChallenge: false,
            isTutorial: true,
            countsAsClearCount: false,
            metaClear: false,
            seasonFullXp: false,
            factionRep: false,
            captureGhost: false,
            fractureStreak: false,
            debriefAsCleared: floorOk
        };
    }
    return {
        reason,
        isChallenge: false,
        isTutorial: false,
        countsAsClearCount: floorOk,
        metaClear: floorOk,
        seasonFullXp: floorOk,
        factionRep: floorOk,
        captureGhost: floorOk,
        fractureStreak: floorOk,
        debriefAsCleared: floorOk
    };
}

function showTsrAdventureView() {
    const lobby = document.getElementById('tsrLobbyPanel');
    const adventure = document.getElementById('tsrAdventurePanel');
    if (lobby) lobby.style.display = 'none';
    if (adventure) adventure.style.display = 'block';
    if (typeof switchTsrSideTab === 'function') switchTsrSideTab('equipment');
}

function hasTsrLuckBuff() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun) return false;
    if (tsr.currentRun.luckExpiresAt && Date.now() < tsr.currentRun.luckExpiresAt) return true;
    return !!(tsr.currentRun.tempBuffs || []).some(buff => buff.effect === 'luck');
}

function tickTsrTimedEffects() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    if (tsr.currentRun.luckExpiresAt && Date.now() >= tsr.currentRun.luckExpiresAt) {
        tsr.currentRun.luckExpiresAt = 0;
    }
}

function getTsrTimeCostMultiplier() {
    const tsr = player.timeSecretRealm;
    let mult = 1;
    if (tsr?.currentRun?.tempBuffs) {
        const speedValue = tsr.currentRun.tempBuffs
            .filter(buff => buff.effect === 'speed')
            .reduce((sum, buff) => sum + (Number(buff.value) || 0), 0);
        mult = Math.max(0.55, 1 - speedValue * 0.02);
    }
    const equipSave = typeof getTsrEquipBonus === 'function'
        ? (getTsrEquipBonus('timeSave')
            + getTsrEquipBonus('chronoBoost') * 0.75
            + getTsrEquipBonus('swiftness') * 0.5)
        : 0;
    const dailySave = Number(tsr?.currentRun?.timeSaveBonus) || 0;
    const envSave = Number(tsr?.currentRun?.env?.battle?.timeSave) || 0;
    mult = Math.max(0.45, mult
        - getTsrRelicBonus('timeSave')
        - getTsrPermanentExploreTimeSave()
        - Math.min(0.22, equipSave)
        - dailySave
        - envSave);
    const contractCost = player.timeSecretRealm?.currentRun?.contractMods?.timeCost || 0;
    const contractSave = player.timeSecretRealm?.currentRun?.contractMods?.timeSave || 0;
    mult *= 1 + contractCost;
    mult = Math.max(0.4, mult - contractSave);
    const affix = getTsrActiveAffix();
    if (affix?.timeSave) mult = Math.max(0.35, mult - affix.timeSave);
    if (affix?.timeCost) mult *= 1 + affix.timeCost;
    if ((tsr?.currentRun?.chronoCapsuleFloors || 0) > 0) mult = Math.max(0.3, mult - 0.1);
    return mult;
}

function getTsrDetectionSuccessRate() {
    const tsr = player.timeSecretRealm;
    const skillKey = tsr.traps.playerSkills.detection;
    const skill = tsr.traps.detectionSkills[skillKey];
    let rate = skill ? skill.successRate : 0.3;
    if (tsr.currentRun?.detectionBoost) rate += tsr.currentRun.detectionBoostAmount || 0.3;
    rate += getTsrRelicBonus('detection');
    return Math.min(0.99, rate);
}

function addTsrRunCurrency(amount, options) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun || !amount) return 0;
    options = options || {};
    let finalAmount = Math.floor(Number(amount) || 0);
    if (options.bossBonus) finalAmount = Math.floor(finalAmount * TSR_BOSS_CURRENCY_BONUS);
    if (options.eliteBonus) {
        let eliteMult = TSR_ELITE_CURRENCY_BONUS * (1 + getTsrRelicBonus('eliteCurrency'));
        const elitePen = tsr.currentRun?.contractMods?.eliteCurrencyPenalty || 0;
        const eliteBonus = tsr.currentRun?.contractMods?.eliteCurrencyBonus || 0;
        const weeklyElite = tsr.currentRun?.weeklyBonus?.eliteCurrencyBonus || 0;
        if (elitePen) eliteMult *= 1 - elitePen;
        if (eliteBonus) eliteMult *= 1 + eliteBonus;
        if (weeklyElite) eliteMult *= 1 + weeklyElite;
        finalAmount = Math.floor(finalAmount * eliteMult);
    }
    if (options.fromBattle) {
        const battlePen = getTsrRelicBonus('battleCurrencyPenalty');
        if (battlePen) finalAmount = Math.floor(finalAmount * (1 - battlePen));
    }
    const contractCur = tsr.currentRun?.contractMods?.currencyMod || 0;
    if (contractCur) finalAmount = Math.floor(finalAmount * (1 + contractCur));
    const affix = getTsrActiveAffix();
    if (affix?.currencyMod) finalAmount = Math.floor(finalAmount * (1 + affix.currencyMod));
    if (options.fromBattle && affix?.battleReward) finalAmount = Math.floor(finalAmount * (1 + affix.battleReward));
    if (tsr.currentRun?.memeRoomBonus) {
        finalAmount = Math.floor(finalAmount * (1 + tsr.currentRun.memeRoomBonus));
        tsr.currentRun.memeRoomBonus = 0;
    }
    if (options.combo) {
        const streak = tsr.currentRun.battleWinStreak || 0;
        const comboCap = 0.5 + getTsrPermanentComboCapBonus();
        finalAmount = Math.floor(finalAmount * (1 + Math.min(comboCap, streak * 0.05) + getTsrRelicBonus('comboBoost')));
    }
    const currencyBonus = getTsrRelicBonus('currency') - getTsrRelicBonus('currencyPenalty') + getTsrPermanentRunCurrencyBonus()
        + (tsr.currentRun?.spiritPactCurrency || 0);
    if (currencyBonus) finalAmount = Math.floor(finalAmount * (1 + currencyBonus));
    const equipCur = getTsrEquipBonus('currencyGain') + (options.fromBattle ? (getTsrEquipBonus('battleReward') + getTsrEquipBonus('comboBoost') * 0.5 + getTsrEquipBonus('affixHunter') * 0.3) : 0);
    if (equipCur) finalAmount = Math.floor(finalAmount * (1 + equipCur));
    if (hasTsrLuckBuff()) finalAmount *= 2;
    // 通关额外奖基于已入账币，不再套二次缩放
    if (!options.skipGainScale) {
        finalAmount = Math.floor(finalAmount * TSR_RUN_CURRENCY_GAIN_SCALE);
    }
    if (finalAmount < 0) finalAmount = 0;
    tsr.currentRun.currencyEarned += finalAmount;
    return finalAmount;
}

/** 局终结束原因 → 中文展示 */
function formatTsrEndReason(reason) {
    const map = {
        '主动退出': '主动撤离',
        '通关撤离': '通关撤离',
        '时间耗尽': '时间耗尽',
        '战斗失败': '战斗失败',
        '生命值过低': '生命值过低',
        death: '力竭倒下',
        bossRushClear: '首领冲刺通关',
        trialTowerClear: '试炼塔通关',
        weeklyBossClear: '周常首领通关',
        unknown: '未知'
    };
    if (!reason) return '未知';
    if (map[reason]) return map[reason];
    // 已是中文则原样返回；纯英文 key 做可读化
    if (/[\u4e00-\u9fff]/.test(String(reason))) return String(reason);
    return String(reason).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
}

/** 临时增益 effect key → 中文 */
function formatTsrBuffEffectLabel(effect) {
    const map = {
        attack: '攻击',
        health: '生命',
        critRate: '暴击率',
        critDamage: '爆伤',
        speed: '探索速度',
        luck: '幸运',
        counterReduce: '反击减免',
        defense: '防御',
        currency: '秘境币',
        timeSave: '行动加速'
    };
    return map[effect] || '效果';
}

/** 品质档位 key → 中文 */
function formatTsrTierLabel(tier) {
    return (TSR_MONSTER_TIER_META[tier] && TSR_MONSTER_TIER_META[tier].label) || tier || '未知';
}

function getTsrRoomTypeMeta(type) {
    const tsr = player.timeSecretRealm;
    const defaults = {
        battle: { name: '战斗房间', icon: '⚔️', color: '#ff6b6b' },
        elite: { name: '精英房间', icon: '💠', color: '#a78bfa' },
        event: { name: '事件房间', icon: '✨', color: '#00bfff' },
        treasure: { name: '宝箱房间', icon: '💎', color: '#ffd700' },
        rest: { name: '休息房间', icon: '🛏️', color: '#32cd32' },
        shop: { name: '商店房间', icon: '🏪', color: '#9370db' },
        boss: { name: '首领房间', icon: '👹', color: '#ff4500' },
        shrine: { name: '神龛房间', icon: '🏛️', color: '#ffd700' },
        portal: { name: '时光岔路', icon: '⛩️', color: '#22d3ee' },
        relic: { name: '遗物祭坛', icon: '🏺', color: '#e879f9' },
        mystery: { name: '谜题祭坛', icon: '🔮', color: '#c084fc' },
        vault: { name: '时之宝库', icon: '🏦', color: '#fbbf24' },
        forge: { name: '时光熔炉', icon: '🔥', color: '#fb923c' },
        arena: { name: '时光竞技场', icon: '🏟️', color: '#f43f5e' },
        ppt: { name: 'PPT答辩炼狱', icon: '📊', color: '#f97316' },
        client: { name: '甲方改稿圣所', icon: '📝', color: '#eab308' },
        pdd: { name: '砍一刀密室', icon: '🪓', color: '#ef4444' },
        recall: { name: '撤回消息虚空', icon: '💬', color: '#a3a3a3' },
        kpi: { name: 'KPI审判庭', icon: '📈', color: '#22c55e' },
        duanzi: { name: '段子手讲台', icon: '🎤', color: '#ec4899' },
        echo: { name: '时光回音廊', icon: '🔊', color: '#818cf8' },
        weekly: { name: '周报评审室', icon: '📋', color: '#84cc16' },
        blinddate: { name: '秘境相亲角', icon: '💘', color: '#f472b6' },
        overtime996: { name: '996加班神殿', icon: '⏰', color: '#dc2626' },
        lottery: { name: '体彩祈福站', icon: '🎫', color: '#22d3ee' },
        standup: { name: '脱口秀开放麦', icon: '🎙️', color: '#a855f7' },
        oracle: { name: '时光预言台', icon: '🔭', color: '#38bdf8' },
        fusion: { name: '遗物熔合台', icon: '⚗️', color: '#c084fc' },
        timebank: { name: '时光银行', icon: '🏧', color: '#2dd4bf' },
        storm: { name: '时空乱流', icon: '🌪️', color: '#64748b' },
        spiritgarden: { name: '精灵花园', icon: '🌸', color: '#f9a8d4' },
        spiritsanctuary: { name: '精灵圣殿', icon: '🏛️', color: '#e879f9' },
        spirittrial: { name: '精灵试炼厅', icon: '⚔️', color: '#c026d3' },
        gacha: { name: '秘境抽卡机', icon: '🎰', color: '#f472b6' },
        escape: { name: '密室逃脱', icon: '🔐', color: '#6366f1' },
        auction: { name: '时光拍卖', icon: '🔨', color: '#eab308' },
        monsterhunt: { name: '狩猎布告栏', icon: '🏹', color: '#ef4444' },
        roulette: { name: '命运轮盘', icon: '🎡', color: '#a855f7' },
        vending: { name: '自动售货机', icon: '🥤', color: '#06b6d4' },
        phantom: { name: '幻境迷宫', icon: '🌫️', color: '#94a3b8' },
        shrineduel: { name: '神龛对决', icon: '⚔️', color: '#fcd34d' },
        beastlair: { name: '异兽巢穴', icon: '🕳️', color: '#dc2626' },
        gamblersden: { name: '秘境赌坊', icon: '🎲', color: '#e11d48' },
        spiritwell: { name: '灵泉圣域', icon: '💧', color: '#22d3ee' },
        spiritrift: { name: '灵隙裂谷', icon: '🌌', color: '#818cf8' },
        spiritmemory: { name: '记忆回廊', icon: '📿', color: '#f0abfc' },
        spiritbazaar: { name: '灵脉集市', icon: '🏮', color: '#fb7185' },
        spiritboss: { name: '灵域王座', icon: '👑', color: '#fbbf24' },
        spiritoracle: { name: '精灵神谕', icon: '🔮', color: '#a78bfa' },
        spiritforge: { name: '灵锻工坊', icon: '⚒️', color: '#f97316' },
        spiritarena: { name: '精灵竞技场', icon: '🏟️', color: '#ef4444' },
        spiritnexus: { name: '灵枢节点', icon: '💠', color: '#38bdf8' },
        spiritcodex: { name: '精灵图鉴殿', icon: '📖', color: '#a3e635' },
        spiritascend: { name: '终焉飞升台', icon: '🌌', color: '#c084fc' },
        spiritstar: { name: '终焉星域', icon: '💫', color: '#818cf8' },
        spiritthrone: { name: '星灵王座', icon: '👑', color: '#fbbf24' },
        starfall: { name: '星陨祭坛', icon: '☄️', color: '#f97316' },
        spiritduel: { name: '精灵对决', icon: '⚔️', color: '#ef4444' },
        celestialvault: { name: '天穹宝库', icon: '🏦', color: '#eab308' },
        timewarp: { name: '时光扭曲', icon: '🌀', color: '#06b6d4' },
        retrospective: { name: '复盘会议室', icon: '📋', color: '#64748b' },
        interview: { name: '秘境面试间', icon: '💼', color: '#475569' },
        codereview: { name: '代码评审炼狱', icon: '🔍', color: '#64748b' },
        standup996: { name: '996开放麦', icon: '🌙', color: '#6366f1' },
        perfreview: { name: '绩效谈话', icon: '📈', color: '#16a34a' },
        teamBuilding: { name: '团建密室', icon: '🎳', color: '#0ea5e9' },
        tyrantcourt: { name: '天穹审判庭', icon: '⚖️', color: '#eab308' },
        spiritparade: { name: '星灵巡礼', icon: '🎊', color: '#f472b6' },
        voidrift: { name: '虚空裂隙', icon: '🕳️', color: '#6366f1' },
        affixforge: { name: '词条熔炉', icon: '🔥', color: '#fb923c' },
        affixhunt: { name: '词条狩猎场', icon: '🏷️', color: '#a78bfa' },
        relicaltar: { name: '遗物祭坛', icon: '🏺', color: '#eab308' },
        bondsanctuary: { name: '羁绊圣所', icon: '💞', color: '#f472b6' },
        championhall: { name: '冠军殿堂', icon: '🏆', color: '#fbbf24' },
        synergyshrine: { name: '羁绊神殿', icon: '🔗', color: '#38bdf8' },
        layoff: { name: '毕业欢送会', icon: '📦', color: '#64748b' },
        okrreview: { name: 'OKR复盘室', icon: '📊', color: '#0ea5e9' },
        fortunewheel: { name: '彩运轮盘', icon: '🎨', color: '#f472b6' },
        legendarchive: { name: '传奇见闻馆', icon: '📜', color: '#a78bfa' },
        pitchdeck: { name: '融资路演厅', icon: '📊', color: '#38bdf8' },
        chronolibrary: { name: '时序图书馆', icon: '📚', color: '#38bdf8' },
        starwishpool: { name: '星愿池', icon: '🌠', color: '#818cf8' },
        mirrormaze: { name: '镜像迷城', icon: '🪞', color: '#94a3b8' },
        runescriptorium: { name: '符文抄录室', icon: '📜', color: '#fbbf24' },
        timeloom: { name: '时光织机', icon: '🧵', color: '#06b6d4' },
        combostorm: { name: '连击风暴', icon: '🌪️', color: '#f43f5e' },
        battlerift: { name: '战斗裂隙', icon: '🌀', color: '#818cf8' },
        wararchive: { name: '战策古卷', icon: '📜', color: '#eab308' },
        bloodarena: { name: '血战竞技场', icon: '🩸', color: '#dc2626' },
        meetingmarathon: { name: '马拉松会议', icon: '🏃', color: '#64748b' },
        slackoutage: { name: '消息宕机', icon: '💬', color: '#ef4444' },
        hotfix911: { name: '紧急热修', icon: '🚑', color: '#f97316' }
    };
    const extMeta = (typeof TSR_CONTENT_ROOM_META !== 'undefined' && TSR_CONTENT_ROOM_META[type]) || null;
    const base = defaults[type] || extMeta || {};
    const fromConfig = tsr?.roomTypes?.[type];
    return {
        ...base,
        name: (fromConfig && fromConfig.name) || base.name || type,
        icon: base.icon || '📍',
        color: base.color || '#94a3b8'
    };
}

function updateTsrDifficultyProgress() {
    const container = document.getElementById('tsrDifficultyProgress');
    if (!container) return;
    const tsr = player.timeSecretRealm;
    const unlockRules = [
        { key: 'normal', need: 3, from: 'easy', label: '普通' },
        { key: 'hard', need: 5, from: 'normal', label: '困难' },
        { key: 'nightmare', need: 10, from: 'hard', label: '噩梦' },
        { key: 'hell', need: 20, from: 'nightmare', label: '地狱' },
        { key: 'abyss', need: 30, from: 'hell', label: '深渊' },
        { key: 'eternal', need: 25, from: 'abyss', label: '永恒' },
        { key: 'transcendent', need: 30, from: 'eternal', label: '超越' },
        { key: 'apocalypse', need: 20, from: 'transcendent', label: '终焉' },
        { key: 'void', need: 15, from: 'apocalypse', label: '虚空' },
        { key: 'omega', need: 12, from: 'void', label: 'Ω序' },
        { key: 'singularity', need: 10, from: 'omega', label: '奇点' }
    ];
    const unlocked = tsr.difficulty?.unlocked || ['easy'];
    const c = tsr.clearCountByDifficulty || {};
    // 只展示「下一个」待解锁目标，避免后续条件提前刷屏
    const next = unlockRules.find(rule => !unlocked.includes(rule.key));
    let html = '<div style="color:#7fdbff;margin-bottom:6px;">难度解锁进度</div>';
    if (!next) {
        html += `<div style="margin:4px 0;font-size:12px;"><span style="color:#32cd32;">✓ 全部难度已解锁</span></div>`;
    } else {
        const count = c[next.from] || 0;
        const pct = Math.min(100, (count / next.need) * 100);
        const fromName = tsr.difficulty?.levels?.[next.from]?.name || next.from;
        html += `<div style="margin:4px 0;font-size:12px;">`;
        html += `<span>${fromName}通关 ${count}/${next.need} → 解锁${next.label}</span>`;
        html += `<div class="tsr-progress-track" style="margin-top:3px;"><div class="tsr-progress-fill" style="width:${pct}%;"></div></div>`;
        html += `</div>`;
    }
    container.innerHTML = html;
}

function clampTsrEternalBonus(value) {
    const n = Number(value) || 0;
    return Math.max(0, Math.min(TSR_ETERNAL_BONUS_MAX, n));
}

function getTsrEternalAttackBonus() {
    const tsr = player.timeSecretRealm;
    return clampTsrEternalBonus(tsr?.permanentBonuses?.eternalAttackBonus);
}

function getTsrEternalHealthBonus() {
    const tsr = player.timeSecretRealm;
    return clampTsrEternalBonus(tsr?.permanentBonuses?.eternalHealthBonus);
}

/** 永恒符文不写主世界；此处改挂主世界地图商店加成 */
function applyTsrEternalRuneBonuses() {
    applyTsrMainWorldShopBonuses();
}

function getTsrMainWorldBonusKey(kind) {
    if (kind === 'attack') return 'mainWorldAttackBonus';
    if (kind === 'health') return 'mainWorldHealthBonus';
    if (kind === 'critDamage') return 'mainWorldCritDamageBonus';
    return null;
}

function getTsrMainWorldShopBonus(kind) {
    const key = getTsrMainWorldBonusKey(kind);
    if (!key) return 0;
    const n = Number(player.timeSecretRealm?.permanentBonuses?.[key]) || 0;
    return Math.max(0, Math.min(TSR_MAINWORLD_BONUS_MAX, n));
}

function addTsrMainWorldShopBonus(kind) {
    const key = getTsrMainWorldBonusKey(kind);
    if (!key) return 0;
    const tsr = player.timeSecretRealm;
    if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
    const current = getTsrMainWorldShopBonus(kind);
    if (current >= TSR_MAINWORLD_BONUS_MAX) return 0;
    const added = Math.min(TSR_MAINWORLD_BONUS_PER_PURCHASE, TSR_MAINWORLD_BONUS_MAX - current);
    tsr.permanentBonuses[key] = current + added;
    return added;
}

/** 永久写入主世界 attributes（世界地图战斗随 updateTechniqueBonuses 重建） */
function applyTsrMainWorldShopBonuses() {
    if (!player?.attributes || !player.timeSecretRealm) return;
    const atk = getTsrMainWorldShopBonus('attack');
    const hp = getTsrMainWorldShopBonus('health');
    const crit = getTsrMainWorldShopBonus('critDamage');
    if (atk > 0) player.attributes.attackBonus = (Number(player.attributes.attackBonus) || 0) + atk;
    if (hp > 0) player.attributes.healthBonus = (Number(player.attributes.healthBonus) || 0) + hp;
    if (crit > 0) player.attributes.critDamageBonus = (Number(player.attributes.critDamageBonus) || 0) + crit;
}

/** 把存档中超额的永恒攻/혈압回上限，并记录溢出（仅展示用） */
function sanitizeTsrEternalBonuses() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.permanentBonuses) return;
    const pb = tsr.permanentBonuses;
    const reclaimOverflow = (key, overflowKey) => {
        let cur = Number(pb[key]) || 0;
        let overflow = Number(pb[overflowKey]) || 0;
        if (overflow > 0 && cur < TSR_ETERNAL_BONUS_MAX) {
            const take = Math.min(overflow, TSR_ETERNAL_BONUS_MAX - cur);
            cur += take;
            overflow -= take;
            pb[key] = cur;
            pb[overflowKey] = overflow > 1e-9 ? overflow : 0;
        }
        if (cur > TSR_ETERNAL_BONUS_MAX) {
            pb[overflowKey] = Math.max(overflow, cur - TSR_ETERNAL_BONUS_MAX);
            pb[key] = TSR_ETERNAL_BONUS_MAX;
        }
    };
    reclaimOverflow('eternalAttackBonus', 'eternalAttackBonusOverflow');
    reclaimOverflow('eternalHealthBonus', 'eternalHealthBonusOverflow');
    if (pb.floorTimeBonus != null) {
        pb.floorTimeBonus = Math.min(TSR_FLOOR_TIME_BONUS_MAX, Number(pb.floorTimeBonus) || 0);
    }
    if (pb.baseTime != null) {
        pb.baseTime = Math.min(TSR_BASE_TIME_BONUS_MAX, Number(pb.baseTime) || 0);
    }
    if (pb.clearRewardBonus != null) {
        pb.clearRewardBonus = Math.min(TSR_CLEAR_REWARD_BONUS_MAX, Number(pb.clearRewardBonus) || 0);
    }
    if (pb.exploreTimeSave != null) {
        pb.exploreTimeSave = Math.min(TSR_EXPLORE_TIME_SAVE_MAX, Number(pb.exploreTimeSave) || 0);
    }
    if (pb.counterReduce != null) {
        pb.counterReduce = Math.min(TSR_COUNTER_REDUCE_MAX, Number(pb.counterReduce) || 0);
    }
}

function resetTsrEternalRuneBonuses() {
    // 永恒符文现已永久生效，转生不再清零
}

function addTsrEternalRuneBonus(effect) {
    const tsr = player.timeSecretRealm;
    if (!tsr.permanentBonuses) {
        tsr.permanentBonuses = { baseTime: 0, startingBuffs: 0 };
    }
    if (effect === 'attack') {
        const current = getTsrEternalAttackBonus();
        if (current >= TSR_ETERNAL_BONUS_MAX) return 0;
        const added = Math.min(TSR_ETERNAL_BONUS_PER_PURCHASE, TSR_ETERNAL_BONUS_MAX - current);
        tsr.permanentBonuses.eternalAttackBonus = current + added;
        return added;
    }
    if (effect === 'health') {
        const current = getTsrEternalHealthBonus();
        if (current >= TSR_ETERNAL_BONUS_MAX) return 0;
        const added = Math.min(TSR_ETERNAL_BONUS_PER_PURCHASE, TSR_ETERNAL_BONUS_MAX - current);
        tsr.permanentBonuses.eternalHealthBonus = current + added;
        return added;
    }
    return 0;
}

function clampTsrCurrency(value) {
    const n = Number(value) || 0;
    return Math.max(0, Math.min(TSR_CURRENCY_MAX, Math.floor(n)));
}

function addTsrPermanentCurrency(amount) {
    if (isTsrTutorialRun()) return 0;
    const tsr = player.timeSecretRealm;
    if (!tsr) return 0;
    const before = clampTsrCurrency(tsr.currency);
    tsr.currency = clampTsrCurrency(before + (Number(amount) || 0));
    return tsr.currency - before;
}

function getDefaultTsrShopItems() {
    return {
        permanentAttack: {
            name: '永恒攻击符文',
            description: `永久提升秘境内攻击力${TSR_ETERNAL_BONUS_PER_PURCHASE * 100}%（限购${TSR_ETERNAL_RUNE_MAX_PURCHASE}，全源合计上限${TSR_ETERNAL_BONUS_MAX_PERCENT}%）`,
            cost: 120000,
            type: 'permanent',
            effect: 'attack',
            maxPurchase: TSR_ETERNAL_RUNE_MAX_PURCHASE,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '⚔️'
        },
        permanentHealth: {
            name: '永恒生命符文',
            description: `永久提升秘境内生命值${TSR_ETERNAL_BONUS_PER_PURCHASE * 100}%（限购${TSR_ETERNAL_RUNE_MAX_PURCHASE}，全源合计上限${TSR_ETERNAL_BONUS_MAX_PERCENT}%）`,
            cost: 120000,
            type: 'permanent',
            effect: 'health',
            maxPurchase: TSR_ETERNAL_RUNE_MAX_PURCHASE,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '❤️'
        },
        worldMapAttack: {
            name: '世界地图·攻击秘卷',
            description: `永久提升主世界攻击+100%（限购${TSR_MAINWORLD_MAX_PURCHASE}，上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%）`,
            cost: 100000,
            type: 'permanent',
            effect: 'main_world_attack',
            maxPurchase: TSR_MAINWORLD_MAX_PURCHASE,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🗺️⚔️'
        },
        worldMapHealth: {
            name: '世界地图·生命秘卷',
            description: `永久提升主世界生命+100%（限购${TSR_MAINWORLD_MAX_PURCHASE}，上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%）`,
            cost: 100000,
            type: 'permanent',
            effect: 'main_world_health',
            maxPurchase: TSR_MAINWORLD_MAX_PURCHASE,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🗺️❤️'
        },
        worldMapCritDamage: {
            name: '世界地图·爆伤秘卷',
            description: `永久提升主世界爆伤+100%（限购${TSR_MAINWORLD_MAX_PURCHASE}，上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%）`,
            cost: 100000,
            type: 'permanent',
            effect: 'main_world_crit',
            maxPurchase: TSR_MAINWORLD_MAX_PURCHASE,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🗺️💥'
        },
        timeExtension: {
            name: '时间沙漏',
            description: `永久增加探索时间${TSR_BASE_TIME_PER_PURCHASE}秒（限购${Math.floor(TSR_BASE_TIME_BONUS_MAX / TSR_BASE_TIME_PER_PURCHASE)}个，合计+${TSR_BASE_TIME_BONUS_MAX}秒）`,
            cost: 500000,
            type: 'permanent',
            effect: 'time',
            maxPurchase: Math.floor(TSR_BASE_TIME_BONUS_MAX / TSR_BASE_TIME_PER_PURCHASE),
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '⏳'
        },
        startingBuff: {
            name: '起始祝福',
            description: '每次冒险开始时永久获得1个随机增益效果（限购3个）',
            cost: 800000,
            type: 'permanent',
            effect: 'startingBuff',
            maxPurchase: 3,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🌟'
        },
        trapSkillBook1: {
            name: '侦查技能书·初级',
            description: '提升陷阱侦查成功率到60%',
            cost: 500000,
            type: 'permanent',
            effect: 'detection_advanced',
            maxPurchase: 1,
            purchased: 0,
            category: 'trap',
            icon: '🔍'
        },
        trapSkillBook2: {
            name: '侦查技能书·高级',
            description: '提升陷阱侦查成功率到80%',
            cost: 800000,
            type: 'permanent',
            effect: 'detection_expert',
            maxPurchase: 1,
            purchased: 0,
            category: 'trap',
            icon: '🔍'
        },
        trapSkillBook3: {
            name: '解除技能书·初级',
            description: '提升陷阱解除成功率到70%',
            cost: 500000,
            type: 'permanent',
            effect: 'disarm_advanced',
            maxPurchase: 1,
            purchased: 0,
            category: 'trap',
            icon: '🛡️'
        },
        trapSkillBook4: {
            name: '解除技能书·高级',
            description: '提升陷阱解除成功率到85%',
            cost: 800000,
            type: 'permanent',
            effect: 'disarm_expert',
            maxPurchase: 1,
            purchased: 0,
            category: 'trap',
            icon: '🛡️'
        },
        trapSense: {
            name: '陷阱感知药水',
            description: '下次冒险陷阱侦查成功率+30%',
            cost: 10000,
            type: 'permanent',
            effect: 'detection_boost',
            category: 'supply',
            icon: '🧪'
        },
        rareMaterial: {
            name: '秘境结晶',
            description: '兑换神器碎片×200（限购1000次）',
            cost: 220000,
            type: 'material',
            effect: 'material',
            maxPurchase: 1000,
            purchased: 0,
            category: 'exchange',
            icon: '💠'
        },
        trapSkillBook5: {
            name: '侦查技能书·大师',
            description: '陷阱侦查成功率提升至95%',
            cost: 1200000,
            type: 'permanent',
            effect: 'detection_master',
            maxPurchase: 1,
            purchased: 0,
            category: 'trap',
            icon: '🔍'
        },
        trapSkillBook6: {
            name: '解除技能书·大师',
            description: '陷阱解除成功率提升至100%',
            cost: 1200000,
            type: 'permanent',
            effect: 'disarm_master',
            maxPurchase: 1,
            purchased: 0,
            category: 'trap',
            icon: '🛡️'
        },
        realmKey: {
            name: '秘境钥匙',
            description: '获得1把秘境钥匙，用于开启冒险',
            cost: 85000,
            type: 'consumable',
            effect: 'realm_key',
            maxPurchase: 50,
            purchased: 0,
            category: 'supply',
            icon: '🔑'
        },
        comboTome: {
            name: '连击秘典',
            description: '永久提升战斗连击收益上限+3%（限购5本，最高+15%）',
            cost: 200000,
            type: 'permanent',
            effect: 'combo_bonus',
            maxPurchase: 5,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '📜'
        },
        gambleCharm: {
            name: '赌局护符',
            description: '永久提升时空赌局胜率+6%（限购3个，最高+18%）',
            cost: 150000,
            type: 'permanent',
            effect: 'gamble_bonus',
            maxPurchase: 3,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🎲'
        },
        relicPouch: {
            name: '遗物皮囊',
            description: `单局遗物携带上限+1（可叠至+${TSR_RELIC_SLOTS_BONUS_MAX}，3→${3 + TSR_RELIC_SLOTS_BONUS_MAX}）`,
            cost: 600000,
            type: 'permanent',
            effect: 'relic_slots',
            maxPurchase: TSR_RELIC_SLOTS_BONUS_MAX,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🎒'
        },
        equipSatchel: {
            name: '装备行囊',
            description: '局内装备背包上限+2（8→12，限购2份）',
            cost: 220000,
            type: 'permanent',
            effect: 'equip_bag',
            maxPurchase: 2,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🎒'
        },
        starterGearPack: {
            name: '探险装备包',
            description: '每次冒险开局随机获得1件普通品质局内装备（限购1份）',
            cost: 180000,
            type: 'permanent',
            effect: 'starter_gear',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'supply',
            icon: '⚔️'
        },
        equipSmithMark: {
            name: '锻炉铭刻',
            description: '局内装备强化费用-30%，强化上限+1（限购1份）',
            cost: 320000,
            type: 'permanent',
            effect: 'equip_smith',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🔨'
        },
        equipReforgeTome: {
            name: '洗炼秘典',
            description: '局内装备洗炼费用-35%（限购1份）',
            cost: 280000,
            type: 'permanent',
            effect: 'equip_reforge_discount',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '📜'
        },
        floorSand: {
            name: '层阶时砂',
            description: `永久每次前往下一层额外+${TSR_FLOOR_TIME_PER_PURCHASE}秒（限购8个；与扩展货架合计上限+${TSR_FLOOR_TIME_BONUS_MAX}秒）`,
            cost: 120000,
            type: 'permanent',
            effect: 'floor_time',
            maxPurchase: 8,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '⏳'
        },
        fortuneMedallion: {
            name: '招财徽章',
            description: '永久提升局内秘境币收益+6%（限购5个，合计+30%）',
            cost: 180000,
            type: 'permanent',
            effect: 'run_currency',
            maxPurchase: 5,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🪙'
        },
        keenElixir: {
            name: '敏锐灵药',
            description: '下次冒险陷阱侦查成功率额外+50%',
            cost: 35000,
            type: 'consumable',
            effect: 'detection_boost_strong',
            category: 'supply',
            icon: '🧪'
        },
        exploreRune: {
            name: '疾行符文',
            description: `永久降低探索行动时间消耗4%（限购${Math.floor(TSR_EXPLORE_TIME_SAVE_MAX / 0.04)}个，合计-${Math.round(TSR_EXPLORE_TIME_SAVE_MAX * 100)}%）`,
            cost: 250000,
            type: 'permanent',
            effect: 'explore_time_save',
            maxPurchase: Math.floor(TSR_EXPLORE_TIME_SAVE_MAX / 0.04),
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '💨'
        },
        trapWardTalisman: {
            name: '避陷护符',
            description: '每场冒险首次触发陷阱时伤害减半',
            cost: 280000,
            type: 'permanent',
            effect: 'trap_ward',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🛡️'
        },
        mysteryCompass: {
            name: '秘境罗盘',
            description: '进入每层时提前显示当前房间类型',
            cost: 350000,
            type: 'permanent',
            effect: 'room_preview',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🧭'
        },
        veteranMedal: {
            name: '老兵勋章',
            description: `通关结算秘境币+8%（限购3枚，有效上限+${Math.round(TSR_CLEAR_REWARD_BONUS_MAX * 100)}%）`,
            cost: 220000,
            type: 'permanent',
            effect: 'clear_reward',
            maxPurchase: 3,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🎖️'
        },
        spiritPact: {
            name: '英灵契约',
            description: '遗物祭坛与谜题房间遭遇率提升（限购3份）',
            cost: 180000,
            type: 'permanent',
            effect: 'spirit_pact',
            maxPurchase: 3,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '📿'
        },
        emergencyKit: {
            name: '应急医药包',
            description: '每次冒险开局携带1个急救药包',
            cost: 95000,
            type: 'permanent',
            effect: 'emergency_kit',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'supply',
            icon: '🩹'
        },
        vaultKey: {
            name: '宝库秘钥',
            description: '时之宝库交易收益+30%（限购3把）',
            cost: 140000,
            type: 'permanent',
            effect: 'vault_bonus',
            maxPurchase: 3,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🔐'
        },
        riskContract: {
            name: '冒险契约',
            description: '每场冒险奖励+20%，但生命上限-8%',
            cost: 450000,
            type: 'permanent',
            effect: 'risk_contract',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '📜'
        },
        relicMagnet: {
            name: '遗物磁石',
            description: '精英掉落遗物概率+12%（限购3块）',
            cost: 320000,
            type: 'permanent',
            effect: 'relic_magnet',
            maxPurchase: 3,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🧲'
        },
        timeLoan: {
            name: '时光借贷券',
            description: '下次冒险开始时额外+90秒，但首层战斗难度提升',
            cost: 45000,
            type: 'consumable',
            effect: 'time_loan',
            category: 'supply',
            icon: '📋'
        },
        milestoneCharm: {
            name: '里程碑护符',
            description: '每10层里程碑额外+8秒（限购3个）',
            cost: 165000,
            type: 'permanent',
            effect: 'milestone_bonus',
            maxPurchase: 3,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🏅'
        },
        sacredFlame: {
            name: '圣火残片',
            description: '遗物祭坛出现4选1（限购1个）',
            cost: 520000,
            type: 'permanent',
            effect: 'relic_choices',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🔥'
        },
        counterArmor: {
            name: '反击护甲',
            description: `永久减少反击伤害4%（限购${Math.floor(TSR_COUNTER_REDUCE_MAX / 0.04)}件，合计-${Math.round(TSR_COUNTER_REDUCE_MAX * 100)}%）`,
            cost: 195000,
            type: 'permanent',
            effect: 'counter_reduce',
            maxPurchase: Math.floor(TSR_COUNTER_REDUCE_MAX / 0.04),
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🦺'
        },
        supplyBundle: {
            name: '探险补给包',
            description: '下次冒险开局携带急救药包+时光胶囊',
            cost: 72000,
            type: 'permanent',
            effect: 'starter_pack',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'supply',
            icon: '🎒'
        },
        doubleKeyBundle: {
            name: '钥匙礼盒',
            description: '获得2把秘境钥匙',
            cost: 155000,
            type: 'consumable',
            effect: 'double_key',
            maxPurchase: 20,
            purchased: 0,
            category: 'supply',
            icon: '🗝️'
        },
        reincarnationDust: {
            name: '转生之尘',
            description: '兑换转生币×10亿（限购1000次）',
            cost: 180000,
            type: 'material',
            effect: 'reincarnation_dust',
            maxPurchase: 1000,
            purchased: 0,
            category: 'exchange',
            icon: '✨'
        },
        forgeBlessing: {
            name: '熔炉祝福',
            description: '时光熔炉收益+40%（限购1份）',
            cost: 380000,
            type: 'permanent',
            effect: 'forge_bonus',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '🔥'
        },
        arenaCrown: {
            name: '竞技王冠',
            description: '时光竞技场奖励+35%（限购1顶）',
            cost: 420000,
            type: 'permanent',
            effect: 'arena_bonus',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '👑'
        },
        disarmScrollSupply: {
            name: '万能解除卷',
            description: '下次冒险首次解除陷阱必定成功',
            cost: 42000,
            type: 'consumable',
            effect: 'guaranteed_disarm',
            category: 'supply',
            icon: '📜'
        },
        memePass: {
            name: '梗王通行证',
            description: '恶趣味房间遭遇率翻倍（限购1张）',
            cost: 288000,
            type: 'permanent',
            effect: 'meme_pass',
            maxPurchase: 1,
            purchased: 0,
            permanentEffect: true,
            category: 'supply',
            icon: '🃏'
        },
        spiritMilk: {
            name: '精灵灵乳',
            description: '喂养时光精灵+80经验',
            cost: 28000,
            type: 'consumable',
            effect: 'spirit_exp_80',
            maxPurchase: 99,
            purchased: 0,
            category: 'spirit',
            icon: '🍼'
        },
        spiritStar: {
            name: '星辉结晶',
            description: '喂养时光精灵+300经验',
            cost: 95000,
            type: 'consumable',
            effect: 'spirit_exp_300',
            maxPurchase: 50,
            purchased: 0,
            category: 'spirit',
            icon: '💠'
        },
        spiritBondFeather: {
            name: '羁绊之羽',
            description: '精灵亲密度+15',
            cost: 150000,
            type: 'consumable',
            effect: 'spirit_bond_15',
            maxPurchase: 30,
            purchased: 0,
            category: 'spirit',
            icon: '🪶'
        },
        spiritEvolveStone: {
            name: '觉醒之石',
            description: '精灵进化+1阶（需达对应等级与终焉条件）',
            cost: 800000,
            type: 'permanent',
            effect: 'spirit_evolve',
            maxPurchase: 4,
            purchased: 0,
            category: 'spirit',
            icon: '🔮'
        },
        spiritChargeAmp: {
            name: '灵韵增幅器',
            description: '永久提升精灵充能效率+10%（限购5，合计+50%）',
            cost: 350000,
            type: 'permanent',
            effect: 'spirit_charge_amp',
            maxPurchase: 5,
            purchased: 0,
            permanentEffect: true,
            category: 'spirit',
            icon: '⚡'
        },
        spiritPactCore: {
            name: '灵核契约',
            description: `精灵触发回血+8%永久（限购${Math.floor(TSR_SPIRIT_HEAL_AMP_MAX / 0.08)}，合计+${Math.round(TSR_SPIRIT_HEAL_AMP_MAX * 100)}%）`,
            cost: 520000,
            type: 'permanent',
            effect: 'spirit_heal_amp',
            maxPurchase: Math.floor(TSR_SPIRIT_HEAL_AMP_MAX / 0.08),
            purchased: 0,
            permanentEffect: true,
            category: 'spirit',
            icon: '💖'
        },
        spiritTalentOrb: {
            name: '天赋灵珠',
            description: '获得2点灵脉技能点（限购8）',
            cost: 120000,
            type: 'consumable',
            effect: 'spirit_skill_point_2',
            maxPurchase: 8,
            purchased: 0,
            category: 'spirit',
            icon: '🫧'
        },
        spiritBondElixir: {
            name: '羁绊灵露',
            description: '精灵亲密度+25（限购15）',
            cost: 180000,
            type: 'consumable',
            effect: 'spirit_bond_25',
            maxPurchase: 15,
            purchased: 0,
            category: 'spirit',
            icon: '🧪'
        },
        spiritSkillScroll: {
            name: '灵脉洗髓卷',
            description: '免费重置全部灵脉技能（限购3）',
            cost: 220000,
            type: 'consumable',
            effect: 'spirit_skill_reset',
            maxPurchase: 3,
            purchased: 0,
            category: 'spirit',
            icon: '📜'
        },
        spiritTrialToken: {
            name: '试炼邀请函',
            description: '下次冒险必定遭遇精灵试炼厅（限购5）',
            cost: 95000,
            type: 'consumable',
            effect: 'spirit_trial_token',
            maxPurchase: 5,
            purchased: 0,
            category: 'spirit',
            icon: '⚔️'
        },
        starSpiritCrown: {
            name: '星灵王冠',
            description: `永久灵击伤害+10%（限购${Math.floor(TSR_STAR_SPIRIT_STRIKE_MAX / 0.1)}，合计+${Math.round(TSR_STAR_SPIRIT_STRIKE_MAX * 100)}%，需终焉星灵）`,
            cost: 680000,
            type: 'permanent',
            effect: 'star_spirit_strike',
            maxPurchase: Math.floor(TSR_STAR_SPIRIT_STRIKE_MAX / 0.1),
            purchased: 0,
            permanentEffect: true,
            category: 'spirit',
            icon: '👑'
        },
        starDomainSigil: {
            name: '星域符印',
            description: `终焉星灵特殊房率+3%永久（限购${Math.floor(TSR_STAR_DOMAIN_SIGIL_MAX / 0.03)}，合计+${Math.round(TSR_STAR_DOMAIN_SIGIL_MAX * 100)}%）`,
            cost: 520000,
            type: 'permanent',
            effect: 'star_domain_sigil',
            maxPurchase: Math.floor(TSR_STAR_DOMAIN_SIGIL_MAX / 0.03),
            purchased: 0,
            permanentEffect: true,
            category: 'spirit',
            icon: '💫'
        },
        starAscendToken: {
            name: '星域引路符',
            description: '下次冒险优先遭遇飞升台/终焉星域（限购5）',
            cost: 120000,
            type: 'consumable',
            effect: 'star_ascend_token',
            maxPurchase: 5,
            purchased: 0,
            category: 'spirit',
            icon: '🌌'
        },
        starOriginElixir: {
            name: '本源灵浆',
            description: '终焉星灵专属：经验+500，亲密度+20',
            cost: 280000,
            type: 'consumable',
            effect: 'star_origin_elixir',
            maxPurchase: 20,
            purchased: 0,
            category: 'spirit',
            icon: '🧪'
        },
        throneBlessing: {
            name: '王座祝福卷',
            description: '下次冒险优先遭遇星灵王座（限购3）',
            cost: 180000,
            type: 'consumable',
            effect: 'throne_blessing',
            maxPurchase: 3,
            purchased: 0,
            category: 'spirit',
            icon: '👑'
        },
        archonFragment: {
            name: '主宰残片',
            description: `永久灵击+5%，特殊房+2%（限购${Math.floor(TSR_ARCHON_FRAGMENT_MAX / 0.05)}，合计+${Math.round(TSR_ARCHON_FRAGMENT_MAX * 100)}%，需王座通关1次）`,
            cost: 750000,
            type: 'permanent',
            effect: 'archon_fragment',
            maxPurchase: Math.floor(TSR_ARCHON_FRAGMENT_MAX / 0.05),
            purchased: 0,
            permanentEffect: true,
            category: 'spirit',
            icon: '💫'
        },
        tyrantCourtToken: {
            name: '审判引路符',
            description: '下次冒险优先遭遇天穹审判庭（限购3，需击败暴君1次）',
            cost: 200000,
            type: 'consumable',
            effect: 'tyrant_court_token',
            maxPurchase: 3,
            purchased: 0,
            category: 'spirit',
            icon: '⚖️'
        },
        affixHunterNet: {
            name: '词条猎网',
            description: '下次冒险怪物词条出现率大幅提升（限购5）',
            cost: 95000,
            type: 'consumable',
            effect: 'affix_hunter_net',
            maxPurchase: 5,
            purchased: 0,
            category: 'supply',
            icon: '🏷️'
        },
        affixTome: {
            name: '词条通晓书',
            description: `永久词条赏金+5%（限购3次；与进阶货架合计上限+${Math.round(TSR_AFFIX_TOME_MAX * 100)}%）`,
            cost: 180000,
            type: 'permanent',
            effect: 'affix_tome',
            maxPurchase: 3,
            purchased: 0,
            permanentEffect: true,
            category: 'enhance',
            icon: '📕'
        },
        affixSwapSupply: {
            name: '词条置换符',
            description: '下次冒险携带1张词条置换符',
            cost: 72000,
            type: 'consumable',
            effect: 'affix_swap_supply',
            maxPurchase: 8,
            purchased: 0,
            category: 'supply',
            icon: '🔄'
        },
        synergyTokenSupply: {
            name: '羁绊信物',
            description: '下次冒险携带羁绊信物（羁绊+50%）',
            cost: 88000,
            type: 'consumable',
            effect: 'synergy_token_supply',
            maxPurchase: 5,
            purchased: 0,
            category: 'supply',
            icon: '🔗'
        },
        championMedalSupply: {
            name: '冠军奖章',
            description: '下次冒险携带冠军奖章',
            cost: 95000,
            type: 'consumable',
            effect: 'champion_medal_supply',
            maxPurchase: 5,
            purchased: 0,
            category: 'supply',
            icon: '🏅'
        },
        fortuneTokenSupply: {
            name: '星运符',
            description: '下次冒险携带星运符（随机星运共鸣）',
            cost: 68000,
            type: 'consumable',
            effect: 'fortune_token_supply',
            maxPurchase: 8,
            purchased: 0,
            category: 'supply',
            icon: '🌟'
        },
        chronoCapsuleSupply: {
            name: '时序胶囊',
            description: '下次冒险携带时序胶囊（预览2层，3层内行动耗时-10%）',
            cost: 82000,
            type: 'consumable',
            effect: 'chrono_capsule_supply',
            maxPurchase: 6,
            purchased: 0,
            category: 'supply',
            icon: '💊'
        },
        libraryScrollSupply: {
            name: '秘闻卷轴',
            description: '下次冒险携带秘闻卷轴（2次特殊房收益+40%）',
            cost: 76000,
            type: 'consumable',
            effect: 'library_scroll_supply',
            maxPurchase: 6,
            purchased: 0,
            category: 'supply',
            icon: '📜'
        },
        wishCoinSupply: {
            name: '星愿硬币',
            description: '下次冒险携带星愿硬币（满充能+亲密度+8）',
            cost: 92000,
            type: 'consumable',
            effect: 'wish_coin_supply',
            maxPurchase: 5,
            purchased: 0,
            category: 'supply',
            icon: '🪙'
        }
    };
}

const TSR_SHOP_CATEGORIES = {
    enhance: { label: '永久强化', icon: '✨' },
    trap: { label: '陷阱技能', icon: '🪤' },
    supply: { label: '冒险补给', icon: '🎒' },
    spirit: { label: '精灵养成', icon: '🧚' },
    exchange: { label: '材料兑换', icon: '💎' }
};

function getDefaultTsrTraps() {
    return {
        types: {
            poison: { weight: 20, name: '毒液陷阱', damageType: 'percentage', damage: 0.1, duration: 3 },
            spike: { weight: 15, name: '尖刺陷阱', damageType: 'fixed', damage: 1000, duration: 1 },
            curse: { weight: 10, name: '诅咒陷阱', damageType: 'debuff', effect: 'attack', value: -0.3, duration: 5 },
            slow: { weight: 12, name: '迟缓陷阱', damageType: 'time', damage: 30, duration: 0 },
            confusion: { weight: 8, name: '混乱陷阱', damageType: 'random', damage: 0.12, duration: 2 },
            disarm: { weight: 5, name: '缴械陷阱', damageType: 'debuff', effect: 'critRate', value: -0.5, duration: 4 },
            freeze: { weight: 7, name: '冰冻陷阱', damageType: 'time', damage: 45, duration: 0 },
            drain: { weight: 6, name: '吸币陷阱', damageType: 'currency', damage: 0.12, duration: 0 },
            alarm: { weight: 5, name: '警报陷阱', damageType: 'time', damage: 20, duration: 0 },
            mirror: { weight: 4, name: '镜像陷阱', damageType: 'debuff', effect: 'critRate', value: -0.25, duration: 4 },
            gravity: { weight: 5, name: '重力陷阱', damageType: 'percentage', damage: 0.08, duration: 2 }
        },
        detectionSkills: {
            basic: { name: '基础侦查', successRate: 0.3, cost: 5 },
            advanced: { name: '高级侦查', successRate: 0.6, cost: 15 },
            expert: { name: '专家侦查', successRate: 0.8, cost: 25 },
            master: { name: '大师侦查', successRate: 0.95, cost: 40 }
        },
        disarmSkills: {
            basic: { name: '基础解除', successRate: 0.4, cost: 10 },
            advanced: { name: '高级解除', successRate: 0.7, cost: 20 },
            expert: { name: '专家解除', successRate: 0.85, cost: 35 },
            master: { name: '大师解除', successRate: 1.0, cost: 50 }
        },
        playerSkills: {
            detection: 'basic',
            disarm: 'basic'
        }
    };
}

function getTsrSkillRank(skillType, level) {
    const ranks = { basic: 0, advanced: 1, expert: 2, master: 3 };
    return ranks[level] != null ? ranks[level] : 0;
}

function getTsrShopItemBlockReason(item) {
    const tsr = player.timeSecretRealm;
    if (!item) return '物品不存在';
    if (item.maxPurchase && (item.purchased || 0) >= item.maxPurchase) {
        return `${item.name}已达到购买上限（${item.maxPurchase}个）`;
    }
    switch (item.effect) {
        case 'attack':
            if (getTsrEternalAttackBonus() >= TSR_ETERNAL_BONUS_MAX) {
                return `永恒攻击符文加成已达上限${TSR_ETERNAL_BONUS_MAX_PERCENT}%`;
            }
            break;
        case 'health':
            if (getTsrEternalHealthBonus() >= TSR_ETERNAL_BONUS_MAX) {
                return `永恒生命符文加成已达上限${TSR_ETERNAL_BONUS_MAX_PERCENT}%`;
            }
            break;
        case 'main_world_attack':
            if (getTsrMainWorldShopBonus('attack') >= TSR_MAINWORLD_BONUS_MAX) {
                return `世界地图攻击加成已达上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`;
            }
            break;
        case 'main_world_health':
            if (getTsrMainWorldShopBonus('health') >= TSR_MAINWORLD_BONUS_MAX) {
                return `世界地图生命加成已达上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`;
            }
            break;
        case 'main_world_crit':
            if (getTsrMainWorldShopBonus('critDamage') >= TSR_MAINWORLD_BONUS_MAX) {
                return `世界地图爆伤加成已达上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`;
            }
            break;
    }
    const skills = tsr.traps && tsr.traps.playerSkills;
    if (!skills) return null;
    switch (item.effect) {
        case 'detection_advanced':
            if (getTsrSkillRank('detection', skills.detection) >= 1) return '已拥有更高级侦查技能';
            break;
        case 'detection_expert':
            if (getTsrSkillRank('detection', skills.detection) >= 2) return '已拥有专家级侦查技能';
            break;
        case 'disarm_advanced':
            if (getTsrSkillRank('disarm', skills.disarm) >= 1) return '已拥有更高级解除技能';
            break;
        case 'disarm_expert':
            if (getTsrSkillRank('disarm', skills.disarm) >= 2) return '已拥有专家级解除技能';
            break;
        case 'detection_master':
            if (getTsrSkillRank('detection', skills.detection) >= 3) return '已拥有大师级侦查技能';
            break;
        case 'disarm_master':
            if (getTsrSkillRank('disarm', skills.disarm) >= 3) return '已拥有大师级解除技能';
            break;
        case 'relic_slots':
            if ((tsr.permanentBonuses?.relicSlots || 0) >= TSR_RELIC_SLOTS_BONUS_MAX) return '遗物皮囊已达上限';
            break;
        case 'equip_bag':
            if ((tsr.permanentBonuses?.equipBagBonus || 0) >= TSR_EQUIP_BAG_BONUS_MAX) return '装备行囊已达上限';
            break;
        case 'starter_gear':
            if (tsr.permanentBonuses?.starterGear) return '探险装备包已配备';
            break;
        case 'equip_smith':
            if (tsr.permanentBonuses?.equipSmith) return '锻炉铭刻已生效';
            break;
        case 'equip_reforge_discount':
            if (tsr.permanentBonuses?.equipReforgeDiscount) return '洗炼秘典已生效';
            break;
        case 'trap_ward':
            if (tsr.permanentBonuses?.trapWard) return '避陷护符已生效';
            break;
        case 'room_preview':
            if (tsr.permanentBonuses?.roomPreview) return '秘境罗盘已生效';
            break;
        case 'risk_contract':
            if (tsr.permanentBonuses?.riskContract) return '冒险契约已签订';
            break;
        case 'emergency_kit':
            if (tsr.permanentBonuses?.emergencyKit) return '应急医药包已配备';
            break;
        case 'relic_choices':
            if (tsr.permanentBonuses?.relicChoices) return '圣火残片已生效';
            break;
        case 'starter_pack':
            if (tsr.permanentBonuses?.starterPack) return '探险补给包已配备';
            break;
        case 'forge_bonus':
            if (tsr.permanentBonuses?.forgeBonus) return '熔炉祝福已生效';
            break;
        case 'arena_bonus':
            if (tsr.permanentBonuses?.arenaBonus) return '竞技王冠已生效';
            break;
        case 'meme_pass':
            if (tsr.permanentBonuses?.memePass) return '梗王通行证已生效';
            break;
        case 'spirit_evolve': {
            const sp = ensureTsrSpiritPet();
            if (!sp) return null;
            if (sp.evolution >= getTsrSpiritMaxEvolution()) return '精灵已达最高进化阶';
            const nextEvo = sp.evolution + 1;
            return getTsrSpiritEvolveBlockReason(nextEvo);
        }
        case 'spirit_exp_80':
        case 'spirit_exp_300': {
            const sp = ensureTsrSpiritPet();
            if (sp && sp.level >= TSR_SPIRIT_MAX_LEVEL) return '精灵已满级';
            break;
        }
        case 'spirit_bond_15': {
            const sp = ensureTsrSpiritPet();
            if (sp && sp.bond >= TSR_SPIRIT_MAX_BOND) return '亲密度已满';
            break;
        }
        case 'spirit_bond_25': {
            const sp = ensureTsrSpiritPet();
            if (sp && sp.bond >= TSR_SPIRIT_MAX_BOND) return '亲密度已满';
            break;
        }
        case 'spirit_skill_reset': {
            const sp = ensureTsrSpiritPet();
            if (!sp?.skills?.length) return '尚未学习灵脉技能';
            break;
        }
        case 'spirit_charge_amp':
            if ((tsr.permanentBonuses?.spiritChargeAmp || 0) >= 0.5) return '灵韵增幅器已达上限';
            break;
        case 'spirit_heal_amp':
            if ((tsr.permanentBonuses?.spiritHealAmp || 0) >= TSR_SPIRIT_HEAL_AMP_MAX) return '灵核契约已达上限';
            break;
        case 'star_spirit_strike': {
            const sp = ensureTsrSpiritPet();
            if (!sp || (sp.evolution || 0) < getTsrSpiritMaxEvolution()) return '需要精灵进化至终焉星灵';
            if ((tsr.permanentBonuses?.starSpiritStrike || 0) >= TSR_STAR_SPIRIT_STRIKE_MAX) return '星灵王冠已达上限';
            break;
        }
        case 'star_domain_sigil': {
            const sp = ensureTsrSpiritPet();
            if (!sp || (sp.evolution || 0) < getTsrSpiritMaxEvolution()) return '需要精灵进化至终焉星灵';
            if ((tsr.permanentBonuses?.starDomainSigil || 0) >= TSR_STAR_DOMAIN_SIGIL_MAX) return '星域符印已达上限';
            break;
        }
        case 'star_origin_elixir': {
            const sp = ensureTsrSpiritPet();
            if (!sp || (sp.evolution || 0) < getTsrSpiritMaxEvolution()) return '需要精灵进化至终焉星灵';
            if (sp.level >= TSR_SPIRIT_MAX_LEVEL) return '精灵已满级';
            break;
        }
        case 'archon_fragment': {
            if ((tsr.lifetimeStats?.throneClears || 0) < 1) return '需要完成至少1次王座三连战';
            if ((tsr.permanentBonuses?.archonFragment || 0) >= TSR_ARCHON_FRAGMENT_MAX) return '主宰残片已达上限';
            break;
        }
        case 'explore_time_save':
            if ((tsr.permanentBonuses?.exploreTimeSave || 0) >= TSR_EXPLORE_TIME_SAVE_MAX) return '疾行符文已达上限';
            break;
        case 'floor_time':
            if ((tsr.permanentBonuses?.floorTimeBonus || 0) >= TSR_FLOOR_TIME_BONUS_MAX) return '层阶时砂已达上限';
            break;
        case 'clear_reward':
            if ((tsr.permanentBonuses?.clearRewardBonus || 0) >= TSR_CLEAR_REWARD_BONUS_MAX) return '通关奖励已达上限';
            break;
        case 'counter_reduce':
            if ((tsr.permanentBonuses?.counterReduce || 0) >= TSR_COUNTER_REDUCE_MAX) return '反击护甲已达上限';
            break;
        case 'affix_codex_boost':
            if ((tsr.permanentBonuses?.affixTome || 0) >= TSR_AFFIX_TOME_MAX) return '词条赏金已达上限';
            break;
        case 'tyrant_court_token': {
            if ((tsr.lifetimeStats?.tyrantKills || 0) < 1) return '需要击败至少1次天穹暴君';
            break;
        }
        case 'affix_tome':
            if ((tsr.permanentBonuses?.affixTome || 0) >= TSR_AFFIX_TOME_MAX) return '词条通晓书已达上限';
            break;
    }
    return null;
}

function getTsrShopItemExtraInfo(item) {
    const tsr = player.timeSecretRealm;
    const pb = tsr?.permanentBonuses || {};
    switch (item.effect) {
        case 'attack':
            return `当前: ${(getTsrEternalAttackBonus() * 100).toFixed(0)}% / ${TSR_ETERNAL_BONUS_MAX_PERCENT}%`;
        case 'health':
            return `当前: ${(getTsrEternalHealthBonus() * 100).toFixed(0)}% / ${TSR_ETERNAL_BONUS_MAX_PERCENT}%`;
        case 'main_world_attack':
            return `主世界攻击: +${(getTsrMainWorldShopBonus('attack') * 100).toFixed(0)}% / ${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`;
        case 'main_world_health':
            return `主世界生命: +${(getTsrMainWorldShopBonus('health') * 100).toFixed(0)}% / ${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`;
        case 'main_world_crit':
            return `主世界爆伤: +${(getTsrMainWorldShopBonus('critDamage') * 100).toFixed(0)}% / ${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`;
        case 'combo_bonus':
            return `连击上限: +${((pb.comboBonus || 0) * 100).toFixed(0)}% / +15%`;
        case 'gamble_bonus':
            return `赌局加成: +${((pb.gambleBonus || 0) * 100).toFixed(0)}% / +18%`;
        case 'floor_time':
            return `每层加时: +${pb.floorTimeBonus || 0}秒 / +${TSR_FLOOR_TIME_BONUS_MAX}秒`;
        case 'run_currency':
            return `局内收益: +${((pb.runCurrencyBonus || 0) * 100).toFixed(0)}% / +30%`;
        case 'explore_time_save':
            return `行动耗时: -${((pb.exploreTimeSave || 0) * 100).toFixed(0)}% / -${Math.round(TSR_EXPLORE_TIME_SAVE_MAX * 100)}%`;
        case 'relic_slots':
            return `遗物上限: ${getTsrRelicMax()}个`;
        case 'equip_bag':
            return `装备背包: ${getTsrEquipBagMax()}格`;
        case 'starter_gear':
            return '开局赠1件普通装备';
        case 'equip_smith':
            return `强化上限+${getTsrEquipEnhanceMax()} · 费用-20%`;
        case 'equip_reforge_discount':
            return '洗炼费用-25%';
        case 'realm_key':
            return `当前钥匙: ${player.items.fuben2 || 0}把`;
        case 'clear_reward':
            return `通关加成: +${(getTsrPermanentClearRewardBonus() * 100).toFixed(0)}% / +${Math.round(TSR_CLEAR_REWARD_BONUS_MAX * 100)}%`;
        case 'spirit_pact':
            return `特殊房间率: +${(getTsrPermanentSpiritPactBonus() * 100).toFixed(0)}%`;
        case 'vault_bonus':
            return `宝库收益: +${(getTsrPermanentVaultBonus() * 100).toFixed(0)}% / +75%`;
        case 'relic_magnet':
            return `精英遗物率: +${(getTsrPermanentRelicMagnetBonus() * 100).toFixed(0)}% / +30%`;
        case 'milestone_bonus':
            return `里程碑加时: +${getTsrPermanentMilestoneBonus()}秒`;
        case 'counter_reduce':
            return `反击减伤: -${(getTsrPermanentCounterReduce() * 100).toFixed(0)}% / -${Math.round(TSR_COUNTER_REDUCE_MAX * 100)}%`;
        case 'forge_bonus':
            return `熔炉收益: +${(getTsrPermanentForgeBonus() * 100).toFixed(0)}%`;
        case 'arena_bonus':
            return `竞技收益: +${(getTsrPermanentArenaBonus() * 100).toFixed(0)}%`;
        case 'spirit_exp_80':
        case 'spirit_exp_300': {
            const sp = ensureTsrSpiritPet();
            const need = getTsrSpiritExpNeeded(sp.level);
            return sp.level >= TSR_SPIRIT_MAX_LEVEL ? '精灵已满级' : `经验: ${sp.exp}/${need} · Lv${sp.level}`;
        }
        case 'spirit_bond_15': {
            const sp = ensureTsrSpiritPet();
            return `亲密度: ${sp.bond}/${TSR_SPIRIT_MAX_BOND}`;
        }
        case 'spirit_evolve': {
            const sp = ensureTsrSpiritPet();
            return `当前: ${getTsrSpiritEvolutionName(sp.evolution)} · Lv${sp.level}`;
        }
        case 'spirit_charge_amp':
            return `充能加成: +${((pb.spiritChargeAmp || 0) * 100).toFixed(0)}% / +50%`;
        case 'spirit_heal_amp':
            return `触发回血: +${((pb.spiritHealAmp || 0) * 100).toFixed(0)}% / +${Math.round(TSR_SPIRIT_HEAL_AMP_MAX * 100)}%`;
        case 'spirit_skill_point_2': {
            const sp = ensureTsrSpiritPet();
            return `技能点: ${getTsrSpiritAvailableSkillPoints()}可用 / 共${sp.skillPoints || 0}`;
        }
        case 'spirit_bond_25': {
            const sp = ensureTsrSpiritPet();
            return `亲密度: ${sp.bond}/${TSR_SPIRIT_MAX_BOND}`;
        }
        case 'star_spirit_strike':
            return `灵击加成: +${(getTsrPermanentStarSpiritStrike() * 100).toFixed(0)}% / +${Math.round(TSR_STAR_SPIRIT_STRIKE_MAX * 100)}%`;
        case 'star_domain_sigil':
            return `特殊房加成: +${(getTsrPermanentStarDomainSigil() * 100).toFixed(0)}% / +${Math.round(TSR_STAR_DOMAIN_SIGIL_MAX * 100)}%`;
        case 'star_origin_elixir': {
            const sp = ensureTsrSpiritPet();
            return sp && (sp.evolution || 0) >= getTsrSpiritMaxEvolution() ? `Lv${sp.level} · ${getTsrSpiritEvolutionName(sp.evolution)}` : '需终焉星灵';
        }
        case 'affix_tome':
        case 'affix_codex_boost':
            return `词条赏金: +${((pb.affixTome || 0) * 100).toFixed(0)}% / +${Math.round(TSR_AFFIX_TOME_MAX * 100)}%`;
        default:
            return '';
    }
}

// 切换时光秘境界面
function toggleTimeSecretRealm() {
   if (player.reincarnationCount < 2000) {
        alert("需要达到2000转才能开启秘境系统！");
        return;
    }
    const overlay = document.getElementById('timeSecretRealmOverlay');
    const ui = document.getElementById('timeSecretRealmUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
        stopTsrTimer();
    } else {
        initTimeSecretRealm();
        ui.style.display = 'block';
        overlay.style.display = 'block';

        const tsr = player.timeSecretRealm;
        if (tsr.currentRun && tsr.currentRun.isActive) {
            showTsrAdventureView();
            startTsrTimer();
        } else {
            showTsrLobbyView();
        }
        updateTsrTicker(true);
        updateTimeSecretRealmUI();
    }
}


// 更新时光秘境界面
function updateTimeSecretRealmUI(options) {
    options = options || {};
    if (!options.skipEnsure) ensureTimeSecretRealmData();
    const tsr = player.timeSecretRealm;
    
    document.getElementById('tsrCurrency').textContent = `${tsr.currency.toFixed(0)} / ${TSR_CURRENCY_MAX}`;
    document.getElementById('tsrBestFloor').textContent = tsr.bestFloor;
    document.getElementById('tsrClearCount').textContent = tsr.clearCount;
    const totalRunsEl = document.getElementById('tsrTotalRuns');
    if (totalRunsEl) totalRunsEl.textContent = tsr.totalRuns || 0;
    const keyEl = document.getElementById('tsrKeyCount');
    if (keyEl) keyEl.textContent = player.items.fuben2 || 0;
    const bestHero = document.getElementById('tsrBestFloorHero');
    if (bestHero) bestHero.textContent = tsr.bestFloor;
    const codexPct = document.getElementById('tsrCodexPct');
    if (codexPct) codexPct.textContent = Math.round(getTsrCodexDiscoverRatio() * 100) + '%';
    
    if (!options.runOnly) {
        updateDifficultyUI();
        updateTsrDifficultyProgress();
        updateTsrCodexDisplay();
        updateTsrSubContractUI();
        updateTsrSpiritDisplay();
        updateTsrSpiritContractUI();
        updateTsrHeroBar();
        updateTsrLobbyDashboard();
        updateTsrFateCardUI();
        updateTsrTabBadges();
        updateTsrTicker(false);
    }
    
    if (tsr.currentRun.isActive) {
        updateTsrRunPanelUI(options);
    }
}

function updateTsrRunPanelUI(options) {
    options = options || {};
    const tsr = player.timeSecretRealm;
    const difficulty = tsr.difficulty.levels[tsr.currentRun.difficulty];
    const clearFloor = tsr.currentRun.clearFloor || difficulty.clearFloor;
    const progress = Math.min(100, (tsr.currentRun.currentFloor / clearFloor) * 100);
    
    document.getElementById('tsrCurrentFloor').textContent = `${tsr.currentRun.currentFloor}/${clearFloor}`;
    document.getElementById('tsrTempBuffs').textContent = tsr.currentRun.tempBuffs.length;
    document.getElementById('tsrCurrentCurrency').textContent = tsr.currentRun.currencyEarned;

    const spiritEl = document.getElementById('tsrSpiritCharge');
    const spiritSub = document.getElementById('tsrSpiritRunSub');
    if (spiritEl) spiritEl.textContent = `${tsr.currentRun.spiritCharge || 0}%`;
    if (spiritSub) {
        const sp = ensureTsrSpiritPet();
        spiritSub.textContent = `${getTsrSpiritDisplayName()} Lv${sp.level}`;
    }
    const invokeBtn = document.getElementById('tsrInvokeSpiritBtn');
    if (invokeBtn) {
        invokeBtn.disabled = (tsr.currentRun.spiritCharge || 0) < 30 || tsr.currentRun.timeLeft <= 18;
    }
    const resonanceEl = document.getElementById('tsrVoidResonance');
    if (resonanceEl) resonanceEl.textContent = `${Math.floor(tsr.currentRun.voidResonance || 0)}%`;

    const badge = document.getElementById('tsrRunDifficultyBadge');
    if (badge) {
        badge.style.display = 'inline-block';
        badge.textContent = difficulty.name;
    }
    
    const progressElement = document.getElementById('tsrProgress');
    if (progressElement) {
        progressElement.innerHTML = `
            <div class="tsr-progress-label">
                <span>通关进度</span>
                <span>${tsr.currentRun.currentFloor}/${clearFloor} (${progress.toFixed(0)}%)</span>
            </div>
            <div class="tsr-progress-track">
                <div class="tsr-progress-fill" style="width:${progress}%;"></div>
            </div>
        `;
    }
    
    updateTsrFloorMap();
    updateTsrTimeRing();
    updateTsrComboDisplay();
    updateTsrAffixDisplay();
    if (!options.light) {
        updateCurrentRoomDisplay();
        updateSkillsDisplay();
        updateTsrRoomPreview();
        updateTsrRelicsDisplay();
        updateTsrEquipmentDisplay();
        updateTsrConsumablesDisplay();
    }
    updateBuffsDisplay();
    updateHealthBar();
    updateTsrCombatBar();
    // 战斗演出于进行中时绝不能藏横幅，否则会立刻打断自动攻击并卡在「准备开战」
    if (!tsr.currentRun?.battleInProgress) {
        hideTsrMonsterBanner();
    }
    // light 刷新也会跳过 updateCurrentRoomDisplay；必须在此同步按钮，
    // 否则动态遭遇/轻量结算后「下一层」会一直保持禁用
    if (typeof updateActionButtons === 'function') updateActionButtons();
}
// 难度选择函数
function selectTsrDifficulty(difficulty) {
    const tsr = player.timeSecretRealm;
    
    // 检查是否已解锁该难度
    if (!tsr.difficulty.unlocked.includes(difficulty)) {
        const condition = tsr.difficulty.levels[difficulty].unlockCondition;
        logAction(`尚未解锁${tsr.difficulty.levels[difficulty].name}难度！需要：${condition}`, 'error');
        return;
    }
    
    tsr.difficulty.current = difficulty;
    updateDifficultyUI();
    logAction(`已选择${tsr.difficulty.levels[difficulty].name}难度`, 'success');
}

// 更新难度UI显示
function updateDifficultyUI() {
    const tsr = player.timeSecretRealm;
    const difficulty = tsr.difficulty.levels[tsr.difficulty.current];
    const diffBtnMap = {
        difficultyEasy: 'easy',
        difficultyNormal: 'normal',
        difficultyHard: 'hard',
        difficultyNightmare: 'nightmare',
        difficultyHell: 'hell',
        difficultyAbyss: 'abyss',
        difficultyEternal: 'eternal',
        difficultyTranscendent: 'transcendent',
        difficultyApocalypse: 'apocalypse',
        difficultyVoid: 'void',
        difficultyOmega: 'omega',
        difficultySingularity: 'singularity'
    };
    
    Object.entries(diffBtnMap).forEach(([btnId, diffKey]) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        const locked = !tsr.difficulty.unlocked.includes(diffKey);
        const selected = tsr.difficulty.current === diffKey;
        // 未解锁难度直接隐藏，不占位
        btn.style.display = locked ? 'none' : '';
        btn.disabled = locked;
        btn.style.cursor = locked ? 'not-allowed' : 'pointer';
        btn.style.opacity = locked ? '0.35' : '1';
        btn.classList.toggle('selected', selected && !locked);
        btn.classList.toggle('active', selected && !locked);
    });
    // 「展开更高难度」仅在已解锁高难档时显示
    const moreBtn = document.querySelector('#tsrDifficultySelection .tsr-diff-more-btn');
    if (moreBtn) {
        const unlockedSet = new Set(tsr.difficulty.unlocked || []);
        const hasVisibleExtra = [...document.querySelectorAll('#tsrDifficultySelection .tsr-diff-card.tsr-diff-card--extra')]
            .some(card => unlockedSet.has(card.dataset.difficulty));
        moreBtn.style.display = hasVisibleExtra ? '' : 'none';
    }
    
    // 更新难度信息
    document.getElementById('difficultyDescription').innerHTML = `
        <strong class="tsr-txt-gold">${difficulty.name}难度</strong>: <span class="tsr-txt-em">${difficulty.description}</span><br>
        <span class="tsr-txt-danger">怪物强度: ${difficulty.multiplier}x</span> | 
        <span class="tsr-txt-gold">奖励倍数: ${difficulty.rewardMultiplier}x</span><br>
        <span class="tsr-txt-fortune">通关要求: ${difficulty.clearFloor}层</span> |
        <span class="tsr-txt-num">时限约 ${estimateTsrRunTime(tsr.difficulty.current)} 秒</span><br>
        <span class="tsr-txt-spirit">精英 ${Math.floor(difficulty.clearFloor / TSR_ELITE_FLOOR_INTERVAL)} 场 · 首领 ${Math.floor(difficulty.clearFloor / TSR_BOSS_FLOOR_INTERVAL)} 场</span>
    `;
    const rewardEstEl = document.getElementById('tsrRewardEstimate');
    if (rewardEstEl) {
        const est = estimateTsrClearReward(tsr.difficulty.current);
        const cap = getTsrDifficultyRunCurrencyCap(tsr.difficulty.current);
        const capTip = cap != null ? `，本难度封顶 ${cap.toLocaleString()}` : '';
        rewardEstEl.innerHTML = `预估通关收益约 <strong style="color:#fde68a;">${est.toLocaleString()}</strong> 秘境币（含通关奖励${capTip}，受路线影响）`;
    }
    
    // 更新解锁条件显示
    let unlockInfo = '<strong>已解锁难度:</strong> ';
    tsr.difficulty.unlocked.forEach((diff, index) => {
        unlockInfo += `${tsr.difficulty.levels[diff].name}${index < tsr.difficulty.unlocked.length - 1 ? ', ' : ''}`;
    });
    document.getElementById('difficultyUnlockCondition').innerHTML = unlockInfo;
}

// 检查难度解锁条件（与描述一致：简单3次→普通，普通5次→困难，困难10次→噩梦，噩梦20次→地狱）
function checkDifficultyUnlocks() {
    const tsr = player.timeSecretRealm;
    const levels = tsr.difficulty.levels;
    const unlocked = tsr.difficulty.unlocked;
    const c = tsr.clearCountByDifficulty || { easy: 0, normal: 0, hard: 0, nightmare: 0, hell: 0, abyss: 0, eternal: 0, transcendent: 0, apocalypse: 0, void: 0, omega: 0, singularity: 0 };
    
    if (!unlocked.includes('normal') && c.easy >= 3) {
        unlocked.push('normal');
        logAction('解锁了普通难度！（通关简单难度3次）', 'success');
    }
    if (!unlocked.includes('hard') && c.normal >= 5) {
        unlocked.push('hard');
        logAction('解锁了困难难度！（通关普通难度5次）', 'success');
    }
    if (!unlocked.includes('nightmare') && c.hard >= 10) {
        unlocked.push('nightmare');
        logAction('解锁了噩梦难度！（通关困难难度10次）', 'success');
    }
    if (!unlocked.includes('hell') && c.nightmare >= 20) {
        unlocked.push('hell');
        logAction('解锁了地狱难度！（通关噩梦难度20次）', 'success');
    }
    if (!unlocked.includes('abyss') && c.hell >= 30) {
        unlocked.push('abyss');
        logAction('解锁了深渊难度！（通关地狱难度30次）', 'success');
    }
    if (!unlocked.includes('eternal') && c.abyss >= 25) {
        unlocked.push('eternal');
        logAction('解锁了永恒难度！（通关深渊难度25次）', 'success');
    }
    if (!unlocked.includes('transcendent') && c.eternal >= 30) {
        unlocked.push('transcendent');
        logAction('解锁了超越难度！（通关永恒难度30次）', 'success');
    }
    if (!unlocked.includes('apocalypse') && c.transcendent >= 20) {
        unlocked.push('apocalypse');
        logAction('解锁了终焉难度！（通关超越难度20次）', 'success');
    }
    if (!unlocked.includes('void') && c.apocalypse >= 15) {
        unlocked.push('void');
        logAction('解锁了虚空难度！（通关终焉难度15次）', 'success');
    }
    if (!unlocked.includes('omega') && c.void >= 12) {
        unlocked.push('omega');
        logAction('解锁了Ω序难度！（通关虚空难度12次）', 'success');
    }
    if (!unlocked.includes('singularity') && c.omega >= 10) {
        unlocked.push('singularity');
        logAction('解锁了奇点难度！（通关Ω序难度10次）', 'success');
    }
    
    updateDifficultyUI();
}




// 开始时光秘境冒险
function startTimeSecretRealm() {
    if (player.items.fuben2 < 1) {
        alert("需要至少 1 把秘境钥匙才能进入！");
        return;
    }
    const tsr = player.timeSecretRealm;
    const difficulty = tsr.difficulty.levels[tsr.difficulty.current];
    
    // 检查是否已选择难度
    if (!tsr.difficulty.current) {
        logAction("请先选择难度！", "error");
        return;
    }    
    // 消耗秘境钥匙
    player.items.fuben2--;
    tsr.totalRuns = (tsr.totalRuns || 0) + 1;
    bumpTsrEngagement('dailyRuns', 1);
    bumpTsrQuestProgress('weeklyRuns', 1);
    stopTsrTimer();
    releaseTsrRunHeavyRefs(tsr.currentRun);
    disposeTsrRunUiState();
    clearTsrBattleLog();
    invalidateTsrUiCache();
    showTsrAdventureView();
    
    const adjustedTime = getTsrAdjustedBaseTime(difficulty);
    
    // 初始化当前冒险数据
    tsr.currentRun = {
        isActive: true,
        runId: `${Date.now().toString(36)}_${Math.floor(Math.random() * 1e9).toString(36)}`,
        currentFloor: 1,
        spaceGambleFloor: 0, // 窗口序号：每 TSR_SPACE_GAMBLE_FLOOR_INTERVAL 层为一窗
        spaceGambleUsedThisFloor: 0,
        difficulty: tsr.difficulty.current,
        difficultyMultiplier: difficulty.multiplier,
        rewardMultiplier: difficulty.rewardMultiplier,
        clearFloor: difficulty.clearFloor,
        timeLeft: adjustedTime,
        initialTime: adjustedTime,
        tempBuffs: [],
        relics: [],
        equipped: { weapon: null, armor: null, ring: null, chronos: null },
        equipmentBag: [],
        battleWinStreak: 0,
        voidResonance: 0,
        resonanceBursts: 0,
        floorHistory: [],
        currentRoom: null,
        exploredRooms: 0,
        currencyEarned: 0,
        playerHealth: 0,
        playerAttack: 0,
        consecutiveFloors: 0,
        lastAction: null,
        consumables: [],
        trapWardUsed: false,
        phoenixUsed: false,
        spiritCharge: 0,
        exploreStreak: 0,
        maxBattleStreak: 0,
        restedThisRun: false,
        bankedTime: 0,
        combat: null
    };

    initTsrRunCombat(tsr.currentRun);
    ensureTsrRunEquipment(tsr.currentRun);
    tsr.currentRun.playerHealth = calculateTsrPlayerHealth();
    tsr.currentRun.playerAttack = calculateTsrPlayerAttack();
    addTsrLog(`秘境战阶 攻${formatTsrCombatNum(tsr.currentRun.combat.baseAttack)} / 血${formatTsrCombatNum(tsr.currentRun.combat.baseMaxHp)} / 暴${(tsr.currentRun.combat.baseCritRate * 100).toFixed(0)}%（独立属性，与主世界脱钩）`, 'info');

    applyTsrRunContract();
    applyTsrWeeklyModifier();
    applyTsrStarFortune();
    applyTsrFateCard();
    if (tsr.currentRun.contractMods?.affixRollBoost) {
        tsr.currentRun.affixRollBoost = (tsr.currentRun.affixRollBoost || 0) + tsr.currentRun.contractMods.affixRollBoost;
    }
    const spiritBonuses = getTsrSpiritBonuses();
    if (spiritBonuses.startTime > 0) {
        tsr.currentRun.timeLeft += spiritBonuses.startTime;
        tsr.currentRun.initialTime += spiritBonuses.startTime;
        addTsrLog(`时光精灵伴行：开局+${spiritBonuses.startTime}秒`, 'info');
    }
    if (tsr.permanentBonuses?.riskContract) {
        tsr.currentRun.rewardMultiplier *= 1.2;
        addTempBuff({ name: '冒险契约', effect: 'health', value: -0.08, duration: 0, isDebuff: true });
        addTsrLog('冒险契约生效：奖励+20%，生命上限-8%', 'warning');
    }
    if (tsr.permanentBonuses?.emergencyKit) {
        addTsrConsumable('healPotion');
        addTsrLog('应急医药包已放入背包', 'info');
    }
    if (tsr.permanentBonuses?.starterPack) {
        addTsrConsumable('healPotion');
        addTsrConsumable('timeCapsule');
        addTsrLog('探险补给包已放入背包', 'info');
    }
    if (tsr.permanentBonuses?.starterGear) {
        addTsrEquipment(generateTsrEquipment({ tier: 'common', floor: 1 }), '探险装备包');
    }
    if (tsr.nextRunGuaranteedDisarm) {
        tsr.currentRun.guaranteedDisarm = true;
        tsr.nextRunGuaranteedDisarm = false;
        addTsrLog('万能解除卷已生效，首次解除必定成功', 'info');
    }
    if (tsr.nextRunTimeLoan) {
        tsr.currentRun.timeLeft += 90;
        tsr.currentRun.initialTime += 90;
        tsr.currentRun.timeLoanPenalty = true;
        tsr.nextRunTimeLoan = false;
        addTsrLog('时光借贷生效：额外+90秒，首层战斗难度提升', 'warning');
    }
    if (tsr.nextRunAffixHunter) {
        tsr.currentRun.affixRollBoost = (tsr.currentRun.affixRollBoost || 0) + 0.38;
        tsr.nextRunAffixHunter = false;
        addTsrLog('词条猎网生效：本局怪物词条出现率大幅提升', 'info');
    }
    if (tsr.nextRunConsumables?.length) {
        tsr.nextRunConsumables.forEach(k => addTsrConsumable(k));
        tsr.nextRunConsumables = [];
    }
    
    // 应用起始祝福效果
    applyStartingBuffs();
    
    tsr.currentRun.playerHealth = calculateTsrPlayerHealth();
    tsr.currentRun.playerAttack = calculateTsrPlayerAttack();
    
    // 应用陷阱感知药水（商店购买的“下次冒险生效”）
    if (tsr.nextRunDetectionBoost) {
        tsr.currentRun.detectionBoost = true;
        tsr.currentRun.detectionBoostAmount = tsr.nextRunDetectionBoostAmount || 0.3;
        tsr.nextRunDetectionBoost = false;
        tsr.nextRunDetectionBoostAmount = null;
    }
    
    // 生成第一个房间
    generateNewRoom();
    
    // 开始计时器
    startTsrTimer();
    updateTimeSecretRealmUI();
    updateHealthBar();
    
    addTsrLog(`=== ${difficulty.name}难度冒险开始 ===`);
    addTsrLog(`时间限制: ${tsr.currentRun.timeLeft}秒（按${difficulty.clearFloor}层旅程预算，永久+${tsr.permanentBonuses?.baseTime || 0}秒）`);
    addTsrLog(`怪物强度: ${difficulty.multiplier}x`);
    addTsrLog(`奖励倍数: ${difficulty.rewardMultiplier}x`);
    addTsrLog(`通关要求: ${difficulty.clearFloor}层`);
    addTsrLog(`每5层精英 · 每10层首领 · 每8层神龛 · 梗房/预言/熔合/银行随机出现`);
    if (tsr.selectedContract && tsr.selectedContract !== 'none') {
        addTsrLog(`本局契约：${TSR_RUN_CONTRACTS[tsr.selectedContract].name}`, 'info');
    }
}
// 应用起始祝福效果
function applyStartingBuffs() {
    const tsr = player.timeSecretRealm;
    const startingBuffCount = tsr.permanentBonuses?.startingBuffs || 0;
    
    if (startingBuffCount <= 0) return;
    
    // 可用的起始增益类型
    const availableBuffTypes = ['attack', 'health', 'critRate', 'critDamage', 'speed'];
    
    for (let i = 0; i < startingBuffCount; i++) {
        // 随机选择一个增益类型
        const randomType = availableBuffTypes[Math.floor(Math.random() * availableBuffTypes.length)];
        const buff = getStartingBuffByType(randomType);
        
        if (buff) {
            addTempBuff(buff);
            addTsrLog(`起始祝福生效！获得${buff.name}`, 'success');
        }
    }
}

// 根据类型获取起始增益
function getStartingBuffByType(type) {
    switch(type) {
        case 'attack':
            return {
                name: '起始攻击强化',
                effect: 'attack',
                value: 0.3, // 起始效果稍弱
                timeBonus: 30,
                duration: 0,
                isDebuff: false
            };
        case 'health':
            return {
                name: '起始生命强化',
                effect: 'health',
                value: 0.3,
                timeBonus: 60,
                duration: 0,
                isDebuff: false
            };
        case 'critRate':
            return {
                name: '起始暴击强化',
                effect: 'critRate',
                value: 0.05,
                timeBonus: 90,
                duration: 0,
                isDebuff: false
            };
        case 'critDamage':
            return {
                name: '起始爆伤强化',
                effect: 'critDamage',
                value: 0.3,
                timeBonus: 120,
                duration: 0,
                isDebuff: false
            };
        case 'speed':
            return {
                name: '起始速度强化',
                effect: 'speed',
                value: 5,
                timeBonus: 150,
                duration: 0,
                isDebuff: false
            };
        default:
            return null;
    }
}
// 生成新房间
function generateNewRoom() {
    const tsr = player.timeSecretRealm;
    const difficultyMultiplier = tsr.currentRun.difficultyMultiplier;
    const floor = tsr.currentRun.currentFloor;
    let selectedType = null;
    const spForRoom = ensureTsrSpiritPet();

    if (tsr.nextRunStarSpiritRoom && spForRoom.evolution >= 4
        && floor % TSR_BOSS_FLOOR_INTERVAL !== 0
        && floor % TSR_SHRINE_FLOOR_INTERVAL !== 0
        && floor % TSR_ELITE_FLOOR_INTERVAL !== 0) {
        selectedType = Math.random() < 0.45 ? 'spiritascend' : 'spiritstar';
        tsr.nextRunStarSpiritRoom = false;
        addTsrLog('星域引路符生效：本层为终焉精灵特殊房', 'info');
    } else if (tsr.nextRunThroneBlessing && spForRoom.evolution >= 4 && hasTsrStarSpiritBuild()
        && floor % TSR_BOSS_FLOOR_INTERVAL !== 0
        && floor % TSR_SHRINE_FLOOR_INTERVAL !== 0
        && floor % TSR_ELITE_FLOOR_INTERVAL !== 0) {
        selectedType = 'spiritthrone';
        tsr.nextRunThroneBlessing = false;
        addTsrLog('王座祝福卷生效：本层为星灵王座', 'info');
    } else if (tsr.nextRunTyrantCourt && spForRoom.level >= 38
        && (tsr.lifetimeStats?.throneClears || 0) >= 1
        && floor % TSR_BOSS_FLOOR_INTERVAL !== 0
        && floor % TSR_SHRINE_FLOOR_INTERVAL !== 0
        && floor % TSR_ELITE_FLOOR_INTERVAL !== 0) {
        selectedType = 'tyrantcourt';
        tsr.nextRunTyrantCourt = false;
        addTsrLog('审判引路符生效：本层为天穹审判庭', 'info');
    } else if (tsr.nextRunSpiritTrial && spForRoom.level >= 5
        && floor % TSR_BOSS_FLOOR_INTERVAL !== 0
        && floor % TSR_SHRINE_FLOOR_INTERVAL !== 0
        && floor % TSR_ELITE_FLOOR_INTERVAL !== 0) {
        selectedType = 'spirittrial';
        tsr.nextRunSpiritTrial = false;
        addTsrLog('试炼邀请函生效：本层为精灵试炼厅', 'info');
    } else if (floor % TSR_BOSS_FLOOR_INTERVAL === 0) {
        selectedType = 'boss';
    } else if (floor % TSR_SHRINE_FLOOR_INTERVAL === 0) {
        selectedType = 'shrine';
    } else if (floor % TSR_ELITE_FLOOR_INTERVAL === 0 || tsr.nextFloorElite) {
        selectedType = 'elite';
        if (tsr.nextFloorElite) {
            tsr.nextFloorElite = false;
            addTsrLog('警报陷阱余波：本层出现精英守卫！', 'warning');
        }
    } else {
        const spiritBonus = getTsrPermanentSpiritPactBonus();
        const roll = Math.random();
        // 非战斗房整体压低：优先刷出战斗，强化刺激体验
        if (roll < 0.018 + spiritBonus * 0.35) {
            selectedType = 'relic';
        } else if (roll < 0.036 + spiritBonus * 0.55) {
            selectedType = 'mystery';
        } else if (roll < 0.05 + spiritBonus * 0.35) {
            selectedType = 'vault';
        } else if (roll < 0.062 + spiritBonus * 0.3) {
            selectedType = 'forge';
        } else if (roll < 0.078 + spiritBonus * 0.28) {
            selectedType = 'arena';
        } else if (roll < 0.11 + spiritBonus * 0.45) {
            selectedType = 'portal';
        } else if (roll < 0.11 + spiritBonus * 0.45 + getTsrMemeRoomWeight()) {
            selectedType = pickTsrMemeRoom();
        } else if (roll < 0.11 + spiritBonus * 0.45 + getTsrMemeRoomWeight() + (getTsrSpecialRoomWeight() * (tsr.currentRun.nextSpecialRoomBoost ? 1.8 : 1))) {
            selectedType = pickTsrSpecialRoom();
            if (tsr.currentRun.nextSpecialRoomBoost) tsr.currentRun.nextSpecialRoomBoost = false;
        } else {
        const roomWeights = {
            battle: Math.floor(90 * difficultyMultiplier),
            event: 10,
            treasure: Math.floor(14 / Math.max(1, difficultyMultiplier * 0.85)),
            rest: Math.floor(7 / Math.max(1, difficultyMultiplier * 0.9)),
            shop: Math.floor(4 / Math.max(1, difficultyMultiplier))
        };
        const totalWeight = Object.values(roomWeights).reduce((sum, weight) => sum + weight, 0);
        let randomValue = Math.random() * totalWeight;
        for (const [type, weight] of Object.entries(roomWeights)) {
            randomValue -= weight;
            if (randomValue <= 0) {
                selectedType = type;
                break;
            }
        }
        // 事件房也有概率变遭遇战，避免长时间遇不到怪
        if (selectedType === 'event' && Math.random() < 0.42) {
            selectedType = 'battle';
        }
        }
    }
    
    const meta = getTsrRoomTypeMeta(selectedType);
    let hasTrap = false;
    let trap = null;
    if (selectedType !== 'rest' && selectedType !== 'shrine' && selectedType !== 'portal'
        && selectedType !== 'relic' && selectedType !== 'mystery' && selectedType !== 'vault'
        && selectedType !== 'forge' && selectedType !== 'arena'
        && !TSR_MEME_ROOM_TYPES.includes(selectedType)
        && !TSR_SPECIAL_ROOM_TYPES.includes(selectedType)
    ) {
        let trapChance = 0.3 * difficultyMultiplier;
        const affix = getTsrActiveAffix();
        if (affix?.trapRate) trapChance += affix.trapRate;
        if (Math.random() < trapChance) {
            hasTrap = true;
            trap = generateRandomTrap();
            // 固定值陷阱可随难度加强；百分比/随机百分比陷阱不吃 dm（避免 15%×20 直接爆血）
            if (trap.damageType === 'fixed') {
                trap.damage *= difficultyMultiplier;
            } else if (trap.damageType === 'percentage' || trap.damageType === 'random') {
                const soft = Math.min(1.35, 1 + Math.log2(Math.max(1, difficultyMultiplier)) * 0.07);
                trap.damage *= soft;
            }
        }
    }
    
    tsr.currentRun.currentRoom = {
        type: selectedType,
        name: meta.name,
        explored: false,
        hasTrap: hasTrap,
        trap: trap,
        trapDetected: false,
        trapDisarmed: false,
        isBoss: selectedType === 'boss',
        isElite: selectedType === 'elite',
        isShrine: selectedType === 'shrine',
        rewards: generateRoomRewards(selectedType, difficultyMultiplier)
    };

    if (selectedType === 'battle' || selectedType === 'elite' || selectedType === 'boss') {
        tsr.currentRun.currentRoom.monster = selectedType === 'boss'
            ? pickTsrBossMonster(floor, difficultyMultiplier)
            : pickTsrMonster(selectedType === 'boss', selectedType === 'elite', floor, difficultyMultiplier);
        ensureTsrMonsterAffixes(tsr.currentRun.currentRoom.monster, {
            isBoss: selectedType === 'boss',
            isElite: selectedType === 'elite',
            floor
        });
    }
    
    if (!tsr.currentRun.floorHistory) tsr.currentRun.floorHistory = [];
    tsr.currentRun.floorHistory.push({ floor, type: selectedType });
    tsr.currentRun.floorHistory = trimTsrFloorHistory(tsr.currentRun.floorHistory);
    
    hideTsrRunShopPanel();
    hideTsrChoicePanels();
    if (!tsr.currentRun?.battleInProgress) {
        hideTsrMonsterBanner();
    }
    updateCurrentRoomDisplay();
}

// 生成随机陷阱
function generateRandomTrap() {
    const traps = player.timeSecretRealm.traps.types;
    const totalWeight = Object.values(traps).reduce((sum, trap) => sum + trap.weight, 0);
    let randomValue = Math.random() * totalWeight;
    
    for (const [trapType, config] of Object.entries(traps)) {
        randomValue -= config.weight;
        if (randomValue <= 0) {
            return {
                type: trapType,
                name: config.name,
                damageType: config.damageType,
                damage: config.damage,
                effect: config.effect,
                value: config.value,
                duration: config.duration
            };
        }
    }
    
    // 默认返回毒液陷阱
    return {
        type: 'poison',
        name: '毒液陷阱',
        damageType: 'percentage',
        damage: 0.15,
        duration: 3
    };
}

function updateCurrentRoomDisplay() {
    const room = player.timeSecretRealm.currentRun.currentRoom;
    const container = document.getElementById('tsrCurrentRoom');
    if (!room || !container) return;

    const meta = getTsrRoomTypeMeta(room.type);
    let roomClass = 'tsr-room-card';
    if (room.isBoss) roomClass += ' tsr-room-boss';
    if (room.isShrine) roomClass += ' tsr-room-shrine';
    if (room.isElite) roomClass += ' tsr-room-elite';
    if (room.type === 'portal') roomClass += ' tsr-room-portal';
    if (room.type === 'relic') roomClass += ' tsr-room-relic';
    if (room.type === 'mystery') roomClass += ' tsr-room-mystery';
    if (room.type === 'vault') roomClass += ' tsr-room-vault';
    if (TSR_MEME_ROOM_TYPES.includes(room.type)) roomClass += ' tsr-room-meme';
    if (TSR_SPECIAL_ROOM_TYPES.includes(room.type)) roomClass += ' tsr-room-special';

    let desc = '';
    switch (room.type) {
        case 'battle': desc = '危险怪物盘踞于此，探索后将进入战斗。'; break;
        case 'elite': desc = '精英守卫挡在前方，击败可获得双倍奖励与遗物机会。'; break;
        case 'boss': desc = '强大的秘境首领镇守此层，击败可获得丰厚奖励！'; break;
        case 'event': desc = '神秘力量在空气中流动，可能发生未知事件。'; break;
        case 'treasure': desc = '宝箱散发着金色光芒，等待被开启。'; break;
        case 'rest': desc = '宁静的休息点，可恢复生命。'; break;
        case 'shop': desc = '神秘商人提供临时强化，消耗本次冒险获得的秘境币。'; break;
        case 'shrine': desc = '古老神龛散发祝福之光，赐予随机恩赐。'; break;
        case 'portal': desc = '两条道路在时光中分叉，探索后需做出抉择。'; break;
        case 'relic': desc = '祭坛上浮现三件遗物虚影，择一带走。'; break;
        case 'mystery': desc = '谜题祭坛提出三重考验，抉择将改变命运。'; break;
        case 'vault': desc = '时之宝库封存着时间与财富，可进行交易。'; break;
        case 'forge': desc = '熔炉烈焰升腾，可淬火、重铸、灌注、铸装或熔炼装备。'; break;
        case 'arena': desc = '竞技场中观众欢呼，挑战者等待着你。'; break;
        case 'ppt': desc = '导师灵魂发问：「这页PPT能再改一版吗？」探索后进入答辩环节。'; break;
        case 'client': desc = '甲方微笑：「就改一点点。」——著名的危险信号。'; break;
        case 'pdd': desc = '神秘精灵承诺：再砍一刀，大奖带回家。进度可能清零。'; break;
        case 'recall': desc = '三条「对方撤回了一条消息」悬浮在空中，内容不可见。'; break;
        case 'kpi': desc = 'HR幽灵宣读本层KPI，达标、糊弄、甩锅，三选一。'; break;
        case 'duanzi': desc = '段子手正在开讲，听完大概会笑，也可能挨刀。'; break;
        case 'echo': desc = '走廊重复你上一层的遭遇，但这次台词有点不对劲。'; break;
        case 'weekly': desc = '评审委员会已就座：「本周数据很好看，但不够好看。」'; break;
        case 'blinddate': desc = '相亲角大妈热情招呼：「小伙子条件不错，见见？」'; break;
        case 'overtime996': desc = '神殿牌匾写着：「奋斗者圣地」，门口打卡机已就绪。'; break;
        case 'lottery': desc = '体彩窗口阿姨：「小伙子，买一注梦想？」'; break;
        case 'standup': desc = '开放麦主持：「有请下一位受害者——不对，表演者。」'; break;
        case 'oracle': desc = '预言台迷雾涌动，可窥见未来两层房间的虚影。'; break;
        case 'fusion': desc = '熔合台嗡嗡作响，可献祭道具或生命换取遗物机会。'; break;
        case 'timebank': desc = '时光银行：存时间生利息，或透支未来换当下。'; break;
        case 'spiritgarden': desc = '精灵花园花香弥漫，可与时光精灵互动获得养成收益。'; break;
        case 'spiritsanctuary': desc = '精灵圣殿圣光笼罩，可感悟灵脉或接受祝福。'; break;
        case 'spirittrial': desc = '试炼官等候多时：证明你与精灵的羁绊！'; break;
        case 'storm': desc = '乱流撕裂空间，什么都可能发生——包括倒霉。'; break;
        case 'gacha': desc = '一台闪着霓虹灯的抽卡机：「SSR概率UP（大概）」'; break;
        case 'escape': desc = '上锁的密室，墙上写着三道谜题，答对可能有宝藏。'; break;
        case 'auction': desc = '秘境拍卖行，价高者得——或者价低者被坑。'; break;
        case 'monsterhunt': desc = '布告栏上悬赏着凶名在外的怪物，接受挑战？'; break;
        case 'roulette': desc = '命运轮盘缓缓转动，指针停在哪儿看命。'; break;
        case 'vending': desc = '自动售货机亮着诡异的蓝光，商品会自己跳出来。'; break;
        case 'phantom': desc = '迷雾中的幻境迷宫，真实与虚妄难以分辨。'; break;
        case 'shrineduel': desc = '古老神龛化为决斗场，胜者将获得祝福。'; break;
        case 'beastlair': desc = '巢穴深处传来低吼，高阶异兽盘踞其中。'; break;
        case 'gamblersden': desc = '赌坊老板搓着手：「今天手气怎么样？」'; break;
        case 'spiritwell': desc = '灵泉涌动，精灵的力量在此汇聚，可洗涤灵脉。'; break;
        case 'spiritrift': desc = '裂谷中灵力乱流，精灵提议与你协同作战。'; break;
        case 'spiritmemory': desc = '记忆碎片悬浮空中，触碰将唤醒过往羁绊。'; break;
        case 'spiritbazaar': desc = '灵脉商人兜售奇物，可用羁绊或充能换取资源。'; break;
        case 'spiritboss': desc = '灵域霸主坐镇王座，唯有高阶羁绊者敢挑战。'; break;
        case 'spiritoracle': desc = '精灵神谕低语未来，可窥见深层房间与命运分支。'; break;
        case 'spiritforge': desc = '灵锻炉火光跳动，可淬炼灵脉技能或临时战意。'; break;
        case 'spiritarena': desc = '精灵竞技场观众欢呼，可单挑精英或训练提升。'; break;
        case 'spiritnexus': desc = '灵枢节点三条支流交汇，择一汲取强大力量。'; break;
        case 'spiritcodex': desc = '图鉴殿封存秘境认知，可扫描未来或研习残页。'; break;
        case 'spiritascend': desc = '星门洞开，永恒神使可在此试炼帝皇、觉醒终焉星灵。'; break;
        case 'spiritstar': desc = '终焉星灵专属星域，可巡游、统御或沐浴星瀑。'; break;
        case 'spiritthrone': desc = '星灵王座镇守星域主宰，终焉星灵可挑战三连战或献礼。'; break;
        case 'starfall': desc = '流星坠落祭坛，终焉星灵可祈福、淬炼星幕或召唤星尘战。'; break;
        case 'spiritduel': desc = '精灵镜像与你对峙，可决斗、观摩或认输。'; break;
        case 'celestialvault': desc = '天穹三重星锁封存宝藏，解封越深奖励越高。'; break;
        case 'timewarp': desc = '时光在此打结，可跃层、回溯或锚定时间。'; break;
        case 'retrospective': desc = '复盘会议室里，甩锅与行动项齐飞。'; break;
        case 'interview': desc = '秘境HR面试间，选对你的冒险人设。'; break;
        case 'perfreview': desc = '主管微笑：「我们聊聊本季度的产出与成长。」'; break;
        case 'teamBuilding': desc = '团建密室挂着横幅：「凝聚力量，共创辉煌。」'; break;
        case 'tyrantcourt': desc = '天穹审判庭高悬星冕，可接受裁决、陈词或退庭。'; break;
        case 'spiritparade': desc = '星灵巡礼队伍经过，可加入巡游、燃放花火或应战。'; break;
        case 'voidrift': desc = '虚空裂隙吞噬光线，深潜、锚定或投放信标，各有利弊。'; break;
        case 'affixforge': desc = '熔炉可剥离、净化、重铸或铸造守关者的怪物词条。'; break;
        case 'affixhunt': desc = '狩猎布告专猎双词条精英，赏金更丰厚。'; break;
        case 'relicaltar': desc = '献祭遗物换取神恩，或祈福获得增益。'; break;
        case 'bondsanctuary': desc = '羁绊圣所可深化精灵亲密度与灵息。'; break;
        case 'championhall': desc = '冠军殿堂三连战，击败历届冠军残影。'; break;
        case 'synergyshrine': desc = '契约羁绊神殿，可放大双契约组合加成。'; break;
        case 'layoff': desc = 'HR微笑递来纸箱：「感谢你的贡献。」'; break;
        case 'okrreview': desc = 'OKR复盘：「你的O完成了吗？KR呢？」'; break;
        case 'fortunewheel': desc = '七色轮盘飞转，每一格都封印着不同的命运馈赠。'; break;
        case 'legendarchive': desc = '传奇卷轴悬浮陈列，可研读、铭刻或共鸣。'; break;
        case 'chronolibrary': desc = '悬浮书页记载历代冒险者的时间秘闻，可研读、抄录或借阅。'; break;
        case 'starwishpool': desc = '星辉池水映出愿望倒影，投币许愿或沐浴星辉。'; break;
        case 'mirrormaze': desc = '镜面走廊复制你的每一个选择，真路还是死路？'; break;
        case 'runescriptorium': desc = '符文师等候多时：铭刻、拓印或重铸层间词缀。'; break;
        case 'timeloom': desc = '时光织机嗡嗡作响，可织入额外秒数或剪断冗余耗时。'; break;
        case 'combostorm': desc = '连击风暴在头顶盘旋，可放大下几场战斗的连击收益。'; break;
        case 'battlerift': desc = '裂隙中浮现三位守关幻影，择一决斗以夺取赏金。'; break;
        case 'wararchive': desc = '古卷记载历代战策，可研习战术并应用于后续战斗。'; break;
        case 'bloodarena': desc = '血战竞技场每回合消耗生命，但胜利回报翻倍。'; break;
        case 'meetingmarathon': desc = '会议室门被焊死：「今天议程还有十七项。」'; break;
        case 'slackoutage': desc = '全员消息已读不回，系统显示：连接中断。'; break;
        case 'hotfix911': desc = '生产环境报警红灯闪烁：「先上线，文档后补。」'; break;
        case 'pitchdeck': desc = '投资人敲桌：「你们的护城河在哪里？」'; break;
        case 'codereview': desc = 'Reviewer已就位：「整体不错，但这里需要重构。」'; break;
        case 'standup996': desc = '加班专场的开放麦，讲段子或哭诉都能换点东西。'; break;
        default: desc = '未知房间';
    }

    let roomContent = `
        <div class="${roomClass}">
            <div class="tsr-room-title" style="color:${meta.color};">${meta.icon} ${room.name}</div>
            <div class="tsr-room-desc">${desc}</div>
    `;

    if (room.monster && (room.type === 'battle' || room.type === 'elite' || room.type === 'boss' || room.isElite || room.isBoss)) {
        ensureTsrMonsterAffixes(room.monster, { isBoss: room.isBoss, isElite: room.isElite, floor: player.timeSecretRealm.currentRun.currentFloor });
        const tierMeta = getTsrMonsterTierMeta(room.monster.tier);
        roomContent += `
            <div class="tsr-monster-preview">
                <span class="tsr-monster-preview-label">守关者</span>
                ${formatTsrMonsterNameHtml(room.monster)}
                ${formatTsrMonsterAffixHtml(room.monster)}
                <span class="tsr-monster-tier-badge ${tierMeta.cssClass}">${tierMeta.label}</span>
            </div>`;
    }

    if (isTsrTrapBlocking(room)) {
        if (room.trapDetected) {
            roomContent += `
                <div class="tsr-trap-hint tsr-trap-detected">
                    <div style="font-weight:bold;">发现陷阱: ${room.trap.name}</div>
                    <div>${getTrapDescription(room.trap)}</div>
                    <div style="margin-top:6px;opacity:.85;">请点「解除」；失败只会触发一次</div>
                </div>`;
        } else {
            roomContent += `<div class="tsr-trap-hint tsr-trap-unknown">这个房间可能有陷阱…可先「侦查」，或直接「强行探索」（会触发陷阱）</div>`;
        }
    } else if (room.hasTrap && room.trapTriggered) {
        roomContent += `<div class="tsr-trap-hint tsr-trap-unknown">陷阱已触发并失效</div>`;
    }

    if (room.type === 'shop') {
        roomContent += `<div class="tsr-room-reward" style="color:${meta.color};">探索后可购买临时强化</div>`;
    } else if (room.rewards.currency > 0) {
        const previewCur = Math.max(0, Math.floor(room.rewards.currency * TSR_RUN_CURRENCY_GAIN_SCALE));
        roomContent += `<div class="tsr-room-reward" style="color:${meta.color};">预计奖励: ${previewCur}秘境币</div>`;
    }
    if (room.explored) {
        roomContent += `<div class="tsr-room-reward" style="color:#888;">已探索</div>`;
    }
    roomContent += `</div>`;
    container.innerHTML = roomContent;
    updateActionButtons();
}
// 获取陷阱描述
function getTrapDescription(trap) {
    switch(trap.damageType) {
        case 'percentage':
            return `造成${(trap.damage * 100)}%生命值的伤害，持续${trap.duration}回合`;
        case 'fixed':
            return `造成${formatSci(trap.damage)}点固定伤害`;
        case 'debuff':
            return `${trap.effect === 'attack' ? '攻击力' : '暴击率'}降低${(trap.value * 100)}%，持续${trap.duration}回合`;
        case 'time':
            return `减少${trap.damage}秒探索时间`;
        case 'currency':
            return `吸取${(trap.damage * 100)}%已获秘境币`;
        case 'random':
            return `随机造成${(trap.damage * 100)}%生命值的伤害`;
        default:
            return '未知效果的陷阱';
    }
}
function isTsrCombatRoom(room) {
    if (!room) return false;
    return room.type === 'battle' || room.type === 'elite' || room.type === 'boss'
        || !!room.isBoss || !!room.isElite || !!room.monster
        || !!room.isSpiritTrial || !!room.isSpiritAscendTrial || !!room.isSpiritBoss
        || !!room.isStarBoss || !!room.isBloodArena || !!room.isSpiritDuel;
}

function isTsrChoicePanelPending() {
    const ids = ['tsrPortalPanel', 'tsrRelicPickPanel', 'tsrMysteryPanel', 'tsrVaultPanel', 'tsrForgePanel', 'tsrMemePanel', 'tsrBattleTacticPanel'];
    return ids.some(id => {
        const el = document.getElementById(id);
        return el && el.style.display === 'block';
    });
}

function canTsrAdvanceFloor(opts) {
    opts = opts || {};
    const silent = !!opts.silent;
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    if (!run?.isActive) return false;
    if (run.battleInProgress) {
        if (!silent) addTsrLog('战斗演出中，请稍候再进入下一层', 'warning');
        return false;
    }
    if (run.pendingInteractiveEvent || run.pendingEncounter) {
        if (!silent) addTsrLog('请先完成当前抉择再进入下一层', 'warning');
        return false;
    }
    if (isTsrChoicePanelPending()) {
        if (!silent) addTsrLog('请先完成当前抉择再进入下一层', 'warning');
        return false;
    }
    const room = run.currentRoom;
    if (!room) return true;
    if (!room.explored) {
        if (!silent) addTsrLog('必须先探索当前房间才能进入下一层', 'warning');
        return false;
    }
    if (isTsrCombatRoom(room) && !room.battleCleared) {
        if (!silent) addTsrLog('必须先完成当前战斗才能进入下一层', 'warning');
        return false;
    }
    return true;
}

function isTsrTrapBlocking(room) {
    return !!(room?.hasTrap && !room.trapDisarmed);
}

function resolveTsrRoomTrap(room, triggered) {
    if (!room) return;
    room.trapDisarmed = true;
    if (triggered) room.trapTriggered = true;
}

function updateActionButtons() {
    if (window._tsrUpdatingActionButtons) return;
    window._tsrUpdatingActionButtons = true;
    try {
        updateActionButtonsInner();
    } finally {
        window._tsrUpdatingActionButtons = false;
    }
}

function updateActionButtonsInner() {
    const room = player.timeSecretRealm.currentRun.currentRoom;
    const run = player.timeSecretRealm.currentRun;
    const exploreBtn = document.getElementById('tsrExploreBtn');
    const detectBtn = document.getElementById('tsrDetectBtn');
    const disarmBtn = document.getElementById('tsrDisarmBtn');
    const nextBtn = document.getElementById('tsrNextFloorBtn');
    if (!exploreBtn || !detectBtn || !disarmBtn) return;
    if (typeof resyncTsrPendingChoicePanel === 'function') resyncTsrPendingChoicePanel();

    const trapBlocking = isTsrTrapBlocking(room);
    if (trapBlocking) {
        if (room.trapDetected) {
            // 已发现：优先解除；不可再用探索硬闯（避免解除失败后又点探索连环炸）
            exploreBtn.style.display = 'none';
            detectBtn.style.display = 'none';
            disarmBtn.style.display = 'inline-block';
            disarmBtn.textContent = '解除';
            disarmBtn.title = '尝试安全解除陷阱';
        } else {
            // 未发现：可侦查，也可强行探索（会触发陷阱，但只触发一次）
            exploreBtn.style.display = 'inline-block';
            exploreBtn.textContent = '强行探索';
            exploreBtn.title = '不侦查直接进入，会触发陷阱';
            detectBtn.style.display = 'inline-block';
            detectBtn.textContent = '侦查';
            disarmBtn.style.display = 'none';
        }
    } else {
        exploreBtn.style.display = 'inline-block';
        exploreBtn.textContent = '探索';
        exploreBtn.title = '';
        detectBtn.style.display = 'none';
        disarmBtn.style.display = 'none';
    }
    if (room && room.explored) {
        exploreBtn.disabled = true;
        exploreBtn.style.opacity = '0.5';
        exploreBtn.textContent = '探索';
    } else {
        exploreBtn.disabled = false;
        exploreBtn.style.opacity = '1';
    }
    if (run?.battleInProgress) {
        exploreBtn.disabled = true;
        detectBtn.disabled = true;
        disarmBtn.disabled = true;
    } else {
        detectBtn.disabled = false;
        disarmBtn.disabled = false;
    }
    const choicePending = isTsrChoicePanelPending();
    if (choicePending || run?.battleInProgress) {
        exploreBtn.disabled = true;
    }
    const exitBtn = document.getElementById('tsrExitBtn');
    if (exitBtn) {
        const exitLocked = choicePending || !!run?.battleInProgress || !!run?._resolvingBattle
            || !!run?._choiceResolving || !!run?._finishingMeme || !!run?._interactiveResolving
            || !!(room?._tsrTacticPicking || run?._tsrTacticPicking)
            || !!(window._tsrExitClickGuardUntil && Date.now() < window._tsrExitClickGuardUntil);
        // 不在锁定期内强行解开（避免 UI 刷新盖掉 exit guard）
        if (exitLocked) {
            exitBtn.disabled = true;
            exitBtn.classList.add('tsr-disabled-feel');
        } else if (!window._tsrExitClickGuardUntil || Date.now() >= window._tsrExitClickGuardUntil) {
            exitBtn.disabled = false;
            exitBtn.classList.remove('tsr-disabled-feel');
        }
    }
    if (nextBtn) {
        nextBtn.disabled = !canTsrAdvanceFloor({ silent: true });
        nextBtn.classList.toggle('tsr-btn-pulse', !nextBtn.disabled && !!room?.explored && !run?.battleInProgress);
    }
    const gambleBtn = document.getElementById('tsrGambleBtn');
    if (gambleBtn && run?.isActive) {
        const gLeft = typeof getTsrSpaceGambleLeftThisFloor === 'function' ? getTsrSpaceGambleLeftThisFloor() : 0;
        const gBusy = !!run.battleInProgress || !!choicePending;
        const range = typeof getTsrSpaceGambleWindowRange === 'function'
            ? getTsrSpaceGambleWindowRange(run.currentFloor || 1)
            : null;
        gambleBtn.disabled = gBusy || gLeft <= 0;
        gambleBtn.classList.toggle('tsr-disabled-feel', gambleBtn.disabled);
        gambleBtn.textContent = gLeft > 0 ? '时空赌局(可)' : '时空赌局(冷却)';
        gambleBtn.title = gLeft > 0
            ? `第${range?.start || '?'}-${range?.end || '?'}层窗口可赌1次（全随机）`
            : `每${TSR_SPACE_GAMBLE_FLOOR_INTERVAL}层仅1次，第${range ? range.end + 1 : '?'}层起刷新`;
    }
    // 演出中仅快捷栏可用，侧栏道具/底栏呼唤锁定
    document.querySelectorAll('#tsrCurrentConsumables .tsr-consumable-item').forEach(btn => {
        btn.disabled = !!run?.battleInProgress;
        btn.classList.toggle('tsr-disabled-feel', !!run?.battleInProgress);
    });
    const invokeBtn = document.getElementById('tsrInvokeSpiritBtn');
    if (invokeBtn) {
        if (run?.battleInProgress) {
            invokeBtn.disabled = true;
            invokeBtn.title = '战斗演绎中，请用战区「战后补给」';
        }
    }
}
// 更新技能效果显示
function updateSkillsDisplay() {
    const tsr = player.timeSecretRealm;
    const container = document.getElementById('tsrCurrentSkills');
    if (!container) return;
    const sig = getTsrSkillSignature();
    if (_tsrUiCache.skill === sig) return;
    _tsrUiCache.skill = sig;

    const detectionSkill = tsr.traps.detectionSkills[tsr.traps.playerSkills.detection];
    const disarmSkill = tsr.traps.disarmSkills[tsr.traps.playerSkills.disarm];
    let html = `
        <div class="tsr-skill-item">
            <div style="font-weight:bold;color:#00bfff;margin-bottom:5px;">${detectionSkill.name}</div>
            <div style="font-size:12px;color:#00bfff;">成功率: ${(getTsrDetectionSuccessRate() * 100).toFixed(0)}%</div>
            <div style="font-size:11px;color:#d8bfd8;">消耗: ${detectionSkill.cost}秒</div>
        </div>
        <div class="tsr-skill-item">
            <div style="font-weight:bold;color:#32cd32;margin-bottom:5px;">${disarmSkill.name}</div>
            <div style="font-size:12px;color:#32cd32;">成功率: ${(disarmSkill.successRate * 100).toFixed(0)}%</div>
            <div style="font-size:11px;color:#d8bfd8;">消耗: ${disarmSkill.cost}秒</div>
        </div>`;
    if (tsr.currentRun?.detectionBoost) {
        const boostAmt = tsr.currentRun.detectionBoostAmount || 0.3;
        const boostLabel = boostAmt >= 0.5 ? '敏锐灵药' : '陷阱感知药水';
        html += `<div class="tsr-skill-boost" style="background:rgba(255,215,0,0.2);padding:10px;border-radius:5px;border:1px solid #ffd700;margin-top:8px;">
            <div style="font-weight:bold;color:#ffd700;margin-bottom:5px;">${boostLabel}</div>
            <div style="font-size:12px;color:#ffd700;">侦查成功率 +${(boostAmt * 100).toFixed(0)}%</div>
            <div style="font-size:11px;color:#d8bfd8;">本次冒险有效</div>
        </div>`;
    }
    container.innerHTML = html;
}
// 在每次行动后更新增益持续时间
function updateBuffDurations() {
    const tsr = player.timeSecretRealm;
    
    // 更新增益持续时间
    tsr.currentRun.tempBuffs = tsr.currentRun.tempBuffs.filter(buff => {
        if (buff.duration) {
            buff.duration--;
            return buff.duration > 0;
        }
        return true;
    });
    invalidateTsrUiCache('buff');
}
// 在探索房间、战斗等行动后调用
function afterAction(light) {
    updateBuffDurations();
    updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: !!light });
}
// 侦查陷阱
function tsrDetectTrap() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    
    if (!room || !isTsrTrapBlocking(room) || room.trapDetected || room.explored) return;
    
    const skill = tsr.traps.detectionSkills[tsr.traps.playerSkills.detection];
    const successRate = getTsrDetectionSuccessRate();
    const success = Math.random() < successRate;
    
    tsr.currentRun.timeLeft -= Math.floor(skill.cost * getTsrTimeCostMultiplier());
    room.trapDetectAttempts = (room.trapDetectAttempts || 0) + 1;
    
    if (success) {
        room.trapDetected = true;
        addTsrLog(`侦查成功！发现了${room.trap.name}`, 'success');
    } else {
        addTsrLog(`侦查失败！没有发现陷阱（可再侦查，或点「强行探索」硬闯）`, 'warning');
        // 连续侦查失败过多次后提升成功率，避免空耗时间
        if (room.trapDetectAttempts >= 3 && Math.random() < 0.35) {
            room.trapDetected = true;
            addTsrLog(`多次摸索后仍发现了异常：${room.trap.name}`, 'info');
        }
    }
    
    updateCurrentRoomDisplay();
    
    // 检查时间是否用完
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
    }
}

// 解除陷阱
function tsrDisarmTrap() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    
    if (!room || !isTsrTrapBlocking(room) || !room.trapDetected) return;
    
    const skill = tsr.traps.disarmSkills[tsr.traps.playerSkills.disarm];
    let success = tsr.currentRun.guaranteedDisarm || Math.random() < skill.successRate;
    if (tsr.currentRun.guaranteedDisarm) {
        tsr.currentRun.guaranteedDisarm = false;
        addTsrLog('万能解除卷生效，首次解除必定成功！', 'success');
    }
    
    tsr.currentRun.timeLeft -= Math.floor(skill.cost * getTsrTimeCostMultiplier());
    
    if (success) {
        resolveTsrRoomTrap(room, false);
        addTsrLog(`解除成功！安全解除了${room.trap.name}`, 'success');
        
        // 解除陷阱奖励
        const reward = 200 + Math.floor(Math.random() * 30);
        const gained = addTsrRunCurrency(reward);
        addTsrLog(`获得${gained}秘境币作为解除陷阱的奖励`);
    } else {
        // 解除失败：引爆一次后立即结案，禁止反复点解除/探索连环炸
        addTsrLog(`解除失败！触发了${room.trap.name}`, 'error');
        triggerTrap(room.trap);
        resolveTsrRoomTrap(room, true);
        addTsrLog('陷阱已触发并失效，可以继续探索房间', 'info');
    }
    
    updateCurrentRoomDisplay();
    
    // 检查时间是否用完
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
    }
}

// 触发陷阱效果
function triggerTrap(trap) {
    const tsr = player.timeSecretRealm;
    if (tsr.currentRun.trapBarrier) {
        tsr.currentRun.trapBarrier = false;
        addTsrLog('避陷符咒触发！完全抵消了陷阱', 'success');
        return;
    }
    let damageMult = 1;
    damageMult = Math.max(0.3, damageMult - getTsrRelicBonus('trapReduce'));
    if (!tsr.currentRun.trapWardUsed && tsr.permanentBonuses?.trapWard) {
        tsr.currentRun.trapWardUsed = true;
        damageMult = 0.5;
        addTsrLog('避陷护符触发！陷阱效果减半', 'success');
    }
    
    switch(trap.damageType) {
        case 'percentage':
            const percentageDamage = bMul(tsr.currentRun.playerHealth, trap.damage * damageMult);
            applyDamage(percentageDamage);
            addTsrLog(`受到${formatSci(percentageDamage)}点伤害（${trap.damage * 100}%生命值）`, 'error');
            break;
            
        case 'fixed':
            applyDamage(bMul(trap.damage, damageMult));
            addTsrLog(`受到${formatSci(bMul(trap.damage, damageMult))}点固定伤害`, 'error');
            break;
            
        case 'debuff':
            // 添加减益效果
            const debuff = {
                name: trap.name + '减益',
                effect: trap.effect,
                value: trap.value,
                duration: trap.duration,
                isDebuff: true
            };
            addTempBuff(debuff);
            addTsrLog(`${trap.effect === 'attack' ? '攻击力' : '暴击率'}降低${trap.value * 100}%，持续${trap.duration}回合`, 'warning');
            break;
            
        case 'time':
            const timeLoss = Math.floor(trap.damage * damageMult);
            tsr.currentRun.timeLeft -= timeLoss;
            addTsrLog(`时间减少${timeLoss}秒`, 'warning');
            break;

        case 'currency': {
            const loss = Math.floor(tsr.currentRun.currencyEarned * trap.damage * damageMult);
            tsr.currentRun.currencyEarned = Math.max(0, tsr.currentRun.currencyEarned - loss);
            addTsrLog(`被吸走${loss}秘境币`, 'warning');
            break;
        }
            
        case 'random':
            const randomDamage = bMul(tsr.currentRun.playerHealth, Math.random() * trap.damage * damageMult);
            applyDamage(randomDamage);
            addTsrLog(`受到${formatSci(randomDamage)}点随机伤害`, 'error');
            break;
    }
    if (trap.type === 'alarm') {
        tsr.currentRun.nextFloorElite = true;
        addTsrLog('警报陷阱触发！下一层将遭遇精英守卫', 'warning');
    }
    
    // 检查时间是否用完
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
    }
}
// 更新血条显示
function updateHealthBar() {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun || !tsr.currentRun.isActive) return;
    
    const maxHealth = calculateTsrPlayerHealth();
    const currentHealth = tsr.currentRun.playerHealth;
    const healthPercentage = getTsrHealthPercent(currentHealth, maxHealth);
    
    // 更新血条
    const healthBar = document.getElementById('tsrHealthBarFill');
    const healthText = document.getElementById('tsrHealthText');
    const healthWarning = document.getElementById('tsrHealthWarning');
    
    if (healthBar && healthText) {
        healthBar.style.width = `${healthPercentage}%`;
        const atk = formatTsrCombatNum(calculateTsrPlayerAttack());
        healthText.textContent = `${healthPercentage.toFixed(1)}% (${formatTsrCombatNum(currentHealth)}/${formatTsrCombatNum(maxHealth)}) · 攻${atk}`;
        
        // 警告显示
        if (healthPercentage <= 30) {
            healthWarning.style.display = 'inline';
            healthBar.style.background = 'linear-gradient(to right, #ff4500, #8b0000)';
        } else if (healthPercentage <= 50) {
            healthWarning.style.display = 'none';
            healthBar.style.background = 'linear-gradient(to right, #ffa500, #ff4500)';
        } else {
            healthWarning.style.display = 'none';
            healthBar.style.background = 'linear-gradient(to right, #32cd32, #ffa500)';
        }
    }
    updateTsrCombatBar();
}

// 检查生命值是否低于失败阈值（1%）
// 仅用于探索/赶层等局外行动；战斗结算中不走此阈值（避免一点战术就「力竭倒下」）
function checkHealthFailure() {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun || !tsr.currentRun.isActive) return false;
    if (tsr.currentRun._resolvingBattle || tsr.currentRun.battleInProgress) return false;
    
    const maxHealth = calculateTsrPlayerHealth();
    const currentHealth = tsr.currentRun.playerHealth;
    const healthPercentage = getTsrHealthPercent(currentHealth, maxHealth);
    
    if (healthPercentage < 1) {
        if (!tsr.currentRun.phoenixUsed && hasTsrRelic('phoenix')) {
            tsr.currentRun.phoenixUsed = true;
            tsr.currentRun.playerHealth = bMul(maxHealth, 0.3);
            addTsrLog('涅槃之羽触发！以30%生命继续持有', 'success');
            updateHealthBar();
            return false;
        }
        endTimeSecretRealm('生命值过低');
        return true;
    }
    
    return false;
}
function applyDamage(damage) {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun?.isActive) return;
    if (damage == null || damage === '') return;
    
    tsr.currentRun.playerHealth = bSub(tsr.currentRun.playerHealth, damage);
    updateHealthBar();
    
    // 战斗扣血只判归零；1%「力竭」阈值改由探索/赶层等行动显式检查
    if (bLteZero(tsr.currentRun.playerHealth)) {
        if (!tsr.currentRun.phoenixUsed && typeof hasTsrRelic === 'function' && hasTsrRelic('phoenix')) {
            tsr.currentRun.phoenixUsed = true;
            tsr.currentRun.playerHealth = bMul(calculateTsrPlayerHealth(), 0.3);
            addTsrLog('涅槃之羽触发！以30%生命继续持有', 'success');
            updateHealthBar();
            return;
        }
        const inBattle = !!(tsr.currentRun._resolvingBattle || tsr.currentRun.battleInProgress);
        endTimeSecretRealm(inBattle ? '战斗失败' : '生命值过低');
    }
}
// 探索房间
function tsrExploreRoom() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    const difficultyMultiplier = tsr.currentRun.difficultyMultiplier;
    
    if (!room || room.explored) return;
    
    // 检查生命值是否过低
    if (checkHealthFailure()) {
        return;
    }
    
    room.explored = true;
    if (['battle', 'elite', 'boss'].includes(room.type) || room.isBoss || room.isElite) {
        room.battleCleared = false;
    } else {
        room.battleCleared = true;
    }
    recordTsrCodex(room.type);
    bumpTsrQuestProgress('runExplore', 1);
    if (TSR_MEME_ROOM_TYPES.includes(room.type)) {
        bumpTsrQuestProgress('runMeme', 1);
        bumpTsrQuestProgress('weeklyMeme', 1);
    }
    tsr.currentRun.exploredRooms++;
    tsr.currentRun.exploreStreak = (tsr.currentRun.exploreStreak || 0) + 1;
    if (tsr.currentRun.exploreStreak % 3 === 0) {
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        const streakGain = addTsrRunCurrency(Math.floor(28 * dm));
        addTsrLog(`探索连击×${tsr.currentRun.exploreStreak}！额外+${streakGain}秘境币`, 'success');
    }
    tsr.currentRun.lastAction = 'explore';
    tsr.currentRun.consecutiveFloors = 0; // 重置连续层数
    
    const timeCost = Math.max(5, Math.floor(
        8 * getTsrActionDifficultyScale(difficultyMultiplier) * getTsrTimeCostMultiplier()
    ));
    tsr.currentRun.timeLeft -= timeCost;
    
    // 如果有未处理的陷阱，触发一次后结案（避免反复交互连环炸）
    if (isTsrTrapBlocking(room)) {
        addTsrLog(`触发了${room.trap.name}！`, 'error');
        triggerTrap(room.trap);
        resolveTsrRoomTrap(room, true);
        
        if (bLteZero(tsr.currentRun.playerHealth) || tsr.currentRun.timeLeft <= 0) {
            return;
        }
    }
    
    // 处理房间事件
    switch(room.type) {
        case 'battle':
        case 'boss':
        case 'elite':
            if ((room.type === 'boss' || room.type === 'elite' || room.isBoss || room.isElite) && !room.battleTacticChosen && !room.isSpiritTrial && !(tsr.currentRun.warArchiveBattlesLeft > 0)) {
                showTsrBattleTacticPanel(room);
                updateTimeSecretRealmUI();
                return;
            }
            handleBattleRoom();
            break;
        case 'event':
            handleEventRoom();
            if (tsr.currentRun.pendingInteractiveEvent) {
                updateTimeSecretRealmUI();
                return;
            }
            break;
        case 'treasure':
            handleTreasureRoom();
            break;
        case 'rest':
            handleRestRoom();
            break;
        case 'shop':
            handleShopRoom();
            break;
        case 'shrine':
            handleShrineRoom();
            break;
        case 'portal':
            handlePortalRoom();
            if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
            updateTimeSecretRealmUI();
            return;
        case 'relic':
            handleRelicRoom();
            if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
            updateTimeSecretRealmUI();
            return;
        case 'mystery':
            handleMysteryRoom();
            if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
            updateTimeSecretRealmUI();
            return;
        case 'vault':
            handleVaultRoom();
            if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
            updateTimeSecretRealmUI();
            return;
        case 'forge':
            handleForgeRoom();
            if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
            updateTimeSecretRealmUI();
            return;
        case 'arena':
            handleArenaRoom();
            if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
            return;
        case 'ppt':
        case 'client':
        case 'pdd':
        case 'recall':
        case 'kpi':
        case 'weekly':
        case 'blinddate':
        case 'overtime996':
        case 'lottery':
        case 'standup':
            handleTsrMemeRoom(room.type);
            if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
            updateTimeSecretRealmUI();
            return;
        case 'oracle':
        case 'fusion':
        case 'timebank':
        case 'spiritgarden':
        case 'spiritsanctuary':
        case 'spirittrial':
            handleTsrSpecialRoom(room.type);
            if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
            updateTimeSecretRealmUI();
            return;
        case 'storm':
            handleStormRoom();
            break;
        case 'duanzi':
            handleDuanziRoom();
            break;
        case 'echo':
            handleEchoRoom();
            break;
        case 'gacha':
        case 'escape':
        case 'auction':
            handleTsrMemeRoom(room.type);
            if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
            updateTimeSecretRealmUI();
            return;
        case 'monsterhunt':
        case 'roulette':
        case 'vending':
        case 'phantom':
        case 'shrineduel':
        case 'beastlair':
        case 'spiritwell':
        case 'spiritrift':
        case 'spiritmemory':
            handleTsrSpecialRoom(room.type);
            if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
            updateTimeSecretRealmUI();
            return;
    }
    
    // 探索后随机动态遭遇（约9%）
    // 已转入战斗/抉择中的房间不要再叠遭遇，否则会盖住「下一层」状态
    const roomNow = tsr.currentRun.currentRoom || room;
    const skipEncounter = !!tsr.currentRun.battleInProgress
        || !!tsr.currentRun.pendingInteractiveEvent
        || !!tsr.currentRun.pendingEncounter
        || roomNow.isBoss || roomNow.isElite || roomNow.isShrine
        || (typeof isTsrCombatRoom === 'function' && isTsrCombatRoom(roomNow) && !roomNow.battleCleared)
        || ['boss', 'elite', 'shrine', 'spirittrial', 'battle'].includes(roomNow.type);
    if (!skipEncounter && tryTsrDynamicEncounter()) {
        updateTimeSecretRealmUI();
        return;
    }
    
    // 检查时间是否用完
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
        return;
    }
    
    // 战斗演出已排队时：轻量刷新即可，避免全量 UI 再次踩到战区横幅
    if (tsr.currentRun.battleInProgress) {
        updateActionButtons();
        updateHealthBar();
        return;
    }
    updateTimeSecretRealmUI();
}



function getTsrBattleTacticMods(rounds) {
    const tsr = player.timeSecretRealm;
    const key = tsr.currentRun?.battleTacticKey;
    if (!key || !TSR_BATTLE_TACTICS[key]) {
        return { attack: tsr.currentRun?.gambleAttackBonus || 0, counterReduce: 0, counterPenalty: 0, critRate: 0, battleReward: 0 };
    }
    const t = TSR_BATTLE_TACTICS[key];
    let attack = (t.attack || 0) + (tsr.currentRun?.gambleAttackBonus || 0);
    if (t.firstStrike && rounds === 1) attack += t.firstStrike;
    if (t.attackPenaltyAfterFirst && rounds > 1) attack += t.attackPenaltyAfterFirst;
    return {
        attack,
        counterReduce: t.counterReduce || 0,
        counterPenalty: t.counterPenalty || 0,
        critRate: t.critRate || 0,
        battleReward: t.battleReward || 0
    };
}

function showTsrBattleTacticPanel(room) {
    const isBoss = room.isBoss || room.type === 'boss';
    const label = isBoss ? '首领' : '精英';
    const cards = Object.entries(TSR_BATTLE_TACTICS).map(([key, t]) =>
        `<button type="button" class="tsr-tactic-card" data-tsr-tactic="${key}">
            <span class="tsr-tactic-icon">${t.icon || '⚔️'}</span>
            <span class="tsr-tactic-name">${t.name || key}</span>
            <span class="tsr-tactic-desc">${t.desc || ''}</span>
        </button>`
    ).join('');
    showTsrMemePanel(
        `⚔️ 战前抉择 · ${label}`,
        `${label}守关者已现身，选择本战策略：`,
        `<div class="tsr-tactic-grid">${cards}</div>
         <button type="button" class="tsr-btn tsr-btn-ghost tsr-tactic-skip" data-tsr-tactic="none">不选战术 · 直接开战</button>`,
        'tactic'
    );
    bindTsrTacticPanelClicks();
    addTsrLog(`战前抉择：为${label}战选择战术`, 'info');
}

function bindTsrTacticPanelClicks() {
    const wrap = document.getElementById('tsrMemeBtns');
    if (!wrap || wrap.__tsrTacticBound) return;
    wrap.__tsrTacticBound = true;
    wrap.addEventListener('click', (ev) => {
        const btn = ev.target?.closest?.('[data-tsr-tactic]');
        if (!btn || !wrap.contains(btn)) return;
        ev.preventDefault();
        ev.stopPropagation();
        const key = btn.getAttribute('data-tsr-tactic');
        tsrChooseBattleTactic(key);
    }, true);
}

function armTsrExitClickGuard(ms) {
    const hold = Math.max(200, Number(ms) || 400);
    window._tsrExitClickGuardUntil = Date.now() + hold;
    const actions = document.getElementById('tsrActionControls');
    if (actions) {
        actions.classList.add('tsr-actions-guard');
        clearTimeout(window._tsrExitGuardTimer);
        window._tsrExitGuardTimer = setTimeout(() => {
            actions.classList.remove('tsr-actions-guard');
        }, hold);
    }
    // 额外锁撤离键，防止战术面板收起后同一次点击穿透结束本局
    const exitBtn = document.getElementById('tsrExitBtn');
    if (exitBtn) {
        exitBtn.disabled = true;
        exitBtn.classList.add('tsr-disabled-feel');
        clearTimeout(window._tsrExitBtnGuardTimer);
        window._tsrExitBtnGuardTimer = setTimeout(() => {
            exitBtn.disabled = false;
            exitBtn.classList.remove('tsr-disabled-feel');
        }, hold);
    }
}

function tsrChooseBattleTactic(key) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun?.currentRoom;
    if (!room || !room.explored || !tsr.currentRun.isActive) return;
    // 防止连点重复开战 / 穿透撤离
    if (room.battleTacticChosen || room._tsrTacticPicking || tsr.currentRun.battleInProgress) return;
    room._tsrTacticPicking = true;
    tsr.currentRun._tsrTacticPicking = true;
    // 先挡住底栏：隐藏面板后同一次点击会穿透到「撤离」
    armTsrExitClickGuard(1400);
    room.battleTacticChosen = true;
    tsr.currentRun.battleTacticKey = (key && key !== 'none' && TSR_BATTLE_TACTICS[key]) ? key : null;
    const chosenKey = tsr.currentRun.battleTacticKey;
    // 延后隐藏与开战，避开 click 收尾落到撤离键（首领层尤其容易）
    setTimeout(() => {
        const run = player.timeSecretRealm?.currentRun;
        if (!run?.isActive) return;
        const curRoom = run.currentRoom;
        if (!curRoom || curRoom !== room) return;
        room._tsrTacticPicking = false;
        run._tsrTacticPicking = false;
        hideTsrChoicePanels();
        if (chosenKey && TSR_BATTLE_TACTICS[chosenKey]) {
            const t = TSR_BATTLE_TACTICS[chosenKey];
            addTsrLog(`战术选定：${t.icon}${t.name}`, 'success');
            if (!player.timeSecretRealm.lifetimeStats) player.timeSecretRealm.lifetimeStats = {};
            player.timeSecretRealm.lifetimeStats.battleTactics = (player.timeSecretRealm.lifetimeStats.battleTactics || 0) + 1;
            checkTsrAchievements();
        }
        if (run.timeLeft <= 0) {
            endTimeSecretRealm('时间耗尽');
            return;
        }
        // 开战前再挡一次穿透；战斗结算中途禁止误触撤离
        armTsrExitClickGuard(1400);
        handleBattleRoom();
        if (!run.isActive || bLteZero(run.playerHealth)) return;
        if (run.battleInProgress) {
            updateActionButtons();
            updateHealthBar();
        } else {
            updateTimeSecretRealmUI();
        }
    }, 80);
}

function tryTsrBattleMidEvent(ctx) {
    const tsr = ctx.tsr;
    if (!tsr.currentRun.battleMidEventsTriggered) tsr.currentRun.battleMidEventsTriggered = {};
    TSR_BATTLE_MID_EVENTS.forEach(ev => {
        if (ctx.rounds < ev.minRound || ctx.rounds > ev.maxRound) return;
        if (ev.eliteOnly && !ctx.isElite && !ctx.isBoss) return;
        if (ev.bossOnly && !ctx.isBoss) return;
        if (tsr.currentRun.battleMidEventsTriggered[ev.id]) return;
        if (Math.random() >= ev.chance) return;
        tsr.currentRun.battleMidEventsTriggered[ev.id] = true;
        const msg = ev.apply(ctx);
        addTsrLog(`${ev.icon} 战中事件「${ev.name}」：${msg}`, 'info');
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.battleMidEvents = (tsr.lifetimeStats.battleMidEvents || 0) + 1;
        checkTsrAchievements();
    });
}

/** 怪物 HP 归零钩子：ext 可实现多段生命复活，返回 { monsterHp, monsterMaxHp, monsterAtk } 或 null */
function onTsrMonsterHpReachedZero(monster, ctx) {
    return null;
}

function tryTsrMonsterHpZero(monster, monsterHp, monsterMaxHp, monsterAtk, meta) {
    if (monsterHp > 0) return { monsterHp, monsterMaxHp, monsterAtk, isDead: false };
    if (typeof onTsrMonsterHpReachedZero === 'function') {
        const revived = onTsrMonsterHpReachedZero(monster, { monsterHp, monsterMaxHp, monsterAtk, ...meta });
        if (revived) {
            const tsr = player.timeSecretRealm;
            if (tsr?.currentRun) tsr.currentRun.monsterMaxHpCache = revived.monsterMaxHp;
            return { monsterHp: revived.monsterHp, monsterMaxHp: revived.monsterMaxHp, monsterAtk: revived.monsterAtk, isDead: false };
        }
    }
    return { monsterHp: 0, monsterMaxHp, monsterAtk, isDead: true };
}

function applyTsrMonsterHpZeroResult(res, state) {
    state.monsterHp = res.monsterHp;
    state.monsterMaxHp = res.monsterMaxHp;
    state.monsterAtk = res.monsterAtk;
    if (res.isDead) state.victory = true;
}

function tryTsrMonsterHpZeroVictory(monster, state, meta) {
    applyTsrMonsterHpZeroResult(
        tryTsrMonsterHpZero(monster, state.monsterHp, state.monsterMaxHp, state.monsterAtk, meta),
        state
    );
}

function tryTsrMonsterPhaseShift(monster, monsterHp, monsterMaxHp, isBoss, isElite) {
    const tsr = player.timeSecretRealm;
    if (tsr.currentRun.monsterEnraged || monsterHp <= 0 || monsterMaxHp <= 0) return;
    if (monsterHp / monsterMaxHp > 0.5) return;
    tsr.currentRun.monsterEnraged = true;
    tsr.currentRun.monsterPhaseCounterBonus = (tsr.currentRun.monsterPhaseCounterBonus || 0) + (isBoss ? 0.12 : (isElite ? 0.1 : 0.08));
    tsr.currentRun.monsterShield = Math.max(0, (tsr.currentRun.monsterShield || 0) - 0.12);
    const line = TSR_BOSS_LINES.phase[Math.floor(Math.random() * TSR_BOSS_LINES.phase.length)];
    addTsrLog(`💢 ${monster?.name || '守关者'}进入二阶段！${line}`, 'warning');
    if (typeof pushTsrFeelEvent === 'function') {
        pushTsrFeelEvent({ type: 'phase', label: `💢 二阶段！${monster?.name || '敌人'}狂暴化` });
    }
}

function applyTsrBattleComboMilestones(streak, dm) {
    const tsr = player.timeSecretRealm;
    const stormMult = (tsr.currentRun.comboStormBattlesLeft > 0 && tsr.currentRun.comboStormMult) ? tsr.currentRun.comboStormMult : 1;
    TSR_BATTLE_COMBO_MILESTONES.filter(m => streak === m.streak).forEach(m => {
        if (m.currency) {
            const g = addTsrRunCurrency(Math.floor(m.currency * dm * stormMult));
            addTsrLog(`${m.msg}，额外+${g}秘境币`, 'success');
        }
        if (m.charge) chargeTsrSpirit(m.charge);
        if (m.buff) addTempBuff(m.buff);
        if (!m.currency && m.msg) addTsrLog(m.msg, 'success');
    });
}

function resetTsrBattleTransientState() {
    const tsr = player.timeSecretRealm;
    tsr.currentRun.monsterEnraged = false;
    tsr.currentRun.monsterPhaseCounterBonus = 0;
    tsr.currentRun.monsterDodgeNext = false;
    tsr.currentRun.monsterMultiStrike = false;
    tsr.currentRun.monsterReflectPct = 0;
    tsr.currentRun.gambleAttackBonus = 0;
    tsr.currentRun.battleMidEventsTriggered = {};
    tsr.currentRun.battleCritFlash = false;
    tsr.currentRun.monsterMaxHpCache = 0;
    tsr.currentRun.pendingFeelEvents = [];
    tsr.currentRun._feelDodged = false;
}

function handleBattleRoom(options) {
    options = options || {};
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive || !tsr.currentRun.currentRoom) return;
    const room = tsr.currentRun.currentRoom;
    const difficultyMultiplier = tsr.currentRun.difficultyMultiplier;
    const isBoss = room.isBoss || room.type === 'boss';
    const isElite = room.isElite || room.type === 'elite' || options.forceElite;
    const floor = tsr.currentRun.currentFloor;
    const label = room.isSpiritAscendTrial ? '飞升试炼' : (room.isSpiritTrial ? '试炼' : (isBoss ? '首领' : (isElite ? '精英' : '战斗')));
    room.battleCleared = false;
    tsr.currentRun.battleLootBuffer = [];
    tsr.currentRun.collectBattleLoot = true;
    tsr.currentRun.pendingOverflowItems = tsr.currentRun.pendingOverflowItems || [];
    tsr.currentRun.deferBattleLogs = true;
    tsr.currentRun.deferredBattleLogs = [];
    tsr.currentRun.battleLogRound = 0;
    // 同步战斗结算全程：反击扣血走「归零才战败」，勿触发 1% 力竭结局
    tsr.currentRun._resolvingBattle = true;
    try {
        return handleBattleRoomInner(options, tsr, room, difficultyMultiplier, isBoss, isElite, floor, label);
    } finally {
        if (tsr.currentRun) tsr.currentRun._resolvingBattle = false;
    }
}

function handleBattleRoomInner(options, tsr, room, difficultyMultiplier, isBoss, isElite, floor, label) {

    if (!room.monster && !room.isSpiritTrial) {
        room.monster = pickTsrMonster(isBoss, isElite, floor, difficultyMultiplier);
    }
    ensureTsrMonsterAffixes(room.monster, { isBoss, isElite, floor });
    if (tsr.currentRun.nextAffixSwap && room.monster) {
        const minCount = Math.max(1, (room.monster.affixKeys || []).length);
        rerollTsrMonsterAffixes(room.monster, isBoss, isElite, floor, minCount);
        tsr.currentRun.nextAffixSwap = false;
        addTsrLog('词条置换符生效！怪物词条已重铸', 'info');
    }
    const monster = room.monster;
    resetTsrBattleTransientState();
    tsr.currentRun.equipShieldUsed = false;
    tsr.currentRun.monsterShield = 0;
    const affixStartShield = getTsrMonsterAffixStartShield(monster);
    if (affixStartShield > 0) tsr.currentRun.monsterShield = affixStartShield;

    const monsterStats = computeTsrMonsterStats({
        isBoss, isElite, floor, difficultyMultiplier, monster,
        timeLoanPenalty: tsr.currentRun.timeLoanPenalty,
        kpiBattlePenalty: tsr.currentRun.kpiBattlePenalty
    });
    if (typeof initTsrMonsterLifeBattle === 'function') {
        initTsrMonsterLifeBattle(monster, monsterStats, isBoss, isElite);
    }
    updateTsrMonsterBanner(monster, monsterStats, isBoss, isElite);

    if (room.isSpiritAscendTrial) {
        addTsrLog(`🌌 飞升试炼：${getTsrSpiritDisplayName()}与精灵帝皇对峙，灵击协同×3`, 'warning');
    } else if (room.isSpiritTrial) {
        const intro = TSR_SPIRIT_TRIAL_LINES.intro[Math.floor(Math.random() * TSR_SPIRIT_TRIAL_LINES.intro.length)];
        addTsrLog(`⚔️ 精灵试炼：${intro}`, 'warning');
    } else if (isBoss) {
        const intro = monster?.intro || TSR_BOSS_LINES.intro[Math.floor(Math.random() * TSR_BOSS_LINES.intro.length)];
        addTsrLog(`👹 ${monster ? formatTsrMonsterNamePlain(monster) : '首领'}：${intro}`, 'warning');
    } else if (monster) {
        addTsrLog(`${formatTsrMonsterNamePlain(monster)} 遭遇${isElite ? '精英' : ''}：${monster.intro}`, 'warning');
    }
    const affixList = getTsrMonsterAffixList(monster);
    if (affixList.length) {
        addTsrLog(`🏷️ 怪物词条：${affixList.map(a => a.icon + a.name).join(' · ')}`, 'warning');
        recordTsrMonsterAffixCodex(monster.affixKeys);
    }
    if (tsr.currentRun.battleTacticKey === 'gamble') {
        if (Math.random() < 0.5) {
            tsr.currentRun.gambleAttackBonus = 0.5;
            addTsrLog('搏命战术：赌对了！本战攻击+50%', 'success');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('搏命战术：赌错了！-8%生命', 'error');
            if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); return; }
        }
    }
    const tacticRewardBonus = getTsrBattleTacticMods(1).battleReward;
    if (tacticRewardBonus > 0) tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + tacticRewardBonus;
    
    const playerAtk = calculateTsrPlayerAttack();
    const atkBonus = getTsrBattleAttackBonus(isBoss, isElite);
    if (tsr.currentRun.kpiBattlePenalty) tsr.currentRun.kpiBattlePenalty = null;
    let monsterHp = monsterStats.hp;
    let monsterMaxHp = monsterStats.hp;
    tsr.currentRun.monsterMaxHpCache = monsterMaxHp;
    let monsterAtk = monsterStats.atk;
    let rounds = 0;
    let victory = false;
    let totalDamageDealt = 0;
    let totalCounterDamage = 0;
    let critCount = 0;
    const combatHits = [];
    tsr.currentRun._combatHitsDraft = combatHits;
    let battleGained = 0;
    const playerMaxHpFeel = calculateTsrPlayerHealth();
    const playerHpStartFeel = tsr.currentRun.playerHealth;
    const furyStartFeel = tsr.currentRun.battleFury || 0;
    tsr.currentRun.pendingFeelEvents = [];
    const flashActive = tsr.currentRun.flashBombActive;
    if (flashActive) tsr.currentRun.flashBombActive = false;
    
    while (rounds < 12 && monsterHp > 0) {
        rounds++;
        tsr.currentRun.battleLogRound = rounds;
        tryTsrBattleMidEvent({ tsr, rounds, isBoss, isElite, dm: difficultyMultiplier, monster, monsterHp, monsterMaxHp });
        if (room.isBloodArena && tsr.currentRun.playerHealth > 0) {
            // 按面板文案固定失血3%，不乘难度（高难度×dm 会一回合砍掉大半血）
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.03));
            addTsrLog('血战竞技场：每回合失血3%', 'warning');
            if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); return; }
        }
        const tacticMods = getTsrBattleTacticMods(rounds);
        let hit = calculateBattleDamage();
        if (tsr.currentRun.battleCritFlash) {
            hit = { ...hit, isCrit: true };
            tsr.currentRun.battleCritFlash = false;
        }
        if (tacticMods.critRate > 0 && Math.random() < tacticMods.critRate) hit = { ...hit, isCrit: true };
        let dmgMult = (isBoss ? 1.18 : 1) * (1 + atkBonus + tacticMods.attack);
        dmgMult *= getTsrBattleEquipDamageMult({ rounds, isBoss, isElite, monsterHp, monsterMaxHp, monster });
        if ((monster?.affixKeys || []).length) dmgMult *= (1 + getTsrAffixAttackBonus(monster));
        if (flashActive && rounds === 1) dmgMult *= 1.25;
        if (tsr.currentRun.monsterShield > 0) dmgMult *= (1 - tsr.currentRun.monsterShield);
        let dmg = 0;
        if (tsr.currentRun.monsterDodgeNext) {
            tsr.currentRun.monsterDodgeNext = false;
            addTsrLog(`${monster?.name || '守关者'}闪避了本回合攻击！`, 'warning');
        } else {
            dmg = Math.max(1, Math.floor((Number(hit.damage) || 0) * dmgMult));
            monsterHp = Math.max(0, monsterHp - dmg);
            totalDamageDealt += dmg;
            applyTsrEquipLifeSteal(dmg, hit.isCrit);
            if (dmg > 0 && Math.random() < getTsrEquipBonus('multiHit')) {
                const extra = Math.max(1, Math.floor(dmg * 0.55));
                monsterHp = Math.max(0, monsterHp - extra);
                totalDamageDealt += extra;
                tsr.currentRun._feelExtraDmg = (tsr.currentRun._feelExtraDmg || 0) + extra;
                addTsrLog(`装备连击！追加${formatTsrCombatNum(extra)}伤害`, 'success');
            }
        }
        tryTsrMonsterPhaseShift(monster, monsterHp, monsterMaxHp, isBoss, isElite);
        monsterHp = tryTsrSpiritBattleStrike(rounds, monsterHp, isBoss, monster, monsterMaxHp);
        const _hpZ1 = tryTsrMonsterHpZero(monster, monsterHp, monsterMaxHp, monsterAtk, { isBoss, isElite, rounds });
        monsterHp = _hpZ1.monsterHp;
        monsterMaxHp = _hpZ1.monsterMaxHp;
        monsterAtk = _hpZ1.monsterAtk;
        if (_hpZ1.isDead) victory = true;
        if (hit.isCrit) {
            critCount++;
            const steal = getTsrRelicBonus('lifeSteal');
            if (steal > 0) {
                tsrHealPlayer(steal);
                addTsrLog(`噬血尖牙触发！暴击回血${Math.floor(steal * 100)}%`, 'success');
            }
            const thornPct = getTsrMonsterAffixThornPct(monster);
            if (thornPct > 0 && !victory) {
                applyDamage(bMul(tsr.currentRun.playerHealth, thornPct));
                addTsrLog(`【荆棘】词条反刺！受到${Math.floor(thornPct * 100)}%生命伤害`, 'error');
                if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); return; }
            }
            const reflectPct = tsr.currentRun.monsterReflectPct || 0;
            if (reflectPct > 0 && !victory) {
                applyDamage(bMul(tsr.currentRun.playerHealth, reflectPct));
                addTsrLog(`反伤镜触发！受到${Math.floor(reflectPct * 100)}%生命伤害`, 'error');
                if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); return; }
            }
        }
        if (isBoss && rounds === 3) {
            const mid = monster?.intro ? `${monster.name}：还没完呢。` : TSR_BOSS_LINES.mid[Math.floor(Math.random() * TSR_BOSS_LINES.mid.length)];
            addTsrLog(`👹 ${mid}`, 'info');
        }
        if (monsterHp <= 0) {
            const _hpZ2 = tryTsrMonsterHpZero(monster, monsterHp, monsterMaxHp, monsterAtk, { isBoss, isElite, rounds });
            monsterHp = _hpZ2.monsterHp;
            monsterMaxHp = _hpZ2.monsterMaxHp;
            monsterAtk = _hpZ2.monsterAtk;
            if (_hpZ2.isDead) victory = true;
        }
        if (monster && rounds % 2 === 0 && !victory) {
            monsterHp = applyTsrMonsterAffixRound(monster, rounds, monsterHp, monsterMaxHp);
            if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); return; }
            monsterHp = applyTsrMonsterSkill(monster, rounds, monsterHp, playerAtk, difficultyMultiplier, isBoss, isElite) || monsterHp;
            if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); return; }
        }
        let counterMult = getTsrCounterDamageMultiplier();
        counterMult *= 1 + getTsrMonsterAffixCounterMult(monster, rounds, monsterHp, monsterMaxHp);
        if (typeof getTsrMonsterTraitCounterBonus === 'function') {
            const maxHp = calculateTsrPlayerHealth();
            // BigSci 指数为 bigint，不能直接喂给 Math.pow；统一走百分比函数
            const playerHpPct = maxHp && tsr?.currentRun?.playerHealth
                ? Math.min(1, getTsrHealthPercent(tsr.currentRun.playerHealth, maxHp) / 100)
                : 1;
            counterMult *= 1 + getTsrMonsterTraitCounterBonus(monster, rounds, monsterHp, monsterMaxHp, playerHpPct);
        }
        counterMult *= 1 + (tsr.currentRun.monsterPhaseCounterBonus || 0);
        if (tsr.currentRun.monsterCounterSurgeRound === rounds) counterMult *= 1.15;
        counterMult *= Math.max(0.4, 1 - getTsrMonsterAffixCounterReduce(monster) - (tacticMods.counterReduce || 0));
        counterMult *= 1 + (tacticMods.counterPenalty || 0);
        if (tsr.currentRun.comboStormCounterPenalty) counterMult *= 1 + tsr.currentRun.comboStormCounterPenalty;
        const shield = tsr.currentRun.counterShield;
        if (shield && shield.count > 0) {
            counterMult *= shield.mult;
            shield.count--;
            if (shield.count <= 0) tsr.currentRun.counterShield = null;
            addTsrLog('铁壁药盾抵消部分反击伤害', 'success');
        }
        const counterRatio = getTsrBattleCounterRatio(isBoss, isElite, difficultyMultiplier);
        let counter = Math.max(1, Math.floor(monsterAtk * counterRatio * counterMult * (victory ? TSR_DEATH_COUNTER_RATIO : 1)));
        const monDodge = monster?.combatTraits?.dodge || 0;
        const affixList = getTsrMonsterAffixList(monster);
        const ignoreArmor = affixList.reduce((s, ax) => s + (ax.ignorePlayerArmor || 0), 0);
        counter = Math.max(1, Math.floor(counter * (1 - Math.max(0, getTsrEquipBonus('armor') + getTsrEquipBonus('block') * 0.5 - ignoreArmor))));
        const monCrit = typeof getTsrMonsterTraitCounterCrit === 'function' ? getTsrMonsterTraitCounterCrit(monster) : 0;
        if (monCrit > 0 && Math.random() < monCrit) counter = Math.floor(counter * (1.35 + (monster?.combatTraits?.critDamage || 0)));
        const roundCounterParts = [];
        if (!victory && monDodge > 0 && Math.random() < monDodge * 0.35) {
            addTsrLog('怪物闪避！免疫本次反击伤害', 'success');
        } else if (!victory && Math.random() < calculateTsrPlayerDodgeRate()) {
            addTsrLog('装备闪避！免疫本次反击伤害', 'success');
            tsr.currentRun._feelDodged = true;
        } else {
            if (!tsr.currentRun.equipShieldUsed && getTsrEquipBonus('shield') > 0) {
                counter = Math.max(1, Math.floor(counter * (1 - getTsrEquipBonus('shield'))));
                tsr.currentRun.equipShieldUsed = true;
                addTsrLog('装备护盾吸收部分反击伤害', 'success');
            }
            const thornDmg = getTsrEquipBonus('thorns');
            if (thornDmg > 0 && !victory) {
                const reflect = Math.max(1, Math.floor(monsterMaxHp * thornDmg * 0.08));
                monsterHp = Math.max(0, monsterHp - reflect);
                addTsrLog(`荆棘反刺！对敌人造成${formatTsrCombatNum(reflect)}伤害`, 'info');
                if (monsterHp <= 0) {
                    const _hpZ3 = tryTsrMonsterHpZero(monster, monsterHp, monsterMaxHp, monsterAtk, { isBoss, isElite, rounds });
                    monsterHp = _hpZ3.monsterHp;
                    monsterMaxHp = _hpZ3.monsterMaxHp;
                    monsterAtk = _hpZ3.monsterAtk;
                    if (_hpZ3.isDead) victory = true;
                }
            }
            applyDamage(counter);
            totalCounterDamage += counter;
            if (!victory) roundCounterParts.push(counter);
        }
        let roundCounterFelt = 0;
        if (tsr.currentRun.monsterMultiStrike) {
            tsr.currentRun.monsterMultiStrike = false;
            applyDamage(counter);
            totalCounterDamage += counter;
            roundCounterFelt += counter;
            if (!victory) roundCounterParts.push(counter);
            addTsrLog('连击反击！额外受到一次伤害', 'error');
        }
        // 本回合已计入 totalCounterDamage 的差值作为演出反击量
        const prevFelt = combatHits.reduce((s, x) => s + (x.counter || 0), 0);
        roundCounterFelt = Math.max(roundCounterFelt, totalCounterDamage - prevFelt);
        const feelEvents = (tsr.currentRun.pendingFeelEvents || []).splice(0);
        const playerHpNow = tsr.currentRun.playerHealth;
        const extraDmg = tsr.currentRun._feelExtraDmg || 0;
        tsr.currentRun._feelExtraDmg = 0;
        combatHits.push({
            round: rounds,
            playerDmg: dmg || 0,
            extraDmg,
            crit: !!(hit && hit.isCrit),
            monsterHp,
            monsterMaxHp,
            counter: victory ? 0 : roundCounterFelt,
            counterHits: victory ? [] : roundCounterParts.slice(),
            playerHp: playerHpNow,
            playerHpPct: getTsrHealthPercent(playerHpNow, playerMaxHpFeel),
            fury: tsr.currentRun.battleFury || 0,
            events: feelEvents,
            dodged: !!tsr.currentRun._feelDodged,
            logs: drainTsrDeferredLogs(rounds),
            killed: !!victory
        });
        tsr.currentRun._feelDodged = false;
        if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); return; }
        if (victory) break;
    }
    
    if (victory) {
        const monLabel = monster ? formatTsrMonsterNamePlain(monster) : label;
        addTsrLog(`${monLabel} 战斗${rounds}回合胜利！造成${formatTsrCombatNum(totalDamageDealt)}伤害${critCount ? '（' + critCount + '次暴击）' : ''}，受到反击${formatTsrCombatNum(totalCounterDamage)}`, 'info');
        if (monster?.win) addTsrLog(`${monster.icon} ${monster.win}`, 'success');
        tsr.currentRun.battleWinStreak = (tsr.currentRun.battleWinStreak || 0) + 1;
        addTsrVoidResonance(isBoss ? 14 : (isElite ? 10 : 6));
        applyTsrBattleComboMilestones(tsr.currentRun.battleWinStreak, difficultyMultiplier);
        const stormActive = tsr.currentRun.comboStormBattlesLeft > 0 && tsr.currentRun.comboStormMult;
        if (tsr.currentRun.comboStormBattlesLeft > 0) {
            tsr.currentRun.comboStormBattlesLeft--;
            if (tsr.currentRun.comboStormBattlesLeft <= 0) {
                tsr.currentRun.comboStormMult = null;
                tsr.currentRun.comboStormCounterPenalty = 0;
            }
        }
        if (tsr.currentRun.warArchiveBattlesLeft > 0) {
            tsr.currentRun.warArchiveBattlesLeft--;
            if (tsr.currentRun.warArchiveBattlesLeft <= 0) tsr.currentRun.battleTacticKey = null;
        }
        let rewardCurrency = room.rewards.currency;
        if (room.isBloodArena) {
            rewardCurrency = Math.floor(rewardCurrency * 2);
            if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
            tsr.lifetimeStats.bloodArenaWins = (tsr.lifetimeStats.bloodArenaWins || 0) + 1;
            addTsrLog('血战竞技场胜利！赏金翻倍', 'success');
            checkTsrAchievements();
        }
        if (stormActive) {
            rewardCurrency = Math.floor(rewardCurrency * tsr.currentRun.comboStormMult);
            addTsrLog(`连击风暴加持！赏金×${tsr.currentRun.comboStormMult}`, 'success');
        }
        if (tsr.currentRun.battleRewardBonus) {
            rewardCurrency = Math.floor(rewardCurrency * (1 + tsr.currentRun.battleRewardBonus));
            tsr.currentRun.battleRewardBonus = 0;
            addTsrLog('猎怪诱饵生效！战斗奖励提升', 'success');
        }
        if (tsr.currentRun.echoNextReward) {
            rewardCurrency = Math.floor(rewardCurrency * tsr.currentRun.echoNextReward);
            tsr.currentRun.echoNextReward = null;
            addTsrLog('回音诅咒兑现：本场战斗奖励已放大', 'success');
        }
        if (tsr.currentRun.oracleBonus) {
            rewardCurrency = Math.floor(rewardCurrency * 1.2);
            tsr.currentRun.oracleBonus = false;
            addTsrLog('预言加护：战斗奖励+20%', 'success');
        }
        const affixRewardMult = getTsrMonsterAffixRewardMult(monster);
        if (affixRewardMult > 0) {
            rewardCurrency = Math.floor(rewardCurrency * (1 + affixRewardMult));
            addTsrLog(`词条赏金！战斗奖励+${Math.floor(affixRewardMult * 100)}%`, 'success');
        }
        if ((monster?.affixKeys || []).length && getTsrEquipBonus('affixHunter') > 0) {
            rewardCurrency = Math.floor(rewardCurrency * (1 + getTsrEquipBonus('affixHunter')));
        }
        const gained = addTsrRunCurrency(rewardCurrency, {
            bossBonus: isBoss,
            eliteBonus: isElite,
            combo: true,
            fromBattle: !isBoss && !isElite
        });
        battleGained = gained;
        tsr.currentRun.maxBattleStreak = Math.max(tsr.currentRun.maxBattleStreak || 0, tsr.currentRun.battleWinStreak || 0);
        const regen = getTsrEquipBonus('regen');
        if (regen > 0) {
            tsrHealPlayer(regen);
            addTsrLog(`装备再生回复${Math.floor(regen * 100)}%生命`, 'success');
        }
        chargeTsrSpirit((isBoss ? 25 : (isElite ? 18 : 12)) + (getTsrSpiritSkillBonuses().battleChargeBonus || 0) + Math.floor(getTsrEquipBonus('spiritCharge') * 30) + Math.floor(getTsrEquipBonus('resonanceGain') * 15));
        if ((monster?.affixKeys || []).length >= 1 && getTsrEquipBonus('affixHunter') > 0) {
            addTsrLog(`词条猎手加成+${Math.floor(getTsrEquipBonus('affixHunter') * 100)}%`, 'success');
        }
        bumpTsrQuestProgress('runBattles', 1);
        if (isBoss) {
            bumpTsrQuestProgress('weeklyBosses', 1);
            bumpTsrQuestProgress('runBosses', 1);
        }
        if (isElite) bumpTsrQuestProgress('runElites', 1);
        if (isBoss) {
            const winLine = TSR_BOSS_LINES.win[Math.floor(Math.random() * TSR_BOSS_LINES.win.length)];
            addTsrLog(`👹 ${winLine}`, 'success');
        }
        if (room.isSpiritTrial) {
            applyTsrSpiritTrialVictory();
        }
        if (room.isSpiritBoss) {
            applyTsrSpiritBossVictory();
        }
        if (room.isSpiritAscendTrial) {
            applyTsrSpiritAscendTrialVictory();
            room.isSpiritAscendTrial = false;
        }
        if (room.isStarBoss || (isBoss && monster?.id === 'stararchon')) {
            applyTsrStarBossVictory();
            room.isStarBoss = false;
        }
        if (isBoss && monster?.id === 'celestialtyrant') {
            applyTsrTyrantVictory(!!room.isThroneExtreme);
            room.isThroneExtreme = false;
        }
        onTsrMonsterAffixVictory(monster);
        onTsrMonsterBattleVictory(monster);
        if (room.isSpiritDuel) {
            if (!isTsrTutorialRun()) {
                if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
                tsr.lifetimeStats.spiritDuelWins = (tsr.lifetimeStats.spiritDuelWins || 0) + 1;
            }
            addTsrSpiritBond(5);
            addTsrLog(isTsrTutorialRun() ? '镜像决斗胜利！（教学局不外带亲密度）' : '镜像决斗胜利！亲密度+5', 'success');
            checkTsrAchievements();
            room.isSpiritDuel = false;
        }
        if (monster?.tier === 'mythic') {
            if (!isTsrTutorialRun()) {
                if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
                tsr.lifetimeStats.mythicKills = (tsr.lifetimeStats.mythicKills || 0) + 1;
            }
            bumpTsrQuestProgress('weeklyMythicKills', 1);
            checkTsrAchievements();
        }
        addTsrLog(`${label}胜利！连击×${tsr.currentRun.battleWinStreak}，获得${gained}秘境币`, 'success');
        const timeSteal = getTsrRelicBonus('timeSteal');
        if (timeSteal > 0) {
            tsr.currentRun.timeLeft += timeSteal;
            addTsrLog(`窃时之牙：战斗胜利+${timeSteal}秒`, 'success');
        }
        if (isElite) {
            if (!isTsrTutorialRun()) {
                if (!tsr.codex) tsr.codex = { rooms: {}, relics: {}, elites: 0, gambles: 0 };
                tsr.codex.elites = (tsr.codex.elites || 0) + 1;
                invalidateTsrUiCache('codex');
            }
            let relicChance = getTsrEliteRelicDropChance();
            if (tsr.currentRun.nextEliteRelicBoost) {
                relicChance = Math.min(0.95, relicChance + tsr.currentRun.nextEliteRelicBoost);
                tsr.currentRun.nextEliteRelicBoost = 0;
            }
            if (Math.random() < relicChance && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
                const pick = rollTsrRelicChoices(1)[0];
                if (pick) addTsrRelic(pick);
            }
            tryDropTsrEquipment('精英战利品', { isElite: true });
            // 精英战后小回血，避免前几层打完贴皮续航断层
            tsrHealPlayer(0.1);
            addTsrLog('精英战利：战息回复10%生命', 'success');
        }
        const buffChance = getTsrBattleBuffChance(isBoss, isElite, difficultyMultiplier);
        if (Math.random() < buffChance) {
            const buff = getRandomTempBuff();
            if (buff.value) buff.value *= difficultyMultiplier;
            if (!buff.timeBonus) buff.timeBonus = getTimeBonusByEffect(buff.effect);
            addTempBuff(buff);
        }
        if (!isElite && !isBoss) {
            tryDropTsrEquipment('战斗缴获', { chance: 0.36 + floor * 0.02 });
        }
        if (isBoss) {
            const tier = getTsrDifficultyTier();
            const timeGift = 18 + Math.floor(floor * 1.2) + tier * 4;
            tsr.currentRun.timeLeft += timeGift;
            addTsrLog(`击败首领！额外获得${timeGift}秒探索时间`, 'success');
            const bossRelicChance = getTsrBossRelicDropChance();
            if (Math.random() < bossRelicChance && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
                const pick = rollTsrRelicChoices(1)[0];
                if (pick) addTsrRelic(pick);
            }
            tryDropTsrEquipment('首领战利品', { isBoss: true });
            if (monster?.id) tryDropTsrExclusiveEquipment(monster.id, true);
        }
        if (options.portalRisky && Math.random() < 0.45) {
            const pick = rollTsrRelicChoices(1)[0];
            if (pick) addTsrRelic(pick);
        }
        if (tsr.currentRun.onBattleWinShrineBless) {
            tsr.currentRun.onBattleWinShrineBless = false;
            tsr.currentRun.timeLeft += 20;
            tsrHealPlayer(0.12);
            addTsrLog('神龛祝福：+20秒，回血12%', 'success');
        }
    } else {
        tsr.currentRun.onBattleWinShrineBless = false;
        tsr.currentRun.battleWinStreak = 0;
        // 战败百分比伤与难度解耦（高难度原 15%×倍率可达数百%，等于秒杀）
        const damage = bMul(tsr.currentRun.playerHealth, 0.1);
        applyDamage(damage);
        addTsrLog(`${label}失败！受到10%当前生命伤害`, 'error');
        if (room.isSpiritTrial) {
            const loseLine = TSR_SPIRIT_TRIAL_LINES.lose[Math.floor(Math.random() * TSR_SPIRIT_TRIAL_LINES.lose.length)];
            addTsrLog(`⚔️ ${loseLine}`, 'warning');
        }
        if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); return; }
    }
    if (tsr.currentRun.spiritStarAssist) {
        tsr.currentRun.spiritStarAssist = false;
        tsr.currentRun.spiritStarAssistMult = null;
    }
    if (tsr.currentRun.warArchiveBattlesLeft <= 0) tsr.currentRun.battleTacticKey = null;
    tsr.currentRun.gambleAttackBonus = 0;
    // 战斗已结算（胜/负），允许进层；未开战则仍锁定
    room.battleCleared = true;
    tsr.currentRun.lastBattleSummary = {
        fightId: tsr.currentRun._challengeAwaitFightId || null,
        victory,
        rounds,
        damage: totalDamageDealt,
        taken: totalCounterDamage,
        crits: critCount,
        currency: battleGained,
        streak: tsr.currentRun.battleWinStreak || 0,
        monsterName: monster ? formatTsrMonsterNamePlain(monster) : label,
        monsterIcon: monster?.icon || '👾',
        monsterIntro: monster?.intro || '',
        winLine: monster?.win || '',
        isBoss,
        isElite,
        loot: (tsr.currentRun.battleLootBuffer || []).slice()
    };
    tsr.currentRun.collectBattleLoot = false;
    // 开战前(round0)与战后结算日志：随演出刷出，避免先剧透
    const leftoverLogs = drainTsrDeferredLogs();
    tsr.currentRun.deferBattleLogs = false;
    tsr.currentRun._combatHitsDraft = null;
    const preLogs = leftoverLogs.filter(L => (L.round || 0) === 0);
    const postLogs = leftoverLogs.filter(L => (L.round || 0) !== 0);
    const finishBattleUi = () => {
        // 若跳过/无演出，补刷尚未写出的日志
        if (preLogs.length || postLogs.length) {
            flushTsrDeferredLogsNow(preLogs.splice(0, preLogs.length).concat(postLogs.splice(0, postLogs.length)));
        }
        hideTsrMonsterBanner(false, { abort: false });
        if (typeof flushTsrPendingOverflow === 'function') flushTsrPendingOverflow();
        afterAction();
        updateActionButtons();
    };
    if (combatHits.length && document.getElementById('tsrMonsterBanner')) {
        queueTsrBattleFeel(combatHits, {
            monsterMaxHp,
            victory,
            isBoss,
            isElite,
            playerMaxHp: playerMaxHpFeel,
            playerHpStart: playerHpStartFeel,
            furyStart: furyStartFeel,
            summary: tsr.currentRun.lastBattleSummary,
            preLogs,
            postLogs
        }, finishBattleUi);
    } else {
        finishBattleUi();
    }
}
// 增益效果调试（仅开发时在控制台手动调用）
function validateBuffEffects() {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun || !tsr.currentRun.tempBuffs) return;
    
    console.log('当前增益效果:');
    tsr.currentRun.tempBuffs.forEach((buff, index) => {
        console.log(`${index + 1}. ${buff.name}: ${buff.effect} = ${buff.value}`);
    });
    
    console.log('计算后的属性:');
    console.log('攻击力:', calculateTsrPlayerAttack());
    console.log('爆伤:', calculateTsrPlayerCritDamage());
    console.log('暴击率:', calculateTsrPlayerCritRate());
    console.log('生命值:', calculateTsrPlayerHealth());
}

// 处理事件房间
function handleEventRoom() {
    const tsr = player.timeSecretRealm;
    
    // 随机事件
    const events = [
        { 
            name: '神秘祝福', 
            effect: () => {
                const buff = getRandomTempBuff();
                // 确保增益包含时间奖励
                if (!buff.timeBonus) {
                    buff.timeBonus = getTimeBonusByEffect(buff.effect);
                }
                addTempBuff(buff);
                return `获得了临时强化: ${buff.name}`;
            }
        },
        { 
            name: '时间扭曲', 
            effect: () => {
                const timeChange = Math.random() > 0.5 ? 30 : -20;
                tsr.currentRun.timeLeft += timeChange;
                return `时间${timeChange > 0 ? '增加' : '减少'}了${Math.abs(timeChange)}秒`;
            }
        },
        { 
            name: '财富降临', 
            effect: () => {
                const currency = 100 + Math.floor(Math.random() * 100);
                const gained = addTsrRunCurrency(currency);
                return `获得了${gained}秘境币`;
            }
        },
        {
            name: '时空裂隙',
            effect: () => {
                const timeChange = Math.random() > 0.4 ? 45 : -25;
                tsr.currentRun.timeLeft += timeChange;
                return `时间${timeChange > 0 ? '增加' : '减少'}了${Math.abs(timeChange)}秒`;
            }
        },
        {
            name: '命运抉择',
            effect: () => {
                if (Math.random() > 0.5) {
                    const buff = getRandomTempBuff();
                    if (!buff.timeBonus) buff.timeBonus = getTimeBonusByEffect(buff.effect);
                    addTempBuff(buff);
                    return `命运眷顾！获得${buff.name}`;
                }
                applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
                return '命运捉弄！受到8%生命值伤害';
            }
        },
        {
            name: '秘境商人',
            effect: () => {
                const gained = addTsrRunCurrency(80 + Math.floor(Math.random() * 120));
                return `商人馈赠${gained}秘境币`;
            }
        },
        {
            name: '远古试炼',
            effect: () => {
                if (Math.random() > 0.45) {
                    const gained = addTsrRunCurrency(150 + Math.floor(Math.random() * 80));
                    return `试炼通过！获得${gained}秘境币`;
                }
                applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
                return '试炼失败！受到8%生命值伤害';
            }
        },
        {
            name: '时间借贷',
            effect: () => {
                tsr.currentRun.timeLeft += 50;
                tsr.currentRun.currencyEarned = Math.max(0, tsr.currentRun.currencyEarned - 60);
                return '借来50秒，但损失60秘境币';
            }
        },
        {
            name: '遗物低语',
            effect: () => {
                if ((tsr.currentRun.relics || []).length < getTsrRelicMax()) {
                    const pick = rollTsrRelicChoices(1)[0];
                    if (pick && addTsrRelic(pick)) return `低语指引你获得遗物`;
                }
                const gained = addTsrRunCurrency(100);
                return `低语消散，获得${gained}秘境币`;
            }
        },
        {
            name: '时空风暴',
            effect: () => {
                const keys = Object.keys(TSR_RUN_CONSUMABLES);
                const key = keys[Math.floor(Math.random() * keys.length)];
                addTsrConsumable(key);
                return `风暴留下${TSR_RUN_CONSUMABLES[key].name}`;
            }
        },
        {
            name: '熔炉余温',
            effect: () => {
                tsrHealPlayer(0.18);
                const gained = addTsrRunCurrency(70 + Math.floor(Math.random() * 50));
                return `余温治愈生命，获得${gained}秘境币`;
            }
        },
        {
            name: '竞技召唤',
            effect: () => {
                if (Math.random() > 0.4) {
                    addTempBuff({ name: '战意沸腾', effect: 'attack', value: 0.35, duration: 3, isDebuff: false });
                    return '战意沸腾！接下来3次行动攻击+35%';
                }
                applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
                return '挑战失败，受到8%生命值伤害';
            }
        },
        {
            name: '时光冥想',
            effect: () => {
                if (tsr.currentRun.timeLeft <= 25) return '时间不足，冥想失败';
                tsr.currentRun.timeLeft -= 22;
                tsrHealPlayer(0.25);
                return '冥想恢复25%生命，消耗22秒';
            }
        },
        {
            name: '钉钉响了',
            effect: () => {
                tsr.currentRun.timeLeft -= 15;
                if (Math.random() < 0.55) {
                    const gained = addTsrRunCurrency(60 + Math.floor(Math.random() * 40));
                    return `「收到」！损失15秒但获得${gained}秘境币`;
                }
                applyDamage(bMul(tsr.currentRun.playerHealth, 0.05));
                return '其实是老板@你，-15秒并受到5%伤害';
            }
        },
        {
            name: '奶茶还是减肥',
            effect: () => {
                if (Math.random() < 0.5) {
                    tsrHealPlayer(0.15);
                    tsr.currentRun.timeLeft -= 10;
                    return '选了奶茶，快乐+15%生命，-10秒';
                }
                tsr.currentRun.timeLeft += 20;
                addTempBuff({ name: '自律光环', effect: 'attack', value: 0.2, duration: 3, isDebuff: false });
                return '选了减肥，+20秒并攻击+20%×3';
            }
        },
        {
            name: '群聊已读不回',
            effect: () => {
                const t = Math.random() < 0.5 ? 25 : -18;
                tsr.currentRun.timeLeft += t;
                return `时间${t > 0 ? '增加' : '减少'}了${Math.abs(t)}秒（心理伤害不计入）`;
            }
        },
        {
            name: '神秘漂流瓶',
            effect: () => {
                const roll = Math.random();
                if (roll < 0.35) { addTsrConsumable('timeCapsule'); return '瓶中是时光胶囊！'; }
                if (roll < 0.6) { tsr.currentRun.timeLeft += 30; return '瓶中传来:+30秒'; }
                applyDamage(bMul(tsr.currentRun.playerHealth, 0.06));
                return '瓶中是诅咒纸条，-6%生命';
            }
        },
        {
            name: '时光回音',
            effect: () => {
                chargeTsrSpirit(15);
                tsr.currentRun.timeLeft += 12;
                return '回音带来灵息+15，+12秒';
            }
        },
        {
            name: '秘境赌石',
            effect: () => {
                if (tsr.currentRun.currencyEarned < 50) return '秘境币不足50，赌石失败';
                tsr.currentRun.currencyEarned -= 50;
                if (Math.random() < 0.45) {
                    const g = addTsrRunCurrency(180);
                    return `赌石成功！获得${g}秘境币`;
                }
                return '赌石失败，50币打了水漂';
            }
        },
        {
            name: '流浪商人',
            effect: () => {
                const items = ['monsterBait', 'ironShield', 'chaosDice', 'spiritSnack', 'flashBomb', 'starEssence'];
                addTsrConsumable(items[Math.floor(Math.random() * items.length)]);
                return '商人留下一件奇物';
            }
        },
        {
            name: '灵脉共鸣',
            effect: () => {
                chargeTsrSpirit(35);
                addTsrSpiritExp(Math.floor(45 * getTsrSpiritRoomMult()));
                return `${getTsrSpiritDisplayName()}与灵脉共鸣，充能+35，经验+45`;
            }
        },
        {
            name: '精灵低语',
            effect: () => {
                if (Math.random() < 0.55) {
                    addTsrSpiritBond(6);
                    tsr.currentRun.timeLeft += 18;
                    return '精灵低语带来启示：亲密度+6，+18秒';
                }
                addTsrSpiritExp(Math.floor(60 * getTsrSpiritRoomMult()));
                return '低语化为经验+60';
            }
        },
        {
            name: '超越之风',
            effect: () => {
                addTempBuff({ name: '超越之风', effect: 'attack', value: 0.22, duration: 4, isDebuff: false });
                tsr.currentRun.timeLeft -= 8;
                return '超越之风加持攻击+22%×4，-8秒';
            }
        },
        {
            name: '终焉预兆',
            effect: () => {
                if (Math.random() < 0.4) {
                    const g = addTsrRunCurrency(Math.floor(200 * (tsr.currentRun.difficultyMultiplier || 1)));
                    return `终焉预兆带来${g}秘境币`;
                }
                applyDamage(bMul(tsr.currentRun.playerHealth, 0.07));
                chargeTsrSpirit(25);
                return '预兆反噬-7%生命，但精灵充能+25';
            }
        },
        {
            name: '战前演武',
            effect: () => {
                tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + 0.2;
                addTempBuff({ name: '演武战意', effect: 'attack', value: 0.15, duration: 2, isDebuff: false });
                return '下一场战斗奖励+20%，攻击+15%×2';
            }
        },
        {
            name: '怪物踪迹',
            effect: () => {
                if (Math.random() < 0.55) {
                    tsr.currentRun.nextEliteRelicBoost = 0.15;
                    return '发现精英踪迹！下场精英遗物掉落+15%';
                }
                applyDamage(bMul(tsr.currentRun.playerHealth, 0.05));
                return '踪迹是陷阱！-5%生命';
            }
        },
        {
            name: '战阵残卷',
            effect: () => {
                const keys = Object.keys(TSR_BATTLE_TACTICS);
                const key = keys[Math.floor(Math.random() * keys.length)];
                tsr.currentRun.battleTacticKey = key;
                tsr.currentRun.warArchiveBattlesLeft = 1;
                const t = TSR_BATTLE_TACTICS[key];
                return `拾得残卷，下一场战斗自动启用「${t.name}」`;
            }
        },
        {
            name: '连击鼓点',
            effect: () => {
                tsr.currentRun.battleWinStreak = (tsr.currentRun.battleWinStreak || 0) + 1;
                chargeTsrSpirit(10);
                return `战鼓擂动！战斗连击+1（现×${tsr.currentRun.battleWinStreak}），精灵充能+10%`;
            }
        },
        {
            name: '迷你遭遇战',
            effect: () => {
                tsr.currentRun.pendingMiniBattle = true;
                return '遭遇战一触即发！下步将转入战斗';
            }
        }
    ];

    if ((ensureTsrSpiritPet()?.evolution || 0) >= getTsrSpiritMaxEvolution()) {
        events.push(
            {
                name: '星灵祝福',
                effect: () => {
                    chargeTsrSpirit(100);
                    addTsrSpiritBond(8);
                    return `${getTsrSpiritDisplayName()}降下星灵祝福，满充能觉醒，亲密度+8`;
                }
            },
            {
                name: '万灵归一',
                effect: () => {
                    addTsrSpiritExp(Math.floor(100 * getTsrSpiritRoomMult()));
                    tsr.currentRun.timeLeft += 25;
                    return '万灵共鸣，经验+100，+25秒';
                }
            },
            {
                name: '终焉星辉',
                effect: () => {
                    tsrHealPlayer(0.18);
                    addTempBuff({ name: '星辉加护', effect: 'attack', value: 0.2, duration: 4, isDebuff: false });
                    return '星辉加护！回血18%，攻击+20%×4';
                }
            }
        );
    }

    if (Math.random() < 0.32) {
        handleInteractiveEventRoom();
        return;
    }
    
    const event = events[Math.floor(Math.random() * events.length)];
    const result = event.effect();
    addTsrLog(`事件: ${event.name} - ${result}`);
    // 「迷你遭遇战」曾只打标记不强制开战，导致探索结束却无法继续
    if (tsr.currentRun.pendingMiniBattle) {
        tsr.currentRun.pendingMiniBattle = false;
        const floor = tsr.currentRun.currentFloor;
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        tsr.currentRun.currentRoom = {
            type: 'battle', name: '迷你遭遇战', explored: true, hasTrap: false,
            trap: null, trapDetected: false, trapDisarmed: false,
            isBoss: false, isElite: false, isShrine: false,
            rewards: generateRoomRewards('battle', dm),
            monster: pickTsrMonster(false, false, floor, dm),
            battleCleared: false
        };
        handleBattleRoom();
        return;
    }
    afterAction();
}

function handleInteractiveEventRoom() {
    const tsr = player.timeSecretRealm;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const eventBonus = getTsrEventBonus();
    const pool = [
        {
            title: '🎭 时光剧场',
            desc: '舞台上传来声音：「选个角色吧，每个都有代价。」',
            choices: [
                { label: '勇者 · 攻击+30%×3', fn: () => { addTempBuff({ name: '勇者之魂', effect: 'attack', value: 0.3, duration: 3, isDebuff: false }); return '获得勇者之魂'; } },
                { label: '盗贼 · +100币 -10秒', fn: () => { tsr.currentRun.timeLeft -= 10; const g = addTsrRunCurrency(Math.floor(100 * dm * (1 + eventBonus))); return `+${g}币，-10秒`; } },
                { label: '隐士 · +35秒', fn: () => { tsr.currentRun.timeLeft += 35; return '+35秒'; } }
            ]
        },
        {
            title: '🔮 命运三岔口',
            desc: '三条道路在迷雾中浮现，你只能选一条。',
            choices: [
                { label: '金币之路', fn: () => { const g = addTsrRunCurrency(Math.floor(90 * dm)); return `+${g}秘境币`; } },
                { label: '荆棘之路', fn: () => { applyDamage(bMul(tsr.currentRun.playerHealth, 0.08)); addTempBuff({ name: '荆棘之力', effect: 'attack', value: 0.4, duration: 3, isDebuff: false }); return '8%伤害换攻击+40%'; } },
                { label: '迷雾之路', fn: () => { if (Math.random() < 0.5) { tsr.currentRun.timeLeft += 40; return '+40秒'; } tsr.currentRun.timeLeft -= 20; return '-20秒（迷雾捉弄）'; } }
            ]
        },
        {
            title: '👻 幽灵委托',
            desc: '幽灵飘到你面前：「帮我完成一个KPI……不对，一个委托。」',
            choices: [
                { label: '接受 · 精英战', fn: () => { tsr.currentRun.pendingGhostHunt = true; return 'pending'; } },
                { label: '拒绝 · +20秒', fn: () => { tsr.currentRun.timeLeft += 20; return '+20秒'; } },
                { label: '超度 · -15秒 +60币', fn: () => { tsr.currentRun.timeLeft -= 15; const g = addTsrRunCurrency(Math.floor(60 * dm)); return `+${g}币`; } }
            ]
        },
        {
            title: '🌊 时光潮汐',
            desc: '潮水涌来，带走或送来什么，全看你的选择。',
            choices: [
                { label: '顺流 · +50秒 -80币', fn: () => {
                    tsr.currentRun.timeLeft += 50;
                    tsr.currentRun.currencyEarned = Math.max(0, tsr.currentRun.currencyEarned - 80);
                    return '+50秒，-80币';
                } },
                { label: '逆流 · +120币 -25秒', fn: () => {
                    tsr.currentRun.timeLeft -= 25;
                    const g = addTsrRunCurrency(Math.floor(120 * dm));
                    return `+${g}币，-25秒`;
                } },
                { label: '观潮 · 随机遗物机会', fn: () => {
                    if (Math.random() < 0.35 && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
                        const pick = rollTsrRelicChoices(1)[0];
                        if (pick) { addTsrRelic(pick); return '获得遗物'; }
                    }
                    return '什么也没捞到';
                } }
            ]
        },
        {
            title: '⚡ 异兽突袭',
            desc: '地面震动，一只高阶异兽从裂隙中跃出！',
            choices: [
                { label: '正面迎战 · 稀有精英', fn: () => { tsr.currentRun.pendingRareHunt = true; return 'pendingRare'; } },
                { label: '设陷阱 · -20秒 +90币', fn: () => {
                    tsr.currentRun.timeLeft -= 20;
                    const g = addTsrRunCurrency(Math.floor(90 * dm));
                    return `+${g}币`;
                } },
                { label: '逃跑 · -8%血', fn: () => {
                    applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
                    return '8%伤害';
                } }
            ]
        },
        {
            title: '🧚 精灵记忆碎片',
            desc: `${getTsrSpiritDisplayName()}触碰一块发光碎片，过往记忆涌来……`,
            choices: [
                { label: '温馨回忆 · 亲密度+8 回血15%', fn: () => {
                    addTsrSpiritBond(8);
                    tsrHealPlayer(0.15);
                    return '亲密度+8，回血15%';
                } },
                { label: '战斗记忆 · 攻击+25%×3', fn: () => {
                    addTempBuff({ name: '战斗记忆', effect: 'attack', value: 0.25, duration: 3, isDebuff: false });
                    chargeTsrSpirit(20);
                    return '攻击+25%×3，充能+20';
                } },
                { label: '封存碎片 · +90币', fn: () => {
                    const g = addTsrRunCurrency(Math.floor(90 * dm));
                    return `+${g}秘境币`;
                } }
            ]
        },
        {
            title: '💫 灵宠契约抉择',
            desc: '精灵提议签订临时契约，三种力量供你选择（本局有效）。',
            choices: [
                { label: '战之契 · 灵击+50% 反击-8%', fn: () => {
                    tsr.currentRun.spiritPactCombat = { strikeMult: 1.5, counterReduce: 0.08 };
                    chargeTsrSpirit(30);
                    return '战之契生效';
                } },
                { label: '时之契 · 每层+6秒', fn: () => {
                    tsr.currentRun.spiritPactTime = 6;
                    addTsrSpiritBond(5);
                    return '时之契生效';
                } },
                { label: '财之契 · 币收益+12%', fn: () => {
                    tsr.currentRun.spiritPactCurrency = 0.12;
                    addTsrSpiritExp(50);
                    return '财之契生效';
                } }
            ]
        },
        {
            title: '🏮 灵脉商贩',
            desc: '商贩只认灵力交易者：「有羁绊，就有折扣。」',
            choices: [
                { label: '以羁绊换币 · -6亲密度 +100×难度币', fn: () => {
                    if ((ensureTsrSpiritPet().bond || 0) < 8) return '亲密度不足8';
                    addTsrSpiritBond(-6);
                    const g = addTsrRunCurrency(Math.floor(100 * dm));
                    return `+${g}秘境币`;
                } },
                { label: '灵食礼包 · -40币 充能+55', fn: () => {
                    if (tsr.currentRun.currencyEarned < 40) return '币不足';
                    tsr.currentRun.currencyEarned -= 40;
                    chargeTsrSpirit(55);
                    return '充能+55';
                } },
                { label: '离开', fn: () => { tsr.currentRun.timeLeft += 5; return '+5秒'; } }
            ]
        },
        {
            title: '👑 霸主信标',
            desc: '远处传来灵域霸主的信标波动，精灵明显紧张起来。',
            choices: [
                { label: '响应信标 · 50%霸主战或-8%血', fn: () => {
                    if (Math.random() < 0.5) return 'pendingBoss';
                    applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
                    return '8%伤害';
                } },
                { label: '屏蔽信标 · +25秒', fn: () => { tsr.currentRun.timeLeft += 25; return '+25秒'; } },
                { label: '研究信标 · 预览2层 经验+70', fn: () => {
                    tsr.currentRun.oraclePreview = 2;
                    updateTsrRoomPreview();
                    addTsrSpiritExp(Math.floor(70 * getTsrSpiritRoomMult()));
                    return '预览2层，经验+70';
                } }
            ]
        },
        {
            title: '⚒️ 灵锻余火',
            desc: '一处未熄灭的灵锻余火，可淬炼临时战意。',
            choices: [
                { label: '淬灵刃 · 灵击+30%×4层', fn: () => {
                    tsr.currentRun.spiritPactCombat = tsr.currentRun.spiritPactCombat || {};
                    tsr.currentRun.spiritPactCombat.strikeMult = (tsr.currentRun.spiritPactCombat.strikeMult || 1) * 1.3;
                    tsr.currentRun.spiritPactCombat.strikeFloors = (tsr.currentRun.spiritPactCombat.strikeFloors || 0) + 4;
                    return '灵击+30%×4层';
                } },
                { label: '淬灵盾 · 反击-8%×4层', fn: () => {
                    tsr.currentRun.spiritPactCombat = tsr.currentRun.spiritPactCombat || {};
                    tsr.currentRun.spiritPactCombat.counterReduce = (tsr.currentRun.spiritPactCombat.counterReduce || 0) + 0.08;
                    tsr.currentRun.spiritPactCombat.armorFloors = (tsr.currentRun.spiritPactCombat.armorFloors || 0) + 4;
                    return '反击-8%×4层';
                } },
                { label: '离开', fn: () => { tsr.currentRun.timeLeft += 8; return '+8秒'; } }
            ]
        }
    ];
    const ev = pool[Math.floor(Math.random() * pool.length)];
    tsr.currentRun.pendingInteractiveEvent = ev;
    showTsrMemePanel(ev.title, ev.desc,
        ev.choices.map((c, i) =>
            `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrResolveInteractiveEvent(${i})">${c.label}</button>`
        ).join(''));
    addTsrLog(`互动事件：${ev.title}`, 'info');
}

function tsrResolveInteractiveEvent(choiceIdx) {
    const tsr = player.timeSecretRealm;
    const ev = tsr.currentRun.pendingInteractiveEvent;
    if (!ev) { hideTsrChoicePanels(); return; }
    if (tsr.currentRun._interactiveResolving) return;
    tsr.currentRun._interactiveResolving = true;
    tsr.currentRun.pendingInteractiveEvent = null;
    armTsrExitClickGuard(1000);
    const choice = ev.choices[choiceIdx];
    // 延后收起与结算，避免同一次点击穿透到撤离 / 探索
    setTimeout(() => {
        const run = player.timeSecretRealm?.currentRun;
        if (!run) return;
        run._interactiveResolving = false;
        if (!run.isActive) return;
        hideTsrChoicePanels();
        if (!choice) return;
        const result = choice.fn();
        tsrResolveInteractiveEventAftermath(result);
    }, 60);
}

function tsrResolveInteractiveEventAftermath(result) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    if (result === 'pending') {
        addTsrLog('幽灵委托：精英怪出现了！', 'warning');
        tsr.currentRun.currentRoom = {
            type: 'elite', name: '幽灵委托', explored: true, hasTrap: false,
            trap: null, trapDetected: false, trapDisarmed: false,
            isBoss: false, isElite: true, isShrine: false,
            rewards: generateRoomRewards('elite', tsr.currentRun.difficultyMultiplier),
            monster: pickTsrMonster(false, true, tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier)
        };
        armTsrExitClickGuard(1200);
        handleBattleRoom({ forceElite: true });
        return;
    }
    if (result === 'pendingRare') {
        addTsrLog('异兽突袭！稀有精英出现！', 'warning');
        const monster = pickTsrMonsterMinTier(false, true, 'rare', tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
        tsr.currentRun.currentRoom = {
            type: 'elite', name: '异兽突袭', explored: true, hasTrap: false,
            trap: null, trapDetected: false, trapDisarmed: false,
            isBoss: false, isElite: true, isShrine: false,
            rewards: generateRoomRewards('elite', tsr.currentRun.difficultyMultiplier),
            monster
        };
        armTsrExitClickGuard(1200);
        handleBattleRoom({ forceElite: true });
        return;
    }
    if (result === 'pendingBoss') {
        addTsrLog('灵域霸主信标具象化！', 'warning');
        const floor = tsr.currentRun.currentFloor;
        const dm = tsr.currentRun.difficultyMultiplier;
        const boss = getTsrMonsterById('spiritsovereign');
        tsr.currentRun.currentRoom = {
            type: 'elite', name: '霸主信标', explored: true, hasTrap: false,
            trap: null, trapDetected: false, trapDisarmed: false,
            isBoss: false, isElite: true, isShrine: false, isSpiritBoss: true,
            rewards: generateRoomRewards('elite', dm),
            monster: boss || pickTsrMonsterMinTier(false, true, 'mythic', floor, dm)
        };
        tsr.currentRun.currentRoom.rewards.currency = Math.floor(tsr.currentRun.currentRoom.rewards.currency * 2.2);
        tsr.currentRun.spiritBossAssist = true;
        armTsrExitClickGuard(1200);
        handleBattleRoom({ forceElite: true });
        tsr.currentRun.spiritBossAssist = false;
        return;
    }
    addTsrLog(`事件结果：${result}`, 'success');
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    afterAction();
}

// 辅助函数：根据增益效果获取时间奖励
function getTimeBonusByEffect(effect) {
    switch(effect) {
        case 'attack': return 30;
        case 'health': return 60;
        case 'critRate': return 90;
        case 'critDamage': return 120;
        case 'speed': return 150;
        default: return 0;
    }
}
function handleTreasureRoom() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    
    let currency = room.rewards.currency;
    const treasureBonus = getTsrRelicBonus('treasureBonus');
    if (treasureBonus > 0) currency = Math.floor(currency * (1 + treasureBonus));
    const gained = addTsrRunCurrency(currency);
    addTsrLog(`打开了宝箱！获得${gained}秘境币${treasureBonus ? '（宝箱迷香加成）' : ''}`);
    
    if (Math.random() < 0.1 + treasureBonus * 0.08) {
        const rareCurrency = currency * 3;
        const rareGained = addTsrRunCurrency(rareCurrency);
        addTsrLog(`发现隐藏宝藏！额外获得${rareGained}秘境币`);
    }
    if (Math.random() < 0.12) {
        const keys = Object.keys(TSR_RUN_CONSUMABLES);
        addTsrConsumable(keys[Math.floor(Math.random() * keys.length)]);
        addTsrLog('宝箱里还有一件道具！', 'success');
    }
    tryDropTsrEquipment('宝箱', { isTreasure: true });
    afterAction();
}

function handleShrineRoom() {
    const tsr = player.timeSecretRealm;
    const blessings = [
        { name: '神龛祝福·攻击', effect: 'attack', value: 0.35, timeBonus: 40 },
        { name: '神龛祝福·生命', effect: 'health', value: 0.35, timeBonus: 50 },
        { name: '神龛祝福·幸运', effect: 'luck', value: 1, timeBonus: 0 },
        { name: '神龛祝福·时间', effect: 'speed', value: 8, timeBonus: 60 }
    ];
    const pick = blessings[Math.floor(Math.random() * blessings.length)];
    addTempBuff({ ...pick, duration: 0, isDebuff: false });
    const timeGift = 15 + Math.floor(Math.random() * 15);
    tsr.currentRun.timeLeft += timeGift;
    addTsrLog(`神龛恩赐：${pick.name}，并额外获得${timeGift}秒`, 'success');
    afterAction();
}

function handlePortalRoom(opts) {
    opts = opts || {};
    const panel = ensureTsrStaticChoicePanelHtml('tsrPortalPanel');
    if (panel) panel.style.display = 'block';
    if (!opts.silent) addTsrLog('抵达时光岔路，请选择前进方向', 'info');
}

function tsrChoosePortal(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'portal' || !room.explored || room.choiceResolved || tsr.currentRun._choiceResolving) return;
    room.choiceResolved = true;
    tsr.currentRun._choiceResolving = true;
    deferTsrChoiceResolve(() => {
        const run = player.timeSecretRealm?.currentRun;
        if (!run) return;
        run._choiceResolving = false;
        if (!run.isActive) return;
        hideTsrChoicePanels();
        if (path === 'safe') {
            run.timeLeft += 45;
            const gained = addTsrRunCurrency(55 + Math.floor(Math.random() * 55));
            addTsrLog(`选择安全之路：+45秒，获得${gained}秘境币`, 'success');
            afterAction();
            return;
        }
        const curRoom = run.currentRoom;
        if (!curRoom) return;
        curRoom.rewards = generateRoomRewards('battle', run.difficultyMultiplier);
        armTsrExitClickGuard(1200);
        handleBattleRoom({ portalRisky: true, forceElite: true });
    });
}

function handleRelicRoom() {
    const tsr = player.timeSecretRealm;
    const maxHint = document.getElementById('tsrRelicMaxHint');
    if (maxHint) maxHint.textContent = String(getTsrRelicMax());
    const panel = document.getElementById('tsrRelicPickPanel');
    const container = document.getElementById('tsrRelicPickOptions');
    if (!panel || !container) return;
    if ((tsr.currentRun.relics || []).length >= getTsrRelicMax()) {
        addTsrLog(`遗物栏已满（${getTsrRelicMax()}个），祭坛化为秘境币`, 'warning');
        addTsrRunCurrency(120);
        afterAction();
        return;
    }
    const choices = rollTsrRelicChoices(getTsrRelicPickCount());
    if (!choices.length) {
        addTsrRunCurrency(80);
        addTsrLog('没有可选择的遗物，获得80秘境币', 'warning');
        afterAction();
        return;
    }
    tsr.currentRun.relicChoices = choices;
    container.innerHTML = choices.map((key, idx) => {
        const r = TSR_RELIC_POOL[key];
        return `<div class="tsr-relic-option" onclick="tsrPickRelic(${idx})">
            <strong>${r.icon} ${r.name}</strong>
            <div style="color:#c4b5fd;margin-top:4px;font-size:12px;">${r.desc}</div>
        </div>`;
    }).join('');
    panel.style.display = 'block';
    addTsrLog('遗物祭坛苏醒，请选择一件遗物', 'info');
}

function tsrPickRelic(index) {
    const tsr = player.timeSecretRealm;
    const run = tsr.currentRun;
    if (!run?.isActive || run._choiceResolving) return;
    const room = run.currentRoom;
    const choices = run.relicChoices || [];
    const key = choices[index];
    if (room) room.choiceResolved = true;
    run._choiceResolving = true;
    deferTsrChoiceResolve(() => {
        const r = player.timeSecretRealm?.currentRun;
        if (!r) return;
        r._choiceResolving = false;
        if (!r.isActive) return;
        hideTsrChoicePanels();
        if (key) addTsrRelic(key);
        r.relicChoices = null;
        afterAction();
    });
}

function handleMysteryRoom(opts) {
    opts = opts || {};
    const panel = ensureTsrStaticChoicePanelHtml('tsrMysteryPanel');
    if (panel) panel.style.display = 'block';
    if (!opts.silent) addTsrLog('谜题祭坛苏醒：智慧、勇气、贪婪，择一而行', 'info');
}

function tsrChooseMystery(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'mystery' || !room.explored || room.choiceResolved || tsr.currentRun._choiceResolving) return;
    room.choiceResolved = true;
    tsr.currentRun._choiceResolving = true;
    deferTsrChoiceResolve(() => {
        const run = player.timeSecretRealm?.currentRun;
        if (!run) return;
        run._choiceResolving = false;
        if (!run.isActive) return;
        hideTsrChoicePanels();
        const curRoom = run.currentRoom;
        const mult = run.difficultyMultiplier || 1;
        if (path === 'wisdom') {
            const buff = getRandomTempBuff();
            if (!buff.timeBonus) buff.timeBonus = getTimeBonusByEffect(buff.effect);
            addTempBuff(buff);
            run.timeLeft += 20;
            addTsrLog(`智慧之路：获得${buff.name}并+20秒`, 'success');
        } else if (path === 'courage') {
            if (curRoom) curRoom.rewards = generateRoomRewards('elite', mult);
            armTsrExitClickGuard(1200);
            handleBattleRoom({ forceElite: true });
            return;
        } else if (path === 'greed') {
            const gained = addTsrRunCurrency(Math.floor(90 * mult));
            applyDamage(bMul(run.playerHealth, 0.08));
            addTsrLog(`贪婪之路：获得${gained}秘境币，但受到8%生命伤害`, 'warning');
            if (bLteZero(run.playerHealth) || !run.isActive) return;
        }
        afterAction();
    });
}

function handleVaultRoom(opts) {
    opts = opts || {};
    const panel = ensureTsrStaticChoicePanelHtml('tsrVaultPanel');
    if (panel) panel.style.display = 'block';
    if (!opts.silent) addTsrLog('时之宝库开启：时间可与财富互换', 'info');
}

function tsrChooseVault(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'vault' || !room.explored || room.choiceResolved || tsr.currentRun._choiceResolving) return;
    const vaultMult = 1 + getTsrPermanentVaultBonus();
    if (path === 'buyTime') {
        const cost = 80;
        if (tsr.currentRun.currencyEarned < cost) {
            addTsrLog(`秘境币不足，需要${cost}秘境币`, 'warning');
            handleVaultRoom({ silent: true });
            return;
        }
    } else if (path === 'sellTime') {
        if (tsr.currentRun.timeLeft <= 50) {
            addTsrLog('剩余时间不足，无法出售时间', 'warning');
            handleVaultRoom({ silent: true });
            return;
        }
    } else if (path === 'gamble') {
        if (tsr.currentRun.timeLeft <= 35) {
            addTsrLog('剩余时间不足，无法博弈', 'warning');
            handleVaultRoom({ silent: true });
            return;
        }
    } else {
        return;
    }
    room.choiceResolved = true;
    tsr.currentRun._choiceResolving = true;
    deferTsrChoiceResolve(() => {
        const run = player.timeSecretRealm?.currentRun;
        if (!run) return;
        run._choiceResolving = false;
        if (!run.isActive) return;
        hideTsrChoicePanels();
        if (path === 'buyTime') {
            const cost = 80;
            run.currencyEarned -= cost;
            const timeGain = Math.floor(50 * vaultMult);
            run.timeLeft += timeGain;
            addTsrLog(`以${cost}秘境币换取${timeGain}秒`, 'success');
        } else if (path === 'sellTime') {
            run.timeLeft -= 40;
            const gained = addTsrRunCurrency(Math.floor(100 * vaultMult));
            addTsrLog(`出售40秒，获得${gained}秘境币`, 'success');
        } else if (path === 'gamble') {
            run.timeLeft -= 30;
            if (Math.random() < 0.5) {
                const gained = addTsrRunCurrency(Math.floor(180 * vaultMult));
                run.timeLeft += Math.floor(25 * vaultMult);
                addTsrLog(`宝库博弈大胜！获得${gained}秘境币并+${Math.floor(25 * vaultMult)}秒`, 'success');
            } else {
                run.currencyEarned = Math.max(0, run.currencyEarned - 50);
                addTsrLog('宝库博弈失败！损失50秘境币', 'error');
            }
        }
        if (run.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
        else afterAction();
    });
}

function handleTsrMemeRoom(type) {
    switch (type) {
        case 'ppt': handlePptRoom(); break;
        case 'client': handleClientRoom(); break;
        case 'pdd': handlePddRoom(); break;
        case 'recall': handleRecallRoom(); break;
        case 'kpi': handleKpiRoom(); break;
        case 'weekly': handleWeeklyRoom(); break;
        case 'blinddate': handleBlinddateRoom(); break;
        case 'overtime996': handleOvertime996Room(); break;
        case 'lottery': handleLotteryRoom(); break;
        case 'standup': handleStandupRoom(); break;
        case 'gacha': handleGachaRoom(); break;
        case 'escape': handleEscapeRoom(); break;
        case 'auction': handleAuctionRoom(); break;
        case 'gamblersden': handleGamblersdenRoom(); break;
        case 'codereview': handleCodereviewRoom(); break;
        case 'standup996': handleStandup996Room(); break;
        case 'retrospective': handleRetrospectiveRoom(); break;
        case 'interview': handleInterviewRoom(); break;
        case 'perfreview': handlePerfreviewRoom(); break;
        case 'teamBuilding': handleTeamBuildingRoom(); break;
        case 'layoff': handleLayoffRoom(); break;
        case 'okrreview': handleOkrreviewRoom(); break;
        case 'pitchdeck': handlePitchdeckRoom(); break;
        case 'meetingmarathon': handleMeetingmarathonRoom(); break;
        case 'slackoutage': handleSlackoutageRoom(); break;
        case 'hotfix911': handleHotfix911Room(); break;
        default:
            if (typeof handleTsrGenericContentRoom === 'function') handleTsrGenericContentRoom(type);
            break;
    }
}

function handleTsrSpecialRoom(type) {
    switch (type) {
        case 'oracle': handleOracleRoom(); break;
        case 'fusion': handleFusionRoom(); break;
        case 'timebank': handleTimebankRoom(); break;
        case 'spiritgarden': handleSpiritGardenRoom(); break;
        case 'spiritsanctuary': handleSpiritSanctuaryRoom(); break;
        case 'spirittrial': handleSpiritTrialRoom(); break;
        case 'monsterhunt': handleMonsterHuntRoom(); break;
        case 'roulette': handleRouletteRoom(); break;
        case 'vending': handleVendingRoom(); break;
        case 'phantom': handlePhantomRoom(); break;
        case 'shrineduel': handleShrineduelRoom(); break;
        case 'beastlair': handleBeastlairRoom(); break;
        case 'spiritwell': handleSpiritWellRoom(); break;
        case 'spiritrift': handleSpiritRiftRoom(); break;
        case 'spiritmemory': handleSpiritMemoryRoom(); break;
        case 'spiritbazaar': handleSpiritBazaarRoom(); break;
        case 'spiritboss': handleSpiritBossRoom(); break;
        case 'spiritoracle': handleSpiritOracleRoom(); break;
        case 'spiritforge': handleSpiritForgeRoom(); break;
        case 'spiritarena': handleSpiritArenaRoom(); break;
        case 'spiritnexus': handleSpiritNexusRoom(); break;
        case 'spiritcodex': handleSpiritCodexRoom(); break;
        case 'spiritascend': handleSpiritAscendRoom(); break;
        case 'spiritstar': handleSpiritStarRoom(); break;
        case 'spiritthrone': handleSpiritThroneRoom(); break;
        case 'starfall': handleStarfallRoom(); break;
        case 'spiritduel': handleSpiritDuelRoom(); break;
        case 'celestialvault': handleCelestialVaultRoom(); break;
        case 'timewarp': handleTimewarpRoom(); break;
        case 'tyrantcourt': handleTyrantCourtRoom(); break;
        case 'spiritparade': handleSpiritParadeRoom(); break;
        case 'voidrift': handleVoidriftRoom(); break;
        case 'affixforge': handleAffixForgeRoom(); break;
        case 'affixhunt': handleAffixHuntRoom(); break;
        case 'relicaltar': handleRelicAltarRoom(); break;
        case 'bondsanctuary': handleBondSanctuaryRoom(); break;
        case 'championhall': handleChampionHallRoom(); break;
        case 'synergyshrine': handleSynergyShrineRoom(); break;
        case 'fortunewheel': handleFortuneWheelRoom(); break;
        case 'legendarchive': handleLegendArchiveRoom(); break;
        case 'chronolibrary': handleChronolibraryRoom(); break;
        case 'starwishpool': handleStarwishpoolRoom(); break;
        case 'mirrormaze': handleMirrormazeRoom(); break;
        case 'runescriptorium': handleRunescriptoriumRoom(); break;
        case 'timeloom': handleTimeloomRoom(); break;
        case 'combostorm': handleCombostormRoom(); break;
        case 'battlerift': handleBattleriftRoom(); break;
        case 'wararchive': handleWararchiveRoom(); break;
        case 'bloodarena': handleBloodarenaRoom(); break;
        case 'doomclock': handleDoomclockRoom(); break;
        case 'elementaltrial': handleElementaltrialRoom(); break;
        case 'necronomicon': handleNecronomiconRoom(); break;
        case 'stormnexus': handleStormnexusRoom(); break;
        case 'paradoxgate': handleParadoxgateRoom(); break;
        case 'chromaticshrine': handleChromaticshrineRoom(); break;
        case 'voidecho': handleVoidechoRoom(); break;
        case 'cataclysmgate': handleCataclysmgateRoom(); break;
        default:
            if (typeof handleTsrGenericContentRoom === 'function') handleTsrGenericContentRoom(type);
            break;
    }
}

function handleSpiritTrialRoom() {
    const sp = ensureTsrSpiritPet();
    if (sp.level < 5) {
        addTsrLog('灵力不足，试炼官让你先培养精灵到5级', 'warning');
        finishTsrMemeRoom();
        return;
    }
    const intro = TSR_SPIRIT_TRIAL_LINES.intro[Math.floor(Math.random() * TSR_SPIRIT_TRIAL_LINES.intro.length)];
    showTsrMemePanel('⚔️ 精灵试炼厅', intro,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritTrial('fight')">接受试炼 · 精英战</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritTrial('study')">观摩感悟 · 经验+80</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="tsrChooseSpiritTrial('retreat')">暂避锋芒 · 撤退</button>`);
    addTsrLog('精灵试炼厅：灵压让人头皮发麻', 'info');
}

function tsrChooseSpiritTrial(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spirittrial' || !room.explored) return;
    const sp = ensureTsrSpiritPet();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'fight') {
        room.isSpiritTrial = true;
        room.isElite = true;
        room.monster = {
            id: 'trialmirror', name: '试炼镜像', icon: '🪞', tier: 'rare',
            intro: '「我是你们羁绊的倒影，打赢我就证明你配驭灵。」',
            win: '镜像碎裂，灵脉认可你的羁绊。',
            skill: 'burst', skillChance: 0.32
        };
        room.rewards = {
            currency: Math.floor(130 * dm * (1 + sp.level * 0.02)),
            buffChance: 0.55
        };
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
    } else if (path === 'study') {
        if (tsr.currentRun.timeLeft <= 28) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 25;
        addTsrSpiritExp(Math.floor(80 * getTsrSpiritRoomMult()));
        addTsrSpiritBond(4);
        addTsrLog('观摩试炼碑，灵悟+80经验', 'success');
    } else if (path === 'retreat') {
        tsr.currentRun.timeLeft += 8;
        addTsrLog('你选择撤退，保留了8秒时光', 'info');
    }
    finishTsrMemeRoom();
}

function handleSpiritSanctuaryRoom() {
    showTsrMemePanel('🏛️ 精灵圣殿', '圣殿中央的灵脉石碑闪烁微光，精灵低声呢喃：「选一条路吧。」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritSanctuary('insight')">灵脉感悟 · 经验+200</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritSanctuary('bless')">圣光祝福 · 满充能+回血</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritSanctuary('skill')">天赋启迪 · +1技能点</button>`);
    addTsrLog('精灵圣殿：空气里都是灵力碎屑', 'info');
}

function tsrChooseSpiritSanctuary(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritsanctuary' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'insight') {
        if (tsr.currentRun.timeLeft <= 35) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 30;
        addTsrSpiritExp(Math.floor(200 * getTsrSpiritRoomMult()));
        addTsrSpiritBond(8);
        addTsrLog('灵脉感悟成功！经验+200，亲密度+8', 'success');
    } else if (path === 'bless') {
        tsrHealPlayer(0.35);
        chargeTsrSpirit(100);
        tsr.currentRun.timeLeft += 15;
        addTsrLog('圣光祝福！大幅回血并瞬间充满精灵充能', 'success');
    } else if (path === 'skill') {
        const sp = ensureTsrSpiritPet();
        sp.skillPoints = (sp.skillPoints || 0) + 1;
        addTsrSpiritBond(5);
        addTsrLog('天赋启迪！获得1灵脉技能点', 'success');
        invalidateTsrUiCache('spirit');
    }
    finishTsrMemeRoom();
}

function handleSpiritGardenRoom() {
    showTsrMemePanel('🌸 精灵花园', '时光精灵在星露花海中起舞，你想做些什么？',
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritGarden('pet')">轻抚精灵 · 经验+120</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritGarden('harvest')">采集星露 · 秘境币</button>
         <button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritGarden('resonate')">共鸣充能 · 精灵充能+60%</button>`);
    addTsrLog('精灵花园：花香让时光变得柔软', 'info');
}

function tsrChooseSpiritGarden(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritgarden' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'pet') {
        if (tsr.currentRun.timeLeft <= 25) { addTsrLog('时间不够陪伴精灵了', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 22;
        addTsrSpiritExp(Math.floor(120 * getTsrSpiritRoomMult()));
        addTsrSpiritBond(5);
        addTsrLog('精灵开心地绕着你飞了一圈！经验+120，亲密度+5', 'success');
    } else if (path === 'harvest') {
        const gained = addTsrRunCurrency(Math.floor(110 * dm * (1 + getTsrSpiritBonuses().currencyBonus)));
        addTsrSpiritExp(Math.floor(40 * getTsrSpiritRoomMult()));
        addTsrLog(`采集星露获得${gained}秘境币，精灵也分到一点经验`, 'success');
    } else if (path === 'resonate') {
        chargeTsrSpirit(60);
        addTsrSpiritBond(3);
        addTsrLog('与精灵共鸣，充能大幅提升！', 'success');
    }
    finishTsrMemeRoom();
}

function handleSpiritWellRoom() {
    const sp = ensureTsrSpiritPet();
    showTsrMemePanel('💧 灵泉圣域', `${getTsrSpiritDisplayName()}在灵泉边盘旋：「这里的灵力很纯，选一种洗礼吧。」`,
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritWell('bath')">灵泉沐浴 · 满血+满充能</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritWell('exp')">灵脉浸润 · 经验+180</button>
         <button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritWell('bond')">羁绊之泉 · 亲密度+15</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog(`灵泉圣域：${getTsrSpiritDisplayName()} Lv${sp.level} 感到灵力共鸣`, 'info');
}

function tsrChooseSpiritWell(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritwell' || !room.explored) return;
    if (tsr.currentRun.timeLeft <= 28) { finishTsrMemeRoom(); return; }
    tsr.currentRun.timeLeft -= 25;
    if (path === 'bath') {
        tsr.currentRun.playerHealth = calculateTsrPlayerHealth();
        chargeTsrSpirit(100);
        tsr.currentRun.timeLeft += 20;
        addTsrLog('灵泉沐浴！生命回满、精灵充能满、+20秒', 'success');
    } else if (path === 'exp') {
        addTsrSpiritExp(Math.floor(180 * getTsrSpiritRoomMult()));
        chargeTsrSpirit(40);
        addTsrLog('灵脉浸润！经验+180，充能+40', 'success');
    } else if (path === 'bond') {
        addTsrSpiritBond(15);
        addTsrSpiritExp(Math.floor(60 * getTsrSpiritRoomMult()));
        addTsrLog('羁绊之泉！亲密度+15，经验+60', 'success');
    }
    updateHealthBar();
    finishTsrMemeRoom();
}

function handleSpiritRiftRoom() {
    const sp = ensureTsrSpiritPet();
    if (sp.level < 5) {
        addTsrLog('灵力不足，裂谷中的乱流过于危险（需精灵5级）', 'warning');
        finishTsrMemeRoom();
        return;
    }
    showTsrMemePanel('🌌 灵隙裂谷', '裂谷中灵力乱流翻涌，精灵提议与你协同作战。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritRift('fight')">协同作战 · 精英战（灵击×2）</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritRift('absorb')">吸收乱流 · 充能+80 攻击+20%×3</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">撤离</button>`);
    addTsrLog('灵隙裂谷：精灵灵压与乱流共振', 'warning');
}

function tsrChooseSpiritRift(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritrift' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'fight') {
        tsr.currentRun.spiritRiftAssist = true;
        room.monster = pickTsrMonsterMinTier(false, true, 'rare', tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
        room.isElite = true;
        room.rewards = generateRoomRewards('elite', tsr.currentRun.difficultyMultiplier);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.5);
        handleBattleRoom({ forceElite: true });
        tsr.currentRun.spiritRiftAssist = false;
        return;
    }
    if (path === 'absorb') {
        if (tsr.currentRun.timeLeft <= 30) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 22;
        chargeTsrSpirit(80);
        addTempBuff({ name: '乱流战意', effect: 'attack', value: 0.2, duration: 3, isDebuff: false });
        addTsrSpiritBond(6);
        addTsrLog('吸收乱流！充能+80，攻击+20%×3', 'success');
        finishTsrMemeRoom();
    } else {
        finishTsrMemeRoom();
    }
}

function handleSpiritMemoryRoom() {
    const sp = ensureTsrSpiritPet();
    const memories = [
        { title: '初遇之忆', desc: '「那天你第一次进入秘境，我还只是一团微光。」', bond: 6, exp: 50 },
        { title: '并肩之忆', desc: '「记得那次精英战吗？你快倒了，我拼尽灵力推了你一把。」', bond: 4, charge: 45 },
        { title: '进化之忆', desc: '「每次进化，我都更确信——你会走到时光尽头。」', bond: 8, exp: 90 }
    ];
    const mem = memories[Math.floor(Math.random() * memories.length)];
    tsr.currentRun.pendingSpiritMemory = mem;
    showTsrMemePanel('📿 记忆回廊 · ' + mem.title, mem.desc,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritMemory('embrace')">拥抱记忆 · 羁绊加深</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritMemory('learn')">汲取力量 · 战斗增益</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">走过</button>`);
    addTsrLog(`记忆回廊：${getTsrSpiritDisplayName()}停在某段回忆前（亲密度${sp.bond}）`, 'info');
}

function tsrChooseSpiritMemory(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    const mem = tsr.currentRun.pendingSpiritMemory;
    if (!room || room.type !== 'spiritmemory' || !room.explored || !mem) return;
    tsr.currentRun.pendingSpiritMemory = null;
    if (path === 'embrace') {
        addTsrSpiritBond(mem.bond || 5);
        if (mem.exp) addTsrSpiritExp(Math.floor(mem.exp * getTsrSpiritRoomMult()));
        if (mem.charge) chargeTsrSpirit(mem.charge);
        tsrHealPlayer(0.1);
        addTsrLog(`拥抱「${mem.title}」！亲密度+${mem.bond}，精灵与你更贴近了`, 'success');
    } else if (path === 'learn') {
        const combat = getTsrSpiritCombatBonuses();
        addTempBuff({ name: '记忆战意', effect: 'attack', value: combat.attackBonus * 1.2, duration: 4, isDebuff: false });
        chargeTsrSpirit(35);
        addTsrSpiritExp(Math.floor(40 * getTsrSpiritRoomMult()));
        addTsrLog('汲取记忆力量！攻击提升4回合，充能+35', 'success');
    }
    finishTsrMemeRoom();
}

function handleSpiritBazaarRoom() {
    const sp = ensureTsrSpiritPet();
    showTsrMemePanel('🏮 灵脉集市', `商贩打量着${getTsrSpiritDisplayName()}：「羁绊${sp.bond}，有好货给你。」`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritBazaar('trade')">以亲密度换币 · -8羁绊 +120×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritBazaar('charge')">灵力典当 · 50%充能换经验+100</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritBazaar('snack')">买灵食 · -50币 充能+40 亲密度+4</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('灵脉集市：灯笼映着灵纹价目表', 'info');
}

function tsrChooseSpiritBazaar(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritbazaar' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const sp = ensureTsrSpiritPet();
    if (path === 'trade') {
        if ((sp.bond || 0) < 10) { addTsrLog('亲密度不足10，商贩摇头', 'warning'); finishTsrMemeRoom(); return; }
        addTsrSpiritBond(-8);
        const gained = addTsrRunCurrency(Math.floor(120 * dm * getTsrSpiritRoomMult()));
        addTsrLog(`以羁绊换得${gained}秘境币`, 'success');
    } else if (path === 'charge') {
        const charge = tsr.currentRun.spiritCharge || 0;
        if (charge < 50) { addTsrLog('充能不足50%，无法典当', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.spiritCharge -= 50;
        addTsrSpiritExp(Math.floor(100 * getTsrSpiritRoomMult()));
        addTsrSpiritBond(3);
        addTsrLog('灵力典当成功！经验+100，亲密度+3', 'success');
    } else if (path === 'snack') {
        if (tsr.currentRun.currencyEarned < 50) { addTsrLog('秘境币不足50', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 50;
        chargeTsrSpirit(40);
        addTsrSpiritBond(4);
        addTsrLog('灵食下肚，充能+40，亲密度+4', 'success');
    }
    finishTsrMemeRoom();
}

function handleSpiritBossRoom() {
    const sp = ensureTsrSpiritPet();
    if (sp.level < 20 || (sp.evolution || 0) < 2) {
        addTsrLog('灵压过强！需精灵20级且进化≥2才能挑战灵域霸主', 'warning');
        finishTsrMemeRoom();
        return;
    }
    showTsrMemePanel('👑 灵域王座', '灵域霸主睁开双眼：「证明你们的羁绊，配得上灵脉之巅。」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritBoss('fight')">协同讨伐 · 神话首领战（灵击×2.5）</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritBoss('tribute')">献上灵力 · -60%充能换200经验+1技能点</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">退避</button>`);
    addTsrLog(`灵域王座：${getTsrSpiritDisplayName()} Lv${sp.level} 感到前所未有的灵压`, 'warning');
}

function tsrChooseSpiritBoss(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritboss' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'fight') {
        const boss = getTsrMonsterById('spiritsovereign');
        room.isSpiritBoss = true;
        room.isElite = true;
        room.monster = boss || pickTsrMonsterMinTier(false, true, 'mythic', tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('elite', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 2.8);
        room.rewards.buffChance = 0.75;
        tsr.currentRun.spiritBossAssist = true;
        handleBattleRoom({ forceElite: true });
        tsr.currentRun.spiritBossAssist = false;
        return;
    }
    if (path === 'tribute') {
        const charge = tsr.currentRun.spiritCharge || 0;
        if (charge < 60) { addTsrLog('充能不足60%，霸主不接受献礼', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.spiritCharge -= 60;
        addTsrSpiritExp(Math.floor(200 * getTsrSpiritRoomMult()));
        const sp = ensureTsrSpiritPet();
        sp.skillPoints = (sp.skillPoints || 0) + 1;
        addTsrSpiritBond(10);
        addTsrLog('霸主收下灵力！经验+200，技能点+1，亲密度+10', 'success');
        invalidateTsrUiCache('spirit');
        finishTsrMemeRoom();
    } else {
        tsr.currentRun.timeLeft += 10;
        addTsrLog('你选择退避，保留10秒', 'info');
        finishTsrMemeRoom();
    }
}

function handleSpiritOracleRoom() {
    const sp = ensureTsrSpiritPet();
    if (sp.level < 18) {
        addTsrLog('神谕需要精灵18级才能解读（当前不足）', 'warning');
        finishTsrMemeRoom();
        return;
    }
    showTsrMemePanel('🔮 精灵神谕', `${getTsrSpiritDisplayName()}悬浮在神谕阵心：「我听到了未来的房间回声……」`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritOracle('sight')">灵视预言 · 预览3层+战斗+15%×4</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritOracle('fate')">命运抉择 · 50%得遗物或-8%血</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritOracle('whisper')">低语充能 · 充能+70 +30秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('精灵神谕：符文如星河流转', 'info');
}

function tsrChooseSpiritOracle(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritoracle' || !room.explored) return;
    if (path === 'sight') {
        if (tsr.currentRun.timeLeft <= 32) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 28;
        tsr.currentRun.oraclePreview = 3;
        updateTsrRoomPreview();
        addTempBuff({ name: '神谕战意', effect: 'attack', value: 0.15, duration: 4, isDebuff: false });
        chargeTsrSpirit(30);
        addTsrLog('灵视预言！预览未来3层，攻击+15%×4', 'success');
    } else if (path === 'fate') {
        if (Math.random() < 0.5 && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
            const pick = rollTsrRelicChoices(1)[0];
            if (pick) addTsrRelic(pick);
            addTsrLog('命运眷顾！神谕赐予遗物', 'success');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('命运反噬！受到8%伤害', 'error');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
        }
    } else if (path === 'whisper') {
        chargeTsrSpirit(70);
        tsr.currentRun.timeLeft += 30;
        addTsrSpiritBond(5);
        addTsrLog('神谕低语！充能+70，+30秒，亲密度+5', 'success');
    }
    finishTsrMemeRoom();
}

function handleSpiritForgeRoom() {
    const sp = ensureTsrSpiritPet();
    if (sp.level < 22) {
        addTsrLog('灵锻工坊火焰过烈，需精灵22级（当前不足）', 'warning');
        finishTsrMemeRoom();
        return;
    }
    showTsrMemePanel('⚒️ 灵锻工坊', '锻造师：「灵脉可淬火成刃，选一种淬炼方式。」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritForge('strike')">淬炼灵刃 · 灵击+35%×5层</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritForge('skill')">熔铸天赋 · -80币 +1技能点</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritForge('armor')">灵盾淬火 · 反击-10%×5层</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog(`灵锻工坊：${getTsrSpiritDisplayName()}的灵纹在炉火中闪烁`, 'info');
}

function tsrChooseSpiritForge(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritforge' || !room.explored) return;
    if (tsr.currentRun.timeLeft <= 30) { finishTsrMemeRoom(); return; }
    tsr.currentRun.timeLeft -= 26;
    if (path === 'strike') {
        tsr.currentRun.spiritPactCombat = tsr.currentRun.spiritPactCombat || {};
        tsr.currentRun.spiritPactCombat.strikeMult = (tsr.currentRun.spiritPactCombat.strikeMult || 1) * 1.35;
        tsr.currentRun.spiritPactCombat.strikeFloors = (tsr.currentRun.spiritPactCombat.strikeFloors || 0) + 5;
        chargeTsrSpirit(25);
        addTsrLog('灵刃淬火！灵击伤害+35%，持续5层', 'success');
    } else if (path === 'skill') {
        if (tsr.currentRun.currencyEarned < 80) { addTsrLog('秘境币不足80', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 80;
        ensureTsrSpiritPet().skillPoints = (ensureTsrSpiritPet().skillPoints || 0) + 1;
        addTsrSpiritBond(4);
        addTsrLog('熔铸天赋！技能点+1，亲密度+4', 'success');
        invalidateTsrUiCache('spirit');
    } else if (path === 'armor') {
        tsr.currentRun.spiritPactCombat = tsr.currentRun.spiritPactCombat || {};
        tsr.currentRun.spiritPactCombat.counterReduce = (tsr.currentRun.spiritPactCombat.counterReduce || 0) + 0.1;
        tsr.currentRun.spiritPactCombat.armorFloors = (tsr.currentRun.spiritPactCombat.armorFloors || 0) + 5;
        tsrHealPlayer(0.12);
        addTsrLog('灵盾淬火！反击伤害-10%，持续5层，回血12%', 'success');
    }
    finishTsrMemeRoom();
}

function handleSpiritArenaRoom() {
    const sp = ensureTsrSpiritPet();
    if (sp.level < 14) {
        addTsrLog('精灵竞技场需14级（当前不足）', 'warning');
        finishTsrMemeRoom();
        return;
    }
    showTsrMemePanel('🏟️ 精灵竞技场', `${getTsrSpiritDisplayName()}跃上擂台：「让他们看看羁绊的战力！」`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritArena('duel')">单挑精英 · 灵击×1.8</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritArena('train')">训练模式 · 经验+120</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritArena('cheer')">观众喝彩 · +60币 +充能30</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离场</button>`);
    addTsrLog('精灵竞技场：观众席灵力涌动', 'info');
}

function tsrChooseSpiritArena(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritarena' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'duel') {
        tsr.currentRun.spiritArenaAssist = true;
        room.monster = pickTsrMonsterMinTier(false, true, 'epic', tsr.currentRun.currentFloor, dm);
        room.isElite = true;
        room.rewards = generateRoomRewards('elite', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.6);
        handleBattleRoom({ forceElite: true });
        tsr.currentRun.spiritArenaAssist = false;
        return;
    }
    if (path === 'train') {
        if (tsr.currentRun.timeLeft <= 25) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 22;
        addTsrSpiritExp(Math.floor(120 * getTsrSpiritRoomMult()));
        addTsrSpiritBond(5);
        chargeTsrSpirit(35);
        addTsrLog('训练完成！经验+120，亲密度+5，充能+35', 'success');
    } else if (path === 'cheer') {
        addTsrRunCurrency(Math.floor(60 * dm));
        chargeTsrSpirit(30);
        addTsrLog('观众喝彩！+60×难度币，充能+30', 'success');
    }
    finishTsrMemeRoom();
}

function handleSpiritNexusRoom() {
    const sp = ensureTsrSpiritPet();
    if (sp.level < 24 || (sp.evolution || 0) < 2) {
        addTsrLog('灵枢节点需精灵24级且进化≥2', 'warning');
        finishTsrMemeRoom();
        return;
    }
    showTsrMemePanel('💠 灵枢节点', '三条灵脉支流在此交汇，只能择一汲取。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritNexus('power')">力量支流 · 攻击+22%×5层</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritNexus('time')">时光支流 · +45秒 充能+50</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritNexus('bond')">羁绊支流 · 亲密度+18 经验+150</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('灵枢节点：灵力如星河旋转', 'warning');
}

function tsrChooseSpiritNexus(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritnexus' || !room.explored) return;
    if (tsr.currentRun.timeLeft <= 32) { finishTsrMemeRoom(); return; }
    tsr.currentRun.timeLeft -= 28;
    if (path === 'power') {
        addTempBuff({ name: '灵枢战意', effect: 'attack', value: 0.22, duration: 5, isDebuff: false });
        chargeTsrSpirit(40);
        addTsrLog('汲取力量支流！攻击+22%×5，充能+40', 'success');
    } else if (path === 'time') {
        tsr.currentRun.timeLeft += 45;
        chargeTsrSpirit(50);
        addTsrSpiritBond(6);
        addTsrLog('汲取时光支流！+45秒，充能+50，亲密度+6', 'success');
    } else if (path === 'bond') {
        addTsrSpiritBond(18);
        addTsrSpiritExp(Math.floor(150 * getTsrSpiritRoomMult()));
        tsrHealPlayer(0.15);
        addTsrLog('汲取羁绊支流！亲密度+18，经验+150，回血15%', 'success');
    }
    finishTsrMemeRoom();
}

function handleSpiritCodexRoom() {
    const sp = ensureTsrSpiritPet();
    const ratio = Math.floor(getTsrCodexDiscoverRatio() * 100);
    showTsrMemePanel('📖 精灵图鉴殿', `墙上悬浮着${ratio}%的秘境图鉴，${getTsrSpiritDisplayName()}可帮你补全认知。`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritCodex('scan')">灵视扫描 · 预览2层+经验+80</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritCodex('archive')">归档共鸣 · +90×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritCodex('learn')">研习残页 · 50%得技能点或+60币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog(`精灵图鉴殿：图鉴完成度${ratio}%`, 'info');
}

function tsrChooseSpiritCodex(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritcodex' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'scan') {
        tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, 2);
        updateTsrRoomPreview();
        addTsrSpiritExp(Math.floor(80 * getTsrSpiritRoomMult()));
        chargeTsrSpirit(25);
        addTsrLog('灵视扫描！预览2层，经验+80，充能+25', 'success');
    } else if (path === 'archive') {
        const bonus = 1 + getTsrCodexDiscoverRatio() * 0.5;
        const gained = addTsrRunCurrency(Math.floor(90 * dm * bonus));
        addTsrLog(`归档共鸣！获得${gained}秘境币（图鉴加成）`, 'success');
    } else if (path === 'learn') {
        if (Math.random() < 0.5) {
            ensureTsrSpiritPet().skillPoints = (ensureTsrSpiritPet().skillPoints || 0) + 1;
            addTsrLog('研习残页开悟！+1技能点', 'success');
            invalidateTsrUiCache('spirit');
        } else {
            const g = addTsrRunCurrency(Math.floor(60 * dm));
            addTsrLog(`残页内容晦涩，获得${g}秘境币`, 'info');
        }
    }
    finishTsrMemeRoom();
}

function handleSpiritAscendRoom() {
    const sp = ensureTsrSpiritPet();
    if (sp.evolution < 3) {
        addTsrLog('飞升台需要精灵进化至永恒神使（第3形态）', 'warning');
        finishTsrMemeRoom();
        return;
    }
    if (sp.evolution >= 4) {
        addTsrLog('终焉星灵已降临，飞升台化为星辉', 'info');
        tsrHealPlayer(0.2);
        chargeTsrSpirit(60);
        addTsrSpiritExp(Math.floor(100 * getTsrSpiritRoomMult()));
        finishTsrMemeRoom();
        return;
    }
    if (sp.level < 35) {
        addTsrLog('飞升台灵压过高，需精灵35级', 'warning');
        finishTsrMemeRoom();
        return;
    }
    const canAscend = canEvolveTsrSpiritTo(4);
    const blockHint = getTsrSpiritEvolveBlockReason(4) || '';
    showTsrMemePanel('🌌 终焉飞升台', `星门洞开，${getTsrSpiritDisplayName()}感应到终焉星灵的呼唤。${blockHint ? '<br><small>' + blockHint + '</small>' : ''}`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritAscend('trial')">飞升试炼 · 精灵帝皇战（灵击×3）</button>
         ${canAscend ? `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritAscend('awaken')">星灵觉醒 · 进化至终焉星灵</button>` : ''}
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritAscend('meditate')">星门冥想 · 经验+200 充能+70</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('终焉飞升台：星门与灵脉同频共振', 'warning');
}

function tsrChooseSpiritAscend(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritascend' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'trial') {
        const boss = getTsrMonsterById('spiritemperor') || getTsrMonsterById('spiritsovereign');
        room.isSpiritAscendTrial = true;
        room.isElite = true;
        room.monster = boss || pickTsrMonsterMinTier(false, true, 'mythic', tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
        room.rewards = generateRoomRewards('elite', tsr.currentRun.difficultyMultiplier);
        room.rewards.currency = Math.floor(room.rewards.currency * 3);
        tsr.currentRun.spiritAscendAssist = true;
        handleBattleRoom({ forceElite: true });
        tsr.currentRun.spiritAscendAssist = false;
        return;
    }
    if (path === 'awaken') {
        if (evolveTsrSpirit()) {
            chargeTsrSpirit(100);
            tsrHealPlayer(0.25);
            tsr.currentRun.timeLeft += 40;
            addTsrLog('星灵觉醒！终焉星灵降临，+40秒', 'success');
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'meditate') {
        if (tsr.currentRun.timeLeft <= 30) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 28;
        addTsrSpiritExp(Math.floor(200 * getTsrSpiritRoomMult()));
        chargeTsrSpirit(70);
        addTsrSpiritBond(8);
        addTsrLog('星门冥想！经验+200，充能+70，亲密度+8', 'success');
        finishTsrMemeRoom();
    } else {
        finishTsrMemeRoom();
    }
}

function handleSpiritStarRoom() {
    const sp = ensureTsrSpiritPet();
    if ((sp.evolution || 0) < getTsrSpiritMaxEvolution()) {
        addTsrLog('终焉星域只认终焉星灵', 'warning');
        finishTsrMemeRoom();
        return;
    }
    const hasDominion = (sp.skills || []).includes('starDominion');
    showTsrMemePanel('💫 终焉星域', `${getTsrSpiritDisplayName()}悬浮在星域中心，万灵星光环绕。${hasDominion ? '<br><small>星域统御已激活，收益提升</small>' : ''}`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritStar('cruise')">星灵巡游 · 预览3层+经验+180</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritStar('dominion')">星域统御 · 灵击×1.5×5层+攻击+15%×4</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritStar('baptism')">星瀑沐浴 · 回血20% 充能+90 亲密度+12</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('终焉星域：星光如海，灵息充盈', 'warning');
}

function tsrChooseSpiritStar(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritstar' || !room.explored) return;
    hideTsrChoicePanels();
    const mult = 1 + ((ensureTsrSpiritPet().skills || []).includes('starDominion') ? 0.35 : 0);
    if (path === 'cruise') {
        if (tsr.currentRun.timeLeft <= 25) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 22;
        tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, 3);
        updateTsrRoomPreview();
        addTsrSpiritExp(Math.floor(180 * getTsrSpiritRoomMult() * mult));
        chargeTsrSpirit(40);
        addTsrLog(`星灵巡游！预览3层，经验+${Math.floor(180 * mult)}，充能+40`, 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'dominion') {
        if (tsr.currentRun.timeLeft <= 30) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 26;
        tsr.currentRun.spiritStrikeAmp = 1.5;
        tsr.currentRun.spiritStrikeAmpFloors = 5;
        addTempBuff({ name: '星域统御', effect: 'attack', value: 0.15, duration: 4, isDebuff: false });
        addTsrSpiritBond(6);
        addTsrLog('星域统御！灵击×1.5持续5层，攻击+15%×4', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'baptism') {
        if (tsr.currentRun.timeLeft <= 32) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 28;
        tsrHealPlayer(0.2 * mult);
        chargeTsrSpirit(Math.floor(90 * mult));
        addTsrSpiritBond(Math.floor(12 * mult));
        addTsrSpiritExp(Math.floor(60 * getTsrSpiritRoomMult()));
        addTsrLog(`星瀑沐浴！回血20%，充能+${Math.floor(90 * mult)}，亲密度+${Math.floor(12 * mult)}`, 'success');
        finishTsrMemeRoom();
    } else {
        finishTsrMemeRoom();
    }
}

function handleSpiritThroneRoom() {
    const sp = ensureTsrSpiritPet();
    if ((sp.evolution || 0) < getTsrSpiritMaxEvolution()) {
        addTsrLog('星灵王座只认终焉星灵', 'warning');
        finishTsrMemeRoom();
        return;
    }
    if (sp.level < 36) {
        addTsrLog('王座灵压过高，需精灵36级', 'warning');
        finishTsrMemeRoom();
        return;
    }
    if (!hasTsrStarSpiritBuild()) {
        addTsrLog('需习得星灵本源或星域统御方可觐见王座', 'warning');
        finishTsrMemeRoom();
        return;
    }
    const ls = player.timeSecretRealm?.lifetimeStats || {};
    const extremeBtn = (ls.throneClears || 0) >= 3
        ? `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseSpiritThrone('extreme')">王座极境 · 独战天穹暴君（灵击×4.5）</button>`
        : '';
    showTsrMemePanel('👑 星灵王座', `${getTsrSpiritDisplayName()}立于王座前，星域主宰的威压与共鸣交织。`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritThrone('challenge')">王座三连战 · 星卫→怨灵→主宰（灵击×3.5）</button>
         ${extremeBtn}
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritThrone('tribute')">星辉献礼 · 充能80 经验+250</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritThrone('bless')">王座祝福 · 回血25% 亲密度+15</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">退避</button>`);
    addTsrLog('星灵王座：星冠虚影缓缓旋转，三连战试炼静候', 'warning');
}

function handleTsrThroneChallenge() {
    const tsr = player.timeSecretRealm;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const floor = tsr.currentRun.currentFloor;
    const waves = [
        { label: '王座第1波·虚空星卫', monster: getTsrMonsterById('voidsentinel'), isElite: true, isBoss: false, scale: 0.78 },
        { label: '王座第2波·星湮怨灵', monster: getTsrMonsterById('starwraith'), isElite: true, isBoss: false, scale: 0.9 },
        { label: '王座第3波·终焉星域主宰', monster: getTsrMonsterById('stararchon'), isElite: false, isBoss: true, scale: 1 }
    ];
    tsr.currentRun.spiritStarAssist = true;
    addTsrLog('👑 星灵王座三连战开幕！灵击协同×3.5', 'warning');
    let cleared = 0;
    for (let wi = 0; wi < waves.length; wi++) {
        const w = waves[wi];
        const monster = Object.assign({}, w.monster || pickTsrMonsterMinTier(w.isBoss, w.isElite, 'mythic', floor, dm));
        ensureTsrMonsterAffixes(monster, { isBoss: w.isBoss, isElite: w.isElite, floor });
        const stats = computeTsrMonsterStats({ isBoss: w.isBoss, isElite: w.isElite, floor, difficultyMultiplier: dm, monster });
        updateTsrMonsterBanner(monster, stats, w.isBoss, w.isElite);
        addTsrLog(`${w.label}：${formatTsrMonsterNamePlain(monster)}`, 'info');
        const waveAffixes = getTsrMonsterAffixList(monster);
        if (waveAffixes.length) {
            addTsrLog(`🏷️ 怪物词条：${waveAffixes.map(a => a.icon + a.name).join(' · ')}`, 'warning');
            recordTsrMonsterAffixCodex(monster.affixKeys);
        }
        let monsterHp = Math.floor(stats.hp * w.scale);
        const monsterMaxHp = monsterHp;
        const monsterAtk = Math.floor(stats.atk * w.scale);
        const atkBonus = getTsrBattleAttackBonus(w.isBoss, w.isElite);
        let rounds = 0;
        let victory = false;
        while (rounds < 14 && monsterHp > 0) {
            rounds++;
            const hit = calculateBattleDamage();
            let dmgMult = 1 + atkBonus;
            if ((monster?.affixKeys || []).length) dmgMult *= (1 + getTsrAffixAttackBonus(monster));
            if (tsr.currentRun.monsterShield > 0) dmgMult *= (1 - tsr.currentRun.monsterShield);
            const dmg = Math.max(1, Math.floor((Number(hit.damage) || 0) * dmgMult));
            monsterHp = Math.max(0, monsterHp - dmg);
            monsterHp = tryTsrSpiritBattleStrike(rounds, monsterHp, w.isBoss, monster, monsterMaxHp);
            const _hpZw = tryTsrMonsterHpZero(monster, monsterHp, monsterMaxHp, monsterAtk, { isBoss: w.isBoss, isElite: w.isElite, rounds });
            monsterHp = _hpZw.monsterHp;
            monsterMaxHp = _hpZw.monsterMaxHp;
            monsterAtk = _hpZw.monsterAtk;
            if (_hpZw.isDead) victory = true;
            if (monster && rounds % 2 === 0 && !victory) {
                monsterHp = applyTsrMonsterAffixRound(monster, rounds, monsterHp, monsterMaxHp);
                if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); tsr.currentRun.spiritStarAssist = false; return; }
                monsterHp = applyTsrMonsterSkill(monster, rounds, monsterHp, calculateTsrPlayerAttack(), dm, w.isBoss, w.isElite) || monsterHp;
                if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); tsr.currentRun.spiritStarAssist = false; return; }
            }
            const counterRatio = getTsrBattleCounterRatio(w.isBoss, w.isElite, dm) * (w.isBoss ? 1.08 : 1.05);
            const counter = Math.max(1, Math.floor(monsterAtk * counterRatio * getTsrCounterDamageMultiplier() * (1 + getTsrMonsterAffixCounterMult(monster, rounds, monsterHp, monsterMaxHp)) * (victory ? TSR_DEATH_COUNTER_RATIO : 1)));
            applyDamage(counter);
            if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); tsr.currentRun.spiritStarAssist = false; return; }
            if (victory) break;
        }
        if (!victory || bLteZero(tsr.currentRun.playerHealth)) {
            hideTsrMonsterBanner();
            addTsrLog(`王座挑战在第${wi + 1}波中止`, 'error');
            tsr.currentRun.spiritStarAssist = false;
            afterAction();
            return;
        }
        cleared++;
        onTsrMonsterAffixVictory(monster);
        onTsrMonsterBattleVictory(monster);
        tsr.currentRun.battleWinStreak = (tsr.currentRun.battleWinStreak || 0) + 1;
        addTsrLog(`${w.label}击破！${wi < waves.length - 1 ? '下一波威压逼近……' : '王座认主！'}`, 'success');
        if (wi < waves.length - 1) tsrHealPlayer(0.1);
    }
    hideTsrMonsterBanner();
    tsr.currentRun.spiritStarAssist = false;
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.throneClears = (tsr.lifetimeStats.throneClears || 0) + 1;
    tsr.currentRun.throneClearThisRun = true;
    bumpTsrEngagement('dailyThroneClear', 1);
    bumpTsrQuestProgress('weeklyThroneClears', 1);
    applyTsrStarBossVictory();
    tryGrantTsrExclusiveRelic('archonCrown', 0.58, '王座三连战');
    const gained = addTsrRunCurrency(Math.floor(280 * dm), { eliteBonus: true, combo: true });
    tsr.currentRun.timeLeft += 35;
    addTsrSpiritExp(Math.floor(120 * getTsrSpiritRoomMult()));
    addTsrLog(`👑 王座三连战圆满成功！额外${gained}秘境币，+35秒`, 'success');
    checkTsrAchievements();
    finishTsrMemeRoom();
}

function handleTsrThroneExtremeChallenge() {
    const tsr = player.timeSecretRealm;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const floor = tsr.currentRun.currentFloor;
    const monster = getTsrMonsterById('celestialtyrant') || pickTsrMonsterMinTier(true, false, 'mythic', floor, dm);
    ensureTsrMonsterAffixes(monster, { isBoss: true, isElite: false, floor });
    tsr.currentRun.monsterShield = getTsrMonsterAffixStartShield(monster);
    const stats = computeTsrMonsterStats({ isBoss: true, isElite: false, floor, difficultyMultiplier: dm, monster });
    tsr.currentRun.spiritStarAssist = true;
    tsr.currentRun.spiritStarAssistMult = 4.5;
    addTsrLog('💀 王座极境开启！独面天穹暴君，灵击协同×4.5', 'warning');
    updateTsrMonsterBanner(monster, stats, true, false);
    addTsrLog(`极境试炼：${formatTsrMonsterNamePlain(monster)}`, 'info');
    const extremeAffixes = getTsrMonsterAffixList(monster);
    if (extremeAffixes.length) {
        addTsrLog(`🏷️ 怪物词条：${extremeAffixes.map(a => a.icon + a.name).join(' · ')}`, 'warning');
        recordTsrMonsterAffixCodex(monster.affixKeys);
    }
    let monsterHp = Math.floor(stats.hp * 1.12);
    const monsterMaxHp = monsterHp;
    const monsterAtk = Math.floor(stats.atk * 1.08);
    const atkBonus = getTsrBattleAttackBonus(true, false);
    let rounds = 0;
    let victory = false;
    while (rounds < 18 && monsterHp > 0) {
        rounds++;
        const hit = calculateBattleDamage();
        let dmgMult = 0.9 * (1 + atkBonus);
        if ((monster?.affixKeys || []).length) dmgMult *= (1 + getTsrAffixAttackBonus(monster));
        if (tsr.currentRun.monsterShield > 0) dmgMult *= (1 - tsr.currentRun.monsterShield);
        const dmg = Math.max(1, Math.floor((Number(hit.damage) || 0) * dmgMult));
        monsterHp = Math.max(0, monsterHp - dmg);
        monsterHp = tryTsrSpiritBattleStrike(rounds, monsterHp, true, monster, monsterMaxHp);
        const _hpZb = tryTsrMonsterHpZero(monster, monsterHp, monsterMaxHp, monsterAtk, { isBoss: true, isElite: false, rounds });
        monsterHp = _hpZb.monsterHp;
        monsterMaxHp = _hpZb.monsterMaxHp;
        monsterAtk = _hpZb.monsterAtk;
        if (_hpZb.isDead) victory = true;
        if (monster && rounds % 2 === 0 && !victory) {
            monsterHp = applyTsrMonsterAffixRound(monster, rounds, monsterHp, monsterMaxHp);
            if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); tsr.currentRun.spiritStarAssist = false; tsr.currentRun.spiritStarAssistMult = null; return; }
            monsterHp = applyTsrMonsterSkill(monster, rounds, monsterHp, calculateTsrPlayerAttack(), dm, true, false) || monsterHp;
            if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); tsr.currentRun.spiritStarAssist = false; tsr.currentRun.spiritStarAssistMult = null; return; }
        }
        const counter = Math.max(1, Math.floor(monsterAtk * getTsrBattleCounterRatio(true, false, dm) * 1.15 * getTsrCounterDamageMultiplier() * (1 + getTsrMonsterAffixCounterMult(monster, rounds, monsterHp, monsterMaxHp)) * (victory ? TSR_DEATH_COUNTER_RATIO : 1)));
        applyDamage(counter);
        if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); tsr.currentRun.spiritStarAssist = false; tsr.currentRun.spiritStarAssistMult = null; return; }
        if (victory) break;
    }
    hideTsrMonsterBanner();
    tsr.currentRun.spiritStarAssist = false;
    tsr.currentRun.spiritStarAssistMult = null;
    if (!victory || bLteZero(tsr.currentRun.playerHealth)) {
        addTsrLog('王座极境挑战失败，暴君仍在天穹俯视', 'error');
        afterAction();
        return;
    }
    onTsrMonsterAffixVictory(monster);
    onTsrMonsterBattleVictory(monster);
    tsr.currentRun.battleWinStreak = (tsr.currentRun.battleWinStreak || 0) + 1;
    applyTsrTyrantVictory(true);
    tryGrantTsrExclusiveRelic('paradeBanner', 0.35, '王座极境');
    const gained = addTsrRunCurrency(Math.floor(360 * dm), { eliteBonus: true, combo: true });
    tsr.currentRun.timeLeft += 45;
    addTsrSpiritExp(Math.floor(180 * getTsrSpiritRoomMult()));
    addTsrLog(`💀 王座极境通关！额外${gained}秘境币，+45秒`, 'success');
    checkTsrAchievements();
    finishTsrMemeRoom();
}

function tsrChooseSpiritThrone(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritthrone' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'challenge') {
        if (tsr.currentRun.timeLeft <= 40) {
            addTsrLog('时间不足，无法开启王座三连战', 'warning');
            finishTsrMemeRoom();
            return;
        }
        tsr.currentRun.timeLeft -= 25;
        handleTsrThroneChallenge();
        return;
    }
    if (path === 'extreme') {
        const ls = tsr.lifetimeStats || {};
        if ((ls.throneClears || 0) < 3) {
            addTsrLog('需完成王座三连战至少3次方可挑战极境', 'warning');
            finishTsrMemeRoom();
            return;
        }
        if (tsr.currentRun.timeLeft <= 50) {
            addTsrLog('时间不足，无法开启王座极境', 'warning');
            finishTsrMemeRoom();
            return;
        }
        tsr.currentRun.timeLeft -= 35;
        handleTsrThroneExtremeChallenge();
        return;
    }
    if (path === 'tribute') {
        const charge = tsr.currentRun.spiritCharge || 0;
        if (charge < 50) { addTsrLog('充能不足50%，献礼被拒', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.spiritCharge -= 50;
        chargeTsrSpirit(80);
        addTsrSpiritExp(Math.floor(250 * getTsrSpiritRoomMult()));
        addTsrSpiritBond(10);
        addTsrLog('星辉献礼被接受！充能+80，经验+250，亲密度+10', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'bless') {
        if (tsr.currentRun.timeLeft <= 35) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 30;
        tsrHealPlayer(0.25);
        addTsrSpiritBond(15);
        tsr.currentRun.timeLeft += 20;
        addTsrLog('王座祝福！回血25%，亲密度+15，净得+20秒', 'success');
        finishTsrMemeRoom();
    } else {
        finishTsrMemeRoom();
    }
}

function handleStarfallRoom() {
    const sp = ensureTsrSpiritPet();
    if ((sp.evolution || 0) < getTsrSpiritMaxEvolution()) {
        addTsrLog('星陨祭坛只回应终焉星灵', 'warning');
        finishTsrMemeRoom();
        return;
    }
    showTsrMemePanel('☄️ 星陨祭坛', '流星划过祭坛，星辉可祈福、淬炼或召唤星尘战。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseStarfall('pray')">星陨祈福 · 回血20% 加时+30 亲密度+8</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseStarfall('forge')">淬炼星幕 · 50%得星幕碎片遗物或+120经验</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseStarfall('summon')">召唤星尘 · 星尘幼灵战+充能+35</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('星陨祭坛：流星尾迹照亮灵脉', 'info');
}

function tsrChooseStarfall(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'starfall' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'pray') {
        if (tsr.currentRun.timeLeft <= 25) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 20;
        tsrHealPlayer(0.2);
        tsr.currentRun.timeLeft += 30;
        addTsrSpiritBond(8);
        addTsrLog('星陨祈福！回血20%，净得+10秒，亲密度+8', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'forge') {
        if (tsr.currentRun.timeLeft <= 30) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 28;
        if (Math.random() < 0.5 && (tsr.currentRun.relics || []).length < getTsrRelicMax() && !(tsr.currentRun.relics || []).includes('starVeilShard')) {
            addTsrRelic('starVeilShard');
        } else {
            addTsrSpiritExp(Math.floor(120 * getTsrSpiritRoomMult()));
            addTsrLog('淬炼成功！经验+120', 'success');
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'summon') {
        chargeTsrSpirit(35);
        room.monster = getTsrMonsterById('starling') || pickTsrMonster(false, false, tsr.currentRun.currentFloor, dm);
        room.isElite = false;
        room.isBoss = false;
        room.rewards = generateRoomRewards('battle', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.8);
        handleBattleRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleSpiritDuelRoom() {
    const sp = ensureTsrSpiritPet();
    if (sp.level < 20) {
        addTsrLog('精灵对决需20级以上', 'warning');
        finishTsrMemeRoom();
        return;
    }
    showTsrMemePanel('⚔️ 精灵对决', `${getTsrSpiritDisplayName()}的倒影与你对峙，可决斗、观摩或认输。`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritDuel('fight')">镜像决斗 · 精英战（灵击×2）</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritDuel('study')">观摩破绽 · 经验+100 50%技能点</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritDuel('yield')">认输离场 · +40币 +15秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('精灵对决：镜像灵压与本体共鸣', 'info');
}

function tsrChooseSpiritDuel(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritduel' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'fight') {
        room.monster = getTsrMonsterById('cursedsprite') || pickTsrMonster(false, true, tsr.currentRun.currentFloor, dm);
        room.isElite = true;
        room.isSpiritDuel = true;
        room.rewards = generateRoomRewards('elite', dm);
        tsr.currentRun.spiritBossAssist = true;
        handleBattleRoom({ forceElite: true });
        tsr.currentRun.spiritBossAssist = false;
        return;
    }
    if (path === 'study') {
        addTsrSpiritExp(Math.floor(100 * getTsrSpiritRoomMult()));
        if (Math.random() < 0.5) {
            ensureTsrSpiritPet().skillPoints = (ensureTsrSpiritPet().skillPoints || 0) + 1;
            addTsrLog('观摩开悟！经验+100，+1技能点', 'success');
        } else {
            addTsrLog('观摩成功！经验+100', 'success');
        }
        invalidateTsrUiCache('spirit');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'yield') {
        addTsrRunCurrency(Math.floor(40 * dm));
        tsr.currentRun.timeLeft += 15;
        addTsrLog('认输离场，对方送你路费+15秒', 'info');
        finishTsrMemeRoom();
    } else {
        finishTsrMemeRoom();
    }
}

function handleCelestialVaultRoom() {
    showTsrMemePanel('🏦 天穹宝库', '三重星锁封存宝藏，解封越深入奖励越高，但也越危险。',
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseCelestialVault('light')">轻启外锁 · -15秒 +90×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseCelestialVault('deep')">深入内库 · 50%双倍币+遗物或-8%血</button>
         <button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseCelestialVault('perfect')">完美开启 · -35秒 三选一遗物或200×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">放弃</button>`);
    addTsrLog('天穹宝库：星锁嗡鸣', 'warning');
}

function tsrChooseCelestialVault(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'celestialvault' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'light') {
        if (tsr.currentRun.timeLeft <= 18) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 15;
        const g = addTsrRunCurrency(Math.floor(90 * dm));
        addTsrLog(`轻启外锁，获得${g}秘境币`, 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'deep') {
        if (Math.random() < 0.5) {
            const g = addTsrRunCurrency(Math.floor(160 * dm));
            if (Math.random() < 0.35 && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
                const pick = rollTsrRelicChoices(1)[0];
                if (pick) addTsrRelic(pick);
            }
            addTsrLog(`深入成功！获得${g}秘境币`, 'success');
            if (Math.random() < 0.28) addTsrConsumable('affixScope');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('星锁反噬！受到8%伤害', 'error');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'perfect') {
        if (tsr.currentRun.timeLeft <= 38) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 35;
        if (Math.random() < 0.55 && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
            const picks = rollTsrRelicChoices(Math.min(3, getTsrRelicMax() - (tsr.currentRun.relics || []).length));
            if (picks.length) {
                const panel = document.getElementById('tsrRelicPickPanel');
                const container = document.getElementById('tsrRelicPickOptions');
                if (panel && container) {
                    tsr.currentRun.relicChoices = picks;
                    container.innerHTML = picks.map((key, idx) => {
                        const r = TSR_RELIC_POOL[key];
                        return `<div class="tsr-relic-option" onclick="tsrPickRelic(${idx})">
                            <strong>${r.icon} ${r.name}</strong>
                            <div style="color:#c4b5fd;margin-top:4px;font-size:12px;">${r.desc}</div>
                        </div>`;
                    }).join('');
                    panel.style.display = 'block';
                    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
                    tsr.lifetimeStats.celestialVaultWin = true;
                    checkTsrAchievements();
                    addTsrLog('天穹宝库完美开启！请选择一件遗物', 'success');
                    if (Math.random() < 0.4) addTsrConsumable('affixScope');
                    return;
                }
            }
        }
        const g = addTsrRunCurrency(Math.floor(200 * dm));
        if (Math.random() < 0.32) addTsrConsumable('affixScope');
        addTsrLog(`完美开启！获得${g}秘境币`, 'success');
        finishTsrMemeRoom();
    } else {
        finishTsrMemeRoom();
    }
}

function handleTimewarpRoom() {
    showTsrMemePanel('🌀 时光扭曲', '时间在这里打结——可跃层前进、回溯层数或稳定锚定。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseTimewarp('leap')">时光跃迁 · 跳至+2层 -25秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseTimewarp('rewind')">回溯 · 退1层 +40秒 回血15%</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseTimewarp('anchor')">锚定 · +55秒 攻击+15%×3</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('时光扭曲：层与层之间的缝隙在闪烁', 'info');
}

function tsrChooseTimewarp(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'timewarp' || !room.explored) return;
    hideTsrChoicePanels();
    const clearFloor = tsr.currentRun.clearFloor || 10;
    if (path === 'leap') {
        if (tsr.currentRun.timeLeft <= 28) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 25;
        tsr.currentRun.currentFloor = Math.min(clearFloor, tsr.currentRun.currentFloor + 2);
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.timewarpJumps = (tsr.lifetimeStats.timewarpJumps || 0) + 1;
        addTsrLog(`时光跃迁！直接到达第${tsr.currentRun.currentFloor}层`, 'success');
        checkTsrAchievements();
        if (tryTsrAutoClearOnReachFloor()) return;
        generateNewRoom();
        updateTimeSecretRealmUI();
        return;
    }
    if (path === 'rewind') {
        if (tsr.currentRun.currentFloor <= 1) { finishTsrMemeRoom(); return; }
        tsr.currentRun.currentFloor = Math.max(1, tsr.currentRun.currentFloor - 1);
        tsr.currentRun.timeLeft += 40;
        tsrHealPlayer(0.15);
        addTsrLog(`回溯至第${tsr.currentRun.currentFloor}层，+40秒，回血15%`, 'success');
        generateNewRoom();
        updateTimeSecretRealmUI();
        return;
    }
    if (path === 'anchor') {
        tsr.currentRun.timeLeft += 55;
        addTempBuff({ name: '时光锚定', effect: 'attack', value: 0.15, duration: 3, isDebuff: false });
        addTsrLog('时光锚定！+55秒，攻击+15%×3', 'success');
        finishTsrMemeRoom();
    } else {
        finishTsrMemeRoom();
    }
}

function handleRetrospectiveRoom() {
    showTsrMemePanel('📋 复盘会议室', '「来，我们复盘一下这次迭代的得失。」',
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseRetrospective('honest')">坦诚复盘 · 回血15% 经验+60</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseRetrospective('blame')">甩锅大会 · -20秒 +110×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseRetrospective('action')">行动项地狱 · 50%攻击+20%×3或-8%血</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">散会</button>`);
    addTsrLog('复盘会议室：白板写满 TODO', 'warning');
}

function tsrChooseRetrospective(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'retrospective' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'honest') {
        tsrHealPlayer(0.15);
        addTsrSpiritExp(Math.floor(60 * getTsrSpiritRoomMult()));
        addTsrLog('坦诚复盘！回血15%，精灵经验+60', 'success');
    } else if (path === 'blame') {
        if (tsr.currentRun.timeLeft <= 22) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 20;
        const g = addTsrRunCurrency(Math.floor(110 * dm));
        addTsrLog(`甩锅成功，获得${g}秘境币`, 'success');
    } else if (path === 'action') {
        if (Math.random() < 0.5) {
            addTempBuff({ name: '行动项战神', effect: 'attack', value: 0.2, duration: 3, isDebuff: false });
            addTsrLog('行动项落地！攻击+20%×3', 'success');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('行动项太多，受到8%伤害', 'error');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
        }
    }
    finishTsrMemeRoom();
}

function handleInterviewRoom() {
    showTsrMemePanel('💼 秘境面试间', 'HR微笑：「请用三个词形容你的冒险风格。」',
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseInterview('steady')">稳健型 · 回血20% +25秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseInterview('aggressive')">激进型 · 攻击+22%×4 -15秒</button>
         <button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseInterview('star')">星灵型 · 充能+55 亲密度+6（需终焉星灵）</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">下次再来</button>`);
    addTsrLog('秘境面试间：空调开太冷了', 'info');
}

function tsrChooseInterview(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'interview' || !room.explored) return;
    hideTsrChoicePanels();
    const sp = ensureTsrSpiritPet();
    if (path === 'steady') {
        tsrHealPlayer(0.2);
        tsr.currentRun.timeLeft += 25;
        addTsrLog('稳健型通过！回血20%，+25秒', 'success');
    } else if (path === 'aggressive') {
        if (tsr.currentRun.timeLeft <= 18) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 15;
        addTempBuff({ name: '激进面试', effect: 'attack', value: 0.22, duration: 4, isDebuff: false });
        addTsrLog('激进型！攻击+22%×4', 'success');
    } else if (path === 'star') {
        if ((sp.evolution || 0) < getTsrSpiritMaxEvolution()) {
            addTsrLog('终焉星灵方可走星灵通道', 'warning');
            finishTsrMemeRoom();
            return;
        }
        chargeTsrSpirit(55);
        addTsrSpiritBond(6);
        addTsrLog('星灵型！充能+55，亲密度+6', 'success');
        invalidateTsrUiCache('spirit');
    }
    finishTsrMemeRoom();
}

function handleTyrantCourtRoom() {
    const sp = ensureTsrSpiritPet();
    const ls = player.timeSecretRealm?.lifetimeStats || {};
    if ((ls.throneClears || 0) < 1 && (sp.evolution || 0) < getTsrSpiritMaxEvolution()) {
        addTsrLog('审判庭只认王座挑战者或终焉星灵', 'warning');
        finishTsrMemeRoom();
        return;
    }
    if (sp.level < 38) {
        addTsrLog('灵压过高，需精灵38级方可入庭', 'warning');
        finishTsrMemeRoom();
        return;
    }
    const judgmentHint = (sp.skills || []).includes('starJudgment') ? ' · 已习得星域审判，陈词加成更高' : '';
    showTsrMemePanel('⚖️ 天穹审判庭', `星冕高悬，审判官凝视着你：「证明你的星域资格。」${judgmentHint}`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseTyrantCourt('trial')">接受裁决 · 天穹暴君战（灵击×3.8）</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseTyrantCourt('plead')">举证陈词 · 攻击+18%×4 经验+90</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseTyrantCourt('reprieve')">请求缓刑 · +30秒 -50×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">退庭</button>`);
    addTsrLog('天穹审判庭：星冕投下冷光', 'warning');
}

function tsrChooseTyrantCourt(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'tyrantcourt' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const sp = ensureTsrSpiritPet();
    if (path === 'trial') {
        if (tsr.currentRun.timeLeft <= 35) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 22;
        tsr.currentRun.spiritStarAssist = true;
        tsr.currentRun.spiritStarAssistMult = 3.8;
        room.isBoss = true;
        room.isElite = false;
        room.monster = getTsrMonsterById('celestialtyrant') || pickTsrMonsterMinTier(true, false, 'mythic', tsr.currentRun.currentFloor, dm);
        room.rewards = generateRoomRewards('boss', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 2.2);
        handleBattleRoom();
        return;
    }
    if (path === 'plead') {
        if (tsr.currentRun.timeLeft <= 25) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 18;
        const hasJudgment = (sp.skills || []).includes('starJudgment');
        addTempBuff({ name: '审判陈词', effect: 'attack', value: hasJudgment ? 0.25 : 0.18, duration: 4, isDebuff: false });
        addTsrSpiritExp(Math.floor((hasJudgment ? 120 : 90) * getTsrSpiritRoomMult()));
        if (hasJudgment) chargeTsrSpirit(35);
        addTsrLog(hasJudgment ? '星域审判加持！攻击+25%×4，经验+120，充能+35' : '陈词被记录！攻击+18%×4，经验+90', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'reprieve') {
        tsr.currentRun.timeLeft += 30;
        const cost = Math.min(tsr.currentRun.currencyEarned || 0, Math.floor(50 * dm));
        tsr.currentRun.currencyEarned = Math.max(0, (tsr.currentRun.currencyEarned || 0) - cost);
        addTsrLog(`缓刑获准！+30秒，缴纳${cost}秘境币`, 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleSpiritParadeRoom() {
    const sp = ensureTsrSpiritPet();
    if (sp.level < 36) {
        addTsrLog('星灵巡礼需精灵36级以上', 'warning');
        finishTsrMemeRoom();
        return;
    }
    showTsrMemePanel('🎊 星灵巡礼', `${getTsrSpiritDisplayName()}被彩带与星辉包围，巡礼队伍向你招手。`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSpiritParade('join')">加入巡礼 · 经验+110 亲密度+12 30%得巡礼旌旗</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSpiritParade('firework')">燃放花火 · 经验+100 充能+40 亲密度+10</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSpiritParade('duel')">巡游应战 · 星尘幼灵战+120×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('星灵巡礼：鼓点与星辉同频', 'info');
}

function tsrChooseSpiritParade(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'spiritparade' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'join') {
        if (tsr.currentRun.timeLeft <= 28) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 22;
        addTsrSpiritExp(Math.floor(110 * getTsrSpiritRoomMult()));
        addTsrSpiritBond(12);
        chargeTsrSpirit(25);
        if (Math.random() < 0.3) tryGrantTsrExclusiveRelic('paradeBanner', 0.55, '星灵巡礼');
        addTsrLog('加入巡礼！经验+110，亲密度+12，充能+25', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'firework') {
        if (tsr.currentRun.timeLeft <= 20) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 15;
        addTsrSpiritExp(100);
        addTsrSpiritBond(10);
        chargeTsrSpirit(40);
        addTsrLog('花火绽放！经验+100，亲密度+10，充能+40', 'success');
        invalidateTsrUiCache('spirit');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'duel') {
        chargeTsrSpirit(20);
        room.monster = getTsrMonsterById('starling') || pickTsrMonster(false, true, tsr.currentRun.currentFloor, dm);
        room.isElite = true;
        room.isBoss = false;
        room.rewards = generateRoomRewards('elite', dm);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.6 + 120 * dm);
        handleBattleRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleVoidriftRoom() {
    const sp = ensureTsrSpiritPet();
    if (sp.level < 25) {
        addTsrLog('虚空裂隙需精灵25级以上', 'warning');
        finishTsrMemeRoom();
        return;
    }
    showTsrMemePanel('🕳️ 虚空裂隙', '裂隙深处传来低语，边缘星光如刀锋般闪烁。',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseVoidrift('dive')">深潜裂隙 · 50%大丰收或反噬战</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseVoidrift('anchor')">锚定边缘 · +40秒 攻击+15%×3</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseVoidrift('beacon')">投放信标 · 预览2层 充能+30</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">撤离</button>`);
    addTsrLog('虚空裂隙：引力在拉扯时间', 'warning');
}

function tsrChooseVoidrift(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'voidrift' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'dive') {
        if (tsr.currentRun.timeLeft <= 30) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 25;
        if (Math.random() < 0.5) {
            if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
            tsr.lifetimeStats.voidriftDives = (tsr.lifetimeStats.voidriftDives || 0) + 1;
            const g = addTsrRunCurrency(Math.floor(180 * dm));
            tsr.currentRun.timeLeft += 35;
            addTsrSpiritExp(Math.floor(80 * getTsrSpiritRoomMult()));
            addTsrLog(`深潜成功！获得${g}秘境币，+35秒，经验+80`, 'success');
            checkTsrAchievements();
            finishTsrMemeRoom();
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('裂隙反噬！受到8%伤害，虚空兽扑来', 'error');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
            room.monster = getTsrMonsterById('voidsentinel') || pickTsrMonsterMinTier(false, true, 'rare', tsr.currentRun.currentFloor, dm);
            room.isElite = true;
            room.isBoss = false;
            room.rewards = generateRoomRewards('elite', dm);
            handleBattleRoom();
        }
        return;
    }
    if (path === 'anchor') {
        tsr.currentRun.timeLeft += 40;
        addTempBuff({ name: '裂隙锚定', effect: 'attack', value: 0.15, duration: 3, isDebuff: false });
        addTsrLog('锚定成功！+40秒，攻击+15%×3', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'beacon') {
        if (tsr.currentRun.timeLeft <= 18) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, 2);
        updateTsrRoomPreview();
        chargeTsrSpirit(30);
        addTsrLog('信标投放！预览2层，充能+30', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function getTsrAffixForgeTarget() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room?.monster) return null;
    const isCombat = room.type === 'battle' || room.type === 'elite' || room.type === 'boss' || room.isBoss || room.isElite;
    if (!isCombat) return null;
    return {
        monster: room.monster,
        room,
        isBoss: !!room.isBoss || room.type === 'boss',
        isElite: !!room.isElite || room.type === 'elite',
        floor: tsr.currentRun.currentFloor || 1
    };
}

function handleAffixForgeRoom() {
    const target = getTsrAffixForgeTarget();
    const hasAffix = (target?.monster?.affixKeys || []).length > 0;
    const stripLabel = hasAffix ? '剥离词条 · 随机移除1条 +95×难度币' : '剥离词条 · 需当前守关怪带词条';
    showTsrMemePanel('🔥 词条熔炉', '熔炉中悬浮着一枚枚发光铭文，可拆解或铸造怪物词条。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseAffixForge('strip')" ${hasAffix ? '' : 'disabled'}>${stripLabel}</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseAffixForge('reforge')">铭文重铸 · 重掷全部词条 -20秒</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseAffixForge('purify')">净化熔炼 · 清空词条 回血15% 攻击+18%×4</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseAffixForge('imprint')">铭文铸造 · 附加1词条或下战必带词条</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="tsrChooseAffixForge('codex')">词条通晓 · 收录2种词条 充能+30</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('词条熔炉：铭文噼啪作响', 'info');
}

function tsrChooseAffixForge(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'affixforge' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const target = getTsrAffixForgeTarget();
    if (path === 'strip') {
        if (!target || !(target.monster.affixKeys || []).length) {
            addTsrLog('当前守关怪没有可剥离的词条', 'warning');
            finishTsrMemeRoom();
            return;
        }
        if (tsr.currentRun.timeLeft <= 18) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 15;
        const removed = stripTsrMonsterAffix(target.monster);
        const g = addTsrRunCurrency(Math.floor(95 * dm));
        addTsrLog(`剥离成功！移除【${removed?.icon || ''}${removed?.name || '词条'}】，获得${g}秘境币`, 'success');
        updateCurrentRoomDisplay();
        finishTsrMemeRoom();
        return;
    }
    if (path === 'reforge') {
        if (!target) {
            addTsrLog('当前没有可重铸的守关怪', 'warning');
            finishTsrMemeRoom();
            return;
        }
        if (tsr.currentRun.timeLeft <= 25) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 20;
        const count = Math.max(1, (target.monster.affixKeys || []).length);
        rerollTsrMonsterAffixes(target.monster, target.isBoss, target.isElite, target.floor, count);
        recordTsrMonsterAffixCodex(target.monster.affixKeys);
        const names = (target.monster.affixKeys || []).map(k => {
            const ax = getTsrMonsterAffixDef(k);
            return (ax?.icon || '') + (ax?.name || k);
        }).join(' · ') || '无';
        addTsrLog(`铭文重铸！守关怪词条变为：${names}`, 'success');
        if (Math.random() < 0.35) addTsrConsumable('affixScope');
        updateCurrentRoomDisplay();
        finishTsrMemeRoom();
        return;
    }
    if (path === 'purify') {
        if (target && (target.monster.affixKeys || []).length) target.monster.affixKeys = [];
        tsrHealPlayer(0.15);
        addTempBuff({ name: '净化熔炼', effect: 'attack', value: 0.18, duration: 4, isDebuff: false });
        addTsrLog('净化完成！词条清空，回血15%，攻击+18%×4', 'success');
        updateCurrentRoomDisplay();
        finishTsrMemeRoom();
        return;
    }
    if (path === 'imprint') {
        if (tsr.currentRun.timeLeft <= 22) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 18;
        if (target && (target.monster.affixKeys || []).length < 2) {
            const extra = rollTsrMonsterAffixKeys(target.monster, target.isBoss, target.isElite, target.floor).filter(k => !(target.monster.affixKeys || []).includes(k));
            if (extra.length) {
                target.monster.affixKeys = [...(target.monster.affixKeys || []), extra[0]];
                const ax = getTsrMonsterAffixDef(extra[0]);
                recordTsrMonsterAffixCodex([extra[0]]);
                addTsrLog(`铭文铸造！守关怪获得词条【${ax?.icon || ''}${ax?.name || extra[0]}】`, 'success');
                if (Math.random() < 0.22) addTsrConsumable('affixScope');
                updateCurrentRoomDisplay();
            } else {
                tsr.currentRun.nextBattleExtraAffix = true;
                addTsrLog('铸造余波！下一场战斗怪将额外附着词条', 'success');
            }
        } else {
            tsr.currentRun.nextBattleExtraAffix = true;
            tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + 0.15;
            addTsrLog('铸造余波！下一场战斗怪将额外附着词条，词条赏金+15%', 'success');
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'codex') {
        const pool = Object.keys(TSR_MONSTER_AFFIXES).filter(k => (TSR_MONSTER_AFFIXES[k].weight || 0) > 0);
        const picks = [];
        while (picks.length < 2 && pool.length) {
            const k = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
            picks.push(k);
        }
        recordTsrMonsterAffixCodex(picks);
        chargeTsrSpirit(30);
        const names = picks.map(k => TSR_MONSTER_AFFIXES[k]?.name || k).join('、');
        addTsrLog(`词条通晓！图鉴收录：${names}，充能+30`, 'success');
        checkTsrAchievements();
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleAffixHuntRoom() {
    const tsr = player.timeSecretRealm;
    const floor = tsr.currentRun.currentFloor;
    const dm = tsr.currentRun.difficultyMultiplier;
    const target = pickTsrMonster(false, true, floor, dm);
    assignTsrMonsterAffixes(target, false, true, floor);
    let guard = 0;
    while ((target.affixKeys || []).length < 2 && guard++ < 8) {
        const extra = rollTsrMonsterAffixKeys(target, false, true, floor).filter(k => !(target.affixKeys || []).includes(k));
        if (!extra.length) break;
        target.affixKeys.push(extra[0]);
    }
    tsr.currentRun.huntTarget = target;
    const affixPlain = formatTsrMonsterAffixPlain(target) || '未知词条';
    showTsrMemePanel('🏷️ 词条狩猎场', `悬赏令：${formatTsrMonsterNameHtml(target)}<br>词条：${affixPlain}<br>「专猎带词条者，赏金加倍。」`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseAffixHunt('fight')">接受狩猎 · 双词条精英战</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseAffixHunt('study')">词条研习 · -12秒 图鉴+1 赏金+20%</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('词条狩猎场：铭文在布告栏上闪烁', 'info');
}

function tsrChooseAffixHunt(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'affixhunt' || !room.explored) return;
    const target = tsr.currentRun.huntTarget || pickTsrMonster(false, true, tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
    tsr.currentRun.huntTarget = null;
    hideTsrChoicePanels();
    if (path === 'fight') {
        ensureTsrMonsterAffixes(target, { isElite: true, floor: tsr.currentRun.currentFloor });
        while ((target.affixKeys || []).length < 2) {
            const extra = rollTsrMonsterAffixKeys(target, false, true, tsr.currentRun.currentFloor).filter(k => !(target.affixKeys || []).includes(k));
            if (!extra.length) break;
            target.affixKeys.push(extra[0]);
        }
        room.monster = target;
        room.isElite = true;
        room.rewards = generateRoomRewards('elite', tsr.currentRun.difficultyMultiplier);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.55);
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        if (Math.random() < 0.4) addTsrConsumable('affixScope');
        addTsrLog('词条狩猎完成！', 'success');
        afterAction();
        return;
    }
    if (path === 'study') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        recordTsrMonsterAffixCodex(target.affixKeys || []);
        tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + 0.2;
        chargeTsrSpirit(15);
        addTsrLog('词条研习完成！图鉴收录，下战词条赏金+20%，充能+15', 'success');
        checkTsrAchievements();
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleRelicAltarRoom() {
    const tsr = player.timeSecretRealm;
    const relics = tsr.currentRun.relics || [];
    const hasRelic = relics.length > 0;
    showTsrMemePanel('🏺 遗物祭坛', '祭坛低语：献祭可换神恩，祈福亦可获得庇护。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseRelicAltar('sacrifice')" ${hasRelic ? '' : 'disabled'}>献祭遗物 · 50%新遗物或攻击+22%×4</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseRelicAltar('bless')">祈福 · -18秒 回血20% 充能+35</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseRelicAltar('forge')">熔铸 · 消耗1遗物 +150×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('遗物祭坛：残存神性在柱间流转', 'info');
}

function tsrChooseRelicAltar(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'relicaltar' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const relics = tsr.currentRun.relics || [];
    if (path === 'sacrifice') {
        if (!relics.length) { finishTsrMemeRoom(); return; }
        const key = relics[Math.floor(Math.random() * relics.length)];
        removeTsrRunRelic(key);
        const r = TSR_RELIC_POOL[key];
        if (Math.random() < 0.5 && relics.length - 1 < getTsrRelicMax()) {
            const pick = rollTsrRelicChoices(1)[0];
            if (pick) addTsrRelic(pick);
            addTsrLog(`献祭【${r?.name || key}】！祭坛赐予新遗物`, 'success');
        } else {
            addTempBuff({ name: '祭坛神恩', effect: 'attack', value: 0.22, duration: 4, isDebuff: false });
            addTsrLog(`献祭【${r?.name || key}】！获得攻击+22%×4`, 'success');
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'bless') {
        if (tsr.currentRun.timeLeft <= 20) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 18;
        tsrHealPlayer(0.2);
        chargeTsrSpirit(35);
        addTsrLog('祈福完成！回血20%，充能+35', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'forge') {
        if (!relics.length) { addTsrLog('没有可熔铸的遗物', 'warning'); finishTsrMemeRoom(); return; }
        const key = relics[relics.length - 1];
        removeTsrRunRelic(key);
        const g = addTsrRunCurrency(Math.floor(150 * dm));
        addTsrLog(`熔铸【${TSR_RELIC_POOL[key]?.name || key}】！获得${g}秘境币`, 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleBondSanctuaryRoom() {
    showTsrMemePanel('💞 羁绊圣所', `${getTsrSpiritDisplayName()}的灵光在圣所中脉动，可深化羁绊或汲取灵息。`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseBondSanctuary('bond')">羁绊深化 · 亲密度+18 经验+90</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseBondSanctuary('charge')">灵息汲取 · 充能+55 -12秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseBondSanctuary('oath')">永恒誓约 · 亲密度+10 攻击+15%×3</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('羁绊圣所：灵与灵的回响在此交汇', 'info');
}

function tsrChooseBondSanctuary(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'bondsanctuary' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'bond') {
        addTsrSpiritBond(18);
        addTsrSpiritExp(Math.floor(90 * getTsrSpiritRoomMult()));
        addTsrLog('羁绊深化！亲密度+18，经验+90', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'charge') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        chargeTsrSpirit(55);
        addTsrLog('灵息汲取！充能+55', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'oath') {
        addTsrSpiritBond(10);
        addTempBuff({ name: '永恒誓约', effect: 'attack', value: 0.15, duration: 3, isDebuff: false });
        addTsrLog('永恒誓约！亲密度+10，攻击+15%×3', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleChampionHallRoom() {
    showTsrMemePanel('🏆 冠军殿堂', '历届冠军残影列队：「证明你配站上这里。」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseChampionHall('gauntlet')">殿堂三连战 · 三波精英</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseChampionHall('trophy')">瞻仰奖杯 · -15秒 +110×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('冠军殿堂：战旗猎猎，残影静候', 'warning');
}

function tsrChooseChampionHall(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'championhall' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'gauntlet') {
        handleTsrChampionGauntlet();
        return;
    }
    if (path === 'trophy') {
        if (tsr.currentRun.timeLeft <= 17) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 15;
        const g = addTsrRunCurrency(Math.floor(110 * dm));
        addTsrLog(`瞻仰奖杯！获得${g}秘境币`, 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleTsrChampionGauntlet() {
    const tsr = player.timeSecretRealm;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const floor = tsr.currentRun.currentFloor;
    const waves = [
        { label: '殿堂第1波·竞技冠军', monster: getTsrMonsterById('arenachampion'), isElite: true, isBoss: false, scale: 0.74 },
        { label: '殿堂第2波·词条怨灵', monster: getTsrMonsterById('affixwraith'), isElite: true, isBoss: false, scale: 0.86 },
        { label: '殿堂第3波·天穹猎手', monster: getTsrMonsterById('celestialhunter'), isElite: true, isBoss: false, scale: 0.98 }
    ];
    addTsrLog('🏆 冠军殿堂三连战开幕！', 'warning');
    for (let wi = 0; wi < waves.length; wi++) {
        const w = waves[wi];
        const monster = Object.assign({}, w.monster || pickTsrMonster(false, true, floor, dm));
        ensureTsrMonsterAffixes(monster, { isBoss: false, isElite: true, floor });
        if (wi === 1) {
            while ((monster.affixKeys || []).length < 2) {
                const extra = rollTsrMonsterAffixKeys(monster, false, true, floor).filter(k => !(monster.affixKeys || []).includes(k));
                if (!extra.length) break;
                monster.affixKeys.push(extra[0]);
            }
        }
        const stats = computeTsrMonsterStats({ isBoss: false, isElite: true, floor, difficultyMultiplier: dm, monster });
        updateTsrMonsterBanner(monster, stats, false, true);
        addTsrLog(`${w.label}：${formatTsrMonsterNamePlain(monster)}`, 'info');
        const waveAffixes = getTsrMonsterAffixList(monster);
        if (waveAffixes.length) {
            addTsrLog(`🏷️ 怪物词条：${waveAffixes.map(a => a.icon + a.name).join(' · ')}`, 'warning');
            recordTsrMonsterAffixCodex(monster.affixKeys);
        }
        let monsterHp = Math.floor(stats.hp * w.scale);
        const monsterMaxHp = monsterHp;
        const monsterAtk = Math.floor(stats.atk * w.scale);
        const atkBonus = getTsrBattleAttackBonus(false, true);
        let rounds = 0;
        let victory = false;
        tsr.currentRun.monsterShield = 0;
        while (rounds < 12 && monsterHp > 0) {
            rounds++;
            const hit = calculateBattleDamage();
            let dmgMult = (1 + atkBonus);
            if ((monster?.affixKeys || []).length) dmgMult *= (1 + getTsrAffixAttackBonus(monster));
            if (tsr.currentRun.monsterShield > 0) dmgMult *= (1 - tsr.currentRun.monsterShield);
            const dmg = Math.max(1, Math.floor((Number(hit.damage) || 0) * dmgMult));
            monsterHp = Math.max(0, monsterHp - dmg);
            monsterHp = tryTsrSpiritBattleStrike(rounds, monsterHp, false, monster, monsterMaxHp);
            const _hpZr = tryTsrMonsterHpZero(monster, monsterHp, monsterMaxHp, monsterAtk, { isBoss: false, isElite: true, rounds });
            monsterHp = _hpZr.monsterHp;
            monsterMaxHp = _hpZr.monsterMaxHp;
            monsterAtk = _hpZr.monsterAtk;
            if (_hpZr.isDead) victory = true;
            if (monster && rounds % 2 === 0 && !victory) {
                monsterHp = applyTsrMonsterAffixRound(monster, rounds, monsterHp, monsterMaxHp);
                if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); afterAction(); return; }
                monsterHp = applyTsrMonsterSkill(monster, rounds, monsterHp, calculateTsrPlayerAttack(), dm, false, true) || monsterHp;
                if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); afterAction(); return; }
            }
            let counterMult = getTsrCounterDamageMultiplier();
            counterMult *= 1 + getTsrMonsterAffixCounterMult(monster, rounds, monsterHp, monsterMaxHp);
            counterMult *= Math.max(0.4, 1 - getTsrMonsterAffixCounterReduce(monster));
            const counter = Math.max(1, Math.floor(monsterAtk * getTsrBattleCounterRatio(false, true, dm) * 1.08 * counterMult * (victory ? TSR_DEATH_COUNTER_RATIO : 1)));
            applyDamage(counter);
            if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); afterAction(); return; }
            if (victory) break;
        }
        if (!victory || bLteZero(tsr.currentRun.playerHealth)) {
            hideTsrMonsterBanner();
            addTsrLog(`殿堂挑战在第${wi + 1}波中止`, 'error');
            afterAction();
            return;
        }
        onTsrMonsterAffixVictory(monster);
        onTsrMonsterBattleVictory(monster);
        tsr.currentRun.battleWinStreak = (tsr.currentRun.battleWinStreak || 0) + 1;
        addTsrLog(`${w.label}击破！${wi < waves.length - 1 ? '下一波冠军登场……' : '殿堂认主！'}`, 'success');
        if (wi < waves.length - 1) tsrHealPlayer(0.08);
    }
    hideTsrMonsterBanner();
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.championClears = (tsr.lifetimeStats.championClears || 0) + 1;
    tsr.currentRun.championClearThisRun = true;
    bumpTsrEngagement('dailyChampionClear', 1);
    bumpTsrQuestProgress('weeklyChampionClears', 1);
    const gained = addTsrRunCurrency(Math.floor(200 * dm), { eliteBonus: true, combo: true });
    tsr.currentRun.timeLeft += 25;
    addTsrSpiritExp(Math.floor(80 * getTsrSpiritRoomMult()));
    if (Math.random() < 0.35) addTsrConsumable('championMedal');
    if (Math.random() < 0.28 && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
        const pick = rollTsrRelicChoices(1)[0];
        if (pick) addTsrRelic(pick);
    }
    addTsrLog(`🏆 殿堂三连战成功！额外${gained}秘境币，+25秒`, 'success');
    checkTsrAchievements();
    finishTsrMemeRoom();
    afterAction();
}

function handleSynergyShrineRoom() {
    const tsr = player.timeSecretRealm;
    const primary = tsr.selectedContract || 'none';
    const sub = canUseTsrSubContract() ? (tsr.selectedSubContract || 'none') : 'none';
    const synergy = getTsrContractSynergy(primary, sub);
    const synHint = synergy ? `当前可激活：【${synergy.name}】${synergy.desc}` : '双契约组合可触发羁绊加成';
    showTsrMemePanel('🔗 羁绊神殿', `契约铭文在柱上闪烁。<br><small>${synHint}</small>`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSynergyShrine('amplify')">羁绊增幅 · 本局羁绊效果+35%</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSynergyShrine('insight')">契约洞察 · -10秒 预览1种羁绊组合</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSynergyShrine('pray')">神龛祈福 · 充能+40 币+70×难度</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('羁绊神殿：双约之纹缓缓亮起', 'info');
}

function tsrChooseSynergyShrine(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'synergyshrine' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'amplify') {
        tsr.currentRun.synergyAmp = Math.max(tsr.currentRun.synergyAmp || 1, 1.35);
        addTsrLog('羁绊增幅！本局契约羁绊效果+35%', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'insight') {
        if (tsr.currentRun.timeLeft <= 12) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 10;
        const pick = TSR_CONTRACT_SYNERGIES[Math.floor(Math.random() * TSR_CONTRACT_SYNERGIES.length)];
        addTsrLog(`契约洞察！【${pick.name}】${pick.desc}（${pick.keys.join('+')}）`, 'info');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'pray') {
        chargeTsrSpirit(40);
        const g = addTsrRunCurrency(Math.floor(70 * dm));
        addTsrLog(`神龛祈福！充能+40，获得${g}秘境币`, 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleLayoffRoom() {
    showTsrMemePanel('📦 毕业欢送会', 'HR微笑递来纸箱：「感谢你的贡献，这是N+1……大概吧。」',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseLayoff('negotiate')">谈判N+1 · 50% +180×难度币或-8%血</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseLayoff('walk')">体面离开 · +35秒 回血10%</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseLayoff('revenge')">劳动仲裁 · 攻击+25%×3 -20秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">签收纸箱</button>`);
    addTsrLog('毕业欢送会：蛋糕上写着「优化」', 'warning');
}

function tsrChooseLayoff(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'layoff' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'negotiate') {
        if (Math.random() < 0.5) {
            const g = addTsrRunCurrency(Math.floor(180 * dm));
            addTsrLog(`谈判成功！获得${g}秘境币`, 'success');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('谈判破裂！压力扣8%血', 'error');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'walk') {
        tsr.currentRun.timeLeft += 35;
        tsrHealPlayer(0.1);
        addTsrLog('体面离开！+35秒，回血10%', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'revenge') {
        if (tsr.currentRun.timeLeft <= 22) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 20;
        addTempBuff({ name: '仲裁战意', effect: 'attack', value: 0.25, duration: 3, isDebuff: false });
        addTsrLog('劳动仲裁！攻击+25%×3', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleOkrreviewRoom() {
    showTsrMemePanel('📊 OKR复盘室', '主管打开表格：「你的O对齐了吗？KR完成了几个？」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseOkrreview('align')">强行对齐 · -18秒 +120×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseOkrreview('revise')">修订KR · 下战奖励+30%</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseOkrreview('stretch')">Stretch Goal · 50%攻击+20%×4或-15秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">下次再复盘</button>`);
    addTsrLog('OKR复盘：对齐颗粒度中……', 'info');
}

function tsrChooseOkrreview(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'okrreview' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'align') {
        if (tsr.currentRun.timeLeft <= 20) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 18;
        const g = addTsrRunCurrency(Math.floor(120 * dm));
        addTsrLog(`对齐成功！获得${g}秘境币`, 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'revise') {
        tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + 0.3;
        addTsrLog('KR修订！下战战斗奖励+30%', 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'stretch') {
        if (Math.random() < 0.5) {
            addTempBuff({ name: 'Stretch', effect: 'attack', value: 0.2, duration: 4, isDebuff: false });
            addTsrLog('Stretch Goal达成！攻击+20%×4', 'success');
        } else {
            if (tsr.currentRun.timeLeft <= 17) { finishTsrMemeRoom(); return; }
            tsr.currentRun.timeLeft -= 15;
            addTsrLog('Goal过于Stretch！-15秒', 'warning');
        }
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleFortuneWheelRoom() {
    showTsrMemePanel('🎨 彩运轮盘', '七色扇面旋转，指针划过<span class="tsr-txt-gold">金</span><span class="tsr-txt-spirit">灵</span><span class="tsr-txt-boss">战</span><span class="tsr-txt-meme">梗</span>各色命运格……',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseFortuneWheel('spin')">转轮 · -14秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseFortuneWheel('peek')">窥运 · -8秒 预览结果</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">不转了</button>`,
        'fortune');
    addTsrLog('🎨 彩运轮盘：「转到哪格，算哪格！」', 'info', 'fortune');
}

function tsrChooseFortuneWheel(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'fortunewheel' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const slots = [
        { label: '金星·财富洪流', theme: 'gold', fn: () => { const g = addTsrRunCurrency(Math.floor(150 * dm)); return `+${g}秘境币`; } },
        { label: '灵息·花绽', theme: 'spirit', fn: () => { chargeTsrSpirit(35); return '精灵充能+35'; } },
        { label: '战意·炽焰', theme: 'boss', fn: () => { addTempBuff({ name: '彩运战意', effect: 'attack', value: 0.3, duration: 3, isDebuff: false }); return '攻击+30%×3'; } },
        { label: '梗色·霓虹', theme: 'meme', fn: () => { tsr.currentRun.memeRoomBonus = 0.4; return '下次梗房收益+40%'; } },
        { label: '遗宝·微光', theme: 'relic', fn: () => { tsr.currentRun.nextEliteRelicBoost = (tsr.currentRun.nextEliteRelicBoost || 0) + 0.25; return '下战精英遗物率+25%'; } },
        { label: '野运·翻涌', theme: 'fortune', fn: () => { tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + 0.35; return '下战战斗奖励+35%'; } },
        { label: '厄运·褪色', theme: 'danger', fn: () => { applyDamage(bMul(tsr.currentRun.playerHealth, 0.08)); return '8%生命伤害'; } }
    ];
    if (path === 'peek') {
        if (tsr.currentRun.timeLeft <= 10) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 8;
        const preview = slots[Math.floor(Math.random() * slots.length)];
        addTsrLog(`窥运：指针倾向【${preview.label}】`, 'info', preview.theme);
        finishTsrMemeRoom();
        return;
    }
    if (tsr.currentRun.timeLeft <= 16) { finishTsrMemeRoom(); return; }
    tsr.currentRun.timeLeft -= 14;
    const pick = slots[Math.floor(Math.random() * slots.length)];
    const result = pick.fn();
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.fortuneWheelSpins = (tsr.lifetimeStats.fortuneWheelSpins || 0) + 1;
    addTsrLog(`🎨 彩运落定：<span class="tsr-txt-${pick.theme}">${pick.label}</span> → ${result}`, pick.theme === 'danger' ? 'error' : 'success', pick.theme);
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    updateTsrSpiritContractUI();
    finishTsrMemeRoom();
}

function handleLegendArchiveRoom() {
    showTsrMemePanel('📜 传奇见闻馆', '卷轴上浮现<span class="tsr-txt-epic">彩色铭文</span>，记载着历代冒险者的奇闻……',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseLegendArchive('read')">研读见闻 · -12秒 经验+60 图鉴+1</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseLegendArchive('inscribe')">铭刻残页 · -18秒 +100×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseLegendArchive('resonate')">共鸣回响 · 充能+45 亲密度+6</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`,
        'legend');
    addTsrLog('📜 传奇见闻馆：古卷低语，色彩流转', 'info', 'legend');
}

function tsrChooseLegendArchive(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'legendarchive' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'read') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        addTsrSpiritExp(Math.floor(60 * getTsrSpiritRoomMult()));
        tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + 0.1;
        addTsrLog('研读传奇见闻！经验+60，本局词条赏金+10%', 'success', 'legend');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'inscribe') {
        if (tsr.currentRun.timeLeft <= 20) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 18;
        const g = addTsrRunCurrency(Math.floor(100 * dm));
        addTsrLog(`铭刻残页！获得${g}秘境币`, 'success', 'gold');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'resonate') {
        chargeTsrSpirit(45);
        addTsrSpiritBond(6);
        addTsrLog('共鸣回响！充能+45，亲密度+6', 'success', 'spirit');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function getTsrSpecialRoomCurrencyMult() {
    const tsr = player.timeSecretRealm;
    if ((tsr?.currentRun?.specialRoomBonusUses || 0) > 0 && tsr.currentRun.specialRoomBonus) {
        return 1 + tsr.currentRun.specialRoomBonus;
    }
    return 1;
}

function consumeTsrSpecialRoomCurrencyBonus() {
    const tsr = player.timeSecretRealm;
    if ((tsr?.currentRun?.specialRoomBonusUses || 0) > 0) {
        tsr.currentRun.specialRoomBonusUses--;
        if (tsr.currentRun.specialRoomBonusUses <= 0) tsr.currentRun.specialRoomBonus = 0;
    }
}

function addTsrSpecialRoomCurrency(base) {
    const mult = getTsrSpecialRoomCurrencyMult();
    const gained = addTsrRunCurrency(Math.floor(base * mult));
    if (mult > 1) consumeTsrSpecialRoomCurrencyBonus();
    return gained;
}

function handleChronolibraryRoom() {
    showTsrMemePanel('📚 时序图书馆', '书架上的书页自动翻页，某一卷正对你发光……',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseChronolibrary('read')">研读秘闻 · -14秒 经验+70</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseChronolibrary('borrow')">借阅时光 · +110×难度币 -12秒</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseChronolibrary('archive')">归档抄录 · 预览2层 词条赏金+10%</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`,
        'legend');
    addTsrLog('📚 时序图书馆：「请勿在禁书区大声许愿。」', 'info', 'legend');
}

function tsrChooseChronolibrary(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'chronolibrary' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'read') {
        if (tsr.currentRun.timeLeft <= 16) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 14;
        addTsrSpiritExp(Math.floor(70 * getTsrSpiritRoomMult()));
        addTsrLog('研读时序秘闻！经验+70', 'success', 'legend');
    } else if (path === 'borrow') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        const g = addTsrSpecialRoomCurrency(Math.floor(110 * dm));
        addTsrLog(`借阅成功！获得${g}秘境币`, 'success', 'gold');
    } else if (path === 'archive') {
        tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, 2);
        tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + 0.1;
        updateTsrRoomPreview();
        addTsrLog('归档抄录！预览2层，本局词条赏金+10%', 'success', 'affix');
    }
    finishTsrMemeRoom();
}

function handleStarwishpoolRoom() {
    const sp = ensureTsrSpiritPet();
    showTsrMemePanel('🌠 星愿池', `${getTsrSpiritDisplayName()}在池边盘旋：「愿望要具体，手续费要现结。」`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseStarwishpool('coin')">投币许愿 · -40币 50% +180×难度币或-8%血</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseStarwishpool('spirit')">星辉沐浴 · 满充能+亲密度+10</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseStarwishpool('time')">许愿加时 · +28秒 -16秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`,
        'spirit');
    addTsrLog(`🌠 星愿池：Lv${sp.level} 的${getTsrSpiritDisplayName()}感到星辉牵引`, 'info', 'spirit');
}

function tsrChooseStarwishpool(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'starwishpool' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'coin') {
        if (tsr.currentRun.currencyEarned < 40) { addTsrLog('秘境币不足40', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 40;
        if (Math.random() < 0.5) {
            const g = addTsrSpecialRoomCurrency(Math.floor(180 * dm));
            addTsrLog(`星愿回应！获得${g}秘境币`, 'success', 'gold');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('愿望反噬！-8%生命', 'error', 'danger');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
        }
    } else if (path === 'spirit') {
        if (tsr.currentRun.timeLeft <= 18) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 16;
        chargeTsrSpirit(100);
        addTsrSpiritBond(10);
        addTsrLog('星辉沐浴！满充能觉醒，亲密度+10', 'success', 'spirit');
        invalidateTsrUiCache('spirit');
    } else if (path === 'time') {
        if (tsr.currentRun.timeLeft <= 18) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 16;
        tsr.currentRun.timeLeft += 28;
        addTsrLog('许愿加时！净得+12秒', 'success');
    }
    finishTsrMemeRoom();
}

function handleMirrormazeRoom() {
    showTsrMemePanel('🪞 镜像迷城', '走廊尽头有四面镜子，每面都映出不同的你……',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseMirrormaze('brave')">直走真路 · 50% +150×难度币或精英战</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseMirrormaze('study')">端详镜像 · -15秒 攻击+20%×3</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseMirrormaze('retreat')">原路返回 · +10秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('镜像迷城：你的倒影比你还紧张', 'info');
}

function tsrChooseMirrormaze(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'mirrormaze' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'brave') {
        if (Math.random() < 0.5) {
            const g = addTsrSpecialRoomCurrency(Math.floor(150 * dm));
            if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
            tsr.lifetimeStats.mirrorMazeWins = (tsr.lifetimeStats.mirrorMazeWins || 0) + 1;
            tsr.currentRun.mirrorMazeWinThisRun = true;
            addTsrLog(`迷城破局！获得${g}秘境币`, 'success', 'gold');
            checkTsrAchievements();
        } else {
            addTsrLog('走入假路！镜像精英浮现', 'warning');
            const floor = tsr.currentRun.currentFloor;
            const monster = pickTsrMonsterMinTier(false, true, 'rare', floor, dm);
            tsr.currentRun.currentRoom = {
                type: 'elite', name: '镜像迷城', explored: true, hasTrap: false,
                trap: null, trapDetected: false, trapDisarmed: false,
                isBoss: false, isElite: true, isShrine: false,
                rewards: generateRoomRewards('elite', dm),
                monster
            };
            finishTsrMemeRoom();
            handleBattleRoom({ forceElite: true });
            return;
        }
    } else if (path === 'study') {
        if (tsr.currentRun.timeLeft <= 17) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 15;
        addTempBuff({ name: '镜像战意', effect: 'attack', value: 0.2, duration: 3, isDebuff: false });
        addTsrLog('端详镜像！攻击+20%×3', 'success', 'boss');
    } else if (path === 'retreat') {
        tsr.currentRun.timeLeft += 10;
        addTsrLog('原路返回，保住10秒', 'info');
    }
    finishTsrMemeRoom();
}

function handleRunescriptoriumRoom() {
    showTsrMemePanel('📜 符文抄录室', `当前层间词缀：<b>${getTsrActiveAffix()?.name || '无'}</b>，符文师问：「要抄哪一笔？」`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseRunescriptorium('inscribe')">铭刻残页 · -16秒 +95×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseRunescriptorium('reroll')">重铸词缀 · -22秒 换一个新层间词缀</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseRunescriptorium('copy')">拓印词条 · 下战额外+1词条</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`,
        'affix');
    addTsrLog('符文抄录室：墨水里混着时光碎屑', 'info', 'affix');
}

function tsrChooseRunescriptorium(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'runescriptorium' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'inscribe') {
        if (tsr.currentRun.timeLeft <= 18) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 16;
        const g = addTsrSpecialRoomCurrency(Math.floor(95 * dm));
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.runeScribeRooms = (tsr.lifetimeStats.runeScribeRooms || 0) + 1;
        addTsrLog(`铭刻完成！获得${g}秘境币`, 'success', 'gold');
        checkTsrAchievements();
    } else if (path === 'reroll') {
        if (tsr.currentRun.timeLeft <= 24) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 22;
        applyTsrFloorAffix(rollTsrFloorAffix());
        addTsrLog(`重铸层间词缀为【${getTsrActiveAffix()?.name || '未知'}】`, 'success', 'affix');
    } else if (path === 'copy') {
        tsr.currentRun.nextBattleExtraAffix = true;
        tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + 0.12;
        addTsrLog('拓印词条！下战怪物额外+1词条，赏金+12%', 'success', 'affix');
    }
    finishTsrMemeRoom();
}

function handleTimeloomRoom() {
    showTsrMemePanel('🧵 时光织机', '丝线缠绕成沙漏形状，织工抬头：「要织时间，得先付线钱。」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseTimeloom('weave')">织入时光 · -18秒 +35秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseTimeloom('cut')">剪断冗余 · 行动耗时-12%×4层</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseTimeloom('sell')">出售线团 · +120×难度币 -10秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('时光织机：每一根线都是借来的秒数', 'info');
}

function tsrChooseTimeloom(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'timeloom' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'weave') {
        if (tsr.currentRun.timeLeft <= 20) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 18;
        tsr.currentRun.timeLeft += 35;
        addTsrLog('织入时光！净得+17秒', 'success');
    } else if (path === 'cut') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        tsr.currentRun.chronoCapsuleFloors = Math.max(tsr.currentRun.chronoCapsuleFloors || 0, 4);
        addTsrLog('剪断冗余！接下来4层行动耗时-10%', 'success');
    } else if (path === 'sell') {
        if (tsr.currentRun.timeLeft <= 12) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 10;
        const g = addTsrSpecialRoomCurrency(Math.floor(120 * dm));
        addTsrLog(`出售线团！获得${g}秘境币`, 'success', 'gold');
    }
    finishTsrMemeRoom();
}

function handleCombostormRoom() {
    const streak = player.timeSecretRealm.currentRun?.battleWinStreak || 0;
    showTsrMemePanel('🌪️ 连击风暴', `风暴会放大下两场战斗的连击收益（当前连击×${streak}）。选择承受强度：`,
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseCombostorm('mild')">微风 · 赏金+50%×2战</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseCombostorm('storm')">狂风暴 · 赏金+100%×2战，反击+10%</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">撤离风暴</button>`);
    addTsrLog('连击风暴：战意与风险并存', 'info');
}

function tsrChooseCombostorm(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'combostorm' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'mild') {
        tsr.currentRun.comboStormMult = 1.5;
        tsr.currentRun.comboStormBattlesLeft = 2;
        tsr.currentRun.comboStormCounterPenalty = 0;
        addTsrLog('微风加持！下2场战斗赏金+50%', 'success');
    } else if (path === 'storm') {
        tsr.currentRun.comboStormMult = 2;
        tsr.currentRun.comboStormBattlesLeft = 2;
        tsr.currentRun.comboStormCounterPenalty = 0.1;
        if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
        tsr.lifetimeStats.comboStormStorm = (tsr.lifetimeStats.comboStormStorm || 0) + 1;
        addTsrLog('狂风暴降临！下2场赏金+100%，反击+10%', 'warning');
        checkTsrAchievements();
    }
    finishTsrMemeRoom();
}

function handleBattleriftRoom() {
    showTsrMemePanel('🌀 战斗裂隙', '裂隙中浮现三位守关幻影，择一决斗：',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseBattlerift('scout')">斥候 · 普通战+80×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseBattlerift('knight')">骑士 · 精英战+150×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseBattlerift('lord')">领主 · 精英战+遗物机会</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">关闭裂隙</button>`);
    addTsrLog('战斗裂隙：时空不稳定，请快速抉择', 'info');
}

function tsrChooseBattlerift(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'battlerift' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const floor = tsr.currentRun.currentFloor;
    if (path === 'scout') {
        room.monster = {
            id: 'riftscout', name: '裂隙斥候', icon: '👤', tier: 'uncommon',
            intro: '「裂隙里的战斗，不计入KPI。」', win: '斥候化为光点消散。',
            skill: 'slow', skillChance: 0.25
        };
        room.rewards = { currency: Math.floor(80 * dm), buffChance: 0.3 };
        room.battleTacticChosen = true;
        handleBattleRoom();
    } else if (path === 'knight') {
        room.isElite = true;
        room.monster = {
            id: 'riftknight', name: '裂隙骑士', icon: '🛡️', tier: 'rare',
            intro: '「此路是我封，留下买路财。」', win: '骑士交出了裂隙密钥。',
            skill: 'shield', skillChance: 0.32, skillValue: 0.18
        };
        room.rewards = { currency: Math.floor(150 * dm), buffChance: 0.45 };
        room.battleTacticChosen = true;
        handleBattleRoom({ forceElite: true });
    } else if (path === 'lord') {
        room.isElite = true;
        room.monster = {
            id: 'riftlord', name: '裂隙领主', icon: '👑', tier: 'epic',
            intro: '「打赢我，遗物或时间，二选一。」', win: '领主退入裂隙深处。',
            skill: 'multiStrike', skillChance: 0.35
        };
        room.rewards = { currency: Math.floor(120 * dm), buffChance: 0.5 };
        room.battleTacticChosen = true;
        tsr.currentRun.nextEliteRelicBoost = 0.25;
        handleBattleRoom({ forceElite: true });
    }
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    if (path !== 'none') {
        tsr.lifetimeStats.battleRiftDuels = (tsr.lifetimeStats.battleRiftDuels || 0) + 1;
        checkTsrAchievements();
    }
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    finishTsrMemeRoom();
}

function handleWararchiveRoom() {
    const btns = Object.entries(TSR_BATTLE_TACTICS).map(([key, t]) =>
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseWararchive('${key}')">${t.icon} 研习${t.name} · 下2战生效</button>`
    ).join('');
    showTsrMemePanel('📜 战策古卷', '古卷记载五种战策，择一研习并应用于接下来两场战斗：',
        btns + `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseWararchive('study')">纯研读 · +60×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('战策古卷：纸页间有刀光剑影', 'info');
}

function tsrChooseWararchive(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'wararchive' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'study') {
        const g = addTsrRunCurrency(Math.floor(60 * dm));
        addTsrLog(`研读战策心得，获得${g}秘境币`, 'success');
    } else if (TSR_BATTLE_TACTICS[path]) {
        const t = TSR_BATTLE_TACTICS[path];
        tsr.currentRun.battleTacticKey = path;
        tsr.currentRun.warArchiveBattlesLeft = 2;
        addTsrLog(`研习战策「${t.name}」！下2场战斗自动生效`, 'success');
    }
    finishTsrMemeRoom();
}

function handleBloodarenaRoom() {
    showTsrMemePanel('🩸 血战竞技场', '竞技场规则：每回合失血3%，但胜利赏金翻倍。是否入场？',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseBloodarena('fight')">血战入场 · 精英战赏金×2</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseBloodarena('cheer')">场外助威 · +40×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('血战竞技场：观众席传来欢呼与嘘声', 'warning');
}

function tsrChooseBloodarena(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'bloodarena' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const floor = tsr.currentRun.currentFloor;
    if (path === 'fight') {
        room.isBloodArena = true;
        room.isElite = true;
        room.battleTacticChosen = true;
        if (!room.monster) room.monster = pickTsrMonster(false, true, floor, dm);
        room.rewards = room.rewards || { currency: Math.floor(100 * dm), buffChance: 0.4 };
        addTsrLog('血战开始！每回合失血，赏金翻倍', 'warning');
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
    } else if (path === 'cheer') {
        const g = addTsrRunCurrency(Math.floor(40 * dm));
        addTsrLog(`场外助威获得${g}秘境币`, 'success');
    }
    finishTsrMemeRoom();
}

function handleMeetingmarathonRoom() {
    showTsrMemePanel('🏃 马拉松会议', '白板写满「对齐、拉通、闭环」，主持人：「再开十分钟。」',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseMeetingmarathon('endure')">硬撑到底 · 50% +130×难度币或-20秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseMeetingmarathon('mute')">静音摸鱼 · +18秒 -6%血</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseMeetingmarathon('escape')">借口离席 · +25秒 -55×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">继续开会</button>`,
        'meme');
    addTsrLog('马拉松会议：PPT第38页，你第38次看表', 'info', 'meme');
}

function tsrChooseMeetingmarathon(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'meetingmarathon' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'endure') {
        if (Math.random() < 0.5) {
            const g = addTsrRunCurrency(Math.floor(130 * dm * (1 + (tsr.currentRun.memeRoomBonus || 0))));
            if (tsr.currentRun.memeRoomBonus) tsr.currentRun.memeRoomBonus = 0;
            addTsrLog(`会议终于散了！获得${g}秘境币`, 'success', 'gold');
        } else {
            tsr.currentRun.timeLeft -= 20;
            addTsrLog('会议加时！-20秒', 'error', 'danger');
        }
    } else if (path === 'mute') {
        tsr.currentRun.timeLeft += 18;
        applyDamage(bMul(tsr.currentRun.playerHealth, 0.06));
        addTsrLog('摸鱼成功！+18秒，但心虚-6%血', 'warning', 'meme');
        if (bLteZero(tsr.currentRun.playerHealth)) return;
    } else if (path === 'escape') {
        if (tsr.currentRun.currencyEarned < 55) { addTsrLog('秘境币不够买借口', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 55;
        tsr.currentRun.timeLeft += 25;
        addTsrLog('借口离席！+25秒', 'success');
    }
    finishTsrMemeRoom();
}

function handleSlackoutageRoom() {
    showTsrMemePanel('💬 消息宕机', 'Slack显示红色横幅：「服务暂时不可用，请改用邮件。」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseSlackoutage('refresh')">疯狂刷新 · 50% +100×难度币或-12秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseSlackoutage('offline')">离线养生 · +22秒 回血10%</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseSlackoutage('spam')">邮件轰炸 · 攻击+18%×3 -14秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">等恢复</button>`,
        'meme');
    addTsrLog('消息宕机：终于没人@你了', 'info', 'meme');
}

function tsrChooseSlackoutage(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'slackoutage' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'refresh') {
        if (Math.random() < 0.5) {
            const g = addTsrRunCurrency(Math.floor(100 * dm * (1 + (tsr.currentRun.memeRoomBonus || 0))));
            if (tsr.currentRun.memeRoomBonus) tsr.currentRun.memeRoomBonus = 0;
            addTsrLog(`刷出来了！获得${g}秘境币`, 'success', 'gold');
        } else {
            tsr.currentRun.timeLeft -= 12;
            addTsrLog('刷新到超时！-12秒', 'error');
        }
    } else if (path === 'offline') {
        tsr.currentRun.timeLeft += 22;
        tsrHealPlayer(0.1);
        addTsrLog('离线养生！+22秒，回血10%', 'success', 'heal');
    } else if (path === 'spam') {
        if (tsr.currentRun.timeLeft <= 16) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 14;
        addTempBuff({ name: '邮件战意', effect: 'attack', value: 0.18, duration: 3, isDebuff: false });
        addTsrLog('邮件轰炸！攻击+18%×3', 'success', 'boss');
    }
    finishTsrMemeRoom();
}

function handleHotfix911Room() {
    showTsrMemePanel('🚑 紧急热修', 'PagerDuty尖叫：「线上炸了，五分钟内必须修！」',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseHotfix911('patch')">极限热修 · 50% +200×难度币或-8%血</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseHotfix911('rollback')">回滚保平安 · +30秒 -80×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseHotfix911('blame')">甩锅给缓存 · 攻击+25%×4 -18秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">装没看见</button>`,
        'meme');
    addTsrLog('紧急热修：文档？下次一定补', 'warning', 'meme');
}

function tsrChooseHotfix911(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'hotfix911' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'patch') {
        if (Math.random() < 0.5) {
            const g = addTsrRunCurrency(Math.floor(200 * dm * (1 + (tsr.currentRun.memeRoomBonus || 0))));
            if (tsr.currentRun.memeRoomBonus) tsr.currentRun.memeRoomBonus = 0;
            if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
            tsr.lifetimeStats.hotfixWins = (tsr.lifetimeStats.hotfixWins || 0) + 1;
            addTsrLog(`热修成功！获得${g}秘境币`, 'success', 'gold');
            checkTsrAchievements();
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('热修补丁更炸了！-8%血', 'error', 'danger');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
        }
    } else if (path === 'rollback') {
        if (tsr.currentRun.currencyEarned < 80) { addTsrLog('秘境币不够回滚', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 80;
        tsr.currentRun.timeLeft += 30;
        addTsrLog('回滚成功！+30秒', 'success');
    } else if (path === 'blame') {
        if (tsr.currentRun.timeLeft <= 20) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 18;
        addTempBuff({ name: '甩锅战意', effect: 'attack', value: 0.25, duration: 4, isDebuff: false });
        addTsrLog('甩锅成功！攻击+25%×4', 'success', 'boss');
    }
    finishTsrMemeRoom();
}

function handlePitchdeckRoom() {
    showTsrMemePanel('📊 融资路演厅', 'PPT翻到第<span class="tsr-txt-meme">47</span>页，投资人敲桌：「你们的<span class="tsr-txt-gold">护城河</span>在哪里？」',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChoosePitchdeck('pitch')">激情路演 · 50% +200×难度币或-8%血</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChoosePitchdeck('story')">讲故事 · -15秒 下战奖励+35%</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChoosePitchdeck('demo')">现场Demo · 攻击+22%×3 -12秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">下次融</button>`,
        'meme');
    addTsrLog('融资路演：「我们不是在烧钱，是在买时间」', 'info', 'meme');
}

function tsrChoosePitchdeck(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'pitchdeck' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'pitch') {
        if (Math.random() < 0.5) {
            const g = addTsrRunCurrency(Math.floor(200 * dm));
            addTsrLog(`路演成功！投资人打钱${g}秘境币`, 'success', 'gold');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('投资人离场！压力-8%血', 'error', 'danger');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'story') {
        if (tsr.currentRun.timeLeft <= 17) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 15;
        tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + 0.35;
        addTsrLog('故事打动人心！下战战斗奖励+35%', 'success', 'meme');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'demo') {
        if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 12;
        addTempBuff({ name: 'Demo战意', effect: 'attack', value: 0.22, duration: 3, isDebuff: false });
        addTsrLog('Demo惊艳全场！攻击+22%×3', 'success', 'boss');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handlePerfreviewRoom() {
    showTsrMemePanel('📈 绩效谈话', '主管翻开表格：「先说说你觉得自己这季度表现如何？」',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChoosePerfreview('selfS')">自评S级 · 50%攻击+22%×4或-18秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChoosePerfreview('promise')">承诺下季度 · -20秒 +130×难度币 经验+50</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChoosePerfreview('raise')">申请加薪 · +95×难度币 -8%血</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">下次再谈</button>`);
    addTsrLog('绩效谈话：PPT还没打开气氛已经紧张了', 'warning');
}

function tsrChoosePerfreview(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'perfreview' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'selfS') {
        if (Math.random() < 0.5) {
            addTempBuff({ name: '绩效S级', effect: 'attack', value: 0.22, duration: 4, isDebuff: false });
            addTsrLog('自评通过！攻击+22%×4', 'success');
        } else {
            if (tsr.currentRun.timeLeft <= 20) { finishTsrMemeRoom(); return; }
            tsr.currentRun.timeLeft -= 18;
            addTsrLog('主管挑眉：「证据呢？」-18秒', 'error');
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'promise') {
        if (tsr.currentRun.timeLeft <= 22) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 20;
        const g = addTsrRunCurrency(Math.floor(130 * dm));
        addTsrSpiritExp(Math.floor(50 * getTsrSpiritRoomMult()));
        addTsrLog(`画饼成功！获得${g}秘境币，经验+50`, 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'raise') {
        const g = addTsrRunCurrency(Math.floor(95 * dm));
        applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
        addTsrLog(`加薪批准（大概）！+${g}秘境币，但压力扣8%血`, 'warning');
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleTeamBuildingRoom() {
    showTsrMemePanel('🎳 团建密室', '横幅写着「凝聚力量」，角落堆着烧烤架和拓展训练道具。',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseTeamBuilding('truth')">真心话大冒险 · 随机增益或扣时</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseTeamBuilding('bbq')">团建烧烤 · 回血18% +22秒 -45×难度币</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseTeamBuilding('outdoor')">拓展训练 · 经验+85 亲密度+8</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">请假离开</button>`);
    addTsrLog('团建密室：老板正在找自愿表演节目的人', 'info');
}

function tsrChooseTeamBuilding(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'teamBuilding' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'truth') {
        const roll = Math.random();
        if (roll < 0.4) {
            addTempBuff({ name: '团建战神', effect: 'attack', value: 0.18, duration: 3, isDebuff: false });
            addTsrLog('大冒险成功！攻击+18%×3', 'success');
        } else if (roll < 0.7) {
            tsr.currentRun.timeLeft += 20;
            addTsrSpiritBond(5);
            addTsrLog('真心话环节！+20秒，亲密度+5', 'success');
        } else {
            if (tsr.currentRun.timeLeft <= 18) { finishTsrMemeRoom(); return; }
            tsr.currentRun.timeLeft -= 15;
            addTsrLog('抽到表演节目！-15秒', 'error');
        }
        finishTsrMemeRoom();
        return;
    }
    if (path === 'bbq') {
        const cost = Math.min(tsr.currentRun.currencyEarned || 0, Math.floor(45 * dm));
        tsr.currentRun.currencyEarned = Math.max(0, (tsr.currentRun.currencyEarned || 0) - cost);
        tsrHealPlayer(0.18);
        tsr.currentRun.timeLeft += 22;
        addTsrLog(`烧烤愉快！回血18%，+22秒，花费${cost}秘境币`, 'success');
        finishTsrMemeRoom();
        return;
    }
    if (path === 'outdoor') {
        if (tsr.currentRun.timeLeft <= 25) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 20;
        addTsrSpiritExp(Math.floor(85 * getTsrSpiritRoomMult()));
        addTsrSpiritBond(8);
        addTsrLog('拓展训练！经验+85，亲密度+8', 'success');
        finishTsrMemeRoom();
        return;
    }
    finishTsrMemeRoom();
}

function handleWeeklyRoom() {
    showTsrMemePanel('📋 周报评审室', '评审委员：「本周亮点不够亮，短板不够短。」',
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseWeekly('polish')">数据美化 · 30秒换币</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseWeekly('blame')">横向对比甩锅</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseWeekly('crunch')">通宵肝周报</button>`);
    addTsrLog('周报评审室：投影仪已就位', 'warning');
}

function tsrChooseWeekly(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'weekly' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'polish') {
        if (tsr.currentRun.timeLeft <= 32) { addTsrLog('来不及美化数据了', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 30;
        const gained = addTsrRunCurrency(Math.floor(95 * dm));
        addTsrLog(`数据美化成功，获得${gained}秘境币`, 'success');
    } else if (path === 'blame') {
        const lost = Math.floor(tsr.currentRun.currencyEarned * 0.06);
        tsr.currentRun.currencyEarned = Math.max(0, tsr.currentRun.currencyEarned - lost);
        tsr.currentRun.timeLeft += 28;
        addTsrLog(`「主要是大环境问题」—损失${lost}币，+28秒`, 'success');
    } else if (path === 'crunch') {
        if (tsr.currentRun.timeLeft <= 55) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 50;
        if (Math.random() < 0.55) {
            const gained = addTsrRunCurrency(Math.floor(180 * dm));
            addTempBuff({ name: '周报战神', effect: 'attack', value: 0.25, duration: 3, isDebuff: false });
            addTsrLog(`周报封神！+${gained}秘境币，攻击+25%×3`, 'success');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('肝到头晕，受到8%伤害', 'error');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
        }
    }
    finishTsrMemeRoom();
}

function handleBlinddateRoom() {
    showTsrMemePanel('💘 秘境相亲角', '大妈热情牵线：「小伙子，三位嘉宾，选一位聊聊？」',
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseBlinddate('literary')">文艺青年 · 回血</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseBlinddate('rich')">有房有车 · 大币小伤</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseBlinddate('real')">真实做自己 · 随机</button>`);
    addTsrLog('相亲角：空气里都是「你有编制吗」', 'info');
}

function tsrChooseBlinddate(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'blinddate' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'literary') {
        tsrHealPlayer(0.2);
        tsr.currentRun.timeLeft += 12;
        addTsrLog('聊了一晚上诗和远方，恢复20%生命+12秒', 'success');
    } else if (path === 'rich') {
        const gained = addTsrRunCurrency(Math.floor(120 * dm));
        applyDamage(bMul(tsr.currentRun.playerHealth, 0.06));
        addTsrLog(`对方很满意你的…秘境币，+${gained}币但尴尬扣6%血`, 'warning');
        if (bLteZero(tsr.currentRun.playerHealth)) return;
    } else {
        const roll = Math.random();
        if (roll < 0.35) {
            const pick = rollTsrRelicChoices(1)[0];
            if (pick) addTsrRelic(pick);
            addTsrLog('居然聊成了！对方送你遗物', 'success');
        }
        else if (roll < 0.65) { tsr.currentRun.timeLeft -= 25; addTsrLog('「你是个好人」—尴尬离场-25秒', 'error'); }
        else { const g = addTsrRunCurrency(Math.floor(70 * dm)); addTsrLog(`没成但吃了顿饭，+${g}币`, 'success'); }
    }
    finishTsrMemeRoom();
}

function handleOvertime996Room() {
    if (player.timeSecretRealm.currentRun.overtimeStage == null) player.timeSecretRealm.currentRun.overtimeStage = 0;
    renderOvertime996Panel();
    addTsrLog('996神殿：打卡机显示「今日剩余加班额度：无限」', 'error');
}

function renderOvertime996Panel() {
    const stage = player.timeSecretRealm.currentRun.overtimeStage || 0;
    showTsrMemePanel('⏰ 996加班神殿', `已加班 ${stage} 轮。再走一步可能暴富，也可能猝死。`,
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseOvertime996('leave')">到点下班</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseOvertime996('stay')">再熬一会 · -18秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseOvertime996('comp')">申请调休 · 60币换40秒</button>`);
}

function tsrChooseOvertime996(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'overtime996' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'leave') {
        const gained = addTsrRunCurrency(Math.floor(40 + (tsr.currentRun.overtimeStage || 0) * 25 * dm));
        addTsrLog(`到点下班！获得${gained}秘境币`, 'success');
        finishTsrMemeRoom();
    } else if (path === 'stay') {
        if (tsr.currentRun.timeLeft <= 20) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 18;
        tsr.currentRun.overtimeStage = (tsr.currentRun.overtimeStage || 0) + 1;
        if (Math.random() < 0.22 + tsr.currentRun.overtimeStage * 0.08) {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('加班过度！受到8%伤害', 'error');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
            finishTsrMemeRoom();
        } else {
            const gained = addTsrRunCurrency(Math.floor(35 * dm * (1 + tsr.currentRun.overtimeStage * 0.15)));
            addTsrLog(`又熬了一轮，+${gained}秘境币`, 'success');
            if (tsr.currentRun.overtimeStage >= 4 || tsr.currentRun.timeLeft <= 0) finishTsrMemeRoom();
            else renderOvertime996Panel();
        }
    } else if (path === 'comp') {
        if (tsr.currentRun.currencyEarned < 60) { addTsrLog('秘境币不够调休', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 60;
        tsr.currentRun.timeLeft += 40;
        addTsrLog('调休批准！消耗60币，+40秒', 'success');
        finishTsrMemeRoom();
    }
}

function handleLotteryRoom() {
    showTsrMemePanel('🎫 体彩祈福站', '阿姨递来两张票：「一注梦想，一注现实。」每张消耗12秒。',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseLottery(0)">第一注 · 梦想</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseLottery(1)">第二注 · 现实</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="finishTsrMemeRoom()">不买了，省钱</button>`);
    addTsrLog('体彩祈福站：「中奖概率比出精英怪还低」', 'info');
}

function tsrChooseLottery(ticket) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'lottery' || !room.explored) return;
    if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
    tsr.currentRun.timeLeft -= 12;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const roll = Math.random();
    if (roll < 0.06) {
        const gained = addTsrRunCurrency(Math.floor(300 * dm));
        addTsrLog(`🎉 头奖！获得${gained}秘境币！`, 'success');
    } else if (roll < 0.25) {
        addTsrRunCurrency(Math.floor(50 * dm));
        addTsrLog('小奖！回本了', 'success');
    } else {
        addTsrLog(`第${ticket + 1}注：谢谢惠顾`, 'warning');
    }
    finishTsrMemeRoom();
}

function handleStandupRoom() {
    const lines = [
        { t: '我讲秘境梗，观众讲冷笑话，双赢——都凉了。', fn: () => { player.timeSecretRealm.currentRun.timeLeft += 10; return '+10秒'; } },
        { t: '台下只有一个观众，还是甲方。', fn: () => { applyDamage(bMul(player.timeSecretRealm.currentRun.playerHealth, 0.05)); return '受到5%伤害'; } },
        { t: '段子炸了！观众打赏秘境币。', fn: () => { const g = addTsrRunCurrency(80); return `+${g}秘境币`; } },
        { t: '主持人：「下一位！」你发现自己还在台上。', fn: () => { addTempBuff({ name: '舞台魅力', effect: 'critRate', value: 0.12, duration: 3, isDebuff: false }); return '暴击+12%×3'; } }
    ];
    const line = lines[Math.floor(Math.random() * lines.length)];
    const result = line.fn();
    addTsrLog(`🎙️ ${line.t} → ${result}`, 'info');
    if (bLteZero(player.timeSecretRealm.currentRun.playerHealth)) return;
    afterAction();
}

function handleCodereviewRoom() {
    showTsrMemePanel('🔍 代码评审炼狱', '评审官：「整体不错，但这里命名不规范，建议重构整个模块。」',
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseCodereview('fix')">改命名 · -20秒 +70币</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseCodereview('argue')">据理力争 · 50%攻击+25%或-8%血</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseCodereview('approve')">请求通过 · 40%双倍币或-15秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">关闭评审</button>`);
    addTsrLog('代码评审：上千行改动等你过目', 'warning');
}

function tsrChooseCodereview(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'codereview' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'fix') {
        if (tsr.currentRun.timeLeft <= 22) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 20;
        const g = addTsrRunCurrency(Math.floor(70 * dm));
        addTsrLog(`改完命名！+${g}秘境币`, 'success');
    } else if (path === 'argue') {
        if (Math.random() < 0.5) {
            addTempBuff({ name: '评审战神', effect: 'attack', value: 0.25, duration: 3, isDebuff: false });
            addTsrLog('评审官被说服！攻击+25%×3', 'success');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('评审官拒绝合并！8%伤害', 'error');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
        }
    } else if (path === 'approve') {
        if (Math.random() < 0.4) {
            const g = addTsrRunCurrency(Math.floor(140 * dm));
            addTsrLog(`评审通过！+${g}秘境币`, 'success');
        } else {
            tsr.currentRun.timeLeft -= 15;
            addTsrLog('评审官要求再改一版，-15秒', 'warning');
        }
    }
    finishTsrMemeRoom();
}

function handleStandup996Room() {
    showTsrMemePanel('🌙 996开放麦', '主持人：「今晚加班专场，讲段子可以换调休——大概。」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseStandup996('joke')">讲加班梗 · +50币 -12秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseStandup996('cry')">哭诉 KPI · 回血12% 亲密度+5</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseStandup996('leave')">提前下班 · +25秒</button>`);
    addTsrLog('996开放麦：台下全是黑眼圈', 'info');
}

function tsrChooseStandup996(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'standup996' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'joke') {
        tsr.currentRun.timeLeft -= 12;
        const g = addTsrRunCurrency(Math.floor(50 * dm));
        addTsrLog(`段子炸了！+${g}币，-12秒`, 'success');
    } else if (path === 'cry') {
        tsrHealPlayer(0.12);
        addTsrSpiritBond(5);
        chargeTsrSpirit(20);
        addTsrLog('全场共鸣！回血12%，亲密度+5，充能+20', 'success');
    } else if (path === 'leave') {
        tsr.currentRun.timeLeft += 25;
        addTsrLog('你成了第一个下班的人！+25秒', 'success');
    }
    finishTsrMemeRoom();
}

function peekTsrFutureFloors(count) {
    const types = ['battle', 'event', 'treasure', 'elite', 'relic', 'rest', 'ppt', 'oracle', 'storm', 'gacha', 'monsterhunt', 'roulette', 'vending'];
    const picks = [];
    for (let i = 0; i < count; i++) picks.push(types[Math.floor(Math.random() * types.length)]);
    return picks;
}

function handleOracleRoom() {
    const tsr = player.timeSecretRealm;
    const peek = peekTsrFutureFloors(2);
    const labels = peek.map(t => getTsrRoomTypeMeta(t).icon + ' ' + getTsrRoomTypeMeta(t).name).join(' → ');
    showTsrMemePanel('🔭 时光预言台', `迷雾中浮现未来虚影：<br><b>${labels}</b><br>（消耗25秒解读）`,
        `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseOracle()">确认解读 · -25秒 +15秒预备</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="finishTsrMemeRoom()">不看，省时间</button>`);
    tsr.currentRun.oraclePeek = peek;
    addTsrLog('预言台：未来不一定准确，但听起来很准', 'info');
}

function tsrChooseOracle() {
    const tsr = player.timeSecretRealm;
    if (tsr.currentRun.timeLeft <= 28) { finishTsrMemeRoom(); return; }
    tsr.currentRun.timeLeft -= 25;
    tsr.currentRun.timeLeft += 15;
    tsr.currentRun.oracleBonus = true;
    addTsrLog('预言解读完成！下一场战斗奖励+20%', 'success');
    finishTsrMemeRoom();
}

function handleFusionRoom() {
    const tsr = player.timeSecretRealm;
    const hasItem = (tsr.currentRun.consumables || []).length > 0;
    showTsrMemePanel('⚗️ 遗物熔合台', '熔合师：「献祭道具或鲜血，可唤出遗物之灵。」',
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseFusion('item')" ${hasItem ? '' : 'disabled'}>献祭道具 · 40%遗物</button>
         <button type="button" class="tsr-btn tsr-btn-risk" onclick="tsrChooseFusion('blood')">鲜血熔合 · 8%血 55%遗物</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('遗物熔合台开始嗡嗡作响', 'info');
}

function tsrChooseFusion(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'fusion' || !room.explored) return;
    if ((tsr.currentRun.relics || []).length >= getTsrRelicMax()) {
        addTsrLog('遗物栏已满，熔合失败', 'warning');
        finishTsrMemeRoom();
        return;
    }
    let chance = 0;
    if (path === 'item') {
        if (!tsr.currentRun.consumables?.length) { finishTsrMemeRoom(); return; }
        tsr.currentRun.consumables.pop();
        updateTsrConsumablesDisplay();
        chance = 0.4;
        addTsrLog('献祭了一件道具…', 'info');
    } else {
        applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
        chance = 0.55;
        if (bLteZero(tsr.currentRun.playerHealth)) return;
    }
    if (Math.random() < chance) {
        const pick = rollTsrRelicChoices(1)[0];
        if (pick) addTsrRelic(pick);
        else addTsrLog('熔合闪光后…什么都没有', 'warning');
    } else {
        addTsrRunCurrency(60);
        addTsrLog('熔合失败，炉灰变成60秘境币', 'warning');
    }
    finishTsrMemeRoom();
}

function handleTimebankRoom() {
    showTsrMemePanel('🏧 时光银行', `已存入时光：${player.timeSecretRealm.currentRun.bankedTime || 0}秒（每层结息）`,
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseTimebank('deposit')">存入35秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseTimebank('withdraw')">透支40秒 · 70币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('时光银行：「时间就是金钱，但金钱不能买回时间——大概吧。」', 'info');
}

function tsrChooseTimebank(path) {
    const tsr = player.timeSecretRealm;
    if (path === 'deposit') {
        if (tsr.currentRun.timeLeft <= 38) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 35;
        tsr.currentRun.bankedTime = (tsr.currentRun.bankedTime || 0) + 35;
        addTsrLog('存入35秒时光，每层将产生利息', 'success');
    } else if (path === 'withdraw') {
        if (tsr.currentRun.currencyEarned < 70) { addTsrLog('秘境币不足透支', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 70;
        tsr.currentRun.timeLeft += 40;
        addTsrLog('透支成功！消耗70币，+40秒', 'success');
    }
    finishTsrMemeRoom();
}

function handleStormRoom() {
    const tsr = player.timeSecretRealm;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const stormBonus = getTsrRelicBonus('stormBonus');
    const stormRisk = getTsrRelicBonus('stormRisk');
    const storms = [
        () => { tsr.currentRun.timeLeft += Math.floor(45 * (1 + stormBonus)); return `时光暴风！+${Math.floor(45 * (1 + stormBonus))}秒`; },
        () => { const g = addTsrRunCurrency(Math.floor(100 * dm * (1 + stormBonus))); return `财富雨！+${g}秘境币`; },
        () => {
            const tearPct = Math.min(0.14, 0.08 + Math.max(0, stormRisk));
            applyDamage(bMul(tsr.currentRun.playerHealth, tearPct));
            return `乱流撕裂！${Math.floor(tearPct * 100)}%伤害`;
        },
        () => { addTsrConsumable(Object.keys(TSR_RUN_CONSUMABLES)[Math.floor(Math.random() * Object.keys(TSR_RUN_CONSUMABLES).length)]); return '捡到漂流物资'; },
        () => { tsr.currentRun.timeLeft -= 30; tsr.currentRun.battleWinStreak = 0; return '连击被吹散了！-30秒'; },
        () => { addTempBuff({ name: '乱流加护', effect: 'critRate', value: 0.15, duration: 4, isDebuff: false }); return '乱流注入暴击之力！'; },
        () => { if ((tsr.currentRun.relics || []).length < getTsrRelicMax() && Math.random() < 0.25) { const p = rollTsrRelicChoices(1)[0]; if (p) addTsrRelic(p); return '乱流中浮现遗物虚影！'; } return '虚影消散，什么都没留下'; },
        () => { chargeTsrSpirit(20); tsr.currentRun.timeLeft += 15; return '灵潮涌动！充能+20，+15秒'; }
    ];
    const result = storms[Math.floor(Math.random() * storms.length)]();
    addTsrLog(`🌪️ 时空乱流：${result}`, 'info');
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    afterAction();
}

function handlePptRoom() {
    showTsrMemePanel(
        '📊 PPT答辩炼狱',
        '导师推了推眼镜：「今天不讲道理，只讲排版。你怎么选？」',
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChoosePpt('fish')">摸鱼听讲 · +25秒小奖励</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChoosePpt('grind')">卷王答辩 · 耗时间大收益</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChoosePpt('quit')">摆烂离场 · 命运轮盘</button>`
    );
    addTsrLog('进入答辩炼狱，空气里全是宋体与焦虑', 'info');
}

function tsrChoosePpt(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'ppt' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'fish') {
        tsr.currentRun.timeLeft += 25;
        const gained = addTsrRunCurrency(Math.floor(35 * dm));
        addTsrLog(`摸鱼成功：+25秒，顺手薅了${gained}秘境币`, 'success');
        finishTsrMemeRoom();
    } else if (path === 'grind') {
        if (tsr.currentRun.timeLeft <= 48) {
            addTsrLog('时间不够卷了，导师拒绝延期', 'warning');
            finishTsrMemeRoom();
            return;
        }
        tsr.currentRun.timeLeft -= 45;
        const gained = addTsrRunCurrency(Math.floor(115 * dm));
        addTempBuff({ name: '答辩战意', effect: 'attack', value: 0.3, duration: 4, isDebuff: false });
        addTsrLog(`卷王答辩通过！-${45}秒，+${gained}秘境币，攻击+30%×4`, 'success');
        finishTsrMemeRoom();
    } else if (path === 'quit') {
        const roll = Math.random();
        if (roll < 0.38) {
            const gained = addTsrRunCurrency(Math.floor(160 * dm));
            tsr.currentRun.timeLeft += 15;
            addTsrLog(`摆烂反而拿了优秀！+${gained}秘境币，+15秒`, 'success');
        } else if (roll < 0.72) {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            tsr.currentRun.timeLeft -= 20;
            addTsrLog('导师：「回去重写。」受到8%伤害并-20秒', 'error');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
        } else {
            addTsrLog('你当场离职（并没有），什么都没发生——除了尴尬', 'info');
        }
        finishTsrMemeRoom();
    }
}

function handleClientRoom() {
    showTsrMemePanel(
        '📝 甲方改稿圣所',
        '甲方微笑：「logo再大一点，整体再小一点，要那种五彩斑斓的黑。」',
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseClient('tweak')">好的这就改 · 35秒搏大奖</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseClient('calm')">先安抚一下 · 花8秒换时间</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseClient('black')">提交五彩斑斓的黑</button>`
    );
    addTsrLog('甲方圣所开门，空气中弥漫着「最后亿版」', 'warning');
}

function tsrChooseClient(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'client' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'tweak') {
        if (tsr.currentRun.timeLeft <= 38) {
            addTsrLog('改不动了，甲方说「那先这样吧」', 'warning');
            finishTsrMemeRoom();
            return;
        }
        tsr.currentRun.timeLeft -= 35;
        if (Math.random() < 0.62) {
            const gained = addTsrRunCurrency(Math.floor(140 * dm));
            addTsrLog(`改稿通过！获得${gained}秘境币（甲方居然满意了）`, 'success');
        } else {
            tsr.currentRun.timeLeft -= 15;
            addTsrLog('甲方：「感觉还是第一版好。」额外-15秒', 'error');
        }
        finishTsrMemeRoom();
    } else if (path === 'calm') {
        tsr.currentRun.timeLeft -= 8;
        tsr.currentRun.timeLeft += 22;
        addTsrLog('「收到，在做了在做了」——甲方暂时满意，净赚14秒', 'success');
        finishTsrMemeRoom();
    } else if (path === 'black') {
        if (tsr.currentRun.timeLeft <= 53) {
            addTsrLog('五彩斑斓的黑需要更多时间渲染', 'warning');
            finishTsrMemeRoom();
            return;
        }
        tsr.currentRun.timeLeft -= 50;
        if (Math.random() < 0.42) {
            const gained = addTsrRunCurrency(Math.floor(220 * dm));
            addTsrLog(`甲方沉默良久……打款${gained}秘境币！`, 'success');
            if (Math.random() < 0.2 && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
                const pick = rollTsrRelicChoices(1)[0];
                if (pick) addTsrRelic(pick);
            }
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('甲方：「你认真的？」受到8%生命伤害', 'error');
            if (bLteZero(tsr.currentRun.playerHealth)) return;
        }
        finishTsrMemeRoom();
    }
}

function handlePddRoom() {
    const tsr = player.timeSecretRealm;
    if (tsr.currentRun.pddProgress == null) tsr.currentRun.pddProgress = 0;
    renderPddPanel();
    addTsrLog('砍一刀密室：精灵对你说「就差一点点了」', 'info');
}

function renderPddPanel() {
    const tsr = player.timeSecretRealm;
    const prog = tsr.currentRun.pddProgress || 0;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const preview = Math.floor(prog * 1.2 * dm);
    showTsrMemePanel(
        '🪓 砍一刀密室',
        `进度 <b>${prog}%</b> / 100%<br><span style="color:#fca5a5;">跑路可带走约 ${preview} 秘境币（按进度折算）</span>`,
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChopPdd()">再砍一刀 · -12秒</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrFleePdd()">提箱跑路 · 结算当前进度</button>`
    );
}

function tsrChopPdd() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'pdd' || !room.explored) return;
    if (tsr.currentRun.timeLeft <= 14) {
        addTsrLog('没时间砍了，精灵把你赶了出去', 'warning');
        finishTsrMemeRoom();
        return;
    }
    tsr.currentRun.timeLeft -= 12;
    if (Math.random() < 0.32) {
        tsr.currentRun.pddProgress = 0;
        addTsrLog('朋友手滑砍错了！进度清零——「就差一点点」', 'error');
    } else {
        const chop = 8 + Math.floor(Math.random() * 18);
        tsr.currentRun.pddProgress = Math.min(100, (tsr.currentRun.pddProgress || 0) + chop);
        addTsrLog(`砍中了！进度+${chop}%`, 'success');
    }
    if (tsr.currentRun.pddProgress >= 100) {
        const dm = tsr.currentRun.difficultyMultiplier || 1;
        const gained = addTsrRunCurrency(Math.floor(200 * dm), { combo: true });
        tsr.currentRun.timeLeft += 10;
        if (!tsr.lifetimeStats) tsr.lifetimeStats = { pddWins: 0 };
        tsr.lifetimeStats.pddWins = (tsr.lifetimeStats.pddWins || 0) + 1;
        checkTsrAchievements();
        addTsrLog(`砍成了！大奖${gained}秘境币到手，附赠10秒`, 'success');
        finishTsrMemeRoom();
        return;
    }
    if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
    else renderPddPanel();
}

function tsrFleePdd() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'pdd' || !room.explored) return;
    const prog = tsr.currentRun.pddProgress || 0;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const gained = addTsrRunCurrency(Math.floor(prog * 1.2 * dm));
    addTsrLog(`提箱跑路，带走${gained}秘境币（进度${prog}%）`, prog >= 50 ? 'success' : 'warning');
    finishTsrMemeRoom();
}

function handleRecallRoom() {
    const tsr = player.timeSecretRealm;
    const outcomes = [
        { msg: '其实是红包链接，获得秘境币', fn: () => addTsrRunCurrency(90 + Math.floor(Math.random() * 60)) },
        { msg: '「在吗？」三个字扣你20秒', fn: () => { tsr.currentRun.timeLeft -= 20; } },
        { msg: '撤回的是加班通知！+35秒', fn: () => { tsr.currentRun.timeLeft += 35; } },
        { msg: '表情包攻击！受到8%伤害', fn: () => applyDamage(bMul(tsr.currentRun.playerHealth, 0.08)) },
        { msg: '「收到」——莫名安心，恢复15%生命', fn: () => tsrHealPlayer(0.15) }
    ];
    for (let i = outcomes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [outcomes[i], outcomes[j]] = [outcomes[j], outcomes[i]];
    }
    tsr.currentRun.recallOutcomes = outcomes.slice(0, 3);
    showTsrMemePanel(
        '💬 撤回消息虚空',
        '三条一模一样的提示悬浮着，你永远不知道点开是什么：',
        tsr.currentRun.recallOutcomes.map((_, i) =>
            `<button type="button" class="tsr-btn tsr-btn-ghost" onclick="tsrChooseRecall(${i})">📱 对方撤回了一条消息</button>`
        ).join('')
    );
    addTsrLog('撤回虚空：薛定谔的聊天记录', 'info');
}

function tsrChooseRecall(index) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'recall' || !room.explored) return;
    const outcomes = tsr.currentRun.recallOutcomes || [];
    const pick = outcomes[index];
    if (pick) {
        pick.fn();
        addTsrLog(`你点开了撤回消息：${pick.msg}`, pick.msg.includes('伤害') || pick.msg.includes('扣') ? 'error' : 'success');
        if (bLteZero(tsr.currentRun.playerHealth)) return;
    }
    finishTsrMemeRoom();
}

function handleKpiRoom() {
    showTsrMemePanel(
        '📈 KPI审判庭',
        'HR幽灵宣读：「本层绩效，三选一，不选默认扣绩效。」',
        `<button type="button" class="tsr-btn tsr-btn-risk" onclick="tsrChooseKpi('rush')">冲刺达标 · 立刻精英战</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseKpi('fake')">周报糊弄 · 币多下战更难</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseKpi('blame')">甩锅同事 · 损币换时间</button>`
    );
    addTsrLog('KPI审判庭：空气里全是Excel的味道', 'warning');
}

function tsrChooseKpi(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'kpi' || !room.explored) return;
    hideTsrChoicePanels();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'rush') {
        addTsrLog('选择冲刺达标，精英考核开始！', 'info');
        room.rewards = generateRoomRewards('elite', dm);
        handleBattleRoom({ forceElite: true });
        return;
    }
    if (path === 'fake') {
        const gained = addTsrRunCurrency(Math.floor(75 * dm));
        tsr.currentRun.kpiBattlePenalty = 1.22;
        addTsrLog(`周报糊弄成功+${gained}币，但下一场战斗难度+22%`, 'warning');
        finishTsrMemeRoom();
    } else if (path === 'blame') {
        const lost = Math.floor(tsr.currentRun.currencyEarned * 0.1);
        tsr.currentRun.currencyEarned = Math.max(0, tsr.currentRun.currencyEarned - lost);
        tsr.currentRun.timeLeft += 35;
        addTsrLog(`已拉同事进群背锅，损失${lost}秘境币，获得35秒`, 'success');
        finishTsrMemeRoom();
    }
}

const TSR_DUANZI_LINES = [
    { text: '时光管理局公告：本周禁止内卷，允许外卷。', apply: (tsr, dm) => { tsr.currentRun.timeLeft += 12; return '+12秒'; } },
    { text: '秘境导游：前方不是陷阱，是甲方。', apply: (tsr, dm) => { const g = addTsrRunCurrency(Math.floor(40 * dm)); return `+${g}秘境币`; } },
    { text: '系统提示：您已连续探索，建议摸鱼。', apply: (tsr) => { tsrHealPlayer(0.1); return '恢复10%生命'; } },
    { text: '段子手：这秘境要是能报销，我早财富自由了。', apply: (tsr, dm) => { tsr.currentRun.timeLeft -= 8; const g = addTsrRunCurrency(Math.floor(55 * dm)); return `-${8}秒但+${g}币`; } },
    { text: '观众喊：下一条！（指下一条命）', apply: (tsr) => { applyDamage(bMul(tsr.currentRun.playerHealth, 0.06)); return '受到6%伤害'; } },
    { text: '「哈哈哈哈」——但你笑出了暴击增益。', apply: (tsr) => { addTempBuff({ name: '笑出暴击', effect: 'critRate', value: 0.1, duration: 3, isDebuff: false }); return '暴击率+10%×3'; } }
];

function handleDuanziRoom() {
    const tsr = player.timeSecretRealm;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const line = TSR_DUANZI_LINES[Math.floor(Math.random() * TSR_DUANZI_LINES.length)];
    const result = line.apply(tsr, dm);
    addTsrLog(`🎤 ${line.text} → ${result}`, 'info');
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    afterAction();
}

const TSR_ECHO_PARODY = {
    battle: '回音廊复读：又是战斗，但这次怪物也会喊「累了」。',
    elite: '回音廊复读：精英怪递来奶茶，说「今天不打」。',
    treasure: '回音廊复读：宝箱变成盲盒，标签写着「谢谢惠顾」。',
    rest: '回音廊复读：休息房改名叫「精神离职」。',
    boss: '回音廊复读：首领问你「这版方案谁批的？」',
    ppt: '回音廊复读：答辩PPT自动播放「谢谢观看」。',
    pdd: '回音廊复读：精灵说「上次就差一点点，这次也一样」。',
    event: '回音廊复读：事件房触发事件：触发事件。'
};

function handleEchoRoom() {
    const tsr = player.timeSecretRealm;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const history = tsr.currentRun.floorHistory || [];
    const last = history.length >= 2 ? history[history.length - 2].type : 'battle';
    const parody = TSR_ECHO_PARODY[last] || `回音廊复读：上一层是${last}，这一层还是那股味儿。`;
    addTsrLog(parody, 'info');
    const roll = Math.random();
    if (roll < 0.4) {
        const gained = addTsrRunCurrency(Math.floor(50 * dm));
        addTsrLog(`回音共鸣！额外获得${gained}秘境币`, 'success');
    } else if (roll < 0.7) {
        tsr.currentRun.timeLeft += 18;
        addTsrLog('回音里藏着时光碎片，+18秒', 'success');
    } else {
        tsr.currentRun.echoNextReward = 1.35;
        addTsrLog('回音诅咒：下一场战斗奖励+35%（如果打得过）', 'warning');
    }
    afterAction();
}

function handleGachaRoom() {
    showTsrMemePanel('🎰 秘境抽卡机', '机器闪烁：「单抽15秒，十连120秒，保底不存在。」',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseGacha('single')">单抽 · -15秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseGacha('multi')">十连 · -120秒</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="finishTsrMemeRoom()">不抽了，省钱</button>`);
    addTsrLog('抽卡机：「本池不含保底，含心跳」', 'info');
}

function tsrChooseGacha(mode) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'gacha' || !room.explored) return;
    const cost = mode === 'multi' ? 120 : 15;
    if (tsr.currentRun.timeLeft <= cost + 5) { finishTsrMemeRoom(); return; }
    tsr.currentRun.timeLeft -= cost;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const pulls = mode === 'multi' ? 10 : 1;
    let best = '';
    for (let i = 0; i < pulls; i++) {
        const roll = Math.random();
        if (roll < 0.04 && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
            const pick = rollTsrRelicChoices(1)[0];
            if (pick) { addTsrRelic(pick); best = 'SSR遗物！'; }
        } else if (roll < 0.18) {
            addTsrConsumable(Object.keys(TSR_RUN_CONSUMABLES)[Math.floor(Math.random() * Object.keys(TSR_RUN_CONSUMABLES).length)]);
            if (!best) best = '道具';
        } else if (roll < 0.45) {
            addTsrRunCurrency(Math.floor(40 * dm));
        } else if (roll < 0.7) {
            tsr.currentRun.timeLeft += 8;
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.03));
        }
    }
    addTsrLog(`抽卡${pulls}次${best ? '，最高:' + best : ''}`, best ? 'success' : 'info');
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    finishTsrMemeRoom();
}

function handleEscapeRoom() {
    showTsrMemePanel('🔐 密室逃脱', '墙上三道谜题，答对可获宝藏，答错扣时间。',
        `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseEscape(0)">谜题A · 数字锁</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseEscape(1)">谜题B · 文字锁</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseEscape(2)">谜题C · 暴力破解</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">放弃离开</button>`);
    addTsrLog('密室：「提示：答案往往藏在上一层的记忆里」', 'info');
}

function tsrChooseEscape(puzzle) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'escape' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (puzzle === 2) {
        if (tsr.currentRun.timeLeft <= 25) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 22;
        applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
        const g = addTsrRunCurrency(Math.floor(100 * dm));
        addTsrLog(`暴力破门！-${22}秒，8%伤害，+${g}币`, 'warning');
    } else {
        const win = Math.random() < (puzzle === 0 ? 0.55 : 0.45);
        if (win) {
            tsr.currentRun.timeLeft += 25;
            const g = addTsrRunCurrency(Math.floor(80 * dm));
            addTsrLog(`谜题解开！+25秒，+${g}秘境币`, 'success');
            if (Math.random() < 0.2) addTsrConsumable('chaosDice');
        } else {
            tsr.currentRun.timeLeft -= 18;
            addTsrLog('谜题答错，机关喷水！-18秒', 'error');
        }
    }
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    finishTsrMemeRoom();
}

function handleAuctionRoom() {
    showTsrMemePanel('🔨 时光拍卖', '拍卖师：「价高者得，手慢无，套路有。」',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseAuction('bid')">竞拍遗物 · 80币 35%成功</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseAuction('snipe')">捡漏道具 · 45币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">围观离开</button>`);
    addTsrLog('拍卖行：「本拍品不支持七天无理由」', 'info');
}

function tsrChooseAuction(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'auction' || !room.explored) return;
    if (path === 'bid') {
        if (tsr.currentRun.currencyEarned < 80) { addTsrLog('秘境币不足80', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 80;
        if (Math.random() < 0.35 && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
            const pick = rollTsrRelicChoices(1)[0];
            if (pick) addTsrRelic(pick);
            else addTsrLog('竞拍成功但遗物栏异常', 'warning');
        } else {
            addTsrRunCurrency(30);
            addTsrLog('竞拍失败，退回部分保证金30币', 'warning');
        }
    } else {
        if (tsr.currentRun.currencyEarned < 45) { addTsrLog('秘境币不足45', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 45;
        const items = ['monsterBait', 'ironShield', 'flashBomb', 'spiritSnack', 'luckyCoin'];
        addTsrConsumable(items[Math.floor(Math.random() * items.length)]);
        addTsrLog('捡漏成功！获得一件道具', 'success');
    }
    finishTsrMemeRoom();
}

function handleGamblersdenRoom() {
    showTsrMemePanel('🎲 秘境赌坊', '老板递来骰子：「三局两胜，赢了翻倍，输了……也翻倍（伤害）。」',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseGamblersden('coin')">赌币 · 50币 55%×2</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseGamblersden('time')">赌时 · 25秒 50%×2</button>
         <button type="button" class="tsr-btn tsr-btn-risk" onclick="tsrChooseGamblersden('allin')">梭哈 · 100币+30秒 40%×3</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">不赌了</button>`);
    addTsrLog('赌坊：「小赌怡情，大赌……也怡情」', 'info');
}

function tsrChooseGamblersden(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'gamblersden' || !room.explored) return;
    const gambleBonus = getTsrRelicBonus('gamble') + getTsrPermanentGambleBonus() + (tsr.currentRun.contractMods?.gamble || 0) + (getTsrActiveAffix()?.gamble || 0);
    if (path === 'coin') {
        if (tsr.currentRun.currencyEarned < 50) { addTsrLog('秘境币不足50', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 50;
        if (Math.random() < 0.55 + gambleBonus) {
            const g = addTsrRunCurrency(100);
            addTsrLog(`赌币大胜！获得${g}秘境币`, 'success');
        } else {
            addTsrLog('赌币失败，50币打了水漂', 'error');
        }
    } else if (path === 'time') {
        if (tsr.currentRun.timeLeft <= 28) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 25;
        if (Math.random() < 0.5 + gambleBonus) {
            tsr.currentRun.timeLeft += 50;
            addTsrLog('赌时大胜！+50秒', 'success');
        } else {
            addTsrLog('赌时失败，时间打了水漂', 'error');
        }
    } else {
        if (tsr.currentRun.currencyEarned < 100 || tsr.currentRun.timeLeft <= 35) {
            addTsrLog('资源不足，无法梭哈', 'warning');
            finishTsrMemeRoom();
            return;
        }
        tsr.currentRun.currencyEarned -= 100;
        tsr.currentRun.timeLeft -= 30;
        if (Math.random() < 0.4 + gambleBonus * 0.5) {
            const g = addTsrRunCurrency(300);
            tsr.currentRun.timeLeft += 90;
            addTsrLog(`梭哈成功！+${g}币 +90秒`, 'success');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('梭哈失败！8%生命值伤害', 'error');
        }
    }
    bumpTsrQuestProgress('runGambles', 1);
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    finishTsrMemeRoom();
}

function handlePhantomRoom() {
    showTsrMemePanel('🌫️ 幻境迷宫', '迷雾中浮现三个出口，每个都写着「真实」。',
        `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChoosePhantom('mirror')">镜中自我 · 50%增益或减益</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChoosePhantom('meditate')">冥想破幻 · +30秒</button>
         <button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChoosePhantom('fight')">击碎幻境 · 战斗</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">原路返回</button>`);
    addTsrLog('幻境迷宫：「你所见的，未必是所见的」', 'info');
}

function tsrChoosePhantom(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'phantom' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'mirror') {
        if (Math.random() < 0.5) {
            addTempBuff({ name: '幻境战意', effect: 'attack', value: 0.35, duration: 4, isDebuff: false });
            addTsrLog('镜中自我赐予战意！攻击+35%×4', 'success');
        } else {
            addTempBuff({ name: '幻境迷障', effect: 'attack', value: -0.15, duration: 3, isDebuff: true });
            addTsrLog('镜中自我施加迷障！攻击-15%×3', 'warning');
        }
        finishTsrMemeRoom();
    } else if (path === 'meditate') {
        if (tsr.currentRun.timeLeft <= 25) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 15;
        tsr.currentRun.timeLeft += 45;
        addTsrLog('冥想破幻，净得+30秒', 'success');
        finishTsrMemeRoom();
    } else if (path === 'fight') {
        const monster = pickTsrMonsterMinTier(false, false, 'uncommon', tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
        tsr.currentRun.currentRoom = {
            type: 'battle', name: '幻境守卫', explored: true, hasTrap: false,
            trap: null, trapDetected: false, trapDisarmed: false,
            isBoss: false, isElite: false, isShrine: false,
            rewards: generateRoomRewards('battle', tsr.currentRun.difficultyMultiplier),
            monster
        };
        handleBattleRoom();
    } else {
        finishTsrMemeRoom();
    }
}

function handleShrineduelRoom() {
    showTsrMemePanel('⚔️ 神龛对决', '神龛化为决斗场，守关者低语：「证明你的资格。」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseShrineduel('duel')">接受对决 · 精英战+祝福</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseShrineduel('pray')">虔诚祈祷 · +25秒 回血10%</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('神龛对决：胜者将获得神龛祝福', 'info');
}

function tsrChooseShrineduel(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'shrineduel' || !room.explored) return;
    hideTsrChoicePanels();
    if (path === 'duel') {
        tsr.currentRun.onBattleWinShrineBless = true;
        room.monster = pickTsrMonster(false, true, tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
        room.isElite = true;
        room.rewards = generateRoomRewards('elite', tsr.currentRun.difficultyMultiplier);
        handleBattleRoom({ forceElite: true });
        return;
    } else if (path === 'pray') {
        tsr.currentRun.timeLeft += 25;
        tsrHealPlayer(0.1);
        addTsrLog('虔诚祈祷，+25秒并回血10%', 'success');
        finishTsrMemeRoom();
    } else {
        finishTsrMemeRoom();
    }
}

function handleBeastlairRoom() {
    const floor = player.timeSecretRealm.currentRun.currentFloor;
    const dm = player.timeSecretRealm.currentRun.difficultyMultiplier;
    const beast = pickTsrMonsterMinTier(false, true, 'epic', floor, dm);
    showTsrMemePanel('🕳️ 异兽巢穴', `巢穴深处，${formatTsrMonsterNameHtml(beast)} 正在沉睡……<br>「${beast.intro}」`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseBeastlair('fight')">惊醒异兽 · 史诗精英战</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseBeastlair('steal')">偷取宝藏 · 60%得币或惊醒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">悄悄离开</button>`);
    player.timeSecretRealm.currentRun.beastTarget = beast;
    addTsrLog('异兽巢穴：空气里弥漫着危险的气息', 'warning');
}

function tsrChooseBeastlair(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'beastlair' || !room.explored) return;
    const beast = tsr.currentRun.beastTarget || pickTsrMonsterMinTier(false, true, 'epic', tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
    tsr.currentRun.beastTarget = null;
    hideTsrChoicePanels();
    if (path === 'fight') {
        room.monster = beast;
        room.isElite = true;
        room.rewards = generateRoomRewards('elite', tsr.currentRun.difficultyMultiplier);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.8);
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        if (Math.random() < 0.5) addTsrConsumable('monsterBait');
        afterAction();
    } else if (path === 'steal') {
        if (Math.random() < 0.6) {
            const g = addTsrRunCurrency(Math.floor(150 * (tsr.currentRun.difficultyMultiplier || 1)));
            addTsrLog(`偷取成功！获得${g}秘境币`, 'success');
            finishTsrMemeRoom();
        } else {
            room.monster = beast;
            room.isElite = true;
            room.rewards = generateRoomRewards('elite', tsr.currentRun.difficultyMultiplier);
            addTsrLog('异兽被惊醒了！', 'warning');
            handleBattleRoom({ forceElite: true });
        }
    } else {
        finishTsrMemeRoom();
    }
}

function handleMonsterHuntRoom() {
    const floor = player.timeSecretRealm.currentRun.currentFloor;
    const dm = player.timeSecretRealm.currentRun.difficultyMultiplier;
    const target = pickTsrMonster(false, true, floor, dm);
    showTsrMemePanel('🏹 狩猎布告栏', `悬赏令：${formatTsrMonsterNameHtml(target)}<br>「${target.intro}」`,
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseMonsterHunt('fight')">接受悬赏 · 精英战</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseMonsterHunt('info')">打探情报 · -10秒 +50币</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">无视布告</button>`);
    player.timeSecretRealm.currentRun.huntTarget = target;
    addTsrLog('狩猎布告栏贴满了各种凶名', 'info');
}

function tsrChooseMonsterHunt(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'monsterhunt' || !room.explored) return;
    const target = tsr.currentRun.huntTarget || pickTsrMonster(false, true, tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
    tsr.currentRun.huntTarget = null;
    if (path === 'fight') {
        room.monster = target;
        room.isElite = true;
        room.rewards = generateRoomRewards('elite', tsr.currentRun.difficultyMultiplier);
        room.rewards.currency = Math.floor(room.rewards.currency * 1.4);
        hideTsrChoicePanels();
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        if (Math.random() < 0.35) addTsrConsumable('monsterBait');
        addTsrLog('悬赏完成！', 'success');
        afterAction();
    } else if (path === 'info') {
        tsr.currentRun.timeLeft -= 10;
        addTsrRunCurrency(50);
        tsr.currentRun.battleRewardBonus = 0.3;
        addTsrLog('打探到弱点！下次战斗奖励+30%', 'success');
        finishTsrMemeRoom();
    } else {
        finishTsrMemeRoom();
    }
}

function handleRouletteRoom() {
    showTsrMemePanel('🎡 命运轮盘', '轮盘上有六种颜色，指针已经开始转了……',
        `<button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseRoulette()">转！ · -12秒</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">不转了</button>`);
    addTsrLog('命运轮盘：「转到什么算什么」', 'info');
}

function tsrChooseRoulette() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'roulette' || !room.explored) return;
    if (tsr.currentRun.timeLeft <= 14) { finishTsrMemeRoom(); return; }
    tsr.currentRun.timeLeft -= 12;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const slots = [
        () => { tsr.currentRun.timeLeft += 35; return '绿色·时间 +35秒'; },
        () => { const g = addTsrRunCurrency(Math.floor(120 * dm)); return `金色·财富 +${g}币`; },
        () => { addTempBuff({ name: '轮盘战意', effect: 'attack', value: 0.35, duration: 3, isDebuff: false }); return '红色·战意 攻击+35%'; },
        () => { applyDamage(bMul(tsr.currentRun.playerHealth, 0.08)); return '黑色·厄运 8%伤害'; },
        () => { addTsrConsumable('chaosDice'); return '紫色·奇物 混沌骰子'; },
        () => { chargeTsrSpirit(25); return '蓝色·灵息 充能+25'; }
    ];
    const result = slots[Math.floor(Math.random() * slots.length)]();
    addTsrLog(`🎡 轮盘停在：${result}`, 'info');
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    finishTsrMemeRoom();
}

function handleVendingRoom() {
    showTsrMemePanel('🥤 自动售货机', '商品列表在闪烁，投币口写着「只收秘境币」。',
        `<button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseVending('heal')">功能饮料 · 35币 回血20%</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseVending('random')">盲盒 · 50币 随机道具</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseVending('kick')">踹一脚 · 25%掉货或-8%血</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('售货机：「出货不退，卡住自理」', 'info');
}

function tsrChooseVending(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'vending' || !room.explored) return;
    if (path === 'heal') {
        if (tsr.currentRun.currencyEarned < 35) { addTsrLog('秘境币不足', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 35;
        tsrHealPlayer(0.2);
        addTsrLog('功能饮料下肚，恢复20%生命', 'success');
    } else if (path === 'random') {
        if (tsr.currentRun.currencyEarned < 50) { addTsrLog('秘境币不足', 'warning'); finishTsrMemeRoom(); return; }
        tsr.currentRun.currencyEarned -= 50;
        addTsrConsumable(Object.keys(TSR_RUN_CONSUMABLES)[Math.floor(Math.random() * Object.keys(TSR_RUN_CONSUMABLES).length)]);
        addTsrLog('盲盒出货！', 'success');
    } else {
        if (Math.random() < 0.25) {
            addTsrConsumable('coffeeShot');
            tsr.currentRun.timeLeft += 10;
            addTsrLog('踹出了隐藏货道！浓缩咖啡+10秒', 'success');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('售货机反击！8%伤害', 'error');
        }
    }
    if (bLteZero(tsr.currentRun.playerHealth)) return;
    finishTsrMemeRoom();
}

function handleForgeRoom(opts) {
    opts = opts || {};
    const panel = ensureTsrStaticChoicePanelHtml('tsrForgePanel');
    if (panel) panel.style.display = 'block';
    if (!opts.silent) addTsrLog('时光熔炉点燃，请选择锻造方式', 'info');
}

function tsrChooseForge(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'forge' || !room.explored || room.choiceResolved || tsr.currentRun._choiceResolving) return;
    const forgeMult = 1 + getTsrPermanentForgeBonus();
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const abortForge = (msg) => {
        addTsrLog(msg, 'warning');
        handleForgeRoom({ silent: true });
    };
    if (path === 'temper') {
        if (tsr.currentRun.timeLeft <= 38) { abortForge('时间不足，无法淬火'); return; }
    } else if (path === 'reforge') {
        if (tsr.currentRun.timeLeft <= 53) { abortForge('时间不足，无法重铸'); return; }
        if ((tsr.currentRun.relics || []).length >= getTsrRelicMax()) { abortForge('遗物栏已满，重铸失败'); return; }
    } else if (path === 'imbue') {
        if (tsr.currentRun.timeLeft <= 28) { abortForge('时间不足，无法灌注'); return; }
    } else if (path === 'arm') {
        if (tsr.currentRun.timeLeft <= 43) { abortForge('时间不足，无法铸装'); return; }
    } else if (path === 'smelt') {
        if (tsr.currentRun.timeLeft <= 58) { abortForge('时间不足，无法熔炼'); return; }
    } else if (path === 'wash') {
        if (tsr.currentRun.timeLeft <= 48) { abortForge('时间不足，无法洗炼'); return; }
    } else {
        return;
    }
    room.choiceResolved = true;
    tsr.currentRun._choiceResolving = true;
    deferTsrChoiceResolve(() => {
        const run = player.timeSecretRealm?.currentRun;
        if (!run) return;
        run._choiceResolving = false;
        if (!run.isActive) return;
        hideTsrChoicePanels();
        if (path === 'temper') {
            run.timeLeft -= 35;
            tsrHealPlayer(0.28);
            const gained = addTsrRunCurrency(Math.floor(70 * dm * forgeMult));
            addTsrLog(`淬火完成：恢复28%生命，获得${gained}秘境币`, 'success');
        } else if (path === 'reforge') {
            run.timeLeft -= 50;
            const pick = rollTsrRelicChoices(1)[0];
            if (pick) addTsrRelic(pick);
            else addTsrRunCurrency(Math.floor(90 * forgeMult));
        } else if (path === 'imbue') {
            run.timeLeft -= 25;
            addTempBuff({ name: '熔炉灌注', effect: 'attack', value: 0.55, duration: 5, isDebuff: false });
            addTsrLog('熔炉灌注：接下来5次行动攻击+55%', 'success');
        } else if (path === 'arm') {
            run.timeLeft -= 40;
            tryDropTsrEquipment('时光熔炉', { isForge: true });
        } else if (path === 'smelt') {
            run.timeLeft -= 55;
            showTsrEquipFusionPanel();
            if (document.getElementById('tsrEquipFusionPanel')?.style.display !== 'block') {
                afterAction();
                return;
            }
            addTsrLog('熔炼炉升温：请选择要熔炼的装备对', 'info');
            return;
        } else if (path === 'wash') {
            run.timeLeft -= 45;
            showTsrEquipReforgePanel();
            if (document.getElementById('tsrEquipReforgePanel')?.style.display !== 'block') {
                afterAction();
                return;
            }
            addTsrLog('熔炉洗炼台就绪：请选择要洗炼的装备', 'info');
            return;
        }
        if (run.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
        else afterAction();
    });
}

function handleArenaRoom() {
    const tsr = player.timeSecretRealm;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    const arenaMult = 1 + getTsrPermanentArenaBonus();
    const floor = tsr.currentRun.currentFloor;
    let wins = 0;
    addTsrLog('时光竞技场开幕！两连胜可获得丰厚奖励', 'info');
    for (let wave = 1; wave <= 2; wave++) {
        const isElite = wave === 2;
        const monster = pickTsrMonster(false, isElite, floor, dm);
        const monsterStats = computeTsrMonsterStats({
            isBoss: false, isElite, floor, difficultyMultiplier: dm, monster
        });
        updateTsrMonsterBanner(monster, monsterStats, false, isElite);
        addTsrLog(`竞技场第${wave}轮：${formatTsrMonsterNamePlain(monster)}`, 'info');
        const waveScale = wave === 2 ? 0.88 : 0.72;
        let monsterHp = Math.floor(monsterStats.hp * waveScale);
        let monsterMaxHp = monsterHp;
        let monsterAtk = Math.floor(monsterStats.atk * waveScale);
        const atkBonus = getTsrBattleAttackBonus(false, isElite);
        let rounds = 0;
        let victory = false;
        while (rounds < 10 && monsterHp > 0) {
            rounds++;
            const hit = calculateBattleDamage();
            const dmg = Math.max(1, Math.floor((Number(hit.damage) || 0) * (1 + atkBonus)));
            monsterHp = Math.max(0, monsterHp - dmg);
            const _hpZa = tryTsrMonsterHpZero(monster, monsterHp, monsterMaxHp, monsterAtk, { isBoss: false, isElite, rounds });
            monsterHp = _hpZa.monsterHp;
            monsterMaxHp = _hpZa.monsterMaxHp;
            monsterAtk = _hpZa.monsterAtk;
            if (_hpZa.isDead) victory = true;
            if (monster && rounds % 2 === 0 && !victory) {
                const playerAtk = calculateTsrPlayerAttack();
                monsterHp = applyTsrMonsterSkill(monster, rounds, monsterHp, playerAtk, dm, false, isElite) || monsterHp;
                if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); return; }
            }
            const counterRatio = getTsrBattleCounterRatio(false, isElite, dm) * 1.05;
            const counter = Math.max(1, Math.floor(monsterAtk * counterRatio * getTsrCounterDamageMultiplier() * (victory ? TSR_DEATH_COUNTER_RATIO : 1)));
            applyDamage(counter);
            if (bLteZero(tsr.currentRun.playerHealth)) { hideTsrMonsterBanner(); return; }
            if (victory) break;
        }
        if (bLteZero(tsr.currentRun.playerHealth)) {
            hideTsrMonsterBanner();
            addTsrLog(`竞技场第${wave}轮战败，挑战结束`, 'error');
            afterAction();
            return;
        }
        if (!victory) {
            hideTsrMonsterBanner();
            addTsrLog(`竞技场第${wave}轮超时失败`, 'error');
            break;
        }
        wins++;
        addTsrLog(`竞技场第${wave}轮胜利！`, 'success');
        if (wave === 1) tsrHealPlayer(0.12);
    }
    hideTsrMonsterBanner();
    if (wins === 2) {
        tsr.currentRun.battleWinStreak = (tsr.currentRun.battleWinStreak || 0) + 2;
        const gained = addTsrRunCurrency(Math.floor(130 * dm * arenaMult), { combo: true, eliteBonus: true });
        addTsrLog(`竞技场两连胜！获得${gained}秘境币`, 'success');
        if (Math.random() < 0.25 + getTsrPermanentRelicMagnetBonus() * 0.5 && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
            const pick = rollTsrRelicChoices(1)[0];
            if (pick) addTsrRelic(pick);
        }
    } else if (wins === 1) {
        addTsrRunCurrency(Math.floor(45 * dm * arenaMult));
    }
    afterAction();
}

function tsrMeditate() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    const floor = tsr.currentRun.currentFloor;
    if (tsr.currentRun.meditatedFloor === floor) {
        addTsrLog('本层已经冥想过了', 'warning');
        return;
    }
    if (tsr.currentRun.timeLeft <= 22) {
        addTsrLog('剩余时间不足，无法冥想', 'warning');
        return;
    }
    tsr.currentRun.timeLeft -= 20;
    tsr.currentRun.meditatedFloor = floor;
    const healRatio = 0.28 * ((tsr.currentRun.relics || []).includes('coffee') ? 1.5 : 1);
    tsrHealPlayer(healRatio);
    addTsrLog(`冥想恢复：消耗20秒，恢复${(healRatio * 100).toFixed(0)}%生命`, 'success');
    updateHealthBar();
    if (tsr.currentRun.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
    else updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
}

function getTsrSpaceGambleWinRate(base) {
    const tsr = player.timeSecretRealm;
    const bonus = getTsrRelicBonus('gamble') + getTsrPermanentGambleBonus()
        + (tsr.currentRun?.contractMods?.gamble || 0) + (getTsrActiveAffix()?.gamble || 0);
    return Math.min(0.88, Math.max(0.2, (Number(base) || 0.5) + bonus));
}

/** 赌局窗口序号：第1-5层=0，第6-10层=1… */
function getTsrSpaceGambleWindowKey(floor) {
    return Math.floor(((Number(floor) || 1) - 1) / TSR_SPACE_GAMBLE_FLOOR_INTERVAL);
}

function getTsrSpaceGambleWindowRange(floor) {
    const windowKey = getTsrSpaceGambleWindowKey(floor);
    const start = windowKey * TSR_SPACE_GAMBLE_FLOOR_INTERVAL + 1;
    const end = start + TSR_SPACE_GAMBLE_FLOOR_INTERVAL - 1;
    return { start, end, windowKey };
}

/** 按当前层同步赌局计数；进入新的 N 层窗口时清零 */
function syncTsrSpaceGambleFloorQuota() {
    const run = player.timeSecretRealm?.currentRun;
    if (!run?.isActive) return null;
    const floor = run.currentFloor || 1;
    const windowKey = getTsrSpaceGambleWindowKey(floor);
    if (run.spaceGambleFloor !== windowKey) {
        run.spaceGambleFloor = windowKey;
        run.spaceGambleUsedThisFloor = 0;
    }
    if (run.spaceGambleUsedThisFloor == null) run.spaceGambleUsedThisFloor = 0;
    return run;
}

function getTsrSpaceGambleLeftThisFloor() {
    const run = syncTsrSpaceGambleFloorQuota();
    if (!run) return 0;
    return Math.max(0, TSR_SPACE_GAMBLE_PER_WINDOW - (run.spaceGambleUsedThisFloor || 0));
}

function markTsrSpaceGamblePlayed() {
    const tsr = player.timeSecretRealm;
    const run = syncTsrSpaceGambleFloorQuota();
    if (run) run.spaceGambleUsedThisFloor = (run.spaceGambleUsedThisFloor || 0) + 1;
    if (isTsrTutorialRun()) return;
    if (!tsr.codex) tsr.codex = { rooms: {}, relics: {}, elites: 0, gambles: 0 };
    tsr.codex.gambles = (tsr.codex.gambles || 0) + 1;
    bumpTsrQuestProgress('runGambles', 1);
}

function closeTsrSpaceGamblePanel() {
    hideTsrChoicePanels(true);
    const run = player.timeSecretRealm?.currentRun;
    if (!run?.isActive) return;
    if (run.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
    else updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
}

function tsrApplySpaceGambleTimePenalty(extra) {
    const tsr = player.timeSecretRealm;
    if (!extra) return;
    if (typeof hasTsrRelic === 'function' && hasTsrRelic('mask')) {
        addTsrLog('赌徒面具抵消了时间惩罚', 'info');
        return;
    }
    tsr.currentRun.timeLeft -= extra;
    addTsrLog(`额外损失${extra}秒`, 'warning');
}

/** 赌局：尝试掉落局内装备（可高概率/必掉） */
function tsrSpaceGambleTryEquip(opts) {
    opts = opts || {};
    if (typeof tryDropTsrEquipment !== 'function') return false;
    const ok = tryDropTsrEquipment(opts.label || '时空赌局', {
        chance: opts.chance != null ? opts.chance : 0.85,
        isElite: !!opts.isElite,
        isBoss: !!opts.isBoss,
        tier: opts.tier
    });
    return !!ok;
}

/** 赌局：尝试发放永久徽章（不兑秘境币） */
function tsrSpaceGambleTryBadge(chance) {
    if (typeof grantTsrBadge !== 'function' || typeof pickTsrBadgeDropId !== 'function') return false;
    if (Math.random() >= (chance != null ? chance : 0.42)) return false;
    return !!grantTsrBadge(pickTsrBadgeDropId(), 'gamble');
}

/** 随机一条较强的临时属性 */
function tsrSpaceGambleRollTempBuff(power) {
    power = power || 'normal';
    const pools = {
        soft: [
            { name: '赌局锋芒', effect: 'attack', value: 0.22, duration: 3 },
            { name: '赌局锐目', effect: 'critRate', value: 0.1, duration: 3 },
            { name: '赌局护体', effect: 'health', value: 0.12, duration: 3 }
        ],
        normal: [
            { name: '赌局战意', effect: 'attack', value: 0.32, duration: 4 },
            { name: '赌局暴影', effect: 'critDamage', value: 0.28, duration: 3 },
            { name: '赌局锐目', effect: 'critRate', value: 0.14, duration: 4 },
            { name: '赌局铁躯', effect: 'health', value: 0.2, duration: 4 },
            { name: '赌局疾步', effect: 'speed', value: 6, duration: 3 }
        ],
        strong: [
            { name: '时砂狂战', effect: 'attack', value: 0.45, duration: 4 },
            { name: '时砂裂空', effect: 'critDamage', value: 0.4, duration: 4 },
            { name: '时砂铁壁', effect: 'health', value: 0.3, duration: 4 },
            { name: '时砂闪击', effect: 'critRate', value: 0.18, duration: 4 },
            { name: '时砂急流', effect: 'speed', value: 10, duration: 4 }
        ]
    };
    const list = pools[power] || pools.normal;
    const pick = list[Math.floor(Math.random() * list.length)];
    addTempBuff({ ...pick, isDebuff: false });
    return pick;
}

/** 时空赌局：全随机开桌（不再自选玩法，不产出秘境币） */
function tsrGambleTime() {
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    if (!run?.isActive) return;
    if (run.battleInProgress || run._resolvingBattle || run._choiceResolving) {
        addTsrLog('战斗或抉择进行中，无法进入时空赌局', 'warning');
        return;
    }
    if (typeof isTsrChoicePanelPending === 'function' && isTsrChoicePanelPending()) {
        addTsrLog('请先完成当前抉择，再开赌局', 'warning');
        return;
    }
    const left = getTsrSpaceGambleLeftThisFloor();
    const range = getTsrSpaceGambleWindowRange(run.currentFloor || 1);
    if (left <= 0) {
        addTsrLog(`第${range.start}-${range.end}层时空赌局已用完（每${TSR_SPACE_GAMBLE_FLOOR_INTERVAL}层1次），第${range.end + 1}层起刷新`, 'warning');
        return;
    }
    if (run.timeLeft <= 35) {
        addTsrLog('剩余时间不足，无法参与时空赌局（建议保留35秒以上）', 'warning');
        return;
    }
    const kind = TSR_SPACE_GAMBLE_KINDS[Math.floor(Math.random() * TSR_SPACE_GAMBLE_KINDS.length)];
    const kindName = TSR_SPACE_GAMBLE_KIND_NAMES[kind] || kind;
    addTsrLog(`时空赌局全随机开桌：抽到「${kindName}」（第${range.start}-${range.end}层窗口 1/${TSR_SPACE_GAMBLE_PER_WINDOW}）`, 'info');
    tsrResolveSpaceGamble(kind);
}

function tsrResolveSpaceGamble(kind) {
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    if (!run?.isActive) return;
    if (run._spaceGambleResolving) return;
    if (getTsrSpaceGambleLeftThisFloor() <= 0) {
        const range = getTsrSpaceGambleWindowRange(run.currentFloor || 1);
        addTsrLog(`第${range.start}-${range.end}层时空赌局已用完（每${TSR_SPACE_GAMBLE_FLOOR_INTERVAL}层1次）`, 'warning');
        closeTsrSpaceGamblePanel();
        return;
    }
    const costs = {
        time: 20, might: 22, spirit: 20, fate: 28,
        blood: 20, equip: 24, badge: 26, surge: 25
    };
    const cost = costs[kind];
    if (!cost) { closeTsrSpaceGamblePanel(); return; }
    if (run.timeLeft <= cost + 8) {
        addTsrLog('时间见底，这一桌开不了', 'warning');
        return;
    }
    run._spaceGambleResolving = true;
    armTsrExitClickGuard(1000);
    setTimeout(() => {
        const r = player.timeSecretRealm?.currentRun;
        if (!r) return;
        r._spaceGambleResolving = false;
        if (!r.isActive) return;
        if (getTsrSpaceGambleLeftThisFloor() <= 0) {
            hideTsrChoicePanels(true);
            const range = getTsrSpaceGambleWindowRange(r.currentFloor || 1);
            addTsrLog(`第${range.start}-${range.end}层时空赌局已用完（每${TSR_SPACE_GAMBLE_FLOOR_INTERVAL}层1次）`, 'warning');
            updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
            return;
        }
        hideTsrChoicePanels(true);
        r.timeLeft -= cost;
        markTsrSpaceGamblePlayed();
        const leftAfter = getTsrSpaceGambleLeftThisFloor();
        const rangeAfter = getTsrSpaceGambleWindowRange(r.currentFloor || 1);
        const win = (base) => Math.random() < getTsrSpaceGambleWinRate(base);

        if (kind === 'time') {
            if (win(0.55)) {
                r.timeLeft += 45;
                addTsrLog(`时间骰胜出！耗${cost}秒，净得+${45 - cost}秒`, 'success');
            } else {
                addTsrLog('时间骰落空…时砂倒流', 'error');
                tsrApplySpaceGambleTimePenalty(12);
            }
        } else if (kind === 'might') {
            if (win(0.55)) {
                const buff = tsrSpaceGambleRollTempBuff('normal');
                const effectName = typeof formatTsrBuffEffectLabel === 'function'
                    ? formatTsrBuffEffectLabel(buff.effect)
                    : buff.effect;
                const label = buff.effect === 'speed'
                    ? `${buff.name}：${effectName}+${buff.value}×${buff.duration}`
                    : `${buff.name}：${effectName}+${Math.floor((buff.value || 0) * 100)}%×${buff.duration}`;
                addTsrLog(`战意骰：${label}（-${cost}秒）`, 'success');
            } else if (Math.random() < 0.5) {
                addTempBuff({ name: '赌局虚怯', effect: 'attack', value: -0.12, duration: 2, isDebuff: true });
                addTsrLog('战意骰失手：攻击-12%×2', 'error');
            } else {
                applyDamage(bMul(r.playerHealth, 0.06));
                addTsrLog('战意骰失手：受到6%生命伤害', 'error');
            }
        } else if (kind === 'spirit') {
            if (win(0.5)) {
                const roll = Math.random();
                if (roll < 0.4) {
                    chargeTsrSpirit(28);
                    addTsrLog(`灵潮骰：精灵充能+28（-${cost}秒）`, 'success');
                } else if (roll < 0.75) {
                    const keys = Object.keys(TSR_RUN_CONSUMABLES || {});
                    if (keys.length) {
                        addTsrConsumable(keys[Math.floor(Math.random() * keys.length)]);
                        addTsrLog(`灵潮骰：捡到一件时空道具（-${cost}秒）`, 'success');
                    } else {
                        chargeTsrSpirit(20);
                        addTsrLog(`灵潮骰：充能+20（-${cost}秒）`, 'success');
                    }
                } else {
                    if (typeof addTsrSpiritBond === 'function') addTsrSpiritBond(4);
                    chargeTsrSpirit(12);
                    addTsrLog(`灵潮骰：亲密度+4，充能+12（-${cost}秒）`, 'success');
                }
            } else {
                const drain = Math.max(8, Math.floor((r.spiritCharge || 0) * 0.15));
                r.spiritCharge = Math.max(0, (r.spiritCharge || 0) - drain);
                addTsrLog(`灵潮骰反噬：充能-${drain}%`, 'error');
                tsrApplySpaceGambleTimePenalty(8);
            }
        } else if (kind === 'equip') {
            if (win(0.48)) {
                const elite = Math.random() < 0.35;
                const dropped = tsrSpaceGambleTryEquip({
                    chance: 1,
                    isElite: elite,
                    label: elite ? '时空赌局·精英装匣' : '时空赌局·装匣'
                });
                if (dropped) addTsrLog(`装匣命中！获得局内装备（-${cost}秒）`, 'success');
                else {
                    const buff = tsrSpaceGambleRollTempBuff('normal');
                    addTsrLog(`装匣空振，转赠临时属性「${buff.name}」`, 'warning');
                }
            } else {
                applyDamage(bMul(r.playerHealth, 0.06));
                tsrApplySpaceGambleTimePenalty(8);
                addTsrLog('装匣炸裂：-6%生命', 'error');
            }
        } else if (kind === 'badge') {
            if (win(0.4)) {
                if (tsrSpaceGambleTryBadge(1)) {
                    addTsrLog(`徽印显形！永久徽章入手（-${cost}秒）`, 'success');
                } else {
                    // 理论上 grant 几乎总会成功；兜底给强 buff + 回血
                    tsrHealPlayer(0.2);
                    tsrSpaceGambleRollTempBuff('strong');
                    addTsrLog('徽印虚影消散，改为强力临时属性与回血20%', 'warning');
                }
            } else if (Math.random() < 0.45) {
                tsrApplySpaceGambleTimePenalty(12);
                addTsrLog('徽印黯淡，时砂倒流', 'error');
            } else {
                applyDamage(bMul(r.playerHealth, 0.07));
                addTsrLog('徽印反噬：-7%生命', 'error');
            }
        } else if (kind === 'blood') {
            if (win(0.5)) {
                // 大量回血：常态 35%，小概率 50%
                const big = Math.random() < 0.28;
                const ratio = big ? 0.5 : 0.35;
                tsrHealPlayer(ratio);
                if (Math.random() < 0.35) {
                    addTempBuff({ name: '回春余韵', effect: 'health', value: 0.12, duration: 3, isDebuff: false });
                    addTsrLog(`回春押大胜！恢复${Math.floor(ratio * 100)}%生命，并获得生命临时加成`, 'success');
                } else {
                    addTsrLog(`回春押胜利！大量回血${Math.floor(ratio * 100)}%（-${cost}秒）`, 'success');
                }
            } else {
                applyDamage(bMul(r.playerHealth, 0.08));
                addTsrLog('回春押失败：损失8%生命', 'error');
            }
        } else if (kind === 'surge') {
            if (win(0.48)) {
                const a = tsrSpaceGambleRollTempBuff('strong');
                let extra = '';
                if (Math.random() < 0.45) {
                    const b = tsrSpaceGambleRollTempBuff('soft');
                    extra = `，额外叠「${b.name}」`;
                }
                if (Math.random() < 0.4) {
                    tsrHealPlayer(0.15);
                    extra += '，并回血15%';
                }
                addTsrLog(`狂潮台：获得强力临时属性「${a.name}」${extra}（-${cost}秒）`, 'success');
            } else {
                addTempBuff({ name: '狂潮失衡', effect: 'attack', value: -0.15, duration: 2, isDebuff: true });
                applyDamage(bMul(r.playerHealth, 0.06));
                addTsrLog('狂潮反噬：攻击-15%×2，并-6%生命', 'error');
            }
        } else if (kind === 'fate') {
            // 命运轮：百宝齐出（装备/徽章/大回血/临时属性…），绝不产出秘境币
            const pool = [
                () => { r.timeLeft += 55; return { msg: '时砂暴涨！额外+55秒', ok: true }; },
                () => { tsrHealPlayer(0.4); return { msg: '命运甘泉：大量回血40%', ok: true }; },
                () => { tsrHealPlayer(0.55); return { msg: '奇迹回春：大量回血55%！', ok: true }; },
                () => {
                    const buff = tsrSpaceGambleRollTempBuff('strong');
                    return { msg: `强力临时属性：${buff.name}`, ok: true };
                },
                () => {
                    tsrSpaceGambleRollTempBuff('normal');
                    tsrSpaceGambleRollTempBuff('soft');
                    return { msg: '双属性加持：临时战力飙升', ok: true };
                },
                () => { chargeTsrSpirit(40); return { msg: '灵潮灌顶：充能+40', ok: true }; },
                () => {
                    const keys = Object.keys(TSR_RUN_CONSUMABLES || {});
                    if (keys.length) {
                        addTsrConsumable(keys[Math.floor(Math.random() * keys.length)]);
                        if (Math.random() < 0.4) addTsrConsumable(keys[Math.floor(Math.random() * keys.length)]);
                        return { msg: '道具雨：获得时空消耗品', ok: true };
                    }
                    r.timeLeft += 30;
                    return { msg: '虚空补给变成+30秒', ok: true };
                },
                () => {
                    if ((r.relics || []).length < getTsrRelicMax() && Math.random() < 0.4) {
                        const pick = rollTsrRelicChoices(1)[0];
                        if (pick && addTsrRelic(pick)) return { msg: '命运开出一件遗物！', ok: true };
                    }
                    r.timeLeft += 14;
                    chargeTsrSpirit(15);
                    return { msg: '遗物虚影消散，留下+14秒与充能+15', ok: true };
                },
                () => {
                    if (tsrSpaceGambleTryEquip({ chance: 0.92, isElite: Math.random() < 0.4, label: '时空赌局·命运装' })) {
                        return { msg: '命运轮吐出局内装备！', ok: true };
                    }
                    const buff = tsrSpaceGambleRollTempBuff('normal');
                    return { msg: `未掉装，改为临时属性「${buff.name}」`, ok: true };
                },
                () => {
                    if (tsrSpaceGambleTryBadge(0.7)) return { msg: '命运徽光：获得永久徽章！', ok: true };
                    tsrHealPlayer(0.25);
                    tsrSpaceGambleRollTempBuff('normal');
                    return { msg: '徽章未成，改为回血25%+临时属性', ok: true };
                },
                () => {
                    tsrHealPlayer(0.3);
                    if (tsrSpaceGambleTryEquip({ chance: 0.55, label: '时空赌局·福袋' })) {
                        return { msg: '福袋：回血30%并摸到装备！', ok: true };
                    }
                    return { msg: '福袋：大量回血30%', ok: true };
                },
                () => { applyDamage(bMul(r.playerHealth, 0.08)); return { msg: '厄运刻印：-8%生命', ok: false }; },
                () => {
                    addTempBuff({ name: '时砂迟滞', effect: 'attack', value: -0.1, duration: 2, isDebuff: true });
                    tsrApplySpaceGambleTimePenalty(10);
                    return { msg: '时砂迟滞：攻击-10%×2', ok: false };
                },
                () => {
                    r.battleWinStreak = 0;
                    tsrApplySpaceGambleTimePenalty(15);
                    return { msg: '连击被赌穿，连胜清零', ok: false };
                },
                () => {
                    r.oraclePreview = Math.max(r.oraclePreview || 0, 1);
                    if (typeof updateTsrRoomPreview === 'function') updateTsrRoomPreview();
                    return { msg: '窥见下一层预兆（预览+1）', ok: true };
                }
            ];
            const result = pool[Math.floor(Math.random() * pool.length)]();
            addTsrLog(`命运轮（-${cost}秒）：${result.msg}`, result.ok ? 'success' : 'error');
        }

        if (bLteZero(r.playerHealth)) return;
        if (leftAfter <= 0) {
            addTsrLog(`本窗口赌局已用尽（第${rangeAfter.start}-${rangeAfter.end}层），第${rangeAfter.end + 1}层起刷新`, 'info');
        } else {
            addTsrLog(`本窗口赌局剩余 ${leftAfter} 次（第${rangeAfter.start}-${rangeAfter.end}层）`, 'info');
        }
        if (r.timeLeft <= 0) endTimeSecretRealm('时间耗尽');
        else updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
    }, 60);
}

function hideTsrRunShopPanel(clearContent) {
    const panel = document.getElementById('tsrRunShopPanel');
    if (!panel) return;
    panel.style.display = 'none';
    if (clearContent) {
        const container = document.getElementById('tsrRunShopOffers');
        if (container) container.innerHTML = '';
    }
}

// 处理休息房间
function handleRestRoom() {
    tsrHealPlayer(0.3);
    addTsrLog('休息恢复！恢复了30%生命值', 'success');
    updateHealthBar();
    afterAction();
}


// 处理商店房间
function handleShopRoom() {
    const tsr = player.timeSecretRealm;
    const availableBuffs = Object.values(TSR_BUFF_TEMPLATES);
    const numOffers = 2 + Math.floor(Math.random() * 2);
    const offers = [];
    
    for (let i = 0; i < numOffers; i++) {
        if (Math.random() < 0.22) {
            const item = generateTsrEquipment({ floor: tsr.currentRun.currentFloor });
            offers.push({
                type: 'equipment',
                item,
                name: item.name,
                icon: item.icon,
                desc: formatTsrEquipStats(item) + ' · ' + (TSR_EQUIP_SLOT_META[item.slot]?.name || ''),
                cost: 85 + Math.floor(Math.random() * 70) + getTsrDifficultyTier() * 15
            });
        } else if (Math.random() < 0.35) {
            const keys = Object.keys(TSR_RUN_CONSUMABLES);
            const key = keys[Math.floor(Math.random() * keys.length)];
            const item = TSR_RUN_CONSUMABLES[key];
            offers.push({
                type: 'consumable',
                key,
                name: item.name,
                icon: item.icon,
                desc: item.desc,
                cost: 60 + Math.floor(Math.random() * 50)
            });
        } else {
            const randomIndex = Math.floor(Math.random() * availableBuffs.length);
            const buff = availableBuffs[randomIndex];
            offers.push({
                type: 'buff',
                buff,
                name: buff.name,
                cost: 100 + Math.floor(Math.random() * 50)
            });
        }
    }
    
    addTsrLog('神秘商店提供以下商品:');
    offers.forEach((offer, index) => {
        addTsrLog(`${index + 1}. ${offer.name} - ${offer.cost}秘境币`);
    });
    
    tsr.currentRun.currentShop = offers;
    showShopOptions(offers);
}

// 显示商店购买选项
function showShopOptions(offers) {
    const panel = document.getElementById('tsrRunShopPanel');
    const container = document.getElementById('tsrRunShopOffers');
    if (!panel || !container) return;
    panel.style.display = 'block';
    container.innerHTML = offers.map((offer, index) => `
        <div class="tsr-run-shop-offer" onclick="buyTsrBuff(${index})">
            <div style="font-weight:bold;color:#e6d4ff;">${offer.icon || '✨'} ${offer.name}</div>
            ${offer.desc ? `<div style="font-size:11px;color:#94a3b8;margin-top:2px;">${offer.desc}</div>` : ''}
            <div style="color:#ffd700;margin-top:4px;">${offer.cost} 秘境币</div>
        </div>
    `).join('');
}

// 购买临时强化
function buyTsrBuff(index) {
    const tsr = player.timeSecretRealm;
    const offer = tsr.currentRun.currentShop[index];
    
    if (!offer) return;
    
    if (tsr.currentRun.currencyEarned >= offer.cost) {
        tsr.currentRun.currencyEarned -= offer.cost;
        
        if (offer.type === 'consumable') {
            addTsrConsumable(offer.key);
            addTsrLog(`购买了${offer.name}，消耗${offer.cost}秘境币`);
            updateTsrConsumablesDisplay();
        } else if (offer.type === 'equipment' && offer.item) {
            addTsrEquipment(offer.item, '局内商店');
            addTsrLog(`购买了装备${offer.name}，消耗${offer.cost}秘境币`);
            updateTsrEquipmentDisplay();
        } else {
            if (!offer.buff.timeBonus) {
                offer.buff.timeBonus = getTimeBonusByEffect(offer.buff.effect);
            }
            addTempBuff(offer.buff);
            addTsrLog(`购买了${offer.name}，消耗${offer.cost}秘境币`);
        }
        updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true });
    } else {
        addTsrLog(`秘境币不足！需要${offer.cost}秘境币，只有${tsr.currentRun.currencyEarned}秘境币`);
    }
}

// 休息恢复
function tsrRest() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    
    if (!room || room.type !== 'rest') {
        addTsrLog('只有在休息房间才能使用休息恢复', 'warning');
        return;
    }
    
    tsr.currentRun.timeLeft -= Math.floor(15 * getTsrTimeCostMultiplier());
    const healRatio = 0.5 * (1 + getTsrRelicBonus('restBonus'));
    tsrHealPlayer(healRatio);
    tsr.currentRun.restedThisRun = true;
    tsr.currentRun.exploreStreak = 0;
    addTsrLog(`休息恢复！恢复了${(healRatio * 100).toFixed(0)}%生命值，消耗15秒时间`);
    
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
        return;
    }
    
    updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
}

// 前往下一层
function tsrNextFloor() {
    const tsr = player.timeSecretRealm;
    const difficulty = tsr.difficulty.levels[tsr.currentRun.difficulty];
    const clearFloor = difficulty.clearFloor;
    const difficultyMultiplier = tsr.currentRun.difficultyMultiplier;

    if (!canTsrAdvanceFloor()) return;
    
    if (tsr.currentRun.lastAction === 'nextFloor') {
        tsr.currentRun.consecutiveFloors++;
        const penalty = Math.min(4, tsr.currentRun.consecutiveFloors);
        const timePenalty = 22 + (penalty * 10);
        const healthPenalty = bMul(tsr.currentRun.playerHealth, penalty * 0.03);
        
        tsr.currentRun.timeLeft -= timePenalty;
        tsr.currentRun.playerHealth = bSub(tsr.currentRun.playerHealth, healthPenalty);
        
        addTsrLog(`连续赶层惩罚（第${tsr.currentRun.consecutiveFloors}次）：-${timePenalty}秒，-${(penalty * 3)}%生命`, 'warning');
        
        // 检查是否失败
        if (checkHealthFailure() || tsr.currentRun.timeLeft <= 0) {
            return;
        }
    } else {
        tsr.currentRun.consecutiveFloors = 0;
    }
    
    tsr.currentRun.lastAction = 'nextFloor';
    
    const timeCost = Math.max(8, Math.floor(
        16 * getTsrActionDifficultyScale(difficultyMultiplier) * getTsrTimeCostMultiplier()
    ));
    tsr.currentRun.timeLeft -= timeCost;
    
    // 增加层数（赌局按 N 层窗口刷新，不在此处清零）
    tickTsrFloorAffix();
    tsr.currentRun.currentFloor++;
    syncTsrSpaceGambleFloorQuota();
    if (tsr.currentRun.currentFloor % 7 === 0) {
        applyTsrFloorAffix(rollTsrFloorAffix());
    }
    tsr.currentRun.exploredRooms = 0;
    syncTsrRunQuestFloor();
    tsr.currentRun.timeLeft += getTsrFloorTimeReturn();
    if (tsr.currentRun.bankedTime > 0) {
        const interest = Math.min(22, Math.floor(tsr.currentRun.bankedTime * 0.1));
        tsr.currentRun.timeLeft += interest;
        addTsrLog(`时光银行结息+${interest}秒`, 'success');
    }
    tsr.currentRun.exploreStreak = 0;
    if (tsr.currentRun.oraclePreview > 0) tsr.currentRun.oraclePreview--;
    if ((tsr.currentRun.chronoCapsuleFloors || 0) > 0) tsr.currentRun.chronoCapsuleFloors--;
    const pactCombat = tsr.currentRun.spiritPactCombat;
    if (pactCombat) {
        if (pactCombat.strikeFloors > 0) {
            pactCombat.strikeFloors--;
            if (pactCombat.strikeFloors <= 0) pactCombat.strikeMult = 1;
        }
        if (pactCombat.armorFloors > 0) {
            pactCombat.armorFloors--;
            if (pactCombat.armorFloors <= 0) pactCombat.counterReduce = 0;
        }
    }
    if (tsr.currentRun.spiritStrikeAmpFloors > 0) {
        tsr.currentRun.spiritStrikeAmpFloors--;
        if (tsr.currentRun.spiritStrikeAmpFloors <= 0) tsr.currentRun.spiritStrikeAmp = null;
    }
    if (tsr.currentRun.currentFloor % 10 === 0) {
        const milestoneBonus = 12 + getTsrPermanentMilestoneBonus();
        tsr.currentRun.timeLeft += milestoneBonus;
        addTsrLog(`里程碑第${tsr.currentRun.currentFloor}层！时光祝福+${milestoneBonus}秒`, 'success');
    }
    
    // 更新最佳层数
    if (tsr.currentRun.currentFloor > tsr.bestFloor) {
        tsr.bestFloor = tsr.currentRun.currentFloor;
    }

    addTsrLog(`进入了第${tsr.currentRun.currentFloor}层！消耗${timeCost}秒时间`);

    // 通关目标 N 层：打完 N 后再进第 N+1 层时自动撤离通关
    if (tryTsrAutoClearOnReachFloor()) return;

    if (tsr.currentRun.currentFloor === clearFloor) {
        addTsrLog(`🎯 已达通关目标第${clearFloor}层，完成本层后再前往下一层将自动通关撤离`, 'success');
    } else if (tsr.currentRun.currentFloor >= clearFloor * 0.8) {
        addTsrLog(`📈 当前层数: ${tsr.currentRun.currentFloor}/${clearFloor}，接近通关！`, 'info');
    } else if (tsr.currentRun.currentFloor >= clearFloor * 0.5) {
        addTsrLog(`📈 当前层数: ${tsr.currentRun.currentFloor}/${clearFloor}，已完成一半进度`, 'info');
    }
    
    // 生成新房间（难度越高房间越难）
    generateNewRoom();
    
    // 检查时间是否用完
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
        return;
    }
    
    updateTimeSecretRealmUI();
}

/**
 * 通关目标为 N 层时：进入第 N+1 层才自动撤离通关（第 N 层仍可完整探索）。
 * 例：通关 10 层 → 进第 11 层时自动结算。
 */
function tryTsrAutoClearOnReachFloor() {
    const tsr = player?.timeSecretRealm;
    const run = tsr?.currentRun;
    if (!run?.isActive || run._autoClearing) return false;
    const difficulty = tsr.difficulty?.levels?.[run.difficulty];
    const clearFloor = run.clearFloor || difficulty?.clearFloor;
    if (!clearFloor || run.currentFloor <= clearFloor) return false;
    // 挑战模式有独立通关逻辑，禁止被标准「通关层自动撤离」打断
    if (run.isBossRush || run.isTrialTower || run.isWeeklyBoss) return false;
    // 战斗/抉择进行中不打断；留到结束后再由调用方重试
    if (run.battleInProgress || run._resolvingBattle || run._choiceResolving
        || run._interactiveResolving || run._finishingMeme
        || run._tsrTacticPicking || run.currentRoom?._tsrTacticPicking) {
        return false;
    }
    if (typeof isTsrChoicePanelPending === 'function' && isTsrChoicePanelPending()) return false;
    run._autoClearing = true;
    addTsrLog(`🎉 已通过通关层 ${clearFloor}（现第${run.currentFloor}层）！自动撤离通关结算`, 'success');
    endTimeSecretRealm('通关撤离');
    return true;
}

// 退出秘境
function tsrExitRealm() {
    const run = player?.timeSecretRealm?.currentRun;
    // 战前抉择 / 面板刚收起：防止点击穿透误撤离
    if (window._tsrExitClickGuardUntil && Date.now() < window._tsrExitClickGuardUntil) {
        return;
    }
    if (run?._exitRealmBusy) return;
    const tacticPicking = !!(run?.currentRoom?._tsrTacticPicking || run?._tsrTacticPicking);
    if (tacticPicking || run?._resolvingBattle || run?.battleInProgress
        || run?._interactiveResolving || run?._finishingMeme || run?._choiceResolving) {
        addTsrLog('战斗或抉择进行中，暂时无法撤离', 'warning');
        return;
    }
    if (typeof isTsrChoicePanelPending === 'function' && isTsrChoicePanelPending()) {
        addTsrLog('请先完成当前抉择再撤离', 'warning');
        return;
    }
    if (!run?.isActive) return;
    const floor = run.currentFloor || 1;
    const coin = run.currencyEarned || 0;
    run._exitRealmBusy = true;
    const ok = confirm(`确定中途撤离时光秘境吗？\n\n当前层数：${floor}\n本局秘境币：${coin}\n\n撤离后本局立即结算结束。`);
    run._exitRealmBusy = false;
    if (!ok) return;
    if (typeof armTsrExitClickGuard === 'function') armTsrExitClickGuard(800);
    endTimeSecretRealm('主动退出');
}

// 结束时光秘境冒险
function endTimeSecretRealm(reason) {
    const tsr = player?.timeSecretRealm;
    if (!tsr) return;
    // 先停表：结算耗时长，否则会一边通关一边扣到 0，再重入「时间耗尽」把下一局秒杀
    stopTsrTimer();
    if (tsr._endingRun) return;
    if (!tsr.currentRun?.isActive) return;
    tsr._endingRun = true;

    try {
    const difficulty = tsr.difficulty?.levels?.[tsr.currentRun.difficulty];
    if (!difficulty) {
        addTsrLog('秘境结算异常：难度数据缺失，已强制回大厅', 'error');
        disposeTsrRunUiState();
        resetTsrCurrentRun();
        showTsrLobbyView();
        updateTimeSecretRealmUI();
        return;
    }
    // 立刻冻结本局，避免结算过程中其它逻辑再判负/扣时
    tsr.currentRun.isActive = false;

    const clearFloor = tsr.currentRun.clearFloor || difficulty.clearFloor;
    const isTutorial = !!tsr.currentRun.isTutorial;
    
    const reachedClearFloor = tsr.currentRun.currentFloor >= clearFloor;
    const clearedSuccessfully = reachedClearFloor && isTsrSuccessfulClear(reason);
    const countsAsMetaClear = clearedSuccessfully && !isTutorial;
    
    if (countsAsMetaClear) {
        tsr.clearCount++;
        bumpTsrQuestProgress('weeklyClears', 1);
        recordTsrDailyClear();
        const diffKey = tsr.currentRun.difficulty;
        if (tsr.clearCountByDifficulty[diffKey] !== undefined) {
            tsr.clearCountByDifficulty[diffKey]++;
        }
        if (tsr.currentRun.fateCard) {
            if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
            tsr.lifetimeStats.fateCardClears = (tsr.lifetimeStats.fateCardClears || 0) + 1;
        }
        if ((tsr.currentRun.resonanceBursts || 0) > (tsr.lifetimeStats?.maxResonanceBursts || 0)) {
            if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
            tsr.lifetimeStats.maxResonanceBursts = tsr.currentRun.resonanceBursts;
        }
        addTsrLog(`恭喜！成功通关${difficulty.name}难度（达到${clearFloor}层）`, 'success');
        
        checkDifficultyUnlocks();
        
        const streakBonus = getTsrClearStreakBonus();
        const clearRate = 0.5 + Math.min(0.25, getTsrPermanentClearRewardBonus()) + streakBonus;
        const clearBonus = addTsrRunCurrency(Math.floor(tsr.currentRun.currencyEarned * clearRate), { skipGainScale: true });
        addTsrLog(`通关奖励！额外获得${clearBonus}秘境币${streakBonus > 0 ? '（含连击日加成）' : ''}`, 'success');
    } else if (clearedSuccessfully && isTutorial) {
        addTsrLog('📘 教学局通关：不计入正式通关，不发奖', 'info');
    }
    
    let finalReward = isTutorial ? 0 : Math.floor(tsr.currentRun.currencyEarned);
    if (isTutorial) {
        addTsrLog('📘 教学局结算：秘境币/图鉴/成就/徽章/装备等均不外带', 'info');
    } else {
        const anchorRate = getTsrRelicBonus('exitBonus');
        if (anchorRate > 0 && (tsr.currentRun.relics || []).includes('anchor')) {
            finalReward = Math.floor(finalReward * (1 + anchorRate));
            addTsrLog(`定锚宝珠：撤离结算额外+${(anchorRate * 100).toFixed(0)}%秘境币`, 'success');
        }
        // 挑战模式自有薄奖；正常探索按难度封顶（简单≤100 / 奇点≤80万）
        if (!isTsrChallengeRun?.(tsr.currentRun)) {
            const runCap = getTsrDifficultyRunCurrencyCap(tsr.currentRun.difficulty);
            if (runCap != null && finalReward > runCap) {
                addTsrLog(`本难度秘境币封顶 ${runCap.toLocaleString()}（原结算 ${finalReward.toLocaleString()}）`, 'info');
                finalReward = runCap;
            }
        }
    }
    const actualAdded = isTutorial ? 0 : addTsrPermanentCurrency(finalReward);
    if (!isTutorial && actualAdded < finalReward) {
        addTsrLog(`秘境币已达上限${TSR_CURRENCY_MAX}，超出部分未计入`, 'warning');
    }
    
    if (!isTutorial && tsr.currentRun.currentFloor > tsr.bestFloor) {
        tsr.bestFloor = tsr.currentRun.currentFloor;
    }

    if (!isTutorial) {
        checkTsrAchievements({
            cleared: countsAsMetaClear,
            runRelics: (tsr.currentRun.relics || []).length,
            runEquipFull: countsAsMetaClear && TSR_EQUIP_SLOTS.every(s => tsr.currentRun.equipped?.[s]),
            runEquipSet4: countsAsMetaClear && hasTsrActiveEquipSet4(),
            runEquipLegendary4: countsAsMetaClear && hasTsrActiveLegendarySet4(),
            runEquipReforgeCount: tsr.currentRun.equipReforgeCount || 0,
            runEquipEnhance5: getTsrRunMaxEquipEnhance() >= 5,
            noRest: !tsr.currentRun.restedThisRun,
            maxBattleStreak: tsr.currentRun.maxBattleStreak || 0,
            spiritContractClear: countsAsMetaClear && (
                tsr.selectedContract === 'spiritGuard' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'spiritGuard')
            ),
            spiritSageClear: countsAsMetaClear && (
                tsr.selectedContract === 'spiritSage' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'spiritSage')
            ),
            spiritHunterClear: countsAsMetaClear && (
                tsr.selectedContract === 'spiritHunter' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'spiritHunter')
            ),
            starSpiritClear: countsAsMetaClear && (ensureTsrSpiritPet()?.evolution || 0) >= getTsrSpiritMaxEvolution(),
            starSpiritContractClear: countsAsMetaClear && (
                tsr.selectedContract === 'starSpirit' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'starSpirit')
            ),
            affixLordClear: countsAsMetaClear && (
                tsr.selectedContract === 'affixLord' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'affixLord')
            ),
            fortuneSeekerClear: countsAsMetaClear && (
                tsr.selectedContract === 'fortuneSeeker' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'fortuneSeeker')
            ),
            chronoHunterClear: countsAsMetaClear && (
                tsr.selectedContract === 'chronoHunter' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'chronoHunter')
            ),
            codexKeeperClear: countsAsMetaClear && (
                tsr.selectedContract === 'codexKeeper' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'codexKeeper')
            )
        });
        checkTsrAchievements();
        checkTsrDailyChallenge({
            cleared: countsAsMetaClear,
            contract: tsr.selectedContract,
            noRest: !tsr.currentRun.restedThisRun,
            maxBattleStreak: tsr.currentRun.maxBattleStreak || 0,
            difficulty: tsr.currentRun.difficulty,
            runRelics: (tsr.currentRun.relics || []).length,
            spiritContractClear: countsAsMetaClear && (
                tsr.selectedContract === 'spiritGuard' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'spiritGuard')
            ),
            spiritSageClear: countsAsMetaClear && (
                tsr.selectedContract === 'spiritSage' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'spiritSage')
            ),
            spiritHunterClear: countsAsMetaClear && (
                tsr.selectedContract === 'spiritHunter' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'spiritHunter')
            ),
            starSpiritClear: countsAsMetaClear && (ensureTsrSpiritPet()?.evolution || 0) >= getTsrSpiritMaxEvolution(),
            starSpiritContractClear: countsAsMetaClear && (
                tsr.selectedContract === 'starSpirit' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'starSpirit')
            ),
            throneClearThisRun: countsAsMetaClear && !!tsr.currentRun.throneClearThisRun,
            tyrantKillThisRun: countsAsMetaClear && !!tsr.currentRun.tyrantKillThisRun,
            dualAffixKillThisRun: countsAsMetaClear && !!tsr.currentRun.dualAffixKillThisRun,
            affixLordClear: countsAsMetaClear && (
                tsr.selectedContract === 'affixLord' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'affixLord')
            ),
            fortuneSeekerClear: countsAsMetaClear && (
                tsr.selectedContract === 'fortuneSeeker' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'fortuneSeeker')
            ),
            chronoHunterClear: countsAsMetaClear && (
                tsr.selectedContract === 'chronoHunter' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'chronoHunter')
            ),
            codexKeeperClear: countsAsMetaClear && (
                tsr.selectedContract === 'codexKeeper' ||
                (canUseTsrSubContract() && tsr.selectedSubContract === 'codexKeeper')
            ),
            mirrorMazeWinThisRun: countsAsMetaClear && !!tsr.currentRun.mirrorMazeWinThisRun,
            championClearThisRun: countsAsMetaClear && !!tsr.currentRun.championClearThisRun
        });

        if (countsAsMetaClear && tsr.currentRun.starFortune) {
            if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
            tsr.lifetimeStats.starFortuneClears = (tsr.lifetimeStats.starFortuneClears || 0) + 1;
        }
    }
    
    const reasonText = typeof formatTsrEndReason === 'function' ? formatTsrEndReason(reason) : reason;
    addTsrLog(`=== ${difficulty.name}难度冒险结束 ===`);
    addTsrLog(`结束原因: ${reasonText}`);
    addTsrLog(`最终层数: ${tsr.currentRun.currentFloor}/${clearFloor}`);
    addTsrLog(`通关要求: ${clearFloor}层`);
    if (clearedSuccessfully) {
        addTsrLog('状态: 通关成功 ✓');
    } else if (reachedClearFloor) {
        addTsrLog('状态: 已达层数但未成功通关（' + reasonText + '）');
    } else {
        addTsrLog('状态: 未通关 ✗');
    }
    addTsrLog(`获得秘境币: ${finalReward}`);
    addTsrLog(`本局统计: 连击峰值×${tsr.currentRun.maxBattleStreak || 0} · 精灵充能已重置 · 探索房间${tsr.currentRun.exploredRooms || 0}间`);
    addTsrLog(`总秘境币: ${tsr.currency}`);
    
    // 重置当前冒险，释放局内大对象与闭包引用，避免内存/存档膨胀
    disposeTsrRunUiState();
    resetTsrCurrentRun();
    showTsrLobbyView();
    updateTimeSecretRealmUI();
    saveGame();
    } finally {
        tsr._endingRun = false;
        // 兜底再停一次：扩展包装器若在结算前又开了表
        stopTsrTimer();
    }
}
function ensureTimeSecretRealmData() {
    if (!player.timeSecretRealm) {
        player.timeSecretRealm = {
            currency: 0,
            bestFloor: 0,
            clearCount: 0,
            currentRun: getTsrIdleCurrentRun()
        };
    }
    const tsr = player.timeSecretRealm;
    stripTimeSecretRealmSaveBloat(tsr);

    const purchasedMap = extractTsrShopPurchasedMap(tsr);
    const defaultShopItems = getDefaultTsrShopItems();

    tsr.shopItems = {};
    Object.entries(defaultShopItems).forEach(([key, defaultItem]) => {
        tsr.shopItems[key] = {
            ...JSON.parse(JSON.stringify(defaultItem)),
            purchased: purchasedMap[key] || 0
        };
    });
    delete tsr.shopPurchased;

    const defaultTraps = getDefaultTsrTraps();
    const trapSkills = tsr.traps?.playerSkills || defaultTraps.playerSkills;
    tsr.traps = {
        types: defaultTraps.types,
        detectionSkills: defaultTraps.detectionSkills,
        disarmSkills: defaultTraps.disarmSkills,
        playerSkills: {
            detection: trapSkills.detection || 'basic',
            disarm: trapSkills.disarm || 'basic'
        }
    };
    if (tsr.totalRuns == null) tsr.totalRuns = 0;
    if (!tsr.codex) {
        tsr.codex = { rooms: {}, relics: {}, elites: 0, gambles: 0 };
    }
    if (!tsr.selectedContract) tsr.selectedContract = 'none';
    if (!tsr.selectedSubContract) tsr.selectedSubContract = 'none';
    if (!tsr.achievements) tsr.achievements = {};
    if (!tsr.codexMilestones) tsr.codexMilestones = {};
    if (!tsr.lifetimeStats) tsr.lifetimeStats = { memeRooms: 0, specialRooms: 0, spiritTriggers: 0, pddWins: 0 };
    ensureTsrSpiritPet();
    ensureTsrQuests();
    ensureTsrEngagement();
    tsr.currency = clampTsrCurrency(tsr.currency);

     // 初始化永久加成数据
    if (!tsr.permanentBonuses) {
        tsr.permanentBonuses = {
            baseTime: 0,
            startingBuffs: 0,
            eternalAttackBonus: 0,
            eternalHealthBonus: 0
        };
    } else {
        tsr.permanentBonuses.eternalAttackBonus = clampTsrEternalBonus(tsr.permanentBonuses.eternalAttackBonus);
        tsr.permanentBonuses.eternalHealthBonus = clampTsrEternalBonus(tsr.permanentBonuses.eternalHealthBonus);
    }
    if (typeof sanitizeTsrEternalBonuses === 'function') sanitizeTsrEternalBonuses();
    
    // 初始化各难度通关次数（旧存档兼容：无此字段时用总通关次数当作简单难度次数，避免进度丢失）
    if (!tsr.clearCountByDifficulty) {
        tsr.clearCountByDifficulty = { easy: 0, normal: 0, hard: 0, nightmare: 0, hell: 0, abyss: 0, eternal: 0, transcendent: 0, apocalypse: 0, void: 0, omega: 0, singularity: 0 };
        if (tsr.clearCount > 0) {
            tsr.clearCountByDifficulty.easy = Math.min(tsr.clearCount, 999);
        }
    } else {
        ['abyss', 'eternal', 'transcendent', 'apocalypse', 'void', 'omega', 'singularity'].forEach(k => {
            if (tsr.clearCountByDifficulty[k] == null) tsr.clearCountByDifficulty[k] = 0;
        });
    }
    
    // 初始化商店物品购买记录
    Object.values(tsr.shopItems).forEach(item => {
        if (item.purchased == null) item.purchased = 0;
    });

    const diffCurrent = tsr.difficulty?.current || 'easy';
    const diffUnlocked = Array.isArray(tsr.difficulty?.unlocked) ? tsr.difficulty.unlocked.slice() : ['easy'];
    tsr.difficulty = {
        levels: getDefaultTsrDifficultyLevels(),
        current: diffCurrent,
        unlocked: diffUnlocked
    };
    if (tsr.currentRun?.isActive) {
        ensureTsrRunEquipment(tsr.currentRun);
        // 读档后异步演出已失效；粘滞的 battleInProgress 会锁死「下一层」
        if (tsr.currentRun.battleInProgress) {
            tsr.currentRun.battleInProgress = false;
            tsr.currentRun.battleFeelSkip = false;
            tsr.currentRun._battleFeelTimers = [];
            tsr.currentRun._battleFeelResolvers = [];
            tsr.currentRun._battleFeelSafetyTimer = null;
            // 战斗数值在同步阶段已结算完再开演出，读档时允许进层
            const room = tsr.currentRun.currentRoom;
            if (room && room.explored && typeof isTsrCombatRoom === 'function' && isTsrCombatRoom(room) && !room.battleCleared) {
                room.battleCleared = true;
            }
        }
    }
}

function initTimeSecretRealm() {
    ensureTimeSecretRealmData();
    const tsr = player.timeSecretRealm;
    if (!canUseTsrSpiritContract()) {
        if (tsr.selectedContract === 'spiritGuard') tsr.selectedContract = 'none';
        if (tsr.selectedSubContract === 'spiritGuard') tsr.selectedSubContract = 'none';
    }
    if (!canUseTsrSpiritSageContract()) {
        if (tsr.selectedContract === 'spiritSage') tsr.selectedContract = 'none';
        if (tsr.selectedSubContract === 'spiritSage') tsr.selectedSubContract = 'none';
    }
    if (!canUseTsrSpiritHunterContract()) {
        if (tsr.selectedContract === 'spiritHunter') tsr.selectedContract = 'none';
        if (tsr.selectedSubContract === 'spiritHunter') tsr.selectedSubContract = 'none';
    }
    if (!canUseTsrStarSpiritContract()) {
        if (tsr.selectedContract === 'starSpirit') tsr.selectedContract = 'none';
        if (tsr.selectedSubContract === 'starSpirit') tsr.selectedSubContract = 'none';
    }
    if (!canUseTsrAffixLordContract()) {
        if (tsr.selectedContract === 'affixLord') tsr.selectedContract = 'none';
        if (tsr.selectedSubContract === 'affixLord') tsr.selectedSubContract = 'none';
    }
    if (!canUseTsrFortuneSeekerContract()) {
        if (tsr.selectedContract === 'fortuneSeeker') tsr.selectedContract = 'none';
        if (tsr.selectedSubContract === 'fortuneSeeker') tsr.selectedSubContract = 'none';
    }
    if (!canUseTsrChronoHunterContract()) {
        if (tsr.selectedContract === 'chronoHunter') tsr.selectedContract = 'none';
        if (tsr.selectedSubContract === 'chronoHunter') tsr.selectedSubContract = 'none';
    }
    if (!canUseTsrCodexKeeperContract()) {
        if (tsr.selectedContract === 'codexKeeper') tsr.selectedContract = 'none';
        if (tsr.selectedSubContract === 'codexKeeper') tsr.selectedSubContract = 'none';
    }
    checkDifficultyUnlocks();
    rollTsrFateCards();
    updateTsrFateCardUI();
    updateDifficultyUI();
    ensureTsrQuests();
    selectTsrContract(player.timeSecretRealm.selectedContract || 'none');
    selectTsrSubContract(player.timeSecretRealm.selectedSubContract || 'none');
    updateTsrSubContractUI();
    updateTsrContractHint();
    updateTsrQuestsDisplay();
    updateTsrSpiritDisplay();
    updateTsrSpiritContractUI();
    if (typeof updateTechniqueBonuses === 'function') {
        updateTechniqueBonuses();
    } else {
        applyTsrEternalRuneBonuses();
    }
}

// 开始秘境计时器
function startTsrTimer() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    stopTsrTimer();
    const gen = tsr._timerGen || 0;
    const runToken = tsr.currentRun.runId || (tsr.currentRun.runId = `${Date.now().toString(36)}_${Math.floor(Math.random() * 1e9).toString(36)}`);
    const id = registerInterval(() => {
        // 读档会整体替换 player：旧回调绝不能再动新局
        if (player?.timeSecretRealm !== tsr) return;
        // 被 stop / 新局 start 作废后，孤儿回调直接退出，防止叠加速
        if (tsr._timerGen !== gen || tsr._endingRun) return;
        const run = tsr.currentRun;
        if (!run?.isActive || run.runId !== runToken) return;
        // 战斗 / 抉择中暂停墙钟，避免看动画就把时间耗光
        if (run.battleInProgress || run._resolvingBattle) {
            tickTsrTimedEffects();
            return;
        }
        if (typeof isTsrChoicePanelPending === 'function' && isTsrChoicePanelPending()) {
            tickTsrTimedEffects();
            return;
        }
        run.timeLeft--;
        tickTsrTimedEffects();
        
        if (isTsrUiOpen()) {
            updateTsrTimeRing();
            if (run.luckExpiresAt && Date.now() < run.luckExpiresAt) {
                updateBuffsDisplay();
            }
        }
        
        if (run.timeLeft <= 0) {
            endTimeSecretRealm('时间耗尽');
        }
    }, 1000);
    tsr.timer = id;
    window._tsrIntervalId = id;
}

// 扩展脚本会再包装 endTimeSecretRealm；下一帧挂最外层「先停表」，避免包装器前置逻辑期间秒表仍在扣
setTimeout(function installTsrEndEarlyStopGuard() {
    if (typeof endTimeSecretRealm !== 'function' || endTimeSecretRealm.__tsrEarlyStopGuard) return;
    const _origEnd = endTimeSecretRealm;
    endTimeSecretRealm = function (reason) {
        if (typeof stopTsrTimer === 'function') stopTsrTimer();
        return _origEnd.apply(this, arguments);
    };
    endTimeSecretRealm.__tsrEarlyStopGuard = true;
}, 0);


// 在玩家属性计算中应用增益效果（秘境独立战斗，不读取主世界 player.battle）
function calculateTsrPlayerHealth() {
    const combat = ensureTsrRunCombat();
    if (!combat) return TSR_COMBAT_BASE.maxHp;
    return bMul(combat.baseMaxHp, getTsrStatBuffMultiplier('health'));
}

function calculateTsrPlayerAttack() {
    const combat = ensureTsrRunCombat();
    if (!combat) return TSR_COMBAT_BASE.attack;
    return bMul(combat.baseAttack, getTsrStatBuffMultiplier('attack'));
}

function calculateTsrPlayerCritRate() {
    const combat = ensureTsrRunCombat();
    let base = combat ? combat.baseCritRate : TSR_COMBAT_BASE.critRate;
    let bonus = 0;
    const tsr = player.timeSecretRealm;
    if (tsr?.currentRun?.tempBuffs) {
        tsr.currentRun.tempBuffs.forEach(buff => {
            if (buff.effect === 'critRate') bonus += buff.value;
        });
    }
    bonus += getTsrRelicBonus('critRate') + getTsrEquipmentBonuses().critRate;
    return Math.min(0.55, base + bonus);
}

function calculateTsrPlayerDodgeRate() {
    return Math.min(0.18, getTsrEquipBonus('dodge'));
}

function calculateTsrPlayerCritDamage() {
    const combat = ensureTsrRunCombat();
    let base = combat ? combat.baseCritDamage : TSR_COMBAT_BASE.critDamage;
    let multiplier = 1;
    const tsr = player.timeSecretRealm;
    if (tsr?.currentRun?.tempBuffs) {
        tsr.currentRun.tempBuffs.forEach(buff => {
            if (buff.effect === 'critDamage') multiplier += buff.value;
        });
    }
    multiplier += getTsrEquipmentBonuses().critDamage;
    return base * multiplier;
}

function applyTsrEquipLifeSteal(dmg, isCrit) {
    if (!dmg || dmg <= 0) return;
    const ls = getTsrEquipBonus('lifeSteal') + getTsrEquipBonus('vampiric');
    if (ls <= 0) return;
    const ratio = ls * (isCrit ? 1 : 0.28);
    if (ratio > 0) tsrHealPlayer(ratio);
}

function calculateBattleDamage() {
    const tsr = player.timeSecretRealm;
    tsr.currentRun.playerAttack = calculateTsrPlayerAttack();
    const baseAttack = tsr.currentRun.playerAttack;
    const critRate = calculateTsrPlayerCritRate();
    const critDamage = getTsrEffectiveCritDamage();
    
    const isCrit = Math.random() < critRate;
    let damage = baseAttack;
    
    if (isCrit) {
        damage = bMul(damage, critDamage);
    }
    
    return {
        damage: damage,
        isCrit: isCrit
    };
}
// 修复增益效果应用函数
function applyBuffEffects() {
    const tsr = player.timeSecretRealm;
    const prevMaxHealth = calculateTsrPlayerHealth();
    syncTsrRunStatsAfterBuffChange(prevMaxHealth);
    tsr.currentRun.hasLuckBuff = tsr.currentRun.tempBuffs.some(buff => buff.effect === 'luck');
    tsr.currentRun.hasSpeedBuff = tsr.currentRun.tempBuffs.some(buff => buff.effect === 'speed');
}

// 修复增益显示函数，确保数值正确
function updateBuffsDisplay() {
    const tsr = player.timeSecretRealm;
    const container = document.getElementById('tsrCurrentBuffs');
    if (!container) return;
    const sig = getTsrBuffSignature();
    if (_tsrUiCache.buff === sig) return;
    _tsrUiCache.buff = sig;

    const buffs = tsr.currentRun?.tempBuffs || [];
    const luckActive = tsr.currentRun?.luckExpiresAt && Date.now() < tsr.currentRun.luckExpiresAt;
    if (!buffs.length && !luckActive) {
        container.innerHTML = '<div class="tsr-empty">无增益效果</div>';
        return;
    }

    let html = '';
    if (luckActive) {
        const left = Math.ceil((tsr.currentRun.luckExpiresAt - Date.now()) / 1000);
        html += `<div class="tsr-buff-item buff" style="position:relative;">
            <div style="font-weight:bold;color:#32cd32;margin-bottom:5px;">幸运硬币</div>
            <div style="font-size:12px;color:#32cd32;">双倍秘境币 · 剩余${left}秒</div>
            <div style="position:absolute;top:5px;right:5px;color:#32cd32;">🍀</div>
        </div>`;
    }
    buffs.forEach(buff => {
        let effectText = '';
        let valueText = '';
        switch (buff.effect) {
            case 'attack': effectText = '攻击力'; valueText = `${(buff.value * 100).toFixed(0)}%`; break;
            case 'health': effectText = '生命值'; valueText = `${(buff.value * 100).toFixed(0)}%`; break;
            case 'critRate': effectText = '暴击率'; valueText = `${(buff.value * 100).toFixed(1)}%`; break;
            case 'critDamage': effectText = '爆伤'; valueText = `${(buff.value * 100).toFixed(0)}%`; break;
            case 'speed': effectText = '探索速度'; valueText = `+${buff.value}`; break;
            case 'luck': effectText = '幸运'; valueText = '双倍秘境币'; break;
            default: effectText = '效果'; valueText = '';
        }
        const color = buff.isDebuff ? '#ff6b6b' : '#32cd32';
        const prefix = buff.isDebuff ? '' : '+';
        html += `<div class="tsr-buff-item ${buff.isDebuff ? 'debuff' : 'buff'}" style="position:relative;">
            <div style="font-weight:bold;color:${color};margin-bottom:5px;">${buff.name}</div>
            <div style="font-size:12px;color:${color};">${effectText}: ${prefix}${valueText}</div>
            ${buff.timeBonus ? `<div style="font-size:11px;color:#00bfff;margin-top:3px;">⏱️ +${buff.timeBonus}秒</div>` : ''}
            ${buff.duration ? `<div style="font-size:11px;color:#d8bfd8;margin-top:5px;">剩余: ${buff.duration}回合</div>` : ''}
            <div style="position:absolute;top:5px;right:5px;color:${color};">${buff.isDebuff ? '⚠️' : '✨'}</div>
        </div>`;
    });
    container.innerHTML = html;
}
// 在战斗日志中显示增益效果变化
function addBuffChangeLog(buff, isGained) {
    let effectDescription = '';
    let timeBonusText = '';
    
    // 生成效果描述
    switch(buff.effect) {
        case 'attack':
            effectDescription = `攻击力提升${(buff.value * 100).toFixed(0)}%`;
            break;
        case 'health':
            effectDescription = `生命值提升${(buff.value * 100).toFixed(0)}%`;
            break;
        case 'critRate':
            effectDescription = `暴击率提升${(buff.value * 100).toFixed(1)}%`;
            break;
        case 'critDamage':
            effectDescription = `爆伤提升${(buff.value * 100).toFixed(0)}%`;
            break;
        case 'speed':
            effectDescription = `探索速度提升`;
            break;
        case 'luck':
            effectDescription = '获得双倍秘境币';
            break;
        default:
            effectDescription = buff.name;
    }
    
    // 添加时间奖励描述
    if (buff.timeBonus && buff.timeBonus > 0) {
        timeBonusText = `，探索时间+${buff.timeBonus}秒`;
    }
    
    if (isGained) {
        addTsrLog(`获得增益: ${buff.name} (${effectDescription}${timeBonusText})`, 'success');
    } else {
        addTsrLog(`增益消失: ${buff.name}`, 'warning');
    }
}
// 修改增益添加逻辑，添加日志
function addTempBuff(buff) {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun.tempBuffs) {
        tsr.currentRun.tempBuffs = [];
    }
    const prevMaxHealth = calculateTsrPlayerHealth();
    
    const existingBuffIndex = tsr.currentRun.tempBuffs.findIndex(b => b.effect === buff.effect);
    
    if (existingBuffIndex !== -1) {
        tsr.currentRun.tempBuffs[existingBuffIndex] = buff;
    } else {
        tsr.currentRun.tempBuffs.push(buff);
    }
    
    if (buff.timeBonus && buff.timeBonus > 0) {
        tsr.currentRun.timeLeft += buff.timeBonus;
        addTsrLog(`获得${buff.timeBonus}秒探索时间奖励！`, 'success');
    }
    
    addBuffChangeLog(buff, true);
    invalidateTsrUiCache('buff');
    updateBuffsDisplay();
    syncTsrRunStatsAfterBuffChange(prevMaxHealth);
    updateHealthBar();
    updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
}
// 修改增益移除逻辑，添加日志
function removeExpiredBuffs() {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun.tempBuffs) return;
    
    const expiredBuffs = [];
    
    tsr.currentRun.tempBuffs = tsr.currentRun.tempBuffs.filter(buff => {
        if (buff.duration && buff.duration > 0) {
            buff.duration--;
            if (buff.duration <= 0) {
                expiredBuffs.push(buff);
                return false;
            }
        }
        return true;
    });
    
    expiredBuffs.forEach(buff => {
        addBuffChangeLog(buff, false);
    });
    
    // 重新计算玩家属性
    if (expiredBuffs.length > 0) {
        tsr.currentRun.playerHealth = calculateTsrPlayerHealth();
        tsr.currentRun.playerAttack = calculateTsrPlayerAttack();
        updateBuffsDisplay();
        updateHealthBar();
    }
}
// 生成房间奖励
function generateRoomRewards(roomType, difficultyMultiplier) {
    const tsr = player.timeSecretRealm;
    const floor = tsr.currentRun?.currentFloor || 1;
    const rewardMult = tsr.currentRun?.rewardMultiplier || 1;
    const baseRewards = {
        battle: { currency: 20, buffChance: 0.2 },
        elite: { currency: 45, buffChance: 0.35 },
        boss: { currency: 80, buffChance: 0.5 },
        shrine: { currency: 0, buffChance: 1 },
        event: { currency: 10, buffChance: 0.5 },
        treasure: { currency: 50, buffChance: 0.1 },
        rest: { currency: 0, buffChance: 0 },
        shop: { currency: 0, buffChance: 0 },
        portal: { currency: 0, buffChance: 0 },
        relic: { currency: 0, buffChance: 0 },
        mystery: { currency: 30, buffChance: 0.3 },
        vault: { currency: 40, buffChance: 0.2 },
        forge: { currency: 35, buffChance: 0.25 },
        arena: { currency: 60, buffChance: 0.15 },
        ppt: { currency: 25, buffChance: 0.2 },
        client: { currency: 30, buffChance: 0.15 },
        pdd: { currency: 20, buffChance: 0.1 },
        recall: { currency: 15, buffChance: 0.25 },
        kpi: { currency: 40, buffChance: 0.2 },
        duanzi: { currency: 18, buffChance: 0.35 },
        echo: { currency: 22, buffChance: 0.3 },
        weekly: { currency: 28, buffChance: 0.2 },
        blinddate: { currency: 20, buffChance: 0.25 },
        overtime996: { currency: 25, buffChance: 0.15 },
        lottery: { currency: 15, buffChance: 0.1 },
        standup: { currency: 22, buffChance: 0.3 },
        oracle: { currency: 10, buffChance: 0.4 },
        fusion: { currency: 0, buffChance: 0.5 },
        timebank: { currency: 12, buffChance: 0.2 },
        storm: { currency: 30, buffChance: 0.35 },
        spiritgarden: { currency: 18, buffChance: 0.45 },
        spiritsanctuary: { currency: 22, buffChance: 0.5 },
        spirittrial: { currency: 28, buffChance: 0.55 },
        gacha: { currency: 20, buffChance: 0.25 },
        escape: { currency: 30, buffChance: 0.2 },
        auction: { currency: 25, buffChance: 0.15 },
        monsterhunt: { currency: 35, buffChance: 0.3 },
        roulette: { currency: 18, buffChance: 0.35 },
        vending: { currency: 15, buffChance: 0.2 },
        spiritwell: { currency: 20, buffChance: 0.5 },
        spiritrift: { currency: 32, buffChance: 0.45 },
        spiritmemory: { currency: 16, buffChance: 0.55 }
    };
    
    const reward = { ...(baseRewards[roomType] || baseRewards.battle) };
    const clearFloor = tsr.currentRun?.clearFloor || 30;
    const floorScale = getTsrFloorRewardScale(floor, clearFloor);
    const baseCur = reward.currency;
    const isChallenge = typeof isTsrChallengeRun === 'function' && isTsrChallengeRun(tsr.currentRun);
    if (isChallenge) {
        // 挑战总收益控在约千币量级：固定档 + 难度轻抬，不再吃完整 rewardMult
        const tierBase = roomType === 'boss' ? 140 : (roomType === 'elite' ? 90 : 60);
        const diffNudge = 1 + Math.min(0.75, Math.log10(Math.max(1, Number(difficultyMultiplier) || 1)) * 0.55);
        reward.currency = Math.floor(tierBase * diffNudge * Math.min(1.15, floorScale));
    } else {
        reward.currency = Math.floor(
            reward.currency * difficultyMultiplier * rewardMult * floorScale
        );
    }
    reward.buffChance = Math.min(0.95, reward.buffChance * (0.85 + difficultyMultiplier * 0.08));
    
    return reward;
}


// 获取随机临时强化
function getRandomTempBuff() {
    const buffs = Object.values(TSR_BUFF_TEMPLATES);
    const randomBuff = buffs[Math.floor(Math.random() * buffs.length)];
    
    // 返回完整的buff对象，包含时间奖励
    return {
        name: randomBuff.name,
        effect: randomBuff.effect,
        value: randomBuff.value,
        timeBonus: randomBuff.timeBonus || getTimeBonusByEffect(randomBuff.effect),
        duration: randomBuff.duration || 0,
        isDebuff: false
    };
}

// 彩色富文本与秘境日志
function escapeTsrHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function tsrFmt(kind, text) {
    return `<span class="tsr-txt-${kind}">${escapeTsrHtml(text)}</span>`;
}

function formatTsrRichText(message, type, theme) {
    if (!message) return '';
    const raw = String(message);
    if (raw.includes('<span') || raw.includes('<b>') || raw.includes('<em>')) return raw;
    let html = escapeTsrHtml(raw);
    TSR_RICH_RULES.forEach(rule => {
        if (rule.full && rule.wrap) {
            html = html.replace(rule.re, (_, g1) => `<span class="tsr-txt-${rule.wrap}">【${g1}】</span>`);
        } else if (rule.cls) {
            html = html.replace(rule.re, m => `<span class="tsr-txt-${rule.cls}">${m}</span>`);
        }
    });
    return html;
}

function addTsrLog(message, type, theme) {
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    if (run?.deferBattleLogs) {
        if (!run.deferredBattleLogs) run.deferredBattleLogs = [];
        run.deferredBattleLogs.push({
            message,
            type: type || 'default',
            theme: theme || null,
            round: run.battleLogRound || 0
        });
        // 同步关键子事件到演出队列
        if (typeof pushTsrFeelEvent === 'function' && message) {
            const msg = String(message);
            if (/装备连击|追加/.test(msg)) pushTsrFeelEvent({ type: 'skill', label: '⚡ 连击!' });
            else if (/灵击/.test(msg)) pushTsrFeelEvent({ type: 'spirit', label: '✨ 灵击!' });
            else if (/噬血|回血|再生/.test(msg)) pushTsrFeelEvent({ type: 'heal', label: '💖 回血' });
            else if (/荆棘|反刺|反伤/.test(msg)) pushTsrFeelEvent({ type: 'hurt', label: '🩸 反伤' });
        }
        return;
    }
    writeTsrLogImmediate(message, type, theme);
}

function writeTsrLogImmediate(message, type, theme) {
    const logContainer = document.getElementById('tsrBattleLog');
    if (!logContainer) return;
    const logEntry = document.createElement('div');
    const timeStr = new Date().toLocaleTimeString();
    const baseType = type || 'default';
    const themeClass = theme ? (TSR_LOG_THEME_CLASS[theme] || `tsr-log-theme-${theme}`) : '';
    logEntry.className = ['tsr-log-entry', TSR_LOG_THEME_CLASS[baseType] || `tsr-log-${baseType}`, themeClass, 'tsr-log-pop'].filter(Boolean).join(' ');
    logEntry.innerHTML = `<span class="tsr-log-time">[${timeStr}]</span> ${formatTsrRichText(message, baseType, theme)}`;
    logContainer.appendChild(logEntry);
    while (logContainer.children.length > TSR_LOG_DOM_MAX) logContainer.removeChild(logContainer.firstChild);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function drainTsrDeferredLogs(roundFilter) {
    const run = player.timeSecretRealm?.currentRun;
    if (!run?.deferredBattleLogs?.length) return [];
    if (roundFilter == null) {
        const all = run.deferredBattleLogs.slice();
        run.deferredBattleLogs = [];
        return all;
    }
    const keep = [];
    const take = [];
    run.deferredBattleLogs.forEach(L => {
        if (L.round === roundFilter) take.push(L);
        else keep.push(L);
    });
    run.deferredBattleLogs = keep;
    return take;
}

function flushTsrDeferredLogsNow(logs) {
    (logs || []).forEach(L => writeTsrLogImmediate(L.message, L.type, L.theme));
}

// 打开秘境商店
function openTsrShop() {
    ensureTimeSecretRealmData();
    document.getElementById('tsrShopOverlay').style.display = 'block';
    document.getElementById('tsrShopUI').style.display = 'block';
    updateTsrShop();
}

// 关闭秘境商店
function closeTsrShop() {
    document.getElementById('tsrShopOverlay').style.display = 'none';
    document.getElementById('tsrShopUI').style.display = 'none';
}

// 更新秘境商店
function updateTsrShop() {
    const tsr = player.timeSecretRealm;
    const container = document.getElementById('tsrShopItems');
    const currencyEl = document.getElementById('tsrShopCurrency');
    if (currencyEl) currencyEl.textContent = `${tsr.currency.toFixed(0)} / ${TSR_CURRENCY_MAX}`;

    const sig = getTsrShopSignature();
    if (_tsrUiCache.shop === sig && container.innerHTML) {
        updatePermanentBonusesDisplay();
        return;
    }
    _tsrUiCache.shop = sig;

    const grouped = {};
    Object.entries(tsr.shopItems).forEach(([key, item]) => {
        const cat = item.category || 'enhance';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push([key, item]);
    });

    let html = '';
    const activeTab = _tsrShopActiveTab || 'all';
    Object.entries(TSR_SHOP_CATEGORIES).forEach(([catKey, catMeta]) => {
        if (activeTab !== 'all' && activeTab !== catKey) return;
        const items = grouped[catKey];
        if (!items || !items.length) return;
        html += `<div class="tsr-shop-section" data-shop-cat="${catKey}"><div class="tsr-shop-section-title">${catMeta.icon} ${catMeta.label}</div><div class="tsr-shop-section-grid">`;
        items.forEach(([key, item]) => {
            const blockReason = getTsrShopItemBlockReason(item);
            const isUnavailable = !!blockReason;
            const canAfford = tsr.currency >= item.cost;
            const purchaseInfo = item.maxPurchase ? ` ${item.purchased || 0}/${item.maxPurchase}` : '';
            const extraInfo = getTsrShopItemExtraInfo(item);
            const icon = item.icon || '📦';
            const cls = 'tsr-shop-item' + (isUnavailable ? ' disabled' : '') + (!canAfford && !isUnavailable ? ' tsr-shop-cant-afford' : '');
            html += `<div class="${cls}">
                <div class="tsr-shop-item-head">
                    <span class="tsr-shop-item-icon">${icon}</span>
                    <div>
                        <div class="tsr-shop-item-name">${item.name}${purchaseInfo ? `<span class="tsr-shop-limit">${purchaseInfo}</span>` : ''}</div>
                        <div class="tsr-shop-item-price">${item.cost.toLocaleString()} 秘境币</div>
                    </div>
                </div>
                <div class="tsr-shop-item-desc">${item.description}</div>
                ${extraInfo ? `<div class="tsr-shop-item-extra">${extraInfo}</div>` : ''}
                <button type="button" class="tsr-btn tsr-btn-gold tsr-shop-buy-btn" onclick="buyTsrShopItem('${key}')" ${isUnavailable || !canAfford ? 'disabled' : ''}>
                    ${isUnavailable ? '不可购买' : (!canAfford ? '秘境币不足' : '购买')}
                </button>
                ${isUnavailable ? `<div class="tsr-shop-block-reason">⚠️ ${blockReason}</div>` : ''}
            </div>`;
        });
        html += '</div></div>';
    });
    if (!html) {
        html = '<div class="tsr-empty">该分类暂无商品</div>';
    }
    container.innerHTML = html;
    updatePermanentBonusesDisplay();
}

// 显示永久加成信息
function updatePermanentBonusesDisplay() {
    const tsr = player.timeSecretRealm;
    const container = document.getElementById('tsrPermanentBonuses');
    if (!container) return;
    const sig = getTsrPermBonusSignature();
    if (_tsrUiCache.permBonus === sig) return;
    _tsrUiCache.permBonus = sig;
    
    if (!tsr.permanentBonuses) {
        container.innerHTML = '<div style="color: #888; text-align: center;">暂无永久加成</div>';
        return;
    }
    
    const hasEternalBonus = getTsrEternalAttackBonus() > 0 || getTsrEternalHealthBonus() > 0;
    const achBonus = getTsrAchievementCombatBonuses();
    const hasAchBonus = achBonus.attack > 0 || achBonus.health > 0 || achBonus.defense > 0;
    const hasMainWorldBonus = getTsrMainWorldShopBonus('attack') > 0
        || getTsrMainWorldShopBonus('health') > 0
        || getTsrMainWorldShopBonus('critDamage') > 0;
    const pb = tsr.permanentBonuses;
    const hasOtherBonus = pb.comboBonus || pb.gambleBonus || pb.floorTimeBonus || pb.runCurrencyBonus || pb.exploreTimeSave || pb.relicSlots
        || pb.clearRewardBonus || pb.spiritPact || pb.vaultBonus || pb.relicMagnet || pb.trapWard || pb.roomPreview || pb.riskContract || pb.emergencyKit
        || pb.milestoneBonus || pb.relicChoices || pb.counterReduce || pb.starterPack || pb.starterGear || pb.equipBagBonus || pb.equipSmith || pb.equipReforgeDiscount || pb.forgeBonus || pb.arenaBonus || pb.memePass
        || pb.spiritChargeAmp || pb.spiritHealAmp;
    if (!pb.baseTime && !pb.startingBuffs && !hasEternalBonus && !hasMainWorldBonus && !hasOtherBonus && !hasAchBonus) {
        container.innerHTML = '<div class="tsr-empty">暂无永久加成</div>';
        return;
    }
    
    let bonusesHTML = '<div style="color: #ffd700; font-weight: bold; margin-bottom: 10px;">永久加成效果:</div>';
    
    if (getTsrEternalAttackBonus() > 0) {
        bonusesHTML += `
            <div style="color: #ff6347; margin: 5px 0;">
                ⚔️ 永恒攻击符文: +${(getTsrEternalAttackBonus() * 100).toFixed(0)}%攻击力（永久生效，上限${TSR_ETERNAL_BONUS_MAX_PERCENT}%）
            </div>
        `;
    }
    
    if (getTsrEternalHealthBonus() > 0) {
        bonusesHTML += `
            <div style="color: #32cd32; margin: 5px 0;">
                ❤️ 永恒生命符文: +${(getTsrEternalHealthBonus() * 100).toFixed(0)}%生命值（永久生效，上限${TSR_ETERNAL_BONUS_MAX_PERCENT}%）
            </div>
        `;
    }

    if (hasAchBonus) {
        bonusesHTML += `
            <div style="color: #fbbf24; margin: 5px 0;">
                🏅 成就战力: ${formatTsrAchievementRewardText(achBonus)}（按已解锁成就汇总，上限攻/血${Math.round(TSR_ACHIEVEMENT_ATK_MAX * 100)}% · 防${Math.round(TSR_ACHIEVEMENT_DEF_MAX * 100)}%）
            </div>
        `;
    }

    if (getTsrMainWorldShopBonus('attack') > 0) {
        bonusesHTML += `<div style="color:#f97316;margin:5px 0;">🗺️⚔️ 世界地图攻击: +${(getTsrMainWorldShopBonus('attack') * 100).toFixed(0)}%（上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%）</div>`;
    }
    if (getTsrMainWorldShopBonus('health') > 0) {
        bonusesHTML += `<div style="color:#22c55e;margin:5px 0;">🗺️❤️ 世界地图生命: +${(getTsrMainWorldShopBonus('health') * 100).toFixed(0)}%（上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%）</div>`;
    }
    if (getTsrMainWorldShopBonus('critDamage') > 0) {
        bonusesHTML += `<div style="color:#e879f9;margin:5px 0;">🗺️💥 世界地图爆伤: +${(getTsrMainWorldShopBonus('critDamage') * 100).toFixed(0)}%（上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%）</div>`;
    }
    
    if (tsr.permanentBonuses.baseTime) {
        bonusesHTML += `
            <div style="color: #00bfff; margin: 5px 0;">
                ⏱️ 时间沙漏: +${tsr.permanentBonuses.baseTime}秒基础探索时间
            </div>
        `;
    }
    
    if (tsr.permanentBonuses.startingBuffs) {
        bonusesHTML += `
            <div style="color: #32cd32; margin: 5px 0;">
                ✨ 起始祝福: 每次冒险开始获得${tsr.permanentBonuses.startingBuffs}个随机增益
            </div>
        `;
    }
    if (pb.comboBonus) {
        bonusesHTML += `<div style="color:#f472b6;margin:5px 0;">📜 连击秘典: 连击收益上限+${(pb.comboBonus * 100).toFixed(0)}%</div>`;
    }
    if (pb.gambleBonus) {
        bonusesHTML += `<div style="color:#fbbf24;margin:5px 0;">🎲 赌局护符: 赌局胜率+${(pb.gambleBonus * 100).toFixed(0)}%</div>`;
    }
    if (pb.floorTimeBonus) {
        bonusesHTML += `<div style="color:#7dd3fc;margin:5px 0;">⏳ 层阶时砂: 每层额外+${pb.floorTimeBonus}秒</div>`;
    }
    if (pb.runCurrencyBonus) {
        bonusesHTML += `<div style="color:#fde68a;margin:5px 0;">🪙 招财徽章: 局内秘境币+${(pb.runCurrencyBonus * 100).toFixed(0)}%</div>`;
    }
    if (pb.exploreTimeSave) {
        bonusesHTML += `<div style="color:#a5f3fc;margin:5px 0;">💨 疾行符文: 行动耗时-${(pb.exploreTimeSave * 100).toFixed(0)}%</div>`;
    }
    if (pb.relicSlots) {
        bonusesHTML += `<div style="color:#e879f9;margin:5px 0;">🎒 遗物皮囊: 单局遗物上限${getTsrRelicMax()}个</div>`;
    }
    if (pb.clearRewardBonus) {
        bonusesHTML += `<div style="color:#fcd34d;margin:5px 0;">🎖️ 老兵勋章: 通关奖励+${(pb.clearRewardBonus * 100).toFixed(0)}%</div>`;
    }
    if (pb.spiritPact) {
        bonusesHTML += `<div style="color:#c4b5fd;margin:5px 0;">📿 英灵契约: 特殊房间率+${(pb.spiritPact * 100).toFixed(0)}%</div>`;
    }
    if (pb.vaultBonus) {
        bonusesHTML += `<div style="color:#fbbf24;margin:5px 0;">🔐 宝库秘钥: 宝库收益+${(pb.vaultBonus * 100).toFixed(0)}%</div>`;
    }
    if (pb.relicMagnet) {
        bonusesHTML += `<div style="color:#a78bfa;margin:5px 0;">🧲 遗物磁石: 精英遗物率+${(pb.relicMagnet * 100).toFixed(0)}%</div>`;
    }
    if (pb.trapWard) {
        bonusesHTML += `<div style="color:#7dd3fc;margin:5px 0;">🛡️ 避陷护符: 首场陷阱伤害减半</div>`;
    }
    if (pb.roomPreview) {
        bonusesHTML += `<div style="color:#67e8f9;margin:5px 0;">🧭 秘境罗盘: 预知本层房间类型</div>`;
    }
    if (pb.riskContract) {
        bonusesHTML += `<div style="color:#f87171;margin:5px 0;">📜 冒险契约: 奖励+20% / 生命-8%</div>`;
    }
    if (pb.emergencyKit) {
        bonusesHTML += `<div style="color:#4ade80;margin:5px 0;">🩹 应急医药包: 开局携带急救药包</div>`;
    }
    if (pb.milestoneBonus) {
        bonusesHTML += `<div style="color:#fcd34d;margin:5px 0;">🏅 里程碑护符: 每10层额外+${pb.milestoneBonus}秒</div>`;
    }
    if (pb.relicChoices) {
        bonusesHTML += `<div style="color:#fb923c;margin:5px 0;">🔥 圣火残片: 遗物祭坛4选1</div>`;
    }
    if (pb.counterReduce) {
        bonusesHTML += `<div style="color:#94a3b8;margin:5px 0;">🦺 反击护甲: 反击伤害-${(pb.counterReduce * 100).toFixed(0)}%</div>`;
    }
    if (pb.starterPack) {
        bonusesHTML += `<div style="color:#86efac;margin:5px 0;">🎒 探险补给包: 开局携带药包+时光胶囊</div>`;
    }
    if (pb.starterGear) {
        bonusesHTML += `<div style="color:#7dd3fc;margin:5px 0;">⚔️ 探险装备包: 开局随机1件普通装备</div>`;
    }
    if (pb.equipBagBonus) {
        bonusesHTML += `<div style="color:#93c5fd;margin:5px 0;">🎒 装备行囊: 局内背包+${pb.equipBagBonus * 2}格（当前${getTsrEquipBagMax()}）</div>`;
    }
    if (pb.equipSmith) {
        bonusesHTML += `<div style="color:#fbbf24;margin:5px 0;">🔨 锻炉铭刻: 强化上限${getTsrEquipEnhanceMax()}级，费用-20%</div>`;
    }
    if (pb.equipReforgeDiscount) {
        bonusesHTML += `<div style="color:#c4b5fd;margin:5px 0;">📜 洗炼秘典: 洗炼费用-${(pb.equipReforgeDiscount * 100).toFixed(0)}%</div>`;
    }
    if (pb.forgeBonus) {
        bonusesHTML += `<div style="color:#fb923c;margin:5px 0;">🔥 熔炉祝福: 熔炉收益+${(pb.forgeBonus * 100).toFixed(0)}%</div>`;
    }
    if (pb.arenaBonus) {
        bonusesHTML += `<div style="color:#f43f5e;margin:5px 0;">👑 竞技王冠: 竞技场奖励+${(pb.arenaBonus * 100).toFixed(0)}%</div>`;
    }
    if (pb.memePass) {
        bonusesHTML += `<div style="color:#f472b6;margin:5px 0;">🃏 梗王通行证: 恶趣味房间遭遇率×2</div>`;
    }
    if (pb.spiritChargeAmp) {
        bonusesHTML += `<div style="color:#a78bfa;margin:5px 0;">⚡ 灵韵增幅: 精灵充能+${(pb.spiritChargeAmp * 100).toFixed(0)}%</div>`;
    }
    if (pb.spiritHealAmp) {
        bonusesHTML += `<div style="color:#f9a8d4;margin:5px 0;">💖 灵核契约: 精灵触发回血+${(pb.spiritHealAmp * 100).toFixed(0)}%</div>`;
    }
    const sp = ensureTsrSpiritPet();
    if (sp && sp.level > 1) {
        bonusesHTML += `<div style="color:#fbcfe8;margin:5px 0;">🧚 时光精灵: ${getTsrSpiritEvolutionName(sp.evolution)} Lv${sp.level} · 亲密度${sp.bond}</div>`;
    }
    
    container.innerHTML = bonusesHTML;
}

// 购买商店物品
function buyTsrShopItem(itemKey) {
    const tsr = player.timeSecretRealm;
    const item = tsr.shopItems[itemKey];
    
    if (!item) return;

    ensureTimeSecretRealmData();
    const blockReason = getTsrShopItemBlockReason(item);
    if (blockReason) {
        logAction(blockReason, 'error');
        return;
    }
    
    if (tsr.currency >= item.cost) {
        tsr.currency = clampTsrCurrency(tsr.currency - item.cost);
        
        // 增加已购买数量
        if (item.maxPurchase) {
            item.purchased = (item.purchased || 0) + 1;
        }
        
        // 应用物品效果
        switch(item.effect) {
            case 'time':
                // 时间沙漏：永久增加基础探索时间
                if (!tsr.permanentBonuses) {
                    tsr.permanentBonuses = {};
                }
                if ((tsr.permanentBonuses.baseTime || 0) >= TSR_BASE_TIME_BONUS_MAX) {
                    logAction(`时间沙漏加成已达上限（+${TSR_BASE_TIME_BONUS_MAX}秒）`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                tsr.permanentBonuses.baseTime = Math.min(
                    TSR_BASE_TIME_BONUS_MAX,
                    (tsr.permanentBonuses.baseTime || 0) + TSR_BASE_TIME_PER_PURCHASE
                );
                logAction(`永久增加${TSR_BASE_TIME_PER_PURCHASE}秒基础探索时间！当前总加成：${tsr.permanentBonuses.baseTime}秒`, 'success');
                break;
                
            case 'startingBuff':
                // 起始祝福：每次冒险开始时获得随机增益
                if (!tsr.permanentBonuses) {
                    tsr.permanentBonuses = {};
                }
                tsr.permanentBonuses.startingBuffs = (tsr.permanentBonuses.startingBuffs || 0) + 1;
                logAction(`永久获得起始祝福！每次冒险开始时随机获得${tsr.permanentBonuses.startingBuffs}个增益效果`, 'success');
                break;
                
            case 'attack': {
                const addedAttack = addTsrEternalRuneBonus('attack');
                if (addedAttack <= 0) {
                    logAction(`永恒攻击符文加成已达上限${TSR_ETERNAL_BONUS_MAX_PERCENT}%`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                if (typeof updateTechniqueBonuses === 'function') {
                    updateTechniqueBonuses();
                } else {
                    applyTsrEternalRuneBonuses();
                }
                logAction(`攻击力提升${(addedAttack * 100).toFixed(0)}%！符文总加成：${(getTsrEternalAttackBonus() * 100).toFixed(0)}% / ${TSR_ETERNAL_BONUS_MAX_PERCENT}%`, 'success');
                break;
            }
                
            case 'health': {
                const addedHealth = addTsrEternalRuneBonus('health');
                if (addedHealth <= 0) {
                    logAction(`永恒生命符文加成已达上限${TSR_ETERNAL_BONUS_MAX_PERCENT}%`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                if (typeof updateTechniqueBonuses === 'function') {
                    updateTechniqueBonuses();
                } else {
                    applyTsrEternalRuneBonuses();
                }
                logAction(`生命值提升${(addedHealth * 100).toFixed(0)}%！符文总加成：${(getTsrEternalHealthBonus() * 100).toFixed(0)}% / ${TSR_ETERNAL_BONUS_MAX_PERCENT}%`, 'success');
                break;
            }

            case 'main_world_attack': {
                const added = addTsrMainWorldShopBonus('attack');
                if (added <= 0) {
                    logAction(`世界地图攻击加成已达上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                if (typeof updateTechniqueBonuses === 'function') updateTechniqueBonuses();
                else applyTsrMainWorldShopBonuses();
                logAction(`主世界攻击+${(added * 100).toFixed(0)}%！当前合计+${(getTsrMainWorldShopBonus('attack') * 100).toFixed(0)}% / ${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`, 'success');
                break;
            }

            case 'main_world_health': {
                const added = addTsrMainWorldShopBonus('health');
                if (added <= 0) {
                    logAction(`世界地图生命加成已达上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                if (typeof updateTechniqueBonuses === 'function') updateTechniqueBonuses();
                else applyTsrMainWorldShopBonuses();
                logAction(`主世界生命+${(added * 100).toFixed(0)}%！当前合计+${(getTsrMainWorldShopBonus('health') * 100).toFixed(0)}% / ${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`, 'success');
                break;
            }

            case 'main_world_crit': {
                const added = addTsrMainWorldShopBonus('critDamage');
                if (added <= 0) {
                    logAction(`世界地图爆伤加成已达上限${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                if (typeof updateTechniqueBonuses === 'function') updateTechniqueBonuses();
                else applyTsrMainWorldShopBonuses();
                logAction(`主世界爆伤+${(added * 100).toFixed(0)}%！当前合计+${(getTsrMainWorldShopBonus('critDamage') * 100).toFixed(0)}% / ${TSR_MAINWORLD_BONUS_MAX_PERCENT}%`, 'success');
                break;
            }
                
            case 'detection_advanced':
                tsr.traps.playerSkills.detection = 'advanced';
                logAction('侦查技能提升至高级！成功率60%', 'success');
                break;
                
            case 'detection_expert':
                tsr.traps.playerSkills.detection = 'expert';
                logAction('侦查技能提升至专家级！成功率80%', 'success');
                break;
                
            case 'disarm_advanced':
                tsr.traps.playerSkills.disarm = 'advanced';
                logAction('解除技能提升至高级！成功率70%', 'success');
                break;
                
            case 'disarm_expert':
                tsr.traps.playerSkills.disarm = 'expert';
                logAction('解除技能提升至专家级！成功率85%', 'success');
                break;

            case 'detection_master':
                tsr.traps.playerSkills.detection = 'master';
                logAction('侦查技能提升至大师级！成功率95%', 'success');
                break;

            case 'disarm_master':
                tsr.traps.playerSkills.disarm = 'master';
                logAction('解除技能提升至大师级！成功率100%', 'success');
                break;

            case 'detection_boost':
                tsr.nextRunDetectionBoost = true;
                tsr.nextRunDetectionBoostAmount = 0.3;
                logAction('获得陷阱感知药水！下次冒险侦查成功率+30%', 'success');
                break;

            case 'detection_boost_strong':
                tsr.nextRunDetectionBoost = true;
                tsr.nextRunDetectionBoostAmount = 0.5;
                logAction('获得敏锐灵药！下次冒险侦查成功率+50%', 'success');
                break;

            case 'realm_key':
                player.items.fuben2 = (player.items.fuben2 || 0) + 1;
                logAction(`获得1把秘境钥匙！当前共${player.items.fuben2}把`, 'success');
                break;

            case 'combo_bonus':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.comboBonus = (tsr.permanentBonuses.comboBonus || 0) + 0.03;
                logAction(`连击收益上限+3%！当前+${(tsr.permanentBonuses.comboBonus * 100).toFixed(0)}%`, 'success');
                break;

            case 'gamble_bonus':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.gambleBonus = (tsr.permanentBonuses.gambleBonus || 0) + 0.06;
                logAction(`赌局胜率+6%！当前+${(tsr.permanentBonuses.gambleBonus * 100).toFixed(0)}%`, 'success');
                break;

            case 'relic_slots':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                if ((tsr.permanentBonuses.relicSlots || 0) >= TSR_RELIC_SLOTS_BONUS_MAX) {
                    logAction('遗物皮囊已达上限', 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                tsr.permanentBonuses.relicSlots = Math.min(
                    TSR_RELIC_SLOTS_BONUS_MAX,
                    (tsr.permanentBonuses.relicSlots || 0) + 1
                );
                logAction(`遗物携带上限提升至${getTsrRelicMax()}个！`, 'success');
                break;

            case 'equip_bag':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.equipBagBonus = (tsr.permanentBonuses.equipBagBonus || 0) + 1;
                logAction(`装备背包上限提升至${getTsrEquipBagMax()}格！`, 'success');
                break;

            case 'starter_gear':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.starterGear = 1;
                logAction('配备探险装备包！每次冒险开局获得1件普通装备', 'success');
                break;

            case 'equip_smith':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.equipSmith = 1;
                // 不覆盖已有更高的锻星折扣
                tsr.permanentBonuses.equipEnhanceDiscount = Math.max(0.3, Number(tsr.permanentBonuses.equipEnhanceDiscount) || 0);
                tsr.permanentBonuses.equipEnhanceMax = Math.max(1, Number(tsr.permanentBonuses.equipEnhanceMax) || 0);
                logAction(`锻炉铭刻生效！强化上限${getTsrEquipEnhanceMax()}级，费用-${((tsr.permanentBonuses.equipEnhanceDiscount || 0) * 100).toFixed(0)}%`, 'success');
                break;

            case 'equip_reforge_discount':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.equipReforgeDiscount = 0.35;
                logAction('洗炼秘典生效！局内装备洗炼费用-35%', 'success');
                break;

            case 'floor_time':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                if ((tsr.permanentBonuses.floorTimeBonus || 0) >= TSR_FLOOR_TIME_BONUS_MAX) {
                    logAction(`层阶时砂已达上限（每层+${TSR_FLOOR_TIME_BONUS_MAX}秒）`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                tsr.permanentBonuses.floorTimeBonus = Math.min(
                    TSR_FLOOR_TIME_BONUS_MAX,
                    (tsr.permanentBonuses.floorTimeBonus || 0) + TSR_FLOOR_TIME_PER_PURCHASE
                );
                logAction(`每层额外+${TSR_FLOOR_TIME_PER_PURCHASE}秒！当前共+${tsr.permanentBonuses.floorTimeBonus}秒`, 'success');
                break;

            case 'run_currency':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.runCurrencyBonus = (tsr.permanentBonuses.runCurrencyBonus || 0) + 0.06;
                logAction(`局内秘境币收益+6%！当前+${(tsr.permanentBonuses.runCurrencyBonus * 100).toFixed(0)}%`, 'success');
                break;

            case 'explore_time_save':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                if ((tsr.permanentBonuses.exploreTimeSave || 0) >= TSR_EXPLORE_TIME_SAVE_MAX) {
                    logAction(`疾行符文已达上限（-${Math.round(TSR_EXPLORE_TIME_SAVE_MAX * 100)}%）`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                tsr.permanentBonuses.exploreTimeSave = Math.min(
                    TSR_EXPLORE_TIME_SAVE_MAX,
                    (tsr.permanentBonuses.exploreTimeSave || 0) + 0.04
                );
                logAction(`探索行动耗时-4%！当前-${(tsr.permanentBonuses.exploreTimeSave * 100).toFixed(0)}%`, 'success');
                break;

            case 'trap_ward':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.trapWard = 1;
                logAction('获得避陷护符！每场冒险首次陷阱伤害减半', 'success');
                break;

            case 'room_preview':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.roomPreview = 1;
                logAction('获得秘境罗盘！进入每层可预知房间类型', 'success');
                break;

            case 'clear_reward':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                if ((tsr.permanentBonuses.clearRewardBonus || 0) >= TSR_CLEAR_REWARD_BONUS_MAX) {
                    logAction(`通关奖励已达上限（+${Math.round(TSR_CLEAR_REWARD_BONUS_MAX * 100)}%）`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                tsr.permanentBonuses.clearRewardBonus = Math.min(
                    TSR_CLEAR_REWARD_BONUS_MAX,
                    (tsr.permanentBonuses.clearRewardBonus || 0) + 0.08
                );
                logAction(`通关奖励+8%！当前+${(tsr.permanentBonuses.clearRewardBonus * 100).toFixed(0)}%`, 'success');
                break;

            case 'spirit_pact':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.spiritPact = (tsr.permanentBonuses.spiritPact || 0) + 0.015;
                logAction(`特殊房间遭遇率提升！当前+${(tsr.permanentBonuses.spiritPact * 100).toFixed(1)}%`, 'success');
                break;

            case 'emergency_kit':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.emergencyKit = 1;
                logAction('配备应急医药包！每次冒险开局携带急救药包', 'success');
                break;

            case 'vault_bonus':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.vaultBonus = (tsr.permanentBonuses.vaultBonus || 0) + 0.3;
                logAction(`宝库收益+30%！当前+${(tsr.permanentBonuses.vaultBonus * 100).toFixed(0)}%`, 'success');
                break;

            case 'risk_contract':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.riskContract = 1;
                logAction('签订冒险契约！奖励+20%，生命上限-8%', 'success');
                break;

            case 'relic_magnet':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.relicMagnet = (tsr.permanentBonuses.relicMagnet || 0) + 0.12;
                logAction(`精英遗物率+12%！当前+${(tsr.permanentBonuses.relicMagnet * 100).toFixed(0)}%`, 'success');
                break;

            case 'time_loan':
                tsr.nextRunTimeLoan = true;
                logAction('获得时光借贷券！下次冒险+90秒但首层战斗更难', 'success');
                break;
                
            case 'material':
                player.items.yuzhou4 = (player.items.yuzhou4 || 0) + 200;
                logAction('获得200个神器碎片', 'success');
                break;

            case 'milestone_bonus':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.milestoneBonus = (tsr.permanentBonuses.milestoneBonus || 0) + 8;
                logAction(`里程碑加时+8秒！当前共+${tsr.permanentBonuses.milestoneBonus}秒`, 'success');
                break;

            case 'relic_choices':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.relicChoices = 1;
                logAction('圣火残片生效！遗物祭坛将变为4选1', 'success');
                break;

            case 'counter_reduce':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                if ((tsr.permanentBonuses.counterReduce || 0) >= TSR_COUNTER_REDUCE_MAX) {
                    logAction(`反击护甲已达上限（-${Math.round(TSR_COUNTER_REDUCE_MAX * 100)}%）`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                tsr.permanentBonuses.counterReduce = Math.min(
                    TSR_COUNTER_REDUCE_MAX,
                    (tsr.permanentBonuses.counterReduce || 0) + 0.04
                );
                logAction(`反击伤害-4%！当前共-${(tsr.permanentBonuses.counterReduce * 100).toFixed(0)}%`, 'success');
                break;

            case 'starter_pack':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.starterPack = 1;
                logAction('探险补给包已配备！每次冒险开局携带急救药包+时光胶囊', 'success');
                break;

            case 'double_key':
                player.items.fuben2 = (player.items.fuben2 || 0) + 2;
                logAction(`获得2把秘境钥匙！当前共${player.items.fuben2}把`, 'success');
                break;

            case 'reincarnation_dust':
                player.reincarnationCoin = (player.reincarnationCoin || 0) + 1000000000;
                logAction('获得10亿转生币', 'success');
                break;

            case 'forge_bonus':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.forgeBonus = 0.4;
                logAction('熔炉祝福生效！时光熔炉收益+40%', 'success');
                break;

            case 'arena_bonus':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.arenaBonus = 0.35;
                logAction('竞技王冠生效！时光竞技场奖励+35%', 'success');
                break;

            case 'guaranteed_disarm':
                tsr.nextRunGuaranteedDisarm = true;
                logAction('获得万能解除卷！下次冒险首次解除陷阱必定成功', 'success');
                break;

            case 'meme_pass':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.memePass = 1;
                logAction('梗王通行证生效！答辩/甲方/砍一刀等房间出现更频繁', 'success');
                break;

            case 'spirit_exp_80':
                addTsrSpiritExp(80);
                logAction('精灵吸收了灵乳，经验+80', 'success');
                break;

            case 'spirit_exp_300':
                addTsrSpiritExp(300);
                logAction('精灵吸收了星辉结晶，经验+300', 'success');
                break;

            case 'spirit_bond_15':
                addTsrSpiritBond(15);
                logAction(`羁绊之羽生效！亲密度+15（当前${ensureTsrSpiritPet().bond}）`, 'success');
                break;

            case 'spirit_evolve':
                evolveTsrSpirit();
                break;

            case 'spirit_charge_amp':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                tsr.permanentBonuses.spiritChargeAmp = Math.min(0.5, (tsr.permanentBonuses.spiritChargeAmp || 0) + 0.1);
                logAction(`灵韵增幅器生效！充能效率+10%（累计+${(tsr.permanentBonuses.spiritChargeAmp * 100).toFixed(0)}%）`, 'success');
                break;

            case 'spirit_heal_amp':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                if ((tsr.permanentBonuses.spiritHealAmp || 0) >= TSR_SPIRIT_HEAL_AMP_MAX) {
                    logAction(`灵核契约已达上限（+${Math.round(TSR_SPIRIT_HEAL_AMP_MAX * 100)}%）`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                tsr.permanentBonuses.spiritHealAmp = Math.min(
                    TSR_SPIRIT_HEAL_AMP_MAX,
                    (tsr.permanentBonuses.spiritHealAmp || 0) + 0.08
                );
                logAction(`灵核契约生效！触发回血+8%（累计+${(tsr.permanentBonuses.spiritHealAmp * 100).toFixed(0)}%）`, 'success');
                break;

            case 'spirit_skill_point_2': {
                const sp = ensureTsrSpiritPet();
                sp.skillPoints = (sp.skillPoints || 0) + 2;
                logAction('天赋灵珠生效！获得2灵脉技能点', 'success');
                invalidateTsrUiCache('spirit');
                break;
            }

            case 'spirit_bond_25':
                addTsrSpiritBond(25);
                logAction(`羁绊灵露生效！亲密度+25（当前${ensureTsrSpiritPet().bond}）`, 'success');
                break;

            case 'spirit_skill_reset': {
                const spReset = ensureTsrSpiritPet();
                spReset.skills = [];
                spReset.skillResets = (spReset.skillResets || 0) + 1;
                logAction('灵脉洗髓卷生效！全部技能已重置，技能点已返还', 'success');
                invalidateTsrUiCache('spirit');
                updateTsrSpiritDisplay();
                break;
            }

            case 'spirit_trial_token':
                tsr.nextRunSpiritTrial = true;
                logAction('试炼邀请函已生效！下次冒险将遭遇精灵试炼厅', 'success');
                break;

            case 'star_spirit_strike':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                if ((tsr.permanentBonuses.starSpiritStrike || 0) >= TSR_STAR_SPIRIT_STRIKE_MAX) {
                    logAction(`星灵王冠已达上限（+${Math.round(TSR_STAR_SPIRIT_STRIKE_MAX * 100)}%）`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                tsr.permanentBonuses.starSpiritStrike = Math.min(
                    TSR_STAR_SPIRIT_STRIKE_MAX,
                    (tsr.permanentBonuses.starSpiritStrike || 0) + 0.1
                );
                logAction(`星灵王冠生效！灵击+10%（累计+${(tsr.permanentBonuses.starSpiritStrike * 100).toFixed(0)}%）`, 'success');
                break;

            case 'star_domain_sigil':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                if ((tsr.permanentBonuses.starDomainSigil || 0) >= TSR_STAR_DOMAIN_SIGIL_MAX) {
                    logAction(`星域符印已达上限（+${Math.round(TSR_STAR_DOMAIN_SIGIL_MAX * 100)}%）`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                tsr.permanentBonuses.starDomainSigil = Math.min(
                    TSR_STAR_DOMAIN_SIGIL_MAX,
                    (tsr.permanentBonuses.starDomainSigil || 0) + 0.03
                );
                logAction(`星域符印生效！特殊房+3%（累计+${(tsr.permanentBonuses.starDomainSigil * 100).toFixed(0)}%）`, 'success');
                break;

            case 'star_ascend_token':
                tsr.nextRunStarSpiritRoom = true;
                logAction('星域引路符已生效！下次冒险将遭遇飞升台或终焉星域', 'success');
                break;

            case 'star_origin_elixir': {
                const spEl = ensureTsrSpiritPet();
                addTsrSpiritExp(500);
                addTsrSpiritBond(20);
                logAction(`本源灵浆生效！经验+500，亲密度+20（当前${spEl.bond}）`, 'success');
                invalidateTsrUiCache('spirit');
                updateTsrSpiritDisplay();
                break;
            }

            case 'throne_blessing':
                tsr.nextRunThroneBlessing = true;
                logAction('王座祝福卷已生效！下次冒险将优先遭遇星灵王座', 'success');
                break;

            case 'tyrant_court_token':
                tsr.nextRunTyrantCourt = true;
                logAction('审判引路符已生效！下次冒险将优先遭遇天穹审判庭', 'success');
                break;

            case 'affix_hunter_net':
                tsr.nextRunAffixHunter = true;
                logAction('词条猎网已生效！下次冒险怪物词条率大幅提升', 'success');
                break;

            case 'affix_tome':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                if ((tsr.permanentBonuses.affixTome || 0) >= TSR_AFFIX_TOME_MAX) {
                    logAction(`词条通晓书已达上限（+${Math.round(TSR_AFFIX_TOME_MAX * 100)}%）`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                tsr.permanentBonuses.affixTome = Math.min(
                    TSR_AFFIX_TOME_MAX,
                    (tsr.permanentBonuses.affixTome || 0) + 0.05
                );
                logAction(`词条通晓书生效！词条赏金+5%（累计+${(tsr.permanentBonuses.affixTome * 100).toFixed(0)}%）`, 'success');
                break;

            case 'affix_swap_supply':
                if (!tsr.nextRunConsumables) tsr.nextRunConsumables = [];
                tsr.nextRunConsumables.push('affixSwap');
                logAction('词条置换符将在下次冒险开始时加入背包', 'success');
                break;

            case 'synergy_token_supply':
                if (!tsr.nextRunConsumables) tsr.nextRunConsumables = [];
                tsr.nextRunConsumables.push('synergyToken');
                logAction('羁绊信物将在下次冒险开始时加入背包', 'success');
                break;

            case 'champion_medal_supply':
                if (!tsr.nextRunConsumables) tsr.nextRunConsumables = [];
                tsr.nextRunConsumables.push('championMedal');
                logAction('冠军奖章将在下次冒险开始时加入背包', 'success');
                break;

            case 'fortune_token_supply':
                if (!tsr.nextRunConsumables) tsr.nextRunConsumables = [];
                tsr.nextRunConsumables.push('fortuneToken');
                logAction('星运符将在下次冒险开始时加入背包', 'success');
                break;

            case 'chrono_capsule_supply':
                if (!tsr.nextRunConsumables) tsr.nextRunConsumables = [];
                tsr.nextRunConsumables.push('chronoCapsule');
                logAction('时序胶囊将在下次冒险开始时加入背包', 'success');
                break;

            case 'library_scroll_supply':
                if (!tsr.nextRunConsumables) tsr.nextRunConsumables = [];
                tsr.nextRunConsumables.push('libraryScroll');
                logAction('秘闻卷轴将在下次冒险开始时加入背包', 'success');
                break;

            case 'wish_coin_supply':
                if (!tsr.nextRunConsumables) tsr.nextRunConsumables = [];
                tsr.nextRunConsumables.push('wishCoin');
                logAction('星愿硬币将在下次冒险开始时加入背包', 'success');
                break;

            case 'archon_fragment':
                if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
                if ((tsr.permanentBonuses.archonFragment || 0) >= TSR_ARCHON_FRAGMENT_MAX) {
                    logAction(`主宰残片已达上限（+${Math.round(TSR_ARCHON_FRAGMENT_MAX * 100)}%）`, 'error');
                    tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                    if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 1) - 1);
                    return;
                }
                tsr.permanentBonuses.archonFragment = Math.min(
                    TSR_ARCHON_FRAGMENT_MAX,
                    (tsr.permanentBonuses.archonFragment || 0) + 0.05
                );
                logAction(`主宰残片生效！灵击+5%，特殊房+2%（累计+${(tsr.permanentBonuses.archonFragment * 100).toFixed(0)}%）`, 'success');
                break;

            default:
                if (typeof applyTsrContentShopEffect === 'function' && applyTsrContentShopEffect(itemKey, item, tsr)) break;
                tsr.currency = clampTsrCurrency(tsr.currency + item.cost);
                if (item.maxPurchase) item.purchased = Math.max(0, (item.purchased || 0) - 1);
                logAction(`商店物品「${item.name}」效果未接线，已退还秘境币`, 'error');
                return;
        }
        
        logAction(`购买了${item.name}，消耗${item.cost}秘境币`, 'success');
        invalidateTsrUiCache(['shop', 'permBonus', 'skill', 'spirit']);
        updateTsrShop();
        updateTsrSpiritDisplay();
        updateTimeSecretRealmUI({ skipEnsure: true });
        updateSkillsDisplay();
        saveGame();
    } else {
        logAction(`秘境币不足！需要${item.cost}秘境币，只有${tsr.currency}秘境币`, 'error');
    }
}

// ===== 命运卡牌 & 虚空共鸣 & 新特殊房间 =====

function rollTsrFateCards() {
    const tsr = player.timeSecretRealm;
    const keys = Object.keys(TSR_FATE_CARDS);
    const shuffled = keys.sort(() => Math.random() - 0.5);
    tsr.fateCardOptions = shuffled.slice(0, 3);
    if (!tsr.selectedFateCard || !tsr.fateCardOptions.includes(tsr.selectedFateCard)) {
        tsr.selectedFateCard = null;
    }
}

function selectTsrFateCard(cardId) {
    const tsr = player.timeSecretRealm;
    if (!tsr.fateCardOptions?.includes(cardId)) return;
    tsr.selectedFateCard = cardId;
    updateTsrFateCardUI();
    const card = TSR_FATE_CARDS[cardId];
    if (card) logAction(`已选择命运卡牌：${card.icon} ${card.name}`, 'success');
}

function updateTsrFateCardUI() {
    const container = document.getElementById('tsrFateCardCards');
    if (!container) return;
    const tsr = player.timeSecretRealm;
    if (!tsr.fateCardOptions?.length) rollTsrFateCards();
    container.innerHTML = tsr.fateCardOptions.map(id => {
        const card = TSR_FATE_CARDS[id];
        if (!card) return '';
        const selected = tsr.selectedFateCard === id;
        return `<button type="button" class="tsr-fate-card tsr-fate-${card.theme || 'gold'} ${selected ? 'selected' : ''}" onclick="selectTsrFateCard('${id}')">
            <span class="tsr-fate-icon">${card.icon}</span>
            <strong class="tsr-fate-name">${card.name}</strong>
            <small class="tsr-fate-desc">${card.desc}</small>
        </button>`;
    }).join('');
}

function applyTsrFateCard() {
    const tsr = player.timeSecretRealm;
    const cardId = tsr.selectedFateCard;
    if (!cardId || !TSR_FATE_CARDS[cardId]) return;
    const card = TSR_FATE_CARDS[cardId];
    tsr.currentRun.fateCard = cardId;
    tsr.currentRun.fateMods = { ...card };
    if (card.timeMod) {
        tsr.currentRun.timeLeft += card.timeMod;
        tsr.currentRun.initialTime += card.timeMod;
    }
    if (card.health) addTempBuff({ name: card.name, effect: 'health', value: card.health, duration: 0, isDebuff: card.health < 0 });
    if (card.attack) addTempBuff({ name: card.name, effect: 'attack', value: card.attack, duration: 0, isDebuff: false });
    if (card.currencyPenalty) tsr.currentRun.currencyPenalty = (tsr.currentRun.currencyPenalty || 0) + card.currencyPenalty;
    if (card.currencyMod) tsr.currentRun.fateCurrencyMod = (tsr.currentRun.fateCurrencyMod || 0) + card.currencyMod;
    if (card.resonanceGain) tsr.currentRun.resonanceGainMult = (tsr.currentRun.resonanceGainMult || 1) + card.resonanceGain;
    if (card.affixRollBoost) tsr.currentRun.affixRollBoost = (tsr.currentRun.affixRollBoost || 0) + card.affixRollBoost;
    if (card.roomPreview) tsr.currentRun.roomPreviewBonus = (tsr.currentRun.roomPreviewBonus || 0) + card.roomPreview;
    addTsrLog(`命运卡牌【${card.name}】生效：${card.desc}`, 'success', card.theme || 'fortune');
}

function addTsrVoidResonance(amount) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive || !amount) return;
    const mult = (tsr.currentRun.resonanceGainMult || 1) + getTsrRelicBonus('resonanceGain') + (getTsrSpiritSkillBonuses().resonanceGain || 0);
    const gain = Math.floor(amount * mult);
    tsr.currentRun.voidResonance = Math.min(TSR_VOID_RESONANCE_MAX, (tsr.currentRun.voidResonance || 0) + gain);
    if (tsr.currentRun.voidResonance >= TSR_VOID_RESONANCE_MAX) {
        triggerTsrVoidResonanceBurst();
    }
    const resonanceEl = document.getElementById('tsrVoidResonance');
    if (resonanceEl) resonanceEl.textContent = `${Math.floor(tsr.currentRun.voidResonance)}%`;
}

function triggerTsrVoidResonanceBurst() {
    const tsr = player.timeSecretRealm;
    if (!tsr?.currentRun?.isActive) return;
    const burst = TSR_VOID_RESONANCE_BURST;
    tsr.currentRun.voidResonance = 0;
    tsr.currentRun.resonanceBursts = (tsr.currentRun.resonanceBursts || 0) + 1;
    tsrHealPlayer(burst.heal);
    tsr.currentRun.timeLeft += burst.time;
    chargeTsrSpirit(burst.spiritCharge);
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    addTsrRunCurrency(Math.floor(burst.currency * dm));
    addTsrLog('💠 虚空共鸣爆发！回血、加时、秘境币、精灵充能全面提升', 'success', 'void');
    checkTsrAchievements();
    updateTimeSecretRealmUI({ runOnly: true, skipEnsure: true, light: true });
}

function handleDoomclockRoom() {
    showTsrMemePanel('⏰ 末日倒计时', '巨大的时钟在头顶滴答作响，每一秒都在燃烧……',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseDoomclock('rush')">极限冲刺 · 战斗+高赏金</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseDoomclock('freeze')">冻结时钟 · +25秒</button>
         <button type="button" class="tsr-btn tsr-btn-risk" onclick="tsrChooseDoomclock('gamble')">末日赌局 · 50%双倍或-20秒</button>`);
    if (!player.timeSecretRealm.lifetimeStats) player.timeSecretRealm.lifetimeStats = {};
    player.timeSecretRealm.lifetimeStats.doomClockRooms = (player.timeSecretRealm.lifetimeStats.doomClockRooms || 0) + 1;
    addTsrLog('末日倒计时房：时钟开始倒数', 'warning', 'boss');
    checkTsrAchievements();
}

function tsrChooseDoomclock(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'doomclock' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'rush') {
        room.isElite = true;
        room.monster = pickTsrMonsterFromPool(TSR_MONSTER_POOL.elite, tsr.currentRun.currentFloor, dm);
        room.rewards = { currency: Math.floor(160 * dm), buffChance: 0.5 };
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        addTsrVoidResonance(12);
    } else if (path === 'freeze') {
        tsr.currentRun.timeLeft += 25;
        addTsrRunCurrency(Math.floor(80 * dm));
        addTsrLog('时钟冻结！+25秒，获得秘境币', 'success');
    } else if (path === 'gamble') {
        if (Math.random() < 0.5) {
            tsr.currentRun.timeLeft += 40;
            addTsrRunCurrency(Math.floor(150 * dm));
            addTsrLog('末日赌局胜利！双倍奖励', 'success', 'fortune');
        } else {
            tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - 20);
            addTsrLog('末日赌局失败！-20秒', 'error');
        }
    }
    finishTsrMemeRoom();
}

function handleElementaltrialRoom() {
    showTsrMemePanel('🔥 元素试炼', '四元素柱环绕，你必须选择一种元素接受试炼。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseElementaltrial('fire')">烈焰 · 攻击+20%×3层</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseElementaltrial('water')">流水 · 回血+30秒</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseElementaltrial('wind')">疾风 · 行动耗时-12%×4层</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="finishTsrMemeRoom()">离开</button>`);
    addTsrLog('元素试炼：四元素柱亮起', 'info');
}

function tsrChooseElementaltrial(element) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'elementaltrial' || !room.explored) return;
    if (tsr.currentRun.timeLeft <= 20) { finishTsrMemeRoom(); return; }
    tsr.currentRun.timeLeft -= 18;
    if (element === 'fire') {
        addTempBuff({ name: '烈焰试炼', effect: 'attack', value: 0.2, duration: 3, isDebuff: false });
        addTsrLog('烈焰试炼！攻击+20%×3层', 'success');
    } else if (element === 'water') {
        tsrHealPlayer(0.3);
        tsr.currentRun.timeLeft += 30;
        addTsrLog('流水试炼！回血+30秒', 'success');
    } else if (element === 'wind') {
        tsr.currentRun.chronoCapsuleFloors = (tsr.currentRun.chronoCapsuleFloors || 0) + 4;
        addTsrLog('疾风试炼！行动耗时-12%×4层', 'success');
    }
    addTsrVoidResonance(8);
    finishTsrMemeRoom();
}

function handleNecronomiconRoom() {
    showTsrMemePanel('📕 禁忌图录', '古老图录翻动着，每一页都是未记录的词条……',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseNecronomicon('read')">研读一页 · 词条赏金+20%×本局</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseNecronomicon('hunt')">词条狩猎 · 下一场必带双词条</button>
         <button type="button" class="tsr-btn tsr-btn-risk" onclick="tsrChooseNecronomicon('curse')">禁忌诅咒 · 币+35%，生命-15%</button>`);
    addTsrLog('禁忌图录：书页自动翻至空白处', 'info', 'affix');
}

function tsrChooseNecronomicon(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'necronomicon' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'read') {
        tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + 0.2;
        addTsrLog('研读禁忌图录！词条赏金+20%（本局）', 'success', 'affix');
    } else if (path === 'hunt') {
        tsr.currentRun.affixRollBoost = (tsr.currentRun.affixRollBoost || 0) + 0.5;
        tsr.currentRun.forceDualAffix = true;
        addTsrLog('词条狩猎启动！下一场战斗必带双词条', 'success', 'affix');
    } else if (path === 'curse') {
        addTempBuff({ name: '禁忌诅咒', effect: 'health', value: -0.15, duration: 0, isDebuff: true });
        addTsrRunCurrency(Math.floor(120 * dm));
        addTsrLog('禁忌诅咒！秘境币+35%，生命-15%', 'warning');
    }
    finishTsrMemeRoom();
}

function handleStormnexusRoom() {
    showTsrMemePanel('🌪️ 乱流枢纽', '时空乱流在此交汇，你可以选择吸收或对抗。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseStormnexus('absorb')">吸收乱流 · 攻击+15%×4，反击+8%</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseStormnexus('shield')">乱流护盾 · 反击-15%×5层</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseStormnexus('coin')">乱流淘金 · 秘境币</button>`);
    addTsrLog('乱流枢纽：四向乱流汇聚', 'info');
}

function tsrChooseStormnexus(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'stormnexus' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'absorb') {
        addTempBuff({ name: '乱流之力', effect: 'attack', value: 0.15, duration: 4, isDebuff: false });
        tsr.currentRun.counterPenalty = (tsr.currentRun.counterPenalty || 0) + 0.08;
        addTsrLog('吸收乱流！攻击提升，但反击伤害增加', 'warning');
    } else if (path === 'shield') {
        tsr.currentRun.ironShieldCharges = (tsr.currentRun.ironShieldCharges || 0) + 5;
        addTsrLog('乱流护盾！下5次反击减半', 'success');
    } else if (path === 'coin') {
        addTsrRunCurrency(Math.floor(140 * dm));
        addTsrVoidResonance(10);
        addTsrLog('乱流淘金！获得大量秘境币', 'success', 'gold');
    }
    finishTsrMemeRoom();
}

function handleParadoxgateRoom() {
    showTsrMemePanel('♾️ 悖论之门', '门内门外同时存在，选择将改变因果。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseParadoxgate('forward')">踏入未来 · 预览3层+跳1层</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseParadoxgate('past')">回溯过去 · +40秒</button>
         <button type="button" class="tsr-btn tsr-btn-risk" onclick="tsrChooseParadoxgate('loop')">因果闭环 · 精英战+遗物率+30%</button>`);
    addTsrLog('悖论之门：两扇相反的门同时打开', 'info', 'epic');
}

function tsrChooseParadoxgate(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'paradoxgate' || !room.explored) return;
    if (path === 'forward') {
        tsr.currentRun.roomPreviewBonus = (tsr.currentRun.roomPreviewBonus || 0) + 3;
        tsr.currentRun.currentFloor = Math.min(tsr.currentRun.clearFloor, tsr.currentRun.currentFloor + 1);
        addTsrLog('踏入未来！预览+3层，跃至下一层', 'success', 'epic');
        if (tryTsrAutoClearOnReachFloor()) return;
    } else if (path === 'past') {
        tsr.currentRun.timeLeft += 40;
        addTsrLog('回溯过去！+40秒', 'success');
    } else if (path === 'loop') {
        tsr.currentRun.nextEliteRelicBoost = 0.3;
        room.isElite = true;
        room.monster = pickTsrMonsterFromPool(TSR_MONSTER_POOL.elite, tsr.currentRun.currentFloor, tsr.currentRun.difficultyMultiplier);
        room.rewards = { currency: Math.floor(130 * tsr.currentRun.difficultyMultiplier), buffChance: 0.55 };
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
    }
    finishTsrMemeRoom();
}

function handleChromaticshrineRoom() {
    if (!player.timeSecretRealm.lifetimeStats) player.timeSecretRealm.lifetimeStats = {};
    player.timeSecretRealm.lifetimeStats.chromaticShrineRooms = (player.timeSecretRealm.lifetimeStats.chromaticShrineRooms || 0) + 1;
    checkTsrAchievements();
    showTsrMemePanel('🌈 彩光神龛', '七色光芒交织，神龛低语：「选一种颜色，接受祝福。」',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseChromaticshrine('gold')">金色 · 秘境币+25%</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseChromaticshrine('spirit')">紫色 · 精灵充能+50</button>
         <button type="button" class="tsr-btn tsr-btn-safe" onclick="tsrChooseChromaticshrine('green')">绿色 · 回血+20秒</button>
         <button type="button" class="tsr-btn tsr-btn-gamble" onclick="tsrChooseChromaticshrine('rainbow')">虹彩全开 · 随机三重祝福</button>`);
    addTsrLog('彩光神龛：七色光柱升起', 'success', 'rainbow');
}

function tsrChooseChromaticshrine(color) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'chromaticshrine' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (color === 'gold') {
        tsr.currentRun.fateCurrencyMod = (tsr.currentRun.fateCurrencyMod || 0) + 0.25;
        addTsrLog('金色祝福！秘境币+25%（本局）', 'success', 'gold');
    } else if (color === 'spirit') {
        chargeTsrSpirit(50);
        addTsrSpiritBond(5);
        addTsrLog('紫色祝福！精灵充能+50，亲密度+5', 'success', 'spirit');
    } else if (color === 'green') {
        tsrHealPlayer(0.2);
        tsr.currentRun.timeLeft += 20;
        addTsrLog('绿色祝福！回血+20秒', 'success', 'heal');
    } else if (color === 'rainbow') {
        tsrHealPlayer(0.15);
        tsr.currentRun.timeLeft += 15;
        chargeTsrSpirit(30);
        addTsrRunCurrency(Math.floor(90 * dm));
        addTsrVoidResonance(15);
        addTsrLog('虹彩全开！三重祝福同时降临', 'success', 'rainbow');
    }
    finishTsrMemeRoom();
}

function handleVoidechoRoom() {
    showTsrMemePanel('🕳️ 虚空回响', '裂隙中传来自己的回声——那是另一个时间线的你。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseVoidecho('resonate')">共鸣回声 · 虚空共鸣+25</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseVoidecho('duel')">镜像决斗 · 精英战</button>
         <button type="button" class="tsr-btn tsr-btn-ghost" onclick="tsrChooseVoidecho('flee')">逃离裂隙 · +12秒</button>`);
    addTsrLog('虚空回响：听见另一个自己的呼吸', 'info', 'void');
}

function tsrChooseVoidecho(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'voidecho' || !room.explored) return;
    if (path === 'resonate') {
        addTsrVoidResonance(25);
        addTsrSpiritBond(6);
        addTsrLog('与虚空回声共鸣！虚空共鸣大幅提升', 'success', 'void');
    } else if (path === 'duel') {
        room.isElite = true;
        room.monster = { id: 'voidecho', name: '虚空镜像', icon: '🪞', tier: 'epic', intro: '「我是你未走的那条路。」', win: '镜像消散于裂隙。', skill: 'reflect', skillChance: 0.3 };
        room.rewards = { currency: Math.floor(150 * tsr.currentRun.difficultyMultiplier), buffChance: 0.5 };
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
    } else if (path === 'flee') {
        tsr.currentRun.timeLeft += 12;
        addTsrLog('逃离裂隙，保留12秒', 'info');
    }
    finishTsrMemeRoom();
}

function handleCataclysmgateRoom() {
    const diffTier = getTsrDifficultyTier();
    if (diffTier < 8) {
        addTsrLog('灾变之门尚未开启（需终焉及以上难度）', 'warning');
        finishTsrMemeRoom();
        return;
    }
    showTsrMemePanel('💀 灾变之门', '门后是浓缩的终焉——三选一，没有退路。',
        `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrChooseCataclysmgate('boss')">灾变首领 · 神话战</button>
         <button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrChooseCataclysmgate('relic')">灾变遗宝 · 随机遗物</button>
         <button type="button" class="tsr-btn tsr-btn-risk" onclick="tsrChooseCataclysmgate('time')">时序献祭 · -30秒换+50%币</button>`);
    addTsrLog('灾变之门：终焉气息扑面而来', 'warning', 'boss');
}

function tsrChooseCataclysmgate(path) {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    if (!room || room.type !== 'cataclysmgate' || !room.explored) return;
    const dm = tsr.currentRun.difficultyMultiplier || 1;
    if (path === 'boss') {
        room.isBoss = true;
        room.monster = pickTsrMonsterFromPool(TSR_MONSTER_POOL.boss, tsr.currentRun.currentFloor, dm);
        room.rewards = { currency: Math.floor(200 * dm), buffChance: 0.65 };
        handleBattleRoom({ forceBoss: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
        addTsrVoidResonance(20);
    } else if (path === 'relic') {
        const choices = rollTsrRelicChoices(3);
        if (choices.length && (tsr.currentRun.relics || []).length < getTsrRelicMax()) {
            addTsrRelic(choices[0]);
            const r = TSR_RELIC_POOL[choices[0]];
            addTsrLog(`灾变遗宝！获得【${r?.name || choices[0]}】`, 'success', 'relic');
        } else {
            addTsrRunCurrency(Math.floor(200 * dm));
            addTsrLog('灾变遗宝化为大量秘境币', 'success', 'gold');
        }
    } else if (path === 'time') {
        if (tsr.currentRun.timeLeft <= 35) { finishTsrMemeRoom(); return; }
        tsr.currentRun.timeLeft -= 30;
        tsr.currentRun.fateCurrencyMod = (tsr.currentRun.fateCurrencyMod || 0) + 0.5;
        addTsrLog('时序献祭！-30秒，本局秘境币+50%', 'warning', 'gold');
    }
    finishTsrMemeRoom();
}


// 深渊战斗配置
var ABYSS_NORMAL_MONSTER_NAMES = [
    '深渊守卫', '暗影猎手', '腐化战士', '虚空行者', '噬魂兽', '裂魂者', '幽影刺客', '堕落骑士', '诅咒法师',
    '血爪', '骨魔', '影魔', '怨灵', '深渊蛛魔', '暗裔剑士', '邪眼', '腐尸', '幽魂', '魔化兽', '裂渊兽',
    '虚空猎犬', '暗影仆从', '堕落祭司', '诅咒傀儡', '噬骨者', '幽暗守卫', '深渊蠕虫', '影刃', '魔焰兽',
    '亡魂', '暗蚀兽', '裂心魔', '虚空潜行者', '腐化法师', '血渊兽', '幽影狼', '诅咒剑士', '深渊甲虫', '噬血者',
    '骨灵', '影杀者', '怨念体', '堕落战士', '魔瞳', '虚空幽魂', '腐尸犬', '暗裔法师', '裂魂蛛', '深渊猎手',
    '血魔', '幽暗刺客', '诅咒之爪', '噬魂蛛', '骨战士', '影缚者', '怨毒兽', '堕落猎犬', '魔化剑士', '虚空兽',
    '腐化甲虫', '血渊守卫', '幽影蛇', '诅咒兽', '深渊毒蛛', '噬骨蛛', '骨龙仆从', '影魔仆从', '怨灵法师', '暗裔兽',
    '裂渊蛛', '虚空魔虫', '腐尸战士', '血爪兽', '幽魂法师', '魔焰蛛', '深渊毒兽', '噬魂狼', '骨魔战士', '影刃兽',
    '怨念蛛', '堕落毒蛛', '魔化蛛', '虚空毒虫', '腐化毒兽', '血渊蛛', '幽暗毒兽', '诅咒毒蛛', '深渊魔蛛', '噬骨毒兽',
    '亡魂战士', '暗蚀蛛', '裂心毒兽', '虚空毒蛛', '腐化狼', '血渊狼', '幽影毒兽', '诅咒狼', '深渊狼', '噬血狼',
    '骨灵兽', '影杀蛛', '怨念狼', '堕落狼', '魔瞳兽', '虚空狼', '腐尸蛛', '暗裔狼', '裂魂狼', '深渊毒狼',
    '血魔蛛', '幽暗狼', '诅咒之蛛', '噬魂毒蛛', '骨战士蛛', '影缚蛛', '怨毒蛛', '堕落毒兽', '魔化狼', '虚空毒狼',
    '腐化狼兽', '血渊毒兽', '幽影狼兽', '诅咒毒兽', '深渊狼兽', '噬骨狼', '骨龙兽', '影魔兽', '怨灵兽', '暗裔毒兽',
    '裂渊狼', '虚空魔狼', '腐尸毒兽', '血爪蛛', '幽魂狼', '魔焰狼', '深渊魔狼', '噬魂毒兽', '骨魔蛛', '影刃蛛',
    '怨念毒兽', '堕落魔狼', '魔化毒兽', '虚空怨灵', '腐化怨灵', '血渊怨灵', '幽暗怨灵', '诅咒怨灵', '深渊怨灵', '噬骨怨灵'
];

// 普通怪物前缀词条（共150个）：影响名称与属性
var ABYSS_MONSTER_PREFIXES = [
    { name: '强壮的', hpMult: 1.12, atkMult: 1.18, defMult: 1.0 },
    { name: '凶猛的', hpMult: 0.95, atkMult: 1.22, defMult: 0.92 },
    { name: '坚韧的', hpMult: 1.15, atkMult: 0.95, defMult: 1.25 },
    { name: '虚弱的', hpMult: 0.82, atkMult: 0.88, defMult: 0.85 },
    { name: '分裂的', hpMult: 0.9, atkMult: 1.05, defMult: 0.9, multiHit: 0.12 },
    { name: '吸血的', hpMult: 1.0, atkMult: 1.05, defMult: 1.0, lifesteal: 3 },
    { name: '迅捷的', hpMult: 0.92, atkMult: 1.08, defMult: 0.95, dodge: 4 },
    { name: '笨重的', hpMult: 1.2, atkMult: 0.9, defMult: 1.15, dodge: -3 },
    { name: '暴虐的', hpMult: 1.0, atkMult: 1.2, defMult: 0.9, critRate: 6 },
    { name: '厚皮的', hpMult: 1.18, atkMult: 0.92, defMult: 1.2 },
    { name: '狂化的', hpMult: 0.88, atkMult: 1.28, defMult: 0.88 },
    { name: '腐朽的', hpMult: 0.78, atkMult: 0.92, defMult: 0.8 },
    { name: '嗜血的', hpMult: 1.05, atkMult: 1.15, defMult: 0.95, lifesteal: 4 },
    { name: '石肤的', hpMult: 1.1, atkMult: 0.9, defMult: 1.35 },
    { name: '灵巧的', hpMult: 0.9, atkMult: 1.1, defMult: 0.9, dodge: 6 },
    { name: '重甲的', hpMult: 1.22, atkMult: 0.88, defMult: 1.3 },
    { name: '尖刺的', hpMult: 1.0, atkMult: 1.05, defMult: 1.1, thornsRate: 0.08 },
    { name: '剧毒的', hpMult: 0.95, atkMult: 1.15, defMult: 0.95, venomBonus: 0.1 },
    { name: '燃烧的', hpMult: 0.92, atkMult: 1.18, defMult: 0.9 },
    { name: '冰霜的', hpMult: 1.0, atkMult: 1.05, defMult: 1.08 },
    { name: '暗影的', hpMult: 0.95, atkMult: 1.12, defMult: 0.98, dodge: 3 },
    { name: '狂暴的', hpMult: 1.0, atkMult: 1.25, defMult: 0.85 },
    { name: '再生的', hpMult: 1.2, atkMult: 0.9, defMult: 1.0 },
    { name: '脆弱的', hpMult: 0.75, atkMult: 1.0, defMult: 0.75 },
    { name: '巨力的', hpMult: 1.08, atkMult: 1.28, defMult: 0.95 },
    { name: '铁壁的', hpMult: 1.15, atkMult: 0.85, defMult: 1.4 },
    { name: '双生的', hpMult: 0.85, atkMult: 1.15, defMult: 0.9, multiHit: 0.15 },
    { name: '诅咒的', hpMult: 0.9, atkMult: 1.1, defMult: 0.92 },
    { name: '邪能的', hpMult: 1.05, atkMult: 1.18, defMult: 0.95 },
    { name: '腐化的', hpMult: 0.95, atkMult: 1.12, defMult: 0.9 },
    { name: '精英的', hpMult: 1.2, atkMult: 1.15, defMult: 1.1 },
    { name: '变异的', hpMult: 1.1, atkMult: 1.12, defMult: 1.05 },
    { name: '古老的', hpMult: 1.25, atkMult: 1.05, defMult: 1.15 },
    { name: '幼体的', hpMult: 0.7, atkMult: 0.8, defMult: 0.75 },
    { name: '魁梧的', hpMult: 1.35, atkMult: 1.1, defMult: 1.1 },
    { name: '瘦小的', hpMult: 0.65, atkMult: 0.95, defMult: 0.7 },
    { name: '狡诈的', hpMult: 0.9, atkMult: 1.1, defMult: 0.88, critRate: 8 },
    { name: '无畏的', hpMult: 1.1, atkMult: 1.15, defMult: 1.05 },
    { name: '流亡的', hpMult: 0.92, atkMult: 1.18, defMult: 0.9 },
    { name: '野性的', hpMult: 1.05, atkMult: 1.2, defMult: 0.92 },
    { name: '护甲的', hpMult: 1.08, atkMult: 0.9, defMult: 1.28 },
    { name: '锋利的', hpMult: 0.95, atkMult: 1.22, defMult: 0.9 },
    { name: '顽强的', hpMult: 1.22, atkMult: 0.95, defMult: 1.18 },
    { name: '凶残的', hpMult: 0.98, atkMult: 1.28, defMult: 0.88 },
    { name: '幽灵的', hpMult: 0.85, atkMult: 1.08, defMult: 0.82, dodge: 8 },
    { name: '重击的', hpMult: 1.0, atkMult: 1.2, defMult: 1.0, heavyChance: 0.15 },
    { name: '连打的', hpMult: 0.92, atkMult: 1.1, defMult: 0.9, multiHit: 0.18 },
    { name: '破甲的', hpMult: 0.95, atkMult: 1.15, defMult: 0.95, armorBreak: 0.12 },
    { name: '嗜战的', hpMult: 1.05, atkMult: 1.18, defMult: 0.95, lifesteal: 2 },
    { name: '威压的', hpMult: 1.08, atkMult: 1.05, defMult: 1.15 },
    { name: '不死的', hpMult: 1.15, atkMult: 0.95, defMult: 1.1 },
    /* ========== 新增100个前缀词条 ========== */
    { name: '嗜杀的', hpMult: 0.95, atkMult: 1.2, defMult: 0.9, critRate: 5 },
    { name: '龟甲的', hpMult: 1.2, atkMult: 0.82, defMult: 1.38 },
    { name: '疾风的', hpMult: 0.88, atkMult: 1.12, defMult: 0.88, dodge: 5 },
    { name: '枯朽的', hpMult: 0.72, atkMult: 0.95, defMult: 0.78 },
    { name: '血怒的', hpMult: 1.02, atkMult: 1.22, defMult: 0.88, lifesteal: 2 },
    { name: '岩壳的', hpMult: 1.18, atkMult: 0.88, defMult: 1.32 },
    { name: '鬼步的', hpMult: 0.85, atkMult: 1.05, defMult: 0.85, dodge: 7 },
    { name: '铁骨的', hpMult: 1.25, atkMult: 0.9, defMult: 1.22 },
    { name: '碎颅的', hpMult: 0.98, atkMult: 1.26, defMult: 0.9 },
    { name: '毒腺的', hpMult: 0.92, atkMult: 1.12, defMult: 0.92 },
    { name: '焰心的', hpMult: 0.9, atkMult: 1.2, defMult: 0.88 },
    { name: '霜甲的', hpMult: 1.05, atkMult: 0.95, defMult: 1.2 },
    { name: '幽魂的', hpMult: 0.8, atkMult: 1.1, defMult: 0.8, dodge: 6 },
    { name: '疯魔的', hpMult: 0.9, atkMult: 1.3, defMult: 0.85 },
    { name: '自愈的', hpMult: 1.22, atkMult: 0.92, defMult: 1.05 },
    { name: '薄血的', hpMult: 0.68, atkMult: 1.05, defMult: 0.82 },
    { name: '开山的', hpMult: 1.05, atkMult: 1.3, defMult: 0.95 },
    { name: '铜墙的', hpMult: 1.15, atkMult: 0.8, defMult: 1.45 },
    { name: '三连的', hpMult: 0.88, atkMult: 1.12, defMult: 0.88, multiHit: 0.2 },
    { name: '蚀骨的', hpMult: 0.9, atkMult: 1.15, defMult: 0.88 },
    { name: '魔焰的', hpMult: 0.95, atkMult: 1.2, defMult: 0.9 },
    { name: '寒冰的', hpMult: 1.0, atkMult: 1.08, defMult: 1.12 },
    { name: '潜行的', hpMult: 0.88, atkMult: 1.15, defMult: 0.85, dodge: 5 },
    { name: '癫狂的', hpMult: 0.85, atkMult: 1.32, defMult: 0.82 },
    { name: '回春的', hpMult: 1.28, atkMult: 0.88, defMult: 1.0 },
    { name: '纸糊的', hpMult: 0.6, atkMult: 1.0, defMult: 0.7 },
    { name: '崩山的', hpMult: 1.0, atkMult: 1.28, defMult: 0.95 },
    { name: '钢甲的', hpMult: 1.2, atkMult: 0.85, defMult: 1.35 },
    { name: '乱舞的', hpMult: 0.9, atkMult: 1.08, defMult: 0.9, multiHit: 0.22 },
    { name: '溃烂的', hpMult: 0.78, atkMult: 1.0, defMult: 0.8 },
    { name: '炼狱的', hpMult: 0.92, atkMult: 1.22, defMult: 0.88 },
    { name: '极寒的', hpMult: 1.02, atkMult: 1.05, defMult: 1.15 },
    { name: '幻影的', hpMult: 0.82, atkMult: 1.1, defMult: 0.8, dodge: 9 },
    { name: '入魔的', hpMult: 0.88, atkMult: 1.28, defMult: 0.85 },
    { name: '不息的', hpMult: 1.25, atkMult: 0.9, defMult: 1.08 },
    { name: '易碎的', hpMult: 0.58, atkMult: 0.98, defMult: 0.68 },
    { name: '裂地的', hpMult: 1.02, atkMult: 1.26, defMult: 0.98 },
    { name: '金钟的', hpMult: 1.22, atkMult: 0.82, defMult: 1.4 },
    { name: '疾打的', hpMult: 0.86, atkMult: 1.15, defMult: 0.88, multiHit: 0.18 },
    { name: '噬魂的', hpMult: 0.92, atkMult: 1.18, defMult: 0.9 },
    { name: '邪火的', hpMult: 0.95, atkMult: 1.22, defMult: 0.92 },
    { name: '凛冬的', hpMult: 1.05, atkMult: 1.0, defMult: 1.18 },
    { name: '无踪的', hpMult: 0.8, atkMult: 1.12, defMult: 0.78, dodge: 8 },
    { name: '入煞的', hpMult: 0.9, atkMult: 1.3, defMult: 0.88 },
    { name: '续命的', hpMult: 1.3, atkMult: 0.88, defMult: 1.05 },
    { name: '一碰就碎的', hpMult: 0.52, atkMult: 0.95, defMult: 0.62 },
    { name: '破军的', hpMult: 1.0, atkMult: 1.3, defMult: 0.92 },
    { name: '玄铁的', hpMult: 1.18, atkMult: 0.85, defMult: 1.38 },
    { name: '连环的', hpMult: 0.88, atkMult: 1.1, defMult: 0.9, multiHit: 0.25 },
    { name: '蚀心的', hpMult: 0.88, atkMult: 1.15, defMult: 0.88 },
    { name: '业火的', hpMult: 0.9, atkMult: 1.25, defMult: 0.88 },
    { name: '永冻的', hpMult: 1.08, atkMult: 0.98, defMult: 1.22 },
    { name: '无形的', hpMult: 0.78, atkMult: 1.08, defMult: 0.75, dodge: 10 },
    { name: '煞化的', hpMult: 0.92, atkMult: 1.26, defMult: 0.9 },
    { name: '长生的', hpMult: 1.32, atkMult: 0.85, defMult: 1.1 },
    { name: '豆腐的', hpMult: 0.5, atkMult: 0.9, defMult: 0.6 },
    { name: '斩铁的', hpMult: 0.98, atkMult: 1.28, defMult: 0.95 },
    { name: '龙鳞的', hpMult: 1.2, atkMult: 0.88, defMult: 1.35 },
    { name: '多段的', hpMult: 0.9, atkMult: 1.05, defMult: 0.88, multiHit: 0.28 },
    { name: '摄魂的', hpMult: 0.9, atkMult: 1.2, defMult: 0.9 },
    { name: '魔息的', hpMult: 0.95, atkMult: 1.22, defMult: 0.92 },
    { name: '冰封的', hpMult: 1.1, atkMult: 0.95, defMult: 1.25 },
    { name: '遁形的', hpMult: 0.75, atkMult: 1.1, defMult: 0.72, dodge: 9 },
    { name: '狂煞的', hpMult: 0.88, atkMult: 1.32, defMult: 0.85 },
    { name: '不灭的', hpMult: 1.28, atkMult: 0.9, defMult: 1.12 },
    { name: '泡沫的', hpMult: 0.48, atkMult: 0.88, defMult: 0.58 },
    { name: '碎甲的', hpMult: 0.95, atkMult: 1.25, defMult: 0.92 },
    { name: '神盾的', hpMult: 1.22, atkMult: 0.82, defMult: 1.42 },
    { name: '五连的', hpMult: 0.82, atkMult: 1.08, defMult: 0.85, multiHit: 0.3 },
    { name: '夺魄的', hpMult: 0.88, atkMult: 1.18, defMult: 0.88 },
    { name: '冥炎的', hpMult: 0.92, atkMult: 1.25, defMult: 0.9 },
    { name: '霜魂的', hpMult: 1.05, atkMult: 1.02, defMult: 1.2 },
    { name: '隐身的', hpMult: 0.72, atkMult: 1.12, defMult: 0.7, dodge: 11 },
    { name: '魔煞的', hpMult: 0.9, atkMult: 1.28, defMult: 0.88 },
    { name: '永生的', hpMult: 1.35, atkMult: 0.88, defMult: 1.15 },
    { name: '朽木的', hpMult: 0.45, atkMult: 0.85, defMult: 0.55 },
    { name: '贯甲的', hpMult: 0.96, atkMult: 1.28, defMult: 0.92 },
    { name: '圣盾的', hpMult: 1.25, atkMult: 0.8, defMult: 1.45 },
    { name: '暴风的', hpMult: 0.84, atkMult: 1.12, defMult: 0.86, multiHit: 0.26 },
    { name: '勾魂的', hpMult: 0.86, atkMult: 1.22, defMult: 0.88 },
    { name: '焚天的', hpMult: 0.9, atkMult: 1.28, defMult: 0.88 },
    { name: '冰魄的', hpMult: 1.08, atkMult: 0.98, defMult: 1.28 },
    { name: '鬼隐的', hpMult: 0.7, atkMult: 1.08, defMult: 0.68, dodge: 12 },
    { name: '灭世的', hpMult: 0.86, atkMult: 1.35, defMult: 0.85 },
    { name: '涅槃的', hpMult: 1.32, atkMult: 0.9, defMult: 1.18 },
    { name: '朽败的', hpMult: 0.42, atkMult: 0.82, defMult: 0.52 },
    { name: '破城的', hpMult: 0.98, atkMult: 1.3, defMult: 0.9 },
    { name: '天罡的', hpMult: 1.28, atkMult: 0.82, defMult: 1.42 },
    { name: '骤雨的', hpMult: 0.82, atkMult: 1.1, defMult: 0.84, multiHit: 0.28 },
    { name: '索命的', hpMult: 0.85, atkMult: 1.25, defMult: 0.86 },
    { name: '红莲的', hpMult: 0.88, atkMult: 1.3, defMult: 0.86 },
    { name: '玄冰的', hpMult: 1.12, atkMult: 0.95, defMult: 1.3 },
    { name: '化风的', hpMult: 0.68, atkMult: 1.1, defMult: 0.65, dodge: 13 },
    { name: '灭道的', hpMult: 0.88, atkMult: 1.32, defMult: 0.86 },
    { name: '不死的', hpMult: 1.3, atkMult: 0.92, defMult: 1.2 },
    { name: '风化的', hpMult: 0.4, atkMult: 0.8, defMult: 0.5 },
    { name: '弑神的', hpMult: 0.96, atkMult: 1.32, defMult: 0.9 },
    { name: '金刚的', hpMult: 1.3, atkMult: 0.8, defMult: 1.48 },
    { name: '星落的', hpMult: 0.8, atkMult: 1.15, defMult: 0.82, multiHit: 0.3 },
    { name: '追魂的', hpMult: 0.84, atkMult: 1.28, defMult: 0.85 },
    { name: '天火的', hpMult: 0.86, atkMult: 1.32, defMult: 0.84 },
    { name: '万载寒冰的', hpMult: 1.15, atkMult: 0.92, defMult: 1.32 },
    { name: '虚无的', hpMult: 0.65, atkMult: 1.08, defMult: 0.62, dodge: 14 },
    { name: '劫灭的', hpMult: 0.85, atkMult: 1.35, defMult: 0.84 },
    { name: '不朽的', hpMult: 1.28, atkMult: 0.92, defMult: 1.22 },
    { name: '尘埃的', hpMult: 0.38, atkMult: 0.78, defMult: 0.48 },
    { name: '崩天的', hpMult: 0.94, atkMult: 1.35, defMult: 0.88 },
    { name: '不破的', hpMult: 1.32, atkMult: 0.78, defMult: 1.5 },
    { name: '流星雨的', hpMult: 0.78, atkMult: 1.12, defMult: 0.8, multiHit: 0.32 },
    /* ========== 福利怪前缀（属性-30%，经验与货币×2） ========== */
    { name: '【福利】', hpMult: 0.7, atkMult: 0.7, defMult: 0.7, welfareReward: 2 },
    { name: '【送宝】', hpMult: 0.7, atkMult: 0.7, defMult: 0.7, welfareReward: 2 },
    { name: '【福星】', hpMult: 0.7, atkMult: 0.7, defMult: 0.7, welfareReward: 2 },
    { name: '【财神】', hpMult: 0.7, atkMult: 0.7, defMult: 0.7, welfareReward: 2 },
    { name: '【好运】', hpMult: 0.7, atkMult: 0.7, defMult: 0.7, welfareReward: 2 }
];

var ABYSS_BOSS_NAMES = [
    '灭世魔尊', '深渊主宰', '混沌领主', '虚空君王', '噬界者', '永恒梦魇', '破灭天尊', '万劫魔君', '寂灭帝尊',
    '葬天者', '湮灭之瞳', '深渊帝君', '混沌魔神', '虚空吞噬者', '永劫魔皇', '崩界尊者', '弑神者', '无间狱主',
    '诸界毁灭者', '深渊大君', '虚空暴君', '终焉魔神', '灭道天尊', '噬星之主', '永夜君王'
];

var ABYSS_PET_SKILLS = [
    { id: 'petCombo', name: '连击', chance: 0.2, multi: 2 },
    { id: 'petCrit', name: '必杀', critRate: 15, critDmg: 50 },
    { id: 'petLifesteal', name: '吸血', rate: 0.1 },
    { id: 'petStrong', name: '强力', atkBonus: 0.15 },
    { id: 'petDef', name: '防御', defBonus: 0.2 },
    { id: 'petBless', name: '神佑', reviveChance: 0.1 },
    { id: 'petSneak', name: '偷袭', dmgBonus: 0.1 },
    { id: 'petBreak', name: '破防', reduceDef: 10 },
    { id: 'petRage', name: '狂暴', atkBonus: 0.25, defPenalty: 0.1 },
    { id: 'petSwift', name: '敏捷', speedBonus: 0.2 },
    { id: 'petRebound', name: '反震', reboundChance: 0.2, reboundPct: 0.3 },
    { id: 'petRegen', name: '再生', regenPct: 0.05 },
    { id: 'petMeditate', name: '冥思', regenPct: 0.08 },
    { id: 'petWisdom', name: '慧根', dmgBonus: 0.08 },
    { id: 'petGhost', name: '驱鬼', dmgBonus: 0.2 },
    { id: 'petSoul', name: '鬼魂', reviveChance: 0.15 },
    { id: 'petMiracle', name: '神迹', defBonus: 0.15 },
    { id: 'petFocus', name: '精神集中', critRate: 10, defBonus: 0.1 },
    { id: 'petLucky', name: '幸运', critRate: 20, critDmg: 30 },
    { id: 'petParry', name: '招架', defBonus: 0.25 },
    { id: 'petEternal', name: '永恒', defBonus: 0.12, atkBonus: 0.05 },
    { id: 'petPoison', name: '毒', dmgBonus: 0.12 },
    { id: 'petFlame', name: '烈火', dmgBonus: 0.18 },
    { id: 'petWaterAbs', name: '水吸', defBonus: 0.08 },
    { id: 'petThunderAbs', name: '雷吸', defBonus: 0.08 },
    { id: 'petEarthAbs', name: '土吸', defBonus: 0.08 },
    { id: 'petFireAbs', name: '火吸', defBonus: 0.08 },
    { id: 'petFly', name: '飞行', dmgBonus: 0.1, speedBonus: 0.15 },
    { id: 'petNight', name: '夜战', atkBonus: 0.2 },
    { id: 'petSense', name: '感知', dmgBonus: 0.15 },
    { id: 'petBerserk', name: '舍身击', atkBonus: 0.3, defPenalty: 0.15 },
    { id: 'petAdvCombo', name: '高级连击', chance: 0.35, multi: 2.5 },
    { id: 'petAdvCrit', name: '高级必杀', critRate: 25, critDmg: 80 },
    { id: 'petAdvStrong', name: '高级强力', atkBonus: 0.28 },
    { id: 'petAdvDef', name: '高级防御', defBonus: 0.35 },
    { id: 'petAdvBless', name: '高级神佑', reviveChance: 0.2 },
    { id: 'petAdvSneak', name: '高级偷袭', dmgBonus: 0.2 },
    { id: 'petAdvLifesteal', name: '高级吸血', rate: 0.2 },
    { id: 'petAdvRebound', name: '高级反震', reboundChance: 0.35, reboundPct: 0.4 },
    { id: 'petAdvFly', name: '高级飞行', dmgBonus: 0.2, speedBonus: 0.25 },
    { id: 'petAdvNight', name: '高级夜战', atkBonus: 0.35 },
    { id: 'petAdvSense', name: '高级感知', dmgBonus: 0.25 },
    { id: 'petAdvGhost', name: '高级驱鬼', dmgBonus: 0.35 },
    { id: 'petAdvLucky', name: '高级幸运', critRate: 30, critDmg: 50 },
    { id: 'petAdvParry', name: '高级招架', defBonus: 0.4 },
    { id: 'petAdvPoison', name: '高级毒', dmgBonus: 0.22 },
    { id: 'petAdvFlame', name: '高级烈火', dmgBonus: 0.3 },
    { id: 'petAdvFocus', name: '高级精神集中', critRate: 18, defBonus: 0.2 },
    { id: 'petAdvEternal', name: '高级永恒', defBonus: 0.22, atkBonus: 0.12 },
    { id: 'petAdvRage', name: '高级狂暴', atkBonus: 0.4, defPenalty: 0.12 },
    { id: 'petAdvBerserk', name: '高级舍身击', atkBonus: 0.45, defPenalty: 0.18 },
    { id: 'petAdvWisdom', name: '高级慧根', dmgBonus: 0.18 },
    { id: 'petAdvMiracle', name: '高级神迹', defBonus: 0.28 },
    /* ========== 宠物多目标攻击技能 ========== */
    { id: 'petSweep', name: '横扫', petAoeChance: 0.2, petAoePct: 0.4 },
    { id: 'petSplash', name: '溅射', petAoeChance: 0.25, petAoePct: 0.35 },
    { id: 'petShockwave', name: '震波', petAoeChance: 0.3, petAoePct: 0.3 },
    { id: 'petRift', name: '裂空', petAoeChance: 0.15, petAoePct: 0.55 },
    { id: 'petAdvSweep', name: '高级横扫', petAoeChance: 0.35, petAoePct: 0.5 },
    /* ========== 宠物被动：给玩家加成（低级） ========== */
    { id: 'petPassionWar', name: '战意', playerBonus: { atk: 40 } },
    { id: 'petIronWall', name: '铁壁', playerBonus: { def: 30 } },
    { id: 'petVitality', name: '生机', playerBonus: { hp: 250 } },
    { id: 'petSpiritSource', name: '灵源', playerBonus: { maxMp: 5 } },
    { id: 'petBloodBond', name: '血契', playerBonus: { lifesteal: 0.5 } },
    { id: 'petBreakMomentum', name: '破势', playerBonus: { critDmg: 6 } },
    { id: 'petMindLink', name: '灵犀', playerBonus: { skillDmg: 4 } },
    { id: 'petMistyStep', name: '飘渺', playerBonus: { dodge: 1 } },
    { id: 'petFiveResonance', name: '五行共鸣', playerBonus: { elementAtk: 10 } },
    { id: 'petSharpWill', name: '锐意', playerBonus: { atk: 35 } },
    { id: 'petToughArmor', name: '韧甲', playerBonus: { def: 25 } },
    { id: 'petQiBlood', name: '气血', playerBonus: { hp: 200 } },
    { id: 'petConcentrate', name: '凝神', playerBonus: { maxMp: 4 } },
    { id: 'petBloodThirst', name: '噬血', playerBonus: { lifesteal: 0.4 } },
    { id: 'petSharpEdge', name: '锋芒', playerBonus: { critDmg: 5 } },
    { id: 'petMysticPower', name: '玄通', playerBonus: { skillDmg: 3 } },
    { id: 'petGhostStep', name: '鬼步', playerBonus: { dodge: 0.8 } },
    { id: 'petElementSoul', name: '元灵', playerBonus: { elementAtk: 8 } },
    { id: 'petBerserkWar', name: '狂战', playerBonus: { atk: 50 } },
    { id: 'petSteadfastShield', name: '坚盾', playerBonus: { def: 35 } },
    { id: 'petLifeFlow', name: '生命之息', playerBonus: { hp: 300 } },
    { id: 'petManaWell', name: '法力之井', playerBonus: { maxMp: 6 } },
    /* ========== 宠物被动：给玩家加成（高级） ========== */
    { id: 'petAdvPassionWar', name: '战神祝福', playerBonus: { atk: 120 } },
    { id: 'petAdvIronWall', name: '不破金身', playerBonus: { def: 90 } },
    { id: 'petAdvVitality', name: '生命之泉', playerBonus: { hp: 800 } },
    { id: 'petAdvSpiritSource', name: '奥术洪流', playerBonus: { maxMp: 18 } },
    { id: 'petAdvBloodBond', name: '嗜血契约', playerBonus: { lifesteal: 1.5 } },
    { id: 'petAdvBreakMomentum', name: '毁灭之势', playerBonus: { critDmg: 18 } },
    { id: 'petAdvMindLink', name: '神念', playerBonus: { skillDmg: 12 } },
    { id: 'petAdvMistyStep', name: '幻影步', playerBonus: { dodge: 3 } },
    { id: 'petAdvFiveResonance', name: '五行归一', playerBonus: { elementAtk: 35 } },
    { id: 'petAdvSharpWill', name: '破军', playerBonus: { atk: 100 } },
    { id: 'petAdvToughArmor', name: '玄武护体', playerBonus: { def: 75 } },
    { id: 'petAdvQiBlood', name: '龙象气血', playerBonus: { hp: 600 } },
    { id: 'petAdvConcentrate', name: '天心凝神', playerBonus: { maxMp: 14 } },
    { id: 'petAdvBloodThirst', name: '血魔契约', playerBonus: { lifesteal: 1.2 } },
    { id: 'petAdvSharpEdge', name: '诛神锋芒', playerBonus: { critDmg: 15 } },
    { id: 'petAdvMysticPower', name: '玄天通神', playerBonus: { skillDmg: 10 } },
    { id: 'petAdvGhostStep', name: '幽冥鬼步', playerBonus: { dodge: 2.5 } },
    { id: 'petAdvElementSoul', name: '五行造化', playerBonus: { elementAtk: 28 } },
    { id: 'petAdvBerserkWar', name: '修罗战意', playerBonus: { atk: 110 } },
    { id: 'petAdvSteadfastShield', name: '永恒壁垒', playerBonus: { def: 80 } },
    { id: 'petAdvLifeFlow', name: '涅槃生机', playerBonus: { hp: 700 } },
    { id: 'petAdvManaWell', name: '虚空法源', playerBonus: { maxMp: 16 } }
];

function getAbyssPetSkillEffect(skillId) {
    if (!skillId || typeof ABYSS_PET_SKILLS === 'undefined') return '';
    for (var i = 0; i < ABYSS_PET_SKILLS.length; i++) {
        if (ABYSS_PET_SKILLS[i].id === skillId) {
            var sk = ABYSS_PET_SKILLS[i];
            var parts = [];
            if (sk.chance != null) parts.push((sk.chance * 100) + '%连击');
            if (sk.multi != null) parts.push(sk.multi + '倍伤害');
            if (sk.critRate != null) parts.push('暴击率+' + sk.critRate + '%');
            if (sk.critDmg != null) parts.push('暴击伤害+' + sk.critDmg + '%');
            if (sk.rate != null) parts.push('吸血' + (sk.rate * 100) + '%');
            if (sk.atkBonus != null) parts.push('攻击+' + (sk.atkBonus * 100) + '%');
            if (sk.defBonus != null) parts.push('防御+' + (sk.defBonus * 100) + '%');
            if (sk.defPenalty != null) parts.push('防御-' + (sk.defPenalty * 100) + '%');
            if (sk.dmgBonus != null) parts.push('伤害+' + (sk.dmgBonus * 100) + '%');
            if (sk.reduceDef != null) parts.push('目标防御-' + sk.reduceDef + '%');
            if (sk.speedBonus != null) parts.push('速度+' + (sk.speedBonus * 100) + '%');
            if (sk.reboundChance != null) parts.push((sk.reboundChance * 100) + '%反震');
            if (sk.reboundPct != null) parts.push('反震' + (sk.reboundPct * 100) + '%伤害');
            if (sk.regenPct != null) parts.push('每回合回复' + (sk.regenPct * 100) + '%生命');
            if (sk.reviveChance != null) parts.push((sk.reviveChance * 100) + '%复活');
            if (sk.petAoeChance != null) parts.push((sk.petAoeChance * 100) + '%溅射');
            if (sk.petAoePct != null) parts.push('溅射' + (sk.petAoePct * 100) + '%伤害');
            if (sk.playerBonus) {
                var pb = sk.playerBonus;
                if (pb.atk) parts.push('玩家攻击+' + pb.atk);
                if (pb.def) parts.push('玩家防御+' + pb.def);
                if (pb.hp) parts.push('玩家生命+' + pb.hp);
                if (pb.maxMp) parts.push('玩家魔法+' + pb.maxMp);
                if (pb.lifesteal) parts.push('玩家吸血+' + pb.lifesteal + '%');
                if (pb.critDmg) parts.push('玩家暴击伤害+' + pb.critDmg + '%');
                if (pb.skillDmg) parts.push('玩家技能伤害+' + pb.skillDmg + '%');
                if (pb.dodge) parts.push('玩家闪避+' + pb.dodge + '%');
                if (pb.elementAtk) parts.push('玩家元素攻击+' + pb.elementAtk);
            }
            return parts.length ? parts.join('，') : '被动技能';
        }
    }
    return '';
}

function abyssGenPetId() { return 'pet_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9); }

var ABYSS_PET_TYPES = [
    { id: 'atk', name: '攻击型' },
    { id: 'balance', name: '平衡型' },
    { id: 'def', name: '防御型' },
    { id: 'hp', name: '体力型' }
];

// 宠物装备：项圈(攻)、护腕(防)、铠甲(体)，50个部位名字
var ABYSS_PET_EQUIP_NAMES = [
    '烈焰','寒冰','雷霆','幽影','龙鳞','虎骨','玄铁','青钢','赤铜','白银','黄金','翡翠','琥珀','紫晶','血玉',
    '暗影','光明','风暴','大地','流水','烈火','霜冻','毒牙','荆棘','羽翼','兽爪','骨刺','魂灵','咒怨','祝福',
    '破军','铁壁','疾风','厚土','灵木','锐金','柔水','炎阳','月华','星尘','虚空','混沌','秩序','毁灭','重生',
    '永恒','刹那','无畏','守护','狂暴','神佑'
];
var ABYSS_PET_EQUIP_SLOTS = [
    { type: '项圈', stat: 'atkPct' },
    { type: '护腕', stat: 'defPct' },
    { type: '铠甲', stat: 'hpPct' }
];

// 宠物内丹配置：三阶，每阶 20 个，全效果不同
var ABYSS_PET_NEIDAN_LIST = (function () {
    var list = [];
    function push(id, tier, name, desc, pet, player, global, minFloor) {
        list.push({
            id: id,
            tier: tier,           // 'basic' | 'mid' | 'high'
            name: name,
            desc: desc,
            pet: pet || {},
            player: player || {},
            global: global || {},
            minFloor: minFloor || 1
        });
    }
    // 初级内丹（10 层以上）：偏向小幅提升与入门破甲
    push('nd_basic_1', 'basic', '初阶·凝气内丹', '宠物攻击+8%，人物攻击+3%。', { atkPct: 8 }, { atkPct: 3 }, null, 10);
    push('nd_basic_2', 'basic', '初阶·固体内丹', '宠物防御+10%，人物防御+3%。', { defPct: 10 }, { defPct: 3 }, null, 10);
    push('nd_basic_3', 'basic', '初阶·养元内丹', '宠物生命+12%，人物生命+4%。', { hpPct: 12 }, { hpPct: 4 }, null, 10);
    push('nd_basic_4', 'basic', '初阶·伐骨内丹', '对怪物防御-5%，宠物攻击+5%。', { atkPct: 5 }, null, { reduceMonsterDef: 5 }, 10);
    push('nd_basic_5', 'basic', '初阶·炼气内丹', '宠物攻击+6%，宠物暴击伤害+10%。', { atkPct: 6, critDmg: 10 }, null, null, 10);
    push('nd_basic_6', 'basic', '初阶·聚魂内丹', '宠物生命+8%，宠物吸血+4%。', { hpPct: 8, lifestealPct: 4 }, null, null, 10);
    push('nd_basic_7', 'basic', '初阶·清心内丹', '人物暴击率+4%，宠物暴击率+3%。', { critRate: 3 }, { critRate: 4 }, null, 10);
    push('nd_basic_8', 'basic', '初阶·锻体内丹', '人物防御+5%，宠物防御+6%。', { defPct: 6 }, { defPct: 5 }, null, 10);
    push('nd_basic_9', 'basic', '初阶·润血内丹', '人物生命+6%，宠物生命+6%。', { hpPct: 6 }, { hpPct: 6 }, null, 10);
    push('nd_basic_10', 'basic', '初阶·碎甲内丹', '对怪物防御-7%。', null, null, { reduceMonsterDef: 7 }, 10);
    push('nd_basic_11', 'basic', '初阶·逐流内丹', '宠物闪避+5%，人物闪避+3%。', { dodge: 5 }, { dodge: 3 }, null, 10);
    push('nd_basic_12', 'basic', '初阶·强筋内丹', '宠物攻击+5%，防御+5%。', { atkPct: 5, defPct: 5 }, null, null, 10);
    push('nd_basic_13', 'basic', '初阶·醒神内丹', '人物暴击伤害+10%，宠物暴击率+2%。', { critRate: 2 }, { critDmg: 10 }, null, 10);
    push('nd_basic_14', 'basic', '初阶·御敌内丹', '人物减怪物防御+4%，宠物减伤+4%。', null, null, { reduceMonsterDef: 4, damageReduction: 4 }, 10);
    push('nd_basic_15', 'basic', '初阶·金刚内丹', '宠物生命+10%，宠物防御+8%。', { hpPct: 10, defPct: 8 }, null, null, 10);
    push('nd_basic_16', 'basic', '初阶·腾云内丹', '宠物攻击+4%，人物暴击率+2%。', { atkPct: 4 }, { critRate: 2 }, null, 10);
    push('nd_basic_17', 'basic', '初阶·灵息内丹', '宠物吸血+5%，人物吸血+3%。', { lifestealPct: 5 }, { lifestealPct: 3 }, null, 10);
    push('nd_basic_18', 'basic', '初阶·碎灵内丹', '对怪物防御-4%，人物攻击+4%。', null, { atkPct: 4 }, { reduceMonsterDef: 4 }, 10);
    push('nd_basic_19', 'basic', '初阶·聚宝内丹', '获得金币+6%。', null, null, { goldPct: 6 }, 10);
    push('nd_basic_20', 'basic', '初阶·通慧内丹', '获得经验+3%。', null, null, { expPct: 3 }, 10);

    // 中级内丹（50 层以上）：偏向多属性与更强破甲、增益
    push('nd_mid_1', 'mid', '中阶·裂甲内丹', '对怪物防御-12%，宠物攻击+10%。', { atkPct: 10 }, null, { reduceMonsterDef: 12 }, 50);
    push('nd_mid_2', 'mid', '中阶·镇魂内丹', '宠物生命+16%，宠物减伤+8%。', { hpPct: 16, damageReduction: 8 }, null, null, 50);
    push('nd_mid_3', 'mid', '中阶·破虚内丹', '人物攻击+8%，暴击伤害+20%。', null, { atkPct: 8, critDmg: 20 }, null, 50);
    push('nd_mid_4', 'mid', '中阶·玄冰内丹', '宠物攻击+10%，怪物防御-8%。', { atkPct: 10 }, null, { reduceMonsterDef: 8 }, 50);
    push('nd_mid_5', 'mid', '中阶·怒雷内丹', '宠物暴击率+6%，暴击伤害+25%。', { critRate: 6, critDmg: 25 }, null, null, 50);
    push('nd_mid_6', 'mid', '中阶·血炼内丹', '宠物吸血+10%，人物生命+8%。', { lifestealPct: 10 }, { hpPct: 8 }, null, 50);
    push('nd_mid_7', 'mid', '中阶·钢躯内丹', '人物防御+10%，宠物防御+14%。', { defPct: 14 }, { defPct: 10 }, null, 50);
    push('nd_mid_8', 'mid', '中阶·流光内丹', '人物闪避+6%，宠物闪避+8%。', { dodge: 8 }, { dodge: 6 }, null, 50);
    push('nd_mid_9', 'mid', '中阶·揽月内丹', '人物攻击+6%，宠物生命+14%。', { hpPct: 14 }, { atkPct: 6 }, null, 50);
    push('nd_mid_10', 'mid', '中阶·碎星内丹', '对怪物防御-15%，人物暴击率+5%。', null, { critRate: 5 }, { reduceMonsterDef: 15 }, 50);
    push('nd_mid_11', 'mid', '中阶·金乌内丹', '获得金币+12%，宠物攻击+6%。', { atkPct: 6 }, null, { goldPct: 12 }, 50);
    push('nd_mid_12', 'mid', '中阶·青龙内丹', '获得经验+6%，宠物生命+10%。', { hpPct: 10 }, null, { expPct: 6 }, 50);
    push('nd_mid_13', 'mid', '中阶·碎霜内丹', '人物攻击+6%，防御+6%，宠物攻击+6%。', { atkPct: 6 }, { atkPct: 6, defPct: 6 }, null, 50);
    push('nd_mid_14', 'mid', '中阶·通玄内丹', '宠物暴击率+4%，人物暴击率+4%，怪物防御-6%。', { critRate: 4 }, { critRate: 4 }, { reduceMonsterDef: 6 }, 50);
    push('nd_mid_15', 'mid', '中阶·返虚内丹', '人物吸血+5%，宠物吸血+8%。', { lifestealPct: 8 }, { lifestealPct: 5 }, null, 50);
    push('nd_mid_16', 'mid', '中阶·炼骨内丹', '宠物攻击+12%，人物防御+6%。', { atkPct: 12 }, { defPct: 6 }, null, 50);
    push('nd_mid_17', 'mid', '中阶·冥狱内丹', '怪物防御-10%，怪物易伤+6%。', null, null, { reduceMonsterDef: 10, vulnerablePct: 6 }, 50);
    push('nd_mid_18', 'mid', '中阶·镇妖内丹', '宠物减伤+10%，人物生命+10%。', { damageReduction: 10 }, { hpPct: 10 }, null, 50);
    push('nd_mid_19', 'mid', '中阶·慧心内丹', '获得经验+4%，金币+8%，宠物暴击率+3%。', { critRate: 3 }, null, { expPct: 4, goldPct: 8 }, 50);
    push('nd_mid_20', 'mid', '中阶·碎空内丹', '人物攻击+10%，对怪物防御-8%。', null, { atkPct: 10 }, { reduceMonsterDef: 8 }, 50);

    // 高级内丹（100 层以上）：强力破甲与全队增益
    push('nd_high_1', 'high', '高阶·灭甲内丹', '对怪物防御-25%，宠物攻击+16%。', { atkPct: 16 }, null, { reduceMonsterDef: 25 }, 100);
    push('nd_high_2', 'high', '高阶·鸿蒙内丹', '人物攻击+15%，生命+12%。', null, { atkPct: 15, hpPct: 12 }, null, 100);
    push('nd_high_3', 'high', '高阶·神躯内丹', '人物防御+16%，宠物生命+18%。', { hpPct: 18 }, { defPct: 16 }, null, 100);
    push('nd_high_4', 'high', '高阶·吞日内丹', '获得金币+20%，人物攻击+8%。', null, { atkPct: 8 }, { goldPct: 20 }, 100);
    push('nd_high_5', 'high', '高阶·载月内丹', '获得经验+10%，宠物攻击+10%。', { atkPct: 10 }, null, { expPct: 10 }, 100);
    push('nd_high_6', 'high', '高阶·崩天内丹', '怪物防御-18%，怪物易伤+10%。', null, null, { reduceMonsterDef: 18, vulnerablePct: 10 }, 100);
    push('nd_high_7', 'high', '高阶·永劫内丹', '宠物减伤+15%，人物减伤+8%。', { damageReduction: 15 }, { damageReduction: 8 }, null, 100);
    push('nd_high_8', 'high', '高阶·星辰内丹', '宠物暴击率+10%，暴击伤害+40%。', { critRate: 10, critDmg: 40 }, null, null, 100);
    push('nd_high_9', 'high', '高阶·寂灭内丹', '人物暴击率+8%，暴击伤害+35%。', null, { critRate: 8, critDmg: 35 }, null, 100);
    push('nd_high_10', 'high', '高阶·归一内丹', '人物攻击+10%，防御+10%，生命+10%。', null, { atkPct: 10, defPct: 10, hpPct: 10 }, null, 100);
    push('nd_high_11', 'high', '高阶·噬魂内丹', '宠物吸血+16%，人物吸血+10%。', { lifestealPct: 16 }, { lifestealPct: 10 }, null, 100);
    push('nd_high_12', 'high', '高阶·化龙内丹', '宠物攻击+18%，人物攻击+8%。', { atkPct: 18 }, { atkPct: 8 }, null, 100);
    push('nd_high_13', 'high', '高阶·玄武内丹', '宠物生命+20%，人物防御+12%。', { hpPct: 20 }, { defPct: 12 }, null, 100);
    push('nd_high_14', 'high', '高阶·赤焰内丹', '对怪物防御-20%，人物技能伤害显著提升（视为易伤+8%）。', null, null, { reduceMonsterDef: 20, vulnerablePct: 8 }, 100);
    push('nd_high_15', 'high', '高阶·太初内丹', '金币+15%，经验+8%，宠物攻击+8%。', { atkPct: 8 }, null, { goldPct: 15, expPct: 8 }, 100);
    push('nd_high_16', 'high', '高阶·神识内丹', '人物暴击率+6%，宠物暴击率+6%，怪物防御-10%。', { critRate: 6 }, { critRate: 6 }, { reduceMonsterDef: 10 }, 100);
    push('nd_high_17', 'high', '高阶·无量内丹', '宠物攻击+12%，防御+12%，生命+12%。', { atkPct: 12, defPct: 12, hpPct: 12 }, null, null, 100);
    push('nd_high_18', 'high', '高阶·不灭内丹', '人物生命+18%，宠物减伤+12%。', { damageReduction: 12 }, { hpPct: 18 }, null, 100);
    push('nd_high_19', 'high', '高阶·终焉内丹', '对怪物防御-22%，怪物易伤+12%。', null, null, { reduceMonsterDef: 22, vulnerablePct: 12 }, 100);
    push('nd_high_20', 'high', '高阶·大道内丹', '人物全属性小幅提升（攻防体+8%），宠物攻击+10%。', { atkPct: 10 }, { atkPct: 8, defPct: 8, hpPct: 8 }, null, 100);

    return list;
})();

function abyssGenPetNeidanId() {
    return 'nd_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

function abyssGenPetNeidan(floor) {
    var f = Math.max(1, floor || 1);
    var pool = ABYSS_PET_NEIDAN_LIST.filter(function (nd) {
        return nd.minFloor <= f;
    });
    if (pool.length === 0) pool = ABYSS_PET_NEIDAN_LIST;
    // 根据楼层大致偏向对应阶内丹
    var tierWeight = [];
    pool.forEach(function (nd) {
        var w = 1;
        if (nd.tier === 'basic') w = (f >= 100 ? 1 : f >= 50 ? 2 : 4);
        else if (nd.tier === 'mid') w = (f >= 100 ? 3 : 2);
        else if (nd.tier === 'high') w = (f >= 100 ? 5 : 1);
        tierWeight.push({ nd: nd, w: w });
    });
    var total = tierWeight.reduce(function (s, x) { return s + x.w; }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < tierWeight.length; i++) {
        r -= tierWeight[i].w;
        if (r <= 0) {
            var base = tierWeight[i].nd;
            return {
                id: abyssGenPetNeidanId(),
                tplId: base.id,
                tier: base.tier,
                name: base.name,
                desc: base.desc,
                pet: base.pet,
                player: base.player,
                global: base.global,
                level: 1
            };
        }
    }
    return null;
}
function abyssNeidanUpgradeCost(neidan) {
    if (!neidan) return 999;
    var lvl = Math.max(1, Math.min(5, neidan.level || 1));
    if (lvl >= 5) return 0;
    var mult = neidan.tier === 'basic' ? 2 : (neidan.tier === 'mid' ? 3 : 5);
    return mult * lvl;
}
function abyssGenPetEquipId() { return 'peq_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9); }
function abyssGenPetEquipment() {
    var slotIdx = Math.floor(Math.random() * 3);
    var slot = ABYSS_PET_EQUIP_SLOTS[slotIdx];
    var nameStem = ABYSS_PET_EQUIP_NAMES[Math.floor(Math.random() * ABYSS_PET_EQUIP_NAMES.length)];
    var displayName = nameStem + slot.type;
    var r = Math.random();
    var value;
    if (r < 0.86) value = 1 + Math.floor(Math.random() * 20);
    else if (r < 0.94) value = 21 + Math.floor(Math.random() * 20);
    else if (r < 0.97) value = 41 + Math.floor(Math.random() * 20);
    else if (r < 0.99) value = 61 + Math.floor(Math.random() * 20);
    else value = 81 + Math.floor(Math.random() * 20);
    r = Math.random();
    var prefix = null, mult = 1;
    if (r < 0.01) { prefix = '仙品'; mult = 2; }
    else if (r < 0.04) { prefix = '神品'; mult = 1.5; }
    else if (r < 0.14) { prefix = '圣品'; mult = 1.2; }
    value = Math.min(100, Math.floor(value * mult));
    var eq = {
        id: abyssGenPetEquipId(),
        slotType: slot.type,
        name: displayName,
        prefix: prefix,
        atkPct: 0, defPct: 0, hpPct: 0
    };
    eq[slot.stat] = value;
    if (Math.random() < 0.2) {
        var skillPool = ABYSS_PET_SKILLS.filter(function(s) { return !s.playerBonus; });
        if (skillPool.length > 0) {
            var sk = skillPool[Math.floor(Math.random() * skillPool.length)];
            eq.skill = { id: sk.id, name: sk.name };
        }
    }
    return eq;
}

function abyssGenPet(monsterName, floor) {
    var baseName = (monsterName || '未命名').replace(/·\d+层$/, '').trim();
    baseName = baseName.replace(/^【[^】]+】/, '');
    for (var pi = 0; pi < ABYSS_MONSTER_PREFIXES.length; pi++) {
        var pn = ABYSS_MONSTER_PREFIXES[pi].name;
        if (baseName.indexOf(pn) === 0) { baseName = baseName.slice(pn.length).trim(); break; }
    }
    if (!baseName) baseName = '未命名';
    var f = Math.max(1, floor || 1);
    
    var rollRand = Math.random();
    var isSuper = (f >= 50) && (rollRand < 0.005);
    var isShiny = !isSuper && (f >= 30) && (rollRand < 0.02);
    var isVariant = !isSuper && !isShiny && (f >= 10) && (rollRand < 0.1);
    var bonus = Math.min(800, Math.floor(f * 25));
    var baseMin = 1500;
    var baseMax = 2500;
    var roll = function() { return Math.min(3500, baseMin + Math.floor(Math.random() * (baseMax - baseMin + 1)) + bonus); };
    var growth = {
        atk: roll(),
        def: roll(),
        hp: roll(),
        speed: roll()
    };
    if (isVariant || isShiny || isSuper) {
        // 变异：+20%；闪光：在变异基础上再+30%（1.2 * 1.3 = 1.56）
        // 超级：比变异再高100%（1.2 * 2 = 2.4）
        var mult = 1.0;
        if (isSuper) mult = 2.4;
        else if (isShiny) mult = 1.56;
        else if (isVariant) mult = 1.2;
        growth.atk = Math.floor(growth.atk * mult);
        growth.def = Math.floor(growth.def * mult);
        growth.hp = Math.floor(growth.hp * mult);
        growth.speed = Math.floor(growth.speed * mult);
    }
    var typeIdx = Math.floor(Math.random() * ABYSS_PET_TYPES.length);
    var petType = ABYSS_PET_TYPES[typeIdx].id;
    if (petType === 'atk') growth.atk = Math.floor(growth.atk * 1.15);
    else if (petType === 'def') growth.def = Math.floor(growth.def * 1.15);
    else if (petType === 'hp') growth.hp = Math.floor(growth.hp * 1.15);
    else if (petType === 'balance') {
        growth.atk = Math.floor(growth.atk * 1.08);
        growth.def = Math.floor(growth.def * 1.08);
        growth.hp = Math.floor(growth.hp * 1.08);
        growth.speed = Math.floor(growth.speed * 1.08);
    }
    var skillCount = isSuper ? (6 + Math.floor(Math.random() * 3))   // 超级：6~8个技能
                    : (isShiny ? (5 + Math.floor(Math.random() * 3)) // 闪光：5~7个技能
                               : (isVariant ? (4 + Math.floor(Math.random() * 3)) // 变异：4~6个技能
                                            : (1 + Math.floor(Math.random() * 3)))); // 普通：1~3个技能
    var pool = ABYSS_PET_SKILLS.slice();
    var skills = [];
    for (var i = 0; i < skillCount && pool.length > 0; i++) {
        var idx = Math.floor(Math.random() * pool.length);
        skills.push({ id: pool[idx].id, name: pool[idx].name });
        pool.splice(idx, 1);
    }
    var displayName = baseName;
    if (isSuper) displayName = '超级' + displayName;
    else if (isShiny) displayName = '闪光' + displayName;
    else if (isVariant) displayName = '变异' + displayName;
    return {
        id: abyssGenPetId(),
        name: displayName,
        type: petType,
        variant: !!isVariant,
        shiny: !!isShiny,
        super: !!isSuper,
        level: 1,
        exp: 0,
        growth: growth,
        skills: skills,
        equipment: { '项圈': null, '护腕': null, '铠甲': null },
        neidan: null,
        hp: null,
        maxHp: 0
    };
}

function abyssCalcPetStats(pet) {
    if (!pet) return null;
    var cache = abyssRun && abyssRun._petStatsCache;
    var key = pet.id || ('p' + (pet.name || ''));
    if (cache && cache[key]) return cache[key];
    var L = pet.level || 1;
    var g = pet.growth || { atk: 1000, def: 1000, hp: 1000, speed: 1000 };
    var at = getAbyssTower();
    var turtleCount = (at.abyssVault || {})['vault_sea_turtle'] || 0;
    if (turtleCount > 0) {
        var v = (ABYSS_VAULT_TREASURES.filter(function(t){ return t.id === 'vault_sea_turtle'; })[0] || {}).effect;
        var add = (v && v.value != null ? v.value : 10) * turtleCount;
        g = { atk: (g.atk || 0) + add, def: (g.def || 0) + add, hp: (g.hp || 0) + add, speed: (g.speed || 0) + add };
    }
    var atk = Math.floor(L * (g.atk / 1000) * 31);
    var def = Math.floor(L * (g.def / 1000) * 21);
    var maxHp = Math.floor(L * (g.hp / 1000) * 1021);
    atk = Math.max(1, atk);
    def = Math.max(0, def);
    maxHp = Math.max(50, maxHp);
    var dodge = Math.min(15, Math.max(0, (g.speed - 1000) / 2000 * 10));
    var p = { atk: atk, def: def, maxHp: maxHp, dodge: dodge, critRate: 0, critDmg: 0, lifesteal: 0, damageReduction: 0 };
    for (var i = 0; i < (pet.skills || []).length; i++) {
        var sk = null;
        for (var j = 0; j < ABYSS_PET_SKILLS.length; j++) {
            if (ABYSS_PET_SKILLS[j].id === pet.skills[i].id) { sk = ABYSS_PET_SKILLS[j]; break; }
        }
        if (sk) {
            if (sk.atkBonus) p.atk = Math.floor(p.atk * (1 + sk.atkBonus));
            if (sk.defBonus) p.def = Math.floor(p.def * (1 + sk.defBonus));
        }
    }
    if (abyssRun && abyssRun.equipped) {
        var petStatEquipSkillSeen = {};
        for (var _psi = 0; _psi < ABYSS_SLOTS.length; _psi++) {
            var ek = ABYSS_SLOTS[_psi];
            var eq = abyssRun.equipped[ek];
            if (!eq) continue;
            var petSkillList = [eq.equipSkill, eq.skillSlot].filter(Boolean);
            for (var psi = 0; psi < petSkillList.length; psi++) {
                var esk = petSkillList[psi];
                if (!esk || !esk.effect) continue;
                var _psk = abyssEquipSkillDedupeKey(esk);
                if (_psk && petStatEquipSkillSeen[_psk]) continue;
                if (_psk) petStatEquipSkillSeen[_psk] = true;
                var e = esk.effect;
                if (e.petAtk) p.atk = (p.atk || 0) + e.petAtk;
                if (e.petDef) p.def = (p.def || 0) + e.petDef;
                if (e.petHp) p.maxHp = (p.maxHp || 0) + e.petHp;
                if (e.petDodge) p.dodge = (p.dodge || 0) + e.petDodge;
                if (e.petCritRate) p.critRate = (p.critRate || 0) + e.petCritRate;
                if (e.petCritDmg) p.critDmg = (p.critDmg || 0) + e.petCritDmg;
                if (e.petLifesteal) p.lifesteal = (p.lifesteal || 0) + e.petLifesteal;
                if (e.petDamageReduction) p.damageReduction = (p.damageReduction || 0) + e.petDamageReduction;
            }
        }
    }
    if (abyssRun && abyssRun.buffs) {
        var petAtkPct = (abyssRun.buffs.petAtkPct || 0) + (abyssRun.buffs.petTemp && abyssRun.buffs.petTemp.atkPct ? abyssRun.buffs.petTemp.atkPct : 0);
        var petDefPct = (abyssRun.buffs.petDefPct || 0) + (abyssRun.buffs.petTemp && abyssRun.buffs.petTemp.defPct ? abyssRun.buffs.petTemp.defPct : 0);
        var petHpPct = (abyssRun.buffs.petHpPct || 0) + (abyssRun.buffs.petTemp && abyssRun.buffs.petTemp.hpPct ? abyssRun.buffs.petTemp.hpPct : 0);
        if (petAtkPct !== 0) p.atk = Math.floor(p.atk * (1 + petAtkPct / 100));
        if (petDefPct !== 0) p.def = Math.floor(p.def * (1 + petDefPct / 100));
        if (petHpPct !== 0) p.maxHp = Math.floor(p.maxHp * (1 + petHpPct / 100));
    }
    // 宠物自身内丹加成（只作用于该宠物，内丹每级提升 20% 效果，满级 5 级）
    if (pet.neidan && pet.neidan.pet) {
        var ndp = pet.neidan.pet;
        var lvl = pet.neidan.level || 1;
        var mult = 1 + 0.2 * (Math.max(1, Math.min(5, lvl)) - 1);
        if (ndp.atkPct) p.atk = Math.floor(p.atk * (1 + (ndp.atkPct * mult) / 100));
        if (ndp.defPct) p.def = Math.floor(p.def * (1 + (ndp.defPct * mult) / 100));
        if (ndp.hpPct) p.maxHp = Math.floor(p.maxHp * (1 + (ndp.hpPct * mult) / 100));
        if (ndp.critRate) p.critRate = (p.critRate || 0) + ndp.critRate * mult;
        if (ndp.critDmg) p.critDmg = (p.critDmg || 0) + ndp.critDmg * mult;
        if (ndp.lifestealPct) p.lifesteal = (p.lifesteal || 0) + ndp.lifestealPct * mult;
        if (ndp.dodge) p.dodge = (p.dodge || 0) + ndp.dodge * mult;
        if (ndp.damageReduction) p.damageReduction = (p.damageReduction || 0) + ndp.damageReduction * mult;
    }
    // 深渊神兽品种被动加成（只对深渊神兽生效，按品种说明粗略解析攻击/防御/生命/闪避/爆伤加成）
    if (pet.isDivine && pet.speciesDesc && typeof pet.speciesDesc === 'string') {
        var d = pet.speciesDesc;
        function parsePct(keyword) {
            var re = new RegExp(keyword + '\\\\s*([0-9]+)%');
            var m = d.match(re);
            return m ? parseFloat(m[1]) || 0 : 0;
        }
        var atkPct = parsePct('攻击');
        var defPct = parsePct('防御');
        var hpPct = parsePct('生命');
        var dodgePct = parsePct('闪避');
        var critDmgPct = parsePct('爆伤');
        if (atkPct) p.atk = Math.floor(p.atk * (1 + atkPct / 100));
        if (defPct) p.def = Math.floor(p.def * (1 + defPct / 100));
        if (hpPct) p.maxHp = Math.floor(p.maxHp * (1 + hpPct / 100));
        if (dodgePct) p.dodge = (p.dodge || 0) + dodgePct;
        if (critDmgPct) p.critDmg = (p.critDmg || 0) + critDmgPct;
    }
    // 宠物与深渊神兽闪避上限 70%，超出部分按 1:1 转化为宠物爆伤
    if (p.dodge != null && p.dodge > 70) {
        var extraDodge = p.dodge - 70;
        p.dodge = 70;
        p.critDmg = (p.critDmg || 0) + extraDodge;
    }
    // 宠物与深渊神兽闪避上限 70%，超出部分按 1:1 转化为宠物爆伤
    if (p.dodge != null && p.dodge > 70) {
        var extraDodge = p.dodge - 70;
        p.dodge = 70;
        p.critDmg = (p.critDmg || 0) + extraDodge;
    }
    var vB = abyssCalcVaultBonuses();
    if (vB.petAtkPct) p.atk = Math.floor(p.atk * (1 + vB.petAtkPct / 100));
    if (vB.petDefPct) p.def = Math.floor(p.def * (1 + vB.petDefPct / 100));
    if (vB.petHpPct) p.maxHp = Math.floor(p.maxHp * (1 + vB.petHpPct / 100));
    var at = getAbyssTower();
    var vault = at.abyssVault || {};
    var petAtkFlat = 0, petDefFlat = 0, petHpFlat = 0;
    ABYSS_VAULT_TREASURES.forEach(function(t) {
        var c = vault[t.id] || 0;
        if (c <= 0) return;
        var e = t.effect;
        if (e.type === 'petAtkVaultFlat') petAtkFlat += e.value * c;
        else if (e.type === 'petDefVaultFlat') petDefFlat += e.value * c;
        else if (e.type === 'petHpVaultFlat') petHpFlat += e.value * c;
    });
    if (petAtkFlat) p.atk = (p.atk || 0) + petAtkFlat;
    if (petDefFlat) p.def = (p.def || 0) + petDefFlat;
    if (petHpFlat) p.maxHp = (p.maxHp || 0) + petHpFlat;
    var petEq = pet.equipment || {};
    if (petEq['项圈'] && petEq['项圈'].atkPct) p.atk = Math.floor(p.atk * (1 + petEq['项圈'].atkPct / 100));
    if (petEq['护腕'] && petEq['护腕'].defPct) p.def = Math.floor(p.def * (1 + petEq['护腕'].defPct / 100));
    if (petEq['铠甲'] && petEq['铠甲'].hpPct) p.maxHp = Math.floor(p.maxHp * (1 + petEq['铠甲'].hpPct / 100));
    var equipSkills = (pet.skills || []).slice();
    if (petEq['项圈'] && petEq['项圈'].skill) equipSkills.push(petEq['项圈'].skill);
    if (petEq['护腕'] && petEq['护腕'].skill) equipSkills.push(petEq['护腕'].skill);
    if (petEq['铠甲'] && petEq['铠甲'].skill) equipSkills.push(petEq['铠甲'].skill);
    for (var esi = 0; esi < equipSkills.length; esi++) {
        var sk = null;
        for (var j = 0; j < ABYSS_PET_SKILLS.length; j++) {
            if (ABYSS_PET_SKILLS[j].id === equipSkills[esi].id) { sk = ABYSS_PET_SKILLS[j]; break; }
        }
        if (sk) {
            if (sk.atkBonus) p.atk = Math.floor(p.atk * (1 + sk.atkBonus));
            if (sk.defBonus) p.def = Math.floor(p.def * (1 + sk.defBonus));
        }
    }
    if (abyssRun && (abyssRun.playerClass === 'tamer' || abyssRun.playerClass === 'riftbinder')) {
        var clsId = abyssRun.playerClass === 'riftbinder' ? 'riftbinder' : 'tamer';
        var cls = ABYSS_CLASSES.find(function(x) { return x.id === clsId; });
        if (cls) {
            if (cls.petAtkPct) p.atk = Math.floor(p.atk * (1 + cls.petAtkPct / 100));
            if (cls.petDefPct) p.def = Math.floor(p.def * (1 + cls.petDefPct / 100));
            if (cls.petHpPct) p.maxHp = Math.floor(p.maxHp * (1 + cls.petHpPct / 100));
            if (cls.petBonusMult) { p.atk = Math.floor(p.atk * cls.petBonusMult); p.def = Math.floor(p.def * cls.petBonusMult); p.maxHp = Math.floor(p.maxHp * cls.petBonusMult); }
        }
    }
    /* 联网深渊神器：宠物属性加成在无限深渊中对应深渊宠物 */
    if (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken()) {
        if (typeof getNetworkArtifactPetAtkPct === 'function' && getNetworkArtifactPetAtkPct()) p.atk = Math.floor(p.atk * (1 + getNetworkArtifactPetAtkPct() / 100));
        if (typeof getNetworkArtifactPetDefPct === 'function' && getNetworkArtifactPetDefPct()) p.def = Math.floor(p.def * (1 + getNetworkArtifactPetDefPct() / 100));
        if (typeof getNetworkArtifactPetHpPct === 'function' && getNetworkArtifactPetHpPct()) p.maxHp = Math.floor(p.maxHp * (1 + getNetworkArtifactPetHpPct() / 100));
        if (typeof getNetworkArtifactPetCritRatePct === 'function' && getNetworkArtifactPetCritRatePct()) p.critRate = (p.critRate || 0) + getNetworkArtifactPetCritRatePct();
        if (typeof getNetworkArtifactPetCritDmgPct === 'function' && getNetworkArtifactPetCritDmgPct()) p.critDmg = (p.critDmg || 0) + getNetworkArtifactPetCritDmgPct();
    }
    p.atk = Math.max(1, p.atk);
    p.def = Math.max(0, p.def);
    p.maxHp = Math.max(50, p.maxHp);
    p.dodge = Math.min(75, (p.dodge || 0));
    pet.maxHp = p.maxHp;
    if (abyssRun) { abyssRun._petStatsCache = abyssRun._petStatsCache || {}; abyssRun._petStatsCache[key] = p; }
    return p;
}

// 多来源人物回合增益：用于区分战吼、奥秘变身等不同技能的持续时间
// 设计目标：
// 1）升级/奇遇/商店等“永久加成”始终保存在 abyssRun.buffs 里，不会被技能计算清零或放大
// 2）战吼、奥秘变身等“回合技能”通过 buffSources 临时叠加，回合结束/持续回合数用尽后正确消失
// 实现思路：
// - skillTotals：上一轮根据 buffSources 叠加到属性上的“技能部分”
// - perm = 当前 buffs − skillTotals（>=0）：推回得到当前的永久部分
// - 本轮重新统计 buffSources 得到 newSkillTotals，再写回 buffs = perm + newSkillTotals
var ABYSS_BUFF_SOURCES_MAX = 120;
function abyssRecalcBuffsFromSources() {
    if (!abyssRun) return;
    var sources = abyssRun.buffSources || [];
    // 移除已过期的 buff 源，防止数组无限增长（内存泄漏）
    abyssRun.buffSources = sources.filter(function(s) { return s && s.roundsLeft != null && s.roundsLeft > 0; });
    if (abyssRun.buffSources.length > ABYSS_BUFF_SOURCES_MAX) abyssRun.buffSources = abyssRun.buffSources.slice(-ABYSS_BUFF_SOURCES_MAX);
    sources = abyssRun.buffSources;

    // 统计本轮所有技能来源带来的临时百分比加成
    var srcAtk = 0, srcDef = 0, srcHp = 0, srcCritRate = 0, srcCritDmg = 0, srcCombo = 0, srcLifesteal = 0;
    for (var i = 0; i < sources.length; i++) {
        var s = sources[i];
        if (!s || s.roundsLeft == null || s.roundsLeft <= 0) continue;
        srcAtk      += s.atkPct   || 0;
        srcDef      += s.defPct   || 0;
        srcHp       += s.hpPct    || 0;
        srcCritRate += s.critRate || 0;
        srcCritDmg  += s.critDmg  || 0;
        srcCombo    += s.combo    || 0;
        srcLifesteal += s.lifestealPct || 0;
    }

    abyssRun.buffs = abyssRun.buffs || {};
    // 上一轮已叠加到属性上的“技能部分”（第一次默认为 0）
    var lastSkill = abyssRun.skillBuffTotals || { atkPct: 0, defPct: 0, hpPct: 0, critRate: 0, critDmg: 0, combo: 0, lifestealPct: 0 };
    var b = abyssRun.buffs;

    // 先从当前 buffs 中扣掉上一轮技能部分，还原出“永久部分”（升级/奇遇/商店等）
    var permAtk      = Math.max(0, (b.atkPct      || 0) - (lastSkill.atkPct      || 0));
    var permDef      = Math.max(0, (b.defPct      || 0) - (lastSkill.defPct      || 0));
    var permHp       = Math.max(0, (b.hpPct       || 0) - (lastSkill.hpPct       || 0));
    var permCritRate = Math.max(0, (b.critRate    || 0) - (lastSkill.critRate    || 0));
    var permCritDmg  = Math.max(0, (b.critDmg     || 0) - (lastSkill.critDmg     || 0));
    var permCombo    = Math.max(0, (b.combo       || 0) - (lastSkill.combo       || 0));
    var permLifesteal = Math.max(0, (b.lifestealPct || 0) - (lastSkill.lifestealPct || 0));

    // 记录本轮技能合计，用于下一轮做“当前 buffs − 上一轮技能”还原永久部分
    abyssRun.skillBuffTotals = {
        atkPct: srcAtk,
        defPct: srcDef,
        hpPct: srcHp,
        critRate: srcCritRate,
        critDmg: srcCritDmg,
        combo: srcCombo,
        lifestealPct: srcLifesteal
    };

    // 重新写回 buffs = 永久部分 + 本轮技能部分；若结果为 0 则删除 key，避免 UI 出现 NaN
    var finalAtk      = permAtk      + srcAtk;
    var finalDef      = permDef      + srcDef;
    var finalHp       = permHp       + srcHp;
    var finalCritRate = permCritRate + srcCritRate;
    var finalCritDmg  = permCritDmg  + srcCritDmg;
    var finalCombo    = permCombo    + srcCombo;
    var finalLifesteal = permLifesteal + srcLifesteal;

    if (finalAtk)      abyssRun.buffs.atkPct   = finalAtk;      else delete abyssRun.buffs.atkPct;
    if (finalDef)      abyssRun.buffs.defPct   = finalDef;      else delete abyssRun.buffs.defPct;
    if (finalHp)       abyssRun.buffs.hpPct    = finalHp;       else delete abyssRun.buffs.hpPct;
    if (finalCritRate) abyssRun.buffs.critRate = finalCritRate; else delete abyssRun.buffs.critRate;
    if (finalCritDmg)  abyssRun.buffs.critDmg  = finalCritDmg;  else delete abyssRun.buffs.critDmg;
    if (finalCombo)    abyssRun.buffs.combo    = finalCombo;    else delete abyssRun.buffs.combo;
    if (finalLifesteal) abyssRun.buffs.lifestealPct = finalLifesteal; else delete abyssRun.buffs.lifestealPct;
}

var ABYSS_TAMER_BOUND_SKILL_ID = 'tamer_revive_pet';
var ABYSS_WARRIOR_BOUND_SKILL_ID = 'war_summon_wangcai';
var ABYSS_ONMYOJI_BOUND_SKILL_ID = 'onmyo_heal_summon';
var ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID = 'onmyo_shield_summon';
var ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID = 'onmyo_sacrifice_summon';
var ABYSS_MAGE_BOUND_SKILL_ID = 'mage_mystery_transform';
var ABYSS_MAGE_BOUND_SKILL_ID2 = 'mage_tempt_light';
var ABYSS_ARCHER_BOUND_SKILL_ID = 'archer_trap_bind';
// 机械师专属绑定技能：召唤机器人 / 机甲形态 / 自爆指令（固定在第4/5/6技能槽，不用学习且不可卸下）
var ABYSS_MECHANIC_BOUND_SKILL_ID = 'mech_summon_bot';
var ABYSS_MECHANIC_BOUND_SKILL_ID2 = 'mech_transform';
var ABYSS_MECHANIC_BOUND_SKILL_ID3 = 'mech_self_destruct';
var ABYSS_JESTER_BOUND_SKILL_ID = 'exclusive_jester_fate_play';
var ABYSS_JESTER_BOUND_SKILL_ID2 = 'exclusive_jester_fate_puppet';
var ABYSS_RIFTBINDER_BOUND_SKILL_ID = 'rift_bound_oath';
var ABYSS_RIFTBINDER_BOUND_SKILL_ID2 = 'rift_bound_armor';
var ABYSS_RIFTBINDER_BOUND_SKILL_ID3 = 'rift_bound_mirror';
function abyssGetSkillSlotCount() {
    if (!abyssRun) return 3;
    if (abyssRun.playerClass === 'mechanic') return 6;
    if (abyssRun.playerClass === 'onmyoji') return 6;
    if (abyssRun.playerClass === 'riftbinder') return 6;
    if (abyssRun.playerClass === 'mage') return 5;
    if (abyssRun.playerClass === 'jester') return 5;
    return (abyssRun.playerClass === 'tamer' || abyssRun.playerClass === 'warrior' || abyssRun.playerClass === 'archer') ? 4 : 3;
}
function abyssIsBoundSkillSlot(slotIndex) {
    if (!abyssRun) return false;
    return (abyssRun.playerClass === 'tamer' && slotIndex === 3) ||
        (abyssRun.playerClass === 'warrior' && slotIndex === 3) ||
        (abyssRun.playerClass === 'mage' && (slotIndex === 3 || slotIndex === 4)) ||
        (abyssRun.playerClass === 'archer' && slotIndex === 3) ||
        (abyssRun.playerClass === 'onmyoji' && (slotIndex === 3 || slotIndex === 4 || slotIndex === 5)) ||
        (abyssRun.playerClass === 'mechanic' && (slotIndex === 3 || slotIndex === 4 || slotIndex === 5)) ||
        (abyssRun.playerClass === 'riftbinder' && (slotIndex === 3 || slotIndex === 4 || slotIndex === 5)) ||
        (abyssRun.playerClass === 'jester' && (slotIndex === 3 || slotIndex === 4));
}
function abyssGetBoundSkillIdForClass(classId, slotIndex) {
    if (classId === 'tamer') return ABYSS_TAMER_BOUND_SKILL_ID;
    if (classId === 'warrior' && slotIndex === 3) return ABYSS_WARRIOR_BOUND_SKILL_ID;
    if (classId === 'mage') {
        if (slotIndex === 3) return ABYSS_MAGE_BOUND_SKILL_ID;
        if (slotIndex === 4) return ABYSS_MAGE_BOUND_SKILL_ID2;
    }
    if (classId === 'archer' && slotIndex === 3) return ABYSS_ARCHER_BOUND_SKILL_ID;
    if (classId === 'onmyoji') {
        if (slotIndex === 3) return ABYSS_ONMYOJI_BOUND_SKILL_ID;
        if (slotIndex === 4) return ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID;
        if (slotIndex === 5) return ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID;
    }
    if (classId === 'mechanic') {
        if (slotIndex === 3) return ABYSS_MECHANIC_BOUND_SKILL_ID;
        if (slotIndex === 4) return ABYSS_MECHANIC_BOUND_SKILL_ID2;
        if (slotIndex === 5) return ABYSS_MECHANIC_BOUND_SKILL_ID3;
    }
    if (classId === 'jester') {
        if (slotIndex === 3) return ABYSS_JESTER_BOUND_SKILL_ID;
        if (slotIndex === 4) return ABYSS_JESTER_BOUND_SKILL_ID2;
    }
    if (classId === 'riftbinder') {
        if (slotIndex === 3) return ABYSS_RIFTBINDER_BOUND_SKILL_ID;
        if (slotIndex === 4) return ABYSS_RIFTBINDER_BOUND_SKILL_ID2;
        if (slotIndex === 5) return ABYSS_RIFTBINDER_BOUND_SKILL_ID3;
    }
    return null;
}
function abyssGetMaxDeployedSlots() {
    var at = getAbyssTower();
    var base = 1 + Math.min(3, at.deployedSlotsPurchases || 0);
    if (abyssRun && abyssRun.playerClass === 'tamer') base += 1;
    return base;
}
function abyssIsPetCombatAlive(p) {
    if (!p) return false;
    if (p.hp === null || p.hp === undefined) return true;
    if (typeof bLteZero === 'function' && typeof p.hp === 'string' && /e/i.test(String(p.hp))) return !bLteZero(p.hp);
    return p.hp > 0;
}
function abyssGetAliveBeastSummons() {
    var beasts = (abyssRun && abyssRun.beastSummons) || [];
    return beasts.filter(function(b) { return b && b.hp > 0; });
}
/** 守护开启时：决定怪物伤害由玩家/出战宠/召唤兽谁承担（普攻与可重定向技能共用） */
function abyssResolveGuardDamageTargets(taken, m) {
    var deployedForHit = abyssGetDeployedPets().filter(abyssIsPetCombatAlive);
    var pet2 = deployedForHit.length > 0 ? deployedForHit[Math.floor(Math.random() * deployedForHit.length)] : null;
    var aliveBeasts = abyssGetAliveBeastSummons();
    var attackBeast = false;
    var attackPet = false;
    if (abyssRun.petGuard) {
        if (pet2) attackPet = true;
        else if (aliveBeasts.length > 0) attackBeast = true;
    } else {
        attackBeast = aliveBeasts.length > 0 && Math.random() < 0.5;
        attackPet = !attackBeast && pet2 && Math.random() < 0.5;
    }
    if (m && m.skills && pet2) {
        for (var phi = 0; phi < m.skills.length; phi++) {
            if (m.skills[phi].id === 'petHate' && Math.random() < (m.skills[phi].petHateChance || 0.85)) {
                attackPet = true;
                attackBeast = false;
                abyssLog(m.name + ' 仇宠，锁定宠物！');
                break;
            }
        }
    }
    return {
        deployedForHit: deployedForHit,
        pet2: pet2,
        aliveBeasts: aliveBeasts,
        attackPet: attackPet,
        attackBeast: attackBeast,
        takenPlayer: (attackBeast || attackPet) ? 0 : taken,
        takenPet: attackPet ? taken : 0,
        takenBeast: attackBeast && aliveBeasts.length > 0 ? taken : 0
    };
}
function abyssGetDeployedPets() {
    if (!abyssRun) return [];
    var noPetTrial = abyssRun.trialId === 'noPet' && abyssRun.trialRoundsLeft > 0;
    if (!abyssRun.deployedPetIds && abyssRun.deployedPetId) {
        abyssRun.deployedPetIds = [abyssRun.deployedPetId];
    }
    var out = [];
    var seen = {};
    var pets = abyssRun.pets || [];
    for (var d = 0; d < pets.length; d++) {
        if (pets[d].isDivine) {
            var did = pets[d].id || ('p' + d);
            if (!seen[did]) { seen[did] = true; out.push(pets[d]); }
        }
    }
    if (noPetTrial) return out;
    var dep = abyssRun.deployedPetIds || [];
    for (var i = 0; i < dep.length; i++) {
        for (var j = 0; j < pets.length; j++) {
            if (pets[j].id === dep[i]) {
                var pid = pets[j].id || ('p' + j);
                if (!seen[pid]) { seen[pid] = true; out.push(pets[j]); }
                break;
            }
        }
    }
    return out;
}
function abyssGetDeployedPet() {
    var list = abyssGetDeployedPets();
    return list.length > 0 ? list[0] : null;
}
function abyssIsPetDeployed(petId) {
    if (!abyssRun || !abyssRun.pets) return false;
    for (var i = 0; i < abyssRun.pets.length; i++) {
        if (abyssRun.pets[i].id === petId) return !!abyssRun.pets[i].isDivine || (abyssRun.deployedPetIds && abyssRun.deployedPetIds.indexOf(petId) >= 0);
    }
    return abyssRun.deployedPetIds && abyssRun.deployedPetIds.indexOf(petId) >= 0;
}

function abyssPetExpToNext(level) { return 50; }

function abyssPetGainExp(exp) {
    var deployedList = abyssGetDeployedPets();
    if (!deployedList.length) return;
    var runLevel = Math.max(1, Math.floor((abyssRun.exp || 0) / 100));
    for (var gi = 0; gi < deployedList.length; gi++) {
        var pet = deployedList[gi];
        pet.exp = (pet.exp || 0) + exp;
        while (pet.exp >= 50 && (pet.level || 1) < runLevel) {
            pet.exp -= 50;
            pet.level = (pet.level || 1) + 1;
            abyssLog('宠物【' + pet.name + '】升级至 Lv.' + pet.level + '！');
        }
        if ((pet.level || 1) >= runLevel && pet.exp > 0) pet.exp = Math.min(pet.exp, 49);
    }
}

var ABYSS_BOSS_SKILLS = [
    { id: 'multiHit', name: '多段攻击', chance: 0.36, multi: 2.4 },
    { id: 'halfDamage', name: '减伤', rate: 0.46, maxRate: 0.76 },
    { id: 'lifesteal', name: '吸血', rate: 0.16 },
    { id: 'rage', name: '狂暴', atkBonus: 0.58 },
    { id: 'armorBreak', name: '破甲', defIgnore: 0.42 },
    { id: 'doubleStrike', name: '二连击', chance: 0.30, multi: 2.4 },
    { id: 'tripleStrike', name: '三连击', chance: 0.20, multi: 3.4 },
    { id: 'execute', name: '处决', lowHpThreshold: 0.3, dmgBonus: 0.72 },
    { id: 'crush', name: '碾压', dmgBonus: 0.36 },
    { id: 'ignite', name: '灼烧', dotRate: 0.08 },
    { id: 'heavyStrike', name: '重击', chance: 0.34, dmgMult: 1.85 },
    { id: 'bloodthirst', name: '嗜血', atkBonusPerMissing: 0.68 },
    { id: 'shield', name: '护盾', shieldPct: 0.29 },
    { id: 'intimidate', name: '威压', dmgReduce: 0.22 },
    { id: 'bleed', name: '流血', extraDmg: 0.08 },
    { id: 'curse', name: '诅咒', defIgnore: 0.16 },
    { id: 'freeze', name: '冰冻', chance: 0.18, multi: 2.4 },
    { id: 'venom', name: '毒液', dmgBonus: 0.16 },
    { id: 'revive', name: '复活', revivePct: 0.34 },
    { id: 'multiHit', name: '连击', chance: 0.30, multi: 2.4 },
    { id: 'armorBreak', name: '碎甲', defIgnore: 0.36 },
    { id: 'rage', name: '狂怒', atkBonus: 0.50 },
    { id: 'doubleStrike', name: '双斩', chance: 0.26, multi: 2.4 },
    { id: 'execute', name: '斩杀', lowHpThreshold: 0.25, dmgBonus: 0.82 },
    { id: 'crush', name: '粉碎', dmgBonus: 0.29 },
    { id: 'heavyStrike', name: '猛击', chance: 0.30, dmgMult: 1.75 },
    { id: 'bloodthirst', name: '渴血', atkBonusPerMissing: 0.62 },
    { id: 'shield', name: '铁壁', shieldPct: 0.22 },
    { id: 'intimidate', name: '震慑', dmgReduce: 0.18 },
    { id: 'bleed', name: '撕裂', extraDmg: 0.12 },
    { id: 'curse', name: '虚弱', defIgnore: 0.22 },
    { id: 'freeze', name: '寒霜', chance: 0.16, multi: 2.4 },
    { id: 'venom', name: '剧毒', dmgBonus: 0.22 },
    { id: 'tripleStrike', name: '三连斩', chance: 0.16, multi: 3.4 },
    { id: 'multiHit', name: '疾风', chance: 0.32, multi: 2.4 },
    { id: 'armorBreak', name: '穿甲', defIgnore: 0.40 },
    { id: 'execute', name: '终结', lowHpThreshold: 0.35, dmgBonus: 0.64 },
    { id: 'shield', name: '屏障', shieldPct: 0.27 },
    { id: 'bossSummon', name: '深渊召唤', chance: 0.24, summonCount: 2, summonPct: 0.12 },
    /* ========== 10层+ 进阶技能 ========== */
    { id: 'quadrupleStrike', name: '四连斩', chance: 0.14, multi: 4.2, minTier: 1 },
    { id: 'execute', name: '裂魂', lowHpThreshold: 0.2, dmgBonus: 0.94, minTier: 1 },
    { id: 'crush', name: '泰坦之握', dmgBonus: 0.44, minTier: 1 },
    { id: 'shield', name: '邪能护甲', shieldPct: 0.33, minTier: 1 },
    { id: 'rage', name: '暴君之怒', atkBonus: 0.66, minTier: 1 },
    { id: 'armorBreak', name: '破城', defIgnore: 0.50, minTier: 1 },
    { id: 'intimidate', name: '深渊凝视', dmgReduce: 0.28, minTier: 1 },
    { id: 'heavyStrike', name: '崩山', chance: 0.38, dmgMult: 2.0, minTier: 1 },
    { id: 'bloodthirst', name: '噬生', atkBonusPerMissing: 0.77, minTier: 1 },
    { id: 'lifesteal', name: '生命汲取', rate: 0.24, minTier: 1 },
    { id: 'ignite', name: '业火', dotRate: 0.10, minTier: 1 },
    { id: 'bossSummon', name: '召唤仆从', chance: 0.32, summonCount: 2, summonPct: 0.17, minTier: 1 },
    /* ========== 20层+ 高阶技能 ========== */
    { id: 'quadrupleStrike', name: '乱舞', chance: 0.17, multi: 4.2, minTier: 2 },
    { id: 'execute', name: '死愿', lowHpThreshold: 0.18, dmgBonus: 1.04, minTier: 2 },
    { id: 'halfDamage', name: '霸体', rate: 0.22, maxRate: 0.78, minTier: 2 },
    { id: 'freeze', name: '深渊吐息', chance: 0.22, multi: 2.7, minTier: 2 },
    { id: 'venom', name: '毒心', dmgBonus: 0.31, minTier: 2 },
    { id: 'bleed', name: '裂伤', extraDmg: 0.17, minTier: 2 },
    { id: 'curse', name: '腐化印记', defIgnore: 0.31, minTier: 2 },
    { id: 'doubleStrike', name: '双生斩', chance: 0.34, multi: 2.6, minTier: 2 },
    { id: 'tripleStrike', name: '三劫', chance: 0.22, multi: 3.7, minTier: 2 },
    { id: 'rage', name: '二阶段', atkBonus: 0.60, rageThreshold: 0.5, minTier: 2 },
    { id: 'revive', name: '不灭', revivePct: 0.44, minTier: 2 },
    { id: 'lifesteal', name: '血宴', rate: 0.31, minTier: 2 },
    { id: 'ignite', name: '永燃', dotRate: 0.13, minTier: 2 },
    { id: 'bossSummon', name: '召唤精英', chance: 0.28, summonCount: 2, summonPct: 0.22, minTier: 2 },
    /* ========== 30层+ 深渊专属 ========== */
    { id: 'quadrupleStrike', name: '万象崩灭', chance: 0.20, multi: 4.5, minTier: 3 },
    { id: 'execute', name: '终焉', lowHpThreshold: 0.15, dmgBonus: 1.20, minTier: 3 },
    { id: 'halfDamage', name: '深渊之肤', rate: 0.31, maxRate: 0.82, minTier: 3 },
    { id: 'shield', name: '虚空壁垒', shieldPct: 0.38, minTier: 3 },
    { id: 'intimidate', name: '神威', dmgReduce: 0.33, minTier: 3 },
    { id: 'armorBreak', name: '碎界', defIgnore: 0.55, minTier: 3 },
    { id: 'heavyStrike', name: '天崩', chance: 0.40, dmgMult: 2.15, minTier: 3 },
    { id: 'bloodthirst', name: '献祭', atkBonusPerMissing: 0.93, minTier: 3 },
    { id: 'lifesteal', name: '夺魂', rate: 0.38, minTier: 3 },
    { id: 'ignite', name: '炼狱', dotRate: 0.17, minTier: 3 },
    { id: 'freeze', name: '永冻', chance: 0.24, multi: 3.0, minTier: 3 },
    { id: 'revive', name: '轮回', revivePct: 0.55, minTier: 3 },
    { id: 'bossSummon', name: '深渊军团', chance: 0.38, summonCount: 3, summonPct: 0.20, minTier: 3 },
    /* ========== 40层+ 传说技能 ========== */
    { id: 'execute', name: '弑神', lowHpThreshold: 0.12, dmgBonus: 1.38, minTier: 4 },
    { id: 'quadrupleStrike', name: '万剑归宗', chance: 0.22, multi: 4.9, minTier: 4 },
    { id: 'halfDamage', name: '不朽', rate: 0.38, maxRate: 0.84, minTier: 4 },
    { id: 'rage', name: '灭世', atkBonus: 0.82, minTier: 4 },
    { id: 'lifesteal', name: '永生', rate: 0.44, minTier: 4 },
    { id: 'bossSummon', name: '深渊主宰', chance: 0.44, summonCount: 3, summonPct: 0.25, minTier: 4 },
    /* ========== 20个特色技能（与众不同） ========== */
    { id: 'mpSteal', name: '夺魂', mpStealPct: 0.22 },
    { id: 'silence', name: '静默', silenceChance: 0.33, silenceRounds: 1 },
    { id: 'hitAll', name: '崩裂', hitAllPct: 0.60 },
    { id: 'counterStrike', name: '复仇', counterMaxHpPct: 0.1 },
    { id: 'phaseAtHp', name: '蜕皮', phaseAtkBonus: 0.44 },
    { id: 'shieldOnHit', name: '噬能护甲', shieldOnHitPct: 0.14 },
    { id: 'firstStrike', name: '先制', firstStrikeMult: 1.75 },
    { id: 'lastStand', name: '死志', lastStandThreshold: 0.15 },
    { id: 'surviveOneDeath', name: '不溃' },
    { id: 'enrageAtRounds', name: '狂乱', enrageRound: 3, enrageMult: 1.6 },
    { id: 'lifesteal', name: '血契', rate: 0.35 },
    { id: 'revive', name: '魂牢', revivePct: 0.50 },
    { id: 'execute', name: '湮灭', lowHpThreshold: 0.12, dmgBonus: 1.10 },
    { id: 'armorBreak', name: '破势', defIgnore: 0.52 },
    { id: 'halfDamage', name: '永劫', rate: 0.28, maxRate: 0.80 },
    { id: 'bloodthirst', name: '噬梦', atkBonusPerMissing: 0.86 },
    { id: 'shield', name: '虚空障壁', shieldPct: 0.35 },
    { id: 'intimidate', name: '咒缚', dmgReduce: 0.31 },
    { id: 'revive', name: '终末', revivePct: 0.60 },
    /* ========== 新增20个与众不同的BOSS特色技能 ========== */
    { id: 'timeStop', name: '时空凝滞', chance: 0.24, skipTurns: 1 },
    { id: 'soulDrain', name: '魂噬', dotMaxHpPct: 0.045, dotRounds: 2 },
    { id: 'curseMark', name: '咒印', stackDmgPerHit: 0.07, stackMax: 0.33 },
    { id: 'stealBuff', name: '掠夺', stealBuffChance: 0.38 },
    { id: 'deathAura', name: '死域', healOnAllyHitPct: 0.035 },
    { id: 'healReduce', name: '锁链', healReducePct: 0.38 },
    { id: 'voidTouch', name: '湮灭之触', missingHpDmgPct: 0.28 },
    { id: 'foresight', name: '预知', dodgeBonus: 20 },
    { id: 'deathCurse', name: '怨念', deathDmgMaxHpPct: 0.14 },
    { id: 'mirrorImage', name: '幻身', chance: 0.20, imagePct: 0.22 },
    { id: 'bloodPrice', name: '血偿', selfHpCostPct: 0.08, atkBonus: 0.55 },
    { id: 'entropy', name: '熵增', chaosChance: 0.28 },
    { id: 'soulLink', name: '魂链', damageSharePct: 0.17 },
    { id: 'abyssGaze', name: '深渊凝视', blindChance: 0.22, blindRounds: 1 },
    { id: 'boneArmor', name: '骨甲', armorPerHit: 6, armorCap: 88 },
    { id: 'manaBurn', name: '燃魔', burnPct: 0.20 },
    { id: 'fear', name: '恐惧', fearChance: 0.17, skipAttackChance: 0.52 },
    { id: 'corrupt', name: '腐化', corruptHealPct: 0.22 },
    { id: 'overwhelm', name: '碾压意志', overwhelmDefIgnore: 0.44 },
    /* ========== 10层+ 额外BOSS技能（在必带之外额外池） ========== */
    { id: 'multiHit', name: '裂空斩', chance: 0.34, multi: 2.8, minTier: 1 },
    { id: 'doubleStrike', name: '影袭', chance: 0.32, multi: 2.7, minTier: 1 },
    { id: 'tripleStrike', name: '鬼刃三连', chance: 0.22, multi: 3.6, minTier: 1 },
    { id: 'heavyStrike', name: '碎星', chance: 0.40, dmgMult: 2.05, minTier: 1 },
    { id: 'execute', name: '夺命', lowHpThreshold: 0.22, dmgBonus: 0.88, minTier: 1 },
    { id: 'armorBreak', name: '穿心', defIgnore: 0.52, minTier: 1 },
    { id: 'rage', name: '魔化', atkBonus: 0.64, minTier: 1 },
    { id: 'lifesteal', name: '血祭', rate: 0.27, minTier: 1 },
    { id: 'shield', name: '暗影护体', shieldPct: 0.31, minTier: 1 },
    { id: 'intimidate', name: '魔威', dmgReduce: 0.29, minTier: 1 },
    { id: 'ignite', name: '冥炎', dotRate: 0.11, minTier: 1 },
    { id: 'bleed', name: '撕裂', extraDmg: 0.16, minTier: 1 },
    { id: 'curse', name: '衰亡印记', defIgnore: 0.29, minTier: 1 },
    { id: 'freeze', name: '极寒冲击', chance: 0.20, multi: 2.8, minTier: 1 },
    { id: 'venom', name: '蚀骨毒', dmgBonus: 0.29, minTier: 1 },
    { id: 'crush', name: '崩灭', dmgBonus: 0.46, minTier: 1 },
    { id: 'bloodthirst', name: '狂嗜', atkBonusPerMissing: 0.79, minTier: 1 },
    { id: 'revive', name: '亡语', revivePct: 0.38, minTier: 1 },
    { id: 'halfDamage', name: '魔躯', rate: 0.24, maxRate: 0.78, minTier: 1 },
    { id: 'soulDrain', name: '噬魂', dotMaxHpPct: 0.05, dotRounds: 2, minTier: 1 },
    { id: 'voidTouch', name: '虚空侵蚀', missingHpDmgPct: 0.24, minTier: 1 },
    { id: 'boneArmor', name: '骸骨壁垒', armorPerHit: 7, armorCap: 98, minTier: 1 },
    { id: 'fear', name: '战栗', fearChance: 0.20, skipAttackChance: 0.48, minTier: 1 },
    { id: 'entropy', name: '混沌一击', chaosChance: 0.31, minTier: 1 }
];

var ABYSS_NORMAL_MONSTER_SKILLS = [
    { id: 'multiHit', name: '小连击', chance: 0.18, multi: 2.2 },
    { id: 'armorBreak', name: '轻破甲', defIgnore: 0.18 },
    { id: 'rage', name: '微怒', atkBonus: 0.22 },
    { id: 'doubleStrike', name: '二连', chance: 0.15, multi: 2.2 },
    { id: 'execute', name: '补刀', lowHpThreshold: 0.2, dmgBonus: 0.34 },
    { id: 'crush', name: '重压', dmgBonus: 0.14 },
    { id: 'heavyStrike', name: '敲击', chance: 0.18, dmgMult: 1.4 },
    { id: 'bloodthirst', name: '饥渴', atkBonusPerMissing: 0.28 },
    { id: 'shield', name: '薄盾', shieldPct: 0.12 },
    { id: 'intimidate', name: '威吓', dmgReduce: 0.1 },
    { id: 'bleed', name: '擦伤', extraDmg: 0.03 },
    { id: 'curse', name: '弱咒', defIgnore: 0.08 },
    { id: 'freeze', name: '冷气', chance: 0.1, multi: 2.2 },
    { id: 'venom', name: '微毒', dmgBonus: 0.06 },
    { id: 'multiHit', name: '疾打', chance: 0.15, multi: 2.2 },
    { id: 'armorBreak', name: '裂甲', defIgnore: 0.15 },
    { id: 'rage', name: '躁动', atkBonus: 0.18 },
    { id: 'doubleStrike', name: '双打', chance: 0.12, multi: 2.2 },
    { id: 'execute', name: '收尾', lowHpThreshold: 0.25, dmgBonus: 0.28 },
    { id: 'crush', name: '捶打', dmgBonus: 0.12 },
    { id: 'heavyStrike', name: '劈砍', chance: 0.15, dmgMult: 1.35 },
    { id: 'bloodthirst', name: '嗜战', atkBonusPerMissing: 0.24 },
    { id: 'shield', name: '护身', shieldPct: 0.1 },
    { id: 'intimidate', name: '瞪视', dmgReduce: 0.08 },
    { id: 'bleed', name: '划伤', extraDmg: 0.045 },
    { id: 'curse', name: '衰败', defIgnore: 0.09 },
    { id: 'freeze', name: '冰触', chance: 0.08, multi: 2.2 },
    { id: 'venom', name: '毒刺', dmgBonus: 0.07 },
    { id: 'multiHit', name: '快攻', chance: 0.08, multi: 2 },
    { id: 'armorBreak', name: '破防', defIgnore: 0.08 },
    { id: 'rage', name: '暴燥', atkBonus: 0.1 },
    { id: 'doubleStrike', name: '连打', chance: 0.07, multi: 2 },
    { id: 'execute', name: '致命', lowHpThreshold: 0.3, dmgBonus: 0.15 },
    { id: 'crush', name: '撞击', dmgBonus: 0.06 },
    { id: 'heavyStrike', name: '猛敲', chance: 0.08, dmgMult: 1.15 },
    { id: 'bloodthirst', name: '血性', atkBonusPerMissing: 0.15 },
    { id: 'shield', name: '气盾', shieldPct: 0.05 },
    { id: 'intimidate', name: '压迫', dmgReduce: 0.04 },
    { id: 'bleed', name: '割裂', extraDmg: 0.025 },
    { id: 'curse', name: '侵蚀', defIgnore: 0.04 },
    { id: 'freeze', name: '霜冻', chance: 0.04, multi: 2 },
    { id: 'venom', name: '毒牙', dmgBonus: 0.03 },
    { id: 'multiHit', name: '乱打', chance: 0.06, multi: 2 },
    { id: 'armorBreak', name: '削甲', defIgnore: 0.06 },
    { id: 'rage', name: '激怒', atkBonus: 0.08 },
    { id: 'doubleStrike', name: '双击', chance: 0.06, multi: 2 },
    { id: 'heavyStrike', name: '硬击', chance: 0.07, dmgMult: 1.12 },
    { id: 'multiHit', name: '迅爪', chance: 0.09, multi: 2 },
    { id: 'armorBreak', name: '撕咬', defIgnore: 0.07 },
    { id: 'rage', name: '凶性', atkBonus: 0.09 },
    { id: 'doubleStrike', name: '尾扫', chance: 0.065, multi: 2 },
    { id: 'execute', name: '噬喉', lowHpThreshold: 0.22, dmgBonus: 0.18 },
    { id: 'crush', name: '践踏', dmgBonus: 0.07 },
    { id: 'heavyStrike', name: '头槌', chance: 0.09, dmgMult: 1.18 },
    { id: 'bloodthirst', name: '嗜血', atkBonusPerMissing: 0.12 },
    { id: 'shield', name: '甲壳', shieldPct: 0.055 },
    { id: 'intimidate', name: '咆哮', dmgReduce: 0.045 },
    { id: 'bleed', name: '爪痕', extraDmg: 0.022 },
    { id: 'curse', name: '暗蚀', defIgnore: 0.045 },
    { id: 'freeze', name: '寒息', chance: 0.045, multi: 2 },
    { id: 'venom', name: '毒涎', dmgBonus: 0.035 },
    { id: 'multiHit', name: '乱抓', chance: 0.07, multi: 2 },
    { id: 'armorBreak', name: '凿击', defIgnore: 0.065 },
    { id: 'rage', name: '狂性', atkBonus: 0.07 },
    { id: 'doubleStrike', name: '双尾', chance: 0.055, multi: 2 },
    { id: 'execute', name: '掏心', lowHpThreshold: 0.28, dmgBonus: 0.12 },
    { id: 'crush', name: '压顶', dmgBonus: 0.055 },
    { id: 'heavyStrike', name: '尾砸', chance: 0.065, dmgMult: 1.14 },
    { id: 'bloodthirst', name: '渴血', atkBonusPerMissing: 0.1 },
    { id: 'shield', name: '岩肤', shieldPct: 0.045 },
    { id: 'intimidate', name: '凝视', dmgReduce: 0.035 },
    { id: 'bleed', name: '撕扯', extraDmg: 0.02 },
    { id: 'curse', name: '腐化', defIgnore: 0.035 },
    { id: 'freeze', name: '冰牙', chance: 0.04, multi: 2 },
    { id: 'venom', name: '毒雾', dmgBonus: 0.025 },
    { id: 'multiHit', name: '连啄', chance: 0.065, multi: 2 },
    { id: 'armorBreak', name: '破皮', defIgnore: 0.055 },
    { id: 'rage', name: '暴走', atkBonus: 0.065 },
    { id: 'doubleStrike', name: '双爪', chance: 0.05, multi: 2 },
    { id: 'heavyStrike', name: '甩尾', chance: 0.06, dmgMult: 1.1 },
    { id: 'execute', name: '绝杀', lowHpThreshold: 0.35, dmgBonus: 0.1 },
    { id: 'shield', name: '泥甲', shieldPct: 0.04 },
    { id: 'intimidate', name: '威吓', dmgReduce: 0.03 },
    { id: 'bleed', name: '咬伤', extraDmg: 0.018 },
    { id: 'curse', name: '诅咒', defIgnore: 0.03 },
    { id: 'venom', name: '毒液', dmgBonus: 0.02 },
    { id: 'multiHit', name: '扑击', chance: 0.06, multi: 2 },
    { id: 'armorBreak', name: '啃咬', defIgnore: 0.05 },
    { id: 'rage', name: '凶暴', atkBonus: 0.06 },
    { id: 'doubleStrike', name: '二段', chance: 0.048, multi: 2 },
    { id: 'crush', name: '碾压', dmgBonus: 0.05 },
    { id: 'heavyStrike', name: '拍击', chance: 0.055, dmgMult: 1.08 },
    { id: 'bloodthirst', name: '吸血', atkBonusPerMissing: 0.08 },
    { id: 'shield', name: '护膜', shieldPct: 0.035 }
];

function abyssCreateOneMonster(f, isBoss, nameSuffix, baseStats) {
    var baseHp = (baseStats && baseStats.hp) || (500 + f * 78);
    var baseAtk = (baseStats && baseStats.atk) || (30 + f * 6);
    var baseDef = (baseStats && baseStats.def) || (10 + Math.floor(f * 1.9));
    // 普通怪物：基础属性 下浮20% 上浮10%（即 80%～110%）
    if (!isBoss) {
        baseHp *= (0.8 + Math.random() * 0.3);
        baseAtk *= (0.8 + Math.random() * 0.3);
        baseDef *= (0.8 + Math.random() * 0.3);
    }
    var hpPow = 1.068, atkPow = 1.055, defPow = 1.035;
    if (isBoss) {
        baseHp *= 2.15;
        baseAtk *= 1.9;
        baseDef *= 1.5;
        hpPow = 1.068;
        atkPow = 1.058;
        defPow = 1.038;
    }
    var hp = Math.floor(baseHp * Math.pow(hpPow, f - 1));
    var atk = Math.floor(baseAtk * Math.pow(atkPow, f - 1));
    var def = Math.floor(baseDef * Math.pow(defPow, f - 1));
    var prefix = null;
    var prefixes = [];
    var baseName = '';
    var eliteOrChiefScale = 1;
    var rewardMult = 1;
    var tierLabel = '';
    var minSkills = 1;
    if (isBoss) {
        baseName = ABYSS_BOSS_NAMES[Math.floor(Math.random() * ABYSS_BOSS_NAMES.length)] + '·' + f + '层';
    } else {
        var roll = Math.random();
        if (roll < 0.003) {
            tierLabel = '【妖王】';
            eliteOrChiefScale = 1.4;
            rewardMult = 1.5;
            minSkills = 5;
        } else if (roll < 0.008) {
            tierLabel = '【首领】';
            eliteOrChiefScale = 1.35;
            rewardMult = 1.5;
            minSkills = 4;
        } else if (roll < 0.02) {
            tierLabel = '【头目】';
            eliteOrChiefScale = 1.25;
            rewardMult = 1.3;
            minSkills = 3;
        } else if (roll < 0.10) {
            tierLabel = '【精英】';
            eliteOrChiefScale = 1.15;
            rewardMult = 1.3;
            minSkills = 2;
        }
        var pool = ABYSS_MONSTER_PREFIXES.slice();
        prefix = pool[Math.floor(Math.random() * pool.length)];
        prefixes = [prefix];
        baseName = ABYSS_NORMAL_MONSTER_NAMES[Math.floor(Math.random() * ABYSS_NORMAL_MONSTER_NAMES.length)] + '·' + f + '层';
    }
    var monsterName = nameSuffix || (isBoss ? baseName : (tierLabel + (prefix ? prefix.name : '') + baseName));
    var monsterElement = ABYSS_ELEMENTS[Math.floor(Math.random() * ABYSS_ELEMENTS.length)];
    var monsterElementRes = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
    for (var ei = 0; ei < ABYSS_ELEMENTS.length; ei++) {
        var el = ABYSS_ELEMENTS[ei];
        monsterElementRes[el] = Math.min(40, Math.floor(f / 3) + Math.floor(Math.random() * 6));
    }
    var magicRes = isBoss ? Math.min(50, 10 + Math.floor(f / 3) + Math.floor(Math.random() * 13)) : Math.min(40, 5 + Math.floor(f / 4) + Math.floor(Math.random() * 9));
    // 普通怪物：应用前缀词条属性加成（精英/头目再乘额外倍率）
    if (!isBoss && prefix) {
        hp = Math.max(1, Math.floor(hp * (prefix.hpMult || 1) * eliteOrChiefScale));
        atk = Math.max(1, Math.floor(atk * (prefix.atkMult || 1) * eliteOrChiefScale));
        def = Math.max(0, Math.floor(def * (prefix.defMult || 1) * eliteOrChiefScale));
    }
    var baseCrit = 5 + Math.min(25, Math.floor(f / 5));
    var baseDodge = Math.min(15, Math.floor(f / 10));
    var baseLifesteal = Math.min(10, Math.floor(f / 15));
    if (!isBoss && prefix) {
        baseCrit = Math.max(0, baseCrit + (prefix.critRate || 0));
        baseDodge = Math.max(0, Math.min(30, baseDodge + (prefix.dodge || 0)));
        baseLifesteal = Math.max(0, Math.min(25, baseLifesteal + (prefix.lifesteal || 0)));
    }
    var normMultiHit = 0.1;
    if (!isBoss && prefix && prefix.multiHit) normMultiHit += prefix.multiHit;
    var mon = {
        name: monsterName,
        hp: hp, maxHp: hp, atk: atk, def: def, critRate: baseCrit, critDmg: 150, dodge: baseDodge, lifesteal: baseLifesteal, combo: Math.min(15, Math.floor(f / 8)),
        isBoss: isBoss, multiHit: isBoss ? 0.25 : normMultiHit, halfDamage: isBoss ? Math.min(0.65, 0.3 + (f / 10) * 0.02) : 0, skills: [],
        element: monsterElement, elementRes: monsterElementRes, magicRes: magicRes
    };
    if (!isBoss && prefix) {
        if (prefix.welfareReward) mon.welfareReward = prefix.welfareReward;
        if (rewardMult > 1) mon.rewardMult = rewardMult;
    }
    if (isBoss) {
        mon.revived = false;
        mon.summonCount = 0;
        var tier = Math.floor(f / 10);
        if (tier < 1) tier = 1;
        var numNonSummon = 4 + tier;
        var pool = ABYSS_BOSS_SKILLS.filter(function(s) { return (s.minTier || 0) <= tier && s.id !== 'thorns'; });
        if (pool.length === 0) pool = ABYSS_BOSS_SKILLS.filter(function(s) { return s.id !== 'thorns'; });
        var summonPool = pool.filter(function(s) { return s.id === 'bossSummon'; });
        if (summonPool.length > 0) {
            var summonPick = summonPool[Math.floor(Math.random() * summonPool.length)];
            mon.skills.push(summonPick);
            var idxInPool = pool.indexOf(summonPick);
            if (idxInPool >= 0) pool.splice(idxInPool, 1);
        }
        var shieldPool = pool.filter(function(s) { return s.id === 'shield' || s.id === 'shieldOnHit'; });
        if (shieldPool.length > 0) {
            var shieldPick = shieldPool[Math.floor(Math.random() * shieldPool.length)];
            mon.skills.push(shieldPick);
            var idxShield = pool.indexOf(shieldPick);
            if (idxShield >= 0) pool.splice(idxShield, 1);
        }
        var numToPick = Math.min(numNonSummon, pool.length);
        for (var s = 0; s < numToPick && pool.length > 0; s++) {
            var idx = Math.floor(Math.random() * pool.length);
            var picked = pool[idx];
            mon.skills.push(picked);
            pool.splice(idx, 1);
        }
        for (var hdi = 0; hdi < mon.skills.length; hdi++) {
            var hds = mon.skills[hdi];
            if (hds.id === 'halfDamage') {
                mon.halfDamage = Math.min(hds.maxRate != null ? hds.maxRate : 0.8, (mon.halfDamage || 0) + (hds.rate || 0));
                break;
            }
        }
        mon.shield = Math.floor(mon.maxHp * 0.15);
        for (var si = 0; si < mon.skills.length; si++) {
            if (mon.skills[si].id === 'shield' && (mon.skills[si].shieldPct || 0) > 0.15) {
                mon.shield = Math.max(mon.shield, Math.floor(mon.maxHp * (mon.skills[si].shieldPct || 0.2)));
                break;
            }
        }
    } else {
        var numNorm = Math.max(minSkills, 1 + Math.min(5, Math.floor(f / 8)));
        var normPool = ABYSS_NORMAL_MONSTER_SKILLS.filter(function(s) { return s.id !== 'thorns'; });
        for (var sn = 0; sn < numNorm && normPool.length > 0; sn++) {
            var nidx = Math.floor(Math.random() * normPool.length);
            var npick = normPool[nidx];
            mon.skills.push(npick);
            normPool.splice(nidx, 1);
        }
        for (var nsi = 0; nsi < mon.skills.length; nsi++) {
            if (mon.skills[nsi].id === 'shield') {
                mon.shield = Math.floor(mon.maxHp * (mon.skills[nsi].shieldPct || 0.08));
                break;
            }
        }
        if (!mon.shield) mon.shield = 0;
    }
    return mon;
}

/** 联网野生遭遇：战场显示「品质·品种」，如 野生·泡泡、宝宝·泡泡 */
function abyssWildDivineShadowMonsterName(enc) {
    if (!enc) return '神兽之影';
    var ql = enc.previewQualityLabel != null ? String(enc.previewQualityLabel).trim() : '';
    if (!ql) ql = '宝宝';
    var sp = enc.previewSpeciesName != null ? String(enc.previewSpeciesName).trim() : '';
    if (sp) return ql + '·' + sp;
    var pn = enc.previewName != null ? String(enc.previewName).trim() : '';
    if (pn) {
        if (pn.indexOf(ql + '·') === 0) return pn;
        if (pn.indexOf(ql) === 0 && pn.length > ql.length) return pn;
        return ql + '·' + pn;
    }
    return ql + '·神兽之影';
}

function abyssSpawnMonster() {
    if (!abyssRun || !abyssRun.active) return;
    var f = abyssRun.floor;
    var isBoss = (f % 10 === 0);
    abyssRun.monsters = [];
    if (isBoss) {
        abyssRun.monsters.push(abyssCreateOneMonster(f, true));
    } else {
        var count = 1 + Math.floor(Math.random() * 4);
        for (var i = 0; i < count; i++) {
            abyssRun.monsters.push(abyssCreateOneMonster(f, false));
        }
        var qd = abyssRun._queuedWildDivineEncounter;
        if (qd && qd.enc && qd.enc.id && Number(f) === Number(qd.bossFloor) + 1) {
            var encQ = qd.enc;
            var bf = Number(qd.bossFloor);
            var extraQ = abyssCreateOneMonster(Math.max(1, bf - 1), false);
            extraQ.isBoss = false;
            extraQ.wildAbyssDivineEncounterId = encQ.id;
            extraQ.wildAbyssDivineCaptureCost = encQ.captureCost;
            extraQ.name = abyssWildDivineShadowMonsterName(encQ);
            abyssRun.monsters.push(extraQ);
            delete abyssRun._queuedWildDivineEncounter;
            abyssLog('【联网】深渊异象：神兽之影混入敌阵（等同' + (bf - 1) + '层普通怪；可击杀或花费 ' + encQ.captureCost + ' 联网币捕捉）！');
        }
    }
    abyssRun.playerTargetIndex = 0;
    abyssRun.monster = abyssRun.monsters[0];
    abyssRun.lastWaveMonsterCount = (abyssRun.monsters || []).length || 1;
    if (isBoss && f >= 40) {
        abyssRequestWildBossEncounterIfOnline(f);
    }
}

/** 联网 BOSS 层：服务端判定「神兽之影」后追加一只怪（属性同 BOSS 层−1 的普通怪）；概率见服务端 ABYSS_WILD_BOSS_ENCOUNTER_RATE */
function abyssRequestWildBossEncounterIfOnline(floor) {
    if (!abyssRun || !abyssRun.active) return;
    var nFloor = Math.floor(Number(floor));
    if (!Number.isFinite(nFloor) || nFloor < 40 || nFloor % 10 !== 0) return;
    if (typeof hasApi === 'function' && !hasApi()) {
        if (typeof abyssLog === 'function') abyssLog('【联网】神兽之影：未配置 GOLD_GAME_API_BASE，无法请求');
        return;
    }
    if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) {
        if (typeof abyssLog === 'function') abyssLog('【联网】神兽之影：未登录，不请求');
        return;
    }
    var ggApiReq = (typeof window !== 'undefined' && typeof window.goldGameApiRequest === 'function') ? window.goldGameApiRequest : null;
    if (!ggApiReq) {
        if (typeof abyssLog === 'function') abyssLog('【联网】神兽之影：未加载联网请求模块，无法请求');
        return;
    }
    if (typeof abyssLog === 'function') abyssLog('【联网】第' + nFloor + '层 BOSS：已提交神兽之影判定（未出现为概率未中或栏位已满）');
    abyssRun._wildBossRollSeq = (abyssRun._wildBossRollSeq || 0) + 1;
    var rollSeq = abyssRun._wildBossRollSeq;
    var playerName = typeof getCurrentPlayerDisplayName === 'function' ? getCurrentPlayerDisplayName() : ((typeof player !== 'undefined' && player && player.name) ? player.name : '');
    ggApiReq('POST', '/api/network-abyss-divine/wild-boss-encounter-roll', { floor: nFloor, playerName: playerName }, true).then(function(res) {
        if (!abyssRun || !abyssRun.active || abyssRun._wildBossRollSeq !== rollSeq) return;
        if (res && !res.ok && res.message && typeof abyssLog === 'function') {
            abyssLog('【联网】神兽之影：' + res.message);
        }
        if (res && res.ok && res.throttled) {
            if (typeof abyssLog === 'function') abyssLog('【联网】神兽之影判定过于频繁，本层略过（约 1 秒后再进 BOSS 层会再试）');
            return;
        }
        if (res && res.ok && !res.encounter && res.message && typeof abyssLog === 'function') {
            abyssLog('【联网】神兽之影：' + res.message);
        }
        if (!res || !res.ok || !res.encounter || !res.encounter.id) return;
        var enc = res.encounter;
        var curF = Number(abyssRun.floor);
        function appendWildShadow() {
            var extra = abyssCreateOneMonster(Math.max(1, nFloor - 1), false);
            extra.isBoss = false;
            extra.wildAbyssDivineEncounterId = enc.id;
            extra.wildAbyssDivineCaptureCost = enc.captureCost;
            extra.name = abyssWildDivineShadowMonsterName(enc);
            abyssRun.monsters.push(extra);
            abyssLog('【联网】深渊异象：神兽之影混入敌阵（等同' + (nFloor - 1) + '层普通怪；可击杀或花费 ' + enc.captureCost + ' 联网币捕捉）！');
            if (typeof updateAbyssRunUI !== 'undefined' && updateAbyssRunUI) updateAbyssRunUI._monsterSignature = null;
            updateAbyssRunUI();
        }
        if (curF === nFloor) {
            appendWildShadow();
            return;
        }
        // 联网较慢：已通过 BOSS 关（floor 已 +1）。未刷怪则排队；已刷出下一层怪则直接插入当前阵中，避免异象被吞
        if (curF === nFloor + 1) {
            if (abyssRun.pendingChoice && (!abyssRun.monsters || abyssRun.monsters.length === 0)) {
                abyssRun._queuedWildDivineEncounter = { bossFloor: nFloor, enc: enc };
                abyssLog('【联网】深渊异象将至：神兽之影将在进入下一层战斗时出现');
                return;
            }
            if (abyssRun.monsters && abyssRun.monsters.length > 0) {
                appendWildShadow();
                return;
            }
        }
    }).catch(function(e) {
        if (typeof abyssLog === 'function') abyssLog('【联网】神兽之影请求失败：' + (e && e.message ? e.message : '网络异常'));
    });
}

/** 神兽之影捕捉确认弹窗：待确认时的索引与 encounterId（防止确认前换位导致误捕捉） */
window._abyssWildCapturePending = null;

function closeAbyssWildCaptureConfirm() {
    window._abyssWildCapturePending = null;
    var ov = document.getElementById('abyssWildCaptureOverlay');
    var ui = document.getElementById('abyssWildCaptureUI');
    var btn = document.getElementById('abyssWildCaptureConfirmBtn');
    if (ov) ov.style.display = 'none';
    if (ui) ui.style.display = 'none';
    if (btn) { btn.disabled = false; btn.style.opacity = ''; btn.style.cursor = 'pointer'; }
}

function abyssTryCaptureWildDivineMonster(monsterIndex) {
    if (!abyssRun || !abyssRun.monsters) return;
    var m = abyssRun.monsters[monsterIndex];
    if (!m || !m.wildAbyssDivineEncounterId || m.hp <= 0) return;
    var cost = m.wildAbyssDivineCaptureCost != null ? Math.floor(Number(m.wildAbyssDivineCaptureCost)) : 30;
    var ggApiCap = (typeof window !== 'undefined' && typeof window.goldGameApiRequest === 'function') ? window.goldGameApiRequest : null;
    if (!ggApiCap) {
        alert('联网请求模块未就绪，请刷新页面后重试');
        return;
    }
    var nameLine = (m.name != null && String(m.name).trim() !== '') ? String(m.name).trim() : '神兽之影';
    var msgEl = document.getElementById('abyssWildCaptureMsg');
    var ov = document.getElementById('abyssWildCaptureOverlay');
    var ui = document.getElementById('abyssWildCaptureUI');
    if (!msgEl || !ov || !ui) {
        if (!confirm('确定花费 ' + cost + ' 联网币捕捉「' + nameLine + '」？\n捕捉成功后神兽将加入你的联网神兽栏，并从战场消失。')) return;
        abyssConfirmWildCaptureExecuteDirect(monsterIndex, m.wildAbyssDivineEncounterId, cost, m);
        return;
    }
    window._abyssWildCapturePending = {
        monsterIndex: monsterIndex,
        encounterId: String(m.wildAbyssDivineEncounterId),
        cost: cost
    };
    var esc = String(nameLine).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    msgEl.innerHTML = '目标：<strong style="color:#f8bbd0;">' + esc + '</strong><br/><br/>将消耗 <strong style="color:#80cbc4;">' + cost + '</strong> 联网币。捕捉成功后神兽将加入你的联网神兽栏，并从当前战场消失。<br/><br/>请选择是否确认捕捉。';
    ov.style.display = 'block';
    ui.style.display = 'block';
}

function abyssConfirmWildCaptureExecuteDirect(monsterIndex, encounterId, cost, monsterRef) {
    var ggApiCap = (typeof window !== 'undefined' && typeof window.goldGameApiRequest === 'function') ? window.goldGameApiRequest : null;
    if (!ggApiCap) {
        alert('联网请求模块未就绪，请刷新页面后重试');
        return;
    }
    var m = monsterRef;
    if (!m && abyssRun && abyssRun.monsters) m = abyssRun.monsters[monsterIndex];
    if (!m || String(m.wildAbyssDivineEncounterId || '') !== String(encounterId || '') || m.hp <= 0) {
        alert('捕捉失败：目标已变化或已离开战场');
        return;
    }
    ggApiCap('POST', '/api/network-abyss-divine/capture-wild-encounter', { encounterId: String(encounterId) }, true).then(function(res) {
        if (!res || !res.ok) {
            alert((res && res.message) || '捕捉失败');
            return;
        }
        if (!abyssRun || !abyssRun.monsters) return;
        var idx = abyssRun.monsters.indexOf(m);
        if (idx >= 0) abyssRun.monsters.splice(idx, 1);
        if (window._networkAbyssDivineCache && res.beast) {
            window._networkAbyssDivineCache.beasts = window._networkAbyssDivineCache.beasts || [];
            window._networkAbyssDivineCache.beasts.push(res.beast);
        }
        if (typeof res.coin === 'number') {
            window._networkCoinCache = res.coin;
            var ncDisp = document.getElementById('goldGameNetworkCoinDisplay');
            if (ncDisp) ncDisp.textContent = res.coin;
        }
        abyssLog('【联网】捕捉成功：' + (res.beast && res.beast.name ? res.beast.name : '深渊神兽') + ' 已入栏（消耗联网币 ' + (res.cost != null ? res.cost : cost) + '）');
        if (typeof updatePlayerBattleStats === 'function') updatePlayerBattleStats();
        abyssEnsurePlayerTarget();
        if (abyssGetAliveMonsters().length === 0) {
            if (typeof stopAbyssAutoAttack === 'function') stopAbyssAutoAttack();
            abyssRun.monster = null;
            if (typeof abyssOnKillMonster === 'function') abyssOnKillMonster();
        }
        updateAbyssRunUI();
    }).catch(function(e) {
        alert((e && e.message) || '捕捉失败');
    });
}

function abyssConfirmWildCaptureExecute() {
    var st = window._abyssWildCapturePending;
    if (!st || st.monsterIndex == null || !st.encounterId) {
        closeAbyssWildCaptureConfirm();
        return;
    }
    if (!abyssRun || !abyssRun.monsters) {
        closeAbyssWildCaptureConfirm();
        return;
    }
    var mi = st.monsterIndex;
    var m = abyssRun.monsters[mi];
    if (!m || String(m.wildAbyssDivineEncounterId || '') !== String(st.encounterId) || m.hp <= 0) {
        closeAbyssWildCaptureConfirm();
        alert('捕捉失败：目标已变化或已离开战场，请重新选择');
        return;
    }
    var btn = document.getElementById('abyssWildCaptureConfirmBtn');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.65'; btn.style.cursor = 'wait'; }
    var cost = st.cost != null ? st.cost : 30;
    closeAbyssWildCaptureConfirm();
    abyssConfirmWildCaptureExecuteDirect(mi, st.encounterId, cost, m);
}

function abyssGetAliveMonsters() {
    if (!abyssRun || !abyssRun.monsters) return [];
    return abyssRun.monsters.filter(function(m) { return m && m.hp > 0; });
}

function abyssEnsurePlayerTarget() {
    if (!abyssRun || !abyssRun.monsters) return null;
    var curIdx = abyssRun.playerTargetIndex;
    if (typeof curIdx === 'number' && curIdx >= 0 && curIdx < abyssRun.monsters.length) {
        var m = abyssRun.monsters[curIdx];
        if (m && m.hp > 0) {
            abyssRun.monster = m;
            return abyssRun.monster;
        }
    }
    for (var i = 0; i < abyssRun.monsters.length; i++) {
        if (abyssRun.monsters[i] && abyssRun.monsters[i].hp > 0) {
            abyssRun.playerTargetIndex = i;
            abyssRun.monster = abyssRun.monsters[i];
            return abyssRun.monster;
        }
    }
    return null;
}

function abyssCalcVaultBonuses() {
    var at = getAbyssTower();
    var vault = at.abyssVault || {};
    var v = { atkPct: 0, hpPct: 0, defPct: 0, critRatePct: 0, critDmgPct: 0, dodgePct: 0, lifestealPct: 0, petAtkPct: 0, petDefPct: 0, petHpPct: 0, goldPct: 0, expPct: 0 };
    ABYSS_VAULT_TREASURES.forEach(function(t) {
        var c = vault[t.id] || 0;
        if (c <= 0) return;
        var e = t.effect;
        if (e.type === 'atkVaultPct') v.atkPct += e.value * c;
        else if (e.type === 'hpVaultPct') v.hpPct += e.value * c;
        else if (e.type === 'defVaultPct') v.defPct += e.value * c;
        else if (e.type === 'critDmgVaultPct') v.critDmgPct += e.value * c;
        else if (e.type === 'petAtkVaultPct') v.petAtkPct += e.value * c;
        else if (e.type === 'petHpVaultPct') v.petHpPct += e.value * c;
        else if (e.type === 'petDefVaultPct') v.petDefPct += e.value * c;
    });
    return v;
}

function abyssSetPlayerTarget(index) {
    if (!abyssRun || !abyssRun.monsters || index < 0 || index >= abyssRun.monsters.length) return;
    if (bLteZero(abyssRun.monsters[index].hp)) return;
    abyssRun.playerTargetIndex = index;
    abyssRun.monster = abyssRun.monsters[index];
    abyssUpdateMonsterTargetHighlight();
}
function abyssUpdateMonsterTargetHighlight() {
    var container = document.getElementById('abyssMonstersContainer');
    if (!container || !abyssRun || !abyssRun.monsters) return;
    for (var i = 0; i < container.children.length; i++) {
        var card = container.children[i];
        var m = abyssRun.monsters[i];
        if (!m) continue;
        var isDead = bLteZero(m.hp);
        var isTarget = (abyssRun.playerTargetIndex === i);
        card.style.border = '2px solid ' + (isTarget ? '#ffd700' : '#ff6b6b');
        card.style.cursor = isDead ? 'default' : (isTarget ? 'default' : 'pointer');
        var nameDiv = card.firstElementChild;
        if (nameDiv) {
            var nameLine = (m.element ? '[' + (ABYSS_ELEMENT_NAMES[m.element] || m.element) + '] ' : '') + (m.name || '') + (m.isBoss ? ' [BOSS]' : '');
            if (isTarget) nameLine += ' ←目标';
            nameDiv.textContent = nameLine;
        }
    }
}

var ABYSS_UI_THROTTLE_MS = 60;
function abyssDeferUpdate() {
    if (!abyssRun || !abyssRun.active) return;
    if (abyssDeferUpdate._raf) return;
    abyssDeferUpdate._raf = window.requestAnimationFrame(function() {
        abyssDeferUpdate._raf = null;
        updateAbyssRunUI();
    });
}
function updateAbyssRunUI() {
    if (!abyssRun || !abyssRun.active) return;
    // 节流：快速连续点击时合并 UI 更新，避免卡顿（手动点快 / 自动攻击都生效）
var now = Date.now();
var last = updateAbyssRunUI._lastRun || 0;

if (now - last < ABYSS_UI_THROTTLE_MS) {
    // 已经有一个定时器了，先清掉，重新预约一次
    if (updateAbyssRunUI._pending) {
        clearTimeout(updateAbyssRunUI._pending);
    }
    updateAbyssRunUI._pending = setTimeout(function() {
        updateAbyssRunUI._pending = null;
        updateAbyssRunUI();
    }, Math.max(16, ABYSS_UI_THROTTLE_MS - (now - last)));
    return;
}
    updateAbyssRunUI._lastRun = now;
    // 将重 UI 更新放到下一帧执行，避免长时间占用主线程导致界面“卡住、点击无反应”
    if (updateAbyssRunUI._rafScheduled) {
        updateAbyssRunUI._rafAgain = true;
        return;
    }
    updateAbyssRunUI._rafScheduled = true;
    var doUpdate = function() {
        updateAbyssRunUI._rafScheduled = false;
        if (updateAbyssRunUI._rafAgain) {
            updateAbyssRunUI._rafAgain = false;
            updateAbyssRunUI();
            return;
        }
        updateAbyssRunUI_doUpdate();
    };
    requestAnimationFrame(doUpdate);
    return;
}
function updateAbyssRunUI_doUpdate() {
    if (!abyssRun || !abyssRun.active) return;
    if (typeof abyssRecoverDeadMonsterWave === 'function' && abyssRecoverDeadMonsterWave()) return;
    abyssRun._petStatsCache = {};
    abyssLogFlush();
    var _g = function(id) { if (!updateAbyssRunUI._el) updateAbyssRunUI._el = {}; if (!updateAbyssRunUI._el[id]) updateAbyssRunUI._el[id] = document.getElementById(id); return updateAbyssRunUI._el[id]; };
    if (!abyssRun || !abyssRun.active) updateAbyssRunUI._el = null;
    abyssRun.runLevel = Math.floor((abyssRun.exp || 0) / 100);
    if (abyssRun.runLevel > (abyssRun.lastGrantedTalentLevel || 0)) {
        var add = abyssRun.runLevel - (abyssRun.lastGrantedTalentLevel || 0);
        abyssRun.talentPoints = (abyssRun.talentPoints || 0) + add;
        abyssRun.lastGrantedTalentLevel = abyssRun.runLevel;
    }
    var runZhuan = abyssZhuan(abyssRun.runLevel || 0);
    var stats = abyssCalcPlayerStats();
    if (!stats) return;
    
    if ((abyssRun.playerClass || 'warrior') === 'mechanic') {
        var aliveSummons = (abyssRun.beastSummons || []).filter(function(b) { return b && b.hp > 0; }).length;
        if (aliveSummons > 0 && stats.maxHp > 0 && !abyssRun._mechanicSummonAttrApplied) {
            abyssRun._mechanicSummonAttrApplied = true;
            abyssRun.tempStats = abyssRun.tempStats || {};
            var atkBonusOnce = Math.floor(stats.atk * 0.10 * aliveSummons);
            var defBonusOnce = Math.floor(stats.def * 0.10 * aliveSummons);
            abyssRun.tempStats.atk = (abyssRun.tempStats.atk || 0) + atkBonusOnce;
            abyssRun.tempStats.def = (abyssRun.tempStats.def || 0) + defBonusOnce;
            abyssLog('机械师被动：召唤兽共' + aliveSummons + '个，获得一次性攻击与防御加成');
        }
    }
    abyssEnsurePlayerTarget();
    var levelEl = _g('abyssPlayerLevel');
    _g('abyssCurrentFloor').textContent = abyssRun.floor;
    if (levelEl) levelEl.textContent = abyssRun.runLevel || 0;
    _g('abyssPlayerHp').textContent = formatNumber(abyssRun.player.hp);
    _g('abyssPlayerMaxHp').textContent = formatNumber(stats.maxHp);
    var shieldVal = abyssRun.player.shield || 0;
    var shieldWrap = _g('abyssPlayerShieldWrap');
    var shieldEl = _g('abyssPlayerShield');
    if (shieldWrap && shieldEl) {
        if (shieldVal > 0) { shieldWrap.style.display = ''; shieldEl.textContent = formatNumber(shieldVal); }
        else shieldWrap.style.display = 'none';
    }
    _g('abyssPlayerAtk').textContent = formatNumber(stats.atk);
    _g('abyssPlayerDef').textContent = formatNumber(stats.def);
    _g('abyssPlayerCritRate').textContent = abyssFmt1(stats.critRate) + '%';
    _g('abyssPlayerCritDmg').textContent = abyssFmt1(stats.critDmg) + '%';
    _g('abyssPlayerDodge').textContent = abyssFmt1(stats.dodge) + '%';
    _g('abyssPlayerLifesteal').textContent = abyssFmt1(stats.lifesteal) + '%';
    _g('abyssPlayerCombo').textContent = abyssFmt1(stats.combo) + '%';
    var skillDmgEl = _g('abyssPlayerSkillDmg');
    if (skillDmgEl) skillDmgEl.textContent = abyssFmt1(stats.skillDmg || 0) + '%';
    var reduceDefEl = _g('abyssPlayerReduceDef');
    if (reduceDefEl) reduceDefEl.textContent = abyssFmt1(stats.reduceMonsterDef || 0) + '%';
    var elAtkEl = _g('abyssPlayerElementAtk');
    if (elAtkEl && stats.elementAtk) {
        var fmt1 = function(v) { return (Math.floor((v || 0) * 10) / 10).toFixed(1); };
        elAtkEl.textContent = fmt1(stats.elementAtk.metal) + '/' + fmt1(stats.elementAtk.wood) + '/' + fmt1(stats.elementAtk.water) + '/' + fmt1(stats.elementAtk.fire) + '/' + fmt1(stats.elementAtk.earth);
    }
    var elResEl = _g('abyssPlayerElementRes');
    if (elResEl && stats.elementRes) elResEl.textContent = abyssFmt1(stats.elementRes.metal || 0) + '%/' + abyssFmt1(stats.elementRes.wood || 0) + '%/' + abyssFmt1(stats.elementRes.water || 0) + '%/' + abyssFmt1(stats.elementRes.fire || 0) + '%/' + abyssFmt1(stats.elementRes.earth || 0) + '%';
    var strAgiEl = _g('abyssPlayerStrAgiIntSta');
    if (strAgiEl) strAgiEl.textContent = (stats.str || 0) + '/' + (stats.agi || 0) + '/' + (stats.int || 0) + '/' + (stats.sta || 0);
    var expEl = _g('abyssPlayerExp');
    if (expEl) expEl.textContent = formatNumber(abyssRun.exp || 0);
    var b = abyssRun.buffs || {};
    var vB = abyssCalcVaultBonuses();
    var setBonus = function(id, v) { var el = _g(id); if (el) el.textContent = (v != null ? v : 0); };
    setBonus('abyssBonusAtk', (b.atkPct || 0) + vB.atkPct);
    setBonus('abyssBonusHp', (b.hpPct || 0) + vB.hpPct);
    setBonus('abyssBonusDef', (b.defPct || 0) + vB.defPct);
    setBonus('abyssBonusLifesteal', (b.lifestealPct || 0) + vB.lifestealPct);
    setBonus('abyssBonusCritRate', (b.critRatePct || 0) + (b.critRate != null ? b.critRate : 0) + vB.critRatePct);
    setBonus('abyssBonusCritDmg', (b.critDmgPct || 0) + (b.critDmg != null ? b.critDmg : 0) + vB.critDmgPct);
    setBonus('abyssBonusDodge', (b.dodgePct || 0) + vB.dodgePct);
    setBonus('abyssBonusPetAtk', (b.petAtkPct || 0) + vB.petAtkPct);
    setBonus('abyssBonusPetDef', (b.petDefPct || 0) + vB.petDefPct);
    setBonus('abyssBonusPetHp', (b.petHpPct || 0) + vB.petHpPct);
    setBonus('abyssBonusGold', (b.goldPct || 0) + vB.goldPct);
    setBonus('abyssBonusExp', (b.expPct || 0) + vB.expPct);
    var curseTrialEl = _g('abyssCurseTrialHint');
    if (curseTrialEl) {
        var hints = [];
        if (abyssRun.curseRounds > 0) hints.push('☠诅咒·奖励 剩余' + abyssRun.curseRounds + '层');
        if (abyssRun.trialId && abyssRun.trialRoundsLeft > 0) hints.push('⚔试炼:' + (abyssRun.trialId === 'noPotion' ? '禁药' : abyssRun.trialId === 'normalAtk' ? '纯武' : abyssRun.trialId === 'noPet' ? '孤狼' : '险境') + ' 剩余' + abyssRun.trialRoundsLeft + '层');
        curseTrialEl.textContent = hints.length ? hints.join(' | ') : '';
    }
    var zhuanEl = _g('abyssPlayerZhuan');
    if (zhuanEl) zhuanEl.textContent = stats.zhuan ? ' (' + abyssZhuanTitle(abyssRun.playerClass, stats.zhuan, abyssRun.classBranch) + ')' : '';
    var maxMp = stats.maxMp != null ? stats.maxMp : abyssMaxMpForLevel(abyssRun.runLevel || 0);
    abyssRun.player.mp = Math.min(maxMp, Math.max(0, abyssRun.player.mp != null ? abyssRun.player.mp : 50));
    var mpEl = _g('abyssPlayerMp');
    var maxMpEl = _g('abyssPlayerMaxMp');
    if (mpEl) mpEl.textContent = formatNumber(Math.floor(abyssRun.player.mp));
    if (maxMpEl) maxMpEl.textContent = formatNumber(maxMp);
    var mpPct = maxMp > 0 ? (abyssRun.player.mp / maxMp * 100) : 0;
    var mpBarEl = _g('abyssPlayerMpBar');
    if (mpBarEl) mpBarEl.style.width = mpPct + '%';
    var hpPct = stats.maxHp > 0 ? (abyssRun.player.hp / stats.maxHp * 100) : 0;
    var hpBarEl = _g('abyssPlayerHpBar');
    if (hpBarEl) hpBarEl.style.width = hpPct + '%';
    var container = _g('abyssMonstersContainer');
    if (container) {
        var monsters = abyssRun.monsters || [];
        var childCount = container.children.length;
        var monsterSignature = monsters.map(function(m) { return (m ? m.hp + '-' + m.shield + '-' + m.maxHp + '-' + (m.isBoss ? 1 : 0) + '-' + abyssRun.playerTargetIndex + '-' + (m.wildAbyssDivineEncounterId || '') + '-' + (m.wildAbyssDivineCaptureCost || '') : ''); }).join('|');
        if (!updateAbyssRunUI._monsterSignature || updateAbyssRunUI._monsterSignature !== monsterSignature) {
            updateAbyssRunUI._monsterSignature = monsterSignature;
            var useInPlaceMonsterUpdate = (childCount === monsters.length);
            if (useInPlaceMonsterUpdate) {
                for (var _wi = 0; _wi < monsters.length; _wi++) {
                    var _wm = monsters[_wi];
                    var _c = container.children[_wi];
                    if (_wm && _wm.wildAbyssDivineEncounterId && _wm.hp > 0 && _c && String(_c.innerHTML || '').indexOf('捕捉') === -1) {
                        useInPlaceMonsterUpdate = false;
                        break;
                    }
                }
            }
            if (monsters.length === 0) {
                if (childCount > 0) container.innerHTML = '';
            } else if (useInPlaceMonsterUpdate) {
                for (var mi = 0; mi < monsters.length; mi++) {
                    var m = monsters[mi];
                    var isDead = !m || m.hp <= 0;
                    var isTarget = (abyssRun.playerTargetIndex === mi);
                    var card = container.children[mi];
                    if (!card) break;
                    card.style.cssText = 'min-width:140px;padding:10px;border-radius:10px;border:2px solid ' + (isTarget ? '#ffd700' : '#ff6b6b') + ';background:rgba(255,107,107,' + (isDead ? 0.05 : 0.15) + ');cursor:' + (isDead ? 'default' : 'pointer') + ';opacity:' + (isDead ? 0.6 : 1) + ';';
                    var nameLine = (m.element ? '[' + (ABYSS_ELEMENT_NAMES[m.element] || m.element) + '] ' : '') + (m.name || '') + (m.isBoss ? ' [BOSS]' : '');
                    if (isTarget) nameLine += ' ←目标';
                    var hpBarPct = (m.maxHp > 0 ? Math.max(0, (m.hp + (m.shield || 0)) / (m.maxHp + (m.shield || 0)) * 100) : 0);
                    var nameDiv = card.firstElementChild;
                    if (nameDiv) nameDiv.textContent = nameLine;
                    var line2 = card.children[1];
                    if (line2) line2.textContent = '生命: ' + formatNumber(m.hp) + (m.shield > 0 ? ' (盾' + formatNumber(m.shield) + ')' : '') + '/' + formatNumber(m.maxHp);
                    var barFill = card.querySelector('div > div[style*="gradient"]');
                    if (barFill) barFill.style.width = hpBarPct + '%';
                }
            } else {
                var frag = document.createDocumentFragment();
                for (var mi = 0; mi < monsters.length; mi++) {
                    var m = monsters[mi];
                    var isDead = !m || m.hp <= 0;
                    var isTarget = (abyssRun.playerTargetIndex === mi);
                    var card = document.createElement('div');
                    card.style.cssText = 'min-width:140px;padding:10px;border-radius:10px;border:2px solid ' + (isTarget ? '#ffd700' : '#ff6b6b') + ';background:rgba(255,107,107,' + (isDead ? 0.05 : 0.15) + ');cursor:' + (isDead ? 'default' : 'pointer') + ';opacity:' + (isDead ? 0.6 : 1) + ';';
                    card.onclick = (function(idx) { return function() { if (abyssRun.monsters[idx] && abyssRun.monsters[idx].hp > 0) abyssSetPlayerTarget(idx); }; })(mi);
                    var nameLine = (m.element ? '[' + (ABYSS_ELEMENT_NAMES[m.element] || m.element) + '] ' : '') + (m.name || '') + (m.isBoss ? ' [BOSS]' : '');
                    if (isTarget) nameLine += ' ←目标';
                    card.innerHTML = '<div style="color:#ff6b6b;font-weight:bold;font-size:12px;margin-bottom:4px;">' + nameLine + '</div>' +
                        '<div style="font-size:11px;">生命: ' + formatNumber(m.hp) + (m.shield > 0 ? ' (盾' + formatNumber(m.shield) + ')' : '') + '/' + formatNumber(m.maxHp) + '</div>' +
                        '<div style="height:6px;background:#333;border-radius:3px;margin-top:4px;overflow:hidden;"><div style="height:100%;background:linear-gradient(90deg,#ff6b6b,#ffd700);width:' + (m.maxHp > 0 ? Math.max(0, (m.hp + (m.shield || 0)) / (m.maxHp + (m.shield || 0)) * 100) : 0) + '%;border-radius:3px;"></div></div>' +
                        '<div style="margin-top:4px;font-size:10px;color:#aaa;">' + (m.isBoss ? '深渊护盾 ' : '') + (m.skills && m.skills.length ? m.skills.slice(0, 3).map(function(s){return s.name;}).join(' ') : '') + '</div>' +
                        (function(){ var res = []; if (m.elementRes) { for (var ei = 0; ei < ABYSS_ELEMENTS.length; ei++) { var el = ABYSS_ELEMENTS[ei]; var v = m.elementRes[el]; if (v > 0) res.push((ABYSS_ELEMENT_NAMES[el] || el) + '抗' + v + '%'); } } if ((m.magicRes || 0) > 0) res.push('魔抗' + m.magicRes + '%'); return res.length ? '<div style="margin-top:2px;font-size:9px;color:#8a8;">' + res.join(' ') + '</div>' : ''; })() +
                        (m.wildAbyssDivineEncounterId && m.hp > 0 ? '<div style="margin-top:8px;"><button type="button" style="width:100%;padding:6px 8px;font-size:11px;font-weight:bold;border-radius:6px;border:1px solid #ce93d8;background:linear-gradient(145deg,#4a148c,#6a1b9a);color:#fff;cursor:pointer;" onclick="event.stopPropagation();if(typeof abyssTryCaptureWildDivineMonster===\'function\')abyssTryCaptureWildDivineMonster(' + mi + ');">捕捉（' + (m.wildAbyssDivineCaptureCost != null ? m.wildAbyssDivineCaptureCost : '?') + ' 联网币）</button></div>' : '');
                    frag.appendChild(card);
                }
                container.innerHTML = '';
                container.appendChild(frag);
            }
        }
    }
    if (runZhuan >= 2 && !abyssRun.classBranch) {
        abyssShowBranchSelection();
        return;
    }
    var beastContainer = _g('abyssBeastSummonsContainer');
    if (beastContainer) {
        var beasts = abyssRun.beastSummons || [];
        var bChildCount = beastContainer.children.length;
        var beastSignature = beasts.map(function(b) { return (b ? b.hp + '-' + b.maxHp + '-' + (b.shield || 0) : ''); }).join('|');
        if (!updateAbyssRunUI._beastSignature || updateAbyssRunUI._beastSignature !== beastSignature) {
            updateAbyssRunUI._beastSignature = beastSignature;
            if (beasts.length === 0) {
                if (bChildCount > 0) beastContainer.innerHTML = '';
            } else if (bChildCount === beasts.length) {
                for (var bi = 0; bi < beasts.length; bi++) {
                    var b = beasts[bi];
                    if (!b) continue;
                    var isAlive = b.hp > 0;
                    var card = beastContainer.children[bi];
                    if (!card) break;
                    card.style.cssText = 'min-width:120px;padding:8px;border-radius:8px;border:2px solid ' + (isAlive ? '#4caf50' : '#666') + ';background:rgba(76,175,80,' + (isAlive ? 0.15 : 0.05) + ');opacity:' + (isAlive ? 1 : 0.6) + ';';
                    var shB = b.shield || 0;
                    var hpPct = (b.maxHp > 0 ? Math.max(0, (b.hp + shB) / (b.maxHp + shB) * 100) : 0);
                    // 与首次渲染一致：含护盾行与血条（就地更新时也必须刷新护盾，否则「护盾式神」等加盾后不显示）
                    card.innerHTML = '<div style="color:#81c784;font-weight:bold;font-size:11px;margin-bottom:4px;">' + (b.name || '召唤兽') + (isAlive ? '' : ' 已消散') + '</div>' +
                        '<div style="font-size:11px;">生命: ' + formatNumber(b.hp) + (shB > 0 ? ' (盾' + formatNumber(shB) + ')' : '') + '/' + formatNumber(b.maxHp) + '</div>' + (shB > 0 ? '<div style="font-size:10px;color:#64b5f6;">护盾: ' + formatNumber(shB) + '</div>' : '') +
                        '<div style="height:6px;background:#333;border-radius:3px;margin-top:4px;overflow:hidden;"><div style="height:100%;background:linear-gradient(90deg,#4caf50,#81c784);width:' + hpPct + '%;border-radius:3px;"></div></div>';
                }
            } else {
                var bfrag = document.createDocumentFragment();
                for (var bi = 0; bi < beasts.length; bi++) {
                    var b = beasts[bi];
                    if (!b) continue;
                    var isAlive = b.hp > 0;
                    var card = document.createElement('div');
                    card.style.cssText = 'min-width:120px;padding:8px;border-radius:8px;border:2px solid ' + (isAlive ? '#4caf50' : '#666') + ';background:rgba(76,175,80,' + (isAlive ? 0.15 : 0.05) + ');opacity:' + (isAlive ? 1 : 0.6) + ';';
                    var shB2 = b.shield || 0;
                    var hpPct = (b.maxHp > 0 ? Math.max(0, (b.hp + shB2) / (b.maxHp + shB2) * 100) : 0);
                    card.innerHTML = '<div style="color:#81c784;font-weight:bold;font-size:11px;margin-bottom:4px;">' + (b.name || '召唤兽') + (isAlive ? '' : ' 已消散') + '</div>' +
                        '<div style="font-size:11px;">生命: ' + formatNumber(b.hp) + (shB2 > 0 ? ' (盾' + formatNumber(shB2) + ')' : '') + '/' + formatNumber(b.maxHp) + '</div>' + (shB2 > 0 ? '<div style="font-size:10px;color:#64b5f6;">护盾: ' + formatNumber(shB2) + '</div>' : '') +
                        '<div style="height:6px;background:#333;border-radius:3px;margin-top:4px;overflow:hidden;"><div style="height:100%;background:linear-gradient(90deg,#4caf50,#81c784);width:' + hpPct + '%;border-radius:3px;"></div></div>';
                    bfrag.appendChild(card);
                }
                beastContainer.innerHTML = '';
                beastContainer.appendChild(bfrag);
            }
        }
    }
    var autoStatusEl = _g('abyssAutoAttackStatus');
    if (autoStatusEl) autoStatusEl.textContent = abyssRun.autoAttack ? '开' : '关';
    var triggeredEl = _g('abyssTriggeredBuffs');
    if (triggeredEl && abyssRun.triggeredBuffs && abyssRun.triggeredBuffs.length > 0) {
        var list = abyssRun.triggeredBuffs.slice(-10).reverse();
        triggeredEl.innerHTML = list.map(function(b) { return '<div style="margin-bottom:2px;color:#ce93d8;">【' + (b.name || '') + '】' + (b.effect || '') + (b.round ? ' (回合' + b.round + ')' : '') + '</div>'; }).join('');
    } else if (triggeredEl) {
        triggeredEl.innerHTML = '<span style="color:#888;">暂无触发</span>';
    }
    var skillRow = _g('abyssSkillRow');
    if (skillRow) {
        var classId = abyssRun.playerClass || 'warrior';
        var equipped = abyssRun.equippedSkillIds || [null, null, null];
        if (classId === 'tamer' && equipped.length < 4) {
            while (equipped.length < 3) equipped.push(null);
            equipped.push(ABYSS_TAMER_BOUND_SKILL_ID);
            abyssRun.equippedSkillIds = equipped;
        }
        if (classId === 'warrior' && equipped.length < 4) {
            while (equipped.length < 3) equipped.push(null);
            equipped.push(ABYSS_WARRIOR_BOUND_SKILL_ID);
            abyssRun.equippedSkillIds = equipped;
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_WARRIOR_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_WARRIOR_BOUND_SKILL_ID);
        }
        if (classId === 'mage' && equipped.length < 5) {
            while (equipped.length < 3) equipped.push(null);
            if (equipped.length < 4) equipped.push(ABYSS_MAGE_BOUND_SKILL_ID);
            if (equipped.length < 5) equipped.push(ABYSS_MAGE_BOUND_SKILL_ID2);
            abyssRun.equippedSkillIds = equipped;
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_MAGE_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_MAGE_BOUND_SKILL_ID);
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_MAGE_BOUND_SKILL_ID2) < 0) abyssRun.learnedSkillIds.push(ABYSS_MAGE_BOUND_SKILL_ID2);
        }
        if (classId === 'archer' && equipped.length < 4) {
            while (equipped.length < 3) equipped.push(null);
            equipped.push(ABYSS_ARCHER_BOUND_SKILL_ID);
            abyssRun.equippedSkillIds = equipped;
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_ARCHER_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ARCHER_BOUND_SKILL_ID);
        }
        if (classId === 'onmyoji' && equipped.length < 6) {
            while (equipped.length < 3) equipped.push(null);
            if (equipped.length < 4) equipped.push(ABYSS_ONMYOJI_BOUND_SKILL_ID);
            if (equipped.length < 5) equipped.push(ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID);
            if (equipped.length < 6) equipped.push(ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID);
            abyssRun.equippedSkillIds = equipped;
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_ONMYOJI_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_ID);
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID);
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID);
        }
        if (classId === 'jester' && equipped.length < 5) {
            while (equipped.length < 3) equipped.push(null);
            if (equipped.length < 4) equipped.push(ABYSS_JESTER_BOUND_SKILL_ID);
            if (equipped.length < 5) equipped.push(ABYSS_JESTER_BOUND_SKILL_ID2);
            abyssRun.equippedSkillIds = equipped;
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_JESTER_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_JESTER_BOUND_SKILL_ID);
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_JESTER_BOUND_SKILL_ID2) < 0) abyssRun.learnedSkillIds.push(ABYSS_JESTER_BOUND_SKILL_ID2);
        }
        if (classId === 'riftbinder' && equipped.length < 6) {
            while (equipped.length < 3) equipped.push(null);
            if (equipped.length < 4) equipped.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID);
            if (equipped.length < 5) equipped.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID2);
            if (equipped.length < 6) equipped.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID3);
            abyssRun.equippedSkillIds = equipped;
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_RIFTBINDER_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID);
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_RIFTBINDER_BOUND_SKILL_ID2) < 0) abyssRun.learnedSkillIds.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID2);
            if (abyssRun.learnedSkillIds.indexOf(ABYSS_RIFTBINDER_BOUND_SKILL_ID3) < 0) abyssRun.learnedSkillIds.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID3);
        }
        var slotCount = abyssGetSkillSlotCount();
        var learned = abyssRun.learnedSkillIds || [];
        var currentMp = abyssRun.player.mp != null ? abyssRun.player.mp : 50;
        var doFullRebuild = skillRow.children.length !== slotCount;
        if (doFullRebuild) skillRow.innerHTML = '';
        for (var ei = 0; ei < slotCount; ei++) {
            var sid = equipped[ei];
            if (abyssIsBoundSkillSlot(ei)) sid = abyssGetBoundSkillIdForClass(classId, ei);
            var btn = doFullRebuild ? null : skillRow.children[ei];
            if (sid == null || sid === '' || learned.indexOf(sid) < 0) {
                var boundSk = (sid && abyssGetSkillById(classId, sid)) ? sid : abyssGetBoundSkillIdForClass(classId, ei);
                var boundName = boundSk ? (abyssGetSkillById(classId, boundSk) || {}).name : '';
                var txt = abyssIsBoundSkillSlot(ei) ? (boundName ? boundName + '(绑定)' : '绑定') : '空';
                if (btn) { btn.textContent = txt; btn.style.cssText = 'background:#333;color:#666;border:1px solid #555;padding:8px 14px;border-radius:6px;cursor:default;font-size:12px;'; btn.onclick = null; }
                else {
                    var emptyBtn = document.createElement('button');
                    emptyBtn.type = 'button';
                    emptyBtn.textContent = txt;
                    emptyBtn.style.cssText = 'background:#333;color:#666;border:1px solid #555;padding:8px 14px;border-radius:6px;cursor:default;font-size:12px;';
                    emptyBtn.title = abyssIsBoundSkillSlot(ei) ? (classId === 'tamer' ? '驯兽师专属绑定技能' : classId === 'warrior' ? '战士专属绑定技能' : classId === 'mage' ? '法师专属绑定技能' : classId === 'archer' ? '射手专属绑定技能' : classId === 'onmyoji' ? '阴阳师专属绑定技能' : classId === 'jester' ? '戏命师专属绑定技能' : classId === 'riftbinder' ? '异界御灵专属绑定技能' : '职业专属绑定技能') : '在技能界面学习并装备技能';
                    skillRow.appendChild(emptyBtn);
                }
                continue;
            }
            var sk = abyssGetSkillById(classId, sid);
            if (!sk) continue;
            var cd = abyssRun.skillCooldowns && abyssRun.skillCooldowns[sk.id];
            var mpCost = sk.mpCost || 0;
            var ready = (cd === undefined || cd <= 0) && currentMp >= mpCost;
            var cdRounds = (sk.cooldown != null) ? (sk.cooldown || 0) : 0;
            var titleStr = abyssGetSkillDescForDisplay(sk) + (mpCost ? ' | 蓝量消耗 ' + mpCost : '') + (cdRounds ? ' | 冷却 ' + cdRounds + ' 回合' : '');
            var textStr = sk.name + (ready ? ' (就绪)' : (cd > 0 ? ' CD' + cd : ' (魔不足)'));
            var styleStr = 'background:' + (ready ? 'linear-gradient(145deg,#6a0dad,#4a0072)' : '#444') + ';color:#fff;border:1px solid #b388ff;padding:8px 14px;border-radius:6px;cursor:' + (ready ? 'pointer' : 'default') + ';font-size:12px;';
            if (btn) {
                btn.textContent = textStr;
                btn.title = titleStr;
                btn.style.cssText = styleStr;
                btn.onclick = ready ? (function(sid) { return function() { abyssRun.nextSkillId = sid; abyssLog('下次攻击将释放技能'); abyssDeferUpdate(); }; })(sk.id) : null;
            } else {
                var newBtn = document.createElement('button');
                newBtn.type = 'button';
                newBtn.title = titleStr;
                newBtn.textContent = textStr;
                newBtn.style.cssText = styleStr;
                if (ready) newBtn.onclick = (function(sid) { return function() { abyssRun.nextSkillId = sid; abyssLog('下次攻击将释放技能'); abyssDeferUpdate(); }; })(sk.id);
                skillRow.appendChild(newBtn);
            }
        }
    }
    var shopBtnEl = _g('abyssShopBtn');
    if (shopBtnEl) shopBtnEl.style.display = abyssRun.justKilledBoss ? 'inline-block' : 'none';
    var deployedPetEl = _g('abyssDeployedPetInfo');
    if (deployedPetEl) {
        var deployedList = abyssGetDeployedPets();
        if (deployedList.length > 0) {
            var parts = [];
            for (var di = 0; di < deployedList.length; di++) {
                var dp = deployedList[di];
                var dps = abyssCalcPetStats(dp);
                var dphp = dp.hp !== null ? Math.max(0, dp.hp) : (dps ? dps.maxHp : 0);
                var dpmax = dps ? dps.maxHp : 0;
                parts.push(dp.name + ' ' + formatNumber(dphp) + '/' + formatNumber(dpmax));
            }
            deployedPetEl.textContent = '出战宠物: ' + parts.join(' | ');
        } else {
            deployedPetEl.textContent = '出战宠物: 无';
        }
    }
    var guardBtn = _g('abyssPetGuardBtn');
    if (guardBtn) guardBtn.textContent = (abyssRun.petGuard ? '守护: 开' : '守护: 关');
    var guardBtnPanel = _g('abyssPetGuardBtnPanel');
    if (guardBtnPanel) guardBtnPanel.textContent = (abyssRun.petGuard ? '守护: 开' : '守护: 关');
    if (typeof abyssScheduleFullscreenZoomScale === 'function') abyssScheduleFullscreenZoomScale();
}
function abyssTogglePetGuard() {
    if (!abyssRun || !abyssRun.active) return;
    abyssRun.petGuard = !abyssRun.petGuard;
    var guardBtn = document.getElementById('abyssPetGuardBtn');
    if (guardBtn) guardBtn.textContent = (abyssRun.petGuard ? '守护: 开' : '守护: 关');
    var guardBtnPanel = document.getElementById('abyssPetGuardBtnPanel');
    if (guardBtnPanel) guardBtnPanel.textContent = (abyssRun.petGuard ? '守护: 开' : '守护: 关');
    abyssLog(abyssRun.petGuard ? '已开启守护：优先由出战宠物承伤（无出战宠时由召唤兽承伤）' : '已关闭守护：怪物随机攻击玩家/召唤兽/宠物');
}

var ABYSS_LOG_MAX = 40;
var ABYSS_LOG_BUFFER_MAX = 200;
var _abyssLogBuffer = [];
function abyssLog(msg) {
    if (!msg) return;
    _abyssLogBuffer.push(msg);
    if (_abyssLogBuffer.length > ABYSS_LOG_BUFFER_MAX) _abyssLogBuffer = _abyssLogBuffer.slice(-ABYSS_LOG_BUFFER_MAX);
}
function abyssLogFlush() {
    if (_abyssLogBuffer.length === 0) return;
    var el = document.getElementById('abyssBattleLog');
    if (!el) { _abyssLogBuffer = []; return; }
    var frag = document.createDocumentFragment();
    for (var i = 0; i < _abyssLogBuffer.length; i++) {
        var div = document.createElement('div');
        div.style.marginBottom = '4px';
        div.style.fontSize = '12px';
        div.style.color = '#ccc';
        div.textContent = _abyssLogBuffer[i];
        frag.appendChild(div);
    }
    _abyssLogBuffer = [];
    el.appendChild(frag);
    el.scrollTop = el.scrollHeight;
    while (el.children.length > ABYSS_LOG_MAX) el.removeChild(el.firstChild);
}
function abyssPushTriggeredBuff(skillName, effectText) {
    if (!abyssRun || !abyssRun.triggeredBuffs) return;
    abyssRun.triggeredBuffs.push({ name: skillName, effect: effectText, round: abyssRun.roundCount || 0 });
    while (abyssRun.triggeredBuffs.length > 30) abyssRun.triggeredBuffs.shift();
}

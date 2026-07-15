/**
 * 时光秘境 · 局内装备扩展数据（名字池 / 品质配色 / 词条 / 属性类型）
 */
const TSR_EQUIP_TIER_STYLE = {
    common:    { label: '普通', color: '#94a3b8', css: 'tsr-eq-tier-common',    gradient: false },
    uncommon:  { label: '优良', color: '#4ade80', css: 'tsr-eq-tier-uncommon',  gradient: false },
    rare:      { label: '稀有', color: '#38bdf8', css: 'tsr-eq-tier-rare',      gradient: false },
    epic:      { label: '史诗', color: '#c084fc', css: 'tsr-eq-tier-epic',      gradient: true },
    legendary: { label: '传说', color: '#fbbf24', css: 'tsr-eq-tier-legendary', gradient: true },
    mythic:    { label: '神话', color: '#fb7185', css: 'tsr-eq-tier-mythic',    gradient: true }
};

const TSR_EQUIP_STAT_META = {
    attack:       { label: '攻击',     short: '攻',   icon: '⚔️', group: 'combat',    kind: 'pct', base: 0.075 },
    health:       { label: '生命',     short: '血',   icon: '❤️', group: 'combat',    kind: 'pct', base: 0.09 },
    critRate:     { label: '暴击',     short: '暴',   icon: '💥', group: 'combat',    kind: 'pct', base: 0.03 },
    critDamage:   { label: '暴伤',     short: '暴伤', icon: '🔥', group: 'combat',    kind: 'pct', base: 0.09 },
    counterReduce:{ label: '反击减免', short: '反击', icon: '🛡️', group: 'defense',   kind: 'pct', base: 0.03 },
    counterAmp:   { label: '反击增幅', short: '反增', icon: '💢', group: 'combat',    kind: 'pct', base: 0.01 },
    physicalPower:{ label: '物理伤',   short: '物理', icon: '🗡️', group: 'combat',    kind: 'pct', base: 0.015 },
    spellPower:   { label: '法术伤',   short: '法术', icon: '✨', group: 'combat',    kind: 'pct', base: 0.015 },
    lifeSteal:    { label: '吸血',     short: '吸',   icon: '🩸', group: 'combat',    kind: 'pct', base: 0.012 },
    vampiric:     { label: '嗜血',     short: '嗜',   icon: '🦇', group: 'combat',    kind: 'pct', base: 0.01 },
    dodge:        { label: '闪避',     short: '闪',   icon: '💨', group: 'defense',   kind: 'pct', base: 0.01 },
    block:        { label: '格挡',     short: '挡',   icon: '🛡️', group: 'defense',   kind: 'pct', base: 0.01 },
    parry:        { label: '招架',     short: '架',   icon: '🤺', group: 'defense',   kind: 'pct', base: 0.008 },
    evasion:      { label: '规避',     short: '避',   icon: '🌀', group: 'defense',   kind: 'pct', base: 0.008 },
    armor:        { label: '护甲',     short: '甲',   icon: '🪖', group: 'defense',   kind: 'pct', base: 0.015 },
    pen:          { label: '穿透',     short: '穿',   icon: '⚔️', group: 'combat',    kind: 'pct', base: 0.012 },
    damageAmp:    { label: '伤害增幅', short: '伤增', icon: '⚡', group: 'combat',    kind: 'pct', base: 0.018 },
    aoeDamage:    { label: '范围伤',   short: '范围', icon: '💫', group: 'combat',    kind: 'pct', base: 0.01 },
    singleTarget: { label: '单体伤',   short: '单体', icon: '🎯', group: 'combat',    kind: 'pct', base: 0.012 },
    healAmp:      { label: '治疗增幅', short: '疗',   icon: '💚', group: 'utility',   kind: 'pct', base: 0.015 },
    regen:        { label: '再生',     short: '再生', icon: '♻️', group: 'defense',   kind: 'pct', base: 0.008 },
    thorns:       { label: '荆棘',     short: '棘',   icon: '🌵', group: 'defense',   kind: 'pct', base: 0.008 },
    shield:       { label: '护盾',     short: '盾',   icon: '🔰', group: 'defense',   kind: 'pct', base: 0.01 },
    reflect:      { label: '反射',     short: '反',   icon: '🪞', group: 'defense',   kind: 'pct', base: 0.008 },
    absorb:       { label: '吸收',     short: '吸伤', icon: '🧲', group: 'defense',   kind: 'pct', base: 0.008 },
    firstStrike:  { label: '先手',     short: '先手', icon: '🎯', group: 'combat',    kind: 'pct', base: 0.015 },
    multiHit:     { label: '连击',     short: '连',   icon: '🔗', group: 'combat',    kind: 'pct', base: 0.008 },
    bossDamage:   { label: '首领伤',   short: '首领', icon: '👑', group: 'combat',    kind: 'pct', base: 0.012 },
    eliteDamage:  { label: '精英伤',   short: '精英', icon: '⭐', group: 'combat',    kind: 'pct', base: 0.01 },
    mythicDamage: { label: '神话伤',   short: '神话', icon: '🌸', group: 'combat',    kind: 'pct', base: 0.01 },
    execution:    { label: '斩杀',     short: '斩',   icon: '💀', group: 'combat',    kind: 'pct', base: 0.01 },
    afflictDamage:{ label: '词条伤',   short: '词条', icon: '🏷️', group: 'combat',    kind: 'pct', base: 0.01 },
    resilience:   { label: '坚韧',     short: '韧',   icon: '💎', group: 'defense',   kind: 'pct', base: 0.012 },
    fireDamage:   { label: '火焰伤',   short: '火',   icon: '🔥', group: 'elemental', kind: 'pct', base: 0.012 },
    iceDamage:    { label: '冰霜伤',   short: '冰',   icon: '❄️', group: 'elemental', kind: 'pct', base: 0.012 },
    lightningDamage:{ label: '雷霆伤', short: '雷',   icon: '⚡', group: 'elemental', kind: 'pct', base: 0.011 },
    poisonDamage: { label: '剧毒伤',   short: '毒',   icon: '☠️', group: 'elemental', kind: 'pct', base: 0.01 },
    arcaneDamage: { label: '奥术伤',   short: '奥',   icon: '🔮', group: 'elemental', kind: 'pct', base: 0.011 },
    holyPower:    { label: '圣光',     short: '圣',   icon: '☀️', group: 'elemental', kind: 'pct', base: 0.01 },
    shadowPower:  { label: '暗影',     short: '影',   icon: '🌑', group: 'elemental', kind: 'pct', base: 0.01 },
    elemental:    { label: '元素伤',   short: '元素', icon: '🌊', group: 'elemental', kind: 'pct', base: 0.012 },
    fireResist:   { label: '火抗',     short: '火抗', icon: '🔥', group: 'elemental', kind: 'pct', base: 0.01 },
    iceResist:    { label: '冰抗',     short: '冰抗', icon: '❄️', group: 'elemental', kind: 'pct', base: 0.01 },
    poisonResist: { label: '毒抗',     short: '毒抗', icon: '☠️', group: 'elemental', kind: 'pct', base: 0.01 },
    curseResist:  { label: '诅咒抗性', short: '咒抗', icon: '🛡️', group: 'chaos',     kind: 'pct', base: 0.01 },
    chaosPower:   { label: '混沌之力', short: '混沌', icon: '🌀', group: 'chaos',     kind: 'pct', base: 0.01 },
    cursePower:   { label: '诅咒之力', short: '诅咒', icon: '☠️', group: 'chaos',     kind: 'pct', base: 0.009 },
    doomPower:    { label: '末日之力', short: '末日', icon: '💀', group: 'chaos',     kind: 'pct', base: 0.009 },
    entropy:      { label: '熵能',     short: '熵',   icon: '♾️', group: 'chaos',     kind: 'pct', base: 0.008 },
    voidPower:    { label: '虚空之力', short: '虚空', icon: '🕳️', group: 'chaos',     kind: 'pct', base: 0.01 },
    spiritCharge: { label: '精灵充能', short: '充能', icon: '🧚', group: 'spirit',    kind: 'pct', base: 0.012 },
    spiritHeal:   { label: '精灵治疗', short: '灵疗', icon: '💞', group: 'spirit',    kind: 'pct', base: 0.01 },
    spiritBond:   { label: '亲密度',   short: '亲密', icon: '💖', group: 'spirit',    kind: 'pct', base: 0.008 },
    spiritStrike: { label: '灵击伤',   short: '灵击', icon: '⚡', group: 'spirit',    kind: 'pct', base: 0.012 },
    resonanceGain:{ label: '虚空共鸣', short: '共鸣', icon: '💠', group: 'spirit',    kind: 'pct', base: 0.01 },
    wisdom:       { label: '智慧',     short: '智',   icon: '📖', group: 'spirit',    kind: 'pct', base: 0.008 },
    battleReward: { label: '战利赏金', short: '战利', icon: '💰', group: 'utility',   kind: 'pct', base: 0.01 },
    currencyGain: { label: '秘境币',   short: '币',   icon: '🪙', group: 'utility',   kind: 'pct', base: 0.01 },
    comboBoost:   { label: '连击赏金', short: '连击', icon: '🌀', group: 'growth',    kind: 'pct', base: 0.008 },
    affixHunter:  { label: '词条赏金', short: '词条', icon: '🏷️', group: 'growth',    kind: 'pct', base: 0.01 },
    relicLuck:    { label: '遗物运',   short: '遗运', icon: '✨', group: 'utility',   kind: 'pct', base: 0.008 },
    equipDrop:    { label: '装备掉率', short: '装备', icon: '⚔️', group: 'growth',    kind: 'pct', base: 0.006 },
    timeSave:     { label: '省时',     short: '时',   icon: '⏱️', group: 'utility',   kind: 'pct', base: 0.008 },
    timeGain:     { label: '时之馈赠', short: '时赠', icon: '⏳', group: 'utility',   kind: 'pct', base: 0.006 },
    trapResist:   { label: '陷抗',     short: '陷抗', icon: '🔮', group: 'defense',   kind: 'pct', base: 0.01 },
    exploreBonus: { label: '探索收益', short: '探索', icon: '🧭', group: 'utility',   kind: 'pct', base: 0.008 },
    restBonus:    { label: '休息收益', short: '休息', icon: '🛏️', group: 'utility',   kind: 'pct', base: 0.008 },
    gambleLuck:   { label: '赌运',     short: '赌',   icon: '🎲', group: 'utility',   kind: 'pct', base: 0.008 },
    eventLuck:    { label: '事件运',   short: '事件', icon: '🎭', group: 'utility',   kind: 'pct', base: 0.008 },
    specialRoom:  { label: '特殊房',   short: '特房', icon: '🏛️', group: 'growth',    kind: 'pct', base: 0.006 },
    swiftness:    { label: '迅捷',     short: '捷',   icon: '🏃', group: 'utility',   kind: 'pct', base: 0.008 },
    fortune:      { label: '运势',     short: '运',   icon: '🍀', group: 'utility',   kind: 'pct', base: 0.008 },
    chronoBoost:  { label: '时序加速', short: '时序', icon: '⌛', group: 'utility',   kind: 'pct', base: 0.008 },
    floorBonus:   { label: '层间加成', short: '层间', icon: '📶', group: 'growth',    kind: 'pct', base: 0.006 },
    memeBonus:    { label: '梗房收益', short: '梗',   icon: '🃏', group: 'growth',    kind: 'pct', base: 0.008 }
};

const TSR_EQUIP_STAT_GROUPS = {
    combat:    { label: '战斗', icon: '⚔️' },
    defense:   { label: '防御', icon: '🛡️' },
    utility:   { label: '辅助', icon: '🎒' },
    spirit:    { label: '精灵', icon: '🧚' },
    elemental: { label: '元素', icon: '🌊' },
    chaos:     { label: '混沌', icon: '🌀' },
    growth:    { label: '成长', icon: '📈' }
};

const TSR_EQUIP_NAME_ADJECTIVES = [
    '勇猛的', '幽暗的', '璀璨的', '寂灭的', '苍蓝的', '赤红的', '古老的', '新生的', '破碎的', '完整的',
    '凋零的', '复苏的', '狂怒的', '静谧的', '灼热的', '冰冷的', '神圣的', '邪异的', '轻盈的', '沉重的',
    '迅捷的', '迟缓的', '锋利的', '钝化的', '闪耀的', '晦暗的', '永恒的', '瞬息的', '深渊的', '天穹的',
    '星陨的', '月华的', '日蚀的', '雷暴的', '霜冻的', '烈焰的', '翡翠的', '紫晶的', '黄金铸的', '秘银锻的'
];

const TSR_EQUIP_NAME_EPITHETS = [
    '破晓', '断罪', '归墟', '裂空', '镇魂', '猎影', '逐日', '覆海', '焚天', '坠星',
    '凝时', '逆流', '终焉', '起源', '湮灭', '轮回', '天罚', '地裂', '龙吟', '凤鸣',
    '霜华', '雷劫', '灵潮', '星落', '月蚀', '日冕', '虚空', '奇点', '时蚀', '魂缚'
];

const TSR_EQUIP_NAME_PREFIXES = [
    '流光', '逆流', '星辉', '虚空', '秘银', '锈迹', '终焉', '时序', '灵锻', '裂隙',
    '苍狼', '赤焰', '碧涛', '紫电', '金乌', '银月', '玄铁', '寒霜', '烈阳', '幽冥',
    '天启', '地脉', '龙牙', '凤羽', '麒麟', '饕餮', '烛龙', '白泽', '太初', '混沌',
    '星轨', '月轮', '日珥', '雷纹', '冰魄', '炎心', '灵泉', '魂铸', '神锻', '魔蚀'
];

const TSR_EQUIP_NAME_SUFFIX = {
    weapon: [
        '之刃', '战刃', '断剑', '长枪', '权杖', '巨斧', '弯刀', '重锤', '细剑', '双刃',
        '裂刃', '神枪', '魔杖', '骨矛', '光剑', '暗刃', '雷刃', '霜刃', '炎刃', '时刃',
        '裁决', '审判', '灭世', '开天', '镇岳', '诛邪', '猎魔', '斩龙', '破军', '凌霄'
    ],
    armor: [
        '战甲', '披风', '护胸', '壁垒', '鳞甲', '灵袍', '重铠', '轻甲', '法袍', '胸甲',
        '肩甲', '腿甲', '头盔', '护手', '战裙', '锁子甲', '板甲', '藤甲', '圣袍', '魔铠',
        '天衣', '地裳', '龙鳞', '凤羽', '星纱', '月华', '日冕', '霜甲', '炎铠', '时铠'
    ],
    ring: [
        '之戒', '诺言', '信物', '灵环', '指环', '魔戒', '圣戒', '魂环', '契约', '誓约',
        '星环', '月环', '日环', '雷环', '霜环', '炎环', '时环', '空环', '灵印', '刻印',
        '统御', '裁决', '守护', '猎杀', '祈愿', '命运', '轮回', '永恒', '湮灭', '奇点'
    ],
    chronos: [
        '时环', '沙漏', '罗盘', '刻印', '怀表', '齿轮', '日晷', '灵钟', '时轮', '沙钟',
        '星盘', '月盘', '时钥', '空钟', '逆针', '顺针', '时漏', '刻盘', '灵砂', '时晶',
        '终焉钟', '起源轮', '轮回盘', '湮灭砂', '奇点核', '虚空针', '天时针', '地脉轮', '灵息表', '魂砂漏'
    ]
};

const TSR_EQUIP_AFFIX_POOL = [
    { id: 'fierce', name: '凶猛', stats: { attack: [0.03, 0.07] }, weight: 12, minTier: 0 },
    { id: 'vitality', name: '生机', stats: { health: [0.03, 0.08] }, weight: 12, minTier: 0 },
    { id: 'precision', name: '精准', stats: { critRate: [0.015, 0.04] }, weight: 10, minTier: 0 },
    { id: 'devastate', name: '毁灭', stats: { critDamage: [0.04, 0.1] }, weight: 9, minTier: 1 },
    { id: 'bulwark', name: '壁垒', stats: { counterReduce: [0.02, 0.05] }, weight: 9, minTier: 0 },
    { id: 'leech', name: '汲取', stats: { lifeSteal: [0.008, 0.02] }, weight: 8, minTier: 1 },
    { id: 'bloodlust', name: '血渴', stats: { vampiric: [0.006, 0.015] }, weight: 7, minTier: 2 },
    { id: 'phantom', name: '幻影', stats: { dodge: [0.006, 0.018] }, weight: 8, minTier: 1 },
    { id: 'plated', name: '镀甲', stats: { armor: [0.01, 0.025] }, weight: 9, minTier: 1 },
    { id: 'pierce', name: '破甲', stats: { pen: [0.008, 0.02] }, weight: 8, minTier: 1 },
    { id: 'overcharge', name: '过载', stats: { damageAmp: [0.015, 0.035] }, weight: 8, minTier: 2 },
    { id: 'mending', name: '愈疗', stats: { healAmp: [0.012, 0.03] }, weight: 7, minTier: 1 },
    { id: 'renewal', name: '回春', stats: { regen: [0.004, 0.012] }, weight: 7, minTier: 1 },
    { id: 'barbed', name: '倒刺', stats: { thorns: [0.004, 0.012] }, weight: 6, minTier: 2 },
    { id: 'aegis', name: '神佑', stats: { shield: [0.006, 0.015] }, weight: 7, minTier: 2 },
    { id: 'ambush', name: '伏击', stats: { firstStrike: [0.01, 0.03] }, weight: 8, minTier: 1 },
    { id: 'flurry', name: '乱舞', stats: { multiHit: [0.005, 0.015] }, weight: 7, minTier: 2 },
    { id: 'slayer', name: '屠戮', stats: { bossDamage: [0.01, 0.025] }, weight: 6, minTier: 2 },
    { id: 'hunter', name: '猎手', stats: { eliteDamage: [0.008, 0.02] }, weight: 7, minTier: 1 },
    { id: 'execute', name: '处决', stats: { execution: [0.008, 0.02] }, weight: 6, minTier: 3 },
    { id: 'unyielding', name: '不屈', stats: { resilience: [0.01, 0.025] }, weight: 8, minTier: 1 },
    { id: 'spiritwell', name: '灵泉', stats: { spiritCharge: [0.01, 0.025] }, weight: 7, minTier: 1 },
    { id: 'bounty', name: '赏金', stats: { battleReward: [0.008, 0.02] }, weight: 8, minTier: 0 },
    { id: 'prosper', name: '聚财', stats: { currencyGain: [0.008, 0.02] }, weight: 8, minTier: 0 },
    { id: 'chrono', name: '时省', stats: { timeSave: [0.005, 0.012] }, weight: 7, minTier: 1 },
    { id: 'relicate', name: '遗宝', stats: { relicLuck: [0.006, 0.015] }, weight: 6, minTier: 2 },
    { id: 'ward', name: '避陷', stats: { trapResist: [0.008, 0.02] }, weight: 7, minTier: 1 },
    { id: 'fleet', name: '疾行', stats: { swiftness: [0.005, 0.012] }, weight: 7, minTier: 0 },
    { id: 'sage', name: '贤者', stats: { wisdom: [0.006, 0.015] }, weight: 6, minTier: 2 },
    { id: 'lucky', name: '鸿运', stats: { fortune: [0.006, 0.015] }, weight: 7, minTier: 1 },
    { id: 'voidtouched', name: '虚空', stats: { voidPower: [0.008, 0.02] }, weight: 5, minTier: 3 },
    { id: 'timeshift', name: '时移', stats: { chronoBoost: [0.005, 0.012] }, weight: 6, minTier: 2 },
    { id: 'elemental', name: '元素', stats: { elemental: [0.01, 0.025] }, weight: 7, minTier: 2 },
    { id: 'radiant', name: '圣辉', stats: { holyPower: [0.008, 0.02] }, weight: 6, minTier: 2 },
    { id: 'umbral', name: '幽影', stats: { shadowPower: [0.008, 0.02] }, weight: 6, minTier: 2 },
    { id: 'warlord', name: '战神', stats: { attack: [0.02, 0.05], critRate: [0.01, 0.025] }, weight: 4, minTier: 3 },
    { id: 'titan', name: '泰坦', stats: { health: [0.025, 0.06], armor: [0.008, 0.018] }, weight: 4, minTier: 3 },
    { id: 'assassin', name: '刺客', stats: { critRate: [0.02, 0.04], firstStrike: [0.015, 0.03] }, weight: 4, minTier: 3 },
    { id: 'paladin', name: '圣骑', stats: { health: [0.02, 0.05], healAmp: [0.015, 0.03] }, weight: 4, minTier: 3 },
    { id: 'berserk', name: '狂战', stats: { attack: [0.025, 0.055], damageAmp: [0.01, 0.025] }, weight: 3, minTier: 4 },
    { id: 'chronoLord', name: '时主', stats: { chronoBoost: [0.01, 0.02], timeSave: [0.008, 0.015] }, weight: 3, minTier: 4 },
    { id: 'starBless', name: '星佑', stats: { spiritCharge: [0.015, 0.03], wisdom: [0.008, 0.015] }, weight: 3, minTier: 4 },
    { id: 'mythicFury', name: '神怒', stats: { attack: [0.03, 0.06], bossDamage: [0.015, 0.03] }, weight: 2, minTier: 5 },
    { id: 'mythicAegis', name: '神盾', stats: { health: [0.03, 0.06], resilience: [0.015, 0.03] }, weight: 2, minTier: 5 },
    { id: 'mythicFortune', name: '天运', stats: { currencyGain: [0.015, 0.03], battleReward: [0.012, 0.025] }, weight: 2, minTier: 5 },
    { id: 'blazing', name: '炽焰', stats: { fireDamage: [0.012, 0.028] }, weight: 8, minTier: 1 },
    { id: 'frostbite', name: '霜咬', stats: { iceDamage: [0.012, 0.028] }, weight: 8, minTier: 1 },
    { id: 'stormcall', name: '唤雷', stats: { lightningDamage: [0.01, 0.025] }, weight: 7, minTier: 2 },
    { id: 'venom', name: '剧毒', stats: { poisonDamage: [0.01, 0.024] }, weight: 7, minTier: 1 },
    { id: 'arcanist', name: '奥术', stats: { arcaneDamage: [0.01, 0.025] }, weight: 7, minTier: 2 },
    { id: 'pyroRes', name: '耐火', stats: { fireResist: [0.008, 0.02] }, weight: 6, minTier: 1 },
    { id: 'iceShell', name: '冰壳', stats: { iceResist: [0.008, 0.02] }, weight: 6, minTier: 1 },
    { id: 'antidote', name: '解毒', stats: { poisonResist: [0.008, 0.02] }, weight: 6, minTier: 1 },
    { id: 'curseWard', name: '咒护', stats: { curseResist: [0.008, 0.02] }, weight: 6, minTier: 2 },
    { id: 'chaosSeed', name: '混沌种', stats: { chaosPower: [0.008, 0.02] }, weight: 5, minTier: 3 },
    { id: 'doomMark', name: '末日印', stats: { doomPower: [0.008, 0.018] }, weight: 4, minTier: 4 },
    { id: 'entropyRift', name: '熵裂', stats: { entropy: [0.006, 0.015] }, weight: 4, minTier: 3 },
    { id: 'physical', name: '刚力', stats: { physicalPower: [0.015, 0.035] }, weight: 8, minTier: 0 },
    { id: 'arcane', name: '灵能', stats: { spellPower: [0.015, 0.035] }, weight: 8, minTier: 0 },
    { id: 'bulwark2', name: '铁壁', stats: { block: [0.008, 0.02], armor: [0.008, 0.018] }, weight: 6, minTier: 1 },
    { id: 'parryMaster', name: '招架', stats: { parry: [0.006, 0.016] }, weight: 6, minTier: 2 },
    { id: 'evasive', name: '规避', stats: { evasion: [0.006, 0.015], dodge: [0.004, 0.012] }, weight: 6, minTier: 2 },
    { id: 'mirror', name: '镜反', stats: { reflect: [0.006, 0.015] }, weight: 5, minTier: 2 },
    { id: 'absorbing', name: '吸能', stats: { absorb: [0.006, 0.014] }, weight: 5, minTier: 2 },
    { id: 'counterFury', name: '反击怒', stats: { counterAmp: [0.01, 0.022] }, weight: 5, minTier: 2 },
    { id: 'mythicSlayer', name: '神话猎', stats: { mythicDamage: [0.01, 0.025] }, weight: 4, minTier: 3 },
    { id: 'affixBlade', name: '词条刃', stats: { afflictDamage: [0.01, 0.022], affixHunter: [0.008, 0.018] }, weight: 5, minTier: 2 },
    { id: 'comboKing', name: '连击王', stats: { comboBoost: [0.008, 0.018] }, weight: 6, minTier: 1 },
    { id: 'spiritBond', name: '羁绊', stats: { spiritBond: [0.008, 0.018], spiritHeal: [0.008, 0.016] }, weight: 5, minTier: 2 },
    { id: 'spiritBlade', name: '灵刃', stats: { spiritStrike: [0.01, 0.025] }, weight: 5, minTier: 2 },
    { id: 'resonance', name: '共鸣', stats: { resonanceGain: [0.01, 0.022] }, weight: 4, minTier: 3 },
    { id: 'lootHunter', name: '猎宝', stats: { equipDrop: [0.005, 0.012], relicLuck: [0.006, 0.014] }, weight: 5, minTier: 1 },
    { id: 'explorer', name: '探险', stats: { exploreBonus: [0.008, 0.018] }, weight: 6, minTier: 0 },
    { id: 'restful', name: '安眠', stats: { restBonus: [0.01, 0.022] }, weight: 5, minTier: 1 },
    { id: 'gambler', name: '赌徒', stats: { gambleLuck: [0.008, 0.018] }, weight: 5, minTier: 1 },
    { id: 'eventful', name: '奇遇', stats: { eventLuck: [0.008, 0.016], specialRoom: [0.005, 0.012] }, weight: 5, minTier: 2 },
    { id: 'floorWalker', name: '层行者', stats: { floorBonus: [0.006, 0.014], timeGain: [0.005, 0.012] }, weight: 4, minTier: 2 },
    { id: 'memeLord', name: '梗王', stats: { memeBonus: [0.01, 0.022] }, weight: 4, minTier: 2 },
    { id: 'inferno', name: '炼狱', stats: { fireDamage: [0.02, 0.04], holyPower: [0.01, 0.02] }, weight: 3, minTier: 4 },
    { id: 'blizzard', name: '暴雪', stats: { iceDamage: [0.02, 0.04], iceResist: [0.01, 0.02] }, weight: 3, minTier: 4 },
    { id: 'plague', name: '瘟疫', stats: { poisonDamage: [0.018, 0.035], cursePower: [0.01, 0.02] }, weight: 3, minTier: 4 },
    { id: 'godslayer', name: '弑神', stats: { bossDamage: [0.02, 0.04], mythicDamage: [0.015, 0.03] }, weight: 2, minTier: 5 },
    { id: 'sunder', name: '裂解', stats: { pen: [0.012, 0.028], damageAmp: [0.01, 0.022] }, weight: 6, minTier: 2 },
    { id: 'lifewell', name: '生泉', stats: { health: [0.02, 0.045], regen: [0.005, 0.012] }, weight: 7, minTier: 1 },
    { id: 'stormbrand', name: '雷印', stats: { lightningDamage: [0.015, 0.032], critRate: [0.01, 0.022] }, weight: 5, minTier: 3 },
    { id: 'frostward', name: '霜卫', stats: { iceResist: [0.01, 0.022], block: [0.006, 0.014] }, weight: 5, minTier: 2 },
    { id: 'plagueborn', name: '疫生', stats: { poisonDamage: [0.014, 0.03], cursePower: [0.008, 0.018] }, weight: 5, minTier: 3 },
    { id: 'solarFlare', name: '日耀', stats: { holyPower: [0.012, 0.026], fireDamage: [0.01, 0.02] }, weight: 5, minTier: 3 },
    { id: 'umbralStrike', name: '影刺', stats: { shadowPower: [0.012, 0.026], firstStrike: [0.01, 0.022] }, weight: 5, minTier: 3 },
    { id: 'voidrift2', name: '虚裂', stats: { voidPower: [0.012, 0.028], resonanceGain: [0.008, 0.018] }, weight: 4, minTier: 4 },
    { id: 'chronoSage', name: '时贤', stats: { chronoBoost: [0.01, 0.02], floorBonus: [0.006, 0.014] }, weight: 4, minTier: 3 },
    { id: 'affixSeeker', name: '词条探', stats: { affixHunter: [0.01, 0.022], afflictDamage: [0.008, 0.018] }, weight: 5, minTier: 2 },
    { id: 'spiritWard', name: '灵护', stats: { spiritHeal: [0.01, 0.022], spiritBond: [0.008, 0.016] }, weight: 5, minTier: 2 },
    { id: 'treasureHunter', name: '寻宝', stats: { treasureBonus: [0.01, 0.022], equipDrop: [0.004, 0.01] }, weight: 5, minTier: 1 },
    { id: 'memeCharm', name: '梗符', stats: { memeBonus: [0.012, 0.025] }, weight: 4, minTier: 2 },
    { id: 'doomBrand', name: '末日印', stats: { doomPower: [0.01, 0.02], bossDamage: [0.008, 0.018] }, weight: 3, minTier: 4 },
    { id: 'entropyEdge', name: '熵刃', stats: { entropy: [0.008, 0.018], chaosPower: [0.008, 0.016] }, weight: 4, minTier: 3 },
    { id: 'mythicBloom', name: '神绽', stats: { mythicDamage: [0.012, 0.026], critDamage: [0.02, 0.04] }, weight: 2, minTier: 5 },
    { id: 'guardianSet', name: '守护', stats: { health: [0.018, 0.04], counterReduce: [0.01, 0.022] }, weight: 4, minTier: 3 },
    { id: 'assassin2', name: '暗杀', stats: { dodge: [0.01, 0.022], execution: [0.01, 0.022] }, weight: 4, minTier: 4 },
    { id: 'omnivore', name: '万象', stats: { elemental: [0.012, 0.025], arcaneDamage: [0.01, 0.02] }, weight: 3, minTier: 4 },
    { id: 'jianIntent', name: '剑意', stats: { attack: [0.018, 0.04], critRate: [0.012, 0.028] }, weight: 5, minTier: 2 },
    { id: 'danSpirit', name: '丹灵', stats: { health: [0.015, 0.035], healAmp: [0.01, 0.022] }, weight: 5, minTier: 2 },
    { id: 'leiBrand', name: '雷印', stats: { lightningDamage: [0.014, 0.03], critDamage: [0.012, 0.026] }, weight: 5, minTier: 3 },
    { id: 'zhenSeal', name: '阵印', stats: { counterReduce: [0.012, 0.028], trapResist: [0.008, 0.018] }, weight: 5, minTier: 2 },
    { id: 'daoFlow', name: '道流', stats: { eventLuck: [0.01, 0.022], wisdom: [0.008, 0.016] }, weight: 5, minTier: 2 },
    { id: 'yaoFang', name: '妖锋', stats: { pen: [0.012, 0.026], bossDamage: [0.01, 0.022] }, weight: 4, minTier: 3 },
    { id: 'gachaLuck', name: '欧皇', stats: { gambleLuck: [0.012, 0.025], fortune: [0.008, 0.016] }, weight: 4, minTier: 2 },
    { id: 'vipGlow', name: 'VIP辉', stats: { currencyGain: [0.012, 0.026], treasureBonus: [0.01, 0.02] }, weight: 4, minTier: 3 },
    { id: 'guildHonor', name: '战勋', stats: { battleReward: [0.012, 0.026], comboBoost: [0.008, 0.018] }, weight: 5, minTier: 2 },
    { id: 'seasonMark', name: '赛季印', stats: { spiritCharge: [0.012, 0.026], floorBonus: [0.006, 0.014] }, weight: 4, minTier: 3 },
    { id: 'jianmoSoul', name: '剑魔魂', stats: { attack: [0.025, 0.05], critDamage: [0.02, 0.04] }, weight: 2, minTier: 5 },
    { id: 'yaohuangCrown', name: '妖皇冕', stats: { bossDamage: [0.018, 0.035], mythicDamage: [0.012, 0.026] }, weight: 2, minTier: 5 },
    { id: 'minggeMark', name: '命格印', stats: { attack: [0.014, 0.03], eventLuck: [0.008, 0.016] }, weight: 4, minTier: 3 },
    { id: 'chainBrand', name: '链印', stats: { eventLuck: [0.012, 0.025], currencyGain: [0.008, 0.016] }, weight: 4, minTier: 2 },
    { id: 'fateThread', name: '命线', stats: { gambleLuck: [0.01, 0.022], fortune: [0.008, 0.015] }, weight: 4, minTier: 3 },
    { id: 'resonanceHum', name: '共鸣', stats: { treasureBonus: [0.01, 0.022], health: [0.012, 0.026] }, weight: 4, minTier: 2 }
];

const TSR_EQUIP_AFFIX_COUNT = { common: [0, 1], uncommon: [1, 2], rare: [1, 3], epic: [2, 3], legendary: [3, 4], mythic: [4, 5] };

function getTsrEquipStatKeys() {
    return Object.keys(TSR_EQUIP_STAT_META);
}

function createEmptyTsrEquipStats() {
    const s = {};
    getTsrEquipStatKeys().forEach(k => { s[k] = 0; });
    return s;
}

function getTsrEquipTierIdx(tier) {
    const order = typeof TSR_EQUIP_TIER_ORDER !== 'undefined' ? TSR_EQUIP_TIER_ORDER : ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
    const idx = order.indexOf(tier);
    return idx < 0 ? 0 : idx;
}

function getTsrEquipTierStyle(tier) {
    return TSR_EQUIP_TIER_STYLE[tier] || TSR_EQUIP_TIER_STYLE.common;
}

function mergeTsrEquipStatsInto(target, source, mult) {
    if (!source) return target;
    mult = mult || 1;
    Object.entries(source).forEach(([k, v]) => {
        const n = Number(v) || 0;
        if (!n) return;
        target[k] = Math.round(((target[k] || 0) + n * mult) * 1000) / 1000;
    });
    return target;
}

function rollAffixStatValue(range, tierMult, floorScale) {
    const lo = range[0], hi = range[1];
    const v = lo + Math.random() * (hi - lo);
    return Math.round(v * tierMult * floorScale * 1000) / 1000;
}

function rollTsrEquipAffixes(tier, opts) {
    const tierIdx = getTsrEquipTierIdx(tier);
    const countRange = TSR_EQUIP_AFFIX_COUNT[tier] || [0, 1];
    const count = countRange[0] + Math.floor(Math.random() * (countRange[1] - countRange[0] + 1));
    if (!count) return [];
    const floor = opts?.floor || 1;
    const floorScale = 1 + (Math.max(1, floor) - 1) * 0.012;
    const tierMult = 1 + tierIdx * 0.15;
    const pool = TSR_EQUIP_AFFIX_POOL.filter(a => (a.minTier || 0) <= tierIdx);
    const picked = [];
    const used = new Set();
    for (let i = 0; i < count && pool.length; i++) {
        const avail = pool.filter(a => !used.has(a.id));
        if (!avail.length) break;
        const total = avail.reduce((s, a) => s + (a.weight || 1), 0);
        let roll = Math.random() * total;
        let affix = avail[avail.length - 1];
        for (const a of avail) {
            roll -= a.weight || 1;
            if (roll <= 0) { affix = a; break; }
        }
        used.add(affix.id);
        const stats = {};
        Object.entries(affix.stats).forEach(([k, range]) => {
            stats[k] = rollAffixStatValue(range, tierMult, floorScale);
        });
        picked.push({ id: affix.id, name: affix.name, stats });
    }
    return picked;
}

function buildTsrEquipDisplayName(opts) {
    if (opts?.fixedName) return opts.fixedName;
    const prefix = opts?.prefix || TSR_EQUIP_NAME_PREFIXES[Math.floor(Math.random() * TSR_EQUIP_NAME_PREFIXES.length)];
    const slot = opts?.slot || 'weapon';
    const suffixPool = TSR_EQUIP_NAME_SUFFIX[slot] || TSR_EQUIP_NAME_SUFFIX.weapon;
    const suffix = suffixPool[Math.floor(Math.random() * suffixPool.length)];
    const tierIdx = getTsrEquipTierIdx(opts?.tier);
    let name = prefix + suffix;
    if (tierIdx >= 2 && Math.random() < 0.45) {
        const epithet = TSR_EQUIP_NAME_EPITHETS[Math.floor(Math.random() * TSR_EQUIP_NAME_EPITHETS.length)];
        name = prefix + '·' + epithet + suffix;
    }
    if (tierIdx >= 1 && Math.random() < 0.38) {
        const adj = TSR_EQUIP_NAME_ADJECTIVES[Math.floor(Math.random() * TSR_EQUIP_NAME_ADJECTIVES.length)];
        name = adj + name;
    }
    if (tierIdx >= 4 && Math.random() < 0.22) {
        const epithet = TSR_EQUIP_NAME_EPITHETS[Math.floor(Math.random() * TSR_EQUIP_NAME_EPITHETS.length)];
        name = '『' + epithet + '』' + name;
    }
    return name;
}

function formatTsrEquipStatText(stats, opts) {
    if (!stats) return '';
    opts = opts || {};
    const parts = [];
    getTsrEquipStatKeys().forEach(k => {
        const v = Number(stats[k]) || 0;
        if (!v) return;
        const meta = TSR_EQUIP_STAT_META[k];
        if (!meta) return;
        if (meta.kind === 'pct') parts.push(`${meta.short}+${(v * 100).toFixed(v < 0.01 ? 1 : 0)}%`);
    });
    if (opts.enhanceLevel > 0) parts.push(`+${opts.enhanceLevel}`);
    if (opts.exclusive) parts.push('传说');
    return parts.join(' · ') || '无属性';
}

function formatTsrEquipAffixLine(affixes, maxShow) {
    if (!affixes?.length) return '';
    const show = affixes.slice(0, maxShow || 4);
    return show.map(a => `<span class="tsr-equip-affix-tag">${a.name}</span>`).join('');
}

function formatTsrEquipNameHtml(item) {
    if (!item) return '';
    const style = getTsrEquipTierStyle(item.tier);
    const cls = style.css + (style.gradient ? ' tsr-eq-name-gradient' : '') + (item.exclusive ? ' tsr-eq-name-exclusive' : '');
    const star = item.exclusive ? ' ★' : '';
    const lvl = item.enhanceLevel ? ` <span class="tsr-eq-enhance-lv">+${item.enhanceLevel}</span>` : '';
    return `<span class="tsr-eq-name ${cls}">${item.icon || ''} ${item.name || ''}${star}</span>${lvl}`;
}

function formatTsrEquipTierBadge(tier) {
    const style = getTsrEquipTierStyle(tier);
    const cls = style.css + (style.gradient ? ' tsr-eq-tier-gradient' : '');
    return `<span class="tsr-eq-tier-badge ${cls}">${style.label}</span>`;
}

function recordTsrEquipAffixCodex(affixes) {
    if (!affixes?.length || typeof player === 'undefined') return;
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return;
    const tsr = player.timeSecretRealm;
    if (!tsr) return;
    if (!tsr.codex) tsr.codex = { rooms: {}, relics: {}, elites: 0, gambles: 0 };
    if (!tsr.codex.equipmentAffixes) tsr.codex.equipmentAffixes = {};
    affixes.forEach(a => {
        if (a?.id) tsr.codex.equipmentAffixes[a.id] = (tsr.codex.equipmentAffixes[a.id] || 0) + 1;
    });
}

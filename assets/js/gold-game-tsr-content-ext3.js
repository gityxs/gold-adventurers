/**
 * 时光秘境 · 内容扩展第三波（仙侠/玄幻/运营梗主题）
 */
const TSR_CONTENT3_MONSTER_BATTLE = [
    { id: 'jianying', name: '剑影残灵', icon: '⚔️', tier: 'common', intro: '「一剑未出，杀意已至。」', win: '剑影消散于风中。', skill: 'burst', skillChance: 0.22 },
    { id: 'danling', name: '丹灵微粒', icon: '💊', tier: 'common', intro: '「丹香扑鼻，副作用未知。」', win: '丹灵被炼化吸收。', skill: 'heal', skillChance: 0.2, skillValue: 0.06 },
    { id: 'zhenghun', name: '阵纹游魂', icon: '🔮', tier: 'uncommon', intro: '「踏入此阵，便无退路。」', win: '阵纹破碎。', skill: 'slow', skillChance: 0.26 },
    { id: 'leiguu', name: '雷蛊', icon: '⚡', tier: 'uncommon', intro: '「天劫未满，先劈你。」', win: '雷蛊被避雷针引走。', skill: 'timeDrain', skillChance: 0.28, skillValue: 4 },
    { id: 'xinmo', name: '心魔残念', icon: '😈', tier: 'rare', intro: '「你害怕的，是我。」', win: '心魔被道心镇压。', skill: 'curse', skillChance: 0.3 },
    { id: 'lingfeng', name: '灵风小妖', icon: '🌬️', tier: 'common', intro: '「呼——你的充能真香。」', win: '小妖被灵盾弹开。', skill: 'spiritDrain', skillChance: 0.24, skillValue: 0.12 },
    { id: 'fuzhougui', name: '符咒鬼', icon: '📜', tier: 'uncommon', intro: '「急急如律令——无效。」', win: '符咒自燃。', skill: 'shield', skillChance: 0.24, skillValue: 0.1 },
    { id: 'yaoshou', name: '妖兽幼崽', icon: '🐾', tier: 'common', intro: '「嗷呜！（翻译：打钱）」', win: '幼崽逃回山林。', skill: 'rage', skillChance: 0.2 },
    { id: 'lingmai', name: '灵脉蠕虫', icon: '🪱', tier: 'rare', intro: '「灵脉是我的，你也是。」', win: '蠕虫被灵脉反噬。', skill: 'spiritDrain', skillChance: 0.3, skillValue: 0.14 },
    { id: 'jianqi', name: '剑气碎片', icon: '✨', tier: 'epic', intro: '「一缕剑气，足以封喉。」', win: '剑气归于剑冢。', skill: 'burst', skillChance: 0.32 },
    { id: 'yaodan', name: '妖丹残核', icon: '🔴', tier: 'rare', intro: '「吞我者，必遭反噬。」', win: '妖丹碎裂。', skill: 'reflect', skillChance: 0.26, skillValue: 0.05 },
    { id: 'moyin', name: '魔音魅影', icon: '🎵', tier: 'uncommon', intro: '「听一曲，少十年。」', win: '魅影被耳塞封印。', skill: 'slow', skillChance: 0.28 },
    { id: 'tianlei', name: '天雷微粒', icon: '🌩️', tier: 'epic', intro: '「渡劫？先过我这关。」', win: '雷微粒被引雷针吸收。', skill: 'overload', skillChance: 0.3 },
    { id: 'hunling', name: '魂灵残影', icon: '👻', tier: 'legendary', intro: '「阳寿未尽，阴寿已尽。」', win: '魂灵超度。', skill: 'bondBreak', skillChance: 0.32, skillValue: 4 },
    { id: 'taowu', name: '梼杌幼兽', icon: '🦁', tier: 'mythic', intro: '「上古四凶，未成年版。」', win: '幼兽被收进灵兽袋。', skill: 'phaseWalk', skillChance: 0.35 }
];

const TSR_CONTENT3_MONSTER_ELITE = [
    { id: 'jianxiu', name: '剑修统领', icon: '⚔️', tier: 'epic', intro: '「剑意纵横三万里。」', win: '统领剑断。', skill: 'rage', skillChance: 0.38 },
    { id: 'danshi', name: '丹师督军', icon: '⚗️', tier: 'legendary', intro: '「炸炉是常态，成功是意外。」', win: '督军丹炉熄火。', skill: 'burst', skillChance: 0.4 },
    { id: 'zhenfa', name: '阵法大师', icon: '🔯', tier: 'epic', intro: '「此阵名为——出不去。」', win: '阵眼被破。', skill: 'shield', skillChance: 0.4, skillValue: 0.2 },
    { id: 'leijun', name: '雷劫督军', icon: '⚡', tier: 'legendary', intro: '「九重雷劫，先劈精英。」', win: '督军避雷成功（你赢了）。', skill: 'timeDrain', skillChance: 0.42, skillValue: 8 },
    { id: 'yaowang', name: '妖王先锋', icon: '👹', tier: 'mythic', intro: '「妖族永不为奴——除非加钱。」', win: '先锋溃逃。', skill: 'spiritDrain', skillChance: 0.44, skillValue: 0.2 },
    { id: 'lingzun', name: '灵尊禁卫', icon: '🛡️', tier: 'epic', intro: '「灵域规矩，我说了算。」', win: '禁卫灵力耗尽。', skill: 'armorBreak', skillChance: 0.36 },
    { id: 'moxiu', name: '魔修统领', icon: '🌑', tier: 'legendary', intro: '「正道？不过是另一种魔。」', win: '统领被正道之光晃瞎。', skill: 'curse', skillChance: 0.4 },
    { id: 'jianhun', name: '剑魂元帅', icon: '👻', tier: 'epic', intro: '「人剑合一——我是剑。」', win: '剑魂归鞘。', skill: 'reflect', skillChance: 0.34, skillValue: 0.08 },
    { id: 'yaojun', name: '妖君巡使', icon: '🦊', tier: 'legendary', intro: '「九尾一条，命一条。」', win: '巡使断尾逃生。', skill: 'dodge', skillChance: 0.38 },
    { id: 'tianbing', name: '天兵校尉', icon: '🏹', tier: 'mythic', intro: '「天庭编制，不得擅离职守。」', win: '校尉被记过。', skill: 'rage', skillChance: 0.42 },
    { id: 'hunshi', name: '魂师统领', icon: '💀', tier: 'epic', intro: '「你的魂魄，成色不错。」', win: '统领魂飞魄散。', skill: 'bondBreak', skillChance: 0.4, skillValue: 6 },
    { id: 'xulian', name: '虚炼督军', icon: '🕳️', tier: 'mythic', intro: '「炼虚期？先炼你的时间。」', win: '督军虚境崩塌。', skill: 'overload', skillChance: 0.44 }
];

const TSR_CONTENT3_MONSTER_BOSS = [
    { id: 'jianmozun', name: '剑魔尊', icon: '⚔️', tier: 'legendary', intro: '「万剑归宗，宗的是我。」', win: '剑魔尊封印于剑冢。', skill: 'rage', skillChance: 0.48 },
    { id: 'dandaozu', name: '丹道祖师', icon: '⚗️', tier: 'legendary', intro: '「九转金丹，一转转晕。」', win: '祖师丹炉炸炉。', skill: 'heal', skillChance: 0.46, skillValue: 0.12 },
    { id: 'leijietian', name: '雷劫天尊', icon: '🌩️', tier: 'mythic', intro: '「天劫九九，你先挨八十一。」', win: '天尊引雷自劈。', skill: 'timeDrain', skillChance: 0.52, skillValue: 12 },
    { id: 'xinmowang', name: '心魔王', icon: '😈', tier: 'legendary', intro: '「战胜我，先战胜自己。」', win: '心魔消散，道心通明。', skill: 'curse', skillChance: 0.45 },
    { id: 'zhenfadi', name: '阵法帝', icon: '🔯', tier: 'mythic', intro: '「天地为盘，众生为子。」', win: '帝座阵眼被破。', skill: 'shield', skillChance: 0.5, skillValue: 0.3 },
    { id: 'yaohuang', name: '妖皇', icon: '👑', tier: 'mythic', intro: '「人族？不过是口粮。」', win: '妖皇退位。', skill: 'spiritDrain', skillChance: 0.48, skillValue: 0.25 },
    { id: 'lingyuan', name: '灵源之主', icon: '💧', tier: 'legendary', intro: '「灵脉枯竭？从你开始。」', win: '灵源重涌。', skill: 'spiritDrain', skillChance: 0.44, skillValue: 0.2 },
    { id: 'huntdi', name: '混沌帝', icon: '🌀', tier: 'mythic', intro: '「有序是幻觉，混沌才是永恒。」', win: '帝座归于有序。', skill: 'overload', skillChance: 0.5 }
];

const TSR_CONTENT3_RELIC_EXTRA = {
    jianxin: { name: '剑心石', icon: '⚔️', desc: '攻击+13%，暴击+4%', effect: 'attack', value: 0.13, bonus: { effect: 'critRate', value: 0.04 } },
    danlu: { name: '丹炉残片', icon: '⚗️', desc: '回血感知+，生命+12%', effect: 'health', value: 0.12, bonus: { effect: 'restBonus', value: 0.2 } },
    leifu: { name: '雷符', icon: '⚡', desc: '暴伤+10%，行动-5%', effect: 'critDamage', value: 0.1, bonus: { effect: 'timeSave', value: 0.05 } },
    zhenpan: { name: '阵盘碎片', icon: '🔯', desc: '反击-10%，陷阱-10%', effect: 'counterReduce', value: 0.1, bonus: { effect: 'trapReduce', value: 0.1 } },
    daoxin: { name: '道心玉', icon: '💎', desc: '生命+14%，精灵充能+18%', effect: 'health', value: 0.14, bonus: { effect: 'spiritCharge', value: 0.18 } },
    yaodanRelic: { name: '妖丹残珠', icon: '🔴', desc: '吸血+4%，攻击+8%', effect: 'lifeSteal', value: 0.04, bonus: { effect: 'attack', value: 0.08 } },
    jianmoSeal: { name: '剑魔封印', icon: '⚔️', desc: '【剑魔尊专属】攻击+18%，暴伤+12%', effect: 'attack', value: 0.18, bonus: { effect: 'critDamage', value: 0.12 }, exclusive: 'jianmozun' },
    leijieBrand: { name: '雷劫烙印', icon: '🌩️', desc: '【雷劫天尊专属】暴伤+14%，每层-1秒', effect: 'critDamage', value: 0.14, penalty: { effect: 'floorTimePenalty', value: 1 }, exclusive: 'leijietian' },
    xinmoMirror: { name: '心魔镜', icon: '🪞', desc: '【心魔王专属】生命+12%，反击-12%', effect: 'health', value: 0.12, bonus: { effect: 'counterReduce', value: 0.12 }, exclusive: 'xinmowang' },
    zhenfaCore: { name: '阵法核心', icon: '🔯', desc: '【阵法帝专属】反击-14%，精英币+10%', effect: 'counterReduce', value: 0.14, bonus: { effect: 'eliteCurrency', value: 0.1 }, exclusive: 'zhenfadi' },
    yaohuangFang: { name: '妖皇之牙', icon: '👑', desc: '【妖皇专属】攻击+16%，噬灵强化', effect: 'attack', value: 0.16, bonus: { effect: 'bossAttack', value: 0.1 }, exclusive: 'yaohuang' },
    lingyuanDew: { name: '灵源甘露', icon: '💧', desc: '精灵充能+30%，每层+3秒', effect: 'spiritCharge', value: 0.3, bonus: { effect: 'floorTime', value: 3 } },
    huntianShard: { name: '浑天碎片', icon: '🌀', desc: '虚空共鸣+22%，事件+8%', effect: 'resonanceGain', value: 0.22, bonus: { effect: 'eventBonus', value: 0.08 } },
    gachaToken: { name: '抽卡代币', icon: '🎰', desc: '赌局+12%，事件+8%', effect: 'gamble', value: 0.12, bonus: { effect: 'eventBonus', value: 0.08 } },
    vipBadge: { name: 'VIP徽章', icon: '👑', desc: '秘境币+10%，宝箱+20%', effect: 'currency', value: 0.1, bonus: { effect: 'treasureBonus', value: 0.2 } },
    rankMedal: { name: '战力勋章', icon: '🏅', desc: '攻击+10%，首领攻+10%', effect: 'attack', value: 0.1, bonus: { effect: 'bossAttack', value: 0.1 } },
    guildBanner: { name: '公会战旗', icon: '🚩', desc: '连击+7%，战斗奖励感知+', effect: 'comboBoost', value: 0.07, bonus: { effect: 'battleReward', value: 0.08 } },
    seasonPass: { name: '赛季通行证', icon: '🎫', desc: '事件+10%，特殊房感知+', effect: 'eventBonus', value: 0.1, bonus: { effect: 'comboBoost', value: 0.04 } },
    pityCounter: { name: '保底计数器', icon: '📊', desc: '精英遗物率+8%，币+6%', effect: 'relicMagnet', value: 0.08, bonus: { effect: 'currency', value: 0.06 } },
    whaleScale: { name: '鲸落鳞', icon: '🐋', desc: '秘境币+14%，每层+2秒', effect: 'currency', value: 0.14, bonus: { effect: 'floorTime', value: 2 } }
};

const TSR_CONTENT3_EQUIP_SETS_EXTRA = {
    jianxin: { prefix: '剑心', name: '剑心套', icon: '⚔️', desc2: '攻击+5%', desc4: '攻击+9%，暴击+5%', bonus2: { attack: 0.05 }, bonus4: { attack: 0.09, critRate: 0.05 } },
    leijie: { prefix: '雷劫', name: '雷劫套', icon: '⚡', desc2: '暴伤+6%', desc4: '攻击+8%，暴伤+12%', bonus2: { critDamage: 0.06 }, bonus4: { attack: 0.08, critDamage: 0.12 } },
    danling: { prefix: '丹灵', name: '丹灵套', icon: '💊', desc2: '生命+5%', desc4: '生命+8%，吸血+4%', bonus2: { health: 0.05 }, bonus4: { health: 0.08, lifeSteal: 0.04 } },
    zhenwen: { prefix: '阵纹', name: '阵纹套', icon: '🔯', desc2: '反击-4%', desc4: '生命+7%，反击-8%', bonus2: { counterReduce: 0.04 }, bonus4: { health: 0.07, counterReduce: 0.08 } },
    yaozu: { prefix: '妖族', name: '妖族套', icon: '👹', desc2: '穿透+3%', desc4: '攻击+9%，穿透+5%', bonus2: { pen: 0.03 }, bonus4: { attack: 0.09, pen: 0.05 } },
    daoyun: { prefix: '道韵', name: '道韵套', icon: '☯️', desc2: '攻血+4%', desc4: '攻血+7%，再生+3%', bonus2: { attack: 0.04, health: 0.04 }, bonus4: { attack: 0.07, health: 0.07, regen: 0.03 } },
    jianmoShen: { prefix: '剑魔', name: '剑魔神装', icon: '⚔️', exclusive: true, dropHint: '击败剑魔尊', desc2: '攻击+9%，暴伤+6%', desc4: '攻击+13%，暴击+6%，暴伤+10%', bonus2: { attack: 0.09, critDamage: 0.06 }, bonus4: { attack: 0.13, critRate: 0.06, critDamage: 0.1 } },
    yaohuangShen: { prefix: '妖皇', name: '妖皇战装', icon: '👑', exclusive: true, dropHint: '击败妖皇', desc2: '攻击+8%，生命+6%', desc4: '攻血+11%，穿透+5%', bonus2: { attack: 0.08, health: 0.06 }, bonus4: { attack: 0.11, health: 0.11, pen: 0.05 } }
};

const TSR_CONTENT3_EQUIP_EXCLUSIVE_DROPS_EXTRA = {
    jianmozun: { setId: 'jianmoShen', chance: 0.17, tier: 'legendary' },
    leijietian: { setId: 'leijie', chance: 0.14, tier: 'mythic' },
    xinmowang: { setId: 'daoyun', chance: 0.13, tier: 'legendary' },
    zhenfadi: { setId: 'zhenwen', chance: 0.12, tier: 'mythic' },
    yaohuang: { setId: 'yaohuangShen', chance: 0.15, tier: 'legendary' },
    dandaozu: { setId: 'danling', chance: 0.12, tier: 'legendary' },
    lingyuan: { setId: 'daoyun', chance: 0.11, tier: 'epic' },
    huntdi: { setId: 'jianxin', chance: 0.1, tier: 'mythic' }
};

const TSR_CONTENT3_STAR_FORTUNES_EXTRA = [
    { id: 'jianStar', name: '剑星高照', icon: '⚔️', desc: '攻击+12%，暴击+4%', theme: 'boss' },
    { id: 'danStar', name: '丹星润泽', icon: '💊', desc: '生命+10%，回血+5%', theme: 'heal' },
    { id: 'leiStar', name: '雷星轰鸣', icon: '⚡', desc: '暴伤+10%，每层-1秒', theme: 'boss' },
    { id: 'zhenStar', name: '阵星环绕', icon: '🔯', desc: '反击-10%，陷阱-8%', theme: 'gold' },
    { id: 'yaoStar', name: '妖星现世', icon: '👹', desc: '怪物+8%，奖励+14%', theme: 'danger' },
    { id: 'daoStar', name: '道星清明', icon: '☯️', desc: '事件+12%，特殊房+10%', theme: 'legend' },
    { id: 'gachaStar', name: '抽卡吉星', icon: '🎰', desc: '赌局+14%，事件+10%', theme: 'fortune' },
    { id: 'vipStar', name: 'VIP星辉', icon: '👑', desc: '秘境币+14%，宝箱+15%', theme: 'gold' },
    { id: 'guildStar', name: '公会星潮', icon: '🚩', desc: '战斗奖励+12%，连击感知+', theme: 'boss' },
    { id: 'seasonStar', name: '赛季星运', icon: '🎫', desc: '精灵充能+40%，每层+3秒', theme: 'spirit' }
];

const TSR_CONTENT3_STAR_FORTUNE_EFFECTS_EXTRA = {
    jianStar: { attack: 0.12, critRate: 0.04 },
    danStar: { health: 0.1, spiritHealBonus: 0.05 },
    leiStar: { critDamage: 0.1, floorTime: -1 },
    zhenStar: { counterPenalty: -0.1, trapRate: -0.08 },
    yaoStar: { monsterMult: 0.08, currencyMod: 0.14 },
    daoStar: { eventBonus: 0.12, specialRoomMult: 1.1 },
    gachaStar: { gamble: 0.14, eventBonus: 0.1 },
    vipStar: { currencyMod: 0.14, treasureBonus: 0.15 },
    guildStar: { battleReward: 0.12, comboBoost: 0.05 },
    seasonStar: { spiritMult: 1.4, floorTime: 3 }
};

const TSR_CONTENT3_FATE_CARDS_EXTRA = {
    jianIntent: { id: 'jianIntent', name: '剑意', icon: '⚔️', desc: '攻击+20%，生命-10%', attack: 0.2, health: -0.1, theme: 'boss' },
    danPath: { id: 'danPath', name: '丹道', icon: '💊', desc: '生命+18%，行动+6%', health: 0.18, timeCost: 0.06, theme: 'heal' },
    leiTrial: { id: 'leiTrial', name: '雷劫', icon: '⚡', desc: '攻击+15%，每层-3秒', attack: 0.15, floorTime: -3, theme: 'danger' },
    zhenEye: { id: 'zhenEye', name: '阵眼', icon: '🔯', desc: '反击-12%，陷阱-10%', counterPenalty: -0.12, trapRate: -0.1, theme: 'contract' },
    yaoBlood: { id: 'yaoBlood', name: '妖血', icon: '👹', desc: '怪物+12%，奖励+18%', monsterMult: 0.12, currencyMod: 0.18, theme: 'danger' },
    daoHeart: { id: 'daoHeart', name: '道心', icon: '☯️', desc: '事件+15%，赌局+10%', eventBonus: 0.15, gamble: 0.1, theme: 'legend' },
    gachaOath: { id: 'gachaOath', name: '抽卡誓', icon: '🎰', desc: '赌局+20%，币-8%', gamble: 0.2, currencyPenalty: 0.08, theme: 'fortune' },
    vipPass: { id: 'vipPass', name: 'VIP通', icon: '👑', desc: '秘境币+16%，起始-20秒', currencyMod: 0.16, timeMod: -20, theme: 'gold' },
    guildWar: { id: 'guildWar', name: '公会战', icon: '🚩', desc: '战斗奖励+18%，反击+6%', battleReward: 0.18, counterPenalty: 0.06, theme: 'boss' },
    seasonRush: { id: 'seasonRush', name: '赛季冲', icon: '🎫', desc: '精灵充能+55%，每层+2秒', spiritMult: 1.55, floorTime: 2, theme: 'spirit' }
};

const TSR_CONTENT3_FLOOR_AFFIXES_EXTRA = {
    jianRain: { name: '剑雨', icon: '⚔️', desc: '攻击+16%，怪物+8%', attack: 0.16, monsterMult: 0.08 },
    danFragrance: { name: '丹香', icon: '💊', desc: '生命+10%，回血+6%', health: 0.1, spiritHealBonus: 0.06 },
    leiCloud: { name: '雷云', icon: '⚡', desc: '暴伤+12%，每层-2秒', critDamage: 0.12, floorTime: -2 },
    zhenLock: { name: '阵锁', icon: '🔯', desc: '反击-10%，行动+5%', counterPenalty: -0.1, timeCost: 0.05 },
    yaoTide: { name: '妖潮', icon: '👹', desc: '怪物+14%，赏金+12%', monsterMult: 0.14, currencyMod: 0.12 },
    daoLight: { name: '道光', icon: '☯️', desc: '事件+14%，特殊房+12%', eventBonus: 0.14, specialRoomMult: 1.12 },
    gachaFever: { name: '抽卡狂热', icon: '🎰', desc: '赌局+16%，梗房×1.3', gamble: 0.16, memeMult: 1.3 },
    vipGlow: { name: 'VIP辉光', icon: '👑', desc: '秘境币+16%，宝箱+18%', currencyMod: 0.16, treasureBonus: 0.18 },
    guildWarAffix: { name: '公会战意', icon: '🚩', desc: '战斗奖励+16%，攻击+10%', battleReward: 0.16, attack: 0.1 },
    seasonEnd: { name: '赛季末', icon: '🎫', desc: '精灵充能+80%，每层+4秒', spiritMult: 1.8, floorTime: 4 },
    hunyuan: { name: '混元', icon: '🌀', desc: '攻血+8%，虚空共鸣+25%', attack: 0.08, health: 0.08, resonanceGain: 0.25 },
    tianjie: { name: '天劫', icon: '🌩️', desc: '攻击+20%，每层-4秒，怪物+10%', attack: 0.2, floorTime: -4, monsterMult: 0.1 }
};

const TSR_CONTENT3_FLOOR_AFFIX_THEMES_EXTRA = {
    jianRain: 'boss', danFragrance: 'heal', leiCloud: 'boss', zhenLock: 'contract',
    yaoTide: 'danger', daoLight: 'legend', gachaFever: 'fortune', vipGlow: 'gold',
    guildWarAffix: 'boss', seasonEnd: 'spirit', hunyuan: 'void', tianjie: 'epic'
};

const TSR_CONTENT3_ACHIEVEMENTS_EXTRA = [
    { id: 'contentRoom150', name: '秘境宗师', desc: '累计遭遇150次特殊房间', icon: '🧭', need: { specialRooms: 150 } },
    { id: 'contentMeme80', name: '梗海霸主', desc: '累计遭遇80次恶趣味房间', icon: '🌊', need: { memeRooms: 80 } },
    { id: 'contentRelic65', name: '遗宝宗师', desc: '图鉴解锁65种遗物', icon: '🏺', need: { relicCodex: 65 } },
    { id: 'contentAffix80', name: '词条宗师', desc: '累计击败80只带词条怪物', icon: '🏹', need: { affixKills: 80 } },
    { id: 'contentGeneric80', name: '奇遇宗师', desc: '累计完成80次扩展奇遇房间', icon: '✨', need: { genericContentRooms: 80 } },
    { id: 'contentEquipSet16', name: '十六套藏家', desc: '图鉴记录16种不同套装掉落', icon: '🧩', need: { equipSetTypes: 16 } },
    { id: 'contentMythic60', name: '神话终结者', desc: '累计击败60个神话级怪物', icon: '🌸', need: { mythicKills: 60 } },
    { id: 'jianmoRelic', name: '剑魔认可', desc: '获得剑魔封印遗物', icon: '⚔️' },
    { id: 'leijieRelic', name: '雷劫加身', desc: '获得雷劫烙印遗物', icon: '⚡' },
    { id: 'xinmoRelic', name: '道心通明', desc: '获得心魔镜遗物', icon: '🪞' },
    { id: 'zhenfaRelic', name: '破阵大师', desc: '获得阵法核心遗物', icon: '🔯' },
    { id: 'contentFate40', name: '命运至尊', desc: '使用命运卡通关累计40次', icon: '🎴', need: { fateCardClears: 40 } }
];

const TSR_CONTENT3_CONSUMABLES_EXTRA = {
    jianqiPill: { name: '剑气丹', icon: '⚔️', effect: 'rage', value: 0.3, desc: '攻击+30%持续3次行动' },
    huichunDan: { name: '回春丹', icon: '💊', effect: 'heal', value: 0.45, desc: '恢复45%生命' },
    leijieFu: { name: '避雷符', icon: '⚡', effect: 'counterShield', value: 0.4, desc: '下3次反击伤害减至40%' },
    zhenpanFu: { name: '破阵符', icon: '🔯', effect: 'affixSwap', value: 1, desc: '下一场战斗重铸怪物全部词条' },
    yaodanPowder: { name: '妖丹粉', icon: '🔴', effect: 'dominionElixir', value: 1, desc: '攻击+25%×4，精灵充能+45' },
    daoxinTea: { name: '道心茶', icon: '🍵', effect: 'spiritBond', value: 10, desc: '亲密度+10，精灵经验+50' },
    gachaTicket: { name: '抽卡券', icon: '🎰', effect: 'chaos', value: 1, desc: '随机触发强力的混沌效果' },
    vipCard: { name: 'VIP体验卡', icon: '👑', effect: 'luck', value: 90, desc: '90秒内双倍秘境币' },
    guildToken: { name: '公会战令', icon: '🚩', effect: 'championMedal', value: 1, desc: '攻击+28%×3，战斗奖励+35%' },
    seasonBox: { name: '赛季宝箱', icon: '📦', effect: 'time', value: 42, desc: '增加42秒' },
    leijieShield: { name: '渡劫护符', icon: '🌩️', effect: 'barrier', value: 1, desc: '抵消下一次陷阱' },
    hunyuanBead: { name: '混元珠', icon: '🌀', effect: 'starBurst', value: 1, desc: '满充能觉醒+亲密度+8' }
};

const TSR_CONTENT3_SHOP_EXTRA = {
    spiritExpPack: { name: '精灵经验礼包', description: '立即获得精灵经验+200', cost: 120000, type: 'consumable', effect: 'spirit_exp_200', category: 'spirit', icon: '✨' },
    spiritBondPack: { name: '羁绊礼包', description: '立即获得亲密度+20', cost: 95000, type: 'consumable', effect: 'spirit_bond_20', category: 'spirit', icon: '💞' },
    affixScopePack: { name: '词条镜补给', description: '下次冒险开局携带词条透视镜', cost: 280000, type: 'permanent', effect: 'affix_scope_supply', maxPurchase: 3, purchased: 0, category: 'codex', icon: '🔎' },
    libraryScrollPack2: { name: '秘闻卷轴补给', description: '下次冒险开局携带秘闻卷轴', cost: 260000, type: 'permanent', effect: 'library_scroll_supply', maxPurchase: 3, purchased: 0, category: 'codex', icon: '📜' },
    clearRewardStack: { name: '通关赏增幅', description: '永久通关奖励+6%（限购4）', cost: 340000, type: 'permanent', effect: 'clear_reward', maxPurchase: 4, purchased: 0, category: 'enhance', icon: '🏆' },
    vaultBonusStack: { name: '宝库祝福·进阶', description: '永久宝库收益+15%（限购3）', cost: 290000, type: 'permanent', effect: 'vault_bonus', maxPurchase: 3, purchased: 0, category: 'enhance', icon: '🏦' },
    archonFragmentStack: { name: '主宰残片·进阶', description: '永久灵击+5%（限购3，与残片合计上限+25%）', cost: 310000, type: 'permanent', effect: 'archon_fragment', maxPurchase: 3, purchased: 0, category: 'spirit', icon: '💫' },
    starDomainStack: { name: '星域符印·进阶', description: '永久特殊房+3%（限购2，与符印合计上限+12%）', cost: 270000, type: 'permanent', effect: 'star_domain_sigil', maxPurchase: 2, purchased: 0, category: 'codex', icon: '🌌' }
};

const TSR_CONTENT3_CONTRACTS_EXTRA = {
    xiuxianPath: { name: '修仙契约', desc: '攻血+10%，探索耗时+5%', icon: '☯️', attack: 0.1, health: 0.1, timeCost: 0.05 },
    equipSmith: { name: '锻装契约', desc: '秘境币+10%，精英币-6%', icon: '⚒️', currencyMod: 0.1, eliteCurrencyPenalty: 0.06 },
    relicSeeker: { name: '遗宝契约', desc: '精英遗物率+12%，怪物+8%', icon: '🏺', relicMagnet: 0.12, monsterMult: 0.08, timeMod: -15 },
    thunderTrial: { name: '雷劫契约', desc: '攻击+12%，每层-2秒，反击+6%', icon: '⚡', attack: 0.12, floorTime: -2, counterPenalty: 0.06 },
    daoWanderer: { name: '云游契约', desc: '事件+12%，特殊房+15%，币-5%', icon: '🌄', eventBonus: 0.12, specialRoomMult: 1.15, currencyPenalty: 0.05 }
};

const TSR_CONTENT3_CONTRACT_SYNERGIES_EXTRA = [
    { keys: ['xiuxianPath', 'spiritGuard'], name: '灵修双修', desc: '充能+12%，攻血+5%', bonus: { spiritMult: 1.12, health: 0.05 } },
    { keys: ['thunderTrial', 'affixLord'], name: '雷词条劫', desc: '攻击+6%，词条赏金+10%', bonus: { attack: 0.06, affixReward: 0.1 } },
    { keys: ['relicSeeker', 'codexKeeper'], name: '遗宝图鉴', desc: '特殊房+10%，遗物感知+', bonus: { specialRoomMult: 1.1, affixReward: 0.06 } },
    { keys: ['daoWanderer', 'fortuneSeeker'], name: '云游彩运', desc: '事件+8%，赌局+8%', bonus: { eventBonus: 0.08, gamble: 0.08 } },
    { keys: ['equipSmith', 'ironMan'], name: '钢锻双壁', desc: '生命+8%，币+5%', bonus: { health: 0.08, currencyMod: 0.05 } }
];

const TSR_CONTENT3_WEEKLY_MODIFIERS = [
    { id: 'jianWeek', name: '剑修周', icon: '⚔️', desc: '攻击+10%，战斗奖励+10%' },
    { id: 'danWeek', name: '丹道周', icon: '💊', desc: '生命+10%，回血+5%' },
    { id: 'leiWeek', name: '雷劫周', icon: '⚡', desc: '暴伤+10%，每层-1秒' },
    { id: 'gachaWeek', name: '抽卡周', icon: '🎰', desc: '赌局+15%，事件+10%' },
    { id: 'vipWeek', name: 'VIP周', icon: '👑', desc: '秘境币+12%，宝箱+15%' },
    { id: 'guildWeek', name: '公会周', icon: '🚩', desc: '战斗奖励+14%，精英币+10%' }
];

const TSR_CONTENT3_WEEKLY_MODIFIER_EFFECTS = {
    jianWeek: { attack: 0.1, battleReward: 0.1 },
    danWeek: { health: 0.1, spiritHealBonus: 0.05 },
    leiWeek: { critDamage: 0.1, floorTime: -1 },
    gachaWeek: { gamble: 0.15, eventBonus: 0.1 },
    vipWeek: { currencyMod: 0.12, treasureBonus: 0.15 },
    guildWeek: { battleReward: 0.14, eliteCurrencyBonus: 0.1 }
};

const TSR_CONTENT3_TICKER_LINES = [
    '第三波扩展：剑冢、丹房、渡劫台等新房间已开放',
    '剑魔尊、妖皇等首领可掉落传说专属神装',
    '修仙/雷劫/云游等新契约可在开局选用',
    '抽卡周、VIP周等界词轮换加成更丰富',
    '道心茶、渡劫护符等新消耗品已加入掉落池'
];

const TSR_CONTENT3_MEME_ROOM_TYPES_FIXED = [
    'gachashrine', 'pityhall', 'rankboard', 'guildwar', 'seasonpass',
    'viplounge', 'whalepond', 'nerfnotice', 'buffpatch', 'metashift'
];

const TSR_CONTENT3_ROOM_META = {
    jianzhong: { name: '剑冢', icon: '⚔️', color: '#ef4444' },
    danfang: { name: '炼丹房', icon: '⚗️', color: '#f97316' },
    dujietai: { name: '渡劫台', icon: '🌩️', color: '#eab308' },
    zhenyuan: { name: '阵眼园', icon: '🔯', color: '#8b5cf6' },
    lingmaidong: { name: '灵脉洞', icon: '💧', color: '#22d3ee' },
    chuangong: { name: '传功殿', icon: '📜', color: '#a78bfa' },
    yaoyuan: { name: '药园', icon: '🌿', color: '#4ade80' },
    hunxu: { name: '魂墟', icon: '👻', color: '#64748b' },
    tianjie: { name: '天劫台', icon: '⏳', color: '#dc2626' },
    daoyuan: { name: '道院', icon: '☯️', color: '#94a3b8' },
    xianjing: { name: '仙境', icon: '🏔️', color: '#38bdf8' },
    gachashrine: { name: '抽卡神殿', icon: '🎰', color: '#f472b6' },
    pityhall: { name: '保底大厅', icon: '📊', color: '#a855f7' },
    rankboard: { name: '战力排行榜', icon: '🏅', color: '#fbbf24' },
    guildwar: { name: '公会战动员', icon: '🚩', color: '#ef4444' },
    seasonpass: { name: '赛季通行证办', icon: '🎫', color: '#06b6d4' },
    viplounge: { name: 'VIP休息室', icon: '👑', color: '#eab308' },
    whalepond: { name: '鲸落池塘', icon: '🐋', color: '#3b82f6' },
    nerfnotice: { name: '削弱公告栏', icon: '📉', color: '#64748b' },
    buffpatch: { name: '加强补丁站', icon: '📈', color: '#22c55e' },
    metashift: { name: '版本更迭', icon: '🔄', color: '#6366f1' }
};

const TSR_CONTENT3_SPECIAL_ROOM_TYPES_FIXED = [
    'jianzhong', 'danfang', 'dujietai', 'zhenyuan', 'lingmaidong',
    'chuanggong', 'yaoyuan', 'hunxu', 'tianjie', 'daoyuan', 'xianjing'
];

const TSR_CONTENT3_ROOM_DEFS = {
    jianzhong: {
        title: '⚔️ 剑冢', intro: '万剑低鸣，剑意择主。',
        options: [
            { id: 'draw', label: '拔剑 · 攻击+18%×3层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.18, duration: 3 }, timeCost: 20, log: '剑意入体！', theme: 'boss' } },
            { id: 'meditate', label: '悟剑 · 暴击+感知', btn: 'tsr-btn-purple', reward: { affixRewardRun: 0.12, currency: 80, timeCost: 16, log: '悟得剑意，词条赏金+12%', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 8, log: '+8秒' } }
        ]
    },
    danfang: {
        title: '⚗️ 炼丹房', intro: '丹香缭绕，炸炉风险自负。',
        options: [
            { id: 'refine', label: '炼丹 · 50%成功回血', btn: 'tsr-btn-gold', reward: { gambleHeal: true, log: '炼丹赌局！', theme: 'heal' } },
            { id: 'steal', label: '偷丹 · +90币', btn: 'tsr-btn-purple', reward: { currency: 90, timeCost: 14, log: '+90币', theme: 'gold' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'huichunDan', log: '获得回春丹' } }
        ]
    },
    dujietai: {
        title: '🌩️ 渡劫台', intro: '天雷滚滚，渡劫还是渡命？',
        options: [
            { id: 'trial', label: '硬抗雷劫 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', voidResonance: 10, log: '雷劫精英战！', theme: 'boss' } },
            { id: 'shield', label: '避雷 · +30秒', btn: 'tsr-btn-safe', reward: { time: 30, timeCost: 22, log: '+30秒', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { voidResonance: 5, log: '虚空共鸣+5' } }
        ]
    },
    zhenyuan: {
        title: '🔯 阵眼园', intro: '阵纹流转，踏错一步困千年。',
        options: [
            { id: 'break', label: '破阵 · 反击减免+12%', btn: 'tsr-btn-gold', reward: { counterShieldRun: 0.12, timeCost: 18, log: '破阵成功，反击减免+12%（本局）', theme: 'contract' } },
            { id: 'learn', label: '学阵 · 预览2层', btn: 'tsr-btn-safe', reward: { oraclePreview: 2, currency: 70, timeCost: 16, log: '预览2层', theme: 'legend' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 10, log: '+10秒' } }
        ]
    },
    lingmaidong: {
        title: '💧 灵脉洞', intro: '灵脉涌动，呼吸都在充能。',
        options: [
            { id: 'absorb', label: '吸纳灵脉 · 充能+50', btn: 'tsr-btn-gold', reward: { spiritCharge: 50, spiritBond: 4, timeCost: 20, log: '灵脉吸纳！', theme: 'spirit' } },
            { id: 'seal', label: '封印灵脉 · +100币', btn: 'tsr-btn-purple', reward: { currency: 100, timeCost: 18, log: '+100币', theme: 'gold' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { spiritExp: 50, log: '精灵经验+50', theme: 'spirit' } }
        ]
    },
    chuanggong: {
        title: '📜 传功殿', intro: '前辈残影：「接我一掌，传你功力。」',
        options: [
            { id: 'accept', label: '接掌 · 攻击+15%×4层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.15, duration: 4 }, heal: 0.08, timeCost: 22, log: '传功成功！', theme: 'boss' } },
            { id: 'decline', label: '婉拒 · +25秒', btn: 'tsr-btn-safe', reward: { time: 25, log: '+25秒', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 60, log: '+60币' } }
        ]
    },
    yaoyuan: {
        title: '🌿 药园', intro: '灵草遍地，采一株少一秒（大概）。',
        options: [
            { id: 'harvest', label: '采药 · +80币+回血10%', btn: 'tsr-btn-gold', reward: { currency: 80, heal: 0.1, timeCost: 14, log: '采药成功！', theme: 'heal' } },
            { id: 'poach', label: '偷药 · 50%双倍或诅咒', btn: 'tsr-btn-risk', reward: { gambleCoin: true, log: '偷药赌局！', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'daoxinTea', log: '获得道心茶' } }
        ]
    },
    hunxu: {
        title: '👻 魂墟', intro: '亡魂低语，慎听。',
        options: [
            { id: 'listen', label: '聆听 · 虚空共鸣+12', btn: 'tsr-btn-purple', reward: { voidResonance: 12, timeCost: 18, log: '虚空共鸣+12', theme: 'void' } },
            { id: 'seal', label: '超度 · +35秒', btn: 'tsr-btn-safe', reward: { time: 35, heal: 0.12, timeCost: 20, log: '+35秒，回血12%', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 55, log: '+55币' } }
        ]
    },
    tianjie: {
        title: '⏳ 天劫台', intro: '九九重劫，先挨第一下。',
        options: [
            { id: 'endure', label: '承受 · -20秒，攻击+22%×3层', btn: 'tsr-btn-risk', reward: { time: -20, buff: { effect: 'attack', value: 0.22, duration: 3 }, log: '劫后余生！', theme: 'boss' } },
            { id: 'escape', label: '遁逃 · +18秒', btn: 'tsr-btn-safe', reward: { time: 18, timeCost: 12, log: '+18秒', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'leijieFu', log: '获得避雷符' } }
        ]
    },
    daoyuan: {
        title: '☯️ 道院', intro: '道法自然，顺便自然扣时间。',
        options: [
            { id: 'meditate', label: '打坐 · 事件+12%×本局', btn: 'tsr-btn-gold', reward: { eventBonusRun: 0.12, spiritCharge: 25, timeCost: 18, log: '道心清明', theme: 'legend' } },
            { id: 'debate', label: '论道 · 50%±30秒', btn: 'tsr-btn-purple', reward: { gambleTime: true, log: '论道赌局！', theme: 'fortune' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 12, log: '+12秒' } }
        ]
    },
    xianjing: {
        title: '🏔️ 仙境', intro: '云雾缭绕，疑似有仙人摆摊。',
        options: [
            { id: 'trade', label: '仙市 · 随机消耗品×2', btn: 'tsr-btn-gold', reward: { consumables: 2, timeCost: 16, log: '仙市交易！', theme: 'gold' } },
            { id: 'bless', label: '仙缘 · +40秒+满充能一半', btn: 'tsr-btn-safe', reward: { time: 40, spiritCharge: 50, timeCost: 22, log: '仙缘加持！', theme: 'spirit' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 95, log: '+95币' } }
        ]
    },
    gachashrine: {
        title: '🎰 抽卡神殿', intro: '「单抽出金，十连保底——骗你的。」',
        options: [
            { id: 'single', label: '单抽 · 50%大丰收', btn: 'tsr-btn-gold', reward: { singularityGamble: true, log: '单抽！', theme: 'fortune' } },
            { id: 'ten', label: '十连 · +120币', btn: 'tsr-btn-purple', reward: { currency: 120, time: -10, timeCost: 16, log: '+120币，-10秒', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'gachaTicket', log: '获得抽卡券' } }
        ]
    },
    pityhall: {
        title: '📊 保底大厅', intro: '「再抽59次必出金。」',
        options: [
            { id: 'pity', label: '触发保底 · 遗物胚', btn: 'tsr-btn-gold', reward: { relicOffer: true, log: '保底触发！', theme: 'relic' } },
            { id: 'count', label: '数保底 · +70币', btn: 'tsr-btn-safe', reward: { currency: 70, timeCost: 12, log: '+70币', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 8, log: '+8秒' } }
        ]
    },
    rankboard: {
        title: '🏅 战力排行榜', intro: '「你排名第9999，加油。」',
        options: [
            { id: 'climb', label: '冲榜 · 攻击+16%×2层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.16, duration: 2 }, timeCost: 14, log: '冲榜buff！', theme: 'boss' } },
            { id: 'flex', label: '晒战力 · +85币', btn: 'tsr-btn-purple', reward: { currency: 85, memeBonus: 0.3, timeCost: 12, log: '下次梗房+30%', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 6, log: '+6秒' } }
        ]
    },
    guildwar: {
        title: '🚩 公会战动员', intro: '「今晚八点，全员上线！」',
        options: [
            { id: 'rally', label: '集结 · 下战奖励+40%', btn: 'tsr-btn-gold', reward: { battleRewardNext: 0.4, timeCost: 16, log: '下战奖励+40%', theme: 'boss' } },
            { id: 'afk', label: '挂机 · +65币', btn: 'tsr-btn-purple', reward: { currency: 65, time: -5, log: '+65币，-5秒', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'guildToken', log: '获得公会战令' } }
        ]
    },
    seasonpass: {
        title: '🎫 赛季通行证办', intro: '「68元解锁高级奖励——秘境币支付。」',
        options: [
            { id: 'buy', label: '氪通行证 · +130币', btn: 'tsr-btn-gold', reward: { currency: 130, timeCost: 20, log: '+130币', theme: 'gold' } },
            { id: 'grind', label: '肝任务 · 精灵经验+80', btn: 'tsr-btn-safe', reward: { spiritExp: 80, timeCost: 18, log: '精灵经验+80', theme: 'spirit' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 10, log: '+10秒' } }
        ]
    },
    viplounge: {
        title: '👑 VIP休息室', intro: '「VIP专属沙发，普通玩家请站。」',
        options: [
            { id: 'lounge', label: '躺平 · +35秒+回血15%', btn: 'tsr-btn-gold', reward: { time: 35, heal: 0.15, timeCost: 14, log: 'VIP待遇！', theme: 'heal' } },
            { id: 'snack', label: '贵宾茶点 · 60秒双倍币', btn: 'tsr-btn-purple', reward: { luckBuff: true, timeCost: 12, log: '60秒双倍币！', theme: 'fortune' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'vipCard', log: '获得VIP体验卡' } }
        ]
    },
    whalepond: {
        title: '🐋 鲸落池塘', intro: '大户撒币，小户捡漏。',
        options: [
            { id: 'scoop', label: '捡漏 · +150币', btn: 'tsr-btn-gold', reward: { currency: 150, timeCost: 18, log: '+150币！', theme: 'gold' } },
            { id: 'watch', label: '围观 · 50%±25秒', btn: 'tsr-btn-risk', reward: { gambleTime: true, log: '围观赌局！', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { voidResonance: 6, log: '虚空共鸣+6' } }
        ]
    },
    nerfnotice: {
        title: '📉 削弱公告栏', intro: '「你常用的Build被削了，请重抽。」',
        options: [
            { id: 'accept', label: '接受削弱 · -15秒，攻击+12%×3层', btn: 'tsr-btn-risk', reward: { time: -15, buff: { effect: 'attack', value: 0.12, duration: 3 }, log: '逆境buff！', theme: 'meme' } },
            { id: 'riot', label: '抗议 · +75币', btn: 'tsr-btn-purple', reward: { currency: 75, timeCost: 14, log: '+75币', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 5, log: '+5秒' } }
        ]
    },
    buffpatch: {
        title: '📈 加强补丁站', intro: '「版本更新：你的职业加强了！」',
        options: [
            { id: 'patch', label: '更新 · 攻击+20%×2层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.2, duration: 2 }, timeCost: 12, log: '补丁加强！', theme: 'boss' } },
            { id: 'reroll', label: '重掷 · 随机奖励', btn: 'tsr-btn-purple', reward: { randomLoot: true, log: '重掷！', theme: 'fortune' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 58, log: '+58币' } }
        ]
    },
    metashift: {
        title: '🔄 版本更迭', intro: '「新meta来了，旧meta埋了。」',
        options: [
            { id: 'adapt', label: '适应版本 · 事件+10%×本局', btn: 'tsr-btn-gold', reward: { eventBonusRun: 0.1, affixRewardRun: 0.1, timeCost: 16, log: '适应新版本！', theme: 'rainbow' } },
            { id: 'refuse', label: '坚守旧版 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', log: '精英战！', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 9, log: '+9秒' } }
        ]
    }
};

function applyTsrContent3ShopEffect(itemKey, item, tsr) {
    if (!item?.effect || !tsr) return false;
    switch (item.effect) {
        case 'spirit_exp_200':
            addTsrSpiritExp(200);
            logAction('精灵经验+200', 'success');
            return true;
        case 'spirit_bond_20':
            addTsrSpiritBond(20);
            logAction(`亲密度+20（当前${ensureTsrSpiritPet().bond}）`, 'success');
            return true;
        case 'affix_scope_supply':
            if (!tsr.nextRunConsumables) tsr.nextRunConsumables = [];
            tsr.nextRunConsumables.push('affixScope');
            logAction('词条透视镜将在下次冒险开局加入背包', 'success');
            return true;
        default:
            return false;
    }
}

function checkTsrContentAchievements3(runContext) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.achievements) tsr.achievements = {};
    const ls = tsr.lifetimeStats || {};
    const unlock = (id) => {
        if (typeof unlockTsrAchievement === 'function') unlockTsrAchievement(id);
        else if (!tsr.achievements[id]) {
            tsr.achievements[id] = Date.now();
            const a = TSR_ACHIEVEMENTS.find(x => x.id === id);
            if (a) addTsrLog(`🏅 成就解锁：${a.name} — ${a.desc}`, 'success');
            invalidateTsrUiCache('codex');
        }
    };
    if ((ls.specialRooms || 0) >= 150) unlock('contentRoom150');
    if ((ls.memeRooms || 0) >= 80) unlock('contentMeme80');
    if (Object.keys(tsr.codex?.relics || {}).length >= 65) unlock('contentRelic65');
    if ((ls.affixKills || 0) >= 80) unlock('contentAffix80');
    if ((ls.genericContentRooms || 0) >= 80) unlock('contentGeneric80');
    if (Object.keys(tsr.codex?.equipmentSets || {}).length >= 16) unlock('contentEquipSet16');
    if ((ls.mythicKills || 0) >= 60) unlock('contentMythic60');
    if ((ls.fateCardClears || 0) >= 40) unlock('contentFate40');
    if ((tsr.currentRun?.relics || []).includes('jianmoSeal') || tsr.codex?.relics?.jianmoSeal) unlock('jianmoRelic');
    if ((tsr.currentRun?.relics || []).includes('leijieBrand') || tsr.codex?.relics?.leijieBrand) unlock('leijieRelic');
    if ((tsr.currentRun?.relics || []).includes('xinmoMirror') || tsr.codex?.relics?.xinmoMirror) unlock('xinmoRelic');
    if ((tsr.currentRun?.relics || []).includes('zhenfaCore') || tsr.codex?.relics?.zhenfaCore) unlock('zhenfaRelic');
}

function initTsrContentExtensions3() {
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_CONTENT3_MONSTER_BATTLE);
        TSR_MONSTER_POOL.elite.push(...TSR_CONTENT3_MONSTER_ELITE);
        TSR_MONSTER_POOL.boss.push(...TSR_CONTENT3_MONSTER_BOSS);
    }
    if (typeof TSR_RELIC_POOL !== 'undefined') Object.assign(TSR_RELIC_POOL, TSR_CONTENT3_RELIC_EXTRA);
    if (typeof TSR_EQUIP_SETS !== 'undefined') Object.assign(TSR_EQUIP_SETS, TSR_CONTENT3_EQUIP_SETS_EXTRA);
    if (typeof TSR_EQUIP_EXCLUSIVE_DROPS !== 'undefined') Object.assign(TSR_EQUIP_EXCLUSIVE_DROPS, TSR_CONTENT3_EQUIP_EXCLUSIVE_DROPS_EXTRA);
    if (typeof TSR_EQUIP_EXCLUSIVE_NAMES !== 'undefined') {
        Object.assign(TSR_EQUIP_EXCLUSIVE_NAMES, {
            jianmoShen: {
                weapon: { name: '剑魔诛天刃', icon: '⚔️' },
                armor: { name: '剑魔噬魂甲', icon: '🛡️' },
                ring: { name: '剑魔寂灭戒', icon: '💍' },
                chronos: { name: '剑魔时蚀环', icon: '⏱️' }
            },
            yaohuangShen: {
                weapon: { name: '妖皇裂天爪', icon: '⚔️' },
                armor: { name: '妖皇玄鳞甲', icon: '🛡️' },
                ring: { name: '妖皇敕令戒', icon: '💍' },
                chronos: { name: '妖皇时冕', icon: '⏱️' }
            }
        });
    }
    if (typeof TSR_EQUIP_PREFIXES !== 'undefined') {
        Object.values(TSR_CONTENT3_EQUIP_SETS_EXTRA).forEach(s => {
            if (s.prefix && !TSR_EQUIP_PREFIXES.includes(s.prefix)) TSR_EQUIP_PREFIXES.push(s.prefix);
        });
    }
    if (typeof TSR_STAR_FORTUNES !== 'undefined') TSR_STAR_FORTUNES.push(...TSR_CONTENT3_STAR_FORTUNES_EXTRA);
    if (typeof TSR_STAR_FORTUNE_EFFECTS !== 'undefined') Object.assign(TSR_STAR_FORTUNE_EFFECTS, TSR_CONTENT3_STAR_FORTUNE_EFFECTS_EXTRA);
    if (typeof TSR_FATE_CARDS !== 'undefined') Object.assign(TSR_FATE_CARDS, TSR_CONTENT3_FATE_CARDS_EXTRA);
    if (typeof TSR_FLOOR_AFFIXES !== 'undefined') Object.assign(TSR_FLOOR_AFFIXES, TSR_CONTENT3_FLOOR_AFFIXES_EXTRA);
    if (typeof TSR_FLOOR_AFFIX_THEMES !== 'undefined') Object.assign(TSR_FLOOR_AFFIX_THEMES, TSR_CONTENT3_FLOOR_AFFIX_THEMES_EXTRA);
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') TSR_ACHIEVEMENTS.push(...TSR_CONTENT3_ACHIEVEMENTS_EXTRA);
    if (typeof TSR_RUN_CONSUMABLES !== 'undefined') Object.assign(TSR_RUN_CONSUMABLES, TSR_CONTENT3_CONSUMABLES_EXTRA);
    if (typeof TSR_RUN_CONTRACTS !== 'undefined') Object.assign(TSR_RUN_CONTRACTS, TSR_CONTENT3_CONTRACTS_EXTRA);
    if (typeof TSR_CONTRACT_SYNERGIES !== 'undefined') TSR_CONTRACT_SYNERGIES.push(...TSR_CONTENT3_CONTRACT_SYNERGIES_EXTRA);
    if (typeof TSR_WEEKLY_MODIFIERS !== 'undefined') TSR_WEEKLY_MODIFIERS.push(...TSR_CONTENT3_WEEKLY_MODIFIERS);
    if (typeof TSR_WEEKLY_MODIFIER_EFFECTS !== 'undefined') Object.assign(TSR_WEEKLY_MODIFIER_EFFECTS, TSR_CONTENT3_WEEKLY_MODIFIER_EFFECTS);
    if (typeof TSR_TICKER_LINES !== 'undefined') TSR_TICKER_LINES.push(...TSR_CONTENT3_TICKER_LINES);

    if (typeof TSR_CONTENT_ROOM_DEFS !== 'undefined') Object.assign(TSR_CONTENT_ROOM_DEFS, TSR_CONTENT3_ROOM_DEFS);
    if (typeof TSR_CONTENT_ROOM_META !== 'undefined') Object.assign(TSR_CONTENT_ROOM_META, TSR_CONTENT3_ROOM_META);
    if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined') TSR_SPECIAL_ROOM_TYPES.push(...TSR_CONTENT3_SPECIAL_ROOM_TYPES_FIXED);
    if (typeof TSR_MEME_ROOM_TYPES !== 'undefined') TSR_MEME_ROOM_TYPES.push(...TSR_CONTENT3_MEME_ROOM_TYPES_FIXED);

    if (typeof TSR_CODEX_ROOMS !== 'undefined') {
        [...TSR_CONTENT3_SPECIAL_ROOM_TYPES_FIXED, ...TSR_CONTENT3_MEME_ROOM_TYPES_FIXED].forEach(key => {
            const meta = TSR_CONTENT3_ROOM_META[key];
            if (meta && !TSR_CODEX_ROOMS.find(r => r.key === key)) {
                TSR_CODEX_ROOMS.push({ key, name: meta.name, icon: meta.icon });
            }
        });
    }

    if (typeof getDefaultTsrShopItems === 'function' && !getDefaultTsrShopItems.__tsrContent3Patched) {
        const _prev = getDefaultTsrShopItems;
        getDefaultTsrShopItems = function () {
            return { ..._prev(), ...TSR_CONTENT3_SHOP_EXTRA };
        };
        getDefaultTsrShopItems.__tsrContent3Patched = true;
        getDefaultTsrShopItems.__tsrContent2Patched = _prev.__tsrContent2Patched;
        getDefaultTsrShopItems.__tsrContentPatched = _prev.__tsrContentPatched;
    }

    if (typeof applyTsrContentShopEffect === 'function' && !applyTsrContentShopEffect.__tsrContent3Patched) {
        const _prevShopFx = applyTsrContentShopEffect;
        applyTsrContentShopEffect = function (itemKey, item, tsr) {
            return applyTsrContent3ShopEffect(itemKey, item, tsr) || _prevShopFx(itemKey, item, tsr);
        };
        applyTsrContentShopEffect.__tsrContent3Patched = true;
    }

    if (typeof checkTsrContentAchievements === 'function' && !checkTsrContentAchievements.__tsrContent3Patched) {
        const _prevAch = checkTsrContentAchievements;
        checkTsrContentAchievements = function (ctx) {
            _prevAch(ctx);
            checkTsrContentAchievements3(ctx);
        };
        checkTsrContentAchievements.__tsrContent3Patched = true;
        checkTsrContentAchievements.__tsrContent2Patched = _prevAch.__tsrContent2Patched;
    }

    if (typeof applyTsrRunContract === 'function' && !applyTsrRunContract.__tsrContent3Patched) {
        const _origContract = applyTsrRunContract;
        applyTsrRunContract = function () {
            _origContract();
            const tsr = player.timeSecretRealm;
            const mods = tsr?.currentRun?.contractMods;
            if (!mods) return;
            const applyContractExtra = (contractKey, scale) => {
                const c = TSR_RUN_CONTRACTS[contractKey];
                if (!c) return;
                if (c.relicMagnet) mods.relicMagnet = (mods.relicMagnet || 0) + c.relicMagnet * scale;
                if (c.currencyPenalty) {
                    tsr.currentRun.currencyPenalty = (tsr.currentRun.currencyPenalty || 0) + c.currencyPenalty * scale;
                }
            };
            const primaryKey = tsr.selectedContract || 'none';
            const subKey = typeof canUseTsrSubContract === 'function' && canUseTsrSubContract()
                ? (tsr.selectedSubContract || 'none') : 'none';
            if (primaryKey !== 'none') applyContractExtra(primaryKey, 1);
            if (subKey !== 'none') applyContractExtra(subKey, 0.5);
        };
        applyTsrRunContract.__tsrContent3Patched = true;
    }

    if (typeof getTsrWeeklyRelicMagnetBonus === 'function' && !getTsrWeeklyRelicMagnetBonus.__tsrContent3Patched) {
        const _origWeeklyRelic = getTsrWeeklyRelicMagnetBonus;
        getTsrWeeklyRelicMagnetBonus = function () {
            let v = _origWeeklyRelic();
            const mods = player.timeSecretRealm?.currentRun?.contractMods;
            if (mods?.relicMagnet) v += mods.relicMagnet;
            return v;
        };
        getTsrWeeklyRelicMagnetBonus.__tsrContent3Patched = true;
    }

    if (typeof getTsrPermanentRelicMagnetBonus === 'function' && !getTsrPermanentRelicMagnetBonus.__tsrContent3Patched) {
        const _origPermRelic = getTsrPermanentRelicMagnetBonus;
        getTsrPermanentRelicMagnetBonus = function () {
            let v = _origPermRelic();
            if (typeof getTsrRelicBonus === 'function') v += getTsrRelicBonus('relicMagnet');
            return v;
        };
        getTsrPermanentRelicMagnetBonus.__tsrContent3Patched = true;
    }

    if (typeof addTsrRunCurrency === 'function' && !addTsrRunCurrency.__tsrContent3Patched) {
        const _origCurrency = addTsrRunCurrency;
        addTsrRunCurrency = function (amount, options) {
            const tsr = player.timeSecretRealm;
            const run = tsr?.currentRun;
            if (run && amount > 0) {
                const pen = Number(run.currencyPenalty) || 0;
                const fateMod = Number(run.fateCurrencyMod) || 0;
                if (pen || fateMod) {
                    amount = Math.floor(amount * (1 - pen + fateMod));
                }
            }
            return _origCurrency(amount, options);
        };
        addTsrRunCurrency.__tsrContent3Patched = true;
    }
}

initTsrContentExtensions3();

/**
 * 时光秘境 · 内容扩展第四波（赛博机甲 / 洪荒古神主题）
 */
const TSR_CONTENT4_MONSTER_BATTLE = [
    { id: 'jijia', name: '机甲残躯', icon: '🤖', tier: 'common', intro: '「系统重启中……目标：你。」', win: '机甲断电。', skill: 'burst', skillChance: 0.22 },
    { id: 'guangzi', name: '光子游灵', icon: '💠', tier: 'uncommon', intro: '「光速打击，慢一步就死。」', win: '光子消散。', skill: 'timeDrain', skillChance: 0.26, skillValue: 3 },
    { id: 'honghuang', name: '洪荒碎屑', icon: '🪨', tier: 'rare', intro: '「开天辟地前的余威。」', win: '碎屑归于混沌。', skill: 'rage', skillChance: 0.28 },
    { id: 'shenji', name: '神机哨兵', icon: '🔩', tier: 'uncommon', intro: '「权限不足，执行清除。」', win: '哨兵协议终止。', skill: 'shield', skillChance: 0.24, skillValue: 0.1 },
    { id: 'gushen', name: '古神低语', icon: '👁️', tier: 'epic', intro: '「不可名状，但可反击。」', win: '低语被屏蔽。', skill: 'curse', skillChance: 0.3 },
    { id: 'quantum', name: '量子残影', icon: '⚛️', tier: 'rare', intro: '「观测即坍缩，不观测也打你。」', win: '残影坍缩。', skill: 'dodge', skillChance: 0.28 },
    { id: 'titan', name: '泰坦幼体', icon: '🦾', tier: 'legendary', intro: '「未成年泰坦，成年要你命。」', win: '幼体回收。', skill: 'reflect', skillChance: 0.32, skillValue: 0.06 },
    { id: 'xukong', name: '虚空机虫', icon: '🪲', tier: 'mythic', intro: '「集群思维，集群咬人。」', win: '虫群格式化。', skill: 'overload', skillChance: 0.34 }
];

const TSR_CONTENT4_MONSTER_ELITE = [
    { id: 'jijiajun', name: '机甲督军', icon: '🤖', tier: 'epic', intro: '「火力覆盖，请原地去世。」', win: '督军装甲击穿。', skill: 'rage', skillChance: 0.38 },
    { id: 'hongmeng', name: '鸿蒙统领', icon: '🌀', tier: 'legendary', intro: '「混沌未分，你先分尸。」', win: '统领归于有序。', skill: 'burst', skillChance: 0.4 },
    { id: 'shenwei', name: '神威禁卫', icon: '⚡', tier: 'epic', intro: '「神威如狱，反击如刀。」', win: '禁卫神格碎裂。', skill: 'timeDrain', skillChance: 0.38, skillValue: 6 },
    { id: 'quantumElite', name: '量子督军', icon: '⚛️', tier: 'mythic', intro: '「叠加态：既死又活，你只管挨打。」', win: '督军波函数坍缩。', skill: 'phaseWalk', skillChance: 0.42 },
    { id: 'titanElite', name: '泰坦先锋', icon: '🦾', tier: 'legendary', intro: '「一步踏碎山河，两步踏碎你。」', win: '先锋跪地。', skill: 'armorBreak', skillChance: 0.36 },
    { id: 'gushenElite', name: '古神使徒', icon: '👁️', tier: 'mythic', intro: '「祂的使者，你的噩梦。」', win: '使徒被放逐。', skill: 'spiritDrain', skillChance: 0.44, skillValue: 0.18 }
];

const TSR_CONTENT4_MONSTER_BOSS = [
    { id: 'jijiazun', name: '机甲尊者', icon: '🤖', tier: 'legendary', intro: '「血肉苦弱，机械飞升——从你开始。」', win: '尊者核心熔毁。', skill: 'rage', skillChance: 0.48 },
    { id: 'honghuangdi', name: '洪荒帝', icon: '🪨', tier: 'mythic', intro: '「盘古未醒，我先醒。」', win: '帝座归于洪荒。', skill: 'overload', skillChance: 0.5 },
    { id: 'shenjizhu', name: '神机之主', icon: '🔩', tier: 'legendary', intro: '「万机归一，归的是我。」', win: '神机网络断开。', skill: 'shield', skillChance: 0.46, skillValue: 0.25 },
    { id: 'gushenwang', name: '古神王', icon: '👁️', tier: 'mythic', intro: '「凝视深渊，深渊凝视并反击。」', win: '古神王沉睡。', skill: 'curse', skillChance: 0.48 },
    { id: 'quantumLord', name: '量子领主', icon: '⚛️', tier: 'mythic', intro: '「薛定谔的Boss：打开箱子前别死。」', win: '领主观测失效。', skill: 'dodge', skillChance: 0.5 },
    { id: 'titanKing', name: '泰坦王', icon: '🦾', tier: 'mythic', intro: '「身高三万丈，脾气也一样。」', win: '泰坦王轰然倒地。', skill: 'reflect', skillChance: 0.46, skillValue: 0.1 }
];

const TSR_CONTENT4_RELIC_EXTRA = {
    jijiaCore: { name: '机甲核心', icon: '🤖', desc: '攻击+12%，穿透+4%', effect: 'attack', value: 0.12, bonus: { effect: 'pen', value: 0.04 } },
    hongmengSeed: { name: '鸿蒙种', icon: '🌀', desc: '生命+12%，虚空共鸣+15%', effect: 'health', value: 0.12, bonus: { effect: 'resonanceGain', value: 0.15 } },
    shenweiMark: { name: '神威刻印', icon: '⚡', desc: '暴伤+10%，反击-8%', effect: 'critDamage', value: 0.1, bonus: { effect: 'counterReduce', value: 0.08 } },
    quantumChip: { name: '量子芯片', icon: '⚛️', desc: '闪避感知+，行动-6%', effect: 'timeSave', value: 0.06, bonus: { effect: 'eventBonus', value: 0.08 } },
    titanPlate: { name: '泰坦装甲片', icon: '🦾', desc: '生命+15%，首领攻+8%', effect: 'health', value: 0.15, bonus: { effect: 'bossAttack', value: 0.08 } },
    gushenEye: { name: '古神之眼', icon: '👁️', desc: '【古神王专属】攻击+16%，事件+10%', effect: 'attack', value: 0.16, bonus: { effect: 'eventBonus', value: 0.1 }, exclusive: 'gushenwang' },
    jijiaSeal: { name: '机甲尊者印', icon: '🤖', desc: '【机甲尊者专属】攻击+17%，暴伤+10%', effect: 'attack', value: 0.17, bonus: { effect: 'critDamage', value: 0.1 }, exclusive: 'jijiazun' },
    honghuangCrown: { name: '洪荒帝冕', icon: '🪨', desc: '【洪荒帝专属】生命+14%，虚空+18%', effect: 'health', value: 0.14, bonus: { effect: 'resonanceGain', value: 0.18 }, exclusive: 'honghuangdi' },
    quantumRing: { name: '量子环', icon: '⚛️', desc: '赌局+10%，精英遗物+6%', effect: 'gamble', value: 0.1, bonus: { effect: 'relicMagnet', value: 0.06 } },
    titanFang: { name: '泰坦之牙', icon: '🦾', desc: '攻击+11%，神话伤感知+', effect: 'attack', value: 0.11, bonus: { effect: 'bossAttack', value: 0.08 } },
    cyberBadge: { name: '赛博徽章', icon: '💾', desc: '秘境币+10%，宝箱+15%', effect: 'currency', value: 0.1, bonus: { effect: 'treasureBonus', value: 0.15 } },
    ancientScript: { name: '洪荒残篇', icon: '📜', desc: '事件+12%，特殊房+8%', effect: 'eventBonus', value: 0.12, bonus: { effect: 'comboBoost', value: 0.05 } }
};

const TSR_CONTENT4_EQUIP_SETS_EXTRA = {
    jijia: { prefix: '机甲', name: '机甲套', icon: '🤖', desc2: '攻击+5%', desc4: '攻击+9%，穿透+4%', bonus2: { attack: 0.05 }, bonus4: { attack: 0.09, pen: 0.04 } },
    hongmeng: { prefix: '鸿蒙', name: '鸿蒙套', icon: '🌀', desc2: '生命+5%', desc4: '攻血+7%，虚空+12%', bonus2: { health: 0.05 }, bonus4: { attack: 0.07, health: 0.07, voidPower: 0.12 } },
    shenwei: { prefix: '神威', name: '神威套', icon: '⚡', desc2: '暴伤+6%', desc4: '攻击+8%，暴伤+11%', bonus2: { critDamage: 0.06 }, bonus4: { attack: 0.08, critDamage: 0.11 } },
    titan: { prefix: '泰坦', name: '泰坦套', icon: '🦾', desc2: '生命+6%', desc4: '生命+10%，护甲+5%', bonus2: { health: 0.06 }, bonus4: { health: 0.1, armor: 0.05 } },
    jijiaZunShen: { prefix: '机尊', name: '机尊神装', icon: '🤖', exclusive: true, dropHint: '击败机甲尊者', desc2: '攻击+9%，穿透+5%', desc4: '攻击+13%，暴击+5%，穿透+6%', bonus2: { attack: 0.09, pen: 0.05 }, bonus4: { attack: 0.13, critRate: 0.05, pen: 0.06 } },
    honghuangShen: { prefix: '洪荒', name: '洪荒帝装', icon: '🪨', exclusive: true, dropHint: '击败洪荒帝', desc2: '生命+8%，虚空+8%', desc4: '攻血+11%，虚空+14%', bonus2: { health: 0.08, voidPower: 0.08 }, bonus4: { attack: 0.11, health: 0.11, voidPower: 0.14 } }
};

const TSR_CONTENT4_EQUIP_EXCLUSIVE_DROPS_EXTRA = {
    jijiazun: { setId: 'jijiaZunShen', chance: 0.16, tier: 'legendary' },
    honghuangdi: { setId: 'honghuangShen', chance: 0.14, tier: 'mythic' },
    gushenwang: { setId: 'hongmeng', chance: 0.12, tier: 'mythic' },
    shenjizhu: { setId: 'jijia', chance: 0.11, tier: 'legendary' },
    quantumLord: { setId: 'shenwei', chance: 0.1, tier: 'mythic' },
    titanKing: { setId: 'titan', chance: 0.13, tier: 'legendary' }
};

const TSR_CONTENT4_STAR_FORTUNES_EXTRA = [
    { id: 'jijiaStar', name: '机甲星辉', icon: '🤖', desc: '攻击+11%，穿透+4%', theme: 'boss' },
    { id: 'hongmengStar', name: '鸿蒙星潮', icon: '🌀', desc: '生命+10%，虚空共鸣+18%', theme: 'void' },
    { id: 'shenweiStar', name: '神威星芒', icon: '⚡', desc: '暴伤+10%，反击-8%', theme: 'boss' },
    { id: 'quantumStar', name: '量子星轨', icon: '⚛️', desc: '赌局+12%，事件+10%', theme: 'fortune' },
    { id: 'titanStar', name: '泰坦星坠', icon: '🦾', desc: '怪物+8%，奖励+14%', theme: 'danger' },
    { id: 'gushenStar', name: '古神星蚀', icon: '👁️', desc: '攻击+14%，生命-6%', theme: 'epic' }
];

const TSR_CONTENT4_STAR_FORTUNE_EFFECTS_EXTRA = {
    jijiaStar: { attack: 0.11, pen: 0.04 },
    hongmengStar: { health: 0.1, resonanceGain: 0.18 },
    shenweiStar: { critDamage: 0.1, counterPenalty: -0.08 },
    quantumStar: { gamble: 0.12, eventBonus: 0.1 },
    titanStar: { monsterMult: 0.08, currencyMod: 0.14 },
    gushenStar: { attack: 0.14, health: -0.06 }
};

const TSR_CONTENT4_FATE_CARDS_EXTRA = {
    jijiaFate: { id: 'jijiaFate', name: '机甲命', icon: '🤖', desc: '攻击+18%，生命-8%', attack: 0.18, health: -0.08, theme: 'boss' },
    hongmengFate: { id: 'hongmengFate', name: '鸿蒙命', icon: '🌀', desc: '生命+16%，虚空+15%', health: 0.16, resonanceGain: 0.15, theme: 'void' },
    quantumFate: { id: 'quantumFate', name: '量子命', icon: '⚛️', desc: '赌局+18%，行动+8%', gamble: 0.18, timeCost: 0.08, theme: 'fortune' },
    titanFate: { id: 'titanFate', name: '泰坦命', icon: '🦾', desc: '生命+20%，每层+2秒', health: 0.2, floorTime: 2, theme: 'heal' },
    gushenFate: { id: 'gushenFate', name: '古神命', icon: '👁️', desc: '攻击+16%，反击+8%', attack: 0.16, counterPenalty: 0.08, theme: 'danger' },
    cyberFate: { id: 'cyberFate', name: '赛博命', icon: '💾', desc: '秘境币+14%，陷阱+10%', currencyMod: 0.14, trapRate: 0.1, theme: 'gold' }
};

const TSR_CONTENT4_FLOOR_AFFIXES_EXTRA = {
    jijiaRain: { name: '机甲雨', icon: '🤖', desc: '攻击+14%，怪物+6%', attack: 0.14, monsterMult: 0.06 },
    hongmengMist: { name: '鸿蒙雾', icon: '🌀', desc: '生命+10%，虚空+20%', health: 0.1, resonanceGain: 0.2 },
    quantumFlux: { name: '量子涨落', icon: '⚛️', desc: '赌局+14%，行动+6%', gamble: 0.14, timeCost: 0.06 },
    titanQuake: { name: '泰坦震', icon: '🦾', desc: '生命+12%，反击+8%', health: 0.12, counterPenalty: 0.08 },
    gushenWhisper: { name: '古神低语', icon: '👁️', desc: '攻击+18%，生命-8%', attack: 0.18, health: -0.08 },
    cyberGrid: { name: '赛博网格', icon: '💾', desc: '秘境币+14%，事件+10%', currencyMod: 0.14, eventBonus: 0.1 }
};

const TSR_CONTENT4_FLOOR_AFFIX_THEMES_EXTRA = {
    jijiaRain: 'boss', hongmengMist: 'void', quantumFlux: 'fortune',
    titanQuake: 'heal', gushenWhisper: 'epic', cyberGrid: 'gold'
};

const TSR_CONTENT4_ACHIEVEMENTS_EXTRA = [
    { id: 'contentRoom200', name: '秘境至尊', desc: '累计遭遇200次特殊房间', icon: '🧭', need: { specialRooms: 200 } },
    { id: 'contentRelic80', name: '遗宝至尊', desc: '图鉴解锁80种遗物', icon: '🏺', need: { relicCodex: 80 } },
    { id: 'contentGeneric120', name: '奇遇至尊', desc: '累计完成120次扩展奇遇房间', icon: '✨', need: { genericContentRooms: 120 } },
    { id: 'jijiaRelic', name: '机尊认可', desc: '获得机甲尊者印遗物', icon: '🤖' },
    { id: 'honghuangRelic', name: '洪荒加冕', desc: '获得洪荒帝冕遗物', icon: '🪨' },
    { id: 'gushenRelic', name: '古神凝视', desc: '获得古神之眼遗物', icon: '👁️' }
];

const TSR_CONTENT4_CONSUMABLES_EXTRA = {
    jijiaFuel: { name: '机甲燃料', icon: '⛽', effect: 'rage', value: 0.28, desc: '攻击+28%持续3次行动' },
    hongmengDust: { name: '鸿蒙尘', icon: '🌀', effect: 'starBurst', value: 1, desc: '满充能觉醒+虚空共鸣+8' },
    quantumDice: { name: '量子骰', icon: '⚛️', effect: 'chaos', value: 1, desc: '随机触发强力的混沌效果' },
    titanSerum: { name: '泰坦血清', icon: '💉', effect: 'dominionElixir', value: 1, desc: '攻击+22%×4，生命+15%×4' },
    gushenMask: { name: '古神面具', icon: '👁️', effect: 'counterShield', value: 0.35, desc: '下3次反击伤害减至35%' },
    cyberPatch: { name: '赛博补丁', icon: '💾', effect: 'luck', value: 75, desc: '75秒内双倍秘境币' }
};

const TSR_CONTENT4_CONTRACTS_EXTRA = {
    jijiaPilot: { name: '机甲契约', desc: '攻击+11%，生命-5%', icon: '🤖', attack: 0.11, health: -0.05 },
    hongmengWalker: { name: '鸿蒙契约', desc: '生命+10%，虚空共鸣+12%', icon: '🌀', health: 0.1, resonanceGain: 0.12, timeMod: -10 },
    quantumGambler: { name: '量子契约', desc: '赌局+14%，币-6%', icon: '⚛️', gamble: 0.14, currencyPenalty: 0.06 },
    titanGuard: { name: '泰坦契约', desc: '生命+14%，行动+6%', icon: '🦾', health: 0.14, timeCost: 0.06 }
};

const TSR_CONTENT4_CONTRACT_SYNERGIES_EXTRA = [
    { keys: ['jijiaPilot', 'ironMan'], name: '钢铁机甲', desc: '攻击+6%，穿透+3%', bonus: { attack: 0.06, pen: 0.03 } },
    { keys: ['hongmengWalker', 'voidWalker'], name: '鸿蒙虚空', desc: '虚空共鸣+10%，事件+6%', bonus: { resonanceGain: 0.1, eventBonus: 0.06 } },
    { keys: ['quantumGambler', 'fortuneSeeker'], name: '量子彩运', desc: '赌局+8%，币+5%', bonus: { gamble: 0.08, currencyMod: 0.05 } },
    { keys: ['titanGuard', 'spiritGuard'], name: '泰坦灵卫', desc: '生命+8%，充能+10%', bonus: { health: 0.08, spiritMult: 1.1 } }
];

const TSR_CONTENT4_WEEKLY_MODIFIERS = [
    { id: 'jijiaWeek', name: '机甲周', icon: '🤖', desc: '攻击+10%，穿透+3%' },
    { id: 'hongmengWeek', name: '鸿蒙周', icon: '🌀', desc: '生命+10%，虚空共鸣+15%' },
    { id: 'quantumWeek', name: '量子周', icon: '⚛️', desc: '赌局+14%，事件+8%' },
    { id: 'titanWeek', name: '泰坦周', icon: '🦾', desc: '生命+12%，战斗奖励+10%' }
];

const TSR_CONTENT4_WEEKLY_MODIFIER_EFFECTS = {
    jijiaWeek: { attack: 0.1, pen: 0.03 },
    hongmengWeek: { health: 0.1, resonanceGain: 0.15 },
    quantumWeek: { gamble: 0.14, eventBonus: 0.08 },
    titanWeek: { health: 0.12, battleReward: 0.1 }
};

const TSR_CONTENT4_TICKER_LINES = [
    '第四波扩展：机甲工坊、鸿蒙裂隙、量子赌场等新房间开放',
    '机甲尊者、洪荒帝可掉落传说专属神装',
    '机甲/鸿蒙/量子/泰坦等新契约可在开局选用',
    '泰坦血清、量子骰等新消耗品已加入掉落池'
];

const TSR_CONTENT4_SPECIAL_ROOM_TYPES = [
    'jijiagongfang', 'hongmenglie', 'shenweidian', 'liangzijia', 'taitanmu', 'gushentan'
];

const TSR_CONTENT4_MEME_ROOM_TYPES = [
    'overclock', 'blueprint', 'lootbox2', 'paywall', 'tutorialskip', 'endgamegrind'
];

const TSR_CONTENT4_ROOM_META = {
    jijiagongfang: { name: '机甲工坊', icon: '🤖', color: '#64748b' },
    hongmenglie: { name: '鸿蒙裂隙', icon: '🌀', color: '#8b5cf6' },
    shenweidian: { name: '神威殿', icon: '⚡', color: '#eab308' },
    liangzijia: { name: '量子赌场', icon: '⚛️', color: '#22d3ee' },
    taitanmu: { name: '泰坦墓', icon: '🦾', color: '#94a3b8' },
    gushentan: { name: '古神祭坛', icon: '👁️', color: '#a855f7' },
    overclock: { name: '超频站', icon: '🔥', color: '#ef4444' },
    blueprint: { name: '蓝图交易所', icon: '📐', color: '#3b82f6' },
    lootbox2: { name: '二次开箱室', icon: '📦', color: '#f472b6' },
    paywall: { name: '付费墙', icon: '💳', color: '#eab308' },
    tutorialskip: { name: '跳过教程', icon: '⏭️', color: '#64748b' },
    endgamegrind: { name: '终局肝区', icon: '♾️', color: '#6366f1' }
};

const TSR_CONTENT4_ROOM_DEFS = {
    jijiagongfang: {
        title: '🤖 机甲工坊', intro: '「改装免费，爆炸另算。」',
        options: [
            { id: 'upgrade', label: '改装 · 攻击+16%×3层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.16, duration: 3 }, timeCost: 18, log: '机甲改装完成！', theme: 'boss' } },
            { id: 'salvage', label: '拆解 · +95币', btn: 'tsr-btn-purple', reward: { currency: 95, timeCost: 14, log: '+95币', theme: 'gold' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'jijiaFuel', log: '获得机甲燃料' } }
        ]
    },
    hongmenglie: {
        title: '🌀 鸿蒙裂隙', intro: '混沌之气，吸一口涨修为，吸两口掉时间。',
        options: [
            { id: 'absorb', label: '吸纳 · 虚空共鸣+14', btn: 'tsr-btn-gold', reward: { voidResonance: 14, spiritCharge: 30, timeCost: 20, log: '鸿蒙吸纳！', theme: 'void' } },
            { id: 'seal', label: '封印 · +35秒', btn: 'tsr-btn-safe', reward: { time: 35, heal: 0.1, timeCost: 18, log: '+35秒', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'hongmengDust', log: '获得鸿蒙尘' } }
        ]
    },
    shenweidian: {
        title: '⚡ 神威殿', intro: '「神威如狱——先交门票。」',
        options: [
            { id: 'trial', label: '试炼 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', voidResonance: 8, log: '神威试炼！', theme: 'boss' } },
            { id: 'worship', label: '膜拜 · 暴伤感知+12%', btn: 'tsr-btn-gold', reward: { affixRewardRun: 0.12, currency: 75, timeCost: 16, log: '神威加持', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 10, log: '+10秒' } }
        ]
    },
    liangzijia: {
        title: '⚛️ 量子赌场', intro: '「赢的概率是50%，输的概率也是50%。」',
        options: [
            { id: 'bet', label: '下注 · 奇点赌局', btn: 'tsr-btn-gold', reward: { singularityGamble: true, log: '量子下注！', theme: 'fortune' } },
            { id: 'observe', label: '观测 · 50%±30秒', btn: 'tsr-btn-purple', reward: { gambleTime: true, log: '观测赌局！', theme: 'fortune' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'quantumDice', log: '获得量子骰' } }
        ]
    },
    taitanmu: {
        title: '🦾 泰坦墓', intro: '远古泰坦的残骸，仍有余温。',
        options: [
            { id: 'inherit', label: '继承 · 生命+12%×本局', btn: 'tsr-btn-gold', reward: { buff: { effect: 'health', value: 0.12, duration: 0 }, timeCost: 20, log: '泰坦之力！', theme: 'heal' } },
            { id: 'loot', label: '搜刮 · +110币', btn: 'tsr-btn-purple', reward: { currency: 110, timeCost: 16, log: '+110币', theme: 'gold' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'titanSerum', log: '获得泰坦血清' } }
        ]
    },
    gushentan: {
        title: '👁️ 古神祭坛', intro: '不可直视，但可以给钱。',
        options: [
            { id: 'gaze', label: '凝视 · 攻击+20%×2层', btn: 'tsr-btn-risk', reward: { buff: { effect: 'attack', value: 0.2, duration: 2 }, time: -10, log: '古神凝视！', theme: 'epic' } },
            { id: 'offer', label: '献祭 · 虚空共鸣+16', btn: 'tsr-btn-purple', reward: { voidResonance: 16, timeCost: 18, log: '献祭成功', theme: 'void' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'gushenMask', log: '获得古神面具' } }
        ]
    },
    overclock: {
        title: '🔥 超频站', intro: '「性能+50%，寿命-50%，很公平。」',
        options: [
            { id: 'oc', label: '超频 · 攻击+22%×2层', btn: 'tsr-btn-risk', reward: { buff: { effect: 'attack', value: 0.22, duration: 2 }, time: -12, log: '超频成功！', theme: 'meme' } },
            { id: 'cool', label: '散热 · +28秒', btn: 'tsr-btn-safe', reward: { time: 28, timeCost: 14, log: '+28秒', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 62, log: '+62币' } }
        ]
    },
    blueprint: {
        title: '📐 蓝图交易所', intro: '「设计图卖你，成品自己做。」',
        options: [
            { id: 'buy', label: '买蓝图 · 随机装备', btn: 'tsr-btn-gold', reward: { equipDrop: true, timeCost: 16, log: '蓝图打造！', theme: 'gold' } },
            { id: 'sell', label: '卖废稿 · +80币', btn: 'tsr-btn-purple', reward: { currency: 80, timeCost: 12, log: '+80币', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 7, log: '+7秒' } }
        ]
    },
    lootbox2: {
        title: '📦 二次开箱室', intro: '「第一次没出金？再开一次，还是不会。」',
        options: [
            { id: 'open', label: '再开 · 50%大丰收', btn: 'tsr-btn-gold', reward: { singularityGamble: true, log: '二次开箱！', theme: 'fortune' } },
            { id: 'pity', label: '硬保底 · +70币', btn: 'tsr-btn-safe', reward: { currency: 70, timeCost: 10, log: '+70币', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'cyberPatch', log: '获得赛博补丁' } }
        ]
    },
    paywall: {
        title: '💳 付费墙', intro: '「精彩内容，请付费解锁。」',
        options: [
            { id: 'pay', label: '氪金 · +125币', btn: 'tsr-btn-gold', reward: { currency: 125, time: -8, timeCost: 18, log: '+125币，-8秒', theme: 'gold' } },
            { id: 'pirate', label: '白嫖 · 50%诅咒或+50币', btn: 'tsr-btn-risk', reward: { gambleCoin: true, log: '白嫖赌局！', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 6, log: '+6秒' } }
        ]
    },
    tutorialskip: {
        title: '⏭️ 跳过教程', intro: '「新手？不存在的，直接上强度。」',
        options: [
            { id: 'skip', label: '跳过 · 攻击+14%×3层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.14, duration: 3 }, timeCost: 12, log: '教程已跳过！', theme: 'meme' } },
            { id: 'read', label: '硬读 · +40秒', btn: 'tsr-btn-safe', reward: { time: 40, timeCost: 20, log: '+40秒', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 55, log: '+55币' } }
        ]
    },
    endgamegrind: {
        title: '♾️ 终局肝区', intro: '「毕业？那只是下一赛季的开始。」',
        options: [
            { id: 'grind', label: '开肝 · 精灵经验+100', btn: 'tsr-btn-gold', reward: { spiritExp: 100, timeCost: 22, log: '精灵经验+100', theme: 'spirit' } },
            { id: 'burnout', label: '爆肝 · 50%±35秒', btn: 'tsr-btn-risk', reward: { gambleTime: true, log: '爆肝赌局！', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { eventBonusRun: 0.08, log: '事件+8%（本局）', theme: 'legend' } }
        ]
    }
};

function checkTsrContentAchievements4(runContext) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.achievements) tsr.achievements = {};
    const ls = tsr.lifetimeStats || {};
    const unlock = (id) => {
        if (!tsr.achievements[id]) {
            tsr.achievements[id] = Date.now();
            const a = TSR_ACHIEVEMENTS.find(x => x.id === id);
            if (a) addTsrLog(`🏅 成就解锁：${a.name} — ${a.desc}`, 'success');
            invalidateTsrUiCache('codex');
        }
    };
    if ((ls.specialRooms || 0) >= 200) unlock('contentRoom200');
    if (Object.keys(tsr.codex?.relics || {}).length >= 80) unlock('contentRelic80');
    if ((ls.genericContentRooms || 0) >= 120) unlock('contentGeneric120');
    if ((tsr.currentRun?.relics || []).includes('jijiaSeal') || tsr.codex?.relics?.jijiaSeal) unlock('jijiaRelic');
    if ((tsr.currentRun?.relics || []).includes('honghuangCrown') || tsr.codex?.relics?.honghuangCrown) unlock('honghuangRelic');
    if ((tsr.currentRun?.relics || []).includes('gushenEye') || tsr.codex?.relics?.gushenEye) unlock('gushenRelic');
}

function initTsrContentExtensions4() {
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_CONTENT4_MONSTER_BATTLE);
        TSR_MONSTER_POOL.elite.push(...TSR_CONTENT4_MONSTER_ELITE);
        TSR_MONSTER_POOL.boss.push(...TSR_CONTENT4_MONSTER_BOSS);
    }
    if (typeof TSR_RELIC_POOL !== 'undefined') Object.assign(TSR_RELIC_POOL, TSR_CONTENT4_RELIC_EXTRA);
    if (typeof TSR_EQUIP_SETS !== 'undefined') Object.assign(TSR_EQUIP_SETS, TSR_CONTENT4_EQUIP_SETS_EXTRA);
    if (typeof TSR_EQUIP_EXCLUSIVE_DROPS !== 'undefined') Object.assign(TSR_EQUIP_EXCLUSIVE_DROPS, TSR_CONTENT4_EQUIP_EXCLUSIVE_DROPS_EXTRA);
    if (typeof TSR_EQUIP_EXCLUSIVE_NAMES !== 'undefined') {
        Object.assign(TSR_EQUIP_EXCLUSIVE_NAMES, {
            jijiaZunShen: {
                weapon: { name: '机尊歼星炮', icon: '⚔️' },
                armor: { name: '机尊钛合金甲', icon: '🛡️' },
                ring: { name: '机尊运算戒', icon: '💍' },
                chronos: { name: '机尊时控核', icon: '⏱️' }
            },
            honghuangShen: {
                weapon: { name: '洪荒开天斧', icon: '⚔️' },
                armor: { name: '洪荒玄黄甲', icon: '🛡️' },
                ring: { name: '洪荒混沌戒', icon: '💍' },
                chronos: { name: '洪荒时轮', icon: '⏱️' }
            }
        });
    }
    if (typeof TSR_EQUIP_PREFIXES !== 'undefined') {
        Object.values(TSR_CONTENT4_EQUIP_SETS_EXTRA).forEach(s => {
            if (s.prefix && !TSR_EQUIP_PREFIXES.includes(s.prefix)) TSR_EQUIP_PREFIXES.push(s.prefix);
        });
    }
    if (typeof TSR_STAR_FORTUNES !== 'undefined') TSR_STAR_FORTUNES.push(...TSR_CONTENT4_STAR_FORTUNES_EXTRA);
    if (typeof TSR_STAR_FORTUNE_EFFECTS !== 'undefined') Object.assign(TSR_STAR_FORTUNE_EFFECTS, TSR_CONTENT4_STAR_FORTUNE_EFFECTS_EXTRA);
    if (typeof TSR_FATE_CARDS !== 'undefined') Object.assign(TSR_FATE_CARDS, TSR_CONTENT4_FATE_CARDS_EXTRA);
    if (typeof TSR_FLOOR_AFFIXES !== 'undefined') Object.assign(TSR_FLOOR_AFFIXES, TSR_CONTENT4_FLOOR_AFFIXES_EXTRA);
    if (typeof TSR_FLOOR_AFFIX_THEMES !== 'undefined') Object.assign(TSR_FLOOR_AFFIX_THEMES, TSR_CONTENT4_FLOOR_AFFIX_THEMES_EXTRA);
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') TSR_ACHIEVEMENTS.push(...TSR_CONTENT4_ACHIEVEMENTS_EXTRA);
    if (typeof TSR_RUN_CONSUMABLES !== 'undefined') Object.assign(TSR_RUN_CONSUMABLES, TSR_CONTENT4_CONSUMABLES_EXTRA);
    if (typeof TSR_RUN_CONTRACTS !== 'undefined') Object.assign(TSR_RUN_CONTRACTS, TSR_CONTENT4_CONTRACTS_EXTRA);
    if (typeof TSR_CONTRACT_SYNERGIES !== 'undefined') TSR_CONTRACT_SYNERGIES.push(...TSR_CONTENT4_CONTRACT_SYNERGIES_EXTRA);
    if (typeof TSR_WEEKLY_MODIFIERS !== 'undefined') TSR_WEEKLY_MODIFIERS.push(...TSR_CONTENT4_WEEKLY_MODIFIERS);
    if (typeof TSR_WEEKLY_MODIFIER_EFFECTS !== 'undefined') Object.assign(TSR_WEEKLY_MODIFIER_EFFECTS, TSR_CONTENT4_WEEKLY_MODIFIER_EFFECTS);
    if (typeof TSR_TICKER_LINES !== 'undefined') TSR_TICKER_LINES.push(...TSR_CONTENT4_TICKER_LINES);

    if (typeof TSR_CONTENT_ROOM_DEFS !== 'undefined') Object.assign(TSR_CONTENT_ROOM_DEFS, TSR_CONTENT4_ROOM_DEFS);
    if (typeof TSR_CONTENT_ROOM_META !== 'undefined') Object.assign(TSR_CONTENT_ROOM_META, TSR_CONTENT4_ROOM_META);
    if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined') TSR_SPECIAL_ROOM_TYPES.push(...TSR_CONTENT4_SPECIAL_ROOM_TYPES);
    if (typeof TSR_MEME_ROOM_TYPES !== 'undefined') TSR_MEME_ROOM_TYPES.push(...TSR_CONTENT4_MEME_ROOM_TYPES);

    if (typeof TSR_CODEX_ROOMS !== 'undefined') {
        [...TSR_CONTENT4_SPECIAL_ROOM_TYPES, ...TSR_CONTENT4_MEME_ROOM_TYPES].forEach(key => {
            const meta = TSR_CONTENT4_ROOM_META[key];
            if (meta && !TSR_CODEX_ROOMS.find(r => r.key === key)) {
                TSR_CODEX_ROOMS.push({ key, name: meta.name, icon: meta.icon });
            }
        });
    }

    if (typeof checkTsrContentAchievements === 'function' && !checkTsrContentAchievements.__tsrContent4Patched) {
        const _prevAch = checkTsrContentAchievements;
        checkTsrContentAchievements = function (ctx) {
            _prevAch(ctx);
            checkTsrContentAchievements4(ctx);
        };
        checkTsrContentAchievements.__tsrContent4Patched = true;
        checkTsrContentAchievements.__tsrContent3Patched = _prevAch.__tsrContent3Patched;
        checkTsrContentAchievements.__tsrContent2Patched = _prevAch.__tsrContent2Patched;
    }
}

initTsrContentExtensions4();

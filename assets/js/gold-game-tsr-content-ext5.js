/**
 * 时光秘境 · 内容扩展第五波（命格秘术 / 遭遇链 / 命运编织主题）
 */
const TSR_CONTENT5_MONSTER_BATTLE = [
    { id: 'mingge', name: '命格残影', icon: '🔮', tier: 'common', intro: '「你的命格，借我用用。」', win: '残影归还命格。', skill: 'curse', skillChance: 0.22 },
    { id: 'tiaowenling', name: '词条灵', icon: '📘', tier: 'uncommon', intro: '「见词条者，赏金加倍。」', win: '词条灵消散。', skill: 'burst', skillChance: 0.24 },
    { id: 'gongmingti', name: '共鸣体', icon: '🧩', tier: 'rare', intro: '「套装不齐，照样打你。」', win: '共鸣体碎裂。', skill: 'shield', skillChance: 0.26, skillValue: 0.1 },
    { id: 'lianjie', name: '链界游魂', icon: '⛓️', tier: 'uncommon', intro: '「别断链，断了更痛。」', win: '游魂解脱。', skill: 'timeDrain', skillChance: 0.25, skillValue: 3 },
    { id: 'mingyunxian', name: '命运丝线', icon: '🧵', tier: 'epic', intro: '「编织你的结局中……」', win: '丝线剪断。', skill: 'slow', skillChance: 0.28 },
    { id: 'xukongming', name: '虚空命印', icon: '🕳️', tier: 'legendary', intro: '「命格与虚空，二选一。」', win: '命印磨灭。', skill: 'spiritDrain', skillChance: 0.3, skillValue: 0.14 }
];

const TSR_CONTENT5_MONSTER_ELITE = [
    { id: 'minggejun', name: '命格督军', icon: '🔮', tier: 'epic', intro: '「三军命格，尽归我掌。」', win: '督军命盘破碎。', skill: 'rage', skillChance: 0.38 },
    { id: 'tiaowendu', name: '词条督军', icon: '📘', tier: 'legendary', intro: '「词条即法则。」', win: '督军词条剥落。', skill: 'reflect', skillChance: 0.36, skillValue: 0.07 },
    { id: 'gongmingdu', name: '共鸣督军', icon: '🧩', tier: 'epic', intro: '「四件成套，一套命。」', win: '共鸣断裂。', skill: 'armorBreak', skillChance: 0.36 },
    { id: 'lianjiedu', name: '链界督军', icon: '⛓️', tier: 'mythic', intro: '「链条不断，伤害翻倍。」', win: '链条崩断。', skill: 'overload', skillChance: 0.4 },
    { id: 'mingyundu', name: '命运督军', icon: '🧵', tier: 'legendary', intro: '「改写结局，加价。」', win: '督军命运耗尽。', skill: 'curse', skillChance: 0.4 }
];

const TSR_CONTENT5_MONSTER_BOSS = [
    { id: 'minggezun', name: '命格尊者', icon: '🔮', tier: 'legendary', intro: '「三界命格，尊我独尊。」', win: '尊者命盘封印。', skill: 'rage', skillChance: 0.48 },
    { id: 'tiaowendi', name: '词条帝', icon: '📘', tier: 'mythic', intro: '「万物皆词条，包括你。」', win: '帝座词条崩解。', skill: 'burst', skillChance: 0.5 },
    { id: 'gongmingwang', name: '共鸣王', icon: '🧩', tier: 'legendary', intro: '「套装共鸣，万界同频。」', win: '王座共鸣止息。', skill: 'shield', skillChance: 0.46, skillValue: 0.22 },
    { id: 'lianjiezhu', name: '链界之主', icon: '⛓️', tier: 'mythic', intro: '「链条即法则，断裂者死。」', win: '链界崩塌。', skill: 'timeDrain', skillChance: 0.5, skillValue: 10 },
    { id: 'mingyunni', name: '命运编织者', icon: '🧵', tier: 'mythic', intro: '「结局已定，请签字。」', win: '编织者放手。', skill: 'spiritDrain', skillChance: 0.48, skillValue: 0.2 }
];

const TSR_CONTENT5_RELIC_EXTRA = {
    minggeShard: { name: '命格碎片', icon: '🔮', desc: '攻击+10%，暴击+3%', effect: 'attack', value: 0.1, bonus: { effect: 'critRate', value: 0.03 } },
    tiaowenTome: { name: '词条秘典', icon: '📘', desc: '词条赏金感知+，币+6%', effect: 'affixReward', value: 0.08, bonus: { effect: 'currency', value: 0.06 } },
    gongmingBell: { name: '共鸣铃', icon: '🧩', desc: '生命+11%，套装感知+', effect: 'health', value: 0.11, bonus: { effect: 'treasureBonus', value: 0.12 } },
    chainLink: { name: '链界之环', icon: '⛓️', desc: '事件+10%，特殊房+8%', effect: 'eventBonus', value: 0.1, bonus: { effect: 'comboBoost', value: 0.05 } },
    fateSpindle: { name: '命运纺锤', icon: '🧵', desc: '赌局+10%，精灵充能+20%', effect: 'gamble', value: 0.1, bonus: { effect: 'spiritCharge', value: 0.2 } },
    minggeSeal: { name: '命格尊者印', icon: '🔮', desc: '【命格尊者专属】攻击+16%，暴伤+10%', effect: 'attack', value: 0.16, bonus: { effect: 'critDamage', value: 0.1 }, exclusive: 'minggezun' },
    tiaowenCrown: { name: '词条帝冕', icon: '📘', desc: '【词条帝专属】词条赏金+15%，攻击+10%', effect: 'affixReward', value: 0.15, bonus: { effect: 'attack', value: 0.1 }, exclusive: 'tiaowendi' },
    chainHeart: { name: '链界核心', icon: '⛓️', desc: '【链界之主专属】事件+14%，虚空+12%', effect: 'eventBonus', value: 0.14, bonus: { effect: 'resonanceGain', value: 0.12 }, exclusive: 'lianjiezhu' },
    fateMirror: { name: '命运镜', icon: '🪞', desc: '秘境币+12%，每层+2秒', effect: 'currency', value: 0.12, bonus: { effect: 'floorTime', value: 2 } },
    voidMing: { name: '虚空命核', icon: '🕳️', desc: '虚空共鸣+20%，反击-8%', effect: 'resonanceGain', value: 0.2, bonus: { effect: 'counterReduce', value: 0.08 } }
};

const TSR_CONTENT5_EQUIP_SETS_EXTRA = {
    mingge: { prefix: '命格', name: '命格套', icon: '🔮', desc2: '攻击+5%', desc4: '攻击+8%，暴击+4%', bonus2: { attack: 0.05 }, bonus4: { attack: 0.08, critRate: 0.04 } },
    tiaowen: { prefix: '词条', name: '词条套', icon: '📘', desc2: '词条猎+3%', desc4: '攻击+7%，词条猎+5%', bonus2: { affixHunter: 0.03 }, bonus4: { attack: 0.07, affixHunter: 0.05 } },
    gongming: { prefix: '共鸣', name: '共鸣套', icon: '🧩', desc2: '生命+5%', desc4: '攻血+7%，宝箱+10%', bonus2: { health: 0.05 }, bonus4: { attack: 0.07, health: 0.07, treasureBonus: 0.1 } },
    lianjie: { prefix: '链界', name: '链界套', icon: '⛓️', desc2: '事件+4%', desc4: '币+8%，事件+8%', bonus2: { eventLuck: 0.04 }, bonus4: { currencyGain: 0.08, eventLuck: 0.08 } },
    minggeZunShen: { prefix: '命尊', name: '命尊神装', icon: '🔮', exclusive: true, dropHint: '击败命格尊者', desc2: '攻击+8%，暴击+4%', desc4: '攻击+12%，暴击+5%，暴伤+8%', bonus2: { attack: 0.08, critRate: 0.04 }, bonus4: { attack: 0.12, critRate: 0.05, critDamage: 0.08 } },
    lianjieShen: { prefix: '链主', name: '链主战装', icon: '⛓️', exclusive: true, dropHint: '击败链界之主', desc2: '事件+6%，虚空+8%', desc4: '攻血+9%，虚空+12%', bonus2: { eventLuck: 0.06, voidPower: 0.08 }, bonus4: { attack: 0.09, health: 0.09, voidPower: 0.12 } }
};

const TSR_CONTENT5_EQUIP_EXCLUSIVE_DROPS_EXTRA = {
    minggezun: { setId: 'minggeZunShen', chance: 0.15, tier: 'legendary' },
    tiaowendi: { setId: 'tiaowen', chance: 0.12, tier: 'mythic' },
    gongmingwang: { setId: 'gongming', chance: 0.13, tier: 'legendary' },
    lianjiezhu: { setId: 'lianjieShen', chance: 0.14, tier: 'mythic' },
    mingyunni: { setId: 'mingge', chance: 0.11, tier: 'mythic' }
};

const TSR_CONTENT5_CONTRACTS_EXTRA = {
    destinyWalker: { name: '命格行者', desc: '攻击+8%，每层+1秒，币-4%', icon: '🔮', attack: 0.08, floorTime: 1, currencyPenalty: 0.04 },
    chainRunner: { name: '链界行者', desc: '事件+10%，特殊房+12%，怪物+6%', icon: '⛓️', eventBonus: 0.1, specialRoomMult: 1.12, monsterMult: 0.06 },
    affixSage: { name: '词条贤者', desc: '词条赏金+14%，行动+5%', icon: '📘', affixReward: 0.14, timeCost: 0.05 },
    resonanceKeeper: { name: '共鸣守护', desc: '生命+12%，宝箱+15%', icon: '🧩', health: 0.12, treasureBonus: 0.15, timeMod: -12 }
};

const TSR_CONTENT5_CONTRACT_SYNERGIES_EXTRA = [
    { keys: ['destinyWalker', 'xiuxianPath'], name: '仙命双修', desc: '攻血+5%，每层+2秒', bonus: { attack: 0.05, health: 0.05, floorTime: 2 } },
    { keys: ['chainRunner', 'daoWanderer'], name: '云游链界', desc: '事件+8%，特殊房+8%', bonus: { eventBonus: 0.08, specialRoomMult: 1.08 } },
    { keys: ['affixSage', 'affixLord'], name: '词条双圣', desc: '词条赏金+10%，词条率+8%', bonus: { affixReward: 0.1, affixRollBoost: 0.08 } },
    { keys: ['resonanceKeeper', 'codexKeeper'], name: '图鉴共鸣', desc: '特殊房+8%，生命+6%', bonus: { specialRoomMult: 1.08, health: 0.06 } }
];

const TSR_CONTENT5_SPECIAL_ROOM_TYPES = [
    'minggedian', 'tiaowenjing', 'gongmingdian', 'lianjiehub', 'mingyunfang', 'xukongmingtan'
];

const TSR_CONTENT5_MEME_ROOM_TYPES = [
    'rngtemple', 'buildbible', 'tierlisthall', 'minmaxlab', 'metachurch', 'grindcave'
];

const TSR_CONTENT5_ROOM_META = {
    minggedian: { name: '命格殿', icon: '🔮', color: '#a78bfa' },
    tiaowenjing: { name: '词条秘境', icon: '📘', color: '#38bdf8' },
    gongmingdian: { name: '共鸣殿', icon: '🧩', color: '#4ade80' },
    lianjiehub: { name: '链界枢纽', icon: '⛓️', color: '#f472b6' },
    mingyunfang: { name: '命运纺坊', icon: '🧵', color: '#eab308' },
    xukongmingtan: { name: '虚空命坛', icon: '🕳️', color: '#6366f1' },
    rngtemple: { name: 'RNG神殿', icon: '🎲', color: '#f59e0b' },
    buildbible: { name: '构筑圣经', icon: '📖', color: '#94a3b8' },
    tierlisthall: { name: '节奏榜大厅', icon: '📊', color: '#22d3ee' },
    minmaxlab: { name: '极值实验室', icon: '🔬', color: '#8b5cf6' },
    metachurch: { name: '版本教堂', icon: '⛪', color: '#64748b' },
    grindcave: { name: '肝帝洞窟', icon: '⛏️', color: '#ef4444' }
};

const TSR_CONTENT5_ROOM_DEFS = {
    minggedian: {
        title: '🔮 命格殿', intro: '「三界命格，在此一借。」',
        options: [
            { id: 'borrow', label: '借命格 · 命格回响', btn: 'tsr-btn-gold', reward: { destinyEcho: true, timeCost: 16, log: '命格回响！', theme: 'legend' } },
            { id: 'meditate', label: '悟命 · 攻击+14%×3层', btn: 'tsr-btn-purple', reward: { buff: { effect: 'attack', value: 0.14, duration: 3 }, timeCost: 18, log: '悟命成功！', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 10, log: '+10秒' } }
        ]
    },
    tiaowenjing: {
        title: '📘 词条秘境', intro: '「词条越多，赏金越香。」',
        options: [
            { id: 'hunt', label: '猎词条 · 赏金+15%', btn: 'tsr-btn-gold', reward: { affixRewardRun: 0.15, timeCost: 14, log: '词条赏金+15%', theme: 'contract' } },
            { id: 'study', label: '研读 · 预览2层', btn: 'tsr-btn-safe', reward: { oraclePreview: 2, currency: 65, timeCost: 12, log: '预览2层', theme: 'legend' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'zhenpanFu', log: '获得破阵符' } }
        ]
    },
    gongmingdian: {
        title: '🧩 共鸣殿', intro: '「套装不齐？共鸣照打。」',
        options: [
            { id: 'resonate', label: '共鸣 · 随机装备', btn: 'tsr-btn-gold', reward: { equipDrop: true, timeCost: 16, log: '共鸣铸装！', theme: 'gold' } },
            { id: 'harmony', label: '调和 · 生命+10%', btn: 'tsr-btn-safe', reward: { heal: 0.1, spiritCharge: 25, timeCost: 14, log: '生命调和', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 72, log: '+72币' } }
        ]
    },
    lianjiehub: {
        title: '⛓️ 链界枢纽', intro: '「别断链，断了就没加成。」',
        options: [
            { id: 'extend', label: '续链 · 链奖励+30%', btn: 'tsr-btn-gold', reward: { chainBoost: 0.3, timeCost: 12, log: '遭遇链奖励+30%！', theme: 'legend' } },
            { id: 'gamble', label: '断链赌局 · 50%±30秒', btn: 'tsr-btn-risk', reward: { gambleTime: true, log: '链界赌局！', theme: 'fortune' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { voidResonance: 5, log: '虚空共鸣+5' } }
        ]
    },
    mingyunfang: {
        title: '🧵 命运纺坊', intro: '「结局未定，线在我手。」',
        options: [
            { id: 'weave', label: '编织 · 奇点赌局', btn: 'tsr-btn-gold', reward: { singularityGamble: true, timeCost: 14, log: '命运编织！', theme: 'fortune' } },
            { id: 'cut', label: '剪线 · +90币', btn: 'tsr-btn-purple', reward: { currency: 90, timeCost: 12, log: '+90币', theme: 'gold' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { eventBonusRun: 0.06, log: '事件+6%（本局）', theme: 'legend' } }
        ]
    },
    xukongmingtan: {
        title: '🕳️ 虚空命坛', intro: '「以命换共鸣，童叟无欺。」',
        options: [
            { id: 'offer', label: '献祭 · 虚空+15', btn: 'tsr-btn-purple', reward: { voidResonance: 15, time: -8, timeCost: 16, log: '虚空共鸣+15', theme: 'void' } },
            { id: 'absorb', label: '吸纳 · 充能+45', btn: 'tsr-btn-gold', reward: { spiritCharge: 45, spiritBond: 3, timeCost: 18, log: '灵脉吸纳！', theme: 'spirit' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 12, log: '+12秒' } }
        ]
    },
    rngtemple: {
        title: '🎲 随机神殿', intro: '「随机即正义，不服重开。」',
        options: [
            { id: 'pray', label: '祈祷 · 50%大丰收', btn: 'tsr-btn-gold', reward: { singularityGamble: true, log: 'RNG祈祷！', theme: 'fortune' } },
            { id: 'reroll', label: '重开 · 随机奖励', btn: 'tsr-btn-purple', reward: { randomLoot: true, timeCost: 10, log: '重开！', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 50, log: '+50币' } }
        ]
    },
    buildbible: {
        title: '📖 构筑圣经', intro: '「最优解写在第999页。」',
        options: [
            { id: 'read', label: '抄作业 · 攻击+15%×2层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.15, duration: 2 }, timeCost: 12, log: '抄作业成功！', theme: 'boss' } },
            { id: 'innovate', label: '创新 · 链奖励+20%', btn: 'tsr-btn-purple', reward: { chainBoost: 0.2, timeCost: 14, log: '创新构筑，链+20%', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 6, log: '+6秒' } }
        ]
    },
    tierlisthall: {
        title: '📊 节奏榜大厅', intro: '「你的BD：T3（下面还有T4）。」',
        options: [
            { id: 'climb', label: '冲榜 · 攻击+12%×3层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.12, duration: 3 }, timeCost: 14, log: '冲榜！', theme: 'boss' } },
            { id: 'copium', label: '嘴硬 · +70币', btn: 'tsr-btn-purple', reward: { currency: 70, memeBonus: 0.25, timeCost: 10, log: '下次梗房+25%', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 5, log: '+5秒' } }
        ]
    },
    minmaxlab: {
        title: '🔬 极值实验室', intro: '「最大化输出，最小化乐趣。」',
        options: [
            { id: 'calc', label: '精算 · 暴击+感知', btn: 'tsr-btn-gold', reward: { buff: { effect: 'critRate', value: 0.05, duration: 0 }, affixRewardRun: 0.08, timeCost: 16, log: '精算完成！', theme: 'contract' } },
            { id: 'overfit', label: '过拟合 · -10秒，币+100', btn: 'tsr-btn-risk', reward: { time: -10, currency: 100, log: '过拟合！', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { voidResonance: 4, log: '虚空共鸣+4' } }
        ]
    },
    metachurch: {
        title: '⛪ 版本教堂', intro: '「新神登基，旧神安葬。」',
        options: [
            { id: 'worship', label: '膜拜版本 · 事件+8%', btn: 'tsr-btn-gold', reward: { eventBonusRun: 0.08, timeCost: 14, log: '版本祝福！', theme: 'rainbow' } },
            { id: 'heretic', label: '异端 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', log: '异端审判！', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 58, log: '+58币' } }
        ]
    },
    grindcave: {
        title: '⛏️ 肝帝洞窟', intro: '「时间不是问题，问题是没时间。」',
        options: [
            { id: 'grind', label: '开肝 · 精灵经验+90', btn: 'tsr-btn-gold', reward: { spiritExp: 90, timeCost: 20, log: '精灵经验+90', theme: 'spirit' } },
            { id: 'burn', label: '爆肝 · 50%±35秒', btn: 'tsr-btn-risk', reward: { gambleTime: true, log: '爆肝赌局！', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { chainBoost: 0.15, log: '链奖励+15%', theme: 'legend' } }
        ]
    }
};

const TSR_CONTENT5_SHOP_EXTRA = {
    destinyCompass: { name: '命格罗盘', description: '永久特殊房+1.5%（限购3）', cost: 240000, type: 'permanent', effect: 'destiny_compass', maxPurchase: 3, purchased: 0, category: 'codex', icon: '🔮' },
    chainSigil: { name: '链界符印', description: '永久局内秘境币+8%（限购3）', cost: 220000, type: 'permanent', effect: 'chain_sigil', maxPurchase: 3, purchased: 0, category: 'enhance', icon: '⛓️' },
    affixCodexBoost: { name: '词条图鉴增幅', description: '永久词条赏金+5%（限购4）', cost: 200000, type: 'permanent', effect: 'affix_codex_boost', maxPurchase: 4, purchased: 0, category: 'codex', icon: '📘' },
    resonanceStone: { name: '共鸣石', description: '永久宝库收益+12%（限购3）', cost: 260000, type: 'permanent', effect: 'resonance_stone', maxPurchase: 3, purchased: 0, category: 'enhance', icon: '🧩' }
};

const TSR_CONTENT4_SHOP_EXTRA = {
    jijiaScrapPack: { name: '机甲残骸包', description: '下次冒险开局携带机甲燃料×1', cost: 180000, type: 'permanent', effect: 'jijia_fuel_supply', maxPurchase: 3, purchased: 0, category: 'enhance', icon: '🤖' },
    quantumChipPack: { name: '量子芯片包', description: '下次冒险开局携带量子骰×1', cost: 195000, type: 'permanent', effect: 'quantum_dice_supply', maxPurchase: 3, purchased: 0, category: 'enhance', icon: '⚛️' }
};

const TSR_CONTENT5_ACHIEVEMENTS_EXTRA = [
    { id: 'contentChain15Run', name: '链界行者', desc: '单局遭遇链达到15', icon: '⛓️' },
    { id: 'minggeRelic', name: '命格认可', desc: '获得命格尊者印遗物', icon: '🔮' },
    { id: 'chainRelic', name: '链界加冕', desc: '获得链界核心遗物', icon: '⛓️' },
    { id: 'contentRoom250', name: '秘境真仙', desc: '累计遭遇250次特殊房间', icon: '🧭', need: { specialRooms: 250 } }
];

const TSR_CONTENT5_TICKER_LINES = [
    '第五波：命格殿、链界枢纽、命运纺坊等新房间开放',
    '命格尊者、链界之主可掉落传说专属神装',
    '命格行者、链界行者等新契约已加入池',
    '链界枢纽可提升遭遇链奖励倍率'
];

const TSR_EXT_CONTRACT_UNLOCK = {
    jijiaPilot: () => (player.timeSecretRealm?.lifetimeStats?.genericContentRooms || 0) >= 15 || (player.timeSecretRealm?.codex?.rooms?.jijiagongfang || 0) >= 1,
    hongmengWalker: () => (player.timeSecretRealm?.clearCount || 0) >= 5,
    quantumGambler: () => (player.timeSecretRealm?.lifetimeStats?.gambles || 0) >= 8,
    titanGuard: () => (player.timeSecretRealm?.bestFloor || 0) >= 20,
    xiuxianPath: () => true,
    relicSeeker: () => (player.timeSecretRealm?.codex?.relics && Object.keys(player.timeSecretRealm.codex.relics).length >= 15),
    destinyWalker: () => Object.keys(player.timeSecretRealm?.destinyGrid?.unlocked || {}).length >= 3,
    chainRunner: () => (player.timeSecretRealm?.lifetimeStats?.genericContentRooms || 0) >= 25,
    affixSage: () => (player.timeSecretRealm?.lifetimeStats?.affixKills || 0) >= 15,
    resonanceKeeper: () => Object.keys(player.timeSecretRealm?.codex?.equipmentSets || {}).length >= 6
};

function applyTsrContent5ShopEffect(itemKey, item, tsr) {
    if (!item?.effect || !tsr) return false;
    if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
    switch (item.effect) {
        case 'destiny_compass':
            tsr.permanentBonuses.spiritPact = (tsr.permanentBonuses.spiritPact || 0) + 0.015;
            logAction('命格罗盘生效！特殊房+1.5%', 'success');
            return true;
        case 'chain_sigil':
            tsr.permanentBonuses.runCurrencyBonus = (tsr.permanentBonuses.runCurrencyBonus || 0) + 0.08;
            logAction('链界符印生效！局内币+8%', 'success');
            return true;
        case 'affix_codex_boost': {
            const cap = typeof TSR_AFFIX_TOME_MAX === 'number' ? TSR_AFFIX_TOME_MAX : 0.4;
            if ((tsr.permanentBonuses.affixTome || 0) >= cap) {
                logAction('词条赏金已达上限', 'error');
                return false;
            }
            tsr.permanentBonuses.affixTome = Math.min(cap, (tsr.permanentBonuses.affixTome || 0) + 0.05);
            logAction(`词条图鉴增幅！词条赏金+5%（累计+${(tsr.permanentBonuses.affixTome * 100).toFixed(0)}%）`, 'success');
            return true;
        }
        case 'resonance_stone':
            tsr.permanentBonuses.vaultBonus = (tsr.permanentBonuses.vaultBonus || 0) + 0.12;
            logAction('共鸣石生效！宝库收益+12%', 'success');
            return true;
        case 'jijia_fuel_supply':
            if (!tsr.nextRunConsumables) tsr.nextRunConsumables = [];
            tsr.nextRunConsumables.push('jijiaFuel');
            logAction('机甲燃料将在下次冒险开局加入背包', 'success');
            return true;
        case 'quantum_dice_supply':
            if (!tsr.nextRunConsumables) tsr.nextRunConsumables = [];
            tsr.nextRunConsumables.push('quantumDice');
            logAction('量子骰将在下次冒险开局加入背包', 'success');
            return true;
        default:
            return false;
    }
}

function canUseTsrExtendedContract(key) {
    if (!TSR_RUN_CONTRACTS[key] || key === 'none') return true;
    const fn = TSR_EXT_CONTRACT_UNLOCK[key];
    if (!fn) return true;
    return !!fn();
}

function injectTsrExtendedContractCards() {
    const sections = document.querySelectorAll('.tsr-contract-section .tsr-contract-cards-v3');
    if (!sections.length || document.querySelector('[data-contract="destinyWalker"]')) return;
    const extKeys = ['xiuxianPath', 'relicSeeker', 'daoWanderer', 'jijiaPilot', 'hongmengWalker', 'quantumGambler', 'titanGuard', 'destinyWalker', 'chainRunner', 'affixSage', 'resonanceKeeper'];
    sections.forEach((container, idx) => {
        const role = idx === 0 ? 'primary' : 'sub';
        const selectFn = role === 'primary' ? 'selectTsrContract' : 'selectTsrSubContract';
        extKeys.forEach(key => {
            if (container.querySelector(`[data-contract="${key}"]`)) return;
            const c = TSR_RUN_CONTRACTS[key];
            if (!c) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'tsr-contract-card tsr-contract-ext';
            btn.dataset.role = role;
            btn.dataset.contract = key;
            btn.onclick = () => window[selectFn](key);
            const unlocked = canUseTsrExtendedContract(key);
            if (!unlocked) {
                btn.classList.add('tsr-contract-locked');
                btn.disabled = true;
            }
            btn.innerHTML = `<span>${c.icon}</span><b>${c.name}</b><small>${(c.desc || '').split('，')[0]}</small>`;
            container.appendChild(btn);
        });
    });
}

function patchTsrExtendedContractSelect() {
    if (typeof selectTsrContract === 'function' && !selectTsrContract.__tsrExt5Patched) {
        const _orig = selectTsrContract;
        selectTsrContract = function (key) {
            if (key !== 'none' && !canUseTsrExtendedContract(key)) {
                logAction('该扩展契约尚未解锁', 'warning');
                return;
            }
            return _orig(key);
        };
        selectTsrContract.__tsrExt5Patched = true;
    }
    if (typeof selectTsrSubContract === 'function' && !selectTsrSubContract.__tsrExt5Patched) {
        const _origSub = selectTsrSubContract;
        selectTsrSubContract = function (key) {
            if (key !== 'none' && !canUseTsrExtendedContract(key)) {
                logAction('该扩展契约尚未解锁', 'warning');
                return;
            }
            return _origSub(key);
        };
        selectTsrSubContract.__tsrExt5Patched = true;
    }
}

function checkTsrContentAchievements5(runContext) {
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
    if ((ls.specialRooms || 0) >= 250) unlock('contentRoom250');
    if ((tsr.currentRun?.encounterChainPeak || 0) >= 15 || (runContext?.chainPeak || 0) >= 15) unlock('contentChain15Run');
    if ((tsr.currentRun?.relics || []).includes('minggeSeal') || tsr.codex?.relics?.minggeSeal) unlock('minggeRelic');
    if ((tsr.currentRun?.relics || []).includes('chainHeart') || tsr.codex?.relics?.chainHeart) unlock('chainRelic');
}

function initTsrContentExtensions5() {
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_CONTENT5_MONSTER_BATTLE);
        TSR_MONSTER_POOL.elite.push(...TSR_CONTENT5_MONSTER_ELITE);
        TSR_MONSTER_POOL.boss.push(...TSR_CONTENT5_MONSTER_BOSS);
    }
    if (typeof TSR_RELIC_POOL !== 'undefined') Object.assign(TSR_RELIC_POOL, TSR_CONTENT5_RELIC_EXTRA);
    if (typeof TSR_EQUIP_SETS !== 'undefined') Object.assign(TSR_EQUIP_SETS, TSR_CONTENT5_EQUIP_SETS_EXTRA);
    if (typeof TSR_EQUIP_EXCLUSIVE_DROPS !== 'undefined') Object.assign(TSR_EQUIP_EXCLUSIVE_DROPS, TSR_CONTENT5_EQUIP_EXCLUSIVE_DROPS_EXTRA);
    if (typeof TSR_EQUIP_EXCLUSIVE_NAMES !== 'undefined') {
        Object.assign(TSR_EQUIP_EXCLUSIVE_NAMES, {
            minggeZunShen: {
                weapon: { name: '命尊裁命剑', icon: '⚔️' },
                armor: { name: '命尊星轨甲', icon: '🛡️' },
                ring: { name: '命尊定数戒', icon: '💍' },
                chronos: { name: '命尊时命轮', icon: '⏱️' }
            },
            lianjieShen: {
                weapon: { name: '链主断界刃', icon: '⚔️' },
                armor: { name: '链主连环甲', icon: '🛡️' },
                ring: { name: '链主枢纽戒', icon: '💍' },
                chronos: { name: '链主时链环', icon: '⏱️' }
            }
        });
    }
    if (typeof TSR_EQUIP_PREFIXES !== 'undefined') {
        Object.values(TSR_CONTENT5_EQUIP_SETS_EXTRA).forEach(s => {
            if (s.prefix && !TSR_EQUIP_PREFIXES.includes(s.prefix)) TSR_EQUIP_PREFIXES.push(s.prefix);
        });
    }
    if (typeof TSR_RUN_CONTRACTS !== 'undefined') Object.assign(TSR_RUN_CONTRACTS, TSR_CONTENT5_CONTRACTS_EXTRA);
    if (typeof TSR_CONTRACT_SYNERGIES !== 'undefined') TSR_CONTRACT_SYNERGIES.push(...TSR_CONTENT5_CONTRACT_SYNERGIES_EXTRA);
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') TSR_ACHIEVEMENTS.push(...TSR_CONTENT5_ACHIEVEMENTS_EXTRA);
    if (typeof TSR_TICKER_LINES !== 'undefined') TSR_TICKER_LINES.push(...TSR_CONTENT5_TICKER_LINES);

    if (typeof TSR_CONTENT_ROOM_DEFS !== 'undefined') Object.assign(TSR_CONTENT_ROOM_DEFS, TSR_CONTENT5_ROOM_DEFS);
    if (typeof TSR_CONTENT_ROOM_META !== 'undefined') Object.assign(TSR_CONTENT_ROOM_META, TSR_CONTENT5_ROOM_META);
    if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined') TSR_SPECIAL_ROOM_TYPES.push(...TSR_CONTENT5_SPECIAL_ROOM_TYPES);
    if (typeof TSR_MEME_ROOM_TYPES !== 'undefined') TSR_MEME_ROOM_TYPES.push(...TSR_CONTENT5_MEME_ROOM_TYPES);

    if (typeof TSR_CODEX_ROOMS !== 'undefined') {
        [...TSR_CONTENT5_SPECIAL_ROOM_TYPES, ...TSR_CONTENT5_MEME_ROOM_TYPES].forEach(key => {
            const meta = TSR_CONTENT5_ROOM_META[key];
            if (meta && !TSR_CODEX_ROOMS.find(r => r.key === key)) {
                TSR_CODEX_ROOMS.push({ key, name: meta.name, icon: meta.icon });
            }
        });
    }

    if (typeof getDefaultTsrShopItems === 'function' && !getDefaultTsrShopItems.__tsrContent5Patched) {
        const _prev = getDefaultTsrShopItems;
        getDefaultTsrShopItems = function () {
            const base = _prev();
            return { ...base, ...TSR_CONTENT4_SHOP_EXTRA, ...TSR_CONTENT5_SHOP_EXTRA };
        };
        getDefaultTsrShopItems.__tsrContent5Patched = true;
        getDefaultTsrShopItems.__tsrContent4Patched = _prev.__tsrContent4Patched;
        getDefaultTsrShopItems.__tsrContent3Patched = _prev.__tsrContent3Patched;
        getDefaultTsrShopItems.__tsrContent2Patched = _prev.__tsrContent2Patched;
        getDefaultTsrShopItems.__tsrContentPatched = _prev.__tsrContentPatched;
    }

    if (typeof applyTsrContentShopEffect === 'function' && !applyTsrContentShopEffect.__tsrContent5Patched) {
        const _prevShop = applyTsrContentShopEffect;
        applyTsrContentShopEffect = function (itemKey, item, tsr) {
            return applyTsrContent5ShopEffect(itemKey, item, tsr) || _prevShop(itemKey, item, tsr);
        };
        applyTsrContentShopEffect.__tsrContent5Patched = true;
    }

    if (typeof checkTsrContentAchievements === 'function' && !checkTsrContentAchievements.__tsrContent5Patched) {
        const _prevAch = checkTsrContentAchievements;
        checkTsrContentAchievements = function (ctx) {
            _prevAch(ctx);
            checkTsrContentAchievements5(ctx);
        };
        checkTsrContentAchievements.__tsrContent5Patched = true;
        checkTsrContentAchievements.__tsrContent4Patched = _prevAch.__tsrContent4Patched;
        checkTsrContentAchievements.__tsrContent3Patched = _prevAch.__tsrContent3Patched;
        checkTsrContentAchievements.__tsrContent2Patched = _prevAch.__tsrContent2Patched;
    }

    patchTsrExtendedContractSelect();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectTsrExtendedContractCards);
    } else {
        setTimeout(injectTsrExtendedContractCards, 0);
    }
    if (typeof updateTsrSpiritContractUI === 'function' && !updateTsrSpiritContractUI.__tsrExt5Patched) {
        const _origUI = updateTsrSpiritContractUI;
        updateTsrSpiritContractUI = function () {
            _origUI();
            injectTsrExtendedContractCards();
            document.querySelectorAll('.tsr-contract-card.tsr-contract-ext').forEach(el => {
                const key = el.dataset.contract;
                const unlocked = canUseTsrExtendedContract(key);
                el.classList.toggle('tsr-contract-locked', !unlocked);
                el.disabled = !unlocked;
            });
        };
        updateTsrSpiritContractUI.__tsrExt5Patched = true;
    }
}

initTsrContentExtensions5();

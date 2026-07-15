/**
 * 时光秘境 · 全系统内容扩展（怪物/遗物/套装/房间/星运/命运卡/成就/商店等）
 */
const TSR_CONTENT_MONSTER_BATTLE = [
    { id: 'cachestorm', name: '缓存风暴精', icon: '🌪️', tier: 'uncommon', intro: '「你的进度条，我的自助餐。」', win: '风暴被强制清缓存。', skill: 'slow', skillChance: 0.26 },
    { id: 'pingphantom', name: 'Ping幽灵', icon: '👻', tier: 'common', intro: '「999ms……还在路上。」', win: '幽灵被 traceroute 了。', skill: 'timeDrain', skillChance: 0.24, skillValue: 3 },
    { id: 'scopegoblin', name: '需求膨胀哥布林', icon: '📈', tier: 'uncommon', intro: '「就改一点点——指全部。」', win: '哥布林被砍回 v1.0。', skill: 'heal', skillChance: 0.22, skillValue: 0.06 },
    { id: 'darkmodeimp', name: '暗黑模式小鬼', icon: '🌑', tier: 'common', intro: '「护眼？先交订阅费。」', win: '小鬼被切回浅色模式。', skill: 'curse', skillChance: 0.2 },
    { id: 'copilotshade', name: 'Copilot幽影', icon: '🤖', tier: 'rare', intro: '「我建议你重构整个项目。」', win: '幽影被 mute 了。', skill: 'shield', skillChance: 0.28, skillValue: 0.12 },
    { id: 'standupwraith', name: '站会怨灵', icon: '👥', tier: 'uncommon', intro: '「今天站多久？站到下班。」', win: '怨灵宣布散会。', skill: 'timeDrain', skillChance: 0.3, skillValue: 4 },
    { id: 'firewallgolem', name: '防火墙魔像', icon: '🧱', tier: 'rare', intro: '「403 Forbidden，包括你的攻击。」', win: '魔像规则被白名单了。', skill: 'shield', skillChance: 0.32, skillValue: 0.16 },
    { id: 'npmhydra', name: 'NPM九头蛇', icon: '🐍', tier: 'epic', intro: '「依赖地狱，欢迎光临。」', win: '九头蛇被 npm audit fix 了。', skill: 'rage', skillChance: 0.3 },
    { id: 'gitblame', name: 'Git Blame怨念', icon: '📜', tier: 'rare', intro: '「这行代码，是你写的。」', win: '怨念被 squash 了。', skill: 'curse', skillChance: 0.28 },
    { id: 'zoomfatigue', name: '视频会议疲劳精', icon: '📹', tier: 'common', intro: '「你能开麦吗？我听不到。」', win: '疲劳精被挂断。', skill: 'slow', skillChance: 0.25 },
    { id: 'sprintburndown', name: '燃尽图恶灵', icon: '📉', tier: 'uncommon', intro: '「曲线平了，灵魂没了。」', win: '恶灵被延期到下个 Sprint。', skill: 'timeDrain', skillChance: 0.27, skillValue: 5 },
    { id: 'chromamite', name: '溢彩螨', icon: '🌈', tier: 'epic', intro: '「七种颜色，一种加班。」', win: '螨被调色板拍扁。', skill: 'curse', skillChance: 0.3 },
    { id: 'voidtick', name: '虚空蜱', icon: '🕳️', tier: 'rare', intro: '「你的秒数，我的血包。」', win: '蜱被虚空驱虫剂清除。', skill: 'spiritDrain', skillChance: 0.28, skillValue: 0.12 },
    { id: 'omegabug', name: 'Ω序缺陷体', icon: '⚙️', tier: 'legendary', intro: '「不符合规范，请回滚。」', win: '缺陷体被 hotfix 了。', skill: 'overload', skillChance: 0.32 },
    { id: 'quantumcat', name: '薛定谔的猫妖', icon: '🐱', tier: 'mythic', intro: '「既死又活，直到你打开盒子。」', win: '猫妖被观测坍缩。', skill: 'phaseWalk', skillChance: 0.35 }
];

const TSR_CONTENT_MONSTER_ELITE = [
    { id: 'sprinttyrant', name: 'Sprint暴君', icon: '👹', tier: 'epic', intro: '「两周上线，不接受反驳。」', win: '暴君被砍进 Backlog。', skill: 'rage', skillChance: 0.38 },
    { id: 'architectelite', name: '架构督军', icon: '🏗️', tier: 'legendary', intro: '「微服务拆分，先从你的血量开始。」', win: '督军被降级为单体。', skill: 'shield', skillChance: 0.4, skillValue: 0.2 },
    { id: 'affixwarden', name: '词条典狱长', icon: '🏷️', tier: 'epic', intro: '「每个词条，都是一份加班合同。」', win: '典狱长被词条猎人解雇。', skill: 'curse', skillChance: 0.36 },
    { id: 'spiritmarshal', name: '灵域元帅', icon: '⚔️', tier: 'legendary', intro: '「你的精灵，编制归我。」', win: '元帅被撤职。', skill: 'spiritDrain', skillChance: 0.42, skillValue: 0.2 },
    { id: 'voidcaptain', name: '虚空舰长', icon: '🚀', tier: 'epic', intro: '「全舰共鸣，目标：你的倒计时。」', win: '舰长被弹射到虚空。', skill: 'timeDrain', skillChance: 0.4, skillValue: 8 },
    { id: 'chromaticduke', name: '炫彩公爵', icon: '🌈', tier: 'legendary', intro: '「霓虹即正义，加班即荣耀。」', win: '公爵的霓虹灯熄了。', skill: 'burst', skillChance: 0.38 },
    { id: 'doomherald', name: '末日先驱', icon: '⏰', tier: 'mythic', intro: '「钟声响起，截止日期已到。」', win: '先驱被延期了。', skill: 'timeDrain', skillChance: 0.45, skillValue: 10 },
    { id: 'ironreviewer', name: '铁面评审官', icon: '🔍', tier: 'epic', intro: '「请修改后重提，永远。」', win: '评审官终于通过了。', skill: 'armorBreak', skillChance: 0.34 },
    { id: 'coinbaron', name: '秘境币男爵', icon: '🪙', tier: 'rare', intro: '「你的钱包，我的 KPI。」', win: '男爵被财务审计。', skill: 'coinSteal', skillChance: 0.36, skillValue: 35 },
    { id: 'stormknight', name: '乱流骑士', icon: '🌪️', tier: 'epic', intro: '「时空乱流，请系好安全带。」', win: '骑士被甩出乱流。', skill: 'reflect', skillChance: 0.32, skillValue: 0.08 },
    { id: 'bondbreaker', name: '断缘执事', icon: '💔', tier: 'legendary', intro: '「羁绊？那是幻觉。」', win: '执事被羁绊反噬。', skill: 'bondBreak', skillChance: 0.4, skillValue: 6 },
    { id: 'singularityknight', name: '奇点骑士', icon: '💠', tier: 'mythic', intro: '「密度无限，耐心有限。」', win: '骑士被奇点过滤器拦截。', skill: 'overload', skillChance: 0.42 }
];

const TSR_CONTENT_MONSTER_BOSS = [
    { id: 'datacenterlord', name: '数据中心领主', icon: '🖥️', tier: 'legendary', intro: '「宕机是特性，扩容是信仰。」', win: '领主被迁移到云端。', skill: 'shield', skillChance: 0.44, skillValue: 0.25 },
    { id: 'affixoverlord', name: '词条霸主', icon: '🏷️', tier: 'mythic', intro: '「万物皆可词条化。」', win: '霸主被洗炼归零。', skill: 'rage', skillChance: 0.48 },
    { id: 'voidemperor', name: '虚空帝皇', icon: '👑', tier: 'mythic', intro: '「空即是满，满即是空。」', win: '帝皇退位，裂隙闭合。', skill: 'spiritDrain', skillChance: 0.46, skillValue: 0.28 },
    { id: 'chronoking', name: '时序之王', icon: '⌛', tier: 'legendary', intro: '「过去未来，都是我的领土。」', win: '之王被时序委员会弹劾。', skill: 'timeDrain', skillChance: 0.5, skillValue: 12 },
    { id: 'memeoverlord', name: '梗王霸主', icon: '🃏', tier: 'epic', intro: '「此梗已过期，请更新。」', win: '霸主被新梗淹没。', skill: 'slow', skillChance: 0.4 },
    { id: 'equipforgegod', name: '锻星之神', icon: '⚒️', tier: 'mythic', intro: '「你的装备，欠我强化费。」', win: '锻星之神熔炉熄火。', skill: 'burst', skillChance: 0.45 },
    { id: 'paradoxking', name: '悖论之王', icon: '♾️', tier: 'legendary', intro: '「既通关又失败，直到你观测。」', win: '之王被逻辑悖论噎住。', skill: 'phaseWalk', skillChance: 0.42 },
    { id: 'cataclysmherald', name: '灾变先驱', icon: '🌋', tier: 'mythic', intro: '「末日只是预告片。」', win: '先驱被延期上映。', skill: 'overload', skillChance: 0.5 }
];

const TSR_CONTENT_RELIC_EXTRA = {
    frostHourglass: { name: '霜冻沙漏', icon: '❄️', desc: '行动耗时-8%，每层+2秒', effect: 'timeSave', value: 0.08, bonus: { effect: 'floorTime', value: 2 } },
    blazeFang: { name: '烈焰之牙', icon: '🔥', desc: '攻击+14%，暴击+4%', effect: 'attack', value: 0.14, bonus: { effect: 'critRate', value: 0.04 } },
    tidePearl: { name: '潮汐宝珠', icon: '🌊', desc: '生命+16%，反击-6%', effect: 'health', value: 0.16, bonus: { effect: 'counterReduce', value: 0.06 } },
    huntSigil: { name: '狩猎符印', icon: '🏹', desc: '精英攻击+10%，精英币+12%', effect: 'eliteAttack', value: 0.1, bonus: { effect: 'eliteCurrency', value: 0.12 } },
    memeBell: { name: '梗铃', icon: '🔔', desc: '事件收益+12%，赌局+8%', effect: 'eventBonus', value: 0.12, bonus: { effect: 'gamble', value: 0.08 } },
    codexLens: { name: '图鉴透镜', icon: '📖', desc: '词条赏金+10%，秘境币+6%', effect: 'affixReward', value: 0.1, bonus: { effect: 'currency', value: 0.06 } },
    spiritDew: { name: '灵露', icon: '💧', desc: '精灵充能+22%，共鸣+5%', effect: 'spiritCharge', value: 0.22, bonus: { effect: 'spiritDouble', value: 0.05 } },
    warDrum: { name: '战鼓', icon: '🥁', desc: '连击+6%，首领攻击+8%', effect: 'comboBoost', value: 0.06, bonus: { effect: 'bossAttack', value: 0.08 } },
    paradoxCoin: { name: '悖论硬币', icon: '♾️', desc: '赌局+12%，陷阱率-8%', effect: 'gamble', value: 0.12, bonus: { effect: 'trapReduce', value: 0.08 } },
    libraryBookmark: { name: '秘闻书签', icon: '🔖', desc: '事件+8%，行动耗时-5%', effect: 'eventBonus', value: 0.08, bonus: { effect: 'timeSave', value: 0.05 } },
    starCompass: { name: '星图罗盘', icon: '🧭', desc: '宝箱奖励+30%，侦查+12%', effect: 'treasureBonus', value: 0.3, bonus: { effect: 'detection', value: 0.12 } },
    voidEcho: { name: '虚空回响', icon: '🕳️', desc: '虚空共鸣+22%，反击-6%', effect: 'resonanceGain', value: 0.22, bonus: { effect: 'counterReduce', value: 0.06 } },
    omegaCrown: { name: 'Ω序王冠', icon: '⚙️', desc: '【Ω序架构师专属】攻击+16%，首领攻+12%', effect: 'attack', value: 0.16, bonus: { effect: 'bossAttack', value: 0.12 }, exclusive: 'omegaArchitect' },
    singularityHeart: { name: '奇点之心', icon: '💠', desc: '【奇点核心专属】暴击+6%，虚空共鸣+25%', effect: 'critRate', value: 0.06, bonus: { effect: 'resonanceGain', value: 0.25 }, exclusive: 'singularityCore' },
    chromaticSeal: { name: '炫彩封印', icon: '🌈', desc: '【炫彩主宰专属】事件+14%，攻击+12%', effect: 'eventBonus', value: 0.14, bonus: { effect: 'attack', value: 0.12 }, exclusive: 'chromaticOverlord' },
    doomBell: { name: '末日铃铛', icon: '🔔', desc: '首领攻击+12%，每层-1秒', effect: 'bossAttack', value: 0.12, penalty: { effect: 'floorTimePenalty', value: 1 } },
    affixMagnet: { name: '词条磁石', icon: '🧲', desc: '词条赏金+14%，对词条怪反击-8%', effect: 'affixReward', value: 0.14, bonus: { effect: 'affixCounterReduce', value: 0.08 } },
    bondRose: { name: '羁绊玫瑰', icon: '🌹', desc: '精灵充能+20%，每层+2秒', effect: 'spiritCharge', value: 0.2, bonus: { effect: 'floorTime', value: 2 } },
    stormAnchor: { name: '乱流锚', icon: '⚓', desc: '乱流收益+25%，乱流风险-5%', effect: 'stormBonus', value: 0.25, penalty: { effect: 'stormRisk', value: -0.05 } },
    executionBlade: { name: '斩杀残刃', icon: '🗡️', desc: '暴击+5%，吸血+3%', effect: 'critRate', value: 0.05, bonus: { effect: 'lifeSteal', value: 0.03 } },
    fortuneKnot: { name: '运结', icon: '🪢', desc: '赌局+10%，随机事件币+10%', effect: 'gamble', value: 0.1, bonus: { effect: 'eventBonus', value: 0.1 } },
    chronoGear: { name: '时序齿轮', icon: '⚙️', desc: '行动耗时-9%，每层+3秒', effect: 'timeSave', value: 0.09, bonus: { effect: 'floorTime', value: 3 } },
    mythicHorn: { name: '神话号角', icon: '📯', desc: '首领攻击+14%，精英币+10%', effect: 'bossAttack', value: 0.14, bonus: { effect: 'eliteCurrency', value: 0.1 } },
    prismaticShell: { name: '溢彩壳', icon: '🐚', desc: '生命+12%，事件+8%', effect: 'health', value: 0.12, bonus: { effect: 'eventBonus', value: 0.08 } }
};

const TSR_CONTENT_EQUIP_SETS_EXTRA = {
    xingchen: { prefix: '星辰', name: '星辰套', icon: '⭐', desc2: '暴击+3%', desc4: '暴击+5%，暴伤+10%', bonus2: { critRate: 0.03 }, bonus4: { critRate: 0.05, critDamage: 0.1 } },
    yongye: { prefix: '永夜', name: '永夜套', icon: '🌙', desc2: '反击-5%', desc4: '生命+7%，反击-8%', bonus2: { counterReduce: 0.05 }, bonus4: { health: 0.07, counterReduce: 0.08 } },
    lieyan: { prefix: '烈焰', name: '烈焰套', icon: '🔥', desc2: '攻击+4%', desc4: '攻击+8%，穿透+4%', bonus2: { attack: 0.04 }, bonus4: { attack: 0.08, pen: 0.04 } },
    hanbing: { prefix: '寒冰', name: '寒冰套', icon: '❄️', desc2: '生命+5%', desc4: '生命+8%，护甲+5%', bonus2: { health: 0.05 }, bonus4: { health: 0.08, armor: 0.05 } },
    leiting: { prefix: '雷霆', name: '雷霆套', icon: '⚡', desc2: '暴伤+5%', desc4: '攻击+7%，暴伤+12%', bonus2: { critDamage: 0.05 }, bonus4: { attack: 0.07, critDamage: 0.12 } },
    shengyi: { prefix: '圣裔', name: '圣裔套', icon: '☀️', desc2: '吸血+3%', desc4: '攻血+5%，吸血+4%', bonus2: { lifeSteal: 0.03 }, bonus4: { attack: 0.05, health: 0.05, lifeSteal: 0.04 } },
    anying: { prefix: '暗影', name: '暗影套', icon: '🌑', desc2: '闪避+2%', desc4: '攻击+6%，闪避+4%', bonus2: { dodge: 0.02 }, bonus4: { attack: 0.06, dodge: 0.04 } },
    xuwu: { prefix: '虚无', name: '虚无套', icon: '🕳️', desc2: '穿透+3%', desc4: '攻击+9%，穿透+5%', bonus2: { pen: 0.03 }, bonus4: { attack: 0.09, pen: 0.05 } }
};

const TSR_CONTENT_EQUIP_EXCLUSIVE_DROPS_EXTRA = {
    omegaArchitect: { setId: 'omegax', chance: 0.18, tier: 'legendary' },
    singularityCore: { setId: 'qidian', chance: 0.16, tier: 'mythic' },
    chromaticOverlord: { setId: 'xingyu', chance: 0.12, tier: 'legendary' }
};

const TSR_CONTENT_STAR_FORTUNES_EXTRA = [
    { id: 'equipGleam', name: '锻星微光', icon: '⚒️', desc: '装备掉落率感知+，分解价值+10%', theme: 'gold' },
    { id: 'affixDawn', name: '词条黎明', icon: '🏷️', desc: '词条率+15%，词条赏金+10%', theme: 'affix' },
    { id: 'huntStar', name: '猎星', icon: '🏹', desc: '精英币+15%，战斗奖励+10%', theme: 'boss' },
    { id: 'memeSpark', name: '梗花火', icon: '🎆', desc: '梗房×1.35，事件+10%', theme: 'meme' },
    { id: 'libraryStar', name: '秘闻星辉', icon: '📚', desc: '特殊房+14%，秘境币+8%', theme: 'legend' },
    { id: 'voidStar', name: '虚空星芒', icon: '🕳️', desc: '虚空共鸣+30%，怪物+6%，奖励+14%', theme: 'void' },
    { id: 'omegaStar', name: 'Ω序星轨', icon: '⚙️', desc: '攻击+12%，每层-1秒', theme: 'epic' },
    { id: 'bondStar', name: '羁绊星潮', icon: '💞', desc: '精灵充能+40%，触发回血+5%', theme: 'spirit' },
    { id: 'doomStar', name: '末日星蚀', icon: '⏰', desc: '战斗奖励+14%，每层-2秒', theme: 'boss' },
    { id: 'prismStar', name: '棱镜星运', icon: '🔶', desc: '事件+12%，宝箱+20%', theme: 'rainbow' },
    { id: 'chronoStar', name: '时序星环', icon: '⌛', desc: '行动耗时-8%，每层+4秒', theme: 'gold' },
    { id: 'singularityStar', name: '奇点星辉', icon: '💠', desc: '攻击+8%，币+15%，预览1层', theme: 'epic' }
];

const TSR_CONTENT_STAR_FORTUNE_EFFECTS_EXTRA = {
    equipGleam: { currencyMod: 0.08 },
    affixDawn: { affixRollBoost: 0.15, affixReward: 0.1 },
    huntStar: { battleReward: 0.1, currencyMod: 0.05 },
    memeSpark: { memeMult: 1.35, eventBonus: 0.1 },
    libraryStar: { specialRoomMult: 1.14, currencyMod: 0.08 },
    voidStar: { resonanceGain: 0.3, monsterMult: 0.06, currencyMod: 0.14 },
    omegaStar: { attack: 0.12, floorTime: -1 },
    bondStar: { spiritMult: 1.4, spiritHealBonus: 0.05 },
    doomStar: { battleReward: 0.14, floorTime: -2 },
    prismStar: { eventBonus: 0.12, treasureBonus: 0.2 },
    chronoStar: { timeSave: 0.08, floorTime: 4 },
    singularityStar: { attack: 0.08, currencyMod: 0.15, roomPreview: 1 }
};

const TSR_CONTENT_FATE_CARDS_EXTRA = {
    forgeOath: { id: 'forgeOath', name: '锻星誓', icon: '⚒️', desc: '装备强化费-20%，起始-15秒', equipEnhanceDiscount: 0.2, timeMod: -15, theme: 'gold' },
    affixHunter: { id: 'affixHunter', name: '词条猎手', icon: '🏹', desc: '词条率+30%，词条赏金+15%', affixRollBoost: 0.3, affixReward: 0.15, theme: 'affix' },
    memeKing: { id: 'memeKing', name: '梗王', icon: '🃏', desc: '梗房×1.5，生命-10%', memeMult: 1.5, health: -0.1, theme: 'meme' },
    voidPact: { id: 'voidPact', name: '虚空契约', icon: '🕳️', desc: '虚空共鸣+40%，怪物+12%', resonanceGain: 0.4, monsterMult: 0.12, theme: 'void' },
    libraryPath: { id: 'libraryPath', name: '秘闻径', icon: '📚', desc: '特殊房+18%，事件+10%', specialRoomMult: 1.18, eventBonus: 0.1, theme: 'legend' },
    stormRider: { id: 'stormRider', name: '乱流客', icon: '🌪️', desc: '行动耗时-12%，陷阱率+10%', timeSave: 0.12, trapRate: 0.1, theme: 'boss' },
    spiritOath: { id: 'spiritOath', name: '灵誓', icon: '🧚', desc: '精灵充能+60%，起始-25秒', spiritMult: 1.6, timeMod: -25, theme: 'spirit' },
    coinMagnet: { id: 'coinMagnet', name: '吸币', icon: '🧲', desc: '秘境币+18%，战斗奖励-8%', currencyMod: 0.18, battleReward: -0.08, theme: 'gold' },
    doomGambit: { id: 'doomGambit', name: '末日赌局', icon: '💀', desc: '每层-3秒，赌局+20%', floorTime: -3, gamble: 0.2, theme: 'danger' },
    prismFate: { id: 'prismFate', name: '棱镜命', icon: '🔶', desc: '事件+15%，宝箱+25%', eventBonus: 0.15, treasureBonus: 0.25, theme: 'rainbow' },
    omegaCode: { id: 'omegaCode', name: 'Ω序码', icon: '⚙️', desc: '攻击+15%，怪物+8%，预览1层', attack: 0.15, monsterMult: 0.08, roomPreview: 1, theme: 'epic' },
    singularityBet: { id: 'singularityBet', name: '奇点赌注', icon: '💠', desc: '币+22%，每层-4秒，生命-8%', currencyMod: 0.22, floorTime: -4, health: -0.08, theme: 'epic' }
};

const TSR_CONTENT_FLOOR_AFFIXES_EXTRA = {
    forgeHeat: { name: '锻炉热浪', icon: '🔥', desc: '装备分解+15%，秘境币+8%', currencyMod: 0.08 },
    affixRain: { name: '词条雨', icon: '🌧️', desc: '词条率+40%，词条赏金+12%', affixRollBoost: 0.4, affixReward: 0.12 },
    memeTyphoon: { name: '梗台风', icon: '🌀', desc: '梗房×1.7，事件+10%', memeMult: 1.7, eventBonus: 0.1 },
    libraryTide: { name: '秘闻潮', icon: '📚', desc: '特殊房+20%，秘境币+6%', specialRoomMult: 1.2, currencyMod: 0.06 },
    voidEclipse: { name: '虚空蚀', icon: '🌑', desc: '怪物+10%，虚空共鸣+35%，奖励+12%', monsterMult: 0.1, resonanceGain: 0.35, currencyMod: 0.12 },
    omegaStorm: { name: 'Ω序风暴', icon: '⚙️', desc: '攻击+18%，每层-3秒', attack: 0.18, floorTime: -3 },
    singularityWave: { name: '奇点波', icon: '💠', desc: '暴击感知+，神话怪+50%', rareMonsterMult: 1.5, attack: 0.1 },
    prismaticMist: { name: '溢彩雾', icon: '🌈', desc: '事件+18%，特殊房+12%', eventBonus: 0.18, specialRoomMult: 1.12 },
    huntMoon: { name: '狩猎之月', icon: '🌙', desc: '战斗奖励+16%，精英币+10%', battleReward: 0.16, eliteCurrencyBonus: 0.1 },
    bondBloom: { name: '羁绊花开', icon: '🌸', desc: '精灵充能+90%，触发回血+7%', spiritMult: 1.9, spiritHealBonus: 0.07 },
    chronoRift: { name: '时序裂隙', icon: '⌛', desc: '行动耗时-12%，每层-2秒', timeSave: 0.12, floorTime: -2 },
    doomGale: { name: '末日狂风', icon: '💀', desc: '攻击+22%，怪物+14%，每层-4秒', attack: 0.22, monsterMult: 0.14, floorTime: -4 },
    coinFlood: { name: '币潮', icon: '🪙', desc: '秘境币+20%，陷阱率+10%', currencyMod: 0.2, trapRate: 0.1 },
    spiritGale: { name: '灵风', icon: '🌬️', desc: '精灵充能+75%，灵击+20%', spiritMult: 1.75, spiritStrikeMult: 0.2 },
    paradoxMist: { name: '悖论雾', icon: '♾️', desc: '预览1层，怪物+8%，币+12%', roomPreview: 1, monsterMult: 0.08, currencyMod: 0.12 }
};

const TSR_CONTENT_FLOOR_AFFIX_THEMES_EXTRA = {
    forgeHeat: 'gold', affixRain: 'affix', memeTyphoon: 'meme', libraryTide: 'legend',
    voidEclipse: 'void', omegaStorm: 'epic', singularityWave: 'epic', prismaticMist: 'rainbow',
    huntMoon: 'boss', bondBloom: 'spirit', chronoRift: 'gold', doomGale: 'boss',
    coinFlood: 'gold', spiritGale: 'spirit', paradoxMist: 'epic'
};

const TSR_CONTENT_ACHIEVEMENTS_EXTRA = [
    { id: 'contentRoom50', name: '秘境漫游者', desc: '累计遭遇50次特殊房间', icon: '🗺️', need: { specialRooms: 50 } },
    { id: 'contentMeme40', name: '梗海冲浪', desc: '累计遭遇40次恶趣味房间', icon: '🌊', need: { memeRooms: 40 } },
    { id: 'contentRelic40', name: '遗宝收藏家', desc: '图鉴解锁40种遗物', icon: '🏺', need: { relicCodex: 40 } },
    { id: 'contentAffix30', name: '词条终结者', desc: '累计击败30只带词条怪物', icon: '🏷️', need: { affixKills: 30 } },
    { id: 'contentVoidBurst10', name: '虚空共鸣者', desc: '累计触发10次虚空共鸣爆发', icon: '🕳️', need: { voidBursts: 10 } },
    { id: 'contentEquipSet8', name: '八套行家', desc: '图鉴记录8种不同套装掉落', icon: '🧩', need: { equipSetTypes: 8 } },
    { id: 'contentMythic20', name: '神话清道夫', desc: '累计击败20个神话级怪物', icon: '🌸', need: { mythicKills: 20 } },
    { id: 'contentOmegaClear', name: 'Ω序行者', desc: 'Ω序难度通关一次', icon: '⚙️' },
    { id: 'contentSingularityClear', name: '奇点飞升', desc: '奇点难度通关一次', icon: '💠' },
    { id: 'contentFate15', name: '命运编织者', desc: '使用命运卡通关累计15次', icon: '🎴', need: { fateCardClears: 15 } },
    { id: 'contentGenericRoom20', name: '奇遇达人', desc: '累计完成20次扩展奇遇房间', icon: '✨', need: { genericContentRooms: 20 } },
    { id: 'omegaRelic', name: 'Ω序认可', desc: '获得Ω序王冠遗物', icon: '⚙️' },
    { id: 'singularityRelic', name: '奇点契约', desc: '获得奇点之心遗物', icon: '💠' },
    { id: 'chromaticRelic', name: '炫彩加冕', desc: '获得炫彩封印遗物', icon: '🌈' }
];

const TSR_CONTENT_CONSUMABLES_EXTRA = {
    frostCapsule: { name: '霜冻胶囊', icon: '❄️', effect: 'time', value: 35, desc: '增加35秒并减速探索-8%×2层' },
    blazeElixir: { name: '烈焰灵剂', icon: '🔥', effect: 'rage', value: 0.28, desc: '攻击+28%持续3次行动' },
    affixDart: { name: '词条飞镖', icon: '🏷️', effect: 'affixScope', value: 1, desc: '下一场词条赏金+25%（可叠加）' },
    voidDust: { name: '虚空粉尘', icon: '🕳️', effect: 'spiritCharge', value: 40, desc: '精灵充能+40' },
    memeSoda: { name: '梗味汽水', icon: '🥤', effect: 'memeTea', value: 1, desc: '下次梗房收益+50%' },
    huntBait: { name: '狩猎诱饵', icon: '🍖', effect: 'bait', value: 0.65, desc: '下次战斗奖励+65%' },
    libraryTea: { name: '秘闻茶', icon: '🍵', effect: 'libraryScroll', value: 1, desc: '下2次特殊房收益+40%' },
    paradoxDice: { name: '悖论骰', icon: '♾️', effect: 'chaos', value: 1, desc: '随机触发强力的混沌效果' },
    bondCandy: { name: '羁绊糖果', icon: '🍬', effect: 'spiritBond', value: 8, desc: '亲密度+8，精灵经验+40' },
    omegaToken: { name: 'Ω序信标', icon: '⚙️', effect: 'oracleDust', value: 3, desc: '预览未来3层' },
    singularityShard: { name: '奇点碎片', icon: '💠', effect: 'starBurst', value: 1, desc: '满充能觉醒+亲密度+8' },
    prismCookie: { name: '棱镜饼干', icon: '🔶', effect: 'coffee', value: 0.18, desc: '恢复18%生命并+25秒' },
    doomHourglass: { name: '末日沙漏', icon: '⏰', effect: 'time', value: 55, desc: '增加55秒' },
    affixSwap: { name: '词条重铸符', icon: '🔄', effect: 'affixSwap', value: 1, desc: '下一场战斗重铸怪物全部词条' },
    championToken: { name: '冠军信物', icon: '🏅', effect: 'championMedal', value: 1, desc: '攻击+28%×3，战斗奖励+35%' }
};

const TSR_CONTENT_SHOP_EXTRA = {
    equipBagExpand: { name: '装备行囊扩展', description: '永久+2装备背包格（限购4）', cost: 280000, type: 'permanent', effect: 'equip_bag', maxPurchase: 4, purchased: 0, category: 'enhance', icon: '🎒' },
    equipEnhanceStack: { name: '锻星折扣券', description: '永久装备强化费-5%（限购6，可叠加）', cost: 180000, type: 'permanent', effect: 'tsr_content_enhance_discount', maxPurchase: 6, purchased: 0, category: 'enhance', icon: '⚒️' },
    affixCodexStack: { name: '词条通晓书·进阶', description: '永久词条赏金+5%（限购5，可叠加）', cost: 220000, type: 'permanent', effect: 'affix_tome', maxPurchase: 5, purchased: 0, category: 'codex', icon: '📖' },
    memePassDeluxe: { name: '梗王通行证·典藏', description: '永久梗房遭遇率×2（限购1）', cost: 350000, type: 'permanent', effect: 'meme_pass', maxPurchase: 1, purchased: 0, category: 'meme', icon: '🃏' },
    voidResonanceCharm: { name: '虚空共鸣护符', description: '永久特殊房权重+1.5%（限购6，可叠加）', cost: 260000, type: 'permanent', effect: 'spirit_pact', maxPurchase: 6, purchased: 0, category: 'void', icon: '🕳️' },
    specialRoomCharm: { name: '奇遇护符', description: '永久特殊房权重+1.5%（限购3，可叠加）', cost: 240000, type: 'permanent', effect: 'spirit_pact', maxPurchase: 3, purchased: 0, category: 'codex', icon: '🍀' },
    fateRerollPack: { name: '命运重抽券包', description: '获得星运符（下次冒险开局背包）', cost: 420000, type: 'permanent', effect: 'fortune_token_supply', maxPurchase: 2, purchased: 0, category: 'fortune', icon: '🎴' },
    relicMagnetStack: { name: '遗宝磁石·进阶', description: '永久精英遗物率+10%（限购4，可叠加）', cost: 200000, type: 'permanent', effect: 'relic_magnet', maxPurchase: 4, purchased: 0, category: 'relic', icon: '🧲' },
    chronoStarter: { name: '时序Starter', description: '永久里程碑加时+8秒（限购3，可叠加）', cost: 300000, type: 'permanent', effect: 'milestone_bonus', maxPurchase: 3, purchased: 0, category: 'enhance', icon: '⌛' },
    equipWashStack: { name: '洗炼秘典·进阶', description: '永久洗炼费-8%（限购3，可叠加）', cost: 380000, type: 'permanent', effect: 'tsr_content_wash_discount', maxPurchase: 3, purchased: 0, category: 'enhance', icon: '📜' }
};

function applyTsrContentShopEffect(itemKey, item, tsr) {
    if (!item?.effect || !tsr) return false;
    if (!tsr.permanentBonuses) tsr.permanentBonuses = {};
    const pb = tsr.permanentBonuses;
    switch (item.effect) {
        case 'tsr_content_enhance_discount':
            pb.equipEnhanceDiscount = Math.min(0.45, (pb.equipEnhanceDiscount || 0) + 0.05);
            logAction(`锻星折扣券生效！强化费-${(pb.equipEnhanceDiscount * 100).toFixed(0)}%`, 'success');
            return true;
        case 'tsr_content_wash_discount':
            pb.equipReforgeDiscount = Math.min(0.55, (pb.equipReforgeDiscount || 0) + 0.08);
            logAction(`洗炼秘典进阶生效！洗炼费-${(pb.equipReforgeDiscount * 100).toFixed(0)}%`, 'success');
            return true;
        default:
            return false;
    }
}

const TSR_CONTENT_SPECIAL_ROOM_TYPES = [
    'equipshrine', 'affixlibrary', 'voidobservatory', 'spiritgrove', 'coinfountain',
    'relicworkshop', 'battleschool', 'chronogarden', 'memearchive', 'fortuneshrine',
    'omegachamber', 'singularitywell', 'prismhall', 'doomsanctuary', 'huntlodge'
];

const TSR_CONTENT_MEME_ROOM_TYPES = [
    'dailyscrum', 'techdebt', 'wifilost',
    'coffeerun', 'standupbingo', 'slackstorm', 'jiramonster', 'npmaudit',
    'darklaunch', 'rollback911'
];

const TSR_CONTENT_ROOM_META = {
    equipshrine: { name: '装备圣坛', icon: '⚔️', color: '#f97316' },
    affixlibrary: { name: '词条图书馆', icon: '📚', color: '#a78bfa' },
    voidobservatory: { name: '虚空观测台', icon: '🔭', color: '#6366f1' },
    spiritgrove: { name: '灵息树林', icon: '🌳', color: '#4ade80' },
    coinfountain: { name: '秘境币喷泉', icon: '⛲', color: '#fbbf24' },
    relicworkshop: { name: '遗物工坊', icon: '🔧', color: '#e879f9' },
    battleschool: { name: '战技学院', icon: '🎓', color: '#ef4444' },
    chronogarden: { name: '时序花园', icon: '🌺', color: '#22d3ee' },
    memearchive: { name: '梗档案馆', icon: '📼', color: '#ec4899' },
    fortuneshrine: { name: '彩运神龛', icon: '🎨', color: '#f472b6' },
    omegachamber: { name: 'Ω序密室', icon: '⚙️', color: '#94a3b8' },
    singularitywell: { name: '奇点深井', icon: '💠', color: '#818cf8' },
    prismhall: { name: '棱镜大厅', icon: '🔶', color: '#fb923c' },
    doomsanctuary: { name: '末日圣所', icon: '⏰', color: '#dc2626' },
    huntlodge: { name: '狩猎小屋', icon: '🏹', color: '#16a34a' },
    duanzi: { name: '段子手讲台', icon: '🎤', color: '#ec4899' },
    echo: { name: '时光回音廊', icon: '🔊', color: '#818cf8' },
    dailyscrum: { name: '每日站会地狱', icon: '📋', color: '#64748b' },
    techdebt: { name: '技术债仓库', icon: '📦', color: '#78716c' },
    wifilost: { name: '断网避难所', icon: '📶', color: '#ef4444' },
    coffeerun: { name: '咖啡冲刺站', icon: '☕', color: '#92400e' },
    standupbingo: { name: '站会 Bingo', icon: '🎯', color: '#a855f7' },
    slackstorm: { name: '消息风暴眼', icon: '💬', color: '#0ea5e9' },
    jiramonster: { name: 'Jira怪兽巢', icon: '🎫', color: '#2563eb' },
    npmaudit: { name: 'NPM 审计庭', icon: '🔍', color: '#dc2626' },
    darklaunch: { name: '暗发布密室', icon: '🌑', color: '#475569' },
    rollback911: { name: '回滚急救站', icon: '🚑', color: '#f97316' }
};

const TSR_CONTENT_ROOM_DEFS = {
    equipshrine: {
        title: '⚔️ 装备圣坛', intro: '圣坛上的锻星符文微微发光，似乎在等待献祭或祝福。',
        options: [
            { id: 'bless', label: '锻星祝福 · 随机装备', btn: 'tsr-btn-gold', reward: { equipDrop: true, log: '圣坛赐下一件装备！', theme: 'equip' } },
            { id: 'salvage', label: '分解精华 · +币', btn: 'tsr-btn-purple', reward: { currency: 120, log: '分解精华化为秘境币', theme: 'gold' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 5, log: '你记下了圣坛坐标，+5秒' } }
        ]
    },
    affixlibrary: {
        title: '📚 词条图书馆', intro: '架上摆满词条图鉴，借阅需要付出代价。',
        options: [
            { id: 'read', label: '研读词条 · 赏金+20%×本局', btn: 'tsr-btn-gold', reward: { affixRewardRun: 0.2, timeCost: 18, log: '词条赏金+20%（本局）', theme: 'affix' } },
            { id: 'hunt', label: '狩猎许可 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', log: '词条猎人出动！', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 60, log: '顺走一张书签，+60币' } }
        ]
    },
    voidobservatory: {
        title: '🔭 虚空观测台', intro: '望远镜对准裂隙深处，虚空在低语。',
        options: [
            { id: 'gaze', label: '凝视虚空 · 共鸣+15', btn: 'tsr-btn-purple', reward: { voidResonance: 15, timeCost: 20, log: '虚空共鸣+15', theme: 'void' } },
            { id: 'seal', label: '封印裂隙 · +30秒', btn: 'tsr-btn-safe', reward: { time: 30, heal: 0.15, log: '裂隙被封印，+30秒并回血15%', theme: 'heal' } },
            { id: 'dive', label: '深潜 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', voidResonance: 8, log: '深潜遭遇精英！', theme: 'void' } }
        ]
    },
    spiritgrove: {
        title: '🌳 灵息树林', intro: '林间灵息浓郁，精灵在你肩头兴奋地颤动。',
        options: [
            { id: 'meditate', label: '灵息冥想 · 充能+45', btn: 'tsr-btn-gold', reward: { spiritCharge: 45, spiritBond: 3, timeCost: 22, log: '灵息冥想，充能+45，亲密度+3', theme: 'spirit' } },
            { id: 'harvest', label: '采集灵果 · 经验+60', btn: 'tsr-btn-safe', reward: { spiritExp: 60, currency: 50, timeCost: 18, log: '采集灵果，经验+60', theme: 'spirit' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 8, log: '林间时光格外温柔，+8秒' } }
        ]
    },
    coinfountain: {
        title: '⛲ 秘境币喷泉', intro: '硬币在泉水中翻滚，投币可能获得回报——也可能什么都没有。',
        options: [
            { id: 'toss', label: '投币许愿 · 50%双倍', btn: 'tsr-btn-gold', reward: { gambleCoin: true, log: '投币许愿！', theme: 'fortune' } },
            { id: 'scoop', label: '舀取泉水 · +100币', btn: 'tsr-btn-safe', reward: { currency: 100, timeCost: 15, log: '+100秘境币', theme: 'gold' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 6, log: '+6秒' } }
        ]
    },
    relicworkshop: {
        title: '🔧 遗物工坊', intro: '工坊里堆满未完成的遗物胚体。',
        options: [
            { id: 'craft', label: '随机遗物胚 · 三选一', btn: 'tsr-btn-gold', reward: { relicOffer: true, log: '工坊呈上遗物胚体！', theme: 'relic' } },
            { id: 'polish', label: '打磨 · +80币', btn: 'tsr-btn-purple', reward: { currency: 80, affixRewardRun: 0.08, timeCost: 16, log: '打磨碎片，词条赏金+8%（本局）', theme: 'relic' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'luckyCoin', log: '获得幸运硬币' } }
        ]
    },
    battleschool: {
        title: '🎓 战技学院', intro: '教官磨刀霍霍：「想变强？先交学费。」',
        options: [
            { id: 'train', label: '特训 · 攻击+18%×3层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.18, duration: 3 }, timeCost: 20, log: '特训完成！攻击+18%×3层', theme: 'boss' } },
            { id: 'spar', label: '切磋 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', log: '切磋开始！', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { heal: 0.1, log: '热身完毕，回血10%' } }
        ]
    },
    chronogarden: {
        title: '🌺 时序花园', intro: '花朵按秒数绽放，采摘需要精确时机。',
        options: [
            { id: 'pick', label: '采摘时花 · +35秒', btn: 'tsr-btn-gold', reward: { time: 35, timeCost: 12, log: '+35秒', theme: 'gold' } },
            { id: 'seed', label: '播种 · 每层+2秒×本局', btn: 'tsr-btn-safe', reward: { floorTimeRun: 2, timeCost: 18, log: '每层额外+2秒（本局）', theme: 'gold' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 70, log: '+70币' } }
        ]
    },
    memearchive: {
        title: '📼 梗档案馆', intro: '「此梗已归档，请勿复读。」',
        options: [
            { id: 'browse', label: '浏览梗库 · 梗房收益+40%', btn: 'tsr-btn-gold', reward: { memeBonus: 0.4, currency: 90, timeCost: 14, log: '下次梗房收益+40%', theme: 'meme' } },
            { id: 'perform', label: '即兴表演 · 赌局', btn: 'tsr-btn-purple', reward: { gambleTime: true, log: '即兴表演赌局！', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 10, log: '+10秒' } }
        ]
    },
    fortuneshrine: {
        title: '🎨 彩运神龛', intro: '神龛七彩流转，今日运势似乎可以被撬动。',
        options: [
            { id: 'pray', label: '祈福 · 60秒双倍币', btn: 'tsr-btn-gold', reward: { luckBuff: true, timeCost: 16, log: '60秒内秘境币双倍！', theme: 'fortune' } },
            { id: 'wheel', label: '轻转轮盘 · 随机奖励', btn: 'tsr-btn-purple', reward: { randomLoot: true, log: '轮盘转动……', theme: 'fortune' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 55, log: '+55币' } }
        ]
    },
    omegachamber: {
        title: '⚙️ Ω序密室', intro: '「你的构筑不符合规范，请重构。」',
        options: [
            { id: 'compile', label: '强制编译 · 攻击+22%×2层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.22, duration: 2 }, timeCost: 22, log: '编译通过！攻击+22%×2层', theme: 'epic' } },
            { id: 'debug', label: '调试 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', log: '调试遭遇精英！', theme: 'epic' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { voidResonance: 6, log: '虚空共鸣+6' } }
        ]
    },
    singularitywell: {
        title: '💠 奇点深井', intro: '井底密度无限，投下硬币听不到回响。',
        options: [
            { id: 'drop', label: '投币深井 · 50%大丰收', btn: 'tsr-btn-gold', reward: { singularityGamble: true, log: '深井回响……', theme: 'epic' } },
            { id: 'climb', label: '攀井 · +40秒', btn: 'tsr-btn-safe', reward: { time: 40, heal: 0.12, timeCost: 25, log: '+40秒，回血12%', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 85, log: '+85币' } }
        ]
    },
    prismhall: {
        title: '🔶 棱镜大厅', intro: '七彩光柱交错，事件与宝箱似乎都被折射增强。',
        options: [
            { id: 'refract', label: '折射 · 事件+15%×本局', btn: 'tsr-btn-gold', reward: { eventBonusRun: 0.15, timeCost: 18, log: '事件收益+15%（本局）', theme: 'rainbow' } },
            { id: 'split', label: '分光 · 随机消耗品×2', btn: 'tsr-btn-purple', reward: { consumables: 2, log: '分光获得随机消耗品×2', theme: 'rainbow' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 12, log: '+12秒' } }
        ]
    },
    doomsanctuary: {
        title: '⏰ 末日圣所', intro: '圣所内时钟倒转，末日与祝福仅一线之隔。',
        options: [
            { id: 'freeze', label: '冻结末日 · +28秒', btn: 'tsr-btn-safe', reward: { time: 28, timeCost: 20, log: '+28秒', theme: 'boss' } },
            { id: 'embrace', label: '拥抱末日 · 战斗+赏金', btn: 'tsr-btn-risk', reward: { battle: 'elite', battleRewardNext: 0.35, log: '末日精英战！下战奖励+35%', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { voidResonance: 5, log: '虚空共鸣+5' } }
        ]
    },
    huntlodge: {
        title: '🏹 狩猎小屋', intro: '墙上挂满精英悬赏令，赏金猎人蠢蠢欲动。',
        options: [
            { id: 'bounty', label: '接取悬赏 · 精英战', btn: 'tsr-btn-gold', reward: { battle: 'elite', currencyBonus: 1.3, log: '悬赏精英战！赏金×1.3', theme: 'boss' } },
            { id: 'track', label: '追踪痕迹 · 词条赏金+15%', btn: 'tsr-btn-purple', reward: { affixRewardRun: 0.15, timeCost: 16, log: '词条赏金+15%（本局）', theme: 'affix' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'monsterBait', log: '获得猎怪诱饵' } }
        ]
    },
    duanzi: {
        title: '🎤 段子手讲台', intro: '台下观众面无表情，段子手却越讲越兴奋。',
        options: [
            { id: 'joke', label: '讲段子 · 50%梗房加成', btn: 'tsr-btn-gold', reward: { memeGamble: true, log: '段子效果……', theme: 'meme' } },
            { id: 'roast', label: '吐槽甲方 · +80币', btn: 'tsr-btn-purple', reward: { currency: 80, timeCost: 12, log: '吐槽成功，+80币', theme: 'meme' } },
            { id: 'leave', label: '离场', btn: 'tsr-btn-ghost', reward: { time: 8, log: '+8秒' } }
        ]
    },
    echo: {
        title: '🔊 时光回音廊', intro: '你的脚步声被放大十倍，走廊尽头有回音在重复奖励。',
        options: [
            { id: 'listen', label: '倾听回音 · 预览1层', btn: 'tsr-btn-gold', reward: { oraclePreview: 1, timeCost: 14, log: '预览未来1层', theme: 'legend' } },
            { id: 'shout', label: '呐喊 · 50%双倍币', btn: 'tsr-btn-purple', reward: { gambleCoin: true, log: '呐喊赌局！', theme: 'fortune' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 65, log: '+65币' } }
        ]
    },
    dailyscrum: {
        title: '📋 每日站会地狱', intro: '「昨天做了什么？今天做什么？有什么阻塞？」循环播放中。',
        options: [
            { id: 'endure', label: '熬完站会 · -18秒但+120币', btn: 'tsr-btn-gold', reward: { time: -18, currency: 120, log: '站会终于结束……', theme: 'meme' } },
            { id: 'skip', label: '翘会 · +15秒', btn: 'tsr-btn-safe', reward: { time: 15, log: '翘会成功，+15秒', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 40, log: '+40币' } }
        ]
    },
    techdebt: {
        title: '📦 技术债仓库', intro: '仓库堆满「以后再还」的箱子，每一口都在吸你的时间。',
        options: [
            { id: 'pay', label: '还债 · -25秒，攻击+15%×4层', btn: 'tsr-btn-risk', reward: { time: -25, buff: { effect: 'attack', value: 0.15, duration: 4 }, log: '还债！攻击+15%×4层', theme: 'meme' } },
            { id: 'borrow', label: '再借一点 · +90币', btn: 'tsr-btn-purple', reward: { currency: 90, time: -8, log: '再借90币，-8秒', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 5, log: '+5秒' } }
        ]
    },
    wifilost: {
        title: '📶 断网避难所', intro: '「网络连接已断开，正在重连……」',
        options: [
            { id: 'reboot', label: '重启路由器 · +20秒', btn: 'tsr-btn-safe', reward: { time: 20, timeCost: 18, log: '重连成功，+20秒', theme: 'meme' } },
            { id: 'offline', label: '离线摸鱼 · +70币', btn: 'tsr-btn-gold', reward: { currency: 70, memeBonus: 0.3, timeCost: 14, log: '离线摸鱼，下次梗房+30%', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 6, log: '+6秒' } }
        ]
    },
    coffeerun: {
        title: '☕ 咖啡冲刺站', intro: '浓缩咖啡的香气让你既清醒又心慌。',
        options: [
            { id: 'espresso', label: '浓缩一杯 · 回血+25秒', btn: 'tsr-btn-gold', reward: { heal: 0.12, time: 25, timeCost: 10, log: '回血12%，+25秒', theme: 'heal' } },
            { id: 'overdose', label: '连喝三杯 · 攻击+25%×2层', btn: 'tsr-btn-risk', reward: { buff: { effect: 'attack', value: 0.25, duration: 2 }, time: -10, log: '攻击+25%×2层，但-10秒', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 50, log: '+50币' } }
        ]
    },
    standupbingo: {
        title: '🎯 站会 Bingo', intro: '「有人说了"对齐"—— Bingo！」',
        options: [
            { id: 'play', label: '玩 Bingo · 50%赢+100币', btn: 'tsr-btn-gold', reward: { gambleCoin: true, log: 'Bingo！', theme: 'meme' } },
            { id: 'cheat', label: '作弊卡 · +60币', btn: 'tsr-btn-purple', reward: { currency: 60, timeCost: 12, log: '+60币', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 7, log: '+7秒' } }
        ]
    },
    slackstorm: {
        title: '💬 消息风暴眼', intro: '@channel 红点99+，风暴眼却意外平静。',
        options: [
            { id: 'mute', label: '全员静音 · +18秒', btn: 'tsr-btn-safe', reward: { time: 18, timeCost: 14, log: '+18秒', theme: 'meme' } },
            { id: 'reply', label: '回复全部 · 50%±20秒', btn: 'tsr-btn-risk', reward: { gambleTime: true, log: '回复全部赌局！', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 55, log: '+55币' } }
        ]
    },
    jiramonster: {
        title: '🎫 Jira怪兽巢', intro: '「又创建了12个子任务，请逐一验收。」',
        options: [
            { id: 'close', label: '批量关闭 · +100币', btn: 'tsr-btn-gold', reward: { currency: 100, timeCost: 20, log: '+100币', theme: 'meme' } },
            { id: 'fight', label: '与怪兽搏斗 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', log: 'Jira怪兽化为精英！', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 8, log: '+8秒' } }
        ]
    },
    npmaudit: {
        title: '🔍 NPM 审计庭', intro: '「发现47个高危漏洞，建议立即修复。」',
        options: [
            { id: 'fix', label: '依赖修复 · -15秒+攻击加成', btn: 'tsr-btn-gold', reward: { time: -15, buff: { effect: 'attack', value: 0.12, duration: 3 }, log: '修复完成！攻击+12%×3层', theme: 'meme' } },
            { id: 'ignore', label: '忽略警告 · +80币', btn: 'tsr-btn-purple', reward: { currency: 80, time: -5, log: '忽略！+80币，-5秒', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'chaosDice', log: '获得混沌骰子' } }
        ]
    },
    darklaunch: {
        title: '🌑 暗发布密室', intro: '功能已上线，但公告还没写。',
        options: [
            { id: 'launch', label: '强行发布 · 50%大成功', btn: 'tsr-btn-gold', reward: { singularityGamble: true, log: '暗发布赌局！', theme: 'meme' } },
            { id: 'rollback', label: '回滚 · +25秒', btn: 'tsr-btn-safe', reward: { time: 25, timeCost: 16, log: '+25秒', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 60, log: '+60币' } }
        ]
    },
    rollback911: {
        title: '🚑 回滚急救站', intro: '「线上炸了，先回滚再说！」',
        options: [
            { id: 'rollback', label: '紧急回滚 · +35秒', btn: 'tsr-btn-gold', reward: { time: 35, heal: 0.1, timeCost: 18, log: '回滚成功！+35秒，回血10%', theme: 'heal' } },
            { id: 'hotfix', label: '热修 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', log: '热修遭遇精英！', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { voidResonance: 4, log: '虚空共鸣+4' } }
        ]
    }
};

function handleTsrGenericContentRoom(type) {
    const def = TSR_CONTENT_ROOM_DEFS[type];
    if (!def) {
        const meta = TSR_CONTENT_ROOM_META[type] || { name: type, icon: '📍' };
        addTsrLog(`探索了「${meta.icon}${meta.name}」`, 'info');
        finishTsrMemeRoom();
        return;
    }
    const btns = def.options.map(o =>
        `<button type="button" class="tsr-btn ${o.btn}" onclick="tsrChooseGenericContentRoom('${type}','${o.id}')">${o.label}</button>`
    ).join('\n         ');
    showTsrMemePanel(def.title, def.intro, btns, def.theme);
    const tsr = player.timeSecretRealm;
    if (!tsr.lifetimeStats) tsr.lifetimeStats = {};
    tsr.lifetimeStats.genericContentRooms = (tsr.lifetimeStats.genericContentRooms || 0) + 1;
    addTsrLog(`进入${def.title}`, 'info');
}

function tsrChooseGenericContentRoom(type, optionId) {
    const tsr = player.timeSecretRealm;
    const room = tsr?.currentRun?.currentRoom;
    if (!room || room.type !== type || !room.explored) return;
    const def = TSR_CONTENT_ROOM_DEFS[type];
    const opt = def?.options?.find(o => o.id === optionId);
    if (!opt) { finishTsrMemeRoom(); return; }
    const r = opt.reward || {};
    const dm = tsr.currentRun.difficultyMultiplier || 1;

    if (r.timeCost && tsr.currentRun.timeLeft <= r.timeCost + 5) {
        addTsrLog('时光不足，未能完成行动', 'warning');
        finishTsrMemeRoom();
        return;
    }
    if (r.timeCost) tsr.currentRun.timeLeft -= r.timeCost;

    if (r.time) tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft + r.time);
    if (r.currency) addTsrRunCurrency(Math.floor(r.currency * dm));
    if (r.heal) tsrHealPlayer(r.heal);
    if (r.spiritCharge) chargeTsrSpirit(r.spiritCharge);
    if (r.spiritBond) addTsrSpiritBond(r.spiritBond);
    if (r.spiritExp) addTsrSpiritExp(Math.floor(r.spiritExp * (typeof getTsrSpiritRoomMult === 'function' ? getTsrSpiritRoomMult() : 1)));
    if (r.voidResonance) addTsrVoidResonance(r.voidResonance);
    if (r.buff) addTempBuff({ name: '奇遇增益', effect: r.buff.effect, value: r.buff.value, duration: r.buff.duration, isDebuff: false });
    if (r.affixRewardRun) tsr.currentRun.affixRewardBonus = (tsr.currentRun.affixRewardBonus || 0) + r.affixRewardRun;
    if (r.eventBonusRun) tsr.currentRun.eventBonusRun = (tsr.currentRun.eventBonusRun || 0) + r.eventBonusRun;
    if (r.floorTimeRun) tsr.currentRun.contractFloorTimeBonus = (tsr.currentRun.contractFloorTimeBonus || 0) + r.floorTimeRun;
    if (r.trapWardRun) tsr.currentRun.trapBarrier = true;
    if (r.counterShieldRun) tsr.currentRun.roomCounterReduce = (tsr.currentRun.roomCounterReduce || 0) + r.counterShieldRun;
    if (r.memeBonus) tsr.currentRun.memeRoomBonus = (tsr.currentRun.memeRoomBonus || 0) + r.memeBonus;
    if (r.battleRewardNext) tsr.currentRun.battleRewardBonus = (tsr.currentRun.battleRewardBonus || 0) + r.battleRewardNext;
    if (r.oraclePreview) tsr.currentRun.oraclePreview = Math.max(tsr.currentRun.oraclePreview || 0, r.oraclePreview);
    if (r.luckBuff) tsr.currentRun.luckExpiresAt = Date.now() + 60000;
    if (r.consumable) addTsrConsumable(r.consumable);
    if (r.consumables) {
        const keys = Object.keys(TSR_RUN_CONSUMABLES);
        for (let i = 0; i < r.consumables; i++) addTsrConsumable(keys[Math.floor(Math.random() * keys.length)]);
    }

    if (r.gambleCoin) {
        if (Math.random() < 0.5) {
            addTsrRunCurrency(Math.floor(140 * dm));
            addTsrLog('赌局胜利！获得秘境币', 'success', 'fortune');
        } else {
            tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - 12);
            addTsrLog('赌局失败，-12秒', 'warning');
        }
    }
    if (r.gambleHeal) {
        if (Math.random() < 0.5) {
            tsrHealPlayer(0.25);
            addTsrLog('炼丹成功！回血25%', 'success', 'heal');
        } else {
            applyDamage(bMul(tsr.currentRun.playerHealth, 0.08));
            addTsrLog('炸炉！损失8%生命', 'error', 'heal');
        }
    }
    if (r.gambleTime) {
        if (Math.random() < 0.5) {
            tsr.currentRun.timeLeft += 30;
            addTsrLog('赌局胜利！+30秒', 'success', 'fortune');
        } else {
            tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - 18);
            addTsrLog('赌局失败！-18秒', 'error');
        }
    }
    if (r.memeGamble) {
        if (Math.random() < 0.5) {
            tsr.currentRun.memeRoomBonus = (tsr.currentRun.memeRoomBonus || 0) + 0.5;
            addTsrLog('段子大成功！下次梗房+50%', 'success', 'meme');
        } else {
            addTsrRunCurrency(Math.floor(50 * dm));
            addTsrLog('段子冷场，但收到打赏', 'info', 'meme');
        }
    }
    if (r.singularityGamble) {
        if (Math.random() < 0.45) {
            addTsrRunCurrency(Math.floor(200 * dm));
            tsr.currentRun.timeLeft += 25;
            addTsrVoidResonance(10);
            addTsrLog('奇点大丰收！', 'success', 'epic');
        } else {
            tsr.currentRun.timeLeft = Math.max(0, tsr.currentRun.timeLeft - 15);
            addTsrLog('深井吞噬了回报……-15秒', 'warning', 'epic');
        }
    }
    if (r.randomLoot) {
        const loot = [
            () => { addTsrRunCurrency(Math.floor(100 * dm)); return '+100币'; },
            () => { tsr.currentRun.timeLeft += 20; return '+20秒'; },
            () => { chargeTsrSpirit(35); return '精灵充能+35'; },
            () => { addTsrConsumable('luckyCoin'); return '幸运硬币'; }
        ];
        const msg = loot[Math.floor(Math.random() * loot.length)]();
        addTsrLog(`轮盘结果：${msg}`, 'success', 'fortune');
    }
    if (r.equipDrop && typeof generateTsrEquipment === 'function') {
        const item = generateTsrEquipment({ floor: tsr.currentRun.currentFloor, tier: Math.random() < 0.25 ? 'rare' : 'uncommon' });
        if (item) addTsrEquipment(item, '装备圣坛');
    }
    if (r.relicOffer) {
        if ((tsr.currentRun.relics || []).length < getTsrRelicMax() && typeof rollTsrRelicChoices === 'function') {
            const choices = rollTsrRelicChoices(getTsrRelicPickCount());
            if (choices.length) {
                tsr.currentRun.relicChoices = choices;
                const panel = document.getElementById('tsrRelicPickPanel');
                const container = document.getElementById('tsrRelicPickOptions');
                if (panel && container) {
                    container.innerHTML = choices.map((key, idx) => {
                        const rel = TSR_RELIC_POOL[key];
                        return `<div class="tsr-relic-option" onclick="tsrPickRelic(${idx});finishTsrMemeRoom();">
                            <strong>${rel.icon} ${rel.name}</strong>
                            <div style="color:#c4b5fd;margin-top:4px;font-size:12px;">${rel.desc}</div>
                        </div>`;
                    }).join('');
                    panel.style.display = 'block';
                    addTsrLog('遗物工坊呈上胚体，请选择', 'success', 'relic');
                    return;
                }
            }
        }
        addTsrRunCurrency(Math.floor(90 * dm));
        addTsrLog('工坊折现为一袋秘境币', 'info', 'relic');
    }
    if (r.battle === 'elite') {
        room.isElite = true;
        room.monster = pickTsrMonsterFromPool(TSR_MONSTER_POOL.elite, tsr.currentRun.currentFloor, dm);
        let cur = Math.floor(130 * dm);
        if (r.currencyBonus) cur = Math.floor(cur * r.currencyBonus);
        room.rewards = { currency: cur, buffChance: 0.48 };
        handleBattleRoom({ forceElite: true });
        if (bLteZero(tsr.currentRun.playerHealth)) return;
    }

    if (r.chainBoost) tsr.currentRun.chainBonusMult = (tsr.currentRun.chainBonusMult || 1) + r.chainBoost;
    if (r.destinyEcho && typeof ensureTsrDestinyGrid === 'function') {
        const route = ensureTsrDestinyGrid().activeRoute;
        if (route === 'combat') addTempBuff({ name: '命格回响', effect: 'attack', value: 0.12, duration: 3, isDebuff: false });
        else if (route === 'fortune') addTsrRunCurrency(Math.floor(80 * dm));
        else addTsrVoidResonance(10);
        addTsrLog('命格路线回响触发！', 'success', 'legend');
    }

    if (r.log) addTsrLog(r.log, r.theme ? 'success' : 'info', r.theme);
    checkTsrAchievements();
    finishTsrMemeRoom();
}

function checkTsrContentAchievements(runContext) {
    const tsr = player.timeSecretRealm;
    if (!tsr?.achievements) tsr.achievements = {};
    const ls = tsr.lifetimeStats || {};
    const ctx = runContext || {};
    const unlock = (id) => {
        if (typeof unlockTsrAchievement === 'function') unlockTsrAchievement(id);
        else if (!tsr.achievements[id]) {
            tsr.achievements[id] = Date.now();
            const a = TSR_ACHIEVEMENTS.find(x => x.id === id);
            if (a) addTsrLog(`🏅 成就解锁：${a.name} — ${a.desc}`, 'success');
            invalidateTsrUiCache('codex');
        }
    };
    if ((ls.specialRooms || 0) >= 50) unlock('contentRoom50');
    if ((ls.memeRooms || 0) >= 40) unlock('contentMeme40');
    const relicCodex = Object.keys(tsr.codex?.relics || {}).length;
    if (relicCodex >= 40) unlock('contentRelic40');
    if ((ls.affixKills || 0) >= 30) unlock('contentAffix30');
    if ((ls.maxResonanceBursts || tsr.currentRun?.resonanceBursts || 0) >= 10) unlock('contentVoidBurst10');
    const setTypes = Object.keys(tsr.codex?.equipmentSets || {}).length;
    if (setTypes >= 8) unlock('contentEquipSet8');
    if ((ls.mythicKills || 0) >= 20) unlock('contentMythic20');
    if ((tsr.clearCountByDifficulty?.omega || 0) >= 1 || (ctx.cleared && tsr.currentRun?.difficultyKey === 'omega')) unlock('contentOmegaClear');
    if ((tsr.clearCountByDifficulty?.singularity || 0) >= 1 || (ctx.cleared && tsr.currentRun?.difficultyKey === 'singularity')) unlock('contentSingularityClear');
    if ((ls.fateCardClears || 0) >= 15) unlock('contentFate15');
    if ((ls.genericContentRooms || 0) >= 20) unlock('contentGenericRoom20');
    if ((tsr.currentRun?.relics || []).includes('omegaCrown') || tsr.codex?.relics?.omegaCrown) unlock('omegaRelic');
    if ((tsr.currentRun?.relics || []).includes('singularityHeart') || tsr.codex?.relics?.singularityHeart) unlock('singularityRelic');
    if ((tsr.currentRun?.relics || []).includes('chromaticSeal') || tsr.codex?.relics?.chromaticSeal) unlock('chromaticRelic');
}

function initTsrContentExtensions() {
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_CONTENT_MONSTER_BATTLE);
        TSR_MONSTER_POOL.elite.push(...TSR_CONTENT_MONSTER_ELITE);
        TSR_MONSTER_POOL.boss.push(...TSR_CONTENT_MONSTER_BOSS);
    }
    if (typeof TSR_RELIC_POOL !== 'undefined') Object.assign(TSR_RELIC_POOL, TSR_CONTENT_RELIC_EXTRA);
    if (typeof TSR_EQUIP_SETS !== 'undefined') Object.assign(TSR_EQUIP_SETS, TSR_CONTENT_EQUIP_SETS_EXTRA);
    if (typeof TSR_EQUIP_EXCLUSIVE_DROPS !== 'undefined') Object.assign(TSR_EQUIP_EXCLUSIVE_DROPS, TSR_CONTENT_EQUIP_EXCLUSIVE_DROPS_EXTRA);
    if (typeof TSR_EQUIP_PREFIXES !== 'undefined') {
        Object.values(TSR_CONTENT_EQUIP_SETS_EXTRA).forEach(s => {
            if (s.prefix && !TSR_EQUIP_PREFIXES.includes(s.prefix)) TSR_EQUIP_PREFIXES.push(s.prefix);
        });
    }
    if (typeof TSR_STAR_FORTUNES !== 'undefined') TSR_STAR_FORTUNES.push(...TSR_CONTENT_STAR_FORTUNES_EXTRA);
    if (typeof TSR_STAR_FORTUNE_EFFECTS !== 'undefined') Object.assign(TSR_STAR_FORTUNE_EFFECTS, TSR_CONTENT_STAR_FORTUNE_EFFECTS_EXTRA);
    if (typeof TSR_FATE_CARDS !== 'undefined') Object.assign(TSR_FATE_CARDS, TSR_CONTENT_FATE_CARDS_EXTRA);
    if (typeof TSR_FLOOR_AFFIXES !== 'undefined') Object.assign(TSR_FLOOR_AFFIXES, TSR_CONTENT_FLOOR_AFFIXES_EXTRA);
    if (typeof TSR_FLOOR_AFFIX_THEMES !== 'undefined') Object.assign(TSR_FLOOR_AFFIX_THEMES, TSR_CONTENT_FLOOR_AFFIX_THEMES_EXTRA);
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') TSR_ACHIEVEMENTS.push(...TSR_CONTENT_ACHIEVEMENTS_EXTRA);
    if (typeof TSR_RUN_CONSUMABLES !== 'undefined') Object.assign(TSR_RUN_CONSUMABLES, TSR_CONTENT_CONSUMABLES_EXTRA);
    if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined') TSR_SPECIAL_ROOM_TYPES.push(...TSR_CONTENT_SPECIAL_ROOM_TYPES);
    if (typeof TSR_MEME_ROOM_TYPES !== 'undefined') TSR_MEME_ROOM_TYPES.push(...TSR_CONTENT_MEME_ROOM_TYPES);

    if (typeof TSR_CODEX_ROOMS !== 'undefined') {
        [...TSR_CONTENT_SPECIAL_ROOM_TYPES, ...TSR_CONTENT_MEME_ROOM_TYPES].forEach(key => {
            const meta = TSR_CONTENT_ROOM_META[key];
            if (meta && !TSR_CODEX_ROOMS.find(r => r.key === key)) {
                TSR_CODEX_ROOMS.push({ key, name: meta.name, icon: meta.icon });
            }
        });
    }

    if (typeof getDefaultTsrShopItems === 'function' && !getDefaultTsrShopItems.__tsrContentPatched) {
        const _origShop = getDefaultTsrShopItems;
        getDefaultTsrShopItems = function () {
            return { ..._origShop(), ...TSR_CONTENT_SHOP_EXTRA };
        };
        getDefaultTsrShopItems.__tsrContentPatched = true;
    }

    if (typeof checkTsrAchievements === 'function' && !checkTsrAchievements.__tsrContentPatched) {
        const _origAch = checkTsrAchievements;
        checkTsrAchievements = function (runContext) {
            _origAch(runContext);
            checkTsrContentAchievements(runContext);
        };
        checkTsrAchievements.__tsrContentPatched = true;
    }
}

initTsrContentExtensions();

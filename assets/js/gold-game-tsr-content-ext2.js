/**
 * 时光秘境 · 内容扩展第二波（怪物/遗物/套装/房间/周词缀等）
 */
const TSR_CONTENT2_MONSTER_BATTLE = [
    { id: 'sslhandshake', name: 'SSL握手妖', icon: '🤝', tier: 'common', intro: '「证书过期？那是昨天的事。」', win: '妖被续费一年。', skill: 'slow', skillChance: 0.24 },
    { id: 'cookiegremlin', name: 'Cookie小妖', icon: '🍪', tier: 'common', intro: '「接受全部，否则别想登录。」', win: '小妖被清空缓存。', skill: 'curse', skillChance: 0.22 },
    { id: 'branchwraith', name: '分支怨灵', icon: '🌿', tier: 'uncommon', intro: '「merge conflict 已自动解决——骗你的。」', win: '怨灵被 force push。', skill: 'rage', skillChance: 0.28 },
    { id: 'dockerkraken', name: 'Docker海妖', icon: '🐙', tier: 'rare', intro: '「容器起不来？restart 一下。」', win: '海妖被 docker prune。', skill: 'shield', skillChance: 0.3, skillValue: 0.14 },
    { id: 'cicdphantom', name: 'CI/CD幽灵', icon: '👻', tier: 'uncommon', intro: '「流水线红了，但没人敢点。」', win: '幽灵被 skip 了。', skill: 'timeDrain', skillChance: 0.26, skillValue: 4 },
    { id: 'microsvcswarm', name: '微服务蜂群', icon: '🐝', tier: 'epic', intro: '「拆成128个服务，你就找不到Bug了。」', win: '蜂群被合并成单体。', skill: 'burst', skillChance: 0.32 },
    { id: 'logoverflow', name: '日志溢出精', icon: '📜', tier: 'rare', intro: '「你的磁盘，我的主场。」', win: '精被 logrotate 了。', skill: 'slow', skillChance: 0.3 },
    { id: 'featureflagimp', name: 'Feature Flag小鬼', icon: '🚩', tier: 'uncommon', intro: '「功能已上线，开关在老板手里。」', win: '小鬼被 toggle off。', skill: 'curse', skillChance: 0.24 },
    { id: 'ratelimitgolem', name: '限流魔像', icon: '🛑', tier: 'rare', intro: '「429 Too Many Requests。」', win: '魔像被提额了。', skill: 'shield', skillChance: 0.34, skillValue: 0.16 },
    { id: 'techdebtslime', name: '技术债史莱姆', icon: '🟢', tier: 'common', intro: '「以后再还，以后再说。」', win: '史莱姆被 sprint 清零。', skill: 'heal', skillChance: 0.2, skillValue: 0.07 },
    { id: 'oncallwraith', name: 'On-call怨灵', icon: '📞', tier: 'uncommon', intro: '「凌晨三点，你的手机在响。」', win: '怨灵被静音。', skill: 'timeDrain', skillChance: 0.32, skillValue: 5 },
    { id: 'sagaworm', name: 'Saga蠕虫', icon: '🪱', tier: 'epic', intro: '「分布式事务？先补偿吧。」', win: '蠕虫被回滚了。', skill: 'reflect', skillChance: 0.26, skillValue: 0.06 },
    { id: 'graphqlshade', name: 'GraphQL幽影', icon: '◆', tier: 'rare', intro: '「查询嵌套太深，你的耐心也是。」', win: '幽影被 depth limit。', skill: 'overload', skillChance: 0.28 },
    { id: 'k8spod', name: 'K8s游离Pod', icon: '☸️', tier: 'legendary', intro: '「CrashLoopBackOff，欢迎光临。」', win: 'Pod被驱逐了。', skill: 'phaseWalk', skillChance: 0.3 },
    { id: 'llmhallucination', name: 'LLM幻觉体', icon: '🤖', tier: 'mythic', intro: '「我确定这段代码能跑——大概。」', win: '幻觉体被 fact-check 了。', skill: 'curse', skillChance: 0.38 }
];

const TSR_CONTENT2_MONSTER_ELITE = [
    { id: 'archreviewer', name: '架构评审官', icon: '🏛️', tier: 'epic', intro: '「这个设计不符合 SOLID。」', win: '评审官被 defer 了。', skill: 'shield', skillChance: 0.38, skillValue: 0.18 },
    { id: 'dataguardian', name: '数据守护者', icon: '🗄️', tier: 'legendary', intro: '「你的查询没有索引。」', win: '守护者被加索引了。', skill: 'slow', skillChance: 0.4 },
    { id: 'secopsknight', name: '安全运维骑士', icon: '🔐', tier: 'epic', intro: '「漏洞已发现，修复在下个季度。」', win: '骑士被 patch 了。', skill: 'armorBreak', skillChance: 0.36 },
    { id: 'productowner', name: '产品督军', icon: '📋', tier: 'legendary', intro: '「用户故事又改了，再改一版。」', win: '督军被 scope freeze。', skill: 'timeDrain', skillChance: 0.42, skillValue: 7 },
    { id: 'devopslord', name: 'DevOps领主', icon: '⚙️', tier: 'mythic', intro: '「基础设施即代码，加班即常态。」', win: '领主被 terraform destroy。', skill: 'rage', skillChance: 0.44 },
    { id: 'cachetyrant', name: '缓存暴君', icon: '💾', tier: 'epic', intro: '「缓存击穿？那是你的问题。」', win: '暴君被 flushall。', skill: 'burst', skillChance: 0.36 },
    { id: 'mqoverlord', name: '消息队列霸主', icon: '📨', tier: 'legendary', intro: '「消息积压十万条，请排队。」', win: '霸主被 consumer 扩容。', skill: 'spiritDrain', skillChance: 0.38, skillValue: 0.18 },
    { id: 'shardingmarshal', name: '分片元帅', icon: '🔀', tier: 'epic', intro: '「数据在哪片？我也不知道。」', win: '元帅被 rebalance。', skill: 'coinSteal', skillChance: 0.34, skillValue: 30 },
    { id: 'observabilityduke', name: '可观测公爵', icon: '📊', tier: 'legendary', intro: '「监控全绿，但用户说挂了。」', win: '公爵被 alert 淹没。', skill: 'curse', skillChance: 0.4 },
    { id: 'finopsbaron', name: 'FinOps男爵', icon: '💸', tier: 'rare', intro: '「云账单又爆了，谁开的机器？」', win: '男爵被 reserved instance。', skill: 'coinSteal', skillChance: 0.38, skillValue: 40 },
    { id: 'chaosengineer', name: '混沌工程师', icon: '🐒', tier: 'mythic', intro: '「生产环境实验，刺激吗？」', win: '工程师被 rollback。', skill: 'overload', skillChance: 0.42 },
    { id: 'platformempress', name: '平台女帝', icon: '👸', tier: 'mythic', intro: '「中台赋能，前台背锅。」', win: '女帝被去中台化。', skill: 'spiritDrain', skillChance: 0.45, skillValue: 0.22 }
];

const TSR_CONTENT2_MONSTER_BOSS = [
    { id: 'cloudoverlord', name: '多云霸主', icon: '☁️', tier: 'legendary', intro: '「vendor lock-in 是特性。」', win: '霸主被多云策略绑架。', skill: 'shield', skillChance: 0.46, skillValue: 0.28 },
    { id: 'rootcauseking', name: '根因之王', icon: '🔍', tier: 'legendary', intro: '「五个为什么？问到你灵魂。」', win: '之王被 postmortem 了。', skill: 'timeDrain', skillChance: 0.48, skillValue: 11 },
    { id: 'scalabilitygod', name: '扩容之神', icon: '📈', tier: 'mythic', intro: '「水平扩展，垂直加班。」', win: '之神被 auto-scale 了。', skill: 'rage', skillChance: 0.5 },
    { id: 'legacydragon', name: '遗留系统巨龙', icon: '🐲', tier: 'mythic', intro: '「写于2008，运行于永远。」', win: '巨龙被 strangler fig 了。', skill: 'burst', skillChance: 0.47 },
    { id: 'complianceemperor', name: '合规帝皇', icon: '📜', tier: 'legendary', intro: '「GDPR、等保、SOC2，请签字。」', win: '帝皇被豁免条款了。', skill: 'curse', skillChance: 0.44 },
    { id: 'outageherald', name: '宕机先驱', icon: '💥', tier: 'mythic', intro: '「全站503，P0已启动。」', win: '先驱被 failover 了。', skill: 'overload', skillChance: 0.52 },
    { id: 'talentwarlord', name: '人才战帅', icon: '🎯', tier: 'epic', intro: '「35岁优化，欢迎毕业。」', win: '战帅被劳动仲裁。', skill: 'bondBreak', skillChance: 0.4, skillValue: 5 },
    { id: 'innovationoracle', name: '创新神谕', icon: '💡', tier: 'legendary', intro: '「颠覆式创新，从汇报PPT开始。」', win: '神谕被 KPI 埋了。', skill: 'slow', skillChance: 0.42 }
];

const TSR_CONTENT2_RELIC_EXTRA = {
    circuitBreaker: { name: '熔断器', icon: '🔌', desc: '反击-10%，陷阱-12%', effect: 'counterReduce', value: 0.1, bonus: { effect: 'trapReduce', value: 0.12 } },
    loadBalancer: { name: '负载均衡珠', icon: '⚖️', desc: '生命+14%，行动耗时-6%', effect: 'health', value: 0.14, bonus: { effect: 'timeSave', value: 0.06 } },
    redisShard: { name: '缓存残片', icon: '💾', desc: '行动耗时-9%，每层+2秒', effect: 'timeSave', value: 0.09, bonus: { effect: 'floorTime', value: 2 } },
    kafkaFeather: { name: '消息羽', icon: '📨', desc: '事件+10%，秘境币+7%', effect: 'eventBonus', value: 0.1, bonus: { effect: 'currency', value: 0.07 } },
    k8sBadge: { name: 'K8s徽章', icon: '☸️', desc: '精英攻击+11%，精英币+10%', effect: 'eliteAttack', value: 0.11, bonus: { effect: 'eliteCurrency', value: 0.1 } },
    terraformRune: { name: 'Terraform符文', icon: '🏗️', desc: '每层+3秒，宝箱+25%', effect: 'floorTime', value: 3, bonus: { effect: 'treasureBonus', value: 0.25 } },
    datacenterCore: { name: '机房核心', icon: '🖥️', desc: '【数据中心领主专属】攻击+14%，币+10%', effect: 'attack', value: 0.14, bonus: { effect: 'currency', value: 0.1 }, exclusive: 'datacenterlord' },
    affixOverlordSeal: { name: '词条霸主印', icon: '🏷️', desc: '【词条霸主专属】词条赏金+18%，反击-10%', effect: 'affixReward', value: 0.18, bonus: { effect: 'affixCounterReduce', value: 0.1 }, exclusive: 'affixoverlord' },
    forgeGodHammer: { name: '锻神之锤', icon: '🔨', desc: '【锻星之神专属】攻击+16%，首领攻+14%', effect: 'attack', value: 0.16, bonus: { effect: 'bossAttack', value: 0.14 }, exclusive: 'equipforgegod' },
    voidEmperorShard: { name: '虚空帝皇碎片', icon: '👑', desc: '【虚空帝皇专属】充能+32%，虚空共鸣+20%', effect: 'spiritCharge', value: 0.32, bonus: { effect: 'resonanceGain', value: 0.2 }, exclusive: 'voidemperor' },
    chaosMonkey: { name: '混沌猴爪', icon: '🐒', desc: '赌局+12%，乱流+20%', effect: 'gamble', value: 0.12, bonus: { effect: 'stormBonus', value: 0.2 } },
    sreBell: { name: 'SRE铃铛', icon: '🔔', desc: '陷阱-15%，侦查+15%', effect: 'trapReduce', value: 0.15, bonus: { effect: 'detection', value: 0.15 } },
    agileCard: { name: '敏捷卡牌', icon: '🃏', desc: '行动耗时-7%，连击+5%', effect: 'timeSave', value: 0.07, bonus: { effect: 'comboBoost', value: 0.05 } },
    scrumStone: { name: 'Scrum石', icon: '🪨', desc: '精灵充能+24%，每层+2秒', effect: 'spiritCharge', value: 0.24, bonus: { effect: 'floorTime', value: 2 } },
    pipelineGear: { name: '流水线齿轮', icon: '⚙️', desc: '战斗奖励感知+，攻击+10%', effect: 'attack', value: 0.1, bonus: { effect: 'comboBoost', value: 0.04 } },
    apiGateway: { name: 'API网关徽', icon: '🚪', desc: '反击-8%，暴击+4%', effect: 'counterReduce', value: 0.08, bonus: { effect: 'critRate', value: 0.04 } },
    metricLens: { name: '指标透镜', icon: '📊', desc: '事件+9%，词条赏金+8%', effect: 'eventBonus', value: 0.09, bonus: { effect: 'affixReward', value: 0.08 } },
    shardKey: { name: '分片密钥', icon: '🗝️', desc: '首领攻击+13%，精英币+8%', effect: 'bossAttack', value: 0.13, bonus: { effect: 'eliteCurrency', value: 0.08 } },
    canaryFeather: { name: '金丝雀羽', icon: '🐤', desc: '生命+12%，回血感知+', effect: 'health', value: 0.12, bonus: { effect: 'restBonus', value: 0.15 } },
    blueGreenOrb: { name: '蓝绿宝珠', icon: '🔵', desc: '撤离结算+10%，行动-5%', effect: 'exitBonus', value: 0.1, bonus: { effect: 'timeSave', value: 0.05 } }
};

const TSR_CONTENT2_EQUIP_SETS_EXTRA = {
    cangqiong: { prefix: '星穹', name: '星穹套', icon: '🌌', desc2: '攻击+5%', desc4: '攻击+9%，暴伤+10%', bonus2: { attack: 0.05 }, bonus4: { attack: 0.09, critDamage: 0.1 } },
    lianyu: { prefix: '炼狱', name: '炼狱套', icon: '🔥', desc2: '穿透+3%', desc4: '攻击+8%，穿透+5%', bonus2: { pen: 0.03 }, bonus4: { attack: 0.08, pen: 0.05 } },
    lunhui: { prefix: '轮回', name: '轮回套', icon: '♾️', desc2: '吸血+3%', desc4: '攻血+6%，吸血+4%', bonus2: { lifeSteal: 0.03 }, bonus4: { attack: 0.06, health: 0.06, lifeSteal: 0.04 } },
    tianfa: { prefix: '天罚', name: '天罚套', icon: '⚡', desc2: '暴伤+6%', desc4: '暴击+5%，暴伤+14%', bonus2: { critDamage: 0.06 }, bonus4: { critRate: 0.05, critDamage: 0.14 } },
    guiyuan: { prefix: '归元', name: '归元套', icon: '🌀', desc2: '生命+6%', desc4: '生命+9%，再生+4%', bonus2: { health: 0.06 }, bonus4: { health: 0.09, regen: 0.04 } },
    pojie: { prefix: '破界', name: '破界套', icon: '💠', desc2: '穿透+4%', desc4: '攻击+10%，虚空+5%', bonus2: { pen: 0.04 }, bonus4: { attack: 0.1, voidPower: 0.05 } },
    cangqiongShen: { prefix: '苍穹', name: '苍穹神装', icon: '☁️', exclusive: true, dropHint: '击败多云霸主', desc2: '攻击+9%', desc4: '攻击+12%，暴击+5%', bonus2: { attack: 0.09 }, bonus4: { attack: 0.12, critRate: 0.05 } },
    yilaiShen: { prefix: '遗链', name: '遗链战装', icon: '🐲', exclusive: true, dropHint: '击败遗留系统巨龙', desc2: '生命+7%，反击-5%', desc4: '攻血+10%，反击-8%', bonus2: { health: 0.07, counterReduce: 0.05 }, bonus4: { attack: 0.1, health: 0.1, counterReduce: 0.08 } }
};

const TSR_CONTENT2_EQUIP_EXCLUSIVE_DROPS_EXTRA = {
    datacenterlord: { setId: 'cangqiong', chance: 0.14, tier: 'legendary' },
    affixoverlord: { setId: 'lianyu', chance: 0.13, tier: 'legendary' },
    equipforgegod: { setId: 'tianfa', chance: 0.12, tier: 'mythic' },
    voidemperor: { setId: 'guiyuan', chance: 0.11, tier: 'legendary' },
    cloudoverlord: { setId: 'cangqiongShen', chance: 0.16, tier: 'legendary' },
    legacydragon: { setId: 'yilaiShen', chance: 0.14, tier: 'legendary' }
};

const TSR_CONTENT2_STAR_FORTUNES_EXTRA = [
    { id: 'devopsStar', name: '运维星辉', icon: '⚙️', desc: '陷阱-12%，侦查+15%', theme: 'gold' },
    { id: 'cacheStar', name: '缓存吉星', icon: '💾', desc: '行动耗时-10%，每层+3秒', theme: 'gold' },
    { id: 'huntStar2', name: '猎杀星芒', icon: '🏹', desc: '精英币+18%，战斗奖励+12%', theme: 'boss' },
    { id: 'affixStar2', name: '词条星潮', icon: '🏷️', desc: '词条赏金+12%，词条率+12%', theme: 'affix' },
    { id: 'memeStar2', name: '梗运二重', icon: '🎭', desc: '梗房×1.4，事件+12%', theme: 'meme' },
    { id: 'voidStar2', name: '虚空再临', icon: '🕳️', desc: '虚空共鸣+25%，奖励+12%', theme: 'void' },
    { id: 'equipStar2', name: '锻星再临', icon: '⚒️', desc: '秘境币+12%，宝箱+18%', theme: 'gold' },
    { id: 'bondStar2', name: '羁绊再绽', icon: '💞', desc: '精灵充能+45%，灵击+15%', theme: 'spirit' },
    { id: 'doomStar2', name: '末日再蚀', icon: '⏰', desc: '攻击+10%，每层-2秒', theme: 'boss' },
    { id: 'prismStar2', name: '棱镜再折', icon: '🔶', desc: '事件+14%，特殊房+10%', theme: 'rainbow' }
];

const TSR_CONTENT2_STAR_FORTUNE_EFFECTS_EXTRA = {
    devopsStar: { trapRate: -0.12, timeSave: 0.05 },
    cacheStar: { timeSave: 0.1, floorTime: 3 },
    huntStar2: { battleReward: 0.12, currencyMod: 0.06 },
    affixStar2: { affixReward: 0.12, affixRollBoost: 0.12 },
    memeStar2: { memeMult: 1.4, eventBonus: 0.12 },
    voidStar2: { resonanceGain: 0.25, currencyMod: 0.12 },
    equipStar2: { currencyMod: 0.12, treasureBonus: 0.18 },
    bondStar2: { spiritMult: 1.45, spiritStrikeMult: 0.15 },
    doomStar2: { attack: 0.1, floorTime: -2 },
    prismStar2: { eventBonus: 0.14, specialRoomMult: 1.1 }
};

const TSR_CONTENT2_FATE_CARDS_EXTRA = {
    devopsFate: { id: 'devopsFate', name: '运维命', icon: '⚙️', desc: '陷阱-15%，行动-8%', trapRate: -0.15, timeSave: 0.08, theme: 'gold' },
    cacheFate: { id: 'cacheFate', name: '缓存命', icon: '💾', desc: '行动耗时-14%，奖励-6%', timeSave: 0.14, currencyPenalty: 0.06, theme: 'gold' },
    scaleFate: { id: 'scaleFate', name: '扩容命', icon: '📈', desc: '生命+18%，怪物+10%', health: 0.18, monsterMult: 0.1, theme: 'contract' },
    legacyFate: { id: 'legacyFate', name: '遗留命', icon: '🐲', desc: '攻击+12%，每层-2秒，币+10%', attack: 0.12, floorTime: -2, currencyMod: 0.1, theme: 'danger' },
    complianceFate: { id: 'complianceFate', name: '合规命', icon: '📜', desc: '反击-10%，探索+6%', counterPenalty: -0.1, timeCost: 0.06, theme: 'contract' },
    outageFate: { id: 'outageFate', name: '宕机命', icon: '💥', desc: '每层-3秒，战斗奖励+22%', floorTime: -3, battleReward: 0.22, theme: 'boss' },
    chaosFate: { id: 'chaosFate', name: '混沌命', icon: '🐒', desc: '赌局+18%，梗房×1.35', gamble: 0.18, memeMult: 1.35, theme: 'meme' },
    sreFate: { id: 'sreFate', name: 'SRE命', icon: '🔔', desc: '陷阱-12%，每层+4秒', trapRate: -0.12, floorTime: 4, theme: 'gold' },
    shardFate: { id: 'shardFate', name: '分片命', icon: '🔀', desc: '精英币+15%，生命-8%', eliteCurrencyBonus: 0.15, health: -0.08, theme: 'boss' },
    blueGreenFate: { id: 'blueGreenFate', name: '蓝绿命', icon: '🔵', desc: '回血+8%，撤离币+12%', spiritHealBonus: 0.08, currencyMod: 0.12, theme: 'heal' }
};

const TSR_CONTENT2_FLOOR_AFFIXES_EXTRA = {
    devopsStorm: { name: '运维风暴', icon: '⚙️', desc: '陷阱-15%，侦查+20%', trapRate: -0.15 },
    cacheHeat: { name: '缓存高热', icon: '💾', desc: '行动耗时-14%，每层+3秒', timeSave: 0.14, floorTime: 3 },
    scaleRush: { name: '扩容狂潮', icon: '📈', desc: '生命+12%，怪物+10%', health: 0.12, monsterMult: 0.1 },
    legacyFog: { name: '遗留迷雾', icon: '🐲', desc: '攻击+16%，反击+8%', attack: 0.16, counterPenalty: 0.08 },
    complianceSeal: { name: '合规封印', icon: '📜', desc: '反击-12%，币+8%', counterPenalty: -0.12, currencyMod: 0.08 },
    outageAlarm: { name: '宕机警报', icon: '💥', desc: '战斗奖励+18%，每层-3秒', battleReward: 0.18, floorTime: -3 },
    chaosMonkeyAffix: { name: '混沌猴', icon: '🐒', desc: '赌局+15%，梗房×1.5', gamble: 0.15, memeMult: 1.5 },
    pipelineGlow: { name: '流水线辉光', icon: '🔧', desc: '秘境币+14%，事件+10%', currencyMod: 0.14, eventBonus: 0.1 },
    shardTide: { name: '分片潮汐', icon: '🔀', desc: '精英币+12%，稀有怪+40%', eliteCurrencyBonus: 0.12, rareMonsterMult: 1.4 },
    metricStorm: { name: '指标风暴', icon: '📊', desc: '事件+16%，特殊房+12%', eventBonus: 0.16, specialRoomMult: 1.12 },
    blueGreenMist: { name: '蓝绿薄雾', icon: '🔵', desc: '回血+6%，每层+3秒', spiritHealBonus: 0.06, floorTime: 3 },
    canaryDawn: { name: '金丝雀黎明', icon: '🐤', desc: '生命+10%，陷阱-10%', health: 0.1, trapRate: -0.1 }
};

const TSR_CONTENT2_FLOOR_AFFIX_THEMES_EXTRA = {
    devopsStorm: 'gold', cacheHeat: 'gold', scaleRush: 'boss', legacyFog: 'danger',
    complianceSeal: 'contract', outageAlarm: 'boss', chaosMonkeyAffix: 'meme', pipelineGlow: 'gold',
    shardTide: 'boss', metricStorm: 'rainbow', blueGreenMist: 'heal', canaryDawn: 'spirit'
};

const TSR_CONTENT2_ACHIEVEMENTS_EXTRA = [
    { id: 'contentRoom100', name: '秘境探险家', desc: '累计遭遇100次特殊房间', icon: '🧭', need: { specialRooms: 100 } },
    { id: 'contentMeme60', name: '梗海征服者', desc: '累计遭遇60次恶趣味房间', icon: '🌊', need: { memeRooms: 60 } },
    { id: 'contentRelic55', name: '遗宝大师', desc: '图鉴解锁55种遗物', icon: '🏺', need: { relicCodex: 55 } },
    { id: 'contentAffix50', name: '词条猎人', desc: '累计击败50只带词条怪物', icon: '🏹', need: { affixKills: 50 } },
    { id: 'contentGeneric50', name: '奇遇大师', desc: '累计完成50次扩展奇遇房间', icon: '✨', need: { genericContentRooms: 50 } },
    { id: 'contentEquipSet12', name: '十二套收藏家', desc: '图鉴记录12种不同套装掉落', icon: '🧩', need: { equipSetTypes: 12 } },
    { id: 'contentMythic40', name: '神话终结者', desc: '累计击败40个神话级怪物', icon: '🌸', need: { mythicKills: 40 } },
    { id: 'datacenterRelic', name: '机房认可', desc: '获得机房核心遗物', icon: '🖥️' },
    { id: 'affixOverlordRelic', name: '霸主封印', desc: '获得词条霸主印遗物', icon: '🏷️' },
    { id: 'forgeGodRelic', name: '锻神契约', desc: '获得锻神之锤遗物', icon: '🔨' },
    { id: 'voidEmperorRelic', name: '帝皇碎片', desc: '获得虚空帝皇碎片遗物', icon: '👑' },
    { id: 'contentFate25', name: '命运主宰', desc: '使用命运卡通关累计25次', icon: '🎴', need: { fateCardClears: 25 } }
];

const TSR_CONTENT2_CONSUMABLES_EXTRA = {
    circuitToken: { name: '熔断令牌', icon: '🔌', effect: 'counterShield', value: 0.45, desc: '下3次反击伤害减至45%' },
    cacheFlush: { name: '缓存刷新剂', icon: '💾', effect: 'time', value: 40, desc: '增加40秒' },
    devopsCoffee: { name: '运维咖啡', icon: '☕', effect: 'coffee', value: 0.2, desc: '恢复20%生命并+30秒' },
    canaryRelease: { name: '金丝雀发布', icon: '🐤', effect: 'flash', value: 0.3, desc: '下一场战斗首回合伤害+30%' },
    blueGreenPill: { name: '蓝绿药丸', icon: '🔵', effect: 'heal', value: 0.35, desc: '恢复35%生命' },
    shardKey2: { name: '分片罗盘', icon: '🧭', effect: 'oracleDust', value: 2, desc: '预览未来2层' },
    pipelineBoost: { name: '流水线加速', icon: '⚙️', effect: 'rage', value: 0.32, desc: '攻击+32%持续3次行动' },
    chaosMonkeyToken: { name: '混沌猴牌', icon: '🐒', effect: 'chaos', value: 1, desc: '随机触发强力的混沌效果' },
    srePager: { name: 'SRE呼叫器', icon: '📟', effect: 'barrier', value: 1, desc: '抵消下一次陷阱' },
    metricDashboard: { name: '指标面板', icon: '📊', effect: 'affixScope', value: 1, desc: '下一场词条赏金+25%' },
    legacyMigration: { name: '遗留迁移卷', icon: '🐲', effect: 'dominionElixir', value: 1, desc: '攻击+25%×4，精灵充能+45' },
    outageRunbook: { name: '宕机手册', icon: '📕', effect: 'time', value: 50, desc: '增加50秒并预览1层' }
};

const TSR_CONTENT2_SHOP_EXTRA = {
    counterReduceStack: { name: '反击减免卷轴', description: '永久反击伤害-4%（限购8，与护甲合计上限-55%）', cost: 195000, type: 'permanent', effect: 'counter_reduce', maxPurchase: 8, purchased: 0, category: 'enhance', icon: '🛡️' },
    comboBonusStack: { name: '连击秘典', description: '永久连击收益+2%（限购5）', cost: 175000, type: 'permanent', effect: 'combo_bonus', maxPurchase: 5, purchased: 0, category: 'enhance', icon: '🌀' },
    gambleBonusStack: { name: '赌神秘典', description: '永久赌局胜率+5%（限购4）', cost: 185000, type: 'permanent', effect: 'gamble_bonus', maxPurchase: 4, purchased: 0, category: 'fortune', icon: '🎲' },
    floorTimeStack: { name: '层时护符', description: '永久每层+3秒（限购4；与时砂合计上限+36秒）', cost: 265000, type: 'permanent', effect: 'floor_time', maxPurchase: 4, purchased: 0, category: 'enhance', icon: '⏳' },
    runCurrencyStack: { name: '局内聚财符', description: '永久局内币+5%（限购6）', cost: 210000, type: 'permanent', effect: 'run_currency', maxPurchase: 6, purchased: 0, category: 'enhance', icon: '🪙' },
    exploreSaveStack: { name: '疾行卷轴', description: '永久探索耗时-4%（限购4；合计上限-25%）', cost: 225000, type: 'permanent', effect: 'explore_time_save', maxPurchase: 4, purchased: 0, category: 'enhance', icon: '💨' },
    affixSwapPack: { name: '词条置换补给', description: '下次冒险开局携带词条置换符', cost: 320000, type: 'permanent', effect: 'affix_swap_supply', maxPurchase: 3, purchased: 0, category: 'codex', icon: '🔄' },
    championMedalPack: { name: '冠军奖章补给', description: '下次冒险开局携带冠军奖章', cost: 380000, type: 'permanent', effect: 'champion_medal_supply', maxPurchase: 2, purchased: 0, category: 'enhance', icon: '🏅' }
};

const TSR_CONTENT2_WEEKLY_MODIFIERS = [
    { id: 'equipWeek', name: '锻星周', icon: '⚒️', desc: '装备掉落感知+，秘境币+8%' },
    { id: 'memeWeek2', name: '梗潮周', icon: '🎭', desc: '梗房×1.5，事件+12%' },
    { id: 'voidWeek2', name: '虚空周', icon: '🕳️', desc: '虚空共鸣+30%，奖励+10%' },
    { id: 'omegaWeek', name: 'Ω序周', icon: '⚙️', desc: '攻击+10%，每层-1秒' },
    { id: 'doomWeek', name: '末日周', icon: '⏰', desc: '战斗奖励+15%，每层-2秒' },
    { id: 'prismWeek', name: '棱镜周', icon: '🔶', desc: '事件+15%，宝箱+20%' }
];

const TSR_CONTENT2_WEEKLY_MODIFIER_EFFECTS = {
    equipWeek: { currencyMod: 0.08, treasureBonus: 0.15 },
    memeWeek2: { memeMult: 1.5, eventBonus: 0.12 },
    voidWeek2: { resonanceGain: 0.3, currencyMod: 0.1 },
    omegaWeek: { attack: 0.1, floorTime: -1 },
    doomWeek: { battleReward: 0.15, floorTime: -2 },
    prismWeek: { eventBonus: 0.15, treasureBonus: 0.2 }
};

const TSR_CONTENT2_SPECIAL_ROOM_TYPES = [
    'devopstemple', 'cachevault', 'shardmaze', 'metricshrine', 'pipelineworks',
    'chaoslab', 'sreoutpost', 'bluegreengate', 'canarynest', 'legacyarchive',
    'compliancehall', 'scalabilitypeak'
];

const TSR_CONTENT2_MEME_ROOM_TYPES = [
    'incidentpostmortem', 'blamestorming', 'estimateshrine', 'mvpdebate',
    'standuproulette', 'slackemojiwar', 'zoomsilence', 'coffeedrought',
    'printerjam', 'passwordreset'
];

const TSR_CONTENT2_ROOM_META = {
    devopstemple: { name: '运维神殿', icon: '⚙️', color: '#64748b' },
    cachevault: { name: '缓存宝库', icon: '💾', color: '#0ea5e9' },
    shardmaze: { name: '分片迷宫', icon: '🔀', color: '#8b5cf6' },
    metricshrine: { name: '指标神龛', icon: '📊', color: '#22c55e' },
    pipelineworks: { name: '流水线工坊', icon: '🔧', color: '#f97316' },
    chaoslab: { name: '混沌实验室', icon: '🐒', color: '#ef4444' },
    sreoutpost: { name: 'SRE前哨', icon: '📟', color: '#06b6d4' },
    bluegreengate: { name: '蓝绿之门', icon: '🔵', color: '#3b82f6' },
    canarynest: { name: '金丝雀巢穴', icon: '🐤', color: '#eab308' },
    legacyarchive: { name: '遗留档案库', icon: '🐲', color: '#78716c' },
    compliancehall: { name: '合规大厅', icon: '📜', color: '#475569' },
    scalabilitypeak: { name: '扩容之巅', icon: '📈', color: '#dc2626' },
    incidentpostmortem: { name: '事故复盘室', icon: '📋', color: '#64748b' },
    blamestorming: { name: '甩锅风暴', icon: '🌪️', color: '#f97316' },
    estimateshrine: { name: '估点神龛', icon: '🔢', color: '#a855f7' },
    mvpdebate: { name: 'MVP辩论厅', icon: '💬', color: '#6366f1' },
    standuproulette: { name: '站会轮盘赌', icon: '🎡', color: '#ec4899' },
    slackemojiwar: { name: '表情战争', icon: '😀', color: '#0ea5e9' },
    zoomsilence: { name: '会议静音地狱', icon: '🔇', color: '#94a3b8' },
    coffeedrought: { name: '咖啡荒', icon: '☕', color: '#92400e' },
    printerjam: { name: '打印机卡纸', icon: '🖨️', color: '#57534e' },
    passwordreset: { name: '密码重置深渊', icon: '🔑', color: '#dc2626' }
};

const TSR_CONTENT2_ROOM_DEFS = {
    devopstemple: {
        title: '⚙️ 运维神殿', intro: '香炉里烧的是 on-call 值班表。',
        options: [
            { id: 'pray', label: '祈福 · 陷阱-感知', btn: 'tsr-btn-safe', reward: { time: 22, trapWardRun: true, timeCost: 16, log: '+22秒，下一场陷阱伤害减半感知', theme: 'gold' } },
            { id: 'sacrifice', label: '献祭在线时长 · 攻击+16%×3层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.16, duration: 3 }, timeCost: 20, log: '攻击+16%×3层', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 75, log: '+75币' } }
        ]
    },
    cachevault: {
        title: '💾 缓存宝库', intro: 'TTL 即将过期，但宝藏不会。',
        options: [
            { id: 'hit', label: '缓存命中 · +110币', btn: 'tsr-btn-gold', reward: { currency: 110, timeCost: 14, log: '+110币', theme: 'gold' } },
            { id: 'miss', label: '缓存击穿 · 50%双倍或-15秒', btn: 'tsr-btn-risk', reward: { gambleTime: true, log: '缓存击穿赌局！', theme: 'fortune' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 10, log: '+10秒' } }
        ]
    },
    shardmaze: {
        title: '🔀 分片迷宫', intro: '每条路都通向不同的数据片。',
        options: [
            { id: 'route', label: '寻路 · 预览2层', btn: 'tsr-btn-gold', reward: { oraclePreview: 2, timeCost: 18, log: '预览未来2层', theme: 'legend' } },
            { id: 'fight', label: '遭遇分片守卫 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', log: '分片守卫现身！', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { voidResonance: 6, log: '虚空共鸣+6' } }
        ]
    },
    metricshrine: {
        title: '📊 指标神龛', intro: '「SLA 99.99%，心理安慰 100%。」',
        options: [
            { id: 'dashboard', label: '查看大盘 · 事件+12%×本局', btn: 'tsr-btn-gold', reward: { eventBonusRun: 0.12, timeCost: 15, log: '事件收益+12%（本局）', theme: 'rainbow' } },
            { id: 'alert', label: '消警 · +28秒', btn: 'tsr-btn-safe', reward: { time: 28, heal: 0.1, timeCost: 18, log: '+28秒，回血10%', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 65, log: '+65币' } }
        ]
    },
    pipelineworks: {
        title: '🔧 流水线工坊', intro: '构建绿灯，但你的心率没有。',
        options: [
            { id: 'green', label: '绿灯通过 · +90币+15秒', btn: 'tsr-btn-gold', reward: { currency: 90, time: 15, timeCost: 16, log: '流水线绿灯！', theme: 'gold' } },
            { id: 'red', label: '红灯修复 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', battleRewardNext: 0.3, log: '修复遭遇精英！下战奖励+30%', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { consumable: 'chaosDice', log: '获得混沌骰子' } }
        ]
    },
    chaoslab: {
        title: '🐒 混沌实验室', intro: '「在生产做实验，刺激吗？」',
        options: [
            { id: 'unleash', label: '释放混沌猴 · 混沌效果', btn: 'tsr-btn-risk', reward: { consumable: 'chaosMonkeyToken', log: '获得混沌猴牌！', theme: 'meme' } },
            { id: 'contain', label: '收容 · +35秒', btn: 'tsr-btn-safe', reward: { time: 35, timeCost: 22, log: '+35秒', theme: 'gold' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 55, log: '+55币' } }
        ]
    },
    sreoutpost: {
        title: '📟 SRE前哨', intro: 'PagerDuty 在响，但你已经麻木了。',
        options: [
            { id: 'ack', label: '确认告警 · 抵消下陷阱', btn: 'tsr-btn-safe', reward: { consumable: 'barrierCharm', timeCost: 14, log: '获得避陷符咒', theme: 'gold' } },
            { id: 'page', label: '升级告警 · 50% +120币', btn: 'tsr-btn-gold', reward: { gambleCoin: true, log: '升级赌局！', theme: 'fortune' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 12, log: '+12秒' } }
        ]
    },
    bluegreengate: {
        title: '🔵 蓝绿之门', intro: '两扇门，一扇通往稳定，一扇通往未知。',
        options: [
            { id: 'blue', label: '蓝门 · 回血20%+20秒', btn: 'tsr-btn-safe', reward: { heal: 0.2, time: 20, timeCost: 16, log: '蓝门稳定！', theme: 'heal' } },
            { id: 'green', label: '绿门 · 攻击+20%×2层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.2, duration: 2 }, timeCost: 18, log: '绿门激进！', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 70, log: '+70币' } }
        ]
    },
    canarynest: {
        title: '🐤 金丝雀巢穴', intro: '小鸟在歌唱，也可能在报警。',
        options: [
            { id: 'release', label: '金丝雀发布 · 下战首回合+30%', btn: 'tsr-btn-gold', reward: { consumable: 'canaryRelease', log: '获得金丝雀发布！', theme: 'boss' } },
            { id: 'rollback', label: '回滚 · +30秒', btn: 'tsr-btn-safe', reward: { time: 30, timeCost: 20, log: '+30秒', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { spiritCharge: 30, log: '精灵充能+30', theme: 'spirit' } }
        ]
    },
    legacyarchive: {
        title: '🐲 遗留档案库', intro: '「写于2008，文档丢失，但代码还在。」',
        options: [
            { id: 'read', label: '研读源码 · 词条赏金+15%', btn: 'tsr-btn-gold', reward: { affixRewardRun: 0.15, timeCost: 20, log: '词条赏金+15%（本局）', theme: 'affix' } },
            { id: 'refactor', label: '重构 · -20秒，攻击+18%×4层', btn: 'tsr-btn-risk', reward: { time: -20, buff: { effect: 'attack', value: 0.18, duration: 4 }, log: '重构完成！', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 85, log: '+85币' } }
        ]
    },
    compliancehall: {
        title: '📜 合规大厅', intro: '请阅读并同意 47 页用户协议。',
        options: [
            { id: 'sign', label: '签字 · 反击-12%×本局', btn: 'tsr-btn-safe', reward: { counterShieldRun: 0.12, timeCost: 22, log: '合规签字，反击减免+12%（本局）', theme: 'contract' } },
            { id: 'audit', label: '审计 · +100币', btn: 'tsr-btn-purple', reward: { currency: 100, time: -8, log: '+100币，-8秒', theme: 'gold' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 8, log: '+8秒' } }
        ]
    },
    scalabilitypeak: {
        title: '📈 扩容之巅', intro: '山顶风很大，QPS 更高。',
        options: [
            { id: 'scale', label: '水平扩容 · 每层+3秒×本局', btn: 'tsr-btn-gold', reward: { floorTimeRun: 3, timeCost: 18, log: '每层额外+3秒（本局）', theme: 'gold' } },
            { id: 'stress', label: '压测 · 精英战', btn: 'tsr-btn-risk', reward: { battle: 'elite', currencyBonus: 1.4, log: '压测精英战！赏金×1.4', theme: 'boss' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { voidResonance: 8, log: '虚空共鸣+8' } }
        ]
    },
    incidentpostmortem: {
        title: '📋 事故复盘室', intro: '「这次事故的根本原因是什么？」',
        options: [
            { id: 'blameless', label: '无责复盘 · +90币', btn: 'tsr-btn-gold', reward: { currency: 90, eventBonusRun: 0.08, timeCost: 18, log: '无责复盘，+90币', theme: 'meme' } },
            { id: 'blame', label: '甩锅 · 50%±25秒', btn: 'tsr-btn-risk', reward: { gambleTime: true, log: '甩锅赌局！', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 6, log: '+6秒' } }
        ]
    },
    blamestorming: {
        title: '🌪️ 甩锅风暴', intro: '风暴眼中，没有人是无辜的。',
        options: [
            { id: 'dodge', label: '闪避甩锅 · +70币', btn: 'tsr-btn-purple', reward: { currency: 70, memeBonus: 0.35, timeCost: 12, log: '下次梗房+35%', theme: 'meme' } },
            { id: 'accept', label: '接锅 · -15秒，攻击+15%×3层', btn: 'tsr-btn-risk', reward: { time: -15, buff: { effect: 'attack', value: 0.15, duration: 3 }, log: '背锅但变强了！', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 45, log: '+45币' } }
        ]
    },
    estimateshrine: {
        title: '🔢 估点神龛', intro: '「这个故事点多少？随便估一个。」',
        options: [
            { id: 'fib', label: '斐波那契 · 50%双倍币', btn: 'tsr-btn-gold', reward: { gambleCoin: true, log: '估点赌局！', theme: 'meme' } },
            { id: 'tshirt', label: 'T恤尺码 · +60币', btn: 'tsr-btn-safe', reward: { currency: 60, timeCost: 10, log: '+60币', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 7, log: '+7秒' } }
        ]
    },
    mvpdebate: {
        title: '💬 MVP辩论厅', intro: '「最小可行产品，最大可行争论。」',
        options: [
            { id: 'ship', label: '先上线 · 攻击+14%×2层', btn: 'tsr-btn-gold', reward: { buff: { effect: 'attack', value: 0.14, duration: 2 }, timeCost: 14, log: '先上线！', theme: 'boss' } },
            { id: 'polish', label: '再打磨 · +25秒', btn: 'tsr-btn-safe', reward: { time: 25, timeCost: 16, log: '+25秒', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 50, log: '+50币' } }
        ]
    },
    standuproulette: {
        title: '🎡 站会轮盘赌', intro: '「今天轮到你说——或者抽到加班。」',
        options: [
            { id: 'spin', label: '转轮盘 · 随机奖励', btn: 'tsr-btn-gold', reward: { randomLoot: true, log: '轮盘转动……', theme: 'meme' } },
            { id: 'skip', label: '请假 · +18秒', btn: 'tsr-btn-safe', reward: { time: 18, timeCost: 12, log: '+18秒', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 40, log: '+40币' } }
        ]
    },
    slackemojiwar: {
        title: '😀 表情战争', intro: '👍👀🔥💀 刷屏中……',
        options: [
            { id: 'react', label: '疯狂回应 · +80币', btn: 'tsr-btn-gold', reward: { currency: 80, timeCost: 14, log: '+80币', theme: 'meme' } },
            { id: 'mute', label: '全员静音 · +20秒', btn: 'tsr-btn-safe', reward: { time: 20, timeCost: 10, log: '+20秒', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { memeBonus: 0.25, log: '下次梗房+25%', theme: 'meme' } }
        ]
    },
    zoomsilence: {
        title: '🔇 会议静音地狱', intro: '「你能听到我吗？—— 你能听到我吗？」',
        options: [
            { id: 'unmute', label: '强行开麦 · 50%梗房加成', btn: 'tsr-btn-risk', reward: { memeGamble: true, log: '开麦赌局！', theme: 'meme' } },
            { id: 'leave_meeting', label: '退会 · +22秒', btn: 'tsr-btn-safe', reward: { time: 22, timeCost: 8, log: '+22秒', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 55, log: '+55币' } }
        ]
    },
    coffeedrought: {
        title: '☕ 咖啡荒', intro: '咖啡机坏了，整个团队陷入低功耗模式。',
        options: [
            { id: 'espresso', label: '手冲续命 · 咖啡效果', btn: 'tsr-btn-gold', reward: { consumable: 'devopsCoffee', log: '获得运维咖啡', theme: 'heal' } },
            { id: 'nap', label: '午睡 · +30秒', btn: 'tsr-btn-safe', reward: { time: 30, timeCost: 20, log: '+30秒', theme: 'heal' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 48, log: '+48币' } }
        ]
    },
    printerjam: {
        title: '🖨️ 打印机卡纸', intro: '「请清除卡纸并重试——第17次。」',
        options: [
            { id: 'fix', label: '捅纸 · -12秒+100币', btn: 'tsr-btn-gold', reward: { time: -12, currency: 100, log: '捅出来了！', theme: 'meme' } },
            { id: 'it', label: '叫IT · +15秒', btn: 'tsr-btn-safe', reward: { time: 15, timeCost: 18, log: 'IT来了，+15秒', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { currency: 35, log: '+35币' } }
        ]
    },
    passwordreset: {
        title: '🔑 密码重置深渊', intro: '「新密码不能与旧密码相同。」',
        options: [
            { id: 'reset', label: '重置 · 50%成功+40秒', btn: 'tsr-btn-gold', reward: { gambleTime: true, log: '重置赌局！', theme: 'meme' } },
            { id: 'reuse', label: '复用旧密码 · +65币', btn: 'tsr-btn-purple', reward: { currency: 65, time: -5, log: '+65币，-5秒', theme: 'meme' } },
            { id: 'leave', label: '离开', btn: 'tsr-btn-ghost', reward: { time: 8, log: '+8秒' } }
        ]
    }
};

function checkTsrContentAchievements2(runContext) {
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
    if ((ls.specialRooms || 0) >= 100) unlock('contentRoom100');
    if ((ls.memeRooms || 0) >= 60) unlock('contentMeme60');
    if (Object.keys(tsr.codex?.relics || {}).length >= 55) unlock('contentRelic55');
    if ((ls.affixKills || 0) >= 50) unlock('contentAffix50');
    if ((ls.genericContentRooms || 0) >= 50) unlock('contentGeneric50');
    if (Object.keys(tsr.codex?.equipmentSets || {}).length >= 12) unlock('contentEquipSet12');
    if ((ls.mythicKills || 0) >= 40) unlock('contentMythic40');
    if ((ls.fateCardClears || 0) >= 25) unlock('contentFate25');
    if ((tsr.currentRun?.relics || []).includes('datacenterCore') || tsr.codex?.relics?.datacenterCore) unlock('datacenterRelic');
    if ((tsr.currentRun?.relics || []).includes('affixOverlordSeal') || tsr.codex?.relics?.affixOverlordSeal) unlock('affixOverlordRelic');
    if ((tsr.currentRun?.relics || []).includes('forgeGodHammer') || tsr.codex?.relics?.forgeGodHammer) unlock('forgeGodRelic');
    if ((tsr.currentRun?.relics || []).includes('voidEmperorShard') || tsr.codex?.relics?.voidEmperorShard) unlock('voidEmperorRelic');
}

function initTsrContentExtensions2() {
    if (typeof TSR_MONSTER_POOL !== 'undefined') {
        TSR_MONSTER_POOL.battle.push(...TSR_CONTENT2_MONSTER_BATTLE);
        TSR_MONSTER_POOL.elite.push(...TSR_CONTENT2_MONSTER_ELITE);
        TSR_MONSTER_POOL.boss.push(...TSR_CONTENT2_MONSTER_BOSS);
    }
    if (typeof TSR_RELIC_POOL !== 'undefined') Object.assign(TSR_RELIC_POOL, TSR_CONTENT2_RELIC_EXTRA);
    if (typeof TSR_EQUIP_SETS !== 'undefined') Object.assign(TSR_EQUIP_SETS, TSR_CONTENT2_EQUIP_SETS_EXTRA);
    if (typeof TSR_EQUIP_EXCLUSIVE_DROPS !== 'undefined') Object.assign(TSR_EQUIP_EXCLUSIVE_DROPS, TSR_CONTENT2_EQUIP_EXCLUSIVE_DROPS_EXTRA);
    if (typeof TSR_EQUIP_EXCLUSIVE_NAMES !== 'undefined') {
        Object.assign(TSR_EQUIP_EXCLUSIVE_NAMES, {
            cangqiongShen: {
                weapon: { name: '苍穹裂云刃', icon: '⚔️' },
                armor: { name: '苍穹圣铠', icon: '🛡️' },
                ring: { name: '苍穹统御戒', icon: '💍' },
                chronos: { name: '苍穹时冕', icon: '⏱️' }
            },
            yilaiShen: {
                weapon: { name: '遗链断界刃', icon: '⚔️' },
                armor: { name: '遗链古铠', icon: '🛡️' },
                ring: { name: '遗链誓约戒', icon: '💍' },
                chronos: { name: '遗链时轮', icon: '⏱️' }
            }
        });
    }
    if (typeof TSR_EQUIP_PREFIXES !== 'undefined') {
        Object.values(TSR_CONTENT2_EQUIP_SETS_EXTRA).forEach(s => {
            if (s.prefix && !TSR_EQUIP_PREFIXES.includes(s.prefix)) TSR_EQUIP_PREFIXES.push(s.prefix);
        });
    }
    if (typeof TSR_STAR_FORTUNES !== 'undefined') TSR_STAR_FORTUNES.push(...TSR_CONTENT2_STAR_FORTUNES_EXTRA);
    if (typeof TSR_STAR_FORTUNE_EFFECTS !== 'undefined') Object.assign(TSR_STAR_FORTUNE_EFFECTS, TSR_CONTENT2_STAR_FORTUNE_EFFECTS_EXTRA);
    if (typeof TSR_FATE_CARDS !== 'undefined') Object.assign(TSR_FATE_CARDS, TSR_CONTENT2_FATE_CARDS_EXTRA);
    if (typeof TSR_FLOOR_AFFIXES !== 'undefined') Object.assign(TSR_FLOOR_AFFIXES, TSR_CONTENT2_FLOOR_AFFIXES_EXTRA);
    if (typeof TSR_FLOOR_AFFIX_THEMES !== 'undefined') Object.assign(TSR_FLOOR_AFFIX_THEMES, TSR_CONTENT2_FLOOR_AFFIX_THEMES_EXTRA);
    if (typeof TSR_ACHIEVEMENTS !== 'undefined') TSR_ACHIEVEMENTS.push(...TSR_CONTENT2_ACHIEVEMENTS_EXTRA);
    if (typeof TSR_RUN_CONSUMABLES !== 'undefined') Object.assign(TSR_RUN_CONSUMABLES, TSR_CONTENT2_CONSUMABLES_EXTRA);
    if (typeof TSR_WEEKLY_MODIFIERS !== 'undefined') TSR_WEEKLY_MODIFIERS.push(...TSR_CONTENT2_WEEKLY_MODIFIERS);
    if (typeof TSR_WEEKLY_MODIFIER_EFFECTS !== 'undefined') Object.assign(TSR_WEEKLY_MODIFIER_EFFECTS, TSR_CONTENT2_WEEKLY_MODIFIER_EFFECTS);

    if (typeof TSR_CONTENT_ROOM_DEFS !== 'undefined') Object.assign(TSR_CONTENT_ROOM_DEFS, TSR_CONTENT2_ROOM_DEFS);
    if (typeof TSR_CONTENT_ROOM_META !== 'undefined') Object.assign(TSR_CONTENT_ROOM_META, TSR_CONTENT2_ROOM_META);
    if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined') TSR_SPECIAL_ROOM_TYPES.push(...TSR_CONTENT2_SPECIAL_ROOM_TYPES);
    if (typeof TSR_MEME_ROOM_TYPES !== 'undefined') TSR_MEME_ROOM_TYPES.push(...TSR_CONTENT2_MEME_ROOM_TYPES);

    if (typeof TSR_CODEX_ROOMS !== 'undefined') {
        [...TSR_CONTENT2_SPECIAL_ROOM_TYPES, ...TSR_CONTENT2_MEME_ROOM_TYPES].forEach(key => {
            const meta = TSR_CONTENT2_ROOM_META[key];
            if (meta && !TSR_CODEX_ROOMS.find(r => r.key === key)) {
                TSR_CODEX_ROOMS.push({ key, name: meta.name, icon: meta.icon });
            }
        });
    }

    if (typeof getDefaultTsrShopItems === 'function') {
        const _prevShop = getDefaultTsrShopItems;
        if (!_prevShop.__tsrContent2Patched) {
            getDefaultTsrShopItems = function () {
                return { ..._prevShop(), ...TSR_CONTENT2_SHOP_EXTRA };
            };
            getDefaultTsrShopItems.__tsrContent2Patched = true;
            getDefaultTsrShopItems.__tsrContentPatched = _prevShop.__tsrContentPatched;
        }
    }

    if (typeof checkTsrContentAchievements === 'function' && !checkTsrContentAchievements.__tsrContent2Patched) {
        const _prevAch = checkTsrContentAchievements;
        checkTsrContentAchievements = function (ctx) {
            _prevAch(ctx);
            checkTsrContentAchievements2(ctx);
        };
        checkTsrContentAchievements.__tsrContent2Patched = true;
    } else if (typeof checkTsrAchievements === 'function' && !checkTsrAchievements.__tsrContent2Patched) {
        const _prevAch = checkTsrAchievements;
        checkTsrAchievements = function (ctx) {
            _prevAch(ctx);
            checkTsrContentAchievements2(ctx);
        };
        checkTsrAchievements.__tsrContent2Patched = true;
    }
}

initTsrContentExtensions2();

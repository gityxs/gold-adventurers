/**
 * 家族传承 · 人生模拟 / 武道 / 十八代 / 世界地图三维
 * 在 lineage-ext.js 之后加载：升级数值、事件消耗×10、沉浸式人生玩法
 */
(function () {
    'use strict';
    var DAY_MS = 24 * 60 * 60 * 1000;
    var HOUR_MS = 60 * 60 * 1000;

    function cfg() { return window.lineageExtConfig; }
    function funds() { return player.investmentGame.userData; }
    function fmt(n) { return typeof formatSci === 'function' ? formatSci(n) : String(n); }
    function adults() {
        return (player.children.children || []).filter(function (m) {
            return typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : m.isAdult;
        });
    }

    // ——— 升级配置：数值对齐扩展时代；轶事消耗相对原扩展再×10 ———
    function upgradeLineageConfig() {
        if (!window.lineageExtConfig) return;
        var c = window.lineageExtConfig;

        // 强制锁定祖宗十八代（防止其它脚本降级）
        if (typeof childConfig !== 'undefined' && childConfig.lineage) {
            childConfig.lineage.maxGeneration = 18;
            childConfig.lineage.maxTotalMembers = 180;
            childConfig.lineage.maxPerParent = 3;
        }

        c.awakenCost = 50000000;
        c.awakenChance = 0.35;
        c.eventCooldown = 3 * HOUR_MS;
        c.maxEquippedHeirlooms = 4;

        c.talents = c.talents || [];
        var extraTalents = [
            { id: 'zhanShen', name: '战神', rarity: '传说', color: '#FF4500', w: 2, desc: '世界地图攻击+800%（觉醒×1.5）', worldAtk: 8 },
            { id: 'tiegu', name: '铁骨', rarity: '史诗', color: '#A335EE', w: 6, desc: '世界地图生命+800%（觉醒×1.5）', worldHp: 8 },
            { id: 'pojun', name: '破军', rarity: '史诗', color: '#A335EE', w: 6, desc: '世界地图爆伤+800%（觉醒×1.5）', worldCritDmg: 8 },
            { id: 'shibadai', name: '十八脉', rarity: '传说', color: '#FFD700', w: 1, desc: '地图三维各+500%，代际贡献×1.3', worldAtk: 5, worldHp: 5, worldCritDmg: 5, contribMult: 1.3 }
        ];
        extraTalents.forEach(function (t) {
            if (!c.talents.some(function (x) { return x.id === t.id; })) c.talents.push(t);
        });

        c.businesses = [
            { id: 'inn', name: '家族客栈', cost: 30000000, incomePerHour: 800000, needAttr: 'charm', desc: '魅力越高收入越高' },
            { id: 'shop', name: '商号钱庄', cost: 50000000, incomePerHour: 1200000, needAttr: 'business', desc: '商业越高收入越高' },
            { id: 'academy', name: '私塾书院', cost: 45000000, incomePerHour: 1000000, needAttr: 'intelligence', desc: '智力越高收入越高' },
            { id: 'dojo', name: '武馆镖局', cost: 40000000, incomePerHour: 900000, needAttr: 'physique', desc: '体质越高收入越高' },
            { id: 'farm', name: '庄园田产', cost: 25000000, incomePerHour: 600000, needAttr: 'physique', desc: '稳健的基础产业' },
            { id: 'trade', name: '远洋商队', cost: 120000000, incomePerHour: 2800000, needAttr: 'business', desc: '高风险高收益' },
            { id: 'armory', name: '兵甲作坊', cost: 200000000, incomePerHour: 4000000, needAttr: 'physique', desc: '供养家将，地图战力相关' },
            { id: 'ancestryHallBiz', name: '族学书院', cost: 300000000, incomePerHour: 5000000, needAttr: 'intelligence', desc: '专修族谱与十八代学统' }
        ];
        c.ancestral = {
            upgradeCosts: [0, 20000000, 80000000, 250000000, 800000000, 2000000000, 8000000000, 30000000000],
            offerCost: 5000000, offerCooldown: 4 * HOUR_MS, buffDuration: 2 * HOUR_MS, buffPerLevel: 0.03
        };
        c.dailyQuests = [
            { id: 'train3', name: '勤学苦练', desc: '培养任意成员 3 次', need: 3, key: 'train', rewardPrestige: 20, rewardFunds: 3000000, rewardExp: 15 },
            { id: 'work2', name: '家业兴旺', desc: '收取打工收入 2 次', need: 2, key: 'collect', rewardPrestige: 15, rewardFunds: 5000000, rewardExp: 10 },
            { id: 'interact2', name: '天伦之乐', desc: '亲子互动 2 次', need: 2, key: 'interact', rewardPrestige: 15, rewardFunds: 2000000, rewardExp: 12 },
            { id: 'offer1', name: '慎终追远', desc: '宗祠祭祖 1 次', need: 1, key: 'offer', rewardPrestige: 25, rewardFunds: 4000000, rewardExp: 20 },
            { id: 'exam1', name: '金榜题名', desc: '完成科举/比试 1 次', need: 1, key: 'exam', rewardPrestige: 30, rewardFunds: 8000000, rewardExp: 25 },
            { id: 'life1', name: '烟火人间', desc: '完成人生起居 2 次', need: 2, key: 'life', rewardPrestige: 20, rewardFunds: 6000000, rewardExp: 18 },
            { id: 'festival1', name: '岁时节令', desc: '举办或参与节庆 1 次', need: 1, key: 'festival', rewardPrestige: 30, rewardFunds: 10000000, rewardExp: 25 }
        ];

        // 轶事：原扩展价×10，并新增人生向事件
        c.events = [
            { id: 'prodigy', title: '神童异象', text: '雨夜，幼童趴在窗台数星，忽然说「那颗星像咱们家祠堂的灯」。你怎么想？',
              choices: [
                { label: '重金延请名师', cost: 200000000, effect: 'boostRandomAttr', amount: 5, prestige: 10, worldAtk: 2 },
                { label: '只是孩子话，随他去', cost: 0, effect: 'smallBoost', amount: 1, prestige: 2 },
                { label: '办一桌家宴，把故事说给全族听', cost: 80000000, effect: 'happiness', amount: 15, prestige: 8, worldHp: 2 }
              ]},
            { id: 'dispute', title: '分家争执', text: '两位成年子嗣为了一处铺面红了脸，茶都泼在了青石板上。',
              choices: [
                { label: '把账本摊开，公平调停', cost: 50000000, effect: 'prestige', amount: 15 },
                { label: '干脆各立分号，各闯各的', cost: 300000000, effect: 'unlockBranch', prestige: 25, worldAtk: 3 },
                { label: '关上门训一顿，明日照常干活', cost: 0, effect: 'trainDiscount', amount: 0.1, prestige: 5 }
              ]},
            { id: 'merchant', title: '西域商贾', text: '驼铃停在巷口。商人说愿与你们联姻通商，眼里却先看向了你的钱袋。',
              choices: [
                { label: '答应联姻通商', cost: 150000000, effect: 'tradeBuff', prestige: 20, worldAtk: 4 },
                { label: '只做买卖，不谈儿女', cost: 100000000, effect: 'funds', amount: 250000000, prestige: 8 },
                { label: '婉拒，送一壶茶打发', cost: 0, effect: 'none', prestige: 0 }
              ]},
            { id: 'illness', title: '族中染恙', text: '厢房里传来压抑的咳嗽。有人一夜没睡好，天亮却还想撑着去干活。',
              choices: [
                { label: '连夜寻访名医', cost: 120000000, effect: 'healBoost', amount: 3, prestige: 12, worldHp: 5 },
                { label: '让他歇着，熬碗姜汤', cost: 30000000, effect: 'smallBoost', amount: 1, prestige: 3, worldHp: 1 },
                { label: '去祠堂求个心安', cost: 20000000, effect: 'offerReady', prestige: 5 }
              ]},
            { id: 'heirloom_find', title: '古物出土', text: '整修老宅刨出一方木匣，匣里东西凉得像刚从井里捞上来。',
              choices: [
                { label: '收入传家宝库', cost: 0, effect: 'gainHeirloom', prestige: 18 },
                { label: '找人鉴宝卖掉', cost: 0, effect: 'funds', amount: 500000000, prestige: 5 },
                { label: '供奉宗祠', cost: 0, effect: 'ancestralExp', amount: 1, prestige: 22, worldCritDmg: 2 }
              ]},
            { id: 'rival', title: '世家较劲', text: '邻城望族送来一张帖子：比才学，比排场，也比谁家子弟更「像样」。',
              choices: [
                { label: '应战科举', cost: 50000000, effect: 'freeExam', prestige: 10 },
                { label: '送礼和解，息事宁人', cost: 200000000, effect: 'prestige', amount: 5 },
                { label: '暗中加练，不声张', cost: 100000000, effect: 'boostTop', amount: 4, prestige: 15, worldCritDmg: 3 }
              ]},
            { id: 'genomen', title: '十八代异兆', text: '族谱自己翻到空白页，墨迹慢慢洇出「十八代」三字，像有人在呼吸。',
              choices: [
                { label: '大祭祖宗十八代', cost: 500000000, effect: 'eighteenRitualReady', prestige: 40, worldAtk: 5, worldHp: 5, worldCritDmg: 5 },
                { label: '延请史官修谱', cost: 300000000, effect: 'chronicleBoost', prestige: 28 },
                { label: '闭门研读一夜', cost: 50000000, effect: 'smallBoost', amount: 3, prestige: 10 }
              ]},
            { id: 'bloodstorm', title: '血脉风暴', text: '数代子孙同夜做梦，梦见同一位远祖站在雾里，朝你们点头。',
              choices: [
                { label: '开启血脉共鸣', cost: 800000000, effect: 'resonanceBoost', prestige: 50, worldAtk: 8, worldHp: 8, worldCritDmg: 6 },
                { label: '立新牌位', cost: 400000000, effect: 'freeTablet', prestige: 35 },
                { label: '当作梦话，置之不理', cost: 0, effect: 'none', prestige: 0 }
              ]},
            { id: 'warscroll', title: '先人兵书', text: '旧厢房尘土里一卷兵书，边角被虫蛀，却还能闻见陈年的汗味。',
              choices: [
                { label: '献入武道堂', cost: 200000000, effect: 'martialBoost', prestige: 30, worldAtk: 6 },
                { label: '拍卖换钱', cost: 0, effect: 'funds', amount: 1000000000, prestige: 8 },
                { label: '交予战魂研习', cost: 150000000, effect: 'boostTop', amount: 8, prestige: 22, worldCritDmg: 4 }
              ]},
            { id: 'rainnight', title: '雨夜归人', text: '雨很大。有人敲祠堂侧门：是远房表亲，也像是逃难来的。怀里抱着个睡着的孩子。',
              choices: [
                { label: '开门收留，给干衣热粥', cost: 80000000, effect: 'happiness', amount: 20, prestige: 18, worldHp: 4 },
                { label: '给盘缠，送他们去客栈', cost: 40000000, effect: 'prestige', amount: 8, worldHp: 1 },
                { label: '怕惹事，隔门婉拒', cost: 0, effect: 'none', prestige: 0 }
              ]},
            { id: 'marketday', title: '集日风波', text: '集市上有人诬你们短斤少两。围观的人越来越多，孩子躲在你身后。',
              choices: [
                { label: '当众复秤，把话说清楚', cost: 20000000, effect: 'prestige', amount: 12, worldAtk: 2 },
                { label: '赔笑补钱，息事宁人', cost: 60000000, effect: 'happiness', amount: 8, prestige: 5 },
                { label: '把对峙的人请进茶棚细谈', cost: 35000000, effect: 'tradeBuff', prestige: 10, worldAtk: 3 }
              ]},
            { id: 'firstlove', title: '墙头一枝', text: '有子弟夜里翻墙去听戏，回来衣襟上沾着桂花香。你在廊下撞见他。',
              choices: [
                { label: '问清心意，成全一段正经姻缘', cost: 100000000, effect: 'happiness', amount: 25, prestige: 15, worldHp: 3 },
                { label: '罚抄家训，天亮照旧功课', cost: 0, effect: 'trainDiscount', amount: 0.08, prestige: 6 },
                { label: '装作没看见，把灯吹灭', cost: 0, effect: 'smallBoost', amount: 1, prestige: 1 }
              ]},
            { id: 'flood', title: '秋汛漫院', text: '河水涨过石阶。族田泡了，祠堂门槛也湿了。有人哭，有人骂天。',
              choices: [
                { label: '出钱修堤、赈族中老弱', cost: 250000000, effect: 'healBoost', amount: 4, prestige: 28, worldHp: 8 },
                { label: '先保宗祠牌位，再顾田地', cost: 120000000, effect: 'ancestralExp', amount: 1, prestige: 16, worldCritDmg: 3 },
                { label: '组织青壮自家扛沙包', cost: 50000000, effect: 'boostTop', amount: 3, prestige: 12, worldAtk: 4 }
              ]}
        ];

        c.heirlooms = [
            { id: 'jade', name: '传世玉佩', gps: 0.05, click: 0, life: 0, atk: 0, worldAtk: 0, worldHp: 0, worldCritDmg: 0, desc: 'GPS +5%' },
            { id: 'sword', name: '祖传宝剑', gps: 0, click: 0.05, life: 0, atk: 0.08, worldAtk: 6, worldHp: 0, worldCritDmg: 0, desc: '点击+5%，地图攻+600%' },
            { id: 'scroll', name: '家训卷轴', gps: 0.03, click: 0.03, life: 0.03, atk: 0.03, worldAtk: 2, worldHp: 2, worldCritDmg: 2, desc: '全加成+3%，地图三维各+200%' },
            { id: 'seal', name: '家族印信', gps: 0, click: 0, life: 0, atk: 0, prestigeGain: 0.2, desc: '声望获取+20%' },
            { id: 'lamp', name: '长明祠灯', gps: 0, click: 0, life: 0.1, atk: 0, worldHp: 5, desc: '地图生命+500%' },
            { id: 'abacus', name: '金算盘', gps: 0.08, click: 0, life: 0, atk: 0.05, worldAtk: 4, desc: 'GPS+8%，地图攻+400%' },
            { id: 'wardrum', name: '破阵战鼓', gps: 0, click: 0, life: 0, atk: 0.05, worldAtk: 12, worldCritDmg: 6, desc: '地图攻+1200%，爆伤+600%' },
            { id: 'xuanjia', name: '玄铁家甲', gps: 0, click: 0, life: 0.06, atk: 0, worldHp: 14, desc: '地图生命+1400%' },
            { id: 'xueren', name: '饮血家刃', gps: 0, click: 0.04, life: 0, atk: 0.04, worldCritDmg: 15, worldAtk: 5, desc: '地图爆伤+1500%' },
            { id: 'genealogy', name: '十八代族谱', gps: 0.05, click: 0.05, life: 0.05, atk: 0.05, worldAtk: 8, worldHp: 8, worldCritDmg: 8, desc: '地图三维各+800%' },
            { id: 'tabletJade', name: '玉质牌位', gps: 0, click: 0, life: 0.08, atk: 0, worldHp: 10, worldCritDmg: 5, desc: '地图血+1000%，爆伤+500%' }
        ];

        c.martialHall = {
            maxLevel: 50,
            costs: { atk: 80000, hp: 80000, crit: 100000 },
            costGrowth: 10,
            perLevel: { atk: 1.5, hp: 1.5, crit: 1.2 },
            prestigePerLevel: 3
        };
        c.warSpirit = {
            slots: 5,
            atkPerBusiness: 0.2, hpPerCharm: 0.2, critPerPhysique: 0.15,
            genBonus: { 1: 1, 2: 1.15, 3: 1.3, 4: 1.5, 5: 1.7, 6: 1.95, 7: 2.2, 8: 2.5, 9: 2.85, 10: 3.25, 11: 3.7, 12: 4.2, 13: 4.8, 14: 5.5, 15: 6.3, 16: 7.2, 17: 8.2, 18: 9.5 }
        };
        c.houseGuards = [
            { id: 'spear', name: '长枪家将', cost: 20000000, atk: 4, hp: 2, crit: 1, desc: '地图攻+400%/级' },
            { id: 'shield', name: '盾卫家将', cost: 20000000, atk: 1, hp: 6, crit: 1, desc: '地图血+600%/级' },
            { id: 'archer', name: '弓弩家将', cost: 25000000, atk: 3, hp: 1, crit: 5, desc: '地图爆伤+500%/级' },
            { id: 'cavalry', name: '铁骑家将', cost: 50000000, atk: 6, hp: 4, crit: 3, desc: '三维均衡' },
            { id: 'vanguard', name: '先锋统领', cost: 120000000, atk: 10, hp: 8, crit: 6, desc: '强力三维' },
            { id: 'ancestorGuard', name: '守陵禁军', cost: 500000000, atk: 15, hp: 15, crit: 12, desc: '十八代专属' }
        ];
        c.drill = { cost: 15000000, cooldown: 3 * HOUR_MS, duration: 90 * 60 * 1000, atk: 12, hp: 12, crit: 10 };
        c.militaryRanks = [
            { need: 0, name: '白身', atk: 0, hp: 0, crit: 0 },
            { need: 20, name: '伍长', atk: 3, hp: 3, crit: 2 },
            { need: 60, name: '什长', atk: 6, hp: 6, crit: 4 },
            { need: 150, name: '百夫长', atk: 10, hp: 10, crit: 7 },
            { need: 350, name: '千夫长', atk: 15, hp: 15, crit: 10 },
            { need: 700, name: '偏将军', atk: 22, hp: 22, crit: 15 },
            { need: 1400, name: '大将军', atk: 30, hp: 30, crit: 22 },
            { need: 3000, name: '镇国公', atk: 50, hp: 50, crit: 40 },
            { need: 6000, name: '十八代武宗', atk: 80, hp: 80, crit: 65 }
        ];
        c.eighteen = {
            tabletBaseCost: 5000000, tabletCostGrowth: 10, tabletBonus: { atk: 2, hp: 2, crit: 1.5 },
            chronicleCost: 20000000, chronicleGrowth: 10, chronicleBonusPer: { atk: 1.5, hp: 1.5, crit: 1.2 },
            ritualCost: 100000000, ritualCooldown: 8 * HOUR_MS, ritualDuration: 3 * HOUR_MS,
            ritualBuff: { atk: 25, hp: 25, crit: 20 },
            resonancePerGen: { atk: 1.2, hp: 1.2, crit: 1.0 },
            blessings: [
                { gen: 1, name: '开宗', atk: 1, hp: 1, crit: 0.5 },
                { gen: 3, name: '三世积德', atk: 2, hp: 2, crit: 1.5 },
                { gen: 5, name: '来孙护族', atk: 4, hp: 4, crit: 3 },
                { gen: 9, name: '耳孙听命', atk: 8, hp: 8, crit: 6 },
                { gen: 12, name: '胎孙承天', atk: 12, hp: 12, crit: 10 },
                { gen: 15, name: '昆孙镇世', atk: 18, hp: 18, crit: 15 },
                { gen: 18, name: '终世不灭', atk: 40, hp: 40, crit: 35 }
            ]
        };
        c.examTypes = [
            { id: 'wen', name: '文科举', attr: 'intelligence', cost: 8000000, cd: 6 * HOUR_MS, rewardBase: 10000000, prestige: 25 },
            { id: 'wu', name: '武比试', attr: 'physique', cost: 8000000, cd: 6 * HOUR_MS, rewardBase: 9000000, prestige: 25, military: 8 },
            { id: 'yi', name: '艺会', attr: 'charm', cost: 6000000, cd: 6 * HOUR_MS, rewardBase: 7000000, prestige: 20 },
            { id: 'shang', name: '商赛', attr: 'business', cost: 10000000, cd: 8 * HOUR_MS, rewardBase: 15000000, prestige: 30 }
        ];
        c.expeditions = [
            { id: 'hunt', name: '山林试炼', duration: 2 * HOUR_MS, cost: 5000000, needAdult: 1, rewardMin: 8000000, rewardMax: 20000000, attrGain: 2, prestige: 15, military: 5 },
            { id: 'caravan', name: '商路护卫', duration: 4 * HOUR_MS, cost: 12000000, needAdult: 2, rewardMin: 20000000, rewardMax: 50000000, attrGain: 3, prestige: 28, military: 10 },
            { id: 'ruin', name: '古迹探秘', duration: 6 * HOUR_MS, cost: 25000000, needAdult: 2, rewardMin: 30000000, rewardMax: 90000000, attrGain: 4, prestige: 40, heirloomChance: 0.12, military: 14 },
            { id: 'frontier', name: '边关建功', duration: 8 * HOUR_MS, cost: 40000000, needAdult: 3, rewardMin: 50000000, rewardMax: 150000000, attrGain: 5, prestige: 60, heirloomChance: 0.18, military: 25 },
            { id: 'ancestralQuest', name: '寻祖之旅', duration: 10 * HOUR_MS, cost: 100000000, needAdult: 4, rewardMin: 120000000, rewardMax: 400000000, attrGain: 8, prestige: 100, heirloomChance: 0.25, military: 40 }
        ];
        c.marriageTiers = [
            { id: 'common', name: '寻常联姻', costMult: 1, inheritBonus: 0, prestige: 5 },
            { id: 'gentry', name: '士绅联姻', costMult: 5, inheritBonus: 0.05, prestige: 15, needPrestige: 30 },
            { id: 'merchant', name: '商贾联姻', costMult: 20, inheritBonus: 0.08, prestige: 25, needPrestige: 80 },
            { id: 'scholar', name: '书香联姻', costMult: 50, inheritBonus: 0.10, prestige: 35, needPrestige: 150 },
            { id: 'noble', name: '名门联姻', costMult: 120, inheritBonus: 0.15, prestige: 50, needPrestige: 300 },
            { id: 'marquis', name: '侯门联姻', costMult: 400, inheritBonus: 0.20, prestige: 80, needPrestige: 600 },
            { id: 'royal', name: '贵胄联姻', costMult: 1200, inheritBonus: 0.28, prestige: 120, needPrestige: 1200 },
            { id: 'duke', name: '王侯联姻', costMult: 4000, inheritBonus: 0.35, prestige: 180, needPrestige: 2500 },
            { id: 'immortal', name: '十八代联姻', costMult: 15000, inheritBonus: 0.45, prestige: 280, needPrestige: 5000 },
            { id: 'celestial', name: '天眷联姻', costMult: 50000, inheritBonus: 0.55, prestige: 450, needPrestige: 10000 },
            { id: 'eternal', name: '不朽联姻', costMult: 200000, inheritBonus: 0.70, prestige: 800, needPrestige: 20000 }
        ];

        // 人生模拟
        c.lifeSim = {
            activities: [
                { id: 'morning_read', name: '窗下晨读', cost: 8000000, cd: 2 * HOUR_MS, mood: 4, attr: 'intelligence', attrGain: 1, worldAtk: 0.4, worldHp: 0.2, worldCritDmg: 0.1,
                  lines: ['墨香混着早饭的粥气。{name}把一卷书读到天亮，嗓子有点哑，眼睛却亮。', '{name}念错一字，自己先笑了，又正色重读一遍。'] },
                { id: 'spar', name: '院中习武', cost: 10000000, cd: 2 * HOUR_MS, mood: 3, attr: 'physique', attrGain: 1, worldAtk: 0.6, worldHp: 0.3, worldCritDmg: 0.4,
                  lines: ['竹叶被脚步踩出沙沙声。{name}出拳时额角出了汗，停下来喝口水，又继续。', '有人路过廊下，只见{name}把木人桩打得嗡嗡响。'] },
                { id: 'market', name: '市井闲逛', cost: 12000000, cd: 2 * HOUR_MS, mood: 6, attr: 'charm', attrGain: 1, worldAtk: 0.2, worldHp: 0.5, worldCritDmg: 0.2,
                  lines: ['糖葫芦、锣鼓、讨价还价。{name}买了一截糖，分给跟来的小辈。', '{name}在人堆里听了半日闲话，回来跟你讲哪家铺子又换了招牌。'] },
                { id: 'kitchen', name: '下厨一顿', cost: 6000000, cd: 2 * HOUR_MS, mood: 8, attr: 'charm', attrGain: 1, worldAtk: 0.1, worldHp: 0.8, worldCritDmg: 0.1,
                  lines: ['油烟里有人喊「开饭了」。{name}把菜端上桌，故意把最好的夹到老人碗里。', '汤咸了。{name}红着脸加水，全桌却吃得更欢。'] },
                { id: 'night_talk', name: '廊下夜谈', cost: 5000000, cd: 2 * HOUR_MS, mood: 10, attr: 'intelligence', attrGain: 1, worldAtk: 0.2, worldHp: 0.6, worldCritDmg: 0.2,
                  lines: ['灯火把影子拉得很长。{name}忽然问起「咱们家从前是什么样的」。', '你和{name}聊到更鼓响，谁也没提明天的功课，只说今晚的风。'] },
                { id: 'ledger', name: '对账理铺', cost: 9000000, cd: 2 * HOUR_MS, mood: 2, attr: 'business', attrGain: 1, worldAtk: 0.7, worldHp: 0.2, worldCritDmg: 0.2,
                  lines: ['算盘噼啪。{name}发现一笔糊涂账，追到掌柜脸上，最后却只轻轻叹了口气。', '{name}把账本合上：「今年能余一点，够修屋顶了。」'] },
                { id: 'clinic', name: '探望邻里', cost: 7000000, cd: 2 * HOUR_MS, mood: 7, attr: 'charm', attrGain: 1, worldAtk: 0.2, worldHp: 0.9, worldCritDmg: 0.1,
                  lines: ['{name}提着点心去看生病的街坊，回来袖口沾着药味。', '邻家大娘拉着{name}的手说「你们家心善」，{name}不好意思地笑。'] },
                { id: 'opera', name: '听一出戏', cost: 15000000, cd: 2 * HOUR_MS, mood: 9, attr: 'charm', attrGain: 2, worldAtk: 0.3, worldHp: 0.4, worldCritDmg: 0.5,
                  lines: ['锣鼓点里，{name}跟着台下一起喊好，回来还在哼那句词。', '散场时灯笼晃，{name}说：原来故事里的人，也会怕，也会硬撑。'] }
            ],
            careers: [
                { id: 'official', name: '仕途', attr: 'intelligence', max: 20, per: { atk: 0.8, hp: 0.5, crit: 0.4 }, costBase: 20000000 },
                { id: 'merchant', name: '商道', attr: 'business', max: 20, per: { atk: 1.0, hp: 0.4, crit: 0.3 }, costBase: 25000000 },
                { id: 'warrior', name: '武道', attr: 'physique', max: 20, per: { atk: 0.9, hp: 0.7, crit: 0.8 }, costBase: 22000000 },
                { id: 'healer', name: '医馆', attr: 'intelligence', max: 20, per: { atk: 0.3, hp: 1.2, crit: 0.3 }, costBase: 18000000 },
                { id: 'artisan', name: '百工', attr: 'charm', max: 20, per: { atk: 0.5, hp: 0.6, crit: 0.5 }, costBase: 16000000 },
                { id: 'farmer', name: '农桑', attr: 'physique', max: 20, per: { atk: 0.4, hp: 1.0, crit: 0.2 }, costBase: 12000000 }
            ],
            estateRooms: [
                { id: 'hall', name: '正厅', max: 15, costBase: 30000000, growth: 10, atk: 1.2, hp: 0.8, crit: 0.5, desc: '待客议事，气势压人' },
                { id: 'study', name: '书房', max: 15, costBase: 25000000, growth: 10, atk: 0.8, hp: 0.6, crit: 0.4, desc: '灯下读书，心静则利' },
                { id: 'yard', name: '武场', max: 15, costBase: 28000000, growth: 10, atk: 1.0, hp: 0.7, crit: 1.0, desc: '脚步声与兵器声' },
                { id: 'clinic', name: '医庐', max: 15, costBase: 26000000, growth: 10, atk: 0.3, hp: 1.5, crit: 0.3, desc: '药柜与煎药的热气' },
                { id: 'garden', name: '花园', max: 15, costBase: 20000000, growth: 10, atk: 0.4, hp: 1.0, crit: 0.4, desc: '人在草木间，心会软一点' },
                { id: 'wing', name: '厢房', max: 15, costBase: 22000000, growth: 10, atk: 0.5, hp: 0.9, crit: 0.3, desc: '烟火气最浓的地方' }
            ],
            festivals: [
                { id: 'spring', name: '开春祭灶', cost: 5000000000000, cd: 20 * HOUR_MS, atk: 1.33, hp: 2, crit: 1, duration: 6 * HOUR_MS,
                  text: '灶膛里火旺。全族围着吃一碗热面，有人悄悄抹泪，说又过一年平平当当的一年。' },
                { id: 'lantern', name: '元宵灯会', cost: 8000000000000, cd: 24 * HOUR_MS, atk: 1.67, hp: 1.67, crit: 1.67, duration: 8 * HOUR_MS,
                  text: '巷子里灯笼像一条河。孩子踩着你的影子跑，有人在桥上放河灯。' },
                { id: 'midautumn', name: '中秋团圆', cost: 7000000000000, cd: 24 * HOUR_MS, atk: 1, hp: 2.67, crit: 1.33, duration: 8 * HOUR_MS,
                  text: '月饼切开，每人一块。有人在外未归，桌上仍给他留了空位。' },
                { id: 'winter', name: '冬至饺子', cost: 4000000000000, cd: 18 * HOUR_MS, atk: 1.33, hp: 2.33, crit: 1, duration: 6 * HOUR_MS,
                  text: '面粉沾了一袖子。包得丑的那只，大家偏要抢着吃。' },
                { id: 'newyear', name: '除夕守岁', cost: 12000000000000, cd: 48 * HOUR_MS, atk: 2.67, hp: 2.67, crit: 2.67, duration: 12 * HOUR_MS,
                  text: '鞭炮远处响。你们关门闭户，把这一年的话慢慢说完，再把灯拨亮一点。' }
            ],
            personas: [
                { id: 'steady', name: '稳重', moodBonus: 1, worldHp: 0.3 },
                { id: 'fierce', name: '烈性', moodBonus: -1, worldAtk: 0.4, worldCritDmg: 0.2 },
                { id: 'gentle', name: '温软', moodBonus: 2, worldHp: 0.5 },
                { id: 'cunning', name: '玲珑', moodBonus: 0, worldAtk: 0.3 },
                { id: 'bookish', name: '书呆', moodBonus: 0, worldAtk: 0.2, worldHp: 0.2 },
                { id: 'cheerful', name: '爽朗', moodBonus: 3, worldHp: 0.2, worldCritDmg: 0.2 }
            ],
            maxDiary: 40,
            activityMoodCap: 100,
            moodActCd: 2 * HOUR_MS,
            precepts: [
                { id: 'honesty', name: '诚以待人', atk: 1.5, hp: 1.0, crit: 0.5, desc: '不欺不瞒，行得正' },
                { id: 'diligence', name: '勤俭持家', atk: 1.0, hp: 1.5, crit: 0.5, desc: '一粥一饭当思来处' },
                { id: 'courage', name: '见义勇为', atk: 2.0, hp: 0.8, crit: 1.2, desc: '有担当，敢出手' },
                { id: 'study', name: '诗书传家', atk: 0.8, hp: 1.2, crit: 0.8, desc: '案头有灯，心中有谱' },
                { id: 'unity', name: '齐心合力', atk: 1.2, hp: 1.8, crit: 0.6, desc: '一家人，一股绳' },
                { id: 'martial', name: '习武强身', atk: 1.8, hp: 1.0, crit: 1.5, desc: '拳脚利落，心气也壮' }
            ],
            preceptCostBase: 80000000,
            feastTiers: [
                { id: 'plain', name: '家常团圆宴', cost: 3000000000000, atk: 1, hp: 1.33, crit: 0.67, duration: 4 * HOUR_MS, mood: 8 },
                { id: 'guest', name: '宾客满堂宴', cost: 10000000000000, atk: 2, hp: 2, crit: 1.67, duration: 6 * HOUR_MS, mood: 12 },
                { id: 'grand', name: '开枝散叶盛宴', cost: 40000000000000, atk: 4, hp: 4, crit: 3.33, duration: 10 * HOUR_MS, mood: 20 },
                { id: 'immortal', name: '十八代大典宴', cost: 150000000000000, atk: 7.33, hp: 7.33, crit: 6, duration: 16 * HOUR_MS, mood: 30, needGen: 9 }
            ],
            trial: {
                maxFloor: 18,
                baseCost: 20000000,
                costGrowth: 10,
                cd: 2 * HOUR_MS,
                duration: 3 * HOUR_MS,
                perFloor: { atk: 1.2, hp: 1.2, crit: 1.0 },
                prestigePer: 8,
                militaryPer: 3
            }
        };
    }

    function ensureLifeData() {
        if (!player.children) return;
        var c = player.children;
        if (!c.martial) c.martial = { atkLv: 0, hpLv: 0, critLv: 0 };
        if (!Array.isArray(c.warSpirits)) c.warSpirits = [null, null, null, null, null];
        while (c.warSpirits.length < 5) c.warSpirits.push(null);
        if (!c.guards) c.guards = {};
        if (c.drillUntil == null) c.drillUntil = 0;
        if (c.drillLast == null) c.drillLast = 0;
        if (c.militaryMerit == null) c.militaryMerit = 0;
        if (!c.eighteen) c.eighteen = { tablets: {}, chronicleLevel: 0, ritualUntil: 0, ritualLast: 0, freeTablet: false, resonanceBonusUntil: 0 };
        if (!c.eighteen.tablets) c.eighteen.tablets = {};
        if (!c.life) {
            c.life = {
                diary: [],
                mood: 50,
                estate: {},
                careers: {},
                bonds: {},
                activityCd: {},
                festivalCd: {},
                festivalBuffUntil: 0,
                festivalBuff: { atk: 0, hp: 0, crit: 0 },
                tempWorld: { atk: 0, hp: 0, crit: 0, until: 0 },
                precepts: [],
                biographies: [],
                trialFloor: 0,
                trialCd: 0,
                feastCd: 0
            };
        }
        var life = c.life;
        if (!Array.isArray(life.diary)) life.diary = [];
        if (life.mood == null) life.mood = 50;
        if (!life.estate) life.estate = {};
        if (!life.careers) life.careers = {};
        if (!life.bonds) life.bonds = {};
        if (!life.activityCd) life.activityCd = {};
        if (!life.festivalCd) life.festivalCd = {};
        if (!life.tempWorld) life.tempWorld = { atk: 0, hp: 0, crit: 0, until: 0 };
        if (!Array.isArray(life.precepts)) life.precepts = [];
        if (!Array.isArray(life.biographies)) life.biographies = [];
        if (life.trialFloor == null) life.trialFloor = 0;
        if (life.trialCd == null) life.trialCd = 0;
        if (life.feastCd == null) life.feastCd = 0;
        if (life.moodActCdUntil == null) life.moodActCdUntil = 0;
        (c.children || []).forEach(function (m) {
            if (!m.personaId) {
                var list = (cfg().lifeSim && cfg().lifeSim.personas) || [];
                m.personaId = list.length ? list[Math.floor(Math.random() * list.length)].id : 'steady';
            }
            if (m.lifeMood == null) m.lifeMood = 50;
        });
    }

    function pushDiary(text) {
        ensureLifeData();
        var d = player.children.life.diary;
        d.unshift({ t: Date.now(), text: text });
        var max = (cfg().lifeSim && cfg().lifeSim.maxDiary) || 40;
        if (d.length > max) d.length = max;
    }

    function bumpLifeDaily(key) {
        if (typeof bumpDaily === 'function') {
            // reuse daily quest bump if key exists
        }
        ensureLifeData();
        if (!player.children.dailyQuest) return;
        var dq = player.children.dailyQuest;
        (cfg().dailyQuests || []).forEach(function (q) {
            if (q.key === key) dq.progress[q.id] = (dq.progress[q.id] || 0) + 1;
        });
    }

    function calcEstateWorld() {
        ensureLifeData();
        var rooms = (cfg().lifeSim && cfg().lifeSim.estateRooms) || [];
        var estate = player.children.life.estate;
        var atk = 0, hp = 0, crit = 0;
        rooms.forEach(function (r) {
            var lv = estate[r.id] || 0;
            atk += lv * r.atk;
            hp += lv * r.hp;
            crit += lv * r.crit;
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    function calcCareerWorld() {
        ensureLifeData();
        var careers = (cfg().lifeSim && cfg().lifeSim.careers) || [];
        var data = player.children.life.careers;
        var atk = 0, hp = 0, crit = 0;
        Object.keys(data).forEach(function (memberId) {
            var row = data[memberId];
            if (!row || !row.id) return;
            var def = careers.find(function (x) { return x.id === row.id; });
            if (!def) return;
            var lv = row.lv || 0;
            atk += lv * def.per.atk;
            hp += lv * def.per.hp;
            crit += lv * def.per.crit;
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    function calcPersonaWorld() {
        var personas = (cfg().lifeSim && cfg().lifeSim.personas) || [];
        var atk = 0, hp = 0, crit = 0;
        (player.children.children || []).forEach(function (m) {
            var p = personas.find(function (x) { return x.id === m.personaId; });
            if (!p) return;
            atk += p.worldAtk || 0;
            hp += p.worldHp || 0;
            crit += p.worldCritDmg || 0;
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    function calcBondWorld() {
        ensureLifeData();
        var bonds = player.children.life.bonds;
        var total = 0;
        Object.keys(bonds).forEach(function (k) { total += bonds[k] || 0; });
        var tier = Math.floor(total / 20);
        return { atk: tier * 0.6, hp: tier * 0.8, crit: tier * 0.5 };
    }

    function calcMoodWorld() {
        ensureLifeData();
        var mood = player.children.life.mood || 50;
        var bonus = Math.max(0, (mood - 50) / 50);
        return { atk: bonus * 3, hp: bonus * 4, crit: bonus * 2 };
    }

    function calcPreceptWorld() {
        ensureLifeData();
        var list = (cfg().lifeSim && cfg().lifeSim.precepts) || [];
        var owned = player.children.life.precepts || [];
        var atk = 0, hp = 0, crit = 0;
        owned.forEach(function (id) {
            var p = list.find(function (x) { return x.id === id; });
            if (!p) return;
            atk += p.atk || 0;
            hp += p.hp || 0;
            crit += p.crit || 0;
        });
        var bios = (player.children.life.biographies || []).length;
        atk += bios * 0.8;
        hp += bios * 0.8;
        crit += bios * 0.6;
        return { atk: atk, hp: hp, crit: crit };
    }

    function calcTrialWorld() {
        ensureLifeData();
        var t = cfg().lifeSim && cfg().lifeSim.trial;
        if (!t) return { atk: 0, hp: 0, crit: 0 };
        var floor = player.children.life.trialFloor || 0;
        var atk = floor * t.perFloor.atk;
        var hp = floor * t.perFloor.hp;
        var crit = floor * t.perFloor.crit;
        if (Date.now() < (player.children.life.trialBuffUntil || 0)) {
            atk += 4; hp += 4; crit += 3;
        }
        return { atk: atk, hp: hp, crit: crit };
    }

    function calcLifeTempWorld() {
        ensureLifeData();
        var life = player.children.life;
        var atk = 0, hp = 0, crit = 0;
        if (Date.now() < (life.festivalBuffUntil || 0) && life.festivalBuff) {
            atk += life.festivalBuff.atk || 0;
            hp += life.festivalBuff.hp || 0;
            crit += life.festivalBuff.crit || 0;
        }
        if (Date.now() < (life.tempWorld.until || 0)) {
            atk += life.tempWorld.atk || 0;
            hp += life.tempWorld.hp || 0;
            crit += life.tempWorld.crit || 0;
        }
        return { atk: atk, hp: hp, crit: crit };
    }

    function calcMartialWorld() {
        ensureLifeData();
        var mh = cfg().martialHall;
        if (!mh) return { atk: 0, hp: 0, crit: 0 };
        var m = player.children.martial;
        var atk = (m.atkLv || 0) * mh.perLevel.atk;
        var hp = (m.hpLv || 0) * mh.perLevel.hp;
        var crit = (m.critLv || 0) * mh.perLevel.crit;
        // war spirits
        var ws = cfg().warSpirit;
        (player.children.warSpirits || []).forEach(function (id) {
            if (!id) return;
            var mem = (player.children.children || []).find(function (x) { return x.id === id; });
            if (!mem || !mem.attributes) return;
            var g = (ws.genBonus && ws.genBonus[mem.generation || 1]) || 1;
            atk += (mem.attributes.business || 0) * ws.atkPerBusiness * g;
            hp += (mem.attributes.charm || 0) * ws.hpPerCharm * g;
            crit += (mem.attributes.physique || 0) * ws.critPerPhysique * g;
        });
        // guards
        (cfg().houseGuards || []).forEach(function (g) {
            var lv = (player.children.guards && player.children.guards[g.id]) || 0;
            atk += lv * g.atk;
            hp += lv * g.hp;
            crit += lv * g.crit;
        });
        // military
        var merit = player.children.militaryMerit || 0;
        var rank = { atk: 0, hp: 0, crit: 0 };
        (cfg().militaryRanks || []).forEach(function (r) {
            if (merit >= r.need) rank = r;
        });
        atk += rank.atk || 0;
        hp += rank.hp || 0;
        crit += rank.crit || 0;
        // drill
        if (Date.now() < (player.children.drillUntil || 0) && cfg().drill) {
            atk += cfg().drill.atk;
            hp += cfg().drill.hp;
            crit += cfg().drill.crit;
        }
        return { atk: atk, hp: hp, crit: crit };
    }

    function genLabelLife(g) {
        return typeof getGenerationLabel === 'function' ? getGenerationLabel(g) : ('第' + g + '代');
    }

    function calcEighteenWorldParts() {
        ensureLifeData();
        var eg = cfg().eighteen;
        var empty = { atk: 0, hp: 0, crit: 0 };
        if (!eg) return { total: empty, parts: {}, maxG: 0, tabletCount: 0 };
        var tablets = player.children.eighteen.tablets || {};
        var tabletCount = 0;
        var tAtk = 0, tHp = 0, tCrit = 0;
        Object.keys(tablets).forEach(function (g) {
            if (!tablets[g]) return;
            tabletCount++;
            tAtk += eg.tabletBonus.atk;
            tHp += eg.tabletBonus.hp;
            tCrit += eg.tabletBonus.crit;
        });
        var maxG = 0;
        (player.children.children || []).forEach(function (m) {
            maxG = Math.max(maxG, m.generation || 1);
        });
        var gAtk = maxG * eg.resonancePerGen.atk;
        var gHp = maxG * eg.resonancePerGen.hp;
        var gCrit = maxG * eg.resonancePerGen.crit;
        var tempAtk = 0, tempHp = 0, tempCrit = 0;
        if (Date.now() < (player.children.eighteen.resonanceBonusUntil || 0)) {
            tempAtk += 8; tempHp += 8; tempCrit += 6;
        }
        var clv = player.children.eighteen.chronicleLevel || 0;
        var cAtk = clv * eg.chronicleBonusPer.atk;
        var cHp = clv * eg.chronicleBonusPer.hp;
        var cCrit = clv * eg.chronicleBonusPer.crit;
        var bAtk = 0, bHp = 0, bCrit = 0;
        (eg.blessings || []).forEach(function (b) {
            if (maxG >= b.gen) {
                bAtk += b.atk; bHp += b.hp; bCrit += b.crit;
            }
        });
        var rAtk = 0, rHp = 0, rCrit = 0;
        if (Date.now() < (player.children.eighteen.ritualUntil || 0)) {
            rAtk += eg.ritualBuff.atk;
            rHp += eg.ritualBuff.hp;
            rCrit += eg.ritualBuff.crit;
        }
        var atk = tAtk + gAtk + tempAtk + cAtk + bAtk + rAtk;
        var hp = tHp + gHp + tempHp + cHp + bHp + rHp;
        var crit = tCrit + gCrit + tempCrit + cCrit + bCrit + rCrit;
        return {
            total: { atk: atk, hp: hp, crit: crit },
            maxG: maxG,
            tabletCount: tabletCount,
            chronicleLv: clv,
            parts: {
                tablets: { atk: tAtk, hp: tHp, crit: tCrit },
                generation: { atk: gAtk, hp: gHp, crit: gCrit },
                blessings: { atk: bAtk, hp: bHp, crit: bCrit },
                chronicle: { atk: cAtk, hp: cHp, crit: cCrit },
                ritual: { atk: rAtk, hp: rHp, crit: rCrit },
                resonanceTemp: { atk: tempAtk, hp: tempHp, crit: tempCrit }
            }
        };
    }

    function calcEighteenWorld() {
        return calcEighteenWorldParts().total;
    }

    function cdHintMs(untilOrLeft, isAbsolute) {
        var left = isAbsolute ? Math.max(0, (untilOrLeft || 0) - Date.now()) : Math.max(0, untilOrLeft || 0);
        if (left <= 0) return '';
        return Math.floor(left / 3600000) + '时' + Math.ceil((left % 3600000) / 60000) + '分';
    }

    window.calcEighteenWorldParts = calcEighteenWorldParts;

    window.getLifeSimWorldBonus = function () {
        upgradeLineageConfig();
        ensureLifeData();
        var parts = [calcEstateWorld(), calcCareerWorld(), calcPersonaWorld(), calcBondWorld(), calcMoodWorld(), calcLifeTempWorld(), calcMartialWorld(), calcEighteenWorld(), calcPreceptWorld(), calcTrialWorld()];
        var atk = 0, hp = 0, crit = 0;
        parts.forEach(function (p) {
            atk += p.atk || 0;
            hp += p.hp || 0;
            crit += p.crit || 0;
        });
        return { worldAtk: atk, worldHp: hp, worldCritDmg: crit };
    };

    // 包装加成：把人生/武道/十八代叠进世界地图三维
    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        upgradeLineageConfig();
        ensureLifeData();
        var base = _origBonus ? _origBonus() : { global: 1, gps: 1, click: 1, life: 1, atk: 1, contrib: 1, worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var estate = calcEstateWorld();
        var career = calcCareerWorld();
        var persona = calcPersonaWorld();
        var bond = calcBondWorld();
        var mood = calcMoodWorld();
        var temp = calcLifeTempWorld();
        var martial = calcMartialWorld();
        var eighteen = calcEighteenWorld();
        var precept = calcPreceptWorld();
        var trial = calcTrialWorld();

        // 命格 / 传家宝世界三维
        var talentW = { atk: 0, hp: 0, crit: 0 };
        (player.children.children || []).forEach(function (m) {
            var t = (cfg().talents || []).find(function (x) { return x.id === m.talentId; });
            if (!t) return;
            var awake = m.talentAwakened ? 1.5 : 1;
            talentW.atk += (t.worldAtk || 0) * awake;
            talentW.hp += (t.worldHp || 0) * awake;
            talentW.crit += (t.worldCritDmg || 0) * awake;
        });
        var heirW = { atk: 0, hp: 0, crit: 0 };
        (player.children.equippedHeirlooms || []).forEach(function (id) {
            var h = (cfg().heirlooms || []).find(function (x) { return x.id === id; });
            if (!h) return;
            heirW.atk += h.worldAtk || 0;
            heirW.hp += h.worldHp || 0;
            heirW.crit += h.worldCritDmg || 0;
        });

        base.worldAtk = martial.atk + eighteen.atk + estate.atk + career.atk + persona.atk + bond.atk + mood.atk + temp.atk + precept.atk + trial.atk + talentW.atk + heirW.atk;
        base.worldHp = martial.hp + eighteen.hp + estate.hp + career.hp + persona.hp + bond.hp + mood.hp + temp.hp + precept.hp + trial.hp + talentW.hp + heirW.hp;
        base.worldCritDmg = martial.crit + eighteen.crit + estate.crit + career.crit + persona.crit + bond.crit + mood.crit + temp.crit + precept.crit + trial.crit + talentW.crit + heirW.crit;

        var moodV = (player.children.life.mood || 50);
        if (moodV >= 70) base.global = (base.global || 1) + 0.03;
        if (moodV >= 90) base.global = (base.global || 1) + 0.02;
        return base;
    };

    // ——— 人生起居 ———
    window.doLifeActivity = function (activityId, memberIndex) {
        upgradeLineageConfig();
        ensureLifeData();
        var act = (cfg().lifeSim.activities || []).find(function (a) { return a.id === activityId; });
        var members = player.children.children || [];
        var member = members[memberIndex];
        if (!act || !member) {
            logAction('请选择成员与起居事项', 'error');
            return;
        }
        var moodCdLeft = (player.children.life.moodActCdUntil || 0) - Date.now();
        if (moodCdLeft > 0) {
            logAction('心情起居冷却中，约 ' + Math.ceil(moodCdLeft / 60000) + ' 分钟后再来（全族共享 2 小时）', 'info');
            return;
        }
        var cdKey = act.id + ':' + (member.id || memberIndex);
        var left = (player.children.life.activityCd[cdKey] || 0) - Date.now();
        if (left > 0) {
            logAction('「' + act.name + '」冷却中，约 ' + Math.ceil(left / 60000) + ' 分钟', 'info');
            return;
        }
        if (funds().availableFunds < act.cost) {
            logAction('资金不足，需要 ' + fmt(act.cost), 'error');
            return;
        }
        funds().availableFunds -= act.cost;
        var moodCd = (cfg().lifeSim && cfg().lifeSim.moodActCd) || (2 * HOUR_MS);
        player.children.life.activityCd[cdKey] = Date.now() + (act.cd || moodCd);
        player.children.life.moodActCdUntil = Date.now() + moodCd;
        var line = act.lines[Math.floor(Math.random() * act.lines.length)].replace(/\{name\}/g, member.name);
        var persona = (cfg().lifeSim.personas || []).find(function (p) { return p.id === member.personaId; });
        var moodGain = act.mood + ((persona && persona.moodBonus) || 0);
        player.children.life.mood = Math.max(0, Math.min(100, (player.children.life.mood || 50) + moodGain));
        member.lifeMood = Math.max(0, Math.min(100, (member.lifeMood || 50) + moodGain));
        if (act.attr && member.attributes) {
            member.attributes[act.attr] = (member.attributes[act.attr] || 0) + (act.attrGain || 1);
        }
        // 临时世界地图 buff（可叠加衰减窗口）
        var tw = player.children.life.tempWorld;
        if (Date.now() > (tw.until || 0)) {
            tw.atk = 0; tw.hp = 0; tw.crit = 0;
        }
        tw.atk += act.worldAtk || 0;
        tw.hp += act.worldHp || 0;
        tw.crit += act.worldCritDmg || 0;
        tw.until = Date.now() + 4 * HOUR_MS;
        pushDiary(line);
        bumpLifeDaily('life');
        logAction(line + '（心情起居冷却 2 小时）', 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    };

    window.upgradeEstateRoom = function (roomId) {
        upgradeLineageConfig();
        ensureLifeData();
        var room = (cfg().lifeSim.estateRooms || []).find(function (r) { return r.id === roomId; });
        if (!room) return;
        var lv = player.children.life.estate[roomId] || 0;
        if (lv >= room.max) {
            logAction(room.name + ' 已满级', 'info');
            return;
        }
        var cost = room.costBase * Math.pow(room.growth || 10, lv);
        if (funds().availableFunds < cost) {
            logAction('资金不足，需要 ' + fmt(cost), 'error');
            return;
        }
        funds().availableFunds -= cost;
        player.children.life.estate[roomId] = lv + 1;
        pushDiary('宅邸的「' + room.name + '」又修整了一回。匠人收拾工具离开时，屋里还留着锯末香。');
        logAction(room.name + ' 升至 ' + (lv + 1) + ' 级（地图攻/血/爆伤永久提升）', 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    };

    window.assignLifeCareer = function (memberIndex, careerId) {
        upgradeLineageConfig();
        ensureLifeData();
        var member = (player.children.children || [])[memberIndex];
        var career = (cfg().lifeSim.careers || []).find(function (c) { return c.id === careerId; });
        if (!member || !career) return;
        if (!(typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(member) : member.isAdult)) {
            logAction('只有成年成员能定志向', 'error');
            return;
        }
        player.children.life.careers[member.id] = player.children.life.careers[member.id] || { id: careerId, lv: 0 };
        player.children.life.careers[member.id].id = careerId;
        pushDiary(member.name + ' 在灯下说定了志向：走「' + career.name + '」这条路。你没多话，只给他添了盏灯油。');
        logAction(member.name + ' 志向定为【' + career.name + '】', 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.trainLifeCareer = function (memberIndex) {
        upgradeLineageConfig();
        ensureLifeData();
        var member = (player.children.children || [])[memberIndex];
        if (!member) return;
        var row = player.children.life.careers[member.id];
        if (!row) {
            logAction('请先为该成员选定志向', 'error');
            return;
        }
        var career = (cfg().lifeSim.careers || []).find(function (c) { return c.id === row.id; });
        if (!career) return;
        if ((row.lv || 0) >= career.max) {
            logAction(member.name + ' 的「' + career.name + '」已至圆满', 'info');
            return;
        }
        var cost = career.costBase * Math.pow(10, row.lv || 0);
        if (funds().availableFunds < cost) {
            logAction('资金不足，需要 ' + fmt(cost), 'error');
            return;
        }
        funds().availableFunds -= cost;
        row.lv = (row.lv || 0) + 1;
        if (member.attributes && career.attr) {
            member.attributes[career.attr] = (member.attributes[career.attr] || 0) + 2;
        }
        pushDiary(member.name + ' 在「' + career.name + '」上又熬过一程。路上有人笑他傻，他只低头赶路。');
        logAction(member.name + ' 「' + career.name + '」升至 ' + row.lv + ' 级', 'success');
        bumpLifeDaily('life');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    };

    window.deepenFamilyBond = function (aIndex, bIndex) {
        upgradeLineageConfig();
        ensureLifeData();
        var list = player.children.children || [];
        var a = list[aIndex], b = list[bIndex];
        if (!a || !b || a.id === b.id) {
            logAction('请选择两位不同成员增进情感', 'error');
            return;
        }
        var cost = 15000000;
        if (funds().availableFunds < cost) {
            logAction('资金不足，需要 ' + fmt(cost), 'error');
            return;
        }
        funds().availableFunds -= cost;
        var key = [a.id, b.id].sort().join('|');
        player.children.life.bonds[key] = (player.children.life.bonds[key] || 0) + 1;
        player.children.life.mood = Math.min(100, (player.children.life.mood || 50) + 3);
        pushDiary(a.name + ' 与 ' + b.name + ' 坐了很久。谁也没赢过谁一句嘴，临走却互相给对方掖了掖衣领。');
        logAction(a.name + ' 与 ' + b.name + ' 情感加深（羁绊 ' + player.children.life.bonds[key] + '）', 'success');
        bumpLifeDaily('life');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.holdFamilyFestival = function (festId) {
        upgradeLineageConfig();
        ensureLifeData();
        var fest = (cfg().lifeSim.festivals || []).find(function (f) { return f.id === festId; });
        if (!fest) return;
        var left = (player.children.life.festivalCd[festId] || 0) - Date.now();
        if (left > 0) {
            logAction(fest.name + ' 冷却中', 'info');
            return;
        }
        if (funds().availableFunds < fest.cost) {
            logAction('资金不足，需要 ' + fmt(fest.cost), 'error');
            return;
        }
        funds().availableFunds -= fest.cost;
        player.children.life.festivalCd[festId] = Date.now() + fest.cd;
        player.children.life.festivalBuff = { atk: fest.atk, hp: fest.hp, crit: fest.crit };
        player.children.life.festivalBuffUntil = Date.now() + fest.duration;
        player.children.life.mood = Math.min(100, (player.children.life.mood || 50) + 12);
        pushDiary(fest.text);
        logAction('举办【' + fest.name + '】！限时地图攻+' + (fest.atk * 100) + '% / 血+' + (fest.hp * 100) + '% / 爆伤+' + (fest.crit * 100) + '%', 'success');
        bumpLifeDaily('festival');
        if (typeof addClanPrestige === 'function') addClanPrestige(10);
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    };

    window.inscribeFamilyPrecept = function (preceptId) {
        upgradeLineageConfig();
        ensureLifeData();
        var list = cfg().lifeSim.precepts || [];
        var p = list.find(function (x) { return x.id === preceptId; });
        if (!p) return;
        var owned = player.children.life.precepts;
        if (owned.indexOf(preceptId) >= 0) return logAction('家训「' + p.name + '」已立', 'info');
        var cost = (cfg().lifeSim.preceptCostBase || 80000000) * Math.pow(10, owned.length);
        if (funds().availableFunds < cost) return logAction('资金不足 ' + fmt(cost), 'error');
        funds().availableFunds -= cost;
        owned.push(preceptId);
        pushDiary('家训堂新挂一幅：「' + p.name + '」。路过的人都放轻了脚步。');
        logAction('立下家训【' + p.name + '】，永久提升世界地图三维', 'success');
        if (typeof addClanPrestige === 'function') addClanPrestige(20);
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.writeMemberBiography = function (memberIndex) {
        upgradeLineageConfig();
        ensureLifeData();
        var m = (player.children.children || [])[memberIndex];
        if (!m) return;
        if (!(typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : m.isAdult)) {
            return logAction('须成年后方可立传', 'error');
        }
        if ((player.children.life.biographies || []).indexOf(m.id) >= 0) {
            return logAction(m.name + ' 已有列传', 'info');
        }
        var cost = 120000000 * Math.pow(10, (player.children.life.biographies || []).length);
        if (funds().availableFunds < cost) return logAction('资金不足 ' + fmt(cost), 'error');
        funds().availableFunds -= cost;
        player.children.life.biographies.push(m.id);
        m.glory = (m.glory || 0) + 30;
        pushDiary('史官为 ' + m.name + ' 写下列传。纸墨干透，族谱又厚了一分。');
        logAction('为 ' + m.name + ' 立传成功', 'success');
        if (typeof addClanPrestige === 'function') addClanPrestige(15);
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.challengeBloodTrial = function (memberIndex) {
        upgradeLineageConfig();
        ensureLifeData();
        var t = cfg().lifeSim.trial;
        var m = (player.children.children || [])[memberIndex];
        if (!m || !t) return;
        if (!(typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : m.isAdult)) {
            return logAction('须成年子弟方可试炼', 'error');
        }
        if (Date.now() < (player.children.life.trialCd || 0)) {
            return logAction('试炼冷却中', 'info');
        }
        var floor = (player.children.life.trialFloor || 0) + 1;
        if (floor > t.maxFloor) return logAction('十八关已全部闯过', 'info');
        var maxG = 0;
        (player.children.children || []).forEach(function (c) { maxG = Math.max(maxG, c.generation || 1); });
        if (floor > maxG) return logAction('需血脉触及第' + floor + '代后方可闯此关', 'error');
        var cost = t.baseCost * Math.pow(t.costGrowth, floor - 1);
        if (funds().availableFunds < cost) return logAction('资金不足 ' + fmt(cost), 'error');
        funds().availableFunds -= cost;
        var power = Object.values(m.attributes || {}).reduce(function (a, b) { return a + b; }, 0);
        var need = 8 + floor * 6;
        var win = power + Math.random() * 20 > need;
        player.children.life.trialCd = Date.now() + t.cd;
        if (win) {
            player.children.life.trialFloor = floor;
            player.children.life.trialBuffUntil = Date.now() + t.duration;
            player.children.militaryMerit = (player.children.militaryMerit || 0) + t.militaryPer;
            if (typeof addClanPrestige === 'function') addClanPrestige(t.prestigePer);
            m.glory = (m.glory || 0) + 5;
            pushDiary(m.name + ' 闯过血脉试炼第' + floor + '关。回来时衣襟破了，眼神却亮。');
            logAction(m.name + ' 通关第' + floor + '关！永久三维提升，并获限时加成', 'success');
        } else {
            pushDiary(m.name + ' 在第' + floor + '关折返。你只说：养好伤，再来。');
            logAction(m.name + ' 未能通关第' + floor + '关（属性总和约需 ' + need + '）', 'info');
        }
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    };

    window.holdClanFeast = function (tierId) {
        upgradeLineageConfig();
        ensureLifeData();
        var tier = (cfg().lifeSim.feastTiers || []).find(function (t) { return t.id === tierId; });
        if (!tier) return;
        if (Date.now() < (player.children.life.feastCd || 0)) return logAction('族宴冷却中', 'info');
        var maxG = 0;
        (player.children.children || []).forEach(function (c) { maxG = Math.max(maxG, c.generation || 1); });
        if (tier.needGen && maxG < tier.needGen) {
            return logAction('需血脉至第' + tier.needGen + '代方可举办', 'error');
        }
        if (funds().availableFunds < tier.cost) return logAction('资金不足 ' + fmt(tier.cost), 'error');
        funds().availableFunds -= tier.cost;
        player.children.life.feastCd = Date.now() + 8 * HOUR_MS;
        player.children.life.festivalBuff = { atk: tier.atk, hp: tier.hp, crit: tier.crit };
        player.children.life.festivalBuffUntil = Date.now() + tier.duration;
        player.children.life.mood = Math.min(100, (player.children.life.mood || 50) + (tier.mood || 10));
        pushDiary('今晚摆下【' + tier.name + '】。杯盏碰撞声里，有人说起从前，也有人说起以后。');
        logAction('举办【' + tier.name + '】！限时地图三维大幅提升', 'success');
        bumpLifeDaily('festival');
        if (typeof addClanPrestige === 'function') addClanPrestige(12);
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    };

    // ——— 武道 / 十八代（UI + 行为）———
    function martialCost(base, lv) { return base * Math.pow((cfg().martialHall && cfg().martialHall.costGrowth) || 10, lv); }

    window.upgradeMartialHall = function (key) {
        upgradeLineageConfig();
        ensureLifeData();
        var mh = cfg().martialHall;
        if (!mh || !mh.costs[key]) return;
        var lv = player.children.martial[key + 'Lv'] || 0;
        if (lv >= mh.maxLevel) return logAction('已满级', 'info');
        var cost = martialCost(mh.costs[key], lv);
        if (funds().availableFunds < cost) return logAction('资金不足 ' + fmt(cost), 'error');
        funds().availableFunds -= cost;
        player.children.martial[key + 'Lv'] = lv + 1;
        if (typeof addClanPrestige === 'function') addClanPrestige(mh.prestigePerLevel || 1);
        logAction('武道堂·' + ({ atk: '攻', hp: '血', crit: '爆' }[key] || key) + ' 升至 ' + (lv + 1) + ' 级', 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.setWarSpiritSlot = function (slot, memberIndex) {
        ensureLifeData();
        var m = (player.children.children || [])[memberIndex];
        if (!m) return;
        player.children.warSpirits[slot] = m.id;
        logAction('战魂席 ' + (slot + 1) + ' 任命 ' + m.name, 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.upgradeHouseGuard = function (gid) {
        upgradeLineageConfig();
        ensureLifeData();
        var g = (cfg().houseGuards || []).find(function (x) { return x.id === gid; });
        if (!g) return;
        var lv = player.children.guards[gid] || 0;
        var cost = g.cost * Math.pow(10, lv);
        if (funds().availableFunds < cost) return logAction('资金不足 ' + fmt(cost), 'error');
        funds().availableFunds -= cost;
        player.children.guards[gid] = lv + 1;
        logAction(g.name + ' 升至 ' + (lv + 1) + ' 级', 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.startBloodDrill = function () {
        upgradeLineageConfig();
        ensureLifeData();
        var d = cfg().drill;
        if (Date.now() < (player.children.drillLast || 0) + d.cooldown) return logAction('演武冷却中', 'info');
        if (funds().availableFunds < d.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= d.cost;
        player.children.drillLast = Date.now();
        player.children.drillUntil = Date.now() + d.duration;
        player.children.militaryMerit = (player.children.militaryMerit || 0) + 5;
        logAction('血战演武开始！限时大幅提升世界地图三维', 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.erectGenerationTablet = function (gen) {
        upgradeLineageConfig();
        ensureLifeData();
        var eg = cfg().eighteen;
        gen = Number(gen);
        if (player.children.eighteen.tablets[gen]) return logAction('该代牌位已立', 'info');
        var has = (player.children.children || []).some(function (m) { return (m.generation || 1) >= gen; });
        if (!has) return logAction('尚未触及第' + gen + '代', 'error');
        var cost = eg.tabletBaseCost * Math.pow(eg.tabletCostGrowth, gen - 1);
        if (player.children.eighteen.freeTablet) {
            player.children.eighteen.freeTablet = false;
            cost = 0;
        }
        if (funds().availableFunds < cost) return logAction('资金不足 ' + fmt(cost), 'error');
        funds().availableFunds -= cost;
        player.children.eighteen.tablets[gen] = true;
        bumpLifeDaily('eighteen');
        logAction('立下第' + gen + '代牌位', 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.upgradeFamilyChronicle = function () {
        upgradeLineageConfig();
        ensureLifeData();
        var eg = cfg().eighteen;
        var lv = player.children.eighteen.chronicleLevel || 0;
        var cost = eg.chronicleCost * Math.pow(eg.chronicleGrowth, lv);
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        player.children.eighteen.chronicleLevel = lv + 1;
        bumpLifeDaily('eighteen');
        logAction('族谱大典升至 ' + (lv + 1) + ' 级', 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.startEighteenRitual = function () {
        upgradeLineageConfig();
        ensureLifeData();
        var eg = cfg().eighteen;
        var tablets = Object.keys(player.children.eighteen.tablets || {}).length;
        if (tablets < 1) return logAction('需先立至少一座牌位', 'error');
        var ritualCdLeft = (player.children.eighteen.ritualLast || 0) + eg.ritualCooldown - Date.now();
        if (ritualCdLeft > 0) return logAction('祭典冷却中（剩 ' + Math.floor(ritualCdLeft / 3600000) + '时' + Math.ceil((ritualCdLeft % 3600000) / 60000) + '分）', 'info');
        if (funds().availableFunds < eg.ritualCost) return logAction('资金不足', 'error');
        funds().availableFunds -= eg.ritualCost;
        player.children.eighteen.ritualLast = Date.now();
        player.children.eighteen.ritualUntil = Date.now() + eg.ritualDuration;
        bumpLifeDaily('eighteen');
        logAction('十八代祭典开启！', 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    // 轶事选择附加世界地图 buff
    var _origResolve = window.resolveClanEventChoice || window.chooseClanEvent;
    // patch apply inside choose if exists — wrap chooseClanEventChoice
    var chooseFnNames = ['chooseClanEventChoice', 'resolveClanEvent'];
    // Monkeypatch after choice: listen via wrapping chooseClanEventChoice when defined later
    function patchEventChoice() {
        if (window._lifeEventPatched) return;
        var fn = window.resolveClanEvent;
        if (typeof fn !== 'function') return;
        window._lifeEventPatched = true;
        window.resolveClanEvent = function (idx) {
            var ev = player.children.activeEvent;
            var def = ev && (cfg().events || []).find(function (e) { return e.id === ev.id; });
            var ch = def && def.choices && def.choices[idx];
            fn(idx);
            if (!ch) return;
            ensureLifeData();
            if (ch.effect === 'eighteenRitualReady') {
                player.children.eighteen.ritualLast = 0;
                logAction('十八代祭典已可立即开启', 'success');
            } else if (ch.effect === 'chronicleBoost') {
                player.children.eighteen.chronicleLevel = (player.children.eighteen.chronicleLevel || 0) + 1;
                logAction('族谱大典因史官修撰提升一级', 'success');
            } else if (ch.effect === 'resonanceBoost') {
                player.children.eighteen.resonanceBonusUntil = Date.now() + 12 * HOUR_MS;
                logAction('血脉共鸣增强 12 小时', 'success');
            } else if (ch.effect === 'freeTablet') {
                player.children.eighteen.freeTablet = true;
                logAction('获得一次免费立碑机会', 'success');
            } else if (ch.effect === 'martialBoost') {
                player.children.martial.atkLv = (player.children.martial.atkLv || 0) + 1;
                player.children.martial.hpLv = (player.children.martial.hpLv || 0) + 1;
                player.children.martial.critLv = (player.children.martial.critLv || 0) + 1;
                logAction('武道堂三维各+1级', 'success');
            }
            if (ch.worldAtk || ch.worldHp || ch.worldCritDmg) {
                var tw = player.children.life.tempWorld;
                if (Date.now() > (tw.until || 0)) { tw.atk = 0; tw.hp = 0; tw.crit = 0; }
                tw.atk += ch.worldAtk || 0;
                tw.hp += ch.worldHp || 0;
                tw.crit += ch.worldCritDmg || 0;
                tw.until = Date.now() + 6 * HOUR_MS;
                pushDiary('这件事过后，家里的气势似乎也不一样了。');
            }
            if (typeof updateChildBonuses === 'function') updateChildBonuses();
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }

    function updateLifeSimPanels() {
        upgradeLineageConfig();
        ensureLifeData();
        var life = player.children.life;
        var ls = cfg().lifeSim;
        var members = player.children.children || [];
        var moodLeft = Math.max(0, (life.moodActCdUntil || 0) - Date.now());

        var diary = el('lifeDiaryPanel');
        if (diary) {
            diary.innerHTML = '<div class="c-hint">家族心情 ' + (life.mood || 0) + '/100 · 心情越高，世界地图三维越好' +
                (moodLeft > 0
                    ? (' · <span style="color:#FFB74D;">起居冷却约 ' + Math.ceil(moodLeft / 60000) + ' 分钟</span>')
                    : ' · <span style="color:#81C784;">起居可进行（冷却 2 小时）</span>') +
                '</div>' +
                (life.diary.length ? life.diary.slice(0, 12).map(function (d) {
                    return '<div class="c-info-row" style="font-size:12px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06);">' +
                        '<span style="color:#C9A0B8;margin-right:8px;">' + new Date(d.t).toLocaleString() + '</span>' + d.text + '</div>';
                }).join('') : '<div class="c-hint">还没有日记。去做一桩起居、办一场节庆，故事会写在这里。</div>');
        }

        var act = el('lifeActivityPanel');
        if (act) {
            var opts = members.map(function (m, i) {
                return '<option value="' + i + '">' + m.name + '（' + ((ls.personas.find(function (p) { return p.id === m.personaId; }) || {}).name || '—') + '）</option>';
            }).join('');
            var actDisabled = moodLeft > 0;
            act.innerHTML = '<div class="c-form-row"><label>选择成员</label><select id="lifeActMember" class="c-input">' + opts + '</select></div>' +
                (actDisabled ? '<p class="c-hint" style="color:#FFB74D;">心情起居冷却中，约 ' + Math.ceil(moodLeft / 60000) + ' 分钟后可再进行（全族共享）</p>' : '') +
                '<div class="c-train-grid">' + ls.activities.map(function (a) {
                    return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                        '<div class="ms-title">' + a.name + '</div>' +
                        '<div class="ms-desc">耗资 ' + fmt(a.cost) + ' · 心情+' + a.mood + ' · 冷却 2 小时</div>' +
                        '<button class="c-btn c-btn-sm c-btn-pink" style="margin-top:6px;" ' + (actDisabled ? 'disabled' : '') +
                        ' onclick="doLifeActivity(\'' + a.id + '\', +document.getElementById(\'lifeActMember\').value)">' +
                        (actDisabled ? '冷却中' : a.name) + '</button></div>';
                }).join('') + '</div>';
        }

        var estate = el('lifeEstatePanel');
        if (estate) {
            var ew = calcEstateWorld();
            estate.innerHTML = '<div class="c-hint">宅邸合计：地图攻+' + (ew.atk * 100).toFixed(0) + '% / 血+' + (ew.hp * 100).toFixed(0) + '% / 爆伤+' + (ew.crit * 100).toFixed(0) + '%</div>' +
                ls.estateRooms.map(function (r) {
                    var lv = life.estate[r.id] || 0;
                    var cost = r.costBase * Math.pow(r.growth || 10, lv);
                    return '<div class="c-milestone' + (lv > 0 ? ' done' : '') + '"><div><div class="ms-title">' + r.name + ' · Lv.' + lv + '/' + r.max +
                        '</div><div class="ms-desc">' + r.desc + ' · 下级 ' + fmt(cost) + '</div></div>' +
                        '<button class="c-btn c-btn-sm c-btn-gold" onclick="upgradeEstateRoom(\'' + r.id + '\')" ' + (lv >= r.max ? 'disabled' : '') + '>修缮</button></div>';
                }).join('');
        }

        var career = el('lifeCareerPanel');
        if (career) {
            career.innerHTML = members.map(function (m, i) {
                if (!(typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : m.isAdult)) return '';
                var row = life.careers[m.id];
                var def = row && ls.careers.find(function (c) { return c.id === row.id; });
                var nextCost = def ? def.costBase * Math.pow(10, row.lv || 0) : ((ls.careers[0] && ls.careers[0].costBase) || 0);
                var trainLabel = (!def || (row.lv || 0) >= (def.max || 20))
                    ? '深造'
                    : ('深造' + (typeof lineageCostTag === 'function' ? lineageCostTag(nextCost) : ('（耗资 ' + fmt(nextCost) + '）')));
                return '<div class="c-member"><div class="name">' + m.name + '</div><div class="meta">' +
                    (def ? (def.name + ' Lv.' + (row.lv || 0)) : '尚未定志') + '</div>' +
                    '<select class="c-input" id="careerSel' + i + '" style="margin:6px 0;">' +
                    ls.careers.map(function (c) {
                        return '<option value="' + c.id + '"' + (row && row.id === c.id ? ' selected' : '') + '>' + c.name + '</option>';
                    }).join('') + '</select>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="assignLifeCareer(' + i + ', document.getElementById(\'careerSel' + i + '\').value)">定志</button> ' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="trainLifeCareer(' + i + ')">' + trainLabel + '</button></div>';
            }).join('') || '<div class="c-hint">需要成年成员才能定志深造</div>';
        }

        var bond = el('lifeBondPanel');
        if (bond) {
            var sel = members.map(function (m, i) { return '<option value="' + i + '">' + m.name + '</option>'; }).join('');
            bond.innerHTML = '<div class="c-form-row"><label>成员甲</label><select id="bondA" class="c-input">' + sel + '</select></div>' +
                '<div class="c-form-row"><label>成员乙</label><select id="bondB" class="c-input">' + sel + '</select></div>' +
                '<button class="c-btn c-btn-pink" style="width:100%;" onclick="deepenFamilyBond(+document.getElementById(\'bondA\').value,+document.getElementById(\'bondB\').value)">夜谈交心（1500万）</button>' +
                '<p class="c-hint">羁绊提升家族「齐心」加成，作用于世界地图三维。</p>';
        }

        var fest = el('lifeFestivalPanel');
        if (fest) {
            var leftBuff = Math.max(0, (life.festivalBuffUntil || 0) - Date.now());
            fest.innerHTML = (leftBuff ? '<div class="c-hint" style="color:#4CAF50;">节庆祝福剩余 ' + Math.ceil(leftBuff / 60000) + ' 分钟</div>' : '') +
                ls.festivals.map(function (f) {
                    return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                        '<div class="ms-title">' + f.name + '</div><div class="ms-desc">耗资 ' + fmt(f.cost) + ' · 限时攻+' + (f.atk * 100) + '% 血+' + (f.hp * 100) + '% 爆+' + (f.crit * 100) + '%</div>' +
                        '<p style="font-size:12px;color:#C9A0B8;margin:6px 0;">' + f.text + '</p>' +
                        '<button class="c-btn c-btn-gold" onclick="holdFamilyFestival(\'' + f.id + '\')">举办</button></div>';
                }).join('');
        }

        var precept = el('lifePreceptPanel');
        if (precept) {
            var owned = life.precepts || [];
            precept.innerHTML = (ls.precepts || []).map(function (p) {
                var has = owned.indexOf(p.id) >= 0;
                var cost = (ls.preceptCostBase || 80000000) * Math.pow(10, owned.length);
                return '<div class="c-milestone' + (has ? ' done' : '') + '"><div><div class="ms-title">' + p.name +
                    '</div><div class="ms-desc">' + p.desc + ' · 攻+' + (p.atk * 100) + '% 血+' + (p.hp * 100) + '% 爆+' + (p.crit * 100) + '%</div></div>' +
                    (has ? '<span style="color:#4CAF50;">已立</span>' :
                        '<button class="c-btn c-btn-sm c-btn-gold" onclick="inscribeFamilyPrecept(\'' + p.id + '\')">立训（' + fmt(cost) + '）</button>') +
                    '</div>';
            }).join('');
        }
        var bio = el('lifeBiographyPanel');
        if (bio) {
            var bioCost = 120000000 * Math.pow(10, (life.biographies || []).length);
            var bioTag = typeof lineageCostTag === 'function' ? lineageCostTag(bioCost) : ('（耗资 ' + fmt(bioCost) + '）');
            bio.innerHTML = members.map(function (m, i) {
                if (!(typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : m.isAdult)) return '';
                var has = (life.biographies || []).indexOf(m.id) >= 0;
                return '<div class="c-member"><div class="name">' + m.name + '</div><div class="meta">' +
                    getGenerationLabel(m.generation || 1) + (has ? ' · 已有列传' : '') + '</div>' +
                    (has ? '' : '<button class="c-btn c-btn-sm c-btn-gold" onclick="writeMemberBiography(' + i + ')">立传' + bioTag + '</button>') +
                    '</div>';
            }).join('') || '<div class="c-hint">暂无成年成员可立传</div>';
        }
        var trial = el('lifeTrialPanel');
        if (trial && ls.trial) {
            var floor = life.trialFloor || 0;
            var next = floor + 1;
            var cost = ls.trial.baseCost * Math.pow(ls.trial.costGrowth, Math.max(0, next - 1));
            var opts = members.map(function (m, i) {
                if (!(typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : m.isAdult)) return '';
                return '<option value="' + i + '">' + m.name + '</option>';
            }).join('');
            trial.innerHTML = '<div class="c-hint">已通关 ' + floor + '/' + ls.trial.maxFloor + ' 关 · 下一关耗资 ' + fmt(cost) + '</div>' +
                '<div class="c-form-row"><label>选派</label><select id="trialMember" class="c-input">' + opts + '</select></div>' +
                '<button class="c-btn c-btn-orange" style="width:100%;" onclick="challengeBloodTrial(+document.getElementById(\'trialMember\').value)" ' +
                (next > ls.trial.maxFloor ? 'disabled' : '') + '>' + (next > ls.trial.maxFloor ? '十八关已圆满' : ('挑战第' + next + '关')) + '</button>';
        }
        var feast = el('lifeFeastPanel');
        if (feast) {
            var maxG = 0;
            members.forEach(function (m) { maxG = Math.max(maxG, m.generation || 1); });
            feast.innerHTML = (ls.feastTiers || []).map(function (t) {
                var lock = t.needGen && maxG < t.needGen;
                return '<div class="c-milestone' + (lock ? '' : ' done') + '" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + t.name + '</div><div class="ms-desc">耗资 ' + fmt(t.cost) +
                    ' · 限时攻+' + (t.atk * 100) + '% 血+' + (t.hp * 100) + '% 爆+' + (t.crit * 100) + '%' +
                    (t.needGen ? ' · 需第' + t.needGen + '代' : '') + '</div>' +
                    '<button class="c-btn c-btn-gold" style="margin-top:6px;" onclick="holdClanFeast(\'' + t.id + '\')" ' +
                    (lock ? 'disabled' : '') + '>' + (lock ? '未解锁' : '摆宴') + '</button></div>';
            }).join('');
        }
    }

    function updateMartialPanels() {
        upgradeLineageConfig();
        ensureLifeData();
        var mh = cfg().martialHall;
        var panel = el('lineageMartialPanel');
        if (panel && mh) {
            var m = player.children.martial;
            panel.innerHTML = ['atk', 'hp', 'crit'].map(function (key) {
                var lv = m[key + 'Lv'] || 0;
                var cost = martialCost(mh.costs[key], lv);
                var label = { atk: '破军·攻击', hp: '铁壁·生命', crit: '饮血·爆伤' }[key];
                return '<div class="c-milestone done"><div><div class="ms-title">' + label + ' Lv.' + lv +
                    '</div><div class="ms-desc">每级地图' + ({ atk: '攻', hp: '血', crit: '爆' }[key]) + '+' + (mh.perLevel[key] * 100) + '% · 下级 ' + fmt(cost) +
                    '</div></div><button class="c-btn c-btn-sm c-btn-orange" onclick="upgradeMartialHall(\'' + key + '\')">修炼</button></div>';
            }).join('');
        }
        var spirit = el('lineageWarSpiritPanel');
        if (spirit) {
            var opts = (player.children.children || []).map(function (m, i) {
                return '<option value="' + i + '">' + m.name + '</option>';
            }).join('');
            spirit.innerHTML = [0, 1, 2, 3, 4].map(function (slot) {
                var id = player.children.warSpirits[slot];
                var mem = id && (player.children.children || []).find(function (x) { return x.id === id; });
                return '<div class="c-milestone"><div class="ms-title">席位' + (slot + 1) + ' · ' + (mem ? mem.name : '空') +
                    '</div><select class="c-input" id="spiritSel' + slot + '">' + opts + '</select> ' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="setWarSpiritSlot(' + slot + ',+document.getElementById(\'spiritSel' + slot + '\').value)">任命</button></div>';
            }).join('');
        }
        var guard = el('lineageGuardPanel');
        if (guard) {
            guard.innerHTML = (cfg().houseGuards || []).map(function (g) {
                var lv = player.children.guards[g.id] || 0;
                return '<div class="c-milestone done"><div><div class="ms-title">' + g.name + ' Lv.' + lv +
                    '</div><div class="ms-desc">' + g.desc + ' · ' + fmt(g.cost * Math.pow(10, lv)) + '</div></div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="upgradeHouseGuard(\'' + g.id + '\')">强化</button></div>';
            }).join('');
        }
        var drill = el('lineageDrillPanel');
        if (drill && cfg().drill) {
            var d = cfg().drill;
            var left = Math.max(0, (player.children.drillUntil || 0) - Date.now());
            drill.innerHTML = '<div class="c-hint">军功 ' + (player.children.militaryMerit || 0) + ' · 演武可短时大幅提升地图三维</div>' +
                '<button class="c-btn c-btn-orange" style="width:100%;" onclick="startBloodDrill()">' +
                (left > 0 ? ('演武中 ' + Math.ceil(left / 60000) + ' 分钟') : ('开启演武（' + fmt(d.cost) + '）')) + '</button>';
        }
    }

    function updateEighteenLifePanels() {
        upgradeLineageConfig();
        ensureLifeData();
        var eg = cfg().eighteen;
        if (!eg) return;
        var partsInfo = calcEighteenWorldParts();
        var maxG = partsInfo.maxG;
        var freeTip = player.children.eighteen.freeTablet
            ? '<div class="c-hint" style="color:#81C784;margin-bottom:8px;">★ 轶事奖励：下一次立碑免费</div>'
            : '';
        var tab = el('eighteenTabletPanel');
        if (tab) {
            var html = freeTip + '<div class="c-hint">已立 ' + partsInfo.tabletCount + '/18 · 最远触及 ' + genLabelLife(maxG || 1) + '</div>';
            for (var g = 1; g <= 18; g++) {
                var done = !!(player.children.eighteen.tablets || {})[g];
                var cost = eg.tabletBaseCost * Math.pow(eg.tabletCostGrowth, g - 1);
                var showCost = player.children.eighteen.freeTablet ? '免费就绪' : fmt(cost);
                html += '<div class="c-milestone' + (done ? ' done' : '') + '"><div><div class="ms-title">' + genLabelLife(g) + '牌位</div>' +
                    '<div class="ms-desc">' + (done ? '已立 · 攻+' + (eg.tabletBonus.atk * 100).toFixed(0) + '% 等' : ('需触及该代 · ' + showCost)) + '</div></div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="erectGenerationTablet(' + g + ')" ' +
                    (done || maxG < g ? 'disabled' : '') + '>' + (done ? '已立' : '立碑') + '</button></div>';
            }
            tab.innerHTML = html;
        }
        var res = el('eighteenResonancePanel');
        if (res) {
            var w = partsInfo.total;
            var p = partsInfo.parts;
            function row(lab, v) {
                if (!v || (!(v.atk) && !(v.hp) && !(v.crit))) return '';
                return '<div class="c-hint" style="margin:2px 0;">' + lab + '：攻+' + (v.atk * 100).toFixed(0) +
                    '% · 血+' + (v.hp * 100).toFixed(0) + '% · 爆+' + (v.crit * 100).toFixed(0) + '%</div>';
            }
            var blessHtml = '<div style="margin-top:10px;"><strong style="color:#E8C4A8;">代际祝福</strong></div>' +
                (eg.blessings || []).map(function (b) {
                    var on = maxG >= b.gen;
                    return '<div class="c-milestone' + (on ? ' done' : '') + '"><div><div class="ms-title">' + b.name +
                        '</div><div class="ms-desc">' + genLabelLife(b.gen) + ' · 攻+' + (b.atk * 100).toFixed(0) +
                        '% 血+' + (b.hp * 100).toFixed(0) + '% 爆+' + (b.crit * 100).toFixed(0) + '%</div></div>' +
                        '<span style="color:' + (on ? '#81C784' : '#999') + ';">' + (on ? '已生效' : '未触及') + '</span></div>';
                }).join('');
            var realSnap = '';
            try {
                var poemArr = (window.lineageExtConfig && window.lineageExtConfig.living &&
                    window.lineageExtConfig.living.real && window.lineageExtConfig.living.real.generationPoem) || null;
                if (poemArr && poemArr.length) {
                    realSnap = '<div class="c-hint" style="margin-top:10px;">字辈诗：' + poemArr.join('') +
                        ' · 详览见「实录」页（扫墓/口述）</div>';
                }
            } catch (e) { /* ignore */ }
            res.innerHTML = '<div class="c-bonus-grid">' +
                '<div class="c-bonus-item"><div class="lab">共鸣·攻</div><div class="val">+' + (w.atk * 100).toFixed(0) + '%</div></div>' +
                '<div class="c-bonus-item"><div class="lab">共鸣·血</div><div class="val">+' + (w.hp * 100).toFixed(0) + '%</div></div>' +
                '<div class="c-bonus-item"><div class="lab">共鸣·爆</div><div class="val">+' + (w.crit * 100).toFixed(0) + '%</div></div></div>' +
                '<div style="margin-top:8px;">' +
                row('牌位', p.tablets) +
                row('代数共鸣', p.generation) +
                row('代际祝福', p.blessings) +
                row('族谱大典', p.chronicle) +
                row('祭典限时', p.ritual) +
                row('轶事共鸣', p.resonanceTemp) +
                '</div>' + blessHtml + realSnap;
        }
        var ch = el('eighteenChroniclePanel');
        if (ch) {
            var lv = player.children.eighteen.chronicleLevel || 0;
            var cost = eg.chronicleCost * Math.pow(eg.chronicleGrowth, lv);
            var nextAtk = eg.chronicleBonusPer.atk;
            ch.innerHTML = '<div class="c-hint">族谱等级 Lv.' + lv +
                ' · 每级永久 攻+' + (nextAtk * 100).toFixed(0) + '% / 血+' + (eg.chronicleBonusPer.hp * 100).toFixed(0) +
                '% / 爆+' + (eg.chronicleBonusPer.crit * 100).toFixed(0) + '%</div>' +
                '<div class="c-hint">下级花费 ' + fmt(cost) + '（成长倍率 ×' + eg.chronicleGrowth + '）</div>' +
                '<button class="c-btn c-btn-gold" style="width:100%;margin-top:6px;" onclick="upgradeFamilyChronicle()">修撰族谱（' + fmt(cost) + '）</button>';
        }
        var rit = el('eighteenRitualPanel');
        if (rit) {
            var left = Math.max(0, (player.children.eighteen.ritualUntil || 0) - Date.now());
            var cdLeftRitual = Math.max(0, (player.children.eighteen.ritualLast || 0) + eg.ritualCooldown - Date.now());
            var buff = eg.ritualBuff;
            var status = left > 0
                ? ('祭典进行中，剩余 ' + Math.ceil(left / 60000) + ' 分钟 · 攻+' + (buff.atk * 100).toFixed(0) + '% 等')
                : (cdLeftRitual > 0
                    ? ('冷却中 ' + cdHintMs(cdLeftRitual, false))
                    : ('可开启 · 持续 ' + Math.round(eg.ritualDuration / 3600000) + ' 小时'));
            rit.innerHTML = '<div class="c-hint">' + status + '</div>' +
                '<button class="c-btn c-btn-pink" style="width:100%;" onclick="startEighteenRitual()" ' +
                (left > 0 || cdLeftRitual > 0 ? 'disabled' : '') + '>' +
                (left > 0 ? ('祭典中 ' + Math.ceil(left / 60000) + ' 分钟') :
                    (cdLeftRitual > 0 ? ('冷却 ' + cdHintMs(cdLeftRitual, false)) : ('开启十八代祭典（' + fmt(eg.ritualCost) + '）'))) +
                '</button>';
        }
    }

    // 成婚档位弹窗（覆盖旧输入框）
    window.arrangeMarriage = function (childIndex) {
        upgradeLineageConfig();
        ensureLifeData();
        var child = player.children.children[childIndex];
        if (!child || !isFamilyMemberAdult(child)) return logAction('只有成年成员才能结婚', 'error');
        if (child.isMarried) return logAction(child.name + ' 已经成婚', 'error');
        if ((child.generation || 1) >= childConfig.lineage.maxGeneration) return logAction('已达代数上限', 'error');
        if (typeof openMarriageTierDialog === 'function') return openMarriageTierDialog(childIndex);

        var p = player.children.clanPrestige || 0;
        var baseCost = childConfig.lineage.marriageCost;
        var discountOn = !!(player.children.living && Date.now() < (player.children.living.marriageDiscountUntil || 0));
        var overlay = document.createElement('div');
        overlay.id = 'marriageTierOverlay';
        overlay.className = 'child-overlay';
        overlay.style.cssText = 'display:block;z-index:1100;position:fixed;inset:0;background:rgba(0,0,0,0.65);';
        overlay.onclick = function () { overlay.remove(); dialog.remove(); };
        var dialog = document.createElement('div');
        dialog.id = 'marriageTierDialog';
        dialog.className = 'child-panel';
        dialog.style.cssText = 'display:block;z-index:1101;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(520px,94vw);max-height:82vh;overflow:auto;';
        dialog.onclick = function (e) { e.stopPropagation(); };
        dialog.innerHTML = '<div class="c-header"><div class="c-title">安排成婚 · ' + child.name + '</div>' +
            '<button class="c-close" onclick="document.getElementById(\'marriageTierDialog\').remove();document.getElementById(\'marriageTierOverlay\').remove();">关闭</button></div>' +
            '<div class="c-body">' +
            (discountOn ? '<div class="c-hint" style="color:#81C784;">★ 轶事联姻优惠：费用七折（12小时内）</div>' : '') +
            cfg().marriageTiers.map(function (t) {
                var locked = t.needPrestige && p < t.needPrestige;
                var cost = Math.floor(baseCost * t.costMult * (discountOn ? 0.7 : 1));
                var can = funds().availableFunds >= cost;
                return '<div class="c-milestone' + (locked ? '' : ' done') + '" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + t.name + '</div><div class="ms-desc">费用 ' + fmt(cost) + (discountOn ? '（折后）' : '') + ' · 继承+' + ((t.inheritBonus || 0) * 100).toFixed(0) + '% · 声望+' + t.prestige + '</div>' +
                    '<button class="c-btn ' + (!locked && can ? 'c-btn-gold' : '') + '" style="margin-top:6px;" ' + (locked || !can ? 'disabled' : '') +
                    ' onclick="arrangeMarriageTiered(' + childIndex + ',\'' + t.id + '\');document.getElementById(\'marriageTierDialog\').remove();document.getElementById(\'marriageTierOverlay\').remove();">' +
                    (locked ? '需声望' + t.needPrestige : (!can ? '资金不足' : '选择')) + '</button></div>';
            }).join('') + '</div>';
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    };

    var _origUpdateExt = window.updateLineageExtUI;
    window.updateLineageExtUI = function () {
        upgradeLineageConfig();
        ensureLifeData();
        if (_origUpdateExt) _origUpdateExt();
        if (window.__lineageExtOnly) {
            if (typeof enhanceLineageMarriageUI === 'function') enhanceLineageMarriageUI();
            patchEventChoice();
            return;
        }
        var gate = typeof childTabIn === 'function' ? childTabIn : function () { return true; };
        if (gate(['life', 'estate', 'festival', 'feast', 'precept', 'trial'])) updateLifeSimPanels();
        if (gate(['martial'])) updateMartialPanels();
        if (gate(['eighteen'])) updateEighteenLifePanels();
        if (typeof enhanceLineageMarriageUI === 'function' && gate(['lineage', 'overview', 'birth', 'marital'])) {
            enhanceLineageMarriageUI();
        }
        patchEventChoice();
    };

    window.updateLifeSimPanels = updateLifeSimPanels;
    window.updateMartialPanels = updateMartialPanels;
    window.updateEighteenLifePanels = updateEighteenLifePanels;

    upgradeLineageConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            upgradeLineageConfig();
            ensureLifeData();
            patchEventChoice();
        }, 1000);
    });
})();

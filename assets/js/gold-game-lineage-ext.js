/**
 * 家族传承 · 子孙扩展玩法
 * 命格 / 产业 / 宗祠 / 日常 / 事件 / 传家宝 / 科举 / 远征 / 声望 / 分家
 */
(function () {
    'use strict';

    var DAY_MS = 24 * 60 * 60 * 1000;

    window.lineageExtConfig = {
        talents: [
            { id: 'tianjiao', name: '天骄', rarity: '传说', color: '#FFD700', w: 3, desc: '全属性培养+1，贡献×1.2', onTrainBonus: 1, contribMult: 1.2 },
            { id: 'wenqu', name: '文曲', rarity: '史诗', color: '#A335EE', w: 8, desc: '智力培养翻倍，GPS贡献×1.15', attrBoost: 'intelligence', attrMult: 2, gpsExtra: 0.15 },
            { id: 'wusheng', name: '武圣', rarity: '史诗', color: '#A335EE', w: 8, desc: '体质培养翻倍，点击贡献×1.15', attrBoost: 'physique', attrMult: 2, clickExtra: 0.15 },
            { id: 'hongyan', name: '红颜', rarity: '精良', color: '#0070DD', w: 14, desc: '魅力培养+50%，生命贡献×1.1', attrBoost: 'charm', attrMult: 1.5, lifeExtra: 0.1 },
            { id: 'caishen', name: '财神', rarity: '精良', color: '#0070DD', w: 14, desc: '商业培养+50%，攻击贡献×1.1', attrBoost: 'business', attrMult: 1.5, atkExtra: 0.1 },
            { id: 'fuyuan', name: '福缘', rarity: '优秀', color: '#1EFF00', w: 20, desc: '互动额外奖励几率+20%', interactBonus: 0.2 },
            { id: 'qianyuan', name: '乾元', rarity: '优秀', color: '#1EFF00', w: 18, desc: '成长时间缩短15%', growSpeed: 0.15 },
            { id: 'pingfan', name: '平凡', rarity: '普通', color: '#AAAAAA', w: 35, desc: '无特殊效果，但可觉醒', plain: true }
        ],
        awakenCost: 500000,
        awakenChance: 0.35,
        businesses: [
            { id: 'inn', name: '家族客栈', cost: 300000, incomePerHour: 8000, needAttr: 'charm', desc: '魅力越高收入越高' },
            { id: 'shop', name: '商号钱庄', cost: 500000, incomePerHour: 12000, needAttr: 'business', desc: '商业越高收入越高' },
            { id: 'academy', name: '私塾书院', cost: 450000, incomePerHour: 10000, needAttr: 'intelligence', desc: '智力越高收入越高' },
            { id: 'dojo', name: '武馆镖局', cost: 400000, incomePerHour: 9000, needAttr: 'physique', desc: '体质越高收入越高' },
            { id: 'farm', name: '庄园田产', cost: 250000, incomePerHour: 6000, needAttr: 'physique', desc: '稳健的基础产业' },
            { id: 'trade', name: '远洋商队', cost: 1200000, incomePerHour: 28000, needAttr: 'business', desc: '高风险高收益' }
        ],
        ancestral: {
            upgradeCosts: [0, 200000, 800000, 2500000, 8000000, 20000000],
            offerCost: 50000,
            offerCooldown: 4 * 60 * 60 * 1000,
            buffDuration: 2 * 60 * 60 * 1000,
            buffPerLevel: 0.03
        },
        dailyQuests: [
            { id: 'train3', name: '勤学苦练', desc: '培养任意成员 3 次', need: 3, key: 'train', rewardPrestige: 20, rewardFunds: 30000, rewardExp: 15 },
            { id: 'work2', name: '家业兴旺', desc: '收取打工收入 2 次', need: 2, key: 'collect', rewardPrestige: 15, rewardFunds: 50000, rewardExp: 10 },
            { id: 'interact2', name: '天伦之乐', desc: '亲子互动 2 次', need: 2, key: 'interact', rewardPrestige: 15, rewardFunds: 20000, rewardExp: 12 },
            { id: 'offer1', name: '慎终追远', desc: '宗祠祭祖 1 次', need: 1, key: 'offer', rewardPrestige: 25, rewardFunds: 40000, rewardExp: 20 },
            { id: 'exam1', name: '金榜题名', desc: '完成科举/比试 1 次', need: 1, key: 'exam', rewardPrestige: 30, rewardFunds: 80000, rewardExp: 25 }
        ],
        events: [
            {
                id: 'prodigy', title: '神童异象',
                text: '族中幼童夜观星象，似有天资异象。你如何处置？',
                choices: [
                    { label: '重金延请名师', cost: 200000, effect: 'boostRandomAttr', amount: 5, prestige: 10 },
                    { label: '顺其自然', cost: 0, effect: 'smallBoost', amount: 1, prestige: 2 },
                    { label: '举办家宴庆祝', cost: 80000, effect: 'happiness', amount: 15, prestige: 8 }
                ]
            },
            {
                id: 'dispute', title: '分家争执',
                text: '两位成年子嗣因产业分配起了争执。',
                choices: [
                    { label: '公平调停', cost: 50000, effect: 'prestige', amount: 15 },
                    { label: '各立分号', cost: 300000, effect: 'unlockBranch', prestige: 25 },
                    { label: '严厉训斥', cost: 0, effect: 'trainDiscount', amount: 0.1, prestige: 5 }
                ]
            },
            {
                id: 'merchant', title: '西域商贾',
                text: '一位西域商人愿与你们联姻通商。',
                choices: [
                    { label: '答应联姻通商', cost: 150000, effect: 'tradeBuff', prestige: 20 },
                    { label: '只做买卖', cost: 100000, effect: 'funds', amount: 250000, prestige: 8 },
                    { label: '婉拒', cost: 0, effect: 'none', prestige: 0 }
                ]
            },
            {
                id: 'illness', title: '族中染恙',
                text: '一位成员身体不适，需要照顾。',
                choices: [
                    { label: '寻访名医', cost: 120000, effect: 'healBoost', amount: 3, prestige: 12 },
                    { label: '休养静养', cost: 30000, effect: 'smallBoost', amount: 1, prestige: 3 },
                    { label: '求神拜佛', cost: 20000, effect: 'offerReady', prestige: 5 }
                ]
            },
            {
                id: 'heirloom_find', title: '古物出土',
                text: '整修老宅时挖出一件古物，似是先辈遗物。',
                choices: [
                    { label: '收入传家宝库', cost: 0, effect: 'gainHeirloom', prestige: 18 },
                    { label: '鉴宝出售', cost: 0, effect: 'funds', amount: 500000, prestige: 5 },
                    { label: '供奉宗祠', cost: 0, effect: 'ancestralExp', amount: 1, prestige: 22 }
                ]
            },
            {
                id: 'rival', title: '世家较劲',
                text: '邻城望族送来战书，要比拼子孙才学。',
                choices: [
                    { label: '应战科举', cost: 50000, effect: 'freeExam', prestige: 10 },
                    { label: '送礼和解', cost: 200000, effect: 'prestige', amount: 5 },
                    { label: '暗中较劲', cost: 100000, effect: 'boostTop', amount: 4, prestige: 15 }
                ]
            }
        ],
        heirlooms: [
            { id: 'jade', name: '传世玉佩', gps: 0.05, click: 0, life: 0, atk: 0, desc: 'GPS +5%' },
            { id: 'sword', name: '祖传宝剑', gps: 0, click: 0.05, life: 0, atk: 0.08, desc: '点击+5%，攻击+8%' },
            { id: 'scroll', name: '家训卷轴', gps: 0.03, click: 0.03, life: 0.03, atk: 0.03, desc: '全属性加成+3%' },
            { id: 'seal', name: '家族印信', gps: 0, click: 0, life: 0, atk: 0, prestigeGain: 0.2, desc: '声望获取+20%' },
            { id: 'lamp', name: '长明祠灯', gps: 0, click: 0, life: 0.1, atk: 0, desc: '生命+10%，祭祖效果增强' },
            { id: 'abacus', name: '金算盘', gps: 0.08, click: 0, life: 0, atk: 0.05, desc: 'GPS+8%，攻击+5%' }
        ],
        examTypes: [
            { id: 'wen', name: '文科举', attr: 'intelligence', cost: 80000, cd: 6 * 60 * 60 * 1000, rewardBase: 100000, prestige: 25 },
            { id: 'wu', name: '武比试', attr: 'physique', cost: 80000, cd: 6 * 60 * 60 * 1000, rewardBase: 90000, prestige: 25 },
            { id: 'yi', name: '艺会', attr: 'charm', cost: 60000, cd: 6 * 60 * 60 * 1000, rewardBase: 70000, prestige: 20 },
            { id: 'shang', name: '商赛', attr: 'business', cost: 100000, cd: 8 * 60 * 60 * 1000, rewardBase: 150000, prestige: 30 }
        ],
        expeditions: [
            { id: 'hunt', name: '山林试炼', duration: 2 * 60 * 60 * 1000, cost: 50000, needAdult: 1, rewardMin: 80000, rewardMax: 200000, attrGain: 2, prestige: 15 },
            { id: 'caravan', name: '商路护卫', duration: 4 * 60 * 60 * 1000, cost: 120000, needAdult: 2, rewardMin: 200000, rewardMax: 500000, attrGain: 3, prestige: 28 },
            { id: 'ruin', name: '古迹探秘', duration: 6 * 60 * 60 * 1000, cost: 250000, needAdult: 2, rewardMin: 300000, rewardMax: 900000, attrGain: 4, prestige: 40, heirloomChance: 0.12 },
            { id: 'frontier', name: '边关建功', duration: 8 * 60 * 60 * 1000, cost: 400000, needAdult: 3, rewardMin: 500000, rewardMax: 1500000, attrGain: 5, prestige: 60, heirloomChance: 0.18 }
        ],
        prestigeRanks: [
            { need: 0, name: '寒门', bonus: 0 },
            { need: 50, name: '小族', bonus: 0.03 },
            { need: 150, name: '望族', bonus: 0.06 },
            { need: 400, name: '世家', bonus: 0.10 },
            { need: 900, name: '名门', bonus: 0.15 },
            { need: 1800, name: '郡望', bonus: 0.22 },
            { need: 3500, name: '天下世家', bonus: 0.30 }
        ],
        marriageTiers: [
            { id: 'common', name: '寻常联姻', costMult: 1, inheritBonus: 0, prestige: 5 },
            { id: 'gentry', name: '士绅联姻', costMult: 1.5, inheritBonus: 0.05, prestige: 15, needPrestige: 50 },
            { id: 'noble', name: '名门联姻', costMult: 2.5, inheritBonus: 0.12, prestige: 35, needPrestige: 200 },
            { id: 'royal', name: '贵胄联姻', costMult: 4, inheritBonus: 0.2, prestige: 60, needPrestige: 600 }
        ],
        maxEquippedHeirlooms: 3,
        eventCooldown: 3 * 60 * 60 * 1000
    };

    function cfg() { return window.lineageExtConfig; }

    function ensureLineageExtData() {
        if (!player.children) return;
        var c = player.children;
        if (c.clanPrestige == null) c.clanPrestige = 0;
        if (c.ancestralLevel == null) c.ancestralLevel = 1;
        if (c.ancestralLastOffer == null) c.ancestralLastOffer = 0;
        if (c.ancestralBuffUntil == null) c.ancestralBuffUntil = 0;
        if (!c.businesses) c.businesses = {};
        if (!Array.isArray(c.heirlooms)) c.heirlooms = [];
        if (!Array.isArray(c.equippedHeirlooms)) c.equippedHeirlooms = [];
        if (!c.dailyQuest) c.dailyQuest = { day: '', progress: {}, claimed: {} };
        if (c.lastClanEvent == null) c.lastClanEvent = 0;
        if (!c.activeEvent) c.activeEvent = null;
        if (!c.examCooldowns) c.examCooldowns = {};
        if (!c.expedition) c.expedition = null;
        if (c.branchUnlocked == null) c.branchUnlocked = false;
        if (c.tradeBuffUntil == null) c.tradeBuffUntil = 0;
        if (c.trainDiscountUntil == null) c.trainDiscountUntil = 0;
        if (c.trainDiscountRate == null) c.trainDiscountRate = 0;
        if (c.freeExam == null) c.freeExam = false;
        if (c.tempHappiness == null) c.tempHappiness = 0;
        if (!c.extStats) c.extStats = { trains: 0, collects: 0, interacts: 0, offers: 0, exams: 0, expeditions: 0 };

        // 祖宗十八代：与 marriage.js 同步，禁止降回 4 代
        if (typeof childConfig !== 'undefined' && childConfig.lineage) {
            childConfig.lineage.maxGeneration = 18;
            childConfig.lineage.maxTotalMembers = 180;
            childConfig.lineage.maxPerParent = 3;
            var names = childConfig.lineage.generationNames || (childConfig.lineage.generationNames = {});
            var mults = childConfig.lineage.generationMult || (childConfig.lineage.generationMult = {});
            var nameList = ['子女','孙子','曾孙','玄孙','来孙','晜孙','仍孙','云孙','耳孙','远孙','弥孙','胎孙','灰孙','衍孙','昆孙','裔孙','末孙','终世孙'];
            var multList = [1.0,1.25,1.55,1.9,2.3,2.8,3.4,4.1,5.0,6.0,7.2,8.6,10.2,12.0,14.0,16.5,19.5,23.0];
            for (var gi = 1; gi <= 18; gi++) {
                names[gi] = nameList[gi - 1];
                mults[gi] = multList[gi - 1];
            }
            var extraMs = [
                { id: 'm7', title: '十世其昌', need: 80, bonus: 0.80, desc: '家族成员≥80：全加成+80%' },
                { id: 'm8', title: '十八代传', need: 120, bonus: 1.20, desc: '家族成员≥120：全加成+120%' },
                { id: 'm9', title: '血脉如海', need: 160, bonus: 2.00, desc: '家族成员≥160：全加成+200%' }
            ];
            if (!Array.isArray(childConfig.lineage.milestones)) childConfig.lineage.milestones = [];
            extraMs.forEach(function (m) {
                if (!childConfig.lineage.milestones.some(function (x) { return x.id === m.id; })) {
                    childConfig.lineage.milestones.push(m);
                }
            });
        }

        (c.children || []).forEach(function (m) {
            if (!m.talentId) m.talentId = rollTalentId(true);
            if (m.talentAwakened == null) m.talentAwakened = false;
            if (m.glory == null) m.glory = 0;
            if (m.examWins == null) m.examWins = 0;
            if (m.expeditionCount == null) m.expeditionCount = 0;
            if (m.marriageTier == null && m.isMarried) m.marriageTier = 'common';
        });
        refreshDailyQuestDay();
    }

    function rollTalentId(preferPlain) {
        var list = cfg().talents;
        var total = 0;
        list.forEach(function (t) { total += t.w; });
        var r = Math.random() * total;
        for (var i = 0; i < list.length; i++) {
            r -= list[i].w;
            if (r <= 0) return list[i].id;
        }
        return preferPlain ? 'pingfan' : list[0].id;
    }

    function getTalent(id) {
        return cfg().talents.find(function (t) { return t.id === id; }) || cfg().talents[cfg().talents.length - 1];
    }

    function todayKey() {
        var d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }

    function refreshDailyQuestDay() {
        var dq = player.children.dailyQuest;
        var key = todayKey();
        if (dq.day !== key) {
            dq.day = key;
            dq.progress = {};
            dq.claimed = {};
            cfg().dailyQuests.forEach(function (q) {
                dq.progress[q.id] = 0;
                dq.claimed[q.id] = false;
            });
        }
    }

    function bumpDaily(key, n) {
        ensureLineageExtData();
        refreshDailyQuestDay();
        var dq = player.children.dailyQuest;
        cfg().dailyQuests.forEach(function (q) {
            if (q.key === key) {
                dq.progress[q.id] = (dq.progress[q.id] || 0) + (n || 1);
            }
        });
        if (key === 'train') player.children.extStats.trains++;
        if (key === 'collect') player.children.extStats.collects++;
        if (key === 'interact') player.children.extStats.interacts++;
        if (key === 'offer') player.children.extStats.offers++;
        if (key === 'exam') player.children.extStats.exams++;
    }

    function addClanPrestige(amount) {
        ensureLineageExtData();
        var seal = hasEquippedHeirloom('seal');
        var mult = seal ? 1.2 : 1;
        var gain = Math.floor((amount || 0) * mult);
        player.children.clanPrestige = (player.children.clanPrestige || 0) + gain;
        return gain;
    }

    function getPrestigeRank() {
        var p = player.children.clanPrestige || 0;
        var ranks = cfg().prestigeRanks;
        var cur = ranks[0];
        for (var i = 0; i < ranks.length; i++) {
            if (p >= ranks[i].need) cur = ranks[i];
        }
        return cur;
    }

    function hasEquippedHeirloom(id) {
        return (player.children.equippedHeirlooms || []).indexOf(id) >= 0;
    }

    function getHeirloomBonuses() {
        var gps = 0, click = 0, life = 0, atk = 0;
        (player.children.equippedHeirlooms || []).forEach(function (id) {
            var h = cfg().heirlooms.find(function (x) { return x.id === id; });
            if (!h) return;
            gps += h.gps || 0;
            click += h.click || 0;
            life += h.life || 0;
            atk += h.atk || 0;
        });
        return { gps: gps, click: click, life: life, atk: atk };
    }

    function getTalentContribExtras() {
        var gps = 0, click = 0, life = 0, atk = 0, contrib = 1;
        (player.children.children || []).forEach(function (m) {
            var t = getTalent(m.talentId);
            if (!t) return;
            var awake = m.talentAwakened ? 1.5 : 1;
            if (t.gpsExtra) gps += t.gpsExtra * awake;
            if (t.clickExtra) click += t.clickExtra * awake;
            if (t.lifeExtra) life += t.lifeExtra * awake;
            if (t.atkExtra) atk += t.atkExtra * awake;
            if (t.contribMult && t.contribMult > contrib) contrib = t.contribMult * (m.talentAwakened ? 1.1 : 1);
        });
        return { gps: gps, click: click, life: life, atk: atk, contrib: contrib };
    }

    /** 供 calculateChildBonuses 叠加 */
    window.getLineageExtBonusMult = function () {
        ensureLineageExtData();
        var rank = getPrestigeRank();
        var heir = getHeirloomBonuses();
        var talent = getTalentContribExtras();
        var ancestralBuff = 0;
        if (Date.now() < (player.children.ancestralBuffUntil || 0)) {
            ancestralBuff = (player.children.ancestralLevel || 1) * cfg().ancestral.buffPerLevel;
            if (hasEquippedHeirloom('lamp')) ancestralBuff *= 1.25;
        }
        var branch = player.children.branchUnlocked ? 0.05 : 0;
        var trade = Date.now() < (player.children.tradeBuffUntil || 0) ? 0.08 : 0;
        return {
            global: 1 + (rank.bonus || 0) + ancestralBuff + branch + trade,
            gps: 1 + heir.gps + talent.gps,
            click: 1 + heir.click + talent.click,
            life: 1 + heir.life + talent.life,
            atk: 1 + heir.atk + talent.atk,
            contrib: talent.contrib || 1
        };
    };

    window.applyLineageTalentOnTrain = function (child, effectAttr, baseGain) {
        var t = getTalent(child.talentId);
        var gain = baseGain || 1;
        if (t.onTrainBonus) gain += t.onTrainBonus * (child.talentAwakened ? 2 : 1);
        if (t.attrBoost === effectAttr && t.attrMult) {
            gain = Math.max(1, Math.floor(gain * t.attrMult * (child.talentAwakened ? 1.25 : 1)));
        }
        bumpDaily('train', 1);
        if (typeof addLineageExp === 'function') addLineageExp(1);
        return gain;
    };

    window.onLineageInteractHook = function (child) {
        bumpDaily('interact', 1);
        var t = getTalent(child.talentId);
        var bonusChance = 0.1 + (t.interactBonus || 0) + (child.talentAwakened ? 0.1 : 0);
        return Math.random() < bonusChance;
    };

    window.onLineageCollectHook = function () {
        bumpDaily('collect', 1);
    };

    window.assignLineageTalentToNewborn = function (child) {
        child.talentId = rollTalentId(false);
        child.talentAwakened = false;
        child.glory = 0;
        child.examWins = 0;
        child.expeditionCount = 0;
        var t = getTalent(child.talentId);
        if (t && t.rarity !== '普通') {
            logAction(child.name + ' 天生命格【' + t.name + '】（' + t.rarity + '）！', 'success');
            addClanPrestige(t.rarity === '传说' ? 30 : (t.rarity === '史诗' ? 15 : 5));
        }
    };

    // ——— UI 刷新 ———
    window.updateLineageExtUI = function () {
        if (!document.getElementById('childSystemUI')) return;
        ensureLineageExtData();
        var t = typeof getChildActiveTab === 'function' ? getChildActiveTab() : ((typeof _childActiveTab !== 'undefined' && _childActiveTab) || '');
        var all = !!window.__lineageForceFullRefresh || !t;
        if (all || t === 'talent') updateTalentPanel();
        if (all || t === 'business') updateBusinessPanel();
        if (all || t === 'ancestral') updateAncestralPanel();
        if (all || t === 'quests') updateDailyQuestPanel();
        if (all || t === 'events') updateClanEventPanel();
        if (all || t === 'life' || t === 'ancestral') updateHeirloomPanel();
        if (all || t === 'quests' || t === 'events') updateExamPanel();
        if (all || t === 'quests' || t === 'glory') updateExpeditionPanel();
        if (all || t === 'glory') updateGloryPanel();
    };

    function updateTalentPanel() {
        var el = document.getElementById('lineageTalentList');
        if (!el) return;
        var members = player.children.children || [];
        if (!members.length) {
            el.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#C9A0B8;padding:16px;">尚无成员命格</div>';
            return;
        }
        el.innerHTML = '';
        members.forEach(function (m, idx) {
            var t = getTalent(m.talentId);
            var card = document.createElement('div');
            card.className = 'c-member gen-' + (m.generation || 1);
            card.innerHTML =
                '<span class="c-badge gen" style="color:' + t.color + ';border-color:' + t.color + ';">' + t.rarity + '</span>' +
                '<div class="name">' + m.name + '</div>' +
                '<div class="meta">' + getGenerationLabel(m.generation || 1) + ' · 命格 <b style="color:' + t.color + ';">' + t.name + '</b>' +
                (m.talentAwakened ? ' · 已觉醒' : '') + '</div>' +
                '<div class="c-hint">' + t.desc + '</div>' +
                (!m.talentAwakened
                    ? '<button class="c-btn c-btn-sm c-btn-gold" style="width:100%;margin-top:8px;" onclick="awakenChildTalent(' + idx + ')">觉醒（' + cfg().awakenCost + ' · ' + (cfg().awakenChance * 100) + '%）</button>'
                    : '<div style="color:#FFD700;font-size:11px;margin-top:6px;">命格已觉醒，效果增强</div>');
            el.appendChild(card);
        });
    }

    window.awakenChildTalent = function (index) {
        ensureLineageExtData();
        var child = player.children.children[index];
        if (!child) return;
        if (child.talentAwakened) {
            logAction('已觉醒', 'info');
            return;
        }
        if (player.investmentGame.userData.availableFunds < cfg().awakenCost) {
            logAction('资金不足', 'error');
            return;
        }
        player.investmentGame.userData.availableFunds -= cfg().awakenCost;
        if (Math.random() < cfg().awakenChance) {
            child.talentAwakened = true;
            // 平凡觉醒时升级为随机优秀+
            if (child.talentId === 'pingfan') {
                var better = cfg().talents.filter(function (t) { return !t.plain; });
                child.talentId = better[Math.floor(Math.random() * better.length)].id;
            }
            addClanPrestige(20);
            if (typeof addLineageExp === 'function') addLineageExp(20);
            logAction(child.name + ' 命格觉醒成功！现为【' + getTalent(child.talentId).name + '】', 'success');
        } else {
            logAction(child.name + ' 觉醒失败，再接再厉', 'info');
        }
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    };

    function updateBusinessPanel() {
        var el = document.getElementById('lineageBusinessList');
        var sum = document.getElementById('lineageBusinessSummary');
        if (!el) return;
        ensureLineageExtData();
        var pending = calcAllBusinessIncome();
        if (sum) {
            sum.innerHTML = '<div class="c-bonus-grid">' +
                '<div class="c-bonus-item"><div class="lab">待收产业收入</div><div class="val">' + formatSci(pending) + '</div></div>' +
                '<div class="c-bonus-item"><div class="lab">已开产业</div><div class="val">' + Object.keys(player.children.businesses).length + '/' + cfg().businesses.length + '</div></div></div>' +
                '<button class="c-btn c-btn-green" style="width:100%;margin-top:8px;" onclick="collectClanBusinessIncome()">一键收取产业</button>';
        }
        el.innerHTML = '';
        cfg().businesses.forEach(function (b) {
            var owned = player.children.businesses[b.id];
            var card = document.createElement('div');
            card.className = 'c-train-card';
            var mgr = owned && owned.managerId ? getChildById(owned.managerId) : null;
            var html = '<div style="font-weight:bold;color:#FFD700;">' + b.name + '</div><div class="c-hint">' + b.desc + '</div>';
            if (!owned) {
                html += '<div style="font-size:11px;color:#FFB6C1;margin:6px 0;">开办 ' + formatSci(b.cost) + '</div>';
                html += '<button class="c-btn c-btn-pink" style="width:100%;" onclick="openClanBusiness(\'' + b.id + '\')">开办产业</button>';
            } else {
                var hourly = getBusinessHourly(b, mgr);
                html += '<div style="font-size:11px;color:#4CAF50;">时薪约 ' + formatSci(hourly) + '</div>';
                html += '<div class="c-hint">掌柜：' + (mgr ? mgr.name : '未任命') + '</div>';
                html += '<select class="c-input" id="bizMgr_' + b.id + '" style="width:100%;min-width:0;margin:6px 0;">' + buildAdultOptions(owned.managerId) + '</select>';
                html += '<button class="c-btn c-btn-sm c-btn-blue" style="width:100%;" onclick="assignBusinessManager(\'' + b.id + '\')">任命掌柜</button>';
            }
            card.innerHTML = html;
            el.appendChild(card);
        });
    }

    function buildAdultOptions(selectedId) {
        var adults = (player.children.children || []).filter(isFamilyMemberAdult);
        var html = '<option value="">-- 选择成年成员 --</option>';
        adults.forEach(function (a) {
            html += '<option value="' + a.id + '"' + (a.id === selectedId ? ' selected' : '') + '>' + a.name + '（' + getGenerationLabel(a.generation || 1) + '）</option>';
        });
        return html;
    }

    function getBusinessHourly(b, mgr) {
        var base = b.incomePerHour;
        if (!mgr) return Math.floor(base * 0.5);
        var attr = (mgr.attributes && mgr.attributes[b.needAttr]) || 1;
        var rank = getPrestigeRank().bonus || 0;
        var trade = Date.now() < (player.children.tradeBuffUntil || 0) ? 1.2 : 1;
        return Math.floor(base * (1 + attr * 0.08) * (1 + rank) * trade);
    }

    function calcAllBusinessIncome() {
        var total = 0;
        var now = Date.now();
        Object.keys(player.children.businesses || {}).forEach(function (id) {
            var owned = player.children.businesses[id];
            var b = cfg().businesses.find(function (x) { return x.id === id; });
            if (!owned || !b) return;
            var mgr = owned.managerId ? getChildById(owned.managerId) : null;
            var hours = Math.max(0, (now - (owned.lastCollect || owned.startTime || now)) / 3600000);
            total += Math.floor(hours * getBusinessHourly(b, mgr));
        });
        return total;
    }

    window.openClanBusiness = function (bizId) {
        ensureLineageExtData();
        var b = cfg().businesses.find(function (x) { return x.id === bizId; });
        if (!b || player.children.businesses[bizId]) return;
        if (player.investmentGame.userData.availableFunds < b.cost) {
            logAction('资金不足', 'error');
            return;
        }
        player.investmentGame.userData.availableFunds -= b.cost;
        player.children.businesses[bizId] = { startTime: Date.now(), lastCollect: Date.now(), managerId: null };
        addClanPrestige(10);
        logAction('开办了家族产业：' + b.name, 'success');
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    };

    window.assignBusinessManager = function (bizId) {
        var sel = document.getElementById('bizMgr_' + bizId);
        if (!sel || !player.children.businesses[bizId]) return;
        var id = sel.value;
        if (!id) {
            logAction('请选择掌柜', 'error');
            return;
        }
        // 同一人不能管多家
        Object.keys(player.children.businesses).forEach(function (k) {
            if (player.children.businesses[k].managerId === id) player.children.businesses[k].managerId = null;
        });
        player.children.businesses[bizId].managerId = id;
        var m = getChildById(id);
        logAction('任命 ' + (m ? m.name : '') + ' 为掌柜', 'success');
        updateChildSystemUI();
        saveGame();
    };

    window.collectClanBusinessIncome = function () {
        ensureLineageExtData();
        var total = 0;
        var now = Date.now();
        Object.keys(player.children.businesses || {}).forEach(function (id) {
            var owned = player.children.businesses[id];
            var b = cfg().businesses.find(function (x) { return x.id === id; });
            if (!owned || !b) return;
            var mgr = owned.managerId ? getChildById(owned.managerId) : null;
            var hours = Math.max(0, (now - (owned.lastCollect || owned.startTime || now)) / 3600000);
            var income = Math.floor(hours * getBusinessHourly(b, mgr));
            if (income > 0) {
                total += income;
                owned.lastCollect = now;
            }
        });
        if (total <= 0) {
            logAction('暂无产业收入', 'info');
            return;
        }
        player.investmentGame.userData.availableFunds += total;
        bumpDaily('collect', 1);
        addClanPrestige(Math.min(30, Math.floor(total / 100000)));
        logAction('收取家族产业收入 ' + formatSci(total) + ' 元', 'success');
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    };

    function updateAncestralPanel() {
        var el = document.getElementById('lineageAncestralPanel');
        if (!el) return;
        ensureLineageExtData();
        var lv = player.children.ancestralLevel || 1;
        var maxLv = cfg().ancestral.upgradeCosts.length - 1;
        var nextCost = lv < maxLv ? cfg().ancestral.upgradeCosts[lv + 1] : null;
        var cd = Math.max(0, cfg().ancestral.offerCooldown - (Date.now() - (player.children.ancestralLastOffer || 0)));
        var buffLeft = Math.max(0, (player.children.ancestralBuffUntil || 0) - Date.now());
        var buffPct = ((lv * cfg().ancestral.buffPerLevel) * (hasEquippedHeirloom('lamp') ? 1.25 : 1) * 100).toFixed(1);
        el.innerHTML =
            '<div class="c-bonus-grid">' +
            '<div class="c-bonus-item"><div class="lab">宗祠等级</div><div class="val">Lv.' + lv + '</div></div>' +
            '<div class="c-bonus-item"><div class="lab">祭祖加成</div><div class="val">+' + buffPct + '%</div></div>' +
            '<div class="c-bonus-item"><div class="lab">buff剩余</div><div class="val">' + (buffLeft > 0 ? Math.ceil(buffLeft / 60000) + '分' : '无') + '</div></div>' +
            '<div class="c-bonus-item"><div class="lab">冷却</div><div class="val">' + (cd > 0 ? Math.ceil(cd / 60000) + '分' : '可祭祖') + '</div></div></div>' +
            '<p class="c-hint">祭祖可获持续家族全加成；升级宗祠提升效果。传家宝「长明祠灯」增强祭祖。</p>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">' +
            '<button class="c-btn c-btn-pink" style="flex:1;" onclick="performAncestralOffer()" ' + (cd > 0 ? 'disabled' : '') + '>祭祖（' + cfg().ancestral.offerCost + '）</button>' +
            (nextCost != null
                ? '<button class="c-btn c-btn-gold" style="flex:1;" onclick="upgradeAncestralHall()">升级宗祠（' + formatSci(nextCost) + '）</button>'
                : '<button class="c-btn" style="flex:1;" disabled>宗祠已满级</button>') +
            '</div>';
    }

    window.performAncestralOffer = function () {
        ensureLineageExtData();
        var now = Date.now();
        if (now - (player.children.ancestralLastOffer || 0) < cfg().ancestral.offerCooldown) {
            logAction('祭祖冷却中', 'error');
            return;
        }
        if (player.investmentGame.userData.availableFunds < cfg().ancestral.offerCost) {
            logAction('资金不足', 'error');
            return;
        }
        player.investmentGame.userData.availableFunds -= cfg().ancestral.offerCost;
        player.children.ancestralLastOffer = now;
        player.children.ancestralBuffUntil = now + cfg().ancestral.buffDuration;
        bumpDaily('offer', 1);
        addClanPrestige(12);
        if (typeof addLineageExp === 'function') addLineageExp(8);
        logAction('祭祖完成！家族加成已激活', 'success');
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    };

    window.upgradeAncestralHall = function () {
        ensureLineageExtData();
        var lv = player.children.ancestralLevel || 1;
        var maxLv = cfg().ancestral.upgradeCosts.length - 1;
        if (lv >= maxLv) return;
        var cost = cfg().ancestral.upgradeCosts[lv + 1];
        if (player.investmentGame.userData.availableFunds < cost) {
            logAction('资金不足', 'error');
            return;
        }
        player.investmentGame.userData.availableFunds -= cost;
        player.children.ancestralLevel = lv + 1;
        addClanPrestige(25);
        logAction('宗祠升级至 Lv.' + player.children.ancestralLevel, 'success');
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    };

    function updateDailyQuestPanel() {
        var el = document.getElementById('lineageDailyQuestList');
        if (!el) return;
        ensureLineageExtData();
        refreshDailyQuestDay();
        var dq = player.children.dailyQuest;
        el.innerHTML = cfg().dailyQuests.map(function (q) {
            var prog = dq.progress[q.id] || 0;
            var done = prog >= q.need;
            var claimed = !!dq.claimed[q.id];
            var rewardBits = [];
            if (q.rewardPrestige) rewardBits.push('声望' + q.rewardPrestige);
            if (q.rewardExp) rewardBits.push('传承经验' + q.rewardExp);
            return '<div class="c-milestone' + (claimed ? ' done' : '') + '">' +
                '<div><div class="ms-title">' + q.name + '</div><div class="ms-desc">' + q.desc +
                (rewardBits.length ? (' · 奖励' + rewardBits.join(' / ')) : '') + '</div></div>' +
                '<div>' + Math.min(prog, q.need) + '/' + q.need +
                (claimed ? ' ✓' : (done ? ' <button class="c-btn c-btn-sm c-btn-gold" onclick="claimLineageDailyQuest(\'' + q.id + '\')">领取</button>' : '')) +
                '</div></div>';
        }).join('');
    }

    window.claimLineageDailyQuest = function (qid) {
        ensureLineageExtData();
        refreshDailyQuestDay();
        var q = cfg().dailyQuests.find(function (x) { return x.id === qid; });
        var dq = player.children.dailyQuest;
        if (!q || dq.claimed[qid]) return;
        if ((dq.progress[qid] || 0) < q.need) {
            logAction('任务未完成', 'error');
            return;
        }
        dq.claimed[qid] = true;
        // 家族日常不再发放资金，仅声望与传承经验
        addClanPrestige(q.rewardPrestige);
        if (typeof addLineageExp === 'function') addLineageExp(q.rewardExp);
        logAction('领取日常【' + q.name + '】', 'success');
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    };

    function updateClanEventPanel() {
        var el = document.getElementById('lineageEventPanel');
        if (!el) return;
        ensureLineageExtData();
        var ev = player.children.activeEvent;
        var cd = Math.max(0, cfg().eventCooldown - (Date.now() - (player.children.lastClanEvent || 0)));
        if (!ev) {
            el.innerHTML =
                '<p class="c-hint">家族不时会发生奇遇与抉择，影响声望、传家宝与产业。</p>' +
                '<button class="c-btn c-btn-pink" style="width:100%;" onclick="triggerClanEvent(true)" ' +
                (cd > 0 ? 'disabled' : '') + '>' +
                (cd > 0 ? ('冷却中 ' + Math.ceil(cd / 60000) + ' 分') : '寻访族中轶事') + '</button>';
            return;
        }
        var conf = cfg().events.find(function (x) { return x.id === ev.id; });
        if (!conf) {
            player.children.activeEvent = null;
            updateClanEventPanel();
            return;
        }
        var html = '<div style="font-weight:bold;color:#FFB6C1;margin-bottom:8px;">' + conf.title + '</div>' +
            '<p class="c-hint" style="margin-top:0;">' + conf.text + '</p>';
        conf.choices.forEach(function (ch, i) {
            html += '<button class="c-btn c-btn-blue" style="width:100%;margin-top:6px;text-align:left;" onclick="resolveClanEvent(' + i + ')">' +
                ch.label + (ch.cost ? '（耗资 ' + formatSci(ch.cost) + '）' : '') + '</button>';
        });
        el.innerHTML = html;
    }

    window.triggerClanEvent = function (manual) {
        ensureLineageExtData();
        if (player.children.activeEvent) {
            updateClanEventPanel();
            return;
        }
        var now = Date.now();
        if (manual && now - (player.children.lastClanEvent || 0) < cfg().eventCooldown) {
            logAction('轶事冷却中', 'error');
            return;
        }
        if (!manual && Math.random() > 0.08) return;
        var list = cfg().events;
        var pick = list[Math.floor(Math.random() * list.length)];
        player.children.activeEvent = { id: pick.id };
        if (manual) player.children.lastClanEvent = now;
        logAction('家族轶事：' + pick.title, 'info');
        if (document.getElementById('childSystemUI') && document.getElementById('childSystemUI').style.display === 'block') {
            switchChildTab('events');
            updateClanEventPanel();
        }
        saveGame();
    };

    window.resolveClanEvent = function (choiceIndex) {
        ensureLineageExtData();
        var ev = player.children.activeEvent;
        if (!ev) return;
        var conf = cfg().events.find(function (x) { return x.id === ev.id; });
        if (!conf) return;
        var ch = conf.choices[choiceIndex];
        if (!ch) return;
        if (ch.cost && player.investmentGame.userData.availableFunds < ch.cost) {
            logAction('资金不足', 'error');
            return;
        }
        if (ch.cost) player.investmentGame.userData.availableFunds -= ch.cost;
        applyEventEffect(ch);
        if (ch.prestige) addClanPrestige(ch.prestige);
        player.children.activeEvent = null;
        player.children.lastClanEvent = Date.now();
        logAction('已抉择：' + ch.label, 'success');
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    };

    function applyEventEffect(ch) {
        var members = player.children.children || [];
        var effect = ch.effect;
        if (effect === 'boostRandomAttr' || effect === 'smallBoost' || effect === 'healBoost' || effect === 'boostTop') {
            var targets = members.slice();
            if (effect === 'boostTop') {
                targets.sort(function (a, b) {
                    var sa = Object.values(a.attributes || {}).reduce(function (x, y) { return x + y; }, 0);
                    var sb = Object.values(b.attributes || {}).reduce(function (x, y) { return x + y; }, 0);
                    return sb - sa;
                });
                targets = targets.slice(0, 3);
            } else if (targets.length) {
                targets = [targets[Math.floor(Math.random() * targets.length)]];
            }
            targets.forEach(function (m) {
                ensureChildAttributes(m);
                Object.keys(m.attributes).forEach(function (k) {
                    m.attributes[k] += ch.amount || 1;
                });
            });
        } else if (effect === 'happiness') {
            player.children.tempHappiness = (player.children.tempHappiness || 0) + (ch.amount || 10);
        } else if (effect === 'prestige') {
            addClanPrestige(ch.amount || 10);
        } else if (effect === 'unlockBranch') {
            player.children.branchUnlocked = true;
            logAction('分家立业！家族获得常驻 +5% 加成', 'success');
        } else if (effect === 'trainDiscount') {
            player.children.trainDiscountUntil = Date.now() + DAY_MS;
            player.children.trainDiscountRate = ch.amount || 0.1;
        } else if (effect === 'tradeBuff') {
            player.children.tradeBuffUntil = Date.now() + 2 * DAY_MS;
        } else if (effect === 'funds') {
            player.investmentGame.userData.availableFunds += ch.amount || 0;
        } else if (effect === 'gainHeirloom') {
            grantRandomHeirloom();
        } else if (effect === 'ancestralExp') {
            var maxLv = cfg().ancestral.upgradeCosts.length - 1;
            if ((player.children.ancestralLevel || 1) < maxLv) {
                player.children.ancestralLevel++;
                logAction('宗祠因供奉古物提升一级！', 'success');
            } else {
                addClanPrestige(30);
            }
        } else if (effect === 'offerReady') {
            player.children.ancestralLastOffer = 0;
        } else if (effect === 'freeExam') {
            player.children.freeExam = true;
        }
    }

    function grantRandomHeirloom() {
        ensureLineageExtData();
        var owned = player.children.heirlooms || [];
        var pool = cfg().heirlooms.filter(function (h) { return owned.indexOf(h.id) < 0; });
        if (!pool.length) {
            addClanPrestige(20);
            logAction('传家宝已集齐，转化为声望', 'info');
            return null;
        }
        var h = pool[Math.floor(Math.random() * pool.length)];
        owned.push(h.id);
        player.children.heirlooms = owned;
        logAction('获得传家宝：' + h.name + '！', 'success');
        return h;
    }

    function updateHeirloomPanel() {
        var el = document.getElementById('lineageHeirloomList');
        if (!el) return;
        ensureLineageExtData();
        var owned = player.children.heirlooms || [];
        var eq = player.children.equippedHeirlooms || [];
        if (!owned.length) {
            el.innerHTML = '<div style="text-align:center;color:#C9A0B8;padding:12px;">尚无传家宝 · 可通过轶事/远征获得</div>';
            return;
        }
        el.innerHTML = '<p class="c-hint">最多装备 ' + cfg().maxEquippedHeirlooms + ' 件（已装 ' + eq.length + '）</p>';
        cfg().heirlooms.forEach(function (h) {
            if (owned.indexOf(h.id) < 0) return;
            var on = eq.indexOf(h.id) >= 0;
            el.innerHTML += '<div class="c-milestone' + (on ? ' done' : '') + '">' +
                '<div><div class="ms-title">' + h.name + '</div><div class="ms-desc">' + h.desc + '</div></div>' +
                '<button class="c-btn c-btn-sm ' + (on ? 'c-btn-orange' : 'c-btn-gold') + '" onclick="toggleHeirloom(\'' + h.id + '\')">' +
                (on ? '卸下' : '装备') + '</button></div>';
        });
    }

    window.toggleHeirloom = function (id) {
        ensureLineageExtData();
        var eq = player.children.equippedHeirlooms || [];
        var i = eq.indexOf(id);
        if (i >= 0) {
            eq.splice(i, 1);
            logAction('已卸下传家宝', 'info');
        } else {
            if (eq.length >= cfg().maxEquippedHeirlooms) {
                logAction('装备栏已满', 'error');
                return;
            }
            if ((player.children.heirlooms || []).indexOf(id) < 0) return;
            eq.push(id);
            logAction('已装备传家宝', 'success');
        }
        player.children.equippedHeirlooms = eq;
        updateChildSystemUI();
        saveGame();
    };

    function updateExamPanel() {
        var el = document.getElementById('lineageExamList');
        if (!el) return;
        ensureLineageExtData();
        el.innerHTML = '';
        cfg().examTypes.forEach(function (ex) {
            var cdLeft = Math.max(0, (player.children.examCooldowns[ex.id] || 0) - Date.now());
            var card = document.createElement('div');
            card.className = 'c-train-card';
            card.innerHTML =
                '<div style="font-weight:bold;color:#87CEEB;">' + ex.name + '</div>' +
                '<div class="c-hint">比拼属性：' + getAttributeDisplayName(ex.attr) + ' · 消耗 ' + formatSci(ex.cost) + '</div>' +
                '<select class="c-input" id="examPick_' + ex.id + '" style="width:100%;min-width:0;margin:6px 0;">' + buildAdultOptions(null) + '</select>' +
                '<button class="c-btn c-btn-purple" style="width:100%;" onclick="runClanExam(\'' + ex.id + '\')" ' +
                (cdLeft > 0 ? 'disabled' : '') + '>' +
                (cdLeft > 0 ? ('冷却 ' + Math.ceil(cdLeft / 60000) + '分') : (player.children.freeExam ? '免费赴考' : '赴考')) + '</button>';
            el.appendChild(card);
        });
    }

    window.runClanExam = function (examId) {
        ensureLineageExtData();
        var ex = cfg().examTypes.find(function (x) { return x.id === examId; });
        if (!ex) return;
        if ((player.children.examCooldowns[examId] || 0) > Date.now()) {
            logAction('该比试冷却中', 'error');
            return;
        }
        var sel = document.getElementById('examPick_' + examId);
        var mid = sel && sel.value;
        var member = getChildById(mid);
        if (!member || !isFamilyMemberAdult(member)) {
            logAction('请选择成年应考成员', 'error');
            return;
        }
        var free = !!player.children.freeExam;
        if (!free && player.investmentGame.userData.availableFunds < ex.cost) {
            logAction('资金不足', 'error');
            return;
        }
        if (!free) player.investmentGame.userData.availableFunds -= ex.cost;
        else player.children.freeExam = false;

        var score = (member.attributes[ex.attr] || 1) + Math.floor(Math.random() * 20);
        var rival = 15 + Math.floor(Math.random() * (25 + (member.generation || 1) * 5));
        var win = score >= rival;
        player.children.examCooldowns[examId] = Date.now() + ex.cd;
        bumpDaily('exam', 1);

        if (win) {
            var reward = Math.floor(ex.rewardBase * (1 + (member.attributes[ex.attr] || 1) * 0.05));
            player.investmentGame.userData.availableFunds += reward;
            member.attributes[ex.attr] = (member.attributes[ex.attr] || 1) + 2;
            member.examWins = (member.examWins || 0) + 1;
            member.glory = (member.glory || 0) + 10;
            addClanPrestige(ex.prestige);
            if (typeof addLineageExp === 'function') addLineageExp(12);
            logAction(member.name + ' 在【' + ex.name + '】中胜出！获得 ' + formatSci(reward) + ' 与属性提升', 'success');
            if (Math.random() < 0.08) grantRandomHeirloom();
        } else {
            member.attributes[ex.attr] = (member.attributes[ex.attr] || 1) + 1;
            addClanPrestige(5);
            logAction(member.name + ' 惜败于【' + ex.name + '】，仍有收获（属性+1）', 'info');
        }
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    };

    function updateExpeditionPanel() {
        var el = document.getElementById('lineageExpeditionPanel');
        if (!el) return;
        ensureLineageExtData();
        var exp = player.children.expedition;
        if (exp) {
            var left = Math.max(0, exp.endTime - Date.now());
            var conf = cfg().expeditions.find(function (x) { return x.id === exp.id; });
            if (left <= 0) {
                el.innerHTML = '<div style="color:#4CAF50;font-weight:bold;">远征归来！</div>' +
                    '<button class="c-btn c-btn-green" style="width:100%;margin-top:8px;" onclick="claimClanExpedition()">领取远征收获</button>';
                return;
            }
            el.innerHTML = '<div class="c-hint">【' + (conf ? conf.name : '') + '】进行中</div>' +
                '<div class="c-progress"><i style="width:' + (100 - left / (conf.duration) * 100) + '%"></i><span>剩余 ' +
                Math.ceil(left / 60000) + ' 分</span></div>' +
                '<div class="meta">出征：' + (exp.memberNames || []).join('、') + '</div>';
            return;
        }
        el.innerHTML = '<p class="c-hint">派遣成年子孙外出历练，可获资金、属性、声望，甚至传家宝。</p>';
        cfg().expeditions.forEach(function (ex) {
            el.innerHTML += '<div class="c-milestone"><div><div class="ms-title">' + ex.name + '</div>' +
                '<div class="ms-desc">需 ' + ex.needAdult + ' 名成年 · ' + (ex.duration / 3600000) + ' 小时 · 耗资 ' + formatSci(ex.cost) + '</div></div>' +
                '<button class="c-btn c-btn-sm c-btn-orange" onclick="startClanExpedition(\'' + ex.id + '\')">出征</button></div>';
        });
    }

    window.startClanExpedition = function (expId) {
        ensureLineageExtData();
        if (player.children.expedition) {
            logAction('已有远征在进行', 'error');
            return;
        }
        var ex = cfg().expeditions.find(function (x) { return x.id === expId; });
        if (!ex) return;
        var adults = (player.children.children || []).filter(isFamilyMemberAdult);
        if (adults.length < ex.needAdult) {
            logAction('成年成员不足 ' + ex.needAdult + ' 人', 'error');
            return;
        }
        if (player.investmentGame.userData.availableFunds < ex.cost) {
            logAction('资金不足', 'error');
            return;
        }
        // 选属性总和最高的若干人
        adults.sort(function (a, b) {
            var sa = Object.values(a.attributes || {}).reduce(function (x, y) { return x + y; }, 0);
            var sb = Object.values(b.attributes || {}).reduce(function (x, y) { return x + y; }, 0);
            return sb - sa;
        });
        var team = adults.slice(0, ex.needAdult);
        player.investmentGame.userData.availableFunds -= ex.cost;
        player.children.expedition = {
            id: ex.id,
            endTime: Date.now() + ex.duration,
            memberIds: team.map(function (t) { return t.id; }),
            memberNames: team.map(function (t) { return t.name; })
        };
        logAction(team.map(function (t) { return t.name; }).join('、') + ' 出征【' + ex.name + '】', 'success');
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    };

    window.claimClanExpedition = function () {
        ensureLineageExtData();
        var exp = player.children.expedition;
        if (!exp || exp.endTime > Date.now()) {
            logAction('远征尚未归来', 'error');
            return;
        }
        var ex = cfg().expeditions.find(function (x) { return x.id === exp.id; });
        if (!ex) {
            player.children.expedition = null;
            return;
        }
        var reward = Math.floor(ex.rewardMin + Math.random() * (ex.rewardMax - ex.rewardMin));
        player.investmentGame.userData.availableFunds += reward;
        (exp.memberIds || []).forEach(function (id) {
            var m = getChildById(id);
            if (!m) return;
            ensureChildAttributes(m);
            Object.keys(m.attributes).forEach(function (k) {
                m.attributes[k] += ex.attrGain;
            });
            m.expeditionCount = (m.expeditionCount || 0) + 1;
            m.glory = (m.glory || 0) + 8;
        });
        addClanPrestige(ex.prestige);
        player.children.extStats.expeditions++;
        if (typeof addLineageExp === 'function') addLineageExp(15);
        if (ex.heirloomChance && Math.random() < ex.heirloomChance) grantRandomHeirloom();
        player.children.expedition = null;
        logAction('远征归来！获得 ' + formatSci(reward) + ' 资金，队员属性提升', 'success');
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    };

    function updateGloryPanel() {
        var el = document.getElementById('lineageGloryPanel');
        if (!el) return;
        ensureLineageExtData();
        var rank = getPrestigeRank();
        var p = player.children.clanPrestige || 0;
        var next = null;
        for (var i = 0; i < cfg().prestigeRanks.length; i++) {
            if (cfg().prestigeRanks[i].need > p) { next = cfg().prestigeRanks[i]; break; }
        }
        var members = (player.children.children || []).slice().sort(function (a, b) {
            return (b.glory || 0) - (a.glory || 0);
        }).slice(0, 8);

        el.innerHTML =
            '<div class="c-bonus-grid">' +
            '<div class="c-bonus-item"><div class="lab">家族声望</div><div class="val">' + p + '</div></div>' +
            '<div class="c-bonus-item"><div class="lab">门第</div><div class="val">' + rank.name + '</div></div>' +
            '<div class="c-bonus-item"><div class="lab">门第加成</div><div class="val">+' + ((rank.bonus || 0) * 100).toFixed(0) + '%</div></div>' +
            '<div class="c-bonus-item"><div class="lab">下一档</div><div class="val">' + (next ? (next.name + ' @' + next.need) : '已至巅峰') + '</div></div></div>' +
            (player.children.branchUnlocked ? '<p class="c-hint" style="color:#4CAF50;">已分家立业：常驻 +5%</p>' : '<p class="c-hint">可通过轶事「分家争执」解锁分家立业</p>') +
            '<h3 style="margin-top:14px;font-size:14px;color:#FFB6C1;">荣耀榜</h3>' +
            (members.length ? members.map(function (m, i) {
                return '<div class="c-info-row" style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;">' +
                    '<span>#' + (i + 1) + ' ' + m.name + '（' + getGenerationLabel(m.generation || 1) + '）</span>' +
                    '<span style="color:#FFD700;">荣耀 ' + (m.glory || 0) + ' · 科举胜 ' + (m.examWins || 0) + '</span></div>';
            }).join('') : '<div class="c-hint">暂无荣耀记录</div>');
    }

    // 名门联姻扩展（覆盖简单成婚入口的增强版）
    window.arrangeMarriageTiered = function (childIndex, tierId) {
        ensureLineageExtData();
        var child = player.children.children[childIndex];
        if (!child || !isFamilyMemberAdult(child)) {
            logAction('只有成年成员才能结婚', 'error');
            return;
        }
        if (child.isMarried) {
            logAction(child.name + ' 已经成婚', 'error');
            return;
        }
        if ((child.generation || 1) >= childConfig.lineage.maxGeneration) {
            logAction('终世孙一代已达上限，无法继续成婚传宗', 'error');
            return;
        }
        var tier = cfg().marriageTiers.find(function (t) { return t.id === tierId; }) || cfg().marriageTiers[0];
        if (tier.needPrestige && (player.children.clanPrestige || 0) < tier.needPrestige) {
            logAction('家族声望不足（需 ' + tier.needPrestige + '）', 'error');
            return;
        }
        var cost = Math.floor(childConfig.lineage.marriageCost * tier.costMult);
        if (player.investmentGame.userData.availableFunds < cost) {
            logAction('资金不足！需要 ' + formatSci(cost), 'error');
            return;
        }
        showCustomConfirm('为 ' + child.name + ' 进行【' + tier.name + '】？消耗 ' + formatSci(cost) +
            '\n继承天赋加成 +' + ((tier.inheritBonus || 0) * 100).toFixed(0) + '%', function (ok) {
            if (!ok) return;
            player.investmentGame.userData.availableFunds -= cost;
            child.isMarried = true;
            child.marriageDate = Date.now();
            child.marriageTier = tier.id;
            child.inheritBonus = tier.inheritBonus || 0;
            var spouseGender = child.gender === 'boy' ? 'girl' : 'boy';
            var names = {
                boy: ['子墨', '景行', '承泽', '怀瑾', '云深', '伯言', '季川'],
                girl: ['清和', '晚晴', '疏影', '念安', '如雪', '听澜', '芝兰']
            };
            if (tier.id === 'noble' || tier.id === 'royal') {
                names.boy = ['世子·恒', '公子·渊', '侯爷·远', '少君·澈'];
                names.girl = ['郡主·瑶', '千金·璇', '小姐·婉', '贵女·清'];
            }
            child.spouse = {
                name: names[spouseGender][Math.floor(Math.random() * names[spouseGender].length)],
                gender: spouseGender,
                tier: tier.id
            };
            addClanPrestige(tier.prestige);
            if (typeof addLineageExp === 'function') addLineageExp(15 + Math.floor(tier.prestige / 2));
            logAction(child.name + ' 【' + tier.name + '】成功，配偶：' + child.spouse.name, 'success');
            updateDisplay();
            updateChildSystemUI();
            saveGame();
        });
    };

    // 增强传宗列表中的成婚按钮（由 updateLineageActionList 之后补丁调用）
    window.enhanceLineageMarriageUI = function () {
        // 在传宗卡片中注入联姻档位——若容器存在则附加说明区
        var box = document.getElementById('lineageMarriageTiersHint');
        if (!box) return;
        var p = player.children.clanPrestige || 0;
        box.innerHTML = '<p class="c-hint">联姻档位随声望解锁。子嗣页/传宗页成年未婚成员可点「安排成婚」后选择档位。</p>' +
            cfg().marriageTiers.map(function (t) {
                var locked = t.needPrestige && p < t.needPrestige;
                return '<div class="c-milestone' + (locked ? '' : ' done') + '"><div><div class="ms-title">' + t.name +
                    '</div><div class="ms-desc">费用×' + t.costMult + ' · 继承+' + ((t.inheritBonus || 0) * 100).toFixed(0) +
                    '% · 声望+' + t.prestige + (t.needPrestige ? ' · 需声望' + t.needPrestige : '') +
                    '</div></div><div>' + (locked ? '未解锁' : '已解锁') + '</div></div>';
            }).join('');
    };

    // 覆盖 arrangeMarriage 为弹出档位选择
    var _origArrangeMarriage = window.arrangeMarriage;
    window.arrangeMarriage = function (childIndex) {
        ensureLineageExtData();
        var child = player.children.children[childIndex];
        if (!child || !isFamilyMemberAdult(child) || child.isMarried) {
            if (_origArrangeMarriage) return _origArrangeMarriage(childIndex);
            return;
        }
        var p = player.children.clanPrestige || 0;
        var msg = '为 ' + child.name + ' 选择联姻档位（输入档位名）：\n\n';
        cfg().marriageTiers.forEach(function (t) {
            var lock = t.needPrestige && p < t.needPrestige;
            msg += t.name + (lock ? '【未解锁需声望' + t.needPrestige + '】' : '') +
                ' 费用×' + t.costMult + ' 继承+' + ((t.inheritBonus || 0) * 100).toFixed(0) + '%\n';
        });
        showCustomPrompt(msg, function (selected) {
            if (!selected) return;
            var tier = cfg().marriageTiers.find(function (t) { return selected.indexOf(t.name) >= 0 || selected.indexOf(t.id) >= 0; });
            if (!tier) {
                logAction('未识别档位，默认寻常联姻', 'info');
                tier = cfg().marriageTiers[0];
            }
            arrangeMarriageTiered(childIndex, tier.id);
        });
    };

    // 孕育时应用联姻继承加成
    var _origCreateNewChild = window.createNewChild;
    if (_origCreateNewChild) {
        window.createNewChild = function (name, gender, generation, parentId, inheritFrom) {
            if (inheritFrom && inheritFrom.inheritBonus && inheritFrom.attributes) {
                var bonus = inheritFrom.inheritBonus;
                var boosted = {
                    attributes: {
                        intelligence: Math.floor((inheritFrom.attributes.intelligence || 1) * (1 + bonus)),
                        physique: Math.floor((inheritFrom.attributes.physique || 1) * (1 + bonus)),
                        charm: Math.floor((inheritFrom.attributes.charm || 1) * (1 + bonus)),
                        business: Math.floor((inheritFrom.attributes.business || 1) * (1 + bonus))
                    }
                };
                inheritFrom = Object.assign({}, inheritFrom, boosted);
            }
            var child = _origCreateNewChild(name, gender, generation, parentId, inheritFrom);
            if (typeof assignLineageTalentToNewborn === 'function') assignLineageTalentToNewborn(child);
            return child;
        };
    }

    // 培养折扣
    window.getLineageTrainCostMult = function () {
        ensureLineageExtData();
        if (Date.now() < (player.children.trainDiscountUntil || 0)) {
            return 1 - (player.children.trainDiscountRate || 0);
        }
        return 1;
    };

    window.initLineageExtSystem = function () {
        ensureLineageExtData();
        var reg = typeof registerSingletonInterval === 'function' ? registerSingletonInterval : null;
        var start = function (fn, ms) {
            return reg ? reg('_lineageExtLoopId', fn, ms) : (typeof registerInterval === 'function' ? registerInterval(fn, ms) : setInterval(fn, ms));
        };
        start(function () {
            if (!player.children) return;
            ensureLineageExtData();
            // 自动轶事
            if (!player.children.activeEvent && Math.random() < 0.05) {
                if (Date.now() - (player.children.lastClanEvent || 0) >= cfg().eventCooldown) {
                    triggerClanEvent(false);
                }
            }
            // 远征完成提示
            if (player.children.expedition && player.children.expedition.endTime <= Date.now()) {
                var ui = document.getElementById('childSystemUI');
                if (ui && ui.style.display === 'block') updateExpeditionPanel();
            }
        }, 60000);
    };

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            if (typeof initChildData === 'function') initChildData();
            initLineageExtSystem();
        }, 800);
    });
})();

/**
 * 家族传承 · 烟火人间 / 染恙起居 / 婚育门禁 / 十八代深挖
 * 在 lineage-life.js 之后加载：持久生病、现实日常、成年成婚后方可孕育、十八代新玩法
 */
(function () {
    'use strict';
    var DAY_MS = 24 * 60 * 60 * 1000;
    var HOUR_MS = 60 * 60 * 1000;

    function cfg() { return window.lineageExtConfig; }
    function funds() { return player.investmentGame.userData; }
    function fmt(n) { return typeof formatSci === 'function' ? formatSci(n) : String(n); }
    function isAdult(m) {
        return typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : !!(m && m.isAdult);
    }
    function livingCfg() {
        return (cfg() && cfg().living) || {};
    }

    function installLivingConfig() {
        if (!window.lineageExtConfig) return;
        var c = window.lineageExtConfig;
        if (c._livingInstalled) return;
        c._livingInstalled = true;

        c.living = {
            // —— 染恙 ——
            illnessChancePerHour: 0.012,
            illnessTickMs: 60 * 1000,
            illnesses: [
                { id: 'cold', name: '风寒', weight: 35, severity: 1, days: 0.35, mood: -6, trainBlock: true, workBlock: true, conceiveBlock: true,
                  desc: '鼻塞喉痛，说话带点鼻音。', lines: ['{name}裹着薄被打喷嚏，药碗还冒着热气。', '{name}说没事，却连连咳嗽。'] },
                { id: 'fever', name: '发热', weight: 22, severity: 2, days: 0.5, mood: -10, trainBlock: true, workBlock: true, conceiveBlock: true,
                  desc: '额头烫得像刚出锅的馒头。', lines: ['{name}迷迷糊糊喊渴，旁人忙着换冷毛巾。', '夜里灯一直亮着，守着{name}退烧。'] },
                { id: 'sprain', name: '跌伤', weight: 18, severity: 1, days: 0.4, mood: -4, trainBlock: true, workBlock: false, conceiveBlock: false,
                  desc: '腿脚不利索，走路一瘸一拐。', lines: ['{name}练武摔了一跤，脚踝青了一片。', '{name}撑着拐杖还想去地里转转。'] },
                { id: 'melancholy', name: '郁结', weight: 15, severity: 1, days: 0.6, mood: -12, trainBlock: false, workBlock: false, conceiveBlock: true,
                  desc: '茶饭不香，话也少了。', lines: ['{name}对着窗外发呆，碗里的粥凉了也不动。', '有人劝{name}出门走走，{name}只摇头。'] },
                { id: 'plague', name: '时疫', weight: 10, severity: 3, days: 0.8, mood: -18, trainBlock: true, workBlock: true, conceiveBlock: true,
                  desc: '厢房隔离，全族提心吊胆。', lines: ['{name}被隔在偏院，门口挂着药草。', '族人轮流送饭，谁也不敢靠近太近。'] }
            ],
            treatments: [
                { id: 'rest', name: '卧床静养', cost: 2000000, healChance: 0.35, severityDrop: 1, mood: 3, cd: 2 * HOUR_MS,
                  line: '把门关严，让{name}好好睡一觉。窗外有人踮脚走过。' },
                { id: 'ginger', name: '姜汤草药', cost: 8000000, healChance: 0.55, severityDrop: 1, mood: 5, cd: 3 * HOUR_MS,
                  line: '姜汤苦得{name}直皱眉，却又一口一口喝完。' },
                { id: 'doctor', name: '延请郎中', cost: 35000000, healChance: 0.85, severityDrop: 2, mood: 8, cd: 4 * HOUR_MS,
                  line: '郎中把脉片刻，开了药方。{name}的气色慢慢回暖。' },
                { id: 'clinic', name: '医庐调养', cost: 60000000, healChance: 0.95, severityDrop: 3, mood: 10, cd: 6 * HOUR_MS, needEstate: 'clinic',
                  line: '医庐药柜吱呀一声。{name}在药香里睡着了，醒来时病气淡了许多。' },
                { id: 'ancestral', name: '祠堂祈安', cost: 15000000, healChance: 0.4, severityDrop: 1, mood: 6, cd: 8 * HOUR_MS, prestige: 3,
                  line: '{name}在牌位前跪下。香火青烟里，像有人轻轻拍了拍肩。' }
            ],
            // —— 烟火日常 ——
            chores: [
                { id: 'sweep', name: '扫院除尘', cost: 1500000, cd: HOUR_MS, mood: 3, attr: 'physique', attrGain: 1, worldHp: 0.3,
                  lines: ['{name}把落叶扫成一堆，麻雀扑棱棱飞起。', '扫帚划过石阶，{name}哼起不成调的小曲。'] },
                { id: 'market_buy', name: '上街采买', cost: 5000000, cd: 2 * HOUR_MS, mood: 5, attr: 'business', attrGain: 1, worldAtk: 0.3,
                  lines: ['{name}讨价还价半日，怀里多了一捆青菜和几块糖。', '集市人声嘈杂，{name}还是买回了你点名要的那味酱。'] },
                { id: 'neighbor', name: '邻里闲谈', cost: 2000000, cd: 2 * HOUR_MS, mood: 7, attr: 'charm', attrGain: 1, worldHp: 0.5,
                  lines: ['隔壁大娘拉着{name}聊家长里短，太阳偏了西。', '{name}帮邻家抬了一袋米，回来袖口沾着谷壳。'] },
                { id: 'field', name: '下田劳作', cost: 3000000, cd: 3 * HOUR_MS, mood: 2, attr: 'physique', attrGain: 2, worldAtk: 0.4, worldHp: 0.4,
                  lines: ['泥巴糊到{name}裤脚。收工时夕阳把影子拉得很长。', '{name}浇完最后一畦菜，直起腰，说「够吃一阵了」。'] },
                { id: 'laundry', name: '浆洗衣裳', cost: 1200000, cd: HOUR_MS, mood: 4, attr: 'charm', attrGain: 1, worldHp: 0.4,
                  lines: ['河埠头水声哗哗。{name}把洗净的衣裳晾成一排小旗。', '{name}搓衣时溅了一脸水，自己先笑了。'] },
                { id: 'teach_kids', name: '课子识字', cost: 4000000, cd: 3 * HOUR_MS, mood: 6, attr: 'intelligence', attrGain: 2, worldAtk: 0.3, worldCritDmg: 0.2, needAdult: true,
                  lines: ['{name}按着孩子的手写「家」字，写歪了也不骂。', '灯下{name}讲祖辈的故事，孩子听得眼睛发亮。'] },
                { id: 'night_watch', name: '守夜巡院', cost: 2500000, cd: 4 * HOUR_MS, mood: 1, attr: 'physique', attrGain: 1, worldAtk: 0.5, worldCritDmg: 0.3, needAdult: true,
                  lines: ['更深露重。{name}提着灯笼绕院一周，远处狗叫了一声。', '{name}在祠堂外停了停，确认香火还亮着。'] },
                { id: 'rain_walk', name: '雨巷漫步', cost: 1800000, cd: 2 * HOUR_MS, mood: 8, attr: 'intelligence', attrGain: 1, worldHp: 0.6,
                  lines: ['细雨打湿{name}的肩。巷子尽头有人卖热豆浆。', '{name}说雨天走路，心里的事会轻一点。'] },
                { id: 'season_rite', name: '岁时小祭', cost: 10000000, cd: 6 * HOUR_MS, mood: 5, attr: 'charm', attrGain: 1, worldAtk: 0.5, worldHp: 0.5, worldCritDmg: 0.4,
                  lines: ['{name}按节令摆了时鲜果品，对着天地作了个揖。', '这一年的风物，被{name}悄悄记在心里。'] }
            ],
            seasons: [
                { id: 'spring', name: '春', mood: 2, worldHp: 1, choreBonus: 'field' },
                { id: 'summer', name: '夏', mood: 0, worldAtk: 1, choreBonus: 'market_buy' },
                { id: 'autumn', name: '秋', mood: 1, worldCritDmg: 1, choreBonus: 'season_rite' },
                { id: 'winter', name: '冬', mood: -1, worldHp: 1.5, choreBonus: 'neighbor', illnessMult: 1.6 }
            ],
            // —— 婚育：成婚后需恩爱方可孕育 ——
            marital: {
                bondNeedConceive: 30,
                bondCap: 100,
                honeymoonHours: 6,
                honeymoonBond: 18,
                activities: [
                    { id: 'honeymoon', name: '蜜月出游', cost: 25000000, bond: 18, mood: 12, cd: 12 * HOUR_MS, once: true,
                      line: '{name}与{spouse}出门看山看水。回来时两个人的袖口都沾着同一种花香。' },
                    { id: 'couple_meal', name: '对桌晚膳', cost: 8000000, bond: 8, mood: 6, cd: 4 * HOUR_MS,
                      line: '{name}给{spouse}夹了一筷子菜。灯下两个人笑，把碗碰得轻轻响。' },
                    { id: 'gift_spouse', name: '赠礼示爱', cost: 15000000, bond: 10, mood: 5, cd: 6 * HOUR_MS,
                      line: '{name}把一件小物塞进{spouse}手里，耳朵有点红。' },
                    { id: 'share_chore', name: '并肩持家', cost: 5000000, bond: 6, mood: 4, cd: 3 * HOUR_MS,
                      line: '{name}和{spouse}一起晾衣、劈柴。烟火气里，日子忽然像样了。' },
                    { id: 'anniversary', name: '成婚纪念日', cost: 40000000, bond: 15, mood: 10, cd: 24 * HOUR_MS, needMarriedDays: 1,
                      line: '成婚又过了一日。{name}与{spouse}对饮，说的还是「往后慢慢来」。' }
                ]
            },
            // —— 十八代深挖 ——
            eighteenExtra: {
                incenseCost: 5000000,
                incenseCd: 4 * HOUR_MS,
                incenseBuff: { atk: 3, hp: 4, crit: 2, duration: 3 * HOUR_MS },
                genRites: [
                    { gen: 1, name: '开宗祭', cost: 20000000, atk: 2, hp: 2, crit: 1 },
                    { gen: 3, name: '三世灯', cost: 80000000, atk: 4, hp: 4, crit: 3 },
                    { gen: 6, name: '云孙誓', cost: 200000000, atk: 7, hp: 7, crit: 5 },
                    { gen: 9, name: '耳孙听命', cost: 500000000, atk: 10, hp: 10, crit: 8 },
                    { gen: 12, name: '胎孙承天', cost: 1200000000, atk: 14, hp: 14, crit: 12 },
                    { gen: 15, name: '昆孙镇世', cost: 3000000000, atk: 20, hp: 20, crit: 16 },
                    { gen: 18, name: '终世不灭祭', cost: 8000000000, atk: 35, hp: 35, crit: 30 }
                ],
                dreamCost: 100000000,
                dreamCd: 8 * HOUR_MS,
                lampCost: 50000000,
                lampPerGen: { atk: 0.8, hp: 0.8, crit: 0.6 }
            }
        };

        // 日常任务扩展
        var extraQuests = [
            { id: 'chore2', name: '烟火持家', desc: '完成烟火日常 2 次', need: 2, key: 'chore', rewardPrestige: 18, rewardFunds: 5000000, rewardExp: 14 },
            { id: 'heal1', name: '问病寻医', desc: '为族人疗伤/治病 1 次', need: 1, key: 'heal', rewardPrestige: 22, rewardFunds: 8000000, rewardExp: 16 },
            { id: 'marital1', name: '琴瑟和鸣', desc: '完成婚育恩爱 1 次', need: 1, key: 'marital', rewardPrestige: 25, rewardFunds: 10000000, rewardExp: 20 },
            { id: 'incense1', name: '香火绵延', desc: '十八代进香 1 次', need: 1, key: 'incense', rewardPrestige: 28, rewardFunds: 12000000, rewardExp: 22 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(extraQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));

        // 轶事：现实/疾病/婚育向
        var extraEvents = [
            { id: 'sick_spread', title: '厢房咳嗽', text: '偏院传来压不住的咳嗽。有人说是风寒，有人说是时疫前兆。',
              choices: [
                { label: '立刻隔离并寻医', cost: 150000000, effect: 'livingMassHeal', prestige: 20, worldHp: 6 },
                { label: '全族喝姜汤静观', cost: 40000000, effect: 'livingMood', amount: 8, prestige: 8, worldHp: 2 },
                { label: '先忙生意，别管闲话', cost: 0, effect: 'livingRandomSick', prestige: -5 }
              ]},
            { id: 'matchmaker', title: '媒人上门', text: '媒人笑眯眯递上帖子：有人家看中你们家某个成年未婚子弟。',
              choices: [
                { label: '备礼答应，促成姻缘', cost: 80000000, effect: 'livingMarriageReady', prestige: 18, worldHp: 3 },
                { label: '让孩子们自己见面看看', cost: 30000000, effect: 'livingMood', amount: 12, prestige: 10 },
                { label: '婉拒，说孩子还小', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'newborn_wish', title: '添丁之盼', text: '成婚的小夫妻在廊下说话，声音轻轻的：想要一个孩子，又怕来得太早。',
              choices: [
                { label: '送红枣桂圆，嘱咐先恩爱再孕育', cost: 50000000, effect: 'livingBondBoost', amount: 15, prestige: 15, worldHp: 4 },
                { label: '办一场小宴，大家热闹热闹', cost: 100000000, effect: 'happiness', amount: 20, prestige: 12 },
                { label: '笑着说随缘，不强求', cost: 0, effect: 'livingMood', amount: 5, prestige: 5 }
              ]},
            { id: 'eighteen_dream', title: '十八代托梦', text: '你梦见第十八代的影子在雾里站着，朝你招手，又像在说「慢一点，把日子过好」。',
              choices: [
                { label: '醒来立刻进香追思', cost: 200000000, effect: 'livingIncenseReady', prestige: 35, worldAtk: 5, worldHp: 5, worldCritDmg: 4 },
                { label: '把梦记进族谱附页', cost: 120000000, effect: 'chronicleBoost', prestige: 25 },
                { label: '当作寻常梦境', cost: 0, effect: 'smallBoost', amount: 2, prestige: 5 }
              ]},
            { id: 'market_life', title: '烟火一日', text: '从早到晚：买菜、洗衣、吵架、和好。有人说这才是真正的「祖宗十八代」——一代代这样活过来的。',
              choices: [
                { label: '带着家人过完这烟火一日', cost: 60000000, effect: 'livingChoreFree', prestige: 16, worldHp: 5 },
                { label: '趁集日多置办些年货', cost: 90000000, effect: 'funds', amount: 50000000, prestige: 10, worldAtk: 3 },
                { label: '躲进书房，假装没听见吵闹', cost: 0, effect: 'livingMood', amount: -3, prestige: 0 }
              ]}
        ];
        c.events = (c.events || []).concat(extraEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));
    }

    function ensureLivingData() {
        if (!player.children) return;
        installLivingConfig();
        var c = player.children;
        if (!c.living) {
            c.living = {
                treatmentCd: {},
                choreCd: {},
                maritalCd: {},
                incenseLast: 0,
                incenseUntil: 0,
                genRitesDone: {},
                dreamLast: 0,
                lampLevel: 0,
                seasonBuffUntil: 0,
                lastIllnessTick: 0,
                choreFreeUntil: 0,
                marriageDiscountUntil: 0
            };
        }
        var L = c.living;
        if (!L.treatmentCd) L.treatmentCd = {};
        if (!L.choreCd) L.choreCd = {};
        if (!L.maritalCd) L.maritalCd = {};
        if (!L.genRitesDone) L.genRitesDone = {};
        if (L.incenseLast == null) L.incenseLast = 0;
        if (L.incenseUntil == null) L.incenseUntil = 0;
        if (L.dreamLast == null) L.dreamLast = 0;
        if (L.lampLevel == null) L.lampLevel = 0;
        if (L.lastIllnessTick == null) L.lastIllnessTick = 0;
        (c.children || []).forEach(function (m) {
            if (m.maritalBond == null) m.maritalBond = m.isMarried ? 10 : 0;
            if (m.honeymoonDone == null) m.honeymoonDone = false;
            if (m.illness && !m.illness.id) m.illness = null;
        });
    }

    function pushDiary(text) {
        if (typeof ensureLifeData === 'function') {
            // reuse life diary via player.children.life
        }
        if (!player.children.life) {
            if (typeof ensureLifeData === 'function') ensureLifeData();
        }
        if (!player.children.life) return;
        var d = player.children.life.diary;
        if (!Array.isArray(d)) {
            player.children.life.diary = [];
            d = player.children.life.diary;
        }
        d.unshift({ t: Date.now(), text: text });
        if (d.length > 50) d.length = 50;
    }

    function bumpLivingDaily(key) {
        if (!player.children.dailyQuest) return;
        var dq = player.children.dailyQuest;
        (cfg().dailyQuests || []).forEach(function (q) {
            if (q.key === key) dq.progress[q.id] = (dq.progress[q.id] || 0) + 1;
        });
    }

    function currentSeason() {
        var list = (livingCfg().seasons) || [];
        if (!list.length) return { id: 'spring', name: '春' };
        var idx = Math.floor(Date.now() / DAY_MS) % list.length;
        return list[idx];
    }

    function maxGeneration() {
        var maxG = 0;
        (player.children.children || []).forEach(function (m) {
            maxG = Math.max(maxG, m.generation || 1);
        });
        return maxG;
    }

    function pickWeighted(list) {
        var total = 0;
        list.forEach(function (x) { total += x.weight || 1; });
        var r = Math.random() * total;
        for (var i = 0; i < list.length; i++) {
            r -= list[i].weight || 1;
            if (r <= 0) return list[i];
        }
        return list[0];
    }

    function getIllnessDef(id) {
        return ((livingCfg().illnesses) || []).find(function (x) { return x.id === id; });
    }

    function isMemberSick(m) {
        return !!(m && m.illness && m.illness.id);
    }

    function canMemberConceive(m) {
        if (!m) return { ok: false, reason: '无效成员' };
        if (!isAdult(m)) return { ok: false, reason: m.name + ' 尚未成年，无法生育' };
        if (!m.isMarried || !m.spouse) return { ok: false, reason: m.name + ' 尚未成婚，无法生育下一代（须成年后成婚）' };
        if (isMemberSick(m)) {
            var def = getIllnessDef(m.illness.id);
            if (def && def.conceiveBlock) return { ok: false, reason: m.name + ' 正在「' + def.name + '」中，不宜孕育' };
        }
        var need = (livingCfg().marital && livingCfg().marital.bondNeedConceive) || 30;
        var bond = m.maritalBond || 0;
        if (bond < need) {
            return { ok: false, reason: m.name + ' 与配偶恩爱不足（' + bond + '/' + need + '），请先在「婚育」页培养夫妻情分' };
        }
        return { ok: true };
    }

    window.canFamilyMemberConceive = canMemberConceive;
    window.isFamilyMemberSick = isMemberSick;

    // ——— 染恙：感染 / 自愈 / 治疗 ———
    function infectMember(member, forcedId) {
        if (!member || isMemberSick(member)) return false;
        var def = forcedId
            ? getIllnessDef(forcedId)
            : pickWeighted(livingCfg().illnesses || []);
        if (!def) return false;
        var season = currentSeason();
        var days = def.days * ((season.illnessMult) || 1);
        member.illness = {
            id: def.id,
            since: Date.now(),
            until: Date.now() + days * DAY_MS,
            severity: def.severity
        };
        if (player.children.life) {
            player.children.life.mood = Math.max(0, (player.children.life.mood || 50) + (def.mood || -5));
        }
        var line = (def.lines[Math.floor(Math.random() * def.lines.length)] || '').replace(/\{name\}/g, member.name);
        pushDiary(line);
        logAction(member.name + ' 染上了「' + def.name + '」：' + def.desc, 'warning');
        return true;
    }

    function clearIllness(member) {
        if (!member) return;
        member.illness = null;
    }

    function tickIllness() {
        ensureLivingData();
        var members = player.children.children || [];
        var now = Date.now();
        var L = player.children.living;
        var season = currentSeason();
        var chance = (livingCfg().illnessChancePerHour || 0.012) * ((season.illnessMult) || 1);

        members.forEach(function (m) {
            if (!m.illness) return;
            if (now >= (m.illness.until || 0)) {
                var def = getIllnessDef(m.illness.id);
                clearIllness(m);
                logAction(m.name + ' 的「' + ((def && def.name) || '病') + '」已渐渐好了', 'success');
                pushDiary(m.name + ' 气色回来了，能下地走动了。');
            }
        });

        // 约每小时判定一次新发病（按 tick 折算）
        if (now - (L.lastIllnessTick || 0) < HOUR_MS) return;
        L.lastIllnessTick = now;
        var healthy = members.filter(function (m) { return !isMemberSick(m); });
        if (!healthy.length) return;
        if (Math.random() < chance) {
            var target = healthy[Math.floor(Math.random() * healthy.length)];
            infectMember(target);
            if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
            if (typeof saveGame === 'function') saveGame();
        }
    }

    window.treatFamilyIllness = function (memberIndex, treatmentId) {
        ensureLivingData();
        var members = player.children.children || [];
        var m = members[memberIndex];
        if (!m || !isMemberSick(m)) {
            logAction('该成员并未染恙', 'info');
            return;
        }
        var treat = ((livingCfg().treatments) || []).find(function (t) { return t.id === treatmentId; });
        if (!treat) return;
        if (treat.needEstate === 'clinic') {
            var clinicLv = (player.children.life && player.children.life.estate && player.children.life.estate.clinic) || 0;
            if (clinicLv < 1) {
                logAction('需先修缮宅邸「医庐」才能在此调养', 'error');
                return;
            }
        }
        var cdKey = treat.id + ':' + (m.id || memberIndex);
        var left = (player.children.living.treatmentCd[cdKey] || 0) - Date.now();
        if (left > 0) {
            logAction('「' + treat.name + '」冷却中，约 ' + Math.ceil(left / 60000) + ' 分钟', 'info');
            return;
        }
        if (funds().availableFunds < treat.cost) {
            logAction('资金不足，需要 ' + fmt(treat.cost), 'error');
            return;
        }
        funds().availableFunds -= treat.cost;
        player.children.living.treatmentCd[cdKey] = Date.now() + (treat.cd || 2 * HOUR_MS);
        if (player.children.life) {
            player.children.life.mood = Math.min(100, (player.children.life.mood || 50) + (treat.mood || 0));
        }
        m.illness.severity = Math.max(0, (m.illness.severity || 1) - (treat.severityDrop || 1));
        var healed = Math.random() < (treat.healChance || 0.5) || m.illness.severity <= 0;
        var line = (treat.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line);
        bumpLivingDaily('heal');
        if (treat.prestige && typeof addClanPrestige === 'function') addClanPrestige(treat.prestige);
        if (healed) {
            var def = getIllnessDef(m.illness.id);
            clearIllness(m);
            logAction(line + ' —— ' + m.name + ' 的「' + ((def && def.name) || '病') + '」已愈！', 'success');
        } else {
            m.illness.until = (m.illness.until || Date.now()) - 4 * HOUR_MS;
            logAction(line + ' —— 病情有所缓和，仍需调养。', 'info');
        }
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    };

    // ——— 烟火日常 ———
    window.doLivingChore = function (choreId, memberIndex) {
        ensureLivingData();
        var chore = ((livingCfg().chores) || []).find(function (c) { return c.id === choreId; });
        var members = player.children.children || [];
        var m = members[memberIndex];
        if (!chore || !m) {
            logAction('请选择成员与日常事项', 'error');
            return;
        }
        if (chore.needAdult && !isAdult(m)) {
            logAction('「' + chore.name + '」需要成年成员', 'error');
            return;
        }
        if (isMemberSick(m)) {
            var idef = getIllnessDef(m.illness.id);
            if (idef && idef.workBlock) {
                logAction(m.name + ' 正在生病，不宜劳作', 'error');
                return;
            }
        }
        var free = Date.now() < (player.children.living.choreFreeUntil || 0);
        var cost = free ? 0 : chore.cost;
        var cdKey = chore.id + ':' + (m.id || memberIndex);
        var left = (player.children.living.choreCd[cdKey] || 0) - Date.now();
        if (left > 0) {
            logAction('「' + chore.name + '」冷却中，约 ' + Math.ceil(left / 60000) + ' 分钟', 'info');
            return;
        }
        if (funds().availableFunds < cost) {
            logAction('资金不足，需要 ' + fmt(cost), 'error');
            return;
        }
        funds().availableFunds -= cost;
        player.children.living.choreCd[cdKey] = Date.now() + (chore.cd || HOUR_MS);
        var season = currentSeason();
        var moodGain = (chore.mood || 0) + (season.mood || 0);
        if (season.choreBonus === chore.id) moodGain += 2;
        if (player.children.life) {
            player.children.life.mood = Math.max(0, Math.min(100, (player.children.life.mood || 50) + moodGain));
        }
        m.lifeMood = Math.max(0, Math.min(100, (m.lifeMood || 50) + moodGain));
        if (chore.attr && m.attributes) {
            m.attributes[chore.attr] = (m.attributes[chore.attr] || 0) + (chore.attrGain || 1);
        }
        if (player.children.life && player.children.life.tempWorld) {
            var tw = player.children.life.tempWorld;
            if (Date.now() > (tw.until || 0)) { tw.atk = 0; tw.hp = 0; tw.crit = 0; }
            tw.atk += (chore.worldAtk || 0) + (season.worldAtk || 0) * 0.1;
            tw.hp += (chore.worldHp || 0) + (season.worldHp || 0) * 0.1;
            tw.crit += (chore.worldCritDmg || 0) + (season.worldCritDmg || 0) * 0.1;
            tw.until = Date.now() + 3 * HOUR_MS;
        }
        var line = chore.lines[Math.floor(Math.random() * chore.lines.length)].replace(/\{name\}/g, m.name);
        pushDiary('【' + season.name + '】' + line);
        bumpLivingDaily('chore');
        logAction(line, 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    };

    // ——— 婚育恩爱 ———
    window.doMaritalActivity = function (activityId, memberIndex) {
        ensureLivingData();
        var act = ((livingCfg().marital && livingCfg().marital.activities) || []).find(function (a) { return a.id === activityId; });
        var members = player.children.children || [];
        var m = members[memberIndex];
        if (!act || !m) {
            logAction('请选择已婚成员与恩爱事项', 'error');
            return;
        }
        if (!isAdult(m)) {
            logAction('只有成年成员才能成婚恩爱', 'error');
            return;
        }
        if (!m.isMarried || !m.spouse) {
            logAction(m.name + ' 尚未成婚。请先成年后安排成婚，再培养夫妻情分、孕育下一代。', 'error');
            return;
        }
        if (isMemberSick(m)) {
            logAction(m.name + ' 正在生病，不宜宴游恩爱', 'error');
            return;
        }
        if (act.once && m.honeymoonDone && act.id === 'honeymoon') {
            logAction(m.name + ' 已度蜜月，可改做其它恩爱事项', 'info');
            return;
        }
        if (act.needMarriedDays) {
            var days = (Date.now() - (m.marriageDate || 0)) / DAY_MS;
            if (days < act.needMarriedDays) {
                logAction('成婚未满 ' + act.needMarriedDays + ' 天，暂不宜办纪念日', 'info');
                return;
            }
        }
        var cdKey = act.id + ':' + (m.id || memberIndex);
        var left = (player.children.living.maritalCd[cdKey] || 0) - Date.now();
        if (left > 0) {
            logAction('「' + act.name + '」冷却中，约 ' + Math.ceil(left / 60000) + ' 分钟', 'info');
            return;
        }
        if (funds().availableFunds < act.cost) {
            logAction('资金不足，需要 ' + fmt(act.cost), 'error');
            return;
        }
        funds().availableFunds -= act.cost;
        player.children.living.maritalCd[cdKey] = Date.now() + (act.cd || 4 * HOUR_MS);
        var cap = (livingCfg().marital && livingCfg().marital.bondCap) || 100;
        m.maritalBond = Math.min(cap, (m.maritalBond || 0) + (act.bond || 0));
        if (act.id === 'honeymoon') m.honeymoonDone = true;
        if (player.children.life) {
            player.children.life.mood = Math.min(100, (player.children.life.mood || 50) + (act.mood || 0));
        }
        var line = (act.line || '')
            .replace(/\{name\}/g, m.name)
            .replace(/\{spouse\}/g, m.spouse.name);
        pushDiary(line);
        bumpLivingDaily('marital');
        var need = (livingCfg().marital && livingCfg().marital.bondNeedConceive) || 30;
        var tip = m.maritalBond >= need
            ? '恩爱已足，可在「传宗」页孕育下一代。'
            : '恩爱 ' + m.maritalBond + '/' + need + '，继续培养后方可孕育。';
        logAction(line + ' ' + tip, 'success');
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    };

    // ——— 十八代：进香 / 代际祀典 / 托梦 / 传灯 ———
    window.offerEighteenIncense = function () {
        ensureLivingData();
        var ex = livingCfg().eighteenExtra;
        if (!ex) return;
        var left = (player.children.living.incenseLast || 0) + ex.incenseCd - Date.now();
        if (left > 0) {
            logAction('进香冷却中，约 ' + Math.ceil(left / 60000) + ' 分钟', 'info');
            return;
        }
        if (funds().availableFunds < ex.incenseCost) {
            logAction('资金不足，需要 ' + fmt(ex.incenseCost), 'error');
            return;
        }
        funds().availableFunds -= ex.incenseCost;
        player.children.living.incenseLast = Date.now();
        player.children.living.incenseUntil = Date.now() + ex.incenseBuff.duration;
        bumpLivingDaily('incense');
        pushDiary('青烟升起。十八代牌位前，香灰落了一小截。');
        logAction('进香完成：限时世界地图攻+' + (ex.incenseBuff.atk * 100) + '% 血+' + (ex.incenseBuff.hp * 100) + '% 爆+' + (ex.incenseBuff.crit * 100) + '%', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.performGenerationRite = function (gen) {
        ensureLivingData();
        var ex = livingCfg().eighteenExtra;
        var rite = (ex.genRites || []).find(function (r) { return r.gen === gen; });
        if (!rite) return;
        if (maxGeneration() < gen) {
            logAction('尚未触及第 ' + gen + ' 代，无法举行「' + rite.name + '」', 'error');
            return;
        }
        if (player.children.living.genRitesDone[gen]) {
            logAction('「' + rite.name + '」已举行过', 'info');
            return;
        }
        if (funds().availableFunds < rite.cost) {
            logAction('资金不足，需要 ' + fmt(rite.cost), 'error');
            return;
        }
        funds().availableFunds -= rite.cost;
        player.children.living.genRitesDone[gen] = true;
        pushDiary('全族齐聚，举行「' + rite.name + '」。烛火照得牌位一片金红。');
        if (typeof addClanPrestige === 'function') addClanPrestige(10 + gen * 2);
        if (typeof addLineageExp === 'function') addLineageExp(20 + gen);
        logAction('举行「' + rite.name + '」！永久世界地图攻+' + (rite.atk * 100) + '% 血+' + (rite.hp * 100) + '% 爆+' + (rite.crit * 100) + '%', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.invokeEighteenDream = function () {
        ensureLivingData();
        var ex = livingCfg().eighteenExtra;
        var left = (player.children.living.dreamLast || 0) + ex.dreamCd - Date.now();
        if (left > 0) {
            logAction('托梦冷却中，约 ' + Math.ceil(left / 60000) + ' 分钟', 'info');
            return;
        }
        if (funds().availableFunds < ex.dreamCost) {
            logAction('资金不足，需要 ' + fmt(ex.dreamCost), 'error');
            return;
        }
        funds().availableFunds -= ex.dreamCost;
        player.children.living.dreamLast = Date.now();
        var maxG = maxGeneration();
        var adults = (player.children.children || []).filter(isAdult);
        var boost = 2 + Math.floor(maxG / 3);
        if (adults.length) {
            var t = adults[Math.floor(Math.random() * adults.length)];
            if (t.attributes) {
                ['intelligence', 'physique', 'charm', 'business'].forEach(function (k) {
                    t.attributes[k] = (t.attributes[k] || 0) + boost;
                });
            }
            pushDiary('梦里远祖点头。醒来后，' + t.name + ' 觉得血脉里热了一下。');
            logAction('十八代托梦：' + t.name + ' 全属性 +' + boost + '（触及代数 ' + maxG + '）', 'success');
        } else {
            pushDiary('梦里雾很浓。还没有成年子弟能接住这份托付。');
            logAction('托梦完成，但暂无成年成员承接感悟', 'info');
        }
        if (typeof addLineageExp === 'function') addLineageExp(15);
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    window.upgradeEighteenLamp = function () {
        ensureLivingData();
        var ex = livingCfg().eighteenExtra;
        var lv = player.children.living.lampLevel || 0;
        var cost = ex.lampCost * Math.pow(10, Math.min(lv, 5));
        if (funds().availableFunds < cost) {
            logAction('资金不足，需要 ' + fmt(cost), 'error');
            return;
        }
        if (lv >= 18) {
            logAction('传灯已满十八阶', 'info');
            return;
        }
        funds().availableFunds -= cost;
        player.children.living.lampLevel = lv + 1;
        pushDiary('长明灯又亮了一寸。光影在十八代牌位间慢慢挪动。');
        logAction('十八代传灯升至第 ' + (lv + 1) + ' 阶', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    function calcLivingWorld() {
        ensureLivingData();
        var atk = 0, hp = 0, crit = 0;
        var L = player.children.living;
        var ex = livingCfg().eighteenExtra;
        if (ex && Date.now() < (L.incenseUntil || 0)) {
            atk += ex.incenseBuff.atk;
            hp += ex.incenseBuff.hp;
            crit += ex.incenseBuff.crit;
        }
        (ex.genRites || []).forEach(function (r) {
            if (L.genRitesDone[r.gen]) {
                atk += r.atk; hp += r.hp; crit += r.crit;
            }
        });
        var lamp = L.lampLevel || 0;
        if (ex && ex.lampPerGen) {
            atk += lamp * ex.lampPerGen.atk;
            hp += lamp * ex.lampPerGen.hp;
            crit += lamp * ex.lampPerGen.crit;
        }
        // 染恙惩罚
        (player.children.children || []).forEach(function (m) {
            if (!isMemberSick(m)) return;
            var def = getIllnessDef(m.illness.id);
            var sev = (def && def.severity) || 1;
            atk -= sev * 0.4;
            hp -= sev * 0.6;
            crit -= sev * 0.3;
        });
        // 恩爱已婚加成
        (player.children.children || []).forEach(function (m) {
            if (!m.isMarried) return;
            var b = Math.min(100, m.maritalBond || 0);
            atk += b * 0.02;
            hp += b * 0.03;
            crit += b * 0.015;
        });
        return { atk: Math.max(0, atk), hp: Math.max(0, hp), crit: Math.max(0, crit) };
    }

    // 叠进世界地图三维
    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        installLivingConfig();
        ensureLivingData();
        var base = _origBonus ? _origBonus() : { global: 1, gps: 1, click: 1, life: 1, atk: 1, contrib: 1, worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var w = calcLivingWorld();
        base.worldAtk = (base.worldAtk || 0) + w.atk;
        base.worldHp = (base.worldHp || 0) + w.hp;
        base.worldCritDmg = (base.worldCritDmg || 0) + w.crit;
        return base;
    };

    // ——— 门禁包装：打工 / 培养 / 孕育 ———
    var _origStartWork = window.startChildWork;
    window.startChildWork = function (childIndex) {
        ensureLivingData();
        var child = player.children.children[childIndex];
        if (child && isMemberSick(child)) {
            var def = getIllnessDef(child.illness.id);
            if (def && def.workBlock) {
                logAction(child.name + ' 正在「' + def.name + '」中，不宜打工', 'error');
                return;
            }
        }
        if (_origStartWork) return _origStartWork(childIndex);
    };

    var _origAutoJobs = window.autoAssignAllJobs;
    if (_origAutoJobs) {
        window.autoAssignAllJobs = function () {
            ensureLivingData();
            var blocked = 0;
            (player.children.children || []).forEach(function (m) {
                if (isMemberSick(m)) {
                    var def = getIllnessDef(m.illness.id);
                    if (def && def.workBlock && !m.currentJob) blocked++;
                }
            });
            // 临时给生病且禁工的人挂个标记 job，避免被分配——改用过滤包装
            var saved = [];
            (player.children.children || []).forEach(function (m, i) {
                if (isMemberSick(m)) {
                    var def = getIllnessDef(m.illness.id);
                    if (def && def.workBlock && !m.currentJob) {
                        saved.push(i);
                        m._livingSkipJob = true;
                        m.currentJob = '__sick_skip__';
                    }
                }
            });
            _origAutoJobs();
            saved.forEach(function (i) {
                var m = player.children.children[i];
                if (m && m.currentJob === '__sick_skip__') {
                    m.currentJob = null;
                    delete m._livingSkipJob;
                }
            });
            if (blocked) logAction('已跳过 ' + blocked + ' 位生病不宜打工的成员', 'info');
        };
    }

    var _origTrain = window.trainChild;
    window.trainChild = function (childIndex, trainingType) {
        ensureLivingData();
        var child = player.children.children[childIndex];
        if (child && isMemberSick(child)) {
            var def = getIllnessDef(child.illness.id);
            if (def && def.trainBlock) {
                logAction(child.name + ' 正在「' + def.name + '」中，不宜培养', 'error');
                return;
            }
        }
        if (_origTrain) return _origTrain(childIndex, trainingType);
    };

    var _origConceiveDesc = window.conceiveDescendant;
    window.conceiveDescendant = function (parentIndex) {
        ensureLivingData();
        var parent = player.children.children[parentIndex];
        var gate = canMemberConceive(parent);
        if (!gate.ok) {
            logAction(gate.reason, 'error');
            return;
        }
        if (_origConceiveDesc) return _origConceiveDesc(parentIndex);
    };

    // 成婚后初始化恩爱 + 联姻折扣
    var _origTiered = window.arrangeMarriageTiered;
    if (_origTiered) {
        window.arrangeMarriageTiered = function (childIndex, tierId) {
            ensureLivingData();
            var L = player.children.living;
            var discountOn = !!(L && Date.now() < (L.marriageDiscountUntil || 0));
            var savedCost = null;
            if (discountOn && typeof childConfig !== 'undefined' && childConfig.lineage) {
                savedCost = childConfig.lineage.marriageCost;
                childConfig.lineage.marriageCost = Math.floor(savedCost * 0.7);
                logAction('联姻优惠生效中：费用七折', 'info');
            }
            var child = player.children.children[childIndex];
            var wasMarried = !!(child && child.isMarried);
            try {
                _origTiered(childIndex, tierId);
            } finally {
                if (savedCost != null) childConfig.lineage.marriageCost = savedCost;
            }
            var tries = 0;
            var timer = setInterval(function () {
                tries++;
                ensureLivingData();
                var m = player.children.children[childIndex];
                if (m && m.isMarried && !wasMarried) {
                    clearInterval(timer);
                    if (discountOn) player.children.living.marriageDiscountUntil = 0;
                    if (m.maritalBond == null || m.maritalBond < 8) m.maritalBond = 8;
                    m.honeymoonDone = false;
                    var need = (livingCfg().marital && livingCfg().marital.bondNeedConceive) || 30;
                    pushDiary(m.name + ' 成婚了。族人说：先过好日子，再谈添丁。');
                    logAction(m.name + ' 成婚成功！请先在「婚育」页培养恩爱（满 ' + need + '）后，方可孕育下一代。', 'success');
                    if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
                    return;
                }
                if (tries > 60) clearInterval(timer);
            }, 100);
        };
    }

    // 传宗列表：按恩爱/生病动态改孕育按钮
    var _origLineageList = window.updateLineageActionList;
    if (_origLineageList) {
        window.updateLineageActionList = function () {
            _origLineageList();
            ensureLivingData();
            var need = (livingCfg().marital && livingCfg().marital.bondNeedConceive) || 30;
            var children = player.children.children || [];
            children.forEach(function (child, index) {
                if (!isAdult(child) || !child.isMarried || child.isPregnant) return;
                var gate = canMemberConceive(child);
                var bond = child.maritalBond || 0;
                // 找到该成员卡片内的孕育按钮并改写
                var btns = document.querySelectorAll('#lineageActionList .c-member');
                // 更稳：按按钮 onclick 定位
                var btn = document.querySelector('#lineageActionList button[onclick="conceiveDescendant(' + index + ')"]');
                if (!btn) return;
                var card = btn.closest('.c-member');
                if (!gate.ok) {
                    btn.disabled = true;
                    btn.textContent = bond < need ? ('恩爱不足 ' + bond + '/' + need) : '暂不可孕育';
                    btn.className = 'c-btn c-btn-orange';
                    if (card && !card.querySelector('.living-gate-tip')) {
                        var tip = document.createElement('div');
                        tip.className = 'c-hint living-gate-tip';
                        tip.style.color = '#FF8A65';
                        tip.style.marginTop = '4px';
                        tip.textContent = gate.reason;
                        btn.parentNode.insertBefore(tip, btn.nextSibling);
                    }
                } else {
                    btn.disabled = false;
                    if (card) {
                        var old = card.querySelector('.living-gate-tip');
                        if (old) old.remove();
                    }
                }
            });
            enhanceLineageActionLivingHints();
        };
    }

    // 轶事效果扩展
    var _origResolve = window.resolveClanEvent;
    if (_origResolve) {
        // patch via wrapping choice application — hook after resolve by monkeypatching known living effects in update
    }

    function applyLivingEventEffect(effect, amount) {
        ensureLivingData();
        if (effect === 'livingMassHeal') {
            (player.children.children || []).forEach(function (m) {
                if (isMemberSick(m)) clearIllness(m);
            });
            pushDiary('郎中连夜出诊，厢房里的咳嗽渐渐停了。');
            return true;
        }
        if (effect === 'livingMood') {
            if (player.children.life) {
                player.children.life.mood = Math.max(0, Math.min(100, (player.children.life.mood || 50) + (amount || 0)));
            }
            return true;
        }
        if (effect === 'livingRandomSick') {
            var healthy = (player.children.children || []).filter(function (m) { return !isMemberSick(m); });
            if (healthy.length) infectMember(healthy[Math.floor(Math.random() * healthy.length)], 'cold');
            return true;
        }
        if (effect === 'livingBondBoost') {
            var married = (player.children.children || []).filter(function (m) { return m.isMarried; });
            married.forEach(function (m) {
                m.maritalBond = Math.min(100, (m.maritalBond || 0) + (amount || 10));
            });
            pushDiary('红枣桂圆摆上桌。小夫妻的话说得更软了。');
            return true;
        }
        if (effect === 'livingIncenseReady') {
            player.children.living.incenseLast = 0;
            return true;
        }
        if (effect === 'livingChoreFree') {
            player.children.living.choreFreeUntil = Date.now() + 6 * HOUR_MS;
            return true;
        }
        if (effect === 'livingMarriageReady') {
            player.children.living.marriageDiscountUntil = Date.now() + 12 * HOUR_MS;
            return true;
        }
        return false;
    }

    // 劫持轶事选项点击：在 lineage-ext 的 resolve 流程里，通过包装 resolveClanEventChoice 若存在
    var _origResolveChoice = window.resolveClanEventChoice || window.chooseClanEvent || null;
    // lineage-ext 通常用 resolveClanEvent(choiceIndex)
    var _origResolveEvent = window.resolveClanEvent;
    if (_origResolveEvent) {
        window.resolveClanEvent = function (choiceIndex) {
            var ev = player.children && player.children.activeEvent;
            var choice = ev && ev.choices && ev.choices[choiceIndex];
            var effect = choice && choice.effect;
            var amount = choice && choice.amount;
            _origResolveEvent(choiceIndex);
            if (effect) applyLivingEventEffect(effect, amount);
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }

    function updateLivingIllnessPanel() {
        var box = el('livingIllnessPanel');
        if (!box) return;
        ensureLivingData();
        var members = player.children.children || [];
        var sick = members.map(function (m, i) { return { m: m, i: i }; }).filter(function (x) { return isMemberSick(x.m); });
        var season = currentSeason();
        var html = '<div class="c-hint">时令：' + season.name +
            (season.illnessMult ? '（冬令易感，染恙几率偏高）' : '') +
            ' · 生病成员不宜打工/培养/孕育（视病症）</div>';
        if (!sick.length) {
            html += '<div class="c-hint" style="color:#81C784;">族中暂无病人。起居有度，香火平安。</div>';
            html += '<button class="c-btn c-btn-sm c-btn-orange" style="margin-top:8px;" onclick="livingForceCheckIllness()">巡视厢房（手动体检）</button>';
            box.innerHTML = html;
            return;
        }
        html += sick.map(function (row) {
            var m = row.m;
            var def = getIllnessDef(m.illness.id) || { name: '不适', desc: '' };
            var leftH = Math.max(0, Math.ceil(((m.illness.until || 0) - Date.now()) / 3600000));
            var treats = ((livingCfg().treatments) || []).map(function (t) {
                return '<button class="c-btn c-btn-sm c-btn-green" style="margin:2px;" onclick="treatFamilyIllness(' + row.i + ',\'' + t.id + '\')">' +
                    t.name + '（' + fmt(t.cost) + '）</button>';
            }).join('');
            return '<div class="c-member" style="margin-bottom:8px;">' +
                '<div class="name">' + m.name + ' · <span style="color:#FF8A65;">' + def.name + '</span></div>' +
                '<div class="meta">' + def.desc + ' · 约 ' + leftH + ' 小时可自愈 · 严重度 ' + (m.illness.severity || 1) + '</div>' +
                '<div style="margin-top:6px;">' + treats + '</div></div>';
        }).join('');
        box.innerHTML = html;
    }

    window.livingForceCheckIllness = function () {
        ensureLivingData();
        var healthy = (player.children.children || []).filter(function (m) { return !isMemberSick(m); });
        if (!healthy.length) {
            logAction('没有健康成员可巡视', 'info');
            return;
        }
        if (Math.random() < 0.35) {
            infectMember(healthy[Math.floor(Math.random() * healthy.length)]);
        } else {
            logAction('巡视完毕：厢房安静，无人新病。', 'success');
            pushDiary('你提着灯走过厢房，咳嗽声没有响起。');
        }
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof saveGame === 'function') saveGame();
    };

    function updateLivingChorePanel() {
        var box = el('livingChorePanel');
        if (!box) return;
        ensureLivingData();
        var members = player.children.children || [];
        var season = currentSeason();
        var free = Date.now() < (player.children.living.choreFreeUntil || 0);
        var opts = members.map(function (m, i) {
            var tag = isMemberSick(m) ? '·病' : '';
            return '<option value="' + i + '">' + m.name + tag + '</option>';
        }).join('');
        box.innerHTML = '<div class="c-hint">时令【' + season.name + '】' +
            (free ? ' · <span style="color:#81C784;">烟火日常免费中</span>' : '') +
            ' · 选人做一件「过日子」的事</div>' +
            '<div class="c-form-row"><label>成员</label><select id="livingChoreMember" class="c-input">' + opts + '</select></div>' +
            '<div class="c-train-grid">' + ((livingCfg().chores) || []).map(function (c) {
                var bonus = season.choreBonus === c.id ? ' · 时令加成' : '';
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + c.name + '</div>' +
                    '<div class="ms-desc">耗资 ' + fmt(free ? 0 : c.cost) + ' · 心情+' + c.mood + bonus + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" style="margin-top:6px;" onclick="doLivingChore(\'' + c.id + '\',+document.getElementById(\'livingChoreMember\').value)">' + c.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateLivingMaritalPanel() {
        var box = el('livingMaritalPanel');
        if (!box) return;
        ensureLivingData();
        var need = (livingCfg().marital && livingCfg().marital.bondNeedConceive) || 30;
        var members = player.children.children || [];
        var married = members.map(function (m, i) { return { m: m, i: i }; }).filter(function (x) {
            return isAdult(x.m) && x.m.isMarried;
        });
        var html = '<p class="c-hint"><strong>规则：</strong>子嗣须<strong>成年</strong>并<strong>成婚</strong>，且夫妻恩爱达到 <strong>' + need + '</strong>，方可孕育下一代。未成年/未婚不可生育。</p>';
        if (!married.length) {
            html += '<div class="c-hint">暂无已婚成年成员。请先培养至青年 → 安排成婚 → 再回此页恩爱。</div>';
            box.innerHTML = html;
            return;
        }
        html += married.map(function (row) {
            var m = row.m;
            var bond = m.maritalBond || 0;
            var pct = Math.min(100, (bond / need) * 100);
            var gate = canMemberConceive(m);
            var acts = ((livingCfg().marital && livingCfg().marital.activities) || []).map(function (a) {
                var disabled = a.once && a.id === 'honeymoon' && m.honeymoonDone;
                return '<button class="c-btn c-btn-sm c-btn-gold" style="margin:2px;" ' + (disabled ? 'disabled' : '') +
                    ' onclick="doMaritalActivity(\'' + a.id + '\',' + row.i + ')">' + a.name +
                    (disabled ? '（已度）' : ' +' + a.bond) + '</button>';
            }).join('');
            return '<div class="c-member" style="margin-bottom:10px;">' +
                '<span class="c-badge gen">' + (typeof getGenerationLabel === 'function' ? getGenerationLabel(m.generation || 1) : ('第' + (m.generation || 1) + '代')) + '</span>' +
                '<div class="name">' + m.name + ' × ' + (m.spouse && m.spouse.name) + '</div>' +
                '<div class="meta">恩爱 ' + bond + '/' + need + (gate.ok ? ' · 可孕育' : ' · 暂不可孕育') + '</div>' +
                '<div class="c-progress"><i style="width:' + pct + '%"></i><span>' + pct.toFixed(0) + '%</span></div>' +
                (!gate.ok ? '<div class="c-hint" style="color:#FF8A65;">' + gate.reason + '</div>' : '<div class="c-hint" style="color:#81C784;">可前往「传宗」孕育下一代</div>') +
                '<div style="margin-top:6px;">' + acts + '</div></div>';
        }).join('');
        // 成年未婚提示
        var unmarriedAdults = members.filter(function (m) { return isAdult(m) && !m.isMarried && (m.generation || 1) < 18; });
        if (unmarriedAdults.length) {
            html += '<div class="c-hint" style="margin-top:12px;">另有 ' + unmarriedAdults.length +
                ' 位成年未婚成员，请先在「传宗」安排成婚：' +
                unmarriedAdults.slice(0, 5).map(function (m) { return m.name; }).join('、') +
                (unmarriedAdults.length > 5 ? '…' : '') + '</div>';
        }
        box.innerHTML = html;
    }

    function updateLivingEighteenPanel() {
        var box = el('livingEighteenExtraPanel');
        if (!box) return;
        ensureLivingData();
        var ex = livingCfg().eighteenExtra;
        var L = player.children.living;
        var maxG = maxGeneration();
        var incenseLeft = Math.max(0, (L.incenseUntil || 0) - Date.now());
        var incenseCdLeft = Math.max(0, (L.incenseLast || 0) + (ex.incenseCd || 0) - Date.now());
        var dreamCdLeft = Math.max(0, (L.dreamLast || 0) + (ex.dreamCd || 0) - Date.now());
        var adultsReady = (player.children.children || []).filter(function (m) {
            return isAdult(m);
        }).length;
        var lampLv = L.lampLevel || 0;
        var lampNext = ex.lampCost * Math.pow(10, Math.min(lampLv, 5));
        var html = '<div class="c-hint">最远代数 ' + maxG + ' / 18 · 传灯阶 ' + lampLv + '/18 · 可承接托梦的成年 ' + adultsReady + ' 人' +
            (incenseLeft ? ' · 进香祝福剩余 ' + Math.ceil(incenseLeft / 60000) + ' 分钟' : '') + '</div>';
        html += '<div class="c-train-grid" style="margin-bottom:12px;">' +
            '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;"><div class="ms-title">十八代进香</div>' +
            '<div class="ms-desc">耗资 ' + fmt(ex.incenseCost) +
            (incenseCdLeft > 0 ? ' · 冷却 ' + Math.ceil(incenseCdLeft / 60000) + ' 分' : ' · 可进香') + '</div>' +
            '<button class="c-btn c-btn-gold" ' + (incenseCdLeft > 0 ? 'disabled' : '') + ' onclick="offerEighteenIncense()">' +
            (incenseCdLeft > 0 ? '冷却中' : '进香') + '</button></div>' +
            '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;"><div class="ms-title">十八代托梦</div>' +
            '<div class="ms-desc">耗资 ' + fmt(ex.dreamCost) +
            (dreamCdLeft > 0 ? ' · 冷却 ' + Math.ceil(dreamCdLeft / 60000) + ' 分' : (adultsReady ? ' · 可托梦' : ' · 暂无成年')) + '</div>' +
            '<button class="c-btn c-btn-purple" ' + (dreamCdLeft > 0 || !adultsReady ? 'disabled' : '') + ' onclick="invokeEighteenDream()">' +
            (dreamCdLeft > 0 ? '冷却中' : (!adultsReady ? '需成年' : '托梦')) + '</button></div>' +
            '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;"><div class="ms-title">血脉传灯</div>' +
            '<div class="ms-desc">当前 ' + lampLv + '/18 · 下级 ' + fmt(lampNext) + ' · 永久三维</div>' +
            '<button class="c-btn c-btn-orange" onclick="upgradeEighteenLamp()">升灯</button></div></div>';
        html += '<h4 style="margin:12px 0 8px;color:#E8C4A8;">代际祀典</h4>';
        html += (ex.genRites || []).map(function (r) {
            var done = !!L.genRitesDone[r.gen];
            var locked = maxG < r.gen;
            var gName = typeof getGenerationLabel === 'function' ? getGenerationLabel(r.gen) : ('第' + r.gen + '代');
            return '<div class="c-milestone' + (done ? ' done' : '') + '"><div><div class="ms-title">' + gName + ' · ' + r.name +
                '</div><div class="ms-desc">攻+' + (r.atk * 100) + '% 血+' + (r.hp * 100) + '% 爆+' + (r.crit * 100) + '% · ' + fmt(r.cost) +
                '</div></div>' +
                (done ? '<span style="color:#4CAF50;">已祀</span>' :
                    '<button class="c-btn c-btn-sm c-btn-gold" ' + (locked ? 'disabled' : '') +
                    ' onclick="performGenerationRite(' + r.gen + ')">' + (locked ? '未及此代' : '举行') + '</button>') +
                '</div>';
        }).join('');
        box.innerHTML = html;
    }

    function enhanceLineageActionLivingHints() {
        // 在传宗列表孕育按钮旁补充恩爱/生病提示（updateLineageActionList 之后）
        var container = el('lineageActionList');
        if (!container) return;
        ensureLivingData();
        var need = (livingCfg().marital && livingCfg().marital.bondNeedConceive) || 30;
        var hint = el('livingLineageGateHint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'livingLineageGateHint';
            hint.className = 'c-hint';
            hint.style.marginBottom = '10px';
            container.parentNode.insertBefore(hint, container);
        }
        hint.innerHTML = '生育门禁：成年 → 成婚 → 恩爱满 ' + need + ' → 方可孕育。生病可能禁止孕育。可在「婚育」「染恙」页管理。';
    }

    window.updateLivingPanels = function () {
        installLivingConfig();
        ensureLivingData();
        var tabOk = typeof childTabIn !== 'function' || childTabIn(['illness', 'living', 'marital', 'eighteen', 'realty', 'lineage', 'overview', 'birth']);
        if (!tabOk) return;
        var tab = typeof getChildActiveTab === 'function' ? getChildActiveTab() : (typeof _childActiveTab !== 'undefined' ? _childActiveTab : '');
        if (!tab || tab === 'illness' || tab === 'living' || window.__lineageForceFullRefresh) updateLivingIllnessPanel();
        if (!tab || tab === 'living' || window.__lineageForceFullRefresh) updateLivingChorePanel();
        if (!tab || tab === 'marital' || window.__lineageForceFullRefresh) updateLivingMaritalPanel();
        if (!tab || tab === 'eighteen' || window.__lineageForceFullRefresh) updateLivingEighteenPanel();
        if (!tab || tab === 'lineage' || tab === 'living' || tab === 'marital' || window.__lineageForceFullRefresh) {
            enhanceLineageActionLivingHints();
        }
    };

    // 挂到 UI 刷新链：不再无条件全量刷 living（由 refreshActiveChildTabPanels 按页签调用）
    var _origUpdateExt = window.updateLineageExtUI;
    window.updateLineageExtUI = function () {
        if (_origUpdateExt) _origUpdateExt();
    };

    // 主循环：染恙 tick
    function startLivingLoop() {
        var reg = typeof registerSingletonInterval === 'function' ? registerSingletonInterval : null;
        var fn = function () {
            try { tickIllness(); } catch (e) { /* ignore */ }
            var ui = document.getElementById('childSystemUI');
            if (ui && ui.style.display === 'block') {
                if (typeof refreshActiveChildTabPanels === 'function') refreshActiveChildTabPanels();
                else if (typeof updateLivingPanels === 'function') updateLivingPanels();
            }
        };
        if (reg) reg('_lineageLivingLoopId', fn, 60 * 1000);
        else if (typeof registerInterval === 'function') registerInterval(fn, 60 * 1000);
        else setInterval(fn, 60 * 1000);
    }

    installLivingConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            installLivingConfig();
            ensureLivingData();
            startLivingLoop();
        }, 1200);
    });
    // 若 DOM 已就绪（脚本晚加载）
    if (document.readyState !== 'loading') {
        setTimeout(function () {
            installLivingConfig();
            ensureLivingData();
            startLivingLoop();
        }, 1200);
    }
})();

/**
 * 家族传承 · 子弟尘世 · 智能邻里 NPC
 * 现实向：问诊、短工、租税、人情礼金、天气穿衣、陪读接送、买菜下厨、债务往来…
 * AI 智能 NPC：郎中/掌柜/塾师/媒婆/街坊/驿丞/老仆——根据族况、心情、天气、代数动态回话并记仇记恩
 * 在 descendants-flow.js 之后加载；升级类 12h。不改变婚育门禁。
 */
(function () {
    'use strict';
    var HOUR_MS = 60 * 60 * 1000;
    var DAY_MS = 24 * 60 * 60 * 1000;
    var CD_12H = 12 * HOUR_MS;

    function cfg() { return window.lineageExtConfig; }
    function funds() { return player.investmentGame.userData; }
    function fmt(n) { return typeof formatSci === 'function' ? formatSci(n) : String(n); }
    function bal() {
        var ud = funds();
        return ud.availableFunds != null ? ud.availableFunds : (ud.funds || 0);
    }
    function pay(cost) {
        var ud = funds();
        if (bal() < cost) {
            logAction('资金不足（需 ' + fmt(cost) + '）', 'error');
            return false;
        }
        if (ud.availableFunds != null) ud.availableFunds -= cost;
        else ud.funds -= cost;
        return true;
    }
    function isAdult(m) {
        return typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : !!(m && m.isAdult);
    }
    function isMarried(m) {
        return !!(m && (m.isMarried || m.married || m.spouseId || m.spouseName || (m.spouse && m.spouse.name)));
    }
    function isSick(m) {
        return typeof isFamilyMemberSick === 'function' ? isFamilyMemberSick(m) : !!(m && m.illness);
    }
    function N() { return (cfg() && cfg().descNpc) || {}; }
    function genLabel(g) {
        return typeof getGenerationLabel === 'function' ? getGenerationLabel(g) : ('第' + g + '代');
    }

    function installNpcConfig() {
        if (!window.lineageExtConfig) return;
        var c = window.lineageExtConfig;
        if (c._descNpcInstalled) return;
        c._descNpcInstalled = true;

        c.descNpc = {
            // —— 邻里会馆（族级 12h）——
            hall: {
                maxLv: 14,
                costBase: 88000000,
                growth: 2.68,
                per: { atk: 0.95, hp: 1.2, crit: 0.85 },
                needMembers: 2
            },
            // —— 现实：问诊 ——
            clinic: [
                { id: 'pulse', name: '号脉问诊', cost: 8000000, cd: 4 * HOUR_MS, mood: 3, healChance: 0.35, worldHp: 0.3,
                  line: '郎中搭脉，说{name}「气虚了一寸」。药方开得很短，话却很长。' },
                { id: 'tonic', name: '抓药调理', cost: 15000000, cd: 5 * HOUR_MS, mood: 4, sleep: 5, healChance: 0.55, worldHp: 0.5,
                  line: '{name}煎完药，苦得皱眉，却坚持喝完。' },
                { id: 'check_child', name: '带孩子看诊', cost: 10000000, cd: 4 * HOUR_MS, mood: 5, needChild: true, healChance: 0.4,
                  line: '孩子怕苦。{name}先尝了一口，说「不苦」——骗得自己都信。' },
                { id: 'annual', name: '岁末全检', cost: 40000000, cd: CD_12H, mood: 6, fame: 4, worldHp: 1.0, healChance: 0.7,
                  line: '岁末全检。郎中说：你们家身子底还行，心别太累。' }
            ],
            // —— 现实：短工 ——
            gig: [
                { id: 'carry', name: '码头扛货', cost: 0, earn: 12000000, cd: 4 * HOUR_MS, needAdult: true, attr: 'physique', gain: 2, mood: -1,
                  line: '{name}扛到肩红，银子入手，腰却直了。' },
                { id: 'copy', name: '代写书信', cost: 0, earn: 8000000, cd: 3 * HOUR_MS, needAdult: true, attr: 'intelligence', gain: 2, mood: 2,
                  line: '{name}替人写信，把自己的心事也写淡了一点。' },
                { id: 'sell', name: '帮摊叫卖', cost: 0, earn: 10000000, cd: 4 * HOUR_MS, attr: 'business', gain: 2, mood: 3,
                  line: '{name}嗓子喊哑了，货却清了。掌柜多塞了一文。' },
                { id: 'tutor', name: '临时代课', cost: 0, earn: 15000000, cd: 5 * HOUR_MS, needAdult: true, attr: 'intelligence', gain: 2, fame: 2,
                  line: '{name}替塾师看了一日课，孩子们叫「先生」，{name}耳根发热。' },
                { id: 'night_watch', name: '更夫替班', cost: 0, earn: 9000000, cd: 5 * HOUR_MS, needAdult: true, attr: 'physique', gain: 1, sleep: -8, fame: 1,
                  line: '{name}替了一夜更，天亮时把灯还回去，眼睛却亮着。' }
            ],
            // —— 现实：租税 ——
            tax: [
                { id: 'land', name: '缴田租', cost: 25000000, cd: 8 * HOUR_MS, mood: -2, fame: 3, worldHp: 0.4,
                  line: '田租交清。{name}说：地还在，人就还站得住。' },
                { id: 'house', name: '缴屋税', cost: 18000000, cd: 8 * HOUR_MS, mood: -1, fame: 2, worldAtk: 0.25,
                  line: '屋税单据收进匣。{name}摸了摸门框：这屋还是咱们的。' },
                { id: 'corvee', name: '折役银', cost: 30000000, cd: 10 * HOUR_MS, needAdult: true, fame: 4, worldAtk: 0.35,
                  line: '{name}用银折了徭役，换来几日陪家人的时间。' }
            ],
            // —— 现实：人情礼金 ——
            giftMoney: [
                { id: 'wedding', name: '随喜份子', cost: 20000000, cd: 6 * HOUR_MS, mood: 5, fame: 5, favorNpc: 8,
                  line: '红包递出。{name}说「恭喜」，自己也想起家里的灯。' },
                { id: 'funeral', name: '吊唁礼金', cost: 15000000, cd: 6 * HOUR_MS, mood: 2, fame: 4, favorNpc: 10,
                  line: '{name}把礼金放得轻，话放得更轻。' },
                { id: 'birth', name: '添丁贺礼', cost: 12000000, cd: 5 * HOUR_MS, mood: 6, fame: 3, favorNpc: 6,
                  line: '贺礼换来一颗喜糖。{name}含着，甜到心里。' },
                { id: 'move', name: '乔迁随礼', cost: 10000000, cd: 5 * HOUR_MS, mood: 4, fame: 3, favorNpc: 5,
                  line: '{name}去道喜，回来鞋底沾了新土，心情也新了。' }
            ],
            // —— 现实：天气穿衣 ——
            weatherGear: [
                { id: 'umbrella', name: '备雨具', cost: 5000000, cd: 4 * HOUR_MS, mood: 3, worldHp: 0.25,
                  line: '{name}把伞修好。雨来时，全族少淋一回。' },
                { id: 'coat', name: '添寒衣', cost: 12000000, cd: 5 * HOUR_MS, mood: 5, sleep: 3, worldHp: 0.4,
                  line: '棉衣落地。{name}说「先给老人穿」，自己袖口还破着。' },
                { id: 'fan', name: '夏日蒲扇', cost: 3000000, cd: 3 * HOUR_MS, mood: 4,
                  line: '{name}摇扇驱蚊，扇风给别人，汗留给自己。' },
                { id: 'boots', name: '换雨靴', cost: 8000000, cd: 5 * HOUR_MS, mood: 3, attr: 'physique', gain: 1,
                  line: '新靴踩泥不湿脚。{name}走路都稳了些。' }
            ],
            // —— 现实：陪读接送 ——
            schoolRun: [
                { id: 'walk', name: '护送上学', cost: 3000000, cd: 3 * HOUR_MS, mood: 5, intimacy: 2, needChild: true,
                  line: '{name}把孩子送到塾门口，回头看了三次。' },
                { id: 'pickup', name: '放学接回', cost: 3000000, cd: 3 * HOUR_MS, mood: 5, intimacy: 2, needChild: true,
                  line: '孩子跑来抱腿。{name}的袖子立刻沾上墨。' },
                { id: 'homework', name: '陪写功课', cost: 5000000, cd: 4 * HOUR_MS, mood: 3, attr: 'intelligence', gain: 1, needChild: true, intimacy: 3,
                  line: '{name}陪写到灯尽，错字改完，脾气也改完了。' },
                { id: 'exam_cheer', name: '考前打气', cost: 6000000, cd: 5 * HOUR_MS, mood: 6, fame: 2, needChild: true,
                  line: '{name}只说一句「尽力就好」。孩子却听成了「我信你」。' }
            ],
            // —— 现实：买菜下厨 ——
            kitchen: [
                { id: 'shop_veg', name: '买时令菜', cost: 4000000, cd: 3 * HOUR_MS, mood: 4, stock: 1,
                  line: '{name}挑菜时讨价还价，最后多买了一把葱。' },
                { id: 'cook_home', name: '回家开伙', cost: 2000000, cd: 3 * HOUR_MS, mood: 6, needStock: 1, sleep: 2, worldHp: 0.2,
                  line: '锅气一开，屋里就有了家的味道。{name}把最大的肉夹给别人。' },
                { id: 'soup', name: '熬一锅汤', cost: 6000000, cd: 4 * HOUR_MS, mood: 7, sleep: 4, worldHp: 0.35,
                  line: '汤熬到夜深。{name}说「明天还能热一回」。' },
                { id: 'feast_prep', name: '备宴采购', cost: 25000000, cd: 6 * HOUR_MS, mood: 5, fame: 4, needAdult: true, worldHp: 0.5,
                  line: '{name}采购到手腕酸，单子上每个「够」字都写得很用力。' }
            ],
            // —— 现实：债务往来 ——
            debt: [
                { id: 'lend', name: '借出应急', cost: 20000000, cd: 6 * HOUR_MS, mood: 3, fame: 5, favorNpc: 12, debtOut: 1,
                  line: '{name}把银子借出，说「不急着还」——眼神却诚实。' },
                { id: 'repay_collect', name: '收回欠款', cost: 2000000, cd: 5 * HOUR_MS, needDebtOut: 1, earn: 18000000, mood: 4, fame: 2,
                  line: '欠款回来一部分。{name}没多问，只把人情记在心里。' },
                { id: 'borrow', name: '开口借银', cost: 0, earn: 30000000, cd: 8 * HOUR_MS, mood: -2, fame: -1, favorNpc: -5, debtIn: 1,
                  line: '{name}低了低头，把银子接过。脊背却更直了——要还。' },
                { id: 'payback', name: '还清人情债', cost: 35000000, cd: 6 * HOUR_MS, needDebtIn: 1, mood: 8, fame: 6, favorNpc: 15,
                  line: '{name}把债还清，连利息都多放了一点。对方说「够义气」。' }
            ],
            // —— 智能 NPC 定义 ——
            npcs: [
                {
                    id: 'doctor', name: '柳郎中', title: '医庐先生', trait: '稳重',
                    topics: ['health', 'family', 'advice', 'weather', 'idle'],
                    greet: ['脉枕擦干净了。坐吧。', '又是你们家。坐下，先喝口水。'],
                    style: 'care'
                },
                {
                    id: 'shopkeep', name: '钱掌柜', title: '南街商号', trait: '精明',
                    topics: ['money', 'market', 'family', 'advice', 'idle'],
                    greet: ['哟，贵客。今日行情不错。', '算盘都替你们响过了，说吧。'],
                    style: 'sharp'
                },
                {
                    id: 'tutor', name: '周塾师', title: '里中私塾', trait: '严正',
                    topics: ['study', 'child', 'family', 'advice', 'idle'],
                    greet: ['书卷摊着。有话坐下说。', '孩子们刚散学。你来得巧。'],
                    style: 'strict'
                },
                {
                    id: 'matchmaker', name: '王媒婆', title: '红线中人', trait: '热络',
                    topics: ['marriage', 'gossip', 'family', 'advice', 'idle'],
                    greet: ['哎呦，稀客！坐下吃茶。', '我正念叨你们家呢。'],
                    style: 'warm'
                },
                {
                    id: 'neighbor', name: '赵二叔', title: '对门街坊', trait: '直爽',
                    topics: ['neighbor', 'weather', 'family', 'gossip', 'idle'],
                    greet: ['刚扫完自家门槛。进来坐。', '听见脚步就知道是你们。'],
                    style: 'plain'
                },
                {
                    id: 'postmaster', name: '驿丞老吴', title: '官道驿站', trait: '见闻广',
                    topics: ['travel', 'news', 'family', 'advice', 'idle'],
                    greet: ['马刚卸鞍。有话快说。', '远路上听过你们族名。'],
                    style: 'worldly'
                },
                {
                    id: 'oldservant', name: '阿福', title: '老宅旧仆', trait: '忠诚',
                    topics: ['home', 'elder', 'memory', 'family', 'idle'],
                    greet: ['少爷/主母……我还是叫旧称呼习惯。', '灶还热着。您坐。'],
                    style: 'loyal'
                }
            ],
            talkCd: 2 * HOUR_MS,
            talkFavorCd: 24 * HOUR_MS,
            favorTiers: [
                { need: 0, name: '面熟' },
                { need: 20, name: '相识' },
                { need: 50, name: '相熟' },
                { need: 90, name: '深交' },
                { need: 140, name: '生死之交' }
            ]
        };

        var moreEvents = [
            { id: 'npc_feast', title: '邻里聚餐', text: '赵二叔提议今晚对门支锅，郎中、掌柜也都来。',
              choices: [
                { label: '做东升级会馆', cost: 120000000, effect: 'npcHallReady', prestige: 20, worldHp: 5 },
                { label: '带一壶酒去', cost: 30000000, effect: 'npcFavorAll', prestige: 12 },
                { label: '改日再说', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'clinic_busy', title: '医庐爆满', text: '时令病起，柳郎中忙到灯尽。有人请你们家帮衬。',
              choices: [
                { label: '资药并问诊日', cost: 80000000, effect: 'npcClinicBoost', prestige: 16, worldHp: 4 },
                { label: '派人帮忙抓药', cost: 25000000, effect: 'livingMood', amount: 6, prestige: 8 },
                { label: '自顾不暇', cost: 0, effect: 'none', prestige: 1 }
              ]}
        ];
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'clinic1', name: '问诊一次', desc: '完成问诊 1 次', need: 1, key: 'npcClinic', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'gig1', name: '短工营生', desc: '完成短工 1 次', need: 1, key: 'npcGig', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'talk2', name: '智邻交谈', desc: '与 NPC 交谈 2 次', need: 2, key: 'npcTalk', rewardPrestige: 16, rewardFunds: 6000000, rewardExp: 14 },
            { id: 'kitchen1', name: '开伙一次', desc: '买菜或下厨 1 次', need: 1, key: 'npcKitchen', rewardPrestige: 12, rewardFunds: 4000000, rewardExp: 10 },
            { id: 'npcUp1', name: '会馆营建', desc: '升级邻里会馆 1 次', need: 1, key: 'npcUp', rewardPrestige: 22, rewardFunds: 12000000, rewardExp: 18 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensureNpcData() {
        if (!player.children) return;
        installNpcConfig();
        if (!player.children.descNpc) {
            player.children.descNpc = {
                hallLv: 0, hallCd: 0, hallReady: false,
                clinicCd: {}, gigCd: {}, taxCd: {}, giftCd: {}, gearCd: {},
                schoolCd: {}, kitchenCd: {}, debtCd: {}, talkCd: {}, favorTalkCd: {},
                favor: {}, memory: {}, lastChat: null,
                kitchenStock: 0, debtOut: 0, debtIn: 0,
                clinicBoost: false, chatLog: []
            };
        }
        var d = player.children.descNpc;
        ['clinicCd', 'gigCd', 'taxCd', 'giftCd', 'gearCd', 'schoolCd', 'kitchenCd', 'debtCd', 'talkCd', 'favorTalkCd', 'favor', 'memory'].forEach(function (k) {
            if (!d[k] || typeof d[k] !== 'object') d[k] = {};
        });
        if (!Array.isArray(d.chatLog)) d.chatLog = [];
        (N().npcs || []).forEach(function (npc) {
            if (d.favor[npc.id] == null) d.favor[npc.id] = 0;
            if (!Array.isArray(d.memory[npc.id])) d.memory[npc.id] = [];
        });
        if (d.kitchenStock == null) d.kitchenStock = 0;
        if (d.debtOut == null) d.debtOut = 0;
        if (d.debtIn == null) d.debtIn = 0;
    }

    function pushDiary(text) {
        if (!player.children.life && typeof ensureLifeData === 'function') ensureLifeData();
        if (!player.children.life) return;
        var d = player.children.life.diary;
        if (!Array.isArray(d)) { player.children.life.diary = []; d = player.children.life.diary; }
        d.unshift({ t: Date.now(), text: text });
        if (d.length > 110) d.length = 110;
    }

    function bump(key) {
        if (!player.children.dailyQuest) return;
        (cfg().dailyQuests || []).forEach(function (q) {
            if (q.key === key) player.children.dailyQuest.progress[q.id] = (player.children.dailyQuest.progress[q.id] || 0) + 1;
        });
    }

    function addMood(n) {
        if (!player.children.life) return;
        player.children.life.mood = Math.max(0, Math.min(100, (player.children.life.mood || 50) + (n || 0)));
    }

    function addFame(m, n) {
        if (!m) return;
        m.descFame = Math.max(0, (m.descFame || 0) + (n || 0));
    }

    function addSleep(m, n) {
        if (!m.nova) m.nova = { sleep: 70 };
        m.nova.sleep = Math.max(0, Math.min(100, (m.nova.sleep || 70) + (n || 0)));
    }

    function addAttr(m, key, n) {
        if (!m.attributes) m.attributes = {};
        m.attributes[key] = (m.attributes[key] || 0) + (n || 0);
    }

    function addTempWorld(atk, hp, crit, hours) {
        if (!player.children.life) return;
        if (!player.children.life.tempWorld) player.children.life.tempWorld = { atk: 0, hp: 0, crit: 0, until: 0 };
        var tw = player.children.life.tempWorld;
        if (Date.now() > (tw.until || 0)) { tw.atk = 0; tw.hp = 0; tw.crit = 0; }
        tw.atk += atk || 0;
        tw.hp += hp || 0;
        tw.crit += crit || 0;
        tw.until = Date.now() + (hours || 3) * HOUR_MS;
    }

    function refreshUI() {
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    }

    function maxGen() {
        var g = 0;
        (player.children.children || []).forEach(function (m) { g = Math.max(g, m.generation || 1); });
        return g;
    }

    function memberCount() { return (player.children.children || []).length; }

    function childrenOnly() {
        return (player.children.children || []).filter(function (m) { return !isAdult(m); });
    }

    function sickCount() {
        return (player.children.children || []).filter(isSick).length;
    }

    function marriedCount() {
        return (player.children.children || []).filter(isMarried).length;
    }

    function lifeMood() {
        return (player.children.life && player.children.life.mood) || 50;
    }

    function weatherName() {
        var w = player.children.livingReal && player.children.livingReal.weather;
        if (w && w.name) return w.name;
        if (player.children.living && player.children.living.weatherName) return player.children.living.weatherName;
        var hour = new Date().getHours();
        if (hour < 6) return '夜色';
        if (hour < 12) return '晨光';
        if (hour < 18) return '白日';
        return '暮色';
    }

    function cdLeft(until) { return Math.max(0, (until || 0) - Date.now()); }
    function cdHint(until) {
        var left = cdLeft(until);
        if (left <= 0) return '';
        return '冷却 ' + Math.floor(left / 3600000) + '时' + Math.ceil((left % 3600000) / 60000) + '分';
    }

    function getMember(idx) {
        var list = player.children.children || [];
        if (idx < 0 || idx >= list.length) return null;
        return list[idx];
    }

    function favorTier(v) {
        var tier = (N().favorTiers || [])[0];
        (N().favorTiers || []).forEach(function (t) {
            if (v >= t.need) tier = t;
        });
        return tier;
    }

    function addFavor(npcId, n) {
        var d = player.children.descNpc;
        d.favor[npcId] = Math.max(0, (d.favor[npcId] || 0) + (n || 0));
    }

    function remember(npcId, text) {
        var d = player.children.descNpc;
        if (!d.memory[npcId]) d.memory[npcId] = [];
        d.memory[npcId].unshift({ t: Date.now(), text: text });
        if (d.memory[npcId].length > 8) d.memory[npcId].length = 8;
        d.chatLog.unshift({ t: Date.now(), npc: npcId, text: text });
        if (d.chatLog.length > 40) d.chatLog.length = 40;
    }

    // ——— 智能回复引擎（基于族况的规则 AI）——
    function snapshotWorld() {
        var members = player.children.children || [];
        var richest = null;
        members.forEach(function (m) {
            if (!richest || (m.descFame || 0) > (richest.descFame || 0)) richest = m;
        });
        return {
            maxG: maxGen(),
            members: members.length,
            adults: members.filter(isAdult).length,
            kids: childrenOnly().length,
            sick: sickCount(),
            married: marriedCount(),
            mood: lifeMood(),
            weather: weatherName(),
            funds: bal(),
            prestige: player.children.clanPrestige || 0,
            star: richest,
            tablets: player.children.eighteen && player.children.eighteen.tablets
                ? Object.keys(player.children.eighteen.tablets).filter(function (k) { return player.children.eighteen.tablets[k]; }).length
                : 0
        };
    }

    function aiReply(npc, topic, member) {
        var s = snapshotWorld();
        var fav = player.children.descNpc.favor[npc.id] || 0;
        var tier = favorTier(fav).name;
        var mem = (player.children.descNpc.memory[npc.id] || [])[0];
        var name = member ? member.name : '你们家';
        var lines = [];

        // 开场随性格
        if (npc.style === 'care') lines.push(pick(npc.greet));
        else if (npc.style === 'sharp') lines.push(pick(npc.greet) + '（算盘轻拨了一下）');
        else if (npc.style === 'strict') lines.push(pick(npc.greet));
        else if (npc.style === 'warm') lines.push(pick(npc.greet) + '拉着你的袖口。');
        else if (npc.style === 'loyal') lines.push(pick(npc.greet));
        else lines.push(pick(npc.greet));

        if (mem) lines.push('我还记得上次：' + mem.text.slice(0, 36) + (mem.text.length > 36 ? '…' : ''));

        if (topic === 'health') {
            if (s.sick > 0) lines.push('我观你们府上似有人抱恙（约' + s.sick + '人）。莫硬扛，早治早安。');
            else lines.push(name + '气色尚可。今日天气「' + s.weather + '」，出入添衣即可。');
            if (s.mood < 40) lines.push('族中心情偏沉。药三分，话七分——多说软话。');
            else lines.push('心气顺，脉也顺。');
        } else if (topic === 'money' || topic === 'market') {
            if (s.funds > 5e11) lines.push('看得起你们手头宽裕。商路可大胆些，别只捂着银子睡。');
            else if (s.funds < 5e7) lines.push('近来银根紧？短工、帮摊都能换口粮，脸面事小，肚子事大。');
            else lines.push('行情平稳。油盐酱醋该备还是备，别等涨价才跺脚。');
            if (npc.id === 'shopkeep') lines.push('南街今日米价稳。要进货，我给你们留一袋。');
        } else if (topic === 'study' || topic === 'child') {
            if (s.kids < 1) lines.push('府上暂无就学童子。有了幼苗，记得送来——我眼严，心不狠。');
            else lines.push('府上有' + s.kids + '个孩子。功课别断，也别逼太紧。陪写一页，胜过吼十句。');
            if (member && !isAdult(member)) lines.push(member.name + '这孩子，我看过字，骨架有了，缺的是耐心。');
        } else if (topic === 'marriage') {
            if (s.married < 1) lines.push('府上姻缘线还淡。成人了莫耽搁，也别瞎催——红线怕急。');
            else lines.push('已有' + s.married + '桩婚事在屋。成婚后先养恩爱，再谈添丁，这话我说过八百遍。');
            lines.push('有合适的，我给递话；不合适的，我帮你们挡。');
        } else if (topic === 'family') {
            lines.push('你们已至' + genLabel(s.maxG) + '，族人' + s.members + '口，牌位约' + s.tablets + '座。');
            if (s.star) lines.push('眼下声望最亮的是' + s.star.name + '。别让一棵树遮住整片林。');
            if (s.prestige > 500) lines.push('族望在外，做事记得留余地。');
            else lines.push('族望还在长。稳着走，比跑得快重要。');
        } else if (topic === 'weather') {
            lines.push('今日「' + s.weather + '」。' + (s.weather.indexOf('雨') >= 0 || s.weather.indexOf('雪') >= 0
                ? '记得备雨具、添寒衣，别省那几文。'
                : '晴好时宜扫院、宜走动，也宜把心事晒一晒。'));
        } else if (topic === 'advice') {
            if (s.sick > 0) lines.push('我的忠告：先安病人，再谈别的。');
            else if (s.mood < 45) lines.push('我的忠告：今晚围炉说说话，银子赚不完，气要顺。');
            else if (s.maxG < 3) lines.push('我的忠告：根基尚浅，多立牌位、多走动邻里，别急着攀高。');
            else if (s.maxG >= 9) lines.push('我的忠告：代远了，更要常回祠堂看看——人不能只记得往前走。');
            else lines.push('我的忠告：短工可补日用，问诊莫拖，人情礼金该随就随。');
            lines.push('以我们「' + tier + '」的交情，这些话我只跟你们说。');
        } else if (topic === 'gossip' || topic === 'news') {
            lines.push(pick([
                '巷口都在传：哪家又为田界吵。你们家素来会劝，或许能管一管。',
                '驿路上说北地粮贵。若要贩，趁早；若要囤，量力。',
                '有人梦见旧灯。这种话当笑话听也好，当心也好。',
                '东头添了丁，西头在议亲。红白事一近，礼金匣子就醒。'
            ]));
        } else if (topic === 'neighbor' || topic === 'home') {
            lines.push('对门门槛我对过。你们家灯亮，整条巷都暖一点。');
            if (s.members > 20) lines.push('人多了，米缸要勤看，嘴上更要勤笑。');
        } else if (topic === 'travel') {
            lines.push('远路消息：商队要脚力，也要眼力。成年的派出去，幼的留家里守灯。');
            if (s.adults < 2) lines.push('成年人手紧，远行先缓缓。');
        } else if (topic === 'elder' || topic === 'memory') {
            lines.push('老宅门槛被磨亮的那一道，是十八代人的脚。别嫌它旧。');
            if (s.maxG >= 6) lines.push('我偶听牌位缝里有声响——大概是风。也大概不是。');
        } else {
            lines.push(pick([
                '今日无大事，喝茶也是事。',
                '看见你们，我就踏实。',
                '去忙吧。有事，门槛外喊一声就行。'
            ]));
        }

        // 好感微调台词
        if (fav >= 90) lines.push('（对方眼神很软）有难处，先来找我。');
        else if (fav < 15) lines.push('（尚有客套）改日熟了，话会更多。');

        var reply = lines.join('\n');
        if (typeof window.npcPlusEnrichReply === 'function') {
            try {
                reply = window.npcPlusEnrichReply(npc, topic, member, s, reply) || reply;
            } catch (e) { /* ignore */ }
        }
        return reply;
    }

    function pick(arr) {
        if (!arr || !arr.length) return '';
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // 供扩展模块复用
    window.__npcCore = {
        snapshotWorld: snapshotWorld,
        favorTier: favorTier,
        addFavor: addFavor,
        remember: remember,
        topicLabel: topicLabel,
        pick: pick,
        N: N,
        ensure: ensureNpcData,
        fmt: fmt,
        pay: pay,
        bal: bal,
        isAdult: isAdult,
        getMember: getMember,
        cdLeft: cdLeft,
        cdHint: cdHint,
        addMood: addMood,
        addFame: addFame,
        addAttr: addAttr,
        addTempWorld: addTempWorld,
        pushDiary: pushDiary,
        bump: bump,
        refreshUI: refreshUI,
        genLabel: genLabel,
        CD_12H: CD_12H,
        HOUR_MS: HOUR_MS
    };

    // ——— 族级 ———
    window.upgradeNpcHall = function () {
        ensureNpcData();
        var conf = N().hall;
        var d = player.children.descNpc;
        if ((d.hallLv || 0) >= conf.maxLv) return logAction('邻里会馆已满级', 'info');
        if (memberCount() < (conf.needMembers || 0)) return logAction('族人不足', 'error');
        if (cdLeft(d.hallCd) > 0 && !d.hallReady) return logAction(cdHint(d.hallCd), 'error');
        var cost = Math.floor(conf.costBase * Math.pow(conf.growth, d.hallLv || 0));
        if (!pay(cost)) return;
        d.hallLv = (d.hallLv || 0) + 1;
        d.hallCd = Date.now() + CD_12H;
        d.hallReady = false;
        bump('npcUp');
        pushDiary('邻里会馆升至 Lv.' + d.hallLv + '。茶更热，话更长。');
        logAction('邻里会馆 Lv.' + d.hallLv + '（12h）', 'success');
        refreshUI();
    };

    // ——— 现实行动 ———
    function doAct(listKey, cdMap, bumpKey, id, idx, extraCheck) {
        ensureNpcData();
        var act = (N()[listKey] || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        if (extraCheck && extraCheck(act, m) === false) return;
        if (act.needAdult && !isAdult(m)) return logAction('需成年', 'error');
        if (act.needChild && childrenOnly().length < 1 && isAdult(m)) {
            // allow if member themselves is child, else need family child
            if (isAdult(m) && childrenOnly().length < 1) return logAction('府上暂无孩子可陪护', 'error');
        }
        var d = player.children.descNpc;
        var key = id + ':' + m.id;
        if (cdLeft(d[cdMap][key]) > 0 && !(listKey === 'clinic' && d.clinicBoost)) return logAction(cdHint(d[cdMap][key]), 'error');
        if (act.needStock && (d.kitchenStock || 0) < act.needStock) return logAction('菜篮子空了，先买菜', 'error');
        if (act.needDebtOut && (d.debtOut || 0) < 1) return logAction('没有外借可收回', 'error');
        if (act.needDebtIn && (d.debtIn || 0) < 1) return logAction('没有待还之债', 'error');

        var cost = act.cost || 0;
        if (cost > 0 && !pay(cost)) return;
        if (act.earn) {
            var ud = funds();
            if (ud.availableFunds != null) ud.availableFunds += act.earn;
            else ud.funds = (ud.funds || 0) + act.earn;
        }

        d[cdMap][key] = Date.now() + act.cd;
        if (listKey === 'clinic') d.clinicBoost = false;
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        if (act.attr) addAttr(m, act.attr, act.gain || 1);
        if (act.sleep) addSleep(m, act.sleep);
        if (act.intimacy) m.intimacy = (m.intimacy || 0) + act.intimacy;
        if (act.stock) d.kitchenStock = (d.kitchenStock || 0) + act.stock;
        if (act.needStock) d.kitchenStock = Math.max(0, (d.kitchenStock || 0) - act.needStock);
        if (act.debtOut) d.debtOut = (d.debtOut || 0) + act.debtOut;
        if (act.needDebtOut) d.debtOut = Math.max(0, d.debtOut - 1);
        if (act.debtIn) d.debtIn = (d.debtIn || 0) + act.debtIn;
        if (act.needDebtIn) d.debtIn = Math.max(0, d.debtIn - 1);
        if (act.favorNpc) {
            (N().npcs || []).forEach(function (npc) { addFavor(npc.id, Math.floor(act.favorNpc / 3) || 1); });
        }
        if (act.healChance && Math.random() < act.healChance && isSick(m)) {
            if (m.illness) m.illness = null;
            if (m.sickUntil) m.sickUntil = 0;
            logAction(m.name + ' 似乎好了些', 'success');
        }
        addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 3);
        if (bumpKey) bump(bumpKey);
        var line = (act.line || act.name).replace(/\{name\}/g, m.name);
        if (act.earn) line += '（收入 ' + fmt(act.earn) + '）';
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    }

    window.doNpcClinic = function (id, idx) { doAct('clinic', 'clinicCd', 'npcClinic', id, idx); };
    window.doNpcGig = function (id, idx) { doAct('gig', 'gigCd', 'npcGig', id, idx); };
    window.doNpcTax = function (id, idx) { doAct('tax', 'taxCd', null, id, idx); };
    window.doNpcGift = function (id, idx) { doAct('giftMoney', 'giftCd', null, id, idx); };
    window.doNpcGear = function (id, idx) { doAct('weatherGear', 'gearCd', null, id, idx); };
    window.doNpcSchoolRun = function (id, idx) { doAct('schoolRun', 'schoolCd', null, id, idx); };
    window.doNpcKitchen = function (id, idx) { doAct('kitchen', 'kitchenCd', 'npcKitchen', id, idx); };
    window.doNpcDebt = function (id, idx) { doAct('debt', 'debtCd', null, id, idx); };

    // ——— 与 NPC 交谈（话题可聊；同一 NPC 好感每 24 小时最多 +1 次）———
    window.talkToNpc = function (npcId, topic, memberIdx) {
        ensureNpcData();
        var npc = (N().npcs || []).find(function (x) { return x.id === npcId; });
        if (!npc) return;
        if ((npc.topics || []).indexOf(topic) < 0 && topic !== 'idle') return logAction('对方不想谈这个', 'info');
        var d = player.children.descNpc;
        var key = npcId + ':' + topic;
        if (cdLeft(d.talkCd[key]) > 0) return logAction(cdHint(d.talkCd[key]), 'info');
        var m = memberIdx != null ? getMember(memberIdx) : null;
        var reply = aiReply(npc, topic, m);
        d.talkCd[key] = Date.now() + (N().talkCd || 2 * HOUR_MS);

        d._talkFavorGranted = false;
        var favorCdMs = N().talkFavorCd || (24 * HOUR_MS);
        if (cdLeft(d.favorTalkCd[npcId]) > 0) {
            reply += '\n（今日已叙过旧，好感冷却中：' + cdHint(d.favorTalkCd[npcId]) + '）';
        } else {
            var gain = 3 + Math.floor(Math.random() * 3);
            addFavor(npcId, gain);
            d.favorTalkCd[npcId] = Date.now() + favorCdMs;
            d._talkFavorGranted = true;
            reply += '\n（好感+' + gain + '，该智邻好感冷却 24 小时）';
        }

        remember(npcId, topicLabel(topic) + '：' + reply.split('\n').pop());
        d.lastChat = { npcId: npcId, topic: topic, reply: reply, at: Date.now() };
        bump('npcTalk');
        addMood(2);
        pushDiary('与「' + npc.name + '」谈' + topicLabel(topic) + '。');
        logAction('【' + npc.name + '】\n' + reply, 'info');
        refreshUI();
        if (typeof updateDescNpcPanels === 'function') updateDescNpcPanels();
    };

    function topicLabel(t) {
        var map = {
            health: '健康', money: '钱财', market: '行情', study: '学业', child: '孩子',
            marriage: '婚事', family: '族况', weather: '天气', advice: '求教', gossip: '闲话',
            news: '见闻', neighbor: '邻里', home: '家宅', travel: '远路', elder: '长辈',
            memory: '旧事', idle: '闲聊',
            craft: '手艺', law: '官府', tea: '茶事', fortune: '命理', romance: '姻缘细谈',
            martial: '武备', herb: '药理', river: '水路', night: '夜更'
        };
        if (typeof window.npcPlusTopicLabel === 'function') {
            var extra = window.npcPlusTopicLabel(t);
            if (extra) return extra;
        }
        return map[t] || t;
    }

    window.askNpcAdvice = function (npcId, memberIdx) {
        talkToNpc(npcId, 'advice', memberIdx);
    };

    function calcNpcWorld() {
        ensureNpcData();
        var atk = 0, hp = 0, crit = 0;
        var d = player.children.descNpc;
        var h = N().hall;
        atk += (d.hallLv || 0) * (h.per.atk || 0);
        hp += (d.hallLv || 0) * (h.per.hp || 0);
        crit += (d.hallLv || 0) * (h.per.crit || 0);
        // 深交 NPC 微弱永久加成
        (N().npcs || []).forEach(function (npc) {
            var fav = d.favor[npc.id] || 0;
            if (fav >= 90) { atk += 0.4; hp += 0.5; crit += 0.3; }
            else if (fav >= 50) { atk += 0.15; hp += 0.2; crit += 0.1; }
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        ensureNpcData();
        var base = _origBonus ? _origBonus() : { worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var w = calcNpcWorld();
        base.worldAtk = (base.worldAtk || 0) + w.atk;
        base.worldHp = (base.worldHp || 0) + w.hp;
        base.worldCritDmg = (base.worldCritDmg || 0) + w.crit;
        return base;
    };

    var _origResolve = window.resolveClanEvent;
    if (_origResolve) {
        window.resolveClanEvent = function (choiceIndex) {
            var ev = player.children && player.children.activeEvent;
            var ch = ev && ev.choices && ev.choices[choiceIndex];
            var result = _origResolve(choiceIndex);
            if (!ch) return result;
            ensureNpcData();
            var d = player.children.descNpc;
            if (ch.effect === 'npcHallReady') d.hallReady = true;
            else if (ch.effect === 'npcFavorAll') {
                (N().npcs || []).forEach(function (npc) { addFavor(npc.id, 10); });
                logAction('邻里好感普遍上升', 'success');
            } else if (ch.effect === 'npcClinicBoost') d.clinicBoost = true;
            return result;
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }
    function opts(filterFn) {
        return (player.children.children || []).map(function (m, i) {
            if (filterFn && !filterFn(m)) return '';
            return '<option value="' + i + '">' + m.name + '（' + genLabel(m.generation || 1) +
                (isSick(m) ? '·恙' : '') + '·望' + (m.descFame || 0) + '）</option>';
        }).join('');
    }

    function updateNpcHallPanel() {
        var box = el('npcHallPanel');
        if (!box) return;
        ensureNpcData();
        var d = player.children.descNpc;
        var conf = N().hall;
        var cost = Math.floor(conf.costBase * Math.pow(conf.growth, d.hallLv || 0));
        var tag = typeof lineageCostTag === 'function' ? lineageCostTag(cost, '12h冷却') : ('（' + fmt(cost) + ' · 12h）');
        box.innerHTML = '<div class="c-hint">邻里会馆 Lv.' + (d.hallLv || 0) + '/' + (conf.maxLv || '?') +
            (cdHint(d.hallCd) ? ' · ' + cdHint(d.hallCd) : '') +
            (d.hallReady ? ' · 就绪' : '') +
            ' · 下级耗资 <b style="color:#FFD700;">' + fmt(cost) + '</b>' +
            ' · 菜篮子 ' + (d.kitchenStock || 0) +
            ' · 外借 ' + (d.debtOut || 0) + ' · 待还 ' + (d.debtIn || 0) + '</div>' +
            '<button class="c-btn c-btn-gold" style="width:100%;" onclick="upgradeNpcHall()">升级邻里会馆' + tag + '</button>';
    }

    function updateNpcRealPanel() {
        var box = el('npcRealPanel');
        if (!box) return;
        ensureNpcData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="npcRealMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">问诊</h4><div class="c-train-grid">' + (N().clinic || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost) : ('耗资 ' + fmt(a.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="doNpcClinic(\'' + a.id + '\',+document.getElementById(\'npcRealMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">短工（挣钱）</h4><div class="c-train-grid">' + (N().gig || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div><div class="ms-desc">约入 ' + fmt(a.earn) + (a.cost ? ' · 垫资 ' + fmt(a.cost) : '') + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" onclick="doNpcGig(\'' + a.id + '\',+document.getElementById(\'npcRealMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">租税</h4><div class="c-train-grid">' + (N().tax || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost) : ('耗资 ' + fmt(a.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doNpcTax(\'' + a.id + '\',+document.getElementById(\'npcRealMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateNpcDailyPanel() {
        var box = el('npcDailyPanel');
        if (!box) return;
        ensureNpcData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="npcDailyMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">人情礼金</h4><div class="c-train-grid">' + (N().giftMoney || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost) : ('耗资 ' + fmt(a.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doNpcGift(\'' + a.id + '\',+document.getElementById(\'npcDailyMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">天气穿衣</h4><div class="c-train-grid">' + (N().weatherGear || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost) : ('耗资 ' + fmt(a.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doNpcGear(\'' + a.id + '\',+document.getElementById(\'npcDailyMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">陪读接送</h4><div class="c-train-grid">' + (N().schoolRun || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost) : ('耗资 ' + fmt(a.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-purple" onclick="doNpcSchoolRun(\'' + a.id + '\',+document.getElementById(\'npcDailyMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">买菜下厨</h4><div class="c-train-grid">' + (N().kitchen || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost) : ('耗资 ' + fmt(a.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="doNpcKitchen(\'' + a.id + '\',+document.getElementById(\'npcDailyMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">债务往来</h4><div class="c-train-grid">' + (N().debt || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost, a.earn ? ('约入 ' + fmt(a.earn)) : null) : ((a.cost ? ('耗资 ' + fmt(a.cost)) : '免费') + (a.earn ? (' · 约入 ' + fmt(a.earn)) : ''))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" onclick="doNpcDebt(\'' + a.id + '\',+document.getElementById(\'npcDailyMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateNpcChatPanel() {
        var box = el('npcChatPanel');
        if (!box) return;
        ensureNpcData();
        var d = player.children.descNpc;
        var s = snapshotWorld();
        var html = '<div class="c-hint">智能邻里会读取族况回话并记住交往。同一 NPC 对话加好感每 <strong>24 小时</strong>仅一次；冷却期内仍可交谈，但不再涨好感。</div>';
        html += '<div class="c-form-row"><label>随行子弟</label><select id="npcChatMember" class="c-input">' + opts() + '</select></div>';
        html += '<div class="c-train-grid">';
        (N().npcs || []).forEach(function (npc) {
            var fav = d.favor[npc.id] || 0;
            var tier = favorTier(fav);
            var favCd = cdHint(d.favorTalkCd[npc.id]);
            html += '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + npc.name + ' · ' + npc.title + '</div>' +
                '<div class="ms-desc">' + npc.trait + ' · ' + tier.name + '（' + fav + '）' +
                (favCd ? ' · <span style="color:#FFB74D;">好感冷却 ' + favCd.replace(/^冷却/, '') + '</span>' : ' · 好感可涨') + '</div>' +
                '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">';
            (npc.topics || []).forEach(function (t) {
                html += '<button class="c-btn c-btn-sm c-btn-purple" onclick="talkToNpc(\'' + npc.id + '\',\'' + t +
                    '\',+document.getElementById(\'npcChatMember\').value)">' + topicLabel(t) + '</button>';
            });
            html += '</div></div>';
        });
        html += '</div>';
        if (d.lastChat && d.lastChat.reply) {
            var npc = (N().npcs || []).find(function (x) { return x.id === d.lastChat.npcId; });
            html += '<div class="c-card" style="margin-top:12px;padding:10px;background:rgba(0,0,0,0.25);border-radius:8px;">' +
                '<div style="color:#E8C4A8;margin-bottom:6px;">最近对话 · ' + (npc ? npc.name : '') + ' · ' + topicLabel(d.lastChat.topic) + '</div>' +
                '<pre style="white-space:pre-wrap;margin:0;font-family:inherit;font-size:13px;line-height:1.55;color:#f0e6d8;">' +
                escapeHtml(d.lastChat.reply) + '</pre></div>';
        }
        if (d.chatLog && d.chatLog.length) {
            html += '<div class="c-hint" style="margin-top:10px;">近期记忆摘录</div><ul style="font-size:12px;padding-left:18px;margin:4px 0;">';
            d.chatLog.slice(0, 5).forEach(function (c) {
                var n = (N().npcs || []).find(function (x) { return x.id === c.npc; });
                html += '<li>' + (n ? n.name : c.npc) + ' — ' + escapeHtml((c.text || '').slice(0, 48)) + '</li>';
            });
            html += '</ul>';
        }
        box.innerHTML = html;
    }

    function escapeHtml(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    window.updateDescNpcPanels = function () {
        installNpcConfig();
        ensureNpcData();
        updateNpcHallPanel();
        updateNpcRealPanel();
        updateNpcDailyPanel();
        updateNpcChatPanel();
    };

    // 不再从流年 / living 级联刷新智邻；由 refreshActiveChildTabPanels 按页签刷新

    var _origSwitch = window.switchChildTab;
    window.switchChildTab = function (tab) {
        if (_origSwitch) _origSwitch(tab);
        var node = document.getElementById('childSectionDescNpc');
        if (node) node.classList.toggle('active', tab === 'descnpc');
    };

    installNpcConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            installNpcConfig();
            ensureNpcData();
        }, 3000);
    });
    if (document.readyState !== 'loading') {
        setTimeout(function () {
            installNpcConfig();
            ensureNpcData();
        }, 3000);
    }
})();

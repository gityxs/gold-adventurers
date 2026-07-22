/**
 * 家族传承 · 智邻扩充
 * 更多智能 NPC、委托、送礼、请茶、密授、誓约、日常心境、专属互动
 * 在 descendants-npc.js 之后加载
 */
(function () {
    'use strict';
    var HOUR_MS = 60 * 60 * 1000;
    var CD_12H = 12 * HOUR_MS;

    function core() { return window.__npcCore || {}; }
    function cfg() { return window.lineageExtConfig; }
    function N() { return (cfg() && cfg().descNpc) || {}; }

    function installNpcPlus() {
        if (!window.lineageExtConfig || !window.lineageExtConfig.descNpc) return;
        var c = window.lineageExtConfig;
        if (c._descNpcPlusInstalled) return;
        c._descNpcPlusInstalled = true;
        var D = c.descNpc;

        var extraNpcs = [
            {
                id: 'blacksmith', name: '铁匠老周', title: '西巷铁铺', trait: '憨直',
                topics: ['craft', 'martial', 'family', 'advice', 'idle'],
                greet: ['炉火正旺。有话大声说！', '锤子先放下。坐。'],
                style: 'plain'
            },
            {
                id: 'teahost', name: '茶馆柳娘', title: '春风茶楼', trait: '慧黠',
                topics: ['tea', 'gossip', 'news', 'family', 'idle'],
                greet: ['新茶刚沏。上座。', '你们家脚步声，我隔着帘子都认得。'],
                style: 'warm'
            },
            {
                id: 'constable', name: '捕快小陈', title: '县衙巡捕', trait: '正直',
                topics: ['law', 'news', 'neighbor', 'advice', 'idle'],
                greet: ['公务在身，闲话少说——你们例外。', '刀挂着，心不挂着。坐。'],
                style: 'strict'
            },
            {
                id: 'embroider', name: '绣娘阿秀', title: '绣坊', trait: '细腻',
                topics: ['craft', 'romance', 'child', 'family', 'idle'],
                greet: ['针停了一下。你们来了。', '绣绷还热着，先喝茶。'],
                style: 'care'
            },
            {
                id: 'peddler', name: '货郎刘三', title: '走街货郎', trait: '活络',
                topics: ['market', 'travel', 'news', 'money', 'idle'],
                greet: ['货担放下！稀客稀客。', '今日新到几样小玩意，先说话后看货。'],
                style: 'sharp'
            },
            {
                id: 'fortune', name: '袁半仙', title: '测字摊', trait: '玄虚',
                topics: ['fortune', 'family', 'advice', 'memory', 'idle'],
                greet: ['字未测，气先到。坐。', '铜钱一响，天机半开——也或许只是风。'],
                style: 'worldly'
            },
            {
                id: 'watchman', name: '更夫老刘', title: '巷口更楼', trait: '清醒',
                topics: ['night', 'neighbor', 'weather', 'advice', 'idle'],
                greet: ['梆子歇着。夜还长。', '你们不睡，我也不困。'],
                style: 'plain'
            },
            {
                id: 'herb_boy', name: '药童小椿', title: '医庐学徒', trait: '勤快',
                topics: ['herb', 'health', 'study', 'family', 'idle'],
                greet: ['师父不在，我先陪着！', '药柜擦亮了。您问什么？'],
                style: 'loyal'
            },
            {
                id: 'boatwoman', name: '船娘阿禾', title: '渡口', trait: '豁达',
                topics: ['river', 'travel', 'weather', 'family', 'idle'],
                greet: ['船缆解着。要渡？还是只要说话？', '水声替我迎客。'],
                style: 'worldly'
            }
        ];
        D.npcs = D.npcs || [];
        extraNpcs.forEach(function (npc) {
            if (!D.npcs.some(function (x) { return x.id === npc.id; })) D.npcs.push(npc);
        });

        // 扩充原 NPC 话题
        var topicBoost = {
            doctor: ['herb'],
            shopkeep: ['craft'],
            tutor: ['fortune'],
            matchmaker: ['romance'],
            neighbor: ['night'],
            postmaster: ['river'],
            oldservant: ['tea']
        };
        D.npcs.forEach(function (npc) {
            var add = topicBoost[npc.id];
            if (!add) return;
            add.forEach(function (t) {
                if ((npc.topics || []).indexOf(t) < 0) npc.topics.push(t);
            });
        });

        // —— 送礼 ——
        D.gifts = [
            { id: 'tea', name: '送新茶', cost: 8000000, cd: 4 * HOUR_MS, favor: 8, mood: 3,
              like: ['teahost', 'tutor', 'doctor', 'oldservant'], line: '{npc}接过茶，嗅了嗅：「这味道，懂事。」' },
            { id: 'wine', name: '送陈酒', cost: 12000000, cd: 4 * HOUR_MS, favor: 8, mood: 4,
              like: ['neighbor', 'blacksmith', 'postmaster', 'watchman'], line: '{npc}拍案：「够朋友！」' },
            { id: 'cloth', name: '送细布', cost: 15000000, cd: 5 * HOUR_MS, favor: 10, mood: 4,
              like: ['embroider', 'matchmaker', 'teahost'], line: '{npc}摸着布：「针脚有着落了。」' },
            { id: 'herb', name: '送药材', cost: 18000000, cd: 5 * HOUR_MS, favor: 10, mood: 3,
              like: ['doctor', 'herb_boy'], line: '{npc}验了验：「成色不错。」' },
            { id: 'toy', name: '送小玩意', cost: 5000000, cd: 3 * HOUR_MS, favor: 6, mood: 5,
              like: ['peddler', 'herb_boy', 'embroider'], line: '{npc}笑出声：「还挺有心思。」' },
            { id: 'blade_oil', name: '送刀油', cost: 10000000, cd: 5 * HOUR_MS, favor: 9, mood: 3,
              like: ['blacksmith', 'constable'], line: '{npc}点头：「懂行。」' },
            { id: 'book', name: '送旧书', cost: 14000000, cd: 5 * HOUR_MS, favor: 10, mood: 4,
              like: ['tutor', 'fortune', 'doctor'], line: '{npc}翻开一页：「字比人老实。」' }
        ];

        // —— 请茶 / 设宴 ——
        D.invite = [
            { id: 'tea', name: '请茶一盏', cost: 6000000, cd: 3 * HOUR_MS, favor: 5, mood: 4,
              line: '与{npc}对坐饮茶。话不急，茶先热。' },
            { id: 'meal', name: '请一顿便饭', cost: 20000000, cd: 6 * HOUR_MS, favor: 12, mood: 6, fame: 2,
              line: '与{npc}同桌。碗见底，情见底。' },
            { id: 'banquet', name: '设邻里小宴', cost: 60000000, cd: CD_12H, favorAll: 8, mood: 10, fame: 6, worldHp: 0.8,
              line: '小宴开席。邻里笑声把屋梁都震了震。' }
        ];

        // —— NPC 委托 ——
        D.commissions = [
            { id: 'herb_pick', name: '代采药草', npc: 'doctor', cost: 5000000, cd: 5 * HOUR_MS, needFavor: 20, favor: 15, earn: 0, fame: 4, worldHp: 0.4, attr: 'intelligence',
              line: '{name}按柳郎中所嘱采回药草，袖里还带着山气。' },
            { id: 'ledger_help', name: '帮对账册', npc: 'shopkeep', cost: 3000000, cd: 5 * HOUR_MS, needFavor: 20, favor: 14, fame: 3, attr: 'business',
              line: '{name}把账对清，钱掌柜少骂了两句——这是夸奖。' },
            { id: 'copy_books', name: '誊抄课卷', npc: 'tutor', cost: 4000000, cd: 5 * HOUR_MS, needFavor: 15, favor: 14, fame: 3, attr: 'intelligence',
              line: '{name}誊到腕酸，周塾师只说：「字站稳了。」' },
            { id: 'match_scout', name: '暗访门第', npc: 'matchmaker', cost: 8000000, cd: 6 * HOUR_MS, needFavor: 30, favor: 16, fame: 5, needAdult: true,
              line: '{name}替王媒婆问清门第，红线松了一寸，又紧了一寸。' },
            { id: 'fix_roof', name: '帮修屋檐', npc: 'neighbor', cost: 10000000, cd: 6 * HOUR_MS, needFavor: 15, favor: 15, fame: 4, attr: 'physique',
              line: '{name}爬上赵二叔屋檐，瓦正了，汗也正了。' },
            { id: 'escort_letter', name: '急件护送', npc: 'postmaster', cost: 12000000, cd: 6 * HOUR_MS, needFavor: 25, favor: 18, fame: 6, needAdult: true, attr: 'physique', worldAtk: 0.4,
              line: '{name}把急件护到驿站，靴底磨薄，眼神却亮。' },
            { id: 'polish_ancestral', name: '擦拭旧物', npc: 'oldservant', cost: 5000000, cd: 4 * HOUR_MS, needFavor: 10, favor: 12, fame: 3, mood: 5,
              line: '{name}与阿福一起擦旧物，灰尘里浮出从前的光。' },
            { id: 'forge_assist', name: '帮拉风箱', npc: 'blacksmith', cost: 6000000, cd: 5 * HOUR_MS, needFavor: 20, favor: 14, fame: 3, attr: 'physique',
              line: '{name}拉风箱拉到手抖，铁匠老周扔来一碗凉水：「成。」' },
            { id: 'tea_serve', name: '茶楼帮工', npc: 'teahost', cost: 0, earn: 9000000, cd: 4 * HOUR_MS, needFavor: 15, favor: 10, fame: 2, attr: 'charm',
              line: '{name}在茶楼忙到脚软，柳娘塞来一包茶末：「工钱外的心意。」' },
            { id: 'patrol_assist', name: '协巡巷口', npc: 'constable', cost: 5000000, cd: 5 * HOUR_MS, needFavor: 25, favor: 15, fame: 5, needAdult: true, worldAtk: 0.35,
              line: '{name}跟着捕快小陈巡巷，学会把心眼放亮。' },
            { id: 'embroider_thread', name: '理绣线', npc: 'embroider', cost: 4000000, cd: 4 * HOUR_MS, needFavor: 15, favor: 12, fame: 2, attr: 'charm',
              line: '{name}把绣线理顺，阿秀说：「手稳的人，心也不乱。」' },
            { id: 'spread_word', name: '帮传货讯', npc: 'peddler', cost: 3000000, cd: 4 * HOUR_MS, needFavor: 10, favor: 11, fame: 3, attr: 'business',
              line: '{name}帮货郎传了半条街的讯，嗓子哑了，路却熟了。' },
            { id: 'guard_stall', name: '守摊半日', npc: 'fortune', cost: 5000000, cd: 5 * HOUR_MS, needFavor: 20, favor: 13, fame: 3,
              line: '{name}替袁半仙守摊，听见三句天机、七句笑话。' },
            { id: 'night_round', name: '代打一更', npc: 'watchman', cost: 0, earn: 7000000, cd: 5 * HOUR_MS, needFavor: 15, favor: 12, fame: 2, sleep: -6,
              line: '{name}替老刘打了一更，巷口灯火比往常稳。' },
            { id: 'dry_herb', name: '晒药切片', npc: 'herb_boy', cost: 3000000, cd: 3 * HOUR_MS, needFavor: 10, favor: 10, fame: 2, attr: 'intelligence',
              line: '{name}与小椿晒药，苦味里混着少年志气。' },
            { id: 'ferry_help', name: '帮摆渡', npc: 'boatwoman', cost: 0, earn: 10000000, cd: 5 * HOUR_MS, needFavor: 20, favor: 14, fame: 3, needAdult: true, attr: 'physique',
              line: '{name}帮阿禾摆渡半日，河风把心事吹薄了。' }
        ];

        // —— 好感密授（12h）——
        D.secrets = [
            { id: 'pulse_tip', name: '柳郎中·诊脉要诀', npc: 'doctor', needFavor: 50, cost: 40000000, cd: CD_12H, worldHp: 1.2, attr: 'intelligence',
              line: '柳郎中低声授了半句要诀。{name}记在心里，比记在纸上牢。' },
            { id: 'abacus_tip', name: '钱掌柜·暗码算法', npc: 'shopkeep', needFavor: 50, cost: 45000000, cd: CD_12H, worldAtk: 1.0, attr: 'business',
              line: '钱掌柜敲了三下算盘：「这路数，只传你们。」' },
            { id: 'verse_tip', name: '周塾师·破题法', npc: 'tutor', needFavor: 50, cost: 42000000, cd: CD_12H, worldCritDmg: 1.1, attr: 'intelligence',
              line: '周塾师点破一处。{name}觉得书页忽然薄了，路却宽了。' },
            { id: 'forge_tip', name: '铁匠·淬火火候', npc: 'blacksmith', needFavor: 55, cost: 48000000, cd: CD_12H, worldAtk: 1.3, attr: 'physique',
              line: '炉火映着老周的脸：「火候到了，人也不能软。」' },
            { id: 'river_tip', name: '船娘·读水法', npc: 'boatwoman', needFavor: 55, cost: 46000000, cd: CD_12H, worldHp: 0.8, worldAtk: 0.6,
              line: '阿禾指着浪纹：「水会说话，你要会听。」' },
            { id: 'star_tip', name: '袁半仙·观气口诀', npc: 'fortune', needFavor: 60, cost: 50000000, cd: CD_12H, worldCritDmg: 1.2,
              line: '袁半仙收起铜钱：「天机不许说满。这一句，够你走很远。」' }
        ];

        // —— 金兰/知己誓约 ——
        D.bondOath = {
            cost: 80000000,
            cd: CD_12H,
            needFavor: 90,
            favor: 20,
            atk: 1.5, hp: 1.5, crit: 1.2,
            line: '与{npc}立下知己之约。酒薄，话重。'
        };

        // —— NPC 心境（每日）——
        D.moods = [
            { id: 'sunny', name: '兴致好', talkBonus: 2, favorBonus: 1 },
            { id: 'tired', name: '有些乏', talkBonus: 0, favorBonus: 0 },
            { id: 'worry', name: '心事重', talkBonus: -1, favorBonus: 0 },
            { id: 'busy', name: '忙得紧', talkBonus: 0, favorBonus: -1 },
            { id: 'warm', name: '特别热络', talkBonus: 3, favorBonus: 2 }
        ];

        var moreEvents = [
            { id: 'npc_plus_market', title: '货郎进巷', text: '刘三的货担摇进巷口，铃铛响得人心痒。',
              choices: [
                { label: '全族围看并打赏', cost: 50000000, effect: 'npcPlusFavorPeddler', prestige: 14, worldAtk: 2 },
                { label: '买两样小物', cost: 20000000, effect: 'livingMood', amount: 8, prestige: 8 },
                { label: '摆摆手走过', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'npc_plus_tea', title: '茶楼雅集', text: '柳娘请各路熟人来听一段旧曲。',
              choices: [
                { label: '做东请一轮', cost: 90000000, effect: 'npcPlusTeaBoost', prestige: 18, worldHp: 4 },
                { label: '带子弟去见见世面', cost: 30000000, effect: 'npcFavorAll', prestige: 10 },
                { label: '改日', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'npc_plus_forge', title: '铁铺夜锻', text: '西巷整夜炉火通明。老周说要打一件「能护住人」的家伙。',
              choices: [
                { label: '资炭助锻', cost: 100000000, effect: 'npcPlusForgeReady', prestige: 20, worldAtk: 5 },
                { label: '送一坛酒', cost: 25000000, effect: 'npcPlusFavorSmith', prestige: 10 },
                { label: '围观不插手', cost: 0, effect: 'none', prestige: 2 }
              ]}
        ];
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'gift1', name: '智邻送礼', desc: '向 NPC 送礼 1 次', need: 1, key: 'npcGift', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'comm1', name: '完成委托', desc: '完成 NPC 委托 1 次', need: 1, key: 'npcComm', rewardPrestige: 18, rewardFunds: 8000000, rewardExp: 15 },
            { id: 'invite1', name: '请茶设宴', desc: '请茶或设宴 1 次', need: 1, key: 'npcInvite', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'secret1', name: '听受密授', desc: '习得 NPC 密授 1 次', need: 1, key: 'npcSecret', rewardPrestige: 25, rewardFunds: 15000000, rewardExp: 20 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensurePlusData() {
        if (!player.children) return;
        if (typeof ensureNpcData === 'function') { /* base */ }
        if (core().ensure) core().ensure();
        installNpcPlus();
        var d = player.children.descNpc;
        if (!d) return;
        ['giftCd', 'inviteCd', 'commCd', 'secretCd', 'oathCd', 'npcMood'].forEach(function (k) {
            if (!d[k] || typeof d[k] !== 'object') d[k] = {};
        });
        if (!d.secretsLearned) d.secretsLearned = {};
        if (!d.oaths) d.oaths = {};
        if (d.forgeReady == null) d.forgeReady = false;
        if (d.teaBoost == null) d.teaBoost = false;
        rollNpcMoodsIfNeeded();
        (N().npcs || []).forEach(function (npc) {
            if (d.favor[npc.id] == null) d.favor[npc.id] = 0;
            if (!Array.isArray(d.memory[npc.id])) d.memory[npc.id] = [];
        });
    }

    function rollNpcMoodsIfNeeded() {
        var d = player.children.descNpc;
        var day = Math.floor(Date.now() / (24 * HOUR_MS));
        if (d.moodDay === day) return;
        d.moodDay = day;
        d.npcMood = {};
        var moods = N().moods || [];
        (N().npcs || []).forEach(function (npc) {
            d.npcMood[npc.id] = moods[Math.floor(Math.random() * moods.length)].id;
        });
    }

    function moodOf(npcId) {
        var d = player.children.descNpc;
        var id = d.npcMood && d.npcMood[npcId];
        return (N().moods || []).find(function (m) { return m.id === id; }) || { name: '平常', talkBonus: 0, favorBonus: 0 };
    }

    function npcById(id) {
        return (N().npcs || []).find(function (x) { return x.id === id; });
    }

    // —— 扩展话题文案 ——
    window.npcPlusTopicLabel = function (t) {
        var map = {
            craft: '手艺', law: '官府', tea: '茶事', fortune: '命理', romance: '姻缘细谈',
            martial: '武备', herb: '药理', river: '水路', night: '夜更'
        };
        return map[t] || null;
    };

    window.npcPlusEnrichReply = function (npc, topic, member, s, reply) {
        ensurePlusData();
        var mood = moodOf(npc.id);
        var extra = [];
        extra.push('（今日心境：' + mood.name + '）');

        if (topic === 'craft') {
            if (npc.id === 'blacksmith') extra.push('铁要千锤，人要一事。你们家若有子弟手稳，可来帮拉风箱。');
            else if (npc.id === 'embroider') extra.push('绣的是花，藏的是心。心乱了，线就打结。');
            else extra.push('手艺这东西，偷不走，只能练出来。');
        } else if (topic === 'law') {
            extra.push(s.prestige > 300
                ? '县里听说过你们族名。走路小心，别让名声变成把柄。'
                : '官府事莫逞能。有委屈，找我记一笔，能帮就帮。');
        } else if (topic === 'tea') {
            extra.push('茶泡到第三道最真。人交往，也是。');
            if (s.mood < 45) extra.push('看你们神色沉，先喝热的。话以后再说。');
        } else if (topic === 'fortune') {
            extra.push(s.maxG >= 9
                ? '代已深远。命盘上灯多，也更怕风。护住祠堂那盏。'
                : '根基还在长。别算太远，先把眼前一顿饭吃稳。');
        } else if (topic === 'romance') {
            extra.push(s.married > 0
                ? '成婚的要养恩爱，未婚的别被人催花。红线怕急，也怕冷。'
                : '姻缘未动。我替你们留意着，合适了再说，不合适我替你们挡。');
        } else if (topic === 'martial') {
            extra.push('兵刃可护宅，不可惹事。手劲用在该用处。');
        } else if (topic === 'herb') {
            extra.push(s.sick > 0
                ? '府上还有人抱恙。药味对了，人味也要对——陪着说话。'
                : '今季草药成色尚可。常备一点，总强过临时抱佛脚。');
        } else if (topic === 'river') {
            extra.push('河上风大。远行的带干粮，留家的留灯。');
        } else if (topic === 'night') {
            extra.push('夜里巷口安静是福。你们家灯亮，贼也绕道。');
        }

        var C = core();
        if (C.addFavor && mood.favorBonus) {
            /* favor applied on talk in wrap */
        }
        return reply + '\n' + extra.join('\n');
    };

    // wrap talk：心境好感加成仅在本次对话成功涨好感时叠加
    var _origTalk = window.talkToNpc;
    window.talkToNpc = function (npcId, topic, memberIdx) {
        ensurePlusData();
        if (_origTalk) _origTalk(npcId, topic, memberIdx);
        var d = player.children.descNpc;
        if (!d || !d._talkFavorGranted) return;
        var mood = moodOf(npcId);
        var C = core();
        if (C.addFavor && mood.favorBonus) C.addFavor(npcId, mood.favorBonus);
        if (C.addMood && mood.talkBonus) C.addMood(mood.talkBonus > 0 ? 1 : 0);
    };

    // —— 送礼 ——
    window.giftToNpc = function (giftId, npcId, memberIdx) {
        ensurePlusData();
        var C = core();
        var gift = (N().gifts || []).find(function (x) { return x.id === giftId; });
        var npc = npcById(npcId);
        var m = C.getMember ? C.getMember(memberIdx) : null;
        if (!gift || !npc) return;
        var d = player.children.descNpc;
        var key = giftId + ':' + npcId;
        if (C.cdLeft(d.giftCd[key]) > 0) return logAction(C.cdHint(d.giftCd[key]), 'info');
        if (!C.pay(gift.cost)) return;
        d.giftCd[key] = Date.now() + gift.cd;
        var fav = gift.favor || 5;
        if ((gift.like || []).indexOf(npcId) >= 0) fav = Math.floor(fav * 1.5);
        C.addFavor(npcId, fav);
        C.addMood(gift.mood || 0);
        C.bump('npcGift');
        var line = (gift.line || '').replace(/\{npc\}/g, npc.name).replace(/\{name\}/g, m ? m.name : '族人');
        C.remember(npcId, '收礼：' + gift.name);
        C.pushDiary(line);
        logAction(line + '（好感+' + fav + '）', 'success');
        C.refreshUI();
    };

    // —— 请茶设宴 ——
    window.inviteNpc = function (inviteId, npcId, memberIdx) {
        ensurePlusData();
        var C = core();
        var act = (N().invite || []).find(function (x) { return x.id === inviteId; });
        if (!act) return;
        var d = player.children.descNpc;
        var key = inviteId + (npcId || 'all');
        if (C.cdLeft(d.inviteCd[key]) > 0 && !d.teaBoost) return logAction(C.cdHint(d.inviteCd[key]), 'info');
        if (!C.pay(act.cost)) return;
        d.inviteCd[key] = Date.now() + act.cd;
        d.teaBoost = false;
        if (act.favorAll) {
            (N().npcs || []).forEach(function (n) { C.addFavor(n.id, act.favorAll); });
        } else if (npcId) {
            C.addFavor(npcId, act.favor || 5);
        }
        C.addMood(act.mood || 0);
        if (memberIdx != null && C.getMember(memberIdx)) C.addFame(C.getMember(memberIdx), act.fame || 0);
        C.addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 4);
        C.bump('npcInvite');
        var npc = npcById(npcId);
        var line = (act.line || '').replace(/\{npc\}/g, npc ? npc.name : '邻里');
        C.pushDiary(line);
        logAction(line, 'success');
        C.refreshUI();
    };

    // —— 委托 ——
    window.doNpcCommission = function (commId, memberIdx) {
        ensurePlusData();
        var C = core();
        var act = (N().commissions || []).find(function (x) { return x.id === commId; });
        var m = C.getMember(memberIdx);
        if (!act || !m) return;
        if (act.needAdult && !C.isAdult(m)) return logAction('需成年', 'error');
        var fav = player.children.descNpc.favor[act.npc] || 0;
        if (fav < (act.needFavor || 0)) return logAction('与对方好感不足（需' + act.needFavor + '）', 'error');
        var d = player.children.descNpc;
        if (C.cdLeft(d.commCd[commId]) > 0) return logAction(C.cdHint(d.commCd[commId]), 'info');
        if (act.cost > 0 && !C.pay(act.cost)) return;
        if (act.earn) {
            var ud = player.investmentGame.userData;
            if (ud.availableFunds != null) ud.availableFunds += act.earn;
            else ud.funds = (ud.funds || 0) + act.earn;
        }
        d.commCd[commId] = Date.now() + act.cd;
        C.addFavor(act.npc, act.favor || 10);
        C.addFame(m, act.fame || 0);
        C.addMood(act.mood || 2);
        if (act.attr) C.addAttr(m, act.attr, 2);
        if (act.sleep) {
            if (!m.nova) m.nova = { sleep: 70 };
            m.nova.sleep = Math.max(0, Math.min(100, (m.nova.sleep || 70) + act.sleep));
        }
        C.addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 4);
        C.bump('npcComm');
        var npc = npcById(act.npc);
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        C.remember(act.npc, '委托完成：' + act.name);
        C.pushDiary(line);
        logAction(line + (act.earn ? '（收入 ' + C.fmt(act.earn) + '）' : ''), 'success');
        C.refreshUI();
    };

    // —— 密授 ——
    window.learnNpcSecret = function (secretId, memberIdx) {
        ensurePlusData();
        var C = core();
        var sec = (N().secrets || []).find(function (x) { return x.id === secretId; });
        var m = C.getMember(memberIdx);
        if (!sec || !m) return;
        var d = player.children.descNpc;
        if (d.secretsLearned[secretId]) return logAction('已习得此密授', 'info');
        var fav = d.favor[sec.npc] || 0;
        if (fav < sec.needFavor) return logAction('好感不足（需' + sec.needFavor + '）', 'error');
        if (C.cdLeft(d.secretCd[sec.npc]) > 0 && !d.forgeReady) return logAction(C.cdHint(d.secretCd[sec.npc]), 'info');
        if (!C.pay(sec.cost)) return;
        d.secretsLearned[secretId] = true;
        d.secretCd[sec.npc] = Date.now() + sec.cd;
        d.forgeReady = false;
        if (sec.attr) C.addAttr(m, sec.attr, 3);
        C.addFame(m, 8);
        C.addFavor(sec.npc, 8);
        C.bump('npcSecret');
        var line = (sec.line || '').replace(/\{name\}/g, m.name);
        C.pushDiary(line);
        logAction(line + '（永久三维提升）', 'success');
        C.refreshUI();
    };

    // —— 知己誓约 ——
    window.swearNpcOath = function (npcId, memberIdx) {
        ensurePlusData();
        var C = core();
        var conf = N().bondOath;
        var npc = npcById(npcId);
        var m = C.getMember(memberIdx);
        if (!conf || !npc || !m) return;
        var d = player.children.descNpc;
        if (d.oaths[npcId]) return logAction('已与对方立约', 'info');
        if ((d.favor[npcId] || 0) < conf.needFavor) return logAction('需好感达到深交以上（' + conf.needFavor + '）', 'error');
        if (C.cdLeft(d.oathCd[npcId]) > 0) return logAction(C.cdHint(d.oathCd[npcId]), 'info');
        if (!C.pay(conf.cost)) return;
        d.oaths[npcId] = true;
        d.oathCd[npcId] = Date.now() + conf.cd;
        C.addFavor(npcId, conf.favor);
        C.addFame(m, 10);
        C.pushDiary((conf.line || '').replace(/\{npc\}/g, npc.name));
        logAction('与「' + npc.name + '」立下知己之约！', 'success');
        C.refreshUI();
    };

    function calcPlusWorld() {
        ensurePlusData();
        var atk = 0, hp = 0, crit = 0;
        var d = player.children.descNpc;
        (N().secrets || []).forEach(function (sec) {
            if (d.secretsLearned[sec.id]) {
                atk += sec.worldAtk || 0;
                hp += sec.worldHp || 0;
                crit += sec.worldCritDmg || 0;
            }
        });
        var oath = N().bondOath || {};
        Object.keys(d.oaths || {}).forEach(function (id) {
            if (d.oaths[id]) {
                atk += oath.atk || 0;
                hp += oath.hp || 0;
                crit += oath.crit || 0;
            }
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        ensurePlusData();
        var base = _origBonus ? _origBonus() : { worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var w = calcPlusWorld();
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
            ensurePlusData();
            var C = core();
            var d = player.children.descNpc;
            if (ch.effect === 'npcPlusFavorPeddler') C.addFavor('peddler', 20);
            else if (ch.effect === 'npcPlusFavorSmith') C.addFavor('blacksmith', 18);
            else if (ch.effect === 'npcPlusTeaBoost') d.teaBoost = true;
            else if (ch.effect === 'npcPlusForgeReady') d.forgeReady = true;
            return result;
        };
    }

    // —— UI ——
    function el(id) { return document.getElementById(id); }
    function opts() {
        var C = core();
        return (player.children.children || []).map(function (m, i) {
            return '<option value="' + i + '">' + m.name + '（' + (C.genLabel ? C.genLabel(m.generation || 1) : ('第' + (m.generation || 1) + '代')) + '）</option>';
        }).join('');
    }
    function npcOpts() {
        return (N().npcs || []).map(function (n) {
            var fav = (player.children.descNpc.favor[n.id] || 0);
            var mood = moodOf(n.id);
            return '<option value="' + n.id + '">' + n.name + '（好感' + fav + '·' + mood.name + '）</option>';
        }).join('');
    }

    function updateNpcPlusPanel() {
        var box = el('npcPlusPanel');
        if (!box) return;
        ensurePlusData();
        var C = core();
        var d = player.children.descNpc;
        var html = '<div class="c-hint">今日各 NPC 心境会变；送礼投其所好加成更高；委托需一定好感；密授与誓约永久提升三维。</div>';
        html += '<div class="c-form-row"><label>子弟</label><select id="npcPlusMember" class="c-input">' + opts() + '</select></div>';
        html += '<div class="c-form-row"><label>智邻</label><select id="npcPlusTarget" class="c-input">' + npcOpts() + '</select></div>';

        html += '<h4 style="color:#E8C4A8;margin:10px 0 6px;">送礼</h4><div class="c-train-grid">';
        (N().gifts || []).forEach(function (g) {
            html += '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + g.name + '</div>' +
                '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(g.cost) : ('耗资 ' + C.fmt(g.cost))) + '</div>' +
                '<button class="c-btn c-btn-sm c-btn-pink" onclick="giftToNpc(\'' + g.id + '\',document.getElementById(\'npcPlusTarget\').value,+document.getElementById(\'npcPlusMember\').value)">赠送</button></div>';
        });
        html += '</div>';

        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">请茶 · 设宴</h4><div class="c-train-grid">';
        (N().invite || []).forEach(function (a) {
            html += '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + a.name + '</div>' +
                '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost) : ('耗资 ' + C.fmt(a.cost))) + '</div>' +
                '<button class="c-btn c-btn-sm c-btn-gold" onclick="inviteNpc(\'' + a.id + '\',document.getElementById(\'npcPlusTarget\').value,+document.getElementById(\'npcPlusMember\').value)">' + a.name + '</button></div>';
        });
        html += '</div>';

        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">NPC 委托</h4><div class="c-train-grid">';
        (N().commissions || []).forEach(function (a) {
            var npc = npcById(a.npc);
            var cd = C.cdHint(d.commCd[a.id]);
            var extras = [(npc ? npc.name : ''), '好感≥' + a.needFavor];
            if (cd) extras.push(cd);
            if (a.earn) extras.push('入' + C.fmt(a.earn));
            html += '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + a.name + '</div>' +
                '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost, extras) : (('耗资 ' + C.fmt(a.cost)) + ' · ' + extras.join(' · '))) + '</div>' +
                '<button class="c-btn c-btn-sm c-btn-orange" onclick="doNpcCommission(\'' + a.id + '\',+document.getElementById(\'npcPlusMember\').value)">接委托</button></div>';
        });
        html += '</div>';

        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">好感密授（12h）</h4><div class="c-train-grid">';
        (N().secrets || []).forEach(function (s) {
            var learned = !!d.secretsLearned[s.id];
            var npc = npcById(s.npc);
            var secExtras = [(npc ? npc.name : ''), '好感≥' + s.needFavor];
            if (learned) secExtras.push('已学');
            html += '<div class="c-milestone' + (learned ? ' done' : '') + '" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + s.name + '</div>' +
                '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(s.cost, secExtras) : (('耗资 ' + C.fmt(s.cost)) + ' · ' + secExtras.join(' · '))) + '</div>' +
                '<button class="c-btn c-btn-sm c-btn-purple" ' + (learned ? 'disabled' : '') +
                ' onclick="learnNpcSecret(\'' + s.id + '\',+document.getElementById(\'npcPlusMember\').value)">' + (learned ? '已习得' : '请授') + '</button></div>';
        });
        html += '</div>';

        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">知己誓约（好感≥90，12h）</h4>';
        var oathCost = (N().bondOath && N().bondOath.cost) || 80000000;
        html += '<button class="c-btn c-btn-gold" style="width:100%;" onclick="swearNpcOath(document.getElementById(\'npcPlusTarget\').value,+document.getElementById(\'npcPlusMember\').value)">与当前智邻立约' +
            (typeof lineageCostTag === 'function' ? lineageCostTag(oathCost) : ('（耗资 ' + C.fmt(oathCost) + '）')) + '</button>';
        var oathNames = Object.keys(d.oaths || {}).filter(function (id) { return d.oaths[id]; }).map(function (id) {
            var n = npcById(id);
            return n ? n.name : id;
        });
        if (oathNames.length) html += '<div class="c-hint" style="margin-top:6px;">已立约：' + oathNames.join('、') + '</div>';

        box.innerHTML = html;
    }

    var _origUpdate = window.updateDescNpcPanels;
    window.updateDescNpcPanels = function () {
        if (_origUpdate) _origUpdate();
        installNpcPlus();
        ensurePlusData();
        updateNpcPlusPanel();
    };

    // 等基础 NPC 配置装好再装 plus
    function boot() {
        setTimeout(function () {
            if (typeof installNpcConfig === 'function') { /* may be private */ }
            if (core().ensure) core().ensure();
            installNpcPlus();
            ensurePlusData();
        }, 3200);
    }
    document.addEventListener('DOMContentLoaded', boot);
    if (document.readyState !== 'loading') boot();
})();

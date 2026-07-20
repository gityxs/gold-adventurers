/**
 * 家族传承 · 智邻 AI 深玩
 * 意图对话、议事圆桌、每日简报、传闻推演、结伴出行、情感剧情、论辩、红线参谋、劝和、托梦问策
 * 在 descendants-npc-plus.js 之后加载
 */
(function () {
    'use strict';
    var HOUR_MS = 60 * 60 * 1000;
    var CD_12H = 12 * HOUR_MS;

    function core() { return window.__npcCore || {}; }
    function cfg() { return window.lineageExtConfig; }
    function N() { return (cfg() && cfg().descNpc) || {}; }

    function installNpcAi() {
        if (!window.lineageExtConfig || !window.lineageExtConfig.descNpc) return;
        var c = window.lineageExtConfig;
        if (c._descNpcAiInstalled) return;
        c._descNpcAiInstalled = true;
        var D = c.descNpc;

        // —— 意图对话（玩家选意图，AI 组合回话）——
        D.intents = [
            { id: 'worry', name: '诉说烦恼', tags: ['mood', 'family'], favor: 4, mood: 3 },
            { id: 'boast', name: '分享喜事', tags: ['mood', 'fame'], favor: 3, mood: 5 },
            { id: 'ask_help', name: '请求帮忙', tags: ['help'], favor: 2, mood: 1 },
            { id: 'thanks', name: '郑重道谢', tags: ['bond'], favor: 6, mood: 4 },
            { id: 'secret', name: '吐露秘密', tags: ['trust'], favor: 5, mood: 2, needFavor: 40 },
            { id: 'joke', name: '开个玩笑', tags: ['idle'], favor: 2, mood: 6 },
            { id: 'plan', name: '商量大事', tags: ['advice', 'family'], favor: 5, mood: 2, needFavor: 25 },
            { id: 'comfort', name: '安慰对方', tags: ['care'], favor: 7, mood: 4 },
            { id: 'argue', name: '当面争辩', tags: ['clash'], favor: -3, mood: -1 },
            { id: 'future', name: '畅想未来', tags: ['dream'], favor: 4, mood: 5 }
        ];

        // —— 议事议题 ——
        D.council = [
            { id: 'heir', name: '立嫡与分房', cost: 25000000, cd: 6 * HOUR_MS, needNpcs: 3, prestige: 8, worldCritDmg: 0.6,
              line: '圆桌上火花四溅，最后理出一条稳路：先稳家，再论名。' },
            { id: 'wealth', name: '银根与营生', cost: 20000000, cd: 6 * HOUR_MS, needNpcs: 3, prestige: 6, worldAtk: 0.7,
              line: '掌柜拍算盘，街坊拍桌子，最后达成：该挣的挣，该存的存。' },
            { id: 'illness', name: '时疫与安民', cost: 30000000, cd: 6 * HOUR_MS, needNpcs: 3, prestige: 10, worldHp: 1.0,
              line: '郎中与捕快罕见地意见一致：先救人，再论别的。' },
            { id: 'marriage', name: '姻缘与门第', cost: 22000000, cd: 6 * HOUR_MS, needNpcs: 3, prestige: 7, worldHp: 0.5, worldCritDmg: 0.4,
              line: '媒婆说话像绣花，塾师像判卷。红线最终画得不急不慢。' },
            { id: 'frontier', name: '远行与守宅', cost: 28000000, cd: 8 * HOUR_MS, needNpcs: 3, prestige: 9, worldAtk: 0.8, worldHp: 0.5,
              line: '驿丞谈路，船娘谈水，更夫谈夜。出门的人有了地图，留家的人有了灯。' }
        ];

        // —— 传闻模板 ——
        D.rumors = [
            { id: 'grain', title: '粮价要动', text: '巷口说北货将至，米行已有人囤。', investigateCost: 8000000, reward: { favorNpc: 3, worldAtk: 0.4, mood: 2 } },
            { id: 'match', title: '某家议亲', text: '东头在看你们家子弟的名声。', investigateCost: 10000000, reward: { favor: ['matchmaker', 8], mood: 4, fame: 3 } },
            { id: 'illness', title: '时令小疫', text: '邻县有发热，医庐药材紧。', investigateCost: 12000000, reward: { favor: ['doctor', 10], worldHp: 0.6 } },
            { id: 'thief', title: '夜有异响', text: '有人说西巷丢了鸡，也有人说是风。', investigateCost: 9000000, reward: { favor: ['constable', 8], worldAtk: 0.35 } },
            { id: 'old_map', title: '残图传闻', text: '货郎收来半张旧图，墨指向祠堂方向。', investigateCost: 20000000, reward: { favor: ['peddler', 6], worldCritDmg: 0.7, prestige: 5 } },
            { id: 'star', title: '异星之说', text: '袁半仙坚称昨夜星序偏了。', investigateCost: 15000000, reward: { favor: ['fortune', 10], worldCritDmg: 0.5 } }
        ];

        // —— 结伴出行 ——
        D.outings = [
            { id: 'market', name: '同逛市集', cost: 10000000, cd: 5 * HOUR_MS, favor: 8, mood: 6, attr: 'business',
              prefer: ['shopkeep', 'peddler', 'teahost'], line: '与{npc}挤在市声里。银子花得不多，话说得不少。' },
            { id: 'river', name: '同游河埠', cost: 12000000, cd: 5 * HOUR_MS, favor: 9, mood: 7, attr: 'charm',
              prefer: ['boatwoman', 'postmaster', 'embroider'], line: '河风很大。{npc}话很少，笑却很多。' },
            { id: 'temple', name: '同去祈福', cost: 15000000, cd: 6 * HOUR_MS, favor: 10, mood: 5, worldHp: 0.4,
              prefer: ['doctor', 'fortune', 'oldservant'], line: '香火前，{npc}替你们家默念了一句，没说出口。' },
            { id: 'hill', name: '同登土坡', cost: 8000000, cd: 5 * HOUR_MS, favor: 8, mood: 6, attr: 'physique',
              prefer: ['neighbor', 'blacksmith', 'watchman'], line: '坡顶风硬。{npc}说：家还在脚下，就踏实。' },
            { id: 'night_walk', name: '同走夜巷', cost: 6000000, cd: 4 * HOUR_MS, favor: 7, mood: 5, sleep: -2,
              prefer: ['watchman', 'constable', 'neighbor'], line: '灯影里，{npc}把脚步放得很轻，像怕惊动整条巷的梦。' }
        ];

        // —— 情感剧情（多步）——
        D.arcs = [
            {
                id: 'doctor_rain', name: '柳郎中的雨夜', npc: 'doctor', steps: [
                    { id: 0, name: '送伞探望', cost: 8000000, favor: 10, text: '雨夜医庐灯独亮。你把伞靠在门边。' },
                    { id: 1, name: '帮熬一锅药', cost: 15000000, favor: 12, text: '药香盖过雨声。郎中说：有人记得，病就轻一半。' },
                    { id: 2, name: '听他讲旧案', cost: 10000000, favor: 15, worldHp: 1.0, text: '旧案讲完，窗外雨停。他第一次叫你「朋友」。' }
                ]
            },
            {
                id: 'smith_blade', name: '铁匠的未竟刀', npc: 'blacksmith', steps: [
                    { id: 0, name: '问刀的故事', cost: 5000000, favor: 8, text: '老周盯着炉火：那刀，是打给护人的，不是打给杀人的。' },
                    { id: 1, name: '资炭助锻', cost: 40000000, favor: 14, text: '炭够了。火花里有一张年轻的脸——不是他，是他想护的人。' },
                    { id: 2, name: '见证开刃', cost: 20000000, favor: 18, worldAtk: 1.5, text: '刀成。他塞给你一块铁屑：「留着，记着火候。」' }
                ]
            },
            {
                id: 'tea_song', name: '柳娘的旧曲', npc: 'teahost', steps: [
                    { id: 0, name: '点那首旧曲', cost: 8000000, favor: 10, text: '曲起时她眼眶红了，又笑着说：尘。' },
                    { id: 1, name: '问曲从何处来', cost: 12000000, favor: 12, text: '她说是母亲教的。母亲的茶，比现在苦，也比现在真。' },
                    { id: 2, name: '帮她重谱一角', cost: 25000000, favor: 16, worldCritDmg: 1.0, text: '新谱落纸。茶楼当晚客满，她把最好的茶留给你们。' }
                ]
            },
            {
                id: 'servant_key', name: '阿福的旧钥匙', npc: 'oldservant', steps: [
                    { id: 0, name: '问起生锈的钥匙', cost: 5000000, favor: 10, text: '阿福握紧钥匙：老宅西厢，有些门不该轻易开。' },
                    { id: 1, name: '陪他开旧锁', cost: 20000000, favor: 14, text: '门开了，只有尘与一封没寄出的信。' },
                    { id: 2, name: '替他寄出信意', cost: 15000000, favor: 18, worldHp: 1.2, text: '信意寄往风里。阿福说：主家的灯，终于也照到我心里了。' }
                ]
            }
        ];

        // —— 论辩 ——
        D.debate = {
            cost: 15000000,
            cd: 5 * HOUR_MS,
            opponents: ['tutor', 'constable', 'fortune', 'shopkeep'],
            winFavor: 12,
            loseFavor: 4,
            winAttr: 2,
            winFame: 6
        };

        // —— 红线参谋 ——
        D.matchAdvice = {
            cost: 18000000,
            cd: 6 * HOUR_MS,
            needNpc: 'matchmaker',
            needFavor: 30,
            favor: 8,
            mood: 5,
            fame: 4
        };

        // —— 劝和 ——
        D.mediateNpc = {
            cost: 20000000,
            cd: 6 * HOUR_MS,
            needFavorEach: 20,
            favorBoth: 10,
            mood: 6,
            prestige: 5,
            worldHp: 0.5
        };

        // —— 托梦问策 ——
        D.dreamCouncil = {
            cost: 35000000,
            cd: 8 * HOUR_MS,
            needNpc: 'fortune',
            needFavor: 40,
            worldAtk: 0.8,
            worldHp: 0.8,
            worldCritDmg: 0.8,
            favor: 10
        };

        var moreEvents = [
            { id: 'npc_ai_roundtable', title: '智邻圆桌', text: '会馆里多放了三把椅子。有人说：该议事了。',
              choices: [
                { label: '正式召开议事', cost: 80000000, effect: 'npcAiCouncilReady', prestige: 18, worldCritDmg: 4 },
                { label: '先请茶暖场', cost: 30000000, effect: 'npcFavorAll', prestige: 10 },
                { label: '改日', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'npc_ai_rumor', title: '传闻满巷', text: '同一句话被传成五个版本。真假难辨。',
              choices: [
                { label: '出资查清', cost: 60000000, effect: 'npcAiRumorBoost', prestige: 14, worldAtk: 3 },
                { label: '当笑话听', cost: 10000000, effect: 'livingMood', amount: 6, prestige: 6 },
                { label: '堵耳不闻', cost: 0, effect: 'none', prestige: 1 }
              ]}
        ];
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'intent1', name: '意图交谈', desc: '完成意图对话 1 次', need: 1, key: 'npcIntent', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'council1', name: '召开圆桌', desc: '议事圆桌 1 次', need: 1, key: 'npcCouncil', rewardPrestige: 20, rewardFunds: 10000000, rewardExp: 16 },
            { id: 'rumor1', name: '追查传闻', desc: '调查传闻 1 次', need: 1, key: 'npcRumor', rewardPrestige: 15, rewardFunds: 6000000, rewardExp: 13 },
            { id: 'outing1', name: '结伴出行', desc: '与 NPC 出行 1 次', need: 1, key: 'npcOuting', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'arc1', name: '剧情推进', desc: '推进情感剧情 1 步', need: 1, key: 'npcArc', rewardPrestige: 18, rewardFunds: 8000000, rewardExp: 15 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensureAiData() {
        if (!player.children) return;
        if (core().ensure) core().ensure();
        installNpcAi();
        var d = player.children.descNpc;
        if (!d) return;
        ['intentCd', 'councilCd', 'outingCd', 'debateCd', 'matchCd', 'mediateCd', 'dreamCd', 'arcProgress'].forEach(function (k) {
            if (!d[k] || typeof d[k] !== 'object') d[k] = {};
        });
        if (!d.activeRumor) d.activeRumor = null;
        if (!d.briefing) d.briefing = null;
        if (!d.lastAiLog) d.lastAiLog = [];
        if (d.councilReady == null) d.councilReady = false;
        if (d.rumorBoost == null) d.rumorBoost = false;
        rollRumorIfNeeded();
        refreshBriefingIfNeeded();
    }

    function rollRumorIfNeeded() {
        var d = player.children.descNpc;
        var day = Math.floor(Date.now() / (24 * HOUR_MS));
        if (d.rumorDay === day && d.activeRumor) return;
        d.rumorDay = day;
        var list = N().rumors || [];
        if (!list.length) return;
        d.activeRumor = {
            id: list[Math.floor(Math.random() * list.length)].id,
            investigated: false
        };
    }

    function refreshBriefingIfNeeded() {
        var d = player.children.descNpc;
        var day = Math.floor(Date.now() / (24 * HOUR_MS));
        if (d.briefDay === day && d.briefing) return;
        d.briefDay = day;
        d.briefing = buildBriefing();
    }

    function snapshot() {
        return core().snapshotWorld ? core().snapshotWorld() : {
            maxG: 1, members: 0, adults: 0, kids: 0, sick: 0, married: 0, mood: 50, weather: '寻常', funds: 0, prestige: 0
        };
    }

    function buildBriefing() {
        var s = snapshot();
        var tips = [];
        tips.push('【智邻简报】今日天气「' + s.weather + '」，族人心情约 ' + s.mood + '。');
        if (s.sick > 0) tips.push('⚠ 有 ' + s.sick + ' 人染恙，建议找柳郎中/药童问诊，或推进「时疫与安民」圆桌。');
        else tips.push('✓ 族中暂无明显病患，可安排短工或出行。');
        if (s.mood < 45) tips.push('⚠ 心情偏低：适合请茶、开玩笑意图对话、或与心境「热络」的 NPC 结伴。');
        else if (s.mood >= 70) tips.push('✓ 心情不错：适合议事圆桌、论辩或畅想未来。');
        if (s.married < 1 && s.adults > 0) tips.push('媒婆提示：有成年未婚，可做「红线参谋」或谈姻缘话题。');
        if (s.maxG >= 6) tips.push('驿丞/船娘：代数已深，远行与守宅议题值得圆桌一议。');
        if (s.kids > 0) tips.push('塾师：府上有 ' + s.kids + ' 名幼童，陪读与学业话题可增进亲子。');
        var top = null, topFav = -1;
        var d = player.children.descNpc;
        (N().npcs || []).forEach(function (n) {
            var f = d.favor[n.id] || 0;
            if (f > topFav) { topFav = f; top = n; }
        });
        if (top) tips.push('当前最熟：' + top.name + '（好感 ' + topFav + '）。可推进其情感剧情或密授。');
        if (d.activeRumor) {
            var rum = (N().rumors || []).find(function (r) { return r.id === d.activeRumor.id; });
            if (rum) tips.push('今日传闻：' + rum.title + '——' + rum.text);
        }
        return tips.join('\n');
    }

    function pushAiLog(text) {
        var d = player.children.descNpc;
        d.lastAiLog.unshift({ t: Date.now(), text: text });
        if (d.lastAiLog.length > 20) d.lastAiLog.length = 20;
    }

    function npcById(id) {
        return (N().npcs || []).find(function (x) { return x.id === id; });
    }

    function genIntentReply(npc, intent, member) {
        var s = snapshot();
        var name = member ? member.name : '你们';
        var C = core();
        var pick = C.pick || function (a) { return a[0]; };
        var lines = [];
        lines.push(pick(npc.greet || ['嗯。']));

        if (intent.id === 'worry') {
            lines.push(s.mood < 50
                ? '我看出来了。心里沉的人，走路都轻。说吧，我听着。'
                : name + '眉头皱着。是银子？是人？还是说不清的那种沉？');
            lines.push(pick(['先把茶喝了。烦恼怕热。', '说出来，就轻一半。']));
        } else if (intent.id === 'boast') {
            lines.push('喜事？让我听听——别藏着，藏着会发酵成闷。');
            lines.push(s.prestige > 200 ? '你们家本就亮，再亮一点，巷口都跟着暖。' : '小喜也是喜。灯就是这样一盏盏亮的。');
        } else if (intent.id === 'ask_help') {
            lines.push((player.children.descNpc.favor[npc.id] || 0) >= 50
                ? '开口就对了。朋友之间，帮是本分。'
                : '能帮的我帮。帮不了的，我给你指条路。');
        } else if (intent.id === 'thanks') {
            lines.push('道什么谢。你们家灯亮时，我也沾光。');
            lines.push('把谢意收进行动里：下次顺路，带包茶就行。');
        } else if (intent.id === 'secret') {
            lines.push('门关好了。说。我说出去，天打雷劈——这话我认真。');
            lines.push('秘密放在我这，比放在风里安全。');
        } else if (intent.id === 'joke') {
            lines.push(pick(['哈哈！你这嘴，比货郎铃还响。', '笑一下吧。板着脸，茶都变苦。', '笑话听完，正事也轻了。']));
        } else if (intent.id === 'plan') {
            lines.push('大事？那把「' + genLabelSafe(s.maxG) + '」的份量拿出来谈。');
            lines.push(s.sick > 0 ? '先把病人安顿，再谈别的——这是我的死规矩。' : '人齐、银够、心齐，三样有两样就能开干。');
        } else if (intent.id === 'comfort') {
            lines.push('……你倒来安慰我？');
            lines.push('行。这句话我收下。心里那根刺，松了一点。');
        } else if (intent.id === 'argue') {
            lines.push('你是来抬杠的？也好，杠清楚比闷着强。');
            lines.push('争完了，门还不关。人还是人。');
        } else if (intent.id === 'future') {
            lines.push('未来？我看见的是：灯还在，人还在，粥还热。');
            lines.push(s.maxG >= 9 ? '代已经很远了。未来不是更远，是更稳。' : '未来还早。先把明天的米缸装满。');
        } else {
            lines.push('我懂了。');
        }

        lines.push('（' + npc.name + '根据你们族况——人口' + s.members + '、心情' + s.mood + '、天气' + s.weather + '——斟酌回话）');
        return lines.join('\n');
    }

    function genLabelSafe(g) {
        return core().genLabel ? core().genLabel(g) : ('第' + g + '代');
    }

    // ——— 意图对话 ———
    window.talkNpcIntent = function (npcId, intentId, memberIdx) {
        ensureAiData();
        var C = core();
        var npc = npcById(npcId);
        var intent = (N().intents || []).find(function (x) { return x.id === intentId; });
        var m = C.getMember ? C.getMember(memberIdx) : null;
        if (!npc || !intent) return;
        var d = player.children.descNpc;
        var fav = d.favor[npcId] || 0;
        if (intent.needFavor && fav < intent.needFavor) return logAction('好感不足（需' + intent.needFavor + '）', 'error');
        var key = npcId + ':' + intentId;
        if (C.cdLeft(d.intentCd[key]) > 0) return logAction(C.cdHint(d.intentCd[key]), 'info');
        d.intentCd[key] = Date.now() + 2 * HOUR_MS;
        var reply = genIntentReply(npc, intent, m);
        // 与话题对话共用好感冷却：同一 NPC 24h 内对话/意图只加一次好感
        if (!d.favorTalkCd || typeof d.favorTalkCd !== 'object') d.favorTalkCd = {};
        var favorCdMs = (N().talkFavorCd) || (24 * HOUR_MS);
        if (C.cdLeft(d.favorTalkCd[npcId]) > 0) {
            reply += '\n（好感冷却中：' + C.cdHint(d.favorTalkCd[npcId]) + '，本次不加好感）';
        } else if (intent.favor) {
            C.addFavor(npcId, intent.favor || 0);
            d.favorTalkCd[npcId] = Date.now() + favorCdMs;
        }
        C.addMood(intent.mood || 0);
        C.remember(npcId, '意图·' + intent.name);
        d.lastChat = { npcId: npcId, topic: intent.id, reply: reply, at: Date.now() };
        C.bump('npcIntent');
        pushAiLog(npc.name + ' ← ' + intent.name);
        C.pushDiary('与' + npc.name + '进行意图对话：' + intent.name);
        logAction('【' + npc.name + '·' + intent.name + '】\n' + reply, 'info');
        C.refreshUI();
        if (typeof updateDescNpcPanels === 'function') updateDescNpcPanels();
    };

    // ——— 圆桌议事 ———
    window.startNpcCouncil = function (topicId, n1, n2, n3, memberIdx) {
        ensureAiData();
        var C = core();
        var topic = (N().council || []).find(function (x) { return x.id === topicId; });
        if (!topic) return;
        var ids = [n1, n2, n3].filter(Boolean);
        var uniq = {};
        ids.forEach(function (id) { uniq[id] = true; });
        if (Object.keys(uniq).length < (topic.needNpcs || 3)) return logAction('请选择三位不同智邻出席', 'error');
        var d = player.children.descNpc;
        if (C.cdLeft(d.councilCd[topicId]) > 0 && !d.councilReady) return logAction(C.cdHint(d.councilCd[topicId]), 'info');
        if (!C.pay(topic.cost)) return;
        d.councilCd[topicId] = Date.now() + topic.cd;
        d.councilReady = false;
        ids.forEach(function (id) { C.addFavor(id, 6); });
        C.addMood(5);
        C.addTempWorld(topic.worldAtk, topic.worldHp, topic.worldCritDmg, 5);
        if (topic.prestige) player.children.clanPrestige = (player.children.clanPrestige || 0) + topic.prestige;
        var m = C.getMember && C.getMember(memberIdx);
        if (m) C.addFame(m, 5);
        C.bump('npcCouncil');
        var names = ids.map(function (id) { var n = npcById(id); return n ? n.name : id; }).join('、');
        var s = snapshot();
        var aiSummary = '议事「' + topic.name + '」：' + names + '轮流发言。结合族况（代数' + s.maxG + '·恙' + s.sick + '·婚' + s.married + '），' + topic.line;
        pushAiLog(aiSummary);
        d.lastChat = { npcId: n1, topic: 'council', reply: aiSummary, at: Date.now() };
        C.pushDiary(aiSummary);
        logAction(aiSummary, 'success');
        C.refreshUI();
    };

    // ——— 调查传闻 ———
    window.investigateNpcRumor = function (memberIdx) {
        ensureAiData();
        var C = core();
        var d = player.children.descNpc;
        if (!d.activeRumor || d.activeRumor.investigated) return logAction('今日传闻已查过或没有传闻', 'info');
        var rum = (N().rumors || []).find(function (r) { return r.id === d.activeRumor.id; });
        if (!rum) return;
        var cost = rum.investigateCost;
        if (d.rumorBoost) { cost = Math.floor(cost * 0.5); d.rumorBoost = false; }
        if (!C.pay(cost)) return;
        d.activeRumor.investigated = true;
        var rw = rum.reward || {};
        C.addMood(rw.mood || 0);
        C.addTempWorld(rw.worldAtk, rw.worldHp, rw.worldCritDmg, 4);
        if (rw.favorNpc) (N().npcs || []).forEach(function (n) { C.addFavor(n.id, rw.favorNpc); });
        if (rw.favor) C.addFavor(rw.favor[0], rw.favor[1]);
        if (rw.prestige) player.children.clanPrestige = (player.children.clanPrestige || 0) + rw.prestige;
        var m = C.getMember && C.getMember(memberIdx);
        if (m && rw.fame) C.addFame(m, rw.fame);
        C.bump('npcRumor');
        var text = '查清传闻「' + rum.title + '」：' + rum.text + '——半真半假，却够你们防一手。';
        pushAiLog(text);
        C.pushDiary(text);
        logAction(text, 'success');
        C.refreshUI();
    };

    // ——— 结伴出行 ———
    window.doNpcOuting = function (outingId, npcId, memberIdx) {
        ensureAiData();
        var C = core();
        var act = (N().outings || []).find(function (x) { return x.id === outingId; });
        var npc = npcById(npcId);
        var m = C.getMember && C.getMember(memberIdx);
        if (!act || !npc || !m) return;
        var d = player.children.descNpc;
        var key = outingId + ':' + npcId;
        if (C.cdLeft(d.outingCd[key]) > 0) return logAction(C.cdHint(d.outingCd[key]), 'info');
        if (!C.pay(act.cost)) return;
        d.outingCd[key] = Date.now() + act.cd;
        var fav = act.favor || 6;
        if ((act.prefer || []).indexOf(npcId) >= 0) fav = Math.floor(fav * 1.4);
        C.addFavor(npcId, fav);
        C.addMood(act.mood || 0);
        if (act.attr) C.addAttr(m, act.attr, 1);
        if (act.sleep) {
            if (!m.nova) m.nova = { sleep: 70 };
            m.nova.sleep = Math.max(0, Math.min(100, (m.nova.sleep || 70) + act.sleep));
        }
        C.addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 3);
        C.bump('npcOuting');
        var line = (act.line || '').replace(/\{npc\}/g, npc.name);
        C.remember(npcId, '出行：' + act.name);
        pushAiLog(line);
        C.pushDiary(line);
        logAction(line + '（好感+' + fav + '）', 'success');
        C.refreshUI();
    };

    // ——— 情感剧情 ———
    window.advanceNpcArc = function (arcId, memberIdx) {
        ensureAiData();
        var C = core();
        var arc = (N().arcs || []).find(function (x) { return x.id === arcId; });
        var m = C.getMember && C.getMember(memberIdx);
        if (!arc || !m) return;
        var d = player.children.descNpc;
        var step = d.arcProgress[arcId] || 0;
        if (step >= arc.steps.length) return logAction('此剧情已完结', 'info');
        var st = arc.steps[step];
        if (!C.pay(st.cost)) return;
        d.arcProgress[arcId] = step + 1;
        C.addFavor(arc.npc, st.favor || 8);
        C.addMood(3);
        C.addTempWorld(st.worldAtk, st.worldHp, st.worldCritDmg, 4);
        C.bump('npcArc');
        var npc = npcById(arc.npc);
        var text = '【' + arc.name + '·' + st.name + '】' + st.text;
        C.remember(arc.npc, arc.name + ' 第' + (step + 1) + '步');
        pushAiLog(text);
        C.pushDiary(text);
        logAction(text, 'success');
        if (step + 1 >= arc.steps.length) logAction(arc.name + ' 完结！与' + (npc ? npc.name : '') + '羁绊更深。', 'success');
        C.refreshUI();
    };

    // ——— 论辩 ———
    window.debateNpc = function (npcId, memberIdx) {
        ensureAiData();
        var C = core();
        var conf = N().debate;
        var npc = npcById(npcId);
        var m = C.getMember && C.getMember(memberIdx);
        if (!conf || !npc || !m) return;
        if ((conf.opponents || []).indexOf(npcId) < 0) return logAction('对方不爱抬杠，换个人', 'info');
        if (!C.isAdult(m)) return logAction('须成年论辩', 'error');
        var d = player.children.descNpc;
        if (C.cdLeft(d.debateCd[npcId]) > 0) return logAction(C.cdHint(d.debateCd[npcId]), 'info');
        if (!C.pay(conf.cost)) return;
        d.debateCd[npcId] = Date.now() + conf.cd;
        var win = Math.random() < 0.5 + Math.min(0.2, (m.attributes && m.attributes.intelligence || 0) * 0.01);
        var reply;
        if (win) {
            C.addFavor(npcId, conf.winFavor);
            C.addFame(m, conf.winFame);
            C.addAttr(m, 'intelligence', conf.winAttr);
            reply = npc.name + '被你们说得一顿，最后拱手：「今日我输了口，赢了理。」';
        } else {
            C.addFavor(npcId, conf.loseFavor);
            C.addFame(m, 2);
            C.addAttr(m, 'intelligence', 1);
            reply = npc.name + '笑着摇头：「嘴快不如心细。回去再练。」你们虽败，却有所得。';
        }
        pushAiLog(reply);
        d.lastChat = { npcId: npcId, topic: 'debate', reply: reply, at: Date.now() };
        C.pushDiary(reply);
        logAction(reply, win ? 'success' : 'info');
        C.refreshUI();
    };

    // ——— 红线参谋 ———
    window.askMatchAdvice = function (memberIdx) {
        ensureAiData();
        var C = core();
        var conf = N().matchAdvice;
        var m = C.getMember && C.getMember(memberIdx);
        if (!conf || !m) return;
        var d = player.children.descNpc;
        var fav = d.favor[conf.needNpc] || 0;
        if (fav < conf.needFavor) return logAction('需与王媒婆更熟（好感' + conf.needFavor + '）', 'error');
        if (C.cdLeft(d.matchCd.main) > 0) return logAction(C.cdHint(d.matchCd.main), 'info');
        if (!C.pay(conf.cost)) return;
        d.matchCd.main = Date.now() + conf.cd;
        C.addFavor(conf.needNpc, conf.favor);
        C.addMood(conf.mood);
        C.addFame(m, conf.fame);
        var s = snapshot();
        var advice;
        if (!C.isAdult(m)) advice = m.name + '还小。红线不急，先让字写稳、腿跑稳。';
        else if (m.isMarried || m.married) advice = m.name + '已成婚。参谋只有一句：养恩爱，比攀门第重要。';
        else if (s.prestige < 50) advice = m.name + '可先求稳妥人家。门第靠攒，不靠冲。';
        else advice = m.name + '声望够看。可留意书香或商贾之家，但本人脾气对上才是头等。';
        advice = '【红线参谋】' + advice + '\n（王媒婆眨眼：真看上了，我帮递话；不合适，我帮挡。）';
        pushAiLog(advice);
        d.lastChat = { npcId: 'matchmaker', topic: 'romance', reply: advice, at: Date.now() };
        C.pushDiary(advice);
        logAction(advice, 'success');
        C.refreshUI();
    };

    // ——— 劝和两 NPC ———
    window.mediateTwoNpcs = function (aId, bId, memberIdx) {
        ensureAiData();
        var C = core();
        var conf = N().mediateNpc;
        if (!conf) return;
        if (!aId || !bId || aId === bId) return logAction('请选择两位不同智邻', 'error');
        var d = player.children.descNpc;
        if ((d.favor[aId] || 0) < conf.needFavorEach || (d.favor[bId] || 0) < conf.needFavorEach) {
            return logAction('双方好感都需达到 ' + conf.needFavorEach, 'error');
        }
        if (C.cdLeft(d.mediateCd.main) > 0) return logAction(C.cdHint(d.mediateCd.main), 'info');
        if (!C.pay(conf.cost)) return;
        d.mediateCd.main = Date.now() + conf.cd;
        C.addFavor(aId, conf.favorBoth);
        C.addFavor(bId, conf.favorBoth);
        C.addMood(conf.mood);
        C.addTempWorld(0, conf.worldHp, 0, 4);
        player.children.clanPrestige = (player.children.clanPrestige || 0) + (conf.prestige || 0);
        var na = npcById(aId), nb = npcById(bId);
        var text = '你们把' + (na ? na.name : aId) + '与' + (nb ? nb.name : bId) + '劝到一桌。茶凉了三回，气消了大半。';
        pushAiLog(text);
        C.pushDiary(text);
        logAction(text, 'success');
        C.refreshUI();
    };

    // ——— 托梦问策 ———
    window.dreamNpcCouncil = function (memberIdx) {
        ensureAiData();
        var C = core();
        var conf = N().dreamCouncil;
        var m = C.getMember && C.getMember(memberIdx);
        if (!conf) return;
        var d = player.children.descNpc;
        if ((d.favor[conf.needNpc] || 0) < conf.needFavor) return logAction('需与袁半仙更熟', 'error');
        if (C.cdLeft(d.dreamCd.main) > 0) return logAction(C.cdHint(d.dreamCd.main), 'info');
        if (!C.pay(conf.cost)) return;
        d.dreamCd.main = Date.now() + conf.cd;
        C.addFavor(conf.needNpc, conf.favor);
        C.addTempWorld(conf.worldAtk, conf.worldHp, conf.worldCritDmg, 6);
        if (m) C.addFame(m, 6);
        var s = snapshot();
        var tips = [
            '灯要护，人要聚，银要活。',
            s.sick > 0 ? '先安病，再远行。' : '身子尚可，可试一步险棋。',
            s.maxG >= 9 ? '代远者，忌忘回望。' : '根基未满十八，勿急称雄。',
            '巷口那句闲话，听听即可，当真则半。'
        ];
        var text = '【托梦问策】袁半仙闭目片时，开口：\n· ' + tips.join('\n· ');
        pushAiLog(text);
        d.lastChat = { npcId: 'fortune', topic: 'fortune', reply: text, at: Date.now() };
        d.briefing = buildBriefing() + '\n\n（托梦附言已并入今日判断）';
        C.pushDiary('托梦问策完成。');
        logAction(text, 'success');
        C.refreshUI();
    };

    window.refreshNpcBriefing = function () {
        ensureAiData();
        var d = player.children.descNpc;
        d.briefing = buildBriefing();
        logAction('智邻简报已刷新', 'info');
        if (typeof updateDescNpcPanels === 'function') updateDescNpcPanels();
    };

    // ——— UI ———
    function el(id) { return document.getElementById(id); }
    function memberOpts() {
        var C = core();
        return (player.children.children || []).map(function (m, i) {
            return '<option value="' + i + '">' + m.name + '</option>';
        }).join('');
    }
    function npcOpts() {
        var d = player.children.descNpc;
        return (N().npcs || []).map(function (n) {
            return '<option value="' + n.id + '">' + n.name + '（' + (d.favor[n.id] || 0) + '）</option>';
        }).join('');
    }

    function updateNpcAiPanel() {
        var box = el('npcAiPanel');
        if (!box) return;
        ensureAiData();
        var C = core();
        var d = player.children.descNpc;
        var html = '';

        html += '<div class="c-card" style="padding:10px;margin-bottom:10px;background:rgba(0,0,0,0.2);border-radius:8px;">';
        html += '<div style="color:#E8C4A8;margin-bottom:6px;">每日智邻简报</div>';
        html += '<pre style="white-space:pre-wrap;margin:0;font-family:inherit;font-size:12px;line-height:1.5;color:#f0e6d8;">' +
            escapeHtml(d.briefing || '加载中…') + '</pre>';
        html += '<button class="c-btn c-btn-sm c-btn-blue" style="margin-top:8px;" onclick="refreshNpcBriefing()">刷新简报</button></div>';

        html += '<div class="c-form-row"><label>子弟</label><select id="npcAiMember" class="c-input">' + memberOpts() + '</select></div>';
        html += '<div class="c-form-row"><label>智邻A</label><select id="npcAiA" class="c-input">' + npcOpts() + '</select></div>';
        html += '<div class="c-form-row"><label>智邻B</label><select id="npcAiB" class="c-input">' + npcOpts() + '</select></div>';
        html += '<div class="c-form-row"><label>智邻C</label><select id="npcAiC" class="c-input">' + npcOpts() + '</select></div>';

        html += '<h4 style="color:#E8C4A8;margin:10px 0 6px;">意图对话（对智邻A）</h4><div class="c-train-grid">';
        (N().intents || []).forEach(function (it) {
            html += '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + it.name + '</div>' +
                (it.needFavor ? '<div class="ms-desc">好感≥' + it.needFavor + '</div>' : '') +
                '<button class="c-btn c-btn-sm c-btn-purple" onclick="talkNpcIntent(document.getElementById(\'npcAiA\').value,\'' + it.id +
                '\',+document.getElementById(\'npcAiMember\').value)">' + it.name + '</button></div>';
        });
        html += '</div>';

        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">议事圆桌（A+B+C）</h4><div class="c-train-grid">';
        (N().council || []).forEach(function (t) {
            var cd = C.cdHint(d.councilCd[t.id]);
            html += '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + t.name + '</div><div class="ms-desc">' + C.fmt(t.cost) + (cd ? ' · ' + cd : '') + '</div>' +
                '<button class="c-btn c-btn-sm c-btn-gold" onclick="startNpcCouncil(\'' + t.id +
                '\',document.getElementById(\'npcAiA\').value,document.getElementById(\'npcAiB\').value,document.getElementById(\'npcAiC\').value,+document.getElementById(\'npcAiMember\').value)">开会</button></div>';
        });
        html += '</div>';

        var rum = d.activeRumor && (N().rumors || []).find(function (r) { return r.id === d.activeRumor.id; });
        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">今日传闻</h4>';
        if (rum) {
            html += '<div class="c-hint">' + rum.title + '：' + rum.text +
                (d.activeRumor.investigated ? '（已查）' : '') + '</div>';
            if (!d.activeRumor.investigated) {
                html += '<button class="c-btn c-btn-orange" style="width:100%;margin-top:4px;" onclick="investigateNpcRumor(+document.getElementById(\'npcAiMember\').value)">出资调查（' + C.fmt(rum.investigateCost) + '）</button>';
            }
        } else html += '<div class="c-hint">暂无传闻</div>';

        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">结伴出行（与A）</h4><div class="c-train-grid">';
        (N().outings || []).forEach(function (o) {
            html += '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + o.name + '</div>' +
                '<button class="c-btn c-btn-sm c-btn-pink" onclick="doNpcOuting(\'' + o.id +
                '\',document.getElementById(\'npcAiA\').value,+document.getElementById(\'npcAiMember\').value)">' + o.name + '</button></div>';
        });
        html += '</div>';

        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">情感剧情</h4><div class="c-train-grid">';
        (N().arcs || []).forEach(function (arc) {
            var step = d.arcProgress[arc.id] || 0;
            var done = step >= arc.steps.length;
            var st = arc.steps[Math.min(step, arc.steps.length - 1)];
            var npc = npcById(arc.npc);
            html += '<div class="c-milestone' + (done ? ' done' : '') + '" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + arc.name + '</div>' +
                '<div class="ms-desc">' + (npc ? npc.name : '') + ' · ' + (done ? '已完结' : ('下一步：' + st.name + '（' + (step + 1) + '/' + arc.steps.length + '）')) + '</div>' +
                '<button class="c-btn c-btn-sm c-btn-blue" ' + (done ? 'disabled' : '') +
                ' onclick="advanceNpcArc(\'' + arc.id + '\',+document.getElementById(\'npcAiMember\').value)">' + (done ? '完结' : '推进') + '</button></div>';
        });
        html += '</div>';

        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">论辩 · 红线 · 劝和 · 托梦</h4>';
        html += '<button class="c-btn c-btn-orange" style="width:100%;margin-top:4px;" onclick="debateNpc(document.getElementById(\'npcAiA\').value,+document.getElementById(\'npcAiMember\').value)">与A论辩（塾师/捕快/半仙/掌柜）</button>';
        html += '<button class="c-btn c-btn-pink" style="width:100%;margin-top:6px;" onclick="askMatchAdvice(+document.getElementById(\'npcAiMember\').value)">请王媒婆做红线参谋</button>';
        html += '<button class="c-btn c-btn-blue" style="width:100%;margin-top:6px;" onclick="mediateTwoNpcs(document.getElementById(\'npcAiA\').value,document.getElementById(\'npcAiB\').value,+document.getElementById(\'npcAiMember\').value)">劝和 A 与 B</button>';
        html += '<button class="c-btn c-btn-purple" style="width:100%;margin-top:6px;" onclick="dreamNpcCouncil(+document.getElementById(\'npcAiMember\').value)">袁半仙·托梦问策</button>';

        if (d.lastAiLog && d.lastAiLog.length) {
            html += '<div class="c-hint" style="margin-top:12px;">AI 互动日志</div><ul style="font-size:12px;padding-left:18px;">';
            d.lastAiLog.slice(0, 6).forEach(function (x) {
                html += '<li>' + escapeHtml((x.text || '').slice(0, 60)) + '</li>';
            });
            html += '</ul>';
        }

        box.innerHTML = html;
    }

    function escapeHtml(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    var _origUpdate = window.updateDescNpcPanels;
    window.updateDescNpcPanels = function () {
        if (_origUpdate) _origUpdate();
        installNpcAi();
        ensureAiData();
        updateNpcAiPanel();
    };

    var _origResolve = window.resolveClanEvent;
    if (_origResolve) {
        window.resolveClanEvent = function (choiceIndex) {
            var ev = player.children && player.children.activeEvent;
            var ch = ev && ev.choices && ev.choices[choiceIndex];
            var result = _origResolve(choiceIndex);
            if (!ch) return result;
            ensureAiData();
            var d = player.children.descNpc;
            if (ch.effect === 'npcAiCouncilReady') d.councilReady = true;
            else if (ch.effect === 'npcAiRumorBoost') d.rumorBoost = true;
            return result;
        };
    }

    function boot() {
        setTimeout(function () {
            if (core().ensure) core().ensure();
            installNpcAi();
            ensureAiData();
        }, 3400);
    }
    document.addEventListener('DOMContentLoaded', boot);
    if (document.readyState !== 'loading') boot();
})();

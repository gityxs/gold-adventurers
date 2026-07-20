/**
 * 家族传承 · 子孙世系加深
 * 孝道、游学、闭关、功名官阶、分房立户、陪嫁妆奁、对决、家画像、值夜、血脉冥想、技艺融合、人生节点
 * 在 lineage-descendants.js 之后加载
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
    function P() { return (cfg() && cfg().descPlus) || {}; }
    function genLabel(g) {
        return typeof getGenerationLabel === 'function' ? getGenerationLabel(g) : ('第' + g + '代');
    }

    function installPlusConfig() {
        if (!window.lineageExtConfig) return;
        var c = window.lineageExtConfig;
        if (c._descPlusInstalled) return;
        c._descPlusInstalled = true;

        c.descPlus = {
            filial: {
                acts: [
                    { id: 'kneel', name: '晨昏定省', cost: 2000000, cd: 3 * HOUR_MS, filial: 6, mood: 4,
                      line: '{name}向长辈请安，声音不大，却很稳。' },
                    { id: 'serve_tea', name: '奉茶问暖', cost: 3000000, cd: 3 * HOUR_MS, filial: 5, mood: 5,
                      line: '{name}把茶递到长辈手里，先试了温度。' },
                    { id: 'earn_for_parent', name: '赚得反哺', cost: 15000000, cd: 6 * HOUR_MS, filial: 10, mood: 3, needAdult: true,
                      line: '{name}把一笔银子悄悄放进长辈匣中，说「该你们享了」。' },
                    { id: 'write_filial', name: '抄写孝经', cost: 5000000, cd: 4 * HOUR_MS, filial: 7, attr: 'intelligence', mood: 2,
                      line: '{name}把「孝」字写得很端正，像在跟自己约定。' },
                    { id: 'repair_chair', name: '修椅垫席', cost: 4000000, cd: 4 * HOUR_MS, filial: 6, mood: 4,
                      line: '{name}把长辈常坐的椅子修好，自己手上磨出了茧。' }
                ],
                tiers: [
                    { need: 0, name: '尚待教导', atk: 0, hp: 0, crit: 0 },
                    { need: 30, name: '略知孝悌', atk: 0.4, hp: 0.6, crit: 0.2 },
                    { need: 80, name: '孝名初显', atk: 1, hp: 1.5, crit: 0.6 },
                    { need: 160, name: '一乡称孝', atk: 2, hp: 3, crit: 1.2 },
                    { need: 300, name: '十八代孝子', atk: 4, hp: 5, crit: 2.5 }
                ]
            },
            travel: [
                { id: 'jiangnan', name: '江南游学', cost: 40000000, hours: 4, attr: 'charm', gain: 4, fame: 8, worldHp: 1.5,
                  text: '{name}去了江南。回来袖口还带着荷香。' },
                { id: 'border', name: '边关历练', cost: 50000000, hours: 5, attr: 'physique', gain: 5, fame: 10, worldAtk: 2,
                  text: '{name}从边关回来，脸上多了风沙，眼里多了事。' },
                { id: 'capital', name: '京城见闻', cost: 60000000, hours: 6, attr: 'intelligence', gain: 5, fame: 12, worldCritDmg: 1.5,
                  text: '{name}说京城的灯比星还密，也比星更吵。' },
                { id: 'sea', name: '出海随商', cost: 80000000, hours: 8, attr: 'business', gain: 6, fame: 14, worldAtk: 1.5, worldHp: 1,
                  text: '{name}带回一块陌生的贝壳，说海很大，家很小，但家更暖。' },
                { id: 'ancestral_land', name: '寻祖故地', cost: 100000000, hours: 7, attr: 'intelligence', gain: 4, fame: 16, worldAtk: 2, worldHp: 2, worldCritDmg: 2, needGen: 3,
                  text: '{name}站在故地土坡上，忽然懂了族谱为什么那么厚。' }
            ],
            seclusion: {
                cost: 35000000,
                duration: 3 * HOUR_MS,
                cd: 8 * HOUR_MS,
                attrGain: 3,
                fame: 6,
                line: '{name}闭关归来，话少了，拳脚与心思却沉了。'
            },
            ranks: [
                { id: 'tongsheng', name: '童生', needFame: 30, cost: 20000000, atk: 0.8, hp: 0.8, crit: 0.5 },
                { id: 'xiucai', name: '秀才', needFame: 60, cost: 50000000, atk: 1.5, hp: 1.5, crit: 1 },
                { id: 'juren', name: '举人', needFame: 120, cost: 120000000, atk: 3, hp: 2.5, crit: 2 },
                { id: 'jinshi', name: '进士', needFame: 200, cost: 300000000, atk: 5, hp: 4, crit: 4 },
                { id: 'hanlin', name: '翰林', needFame: 350, cost: 800000000, atk: 8, hp: 7, crit: 6 },
                { id: 'guolao', name: '国器', needFame: 500, cost: 2000000000, atk: 12, hp: 12, crit: 10 }
            ],
            branch: {
                cost: 200000000,
                needAdult: true,
                needFame: 80,
                atk: 2, hp: 2, crit: 1.5,
                line: '{name}分房立户，门楣新挂一块匾。老宅灯火与新宅灯火，遥遥相望。'
            },
            dowry: {
                tiers: [
                    { id: 'plain', name: '布衣薄奁', cost: 20000000, bond: 8, mood: 5 },
                    { id: 'decent', name: '锦绣中奁', cost: 80000000, bond: 15, mood: 8 },
                    { id: 'rich', name: '金玉厚奁', cost: 250000000, bond: 25, mood: 12 },
                    { id: 'royal', name: '十八代妆奁', cost: 800000000, bond: 40, mood: 18, needGen: 9 }
                ]
            },
            duel: {
                cost: 15000000,
                cd: 4 * HOUR_MS,
                fameWin: 10,
                fameLose: 3,
                attrWin: 3,
                attrLose: 1
            },
            portrait: {
                cost: 60000000,
                cd: 12 * HOUR_MS,
                needMembers: 3,
                duration: 6 * HOUR_MS,
                atk: 4, hp: 5, crit: 3,
                line: '画师落笔。你们一家子定格在绢上，连空气都安静了一会儿。'
            },
            nightDuty: [
                { id: 'gate', name: '守门值夜', cost: 4000000, cd: 5 * HOUR_MS, attr: 'physique', gain: 2, fame: 2, worldAtk: 0.3,
                  line: '{name}提着灯守到四更，听见远处狗叫，也听见自己心跳。' },
                { id: 'ledger_night', name: '夜核账册', cost: 5000000, cd: 5 * HOUR_MS, attr: 'business', gain: 2, fame: 2, worldAtk: 0.35,
                  line: '{name}把账对到灯尽，发现一笔旧情，比银子更沉。' },
                { id: 'shrine_watch', name: '祠堂守夜', cost: 6000000, cd: 6 * HOUR_MS, attr: 'intelligence', gain: 2, fame: 3, worldHp: 0.4, worldCritDmg: 0.2,
                  line: '{name}在牌位前坐了一夜。香灰落下来，像有人叹息。' }
            ],
            meditation: {
                cost: 45000000,
                cd: 8 * HOUR_MS,
                perGen: { atk: 0.15, hp: 0.15, crit: 0.12 },
                duration: 4 * HOUR_MS,
                line: '{name}盘膝冥想，仿佛听见十八代脚步从远到近。'
            },
            fusion: {
                cost: 100000000,
                cd: 10 * HOUR_MS,
                needSpecLv: 3,
                bonusAtk: 2, bonusHp: 2, bonusCrit: 2,
                line: '{name}把两门专精揉在一处，拳脚与心思忽然通了。'
            },
            lifeNodes: [
                { id: 'first_job', name: '初入生计', needAdult: true, cost: 25000000, fame: 10, attrAll: 2,
                  text: '{name}第一次把工钱拿回家，手指还有墨/茧/土，却笑得很好看。' },
                { id: 'first_teach', name: '初为人师', needAdult: true, cost: 30000000, fame: 12, attrAll: 2,
                  text: '{name}教徒弟时手心出汗，比自己学时还紧张。' },
                { id: 'mid_reflect', name: '而立自省', needFame: 100, needAdult: true, cost: 50000000, fame: 15, attrAll: 3,
                  text: '{name}对着铜镜看了很久，说：还有半路要走。' },
                { id: 'gen_pride', name: '为族争光', needFame: 150, cost: 80000000, fame: 20, attrAll: 4, prestige: 15,
                  text: '{name}办成一件大事。族人放了炮仗，老人却只轻轻点头。' }
            ],
            temper: [
                { id: 'sunny', name: '晴朗', weight: 30, trainMod: 1.1, mood: 2 },
                { id: 'calm', name: '平和', weight: 25, trainMod: 1, mood: 0 },
                { id: 'restless', name: '躁动', weight: 20, trainMod: 0.9, hobbyMod: 1.2, mood: -1 },
                { id: 'melancholy', name: '沉郁', weight: 15, trainMod: 0.85, interactMod: 1.15, mood: -2 },
                { id: 'inspired', name: '顿悟', weight: 10, trainMod: 1.25, mood: 3 }
            ]
        };

        var moreEvents = [
            { id: 'filial_tale', title: '孝行传开', text: '邻里传说你们家有子弟雨夜给长辈送药，鞋底磨穿也不喊累。',
              choices: [
                { label: '嘉奖并记入族谱', cost: 60000000, effect: 'plusFilialBoost', prestige: 20, worldHp: 4 },
                { label: '悄悄塞钱给孩子', cost: 30000000, effect: 'livingMood', amount: 10, prestige: 10 },
                { label: '说本分不必张扬', cost: 0, effect: 'plusFilialQuiet', prestige: 8 }
              ]},
            { id: 'travel_invite', title: '游学帖到', text: '远方书院寄来请帖：愿收你们家一名子弟游学一季。',
              choices: [
                { label: '厚礼答应成行', cost: 100000000, effect: 'plusTravelReady', prestige: 18, worldAtk: 3 },
                { label: '改请名师上门', cost: 80000000, effect: 'descSchoolBoost', prestige: 12 },
                { label: '婉拒，家中自有功课', cost: 0, effect: 'none', prestige: 3 }
              ]},
            { id: 'rank_rumor', title: '功名传闻', text: '有考官路过，随口说你们家某子弟「气质像能中」。全族一夜没睡实。',
              choices: [
                { label: '加资备考', cost: 150000000, effect: 'plusRankReady', prestige: 22, worldCritDmg: 4 },
                { label: '平常心，该吃吃该睡睡', cost: 20000000, effect: 'livingMood', amount: 8, prestige: 8 },
                { label: '先把孝道摆正再谈功名', cost: 50000000, effect: 'plusFilialBoost', prestige: 14 }
              ]},
            { id: 'branch_talk', title: '分房之议', text: '人丁多了，老宅住不下。有人提议分房立户，有人怕散了心。',
              choices: [
                { label: '择能者分房', cost: 180000000, effect: 'plusBranchReady', prestige: 25, worldAtk: 4, worldHp: 4 },
                { label: '扩建老宅不分', cost: 120000000, effect: 'happiness', amount: 12, prestige: 12 },
                { label: '再议三年', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'portrait_day', title: '家画像日', text: '画师来了。孩子们坐不住，长辈端着，阳光正好。',
              choices: [
                { label: '正式画像留念', cost: 90000000, effect: 'plusPortraitReady', prestige: 16, worldHp: 5 },
                { label: '只画长辈与嫡系', cost: 50000000, effect: 'livingMood', amount: 5, prestige: 10 },
                { label: '改日天气再好时', cost: 0, effect: 'none', prestige: 2 }
              ]}
        ];
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'filial2', name: '孝悌日课', desc: '完成孝行 2 次', need: 2, key: 'filial', rewardPrestige: 18, rewardFunds: 7000000, rewardExp: 14 },
            { id: 'travel1', name: '行万里路', desc: '完成游学 1 次', need: 1, key: 'travel', rewardPrestige: 28, rewardFunds: 20000000, rewardExp: 22 },
            { id: 'seclude1', name: '闭关悟道', desc: '完成闭关 1 次', need: 1, key: 'seclude', rewardPrestige: 20, rewardFunds: 12000000, rewardExp: 16 },
            { id: 'rank1', name: '功名路上', desc: '考取/晋升功名 1 次', need: 1, key: 'rank', rewardPrestige: 30, rewardFunds: 25000000, rewardExp: 25 },
            { id: 'duty1', name: '值夜有责', desc: '完成值夜 1 次', need: 1, key: 'duty', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 10 },
            { id: 'duel1', name: '族中切磋', desc: '完成对决 1 次', need: 1, key: 'duel', rewardPrestige: 16, rewardFunds: 8000000, rewardExp: 12 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensurePlusData() {
        if (!player.children) return;
        installPlusConfig();
        if (!player.children.descPlus) {
            player.children.descPlus = {
                filialCd: {},
                travelCd: {},
                travelUntil: {},
                secludeCd: {},
                secludeUntil: {},
                duelCd: 0,
                portraitLast: 0,
                portraitUntil: 0,
                dutyCd: {},
                meditateLast: 0,
                meditateUntil: 0,
                fusionCd: {},
                nodesDone: {},
                temperDay: 0,
                travelReady: false,
                rankReady: false,
                branchReady: false,
                portraitReady: false,
                branches: []
            };
        }
        var d = player.children.descPlus;
        ['filialCd', 'travelCd', 'travelUntil', 'secludeCd', 'secludeUntil', 'dutyCd', 'fusionCd', 'nodesDone'].forEach(function (k) {
            if (!d[k] || typeof d[k] !== 'object') d[k] = {};
        });
        if (!Array.isArray(d.branches)) d.branches = [];
        (player.children.children || []).forEach(function (m) {
            if (m.filialScore == null) m.filialScore = 0;
            if (m.officialRank == null) m.officialRank = null;
            if (m.dowryDone == null) m.dowryDone = false;
            if (m.fusionDone == null) m.fusionDone = false;
            if (!m.lifeNodesDone) m.lifeNodesDone = {};
            if (!m.dailyTemper) m.dailyTemper = 'calm';
        });
        refreshTemper();
    }

    function pushDiary(text) {
        if (!player.children.life && typeof ensureLifeData === 'function') ensureLifeData();
        if (!player.children.life) return;
        var d = player.children.life.diary;
        if (!Array.isArray(d)) { player.children.life.diary = []; d = player.children.life.diary; }
        d.unshift({ t: Date.now(), text: text });
        if (d.length > 90) d.length = 90;
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
        m.descFame = (m.descFame || 0) + (n || 0);
    }

    function refreshUI() {
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
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

    function refreshTemper() {
        var d = player.children.descPlus;
        var day = Math.floor(Date.now() / DAY_MS);
        if (d.temperDay === day) return;
        d.temperDay = day;
        (player.children.children || []).forEach(function (m) {
            var t = pickWeighted(P().temper || [{ id: 'calm', weight: 1 }]);
            m.dailyTemper = t.id;
        });
    }

    function temperOf(m) {
        return (P().temper || []).find(function (t) { return t.id === m.dailyTemper; }) || { id: 'calm', name: '平和', trainMod: 1 };
    }

    function filialTier(m) {
        var score = m.filialScore || 0;
        var tier = (P().filial.tiers || [])[0];
        (P().filial.tiers || []).forEach(function (t) {
            if (score >= t.need) tier = t;
        });
        return tier;
    }

    function maxGen() {
        var g = 0;
        (player.children.children || []).forEach(function (m) { g = Math.max(g, m.generation || 1); });
        return g;
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

    // ——— 孝道 ———
    window.doFilialAct = function (actId, memberIndex) {
        ensurePlusData();
        var act = (P().filial.acts || []).find(function (a) { return a.id === actId; });
        var m = (player.children.children || [])[memberIndex];
        if (!act || !m) return;
        if (act.needAdult && !isAdult(m)) return logAction('需成年', 'error');
        var cdKey = act.id + ':' + (m.id || memberIndex);
        var left = (player.children.descPlus.filialCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('冷却中', 'info');
        if (funds().availableFunds < act.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= act.cost;
        player.children.descPlus.filialCd[cdKey] = Date.now() + act.cd;
        m.filialScore = (m.filialScore || 0) + act.filial;
        addMood(act.mood || 0);
        if (act.attr && m.attributes) m.attributes[act.attr] = (m.attributes[act.attr] || 0) + 1;
        addFame(m, 2);
        var line = act.line.replace(/\{name\}/g, m.name);
        pushDiary(line);
        bump('filial');
        logAction(line + '（孝行 ' + m.filialScore + '）', 'success');
        refreshUI();
    };

    // ——— 游学 ———
    window.startDescendantTravel = function (travelId, memberIndex) {
        ensurePlusData();
        var tr = (P().travel || []).find(function (t) { return t.id === travelId; });
        var m = (player.children.children || [])[memberIndex];
        if (!tr || !m) return;
        if ((m.growthStage || 0) < 2 && !isAdult(m)) return logAction('至少儿童以上方可游学', 'info');
        if (tr.needGen && maxGen() < tr.needGen) return logAction('家族代数未及', 'error');
        var id = m.id || memberIndex;
        if (player.children.descPlus.travelUntil[id] > Date.now()) return logAction(m.name + ' 仍在游学途中', 'info');
        var left = (player.children.descPlus.travelCd[id] || 0) - Date.now();
        if (left > 0) return logAction('游学冷却中', 'info');
        var cost = tr.cost;
        if (player.children.descPlus.travelReady) { cost = Math.floor(cost * 0.7); player.children.descPlus.travelReady = false; }
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        player.children.descPlus.travelUntil[id] = Date.now() + tr.hours * HOUR_MS;
        player.children.descPlus.travelCd[id] = Date.now() + tr.hours * HOUR_MS + 2 * HOUR_MS;
        // 暂存奖励
        m._travelReward = tr;
        pushDiary(m.name + ' 启程「' + tr.name + '」，约 ' + tr.hours + ' 小时归来。');
        logAction(m.name + ' 出发游学：' + tr.name, 'success');
        bump('travel');
        refreshUI();
    };

    function tickTravelReturn() {
        ensurePlusData();
        var now = Date.now();
        (player.children.children || []).forEach(function (m) {
            var id = m.id;
            var until = player.children.descPlus.travelUntil[id];
            if (!until || now < until) return;
            var tr = m._travelReward;
            player.children.descPlus.travelUntil[id] = 0;
            m._travelReward = null;
            if (!tr) return;
            if (m.attributes && tr.attr) m.attributes[tr.attr] = (m.attributes[tr.attr] || 0) + (tr.gain || 3);
            addFame(m, tr.fame || 8);
            addTempWorld(tr.worldAtk, tr.worldHp, tr.worldCritDmg, 6);
            var text = tr.text.replace(/\{name\}/g, m.name);
            pushDiary(text);
            logAction(m.name + ' 游学归来！', 'success');
        });
    }

    // ——— 闭关 ———
    window.startDescendantSeclusion = function (memberIndex) {
        ensurePlusData();
        var m = (player.children.children || [])[memberIndex];
        var sc = P().seclusion;
        if (!m || !isAdult(m)) return logAction('闭关需成年', 'error');
        var id = m.id || memberIndex;
        if (player.children.descPlus.secludeUntil[id] > Date.now()) return logAction('仍在闭关', 'info');
        var left = (player.children.descPlus.secludeCd[id] || 0) - Date.now();
        if (left > 0) return logAction('闭关冷却中', 'info');
        if (funds().availableFunds < sc.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= sc.cost;
        player.children.descPlus.secludeUntil[id] = Date.now() + sc.duration;
        player.children.descPlus.secludeCd[id] = Date.now() + sc.cd;
        m._secludePending = true;
        pushDiary(m.name + ' 闭关，门外挂着「勿扰」。');
        logAction(m.name + ' 开始闭关', 'success');
        bump('seclude');
        refreshUI();
    };

    function tickSeclusion() {
        ensurePlusData();
        var now = Date.now();
        var sc = P().seclusion;
        (player.children.children || []).forEach(function (m) {
            var id = m.id;
            var until = player.children.descPlus.secludeUntil[id];
            if (!until || now < until || !m._secludePending) return;
            m._secludePending = false;
            player.children.descPlus.secludeUntil[id] = 0;
            Object.keys(m.attributes || {}).forEach(function (k) {
                m.attributes[k] = (m.attributes[k] || 0) + (sc.attrGain || 3);
            });
            addFame(m, sc.fame || 6);
            var temper = temperOf(m);
            if (temper.trainMod > 1) {
                Object.keys(m.attributes || {}).forEach(function (k) {
                    m.attributes[k] += 1;
                });
            }
            pushDiary(sc.line.replace(/\{name\}/g, m.name));
            logAction(m.name + ' 出关，全属性提升！', 'success');
        });
    }

    // ——— 功名 ———
    window.promoteOfficialRank = function (memberIndex) {
        ensurePlusData();
        var m = (player.children.children || [])[memberIndex];
        if (!m || !isAdult(m)) return logAction('功名需成年考取', 'error');
        var ranks = P().ranks || [];
        var curIdx = ranks.findIndex(function (r) { return r.id === m.officialRank; });
        var next = ranks[curIdx + 1] || ranks[0];
        if (m.officialRank && curIdx >= ranks.length - 1) return logAction('已至最高功名', 'info');
        if (!m.officialRank) next = ranks[0];
        else next = ranks[curIdx + 1];
        if ((m.descFame || 0) < next.needFame && !player.children.descPlus.rankReady) {
            return logAction('声望不足（需 ' + next.needFame + '）', 'error');
        }
        var cost = player.children.descPlus.rankReady ? Math.floor(next.cost * 0.6) : next.cost;
        if (player.children.descPlus.rankReady) player.children.descPlus.rankReady = false;
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        m.officialRank = next.id;
        addFame(m, 15);
        if (typeof addClanPrestige === 'function') addClanPrestige(10 + curIdx * 5);
        pushDiary(m.name + ' 得功名「' + next.name + '」。');
        logAction(m.name + ' 晋升「' + next.name + '」！', 'success');
        bump('rank');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 分房 ———
    window.foundFamilyBranch = function (memberIndex) {
        ensurePlusData();
        var m = (player.children.children || [])[memberIndex];
        var br = P().branch;
        if (!m || !isAdult(m)) return logAction('分房需成年', 'error');
        if ((m.descFame || 0) < br.needFame && !player.children.descPlus.branchReady) {
            return logAction('声望不足（需 ' + br.needFame + '）', 'error');
        }
        if (player.children.descPlus.branches.indexOf(m.id) >= 0) return logAction('已立过房', 'info');
        var cost = player.children.descPlus.branchReady ? 0 : br.cost;
        if (player.children.descPlus.branchReady) player.children.descPlus.branchReady = false;
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        player.children.descPlus.branches.push(m.id);
        m.hasBranch = true;
        addFame(m, 25);
        if (typeof addClanPrestige === 'function') addClanPrestige(20);
        pushDiary(br.line.replace(/\{name\}/g, m.name));
        logAction(m.name + ' 分房立户成功', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 妆奁（订婚/已婚） ———
    window.prepareDowry = function (memberIndex, tierId) {
        ensurePlusData();
        var m = (player.children.children || [])[memberIndex];
        var tier = (P().dowry.tiers || []).find(function (t) { return t.id === tierId; });
        if (!m || !tier) return;
        if (!m.isBetrothed && !m.isMarried) return logAction('须订婚或成婚后方可备妆奁/聘礼', 'error');
        if (m.dowryDone) return logAction('已备过妆奁', 'info');
        if (tier.needGen && maxGen() < tier.needGen) return logAction('代数未及', 'error');
        if (funds().availableFunds < tier.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= tier.cost;
        m.dowryDone = true;
        m.maritalBond = Math.min(100, (m.maritalBond || 0) + (tier.bond || 0));
        if (m.betrothalAffinity != null) m.betrothalAffinity = Math.min(50, (m.betrothalAffinity || 0) + Math.floor(tier.bond / 2));
        addMood(tier.mood || 0);
        pushDiary(m.name + ' 备下「' + tier.name + '」，匣子沉甸甸的。');
        logAction(m.name + ' 「' + tier.name + '」备妥，恩爱/情谊提升', 'success');
        refreshUI();
    };

    // ——— 对决 ———
    window.duelDescendants = function (indexA, indexB) {
        ensurePlusData();
        var members = player.children.children || [];
        var a = members[indexA];
        var b = members[indexB];
        var du = P().duel;
        if (!a || !b || indexA === indexB) return logAction('请选择两名不同成员', 'error');
        var left = (player.children.descPlus.duelCd || 0) - Date.now();
        if (left > 0) return logAction('对决冷却中', 'info');
        if (funds().availableFunds < du.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= du.cost;
        player.children.descPlus.duelCd = Date.now() + du.cd;
        var score = function (m) {
            return Object.keys(m.attributes || {}).reduce(function (s, k) { return s + (m.attributes[k] || 0); }, 0)
                + (m.descFame || 0) * 0.1;
        };
        var sa = score(a) * (0.85 + Math.random() * 0.3);
        var sb = score(b) * (0.85 + Math.random() * 0.3);
        var winner = sa >= sb ? a : b;
        var loser = sa >= sb ? b : a;
        var attrKeys = Object.keys(winner.attributes || {});
        var k = attrKeys[Math.floor(Math.random() * attrKeys.length)] || 'physique';
        winner.attributes[k] = (winner.attributes[k] || 0) + du.attrWin;
        loser.attributes[k] = (loser.attributes[k] || 0) + du.attrLose;
        addFame(winner, du.fameWin);
        addFame(loser, du.fameLose);
        pushDiary(winner.name + ' 与 ' + loser.name + ' 切磋，' + winner.name + ' 略胜。');
        logAction(winner.name + ' 胜！' + loser.name + ' 亦有所得', 'success');
        bump('duel');
        refreshUI();
    };

    // ——— 家画像 ———
    window.takeFamilyPortrait = function () {
        ensurePlusData();
        var pr = P().portrait;
        var n = (player.children.children || []).length;
        if (n < pr.needMembers) return logAction('至少 ' + pr.needMembers + ' 名成员才好入画', 'info');
        var left = (player.children.descPlus.portraitLast || 0) + pr.cd - Date.now();
        if (left > 0 && !player.children.descPlus.portraitReady) return logAction('画像冷却中', 'info');
        var cost = player.children.descPlus.portraitReady ? 0 : pr.cost;
        if (player.children.descPlus.portraitReady) player.children.descPlus.portraitReady = false;
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        player.children.descPlus.portraitLast = Date.now();
        player.children.descPlus.portraitUntil = Date.now() + pr.duration;
        addMood(10);
        pushDiary(pr.line);
        logAction('家画像完成，限时三维大幅提升', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 值夜 ———
    window.doNightDuty = function (dutyId, memberIndex) {
        ensurePlusData();
        var duty = (P().nightDuty || []).find(function (d) { return d.id === dutyId; });
        var m = (player.children.children || [])[memberIndex];
        if (!duty || !m) return;
        if (!isAdult(m) && (m.growthStage || 0) < 3) return logAction('至少少年方可值夜', 'info');
        // 闭关/游学中不可
        var id = m.id || memberIndex;
        if ((player.children.descPlus.travelUntil[id] || 0) > Date.now()) return logAction('游学中无法值夜', 'error');
        if ((player.children.descPlus.secludeUntil[id] || 0) > Date.now()) return logAction('闭关中无法值夜', 'error');
        var cdKey = duty.id + ':' + id;
        var left = (player.children.descPlus.dutyCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('冷却中', 'info');
        if (funds().availableFunds < duty.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= duty.cost;
        player.children.descPlus.dutyCd[cdKey] = Date.now() + duty.cd;
        if (m.attributes && duty.attr) m.attributes[duty.attr] = (m.attributes[duty.attr] || 0) + (duty.gain || 1);
        addFame(m, duty.fame || 2);
        addTempWorld(duty.worldAtk, duty.worldHp, duty.worldCritDmg, 3);
        var line = duty.line.replace(/\{name\}/g, m.name);
        pushDiary(line);
        bump('duty');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 血脉冥想 ———
    window.doBloodlineMeditation = function (memberIndex) {
        ensurePlusData();
        var m = (player.children.children || [])[memberIndex];
        var md = P().meditation;
        if (!m || !isAdult(m)) return logAction('冥想需成年', 'error');
        var left = (player.children.descPlus.meditateLast || 0) + md.cd - Date.now();
        if (left > 0) return logAction('冥想冷却中', 'info');
        if (funds().availableFunds < md.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= md.cost;
        player.children.descPlus.meditateLast = Date.now();
        var g = maxGen();
        player.children.descPlus.meditateUntil = Date.now() + md.duration;
        player.children.descPlus.meditateGen = g;
        addFame(m, 5);
        pushDiary(md.line.replace(/\{name\}/g, m.name));
        logAction(m.name + ' 血脉冥想：按当前最远代数 ' + g + ' 获得限时三维', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 技艺融合 ———
    window.fuseDescendantSkills = function (memberIndex) {
        ensurePlusData();
        var m = (player.children.children || [])[memberIndex];
        var fu = P().fusion;
        if (!m || !isAdult(m)) return logAction('需成年', 'error');
        if (m.fusionDone) return logAction('每人限融合一次', 'info');
        var specs = m.descSpecialties || {};
        var qualified = Object.keys(specs).filter(function (k) { return (specs[k] || 0) >= fu.needSpecLv; });
        if (qualified.length < 2) return logAction('需至少两门专精达到 Lv.' + fu.needSpecLv, 'error');
        var left = (player.children.descPlus.fusionCd[m.id] || 0) - Date.now();
        if (left > 0) return logAction('融合冷却中', 'info');
        if (funds().availableFunds < fu.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= fu.cost;
        player.children.descPlus.fusionCd[m.id] = Date.now() + fu.cd;
        m.fusionDone = true;
        m.fusionBonus = true;
        Object.keys(m.attributes || {}).forEach(function (k) {
            m.attributes[k] = (m.attributes[k] || 0) + 5;
        });
        addFame(m, 20);
        pushDiary(fu.line.replace(/\{name\}/g, m.name));
        logAction(m.name + ' 技艺融合成功！永久三维+全属性', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 人生节点 ———
    window.claimLifeNode = function (memberIndex, nodeId) {
        ensurePlusData();
        var m = (player.children.children || [])[memberIndex];
        var node = (P().lifeNodes || []).find(function (n) { return n.id === nodeId; });
        if (!m || !node) return;
        if (m.lifeNodesDone[nodeId]) return logAction('已达成', 'info');
        if (node.needAdult && !isAdult(m)) return logAction('需成年', 'error');
        if (node.needFame && (m.descFame || 0) < node.needFame) return logAction('声望不足', 'error');
        if (funds().availableFunds < node.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= node.cost;
        m.lifeNodesDone[nodeId] = true;
        addFame(m, node.fame || 10);
        if (node.attrAll && m.attributes) {
            Object.keys(m.attributes).forEach(function (k) {
                m.attributes[k] += node.attrAll;
            });
        }
        if (node.prestige && typeof addClanPrestige === 'function') addClanPrestige(node.prestige);
        pushDiary(node.text.replace(/\{name\}/g, m.name));
        logAction(m.name + ' 达成人生节点「' + node.name + '」', 'success');
        refreshUI();
    };

    // ——— 培养吃今日心境 ———
    var _origTrain = window.trainChild;
    if (_origTrain) {
        window.trainChild = function (childIndex, trainingType) {
            ensurePlusData();
            var child = player.children.children[childIndex];
            var id = child && child.id;
            if (id && (player.children.descPlus.travelUntil[id] || 0) > Date.now()) {
                return logAction(child.name + ' 游学未归，无法培养', 'error');
            }
            if (id && (player.children.descPlus.secludeUntil[id] || 0) > Date.now()) {
                return logAction(child.name + ' 闭关中，无法培养', 'error');
            }
            var before = child && (child.totalTraining || 0);
            var result = _origTrain(childIndex, trainingType);
            child = player.children.children[childIndex];
            if (!child || (child.totalTraining || 0) <= before) return result;
            var temper = temperOf(child);
            if (temper.trainMod > 1 && Math.random() < (temper.trainMod - 1)) {
                var keys = Object.keys(child.attributes || {});
                if (keys.length) {
                    var k = keys[Math.floor(Math.random() * keys.length)];
                    child.attributes[k] = (child.attributes[k] || 0) + 1;
                    logAction(child.name + ' 今日心境「' + temper.name + '」，额外有所得', 'info');
                }
            }
            return result;
        };
    }

    // ——— 三维 ———
    function calcPlusWorld() {
        ensurePlusData();
        var atk = 0, hp = 0, crit = 0;
        (player.children.children || []).forEach(function (m) {
            var ft = filialTier(m);
            atk += ft.atk || 0;
            hp += ft.hp || 0;
            crit += ft.crit || 0;
            if (m.officialRank) {
                var rank = (P().ranks || []).find(function (r) { return r.id === m.officialRank; });
                if (rank) {
                    atk += rank.atk || 0;
                    hp += rank.hp || 0;
                    crit += rank.crit || 0;
                }
            }
            if (m.fusionBonus) {
                var fu = P().fusion || {};
                atk += fu.bonusAtk || 0;
                hp += fu.bonusHp || 0;
                crit += fu.bonusCrit || 0;
            }
        });
        var br = P().branch || {};
        var bn = (player.children.descPlus.branches || []).length;
        atk += bn * (br.atk || 0);
        hp += bn * (br.hp || 0);
        crit += bn * (br.crit || 0);
        if (Date.now() < (player.children.descPlus.portraitUntil || 0)) {
            var pr = P().portrait || {};
            atk += pr.atk || 0;
            hp += pr.hp || 0;
            crit += pr.crit || 0;
        }
        if (Date.now() < (player.children.descPlus.meditateUntil || 0)) {
            var md = P().meditation || {};
            var g = player.children.descPlus.meditateGen || maxGen();
            atk += g * (md.perGen.atk || 0);
            hp += g * (md.perGen.hp || 0);
            crit += g * (md.perGen.crit || 0);
        }
        return { atk: atk, hp: hp, crit: crit };
    }

    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        installPlusConfig();
        ensurePlusData();
        tickTravelReturn();
        tickSeclusion();
        var base = _origBonus ? _origBonus() : { worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var w = calcPlusWorld();
        base.worldAtk = (base.worldAtk || 0) + w.atk;
        base.worldHp = (base.worldHp || 0) + w.hp;
        base.worldCritDmg = (base.worldCritDmg || 0) + w.crit;
        return base;
    };

    // 轶事
    var _origResolve = window.resolveClanEvent;
    if (_origResolve) {
        window.resolveClanEvent = function (choiceIndex) {
            var ev = player.children && player.children.activeEvent;
            var conf = ev && (cfg().events || []).find(function (e) { return e.id === ev.id; });
            var ch = conf && conf.choices && conf.choices[choiceIndex];
            _origResolve(choiceIndex);
            if (!ch) return;
            ensurePlusData();
            var d = player.children.descPlus;
            if (ch.effect === 'plusFilialBoost' || ch.effect === 'plusFilialQuiet') {
                (player.children.children || []).forEach(function (m) {
                    m.filialScore = (m.filialScore || 0) + (ch.effect === 'plusFilialBoost' ? 15 : 5);
                });
            } else if (ch.effect === 'plusTravelReady') {
                d.travelReady = true;
            } else if (ch.effect === 'plusRankReady') {
                d.rankReady = true;
            } else if (ch.effect === 'plusBranchReady') {
                d.branchReady = true;
            } else if (ch.effect === 'plusPortraitReady') {
                d.portraitReady = true;
            }
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }
    function opts(filterFn) {
        return (player.children.children || []).map(function (m, i) {
            if (filterFn && !filterFn(m)) return '';
            var temper = temperOf(m);
            var busy = '';
            var id = m.id;
            if ((player.children.descPlus.travelUntil[id] || 0) > Date.now()) busy = '·游学';
            if ((player.children.descPlus.secludeUntil[id] || 0) > Date.now()) busy = '·闭关';
            return '<option value="' + i + '">' + m.name + '（' + genLabel(m.generation || 1) + '·' + temper.name + busy + '）</option>';
        }).join('');
    }

    function updatePlusFilial() {
        var box = el('plusFilialPanel');
        if (!box) return;
        ensurePlusData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="plusFilialMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-train-grid">' + (P().filial.acts || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div><div class="ms-desc">孝行+' + a.filial + ' · ' + fmt(a.cost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="doFilialAct(\'' + a.id + '\',+document.getElementById(\'plusFilialMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updatePlusTravel() {
        var box = el('plusTravelPanel');
        if (!box) return;
        ensurePlusData();
        var g = maxGen();
        box.innerHTML = '<div class="c-form-row"><label>子弟</label><select id="plusTravelMember" class="c-input">' + opts() + '</select></div>' +
            (player.children.descPlus.travelReady ? '<div class="c-hint" style="color:#81C784;">游学优惠就绪</div>' : '') +
            '<div class="c-train-grid">' + (P().travel || []).map(function (t) {
                var lock = t.needGen && g < t.needGen;
                return '<div class="c-milestone' + (lock ? '' : ' done') + '" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + t.name + '</div><div class="ms-desc">' + t.hours + '小时 · ' + fmt(t.cost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" ' + (lock ? 'disabled' : '') +
                    ' onclick="startDescendantTravel(\'' + t.id + '\',+document.getElementById(\'plusTravelMember\').value)">' +
                    (lock ? '需第' + t.needGen + '代' : '启程') + '</button></div>';
            }).join('') + '</div>' +
            '<button class="c-btn c-btn-purple" style="width:100%;margin-top:8px;" onclick="startDescendantSeclusion(+document.getElementById(\'plusTravelMember\').value)">闭关悟道（' + fmt(P().seclusion.cost) + '，需成年）</button>';
    }

    function updatePlusRank() {
        var box = el('plusRankPanel');
        if (!box) return;
        ensurePlusData();
        box.innerHTML = '<div class="c-form-row"><label>成年</label><select id="plusRankMember" class="c-input">' + opts(isAdult) + '</select></div>' +
            '<p class="c-hint">功名：童生→秀才→举人→进士→翰林→国器（需声望）</p>' +
            '<button class="c-btn c-btn-gold" style="width:100%;" onclick="promoteOfficialRank(+document.getElementById(\'plusRankMember\').value)">考取/晋升功名</button>' +
            '<h4 style="margin:12px 0 8px;color:#E8C4A8;">分房立户</h4>' +
            '<button class="c-btn c-btn-orange" style="width:100%;" onclick="foundFamilyBranch(+document.getElementById(\'plusRankMember\').value)">分房立户（' +
            fmt(player.children.descPlus.branchReady ? 0 : P().branch.cost) + '）</button>' +
            '<div class="c-hint">已立房：' + (player.children.descPlus.branches || []).length + ' 房</div>';
    }

    function updatePlusDowry() {
        var box = el('plusDowryPanel');
        if (!box) return;
        ensurePlusData();
        var o = opts(function (m) { return m.isBetrothed || m.isMarried; });
        box.innerHTML = '<div class="c-form-row"><label>订婚/已婚</label><select id="plusDowryMember" class="c-input">' + o + '</select></div>' +
            '<div class="c-train-grid">' + (P().dowry.tiers || []).map(function (t) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + t.name + '</div><div class="ms-desc">恩爱+' + t.bond + ' · ' + fmt(t.cost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="prepareDowry(+document.getElementById(\'plusDowryMember\').value,\'' + t.id + '\')">备奁</button></div>';
            }).join('') + '</div>';
    }

    function updatePlusDuel() {
        var box = el('plusDuelPanel');
        if (!box) return;
        ensurePlusData();
        var o = opts();
        box.innerHTML = '<div class="c-form-row"><label>甲</label><select id="plusDuelA" class="c-input">' + o + '</select></div>' +
            '<div class="c-form-row"><label>乙</label><select id="plusDuelB" class="c-input">' + o + '</select></div>' +
            '<button class="c-btn c-btn-orange" style="width:100%;" onclick="duelDescendants(+document.getElementById(\'plusDuelA\').value,+document.getElementById(\'plusDuelB\').value)">开打（' + fmt(P().duel.cost) + '）</button>';
    }

    function updatePlusDuty() {
        var box = el('plusDutyPanel');
        if (!box) return;
        ensurePlusData();
        box.innerHTML = '<div class="c-form-row"><label>值夜人</label><select id="plusDutyMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-train-grid">' + (P().nightDuty || []).map(function (d) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + d.name + '</div><div class="ms-desc">' + fmt(d.cost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doNightDuty(\'' + d.id + '\',+document.getElementById(\'plusDutyMember\').value)">' + d.name + '</button></div>';
            }).join('') + '</div>' +
            '<button class="c-btn c-btn-purple" style="width:100%;margin-top:8px;" onclick="doBloodlineMeditation(+document.getElementById(\'plusDutyMember\').value)">血脉冥想（' + fmt(P().meditation.cost) + '）</button>' +
            '<button class="c-btn c-btn-gold" style="width:100%;margin-top:6px;" onclick="takeFamilyPortrait()">家族画像（' +
            fmt(player.children.descPlus.portraitReady ? 0 : P().portrait.cost) + '）</button>';
    }

    function updatePlusFusion() {
        var box = el('plusFusionPanel');
        if (!box) return;
        ensurePlusData();
        box.innerHTML = '<div class="c-form-row"><label>成年</label><select id="plusFusionMember" class="c-input">' + opts(isAdult) + '</select></div>' +
            '<p class="c-hint">两门专精均达 Lv.' + P().fusion.needSpecLv + ' 可融合一次，永久三维+全属性。</p>' +
            '<button class="c-btn c-btn-orange" style="width:100%;" onclick="fuseDescendantSkills(+document.getElementById(\'plusFusionMember\').value)">技艺融合（' + fmt(P().fusion.cost) + '）</button>';
    }

    function updatePlusNodes() {
        var box = el('plusNodesPanel');
        if (!box) return;
        ensurePlusData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="plusNodeMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-train-grid">' + (P().lifeNodes || []).map(function (n) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + n.name + '</div><div class="ms-desc">' + fmt(n.cost) + (n.needFame ? ' · 声望' + n.needFame : '') + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="claimLifeNode(+document.getElementById(\'plusNodeMember\').value,\'' + n.id + '\')">达成</button></div>';
            }).join('') + '</div>';
    }

    function updatePlusOverview() {
        var box = el('plusOverviewPanel');
        if (!box) return;
        ensurePlusData();
        refreshTemper();
        var members = player.children.children || [];
        var html = '<div class="c-hint">今日心境每日刷新，影响培养手感。游学/闭关中不可培养。</div>';
        html += '<div class="c-member-grid">' + members.slice(0, 10).map(function (m) {
            var ft = filialTier(m);
            var temper = temperOf(m);
            var rank = m.officialRank ? ((P().ranks || []).find(function (r) { return r.id === m.officialRank; }) || {}).name : '无功名';
            return '<div class="c-member"><div class="name">' + m.name + '</div><div class="meta">' +
                temper.name + ' · 孝：' + ft.name + '（' + (m.filialScore || 0) + '）' +
                '<br>' + rank + (m.hasBranch ? ' · 已分房' : '') + (m.fusionDone ? ' · 已融合' : '') +
                '</div></div>';
        }).join('') + '</div>';
        box.innerHTML = html;
    }

    window.updateDescPlusPanels = function () {
        installPlusConfig();
        ensurePlusData();
        tickTravelReturn();
        tickSeclusion();
        updatePlusOverview();
        updatePlusFilial();
        updatePlusTravel();
        updatePlusRank();
        updatePlusDowry();
        updatePlusDuel();
        updatePlusDuty();
        updatePlusFusion();
        updatePlusNodes();
    };

    // 不再从百态级联刷新世系；由 refreshActiveChildTabPanels 按页签刷新

    var _origSwitch = window.switchChildTab;
    window.switchChildTab = function (tab) {
        if (_origSwitch) _origSwitch(tab);
        var node = document.getElementById('childSectionDescPlus');
        if (node) node.classList.toggle('active', tab === 'descplus');
    };

    installPlusConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            installPlusConfig();
            ensurePlusData();
        }, 2200);
    });
    if (document.readyState !== 'loading') {
        setTimeout(function () {
            installPlusConfig();
            ensurePlusData();
        }, 2200);
    }
})();

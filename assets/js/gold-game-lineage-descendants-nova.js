/**
 * 家族传承 · 子弟万象
 * 德性、梦境、纪念册、游艺、夜宵、睡眠、祝福符、迷你奇遇、契约学徒、子弟排行、岁月礼、未来家书…
 * 在 eighteen-depth.js 之后加载；升级类默认 12 小时冷却
 */
(function () {
    'use strict';
    var HOUR_MS = 60 * 60 * 1000;
    var DAY_MS = 24 * 60 * 60 * 1000;
    var CD_12H = 12 * HOUR_MS;

    function cfg() { return window.lineageExtConfig; }
    function funds() { return player.investmentGame.userData; }
    function fmt(n) { return typeof formatSci === 'function' ? formatSci(n) : String(n); }
    function isAdult(m) {
        return typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : !!(m && m.isAdult);
    }
    function N() { return (cfg() && cfg().descNova) || {}; }
    function genLabel(g) {
        return typeof getGenerationLabel === 'function' ? getGenerationLabel(g) : ('第' + g + '代');
    }

    function installNovaConfig() {
        if (!window.lineageExtConfig) return;
        var c = window.lineageExtConfig;
        if (c._descNovaInstalled) return;
        c._descNovaInstalled = true;

        c.descNova = {
            upgradeCd: CD_12H,
            // —— 五德（仁义礼智信）升级 12h ——
            virtues: [
                { id: 'ren', name: '仁', max: 20, costBase: 25000000, growth: 2.3, worldHp: 0.45, mood: 1 },
                { id: 'yi', name: '义', max: 20, costBase: 25000000, growth: 2.3, worldAtk: 0.45, mood: 0 },
                { id: 'li', name: '礼', max: 20, costBase: 25000000, growth: 2.3, worldCritDmg: 0.35, worldHp: 0.2 },
                { id: 'zhi', name: '智', max: 20, costBase: 28000000, growth: 2.35, worldCritDmg: 0.5, attr: 'intelligence' },
                { id: 'xin', name: '信', max: 20, costBase: 25000000, growth: 2.3, worldAtk: 0.25, worldHp: 0.25 }
            ],
            // —— 梦境记录 ——
            dreams: [
                { id: 'fly', name: '飞檐梦', cost: 4000000, cd: 3 * HOUR_MS, mood: 5, attr: 'physique', gain: 1,
                  lines: ['{name}梦见自己踩着屋脊跑，醒来还想再梦一次。', '{name}说梦里风很大，但不怕。'] },
                { id: 'book', name: '书海梦', cost: 4000000, cd: 3 * HOUR_MS, mood: 3, attr: 'intelligence', gain: 2,
                  lines: ['{name}梦见书页自己翻动，字跳进眼睛里。', '{name}醒来第一件事是找昨天那本书。'] },
                { id: 'market', name: '集市梦', cost: 3500000, cd: 3 * HOUR_MS, mood: 4, attr: 'business', gain: 1,
                  lines: ['{name}梦见自己把糖卖给了月亮。', '{name}说梦里算盘打得比醒着还响。'] },
                { id: 'ancestor', name: '见祖梦', cost: 8000000, cd: 5 * HOUR_MS, mood: 6, fame: 4, worldHp: 0.4,
                  lines: ['{name}梦见远祖点头，没说话，只把灯拨亮了一点。', '{name}醒来袖口有一股陈年的香。'] },
                { id: 'wedding', name: '红盖梦', cost: 6000000, cd: 4 * HOUR_MS, mood: 7, needBetrothed: true, bond: 3,
                  lines: ['{name}梦见盖头一角被风掀起，笑醒了。', '{name}不肯说梦见了谁，耳朵却红。'] }
            ],
            // —— 纪念册（收集式升级，整册升级 12h）——
            album: {
                pages: [
                    { id: 'first_smile', name: '初笑', cost: 10000000, needStage: 0 },
                    { id: 'first_word', name: '初语', cost: 12000000, needStage: 1 },
                    { id: 'school', name: '开蒙照', cost: 20000000, needStage: 2 },
                    { id: 'vow', name: '立志照', cost: 30000000, needStage: 3 },
                    { id: 'adult', name: '加冠照', cost: 50000000, needAdult: true },
                    { id: 'wedding', name: '花烛照', cost: 80000000, needMarried: true },
                    { id: 'parent', name: '添丁照', cost: 100000000, needParent: true }
                ],
                bookMax: 10,
                bookCostBase: 80000000,
                bookGrowth: 2.8,
                perPage: { atk: 0.3, hp: 0.4, crit: 0.25 },
                perBook: { atk: 1.2, hp: 1.2, crit: 1 }
            },
            // —— 游艺 ——
            plays: [
                { id: 'kite', name: '放纸鸢', cost: 3000000, cd: 2 * HOUR_MS, mood: 6, attr: 'charm', gain: 1,
                  line: '{name}把纸鸢放得很高，线在指间发烫。' },
                { id: 'hide', name: '捉迷藏', cost: 2000000, cd: 2 * HOUR_MS, mood: 7, attr: 'physique', gain: 1,
                  line: '{name}藏在缸后，却把笑声漏了出来。' },
                { id: 'riddle', name: '灯谜会', cost: 5000000, cd: 3 * HOUR_MS, mood: 5, attr: 'intelligence', gain: 2,
                  line: '{name}猜中一谜，奖品是一颗糖，却开心得像中了举。' },
                { id: 'drama', name: '粉墨登场', cost: 8000000, cd: 4 * HOUR_MS, mood: 8, attr: 'charm', gain: 2, fame: 3,
                  line: '{name}唱了一句走调的戏，全场却鼓掌。' },
                { id: 'race', name: '巷口赛跑', cost: 2500000, cd: 2 * HOUR_MS, mood: 4, attr: 'physique', gain: 2,
                  line: '{name}跑第一，得意忘形摔了一跤，又笑着爬起来。' },
                { id: 'shop_play', name: '过家家买卖', cost: 3500000, cd: 3 * HOUR_MS, mood: 5, attr: 'business', gain: 2,
                  line: '{name}用树叶当钱，把「生意」做得有模有样。' }
            ],
            // —— 夜宵 / 睡眠 ——
            supper: [
                { id: 'congee', name: '夜粥', cost: 2500000, cd: 4 * HOUR_MS, mood: 5, sleep: 8,
                  line: '{name}喝完夜粥，眼皮开始打架。' },
                { id: 'sweet', name: '甜汤', cost: 4000000, cd: 4 * HOUR_MS, mood: 7, sleep: 5,
                  line: '{name}舔着勺，说再来一碗——被拒绝后乖乖去睡。' },
                { id: 'herb', name: '安神汤', cost: 8000000, cd: 5 * HOUR_MS, mood: 4, sleep: 12,
                  line: '{name}喝了安神汤，夜梦都变得轻。' }
            ],
            sleep: {
                max: 100,
                decayPerDay: 15,
                tiers: [
                    { need: 0, name: '困倦', trainMod: 0.85 },
                    { need: 40, name: '尚可', trainMod: 1 },
                    { need: 70, name: '安眠', trainMod: 1.1 },
                    { need: 90, name: '沉睡回气', trainMod: 1.2, worldHp: 0.15 }
                ],
                restCost: 1500000,
                restCd: 3 * HOUR_MS,
                restGain: 20
            },
            // —— 祝福符（限时，短CD）——
            charms: [
                { id: 'peace', name: '平安符', cost: 15000000, cd: 6 * HOUR_MS, duration: 4 * HOUR_MS, hp: 3, mood: 4 },
                { id: 'study', name: '文昌符', cost: 18000000, cd: 6 * HOUR_MS, duration: 4 * HOUR_MS, crit: 3, atk: 1 },
                { id: 'brave', name: '勇字符', cost: 18000000, cd: 6 * HOUR_MS, duration: 4 * HOUR_MS, atk: 3, crit: 1 },
                { id: 'family', name: '齐心符', cost: 25000000, cd: 8 * HOUR_MS, duration: 5 * HOUR_MS, atk: 2, hp: 2, crit: 2, needMembers: 5 }
            ],
            // —— 迷你奇遇 ——
            adventures: [
                { id: 'lost_cat', name: '寻猫', cost: 5000000, cd: 4 * HOUR_MS, mood: 6, fame: 2, attr: 'charm',
                  line: '{name}把邻家猫从树上抱下来，自己却下不来，被人笑话一整日。' },
                { id: 'old_map', name: '旧图半页', cost: 20000000, cd: 6 * HOUR_MS, fame: 6, attr: 'intelligence', worldCritDmg: 0.5,
                  line: '{name}捡到半页旧图，墨迹指向祠堂——原来只是老鼠洞。' },
                { id: 'help_porter', name: '帮脚夫', cost: 8000000, cd: 4 * HOUR_MS, mood: 5, fame: 3, attr: 'physique',
                  line: '{name}帮脚夫扛了一程，换来一句「后生可畏」。' },
                { id: 'secret_recipe', name: '街头秘方', cost: 25000000, cd: 8 * HOUR_MS, fame: 5, attr: 'business', worldAtk: 0.4,
                  line: '{name}买到一纸「秘方」，回家一试，原来是普通糖水——但卖相很好。' },
                { id: 'rain_shelter', name: '雨棚让座', cost: 3000000, cd: 3 * HOUR_MS, mood: 8, fame: 2,
                  line: '{name}把伞让给老人，自己淋成落汤鸡，心里却干爽。' },
                { id: 'gen_echo', name: '代际回声', cost: 40000000, cd: 8 * HOUR_MS, fame: 10, needGen: 6, worldAtk: 1, worldHp: 1, worldCritDmg: 1,
                  line: '{name}在巷尾听见有人喊旧名，回头却只有风。' }
            ],
            // —— 契约学徒（升级式 12h）——
            contract: {
                maxLv: 12,
                costBase: 45000000,
                growth: 2.6,
                per: { atk: 0.6, hp: 0.5, crit: 0.5 },
                needAdultMentor: true
            },
            // —— 岁月礼（生日式，按成员冷却 12h 可领一次「生辰礼」）——
            birthday: {
                cost: 20000000,
                cd: CD_12H,
                attrAll: 2,
                fame: 6,
                mood: 10,
                line: '今日权作{name}的生辰。灯下切了一块点心，全族喊「长命百岁」。'
            },
            // —— 未来家书 ——
            futureLetter: {
                cost: 10000000,
                cd: 8 * HOUR_MS,
                openAfter: 2 * HOUR_MS,
                fame: 5,
                mood: 6,
                attrAll: 1,
                lineWrite: '{name}给未来的自己写了封信，封进匣子。',
                lineOpen: '{name}打开从前的信，笑了很久，又有一点酸。'
            },
            // —— 子弟排行榜 buff（只读+小互动）——
            ranking: {
                refreshCost: 5000000,
                cd: 2 * HOUR_MS,
                topBonus: { atk: 1.5, hp: 1.5, crit: 1 }
            },
            // —— 亲子夜课 ——
            parentNight: [
                { id: 'story', name: '膝下故事', cost: 4000000, cd: 3 * HOUR_MS, intimacy: 2, mood: 5, attr: 'intelligence',
                  line: '你给{name}讲到一半，{name}已经睡着，嘴角还笑着。' },
                { id: 'check_work', name: '检查功课', cost: 5000000, cd: 3 * HOUR_MS, intimacy: 1, mood: 2, attr: 'intelligence', gain: 2,
                  line: '你指出一个错字，{name}不服，对了一夜，终于服了。' },
                { id: 'walk_moon', name: '月下散步', cost: 3000000, cd: 3 * HOUR_MS, intimacy: 3, mood: 6,
                  line: '你和{name}踩着影走，谁也不提明天的功课。' },
                { id: 'spar_parent', name: '父子/母女手合', cost: 6000000, cd: 4 * HOUR_MS, intimacy: 2, mood: 4, attr: 'physique', gain: 2, needStage: 2,
                  line: '你和{name}过了两招。你收着力，{name}却拼了全力。' }
            ],
            // —— 美德榜升级（族级 12h）——
            virtueHall: {
                maxLv: 15,
                costBase: 100000000,
                growth: 2.7,
                per: { atk: 1, hp: 1.2, crit: 0.8 }
            },
            // —— 子弟营寨（族级 12h）——
            camp: {
                maxLv: 18,
                costBase: 90000000,
                growth: 2.65,
                per: { atk: 1.1, hp: 1.0, crit: 0.9 },
                needChildren: 3
            }
        };

        var moreEvents = [
            { id: 'dream_share', title: '童梦相闻', text: '几个孩子同时做了相似的梦：灯、雨、和一位叫不出名的老人。',
              choices: [
                { label: '记入梦册并祈福', cost: 70000000, effect: 'novaCharmReady', prestige: 16, worldHp: 4 },
                { label: '当笑话讲给全族听', cost: 20000000, effect: 'livingMood', amount: 10, prestige: 8 },
                { label: '勿声张，恐扰梦', cost: 0, effect: 'none', prestige: 3 }
              ]},
            { id: 'album_day', title: '纪念册日', text: '旧日画像散落一地。有人提议装成册，留给十八代以后的人看。',
              choices: [
                { label: '正式装帧升级', cost: 120000000, effect: 'novaAlbumReady', prestige: 20, worldHp: 5 },
                { label: '先收集缺页', cost: 40000000, effect: 'livingMood', amount: 6, prestige: 10 },
                { label: '以后再说', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'camp_drill', title: '子弟营操', text: '操场上尘土飞扬。有人喊号子，有人掉队，有人偷偷笑。',
              choices: [
                { label: '扩营升级操练', cost: 150000000, effect: 'novaCampReady', prestige: 22, worldAtk: 5 },
                { label: '犒赏一餐', cost: 50000000, effect: 'happiness', amount: 12, prestige: 10 },
                { label: '今日放假', cost: 0, effect: 'livingMood', amount: 5, prestige: 4 }
              ]},
            { id: 'virtue_debate', title: '五德之辩', text: '少年们争论：仁与义哪个更重？争到面红耳赤，茶凉了也不知道。',
              choices: [
                { label: '立德堂升级供奉', cost: 180000000, effect: 'novaVirtueHallReady', prestige: 25, worldAtk: 3, worldHp: 4, worldCritDmg: 3 },
                { label: '各执一词都表扬', cost: 60000000, effect: 'novaVirtueBoost', prestige: 14 },
                { label: '打住，去干活', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'sleep_crisis', title: '夜不安枕', text: '孩子连夜做噩梦。屋里灯一直亮着，大人轮流守着。',
              choices: [
                { label: '熬安神汤全员补觉', cost: 80000000, effect: 'novaSleepBoost', prestige: 15, worldHp: 5 },
                { label: '讲故事到天亮', cost: 20000000, effect: 'livingMood', amount: 8, prestige: 8 },
                { label: '求祠堂赐安', cost: 40000000, effect: 'offerReady', prestige: 12 }
              ]}
        ];
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'dream2', name: '梦有所思', desc: '记录梦境 2 次', need: 2, key: 'novaDream', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'play2', name: '游艺时光', desc: '完成游艺 2 次', need: 2, key: 'novaPlay', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'virtue1', name: '五德进境', desc: '提升五德 1 次', need: 1, key: 'novaVirtue', rewardPrestige: 22, rewardFunds: 12000000, rewardExp: 18 },
            { id: 'adv1', name: '街头奇遇', desc: '完成迷你奇遇 1 次', need: 1, key: 'novaAdv', rewardPrestige: 16, rewardFunds: 8000000, rewardExp: 14 },
            { id: 'parent1', name: '亲子夜课', desc: '完成亲子夜课 1 次', need: 1, key: 'novaParent', rewardPrestige: 15, rewardFunds: 6000000, rewardExp: 12 },
            { id: 'novaUp1', name: '子弟营建', desc: '升级德堂/营寨/纪念册 1 次', need: 1, key: 'novaUp', rewardPrestige: 25, rewardFunds: 15000000, rewardExp: 20 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensureNovaData() {
        if (!player.children) return;
        installNovaConfig();
        if (!player.children.descNova) {
            player.children.descNova = {
                dreamCd: {},
                playCd: {},
                supperCd: {},
                sleepCd: {},
                charmCd: {},
                charmUntil: {},
                advCd: {},
                parentCd: {},
                albumPages: {},
                albumBookLv: 0,
                albumBookCd: 0,
                virtueHallLv: 0,
                virtueHallCd: 0,
                campLv: 0,
                campCd: 0,
                rankCd: 0,
                rankCache: null,
                albumReady: false,
                campReady: false,
                virtueHallReady: false,
                charmReady: false,
                lastSleepDecay: 0
            };
        }
        var d = player.children.descNova;
        ['dreamCd', 'playCd', 'supperCd', 'sleepCd', 'charmCd', 'charmUntil', 'advCd', 'parentCd', 'albumPages'].forEach(function (k) {
            if (!d[k] || typeof d[k] !== 'object') d[k] = {};
        });
        (player.children.children || []).forEach(function (m) {
            if (!m.nova) {
                m.nova = {
                    virtues: {}, virtueCd: {},
                    sleep: 70,
                    contractLv: 0, contractCd: 0, contractMentorId: null,
                    birthdayCd: 0,
                    futureLetterAt: 0,
                    album: {}
                };
            }
            var n = m.nova;
            if (!n.virtues) n.virtues = {};
            if (!n.virtueCd) n.virtueCd = {};
            if (!n.album) n.album = {};
            if (n.sleep == null) n.sleep = 70;
            if (n.contractLv == null) n.contractLv = 0;
        });
        decaySleep();
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
        m.descFame = (m.descFame || 0) + (n || 0);
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

    function cdLeft(until) { return Math.max(0, (until || 0) - Date.now()); }
    function cdHint(until) {
        var left = cdLeft(until);
        if (left <= 0) return '';
        return '冷却 ' + Math.floor(left / 3600000) + '时' + Math.ceil((left % 3600000) / 60000) + '分';
    }

    function decaySleep() {
        var d = player.children.descNova;
        var day = Math.floor(Date.now() / DAY_MS);
        if (d.lastSleepDecay === day) return;
        d.lastSleepDecay = day;
        var decay = (N().sleep && N().sleep.decayPerDay) || 15;
        (player.children.children || []).forEach(function (m) {
            if (!m.nova) return;
            m.nova.sleep = Math.max(0, (m.nova.sleep || 70) - decay);
        });
    }

    function sleepTier(m) {
        var sleep = (m.nova && m.nova.sleep) || 0;
        var tier = (N().sleep.tiers || [])[0];
        (N().sleep.tiers || []).forEach(function (t) {
            if (sleep >= t.need) tier = t;
        });
        return tier;
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

    function localOffspringCount(parentId) {
        return (player.children.children || []).filter(function (c) { return c.parentId === parentId; }).length;
    }

    // ——— 五德升级 12h ———
    window.upgradeNovaVirtue = function (memberIndex, virtueId) {
        ensureNovaData();
        var m = (player.children.children || [])[memberIndex];
        var v = (N().virtues || []).find(function (x) { return x.id === virtueId; });
        if (!m || !v || !m.nova) return;
        var left = cdLeft(m.nova.virtueCd[virtueId]);
        if (left > 0) return logAction(v.name + ' 德冷却中（12小时），' + cdHint(m.nova.virtueCd[virtueId]), 'info');
        var lv = m.nova.virtues[virtueId] || 0;
        if (lv >= v.max) return logAction('已满', 'info');
        var cost = Math.floor(v.costBase * Math.pow(v.growth, lv));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        m.nova.virtues[virtueId] = lv + 1;
        m.nova.virtueCd[virtueId] = Date.now() + CD_12H;
        if (v.attr && m.attributes) m.attributes[v.attr] = (m.attributes[v.attr] || 0) + 1;
        addMood(v.mood || 0);
        addFame(m, 3);
        bump('novaVirtue');
        pushDiary(m.name + ' 「' + v.name + '」德进至 Lv.' + m.nova.virtues[virtueId]);
        logAction(m.name + ' ' + v.name + ' Lv.' + m.nova.virtues[virtueId] + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 梦境 ———
    window.recordNovaDream = function (dreamId, memberIndex) {
        ensureNovaData();
        var dream = (N().dreams || []).find(function (d) { return d.id === dreamId; });
        var m = (player.children.children || [])[memberIndex];
        if (!dream || !m) return;
        if (dream.needBetrothed && !m.isBetrothed && !m.isMarried) return logAction('需订婚/成婚后才易做此梦', 'info');
        var cdKey = dream.id + ':' + (m.id || memberIndex);
        if (cdLeft(player.children.descNova.dreamCd[cdKey]) > 0) return logAction('冷却中', 'info');
        if (funds().availableFunds < dream.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= dream.cost;
        player.children.descNova.dreamCd[cdKey] = Date.now() + dream.cd;
        addMood(dream.mood || 0);
        if (dream.attr && m.attributes) m.attributes[dream.attr] = (m.attributes[dream.attr] || 0) + (dream.gain || 1);
        if (dream.fame) addFame(m, dream.fame);
        if (dream.bond) {
            m.maritalBond = Math.min(100, (m.maritalBond || 0) + dream.bond);
            if (m.betrothalAffinity != null) m.betrothalAffinity = Math.min(50, m.betrothalAffinity + dream.bond);
        }
        addTempWorld(dream.worldAtk, dream.worldHp, dream.worldCritDmg, 3);
        var line = dream.lines[Math.floor(Math.random() * dream.lines.length)].replace(/\{name\}/g, m.name);
        pushDiary('【梦】' + line);
        bump('novaDream');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 游艺 ———
    window.doNovaPlay = function (playId, memberIndex) {
        ensureNovaData();
        var play = (N().plays || []).find(function (p) { return p.id === playId; });
        var m = (player.children.children || [])[memberIndex];
        if (!play || !m) return;
        var cdKey = play.id + ':' + (m.id || memberIndex);
        if (cdLeft(player.children.descNova.playCd[cdKey]) > 0) return logAction('冷却中', 'info');
        if (funds().availableFunds < play.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= play.cost;
        player.children.descNova.playCd[cdKey] = Date.now() + play.cd;
        addMood(play.mood || 0);
        if (play.attr && m.attributes) m.attributes[play.attr] = (m.attributes[play.attr] || 0) + (play.gain || 1);
        if (play.fame) addFame(m, play.fame);
        m.nova.sleep = Math.min(100, (m.nova.sleep || 70) + 3);
        var line = play.line.replace(/\{name\}/g, m.name);
        pushDiary(line);
        bump('novaPlay');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 夜宵 / 睡眠 ———
    window.doNovaSupper = function (supperId, memberIndex) {
        ensureNovaData();
        var s = (N().supper || []).find(function (x) { return x.id === supperId; });
        var m = (player.children.children || [])[memberIndex];
        if (!s || !m) return;
        var cdKey = s.id + ':' + (m.id || memberIndex);
        if (cdLeft(player.children.descNova.supperCd[cdKey]) > 0) return logAction('冷却中', 'info');
        if (funds().availableFunds < s.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= s.cost;
        player.children.descNova.supperCd[cdKey] = Date.now() + s.cd;
        addMood(s.mood || 0);
        m.nova.sleep = Math.min(100, (m.nova.sleep || 70) + (s.sleep || 0));
        pushDiary(s.line.replace(/\{name\}/g, m.name));
        logAction(m.name + ' 睡眠 ' + m.nova.sleep + '/100', 'success');
        refreshUI();
    };

    window.restNovaSleep = function (memberIndex) {
        ensureNovaData();
        var m = (player.children.children || [])[memberIndex];
        var sl = N().sleep;
        if (!m) return;
        var id = m.id || memberIndex;
        if (cdLeft(player.children.descNova.sleepCd[id]) > 0) return logAction('歇息冷却中', 'info');
        if (funds().availableFunds < sl.restCost) return logAction('资金不足', 'error');
        funds().availableFunds -= sl.restCost;
        player.children.descNova.sleepCd[id] = Date.now() + sl.restCd;
        m.nova.sleep = Math.min(100, (m.nova.sleep || 70) + sl.restGain);
        pushDiary(m.name + ' 小憩片刻，睡眠回升。');
        logAction(m.name + ' 睡眠 ' + m.nova.sleep, 'success');
        refreshUI();
    };

    // ——— 祝福符 ———
    window.castNovaCharm = function (charmId) {
        ensureNovaData();
        var charm = (N().charms || []).find(function (c) { return c.id === charmId; });
        var d = player.children.descNova;
        if (!charm) return;
        if (charm.needMembers && (player.children.children || []).length < charm.needMembers) {
            return logAction('族人不足', 'error');
        }
        if (cdLeft(d.charmCd[charmId]) > 0 && !d.charmReady) return logAction('符咒冷却中', 'info');
        var cost = d.charmReady ? Math.floor(charm.cost * 0.5) : charm.cost;
        if (d.charmReady) d.charmReady = false;
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.charmCd[charmId] = Date.now() + charm.cd;
        d.charmUntil[charmId] = Date.now() + charm.duration;
        addMood(charm.mood || 0);
        pushDiary('点燃「' + charm.name + '」，青烟绕梁。');
        logAction(charm.name + ' 生效中', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 奇遇 ———
    window.doNovaAdventure = function (advId, memberIndex) {
        ensureNovaData();
        var adv = (N().adventures || []).find(function (a) { return a.id === advId; });
        var m = (player.children.children || [])[memberIndex];
        if (!adv || !m) return;
        if (adv.needGen && maxGen() < adv.needGen) return logAction('代数未及', 'error');
        var cdKey = adv.id + ':' + (m.id || memberIndex);
        if (cdLeft(player.children.descNova.advCd[cdKey]) > 0) return logAction('冷却中', 'info');
        if (funds().availableFunds < adv.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= adv.cost;
        player.children.descNova.advCd[cdKey] = Date.now() + adv.cd;
        addMood(adv.mood || 0);
        addFame(m, adv.fame || 0);
        if (adv.attr && m.attributes) m.attributes[adv.attr] = (m.attributes[adv.attr] || 0) + 2;
        addTempWorld(adv.worldAtk, adv.worldHp, adv.worldCritDmg, 4);
        var line = adv.line.replace(/\{name\}/g, m.name);
        pushDiary('【奇遇】' + line);
        bump('novaAdv');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 亲子夜课 ———
    window.doNovaParentNight = function (actId, memberIndex) {
        ensureNovaData();
        var act = (N().parentNight || []).find(function (a) { return a.id === actId; });
        var m = (player.children.children || [])[memberIndex];
        if (!act || !m) return;
        if (act.needStage != null && (m.growthStage || 0) < act.needStage) return logAction('年纪尚小', 'info');
        var cdKey = act.id + ':' + (m.id || memberIndex);
        if (cdLeft(player.children.descNova.parentCd[cdKey]) > 0) return logAction('冷却中', 'info');
        if (funds().availableFunds < act.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= act.cost;
        player.children.descNova.parentCd[cdKey] = Date.now() + act.cd;
        m.intimacy = (m.intimacy || 0) + (act.intimacy || 1);
        addMood(act.mood || 0);
        if (act.attr && m.attributes) m.attributes[act.attr] = (m.attributes[act.attr] || 0) + (act.gain || 1);
        m.nova.sleep = Math.min(100, (m.nova.sleep || 70) + 5);
        var line = act.line.replace(/\{name\}/g, m.name);
        pushDiary(line);
        bump('novaParent');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 纪念册页 ———
    window.collectAlbumPage = function (memberIndex, pageId) {
        ensureNovaData();
        var m = (player.children.children || [])[memberIndex];
        var page = (N().album.pages || []).find(function (p) { return p.id === pageId; });
        if (!m || !page) return;
        if (m.nova.album[pageId]) return logAction('已收录', 'info');
        if (page.needAdult && !isAdult(m)) return logAction('需成年', 'error');
        if (page.needMarried && !(m.isMarried || m.married || m.spouseId || m.spouseName || (m.spouse && m.spouse.name))) return logAction('需成婚', 'error');
        if (page.needParent && localOffspringCount(m.id) < 1) return logAction('需已有子女', 'error');
        if (page.needStage != null && (m.growthStage || 0) < page.needStage) return logAction('阶段未到', 'info');
        if (funds().availableFunds < page.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= page.cost;
        m.nova.album[pageId] = true;
        player.children.descNova.albumPages[m.id + ':' + pageId] = true;
        addFame(m, 4);
        pushDiary(m.name + ' 纪念册收录「' + page.name + '」。');
        logAction('收录「' + page.name + '」', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 纪念册总册升级 12h ———
    window.upgradeNovaAlbumBook = function () {
        ensureNovaData();
        var al = N().album;
        var d = player.children.descNova;
        if (cdLeft(d.albumBookCd) > 0 && !d.albumReady) return logAction('纪念册升级冷却中（12小时），' + cdHint(d.albumBookCd), 'info');
        var lv = d.albumBookLv || 0;
        if (lv >= al.bookMax) return logAction('已满级', 'info');
        var pages = Object.keys(d.albumPages || {}).length;
        if (pages < 3 + lv) return logAction('收录页数不足（需 ' + (3 + lv) + ' 页）', 'error');
        var cost = Math.floor(al.bookCostBase * Math.pow(al.bookGrowth, lv));
        if (d.albumReady) { cost = Math.floor(cost * 0.5); d.albumReady = false; }
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.albumBookLv = lv + 1;
        d.albumBookCd = Date.now() + CD_12H;
        bump('novaUp');
        pushDiary('家族纪念册装帧至第 ' + d.albumBookLv + ' 辑。');
        logAction('纪念册 Lv.' + d.albumBookLv + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 契约学徒 12h ———
    window.upgradeNovaContract = function (pupilIndex, mentorIndex) {
        ensureNovaData();
        var pupil = (player.children.children || [])[pupilIndex];
        var mentor = (player.children.children || [])[mentorIndex];
        var ct = N().contract;
        if (!pupil || !mentor) return;
        if (!isAdult(mentor)) return logAction('契约师父须成年', 'error');
        if (isAdult(pupil)) return logAction('请选择未成年徒弟', 'error');
        if (cdLeft(pupil.nova.contractCd) > 0) return logAction('契约升级冷却中（12小时）', 'info');
        var lv = pupil.nova.contractLv || 0;
        if (lv >= ct.maxLv) return logAction('契约已满', 'info');
        var cost = Math.floor(ct.costBase * Math.pow(ct.growth, lv));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        pupil.nova.contractLv = lv + 1;
        pupil.nova.contractCd = Date.now() + CD_12H;
        pupil.nova.contractMentorId = mentor.id;
        Object.keys(pupil.attributes || {}).forEach(function (k) {
            pupil.attributes[k] = (pupil.attributes[k] || 0) + 2;
        });
        addFame(pupil, 5);
        addFame(mentor, 3);
        bump('novaUp');
        pushDiary(pupil.name + ' 与 ' + mentor.name + ' 的契约学徒升至 Lv.' + pupil.nova.contractLv);
        logAction('契约 Lv.' + pupil.nova.contractLv + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 生辰礼 12h/人 ———
    window.celebrateNovaBirthday = function (memberIndex) {
        ensureNovaData();
        var m = (player.children.children || [])[memberIndex];
        var bd = N().birthday;
        if (!m) return;
        if (cdLeft(m.nova.birthdayCd) > 0) return logAction('生辰礼冷却中（12小时），' + cdHint(m.nova.birthdayCd), 'info');
        if (funds().availableFunds < bd.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= bd.cost;
        m.nova.birthdayCd = Date.now() + bd.cd;
        Object.keys(m.attributes || {}).forEach(function (k) {
            m.attributes[k] = (m.attributes[k] || 0) + (bd.attrAll || 2);
        });
        addFame(m, bd.fame || 6);
        addMood(bd.mood || 10);
        m.nova.sleep = Math.min(100, (m.nova.sleep || 70) + 10);
        pushDiary(bd.line.replace(/\{name\}/g, m.name));
        logAction(m.name + ' 生辰礼成！（12小时后可再办）', 'success');
        refreshUI();
    };

    // ——— 未来家书 ———
    window.writeNovaFutureLetter = function (memberIndex) {
        ensureNovaData();
        var m = (player.children.children || [])[memberIndex];
        var fl = N().futureLetter;
        if (!m) return;
        if (m.nova.futureLetterAt && m.nova.futureLetterAt > Date.now()) return logAction('已有一封待拆家书', 'info');
        if (m.nova.futureLetterAt && m.nova.futureLetterAt <= Date.now()) {
            // 可开启
            Object.keys(m.attributes || {}).forEach(function (k) {
                m.attributes[k] = (m.attributes[k] || 0) + (fl.attrAll || 1);
            });
            addFame(m, fl.fame || 5);
            addMood(fl.mood || 6);
            m.nova.futureLetterAt = 0;
            pushDiary(fl.lineOpen.replace(/\{name\}/g, m.name));
            logAction(m.name + ' 拆开未来家书，有所感悟', 'success');
            refreshUI();
            return;
        }
        // 检查写信冷却存在 futureLetterCd
        if (!m.nova.futureLetterCd) m.nova.futureLetterCd = 0;
        if (cdLeft(m.nova.futureLetterCd) > 0) return logAction('写信冷却中', 'info');
        if (funds().availableFunds < fl.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= fl.cost;
        m.nova.futureLetterCd = Date.now() + fl.cd;
        m.nova.futureLetterAt = Date.now() + fl.openAfter;
        pushDiary(fl.lineWrite.replace(/\{name\}/g, m.name));
        logAction(m.name + ' 写下未来家书，约 ' + Math.ceil(fl.openAfter / 3600000) + ' 小时后可拆', 'success');
        refreshUI();
    };

    // ——— 德堂 / 营寨 12h ———
    window.upgradeNovaVirtueHall = function () {
        ensureNovaData();
        var vh = N().virtueHall;
        var d = player.children.descNova;
        if (cdLeft(d.virtueHallCd) > 0 && !d.virtueHallReady) return logAction('德堂升级冷却中（12小时）', 'info');
        var lv = d.virtueHallLv || 0;
        if (lv >= vh.maxLv) return logAction('已满', 'info');
        var cost = Math.floor(vh.costBase * Math.pow(vh.growth, lv));
        if (d.virtueHallReady) { cost = Math.floor(cost * 0.5); d.virtueHallReady = false; }
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.virtueHallLv = lv + 1;
        d.virtueHallCd = Date.now() + CD_12H;
        bump('novaUp');
        pushDiary('五德堂升至 Lv.' + d.virtueHallLv);
        logAction('五德堂 Lv.' + d.virtueHallLv + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    window.upgradeNovaCamp = function () {
        ensureNovaData();
        var camp = N().camp;
        var d = player.children.descNova;
        if ((player.children.children || []).length < camp.needChildren) return logAction('子弟不足', 'error');
        if (cdLeft(d.campCd) > 0 && !d.campReady) return logAction('营寨升级冷却中（12小时）', 'info');
        var lv = d.campLv || 0;
        if (lv >= camp.maxLv) return logAction('已满', 'info');
        var cost = Math.floor(camp.costBase * Math.pow(camp.growth, lv));
        if (d.campReady) { cost = Math.floor(cost * 0.5); d.campReady = false; }
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.campLv = lv + 1;
        d.campCd = Date.now() + CD_12H;
        bump('novaUp');
        pushDiary('子弟营寨升至 Lv.' + d.campLv);
        logAction('营寨 Lv.' + d.campLv + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 排行 ———
    window.refreshNovaRanking = function () {
        ensureNovaData();
        var rk = N().ranking;
        var d = player.children.descNova;
        if (cdLeft(d.rankCd) > 0) return logAction('刷新冷却中', 'info');
        if (funds().availableFunds < rk.refreshCost) return logAction('资金不足', 'error');
        funds().availableFunds -= rk.refreshCost;
        d.rankCd = Date.now() + rk.cd;
        var list = (player.children.children || []).slice().sort(function (a, b) {
            var sa = (a.descFame || 0) * 2 + Object.keys(a.attributes || {}).reduce(function (s, k) { return s + (a.attributes[k] || 0); }, 0);
            var sb = (b.descFame || 0) * 2 + Object.keys(b.attributes || {}).reduce(function (s, k) { return s + (b.attributes[k] || 0); }, 0);
            return sb - sa;
        });
        d.rankCache = list.slice(0, 8).map(function (m) { return m.id; });
        d.rankTopId = list[0] && list[0].id;
        logAction('子弟排行已刷新：魁首 ' + (list[0] ? list[0].name : '无'), 'success');
        refreshUI();
    };

    // 培养吃睡眠
    var _origTrain = window.trainChild;
    if (_origTrain) {
        window.trainChild = function (childIndex, trainingType) {
            ensureNovaData();
            var child = player.children.children[childIndex];
            var before = child && (child.totalTraining || 0);
            var result = _origTrain(childIndex, trainingType);
            child = player.children.children[childIndex];
            if (!child || (child.totalTraining || 0) <= before) return result;
            var tier = sleepTier(child);
            if (tier.trainMod > 1 && Math.random() < (tier.trainMod - 1)) {
                var keys = Object.keys(child.attributes || {});
                if (keys.length) {
                    var k = keys[Math.floor(Math.random() * keys.length)];
                    child.attributes[k] = (child.attributes[k] || 0) + 1;
                    logAction(child.name + ' 睡眠「' + tier.name + '」，培养额外有所得', 'info');
                }
            } else if (tier.trainMod < 1 && Math.random() < 0.15) {
                logAction(child.name + ' 有些困倦，今日培养略滞', 'info');
            }
            child.nova.sleep = Math.max(0, (child.nova.sleep || 70) - 3);
            return result;
        };
    }

    function calcNovaWorld() {
        ensureNovaData();
        var atk = 0, hp = 0, crit = 0;
        var d = player.children.descNova;
        var al = N().album;
        var pages = Object.keys(d.albumPages || {}).length;
        atk += pages * (al.perPage.atk || 0);
        hp += pages * (al.perPage.hp || 0);
        crit += pages * (al.perPage.crit || 0);
        var bl = d.albumBookLv || 0;
        atk += bl * (al.perBook.atk || 0);
        hp += bl * (al.perBook.hp || 0);
        crit += bl * (al.perBook.crit || 0);

        var vh = N().virtueHall;
        var vl = d.virtueHallLv || 0;
        atk += vl * (vh.per.atk || 0);
        hp += vl * (vh.per.hp || 0);
        crit += vl * (vh.per.crit || 0);

        var camp = N().camp;
        var cl = d.campLv || 0;
        atk += cl * (camp.per.atk || 0);
        hp += cl * (camp.per.hp || 0);
        crit += cl * (camp.per.crit || 0);

        (N().charms || []).forEach(function (charm) {
            if (Date.now() < (d.charmUntil[charm.id] || 0)) {
                atk += charm.atk || 0;
                hp += charm.hp || 0;
                crit += charm.crit || 0;
            }
        });

        if (d.rankTopId) {
            var top = (player.children.children || []).find(function (m) { return m.id === d.rankTopId; });
            if (top) {
                var tb = N().ranking.topBonus;
                atk += tb.atk || 0;
                hp += tb.hp || 0;
                crit += tb.crit || 0;
            }
        }

        var ct = N().contract;
        (player.children.children || []).forEach(function (m) {
            if (!m.nova) return;
            (N().virtues || []).forEach(function (v) {
                var lv = m.nova.virtues[v.id] || 0;
                atk += lv * (v.worldAtk || 0);
                hp += lv * (v.worldHp || 0);
                crit += lv * (v.worldCritDmg || 0);
            });
            var clv = m.nova.contractLv || 0;
            atk += clv * (ct.per.atk || 0);
            hp += clv * (ct.per.hp || 0);
            crit += clv * (ct.per.crit || 0);
            var st = sleepTier(m);
            hp += st.worldHp || 0;
        });

        return { atk: atk, hp: hp, crit: crit };
    }

    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        installNovaConfig();
        ensureNovaData();
        var base = _origBonus ? _origBonus() : { worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var w = calcNovaWorld();
        base.worldAtk = (base.worldAtk || 0) + w.atk;
        base.worldHp = (base.worldHp || 0) + w.hp;
        base.worldCritDmg = (base.worldCritDmg || 0) + w.crit;
        return base;
    };

    var _origResolve = window.resolveClanEvent;
    if (_origResolve) {
        window.resolveClanEvent = function (choiceIndex) {
            var ev = player.children && player.children.activeEvent;
            var conf = ev && (cfg().events || []).find(function (e) { return e.id === ev.id; });
            var ch = conf && conf.choices && conf.choices[choiceIndex];
            _origResolve(choiceIndex);
            if (!ch) return;
            ensureNovaData();
            var d = player.children.descNova;
            if (ch.effect === 'novaCharmReady') d.charmReady = true;
            else if (ch.effect === 'novaAlbumReady') d.albumReady = true;
            else if (ch.effect === 'novaCampReady') d.campReady = true;
            else if (ch.effect === 'novaVirtueHallReady') d.virtueHallReady = true;
            else if (ch.effect === 'novaVirtueBoost') {
                (player.children.children || []).forEach(function (m) {
                    if (!m.nova) return;
                    (N().virtues || []).forEach(function (v) {
                        m.nova.virtues[v.id] = Math.min(v.max, (m.nova.virtues[v.id] || 0) + 1);
                    });
                });
            } else if (ch.effect === 'novaSleepBoost') {
                (player.children.children || []).forEach(function (m) {
                    if (m.nova) m.nova.sleep = 100;
                });
            }
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }
    function opts(filterFn) {
        return (player.children.children || []).map(function (m, i) {
            if (filterFn && !filterFn(m)) return '';
            var st = sleepTier(m);
            return '<option value="' + i + '">' + m.name + '（' + genLabel(m.generation || 1) + '·' + st.name + '·眠' + (m.nova && m.nova.sleep || 0) + '）</option>';
        }).join('');
    }

    function updateNovaVirtuePanel() {
        var box = el('novaVirtuePanel');
        if (!box) return;
        ensureNovaData();
        var d = player.children.descNova;
        var vh = N().virtueHall;
        var hallCost = Math.floor(vh.costBase * Math.pow(vh.growth, d.virtueHallLv || 0));
        var hallTag = typeof lineageCostTag === 'function' ? lineageCostTag(hallCost, '12h') : ('（' + fmt(hallCost) + '）');
        box.innerHTML = '<div class="c-form-row"><label>子弟</label><select id="novaVirtueMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-hint">五德升级各有 12 小时冷却；费用随等级递增</div>' +
            '<div class="c-train-grid">' + (N().virtues || []).map(function (v) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + v.name + '</div>' +
                    '<div class="ms-desc">下级约 ' + fmt(v.costBase) + ' 起</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="upgradeNovaVirtue(+document.getElementById(\'novaVirtueMember\').value,\'' + v.id + '\')">进「' + v.name + '」</button></div>';
            }).join('') + '</div>' +
            '<div class="c-hint" style="margin-top:8px;">五德堂 Lv.' + (d.virtueHallLv || 0) + ' · 下级 <b style="color:#FFD700;">' + fmt(hallCost) + '</b></div>' +
            '<button class="c-btn c-btn-purple" style="width:100%;margin-top:4px;" onclick="upgradeNovaVirtueHall()">升级五德堂' + hallTag + '</button>';
    }

    function updateNovaDreamPlayPanel() {
        var box = el('novaDreamPlayPanel');
        if (!box) return;
        ensureNovaData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="novaDreamMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">梦境</h4><div class="c-train-grid">' + (N().dreams || []).map(function (d) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + d.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(d.cost) : ('耗资 ' + fmt(d.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="recordNovaDream(\'' + d.id + '\',+document.getElementById(\'novaDreamMember\').value)">' + d.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">游艺</h4><div class="c-train-grid">' + (N().plays || []).map(function (p) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + p.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(p.cost) : ('耗资 ' + fmt(p.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doNovaPlay(\'' + p.id + '\',+document.getElementById(\'novaDreamMember\').value)">' + p.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateNovaSleepPanel() {
        var box = el('novaSleepPanel');
        if (!box) return;
        ensureNovaData();
        var restCost = (N().sleep && N().sleep.restCost) || 1500000;
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="novaSleepMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-train-grid">' + (N().supper || []).map(function (s) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + s.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(s.cost, '睡眠+' + s.sleep) : ('耗资 ' + fmt(s.cost) + ' · 睡眠+' + s.sleep)) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="doNovaSupper(\'' + s.id + '\',+document.getElementById(\'novaSleepMember\').value)">' + s.name + '</button></div>';
            }).join('') + '</div>' +
            '<button class="c-btn c-btn-gold" style="width:100%;margin-top:8px;" onclick="restNovaSleep(+document.getElementById(\'novaSleepMember\').value)">小憩回气' +
            (typeof lineageCostTag === 'function' ? lineageCostTag(restCost) : ('（耗资 ' + fmt(restCost) + '）')) + '</button>';
    }

    function updateNovaAdvPanel() {
        var box = el('novaAdvPanel');
        if (!box) return;
        ensureNovaData();
        var g = maxGen();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="novaAdvMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-train-grid">' + (N().adventures || []).map(function (a) {
                var lock = a.needGen && g < a.needGen;
                return '<div class="c-milestone' + (lock ? '' : ' done') + '" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost) : ('耗资 ' + fmt(a.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" ' + (lock ? 'disabled' : '') +
                    ' onclick="doNovaAdventure(\'' + a.id + '\',+document.getElementById(\'novaAdvMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="margin:12px 0 8px;color:#E8C4A8;">祝福符</h4>' +
            '<div class="c-train-grid">' + (N().charms || []).map(function (c) {
                var on = Date.now() < (player.children.descNova.charmUntil[c.id] || 0);
                return '<div class="c-milestone' + (on ? ' done' : '') + '" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + c.name + (on ? ' · 生效中' : '') + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(c.cost) : ('耗资 ' + fmt(c.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-purple" onclick="castNovaCharm(\'' + c.id + '\')">请符</button></div>';
            }).join('') + '</div>';
    }

    function updateNovaParentPanel() {
        var box = el('novaParentPanel');
        if (!box) return;
        ensureNovaData();
        box.innerHTML = '<div class="c-form-row"><label>孩子</label><select id="novaParentMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-train-grid">' + (N().parentNight || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost) : ('耗资 ' + fmt(a.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doNovaParentNight(\'' + a.id + '\',+document.getElementById(\'novaParentMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateNovaAlbumPanel() {
        var box = el('novaAlbumPanel');
        if (!box) return;
        ensureNovaData();
        var d = player.children.descNova;
        var al = N().album;
        var bookCost = Math.floor(al.bookCostBase * Math.pow(al.bookGrowth, d.albumBookLv || 0));
        var bookTag = typeof lineageCostTag === 'function' ? lineageCostTag(bookCost, '12h') : ('（' + fmt(bookCost) + '）');
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="novaAlbumMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-hint">总册 Lv.' + (d.albumBookLv || 0) + ' · 已收录 ' + Object.keys(d.albumPages || {}).length + ' 页' +
            ' · 下级 <b style="color:#FFD700;">' + fmt(bookCost) + '</b>' +
            (cdHint(d.albumBookCd) ? ' · ' + cdHint(d.albumBookCd) : '') + '</div>' +
            '<div class="c-train-grid">' + (N().album.pages || []).map(function (p) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + p.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(p.cost) : ('耗资 ' + fmt(p.cost))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="collectAlbumPage(+document.getElementById(\'novaAlbumMember\').value,\'' + p.id + '\')">收录</button></div>';
            }).join('') + '</div>' +
            '<button class="c-btn c-btn-orange" style="width:100%;margin-top:8px;" onclick="upgradeNovaAlbumBook()">升级纪念总册' + bookTag + '</button>';
    }

    function updateNovaMiscPanel() {
        var box = el('novaMiscPanel');
        if (!box) return;
        ensureNovaData();
        var d = player.children.descNova;
        var rankHtml = '';
        if (d.rankCache && d.rankCache.length) {
            rankHtml = '<ol style="margin:8px 0;padding-left:20px;font-size:12px;">' + d.rankCache.map(function (id, idx) {
                var m = (player.children.children || []).find(function (x) { return x.id === id; });
                return '<li>' + (m ? m.name : id) + (idx === 0 ? ' ★' : '') + '</li>';
            }).join('') + '</ol>';
        }
        var birthCost = (N().birthday && N().birthday.cost) || 20000000;
        var letterCost = (N().futureLetter && N().futureLetter.cost) || 10000000;
        var rankCost = (N().ranking && N().ranking.refreshCost) || 5000000;
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="novaMiscMember" class="c-input">' + opts() + '</select></div>' +
            '<button class="c-btn c-btn-gold" style="width:100%;margin-top:4px;" onclick="celebrateNovaBirthday(+document.getElementById(\'novaMiscMember\').value)">办生辰礼' +
            (typeof lineageCostTag === 'function' ? lineageCostTag(birthCost, '每人12h') : ('（耗资 ' + fmt(birthCost) + ' · 每人12h）')) + '</button>' +
            '<button class="c-btn c-btn-pink" style="width:100%;margin-top:6px;" onclick="writeNovaFutureLetter(+document.getElementById(\'novaMiscMember\').value)">写/拆未来家书' +
            (typeof lineageCostTag === 'function' ? lineageCostTag(letterCost) : ('（耗资 ' + fmt(letterCost) + '）')) + '</button>' +
            '<div class="c-form-row" style="margin-top:10px;"><label>契约徒弟</label><select id="novaContractPupil" class="c-input">' + opts(function (m) { return !isAdult(m); }) + '</select></div>' +
            '<div class="c-form-row"><label>契约师父</label><select id="novaContractMentor" class="c-input">' + opts(isAdult) + '</select></div>' +
            '<button class="c-btn c-btn-blue" style="width:100%;" onclick="upgradeNovaContract(+document.getElementById(\'novaContractPupil\').value,+document.getElementById(\'novaContractMentor\').value)">契约学徒升级（约 ' + fmt((N().contract && N().contract.costBase) || 45000000) + ' 起 · 12h）</button>' +
            '<button class="c-btn c-btn-orange" style="width:100%;margin-top:8px;" onclick="upgradeNovaCamp()">升级子弟营寨 Lv.' + (d.campLv || 0) +
            (typeof lineageCostTag === 'function'
                ? lineageCostTag(Math.floor(N().camp.costBase * Math.pow(N().camp.growth, d.campLv || 0)), '12h')
                : ('（' + fmt(Math.floor(N().camp.costBase * Math.pow(N().camp.growth, d.campLv || 0))) + '）')) + '</button>' +
            '<button class="c-btn c-btn-purple" style="width:100%;margin-top:6px;" onclick="refreshNovaRanking()">刷新子弟排行' +
            (typeof lineageCostTag === 'function' ? lineageCostTag(rankCost) : ('（耗资 ' + fmt(rankCost) + '）')) + '</button>' + rankHtml;
    }

    window.updateDescNovaPanels = function () {
        installNovaConfig();
        ensureNovaData();
        updateNovaVirtuePanel();
        updateNovaDreamPlayPanel();
        updateNovaSleepPanel();
        updateNovaAdvPanel();
        updateNovaParentPanel();
        updateNovaAlbumPanel();
        updateNovaMiscPanel();
    };

    // 不再从玄脉 / living 级联刷新万象；由 refreshActiveChildTabPanels 按页签刷新

    var _origSwitch = window.switchChildTab;
    window.switchChildTab = function (tab) {
        if (_origSwitch) _origSwitch(tab);
        var node = document.getElementById('childSectionDescNova');
        if (node) node.classList.toggle('active', tab === 'descnova');
    };

    installNovaConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            installNovaConfig();
            ensureNovaData();
        }, 2600);
    });
    if (document.readyState !== 'loading') {
        setTimeout(function () {
            installNovaConfig();
            ensureNovaData();
        }, 2600);
    }
})();

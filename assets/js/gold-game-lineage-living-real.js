/**
 * 家族传承 · 人间实录 / 十八代烟火
 * 三餐起居、天气市集、字辈、扫墓、家传菜谱、弱冠及笄、家书、月例、口述史
 * 在 lineage-living-deep.js 之后加载
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
    function R() { return (cfg() && cfg().living && cfg().living.real) || {}; }

    function installRealConfig() {
        if (!window.lineageExtConfig || !window.lineageExtConfig.living) return;
        var living = window.lineageExtConfig.living;
        if (living._realInstalled) return;
        living._realInstalled = true;

        living.real = {
            // —— 三餐 ——
            meals: [
                { id: 'breakfast', name: '朝食', cost: 2000000, mood: 3, worldHp: 0.2, cd: 4 * HOUR_MS,
                  lines: ['粥香混着咸菜气。{name}把热碗推到老人面前。', '早饭简单，{name}却吃得很慢，像要把天亮嚼碎。'] },
                { id: 'lunch', name: '午膳', cost: 3500000, mood: 4, worldAtk: 0.2, worldHp: 0.2, cd: 5 * HOUR_MS,
                  lines: ['桌上多了一碟时蔬。{name}说「趁热」，筷子先动了别人的碗。', '午后日头毒，{name}却坚持把饭吃完再歇。'] },
                { id: 'dinner', name: '晚炊', cost: 4000000, mood: 5, worldHp: 0.3, worldCritDmg: 0.15, cd: 6 * HOUR_MS,
                  lines: ['灯下饭菜冒着热气。{name}数了数人头，又添了一双筷。', '有人晚归，{name}把菜热了又热，一句怨言没有。'] }
            ],
            // —— 天气 ——
            weathers: [
                { id: 'clear', name: '晴', weight: 35, choreMult: 1, marketMult: 1, mood: 1 },
                { id: 'cloudy', name: '阴', weight: 25, choreMult: 1, marketMult: 0.95, mood: 0 },
                { id: 'rain', name: '雨', weight: 20, choreMult: 1.15, marketMult: 1.1, mood: -1, illnessMult: 1.2 },
                { id: 'wind', name: '大风', weight: 12, choreMult: 1.2, marketMult: 1.05, mood: -1 },
                { id: 'snow', name: '雪', weight: 8, choreMult: 1.3, marketMult: 1.25, mood: -2, illnessMult: 1.4 }
            ],
            // —— 市集采买（更真实的油盐酱醋） ——
            marketGoods: [
                { id: 'rice', name: '口粮米面', cost: 8000000, stock: 3, mood: 4, worldHp: 0.4, days: 1.2,
                  line: '{name}扛回两袋米，肩头勒出红印，家里却踏实了。' },
                { id: 'salt', name: '油盐酱醋', cost: 3000000, stock: 2, mood: 2, worldAtk: 0.15, days: 0.8,
                  line: '小小一包盐，{name}也要复秤。掌柜笑：你们家实在。' },
                { id: 'cloth', name: '布匹针线', cost: 12000000, stock: 2, mood: 3, worldHp: 0.25, days: 1,
                  line: '{name}摸着布料厚度，心里已经在算能做几件衣裳。' },
                { id: 'herb', name: '常备草药', cost: 15000000, stock: 2, mood: 2, worldHp: 0.5, preventHours: 6,
                  line: '{name}把药包挂上梁。说不准哪天用得上，但心里安。' },
                { id: 'candy', name: '给孩子的糖', cost: 2500000, stock: 1, mood: 6, worldCritDmg: 0.1, days: 0.5, childMood: true,
                  line: '糖纸窸窣。孩子们跟在{name}身后，像一串小铃铛。' },
                { id: 'wine', name: '家酿陈酒', cost: 10000000, stock: 2, mood: 5, worldAtk: 0.3, days: 0.8,
                  line: '{name}打了一壶酒，留给夜里归来的人暖身子。' }
            ],
            // —— 弱冠 / 及笄 ——
            comingOfAge: {
                costBoy: 20000000,
                costGirl: 18000000,
                bondStart: 5,
                needAdult: true,
                lines: {
                    boy: '{name}加冠礼成。族人说：从此是大人了，肩上要扛事。',
                    girl: '{name}及笄礼成。钗环轻轻一响，像把少女日子折进袖里。'
                }
            },
            // —— 字辈 ——
            generationPoem: ['伯', '仲', '叔', '季', '永', '承', '世', '泽', '延', '绵', '长', '远', '继', '志', '光', '前', '裕', '后'],
            reciteCost: 30000000,
            reciteCd: 8 * HOUR_MS,
            reciteBuff: { atk: 4, hp: 5, crit: 3, duration: 4 * HOUR_MS },
            // —— 扫墓（按代） ——
            tombSweep: {
                baseCost: 15000000,
                costGrowth: 1.8,
                cd: 10 * HOUR_MS,
                perGen: { atk: 0.6, hp: 0.8, crit: 0.5 },
                lines: [
                    '第{gen}代牌位前，{name}把纸灰吹开，又重新摆正果品。',
                    '扫墓归来，{name}袖口沾着土，却说心里干净了。'
                ]
            },
            // —— 家传菜谱 ——
            recipes: [
                { id: 'jiaozi', name: '祖传饺子', unlockGen: 1, cost: 25000000, mood: 10, worldHp: 1.2, worldAtk: 0.4,
                  text: '皮薄馅大的诀窍只口耳相传。下锅的瞬间，全族都到了厅里。' },
                { id: 'lotus_root', name: '莲藕排骨汤', unlockGen: 3, cost: 40000000, mood: 8, worldHp: 1.8, worldCritDmg: 0.5,
                  text: '汤色乳白。老人说：这味道，像极了从前某个雨天。' },
                { id: 'osmanthus', name: '桂花糖藕', unlockGen: 6, cost: 60000000, mood: 12, worldAtk: 0.8, worldHp: 1.0,
                  text: '甜得克制。孩子们眼巴巴看着，大人却先敬了祖先一巡。' },
                { id: 'herbal_chicken', name: '药膳童子鸡', unlockGen: 9, cost: 100000000, mood: 9, worldHp: 2.5, worldAtk: 1.0,
                  text: '药香不苦。有人病刚好，喝了两碗，眼眶却红了。' },
                { id: 'eighteen_feast', name: '十八代团圆席', unlockGen: 15, cost: 500000000, mood: 20, worldAtk: 4, worldHp: 4, worldCritDmg: 3,
                  text: '十八道菜，十八盏灯。有人说得出典故，有人只记得咸淡。' }
            ],
            recipeCd: 12 * HOUR_MS,
            // —— 家书 ——
            letters: [
                { id: 'miss', name: '问安家书', cost: 3000000, bond: 4, mood: 5, cd: 3 * HOUR_MS,
                  line: '{from}写给{to}：近来可好？院里的树又高了一寸。' },
                { id: 'advice', name: '叮嘱家书', cost: 4000000, bond: 3, mood: 3, attr: 'intelligence', cd: 4 * HOUR_MS,
                  line: '{from}信里写满叮嘱。{to}看着看着，把腰杆挺直了。' },
                { id: 'apology', name: '和解家书', cost: 5000000, bond: 8, mood: 8, cd: 5 * HOUR_MS,
                  line: '{from}把「对不起」写得很小，{to}却看得很大。' },
                { id: 'pride', name: '嘉许家书', cost: 6000000, bond: 5, mood: 6, attr: 'charm', cd: 4 * HOUR_MS,
                  line: '{from}夸{to}懂事。信纸边角被捏出了褶。' }
            ],
            // —— 月例钱 ——
            allowance: {
                baseCost: 5000000,
                perAdult: 3000000,
                cd: 8 * HOUR_MS,
                mood: 6,
                worldAtk: 0.5,
                worldHp: 0.5,
                line: '月例发下。有人立刻去还账，有人给孩子买了糖，有人默默存着。'
            },
            // —— 赡养 ——
            elderCare: [
                { id: 'comb', name: '为长辈梳头', cost: 1500000, mood: 5, worldHp: 0.4, cd: 3 * HOUR_MS,
                  line: '{name}给长辈梳头，梳齿间落下几根白发，谁也没说话。' },
                { id: 'walk', name: '扶膝散步', cost: 2000000, mood: 4, worldHp: 0.5, cd: 3 * HOUR_MS,
                  line: '{name}搀着老人走出院门。夕阳把两个人的影子叠在一起。' },
                { id: 'listen', name: '听从前的事', cost: 1000000, mood: 6, worldAtk: 0.2, worldHp: 0.3, cd: 4 * HOUR_MS,
                  line: '老人讲起第{gen}代的事。{name}听得入神，茶凉了也不知道。' },
                { id: 'medicine', name: '煎药侍奉', cost: 8000000, mood: 4, worldHp: 0.8, cd: 5 * HOUR_MS, healChance: 0.25,
                  line: '{name}守着药罐。苦味漫开时，长辈说：你也辛苦了。' }
            ],
            // —— 十八代口述史 ——
            oralHistory: {
                cost: 40000000,
                cd: 6 * HOUR_MS,
                perRecord: { atk: 0.5, hp: 0.6, crit: 0.4 },
                texts: {
                    1: '开宗那代人睡过祠堂门槛，说要听得见后人的脚步。',
                    3: '曾孙夜里打着灯笼找走失的牛，后来把牛画进了家谱空白处。',
                    6: '云孙出过远门，寄回的只有一封被雨打湿的信，墨迹开花。',
                    9: '耳孙爱听雨。雨大时全族安静，像怕吵醒什么。',
                    12: '胎孙在星夜里数过十八颗最亮的星，少一颗也不肯睡。',
                    15: '昆孙守过一次大疫，活下来的人学会了互相喊名字。',
                    18: '终世孙没有更远的名字可取。有人说：那就好好活，把名字活成光。'
                }
            },
            // —— 家务账本（日用开销） ——
            ledger: {
                dailyCost: 6000000,
                cd: 6 * HOUR_MS,
                mood: 3,
                worldHp: 0.6,
                missPenaltyMood: -8,
                line: '油盐酱醋、灯油草纸——一笔笔记上账本。日子琐碎，却稳。'
            }
        };

        var moreEvents = [
            { id: 'market_bargain', title: '市集还价', text: '菜价又涨了。掌柜咬定不松口，身后排着你们家的人。',
              choices: [
                { label: '耐心磨价买足口粮', cost: 40000000, effect: 'realMarketStock', prestige: 10, worldHp: 3 },
                { label: '照单全收，不差这点', cost: 80000000, effect: 'livingMood', amount: 6, prestige: 8 },
                { label: '改去邻街小摊', cost: 20000000, effect: 'realWeatherIgnore', prestige: 5 }
              ]},
            { id: 'coming_age_feast', title: '加冠及笄', text: '有子弟到了行礼的年纪。厅里备好了冠与笄，就等你一句「办」。',
              choices: [
                { label: '盛大办理成人礼', cost: 100000000, effect: 'realComingReady', prestige: 22, worldAtk: 3, worldHp: 3 },
                { label: '家中小礼，够用就好', cost: 30000000, effect: 'livingMood', amount: 8, prestige: 10 },
                { label: '再等等，孩子还嫩', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'recipe_memory', title: '菜谱残页', text: '灶台夹缝里掉出一张油渍斑斑的纸，写着「十八代团圆席」的半道工序。',
              choices: [
                { label: '请厨子试做补全', cost: 150000000, effect: 'realRecipeUnlock', prestige: 25, worldHp: 5 },
                { label: '交给族中巧手研究', cost: 60000000, effect: 'livingMood', amount: 10, prestige: 12 },
                { label: '夹回族谱附页', cost: 20000000, effect: 'chronicleBoost', prestige: 15 }
              ]},
            { id: 'elder_night', title: '长夜陪护', text: '最长一辈夜里睡不着，反复念着从前的名字。灯需要人守着。',
              choices: [
                { label: '通宵陪护并请医', cost: 90000000, effect: 'realElderCare', prestige: 20, worldHp: 6 },
                { label: '轮流守夜听故事', cost: 20000000, effect: 'realOralBoost', prestige: 14, worldCritDmg: 3 },
                { label: '劝老人早些睡', cost: 0, effect: 'livingMood', amount: -2, prestige: 3 }
              ]},
            { id: 'zi_bei_dispute', title: '字辈争执', text: '两房为新生儿取名吵起来：该用哪个字辈？家谱摊在桌上，墨还没干。',
              choices: [
                { label: '按字辈诗依序取名', cost: 50000000, effect: 'realReciteReady', prestige: 18, worldAtk: 3 },
                { label: '两房各取一个，和好', cost: 80000000, effect: 'happiness', amount: 15, prestige: 12 },
                { label: '让孩子自己长大再改', cost: 0, effect: 'livingMood', amount: 3, prestige: 4 }
              ]},
            { id: 'tomb_rain', title: '雨中扫墓', text: '该扫墓的日子偏偏下雨。有人说改期，有人已经扛着锄头出门。',
              choices: [
                { label: '冒雨仍去，把路修好', cost: 70000000, effect: 'realTombReady', prestige: 20, worldHp: 4, worldCritDmg: 2 },
                { label: '改晴日，先备足祭品', cost: 40000000, effect: 'livingMood', amount: 6, prestige: 10 },
                { label: '宅中遥祭也算心意', cost: 15000000, effect: 'smallBoost', amount: 2, prestige: 6 }
              ]}
        ];
        var c = window.lineageExtConfig;
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'meal2', name: '民以食为天', desc: '完成三餐起居 2 次', need: 2, key: 'meal', rewardPrestige: 16, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'market1', name: '市井油盐', desc: '市集采买 1 次', need: 1, key: 'market', rewardPrestige: 14, rewardFunds: 6000000, rewardExp: 12 },
            { id: 'coming1', name: '弱冠及笄', desc: '完成成人礼 1 次', need: 1, key: 'coming', rewardPrestige: 25, rewardFunds: 12000000, rewardExp: 20 },
            { id: 'tomb1', name: '慎终追远', desc: '按代扫墓 1 次', need: 1, key: 'tomb', rewardPrestige: 22, rewardFunds: 10000000, rewardExp: 18 },
            { id: 'recipe1', name: '家传味道', desc: '烹制家传菜 1 次', need: 1, key: 'recipe', rewardPrestige: 20, rewardFunds: 15000000, rewardExp: 16 },
            { id: 'letter1', name: '家书抵万金', desc: '书写家书 1 次', need: 1, key: 'letter', rewardPrestige: 12, rewardFunds: 4000000, rewardExp: 10 },
            { id: 'oral1', name: '口述十八代', desc: '记录口述史 1 次', need: 1, key: 'oral', rewardPrestige: 24, rewardFunds: 12000000, rewardExp: 20 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensureRealData() {
        if (!player.children) return;
        if (!player.children.living) {
            player.children.living = {};
        }
        installRealConfig();
        var L = player.children.living;
        if (!L.real) {
            L.real = {
                mealCd: {},
                marketCd: {},
                marketStock: {},
                letterCd: {},
                elderCd: {},
                tombCd: {},
                recipeCd: 0,
                reciteLast: 0,
                reciteUntil: 0,
                allowanceLast: 0,
                ledgerLast: 0,
                oralRecords: {},
                recipesCooked: {},
                weatherId: 'clear',
                weatherDay: 0,
                comingFree: false,
                tombFree: false,
                reciteFree: false,
                recipeFreeUnlock: null,
                marketBuffUntil: 0
            };
        }
        var r = L.real;
        if (!r.mealCd) r.mealCd = {};
        if (!r.marketCd) r.marketCd = {};
        if (!r.marketStock) r.marketStock = {};
        if (!r.letterCd) r.letterCd = {};
        if (!r.elderCd) r.elderCd = {};
        if (!r.tombCd) r.tombCd = {};
        if (!r.oralRecords) r.oralRecords = {};
        if (!r.recipesCooked) r.recipesCooked = {};
        if (r.weatherDay == null) r.weatherDay = 0;
        (player.children.children || []).forEach(function (m) {
            if (m.comingOfAgeDone == null) m.comingOfAgeDone = false;
            if (m.ziBeiChar == null) m.ziBeiChar = '';
        });
        refreshWeather();
    }

    function pushDiary(text) {
        if (!player.children.life && typeof ensureLifeData === 'function') ensureLifeData();
        if (!player.children.life) return;
        var d = player.children.life.diary;
        if (!Array.isArray(d)) { player.children.life.diary = []; d = player.children.life.diary; }
        d.unshift({ t: Date.now(), text: text });
        if (d.length > 70) d.length = 70;
    }

    function bump(key) {
        if (!player.children.dailyQuest) return;
        var dq = player.children.dailyQuest;
        (cfg().dailyQuests || []).forEach(function (q) {
            if (q.key === key) dq.progress[q.id] = (dq.progress[q.id] || 0) + 1;
        });
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

    function genLabel(g) {
        return typeof getGenerationLabel === 'function' ? getGenerationLabel(g) : ('第' + g + '代');
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

    function refreshWeather() {
        var r = player.children.living.real;
        var day = Math.floor(Date.now() / DAY_MS);
        if (r.weatherDay === day && r.weatherId) return;
        r.weatherDay = day;
        var w = pickWeighted(R().weathers || [{ id: 'clear', name: '晴', weight: 1 }]);
        r.weatherId = w.id;
    }

    function currentWeather() {
        ensureRealData();
        var id = player.children.living.real.weatherId || 'clear';
        return (R().weathers || []).find(function (w) { return w.id === id; }) || { id: 'clear', name: '晴', choreMult: 1, marketMult: 1 };
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

    function addMood(n) {
        if (!player.children.life) return;
        player.children.life.mood = Math.max(0, Math.min(100, (player.children.life.mood || 50) + (n || 0)));
    }

    // ——— 三餐 ———
    window.doFamilyMeal = function (mealId, memberIndex) {
        ensureRealData();
        var meal = (R().meals || []).find(function (m) { return m.id === mealId; });
        var members = player.children.children || [];
        var m = members[memberIndex];
        if (!meal || !m) return logAction('请选择成员与餐次', 'error');
        var weather = currentWeather();
        var cost = Math.floor(meal.cost * (weather.marketMult || 1));
        var cdKey = meal.id;
        var left = (player.children.living.real.mealCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction(meal.name + '冷却中，约 ' + Math.ceil(left / 60000) + ' 分钟', 'info');
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        player.children.living.real.mealCd[cdKey] = Date.now() + meal.cd;
        addMood((meal.mood || 0) + (weather.mood || 0));
        addTempWorld(meal.worldAtk, meal.worldHp, meal.worldCritDmg, 3);
        var line = meal.lines[Math.floor(Math.random() * meal.lines.length)].replace(/\{name\}/g, m.name);
        pushDiary('【' + weather.name + '·' + meal.name + '】' + line);
        bump('meal');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 市集 ———
    window.buyMarketGood = function (goodId, memberIndex) {
        ensureRealData();
        var good = (R().marketGoods || []).find(function (g) { return g.id === goodId; });
        var m = (player.children.children || [])[memberIndex];
        if (!good || !m) return;
        var weather = currentWeather();
        var stock = player.children.living.real.marketStock[good.id] || 0;
        if (stock >= good.stock) return logAction(good.name + '今日已买足', 'info');
        var cost = Math.floor(good.cost * (weather.marketMult || 1));
        if (Date.now() < (player.children.living.real.marketBuffUntil || 0)) cost = Math.floor(cost * 0.85);
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        player.children.living.real.marketStock[good.id] = stock + 1;
        addMood(good.mood || 0);
        addTempWorld(good.worldAtk, good.worldHp, good.worldCritDmg, (good.days || 1) * 24);
        if (good.preventHours) {
            if (!player.children.living.deep) player.children.living.deep = {};
            player.children.living.deep.preventUntil = Math.max(
                player.children.living.deep.preventUntil || 0,
                Date.now() + good.preventHours * HOUR_MS
            );
        }
        if (good.childMood) {
            (player.children.children || []).forEach(function (c) {
                if (!isAdult(c)) c.lifeMood = Math.min(100, (c.lifeMood || 50) + 5);
            });
        }
        var line = good.line.replace(/\{name\}/g, m.name);
        pushDiary('【市集·' + weather.name + '】' + line);
        bump('market');
        logAction(line + '（耗资 ' + fmt(cost) + '）', 'success');
        refreshUI();
    };

    // —— 每日重置市集库存（按自然日）
    function tickMarketDay() {
        ensureRealData();
        var r = player.children.living.real;
        var day = Math.floor(Date.now() / DAY_MS);
        if (r.marketDay === day) return;
        r.marketDay = day;
        r.marketStock = {};
    }

    // ——— 弱冠及笄 ———
    window.performComingOfAge = function (memberIndex) {
        ensureRealData();
        var m = (player.children.children || [])[memberIndex];
        var co = R().comingOfAge;
        if (!m || !co) return;
        if (!isAdult(m)) return logAction('须先成长至青年（成年）', 'error');
        if (m.comingOfAgeDone) return logAction(m.name + ' 已行过成人礼', 'info');
        var cost = player.children.living.real.comingFree ? 0 :
            (m.gender === 'girl' ? co.costGirl : co.costBoy);
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        player.children.living.real.comingFree = false;
        m.comingOfAgeDone = true;
        // 赋字辈字
        var poem = R().generationPoem || [];
        var idx = Math.min((m.generation || 1) - 1, poem.length - 1);
        m.ziBeiChar = poem[idx] || '';
        addMood(8);
        var line = (m.gender === 'girl' ? co.lines.girl : co.lines.boy).replace(/\{name\}/g, m.name);
        if (m.ziBeiChar) line += ' 字辈取「' + m.ziBeiChar + '」。';
        pushDiary(line);
        bump('coming');
        if (typeof addLineageExp === 'function') addLineageExp(12);
        if (typeof addClanPrestige === 'function') addClanPrestige(10);
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 订婚须先成人礼 ———
    var _origBetroth = window.betrothFamilyMember;
    if (_origBetroth) {
        window.betrothFamilyMember = function (memberIndex) {
            ensureRealData();
            var m = (player.children.children || [])[memberIndex];
            if (m && isAdult(m) && !m.comingOfAgeDone) {
                return logAction(m.name + ' 尚未举行弱冠/及笄礼，请先在「实录」页完成成人礼再订婚', 'error');
            }
            return _origBetroth(memberIndex);
        };
    }

    // ——— 字辈朗诵 ———
    window.reciteGenerationPoem = function () {
        ensureRealData();
        var r = player.children.living.real;
        var free = r.reciteFree;
        var cost = free ? 0 : (R().reciteCost || 30000000);
        var left = (r.reciteLast || 0) + (R().reciteCd || 8 * HOUR_MS) - Date.now();
        if (left > 0 && !free) return logAction('字辈朗诵冷却中', 'info');
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        r.reciteFree = false;
        r.reciteLast = Date.now();
        var buff = R().reciteBuff || {};
        r.reciteUntil = Date.now() + (buff.duration || 4 * HOUR_MS);
        var poem = (R().generationPoem || []).join(' ');
        var g = maxGen();
        pushDiary('全族齐诵字辈：' + poem + '。灯火照到第 ' + g + ' 代。');
        logAction('字辈朗诵完成，限时三维提升', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 扫墓 ———
    window.sweepGenerationTomb = function (gen, memberIndex) {
        ensureRealData();
        var ts = R().tombSweep;
        var m = (player.children.children || [])[memberIndex];
        if (!ts || !m) return;
        if (!isAdult(m)) return logAction('须成年成员主祭', 'error');
        if (maxGen() < gen) return logAction('尚未触及第 ' + gen + ' 代', 'error');
        var r = player.children.living.real;
        var left = (r.tombCd[gen] || 0) - Date.now();
        if (left > 0 && !r.tombFree) return logAction('该代扫墓冷却中', 'info');
        var cost = r.tombFree ? 0 : Math.floor(ts.baseCost * Math.pow(ts.costGrowth, Math.max(0, gen - 1)));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        r.tombFree = false;
        r.tombCd[gen] = Date.now() + ts.cd;
        if (!r.tombDone) r.tombDone = {};
        r.tombDone[gen] = (r.tombDone[gen] || 0) + 1;
        addMood(4);
        var line = ts.lines[Math.floor(Math.random() * ts.lines.length)]
            .replace(/\{name\}/g, m.name)
            .replace(/\{gen\}/g, String(gen));
        pushDiary('【扫墓·' + genLabel(gen) + '】' + line);
        bump('tomb');
        if (typeof addClanPrestige === 'function') addClanPrestige(5 + Math.floor(gen / 2));
        logAction(line, 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 家传菜谱 ———
    window.cookFamilyRecipe = function (recipeId) {
        ensureRealData();
        var recipe = (R().recipes || []).find(function (x) { return x.id === recipeId; });
        if (!recipe) return;
        if (maxGen() < recipe.unlockGen) return logAction('需触及第 ' + recipe.unlockGen + ' 代才能烹制', 'error');
        var r = player.children.living.real;
        var left = (r.recipeCd || 0) - Date.now();
        if (left > 0) return logAction('灶台尚热，约 ' + Math.ceil(left / 60000) + ' 分钟后再做', 'info');
        if (funds().availableFunds < recipe.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= recipe.cost;
        r.recipeCd = Date.now() + (R().recipeCd || 12 * HOUR_MS);
        r.recipesCooked[recipe.id] = (r.recipesCooked[recipe.id] || 0) + 1;
        addMood(recipe.mood || 0);
        addTempWorld(recipe.worldAtk, recipe.worldHp, recipe.worldCritDmg, 8);
        pushDiary('【家传】' + recipe.name + '：' + recipe.text);
        bump('recipe');
        logAction('烹制「' + recipe.name + '」！全族心情上扬，地图三维短时增强', 'success');
        refreshUI();
    };

    // ——— 家书 ———
    window.writeFamilyLetter = function (letterId, fromIndex, toIndex) {
        ensureRealData();
        var letter = (R().letters || []).find(function (x) { return x.id === letterId; });
        var members = player.children.children || [];
        var from = members[fromIndex];
        var to = members[toIndex];
        if (!letter || !from || !to) return logAction('请选择写信人与收信人', 'error');
        if (fromIndex === toIndex) return logAction('不能写给自己', 'error');
        var cdKey = letter.id + ':' + (from.id || fromIndex) + ':' + (to.id || toIndex);
        var left = (player.children.living.real.letterCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('这封家书冷却中', 'info');
        if (funds().availableFunds < letter.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= letter.cost;
        player.children.living.real.letterCd[cdKey] = Date.now() + letter.cd;
        // 羁绊
        if (player.children.life && player.children.life.bonds) {
            var a = from.id || fromIndex;
            var b = to.id || toIndex;
            var key = a < b ? a + ':' + b : b + ':' + a;
            player.children.life.bonds[key] = (player.children.life.bonds[key] || 0) + (letter.bond || 3);
        }
        if (letter.attr && to.attributes) {
            to.attributes[letter.attr] = (to.attributes[letter.attr] || 0) + 1;
        }
        addMood(letter.mood || 0);
        var line = letter.line.replace(/\{from\}/g, from.name).replace(/\{to\}/g, to.name);
        pushDiary(line);
        bump('letter');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 月例 ———
    window.payFamilyAllowance = function () {
        ensureRealData();
        var al = R().allowance;
        var r = player.children.living.real;
        var left = (r.allowanceLast || 0) + al.cd - Date.now();
        if (left > 0) return logAction('月例冷却中，约 ' + Math.ceil(left / 60000) + ' 分钟', 'info');
        var adults = (player.children.children || []).filter(isAdult);
        var cost = al.baseCost + adults.length * al.perAdult;
        if (funds().availableFunds < cost) return logAction('资金不足，需要 ' + fmt(cost), 'error');
        funds().availableFunds -= cost;
        r.allowanceLast = Date.now();
        addMood(al.mood);
        addTempWorld(al.worldAtk, al.worldHp, 0, 6);
        adults.forEach(function (m) {
            m.lifeMood = Math.min(100, (m.lifeMood || 50) + 3);
        });
        pushDiary(al.line + '（成人 ' + adults.length + ' 人，共 ' + fmt(cost) + '）');
        logAction('发放月例：' + fmt(cost), 'success');
        refreshUI();
    };

    // ——— 日用账本 ———
    window.payHouseholdLedger = function () {
        ensureRealData();
        var ld = R().ledger;
        var r = player.children.living.real;
        var left = (r.ledgerLast || 0) + ld.cd - Date.now();
        if (left > 0) return logAction('账本刚记过，约 ' + Math.ceil(left / 60000) + ' 分钟后再来', 'info');
        var weather = currentWeather();
        var cost = Math.floor(ld.dailyCost * (weather.marketMult || 1));
        if (funds().availableFunds < cost) {
            addMood(ld.missPenaltyMood || -8);
            pushDiary('账本翻开又合上：钱紧，日用只能再省一省。');
            return logAction('资金不足支付日用，家族心情下降', 'warning');
        }
        funds().availableFunds -= cost;
        r.ledgerLast = Date.now();
        addMood(ld.mood);
        addTempWorld(0, ld.worldHp, 0, 5);
        pushDiary('【账本·' + weather.name + '】' + ld.line);
        logAction('记日用账：' + fmt(cost), 'success');
        refreshUI();
    };

    // ——— 赡养 ———
    window.doElderCare = function (actId, carerIndex, elderIndex) {
        ensureRealData();
        var act = (R().elderCare || []).find(function (a) { return a.id === actId; });
        var members = player.children.children || [];
        var carer = members[carerIndex];
        var elder = members[elderIndex];
        if (!act || !carer || !elder) return;
        if (!isAdult(carer)) return logAction('侍奉者须成年', 'error');
        // 长辈：代数更靠前（数字更小）或同代但更年长标记
        if ((elder.generation || 1) > (carer.generation || 1)) {
            return logAction('请选择更早世代的长辈（代数更小）', 'error');
        }
        if (carerIndex === elderIndex) return logAction('不能侍奉自己', 'error');
        var cdKey = act.id + ':' + (carer.id || carerIndex);
        var left = (player.children.living.real.elderCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('冷却中', 'info');
        if (funds().availableFunds < act.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= act.cost;
        player.children.living.real.elderCd[cdKey] = Date.now() + act.cd;
        addMood(act.mood || 0);
        addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 3);
        if (act.healChance && elder.illness && Math.random() < act.healChance) {
            elder.illness = null;
            logAction(elder.name + ' 在侍奉中气色好转，病气退了', 'success');
        }
        var line = act.line
            .replace(/\{name\}/g, carer.name)
            .replace(/\{gen\}/g, String(elder.generation || 1));
        pushDiary(line);
        if (typeof addClanPrestige === 'function') addClanPrestige(2);
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 口述史 ———
    window.recordOralHistory = function (gen) {
        ensureRealData();
        var oh = R().oralHistory;
        if (!oh) return;
        if (maxGen() < gen) return logAction('尚未触及第 ' + gen + ' 代', 'error');
        var r = player.children.living.real;
        if (r.oralRecords[gen]) return logAction('第 ' + gen + ' 代口述已记录', 'info');
        var left = (r.oralCd || 0) - Date.now();
        if (left > 0) return logAction('口述整理冷却中', 'info');
        if (funds().availableFunds < oh.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= oh.cost;
        r.oralCd = Date.now() + oh.cd;
        r.oralRecords[gen] = true;
        var text = oh.texts[gen] || ('第' + gen + '代的故事被轻轻写进附页。');
        pushDiary('【口述·' + genLabel(gen) + '】' + text);
        bump('oral');
        if (typeof addLineageExp === 'function') addLineageExp(8 + gen);
        logAction('记录「' + genLabel(gen) + '」口述史', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 三维 ———
    function calcRealWorld() {
        ensureRealData();
        var atk = 0, hp = 0, crit = 0;
        var r = player.children.living.real;
        var buff = R().reciteBuff || {};
        if (Date.now() < (r.reciteUntil || 0)) {
            atk += buff.atk || 0;
            hp += buff.hp || 0;
            crit += buff.crit || 0;
        }
        var ts = R().tombSweep || {};
        var per = ts.perGen || {};
        Object.keys(r.tombDone || {}).forEach(function (g) {
            var times = Math.min(5, r.tombDone[g] || 0);
            atk += times * (per.atk || 0);
            hp += times * (per.hp || 0);
            crit += times * (per.crit || 0);
        });
        var oh = R().oralHistory || {};
        var op = oh.perRecord || {};
        Object.keys(r.oralRecords || {}).forEach(function () {
            atk += op.atk || 0;
            hp += op.hp || 0;
            crit += op.crit || 0;
        });
        // 成人礼人数微加
        var coming = (player.children.children || []).filter(function (m) { return m.comingOfAgeDone; }).length;
        atk += coming * 0.15;
        hp += coming * 0.2;
        crit += coming * 0.1;
        return { atk: atk, hp: hp, crit: crit };
    }

    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        installRealConfig();
        ensureRealData();
        tickMarketDay();
        var base = _origBonus ? _origBonus() : { worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var w = calcRealWorld();
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
            ensureRealData();
            var r = player.children.living.real;
            if (ch.effect === 'realMarketStock') {
                r.marketBuffUntil = Date.now() + 8 * HOUR_MS;
                r.marketStock = {};
            } else if (ch.effect === 'realWeatherIgnore') {
                r.weatherId = 'clear';
            } else if (ch.effect === 'realComingReady') {
                r.comingFree = true;
                logAction('获得一次免费成人礼机会', 'success');
            } else if (ch.effect === 'realRecipeUnlock') {
                r.recipeFreeUnlock = 'eighteen_feast';
                // 视为已解锁烹制条件提示
                logAction('残页补全：「十八代团圆席」可尝试烹制（仍需代数）', 'success');
            } else if (ch.effect === 'realElderCare') {
                addMood(10);
                (player.children.children || []).forEach(function (m) {
                    if (m.illness && (m.generation || 1) <= 3) m.illness = null;
                });
            } else if (ch.effect === 'realOralBoost') {
                var g = maxGen();
                if (g >= 1 && !r.oralRecords[g]) {
                    // 半价提示：直接减免下次
                    r.oralCd = 0;
                }
            } else if (ch.effect === 'realReciteReady') {
                r.reciteFree = true;
                logAction('字辈朗诵可立即免费举行一次', 'success');
            } else if (ch.effect === 'realTombReady') {
                r.tombFree = true;
                logAction('获得一次免费扫墓', 'success');
            }
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }

    function memberOptions(filterFn) {
        return (player.children.children || []).map(function (m, i) {
            if (filterFn && !filterFn(m)) return '';
            var extra = '';
            if (m.comingOfAgeDone) extra += '·礼';
            if (m.ziBeiChar) extra += '·' + m.ziBeiChar;
            if (m.illness && m.illness.id) extra += '·病';
            return '<option value="' + i + '">' + m.name + '（' + genLabel(m.generation || 1) + extra + '）</option>';
        }).join('');
    }

    function updateRealMealsPanel() {
        var box = el('realMealsPanel');
        if (!box) return;
        ensureRealData();
        tickMarketDay();
        var weather = currentWeather();
        var opts = memberOptions();
        box.innerHTML = '<div class="c-hint">今日天气【' + weather.name + '】· 影响市价与心情</div>' +
            '<div class="c-form-row"><label>主厨/张罗</label><select id="realMealMember" class="c-input">' + opts + '</select></div>' +
            '<div class="c-train-grid">' + (R().meals || []).map(function (meal) {
                var cost = Math.floor(meal.cost * (weather.marketMult || 1));
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + meal.name + '</div><div class="ms-desc">' + fmt(cost) + ' · 心情+' + meal.mood + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doFamilyMeal(\'' + meal.id + '\',+document.getElementById(\'realMealMember\').value)">' + meal.name + '</button></div>';
            }).join('') + '</div>' +
            '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">' +
            '<button class="c-btn c-btn-sm c-btn-gold" onclick="payHouseholdLedger()">记日用账本</button>' +
            '<button class="c-btn c-btn-sm c-btn-blue" onclick="payFamilyAllowance()">发月例钱</button></div>';
    }

    function updateRealMarketPanel() {
        var box = el('realMarketPanel');
        if (!box) return;
        ensureRealData();
        tickMarketDay();
        var weather = currentWeather();
        var r = player.children.living.real;
        var discount = Date.now() < (r.marketBuffUntil || 0);
        var opts = memberOptions();
        box.innerHTML = '<div class="c-hint">市集物价随天气浮动' + (discount ? ' · <span style="color:#81C784;">议价成功中</span>' : '') + '</div>' +
            '<div class="c-form-row"><label>采买人</label><select id="realMarketMember" class="c-input">' + opts + '</select></div>' +
            '<div class="c-train-grid">' + (R().marketGoods || []).map(function (g) {
                var stock = r.marketStock[g.id] || 0;
                var cost = Math.floor(g.cost * (weather.marketMult || 1) * (discount ? 0.85 : 1));
                var full = stock >= g.stock;
                return '<div class="c-milestone' + (full ? '' : ' done') + '" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + g.name + '</div>' +
                    '<div class="ms-desc">' + fmt(cost) + ' · 今日 ' + stock + '/' + g.stock + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" ' + (full ? 'disabled' : '') +
                    ' onclick="buyMarketGood(\'' + g.id + '\',+document.getElementById(\'realMarketMember\').value)">' +
                    (full ? '已购足' : '买') + '</button></div>';
            }).join('') + '</div>';
    }

    function updateRealComingPanel() {
        var box = el('realComingPanel');
        if (!box) return;
        ensureRealData();
        var co = R().comingOfAge;
        var list = (player.children.children || []).map(function (m, i) { return { m: m, i: i }; })
            .filter(function (x) { return isAdult(x.m); });
        var free = player.children.living.real.comingFree;
        var html = '<p class="c-hint">成年后须行<strong>弱冠（男）/及笄（女）</strong>礼，方可订婚。礼成赋予字辈字。</p>';
        if (!list.length) {
            box.innerHTML = html + '<div class="c-hint">暂无成年成员</div>';
            return;
        }
        html += list.map(function (row) {
            var m = row.m;
            if (m.comingOfAgeDone) {
                return '<div class="c-member"><div class="name">' + m.name + '</div><div class="meta">已行礼' +
                    (m.ziBeiChar ? ' · 字辈「' + m.ziBeiChar + '」' : '') + '</div></div>';
            }
            var cost = free ? 0 : (m.gender === 'girl' ? co.costGirl : co.costBoy);
            var label = m.gender === 'girl' ? '及笄礼' : '弱冠礼';
            return '<div class="c-member"><div class="name">' + m.name + '</div><div class="meta">待行' + label + '</div>' +
                '<button class="c-btn c-btn-sm c-btn-gold" onclick="performComingOfAge(' + row.i + ')">' + label + '（' + fmt(cost) + '）</button></div>';
        }).join('');
        box.innerHTML = html;
    }

    function updateRealEighteenPanel() {
        var box = el('realEighteenPanel');
        if (!box) return;
        ensureRealData();
        var r = player.children.living.real;
        var poem = (R().generationPoem || []).join(' ');
        var g = maxGen();
        var reciteLeft = Math.max(0, (r.reciteUntil || 0) - Date.now());
        var opts = memberOptions(isAdult);
        var html = '<div class="c-hint">字辈诗：' + poem + '</div>' +
            '<button class="c-btn c-btn-purple" onclick="reciteGenerationPoem()">齐诵字辈' +
            (r.reciteFree ? '（免费）' : '（' + fmt(R().reciteCost) + '）') + '</button>' +
            (reciteLeft ? '<span class="c-hint" style="margin-left:8px;color:#81C784;">祝福剩 ' + Math.ceil(reciteLeft / 60000) + ' 分</span>' : '') +
            '<h4 style="margin:14px 0 8px;color:#E8C4A8;">按代扫墓</h4>' +
            '<div class="c-form-row"><label>主祭</label><select id="realTombMember" class="c-input">' + opts + '</select></div>';
        var ts = R().tombSweep;
        for (var gen = 1; gen <= 18; gen++) {
            if (gen !== 1 && gen !== 3 && gen !== 6 && gen !== 9 && gen !== 12 && gen !== 15 && gen !== 18 && gen !== g) continue;
            if (gen > g && gen !== 1) continue;
            var cost = r.tombFree ? 0 : Math.floor(ts.baseCost * Math.pow(ts.costGrowth, Math.max(0, gen - 1)));
            var lock = g < gen;
            html += '<div class="c-milestone' + (lock ? '' : ' done') + '"><div><div class="ms-title">' + genLabel(gen) +
                '</div><div class="ms-desc">扫墓 ' + ((r.tombDone && r.tombDone[gen]) || 0) + ' 次 · ' + fmt(cost) + '</div></div>' +
                '<button class="c-btn c-btn-sm c-btn-gold" ' + (lock ? 'disabled' : '') +
                ' onclick="sweepGenerationTomb(' + gen + ',+document.getElementById(\'realTombMember\').value)">' +
                (lock ? '未及' : '扫墓') + '</button></div>';
        }
        html += '<h4 style="margin:14px 0 8px;color:#E8C4A8;">口述十八代</h4>';
        var oh = R().oralHistory;
        var oralGens = [1, 3, 6, 9, 12, 15, 18];
        oralGens.forEach(function (gen) {
            var done = !!r.oralRecords[gen];
            var lock = g < gen;
            html += '<div class="c-milestone' + (done ? ' done' : '') + '"><div><div class="ms-title">' + genLabel(gen) +
                '</div><div class="ms-desc">' + (oh.texts[gen] || '') + '</div></div>' +
                (done ? '<span style="color:#4CAF50;">已录</span>' :
                    '<button class="c-btn c-btn-sm c-btn-blue" ' + (lock ? 'disabled' : '') +
                    ' onclick="recordOralHistory(' + gen + ')">' + (lock ? '未及' : '记录') + '</button>') +
                '</div>';
        });
        box.innerHTML = html;
    }

    function updateRealRecipePanel() {
        var box = el('realRecipePanel');
        if (!box) return;
        ensureRealData();
        var g = maxGen();
        var r = player.children.living.real;
        box.innerHTML = '<div class="c-hint">家传味道随代数解锁。烹制提升心情与限时三维。</div>' +
            (R().recipes || []).map(function (recipe) {
                var lock = g < recipe.unlockGen;
                var times = r.recipesCooked[recipe.id] || 0;
                return '<div class="c-milestone' + (!lock ? ' done' : '') + '" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + recipe.name + (times ? ' · 做过' + times + '次' : '') + '</div>' +
                    '<div class="ms-desc">需第' + recipe.unlockGen + '代 · ' + fmt(recipe.cost) + '<br>' + recipe.text + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" ' + (lock ? 'disabled' : '') +
                    ' onclick="cookFamilyRecipe(\'' + recipe.id + '\')">' + (lock ? '未解锁' : '开灶') + '</button></div>';
            }).join('');
    }

    function updateRealLetterPanel() {
        var box = el('realLetterPanel');
        if (!box) return;
        ensureRealData();
        var opts = memberOptions();
        box.innerHTML = '<div class="c-form-row"><label>写信人</label><select id="realLetterFrom" class="c-input">' + opts + '</select></div>' +
            '<div class="c-form-row"><label>收信人</label><select id="realLetterTo" class="c-input">' + opts + '</select></div>' +
            '<div class="c-train-grid">' + (R().letters || []).map(function (letter) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + letter.name + '</div><div class="ms-desc">' + fmt(letter.cost) + ' · 羁绊+' + letter.bond + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="writeFamilyLetter(\'' + letter.id +
                    '\',+document.getElementById(\'realLetterFrom\').value,+document.getElementById(\'realLetterTo\').value)">' + letter.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateRealElderPanel() {
        var box = el('realElderPanel');
        if (!box) return;
        ensureRealData();
        var carers = memberOptions(isAdult);
        var elders = memberOptions();
        box.innerHTML = '<p class="c-hint">选晚辈侍奉更早世代的长辈：梳头、散步、听从前的事、煎药。</p>' +
            '<div class="c-form-row"><label>侍奉者</label><select id="realCarer" class="c-input">' + carers + '</select></div>' +
            '<div class="c-form-row"><label>长辈</label><select id="realElder" class="c-input">' + elders + '</select></div>' +
            '<div class="c-train-grid">' + (R().elderCare || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div><div class="ms-desc">' + fmt(a.cost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="doElderCare(\'' + a.id +
                    '\',+document.getElementById(\'realCarer\').value,+document.getElementById(\'realElder\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    window.updateRealLifePanels = function () {
        installRealConfig();
        ensureRealData();
        tickMarketDay();
        updateRealMealsPanel();
        updateRealMarketPanel();
        updateRealComingPanel();
        updateRealEighteenPanel();
        updateRealRecipePanel();
        updateRealLetterPanel();
        updateRealElderPanel();
        var hint = el('livingLineageGateHint');
        if (hint) {
            hint.innerHTML = '生育门禁：成年 → <strong>弱冠/及笄</strong> → 订婚 → 成婚 → 恩爱 → 孕育 → 孕养 → 坐月子。详见「实录」「婚育」。';
        }
    };

    var _origLiving = window.updateLivingPanels;
    window.updateLivingPanels = function () {
        if (_origLiving) _origLiving();
        if (typeof childTabIn === 'function' && !childTabIn(['realty', 'living'])) return;
        if (typeof updateRealLifePanels === 'function') updateRealLifePanels();
    };

    // switchChildTab 增加 realty
    var _origSwitch = window.switchChildTab;
    window.switchChildTab = function (tab) {
        if (_origSwitch) _origSwitch(tab);
        var node = document.getElementById('childSectionRealty');
        if (node) node.classList.toggle('active', tab === 'realty');
    };

    installRealConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            installRealConfig();
            ensureRealData();
        }, 1800);
    });
    if (document.readyState !== 'loading') {
        setTimeout(function () {
            installRealConfig();
            ensureRealData();
        }, 1800);
    }
})();

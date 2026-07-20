/**
 * 家族传承 · 烟火深挖
 * 订婚→成婚→孕养→坐月子；时令灾害；代际遗泽；染恙传染；邻里人情；幼年光景
 * 在 lineage-living.js 之后加载
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
    function L() { return (cfg() && cfg().living && cfg().living.deep) || {}; }
    function livingRoot() { return (cfg() && cfg().living) || {}; }

    function installDeepConfig() {
        if (!window.lineageExtConfig || !window.lineageExtConfig.living) return;
        var living = window.lineageExtConfig.living;
        if (living._deepInstalled) return;
        living._deepInstalled = true;

        living.deep = {
            // —— 订婚 ——
            betrothal: {
                cost: 12000000,
                minWaitHours: 4,
                affinityCap: 50,
                affinityNeedMarry: 12,
                marryBondBonus: 0.4,
                activities: [
                    { id: 'tea_meet', name: '茶寮相见', cost: 5000000, affinity: 6, mood: 4, cd: 3 * HOUR_MS,
                      line: '{name}与{fiance}隔着茶汤说话，偶有对视，又赶紧低头。' },
                    { id: 'walk_bridge', name: '桥头散步', cost: 4000000, affinity: 5, mood: 5, cd: 3 * HOUR_MS,
                      line: '{name}陪{fiance}走过石桥，风把话吹散了一半，剩下的都记得。' },
                    { id: 'exchange_gift', name: '互赠信物', cost: 18000000, affinity: 10, mood: 6, cd: 6 * HOUR_MS,
                      line: '{name}把一只玉环塞进{fiance}掌心。两人同时说「日后见」。' },
                    { id: 'family_dinner', name: '两家小宴', cost: 30000000, affinity: 8, mood: 8, cd: 8 * HOUR_MS,
                      line: '两家坐到一张桌上。{name}给{fiance}夹菜，长辈们相视而笑。' }
                ]
            },
            // —— 孕期调养 / 坐月子 ——
            pregnancy: {
                nurtureCap: 40,
                nurturePerAttr: 0.15,
                activities: [
                    { id: 'tonic', name: '进补汤药', cost: 20000000, nurture: 8, mood: 3, cd: 4 * HOUR_MS,
                      line: '{name}捧着药碗皱眉，{spouse}在一旁说「再喝一口」。' },
                    { id: 'rest_yard', name: '庭院静养', cost: 8000000, nurture: 5, mood: 5, cd: 3 * HOUR_MS,
                      line: '{name}靠在廊下晒太阳，手里捏着未织完的小衣。' },
                    { id: 'midwife', name: '稳婆问诊', cost: 35000000, nurture: 12, mood: 4, cd: 6 * HOUR_MS,
                      line: '稳婆摸了摸脉，说「孩子稳」。{name}才把心放回肚子里。' },
                    { id: 'pray_birth', name: '祠堂祈嗣', cost: 25000000, nurture: 7, mood: 6, cd: 8 * HOUR_MS, prestige: 4,
                      line: '{name}在牌位前轻声说：求平安，不求贵。' }
                ],
                postpartumHours: 8,
                postpartumMood: 6,
                postpartumBond: 5
            },
            // —— 时令灾害 ——
            calamities: [
                { id: 'spring_flood', season: 'spring', name: '春汛漫院', weight: 30, mood: -10, hours: 6,
                  text: '河水涨过石阶，族田泡了。有人哭，有人扛沙包。',
                  choices: [
                    { label: '出钱修堤赈族', cost: 200000000, effect: 'calm', prestige: 25, worldHp: 6, mood: 12 },
                    { label: '青壮齐上阵', cost: 50000000, effect: 'labor', prestige: 15, worldAtk: 5, mood: 6 },
                    { label: '先保宗祠牌位', cost: 80000000, effect: 'shrine', prestige: 18, worldCritDmg: 4, mood: 4 }
                  ]},
                { id: 'summer_drought', season: 'summer', name: '盛夏旱魃', weight: 28, mood: -8, hours: 6,
                  text: '井水见底，田裂开缝。孩子们把嘴唇舔得发白。',
                  choices: [
                    { label: '开仓放粮施水', cost: 180000000, effect: 'calm', prestige: 22, worldHp: 8, mood: 14 },
                    { label: '请龙王戏班求雨', cost: 100000000, effect: 'ritual', prestige: 16, worldCritDmg: 5, mood: 8 },
                    { label: '组织夜间担水轮值', cost: 40000000, effect: 'labor', prestige: 12, worldAtk: 4, mood: 5 }
                  ]},
                { id: 'autumn_storm', season: 'autumn', name: '秋台风讯', weight: 26, mood: -9, hours: 5,
                  text: '屋瓦被掀，树枝抽在窗棂上。夜里谁也睡不着。',
                  choices: [
                    { label: '连夜加固屋顶', cost: 120000000, effect: 'labor', prestige: 18, worldAtk: 5, worldHp: 4, mood: 7 },
                    { label: '收留邻里避风', cost: 90000000, effect: 'neighbor', prestige: 20, worldHp: 7, mood: 10 },
                    { label: '祭风收心', cost: 60000000, effect: 'ritual', prestige: 14, worldCritDmg: 5, mood: 6 }
                  ]},
                { id: 'winter_blizzard', season: 'winter', name: '冬夜暴雪', weight: 30, mood: -12, hours: 7, illnessChance: 0.45,
                  text: '雪把门封住。柴火见底，有人开始咳嗽。',
                  choices: [
                    { label: '购炭分发全族', cost: 160000000, effect: 'calm', prestige: 24, worldHp: 9, mood: 12 },
                    { label: '轮流守夜烧火', cost: 45000000, effect: 'labor', prestige: 14, worldAtk: 4, mood: 5 },
                    { label: '医庐备姜汤防疫', cost: 110000000, effect: 'prevent', prestige: 20, worldHp: 6, mood: 8 }
                  ]},
                { id: 'plague_wave', season: 'any', name: '时疫暗涌', weight: 18, mood: -15, hours: 8, illnessChance: 0.7, forceIllness: 'plague',
                  text: '邻街有人抬棺。空气里有药味，也有怕。',
                  choices: [
                    { label: '封锁偏院全面寻医', cost: 250000000, effect: 'massHeal', prestige: 30, worldHp: 10, mood: 8 },
                    { label: '全族服预防汤剂', cost: 150000000, effect: 'prevent', prestige: 22, worldHp: 7, mood: 6 },
                    { label: '祠堂大祭求安', cost: 100000000, effect: 'ritual', prestige: 18, worldCritDmg: 6, mood: 5 }
                  ]}
            ],
            calamityChancePerDay: 0.22,
            calamityCd: 10 * HOUR_MS,
            // —— 代际遗泽 ——
            genLegacies: [
                { gen: 1, name: '开宗血书', cost: 30000000, atk: 1.5, hp: 1.5, crit: 1, text: '第一代立下的血书还压在匣底，字迹模糊，决心却在。' },
                { gen: 2, name: '祖训残页', cost: 50000000, atk: 2, hp: 2, crit: 1.5, text: '残页写着：勿欺孤寡。墨干了很久。' },
                { gen: 4, name: '玄孙佩玉', cost: 120000000, atk: 3.5, hp: 3.5, crit: 2.5, text: '玉温润，像被人捂过很多年。' },
                { gen: 7, name: '云孙兵符', cost: 300000000, atk: 6, hp: 4, crit: 5, text: '半块兵符，敲上去仍有金声。' },
                { gen: 10, name: '耳孙听雨卷', cost: 600000000, atk: 7, hp: 8, crit: 6, text: '卷上画着雨巷与灯，像在等某个人回来。' },
                { gen: 13, name: '来孙星图', cost: 1200000000, atk: 10, hp: 10, crit: 9, text: '星图标着十八个点，最后一个空着。' },
                { gen: 16, name: '昆孙镇印', cost: 3000000000, atk: 14, hp: 14, crit: 12, text: '印面「镇」字深深的，像压住了什么。' },
                { gen: 18, name: '终世遗诏', cost: 8000000000, atk: 25, hp: 25, crit: 22, text: '遗诏只有一句：把日子过好，便是不负十八代。' }
            ],
            // —— 邻里人情 ——
            neighbor: {
                favorCap: 100,
                perFavorWorld: { atk: 0.04, hp: 0.06, crit: 0.03 },
                acts: [
                    { id: 'lend_grain', name: '借粮济邻', cost: 15000000, favor: 8, mood: 4, cd: 4 * HOUR_MS,
                      line: '邻家孩子抱着米袋鞠躬。{name}摆摆手，说「谁还没个难处」。' },
                    { id: 'mend_roof', name: '帮修邻屋', cost: 20000000, favor: 10, mood: 3, cd: 5 * HOUR_MS,
                      line: '{name}爬上邻家屋顶钉瓦，下来时灰了一脸，却笑得开心。' },
                    { id: 'festival_share', name: '节礼互赠', cost: 25000000, favor: 12, mood: 7, cd: 8 * HOUR_MS,
                      line: '两家门口同时放着对方的点心。巷子里都说「这两家好」。' },
                    { id: 'mediate', name: '劝和街坊', cost: 10000000, favor: 6, mood: 5, cd: 4 * HOUR_MS,
                      line: '{name}把吵翻的两家请到茶棚，说到月亮升起才散。' }
                ]
            },
            // —— 幼年光景（未成年） ——
            childhood: [
                { id: 'play_mud', name: '玩泥巴', stageMax: 2, cost: 800000, mood: 6, attr: 'physique', attrGain: 1, cd: 2 * HOUR_MS,
                  lines: ['{name}满手泥，笑得露出缺的那颗牙。', '{name}捏了个歪歪扭扭的小人，说是你。'] },
                { id: 'listen_story', name: '听祖辈故事', stageMax: 3, cost: 1500000, mood: 5, attr: 'intelligence', attrGain: 1, cd: 2 * HOUR_MS,
                  lines: ['{name}趴在膝头听十八代的传说，眼睛越睁越大。', '{name}问：那我们以后也会进族谱吗？'] },
                { id: 'market_candy', name: '集市买糖', stageMax: 3, cost: 2000000, mood: 8, attr: 'charm', attrGain: 1, cd: 3 * HOUR_MS,
                  lines: ['{name}含着糖葫芦，说话黏黏的。', '糖纸在{name}口袋里窸窸窣窣，像藏着小秘密。'] },
                { id: 'copy_chars', name: '描红练字', stageMin: 2, stageMax: 3, cost: 2500000, mood: 3, attr: 'intelligence', attrGain: 2, cd: 3 * HOUR_MS,
                  lines: ['{name}把「家」字写歪了，自己擦掉重写。', '墨点溅到鼻子上，{name}还不知道。'] },
                { id: 'spar_wood', name: '木人桩试拳', stageMin: 3, cost: 3000000, mood: 4, attr: 'physique', attrGain: 2, cd: 3 * HOUR_MS, needNearAdult: true,
                  lines: ['{name}打得手腕发红，仍不肯停。', '廊下有人喊「歇歇」，{name}却又出了一拳。'] }
            ],
            // —— 染恙传染 ——
            contagion: {
                plagueSpreadChance: 0.18,
                feverSpreadChance: 0.08,
                coldSpreadChance: 0.05
            }
        };

        // 更多日常 / 婚育 / 轶事
        var moreChores = [
            { id: 'well_draw', name: '井台打水', cost: 1000000, cd: HOUR_MS, mood: 2, attr: 'physique', attrGain: 1, worldHp: 0.25,
              lines: ['辘轳吱呀。{name}把两桶水稳稳放下，溅湿了鞋。', '{name}把第一瓢留给老人，自己喝第二瓢。'] },
            { id: 'mend_clothes', name: '灯下缝补', cost: 1500000, cd: 2 * HOUR_MS, mood: 4, attr: 'charm', attrGain: 1, worldHp: 0.35,
              lines: ['针脚细密。{name}把破洞缝成一朵小小的云。', '灯花爆了一下，{name}说：又是一年。'] },
            { id: 'grain_dry', name: '晒谷翻场', cost: 3500000, cd: 3 * HOUR_MS, mood: 2, attr: 'business', attrGain: 1, worldAtk: 0.35, worldHp: 0.25,
              lines: ['谷香混着日头气。{name}翻场翻到后背全湿。', '{name}数着谷堆，心里有了底。'] },
            { id: 'ancestor_dust', name: '擦拭牌位', cost: 5000000, cd: 4 * HOUR_MS, mood: 5, attr: 'intelligence', attrGain: 1, worldAtk: 0.4, worldHp: 0.4, worldCritDmg: 0.3,
              lines: ['{name}用绒布一点点擦过十八代的名字，动作很轻。', '香灰落下来，{name}吹了吹，像怕惊动谁。'] }
        ];
        living.chores = (living.chores || []).concat(moreChores.filter(function (c) {
            return !living.chores.some(function (x) { return x.id === c.id; });
        }));

        var moreMarital = [
            { id: 'write_letter', name: '灯下情书', cost: 6000000, bond: 7, mood: 5, cd: 4 * HOUR_MS,
              line: '{name}写给{spouse}的字很笨，却把「想你」写得很清楚。' },
            { id: 'plant_tree', name: '合栽连理', cost: 20000000, bond: 12, mood: 8, cd: 10 * HOUR_MS,
              line: '{name}与{spouse}在院角栽下一棵树，说好一起看它长高。' },
            { id: 'night_congee', name: '夜半煮粥', cost: 4000000, bond: 5, mood: 6, cd: 3 * HOUR_MS,
              line: '更鼓响了。{name}给{spouse}熬了碗粥，两个人对坐，谁也不急着睡。' }
        ];
        if (living.marital && living.marital.activities) {
            living.marital.activities = living.marital.activities.concat(moreMarital.filter(function (a) {
                return !living.marital.activities.some(function (x) { return x.id === a.id; });
            }));
        }

        var moreEvents = [
            { id: 'betrothal_press', title: '婚期催促', text: '长辈敲着桌子：订了婚就该选日子成婚，拖着像什么样子？',
              choices: [
                { label: '加快筹备婚礼', cost: 80000000, effect: 'deepBetrothalRush', prestige: 12, worldHp: 2 },
                { label: '让小两口再相处一阵', cost: 30000000, effect: 'deepAffinityBoost', amount: 8, prestige: 10 },
                { label: '顶回去：日子要慢慢过', cost: 0, effect: 'livingMood', amount: -2, prestige: 3 }
              ]},
            { id: 'pregnant_omen', title: '有喜征兆', text: '成婚且恩爱的小夫妻近来爱吃酸，又爱困。稳婆笑而不语。',
              choices: [
                { label: '备好补品静候', cost: 70000000, effect: 'deepNurtureBoost', amount: 10, prestige: 14, worldHp: 4 },
                { label: '办添丁祈福小宴', cost: 120000000, effect: 'happiness', amount: 18, prestige: 16 },
                { label: '先不声张，怕冲了', cost: 0, effect: 'livingMood', amount: 4, prestige: 5 }
              ]},
            { id: 'gen_echo', title: '代际回响', text: '族谱某页自己翻开，墨迹浮现你们刚触及的那一代名讳，像有人在提醒：别忘了来时路。',
              choices: [
                { label: '举行追思并解锁遗泽', cost: 200000000, effect: 'deepLegacyReady', prestige: 32, worldAtk: 5, worldHp: 5, worldCritDmg: 4 },
                { label: '抄录进日记传家', cost: 80000000, effect: 'livingMood', amount: 10, prestige: 15 },
                { label: '合上族谱，明日再说', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'neighbor_feud', title: '邻里龃龉', text: '为了一截滴水檐，街坊红了脸。孩子们躲在门后偷看。',
              choices: [
                { label: '出面调停并补偿', cost: 60000000, effect: 'deepNeighborBoost', amount: 15, prestige: 18, worldHp: 3 },
                { label: '各退一步重新丈量', cost: 25000000, effect: 'deepNeighborBoost', amount: 8, prestige: 10 },
                { label: '关门不理', cost: 0, effect: 'deepNeighborLoss', amount: 10, prestige: -8 }
              ]},
            { id: 'child_fever_night', title: '孩童夜热', text: '最小的孩子夜里发烧，额头烫得吓人。全屋灯都亮了。',
              choices: [
                { label: '连夜请医灌药', cost: 90000000, effect: 'deepChildHeal', prestige: 20, worldHp: 5 },
                { label: '冷敷加姜汤死守', cost: 20000000, effect: 'livingMood', amount: 5, prestige: 8 },
                { label: '求祠堂赐安', cost: 40000000, effect: 'offerReady', prestige: 12 }
              ]}
        ];
        var c = window.lineageExtConfig;
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'betroth1', name: '丝萝初定', desc: '完成订婚相处 1 次', need: 1, key: 'betroth', rewardPrestige: 20, rewardFunds: 8000000, rewardExp: 15 },
            { id: 'nurture1', name: '珠胎暗结', desc: '完成孕期调养 1 次', need: 1, key: 'nurture', rewardPrestige: 22, rewardFunds: 10000000, rewardExp: 18 },
            { id: 'calamity1', name: '共渡时艰', desc: '应对时令灾害 1 次', need: 1, key: 'calamity', rewardPrestige: 30, rewardFunds: 15000000, rewardExp: 25 },
            { id: 'neighbor1', name: '远亲不如近邻', desc: '邻里人情 1 次', need: 1, key: 'neighbor', rewardPrestige: 16, rewardFunds: 6000000, rewardExp: 12 },
            { id: 'childhood1', name: '童心未泯', desc: '幼年光景 2 次', need: 2, key: 'childhood', rewardPrestige: 14, rewardFunds: 4000000, rewardExp: 10 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensureDeepData() {
        if (!player.children) return;
        installDeepConfig();
        if (!player.children.living) return;
        var D = player.children.living;
        if (!D.deep) {
            D.deep = {
                betrothalCd: {},
                nurtureCd: {},
                neighborCd: {},
                childhoodCd: {},
                neighborFavor: 0,
                calamity: null,
                calamityLast: 0,
                legaciesClaimed: {},
                legacyFree: false,
                preventUntil: 0,
                lastCalamityTick: 0
            };
        }
        var deep = D.deep;
        if (!deep.betrothalCd) deep.betrothalCd = {};
        if (!deep.nurtureCd) deep.nurtureCd = {};
        if (!deep.neighborCd) deep.neighborCd = {};
        if (!deep.childhoodCd) deep.childhoodCd = {};
        if (!deep.legaciesClaimed) deep.legaciesClaimed = {};
        if (deep.neighborFavor == null) deep.neighborFavor = 0;
        if (deep.calamityLast == null) deep.calamityLast = 0;
        if (deep.preventUntil == null) deep.preventUntil = 0;
        if (deep.lastCalamityTick == null) deep.lastCalamityTick = 0;
        (player.children.children || []).forEach(function (m) {
            if (m.betrothalAffinity == null) m.betrothalAffinity = 0;
            if (m.pregnancyNurture == null) m.pregnancyNurture = 0;
            if (m.postpartumUntil == null) m.postpartumUntil = 0;
        });
    }

    function pushDiary(text) {
        if (!player.children.life) {
            if (typeof ensureLifeData === 'function') ensureLifeData();
        }
        if (!player.children.life) return;
        var d = player.children.life.diary;
        if (!Array.isArray(d)) { player.children.life.diary = []; d = player.children.life.diary; }
        d.unshift({ t: Date.now(), text: text });
        if (d.length > 60) d.length = 60;
    }

    function bump(key) {
        if (!player.children.dailyQuest) return;
        var dq = player.children.dailyQuest;
        (cfg().dailyQuests || []).forEach(function (q) {
            if (q.key === key) dq.progress[q.id] = (dq.progress[q.id] || 0) + 1;
        });
    }

    function currentSeason() {
        var list = (livingRoot().seasons) || [];
        if (!list.length) return { id: 'spring', name: '春' };
        return list[Math.floor(Date.now() / DAY_MS) % list.length];
    }

    function maxGen() {
        var g = 0;
        (player.children.children || []).forEach(function (m) { g = Math.max(g, m.generation || 1); });
        return g;
    }

    function refreshUI() {
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    }

    // ——— 订婚 ———
    window.betrothFamilyMember = function (memberIndex) {
        ensureDeepData();
        var members = player.children.children || [];
        var m = members[memberIndex];
        var bt = L().betrothal;
        if (!m || !bt) return;
        if (!isAdult(m)) return logAction('只有成年成员才能订婚', 'error');
        if (m.isMarried) return logAction(m.name + ' 已经成婚', 'error');
        if (m.isBetrothed) return logAction(m.name + ' 已经订婚', 'info');
        if ((m.generation || 1) >= ((typeof childConfig !== 'undefined' && childConfig.lineage && childConfig.lineage.maxGeneration) || 18)) {
            return logAction('终世一代不可再订婚传宗', 'error');
        }
        if (funds().availableFunds < bt.cost) return logAction('资金不足，需要 ' + fmt(bt.cost), 'error');
        funds().availableFunds -= bt.cost;
        var spouseGender = m.gender === 'boy' ? 'girl' : 'boy';
        var names = {
            boy: ['承安', '景行', '怀远', '子衿', '伯温', '季白'],
            girl: ['清婉', '若兰', '听雪', '念慈', '疏桐', '芝韵']
        };
        m.isBetrothed = true;
        m.betrothalDate = Date.now();
        m.betrothalAffinity = 5;
        m.fiance = {
            name: names[spouseGender][Math.floor(Math.random() * names[spouseGender].length)],
            gender: spouseGender
        };
        pushDiary(m.name + ' 与 ' + m.fiance.name + ' 定下了婚约。红帖压在匣里，日子还长。');
        logAction(m.name + ' 订婚成功，未婚配：' + m.fiance.name + '。请先相处增进情谊，再择日成婚。', 'success');
        if (typeof addLineageExp === 'function') addLineageExp(8);
        refreshUI();
    };

    window.doBetrothalActivity = function (actId, memberIndex) {
        ensureDeepData();
        var bt = L().betrothal;
        var act = (bt.activities || []).find(function (a) { return a.id === actId; });
        var m = (player.children.children || [])[memberIndex];
        if (!act || !m || !m.isBetrothed || !m.fiance) return logAction('请选择已订婚成员', 'error');
        if (m.isMarried) return logAction('已成婚，请改做婚育恩爱', 'info');
        var cdKey = act.id + ':' + (m.id || memberIndex);
        var left = (player.children.living.deep.betrothalCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('冷却中，约 ' + Math.ceil(left / 60000) + ' 分钟', 'info');
        if (funds().availableFunds < act.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= act.cost;
        player.children.living.deep.betrothalCd[cdKey] = Date.now() + act.cd;
        m.betrothalAffinity = Math.min(bt.affinityCap, (m.betrothalAffinity || 0) + act.affinity);
        if (player.children.life) {
            player.children.life.mood = Math.min(100, (player.children.life.mood || 50) + (act.mood || 0));
        }
        var line = act.line.replace(/\{name\}/g, m.name).replace(/\{fiance\}/g, m.fiance.name);
        pushDiary(line);
        bump('betroth');
        logAction(line + '（情谊 ' + m.betrothalAffinity + '/' + bt.affinityNeedMarry + '）', 'success');
        refreshUI();
    };

    function canMarryAfterBetrothal(m) {
        var bt = L().betrothal;
        if (!m) return { ok: false, reason: '无效成员' };
        if (!isAdult(m)) return { ok: false, reason: '须成年' };
        if (m.isMarried) return { ok: false, reason: '已成婚' };
        if (!m.isBetrothed || !m.fiance) return { ok: false, reason: m.name + ' 尚未订婚，请先在「婚育」页订婚' };
        var wait = bt.minWaitHours * HOUR_MS;
        var elapsed = Date.now() - (m.betrothalDate || 0);
        if (elapsed < wait) {
            return { ok: false, reason: '订婚未满 ' + bt.minWaitHours + ' 小时，再等约 ' + Math.ceil((wait - elapsed) / 60000) + ' 分钟' };
        }
        if ((m.betrothalAffinity || 0) < bt.affinityNeedMarry) {
            return { ok: false, reason: '订婚情谊不足（' + (m.betrothalAffinity || 0) + '/' + bt.affinityNeedMarry + '），请先相处' };
        }
        return { ok: true };
    }
    window.canMarryAfterBetrothal = canMarryAfterBetrothal;

    // ——— 孕期调养 ———
    window.doPregnancyNurture = function (actId, memberIndex) {
        ensureDeepData();
        var preg = L().pregnancy;
        var act = (preg.activities || []).find(function (a) { return a.id === actId; });
        var m = (player.children.children || [])[memberIndex];
        if (!act || !m) return;
        if (!m.isPregnant) return logAction(m.name + ' 当前未在孕育中', 'error');
        if (typeof isFamilyMemberSick === 'function' && isFamilyMemberSick(m)) {
            return logAction('生病中不宜强行调养，请先治病', 'error');
        }
        var cdKey = act.id + ':' + (m.id || memberIndex);
        var left = (player.children.living.deep.nurtureCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('冷却中', 'info');
        if (funds().availableFunds < act.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= act.cost;
        player.children.living.deep.nurtureCd[cdKey] = Date.now() + act.cd;
        m.pregnancyNurture = Math.min(preg.nurtureCap, (m.pregnancyNurture || 0) + act.nurture);
        if (player.children.life) {
            player.children.life.mood = Math.min(100, (player.children.life.mood || 50) + (act.mood || 0));
        }
        if (act.prestige && typeof addClanPrestige === 'function') addClanPrestige(act.prestige);
        var line = act.line
            .replace(/\{name\}/g, m.name)
            .replace(/\{spouse\}/g, (m.spouse && m.spouse.name) || '配偶');
        pushDiary(line);
        bump('nurture');
        logAction(line + '（胎养 ' + m.pregnancyNurture + '/' + preg.nurtureCap + '）', 'success');
        refreshUI();
    };

    // ——— 时令灾害 ———
    function pickCalamity() {
        var season = currentSeason();
        var pool = (L().calamities || []).filter(function (c) {
            return c.season === 'any' || c.season === season.id;
        });
        if (!pool.length) return null;
        var total = 0;
        pool.forEach(function (c) { total += c.weight || 1; });
        var r = Math.random() * total;
        for (var i = 0; i < pool.length; i++) {
            r -= pool[i].weight || 1;
            if (r <= 0) return pool[i];
        }
        return pool[0];
    }

    function tickCalamity() {
        ensureDeepData();
        var deep = player.children.living.deep;
        var now = Date.now();
        if (deep.calamity && now >= (deep.calamity.until || 0)) {
            pushDiary('【' + deep.calamity.name + '】慢慢过去了。院子里又能听见平常的声音。');
            logAction('时令灾害「' + deep.calamity.name + '」已平息', 'success');
            deep.calamity = null;
        }
        if (deep.calamity) return;
        if (now - (deep.calamityLast || 0) < (L().calamityCd || 10 * HOUR_MS)) return;
        if (now - (deep.lastCalamityTick || 0) < HOUR_MS) return;
        deep.lastCalamityTick = now;
        if (Math.random() > (L().calamityChancePerDay || 0.22) / 24) return;
        var cal = pickCalamity();
        if (!cal) return;
        deep.calamity = {
            id: cal.id,
            name: cal.name,
            text: cal.text,
            until: now + (cal.hours || 6) * HOUR_MS,
            choices: cal.choices,
            illnessChance: cal.illnessChance || 0,
            forceIllness: cal.forceIllness || null
        };
        deep.calamityLast = now;
        if (player.children.life) {
            player.children.life.mood = Math.max(0, (player.children.life.mood || 50) + (cal.mood || -8));
        }
        // 灾害可能引发染恙
        if (cal.illnessChance && Math.random() < cal.illnessChance) {
            var healthy = (player.children.children || []).filter(function (m) {
                return !(typeof isFamilyMemberSick === 'function' && isFamilyMemberSick(m));
            });
            if (healthy.length && typeof infectMember !== 'function') {
                // infectMember 未导出时本地传染
            }
            if (healthy.length) {
                var t = healthy[Math.floor(Math.random() * healthy.length)];
                forceInfect(t, cal.forceIllness || 'cold');
            }
        }
        pushDiary('【灾害】' + cal.name + '：' + cal.text);
        logAction('时令灾害降临：' + cal.name + '！请前往「烟火」页应对。', 'warning');
        refreshUI();
    }

    function forceInfect(member, illnessId) {
        if (!member || (member.illness && member.illness.id)) return;
        if (Date.now() < (player.children.living.deep.preventUntil || 0)) return;
        var illnesses = (livingRoot().illnesses) || [];
        var def = illnesses.find(function (x) { return x.id === illnessId; }) || illnesses[0];
        if (!def) return;
        member.illness = {
            id: def.id,
            since: Date.now(),
            until: Date.now() + def.days * DAY_MS,
            severity: def.severity
        };
        pushDiary(member.name + ' 在灾害中染上了「' + def.name + '」。');
    }

    window.resolveLivingCalamity = function (choiceIndex) {
        ensureDeepData();
        var deep = player.children.living.deep;
        var cal = deep.calamity;
        if (!cal) return logAction('当前无灾害', 'info');
        var ch = cal.choices && cal.choices[choiceIndex];
        if (!ch) return;
        if (ch.cost && funds().availableFunds < ch.cost) return logAction('资金不足', 'error');
        if (ch.cost) funds().availableFunds -= ch.cost;
        if (ch.prestige && typeof addClanPrestige === 'function') addClanPrestige(ch.prestige);
        if (player.children.life) {
            player.children.life.mood = Math.max(0, Math.min(100, (player.children.life.mood || 50) + (ch.mood || 0)));
        }
        if (player.children.life && player.children.life.tempWorld) {
            var tw = player.children.life.tempWorld;
            if (Date.now() > (tw.until || 0)) { tw.atk = 0; tw.hp = 0; tw.crit = 0; }
            tw.atk += ch.worldAtk || 0;
            tw.hp += ch.worldHp || 0;
            tw.crit += ch.worldCritDmg || 0;
            tw.until = Date.now() + 5 * HOUR_MS;
        }
        if (ch.effect === 'massHeal') {
            (player.children.children || []).forEach(function (m) { m.illness = null; });
        }
        if (ch.effect === 'prevent') {
            deep.preventUntil = Date.now() + 8 * HOUR_MS;
        }
        if (ch.effect === 'neighbor') {
            deep.neighborFavor = Math.min(100, (deep.neighborFavor || 0) + 12);
        }
        if (ch.effect === 'shrine' && player.children.eighteen) {
            player.children.eighteen.ritualLast = Math.max(0, (player.children.eighteen.ritualLast || 0) - 4 * HOUR_MS);
        }
        pushDiary('族人合力应对「' + cal.name + '」：' + ch.label);
        bump('calamity');
        deep.calamity = null;
        logAction('灾害「' + cal.name + '」已化解：' + ch.label, 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    window.triggerLivingCalamity = function () {
        ensureDeepData();
        var deep = player.children.living.deep;
        if (deep.calamity) return logAction('已有灾害进行中', 'info');
        if (Date.now() - (deep.calamityLast || 0) < (L().calamityCd || 10 * HOUR_MS) / 2) {
            return logAction('灾害冷却中', 'info');
        }
        deep.lastCalamityTick = 0;
        deep.calamityLast = 0;
        // 强制一次
        var cal = pickCalamity();
        if (!cal) return;
        deep.calamity = {
            id: cal.id, name: cal.name, text: cal.text,
            until: Date.now() + (cal.hours || 6) * HOUR_MS,
            choices: cal.choices,
            illnessChance: cal.illnessChance || 0,
            forceIllness: cal.forceIllness || null
        };
        deep.calamityLast = Date.now();
        pushDiary('【灾害】' + cal.name + '：' + cal.text);
        logAction('时令灾害：' + cal.name, 'warning');
        refreshUI();
    };

    // ——— 代际遗泽 ———
    window.claimGenerationLegacy = function (gen) {
        ensureDeepData();
        var item = (L().genLegacies || []).find(function (x) { return x.gen === gen; });
        if (!item) return;
        if (maxGen() < gen) return logAction('尚未触及第 ' + gen + ' 代', 'error');
        var deep = player.children.living.deep;
        if (deep.legaciesClaimed[gen]) return logAction('该遗泽已启封', 'info');
        var cost = deep.legacyFree ? 0 : item.cost;
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        deep.legacyFree = false;
        deep.legaciesClaimed[gen] = true;
        pushDiary('启封「' + item.name + '」：' + item.text);
        if (typeof addLineageExp === 'function') addLineageExp(10 + gen);
        if (typeof addClanPrestige === 'function') addClanPrestige(8 + gen);
        logAction('代际遗泽「' + item.name + '」启封！永久三维提升', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 邻里 ———
    window.doNeighborAct = function (actId, memberIndex) {
        ensureDeepData();
        var nb = L().neighbor;
        var act = (nb.acts || []).find(function (a) { return a.id === actId; });
        var m = (player.children.children || [])[memberIndex];
        if (!act || !m) return;
        if (!isAdult(m)) return logAction('需成年成员出面', 'error');
        var cdKey = act.id + ':' + (m.id || memberIndex);
        var left = (player.children.living.deep.neighborCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('冷却中', 'info');
        if (funds().availableFunds < act.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= act.cost;
        player.children.living.deep.neighborCd[cdKey] = Date.now() + act.cd;
        var deep = player.children.living.deep;
        deep.neighborFavor = Math.min(nb.favorCap, (deep.neighborFavor || 0) + act.favor);
        if (player.children.life) {
            player.children.life.mood = Math.min(100, (player.children.life.mood || 50) + (act.mood || 0));
        }
        var line = act.line.replace(/\{name\}/g, m.name);
        pushDiary(line);
        bump('neighbor');
        logAction(line + '（邻里人情 ' + deep.neighborFavor + '/' + nb.favorCap + '）', 'success');
        refreshUI();
    };

    // ——— 幼年光景 ———
    window.doChildhoodMoment = function (actId, memberIndex) {
        ensureDeepData();
        var act = (L().childhood || []).find(function (a) { return a.id === actId; });
        var m = (player.children.children || [])[memberIndex];
        if (!act || !m) return;
        if (isAdult(m)) return logAction('已成年，请去做烟火日常或志向', 'info');
        var stage = m.growthStage || 0;
        if (act.stageMin != null && stage < act.stageMin) return logAction('年纪还小，再等等', 'info');
        if (act.stageMax != null && stage > act.stageMax) return logAction('已过了玩这个的年纪', 'info');
        var cdKey = act.id + ':' + (m.id || memberIndex);
        var left = (player.children.living.deep.childhoodCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('冷却中', 'info');
        if (funds().availableFunds < act.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= act.cost;
        player.children.living.deep.childhoodCd[cdKey] = Date.now() + act.cd;
        if (act.attr && m.attributes) {
            m.attributes[act.attr] = (m.attributes[act.attr] || 0) + (act.attrGain || 1);
        }
        if (player.children.life) {
            player.children.life.mood = Math.min(100, (player.children.life.mood || 50) + (act.mood || 0));
        }
        m.lifeMood = Math.min(100, (m.lifeMood || 50) + (act.mood || 0));
        var line = act.lines[Math.floor(Math.random() * act.lines.length)].replace(/\{name\}/g, m.name);
        pushDiary(line);
        bump('childhood');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 传染 tick ———
    function tickContagion() {
        ensureDeepData();
        if (Date.now() < (player.children.living.deep.preventUntil || 0)) return;
        var cont = L().contagion || {};
        var members = player.children.children || [];
        var sick = members.filter(function (m) { return m.illness && m.illness.id; });
        if (!sick.length) return;
        sick.forEach(function (s) {
            var chance = 0;
            if (s.illness.id === 'plague') chance = cont.plagueSpreadChance || 0.18;
            else if (s.illness.id === 'fever') chance = cont.feverSpreadChance || 0.08;
            else if (s.illness.id === 'cold') chance = cont.coldSpreadChance || 0.05;
            if (Math.random() >= chance) return;
            var healthy = members.filter(function (m) { return !m.illness || !m.illness.id; });
            if (!healthy.length) return;
            var t = healthy[Math.floor(Math.random() * healthy.length)];
            forceInfect(t, s.illness.id);
            logAction(s.name + ' 的病气传给了 ' + t.name, 'warning');
        });
    }

    // ——— 世界地图加成 ———
    function calcDeepWorld() {
        ensureDeepData();
        var atk = 0, hp = 0, crit = 0;
        var deep = player.children.living.deep;
        (L().genLegacies || []).forEach(function (item) {
            if (!deep.legaciesClaimed[item.gen]) return;
            atk += item.atk; hp += item.hp; crit += item.crit;
        });
        var fav = deep.neighborFavor || 0;
        var nb = L().neighbor || {};
        var per = nb.perFavorWorld || {};
        atk += fav * (per.atk || 0);
        hp += fav * (per.hp || 0);
        crit += fav * (per.crit || 0);
        // 孕期调养间接：已育成员曾有高胎养留下的微小永久（存 nurtureLegacy）
        (player.children.children || []).forEach(function (m) {
            if (m.nurtureLegacy) {
                atk += m.nurtureLegacy * 0.05;
                hp += m.nurtureLegacy * 0.08;
                crit += m.nurtureLegacy * 0.04;
            }
            if (m.postpartumUntil && Date.now() < m.postpartumUntil) {
                hp += 0.8;
            }
        });
        if (deep.calamity) {
            atk -= 2; hp -= 3; crit -= 1.5;
        }
        return { atk: Math.max(0, atk), hp: Math.max(0, hp), crit: Math.max(0, crit) };
    }

    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        installDeepConfig();
        ensureDeepData();
        var base = _origBonus ? _origBonus() : { worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var w = calcDeepWorld();
        base.worldAtk = (base.worldAtk || 0) + w.atk;
        base.worldHp = (base.worldHp || 0) + w.hp;
        base.worldCritDmg = (base.worldCritDmg || 0) + w.crit;
        return base;
    };

    // ——— 成婚须先订婚 ———
    var _origTiered = window.arrangeMarriageTiered;
    if (_origTiered) {
        window.arrangeMarriageTiered = function (childIndex, tierId) {
            ensureDeepData();
            var child = player.children.children[childIndex];
            var gate = canMarryAfterBetrothal(child);
            if (!gate.ok) {
                logAction(gate.reason, 'error');
                return;
            }
            var affinity = child.betrothalAffinity || 0;
            var fiance = child.fiance;
            var wasMarried = !!child.isMarried;
            _origTiered(childIndex, tierId);
            var tries = 0;
            var timer = setInterval(function () {
                tries++;
                var m = player.children.children[childIndex];
                if (m && m.isMarried && !wasMarried) {
                    clearInterval(timer);
                    // 订婚对象成为配偶（保留姓名）
                    if (fiance) {
                        m.spouse = m.spouse || {};
                        m.spouse.name = fiance.name;
                        m.spouse.gender = fiance.gender;
                        m.spouse.fromBetrothal = true;
                    }
                    m.isBetrothed = false;
                    m.fiance = null;
                    var bonus = Math.floor(affinity * ((L().betrothal && L().betrothal.marryBondBonus) || 0.4));
                    m.maritalBond = Math.max(m.maritalBond || 0, 10 + bonus);
                    pushDiary(m.name + ' 与 ' + (m.spouse && m.spouse.name) + ' 成婚。订婚时的情谊，化作了屋里的灯。');
                    logAction(m.name + ' 成婚！订婚情谊转化为恩爱 +' + bonus + '。请继续培养恩爱后孕育。', 'success');
                    refreshUI();
                    return;
                }
                if (tries > 60) clearInterval(timer);
            }, 100);
        };
    }

    // 分娩：应用胎养 + 坐月子
    var _origBirth = window.giveDescendantBirth;
    if (_origBirth) {
        window.giveDescendantBirth = function (parentIndex) {
            ensureDeepData();
            var parent = player.children.children[parentIndex];
            var nurture = parent && parent.pregnancyNurture || 0;
            var beforeLen = (player.children.children || []).length;
            _origBirth(parentIndex);
            var after = player.children.children || [];
            if (after.length > beforeLen) {
                var baby = after[after.length - 1];
                var preg = L().pregnancy || {};
                var add = Math.floor(nurture * (preg.nurturePerAttr || 0.15));
                if (baby && baby.attributes && add > 0) {
                    Object.keys(baby.attributes).forEach(function (k) {
                        baby.attributes[k] = (baby.attributes[k] || 0) + add;
                    });
                    baby.nurtureLegacy = Math.min(20, Math.floor(nurture / 4));
                    logAction('孕期调养生效：' + baby.name + ' 出生属性各 +' + add, 'success');
                    pushDiary(baby.name + ' 落地时，大家说：这孩子底子好，是月子里养出来的。');
                }
            }
            if (parent) {
                parent.pregnancyNurture = 0;
                parent.postpartumUntil = Date.now() + ((L().pregnancy && L().pregnancy.postpartumHours) || 8) * HOUR_MS;
                parent.maritalBond = Math.min(100, (parent.maritalBond || 0) + ((L().pregnancy && L().pregnancy.postpartumBond) || 5));
                if (player.children.life) {
                    player.children.life.mood = Math.min(100, (player.children.life.mood || 50) + ((L().pregnancy && L().pregnancy.postpartumMood) || 6));
                }
                pushDiary(parent.name + ' 进入坐月子期，不宜过劳。');
                logAction(parent.name + ' 分娩后坐月子中，暂缓高强度劳作更稳妥', 'info');
            }
            refreshUI();
        };
    }

    // 坐月子禁打工（软限制）
    var _origWork = window.startChildWork;
    window.startChildWork = function (childIndex) {
        ensureDeepData();
        var child = player.children.children[childIndex];
        if (child && child.postpartumUntil && Date.now() < child.postpartumUntil) {
            logAction(child.name + ' 尚在坐月子，不宜打工（约剩 ' +
                Math.ceil((child.postpartumUntil - Date.now()) / 3600000) + ' 小时）', 'error');
            return;
        }
        if (_origWork) return _origWork(childIndex);
    };

    // 轶事效果
    var _origResolve = window.resolveClanEvent;
    if (_origResolve) {
        window.resolveClanEvent = function (choiceIndex) {
            var ev = player.children && player.children.activeEvent;
            var conf = ev && (cfg().events || []).find(function (e) { return e.id === ev.id; });
            var ch = conf && conf.choices && conf.choices[choiceIndex];
            _origResolve(choiceIndex);
            if (!ch) return;
            ensureDeepData();
            var deep = player.children.living.deep;
            if (ch.effect === 'deepBetrothalRush') {
                (player.children.children || []).forEach(function (m) {
                    if (m.isBetrothed) m.betrothalDate = Date.now() - 5 * HOUR_MS;
                });
                logAction('婚期筹备加快，订婚等待缩短', 'success');
            } else if (ch.effect === 'deepAffinityBoost') {
                (player.children.children || []).forEach(function (m) {
                    if (m.isBetrothed) m.betrothalAffinity = Math.min(50, (m.betrothalAffinity || 0) + (ch.amount || 8));
                });
            } else if (ch.effect === 'deepNurtureBoost') {
                (player.children.children || []).forEach(function (m) {
                    if (m.isPregnant) m.pregnancyNurture = Math.min(40, (m.pregnancyNurture || 0) + (ch.amount || 10));
                });
            } else if (ch.effect === 'deepLegacyReady') {
                deep.legacyFree = true;
                logAction('获得一次免费启封代际遗泽的机会', 'success');
            } else if (ch.effect === 'deepNeighborBoost') {
                deep.neighborFavor = Math.min(100, (deep.neighborFavor || 0) + (ch.amount || 10));
            } else if (ch.effect === 'deepNeighborLoss') {
                deep.neighborFavor = Math.max(0, (deep.neighborFavor || 0) - (ch.amount || 10));
            } else if (ch.effect === 'deepChildHeal') {
                (player.children.children || []).forEach(function (m) {
                    if (!isAdult(m) && m.illness) m.illness = null;
                });
            }
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }

    function updateBetrothalPanel() {
        var box = el('livingBetrothalPanel');
        if (!box) return;
        ensureDeepData();
        var bt = L().betrothal;
        var members = player.children.children || [];
        var html = '<p class="c-hint"><strong>婚育链：</strong>成年 → <strong>订婚</strong>（相处情谊）→ 成婚 → 恩爱 → 孕育 → 孕养 → 分娩坐月子。</p>';
        var candidates = members.map(function (m, i) { return { m: m, i: i }; }).filter(function (x) {
            return isAdult(x.m) && !x.m.isMarried && (x.m.generation || 1) < 18;
        });
        if (!candidates.length) {
            html += '<div class="c-hint">暂无成年未婚成员可订婚</div>';
            box.innerHTML = html;
            return;
        }
        html += candidates.map(function (row) {
            var m = row.m;
            if (!m.isBetrothed) {
                return '<div class="c-member"><div class="name">' + m.name + '</div><div class="meta">成年未婚</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="betrothFamilyMember(' + row.i + ')">订婚（' + fmt(bt.cost) + '）</button></div>';
            }
            var gate = canMarryAfterBetrothal(m);
            var aff = m.betrothalAffinity || 0;
            var pct = Math.min(100, (aff / bt.affinityNeedMarry) * 100);
            var acts = (bt.activities || []).map(function (a) {
                return '<button class="c-btn c-btn-sm c-btn-pink" style="margin:2px;" onclick="doBetrothalActivity(\'' + a.id + '\',' + row.i + ')">' +
                    a.name + ' +' + a.affinity + '</button>';
            }).join('');
            return '<div class="c-member" style="margin-bottom:8px;">' +
                '<div class="name">' + m.name + ' × ' + m.fiance.name + '（订婚中）</div>' +
                '<div class="meta">情谊 ' + aff + '/' + bt.affinityNeedMarry + (gate.ok ? ' · 可成婚' : '') + '</div>' +
                '<div class="c-progress"><i style="width:' + pct + '%"></i><span>' + pct.toFixed(0) + '%</span></div>' +
                (!gate.ok ? '<div class="c-hint" style="color:#FF8A65;">' + gate.reason + '</div>' :
                    '<div class="c-hint" style="color:#81C784;">可前往「传宗」选择联姻档位成婚</div>') +
                '<div style="margin-top:4px;">' + acts + '</div></div>';
        }).join('');
        box.innerHTML = html;
    }

    function updateNurturePanel() {
        var box = el('livingNurturePanel');
        if (!box) return;
        ensureDeepData();
        var preg = L().pregnancy;
        var pregnant = (player.children.children || []).map(function (m, i) { return { m: m, i: i }; })
            .filter(function (x) { return x.m.isPregnant; });
        var postpartum = (player.children.children || []).filter(function (m) {
            return m.postpartumUntil && Date.now() < m.postpartumUntil;
        });
        var html = '<p class="c-hint">孕育中可调养，提升新生儿出生属性；分娩后进入坐月子，暂不宜打工。</p>';
        if (postpartum.length) {
            html += '<div class="c-hint" style="color:#FFB74D;">坐月子：' + postpartum.map(function (m) {
                return m.name + '（剩' + Math.ceil((m.postpartumUntil - Date.now()) / 3600000) + '时）';
            }).join('、') + '</div>';
        }
        if (!pregnant.length) {
            html += '<div class="c-hint">当前无人孕育。恩爱达标后可在「传宗」孕育。</div>';
            box.innerHTML = html;
            return;
        }
        html += pregnant.map(function (row) {
            var m = row.m;
            var n = m.pregnancyNurture || 0;
            var pct = Math.min(100, (n / preg.nurtureCap) * 100);
            var acts = (preg.activities || []).map(function (a) {
                return '<button class="c-btn c-btn-sm c-btn-green" style="margin:2px;" onclick="doPregnancyNurture(\'' + a.id + '\',' + row.i + ')">' +
                    a.name + ' +' + a.nurture + '</button>';
            }).join('');
            return '<div class="c-member"><div class="name">' + m.name + ' · 孕育中</div>' +
                '<div class="meta">胎养 ' + n + '/' + preg.nurtureCap + '</div>' +
                '<div class="c-progress"><i style="width:' + pct + '%"></i></div>' +
                '<div style="margin-top:4px;">' + acts + '</div></div>';
        }).join('');
        box.innerHTML = html;
    }

    function updateCalamityPanel() {
        var box = el('livingCalamityPanel');
        if (!box) return;
        ensureDeepData();
        var season = currentSeason();
        var cal = player.children.living.deep.calamity;
        var html = '<div class="c-hint">时令【' + season.name + '】· 灾害会随机降临，需族人应对</div>';
        if (!cal) {
            html += '<div class="c-hint" style="color:#81C784;">当下风调雨顺。</div>' +
                '<button class="c-btn c-btn-sm c-btn-orange" onclick="triggerLivingCalamity()">观天象（可能引来灾害）</button>';
            box.innerHTML = html;
            return;
        }
        var left = Math.max(0, Math.ceil(((cal.until || 0) - Date.now()) / 60000));
        html += '<div style="font-weight:bold;color:#FF8A65;margin:8px 0;">' + cal.name +
            ' · 约 ' + left + ' 分钟后自行平息</div><p class="c-hint">' + cal.text + '</p>';
        html += (cal.choices || []).map(function (ch, i) {
            return '<button class="c-btn c-btn-blue" style="width:100%;margin-top:6px;text-align:left;" onclick="resolveLivingCalamity(' + i + ')">' +
                ch.label + (ch.cost ? '（' + fmt(ch.cost) + '）' : '') + '</button>';
        }).join('');
        box.innerHTML = html;
    }

    function updateLegacyPanel() {
        var box = el('livingLegacyPanel');
        if (!box) return;
        ensureDeepData();
        var deep = player.children.living.deep;
        var g = maxGen();
        var html = '<div class="c-hint">最远代数 ' + g + ' · ' +
            (deep.legacyFree ? '<span style="color:#81C784;">有一次免费启封</span>' : '启封遗泽获永久三维') + '</div>';
        html += (L().genLegacies || []).map(function (item) {
            var done = !!deep.legaciesClaimed[item.gen];
            var lock = g < item.gen;
            return '<div class="c-milestone' + (done ? ' done' : '') + '"><div><div class="ms-title">第' + item.gen + '代 · ' + item.name +
                '</div><div class="ms-desc">' + item.text + '<br>攻+' + (item.atk * 100) + '% 血+' + (item.hp * 100) + '% 爆+' + (item.crit * 100) +
                '% · ' + fmt(deep.legacyFree && !done ? 0 : item.cost) + '</div></div>' +
                (done ? '<span style="color:#4CAF50;">已启</span>' :
                    '<button class="c-btn c-btn-sm c-btn-gold" ' + (lock ? 'disabled' : '') +
                    ' onclick="claimGenerationLegacy(' + item.gen + ')">' + (lock ? '未及' : '启封') + '</button>') +
                '</div>';
        }).join('');
        box.innerHTML = html;
    }

    function updateNeighborPanel() {
        var box = el('livingNeighborPanel');
        if (!box) return;
        ensureDeepData();
        var nb = L().neighbor;
        var fav = player.children.living.deep.neighborFavor || 0;
        var members = player.children.children || [];
        var opts = members.map(function (m, i) {
            if (!isAdult(m)) return '';
            return '<option value="' + i + '">' + m.name + '</option>';
        }).join('');
        box.innerHTML = '<div class="c-hint">邻里人情 ' + fav + '/' + nb.favorCap + ' · 永久微幅提升世界地图三维</div>' +
            '<div class="c-form-row"><label>出面成员</label><select id="livingNeighborMember" class="c-input">' + opts + '</select></div>' +
            '<div class="c-train-grid">' + (nb.acts || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div><div class="ms-desc">+' + a.favor + ' 人情 · ' + fmt(a.cost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doNeighborAct(\'' + a.id + '\',+document.getElementById(\'livingNeighborMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateChildhoodPanel() {
        var box = el('livingChildhoodPanel');
        if (!box) return;
        ensureDeepData();
        var members = player.children.children || [];
        var kids = members.map(function (m, i) { return { m: m, i: i }; }).filter(function (x) { return !isAdult(x.m); });
        if (!kids.length) {
            box.innerHTML = '<div class="c-hint">暂无未成年成员。新生儿与少年可在此体验光景。</div>';
            return;
        }
        var opts = kids.map(function (x) {
            var st = (typeof childConfig !== 'undefined' && childConfig.growthStages && childConfig.growthStages[x.m.growthStage])
                ? childConfig.growthStages[x.m.growthStage].name : '成长中';
            return '<option value="' + x.i + '">' + x.m.name + '（' + st + '）</option>';
        }).join('');
        box.innerHTML = '<div class="c-form-row"><label>孩子</label><select id="livingChildMember" class="c-input">' + opts + '</select></div>' +
            '<div class="c-train-grid">' + (L().childhood || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div><div class="ms-desc">' + fmt(a.cost) + ' · 心情+' + a.mood + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doChildhoodMoment(\'' + a.id + '\',+document.getElementById(\'livingChildMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    var _origLivingPanels = window.updateLivingPanels;
    window.updateLivingPanels = function () {
        if (_origLivingPanels) _origLivingPanels();
        if (typeof childTabIn === 'function' && !childTabIn(['illness', 'living', 'marital', 'eighteen', 'lineage', 'birth', 'realty', 'overview'])) return;
        installDeepConfig();
        ensureDeepData();
        updateBetrothalPanel();
        updateNurturePanel();
        updateCalamityPanel();
        updateLegacyPanel();
        updateNeighborPanel();
        updateChildhoodPanel();
        enhanceLineageBetrothalHints();
        var hint = el('livingLineageGateHint');
        if (hint) {
            var need = (livingRoot().marital && livingRoot().marital.bondNeedConceive) || 30;
            hint.innerHTML = '生育门禁：成年 → <strong>订婚</strong> → 成婚 → 恩爱满 ' + need + ' → 孕育（可孕养）→ 分娩坐月子。染恙可能传染。';
        }
    };

    function enhanceLineageBetrothalHints() {
        var children = player.children.children || [];
        children.forEach(function (child, index) {
            if (!isAdult(child) || child.isMarried || child.isPregnant) return;
            if ((child.generation || 1) >= 18) return;
            // 未婚未订婚：在传宗卡片提示
            var cards = document.querySelectorAll('#lineageActionList .c-member');
            // 找「安排成婚」按钮
            var marryBtn = document.querySelector('#lineageActionList button[onclick="arrangeMarriage(' + index + ')"]');
            if (!marryBtn) return;
            if (!child.isBetrothed) {
                marryBtn.disabled = true;
                marryBtn.textContent = '须先订婚';
                marryBtn.className = 'c-btn c-btn-orange';
                if (!marryBtn.parentNode.querySelector('.deep-betroth-btn')) {
                    var b = document.createElement('button');
                    b.className = 'c-btn c-btn-gold deep-betroth-btn';
                    b.style.width = '100%';
                    b.style.marginTop = '6px';
                    b.textContent = '前往订婚（婚育页）';
                    b.onclick = function () {
                        if (typeof switchChildTab === 'function') switchChildTab('marital');
                    };
                    marryBtn.parentNode.insertBefore(b, marryBtn.nextSibling);
                }
            } else {
                var gate = canMarryAfterBetrothal(child);
                if (!gate.ok) {
                    marryBtn.disabled = true;
                    marryBtn.textContent = '订婚相处中';
                    marryBtn.title = gate.reason;
                }
            }
        });
    }

    // 传宗列表刷新时也补订婚提示
    var _origLineageListDeep = window.updateLineageActionList;
    if (_origLineageListDeep) {
        window.updateLineageActionList = function () {
            _origLineageListDeep();
            ensureDeepData();
            enhanceLineageBetrothalHints();
        };
    }

    function startDeepLoop() {
        var reg = typeof registerSingletonInterval === 'function' ? registerSingletonInterval : null;
        var fn = function () {
            try {
                tickCalamity();
                tickContagion();
            } catch (e) { /* ignore */ }
        };
        if (reg) reg('_lineageLivingDeepLoopId', fn, 60 * 1000);
        else if (typeof registerInterval === 'function') registerInterval(fn, 60 * 1000);
        else setInterval(fn, 60 * 1000);
    }

    installDeepConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            installDeepConfig();
            ensureDeepData();
            startDeepLoop();
        }, 1500);
    });
    if (document.readyState !== 'loading') {
        setTimeout(function () {
            installDeepConfig();
            ensureDeepData();
            startDeepLoop();
        }, 1500);
    }
})();

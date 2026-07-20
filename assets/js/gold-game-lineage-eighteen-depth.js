/**
 * 家族传承 · 十八代玄脉 / 子孙破境
 * 大量新玩法；凡「升级/破境/祭炼」类统一 12 小时冷却
 * 在 descendants-plus.js 之后加载
 */
(function () {
    'use strict';
    var DAY_MS = 24 * 60 * 60 * 1000;
    var HOUR_MS = 60 * 60 * 1000;
    var CD_12H = 12 * HOUR_MS;

    function cfg() { return window.lineageExtConfig; }
    function funds() { return player.investmentGame.userData; }
    function fmt(n) { return typeof formatSci === 'function' ? formatSci(n) : String(n); }
    function isAdult(m) {
        return typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : !!(m && m.isAdult);
    }
    function E() { return (cfg() && cfg().eighteenDepth) || {}; }
    function genLabel(g) {
        return typeof getGenerationLabel === 'function' ? getGenerationLabel(g) : ('第' + g + '代');
    }

    function installDepthConfig() {
        if (!window.lineageExtConfig) return;
        var c = window.lineageExtConfig;
        if (c._eighteenDepthInstalled) return;
        c._eighteenDepthInstalled = true;

        c.eighteenDepth = {
            upgradeCd: CD_12H,
            // —— 十八代玄脉坛（升级·12h）——
            altar: {
                maxLv: 30,
                costBase: 50000000,
                growth: 2.5,
                per: { atk: 1.2, hp: 1.2, crit: 0.9 }
            },
            // —— 代际灵觉（按代升级·12h）——
            spirit: {
                gens: [1, 3, 6, 9, 12, 15, 18],
                costBase: 80000000,
                growth: 3,
                maxLv: 10,
                per: { atk: 0.8, hp: 0.8, crit: 0.6 }
            },
            // —— 祖训经卷（升级·12h）——
            scripture: {
                maxLv: 20,
                costBase: 60000000,
                growth: 2.8,
                per: { atk: 1, hp: 1.1, crit: 0.8 },
                prestigePer: 5
            },
            // —— 十八印（逐枚启封，启封后可祭炼升级·12h）——
            seals: [
                { id: 'kai', gen: 1, name: '开宗印', cost: 40000000, atk: 1, hp: 1, crit: 0.5 },
                { id: 'san', gen: 3, name: '三世印', cost: 100000000, atk: 2, hp: 2, crit: 1.2 },
                { id: 'yun', gen: 6, name: '云孙印', cost: 250000000, atk: 3.5, hp: 3.5, crit: 2.5 },
                { id: 'er', gen: 9, name: '耳孙印', cost: 500000000, atk: 5, hp: 5, crit: 4 },
                { id: 'tai', gen: 12, name: '胎孙印', cost: 1000000000, atk: 7, hp: 7, crit: 5.5 },
                { id: 'kun', gen: 15, name: '昆孙印', cost: 2500000000, atk: 10, hp: 10, crit: 8 },
                { id: 'zhong', gen: 18, name: '终世印', cost: 8000000000, atk: 18, hp: 18, crit: 15 }
            ],
            sealRefine: {
                maxLv: 8,
                costBase: 100000000,
                growth: 3.5,
                per: { atk: 0.6, hp: 0.6, crit: 0.5 }
            },
            // —— 血脉朝圣（活动·非升级，6h）——
            pilgrimage: [
                { id: 'shrine', name: '祭祖朝山', cost: 30000000, cd: 6 * HOUR_MS, mood: 8, fame: 5, worldHp: 2,
                  line: '{name}登山祭祖，汗水滴在石阶上，像把路走实了。' },
                { id: 'river', name: '溯河寻根', cost: 45000000, cd: 6 * HOUR_MS, mood: 6, fame: 6, worldAtk: 2,
                  line: '{name}逆流而上，说源头的水比家里井水更凉，也更清。' },
                { id: 'ruin', name: '故垒凭吊', cost: 60000000, cd: 8 * HOUR_MS, mood: 5, fame: 8, worldCritDmg: 2,
                  line: '{name}站在残墙下，忽然念出族谱里一个陌生的名字。' },
                { id: 'star', name: '星夜点代', cost: 80000000, cd: 8 * HOUR_MS, mood: 7, fame: 10, worldAtk: 1.5, worldHp: 1.5, worldCritDmg: 1.5, needGen: 9,
                  line: '{name}数到第十八颗星，手停在半空：还有一颗，在心里。' }
            ],
            // —— 子孙破境（个人升级·12h）——
            breakRealm: {
                maxLv: 15,
                costBase: 40000000,
                growth: 2.6,
                attrGain: 3,
                perWorld: { atk: 0.5, hp: 0.5, crit: 0.4 },
                needAdult: false,
                stageMin: 2
            },
            // —— 命星淬炼（升级·12h）——
            destinyStar: {
                maxLv: 12,
                costBase: 55000000,
                growth: 2.7,
                per: { atk: 0.7, hp: 0.7, crit: 0.7 },
                needFame: 20
            },
            // —— 皮肉筋骨（体质升级·12h）——
            temperBody: {
                paths: [
                    { id: 'skin', name: '炼皮', attr: 'physique', max: 12, costBase: 30000000, growth: 2.4, worldHp: 0.6 },
                    { id: 'bone', name: '炼骨', attr: 'physique', max: 12, costBase: 35000000, growth: 2.5, worldAtk: 0.5, worldHp: 0.4 },
                    { id: 'tendon', name: '炼筋', attr: 'physique', max: 12, costBase: 32000000, growth: 2.45, worldCritDmg: 0.55 },
                    { id: 'blood', name: '炼血', attr: 'charm', max: 12, costBase: 38000000, growth: 2.55, worldHp: 0.7, worldAtk: 0.3 }
                ]
            },
            // —— 经脉贯通（升级·12h）——
            meridian: {
                maxLv: 18,
                costBase: 70000000,
                growth: 2.9,
                per: { atk: 0.9, hp: 0.9, crit: 0.7 },
                needAdult: true
            },
            // —— 族战旌旗（升级·12h）——
            banner: {
                maxLv: 20,
                costBase: 90000000,
                growth: 2.8,
                per: { atk: 1.5, hp: 1.0, crit: 1.2 },
                needAdults: 2
            },
            // —— 子孙本命器（启封+祭炼升级·12h）——
            artifacts: [
                { id: 'brush', name: '文心笔', attr: 'intelligence', unlockCost: 50000000, refineBase: 40000000, max: 10, atk: 0.4, crit: 0.8 },
                { id: 'blade', name: '护族刀', attr: 'physique', unlockCost: 60000000, refineBase: 45000000, max: 10, atk: 0.9, hp: 0.3 },
                { id: 'abacus', name: '生金算', attr: 'business', unlockCost: 55000000, refineBase: 42000000, max: 10, atk: 0.8, hp: 0.2 },
                { id: 'mirror', name: '照心镜', attr: 'charm', unlockCost: 50000000, refineBase: 40000000, max: 10, hp: 0.7, crit: 0.5 },
                { id: 'jade', name: '十八玉', attr: 'intelligence', unlockCost: 200000000, refineBase: 120000000, max: 10, atk: 1, hp: 1, crit: 1, needGen: 12 }
            ],
            // —— 血脉大阵（升级·12h）——
            formation: {
                maxLv: 18,
                costBase: 120000000,
                growth: 3,
                per: { atk: 1.3, hp: 1.3, crit: 1.1 },
                needTablets: 3
            },
            // —— 代际共鸣脉冲（限时，非永久升级，冷却12h）——
            pulse: {
                cost: 150000000,
                cd: CD_12H,
                duration: 4 * HOUR_MS,
                perGen: { atk: 0.8, hp: 0.8, crit: 0.6 }
            },
            // —— 子孙列传编修（升级式·12h）——
            chronicle: {
                maxLv: 15,
                costBase: 40000000,
                growth: 2.5,
                per: { atk: 0.5, hp: 0.6, crit: 0.4 },
                needBios: false
            },
            // —— 日常：血脉小课（短CD）——
            drills: [
                { id: 'chant', name: '默诵族名', cost: 5000000, cd: 2 * HOUR_MS, mood: 3, fame: 2,
                  line: '{name}把十八代名讳默念一遍，舌尖发苦，心却定了。' },
                { id: 'copy_pu', name: '誊抄谱页', cost: 8000000, cd: 3 * HOUR_MS, attr: 'intelligence', gain: 2, fame: 3,
                  line: '{name}誊谱时手不抖。墨干了，名字就活了。' },
                { id: 'guard_tablet', name: '护持牌位', cost: 6000000, cd: 3 * HOUR_MS, attr: 'physique', gain: 1, fame: 2, worldHp: 0.3,
                  line: '{name}把落灰掸净，像怕惊醒谁。' },
                { id: 'tell_gen', name: '讲代际故事', cost: 7000000, cd: 3 * HOUR_MS, attr: 'charm', gain: 2, fame: 3, mood: 4,
                  line: '{name}把第{gen}代的故事讲给小辈听，自己也听进去了。' }
            ]
        };

        var moreEvents = [
            { id: 'altar_hum', title: '玄脉坛嗡鸣', text: '祠堂地下隐隐震动，像有什么东西在醒来。老人说：可以开坛了。',
              choices: [
                { label: '立即祭炼玄脉坛', cost: 200000000, effect: 'depthAltarReady', prestige: 30, worldAtk: 5, worldHp: 5 },
                { label: '先稳住香火再议', cost: 80000000, effect: 'livingMood', amount: 8, prestige: 12 },
                { label: '当作地气，不理', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'seal_dream', title: '十八印入梦', text: '你梦见七枚印依次亮起，最后一枚写着「终世」。醒来掌心发热。',
              choices: [
                { label: '按梦寻印启封', cost: 300000000, effect: 'depthSealReady', prestige: 35, worldCritDmg: 6 },
                { label: '记入族谱附页', cost: 100000000, effect: 'chronicleBoost', prestige: 18 },
                { label: '洗手睡觉', cost: 0, effect: 'livingMood', amount: 4, prestige: 4 }
              ]},
            { id: 'break_sign', title: '破境之兆', text: '有子弟周身发热，旧伤隐隐作痛，像要往上挣一层。',
              choices: [
                { label: '护法助其破境', cost: 120000000, effect: 'depthBreakReady', prestige: 22, worldAtk: 4 },
                { label: '温养三日再冲', cost: 50000000, effect: 'livingMood', amount: 6, prestige: 10 },
                { label: '强行压制，恐伤根基', cost: 0, effect: 'none', prestige: 3 }
              ]},
            { id: 'formation_plan', title: '大阵图纸', text: '旧匣里翻出一张残图，十八个点连成阵。有人说能护族，有人说会惹事。',
              choices: [
                { label: '按图布阵升级', cost: 250000000, effect: 'depthFormationReady', prestige: 28, worldAtk: 5, worldHp: 5, worldCritDmg: 4 },
                { label: '只摹一份存档', cost: 60000000, effect: 'livingMood', amount: 5, prestige: 10 },
                { label: '封存勿动', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'pulse_night', title: '血脉潮汐', text: '每月难得一遇的血脉潮汐今夜将至。全族都能感到胸口发热。',
              choices: [
                { label: '开脉冲共鸣', cost: 180000000, effect: 'depthPulseReady', prestige: 25, worldAtk: 6, worldHp: 6 },
                { label: '分散静养，勿聚力', cost: 40000000, effect: 'plusFilialBoost', prestige: 12 },
                { label: '照常睡觉', cost: 0, effect: 'none', prestige: 1 }
              ]}
        ];
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'altar1', name: '玄脉祭炼', desc: '升级玄脉坛/祖训/大阵等 1 次', need: 1, key: 'depthUp', rewardPrestige: 30, rewardFunds: 20000000, rewardExp: 25 },
            { id: 'break1', name: '子孙破境', desc: '完成破境/命星/炼体/经脉 1 次', need: 1, key: 'depthBreak', rewardPrestige: 25, rewardFunds: 15000000, rewardExp: 20 },
            { id: 'seal1', name: '十八印务', desc: '启封或祭炼十八印 1 次', need: 1, key: 'depthSeal', rewardPrestige: 28, rewardFunds: 18000000, rewardExp: 22 },
            { id: 'drill2', name: '血脉小课', desc: '完成血脉小课 2 次', need: 2, key: 'depthDrill', rewardPrestige: 14, rewardFunds: 6000000, rewardExp: 12 },
            { id: 'pilgrim1', name: '朝圣之路', desc: '完成血脉朝圣 1 次', need: 1, key: 'depthPilgrim', rewardPrestige: 20, rewardFunds: 10000000, rewardExp: 16 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensureDepthData() {
        if (!player.children) return;
        installDepthConfig();
        if (!player.children.eighteenDepth) {
            player.children.eighteenDepth = {
                altarLv: 0,
                altarCd: 0,
                spiritLv: {},
                spiritCd: {},
                scriptureLv: 0,
                scriptureCd: 0,
                seals: {},
                sealRefine: {},
                sealCd: {},
                pilgrimCd: {},
                bannerLv: 0,
                bannerCd: 0,
                formationLv: 0,
                formationCd: 0,
                pulseLast: 0,
                pulseUntil: 0,
                chronicleLv: 0,
                chronicleCd: 0,
                drillCd: {},
                // 免费/加速标记
                altarReady: false,
                sealReady: false,
                breakReady: false,
                formationReady: false,
                pulseReady: false
            };
        }
        var d = player.children.eighteenDepth;
        if (!d.spiritLv) d.spiritLv = {};
        if (!d.spiritCd) d.spiritCd = {};
        if (!d.seals) d.seals = {};
        if (!d.sealRefine) d.sealRefine = {};
        if (!d.sealCd) d.sealCd = {};
        if (!d.pilgrimCd) d.pilgrimCd = {};
        if (!d.drillCd) d.drillCd = {};
        (player.children.children || []).forEach(function (m) {
            if (!m.depth) {
                m.depth = {
                    breakLv: 0, breakCd: 0,
                    starLv: 0, starCd: 0,
                    temper: {}, temperCd: {},
                    meridianLv: 0, meridianCd: 0,
                    artifacts: {}, artifactCd: {}
                };
            }
            var dep = m.depth;
            if (!dep.temper) dep.temper = {};
            if (!dep.temperCd) dep.temperCd = {};
            if (!dep.artifacts) dep.artifacts = {};
            if (!dep.artifactCd) dep.artifactCd = {};
            if (dep.breakLv == null) dep.breakLv = 0;
            if (dep.starLv == null) dep.starLv = 0;
            if (dep.meridianLv == null) dep.meridianLv = 0;
        });
    }

    function pushDiary(text) {
        if (!player.children.life && typeof ensureLifeData === 'function') ensureLifeData();
        if (!player.children.life) return;
        var d = player.children.life.diary;
        if (!Array.isArray(d)) { player.children.life.diary = []; d = player.children.life.diary; }
        d.unshift({ t: Date.now(), text: text });
        if (d.length > 100) d.length = 100;
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

    function cdLeft(until) {
        return Math.max(0, (until || 0) - Date.now());
    }

    function cdHint(until) {
        var left = cdLeft(until);
        if (left <= 0) return '';
        var h = Math.floor(left / 3600000);
        var m = Math.ceil((left % 3600000) / 60000);
        return '冷却 ' + h + '时' + m + '分';
    }

    function checkUpgradeCd(until, readyFlag) {
        if (readyFlag) return { ok: true, free: true };
        var left = cdLeft(until);
        if (left > 0) return { ok: false, reason: '升级冷却中（12小时），' + cdHint(until) };
        return { ok: true };
    }

    function setUpgradeCd(obj, key) {
        obj[key] = Date.now() + (E().upgradeCd || CD_12H);
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

    function tabletCount() {
        var t = (player.children.eighteen && player.children.eighteen.tablets) || {};
        return Object.keys(t).filter(function (k) { return t[k]; }).length;
    }

    // ——— 玄脉坛升级（12h）———
    window.upgradeEighteenAltar = function () {
        ensureDepthData();
        var a = E().altar;
        var d = player.children.eighteenDepth;
        var gate = checkUpgradeCd(d.altarCd, d.altarReady);
        if (!gate.ok) return logAction(gate.reason, 'info');
        var lv = d.altarLv || 0;
        if (lv >= a.maxLv) return logAction('玄脉坛已满级', 'info');
        var cost = Math.floor(a.costBase * Math.pow(a.growth, lv));
        if (gate.free) { cost = Math.floor(cost * 0.5); d.altarReady = false; }
        if (funds().availableFunds < cost) return logAction('资金不足，需要 ' + fmt(cost), 'error');
        funds().availableFunds -= cost;
        d.altarLv = lv + 1;
        setUpgradeCd(d, 'altarCd');
        bump('depthUp');
        pushDiary('玄脉坛升至第 ' + d.altarLv + ' 层。地下的嗡鸣稳了下来。');
        logAction('玄脉坛 Lv.' + d.altarLv + '（下次升级需等 12 小时）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 代际灵觉（12h/代）———
    window.upgradeGenerationSpirit = function (gen) {
        ensureDepthData();
        var sp = E().spirit;
        if (sp.gens.indexOf(gen) < 0) return;
        if (maxGen() < gen) return logAction('尚未触及第 ' + gen + ' 代', 'error');
        var d = player.children.eighteenDepth;
        var gate = checkUpgradeCd(d.spiritCd[gen], false);
        if (!gate.ok) return logAction('第' + gen + '代灵觉' + gate.reason, 'info');
        var lv = d.spiritLv[gen] || 0;
        if (lv >= sp.maxLv) return logAction('该代灵觉已满', 'info');
        var cost = Math.floor(sp.costBase * Math.pow(sp.growth, lv) * (1 + gen * 0.15));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.spiritLv[gen] = lv + 1;
        d.spiritCd[gen] = Date.now() + CD_12H;
        bump('depthUp');
        pushDiary(genLabel(gen) + ' 灵觉升至 Lv.' + d.spiritLv[gen]);
        logAction(genLabel(gen) + ' 灵觉 Lv.' + d.spiritLv[gen] + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 祖训经卷（12h）———
    window.upgradeAncestralScripture = function () {
        ensureDepthData();
        var s = E().scripture;
        var d = player.children.eighteenDepth;
        var gate = checkUpgradeCd(d.scriptureCd, false);
        if (!gate.ok) return logAction(gate.reason, 'info');
        var lv = d.scriptureLv || 0;
        if (lv >= s.maxLv) return logAction('祖训经卷已满级', 'info');
        var cost = Math.floor(s.costBase * Math.pow(s.growth, lv));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.scriptureLv = lv + 1;
        setUpgradeCd(d, 'scriptureCd');
        if (typeof addClanPrestige === 'function') addClanPrestige(s.prestigePer || 5);
        bump('depthUp');
        pushDiary('祖训经卷修纂至第 ' + d.scriptureLv + ' 卷。');
        logAction('祖训经卷 Lv.' + d.scriptureLv + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 十八印启封 ———
    window.unlockEighteenSeal = function (sealId) {
        ensureDepthData();
        var seal = (E().seals || []).find(function (s) { return s.id === sealId; });
        var d = player.children.eighteenDepth;
        if (!seal) return;
        if (maxGen() < seal.gen) return logAction('需触及第 ' + seal.gen + ' 代', 'error');
        if (d.seals[sealId]) return logAction('该印已启封', 'info');
        var cost = d.sealReady ? Math.floor(seal.cost * 0.5) : seal.cost;
        if (d.sealReady) d.sealReady = false;
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.seals[sealId] = true;
        d.sealRefine[sealId] = 0;
        bump('depthSeal');
        pushDiary('启封「' + seal.name + '」。印面微热。');
        logAction('启封「' + seal.name + '」！', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 十八印祭炼升级（12h）———
    window.refineEighteenSeal = function (sealId) {
        ensureDepthData();
        var seal = (E().seals || []).find(function (s) { return s.id === sealId; });
        var rf = E().sealRefine;
        var d = player.children.eighteenDepth;
        if (!seal || !d.seals[sealId]) return logAction('请先启封', 'error');
        var gate = checkUpgradeCd(d.sealCd[sealId], false);
        if (!gate.ok) return logAction(seal.name + gate.reason, 'info');
        var lv = d.sealRefine[sealId] || 0;
        if (lv >= rf.maxLv) return logAction('祭炼已满', 'info');
        var cost = Math.floor(rf.costBase * Math.pow(rf.growth, lv) * (1 + seal.gen * 0.1));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.sealRefine[sealId] = lv + 1;
        d.sealCd[sealId] = Date.now() + CD_12H;
        bump('depthSeal');
        bump('depthUp');
        pushDiary('「' + seal.name + '」祭炼至 Lv.' + d.sealRefine[sealId]);
        logAction(seal.name + ' 祭炼 Lv.' + d.sealRefine[sealId] + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 朝圣 ———
    window.doBloodPilgrimage = function (pilgrimId, memberIndex) {
        ensureDepthData();
        var p = (E().pilgrimage || []).find(function (x) { return x.id === pilgrimId; });
        var m = (player.children.children || [])[memberIndex];
        if (!p || !m) return;
        if (p.needGen && maxGen() < p.needGen) return logAction('代数未及', 'error');
        var left = cdLeft(player.children.eighteenDepth.pilgrimCd[p.id]);
        if (left > 0) return logAction('冷却中，' + cdHint(player.children.eighteenDepth.pilgrimCd[p.id]), 'info');
        if (funds().availableFunds < p.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= p.cost;
        player.children.eighteenDepth.pilgrimCd[p.id] = Date.now() + p.cd;
        addMood(p.mood || 0);
        addFame(m, p.fame || 0);
        addTempWorld(p.worldAtk, p.worldHp, p.worldCritDmg, 5);
        var line = p.line.replace(/\{name\}/g, m.name);
        pushDiary(line);
        bump('depthPilgrim');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 族战旌旗（12h）———
    window.upgradeWarBanner = function () {
        ensureDepthData();
        var b = E().banner;
        var d = player.children.eighteenDepth;
        var adults = (player.children.children || []).filter(isAdult).length;
        if (adults < b.needAdults) return logAction('至少需要 ' + b.needAdults + ' 名成年子弟护旗', 'error');
        var gate = checkUpgradeCd(d.bannerCd, false);
        if (!gate.ok) return logAction(gate.reason, 'info');
        var lv = d.bannerLv || 0;
        if (lv >= b.maxLv) return logAction('旌旗已满级', 'info');
        var cost = Math.floor(b.costBase * Math.pow(b.growth, lv));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.bannerLv = lv + 1;
        setUpgradeCd(d, 'bannerCd');
        bump('depthUp');
        pushDiary('族战旌旗升至 Lv.' + d.bannerLv);
        logAction('旌旗 Lv.' + d.bannerLv + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 血脉大阵（12h）———
    window.upgradeBloodFormation = function () {
        ensureDepthData();
        var f = E().formation;
        var d = player.children.eighteenDepth;
        if (tabletCount() < f.needTablets) return logAction('需至少立下 ' + f.needTablets + ' 座牌位', 'error');
        var gate = checkUpgradeCd(d.formationCd, d.formationReady);
        if (!gate.ok) return logAction(gate.reason, 'info');
        var lv = d.formationLv || 0;
        if (lv >= f.maxLv) return logAction('大阵已满级', 'info');
        var cost = Math.floor(f.costBase * Math.pow(f.growth, lv));
        if (gate.free) { cost = Math.floor(cost * 0.5); d.formationReady = false; }
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.formationLv = lv + 1;
        setUpgradeCd(d, 'formationCd');
        bump('depthUp');
        pushDiary('血脉大阵升至第 ' + d.formationLv + ' 重。');
        logAction('大阵 Lv.' + d.formationLv + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 列传编修（12h）———
    window.upgradeDescChronicle = function () {
        ensureDepthData();
        var c = E().chronicle;
        var d = player.children.eighteenDepth;
        var gate = checkUpgradeCd(d.chronicleCd, false);
        if (!gate.ok) return logAction(gate.reason, 'info');
        var lv = d.chronicleLv || 0;
        if (lv >= c.maxLv) return logAction('列传编修已满', 'info');
        var cost = Math.floor(c.costBase * Math.pow(c.growth, lv));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.chronicleLv = lv + 1;
        setUpgradeCd(d, 'chronicleCd');
        bump('depthUp');
        pushDiary('子孙列传编修至第 ' + d.chronicleLv + ' 辑。');
        logAction('列传编修 Lv.' + d.chronicleLv + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 血脉脉冲（12h CD，限时）———
    window.triggerBloodPulse = function () {
        ensureDepthData();
        var p = E().pulse;
        var d = player.children.eighteenDepth;
        var left = cdLeft(d.pulseLast + p.cd);
        if (left > 0 && !d.pulseReady) return logAction('脉冲冷却中（12小时），' + cdHint(d.pulseLast + p.cd), 'info');
        var cost = d.pulseReady ? Math.floor(p.cost * 0.6) : p.cost;
        if (d.pulseReady) d.pulseReady = false;
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        d.pulseLast = Date.now();
        d.pulseUntil = Date.now() + p.duration;
        d.pulseGen = maxGen();
        pushDiary('血脉脉冲开启。十八代像潮水一样涌过胸口。');
        logAction('血脉脉冲启动！限时三维按代数增强（12小时后可再开）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 子孙破境（12h）———
    window.breakDescendantRealm = function (memberIndex) {
        ensureDepthData();
        var m = (player.children.children || [])[memberIndex];
        var br = E().breakRealm;
        if (!m || !m.depth) return;
        if ((m.growthStage || 0) < br.stageMin && !isAdult(m)) return logAction('年纪尚幼，不宜破境', 'info');
        var gate = checkUpgradeCd(m.depth.breakCd, player.children.eighteenDepth.breakReady);
        if (!gate.ok) return logAction(m.name + ' ' + gate.reason, 'info');
        var lv = m.depth.breakLv || 0;
        if (lv >= br.maxLv) return logAction('破境已满', 'info');
        var cost = Math.floor(br.costBase * Math.pow(br.growth, lv));
        if (gate.free) { cost = Math.floor(cost * 0.5); player.children.eighteenDepth.breakReady = false; }
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        m.depth.breakLv = lv + 1;
        m.depth.breakCd = Date.now() + CD_12H;
        Object.keys(m.attributes || {}).forEach(function (k) {
            m.attributes[k] = (m.attributes[k] || 0) + (br.attrGain || 3);
        });
        addFame(m, 8);
        bump('depthBreak');
        pushDiary(m.name + ' 破境至第 ' + m.depth.breakLv + ' 重。');
        logAction(m.name + ' 破境 Lv.' + m.depth.breakLv + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 命星淬炼（12h）———
    window.upgradeDestinyStar = function (memberIndex) {
        ensureDepthData();
        var m = (player.children.children || [])[memberIndex];
        var st = E().destinyStar;
        if (!m || !m.depth) return;
        if ((m.descFame || 0) < st.needFame) return logAction('声望不足（需 ' + st.needFame + '）', 'error');
        var gate = checkUpgradeCd(m.depth.starCd, false);
        if (!gate.ok) return logAction(m.name + ' 命星' + gate.reason, 'info');
        var lv = m.depth.starLv || 0;
        if (lv >= st.maxLv) return logAction('命星已满', 'info');
        var cost = Math.floor(st.costBase * Math.pow(st.growth, lv));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        m.depth.starLv = lv + 1;
        m.depth.starCd = Date.now() + CD_12H;
        addFame(m, 5);
        bump('depthBreak');
        pushDiary(m.name + ' 命星淬炼至 Lv.' + m.depth.starLv);
        logAction(m.name + ' 命星 Lv.' + m.depth.starLv + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 炼体（12h/路径）———
    window.temperDescendantBody = function (memberIndex, pathId) {
        ensureDepthData();
        var m = (player.children.children || [])[memberIndex];
        var path = (E().temperBody.paths || []).find(function (p) { return p.id === pathId; });
        if (!m || !path || !m.depth) return;
        var gate = checkUpgradeCd(m.depth.temperCd[pathId], false);
        if (!gate.ok) return logAction(path.name + gate.reason, 'info');
        var lv = m.depth.temper[pathId] || 0;
        if (lv >= path.max) return logAction('已满级', 'info');
        var cost = Math.floor(path.costBase * Math.pow(path.growth, lv));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        m.depth.temper[pathId] = lv + 1;
        m.depth.temperCd[pathId] = Date.now() + CD_12H;
        if (m.attributes && path.attr) m.attributes[path.attr] = (m.attributes[path.attr] || 0) + 2;
        bump('depthBreak');
        pushDiary(m.name + ' 「' + path.name + '」至 Lv.' + m.depth.temper[pathId]);
        logAction(m.name + ' ' + path.name + ' Lv.' + m.depth.temper[pathId] + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 经脉（12h）———
    window.upgradeMeridian = function (memberIndex) {
        ensureDepthData();
        var m = (player.children.children || [])[memberIndex];
        var md = E().meridian;
        if (!m || !isAdult(m) || !m.depth) return logAction('经脉贯通需成年', 'error');
        var gate = checkUpgradeCd(m.depth.meridianCd, false);
        if (!gate.ok) return logAction(m.name + ' 经脉' + gate.reason, 'info');
        var lv = m.depth.meridianLv || 0;
        if (lv >= md.maxLv) return logAction('经脉已满', 'info');
        var cost = Math.floor(md.costBase * Math.pow(md.growth, lv));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        m.depth.meridianLv = lv + 1;
        m.depth.meridianCd = Date.now() + CD_12H;
        bump('depthBreak');
        pushDiary(m.name + ' 经脉贯通至第 ' + m.depth.meridianLv + ' 重。');
        logAction(m.name + ' 经脉 Lv.' + m.depth.meridianLv + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 本命器启封 ———
    window.unlockDescArtifact = function (memberIndex, artId) {
        ensureDepthData();
        var m = (player.children.children || [])[memberIndex];
        var art = (E().artifacts || []).find(function (a) { return a.id === artId; });
        if (!m || !art || !m.depth) return;
        if (!isAdult(m)) return logAction('本命器需成年认主', 'error');
        if (art.needGen && maxGen() < art.needGen) return logAction('家族代数未及', 'error');
        if (m.depth.artifacts[artId] != null) return logAction('已认主', 'info');
        if (funds().availableFunds < art.unlockCost) return logAction('资金不足', 'error');
        funds().availableFunds -= art.unlockCost;
        m.depth.artifacts[artId] = 0;
        if (m.attributes && art.attr) m.attributes[art.attr] = (m.attributes[art.attr] || 0) + 3;
        pushDiary(m.name + ' 认主「' + art.name + '」。');
        logAction(m.name + ' 获得本命器「' + art.name + '」', 'success');
        refreshUI();
    };

    // ——— 本命器祭炼（12h）———
    window.refineDescArtifact = function (memberIndex, artId) {
        ensureDepthData();
        var m = (player.children.children || [])[memberIndex];
        var art = (E().artifacts || []).find(function (a) { return a.id === artId; });
        if (!m || !art || !m.depth || m.depth.artifacts[artId] == null) return logAction('请先认主', 'error');
        var gate = checkUpgradeCd(m.depth.artifactCd[artId], false);
        if (!gate.ok) return logAction(art.name + gate.reason, 'info');
        var lv = m.depth.artifacts[artId] || 0;
        if (lv >= art.max) return logAction('祭炼已满', 'info');
        var cost = Math.floor(art.refineBase * Math.pow(2.5, lv));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        m.depth.artifacts[artId] = lv + 1;
        m.depth.artifactCd[artId] = Date.now() + CD_12H;
        bump('depthBreak');
        bump('depthUp');
        pushDiary(m.name + ' 祭炼「' + art.name + '」至 Lv.' + m.depth.artifacts[artId]);
        logAction(art.name + ' Lv.' + m.depth.artifacts[artId] + '（12小时冷却）', 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 血脉小课 ———
    window.doDepthDrill = function (drillId, memberIndex) {
        ensureDepthData();
        var drill = (E().drills || []).find(function (d) { return d.id === drillId; });
        var m = (player.children.children || [])[memberIndex];
        if (!drill || !m) return;
        // 兼容旧笔误 id
        var id = drill.id;
        var left = cdLeft(player.children.eighteenDepth.drillCd[id]);
        if (left > 0) return logAction('冷却中，' + cdHint(player.children.eighteenDepth.drillCd[id]), 'info');
        if (funds().availableFunds < drill.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= drill.cost;
        player.children.eighteenDepth.drillCd[id] = Date.now() + drill.cd;
        addMood(drill.mood || 0);
        addFame(m, drill.fame || 0);
        if (drill.attr && m.attributes) m.attributes[drill.attr] = (m.attributes[drill.attr] || 0) + (drill.gain || 1);
        addTempWorld(drill.worldAtk, drill.worldHp, drill.worldCritDmg, 2);
        var line = (drill.line || '')
            .replace(/\{name\}/g, m.name)
            .replace(/\{gen\}/g, String(m.generation || 1));
        pushDiary(line);
        bump('depthDrill');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 三维 ———
    function calcDepthWorld() {
        ensureDepthData();
        var atk = 0, hp = 0, crit = 0;
        var d = player.children.eighteenDepth;
        var a = E().altar;
        var lv = d.altarLv || 0;
        atk += lv * (a.per.atk || 0);
        hp += lv * (a.per.hp || 0);
        crit += lv * (a.per.crit || 0);

        var sp = E().spirit;
        Object.keys(d.spiritLv || {}).forEach(function (g) {
            var l = d.spiritLv[g] || 0;
            atk += l * (sp.per.atk || 0);
            hp += l * (sp.per.hp || 0);
            crit += l * (sp.per.crit || 0);
        });

        var sc = E().scripture;
        var sl = d.scriptureLv || 0;
        atk += sl * (sc.per.atk || 0);
        hp += sl * (sc.per.hp || 0);
        crit += sl * (sc.per.crit || 0);

        var rf = E().sealRefine;
        (E().seals || []).forEach(function (seal) {
            if (!d.seals[seal.id]) return;
            atk += seal.atk || 0;
            hp += seal.hp || 0;
            crit += seal.crit || 0;
            var rl = d.sealRefine[seal.id] || 0;
            atk += rl * (rf.per.atk || 0);
            hp += rl * (rf.per.hp || 0);
            crit += rl * (rf.per.crit || 0);
        });

        var bn = E().banner;
        var bl = d.bannerLv || 0;
        atk += bl * (bn.per.atk || 0);
        hp += bl * (bn.per.hp || 0);
        crit += bl * (bn.per.crit || 0);

        var fm = E().formation;
        var fl = d.formationLv || 0;
        atk += fl * (fm.per.atk || 0);
        hp += fl * (fm.per.hp || 0);
        crit += fl * (fm.per.crit || 0);

        var ch = E().chronicle;
        var cl = d.chronicleLv || 0;
        atk += cl * (ch.per.atk || 0);
        hp += cl * (ch.per.hp || 0);
        crit += cl * (ch.per.crit || 0);

        if (Date.now() < (d.pulseUntil || 0)) {
            var pulse = E().pulse;
            var g = d.pulseGen || maxGen();
            atk += g * (pulse.perGen.atk || 0);
            hp += g * (pulse.perGen.hp || 0);
            crit += g * (pulse.perGen.crit || 0);
        }

        var br = E().breakRealm;
        var st = E().destinyStar;
        var md = E().meridian;
        (player.children.children || []).forEach(function (m) {
            if (!m.depth) return;
            var blv = m.depth.breakLv || 0;
            atk += blv * (br.perWorld.atk || 0);
            hp += blv * (br.perWorld.hp || 0);
            crit += blv * (br.perWorld.crit || 0);
            var star = m.depth.starLv || 0;
            atk += star * (st.per.atk || 0);
            hp += star * (st.per.hp || 0);
            crit += star * (st.per.crit || 0);
            var ml = m.depth.meridianLv || 0;
            atk += ml * (md.per.atk || 0);
            hp += ml * (md.per.hp || 0);
            crit += ml * (md.per.crit || 0);
            (E().temperBody.paths || []).forEach(function (path) {
                var tl = (m.depth.temper && m.depth.temper[path.id]) || 0;
                atk += tl * (path.worldAtk || 0);
                hp += tl * (path.worldHp || 0);
                crit += tl * (path.worldCritDmg || 0);
            });
            Object.keys(m.depth.artifacts || {}).forEach(function (aid) {
                var art = (E().artifacts || []).find(function (x) { return x.id === aid; });
                var al = m.depth.artifacts[aid] || 0;
                if (!art) return;
                atk += (art.atk || 0) * (1 + al * 0.5);
                hp += (art.hp || 0) * (1 + al * 0.5);
                crit += (art.crit || 0) * (1 + al * 0.5);
            });
        });

        return { atk: atk, hp: hp, crit: crit };
    }

    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        installDepthConfig();
        ensureDepthData();
        var base = _origBonus ? _origBonus() : { worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var w = calcDepthWorld();
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
            ensureDepthData();
            var d = player.children.eighteenDepth;
            if (ch.effect === 'depthAltarReady') d.altarReady = true;
            else if (ch.effect === 'depthSealReady') d.sealReady = true;
            else if (ch.effect === 'depthBreakReady') d.breakReady = true;
            else if (ch.effect === 'depthFormationReady') d.formationReady = true;
            else if (ch.effect === 'depthPulseReady') d.pulseReady = true;
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }
    function opts(filterFn) {
        return (player.children.children || []).map(function (m, i) {
            if (filterFn && !filterFn(m)) return '';
            var bl = m.depth ? (m.depth.breakLv || 0) : 0;
            return '<option value="' + i + '">' + m.name + '（' + genLabel(m.generation || 1) + '·破境' + bl + '）</option>';
        }).join('');
    }

    function updateDepthAltarPanel() {
        var box = el('depthAltarPanel');
        if (!box) return;
        ensureDepthData();
        var d = player.children.eighteenDepth;
        var a = E().altar;
        var lv = d.altarLv || 0;
        var cost = Math.floor(a.costBase * Math.pow(a.growth, lv));
        var sc = E().scripture;
        var scCost = Math.floor(sc.costBase * Math.pow(sc.growth, d.scriptureLv || 0));
        var bn = E().banner;
        var bnCost = Math.floor(bn.costBase * Math.pow(bn.growth, d.bannerLv || 0));
        var fm = E().formation;
        var fmCost = Math.floor(fm.costBase * Math.pow(fm.growth, d.formationLv || 0));
        var ch = E().chronicle;
        var chCost = Math.floor(ch.costBase * Math.pow(ch.growth, d.chronicleLv || 0));
        var cd = cdHint(d.altarCd);
        var pulseLeft = Math.max(0, (d.pulseUntil || 0) - Date.now());
        var pulseCdLeft = Math.max(0, (d.pulseLast || 0) + ((E().pulse && E().pulse.cd) || CD_12H) - Date.now());
        var pulseLabel = pulseLeft > 0
            ? ('脉冲生效中 ' + Math.ceil(pulseLeft / 60000) + ' 分钟')
            : (pulseCdLeft > 0 && !d.pulseReady
                ? ('冷却 ' + cdHint(Date.now() + pulseCdLeft))
                : ('开启血脉脉冲（12h冷却·限时三维）' + (d.pulseReady ? ' · 轶事就绪' : '')));
        var readyHints = (d.altarReady ? '★ 玄脉坛就绪 · ' : '') +
            (d.formationReady ? '★ 大阵就绪 · ' : '') +
            (d.sealReady ? '★ 印就绪 · ' : '') +
            (d.breakReady ? '★ 破境就绪 · ' : '') +
            (d.pulseReady ? '★ 脉冲就绪' : '');
        var costTag = function (c) {
            return typeof lineageCostTag === 'function' ? lineageCostTag(c, '12h') : ('（' + fmt(c) + '）');
        };
        box.innerHTML = '<div class="c-hint">玄脉坛 Lv.' + lv + '/' + a.maxLv +
            ' · 下级 <b style="color:#FFD700;">' + fmt(cost) + '</b>' + (cd ? ' · <span style="color:#FFB74D;">' + cd + '</span>' : ' · <span style="color:#81C784;">可升级</span>') +
            '<br>凡升级类玩法均为 <strong>12 小时</strong> 冷却' +
            (readyHints ? '<br><span style="color:#81C784;">' + readyHints + '</span>' : '') + '</div>' +
            '<button class="c-btn c-btn-gold" style="width:100%;" onclick="upgradeEighteenAltar()" ' +
            (cdLeft(d.altarCd) > 0 && !d.altarReady ? 'disabled' : '') + '>祭炼玄脉坛' + costTag(cost) + (d.altarReady ? ' · 就绪' : '') + '</button>' +
            '<div style="margin-top:10px;"></div>' +
            '<button class="c-btn c-btn-purple" style="width:100%;margin-top:6px;" onclick="upgradeAncestralScripture()" ' +
            (cdLeft(d.scriptureCd) > 0 ? 'disabled' : '') + '>修纂祖训经卷 Lv.' + (d.scriptureLv || 0) + costTag(scCost) +
            (cdHint(d.scriptureCd) ? ' · ' + cdHint(d.scriptureCd) : '') + '</button>' +
            '<button class="c-btn c-btn-orange" style="width:100%;margin-top:6px;" onclick="upgradeWarBanner()" ' +
            (cdLeft(d.bannerCd) > 0 ? 'disabled' : '') + '>升族战旌旗 Lv.' + (d.bannerLv || 0) + costTag(bnCost) +
            (cdHint(d.bannerCd) ? ' · ' + cdHint(d.bannerCd) : '') + '</button>' +
            '<button class="c-btn c-btn-blue" style="width:100%;margin-top:6px;" onclick="upgradeBloodFormation()" ' +
            (cdLeft(d.formationCd) > 0 && !d.formationReady ? 'disabled' : '') + '>布血脉大阵 Lv.' + (d.formationLv || 0) + costTag(fmCost) +
            (cdHint(d.formationCd) ? ' · ' + cdHint(d.formationCd) : (d.formationReady ? ' · 就绪' : '')) + '</button>' +
            '<button class="c-btn c-btn-pink" style="width:100%;margin-top:6px;" onclick="upgradeDescChronicle()" ' +
            (cdLeft(d.chronicleCd) > 0 ? 'disabled' : '') + '>编修子孙列传 Lv.' + (d.chronicleLv || 0) + costTag(chCost) +
            (cdHint(d.chronicleCd) ? ' · ' + cdHint(d.chronicleCd) : '') + '</button>' +
            '<button class="c-btn c-btn-green" style="width:100%;margin-top:8px;" onclick="triggerBloodPulse()" ' +
            (pulseLeft > 0 || (pulseCdLeft > 0 && !d.pulseReady) ? 'disabled' : '') + '>' + pulseLabel + '</button>';
    }

    function updateDepthSpiritPanel() {
        var box = el('depthSpiritPanel');
        if (!box) return;
        ensureDepthData();
        var d = player.children.eighteenDepth;
        var sp = E().spirit;
        var g = maxGen();
        box.innerHTML = '<div class="c-hint">最远代数 ' + g + ' · 每代灵觉单独 12 小时冷却</div>' +
            (sp.gens || []).map(function (gen) {
                var lv = d.spiritLv[gen] || 0;
                var lock = g < gen;
                var cd = cdHint(d.spiritCd[gen]);
                var cost = Math.floor(sp.costBase * Math.pow(sp.growth, lv) * (1 + gen * 0.15));
                return '<div class="c-milestone' + (!lock ? ' done' : '') + '"><div><div class="ms-title">' + genLabel(gen) +
                    ' 灵觉 Lv.' + lv + '/' + sp.maxLv + '</div><div class="ms-desc">' + fmt(cost) +
                    (cd ? ' · ' + cd : '') + '</div></div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" ' + (lock || cdLeft(d.spiritCd[gen]) > 0 ? 'disabled' : '') +
                    ' onclick="upgradeGenerationSpirit(' + gen + ')">' + (lock ? '未及' : '觉醒') + '</button></div>';
            }).join('');
    }

    function updateDepthSealPanel() {
        var box = el('depthSealPanel');
        if (!box) return;
        ensureDepthData();
        var d = player.children.eighteenDepth;
        var g = maxGen();
        box.innerHTML = (E().seals || []).map(function (seal) {
            var unlocked = !!d.seals[seal.id];
            var lock = g < seal.gen;
            var rl = d.sealRefine[seal.id] || 0;
            var cd = cdHint(d.sealCd[seal.id]);
            return '<div class="c-milestone' + (unlocked ? ' done' : '') + '"><div><div class="ms-title">' + seal.name +
                (unlocked ? (' · 祭炼 Lv.' + rl + '/' + ((E().sealRefine && E().sealRefine.maxLv) || 10)) : '') +
                (d.sealReady && unlocked ? ' · 就绪' : '') +
                '</div><div class="ms-desc">需' + genLabel(seal.gen) + ' · 启封 ' + fmt(seal.cost) +
                (unlocked ? (' · 下级祭炼 ' + fmt(Math.floor(((E().sealRefine && E().sealRefine.costBase) || 30000000) * Math.pow(((E().sealRefine && E().sealRefine.growth) || 2.5), rl)))) : '') +
                (cd ? ' · ' + cd : '') + '</div></div>' +
                (!unlocked
                    ? '<button class="c-btn c-btn-sm c-btn-gold" ' + (lock ? 'disabled' : '') +
                      ' onclick="unlockEighteenSeal(\'' + seal.id + '\')">' + (lock ? '未及' : (d.sealReady ? '启封(就绪)' : '启封')) + '</button>'
                    : '<button class="c-btn c-btn-sm c-btn-orange" ' + (cdLeft(d.sealCd[seal.id]) > 0 ? 'disabled' : '') +
                      ' onclick="refineEighteenSeal(\'' + seal.id + '\')">祭炼</button>') +
                '</div>';
        }).join('');
    }

    function updateDepthBreakPanel() {
        var box = el('depthBreakPanel');
        if (!box) return;
        ensureDepthData();
        var d = player.children.eighteenDepth;
        var members = player.children.children || [];
        box.innerHTML = '<div class="c-form-row"><label>子孙</label><select id="depthBreakMember" class="c-input" onchange="refreshDepthBreakProgress()">' + opts() + '</select></div>' +
            '<div id="depthBreakProgress" class="c-hint" style="margin:6px 0;"></div>' +
            (d.breakReady ? '<div class="c-hint" style="color:#81C784;">★ 轶事：破境半价/免冷却就绪</div>' : '') +
            '<button class="c-btn c-btn-gold" style="width:100%;margin-top:4px;" onclick="breakDescendantRealm(+document.getElementById(\'depthBreakMember\').value)">破境升级</button>' +
            '<button class="c-btn c-btn-purple" style="width:100%;margin-top:6px;" onclick="upgradeDestinyStar(+document.getElementById(\'depthBreakMember\').value)">命星淬炼</button>' +
            '<button class="c-btn c-btn-blue" style="width:100%;margin-top:6px;" onclick="upgradeMeridian(+document.getElementById(\'depthBreakMember\').value)">经脉贯通（成年）</button>' +
            '<h4 style="margin:12px 0 8px;color:#E8C4A8;">皮肉筋骨（各路径 12h）</h4>' +
            '<div class="c-train-grid">' + (E().temperBody.paths || []).map(function (p) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + p.name + '</div>' +
                    '<div class="ms-desc" id="depthTemperHint_' + p.id + '"></div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" onclick="temperDescendantBody(+document.getElementById(\'depthBreakMember\').value,\'' + p.id + '\')">' + p.name + '</button></div>';
            }).join('') + '</div>';
        if (typeof window.refreshDepthBreakProgress === 'function') window.refreshDepthBreakProgress();
    }

    window.refreshDepthBreakProgress = function () {
        ensureDepthData();
        var sel = el('depthBreakMember');
        var hint = el('depthBreakProgress');
        if (!sel || !hint) return;
        var m = (player.children.children || [])[Number(sel.value)];
        if (!m || !m.depth) {
            hint.textContent = '请选择子孙';
            return;
        }
        var br = E().breakRealm;
        var st = E().destinyStar;
        var mer = E().meridian;
        var bl = m.depth.breakLv || 0;
        var sl = m.depth.starLv || 0;
        var ml = m.depth.meridianLv || 0;
        var bCost = Math.floor(br.costBase * Math.pow(br.growth, bl));
        var sCost = Math.floor(st.costBase * Math.pow(st.growth, sl));
        var mCost = Math.floor(mer.costBase * Math.pow(mer.growth, ml));
        hint.innerHTML = m.name + ' · 破境 Lv.' + bl + '/' + br.maxLv + '（下级 ' + fmt(bCost) +
            (cdHint(m.depth.breakCd) ? ' · ' + cdHint(m.depth.breakCd) : ' · 可升') + '）' +
            '<br>命星 Lv.' + sl + '/' + st.maxLv + '（下级 ' + fmt(sCost) +
            (cdHint(m.depth.starCd) ? ' · ' + cdHint(m.depth.starCd) : ' · 可升') + '）' +
            '<br>经脉 Lv.' + ml + '/' + mer.maxLv + '（下级 ' + fmt(mCost) +
            (cdHint(m.depth.meridianCd) ? ' · ' + cdHint(m.depth.meridianCd) : ' · 可升') + '）';
        (E().temperBody.paths || []).forEach(function (p) {
            var node = el('depthTemperHint_' + p.id);
            if (!node) return;
            var lv = (m.depth.temper && m.depth.temper[p.id]) || 0;
            var cost = Math.floor(p.costBase * Math.pow(p.growth, lv));
            var cd = cdHint(m.depth.temperCd && m.depth.temperCd[p.id]);
            node.textContent = 'Lv.' + lv + '/' + p.max + ' · ' + fmt(cost) + (cd ? ' · ' + cd : '');
        });
    };

    function updateDepthArtifactPanel() {
        var box = el('depthArtifactPanel');
        if (!box) return;
        ensureDepthData();
        var g = maxGen();
        box.innerHTML = '<div class="c-form-row"><label>成年</label><select id="depthArtMember" class="c-input" onchange="refreshDepthArtifactProgress()">' + opts(isAdult) + '</select></div>' +
            '<div id="depthArtProgress" class="c-hint" style="margin:6px 0;"></div>' +
            '<div class="c-hint">先认主，再祭炼（祭炼 12 小时冷却）</div>' +
            '<div class="c-train-grid">' + (E().artifacts || []).map(function (art) {
                var lock = art.needGen && g < art.needGen;
                return '<div class="c-milestone' + (lock ? '' : ' done') + '" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + art.name + '</div>' +
                    '<div class="ms-desc" id="depthArtHint_' + art.id + '">认主 ' + fmt(art.unlockCost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" ' + (lock ? 'disabled' : '') +
                    ' onclick="unlockDescArtifact(+document.getElementById(\'depthArtMember\').value,\'' + art.id + '\')">认主</button> ' +
                    '<button class="c-btn c-btn-sm c-btn-orange" onclick="refineDescArtifact(+document.getElementById(\'depthArtMember\').value,\'' + art.id + '\')">祭炼</button></div>';
            }).join('') + '</div>';
        if (typeof window.refreshDepthArtifactProgress === 'function') window.refreshDepthArtifactProgress();
    }

    window.refreshDepthArtifactProgress = function () {
        ensureDepthData();
        var sel = el('depthArtMember');
        var hint = el('depthArtProgress');
        if (!sel || !hint) return;
        var m = (player.children.children || [])[Number(sel.value)];
        if (!m || !m.depth) {
            hint.textContent = '请选择成年成员';
            return;
        }
        hint.textContent = m.name + ' 的本命器进度如下';
        (E().artifacts || []).forEach(function (art) {
            var node = el('depthArtHint_' + art.id);
            if (!node) return;
            var claimed = !!(m.depth.artifacts && m.depth.artifacts[art.id] != null);
            var lv = claimed ? (m.depth.artifacts[art.id] || 0) : 0;
            var cd = cdHint(m.depth.artifactCd && m.depth.artifactCd[art.id]);
            var refineCost = Math.floor(art.refineBase * Math.pow(2.5, lv));
            node.textContent = claimed
                ? ('已认主 · Lv.' + lv + '/' + art.max + ' · 祭炼 ' + fmt(refineCost) + (cd ? ' · ' + cd : ''))
                : ('未认主 · ' + fmt(art.unlockCost) + (art.needGen ? ' · 需' + genLabel(art.needGen) : ''));
        });
    };

    function updateDepthPilgrimPanel() {
        var box = el('depthPilgrimPanel');
        if (!box) return;
        ensureDepthData();
        var g = maxGen();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="depthPilgrimMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-train-grid">' + (E().pilgrimage || []).map(function (p) {
                var lock = p.needGen && g < p.needGen;
                var cd = cdHint(player.children.eighteenDepth.pilgrimCd[p.id]);
                return '<div class="c-milestone' + (lock ? '' : ' done') + '" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + p.name + '</div><div class="ms-desc">' + fmt(p.cost) + (cd ? ' · ' + cd : '') + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" ' + (lock || cdLeft(player.children.eighteenDepth.pilgrimCd[p.id]) > 0 ? 'disabled' : '') +
                    ' onclick="doBloodPilgrimage(\'' + p.id + '\',+document.getElementById(\'depthPilgrimMember\').value)">' + p.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateDepthDrillPanel() {
        var box = el('depthDrillPanel');
        if (!box) return;
        ensureDepthData();
        var d = player.children.eighteenDepth;
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="depthDrillMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-train-grid">' + (E().drills || []).map(function (dr) {
                var cd = cdHint(d.drillCd[dr.id]);
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + dr.name + '</div><div class="ms-desc">' + fmt(dr.cost) + (cd ? ' · ' + cd : '') + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" ' + (cdLeft(d.drillCd[dr.id]) > 0 ? 'disabled' : '') +
                    ' onclick="doDepthDrill(\'' + dr.id + '\',+document.getElementById(\'depthDrillMember\').value)">' + dr.name + '</button></div>';
            }).join('') + '</div>';
    }

    window.updateEighteenDepthPanels = function () {
        installDepthConfig();
        ensureDepthData();
        updateDepthAltarPanel();
        updateDepthSpiritPanel();
        updateDepthSealPanel();
        updateDepthBreakPanel();
        updateDepthArtifactPanel();
        updateDepthPilgrimPanel();
        updateDepthDrillPanel();
    };

    // 不再从世系 / living 级联刷新玄脉；由 refreshActiveChildTabPanels 按页签刷新

    var _origSwitch = window.switchChildTab;
    window.switchChildTab = function (tab) {
        if (_origSwitch) _origSwitch(tab);
        var node = document.getElementById('childSectionEighteenDepth');
        if (node) node.classList.toggle('active', tab === 'eightdepth');
    };

    installDepthConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            installDepthConfig();
            ensureDepthData();
        }, 2400);
    });
    if (document.readyState !== 'loading') {
        setTimeout(function () {
            installDepthConfig();
            ensureDepthData();
        }, 2400);
    }
})();

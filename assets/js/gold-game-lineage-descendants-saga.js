/**
 * 家族传承 · 子弟春秋
 * 家风碑、岁时礼、工坊百艺、族学讲席、文会武集、姻亲走动、传家宝、誓约、围炉、义仓、心事匣、长辈传艺、丰碑、双人日常、声望市…
 * 在 descendants-nova.js 之后加载；升级类默认 12 小时冷却。不改变婚育门禁。
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
    function isMarried(m) {
        return !!(m && (m.isMarried || m.married || m.spouseId || m.spouseName));
    }
    function S() { return (cfg() && cfg().descSaga) || {}; }
    function genLabel(g) {
        return typeof getGenerationLabel === 'function' ? getGenerationLabel(g) : ('第' + g + '代');
    }

    function installSagaConfig() {
        if (!window.lineageExtConfig) return;
        var c = window.lineageExtConfig;
        if (c._descSagaInstalled) return;
        c._descSagaInstalled = true;

        c.descSaga = {
            upgradeCd: CD_12H,
            // —— 家风碑（族级升级 12h）——
            ethos: {
                maxLv: 18,
                costBase: 95000000,
                growth: 2.7,
                per: { atk: 1.1, hp: 1.3, crit: 0.9 },
                needMembers: 2
            },
            // —— 岁时礼（个人短 CD）——
            seasons: [
                { id: 'chun', name: '立春试笔', cost: 4500000, cd: 4 * HOUR_MS, mood: 5, attr: 'intelligence', gain: 1, fame: 2,
                  line: '{name}在立春日写下一笔，墨香里有新芽味。' },
                { id: 'qingming', name: '清明添土', cost: 8000000, cd: 5 * HOUR_MS, mood: 3, fame: 5, worldHp: 0.4,
                  line: '{name}给祖坟添了土，手掌沾泥，心里却干净。' },
                { id: 'duanwu', name: '端午系绳', cost: 5000000, cd: 4 * HOUR_MS, mood: 6, attr: 'physique', gain: 1,
                  line: '{name}把五彩绳系紧，说「今年不生病」。' },
                { id: 'qixi', name: '七夕听鹊', cost: 6000000, cd: 4 * HOUR_MS, mood: 7, attr: 'charm', gain: 1, needAdult: true,
                  line: '{name}抬头看鹊桥，耳尖微红，谁也不提心里那个人。' },
                { id: 'zhongqiu', name: '中秋分饼', cost: 7000000, cd: 4 * HOUR_MS, mood: 8, fame: 3,
                  line: '{name}把月饼掰成好几份，自己留最小的那块。' },
                { id: 'chongyang', name: '重阳登高', cost: 9000000, cd: 5 * HOUR_MS, mood: 5, attr: 'physique', gain: 2, fame: 3,
                  line: '{name}爬到坡顶，风很大，家很小，却看得清。' },
                { id: 'dongzhi', name: '冬至饺子', cost: 5500000, cd: 4 * HOUR_MS, mood: 7, sleep: 4,
                  line: '{name}包出一只歪饺子，全家抢着吃「福气」。' },
                { id: 'chuxi', name: '除夕守岁', cost: 12000000, cd: 6 * HOUR_MS, mood: 10, fame: 6, worldAtk: 0.3, worldHp: 0.3,
                  line: '{name}守到夜尽，第一声鞭炮响起时笑出了声。' }
            ],
            // —— 工坊百艺 ——
            crafts: [
                { id: 'wood', name: '木作', max: 15, costBase: 22000000, growth: 2.35, attr: 'physique', worldAtk: 0.35,
                  line: '{name}刨花飞起，木香盖过了杂念。' },
                { id: 'cloth', name: '女红/裁缝', max: 15, costBase: 22000000, growth: 2.35, attr: 'charm', worldHp: 0.35,
                  line: '{name}针脚细密，像把日子缝得更牢。' },
                { id: 'brew', name: '酿造', max: 15, costBase: 25000000, growth: 2.4, attr: 'business', worldAtk: 0.25, worldHp: 0.2,
                  line: '{name}尝了一口新酿，眉头一皱，又忍不住再尝。' },
                { id: 'pottery', name: '陶艺', max: 15, costBase: 23000000, growth: 2.35, attr: 'intelligence', worldCritDmg: 0.3,
                  line: '{name}把泥拉成器，碎了也不恼，说「再来」。' },
                { id: 'ink', name: '制墨抄经', max: 15, costBase: 26000000, growth: 2.4, attr: 'intelligence', worldCritDmg: 0.4,
                  line: '{name}墨锭磨得发烫，字却越来越冷而稳。' }
            ],
            // —— 族学讲席 ——
            lecture: [
                { id: 'li', name: '讲礼', cost: 8000000, cd: 3 * HOUR_MS, needAdult: true, fame: 3, mood: 3, attr: 'charm', gain: 1,
                  line: '{name}讲「礼」，后辈听得正襟危坐，自己却先坐直了。' },
                { id: 'shi', name: '讲史', cost: 9000000, cd: 3 * HOUR_MS, needAdult: true, fame: 4, attr: 'intelligence', gain: 2,
                  line: '{name}把旧事讲成新事，孩子们听得眼睛发亮。' },
                { id: 'suan', name: '讲算', cost: 10000000, cd: 4 * HOUR_MS, needAdult: true, fame: 3, attr: 'business', gain: 2,
                  line: '{name}在地上画算筹，尘土里开出一朵「数」。' },
                { id: 'wu', name: '讲武', cost: 10000000, cd: 4 * HOUR_MS, needAdult: true, fame: 4, attr: 'physique', gain: 2,
                  line: '{name}示范一招，收势时全场安静了一息。' }
            ],
            // —— 文会 / 武集 ——
            gather: [
                { id: 'poetry', name: '诗社雅集', cost: 25000000, cd: 5 * HOUR_MS, needAdult: true, needMembers: 2, fame: 8, attr: 'intelligence', gain: 2, mood: 5,
                  line: '烛火下纸页翻动。{name}一句成，满室击节。' },
                { id: 'chess', name: '棋会', cost: 20000000, cd: 5 * HOUR_MS, needAdult: true, needMembers: 2, fame: 6, attr: 'intelligence', gain: 2,
                  line: '{name}落子如定，对面长考到茶凉。' },
                { id: 'spar', name: '武集切磋', cost: 28000000, cd: 5 * HOUR_MS, needAdult: true, needMembers: 2, fame: 8, attr: 'physique', gain: 3, worldAtk: 0.5,
                  line: '沙场上尘土飞扬。{name}赢了一场，也输了一场，都笑着作揖。' },
                { id: 'trade_talk', name: '商路茶叙', cost: 30000000, cd: 6 * HOUR_MS, needAdult: true, needMembers: 2, fame: 7, attr: 'business', gain: 3, worldAtk: 0.4,
                  line: '茶烟里谈货路。{name}记下一句：人比货更金贵。' }
            ],
            // —— 姻亲走动（成婚后）——
            inlaw: [
                { id: 'visit', name: '登门问安', cost: 12000000, cd: 4 * HOUR_MS, bond: 4, mood: 5, fame: 3,
                  line: '{name}带了薄礼上门，岳家/公婆笑得眼睛弯。' },
                { id: 'gift', name: '节礼往来', cost: 20000000, cd: 5 * HOUR_MS, bond: 6, mood: 6, fame: 4,
                  line: '{name}把节礼送得体面，回来袖里还揣着回礼点心。' },
                { id: 'help', name: '帮衬姻亲', cost: 35000000, cd: 6 * HOUR_MS, bond: 8, mood: 4, fame: 6, worldHp: 0.5,
                  line: '{name}帮姻亲解了一桩难事，两家灯火更近了。' },
                { id: 'banquet', name: '两姓小宴', cost: 50000000, cd: 8 * HOUR_MS, bond: 12, mood: 10, fame: 8, worldAtk: 0.4, worldHp: 0.4,
                  line: '两姓同席。酒过三巡，{name}听见「亲上加亲」四个字。' }
            ],
            // —— 传家宝（认主后升级 12h）——
            heirlooms: [
                { id: 'inkstone', name: '旧砚', max: 12, costBase: 40000000, growth: 2.55, worldCritDmg: 0.7, attr: 'intelligence' },
                { id: 'blade', name: '护宅刀', max: 12, costBase: 45000000, growth: 2.55, worldAtk: 0.8, attr: 'physique' },
                { id: 'abacus', name: '黄杨算盘', max: 12, costBase: 42000000, growth: 2.55, worldAtk: 0.5, worldHp: 0.3, attr: 'business' },
                { id: 'mirror', name: '照心铜镜', max: 12, costBase: 43000000, growth: 2.55, worldHp: 0.7, attr: 'charm' },
                { id: 'jade', name: '十八佩', max: 12, costBase: 55000000, growth: 2.6, worldAtk: 0.5, worldHp: 0.5, worldCritDmg: 0.5, needGen: 6 }
            ],
            claimHeirloom: { cost: 30000000, needAdult: true },
            // —— 子弟誓约（升级 12h）——
            oath: {
                types: [
                    { id: 'protect', name: '护族之誓', max: 10, costBase: 50000000, growth: 2.6, worldAtk: 0.9, worldHp: 0.5 },
                    { id: 'learn', name: '勤学之誓', max: 10, costBase: 48000000, growth: 2.6, worldCritDmg: 0.9 },
                    { id: 'kin', name: '悌亲之誓', max: 10, costBase: 48000000, growth: 2.6, worldHp: 1.0 },
                    { id: 'honest', name: '立信之誓', max: 10, costBase: 50000000, growth: 2.6, worldAtk: 0.5, worldHp: 0.5, worldCritDmg: 0.4 }
                ]
            },
            // —— 围炉夜话 ——
            circle: [
                { id: 'old_tale', name: '听老人讲古', cost: 4000000, cd: 3 * HOUR_MS, mood: 6, fame: 2, intimacy: 1,
                  line: '炉火噼啪。{name}听得入神，连糖都忘了吃。' },
                { id: 'confess', name: '说说今天', cost: 3000000, cd: 3 * HOUR_MS, mood: 5, intimacy: 2,
                  line: '{name}把今天的委屈说完，屋里的人都不说话，只添了一块炭。' },
                { id: 'plan', name: '商议明日', cost: 5000000, cd: 3 * HOUR_MS, mood: 3, fame: 2, attr: 'intelligence', gain: 1,
                  line: '炭火旁把明日事理了一遍。{name}点头，像把心也理顺了。' },
                { id: 'sing', name: '低声哼曲', cost: 3500000, cd: 3 * HOUR_MS, mood: 8, attr: 'charm', gain: 1,
                  line: '{name}哼走调的旧曲，全族却跟着拍膝。' }
            ],
            // —— 义仓（族级 12h）——
            granary: {
                maxLv: 16,
                costBase: 88000000,
                growth: 2.65,
                per: { atk: 0.9, hp: 1.4, crit: 0.7 },
                donate: [
                    { id: 'grain', name: '捐粮', cost: 15000000, cd: 4 * HOUR_MS, mood: 4, fame: 3, worldHp: 0.25 },
                    { id: 'cloth', name: '捐衣', cost: 18000000, cd: 4 * HOUR_MS, mood: 5, fame: 3, worldHp: 0.3 },
                    { id: 'silver', name: '捐银备荒', cost: 40000000, cd: 6 * HOUR_MS, mood: 3, fame: 6, worldAtk: 0.3, worldHp: 0.4 }
                ]
            },
            // —— 心事匣 ——
            heartBox: [
                { id: 'worry', name: '写入忧愁', cost: 2500000, cd: 3 * HOUR_MS, mood: 4, sleep: 3,
                  line: '{name}把忧愁写进匣子，盖上盖，像把石头放轻了。' },
                { id: 'wish', name: '写入愿望', cost: 4000000, cd: 4 * HOUR_MS, mood: 6, fame: 1,
                  line: '{name}写下一句不敢说出口的愿望，墨迹未干就合上了。' },
                { id: 'thanks', name: '写入感谢', cost: 3000000, cd: 3 * HOUR_MS, mood: 7, intimacy: 1,
                  line: '{name}写「谢谢你们还在」，写完自己先红了眼。' },
                { id: 'open_year', name: '岁末开匣', cost: 15000000, cd: CD_12H, mood: 12, fame: 8, attrAll: 1, worldHp: 0.8,
                  line: '匣子打开。旧纸翻飞。{name}笑着哭，哭着又笑。' }
            ],
            // —— 长辈传艺 ——
            elderTeach: [
                { id: 'fist', name: '传拳', cost: 15000000, cd: 5 * HOUR_MS, needAdultMentor: true, attr: 'physique', gain: 3, fame: 4,
                  line: '长辈把{name}的手腕摆正：「力从脚起，心不要飘。」' },
                { id: 'ledger', name: '传账', cost: 16000000, cd: 5 * HOUR_MS, needAdultMentor: true, attr: 'business', gain: 3, fame: 4,
                  line: '长辈指着旧账：「银子会说话，人也要听得懂。」' },
                { id: 'poetry', name: '传诗', cost: 14000000, cd: 5 * HOUR_MS, needAdultMentor: true, attr: 'intelligence', gain: 3, fame: 4,
                  line: '长辈念一句，{name}和一句。灯花落了也不觉。' },
                { id: 'etiquette', name: '传礼', cost: 13000000, cd: 5 * HOUR_MS, needAdultMentor: true, attr: 'charm', gain: 3, fame: 3,
                  line: '长辈示范一揖。{name}学了三遍，第四遍才像样。' }
            ],
            // —— 成长丰碑（达成式）——
            monuments: [
                { id: 'first_job', name: '初入生计碑', cost: 40000000, needAdult: true, atk: 1.5, hp: 1.5, crit: 1, fame: 10 },
                { id: 'first_teach', name: '初为人师碑', cost: 50000000, needAdult: true, needTeach: true, atk: 1.2, hp: 1.8, crit: 1.2, fame: 12 },
                { id: 'family_glory', name: '为族争光碑', cost: 80000000, needFame: 80, atk: 2.5, hp: 2.5, crit: 2, fame: 15 },
                { id: 'deep_gen', name: '代远流长碑', cost: 120000000, needGen: 9, atk: 3, hp: 3, crit: 2.5, fame: 20 },
                { id: 'married_house', name: '成家立业碑', cost: 90000000, needMarried: true, atk: 2, hp: 3, crit: 1.5, fame: 14 }
            ],
            // —— 双人日常（成婚）——
            couple: [
                { id: 'walk', name: '并肩散步', cost: 5000000, cd: 3 * HOUR_MS, bond: 5, mood: 6,
                  line: '{name}与伴侣并肩走完半条巷，谁也不急着说话。' },
                { id: 'cook', name: '一同下厨', cost: 6000000, cd: 3 * HOUR_MS, bond: 6, mood: 7,
                  line: '灶火旺。{name}切菜，伴侣掌勺，锅沿溅了一点笑。' },
                { id: 'read', name: '对坐夜读', cost: 7000000, cd: 4 * HOUR_MS, bond: 5, mood: 4, attr: 'intelligence', gain: 1,
                  line: '一灯两影。{name}读到精彩处抬眼，正撞上对方的笑。' },
                { id: 'promise', name: '重温誓词', cost: 10000000, cd: 5 * HOUR_MS, bond: 10, mood: 8, fame: 3,
                  line: '{name}把当日誓词又说了一遍，声音比婚礼那天更稳。' }
            ],
            // —— 声望市（兑换）——
            fameShop: [
                { id: 'tonic', name: '补气散', fameCost: 20, fundsCost: 10000000, cd: 4 * HOUR_MS, mood: 8, sleep: 6, attrAll: 1 },
                { id: 'banner', name: '扬名小旗', fameCost: 35, fundsCost: 25000000, cd: 6 * HOUR_MS, worldAtk: 1.5, hours: 4 },
                { id: 'shield', name: '护宅香', fameCost: 35, fundsCost: 25000000, cd: 6 * HOUR_MS, worldHp: 1.5, hours: 4 },
                { id: 'insight', name: '通明茶', fameCost: 40, fundsCost: 30000000, cd: 6 * HOUR_MS, worldCritDmg: 1.5, hours: 4 },
                { id: 'family_feast', name: '小犒全族', fameCost: 50, fundsCost: 50000000, cd: 8 * HOUR_MS, mood: 15, fame: 5 }
            ]
        };

        var moreEvents = [
            { id: 'ethos_stone', title: '家风立碑', text: '有人提议把家风刻进石里，让十八代以后的人摸得到。',
              choices: [
                { label: '立碑升级', cost: 160000000, effect: 'sagaEthosReady', prestige: 24, worldHp: 5, worldAtk: 3 },
                { label: '先抄成册', cost: 50000000, effect: 'livingMood', amount: 8, prestige: 10 },
                { label: '以后再说', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'granary_call', title: '义仓告急', text: '邻里歉收，有人来借粮。仓里的灯晃了晃。',
              choices: [
                { label: '扩仓并赈', cost: 140000000, effect: 'sagaGranaryReady', prestige: 22, worldHp: 6 },
                { label: '量力捐一批', cost: 60000000, effect: 'sagaDonateBoost', prestige: 14 },
                { label: '婉拒，自顾不暇', cost: 0, effect: 'none', prestige: 1 }
              ]},
            { id: 'heirloom_dust', title: '旧物蒙尘', text: '箱底翻出旧砚、旧刀、旧佩。有人说该认主了。',
              choices: [
                { label: '择人认主', cost: 80000000, effect: 'sagaHeirloomReady', prestige: 18, worldCritDmg: 4 },
                { label: '先擦拭供奉', cost: 30000000, effect: 'livingMood', amount: 6, prestige: 8 },
                { label: '原样封存', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'gather_night', title: '夜开文会', text: '月色好。有人提议今晚不睡，开一场文会武集。',
              choices: [
                { label: '正式开集', cost: 70000000, effect: 'sagaGatherBoost', prestige: 16, worldAtk: 3, worldCritDmg: 3 },
                { label: '围炉聊聊即可', cost: 20000000, effect: 'livingMood', amount: 10, prestige: 8 },
                { label: '早睡养神', cost: 0, effect: 'novaSleepBoost', prestige: 6 }
              ]},
            { id: 'oath_day', title: '誓约日', text: '少年们在祠阶下举手发誓。风把袖子吹得猎猎响。',
              choices: [
                { label: '见证并加深誓约', cost: 100000000, effect: 'sagaOathReady', prestige: 20, worldAtk: 4, worldHp: 4 },
                { label: '赐糖鼓励', cost: 25000000, effect: 'livingMood', amount: 8, prestige: 9 },
                { label: '莫轻誓', cost: 0, effect: 'none', prestige: 3 }
              ]}
        ];
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'season2', name: '岁时有礼', desc: '完成岁时礼 2 次', need: 2, key: 'sagaSeason', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'craft1', name: '工坊进境', desc: '提升百艺 1 次', need: 1, key: 'sagaCraft', rewardPrestige: 20, rewardFunds: 10000000, rewardExp: 16 },
            { id: 'lecture1', name: '族学开讲', desc: '讲席 1 次', need: 1, key: 'sagaLecture', rewardPrestige: 15, rewardFunds: 6000000, rewardExp: 12 },
            { id: 'circle1', name: '围炉夜话', desc: '围炉 1 次', need: 1, key: 'sagaCircle', rewardPrestige: 12, rewardFunds: 4000000, rewardExp: 10 },
            { id: 'sagaUp1', name: '春秋营建', desc: '升级家风/义仓/传家宝/誓约 1 次', need: 1, key: 'sagaUp', rewardPrestige: 25, rewardFunds: 15000000, rewardExp: 20 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensureSagaData() {
        if (!player.children) return;
        installSagaConfig();
        if (!player.children.descSaga) {
            player.children.descSaga = {
                ethosLv: 0, ethosCd: 0, ethosReady: false,
                granaryLv: 0, granaryCd: 0, granaryReady: false,
                seasonCd: {}, lectureCd: {}, gatherCd: {}, inlawCd: {},
                circleCd: {}, heartCd: {}, donateCd: {}, shopCd: {},
                coupleCd: {}, elderCd: {},
                heirloomReady: false, oathReady: false, gatherBoost: false
            };
        }
        var d = player.children.descSaga;
        ['seasonCd', 'lectureCd', 'gatherCd', 'inlawCd', 'circleCd', 'heartCd', 'donateCd', 'shopCd', 'coupleCd', 'elderCd'].forEach(function (k) {
            if (!d[k] || typeof d[k] !== 'object') d[k] = {};
        });
        (player.children.children || []).forEach(function (m) {
            if (!m.saga) {
                m.saga = {
                    crafts: {}, craftCd: {},
                    heirlooms: {}, heirloomCd: {}, claimed: {},
                    oaths: {}, oathCd: {},
                    monuments: {},
                    teachCount: 0,
                    intimacy: 0
                };
            }
            var s = m.saga;
            if (!s.crafts) s.crafts = {};
            if (!s.craftCd) s.craftCd = {};
            if (!s.heirlooms) s.heirlooms = {};
            if (!s.heirloomCd) s.heirloomCd = {};
            if (!s.claimed) s.claimed = {};
            if (!s.oaths) s.oaths = {};
            if (!s.oathCd) s.oathCd = {};
            if (!s.monuments) s.monuments = {};
            if (s.teachCount == null) s.teachCount = 0;
            if (s.intimacy == null) s.intimacy = 0;
        });
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

    function addBond(m, n) {
        if (!m) return;
        if (m.maritalBond != null) m.maritalBond = (m.maritalBond || 0) + (n || 0);
        else if (m.bond != null) m.bond = (m.bond || 0) + (n || 0);
        else m.maritalBond = n || 0;
    }

    function addSleep(m, n) {
        if (!m.nova) m.nova = { sleep: 70 };
        m.nova.sleep = Math.max(0, Math.min(100, (m.nova.sleep || 70) + (n || 0)));
    }

    function addAttr(m, key, n) {
        if (!m.attributes) m.attributes = {};
        if (key === 'all' || key === 'attrAll') {
            ['physique', 'intelligence', 'business', 'charm'].forEach(function (k) {
                m.attributes[k] = (m.attributes[k] || 0) + (n || 0);
            });
            return;
        }
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

    function cdLeft(until) { return Math.max(0, (until || 0) - Date.now()); }
    function cdHint(until) {
        var left = cdLeft(until);
        if (left <= 0) return '';
        return '冷却 ' + Math.floor(left / 3600000) + '时' + Math.ceil((left % 3600000) / 60000) + '分';
    }

    function pay(cost) {
        if ((funds().funds || 0) < cost) {
            logAction('资金不足（需 ' + fmt(cost) + '）', 'error');
            return false;
        }
        funds().funds -= cost;
        return true;
    }

    function getMember(idx) {
        var list = player.children.children || [];
        if (idx < 0 || idx >= list.length) return null;
        return list[idx];
    }

    // ——— 家风碑 12h ———
    window.upgradeSagaEthos = function () {
        ensureSagaData();
        var conf = S().ethos;
        var d = player.children.descSaga;
        if ((d.ethosLv || 0) >= conf.maxLv) return logAction('家风碑已满级', 'info');
        if (memberCount() < (conf.needMembers || 0)) return logAction('族人不足', 'error');
        if (cdLeft(d.ethosCd) > 0 && !d.ethosReady) return logAction(cdHint(d.ethosCd), 'error');
        var cost = Math.floor(conf.costBase * Math.pow(conf.growth, d.ethosLv || 0));
        if (!pay(cost)) return;
        d.ethosLv = (d.ethosLv || 0) + 1;
        d.ethosCd = Date.now() + CD_12H;
        d.ethosReady = false;
        bump('sagaUp');
        pushDiary('家风碑升至第 ' + d.ethosLv + ' 层。石上多了一行字。');
        logAction('家风碑升至 Lv.' + d.ethosLv + '（下次升级 12h 冷却）', 'success');
        refreshUI();
    };

    // ——— 岁时 ———
    window.doSagaSeason = function (id, idx) {
        ensureSagaData();
        var act = (S().seasons || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        if (act.needAdult && !isAdult(m)) return logAction('需成年', 'error');
        var d = player.children.descSaga;
        var key = id + ':' + m.id;
        if (cdLeft(d.seasonCd[key]) > 0) return logAction(cdHint(d.seasonCd[key]), 'error');
        if (!pay(act.cost)) return;
        d.seasonCd[key] = Date.now() + act.cd;
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        if (act.attr) addAttr(m, act.attr, act.gain || 1);
        if (act.sleep) addSleep(m, act.sleep);
        addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 3);
        bump('sagaSeason');
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 百艺升级 12h ———
    window.upgradeSagaCraft = function (idx, craftId) {
        ensureSagaData();
        var m = getMember(idx);
        var craft = (S().crafts || []).find(function (x) { return x.id === craftId; });
        if (!m || !craft) return;
        var lv = m.saga.crafts[craftId] || 0;
        if (lv >= craft.max) return logAction(craft.name + '已满级', 'info');
        if (cdLeft(m.saga.craftCd[craftId]) > 0) return logAction(cdHint(m.saga.craftCd[craftId]), 'error');
        var cost = Math.floor(craft.costBase * Math.pow(craft.growth, lv));
        if (!pay(cost)) return;
        m.saga.crafts[craftId] = lv + 1;
        m.saga.craftCd[craftId] = Date.now() + CD_12H;
        if (craft.attr) addAttr(m, craft.attr, 1);
        addFame(m, 2);
        bump('sagaCraft');
        bump('sagaUp');
        var line = (craft.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line + '（' + craft.name + ' Lv.' + (lv + 1) + '）');
        logAction(m.name + ' 「' + craft.name + '」升至 Lv.' + (lv + 1) + '（12h 冷却）', 'success');
        refreshUI();
    };

    // ——— 讲席 ———
    window.doSagaLecture = function (id, idx) {
        ensureSagaData();
        var act = (S().lecture || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        if (act.needAdult && !isAdult(m)) return logAction('需成年开讲', 'error');
        var d = player.children.descSaga;
        var key = id + ':' + m.id;
        if (cdLeft(d.lectureCd[key]) > 0) return logAction(cdHint(d.lectureCd[key]), 'error');
        if (!pay(act.cost)) return;
        d.lectureCd[key] = Date.now() + act.cd;
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        if (act.attr) addAttr(m, act.attr, act.gain || 1);
        m.saga.teachCount = (m.saga.teachCount || 0) + 1;
        bump('sagaLecture');
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 文会武集 ———
    window.doSagaGather = function (id, idx) {
        ensureSagaData();
        var act = (S().gather || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        if (act.needAdult && !isAdult(m)) return logAction('需成年', 'error');
        if (memberCount() < (act.needMembers || 0)) return logAction('族人太少，开不成集', 'error');
        var d = player.children.descSaga;
        var key = id;
        if (cdLeft(d.gatherCd[key]) > 0 && !d.gatherBoost) return logAction(cdHint(d.gatherCd[key]), 'error');
        if (!pay(act.cost)) return;
        d.gatherCd[key] = Date.now() + act.cd;
        d.gatherBoost = false;
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        if (act.attr) addAttr(m, act.attr, act.gain || 1);
        addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 4);
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 姻亲 ———
    window.doSagaInlaw = function (id, idx) {
        ensureSagaData();
        var act = (S().inlaw || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        if (!isMarried(m)) return logAction('须成婚后方可走动姻亲', 'error');
        var d = player.children.descSaga;
        var key = id + ':' + m.id;
        if (cdLeft(d.inlawCd[key]) > 0) return logAction(cdHint(d.inlawCd[key]), 'error');
        if (!pay(act.cost)) return;
        d.inlawCd[key] = Date.now() + act.cd;
        addBond(m, act.bond || 0);
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 3);
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 传家宝 ———
    window.claimSagaHeirloom = function (idx, hid) {
        ensureSagaData();
        var m = getMember(idx);
        var h = (S().heirlooms || []).find(function (x) { return x.id === hid; });
        if (!m || !h) return;
        if (S().claimHeirloom.needAdult && !isAdult(m)) return logAction('须成年认主', 'error');
        if (h.needGen && maxGen() < h.needGen) return logAction('需触及第' + h.needGen + '代', 'error');
        if (m.saga.claimed[hid]) return logAction('已认主', 'info');
        var cost = S().claimHeirloom.cost;
        if (player.children.descSaga.heirloomReady) cost = Math.floor(cost * 0.5);
        if (!pay(cost)) return;
        m.saga.claimed[hid] = true;
        m.saga.heirlooms[hid] = 0;
        player.children.descSaga.heirloomReady = false;
        addFame(m, 5);
        pushDiary(m.name + ' 认主传家宝「' + h.name + '」。');
        logAction(m.name + ' 认主「' + h.name + '」', 'success');
        refreshUI();
    };

    window.upgradeSagaHeirloom = function (idx, hid) {
        ensureSagaData();
        var m = getMember(idx);
        var h = (S().heirlooms || []).find(function (x) { return x.id === hid; });
        if (!m || !h) return;
        if (!m.saga.claimed[hid]) return logAction('请先认主', 'error');
        var lv = m.saga.heirlooms[hid] || 0;
        if (lv >= h.max) return logAction('已满级', 'info');
        if (cdLeft(m.saga.heirloomCd[hid]) > 0) return logAction(cdHint(m.saga.heirloomCd[hid]), 'error');
        var cost = Math.floor(h.costBase * Math.pow(h.growth, lv));
        if (!pay(cost)) return;
        m.saga.heirlooms[hid] = lv + 1;
        m.saga.heirloomCd[hid] = Date.now() + CD_12H;
        if (h.attr) addAttr(m, h.attr, 1);
        bump('sagaUp');
        logAction(m.name + ' 「' + h.name + '」祭炼至 Lv.' + (lv + 1) + '（12h）', 'success');
        refreshUI();
    };

    // ——— 誓约 12h ———
    window.upgradeSagaOath = function (idx, oid) {
        ensureSagaData();
        var m = getMember(idx);
        var o = (S().oath.types || []).find(function (x) { return x.id === oid; });
        if (!m || !o) return;
        if (!isAdult(m)) return logAction('须成年立誓', 'error');
        var lv = m.saga.oaths[oid] || 0;
        if (lv >= o.max) return logAction('誓约已满', 'info');
        var ready = player.children.descSaga.oathReady;
        if (cdLeft(m.saga.oathCd[oid]) > 0 && !ready) return logAction(cdHint(m.saga.oathCd[oid]), 'error');
        var cost = Math.floor(o.costBase * Math.pow(o.growth, lv));
        if (!pay(cost)) return;
        m.saga.oaths[oid] = lv + 1;
        m.saga.oathCd[oid] = Date.now() + CD_12H;
        player.children.descSaga.oathReady = false;
        addFame(m, 3);
        bump('sagaUp');
        pushDiary(m.name + ' 加深「' + o.name + '」至 Lv.' + (lv + 1) + '。');
        logAction(m.name + ' 「' + o.name + '」Lv.' + (lv + 1) + '（12h）', 'success');
        refreshUI();
    };

    // ——— 围炉 ———
    window.doSagaCircle = function (id, idx) {
        ensureSagaData();
        var act = (S().circle || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        var d = player.children.descSaga;
        var key = id + ':' + m.id;
        if (cdLeft(d.circleCd[key]) > 0) return logAction(cdHint(d.circleCd[key]), 'error');
        if (!pay(act.cost)) return;
        d.circleCd[key] = Date.now() + act.cd;
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        if (act.attr) addAttr(m, act.attr, act.gain || 1);
        m.saga.intimacy = (m.saga.intimacy || 0) + (act.intimacy || 0);
        bump('sagaCircle');
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 义仓 ———
    window.upgradeSagaGranary = function () {
        ensureSagaData();
        var conf = S().granary;
        var d = player.children.descSaga;
        if ((d.granaryLv || 0) >= conf.maxLv) return logAction('义仓已满级', 'info');
        if (cdLeft(d.granaryCd) > 0 && !d.granaryReady) return logAction(cdHint(d.granaryCd), 'error');
        var cost = Math.floor(conf.costBase * Math.pow(conf.growth, d.granaryLv || 0));
        if (!pay(cost)) return;
        d.granaryLv = (d.granaryLv || 0) + 1;
        d.granaryCd = Date.now() + CD_12H;
        d.granaryReady = false;
        bump('sagaUp');
        pushDiary('义仓扩至 Lv.' + d.granaryLv + '。仓门更宽了。');
        logAction('义仓升至 Lv.' + d.granaryLv + '（12h）', 'success');
        refreshUI();
    };

    window.doSagaDonate = function (id) {
        ensureSagaData();
        var act = (S().granary.donate || []).find(function (x) { return x.id === id; });
        if (!act) return;
        var d = player.children.descSaga;
        if (cdLeft(d.donateCd[id]) > 0) return logAction(cdHint(d.donateCd[id]), 'error');
        if (!pay(act.cost)) return;
        d.donateCd[id] = Date.now() + act.cd;
        addMood(act.mood || 0);
        addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 3);
        (player.children.children || []).slice(0, 3).forEach(function (m) { addFame(m, act.fame || 0); });
        pushDiary('族中「' + act.name + '」，义仓又厚了一分。');
        logAction(act.name + ' 完成', 'success');
        refreshUI();
    };

    // ——— 心事匣 ———
    window.doSagaHeart = function (id, idx) {
        ensureSagaData();
        var act = (S().heartBox || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        var d = player.children.descSaga;
        var key = id + ':' + m.id;
        if (cdLeft(d.heartCd[key]) > 0) return logAction(cdHint(d.heartCd[key]), 'error');
        if (!pay(act.cost)) return;
        d.heartCd[key] = Date.now() + act.cd;
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        if (act.sleep) addSleep(m, act.sleep);
        if (act.attrAll) addAttr(m, 'all', act.attrAll);
        if (act.intimacy) m.saga.intimacy = (m.saga.intimacy || 0) + act.intimacy;
        addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 3);
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 长辈传艺 ———
    window.doSagaElderTeach = function (id, pupilIdx, mentorIdx) {
        ensureSagaData();
        var act = (S().elderTeach || []).find(function (x) { return x.id === id; });
        var pupil = getMember(pupilIdx);
        var mentor = getMember(mentorIdx);
        if (!act || !pupil || !mentor) return;
        if (pupil.id === mentor.id) return logAction('传艺双方不能是同一人', 'error');
        if (act.needAdultMentor && !isAdult(mentor)) return logAction('师父须成年', 'error');
        var d = player.children.descSaga;
        var key = id + ':' + pupil.id;
        if (cdLeft(d.elderCd[key]) > 0) return logAction(cdHint(d.elderCd[key]), 'error');
        if (!pay(act.cost)) return;
        d.elderCd[key] = Date.now() + act.cd;
        if (act.attr) addAttr(pupil, act.attr, act.gain || 1);
        addFame(pupil, act.fame || 0);
        addFame(mentor, Math.floor((act.fame || 0) / 2) || 1);
        mentor.saga.teachCount = (mentor.saga.teachCount || 0) + 1;
        var line = (act.line || '').replace(/\{name\}/g, pupil.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 丰碑 ———
    window.claimSagaMonument = function (idx, mid) {
        ensureSagaData();
        var m = getMember(idx);
        var mon = (S().monuments || []).find(function (x) { return x.id === mid; });
        if (!m || !mon) return;
        if (m.saga.monuments[mid]) return logAction('已立此碑', 'info');
        if (mon.needAdult && !isAdult(m)) return logAction('须成年', 'error');
        if (mon.needMarried && !isMarried(m)) return logAction('须成婚', 'error');
        if (mon.needFame && (m.descFame || 0) < mon.needFame) return logAction('声望不足（需' + mon.needFame + '）', 'error');
        if (mon.needGen && (m.generation || 1) < mon.needGen && maxGen() < mon.needGen) return logAction('代数不足', 'error');
        if (mon.needTeach && (m.saga.teachCount || 0) < 1) return logAction('须先有讲席/传艺经历', 'error');
        if (!pay(mon.cost)) return;
        m.saga.monuments[mid] = true;
        addFame(m, mon.fame || 0);
        pushDiary(m.name + ' 立下「' + mon.name + '」。');
        logAction(m.name + ' 立碑：' + mon.name, 'success');
        refreshUI();
    };

    // ——— 双人日常 ———
    window.doSagaCouple = function (id, idx) {
        ensureSagaData();
        var act = (S().couple || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        if (!isMarried(m)) return logAction('须成婚后可进行双人日常', 'error');
        var d = player.children.descSaga;
        var key = id + ':' + m.id;
        if (cdLeft(d.coupleCd[key]) > 0) return logAction(cdHint(d.coupleCd[key]), 'error');
        if (!pay(act.cost)) return;
        d.coupleCd[key] = Date.now() + act.cd;
        addBond(m, act.bond || 0);
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        if (act.attr) addAttr(m, act.attr, act.gain || 1);
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 声望市 ———
    window.buySagaFameShop = function (id, idx) {
        ensureSagaData();
        var item = (S().fameShop || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!item || !m) return;
        var d = player.children.descSaga;
        if (cdLeft(d.shopCd[id]) > 0) return logAction(cdHint(d.shopCd[id]), 'error');
        if ((m.descFame || 0) < item.fameCost) return logAction('个人声望不足', 'error');
        if (!pay(item.fundsCost)) return;
        m.descFame -= item.fameCost;
        d.shopCd[id] = Date.now() + item.cd;
        addMood(item.mood || 0);
        if (item.sleep) addSleep(m, item.sleep);
        if (item.attrAll) addAttr(m, 'all', item.attrAll);
        if (item.fame) addFame(m, item.fame);
        if (item.worldAtk || item.worldHp || item.worldCritDmg) {
            addTempWorld(item.worldAtk, item.worldHp, item.worldCritDmg, item.hours || 4);
        }
        logAction(m.name + ' 兑换「' + item.name + '」', 'success');
        refreshUI();
    };

    function calcSagaWorld() {
        ensureSagaData();
        var atk = 0, hp = 0, crit = 0;
        var d = player.children.descSaga;
        var eth = S().ethos;
        var el = d.ethosLv || 0;
        atk += el * (eth.per.atk || 0);
        hp += el * (eth.per.hp || 0);
        crit += el * (eth.per.crit || 0);

        var g = S().granary;
        var gl = d.granaryLv || 0;
        atk += gl * (g.per.atk || 0);
        hp += gl * (g.per.hp || 0);
        crit += gl * (g.per.crit || 0);

        (player.children.children || []).forEach(function (m) {
            if (!m.saga) return;
            (S().crafts || []).forEach(function (c) {
                var lv = m.saga.crafts[c.id] || 0;
                atk += lv * (c.worldAtk || 0);
                hp += lv * (c.worldHp || 0);
                crit += lv * (c.worldCritDmg || 0);
            });
            (S().heirlooms || []).forEach(function (h) {
                var lv = m.saga.heirlooms[h.id] || 0;
                atk += lv * (h.worldAtk || 0);
                hp += lv * (h.worldHp || 0);
                crit += lv * (h.worldCritDmg || 0);
            });
            (S().oath.types || []).forEach(function (o) {
                var lv = m.saga.oaths[o.id] || 0;
                atk += lv * (o.worldAtk || 0);
                hp += lv * (o.worldHp || 0);
                crit += lv * (o.worldCritDmg || 0);
            });
            (S().monuments || []).forEach(function (mon) {
                if (m.saga.monuments[mon.id]) {
                    atk += mon.atk || 0;
                    hp += mon.hp || 0;
                    crit += mon.crit || 0;
                }
            });
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        ensureSagaData();
        var base = _origBonus ? _origBonus() : { worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var w = calcSagaWorld();
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
            ensureSagaData();
            var d = player.children.descSaga;
            if (ch.effect === 'sagaEthosReady') d.ethosReady = true;
            else if (ch.effect === 'sagaGranaryReady') d.granaryReady = true;
            else if (ch.effect === 'sagaHeirloomReady') d.heirloomReady = true;
            else if (ch.effect === 'sagaOathReady') d.oathReady = true;
            else if (ch.effect === 'sagaGatherBoost') d.gatherBoost = true;
            else if (ch.effect === 'sagaDonateBoost') {
                addMood(10);
                (player.children.children || []).forEach(function (m) { addFame(m, 2); });
            }
            return result;
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }
    function opts(filterFn) {
        return (player.children.children || []).map(function (m, i) {
            if (filterFn && !filterFn(m)) return '';
            return '<option value="' + i + '">' + m.name + '（' + genLabel(m.generation || 1) +
                (isMarried(m) ? '·婚' : '') + '·望' + (m.descFame || 0) + '）</option>';
        }).join('');
    }

    function updateSagaEthosPanel() {
        var box = el('sagaEthosPanel');
        if (!box) return;
        ensureSagaData();
        var d = player.children.descSaga;
        var eCost = Math.floor(S().ethos.costBase * Math.pow(S().ethos.growth, d.ethosLv || 0));
        var gCost = Math.floor(S().granary.costBase * Math.pow(S().granary.growth, d.granaryLv || 0));
        var tag = function (cost) {
            return typeof lineageCostTag === 'function' ? lineageCostTag(cost, '12h') : ('（' + fmt(cost) + '）');
        };
        box.innerHTML = '<div class="c-hint">家风碑 Lv.' + (d.ethosLv || 0) + ' · 下级 <b style="color:#FFD700;">' + fmt(eCost) + '</b>' +
            (cdHint(d.ethosCd) ? ' · ' + cdHint(d.ethosCd) : '') +
            (d.ethosReady ? ' · 轶事免冷却就绪' : '') + '</div>' +
            '<button class="c-btn c-btn-gold" style="width:100%;" onclick="upgradeSagaEthos()">升级家风碑' + tag(eCost) + '</button>' +
            '<div class="c-hint" style="margin-top:10px;">义仓 Lv.' + (d.granaryLv || 0) + ' · 下级 <b style="color:#FFD700;">' + fmt(gCost) + '</b>' +
            (cdHint(d.granaryCd) ? ' · ' + cdHint(d.granaryCd) : '') + '</div>' +
            '<button class="c-btn c-btn-orange" style="width:100%;margin-top:4px;" onclick="upgradeSagaGranary()">升级义仓' + tag(gCost) + '</button>' +
            '<div class="c-train-grid" style="margin-top:8px;">' + (S().granary.donate || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<div class="ms-desc">' + (typeof lineageMsCost === 'function' ? lineageMsCost(a.cost) : ('耗资 ' + fmt(a.cost || 0))) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="doSagaDonate(\'' + a.id + '\')">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateSagaSeasonCraftPanel() {
        var box = el('sagaSeasonCraftPanel');
        if (!box) return;
        ensureSagaData();
        box.innerHTML = '<div class="c-form-row"><label>子弟</label><select id="sagaScMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">岁时礼</h4><div class="c-train-grid">' + (S().seasons || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doSagaSeason(\'' + a.id + '\',+document.getElementById(\'sagaScMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">工坊百艺（升级 12h）</h4><div class="c-train-grid">' + (S().crafts || []).map(function (c) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + c.name + '</div>' +
                    '<div class="ms-desc">下级约 ' + fmt(c.costBase) + ' 起 · 随等级递增</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="upgradeSagaCraft(+document.getElementById(\'sagaScMember\').value,\'' + c.id + '\')">进「' + c.name + '」</button></div>';
            }).join('') + '</div>';
    }

    function updateSagaSocialPanel() {
        var box = el('sagaSocialPanel');
        if (!box) return;
        ensureSagaData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="sagaSocialMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">族学讲席</h4><div class="c-train-grid">' + (S().lecture || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doSagaLecture(\'' + a.id + '\',+document.getElementById(\'sagaSocialMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">文会 · 武集</h4><div class="c-train-grid">' + (S().gather || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" onclick="doSagaGather(\'' + a.id + '\',+document.getElementById(\'sagaSocialMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">姻亲走动（成婚）</h4><div class="c-train-grid">' + (S().inlaw || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doSagaInlaw(\'' + a.id + '\',+document.getElementById(\'sagaSocialMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateSagaTreasurePanel() {
        var box = el('sagaTreasurePanel');
        if (!box) return;
        ensureSagaData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="sagaTreasureMember" class="c-input">' + opts(isAdult) + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">传家宝</h4><div class="c-train-grid">' + (S().heirlooms || []).map(function (h) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + h.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-purple" onclick="claimSagaHeirloom(+document.getElementById(\'sagaTreasureMember\').value,\'' + h.id + '\')">认主</button>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" style="margin-top:4px;" onclick="upgradeSagaHeirloom(+document.getElementById(\'sagaTreasureMember\').value,\'' + h.id + '\')">祭炼（12h）</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">子弟誓约（12h）</h4><div class="c-train-grid">' + (S().oath.types || []).map(function (o) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + o.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" onclick="upgradeSagaOath(+document.getElementById(\'sagaTreasureMember\').value,\'' + o.id + '\')">加深誓约</button></div>';
            }).join('') + '</div>';
    }

    function updateSagaHeartPanel() {
        var box = el('sagaHeartPanel');
        if (!box) return;
        ensureSagaData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="sagaHeartMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">围炉夜话</h4><div class="c-train-grid">' + (S().circle || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doSagaCircle(\'' + a.id + '\',+document.getElementById(\'sagaHeartMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">心事匣</h4><div class="c-train-grid">' + (S().heartBox || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doSagaHeart(\'' + a.id + '\',+document.getElementById(\'sagaHeartMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateSagaLifePanel() {
        var box = el('sagaLifePanel');
        if (!box) return;
        ensureSagaData();
        box.innerHTML = '<div class="c-form-row"><label>徒弟</label><select id="sagaPupil" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-form-row"><label>长辈</label><select id="sagaMentor" class="c-input">' + opts(isAdult) + '</select></div>' +
            '<div class="c-train-grid">' + (S().elderTeach || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="doSagaElderTeach(\'' + a.id + '\',+document.getElementById(\'sagaPupil\').value,+document.getElementById(\'sagaMentor\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">成长丰碑</h4>' +
            '<div class="c-form-row"><label>立碑人</label><select id="sagaMonMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-train-grid">' + (S().monuments || []).map(function (mon) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + mon.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-purple" onclick="claimSagaMonument(+document.getElementById(\'sagaMonMember\').value,\'' + mon.id + '\')">立碑</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">双人日常（成婚）</h4>' +
            '<div class="c-form-row"><label>成员</label><select id="sagaCoupleMember" class="c-input">' + opts(isMarried) + '</select></div>' +
            '<div class="c-train-grid">' + (S().couple || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doSagaCouple(\'' + a.id + '\',+document.getElementById(\'sagaCoupleMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">声望市</h4>' +
            '<div class="c-form-row"><label>兑换人</label><select id="sagaShopMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-train-grid">' + (S().fameShop || []).map(function (item) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + item.name + '</div><div class="ms-desc">声望 ' + item.fameCost + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="buySagaFameShop(\'' + item.id + '\',+document.getElementById(\'sagaShopMember\').value)">兑换</button></div>';
            }).join('') + '</div>';
    }

    window.updateDescSagaPanels = function () {
        installSagaConfig();
        ensureSagaData();
        updateSagaEthosPanel();
        updateSagaSeasonCraftPanel();
        updateSagaSocialPanel();
        updateSagaTreasurePanel();
        updateSagaHeartPanel();
        updateSagaLifePanel();
    };

    // 不再从万象 / living 级联刷新春秋；由 refreshActiveChildTabPanels 按页签刷新

    var _origSwitch = window.switchChildTab;
    window.switchChildTab = function (tab) {
        if (_origSwitch) _origSwitch(tab);
        var node = document.getElementById('childSectionDescSaga');
        if (node) node.classList.toggle('active', tab === 'descsaga');
    };

    installSagaConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            installSagaConfig();
            ensureSagaData();
        }, 2700);
    });
    if (document.readyState !== 'loading') {
        setTimeout(function () {
            installSagaConfig();
            ensureSagaData();
        }, 2700);
    }
})();

/**
 * 家族传承 · 子弟流年
 * 节气功课、时辰作息、私房账本、市井传闻、结义金兰、远行驿站、夜巡、秘技、先祖残影、文社武馆段位、消息网、灾后重建、传火、姻缘线…
 * 在 descendants-chronicle.js 之后加载；升级类默认 12 小时冷却。不改变婚育门禁。
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
        return !!(m && (m.isMarried || m.married || m.spouseId || m.spouseName || (m.spouse && m.spouse.name)));
    }
    function F() { return (cfg() && cfg().descFlow) || {}; }
    function genLabel(g) {
        return typeof getGenerationLabel === 'function' ? getGenerationLabel(g) : ('第' + g + '代');
    }

    function installFlowConfig() {
        if (!window.lineageExtConfig) return;
        var c = window.lineageExtConfig;
        if (c._descFlowInstalled) return;
        c._descFlowInstalled = true;

        c.descFlow = {
            upgradeCd: CD_12H,
            // —— 流年台（族级 12h）——
            pavilion: {
                maxLv: 16,
                costBase: 92000000,
                growth: 2.7,
                per: { atk: 1.05, hp: 1.15, crit: 0.95 },
                needMembers: 2
            },
            // —— 消息网（族级 12h）——
            network: {
                maxLv: 14,
                costBase: 80000000,
                growth: 2.65,
                per: { atk: 0.9, hp: 0.7, crit: 1.1 }
            },
            // —— 节气功课 ——
            jieqi: [
                { id: 'lichun', name: '立春迎新', cost: 4000000, cd: 4 * HOUR_MS, mood: 5, attr: 'charm', gain: 1,
                  line: '{name}在立春日开窗，风里有青草气。' },
                { id: 'jingzhe', name: '惊蛰醒神', cost: 4500000, cd: 4 * HOUR_MS, mood: 4, attr: 'physique', gain: 1,
                  line: '{name}听见第一声雷，把拳头握紧又松开。' },
                { id: 'guyu', name: '谷雨润田', cost: 5000000, cd: 4 * HOUR_MS, mood: 5, attr: 'business', gain: 1, worldHp: 0.2,
                  line: '{name}踩着泥去看田，裤脚湿了也不恼。' },
                { id: 'xiazhi', name: '夏至静心', cost: 5500000, cd: 4 * HOUR_MS, mood: 3, attr: 'intelligence', gain: 2, sleep: 3,
                  line: '{name}在最长的白昼里读书，汗湿了袖口。' },
                { id: 'liqiu', name: '立秋收心', cost: 5000000, cd: 4 * HOUR_MS, mood: 4, fame: 2,
                  line: '{name}说秋天来了，要把夏天的躁收一收。' },
                { id: 'hanlu', name: '寒露添衣', cost: 4500000, cd: 4 * HOUR_MS, mood: 6, attr: 'charm', gain: 1,
                  line: '{name}给长辈添衣，自己却把领子敞着吹风。' },
                { id: 'dongzhi2', name: '冬至数九', cost: 6000000, cd: 5 * HOUR_MS, mood: 7, fame: 3, worldAtk: 0.25,
                  line: '{name}在墙上画下一道，说「九九之后就是春」。' },
                { id: 'dahan', name: '大寒围炉', cost: 7000000, cd: 5 * HOUR_MS, mood: 8, sleep: 5, fame: 2,
                  line: '{name}把炭拨旺，全族的影子叠在墙上。' }
            ],
            // —— 时辰作息 ——
            shichen: [
                { id: 'mao', name: '卯时起身', cost: 2000000, cd: 3 * HOUR_MS, mood: 2, attr: 'physique', gain: 1,
                  line: '{name}在卯时起来，院里只有鸡叫和自己的哈欠。' },
                { id: 'si', name: '巳时习字', cost: 3000000, cd: 3 * HOUR_MS, mood: 3, attr: 'intelligence', gain: 1,
                  line: '{name}把字写到腕酸，墨香盖过瞌睡。' },
                { id: 'wu', name: '午时小憩', cost: 1500000, cd: 3 * HOUR_MS, mood: 4, sleep: 8,
                  line: '{name}午睡片刻，醒来世界清了一寸。' },
                { id: 'you', name: '酉时练拳', cost: 3500000, cd: 3 * HOUR_MS, mood: 3, attr: 'physique', gain: 2,
                  line: '{name}在暮色里打完一套，汗落成星。' },
                { id: 'hai', name: '亥时收心', cost: 2500000, cd: 3 * HOUR_MS, mood: 5, sleep: 6, attr: 'intelligence', gain: 1,
                  line: '{name}吹灭灯前，把明天要做的事默念一遍。' }
            ],
            // —— 私房账本 ——
            purse: {
                saveActs: [
                    { id: 'penny', name: '积一文', cost: 3000000, cd: 3 * HOUR_MS, purse: 1, mood: 2,
                      line: '{name}把一文钱放进匣子，盖子响得很轻。' },
                    { id: 'batch', name: '存一笔', cost: 15000000, cd: 5 * HOUR_MS, purse: 5, mood: 3, fame: 1,
                      line: '{name}把一笔银子悄悄存下，说「以备不时」。' }
                ],
                spendActs: [
                    { id: 'treat', name: '请族人一餐', purseNeed: 3, mood: 8, fame: 3, worldHp: 0.3,
                      line: '{name}掏私房请客，桌上热闹，匣子空了一点，心却满。' },
                    { id: 'gift_elder', name: '孝敬长辈', purseNeed: 4, mood: 6, fame: 4, filial: 5,
                      line: '{name}把私房换成礼，长辈笑得眼睛弯。' },
                    { id: 'invest', name: '小本试水', purseNeed: 6, attr: 'business', gain: 2, fame: 3, worldAtk: 0.35,
                      line: '{name}用私房试了一笔小生意，赚得不多，胆却大了。' }
                ],
                upgrade: {
                    maxLv: 12,
                    costBase: 40000000,
                    growth: 2.55,
                    perPurseCap: 2,
                    perWorld: { atk: 0.35, hp: 0.35, crit: 0.3 }
                }
            },
            // —— 市井传闻 ——
            rumors: [
                { id: 'price', name: '听行情', cost: 4000000, cd: 3 * HOUR_MS, rumor: 1, attr: 'business', gain: 1,
                  line: '{name}在茶馆听行情，耳朵比嘴忙。' },
                { id: 'gossip', name: '听闲话', cost: 2500000, cd: 3 * HOUR_MS, rumor: 1, mood: 3,
                  line: '{name}听完闲话，决定一件都不当真——又忍不住想。' },
                { id: 'secret', name: '探秘闻', cost: 12000000, cd: 5 * HOUR_MS, rumor: 3, fame: 3, attr: 'intelligence', gain: 1,
                  line: '{name}探到一则秘闻，装进心里，比装进口袋更沉。' },
                { id: 'compile', name: '编传闻册', cost: 35000000, cd: CD_12H, rumorNeed: 8, fame: 8, worldCritDmg: 0.8, worldAtk: 0.4,
                  line: '{name}把传闻编成册。真假参半，却照见人心。' }
            ],
            // —— 结义金兰 ——
            sworn: [
                { id: 'toast', name: '对饮结义', cost: 20000000, cd: 6 * HOUR_MS, needAdult: true, bond: 8, fame: 5, mood: 6,
                  line: '{name}与同辈对饮，酒薄意厚，称一声「兄弟/姐妹」。' },
                { id: 'token', name: '换信物', cost: 30000000, cd: 8 * HOUR_MS, needAdult: true, bond: 12, fame: 6,
                  line: '信物入手。{name}把它藏进贴身处，像藏住一句誓言。' },
                { id: 'aid', name: '结义相助', cost: 25000000, cd: 6 * HOUR_MS, needAdult: true, bond: 6, fame: 4, attr: 'physique', gain: 2,
                  line: '{name}为结义之人出了一把力，回来袖口破了，笑着。' },
                { id: 'hall', name: '立金兰簿', cost: 80000000, cd: CD_12H, needAdult: true, needMembers: 3, fame: 12, worldAtk: 1, worldHp: 1,
                  line: '金兰簿翻开第一页。墨未干，情已定。' }
            ],
            // —— 远行驿站 ——
            post: [
                { id: 'courier', name: '送信一程', cost: 8000000, cd: 4 * HOUR_MS, needAdult: true, attr: 'physique', gain: 2, fame: 2,
                  line: '{name}把信送到，脚底起泡，心里却踏实。' },
                { id: 'escort', name: '护商半日', cost: 20000000, cd: 5 * HOUR_MS, needAdult: true, attr: 'physique', gain: 2, fame: 4, worldAtk: 0.35,
                  line: '{name}护着货走半日，尘土里学会了警惕。' },
                { id: 'trade_post', name: '驿站议价', cost: 25000000, cd: 5 * HOUR_MS, needAdult: true, attr: 'business', gain: 3, fame: 4,
                  line: '{name}在驿站把价钱谈到双方都骂、双方都成交。' },
                { id: 'long_road', name: '千里归乡', cost: 50000000, cd: 8 * HOUR_MS, needAdult: true, fame: 8, mood: 10, worldHp: 0.6, worldAtk: 0.4,
                  line: '{name}从远处回来，第一件事是摸摸祠堂的门环。' }
            ],
            // —— 夜巡 ——
            patrol: [
                { id: 'yard', name: '巡院', cost: 3500000, cd: 3 * HOUR_MS, attr: 'physique', gain: 1, fame: 1,
                  line: '{name}提灯巡院，猫跟了一路。' },
                { id: 'lane', name: '巡巷', cost: 5000000, cd: 4 * HOUR_MS, attr: 'physique', gain: 2, fame: 2,
                  line: '{name}在巷口停住，确认那声响只是风。' },
                { id: 'gate', name: '守更', cost: 6000000, cd: 4 * HOUR_MS, attr: 'physique', gain: 2, fame: 3, worldAtk: 0.25,
                  line: '{name}守到三更，灯油尽了，心没尽。' },
                { id: 'route', name: '开辟巡线', cost: 45000000, cd: CD_12H, fame: 8, worldAtk: 0.9, worldHp: 0.5, needAdult: true,
                  line: '新巡线画在图上。{name}的脚印，将把它走实。' }
            ],
            // —— 家传秘技（升级 12h）——
            secrets: [
                { id: 'fist', name: '家传拳路', max: 12, costBase: 38000000, growth: 2.5, attr: 'physique', worldAtk: 0.55 },
                { id: 'rx', name: '家传药方', max: 12, costBase: 40000000, growth: 2.5, attr: 'intelligence', worldHp: 0.6 },
                { id: 'ledger', name: '家传账法', max: 12, costBase: 39000000, growth: 2.5, attr: 'business', worldAtk: 0.4, worldHp: 0.25 },
                { id: 'song', name: '家传曲调', max: 12, costBase: 36000000, growth: 2.5, attr: 'charm', worldCritDmg: 0.5 },
                { id: 'eighteen', name: '十八息法', max: 12, costBase: 55000000, growth: 2.6, attr: 'physique', worldAtk: 0.45, worldHp: 0.45, worldCritDmg: 0.45, needGen: 6 }
            ],
            // —— 先祖残影 ——
            echo: [
                { id: 'listen', name: '静听残影', cost: 10000000, cd: 5 * HOUR_MS, mood: 5, fame: 3, attr: 'intelligence', gain: 1,
                  line: '{name}听见一声很旧的叹息，像从牌位缝里漏出来。' },
                { id: 'ask', name: '问一句旧事', cost: 18000000, cd: 6 * HOUR_MS, fame: 5, mood: 4, worldCritDmg: 0.3,
                  line: '{name}问了一句，残影没有回答——却把灯拨亮了。' },
                { id: 'offer', name: '奉一盏影灯', cost: 25000000, cd: 6 * HOUR_MS, fame: 6, worldHp: 0.5, mood: 6,
                  line: '{name}添了影灯。影子摇了一摇，像点头。' },
                { id: 'deep', name: '深入残影', cost: 60000000, cd: 8 * HOUR_MS, fame: 10, needGen: 5, worldAtk: 0.7, worldHp: 0.7, worldCritDmg: 0.7,
                  line: '{name}走进残影深处，看见自己的脸，也看见十八代以前的脸。' }
            ],
            // —— 文社 / 武馆段位 ——
            ranks: {
                wen: [
                    { id: 'w1', name: '文社记名', cost: 15000000, needFame: 10, atk: 0.5, crit: 0.6 },
                    { id: 'w2', name: '文社秀士', cost: 40000000, needFame: 40, atk: 1.2, crit: 1.2 },
                    { id: 'w3', name: '文社祭酒', cost: 100000000, needFame: 100, atk: 2.5, crit: 2.5 },
                    { id: 'w4', name: '流年文宗', cost: 250000000, needFame: 200, atk: 4, crit: 4, needGen: 6 }
                ],
                wu: [
                    { id: 'u1', name: '武馆记名', cost: 15000000, needFame: 10, atk: 0.8, hp: 0.5 },
                    { id: 'u2', name: '武馆教习', cost: 45000000, needFame: 45, atk: 1.8, hp: 1.2 },
                    { id: 'u3', name: '武馆馆主助', cost: 110000000, needFame: 110, atk: 3, hp: 2.5 },
                    { id: 'u4', name: '流年武宗', cost: 260000000, needFame: 210, atk: 5, hp: 4, needGen: 6 }
                ]
            },
            // —— 灾后重建 ——
            rebuild: [
                { id: 'clear', name: '清瓦砾', cost: 8000000, cd: 4 * HOUR_MS, mood: 3, fame: 3, attr: 'physique', gain: 2,
                  line: '{name}清瓦砾到手破，邻里送来一碗姜汤。' },
                { id: 'timber', name: '运木料', cost: 15000000, cd: 5 * HOUR_MS, fame: 4, attr: 'physique', gain: 2, worldHp: 0.3,
                  line: '{name}把木料扛进巷，脊背直得像新梁。' },
                { id: 'comfort', name: '安抚受灾', cost: 12000000, cd: 4 * HOUR_MS, mood: 6, fame: 5, attr: 'charm', gain: 1,
                  line: '{name}把话讲软，把人安住，自己眼睛却红。' },
                { id: 'raise', name: '落成典礼', cost: 50000000, cd: CD_12H, fame: 12, mood: 10, worldAtk: 0.8, worldHp: 1.0,
                  line: '新屋落成。{name}把旧砖嵌进墙角，说「别忘了疼过」。' }
            ],
            // —— 传火接力 ——
            torch: {
                passCost: 20000000,
                cd: 6 * HOUR_MS,
                needAdultMentor: true,
                fame: 6,
                attrAll: 1,
                worldAtk: 0.4,
                worldHp: 0.4,
                line: '{name}把火递给后辈。火很小，路很长。'
            },
            // —— 姻缘线（成婚后感情互动，非生育）——
            redline: [
                { id: 'thread', name: '系红线', cost: 8000000, cd: 4 * HOUR_MS, bond: 5, mood: 6,
                  line: '{name}把红线系在腕上，说「别散」。' },
                { id: 'share', name: '共读一页', cost: 6000000, cd: 3 * HOUR_MS, bond: 4, mood: 5, attr: 'intelligence', gain: 1,
                  line: '{name}与伴侣共读一页，读到同一句时相视而笑。' },
                { id: 'silent', name: '沉默相伴', cost: 4000000, cd: 3 * HOUR_MS, bond: 6, mood: 7,
                  line: '谁也不说话。{name}觉得这样也好。' },
                { id: 'vow_renew', name: '重温红绳', cost: 20000000, cd: 6 * HOUR_MS, bond: 12, mood: 9, fame: 3,
                  line: '{name}把旧誓又说一遍，比婚礼那天更轻，也更真。' }
            ]
        };

        var moreEvents = [
            { id: 'flow_pavilion', title: '流年台落成', text: '有人提议建一座流年台，把四季、时辰、人的脚印都记在上面。',
              choices: [
                { label: '升级流年台', cost: 150000000, effect: 'flowPavilionReady', prestige: 22, worldHp: 5, worldAtk: 3 },
                { label: '先立个石碑', cost: 40000000, effect: 'livingMood', amount: 8, prestige: 10 },
                { label: '日后再议', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'flow_network', title: '消息网织成', text: '茶馆、驿站、巷口——消息像网一样张开。',
              choices: [
                { label: '扩建消息网', cost: 130000000, effect: 'flowNetworkReady', prestige: 20, worldCritDmg: 5 },
                { label: '犒赏线人', cost: 50000000, effect: 'livingMood', amount: 6, prestige: 10 },
                { label: '收网休息', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'sworn_day', title: '金兰日', text: '少年们要结义。酒坛已备，信物未选。',
              choices: [
                { label: '见证立簿', cost: 90000000, effect: 'flowSwornBoost', prestige: 18, worldAtk: 4 },
                { label: '赐酒鼓励', cost: 30000000, effect: 'livingMood', amount: 10, prestige: 9 },
                { label: '莫轻诺', cost: 0, effect: 'none', prestige: 3 }
              ]},
            { id: 'echo_night', title: '残影之夜', text: '牌位前灯光乱颤。有人说听见了旧名。',
              choices: [
                { label: '全族静听', cost: 70000000, effect: 'flowEchoBoost', prestige: 16, worldHp: 4, worldCritDmg: 3 },
                { label: '添灯安神', cost: 25000000, effect: 'livingMood', amount: 7, prestige: 8 },
                { label: '当风声', cost: 0, effect: 'none', prestige: 2 }
              ]},
            { id: 'rebuild_call', title: '灾后呼救', text: '邻里受灾。瓦砾下还有人的炊烟梦。',
              choices: [
                { label: '倾力重建', cost: 100000000, effect: 'flowRebuildBoost', prestige: 20, worldHp: 6 },
                { label: '量力相助', cost: 40000000, effect: 'livingMood', amount: 8, prestige: 10 },
                { label: '自顾不暇', cost: 0, effect: 'none', prestige: 1 }
              ]}
        ];
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'jieqi2', name: '节气有课', desc: '完成节气功课 2 次', need: 2, key: 'flowJieqi', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'shichen2', name: '时辰不虚', desc: '完成时辰作息 2 次', need: 2, key: 'flowShichen', rewardPrestige: 12, rewardFunds: 4000000, rewardExp: 10 },
            { id: 'rumor1', name: '市井耳目', desc: '收集传闻 1 次', need: 1, key: 'flowRumor', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'patrol1', name: '夜巡护宅', desc: '夜巡 1 次', need: 1, key: 'flowPatrol', rewardPrestige: 13, rewardFunds: 4500000, rewardExp: 11 },
            { id: 'flowUp1', name: '流年营建', desc: '升级流年台/消息网/秘技/账本 1 次', need: 1, key: 'flowUp', rewardPrestige: 25, rewardFunds: 15000000, rewardExp: 20 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensureFlowData() {
        if (!player.children) return;
        installFlowConfig();
        if (!player.children.descFlow) {
            player.children.descFlow = {
                pavilionLv: 0, pavilionCd: 0, pavilionReady: false,
                networkLv: 0, networkCd: 0, networkReady: false,
                jieqiCd: {}, shichenCd: {}, rumorCd: {}, swornCd: {},
                postCd: {}, patrolCd: {}, echoCd: {}, rebuildCd: {},
                redlineCd: {}, torchCd: {},
                swornBoost: false, echoBoost: false, rebuildBoost: false
            };
        }
        var d = player.children.descFlow;
        ['jieqiCd', 'shichenCd', 'rumorCd', 'swornCd', 'postCd', 'patrolCd', 'echoCd', 'rebuildCd', 'redlineCd', 'torchCd'].forEach(function (k) {
            if (!d[k] || typeof d[k] !== 'object') d[k] = {};
        });
        (player.children.children || []).forEach(function (m) {
            if (!m.flow) {
                m.flow = {
                    purse: 0, purseLv: 0, purseCd: 0,
                    rumor: 0,
                    secrets: {}, secretCd: {},
                    wenRank: -1, wuRank: -1,
                    swornBond: 0
                };
            }
            var f = m.flow;
            if (f.purse == null) f.purse = 0;
            if (f.purseLv == null) f.purseLv = 0;
            if (f.rumor == null) f.rumor = 0;
            if (!f.secrets) f.secrets = {};
            if (!f.secretCd) f.secretCd = {};
            if (f.wenRank == null) f.wenRank = -1;
            if (f.wuRank == null) f.wuRank = -1;
            if (f.swornBond == null) f.swornBond = 0;
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
        if ((funds().funds != null ? funds().funds : funds().availableFunds) < cost) {
            // prefer availableFunds used elsewhere
        }
        var ud = funds();
        var bal = ud.availableFunds != null ? ud.availableFunds : ud.funds;
        if ((bal || 0) < cost) {
            logAction('资金不足（需 ' + fmt(cost) + '）', 'error');
            return false;
        }
        if (ud.availableFunds != null) ud.availableFunds -= cost;
        else ud.funds -= cost;
        return true;
    }

    function getMember(idx) {
        var list = player.children.children || [];
        if (idx < 0 || idx >= list.length) return null;
        return list[idx];
    }

    function purseCap(m) {
        var up = F().purse.upgrade;
        return 10 + (m.flow.purseLv || 0) * (up.perPurseCap || 2);
    }

    // ——— 族级 ———
    window.upgradeFlowPavilion = function () {
        ensureFlowData();
        var conf = F().pavilion;
        var d = player.children.descFlow;
        if ((d.pavilionLv || 0) >= conf.maxLv) return logAction('流年台已满级', 'info');
        if (memberCount() < (conf.needMembers || 0)) return logAction('族人不足', 'error');
        if (cdLeft(d.pavilionCd) > 0 && !d.pavilionReady) return logAction(cdHint(d.pavilionCd), 'error');
        var cost = Math.floor(conf.costBase * Math.pow(conf.growth, d.pavilionLv || 0));
        if (!pay(cost)) return;
        d.pavilionLv = (d.pavilionLv || 0) + 1;
        d.pavilionCd = Date.now() + CD_12H;
        d.pavilionReady = false;
        bump('flowUp');
        pushDiary('流年台升至 Lv.' + d.pavilionLv + '。四季在石上慢了一拍。');
        logAction('流年台升至 Lv.' + d.pavilionLv + '（12h）', 'success');
        refreshUI();
    };

    window.upgradeFlowNetwork = function () {
        ensureFlowData();
        var conf = F().network;
        var d = player.children.descFlow;
        if ((d.networkLv || 0) >= conf.maxLv) return logAction('消息网已满级', 'info');
        if (cdLeft(d.networkCd) > 0 && !d.networkReady) return logAction(cdHint(d.networkCd), 'error');
        var cost = Math.floor(conf.costBase * Math.pow(conf.growth, d.networkLv || 0));
        if (!pay(cost)) return;
        d.networkLv = (d.networkLv || 0) + 1;
        d.networkCd = Date.now() + CD_12H;
        d.networkReady = false;
        bump('flowUp');
        logAction('消息网升至 Lv.' + d.networkLv + '（12h）', 'success');
        refreshUI();
    };

    function doSimple(listKey, cdKey, bumpKey, id, idx, extra) {
        ensureFlowData();
        var act = (F()[listKey] || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        if (extra && extra(act, m) === false) return;
        if (act.needAdult && !isAdult(m)) return logAction('需成年', 'error');
        if (act.needGen && maxGen() < act.needGen) return logAction('需触及第' + act.needGen + '代', 'error');
        if (act.needMembers && memberCount() < act.needMembers) return logAction('族人不足', 'error');
        var d = player.children.descFlow;
        var key = id + ':' + m.id;
        var boostSkip = false;
        if (listKey === 'echo' && d.echoBoost) { boostSkip = true; d.echoBoost = false; }
        if (listKey === 'rebuild' && d.rebuildBoost) { boostSkip = true; d.rebuildBoost = false; }
        if (listKey === 'sworn' && d.swornBoost) { boostSkip = true; d.swornBoost = false; }
        if (cdLeft(d[cdKey][key]) > 0 && !boostSkip) return logAction(cdHint(d[cdKey][key]), 'error');
        if (!pay(act.cost)) return;
        d[cdKey][key] = Date.now() + act.cd;
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        if (act.attr) addAttr(m, act.attr, act.gain || 1);
        if (act.attrAll) addAttr(m, 'all', act.attrAll);
        if (act.sleep) addSleep(m, act.sleep);
        if (act.bond) {
            addBond(m, act.bond);
            m.flow.swornBond = (m.flow.swornBond || 0) + (act.bond || 0);
        }
        if (act.rumor) m.flow.rumor = (m.flow.rumor || 0) + act.rumor;
        if (act.filial && m.filialScore != null) m.filialScore += act.filial;
        else if (act.filial) m.filialScore = act.filial;
        addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 3);
        if (bumpKey) bump(bumpKey);
        var line = (act.line || act.name).replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    }

    window.doFlowJieqi = function (id, idx) { doSimple('jieqi', 'jieqiCd', 'flowJieqi', id, idx); };
    window.doFlowShichen = function (id, idx) { doSimple('shichen', 'shichenCd', 'flowShichen', id, idx); };
    window.doFlowRumor = function (id, idx) {
        ensureFlowData();
        var act = (F().rumors || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        if (act.rumorNeed && (m.flow.rumor || 0) < act.rumorNeed) return logAction('传闻不足（需' + act.rumorNeed + '）', 'error');
        doSimple('rumors', 'rumorCd', 'flowRumor', id, idx);
    };
    window.doFlowSworn = function (id, idx) { doSimple('sworn', 'swornCd', null, id, idx); };
    window.doFlowPost = function (id, idx) { doSimple('post', 'postCd', null, id, idx); };
    window.doFlowPatrol = function (id, idx) { doSimple('patrol', 'patrolCd', 'flowPatrol', id, idx); };
    window.doFlowEcho = function (id, idx) { doSimple('echo', 'echoCd', null, id, idx); };
    window.doFlowRebuild = function (id, idx) { doSimple('rebuild', 'rebuildCd', null, id, idx); };
    window.doFlowRedline = function (id, idx) {
        ensureFlowData();
        var m = getMember(idx);
        if (!m || !isMarried(m)) return logAction('须成婚后方可系姻缘线（不影响生育门禁）', 'error');
        doSimple('redline', 'redlineCd', null, id, idx);
    };

    // ——— 私房 ———
    window.doFlowPurseSave = function (id, idx) {
        ensureFlowData();
        var act = (F().purse.saveActs || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        var d = player.children.descFlow;
        var key = 'save:' + id + ':' + m.id;
        if (cdLeft(d.jieqiCd[key]) > 0) return logAction(cdHint(d.jieqiCd[key]), 'error');
        if ((m.flow.purse || 0) + act.purse > purseCap(m)) return logAction('私房已满，先升级账本或花出去', 'info');
        if (!pay(act.cost)) return;
        d.jieqiCd[key] = Date.now() + act.cd;
        m.flow.purse = (m.flow.purse || 0) + act.purse;
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line + '（私房 ' + m.flow.purse + '/' + purseCap(m) + '）', 'success');
        refreshUI();
    };

    window.doFlowPurseSpend = function (id, idx) {
        ensureFlowData();
        var act = (F().purse.spendActs || []).find(function (x) { return x.id === id; });
        var m = getMember(idx);
        if (!act || !m) return;
        if ((m.flow.purse || 0) < act.purseNeed) return logAction('私房不足（需' + act.purseNeed + '）', 'error');
        m.flow.purse -= act.purseNeed;
        addMood(act.mood || 0);
        addFame(m, act.fame || 0);
        if (act.attr) addAttr(m, act.attr, act.gain || 1);
        if (act.filial) m.filialScore = (m.filialScore || 0) + act.filial;
        addTempWorld(act.worldAtk, act.worldHp, act.worldCritDmg, 3);
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        refreshUI();
    };

    window.upgradeFlowPurse = function (idx) {
        ensureFlowData();
        var m = getMember(idx);
        var up = F().purse.upgrade;
        if (!m) return;
        if ((m.flow.purseLv || 0) >= up.maxLv) return logAction('账本已满级', 'info');
        if (cdLeft(m.flow.purseCd) > 0) return logAction(cdHint(m.flow.purseCd), 'error');
        var cost = Math.floor(up.costBase * Math.pow(up.growth, m.flow.purseLv || 0));
        if (!pay(cost)) return;
        m.flow.purseLv = (m.flow.purseLv || 0) + 1;
        m.flow.purseCd = Date.now() + CD_12H;
        bump('flowUp');
        logAction(m.name + ' 私房账本 Lv.' + m.flow.purseLv + '（容量 ' + purseCap(m) + '）（12h）', 'success');
        refreshUI();
    };

    // ——— 秘技 ———
    window.upgradeFlowSecret = function (idx, sid) {
        ensureFlowData();
        var m = getMember(idx);
        var s = (F().secrets || []).find(function (x) { return x.id === sid; });
        if (!m || !s) return;
        if (s.needGen && maxGen() < s.needGen) return logAction('需触及第' + s.needGen + '代', 'error');
        var lv = m.flow.secrets[sid] || 0;
        if (lv >= s.max) return logAction('已满级', 'info');
        if (cdLeft(m.flow.secretCd[sid]) > 0) return logAction(cdHint(m.flow.secretCd[sid]), 'error');
        var cost = Math.floor(s.costBase * Math.pow(s.growth, lv));
        if (!pay(cost)) return;
        m.flow.secrets[sid] = lv + 1;
        m.flow.secretCd[sid] = Date.now() + CD_12H;
        if (s.attr) addAttr(m, s.attr, 1);
        bump('flowUp');
        logAction(m.name + ' 「' + s.name + '」Lv.' + (lv + 1) + '（12h）', 'success');
        refreshUI();
    };

    // ——— 文社武馆 ———
    window.promoteFlowRank = function (idx, kind) {
        ensureFlowData();
        var m = getMember(idx);
        if (!m || !isAdult(m)) return logAction('须成年晋升', 'error');
        var list = kind === 'wen' ? F().ranks.wen : F().ranks.wu;
        var cur = kind === 'wen' ? m.flow.wenRank : m.flow.wuRank;
        var next = (cur == null || cur < 0) ? 0 : cur + 1;
        if (next >= list.length) return logAction('已至最高段位', 'info');
        var rank = list[next];
        if ((m.descFame || 0) < rank.needFame) return logAction('声望不足（需' + rank.needFame + '）', 'error');
        if (rank.needGen && maxGen() < rank.needGen) return logAction('代数不足', 'error');
        if (!pay(rank.cost)) return;
        if (kind === 'wen') m.flow.wenRank = next;
        else m.flow.wuRank = next;
        addFame(m, 5);
        pushDiary(m.name + ' 晋升「' + rank.name + '」。');
        logAction(m.name + ' → ' + rank.name, 'success');
        refreshUI();
    };

    // ——— 传火 ———
    window.doFlowTorch = function (mentorIdx, pupilIdx) {
        ensureFlowData();
        var mentor = getMember(mentorIdx);
        var pupil = getMember(pupilIdx);
        var conf = F().torch;
        if (!mentor || !pupil) return;
        if (mentor.id === pupil.id) return logAction('传火双方不能相同', 'error');
        if (conf.needAdultMentor && !isAdult(mentor)) return logAction('传火者须成年', 'error');
        var d = player.children.descFlow;
        var key = mentor.id + '>' + pupil.id;
        if (cdLeft(d.torchCd[key]) > 0) return logAction(cdHint(d.torchCd[key]), 'error');
        if (!pay(conf.passCost)) return;
        d.torchCd[key] = Date.now() + conf.cd;
        addFame(mentor, conf.fame);
        addFame(pupil, Math.floor(conf.fame / 2));
        addAttr(pupil, 'all', conf.attrAll || 1);
        addTempWorld(conf.worldAtk, conf.worldHp, 0, 4);
        var line = (conf.line || '').replace(/\{name\}/g, mentor.name);
        pushDiary(line + '（传予 ' + pupil.name + '）');
        logAction(line, 'success');
        refreshUI();
    };

    function calcFlowWorld() {
        ensureFlowData();
        var atk = 0, hp = 0, crit = 0;
        var d = player.children.descFlow;
        var pv = F().pavilion;
        atk += (d.pavilionLv || 0) * (pv.per.atk || 0);
        hp += (d.pavilionLv || 0) * (pv.per.hp || 0);
        crit += (d.pavilionLv || 0) * (pv.per.crit || 0);
        var nw = F().network;
        atk += (d.networkLv || 0) * (nw.per.atk || 0);
        hp += (d.networkLv || 0) * (nw.per.hp || 0);
        crit += (d.networkLv || 0) * (nw.per.crit || 0);

        (player.children.children || []).forEach(function (m) {
            if (!m.flow) return;
            var up = F().purse.upgrade;
            var pl = m.flow.purseLv || 0;
            atk += pl * (up.perWorld.atk || 0);
            hp += pl * (up.perWorld.hp || 0);
            crit += pl * (up.perWorld.crit || 0);
            (F().secrets || []).forEach(function (s) {
                var lv = m.flow.secrets[s.id] || 0;
                atk += lv * (s.worldAtk || 0);
                hp += lv * (s.worldHp || 0);
                crit += lv * (s.worldCritDmg || 0);
            });
            var wr = m.flow.wenRank;
            if (wr >= 0 && F().ranks.wen[wr]) {
                var w = F().ranks.wen[wr];
                atk += w.atk || 0; hp += w.hp || 0; crit += w.crit || 0;
            }
            var ur = m.flow.wuRank;
            if (ur >= 0 && F().ranks.wu[ur]) {
                var u = F().ranks.wu[ur];
                atk += u.atk || 0; hp += u.hp || 0; crit += u.crit || 0;
            }
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        ensureFlowData();
        var base = _origBonus ? _origBonus() : { worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var w = calcFlowWorld();
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
            ensureFlowData();
            var d = player.children.descFlow;
            if (ch.effect === 'flowPavilionReady') d.pavilionReady = true;
            else if (ch.effect === 'flowNetworkReady') d.networkReady = true;
            else if (ch.effect === 'flowSwornBoost') d.swornBoost = true;
            else if (ch.effect === 'flowEchoBoost') d.echoBoost = true;
            else if (ch.effect === 'flowRebuildBoost') d.rebuildBoost = true;
            return result;
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }
    function opts(filterFn) {
        return (player.children.children || []).map(function (m, i) {
            if (filterFn && !filterFn(m)) return '';
            return '<option value="' + i + '">' + m.name + '（' + genLabel(m.generation || 1) +
                '·私房' + ((m.flow && m.flow.purse) || 0) + '·望' + (m.descFame || 0) + '）</option>';
        }).join('');
    }

    function updateFlowClanPanel() {
        var box = el('flowClanPanel');
        if (!box) return;
        ensureFlowData();
        var d = player.children.descFlow;
        var pCost = Math.floor(F().pavilion.costBase * Math.pow(F().pavilion.growth, d.pavilionLv || 0));
        var nCost = Math.floor(F().network.costBase * Math.pow(F().network.growth, d.networkLv || 0));
        var pTag = typeof lineageCostTag === 'function' ? lineageCostTag(pCost, '12h') : ('（' + fmt(pCost) + '）');
        var nTag = typeof lineageCostTag === 'function' ? lineageCostTag(nCost, '12h') : ('（' + fmt(nCost) + '）');
        box.innerHTML = '<div class="c-hint">流年台 Lv.' + (d.pavilionLv || 0) +
            ' · 下级 <b style="color:#FFD700;">' + fmt(pCost) + '</b>' +
            (cdHint(d.pavilionCd) ? ' · ' + cdHint(d.pavilionCd) : '') +
            (d.pavilionReady ? ' · 就绪' : '') + '</div>' +
            '<button class="c-btn c-btn-gold" style="width:100%;" onclick="upgradeFlowPavilion()">升级流年台' + pTag + '</button>' +
            '<div class="c-hint" style="margin-top:10px;">消息网 Lv.' + (d.networkLv || 0) +
            ' · 下级 <b style="color:#FFD700;">' + fmt(nCost) + '</b>' +
            (cdHint(d.networkCd) ? ' · ' + cdHint(d.networkCd) : '') +
            (d.networkReady ? ' · 就绪' : '') + '</div>' +
            '<button class="c-btn c-btn-blue" style="width:100%;margin-top:4px;" onclick="upgradeFlowNetwork()">升级消息网' + nTag + '</button>';
    }

    function updateFlowTimePanel() {
        var box = el('flowTimePanel');
        if (!box) return;
        ensureFlowData();
        box.innerHTML = '<div class="c-form-row"><label>子弟</label><select id="flowTimeMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">节气功课</h4><div class="c-train-grid">' + (F().jieqi || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doFlowJieqi(\'' + a.id + '\',+document.getElementById(\'flowTimeMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">时辰作息</h4><div class="c-train-grid">' + (F().shichen || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doFlowShichen(\'' + a.id + '\',+document.getElementById(\'flowTimeMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateFlowPursePanel() {
        var box = el('flowPursePanel');
        if (!box) return;
        ensureFlowData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="flowPurseMember" class="c-input">' + opts() + '</select></div>' +
            '<button class="c-btn c-btn-gold" style="width:100%;margin:6px 0;" onclick="upgradeFlowPurse(+document.getElementById(\'flowPurseMember\').value)">升级私房账本（12h）</button>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">积蓄</h4><div class="c-train-grid">' + (F().purse.saveActs || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="doFlowPurseSave(\'' + a.id + '\',+document.getElementById(\'flowPurseMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">花用</h4><div class="c-train-grid">' + (F().purse.spendActs || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div><div class="ms-desc">需私房 ' + a.purseNeed + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" onclick="doFlowPurseSpend(\'' + a.id + '\',+document.getElementById(\'flowPurseMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">市井传闻</h4><div class="c-train-grid">' + (F().rumors || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-purple" onclick="doFlowRumor(\'' + a.id + '\',+document.getElementById(\'flowPurseMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateFlowSocialPanel() {
        var box = el('flowSocialPanel');
        if (!box) return;
        ensureFlowData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="flowSocialMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">结义金兰</h4><div class="c-train-grid">' + (F().sworn || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doFlowSworn(\'' + a.id + '\',+document.getElementById(\'flowSocialMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">远行驿站</h4><div class="c-train-grid">' + (F().post || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" onclick="doFlowPost(\'' + a.id + '\',+document.getElementById(\'flowSocialMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">夜巡</h4><div class="c-train-grid">' + (F().patrol || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="doFlowPatrol(\'' + a.id + '\',+document.getElementById(\'flowSocialMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateFlowSecretPanel() {
        var box = el('flowSecretPanel');
        if (!box) return;
        ensureFlowData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="flowSecretMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">家传秘技（12h）</h4><div class="c-train-grid">' + (F().secrets || []).map(function (s) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + s.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="upgradeFlowSecret(+document.getElementById(\'flowSecretMember\').value,\'' + s.id + '\')">修习</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">先祖残影</h4><div class="c-train-grid">' + (F().echo || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-purple" onclick="doFlowEcho(\'' + a.id + '\',+document.getElementById(\'flowSecretMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">文社 · 武馆</h4>' +
            '<button class="c-btn c-btn-blue" style="width:48%;" onclick="promoteFlowRank(+document.getElementById(\'flowSecretMember\').value,\'wen\')">文社晋升</button> ' +
            '<button class="c-btn c-btn-orange" style="width:48%;" onclick="promoteFlowRank(+document.getElementById(\'flowSecretMember\').value,\'wu\')">武馆晋升</button>';
    }

    function updateFlowLifePanel() {
        var box = el('flowLifePanel');
        if (!box) return;
        ensureFlowData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="flowLifeMember" class="c-input">' + opts() + '</select></div>' +
            '<h4 style="color:#E8C4A8;margin:8px 0;">灾后重建</h4><div class="c-train-grid">' + (F().rebuild || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="doFlowRebuild(\'' + a.id + '\',+document.getElementById(\'flowLifeMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">姻缘线（成婚·非生育）</h4><div class="c-train-grid">' + (F().redline || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doFlowRedline(\'' + a.id + '\',+document.getElementById(\'flowLifeMember\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>' +
            '<h4 style="color:#E8C4A8;margin:12px 0 8px;">传火接力</h4>' +
            '<div class="c-form-row"><label>传火者</label><select id="flowTorchMentor" class="c-input">' + opts(isAdult) + '</select></div>' +
            '<div class="c-form-row"><label>接火者</label><select id="flowTorchPupil" class="c-input">' + opts() + '</select></div>' +
            '<button class="c-btn c-btn-gold" style="width:100%;" onclick="doFlowTorch(+document.getElementById(\'flowTorchMentor\').value,+document.getElementById(\'flowTorchPupil\').value)">传火</button>';
    }

    window.updateDescFlowPanels = function () {
        installFlowConfig();
        ensureFlowData();
        updateFlowClanPanel();
        updateFlowTimePanel();
        updateFlowPursePanel();
        updateFlowSocialPanel();
        updateFlowSecretPanel();
        updateFlowLifePanel();
    };

    // 不再从长卷 / living 级联刷新流年；由 refreshActiveChildTabPanels 按页签刷新

    var _origSwitch = window.switchChildTab;
    window.switchChildTab = function (tab) {
        if (_origSwitch) _origSwitch(tab);
        var node = document.getElementById('childSectionDescFlow');
        if (node) node.classList.toggle('active', tab === 'descflow');
    };

    installFlowConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            installFlowConfig();
            ensureFlowData();
        }, 2900);
    });
    if (document.readyState !== 'loading') {
        setTimeout(function () {
            installFlowConfig();
            ensureFlowData();
        }, 2900);
    }
})();

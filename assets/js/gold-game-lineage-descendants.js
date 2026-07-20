/**
 * 家族传承 · 子孙百态
 * 性格/志向/爱好/学业/手足/师徒/专精/声望/同辈竞赛/血脉特质/成长里程碑/指定嫡系
 * 在 lineage-living-real.js 之后加载；不改写婚育门禁链
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
    function D() { return (cfg() && cfg().descendants) || {}; }
    function genLabel(g) {
        return typeof getGenerationLabel === 'function' ? getGenerationLabel(g) : ('第' + g + '代');
    }

    function installDescConfig() {
        if (!window.lineageExtConfig) return;
        var c = window.lineageExtConfig;
        if (c._descInstalled) return;
        c._descInstalled = true;

        c.descendants = {
            natures: [
                { id: 'diligent', name: '勤勉', trainBonus: 0.15, worldAtk: 0.15 },
                { id: 'clever', name: '聪慧', trainBonus: 0.1, attr: 'intelligence', worldCritDmg: 0.15 },
                { id: 'sturdy', name: '敦厚', trainBonus: 0.05, attr: 'physique', worldHp: 0.25 },
                { id: 'vivacious', name: '开朗', interactBonus: 0.2, attr: 'charm', worldHp: 0.1 },
                { id: 'shrewd', name: '精明', attr: 'business', worldAtk: 0.2 },
                { id: 'stubborn', name: '拗劲', trainBonus: 0.2, moodPenalty: 1, worldAtk: 0.1, worldCritDmg: 0.1 },
                { id: 'gentle', name: '温润', interactBonus: 0.15, worldHp: 0.2 },
                { id: 'restless', name: '好动', hobbyBonus: 0.2, worldAtk: 0.15 }
            ],
            ambitions: [
                { id: 'scholar', name: '金榜题名', stageMin: 2, attr: 'intelligence', cost: 15000000, max: 10, per: { atk: 0.3, hp: 0.2, crit: 0.4 } },
                { id: 'warrior', name: '沙场扬名', stageMin: 2, attr: 'physique', cost: 15000000, max: 10, per: { atk: 0.5, hp: 0.3, crit: 0.4 } },
                { id: 'merchant', name: '富甲一方', stageMin: 2, attr: 'business', cost: 18000000, max: 10, per: { atk: 0.45, hp: 0.2, crit: 0.25 } },
                { id: 'artist', name: '名动四方', stageMin: 2, attr: 'charm', cost: 14000000, max: 10, per: { atk: 0.25, hp: 0.35, crit: 0.35 } },
                { id: 'healer', name: '悬壶济世', stageMin: 3, attr: 'intelligence', cost: 20000000, max: 10, per: { atk: 0.2, hp: 0.6, crit: 0.2 } },
                { id: 'guardian', name: '护族安邦', stageMin: 3, attr: 'physique', cost: 22000000, max: 10, per: { atk: 0.4, hp: 0.5, crit: 0.3 } }
            ],
            hobbies: [
                { id: 'go', name: '对弈围棋', cost: 5000000, cd: 3 * HOUR_MS, attr: 'intelligence', gain: 2, mood: 3, worldCritDmg: 0.15,
                  lines: ['{name}落下一子，半天不说话，忽然笑了。', '{name}输了也不恼，说「再来一盘」。'] },
                { id: 'calligraphy', name: '临帖练字', cost: 4000000, cd: 3 * HOUR_MS, attr: 'charm', gain: 2, mood: 2, worldHp: 0.15,
                  lines: ['墨点溅到鼻子上，{name}还在写「家」字。', '{name}把字贴在墙上，歪着头看了很久。'] },
                { id: 'fishing', name: '溪边垂钓', cost: 3500000, cd: 4 * HOUR_MS, attr: 'physique', gain: 1, mood: 5, worldHp: 0.2,
                  lines: ['浮子动了。{name}紧张得屏住呼吸，最后钓上来的是水草。', '{name}把钓竿靠在肩上，说「今天不在鱼，在风」。'] },
                { id: 'flute', name: '吹笛弄箫', cost: 6000000, cd: 3 * HOUR_MS, attr: 'charm', gain: 2, mood: 6, worldAtk: 0.1, worldCritDmg: 0.1,
                  lines: ['笛声从厢房飘出来。{name}吹错一个音，自己先红了脸。', '夜里{name}吹了一支旧曲，老人听着听着落了泪。'] },
                { id: 'ledger_play', name: '玩算盘', cost: 4500000, cd: 3 * HOUR_MS, attr: 'business', gain: 2, mood: 2, worldAtk: 0.2,
                  lines: ['算盘噼啪。{name}算错了又重来，不肯认输。', '{name}说「数字也有脾气，得慢慢哄」。'] },
                { id: 'herb_garden', name: '侍弄药圃', cost: 5500000, cd: 4 * HOUR_MS, attr: 'intelligence', gain: 1, mood: 4, worldHp: 0.3,
                  lines: ['{name}蹲在药圃里认叶子，袖口沾满泥土。', '有一株活过来了，{name}高兴得像过年。'] },
                { id: 'spar_friend', name: '邀友比武', cost: 7000000, cd: 4 * HOUR_MS, attr: 'physique', gain: 2, mood: 3, worldAtk: 0.25, needAdult: true,
                  lines: ['{name}和同辈过了几招，输赢都喝一碗茶。', '尘土飞扬里，{name}眼里有光。'] },
                { id: 'night_read', name: '夜读百卷', cost: 5000000, cd: 4 * HOUR_MS, attr: 'intelligence', gain: 2, mood: 2, worldCritDmg: 0.2, needStage: 2,
                  lines: ['灯花爆了。{name}把书合上，眼里却还亮着。', '{name}抄了一页好句，塞进枕下。'] }
            ],
            school: {
                subjects: [
                    { id: 'lit', name: '经史', attr: 'intelligence', cost: 8000000, cd: 4 * HOUR_MS },
                    { id: 'math', name: '算学', attr: 'business', cost: 8000000, cd: 4 * HOUR_MS },
                    { id: 'rite', name: '礼乐', attr: 'charm', cost: 7000000, cd: 4 * HOUR_MS },
                    { id: 'gym', name: '骑射', attr: 'physique', cost: 9000000, cd: 4 * HOUR_MS }
                ],
                gradeCap: 100,
                examCost: 25000000,
                examCd: 8 * HOUR_MS,
                examBonus: 8
            },
            specialties: [
                { id: 'sword', name: '剑术专精', attr: 'physique', max: 15, costBase: 20000000, growth: 2.2, atk: 0.8, hp: 0.3, crit: 0.6 },
                { id: 'rhetoric', name: '辞章专精', attr: 'intelligence', max: 15, costBase: 18000000, growth: 2.2, atk: 0.4, hp: 0.3, crit: 0.8 },
                { id: 'trade', name: '商道专精', attr: 'business', max: 15, costBase: 22000000, growth: 2.2, atk: 0.9, hp: 0.2, crit: 0.3 },
                { id: 'etiquette', name: '仪表专精', attr: 'charm', max: 15, costBase: 16000000, growth: 2.2, atk: 0.3, hp: 0.7, crit: 0.5 },
                { id: 'medicine', name: '医术专精', attr: 'intelligence', max: 15, costBase: 24000000, growth: 2.2, atk: 0.2, hp: 1.0, crit: 0.3 },
                { id: 'strategy', name: '兵法专精', attr: 'intelligence', max: 15, costBase: 26000000, growth: 2.2, atk: 1.0, hp: 0.4, crit: 0.7 }
            ],
            siblingActs: [
                { id: 'share_candy', name: '分糖闲话', cost: 2000000, cd: 3 * HOUR_MS, bond: 5, mood: 4,
                  line: '{a}把糖掰成两半给{b}。两个人靠在门槛上，笑得很小声。' },
                { id: 'study_together', name: '联案共读', cost: 6000000, cd: 4 * HOUR_MS, bond: 6, attr: 'intelligence', mood: 3,
                  line: '{a}与{b}抢同一盏灯。谁先背完，谁先吹灭。' },
                { id: 'spar_sib', name: '手足切磋', cost: 5000000, cd: 4 * HOUR_MS, bond: 4, attr: 'physique', mood: 2,
                  line: '{a}和{b}过了几招，最后一起去洗泥点子。' },
                { id: 'make_up', name: '冰释前嫌', cost: 8000000, cd: 6 * HOUR_MS, bond: 12, mood: 8,
                  line: '{a}先开口认了错。{b}把茶杯推过去，谁也不提昨天。' },
                { id: 'night_chat', name: '同榻夜话', cost: 3000000, cd: 5 * HOUR_MS, bond: 7, mood: 6,
                  line: '更鼓响了。{a}和{b}还在说「长大以后」。' }
            ],
            mentor: {
                cost: 12000000,
                cd: 5 * HOUR_MS,
                mentorGain: 1,
                pupilGain: 3,
                bond: 4,
                line: '{mentor}按着{pupil}的手教了一招。徒弟学得慢，师父却不急。'
            },
            fame: {
                perInteract: 1,
                perTrain: 1,
                perHobby: 2,
                perExam: 8,
                perContest: 12,
                perSpecialty: 3,
                tiers: [
                    { need: 0, name: '籍籍无名', atk: 0, hp: 0, crit: 0 },
                    { need: 20, name: '里巷小名', atk: 0.5, hp: 0.5, crit: 0.3 },
                    { need: 50, name: '族中翘楚', atk: 1.2, hp: 1.2, crit: 0.8 },
                    { need: 100, name: '一城闻名', atk: 2.5, hp: 2.5, crit: 1.8 },
                    { need: 200, name: '省府称奇', atk: 4.5, hp: 4.5, crit: 3.5 },
                    { need: 400, name: '十八代人杰', atk: 8, hp: 8, crit: 6 }
                ]
            },
            bloodQuirks: [
                { id: 'iron_gut', name: '铁胃', desc: '少生病', illnessResist: 0.35, worldHp: 0.3 },
                { id: 'quick_wit', name: '颖悟', desc: '培养更易出成绩', trainBonus: 0.12, worldCritDmg: 0.2 },
                { id: 'silver_tongue', name: '伶牙', desc: '互动收益更好', interactBonus: 0.15, worldAtk: 0.15 },
                { id: 'deep_root', name: '根深', desc: '代际贡献略增', contrib: 0.05, worldHp: 0.2 },
                { id: 'star_luck', name: '星运', desc: '偶有额外感悟', critEvent: 0.08, worldCritDmg: 0.25 },
                { id: 'warm_hearth', name: '灶暖', desc: '心情易回升', moodBonus: 2, worldHp: 0.15 }
            ],
            contests: [
                { id: 'poetry', name: '诗词赛', attr: 'intelligence', cost: 20000000, cd: 8 * HOUR_MS, fame: 12, prestige: 8 },
                { id: 'martial', name: '比武会', attr: 'physique', cost: 25000000, cd: 8 * HOUR_MS, fame: 14, prestige: 10 },
                { id: 'market', name: '商赛', attr: 'business', cost: 30000000, cd: 10 * HOUR_MS, fame: 15, prestige: 12 },
                { id: 'grace', name: '仪典赛', attr: 'charm', cost: 18000000, cd: 8 * HOUR_MS, fame: 10, prestige: 8 }
            ],
            milestones: [
                { id: 'first_word', stage: 1, name: '牙牙学语', reward: { charm: 2 }, text: '{name}喊出了第一声「阿耶」。全屋灯都亮了。' },
                { id: 'first_step', stage: 1, name: '蹒跚学步', reward: { physique: 2 }, text: '{name}迈出第一步，摔了，又站起来。' },
                { id: 'school_enter', stage: 2, name: '开蒙入学', reward: { intelligence: 3 }, text: '{name}背着小书包，把墨锭攥得紧紧的。' },
                { id: 'teen_vow', stage: 3, name: '立下志向', reward: { all: 2 }, text: '{name}说「我将来要……」说完自己先红了脸。' },
                { id: 'adult_ready', stage: 4, name: '弱冠在即', reward: { all: 3 }, text: '{name}忽然安静了许多，像在等一场礼。' }
            ],
            peerFriends: [
                { id: 'bookish', name: '同窗书友', cost: 10000000, cd: 6 * HOUR_MS, attr: 'intelligence', gain: 2, fame: 3 },
                { id: 'street', name: '市井玩伴', cost: 8000000, cd: 5 * HOUR_MS, attr: 'charm', gain: 2, fame: 2 },
                { id: 'dojo', name: '武馆同门', cost: 12000000, cd: 6 * HOUR_MS, attr: 'physique', gain: 2, fame: 4 },
                { id: 'guild', name: '商会少年', cost: 15000000, cd: 7 * HOUR_MS, attr: 'business', gain: 2, fame: 4 }
            ],
            heir: {
                cost: 50000000,
                atk: 3, hp: 3, crit: 2,
                line: '族长当众指定{name}为嫡系砥柱。灯火里，十八代牌位似乎亮了一寸。'
            },
            growthGift: { attr: 2, fame: 5, mood: 4 }
        };

        var moreEvents = [
            { id: 'sibling_quarrel', title: '手足反目', text: '两个孩子为了一本旧书吵红了脸。大人站在廊下，不知该不该进去。',
              choices: [
                { label: '各打五十，再给一人一本', cost: 30000000, effect: 'descSiblingHeal', prestige: 12, worldHp: 2 },
                { label: '让他们自己和解', cost: 0, effect: 'livingMood', amount: 3, prestige: 5 },
                { label: '办一场手足小宴', cost: 60000000, effect: 'descSiblingBoost', prestige: 15, worldHp: 3 }
              ]},
            { id: 'prodigy_contest', title: '同辈争锋', text: '邻城送来战书：诗词、比武、商赛，任选一门。你们家子弟眼里有火。',
              choices: [
                { label: '应战并加练', cost: 80000000, effect: 'descContestReady', prestige: 18, worldAtk: 4 },
                { label: '送礼和解，来日再战', cost: 100000000, effect: 'prestige', amount: 10 },
                { label: '闭门苦读三日', cost: 40000000, effect: 'descSchoolBoost', prestige: 12 }
              ]},
            { id: 'ambition_awaken', title: '志向初萌', text: '灯下，有少年把志向写在纸上，又揉掉，又写。墨用了一整砚。',
              choices: [
                { label: '鼓励并资助深造', cost: 70000000, effect: 'descAmbitionBoost', prestige: 16, worldCritDmg: 3 },
                { label: '让他自己慢慢想', cost: 10000000, effect: 'livingMood', amount: 6, prestige: 8 },
                { label: '按家族传统指定方向', cost: 50000000, effect: 'descSpecialtyReady', prestige: 14 }
              ]},
            { id: 'heir_debate', title: '嫡系之议', text: '长辈们低声争论：该不该早定嫡系，好让子弟有奔头？',
              choices: [
                { label: '择优公示嫡系', cost: 120000000, effect: 'descHeirReady', prestige: 25, worldAtk: 5, worldHp: 5 },
                { label: '再观察一年', cost: 0, effect: 'none', prestige: 4 },
                { label: '多房并重，不立嫡', cost: 80000000, effect: 'happiness', amount: 15, prestige: 12 }
              ]},
            { id: 'blood_quirk_show', title: '血脉显相', text: '有孩子高烧退了后忽然更机敏，有人说是血脉特质醒了。',
              choices: [
                { label: '请人推演并记录', cost: 90000000, effect: 'descQuirkReroll', prestige: 20, worldCritDmg: 4 },
                { label: '当作家常，好好养着', cost: 20000000, effect: 'livingMood', amount: 8, prestige: 8 },
                { label: '供奉宗祠求稳', cost: 50000000, effect: 'offerReady', prestige: 14 }
              ]}
        ];
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'hobby2', name: '雅趣日课', desc: '完成子孙爱好 2 次', need: 2, key: 'hobby', rewardPrestige: 16, rewardFunds: 6000000, rewardExp: 12 },
            { id: 'school1', name: '课业精进', desc: '完成学业功课 1 次', need: 1, key: 'school', rewardPrestige: 18, rewardFunds: 8000000, rewardExp: 14 },
            { id: 'sibling1', name: '手足情深', desc: '手足互动 1 次', need: 1, key: 'sibling', rewardPrestige: 15, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'mentor1', name: '薪火相传', desc: '师徒指点 1 次', need: 1, key: 'mentor', rewardPrestige: 20, rewardFunds: 10000000, rewardExp: 16 },
            { id: 'contest1', name: '同辈争锋', desc: '参加竞赛 1 次', need: 1, key: 'contest', rewardPrestige: 25, rewardFunds: 15000000, rewardExp: 22 },
            { id: 'spec1', name: '一技傍身', desc: '专精升级 1 次', need: 1, key: 'specialty', rewardPrestige: 18, rewardFunds: 12000000, rewardExp: 15 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensureDescData() {
        if (!player.children) return;
        installDescConfig();
        if (!player.children.desc) {
            player.children.desc = {
                hobbyCd: {},
                schoolCd: {},
                siblingCd: {},
                mentorCd: {},
                contestCd: {},
                peerCd: {},
                specialtyReady: false,
                contestReady: false,
                heirId: null,
                heirReady: false,
                siblingBoostUntil: 0
            };
        }
        var d = player.children.desc;
        if (!d.hobbyCd) d.hobbyCd = {};
        if (!d.schoolCd) d.schoolCd = {};
        if (!d.siblingCd) d.siblingCd = {};
        if (!d.mentorCd) d.mentorCd = {};
        if (!d.contestCd) d.contestCd = {};
        if (!d.peerCd) d.peerCd = {};
        (player.children.children || []).forEach(initMemberDesc);
    }

    function pick(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function initMemberDesc(m) {
        if (!m) return;
        var conf = D();
        if (!m.descNature) m.descNature = pick(conf.natures || [{ id: 'diligent' }]).id;
        if (!m.descQuirk) m.descQuirk = pick(conf.bloodQuirks || [{ id: 'warm_hearth' }]).id;
        if (m.descFame == null) m.descFame = 0;
        if (m.descAmbitionId == null) m.descAmbitionId = null;
        if (m.descAmbitionLv == null) m.descAmbitionLv = 0;
        if (!m.descSpecialties) m.descSpecialties = {};
        if (!m.descSchool) m.descSchool = { lit: 0, math: 0, rite: 0, gym: 0 };
        if (!m.descMilestones) m.descMilestones = {};
        if (!m.descSiblingBond) m.descSiblingBond = {};
        if (m.descHobbyCount == null) m.descHobbyCount = 0;
    }

    function pushDiary(text) {
        if (!player.children.life && typeof ensureLifeData === 'function') ensureLifeData();
        if (!player.children.life) return;
        var d = player.children.life.diary;
        if (!Array.isArray(d)) { player.children.life.diary = []; d = player.children.life.diary; }
        d.unshift({ t: Date.now(), text: text });
        if (d.length > 80) d.length = 80;
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

    function fameTier(m) {
        var fame = (m && m.descFame) || 0;
        var tier = (D().fame.tiers || [])[0];
        (D().fame.tiers || []).forEach(function (t) {
            if (fame >= t.need) tier = t;
        });
        return tier;
    }

    function natureOf(m) {
        return (D().natures || []).find(function (n) { return n.id === m.descNature; }) || {};
    }

    function quirkOf(m) {
        return (D().bloodQuirks || []).find(function (q) { return q.id === m.descQuirk; }) || {};
    }

    function refreshUI() {
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    }

    // ——— 新生初始化 ———
    var _origCreate = window.createNewChild;
    if (_origCreate) {
        window.createNewChild = function (name, gender, generation, parentId, inheritFrom) {
            var child = _origCreate(name, gender, generation, parentId, inheritFrom);
            ensureDescData();
            initMemberDesc(child);
            // 继承父母血脉特质小概率
            if (inheritFrom && inheritFrom.descQuirk && Math.random() < 0.25) {
                child.descQuirk = inheritFrom.descQuirk;
            }
            pushDiary(child.name + ' 落地。性格「' + (natureOf(child).name || '') + '」，血脉特质「' + (quirkOf(child).name || '') + '」。');
            return child;
        };
    }

    // ——— 成长里程碑 + 成年礼赠 ———
    var _origGrow = window.growChildToNextStage;
    if (_origGrow) {
        window.growChildToNextStage = function (childIndex) {
            ensureDescData();
            var child = player.children.children[childIndex];
            var prevStage = child && child.growthStage;
            var wasAdult = child && child.isAdult;
            _origGrow(childIndex);
            child = player.children.children[childIndex];
            if (!child) return;
            initMemberDesc(child);
            var gift = D().growthGift || {};
            if (child.attributes) {
                Object.keys(child.attributes).forEach(function (k) {
                    child.attributes[k] = (child.attributes[k] || 0) + (gift.attr || 0);
                });
            }
            addFame(child, gift.fame || 0);
            addMood(gift.mood || 0);
            // 里程碑
            (D().milestones || []).forEach(function (ms) {
                if (ms.stage === child.growthStage && !child.descMilestones[ms.id]) {
                    child.descMilestones[ms.id] = true;
                    if (ms.reward) {
                        if (ms.reward.all && child.attributes) {
                            Object.keys(child.attributes).forEach(function (k) {
                                child.attributes[k] = (child.attributes[k] || 0) + ms.reward.all;
                            });
                        }
                        Object.keys(ms.reward).forEach(function (k) {
                            if (k === 'all') return;
                            if (child.attributes && child.attributes[k] != null) {
                                child.attributes[k] += ms.reward[k];
                            }
                        });
                    }
                    var text = ms.text.replace(/\{name\}/g, child.name);
                    pushDiary('【里程碑·' + ms.name + '】' + text);
                    logAction(child.name + ' 达成「' + ms.name + '」', 'success');
                }
            });
            if (!wasAdult && child.isAdult) {
                pushDiary(child.name + ' 长成青年。族人说：下一步是成人礼，再往下才是婚嫁与传宗。');
            }
            if (prevStage != null && child.growthStage > prevStage) {
                addFame(child, 3);
            }
        };
    }

    // ——— 培养加成 ———
    var _origTrain = window.trainChild;
    if (_origTrain) {
        window.trainChild = function (childIndex, trainingType) {
            ensureDescData();
            var child = player.children.children[childIndex];
            var beforeTrain = child && (child.totalTraining || 0);
            var result = _origTrain(childIndex, trainingType);
            child = player.children.children[childIndex];
            if (!child || (child.totalTraining || 0) <= beforeTrain) return result;
            var nat = natureOf(child);
            var quirk = quirkOf(child);
            var bonus = (nat.trainBonus || 0) + (quirk.trainBonus || 0);
            if (bonus > 0 && Math.random() < bonus) {
                var keys = Object.keys(child.attributes || {});
                if (keys.length) {
                    var k = keys[Math.floor(Math.random() * keys.length)];
                    child.attributes[k] = (child.attributes[k] || 0) + 1;
                    logAction(child.name + ' 因「' + (nat.name || '') + '/' + (quirk.name || '') + '」额外感悟', 'info');
                }
            }
            addFame(child, (D().fame && D().fame.perTrain) || 1);
            return result;
        };
    }

    // ——— 互动加成 ———
    var _origInteract = window.interactWithChild;
    if (_origInteract) {
        window.interactWithChild = function (childIndex) {
            ensureDescData();
            var child = player.children.children[childIndex];
            var beforeInt = child && child.totalInteractions;
            _origInteract(childIndex);
            child = player.children.children[childIndex];
            if (!child || child.totalInteractions === beforeInt) return;
            var nat = natureOf(child);
            var quirk = quirkOf(child);
            var bonus = (nat.interactBonus || 0) + (quirk.interactBonus || 0);
            if (bonus > 0 && Math.random() < bonus) {
                child.intimacy = (child.intimacy || 0) + 1;
                var k = Object.keys(child.attributes || {})[Math.floor(Math.random() * 4)];
                if (k) child.attributes[k] = (child.attributes[k] || 0) + 1;
            }
            addFame(child, (D().fame && D().fame.perInteract) || 1);
            if (quirk.moodBonus) addMood(quirk.moodBonus);
        };
    }

    // ——— 爱好 ———
    window.doDescendantHobby = function (hobbyId, memberIndex) {
        ensureDescData();
        var hobby = (D().hobbies || []).find(function (h) { return h.id === hobbyId; });
        var m = (player.children.children || [])[memberIndex];
        if (!hobby || !m) return;
        if (hobby.needAdult && !isAdult(m)) return logAction('需成年', 'error');
        if (hobby.needStage != null && (m.growthStage || 0) < hobby.needStage) return logAction('年纪尚小', 'info');
        if (typeof isFamilyMemberSick === 'function' && isFamilyMemberSick(m)) return logAction('生病中不宜', 'error');
        var cdKey = hobby.id + ':' + (m.id || memberIndex);
        var left = (player.children.desc.hobbyCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('冷却中（剩 ' + Math.ceil(left / 60000) + ' 分）', 'info');
        var cost = hobby.cost;
        var nat = natureOf(m);
        if (nat.hobbyBonus) cost = Math.floor(cost * (1 - nat.hobbyBonus * 0.3));
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        player.children.desc.hobbyCd[cdKey] = Date.now() + hobby.cd;
        if (m.attributes && hobby.attr) {
            var gain = hobby.gain || 1;
            if (nat.hobbyBonus) gain += 1;
            m.attributes[hobby.attr] = (m.attributes[hobby.attr] || 0) + gain;
        }
        m.descHobbyCount = (m.descHobbyCount || 0) + 1;
        addFame(m, (D().fame && D().fame.perHobby) || 2);
        addMood(hobby.mood || 0);
        if (player.children.life && player.children.life.tempWorld) {
            var tw = player.children.life.tempWorld;
            if (Date.now() > (tw.until || 0)) { tw.atk = 0; tw.hp = 0; tw.crit = 0; }
            tw.atk += hobby.worldAtk || 0;
            tw.hp += hobby.worldHp || 0;
            tw.crit += hobby.worldCritDmg || 0;
            tw.until = Date.now() + 3 * HOUR_MS;
        }
        var line = hobby.lines[Math.floor(Math.random() * hobby.lines.length)].replace(/\{name\}/g, m.name);
        pushDiary(line);
        bump('hobby');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 学业 ———
    window.studyDescendantSubject = function (subjectId, memberIndex) {
        ensureDescData();
        var sub = (D().school.subjects || []).find(function (s) { return s.id === subjectId; });
        var m = (player.children.children || [])[memberIndex];
        if (!sub || !m) return;
        if (isAdult(m)) return logAction('已成年，请改修专精或志向', 'info');
        if ((m.growthStage || 0) < 1) return logAction('太小，还未开蒙', 'info');
        var cdKey = sub.id + ':' + (m.id || memberIndex);
        var left = (player.children.desc.schoolCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('功课冷却中', 'info');
        if (funds().availableFunds < sub.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= sub.cost;
        player.children.desc.schoolCd[cdKey] = Date.now() + sub.cd;
        if (!m.descSchool) m.descSchool = { lit: 0, math: 0, rite: 0, gym: 0 };
        var cap = D().school.gradeCap || 100;
        m.descSchool[sub.id] = Math.min(cap, (m.descSchool[sub.id] || 0) + 5 + Math.floor(Math.random() * 4));
        if (m.attributes && sub.attr) m.attributes[sub.attr] = (m.attributes[sub.attr] || 0) + 1;
        addFame(m, 2);
        pushDiary(m.name + ' 上了「' + sub.name + '」课，成绩到 ' + m.descSchool[sub.id] + ' 分。');
        bump('school');
        logAction(m.name + ' 「' + sub.name + '」+' + '，现 ' + m.descSchool[sub.id] + ' 分', 'success');
        refreshUI();
    };

    window.takeDescendantExam = function (memberIndex) {
        ensureDescData();
        var m = (player.children.children || [])[memberIndex];
        var sc = D().school;
        if (!m || isAdult(m)) return logAction('请选择未成年就学成员', 'error');
        var left = (player.children.desc.schoolCd['exam:' + (m.id || memberIndex)] || 0) - Date.now();
        if (left > 0) return logAction('小考冷却中', 'info');
        if (funds().availableFunds < sc.examCost) return logAction('资金不足', 'error');
        funds().availableFunds -= sc.examCost;
        player.children.desc.schoolCd['exam:' + (m.id || memberIndex)] = Date.now() + sc.examCd;
        if (!m.descSchool) m.descSchool = { lit: 0, math: 0, rite: 0, gym: 0 };
        var avg = 0, n = 0;
        Object.keys(m.descSchool).forEach(function (k) { avg += m.descSchool[k]; n++; });
        avg = n ? avg / n : 0;
        var pass = avg >= 40 || Math.random() < 0.45;
        if (pass) {
            Object.keys(m.attributes || {}).forEach(function (k) {
                m.attributes[k] = (m.attributes[k] || 0) + Math.floor(sc.examBonus / 4);
            });
            addFame(m, sc.fame || (D().fame.perExam || 8));
            pushDiary(m.name + ' 小考过关，眼里有光。');
            logAction(m.name + ' 小考通过！全属性提升', 'success');
        } else {
            addMood(-2);
            pushDiary(m.name + ' 小考失利，回去又挑灯读了一夜。');
            logAction(m.name + ' 小考未过，再接再厉', 'info');
        }
        bump('school');
        refreshUI();
    };

    // ——— 志向 ———
    window.setDescendantAmbition = function (memberIndex, ambitionId) {
        ensureDescData();
        var m = (player.children.children || [])[memberIndex];
        var amb = (D().ambitions || []).find(function (a) { return a.id === ambitionId; });
        if (!m || !amb) return;
        if ((m.growthStage || 0) < (amb.stageMin || 0) && !isAdult(m)) {
            return logAction('年纪未到，尚难立此志', 'info');
        }
        m.descAmbitionId = amb.id;
        if (!m.descAmbitionLv) m.descAmbitionLv = 0;
        pushDiary(m.name + ' 立下志向：「' + amb.name + '」。');
        logAction(m.name + ' 志向定为「' + amb.name + '」', 'success');
        refreshUI();
    };

    window.trainDescendantAmbition = function (memberIndex) {
        ensureDescData();
        var m = (player.children.children || [])[memberIndex];
        if (!m || !m.descAmbitionId) return logAction('请先立志', 'error');
        var amb = (D().ambitions || []).find(function (a) { return a.id === m.descAmbitionId; });
        if (!amb) return;
        var lv = m.descAmbitionLv || 0;
        if (lv >= amb.max) return logAction('志向已圆满', 'info');
        var cost = amb.cost * Math.pow(1.8, lv);
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        m.descAmbitionLv = lv + 1;
        if (m.attributes && amb.attr) m.attributes[amb.attr] = (m.attributes[amb.attr] || 0) + 2;
        addFame(m, 5);
        pushDiary(m.name + ' 朝「' + amb.name + '」又迈一步（Lv.' + m.descAmbitionLv + '）。');
        logAction(m.name + ' 志向 Lv.' + m.descAmbitionLv, 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 专精 ———
    window.upgradeDescendantSpecialty = function (memberIndex, specId) {
        ensureDescData();
        var m = (player.children.children || [])[memberIndex];
        var spec = (D().specialties || []).find(function (s) { return s.id === specId; });
        if (!m || !spec) return;
        if (!isAdult(m)) return logAction('专精需成年后修习', 'error');
        if (!m.descSpecialties) m.descSpecialties = {};
        var lv = m.descSpecialties[specId] || 0;
        if (lv >= spec.max) return logAction('已满级', 'info');
        var cost = Math.floor(spec.costBase * Math.pow(spec.growth || 2, lv));
        if (player.children.desc.specialtyReady) { cost = Math.floor(cost * 0.5); player.children.desc.specialtyReady = false; }
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        m.descSpecialties[specId] = lv + 1;
        if (m.attributes && spec.attr) m.attributes[spec.attr] = (m.attributes[spec.attr] || 0) + 1;
        addFame(m, (D().fame && D().fame.perSpecialty) || 3);
        bump('specialty');
        pushDiary(m.name + ' 「' + spec.name + '」升至 Lv.' + (lv + 1));
        logAction(m.name + ' ' + spec.name + ' Lv.' + (lv + 1), 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 手足 ———
    window.doSiblingAct = function (actId, indexA, indexB) {
        ensureDescData();
        var act = (D().siblingActs || []).find(function (a) { return a.id === actId; });
        var members = player.children.children || [];
        var a = members[indexA];
        var b = members[indexB];
        if (!act || !a || !b) return;
        if (indexA === indexB) return logAction('请选择两位不同成员', 'error');
        // 同父母或同代优先，也允许旁系
        var cdKey = act.id + ':' + [a.id || indexA, b.id || indexB].sort().join(':');
        var left = (player.children.desc.siblingCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('冷却中（剩 ' + Math.ceil(left / 60000) + ' 分）', 'info');
        if (funds().availableFunds < act.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= act.cost;
        player.children.desc.siblingCd[cdKey] = Date.now() + act.cd;
        var key = [a.id || indexA, b.id || indexB].sort().join(':');
        if (!a.descSiblingBond) a.descSiblingBond = {};
        if (!b.descSiblingBond) b.descSiblingBond = {};
        a.descSiblingBond[key] = (a.descSiblingBond[key] || 0) + act.bond;
        b.descSiblingBond[key] = (b.descSiblingBond[key] || 0) + act.bond;
        if (act.attr) {
            if (a.attributes) a.attributes[act.attr] = (a.attributes[act.attr] || 0) + 1;
            if (b.attributes) b.attributes[act.attr] = (b.attributes[act.attr] || 0) + 1;
        }
        addMood(act.mood || 0);
        var line = act.line.replace(/\{a\}/g, a.name).replace(/\{b\}/g, b.name);
        pushDiary(line);
        bump('sibling');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 师徒 ———
    window.doMentorTeach = function (mentorIndex, pupilIndex) {
        ensureDescData();
        var mt = D().mentor;
        var members = player.children.children || [];
        var mentor = members[mentorIndex];
        var pupil = members[pupilIndex];
        if (!mentor || !pupil) return;
        if (!isAdult(mentor)) return logAction('为师者须成年', 'error');
        if (isAdult(pupil)) return logAction('请选择未成年弟子', 'error');
        if (mentorIndex === pupilIndex) return logAction('不能自教', 'error');
        var cdKey = (mentor.id || mentorIndex) + ':' + (pupil.id || pupilIndex);
        var left = (player.children.desc.mentorCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('指点冷却中', 'info');
        if (funds().availableFunds < mt.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= mt.cost;
        player.children.desc.mentorCd[cdKey] = Date.now() + mt.cd;
        var attrs = ['intelligence', 'physique', 'charm', 'business'];
        var k = attrs[Math.floor(Math.random() * attrs.length)];
        if (mentor.attributes) mentor.attributes[k] = (mentor.attributes[k] || 0) + (mt.mentorGain || 1);
        if (pupil.attributes) {
            attrs.forEach(function (x) {
                pupil.attributes[x] = (pupil.attributes[x] || 0) + (x === k ? mt.pupilGain : 1);
            });
        }
        addFame(mentor, 3);
        addFame(pupil, 4);
        var line = mt.line.replace(/\{mentor\}/g, mentor.name).replace(/\{pupil\}/g, pupil.name);
        pushDiary(line);
        bump('mentor');
        logAction(line, 'success');
        refreshUI();
    };

    // ——— 同辈竞赛 ———
    window.enterDescendantContest = function (contestId, memberIndex) {
        ensureDescData();
        var contest = (D().contests || []).find(function (c) { return c.id === contestId; });
        var m = (player.children.children || [])[memberIndex];
        if (!contest || !m) return;
        if (!isAdult(m) && (m.growthStage || 0) < 3) return logAction('至少少年方可参赛', 'error');
        var left = (player.children.desc.contestCd[contest.id] || 0) - Date.now();
        if (left > 0 && !player.children.desc.contestReady) return logAction('该项竞赛冷却中', 'info');
        var cost = contest.cost;
        if (player.children.desc.contestReady) { cost = Math.floor(cost * 0.7); player.children.desc.contestReady = false; }
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        player.children.desc.contestCd[contest.id] = Date.now() + contest.cd;
        var score = (m.attributes && m.attributes[contest.attr]) || 1;
        var fameBonus = Math.floor((m.descFame || 0) / 50);
        var win = Math.random() < Math.min(0.85, 0.35 + score * 0.02 + fameBonus * 0.05);
        if (win) {
            m.attributes[contest.attr] = (m.attributes[contest.attr] || 0) + 4;
            addFame(m, contest.fame || 12);
            if (typeof addClanPrestige === 'function') addClanPrestige(contest.prestige || 8);
            pushDiary(m.name + ' 在「' + contest.name + '」中拔得头筹！');
            logAction(m.name + ' 赢得「' + contest.name + '」！', 'success');
        } else {
            m.attributes[contest.attr] = (m.attributes[contest.attr] || 0) + 1;
            addFame(m, 3);
            pushDiary(m.name + ' 惜败「' + contest.name + '」，回来加练。');
            logAction(m.name + ' 未夺冠，仍有收获', 'info');
        }
        bump('contest');
        refreshUI();
    };

    // ——— 同辈友人 ———
    window.meetPeerFriend = function (friendId, memberIndex) {
        ensureDescData();
        var fr = (D().peerFriends || []).find(function (f) { return f.id === friendId; });
        var m = (player.children.children || [])[memberIndex];
        if (!fr || !m) return;
        var cdKey = fr.id + ':' + (m.id || memberIndex);
        var left = (player.children.desc.peerCd[cdKey] || 0) - Date.now();
        if (left > 0) return logAction('冷却中（剩 ' + Math.ceil(left / 60000) + ' 分）', 'info');
        if (funds().availableFunds < fr.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= fr.cost;
        player.children.desc.peerCd[cdKey] = Date.now() + fr.cd;
        if (m.attributes && fr.attr) m.attributes[fr.attr] = (m.attributes[fr.attr] || 0) + (fr.gain || 2);
        addFame(m, fr.fame || 2);
        addMood(3);
        pushDiary(m.name + ' 与「' + fr.name + '」往来，见闻又广了一寸。');
        logAction(m.name + ' 结交「' + fr.name + '」', 'success');
        refreshUI();
    };

    // ——— 嫡系 ———
    window.designateFamilyHeir = function (memberIndex) {
        ensureDescData();
        var m = (player.children.children || [])[memberIndex];
        var heir = D().heir;
        if (!m || !isAdult(m)) return logAction('嫡系须选成年子弟', 'error');
        var cost = player.children.desc.heirReady ? 0 : heir.cost;
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        player.children.desc.heirReady = false;
        player.children.desc.heirId = m.id;
        addFame(m, 20);
        if (typeof addClanPrestige === 'function') addClanPrestige(30);
        if (typeof addLineageExp === 'function') addLineageExp(25);
        var line = heir.line.replace(/\{name\}/g, m.name);
        pushDiary(line);
        logAction(line, 'success');
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        refreshUI();
    };

    // ——— 重掷血脉特质 ———
    window.rerollDescendantQuirk = function (memberIndex) {
        ensureDescData();
        var m = (player.children.children || [])[memberIndex];
        if (!m) return;
        var cost = 80000000;
        if (funds().availableFunds < cost) return logAction('资金不足', 'error');
        funds().availableFunds -= cost;
        var old = quirkOf(m).name;
        m.descQuirk = pick(D().bloodQuirks).id;
        pushDiary(m.name + ' 血脉特质由「' + old + '」转为「' + quirkOf(m).name + '」。');
        logAction(m.name + ' 新特质：' + quirkOf(m).name + '（' + quirkOf(m).desc + '）', 'success');
        refreshUI();
    };

    // ——— 三维 ———
    function calcDescWorld() {
        ensureDescData();
        var atk = 0, hp = 0, crit = 0, contrib = 0;
        (player.children.children || []).forEach(function (m) {
            initMemberDesc(m);
            var nat = natureOf(m);
            var quirk = quirkOf(m);
            atk += nat.worldAtk || 0;
            hp += nat.worldHp || 0;
            crit += nat.worldCritDmg || 0;
            atk += quirk.worldAtk || 0;
            hp += quirk.worldHp || 0;
            crit += quirk.worldCritDmg || 0;
            contrib += quirk.contrib || 0;
            var tier = fameTier(m);
            atk += tier.atk || 0;
            hp += tier.hp || 0;
            crit += tier.crit || 0;
            if (m.descAmbitionId) {
                var amb = (D().ambitions || []).find(function (a) { return a.id === m.descAmbitionId; });
                var lv = m.descAmbitionLv || 0;
                if (amb && amb.per) {
                    atk += lv * (amb.per.atk || 0);
                    hp += lv * (amb.per.hp || 0);
                    crit += lv * (amb.per.crit || 0);
                }
            }
            Object.keys(m.descSpecialties || {}).forEach(function (sid) {
                var spec = (D().specialties || []).find(function (s) { return s.id === sid; });
                var lv = m.descSpecialties[sid] || 0;
                if (!spec) return;
                atk += lv * (spec.atk || 0);
                hp += lv * (spec.hp || 0);
                crit += lv * (spec.crit || 0);
            });
            // 手足羁绊
            var sb = 0;
            Object.keys(m.descSiblingBond || {}).forEach(function (k) { sb += m.descSiblingBond[k]; });
            atk += Math.floor(sb / 30) * 0.3;
            hp += Math.floor(sb / 30) * 0.4;
        });
        var heirId = player.children.desc.heirId;
        if (heirId) {
            var heir = D().heir || {};
            atk += heir.atk || 0;
            hp += heir.hp || 0;
            crit += heir.crit || 0;
        }
        if (Date.now() < (player.children.desc.siblingBoostUntil || 0)) {
            hp += 3; atk += 2;
        }
        return { atk: atk, hp: hp, crit: crit, contrib: contrib };
    }

    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        installDescConfig();
        ensureDescData();
        var base = _origBonus ? _origBonus() : { worldAtk: 0, worldHp: 0, worldCritDmg: 0, contrib: 1 };
        var w = calcDescWorld();
        base.worldAtk = (base.worldAtk || 0) + w.atk;
        base.worldHp = (base.worldHp || 0) + w.hp;
        base.worldCritDmg = (base.worldCritDmg || 0) + w.crit;
        if (w.contrib) base.contrib = (base.contrib || 1) + w.contrib;
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
            ensureDescData();
            var d = player.children.desc;
            if (ch.effect === 'descSiblingHeal' || ch.effect === 'descSiblingBoost') {
                d.siblingBoostUntil = Date.now() + 6 * HOUR_MS;
                (player.children.children || []).forEach(function (m) {
                    Object.keys(m.descSiblingBond || {}).forEach(function (k) {
                        m.descSiblingBond[k] = (m.descSiblingBond[k] || 0) + 5;
                    });
                });
            } else if (ch.effect === 'descContestReady') {
                d.contestReady = true;
            } else if (ch.effect === 'descSchoolBoost') {
                (player.children.children || []).forEach(function (m) {
                    if (isAdult(m) || !m.descSchool) return;
                    Object.keys(m.descSchool).forEach(function (k) {
                        m.descSchool[k] = Math.min(100, (m.descSchool[k] || 0) + 10);
                    });
                });
            } else if (ch.effect === 'descAmbitionBoost') {
                (player.children.children || []).forEach(function (m) {
                    if (m.descAmbitionId) m.descAmbitionLv = Math.min(10, (m.descAmbitionLv || 0) + 1);
                });
            } else if (ch.effect === 'descSpecialtyReady') {
                d.specialtyReady = true;
            } else if (ch.effect === 'descHeirReady') {
                d.heirReady = true;
                logAction('可免费指定一次嫡系', 'success');
            } else if (ch.effect === 'descQuirkReroll') {
                var pool = (player.children.children || []).filter(function (m) { return !isAdult(m) || true; });
                if (pool.length) {
                    var t = pool[Math.floor(Math.random() * pool.length)];
                    t.descQuirk = pick(D().bloodQuirks).id;
                    logAction(t.name + ' 血脉特质显相为「' + quirkOf(t).name + '」', 'success');
                }
            }
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }

    function opts(filterFn) {
        return (player.children.children || []).map(function (m, i) {
            if (filterFn && !filterFn(m)) return '';
            var tier = fameTier(m);
            return '<option value="' + i + '">' + m.name + '（' + genLabel(m.generation || 1) + '·' + tier.name + '）</option>';
        }).join('');
    }

    function updateDescOverview() {
        var box = el('descOverviewPanel');
        if (!box) return;
        ensureDescData();
        var members = player.children.children || [];
        var heir = members.find(function (m) { return m.id === player.children.desc.heirId; });
        var html = '<div class="c-bonus-grid">' +
            '<div class="c-bonus-item"><div class="lab">子孙人数</div><div class="val">' + members.length + '</div></div>' +
            '<div class="c-bonus-item"><div class="lab">成年</div><div class="val">' + members.filter(isAdult).length + '</div></div>' +
            '<div class="c-bonus-item"><div class="lab">嫡系</div><div class="val">' + (heir ? heir.name : '未定') + '</div></div>' +
            '<div class="c-bonus-item"><div class="lab">总声望分</div><div class="val">' + members.reduce(function (s, m) { return s + (m.descFame || 0); }, 0) + '</div></div>' +
            '</div><p class="c-hint">每人有性格、血脉特质、声望档；可立志、修专精、参赛、结友。不改变婚育门禁。</p>';
        html += '<div class="c-member-grid" style="margin-top:8px;">' + members.slice(0, 12).map(function (m) {
            var nat = natureOf(m);
            var quirk = quirkOf(m);
            var tier = fameTier(m);
            return '<div class="c-member"><div class="name">' + m.name + '</div><div class="meta">' +
                genLabel(m.generation || 1) + ' · ' + (nat.name || '') + ' · ' + (quirk.name || '') +
                '<br>' + tier.name + '（' + (m.descFame || 0) + '）' +
                (m.descAmbitionId ? '<br>志：' + (((D().ambitions || []).find(function (a) { return a.id === m.descAmbitionId; }) || {}).name || '') + ' Lv.' + (m.descAmbitionLv || 0) : '') +
                '</div></div>';
        }).join('') + (members.length > 12 ? '<div class="c-hint">…另有 ' + (members.length - 12) + ' 人</div>' : '') + '</div>';
        box.innerHTML = html;
    }

    function updateDescHobbyPanel() {
        var box = el('descHobbyPanel');
        if (!box) return;
        ensureDescData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="descHobbyMember" class="c-input" onchange="refreshDescHobbyProgress()">' + opts() + '</select></div>' +
            '<div id="descHobbyProgress" class="c-hint" style="margin:6px 0;"></div>' +
            '<div class="c-train-grid">' + (D().hobbies || []).map(function (h) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + h.name + '</div><div class="ms-desc" id="descHobbyHint_' + h.id + '">' + fmt(h.cost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doDescendantHobby(\'' + h.id + '\',+document.getElementById(\'descHobbyMember\').value)">' + h.name + '</button></div>';
            }).join('') + '</div>';
        if (typeof window.refreshDescHobbyProgress === 'function') window.refreshDescHobbyProgress();
    }

    window.refreshDescHobbyProgress = function () {
        ensureDescData();
        var sel = el('descHobbyMember');
        var hint = el('descHobbyProgress');
        if (!sel || !hint) return;
        var m = (player.children.children || [])[Number(sel.value)];
        if (!m) { hint.textContent = ''; return; }
        hint.textContent = m.name + ' 已完成爱好 ' + (m.descHobbyCount || 0) + ' 次';
        (D().hobbies || []).forEach(function (h) {
            var node = el('descHobbyHint_' + h.id);
            if (!node) return;
            var cdKey = h.id + ':' + (m.id || sel.value);
            var until = player.children.desc.hobbyCd[cdKey] || 0;
            var left = Math.max(0, until - Date.now());
            node.textContent = fmt(h.cost) + (left > 0 ? (' · 冷却 ' + Math.ceil(left / 60000) + ' 分') : ' · 可进行');
        });
    };

    function updateDescSchoolPanel() {
        var box = el('descSchoolPanel');
        if (!box) return;
        ensureDescData();
        var kids = opts(function (m) { return !isAdult(m); });
        box.innerHTML = '<div class="c-form-row"><label>学子</label><select id="descSchoolMember" class="c-input" onchange="refreshDescSchoolProgress()">' + kids + '</select></div>' +
            '<div id="descSchoolProgress" class="c-hint" style="margin:6px 0;"></div>' +
            '<div class="c-train-grid">' + (D().school.subjects || []).map(function (s) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + s.name + '</div><div class="ms-desc" id="descSchoolHint_' + s.id + '">' + fmt(s.cost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-blue" onclick="studyDescendantSubject(\'' + s.id + '\',+document.getElementById(\'descSchoolMember\').value)">上课</button></div>';
            }).join('') + '</div>' +
            '<button class="c-btn c-btn-gold" style="margin-top:8px;width:100%;" onclick="takeDescendantExam(+document.getElementById(\'descSchoolMember\').value)">小考（' + fmt(D().school.examCost) + '）</button>';
        if (typeof window.refreshDescSchoolProgress === 'function') window.refreshDescSchoolProgress();
    }

    window.refreshDescSchoolProgress = function () {
        ensureDescData();
        var sel = el('descSchoolMember');
        var hint = el('descSchoolProgress');
        if (!sel || !hint) return;
        var m = (player.children.children || [])[Number(sel.value)];
        if (!m) { hint.textContent = ''; return; }
        var scores = m.descSchool || {};
        var parts = (D().school.subjects || []).map(function (s) {
            return s.name + (scores[s.id] != null ? scores[s.id] : 0);
        });
        hint.textContent = m.name + ' 功课：' + (parts.join(' / ') || '尚无');
        (D().school.subjects || []).forEach(function (s) {
            var node = el('descSchoolHint_' + s.id);
            if (!node) return;
            node.textContent = fmt(s.cost) + ' · 当前 ' + (scores[s.id] || 0);
        });
    };

    function updateDescAmbitionPanel() {
        var box = el('descAmbitionPanel');
        if (!box) return;
        ensureDescData();
        var o = opts(function (m) { return (m.growthStage || 0) >= 2 || isAdult(m); });
        var ready = !!(player.children.desc && player.children.desc.specialtyReady);
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="descAmbMember" class="c-input" onchange="refreshDescAmbitionProgress()">' + o + '</select></div>' +
            '<div id="descAmbProgress" class="c-hint" style="margin:6px 0;"></div>' +
            '<div class="c-train-grid">' + (D().ambitions || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div><div class="ms-desc">主属性 ' + a.attr + ' · 最高 Lv.' + a.max + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-purple" onclick="setDescendantAmbition(+document.getElementById(\'descAmbMember\').value,\'' + a.id + '\')">立志</button></div>';
            }).join('') + '</div>' +
            '<button class="c-btn c-btn-orange" style="width:100%;margin-top:8px;" onclick="trainDescendantAmbition(+document.getElementById(\'descAmbMember\').value)">深造志向</button>';
        if (typeof window.refreshDescAmbitionProgress === 'function') window.refreshDescAmbitionProgress();
    }

    window.refreshDescAmbitionProgress = function () {
        ensureDescData();
        var sel = el('descAmbMember');
        var hint = el('descAmbProgress');
        if (!sel || !hint) return;
        var m = (player.children.children || [])[Number(sel.value)];
        if (!m) { hint.textContent = ''; return; }
        var amb = (D().ambitions || []).find(function (a) { return a.id === m.descAmbitionId; });
        hint.textContent = amb
            ? (m.name + ' 当前志向「' + amb.name + '」Lv.' + (m.descAmbitionLv || 0) + '/' + amb.max)
            : (m.name + ' 尚未立志');
    };

    function updateDescSpecialtyPanel() {
        var box = el('descSpecialtyPanel');
        if (!box) return;
        ensureDescData();
        var o = opts(isAdult);
        var ready = !!(player.children.desc && player.children.desc.specialtyReady);
        box.innerHTML = '<div class="c-form-row"><label>成年</label><select id="descSpecMember" class="c-input" onchange="refreshDescSpecialtyProgress()">' + o + '</select></div>' +
            '<div id="descSpecProgress" class="c-hint" style="margin:6px 0;"></div>' +
            (ready ? '<div class="c-hint" style="color:#81C784;">★ 轶事：专精半价就绪</div>' : '') +
            '<div class="c-train-grid">' + (D().specialties || []).map(function (s) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + s.name + '</div><div class="ms-desc" id="descSpecHint_' + s.id + '">永久三维 · 最高 Lv.' + s.max + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-gold" onclick="upgradeDescendantSpecialty(+document.getElementById(\'descSpecMember\').value,\'' + s.id + '\')">修习</button></div>';
            }).join('') + '</div>';
        if (typeof window.refreshDescSpecialtyProgress === 'function') window.refreshDescSpecialtyProgress();
    }

    window.refreshDescSpecialtyProgress = function () {
        ensureDescData();
        var sel = el('descSpecMember');
        var hint = el('descSpecProgress');
        if (!sel || !hint) return;
        var m = (player.children.children || [])[Number(sel.value)];
        if (!m) { hint.textContent = ''; return; }
        var specs = m.descSpecialties || {};
        hint.textContent = m.name + ' 专精进度';
        (D().specialties || []).forEach(function (s) {
            var node = el('descSpecHint_' + s.id);
            if (!node) return;
            var lv = specs[s.id] || 0;
            node.textContent = 'Lv.' + lv + '/' + s.max + ' · 永久三维';
        });
    };

    function updateDescSiblingPanel() {
        var box = el('descSiblingPanel');
        if (!box) return;
        ensureDescData();
        var o = opts();
        box.innerHTML = '<div class="c-form-row"><label>甲</label><select id="descSibA" class="c-input">' + o + '</select></div>' +
            '<div class="c-form-row"><label>乙</label><select id="descSibB" class="c-input">' + o + '</select></div>' +
            '<div class="c-train-grid">' + (D().siblingActs || []).map(function (a) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + a.name + '</div><div class="ms-desc">羁绊+' + a.bond + ' · ' + fmt(a.cost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-pink" onclick="doSiblingAct(\'' + a.id + '\',+document.getElementById(\'descSibA\').value,+document.getElementById(\'descSibB\').value)">' + a.name + '</button></div>';
            }).join('') + '</div>';
    }

    function updateDescMentorPanel() {
        var box = el('descMentorPanel');
        if (!box) return;
        ensureDescData();
        box.innerHTML = '<div class="c-form-row"><label>为师（成年）</label><select id="descMentor" class="c-input">' + opts(isAdult) + '</select></div>' +
            '<div class="c-form-row"><label>弟子（未成年）</label><select id="descPupil" class="c-input">' + opts(function (m) { return !isAdult(m); }) + '</select></div>' +
            '<button class="c-btn c-btn-blue" style="width:100%;" onclick="doMentorTeach(+document.getElementById(\'descMentor\').value,+document.getElementById(\'descPupil\').value)">指点（' + fmt(D().mentor.cost) + '）</button>';
    }

    function updateDescContestPanel() {
        var box = el('descContestPanel');
        if (!box) return;
        ensureDescData();
        box.innerHTML = '<div class="c-form-row"><label>参赛</label><select id="descContestMember" class="c-input">' + opts() + '</select></div>' +
            (player.children.desc.contestReady ? '<div class="c-hint" style="color:#81C784;">竞赛优惠就绪</div>' : '') +
            '<div class="c-train-grid">' + (D().contests || []).map(function (c) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + c.name + '</div><div class="ms-desc">拼 ' + c.attr + ' · ' + fmt(c.cost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-orange" onclick="enterDescendantContest(\'' + c.id + '\',+document.getElementById(\'descContestMember\').value)">参赛</button></div>';
            }).join('') + '</div>';
    }

    function updateDescPeerPanel() {
        var box = el('descPeerPanel');
        if (!box) return;
        ensureDescData();
        box.innerHTML = '<div class="c-form-row"><label>成员</label><select id="descPeerMember" class="c-input">' + opts() + '</select></div>' +
            '<div class="c-train-grid">' + (D().peerFriends || []).map(function (f) {
                return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                    '<div class="ms-title">' + f.name + '</div><div class="ms-desc">' + fmt(f.cost) + '</div>' +
                    '<button class="c-btn c-btn-sm c-btn-green" onclick="meetPeerFriend(\'' + f.id + '\',+document.getElementById(\'descPeerMember\').value)">往来</button></div>';
            }).join('') + '</div>';
    }

    function updateDescHeirPanel() {
        var box = el('descHeirPanel');
        if (!box) return;
        ensureDescData();
        var heir = (player.children.children || []).find(function (m) { return m.id === player.children.desc.heirId; });
        var cost = player.children.desc.heirReady ? 0 : D().heir.cost;
        box.innerHTML = '<div class="c-hint">当前嫡系：' + (heir ? heir.name : '未指定') +
            ' · 嫡系提供永久世界地图三维</div>' +
            '<div class="c-form-row"><label>指定</label><select id="descHeirMember" class="c-input">' + opts(isAdult) + '</select></div>' +
            '<button class="c-btn c-btn-gold" style="width:100%;" onclick="designateFamilyHeir(+document.getElementById(\'descHeirMember\').value)">立嫡（' + fmt(cost) + '）</button>' +
            '<h4 style="margin:12px 0 8px;color:#E8C4A8;">血脉特质</h4>' +
            '<div class="c-form-row"><label>成员</label><select id="descQuirkMember" class="c-input">' + opts() + '</select></div>' +
            '<button class="c-btn c-btn-purple" style="width:100%;" onclick="rerollDescendantQuirk(+document.getElementById(\'descQuirkMember\').value)">推演重定特质（8000万）</button>';
    }

    window.updateDescendantPanels = function () {
        installDescConfig();
        ensureDescData();
        updateDescOverview();
        updateDescHobbyPanel();
        updateDescSchoolPanel();
        updateDescAmbitionPanel();
        updateDescSpecialtyPanel();
        updateDescSiblingPanel();
        updateDescMentorPanel();
        updateDescContestPanel();
        updateDescPeerPanel();
        updateDescHeirPanel();
    };

    // 不再挂到 updateLivingPanels（避免一次刷全家）；由 refreshActiveChildTabPanels 按页签刷新

    var _origSwitch = window.switchChildTab;
    window.switchChildTab = function (tab) {
        if (_origSwitch) _origSwitch(tab);
        var node = document.getElementById('childSectionDescendants');
        if (node) node.classList.toggle('active', tab === 'descendants');
    };

    // 染恙抗性：包装 infect 若存在 — 用 tick 侧无法直接，在 treat 外对强制感染做 quirk 检查较难
    // 简化：在 living infect 不可用时，对 startChildWork 无额外

    installDescConfig();
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            installDescConfig();
            ensureDescData();
        }, 2000);
    });
    if (document.readyState !== 'loading') {
        setTimeout(function () {
            installDescConfig();
            ensureDescData();
        }, 2000);
    }
})();

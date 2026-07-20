/**
 * 家族传承 · 智邻 × 祖宗十八代 联动
 * AI 读牌位/祝福/族谱/祭典/玄脉/子孙百态…；委托助立碑、陪进香、见证祀典、血脉参谋、圆桌「十八议题」
 * 在 descendants-npc-ai.js 之后加载。不改变婚育门禁。
 */
(function () {
    'use strict';
    var HOUR_MS = 60 * 60 * 1000;
    var CD_12H = 12 * HOUR_MS;

    function core() { return window.__npcCore || {}; }
    function cfg() { return window.lineageExtConfig; }
    function N() { return (cfg() && cfg().descNpc) || {}; }

    function genLabel(g) {
        return typeof getGenerationLabel === 'function' ? getGenerationLabel(g) : ('第' + g + '代');
    }

    function installLinkConfig() {
        if (!window.lineageExtConfig || !window.lineageExtConfig.descNpc) return;
        var c = window.lineageExtConfig;
        if (c._descNpcEighteenLinkInstalled) return;
        c._descNpcEighteenLinkInstalled = true;
        var D = c.descNpc;

        // 十八代专属委托
        D.eighteenCommissions = [
            { id: 'tablet_scout', name: '勘定牌位方位', npc: 'fortune', cost: 20000000, cd: 6 * HOUR_MS, needFavor: 25, needGen: 1,
              favor: 12, effect: 'tabletReady', fame: 4,
              line: '袁半仙绕祠堂走了三圈：「这一代牌位，宜立在偏东。」' },
            { id: 'incense_guide', name: '陪侍进香仪轨', npc: 'oldservant', cost: 15000000, cd: 5 * HOUR_MS, needFavor: 20,
              favor: 10, effect: 'incenseReady', fame: 3,
              line: '阿福把香摆正：「主家进香，我在侧边添灯。」' },
            { id: 'chronicle_copy', name: '誊抄族谱一页', npc: 'tutor', cost: 25000000, cd: 6 * HOUR_MS, needFavor: 30,
              favor: 14, effect: 'chronicleTip', fame: 5, attr: 'intelligence',
              line: '周塾师盯着墨迹：「字要立住，族谱才立住。」' },
            { id: 'rite_witness', name: '见证代际祀典', npc: 'neighbor', cost: 30000000, cd: 8 * HOUR_MS, needFavor: 25, needGen: 3,
              favor: 12, effect: 'riteReady', fame: 6,
              line: '赵二叔作揖：「祀典有邻里见证，香火才旺。」' },
            { id: 'seal_polish', name: '擦拭十八印匣', npc: 'blacksmith', cost: 22000000, cd: 6 * HOUR_MS, needFavor: 30, needGen: 6,
              favor: 14, effect: 'sealReady', fame: 5,
              line: '老周把印匣擦得发亮：「印是铁，人是火。」' },
            { id: 'blood_drill', name: '旁听血脉小课', npc: 'herb_boy', cost: 10000000, cd: 4 * HOUR_MS, needFavor: 15,
              favor: 8, effect: 'drillBoost', fame: 3,
              line: '小椿竖起耳朵：「族名默诵……我也能跟着念。」' },
            { id: 'match_gen', name: '按代议门第', npc: 'matchmaker', cost: 28000000, cd: 6 * HOUR_MS, needFavor: 35, needAdult: true,
              favor: 15, effect: 'marriageDiscount', fame: 6,
              line: '王媒婆掐指：「你们已到哪一代，门第就配哪一档——急不得。」' },
            { id: 'post_ancestral', name: '送祀典文书', npc: 'postmaster', cost: 18000000, cd: 5 * HOUR_MS, needFavor: 25, needAdult: true,
              favor: 11, effect: 'resonanceBoost', fame: 4, attr: 'physique',
              line: '老吴把文书护到驿路尽头：「十八代的名，路上有人认得。」' }
        ];

        // 十八议题圆桌（AI 议事扩展）
        D.eighteenCouncil = [
            { id: 'tablet_plan', name: '牌位立碑计划', cost: 35000000, cd: 8 * HOUR_MS, needNpcs: 3, prestige: 10,
              effect: 'tabletReady', worldHp: 0.8, worldCritDmg: 0.5,
              line: '圆桌议定：先立能立的代，再追远。邻里愿来见证。' },
            { id: 'blessing_path', name: '代际祝福路线', cost: 40000000, cd: 8 * HOUR_MS, needNpcs: 3, prestige: 12,
              effect: 'blessingFocus', worldAtk: 0.6, worldHp: 0.6, worldCritDmg: 0.6,
              line: '众人对照祝福节点：开宗、三世、来孙……一步步点亮，比一口吃成胖子强。' },
            { id: 'depth_sync', name: '玄脉与人间同步', cost: 45000000, cd: 8 * HOUR_MS, needNpcs: 3, prestige: 12, needGen: 3,
              effect: 'depthReady', worldAtk: 1.0, worldHp: 0.5,
              line: '铁匠谈火，郎中谈气，半仙谈星：玄脉要修，烟火也不能断。' },
            { id: 'heir_eighteen', name: '十八代传人择选', cost: 50000000, cd: CD_12H, needNpcs: 3, prestige: 15, needGen: 5,
              effect: 'heirAdvice', worldCritDmg: 1.0,
              line: '塾师与媒婆罕见地达成一致：传人先看心，再看名，最后才看银子。' }
        ];

        // 血脉参谋话术意图（挂到 intents）
        var bloodIntents = [
            { id: 'blood_ask', name: '请教血脉', tags: ['eighteen'], favor: 5, mood: 2 },
            { id: 'tablet_worry', name: '忧心牌位', tags: ['eighteen'], favor: 4, mood: 2 },
            { id: 'gen_proud', name: '炫耀代数', tags: ['eighteen'], favor: 3, mood: 5 },
            { id: 'ritual_ask', name: '请教祭典', tags: ['eighteen'], favor: 5, mood: 2, needFavor: 20 }
        ];
        D.intents = (D.intents || []).concat(bloodIntents.filter(function (it) {
            return !(D.intents || []).some(function (x) { return x.id === it.id; });
        }));

        // 给关键 NPC 加 bloodline 话题
        (D.npcs || []).forEach(function (npc) {
            if (['fortune', 'oldservant', 'tutor', 'neighbor', 'doctor', 'matchmaker', 'postmaster', 'blacksmith'].indexOf(npc.id) >= 0) {
                if ((npc.topics || []).indexOf('bloodline') < 0) npc.topics.push('bloodline');
            }
        });

        var moreEvents = [
            { id: 'npc_eighteen_tablet', title: '邻里助立碑', text: '智邻们说：牌位殿还空着几代，愿来帮衬香火。',
              choices: [
                { label: '请他们参谋立碑', cost: 100000000, effect: 'npcLinkTabletReady', prestige: 22, worldHp: 5 },
                { label: '请吃茶致谢', cost: 40000000, effect: 'npcFavorAll', prestige: 12 },
                { label: '自家慢慢来', cost: 0, effect: 'none', prestige: 3 }
              ]},
            { id: 'npc_eighteen_ritual', title: '祭典想请邻里', text: '十八代祭典在即。有人提议请智邻观礼，香火更旺。',
              choices: [
                { label: '正式邀请观礼', cost: 120000000, effect: 'npcLinkRitualReady', prestige: 24, worldAtk: 4, worldHp: 4 },
                { label: '只请最熟的几位', cost: 50000000, effect: 'npcLinkResonance', prestige: 14 },
                { label: '家祭不外传', cost: 0, effect: 'none', prestige: 2 }
              ]}
        ];
        c.events = (c.events || []).concat(moreEvents.filter(function (e) {
            return !(c.events || []).some(function (x) { return x.id === e.id; });
        }));

        var moreQuests = [
            { id: 'link_tablet1', name: '智邻助碑', desc: '完成十八代联动委托/立碑参谋 1 次', need: 1, key: 'npcEighteen', rewardPrestige: 20, rewardFunds: 10000000, rewardExp: 16 },
            { id: 'link_blood1', name: '血脉请教', desc: '血脉意图对话或血脉参谋 1 次', need: 1, key: 'npcBloodTalk', rewardPrestige: 14, rewardFunds: 5000000, rewardExp: 12 },
            { id: 'link_council1', name: '十八议事', desc: '召开十八议题圆桌 1 次', need: 1, key: 'npcEighteenCouncil', rewardPrestige: 22, rewardFunds: 12000000, rewardExp: 18 }
        ];
        c.dailyQuests = (c.dailyQuests || []).concat(moreQuests.filter(function (q) {
            return !(c.dailyQuests || []).some(function (x) { return x.id === q.id; });
        }));
    }

    function ensureLinkData() {
        if (!player.children) return;
        if (core().ensure) core().ensure();
        installLinkConfig();
        var d = player.children.descNpc;
        if (!d) return;
        if (!d.linkCd || typeof d.linkCd !== 'object') d.linkCd = {};
        if (!d.eighteenCommCd || typeof d.eighteenCommCd !== 'object') d.eighteenCommCd = {};
        if (!d.eighteenCouncilCd || typeof d.eighteenCouncilCd !== 'object') d.eighteenCouncilCd = {};
        if (d.tabletReady == null) d.tabletReady = false;
        if (d.incenseReady == null) d.incenseReady = false;
        if (d.riteReady == null) d.riteReady = false;
        if (d.sealLinkReady == null) d.sealLinkReady = false;
        if (d.drillBoost == null) d.drillBoost = false;
        if (d.blessingFocus == null) d.blessingFocus = false;
        if (d.depthLinkReady == null) d.depthLinkReady = false;
        if (d.heirAdvice == null) d.heirAdvice = false;
        if (d.chronicleTip == null) d.chronicleTip = false;
    }

    function snapEighteen() {
        var eg = (player.children && player.children.eighteen) || {};
        var tablets = eg.tablets || {};
        var tabletCount = 0;
        var missing = [];
        var maxG = 0;
        (player.children.children || []).forEach(function (m) {
            maxG = Math.max(maxG, m.generation || 1);
        });
        for (var g = 1; g <= Math.min(18, Math.max(maxG, 1)); g++) {
            if (tablets[g]) tabletCount++;
            else if (maxG >= g) missing.push(g);
        }
        var blessingsOn = [];
        var blessingsOff = [];
        var conf = cfg() && cfg().eighteen;
        (conf && conf.blessings || []).forEach(function (b) {
            if (maxG >= b.gen) blessingsOn.push(b.name);
            else blessingsOff.push(b.name + '(需' + genLabel(b.gen) + ')');
        });
        var depth = player.children.eighteenDepth || {};
        var living = player.children.living || {};
        var lamp = living.lampLevel || 0;
        var parts = typeof calcEighteenWorldParts === 'function' ? calcEighteenWorldParts() : null;
        var descCount = (player.children.children || []).length;
        var married = (player.children.children || []).filter(function (m) {
            return m.isMarried || m.married || (m.spouse && m.spouse.name);
        }).length;
        var withAmbition = (player.children.children || []).filter(function (m) { return m.descAmbitionId; }).length;
        var filialHigh = (player.children.children || []).filter(function (m) { return (m.filialScore || 0) >= 80; }).length;
        return {
            maxG: maxG,
            tabletCount: tabletCount,
            missing: missing,
            freeTablet: !!eg.freeTablet,
            chronicleLv: eg.chronicleLevel || 0,
            ritualOn: Date.now() < (eg.ritualUntil || 0),
            ritualCd: Math.max(0, (eg.ritualLast || 0) + ((conf && conf.ritualCooldown) || 8 * HOUR_MS) - Date.now()),
            blessingsOn: blessingsOn,
            blessingsOff: blessingsOff,
            lamp: lamp,
            altarLv: depth.altarLv || 0,
            sealCount: depth.seals ? Object.keys(depth.seals).filter(function (k) { return depth.seals[k]; }).length : 0,
            resonance: parts ? parts.total : null,
            descCount: descCount,
            married: married,
            withAmbition: withAmbition,
            filialHigh: filialHigh,
            ziBei: !!(cfg() && cfg().living && cfg().living.real && cfg().living.real.generationPoem)
        };
    }

    function buildEighteenBriefLines() {
        var s = snapEighteen();
        var lines = [];
        lines.push('【十八代联动】最远' + genLabel(s.maxG || 1) + ' · 牌位 ' + s.tabletCount + '/18 · 族谱 Lv.' + s.chronicleLv + ' · 传灯 ' + s.lamp + '/18');
        if (s.freeTablet || (player.children.descNpc && player.children.descNpc.tabletReady)) {
            lines.push('★ 立碑助力就绪（轶事/智邻）——可去「十八代」牌位殿立碑。');
        }
        if (s.missing.length) {
            lines.push('可立未立：' + s.missing.slice(0, 5).map(genLabel).join('、') + (s.missing.length > 5 ? '…' : '') + ' —— 可接「勘定牌位」委托或开「牌位立碑」圆桌。');
        } else if (s.maxG >= 1) {
            lines.push('✓ 已触及代数的牌位均已立。可冲刺更远代或点亮祝福：' + (s.blessingsOff[0] || '终世不灭'));
        }
        if (s.blessingsOn.length) lines.push('已亮祝福：' + s.blessingsOn.join('、'));
        if (s.ritualOn) lines.push('祭典进行中。智邻观礼意愿高，适合意图「请教祭典」。');
        else if (s.ritualCd > 0) lines.push('祭典冷却中。可先做进香/祀典/誊谱委托。');
        else lines.push('祭典可开。可办「邻里观礼」轶事或请阿福陪侍进香。');
        if (s.altarLv > 0 || s.sealCount > 0) {
            lines.push('玄脉：坛 Lv.' + s.altarLv + ' · 印 ' + s.sealCount + ' 枚——可开「玄脉与人间同步」圆桌。');
        }
        lines.push('子孙：' + s.descCount + ' 人 · 成婚 ' + s.married + ' · 立志 ' + s.withAmbition + ' · 孝名显 ' + s.filialHigh + ' —— 媒婆/塾师可联动参谋。');
        if (s.resonance) {
            lines.push('血脉共鸣合计 攻+' + (s.resonance.atk * 100).toFixed(0) + '% / 血+' + (s.resonance.hp * 100).toFixed(0) + '% / 爆+' + (s.resonance.crit * 100).toFixed(0) + '%');
        }
        return lines.join('\n');
    }

    function enrichBloodReply(npc, topic, member, baseReply) {
        var s = snapEighteen();
        var extra = [];
        if (topic === 'bloodline' || topic === 'family' || topic === 'blood_ask' || topic === 'tablet_worry' || topic === 'gen_proud' || topic === 'ritual_ask') {
            extra.push('（对方看了看你们家牌位殿的方向）');
            extra.push('你们现至' + genLabel(s.maxG || 1) + '，牌位 ' + s.tabletCount + ' 座，族谱 ' + s.chronicleLv + ' 级。');
            if (topic === 'tablet_worry' || (s.missing.length && topic === 'bloodline')) {
                if (s.missing.length) {
                    extra.push('我盯着还空着的' + genLabel(s.missing[0]) + '牌位：该立就立，香火断不得。');
                } else {
                    extra.push('牌位殿眼下倒整齐。你是心事太多，不是碑太少。');
                }
            }
            if (topic === 'gen_proud') {
                extra.push(s.maxG >= 9
                    ? '代是远了。越远越要低头看灯，别只仰头数星。'
                    : '代数还在长，先把脚下的祠阶走实，再吹。');
            }
            if (topic === 'ritual_ask') {
                extra.push(s.ritualOn
                    ? '祭典这会儿正旺。去添一炷，比说话管用。'
                    : '祭典仪轨：心诚、位正、人齐。邻里能来观礼更好。');
            }
            if (npc.id === 'oldservant') extra.push('老宅门槛那道印，是十八代踩出来的。我还守着。');
            if (npc.id === 'fortune') extra.push('命盘上族星' + (s.maxG >= 12 ? '已成串' : '还在聚') + '。护祠堂，就是护气运。');
            if (npc.id === 'matchmaker' && member) {
                extra.push(member.isMarried || member.married
                    ? member.name + '已成家。下一代的门第，要配你们现在的代数。'
                    : member.name + '若议亲，按' + genLabel(member.generation || 1) + '来配，莫高攀到摔着。');
            }
            if (npc.id === 'tutor') extra.push('族谱誊一页，胜过空谈十八代。字在，人就在。');
        }
        if (!extra.length) return baseReply;
        return baseReply + '\n' + extra.join('\n');
    }

    // 钩子：加长简报
    var _origRefreshBrief = window.refreshNpcBriefing;
    window.refreshNpcBriefing = function () {
        ensureLinkData();
        if (_origRefreshBrief) _origRefreshBrief();
        var d = player.children.descNpc;
        if (!d) return;
        var block = buildEighteenBriefLines();
        if (d.briefing && d.briefing.indexOf('【十八代联动】') < 0) {
            d.briefing = d.briefing + '\n\n' + block;
        } else {
            d.briefing = (d.briefing || '') + (d.briefing && d.briefing.indexOf('【十八代联动】') >= 0 ? '' : '\n\n' + block);
            // 若已有旧块，整段替换更干净
            if (d.briefing.indexOf('【十八代联动】') >= 0) {
                var head = d.briefing.split('【十八代联动】')[0].replace(/\n+$/, '');
                d.briefing = head + '\n\n' + block;
            }
        }
        if (typeof updateDescNpcPanels === 'function') updateDescNpcPanels();
    };

    // 钩子：对话 enrichment 链
    var _prevEnrich = window.npcPlusEnrichReply;
    window.npcPlusEnrichReply = function (npc, topic, member, s, reply) {
        var r = reply;
        if (_prevEnrich) {
            try { r = _prevEnrich(npc, topic, member, s, reply) || r; } catch (e) { /* ignore */ }
        }
        try {
            ensureLinkData();
            r = enrichBloodReply(npc, topic, member, r) || r;
        } catch (e2) { /* ignore */ }
        return r;
    };

    var _prevTopic = window.npcPlusTopicLabel;
    window.npcPlusTopicLabel = function (t) {
        if (t === 'bloodline') return '血脉十八代';
        if (t === 'blood_ask') return '请教血脉';
        if (t === 'tablet_worry') return '忧心牌位';
        if (t === 'gen_proud') return '炫耀代数';
        if (t === 'ritual_ask') return '请教祭典';
        return _prevTopic ? _prevTopic(t) : null;
    };

    // 意图对话后若为血脉类，记任务
    var _origIntent = window.talkNpcIntent;
    if (_origIntent) {
        window.talkNpcIntent = function (npcId, intentId, memberIdx) {
            _origIntent(npcId, intentId, memberIdx);
            if (['blood_ask', 'tablet_worry', 'gen_proud', 'ritual_ask'].indexOf(intentId) >= 0) {
                if (core().bump) core().bump('npcBloodTalk');
                var d = player.children.descNpc;
                var npc = (N().npcs || []).find(function (x) { return x.id === npcId; });
                var m = core().getMember && core().getMember(memberIdx);
                if (d && d.lastChat && npc) {
                    d.lastChat.reply = enrichBloodReply(npc, intentId, m, d.lastChat.reply || '');
                }
            }
        };
    }

    // talkToNpc bloodline topic
    var _origTalk = window.talkToNpc;
    if (_origTalk) {
        window.talkToNpc = function (npcId, topic, memberIdx) {
            _origTalk(npcId, topic, memberIdx);
            if (topic === 'bloodline') {
                if (core().bump) core().bump('npcBloodTalk');
            }
        };
    }

    function applyLinkEffect(effect) {
        var d = player.children.descNpc;
        var eg = player.children.eighteen;
        if (!d) return;
        if (effect === 'tabletReady') {
            d.tabletReady = true;
            if (eg) eg.freeTablet = true;
            logAction('智邻助力：下一次立碑免费/就绪', 'success');
        } else if (effect === 'incenseReady') {
            d.incenseReady = true;
            if (player.children.living) player.children.living.incenseLast = 0;
            logAction('进香仪轨已备，可立即进香', 'success');
        } else if (effect === 'chronicleTip') {
            d.chronicleTip = true;
            logAction('誊谱有得：修撰族谱时可获智邻指点（见联动面板）', 'success');
        } else if (effect === 'riteReady') {
            d.riteReady = true;
            logAction('祀典见证就绪，举行祀典更顺利', 'success');
        } else if (effect === 'sealReady') {
            d.sealLinkReady = true;
            if (player.children.eighteenDepth) player.children.eighteenDepth.sealReady = true;
            logAction('十八印匣已净，祭炼/启封更顺', 'success');
        } else if (effect === 'drillBoost') {
            d.drillBoost = true;
            logAction('血脉小课旁听加成就绪', 'success');
        } else if (effect === 'marriageDiscount') {
            if (player.children.living) {
                player.children.living.marriageDiscountUntil = Date.now() + 12 * HOUR_MS;
            }
            logAction('按代议亲：联姻费用十二小时内七折', 'success');
        } else if (effect === 'resonanceBoost') {
            if (eg) eg.resonanceBonusUntil = Date.now() + 12 * HOUR_MS;
            logAction('血脉共鸣增强 12 小时', 'success');
        } else if (effect === 'blessingFocus') {
            d.blessingFocus = true;
            if (eg) eg.resonanceBonusUntil = Date.now() + 8 * HOUR_MS;
            logAction('祝福路线议定：共鸣短时增强', 'success');
        } else if (effect === 'depthReady') {
            d.depthLinkReady = true;
            if (player.children.eighteenDepth) {
                player.children.eighteenDepth.altarReady = true;
                player.children.eighteenDepth.breakReady = true;
            }
            logAction('玄脉与人间同步：坛/破境就绪', 'success');
        } else if (effect === 'heirAdvice') {
            d.heirAdvice = true;
            logAction('传人择选议定：可在百态「立嫡」参考智邻意见', 'success');
        }
    }

    // ——— 十八代委托 ———
    window.doNpcEighteenCommission = function (commId, memberIdx) {
        ensureLinkData();
        var C = core();
        var act = (N().eighteenCommissions || []).find(function (x) { return x.id === commId; });
        var m = C.getMember && C.getMember(memberIdx);
        if (!act || !m) return;
        var s = snapEighteen();
        if (act.needGen && s.maxG < act.needGen) return logAction('需触及' + genLabel(act.needGen), 'error');
        if (act.needAdult && !C.isAdult(m)) return logAction('需成年', 'error');
        var fav = player.children.descNpc.favor[act.npc] || 0;
        if (fav < (act.needFavor || 0)) return logAction('好感不足（需' + act.needFavor + '）', 'error');
        var d = player.children.descNpc;
        if (C.cdLeft(d.eighteenCommCd[commId]) > 0) return logAction(C.cdHint(d.eighteenCommCd[commId]), 'info');
        if (!C.pay(act.cost)) return;
        d.eighteenCommCd[commId] = Date.now() + act.cd;
        C.addFavor(act.npc, act.favor || 10);
        C.addFame(m, act.fame || 0);
        if (act.attr) C.addAttr(m, act.attr, 2);
        applyLinkEffect(act.effect);
        C.bump('npcEighteen');
        var npc = (N().npcs || []).find(function (x) { return x.id === act.npc; });
        var line = (act.line || '').replace(/\{name\}/g, m.name);
        C.remember(act.npc, '十八代委托：' + act.name);
        C.pushDiary(line);
        logAction(line, 'success');
        C.refreshUI();
    };

    // ——— 十八议题圆桌 ———
    window.startEighteenNpcCouncil = function (topicId, n1, n2, n3, memberIdx) {
        ensureLinkData();
        var C = core();
        var topic = (N().eighteenCouncil || []).find(function (x) { return x.id === topicId; });
        if (!topic) return;
        var s = snapEighteen();
        if (topic.needGen && s.maxG < topic.needGen) return logAction('需触及' + genLabel(topic.needGen), 'error');
        var ids = [n1, n2, n3];
        var uniq = {};
        ids.forEach(function (id) { if (id) uniq[id] = true; });
        if (Object.keys(uniq).length < 3) return logAction('请选三位不同智邻', 'error');
        var d = player.children.descNpc;
        if (C.cdLeft(d.eighteenCouncilCd[topicId]) > 0) return logAction(C.cdHint(d.eighteenCouncilCd[topicId]), 'info');
        if (!C.pay(topic.cost)) return;
        d.eighteenCouncilCd[topicId] = Date.now() + topic.cd;
        ids.forEach(function (id) { C.addFavor(id, 7); });
        C.addMood(5);
        C.addTempWorld(topic.worldAtk, topic.worldHp, topic.worldCritDmg, 6);
        player.children.clanPrestige = (player.children.clanPrestige || 0) + (topic.prestige || 0);
        applyLinkEffect(topic.effect);
        C.bump('npcEighteenCouncil');
        var names = ids.map(function (id) {
            var n = (N().npcs || []).find(function (x) { return x.id === id; });
            return n ? n.name : id;
        }).join('、');
        var text = '【十八议事·' + topic.name + '】' + names + '出席。最远' + genLabel(s.maxG) + '、牌位' + s.tabletCount + '。' + topic.line;
        d.lastChat = { npcId: n1, topic: 'bloodline', reply: text, at: Date.now() };
        C.pushDiary(text);
        logAction(text, 'success');
        C.refreshUI();
    };

    // ——— 一键：智邻陪同立碑 ———
    window.npcAssistErectTablet = function (gen, npcId, memberIdx) {
        ensureLinkData();
        var C = core();
        gen = Number(gen);
        if (!gen || gen < 1 || gen > 18) return logAction('代数无效', 'error');
        var d = player.children.descNpc;
        var key = 'assistTablet:' + gen;
        if (C.cdLeft(d.linkCd[key]) > 0) return logAction(C.cdHint(d.linkCd[key]), 'info');
        if ((d.favor[npcId] || 0) < 20) return logAction('请选好感≥20的智邻陪同', 'error');
        if (!C.pay(15000000)) return;
        d.linkCd[key] = Date.now() + 4 * HOUR_MS;
        d.tabletReady = true;
        if (player.children.eighteen) player.children.eighteen.freeTablet = true;
        C.addFavor(npcId, 6);
        C.bump('npcEighteen');
        var npc = (N().npcs || []).find(function (x) { return x.id === npcId; });
        logAction((npc ? npc.name : '智邻') + '陪同勘定' + genLabel(gen) + '：下次立该碑免费。请前往「十八代」立碑。', 'success');
        if (typeof erectGenerationTablet === 'function') {
            // 不自动立，让玩家去十八代页；若已就绪可提示
        }
        C.refreshUI();
    };

    // ——— 智邻陪先进香 ———
    window.npcAssistIncense = function (npcId) {
        ensureLinkData();
        var C = core();
        var d = player.children.descNpc;
        if (C.cdLeft(d.linkCd.incense) > 0) return logAction(C.cdHint(d.linkCd.incense), 'info');
        if ((d.favor[npcId] || 0) < 15) return logAction('好感不足', 'error');
        if (!C.pay(10000000)) return;
        d.linkCd.incense = Date.now() + 5 * HOUR_MS;
        if (player.children.living) player.children.living.incenseLast = 0;
        C.addFavor(npcId, 5);
        C.bump('npcEighteen');
        if (typeof offerEighteenIncense === 'function') {
            offerEighteenIncense();
        } else {
            logAction('进香冷却已刷新，请到十八代页进香', 'success');
        }
        C.refreshUI();
    };

    // ——— 誊谱加成修撰 ———
    window.npcBoostChronicle = function (npcId) {
        ensureLinkData();
        var C = core();
        var d = player.children.descNpc;
        if (!d.chronicleTip && (d.favor[npcId] || 0) < 30) return logAction('需誊谱委托就绪或塾师好感≥30', 'error');
        if (C.cdLeft(d.linkCd.chronicle) > 0) return logAction(C.cdHint(d.linkCd.chronicle), 'info');
        if (!C.pay(30000000)) return;
        d.linkCd.chronicle = Date.now() + CD_12H;
        d.chronicleTip = false;
        if (player.children.eighteen) {
            player.children.eighteen.chronicleLevel = (player.children.eighteen.chronicleLevel || 0) + 1;
        }
        C.addFavor(npcId, 8);
        C.bump('npcEighteen');
        logAction('在智邻指点下，族谱大典直接提升 1 级！', 'success');
        C.refreshUI();
    };

    // ——— 血脉参谋（综合报告）——
    window.askBloodlineCounsel = function (npcId, memberIdx) {
        ensureLinkData();
        var C = core();
        var d = player.children.descNpc;
        if (C.cdLeft(d.linkCd.counsel) > 0) return logAction(C.cdHint(d.linkCd.counsel), 'info');
        if ((d.favor[npcId] || 0) < 25) return logAction('好感需≥25', 'error');
        if (!C.pay(12000000)) return;
        d.linkCd.counsel = Date.now() + 4 * HOUR_MS;
        C.addFavor(npcId, 5);
        C.bump('npcBloodTalk');
        var s = snapEighteen();
        var npc = (N().npcs || []).find(function (x) { return x.id === npcId; });
        var m = C.getMember && C.getMember(memberIdx);
        var lines = [
            '【血脉参谋·' + (npc ? npc.name : '') + '】',
            '代数 ' + genLabel(s.maxG) + ' · 牌位 ' + s.tabletCount + ' · 族谱 Lv.' + s.chronicleLv + ' · 玄脉坛 Lv.' + s.altarLv + ' · 印 ' + s.sealCount,
            s.missing.length ? ('建议优先立：' + s.missing.slice(0, 3).map(genLabel).join('、')) : '牌位进度良好，可冲刺祝福「' + (s.blessingsOff[0] || '终世') + '」',
            s.ritualOn ? '祭典正旺，宜进香、宜观礼。' : '祭典可排期；可先做陪侍进香委托。',
            '子孙侧：立志 ' + s.withAmbition + ' 人，孝名显 ' + s.filialHigh + ' 人——百态/世系可继续养。',
            m ? ('至于' + m.name + '：' + ((m.generation || 1) >= s.maxG - 1 ? '已近族中锋线，宜破境/专精。' : '尚可在烟火与学业里扎实。')) : ''
        ];
        var text = lines.filter(Boolean).join('\n');
        d.lastChat = { npcId: npcId, topic: 'bloodline', reply: text, at: Date.now() };
        C.pushDiary('听了血脉参谋。');
        logAction(text, 'info');
        // 刷新简报附带十八代
        if (typeof refreshNpcBriefing === 'function') refreshNpcBriefing();
        C.refreshUI();
    };

    var _origResolve = window.resolveClanEvent;
    if (_origResolve) {
        window.resolveClanEvent = function (choiceIndex) {
            var ev = player.children && player.children.activeEvent;
            var ch = ev && ev.choices && ev.choices[choiceIndex];
            var result = _origResolve(choiceIndex);
            if (!ch) return result;
            ensureLinkData();
            if (ch.effect === 'npcLinkTabletReady') applyLinkEffect('tabletReady');
            else if (ch.effect === 'npcLinkRitualReady') {
                if (player.children.eighteen) player.children.eighteen.ritualLast = 0;
                logAction('祭典可立即开启（智邻观礼）', 'success');
            } else if (ch.effect === 'npcLinkResonance') applyLinkEffect('resonanceBoost');
            return result;
        };
    }

    // 立碑时若 tabletReady，清标记
    var _origErect = window.erectGenerationTablet;
    if (_origErect) {
        window.erectGenerationTablet = function (gen) {
            _origErect(gen);
            if (player.children.descNpc) player.children.descNpc.tabletReady = false;
        };
    }

    // ——— UI ———
    function el(id) { return document.getElementById(id); }
    function memberOpts() {
        return (player.children.children || []).map(function (m, i) {
            return '<option value="' + i + '">' + m.name + '（' + genLabel(m.generation || 1) + '）</option>';
        }).join('');
    }
    function npcOpts(minFavor) {
        var d = player.children.descNpc;
        minFavor = minFavor || 0;
        return (N().npcs || []).map(function (n) {
            var f = d.favor[n.id] || 0;
            if (f < minFavor) return '';
            return '<option value="' + n.id + '">' + n.name + '（' + f + '）</option>';
        }).join('');
    }

    function updateNpcEighteenLinkPanel() {
        var box = el('npcEighteenLinkPanel');
        if (!box) return;
        ensureLinkData();
        var C = core();
        var d = player.children.descNpc;
        var s = snapEighteen();
        var html = '<div class="c-hint">' + buildEighteenBriefLines().replace(/\n/g, '<br>') + '</div>';
        html += '<div class="c-hint" style="margin-top:8px;">可切换到侧栏「十八代」「玄脉」「百态/世系…」继续深造；此处智邻提供助力与参谋。</div>';

        html += '<div class="c-form-row"><label>子弟</label><select id="npcLinkMember" class="c-input">' + memberOpts() + '</select></div>';
        html += '<div class="c-form-row"><label>智邻</label><select id="npcLinkNpc" class="c-input">' + npcOpts() + '</select></div>';
        html += '<div class="c-form-row"><label>智邻B</label><select id="npcLinkNpcB" class="c-input">' + npcOpts() + '</select></div>';
        html += '<div class="c-form-row"><label>智邻C</label><select id="npcLinkNpcC" class="c-input">' + npcOpts() + '</select></div>';

        html += '<h4 style="color:#E8C4A8;margin:10px 0 6px;">血脉参谋 · 快捷助力</h4>';
        html += '<button class="c-btn c-btn-purple" style="width:100%;margin-top:4px;" onclick="askBloodlineCounsel(document.getElementById(\'npcLinkNpc\').value,+document.getElementById(\'npcLinkMember\').value)">请当前智邻作血脉参谋</button>';
        html += '<button class="c-btn c-btn-gold" style="width:100%;margin-top:6px;" onclick="npcAssistIncense(document.getElementById(\'npcLinkNpc\').value)">智邻陪先进香</button>';
        html += '<button class="c-btn c-btn-blue" style="width:100%;margin-top:6px;" onclick="npcBoostChronicle(document.getElementById(\'npcLinkNpc\').value)">智邻指点修撰族谱(+1级)</button>';

        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">陪同立碑（选代数）</h4><div class="c-train-grid">';
        for (var g = 1; g <= 18; g++) {
            var done = !!(player.children.eighteen && player.children.eighteen.tablets && player.children.eighteen.tablets[g]);
            var locked = s.maxG < g;
            html += '<div class="c-milestone' + (done ? ' done' : '') + '" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + genLabel(g) + '</div>' +
                '<button class="c-btn c-btn-sm c-btn-orange" ' + (done || locked ? 'disabled' : '') +
                ' onclick="npcAssistErectTablet(' + g + ',document.getElementById(\'npcLinkNpc\').value,+document.getElementById(\'npcLinkMember\').value)">' +
                (done ? '已立' : (locked ? '未及' : '陪同勘定')) + '</button></div>';
        }
        html += '</div>';

        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">十八代智邻委托</h4><div class="c-train-grid">';
        (N().eighteenCommissions || []).forEach(function (a) {
            var npc = (N().npcs || []).find(function (x) { return x.id === a.npc; });
            var cd = C.cdHint(d.eighteenCommCd[a.id]);
            html += '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + a.name + '</div>' +
                '<div class="ms-desc">' + (npc ? npc.name : '') + ' · 好感≥' + a.needFavor + (cd ? ' · ' + cd : '') + '</div>' +
                '<button class="c-btn c-btn-sm c-btn-pink" onclick="doNpcEighteenCommission(\'' + a.id + '\',+document.getElementById(\'npcLinkMember\').value)">接委托</button></div>';
        });
        html += '</div>';

        html += '<h4 style="color:#E8C4A8;margin:12px 0 6px;">十八议题圆桌</h4><div class="c-train-grid">';
        (N().eighteenCouncil || []).forEach(function (t) {
            var cd = C.cdHint(d.eighteenCouncilCd[t.id]);
            html += '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                '<div class="ms-title">' + t.name + '</div><div class="ms-desc">' + C.fmt(t.cost) + (cd ? ' · ' + cd : '') + '</div>' +
                '<button class="c-btn c-btn-sm c-btn-gold" onclick="startEighteenNpcCouncil(\'' + t.id +
                '\',document.getElementById(\'npcLinkNpc\').value,document.getElementById(\'npcLinkNpcB\').value,document.getElementById(\'npcLinkNpcC\').value,+document.getElementById(\'npcLinkMember\').value)">开会</button></div>';
        });
        html += '</div>';

        // 就绪状态条
        var flags = [];
        if (d.tabletReady || s.freeTablet) flags.push('立碑免费');
        if (d.incenseReady) flags.push('进香就绪');
        if (d.riteReady) flags.push('祀典见证');
        if (d.sealLinkReady) flags.push('印匣净');
        if (d.depthLinkReady) flags.push('玄脉就绪');
        if (d.heirAdvice) flags.push('传人议定');
        if (flags.length) html += '<div class="c-hint" style="margin-top:10px;color:#81C784;">当前联动就绪：' + flags.join(' · ') + '</div>';

        box.innerHTML = html;
    }

    // 十八代页小提示
    function updateEighteenNpcHint() {
        var box = el('eighteenNpcLinkHint');
        if (!box) return;
        ensureLinkData();
        var s = snapEighteen();
        var d = player.children.descNpc;
        box.innerHTML = '<div class="c-hint">智邻联动：牌位 ' + s.tabletCount + '/18 · 族谱 Lv.' + s.chronicleLv +
            (d.tabletReady || s.freeTablet ? ' · <span style="color:#81C784;">立碑助力就绪</span>' : '') +
            ' —— 详情见「智邻」页「十八代联动」。</div>' +
            '<button class="c-btn c-btn-sm c-btn-purple" onclick="switchChildTab(\'descnpc\')">前往智邻</button>';
    }

    var _origUpdate = window.updateDescNpcPanels;
    window.updateDescNpcPanels = function () {
        if (_origUpdate) _origUpdate();
        installLinkConfig();
        ensureLinkData();
        updateNpcEighteenLinkPanel();
        // 附带刷新简报十八代段
        var d = player.children.descNpc;
        if (d && d.briefing && d.briefing.indexOf('【十八代联动】') < 0) {
            d.briefing = d.briefing + '\n\n' + buildEighteenBriefLines();
        }
    };

    var _origEighteen = window.updateEighteenLifePanels;
    if (_origEighteen) {
        window.updateEighteenLifePanels = function () {
            _origEighteen();
            updateEighteenNpcHint();
        };
    }

    // 不再挂 updateLivingPanels 全量链；十八代页提示仅在对应刷新时更新
    var _origLiving = window.updateLivingPanels;
    window.updateLivingPanels = function () {
        if (_origLiving) _origLiving();
        if (typeof childTabIn === 'function' && !childTabIn(['eighteen', 'descnpc'])) return;
        updateEighteenNpcHint();
    };

    function boot() {
        setTimeout(function () {
            if (core().ensure) core().ensure();
            installLinkConfig();
            ensureLinkData();
        }, 3600);
    }
    document.addEventListener('DOMContentLoaded', boot);
    if (document.readyState !== 'loading') boot();
})();

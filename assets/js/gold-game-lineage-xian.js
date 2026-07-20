/**
 * 家族传承 · 修真界
 * 修炼 / 灵根 / 洞府 / 丹房 / 法宝 / 渡劫 → 世界地图攻/血/爆伤
 */
(function () {
    'use strict';
    var HOUR_MS = 60 * 60 * 1000;

    function cfg() { return window.lineageExtConfig; }
    function funds() { return player.investmentGame.userData; }
    function fmt(n) { return typeof formatSci === 'function' ? formatSci(n) : String(n); }
    function el(id) { return document.getElementById(id); }

    window.lineageXianConfig = {
        realms: [
            { id: 0, name: '凡人', atk: 0, hp: 0, crit: 0, cost: 0 },
            { id: 1, name: '炼气', atk: 2, hp: 2, crit: 1.5, cost: 50000000 },
            { id: 2, name: '筑基', atk: 4, hp: 4, crit: 3, cost: 200000000 },
            { id: 3, name: '金丹', atk: 7, hp: 7, crit: 5, cost: 800000000 },
            { id: 4, name: '元婴', atk: 11, hp: 11, crit: 8, cost: 3000000000 },
            { id: 5, name: '化神', atk: 16, hp: 16, crit: 12, cost: 12000000000 },
            { id: 6, name: '炼虚', atk: 22, hp: 22, crit: 17, cost: 50000000000 },
            { id: 7, name: '合体', atk: 30, hp: 30, crit: 24, cost: 200000000000 },
            { id: 8, name: '大乘', atk: 40, hp: 40, crit: 32, cost: 800000000000 },
            { id: 9, name: '渡劫', atk: 55, hp: 55, crit: 45, cost: 3000000000000 },
            { id: 10, name: '散仙', atk: 75, hp: 75, crit: 60, cost: 12000000000000 }
        ],
        roots: [
            { id: 'jin', name: '金灵根', atk: 3, hp: 1, crit: 2, color: '#C0C0C0' },
            { id: 'mu', name: '木灵根', atk: 1, hp: 3.5, crit: 1, color: '#4CAF50' },
            { id: 'shui', name: '水灵根', atk: 1.5, hp: 3, crit: 1.5, color: '#42A5F5' },
            { id: 'huo', name: '火灵根', atk: 3.5, hp: 1, crit: 2.5, color: '#EF5350' },
            { id: 'tu', name: '土灵根', atk: 2, hp: 3, crit: 1, color: '#A1887F' },
            { id: 'lei', name: '雷灵根', atk: 4, hp: 1.5, crit: 4, color: '#AB47BC' },
            { id: 'bing', name: '冰灵根', atk: 2, hp: 4, crit: 2, color: '#80DEEA' }
        ],
        rootAwakenCost: 100000000,
        rootRefineGrowth: 10,
        dongfu: [
            { id: 'lingtian', name: '灵田', max: 20, costBase: 40000000, growth: 10, atk: 0.6, hp: 1.2, crit: 0.4, desc: '养灵草，厚生命' },
            { id: 'liandange', name: '炼丹阁', max: 20, costBase: 60000000, growth: 10, atk: 0.8, hp: 0.8, crit: 1.0, desc: '丹香缭绕' },
            { id: 'lianqige', name: '炼器阁', max: 20, costBase: 70000000, growth: 10, atk: 1.4, hp: 0.5, crit: 1.2, desc: '炉火锻器' },
            { id: 'hushan', name: '护山大阵', max: 20, costBase: 80000000, growth: 10, atk: 0.5, hp: 1.8, crit: 0.5, desc: '护族安身' },
            { id: 'guanxing', name: '观星台', max: 20, costBase: 90000000, growth: 10, atk: 1.2, hp: 0.8, crit: 1.5, desc: '窥天机' },
            { id: 'cangjing', name: '藏经阁', max: 20, costBase: 55000000, growth: 10, atk: 1.0, hp: 1.0, crit: 0.8, desc: '功法传承' },
            { id: 'chuansong', name: '传送阵', max: 15, costBase: 120000000, growth: 10, atk: 1.5, hp: 1.0, crit: 1.0, desc: '缩地成寸' },
            { id: 'xianquan', name: '灵泉', max: 20, costBase: 100000000, growth: 10, atk: 0.8, hp: 2.0, crit: 0.6, desc: '泉润脏腑' }
        ],
        pills: [
            { id: 'qi', name: '聚气丹', cost: 80000000, cd: 2 * HOUR_MS, chance: 0.85, atk: 5, hp: 5, crit: 3, duration: 3 * HOUR_MS },
            { id: 'blood', name: '血炁丹', cost: 150000000, cd: 3 * HOUR_MS, chance: 0.75, atk: 4, hp: 12, crit: 3, duration: 4 * HOUR_MS },
            { id: 'kill', name: '破军丹', cost: 180000000, cd: 3 * HOUR_MS, chance: 0.7, atk: 12, hp: 4, crit: 8, duration: 4 * HOUR_MS },
            { id: 'crit', name: '噬心丹', cost: 200000000, cd: 4 * HOUR_MS, chance: 0.65, atk: 6, hp: 4, crit: 14, duration: 5 * HOUR_MS },
            { id: 'immortal', name: '九转还丹', cost: 800000000, cd: 8 * HOUR_MS, chance: 0.45, atk: 18, hp: 18, crit: 15, duration: 8 * HOUR_MS }
        ],
        artifacts: [
            { id: 'sword', name: '青锋飞剑', cost: 150000000, atk: 5, hp: 1, crit: 3, desc: '主攻' },
            { id: 'mirror', name: '照心宝镜', cost: 150000000, atk: 1, hp: 5, crit: 2, desc: '主防' },
            { id: 'seal', name: '镇岳印', cost: 200000000, atk: 3, hp: 4, crit: 2, desc: '均衡' },
            { id: 'fan', name: '烈焰扇', cost: 220000000, atk: 4, hp: 1, crit: 5, desc: '主爆' },
            { id: 'bell', name: '镇魂钟', cost: 250000000, atk: 2, hp: 6, crit: 3, desc: '厚血' },
            { id: 'pagoda', name: '玲珑塔', cost: 500000000, atk: 6, hp: 6, crit: 5, desc: '三维皆强' }
        ],
        tribulation: {
            needRealm: 5,
            cost: 5000000000,
            cd: 6 * HOUR_MS,
            chanceBase: 0.35,
            successAtk: 8, successHp: 8, successCrit: 6,
            buffDuration: 6 * HOUR_MS
        }
    };

    function xcfg() { return window.lineageXianConfig; }

    function ensureXianData() {
        if (!player.children) return;
        if (!player.children.xian) {
            player.children.xian = {
                dongfu: {},
                pillCd: {},
                pillBuff: { atk: 0, hp: 0, crit: 0, until: 0 },
                tribCd: 0,
                tribBuffUntil: 0,
                ownedArtifacts: [],
                equippedArtifacts: []
            };
        }
        var x = player.children.xian;
        if (!x.dongfu) x.dongfu = {};
        if (!x.pillCd) x.pillCd = {};
        if (!x.pillBuff) x.pillBuff = { atk: 0, hp: 0, crit: 0, until: 0 };
        if (x.tribCd == null) x.tribCd = 0;
        if (x.tribBuffUntil == null) x.tribBuffUntil = 0;
        if (!Array.isArray(x.ownedArtifacts)) x.ownedArtifacts = [];
        if (!Array.isArray(x.equippedArtifacts)) x.equippedArtifacts = [];
        (player.children.children || []).forEach(function (m) {
            if (m.xianRealm == null) m.xianRealm = 0;
            if (!m.spiritRoots) m.spiritRoots = {};
            if (m.xianArtifact == null) m.xianArtifact = null;
        });
    }

    function calcRealmWorld() {
        ensureXianData();
        var realms = xcfg().realms;
        var atk = 0, hp = 0, crit = 0;
        (player.children.children || []).forEach(function (m) {
            var r = realms[m.xianRealm || 0] || realms[0];
            atk += r.atk || 0;
            hp += r.hp || 0;
            crit += r.crit || 0;
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    function calcRootWorld() {
        ensureXianData();
        var roots = xcfg().roots;
        var atk = 0, hp = 0, crit = 0;
        (player.children.children || []).forEach(function (m) {
            var sr = m.spiritRoots || {};
            roots.forEach(function (root) {
                var lv = sr[root.id] || 0;
                if (lv <= 0) return;
                atk += root.atk * lv;
                hp += root.hp * lv;
                crit += root.crit * lv;
            });
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    function calcDongfuWorld() {
        ensureXianData();
        var atk = 0, hp = 0, crit = 0;
        (xcfg().dongfu || []).forEach(function (d) {
            var lv = player.children.xian.dongfu[d.id] || 0;
            atk += lv * d.atk;
            hp += lv * d.hp;
            crit += lv * d.crit;
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    function calcArtifactWorld() {
        ensureXianData();
        var atk = 0, hp = 0, crit = 0;
        var list = xcfg().artifacts || [];
        (player.children.xian.equippedArtifacts || []).forEach(function (id) {
            var a = list.find(function (x) { return x.id === id; });
            if (!a) return;
            atk += a.atk; hp += a.hp; crit += a.crit;
        });
        return { atk: atk, hp: hp, crit: crit };
    }

    function calcPillWorld() {
        ensureXianData();
        var b = player.children.xian.pillBuff;
        if (!b || Date.now() >= (b.until || 0)) return { atk: 0, hp: 0, crit: 0 };
        return { atk: b.atk || 0, hp: b.hp || 0, crit: b.crit || 0 };
    }

    function calcTribWorld() {
        ensureXianData();
        var t = xcfg().tribulation;
        var atk = 0, hp = 0, crit = 0;
        if (Date.now() < (player.children.xian.tribBuffUntil || 0)) {
            atk += t.successAtk;
            hp += t.successHp;
            crit += t.successCrit;
        }
        return { atk: atk, hp: hp, crit: crit };
    }

    window.getXianWorldBonus = function () {
        ensureXianData();
        var parts = [calcRealmWorld(), calcRootWorld(), calcDongfuWorld(), calcArtifactWorld(), calcPillWorld(), calcTribWorld()];
        var atk = 0, hp = 0, crit = 0;
        parts.forEach(function (p) {
            atk += p.atk || 0;
            hp += p.hp || 0;
            crit += p.crit || 0;
        });
        return { worldAtk: atk, worldHp: hp, worldCritDmg: crit };
    };

    // 叠进家族世界三维
    var _origBonus = window.getLineageExtBonusMult;
    window.getLineageExtBonusMult = function () {
        var base = _origBonus ? _origBonus() : { global: 1, gps: 1, click: 1, life: 1, atk: 1, contrib: 1, worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
        var x = window.getXianWorldBonus();
        base.worldAtk = (base.worldAtk || 0) + (x.worldAtk || 0);
        base.worldHp = (base.worldHp || 0) + (x.worldHp || 0);
        base.worldCritDmg = (base.worldCritDmg || 0) + (x.worldCritDmg || 0);
        return base;
    };

    window.advanceXianRealm = function (memberIndex) {
        ensureXianData();
        var m = (player.children.children || [])[memberIndex];
        if (!m) return;
        if (!(typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : m.isAdult)) {
            return logAction('须成年后方可入道', 'error');
        }
        var realms = xcfg().realms;
        var cur = m.xianRealm || 0;
        if (cur >= realms.length - 1) return logAction(m.name + ' 已至散仙之境', 'info');
        var next = realms[cur + 1];
        var cost = next.cost;
        if (funds().availableFunds < cost) return logAction('资金不足 ' + fmt(cost), 'error');
        funds().availableFunds -= cost;
        m.xianRealm = cur + 1;
        logAction(m.name + ' 突破至【' + next.name + '】！世界地图三维提升', 'success');
        if (typeof pushDiary === 'function') {
            // optional
        }
        if (typeof addClanPrestige === 'function') addClanPrestige(5 + cur);
        refresh();
    };

    window.awakenSpiritRoot = function (memberIndex, rootId) {
        ensureXianData();
        var m = (player.children.children || [])[memberIndex];
        var root = (xcfg().roots || []).find(function (r) { return r.id === rootId; });
        if (!m || !root) return;
        if (!(typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : m.isAdult)) {
            return logAction('须成年后方可觉醒灵根', 'error');
        }
        var lv = (m.spiritRoots[rootId] || 0);
        var cost = xcfg().rootAwakenCost * Math.pow(xcfg().rootRefineGrowth, lv);
        if (funds().availableFunds < cost) return logAction('资金不足 ' + fmt(cost), 'error');
        funds().availableFunds -= cost;
        m.spiritRoots[rootId] = lv + 1;
        logAction(m.name + ' 『' + root.name + '』升至 ' + (lv + 1) + ' 重', 'success');
        refresh();
    };

    window.upgradeXianDongfu = function (id) {
        ensureXianData();
        var d = (xcfg().dongfu || []).find(function (x) { return x.id === id; });
        if (!d) return;
        var lv = player.children.xian.dongfu[id] || 0;
        if (lv >= d.max) return logAction(d.name + ' 已满级', 'info');
        var cost = d.costBase * Math.pow(d.growth || 10, lv);
        if (funds().availableFunds < cost) return logAction('资金不足 ' + fmt(cost), 'error');
        funds().availableFunds -= cost;
        player.children.xian.dongfu[id] = lv + 1;
        logAction('洞府「' + d.name + '」升至 ' + (lv + 1) + ' 级', 'success');
        refresh();
    };

    window.refineXianPill = function (pillId) {
        ensureXianData();
        var pill = (xcfg().pills || []).find(function (p) { return p.id === pillId; });
        if (!pill) return;
        var left = (player.children.xian.pillCd[pillId] || 0) - Date.now();
        if (left > 0) return logAction(pill.name + ' 冷却中约 ' + Math.ceil(left / 60000) + ' 分钟', 'info');
        if (funds().availableFunds < pill.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= pill.cost;
        player.children.xian.pillCd[pillId] = Date.now() + pill.cd;
        if (Math.random() < pill.chance) {
            var b = player.children.xian.pillBuff;
            if (Date.now() > (b.until || 0)) { b.atk = 0; b.hp = 0; b.crit = 0; }
            b.atk += pill.atk;
            b.hp += pill.hp;
            b.crit += pill.crit;
            b.until = Date.now() + pill.duration;
            logAction('炼成【' + pill.name + '】！限时地图攻+' + (pill.atk * 100) + '% 血+' + (pill.hp * 100) + '% 爆+' + (pill.crit * 100) + '%', 'success');
        } else {
            logAction('【' + pill.name + '】炸炉…只得残丹，略补灵气（小幅三维）', 'info');
            var b2 = player.children.xian.pillBuff;
            if (Date.now() > (b2.until || 0)) { b2.atk = 0; b2.hp = 0; b2.crit = 0; }
            b2.atk += 1; b2.hp += 1; b2.crit += 0.5;
            b2.until = Date.now() + HOUR_MS;
        }
        refresh();
    };

    window.forgeXianArtifact = function (artId) {
        ensureXianData();
        var a = (xcfg().artifacts || []).find(function (x) { return x.id === artId; });
        if (!a) return;
        if ((player.children.xian.ownedArtifacts || []).indexOf(artId) >= 0) {
            return logAction('已拥有「' + a.name + '」', 'info');
        }
        if (funds().availableFunds < a.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= a.cost;
        player.children.xian.ownedArtifacts.push(artId);
        logAction('祭炼成功：' + a.name, 'success');
        refresh();
    };

    window.equipXianArtifact = function (artId) {
        ensureXianData();
        var owned = player.children.xian.ownedArtifacts || [];
        if (owned.indexOf(artId) < 0) return logAction('尚未拥有此法宝', 'error');
        var eq = player.children.xian.equippedArtifacts || [];
        if (eq.indexOf(artId) >= 0) {
            player.children.xian.equippedArtifacts = eq.filter(function (id) { return id !== artId; });
            logAction('已卸下法宝', 'info');
        } else {
            if (eq.length >= 3) return logAction('最多同时装备 3 件法宝', 'error');
            eq.push(artId);
            player.children.xian.equippedArtifacts = eq;
            logAction('已装备法宝，世界地图三维生效', 'success');
        }
        refresh();
    };

    window.attemptXianTribulation = function (memberIndex) {
        ensureXianData();
        var m = (player.children.children || [])[memberIndex];
        var t = xcfg().tribulation;
        if (!m) return;
        if ((m.xianRealm || 0) < t.needRealm) {
            return logAction('需达到【化神】以上方可渡劫', 'error');
        }
        if (Date.now() < (player.children.xian.tribCd || 0)) {
            return logAction('渡劫冷却中', 'info');
        }
        if (funds().availableFunds < t.cost) return logAction('资金不足', 'error');
        funds().availableFunds -= t.cost;
        player.children.xian.tribCd = Date.now() + t.cd;
        var rootBonus = Object.keys(m.spiritRoots || {}).reduce(function (s, k) { return s + (m.spiritRoots[k] || 0); }, 0) * 0.03;
        var chance = Math.min(0.85, t.chanceBase + rootBonus + ((m.xianRealm || 0) - t.needRealm) * 0.05);
        if (Math.random() < chance) {
            if ((m.xianRealm || 0) < xcfg().realms.length - 1) m.xianRealm++;
            player.children.xian.tribBuffUntil = Date.now() + t.buffDuration;
            m.glory = (m.glory || 0) + 50;
            if (typeof addClanPrestige === 'function') addClanPrestige(40);
            logAction(m.name + ' 渡劫成功！境界提升，限时三维大增（成功率约 ' + Math.floor(chance * 100) + '%）', 'success');
        } else {
            logAction(m.name + ' 渡劫失败，身受重创（成功率约 ' + Math.floor(chance * 100) + '%）', 'error');
        }
        refresh();
    };

    function refresh() {
        if (typeof updateChildBonuses === 'function') updateChildBonuses();
        if (typeof updateChildSystemUI === 'function') updateChildSystemUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof saveGame === 'function') saveGame();
    }

    function updateXianPanels() {
        ensureXianData();
        var members = player.children.children || [];
        var realms = xcfg().realms;
        var xw = window.getXianWorldBonus();

        var cul = el('xianCultivatePanel');
        if (cul) {
            cul.innerHTML = '<div class="c-hint">修真合计：地图攻+' + (xw.worldAtk * 100).toFixed(0) +
                '% / 血+' + (xw.worldHp * 100).toFixed(0) + '% / 爆伤+' + (xw.worldCritDmg * 100).toFixed(0) + '%</div>' +
                members.map(function (m, i) {
                    if (!(typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : m.isAdult)) return '';
                    var cur = m.xianRealm || 0;
                    var r = realms[cur] || realms[0];
                    var next = realms[cur + 1];
                    return '<div class="c-member"><div class="name">' + m.name + '</div>' +
                        '<div class="meta">境界 · ' + r.name + (next ? (' → ' + next.name + '（' + fmt(next.cost) + '）') : '（圆满）') + '</div>' +
                        '<div style="font-size:11px;color:#d4a84b;">攻+' + (r.atk * 100) + '% 血+' + (r.hp * 100) + '% 爆+' + (r.crit * 100) + '%</div>' +
                        (next ? '<button class="c-btn c-btn-sm c-btn-gold" style="margin-top:6px;" onclick="advanceXianRealm(' + i + ')">突破</button>' : '') +
                        '</div>';
                }).join('') || '<div class="c-hint">需要成年成员入道修炼</div>';
        }

        var sp = el('xianSpiritPanel');
        if (sp) {
            var opts = members.map(function (m, i) {
                if (!(typeof isFamilyMemberAdult === 'function' ? isFamilyMemberAdult(m) : m.isAdult)) return '';
                return '<option value="' + i + '">' + m.name + '</option>';
            }).join('');
            sp.innerHTML = '<div class="c-form-row"><label>成员</label><select id="xianRootMember" class="c-input">' + opts + '</select></div>' +
                '<div class="c-train-grid">' + (xcfg().roots || []).map(function (root) {
                    return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;border-color:' + root.color + ';">' +
                        '<div class="ms-title" style="color:' + root.color + ';">' + root.name + '</div>' +
                        '<div class="ms-desc">每重 攻+' + (root.atk * 100) + '% 血+' + (root.hp * 100) + '% 爆+' + (root.crit * 100) + '%</div>' +
                        '<button class="c-btn c-btn-sm c-btn-blue" style="margin-top:6px;" onclick="awakenSpiritRoot(+document.getElementById(\'xianRootMember\').value,\'' + root.id + '\')">觉醒/淬炼</button></div>';
                }).join('') + '</div>';
        }

        var df = el('xianDongfuPanel');
        if (df) {
            var dw = calcDongfuWorld();
            df.innerHTML = '<div class="c-hint">洞府：攻+' + (dw.atk * 100).toFixed(0) + '% 血+' + (dw.hp * 100).toFixed(0) + '% 爆+' + (dw.crit * 100).toFixed(0) + '%</div>' +
                (xcfg().dongfu || []).map(function (d) {
                    var lv = player.children.xian.dongfu[d.id] || 0;
                    var cost = d.costBase * Math.pow(d.growth || 10, lv);
                    return '<div class="c-milestone' + (lv > 0 ? ' done' : '') + '"><div><div class="ms-title">' + d.name + ' Lv.' + lv + '/' + d.max +
                        '</div><div class="ms-desc">' + d.desc + ' · 下级 ' + fmt(cost) + '</div></div>' +
                        '<button class="c-btn c-btn-sm c-btn-gold" onclick="upgradeXianDongfu(\'' + d.id + '\')" ' + (lv >= d.max ? 'disabled' : '') + '>开辟</button></div>';
                }).join('');
        }

        var al = el('xianAlchemyPanel');
        if (al) {
            var pb = player.children.xian.pillBuff;
            var left = Math.max(0, (pb.until || 0) - Date.now());
            al.innerHTML = (left ? '<div class="c-hint" style="color:#81C784;">丹药祝福剩余 ' + Math.ceil(left / 60000) + ' 分钟</div>' : '') +
                (xcfg().pills || []).map(function (p) {
                    var cd = Math.max(0, (player.children.xian.pillCd[p.id] || 0) - Date.now());
                    return '<div class="c-milestone done" style="flex-direction:column;align-items:stretch;">' +
                        '<div class="ms-title">' + p.name + '</div>' +
                        '<div class="ms-desc">耗资 ' + fmt(p.cost) + ' · 成功率 ' + Math.floor(p.chance * 100) +
                        '% · 攻+' + (p.atk * 100) + '% 血+' + (p.hp * 100) + '% 爆+' + (p.crit * 100) + '%</div>' +
                        '<button class="c-btn c-btn-orange" style="margin-top:6px;" onclick="refineXianPill(\'' + p.id + '\')" ' +
                        (cd > 0 ? 'disabled' : '') + '>' + (cd > 0 ? ('冷却 ' + Math.ceil(cd / 60000) + '分') : '开炉') + '</button></div>';
                }).join('');
        }

        var art = el('xianArtifactPanel');
        if (art) {
            var owned = player.children.xian.ownedArtifacts || [];
            var eq = player.children.xian.equippedArtifacts || [];
            art.innerHTML = '<div class="c-hint">已装备 ' + eq.length + '/3 · 仅装备中的法宝提供三维</div>' +
                (xcfg().artifacts || []).map(function (a) {
                    var has = owned.indexOf(a.id) >= 0;
                    var on = eq.indexOf(a.id) >= 0;
                    return '<div class="c-milestone' + (on ? ' done' : '') + '"><div><div class="ms-title">' + a.name +
                        (on ? ' · 装备中' : '') + '</div><div class="ms-desc">' + a.desc +
                        ' · 攻+' + (a.atk * 100) + '% 血+' + (a.hp * 100) + '% 爆+' + (a.crit * 100) + '%' +
                        (has ? '' : ' · 祭炼 ' + fmt(a.cost)) + '</div></div>' +
                        (has
                            ? '<button class="c-btn c-btn-sm ' + (on ? 'c-btn-orange' : 'c-btn-gold') + '" onclick="equipXianArtifact(\'' + a.id + '\')">' + (on ? '卸下' : '装备') + '</button>'
                            : '<button class="c-btn c-btn-sm c-btn-blue" onclick="forgeXianArtifact(\'' + a.id + '\')">祭炼</button>') +
                        '</div>';
                }).join('');
        }

        var trib = el('xianTribulationPanel');
        if (trib) {
            var t = xcfg().tribulation;
            var cd = Math.max(0, (player.children.xian.tribCd || 0) - Date.now());
            var opts = members.map(function (m, i) {
                if ((m.xianRealm || 0) < t.needRealm) return '';
                return '<option value="' + i + '">' + m.name + '（' + (realms[m.xianRealm] || {}).name + '）</option>';
            }).join('');
            trib.innerHTML = '<div class="c-hint">需化神以上 · 耗资 ' + fmt(t.cost) + ' · 成功可升境并获限时三维</div>' +
                '<div class="c-form-row"><label>渡劫者</label><select id="xianTribMember" class="c-input">' +
                (opts || '<option value="-1">暂无合格子弟</option>') + '</select></div>' +
                '<button class="c-btn c-btn-pink" style="width:100%;" onclick="var v=+document.getElementById(\'xianTribMember\').value;if(v>=0)attemptXianTribulation(v);" ' +
                (cd > 0 || !opts ? 'disabled' : '') + '>' +
                (cd > 0 ? ('冷却 ' + Math.ceil(cd / 60000) + ' 分钟') : '引动天劫') + '</button>';
        }
    }

    window.updateXianPanels = updateXianPanels;

    var _origUpdate = window.updateLineageExtUI;
    window.updateLineageExtUI = function () {
        if (_origUpdate) _origUpdate();
        if (window.__lineageExtOnly) return;
        if (typeof childTabIn === 'function' && !childTabIn(['cultivate', 'spiritroot', 'dongfu', 'alchemy', 'artifact', 'tribulation'])) return;
        updateXianPanels();
    };

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(ensureXianData, 1200);
    });
})();

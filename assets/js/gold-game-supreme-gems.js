/**
 * 至尊宝石：镶嵌于至尊神器（最多 3 孔），世界地图掉落同联网币。
 * 攻击/生命/爆伤：世界地图属性独立乘区；轮回技能宝石：对应技能伤害；世界经验：独立总加成。
 */
(function (global) {
    'use strict';

    var SUPREME_GEM_MAX_LEVEL = 30;
    var SUPREME_ARTIFACT_MAX_SOCKETS = 3;

    var SUPREME_GEM_DEFS = [
        { kind: 'atk', name: '攻击宝石', group: 'stat', basePct: 0.10 },
        { kind: 'hp', name: '生命宝石', group: 'stat', basePct: 0.10 },
        { kind: 'critDamage', name: '爆伤宝石', group: 'stat', basePct: 0.10 },
        { kind: 'worldExp', name: '世界地图经验宝石', group: 'exp', basePct: 0.02 },
        { kind: 'skill_s1', name: '血海轮回诀宝石', group: 'skill', skillId: 's1', basePct: 0.30 },
        { kind: 'skill_s2', name: '斩劫灭天印宝石', group: 'skill', skillId: 's2', basePct: 0.30 },
        { kind: 'skill_s3', name: '万劫爆杀符宝石', group: 'skill', skillId: 's3', basePct: 0.30 },
        { kind: 'skill_s4', name: '不灭仙体经宝石', group: 'skill', skillId: 's4', basePct: 0.30 },
        { kind: 'skill_s5', name: '破虚神魔斩宝石', group: 'skill', skillId: 's5', basePct: 0.30 },
        { kind: 'skill_s6', name: '九幽灭世爆宝石', group: 'skill', skillId: 's6', basePct: 0.30 },
        { kind: 'skill_s7', name: '太初血脉篇宝石', group: 'skill', skillId: 's7', basePct: 0.30 },
        { kind: 'skill_s8', name: '诛仙破界枪宝石', group: 'skill', skillId: 's8', basePct: 0.30 },
        { kind: 'skill_s9', name: '混沌爆灭咒宝石', group: 'skill', skillId: 's9', basePct: 0.30 },
        { kind: 'skill_s10', name: '永生道体诀宝石', group: 'skill', skillId: 's10', basePct: 0.30 },
        { kind: 'skill_s11', name: '弑神灭道刃宝石', group: 'skill', skillId: 's11', basePct: 0.30 },
        { kind: 'skill_s12', name: '天崩地裂爆宝石', group: 'skill', skillId: 's12', basePct: 0.30 },
        { kind: 'skill_s13', name: '鸿蒙不灭身宝石', group: 'skill', skillId: 's13', basePct: 0.30 },
        { kind: 'skill_s14', name: '开天辟地击宝石', group: 'skill', skillId: 's14', basePct: 0.30 },
        { kind: 'skill_s15', name: '归墟终焉爆宝石', group: 'skill', skillId: 's15', basePct: 0.30 }
    ];

    var SUPREME_GEM_DEF_MAP = {};
    for (var i = 0; i < SUPREME_GEM_DEFS.length; i++) {
        SUPREME_GEM_DEF_MAP[SUPREME_GEM_DEFS[i].kind] = SUPREME_GEM_DEFS[i];
    }

    function esc(s) {
        if (typeof supremeEscapeHtml === 'function') return supremeEscapeHtml(s);
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function attr(s) {
        return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }

    function jsStr(s) {
        return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    }

    function getSupremeGemDef(kind) {
        return SUPREME_GEM_DEF_MAP[kind] || null;
    }

    function getSupremeGemName(kind) {
        var d = getSupremeGemDef(kind);
        return d ? d.name : String(kind || '未知宝石');
    }

    /** 加成系数：basePct * 3^(level-1)，与需求表一致（攻击/生命/爆伤 10/30/90…） */
    function getSupremeGemBonusCoeff(kind, level) {
        var d = getSupremeGemDef(kind);
        if (!d) return 0;
        level = Math.max(1, Math.min(SUPREME_GEM_MAX_LEVEL, Math.floor(Number(level) || 1)));
        return d.basePct * Math.pow(3, level - 1);
    }

    function formatSupremeGemBonusPct(kind, level) {
        var c = getSupremeGemBonusCoeff(kind, level);
        var pct = Math.round(c * 10000) / 100;
        var t = pct.toFixed(2);
        if (t.endsWith('.00')) t = t.slice(0, -3);
        else if (t.endsWith('0')) t = t.replace(/0$/, '');
        return '+' + t + '%';
    }

    function applySupremeArtifactsGemCache(res) {
        if (!res || !res.ok) return;
        var cache = window._supremeArtifactsCache || { equipped: {}, bag: [], gems: {}, socketOpeners: 0 };
        if (res.equipped != null && typeof res.equipped === 'object') cache.equipped = res.equipped;
        if (Array.isArray(res.bag)) cache.bag = res.bag;
        if (res.gems != null && typeof res.gems === 'object') cache.gems = res.gems;
        if (res.socketOpeners != null) cache.socketOpeners = Math.max(0, Math.floor(Number(res.socketOpeners) || 0));
        window._supremeArtifactsCache = cache;
    }

    function listSupremeGemStacksFromCache() {
        var gems = (window._supremeArtifactsCache && window._supremeArtifactsCache.gems) || {};
        var list = [];
        Object.keys(gems).forEach(function (key) {
            var parts = String(key).split(':');
            if (parts.length !== 2) return;
            var kind = parts[0];
            var level = Math.floor(Number(parts[1]));
            var count = Math.floor(Number(gems[key]) || 0);
            if (!getSupremeGemDef(kind) || !(level >= 1) || count <= 0) return;
            list.push({ kind: kind, level: level, count: count, key: key });
        });
        list.sort(function (a, b) {
            var da = getSupremeGemDef(a.kind);
            var db = getSupremeGemDef(b.kind);
            var ga = da ? (da.group === 'stat' ? 0 : da.group === 'exp' ? 1 : 2) : 9;
            var gb = db ? (db.group === 'stat' ? 0 : db.group === 'exp' ? 1 : 2) : 9;
            if (ga !== gb) return ga - gb;
            if (a.kind !== b.kind) return a.kind < b.kind ? -1 : 1;
            return a.level - b.level;
        });
        return list;
    }

    function collectEquippedSupremeSocketGems() {
        var out = [];
        var eq = window._supremeArtifactsCache && window._supremeArtifactsCache.equipped;
        if (!eq || typeof eq !== 'object') return out;
        Object.keys(eq).forEach(function (slotId) {
            var art = eq[slotId];
            if (!art) return;
            var slots = Math.max(0, Math.min(SUPREME_ARTIFACT_MAX_SOCKETS, art.socketSlots | 0));
            var gems = Array.isArray(art.socketGems) ? art.socketGems : [];
            for (var i = 0; i < slots && i < gems.length; i++) {
                var g = gems[i];
                if (g && g.kind) out.push({ kind: g.kind, level: g.level | 0, artifactId: art.id, slotId: slotId, socketIndex: i });
            }
        });
        return out;
    }

    /** 已镶嵌宝石汇总：世界地图独立属性 / 经验 / 各轮回技能伤害系数 */
    function calculateEquippedSupremeGemBonus() {
        var total = {
            health: 0,
            attack: 0,
            critDamage: 0,
            worldExp: 0,
            skills: {}
        };
        var list = collectEquippedSupremeSocketGems();
        for (var i = 0; i < list.length; i++) {
            var g = list[i];
            var def = getSupremeGemDef(g.kind);
            if (!def) continue;
            var coeff = getSupremeGemBonusCoeff(g.kind, g.level);
            if (!(coeff > 0)) continue;
            if (def.kind === 'atk') total.attack += coeff;
            else if (def.kind === 'hp') total.health += coeff;
            else if (def.kind === 'critDamage') total.critDamage += coeff;
            else if (def.kind === 'worldExp') total.worldExp += coeff;
            else if (def.group === 'skill' && def.skillId) {
                total.skills[def.skillId] = (total.skills[def.skillId] || 0) + coeff;
            }
        }
        return total;
    }

    function getSupremeGemSkillDamageBonus(skillId) {
        var b = calculateEquippedSupremeGemBonus();
        return (b.skills && b.skills[skillId]) || 0;
    }

    function switchSupremeArtifactTab(tab) {
        tab = tab === 'gems' ? 'gems' : 'artifacts';
        window._supremeArtifactActiveTab = tab;
        var artPanel = document.getElementById('supremeArtifactTabArtifacts');
        var gemPanel = document.getElementById('supremeArtifactTabGems');
        var btnA = document.getElementById('supremeTabBtnArtifacts');
        var btnG = document.getElementById('supremeTabBtnGems');
        if (artPanel) artPanel.style.display = tab === 'artifacts' ? '' : 'none';
        if (gemPanel) gemPanel.style.display = tab === 'gems' ? '' : 'none';
        function styleTab(btn, on) {
            if (!btn) return;
            btn.style.background = on ? 'linear-gradient(180deg,#5c4318,#3d2a0c)' : 'rgba(30,20,40,0.85)';
            btn.style.borderColor = on ? '#ffc107' : 'rgba(255,255,255,0.15)';
            btn.style.color = on ? '#fff8e1' : '#b0a0d0';
        }
        styleTab(btnA, tab === 'artifacts');
        styleTab(btnG, tab === 'gems');
        if (tab === 'gems') refreshSupremeGemUI();
        else if (typeof refreshSupremeArtifactUI === 'function') refreshSupremeArtifactUI();
    }

    function supremeSocketRowsHtml(art, opts) {
        opts = opts || {};
        if (!art) return '';
        var slots = Math.max(0, Math.min(SUPREME_ARTIFACT_MAX_SOCKETS, art.socketSlots | 0));
        var gems = Array.isArray(art.socketGems) ? art.socketGems : [];
        var aid = jsStr(art.id);
        var lines = [];
        for (var i = 0; i < SUPREME_ARTIFACT_MAX_SOCKETS; i++) {
            if (i >= slots) {
                lines.push(
                    '<div style="font-size:11px;color:#78909c;padding:3px 0;">孔' +
                        (i + 1) +
                        '：未开启' +
                        (opts.canOpen
                            ? ' <button type="button" onclick="goldGameOpenSupremeSocket(\'' +
                              aid +
                              '\').then(function(){ refreshSupremeArtifactUI(); refreshSupremeGemUI(); if(typeof updatePlayerBattleStats===\'function\')updatePlayerBattleStats(); }).catch(function(e){ alert(e.message); });" style="padding:2px 8px;font-size:10px;border-radius:6px;border:1px solid #ffb74d;background:#4e342e;color:#ffe0b2;cursor:pointer;">开孔</button>'
                            : '') +
                        '</div>'
                );
                break;
            }
            var g = gems[i];
            if (g && g.kind) {
                lines.push(
                    '<div style="font-size:11px;color:#ffe082;padding:3px 0;">孔' +
                        (i + 1) +
                        '：' +
                        esc(getSupremeGemName(g.kind)) +
                        ' Lv.' +
                        (g.level | 0) +
                        ' <span style="color:#ce93d8;">' +
                        formatSupremeGemBonusPct(g.kind, g.level) +
                        '</span>' +
                        (opts.canUnequip
                            ? ' <button type="button" onclick="goldGameUnequipSupremeGem(\'' +
                              aid +
                              '\',' +
                              i +
                              ').then(function(){ refreshSupremeArtifactUI(); refreshSupremeGemUI(); if(typeof updatePlayerBattleStats===\'function\')updatePlayerBattleStats(); }).catch(function(e){ alert(e.message); });" style="padding:2px 8px;font-size:10px;border-radius:6px;border:1px solid #9575cd;background:#311b4d;color:#e1bee7;cursor:pointer;">卸下</button>'
                            : '') +
                        '</div>'
                );
            } else {
                lines.push(
                    '<div style="font-size:11px;color:#a5d6a7;padding:3px 0;">孔' +
                        (i + 1) +
                        '：空' +
                        (opts.canEquip
                            ? ' <button type="button" onclick="openSupremeGemEquipPicker(\'' +
                              aid +
                              '\',' +
                              i +
                              ')" style="padding:2px 8px;font-size:10px;border-radius:6px;border:1px solid #66bb6a;background:#1b5e20;color:#c8e6c9;cursor:pointer;">镶嵌</button>'
                            : '') +
                        '</div>'
                );
            }
        }
        return (
            '<div style="margin-top:8px;padding:8px 10px;border-radius:10px;background:rgba(0,0,0,0.35);border:1px solid rgba(255,193,7,0.22);">' +
            '<div style="font-size:10px;color:#ffcc80;margin-bottom:4px;letter-spacing:0.04em;">至尊宝石孔 ' +
            slots +
            '/' +
            SUPREME_ARTIFACT_MAX_SOCKETS +
            '</div>' +
            lines.join('') +
            '</div>'
        );
    }

    function openSupremeGemEquipPicker(artifactId, socketIndex) {
        var stacks = listSupremeGemStacksFromCache();
        if (!stacks.length) {
            alert('宝石背包为空');
            return;
        }
        var names = stacks.map(function (s, idx) {
            return idx + 1 + '. ' + getSupremeGemName(s.kind) + ' Lv.' + s.level + ' ×' + s.count + '（' + formatSupremeGemBonusPct(s.kind, s.level) + '）';
        });
        var pick = prompt('选择要镶嵌的宝石序号：\n' + names.join('\n'));
        if (pick == null) return;
        var n = Math.floor(Number(pick));
        if (!Number.isFinite(n) || n < 1 || n > stacks.length) {
            alert('无效序号');
            return;
        }
        var s = stacks[n - 1];
        if (typeof goldGameEquipSupremeGem !== 'function') {
            alert('未联网');
            return;
        }
        goldGameEquipSupremeGem(artifactId, socketIndex, s.kind, s.level)
            .then(function () {
                refreshSupremeArtifactUI();
                refreshSupremeGemUI();
                if (typeof updatePlayerBattleStats === 'function') updatePlayerBattleStats();
            })
            .catch(function (e) {
                alert(e.message || '镶嵌失败');
            });
    }

    function refreshSupremeGemUI() {
        var openerEl = document.getElementById('supremeSocketOpenerCount');
        var listEl = document.getElementById('supremeGemBagList');
        var bonusEl = document.getElementById('supremeGemBonusSummary');
        var cache = window._supremeArtifactsCache || {};
        if (openerEl) openerEl.textContent = String(cache.socketOpeners || 0);
        var bonus = calculateEquippedSupremeGemBonus();
        if (bonusEl) {
            var skillLines = [];
            Object.keys(bonus.skills || {}).forEach(function (sid) {
                var def = null;
                for (var i = 0; i < SUPREME_GEM_DEFS.length; i++) {
                    if (SUPREME_GEM_DEFS[i].skillId === sid) {
                        def = SUPREME_GEM_DEFS[i];
                        break;
                    }
                }
                var pct = Math.round((bonus.skills[sid] || 0) * 10000) / 100;
                skillLines.push((def ? def.name.replace(/宝石$/, '') : sid) + ' +' + pct + '%');
            });
            bonusEl.innerHTML =
                '<div style="display:flex;flex-wrap:wrap;gap:8px 14px;font-size:12px;color:#e1bee7;">' +
                '<span>攻击 <b style="color:#ffe082;">+' +
                (Math.round(bonus.attack * 10000) / 100) +
                '%</b></span>' +
                '<span>生命 <b style="color:#ffe082;">+' +
                (Math.round(bonus.health * 10000) / 100) +
                '%</b></span>' +
                '<span>爆伤 <b style="color:#ffe082;">+' +
                (Math.round(bonus.critDamage * 10000) / 100) +
                '%</b></span>' +
                '<span>世界经验 <b style="color:#ffe082;">+' +
                (Math.round(bonus.worldExp * 10000) / 100) +
                '%</b></span>' +
                (skillLines.length
                    ? '<span style="flex-basis:100%;color:#ce93d8;">轮回技能：' + esc(skillLines.join(' · ')) + '</span>'
                    : '') +
                '</div>';
        }
        if (!listEl) return;
        var stacks = listSupremeGemStacksFromCache();
        if (!stacks.length) {
            listEl.innerHTML = '<div style="grid-column:1/-1;color:#888;padding:24px;text-align:center;">暂无至尊宝石（世界地图掉落，概率同联网币）</div>';
            return;
        }
        var html = '';
        for (var j = 0; j < stacks.length; j++) {
            var s = stacks[j];
            var def = getSupremeGemDef(s.kind);
            var canUp = s.count >= 3 && s.level < SUPREME_GEM_MAX_LEVEL;
            var upTimes = canUp ? Math.floor(s.count / 3) : 0;
            html +=
                '<div style="border-radius:14px;padding:12px;border:1px solid rgba(255,213,128,0.28);background:linear-gradient(165deg,rgba(60,36,12,0.9),rgba(18,10,34,0.95));min-height:120px;display:flex;flex-direction:column;gap:6px;">' +
                '<div style="font-weight:800;color:#fff8e1;font-size:13px;">' +
                esc(getSupremeGemName(s.kind)) +
                ' <span style="color:#ffecb3;">Lv.' +
                s.level +
                '</span></div>' +
                '<div style="font-size:12px;color:#ce93d8;">数量 <b style="color:#ffe082;">' +
                s.count +
                '</b> · 加成 <b style="color:#a5d6a7;">' +
                formatSupremeGemBonusPct(s.kind, s.level) +
                '</b></div>' +
                '<div style="font-size:11px;color:#90a4ae;">' +
                (def && def.group === 'skill'
                    ? '轮回技能伤害独立加成'
                    : def && def.group === 'exp'
                      ? '世界地图经验独立总加成'
                      : '世界地图属性独立加成') +
                '</div>' +
                '<div style="margin-top:auto;padding-top:8px;display:flex;flex-wrap:wrap;gap:6px;">' +
                '<button type="button" onclick="openNetworkArtifactSellDialog(\'supremeGem\',{kind:\'' +
                jsStr(s.kind) +
                '\',level:' +
                s.level +
                ',maxAmount:' +
                s.count +
                '});" style="padding:5px 10px;font-size:11px;border-radius:8px;border:1px solid #ffb74d;background:#4e342e;color:#fff3e0;cursor:pointer;">上架</button>' +
                (canUp
                    ? '<button type="button" onclick="goldGameUpgradeSupremeGem(\'' +
                      jsStr(s.kind) +
                      '\',' +
                      s.level +
                      ',1).then(function(){ refreshSupremeGemUI(); }).catch(function(e){ alert(e.message); });" style="padding:5px 10px;font-size:11px;border-radius:8px;border:1px solid #ffb74d;background:#5d4037;color:#fff3e0;cursor:pointer;">合成升1级(消耗3)</button>' +
                      (upTimes > 1
                          ? '<button type="button" onclick="goldGameUpgradeSupremeGem(\'' +
                            jsStr(s.kind) +
                            '\',' +
                            s.level +
                            ',' +
                            upTimes +
                            ').then(function(){ refreshSupremeGemUI(); }).catch(function(e){ alert(e.message); });" style="padding:5px 10px;font-size:11px;border-radius:8px;border:1px solid #ffa726;background:#e65100;color:#fff;cursor:pointer;">全部合成×' +
                            upTimes +
                            '</button>'
                          : '')
                    : '<span style="font-size:11px;color:#78909c;">' +
                      (s.level >= SUPREME_GEM_MAX_LEVEL ? '已满级' : '需3枚同级合成') +
                      '</span>') +
                '</div></div>';
        }
        listEl.innerHTML = html;

        var targetEl = document.getElementById('supremeGemSocketTargetList');
        if (targetEl) {
            var eq = cache.equipped || {};
            var bag = cache.bag || [];
            var arts = [];
            Object.keys(eq).forEach(function (sid) {
                if (eq[sid]) arts.push({ art: eq[sid], loc: '已穿戴' });
            });
            for (var bi = 0; bi < bag.length; bi++) {
                if (bag[bi]) arts.push({ art: bag[bi], loc: '背包' });
            }
            if (!arts.length) {
                targetEl.innerHTML = '<div style="color:#888;padding:12px;">暂无至尊神器可开孔/镶嵌</div>';
            } else {
                var th = '';
                for (var ai = 0; ai < arts.length; ai++) {
                    var a = arts[ai].art;
                    th +=
                        '<div style="border-radius:12px;padding:10px 12px;border:1px solid rgba(255,213,128,0.25);background:rgba(20,12,28,0.9);margin-bottom:10px;">' +
                        '<div style="font-size:12px;font-weight:700;color:#ffe082;">' +
                        esc(a.displayName || a.name || '') +
                        ' <span style="font-weight:500;color:#9e9e9e;font-size:11px;">(' +
                        arts[ai].loc +
                        ')</span></div>' +
                        supremeSocketRowsHtml(a, { canOpen: true, canEquip: true, canUnequip: true }) +
                        '</div>';
                }
                targetEl.innerHTML = th;
            }
        }
    }

    global.SUPREME_GEM_DEFS = SUPREME_GEM_DEFS;
    global.SUPREME_GEM_MAX_LEVEL = SUPREME_GEM_MAX_LEVEL;
    global.SUPREME_ARTIFACT_MAX_SOCKETS = SUPREME_ARTIFACT_MAX_SOCKETS;
    global.getSupremeGemDef = getSupremeGemDef;
    global.getSupremeGemName = getSupremeGemName;
    global.getSupremeGemBonusCoeff = getSupremeGemBonusCoeff;
    global.formatSupremeGemBonusPct = formatSupremeGemBonusPct;
    global.applySupremeArtifactsGemCache = applySupremeArtifactsGemCache;
    global.calculateEquippedSupremeGemBonus = calculateEquippedSupremeGemBonus;
    global.getSupremeGemSkillDamageBonus = getSupremeGemSkillDamageBonus;
    global.switchSupremeArtifactTab = switchSupremeArtifactTab;
    global.supremeSocketRowsHtml = supremeSocketRowsHtml;
    global.openSupremeGemEquipPicker = openSupremeGemEquipPicker;
    global.refreshSupremeGemUI = refreshSupremeGemUI;
})(typeof window !== 'undefined' ? window : this);

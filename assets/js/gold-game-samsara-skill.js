// 轮回技能系统：15 个技能，满级 10000
var SAMSARA_SKILL_MAX_LEVEL = 10000;
var SAMSARA_SKILL_UNLOCK_REINCARNATION = 0; // 0=无轮回门槛，可直接进入

var SAMSARA_SKILL_MATERIAL_NAMES = [
    '初转轮回晶', '淬魂轮回晶', '破境轮回晶', '灭劫轮回晶', '通幽轮回晶',
    '镇魔轮回晶', '裂空轮回晶', '焚天轮回晶', '葬神轮回晶', '无相轮回晶',
    '太初轮回晶', '混沌轮回晶', '鸿蒙轮回晶', '归墟轮回晶', '永恒轮回晶'
];

/** 15 技能；主属性轮换；材料与次元 1-15 一一对应 */
var SAMSARA_SKILL_DEFS = [
    { id: 's1',  name: '血海轮回诀',   dim: 1,  primary: 'health' },
    { id: 's2',  name: '斩劫灭天印',   dim: 2,  primary: 'attack' },
    { id: 's3',  name: '万劫爆杀符',   dim: 3,  primary: 'critDamage' },
    { id: 's4',  name: '不灭仙体经',   dim: 4,  primary: 'health' },
    { id: 's5',  name: '破虚神魔斩',   dim: 5,  primary: 'attack' },
    { id: 's6',  name: '九幽灭世爆',   dim: 6,  primary: 'critDamage' },
    { id: 's7',  name: '太初血脉篇',   dim: 7,  primary: 'health' },
    { id: 's8',  name: '诛仙破界枪',   dim: 8,  primary: 'attack' },
    { id: 's9',  name: '混沌爆灭咒',   dim: 9,  primary: 'critDamage' },
    { id: 's10', name: '永生道体诀',   dim: 10, primary: 'health' },
    { id: 's11', name: '弑神灭道刃',   dim: 11, primary: 'attack' },
    { id: 's12', name: '天崩地裂爆',   dim: 12, primary: 'critDamage' },
    { id: 's13', name: '鸿蒙不灭身',   dim: 13, primary: 'health' },
    { id: 's14', name: '开天辟地击',   dim: 14, primary: 'attack' },
    { id: 's15', name: '归墟终焉爆',   dim: 15, primary: 'critDamage' }
];

function getSamsaraSkillMaterialKey(dim) {
    var d = Math.max(1, Math.min(15, Math.floor(Number(dim) || 1)));
    return 'lunhuiSkill' + d;
}

function getSamsaraSkillMaterialName(dim) {
    var d = Math.max(1, Math.min(15, Math.floor(Number(dim) || 1)));
    return SAMSARA_SKILL_MATERIAL_NAMES[d - 1] || ('轮回技能材料' + d);
}

/** 单级消耗：5 + 当前等级 × 5 */
function getSamsaraSkillUpgradeCost(level) {
    var lv = Math.max(0, Math.floor(Number(level) || 0));
    return 5 + lv * 5;
}

/** 从 fromLevel 升 levels 级的总消耗 */
function getSamsaraSkillUpgradeCostRange(fromLevel, levels) {
    var from = Math.max(0, Math.floor(Number(fromLevel) || 0));
    var n = Math.max(0, Math.floor(Number(levels) || 0));
    if (n <= 0) return 0;
    // sum_{i=0}^{n-1} (5 + (from+i)*5) = 5*n + 5*(n*from + n*(n-1)/2)
    return 5 * n + 5 * (n * from + (n * (n - 1)) / 2);
}

function ensureSamsaraSkillData() {
    if (!player.samsaraSkills || typeof player.samsaraSkills !== 'object') {
        player.samsaraSkills = { levels: {} };
    }
    if (!player.samsaraSkills.levels || typeof player.samsaraSkills.levels !== 'object') {
        player.samsaraSkills.levels = {};
    }
    if (!player.items || typeof player.items !== 'object') player.items = {};
    var i;
    for (i = 1; i <= 15; i++) {
        var key = 'lunhuiSkill' + i;
        if (!Number.isFinite(Number(player.items[key]))) player.items[key] = 0;
        player.items[key] = Math.max(0, Math.floor(Number(player.items[key]) || 0));
    }
    for (i = 0; i < SAMSARA_SKILL_DEFS.length; i++) {
        var id = SAMSARA_SKILL_DEFS[i].id;
        var lv = player.samsaraSkills.levels[id];
        if (!Number.isFinite(Number(lv))) player.samsaraSkills.levels[id] = 0;
        player.samsaraSkills.levels[id] = Math.max(0, Math.min(SAMSARA_SKILL_MAX_LEVEL, Math.floor(Number(player.samsaraSkills.levels[id]) || 0)));
    }
}

var SAMSARA_SKILL_TRIGGER_BASE = 0.10; // 基础触发率 10%
var SAMSARA_SKILL_TRIGGER_PER_LEVEL = 0.001; // 每级 +0.1% 触发率
var SAMSARA_SKILL_TRIGGER_CAP = 0.20; // 等级成长触发率上限 20%
var SAMSARA_SKILL_DAMAGE_PER_LEVEL = 0.10; // 每级 +10% 技能伤害倍率

/** 兼容旧接口：加点不再提供三维被动，改为技能伤害触发 */
function getSamsaraSkillBonuses() {
    return { health: 0, attack: 0, critDamage: 0 };
}

function getSamsaraSkillDamagePercent(level) {
    var lv = Math.max(0, Math.floor(Number(level) || 0));
    return lv * SAMSARA_SKILL_DAMAGE_PER_LEVEL;
}

/** 获取某技能的光环伤害倍率加成（0.10=+10%） */
function getSamsaraSkillAuraDmgBonus(skillId) {
    if (!skillId || typeof getEquippedSamsaraAuraBonuses !== 'function') return 0;
    var auras = getEquippedSamsaraAuraBonuses();
    return (auras && auras.dmg && auras.dmg[skillId]) ? (Number(auras.dmg[skillId]) || 0) : 0;
}

/** 获取某技能的光环触发率上限加成（0.05=+5%） */
function getSamsaraSkillAuraTriggerCapBonus(skillId) {
    if (!skillId || typeof getEquippedSamsaraAuraBonuses !== 'function') return 0;
    var auras = getEquippedSamsaraAuraBonuses();
    return (auras && auras.triggerCap && auras.triggerCap[skillId]) ? (Number(auras.triggerCap[skillId]) || 0) : 0;
}

/**
 * 触发率 = min(上限, 10% + 等级×0.1%)
 * 上限默认 20%，可被装备光环额外抬高（每条 +5%~+15%）
 * @param {number} level
 * @param {string} [skillId] 传入时应用对应光环触发上限
 */
function getSamsaraSkillTriggerChance(level, skillId) {
    var lv = Math.max(0, Math.floor(Number(level) || 0));
    var cap = SAMSARA_SKILL_TRIGGER_CAP + getSamsaraSkillAuraTriggerCapBonus(skillId);
    return Math.min(cap, SAMSARA_SKILL_TRIGGER_BASE + lv * SAMSARA_SKILL_TRIGGER_PER_LEVEL);
}

/** 含光环的实际技能伤害倍率 */
function getSamsaraSkillEffectiveDamagePercent(level, skillId) {
    var base = getSamsaraSkillDamagePercent(level);
    var aura = getSamsaraSkillAuraDmgBonus(skillId);
    return base * (1 + aura);
}

/**
 * 世界地图普攻后结算：已学习的 15 个技能各自独立触发（触发率随等级成长，基础上限20%，光环可抬高）。
 * 单技能伤害 = 该技能倍率 ×(1+光环伤害加成) × 本下普攻伤害（含爆伤）；
 * 多个触发则独立叠加：技能A×普攻 + 技能B×普攻 + …
 * @param {object} monster
 * @param {*} hitDamage 本下已结算的普攻伤害（含暴击）
 * @param {{silent?: boolean}} options
 * @returns {number} 触发次数
 */
function applySamsaraSkillWorldMapHits(monster, hitDamage, options) {
    options = options || {};
    if (!monster || hitDamage == null) return 0;
    if (typeof ensureSamsaraSkillData !== 'function') return 0;
    ensureSamsaraSkillData();
    if (typeof multiplyBigByFinite !== 'function' || typeof bSub !== 'function') return 0;
    if (typeof cmpBigSci === 'function' && cmpBigSci(hitDamage, 0) <= 0) return 0;
    var silent = !!options.silent;
    var hits = 0;
    for (var i = 0; i < SAMSARA_SKILL_DEFS.length; i++) {
        var def = SAMSARA_SKILL_DEFS[i];
        var lv = Math.floor(Number(player.samsaraSkills.levels[def.id]) || 0);
        if (lv <= 0) continue;
        var triggerChance = getSamsaraSkillTriggerChance(lv, def.id);
        if (Math.random() >= triggerChance) continue;
        var ratio = getSamsaraSkillEffectiveDamagePercent(lv, def.id);
        if (!(ratio > 0)) continue;
        // 独立技能伤害：技能倍率 ×（普通攻击含爆伤）；光环乘算伤害倍率
        var skillDmg = multiplyBigByFinite(hitDamage, ratio);
        if (typeof cmpBigSci === 'function' && cmpBigSci(skillDmg, 0) <= 0) continue;
        monster.health = bSub(monster.health, skillDmg);
        hits++;
        if (!silent && typeof addBattleLog === 'function') {
            var pct = Math.floor(ratio * 100);
            var dmgText = (typeof formatSci === 'function') ? formatSci(skillDmg) : String(skillDmg);
            addBattleLog('【' + def.name + '】触发！+' + dmgText + ' 技能伤害（' + pct + '% × 本下普攻）');
        }
    }
    return hits;
}

function getSamsaraSkillUnlockReincarnation() {
    return (player.level && player.level.ascentionCounta) ? player.level.ascentionCounta : 0;
}

function toggleSamsaraSkillSystem() {
    ensureSamsaraSkillData();
    if (getSamsaraSkillUnlockReincarnation() < SAMSARA_SKILL_UNLOCK_REINCARNATION) {
        logAction('轮回技能需轮回' + SAMSARA_SKILL_UNLOCK_REINCARNATION + '转开启！', 'error');
        return;
    }
    var ui = document.getElementById('samsaraSkillUI');
    var overlay = document.getElementById('samsaraSkillOverlay');
    if (!ui || !overlay) return;
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateSamsaraSkillUI();
    }
}

function updateSamsaraSkillUI() {
    ensureSamsaraSkillData();
    var matEl = document.getElementById('samsaraSkillMaterialList');
    var listEl = document.getElementById('samsaraSkillList');
    var bonusEl = document.getElementById('samsaraSkillBonusSummary');
    if (!listEl) return;

    if (matEl) {
        var mats = [];
        for (var d = 1; d <= 15; d++) {
            var mk = getSamsaraSkillMaterialKey(d);
            var cnt = Math.floor(Number(player.items[mk]) || 0);
            mats.push(
                '<div style="background:rgba(0,0,0,0.28);border:1px solid rgba(180,80,100,0.45);border-radius:8px;padding:6px 8px;text-align:center;font-size:12px;">'
                + '<div style="color:#ffcdd2;">' + getSamsaraSkillMaterialName(d) + '</div>'
                + '<div style="color:#ff8a80;font-weight:bold;">' + cnt + '</div>'
                + '<div style="color:#9e9e9e;font-size:11px;">次元' + d + '</div>'
                + '</div>'
            );
        }
        matEl.innerHTML = mats.join('');
    }

    if (bonusEl) {
        var learned = 0;
        for (var bi = 0; bi < SAMSARA_SKILL_DEFS.length; bi++) {
            var blv = Math.floor(Number(player.samsaraSkills.levels[SAMSARA_SKILL_DEFS[bi].id]) || 0);
            if (blv > 0) learned++;
        }
        bonusEl.textContent = '已学 ' + learned + '/15 ｜ 触发率=10%+等级×0.1%（上限20%，光环可抬高）｜ 倍率=等级×10%（光环可乘算）｜ 各自独立，触发后可叠加';
    }

    function renderCard(def) {
        var lv = player.samsaraSkills.levels[def.id] || 0;
        var matKey = getSamsaraSkillMaterialKey(def.dim);
        var matName = getSamsaraSkillMaterialName(def.dim);
        var matHave = Math.floor(Number(player.items[matKey]) || 0);
        var nextCost = lv >= SAMSARA_SKILL_MAX_LEVEL ? 0 : getSamsaraSkillUpgradeCost(lv);
        var auraDmg = getSamsaraSkillAuraDmgBonus(def.id);
        var auraCap = getSamsaraSkillAuraTriggerCapBonus(def.id);
        var skillPct = Math.floor(getSamsaraSkillEffectiveDamagePercent(lv, def.id) * 100);
        var triggerCap = SAMSARA_SKILL_TRIGGER_CAP + auraCap;
        var triggerPct = (getSamsaraSkillTriggerChance(lv, def.id) * 100).toFixed(1);
        var auraHint = '';
        if (auraDmg > 0 || auraCap > 0) {
            var parts = [];
            if (auraDmg > 0) parts.push('光环伤害+' + (auraDmg * 100).toFixed(0) + '%');
            if (auraCap > 0) parts.push('光环触发上限+' + (auraCap * 100).toFixed(2) + '%');
            auraHint = '｜ ' + parts.join('，');
        }
        var perText = '独立倍率 ' + skillPct + '%（Lv×10%' + (auraDmg > 0 ? '×光环' : '') + '）｜ 触发率 ' + triggerPct + '%（上限' + (triggerCap * 100).toFixed(2) + '%）' + auraHint;
        var maxed = lv >= SAMSARA_SKILL_MAX_LEVEL;
        var btns = maxed
            ? '<div style="margin-top:8px;color:#81c784;font-size:12px;">已满级</div>'
            : '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">'
                + '<button onclick="upgradeSamsaraSkill(\'' + def.id + '\',1)" style="background:linear-gradient(180deg,#8b3a4a,#5c2432);color:#ffe0e6;border:1px solid #c8667a;padding:5px 8px;border-radius:6px;cursor:pointer;font-size:12px;">+1（' + nextCost + '）</button>'
                + '<button onclick="upgradeSamsaraSkill(\'' + def.id + '\',10)" style="background:linear-gradient(180deg,#6a3040,#44202c);color:#ffd6de;border:1px solid #a85a6a;padding:5px 8px;border-radius:6px;cursor:pointer;font-size:12px;">+10</button>'
                + '<button onclick="upgradeSamsaraSkill(\'' + def.id + '\',100)" style="background:linear-gradient(180deg,#5a2838,#3a1824);color:#ffc8d2;border:1px solid #8a4a58;padding:5px 8px;border-radius:6px;cursor:pointer;font-size:12px;">+100</button>'
                + '<button onclick="upgradeSamsaraSkill(\'' + def.id + '\',0)" style="background:linear-gradient(180deg,#4a2030,#30141c);color:#ffb8c4;border:1px solid #7a4050;padding:5px 8px;border-radius:6px;cursor:pointer;font-size:12px;">尽量升</button>'
                + '</div>';
        return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(200,90,110,0.45);border-radius:10px;padding:10px;">'
            + '<div style="font-weight:bold;color:#ffcdd2;">' + def.name + '</div>'
            + '<div style="font-size:12px;color:#d8c8a1;margin:4px 0;">次元' + def.dim + '材料 ｜ ' + perText + '</div>'
            + '<div style="font-size:13px;color:#ffd54f;">Lv.' + lv + ' / ' + SAMSARA_SKILL_MAX_LEVEL
            + ' ｜ 材料：' + matName + ' ×' + matHave + '</div>'
            + btns
            + '</div>';
    }

    listEl.innerHTML = SAMSARA_SKILL_DEFS.map(renderCard).join('');
}

/**
 * @param {string} skillId
 * @param {number} count 升级次数；0 表示尽量升
 */
function upgradeSamsaraSkill(skillId, count) {
    ensureSamsaraSkillData();
    if (getSamsaraSkillUnlockReincarnation() < SAMSARA_SKILL_UNLOCK_REINCARNATION) {
        logAction('轮回技能需轮回' + SAMSARA_SKILL_UNLOCK_REINCARNATION + '转开启！', 'error');
        return;
    }
    var def = null;
    for (var i = 0; i < SAMSARA_SKILL_DEFS.length; i++) {
        if (SAMSARA_SKILL_DEFS[i].id === skillId) { def = SAMSARA_SKILL_DEFS[i]; break; }
    }
    if (!def) return;

    var lv = player.samsaraSkills.levels[def.id] || 0;
    if (lv >= SAMSARA_SKILL_MAX_LEVEL) {
        logAction(def.name + ' 已满级！', 'info');
        return;
    }

    var want = Math.floor(Number(count) || 0);
    var room = SAMSARA_SKILL_MAX_LEVEL - lv;
    var matKey = getSamsaraSkillMaterialKey(def.dim);
    var have = Math.floor(Number(player.items[matKey]) || 0);
    var maxWant = want <= 0 ? room : Math.min(want, room);

    var levels = 0;
    var remain = have;
    var cur = lv;
    while (levels < maxWant && cur < SAMSARA_SKILL_MAX_LEVEL) {
        var c = getSamsaraSkillUpgradeCost(cur);
        if (remain < c) break;
        remain -= c;
        cur++;
        levels++;
    }

    if (levels <= 0) {
        logAction(getSamsaraSkillMaterialName(def.dim) + ' 不足！需要 ' + getSamsaraSkillUpgradeCost(lv) + ' 个', 'error');
        return;
    }

    var totalCost = getSamsaraSkillUpgradeCostRange(lv, levels);
    player.items[matKey] = have - totalCost;
    player.samsaraSkills.levels[def.id] = lv + levels;
    logAction(def.name + ' 提升 ' + levels + ' 级 → Lv.' + player.samsaraSkills.levels[def.id] + '（消耗 ' + totalCost + ' ' + getSamsaraSkillMaterialName(def.dim) + '）', 'success');
    updateSamsaraSkillUI();
    if (typeof updatePlayerBattleStats === 'function') updatePlayerBattleStats();
    if (typeof updateDisplay === 'function') updateDisplay();
    if (typeof updateItemDisplay === 'function') updateItemDisplay();
    if (typeof saveGame === 'function') saveGame({ silent: true });
}

/** 与轮回装备相同：0.1% 掉落；次元 1-15 各掉对应材料，更高次元掉永恒轮回晶 */
function tryDropSamsaraSkillMaterial() {
    var dim = Math.floor(Number(player.dimensionLevel) || 0);
    if (dim < 1) return false;
    if (Math.random() >= 0.001) return false; // 0.1%，对齐轮回装备
    var dropDim = dim > 15 ? 15 : dim;
    ensureSamsaraSkillData();
    var matKey = getSamsaraSkillMaterialKey(dropDim);
    var matName = getSamsaraSkillMaterialName(dropDim);
    player.items[matKey] = Math.floor(Number(player.items[matKey]) || 0) + 1;
    if (typeof addBattleLog === 'function') addBattleLog('掉落：' + matName + ' x1');
    if (typeof logAction === 'function') logAction('获得 ' + matName + ' x1', 'legendary');
    if (typeof updateItemDisplay === 'function') updateItemDisplay();
    if (typeof saveGame === 'function') saveGame({ silent: true });
    return true;
}

function registerSamsaraSkillItemEffects() {
    if (typeof itemEffects === 'undefined' || !itemEffects) return;
    for (var i = 1; i <= 15; i++) {
        var key = 'lunhuiSkill' + i;
        if (!itemEffects[key]) {
            itemEffects[key] = {
                name: getSamsaraSkillMaterialName(i),
                effect: 0,
                description: '次元' + i + '掉落，用于升级对应轮回技能'
            };
        }
    }
}

if (typeof itemEffects !== 'undefined' && itemEffects) {
    registerSamsaraSkillItemEffects();
} else {
    // core 可能稍后加载；bootstrap 后再补注册
    setTimeout(registerSamsaraSkillItemEffects, 0);
}

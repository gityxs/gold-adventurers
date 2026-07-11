// 深渊特色玩法
// ========== 无限深渊 特色玩法（含装备/材料/收藏品类） ==========
function abyssTrySpecialEvents(clearedFloor) {
    if (!abyssRun || !abyssRun.active || clearedFloor <= 0) return false;
    var f = clearedFloor;
    if (f % 20 === 0 && Math.random() < 1) {
        abyssShowTrial();
        return true;
    }
    if (f % 15 === 0 && Math.random() < 0.25) {
        abyssShowCurse();
        return true;
    }
    if (f % 14 === 0 && f % 10 !== 0 && Math.random() < 0.16) {
        abyssShowForge();
        return true;
    }
    if (f % 13 === 0 && f % 10 !== 0 && Math.random() < 0.16) {
        abyssShowEnhanceAltar();
        return true;
    }
    if (f % 12 === 0 && f % 10 !== 0 && Math.random() < 0.18) {
        abyssShowRuin();
        return true;
    }
    if (f % 11 === 0 && f % 10 !== 0 && Math.random() < 0.17) {
        abyssShowAppraiser();
        return true;
    }
    if (f % 9 === 0 && f % 10 !== 0 && Math.random() < 0.18) {
        abyssShowEnchantTable();
        return true;
    }
    if (f % 8 === 0 && f % 10 !== 0 && Math.random() < 0.2) {
        abyssShowMerchant();
        return true;
    }
    if (f % 7 === 0 && f % 10 !== 0 && Math.random() < 0.14) {
        abyssShowEquipChest();
        return true;
    }
    if (f % 6 === 0 && f % 10 !== 0 && Math.random() < 0.15) {
        abyssShowWheel();
        return true;
    }
    if (f % 18 === 0 && f % 10 !== 0 && Math.random() < 0.17) {
        abyssShowMaze();
        return true;
    }
    if (f % 17 === 0 && f % 10 !== 0 && Math.random() < 0.15) {
        abyssShowCrystal();
        return true;
    }
    if (f % 4 === 0 && f % 10 !== 0 && Math.random() < 0.2) {
        abyssShowDiviner();
        return true;
    }
    if (f % 16 === 0 && f % 10 !== 0 && Math.random() < 0.18) {
        abyssShowMaterialMerchant();
        return true;
    }
    if (f % 19 === 0 && f % 10 !== 0 && Math.random() < 0.17) {
        abyssShowEquipRecycle();
        return true;
    }
    if (f % 21 === 0 && f % 10 !== 0 && Math.random() < 0.16) {
        abyssShowMysteryVault();
        return true;
    }
    if (f % 22 === 0 && f % 10 !== 0 && Math.random() < 0.17) {
        abyssShowRuneWorkshop();
        return true;
    }
    if (f % 23 === 0 && f % 10 !== 0 && Math.random() < 0.17) {
        abyssShowGemSmith();
        return true;
    }
    return false;
}
var ABYSS_CURSE_POOL = [
    { curse: { atkPct: -15 }, reward: { atkPct: 25 }, curseName: '攻击-15%', rewardName: '攻击+25%', rounds: 5 },
    { curse: { defPct: -20 }, reward: { defPct: 30 }, curseName: '防御-20%', rewardName: '防御+30%', rounds: 5 },
    { curse: { hpPct: -12 }, reward: { hpPct: 20 }, curseName: '生命-12%', rewardName: '生命+20%', rounds: 5 },
    { curse: { lifestealPct: -3 }, reward: { lifestealPct: 5 }, curseName: '吸血-3%', rewardName: '吸血+5%', rounds: 5 },
    { curse: { critRatePct: -5 }, reward: { critDmgPct: 15 }, curseName: '暴击率-5%', rewardName: '爆伤+15%', rounds: 5 },
    { curse: { dodgePct: -4 }, reward: { goldPct: 20 }, curseName: '闪避-4%', rewardName: '金币+20%', rounds: 5 }
];
function abyssShowCurse() {
    var pool = ABYSS_CURSE_POOL.slice();
    var opts = [];
    for (var i = 0; i < 3 && pool.length > 0; i++) {
        var idx = Math.floor(Math.random() * pool.length);
        opts.push(pool.splice(idx, 1)[0]);
    }
    var el = document.getElementById('abyssCurseOptions');
    if (!el) return;
    el.innerHTML = '';
    opts.forEach(function(o) {
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#6a1b9a,#4a148c)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #ce93d8';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '13px';
        btn.innerHTML = '<span style="color:#ff9999">' + o.curseName + '</span> 换 <span style="color:#81c784">' + o.rewardName + '</span><br><small>(' + o.rounds + '层)</small>';
        btn.onclick = (function(opt) { return function() { abyssApplyCurse(opt); }; })(o);
        el.appendChild(btn);
    });
    document.getElementById('abyssCurseOverlay').style.display = 'block';
    document.getElementById('abyssCurseUI').style.display = 'block';
    abyssLog('深渊诅咒·抉择出现！');
}
function abyssApplyCurse(opt) {
    if (!abyssRun) return;
    abyssRun.buffs = abyssRun.buffs || {};
    abyssRun.curseRounds = (abyssRun.curseRounds || 0) + (opt.rounds || 5);
    abyssRun.curseEffects = abyssRun.curseEffects || {};
    abyssRun.rewardEffects = abyssRun.rewardEffects || {};
    for (var k in opt.curse) abyssRun.curseEffects[k] = (abyssRun.curseEffects[k] || 0) + opt.curse[k];
    for (var k in opt.reward) abyssRun.rewardEffects[k] = (abyssRun.rewardEffects[k] || 0) + opt.reward[k];
    document.getElementById('abyssCurseOverlay').style.display = 'none';
    document.getElementById('abyssCurseUI').style.display = 'none';
    abyssLog('深渊诅咒：' + opt.curseName + ' 换 ' + opt.rewardName + '(' + (opt.rounds || 5) + '层)');
    abyssResumeAfterSpecialEvent();
}
function abyssSkipCurse() {
    document.getElementById('abyssCurseOverlay').style.display = 'none';
    document.getElementById('abyssCurseUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}
var ABYSS_MERCHANT_PACKS = [
    { cost: 80, outcomes: [{ p: 0.5, gold: 200 }, { p: 0.3, gold: 350 }, { p: 0.15, gold: 80 }, { p: 0.05, equip: true }] },
    { cost: 150, outcomes: [{ p: 0.4, gold: 400 }, { p: 0.35, atk: 25 }, { p: 0.15, gold: 50 }, { p: 0.1, equip: true, quality: 2 }] },
    { cost: 250, outcomes: [{ p: 0.35, gold: 600 }, { p: 0.3, hp: 200 }, { p: 0.2, critDmg: 20 }, { p: 0.1, equip: true, quality: 3 }, { p: 0.05, petBook: true }] }
];
function abyssShowMerchant() {
    var gold = abyssRun.gold || 0;
    document.getElementById('abyssMerchantGold').textContent = gold;
    var el = document.getElementById('abyssMerchantOptions');
    if (!el) return;
    el.innerHTML = '';
    ABYSS_MERCHANT_PACKS.forEach(function(pack, idx) {
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#e65100,#bf360c)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #ffb74d';
        btn.style.padding = '14px 20px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.textContent = '神秘礼包 ' + (idx + 1) + ' (' + pack.cost + ' 金币)';
        btn.disabled = gold < pack.cost;
        btn.onclick = (function(p) { return function() { abyssBuyMerchantPack(p); }; })(pack);
        el.appendChild(btn);
    });
    document.getElementById('abyssMerchantOverlay').style.display = 'block';
    document.getElementById('abyssMerchantUI').style.display = 'block';
    abyssLog('神秘流浪商人出现！');
}
function abyssBuyMerchantPack(pack) {
    if (!abyssRun || (abyssRun.gold || 0) < pack.cost) return;
    abyssRun.gold -= pack.cost;
    var r = Math.random();
    var acc = 0;
    for (var i = 0; i < pack.outcomes.length; i++) {
        acc += pack.outcomes[i].p;
        if (r < acc) {
            var o = pack.outcomes[i];
            if (o.gold) { abyssRun.gold += o.gold; abyssLog('获得闯关金币 +' + o.gold); }
            else if (o.atk) { abyssRun.tempStats = abyssRun.tempStats || {}; abyssRun.tempStats.atk = (abyssRun.tempStats.atk || 0) + o.atk; abyssLog('获得攻击 +' + o.atk); }
            else if (o.hp) { abyssRun.player.maxHp = (abyssRun.player.maxHp || 0) + o.hp; abyssRun.player.hp = (abyssRun.player.hp || 0) + o.hp; abyssLog('获得生命 +' + o.hp); }
            else if (o.critDmg) { abyssRun.tempStats = abyssRun.tempStats || {}; abyssRun.tempStats.critDmg = (abyssRun.tempStats.critDmg || 0) + o.critDmg; abyssLog('获得爆伤 +' + o.critDmg + '%'); }
            else if (o.equip) { var eq = abyssGenEquipment(abyssRun.floor, false, o.quality || 4); if (eq) { abyssRun.inventory.push(eq); abyssLog('获得装备 ' + eq.name); } }
            else if (o.petBook) { abyssRun.materials.petSkillBook = (abyssRun.materials.petSkillBook || 0) + 1; abyssLog('获得宠物兽决 x1'); }
            break;
        }
    }
    abyssSkipMerchant();
}
function abyssSkipMerchant() {
    document.getElementById('abyssMerchantOverlay').style.display = 'none';
    document.getElementById('abyssMerchantUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}
var ABYSS_TRIAL_OPTIONS = [
    { id: 'noPotion', name: '禁药试炼', desc: '接下来10层不能使用药剂', reward: { goldPct: 50, expPct: 30 } },
    { id: 'normalAtk', name: '纯武试炼', desc: '接下来10层只能普攻（禁用技能）', reward: { atkPct: 45, defPct: 25 } },
    { id: 'noPet', name: '孤狼试炼', desc: '接下来10层宠物不出战', reward: { hpPct: 35, lifestealPct: 6 } },
    { id: 'lowHp', name: '险境试炼', desc: '接下来10层生命上限-25%', reward: { critDmgPct: 40, skillDmg: 25 } }
];
var ABYSS_TRIAL_REWARD_NAMES = { goldPct: '金币', expPct: '经验', atkPct: '攻击', defPct: '防御', hpPct: '生命', lifestealPct: '吸血', critDmgPct: '爆伤', skillDmg: '技能伤害' };
function abyssFmtTrialReward(reward) {
    var parts = [];
    for (var k in reward) {
        var name = ABYSS_TRIAL_REWARD_NAMES[k] || k;
        var v = reward[k];
        parts.push(name + '+' + v + (k.indexOf('Pct') >= 0 || k === 'skillDmg' ? '%' : ''));
    }
    return parts.join('、');
}
function abyssShowTrial() {
    var opts = ABYSS_TRIAL_OPTIONS.slice();
    var chosen = [];
    for (var i = 0; i < 2 && opts.length > 0; i++) {
        chosen.push(opts.splice(Math.floor(Math.random() * opts.length), 1)[0]);
    }
    var el = document.getElementById('abyssTrialOptions');
    if (!el) return;
    el.innerHTML = '';
    chosen.forEach(function(o) {
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#1565c0,#0d47a1)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #64b5f6';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.textAlign = 'left';
        btn.innerHTML = '<strong>' + o.name + '</strong><br><small style="color:#aaa">' + o.desc + '</small><br><small style="color:#81c784">奖励: ' + abyssFmtTrialReward(o.reward) + '</small>';
        btn.onclick = (function(opt) { return function() { abyssApplyTrial(opt); }; })(o);
        el.appendChild(btn);
    });
    document.getElementById('abyssTrialOverlay').style.display = 'block';
    document.getElementById('abyssTrialUI').style.display = 'block';
    abyssLog('深渊试炼出现！');
}
function abyssApplyTrial(opt) {
    if (!abyssRun) return;
    abyssRun.trialId = opt.id;
    abyssRun.trialRoundsLeft = 10;
    abyssRun.trialReward = opt.reward;
    abyssRun.buffs = abyssRun.buffs || {};
    for (var k in opt.reward) abyssRun.buffs[k] = (abyssRun.buffs[k] || 0) + opt.reward[k];
    document.getElementById('abyssTrialOverlay').style.display = 'none';
    document.getElementById('abyssTrialUI').style.display = 'none';
    abyssLog('接受试炼：' + opt.name + '，接下来10层获得加成');
    abyssResumeAfterSpecialEvent();
}
function abyssSkipTrial() {
    document.getElementById('abyssTrialOverlay').style.display = 'none';
    document.getElementById('abyssTrialUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}
function abyssShowRuin() {
    var el = document.getElementById('abyssRuinOptions');
    if (!el) return;
    el.innerHTML = '';
    var opts = [
        { id: 'safe', name: '稳健探索', desc: '获得稳定奖励', style: 'linear-gradient(145deg,#2e7d32,#1b5e20)' },
        { id: 'risk', name: '冒险深入', desc: '50%丰厚/50%普通', style: 'linear-gradient(145deg,#e65100,#bf360c)' }
    ];
    opts.forEach(function(o) {
        var btn = document.createElement('button');
        btn.style.background = o.style;
        btn.style.color = '#fff';
        btn.style.border = '2px solid #d2691e';
        btn.style.padding = '14px 24px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.innerHTML = '<strong>' + o.name + '</strong><br><small>' + o.desc + '</small>';
        btn.onclick = (function(id) { return function() { abyssApplyRuin(id); }; })(o.id);
        el.appendChild(btn);
    });
    document.getElementById('abyssRuinOverlay').style.display = 'block';
    document.getElementById('abyssRuinUI').style.display = 'block';
    abyssLog('远古遗迹出现！');
}
function abyssApplyRuin(id) {
    if (!abyssRun) return;
    var f = abyssRun.floor;
    if (id === 'safe') {
        abyssRun.gold = (abyssRun.gold || 0) + Math.floor(80 + f * 6);
        abyssRun.materials.upgradeStone = (abyssRun.materials.upgradeStone || 0) + 1;
        var eq = abyssGenEquipment(f, false, 2);
        if (eq) abyssRun.inventory.push(eq);
        abyssLog('稳健探索：获得金币、升级石、装备');
    } else {
        if (Math.random() < 0.5) {
            abyssRun.gold = (abyssRun.gold || 0) + Math.floor(150 + f * 12);
            abyssRun.materials.enhanceStone = (abyssRun.materials.enhanceStone || 0) + 2;
            var eq2 = abyssGenEquipment(f, false, 4);
            if (eq2) abyssRun.inventory.push(eq2);
            abyssLog('冒险深入：获得丰厚奖励！');
        } else {
            abyssRun.gold = (abyssRun.gold || 0) + Math.floor(40 + f * 3);
            abyssLog('冒险深入：收获一般');
        }
    }
    document.getElementById('abyssRuinOverlay').style.display = 'none';
    document.getElementById('abyssRuinUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}
var ABYSS_WHEEL_POOL = [
    { type: 'gold', value: 120, name: '闯关金币+120' },
    { type: 'gold', value: 200, name: '闯关金币+200' },
    { type: 'atk', value: 15, name: '攻击+15' },
    { type: 'hp', value: 80, name: '生命+80' },
    { type: 'equip', name: '随机装备' },
    { type: 'potion', name: '生命药剂x2' },
    { type: 'petBook', name: '宠物兽决' },
    { type: 'exp', value: 40, name: '经验+40' }
];
function abyssShowWheel() {
    document.getElementById('abyssWheelResult').textContent = '';
    document.getElementById('abyssWheelSpinBtn').style.display = 'block';
    document.getElementById('abyssWheelOverlay').style.display = 'block';
    document.getElementById('abyssWheelUI').style.display = 'block';
    abyssLog('幸运轮盘出现！');
}
function abyssSpinWheel() {
    if (!abyssRun) return;
    document.getElementById('abyssWheelSpinBtn').style.display = 'none';
    var o = ABYSS_WHEEL_POOL[Math.floor(Math.random() * ABYSS_WHEEL_POOL.length)];
    var resultEl = document.getElementById('abyssWheelResult');
    if (o.type === 'gold') { abyssRun.gold = (abyssRun.gold || 0) + o.value; resultEl.textContent = o.name; }
    else if (o.type === 'atk') { abyssRun.tempStats = abyssRun.tempStats || {}; abyssRun.tempStats.atk = (abyssRun.tempStats.atk || 0) + o.value; resultEl.textContent = o.name; }
    else if (o.type === 'hp') { abyssRun.player.maxHp = (abyssRun.player.maxHp || 0) + o.value; abyssRun.player.hp = (abyssRun.player.hp || 0) + o.value; resultEl.textContent = o.name; }
    else if (o.type === 'equip') { var eq = abyssGenEquipment(abyssRun.floor, false); if (eq) { abyssRun.inventory.push(eq); resultEl.textContent = '获得 ' + eq.name; } }
    else if (o.type === 'potion') { abyssRun.materials.potion = (abyssRun.materials.potion || 0) + 2; resultEl.textContent = o.name; }
    else if (o.type === 'petBook') { abyssRun.materials.petSkillBook = (abyssRun.materials.petSkillBook || 0) + 1; resultEl.textContent = o.name; }
    else if (o.type === 'exp') { var ap = abyssApplyExpGoldBonus(o.value, 0); abyssRun.exp = (abyssRun.exp || 0) + ap.exp; resultEl.textContent = o.name; }
    setTimeout(function() {
        document.getElementById('abyssWheelOverlay').style.display = 'none';
        document.getElementById('abyssWheelUI').style.display = 'none';
        abyssResumeAfterSpecialEvent();
    }, 800);
}
function abyssResumeAfterSpecialEvent() {
    abyssRun.pendingChoice = false;
    if (abyssCheckLevelUp()) { abyssRun.needSpawnAfterUpgrade = true; return; }
    abyssRun.needSpawnAfterUpgrade = false;
    abyssSpawnMonster();
    updateAbyssRunUI();
}

// ========== 装备类5大增益玩法 ==========
function abyssShowForge() {
    var gold = abyssRun.gold || 0;
    document.getElementById('abyssForgeGold').textContent = gold;
    var el = document.getElementById('abyssForgeOptions');
    if (!el) return;
    el.innerHTML = '';
    var inv = abyssRun.inventory || [];
    var upgradable = inv.filter(function(eq) { return eq && eq.quality < 4; });
    var costUpgrade = Math.floor(100 + abyssRun.floor * 8);
    if (upgradable.length > 0 && gold >= costUpgrade) {
        var btn1 = document.createElement('button');
        btn1.style.background = 'linear-gradient(145deg,#d2691e,#8b4513)';
        btn1.style.color = '#fff';
        btn1.style.border = '2px solid #ffb74d';
        btn1.style.padding = '12px';
        btn1.style.borderRadius = '8px';
        btn1.style.cursor = 'pointer';
        btn1.textContent = '升级一件背包装备品质+1 (' + costUpgrade + ' 金币)';
        btn1.onclick = abyssApplyForgeUpgrade;
        el.appendChild(btn1);
    }
    var btn2 = document.createElement('button');
    btn2.style.background = 'linear-gradient(145deg,#607d8b,#455a64)';
    btn2.style.color = '#fff';
    btn2.style.border = '2px solid #90a4ae';
    btn2.style.padding = '12px';
    btn2.style.borderRadius = '8px';
    btn2.style.cursor = 'pointer';
    btn2.textContent = '领取升级石 x2 (免费)';
    btn2.onclick = abyssApplyForgeStone;
    el.appendChild(btn2);
    document.getElementById('abyssForgeOverlay').style.display = 'block';
    document.getElementById('abyssForgeUI').style.display = 'block';
    abyssLog('深渊锻造坊出现！');
}
function abyssApplyForgeUpgrade() {
    if (!abyssRun) return;
    var cost = Math.floor(100 + abyssRun.floor * 8);
    if ((abyssRun.gold || 0) < cost) return;
    var inv = abyssRun.inventory || [];
    var upgradable = inv.filter(function(eq) { return eq && eq.quality < 4; });
    if (upgradable.length === 0) return;
    var idx = Math.floor(Math.random() * upgradable.length);
    var eq = upgradable[idx];
    var invIdx = inv.indexOf(eq);
    eq.quality = Math.min(4, (eq.quality || 0) + 1);
    var baseName = (eq.name || '').replace(/^[灰绿蓝紫橙]·/, '');
    if (!baseName) baseName = '未知装备';
    eq.name = (ABYSS_QUALITIES[eq.quality] || '') + '·' + baseName;
    abyssRun.gold -= cost;
    document.getElementById('abyssForgeOverlay').style.display = 'none';
    document.getElementById('abyssForgeUI').style.display = 'none';
    abyssLog('锻造坊：' + eq.name + ' 品质提升！');
    abyssResumeAfterSpecialEvent();
}
function abyssApplyForgeStone() {
    if (!abyssRun) return;
    abyssRun.materials = abyssRun.materials || {};
    abyssRun.materials.upgradeStone = (abyssRun.materials.upgradeStone || 0) + 2;
    document.getElementById('abyssForgeOverlay').style.display = 'none';
    document.getElementById('abyssForgeUI').style.display = 'none';
    abyssLog('锻造坊：获得升级石 x2');
    abyssResumeAfterSpecialEvent();
}
function abyssSkipForge() {
    document.getElementById('abyssForgeOverlay').style.display = 'none';
    document.getElementById('abyssForgeUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

function abyssShowEnchantTable() {
    var equipped = abyssRun.equipped || {};
    var slots = [];
    for (var k in equipped) { if (equipped[k]) slots.push({ slot: k, eq: equipped[k] }); }
    var el = document.getElementById('abyssEnchantTableOptions');
    if (!el) return;
    el.innerHTML = '';
    if (slots.length === 0) {
        el.innerHTML = '<p style="color:#888;">无已装备装备，获得附魔书 x2</p>';
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#7c4dff,#512da8)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #b388ff';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.textContent = '领取附魔书 x2';
        btn.onclick = function() {
            abyssRun.materials = abyssRun.materials || {};
            abyssRun.materials.enchantBook = (abyssRun.materials.enchantBook || 0) + 2;
            document.getElementById('abyssEnchantTableOverlay').style.display = 'none';
            document.getElementById('abyssEnchantTableUI').style.display = 'none';
            abyssLog('附魔台：无装备可附魔，获得附魔书 x2');
            abyssResumeAfterSpecialEvent();
        };
        el.appendChild(btn);
        document.getElementById('abyssEnchantTableOverlay').style.display = 'block';
        document.getElementById('abyssEnchantTableUI').style.display = 'block';
        abyssLog('深渊附魔台出现！');
        return;
    } else {
        slots.forEach(function(s) {
            var btn = document.createElement('button');
            btn.style.background = 'linear-gradient(145deg,#7c4dff,#512da8)';
            btn.style.color = '#fff';
            btn.style.border = '2px solid #b388ff';
            btn.style.padding = '12px';
            btn.style.borderRadius = '8px';
            btn.style.cursor = 'pointer';
            btn.style.textAlign = 'left';
            btn.textContent = (ABYSS_SLOT_NAMES[s.slot] || s.slot) + ': ' + (s.eq.name || '未知');
            btn.onclick = (function(slotKey, eq) {
                return function() {
                    var mult = 1.15 + Math.random() * 0.11;
                    if (!eq.enchant || eq.enchant === true) eq.enchant = {};
                    if (typeof eq.enchant !== 'object') eq.enchant = { statMult: mult };
                    else eq.enchant.statMult = (eq.enchant.statMult || 1) * mult;
                    document.getElementById('abyssEnchantTableOverlay').style.display = 'none';
                    document.getElementById('abyssEnchantTableUI').style.display = 'none';
                    abyssLog('附魔台：' + (eq.name || '') + ' 已附魔，属性增幅约' + Math.floor((mult - 1) * 100) + '%');
                    abyssResumeAfterSpecialEvent();
                };
            })(s.slot, s.eq);
            el.appendChild(btn);
        });
    }
    document.getElementById('abyssEnchantTableOverlay').style.display = 'block';
    document.getElementById('abyssEnchantTableUI').style.display = 'block';
    abyssLog('深渊附魔台出现！');
}
function abyssSkipEnchantTable() {
    document.getElementById('abyssEnchantTableOverlay').style.display = 'none';
    document.getElementById('abyssEnchantTableUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

function abyssShowAppraiser() {
    var inv = abyssRun.inventory || [];
    var el = document.getElementById('abyssAppraiserOptions');
    if (!el) return;
    el.innerHTML = '';
    if (inv.length === 0) {
        el.innerHTML = '<p style="color:#888;">背包为空，获得符文槽开启器 x1</p>';
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#26c6da,#0097a7)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #4dd0e1';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.textContent = '领取符文槽开启器 x1';
        btn.onclick = function() {
            abyssRun.materials = abyssRun.materials || {};
            abyssRun.materials.runeSlotOpener = (abyssRun.materials.runeSlotOpener || 0) + 1;
            document.getElementById('abyssAppraiserOverlay').style.display = 'none';
            document.getElementById('abyssAppraiserUI').style.display = 'none';
            abyssLog('鉴宝师：背包空，获得符文槽开启器 x1');
            abyssResumeAfterSpecialEvent();
        };
        el.appendChild(btn);
        document.getElementById('abyssAppraiserOverlay').style.display = 'block';
        document.getElementById('abyssAppraiserUI').style.display = 'block';
        abyssLog('深渊鉴宝师出现！');
        return;
    }
    {
        var upgradable = inv.filter(function(eq) {
            var r = (eq.runes || []).length < ABYSS_MAX_RUNE_SLOTS;
            var g = (eq.gems || []).length < ABYSS_MAX_GEM_SLOTS;
            return r || g;
        });
        var pick;
        var addRune = false, addGem = false;
        if (upgradable.length > 0) {
            pick = upgradable[Math.floor(Math.random() * upgradable.length)];
            addRune = (pick.runes || []).length < ABYSS_MAX_RUNE_SLOTS;
            addGem = (pick.gems || []).length < ABYSS_MAX_GEM_SLOTS;
            if (addRune && addGem) {
                if (Math.random() < 0.5) {
                    pick.runes = pick.runes || [];
                    pick.runes.push(null);
                } else {
                    pick.gems = pick.gems || [];
                    pick.gems.push(null);
                }
            } else if (addRune) {
                pick.runes = pick.runes || [];
                pick.runes.push(null);
            } else {
                pick.gems = pick.gems || [];
                pick.gems.push(null);
            }
        } else {
            pick = null;
        }
        document.getElementById('abyssAppraiserOverlay').style.display = 'block';
        document.getElementById('abyssAppraiserUI').style.display = 'block';
        var info = pick ? ('已为 ' + (pick.name || '') + ' 添加孔位') : ('背包装备均已满孔，获得宝石槽开启器 x1');
        el.innerHTML = '<p style="color:#81c784;">' + info + '</p>';
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#26c6da,#0097a7)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #4dd0e1';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.textContent = '确定';
        btn.onclick = function() {
            if (!pick) {
                abyssRun.materials = abyssRun.materials || {};
                abyssRun.materials.gemSlotOpener = (abyssRun.materials.gemSlotOpener || 0) + 1;
                abyssLog('鉴宝师：满孔，获得宝石槽开启器 x1');
            } else abyssLog('鉴宝师：' + (pick.name || '') + ' 鉴定完成');
            document.getElementById('abyssAppraiserOverlay').style.display = 'none';
            document.getElementById('abyssAppraiserUI').style.display = 'none';
            abyssResumeAfterSpecialEvent();
        };
        el.appendChild(btn);
        abyssLog('深渊鉴宝师出现！');
        return;
    }
    document.getElementById('abyssAppraiserOverlay').style.display = 'block';
    document.getElementById('abyssAppraiserUI').style.display = 'block';
    abyssLog('深渊鉴宝师出现！');
}
function abyssSkipAppraiser() {
    document.getElementById('abyssAppraiserOverlay').style.display = 'none';
    document.getElementById('abyssAppraiserUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

var ABYSS_EQUIP_CHEST_PACKS = [
    { cost: 60, minQ: 0, maxQ: 2, name: '普通箱' },
    { cost: 180, minQ: 1, maxQ: 3, name: '精良箱' },
    { cost: 350, minQ: 2, maxQ: 4, name: '史诗箱' }
];
function abyssShowEquipChest() {
    var gold = abyssRun.gold || 0;
    document.getElementById('abyssEquipChestGold').textContent = gold;
    var el = document.getElementById('abyssEquipChestOptions');
    if (!el) return;
    el.innerHTML = '';
    ABYSS_EQUIP_CHEST_PACKS.forEach(function(pack) {
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#4caf50,#2e7d32)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #81c784';
        btn.style.padding = '14px 20px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.textContent = pack.name + ' (' + pack.cost + ' 金币)';
        btn.disabled = gold < pack.cost;
        btn.onclick = (function(p) {
            return function() {
                if (!abyssRun || (abyssRun.gold || 0) < p.cost) return;
                abyssRun.gold -= p.cost;
                var q = p.minQ + Math.floor(Math.random() * (p.maxQ - p.minQ + 1));
                var eq = abyssGenEquipment(abyssRun.floor, false, 4, q);
                if (eq) { abyssRun.inventory.push(eq); abyssLog('装备箱：获得 ' + eq.name); }
                document.getElementById('abyssEquipChestOverlay').style.display = 'none';
                document.getElementById('abyssEquipChestUI').style.display = 'none';
                abyssResumeAfterSpecialEvent();
            };
        })(pack);
        el.appendChild(btn);
    });
    document.getElementById('abyssEquipChestOverlay').style.display = 'block';
    document.getElementById('abyssEquipChestUI').style.display = 'block';
    abyssLog('深渊装备箱出现！');
}
function abyssSkipEquipChest() {
    document.getElementById('abyssEquipChestOverlay').style.display = 'none';
    document.getElementById('abyssEquipChestUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

function abyssShowEnhanceAltar() {
    var equipped = abyssRun.equipped || {};
    var slots = [];
    for (var k in equipped) { if (equipped[k]) slots.push({ slot: k, eq: equipped[k] }); }
    var runLevel = abyssRun.runLevel || 1;
    var el = document.getElementById('abyssEnhanceAltarOptions');
    if (!el) return;
    el.innerHTML = '';
    if (slots.length === 0) {
        el.innerHTML = '<p style="color:#888;">无已装备装备，获得强化石 x3</p>';
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#e91e63,#ad1457)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #f48fb1';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.textContent = '领取强化石 x3';
        btn.onclick = function() {
            abyssRun.materials = abyssRun.materials || {};
            abyssRun.materials.enhanceStone = (abyssRun.materials.enhanceStone || 0) + 3;
            document.getElementById('abyssEnhanceAltarOverlay').style.display = 'none';
            document.getElementById('abyssEnhanceAltarUI').style.display = 'none';
            abyssLog('强化祭坛：无装备可强化，获得强化石 x3');
            abyssResumeAfterSpecialEvent();
        };
        el.appendChild(btn);
    } else {
        slots.forEach(function(s) {
            var equipLv = abyssGetEffectiveEquipLevel(s.eq);
            var enhanceLv = s.eq.equipLevel != null ? (s.eq.level || 0) : 0;
            var canEnhance = enhanceLv < runLevel;
            var btn = document.createElement('button');
            btn.style.background = canEnhance ? 'linear-gradient(145deg,#e91e63,#ad1457)' : '#555';
            btn.style.color = '#fff';
            btn.style.border = '2px solid #f48fb1';
            btn.style.padding = '12px';
            btn.style.borderRadius = '8px';
            btn.style.cursor = canEnhance ? 'pointer' : 'not-allowed';
            btn.style.textAlign = 'left';
            btn.textContent = (ABYSS_SLOT_NAMES[s.slot] || s.slot) + ': ' + (s.eq.name || '') + ' (+' + enhanceLv + ')' + (canEnhance ? '' : ' 已满级');
            if (canEnhance) {
                btn.onclick = (function(eq) {
                    return function() {
                        eq.level = (eq.level || 0) + 1;
                        document.getElementById('abyssEnhanceAltarOverlay').style.display = 'none';
                        document.getElementById('abyssEnhanceAltarUI').style.display = 'none';
                        abyssLog('强化祭坛：' + (eq.name || '') + ' 强化+1');
                        abyssResumeAfterSpecialEvent();
                    };
                })(s.eq);
            }
            el.appendChild(btn);
        });
        var btnStone = document.createElement('button');
        btnStone.style.background = 'linear-gradient(145deg,#607d8b,#455a64)';
        btnStone.style.color = '#fff';
        btnStone.style.border = '2px solid #90a4ae';
        btnStone.style.padding = '12px';
        btnStone.style.borderRadius = '8px';
        btnStone.style.cursor = 'pointer';
        btnStone.textContent = '领取强化石 x3 (不强化装备)';
        btnStone.onclick = function() {
            abyssRun.materials = abyssRun.materials || {};
            abyssRun.materials.enhanceStone = (abyssRun.materials.enhanceStone || 0) + 3;
            document.getElementById('abyssEnhanceAltarOverlay').style.display = 'none';
            document.getElementById('abyssEnhanceAltarUI').style.display = 'none';
            abyssLog('强化祭坛：获得强化石 x3');
            abyssResumeAfterSpecialEvent();
        };
        el.appendChild(btnStone);
    }
    document.getElementById('abyssEnhanceAltarOverlay').style.display = 'block';
    document.getElementById('abyssEnhanceAltarUI').style.display = 'block';
    abyssLog('深渊强化祭坛出现！');
}
function abyssSkipEnhanceAltar() {
    document.getElementById('abyssEnhanceAltarOverlay').style.display = 'none';
    document.getElementById('abyssEnhanceAltarUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

// ========== 深渊材料商人（每16层，金币购买材料） ==========
var ABYSS_MATERIAL_MERCHANT_ITEMS = [
    { id: 'upgradeStone', name: '升级石', cost: 120, mat: 'upgradeStone', amount: 2 },
    { id: 'enhanceStone', name: '强化石', cost: 90, mat: 'enhanceStone', amount: 3 },
    { id: 'enchantBook', name: '附魔书', cost: 110, mat: 'enchantBook', amount: 1 },
    { id: 'potion', name: '生命药剂', cost: 70, mat: 'potion', amount: 2 },
    { id: 'rune', name: '随机符文', cost: 180, mat: 'rune', amount: 1 },
    { id: 'gem', name: '随机宝石', cost: 150, mat: 'gem', amount: 1 },
    { id: 'runeSlotOpener', name: '符文开孔器', cost: 280, mat: 'runeSlotOpener', amount: 1 },
    { id: 'gemSlotOpener', name: '宝石开孔器', cost: 260, mat: 'gemSlotOpener', amount: 1 }
];
function abyssShowMaterialMerchant() {
    abyssRun.materialMerchantPurchases = 0;
    var gold = abyssRun.gold || 0;
    document.getElementById('abyssMaterialMerchantGold').textContent = gold;
    document.getElementById('abyssMaterialMerchantPurchases').textContent = 3 - abyssRun.materialMerchantPurchases;
    var el = document.getElementById('abyssMaterialMerchantOptions');
    if (!el) return;
    el.innerHTML = '';
    function updateMaterialMerchantUI() {
        var remaining = 3 - (abyssRun.materialMerchantPurchases || 0);
        document.getElementById('abyssMaterialMerchantGold').textContent = abyssRun.gold;
        document.getElementById('abyssMaterialMerchantPurchases').textContent = remaining;
        for (var bi = 0; bi < el.children.length && bi < ABYSS_MATERIAL_MERCHANT_ITEMS.length; bi++) {
            var item = ABYSS_MATERIAL_MERCHANT_ITEMS[bi];
            el.children[bi].disabled = remaining <= 0 || (abyssRun.gold || 0) < item.cost;
        }
    }
    ABYSS_MATERIAL_MERCHANT_ITEMS.forEach(function(it) {
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#558b2f,#33691e)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #8bc34a';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.textAlign = 'left';
        btn.innerHTML = '<span>' + it.name + ' x' + it.amount + '</span><br><small style="color:#b0b0b0;">' + it.cost + ' 金币</small>';
        btn.disabled = (abyssRun.gold || 0) < it.cost;
        btn.onclick = (function(item) {
            return function() {
                if (!abyssRun) return;
                if ((abyssRun.materialMerchantPurchases || 0) >= 3) return;
                if ((abyssRun.gold || 0) < item.cost) return;
                abyssRun.materialMerchantPurchases = (abyssRun.materialMerchantPurchases || 0) + 1;
                abyssRun.gold -= item.cost;
                abyssRun.materials = abyssRun.materials || {};
                if (item.mat === 'rune') {
                    abyssRun.runeInventory = abyssRun.runeInventory || [];
                    for (var i = 0; i < item.amount; i++) abyssRun.runeInventory.push(ABYSS_RUNES[Math.floor(Math.random() * ABYSS_RUNES.length)].id);
                    abyssLog('材料商人：获得随机符文 x' + item.amount);
                } else if (item.mat === 'gem') {
                    abyssRun.gemInventory = abyssRun.gemInventory || [];
                    for (var i = 0; i < item.amount; i++) abyssRun.gemInventory.push(ABYSS_GEMS[Math.floor(Math.random() * ABYSS_GEMS.length)].id);
                    abyssLog('材料商人：获得随机宝石 x' + item.amount);
                } else {
                    abyssRun.materials[item.mat] = (abyssRun.materials[item.mat] || 0) + item.amount;
                    abyssLog('材料商人：获得 ' + item.name + ' x' + item.amount);
                }
                updateMaterialMerchantUI();
            };
        })(it);
        el.appendChild(btn);
    });
    document.getElementById('abyssMaterialMerchantOverlay').style.display = 'block';
    document.getElementById('abyssMaterialMerchantUI').style.display = 'block';
    abyssLog('深渊材料商人出现！本次可购买3次');
}
function abyssSkipMaterialMerchant() {
    document.getElementById('abyssMaterialMerchantOverlay').style.display = 'none';
    document.getElementById('abyssMaterialMerchantUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

// ========== 深渊装备回收站（每19层，分解装备换材料/金币） ==========
function abyssShowEquipRecycle() {
    var inv = abyssRun.inventory || [];
    var el = document.getElementById('abyssEquipRecycleOptions');
    if (!el) return;
    el.innerHTML = '';
    if (inv.length === 0) {
        el.innerHTML = '<p style="color:#888;">背包为空，获得闯关金币 +80</p>';
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#6d4c41,#4e342e)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #a1887f';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.textContent = '领取 80 金币';
        btn.onclick = function() {
            abyssRun.gold = (abyssRun.gold || 0) + 80;
            document.getElementById('abyssEquipRecycleOverlay').style.display = 'none';
            document.getElementById('abyssEquipRecycleUI').style.display = 'none';
            abyssLog('回收站：背包空，获得金币 +80');
            abyssResumeAfterSpecialEvent();
        };
        el.appendChild(btn);
    } else {
        inv.forEach(function(eq, idx) {
            var quality = eq.quality || 0;
            var goldVal = 10 + quality * 10 + (eq.level || 0) * 5;
            var matVal = quality >= 2 ? (quality >= 3 ? '升级石+强化石' : '强化石') : '金币';
            var btn = document.createElement('button');
            btn.style.background = (ABYSS_QUALITY_COLOR[quality] || '#333');
            btn.style.color = '#fff';
            btn.style.border = '2px solid #a1887f';
            btn.style.padding = '10px';
            btn.style.borderRadius = '8px';
            btn.style.cursor = 'pointer';
            btn.style.textAlign = 'left';
            btn.textContent = (eq.name || '装备') + ' → 金币+' + goldVal + (quality >= 2 ? ' 或 ' + matVal : '');
            btn.onclick = (function(item, index) {
                return function() {
                    var inv2 = abyssRun.inventory || [];
                    var idx2 = inv2.indexOf(item);
                    if (idx2 < 0) return;
                    inv2.splice(idx2, 1);
                    if (!abyssRun.materials) abyssRun.materials = {};
                    var q = item.quality || 0;
                    if (q >= 3 && Math.random() < 0.6) {
                        abyssRun.materials.upgradeStone = (abyssRun.materials.upgradeStone || 0) + 1;
                        abyssRun.materials.enhanceStone = (abyssRun.materials.enhanceStone || 0) + 1;
                        abyssLog('回收站：分解 ' + (item.name || '') + ' 获得升级石+强化石');
                    } else if (q >= 2 && Math.random() < 0.5) {
                        abyssRun.materials.enhanceStone = (abyssRun.materials.enhanceStone || 0) + 2;
                        abyssLog('回收站：分解 ' + (item.name || '') + ' 获得强化石 x2');
                    } else {
                        var g = 10 + q * 10 + (item.level || 0) * 5;
                        abyssRun.gold = (abyssRun.gold || 0) + g;
                        abyssLog('回收站：分解 ' + (item.name || '') + ' 获得金币 +' + g);
                    }
                    document.getElementById('abyssEquipRecycleOverlay').style.display = 'none';
                    document.getElementById('abyssEquipRecycleUI').style.display = 'none';
                    abyssResumeAfterSpecialEvent();
                };
            })(eq, idx);
            el.appendChild(btn);
        });
    }
    document.getElementById('abyssEquipRecycleOverlay').style.display = 'block';
    document.getElementById('abyssEquipRecycleUI').style.display = 'block';
    abyssLog('深渊装备回收站出现！');
}
function abyssSkipEquipRecycle() {
    document.getElementById('abyssEquipRecycleOverlay').style.display = 'none';
    document.getElementById('abyssEquipRecycleUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

// ========== 深渊神秘宝库（每21层，开宝箱获装备/材料） ==========
var ABYSS_MYSTERY_VAULT_PACKS = [
    { cost: 100, outcomes: [{ p: 0.4, type: 'gold', val: 150 }, { p: 0.3, type: 'mat', mat: 'upgradeStone', val: 1 }, { p: 0.2, type: 'equip', q: 1 }, { p: 0.1, type: 'rune' }] },
    { cost: 220, outcomes: [{ p: 0.35, type: 'gold', val: 250 }, { p: 0.25, type: 'mat', mat: 'enhanceStone', val: 2 }, { p: 0.25, type: 'equip', q: 2 }, { p: 0.1, type: 'rune' }, { p: 0.05, type: 'gem' }] },
    { cost: 380, outcomes: [{ p: 0.25, type: 'equip', q: 3 }, { p: 0.25, type: 'mat', mat: 'upgradeStone', val: 2 }, { p: 0.2, type: 'rune' }, { p: 0.15, type: 'gem' }, { p: 0.15, type: 'gold', val: 400 }] }
];
function abyssShowMysteryVault() {
    var gold = abyssRun.gold || 0;
    document.getElementById('abyssMysteryVaultGold').textContent = gold;
    var el = document.getElementById('abyssMysteryVaultOptions');
    if (!el) return;
    el.innerHTML = '';
    ABYSS_MYSTERY_VAULT_PACKS.forEach(function(pack, idx) {
        var btn = document.createElement('button');
        btn.style.background = idx === 2 ? 'linear-gradient(145deg,#4a148c,#1a0033)' : idx === 1 ? 'linear-gradient(145deg,#6a1b9a,#4a148c)' : 'linear-gradient(145deg,#7b1fa2,#4a148c)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #b388ff';
        btn.style.padding = '14px 20px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.textContent = '神秘宝箱 ' + (idx + 1) + ' (' + pack.cost + ' 金币)';
        btn.disabled = gold < pack.cost;
        btn.onclick = (function(p) {
            return function() {
                if (!abyssRun || (abyssRun.gold || 0) < p.cost) return;
                abyssRun.gold -= p.cost;
                var r = Math.random(), acc = 0;
                for (var i = 0; i < p.outcomes.length; i++) {
                    acc += p.outcomes[i].p;
                    if (r < acc) {
                        var o = p.outcomes[i];
                        if (o.type === 'gold') { abyssRun.gold += o.val; abyssLog('神秘宝库：获得金币 +' + o.val); }
                        else if (o.type === 'mat') { abyssRun.materials = abyssRun.materials || {}; abyssRun.materials[o.mat] = (abyssRun.materials[o.mat] || 0) + (o.val || 1); abyssLog('神秘宝库：获得材料'); }
                        else if (o.type === 'equip') { var eq = abyssGenEquipment(abyssRun.floor, false, 4, o.q); if (eq) { abyssRun.inventory.push(eq); abyssLog('神秘宝库：获得 ' + eq.name); } }
                        else if (o.type === 'rune') { abyssRun.runeInventory = abyssRun.runeInventory || []; abyssRun.runeInventory.push(ABYSS_RUNES[Math.floor(Math.random() * ABYSS_RUNES.length)].id); abyssLog('神秘宝库：获得随机符文'); }
                        else if (o.type === 'gem') { abyssRun.gemInventory = abyssRun.gemInventory || []; abyssRun.gemInventory.push(ABYSS_GEMS[Math.floor(Math.random() * ABYSS_GEMS.length)].id); abyssLog('神秘宝库：获得随机宝石'); }
                        break;
                    }
                }
                document.getElementById('abyssMysteryVaultOverlay').style.display = 'none';
                document.getElementById('abyssMysteryVaultUI').style.display = 'none';
                abyssResumeAfterSpecialEvent();
            };
        })(pack);
        el.appendChild(btn);
    });
    document.getElementById('abyssMysteryVaultOverlay').style.display = 'block';
    document.getElementById('abyssMysteryVaultUI').style.display = 'block';
    abyssLog('深渊神秘宝库出现！');
}
function abyssSkipMysteryVault() {
    document.getElementById('abyssMysteryVaultOverlay').style.display = 'none';
    document.getElementById('abyssMysteryVaultUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

// ========== 深渊符文工坊（每22层，免费镶符文或获得符文） ==========
function abyssShowRuneWorkshop() {
    var equipped = abyssRun.equipped || {};
    var runeInv = (abyssRun.runeInventory || []).slice();
    var slotsWithSlots = [];
    for (var k in equipped) {
        var eq = equipped[k];
        if (eq && (eq.runes || []).length < ABYSS_MAX_RUNE_SLOTS) slotsWithSlots.push({ slot: k, eq: eq });
    }
    var el = document.getElementById('abyssRuneWorkshopOptions');
    if (!el) return;
    el.innerHTML = '';
    var embedCount = Math.min(slotsWithSlots.length, runeInv.length);
    if (embedCount > 0) {
        for (var i = 0; i < embedCount; i++) {
            (function() {
                var s = slotsWithSlots[i];
                var runeId = runeInv[i];
                var runeInfo = getAbyssRuneById(runeId);
                var btn = document.createElement('button');
                btn.style.background = 'linear-gradient(145deg,#6a1b9a,#4a148c)';
                btn.style.color = '#fff';
                btn.style.border = '2px solid #ce93d8';
                btn.style.padding = '12px';
                btn.style.borderRadius = '8px';
                btn.style.cursor = 'pointer';
                btn.style.textAlign = 'left';
                btn.textContent = (ABYSS_SLOT_NAMES[s.slot] || s.slot) + ': ' + (s.eq.name || '') + ' → 镶嵌 ' + (runeInfo ? runeInfo.name : runeId);
                btn.onclick = (function(equip, rid) {
                    return function() {
                        equip.runes = equip.runes || [];
                        if (equip.runes.length < ABYSS_MAX_RUNE_SLOTS) {
                            var idx = (abyssRun.runeInventory || []).indexOf(rid);
                            if (idx >= 0) {
                                abyssRun.runeInventory.splice(idx, 1);
                                equip.runes.push(rid);
                                abyssLog('符文工坊：' + (equip.name || '') + ' 镶嵌 ' + (getAbyssRuneById(rid) ? getAbyssRuneById(rid).name : ''));
                            }
                        }
                        document.getElementById('abyssRuneWorkshopOverlay').style.display = 'none';
                        document.getElementById('abyssRuneWorkshopUI').style.display = 'none';
                        abyssResumeAfterSpecialEvent();
                    };
                })(s.eq, runeId);
                el.appendChild(btn);
            })();
        }
    }
    var btnRune = document.createElement('button');
    btnRune.style.background = 'linear-gradient(145deg,#7b1fa2,#4a148c)';
    btnRune.style.color = '#fff';
    btnRune.style.border = '2px solid #ce93d8';
    btnRune.style.padding = '12px';
    btnRune.style.borderRadius = '8px';
    btnRune.style.cursor = 'pointer';
    btnRune.textContent = '领取随机符文 x2（不镶嵌）';
    btnRune.onclick = function() {
        abyssRun.runeInventory = abyssRun.runeInventory || [];
        abyssRun.runeInventory.push(ABYSS_RUNES[Math.floor(Math.random() * ABYSS_RUNES.length)].id);
        abyssRun.runeInventory.push(ABYSS_RUNES[Math.floor(Math.random() * ABYSS_RUNES.length)].id);
        document.getElementById('abyssRuneWorkshopOverlay').style.display = 'none';
        document.getElementById('abyssRuneWorkshopUI').style.display = 'none';
        abyssLog('符文工坊：获得随机符文 x2');
        abyssResumeAfterSpecialEvent();
    };
    el.appendChild(btnRune);
    document.getElementById('abyssRuneWorkshopOverlay').style.display = 'block';
    document.getElementById('abyssRuneWorkshopUI').style.display = 'block';
    abyssLog('深渊符文工坊出现！');
}
function abyssSkipRuneWorkshop() {
    document.getElementById('abyssRuneWorkshopOverlay').style.display = 'none';
    document.getElementById('abyssRuneWorkshopUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

// ========== 深渊宝石匠（每23层，免费镶宝石或获得宝石） ==========
function abyssShowGemSmith() {
    var equipped = abyssRun.equipped || {};
    var gemInv = (abyssRun.gemInventory || []).slice();
    var slotsWithSlots = [];
    for (var k in equipped) {
        var eq = equipped[k];
        if (eq && (eq.gems || []).length < ABYSS_MAX_GEM_SLOTS) slotsWithSlots.push({ slot: k, eq: eq });
    }
    var el = document.getElementById('abyssGemSmithOptions');
    if (!el) return;
    el.innerHTML = '';
    var embedCount = Math.min(slotsWithSlots.length, gemInv.length);
    if (embedCount > 0) {
        for (var i = 0; i < embedCount; i++) {
            (function() {
                var s = slotsWithSlots[i];
                var gemId = gemInv[i];
                var gemInfo = getAbyssGemById(gemId);
                var btn = document.createElement('button');
                btn.style.background = 'linear-gradient(145deg,#e65100,#bf360c)';
                btn.style.color = '#fff';
                btn.style.border = '2px solid #ffb74d';
                btn.style.padding = '12px';
                btn.style.borderRadius = '8px';
                btn.style.cursor = 'pointer';
                btn.style.textAlign = 'left';
                btn.textContent = (ABYSS_SLOT_NAMES[s.slot] || s.slot) + ': ' + (s.eq.name || '') + ' → 镶嵌 ' + (gemInfo ? gemInfo.name : gemId);
                btn.onclick = (function(equip, gid) {
                    return function() {
                        equip.gems = equip.gems || [];
                        if (equip.gems.length < ABYSS_MAX_GEM_SLOTS) {
                            var idx = (abyssRun.gemInventory || []).indexOf(gid);
                            if (idx >= 0) {
                                abyssRun.gemInventory.splice(idx, 1);
                                equip.gems.push(gid);
                                abyssLog('宝石匠：' + (equip.name || '') + ' 镶嵌 ' + (getAbyssGemById(gid) ? getAbyssGemById(gid).name : ''));
                            }
                        }
                        document.getElementById('abyssGemSmithOverlay').style.display = 'none';
                        document.getElementById('abyssGemSmithUI').style.display = 'none';
                        abyssResumeAfterSpecialEvent();
                    };
                })(s.eq, gemId);
                el.appendChild(btn);
            })();
        }
    }
    var btnGem = document.createElement('button');
    btnGem.style.background = 'linear-gradient(145deg,#ff9800,#e65100)';
    btnGem.style.color = '#fff';
    btnGem.style.border = '2px solid #ffb74d';
    btnGem.style.padding = '12px';
    btnGem.style.borderRadius = '8px';
    btnGem.style.cursor = 'pointer';
    btnGem.textContent = '领取随机宝石 x2（不镶嵌）';
    btnGem.onclick = function() {
        abyssRun.gemInventory = abyssRun.gemInventory || [];
        abyssRun.gemInventory.push(ABYSS_GEMS[Math.floor(Math.random() * ABYSS_GEMS.length)].id);
        abyssRun.gemInventory.push(ABYSS_GEMS[Math.floor(Math.random() * ABYSS_GEMS.length)].id);
        document.getElementById('abyssGemSmithOverlay').style.display = 'none';
        document.getElementById('abyssGemSmithUI').style.display = 'none';
        abyssLog('宝石匠：获得随机宝石 x2');
        abyssResumeAfterSpecialEvent();
    };
    el.appendChild(btnGem);
    document.getElementById('abyssGemSmithOverlay').style.display = 'block';
    document.getElementById('abyssGemSmithUI').style.display = 'block';
    abyssLog('深渊宝石匠出现！');
}
function abyssSkipGemSmith() {
    document.getElementById('abyssGemSmithOverlay').style.display = 'none';
    document.getElementById('abyssGemSmithUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

// ========== 深渊占卜师（每4层，礼包抽奖有加有减） ==========
var ABYSS_DIVINER_STATS = [
    { key: 'atkPct', name: '攻击' },
    { key: 'hpPct', name: '生命' },
    { key: 'defPct', name: '防御' }
];
var ABYSS_DIVINER_TIERS = [
    { id: 'normal', name: '普通占卜', range: 3, desc: '攻击/生命/防御等 -3%~+3%' },
    { id: 'medium', name: '中级占卜', range: 5, desc: '攻击/生命/防御等 -5%~+5%' },
    { id: 'high', name: '高级占卜', range: 10, desc: '攻击/生命/防御等 -10%~+10%' }
];
function abyssShowDiviner() {
    var el = document.getElementById('abyssDivinerOptions');
    if (!el) return;
    el.innerHTML = '';
    ABYSS_DIVINER_TIERS.forEach(function(tier) {
        var btn = document.createElement('button');
        btn.style.background = tier.id === 'high' ? 'linear-gradient(145deg,#4a148c,#1a0033)' : tier.id === 'medium' ? 'linear-gradient(145deg,#6a1b9a,#3d0d5e)' : 'linear-gradient(145deg,#7b1fa2,#4a148c)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #ce93d8';
        btn.style.padding = '14px 20px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '13px';
        btn.innerHTML = '<strong>' + tier.name + '</strong><br><small style="color:#b0b0b0;">' + tier.desc + '</small>';
        btn.onclick = (function(t) { return function() { abyssApplyDiviner(t); }; })(tier);
        el.appendChild(btn);
    });
    document.getElementById('abyssDivinerOverlay').style.display = 'block';
    document.getElementById('abyssDivinerUI').style.display = 'block';
    abyssLog('深渊占卜师出现！');
}
function abyssApplyDiviner(tier) {
    if (!abyssRun) return;
    var stat = ABYSS_DIVINER_STATS[Math.floor(Math.random() * ABYSS_DIVINER_STATS.length)];
    var range = tier.range;
    var value = Math.floor(Math.random() * (range * 2 + 1)) - range;
    abyssRun.buffs = abyssRun.buffs || {};
    abyssRun.buffs[stat.key] = (abyssRun.buffs[stat.key] || 0) + value;
    var sign = value >= 0 ? '+' : '';
    var name = stat.name + sign + value + '%';
    abyssLog('占卜师·' + tier.name + '：' + name);
    document.getElementById('abyssDivinerOverlay').style.display = 'none';
    document.getElementById('abyssDivinerUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}
function abyssSkipDiviner() {
    document.getElementById('abyssDivinerOverlay').style.display = 'none';
    document.getElementById('abyssDivinerUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

// ========== 深渊共鸣水晶（每17层） ==========
var ABYSS_CRYSTAL_OPTIONS = [
    { cost: 200, buff: 'atkPct', value: 10, name: '攻击+10%', desc: '200金币' },
    { cost: 200, buff: 'hpPct', value: 15, name: '生命+15%', desc: '200金币' },
    { cost: 200, buff: 'critRatePct', value: 5, name: '暴击率+5%', desc: '200金币' },
    { cost: 200, buff: 'critDmgPct', value: 15, name: '爆伤+15%', desc: '200金币' },
    { cost: 200, buff: 'dodgePct', value: 5, name: '闪避+5%', desc: '200金币' },
    { cost: 200, buff: 'goldPct', value: 10, name: '金币+10%', desc: '200金币' }
];
function abyssShowCrystal() {
    var gold = abyssRun.gold || 0;
    document.getElementById('abyssCrystalGold').textContent = gold;
    var el = document.getElementById('abyssCrystalOptions');
    if (!el) return;
    el.innerHTML = '';
    ABYSS_CRYSTAL_OPTIONS.forEach(function(o) {
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#00838f,#006064)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #4dd0e1';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.textAlign = 'left';
        btn.innerHTML = '<span style="color:#81c784">' + o.name + '</span> (' + o.desc + ')';
        btn.disabled = gold < o.cost;
        btn.onclick = (function(opt) { return function() { abyssApplyCrystal(opt); }; })(o);
        el.appendChild(btn);
    });
    document.getElementById('abyssCrystalOverlay').style.display = 'block';
    document.getElementById('abyssCrystalUI').style.display = 'block';
    abyssLog('深渊共鸣水晶出现！');
}
function abyssApplyCrystal(opt) {
    if (!abyssRun || (abyssRun.gold || 0) < opt.cost) return;
    abyssRun.gold -= opt.cost;
    abyssRun.buffs = abyssRun.buffs || {};
    abyssRun.buffs[opt.buff] = (abyssRun.buffs[opt.buff] || 0) + opt.value;
    abyssLog('共鸣水晶：' + opt.name);
    document.getElementById('abyssCrystalOverlay').style.display = 'none';
    document.getElementById('abyssCrystalUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}
function abyssSkipCrystal() {
    document.getElementById('abyssCrystalOverlay').style.display = 'none';
    document.getElementById('abyssCrystalUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

// ========== 深渊幻境迷宫（每18层） ==========
function abyssShowMaze() {
    var el = document.getElementById('abyssMazeOptions');
    if (!el) return;
    el.innerHTML = '';
    var btn1 = document.createElement('button');
    btn1.style.background = 'linear-gradient(145deg,#2e7d32,#1b5e20)';
    btn1.style.color = '#fff';
    btn1.style.border = '2px solid #81c784';
    btn1.style.padding = '16px 28px';
    btn1.style.borderRadius = '10px';
    btn1.style.cursor = 'pointer';
    btn1.style.fontSize = '14px';
    btn1.innerHTML = '🛡 稳健路线<br><small style="color:#b0b0b0;">稳定获得金币+装备+材料</small>';
    btn1.onclick = function() { abyssApplyMaze('safe'); };
    var btn2 = document.createElement('button');
    btn2.style.background = 'linear-gradient(145deg,#6a1b9a,#4a148c)';
    btn2.style.color = '#fff';
    btn2.style.border = '2px solid #ce93d8';
    btn2.style.padding = '16px 28px';
    btn2.style.borderRadius = '10px';
    btn2.style.cursor = 'pointer';
    btn2.style.fontSize = '14px';
    btn2.innerHTML = '⚔ 冒险路线<br><small style="color:#b0b0b0;">20%大奖励 / 80%一般奖励</small>';
    btn2.onclick = function() { abyssApplyMaze('risk'); };
    el.appendChild(btn1);
    el.appendChild(btn2);
    document.getElementById('abyssMazeOverlay').style.display = 'block';
    document.getElementById('abyssMazeUI').style.display = 'block';
    abyssLog('深渊幻境迷宫出现！');
}
function abyssApplyMaze(id) {
    if (!abyssRun) return;
    var f = abyssRun.floor;
    abyssRun.materials = abyssRun.materials || {};
    if (id === 'safe') {
        abyssRun.gold = (abyssRun.gold || 0) + Math.floor(70 + f * 5);
        abyssRun.materials.upgradeStone = (abyssRun.materials.upgradeStone || 0) + 1;
        var eq = abyssGenEquipment(f, false, Math.random() < 0.5 ? 1 : 2);
        if (eq) abyssRun.inventory.push(eq);
        abyssLog('幻境迷宫·稳健：获得金币、升级石、装备');
    } else {
        if (Math.random() < 0.2) {
            abyssRun.gold = (abyssRun.gold || 0) + Math.floor(180 + f * 15);
            abyssRun.materials = abyssRun.materials || {};
            abyssRun.materials.enhanceStone = (abyssRun.materials.enhanceStone || 0) + 2;
            var eq2 = abyssGenEquipment(f, false, 3);
            if (eq2) abyssRun.inventory.push(eq2);
            abyssRun.tempStats = abyssRun.tempStats || {};
            abyssRun.tempStats.atk = (abyssRun.tempStats.atk || 0) + Math.floor(10 + f / 3);
            abyssLog('幻境迷宫·冒险：大丰收！');
        } else {
            abyssRun.gold = (abyssRun.gold || 0) + Math.floor(50 + f * 4);
            abyssLog('幻境迷宫·冒险：收获一般');
        }
    }
    document.getElementById('abyssMazeOverlay').style.display = 'none';
    document.getElementById('abyssMazeUI').style.display = 'none';
    abyssResumeAfterSpecialEvent();
}

// 深渊诅咒/奖励效果在 abyssCalcPlayerStats 的 buffs 之后应用；试炼限制在战斗逻辑中检查

// 启动初始化（本文件为 asset-boot 最后一环；标记资源就绪，允许主循环跑修仙/夜店等依赖）
window.__GOLD_GAME_ASSETS_READY = true;

function goldGamePlayerLooksFresh() {
    return (
        !player ||
        ((player.name === '勇者' || !player.name) &&
            (!player.reincarnationCount || player.reincarnationCount <= 0) &&
            (!player.battle || !player.battle.maxStage || player.battle.maxStage <= 1))
    );
}
window.goldGamePlayerLooksFresh = goldGamePlayerLooksFresh;

function goldGameMarkSaveReadyIfLoaded() {
    if (window._goldGameSaveLoadBlocked || !window._goldGameSaveLoadedOk) return;
    var aid = (typeof window.goldGameResolveAccountId === 'function')
        ? String(window.goldGameResolveAccountId() || '').trim()
        : (typeof window.getGoldGameAccountId === 'function' ? String(window.getGoldGameAccountId() || '').trim() : '');
    if (typeof window.markGoldGameLocalSaveReady === 'function' && aid) window.markGoldGameLocalSaveReady(aid);
    if (typeof window.getGoldGameAuthToken === 'function' && window.getGoldGameAuthToken() && typeof window.markGoldGameCloudHydrated === 'function') {
        window.markGoldGameCloudHydrated(aid);
    }
}

function goldGameBootLoadSave() {
    if (typeof loadSave !== 'function') return;
    loadSave();
    window._goldGameBootLoadAttempted = true;
    goldGameMarkSaveReadyIfLoaded();
}

// 全部脚本加载完毕后读档；账号 helpers 已在 systems.js 中就绪，首屏读档一次即可
goldGameBootLoadSave();

window.addEventListener('load', function goldGameRetryLoadAfterRefresh() {
    /** 首屏读档已成功：勿再 loadGame/loadSave（否则会重复读档、重复离线结算） */
    if (window._goldGameSaveLoadedOk && !window._goldGameSaveLoadBlocked) {
        return;
    }
    var localRaw = null;
    try {
        if (typeof readGoldGameSaveRawFromStorage === 'function') localRaw = readGoldGameSaveRawFromStorage();
        if (!localRaw) localRaw = localStorage.getItem('goldGameSave');
    } catch (eRaw) {}
    var hasLocalSave = !!(localRaw && localRaw.length > 20);
    /** 仅首屏读档失败/被拦截，或本地有档但未读入时重试 */
    var needRetry = window._goldGameSaveLoadBlocked || !window._goldGameSaveLoadedOk;
    if (!needRetry) return;
    if (!window._goldGameBootLoadAttempted && !hasLocalSave) return;
    goldGameBootLoadSave();
    if (typeof updateDisplay === 'function') updateDisplay();
});
if (typeof updateDisplay === 'function') updateDisplay();

// 联网时检测 API 静态资源版本，与当前 ?b= 不一致则自动刷新拉新 JS
if (typeof startGoldGameMainBuildWatch === 'function') startGoldGameMainBuildWatch();

/** 已登录但读档未成功时，自动尝试从云端恢复（防本地档误读/账号 ID 丢失后变新号） */
(function tryRecoverGoldGameCloudSaveOnBoot() {
    if (typeof window.getGoldGameAuthToken !== 'function' || !window.getGoldGameAuthToken()) return;
    if (typeof hasApi !== 'function' || !hasApi()) return;
    if (window._goldGameSaveLoadedOk) return;
    var raw = null;
    try {
        if (typeof readGoldGameSaveRawFromStorage === 'function') raw = readGoldGameSaveRawFromStorage();
        if (!raw) raw = localStorage.getItem('goldGameSave');
    } catch (eRaw) {}
    var aid = (typeof window.goldGameResolveAccountId === 'function')
        ? String(window.goldGameResolveAccountId() || '').trim()
        : '';
    /** 本地有档但界面仍是新号：先等 load 事件重试读档，再拉云档 */
    if (raw && raw.length > 20) {
        setTimeout(function () {
            if (window._goldGameSaveLoadedOk) return;
            if (typeof goldGameDownloadSaveNoCooldown !== 'function') return;
            goldGameDownloadSaveNoCooldown().finally(function () {
                if (typeof markGoldGameCloudHydrated === 'function') markGoldGameCloudHydrated(aid);
            });
        }, 300);
        return;
    }
    if (typeof goldGameDownloadSaveNoCooldown !== 'function') return;
    goldGameDownloadSaveNoCooldown().finally(function () {
        if (typeof markGoldGameCloudHydrated === 'function') markGoldGameCloudHydrated(aid);
    });
})();

// 仅新角色（读档后仍为默认名「勇者」）时提示起名
if (!versionErrorBlocked && player && player.name === '勇者' && window._goldGameSaveLoadedOk) {
    setTimeout(function () {
        var dlg = document.getElementById('renameDialog');
        var overlay = document.getElementById('renameOverlay');
        if (!dlg || !overlay) return;
        dlg.style.display = 'block';
        overlay.style.display = 'block';
        var titleEl = document.getElementById('renameDialogTitle');
        if (titleEl) titleEl.textContent = '请为你的角色起一个名字吧（1-10个字符）：';
        var inputEl = document.getElementById('newNameInput');
        if (inputEl) {
            inputEl.value = player.name;
            inputEl.focus();
        }
    }, 500);
}

// ========== 奇遇·闫闫 ==========
// 奇遇·闫闫：每5层结束有几率触发，奖励池（3选1）
var ABYSS_ENCOUNTER_CHANCE = 0.35;
var ABYSS_ENCOUNTER_POOL = [
    { key: 'gold', name: '闯关金币', value: 150, valueScale: 0 },
    { key: 'hp', name: '生命', value: 120, valueScale: 8 },
    { key: 'atk', name: '攻击', value: 22, valueScale: 1.5 },
    { key: 'def', name: '防御', value: 12, valueScale: 0.8 },
    { key: 'lifesteal', name: '吸血', value: 1, valueScale: 0 },
    { key: 'critRate', name: '暴击率', value: 2, valueScale: 0 },
    { key: 'critDmg', name: '爆伤', value: 8, valueScale: 0 },
    { key: 'skillDmg', name: '技能伤害', value: 4, valueScale: 0 },
    { key: 'exp', name: '经验', value: 50, valueScale: 0 },
    { key: 'equip', name: '随机装备', value: 1, valueScale: 0 }
];

function abyssShowEncounter() {
    var f = abyssRun.floor;
    var pool = ABYSS_ENCOUNTER_POOL.slice();
    var opts = [];
    for (var i = 0; i < 3 && pool.length > 0; i++) {
        var idx = Math.floor(Math.random() * pool.length);
        var o = pool[idx];
        pool.splice(idx, 1);
        var v = o.key === 'equip' ? 1 : (o.value + (o.valueScale ? Math.floor(f * o.valueScale) : 0));
        opts.push({ key: o.key, name: o.name, value: v });
    }
    var el = document.getElementById('abyssEncounterOptions');
    if (!el) return;
    el.innerHTML = '';
    opts.forEach(function(o) {
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#2e7d32,#1b5e20)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #81c784';
        btn.style.padding = '14px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        if (o.key === 'equip') btn.textContent = o.name;
        else btn.textContent = o.name + '+' + o.value + (o.key === 'lifesteal' || o.key === 'dodge' || o.key === 'critRate' || o.key === 'skillDmg' ? '%' : (o.key === 'exp' ? '' : ''));
        btn.onclick = (function(k, v) { return function() { abyssApplyEncounterChoice(k, v); }; })(o.key, o.value);
        el.appendChild(btn);
    });
    document.getElementById('abyssEncounterOverlay').style.display = 'block';
    document.getElementById('abyssEncounterUI').style.display = 'block';
}

function abyssApplyEncounterChoice(key, value) {
    if (!abyssRun) return;
    abyssRun.tempStats = abyssRun.tempStats || {};
    var nameMap = { gold: '闯关金币', hp: '生命', atk: '攻击', def: '防御', lifesteal: '吸血', critRate: '暴击率', critDmg: '爆伤', skillDmg: '技能伤害', exp: '经验', equip: '随机装备' };
    if (key === 'gold') {
        abyssRun.gold = (abyssRun.gold || 0) + value;
    } else if (key === 'exp') {
        var applied = abyssApplyExpGoldBonus(value, 0);
        abyssRun.exp = (abyssRun.exp || 0) + applied.exp;
    } else if (key === 'equip') {
        var eq = abyssGenEquipment(abyssRun.floor, false);
        if (eq) { abyssRun.inventory.push(eq); abyssLog('奇遇·闫闫：获得装备 ' + eq.name); }
    } else if (key === 'hp') {
        abyssRun.player.maxHp = (abyssRun.player.maxHp || 0) + value;
        abyssRun.player.hp = (abyssRun.player.hp || 0) + value;
    } else {
        abyssRun.tempStats[key] = (abyssRun.tempStats[key] || 0) + value;
    }
    if (key !== 'equip') abyssLog('奇遇·闫闫：选择 ' + (nameMap[key] || key) + '+' + value);
    document.getElementById('abyssEncounterOverlay').style.display = 'none';
    document.getElementById('abyssEncounterUI').style.display = 'none';
    abyssRun.pendingChoice = false;
    if (abyssCheckLevelUp()) { abyssRun.needSpawnAfterUpgrade = true; return; }
    abyssRun.needSpawnAfterUpgrade = false;
    abyssSpawnMonster();
    updateAbyssRunUI();
}

function abyssShowChoice() {
    var f = abyssRun.floor;
    var pool = ABYSS_CHOICE_POOL.slice();
    var opts = [];
    for (var i = 0; i < 5 && pool.length > 0; i++) {
        var idx = Math.floor(Math.random() * pool.length);
        var o = pool[idx];
        pool.splice(idx, 1);
        var v = o.key === 'level' ? 25 : (o.value + (o.valueScale ? Math.floor(f * o.valueScale) : 0));
        opts.push({ key: o.key, name: o.name, value: v });
    }
    var el = document.getElementById('abyssChoiceOptions');
    el.innerHTML = '';
    opts.forEach(function(o) {
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#6a0dad,#4a0072)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #b388ff';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.textContent = o.key === 'level' ? o.name : (o.name + '+' + o.value + (o.key === 'lifesteal' || o.key === 'dodge' || o.key === 'critRate' || o.key === 'reduceMonsterDef' ? '%' : ''));
        btn.onclick = (function(k, v) { return function() { abyssApplyChoice(k, v); }; })(o.key, o.value);
        el.appendChild(btn);
    });
    document.getElementById('abyssChoiceOverlay').style.display = 'block';
    document.getElementById('abyssChoiceUI').style.display = 'block';
}

function abyssApplyChoice(key, value) {
    if (!abyssRun) return;
    abyssRun.tempStats = abyssRun.tempStats || {};
    var nameMap = { hp: '生命', atk: '攻击', def: '防御', lifesteal: '吸血', dodge: '闪避', critRate: '暴击率', critDmg: '爆伤', skillDmg: '技能伤害', reduceMonsterDef: '减怪防', level: '经验' };
    if (key === 'level') {
        var appliedLevel = abyssApplyExpGoldBonus(25, 0);
        abyssRun.exp = (abyssRun.exp || 0) + appliedLevel.exp;
    } else if (key === 'hp') {
        abyssRun.player.maxHp = bAdd(abyssRun.player.maxHp, value);
        abyssRun.player.hp = bAdd(abyssRun.player.hp, value);
    } else {
        abyssRun.tempStats[key] = (abyssRun.tempStats[key] || 0) + value;
    }
    document.getElementById('abyssChoiceOverlay').style.display = 'none';
    document.getElementById('abyssChoiceUI').style.display = 'none';
    abyssRun.pendingChoice = false;
    if (abyssCheckLevelUp()) { abyssRun.needSpawnAfterUpgrade = true; return; }
    abyssRun.needSpawnAfterUpgrade = false;
    abyssSpawnMonster();
    updateAbyssRunUI();
    abyssLog('选择: ' + (nameMap[key] || key) + '+' + value);
}

var ABYSS_UPGRADE_REFRESH_COST = 120;

function abyssCheckLevelUp() {
    if (!abyssRun || !abyssRun.active || abyssRun.pendingChoice || abyssRun.pendingUpgradeChoice) return false;
    var rl = Math.floor((abyssRun.exp || 0) / 100);
    if (rl <= (abyssRun.lastUpgradeChoiceLevel || 0)) return false;
    abyssRun.pendingUpgradeChoice = true;
    abyssRun.pendingUpgradeLevel = (abyssRun.lastUpgradeChoiceLevel || 0) + 1;
    abyssShowUpgradeChoice();
    return true;
}

function abyssShowUpgradeChoice() {
    if (!abyssRun) return;
    var pool = ABYSS_UPGRADE_POOL.slice();
    var opts = [];
    for (var i = 0; i < 3 && pool.length > 0; i++) {
        var idx = Math.floor(Math.random() * pool.length);
        var o = pool[idx];
        pool.splice(idx, 1);
        opts.push({ key: o.key, name: o.name, value: o.value, unit: o.unit || '%' });
    }
    abyssRun.currentUpgradeOptions = opts;
    var el = document.getElementById('abyssUpgradeChoiceOptions');
    if (!el) return;
    el.innerHTML = '';
    opts.forEach(function(o) {
        var btn = document.createElement('button');
        btn.style.background = 'linear-gradient(145deg,#2e7d32,#1b5e20)';
        btn.style.color = '#fff';
        btn.style.border = '2px solid #81c784';
        btn.style.padding = '14px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.textContent = o.name + '+' + o.value + (o.unit || '%');
        btn.onclick = (function(k, v) { return function() { abyssApplyUpgradeChoice(k, v); }; })(o.key, o.value);
        el.appendChild(btn);
    });
    var goldEl = document.getElementById('abyssUpgradePanelGold');
    if (goldEl) goldEl.textContent = abyssRun.gold || 0;
    var refreshBtn = document.getElementById('abyssUpgradeRefreshBtn');
    if (refreshBtn) refreshBtn.disabled = (abyssRun.gold || 0) < ABYSS_UPGRADE_REFRESH_COST;
    document.getElementById('abyssUpgradeChoiceOverlay').style.display = 'block';
    document.getElementById('abyssUpgradeChoiceUI').style.display = 'block';
}

function abyssRefreshUpgradeChoice() {
    if (!abyssRun || (abyssRun.gold || 0) < ABYSS_UPGRADE_REFRESH_COST) return;
    abyssRun.gold = (abyssRun.gold || 0) - ABYSS_UPGRADE_REFRESH_COST;
    abyssLog('消耗120闯关金币刷新升级选项');
    abyssShowUpgradeChoice();
}

function abyssApplyUpgradeChoice(key, value) {
    if (!abyssRun) return;
    abyssRun.buffs = abyssRun.buffs || {};
    abyssRun.buffs[key] = (abyssRun.buffs[key] || 0) + value;
    abyssRun.lastUpgradeChoiceLevel = abyssRun.pendingUpgradeLevel || abyssRun.runLevel;
    abyssRun.pendingUpgradeChoice = false;
    document.getElementById('abyssUpgradeChoiceOverlay').style.display = 'none';
    document.getElementById('abyssUpgradeChoiceUI').style.display = 'none';
    abyssLog('升级奖励: ' + (ABYSS_UPGRADE_POOL.find(function(x){ return x.key === key; }) || {}).name + '+' + value + '%');
    updateAbyssRunUI();
    var rl = Math.floor((abyssRun.exp || 0) / 100);
    if (rl > (abyssRun.lastUpgradeChoiceLevel || 0)) {
        abyssRun.pendingUpgradeChoice = true;
        abyssRun.pendingUpgradeLevel = (abyssRun.lastUpgradeChoiceLevel || 0) + 1;
        abyssShowUpgradeChoice();
        return;
    }
    if (abyssRun.afterUpgradeDoFloorClear) {
        abyssRun.afterUpgradeDoFloorClear = false;
        var f = abyssRun.floor - 1;
        if (abyssTrySpecialEvents(f)) return;
        if (f % 5 === 0 && Math.random() < ABYSS_ENCOUNTER_CHANCE) {
            abyssLog('奇遇·闫闫出现！');
            abyssShowEncounter();
            return;
        }
        abyssShowChoice();
        return;
    }
    abyssRun.pendingChoice = false;
    if (abyssRun.needSpawnAfterUpgrade) {
        abyssRun.needSpawnAfterUpgrade = false;
        abyssSpawnMonster();
    }
    updateAbyssRunUI();
}

function openAbyssTempShop() {
    document.getElementById('abyssTempShopGold').textContent = abyssRun.gold;
    var list = [];
    for (var i = 0; i < 6; i++) {
        var eq = abyssGenEquipment(abyssRun.floor, false);
        eq.price = Math.floor(80 + abyssRun.floor * 8 + eq.quality * 50);
        list.push({ type: 'equip', data: eq });
    }
    var el = document.getElementById('abyssTempShopContent');
    el.innerHTML = '';
    list.forEach(function(item) {
        var div = document.createElement('div');
        div.style.background = 'rgba(0,0,0,0.4)';
        div.style.padding = '10px';
        div.style.borderRadius = '8px';
        div.style.border = '1px solid #555';
        if (item.type === 'equip') {
            var e = item.data;
            div.innerHTML = '<div style="color:' + (ABYSS_QUALITY_COLOR[e.quality] || '#fff') + '">' + e.name + '</div><div style="font-size:12px;color:#888">' + (e.price || 0) + ' 金币</div>';
            var buyBtn = document.createElement('button');
            buyBtn.textContent = '购买';
            buyBtn.style.marginTop = '6px';
            buyBtn.onclick = (function(equip, cost) {
                return function() {
                    if (abyssRun.gold >= cost) {
                        abyssRun.gold -= cost;
                        abyssRun.inventory.push(equip);
                        openAbyssTempShop();
                    }
                };
            })(e, e.price);
            div.appendChild(buyBtn);
        } else {
            var name = item.type === 'enhanceStone' ? '强化石' : item.type === 'enchantBook' ? '附魔书' : '生命药剂(20%生命)';
            div.innerHTML = '<div>' + name + '</div><div style="font-size:12px">' + item.price + ' 金币</div>';
            var buyBtn = document.createElement('button');
            buyBtn.textContent = '购买';
            buyBtn.style.marginTop = '6px';
            buyBtn.onclick = (function(t, cost, heal) {
                return function() {
                    if (abyssRun.gold >= cost) {
                        abyssRun.gold -= cost;
                        if (t === 'enhanceStone') abyssRun.materials.enhanceStone++;
                        else if (t === 'enchantBook') abyssRun.materials.enchantBook++;
                        else if (t === 'potion') abyssRun.materials.potion++;
                        openAbyssTempShop();
                    }
                };
            })(item.type, item.price, item.heal || 0);
            div.appendChild(buyBtn);
        }
        el.appendChild(div);
    });
    document.getElementById('abyssTempShopOverlay').style.display = 'block';
    document.getElementById('abyssTempShopUI').style.display = 'block';
}

function closeAbyssTempShop() {
    document.getElementById('abyssTempShopOverlay').style.display = 'none';
    document.getElementById('abyssTempShopUI').style.display = 'none';
    abyssRun.justKilledBoss = false;
    if (abyssRun.curseRounds > 0) abyssRun.curseRounds--;
    if (abyssRun.trialRoundsLeft > 0) abyssRun.trialRoundsLeft--;
    abyssRun.floor++;
    abyssRun.pendingChoice = true;
    var clearedFloor = abyssRun.floor - 1;
    if (typeof goldGameFamilyDailyReport === 'function' && [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150].indexOf(clearedFloor) !== -1) {
        goldGameFamilyDailyReport(clearedFloor).then(function(r) {
            if (r && r.ok && !r.alreadyDone) {
                if (r.exp) abyssLog('家族任务：通过' + clearedFloor + '层，获得家族经验+1');
                if (r.artifactDropped && r.artifact) {
                    abyssLog('家族任务：获得深渊神器 ' + (r.artifact.displayName || r.artifact.name));
                    if (typeof logAction === 'function') logAction('家族任务获得深渊神器 ' + (r.artifact.displayName || r.artifact.name), 'success');
                }
                if (r.networkCoinGranted > 0) {
                    abyssLog('家族任务：获得联网币 ×' + r.networkCoinGranted);
                    if (typeof logAction === 'function') logAction('家族任务获得联网币 ×' + r.networkCoinGranted, 'success');
                }
            }
        }).catch(function() {});
    }
    if (abyssTrySpecialEvents(clearedFloor)) return;
    if (clearedFloor % 5 === 0 && Math.random() < ABYSS_ENCOUNTER_CHANCE) {
        abyssLog('奇遇·闫闫出现！');
        abyssShowEncounter();
        return;
    }
    abyssShowChoice();
}

function openAbyssEquipmentPanel() {
    if (!abyssRun || !abyssRun.active) return;
    var goldEl = document.getElementById('abyssEquipGold');
    if (goldEl) goldEl.textContent = formatNumber(abyssRun.gold || 0);
    var upgradeEl = document.getElementById('abyssUpgradeStoneCount');
    if (upgradeEl) upgradeEl.textContent = abyssRun.materials.upgradeStone || 0;
    document.getElementById('abyssEnhanceStoneCount').textContent = abyssRun.materials.enhanceStone || 0;
    document.getElementById('abyssEnchantBookCount').textContent = abyssRun.materials.enchantBook || 0;
    document.getElementById('abyssPotionCount').textContent = abyssRun.materials.potion || 0;
    var runeInv = abyssRun.runeInventory || [];
    var gemInv = abyssRun.gemInventory || [];
    var runeCountEl = document.getElementById('abyssRuneCount');
    var gemCountEl = document.getElementById('abyssGemCount');
    if (runeCountEl) runeCountEl.textContent = runeInv.length;
    if (gemCountEl) gemCountEl.textContent = gemInv.length;
    var runeOpenerEl = document.getElementById('abyssRuneOpenerCount');
    var gemOpenerEl = document.getElementById('abyssGemOpenerCount');
    if (runeOpenerEl) runeOpenerEl.textContent = abyssRun.materials.runeSlotOpener || 0;
    if (gemOpenerEl) gemOpenerEl.textContent = abyssRun.materials.gemSlotOpener || 0;
    var skillExtractEl = document.getElementById('abyssSkillExtractStoneCount');
    if (skillExtractEl) skillExtractEl.textContent = abyssRun.materials.skillExtractStone || 0;
    var slotEl = document.getElementById('abyssEquippedSlots');
    var slotFrag = document.createDocumentFragment();
    ABYSS_SLOTS.forEach(function(slot) {
        var eq = abyssRun.equipped[slot];
        var div = document.createElement('div');
        div.style.background = eq ? (ABYSS_QUALITY_COLOR[eq.quality] || '#333') : '#333';
        div.style.padding = '8px';
        div.style.borderRadius = '6px';
        div.style.cursor = 'pointer';
        div.style.fontSize = '12px';
        var line1 = ABYSS_SLOT_NAMES[slot] + ': ' + (eq ? abyssGetEquipDisplayName(eq) : '空');
        var line2 = '';
        if (eq && eq.equipSkill) {
            var eff = eq.equipSkill.effect;
            if (!eff && eq.equipSkill.id) {
                var sk = getAbyssEquipSkillById(eq.equipSkill.id);
                if (sk && sk.effect) eff = sk.effect;
            }
            var effDesc = abyssEquipSkillEffectDesc(eff);
            if (effDesc.length) line2 = '<div style="font-size:11px;color:#ce93d8;margin-top:4px;">' + eq.equipSkill.name + '：' + effDesc.join('；') + '</div>';
            else line2 = '<div style="font-size:11px;color:#b388ff;margin-top:4px;">' + eq.equipSkill.name + '</div>';
        }
        div.innerHTML = line1 + (line2 ? line2 : '');
        div.onclick = (function(s, e) { return function() { if (e) abyssOpenEquipAction(e, s); }; })(slot, eq);
        slotFrag.appendChild(div);
    });
    slotEl.innerHTML = '';
    slotEl.appendChild(slotFrag);
    var invEl = document.getElementById('abyssInventorySlots');
    var invFrag = document.createDocumentFragment();
    (abyssRun.inventory || []).forEach(function(eq, idx) {
        var div = document.createElement('div');
        div.style.background = (ABYSS_QUALITY_COLOR[eq.quality] || '#333');
        div.style.padding = '8px';
        div.style.borderRadius = '6px';
        div.style.cursor = 'pointer';
        div.style.fontSize = '12px';
        div.textContent = abyssGetEquipDisplayName(eq);
        div.onclick = (function(item, i) { return function() { abyssOpenEquipCompare(item, i); }; })(eq, idx);
        invFrag.appendChild(div);
    });
    invEl.innerHTML = '';
    invEl.appendChild(invFrag);
    document.getElementById('abyssEquipOverlay').style.display = 'block';
    document.getElementById('abyssEquipUI').style.display = 'block';
}

function closeAbyssEquipmentPanel() {
    document.getElementById('abyssEquipOverlay').style.display = 'none';
    document.getElementById('abyssEquipUI').style.display = 'none';
}

function openAbyssChallengeShop() {
    if (!abyssRun || !abyssRun.active) return;
    document.getElementById('abyssChallengeShopGold').textContent = formatNumber(abyssRun.gold || 0);
    var shopEl = document.getElementById('abyssChallengeShopContent');
    shopEl.innerHTML = '';
    var shopItems = [
        { id: 'upgradeStone', name: '升级石', price: 150, mat: 'upgradeStone' },
        { id: 'potion', name: '生命药剂', price: 80, mat: 'potion' },
        { id: 'enhanceStone', name: '强化石', price: 100, mat: 'enhanceStone' },
        { id: 'enchantBook', name: '附魔书', price: 120, mat: 'enchantBook' },
        { id: 'petRevivePotion', name: '宠物复活药水', price: 300, mat: 'petRevivePotion' },
        { id: 'petSkillBook', name: '宠物兽决', price: 110, mat: 'petSkillBook' },
        { id: 'neidanBeads', name: '灵珠', price: 150, mat: 'neidanBeads' },
        { id: 'randomRune', name: '随机符文', price: 200, mat: 'rune' },
        { id: 'randomGem', name: '随机宝石', price: 180, mat: 'gem' },
        { id: 'runeSlotOpener', name: '符文开孔器', price: 350, mat: 'runeSlotOpener' },
        { id: 'gemSlotOpener', name: '宝石开孔器', price: 320, mat: 'gemSlotOpener' },
        { id: 'skillExtractStone', name: '技能提取石', price: 666, mat: 'skillExtractStone' }
    ];
    shopItems.forEach(function(it) {
        var div = document.createElement('div');
        div.style.background = 'rgba(0,0,0,0.3)';
        div.style.padding = '10px 12px';
        div.style.borderRadius = '8px';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.fontSize = '14px';
        div.innerHTML = '<span>' + it.name + '</span><span style="color:#ffd700;">' + formatNumber(it.price) + ' 金币</span><button style="background:linear-gradient(145deg,#ffd700,#daa520);color:#333;border:none;padding:6px 14px;border-radius:5px;cursor:pointer;font-weight:bold;">购买</button>';
        var btn = div.querySelector('button');
        btn.onclick = (function(cost, mat) {
            return function() {
                if (!abyssRun || !abyssRun.active) return;
                if ((abyssRun.gold || 0) >= cost) {
                    abyssRun.gold -= cost;
                    if (mat === 'rune') {
                        abyssRun.runeInventory = abyssRun.runeInventory || [];
                        abyssRun.runeInventory.push(ABYSS_RUNES[Math.floor(Math.random() * ABYSS_RUNES.length)].id);
                    } else if (mat === 'gem') {
                        abyssRun.gemInventory = abyssRun.gemInventory || [];
                        abyssRun.gemInventory.push(ABYSS_GEMS[Math.floor(Math.random() * ABYSS_GEMS.length)].id);
                    } else if (mat === 'neidanBeads') {
                        abyssRun.neidanBeads = (abyssRun.neidanBeads || 0) + 1;
                    } else if (mat === 'runeSlotOpener' || mat === 'gemSlotOpener') {
                        abyssRun.materials[mat] = (abyssRun.materials[mat] || 0) + 1;
                    } else {
                        abyssRun.materials[mat] = (abyssRun.materials[mat] || 0) + 1;
                    }
                    document.getElementById('abyssChallengeShopGold').textContent = formatNumber(abyssRun.gold || 0);
                    if (abyssRun && abyssRun.active) abyssDeferUpdate();
                }
            };
        })(it.price, it.mat);
        shopEl.appendChild(div);
    });
    document.getElementById('abyssChallengeShopOverlay').style.display = 'block';
    document.getElementById('abyssChallengeShopUI').style.display = 'block';
}

function closeAbyssChallengeShop() {
    document.getElementById('abyssChallengeShopOverlay').style.display = 'none';
    document.getElementById('abyssChallengeShopUI').style.display = 'none';
}

var abyssPetPanelSelectedId = null;

function openAbyssPetPanel() {
    if (!abyssRun || !abyssRun.active) return;
    var pets = abyssRun.pets || [];
    document.getElementById('abyssPetReviveCount').textContent = abyssRun.materials.petRevivePotion || 0;
    var skillBookEl = document.getElementById('abyssPetSkillBookCount');
    if (skillBookEl) skillBookEl.textContent = abyssRun.materials.petSkillBook || 0;
    var beadEl = document.getElementById('abyssNeidanBeadsCount');
    if (beadEl) beadEl.textContent = abyssRun.neidanBeads || 0;
    var countEl = document.getElementById('abyssPetCount');
    if (countEl) {
        var normalCount = pets.filter(function(p){ return !p.isDivine; }).length;
        var divineCount = pets.filter(function(p){ return p.isDivine; }).length;
        countEl.textContent = normalCount + '/10' + (divineCount > 0 ? ' +' + divineCount + '神兽' : '');
    }
    var listEl = document.getElementById('abyssPetList');
    if (pets.length === 0) {
        listEl.innerHTML = '<div style="color:#888;font-size:12px;padding:12px;">暂无宠物<br/>击败怪物20%掉落</div>';
        document.getElementById('abyssPetDetail').innerHTML = '<div style="color:#888;text-align:center;padding:40px 20px;">暂无宠物</div>';
        document.getElementById('abyssPetDetailActions').innerHTML = '';
    } else {
        if (!abyssPetPanelSelectedId || !pets.some(function(p) { return p.id === abyssPetPanelSelectedId; }))
            abyssPetPanelSelectedId = pets[0].id;
        var listFrag = document.createDocumentFragment();
        for (var i = 0; i < pets.length; i++) {
            var pet = pets[i];
            var isDeployed = abyssIsPetDeployed(pet.id);
            var isDead = pet.hp !== null && pet.hp <= 0;
            var isSel = abyssPetPanelSelectedId === pet.id;
            var row = document.createElement('div');
            row.style.cssText = 'padding:10px 8px;cursor:pointer;border-bottom:1px solid #333;font-size:13px;' + (isSel ? 'background:rgba(194,24,91,0.35);border-left:3px solid #ff80ab;' : '');
            row.innerHTML = '<div style="color:' + (isDead ? '#666' : '#ff80ab') + ';font-weight:bold;">' + pet.name + '</div><div style="color:#aaa;font-size:11px;">Lv.' + pet.level + (isDeployed ? ' · 出战中' : '') + (isDead ? ' · 已死亡' : '') + '</div>';
            row.onclick = (function(pid) { return function() { abyssPetPanelSelectedId = pid; openAbyssPetPanel(); }; })(pet.id);
            listFrag.appendChild(row);
        }
        listEl.innerHTML = '';
        listEl.appendChild(listFrag);
        var selPet = null;
        for (var j = 0; j < pets.length; j++) { if (pets[j].id === abyssPetPanelSelectedId) { selPet = pets[j]; break; } }
        if (selPet) {
            var pstats = abyssCalcPetStats(selPet);
            var maxHp = pstats ? pstats.maxHp : 1;
            var curHp = selPet.hp === null ? maxHp : Math.max(0, selPet.hp);
            var expNext = 50;
            var expCur = (selPet.exp || 0) % expNext;
            var runLv = Math.max(1, Math.floor((abyssRun.exp || 0) / 100));
            var hpPct = maxHp > 0 ? (curHp / maxHp * 100) : 0;
            var expPct = (expCur / expNext * 100);
            var detail = document.getElementById('abyssPetDetail');
            var typeObj = (ABYSS_PET_TYPES && ABYSS_PET_TYPES.length) ? (function(){ for (var ti = 0; ti < ABYSS_PET_TYPES.length; ti++) { if (ABYSS_PET_TYPES[ti].id === selPet.type) return ABYSS_PET_TYPES[ti]; } return null; })() : null;
            var typeName = typeObj ? typeObj.name : '';
            var rareHtml = selPet.wild ? '<span style="color:#90a4ae;font-size:11px;">野生</span> '
                           : (selPet.super ? '<span style="color:#ff5722;font-size:11px;">超级</span> '
                           : (selPet.shiny ? '<span style="color:#ffeb3b;font-size:11px;">闪光</span> '
                           : (selPet.variant ? '<span style="color:#ffd700;font-size:11px;">变异</span> ' : '<span style="color:#b0bec5;font-size:11px;">宝宝</span> ')));
            selPet.equipment = selPet.equipment || { '项圈': null, '护腕': null, '铠甲': null };
            selPet.neidan = selPet.neidan || null;
            var eqLines = [];
            for (var slotIdx = 0; slotIdx < ABYSS_PET_EQUIP_SLOTS.length; slotIdx++) {
                var st = ABYSS_PET_EQUIP_SLOTS[slotIdx].type;
                var eqObj = selPet.equipment[st];
                var txt = st + ': ' + (eqObj ? (eqObj.prefix || '') + eqObj.name + (eqObj.atkPct ? ' 攻+' + eqObj.atkPct + '%' : '') + (eqObj.defPct ? ' 防+' + eqObj.defPct + '%' : '') + (eqObj.hpPct ? ' 体+' + eqObj.hpPct + '%' : '') + (eqObj.skill ? ' [' + eqObj.skill.name + ']' : '') : '空');
                eqLines.push(txt);
            }
            var ndLevel = selPet.neidan ? (selPet.neidan.level || 1) : 0;
            var ndMax = selPet.isDivine ? 15 : 5;
            var ndTierStr = selPet.neidan ? (selPet.neidan.tier === 'basic' ? '初级' : selPet.neidan.tier === 'mid' ? '中级' : selPet.neidan.tier === 'high' ? '高级' : '') : '';
            var neidanText = selPet.neidan ? (selPet.neidan.name + (ndTierStr ? '（' + ndTierStr + '）' : '') + ' Lv.' + ndLevel + '/' + ndMax + (selPet.neidan.desc ? ' - ' + selPet.neidan.desc : '')) : '未装备';
            detail.innerHTML = '<div style="margin-bottom:12px;"><span style="color:#ff80ab;font-size:16px;font-weight:bold;">' + selPet.name + '</span> ' + rareHtml + (typeName ? '<span style="color:#81c784;font-size:11px;">' + typeName + '</span> ' : '') + '<span style="color:#b388ff;">Lv.' + selPet.level + '/' + runLv + '</span></div>' +
                '<div style="margin-bottom:6px;"><div style="font-size:11px;color:#aaa;">气血</div><div style="height:18px;background:#333;border-radius:4px;overflow:hidden;"><div style="height:100%;width:' + hpPct + '%;background:linear-gradient(90deg,#c62828,#e91e63);border-radius:4px;"></div></div><div style="font-size:11px;color:#888;">' + formatNumber(curHp) + ' / ' + formatNumber(maxHp) + '</div></div>' +
                '<div style="margin-bottom:12px;"><div style="font-size:11px;color:#aaa;">经验</div><div style="height:12px;background:#333;border-radius:3px;overflow:hidden;"><div style="height:100%;width:' + expPct + '%;background:linear-gradient(90deg,#ffa726,#ffd54f);border-radius:3px;"></div></div><div style="font-size:11px;color:#888;">' + expCur + ' / ' + expNext + (selPet.level >= runLv ? ' (已满级)' : '') + '</div></div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;font-size:13px;"><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">攻击资质 <span style="color:#ff9800">' + selPet.growth.atk + '</span></div><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">防御资质 <span style="color:#2196f3">' + selPet.growth.def + '</span></div><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">体力资质 <span style="color:#4caf50">' + selPet.growth.hp + '</span></div><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">速度资质 <span style="color:#9c27b0">' + selPet.growth.speed + '</span></div></div>' +
                '<div style="font-size:11px;color:#aaa;margin-bottom:4px;">属性 攻击' + (pstats ? pstats.atk : 0) + ' 防御' + (pstats ? pstats.def : 0) + ' 气血' + (pstats ? pstats.maxHp : 0) + '</div>' +
                '<div style="font-size:11px;color:#b388ff;">技能: ' + ((selPet.skills || []).map(function(s) { return s.name; }).join('、') || '无') + '</div>' +
                '<div id="abyssPetEquipBlock" style="margin-top:10px;border-top:1px solid #333;padding-top:8px;"><div style="font-size:12px;color:#ffb74d;margin-bottom:6px;">宠物装备</div><div id="abyssPetEquipSlots" style="display:flex;flex-direction:column;gap:4px;"></div></div>' +
                '<div id="abyssPetNeidanBlock" style="margin-top:10px;border-top:1px solid #333;padding-top:8px;"><div style="font-size:12px;color:#ffb74d;margin-bottom:4px;">宠物内丹</div><div id="abyssPetNeidanBlockContent" style="font-size:11px;color:#e0e0e0;">' + neidanText + '</div></div>';
            var slotsEl = document.getElementById('abyssPetEquipSlots');
            if (slotsEl) {
                slotsEl.innerHTML = '';
                for (var si = 0; si < ABYSS_PET_EQUIP_SLOTS.length; si++) {
                    var slotType = ABYSS_PET_EQUIP_SLOTS[si].type;
                    var eqItem = selPet.equipment[slotType];
                    var row = document.createElement('div');
                    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:4px 8px;background:rgba(0,0,0,0.25);border-radius:4px;border:1px solid #555;';
                    var nameStr = eqItem ? (eqItem.prefix || '') + eqItem.name + (eqItem.atkPct ? ' 攻+' + eqItem.atkPct + '%' : '') + (eqItem.defPct ? ' 防+' + eqItem.defPct + '%' : '') + (eqItem.hpPct ? ' 体+' + eqItem.hpPct + '%' : '') + (eqItem.skill ? ' [' + eqItem.skill.name + ']' : '') : '空';
                    row.innerHTML = '<span style="color:#aaa;">' + slotType + '</span><span style="color:#e0e0e0;">' + nameStr + '</span>';
                    if (eqItem && !selPet.isDivine) {
                        var ub = document.createElement('button');
                        ub.textContent = '卸下';
                        ub.style.cssText = 'background:#555;color:#fff;border:none;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:11px;';
                        ub.onclick = (function(pid, st) { return function() {
                            var pet = null;
                            for (var k = 0; k < abyssRun.pets.length; k++) { if (abyssRun.pets[k].id === pid) { pet = abyssRun.pets[k]; break; } }
                            if (!pet || !pet.equipment) return;
                            var old = pet.equipment[st];
                            if (old) {
                                abyssRun.petEquipmentInventory = abyssRun.petEquipmentInventory || [];
                                abyssRun.petEquipmentInventory.push(old);
                                pet.equipment[st] = null;
                                abyssLog('已卸下宠物装备 ' + (old.prefix || '') + old.name);
                                openAbyssPetPanel();
                                if (abyssRun && abyssRun.active) abyssDeferUpdate();
                            }
                        }; })(selPet.id, slotType);
                        row.appendChild(ub);
                        var db = document.createElement('button');
                        db.textContent = '分解';
                        db.style.cssText = 'background:#795548;color:#fff;border:none;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:11px;margin-left:4px;';
                        db.onclick = (function(pid, st) { return function() {
                            var pet = null;
                            for (var k = 0; k < abyssRun.pets.length; k++) { if (abyssRun.pets[k].id === pid) { pet = abyssRun.pets[k]; break; } }
                            if (!pet || !pet.equipment) return;
                            var old = pet.equipment[st];
                            if (old) {
                                pet.equipment[st] = null;
                                abyssRun.materials.petSkillBook = (abyssRun.materials.petSkillBook || 0) + 1;
                                abyssLog('分解装备获得宠物兽决 x1');
                                openAbyssPetPanel();
                                if (typeof refreshAbyssPetEquipBagList === 'function') refreshAbyssPetEquipBagList();
                                if (abyssRun && abyssRun.active) abyssDeferUpdate();
                            }
                        }; })(selPet.id, slotType);
                        row.appendChild(db);
                    }
                    slotsEl.appendChild(row);
                }
            }
            var neidanBlock = document.getElementById('abyssPetNeidanBlock');
            if (neidanBlock && selPet.neidan && !selPet.isDivine) {
                var btnWrap = document.createElement('div');
                btnWrap.style.cssText = 'margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;';
                var lvlNd = selPet.neidan.level || 1;
                if (lvlNd < 5) {
                    var cost = abyssNeidanUpgradeCost(selPet.neidan);
                    var beads = abyssRun.neidanBeads || 0;
                    var upBtn = document.createElement('button');
                    upBtn.textContent = '内丹升级（' + cost + ' 灵珠）';
                    upBtn.style.cssText = 'background:' + (beads >= cost ? '#6a1b9a' : '#444') + ';color:#ffeb3b;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;';
                    upBtn.disabled = beads < cost;
                    upBtn.onclick = (function(pid) { return function() { abyssUpgradePetNeidan(pid); }; })(selPet.id);
                    btnWrap.appendChild(upBtn);
                }
                var offBtn = document.createElement('button');
                offBtn.textContent = '卸下内丹';
                offBtn.style.cssText = 'background:#5d4037;color:#ffccbc;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;';
                offBtn.onclick = (function(pid) { return function() {
                    if (!abyssRun || !abyssRun.pets) return;
                    var pet = null;
                    for (var k = 0; k < abyssRun.pets.length; k++) {
                        if (abyssRun.pets[k].id === pid) { pet = abyssRun.pets[k]; break; }
                    }
                    if (!pet || !pet.neidan) { abyssLog('当前宠物未装备内丹'); return; }
                    abyssRun.petNeidanInventory = abyssRun.petNeidanInventory || [];
                    abyssRun.petNeidanInventory.push(pet.neidan);
                    abyssLog('已卸下宠物【' + pet.name + '】的内丹 ' + pet.neidan.name);
                    pet.neidan = null;
                    openAbyssPetPanel();
                    if (abyssRun && abyssRun.active) abyssDeferUpdate();
                }; })(selPet.id);
                btnWrap.appendChild(offBtn);
                neidanBlock.appendChild(btnWrap);
            }
            var actEl = document.getElementById('abyssPetDetailActions');
            var isDeployedSel = abyssIsPetDeployed(selPet.id);
            var isDeadSel = selPet.hp !== null && selPet.hp <= 0;
            var canRevive = isDeadSel && (abyssRun.materials.petRevivePotion || 0) >= 1;
            actEl.innerHTML = '';
            var maxSlots = abyssGetMaxDeployedSlots();
            var slotsFull = (abyssRun.deployedPetIds || []).length >= maxSlots;
            var btnOut = document.createElement('button');
            if (selPet.isDivine) {
                btnOut.textContent = '深渊神兽·强制出战';
                btnOut.style.cssText = 'background:#6a1b9a;color:#ce93d8;border:none;padding:8px 18px;border-radius:6px;cursor:default;font-weight:bold;';
                btnOut.disabled = true;
            } else {
                btnOut.textContent = isDeployedSel ? '收回' : (slotsFull ? '出战位已满(' + maxSlots + ')' : '出战');
                btnOut.style.cssText = 'background:' + (isDeployedSel ? '#555' : slotsFull ? '#444' : '#c2185b') + ';color:#fff;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-weight:bold;';
                btnOut.disabled = !isDeployedSel && slotsFull;
                btnOut.onclick = (function(pid) { return function() {
                    if (!abyssRun.deployedPetIds) abyssRun.deployedPetIds = [];
                    var idx = abyssRun.deployedPetIds.indexOf(pid);
                    if (idx >= 0) {
                        abyssRun.deployedPetIds.splice(idx, 1);
                        abyssLog('收回了宠物');
                    } else if (abyssRun.deployedPetIds.length < abyssGetMaxDeployedSlots()) {
                        abyssRun.deployedPetIds.push(pid);
                        var p = null;
                        for (var qi = 0; qi < abyssRun.pets.length; qi++) { if (abyssRun.pets[qi].id === pid) { p = abyssRun.pets[qi]; break; } }
                        if (p && p.hp === null) {
                            var ps = abyssCalcPetStats(p);
                            if (ps) p.hp = ps.maxHp;
                        }
                        abyssLog('派出宠物【' + (p ? p.name : '') + '】');
                    } else {
                        abyssLog('出战位已满(最多' + abyssGetMaxDeployedSlots() + '只)，可在专属商店购买出场宠物数量');
                    }
                    openAbyssPetPanel();
                    if (abyssRun && abyssRun.active) abyssDeferUpdate();
                }; })(selPet.id);
            }
            actEl.appendChild(btnOut);
            if (!selPet.isDivine) {
                var hasSkillBook = (abyssRun.materials.petSkillBook || 0) >= 1;
                var btnSkill = document.createElement('button');
                btnSkill.textContent = '打书(消耗1兽决)';
                btnSkill.style.cssText = 'background:' + (hasSkillBook ? '#ff9800' : '#555') + ';color:#fff;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-weight:bold;';
                btnSkill.onclick = (function(pid) { return function() {
                    if ((abyssRun.materials.petSkillBook || 0) < 1) return;
                    var pet = null;
                    for (var sb = 0; sb < abyssRun.pets.length; sb++) {
                        if (abyssRun.pets[sb].id === pid) { pet = abyssRun.pets[sb]; break; }
                    }
                    if (!pet) return;
                    abyssRun.materials.petSkillBook--;
                    pet.skills = pet.skills || [];
                    var isAdd = Math.random() < 0.3;
                    var pool = ABYSS_PET_SKILLS.slice();
                    if (isAdd && pet.skills.length < 12) {
                        for (var si = pet.skills.length - 1; si >= 0; si--) {
                            for (var pj = pool.length - 1; pj >= 0; pj--) {
                                if (pool[pj].id === pet.skills[si].id) { pool.splice(pj, 1); break; }
                            }
                        }
                        if (pool.length > 0) {
                            var pick = pool[Math.floor(Math.random() * pool.length)];
                            pet.skills.push({ id: pick.id, name: pick.name });
                            abyssLog('打书成功！宠物【' + pet.name + '】领悟技能【' + pick.name + '】');
                        }
                    } else {
                        if (pet.skills.length === 0) {
                            var pick0 = pool[Math.floor(Math.random() * pool.length)];
                            pet.skills.push({ id: pick0.id, name: pick0.name });
                            abyssLog('打书成功！宠物【' + pet.name + '】领悟技能【' + pick0.name + '】');
                        } else {
                            var idx = Math.floor(Math.random() * pet.skills.length);
                            var oldName = pet.skills[idx].name;
                            var pick1 = pool[Math.floor(Math.random() * pool.length)];
                            pet.skills[idx] = { id: pick1.id, name: pick1.name };
                            abyssLog('打书：宠物【' + pet.name + '】技能【' + oldName + '】被替换为【' + pick1.name + '】');
                        }
                    }
                    openAbyssPetPanel();
                    if (abyssRun && abyssRun.active) abyssDeferUpdate();
                }; })(selPet.id);
                actEl.appendChild(btnSkill);
            }
            if (!selPet.isDivine) {
                var btnEquipBag = document.createElement('button');
                btnEquipBag.textContent = '装备背包';
                btnEquipBag.style.cssText = 'background:#5d4037;color:#ffcc80;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-weight:bold;';
                btnEquipBag.onclick = function() { openAbyssPetEquipBag(); };
                actEl.appendChild(btnEquipBag);
                var btnNeidanBag = document.createElement('button');
                btnNeidanBag.textContent = '内丹背包';
                btnNeidanBag.style.cssText = 'background:#4e342e;color:#ffe082;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-weight:bold;';
                btnNeidanBag.onclick = function() { openAbyssPetNeidanBag(); };
                actEl.appendChild(btnNeidanBag);
            }
            if (!selPet.isDivine) {
                var btnRelease = document.createElement('button');
                btnRelease.textContent = '放生';
                btnRelease.style.cssText = 'background:#b71c1c;color:#fff;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-weight:bold;';
                btnRelease.title = '放生后不可恢复，请谨慎操作';
                btnRelease.onclick = (function(pid, pname) { return function() {
                    var msg = '确定要放生宠物【' + pname + '】吗？\n\n放生后宠物将永久消失，此操作不可撤销！';
                    if (typeof showCustomConfirm === 'function') {
                        showCustomConfirm(msg, function(confirmed) {
                            if (!confirmed) return;
                            if (abyssRun.deployedPetIds) { var ri = abyssRun.deployedPetIds.indexOf(pid); if (ri >= 0) abyssRun.deployedPetIds.splice(ri, 1); }
                            for (var r = 0; r < abyssRun.pets.length; r++) {
                                if (abyssRun.pets[r].id === pid) {
                                    var rname = abyssRun.pets[r].name;
                                    abyssRun.pets.splice(r, 1);
                                    abyssLog('放生了宠物【' + rname + '】');
                                    abyssPetPanelSelectedId = abyssRun.pets.length ? abyssRun.pets[0].id : null;
                                    openAbyssPetPanel();
                                    if (abyssRun && abyssRun.active) abyssDeferUpdate();
                                    return;
                                }
                            }
                        });
                    } else {
                        if (!confirm(msg)) return;
                        if (abyssRun.deployedPetIds) { var ri = abyssRun.deployedPetIds.indexOf(pid); if (ri >= 0) abyssRun.deployedPetIds.splice(ri, 1); }
                        for (var r = 0; r < abyssRun.pets.length; r++) {
                            if (abyssRun.pets[r].id === pid) {
                                var rname = abyssRun.pets[r].name;
                                abyssRun.pets.splice(r, 1);
                                abyssLog('放生了宠物【' + rname + '】');
                                abyssPetPanelSelectedId = abyssRun.pets.length ? abyssRun.pets[0].id : null;
                                openAbyssPetPanel();
                                if (abyssRun && abyssRun.active) abyssDeferUpdate();
                                return;
                            }
                        }
                    }
                }; })(selPet.id, selPet.name);
                actEl.appendChild(btnRelease);
            }
            if (canRevive) {
                var btnRev = document.createElement('button');
                btnRev.textContent = '复活(消耗1瓶药水)';
                btnRev.style.cssText = 'background:#4caf50;color:#fff;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-weight:bold;';
                btnRev.onclick = (function(pid) { return function() {
                    if ((abyssRun.materials.petRevivePotion || 0) < 1) return;
                    for (var k = 0; k < abyssRun.pets.length; k++) {
                        if (abyssRun.pets[k].id === pid) {
                            abyssRun.materials.petRevivePotion--;
                            var ps = abyssCalcPetStats(abyssRun.pets[k]);
                            abyssRun.pets[k].hp = ps ? ps.maxHp : 100;
                            abyssLog('宠物【' + abyssRun.pets[k].name + '】已复活');
                            openAbyssPetPanel();
                            if (abyssRun && abyssRun.active) abyssDeferUpdate();
                            return;
                        }
                    }
                }; })(selPet.id);
                actEl.appendChild(btnRev);
            }
        }
    }
    document.getElementById('abyssPetOverlay').style.display = 'block';
    document.getElementById('abyssPetUI').style.display = 'block';
}

function closeAbyssPetPanel() {
    document.getElementById('abyssPetOverlay').style.display = 'none';
    document.getElementById('abyssPetUI').style.display = 'none';
}

function openAbyssPetEquipBag() {
    if (!abyssRun) return;
    document.getElementById('abyssPetEquipBagOverlay').style.display = 'block';
    document.getElementById('abyssPetEquipBagUI').style.display = 'block';
    refreshAbyssPetEquipBagList();
}
function closeAbyssPetEquipBag() {
    document.getElementById('abyssPetEquipBagOverlay').style.display = 'none';
    document.getElementById('abyssPetEquipBagUI').style.display = 'none';
}

function abyssUpgradePetNeidan(petId) {
    if (!abyssRun || !abyssRun.active) return;
    var pet = null;
    for (var k = 0; k < abyssRun.pets.length; k++) { if (abyssRun.pets[k].id === petId) { pet = abyssRun.pets[k]; break; } }
    if (!pet || !pet.neidan) { abyssLog('该宠物未装备内丹'); return; }
    var nd = pet.neidan;
    var lvl = nd.level || 1;
    if (lvl >= 5) { abyssLog('内丹已满级'); return; }
    var cost = abyssNeidanUpgradeCost(nd);
    var beads = abyssRun.neidanBeads || 0;
    if (beads < cost) { abyssLog('灵珠不足，需要 ' + cost + ' 颗'); return; }
    abyssRun.neidanBeads = beads - cost;
    nd.level = lvl + 1;
    abyssLog('内丹【' + nd.name + '】升级至 Lv.' + nd.level);
    openAbyssPetPanel();
    updateAbyssRunUI();
}
function openAbyssPetNeidanBag() {
    if (!abyssRun || !abyssRun.active) return;
    document.getElementById('abyssPetNeidanBagOverlay').style.display = 'block';
    document.getElementById('abyssPetNeidanBagUI').style.display = 'block';
    refreshAbyssPetNeidanBagList();
    var beadEl = document.getElementById('abyssNeidanBeadsCount');
    if (beadEl) beadEl.textContent = abyssRun.neidanBeads || 0;
    var beadBagEl = document.getElementById('abyssNeidanBeadsCountBag');
    if (beadBagEl) beadBagEl.textContent = abyssRun.neidanBeads || 0;
}

function closeAbyssPetNeidanBag() {
    document.getElementById('abyssPetNeidanBagOverlay').style.display = 'none';
    document.getElementById('abyssPetNeidanBagUI').style.display = 'none';
}

function refreshAbyssPetNeidanBagList() {
    var listEl = document.getElementById('abyssPetNeidanBagList');
    if (!listEl || !abyssRun) return;
    var beadBagEl = document.getElementById('abyssNeidanBeadsCountBag');
    if (beadBagEl) beadBagEl.textContent = abyssRun.neidanBeads || 0;
    var inv = abyssRun.petNeidanInventory || [];
    var selPetId = abyssPetPanelSelectedId;
    if (inv.length === 0) {
        listEl.innerHTML = '<div style="color:#666;padding:12px;">暂无内丹</div>';
        return;
    }
    listEl.innerHTML = '';
    for (var ii = 0; ii < inv.length; ii++) {
        var it = inv[ii];
        var div = document.createElement('div');
        div.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;padding:6px 8px;border-bottom:1px solid #333;background:rgba(0,0,0,0.2);border-radius:4px;margin-bottom:4px;';
        var tierName = it.tier === 'basic' ? '初级' : (it.tier === 'mid' ? '中级' : '高级');
        var lvStr = (it.level && it.level > 1) ? ' Lv.' + it.level + '/5' : '';
        var left = document.createElement('div');
        left.innerHTML = '<div style="color:#ffcc80;font-weight:bold;">[' + tierName + '] ' + it.name + lvStr + '</div>' +
            '<div style="color:#ccc;font-size:11px;margin-top:2px;">' + it.desc + '</div>';
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin-left:8px;';
        var eb = document.createElement('button');
        eb.textContent = '装备';
        eb.style.cssText = 'background:#6a1b9a;color:#ffeb3b;border:none;padding:2px 10px;border-radius:4px;cursor:pointer;font-size:11px;';
        eb.onclick = (function (pid, idx) {
            return function () {
                if (!abyssRun) return;
                var pet = null;
                for (var k = 0; k < abyssRun.pets.length; k++) {
                    if (abyssRun.pets[k].id === pid) { pet = abyssRun.pets[k]; break; }
                }
                if (!pet) { abyssLog('请先在宠物列表选择一只宠物'); return; }
                abyssRun.petNeidanInventory = abyssRun.petNeidanInventory || [];
                var inv2 = abyssRun.petNeidanInventory;
                if (idx < 0 || idx >= inv2.length) return;
                var piece = inv2[idx];
                if (!piece) return;
                // 旧内丹退回背包
                if (pet.neidan) inv2.push(pet.neidan);
                pet.neidan = piece;
                inv2.splice(idx, 1);
                abyssLog('已为宠物【' + pet.name + '】装备内丹 ' + piece.name);
                refreshAbyssPetNeidanBagList();
                openAbyssPetPanel();
                if (abyssRun && abyssRun.active) abyssDeferUpdate();
            };
        })(selPetId, ii);
        var db = document.createElement('button');
        db.textContent = '分解';
        db.style.cssText = 'background:#795548;color:#fff;border:none;padding:2px 10px;border-radius:4px;cursor:pointer;font-size:11px;';
        db.onclick = (function (idx) {
            return function () {
                if (!abyssRun) return;
                var inv2 = abyssRun.petNeidanInventory || [];
                if (idx < 0 || idx >= inv2.length) return;
                var nd = inv2[idx];
                inv2.splice(idx, 1);
                var baseGain = nd.tier === 'high' ? 2 : 1;
                var lvlNow = nd.level || 1;
                var spent = 0;
                for (var lv = 1; lv < lvlNow; lv++) {
                    spent += abyssNeidanUpgradeCost({ tier: nd.tier, level: lv });
                }
                var extra = Math.floor(spent * 0.8);
                var gain = baseGain + extra;
                abyssRun.neidanBeads = (abyssRun.neidanBeads || 0) + gain;
                abyssLog('分解内丹获得灵珠 x' + gain + '（含约80%升级消耗返还）');
                refreshAbyssPetNeidanBagList();
                openAbyssPetPanel();
                if (abyssRun && abyssRun.active) abyssDeferUpdate();
            };
        })(ii);
        wrap.appendChild(eb);
        wrap.appendChild(db);
        div.appendChild(left);
        div.appendChild(wrap);
        listEl.appendChild(div);
    }
}
function refreshAbyssPetEquipBagList() {
    var listEl = document.getElementById('abyssPetEquipBagList');
    if (!listEl || !abyssRun) return;
    var inv = abyssRun.petEquipmentInventory || [];
    var selPetId = abyssPetPanelSelectedId;
    if (inv.length === 0) {
        listEl.innerHTML = '<div style="color:#666;padding:12px;">暂无装备</div>';
        return;
    }
    listEl.innerHTML = '';
    for (var ii = 0; ii < inv.length; ii++) {
        var it = inv[ii];
        var div = document.createElement('div');
        div.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:6px 8px;border-bottom:1px solid #333;background:rgba(0,0,0,0.2);border-radius:4px;margin-bottom:4px;';
        var itName = (it.prefix || '') + it.name + (it.atkPct ? ' 攻+' + it.atkPct + '%' : '') + (it.defPct ? ' 防+' + it.defPct + '%' : '') + (it.hpPct ? ' 体+' + it.hpPct + '%' : '') + (it.skill ? ' [' + it.skill.name + ']' : '');
        div.innerHTML = '<span style="color:#e0e0e0;">' + itName + '</span>';
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;gap:6px;';
        var eb = document.createElement('button');
        eb.textContent = '装备';
        eb.style.cssText = 'background:#6a1b9a;color:#ff80ab;border:none;padding:2px 10px;border-radius:4px;cursor:pointer;font-size:11px;';
        eb.onclick = (function(pid, idx) { return function() {
            if (!abyssRun) return;
            var pet = null;
            for (var k = 0; k < abyssRun.pets.length; k++) { if (abyssRun.pets[k].id === pid) { pet = abyssRun.pets[k]; break; } }
            if (!pet) { abyssLog('请先在宠物列表选择一只宠物'); return; }
            pet.equipment = pet.equipment || { '项圈': null, '护腕': null, '铠甲': null };
            var inv2 = abyssRun.petEquipmentInventory || [];
            if (idx < 0 || idx >= inv2.length) return;
            var piece = inv2[idx];
            var slotType = piece.slotType;
            var old = pet.equipment[slotType];
            if (old) inv2.push(old);
            pet.equipment[slotType] = piece;
            inv2.splice(idx, 1);
            abyssLog('已装备 ' + (piece.prefix || '') + piece.name + ' 到【' + pet.name + '】');
            refreshAbyssPetEquipBagList();
            openAbyssPetPanel();
            if (abyssRun && abyssRun.active) abyssDeferUpdate();
        }; })(selPetId, ii);
        var db = document.createElement('button');
        db.textContent = '分解';
        db.style.cssText = 'background:#795548;color:#fff;border:none;padding:2px 10px;border-radius:4px;cursor:pointer;font-size:11px;';
        db.onclick = (function(idx) { return function() {
            if (!abyssRun) return;
            var inv2 = abyssRun.petEquipmentInventory || [];
            if (idx < 0 || idx >= inv2.length) return;
            inv2.splice(idx, 1);
            abyssRun.materials.petSkillBook = (abyssRun.materials.petSkillBook || 0) + 1;
            abyssLog('分解装备获得宠物兽决 x1');
            refreshAbyssPetEquipBagList();
            openAbyssPetPanel();
            if (abyssRun && abyssRun.active) abyssDeferUpdate();
        }; })(ii);
        wrap.appendChild(eb);
        wrap.appendChild(db);
        div.appendChild(wrap);
        listEl.appendChild(div);
    }
}

function openAbyssPetSynthesisPanel() {
    if (!abyssRun || !abyssRun.active) return;
    var pets = (abyssRun.pets || []).filter(function(p) { return !p.isDivine; });
    if (pets.length < 2) {
        abyssLog('至少需要2只宠物才能合成（深渊神兽不可参与合成）');
        return;
    }
    var sel1 = document.getElementById('abyssSynthesisPet1');
    var sel2 = document.getElementById('abyssSynthesisPet2');
    sel1.innerHTML = '';
    sel2.innerHTML = '';
    for (var i = 0; i < pets.length; i++) {
        var p = pets[i];
        var opt1 = document.createElement('option');
        opt1.value = p.id;
        opt1.textContent = p.name + ' Lv.' + p.level + ' (攻' + p.growth.atk + '防' + p.growth.def + '体' + p.growth.hp + '速' + p.growth.speed + ')';
        sel1.appendChild(opt1);
        var opt2 = document.createElement('option');
        opt2.value = p.id;
        opt2.textContent = p.name + ' Lv.' + p.level + ' (攻' + p.growth.atk + '防' + p.growth.def + '体' + p.growth.hp + '速' + p.growth.speed + ')';
        sel2.appendChild(opt2);
    }
    if (pets.length > 0) sel2.selectedIndex = 1;
    sel1.onchange = abyssUpdateSynthesisSkillPool;
    sel2.onchange = abyssUpdateSynthesisSkillPool;
    abyssUpdateSynthesisSkillPool();
    document.getElementById('abyssPetSynthesisOverlay').style.display = 'block';
    document.getElementById('abyssPetSynthesisUI').style.display = 'block';
}

function abyssUpdateSynthesisSkillPool() {
    if (!abyssRun || !abyssRun.pets) return;
    var id1 = document.getElementById('abyssSynthesisPet1') && document.getElementById('abyssSynthesisPet1').value;
    var id2 = document.getElementById('abyssSynthesisPet2') && document.getElementById('abyssSynthesisPet2').value;
    var countEl = document.getElementById('abyssSynthesisSkillCount');
    var poolEl = document.getElementById('abyssSynthesisSkillPool');
    if (!countEl || !poolEl) return;
    var pet1 = null, pet2 = null;
    for (var i = 0; i < abyssRun.pets.length; i++) {
        if (abyssRun.pets[i].id === id1) pet1 = abyssRun.pets[i];
        if (abyssRun.pets[i].id === id2) pet2 = abyssRun.pets[i];
    }
    var seen = {};
    var names = [];
    if (pet1 && pet1.skills) for (var s1 = 0; s1 < pet1.skills.length; s1++) { var sk = pet1.skills[s1]; if (!seen[sk.id]) { seen[sk.id] = true; names.push(sk.name); } }
    if (pet2 && pet2.skills) for (var s2 = 0; s2 < pet2.skills.length; s2++) { var sk = pet2.skills[s2]; if (!seen[sk.id]) { seen[sk.id] = true; names.push(sk.name); } }
    countEl.textContent = names.length;
    poolEl.textContent = names.length ? names.join('、') : '（两只宠物均无技能时无技能池）';
}

function closeAbyssPetSynthesisPanel() {
    document.getElementById('abyssPetSynthesisOverlay').style.display = 'none';
    document.getElementById('abyssPetSynthesisUI').style.display = 'none';
}

function abyssPetHasEquipment(pet) {
    var eq = pet.equipment || {};
    return !!(eq['项圈'] || eq['护腕'] || eq['铠甲']);
}
function abyssDoPetSynthesis() {
    if (!abyssRun || !abyssRun.active) return;
    var id1 = document.getElementById('abyssSynthesisPet1').value;
    var id2 = document.getElementById('abyssSynthesisPet2').value;
    if (!id1 || !id2 || id1 === id2) {
        abyssLog('请选择两只不同的宠物');
        return;
    }
    var pet1 = null, pet2 = null, idx1 = -1, idx2 = -1;
    for (var i = 0; i < abyssRun.pets.length; i++) {
        if (abyssRun.pets[i].id === id1) { pet1 = abyssRun.pets[i]; idx1 = i; }
        if (abyssRun.pets[i].id === id2) { pet2 = abyssRun.pets[i]; idx2 = i; }
    }
    if (!pet1 || !pet2) { abyssLog('宠物不存在'); return; }
    if (pet1.isDivine || pet2.isDivine) { abyssLog('深渊神兽不可参与合成'); return; }
    var basePet = Math.random() < 0.5 ? pet1 : pet2;
    var baseGrowth = basePet.growth || { atk: 2000, def: 2000, hp: 2000, speed: 2000 };
    var roll = function(v) { return Math.max(1, Math.floor(v * (0.8 + Math.random() * 0.4))); };
    var growth = {
        atk: roll(baseGrowth.atk),
        def: roll(baseGrowth.def),
        hp: roll(baseGrowth.hp),
        speed: roll(baseGrowth.speed)
    };
    var skillPool = [];
    var seen = {};
    for (var s1 = 0; s1 < (pet1.skills || []).length; s1++) {
        var sk = pet1.skills[s1];
        if (!seen[sk.id]) { seen[sk.id] = true; skillPool.push({ id: sk.id, name: sk.name }); }
    }
    for (var s2 = 0; s2 < (pet2.skills || []).length; s2++) {
        var sk = pet2.skills[s2];
        if (!seen[sk.id]) { seen[sk.id] = true; skillPool.push({ id: sk.id, name: sk.name }); }
    }
    var poolLen = skillPool.length;
    var tierRoll = Math.random();
    var tierPct = tierRoll < 0.05 ? 0.1 : (tierRoll < 0.25 ? 0.25 : (tierRoll < 0.75 ? 0.5 : (tierRoll < 0.95 ? 0.75 : 1)));
    var skillCount = poolLen <= 0 ? 0 : Math.max(1, Math.min(poolLen, Math.round(poolLen * tierPct)));
    var skills = [];
    if (skillCount > 0 && poolLen > 0) {
        var shuffled = skillPool.slice();
        for (var sh = shuffled.length - 1; sh > 0; sh--) {
            var j = Math.floor(Math.random() * (sh + 1));
            var tmp = shuffled[sh];
            shuffled[sh] = shuffled[j];
            shuffled[j] = tmp;
        }
        for (var t = 0; t < skillCount && t < shuffled.length; t++) skills.push(shuffled[t]);
    }
    var newLevel = Math.max(pet1.level || 1, pet2.level || 1);
    var newPet = {
        id: abyssGenPetId(),
        name: basePet.name,
        type: basePet.type || ABYSS_PET_TYPES[Math.floor(Math.random() * ABYSS_PET_TYPES.length)].id,
        variant: !!basePet.variant,
        level: newLevel,
        exp: 0,
        growth: growth,
        skills: skills,
        equipment: { '项圈': null, '护腕': null, '铠甲': null },
        neidan: null,
        hp: null,
        maxHp: 0
    };
    // 将两只参与合成的宠物身上的装备自动继承到新宠物
    var slots = ['项圈','护腕','铠甲'];
    var usedFrom = {};
    for (var si = 0; si < slots.length; si++) {
        var st = slots[si];
        var e1 = (pet1.equipment || {})[st] || null;
        var e2 = (pet2.equipment || {})[st] || null;
        var chosen = null;
        if (e1 && e2) {
            if (Math.random() < 0.5) { chosen = e1; usedFrom[st] = 1; } else { chosen = e2; usedFrom[st] = 2; }
        } else if (e1) {
            chosen = e1; usedFrom[st] = 1;
        } else if (e2) {
            chosen = e2; usedFrom[st] = 2;
        }
        if (chosen) newPet.equipment[st] = chosen;
    }
    // 处理内丹继承：两只宠物的内丹自动转移到新宠物（二选一），另一颗退回内丹背包
    abyssRun.petNeidanInventory = abyssRun.petNeidanInventory || [];
    var nd1 = pet1.neidan || null;
    var nd2 = pet2.neidan || null;
    var chosenNd = null;
    if (nd1 && nd2) {
        if (Math.random() < 0.5) {
            chosenNd = nd1;
            abyssRun.petNeidanInventory.push(nd2);
        } else {
            chosenNd = nd2;
            abyssRun.petNeidanInventory.push(nd1);
        }
    } else if (nd1) {
        chosenNd = nd1;
    } else if (nd2) {
        chosenNd = nd2;
    }
    if (chosenNd) {
        newPet.neidan = chosenNd;
    }
    pet1.neidan = null;
    pet2.neidan = null;
    // 清空原宠物上的装备，未被继承的装备返回到装备背包
    abyssRun.petEquipmentInventory = abyssRun.petEquipmentInventory || [];
    for (var si2 = 0; si2 < slots.length; si2++) {
        var st2 = slots[si2];
        if (pet1.equipment && pet1.equipment[st2]) {
            if (!usedFrom[st2] || usedFrom[st2] !== 1) {
                abyssRun.petEquipmentInventory.push(pet1.equipment[st2]);
            }
            pet1.equipment[st2] = null;
        }
        if (pet2.equipment && pet2.equipment[st2]) {
            if (!usedFrom[st2] || usedFrom[st2] !== 2) {
                abyssRun.petEquipmentInventory.push(pet2.equipment[st2]);
            }
            pet2.equipment[st2] = null;
        }
    }
    if (abyssRun.deployedPetIds) {
        var d = abyssRun.deployedPetIds;
        for (var di = d.length - 1; di >= 0; di--) { if (d[di] === id1 || d[di] === id2) d.splice(di, 1); }
    }
    var ord1 = idx1 < idx2 ? idx1 : idx2;
    var ord2 = idx1 < idx2 ? idx2 : idx1;
    abyssRun.pets.splice(ord2, 1);
    abyssRun.pets.splice(ord1, 1);
    abyssRun.pets.push(newPet);
    if ((abyssRun.floor || 0) > 20 && Math.random() < 0.01) {
        var at = getAbyssTower();
        at.abyssVault = at.abyssVault || {};
        at.abyssVault['vault_sea_turtle'] = (at.abyssVault['vault_sea_turtle'] || 0) + 1;
        if (typeof goldGameCheckAbyssVault === 'function' && typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken()) {
            var vaultTotal = Object.keys(at.abyssVault || {}).reduce(function(s, id) { return s + (parseInt(at.abyssVault[id], 10) || 0); }, 0);
            goldGameCheckAbyssVault(vaultTotal);
        }
        abyssLog('深渊宝库：宠物合成获得【大海龟】宠物资质永久+10（攻防体速）！');
        abyssShowTreasureDropPopup('大海龟', '宠物资质全部+10');
    }
    closeAbyssPetSynthesisPanel();
    abyssLog('合成成功！获得宠物【' + newPet.name + '】资质 攻' + newPet.growth.atk + ' 防' + newPet.growth.def + ' 体' + newPet.growth.hp + ' 速' + newPet.growth.speed + '，技能数' + newPet.skills.length + '/' + poolLen + '：' + (newPet.skills.map(function(s){ return s.name; }).join('、') || '无'));
    abyssPetPanelSelectedId = newPet.id;
    openAbyssPetPanel();
    updateAbyssRunUI();
}

function openAbyssTalentPanel() {
    if (!abyssRun || !abyssRun.active) return;
    document.getElementById('abyssTalentPointsDisplay').textContent = abyssRun.talentPoints || 0;
    var listEl = document.getElementById('abyssTalentList');
    listEl.innerHTML = '';
    var talents = abyssRun.talents || {};
    for (var i = 0; i < ABYSS_TALENTS.length; i++) {
        var tal = ABYSS_TALENTS[i];
        var curLv = talents[tal.id] || 0;
        var parentOk = !tal.parent || (talents[tal.parent] || 0) > 0;
        var canAdd = (abyssRun.talentPoints || 0) >= 1 && curLv < tal.maxLevel && parentOk;
        var effText = [];
        if (tal.effectDesc) {
            effText.push(tal.effectDesc);
        } else if (tal.effect) {
            if (tal.effect.hp) effText.push('生命+' + tal.effect.hp);
            if (tal.effect.atk) effText.push('攻击+' + tal.effect.atk);
            if (tal.effect.def) effText.push('防御+' + tal.effect.def);
            if (tal.effect.critRate) effText.push('暴击+' + tal.effect.critRate + '%');
            if (tal.effect.critDmg) effText.push('爆伤+' + tal.effect.critDmg + '%');
            if (tal.effect.dodge) effText.push('闪避+' + tal.effect.dodge + '%');
            if (tal.effect.lifesteal) effText.push('吸血+' + tal.effect.lifesteal + '%');
            if (tal.effect.combo) effText.push('连击+' + tal.effect.combo + '%');
            if (tal.effect.skillDmg) effText.push('技能伤害+' + tal.effect.skillDmg + '%');
            if (tal.effect.reduceMonsterDef) effText.push('减防+' + tal.effect.reduceMonsterDef + '%');
        }
        var div = document.createElement('div');
        div.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px;background:rgba(0,0,0,0.3);border-radius:8px;border:1px solid #555;';
        div.innerHTML = '<div><span style="color:#ffb74d;">' + tal.name + '</span> <span style="color:#888;">Lv.' + curLv + '/' + tal.maxLevel + '</span>' + (effText.length ? ' <span style="font-size:12px;color:#aaa;">(' + effText.join(' ') + ')</span>' : '') + (tal.parent ? ' <span style="font-size:11px;color:#666;">需前置</span>' : '') + '</div>';
        var addBtn = document.createElement('button');
        addBtn.textContent = '+';
        addBtn.style.cssText = 'background:' + (canAdd ? '#ff9800' : '#555') + ';color:#fff;border:none;width:32px;height:32px;border-radius:6px;cursor:' + (canAdd ? 'pointer' : 'not-allowed') + ';font-weight:bold;font-size:18px;';
        if (canAdd) {
            addBtn.onclick = (function(tid) { return function() { abyssLearnTalent(tid); openAbyssTalentPanel(); if (abyssRun && abyssRun.active) abyssDeferUpdate(); }; })(tal.id);
        }
        div.appendChild(addBtn);
        listEl.appendChild(div);
    }
    document.getElementById('abyssTalentOverlay').style.display = 'block';
    document.getElementById('abyssTalentUI').style.display = 'block';
}

function closeAbyssTalentPanel() {
    document.getElementById('abyssTalentOverlay').style.display = 'none';
    document.getElementById('abyssTalentUI').style.display = 'none';
}

var ABYSS_SKILL_LEARN_COST_BASE = 280;
var ABYSS_SKILL_LEARN_COST_ZHuan_MULT = 1.4;
function openAbyssSkillPanel() {
    if (!abyssRun || !abyssRun.active) return;
    document.getElementById('abyssSkillPanelGold').textContent = formatNumber(abyssRun.gold || 0);
    var runLevel = Math.floor((abyssRun.exp || 0) / 100);
    var currentZhuan = abyssZhuan(runLevel);
    var classId = abyssRun.playerClass || 'warrior';
    abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
    var slotCount = abyssGetSkillSlotCount();
    if (classId === 'tamer' && (!abyssRun.equippedSkillIds || abyssRun.equippedSkillIds.length < 4)) {
        abyssRun.equippedSkillIds = abyssRun.equippedSkillIds || [null, null, null];
        while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null);
        abyssRun.equippedSkillIds.push(ABYSS_TAMER_BOUND_SKILL_ID);
    }
    if (classId === 'warrior' && (!abyssRun.equippedSkillIds || abyssRun.equippedSkillIds.length < 4)) {
        abyssRun.equippedSkillIds = abyssRun.equippedSkillIds || [null, null, null];
        while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null);
        abyssRun.equippedSkillIds.push(ABYSS_WARRIOR_BOUND_SKILL_ID);
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_WARRIOR_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_WARRIOR_BOUND_SKILL_ID);
    }
    if (classId === 'mage' && (!abyssRun.equippedSkillIds || abyssRun.equippedSkillIds.length < 5)) {
        abyssRun.equippedSkillIds = abyssRun.equippedSkillIds || [null, null, null];
        while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null);
        if (abyssRun.equippedSkillIds.length < 4) abyssRun.equippedSkillIds.push(ABYSS_MAGE_BOUND_SKILL_ID);
        if (abyssRun.equippedSkillIds.length < 5) abyssRun.equippedSkillIds.push(ABYSS_MAGE_BOUND_SKILL_ID2);
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_MAGE_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_MAGE_BOUND_SKILL_ID);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_MAGE_BOUND_SKILL_ID2) < 0) abyssRun.learnedSkillIds.push(ABYSS_MAGE_BOUND_SKILL_ID2);
    }
    if (classId === 'archer' && (!abyssRun.equippedSkillIds || abyssRun.equippedSkillIds.length < 4)) {
        abyssRun.equippedSkillIds = abyssRun.equippedSkillIds || [null, null, null];
        while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null);
        abyssRun.equippedSkillIds.push(ABYSS_ARCHER_BOUND_SKILL_ID);
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_ARCHER_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ARCHER_BOUND_SKILL_ID);
    }
    if (classId === 'onmyoji' && (!abyssRun.equippedSkillIds || abyssRun.equippedSkillIds.length < 6)) {
        abyssRun.equippedSkillIds = abyssRun.equippedSkillIds || [null, null, null];
        while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null);
        if (abyssRun.equippedSkillIds.length < 4) abyssRun.equippedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_ID);
        if (abyssRun.equippedSkillIds.length < 5) abyssRun.equippedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID);
        if (abyssRun.equippedSkillIds.length < 6) abyssRun.equippedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID);
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_ONMYOJI_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_ID);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID);
    }
    if (classId === 'jester' && (!abyssRun.equippedSkillIds || abyssRun.equippedSkillIds.length < 5)) {
        abyssRun.equippedSkillIds = abyssRun.equippedSkillIds || [null, null, null];
        while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null);
        if (abyssRun.equippedSkillIds.length < 4) abyssRun.equippedSkillIds.push(ABYSS_JESTER_BOUND_SKILL_ID);
        if (abyssRun.equippedSkillIds.length < 5) abyssRun.equippedSkillIds.push(ABYSS_JESTER_BOUND_SKILL_ID2);
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_JESTER_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_JESTER_BOUND_SKILL_ID);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_JESTER_BOUND_SKILL_ID2) < 0) abyssRun.learnedSkillIds.push(ABYSS_JESTER_BOUND_SKILL_ID2);
    }
    abyssRun.equippedSkillIds = abyssRun.equippedSkillIds || [null, null, null];
    var slotsEl = document.getElementById('abyssEquippedSkillSlots');
    slotsEl.innerHTML = '';
    for (var slotIdx = 0; slotIdx < slotCount; slotIdx++) {
        var sid = (abyssRun.equippedSkillIds[slotIdx] != null && abyssRun.equippedSkillIds[slotIdx] !== '') ? abyssRun.equippedSkillIds[slotIdx] : null;
        if (abyssIsBoundSkillSlot(slotIdx)) sid = abyssGetBoundSkillIdForClass(classId, slotIdx);
        var sk = sid ? abyssGetSkillById(classId, sid) : null;
        var box = document.createElement('div');
        box.style.cssText = 'width:140px;min-height:50px;background:rgba(106,13,173,0.3);border:2px solid #9c27b0;border-radius:8px;padding:8px;text-align:center;';
        if (sk) {
            var boundLabel = abyssIsBoundSkillSlot(slotIdx) ? '<div style="font-size:10px;color:#ff9800;">绑定·不可卸下</div>' : '';
            var mpText = (sk.mpCost != null) ? '<span style="color:#00bcd4;">蓝量消耗 ' + (sk.mpCost || 0) + '</span>' : '';
            var cdText = (sk.cooldown != null) ? '<span style="color:#ff9800;">冷却 ' + (sk.cooldown || 0) + ' 回合</span>' : '';
            var costCdLine = (mpText || cdText) ? '<div style="font-size:11px;margin-top:2px;">' + mpText + (mpText && cdText ? ' · ' : '') + cdText + '</div>' : '';
            box.innerHTML = '<div style="color:#ce93d8;font-weight:bold;">' + sk.name + '</div><div style="font-size:11px;color:#888;">' + (sk.zhuan || 1) + '转</div>' + costCdLine + boundLabel + (abyssIsBoundSkillSlot(slotIdx) ? '' : '<button type="button" style="margin-top:4px;background:#555;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px;">卸下</button>');
            if (!abyssIsBoundSkillSlot(slotIdx) && box.querySelector('button')) box.querySelector('button').onclick = (function(sl) { return function() { abyssUnequipSkill(sl); openAbyssSkillPanel(); if (abyssRun && abyssRun.active) abyssDeferUpdate(); }; })(slotIdx);
        } else {
            var emptyBoundName = (abyssGetBoundSkillIdForClass(classId, slotIdx) && abyssGetSkillById(classId, abyssGetBoundSkillIdForClass(classId, slotIdx))) ? abyssGetSkillById(classId, abyssGetBoundSkillIdForClass(classId, slotIdx)).name + '(绑定)' : (classId === 'tamer' ? '复活宠物(绑定)' : classId === 'warrior' ? '召唤旺财(绑定)' : classId === 'mage' ? '奥秘变身(绑定)' : classId === 'archer' ? '捕兽夹(绑定)' : classId === 'jester' ? (slotIdx === 3 ? '戏命运(绑定)' : '命运傀儡(绑定)') : '绑定');
            box.innerHTML = '<div style="color:#666;font-size:12px;">' + (abyssIsBoundSkillSlot(slotIdx) ? emptyBoundName : '空槽位 ' + (slotIdx + 1)) + '</div>';
        }
        slotsEl.appendChild(box);
    }
    var listEl = document.getElementById('abyssSkillLearnList');
    listEl.innerHTML = '';
    var skillList = abyssGetSkillList(classId, abyssRun.classBranch);
    if (skillList) {
        for (var z = 1; z <= 4; z++) {
            var header = document.createElement('div');
            header.style.cssText = 'color:#ffd700;font-weight:bold;margin-top:12px;margin-bottom:6px;';
            header.textContent = z + '转技能';
            listEl.appendChild(header);
            for (var si = 0; si < skillList.length; si++) {
                var s = skillList[si];
                if ((s.zhuan || 1) !== z) continue;
                var learned = (abyssRun.learnedSkillIds || []).indexOf(s.id) >= 0;
                var canUnlock = currentZhuan >= z;
                var cost = Math.floor(ABYSS_SKILL_LEARN_COST_BASE * Math.pow(ABYSS_SKILL_LEARN_COST_ZHuan_MULT, z - 1));
                var canAfford = (abyssRun.gold || 0) >= cost;
                var row = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(0,0,0,0.25);border-radius:6px;border:1px solid #555;flex-wrap:wrap;gap:6px;';
                var mpStr = (s.mpCost != null) ? '<span style="color:#00bcd4;font-size:12px;">蓝量 ' + (s.mpCost || 0) + '</span>' : '';
                var cdStr = (s.cooldown != null) ? '<span style="color:#ff9800;font-size:12px;">冷却 ' + (s.cooldown || 0) + ' 回合</span>' : '';
                var costCdStr = (mpStr || cdStr) ? '　' + mpStr + (mpStr && cdStr ? '　' : '') + cdStr : '';
                row.innerHTML = '<div style="flex:1;min-width:0;"><span style="color:#ce93d8;">' + s.name + '</span> <span style="color:#ffd700;font-size:11px;">' + z + '转</span>' + costCdStr + '<br/><span style="color:#888;font-size:12px;">' + abyssGetSkillDescForDisplay(s) + '</span></div>';
                var btnWrap = document.createElement('div');
                if (learned) {
                    var equipSlotsMax = (classId === 'tamer' || classId === 'warrior' || classId === 'mage' || classId === 'archer' || classId === 'onmyoji') ? 3 : 3;
                    var slotsFull = true;
                    for (var k = 0; k < equipSlotsMax; k++) { if (abyssRun.equippedSkillIds[k] == null || abyssRun.equippedSkillIds[k] === '') { slotsFull = false; break; } }
                    if (s.boundSkill) {
                        var boundSpan = document.createElement('span');
                        boundSpan.style.color = '#ff9800';
                        var fixedSlot = null;
                        var maxSlots = abyssGetSkillSlotCount();
                        for (var bi = 0; bi < maxSlots; bi++) {
                            if (abyssIsBoundSkillSlot(bi) && abyssGetBoundSkillIdForClass(classId, bi) === s.id) {
                                fixedSlot = bi + 1;
                                break;
                            }
                        }
                        boundSpan.textContent = '绑定技能·已固定在第' + (fixedSlot || '?') + '槽';
                        btnWrap.appendChild(boundSpan);
                    } else if (!slotsFull) {
                        var equipBtn = document.createElement('button');
                        equipBtn.textContent = '装备';
                        equipBtn.style.cssText = 'background:#9c27b0;color:#fff;border:none;padding:6px 12px;border-radius:5px;cursor:pointer;font-size:12px;';
                        equipBtn.onclick = (function(sid) { return function() { abyssEquipSkill(sid); openAbyssSkillPanel(); if (abyssRun && abyssRun.active) abyssDeferUpdate(); }; })(s.id);
                        btnWrap.appendChild(equipBtn);
                    } else {
                        var fullSpan = document.createElement('span');
                        fullSpan.style.color = '#888';
                        fullSpan.textContent = '槽位已满';
                        btnWrap.appendChild(fullSpan);
                    }
                } else if (canUnlock && canAfford) {
                    var learnBtn = document.createElement('button');
                    learnBtn.textContent = '学习(' + cost + '金)';
                    learnBtn.style.cssText = 'background:#4caf50;color:#fff;border:none;padding:6px 12px;border-radius:5px;cursor:pointer;font-size:12px;';
                    learnBtn.onclick = (function(sid, c) { return function() { abyssLearnSkill(sid, c); openAbyssSkillPanel(); if (abyssRun && abyssRun.active) abyssDeferUpdate(); }; })(s.id, cost);
                    btnWrap.appendChild(learnBtn);
                } else if (canUnlock && !canAfford) {
                    var noGold = document.createElement('span');
                    noGold.style.color = '#888';
                    noGold.textContent = '金币不足(' + cost + ')';
                    btnWrap.appendChild(noGold);
                } else {
                    var lock = document.createElement('span');
                    lock.style.color = '#666';
                    lock.textContent = '需' + z + '转';
                    btnWrap.appendChild(lock);
                }
                row.appendChild(btnWrap);
                listEl.appendChild(row);
            }
        }
    }
    document.getElementById('abyssSkillOverlay').style.display = 'block';
    document.getElementById('abyssSkillUI').style.display = 'block';
}
function closeAbyssSkillPanel() {
    document.getElementById('abyssSkillOverlay').style.display = 'none';
    document.getElementById('abyssSkillUI').style.display = 'none';
}
function abyssLearnSkill(skillId, cost) {
    if (!abyssRun || !abyssRun.active || (abyssRun.gold || 0) < cost) return;
    var classId = abyssRun.playerClass || 'warrior';
    var sk = abyssGetSkillById(classId, skillId);
    if (!sk || (abyssRun.learnedSkillIds || []).indexOf(skillId) >= 0) return;
    abyssRun.gold -= cost;
    abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
    abyssRun.learnedSkillIds.push(skillId);
}
function abyssEquipSkill(skillId) {
    if (!abyssRun || !abyssRun.active) return;
    if (skillId === ABYSS_TAMER_BOUND_SKILL_ID ||
        skillId === ABYSS_WARRIOR_BOUND_SKILL_ID ||
        skillId === ABYSS_MAGE_BOUND_SKILL_ID ||
        skillId === ABYSS_MAGE_BOUND_SKILL_ID2 ||
        skillId === ABYSS_ARCHER_BOUND_SKILL_ID ||
        skillId === ABYSS_ONMYOJI_BOUND_SKILL_ID ||
        skillId === ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID ||
        skillId === ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID ||
        skillId === ABYSS_JESTER_BOUND_SKILL_ID ||
        skillId === ABYSS_JESTER_BOUND_SKILL_ID2 ||
        skillId === ABYSS_RIFTBINDER_BOUND_SKILL_ID ||
        skillId === ABYSS_RIFTBINDER_BOUND_SKILL_ID2 ||
        skillId === ABYSS_RIFTBINDER_BOUND_SKILL_ID3) return;
    var learned = (abyssRun.learnedSkillIds || []).indexOf(skillId) >= 0;
    if (!learned) return;
    var maxEquip = (abyssRun.playerClass === 'tamer' || abyssRun.playerClass === 'warrior' || abyssRun.playerClass === 'mage' || abyssRun.playerClass === 'archer' || abyssRun.playerClass === 'onmyoji') ? 3 : 3;
    abyssRun.equippedSkillIds = abyssRun.equippedSkillIds || [null, null, null];
    if (abyssRun.playerClass === 'tamer' && abyssRun.equippedSkillIds.length < 4) { while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null); abyssRun.equippedSkillIds.push(ABYSS_TAMER_BOUND_SKILL_ID); }
    if (abyssRun.playerClass === 'warrior' && abyssRun.equippedSkillIds.length < 4) { while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null); abyssRun.equippedSkillIds.push(ABYSS_WARRIOR_BOUND_SKILL_ID); }
    if (abyssRun.playerClass === 'mage' && abyssRun.equippedSkillIds.length < 5) {
        while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null);
        if (abyssRun.equippedSkillIds.length < 4) abyssRun.equippedSkillIds.push(ABYSS_MAGE_BOUND_SKILL_ID);
        if (abyssRun.equippedSkillIds.length < 5) abyssRun.equippedSkillIds.push(ABYSS_MAGE_BOUND_SKILL_ID2);
    }
    if (abyssRun.playerClass === 'archer' && abyssRun.equippedSkillIds.length < 4) { while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null); abyssRun.equippedSkillIds.push(ABYSS_ARCHER_BOUND_SKILL_ID); }
    if (abyssRun.playerClass === 'onmyoji' && abyssRun.equippedSkillIds.length < 6) {
        while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null);
        if (abyssRun.equippedSkillIds.length < 4) abyssRun.equippedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_ID);
        if (abyssRun.equippedSkillIds.length < 5) abyssRun.equippedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID);
        if (abyssRun.equippedSkillIds.length < 6) abyssRun.equippedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID);
    }
    if (abyssRun.playerClass === 'jester' && abyssRun.equippedSkillIds.length < 5) {
        while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null);
        if (abyssRun.equippedSkillIds.length < 4) abyssRun.equippedSkillIds.push(ABYSS_JESTER_BOUND_SKILL_ID);
        if (abyssRun.equippedSkillIds.length < 5) abyssRun.equippedSkillIds.push(ABYSS_JESTER_BOUND_SKILL_ID2);
    }
    if (abyssRun.playerClass === 'riftbinder' && abyssRun.equippedSkillIds.length < 6) {
        while (abyssRun.equippedSkillIds.length < 3) abyssRun.equippedSkillIds.push(null);
        if (abyssRun.equippedSkillIds.length < 4) abyssRun.equippedSkillIds.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID);
        if (abyssRun.equippedSkillIds.length < 5) abyssRun.equippedSkillIds.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID2);
        if (abyssRun.equippedSkillIds.length < 6) abyssRun.equippedSkillIds.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID3);
    }
    for (var i = 0; i < maxEquip; i++) {
        if (abyssRun.equippedSkillIds[i] === skillId) return;
    }
    var firstEmpty = -1;
    for (var j = 0; j < maxEquip; j++) {
        if (abyssRun.equippedSkillIds[j] == null || abyssRun.equippedSkillIds[j] === '') { firstEmpty = j; break; }
    }
    if (firstEmpty >= 0) abyssRun.equippedSkillIds[firstEmpty] = skillId;
}
function abyssUnequipSkill(slotIndex) {
    if (!abyssRun || slotIndex < 0) return;
    if (abyssIsBoundSkillSlot(slotIndex)) return;
    var maxSlot = abyssGetSkillSlotCount() - 1;
    if (slotIndex > maxSlot) return;
    abyssRun.equippedSkillIds = abyssRun.equippedSkillIds || [null, null, null];
    abyssRun.equippedSkillIds[slotIndex] = null;
}

function abyssLearnTalent(talentId) {
    if (!abyssRun || (abyssRun.talentPoints || 0) < 1) return;
    var tal = ABYSS_TALENTS.find(function(x) { return x.id === talentId; });
    if (!tal) return;
    var cur = (abyssRun.talents || {})[talentId] || 0;
    if (cur >= tal.maxLevel) return;
    if (tal.parent && ((abyssRun.talents || {})[tal.parent] || 0) < 1) return;
    abyssRun.talents = abyssRun.talents || {};
    abyssRun.talents[talentId] = cur + 1;
    abyssRun.talentPoints--;
    abyssLog('学习天赋【' + tal.name + '】Lv.' + (cur + 1));
}

var abyssEquipActionTarget = null;
var abyssEquipActionSlot = null;
var abyssEquipActionInvIdx = null;

function abyssGetEquipDisplayName(eq) {
    if (!eq) return '空';
    var t = (eq.name || '').replace(/\s*Lv\.\d+$/, '').replace(/\s*强化\+\d+$/, '');
    var equipLv = abyssGetEffectiveEquipLevel(eq);
    var enhanceLv = eq.equipLevel != null ? (eq.level || 0) : 0;
    t += ' Lv.' + equipLv;
    if (enhanceLv > 0) t += ' 强化+' + enhanceLv;
    if (eq.enchant && (eq.enchant === true || (typeof eq.enchant === 'object' && (eq.enchant.statMult || eq.enchant.skillMult || eq.enchant.addedSkill)))) t += ' 附魔';
    var runes = eq.runes || [];
    var runeCnt = 0;
    for (var r = 0; r < runes.length; r++) if (runes[r]) runeCnt++;
    if (runeCnt > 0) t += ' 符文×' + runeCnt;
    var gems = eq.gems || [];
    var gemCnt = 0;
    for (var g = 0; g < gems.length; g++) if (gems[g]) gemCnt++;
    if (gemCnt > 0) t += ' 宝石×' + gemCnt;
    return t;
}

function abyssBuildEquipDetailHtml(eq) {
    if (!eq) return '<div style="color:#666;">该部位未装备</div>';
    var html = '<div style="color:' + (ABYSS_QUALITY_COLOR[eq.quality] || '#fff') + '">' + eq.name + '</div>';
    var equipLv = abyssGetEffectiveEquipLevel(eq);
    var enhanceLv = eq.equipLevel != null ? (eq.level || 0) : 0;
    var hasEnchant = eq.enchant && (eq.enchant === true || (typeof eq.enchant === 'object' && (eq.enchant.statMult || eq.enchant.skillMult || eq.enchant.addedSkill)));
    html += '<div style="font-size:12px;color:#aaa">装备等级 Lv.' + equipLv + ' &nbsp; 强化+' + enhanceLv + (hasEnchant ? ' &nbsp; 附魔' : '') + '</div>';
    if (enhanceLv > 0) html += '<div style="font-size:12px;color:#ff9800;margin-top:4px;">强化效果: 全属性+' + (enhanceLv * 5) + '%</div>';
    if (hasEnchant && typeof eq.enchant === 'object') {
        var enc = eq.enchant;
        var encLines = [];
        if (enc.statMult) encLines.push('属性+' + Math.floor((enc.statMult - 1) * 100) + '%');
        if (enc.skillMult) encLines.push('技能效果+' + Math.floor((enc.skillMult - 1) * 100) + '%');
        if (enc.addedSkill) encLines.push('附加技能: ' + enc.addedSkill.name);
        if (encLines.length) html += '<div style="font-size:12px;color:#9c27b0;margin-top:4px;">附魔: ' + encLines.join(' | ') + '</div>';
    } else if (eq.enchant === true) html += '<div style="font-size:12px;color:#9c27b0;margin-top:4px;">附魔: 属性+20%</div>';
    var s = eq.stats || {};
    var baseLevelMult = 1 + equipLv * 0.2;
    var enhanceMult = 1 + enhanceLv * 0.05;
    var dispStatMult = (eq.enchant && typeof eq.enchant === 'object' && eq.enchant.statMult) ? eq.enchant.statMult : (eq.enchant === true ? 1.2 : 1);
    var totalMult = baseLevelMult * enhanceMult * dispStatMult;
    html += '<div style="font-size:12px;color:#ccc;margin-top:6px;">';
    if (s.hp) html += ' 生命+' + Math.floor((s.hp || 0) * totalMult);
    if (s.atk) html += ' 攻击+' + Math.floor((s.atk || 0) * totalMult);
    if (s.def) html += ' 防御+' + Math.floor((s.def || 0) * totalMult);
    if (s.critRate) html += ' 暴击+' + ((s.critRate || 0) * totalMult).toFixed(1) + '%';
    if (s.critDmg) html += ' 爆伤+' + ((s.critDmg || 0) * totalMult).toFixed(0) + '%';
    if (s.skillDmg) html += ' 技能伤害+' + Math.floor((s.skillDmg || 0) * totalMult) + '%';
    if (s.str) html += ' 力量+' + Math.floor((s.str || 0) * totalMult);
    if (s.agi) html += ' 敏捷+' + Math.floor((s.agi || 0) * totalMult);
    if (s.int) html += ' 智力+' + Math.floor((s.int || 0) * totalMult);
    if (s.sta) html += ' 体力+' + Math.floor((s.sta || 0) * totalMult);
    html += '</div>';
    var elParts = [];
    for (var ei = 0; ei < ABYSS_ELEMENTS.length; ei++) {
        var el = ABYSS_ELEMENTS[ei];
        var elAtk = (s[el + 'Atk'] || 0) * totalMult;
        var elRes = (s[el + 'Res'] || 0) * totalMult;
        if (elAtk > 0 || elRes > 0) elParts.push(ABYSS_ELEMENT_NAMES[el] + '攻' + Math.floor(elAtk) + ' 抗' + Math.floor(elRes) + '%');
    }
    if (elParts.length) html += '<div style="font-size:12px;color:#ffd700;margin-top:4px;">五行: ' + elParts.join(' | ') + '</div>';
    if (eq.equipSkill) {
        html += '<div style="color:#b388ff;margin-top:6px;">装备技能: ' + eq.equipSkill.name + '</div>';
        var eff = eq.equipSkill.effect;
        if (!eff && eq.equipSkill.id) {
            var sk = getAbyssEquipSkillById(eq.equipSkill.id);
            if (sk && sk.effect) eff = sk.effect;
        }
        var effDesc = abyssEquipSkillEffectDesc(eff);
        if (effDesc.length) html += '<div style="font-size:12px;color:#ce93d8;margin-left:8px;">' + effDesc.join('；') + '</div>';
        // 对比界面中：如果当前这件正是比较目标，并且有技能提取石，则提供“使用技能提取石”按钮
        if (abyssEquipActionTarget === eq && abyssRun && (abyssRun.materials.skillExtractStone || 0) >= 1) {
            html += '<div style="margin-top:4px;"><button type="button" onclick="abyssEquipUseSkillExtractStone()" style="background:#4dd0e1;color:#000;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;margin:2px;">使用技能提取石（复制【'
                + eq.equipSkill.name + '】为' + eq.equipSkill.name + '石）</button></div>';
        }
    }
    if (eq.skillSlot) {
        html += '<div style="color:#4dd0e1;margin-top:6px;">技能槽: ' + eq.skillSlot.name + '</div>';
        var effSlot = eq.skillSlot.effect;
        if (!effSlot && eq.skillSlot.id) {
            var skSlot = getAbyssEquipSkillById(eq.skillSlot.id);
            if (skSlot && skSlot.effect) effSlot = skSlot.effect;
        }
        var effSlotDesc = abyssEquipSkillEffectDesc(effSlot);
        if (effSlotDesc.length) html += '<div style="font-size:12px;color:#80cbc4;margin-left:8px;">' + effSlotDesc.join('；') + '</div>';
    } else {
        html += '<div style="color:#4dd0e1;margin-top:6px;">技能槽: 空</div>';
    }
    return html;
}

function abyssOpenEquipCompare(newItem, invIdx) {
    if (!abyssRun || !abyssRun.active || !newItem) return;
    abyssEquipActionTarget = newItem;
    abyssEquipActionSlot = null;
    abyssEquipActionInvIdx = invIdx;
    var slot = newItem.slot;
    var equippedInSlot = abyssRun.equipped && abyssRun.equipped[slot] ? abyssRun.equipped[slot] : null;
    document.getElementById('abyssCompareEquippedDetail').innerHTML = abyssBuildEquipDetailHtml(equippedInSlot);
    document.getElementById('abyssCompareNewDetail').innerHTML = abyssBuildEquipDetailHtml(newItem);
    document.getElementById('abyssEquipCompareOverlay').style.display = 'block';
    document.getElementById('abyssEquipCompareUI').style.display = 'block';
}

function closeAbyssEquipCompare() {
    document.getElementById('abyssEquipCompareOverlay').style.display = 'none';
    document.getElementById('abyssEquipCompareUI').style.display = 'none';
    abyssEquipActionTarget = null;
    abyssEquipActionSlot = null;
    abyssEquipActionInvIdx = null;
}

function abyssCompareDoEquip() {
    if (!abyssEquipActionTarget || abyssEquipActionInvIdx === null || abyssEquipActionInvIdx === undefined) return;
    var slot = abyssEquipActionTarget.slot;
    if (abyssRun.equipped[slot] && abyssRun.equipped[slot].boundMechanic) {
        alert('机械师专属机械铠甲已锁定，无法更换该部位装备。');
        return;
    }
    if (abyssRun.equipped[slot]) abyssRun.inventory.push(abyssRun.equipped[slot]);
    abyssRun.equipped[slot] = abyssEquipActionTarget;
    abyssRun.inventory.splice(abyssEquipActionInvIdx, 1);
    closeAbyssEquipCompare();
    openAbyssEquipmentPanel();
    updateAbyssRunUI();
}

function abyssCompareDoDismantle() {
    if (!abyssRun || !abyssEquipActionTarget || abyssEquipActionInvIdx === null || abyssEquipActionInvIdx === undefined) return;
    var eq = abyssEquipActionTarget;
    if (eq.skillSlot) {
        abyssRun.skillStoneInventory = abyssRun.skillStoneInventory || [];
        var stone = {
            id: 'skillStone_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
            name: eq.skillSlot.name + '石',
            skill: { id: eq.skillSlot.id, name: eq.skillSlot.name, effect: eq.skillSlot.effect ? JSON.parse(JSON.stringify(eq.skillSlot.effect)) : null }
        };
        abyssRun.skillStoneInventory.push(stone);
        abyssLog('分解前已自动卸下技能石【' + eq.skillSlot.name + '石】');
        eq.skillSlot = null;
    }
    abyssRun.runeInventory = abyssRun.runeInventory || [];
    abyssRun.gemInventory = abyssRun.gemInventory || [];
    for (var ri = 0; ri < (eq.runes || []).length; ri++) {
        if (eq.runes[ri]) abyssRun.runeInventory.push(eq.runes[ri]);
    }
    for (var gi = 0; gi < (eq.gems || []).length; gi++) {
        if (eq.gems[gi]) abyssRun.gemInventory.push(eq.gems[gi]);
    }
    var enhanceLv = eq.level || 0;
    abyssRun.materials.enhanceStone = (abyssRun.materials.enhanceStone || 0) + 1;
    if (enhanceLv > 0) {
        var used = abyssEnhanceStonesUsedToReachLevel(enhanceLv);
        abyssRun.materials.enhanceStone += Math.floor(used * 0.8);
    }
    abyssRun.inventory.splice(abyssEquipActionInvIdx, 1);
    closeAbyssEquipCompare();
    openAbyssEquipmentPanel();
    updateAbyssRunUI();
}

function abyssEquipSkillEffectDesc(effect) {
    if (!effect || typeof effect !== 'object') return [];
    var parts = [];
    if (effect.hp) parts.push('生命' + (effect.hp > 0 ? '+' : '') + effect.hp);
    if (effect.atk) parts.push('攻击' + (effect.atk > 0 ? '+' : '') + effect.atk);
    if (effect.def) parts.push('防御' + (effect.def > 0 ? '+' : '') + effect.def);
    if (effect.critRate) parts.push('暴击率+' + effect.critRate + '%');
    if (effect.critDmg) parts.push('暴击伤害+' + effect.critDmg + '%');
    if (effect.dodge) parts.push('闪避+' + effect.dodge + '%');
    if (effect.lifesteal) parts.push('吸血+' + effect.lifesteal + '%');
    if (effect.combo) parts.push('连击+' + effect.combo + '%');
    if (effect.skillDmg) parts.push('技能伤害+' + effect.skillDmg + '%');
    if (effect.reduceMonsterDef) parts.push('无视怪物防御+' + effect.reduceMonsterDef + '%');
    if (effect.str) parts.push('力量+' + effect.str);
    if (effect.agi) parts.push('敏捷+' + effect.agi);
    if (effect.int) parts.push('智力+' + effect.int);
    if (effect.sta) parts.push('体力+' + effect.sta);
    if (effect.stunChance) parts.push('攻击时' + (effect.stunChance * 100).toFixed(0) + '%眩晕' + (effect.stunTurns || 1) + '回合');
    if (effect.shieldChance) parts.push((effect.shieldChance * 100).toFixed(0) + '%获得护盾(生命' + ((effect.shieldPct || 0.1) * 100).toFixed(0) + '%)');
    if (effect.healChance) parts.push((effect.healChance * 100).toFixed(0) + '%回复生命(生命上限' + ((effect.healPct || 0.05) * 100).toFixed(0) + '%)');
    if (effect.extraDmgChance) parts.push((effect.extraDmgChance * 100).toFixed(0) + '%额外造成本次伤害' + ((effect.extraDmgPct || 0.1) * 100).toFixed(0) + '%');
    if (effect.damageReduction) parts.push('受到伤害减少' + (effect.damageReduction * 100).toFixed(0) + '%');
    if (effect.extraDmgFromDef) parts.push('攻击附加防御' + (effect.extraDmgFromDef * 100).toFixed(0) + '%的伤害');
    if (effect.extraDmgFromMaxHp) parts.push('攻击附加生命上限' + (effect.extraDmgFromMaxHp * 100).toFixed(0) + '%的伤害');
    if (effect.directPctMonsterHp) parts.push('攻击附加怪物当前生命' + (effect.directPctMonsterHp * 100).toFixed(0) + '%的伤害');
    if (effect.extraDmgFromAtk) parts.push('攻击附加攻击力' + (effect.extraDmgFromAtk * 100).toFixed(0) + '%的伤害');
    if (effect.directPctMonsterMaxHp) parts.push('攻击附加怪物最大生命' + (effect.directPctMonsterMaxHp * 100).toFixed(0) + '%的伤害');
    if (effect.splitChance != null && effect.splitPct != null) parts.push('攻击时' + (effect.splitChance * 100).toFixed(0) + '%分裂，对其它目标造成本次伤害' + (effect.splitPct * 100).toFixed(0) + '%');
    if (effect.petAtk) parts.push('宠物攻击+' + effect.petAtk);
    if (effect.petDef) parts.push('宠物防御+' + effect.petDef);
    if (effect.petHp) parts.push('宠物生命+' + effect.petHp);
    if (effect.petLifesteal) parts.push('宠物吸血+' + effect.petLifesteal + '%');
    if (effect.petDodge) parts.push('宠物闪避+' + effect.petDodge + '%');
    if (effect.petCritRate) parts.push('宠物暴击率+' + effect.petCritRate + '%');
    if (effect.petCritDmg) parts.push('宠物爆伤+' + effect.petCritDmg + '%');
    if (effect.petDamageReduction) parts.push('宠物减伤' + (effect.petDamageReduction * 100).toFixed(0) + '%');
    if (effect.petSplitChance != null && effect.petSplitPct != null) parts.push('宠物攻击时' + (effect.petSplitChance * 100).toFixed(0) + '%分裂，对其它目标造成宠物伤害' + (effect.petSplitPct * 100).toFixed(0) + '%');
    if (effect.fireAtk) parts.push('火攻+' + effect.fireAtk);
    if (effect.waterAtk) parts.push('冰攻+' + effect.waterAtk);
    if (effect.metalAtk) parts.push('雷攻+' + effect.metalAtk);
    if (effect.woodAtk) parts.push('木攻+' + effect.woodAtk);
    if (effect.earthAtk) parts.push('土攻+' + effect.earthAtk);
    if (effect.fireRes) parts.push('火抗+' + effect.fireRes + '%');
    if (effect.waterRes) parts.push('冰抗+' + effect.waterRes + '%');
    if (effect.metalRes) parts.push('雷抗+' + effect.metalRes + '%');
    if (effect.woodRes) parts.push('木抗+' + effect.woodRes + '%');
    if (effect.earthRes) parts.push('土抗+' + effect.earthRes + '%');
    if (effect.burnChance != null) parts.push('攻击时' + (effect.burnChance * 100).toFixed(0) + '%施加灼烧，每回合造成最大生命' + ((effect.burnDmgPct || 0.02) * 100).toFixed(0) + '%伤害，' + (effect.burnTurns || 3) + '回合');
    if (effect.poisonChance != null) parts.push('攻击时' + (effect.poisonChance * 100).toFixed(0) + '%施加中毒，每回合造成最大生命' + ((effect.poisonDmgPct || 0.02) * 100).toFixed(0) + '%伤害，' + (effect.poisonTurns || 3) + '回合');
    if (effect.bleedChance != null) parts.push('攻击时' + (effect.bleedChance * 100).toFixed(0) + '%施加流血，每回合造成最大生命' + ((effect.bleedDmgPct || 0.02) * 100).toFixed(0) + '%伤害，' + (effect.bleedTurns || 3) + '回合');
    if (effect.vulnerablePct) parts.push('怪物受到伤害+' + effect.vulnerablePct + '%');
    if (effect.damageIncreasePct) parts.push('造成伤害+' + effect.damageIncreasePct + '%');
    if (effect.thornsPct) parts.push('受到攻击时反伤' + effect.thornsPct + '%');
    if (effect.hpRegenPerRound) parts.push('每回合回复' + effect.hpRegenPerRound + '生命');
    if (effect.atkPctWhenLowHp != null) parts.push('生命低于' + ((effect.lowHpThreshold || 0.4) * 100).toFixed(0) + '%时攻击+' + effect.atkPctWhenLowHp + '%');
    if (effect.defPctWhenLowHp != null) parts.push('生命低于' + ((effect.lowHpThreshold || 0.35) * 100).toFixed(0) + '%时防御+' + effect.defPctWhenLowHp + '%');
    if (effect.blindChance != null) parts.push('攻击时' + (effect.blindChance * 100).toFixed(0) + '%致盲怪物' + (effect.blindRounds || 1) + '回合');
    if (effect.silenceChance != null) parts.push('攻击时' + (effect.silenceChance * 100).toFixed(0) + '%沉默怪物' + (effect.silenceRounds || 1) + '回合');
    if (effect.slowChance != null) parts.push('攻击时' + (effect.slowChance * 100).toFixed(0) + '%减速怪物' + (effect.slowPct || 15) + '%');
    return parts;
}

function abyssOpenEquipAction(item, slot, invIdx) {
    abyssEquipActionTarget = item;
    abyssEquipActionSlot = slot;
    abyssEquipActionInvIdx = invIdx;
    var html = '<div style="color:' + (ABYSS_QUALITY_COLOR[item.quality] || '#fff') + '">' + item.name + '</div>';
    var equipLv = abyssGetEffectiveEquipLevel(item);
    var enhanceLv = item.equipLevel != null ? (item.level || 0) : 0;
    var hasEnchant = item.enchant && (item.enchant === true || (typeof item.enchant === 'object' && (item.enchant.statMult || item.enchant.skillMult || item.enchant.addedSkill)));
    html += '<div style="font-size:12px;color:#aaa">装备等级 Lv.' + equipLv + ' &nbsp; 强化+' + enhanceLv + (hasEnchant ? ' &nbsp; 附魔' : '') + '</div>';
    if (enhanceLv > 0) {
        html += '<div style="font-size:12px;color:#ff9800;margin-top:4px;">强化效果: 全属性+' + (enhanceLv * 5) + '%</div>';
    }
    var nextEnhanceCost = abyssEnhanceCostForNextLevel(enhanceLv);
    if (hasEnchant && typeof item.enchant === 'object') {
        var enc = item.enchant;
        var encLines = [];
        if (enc.statMult) encLines.push('属性+' + Math.floor((enc.statMult - 1) * 100) + '%');
        if (enc.skillMult) encLines.push('技能效果+' + Math.floor((enc.skillMult - 1) * 100) + '%');
        if (enc.addedSkill) encLines.push('附加技能: ' + enc.addedSkill.name);
        if (encLines.length) html += '<div style="font-size:12px;color:#9c27b0;margin-top:4px;">附魔效果: ' + encLines.join(' | ') + '</div>';
    } else if (item.enchant === true) {
        html += '<div style="font-size:12px;color:#9c27b0;margin-top:4px;">附魔效果: 属性+20%(旧)</div>';
    }
    var s = item.stats || {};
    var baseLevelMult = 1 + equipLv * 0.2;
    var enhanceMult = 1 + enhanceLv * 0.05;
    var dispStatMult = (item.enchant && typeof item.enchant === 'object' && item.enchant.statMult) ? item.enchant.statMult : (item.enchant === true ? 1.2 : 1);
    var totalMult = baseLevelMult * enhanceMult * dispStatMult;
    html += '<div style="font-size:12px;color:#ccc;margin-top:6px;">总属性: ';
    if (s.hp) html += ' 生命+' + Math.floor((s.hp || 0) * totalMult);
    if (s.atk) html += ' 攻击+' + Math.floor((s.atk || 0) * totalMult);
    if (s.def) html += ' 防御+' + Math.floor((s.def || 0) * totalMult);
    if (s.critRate) html += ' 暴击+' + ((s.critRate || 0) * totalMult).toFixed(1) + '%';
    if (s.critDmg) html += ' 爆伤+' + ((s.critDmg || 0) * totalMult).toFixed(0) + '%';
    if (s.skillDmg) html += ' 技能伤害+' + Math.floor((s.skillDmg || 0) * totalMult) + '%';
    if (s.str) html += ' 力量+' + Math.floor((s.str || 0) * totalMult);
    if (s.agi) html += ' 敏捷+' + Math.floor((s.agi || 0) * totalMult);
    if (s.int) html += ' 智力+' + Math.floor((s.int || 0) * totalMult);
    if (s.sta) html += ' 体力+' + Math.floor((s.sta || 0) * totalMult);
    html += '</div>';
    var elParts = [];
    for (var ei = 0; ei < ABYSS_ELEMENTS.length; ei++) {
        var el = ABYSS_ELEMENTS[ei];
        var elAtk = (s[el + 'Atk'] || 0) * totalMult;
        var elRes = (s[el + 'Res'] || 0) * totalMult;
        if (elAtk > 0 || elRes > 0) elParts.push(ABYSS_ELEMENT_NAMES[el] + '攻' + Math.floor(elAtk) + ' 抗' + Math.floor(elRes) + '%');
    }
    if (elParts.length) html += '<div style="font-size:12px;color:#ffd700;margin-top:4px;">五行: ' + elParts.join(' | ') + '</div>';
    if (item.equipSkill) {
        html += '<div style="color:#b388ff;margin-top:6px;">装备技能: ' + item.equipSkill.name + '</div>';
        var eff = item.equipSkill.effect;
        if (!eff && item.equipSkill.id) {
            var sk = getAbyssEquipSkillById(item.equipSkill.id);
            if (sk && sk.effect) eff = sk.effect;
        }
        var effDesc = abyssEquipSkillEffectDesc(eff);
        if (effDesc.length) html += '<div style="font-size:12px;color:#ce93d8;margin-top:2px;margin-left:8px;">效果: ' + effDesc.join('；') + '</div>';
    }
    if (item.skillSlot) {
        html += '<div style="color:#4dd0e1;margin-top:6px;">技能槽: ' + item.skillSlot.name + '</div>';
        var effSlot = item.skillSlot.effect;
        if (!effSlot && item.skillSlot.id) {
            var skSlot = getAbyssEquipSkillById(item.skillSlot.id);
            if (skSlot && skSlot.effect) effSlot = skSlot.effect;
        }
        var effSlotDesc = abyssEquipSkillEffectDesc(effSlot);
        if (effSlotDesc.length) html += '<div style="font-size:12px;color:#80cbc4;margin-left:8px;">' + effSlotDesc.join('；') + '</div>';
    } else {
        html += '<div style="color:#4dd0e1;margin-top:6px;">技能槽: 空</div>';
    }
    var runLevel = Math.max(1, Math.floor((abyssRun.exp || 0) / 100));
    var upgradeStone = abyssRun.materials.upgradeStone || 0;
    html += '<div style="font-size:12px;color:#00bcd4;margin-top:6px;">升级: 消耗1个升级石，装备等级不可超过当前等级(' + runLevel + '级)</div>';
    document.getElementById('abyssEquipActionDetail').innerHTML = html;
    var runeGemBlock = document.getElementById('abyssEquipRuneGemBlock');
    if (runeGemBlock) {
        var eq = item;
        eq.runes = eq.runes || [];
        eq.gems = eq.gems || [];
        var rgHtml = '<div style="color:#b388ff;margin-bottom:6px;">符文槽(' + eq.runes.length + '/' + ABYSS_MAX_RUNE_SLOTS + '): </div>';
        for (var rsi = 0; rsi < eq.runes.length; rsi++) {
            var rid = eq.runes[rsi];
            var rname = rid ? (getAbyssRuneById(rid) || {}).name || rid : '空';
            rgHtml += '<span style="margin-right:8px;">' + (rsi + 1) + '.' + rname + '</span>';
            if (rid) rgHtml += '<button type="button" onclick="abyssEquipUnsocketRune(' + rsi + ')" style="background:#555;color:#fff;border:none;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:11px;margin-right:8px;">取下</button>';
        }
        if (eq.runes.length < ABYSS_MAX_RUNE_SLOTS && (abyssRun.materials.runeSlotOpener || 0) >= 1) {
            rgHtml += '<button type="button" onclick="abyssEquipUseRuneOpener()" style="background:#7b1fa2;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;margin-left:6px;">使用符文开孔器</button>';
        }
        rgHtml += '<div style="color:#ffd700;margin:8px 0 4px 0;">宝石槽(' + eq.gems.length + '/' + ABYSS_MAX_GEM_SLOTS + '): </div>';
        for (var gsi = 0; gsi < eq.gems.length; gsi++) {
            var gid = eq.gems[gsi];
            var gname = gid ? (getAbyssGemById(gid) || {}).name || gid : '空';
            rgHtml += '<span style="margin-right:8px;">' + (gsi + 1) + '.' + gname + '</span>';
            if (gid) rgHtml += '<button type="button" onclick="abyssEquipUnsocketGem(' + gsi + ')" style="background:#555;color:#fff;border:none;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:11px;margin-right:8px;">取下</button>';
        }
        if (eq.gems.length < ABYSS_MAX_GEM_SLOTS && (abyssRun.materials.gemSlotOpener || 0) >= 1) {
            rgHtml += '<button type="button" onclick="abyssEquipUseGemOpener()" style="background:#e65100;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;margin-left:6px;">使用宝石开孔器</button>';
        }
        var runeInv = abyssRun.runeInventory || [];
        var runeCounts = {};
        for (var rci = 0; rci < runeInv.length; rci++) { var id = runeInv[rci]; runeCounts[id] = (runeCounts[id] || 0) + 1; }
        var firstEmptyRune = -1;
        for (var re = 0; re < eq.runes.length; re++) { if (!eq.runes[re]) { firstEmptyRune = re; break; } }
        if (firstEmptyRune >= 0 && Object.keys(runeCounts).length > 0) {
            rgHtml += '<div style="margin-top:8px;color:#ce93d8;">镶嵌符文: ';
            for (var rid in runeCounts) {
                var rn = (getAbyssRuneById(rid) || {}).name || rid;
                rgHtml += '<button type="button" onclick="abyssEquipSocketRune(\'' + rid.replace(/'/g, "\\'") + '\')" style="background:#6a0dad;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px;margin:2px;">' + rn + '(' + runeCounts[rid] + ')</button>';
            }
            rgHtml += '</div>';
        }
        var gemInv = abyssRun.gemInventory || [];
        var gemCounts = {};
        for (var gci = 0; gci < gemInv.length; gci++) { var id = gemInv[gci]; gemCounts[id] = (gemCounts[id] || 0) + 1; }
        var firstEmptyGem = -1;
        for (var ge = 0; ge < eq.gems.length; ge++) { if (!eq.gems[ge]) { firstEmptyGem = ge; break; } }
        if (firstEmptyGem >= 0 && Object.keys(gemCounts).length > 0) {
            rgHtml += '<div style="margin-top:6px;color:#ffd700;">镶嵌宝石: ';
            for (var gid in gemCounts) {
                var gn = (getAbyssGemById(gid) || {}).name || gid;
                rgHtml += '<button type="button" onclick="abyssEquipSocketGem(\'' + gid.replace(/'/g, "\\'") + '\')" style="background:#b8860b;color:#000;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px;margin:2px;">' + gn + '(' + gemCounts[gid] + ')</button>';
            }
            rgHtml += '</div>';
        }
        eq.skillSlot = eq.skillSlot || null;
        rgHtml += '<div style="color:#4dd0e1;margin:8px 0 4px 0;">技能槽: ' + (eq.skillSlot ? eq.skillSlot.name : '空') + '</div>';
        if (eq.skillSlot) rgHtml += '<button type="button" onclick="abyssEquipClearSkillSlot()" style="background:#555;color:#fff;border:none;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:11px;margin-right:8px;">卸下技能</button>';
        if (eq.equipSkill && (abyssRun.materials.skillExtractStone || 0) >= 1) {
            rgHtml += '<button type="button" onclick="abyssEquipUseSkillExtractStone()" style="background:#4dd0e1;color:#000;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;margin:2px;">使用技能提取石（复制【' + eq.equipSkill.name + '】为' + eq.equipSkill.name + '石）</button>';
        }
        var skillStones = abyssRun.skillStoneInventory || [];
        rgHtml += '<div style="margin-top:6px;color:#8bc34a;">技能石背包: 共' + skillStones.length + '个' + (skillStones.length > 0 ? '（' + skillStones.map(function(s){ return s.name || (s.skill && s.skill.name + '石') || '?'; }).join('、') + '）' : '') + '</div>';
        if (!eq.skillSlot && !eq.equipSkill && skillStones.length > 0) {
            rgHtml += '<div style="margin-top:6px;color:#4dd0e1;">使用装备技能石（仅无装备技能时可用）: ';
            for (var sti = 0; sti < skillStones.length; sti++) {
                var st = skillStones[sti];
                rgHtml += '<button type="button" onclick="abyssEquipUseSkillStone(' + sti + ')" style="background:#0097a7;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px;margin:2px;">' + (st.name || st.skill.name + '石') + '</button>';
            }
            rgHtml += '</div>';
        }
        runeGemBlock.innerHTML = rgHtml;
    }
    var ueb = document.getElementById('abyssEquipUnequipBtn');
    if (ueb) {
        if (item.boundMechanic && (invIdx === null || invIdx === undefined)) {
            ueb.textContent = '机械铠甲(锁定)';
            ueb.disabled = true;
        } else {
            ueb.textContent = (invIdx !== null && invIdx !== undefined) ? '装备' : '卸下';
            ueb.disabled = false;
        }
    }
    var upgradeBtn = document.getElementById('abyssEquipUpgradeBtn');
    if (upgradeBtn) upgradeBtn.disabled = (equipLv >= runLevel || upgradeStone < 1);
    var enhanceBtn = document.getElementById('abyssEquipEnhanceBtn');
    if (enhanceBtn) {
        enhanceBtn.textContent = '强化(消耗' + nextEnhanceCost + '个)';
        enhanceBtn.disabled = (abyssRun.materials.enhanceStone || 0) < nextEnhanceCost;
    }
    var disBtn = document.getElementById('abyssEquipDismantleBtn');
    if (disBtn) {
        disBtn.disabled = !!item.boundMechanic;
    }
    document.getElementById('abyssEquipActionOverlay').style.display = 'block';
    document.getElementById('abyssEquipActionUI').style.display = 'block';
}

function closeAbyssEquipAction() {
    document.getElementById('abyssEquipActionOverlay').style.display = 'none';
    document.getElementById('abyssEquipActionUI').style.display = 'none';
    abyssEquipActionTarget = null;
    abyssEquipActionSlot = null;
    abyssEquipActionInvIdx = null;
}

function abyssEquipUpgrade() {
    if (!abyssEquipActionTarget || (abyssRun.materials.upgradeStone || 0) < 1) return;
    var eq = abyssEquipActionTarget;
    var currentEquipLv = eq.equipLevel != null ? eq.equipLevel : 1;
    var runLevel = Math.max(1, Math.floor((abyssRun.exp || 0) / 100));
    // 上限不变：装备“有效等级”不可超过当前等级(runLevel)
    if (abyssGetEffectiveEquipLevel(eq) >= runLevel) return;
    abyssRun.materials.upgradeStone--;
    eq.equipLevel = currentEquipLv + 1;
    closeAbyssEquipAction();
    openAbyssEquipmentPanel();
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function abyssEnhanceCostForNextLevel(currentLevel) {
    return 1 + Math.floor((currentLevel || 0) / 5);
}
function abyssEnhanceStonesUsedToReachLevel(level) {
    var total = 0;
    for (var i = 0; i < (level || 0); i++) total += 1 + Math.floor(i / 5);
    return total;
}

function abyssEquipEnhance() {
    if (!abyssEquipActionTarget) return;
    var curLv = abyssEquipActionTarget.level || 0;
    var cost = abyssEnhanceCostForNextLevel(curLv);
    if ((abyssRun.materials.enhanceStone || 0) < cost) return;
    abyssRun.materials.enhanceStone -= cost;
    abyssEquipActionTarget.level = curLv + 1;
    closeAbyssEquipAction();
    openAbyssEquipmentPanel();
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function abyssEquipEnchant() {
    if (!abyssEquipActionTarget || abyssRun.materials.enchantBook < 1) return;
    abyssRun.materials.enchantBook--;
    var eq = abyssEquipActionTarget;
    var r = Math.random();
    var statMult;
    if (r < 0.80) statMult = 1 + 0.01 + Math.random() * 0.19;
    else if (r < 0.92) statMult = 1.2 + Math.random() * 0.2;
    else if (r < 0.97) statMult = 1.4 + Math.random() * 0.2;
    else if (r < 0.99) statMult = 1.6 + Math.random() * 0.2;
    else statMult = 1.8 + Math.random() * 0.2;
    var skillMult = null;
    var addedSkill = null;
    if (eq.equipSkill && Math.random() < 0.4) skillMult = 1 + Math.random();
    if (!eq.equipSkill && Math.random() < 0.35) {
        var sk = abyssPickEquipSkillByTier();
        addedSkill = { id: sk.id, name: sk.name, effect: JSON.parse(JSON.stringify(sk.effect)) };
    }
    eq.enchant = { statMult: statMult, skillMult: skillMult, addedSkill: addedSkill };
    closeAbyssEquipAction();
    openAbyssEquipmentPanel();
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function abyssEquipUnequip() {
    if (!abyssEquipActionTarget) return;
    if (abyssEquipActionTarget.boundMechanic && abyssEquipActionSlot) {
        alert('机械师专属机械铠甲无法卸下。');
        return;
    }
    if (abyssEquipActionSlot) {
        abyssRun.equipped[abyssEquipActionSlot] = null;
        abyssRun.inventory.push(abyssEquipActionTarget);
    } else if (abyssEquipActionInvIdx !== null) {
        var slot = abyssEquipActionTarget.slot;
        if (abyssRun.equipped[slot]) abyssRun.inventory.push(abyssRun.equipped[slot]);
        abyssRun.equipped[slot] = abyssEquipActionTarget;
        abyssRun.inventory.splice(abyssEquipActionInvIdx, 1);
    }
    closeAbyssEquipAction();
    openAbyssEquipmentPanel();
    updateAbyssRunUI();
}

function abyssEquipDismantle() {
    if (!abyssEquipActionTarget || !abyssRun) return;
    var eq = abyssEquipActionTarget;
    if (eq.boundMechanic) {
        alert('机械师专属机械铠甲无法分解。');
        return;
    }
    if (eq.skillSlot) {
        abyssRun.skillStoneInventory = abyssRun.skillStoneInventory || [];
        var stone = {
            id: 'skillStone_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
            name: eq.skillSlot.name + '石',
            skill: { id: eq.skillSlot.id, name: eq.skillSlot.name, effect: eq.skillSlot.effect ? JSON.parse(JSON.stringify(eq.skillSlot.effect)) : null }
        };
        abyssRun.skillStoneInventory.push(stone);
        abyssLog('分解前已自动卸下技能石【' + eq.skillSlot.name + '石】');
        eq.skillSlot = null;
    }
    abyssRun.runeInventory = abyssRun.runeInventory || [];
    abyssRun.gemInventory = abyssRun.gemInventory || [];
    for (var ri = 0; ri < (eq.runes || []).length; ri++) {
        if (eq.runes[ri]) abyssRun.runeInventory.push(eq.runes[ri]);
    }
    for (var gi = 0; gi < (eq.gems || []).length; gi++) {
        if (eq.gems[gi]) abyssRun.gemInventory.push(eq.gems[gi]);
    }
    var enhanceLv = eq.level || 0;
    abyssRun.materials.enhanceStone = (abyssRun.materials.enhanceStone || 0) + 1;
    if (enhanceLv > 0) {
        var used = abyssEnhanceStonesUsedToReachLevel(enhanceLv);
        abyssRun.materials.enhanceStone += Math.floor(used * 0.8);
    }
    if (abyssEquipActionSlot) abyssRun.equipped[abyssEquipActionSlot] = null;
    else if (abyssEquipActionInvIdx !== null) abyssRun.inventory.splice(abyssEquipActionInvIdx, 1);
    closeAbyssEquipAction();
    openAbyssEquipmentPanel();
    updateAbyssRunUI();
}

function abyssEquipSocketRune(runeId) {
    if (!abyssEquipActionTarget || !abyssRun || !runeId) return;
    var inv = abyssRun.runeInventory || [];
    var idx = inv.indexOf(runeId);
    if (idx < 0) return;
    var eq = abyssEquipActionTarget;
    eq.runes = eq.runes || [];
    var slot = -1;
    for (var i = 0; i < eq.runes.length; i++) { if (!eq.runes[i]) { slot = i; break; } }
    if (slot < 0) return;
    inv.splice(idx, 1);
    eq.runes = eq.runes || [];
    eq.runes[slot] = runeId;
    abyssRun.runeInventory = inv;
    var rn = (getAbyssRuneById(runeId) || {}).name || runeId;
    abyssLog('镶嵌符文【' + rn + '】');
    abyssOpenEquipAction(abyssEquipActionTarget, abyssEquipActionSlot, abyssEquipActionInvIdx);
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function abyssEquipSocketGem(gemId) {
    if (!abyssEquipActionTarget || !abyssRun || !gemId) return;
    var inv = abyssRun.gemInventory || [];
    var idx = inv.indexOf(gemId);
    if (idx < 0) return;
    var eq = abyssEquipActionTarget;
    eq.gems = eq.gems || [null, null, null];
    var slot = -1;
    for (var i = 0; i < eq.gems.length; i++) { if (!eq.gems[i]) { slot = i; break; } }
    if (slot < 0) return;
    inv.splice(idx, 1);
    eq.gems = eq.gems || [];
    eq.gems[slot] = gemId;
    abyssRun.gemInventory = inv;
    var gn = (getAbyssGemById(gemId) || {}).name || gemId;
    abyssLog('镶嵌宝石【' + gn + '】');
    abyssOpenEquipAction(abyssEquipActionTarget, abyssEquipActionSlot, abyssEquipActionInvIdx);
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function abyssEquipUnsocketRune(slotIndex) {
    if (!abyssEquipActionTarget || !abyssRun || slotIndex < 0) return;
    var eq = abyssEquipActionTarget;
    eq.runes = eq.runes || [];
    var runeId = eq.runes[slotIndex];
    if (!runeId) return;
    eq.runes[slotIndex] = null;
    abyssRun.runeInventory = (abyssRun.runeInventory || []).slice();
    abyssRun.runeInventory.push(runeId);
    var rn = (getAbyssRuneById(runeId) || {}).name || runeId;
    abyssLog('取下符文【' + rn + '】');
    abyssOpenEquipAction(abyssEquipActionTarget, abyssEquipActionSlot, abyssEquipActionInvIdx);
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function abyssEquipUnsocketGem(slotIndex) {
    if (!abyssEquipActionTarget || !abyssRun || slotIndex < 0) return;
    var eq = abyssEquipActionTarget;
    eq.gems = eq.gems || [];
    var gemId = eq.gems[slotIndex];
    if (!gemId) return;
    eq.gems[slotIndex] = null;
    abyssRun.gemInventory = (abyssRun.gemInventory || []).slice();
    abyssRun.gemInventory.push(gemId);
    var gn = (getAbyssGemById(gemId) || {}).name || gemId;
    abyssLog('取下宝石【' + gn + '】');
    abyssOpenEquipAction(abyssEquipActionTarget, abyssEquipActionSlot, abyssEquipActionInvIdx);
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function abyssEquipUseRuneOpener() {
    if (!abyssEquipActionTarget || !abyssRun) return;
    var eq = abyssEquipActionTarget;
    eq.runes = eq.runes || [];
    if (eq.runes.length >= ABYSS_MAX_RUNE_SLOTS) return;
    if ((abyssRun.materials.runeSlotOpener || 0) < 1) return;
    abyssRun.materials.runeSlotOpener--;
    eq.runes.push(null);
    abyssLog('使用符文开孔器，当前符文槽 ' + eq.runes.length + '/' + ABYSS_MAX_RUNE_SLOTS);
    abyssOpenEquipAction(abyssEquipActionTarget, abyssEquipActionSlot, abyssEquipActionInvIdx);
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function abyssEquipUseGemOpener() {
    if (!abyssEquipActionTarget || !abyssRun) return;
    var eq = abyssEquipActionTarget;
    eq.gems = eq.gems || [];
    if (eq.gems.length >= ABYSS_MAX_GEM_SLOTS) return;
    if ((abyssRun.materials.gemSlotOpener || 0) < 1) return;
    abyssRun.materials.gemSlotOpener--;
    eq.gems.push(null);
    abyssLog('使用宝石开孔器，当前宝石槽 ' + eq.gems.length + '/' + ABYSS_MAX_GEM_SLOTS);
    abyssOpenEquipAction(abyssEquipActionTarget, abyssEquipActionSlot, abyssEquipActionInvIdx);
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function abyssEquipUseSkillExtractStone() {
    if (!abyssEquipActionTarget || !abyssRun || !abyssEquipActionTarget.equipSkill) return;
    if ((abyssRun.materials.skillExtractStone || 0) < 1) return;
    var eq = abyssEquipActionTarget;
    abyssRun.materials.skillExtractStone--;
    var stoneName = eq.equipSkill.name + '石';
    var stone = {
        id: 'skillStone_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
        name: stoneName,
        skill: { id: eq.equipSkill.id, name: eq.equipSkill.name, effect: eq.equipSkill.effect ? JSON.parse(JSON.stringify(eq.equipSkill.effect)) : null }
    };
    abyssRun.skillStoneInventory = abyssRun.skillStoneInventory || [];
    abyssRun.skillStoneInventory.push(stone);
    abyssLog('使用技能提取石，获得【' + stoneName + '】');
    abyssOpenEquipAction(abyssEquipActionTarget, abyssEquipActionSlot, abyssEquipActionInvIdx);
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function abyssEquipUseSkillStone(stoneIdx) {
    if (!abyssEquipActionTarget || !abyssRun) return;
    var stones = abyssRun.skillStoneInventory || [];
    if (stoneIdx < 0 || stoneIdx >= stones.length) return;
    var eq = abyssEquipActionTarget;
    if (eq.skillSlot) return;
    if (eq.equipSkill) return;
    var st = stones[stoneIdx];
    eq.skillSlot = { id: st.skill.id, name: st.skill.name, effect: st.skill.effect ? JSON.parse(JSON.stringify(st.skill.effect)) : null };
    abyssRun.skillStoneInventory.splice(stoneIdx, 1);
    abyssLog('装备技能槽已镶嵌【' + st.skill.name + '】');
    abyssOpenEquipAction(abyssEquipActionTarget, abyssEquipActionSlot, abyssEquipActionInvIdx);
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function abyssEquipClearSkillSlot() {
    if (!abyssEquipActionTarget || !abyssRun) return;
    var eq = abyssEquipActionTarget;
    if (!eq.skillSlot) return;
    var skillName = eq.skillSlot.name;
    abyssRun.skillStoneInventory = abyssRun.skillStoneInventory || [];
    var stone = {
        id: 'skillStone_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
        name: eq.skillSlot.name + '石',
        skill: { id: eq.skillSlot.id, name: eq.skillSlot.name, effect: eq.skillSlot.effect ? JSON.parse(JSON.stringify(eq.skillSlot.effect)) : null }
    };
    abyssRun.skillStoneInventory.push(stone);
    eq.skillSlot = null;
    abyssLog('已卸下技能槽【' + skillName + '】，技能石已退回背包');
    abyssOpenEquipAction(abyssEquipActionTarget, abyssEquipActionSlot, abyssEquipActionInvIdx);
    if (abyssRun && abyssRun.active) updateAbyssRunUI();
}

function useAbyssPotion() {
    if (!abyssRun || !abyssRun.active || (abyssRun.materials.potion || 0) < 1) return;
    if (abyssRun.trialId === 'noPotion' && abyssRun.trialRoundsLeft > 0) { abyssLog('试炼中：禁止使用药剂'); return; }
    abyssRun.materials.potion--;
    var stats = abyssCalcPlayerStats();
    if (stats) {
        var heal = Math.floor(stats.maxHp * 0.2);
        abyssRun.player.hp = Math.min(abyssRun.player.hp + heal, stats.maxHp);
        abyssLog('使用生命药剂，恢复 ' + formatNumber(heal) + ' 生命');
        // 宠物同步回血（与玩家相同比例：20% 最大生命）
        var pets = abyssRun.pets || [];
        for (var i = 0; i < pets.length; i++) {
            var pet = pets[i];
            if (pet.hp !== null && pet.hp <= 0) continue; // 已死亡不参与回血
            var pstats = abyssCalcPetStats(pet);
            if (!pstats) continue;
            var curHp = pet.hp === null ? pstats.maxHp : pet.hp;
            var petHeal = Math.floor(pstats.maxHp * 0.2);
            var newHp = Math.min(curHp + petHeal, pstats.maxHp);
            pet.hp = newHp;
            if (petHeal > 0) abyssLog('宠物【' + (pet.name || '') + '】恢复 ' + formatNumber(petHeal) + ' 生命');
        }
        updateAbyssRunUI();
    }
}

function openAbyssExclusiveShop() {
    var at = getAbyssTower();
    document.getElementById('abyssExclusiveShopCurrency').textContent = at.exclusiveCurrency || 0;
    var startGearCount = Math.min(20, at.startGearCount || 0);
    var startGearPurchases = at.startGearPurchaseCount || 0;
    var startGearCost = 80 + startGearPurchases * 120;
    var startPetCount = Math.min(5, at.startPetCount || 0);
    var startPetCosts = [200, 1000, 5000, 10000, 20000];
    var startPetCost = startPetCount < 5 ? startPetCosts[startPetCount] : 20000;
    var deployedSlotsPurchases = Math.min(3, at.deployedSlotsPurchases || 0);
    var deployedSlotsCosts = [2000, 20000, 200000];
    var deployedSlotsCost = deployedSlotsPurchases < 3 ? deployedSlotsCosts[deployedSlotsPurchases] : 200000;
    var items = [
        { id: 'startGear', name: '开局装备+1件', cost: startGearCost, cur: startGearCount, max: 20, special: 'startGear' },
        { id: 'startGold', name: '初始闯关金币+2', cost: 100, cur: (at.startGoldBonus || 0), max: null, special: 'startGold' },
        { id: 'startPet', name: '初始获得宠物1只', cost: startPetCost, cur: startPetCount, max: 5, special: 'startPet' },
        { id: 'deployedSlots', name: '出场宠物数量+1', cost: deployedSlotsCost, cur: deployedSlotsPurchases, max: 3, special: 'deployedSlots' },
        { id: 'hp', name: '生命+50', cost: 100, cur: (at.permanentBonuses && at.permanentBonuses.hp) || 0 },
        { id: 'atk', name: '攻击+10', cost: 100, cur: (at.permanentBonuses && at.permanentBonuses.atk) || 0 },
        { id: 'def', name: '防御+5', cost: 80, cur: (at.permanentBonuses && at.permanentBonuses.def) || 0 },
        { id: 'critRate', name: '暴击+0.5%', cost: 280, cur: (at.permanentBonuses && at.permanentBonuses.critRate) || 0 },
        { id: 'critDmg', name: '爆伤+0.5%', cost: 350, cur: (at.permanentBonuses && at.permanentBonuses.critDmg) || 0 },
        { id: 'dodge', name: '闪避+0.5%', cost: 350, cur: (at.permanentBonuses && at.permanentBonuses.dodge) || 0 },
        { id: 'lifesteal', name: '吸血+0.5%', cost: 320, cur: (at.permanentBonuses && at.permanentBonuses.lifesteal) || 0 },
        { id: 'combo', name: '连击+0.5%', cost: 380, cur: (at.permanentBonuses && at.permanentBonuses.combo) || 0 }
    ];
    var el = document.getElementById('abyssExclusiveShopContent');
    el.innerHTML = '';
    items.forEach(function(it) {
        var div = document.createElement('div');
        div.style.background = 'rgba(0,0,0,0.4)';
        div.style.padding = '12px';
        div.style.borderRadius = '8px';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        var curText = it.special === 'startGear' ? ('当前' + it.cur + '/' + it.max + '件') : it.special === 'startGold' ? ('已购+' + (it.cur * 2) + '金币') : it.special === 'startPet' ? ('当前' + it.cur + '/' + it.max + '只') : it.special === 'deployedSlots' ? ('可出战' + (1 + it.cur) + '只') : ('已购+' + it.cur);
        div.innerHTML = '<span>' + it.name + ' (' + curText + ')</span><span>深渊币 ' + it.cost + '</span><button id="abyssBuy_' + it.id + '">购买</button>';
        var btn = div.querySelector('button');
        if (it.id === 'startGear') {
            btn.onclick = (function(cost) {
                return function() {
                    var at2 = getAbyssTower();
                    if ((at2.startGearCount || 0) >= 20) return;
                    if ((at2.exclusiveCurrency || 0) >= cost) {
                        at2.exclusiveCurrency -= cost;
                        at2.startGearCount = Math.min(20, (at2.startGearCount || 0) + 1);
                        at2.startGearPurchaseCount = (at2.startGearPurchaseCount || 0) + 1;
                        openAbyssExclusiveShop();
                        refreshAbyssTowerUI();
                    }
                };
            })(it.cost);
        } else if (it.id === 'startGold') {
            btn.onclick = (function(cost) {
                return function() {
                    var at2 = getAbyssTower();
                    if ((at2.exclusiveCurrency || 0) >= cost) {
                        at2.exclusiveCurrency -= cost;
                        at2.startGoldBonus = (at2.startGoldBonus || 0) + 1;
                        openAbyssExclusiveShop();
                        refreshAbyssTowerUI();
                    }
                };
            })(it.cost);
        } else if (it.id === 'startPet') {
            btn.onclick = (function(cost) {
                return function() {
                    var at2 = getAbyssTower();
                    if ((at2.startPetCount || 0) >= 5) return;
                    if ((at2.exclusiveCurrency || 0) >= cost) {
                        at2.exclusiveCurrency -= cost;
                        at2.startPetCount = (at2.startPetCount || 0) + 1;
                        openAbyssExclusiveShop();
                        refreshAbyssTowerUI();
                    }
                };
            })(it.cost);
        } else if (it.id === 'deployedSlots') {
            btn.onclick = (function(cost) {
                return function() {
                    var at2 = getAbyssTower();
                    if ((at2.deployedSlotsPurchases || 0) >= 3) return;
                    if ((at2.exclusiveCurrency || 0) >= cost) {
                        at2.exclusiveCurrency -= cost;
                        at2.deployedSlotsPurchases = (at2.deployedSlotsPurchases || 0) + 1;
                        openAbyssExclusiveShop();
                        refreshAbyssTowerUI();
                    }
                };
            })(it.cost);
        } else {
            btn.onclick = (function(id, cost) {
                return function() {
                    var at2 = getAbyssTower();
                    if ((at2.exclusiveCurrency || 0) >= cost) {
                        at2.exclusiveCurrency -= cost;
                        if (!at2.permanentBonuses) at2.permanentBonuses = {};
                        at2.permanentBonuses[id] = (at2.permanentBonuses[id] || 0) + (id === 'hp' ? 50 : id === 'atk' ? 10 : id === 'def' ? 5 : id === 'critRate' ? 0.5 : id === 'critDmg' ? 0.5 : id === 'dodge' ? 0.5 : id === 'lifesteal' ? 0.5 : id === 'combo' ? 0.5 : 1);
                        openAbyssExclusiveShop();
                        refreshAbyssTowerUI();
                    }
                };
            })(it.id, it.cost);
        }
        if (it.id === 'startGear' && (at.startGearCount || 0) >= 20) btn.disabled = true;
        if (it.id === 'startPet' && (at.startPetCount || 0) >= 5) btn.disabled = true;
        if (it.id === 'deployedSlots' && (at.deployedSlotsPurchases || 0) >= 3) btn.disabled = true;
        el.appendChild(div);
    });
    document.getElementById('abyssExclusiveOverlay').style.display = 'block';
    document.getElementById('abyssExclusiveUI').style.display = 'block';
}

var abyssExclusiveOpenedFromFail = false;

function abyssOpenExclusiveShopFromFail() {
    abyssExclusiveOpenedFromFail = true;
    document.getElementById('abyssFailOverlay').style.display = 'none';
    document.getElementById('abyssFailUI').style.display = 'none';
    openAbyssExclusiveShop();
}

function closeAbyssExclusiveShop() {
    document.getElementById('abyssExclusiveOverlay').style.display = 'none';
    document.getElementById('abyssExclusiveUI').style.display = 'none';
    if (abyssExclusiveOpenedFromFail) {
        abyssExclusiveOpenedFromFail = false;
        document.getElementById('abyssFailOverlay').style.display = 'block';
        document.getElementById('abyssFailUI').style.display = 'block';
    }
}

function openAbyssVault() {
    var at = getAbyssTower();
    var vault = at.abyssVault || {};
    var el = document.getElementById('abyssVaultContent');
    el.innerHTML = '';
    ABYSS_VAULT_TREASURES.forEach(function(t) {
        var count = vault[t.id] || 0;
        if (count <= 0) return;
        var div = document.createElement('div');
        div.style.background = 'rgba(179,136,255,0.25)';
        div.style.padding = '8px 12px';
        div.style.borderRadius = '6px';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.border = '1px solid #b388ff';
        var eff = t.effect;
        var effText = eff.type === 'atkVaultPct' ? (eff.value + '%攻击') : eff.type === 'hpVaultPct' ? (eff.value + '%生命') : eff.type === 'defVaultPct' ? (eff.value + '%防御') : eff.type === 'critDmgVaultPct' ? (eff.value + '%爆伤') : eff.type === 'atkVaultFlat' ? ('+' + eff.value + '攻') : eff.type === 'defVaultFlat' ? ('+' + eff.value + '防') : eff.type === 'hpVaultFlat' ? ('+' + eff.value + '血') : eff.type === 'petAtkVaultPct' ? (eff.value + '%宠攻') : eff.type === 'petHpVaultPct' ? (eff.value + '%宠血') : eff.type === 'petDefVaultPct' ? (eff.value + '%宠防') : eff.type === 'petAtkVaultFlat' ? ('+' + eff.value + '宠攻') : eff.type === 'petDefVaultFlat' ? ('+' + eff.value + '宠防') : eff.type === 'petHpVaultFlat' ? ('+' + eff.value + '宠血') : eff.type === 'petGrowthAll' ? ('宠物资质全部+' + eff.value) : '';
        div.innerHTML = '<span><strong style="color:#e0e0e0">' + t.name + '+</strong> <span style="color:#b388ff;font-size:12px;">' + effText + '</span></span><span style="color:#ffd700;font-weight:bold;">x' + count + '</span>';
        el.appendChild(div);
    });
    if (el.children.length === 0) {
        var emptyDiv = document.createElement('div');
        emptyDiv.style.color = '#888';
        emptyDiv.style.textAlign = 'center';
        emptyDiv.style.padding = '20px';
        emptyDiv.textContent = '暂无宝物，击败BOSS层有3%概率掉落';
        el.appendChild(emptyDiv);
    }
    document.getElementById('abyssVaultOverlay').style.display = 'block';
    document.getElementById('abyssVaultUI').style.display = 'block';
}

function closeAbyssVault() {
    document.getElementById('abyssVaultOverlay').style.display = 'none';
    document.getElementById('abyssVaultUI').style.display = 'none';
}

function abyssShowTreasureDropPopup(name, effText) {
    document.getElementById('abyssTreasureDropName').textContent = '【' + name + '】';
    document.getElementById('abyssTreasureDropEff').textContent = '永久' + effText + '！';
    document.getElementById('abyssTreasureDropOverlay').style.display = 'block';
    document.getElementById('abyssTreasureDropUI').style.display = 'block';
}
function closeAbyssTreasureDropPopup() {
    document.getElementById('abyssTreasureDropOverlay').style.display = 'none';
    document.getElementById('abyssTreasureDropUI').style.display = 'none';
}
function abyssShowNetworkDropPopup(lines) {
    var el = document.getElementById('abyssNetworkDropContent');
    if (el) el.innerHTML = (lines && lines.length) ? lines.join('<br>') : '【物品】';
    var ov = document.getElementById('abyssNetworkDropOverlay');
    var ui = document.getElementById('abyssNetworkDropUI');
    if (ov) ov.style.display = 'block';
    if (ui) ui.style.display = 'block';
}
function closeAbyssNetworkDropPopup() {
    var ov = document.getElementById('abyssNetworkDropOverlay');
    var ui = document.getElementById('abyssNetworkDropUI');
    if (ov) ov.style.display = 'none';
    if (ui) ui.style.display = 'none';
}

function abyssEscapeAndClaim() {
    if (!abyssRun || !abyssRun.active) return;
    abyssLog('选择逃跑，结算当前层深渊币。');
    // 逃跑属于“挑战失败结算”，但不是被击败死亡
    abyssRun.deathInfo = abyssRun.deathInfo || '主动逃跑（提前结束）';
    abyssOnPlayerDeath();
}

function abyssOnPlayerDeath() {
    stopAbyssAutoAttack();  // 立即停止定时器，防止泄漏
    abyssRun.active = false;
    var at = getAbyssTower();
    if (abyssRun.floor > (at.bestFloor || 0)) at.bestFloor = abyssRun.floor;
    if (typeof checkTitleUnlocks === 'function') checkTitleUnlocks();
    // 深渊币 = 层数×倍数：基础2倍，每10层多1倍
    // 原规则：1-10层×1，11-20层×2，21-30层×3 ...
    // 现规则：1-10层×2，11-20层×3，21-30层×4 ...（每10层多1倍不变）
    var mul = Math.floor((abyssRun.floor - 1) / 10) + 2;
    var reward = abyssRun.floor * mul;
    at.exclusiveCurrency = (at.exclusiveCurrency || 0) + reward;
    abyssLog('挑战结束。获得深渊币 ' + reward);
    if (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken() && typeof goldGameCheckAbyssCurrency === 'function') {
        goldGameCheckAbyssCurrency(at.exclusiveCurrency);
    }
    document.getElementById('abyssFailFloor').textContent = abyssRun.floor;
    document.getElementById('abyssFailCurrency').textContent = reward;
    var deathInfo = abyssRun.deathInfo || abyssRun.deathReason || '生命值归零';
    document.getElementById('abyssFailDeathInfo').textContent = deathInfo;
    document.getElementById('abyssFailOverlay').style.display = 'block';
    document.getElementById('abyssFailUI').style.display = 'block';
    refreshAbyssTowerUI();
}

function closeAbyssFailAndRestart() {
    document.getElementById('abyssFailOverlay').style.display = 'none';
    document.getElementById('abyssFailUI').style.display = 'none';
    document.getElementById('abyssStartPanel').style.display = 'block';
    document.getElementById('abyssRunPanel').style.display = 'none';
    abyssTeardownUiTimers();
    abyssRun = null;
    refreshAbyssTowerUI();
}

function saveAbyssTowerProgress() {
    var at = getAbyssTower();
    at.bestFloor = at.bestFloor || 0;
    at.exclusiveCurrency = at.exclusiveCurrency || 0;
    if (!at.permanentBonuses) at.permanentBonuses = {};
}

 // 世界BOSS系统数据
        const worldBossData = {
            summonCount: 1,
            lastSummonTime: Date.now(),
            isBossActive: false,
            bossEndTime: 0,
            bossHealth: 0,
            bossMaxHealth: 0,
            bossName: "",
            bossWorld: "",
            bossStars: 0,
            playerDamage: 0,
            isAutoAttacking: false,
            attackInterval: null,
            virtualPlayers: [],
            rankings: [],
            battleLog: [],
            lastSummonTime: Date.now(),
        nextRecoveryTime: 0, // 新增：下次恢复时间
        summonCountdownTimer: null, // 召唤次数倒计时 setTimeout ID，关闭界面时清除防泄漏
        pendingVirtualLog: null, // 虚拟玩家日志合并缓存
        };
        function isWorldBossUIVisible() {
            const ui = document.getElementById('worldBossUI');
            return !!(ui && ui.style.display === 'block');
        }

        // BOSS名字池
        const bossNames = [
            "灭世魔尊·阎罗",
            "永恒天帝·太初",
            "混沌主宰·虚无",
            "九幽冥王·黄泉",
            "万界神皇·凌霄",
            "太古龙帝·烛阴",
            "星空吞噬者·饕餮",
            "时间掌控者·岁月",
            "命运编织者·天机",
            "元素始祖·创世"
        ];

        // 世界名字池
        const worldNames = [
            "玄天大陆",
            "九幽冥界",
            "太虚神境",
            "洪荒古界",
            "星辰海域",
            "万界战场",
            "永恒神域",
            "混沌虚空",
            "天元世界",
            "轮回之境"
        ];

        // 虚拟玩家名字池
        const virtualPlayerNames = [
            "萧炎", "林动", "牧尘", "叶凡", "石昊",
            "楚风", "秦羽", "方源", "韩立", "孟浩",
            "苏铭", "王林", "白小纯", "李七夜", "陈平安",
            "宁缺", "许七安", "陆鸣", "周元", "江离",
            "罗峰", "洪易", "纪宁", "滕青山", "唐三",
            "霍雨浩", "唐舞麟", "蓝轩宇", "古月娜", "唐昊", "茶茶", "闫闫", "萧云凡", "叶玄霄", "林昊辰", "楚星河", "秦无痕", "苏九夜", "陆天行", "沈青岚", "顾长歌", "洛千尘", "云清瑶", "柳如烟", "白芷晴", "慕雨柔", "苏灵儿", "凌寒霜", "楚月璃", "花未央", "冷轻衣", "夜琉璃", "夏知微", "苏晚晴", "林浅夏", "乔曦", "李二狗", "张全蛋", "赵日天", "王富贵"
        ];

        // 初始化世界BOSS系统
            function initWorldBossSystem() {
    // 计算离线时间增加的召唤次数
    const currentTime = Date.now();
    const timePassed = currentTime - (worldBossData.lastSummonTime || currentTime);
    const hoursPassed = Math.floor(timePassed / (60 * 60 * 1000));
    
    if (hoursPassed > 0) {
        worldBossData.summonCount = Math.min(worldBossData.summonCount + hoursPassed, 10);
        worldBossData.lastSummonTime = currentTime;
        saveWorldBossData();
    }
    
    // 计算下次恢复时间
    calculateNextRecoveryTime();
    
    // 启动倒计时更新
    updateSummonCountdown();
    
    updateBossUI();
}

// 计算下次恢复时间
function calculateNextRecoveryTime() {
    if (worldBossData.summonCount >= 10) {
        worldBossData.nextRecoveryTime = 0;
        return;
    }
    
    // 距离下次恢复的时间 = 1小时 - (当前时间与上次恢复的时间差 % 1小时)
    const oneHour = 60 * 60 * 1000;
    const timeSinceLastRecovery = Date.now() - worldBossData.lastSummonTime;
    const timeToNextRecovery = oneHour - (timeSinceLastRecovery % oneHour);
    
    worldBossData.nextRecoveryTime = Date.now() + timeToNextRecovery;
}

// 更新召唤次数倒计时显示（仅在世界BOSS界面打开时持续刷新，避免关闭界面后定时器常驻造成资源占用）
function updateSummonCountdown() {
    const countdownElement = document.getElementById('summonCountdown');
    const bossUI = document.getElementById('worldBossUI');
    if (!countdownElement || !bossUI || bossUI.style.display !== 'block') {
        return; // 界面关闭时不调度下一次，避免常规定时器泄漏
    }
    
    if (worldBossData.summonCount >= 10) {
        countdownElement.textContent = "已达上限";
        worldBossData.summonCountdownTimer = setTimeout(updateSummonCountdown, 1000);
        return;
    }
    
    const now = Date.now();
    const timeLeft = Math.max(0, worldBossData.nextRecoveryTime - now);
    
    if (timeLeft === 0 && worldBossData.summonCount < 10) {
        // 强制更新上次召唤时间为当前时间
        worldBossData.lastSummonTime = now;
        worldBossData.summonCount++;
        calculateNextRecoveryTime(); // 重新计算下次恢复时间（1小时后）
        saveWorldBossData();
        document.getElementById('bossSummonCount').textContent = worldBossData.summonCount;
        console.log("恢复次数+1，下次恢复时间：", new Date(worldBossData.nextRecoveryTime).toLocaleTimeString());
    }
    
    // 格式化时间显示
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
    countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    worldBossData.summonCountdownTimer = setTimeout(updateSummonCountdown, 1000);
}


        // 保存世界BOSS数据
        function saveWorldBossData() {
    worldBossData.lastUpdate = Date.now();
    localStorage.setItem('worldBossSave', JSON.stringify(worldBossData));
}

        // 加载世界BOSS数据
        // 加载世界BOSS数据
function loadWorldBossData() {
    const save = JSON.parse(localStorage.getItem('worldBossSave'));
    if (save) {
        Object.assign(worldBossData, save);
        worldBossData.summonCountdownTimer = null; // 定时器 ID 不能跨页面恢复，必须清空
        // 如果BOSS活动正在进行中，计算离线期间的伤害
        if (worldBossData.isBossActive) {
            const currentTime = Date.now();
            
            // 检查BOSS是否已超时
            if (currentTime > worldBossData.bossEndTime) {
                endBossFight(false);
            } else {
                // 计算离线时间（秒）
                const offlineSeconds = Math.floor((currentTime - worldBossData.lastUpdate) / 1000);
                
                if (offlineSeconds > 0) {
                    // 1. 计算虚拟玩家在离线期间造成的总伤害（已有逻辑）
                    const virtualDamagePerSecond = worldBossData.virtualPlayers.reduce((sum, player) => {
                        const avgDamage = player.attack * player.multiAttack * 
                                        (1 + (player.critRate * (player.critDamage - 1)));
                        return sum + avgDamage;
                    }, 0);
                    const totalVirtualDamage = Math.floor(virtualDamagePerSecond * offlineSeconds);
                    worldBossData.bossHealth = bLteZero(bSub(worldBossData.bossHealth, totalVirtualDamage)) ? 0 : bSub(worldBossData.bossHealth, totalVirtualDamage);
                    const damagePerPlayer = Math.floor(totalVirtualDamage / worldBossData.virtualPlayers.length);
                    worldBossData.virtualPlayers.forEach(player => {
                        player.damage += damagePerPlayer;
                    });
                    addBossBattleLog(`离线期间虚拟玩家共造成 ${formatSci(totalVirtualDamage)} 点伤害`);
                    
                    // 2. 新增：计算真实玩家的离线自动攻击伤害
                    if (worldBossData.isAutoAttacking) { // 仅当开启自动攻击时计算
                        // 玩家每秒攻击11次（与startAutoAttack一致）
                        const attacksPerSecond = 11;
                        const totalAttacks = offlineSeconds * attacksPerSecond;
                        
                        // 计算单次攻击的平均伤害（参考calculatePlayerDamage逻辑）
                        const playerData = {
                            attack: player.bossBattleSnapshot?.playerAttack || player.battle.playerAttack,
    multiAttack: player.bossBattleSnapshot?.playerMultiAttack || player.battle.playerMultiAttack,
    critRate: player.bossBattleSnapshot?.playerCritRate || player.battle.playerCritRate,
    critDamage: player.bossBattleSnapshot?.playerCritDamage || player.battle.playerCritDamage
                        };
                        // 计算单次攻击的平均伤害（避免循环计算totalAttacks次，优化性能）
                        const avgFactor = (playerData.multiAttack || 1) * (1 + (playerData.critRate * (playerData.critDamage - 1)));
                        const singleAttackAvgDamage = multiplyBigByFinite(playerData.attack, avgFactor);
                        const totalPlayerDamage = multiplyBigByFinite(singleAttackAvgDamage, totalAttacks);
                        
                        // 应用玩家离线伤害
                        worldBossData.bossHealth = bLteZero(bSub(worldBossData.bossHealth, totalPlayerDamage)) ? 0 : bSub(worldBossData.bossHealth, totalPlayerDamage);
                        worldBossData.playerDamage = bigSciToStorageValue(addBigSci(worldBossData.playerDamage || 0, totalPlayerDamage));
                        addBossBattleLog(`离线期间你通过自动攻击造成 ${formatSci(totalPlayerDamage)} 点伤害`);
                    }
                    
                    // 检查BOSS是否被击败
                    if (bLteZero(worldBossData.bossHealth)) {
                        endBossFight(true);
                        return;
                    }
                }
            }
        }
    }
    
    // 仅在BOSS进行中才恢复虚拟玩家攻击，避免空跑定时器
    if (worldBossData.isBossActive) startVirtualPlayerAttacks();
    
    // 更新最后更新时间
    worldBossData.lastUpdate = Date.now();
    initWorldBossSystem();
}

        // 切换世界BOSS界面
        function toggleWorldBossUI() {
           // 检查转生次数是否达到50次
    if (player.reincarnationCount < 50) {
        alert("需要达到50转才能开启世界BOSS系统！");
        return;
    }
            const ui = document.getElementById('worldBossUI');
            const overlay = document.getElementById('bossOverlay');
            
            if (ui.style.display === 'block') {
                ui.style.display = 'none';
                overlay.style.display = 'none';
                if (worldBossData.summonCountdownTimer != null) {
                    clearTimeout(worldBossData.summonCountdownTimer);
                    worldBossData.summonCountdownTimer = null;
                }
            } else {
                ui.style.display = 'block';
                overlay.style.display = 'block';
                updateBossUI();
                updateSummonCountdown(); // 重新启动倒计时链（界面打开时才刷新）
            }
        }

        // 更新BOSS界面
        function updateBossUI() {
            if (!isWorldBossUIVisible()) return;
            document.getElementById('bossSummonCount').textContent = worldBossData.summonCount;
    if (worldBossData.isBossActive && player.bossBattleSnapshot) {
        document.getElementById('playerBossAttack').textContent = formatNumber(player.bossBattleSnapshot.playerAttack);
        document.getElementById('playerBossMultiAttack').textContent = player.bossBattleSnapshot.playerMultiAttack;
        document.getElementById('playerBossCritRate').textContent = (player.bossBattleSnapshot.playerCritRate * 100).toFixed(1) + '%';
        document.getElementById('playerBossCritDamage').textContent = ((player.bossBattleSnapshot.playerCritDamage - 1) * 100).toFixed(1) + '%';
    } else {
        // 显示实时属性
        document.getElementById('playerBossAttack').textContent = formatNumber(player.battle.playerAttack);
        document.getElementById('playerBossMultiAttack').textContent = player.battle.playerMultiAttack;
        document.getElementById('playerBossCritRate').textContent = (player.battle.playerCritRate * 100).toFixed(1) + '%';
        document.getElementById('playerBossCritDamage').textContent = ((player.battle.playerCritDamage - 1) * 100).toFixed(1) + '%';
    }
            document.getElementById('playerBossDamage').textContent = formatNumber(worldBossData.playerDamage);
       if (!worldBossData.isBossActive) {
        document.getElementById('playerBossRank').textContent = "未开始";
    }
            // 新增：检查BOSS是否超时（无论是否在战斗中，强制判断时间）
    if (worldBossData.isBossActive && Date.now() >= worldBossData.bossEndTime) {
        endBossFight(false); // 强制结束战斗
        return; // 结束后无需继续更新UI
    }
          if (!worldBossData.isBossActive) {
        document.getElementById('playerBossRank').textContent = "未开始";
    }
            // 更新BOSS状态
            if (worldBossData.isBossActive) {
                document.getElementById('bossName').textContent = worldBossData.bossName;
                document.getElementById('bossWorld').textContent = worldBossData.bossWorld;
                document.getElementById('bossStars').textContent = '★'.repeat(worldBossData.bossStars);
                
                const healthPercent = (Number(worldBossData.bossHealth) / Number(worldBossData.bossMaxHealth)) * 100;
                document.getElementById('bossHealthFill').style.width = healthPercent + '%';
                document.getElementById('bossHealthText').textContent = 
                    formatNumber(worldBossData.bossHealth) + '/' + formatNumber(worldBossData.bossMaxHealth);
                
                const timeLeft = Math.max(0, Math.floor((worldBossData.bossEndTime - Date.now()) / 1000));
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                document.getElementById('bossTimeLeft').textContent = 
                    `剩余: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                
                document.getElementById('bossSummonButton').disabled = true;
                document.getElementById('bossAttackButton').disabled = false;
                
                // 更新排行榜
                updateRankings();
            } else {
                document.getElementById('bossName').textContent = '未召唤BOSS';
                document.getElementById('bossWorld').textContent = '';
                document.getElementById('bossStars').textContent = '';
                document.getElementById('bossHealthFill').style.width = '0%';
                document.getElementById('bossHealthText').textContent = '0/0';
                document.getElementById('bossTimeLeft').textContent = '剩余: 未开始';
                
                document.getElementById('bossSummonButton').disabled = worldBossData.summonCount <= 0;
                document.getElementById('bossAttackButton').disabled = true;
                
                if (worldBossData.summonCount <= 0) {
                    document.getElementById('bossSummonButton').textContent = '无次数';
                } else {
                    document.getElementById('bossSummonButton').textContent = '召唤';
                }
            }
            
            // 更新自动攻击按钮
            document.getElementById('bossAutoAttackButton').textContent = 
                `自动: ${worldBossData.isAutoAttacking ? '开' : '关'}`;
        }

        // 召唤BOSS
        function summonBoss() {
           // 检查转生次数是否达到50次
    if (player.reincarnationCount < 50) {
        alert("需要达到50转才能召唤世界BOSS！");
        return;
    }
            if (worldBossData.summonCount <= 0) return;
            
            worldBossData.summonCount--;
            worldBossData.isBossActive = true;
            worldBossData.bossEndTime = Date.now() + 60 * 60 * 1000; // 60分钟
            worldBossData.playerDamage = 0;
            worldBossData.battleLog = [];
            
            // 随机生成BOSS属性
            worldBossData.bossName = bossNames[Math.floor(Math.random() * bossNames.length)];
            worldBossData.bossWorld = worldNames[Math.floor(Math.random() * worldNames.length)];
            worldBossData.bossStars = Math.floor(Math.random() * 30) + 1; // 1-30星
            
            // BOSS生命值为玩家攻击力的100000万-1000000万倍
            const healthMultiplier = 10000000000000000000 + Math.random() * 99000000000000000000000000;
            worldBossData.bossMaxHealth = bMul(player.battle.playerAttack, healthMultiplier * player.battle.playerCritDamage);
            worldBossData.bossHealth = worldBossData.bossMaxHealth;
           // 保存玩家属性快照
    player.bossBattleSnapshot = {
        playerAttack: player.battle.playerAttack,
        playerMultiAttack: player.battle.playerMultiAttack,
        playerCritRate: player.battle.playerCritRate,
        playerCritDamage: player.battle.playerCritDamage
    };                   
            // 生成虚拟玩家
            generateVirtualPlayers();
            
            // 开始虚拟玩家攻击
            startVirtualPlayerAttacks();
            
            // 更新UI
            updateBossUI();
            
            // 保存数据
            saveWorldBossData();
            
            // 添加战斗日志
            addBossBattleLog(`召唤了 ${worldBossData.bossName} [${worldBossData.bossWorld}] (${worldBossData.bossStars}★)`);
            
            // 设置BOSS结束检查
            setTimeout(checkBossEnd, 1000);
        }

        // 生成虚拟玩家
        function generateVirtualPlayers() {
            worldBossData.virtualPlayers = [];
            
            for (let i = 0; i < 60; i++) {
                const name = virtualPlayerNames[i] || `玩家${i+1}`;
                const attackMultiplier = 0.2 + Math.random() * 30; 
                const attack = bMul(player.battle.playerAttack, attackMultiplier);
                const multiAttack = Math.max(1, 
                    Math.floor(player.battle.playerMultiAttack * (0.3 + Math.random() * 1.5))); 
                const critRate = 0.5 + Math.random() * 1.9; 
                const critDamage = player.battle.playerCritDamage * (0.3 + Math.random() * 1.5);
                
                worldBossData.virtualPlayers.push({
                    name: name,
                    attack: attack,
                    multiAttack: multiAttack,
                    critRate: critRate,
                    critDamage: critDamage,
                    damage: 0
                });
            } 
      }
      // 修改离线虚拟玩家伤害计算逻辑（替换原有的平均分配部分）
function calculateOfflineVirtualDamage() {
    const now = Date.now();
    const timePassed = now - worldBossData.lastVirtualAttackTime;
    const secondsPassed = Math.floor(timePassed / 1000);
    if (secondsPassed <= 0) return;

    // 为每个虚拟玩家单独计算离线伤害（基于其自身属性）
    let totalDamage = bigSciToStorageValue(0);
    worldBossData.virtualPlayers.forEach(player => {
        // 计算该玩家的每秒平均伤害（考虑连击和爆伤）
        const avgFactor = (player.multiAttack || 1) * (3 + (player.critRate * (player.critDamage - 1)));
        const avgDps = multiplyBigByFinite(player.attack, avgFactor);
        // 计算离线总伤害
        const playerDamage = multiplyBigByFinite(avgDps, secondsPassed);
        // 应用伤害
        worldBossData.bossHealth = bLteZero(bSub(worldBossData.bossHealth, playerDamage)) ? 0 : bSub(worldBossData.bossHealth, playerDamage);
        player.damage = bigSciToStorageValue(addBigSci(player.damage || 0, playerDamage));
        totalDamage = bigSciToStorageValue(addBigSci(totalDamage, playerDamage));
    });

    // 更新最后攻击时间
    worldBossData.lastVirtualAttackTime = now;

    // 记录总离线伤害
    addBossBattleLog(`离线期间虚拟玩家共造成 ${formatSci(totalDamage)} 点伤害`);

    // 检查BOSS是否被击败
    if (bLteZero(worldBossData.bossHealth)) {
        endBossFight(true);
    }
            
            // 更新排行榜
            updateRankings();
            
            // 保存数据
            saveWorldBossData();
        }
// 开始虚拟玩家攻击
        function startVirtualPlayerAttacks() {
            // 清除之前的攻击间隔
            if (worldBossData.virtualAttackInterval) {
                if (typeof unregisterInterval === 'function') unregisterInterval(worldBossData.virtualAttackInterval);
                else clearInterval(worldBossData.virtualAttackInterval);
                worldBossData.virtualAttackInterval = null;
            }
            
            // 设置新的攻击间隔 (每秒攻击一次)
            worldBossData.virtualAttackInterval = registerInterval(() => {
                if (!worldBossData.isBossActive) {
                    if (typeof unregisterInterval === 'function') unregisterInterval(worldBossData.virtualAttackInterval);
                    else clearInterval(worldBossData.virtualAttackInterval);
                    worldBossData.virtualAttackInterval = null;
                    return;
                }
                
                // 所有虚拟玩家攻击
                let virtualTickTotal = bigSciToStorageValue(0);
                let virtualLogCount = 0;
                worldBossData.virtualPlayers.forEach(player => {
                    const result = calculatePlayerDamage(player);
                    worldBossData.bossHealth = bLteZero(bSub(worldBossData.bossHealth, result.total)) ? 0 : bSub(worldBossData.bossHealth, result.total);
                    player.damage = bigSciToStorageValue(addBigSci(player.damage || 0, result.total));
                    virtualTickTotal = bigSciToStorageValue(addBigSci(virtualTickTotal, result.total));
                    
                    // 每10次攻击记录一次（显示爆伤）
                    if (Math.random() < 0.1) {
                        virtualLogCount++;
                    }
                });
                if (virtualLogCount > 0) {
                    worldBossData.pendingVirtualLog = {
                        ts: Date.now(),
                        count: virtualLogCount,
                        total: virtualTickTotal,
                    };
                }
                if (worldBossData.pendingVirtualLog && isWorldBossUIVisible()) {
                    const p = worldBossData.pendingVirtualLog;
                    addBossBattleLog(`虚拟玩家本秒共${p.count}次有效攻击，累计造成 ${formatNumber(p.total)} 伤害`);
                    worldBossData.pendingVirtualLog = null;
                }
                
                // 更新UI
                updateRankings();
                updateBossUI();
                
                // 检查BOSS是否被击败
                if (bLteZero(worldBossData.bossHealth)) {
                    endBossFight(true);
                }
            }, 1000);
        }

        // 计算玩家伤害
        function calculatePlayerDamage(playerData) {
            const hits = Math.max(1, Math.floor(Number(playerData.multiAttack) || 1));
            const critRate = Math.max(0, Math.min(1, Number(playerData.critRate) || 0));
            const critCount = Math.floor(hits * critRate);
            const normalCount = Math.max(0, hits - critCount);
            const attack = bigSciToStorageValue(playerData.attack);
            const critHitDamage = multiplyBigByFinite(attack, playerData.critDamage);
            const normalDamageTotal = multiplyBigByFinite(attack, normalCount);
            const critDamageTotal = multiplyBigByFinite(critHitDamage, critCount);
            const totalDamage = bigSciToStorageValue(addBigSci(normalDamageTotal, critDamageTotal));

            return {
                total: totalDamage,
                critCount: critCount,
                critDamage: critDamageTotal,
                normalDamage: normalDamageTotal
            };
        }

        // 攻击BOSS（修改为显示爆伤信息）
        function attackBoss() {
            if (!worldBossData.isBossActive) return;
            
    // 使用保存的属性快照而不是实时属性
    const result = calculatePlayerDamage({
        attack: player.bossBattleSnapshot.playerAttack,
        multiAttack: player.bossBattleSnapshot.playerMultiAttack,
        critRate: player.bossBattleSnapshot.playerCritRate,
        critDamage: player.bossBattleSnapshot.playerCritDamage
    });
    
            
            worldBossData.bossHealth = bLteZero(bSub(worldBossData.bossHealth, result.total)) ? 0 : bSub(worldBossData.bossHealth, result.total);
            worldBossData.playerDamage = bigSciToStorageValue(addBigSci(worldBossData.playerDamage || 0, result.total));
            
            // 添加战斗日志（显示爆伤详情）
            let logMessage = `你造成了 ${formatNumber(result.total)} 点伤害 (${player.battle.playerMultiAttack}连击) - `;
            logMessage += `普通伤害: ${formatNumber(result.normalDamage)}, `;
            logMessage += `暴击x${result.critCount}: ${formatNumber(result.critDamage)}`;
            
            addBossBattleLog(logMessage);
            
            // 更新UI
            updateRankings();
            updateBossUI();

           // 新增：保存攻击后的BOSS数据
    saveWorldBossData();
            
            // 检查BOSS是否被击败
            if (bLteZero(worldBossData.bossHealth)) {
                endBossFight(true);
            }
        }

        // 切换自动攻击
        function toggleAutoAttackBoss() {
            worldBossData.isAutoAttacking = !worldBossData.isAutoAttacking;
            
            if (worldBossData.isAutoAttacking) {
                // 启动自动攻击（即使界面关闭也会继续）
                startAutoAttack();
            } else {
                stopAutoAttack();
            }
            
            updateBossUI();
        }

        // 新增专用函数处理自动攻击
function startAutoAttack() {
    // 先停止现有的自动攻击
    stopAutoAttack();
    
    // 每秒批量结算20次（避免20次循环导致卡顿）
    worldBossData.attackInterval = registerInterval(() => {
        if (worldBossData.isBossActive && worldBossData.isAutoAttacking) {
            // 使用属性快照攻击
            const result = calculatePlayerDamage({
                attack: player.bossBattleSnapshot.playerAttack,
                multiAttack: player.bossBattleSnapshot.playerMultiAttack,
                critRate: player.bossBattleSnapshot.playerCritRate,
                critDamage: player.bossBattleSnapshot.playerCritDamage
            });
            const batchTotal = multiplyBigByFinite(result.total, 20);
            worldBossData.bossHealth = bLteZero(bSub(worldBossData.bossHealth, batchTotal)) ? 0 : bSub(worldBossData.bossHealth, batchTotal);
            worldBossData.playerDamage = bigSciToStorageValue(addBigSci(worldBossData.playerDamage || 0, batchTotal));
            if (bLteZero(worldBossData.bossHealth)) {
                endBossFight(true);
            }
        }
    }, 1000);
}

        function stopAutoAttack() {
            if (worldBossData.attackInterval) {
                if (typeof unregisterInterval === 'function') unregisterInterval(worldBossData.attackInterval);
                else clearInterval(worldBossData.attackInterval);
                worldBossData.attackInterval = null;
            }
        }

        // 更新排行榜
function updateRankings() {
    if (!isWorldBossUIVisible()) return;
    // 合并真实玩家和虚拟玩家
    const allPlayers = [
        {
            name: "你",
            damage: worldBossData.playerDamage
        },
        ...worldBossData.virtualPlayers.map(p => ({
            name: p.name,
            damage: p.damage
        }))
    ];
    
    // 按伤害排序
    allPlayers.sort((a, b) => cmpBigSci(b.damage || 0, a.damage || 0));
    worldBossData.rankings = allPlayers;
    
    // 更新玩家排名
    const playerRank = allPlayers.findIndex(p => p.name === "你") + 1;
    const rankEl = document.getElementById('playerBossRank');
    if (rankEl) rankEl.textContent = playerRank ? 
        `${playerRank} / ${allPlayers.length}` : "未排名";
    
    // 更新UI
    const rankingsContainer = document.getElementById('bossRankings');
    if (!rankingsContainer) return;
    rankingsContainer.innerHTML = '';
    
    allPlayers.slice(0, 10).forEach((player, index) => {
        const div = document.createElement('div');
        div.className = 'boss-ranking-item';
        div.innerHTML = `
            <span>${index + 1}. ${player.name}</span>
            <span>${formatNumber(player.damage)}</span>
        `;
        rankingsContainer.appendChild(div);
    });
    
    if (allPlayers.length === 0) {
        rankingsContainer.innerHTML = '<div>尚未开始战斗</div>';
    }
}

        // 添加战斗日志
        function addBossBattleLog(message) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = `[${timestamp}] ${message}`;
            
            worldBossData.battleLog.unshift(logEntry);
            if (worldBossData.battleLog.length > 15) { // 减少日志数量
                worldBossData.battleLog.pop();
            }
            
            // 仅在界面可见时刷新DOM，避免后台频繁重排
            if (!isWorldBossUIVisible()) return;
            const logContainer = document.getElementById('bossBattleLog');
            if (!logContainer) return;
            logContainer.innerHTML = worldBossData.battleLog.map(log => 
                `<div class="boss-battle-log-entry">${log}</div>`
            ).join('');
        }

        // 检查BOSS是否结束
        function checkBossEnd() {
            if (!worldBossData.isBossActive) return;
            
            if (Date.now() >= worldBossData.bossEndTime) {
                endBossFight(false);
            } else {
                setTimeout(checkBossEnd, 1000);
                if (isWorldBossUIVisible()) updateBossUI();
            }
        }

        // 结束BOSS战斗
        function endBossFight(isDefeated) {
            worldBossData.isBossActive = false;
            if (worldBossData.virtualAttackInterval) {
                if (typeof unregisterInterval === 'function') unregisterInterval(worldBossData.virtualAttackInterval);
                else clearInterval(worldBossData.virtualAttackInterval);
                worldBossData.virtualAttackInterval = null;
            }
            // 停止自动攻击（无论是否开启都清除定时器，防止泄漏）
            if (worldBossData.attackInterval) {
                if (typeof unregisterInterval === 'function') unregisterInterval(worldBossData.attackInterval);
                else clearInterval(worldBossData.attackInterval);
                worldBossData.attackInterval = null;
            }
            if (worldBossData.isAutoAttacking) {
                worldBossData.isAutoAttacking = false;
            }
             player.bossBattleSnapshot = null;
            // 发放奖励
            distributeRewards();
            
            // 添加战斗日志
            if (isDefeated) {
                addBossBattleLog(`BOSS ${worldBossData.bossName} 已被击败！`);
            } else {
                addBossBattleLog(`BOSS ${worldBossData.bossName} 时间结束！`);
            }
            
            // 保存数据
            saveWorldBossData();
            
            // 更新UI
            updateBossUI();
            
            // 记录开奖结果
            recordBossResult();
        }

        // 分发奖励
        function distributeRewards() {
            const playerRank = worldBossData.rankings.findIndex(p => p.name === "你") + 1;
            
            if (playerRank === 1) {
        // 第一名
        player.items.divineGem += 5;
        player.reincarnationCoin += 30000;
        addBossBattleLog("你获得了第1名奖励: 5个神级宝石 + 30000转生币");
        
        // 解锁成就
        if (!player.achievements.world_boss_1st) {
            player.achievements.world_boss_1st = true;
            player.gpsMultiplier += achievementRewards.world_boss_1st.gpsMultiplier;
            logAction(`成就达成：${achievementRewards.world_boss_1st.description}，GPS奖励 +${achievementRewards.world_boss_1st.gpsMultiplier * 100}%`, 'success');
        }
    } else if (playerRank >= 2 && playerRank <= 10) {
        // 第2-10名
        player.items.superiorGem += 5;
        player.reincarnationCoin += 10000;
        addBossBattleLog(`你获得了第${playerRank}名奖励: 5个极品宝石 + 10000转生币`);
        
        // 解锁成就
        if (!player.achievements.world_boss_top5) {
            player.achievements.world_boss_top5 = true;
            player.gpsMultiplier += achievementRewards.world_boss_top5.gpsMultiplier;
            logAction(`成就达成：${achievementRewards.world_boss_top5.description}，GPS奖励 +${achievementRewards.world_boss_top5.gpsMultiplier * 100}%`, 'success');
        }
    } else if (playerRank >= 11 && playerRank <= 30) {
        // 第11-30名
        player.items.advancedGem += 3;
        player.reincarnationCoin += 5000;
        addBossBattleLog(`你获得了第${playerRank}名奖励: 3个高级宝石 + 5000转生币`);
        
        // 解锁成就
        if (!player.achievements.world_boss_top10) {
            player.achievements.world_boss_top10 = true;
            player.gpsMultiplier += achievementRewards.world_boss_top10.gpsMultiplier;
            logAction(`成就达成：${achievementRewards.world_boss_top10.description}，GPS奖励 +${achievementRewards.world_boss_top10.gpsMultiplier * 100}%`, 'success');
        }
    } else {
        // 参与奖
        player.items.primaryGem += 1;
        player.reincarnationCoin += 100;
        addBossBattleLog("你获得了参与奖: 1个初级宝石 + 100转生币");
        
        // 解锁成就
        if (!player.achievements.world_boss_participant) {
            player.achievements.world_boss_participant = true;
            player.gpsMultiplier += achievementRewards.world_boss_participant.gpsMultiplier;
            logAction(`成就达成：${achievementRewards.world_boss_participant.description}，GPS奖励 +${achievementRewards.world_boss_participant.gpsMultiplier * 100}%`, 'success');
        }
    }
    
    // 更新显示
    updateDisplay();
    updateAchievementsDisplay();
}

        // 记录开奖结果
        function recordBossResult() {
            const top3 = worldBossData.rankings.slice(0, 3).map(p => p.name).join(", ");
            const result = `世界BOSS ${worldBossData.bossName} 结束，前三名: ${top3}`;
            if (!Array.isArray(player.lotteryResults)) player.lotteryResults = [];
            
            player.lotteryResults.unshift({
                time: new Date().toLocaleString(),
                result: result
            });
            
            if (player.lotteryResults.length > 20) {
                player.lotteryResults.pop();
            }
            
            // 更新彩票结果显示
            if (typeof updateLotteryResultsDisplay === 'function') updateLotteryResultsDisplay();
        }

       // 格式化数字显示
        function formatNumber(value) {
            return formatSci(value);
        }

        // 在游戏加载时初始化世界BOSS系统
        loadWorldBossData();
        updateOfficialSystemDisplay();
        updatePlayerClassNameDisplay();
     updateCompanionDisplay();
       updateItemDisplay();
 updateMysterySystemDisplay();
updateItemDisplay();
updateTraditionalLotteryDisplay();
if (typeof updateTotalBonuses === 'function') updateTotalBonuses();

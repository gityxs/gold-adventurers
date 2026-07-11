// 翅膀系统
// 翅膀品阶配置（WING_RARITY_ORDER 见脚本顶部 GAME_INVENTORY_MAX 旁）
function getWingInventoryCount() {
    return (player.wings && player.wings.inventory) ? player.wings.inventory.length : 0;
}
function getWingInventoryFreeSlots() {
    return Math.max(0, GAME_INVENTORY_MAX - getWingInventoryCount());
}
function ensureWingInventorySettings() {
    if (!player.wings) return;
    if (!player.wings.autoDecompose) player.wings.autoDecompose = { enabled: false, belowRarity: '劣质级' };
}
function syncWingInventoryCaps() {
    if (!player.wings) return;
    ensureWingInventorySettings();
    trimWingInventoryOverCap();
    runWingAutoDecompose(true);
}
function shouldWingAutoDecompose(wing) {
    if (!wing || !player.wings || !player.wings.autoDecompose) return false;
    if (wing.locked || wing.id === player.wings.equipped) return false;
    var th = WING_RARITY_ORDER.indexOf(player.wings.autoDecompose.belowRarity || '劣质级');
    var idx = WING_RARITY_ORDER.indexOf(wing.rarity);
    return (idx >= 0 ? idx : 0) <= (th >= 0 ? th : 0);
}
function runWingAutoDecompose(silent) {
    if (!player.wings) return 0;
    ensureWingInventorySettings();
    if (!player.wings.autoDecompose.enabled) return 0;
    var totalDan = 0, count = 0;
    player.wings.inventory = player.wings.inventory.filter(function (w) {
        if (!shouldWingAutoDecompose(w)) return true;
        totalDan += getRebornDanByRarity(w.rarity);
        count++;
        return false;
    });
    if (count > 0) {
        player.items.rebornDan = (player.items.rebornDan || 0) + totalDan;
        if (!silent) logAction('自动分解 ' + count + ' 个翅膀，获得洗髓丹 ' + totalDan, 'success');
        updateWingUI();
        updateItemDisplay();
    }
    return count;
}
function trimWingInventoryOverCap() {
    var over = getWingInventoryCount() - GAME_INVENTORY_MAX;
    if (over <= 0) return 0;
    var sorted = player.wings.inventory.slice().sort(function (a, b) {
        return WING_RARITY_ORDER.indexOf(a.rarity) - WING_RARITY_ORDER.indexOf(b.rarity);
    });
    var trimmed = 0, totalDan = 0;
    for (var i = 0; i < sorted.length && getWingInventoryCount() > GAME_INVENTORY_MAX; i++) {
        var w = sorted[i];
        if (w.locked || w.id === player.wings.equipped) continue;
        var idx = player.wings.inventory.findIndex(function (x) { return x.id === w.id; });
        if (idx >= 0) {
            totalDan += getRebornDanByRarity(w.rarity);
            player.wings.inventory.splice(idx, 1);
            trimmed++;
        }
    }
    if (trimmed > 0) {
        player.items.rebornDan = (player.items.rebornDan || 0) + totalDan;
        logAction('翅膀仓库超限，自动分解 ' + trimmed + ' 个低品质翅膀', 'info');
    }
    return trimmed;
}
function updateWingInventoryCountDisplay() {
    var el = document.getElementById('wingInventoryCountDisplay');
    if (el) el.textContent = getWingInventoryCount() + '/' + GAME_INVENTORY_MAX;
}
function initWingAutoDecomposeUI() {
    ensureWingInventorySettings();
    var sel = document.getElementById('wingAutoDecomposeRarity');
    var btn = document.getElementById('toggleWingAutoDecompose');
    if (sel) sel.value = player.wings.autoDecompose.belowRarity || '劣质级';
    if (btn) {
        btn.textContent = '自动分解：' + (player.wings.autoDecompose.enabled ? '开' : '关');
        btn.style.background = player.wings.autoDecompose.enabled ? '#4CAF50' : '#ff9800';
    }
}
function setWingAutoDecomposeRarity() {
    var sel = document.getElementById('wingAutoDecomposeRarity');
    if (!sel) return;
    ensureWingInventorySettings();
    player.wings.autoDecompose.belowRarity = sel.value;
}
function toggleWingAutoDecompose() {
    ensureWingInventorySettings();
    player.wings.autoDecompose.enabled = !player.wings.autoDecompose.enabled;
    initWingAutoDecomposeUI();
    if (player.wings.autoDecompose.enabled) runWingAutoDecompose(false);
}
function checkWingAutoDecompose() {
    if (player.wings && player.wings.autoDecompose && player.wings.autoDecompose.enabled) runWingAutoDecompose(true);
}
const wingRarities = {
    "劣质级": { healthRange: [0.01, 0.20], color: "gray", namePrefix: "破损的" },
    "普通级": { healthRange: [0.10, 0.50], color: "white", namePrefix: "普通的" },
    "优秀级": { healthRange: [0.15, 1.00], color: "green", namePrefix: "优秀的" },
    "精良级": { healthRange: [0.20, 2.00], color: "blue", namePrefix: "精良的" },
    "卓越级": { healthRange: [0.30, 3.00], color: "purple", namePrefix: "卓越的" },
    "史诗级": { healthRange: [0.50, 4.00], color: "gold", namePrefix: "史诗的" },
    "传说级": { healthRange: [1.00, 5.00], color: "orange", namePrefix: "传说的" },
    "神圣级": { healthRange: [1.00, 7.00], color: "pink", namePrefix: "神圣的" },
    "不朽级": { healthRange: [2.00, 10.00], color: "red", namePrefix: "不朽的" },
    "仙境级": { healthRange: [2.00, 14.00], color: "#00e5ff", namePrefix: "仙境的" },
    "神域级": { healthRange: [2.00, 19.60], color: "#7e57c2", namePrefix: "神域的" },
    "圣域级": { healthRange: [2.00, 27.44], color: "#ff6bd6", namePrefix: "圣域的" },
    "天域级": { healthRange: [2.00, 38.42], color: "#ffd54f", namePrefix: "天域的" },
    "无极级": { healthRange: [2.00, 53.78], color: "#69f0ae", namePrefix: "无极的" },
    "鸿蒙级": { healthRange: [2.00, 75.30], color: "#26c6da", namePrefix: "鸿蒙的" },
    "归墟级": { healthRange: [2.00, 105.41], color: "#ff1744", namePrefix: "归墟的" }
};

// 翅膀名字词库
const wingNameParts = {
    prefixes: ["暗影", "光明", "烈焰", "冰霜", "雷霆", "风暴", "星辰", "月光", "太阳", "虚空", "黑暗", "邪恶", "未来", "米白色"],
    suffixes: ["之翼", "翅膀", "羽翼", "飞翼", "光翼", "暗翼", "龙翼", "凤翼", "天使翼", "恶魔翼", "神翼", "魔翼", "背包", "飞艇"]
};

// 次元掉落概率配置
const wingDropRates = {
    2: { // 次元2
        "劣质级": 0.9,
        "普通级": 0.09,
        "优秀级": 0.01
    },
    3: { // 次元3
        "劣质级": 0.6,
        "普通级": 0.3,
        "优秀级": 0.07,
        "精良级": 0.02,
        "卓越级": 0.01
    },
    4: { // 次元4
        "优秀级": 0.56,
        "精良级": 0.3,
        "卓越级": 0.1,
        "史诗级": 0.03,
        "传说级": 0.01
    },
    5: { // 次元5
        "精良级": 0.5,
        "卓越级": 0.3,
        "史诗级": 0.14,
        "传说级": 0.05,
        "神圣级": 0.009,
        "不朽级": 0.001
    },
  6: { // 次元5
        "卓越级": 0.60,
        "史诗级": 0.20,
        "传说级": 0.10,
        "神圣级": 0.09,
        "不朽级": 0.01
    },
  7: { // 次元5
        "史诗级": 0.70,
        "传说级": 0.20,
        "神圣级": 0.09,
        "不朽级": 0.01
    },
  8: { // 次元5
        "传说级": 0.90,
        "神圣级": 0.09,
        "不朽级": 0.01
    },
  9: { // 次元9
        "不朽级": 0.70,
        "仙境级": 0.22,
        "神域级": 0.08
    },
  10: { // 次元10
        "不朽级": 0.50,
        "仙境级": 0.30,
        "神域级": 0.15,
        "圣域级": 0.05
    },
  11: { // 次元11
        "不朽级": 0.30,
        "仙境级": 0.28,
        "神域级": 0.20,
        "圣域级": 0.16,
        "天域级": 0.06
    },
  12: { // 次元12
        "不朽级": 0.18,
        "仙境级": 0.24,
        "神域级": 0.22,
        "圣域级": 0.18,
        "天域级": 0.14,
        "无极级": 0.04
    },
  13: { // 次元13
        "不朽级": 0.04,
        "仙境级": 0.16,
        "神域级": 0.18,
        "圣域级": 0.20,
        "天域级": 0.18,
        "无极级": 0.15,
        "鸿蒙级": 0.09
    },
  14: { // 次元14
        "不朽级": 0.02,
        "仙境级": 0.10,
        "神域级": 0.14,
        "圣域级": 0.18,
        "天域级": 0.22,
        "无极级": 0.16,
        "鸿蒙级": 0.12,
        "归墟级": 0.06
    },
  15: { // 次元15
        "仙境级": 0.05,
        "神域级": 0.10,
        "圣域级": 0.15,
        "天域级": 0.25,
        "无极级": 0.20,
        "鸿蒙级": 0.15,
        "归墟级": 0.10
    }
};
// 切换翅膀系统界面
function toggleWingSystem() {
    if (player.level.ascentionCounta < 1) {
        alert("需要达到轮回1转才能开启翅膀系统！");
        return;
    }
    const overlay = document.getElementById('wingSystemOverlay');
    const ui = document.getElementById('wingSystemUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        syncWingInventoryCaps();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        initWingAutoDecomposeUI();
        updateWingUI();
    }
}

// 生成随机翅膀名字
function generateWingName(rarity) {
    const prefix = wingNameParts.prefixes[Math.floor(Math.random() * wingNameParts.prefixes.length)];
    const suffix = wingNameParts.suffixes[Math.floor(Math.random() * wingNameParts.suffixes.length)];
    return wingRarities[rarity].namePrefix + prefix + suffix;
}

// 生成随机翅膀
function generateRandomWing(dimensionLevel) {
    if (dimensionLevel === 1) return null; // 次元1不掉落翅膀
    
    const dropRates = wingDropRates[dimensionLevel];
    if (!dropRates) return null;
    
    // 根据概率随机选择品阶
    let rand = Math.random();
    let cumulativeProb = 0;
    
    for (const [rarity, prob] of Object.entries(dropRates)) {
        cumulativeProb += prob;
        if (rand < cumulativeProb) {
            const rarityConfig = wingRarities[rarity];
            const healthBonus = Math.random() * (rarityConfig.healthRange[1] - rarityConfig.healthRange[0]) + rarityConfig.healthRange[0];
            
            return {
                id: 'wing_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: generateWingName(rarity),
                rarity: rarity,
                healthBonus: healthBonus,
                color: rarityConfig.color,
               locked: false
            };
        }
    }
    
    return null;
}
function toggleWingLock(wingId) {
    const wing = player.wings.inventory.find(w => w.id === wingId);
    if (wing) {
        wing.locked = !wing.locked;
        const action = wing.locked ? "锁定" : "解锁";
        logAction(`${action}了翅膀：${wing.name}`, 'success');
        updateWingUI();
    }
}
// 掉落翅膀（在世界地图怪物死亡时调用）
function dropWing() {
    if (!player.wings || !Array.isArray(player.wings.inventory)) return;
    const dimensionLevel = player.dimensionLevel;
    if (dimensionLevel === 1) return; // 次元1不掉落
    
    if (Math.random() < 0.001) { // 1%掉落几率
        const newWing = generateRandomWing(dimensionLevel);
        if (newWing) {
            if (getWingInventoryFreeSlots() <= 0) return;
            player.wings.inventory.push(newWing);
            runWingAutoDecompose(true);
            trimWingInventoryOverCap();
            logAction(`获得翅膀：${newWing.name}（${newWing.rarity}）`, 'success');
            safePanelUpdate(updateWingUI);
        }
    }
}
// 装备翅膀
function equipWing(wingId) {
    const wing = player.wings.inventory.find(w => w.id === wingId);
    if (wing) {
        player.wings.equipped = wingId;
        logAction(`装备了翅膀：${wing.name}`, 'success');
        updateWingUI();
        updatePlayerBattleStats(); // 更新玩家属性
    }
}

// 卸下翅膀
function unequipWing() {
    player.wings.equipped = null;
    logAction("已卸下翅膀", 'info');
    updateWingUI();
    updatePlayerBattleStats();
}
// 当前筛选条件
let currentWingFilter = 'all';

// 筛选翅膀
function filterWings() {
    currentWingFilter = document.getElementById('wingRarityFilter').value;
    updateWingUI();
}

// 一键分解当前筛选条件下的所有翅膀（不包括已装备的）
function decomposeAllFilteredWings() {
    // 获取当前筛选条件下的翅膀
    let wingsToDecompose = [];
    if (currentWingFilter === 'all') {
        wingsToDecompose = player.wings.inventory.filter(wing => 
            wing.id !== player.wings.equipped && !wing.locked
        );
    } else {
        wingsToDecompose = player.wings.inventory.filter(wing => 
            wing.rarity === currentWingFilter && wing.id !== player.wings.equipped && !wing.locked
        );
    }
    
    if (wingsToDecompose.length === 0) {
        logAction("没有可分解的翅膀", "info");
        return;
    }
    
    // 计算总奖励
    let totalRebornDan = 0;
    wingsToDecompose.forEach(wing => {
        totalRebornDan += getRebornDanByRarity(wing.rarity);
    });
    
    // 显示确认对话框
    showCustomConfirm(`确定要分解${wingsToDecompose.length}个${currentWingFilter === 'all' ? '' : currentWingFilter}翅膀吗？将获得${totalRebornDan}个洗髓丹`, (confirmed) => {
        if (confirmed) {
            // 执行分解
            wingsToDecompose.forEach(wing => {
                const wingIndex = player.wings.inventory.findIndex(w => w.id === wing.id);
                if (wingIndex !== -1) {
                    player.wings.inventory.splice(wingIndex, 1);
                }
            });
            
            // 添加奖励
            player.items.rebornDan = (player.items.rebornDan || 0) + totalRebornDan;
            
            logAction(`一键分解了${wingsToDecompose.length}个翅膀，获得${totalRebornDan}个洗髓丹`, 'success');
            updateWingUI();
            updateItemDisplay();
        }
    });
}

// 根据翅膀品质获取洗髓丹数量
function getRebornDanByRarity(rarity) {
    switch(rarity) {
        case '劣质级': return 1;
        case '普通级': return 1;
        case '优秀级': return 1;
        case '精良级': return 2;
        case '卓越级': return 3;
        case '史诗级': return 5;
        case '传说级': return 10;
        case '神圣级': return 25;
        case '不朽级': return 50;
        // 新增高阶品质：整体下调，避免所有品质叠加后产出过快
        case '仙境级': return 15;
        case '神域级': return 20;
        case '圣域级': return 30;
        case '天域级': return 40;
        case '无极级': return 55;
        case '鸿蒙级': return 75;
        case '归墟级': return 105;
        default: return 1;
    }
}
// 分解翅膀
function decomposeWing(wingId) {
    const wingIndex = player.wings.inventory.findIndex(w => w.id === wingId);
    if (wingIndex === -1) return;
    
    const wing = player.wings.inventory[wingIndex];
    
    if (wing.locked) {
        logAction("翅膀已锁定，无法分解", "error");
        return;
    }
        
        // 根据品阶获得不同数量的洗髓丹（与一键分解保持一致）
        let rebornDanReward = getRebornDanByRarity(wing.rarity);
        
        player.items.rebornDan = (player.items.rebornDan || 0) + rebornDanReward;
        
        // 如果分解的是当前装备的翅膀，先卸下
        if (player.wings.equipped === wingId) {
            player.wings.equipped = null;
        }
        
        player.wings.inventory.splice(wingIndex, 1);
        
        logAction(`分解了翅膀：${wing.name}，获得${rebornDanReward}个洗髓丹`, 'success');
        updateWingUI();
        updatePlayerBattleStats();
        updateItemDisplay();
    }


// 升级翅膀等级
function upgradeWing() {
    const cost = player.wings.upgradeCost;
    
    if ((player.items.chiban1 || 0) >= cost) {
        player.items.chiban1 -= cost;
        player.wings.level++;
        player.wings.upgradeCost += 5; // 每次升级增加5个消耗
        
        logAction(`翅膀等级提升至 ${player.wings.level}级，属性加成提升至 ${player.wings.level * 100}%`, 'success');
        updateWingUI();
        updatePlayerBattleStats();
        updateItemDisplay();
    } else {
        logAction(`黑龙王翅膀不足！需要${cost}个`, 'error');
    }
}

// 更新翅膀界面显示
function updateWingUI() {
    updateWingInventoryCountDisplay();
    // 更新当前装备的翅膀信息
    const currentWingInfo = document.getElementById('currentWingInfo');
    if (player.wings.equipped) {
        const equippedWing = player.wings.inventory.find(w => w.id === player.wings.equipped);
        if (equippedWing) {
            currentWingInfo.innerHTML = `
                <div style="color: ${equippedWing.color}">
                    ${equippedWing.name}（${equippedWing.rarity}）
                </div>
                <div>生命加成: +${(equippedWing.healthBonus * 100).toFixed(1)}%</div>
                <div>总加成: +${(equippedWing.healthBonus * player.wings.level * 100).toFixed(1)}%</div>
                <button onclick="unequipWing()" style="margin-top: 5px;">卸下</button>
            `;
        }
    } else {
        currentWingInfo.innerHTML = '无装备的翅膀';
    }
    
    // 更新翅膀等级信息
    document.getElementById('wingLevel').textContent = player.wings.level;
    document.getElementById('wingBonus').textContent = (player.wings.level * 100) + '%';
    document.getElementById('wingUpgradeCost').textContent = player.wings.upgradeCost;
    
    // 更新翅膀仓库（根据筛选条件）
    const wingInventory = document.getElementById('wingInventory');
    wingInventory.innerHTML = '';
    
    let filteredWings = player.wings.inventory;
    if (currentWingFilter !== 'all') {
        filteredWings = player.wings.inventory.filter(wing => wing.rarity === currentWingFilter);
    }
    
    if (filteredWings.length === 0) {
        wingInventory.innerHTML = '<div style="text-align: center; color: #888;">暂无翅膀</div>';
    } else {
         filteredWings.forEach(wing => {
        const isEquipped = player.wings.equipped === wing.id;
        const wingElement = document.createElement('div');
        wingElement.style.cssText = `
            padding: 10px;
            margin: 0;
            background: linear-gradient(180deg, rgba(68,68,68,0.92) 0%, rgba(30,30,30,0.92) 100%);
            border-radius: 12px;
            border: 1px solid rgba(255,215,0,0.16);
            border-left: 4px solid ${wing.color};
            ${isEquipped ? 'box-shadow: 0 0 0 2px rgba(255,215,0,0.55), 0 10px 24px rgba(0,0,0,0.35);' : 'box-shadow: 0 10px 24px rgba(0,0,0,0.25);'}
            ${wing.locked ? 'border-right: 4px solid rgba(244,67,54,0.65);' : ''}
            display: flex;
            flex-direction: column;
            gap: 6px;
        `;
        
        wingElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                <div style="min-width: 0;">
                    <div style="color: ${wing.color}; font-weight: bold; font-size: 13px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${wing.name}（${wing.rarity}）
                    </div>
                    <div style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 4px;">
                        生命加成: +${(wing.healthBonus * 100).toFixed(1)}%
                    </div>
                </div>
                <div style="flex: 0 0 auto;">
                    <button onclick="toggleWingLock('${wing.id}')" style="background: ${wing.locked ? '#f44336' : '#4CAF50'}; color: white; border: none; padding: 3px 8px; border-radius: 8px; cursor: pointer; font-size: 12px; box-shadow: 0 10px 18px rgba(0,0,0,0.25);">
                        ${wing.locked ? '已锁定' : '未锁定'}
                    </button>
                </div>
            </div>
            <div style="color: gold; font-weight: 700; font-size: 12px;">
                总加成: +${(wing.healthBonus * player.wings.level * 100).toFixed(1)}%
            </div>
            <div style="display:flex; gap: 8px; margin-top: 2px;">
                ${!isEquipped ? `<button onclick="equipWing('${wing.id}')" style="background: linear-gradient(180deg,#4e8cff,#2f6ad8); color:white; border:none; padding: 6px 10px; border-radius: 10px; cursor:pointer; font-size: 12px;">装备</button>` : '<span style="color: gold; align-self:center; font-weight:700;">已装备</span>'}
                <button onclick="decomposeWing('${wing.id}')" style="background: linear-gradient(180deg,#ff5252,#d32f2f); color:white; border:none; padding: 6px 10px; border-radius: 10px; cursor:pointer; font-size: 12px; ${wing.locked ? 'opacity:0.55; cursor:not-allowed;' : ''}" ${wing.locked ? 'disabled' : ''}>分解</button>
            </div>
        `;
        
        wingInventory.appendChild(wingElement);
    });
    }
}

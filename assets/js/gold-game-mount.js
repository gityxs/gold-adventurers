// 坐骑系统
// 坐骑配置
const mountRarities = {
    "劣质级": { 
        name: "劣质", 
        color: "gray", 
        statRange: { health: [0.01, 0.10], attack: [0.01, 0.10], critDamage: [0.01, 0.10] },
        statChance: 0.2 // 20%几率获得额外词条
    },
    "普通级": { 
        name: "普通", 
        color: "white", 
        statRange: { health: [0.05, 0.20], attack: [0.05, 0.20], critDamage: [0.05, 0.20] },
        statChance: 0.3
    },
    "优秀级": { 
        name: "优秀", 
        color: "green", 
        statRange: { health: [0.10, 0.30], attack: [0.10, 0.30], critDamage: [0.10, 0.30] },
        statChance: 0.4
    },
    "精良级": { 
        name: "精良", 
        color: "blue", 
        statRange: { health: [0.20, 0.40], attack: [0.20, 0.40], critDamage: [0.20, 0.40] },
        statChance: 0.5
    },
    "卓越级": { 
        name: "卓越", 
        color: "purple", 
        statRange: { health: [0.30, 0.50], attack: [0.30, 0.50], critDamage: [0.30, 0.50] },
        statChance: 0.6
    },
    "史诗级": { 
        name: "史诗", 
        color: "gold", 
        statRange: { health: [0.40, 0.80], attack: [0.40, 0.80], critDamage: [0.40, 0.80] },
        statChance: 0.7
    },
    "传说级": { 
        name: "传说", 
        color: "orange", 
        statRange: { health: [0.50, 1.00], attack: [0.50, 1.00], critDamage: [0.50, 1.00] },
        statChance: 0.8
    },
    "神圣级": { 
        name: "神圣", 
        color: "pink", 
        statRange: { health: [1.00, 2.00], attack: [1.00, 2.00], critDamage: [1.00, 2.00] },
        statChance: 0.9
    },
    "不朽级": { 
        name: "不朽", 
        color: "red", 
        statRange: { health: [2.00, 3.00], attack: [2.00, 3.00], critDamage: [2.00, 3.00] },
        statChance: 1.0
    },
    // 新增：更高级坐骑品质（下限与不朽一致，上限按每档+30%）
    "仙境级": { 
        name: "仙境", 
        color: "#00e5ff", 
        statRange: { health: [2.00, 3.90], attack: [2.00, 3.90], critDamage: [2.00, 3.90] },
        statChance: 1.0
    },
    "神域级": { 
        name: "神域", 
        color: "#7e57c2", 
        statRange: { health: [2.00, 5.07], attack: [2.00, 5.07], critDamage: [2.00, 5.07] },
        statChance: 1.0
    },
    "圣域级": { 
        name: "圣域", 
        color: "#ff6bd6", 
        statRange: { health: [2.00, 6.59], attack: [2.00, 6.59], critDamage: [2.00, 6.59] },
        statChance: 1.0
    },
    "天域级": { 
        name: "天域", 
        color: "#ffd54f", 
        statRange: { health: [2.00, 8.57], attack: [2.00, 8.57], critDamage: [2.00, 8.57] },
        statChance: 1.0
    },
    "无极级": { 
        name: "无极", 
        color: "#69f0ae", 
        statRange: { health: [2.00, 11.15], attack: [2.00, 11.15], critDamage: [2.00, 11.15] },
        statChance: 1.0
    },
    "鸿蒙级": { 
        name: "鸿蒙", 
        color: "#26c6da", 
        statRange: { health: [2.00, 14.49], attack: [2.00, 14.49], critDamage: [2.00, 14.49] },
        statChance: 1.0
    },
    "归墟级": { 
        name: "归墟", 
        color: "#ff1744", 
        statRange: { health: [2.00, 18.84], attack: [2.00, 18.84], critDamage: [2.00, 18.84] },
        statChance: 1.0
    }
};

// 坐骑名字部件
const mountNameParts = {
    prefixes: ["暗影", "光明", "烈焰", "冰霜", "雷霆", "风暴", "星辰", "月光", "太阳", "虚空", "黑暗", "邪恶", "未来", "米白色"],
    types: ["战马", "龙驹", "麒麟", "狮鹫", "猛虎", "巨狼", "神鹰", "灵狐", "玄龟", "凤凰", "独角兽", "梦魇", "地狱", "天界"],
    suffixes: ["之王", "之后", "之魂", "之灵", "之怒", "之翼", "之爪", "之牙", "之心", "之眼"]
};

// 坐骑掉落概率配置
const mountDropRates = {
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
  6: { // 次元6
        "卓越级": 0.40,
        "史诗级": 0.30,
        "传说级": 0.20,
        "神圣级": 0.09,
        "不朽级": 0.01
    },
  7: { // 次元7
        "史诗级": 0.70,
        "传说级": 0.20,
        "神圣级": 0.09,
        "不朽级": 0.01
    },
  8: { // 次元8
        "传说级": 0.90,
        "神圣级": 0.09,
        "不朽级": 0.01
    },
    9: { // 次元9
        "不朽级": 0.70,
        "仙境级": 0.22,
        "神域级": 0.07,
        "圣域级": 0.01
    },
    10: { // 次元10
        "不朽级": 0.55,
        "仙境级": 0.25,
        "神域级": 0.12,
        "圣域级": 0.07,
        "天域级": 0.01
    },
    11: { // 次元11
        "不朽级": 0.35,
        "仙境级": 0.20,
        "神域级": 0.18,
        "圣域级": 0.17,
        "天域级": 0.08
    },
    12: { // 次元12
        "不朽级": 0.20,
        "仙境级": 0.16,
        "神域级": 0.18,
        "圣域级": 0.18,
        "天域级": 0.16,
        "无极级": 0.12
    },
    13: { // 次元13
        "不朽级": 0.10,
        "仙境级": 0.12,
        "神域级": 0.16,
        "圣域级": 0.18,
        "天域级": 0.18,
        "无极级": 0.16,
        "鸿蒙级": 0.10
    },
    14: { // 次元14
        "不朽级": 0.06,
        "仙境级": 0.08,
        "神域级": 0.12,
        "圣域级": 0.16,
        "天域级": 0.18,
        "无极级": 0.18,
        "鸿蒙级": 0.14,
        "归墟级": 0.08
    },
    15: { // 次元15
        "仙境级": 0.03,
        "神域级": 0.08,
        "圣域级": 0.10,
        "天域级": 0.18,
        "无极级": 0.22,
        "鸿蒙级": 0.20,
        "归墟级": 0.19
    }
};

// MOUNT_RARITY_ORDER 见脚本顶部 GAME_INVENTORY_MAX 旁
function getMountInventoryCount() {
    return (player.mounts && player.mounts.inventory) ? player.mounts.inventory.length : 0;
}
function getMountInventoryFreeSlots() {
    return Math.max(0, GAME_INVENTORY_MAX - getMountInventoryCount());
}
function getStarCoinsByMountRarity(rarity) {
    switch (rarity) {
        case "劣质级": return 10; case "普通级": return 20; case "优秀级": return 30; case "精良级": return 50;
        case "卓越级": return 100; case "史诗级": return 250; case "传说级": return 500; case "神圣级": return 1000;
        case "不朽级": return 2000; case "仙境级": return 2600; case "神域级": return 3380; case "圣域级": return 4394;
        case "天域级": return 5712; case "无极级": return 7426; case "鸿蒙级": return 9654; case "归墟级": return 12550;
        default: return 10;
    }
}
function ensureMountInventorySettings() {
    if (!player.mounts) return;
    if (!player.mounts.autoDecompose) player.mounts.autoDecompose = { enabled: false, belowRarity: '劣质级' };
}
function shouldMountAutoDecompose(mount) {
    if (!mount || !player.mounts || !player.mounts.autoDecompose) return false;
    if (mount.locked || mount.id === player.mounts.equipped) return false;
    var th = MOUNT_RARITY_ORDER.indexOf(player.mounts.autoDecompose.belowRarity || '劣质级');
    var idx = MOUNT_RARITY_ORDER.indexOf(mount.rarity);
    return (idx >= 0 ? idx : 0) <= (th >= 0 ? th : 0);
}
function runMountAutoDecompose(silent) {
    ensureMountInventorySettings();
    if (!player.mounts.autoDecompose.enabled) return 0;
    var totalCoins = 0, count = 0;
    player.mounts.inventory = player.mounts.inventory.filter(function (m) {
        if (!shouldMountAutoDecompose(m)) return true;
        totalCoins += getStarCoinsByMountRarity(m.rarity);
        count++;
        return false;
    });
    if (count > 0) {
        player.nightClub.starCoins = (player.nightClub.starCoins || 0) + totalCoins;
        if (!silent) logAction('自动分解 ' + count + ' 个坐骑，获得星币 ' + totalCoins, 'success');
        updateMountUI();
        updateDisplay();
    }
    return count;
}
function trimMountInventoryOverCap() {
    var over = getMountInventoryCount() - GAME_INVENTORY_MAX;
    if (over <= 0) return 0;
    var sorted = player.mounts.inventory.slice().sort(function (a, b) {
        return MOUNT_RARITY_ORDER.indexOf(a.rarity) - MOUNT_RARITY_ORDER.indexOf(b.rarity);
    });
    var trimmed = 0, totalCoins = 0;
    for (var i = 0; i < sorted.length && getMountInventoryCount() > GAME_INVENTORY_MAX; i++) {
        var m = sorted[i];
        if (m.locked || m.id === player.mounts.equipped) continue;
        var idx = player.mounts.inventory.findIndex(function (x) { return x.id === m.id; });
        if (idx >= 0) {
            totalCoins += getStarCoinsByMountRarity(m.rarity);
            player.mounts.inventory.splice(idx, 1);
            trimmed++;
        }
    }
    if (trimmed > 0) {
        player.nightClub.starCoins = (player.nightClub.starCoins || 0) + totalCoins;
        logAction('坐骑仓库超限，自动分解 ' + trimmed + ' 个低品质坐骑', 'info');
    }
    return trimmed;
}
function updateMountInventoryCountDisplay() {
    var el = document.getElementById('mountInventoryCountDisplay');
    if (el) el.textContent = getMountInventoryCount() + '/' + GAME_INVENTORY_MAX;
}
function initMountAutoDecomposeUI() {
    ensureMountInventorySettings();
    var sel = document.getElementById('mountAutoDecomposeRarity');
    var btn = document.getElementById('toggleMountAutoDecompose');
    if (sel) sel.value = player.mounts.autoDecompose.belowRarity || '劣质级';
    if (btn) {
        btn.textContent = '自动分解：' + (player.mounts.autoDecompose.enabled ? '开' : '关');
        btn.style.background = player.mounts.autoDecompose.enabled ? '#4CAF50' : '#ff9800';
    }
}
function setMountAutoDecomposeRarity() {
    var sel = document.getElementById('mountAutoDecomposeRarity');
    if (!sel) return;
    ensureMountInventorySettings();
    player.mounts.autoDecompose.belowRarity = sel.value;
}
function toggleMountAutoDecompose() {
    ensureMountInventorySettings();
    player.mounts.autoDecompose.enabled = !player.mounts.autoDecompose.enabled;
    initMountAutoDecomposeUI();
    if (player.mounts.autoDecompose.enabled) runMountAutoDecompose(false);
}
function checkMountAutoDecompose() {
    if (player.mounts && player.mounts.autoDecompose && player.mounts.autoDecompose.enabled) runMountAutoDecompose(true);
}
// 初始化玩家坐骑数据
function initMountData() {
    if (!player.mounts) {
        player.mounts = {
            inventory: [],
            equipped: null,
            level: 1,
            upgradeCost: 5,
            autoDecompose: { enabled: false, belowRarity: '劣质级' }
        };
    }
    ensureMountInventorySettings();
    trimMountInventoryOverCap();
    runMountAutoDecompose(true);
    if (player.items.zuoqi1 === undefined) {
        player.items.zuoqi1 = 0;
    }
}

// 切换坐骑系统界面
function toggleMountSystem() {
   if (player.level.ascentionCounta < 2) {
        alert("需要达到轮回2转才能开启坐骑系统！");
        return;
    }
    const overlay = document.getElementById("mountSystemOverlay");
    const ui = document.getElementById("mountSystemUI");
    
    if (ui.style.display === "block") {
        ui.style.display = "none";
        overlay.style.display = "none";
    } else {
        initMountData();
        ui.style.display = "block";
        overlay.style.display = "block";
        initMountAutoDecomposeUI();
        updateMountUI();
    }
}

// 生成随机坐骑名字
function generateMountName() {
    const prefix = mountNameParts.prefixes[Math.floor(Math.random() * mountNameParts.prefixes.length)];
    const type = mountNameParts.types[Math.floor(Math.random() * mountNameParts.types.length)];
    const suffix = mountNameParts.suffixes[Math.floor(Math.random() * mountNameParts.suffixes.length)];
    return prefix + type + suffix;
}

// 生成随机坐骑
function generateRandomMount(dimensionLevel) {
    if (dimensionLevel < 3) return null; // 次元3以下不掉落坐骑
    
    const dropRates = mountDropRates[dimensionLevel];
    if (!dropRates) return null;
    
    // 根据概率随机选择品阶
    let rand = Math.random();
    let cumulativeProb = 0;
    let selectedRarity = null;
    
    for (const [rarity, prob] of Object.entries(dropRates)) {
        cumulativeProb += prob;
        if (rand < cumulativeProb) {
            selectedRarity = rarity;
            break;
        }
    }
    
    if (!selectedRarity) return null;
    
    const rarityConfig = mountRarities[selectedRarity];
    const stats = {};
    let statCount = 1; // 至少1个词条
    
    // 随机决定词条数量(1-5)
    for (let i = 0; i < 4; i++) {
        if (Math.random() < rarityConfig.statChance) {
            statCount++;
        }
    }
    
    // 随机选择词条类型
    const statTypes = ["health", "attack", "critDamage"];
    const selectedStats = [];
    
    for (let i = 0; i < statCount; i++) {
        const statType = statTypes[Math.floor(Math.random() * statTypes.length)];
        if (!selectedStats.includes(statType)) {
            selectedStats.push(statType);
            
            // 生成随机属性值
            const range = rarityConfig.statRange[statType];
            stats[statType] = Math.random() * (range[1] - range[0]) + range[0];
        }
    }
    
    return {
        id: 'mount_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: generateMountName(),
        rarity: selectedRarity,
        stats: stats,
        color: rarityConfig.color,
       locked: false
    };
}
function toggleMountLock(mountId) {
    const mount = player.mounts.inventory.find(m => m.id === mountId);
    if (mount) {
        mount.locked = !mount.locked;
        const action = mount.locked ? "锁定" : "解锁";
        logAction(`${action}了坐骑：${mount.name}`, 'success');
        updateMountUI();
    }
}
// 掉落坐骑（在怪物死亡时调用）
function dropMount() {
    if (!player.mounts || !Array.isArray(player.mounts.inventory)) return;
    const dimensionLevel = player.dimensionLevel;
    if (dimensionLevel < 3) return; // 次元3以下不掉落
    
    if (Math.random() < 0.001) { // 0.1%掉落几率
        const newMount = generateRandomMount(dimensionLevel);
        if (newMount) {
            if (getMountInventoryFreeSlots() <= 0) return;
            player.mounts.inventory.push(newMount);
            runMountAutoDecompose(true);
            trimMountInventoryOverCap();
            logAction(`获得坐骑：${newMount.name}（${newMount.rarity}）`, 'success');
            safePanelUpdate(updateMountUI);
        }
    }
}

// 装备坐骑
function equipMount(mountId) {
    const mount = player.mounts.inventory.find(m => m.id === mountId);
    if (mount) {
        player.mounts.equipped = mountId;
        logAction(`装备了坐骑：${mount.name}`, 'success');
        updateMountUI();
        updatePlayerBattleStats(); // 更新玩家属性
    }
}

// 卸下坐骑
function unequipMount() {
    player.mounts.equipped = null;
    logAction("已卸下坐骑", 'info');
    updateMountUI();
    updatePlayerBattleStats();
}

// 分解坐骑
function decomposeMount(mountId) {
   const mount = player.mounts.inventory.find(m => m.id === mountId);
    if (!mount) return;
    
    if (mount.locked) {
        logAction("坐骑已锁定，无法分解", "error");
        return;
    }

    const mountIndex = player.mounts.inventory.findIndex(m => m.id === mountId);
    if (mountIndex !== -1) {
        const mount = player.mounts.inventory[mountIndex];
        
        let starCoinsReward = getStarCoinsByMountRarity(mount.rarity);
        
        player.nightClub.starCoins += starCoinsReward;
        
        // 如果分解的是当前装备的坐骑，先卸下
        if (player.mounts.equipped === mountId) {
            player.mounts.equipped = null;
        }
        
        player.mounts.inventory.splice(mountIndex, 1);
        
        logAction(`分解了坐骑：${mount.name}，获得${starCoinsReward}星币`, 'success');
        updateMountUI();
        updatePlayerBattleStats();
        updateDisplay();
    }
}

// 升级坐骑等级
function upgradeMount() {
    const cost = player.mounts.upgradeCost;
    
    if (player.items.zuoqi1 >= cost) {
        player.items.zuoqi1 -= cost;
        player.mounts.level++;
        player.mounts.upgradeCost += 5; // 每次升级增加5个消耗
        
        logAction(`坐骑等级提升至 ${player.mounts.level}级，属性加成提升至 ${player.mounts.level * 100}%`, 'success');
        updateMountUI();
        updatePlayerBattleStats();
        updateItemDisplay();
    } else {
        logAction(`远古圣兽精魄不足！需要${cost}个`, 'error');
    }
}

// 更新坐骑界面显示
function updateMountUI() {
    updateMountInventoryCountDisplay();
    // 更新当前装备的坐骑信息
    const currentMountInfo = document.getElementById("currentMountInfo");
    if (player.mounts.equipped) {
        const equippedMount = player.mounts.inventory.find(m => m.id === player.mounts.equipped);
        if (equippedMount) {
            let statsHTML = "";
            for (const [stat, value] of Object.entries(equippedMount.stats)) {
                const statName = {
                    "health": "生命",
                    "attack": "攻击",
                    "critDamage": "爆伤"
                }[stat];
                statsHTML += `<div>${statName}加成: +${(value * 100).toFixed(1)}%</div>`;
            }
            
            currentMountInfo.innerHTML = `
                <div style="color: ${equippedMount.color}">
                    ${equippedMount.name}（${equippedMount.rarity}）
                </div>
                ${statsHTML}
                <div>总加成: +${(calculateMountBonus(equippedMount) * 100).toFixed(1)}%</div>
                <button onclick="unequipMount()" style="margin-top: 5px;">卸下</button>
            `;
        }
    } else {
        currentMountInfo.innerHTML = '无装备的坐骑';
    }
    
    // 更新坐骑等级信息
    document.getElementById("mountLevel").textContent = player.mounts.level;
    document.getElementById("mountBonus").textContent = (player.mounts.level * 100) + '%';
    document.getElementById("mountUpgradeCost").textContent = player.mounts.upgradeCost;
    
    // 更新坐骑仓库
    const mountInventory = document.getElementById("mountInventory");
    mountInventory.innerHTML = '';
    
    // 获取当前筛选条件
    const filter = document.getElementById("mountRarityFilter").value;
    let filteredMounts = player.mounts.inventory;
    if (filter !== "all") {
        filteredMounts = player.mounts.inventory.filter(mount => mount.rarity === filter);
    }
    
    if (filteredMounts.length === 0) {
        mountInventory.innerHTML = '<div style="text-align: center; color: #888;">暂无坐骑</div>';
    } else {
        filteredMounts.forEach(mount => {
        const isEquipped = player.mounts.equipped === mount.id;
        const mountElement = document.createElement("div");
        mountElement.style.cssText = `
            padding: 10px;
            margin: 0;
            background: linear-gradient(180deg, rgba(68,68,68,0.92) 0%, rgba(30,30,30,0.92) 100%);
            border-radius: 12px;
            border: 1px solid rgba(255,215,0,0.16);
            border-left: 4px solid ${mount.color};
            ${isEquipped ? 'box-shadow: 0 0 0 2px rgba(255,215,0,0.55), 0 10px 24px rgba(0,0,0,0.35);' : 'box-shadow: 0 10px 24px rgba(0,0,0,0.25);'}
            ${mount.locked ? 'border-right: 4px solid rgba(244,67,54,0.65);' : ''}
            display: flex;
            flex-direction: column;
            gap: 6px;
        `;
        
        let statsHTML = "";
        for (const [stat, value] of Object.entries(mount.stats)) {
            const statName = {
                "health": "生命",
                "attack": "攻击",
                "critDamage": "爆伤"
            }[stat];
            statsHTML += `<div style="color: rgba(255,255,255,0.86); font-size: 12px;">${statName}: +${(value * 100).toFixed(1)}%</div>`;
        }
        
        mountElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                <div style="min-width: 0;">
                    <div style="color: ${mount.color}; font-weight: bold; font-size: 13px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${mount.name}（${mount.rarity}）
                    </div>
                    <div style="margin-top: 4px;">
                        ${statsHTML}
                    </div>
                </div>
                <div style="flex: 0 0 auto;">
                    <button onclick="toggleMountLock('${mount.id}')" style="background: ${mount.locked ? '#f44336' : '#4CAF50'}; color: white; border: none; padding: 3px 8px; border-radius: 8px; cursor: pointer; font-size: 12px; box-shadow: 0 10px 18px rgba(0,0,0,0.25);">
                        ${mount.locked ? '已锁定' : '未锁定'}
                    </button>
                </div>
            </div>
            <div style="color: gold; font-weight: 700; font-size: 12px; margin-top: 6px;">
                总加成: +${(calculateMountBonus(mount) * 100).toFixed(1)}%
            </div>
            <div style="display:flex; gap: 8px; margin-top: 2px;">
                ${!isEquipped ? `<button onclick="equipMount('${mount.id}')" style="background: linear-gradient(180deg,#4e8cff,#2f6ad8); color:white; border:none; padding: 6px 10px; border-radius: 10px; cursor:pointer; font-size: 12px;">装备</button>` : '<span style="color: gold; align-self:center; font-weight:700;">已装备</span>'}
                <button onclick="decomposeMount('${mount.id}')" style="background: linear-gradient(180deg,#ff5252,#d32f2f); color:white; border:none; padding: 6px 10px; border-radius: 10px; cursor:pointer; font-size: 12px; ${mount.locked ? 'opacity:0.55; cursor:not-allowed;' : ''}" ${mount.locked ? 'disabled' : ''}>分解</button>
            </div>
        `;
        
        mountInventory.appendChild(mountElement);
    });
    }
}

// 计算坐骑总加成
function calculateMountBonus(mount) {
    let totalBonus = 0;
    for (const value of Object.values(mount.stats)) {
        totalBonus += value;
    }
    return totalBonus * player.mounts.level;
}

// 筛选坐骑
function filterMounts() {
    updateMountUI();
}

// 一键分解当前筛选条件下的所有坐骑（不包括已装备的）
function decomposeAllFilteredMounts() {
    // 获取当前筛选条件下的坐骑
    const filter = document.getElementById("mountRarityFilter").value;
    let mountsToDecompose = [];
    
    if (filter === "all") {
        mountsToDecompose = player.mounts.inventory.filter(mount => 
            mount.id !== player.mounts.equipped && !mount.locked
        );
    } else {
        mountsToDecompose = player.mounts.inventory.filter(mount => 
            mount.rarity === filter && mount.id !== player.mounts.equipped && !mount.locked
        );
    }
    
    if (mountsToDecompose.length === 0) {
        logAction("没有可分解的坐骑", "info");
        return;
    }
    
    // 计算总奖励
    let totalStarCoins = 0;
    mountsToDecompose.forEach(mount => {
        let reward = 0;
        switch(mount.rarity) {
           case "劣质级": reward = 10; break;
            case "普通级": reward = 20; break;
            case "优秀级": reward = 30; break;
            case "精良级": reward = 50; break;
            case "卓越级": reward = 100; break;
            case "史诗级": reward = 250; break;
            case "传说级": reward = 500; break;
            case "神圣级": reward = 1000; break;
            case "不朽级": reward = 2000; break;
            case "仙境级": reward = 2600; break;
            case "神域级": reward = 3380; break;
            case "圣域级": reward = 4394; break;
            case "天域级": reward = 5712; break;
            case "无极级": reward = 7426; break;
            case "鸿蒙级": reward = 9654; break;
            case "归墟级": reward = 12550; break;
        }
        totalStarCoins += reward;
    });
    
    // 显示确认对话框
    showCustomConfirm(`确定要分解${mountsToDecompose.length}个${filter === "all" ? "" : filter}坐骑吗？将获得${totalStarCoins}星币`, (confirmed) => {
        if (confirmed) {
            // 执行分解
            mountsToDecompose.forEach(mount => {
                const mountIndex = player.mounts.inventory.findIndex(m => m.id === mount.id);
                if (mountIndex !== -1) {
                    player.mounts.inventory.splice(mountIndex, 1);
                }
            });
            
            // 添加奖励
            player.nightClub.starCoins += totalStarCoins;
            
            logAction(`一键分解了${mountsToDecompose.length}个坐骑，获得${totalStarCoins}星币`, 'success');
            updateMountUI();
            updateDisplay();
        }
    });
}


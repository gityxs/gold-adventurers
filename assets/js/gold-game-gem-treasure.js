// 宝石与藏宝图
// 宝石系统初始化
function initGemSystem() {
    if (!player.gems) {
        player.gems = {
            red: {1: 0},   // 初始化为0个1级红宝石
            blue: {1: 0},   // 初始化为0个1级蓝宝石
            black: {1: 0}  // 初始化为0个1级黑宝石

        };
    }
}

// 切换宝石系统界面
function toggleGemSystem() {
   if (player.reincarnationCount < 800) {
        alert("需要达到800转才能开启宝石系统！");
        return;
    }
    const overlay = document.getElementById('gemSystemOverlay');
    const ui = document.getElementById('gemSystemUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        initGemSystem();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateGemUI();
    }
}

// 更新宝石界面
function updateGemUI() {
    updateGemInventory();
    updateGemBonuses();
    // 更新宝石商店显示的暗物质数量
    var dmEl = document.getElementById('gemSystemDarkMatter');
    if (dmEl) {
        dmEl.textContent = getExplorationResources().darkMatter || 0;
    }
}

// 更新宝石仓库显示
function updateGemInventory() {
    const container = document.getElementById('gemInventory');
    container.innerHTML = '';
    
    // 红宝石
    addGemTypeToUI('red', '红宝石 (攻击加成)', container);
    // 蓝宝石
    addGemTypeToUI('blue', '蓝宝石 (生命加成)', container);
    // 黑宝石
    addGemTypeToUI('black', '黑宝石 (爆伤加成)', container);

}

// 添加宝石类型到UI
function addGemTypeToUI(type, name, container) {
    const gemTypeDiv = document.createElement('div');
    gemTypeDiv.className = 'gem-type-section';
    gemTypeDiv.innerHTML = `<h4>${name}</h4>`;
    
    const gemsContainer = document.createElement('div');
    gemsContainer.style.display = 'grid';
    gemsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    gemsContainer.style.gap = '10px';
    gemsContainer.style.marginTop = '10px';
    
    // 显示该类型的所有宝石
    let hasGems = false;
    for (const level in player.gems[type]) {
        const count = player.gems[type][level];
        if (count > 0) {
            hasGems = true;
            const gemDiv = document.createElement('div');
            gemDiv.className = 'gem-item';
            gemDiv.innerHTML = `
                <div class="gem-icon ${type}">${type.charAt(0).toUpperCase()}</div>
                <div class="gem-level">${level}</div>
                <div>数量: ${count}</div>
                <button onclick="upgradeGem('${type}', ${level})" ${count < 3 ? 'disabled' : ''}>合成</button>
            `;
            gemsContainer.appendChild(gemDiv);
        }
    }
    
    // 如果没有宝石，显示提示
    if (!hasGems) {
        gemsContainer.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888;">暂无宝石</div>';
    }
    
    gemTypeDiv.appendChild(gemsContainer);
    container.appendChild(gemTypeDiv);
}

// 更新宝石加成显示
function updateGemBonuses() {
    const bonuses = calculateGemBonuses();
    
    document.getElementById('attackBonus').textContent = `${bonuses.attack.toFixed(1)}%`;
    document.getElementById('healthBonus').textContent = `${bonuses.health.toFixed(1)}%`;
    document.getElementById('critDamageBonus').textContent = `${bonuses.critDamage.toFixed(1)}%`;

}


// 计算宝石总加成
function calculateGemBonuses() {
    return {
        attack: calculateGemBonus('red'),
        health: calculateGemBonus('blue'),
        critDamage: calculateGemBonus('black')


    };
}
// 计算单个宝石类型的加成
function calculateGemBonus(type) {
    let totalBonus = 0;
    
    for (const level in player.gems[type]) {
        const count = player.gems[type][level];
        const levelInt = parseInt(level);
        
        // 不同宝石类型有不同的加成计算方式
        switch (type) {
            case 'red': // 攻击加成: 100% * 2^(等级-1)
                totalBonus += count * 100 * (Math.pow(3, levelInt) - 1) / 2;
                break;
            case 'blue': // 生命加成: 5% * 2^(等级-1)
                totalBonus += count * 5 * (Math.pow(3, levelInt) - 1) / 2;
                break;
            case 'black': // 爆伤加成: 100% * 2^(等级-1)
                totalBonus += count * 100 * (Math.pow(3, levelInt) - 1) / 2;
                break;

        }
    }
    
    return totalBonus;
}

// 购买宝石（支持批量）
function buyGem(type, level, quantity) {
    const unitCost = 100;
    const qty = Math.max(1, parseInt(quantity) || 1);
    const totalCost = unitCost * qty;

    var expResGem = getExplorationResources();
    if ((expResGem.darkMatter || 0) >= totalCost) {
        expResGem.darkMatter -= totalCost;
        syncExplorationDataToPlayer();
        
        // 确保宝石类型存在
        if (!player.gems[type]) {
            player.gems[type] = {};
        }
        
        // 确保宝石等级存在
        if (!player.gems[type][level]) {
            player.gems[type][level] = 0;
        }
        
        player.gems[type][level] += qty;
        logAction(`购买了${qty}个${getGemName(type)}宝石`, 'success');
        updateGemUI();
        updateDisplay();
    } else {
        logAction("暗物质不足！", "error");
    }
}

// 添加宝石
function addGem(type, level) {
    if (!player.gems[type][level]) {
        player.gems[type][level] = 0;
    }
    player.gems[type][level]++;
}

// 获取宝石名称
function getGemName(type) {
    const names = {
        red: "红",
        blue: "蓝",
        black: "黑"

    };
    return names[type] || "未知";
}

// 宝石合成
function upgradeGem(type, level) {
    const currentLevel = parseInt(level);
    const nextLevel = currentLevel + 1;
    
    // 检查是否有足够的宝石合成
    if (player.gems[type][currentLevel] >= 3) {
        player.gems[type][currentLevel] -= 3;
        
        // 如果数量为0，删除该等级
        if (player.gems[type][currentLevel] === 0) {
            delete player.gems[type][currentLevel];
        }
        
        // 添加高一级宝石
        if (!player.gems[type][nextLevel]) {
            player.gems[type][nextLevel] = 0;
        }
        player.gems[type][nextLevel]++;
        
        logAction(`成功合成${getGemName(type)}宝石 Lv.${nextLevel}`, 'success');
        updateGemUI();
    } else {
        logAction("宝石数量不足，无法合成！", "error");
    }
}

// 一键合成：将所有可合成的同类型同等级宝石（≥3个）自动合成到更高等级，循环直到无法再合成
function batchUpgradeGems() {
    var totalMerges = 0;
    var types = ['red', 'blue', 'black'];
    for (var t = 0; t < types.length; t++) {
        var type = types[t];
        if (!player.gems[type]) continue;
        var changed = true;
        while (changed) {
            changed = false;
            var levels = Object.keys(player.gems[type]).map(Number).filter(function(l) { return player.gems[type][l] > 0; }).sort(function(a, b) { return a - b; });
            for (var i = 0; i < levels.length; i++) {
                var level = levels[i];
                while (player.gems[type][level] >= 3) {
                    player.gems[type][level] -= 3;
                    if (player.gems[type][level] === 0) delete player.gems[type][level];
                    var nextLevel = level + 1;
                    if (!player.gems[type][nextLevel]) player.gems[type][nextLevel] = 0;
                    player.gems[type][nextLevel]++;
                    totalMerges++;
                    changed = true;
                }
            }
        }
    }
    if (totalMerges > 0) {
        logAction('一键合成完成，共合成 ' + totalMerges + ' 次', 'success');
        updateGemUI();
    } else {
        logAction('没有可合成的宝石（需同类型同等级≥3个）', 'error');
    }
}
// 打开藏宝图商店
    function openTreasureShop() {
        if (player.reincarnationCount < 50) {
        alert("需要达到50转才能开启藏宝图商店！");
        return;
    }
        document.getElementById('treasureShopOverlay').style.display = 'block';
        document.getElementById('treasureShopUI').style.display = 'block';
        updateGemDisplay();
    }
    
    // 关闭藏宝图商店
    function closeTreasureShop() {
        document.getElementById('treasureShopOverlay').style.display = 'none';
        document.getElementById('treasureShopUI').style.display = 'none';
    }
    
    // 更新宝石数量显示
    function updateGemDisplay() {
        document.getElementById('currentPrimaryGemqCount').textContent = player.items.primaryGemq || 0;
    }
    
    // 兑换物品函数
    function exchangeItem(type) {
        let cost, item, amount;
        
        switch(type) {
            case 1: // 玫瑰花
                cost = 1;
                item = 'rose';
                amount = 50;
                break;
            case 2: // VIP能力值
                cost = 1;
                item = 'vipPower';
                amount = 10;
                break;
            case 3: // 鱼饵
                cost = 1;
                item = 'baitCount';
                amount = 1;
                break;
            case 4: // 伴侣钥匙
                cost = 2;
                item = 'companionKey';
                amount = 1;
                break;
            case 5: // 灵根检测器
                cost = 5;
                item = 'rootDetector';
                amount = 1;
                break;
            case 6: // 血脉检测剂
                cost = 5;
                item = 'bloodlineDetector';
                amount = 1;
                break;
            case 7: // 进阶神石
                cost = 20;
                item = 'advanceStone';
                amount = 1;
                break;
           case 8: // 宗门令牌
                cost = 50;
                item = 'zongmen';
                amount = 1;
                break;
            case 9: // 副本令牌
                cost = 10;
                item = 'fuben1';
                amount = 1;
                break;
             case 10: // 职业转换书
                cost = 10;
                item = 'zhiye1';
                amount = 1;
                break;
             case 11: 
                cost = 1;
                item = 'fubeng1';
                amount = 3;
                break;
            default:
                return;
        }
        
        // 检查金币数量
        if (player.items.primaryGemq >= cost) {
            // 扣除金币
            player.items.primaryGemq -= cost;
            
            // 添加物品
            if (!player.items[item]) player.items[item] = 0;
            player.items[item] += amount;
            
            // 更新显示
            updateGemDisplay();
            updateDisplay();
            
            // 显示成功消息
            let itemName = '';
            switch(item) {
                case 'rose': itemName = '玫瑰花'; break;
                case 'vipPower': itemName = 'VIP能力值'; break;
                case 'baitCount': itemName = '鱼饵'; break;
                case 'companionKey': itemName = '伴侣钥匙'; break;
                case 'rootDetector': itemName = '灵根检测器'; break;
                case 'bloodlineDetector': itemName = '血脉检测剂'; break;
                case 'advanceStone': itemName = '进阶神石'; break;
               case 'zongmen': itemName = '宗门令牌'; break;
               case 'zhiye1': itemName = '职业转换书'; break;
               case 'fuben1': itemName = '副本令牌'; break;
              case 'fubeng1': itemName = '深渊令牌'; break;
            }
            
            logAction(`宝藏金币成功兑换: ${amount}${itemName}`, 'success');
        } else {
            logAction('宝藏金币不足！', 'error');
        }
    }




// 藏宝图等级配置
const treasureMapLevels = [
    { level: 1, name: "一级藏宝图", monsterMinStage: 50, monsterMaxStage: 200, expReward: 10000, rewards: [
        { type: "baitCount", amount: 1 },
        { type: "companionKey", amount: 1 },
        { type: "vipPower", amount: 2 },
        { type: "rose", amount: 20 },
        { type: "primaryGem", amount: 1 },
        { type: "advancedGem", amount: 1 },
        { type: "yuzhou1", amount: 1 },
        { type: "yuzhou2", amount: 1 },
         { type: "banlv1", amount: 1 },
        { type: "banlv2", amount: 1 }
    ]},
    { level: 2, name: "二级藏宝图", monsterMinStage: 200, monsterMaxStage: 400, expReward: 50000, rewards: [
        { type: "baitCount", amount: 2 },
        { type: "companionKey", amount: 2 },
        { type: "vipPower", amount: 5 },
        { type: "rose", amount: 50 },
        { type: "advancedGem", amount: 2 },
        { type: "primaryGem", amount: 2 },
        { type: "rebornDan", amount: 3 },
        { type: "advanceStone", amount: 1 },
        { type: "yuzhou1", amount: 2 },
        { type: "yuzhou2", amount: 2 },
        { type: "banlv1", amount: 1 },
        { type: "banlv2", amount: 1 }
    ]},
    { level: 3, name: "三级藏宝图", monsterMinStage: 400, monsterMaxStage: 600, expReward: 100000, rewards: [
        { type: "baitCount", amount: 5 },
        { type: "companionKey", amount: 3 },
        { type: "vipPower", amount: 10 },
        { type: "rose", amount: 100 },
        { type: "advancedGem", amount: 3 },
        { type: "superiorGem", amount: 3 },
        { type: "rebornDan", amount: 5 },
        { type: "rootDetector", amount: 1 },
        { type: "bloodlineDetector", amount: 1 },
        { type: "advanceStone", amount: 1 },
              { type: "yuzhou1", amount: 3 },
        { type: "yuzhou2", amount: 3 },
        { type: "yuzhou3", amount: 3 },
         { type: "yuzhou4", amount: 3 },
        { type: "banlv1", amount: 2 },
        { type: "banlv2", amount: 1 },  
        { type: "banlv7", amount: 1 },
       { type: "banlv8", amount: 1 },      
      { type: "banlv9", amount: 1 }       
    ]},
    { level: 4, name: "四级藏宝图", monsterMinStage: 600, monsterMaxStage: 800, expReward: 500000, rewards: [
        { type: "baitCount", amount: 5 },
        { type: "companionKey", amount: 5 },
        { type: "vipPower", amount: 20 },
        { type: "rose", amount: 200 },
        { type: "superiorGem", amount: 3 },
        { type: "divineGem", amount: 3 },
        { type: "rebornDan", amount: 10 },
        { type: "rootDetector", amount: 1 },
        { type: "bloodlineDetector", amount: 1 },
        { type: "advanceStone", amount: 2 },
        { type: "yuzhou1", amount: 4 },
        { type: "yuzhou2", amount: 4 },
        { type: "yuzhou3", amount: 4 },
        { type: "yuzhou4", amount: 4 },
        { type: "banlv1", amount: 2 },
        { type: "banlv2", amount: 2 }, 
        { type: "banlv7", amount: 1 },
       { type: "banlv8", amount: 1 }     
    ]},
    { level: 5, name: "五级藏宝图", monsterMinStage: 800, monsterMaxStage: 1000, expReward: 1000000, rewards: [
        { type: "baitCount", amount: 10 },
        { type: "companionKey", amount: 10 },
        { type: "vipPower", amount: 50 },
        { type: "rose", amount: 500 },
        { type: "superiorGem", amount: 5 },
        { type: "divineGem", amount: 5 },
        { type: "rebornDan", amount: 20 },
        { type: "rootDetector", amount: 2 },
        { type: "bloodlineDetector", amount: 2 },
       { type: "advanceStone", amount: 3 },
       { type: "yuzhou1", amount: 5 },
       { type: "yuzhou2", amount: 5 },
       { type: "yuzhou3", amount: 5 },
       { type: "yuzhou4", amount: 5 },
       { type: "banlv1", amount: 3 },
       { type: "banlv2", amount: 3 },  
       { type: "banlv7", amount: 1 },
       { type: "banlv8", amount: 1 },
       { type: "fuben1", amount: 1 },      
      { type: "banlv9", amount: 1 }  
    ]}
];

// 藏宝图品质配置
const treasureMapQualities = [
    { quality: 1, name: "普通", multiplier: 1.0 },
    { quality: 2, name: "精良", multiplier: 2.0 },
    { quality: 3, name: "稀有", multiplier: 3.0 },
    { quality: 4, name: "史诗", multiplier: 5.0 },
    { quality: 5, name: "传说", multiplier: 7.0 },
    { quality: 6, name: "神话", multiplier: 10.0 }
];

// 切换藏宝图系统显示
function toggleTreasureMapSystem() {
    if (player.reincarnationCount < 600) {
        alert("需要达到600转才能开启宝图系统！");
        return;
    }
    const ui = document.getElementById('treasureMapSystemUI');
    const overlay = document.getElementById('treasureMapSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateTreasureMapDisplay();
        // 初始化合成界面
    updateCraftingDisplay();
    
    // 添加选择框变化监听
    document.getElementById('craftLevel').addEventListener('change', updateCraftingDisplay);
    document.getElementById('craftQuality').addEventListener('change', updateCraftingDisplay);
    }
}

// 更新藏宝图系统显示
function updateTreasureMapDisplay() {
     // 更新钥匙数量
    document.getElementById('treasureKeyCount').textContent = player.treasure.keys;

    // 更新藏宝图数量显示（形如 23/200）
    const mapCountSpan = document.getElementById('treasureMapCount');
    if (mapCountSpan) {
        mapCountSpan.textContent = (player.treasure.maps.length || 0) + "/200";
    }

    const container = document.getElementById('treasureMapList');
    container.innerHTML = '';
    
    if (player.treasure.maps.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #6b5344; padding: 24px; font-size: 13px;">暂无藏宝图，用钥匙开启宝箱可获得</div>';
        return;
    }
    
    // 按等级和品质排序
    player.treasure.maps.sort((a, b) => {
        if (a.level !== b.level) return b.level - a.level;
        return b.quality - a.quality;
    });
    
    player.treasure.maps.forEach((map, index) => {
        const levelConfig = treasureMapLevels.find(l => l.level === map.level);
        const qualityConfig = treasureMapQualities.find(q => q.quality === map.quality);
        const borderColor = map.quality >= 4 ? '#8B6914' : '#6b5344';
        
        const card = document.createElement('div');
        card.style.cssText = 'background: linear-gradient(145deg, #f0e6d0 0%, #e2d6bc 100%); padding: 12px; border-radius: 4px; border: 2px solid ' + borderColor + '; box-shadow: inset 0 0 12px rgba(139,105,20,0.08);';
        
        card.innerHTML = `
            <div style="font-weight: 600; color: #5c3a1e; font-size: 13px; margin-bottom: 4px;">${levelConfig.name}</div>
            <div style="font-size: 11px; color: #6b5344;">品质: ${qualityConfig.name} (×${qualityConfig.multiplier})</div>
            <div style="font-size: 10px; color: #8B7355; margin-top: 4px;">${new Date(map.obtainedAt).toLocaleDateString()}</div>
            <button onclick="useTreasureMap(${index})" style="margin-top: 8px; width: 100%; background: #8B6914; color: #f5ecd6; border: 1px solid #5c3a1e; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px;">使用藏宝图</button>
        `;
        
        container.appendChild(card);
    });
    
    // 更新合成界面
    updateCraftingDisplay();
}

// 兑换藏宝图钥匙
function buyTreasureKey() {
    var expResKey = getExplorationResources();
    if ((expResKey.stardust || 0) < 100) {
        logAction("星尘不足！", "error");
        return;
    }
    
    expResKey.stardust -= 100;
    syncExplorationDataToPlayer();
    player.treasure.keys++;
    updateTreasureMapDisplay();
    logAction("成功兑换1个藏宝图钥匙", "success");
}
const TREASURE_KEY_STAR_COIN_PRICE = 100000; // 每把钥匙星币价格
function buyTreasureKey1() {
    if (player.nightClub.starCoins < TREASURE_KEY_STAR_COIN_PRICE) {
        logAction("星币不足！", "error");
        return;
    }
    
    player.nightClub.starCoins -= TREASURE_KEY_STAR_COIN_PRICE;
    player.treasure.keys++;
    updateTreasureMapDisplay();
    logAction("成功兑换1个藏宝图钥匙", "success");
}
function buyTreasureKey2() {
    const cost = 10 * TREASURE_KEY_STAR_COIN_PRICE;
    if (player.nightClub.starCoins < cost) {
        logAction("星币不足！", "error");
        return;
    }
    
    player.nightClub.starCoins -= cost;
    player.treasure.keys+=10;
    updateTreasureMapDisplay();
    logAction("成功兑换10个藏宝图钥匙", "success");
}
function buyTreasureKey3() {
    const cost = 50 * TREASURE_KEY_STAR_COIN_PRICE;
    if (player.nightClub.starCoins < cost) {
        logAction("星币不足！", "error");
        return;
    }
    
    player.nightClub.starCoins -= cost;
    player.treasure.keys+=50;
    updateTreasureMapDisplay();
    logAction("成功兑换50个藏宝图钥匙", "success");
}
function openTreasureChestBatch(count) {
    // 库存上限检查：最多200张藏宝图
    const currentMaps = player.treasure.maps ? player.treasure.maps.length : 0;
    if (currentMaps >= 200) {
        logAction("藏宝图已达库存上限（200张），请先使用部分藏宝图再开启宝箱！", "error");
        return;
    }
    if (currentMaps + count > 200) {
        logAction(`本次开启${count}次会超过藏宝图上限（当前${currentMaps}/200），请减少次数或先使用部分藏宝图！`, "error");
        return;
    }

    if (player.treasure.keys < count) {
        logAction(`藏宝图钥匙不足！需要${count}个钥匙`, "error");
        return;
    }
    
    player.treasure.keys -= count;
    
    // 统计获得的藏宝图
    const results = {
        total: 0,
        byLevel: {},
        byQuality: {}
    };
    
    for (let i = 0; i < count; i++) {
        // 随机生成藏宝图等级
        const levelRand = Math.random();
        let level;
        if (levelRand < 0.8) level = 1;
        else if (levelRand < 0.95) level = 2;
        else if (levelRand < 0.98) level = 3;
        else if (levelRand < 0.995) level = 4;
        else level = 5;
        
        // 随机生成藏宝图品质
        const qualityRand = Math.random();
        let quality;
        if (qualityRand < 0.7) quality = 1;
        else if (qualityRand < 0.95) quality = 2;
        else if (qualityRand < 0.99889) quality = 3;
        else if (qualityRand < 0.99989) quality = 4;
        else if (qualityRand < 0.99999) quality = 5;
        else quality = 6;
        
        // 创建藏宝图
        const newMap = {
            level: level,
            quality: quality,
            obtainedAt: Date.now()
        };
        
        player.treasure.maps.push(newMap);
        
        // 统计结果
        results.total++;
        results.byLevel[level] = (results.byLevel[level] || 0) + 1;
        results.byQuality[quality] = (results.byQuality[quality] || 0) + 1;
    }
    
    // 更新显示
    updateTreasureMapDisplay();
    
    // 生成汇总消息
    let message = `批量开启了${count}个宝箱，获得${results.total}张藏宝图：`;
    
    // 按等级统计
    message += " 等级分布:";
    for (let lvl = 1; lvl <= 5; lvl++) {
        if (results.byLevel[lvl]) {
            const levelName = treasureMapLevels.find(l => l.level === lvl).name;
            message += ` ${levelName}×${results.byLevel[lvl]}`;
        }
    }
    
    // 按品质统计
    message += " 品质分布:";
    for (let q = 1; q <= 6; q++) {
        if (results.byQuality[q]) {
            const qualityName = treasureMapQualities.find(qual => qual.quality === q).name;
            message += ` ${qualityName}×${results.byQuality[q]}`;
        }
    }
    
    logAction(message, 'success');
}




// 开启藏宝图宝箱
function openTreasureChest() {
    // 库存上限检查：最多200张藏宝图
    const currentMaps = player.treasure.maps ? player.treasure.maps.length : 0;
    if (currentMaps >= 200) {
        logAction("藏宝图已达库存上限（200张），请先使用部分藏宝图再开启宝箱！", "error");
        return;
    }

    if (player.treasure.keys < 1) {
        logAction("藏宝图钥匙不足！", "error");
        return;
    }
    
    player.treasure.keys--;
    
    // 随机生成藏宝图等级
    const levelRand = Math.random();
    let level;
    if (levelRand < 0.7) level = 1;
    else if (levelRand < 0.92) level = 2;
    else if (levelRand < 0.98) level = 3;
    else if (levelRand < 0.995) level = 4;
    else level = 5;
    
    // 随机生成藏宝图品质
    const qualityRand = Math.random();
    let quality;
    if (qualityRand < 0.7) quality = 1;
    else if (qualityRand < 0.95) quality = 2;
    else if (qualityRand < 0.99889) quality = 3;
    else if (qualityRand < 0.99989) quality = 4;
    else if (qualityRand < 0.99999) quality = 5;
    else quality = 6;
    
    // 创建藏宝图
    const newMap = {
        level: level,
        quality: quality,
        obtainedAt: Date.now()
    };
    
    player.treasure.maps.push(newMap);
    updateTreasureMapDisplay();
    
    const levelName = treasureMapLevels.find(l => l.level === level).name;
    const qualityName = treasureMapQualities.find(q => q.quality === quality).name;
    logAction(`获得${levelName}（${qualityName}品质）`, "success");
}
function updateCraftingDisplay() {
    const levelSelect = document.getElementById('craftLevel');
    const qualitySelect = document.getElementById('craftQuality');
    const countDisplay = document.getElementById('craftCount');
    
    if (!levelSelect || !qualitySelect || !countDisplay) return;
    
    // 获取当前选择的等级和品质
    const selectedLevel = parseInt(levelSelect.value);
    const selectedQuality = parseInt(qualitySelect.value);
    
    // 计算当前拥有的符合条件的藏宝图数量
    const count = player.treasure.maps.filter(map => 
        map.level === selectedLevel && map.quality === selectedQuality
    ).length;
    
    countDisplay.textContent = count;
    
    // 更新品质选择框，隐藏无法合成的选项（神话品质）
    while (qualitySelect.options.length > 0) {
        qualitySelect.remove(0);
    }
    
    const maxQuality = 5; // 最高可合成到传说品质
    for (let q = 1; q <= maxQuality; q++) {
        const option = document.createElement('option');
        option.value = q;
        option.textContent = treasureMapQualities.find(qual => qual.quality === q).name;
        qualitySelect.appendChild(option);
    }
    
    // 恢复之前的选择
    qualitySelect.value = Math.min(selectedQuality, maxQuality);
}

// 合成藏宝图
function craftTreasureMap() {
    const level = parseInt(document.getElementById('craftLevel').value);
    const quality = parseInt(document.getElementById('craftQuality').value);
    
    // 检查是否可以合成（神话品质无法继续合成）
    if (quality >= 6) {
        logAction("神话品质无法继续合成！", "error");
        return;
    }
    
    // 获取符合条件的藏宝图
    const matchingMaps = player.treasure.maps.filter(map => 
        map.level === level && map.quality === quality
    );
    
    // 检查数量是否足够（3张→1张）
    if (matchingMaps.length < 3) {
        logAction(`需要3张${treasureMapLevels.find(l => l.level === level).name}（${treasureMapQualities.find(q => q.quality === quality).name}品质）才能合成！`, "error");
        return;
    }
    
    // 移除3张原材料
    for (let i = 0; i < 3; i++) {
        const index = player.treasure.maps.findIndex(map => 
            map.level === level && map.quality === quality
        );
        if (index !== -1) {
            player.treasure.maps.splice(index, 1);
        }
    }
    
    // 添加1张更高品质的同等级藏宝图
    const newMap = {
        level: level,
        quality: quality + 1,
        obtainedAt: Date.now()
    };
    
    player.treasure.maps.push(newMap);
    
    // 更新显示
    updateTreasureMapDisplay();
    updateCraftingDisplay();
    
    const levelName = treasureMapLevels.find(l => l.level === level).name;
    const oldQualityName = treasureMapQualities.find(q => q.quality === quality).name;
    const newQualityName = treasureMapQualities.find(q => q.quality === quality + 1).name;
    
    logAction(`成功将3张${levelName}（${oldQualityName}品质）合成为1张${levelName}（${newQualityName}品质）`, "success");
}

// 一键合成全部可合成的藏宝图
function craftAllTreasureMaps() {
    let craftedCount = 0;
    
    // 遍历所有等级和品质（除了神话品质）
    for (let level = 1; level <= 5; level++) {
        for (let quality = 1; quality <= 5; quality++) { // 最高合成到传说品质
            let craftedInThisCategory = 0;
            
            // 获取符合条件的藏宝图
            const matchingMaps = player.treasure.maps.filter(map => 
                map.level === level && map.quality === quality
            );
            
            // 计算可合成的次数（3张→1张）
            const craftTimes = Math.floor(matchingMaps.length / 3);
            
            if (craftTimes > 0) {
                // 移除原材料
                for (let i = 0; i < craftTimes * 3; i++) {
                    const index = player.treasure.maps.findIndex(map => 
                        map.level === level && map.quality === quality
                    );
                    if (index !== -1) {
                        player.treasure.maps.splice(index, 1);
                    }
                }
                
                // 添加合成后的藏宝图
                for (let i = 0; i < craftTimes; i++) {
                    const newMap = {
                        level: level,
                        quality: quality + 1,
                        obtainedAt: Date.now()
                    };
                    player.treasure.maps.push(newMap);
                    craftedCount++;
                }
                
                craftedInThisCategory += craftTimes;
            }
            
            if (craftedInThisCategory > 0) {
                const levelName = treasureMapLevels.find(l => l.level === level).name;
                const oldQualityName = treasureMapQualities.find(q => q.quality === quality).name;
                const newQualityName = treasureMapQualities.find(q => q.quality === quality + 1).name;
                
                logAction(`一键合成了${craftedInThisCategory}组${levelName}（${oldQualityName}品质）→ ${levelName}（${newQualityName}品质）`, "info");
            }
        }
    }
    
    if (craftedCount > 0) {
        logAction(`一键合成完成，共合成${craftedCount}张藏宝图`, "success");
    } else {
        logAction("没有可合成的藏宝图", "info");
    }
    
    // 更新显示
    updateTreasureMapDisplay();
    updateCraftingDisplay();
}

// 同品质一键合成：按上面筛选选中的「等级+品质」批量合成（3张→1张），直到该组合不足3张
function craftAllByQuality() {
    const levelSelect = document.getElementById('craftLevel');
    const qualitySelect = document.getElementById('craftQuality');
    if (!levelSelect || !qualitySelect) return;

    const level = parseInt(levelSelect.value);
    const quality = parseInt(qualitySelect.value);
    if (quality >= 6) {
        logAction("神话品质无法继续合成！", "error");
        return;
    }

    const matchingMaps = player.treasure.maps.filter(map =>
        map.level === level && map.quality === quality
    );
    const craftTimes = Math.floor(matchingMaps.length / 3);

    if (craftTimes === 0) {
        const levelName = treasureMapLevels.find(l => l.level === level).name;
        const qualityName = treasureMapQualities.find(q => q.quality === quality).name;
        logAction(`当前筛选的${levelName}（${qualityName}）不足3张，无法合成`, "info");
        updateCraftingDisplay();
        return;
    }

    for (let i = 0; i < craftTimes * 3; i++) {
        const index = player.treasure.maps.findIndex(map =>
            map.level === level && map.quality === quality
        );
        if (index !== -1) player.treasure.maps.splice(index, 1);
    }
    for (let i = 0; i < craftTimes; i++) {
        player.treasure.maps.push({
            level: level,
            quality: quality + 1,
            obtainedAt: Date.now()
        });
    }

    const levelName = treasureMapLevels.find(l => l.level === level).name;
    const qualityName = treasureMapQualities.find(q => q.quality === quality).name;
    const newQualityName = treasureMapQualities.find(q => q.quality === quality + 1).name;
    logAction(`同品质一键合成：${levelName}（${qualityName}）合成${craftTimes}组→${newQualityName}，共${craftTimes}张`, "success");

    updateTreasureMapDisplay();
    updateCraftingDisplay();
}




// 使用藏宝图
function useTreasureMap(index, fromAuto = false) {
    if (index < 0 || index >= player.treasure.maps.length) return;
    
    const map = player.treasure.maps[index];
    const levelConfig = treasureMapLevels.find(l => l.level === map.level);
    const qualityConfig = treasureMapQualities.find(q => q.quality === map.quality);
    
    // 移除藏宝图
    player.treasure.maps.splice(index, 1);
    updateTreasureMapDisplay();
    
    // 随机决定事件类型
    const eventRand = Math.random();
    
    if (eventRand < 0.6) {
        // 60% 遇到怪物
        startTreasureBattle(map, fromAuto);
    } else if (eventRand < 0.8) {
        // 20% 直接获得奖励
        giveTreasureRewards(map, false);
    } else {
        // 20% 没有奖励
        showTreasureReward("没有获得任何奖励");
    }
}

function generateTreasureMonster(minStage, maxStage) {
    // 随机选择关卡
    const stage = Math.floor(Math.random() * (maxStage - minStage + 1)) + minStage;
    
    // 复制打怪模式的属性生成逻辑
    const monsterRanks = ['普通', '精英', '普通BOSS', '特殊BOSS', '领主BOSS', '霸主级BOSS', '王级BOSS', '皇级BOSS', '帝级BOSS', '神级BOSS', '圣级BOSS'];
    const rankProbabilities = [0.45, 0.20, 0.10, 0.06, 0.05, 0.04, 0.03, 0.03, 0.02, 0.015, 0.005];
    
    // 随机生成怪物品阶
    let rankIndex = 0;
    let rand = Math.random();
    for (let i = 0; i < rankProbabilities.length; i++) {
        rand -= rankProbabilities[i];
        if (rand < 0) {
            rankIndex = i;
            break;
        }
    }
    const rank = monsterRanks[rankIndex];
    
    // 根据品阶选择词条
    const modifierPool = monsterRankModifiers[rank].pool;
    const selectCount = monsterRankModifiers[rank].selectCount;
    const selectedModifiers = [];
    const usedModifiers = new Set();
    
    for (let i = 0; i < selectCount; i++) {
        let modifier;
        do {
            modifier = modifierPool[Math.floor(Math.random() * modifierPool.length)];
        } while (usedModifiers.has(modifier));
        usedModifiers.add(modifier);
        selectedModifiers.push(modifier);
    }
    
    // 计算怪物属性
    const healthMultiplier = Math.pow(2, stage);
    let attackMultiplier;
  
    if (stage <= 5) {
        attackMultiplier = Math.floor(Math.random() * 3) + 1;
    } else if (stage <= 15) {
        attackMultiplier = 35 + (stage - 10) * 1000;
    } else if (stage <= 25) {
        attackMultiplier = 50 + (stage - 10) * 100000;
    } else if (stage <= 40) {
        attackMultiplier = 100 + (stage - 10) * 1e70;
    } else if (stage <= 65) {
        attackMultiplier = 1000 + (stage - 9) * 1e80;
    } else if (stage <= 90) {
        attackMultiplier = 3500 + (stage - 64) * 1e90;
    } else if (stage <= 120) {
        attackMultiplier = 35000 + (stage - 89) * 1e100;
    } else if (stage <= 250) {
        attackMultiplier = 350000 + (stage - 119) * 1e110;
    } else if (stage <= 350) {
        attackMultiplier = 3500000 + (stage - 249) * 1e120;
    } else if (stage <= 450) {
        attackMultiplier = 450000000 + (stage - 349) * 1e130;
    } else if (stage <= 550) {
        attackMultiplier = 5500009000 + (stage - 449) * 1e140;
    } else if (stage <= 650) {
        attackMultiplier = 650000000900 + (stage - 549) * 1e150;
    } else if (stage <= 700) {
        attackMultiplier = 6500000000900 + (stage - 649) * 1e160;
    } else if (stage <= 750) {
        attackMultiplier = 6500000000000900 + (stage - 699) * 1e170;
    } else if (stage <= 790) {
        attackMultiplier = 6500000000000000900 + (stage - 549) * 1e180;
    } else if (stage <= 820) {
        attackMultiplier = 65000000000000000000900 + (stage - 549) * 1e190;
    } else if (stage <= 840) {
        attackMultiplier = 6500000000000000000000000900 + (stage - 549) * 1e200;
    } else if (stage <= 860) {
        attackMultiplier = 10000000000000000000000000000000 + (stage - 649) * 1e210;
    } else if (stage <= 900) {
        attackMultiplier = 100000000000000000000000000000000000 + (stage - 749) * 1e230;
    } else {
        attackMultiplier = 1000000000000000000000000000000000000000 + (stage - 849) * 1e250;
    }
    
    // 应用词条效果
    let attack = attackMultiplier;
    let damageReduction = 0;
    let dodgeChance = 0;
    let blockCount = 0;
    let attackCount = 1;
    let damageTakenMultiplier = 1;
    
    selectedModifiers.forEach(modifier => {
        const effect = monsterModifiers[modifier];
        if (effect.attackMultiplier) attack *= effect.attackMultiplier;
        if (effect.damageReduction) damageReduction += effect.damageReduction;
        if (effect.dodgeChance) dodgeChance += effect.dodgeChance;
        if (effect.blockCount) blockCount += effect.blockCount;
        if (effect.attackCount) attackCount = effect.attackCount;
        if (effect.damageTakenMultiplier) damageTakenMultiplier *= effect.damageTakenMultiplier;
    });
    
    // 生成怪物
    return {
        name: "宝藏守卫者",
        rank: rank,
        health: 10000 * healthMultiplier,
        attack: attack,
        modifiers: selectedModifiers,
        damageReduction: damageReduction,
        dodgeChance: dodgeChance,
        blockCount: blockCount,
        attackCount: attackCount,
        damageTakenMultiplier: damageTakenMultiplier
    };
}

// 在宝藏守卫者战斗中使用独立的属性生成
function startTreasureBattle(map, fromAuto = false) {
    const levelConfig = treasureMapLevels.find(l => l.level === map.level);
    
    // 使用独立的属性生成函数
    const monster = generateTreasureMonster(levelConfig.monsterMinStage, levelConfig.monsterMaxStage);
    
    // 保存战斗信息
    player.treasure.currentBattle = {
        map: map,
        monster: monster,
        playerHealth: player.battle.playerHealth,
        playerAttack: player.battle.playerAttack,
        playerCritRate: player.battle.playerCritRate,
        playerCritDamage: player.battle.playerCritDamage,
        battleEnded: false
    };
    
    // 更新战斗界面
    document.getElementById('treasurePlayerHealth').textContent = player.battle.playerHealth.toExponential(3);
    document.getElementById('treasurePlayerAttack').textContent = player.battle.playerAttack.toExponential(3);
    document.getElementById('treasurePlayerCritRate').textContent = (player.battle.playerCritRate * 100).toFixed(1) + "%";
    document.getElementById('treasurePlayerCritDamage').textContent = (player.battle.playerCritDamage * 100).toFixed(1) + "%";
    
    document.getElementById('treasureMonsterName').textContent = monster.name;
    document.getElementById('treasureMonsterRank').textContent = monster.rank;
    document.getElementById('treasureMonsterHealth').textContent = formatSci(monster.health);
    document.getElementById('treasureMonsterAttack').textContent = formatSci(monster.attack);
    document.getElementById('treasureMonsterModifiers').textContent = monster.modifiers.join(', ') || '无';
    
    document.getElementById('treasureBattleLog').innerHTML = "";
    
    // 只在自动流程中隐藏遇怪弹窗；手动点击始终显示
    if (!fromAuto) {
        document.getElementById('treasureBattleOverlay').style.display = 'block';
        document.getElementById('treasureBattleUI').style.display = 'block';
    }
}

// 藏宝图战斗日志：避免 innerHTML += 整段反复解析（自动战斗 500ms 一次易拖垮主线程）
var TREASURE_BATTLE_LOG_MAX_ROWS = 120;
function appendTreasureBattleLogRow(htmlFragment) {
    var logContainer = document.getElementById('treasureBattleLog');
    if (!logContainer || !htmlFragment) return;
    var holder = document.createElement('div');
    holder.innerHTML = String(htmlFragment).trim();
    while (holder.firstChild) logContainer.appendChild(holder.firstChild);
    while (logContainer.children.length > TREASURE_BATTLE_LOG_MAX_ROWS) {
        logContainer.removeChild(logContainer.firstChild);
    }
    logContainer.scrollTop = logContainer.scrollHeight;
}

// 攻击宝藏守卫者
function attackTreasureMonster() {
    if (!player.treasure.currentBattle) return;
    
    const battle = player.treasure.currentBattle;
   if (!battle || battle.battleEnded) return; // 检查战斗是否结束
    
    // 玩家攻击
    let playerDamage = battle.playerAttack;
    
    // 暴击判断
    if (Math.random() < battle.playerCritRate) {
        playerDamage *= battle.playerCritDamage;
        appendTreasureBattleLogRow(`<div>你发动暴击，造成${formatSci(playerDamage)}点伤害！</div>`);
    } else {
        appendTreasureBattleLogRow(`<div>你造成${formatSci(playerDamage)}点伤害</div>`);
    }
    
    battle.monster.health = bSub(battle.monster.health, playerDamage);
    document.getElementById('treasureMonsterHealth').textContent = formatSci(bLteZero(battle.monster.health) ? 0 : battle.monster.health);
    
    // 检查怪物是否被击败
    if (bLteZero(battle.monster.health)) {
        appendTreasureBattleLogRow(`<div style="color: #4CAF50;">你击败了宝藏守卫者！</div>`);
        battle.battleEnded = true; // 标记战斗结束
        
        // 禁用攻击按钮
        const attackBtn = document.querySelector('#treasureBattleUI button');
        if (attackBtn) {
            attackBtn.disabled = true;
            attackBtn.style.background = '#999';
        }
        setTimeout(() => {
            giveTreasureRewards(battle.map, true);
            closeTreasureBattle();
           updateTreasureBattleStatus();
        }, 1000);
        return;
    }
    
    // 怪物反击
    let monsterDamage = battle.monster.attack;
    battle.playerHealth = bSub(battle.playerHealth, monsterDamage);
    document.getElementById('treasurePlayerHealth').textContent = formatSci(bLteZero(battle.playerHealth) ? 0 : battle.playerHealth);
    appendTreasureBattleLogRow(`<div>宝藏守卫者对你造成${formatSci(monsterDamage)}点伤害</div>`);
    
    // 检查玩家是否被击败
    if (bLteZero(battle.playerHealth)) {
        appendTreasureBattleLogRow(`<div style="color: #f44336;">你被宝藏守卫者击败了！</div>`);
          battle.battleEnded = true; // 标记战斗结束
        
        // 禁用攻击按钮
        const attackBtn = document.querySelector('#treasureBattleUI button');
        if (attackBtn) {
            attackBtn.disabled = true;
            attackBtn.style.background = '#999';
        }
        setTimeout(() => {
            showTreasureReward("战斗失败，没有获得任何奖励");
            closeTreasureBattle();     
        }, 1000);
    }
}

// 关闭宝藏战斗界面
function closeTreasureBattle() {
    document.getElementById('treasureBattleOverlay').style.display = 'none';
    document.getElementById('treasureBattleUI').style.display = 'none';
    player.treasure.currentBattle = null;
  const attackBtn = document.querySelector('#treasureBattleUI button');
        if (attackBtn) {
            attackBtn.disabled = false;
            attackBtn.style.background = '#999';
        }
}

// 给予藏宝图奖励
function giveTreasureRewards(map, isBattleWin) {
    const levelConfig = treasureMapLevels.find(l => l.level === map.level);
    const qualityConfig = treasureMapQualities.find(q => q.quality === map.quality);
    
    let rewardText = "";
    
    if (isBattleWin) {
        // 战斗胜利奖励：修仙经验（洞府聚灵阵加成）
        const exp = levelConfig.expReward * qualityConfig.multiplier * (typeof getGrottoCultivationExpBonus === 'function' ? getGrottoCultivationExpBonus() : 1);
        player.cultivation.exp += exp;
      
        rewardText = `战斗胜利！获得${exp}点修仙经验`;
    if (Math.random() < 0.1) {
            player.items.roseq = (player.items.roseq || 0) + 1;
            rewardText += "<br>获得香囊x1！";
        }
    if (map.quality >= 3 && Math.random() < 0.01) {
            player.items.fuben1 = (player.items.fuben1 || 0) + 1;
            rewardText += "<br>获得副本令牌x1！";
        }
      if (map.quality >= 4 && Math.random() < 0.01) {
            player.items.fuben2 = (player.items.fuben2 || 0) + 1;
            rewardText += "<br>获得秘境钥匙x1！";
        }
      if (map.quality >= 3 && Math.random() < 0.01) {
            player.items.zhiye1 = (player.items.zhiye1 || 0) + 1;
            rewardText += "<br>获得职业转换书x1！";
        }
    if (map.quality >= 2 && Math.random() < 0.1) {
            player.items.primaryGemq = (player.items.primaryGemq || 0) + 1;
            rewardText += "<br>获得宝藏金币x1！";
        }
    } else {
        // 直接获得奖励：随机选择2个奖励
        const rewards = [];
        const rewardCount = 2;
        
        for (let i = 0; i < rewardCount; i++) {
            const rewardIndex = Math.floor(Math.random() * levelConfig.rewards.length);
            const reward = levelConfig.rewards[rewardIndex];
            const amount = Math.ceil(reward.amount * qualityConfig.multiplier);
            
            // 添加奖励到玩家物品
            player.items[reward.type] = (player.items[reward.type] || 0) + amount;
            
            // 获取奖励名称
            let rewardName = "";
            switch (reward.type) {
                case "baitCount": rewardName = "鱼饵"; break;
                case "companionKey": rewardName = "伴侣钥匙"; break;
                case "vipPower": rewardName = "VIP能力值"; break;
                case "rose": rewardName = "玫瑰花"; break;
                case "primaryGem": rewardName = "初级宝石"; break;
                case "advancedGem": rewardName = "高级宝石"; break;
                case "superiorGem": rewardName = "极品宝石"; break;
                case "divineGem": rewardName = "神级宝石"; break;
                case "rebornDan": rewardName = "洗髓丹"; break;
                case "rootDetector": rewardName = "灵根检测器"; break;
                case "bloodlineDetector": rewardName = "血脉检测剂"; break;
              case "advanceStone": rewardName = "进阶神石"; break;
             case "yuzhou1": rewardName = "星尘发票"; break;
                case "yuzhou2": rewardName = "暗物质发票"; break;
                case "yuzhou3": rewardName = "宇宙晶体发票"; break;
              case "yuzhou4": rewardName = "神器碎片发票"; break;
            case "banlv1": rewardName = "普通伴侣灵魂"; break;
             case "banlv2": rewardName = "稀有伴侣灵魂"; break;
             case "banlv7": rewardName = "天使伴侣灵魂"; break;
          case "banlv8": rewardName = "恶魔伴侣灵魂"; break;
          case "fuben1": rewardName = "副本令牌"; break;
         case "zhiye1": rewardName = "职业转换书"; break;
              case "banlv9": rewardName = "精灵伴侣灵魂"; break;       
            }
            
            rewards.push(`${rewardName} x${amount}`);
        }
        
        rewardText = `获得奖励：${rewards.join("，")}`;
    }
    
    showTreasureReward(rewardText);
}

// 显示藏宝图奖励（自动宝图时不弹窗，手动开图照常显示）
function showTreasureReward(message) {
    if (treasureAutoUseEnabled) return;
    document.getElementById('treasureRewardContent').innerHTML = message;
    document.getElementById('treasureRewardOverlay').style.display = 'block';
    document.getElementById('treasureRewardUI').style.display = 'block';
}

// 关闭藏宝图奖励界面
function closeTreasureReward() {
    document.getElementById('treasureRewardOverlay').style.display = 'none';
    document.getElementById('treasureRewardUI').style.display = 'none';
}

// 在游戏加载时初始化藏宝图系统
function initTreasureMapSystem() {
    if (!player.treasure) {
        player.treasure = {
            keys: 0,
            maps: [],
            currentBattle: null
        };
    }
}
// 在战斗状态变化时更新状态提示
function updateTreasureBattleStatus() {
    const statusElement = document.getElementById('treasureBattleStatus');
    if (!statusElement) return;
    
    const battle = player.treasure.currentBattle;
    if (!battle) return;
    
    if (battle.battleEnded) {
        if (bLteZero(battle.monster.health)) {
            statusElement.textContent = "战斗胜利";
            statusElement.style.color = "#4CAF50";
        } else if (bLteZero(battle.playerHealth)) {
            statusElement.textContent = "战斗失败";
            statusElement.style.color = "#f44336";
        }
    } else {
        statusElement.textContent = "战斗中...";
        statusElement.style.color = "#FFC107";
    }
}

// 自动藏宝图相关状态
let treasureAutoUseEnabled = false;
let treasureAutoUseTimer = null;
let treasureAutoAttackTimer = null;
// 自动购买钥匙并开启宝箱（宝图数量低于10时触发）
let treasureAutoBuyKeyEnabled = false;
const TREASURE_AUTO_BUY_KEY_THRESHOLD = 10;

function isTreasureRewardOpen() {
    const ui = document.getElementById('treasureRewardUI');
    return ui && ui.style.display !== 'none';
}

function hasTreasureMap() {
    return player.treasure && Array.isArray(player.treasure.maps) && player.treasure.maps.length > 0;
}

function getTreasureAutoBuyKeyBatch() {
    const sel = document.getElementById('treasureAutoBuyKeyBatch');
    if (!sel) return 10;
    const v = parseInt(sel.value, 10);
    return (v === 10 || v === 20 || v === 50) ? v : 10;
}

function toggleTreasureAutoBuyKey() {
    treasureAutoBuyKeyEnabled = !treasureAutoBuyKeyEnabled;
    const btn = document.getElementById('treasureAutoBuyKeyToggle');
    if (btn) {
        btn.textContent = treasureAutoBuyKeyEnabled ? "开" : "关";
        btn.style.background = treasureAutoBuyKeyEnabled ? "#FF9800" : "#5c3a1e";
    }
}

// 自动购买钥匙并开启宝箱（星币扣费，批量开箱）
function doAutoBuyKeysAndOpenChest(batch) {
    if (!player.treasure || !player.nightClub) return false;
    const cost = batch * (typeof TREASURE_KEY_STAR_COIN_PRICE !== 'undefined' ? TREASURE_KEY_STAR_COIN_PRICE : 100000);
    if (player.nightClub.starCoins < cost) return false;
    const currentMaps = player.treasure.maps ? player.treasure.maps.length : 0;
    if (currentMaps >= 200 || currentMaps + batch > 200) return false;
    player.nightClub.starCoins -= cost;
    player.treasure.keys = (player.treasure.keys || 0) + batch;
    openTreasureChestBatch(batch);
    return true;
}

function toggleTreasureAutoUse() {
    treasureAutoUseEnabled = !treasureAutoUseEnabled;

    const btn = document.getElementById('treasureAutoUseToggle');
    if (btn) {
        btn.textContent = treasureAutoUseEnabled ? "自动宝图：开" : "自动宝图：关";
        btn.style.background = treasureAutoUseEnabled ? "#FF9800" : "#4CAF50";
    }

    if (treasureAutoUseEnabled) {
        startTreasureAutoUseLoop();
        startTreasureAutoAttackLoop();
    } else {
        stopTreasureAutoUseLoop();
        stopTreasureAutoAttackLoop();
    }
}

function startTreasureAutoUseLoop() {
    if (treasureAutoUseTimer) return;
    treasureAutoUseTimer = setInterval(() => {
        if (!treasureAutoUseEnabled) {
            stopTreasureAutoUseLoop();
            return;
        }

        // 战斗中就不重复用图
        const battle = player.treasure && player.treasure.currentBattle;
        if (battle && !battle.battleEnded) {
            return;
        }

        // 奖励界面弹出则自动关闭一次
        if (isTreasureRewardOpen()) {
            closeTreasureReward();
            return;
        }

        const mapCount = player.treasure && Array.isArray(player.treasure.maps) ? player.treasure.maps.length : 0;
        // 自动购买钥匙并开启宝箱：宝图数量低于10时，用星币购买钥匙并开宝箱
        if (treasureAutoBuyKeyEnabled && mapCount < TREASURE_AUTO_BUY_KEY_THRESHOLD) {
            const batch = getTreasureAutoBuyKeyBatch();
            if (doAutoBuyKeysAndOpenChest(batch)) {
                return;
            }
        }

        if (!hasTreasureMap()) {
            // 没图了，自动关闭
            toggleTreasureAutoUse();
            return;
        }

        // 默认使用第一张藏宝图
        useTreasureMap(0, true);
    }, 2000);
}

function stopTreasureAutoUseLoop() {
    if (treasureAutoUseTimer) {
        clearInterval(treasureAutoUseTimer);
        treasureAutoUseTimer = null;
    }
}

function startTreasureAutoAttackLoop() {
    if (treasureAutoAttackTimer) return;
    treasureAutoAttackTimer = setInterval(() => {
        if (!treasureAutoUseEnabled) {
            stopTreasureAutoAttackLoop();
            return;
        }

        const battle = player.treasure && player.treasure.currentBattle;
        if (!battle || battle.battleEnded) {
            return;
        }

        attackTreasureMonster();
    }, 500);
}

function stopTreasureAutoAttackLoop() {
    if (treasureAutoAttackTimer) {
        clearInterval(treasureAutoAttackTimer);
        treasureAutoAttackTimer = null;
    }
}
// 灵根配置
const rootConfig = {
    // 110%品阶
    tier1: [
        { name: "金灵根", bonus: 1.2 },
        { name: "木灵根", bonus: 1.2 },
        { name: "水灵根", bonus: 1.2 },
        { name: "火灵根", bonus: 1.25 },
        { name: "土灵根", bonus: 1.25 },
        { name: "雷灵根", bonus: 1.25 },
        { name: "杂灵根", bonus: 1.25 },
        { name: "钝金根", bonus: 1.2 },
        { name: "弱木根", bonus: 1.3 },
        { name: "浅水灵根", bonus: 1.3 },
        { name: "微火灵根", bonus: 1.3 },
        { name: "散土灵根", bonus: 1.4 },
        { name: "青禾根", bonus: 1.4 },
        { name: "溪水灵根", bonus: 1.4 },
        { name: "岩土根", bonus: 1.2 },
        { name: "铜铁根", bonus: 1.2 },
        { name: "三杂灵根", bonus: 1.2 },
        { name: "脆金根", bonus: 1.2 }
    ],
    // 200%品阶
    tier2: [
        { name: "深水灵根", bonus: 2.0 },
        { name: "炽火根", bonus: 2.0 },
        { name: "雷灵根", bonus: 2.0 },
        { name: "风灵根", bonus: 2.0 },
        { name: "冰灵根", bonus: 2.1 },
        { name: "沙灵根", bonus: 2.0 },
        { name: "雾灵根", bonus: 2.0 },
        { name: "藤木根", bonus: 2.0 },
        { name: "熔岩根", bonus: 2.0 },
        { name: "霜水灵根", bonus: 2.0 },
        { name: "晶金根", bonus: 2.0 },
        { name: "腐木根", bonus: 2.0 },
        { name: "冥水灵根", bonus: 2.1 },
        { name: "焦土根", bonus: 2.1 },
        { name: "双灵根", bonus: 2.1 },
        { name: "云灵根", bonus: 2.1 },
        { name: "毒木根", bonus: 2.1 },
        { name: "罡风根", bonus: 2.1 },
        { name: "寒铁根", bonus: 2.0 },
        { name: "焰木根", bonus: 2.1 },
        { name: "磁金根", bonus: 2.1 },
        { name: "酸水灵根", bonus: 2.0 }
    ],
    // 250%品阶
    tier3: [
        { name: "天灵根光", bonus: 2.5 },
        { name: "暗灵根", bonus: 2.5 },
        { name: "音灵根", bonus: 2.5 },
        { name: "影灵根", bonus: 2.5 },
        { name: "星辰灵根", bonus: 2.5 },
        { name: "月华灵根", bonus: 2.5 },
        { name: "日曦灵根", bonus: 2.5 },
        { name: "虚空灵根", bonus: 2.5 },
        { name: "时间灵根", bonus: 2.5 },
        { name: "圣灵根", bonus: 2.5 },
        { name: "魔灵根", bonus: 2.5 },
        { name: "晶玉灵根", bonus: 2.5 },
        { name: "云雾灵根", bonus: 2.5 },
        { name: "生死灵根", bonus: 2.5 },
        { name: "风火灵根", bonus: 2.5 },
        { name: "光暗灵根", bonus: 2.5 },
        { name: "山海灵根", bonus: 2.5 },
        { name: "混元灵根", bonus: 2.5 },
        { name: "灵植根", bonus: 2.5 },
        { name: "魂灵根", bonus: 2.5 }
    ],
    // 300%品阶
    tier4: [
        { name: "混沌灵根", bonus: 3.0 },
        { name: "鸿蒙灵根", bonus: 3.0 },
        { name: "先天灵根", bonus: 3.0 },
        { name: "虚无灵根", bonus: 3.0 },
        { name: "永恒灵根", bonus: 3.0 },
        { name: "本源灵根", bonus: 3.0 },
        { name: "万物灵根", bonus: 3.0 },
        { name: "太初灵根", bonus: 3.0 },
        { name: "轮回灵根", bonus: 3.0 }
    ],
    // 400%品阶
    tier5: [
        { name: "天道灵根", bonus: 4.0 },
        { name: "星辰本源根", bonus: 4.0 },
        { name: "混沌雷灵根", bonus: 4.0 },
        { name: "寂灭灵根", bonus: 4.0 },
        { name: "太极灵根", bonus: 4.0 }
    ],
    // 500%品阶
    tier6: [
        { name: "大道灵根", bonus: 5.0 },
        { name: "虚空混沌根", bonus: 5.0 },
        { name: "万化灵根", bonus: 5.0 },
        { name: "创世灵根", bonus: 5.0 }
    ],
    // 1000%品阶
    tier7: [
        { name: "无垢灵根", bonus: 10.0 }
    ]
};
const bloodlineConfig = {
    tier1: [
        { name: "凡骨血脉", bonus: 1.0 },
        { name: "麻瓜血脉", bonus: 1.0 },
        { name: "健魄血脉", bonus: 1.0 },
        { name: "灵慧血脉", bonus: 1.0 },
        { name: "野猪血脉", bonus: 1.0 },
        { name: "捷足血脉", bonus: 1.2 },
        { name: "锐目血脉", bonus: 1.2 },
        { name: "佩奇血脉", bonus: 1.2 },
        { name: "稳心血脉", bonus: 1.2 },
        { name: "厚土血脉", bonus: 1.2 }
    ],
    tier2: [
        { name: "天雷血脉", bonus: 1.3 },
        { name: "雷霆血脉", bonus: 1.3 },
        { name: "妖皇血脉", bonus: 1.3 },
        { name: "格斗神血脉", bonus: 1.3 },
        { name: "法神血脉", bonus: 1.3 },
        { name: "拳神血脉", bonus: 1.3 },
        { name: "命运血脉", bonus: 1.3 },
        { name: "太古大妖血脉", bonus: 1.3 },
        { name: "龙族血脉", bonus: 1.4 },
        { name: "邪神血脉", bonus: 1.4 },
        { name: "金龙王血脉", bonus: 1.4 },
        { name: "吞天血脉", bonus: 1.4 },
        { name: "鲲鹏血脉", bonus: 1.4 },
        { name: "穷奇血脉", bonus: 1.4 },
        { name: "灵狐血脉", bonus: 1.4 },
        { name: "烛龙血脉", bonus: 1.4 },
        { name: "神羽血脉", bonus: 1.4 }
    ],
    tier3: [
        { name: "瑞兽血脉", bonus: 1.5 },
        { name: "涅槃血脉", bonus: 1.5 },
        { name: "混沌神魔血脉", bonus: 1.5 },
        { name: "万界诸神血脉", bonus: 1.5 },
        { name: "剑神血脉", bonus: 1.5 },
        { name: "冥魂血脉", bonus: 1.5 },
        { name: "御世血脉", bonus: 1.6 },
        { name: "陆吾血脉", bonus: 1.6 },
        { name: "破邪血脉", bonus: 1.6 },
        { name: "蛟龙血脉", bonus: 1.6 },
        { name: "太阳之子血脉", bonus: 1.6 },
        { name: "大帝血脉", bonus: 1.6 }
    ],
    tier4: [
        { name: "麒麟血脉", bonus: 1.8 },
        { name: "玄武血脉", bonus: 1.8 },
        { name: "白虎血脉", bonus: 1.8 },
        { name: "齐天大圣血脉", bonus: 1.8 },
        { name: "黑山老妖血脉", bonus: 1.8 },
        { name: "神鸡血脉", bonus: 1.8 },
        { name: "宇智波血脉", bonus: 1.8 },
        { name: "漩涡血脉", bonus: 1.8 },
        { name: "疾风迅雷血脉", bonus: 1.8 }
    ],
    tier5: [
        { name: "朱雀血脉", bonus: 2.1 },
        { name: "青龙血脉", bonus: 2.1 },
        { name: "金刚不坏血脉", bonus: 2.5 },
        { name: "万钧巨力血脉", bonus: 2.1 },
        { name: "瞬影血脉", bonus: 2.5 },
        { name: "破妄真瞳血脉", bonus: 2.0 }
    ],
    tier6: [
        { name: "吞天噬地血脉", bonus: 2.5 },
        { name: "星辰之力血脉", bonus: 3.0 },
        { name: "大地脉动血脉", bonus: 3.0 },
        { name: "九天罡风血脉", bonus: 3.0 },
        { name: "幽冥暗影血脉", bonus: 3.0 }
    ],
    tier7: [
        { name: "鸿蒙紫气血脉", bonus: 4.0 },
        { name: "混沌本源血脉", bonus: 4.0 },
        { name: "万象森罗血脉", bonus: 4.0 },
        { name: "诸天法则血脉", bonus: 4.0 }
    ],
    tier8: [
        { name: "永恒不朽血脉", bonus: 5.0 },
        { name: "创世之光血脉", bonus: 5.0 },
        { name: "灭世之影血脉", bonus: 5.0 }
    ],
    tier9: [
        { name: "至高无上血脉", bonus: 10.0 }
    ]
};
// 修仙阶段配置
const cultivationStages = [
    { name: "凡人", expRequired: 0, multiplier: 1 },
    { name: "练气", expRequired: 10000, multiplier: 2 },
    { name: "筑基", expRequired: 20000, multiplier: 3 },
    { name: "灵动", expRequired: 40000, multiplier: 4 },
    { name: "灵虚", expRequired: 60000, multiplier: 5 },
    { name: "灵寂", expRequired: 80000, multiplier: 6 },
    { name: "开光", expRequired: 100000, multiplier: 7 },
    { name: "融合", expRequired: 200000, multiplier: 8 },
    { name: "聚丹", expRequired: 300000, multiplier: 9 },
    { name: "凝丹", expRequired: 400000, multiplier: 10 },
    { name: "韵丹", expRequired: 500000, multiplier: 15 },
    { name: "结丹", expRequired: 600000, multiplier: 20 },
    { name: "金丹", expRequired: 700000, multiplier: 25 },
    { name: "聚婴", expRequired: 800000, multiplier: 30 },
    { name: "凝婴", expRequired: 900000, multiplier: 35 },
    { name: "结婴", expRequired: 1000000, multiplier: 40 },
    { name: "元婴", expRequired: 1250000, multiplier: 45 },
    { name: "婴变", expRequired: 1500000, multiplier: 50 },
    { name: "出窍", expRequired: 1750000, multiplier: 55 },
    { name: "元神", expRequired: 2000000, multiplier: 60 },
    { name: "分神", expRequired: 2250000, multiplier: 65 },
    { name: "化神", expRequired: 2500000, multiplier: 70 },
    { name: "洞虚", expRequired: 2750000, multiplier: 75 },
    { name: "化虚", expRequired: 3000000, multiplier: 80 },
    { name: "返虚", expRequired: 3250000, multiplier: 85 },
    { name: "合体", expRequired: 3500000, multiplier: 90 },
    { name: "合灵", expRequired: 4000000, multiplier: 95 },
    { name: "合魂", expRequired: 4500000, multiplier: 100 },
    { name: "空冥", expRequired: 5000000, multiplier: 150 },
    { name: "寂灭", expRequired: 5250000, multiplier: 200 },
    { name: "问鼎", expRequired: 5500000, multiplier: 250 },
    { name: "问道", expRequired: 5750000, multiplier: 300 },
    { name: "合道", expRequired: 6000000, multiplier: 350 },
    { name: "大帝", expRequired: 6250000, multiplier: 400 },
    { name: "半仙", expRequired: 6500000, multiplier: 450 },
    { name: "渡劫", expRequired: 6750000, multiplier: 500 },
    { name: "人仙", expRequired: 7000000, multiplier: 550 },
    { name: "真仙", expRequired: 7250000, multiplier: 600 },
    { name: "上仙", expRequired: 7500000, multiplier: 650 },
    { name: "地仙", expRequired: 7750000, multiplier: 700 },
    { name: "天仙", expRequired: 8000000, multiplier: 750 },
    { name: "玄仙", expRequired: 8250000, multiplier: 800 },
    { name: "太乙", expRequired: 8500000, multiplier: 850 },
    { name: "九天", expRequired: 8750000, multiplier: 900 },
    { name: "金仙", expRequired: 9000000, multiplier: 950 },
    { name: "仙将", expRequired: 9250000, multiplier: 1000 },
    { name: "仙君", expRequired: 9500000, multiplier: 1500 },
    { name: "仙王", expRequired: 9750000, multiplier: 2000 },
    { name: "仙皇", expRequired: 10000000, multiplier: 2500 },
    { name: "仙尊", expRequired: 15000000, multiplier: 3000 },
    { name: "仙帝", expRequired: 20000000, multiplier: 3500 },
    { name: "半圣", expRequired: 25000000, multiplier: 4000 },
    { name: "真圣", expRequired: 30000000, multiplier: 4500 },
    { name: "人圣", expRequired: 35000000, multiplier: 5000 },
    { name: "地圣", expRequired: 40000000, multiplier: 5500 },
    { name: "天圣", expRequired: 45000000, multiplier: 6000 },
    { name: "玄圣", expRequired: 50000000, multiplier: 6500 },
    { name: "大圣", expRequired: 55000000, multiplier: 7000 },
    { name: "金圣", expRequired: 60000000, multiplier: 7500 },
    { name: "圣将", expRequired: 65000000, multiplier: 8000 },
    { name: "圣君", expRequired: 70000000, multiplier: 8500 },
    { name: "圣王", expRequired: 75000000, multiplier: 9000 },
    { name: "圣皇", expRequired: 80000000, multiplier: 9500 },
    { name: "圣尊", expRequired: 85000000, multiplier: 10000 },
    { name: "圣帝", expRequired: 90000000, multiplier: 12000 },
    { name: "半神", expRequired: 95000000, multiplier: 14000 },
    { name: "真神", expRequired: 100000000, multiplier: 16000 },
    { name: "人神", expRequired: 150000000, multiplier: 18000 },
    { name: "地神", expRequired: 200000000, multiplier: 20000 },
    { name: "天神", expRequired: 250000000, multiplier: 22000 },
    { name: "玄神", expRequired: 300000000, multiplier: 24000 },
    { name: "金神", expRequired: 350000000, multiplier: 26000 },
    { name: "神将", expRequired: 400000000, multiplier: 28000 },
    { name: "神灵", expRequired: 450000000, multiplier: 30000 },
    { name: "神王", expRequired: 500000000, multiplier: 32000 },
    { name: "神皇", expRequired: 550000000, multiplier: 34000 },
    { name: "神宗", expRequired: 600000000, multiplier: 36000 },
    { name: "神尊", expRequired: 650000000, multiplier: 38000 },
    { name: "神帝", expRequired: 700000000, multiplier: 40000 },
    { name: "荒帝", expRequired: 750000000, multiplier: 42000 },
    { name: "太荒", expRequired: 800000000, multiplier: 44000 },
    { name: "仙荒", expRequired: 850000000, multiplier: 46000 },
    { name: "神荒", expRequired: 900000000, multiplier: 48000 },
    { name: "荒古", expRequired: 1000000000, multiplier: 50000 },
    { name: "荒祖", expRequired: 1050000000, multiplier: 52000 },
    { name: "始荒", expRequired: 1100000000, multiplier: 54000 },
    { name: "人道", expRequired: 1150000000, multiplier: 56000 },
    { name: "天道", expRequired: 1200000000, multiplier: 58000 },
    { name: "仙道", expRequired: 1250000000, multiplier: 60000 },
    { name: "神道", expRequired: 1300000000, multiplier: 62000 },
    { name: "帝道", expRequired: 1350000000, multiplier: 64000 },
    { name: "轮回", expRequired: 1400000000, multiplier: 66000 },
    { name: "时空", expRequired: 1450000000, multiplier: 68000 },
    { name: "乾坤", expRequired: 1500000000, multiplier: 70000 },
    { name: "规则", expRequired: 1550000000, multiplier: 72000 },
    { name: "始祖", expRequired: 1600000000, multiplier: 74000 },
    { name: "元神", expRequired: 1650000000, multiplier: 76000 },
    { name: "人神", expRequired: 1700000000, multiplier: 78000 },
    { name: "仙神", expRequired: 1750000000, multiplier: 80000 },
    { name: "帝神", expRequired: 1800000000, multiplier: 82000 },
    { name: "主宰", expRequired: 1850000000, multiplier: 84000 },
    { name: "重生", expRequired: 1900000000, multiplier: 86000 },
    { name: "凡人★", expRequired: 1950000000, multiplier: 88000 },
    { name: "练气★", expRequired: 2000000000, multiplier: 90000 },
    { name: "筑基★", expRequired: 2050000000, multiplier: 92000 },
    { name: "灵动★", expRequired: 2100000000, multiplier: 94000 },
    { name: "灵虚★", expRequired: 2150000000, multiplier: 96000 },
    { name: "灵寂★", expRequired: 2200000000, multiplier: 98000 },
    { name: "开光★", expRequired: 2250000000, multiplier: 100000 },
    { name: "融合★", expRequired: 2300000000, multiplier: 102500 },
    { name: "聚丹★", expRequired: 2350000000, multiplier: 105000 },
    { name: "凝丹★", expRequired: 2400000000, multiplier: 107500 },
    { name: "韵丹★", expRequired: 2450000000, multiplier: 110000 },
    { name: "结丹★", expRequired: 2500000000, multiplier: 112500 },
    { name: "金丹★", expRequired: 2550000000, multiplier: 115000 },
    { name: "聚婴★", expRequired: 2600000000, multiplier: 117500 },
    { name: "凝婴★", expRequired: 2650000000, multiplier: 120000 },
    { name: "结婴★", expRequired: 2700000000, multiplier: 122500 },
    { name: "元婴★", expRequired: 2750000000, multiplier: 125000 },
    { name: "婴变★", expRequired: 2800000000, multiplier: 127500 },
    { name: "出窍★", expRequired: 2850000000, multiplier: 130000 },
    { name: "元神★", expRequired: 2900000000, multiplier: 132500 },
    { name: "分神★", expRequired: 2950000000, multiplier: 135000 },
    { name: "化神★", expRequired: 3000000000, multiplier: 137500 },
    { name: "洞虚★", expRequired: 3050000000, multiplier: 140000 },
    { name: "化虚★", expRequired: 3100000000, multiplier: 142500 },
    { name: "返虚★", expRequired: 3150000000, multiplier: 145000 },
    { name: "合体★", expRequired: 3200000000, multiplier: 147500 },
    { name: "合灵★", expRequired: 3250000000, multiplier: 150000 },
    { name: "合魂★", expRequired: 3300000000, multiplier: 152500 },
    { name: "空冥★", expRequired: 3350000000, multiplier: 155000 },
    { name: "寂灭★", expRequired: 3400000000, multiplier: 157500 },
    { name: "问鼎★", expRequired: 3450000000, multiplier: 160000 },
    { name: "问道★", expRequired: 3500000000, multiplier: 162500 },
    { name: "合道★", expRequired: 3550000000, multiplier: 165000 },
    { name: "大帝★", expRequired: 3600000000, multiplier: 167500 },
    { name: "半仙★", expRequired: 3650000000, multiplier: 170000 },
    { name: "渡劫★", expRequired: 3750000000, multiplier: 172500 },
    { name: "人仙★", expRequired: 3800000000, multiplier: 175000 },
    { name: "真仙★", expRequired: 3850000000, multiplier: 177500 },
    { name: "上仙★", expRequired: 3900000000, multiplier: 180000 },
    { name: "地仙★", expRequired: 3950000000, multiplier: 182500 },
    { name: "天仙★", expRequired: 4000000000, multiplier: 185000 },
    { name: "玄仙★", expRequired: 4050000000, multiplier: 187500 },
    { name: "太乙★", expRequired: 4100000000, multiplier: 190000 },
    { name: "九天★", expRequired: 4150000000, multiplier: 192500 },
    { name: "金仙★", expRequired: 4200000000, multiplier: 195000 },
    { name: "仙将★", expRequired: 4250000000, multiplier: 197500 },
    { name: "仙君★", expRequired: 4300000000, multiplier: 202500 },
    { name: "仙王★", expRequired: 4350000000, multiplier: 205000 },
    { name: "仙皇★", expRequired: 4400000000, multiplier: 207500 },
    { name: "仙尊★", expRequired: 4450000000, multiplier: 210000 },
    { name: "仙帝★", expRequired: 4500000000, multiplier: 212500 },
    { name: "半圣★", expRequired: 4550000000, multiplier: 215000 },
    { name: "真圣★", expRequired: 4600000000, multiplier: 217500 },
    { name: "人圣★", expRequired: 4650000000, multiplier: 220000 },
    { name: "地圣★", expRequired: 4700000000, multiplier: 222500 },
    { name: "天圣★", expRequired: 4750000000, multiplier: 225000 },
    { name: "玄圣★", expRequired: 4800000000, multiplier: 227500 },
    { name: "大圣★", expRequired: 4850000000, multiplier: 230000 },
    { name: "金圣★", expRequired: 4900000000, multiplier: 232500 },
    { name: "圣将★", expRequired: 4950000000, multiplier: 235000 },
    { name: "圣君★", expRequired: 5050000000, multiplier: 237500 },
    { name: "圣王★", expRequired: 5100000000, multiplier: 240000 },
    { name: "圣皇★", expRequired: 5150000000, multiplier: 242500 },
    { name: "圣尊★", expRequired: 5200000000, multiplier: 245000 },
    { name: "圣帝★", expRequired: 5250000000, multiplier: 247500 },
    { name: "半神★", expRequired: 5300000000, multiplier: 250000 },
    { name: "真神★", expRequired: 5350000000, multiplier: 252500 },
    { name: "人神★", expRequired: 5400000000, multiplier: 255000 },
    { name: "地神★", expRequired: 5450000000, multiplier: 257500 },
    { name: "天神★", expRequired: 5500000000, multiplier: 260000 },
    { name: "玄神★", expRequired: 5550000000, multiplier: 262500 },
    { name: "金神★", expRequired: 5600000000, multiplier: 265000 },
    { name: "神将★", expRequired: 5650000000, multiplier: 267500 },
    { name: "神灵★", expRequired: 5700000000, multiplier: 270000 },
    { name: "神王★", expRequired: 5750000000, multiplier: 272500 },
    { name: "神皇★", expRequired: 5800000000, multiplier: 275000 },
    { name: "神宗★", expRequired: 5850000000, multiplier: 277500 },
    { name: "神尊★", expRequired: 5900000000, multiplier: 280000 },
    { name: "神帝★", expRequired: 5950000000, multiplier: 282500 },
    { name: "荒帝★", expRequired: 6050000000, multiplier: 285000 },
    { name: "太荒★", expRequired: 6100000000, multiplier: 287500 },
    { name: "仙荒★", expRequired: 6150000000, multiplier: 290000 },
    { name: "神荒★", expRequired: 6200000000, multiplier: 292500 },
    { name: "荒古★", expRequired: 6250000000, multiplier: 295000 },
    { name: "荒祖★", expRequired: 6300000000, multiplier: 297500 },
    { name: "始荒★", expRequired: 6350000000, multiplier: 302500 },
    { name: "人道★", expRequired: 6400000000, multiplier: 305000 },
    { name: "天道★", expRequired: 6450000000, multiplier: 307500 },
    { name: "仙道★", expRequired: 6500000000, multiplier: 310000 },
    { name: "神道★", expRequired: 6550000000, multiplier: 312500 },
    { name: "帝道★", expRequired: 6600000000, multiplier: 315000 },
    { name: "轮回★", expRequired: 6650000000, multiplier: 317500 },
    { name: "时空★", expRequired: 6700000000, multiplier: 320000 },
    { name: "乾坤★", expRequired: 6750000000, multiplier: 322500 },
    { name: "规则★", expRequired: 6800000000, multiplier: 325000 },
    { name: "始祖★", expRequired: 6850000000, multiplier: 327500 },
    { name: "元神★", expRequired: 6900000000, multiplier: 330000 },
    { name: "人神★", expRequired: 6950000000, multiplier: 332500 },
    { name: "仙神★", expRequired: 7000000000, multiplier: 335000 },
    { name: "帝神★", expRequired: 7050000000, multiplier: 337500 },
    { name: "主宰★", expRequired: 10000000000, multiplier: 340000 },
     { name: "凡人★★", expRequired: 19500000000, multiplier: 880000 },
    { name: "练气★★", expRequired: 20000000000, multiplier: 900000 },
    { name: "筑基★★", expRequired: 20500000000, multiplier: 920000 },
    { name: "灵动★★", expRequired: 21000000000, multiplier: 940000 },
    { name: "灵虚★★", expRequired: 21500000000, multiplier: 960000 },
    { name: "灵寂★★", expRequired: 22000000000, multiplier: 980000 },
    { name: "开光★★", expRequired: 22500000000, multiplier: 1000000 },
    { name: "融合★★", expRequired: 23000000000, multiplier: 1025000 },
    { name: "聚丹★★", expRequired: 23500000000, multiplier: 1050000 },
    { name: "凝丹★★", expRequired: 24000000000, multiplier: 1075000 },
    { name: "韵丹★★", expRequired: 24500000000, multiplier: 1100000 },
    { name: "结丹★★", expRequired: 25000000000, multiplier: 1125000 },
    { name: "金丹★★", expRequired: 25500000000, multiplier: 1150000 },
    { name: "聚婴★★", expRequired: 26000000000, multiplier: 1175000 },
    { name: "凝婴★★", expRequired: 26500000000, multiplier: 1200000 },
    { name: "结婴★★", expRequired: 27000000000, multiplier: 1225000 },
    { name: "元婴★★", expRequired: 27500000000, multiplier: 1250000 },
    { name: "婴变★★", expRequired: 28000000000, multiplier: 1275000 },
    { name: "出窍★★", expRequired: 28500000000, multiplier: 1300000 },
    { name: "元神★★", expRequired: 29000000000, multiplier: 1325000 },
    { name: "分神★★", expRequired: 29500000000, multiplier: 1350000 },
    { name: "化神★★", expRequired: 30000000000, multiplier: 1375000 },
    { name: "洞虚★★", expRequired: 30500000000, multiplier: 1400000 },
    { name: "化虚★★", expRequired: 31000000000, multiplier: 1425000 },
    { name: "返虚★★", expRequired: 31500000000, multiplier: 1450000 },
    { name: "合体★★", expRequired: 32000000000, multiplier: 1475000 },
    { name: "合灵★★", expRequired: 32500000000, multiplier: 1500000 },
    { name: "合魂★★", expRequired: 33000000000, multiplier: 1525000 },
    { name: "空冥★★", expRequired: 33500000000, multiplier: 1550000 },
    { name: "寂灭★★", expRequired: 34000000000, multiplier: 1575000 },
    { name: "问鼎★★", expRequired: 34500000000, multiplier: 1600000 },
    { name: "问道★★", expRequired: 35000000000, multiplier: 1625000 },
    { name: "合道★★", expRequired: 35500000000, multiplier: 1650000 },
    { name: "大帝★★", expRequired: 36000000000, multiplier: 1675000 },
    { name: "半仙★★", expRequired: 36500000000, multiplier: 1700000 },
    { name: "渡劫★★", expRequired: 37500000000, multiplier: 1725000 },
    { name: "人仙★★", expRequired: 38000000000, multiplier: 1750000 },
    { name: "真仙★★", expRequired: 38500000000, multiplier: 1775000 },
    { name: "上仙★★", expRequired: 39000000000, multiplier: 1800000 },
    { name: "地仙★★", expRequired: 39500000000, multiplier: 1825000 },
    { name: "天仙★★", expRequired: 40000000000, multiplier: 1850000 },
    { name: "玄仙★★", expRequired: 40500000000, multiplier: 1875000 },
    { name: "太乙★★", expRequired: 41000000000, multiplier: 1900000 },
    { name: "九天★★", expRequired: 41500000000, multiplier: 1925000 },
    { name: "金仙★★", expRequired: 42000000000, multiplier: 1950000 },
    { name: "仙将★★", expRequired: 42500000000, multiplier: 1975000 },
    { name: "仙君★★", expRequired: 43000000000, multiplier: 2025000 },
    { name: "仙王★★", expRequired: 43500000000, multiplier: 2050000 },
    { name: "仙皇★★", expRequired: 44000000000, multiplier: 2075000 },
    { name: "仙尊★★", expRequired: 44500000000, multiplier: 2100000 },
    { name: "仙帝★★", expRequired: 45000000000, multiplier: 2125000 },
    { name: "半圣★★", expRequired: 45500000000, multiplier: 2150000 },
    { name: "真圣★★", expRequired: 46000000000, multiplier: 2175000 },
    { name: "人圣★★", expRequired: 46500000000, multiplier: 2200000 },
    { name: "地圣★★", expRequired: 47000000000, multiplier: 2225000 },
    { name: "天圣★★", expRequired: 47500000000, multiplier: 2250000 },
    { name: "玄圣★★", expRequired: 48000000000, multiplier: 2275000 },
    { name: "大圣★★", expRequired: 48500000000, multiplier: 2300000 },
    { name: "金圣★★", expRequired: 49000000000, multiplier: 2325000 },
    { name: "圣将★★", expRequired: 49500000000, multiplier: 2350000 },
    { name: "圣君★★", expRequired: 50500000000, multiplier: 2375000 },
    { name: "圣王★★", expRequired: 51000000000, multiplier: 2400000 },
    { name: "圣皇★★", expRequired: 51500000000, multiplier: 2425000 },
    { name: "圣尊★★", expRequired: 52000000000, multiplier: 2450000 },
    { name: "圣帝★★", expRequired: 52500000000, multiplier: 2475000 },
    { name: "半神★★", expRequired: 53000000000, multiplier: 2500000 },
    { name: "真神★★", expRequired: 53500000000, multiplier: 2525000 },
    { name: "人神★★", expRequired: 54000000000, multiplier: 2550000 },
    { name: "地神★★", expRequired: 54500000000, multiplier: 2575000 },
    { name: "天神★★", expRequired: 55000000000, multiplier: 2600000 },
    { name: "玄神★★", expRequired: 55500000000, multiplier: 2625000 },
    { name: "金神★★", expRequired: 56000000000, multiplier: 2650000 },
    { name: "神将★★", expRequired: 56500000000, multiplier: 2675000 },
    { name: "神灵★★", expRequired: 57000000000, multiplier: 2700000 },
    { name: "神王★★", expRequired: 57500000000, multiplier: 2725000 },
    { name: "神皇★★", expRequired: 58000000000, multiplier: 2750000 },
    { name: "神宗★★", expRequired: 58500000000, multiplier: 2775000 },
    { name: "神尊★★", expRequired: 59000000000, multiplier: 2800000 },
    { name: "神帝★★", expRequired: 59500000000, multiplier: 2825000 },
    { name: "荒帝★★", expRequired: 60500000000, multiplier: 2850000 },
    { name: "太荒★★", expRequired: 61000000000, multiplier: 2875000 },
    { name: "仙荒★★", expRequired: 61500000000, multiplier: 2900000 },
    { name: "神荒★★", expRequired: 62000000000, multiplier: 2925000 },
    { name: "荒古★★", expRequired: 62500000000, multiplier: 2950000 },
    { name: "荒祖★★", expRequired: 63000000000, multiplier: 2975000 },
    { name: "始荒★★", expRequired: 63500000000, multiplier: 3025000 },
    { name: "人道★★", expRequired: 64000000000, multiplier: 3050000 },
    { name: "天道★★", expRequired: 64500000000, multiplier: 3075000 },
    { name: "仙道★★", expRequired: 65000000000, multiplier: 3100000 },
    { name: "神道★★", expRequired: 65500000000, multiplier: 3125000 },
    { name: "帝道★★", expRequired: 66000000000, multiplier: 3150000 },
    { name: "轮回★★", expRequired: 66500000000, multiplier: 3175000 },
    { name: "时空★★", expRequired: 67000000000, multiplier: 3200000 },
    { name: "乾坤★★", expRequired: 67500000000, multiplier: 3225000 },
    { name: "规则★★", expRequired: 68000000000, multiplier: 3250000 },
    { name: "始祖★★", expRequired: 68500000000, multiplier: 3275000 },
    { name: "元神★★", expRequired: 69000000000, multiplier: 3300000 },
    { name: "人神★★", expRequired: 69500000000, multiplier: 3325000 },
    { name: "仙神★★", expRequired: 70000000000, multiplier: 3350000 },
    { name: "帝神★★", expRequired: 70500000000, multiplier: 3375000 },
    { name: "主宰★★", expRequired: 100000000000, multiplier: 3400000 },
    { name: "凡人★★★", expRequired: 150000000000, multiplier: 10000000 },
    { name: "练气★★★", expRequired: 200000000000, multiplier: 11000000 },
    { name: "筑基★★★", expRequired: 205000000000, multiplier: 12000000 },
    { name: "灵动★★★", expRequired: 210000000000, multiplier: 13000000 },
    { name: "灵虚★★★", expRequired: 215000000000, multiplier: 14000000 },
    { name: "灵寂★★★", expRequired: 220000000000, multiplier: 15000000 },
    { name: "开光★★★", expRequired: 225000000000, multiplier: 16000000 },
    { name: "融合★★★", expRequired: 230000000000, multiplier: 17250000 },
    { name: "聚丹★★★", expRequired: 235000000000, multiplier: 18500000 },
    { name: "凝丹★★★", expRequired: 240000000000, multiplier: 19750000 },
    { name: "韵丹★★★", expRequired: 245000000000, multiplier: 20000000 },
    { name: "结丹★★★", expRequired: 250000000000, multiplier: 21250000 },
    { name: "金丹★★★", expRequired: 255000000000, multiplier: 22500000 },
    { name: "聚婴★★★", expRequired: 260000000000, multiplier: 23750000 },
    { name: "凝婴★★★", expRequired: 265000000000, multiplier: 24000000 },
    { name: "结婴★★★", expRequired: 270000000000, multiplier: 25250000 },
    { name: "元婴★★★", expRequired: 275000000000, multiplier: 26500000 },
    { name: "婴变★★★", expRequired: 280000000000, multiplier: 27750000 },
    { name: "出窍★★★", expRequired: 285000000000, multiplier: 28000000 },
    { name: "元神★★★", expRequired: 290000000000, multiplier: 29250000 },
    { name: "分神★★★", expRequired: 295000000000, multiplier: 30500000 },
    { name: "化神★★★", expRequired: 300000000000, multiplier: 31750000 },
    { name: "洞虚★★★", expRequired: 305000000000, multiplier: 32000000 },
    { name: "化虚★★★", expRequired: 310000000000, multiplier: 33250000 },
    { name: "返虚★★★", expRequired: 315000000000, multiplier: 34500000 },
    { name: "合体★★★", expRequired: 320000000000, multiplier: 35750000 },
    { name: "合灵★★★", expRequired: 325000000000, multiplier: 36000000 },
    { name: "合魂★★★", expRequired: 330000000000, multiplier: 37250000 },
    { name: "空冥★★★", expRequired: 335000000000, multiplier: 38500000 },
    { name: "寂灭★★★", expRequired: 340000000000, multiplier: 39750000 },
    { name: "问鼎★★★", expRequired: 345000000000, multiplier: 40000000 },
    { name: "问道★★★", expRequired: 350000000000, multiplier: 41250000 },
    { name: "合道★★★", expRequired: 355000000000, multiplier: 42500000 },
    { name: "大帝★★★", expRequired: 360000000000, multiplier: 43750000 },
    { name: "半仙★★★", expRequired: 365000000000, multiplier: 44000000 },
    { name: "渡劫★★★", expRequired: 375000000000, multiplier: 45250000 },
    { name: "人仙★★★", expRequired: 380000000000, multiplier: 46500000 },
    { name: "真仙★★★", expRequired: 385000000000, multiplier: 47750000 },
    { name: "上仙★★★", expRequired: 390000000000, multiplier: 48000000 },
    { name: "地仙★★★", expRequired: 395000000000, multiplier: 49250000 },
    { name: "天仙★★★", expRequired: 400000000000, multiplier: 50500000 },
    { name: "玄仙★★★", expRequired: 405000000000, multiplier: 51750000 },
    { name: "太乙★★★", expRequired: 410000000000, multiplier: 52000000 },
    { name: "九天★★★", expRequired: 415000000000, multiplier: 53250000 },
    { name: "金仙★★★", expRequired: 420000000000, multiplier: 54500000 },
    { name: "仙将★★★", expRequired: 425000000000, multiplier: 55750000 },
    { name: "仙君★★★", expRequired: 430000000000, multiplier: 56250000 },
    { name: "仙王★★★", expRequired: 435000000000, multiplier: 57500000 },
    { name: "仙皇★★★", expRequired: 440000000000, multiplier: 58750000 },
    { name: "仙尊★★★", expRequired: 445000000000, multiplier: 59000000 },
    { name: "仙帝★★★", expRequired: 450000000000, multiplier: 60250000 },
    { name: "半圣★★★", expRequired: 455000000000, multiplier: 61500000 },
    { name: "真圣★★★", expRequired: 460000000000, multiplier: 62750000 },
    { name: "人圣★★★", expRequired: 465000000000, multiplier: 63000000 },
    { name: "地圣★★★", expRequired: 470000000000, multiplier: 64250000 },
    { name: "天圣★★★", expRequired: 475000000000, multiplier: 65500000 },
    { name: "玄圣★★★", expRequired: 480000000000, multiplier: 66750000 },
    { name: "大圣★★★", expRequired: 485000000000, multiplier: 67000000 },
    { name: "金圣★★★", expRequired: 490000000000, multiplier: 68250000 },
    { name: "圣将★★★", expRequired: 495000000000, multiplier: 69500000 },
    { name: "圣君★★★", expRequired: 505000000000, multiplier: 70750000 },
    { name: "圣王★★★", expRequired: 510000000000, multiplier: 71000000 },
    { name: "圣皇★★★", expRequired: 515000000000, multiplier: 72250000 },
    { name: "圣尊★★★", expRequired: 520000000000, multiplier: 73500000 },
    { name: "圣帝★★★", expRequired: 525000000000, multiplier: 74750000 },
    { name: "半神★★★", expRequired: 530000000000, multiplier: 75000000 },
    { name: "真神★★★", expRequired: 535000000000, multiplier: 76250000 },
    { name: "人神★★★", expRequired: 540000000000, multiplier: 77500000 },
    { name: "地神★★★", expRequired: 545000000000, multiplier: 78750000 },
    { name: "天神★★★", expRequired: 550000000000, multiplier: 79000000 },
    { name: "玄神★★★", expRequired: 555000000000, multiplier: 80250000 },
    { name: "金神★★★", expRequired: 560000000000, multiplier: 81500000 },
    { name: "神将★★★", expRequired: 565000000000, multiplier: 82750000 },
    { name: "神灵★★★", expRequired: 570000000000, multiplier: 83000000 },
    { name: "神王★★★", expRequired: 575000000000, multiplier: 84250000 },
    { name: "神皇★★★", expRequired: 580000000000, multiplier: 85500000 },
    { name: "神宗★★★", expRequired: 585000000000, multiplier: 86750000 },
    { name: "神尊★★★", expRequired: 590000000000, multiplier: 87000000 },
    { name: "神帝★★★", expRequired: 595000000000, multiplier: 88250000 },
    { name: "荒帝★★★", expRequired: 605000000000, multiplier: 89500000 },
    { name: "太荒★★★", expRequired: 610000000000, multiplier: 90750000 },
    { name: "仙荒★★★", expRequired: 615000000000, multiplier: 91000000 },
    { name: "神荒★★★", expRequired: 620000000000, multiplier: 92250000 },
    { name: "荒古★★★", expRequired: 625000000000, multiplier: 93500000 },
    { name: "荒祖★★★", expRequired: 630000000000, multiplier: 94750000 },
    { name: "始荒★★★", expRequired: 635000000000, multiplier: 95250000 },
    { name: "人道★★★", expRequired: 640000000000, multiplier: 96500000 },
    { name: "天道★★★", expRequired: 645000000000, multiplier: 97750000 },
    { name: "仙道★★★", expRequired: 650000000000, multiplier: 98000000 },
    { name: "神道★★★", expRequired: 655000000000, multiplier: 99250000 },
    { name: "帝道★★★", expRequired: 660000000000, multiplier: 101500000 },
    { name: "轮回★★★", expRequired: 665000000000, multiplier: 110750000 },
    { name: "时空★★★", expRequired: 670000000000, multiplier: 120000000 },
    { name: "乾坤★★★", expRequired: 675000000000, multiplier: 130250000 },
    { name: "规则★★★", expRequired: 680000000000, multiplier: 142500000 },
    { name: "始祖★★★", expRequired: 685000000000, multiplier: 152750000 },
    { name: "元神★★★", expRequired: 690000000000, multiplier: 163000000 },
    { name: "人神★★★", expRequired: 695000000000, multiplier: 175250000 },
    { name: "仙神★★★", expRequired: 700000000000, multiplier: 187500000 },
    { name: "帝神★★★", expRequired: 705000000000, multiplier: 198750000 },
    { name: "主宰★★★", expRequired: 800000000000, multiplier: 204000000 },
    { name: "凡人★★★★", expRequired: 1000000000000, multiplier: 1040000000 },
    { name: "练气★★★★", expRequired: 1200000000000, multiplier: 1100000000 },
    { name: "筑基★★★★", expRequired: 1205000000000, multiplier: 1200000000 },
    { name: "灵动★★★★", expRequired: 1210000000000, multiplier: 1300000000 },
    { name: "灵虚★★★★", expRequired: 1215000000000, multiplier: 1400000000 },
    { name: "灵寂★★★★", expRequired: 1220000000000, multiplier: 1500000000 },
    { name: "开光★★★★", expRequired: 1225000000000, multiplier: 1600000000 },
    { name: "融合★★★★", expRequired: 1230000000000, multiplier: 1725000000 },
    { name: "聚丹★★★★", expRequired: 1235000000000, multiplier: 1850000000 },
    { name: "凝丹★★★★", expRequired: 1240000000000, multiplier: 1975000000 },
    { name: "韵丹★★★★", expRequired: 1245000000000, multiplier: 2000000000 },
    { name: "结丹★★★★", expRequired: 1250000000000, multiplier: 2125000000 },
    { name: "金丹★★★★", expRequired: 1255000000000, multiplier: 2250000000 },
    { name: "聚婴★★★★", expRequired: 1260000000000, multiplier: 2375000000 },
    { name: "凝婴★★★★", expRequired: 1265000000000, multiplier: 2400000000 },
    { name: "结婴★★★★", expRequired: 1270000000000, multiplier: 2525000000 },
    { name: "元婴★★★★", expRequired: 1275000000000, multiplier: 2650000000 },
    { name: "婴变★★★★", expRequired: 1280000000000, multiplier: 2775000000 },
    { name: "出窍★★★★", expRequired: 1285000000000, multiplier: 2800000000 },
    { name: "元神★★★★", expRequired: 1290000000000, multiplier: 2925000000 },
    { name: "分神★★★★", expRequired: 1295000000000, multiplier: 3050000000 },
    { name: "化神★★★★", expRequired: 1300000000000, multiplier: 3175000000 },
    { name: "洞虚★★★★", expRequired: 1305000000000, multiplier: 3200000000 },
    { name: "化虚★★★★", expRequired: 1310000000000, multiplier: 3325000000 },
    { name: "返虚★★★★", expRequired: 1315000000000, multiplier: 3450000000 },
    { name: "合体★★★★", expRequired: 1320000000000, multiplier: 3575000000 },
    { name: "合灵★★★★", expRequired: 1325000000000, multiplier: 3600000000 },
    { name: "合魂★★★★", expRequired: 1330000000000, multiplier: 3725000000 },
    { name: "空冥★★★★", expRequired: 1335000000000, multiplier: 3850000000 },
    { name: "寂灭★★★★", expRequired: 1340000000000, multiplier: 3975000000 },
    { name: "问鼎★★★★", expRequired: 1345000000000, multiplier: 4000000000 },
    { name: "问道★★★★", expRequired: 1350000000000, multiplier: 4125000000 },
    { name: "合道★★★★", expRequired: 1355000000000, multiplier: 4250000000 },
    { name: "大帝★★★★", expRequired: 1360000000000, multiplier: 4375000000 },
    { name: "半仙★★★★", expRequired: 1365000000000, multiplier: 4400000000 },
    { name: "渡劫★★★★", expRequired: 1375000000000, multiplier: 4525000000 },
    { name: "人仙★★★★", expRequired: 1380000000000, multiplier: 4650000000 },
    { name: "真仙★★★★", expRequired: 1385000000000, multiplier: 4775000000 },
    { name: "上仙★★★★", expRequired: 1390000000000, multiplier: 4800000000 },
    { name: "地仙★★★★", expRequired: 1395000000000, multiplier: 4925000000 },
    { name: "天仙★★★★", expRequired: 1400000000000, multiplier: 5050000000 },
    { name: "玄仙★★★★", expRequired: 1405000000000, multiplier: 5175000000 },
    { name: "太乙★★★★", expRequired: 1410000000000, multiplier: 5200000000 },
    { name: "九天★★★★", expRequired: 1415000000000, multiplier: 5325000000 },
    { name: "金仙★★★★", expRequired: 1420000000000, multiplier: 5450000000 },
    { name: "仙将★★★★", expRequired: 1425000000000, multiplier: 5575000000 },
    { name: "仙君★★★★", expRequired: 1430000000000, multiplier: 5625000000 },
    { name: "仙王★★★★", expRequired: 1435000000000, multiplier: 5750000000 },
    { name: "仙皇★★★★", expRequired: 1440000000000, multiplier: 5875000000 },
    { name: "仙尊★★★★", expRequired: 1445000000000, multiplier: 5900000000 },
    { name: "仙帝★★★★", expRequired: 1450000000000, multiplier: 6025000000 },
    { name: "半圣★★★★", expRequired: 1455000000000, multiplier: 6150000000 },
    { name: "真圣★★★★", expRequired: 1460000000000, multiplier: 6275000000 },
    { name: "人圣★★★★", expRequired: 1465000000000, multiplier: 6300000000 },
    { name: "地圣★★★★", expRequired: 1470000000000, multiplier: 6425000000 },
    { name: "天圣★★★★", expRequired: 1475000000000, multiplier: 6550000000 },
    { name: "玄圣★★★★", expRequired: 1480000000000, multiplier: 6675000000 },
    { name: "大圣★★★★", expRequired: 1485000000000, multiplier: 6700000000 },
    { name: "金圣★★★★", expRequired: 1490000000000, multiplier: 6825000000 },
    { name: "圣将★★★★", expRequired: 1495000000000, multiplier: 6950000000 },
    { name: "圣君★★★★", expRequired: 1505000000000, multiplier: 7075000000 },
    { name: "圣王★★★★", expRequired: 1510000000000, multiplier: 7100000000 },
    { name: "圣皇★★★★", expRequired: 1515000000000, multiplier: 7225000000 },
    { name: "圣尊★★★★", expRequired: 1520000000000, multiplier: 7350000000 },
    { name: "圣帝★★★★", expRequired: 1525000000000, multiplier: 7475000000 },
    { name: "半神★★★★", expRequired: 1530000000000, multiplier: 7500000000 },
    { name: "真神★★★★", expRequired: 1535000000000, multiplier: 7625000000 },
    { name: "人神★★★★", expRequired: 1540000000000, multiplier: 7750000000 },
    { name: "地神★★★★", expRequired: 1545000000000, multiplier: 7875000000 },
    { name: "天神★★★★", expRequired: 1550000000000, multiplier: 7900000000 },
    { name: "玄神★★★★", expRequired: 1555000000000, multiplier: 8025000000 },
    { name: "金神★★★★", expRequired: 1560000000000, multiplier: 8150000000 },
    { name: "神将★★★★", expRequired: 1565000000000, multiplier: 8275000000 },
    { name: "神灵★★★★", expRequired: 1570000000000, multiplier: 8300000000 },
    { name: "神王★★★★", expRequired: 1575000000000, multiplier: 8425000000 },
    { name: "神皇★★★★", expRequired: 1580000000000, multiplier: 8550000000 },
    { name: "神宗★★★★", expRequired: 1585000000000, multiplier: 8675000000 },
    { name: "神尊★★★★", expRequired: 1590000000000, multiplier: 8700000000 },
    { name: "神帝★★★★", expRequired: 1595000000000, multiplier: 8825000000 },
    { name: "荒帝★★★★", expRequired: 1605000000000, multiplier: 8950000000 },
    { name: "太荒★★★★", expRequired: 1610000000000, multiplier: 9075000000 },
    { name: "仙荒★★★★", expRequired: 1615000000000, multiplier: 9100000000 },
    { name: "神荒★★★★", expRequired: 1620000000000, multiplier: 9225000000 },
    { name: "荒古★★★★", expRequired: 1625000000000, multiplier: 9350000000 },
    { name: "荒祖★★★★", expRequired: 1630000000000, multiplier: 9475000000 },
    { name: "始荒★★★★", expRequired: 1635000000000, multiplier: 9525000000 },
    { name: "人道★★★★", expRequired: 1640000000000, multiplier: 9650000000 },
    { name: "天道★★★★", expRequired: 1645000000000, multiplier: 9775000000 },
    { name: "仙道★★★★", expRequired: 1650000000000, multiplier: 9800000000 },
    { name: "神道★★★★", expRequired: 1655000000000, multiplier: 9925000000 },
    { name: "帝道★★★★", expRequired: 1660000000000, multiplier: 10150000000 },
    { name: "轮回★★★★", expRequired: 1665000000000, multiplier: 11075000000 },
    { name: "时空★★★★", expRequired: 1670000000000, multiplier: 12000000000 },
    { name: "乾坤★★★★", expRequired: 1675000000000, multiplier: 13025000000 },
    { name: "规则★★★★", expRequired: 1680000000000, multiplier: 14250000000 },
    { name: "始祖★★★★", expRequired: 1685000000000, multiplier: 15275000000 },
    { name: "元神★★★★", expRequired: 1690000000000, multiplier: 16300000000 },
    { name: "人神★★★★", expRequired: 1695000000000, multiplier: 17525000000 },
    { name: "仙神★★★★", expRequired: 1700000000000, multiplier: 18750000000 },
    { name: "帝神★★★★", expRequired: 1705000000000, multiplier: 19875000000 },
    { name: "主宰★★★★", expRequired: 2000000000000, multiplier: 20400000000 }
];

// 初始化修仙系统

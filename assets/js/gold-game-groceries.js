// 杂货铺与法则
// 杂货铺功能
function toggleGroceriesUI() {
if (player.reincarnationCount < 400) {
        alert("需要达到400转才能开启杂货铺！");
        return;
    }
    const ui = document.getElementById('groceriesUI');
    const overlay = document.getElementById('groceriesOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateGroceriesUI();
    }
}

function updateGroceriesUI() {
    // 更新星尘数量显示
    document.getElementById('currentStardust').textContent = getExplorationResources().stardust || 0;
}

function exchangeStardust(type) {
    const exchangeRates = {
        bait: { cost: 100, item: 'baitCount', amount: parseInt(document.getElementById('baitAmount').value), coinRate: 2 },
        key: { cost: 200, item: 'companionKey', amount: parseInt(document.getElementById('keyAmount').value) },
        rose: { cost: 100, item: 'rose', amount: parseInt(document.getElementById('roseAmount').value), coinRate: 20 },
        vip: { cost: 100, item: 'vipPower', amount: parseInt(document.getElementById('vipAmount').value), coinRate: 10 },
        gem: { cost: 5000, item: 'divineGem', amount: parseInt(document.getElementById('gemAmount').value) },
        root: { cost: 500, item: 'rootDetector', amount: parseInt(document.getElementById('rootAmount').value) },
        blood: { cost: 500, item: 'bloodlineDetector', amount: parseInt(document.getElementById('bloodAmount').value) },
        coin: { cost: 100, item: 'reincarnationCoin', amount: parseInt(document.getElementById('coinAmount').value), coinRate: 1000000 }
    };
    
    const config = exchangeRates[type];
    if (!config) return;
    
    // 输入验证
    if (isNaN(config.amount) || config.amount <= 0) {
        logAction("请输入有效的兑换数量！", "error");
        return;
    }
    
    const totalCost = config.cost * config.amount;
    var expResGrocery = getExplorationResources();
    const stardust = expResGrocery.stardust || 0;
    
    if (stardust < totalCost) {
        logAction("星尘不足！", "error");
        return;
    }
    
    expResGrocery.stardust -= totalCost;
    syncExplorationDataToPlayer();
    
    // 修复点：所有带coinRate的物品都应用倍数
    const multiplier = config.coinRate || 1;
    const actualAmount = config.amount * multiplier;
    
    if (type === 'coin') {
        player[config.item] += actualAmount;
    } else {
        player.items[config.item] = (player.items[config.item] || 0) + actualAmount;
    }
    
    logAction(`成功兑换: ${actualAmount}${getItemName(type)}`, "success");
    updateGroceriesUI();
    updateDisplay();
    saveGame();
}

function getItemName(type) {
    const names = {
        bait: "鱼饵",
        key: "伴侣钥匙",
        rose: "玫瑰花",
        vip: "VIP能力值",
        gem: "神级宝石",
       root: "灵根检测器",
       blood: "血脉检测剂",
        coin: "转生币"
    };
    return names[type] || "物品";
}

function ensureLawPowerData() {
    if (!player.lawPower || typeof player.lawPower !== 'object') {
        player.lawPower = {};
    }
    const keys = ['attack', 'health', 'critDamage', 'critRate', 'worldExp', 'cultivationExp', 'mysteryExp'];
    keys.forEach(function(k) {
        if (!Number.isFinite(Number(player.lawPower[k]))) player.lawPower[k] = 0;
        player.lawPower[k] = Math.max(0, Math.floor(Number(player.lawPower[k]) || 0));
    });
    if (!player.items || typeof player.items !== 'object') player.items = {};
    if (!Number.isFinite(Number(player.items.lawPowerMaterial))) player.items.lawPowerMaterial = 0;
}

function getLawPowerBonuses() {
    ensureLawPowerData();
    return {
        attack: (player.lawPower.attack || 0) * 1.0,
        health: (player.lawPower.health || 0) * 0.5,
        critDamage: (player.lawPower.critDamage || 0) * 1.0,
        critRate: (player.lawPower.critRate || 0) * 0.10,
        worldExp: (player.lawPower.worldExp || 0) * 0.10,
        cultivationExp: (player.lawPower.cultivationExp || 0) * 0.10,
        mysteryExp: (player.lawPower.mysteryExp || 0) * 0.10
    };
}

function toggleLawPowerSystem() {
    ensureLawPowerData();
    if ((player.level && player.level.ascentionCounta ? player.level.ascentionCounta : 0) < 13) {
        logAction('法则之力需轮回13转开启！', 'error');
        return;
    }
    const ui = document.getElementById('lawPowerUI');
    const overlay = document.getElementById('lawPowerOverlay');
    if (!ui || !overlay) return;
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateLawPowerUI();
    }
}

function updateLawPowerUI() {
    ensureLawPowerData();
    const listEl = document.getElementById('lawPowerList');
    const matEl = document.getElementById('lawPowerMaterialCount');
    if (!listEl || !matEl) return;
    matEl.textContent = Math.floor(Number(player.items.lawPowerMaterial) || 0);
    const defs = [
        { key: 'attack', name: '攻击法则', per: '每级 +100% 攻击', unit: '%' },
        { key: 'health', name: '生命法则', per: '每级 +50% 生命', unit: '%' },
        { key: 'critDamage', name: '爆伤法则', per: '每级 +100% 爆伤', unit: '%' },
        { key: 'critRate', name: '暴击法则', per: '每级 +10% 暴击率', unit: '%' },
        { key: 'worldExp', name: '世界经验法则', per: '每级 +10% 世界地图经验', unit: '%' },
        { key: 'cultivationExp', name: '修仙法则', per: '每级 +10% 修仙经验', unit: '%' },
        { key: 'mysteryExp', name: '奥秘法则', per: '每级 +10% 奥秘经验', unit: '%' }
    ];
    const bonus = getLawPowerBonuses();
    listEl.innerHTML = defs.map(function(d) {
        const lv = player.lawPower[d.key] || 0;
        const nextCost = lv + 1;
        const pct = ((bonus[d.key] || 0) * 100).toFixed(1);
        return '<div style="background: rgba(255,255,255,0.04); border:1px solid rgba(212,177,90,0.35); border-radius:10px; padding:10px;">'
            + '<div style="font-weight:bold; color:#ffe49c;">' + d.name + '</div>'
            + '<div style="font-size:12px; color:#d8c8a1; margin:4px 0;">' + d.per + '</div>'
            + '<div style="font-size:13px; color:#ffd54f;">等级 Lv.' + lv + ' ｜ 当前加成 +' + pct + d.unit + '</div>'
            + '<button onclick="upgradeLawPower(\'' + d.key + '\')" style="margin-top:8px; background:linear-gradient(180deg,#6e5320,#4f3a14); color:#ffeec8; border:1px solid #d4b15a; padding:6px 10px; border-radius:8px; cursor:pointer;">升级（消耗' + nextCost + '材料）</button>'
            + '</div>';
    }).join('');
}

function upgradeLawPower(key) {
    ensureLawPowerData();
    if ((player.level && player.level.ascentionCounta ? player.level.ascentionCounta : 0) < 13) {
        logAction('法则之力需轮回13转开启！', 'error');
        return;
    }
    const valid = ['attack', 'health', 'critDamage', 'critRate', 'worldExp', 'cultivationExp', 'mysteryExp'];
    if (!valid.includes(key)) return;
    const material = Math.floor(Number(player.items.lawPowerMaterial) || 0);
    const currentLevel = Math.floor(Number(player.lawPower[key]) || 0);
    const cost = currentLevel + 1;
    if (material < cost) {
        logAction('法则之力材料不足！', 'error');
        return;
    }
    player.items.lawPowerMaterial = material - cost;
    player.lawPower[key] = (player.lawPower[key] || 0) + 1;
    logAction('法则升级成功：' + key + ' Lv.' + player.lawPower[key] + '（消耗' + cost + '材料）', 'success');
    updateLawPowerUI();
    updateDisplay();
    if (typeof saveGame === 'function') saveGame({ silent: true });
}

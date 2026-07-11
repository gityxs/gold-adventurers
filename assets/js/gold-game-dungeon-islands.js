// 副本岛屿
// 切换黑龙潭副本界面
function toggleBlackDragonAbyss() {
    if (player.level.ascentionCounta < 1) {
        alert("需要达到轮回1转才能开启黑龙潭副本！");
        return;
    }
    const overlay = document.getElementById('blackDragonAbyssOverlay');
    const ui = document.getElementById('blackDragonAbyssUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateBlackDragonAbyssUI();
    }
}

// 更新黑龙潭副本UI
function updateBlackDragonAbyssUI() {
    // 更新副本令牌数量
    document.getElementById('dungeonTokenCount').textContent = player.items.fuben1 || 0;
    
    // 更新玩家属性
    document.getElementById('bdaPlayerHealth').textContent = formatSci(blackDragonAbyss.playerHealth);
    document.getElementById('bdaPlayerAttack').textContent = formatSci(blackDragonAbyss.playerAttack);
    document.getElementById('bdaPlayerCritRate').textContent = (blackDragonAbyss.playerCritRate * 100).toFixed(2) + '%';
    document.getElementById('bdaPlayerCritDamage').textContent = (blackDragonAbyss.playerCritDamage * 100).toFixed(2) + '%';
    
    // 更新BOSS属性
    document.getElementById('bdaBossLevel').textContent = blackDragonAbyss.bossLevel;
    document.getElementById('bdaBossHealth').textContent = formatSci(blackDragonAbyss.bossHealth);
    document.getElementById('bdaBossMaxHealth').textContent = formatSci(blackDragonAbyss.bossMaxHealth);
    document.getElementById('bdaBossAttack').textContent = formatSci(blackDragonAbyss.bossAttack);
    document.getElementById('bdaBossResurrections').textContent = blackDragonAbyss.bossResurrections;
}

// 开始黑龙王战斗
function startBlackDragonBattle() {
    // 检查是否有副本令牌
    if (player.items.fuben1 < 1) {
        logAction("副本令牌不足！", "error");
        return;
    }
    
    // 消耗副本令牌
    player.items.fuben1--;
    
    // 重置BOSS状态
    blackDragonAbyss.bossLevel = 1;
    blackDragonAbyss.bossHealth = 1e50;
    blackDragonAbyss.bossMaxHealth = 1e50;
    blackDragonAbyss.bossAttack = 1e5;
    blackDragonAbyss.bossResurrections = 0;
    
    // 设置玩家战斗属性
    blackDragonAbyss.playerMaxHealth = player.battle.playerHealth;
    blackDragonAbyss.playerHealth = player.battle.playerHealth;
    blackDragonAbyss.playerAttack = player.battle.playerAttack;
    blackDragonAbyss.playerCritRate = player.battle.playerCritRate;
    blackDragonAbyss.playerCritDamage = player.battle.playerCritDamage;
    
    // 开始战斗
    blackDragonAbyss.isBattleActive = true;
    
    // 更新UI
    document.getElementById('startBattleBtn').style.display = 'none';
    document.getElementById('attackBossBtn').style.display = 'inline-block';
    document.getElementById('fleeBossBtn').style.display = 'inline-block';
    
    // 清空战斗日志
    document.getElementById('bdaBattleLog').innerHTML = '';
    
    // 添加战斗开始日志
    addBdaBattleLog("战斗开始！挑战黑龙王(Lv.1)");
    addBdaBattleLog("黑龙王: 蝼蚁，也敢挑战本王？");
    
    updateBlackDragonAbyssUI();
}

// 攻击黑龙王
function attackBlackDragon() {
    if (!blackDragonAbyss.isBattleActive) return;
    
    // 玩家攻击
    let isCrit = Math.random() < blackDragonAbyss.playerCritRate;
    let damage = bigSciToStorageValue(blackDragonAbyss.playerAttack);
    if (isCrit) damage = multiplyBigByFinite(damage, blackDragonAbyss.playerCritDamage);
    
    blackDragonAbyss.bossHealth = bSub(blackDragonAbyss.bossHealth, damage);
    
    addBdaBattleLog(`你对黑龙王造成${formatSci(damage)}点${isCrit ? "暴击 " : ""}伤害`);
    
    // 检查BOSS是否死亡
    if (bLteZero(blackDragonAbyss.bossHealth)) {
        handleBossDefeated();
        return; // 直接返回，不执行后续的BOSS反击
    }
    
    // BOSS反击（仅在BOSS未死亡时执行）
    let bossDamage = blackDragonAbyss.bossAttack;
    blackDragonAbyss.playerHealth = bSub(blackDragonAbyss.playerHealth, bossDamage);
    
    addBdaBattleLog(`黑龙王对你造成${formatSci(bossDamage)}点伤害`);
    
    // 检查玩家是否死亡
    if (bLteZero(blackDragonAbyss.playerHealth)) {
        handlePlayerDefeated();
        return;
    }
    
    updateBlackDragonAbyssUI();
}

// 处理BOSS被击败
function handleBossDefeated() {
    // 检查BOSS复活次数
    if (blackDragonAbyss.bossResurrections < 10) {
        // BOSS复活
        blackDragonAbyss.bossResurrections++;
        blackDragonAbyss.bossHealth = bMul(blackDragonAbyss.bossMaxHealth, Math.pow(2, blackDragonAbyss.bossResurrections));
        blackDragonAbyss.bossAttack = bMul(blackDragonAbyss.bossAttack, 2);
        
        addBdaBattleLog(`黑龙王复活了！(第${blackDragonAbyss.bossResurrections}次复活)`);
        addBdaBattleLog("黑龙王: 你无法杀死我！");
        
        // 新增：BOSS复活后立即攻击玩家
        bossResurrectionAttack();
    } else {
        // BOSS真正死亡，升级
        blackDragonAbyss.bossLevel++;
        const hpMultiplier = bigSciToStorageValue('1e' + String(10 * (blackDragonAbyss.bossLevel - 1)));
        blackDragonAbyss.bossMaxHealth = bMul('1e50', hpMultiplier);
        blackDragonAbyss.bossHealth = blackDragonAbyss.bossMaxHealth;
        const atkMultiplier = bigSciToStorageValue('1e' + String(5 * (blackDragonAbyss.bossLevel - 1)));
        blackDragonAbyss.bossAttack = bMul('1e5', atkMultiplier);
        blackDragonAbyss.bossResurrections = 0;
        
        addBdaBattleLog(`恭喜！你击败了黑龙王，等级提升至${blackDragonAbyss.bossLevel}`);
        addBdaBattleLog("黑龙王: 不...这不可能...");
    }
    
    updateBlackDragonAbyssUI();
}

// 新增：BOSS复活后立即攻击玩家的函数
function bossResurrectionAttack() {
    // BOSS复活后立即攻击玩家
    let bossDamage = blackDragonAbyss.bossAttack;
    blackDragonAbyss.playerHealth = bSub(blackDragonAbyss.playerHealth, bossDamage);
    
    addBdaBattleLog(`黑龙王复活后立即对你造成${formatSci(bossDamage)}点伤害`);
    
    // 检查玩家是否死亡
    if (bLteZero(blackDragonAbyss.playerHealth)) {
        handlePlayerDefeated();
        return;
    }
    
    updateBlackDragonAbyssUI();
}

// 处理玩家被击败
function handlePlayerDefeated() {
    blackDragonAbyss.isBattleActive = false;
    
    addBdaBattleLog("你被黑龙王击败了！");
    addBdaBattleLog("战斗结束");
    
    // 隐藏攻击按钮
    document.getElementById('attackBossBtn').style.display = 'none';
    document.getElementById('fleeBossBtn').style.display = 'none';
    document.getElementById('startBattleBtn').style.display = 'inline-block';
    
    // 显示奖励
    showBdaRewards();
}

// 从黑龙王战斗逃跑
function fleeBlackDragonBattle() {
    blackDragonAbyss.isBattleActive = false;
    
    addBdaBattleLog("你逃离了战斗");
    
    // 隐藏攻击按钮
    document.getElementById('attackBossBtn').style.display = 'none';
    document.getElementById('fleeBossBtn').style.display = 'none';
    document.getElementById('startBattleBtn').style.display = 'inline-block';
    
    // 显示奖励
    showBdaRewards();
}

// 显示奖励
function showBdaRewards() {
   // 如果BOSS等级为1，则没有奖励
    if (blackDragonAbyss.bossLevel === 1) {
        addBdaBattleLog("黑龙王等级1，没有获得任何奖励。");
        // 直接返回，不显示奖励界面
        return;
    }
    const multiplier = blackDragonAbyss.bossLevel;
    
    // 计算奖励
    const rewards = {
        // 这里使用游戏内已有的道具字段，如果没有需要先定义
        chiban1: Math.floor(randomBetween(1, 3) * multiplier), // 黑龙王翅膀
        rebornDan: Math.floor(randomBetween(1, 5) * multiplier), // 洗髓丹
        rootDetector: Math.floor(randomBetween(1, 2) * multiplier), // 灵根检测器
        bloodlineDetector: Math.floor(randomBetween(1, 2) * multiplier), // 血脉检测剂
        roseq: Math.floor(randomBetween(1, 2) * multiplier), // 香囊
        banlv1: Math.floor(randomBetween(1, 3) * multiplier), // 普通灵魂伴侣
        yuzhou1: Math.floor(randomBetween(10, 50) * multiplier), // 星辰发票
        yuzhou2: Math.floor(randomBetween(10, 50) * multiplier), // 暗物质发票
        yuzhou3: Math.floor(randomBetween(1, 5) * multiplier), // 宇宙结晶发票
        yuzhou4: Math.floor(randomBetween(1, 5) * multiplier) // 神器碎片发票
    };
    
    // 更新奖励UI
    document.getElementById('rewardBossLevel').textContent = blackDragonAbyss.bossLevel;
    document.getElementById('rewardMultiplier').textContent = multiplier;
    
    let rewardHtml = '';
    for (const [item, amount] of Object.entries(rewards)) {
        // 添加到玩家物品
        player.items[item] = (player.items[item] || 0) + amount;
        
        // 生成奖励显示
        rewardHtml += `<div>${getItemName(item)}: ${amount}</div>`;
    }
    
    document.getElementById('rewardItems').innerHTML = rewardHtml;
    
    // 显示奖励UI
    document.getElementById('bdaRewardOverlay').style.display = 'block';
    document.getElementById('bdaRewardUI').style.display = 'block';
}

// 关闭奖励界面
function closeBdaReward() {
    document.getElementById('bdaRewardOverlay').style.display = 'none';
    document.getElementById('bdaRewardUI').style.display = 'none';
}

// 各副本战斗日志 DOM 行数上限（自动战斗高频 append 时防止节点无限增长）
var COPY_BATTLE_LOG_DOM_MAX = 150;
// 添加战斗日志
function addBdaBattleLog(message) {
    const logContainer = document.getElementById('bdaBattleLog');
    if (!logContainer) return;
    const logElement = document.createElement('div');
    logElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContainer.appendChild(logElement);
    while (logContainer.children.length > COPY_BATTLE_LOG_DOM_MAX) logContainer.removeChild(logContainer.firstChild);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// 辅助函数：生成随机数范围
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 辅助函数：获取物品名称
function getItemName(itemKey) {
    const itemNames = {
        chiban1: "黑龙王翅膀",
        rebornDan: "洗髓丹",
        rootDetector: "灵根检测器",
        bloodlineDetector: "血脉检测剂",
        roseq: "香囊",
        banlv1: "普通灵魂伴侣",
        yuzhou1: "星辰发票",
        yuzhou2: "暗物质发票",
        yuzhou3: "宇宙结晶发票",
        yuzhou4: "神器碎片发票"
    };
    
    return itemNames[itemKey] || itemKey;
}

// 辅助函数：科学计数法格式化
function formatSci_hbiLocal(number) {
    if (number == null) return '0';
    if (typeof number === 'number') {
        if (!Number.isFinite(number)) return number > 0 ? '1e308+' : (number < 0 ? '-1e308+' : '0');
        if (Math.abs(number) < 1000000) return Math.floor(number).toLocaleString();
        return number.toExponential(3).replace(/(\.\d+?)0+e/, '$1e').replace(/\.?e\+?/, 'e');
    }
    const text = String(number).trim();
    if (text === '-' || text === '--' || text.toLowerCase() === 'nan') return '0';
    if (!text) return '0';
    const normalizedText = text.replace(/[,_，\s]/g, '');
    const m = normalizedText.match(/^([+-]?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i);
    if (!m) return '0';
    const sign = m[1] === '-' ? '-' : '';
    const intPart = (m[2] || '').replace(/^0+/, '') || '0';
    const fracPart = (m[3] || '').replace(/0+$/, '');
    const allDigits = (intPart + fracPart).replace(/^0+/, '');
    if (!allDigits) return '0';
    const exp10 = (m[4] != null ? BigInt(m[4]) : 0n) + BigInt(intPart.length - 1);
    const mantissaTail = allDigits.slice(1, 4).replace(/0+$/, '');
    const mantissa = allDigits[0] + (mantissaTail ? ('.' + mantissaTail) : '');
    return sign + mantissa + 'e' + exp10.toString();
}
initBlackDragonAbyss();

// 圣兽岛奖励配置
const hbiRewards = {
    baseRewards: {
        '远古圣兽精魄': { min: 1, max: 3 },
        '神兽蛋': { min: 1, max: 2 },
        '洗髓丹': { min: 3, max: 7 },
        '香囊': { min: 3, max: 5 },
        '星辰发票': { min: 100, max: 200 },
        '暗物质发票': { min: 100, max: 200 },
        '宇宙结晶发票': { min: 20, max: 30 },
        '神器碎片': { min: 20, max: 30 }
    },
    itemMapping: {
        '远古圣兽精魄': 'zuoqi1',
        '神兽蛋': 'shenshou1',
        '洗髓丹': 'rebornDan',
        '香囊': 'roseq',
        '星辰发票': 'yuzhou1',
        '暗物质发票': 'yuzhou2',
        '宇宙结晶发票': 'yuzhou3',
        '神器碎片': 'yuzhou4'
    }
};

// 切换圣兽岛副本界面
function toggleHolyBeastIsland() {
   if (player.level.ascentionCounta < 2) {
        alert("需要达到轮回2转才能开启圣兽岛副本！");
        return;
    }
    const overlay = document.getElementById('holyBeastIslandOverlay');
    const ui = document.getElementById('holyBeastIslandUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
        // 停止自动战斗
        if (player.holyBeastIsland.autoBattleInterval) {
            clearInterval(player.holyBeastIsland.autoBattleInterval);
            player.holyBeastIsland.autoBattleInterval = null;
        }
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateHolyBeastIslandUI();
    }
}

// 更新圣兽岛界面显示
function updateHolyBeastIslandUI() {
    // 更新令牌数量
    document.getElementById('hbiTokenCount').textContent = player.items.fuben1 || 0;
    
    // 更新玩家属性
    const playerStats = calculatePlayerBattleStats();
    document.getElementById('hbiPlayerHealth').textContent = formatSci(playerStats.health);
    document.getElementById('hbiPlayerAttack').textContent = formatSci(playerStats.attack);
    document.getElementById('hbiPlayerCritRate').textContent = (playerStats.critRate * 100).toFixed(2) + '%';
    document.getElementById('hbiPlayerCritDamage').textContent = (playerStats.critDamage * 100).toFixed(2) + '%';
    
    // 更新BOSS属性
    document.getElementById('hbiBossLevel').textContent = player.holyBeastIsland.bossLevel;
    document.getElementById('hbiBossHealth').textContent = formatSci(player.holyBeastIsland.bossHealth);
    document.getElementById('hbiBossMaxHealth').textContent = formatSci(player.holyBeastIsland.bossMaxHealth);
    document.getElementById('hbiBossAttack').textContent = formatSci(player.holyBeastIsland.bossAttack);
    document.getElementById('hbiBossResurrections').textContent = player.holyBeastIsland.bossResurrections;
    
    // 更新按钮状态
    const startBtn = document.getElementById('startHbiBattleBtn');
    const attackBtn = document.getElementById('attackHbiBossBtn');
    const fleeBtn = document.getElementById('fleeHbiBossBtn');
    
    if (player.holyBeastIsland.isBattling) {
        startBtn.style.display = 'none';
        attackBtn.style.display = 'inline-block';
        fleeBtn.style.display = 'inline-block';
    } else {
        startBtn.style.display = 'inline-block';
        attackBtn.style.display = 'none';
        fleeBtn.style.display = 'none';
    }
}

// 开始圣兽岛战斗
function startHolyBeastBattle() {
    // 检查副本令牌
    if (!player.items.fuben1 || player.items.fuben1 < 1) {
        logAction('副本令牌不足！', 'error');
        return;
    }
    
    // 消耗副本令牌
    player.items.fuben1--;
    
    // 初始化BOSS属性（每次重新挑战都从1级开始）
    player.holyBeastIsland.bossLevel = 1;
    player.holyBeastIsland.bossMaxHealth = 1e100;
    player.holyBeastIsland.bossHealth = 1e100;
    player.holyBeastIsland.bossAttack = 1e10;
    player.holyBeastIsland.bossResurrections = 0;
    player.holyBeastIsland.isBattling = true;
    
    // 初始化玩家战斗属性
    const playerStats = calculatePlayerBattleStats();
    player.holyBeastIsland.playerHealth = playerStats.health;
    player.holyBeastIsland.playerAttack = playerStats.attack;
    player.holyBeastIsland.playerCritRate = playerStats.critRate;
    player.holyBeastIsland.playerCritDamage = playerStats.critDamage;
    
    // 清空战斗日志
    document.getElementById('hbiBattleLog').innerHTML = '';
    
    // 添加战斗开始日志
    addHbiBattleLog('=== 圣兽岛副本挑战开始 ===');
    addHbiBattleLog(`挑战上古火麒麟 Lv.${player.holyBeastIsland.bossLevel}`);
    addHbiBattleLog(`BOSS生命: ${formatSci(player.holyBeastIsland.bossHealth)}`);
    addHbiBattleLog(`BOSS攻击: ${formatSci(player.holyBeastIsland.bossAttack)}`);
    
    updateHolyBeastIslandUI();
    logAction('开始挑战圣兽岛副本上古火麒麟！', 'success');
}

// 攻击圣兽岛BOSS
function attackHolyBeastBoss() {
    if (!player.holyBeastIsland.isBattling) return;
    
    const playerAttack = player.holyBeastIsland.playerAttack;
    const critRate = player.holyBeastIsland.playerCritRate;
    const critDamage = player.holyBeastIsland.playerCritDamage;
    
    // 计算伤害（考虑暴击）
    const isCrit = Math.random() < critRate;
    let damage = bigSciToStorageValue(playerAttack);
    if (isCrit) damage = multiplyBigByFinite(damage, critDamage);
    
    // 应用伤害
    player.holyBeastIsland.bossHealth = bSub(player.holyBeastIsland.bossHealth, damage);
    
    // 记录攻击日志
    addHbiBattleLog(`你对上古火麒麟造成了${formatSci(damage)}点${isCrit ? '暴击 ' : ''}伤害`);
    addHbiBattleLog(`BOSS剩余生命: ${formatSci(player.holyBeastIsland.bossHealth)}/${formatSci(player.holyBeastIsland.bossMaxHealth)}`);
    
    // 检查BOSS是否死亡
    if (bLteZero(player.holyBeastIsland.bossHealth)) {
        handleHbiBossDefeated();
    } else {
        // BOSS反击
        hbiBossCounterAttack();
    }
    
    updateHolyBeastIslandUI();
}

// BOSS反击
function hbiBossCounterAttack() {
    const bossAttack = player.holyBeastIsland.bossAttack;
    
    // 应用伤害
    player.holyBeastIsland.playerHealth = bSub(player.holyBeastIsland.playerHealth, bossAttack);
    
    // 记录反击日志
    addHbiBattleLog(`上古火麒麟对你造成了${formatSci(bossAttack)}点伤害`);
    addHbiBattleLog(`你剩余生命: ${formatSci(player.holyBeastIsland.playerHealth)}`);
    
    // 检查玩家是否死亡
    if (bLteZero(player.holyBeastIsland.playerHealth)) {
        handleHbiPlayerDefeated();
    }
    
    updateHolyBeastIslandUI();
}

// 处理BOSS被击败
function handleHbiBossDefeated() {
    player.holyBeastIsland.bossResurrections++;
    
    if (player.holyBeastIsland.bossResurrections < 10) {
        // BOSS复活（属性提升3倍）
        player.holyBeastIsland.bossHealth = bMul(player.holyBeastIsland.bossMaxHealth, Math.pow(3, player.holyBeastIsland.bossResurrections));
        player.holyBeastIsland.bossAttack = bMul(player.holyBeastIsland.bossAttack, 3);
        
        addHbiBattleLog(`上古火麒麟复活了！(第${player.holyBeastIsland.bossResurrections}次复活)`);
        addHbiBattleLog(`BOSS属性提升3倍！`);
        
        // BOSS复活后立即反击
        hbiBossCounterAttack();
    } else {
        // BOSS真正死亡，进入下一级
        addHbiBattleLog(`上古火麒麟被彻底击败！`);
        player.holyBeastIsland.bossLevel++;
        
        // 计算下一级BOSS属性（每级提升1e10倍）
        const levelMultiplier = bigSciToStorageValue('1e' + String(10 * (player.holyBeastIsland.bossLevel - 1)));
        player.holyBeastIsland.bossMaxHealth = bMul('1e100', levelMultiplier);
        player.holyBeastIsland.bossHealth = player.holyBeastIsland.bossMaxHealth;
        player.holyBeastIsland.bossAttack = bMul('1e10', levelMultiplier);
        player.holyBeastIsland.bossResurrections = 0;
        
        addHbiBattleLog(`上古火麒麟晋升至 Lv.${player.holyBeastIsland.bossLevel}`);
        addHbiBattleLog(`BOSS属性提升${formatSci(levelMultiplier)}倍！`);
        
        // 新等级BOSS立即反击
        hbiBossCounterAttack();
    }
}

// 处理玩家被击败
function handleHbiPlayerDefeated() {
    addHbiBattleLog('=== 你被上古火麒麟击败了！ ===');
    player.holyBeastIsland.isBattling = false;
    
    // 显示奖励界面
    if (player.holyBeastIsland.bossLevel >= 2) {
        showHbiRewards();
    } else {
        addHbiBattleLog('等级1没有奖励，请继续挑战！');
    }
    
    updateHolyBeastIslandUI();
}

// 逃跑函数
function fleeHolyBeastBattle() {
    addHbiBattleLog('=== 你选择逃离战斗 ===');
    player.holyBeastIsland.isBattling = false;
    
    // 显示奖励界面（即使逃跑也结算当前进度奖励）
    if (player.holyBeastIsland.bossLevel >= 2) {
        showHbiRewards();
    } else {
        addHbiBattleLog('等级1没有奖励，请继续挑战！');
    }
    
    updateHolyBeastIslandUI();
}

// 显示奖励界面
function showHbiRewards() {
if (player.holyBeastIsland.bossLevel < 2) {
        return;
    }

    const rewardMultiplier = player.holyBeastIsland.bossLevel-1;
    const rewards = calculateHbiRewards(rewardMultiplier);
    
    // 更新奖励界面显示
    document.getElementById('hbiRewardBossLevel').textContent = player.holyBeastIsland.bossLevel;
    document.getElementById('hbiRewardMultiplier').textContent = rewardMultiplier;
    
    // 显示奖励物品
    const rewardItemsContainer = document.getElementById('hbiRewardItems');
    rewardItemsContainer.innerHTML = '';
    
    Object.entries(rewards).forEach(([itemName, quantity]) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.margin = '5px 0';
        itemDiv.innerHTML = `<span style="color: #ffd700;">${itemName}</span>: ${quantity}个`;
        rewardItemsContainer.appendChild(itemDiv);
    });
    
    // 显示奖励界面
    document.getElementById('hbiRewardOverlay').style.display = 'block';
    document.getElementById('hbiRewardUI').style.display = 'block';
}

// 计算奖励
function calculateHbiRewards(multiplier) {
    const rewards = {};
    
    Object.entries(hbiRewards.baseRewards).forEach(([itemName, range]) => {
        const baseQuantity = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        const finalQuantity = baseQuantity * multiplier;
        rewards[itemName] = finalQuantity;
        
        // 添加到玩家物品
        const itemKey = hbiRewards.itemMapping[itemName];
        if (itemKey) {
            player.items[itemKey] = (player.items[itemKey] || 0) + finalQuantity;
        }
    });
    
    return rewards;
}

// 关闭奖励界面
function closeHbiReward() {
    document.getElementById('hbiRewardOverlay').style.display = 'none';
    document.getElementById('hbiRewardUI').style.display = 'none';
    
    // 记录奖励日志
    logAction('圣兽岛副本挑战结束，获得丰厚奖励！', 'success');
    updateDisplay();
}

// 添加战斗日志
function addHbiBattleLog(message) {
    const logContainer = document.getElementById('hbiBattleLog');
    if (!logContainer) return;
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEntry.style.margin = '2px 0';
    logEntry.style.padding = '2px 5px';
    
    // 根据消息类型添加颜色
    if (message.includes('击败') || message.includes('奖励')) {
        logEntry.style.color = '#00ff00';
    } else if (message.includes('伤害')) {
        logEntry.style.color = '#ffa500';
    } else if (message.includes('复活')) {
        logEntry.style.color = '#ff0000';
    }
    
    logContainer.appendChild(logEntry);
    while (logContainer.children.length > COPY_BATTLE_LOG_DOM_MAX) logContainer.removeChild(logContainer.firstChild);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// 计算玩家战斗属性（需要根据你的游戏系统实现）
function calculatePlayerBattleStats() {
    // 这里需要根据你的游戏系统计算玩家属性
    // 返回格式：{ health: number, attack: number, critRate: number, critDamage: number }
    return {
        health: player.battle.playerHealth || 1e10,
        attack: player.battle.playerAttack || 1e8,
        critRate: player.battle.playerCritRate || 0.1,
        critDamage: player.battle.playerCritDamage || 1.5
    };
}

// 科学计数法格式化函数
function formatSci_penglaiLocal(number) {
    if (number == null) return '0';
    if (typeof number === 'number') {
        if (!Number.isFinite(number)) return number > 0 ? '1e308+' : (number < 0 ? '-1e308+' : '0');
        if (Math.abs(number) >= 1e6) return number.toExponential(3);
        return Math.floor(number).toLocaleString();
    }
    const text = String(number).trim();
    if (text === '-' || text === '--' || text.toLowerCase() === 'nan') return '0';
    if (!text) return '0';
    const normalizedText = text.replace(/[,_，\s]/g, '');
    const m = normalizedText.match(/^([+-]?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i);
    if (!m) return '0';
    const sign = m[1] === '-' ? '-' : '';
    const intPart = (m[2] || '').replace(/^0+/, '') || '0';
    const fracPart = (m[3] || '').replace(/0+$/, '');
    const allDigits = (intPart + fracPart).replace(/^0+/, '');
    if (!allDigits) return '0';
    const exp10 = (m[4] != null ? BigInt(m[4]) : 0n) + BigInt(intPart.length - 1);
    const mantissaTail = allDigits.slice(1, 4).replace(/0+$/, '');
    const mantissa = allDigits[0] + (mantissaTail ? ('.' + mantissaTail) : '');
    return sign + mantissa + 'e' + exp10.toString();
}
// 蓬莱仙岛奖励配置
const penglaiRewards = {
    baseRewards: {
        '秘法符文': { min: 1, max: 3 },
        '洗髓丹': { min: 5, max: 10 },
        '香囊': { min: 10, max: 20 },
        '星辰发票': { min: 300, max: 500 },
        '暗物质发票': { min: 300, max: 500 },
        '宇宙结晶发票': { min: 100, max: 200 },
        '神器碎片': { min: 100, max: 200 }
    },
    itemMapping: {
        '秘法符文': 'fuwen1',
        '洗髓丹': 'rebornDan',
        '香囊': 'roseq',
        '星辰发票': 'yuzhou1',
        '暗物质发票': 'yuzhou2',
        '宇宙结晶发票': 'yuzhou3',
        '神器碎片': 'yuzhou4'
    }
};

// 切换蓬莱仙岛副本界面
function togglePenglaiIsland() {
    if (player.level.ascentionCounta < 3) {
        alert("需要达到轮回3转才能开启蓬莱仙岛副本！");
        return;
    }
    const overlay = document.getElementById('penglaiIslandOverlay');
    const ui = document.getElementById('penglaiIslandUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
        // 停止自动战斗
        if (player.penglaiIsland.autoBattleInterval) {
            clearInterval(player.penglaiIsland.autoBattleInterval);
            player.penglaiIsland.autoBattleInterval = null;
        }
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updatePenglaiIslandUI();
    }
}

// 更新蓬莱仙岛界面显示
function updatePenglaiIslandUI() {
    // 更新令牌数量
    document.getElementById('penglaiTokenCount').textContent = player.items.fuben1 || 0;
    
    // 更新玩家属性
    const playerStats = calculatePlayerBattleStats();
    document.getElementById('penglaiPlayerHealth').textContent = formatSci(playerStats.health);
    document.getElementById('penglaiPlayerAttack').textContent = formatSci(playerStats.attack);
    document.getElementById('penglaiPlayerCritRate').textContent = (playerStats.critRate * 100).toFixed(2) + '%';
    document.getElementById('penglaiPlayerCritDamage').textContent = (playerStats.critDamage * 100).toFixed(2) + '%';
    
    // 更新BOSS属性
    document.getElementById('penglaiBossLevel').textContent = player.penglaiIsland.bossLevel;
    document.getElementById('penglaiBossHealth').textContent = formatSci(player.penglaiIsland.bossHealth);
    document.getElementById('penglaiBossMaxHealth').textContent = formatSci(player.penglaiIsland.bossMaxHealth);
    document.getElementById('penglaiBossAttack').textContent = formatSci(player.penglaiIsland.bossAttack);
    document.getElementById('penglaiBossResurrections').textContent = player.penglaiIsland.bossResurrections;
    
    // 更新按钮状态
    const startBtn = document.getElementById('startPenglaiBattleBtn');
    const attackBtn = document.getElementById('attackPenglaiBossBtn');
    const fleeBtn = document.getElementById('fleePenglaiBossBtn');
    
    if (player.penglaiIsland.isBattling) {
        startBtn.style.display = 'none';
        attackBtn.style.display = 'inline-block';
        fleeBtn.style.display = 'inline-block';
    } else {
        startBtn.style.display = 'inline-block';
        attackBtn.style.display = 'none';
        fleeBtn.style.display = 'none';
    }
}

// 开始蓬莱仙岛战斗
function startPenglaiBattle() {
    // 检查副本令牌
    if (!player.items.fuben1 || player.items.fuben1 < 1) {
        logAction('副本令牌不足！', 'error');
        return;
    }
    
    // 消耗副本令牌
    player.items.fuben1--;
    
    // 初始化BOSS属性（每次重新挑战都从1级开始）
    player.penglaiIsland.bossLevel = 1;
    player.penglaiIsland.bossMaxHealth = 1e120;
    player.penglaiIsland.bossHealth = 1e120;
    player.penglaiIsland.bossAttack = 1e20;
    player.penglaiIsland.bossResurrections = 0;
    player.penglaiIsland.isBattling = true;
    
    // 初始化玩家战斗属性
    const playerStats = calculatePlayerBattleStats();
    player.penglaiIsland.playerHealth = playerStats.health;
    player.penglaiIsland.playerAttack = playerStats.attack;
    player.penglaiIsland.playerCritRate = playerStats.critRate;
    player.penglaiIsland.playerCritDamage = playerStats.critDamage;
    
    // 清空战斗日志
    document.getElementById('penglaiBattleLog').innerHTML = '';
    
    // 添加战斗开始日志
    addPenglaiBattleLog('=== 蓬莱仙岛副本挑战开始 ===');
    addPenglaiBattleLog(`挑战太古饕鬄 Lv.${player.penglaiIsland.bossLevel}`);
    addPenglaiBattleLog(`BOSS生命: ${formatSci(player.penglaiIsland.bossHealth)}`);
    addPenglaiBattleLog(`BOSS攻击: ${formatSci(player.penglaiIsland.bossAttack)}`);
    
    updatePenglaiIslandUI();
    logAction('开始挑战蓬莱仙岛副本太古饕鬄！', 'success');
}

// 攻击蓬莱仙岛BOSS
function attackPenglaiBoss() {
    if (!player.penglaiIsland.isBattling) return;
    
    const playerAttack = player.penglaiIsland.playerAttack;
    const critRate = player.penglaiIsland.playerCritRate;
    const critDamage = player.penglaiIsland.playerCritDamage;
    
    // 计算伤害（考虑暴击）
    const isCrit = Math.random() < critRate;
    let damage = bigSciToStorageValue(playerAttack);
    if (isCrit) damage = multiplyBigByFinite(damage, critDamage);
    
    // 应用伤害
    player.penglaiIsland.bossHealth = bSub(player.penglaiIsland.bossHealth, damage);
    
    // 记录攻击日志
    addPenglaiBattleLog(`你对太古饕鬄造成了${formatSci(damage)}点${isCrit ? '暴击 ' : ''}伤害`);
    addPenglaiBattleLog(`BOSS剩余生命: ${formatSci(player.penglaiIsland.bossHealth)}/${formatSci(player.penglaiIsland.bossMaxHealth)}`);
    
    // 检查BOSS是否死亡
    if (bLteZero(player.penglaiIsland.bossHealth)) {
        handlePenglaiBossDefeated();
    } else {
        // BOSS反击
        penglaiBossCounterAttack();
    }
    
    updatePenglaiIslandUI();
}

// BOSS反击
function penglaiBossCounterAttack() {
    const bossAttack = player.penglaiIsland.bossAttack;
    
    // 应用伤害
    player.penglaiIsland.playerHealth = bSub(player.penglaiIsland.playerHealth, bossAttack);
    
    // 记录反击日志
    addPenglaiBattleLog(`太古饕鬄对你造成了${formatSci(bossAttack)}点伤害`);
    addPenglaiBattleLog(`你剩余生命: ${formatSci(player.penglaiIsland.playerHealth)}`);
    
    // 检查玩家是否死亡
    if (bLteZero(player.penglaiIsland.playerHealth)) {
        handlePenglaiPlayerDefeated();
    }
    
    updatePenglaiIslandUI();
}

// 处理BOSS被击败
function handlePenglaiBossDefeated() {
    player.penglaiIsland.bossResurrections++;
    
    if (player.penglaiIsland.bossResurrections < 10) {
        // BOSS复活（属性提升3倍）
        player.penglaiIsland.bossHealth = bMul(player.penglaiIsland.bossMaxHealth, Math.pow(3, player.penglaiIsland.bossResurrections));
        player.penglaiIsland.bossAttack = bMul(player.penglaiIsland.bossAttack, 3);
        
        addPenglaiBattleLog(`太古饕鬄复活了！(第${player.penglaiIsland.bossResurrections}次复活)`);
        addPenglaiBattleLog(`BOSS属性提升3倍！`);
        
        // BOSS复活后立即反击
        penglaiBossCounterAttack();
    } else {
        // BOSS真正死亡，进入下一级
        addPenglaiBattleLog(`太古饕鬄被彻底击败！`);
        player.penglaiIsland.bossLevel++;
        
        // 计算下一级BOSS属性（每级提升1e20倍）
        const levelMultiplier = bigSciToStorageValue('1e' + String(20 * (player.penglaiIsland.bossLevel - 1)));
        player.penglaiIsland.bossMaxHealth = bMul('1e120', levelMultiplier);
        player.penglaiIsland.bossHealth = player.penglaiIsland.bossMaxHealth;
        player.penglaiIsland.bossAttack = bMul('1e15', levelMultiplier);
        player.penglaiIsland.bossResurrections = 0;
        
        addPenglaiBattleLog(`太古饕鬄晋升至 Lv.${player.penglaiIsland.bossLevel}`);
        addPenglaiBattleLog(`BOSS属性提升${formatSci(levelMultiplier)}倍！`);
        
        // 新等级BOSS立即反击
        penglaiBossCounterAttack();
    }
}

// 处理玩家被击败
function handlePenglaiPlayerDefeated() {
    addPenglaiBattleLog('=== 你被太古饕鬄击败了！ ===');
    player.penglaiIsland.isBattling = false;
    
    // 只在等级2及以上显示奖励界面
    if (player.penglaiIsland.bossLevel >= 2) {
        showPenglaiRewards();
    } else {
        addPenglaiBattleLog('等级1没有奖励，请继续挑战！');
    }
    
    updatePenglaiIslandUI();
}

// 逃跑函数
function fleePenglaiBattle() {
    addPenglaiBattleLog('=== 你选择逃离战斗 ===');
    player.penglaiIsland.isBattling = false;
    
    // 只在等级2及以上显示奖励界面
    if (player.penglaiIsland.bossLevel >= 2) {
        showPenglaiRewards();
    } else {
        addPenglaiBattleLog('等级1没有奖励，请继续挑战！');
    }
    
    updatePenglaiIslandUI();
}

// 显示奖励界面
function showPenglaiRewards() {
    // 只在等级2及以上计算奖励
    if (player.penglaiIsland.bossLevel < 2) {
        return;
    }
    
    const rewardMultiplier = player.penglaiIsland.bossLevel - 1; // 等级2开始有奖励，倍数为1
    const rewards = calculatePenglaiRewards(rewardMultiplier);
    
    // 更新奖励界面显示
    document.getElementById('penglaiRewardBossLevel').textContent = player.penglaiIsland.bossLevel;
    document.getElementById('penglaiRewardMultiplier').textContent = rewardMultiplier;
    
    // 显示奖励物品
    const rewardItemsContainer = document.getElementById('penglaiRewardItems');
    rewardItemsContainer.innerHTML = '';
    
    Object.entries(rewards).forEach(([itemName, quantity]) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.margin = '5px 0';
        itemDiv.innerHTML = `<span style="color: #ffd700;">${itemName}</span>: ${quantity}个`;
        rewardItemsContainer.appendChild(itemDiv);
    });
    
    // 显示奖励界面
    document.getElementById('penglaiRewardOverlay').style.display = 'block';
    document.getElementById('penglaiRewardUI').style.display = 'block';
}

// 计算奖励
function calculatePenglaiRewards(multiplier) {
    const rewards = {};
    
    Object.entries(penglaiRewards.baseRewards).forEach(([itemName, range]) => {
        const baseQuantity = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        const finalQuantity = baseQuantity * multiplier;
        rewards[itemName] = finalQuantity;
        
        // 添加到玩家物品
        const itemKey = penglaiRewards.itemMapping[itemName];
        if (itemKey) {
            player.items[itemKey] = (player.items[itemKey] || 0) + finalQuantity;
        }
    });
    
    return rewards;
}

// 关闭奖励界面
function closePenglaiReward() {
    document.getElementById('penglaiRewardOverlay').style.display = 'none';
    document.getElementById('penglaiRewardUI').style.display = 'none';
    
    // 记录奖励日志
    logAction('蓬莱仙岛副本挑战结束，获得丰厚奖励！', 'success');
    updateDisplay();
}

// 添加战斗日志
function addPenglaiBattleLog(message) {
    const logContainer = document.getElementById('penglaiBattleLog');
    if (!logContainer) return;
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEntry.style.margin = '2px 0';
    logEntry.style.padding = '2px 5px';
    
    // 根据消息类型添加颜色
    if (message.includes('击败') || message.includes('奖励')) {
        logEntry.style.color = '#00ff00';
    } else if (message.includes('伤害')) {
        logEntry.style.color = '#ffa500';
    } else if (message.includes('复活')) {
        logEntry.style.color = '#ff0000';
    }
    
    logContainer.appendChild(logEntry);
    while (logContainer.children.length > COPY_BATTLE_LOG_DOM_MAX) logContainer.removeChild(logContainer.firstChild);
    logContainer.scrollTop = logContainer.scrollHeight;
}


function toggleLunhuiFuben() {
    if (!player.lunhuiFuben) {
        player.lunhuiFuben = { bossLevel: 1, bossHealth: 1e98, bossAttack: 1e8, bossMaxHealth: 1e98, bossResurrections: 0, isBattling: false, playerHealth: 0, playerAttack: 0, playerCritRate: 0, playerCritDamage: 0 };
    }
    if (player.level.ascentionCounta < 2) {
        alert("需要达到轮回2转才能开启轮回试炼副本！");
        return;
    }
    const overlay = document.getElementById('lunhuiFubenOverlay');
    const ui = document.getElementById('lunhuiFubenUI');
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
        if (player.lunhuiFuben.autoBattleInterval) {
            clearInterval(player.lunhuiFuben.autoBattleInterval);
            player.lunhuiFuben.autoBattleInterval = null;
        }
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateLunhuiFubenUI();
    }
}

function updateLunhuiFubenUI() {
    document.getElementById('lunhuiFubenTokenCount').textContent = player.items.fuben1 || 0;
    const playerStats = calculatePlayerBattleStats();
    document.getElementById('lunhuiFubenPlayerHealth').textContent = formatSci(playerStats.health);
    document.getElementById('lunhuiFubenPlayerAttack').textContent = formatSci(playerStats.attack);
    document.getElementById('lunhuiFubenPlayerCritRate').textContent = (playerStats.critRate * 100).toFixed(2) + '%';
    document.getElementById('lunhuiFubenPlayerCritDamage').textContent = (playerStats.critDamage * 100).toFixed(2) + '%';
    document.getElementById('lunhuiFubenBossLevel').textContent = player.lunhuiFuben.bossLevel;
    document.getElementById('lunhuiFubenBossHealth').textContent = formatSci(player.lunhuiFuben.bossHealth);
    document.getElementById('lunhuiFubenBossMaxHealth').textContent = formatSci(player.lunhuiFuben.bossMaxHealth);
    document.getElementById('lunhuiFubenBossAttack').textContent = formatSci(player.lunhuiFuben.bossAttack);
    document.getElementById('lunhuiFubenBossResurrections').textContent = player.lunhuiFuben.bossResurrections;
    const startBtn = document.getElementById('startLunhuiFubenBattleBtn');
    const attackBtn = document.getElementById('attackLunhuiFubenBossBtn');
    const fleeBtn = document.getElementById('fleeLunhuiFubenBossBtn');
    if (player.lunhuiFuben.isBattling) {
        startBtn.style.display = 'none';
        attackBtn.style.display = 'inline-block';
        fleeBtn.style.display = 'inline-block';
    } else {
        startBtn.style.display = 'inline-block';
        attackBtn.style.display = 'none';
        fleeBtn.style.display = 'none';
    }
}

function startLunhuiFubenBattle() {
    if (!player.items.fuben1 || player.items.fuben1 < 1) {
        logAction('副本令牌不足！', 'error');
        return;
    }
    player.items.fuben1--;
    player.lunhuiFuben.bossLevel = 1;
    player.lunhuiFuben.bossMaxHealth = 1e98;
    player.lunhuiFuben.bossHealth = 1e98;
    player.lunhuiFuben.bossAttack = 1e8;
    player.lunhuiFuben.bossResurrections = 0;
    player.lunhuiFuben.isBattling = true;
    const playerStats = calculatePlayerBattleStats();
    player.lunhuiFuben.playerHealth = playerStats.health;
    player.lunhuiFuben.playerAttack = playerStats.attack;
    player.lunhuiFuben.playerCritRate = playerStats.critRate;
    player.lunhuiFuben.playerCritDamage = playerStats.critDamage;
    document.getElementById('lunhuiFubenBattleLog').innerHTML = '';
    addLunhuiFubenBattleLog('=== 轮回试炼副本挑战开始 ===');
    addLunhuiFubenBattleLog('挑战太古混沌 Lv.' + player.lunhuiFuben.bossLevel);
    addLunhuiFubenBattleLog('BOSS生命: ' + formatSci(player.lunhuiFuben.bossHealth));
    addLunhuiFubenBattleLog('BOSS攻击: ' + formatSci(player.lunhuiFuben.bossAttack));
    updateLunhuiFubenUI();
    logAction('开始挑战轮回试炼副本太古混沌！', 'success');
}

function attackLunhuiFubenBoss() {
    if (!player.lunhuiFuben.isBattling) return;
    const playerAttack = player.lunhuiFuben.playerAttack;
    const critRate = player.lunhuiFuben.playerCritRate;
    const critDamage = player.lunhuiFuben.playerCritDamage;
    const isCrit = Math.random() < critRate;
    let damage = bigSciToStorageValue(playerAttack);
    if (isCrit) damage = multiplyBigByFinite(damage, critDamage);
    player.lunhuiFuben.bossHealth = bSub(player.lunhuiFuben.bossHealth, damage);
    addLunhuiFubenBattleLog('你对太古混沌造成了' + formatSci(damage) + '点' + (isCrit ? '暴击 ' : '') + '伤害');
    addLunhuiFubenBattleLog('BOSS剩余生命: ' + formatSci(player.lunhuiFuben.bossHealth) + '/' + formatSci(player.lunhuiFuben.bossMaxHealth));
    if (bLteZero(player.lunhuiFuben.bossHealth)) {
        handleLunhuiFubenBossDefeated();
    } else {
        lunhuiFubenBossCounterAttack();
    }
    updateLunhuiFubenUI();
}

function lunhuiFubenBossCounterAttack() {
    const bossAttack = player.lunhuiFuben.bossAttack;
    player.lunhuiFuben.playerHealth = bSub(player.lunhuiFuben.playerHealth, bossAttack);
    addLunhuiFubenBattleLog('太古混沌对你造成了' + formatSci(bossAttack) + '点伤害');
    addLunhuiFubenBattleLog('你剩余生命: ' + formatSci(player.lunhuiFuben.playerHealth));
    if (bLteZero(player.lunhuiFuben.playerHealth)) {
        handleLunhuiFubenPlayerDefeated();
    }
    updateLunhuiFubenUI();
}

function handleLunhuiFubenBossDefeated() {
    player.lunhuiFuben.bossResurrections++;
    if (player.lunhuiFuben.bossResurrections < 10) {
        player.lunhuiFuben.bossHealth = bMul(player.lunhuiFuben.bossMaxHealth, Math.pow(3, player.lunhuiFuben.bossResurrections));
        player.lunhuiFuben.bossAttack = bMul(player.lunhuiFuben.bossAttack, 3);
        addLunhuiFubenBattleLog('太古混沌复活了！(第' + player.lunhuiFuben.bossResurrections + '次复活)');
        addLunhuiFubenBattleLog('BOSS属性提升3倍！');
        lunhuiFubenBossCounterAttack();
    } else {
        addLunhuiFubenBattleLog('太古混沌被彻底击败！');
        player.lunhuiFuben.bossLevel++;
        const levelMultiplier = bigSciToStorageValue('1e' + String(8 * (player.lunhuiFuben.bossLevel - 1)));
        player.lunhuiFuben.bossMaxHealth = bMul('1e98', levelMultiplier);
        player.lunhuiFuben.bossHealth = player.lunhuiFuben.bossMaxHealth;
        player.lunhuiFuben.bossAttack = bMul('1e8', levelMultiplier);
        player.lunhuiFuben.bossResurrections = 0;
        addLunhuiFubenBattleLog('太古混沌晋升至 Lv.' + player.lunhuiFuben.bossLevel);
        addLunhuiFubenBattleLog('BOSS属性提升' + formatSci(levelMultiplier) + '倍！');
        lunhuiFubenBossCounterAttack();
    }
}

function handleLunhuiFubenPlayerDefeated() {
    addLunhuiFubenBattleLog('=== 你被太古混沌击败了！ ===');
    player.lunhuiFuben.isBattling = false;
    if (player.lunhuiFuben.bossLevel >= 2) {
        showLunhuiFubenRewards();
    } else {
        addLunhuiFubenBattleLog('等级1没有奖励，请继续挑战！');
    }
    updateLunhuiFubenUI();
}

function fleeLunhuiFubenBattle() {
    addLunhuiFubenBattleLog('=== 你选择逃离战斗 ===');
    player.lunhuiFuben.isBattling = false;
    if (player.lunhuiFuben.bossLevel >= 2) {
        showLunhuiFubenRewards();
    } else {
        addLunhuiFubenBattleLog('等级1没有奖励，请继续挑战！');
    }
    updateLunhuiFubenUI();
}

function showLunhuiFubenRewards() {
    if (player.lunhuiFuben.bossLevel < 2) return;
    const rewardMultiplier = player.lunhuiFuben.bossLevel - 1;
    const rewardResult = calculateLunhuiFubenRewards(rewardMultiplier);
    document.getElementById('lunhuiFubenRewardBossLevel').textContent = player.lunhuiFuben.bossLevel;
    document.getElementById('lunhuiFubenRewardMultiplier').textContent = rewardMultiplier;
    const container = document.getElementById('lunhuiFubenRewardItems');
    container.innerHTML = '';
    rewardResult.texts.forEach(function(t) {
        const div = document.createElement('div');
        div.style.margin = '5px 0';
        div.innerHTML = '<span style="color: #ffd700;">' + t + '</span>';
        container.appendChild(div);
    });
    document.getElementById('lunhuiFubenRewardOverlay').style.display = 'block';
    document.getElementById('lunhuiFubenRewardUI').style.display = 'block';
}

// 轮回试炼副本神兽蛋数量结构（与圣兽岛等副本一致：min~max 随机后乘倍数）
const lunhuiFubenEggRange = { min: 1, max: 2 };

function calculateLunhuiFubenRewards(multiplier) {
    const texts = [];
    if (Math.random() < 0.30) {
        // 从第2关起 1 件+1 只，第3关 2 件+2 只，第4关 3 件+3 只… 即数量 = multiplier
        var count = Math.max(1, multiplier);
        if (!player.reincarnationEquipment) {
            player.reincarnationEquipment = { inventory: [], equipped: { helmet: null, chest: null, pants: null, shoes: null, necklace: null, weapon: null }, lockedItems: [], batchDiscardMode: false, selectedItems: [] };
        }
        if (!player.beasts) player.beasts = { inventory: [], equipped: [] };
        if (!player.beasts.inventory) player.beasts.inventory = [];
        for (var i = 0; i < count; i++) {
            var eq = generateT1ReincarnationEquipment();
            if (eq && tryPushReincarnationEquipment(eq)) {
                texts.push('获得T1轮回装备: ' + eq.name + ' (' + reincarnationEquipmentConfig.rarities[eq.rarity].name + ')');
                logAction('获得T1轮回装备: ' + eq.name, 'success');
            }
            var beast = generateS1Beast();
            if (beast && tryPushBeastToInventory(beast)) {
                texts.push('获得S1轮回神兽: ' + beast.name + '（' + beast.rarity + '·S1）');
                logAction('获得S1轮回神兽: ' + beast.name + '（' + beast.rarity + '·S1）', 'legendary');
            }
        }
        if (typeof updateBeastUI === 'function') updateBeastUI();
    } else {
        // 神兽蛋与前面副本一致：(min~max 随机) * 倍数
        var baseEgg = Math.floor(Math.random() * (lunhuiFubenEggRange.max - lunhuiFubenEggRange.min + 1)) + lunhuiFubenEggRange.min;
        var eggAmount = baseEgg * Math.max(1, multiplier);
        player.items.shenshou1 = (player.items.shenshou1 || 0) + eggAmount;
        texts.push('神兽蛋 x' + eggAmount);
        logAction('获得神兽蛋 x' + eggAmount, 'success');
    }
    if (typeof updateReincarnationEquipmentUI === 'function') updateReincarnationEquipmentUI();
    return { texts: texts };
}

function closeLunhuiFubenReward() {
    document.getElementById('lunhuiFubenRewardOverlay').style.display = 'none';
    document.getElementById('lunhuiFubenRewardUI').style.display = 'none';
    logAction('轮回试炼副本挑战结束，获得奖励！', 'success');
    updateDisplay();
}

function addLunhuiFubenBattleLog(message) {
    var logContainer = document.getElementById('lunhuiFubenBattleLog');
    if (!logContainer) return;
    var logEntry = document.createElement('div');
    logEntry.textContent = '[' + new Date().toLocaleTimeString() + '] ' + message;
    logEntry.style.margin = '2px 0';
    logEntry.style.padding = '2px 5px';
    if (message.indexOf('击败') !== -1 || message.indexOf('奖励') !== -1) logEntry.style.color = '#00ff00';
    else if (message.indexOf('伤害') !== -1) logEntry.style.color = '#ffa500';
    else if (message.indexOf('复活') !== -1) logEntry.style.color = '#ff0000';
    logContainer.appendChild(logEntry);
    while (logContainer.children.length > COPY_BATTLE_LOG_DOM_MAX) logContainer.removeChild(logContainer.firstChild);
    logContainer.scrollTop = logContainer.scrollHeight;
}


function toggleTowerUI() {
    // 检查转生次数是否达到100次（和普通打怪模式一致）
    if (player.reincarnationCount < 100) {
        alert("需要达到100转才能开启通天塔模式！");
        return;
    }
  
    const towerUI = document.getElementById('towerUI');
    towerUI.style.display = towerUI.style.display === 'none' ? 'block' : 'none';
    if (towerUI.style.display === 'block') {
        // 初始化玩家属性
        generateTowerMonster();
        initTowerPlayerStats();
        player.tower.playerHealth = player.battle.playerHealth;
    player.tower.playerAttack = player.battle.playerAttack;
    player.tower.playerCritRate = player.battle.playerCritRate;
    player.tower.playerCritDamage = player.battle.playerCritDamage;
    player.tower.playerAccuracy = player.battle.playerAccuracy;
    player.tower.playerDodge = player.battle.playerDodge;
        // 如果没有当前怪物，生成一个
        if (!player.tower.monster) {
            generateTowerMonster();
        }
        updateTowerUI();
    }
}

// 初始化通天塔玩家属性
function initTowerPlayerStats() {
    player.tower.playerHealth = player.battle.playerHealth;
    player.tower.playerAttack = player.battle.playerAttack;
    player.tower.playerCritRate = player.battle.playerCritRate;
    player.tower.playerCritDamage = player.battle.playerCritDamage;
    player.tower.playerMultiAttack = player.battle.playerMultiAttack;
    player.tower.playerAccuracy = player.battle.playerAccuracy;
    player.tower.playerDodge = player.battle.playerDodge;
}

// 生成通天塔怪物
function generateTowerMonster() {
    const floor = player.tower.currentFloor;
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

    // 计算怪物属性（通天塔特殊逻辑）
    const baseHealth = 10000000000; // 初始1亿血量
    const healthValue = powScaledBig(1.001386, floor, baseHealth); // 每层乘以1.001386（大数安全）
    let attackMultiplier;
    
    if (floor <= 5) {
      attackMultiplier = Math.floor(Math.random() * 50) + 10;
    } else if (floor <= 1500) {
      attackMultiplier = Math.floor(Math.random() * 100) + 100;
    } else if (floor <= 3000) {
      attackMultiplier = 300 + (floor - 1499) * 200;
    } else if (floor <= 10000) {
      attackMultiplier = 1000 + (floor - 2999) * 1000;
    } else if (floor <= 25000) {
      attackMultiplier = 5000 + (floor - 9999) * 10000;
    } else if (floor <= 50000) {
      attackMultiplier = 10000 + (floor - 24999) * 1000000;
    } else if (floor <= 75000) {
      attackMultiplier = 10000 + (floor - 49999) * 1e9;
    } else if (floor <= 100000) {
      attackMultiplier = 10000 + (floor - 74999) * 1e12;
    } else if (floor <= 125000) {
      attackMultiplier = 10000 + (floor - 99999) * 1e15;
    } else if (floor <= 150000) {
      attackMultiplier = 10000 + (floor - 124999) * 1e18;
    } else if (floor <= 175000) {
      attackMultiplier = 10000 + (floor - 149999) * 1e21;
    } else if (floor <= 200000) {
      attackMultiplier = 200000 + (floor - 164999) * 1e24;
    } else if (floor <= 225000) {
      attackMultiplier = 200000 + (floor - 199999) * 1e27;
    } else if (floor <= 250000) {
      attackMultiplier = 3000000 + (floor - 224999) * 1e30;
    } else if (floor <= 275000) {
      attackMultiplier = 3000000 + (floor - 249999) * 1e35;
    } else if (floor <= 300000) {
      attackMultiplier = 3000000 + (floor - 274999) * 1e40;
    } else if (floor <= 325000) {
      attackMultiplier = 50000000 + (floor - 299999) * 1e50;
    } else if (floor <= 350000) {
      attackMultiplier = 60000000 + (floor - 324999) * 1e60;
    } else {
      attackMultiplier = 90000000 + (floor - 349999) * 1e70;
    }

    let attack = multiplyBigByFinite(bigSciToStorageValue(attackMultiplier), (3 + floor * 50));
    // 350000层后，每25000层额外递增1e10攻击（大数安全）
    if (floor > 350000) {
        const extraSteps = Math.floor((floor - 350000) / 25000);
        if (extraSteps > 0) {
            const extraMultiplier = bigSciToStorageValue('1e' + String(10 * extraSteps));
            attack = bigSciToStorageValue(mulBigSci(attack, extraMultiplier));
        }
    }
    let damageReduction = 0;
    let dodgeChance = 0;
    let blockCount = 0;
    let attackCount = 1;
    let damageTakenMultiplier = 1;

    selectedModifiers.forEach(modifier => {
        const effect = monsterModifiers[modifier];
        if (effect.attackMultiplier) attack = multiplyBigByFinite(attack, effect.attackMultiplier);
        if (effect.damageReduction) damageReduction += effect.damageReduction;
        if (effect.dodgeChance) dodgeChance += effect.dodgeChance;
        if (effect.blockCount) blockCount += effect.blockCount;
        if (effect.attackCount) attackCount = effect.attackCount;
        if (effect.damageTakenMultiplier) damageTakenMultiplier *= effect.damageTakenMultiplier;
    });

    // 生成怪物，包含复活次数
    player.tower.monster = {
        name: `${getRandomMonsterName()} 等级${Math.floor(floor * 3 + 7)}`,
        rank: rank,
        health: healthValue,
        maxHealth: healthValue,
        attack: attack,
        modifiers: selectedModifiers,
        damageReduction: damageReduction,
        dodgeChance: dodgeChance,
        blockCount: blockCount,
        attackCount: attackCount,
        damageTakenMultiplier: damageTakenMultiplier,
        resurrectionsLeft: 3 // 3次复活机会
    };
}

// 攻击通天塔怪物
function attackTowerMonster() {
const now = Date.now();
            // 移除超过1秒的点击记录
            player.clickTimestamps = player.clickTimestamps.filter(timestamp => now - timestamp < 1000);

            const clickLimit = 10 + player.reincarnationStats.clickLimitBonus.level; // 每级增加1次点击上限
            if (player.clickTimestamps.length >= clickLimit) {
                logAction("点击速度过快，请稍后再试！", "error");
                return;
            }

            player.clickTimestamps.push(now);
// 使用打怪模式属性
    const playerAttack = bigSciToStorageValue(player.battle.playerAttack);
    const playerCritRate = player.battle.playerCritRate;
    const playerCritDamage = player.battle.playerCritDamage;
    const playerMultiAttack = player.battle.playerMultiAttack;

    if (!player.tower.monster) return;
    
    const monster = player.tower.monster;
    let totalDamage = bigSciToStorageValue(0);
    let normalDamage = bigSciToStorageValue(0);
    let critDamage = bigSciToStorageValue(0);
    let critCount = 0;
    let dodgeCount = 0;
    let totalAttacks = player.tower.playerMultiAttack || 1;
    let battleLogs = [];
    let monsterDefeated = false;

    // 玩家攻击
    for (let i = 0; i < totalAttacks; i++) {
        // 检查是否已被击败
        if (bLteZero(monster.health)) break;
        
        // 检查闪避
        if (Math.random() < monster.dodgeChance) {
            dodgeCount++;
            battleLogs.push(`${monster.name}闪避了你的攻击！`);
            continue;
        }
        
        // 计算基础伤害
        let damage = bigSciToStorageValue(player.tower.playerAttack);
        
        // 应用伤害减免
        damage = multiplyBigByFinite(damage, (1 - monster.damageReduction));
        
        // 应用伤害乘数
        damage = multiplyBigByFinite(damage, monster.damageTakenMultiplier);
        
        // 检查暴击
        let isCrit = Math.random() < player.tower.playerCritRate;
        if (isCrit) {
            damage = multiplyBigByFinite(damage, player.tower.playerCritDamage);
            critCount++;
            critDamage = bigSciToStorageValue(addBigSci(critDamage, damage));
        } else {
            normalDamage = bigSciToStorageValue(addBigSci(normalDamage, damage));
        }
        
        // 应用伤害
        monster.health = bSub(monster.health, damage);
        totalDamage = bigSciToStorageValue(addBigSci(totalDamage, damage));
        
        battleLogs.push(`你对${monster.name}造成了${formatSci(damage)}点伤害${isCrit ? '（暴击！）' : ''}`);
        
        // 检查怪物是否被击败
        if (bLteZero(monster.health)) {
            // 检查是否还有复活次数
            if (monster.resurrectionsLeft > 0) {
                monster.resurrectionsLeft--;
                monster.health = monster.maxHealth; // 复活回满血
                battleLogs.push(`${monster.name}复活了！剩余复活次数: ${monster.resurrectionsLeft}`);
                
                // BOSS复活后立刻攻击玩家1次
                towerMonsterCounterAttack();
            } else {
                battleLogs.push(`你击败了${monster.name}！`);
                monsterDefeated = true;
            }
            break; // 结束当前连击
          initTowerPlayerStats();
         updateOfficialSystemDisplay();
        updateMonsterUI(); // 更新UI显示
        }
    }

    // 输出综合攻击日志
    battleLogs.push(`你造成了${formatSci(totalDamage)}点伤害 (${totalAttacks}连击) - 普通伤害: ${formatSci(normalDamage)}, 闪避x${dodgeCount}, 暴击x${critCount}`);
    
    // 批量写入战斗日志，不逐条刷新 DOM，最后统一由 updateTowerUI 刷新
    battleLogs.forEach(log => addTowerBattleLog(log, true));

    // 如果怪物被彻底击败（无复活次数）
    if (monsterDefeated) {
        player.tower.currentFloor++;
        player.tower.maxFloor = Math.max(player.tower.maxFloor, player.tower.currentFloor);
        addTowerBattleLog(`通关通天塔第${player.tower.currentFloor}层！`, true);
        checkTitleUnlocks();
        // 更新总属性点
        player.attributes.totalPoints = player.reincarnationCount * 1 + player.battle.maxStage * 10 + player.tower.currentFloor * 1;
        player.attributes.remainingPoints++; // 每通关一层增加1点剩余属性点
        initTowerPlayerStats();
        // 自动进入下一关
        generateTowerMonster();
        updateTowerUI();
        return;
    }

    // 怪物反击（如果还活着）
    if (!bLteZero(monster.health)) {
        towerMonsterCounterAttack();
    }

    // 检查玩家是否被击败
    if (bLteZero(player.tower.playerHealth)) {
        addTowerBattleLog('你被怪物击败了！', true);
       // 重置当前层怪物
        generateTowerMonster();
        // 重置玩家状态
        initTowerPlayerStats();
      
      
    }

    updateTowerUI();

}

// 通天塔怪物反击
function towerMonsterCounterAttack() {
    const monster = player.tower.monster;
    if (!monster || bLteZero(monster.health)) return;
    
    for (let i = 0; i < monster.attackCount; i++) {
        // 检查玩家闪避
        if (Math.random() < (player.attributes.dodge * 0.001 || 0)) {
            addTowerBattleLog(`你闪避了${monster.name}的攻击！`, true);
            continue;
        }        
        
        // 玩家受到伤害
        player.tower.playerHealth = bSub(player.tower.playerHealth, monster.attack);
        addTowerBattleLog(`${monster.name}对你造成了${formatSci(monster.attack)}点伤害`, true);
        
        // 检查玩家是否被击败
        if (bLteZero(player.tower.playerHealth)) {
            break;
        }
    }
}

// 切换通天塔自动攻击
function toggleTowerAutoAttack() {
    player.tower.isAutoAttacking = !player.tower.isAutoAttacking;
    document.getElementById('towerAutoAttackStatus').textContent = player.tower.isAutoAttacking ? '开' : '关';
    
    if (player.tower.isAutoAttacking) {
        startTowerAutoAttack();
    } else {
        stopTowerAutoAttack();
    }
}

// 开始通天塔自动攻击
function startTowerAutoAttack() {
    // 先停止现有的自动攻击
    stopTowerAutoAttack();
    
    // 每200ms攻击一次（约每秒5次），减轻卡顿；原100ms过于频繁导致界面很卡
    player.tower.autoAttackInterval = registerInterval(() => {
        if (player.tower.isAutoAttacking && player.tower.monster) {
            attackTowerMonster();
        }
    }, 200);
}

// 停止通天塔自动攻击
function stopTowerAutoAttack() {
    if (player.tower.autoAttackInterval) {
        clearInterval(player.tower.autoAttackInterval);
        player.tower.autoAttackInterval = null;
    }
}

// 添加通天塔战斗日志（skipUIUpdate=true 时只写数据不刷新DOM，用于批量添加后统一刷新，减轻卡顿）
function addTowerBattleLog(message, skipUIUpdate) {
    player.tower.battleLog.push({
        time: new Date(),
        message: message
    });
    if (player.tower.battleLog.length > 10) {
        player.tower.battleLog.shift();
    }
    if (!skipUIUpdate) {
        updateTowerBattleLog();
    }
}

// 更新通天塔战斗日志UI
function updateTowerBattleLog() {
    const logElement = document.getElementById('towerBattleLog');
    logElement.innerHTML = '';
    
    player.tower.battleLog.forEach(entry => {
        const logItem = document.createElement('div');
        logItem.className = 'battle-log-entry';
        logItem.textContent = entry.message;
        logElement.appendChild(logItem);
    });
    
    // 滚动到底部
    logElement.scrollTop = logElement.scrollHeight;
}

// 更新通天塔UI（自动攻击时：界面隐藏则跳过更新，界面显示时节流为每200ms最多一次，减轻卡顿）
function updateTowerUI() {
    if (!player.tower) return;
    const towerUIEl = document.getElementById('towerUI');
    if (towerUIEl && towerUIEl.style.display === 'none') return;
    if (player.tower.isAutoAttacking) {
        const now = Date.now();
        player.tower._lastUIUpdateTime = player.tower._lastUIUpdateTime || 0;
        if (now - player.tower._lastUIUpdateTime < 200) return;
        player.tower._lastUIUpdateTime = now;
    }
    const critMult = Number(player.tower.playerCritDamage);
    let critDamageText;
    if (!Number.isFinite(critMult)) critDamageText = '0%';
    else if (critMult > 1e6) critDamageText = '×' + critMult.toExponential(2);
    else critDamageText = ((critMult - 1) * 100).toFixed(1) + '%';
    // 更新玩家信息
    document.getElementById('towerPlayerHealth').textContent = formatSci(player.tower.playerHealth);
    document.getElementById('towerPlayerAttack').textContent = formatSci(player.tower.playerAttack);
    document.getElementById('towerPlayerCritRate').textContent = ((Number(player.tower.playerCritRate) || 0) * 100).toFixed(1) + '%';
    document.getElementById('towerPlayerCritDamage').textContent = critDamageText;
    const accEl = document.getElementById('towerPlayerAccuracy');
    const dodgeEl = document.getElementById('towerPlayerDodge');
    if (accEl) accEl.textContent = ((Number(player.tower.playerAccuracy) || 0) * 100).toFixed(1) + '%';
    if (dodgeEl) dodgeEl.textContent = ((Number(player.tower.playerDodge) || 0) * 100).toFixed(1) + '%';

    // 更新通天塔层数显示
    document.getElementById('towerFloor').textContent = player.tower.currentFloor;
    document.getElementById('towerCurrentFloor').textContent = player.tower.currentFloor;
    
    const bonus = player.tower.currentFloor * 0.01; // 每层增加0.01%
    document.getElementById("towerBonus").textContent = bonus.toFixed(2);
    // 更新怪物信息
    if (player.tower.monster) {
        const monster = player.tower.monster;
        const mods = Array.isArray(monster.modifiers) ? monster.modifiers : [];
        document.getElementById('towerMonsterName').textContent = monster.name || '—';
        document.getElementById('towerMonsterRank').textContent = monster.rank || '—';
        document.getElementById('towerMonsterHealth').textContent = formatSci(monster.health) + '/' + formatSci(monster.maxHealth);
        document.getElementById('towerMonsterAttack').textContent = formatSci(monster.attack);
        document.getElementById('towerMonsterModifiers').textContent = mods.length ? mods.join(', ') : '—';
        document.getElementById('towerMonsterResurrections').textContent = monster.resurrectionsLeft != null ? monster.resurrectionsLeft : 0;
    }
    
    // 更新自动攻击状态
    document.getElementById('towerAutoAttackStatus').textContent = player.tower.isAutoAttacking ? '开' : '关';
    // 更新战斗日志
    updateTowerBattleLog();
}
// 水果机配置
const slotMachineConfig = {
    symbols: ["🍒", "🍋", "🍊", "🍇", "🍉", "🍎", "7️⃣"],
    symbolProbabilities: [0.3, 0.25, 0.2, 0.15, 0.07, 0.02, 0.01],
    payouts: {
        "🍒🍒🍒": 5,
        "🍋🍋🍋": 10,
        "🍊🍊🍊": 15,
        "🍇🍇🍇": 20,
        "🍉🍉🍉": 25,
        "🍎🍎🍎": 50,
        "7️⃣7️⃣7️⃣": 100
    },
    minBet: 10,
    maxBet: 1000,
    autoSpinDelay: 2000 // 自动旋转间隔(毫秒)
};

// 初始化水果机数据
function initSlotMachine() {
    if (!player.slotMachine) {
        player.slotMachine = {
            bet: 10,
            autoSpin: false,
            history: [],
            lastResult: null
        };
    }
}

// 切换水果机界面
function toggleSlotMachine() {
    const overlay = document.getElementById("slotMachineOverlay");
    const ui = document.getElementById("slotMachineUI");
    
    if (ui.style.display === "block") {
        ui.style.display = "none";
        overlay.style.display = "none";
        
        // 停止自动旋转
        if (player.slotMachine.autoSpin) {
            toggleAutoSpin();
        }
    } else {
        ui.style.display = "block";
        overlay.style.display = "block";
        updateSlotMachineUI();
        
        // 有上次结果时恢复画面，避免与「最近结果」不一致
        if (player.slotMachine.lastResult && player.slotMachine.lastResult.length === 3) {
            setReelSymbols(player.slotMachine.lastResult);
        } else {
            initReels();
        }
    }
}

function createReelSymbolElement(text) {
    const symbol = document.createElement("div");
    symbol.style.height = "100px";
    symbol.style.display = "flex";
    symbol.style.alignItems = "center";
    symbol.style.justifyContent = "center";
    symbol.style.fontSize = "40px";
    symbol.textContent = text;
    return symbol;
}

function pickRandomSlotSymbol() {
    const idx = Math.floor(Math.random() * slotMachineConfig.symbols.length);
    return slotMachineConfig.symbols[idx];
}

// 将 3 个结果符号停在中间线（视窗第 2 行），上下用随机符号填充
function setReelSymbols(results) {
    const stopIndex = 0; // top=0 时中间线对应 index 1
    const paylineOffset = 1;

    for (let i = 1; i <= 3; i++) {
        const reel = document.getElementById(`reel${i}`);
        reel.style.transition = "none";
        reel.style.top = "0px";
        reel.innerHTML = "";

        for (let j = 0; j < 3; j++) {
            const text = (j === stopIndex + paylineOffset)
                ? results[i - 1]
                : pickRandomSlotSymbol();
            reel.appendChild(createReelSymbolElement(text));
        }
    }
}

// 初始化转轴符号
function initReels() {
    for (let i = 1; i <= 3; i++) {
        const reel = document.getElementById(`reel${i}`);
        reel.innerHTML = "";
        reel.style.transition = "none";
        reel.style.top = "0px";

        for (let j = 0; j < 20; j++) {
            reel.appendChild(createReelSymbolElement(pickRandomSlotSymbol()));
        }
    }
}

// 更新水果机界面
function updateSlotMachineUI() {
    document.getElementById("slotMachineBalance").textContent = formatNumber(player.items.yuzhou1);
    document.getElementById("currentBet").textContent = player.slotMachine.bet;
    
    const autoSpinButton = document.getElementById("autoSpinButton");
    autoSpinButton.textContent = `自动旋转: ${player.slotMachine.autoSpin ? "开启" : "关闭"}`;
    autoSpinButton.style.background = player.slotMachine.autoSpin ? 
        "linear-gradient(45deg, #FFD700, #FF8C00)" : "#444";
    
    // 更新历史记录
    const historyContainer = document.getElementById("slotHistory");
    historyContainer.innerHTML = "";
    
    player.slotMachine.history.slice(-5).forEach(result => {
        const historyItem = document.createElement("div");
        historyItem.style.fontSize = "12px";
        historyItem.style.marginBottom = "3px";
        
        if (result.win > 0) {
            historyItem.style.color = "#90EE90"; // 绿色表示赢
            historyItem.textContent = `${result.combination} - 赢得 ${formatNumber(result.win)} 星尘发票`;
        } else {
            historyItem.style.color = "#FF6B6B"; // 红色表示输
            historyItem.textContent = `${result.combination} - 未中奖`;
        }
        
        historyContainer.appendChild(historyItem);
    });
}

// 改变下注金额
function changeBet(amount) {
    const newBet = player.slotMachine.bet + amount * 10;
    
    if (newBet >= slotMachineConfig.minBet && newBet <= slotMachineConfig.maxBet) {
        player.slotMachine.bet = newBet;
        updateSlotMachineUI();
    }
}

// 旋转水果机
function spinSlotMachine() {
    if (player.items.yuzhou1 < player.slotMachine.bet) {
        logAction("转生币不足，无法旋转水果机", "error");
        return;
    }
    
    // 扣除下注金额
    player.items.yuzhou1 -= player.slotMachine.bet;
    
    // 禁用旋转按钮
    const spinButton = document.getElementById("spinButton");
    spinButton.disabled = true;
    spinButton.textContent = "旋转中...";
    
    // 生成随机结果（与转轴最终停轮符号一致）
    const results = [];
    for (let i = 0; i < 3; i++) {
        const rand = Math.random();
        let cumulativeProb = 0;
        let picked = null;

        for (let j = 0; j < slotMachineConfig.symbolProbabilities.length; j++) {
            cumulativeProb += slotMachineConfig.symbolProbabilities[j];
            if (rand <= cumulativeProb) {
                picked = slotMachineConfig.symbols[j];
                break;
            }
        }
        results.push(picked || slotMachineConfig.symbols[slotMachineConfig.symbols.length - 1]);
    }

    // 动画效果：停轮后中间线 = results
    const animMs = animateReels(results);

    // 检查中奖
    setTimeout(() => {
        checkWin(results);

        // 重新启用旋转按钮
        spinButton.disabled = false;
        spinButton.textContent = "旋转";

        // 如果自动旋转开启，继续旋转
        if (player.slotMachine.autoSpin) {
            setTimeout(() => {
                if (player.items.yuzhou1 >= player.slotMachine.bet) {
                    spinSlotMachine();
                } else {
                    toggleAutoSpin(); // 余额不足，停止自动旋转
                    logAction("星尘发票不足，自动旋转已停止", "warning");
                }
            }, slotMachineConfig.autoSpinDelay);
        }
    }, animMs + 100);
}

// 转轴动画：把 results 停在每个转轴的中间线
function animateReels(results) {
    const symbolHeight = 100;
    const paylineOffset = 1; // 视窗高 300px，中间行
    let maxDurationMs = 0;

    for (let i = 1; i <= 3; i++) {
        const reel = document.getElementById(`reel${i}`);
        const targetSymbol = results[i - 1];
        const stopIndex = 6 + i * 2; // 各轴停轮距离不同，形成先后停下
        const totalSymbols = stopIndex + 3;
        const durationSec = 2.2 + i * 0.4;
        maxDurationMs = Math.max(maxDurationMs, durationSec * 1000);

        reel.style.transition = "none";
        reel.style.top = "0px";
        reel.innerHTML = "";

        for (let j = 0; j < totalSymbols; j++) {
            const text = (j === stopIndex + paylineOffset)
                ? targetSymbol
                : pickRandomSlotSymbol();
            reel.appendChild(createReelSymbolElement(text));
        }

        // 强制回流后再开过渡，否则二次旋转可能无动画
        void reel.offsetHeight;
        reel.style.transition = `top ${durationSec}s cubic-bezier(0.17, 0.67, 0.83, 0.67)`;
        reel.style.top = `${-(stopIndex * symbolHeight)}px`;
    }

    return maxDurationMs;
}

// 检查中奖
function checkWin(results) {
    const combination = results.join("");
    let winAmount = 0;
    
    // 检查是否中奖
    if (slotMachineConfig.payouts[combination]) {
        winAmount = player.slotMachine.bet * slotMachineConfig.payouts[combination];
        player.items.yuzhou1 += winAmount;
        
        // 显示中奖信息
        const resultElement = document.getElementById("slotResult");
        resultElement.textContent = `恭喜！${combination} 赢得 ${formatNumber(winAmount)} 星尘发票！`;
        resultElement.style.color = "#90EE90";
        resultElement.style.fontSize = "18px";
        
        // 中奖动画
        resultElement.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(1.2)', opacity: 0.8 },
            { transform: 'scale(1)', opacity: 1 }
        ], {
            duration: 500,
            iterations: 3
        });
        
        logAction(`水果机中奖：${combination}，赢得 ${formatNumber(winAmount)} 星尘发票`, "success");
    } else {
        const resultElement = document.getElementById("slotResult");
        resultElement.textContent = "未中奖，再试一次！";
        resultElement.style.color = "#FF6B6B";
        
        logAction(`水果机未中奖：${combination}`, "info");
    }
    
    // 保存结果历史（与画面中间线一致）
    player.slotMachine.lastResult = results.slice();
    player.slotMachine.history.push({
        combination: results.join(""),
        win: winAmount,
        timestamp: Date.now()
    });

    // 限制历史记录数量
    if (player.slotMachine.history.length > 10) {
        player.slotMachine.history.shift();
    }

    updateSlotMachineUI();
    updateDisplay();
}

// 切换自动旋转
function toggleAutoSpin() {
    player.slotMachine.autoSpin = !player.slotMachine.autoSpin;
    updateSlotMachineUI();
    
    if (player.slotMachine.autoSpin && player.items.yuzhou1 >= player.slotMachine.bet) {
        spinSlotMachine();
    }
}

// 格式化数字显示
function formatNumber(num) {
    return formatSci(num);
}






// 官职配置
const officialConfig = [
    { level: 1, name: "将仕郎（九品）", attackMultiplier: 2, cost: 100 },
    { level: 2, name: "文林郎（九品）", attackMultiplier: 3, cost: 1000 },
    { level: 3, name: "登仕郎（九品）", attackMultiplier: 4, cost: 10000 },
    { level: 4, name: "儒林郎（九品）", attackMultiplier: 5, cost: 100000 },
    { level: 5, name: "承务郎（八品）", attackMultiplier: 6, cost: 1000000 },
    { level: 6, name: "承奉郎（八品）", attackMultiplier: 7, cost: 1000000 },
    { level: 7, name: "征事郎（八品）", attackMultiplier: 8, cost: 10000000 },
    { level: 8, name: "给事郎（八品）", attackMultiplier: 9, cost: 100000000 },
    { level: 9, name: "宣议郎（七品）", attackMultiplier: 10, cost: 1000000000 },
    { level: 10, name: "朝散郎（七品）", attackMultiplier: 15, cost: 1000000000 },
    { level: 11, name: "武骑尉（七品）", attackMultiplier: 20, cost: 10000000000 },
    { level: 12, name: "宣德郎（七品）", attackMultiplier: 25, cost: 100000000000 },
    { level: 13, name: "朝请郎（七品）", attackMultiplier: 30, cost: 1000000000000 },
    { level: 14, name: "云骑尉（七品）", attackMultiplier: 35, cost: 10000000000000 },
    { level: 15, name: "通直郎（六品）", attackMultiplier: 40, cost: 100000000000000 },
    { level: 16, name: "奉议郎（六品）", attackMultiplier: 45, cost: 1000000000000000 },
    { level: 17, name: "飞骑尉（六品）", attackMultiplier: 50, cost: 10000000000000000 },
    { level: 18, name: "飞骑尉（六品）", attackMultiplier: 55, cost: 100000000000000000 },
    { level: 19, name: "承议郎（六品）", attackMultiplier: 60, cost: 1000000000000000000 },
    { level: 20, name: "承议郎（六品）", attackMultiplier: 65, cost: 10000000000000000000 },
    { level: 21, name: "朝议郎（六品）", attackMultiplier: 70, cost: 100000000000000000000 },
    { level: 22, name: "晓骑尉（六品）", attackMultiplier: 75, cost: 1000000000000000000000 },
    { level: 23, name: "游击将军（五品）", attackMultiplier: 80, cost: 10000000000000000000000 },
    { level: 24, name: "游击将军（五品）", attackMultiplier: 85, cost: 100000000000000000000000 },
    { level: 25, name: "游骑将军（五品）", attackMultiplier: 90, cost: 1000000000000000000000000 },
    { level: 26, name: "骑都尉（五品）", attackMultiplier: 95, cost: 10000000000000000000000000 },
    { level: 27, name: "怀化郎将（五品）", attackMultiplier: 100, cost: 100000000000000000000000000 },
    { level: 28, name: "宁远将军（五品）", attackMultiplier: 150, cost: 1000000000000000000000000000 },
    { level: 29, name: "定远将军（五品）", attackMultiplier: 200, cost: 10000000000000000000000000000 },
    { level: 30, name: "归德中郎将（四品）", attackMultiplier: 250, cost: 100000000000000000000000000000 },
    { level: 31, name: "明威将军（四品）", attackMultiplier: 300, cost: 1000000000000000000000000000000 },
    { level: 32, name: "宣威将军（四品）", attackMultiplier: 350, cost: 10000000000000000000000000000000 },
    { level: 33, name: "轻车都尉（四品）", attackMultiplier: 400, cost: 100000000000000000000000000000000 },
    { level: 34, name: "怀化中郎将（四品）", attackMultiplier: 450, cost: 1000000000000000000000000000000000 },
    { level: 35, name: "忠武将军（四品）", attackMultiplier: 500, cost: 10000000000000000000000000000000000 },
    { level: 36, name: "归德将军（三品）", attackMultiplier: 550, cost: 100000000000000000000000000000000000 },
    { level: 37, name: "云麾将军（三品）", attackMultiplier: 600, cost: 1000000000000000000000000000000000000 },
    { level: 38, name: "护军（三品）", attackMultiplier: 650, cost: 10000000000000000000000000000000000000 },
    { level: 39, name: "怀化大将军（三品）", attackMultiplier: 700, cost: 100000000000000000000000000000000000000 },
    { level: 40, name: "冠军大将军（三品）", attackMultiplier: 750, cost: 1000000000000000000000000000000000000000 },
    { level: 41, name: "镇军大将军（二品）", attackMultiplier: 800, cost: 10000000000000000000000000000000000000000 },
    { level: 42, name: "辅国大将军（二品）", attackMultiplier: 850, cost: 100000000000000000000000000000000000000000 },
    { level: 43, name: "骠骑大将军（一品）", attackMultiplier: 900, cost: 1000000000000000000000000000000000000000000 },
    { level: 44, name: "异地王（特品）", attackMultiplier: 950, cost: 10000000000000000000000000000000000000000000 },
    { level: 45, name: "王爷（特品）", attackMultiplier: 1000, cost: 100000000000000000000000000000000000000000000 },
    { level: 46, name: "国师（特品）", attackMultiplier: 1500, cost: 1000000000000000000000000000000000000000000000 },
    { level: 47, name: "丞相（特品）", attackMultiplier: 2000, cost: 10000000000000000000000000000000000000000000000 },
    { level: 48, name: "辅佐王（特品）", attackMultiplier: 2500, cost: 100000000000000000000000000000000000000000000000 },
    { level: 49, name: "监证（圣品）", attackMultiplier: 3000, cost: 1000000000000000000000000000000000000000000000000 },
    { level: 50, name: "七皇子（圣品）", attackMultiplier: 3500, cost: 10000000000000000000000000000000000000000000000000 },
    { level: 51, name: "六皇子（圣品）", attackMultiplier: 4000, cost: 100000000000000000000000000000000000000000000000000 },
    { level: 52, name: "五皇子（圣品）", attackMultiplier: 4500, cost: 1000000000000000000000000000000000000000000000000000 },
    { level: 53, name: "四皇子（圣品）", attackMultiplier: 5000, cost: 10000000000000000000000000000000000000000000000000000 },
    { level: 54, name: "三皇子（神品）", attackMultiplier: 5500, cost: 100000000000000000000000000000000000000000000000000000 },
    { level: 55, name: "二皇子（神品）", attackMultiplier: 6000, cost: 1000000000000000000000000000000000000000000000000000000 },
    { level: 56, name: "一皇子（神品）", attackMultiplier: 6500, cost: 10000000000000000000000000000000000000000000000000000000 },
    { level: 57, name: "大殿下（神品）", attackMultiplier: 7000, cost: 100000000000000000000000000000000000000000000000000000000 },
    { level: 58, name: "太子爷（仙品）", attackMultiplier: 7500, cost: 1000000000000000000000000000000000000000000000000000000000 },
    { level: 59, name: "皇帝（仙品）", attackMultiplier: 8000, cost: 10000000000000000000000000000000000000000000000000000000000 },
    { level: 60, name: "太上皇（仙品）", attackMultiplier: 8500, cost: 100000000000000000000000000000000000000000000000000000000000 },
  { level: 61, name: "仙兵（帝品）", attackMultiplier: 9000, cost: 1000000000000000000000000000000000000000000000000000000000000000 },
 { level: 62, name: "仙君（帝品）", attackMultiplier: 9500, cost: 100000000000000000000000000000000000000000000000000000000000000000000 },
 { level: 63, name: "仙皇（帝品）", attackMultiplier: 10000, cost: 10000000000000000000000000000000000000000000000000000000000000000000000000 },
 { level: 64, name: "仙王（帝品）", attackMultiplier: 15000, cost: 1000000000000000000000000000000000000000000000000000000000000000000000000000000 },
 { level: 65, name: "仙帝（帝品）", attackMultiplier: 20000, cost: 100000000000000000000000000000000000000000000000000000000000000000000000000000000000 }

];

// 切换官职系统界面显示
function toggleOfficialSystem() {
   if (player.reincarnationCount < 10) {
        alert("需要达到10转才能开启官职系统！");
        return;
    }
    const ui = document.getElementById('officialSystemUI');
    const overlay = document.getElementById('officialSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateOfficialSystemDisplay();
    }
}

// 更新官职系统界面显示
function updateOfficialSystemDisplay() {
    const currentLevel = player.officialLevel;
    let currentOfficial = null;
    let nextOfficial = null;
    
    if (currentLevel > 0) {
        currentOfficial = officialConfig.find(oc => oc.level === currentLevel);
    }
    
    if (currentLevel < 65) {
        nextOfficial = officialConfig.find(oc => oc.level === currentLevel + 1);
    }
    
    // 更新当前官职显示
    document.getElementById('officialTitleDisplay').textContent = currentOfficial ? currentOfficial.name : '无';
    document.getElementById('officialLevelDisplay').textContent = currentLevel;
    document.getElementById('officialBonusDisplay').textContent = currentOfficial ? currentOfficial.attackMultiplier : 1;
    document.getElementById('currentOfficialTitle').textContent = currentOfficial ? currentOfficial.name : '无';
    
    // 更新下一阶官职信息
    const nextOfficialEl = document.getElementById('nextOfficialInfo');
    if (nextOfficial) {
        nextOfficialEl.innerHTML = `${nextOfficial.name} - 攻击加成: ${nextOfficial.attackMultiplier}倍, 消耗: ${formatNumber(nextOfficial.cost)}转生币`;
    } else if (currentLevel >= 65) {
        nextOfficialEl.textContent = '已达到最高官职';
    } else {
        nextOfficialEl.textContent = '请升级官职';
    }
}

// 按指定次数升级官职
function upgradeOfficialByAmount() {
    const amount = parseInt(document.getElementById('officialUpgradeAmount').value) || 1;
    let upgraded = 0;
    
    for (let i = 0; i < amount; i++) {
        if (!upgradeOfficial()) {
            break;
        }
        upgraded++;
    }
    
    if (upgraded > 0) {
        logAction(`成功升级${upgraded}级官职！`, 'success');
        updateOfficialSystemDisplay();
        updateDisplay();
    }
}        

// 一键升级到最大可能等级
function upgradeOfficialMaxPossible() {
    let upgraded = 0;
    
    while (upgradeOfficial()) {
        upgraded++;
    }
    
    if (upgraded > 0) {
        logAction(`成功升级${upgraded}级官职！`, 'success');
        updateOfficialSystemDisplay();
        updateDisplay();
    }
}

// 升级一级官职
function upgradeOfficial() {
    const nextLevel = player.officialLevel + 1;
    if (nextLevel > 65) {
        logAction("已达到最高官职！", "error");
        return false;
    }
    
    const nextOfficial = officialConfig.find(oc => oc.level === nextLevel);
    if (!nextOfficial) {
        logAction("无法找到下一阶官职配置！", "error");
        return false;
    }
    
    if (player.reincarnationCoin >= nextOfficial.cost) {
        player.reincarnationCoin -= nextOfficial.cost;
        player.officialLevel = nextLevel;
        return true;
    } else {
        logAction("转生币不足，无法升级官职！", "error");
        return false;
    }
}

// 添加格式化大数字的函数（如果没有的话）
function formatNumber(num) {
    return formatSci(num);
}
function getOfficialBonus() {
    if (player.officialLevel === 0) return 1;
    
    const official = officialConfig.find(oc => oc.level === player.officialLevel);
    return official ? official.attackMultiplier : 1;
}

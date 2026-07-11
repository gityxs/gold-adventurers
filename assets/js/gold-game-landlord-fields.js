// 地主田地扩展
function toggleFieldLock(fieldIndex) {
    if (fieldIndex >= player.landlord.unlockedFields) {
        showLandlordNotification("田地未解锁！", "error");
        return;
    }
    
    player.landlord.lockedFields[fieldIndex] = !player.landlord.lockedFields[fieldIndex];
    
    // 更新显示
    renderLandlordFields();
    
    const fieldNumber = fieldIndex + 1;
    showLandlordNotification(`田地${fieldNumber}已${player.landlord.lockedFields[fieldIndex] ? '锁定' : '解锁'}！`, "info");
    saveGame();
    
  updateLockedFieldsCount();
}

// 一键锁定所有田地
function lockAllFields() {
    for (let i = 0; i < player.landlord.unlockedFields; i++) {
        player.landlord.lockedFields[i] = true;
    }
    renderLandlordFields();
    showLandlordNotification("已锁定所有田地！", "success");
    saveGame();
}

// 一键解锁所有田地
function unlockAllFields() {
    for (let i = 0; i < player.landlord.unlockedFields; i++) {
        player.landlord.lockedFields[i] = false;
    }
    renderLandlordFields();
    showLandlordNotification("所有田地已解锁！", "success");
    saveGame();
}
function lockPlantedFields() {
    let lockedCount = 0;
    for (let i = 0; i < player.landlord.unlockedFields; i++) {
        if (player.landlord.fields[i] !== null) {
            player.landlord.lockedFields[i] = true;
            lockedCount++;
        }
    }
    renderLandlordFields();
    showLandlordNotification(`已锁定${lockedCount}块有作物的田地！`, "success");
    saveGame();
}

// 仅锁定成熟作物
function lockMatureFields() {
    let lockedCount = 0;
    for (let i = 0; i < player.landlord.unlockedFields; i++) {
        const plant = player.landlord.fields[i];
        if (plant && plant.isMature) {
            player.landlord.lockedFields[i] = true;
            lockedCount++;
        }
    }
    renderLandlordFields();
    showLandlordNotification(`已锁定${lockedCount}块有成熟作物的田地！`, "success");
    saveGame();
}
        // 添加一个快速收获所有成熟作物的函数
       function harvestAllMatureLandlordPlants() {
    let harvestedCount = 0;
    let totalValue = 0;
    let skippedCount = 0;
    let lockedSkipped = 0;
    let storageFullSkipped = 0;
    
    player.landlord.fields.forEach((plant, index) => {
        if (plant && plant.isMature) {
            // 检查田地是否锁定
            if (player.landlord.lockedFields[index]) {
                lockedSkipped++;
                return; // 跳过锁定的田地
            }
            
            // 检查仓库是否已满
            if (player.landlord.fruitStorage.length >= 200) {
                storageFullSkipped++;
                return;
            }
            
            // 计算价值
            const value = calculateLandlordPlantValue(plant);
            totalValue += value;
            
            // 添加到果实仓库
            const fruit = {
                type: plant.type,
                weight: plant.weight,
                value: value,
                mutations: [...plant.mutations],
                weatherMutations: [...plant.weatherMutations],
                specialMutation: plant.specialMutation,
                harvestedAt: new Date().toLocaleString('zh-CN'),
                harvestedTimestamp: Date.now(),
                isLocked: false,
                fieldTier: Number(plant.fieldTier) || 0
            };
            
            player.landlord.fruitStorage.push(fruit);
            
            // 重新生成植物
            player.landlord.fields[index] = createNewLandlordPlant(plant.type, index);
            harvestedCount++;
        }
    });
    
    if (harvestedCount > 0) {
        // 更新统计
        player.landlord.stats.totalHarvests += harvestedCount;
        player.landlord.stats.totalCoinsEarned += totalValue;
        
        // 更新显示
        renderLandlordFields();
        renderLandlordFruitStorage();
        updateLandlordStats();
        
        let message = `一键收获了${harvestedCount}个作物，总价值${formatNumber(totalValue)}地主币！`;
        
        if (lockedSkipped > 0 || storageFullSkipped > 0) {
            message += `（已跳过`;
            if (lockedSkipped > 0) {
                message += ` ${lockedSkipped}个锁定的田地`;
            }
            if (storageFullSkipped > 0) {
                if (lockedSkipped > 0) message += '，';
                message += ` ${storageFullSkipped}个因仓库满`;
            }
            message += '）';
        }
        
        showLandlordNotification(message, "success");
        saveGame();
    } else {
        let message = "没有可收获的成熟作物！";
        if (lockedSkipped > 0) {
            message = `有${lockedSkipped}个成熟作物因田地锁定未收获`;
        } else if (storageFullSkipped > 0) {
            message = `有${storageFullSkipped}个成熟作物因仓库已满未收获`;
        }
        showLandlordNotification(message, "info");
    }
}

        // 添加一键收获按钮到界面
     function addHarvestAllButton() {
    const fieldsTab = document.getElementById('landlordFieldsTab');
    if (fieldsTab && !fieldsTab.querySelector('.harvest-controls')) {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'harvest-controls';
        controlsDiv.style.marginBottom = '20px';
        controlsDiv.style.padding = '15px';
        controlsDiv.style.background = 'linear-gradient(135deg, #f8f9fa, #e9ecef)';
        controlsDiv.style.borderRadius = '10px';
        controlsDiv.style.border = '2px solid #8f9779';
        controlsDiv.style.boxShadow = '0 4px 12px rgba(85, 107, 47, 0.1)';
        
        controlsDiv.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span style="color: #556b2f; font-size: 1.2em;">🔒</span>
                    <h3 style="margin: 0; color: #2c3e50;">田地锁定管理</h3>
                </div>
                <div style="font-size: 0.9em; color: #5a6f1f; padding-left: 25px;">
                    锁定的田地不会被一键收获，但仍可单独操作
                </div>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                <button class="landlord-action-button harvest-all-button" onclick="harvestAllMatureLandlordPlants()">
                    <span style="font-size: 1.2em; margin-right: 8px;">🚜</span>
                    一键收获（跳过锁定）
                </button>
                
                <div style="flex: 1; min-width: 250px;">
                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        <button class="lock-control-button lock-all-btn" onclick="lockAllFields()" 
                                title="锁定所有田地，防止被一键收获">
                            <span style="margin-right: 5px;">🔒</span>
                            全部锁定
                        </button>
                        <button class="lock-control-button unlock-all-btn" onclick="unlockAllFields()"
                                title="解锁所有田地，允许一键收获">
                            <span style="margin-right: 5px;">🔓</span>
                            全部解锁
                        </button>
                        <button class="lock-control-button lock-planted-btn" onclick="lockPlantedFields()"
                                title="只锁定有作物的田地">
                            <span style="margin-right: 5px;">🌱</span>
                            锁定有作物
                        </button>
                        <button class="lock-control-button lock-mature-btn" onclick="lockMatureFields()"
                                title="只锁定有成熟作物的田地">
                            <span style="margin-right: 5px;">🌾</span>
                            锁定成熟
                        </button>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; 
                        padding: 10px 15px; background: rgba(85, 107, 47, 0.1); 
                        border-radius: 8px; border: 1px solid #8f9779;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 12px; height: 12px; background: #556b2f; border-radius: 2px;"></div>
                    <span style="color: #5a6f1f; font-size: 0.85em;">锁定状态</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.85em; color: #6c757d;">已锁定</div>
                    <div style="font-size: 1.4em; font-weight: bold; color: #556b2f;">
                        <span id="lockedFieldsCount">0</span>
                        <span style="font-size: 0.7em; color: #8f9779;"> /∞</span>
                    </div>
                </div>
            </div>
        `;
        
        fieldsTab.insertBefore(controlsDiv, fieldsTab.firstChild);
        
        // 更新锁定计数显示
        updateLockedFieldsCount();
    }
}

// 更新锁定田地计数
function updateLockedFieldsCount() {
    const countElement = document.getElementById('lockedFieldsCount');
    if (countElement) {
        let lockedCount = 0;
        for (let i = 0; i < player.landlord.unlockedFields; i++) {
            if (player.landlord.lockedFields[i]) {
                lockedCount++;
            }
        }
        countElement.textContent = lockedCount;
    }
}

// 在渲染田地后更新计数
const originalRenderLandlordFields = renderLandlordFields;
renderLandlordFields = function() {
    originalRenderLandlordFields();
    updateLockedFieldsCount();
    addHarvestAllButton();
};
   
        // 卖出所有果实
       function sellAllLandlordFruits() {
    if (player.landlord.fruitStorage.length === 0) {
        showLandlordNotification("没有果实可卖出！", "error");
        return;
    }
    
    let totalValue = 0;
    let soldCount = 0;
    let lockedCount = 0;
    let lotteryEarned = 0;
    
    ensureLandlordBars(player.landlord);
    const barGain = { silver: 0, gold: 0, diamond: 0, flow: 0 };
    const barMap = { '银': 'silver', '金': 'gold', '水晶': 'diamond', '流光': 'flow' };

    // 从后往前遍历，避免splice导致的索引问题
    for (let i = player.landlord.fruitStorage.length - 1; i >= 0; i--) {
        const fruit = player.landlord.fruitStorage[i];
        if (!fruit.isLocked) {
            totalValue += fruit.value;
            
            // 检查是否获得抽奖次数
            if (isFruitEligibleForLottery(fruit)) {
                lotteryEarned++;
            }

            (fruit.mutations || []).forEach(function (m) {
                const k = barMap[m];
                if (k) barGain[k]++;
            });
            
            player.landlord.fruitStorage.splice(i, 1);
            soldCount++;
        } else {
            lockedCount++;
        }
    }
    
    if (soldCount > 0) {
        Object.keys(barGain).forEach(function (k) {
            player.landlord.bars[k] = (player.landlord.bars[k] || 0) + barGain[k];
        });
        // 增加地主币和抽奖次数
        player.landlord.coins += totalValue;
        player.landlord.lottery.drawCount += lotteryEarned;
        
        // 更新显示
        updateLandlordCoinDisplay();
        renderLandlordFruitStorage();
        updateLotteryDisplay();
        updateLandlordStats();
        
        let message = `一键卖出${soldCount}个果实，获得${formatNumber(totalValue)}地主币`;
        const barMsgParts = [];
        if (barGain.silver) barMsgParts.push('银条×' + barGain.silver);
        if (barGain.gold) barMsgParts.push('金条×' + barGain.gold);
        if (barGain.diamond) barMsgParts.push('钻石条×' + barGain.diamond);
        if (barGain.flow) barMsgParts.push('流光条×' + barGain.flow);
        if (barMsgParts.length > 0) message += '，' + barMsgParts.join('，');
        if (lotteryEarned > 0) {
            message += `，获得${lotteryEarned}次抽奖机会！`;
        }
        if (lockedCount > 0) {
            message += ` (${lockedCount}个已锁定的果实未卖出)`;
        }
        
        showLandlordNotification(message, "success");
        saveGame();
    } else {
        if (lockedCount > 0) {
            showLandlordNotification(`所有${lockedCount}个果实都已锁定，无法卖出！`, "info");
        } else {
            showLandlordNotification("没有果实可卖出！", "error");
        }
    }
}
function drawLottery() {
    if (!player.landlord.lottery.drawCount) {
        player.landlord.lottery.drawCount = 0;
    }
    
    if (player.landlord.lottery.drawCount < lotterySystem.costPerDraw) {
        showLandlordNotification(`抽奖次数不足！需要${lotterySystem.costPerDraw}次抽奖机会`, "error");
        return;
    }
    
    // 消耗抽奖次数
    player.landlord.lottery.drawCount -= lotterySystem.costPerDraw;
    player.landlord.lottery.totalDraws = (player.landlord.lottery.totalDraws || 0) + 1;
    
    // 抽奖逻辑
    const randomValue = Math.random() * 100;
    let cumulativeProbability = 0;
    let wonPrize = null;
    
    for (const prize of lotterySystem.prizePool) {
        cumulativeProbability += prize.probability;
        if (randomValue <= cumulativeProbability) {
            wonPrize = prize;
            break;
        }
    }
    
    // 确保有奖品
    if (!wonPrize) {
        wonPrize = lotterySystem.prizePool[0];
    }
    
    if (!player.landlord.lottery.drawHistory) {
        player.landlord.lottery.drawHistory = [];
    }
    if (!player.landlord.lottery.prizesWon) {
        player.landlord.lottery.prizesWon = {};
    }

    let animPrize = wonPrize;
    const drawResult = {
        prize: '',
        time: new Date().toLocaleString('zh-CN'),
        timestamp: Date.now()
    };

    if (wonPrize.prizeType === 'ranchAnimal') {
        ensureLandlordRanch(player.landlord);
        const wgt = Math.max(1, Math.floor(Number(wonPrize.weight) || 1));
        const parts = [];
        for (let gi = 0; gi < wgt; gi++) {
            const g = landlordRanchGrantOneFromLottery();
            parts.push(g.label || '?');
        }
        drawResult.prize = '【牧场】' + parts.join('、');
        const pk = '随机牧场动物';
        if (!player.landlord.lottery.prizesWon[pk]) player.landlord.lottery.prizesWon[pk] = 0;
        player.landlord.lottery.prizesWon[pk]++;
        animPrize = { name: drawResult.prize, weight: wgt, actualProbability: wonPrize.actualProbability, prizeType: 'ranchAnimal' };
    } else {
        drawResult.prize = wonPrize.name;
        if (!player.landlord.lottery.prizesWon[wonPrize.name]) {
            player.landlord.lottery.prizesWon[wonPrize.name] = 0;
        }
        player.landlord.lottery.prizesWon[wonPrize.name]++;
        if (!player.landlord.seedStorage) {
            player.landlord.seedStorage = {};
        }
        if (!player.landlord.seedStorage[wonPrize.name]) {
            player.landlord.seedStorage[wonPrize.name] = 0;
        }
        player.landlord.seedStorage[wonPrize.name] += wonPrize.weight;
    }

    player.landlord.lottery.drawHistory.unshift(drawResult);
    if (player.landlord.lottery.drawHistory.length > 20) {
        player.landlord.lottery.drawHistory = player.landlord.lottery.drawHistory.slice(0, 20);
    }

    renderLotteryInterface();
    if (typeof renderLandlordSeedStorage === 'function') {
        renderLandlordSeedStorage();
    }
    if (wonPrize.prizeType === 'ranchAnimal' && typeof renderLandlordRanch === 'function') {
        renderLandlordRanch();
    }
    showLotteryAnimation(animPrize);
    
    // 记录抽奖时间
    player.landlord.lottery.lastDrawTime = Date.now();
    
    saveGame();
}

// 7. 十连抽功能
function drawTenLottery() {
    const requiredDraws = lotterySystem.costPerDraw * 10;
    
    if (player.landlord.lottery.drawCount < requiredDraws) {
        showLandlordNotification(`抽奖次数不足！需要${requiredDraws}次抽奖机会`, "error");
        return;
    }
    
    let results = {};
    let totalPrizes = 0;
    if (!player.landlord.seedStorage) player.landlord.seedStorage = {};
    if (!player.landlord.lottery.prizesWon) player.landlord.lottery.prizesWon = {};
    if (!player.landlord.lottery.drawHistory) player.landlord.lottery.drawHistory = [];
    ensureLandlordRanch(player.landlord);

    // 执行10次抽奖
    for (let i = 0; i < 10; i++) {
        if (player.landlord.lottery.drawCount < lotterySystem.costPerDraw) break;
        
        player.landlord.lottery.drawCount -= lotterySystem.costPerDraw;
        player.landlord.lottery.totalDraws++;
        
        const randomValue = Math.random() * 100;
        let cumulativeProbability = 0;
        let wonPrize = null;
        
        for (const prize of lotterySystem.prizePool) {
            cumulativeProbability += prize.probability;
            if (randomValue <= cumulativeProbability) {
                wonPrize = prize;
                break;
            }
        }
        
        if (!wonPrize) {
            wonPrize = lotterySystem.prizePool[0];
        }

        let drawPrizeLabel = wonPrize.name;

        if (wonPrize.prizeType === 'ranchAnimal') {
            const wgt = Math.max(1, Math.floor(Number(wonPrize.weight) || 1));
            const parts = [];
            for (let gi = 0; gi < wgt; gi++) {
                const g = landlordRanchGrantOneFromLottery();
                parts.push(g.label || '?');
                const rk = '【牧场】' + (g.label || '?');
                if (!results[rk]) results[rk] = 0;
                results[rk]++;
            }
            totalPrizes += wgt;
            const pk = '随机牧场动物';
            if (!player.landlord.lottery.prizesWon[pk]) player.landlord.lottery.prizesWon[pk] = 0;
            player.landlord.lottery.prizesWon[pk]++;
            drawPrizeLabel = parts.join('、');
        } else {
            if (!results[wonPrize.name]) {
                results[wonPrize.name] = 0;
            }
            results[wonPrize.name] += wonPrize.weight;
            totalPrizes += wonPrize.weight;
            if (!player.landlord.seedStorage[wonPrize.name]) {
                player.landlord.seedStorage[wonPrize.name] = 0;
            }
            player.landlord.seedStorage[wonPrize.name] += wonPrize.weight;
            if (!player.landlord.lottery.prizesWon[wonPrize.name]) {
                player.landlord.lottery.prizesWon[wonPrize.name] = 0;
            }
            player.landlord.lottery.prizesWon[wonPrize.name] += wonPrize.weight;
        }

        player.landlord.lottery.drawHistory.unshift({
            prize: wonPrize.prizeType === 'ranchAnimal' ? ('【牧场】' + drawPrizeLabel) : wonPrize.name,
            time: new Date().toLocaleString('zh-CN'),
            timestamp: Date.now(),
            isTenDraw: true
        });
    }
    
    // 清理历史记录
    if (player.landlord.lottery.drawHistory.length > 20) {
        player.landlord.lottery.drawHistory = player.landlord.lottery.drawHistory.slice(0, 20);
    }
    
    updateLotteryDisplay();
    renderLotteryInterface();
    renderLandlordSeedStorage();
    if (typeof renderLandlordRanch === 'function') renderLandlordRanch();
    showTenLotteryAnimation(results);
    
    player.landlord.lottery.lastDrawTime = Date.now();
    saveGame();
}

// 8. 抽奖动画效果
function showLotteryAnimation(prize) {
    const animationContainer = document.createElement('div');
    animationContainer.style.position = 'fixed';
    animationContainer.style.top = '50%';
    animationContainer.style.left = '50%';
    animationContainer.style.transform = 'translate(-50%, -50%)';
    animationContainer.style.zIndex = '1000';
    animationContainer.style.pointerEvents = 'none';
    
    const isRanch = prize.prizeType === 'ranchAnimal';
    const prizeColor = isRanch ? '#43a047' : (seedProperties[prize.name] ? seedProperties[prize.name].color : '#3498db');
    const midLine = isRanch
        ? (prize.name + '<div style="font-size:0.75em;margin-top:8px;font-weight:normal;opacity:0.95">已进入牧场动物库存，放养时使用</div>')
        : (prize.name + '种子 ×' + prize.weight);
    const probLine = prize.actualProbability != null && prize.actualProbability !== '' ? ('概率: ' + prize.actualProbability + '%') : '';

    animationContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, ${prizeColor}, #2ecc71); 
                    color: white; padding: 30px; border-radius: 15px; 
                    text-align: center; animation: lotteryWin 1s ease-out;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3); min-width: 200px;">
            <div style="font-size: 3em; margin-bottom: 10px;">🎉</div>
            <div style="font-weight: bold; font-size: 1.5em; margin-bottom: 10px;">抽奖成功！</div>
            <div style="font-size: 1.2em; margin-bottom: 15px;">获得奖品：</div>
            <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; font-size: 1.3em; font-weight: bold;">
                ${midLine}
            </div>
            <div style="margin-top: 15px; font-size: 0.9em; opacity: 0.9;">
                ${probLine}
            </div>
        </div>
    `;
    
    document.body.appendChild(animationContainer);
    
    setTimeout(() => {
        document.body.removeChild(animationContainer);
    }, 2000);
}

// 9. 十连抽动画效果
function showTenLotteryAnimation(results) {
    const animationContainer = document.createElement('div');
    animationContainer.style.position = 'fixed';
    animationContainer.style.top = '50%';
    animationContainer.style.left = '50%';
    animationContainer.style.transform = 'translate(-50%, -50%)';
    animationContainer.style.zIndex = '1000';
    animationContainer.style.pointerEvents = 'none';
    
    let resultsHTML = '';
    for (const prizeName in results) {
        const count = results[prizeName];
        const prizeColor = prizeName.indexOf('【牧场】') === 0 ? '#43a047' : (seedProperties[prizeName] ? seedProperties[prizeName].color : '#3498db');
        resultsHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; 
                        padding: 8px; background: rgba(255,255,255,0.1); 
                        border-radius: 5px; margin: 5px 0;">
                <span>${prizeName}</span>
                <span style="font-weight: bold;">×${count}</span>
            </div>
        `;
    }
    
    animationContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, #9b59b6, #e74c3c); 
                    color: white; padding: 25px; border-radius: 15px; 
                    text-align: center; animation: lotteryWin 1.5s ease-out;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.4); max-width: 300px;">
            <div style="font-size: 3em; margin-bottom: 10px;">🎊</div>
            <div style="font-weight: bold; font-size: 1.5em; margin-bottom: 15px;">十连抽奖励！</div>
            <div style="max-height: 200px; overflow-y: auto; margin-bottom: 15px;">
                ${resultsHTML}
            </div>
            <div style="font-size: 0.9em; opacity: 0.9;">
                共计获得 ${Object.keys(results).length} 种奖品
            </div>
        </div>
    `;
    
    document.body.appendChild(animationContainer);
    
    setTimeout(() => {
        document.body.removeChild(animationContainer);
    }, 3000);
}

// 10. 渲染抽奖界面
function renderLotteryInterface() {
    const lotteryContainer = document.getElementById('landlordLotteryContainer');
    if (!lotteryContainer) {
        console.error('抽奖容器未找到！');
        return;
    }
    
    const drawCount = player.landlord.lottery.drawCount || 0;
    const canDrawSingle = drawCount >= lotterySystem.costPerDraw;
    const canDrawTen = drawCount >= lotterySystem.costPerDraw * 10;
    
    lotteryContainer.innerHTML = `
        <div class="lottery-header" style="background: linear-gradient(135deg, #ff6b6b, #feca57); 
                 color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 1.5em;">🎯 果实抽奖系统</h3>
            <div style="font-size: 0.9em; opacity: 0.9;">
                出售带有【银、金、水晶、流光】词条的果实可获得抽奖机会；约10%「随机牧场动物」：种类按<strong>稀有度加权</strong>、品质1～8档<strong>独立加权</strong>（高品更难）。
            </div>
        </div>
        
        <div class="lottery-stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
            <div style="background: #34495e; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.8em; font-weight: bold; color: #feca57;">${drawCount}</div>
                <div style="font-size: 0.8em;">当前抽奖次数</div>
            </div>
            <div style="background: #2c3e50; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.8em; font-weight: bold; color: #1abc9c;">${player.landlord.lottery.totalDraws || 0}</div>
                <div style="font-size: 0.8em;">总抽奖次数</div>
            </div>
            <div style="background: #16a085; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.8em; font-weight: bold; color: #fff;">${Object.keys(player.landlord.lottery.prizesWon || {}).length}</div>
                <div style="font-size: 0.8em;">获得奖品种类</div>
            </div>
        </div>
        
        <div class="lottery-actions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <button onclick="drawLottery()" ${canDrawSingle ? '' : 'disabled'} 
                    class="lottery-button single-draw"
                    style="background: ${canDrawSingle ? '#e74c3c' : '#95a5a6'}; 
                           color: white; border: none; padding: 15px; border-radius: 8px; 
                           font-size: 1.1em; font-weight: bold; cursor: pointer; 
                           transition: all 0.3s;">
                <div>🎲 单次抽奖</div>
                <div style="font-size: 0.8em; opacity: 0.9;">消耗${lotterySystem.costPerDraw}次</div>
            </button>
            
            <button onclick="drawTenLottery()" ${canDrawTen ? '' : 'disabled'} 
                    class="lottery-button ten-draw"
                    style="background: ${canDrawTen ? '#9b59b6' : '#95a5a6'}; 
                           color: white; border: none; padding: 15px; border-radius: 8px; 
                           font-size: 1.1em; font-weight: bold; cursor: pointer;
                           transition: all 0.3s;">
                <div>🎊 十连抽</div>
                <div style="font-size: 0.8em; opacity: 0.9;">消耗${lotterySystem.costPerDraw * 10}次</div>
            </button>
        </div>
        
        <div class="prize-pool" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 15px 0; color: #2c3e50;">🎁 奖品池概率</h4>
            <div class="prize-list">
                ${lotterySystem.prizePool.map(prize => `
                    <div style="display: flex; justify-content: space-between; align-items: center; 
                                padding: 8px 0; border-bottom: 1px solid #eee;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 20px; height: 20px; border-radius: 50%; 
                                      background: ${prize.prizeType === 'ranchAnimal' ? '#66bb6a' : (seedProperties[prize.name]?.color || '#3498db')};"></div>
                            <span style="font-weight: bold;">${prize.name}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #7f8c8d; font-size: 0.9em;">${prize.probability}%</span>
                            <span style="font-weight: bold; color: #e74c3c;">${prize.actualProbability}%</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="draw-history" style="background: #ecf0f1; padding: 15px; border-radius: 10px;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">📜 最近抽奖记录</h4>
            <div style="max-height: 150px; overflow-y: auto;">
                ${player.landlord.lottery.drawHistory && player.landlord.lottery.drawHistory.length > 0 ? 
                    player.landlord.lottery.drawHistory.slice(0, 5).map(record => `
                        <div style="display: flex; justify-content: space-between; align-items: center; 
                                    padding: 5px 0; font-size: 0.9em; border-bottom: 1px solid #ddd;">
                            <span style="font-weight: bold;">${record.prize}</span>
                            <span style="color: #7f8c8d; font-size: 0.8em;">${record.time}</span>
                        </div>
                    `).join('') : 
                    '<div style="text-align: center; color: #7f8c8d; padding: 20px;">暂无抽奖记录</div>'
                }
            </div>
        </div>
        
        <div style="background: #e8f6f3; padding: 15px; border-radius: 10px; margin-top: 20px; border-left: 4px solid #1abc9c;">
            <h4 style="margin: 0 0 10px 0; color: #16a085;">💡 如何获得抽奖次数</h4>
            <div style="font-size: 0.9em; color: #27ae60;">
                <div>• 出售带有【银、金、水晶、流光】词条的果实</div>
                <div>• 每个符合条件的果实可获得1次抽奖机会</div>
                <div>• 在果实仓库查看可获抽奖次数的果实</div>
                <div>• 抽到「随机牧场动物」：先加权抽<strong>动物种类</strong>（越稀有越低），再独立加权抽<strong>8档品质</strong>，进入牧场库存（键：动物:品质）</div>
            </div>
        </div>
    `;
}

// 11. 更新抽奖显示
function updateLotteryDisplay() {
    const drawCountElement = document.getElementById('lotteryDrawCount');
    if (drawCountElement) {
        drawCountElement.textContent = player.landlord.lottery.drawCount || 0;
    }
}

function isFruitEligibleForLottery(fruit) {
    if (!fruit || !fruit.mutations) return false;
    
    // 检查是否有符合条件的词条
    for (const mutation of lotterySystem.eligibleMutations) {
        if (fruit.mutations.includes(mutation)) {
            return true;
        }
    }
    
    return false;
}

        // 添加一键卖出按钮到界面
        function addSellAllButton() {
            const storageTab = document.getElementById('landlordStorageTab');
            if (storageTab && !storageTab.querySelector('.sell-all-button')) {
                const sellAllButton = document.createElement('button');
                sellAllButton.className = 'landlord-unlock-button';
                sellAllButton.style.marginBottom = '20px';
                sellAllButton.textContent = '一键卖出所有果实';
                sellAllButton.onclick = sellAllLandlordFruits;
                sellAllButton.classList.add('sell-all-button');
                
                const storageContainer = storageTab.querySelector('.landlord-storage-container');
                if (storageContainer) {
                    storageContainer.parentNode.insertBefore(sellAllButton, storageContainer);
                }
            }
        }

        // 在渲染仓库时调用添加按钮函数
        const originalRenderLandlordFruitStorage = renderLandlordFruitStorage;
        renderLandlordFruitStorage = function() {
            originalRenderLandlordFruitStorage();
            addSellAllButton();
        };

        console.log("疯狂地主游戏已成功加载！");
   // 无尽挖矿配置
        const miningGemsConfig = [
        { name: '红宝石', key: 'ruby', rarity: 0.4, minDepth: 0, color: '#ff6b6b' },
        { name: '蓝宝石', key: 'sapphire', rarity: 0.3, minDepth: 10000, color: '#48cae4' },
        { name: '翡翠', key: 'emerald', rarity: 0.2, minDepth: 100000, color: '#52b788' },
        { name: '紫水晶', key: 'amethyst', rarity: 0.08, minDepth: 1000000, color: '#7b2cbf' },
        { name: '钻石', key: 'diamond', rarity: 0.02, minDepth: 10000000, color: '#caf0f8' },
        { name: '秘奥晶', key: 'mysteryGem', rarity: 0.008, minDepth: 50000000, color: '#b388ff' },
        { name: '悟道玉', key: 'cultivationGem', rarity: 0.004, minDepth: 100000000, color: '#80cbc4' }
    ];

         // 切换分页函数
        function switchMiningTab(tabName) {
            // 更新标签样式
            document.querySelectorAll('.mining-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelector(`.mining-tab[onclick="switchMiningTab('${tabName}')"]`).classList.add('active');
            
            // 更新页面显示
            document.querySelectorAll('.mining-gems-page, .mining-upgrades-page, .mining-challenge-page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(`mining${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Page`).classList.add('active');
        }

        function ensureMiningEngagementState() {
            if (!player.mining.engagement || typeof player.mining.engagement !== 'object') {
                player.mining.engagement = {};
            }
            const e = player.mining.engagement;
            e.heat = Math.max(0, Math.min(100, Math.floor(Number(e.heat) || 0)));
            e.focus = Math.max(0, Math.min(100, Math.floor(Number(e.focus) || 0)));
            e.surveyCooldown = Math.max(0, Math.floor(Number(e.surveyCooldown) || 0));
            e.surveyStacks = Math.max(0, Math.floor(Number(e.surveyStacks) || 0));
            e.surveyBonus = Math.max(1, Number(e.surveyBonus) || 1);
            e.contractSeed = Math.max(1, Math.floor(Number(e.contractSeed) || 1));
            e.eventCooldown = Math.max(0, Math.floor(Number(e.eventCooldown) || 0));
            if (!e.pendingEvent || typeof e.pendingEvent !== 'object') e.pendingEvent = null;
            if (!e.eventStats || typeof e.eventStats !== 'object') e.eventStats = { triggered: 0, safe: 0, risk: 0 };
            e.riskMeter = Math.max(0, Math.min(100, Math.floor(Number(e.riskMeter) || 0)));
            e.scanCharge = Math.max(0, Math.min(100, Math.floor(Number(e.scanCharge) || 0)));
            e.scanStacks = Math.max(0, Math.floor(Number(e.scanStacks) || 0));
            e.scanBonus = Math.max(1, Number(e.scanBonus) || 1);
            e.stabilizeCooldown = Math.max(0, Math.floor(Number(e.stabilizeCooldown) || 0));
            e.faction = ['conservative', 'blaster', 'scout'].includes(e.faction) ? e.faction : 'conservative';
            if (!e.factionXP || typeof e.factionXP !== 'object') e.factionXP = { conservative: 0, blaster: 0, scout: 0 };
            e.factionXP.conservative = Math.max(0, Math.floor(Number(e.factionXP.conservative) || 0));
            e.factionXP.blaster = Math.max(0, Math.floor(Number(e.factionXP.blaster) || 0));
            e.factionXP.scout = Math.max(0, Math.floor(Number(e.factionXP.scout) || 0));
            e.drillDurability = Math.max(0, Math.min(100, Math.floor(Number(e.drillDurability) || 100)));
            e.overdriveTicks = Math.max(0, Math.floor(Number(e.overdriveTicks) || 0));
            e.luckyVeinTicks = Math.max(0, Math.floor(Number(e.luckyVeinTicks) || 0));
            e.relicShards = Math.max(0, Math.floor(Number(e.relicShards) || 0));
            e.relicBlessTicks = Math.max(0, Math.floor(Number(e.relicBlessTicks) || 0));
            e.cartOre = Math.max(0, Math.floor(Number(e.cartOre) || 0));
            e.cartCooldown = Math.max(0, Math.floor(Number(e.cartCooldown) || 0));
            e.cavePressure = Math.max(0, Math.min(100, Math.floor(Number(e.cavePressure) || 0)));
            e.merchantCooldown = Math.max(0, Math.floor(Number(e.merchantCooldown) || 0));
            e.merchantOfferCost = Math.max(0, Math.floor(Number(e.merchantOfferCost) || 0));
            e.merchantOfferReward = Math.max(0, Math.floor(Number(e.merchantOfferReward) || 0));
            e.merchantOfferType = ['ore', 'gem', 'heat', 'fragment'].includes(e.merchantOfferType) ? e.merchantOfferType : '';
            e.beaconCharge = Math.max(0, Math.min(100, Math.floor(Number(e.beaconCharge) || 0)));
            e.bountyTarget = Math.max(50, Math.floor(Number(e.bountyTarget) || 120));
            e.bountyProgress = Math.max(0, Math.min(e.bountyTarget, Math.floor(Number(e.bountyProgress) || 0)));
            e.bountyRewardOre = Math.max(1000, Math.floor(Number(e.bountyRewardOre) || 5000));
            e.bountyClaimed = !!e.bountyClaimed;
            if (e.bountyProgress >= e.bountyTarget) e.bountyClaimed = !!e.bountyClaimed;
            if (!e.qte || typeof e.qte !== 'object') e.qte = null;
            if (e.qte) {
                e.qte.active = !!e.qte.active;
                e.qte.timeLeft = Math.max(0, Math.floor(Number(e.qte.timeLeft) || 0));
                e.qte.hits = Math.max(0, Math.floor(Number(e.qte.hits) || 0));
                e.qte.required = Math.max(1, Math.floor(Number(e.qte.required) || 10));
                e.qte.rewardOre = Math.max(1000, Math.floor(Number(e.qte.rewardOre) || 3000));
                e.qte.failPenalty = Math.max(0, Math.floor(Number(e.qte.failPenalty) || 1000));
                if (!e.qte.active && e.qte.timeLeft <= 0) e.qte = null;
            }
            if (!e.riftPuzzle || typeof e.riftPuzzle !== 'object') e.riftPuzzle = null;
            if (e.riftPuzzle) {
                e.riftPuzzle.active = !!e.riftPuzzle.active;
                e.riftPuzzle.timeLeft = Math.max(0, Math.floor(Number(e.riftPuzzle.timeLeft) || 0));
                e.riftPuzzle.answer = String(e.riftPuzzle.answer || '').replace(/\D/g, '').slice(0, 3);
                if (!Array.isArray(e.riftPuzzle.clues)) e.riftPuzzle.clues = [];
                e.riftPuzzle.rewardOre = Math.max(500, Math.floor(Number(e.riftPuzzle.rewardOre) || 2000));
                e.riftPuzzle.failPenalty = Math.max(0, Math.floor(Number(e.riftPuzzle.failPenalty) || 500));
                e.riftPuzzle.rewardFragments = !!e.riftPuzzle.rewardFragments;
                if (e.riftPuzzle.active && e.riftPuzzle.answer.length !== 3) e.riftPuzzle = null;
                else if (!e.riftPuzzle.active) e.riftPuzzle = null;
            }
            if (!e.contract || typeof e.contract !== 'object') {
                e.contract = {};
            }
            if (!Number.isFinite(Number(e.contract.target)) || Number(e.contract.target) <= 0) {
                e.contract = { target: 140, progress: 0, rewardOre: 1800, rewardGemRoll: 1, done: false, claimed: false };
            } else {
                e.contract.target = Math.max(50, Math.floor(Number(e.contract.target)));
                e.contract.progress = Math.max(0, Math.min(e.contract.target, Math.floor(Number(e.contract.progress) || 0)));
                e.contract.rewardOre = Math.max(1000, Math.floor(Number(e.contract.rewardOre) || 1000));
                e.contract.rewardGemRoll = Math.max(0, Math.floor(Number(e.contract.rewardGemRoll) || 0));
                e.contract.done = !!e.contract.done;
                e.contract.claimed = !!e.contract.claimed;
            }
        }

        function getMiningFactionLevel(factionKey) {
            ensureMiningEngagementState();
            const xp = Number(player.mining.engagement.factionXP[factionKey] || 0);
            return Math.min(20, 1 + Math.floor(xp / 120));
        }

        function getMiningFactionModifiers() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            const faction = e.faction || 'conservative';
            const lv = getMiningFactionLevel(faction);
            const base = {
                faction,
                level: lv,
                oreMul: 1,
                riskGrowthMul: 1,
                scanChargeMul: 1,
                heatGainMul: 1,
                gemChanceBonus: 0,
                eventSpawnMul: 1,
                safeOreMul: 1,
                riskOreMul: 1,
                stabilizeMul: 1
            };
            if (faction === 'conservative') {
                base.riskGrowthMul = Math.max(0.45, 1 - lv * 0.03);
                base.safeOreMul = 1 + lv * 0.03;
                base.stabilizeMul = 1 + lv * 0.05;
            } else if (faction === 'blaster') {
                base.oreMul = 1 + lv * 0.035;
                base.riskGrowthMul = 1 + lv * 0.02;
                base.heatGainMul = 1 + lv * 0.04;
                base.riskOreMul = 1 + lv * 0.04;
            } else if (faction === 'scout') {
                base.scanChargeMul = 1 + lv * 0.045;
                base.gemChanceBonus = lv * 0.0025;
                base.eventSpawnMul = 1 + lv * 0.025;
                base.safeOreMul = 1 + lv * 0.015;
            }
            return base;
        }

        function gainMiningFactionXP(actionType, amount) {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            const faction = e.faction || 'conservative';
            let gain = Math.max(1, Math.floor(Number(amount) || 1));
            if (actionType === 'risk' && faction === 'blaster') gain = Math.floor(gain * 1.3);
            if (actionType === 'safe' && faction === 'conservative') gain = Math.floor(gain * 1.25);
            if ((actionType === 'scan' || actionType === 'gem') && faction === 'scout') gain = Math.floor(gain * 1.3);
            e.factionXP[faction] = Math.min(999999, (e.factionXP[faction] || 0) + gain);
        }

        function chooseMiningFaction(factionKey) {
            ensureMiningEngagementState();
            if (!['conservative', 'blaster', 'scout'].includes(factionKey)) return;
            const e = player.mining.engagement;
            if (e.faction === factionKey) {
                addMiningNotification('你已经在该派系中。', 'info');
                return;
            }
            const costGem = 1;
            const haveGem = Number(player.items && player.items.primaryGemq) || 0;
            if (haveGem < costGem) {
                addMiningNotification(`切换派系需要${costGem}个宝藏金币`, 'warning');
                return;
            }
            player.items.primaryGemq = haveGem - costGem;
            e.faction = factionKey;
            addMiningNotification(`已切换矿区派系，消耗${costGem}个宝藏金币。`, 'gem');
            updateMiningUI();
            saveGame();
        }

        function resetMiningBounty() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            e.bountyTarget = Math.max(90, 80 + Math.floor(Math.random() * 260));
            e.bountyProgress = 0;
            e.bountyRewardOre = Math.max(4000, Math.floor(player.mining.power * e.bountyTarget * (0.8 + Math.random() * 0.7)));
            e.bountyClaimed = false;
        }

        function activateMiningOverdrive() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (e.heat < 80) {
                addMiningNotification('超频需要至少80点爆破能量。', 'warning');
                return;
            }
            e.heat -= 80;
            e.overdriveTicks = 14;
            e.cavePressure = Math.min(100, e.cavePressure + 10);
            addMiningNotification('钻机超频启动！接下来14次挖掘矿石收益大幅提升。', 'gem');
            updateMiningUI();
            saveGame();
        }

        function repairMiningDrill() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            const need = 100 - e.drillDurability;
            if (need <= 0) {
                addMiningNotification('钻头耐久已满，无需维修。', 'info');
                return;
            }
            const cost = Math.max(1500, need * Math.max(30, Math.floor(player.mining.power * 0.8)));
            if (player.mining.ore < cost) {
                addMiningNotification(`维修耐久需要${formatMiningCost(cost)}矿石。`, 'warning');
                return;
            }
            player.mining.ore -= cost;
            e.drillDurability = 100;
            e.cavePressure = Math.max(0, e.cavePressure - 12);
            addMiningNotification(`钻头维修完成，消耗${formatMiningCost(cost)}矿石。`, 'gem');
            gainMiningFactionXP('safe', 4);
            updateMiningUI();
            saveGame();
        }

        function dispatchMiningCart() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (e.cartCooldown > 0) {
                addMiningNotification(`矿车调度冷却中，还需 ${e.cartCooldown} 次挖掘。`, 'warning');
                return;
            }
            if (e.cartOre < 5000) {
                addMiningNotification('矿车载货不足，至少需要5000矿石。', 'warning');
                return;
            }
            const reward = Math.floor(e.cartOre * (1.1 + Math.random() * 0.45));
            player.mining.ore += reward;
            e.cartOre = 0;
            e.cartCooldown = 45;
            addMiningNotification(`矿车顺利返仓！额外带回${formatMiningCost(reward)}矿石。`, 'gem');
            gainMiningFactionXP('safe', 3);
            updateMiningUI();
            saveGame();
        }

        function buyMiningMerchantOffer() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (!e.merchantOfferType || e.merchantOfferCost <= 0) {
                addMiningNotification('当前没有可购买的商人货单。', 'info');
                return;
            }
            if (player.mining.ore < e.merchantOfferCost) {
                addMiningNotification(`矿石不足，商人报价为${formatMiningCost(e.merchantOfferCost)}。`, 'warning');
                return;
            }
            player.mining.ore -= e.merchantOfferCost;
            if (e.merchantOfferType === 'ore') {
                player.mining.ore += e.merchantOfferReward;
                addMiningNotification(`商人情报成真！返还矿石${formatMiningCost(e.merchantOfferReward)}。`, 'gem');
            } else if (e.merchantOfferType === 'gem') {
                const hit = !!findGem(player.mining.depth, player.mining.upgrades.detector + 6, false);
                addMiningNotification(`商人藏宝图已解读${hit ? '，获得额外宝石！' : '，但本次未出宝石。'}`, hit ? 'gem' : 'info');
            } else if (e.merchantOfferType === 'heat') {
                e.heat = Math.min(100, e.heat + e.merchantOfferReward);
                addMiningNotification(`商人提供燃料，爆破能量+${e.merchantOfferReward}。`, 'gem');
            } else if (e.merchantOfferType === 'fragment') {
                player.mining.chestFragments = Math.min(999999, (player.mining.chestFragments || 0) + e.merchantOfferReward);
                addMiningNotification(`商人提供矿脉图纸，碎片+${e.merchantOfferReward}。`, 'gem');
            }
            e.merchantOfferType = '';
            e.merchantOfferCost = 0;
            e.merchantOfferReward = 0;
            e.merchantCooldown = 70;
            gainMiningFactionXP('scan', 4);
            updateMiningUI();
            saveGame();
        }

        function claimMiningBounty() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (e.bountyProgress < e.bountyTarget || e.bountyClaimed) {
                addMiningNotification('悬赏尚未完成，继续采掘吧。', 'warning');
                return;
            }
            e.bountyClaimed = true;
            player.mining.ore += e.bountyRewardOre;
            if (Math.random() < 0.35) findGem(player.mining.depth, player.mining.upgrades.detector + 5, false);
            addMiningNotification(`已领取矿区悬赏：+${formatMiningCost(e.bountyRewardOre)}矿石。`, 'gem');
            gainMiningFactionXP('risk', 5);
            resetMiningBounty();
            updateMiningUI();
            saveGame();
        }

        function spawnMiningQTE(isOffline = false) {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (e.qte && e.qte.active) return;
            if (e.riftPuzzle && e.riftPuzzle.active) return;
            const req = 8 + Math.floor(Math.random() * 8);
            e.qte = {
                active: true,
                timeLeft: 14,
                hits: 0,
                required: req,
                rewardOre: Math.max(5000, Math.floor(player.mining.power * (90 + Math.random() * 110))),
                failPenalty: Math.max(1500, Math.floor(player.mining.power * (30 + Math.random() * 45)))
            };
            if (!isOffline) {
                addMiningNotification(`矿难预警！在倒计时内完成 ${req} 次紧急支撑。`, 'warning');
            }
        }

        function miningQTEResolve(success, isOffline = false, summary = null, failByTimeout = false) {
            const e = player.mining.engagement;
            if (!e.qte) return;
            if (success) {
                player.mining.ore += e.qte.rewardOre;
                e.cavePressure = Math.max(0, e.cavePressure - 25);
                e.relicShards += 1;
                if (summary) summary.qteWin = (summary.qteWin || 0) + 1;
                if (!isOffline) addMiningNotification(`成功稳住矿难！奖励${formatMiningCost(e.qte.rewardOre)}矿石，遗迹碎片+1。`, 'gem');
                gainMiningFactionXP('safe', 10);
            } else {
                player.mining.stamina = Math.max(0, player.mining.stamina - 12);
                e.riskMeter = Math.min(100, e.riskMeter + 18);
                if (summary) summary.qteFail = (summary.qteFail || 0) + 1;
                if (!isOffline) {
                    if (failByTimeout) addMiningNotification('矿难超时未处理，本次不扣矿石，体力-12。', 'warning');
                    else addMiningNotification('矿难失控！本次不扣矿石，体力-12。', 'warning');
                }
            }
            e.qte = null;
        }

        function miningQTEHit() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (!e.qte || !e.qte.active) {
                addMiningNotification('当前没有进行中的矿难QTE。', 'info');
                return;
            }
            e.qte.hits += 1;
            if (e.qte.hits >= e.qte.required) {
                miningQTEResolve(true, false, null);
            }
            updateMiningUI();
            saveGame();
        }

        function processMiningQTEProgress(isOffline = false, summary = null) {
            const e = player.mining.engagement;
            if (!e.qte || !e.qte.active) return;
            e.qte.timeLeft -= 1;
            if (e.qte.hits >= e.qte.required) {
                miningQTEResolve(true, isOffline, summary);
                return;
            }
            if (e.qte.timeLeft <= 0) {
                miningQTEResolve(false, isOffline, summary, true);
            }
        }

        function spawnMiningRiftPuzzle(isOffline = false) {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (e.riftPuzzle && e.riftPuzzle.active) return;
            if (e.qte && e.qte.active) return;
            if (e.pendingEvent) return;
            const depthSnap = Math.floor(Number(player.mining.depth) || 0);
            const pickSnap = Math.floor(Number(player.mining.upgrades.power) || 0);
            const detSnap = Math.floor(Number(player.mining.upgrades.detector) || 0);
            const tens = Math.floor(depthSnap / 10) % 10;
            const d1 = depthSnap % 10;
            const d2 = pickSnap % 10;
            const d3 = (tens + detSnap) % 10;
            const answer = `${d1}${d2}${d3}`;
            const clues = [
                `第一位：刻印形成时矿道深 ${depthSnap} 米，取其个位数`,
                `第二位：当时镐头等级 ${pickSnap} 的个位数`,
                `第三位：（深度十位 ${tens} + 探测器等级 ${detSnap}）之和的个位数`
            ];
            const miningPowerLv = Math.max(1, Math.floor(Number(player.mining.upgrades && player.mining.upgrades.power) || 1));
            const powerBonusMul = 1 + Math.min(999, (miningPowerLv - 1) * (999 / 9999));
            e.riftPuzzle = {
                active: true,
                timeLeft: 20,
                answer,
                clues,
                rewardOre: Math.max(1200, Math.floor(player.mining.power * (28 + Math.random() * 38) * powerBonusMul)),
                failPenalty: Math.max(900, Math.floor(player.mining.power * (22 + Math.random() * 40))),
                rewardFragments: Math.random() < 0.45 ? 1 : 0
            };
            if (!isOffline) {
                addMiningNotification('虚空裂隙渗出符文锁链！根据刻印算出三位裂隙密码。', 'warning');
            }
        }

        function miningRiftPuzzleResolve(success, isOffline = false, summary = null, failByTimeout = false) {
            const e = player.mining.engagement;
            if (!e.riftPuzzle) return;
            const rp = e.riftPuzzle;
            if (success) {
                player.mining.ore += rp.rewardOre;
                e.cavePressure = Math.max(0, e.cavePressure - 18);
                e.beaconCharge = Math.min(100, e.beaconCharge + 35);
                if (rp.rewardFragments) {
                    player.mining.chestFragments = Math.min(999999, (player.mining.chestFragments || 0) + 1);
                }
                if (Math.random() < 0.28) {
                    findGem(player.mining.depth, player.mining.upgrades.detector + 2, isOffline);
                }
                if (summary) summary.riftWin = (summary.riftWin || 0) + 1;
                if (!isOffline) {
                    addMiningNotification(
                        `裂隙密码正确！获得${formatMiningCost(rp.rewardOre)}矿石，洞压下降，信标充能+35${rp.rewardFragments ? '，矿脉碎片+1' : ''}。`,
                        'gem'
                    );
                }
                gainMiningFactionXP('scan', 8);
            } else {
                e.cavePressure = Math.min(100, e.cavePressure + 10);
                e.riskMeter = Math.min(100, e.riskMeter + 8);
                if (summary) summary.riftFail = (summary.riftFail || 0) + 1;
                if (!isOffline) {
                    if (failByTimeout) addMiningNotification('裂隙超时关闭，本次不扣矿石，洞压与风险上升。', 'warning');
                    else addMiningNotification('符文反噬！本次不扣矿石，洞压与风险上升。', 'warning');
                }
                gainMiningFactionXP('risk', 3);
            }
            e.riftPuzzle = null;
        }

        function submitMiningRiftCode() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (!e.riftPuzzle || !e.riftPuzzle.active) {
                addMiningNotification('当前没有进行中的裂隙密码谜题。', 'info');
                return;
            }
            const inp = document.getElementById('miningRiftCodeInput');
            const raw = inp ? String(inp.value || '').replace(/\D/g, '') : '';
            if (raw.length !== 3) {
                addMiningNotification('请输入恰好三位数字（0-9）。', 'warning');
                return;
            }
            if (raw === e.riftPuzzle.answer) {
                miningRiftPuzzleResolve(true, false, null);
            } else {
                e.riftPuzzle.timeLeft = Math.max(0, e.riftPuzzle.timeLeft - 3);
                addMiningNotification('密码不对，裂隙震颤！剩余回合缩短。', 'warning');
            }
            updateMiningUI();
            saveGame();
        }

        function processMiningRiftPuzzleProgress(isOffline = false, summary = null) {
            const e = player.mining.engagement;
            if (!e.riftPuzzle || !e.riftPuzzle.active) return;
            e.riftPuzzle.timeLeft -= 1;
            if (e.riftPuzzle.timeLeft <= 0) {
                miningRiftPuzzleResolve(false, isOffline, summary, true);
            }
        }

        function generateMiningContract(force) {
            if (!player || !player.mining) return;
            if (!player.mining.engagement || typeof player.mining.engagement !== 'object') player.mining.engagement = {};
            if (!player.mining.engagement.contract || typeof player.mining.engagement.contract !== 'object') {
                player.mining.engagement.contract = { target: 140, progress: 0, rewardOre: 1800, rewardGemRoll: 1, done: false, claimed: false };
            }
            if (!force && !player.mining.engagement.contract.claimed) return;
            const e = player.mining.engagement;
            const seed = (e.contractSeed || 1) + 1;
            e.contractSeed = seed;
            const base = 100 + Math.floor(seed * 3.5);
            const target = Math.max(120, base + Math.floor(Math.random() * 220));
            const miningPowerLv = Math.max(1, Math.floor(Number(player.mining.upgrades && player.mining.upgrades.power) || 1));
            const powerBonusMul = 1 + Math.min(999, (miningPowerLv - 1) * (999 / 9999));
            const rewardOre = Math.max(1000, Math.floor(player.mining.power * target * (0.55 + Math.random() * 0.40) * powerBonusMul));
            const rewardGemRoll = Math.random() < 0.55 ? 1 : 0;
            e.contract = { target, progress: 0, rewardOre, rewardGemRoll, done: false, claimed: false };
        }

        function maybeSpawnMiningChoiceEvent(isOffline = false, summary = null) {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (e.pendingEvent) return;
            if (e.eventCooldown > 0) {
                e.eventCooldown -= 1;
                return;
            }
            const fm = getMiningFactionModifiers();
            const triggerChance = 0.012 * fm.eventSpawnMul;
            if (Math.random() >= triggerChance) return;
            const pool = [
                {
                    id: 'gasPocket',
                    title: '瓦斯囊暴露',
                    desc: '前方矿道出现瓦斯囊，是否冒险继续爆破？',
                    safe: { oreMul: 0.95, gemBonus: 0, staminaDelta: 0, msg: '你稳住节奏，安全通过瓦斯区。' },
                    risk: { oreMul: 1.75, gemBonus: 2, staminaDelta: -8, msg: '你强行爆破成功，但体力消耗明显。' }
                },
                {
                    id: 'ancientGear',
                    title: '古代矿机残骸',
                    desc: '发现古代矿机核心，你要拆解回收还是尝试强启？',
                    safe: { oreMul: 1.15, gemBonus: 0, staminaDelta: 4, msg: '你回收了稳定配件，体力略有恢复。' },
                    risk: { oreMul: 1.45, gemBonus: 1, staminaDelta: -4, msg: '矿机短暂运转，产出提升但设备震荡。' }
                },
                {
                    id: 'deepEcho',
                    title: '深渊回声矿层',
                    desc: '矿层传来回声，是否追逐回声进入未知裂缝？',
                    safe: { oreMul: 1.0, gemBonus: 1, staminaDelta: 0, msg: '你沿安全路线推进，额外发现一条晶线。' },
                    risk: { oreMul: 1.95, gemBonus: 3, staminaDelta: -12, msg: '你闯入裂缝核心，收获巨大但极其耗体。' }
                }
            ];
            e.pendingEvent = pool[Math.floor(Math.random() * pool.length)];
            e.eventStats.triggered = (e.eventStats.triggered || 0) + 1;
            if (summary) summary.pendingEvents = (summary.pendingEvents || 0) + 1;
            if (!isOffline) {
                addMiningNotification(`突发事件：${e.pendingEvent.title}，请在操作台做出抉择。`, 'warning');
            }
        }

        function applyMiningChoiceOutcome(eventObj, choice, isOffline = false, summary = null) {
            if (!eventObj) return;
            const e = player.mining.engagement;
            const out = choice === 'risk' ? eventObj.risk : eventObj.safe;
            const fm = getMiningFactionModifiers();
            const stanceMul = choice === 'risk' ? fm.riskOreMul : fm.safeOreMul;
            const bonusOre = Math.max(1, Math.floor(player.mining.power * (20 + Math.random() * 40) * Math.max(0.5, out.oreMul) * stanceMul));
            player.mining.ore += bonusOre;
            const staminaDelta = Number(out.staminaDelta) || 0;
            player.mining.stamina = Math.max(0, Math.min(getMiningMaxStamina(), player.mining.stamina + staminaDelta));
            let gemHit = 0;
            for (let i = 0; i < (out.gemBonus || 0); i++) {
                if (findGem(player.mining.depth, player.mining.upgrades.detector + 2, isOffline)) gemHit++;
            }
            if (summary) {
                summary.choiceOre = (summary.choiceOre || 0) + bonusOre;
                summary.choiceGem = (summary.choiceGem || 0) + gemHit;
            }
            if (!isOffline) {
                addMiningNotification(`${out.msg} 额外获得${formatMiningCost(bonusOre)}矿石${gemHit > 0 ? `，宝石+${gemHit}` : ''}`, choice === 'risk' ? 'warning' : 'gem');
            }
            e.eventStats[choice] = (e.eventStats[choice] || 0) + 1;
            gainMiningFactionXP(choice === 'risk' ? 'risk' : 'safe', 6);
            e.pendingEvent = null;
            e.eventCooldown = 55;
        }

        function resolveMiningChoiceEvent(choice) {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (!e.pendingEvent) {
                addMiningNotification('当前没有待处理的突发事件。', 'info');
                return;
            }
            applyMiningChoiceOutcome(e.pendingEvent, choice === 'risk' ? 'risk' : 'safe', false, null);
            updateMiningUI();
            saveGame();
        }

        function stabilizeMiningShaft() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (e.stabilizeCooldown > 0) {
                addMiningNotification(`稳井冷却中，还需 ${e.stabilizeCooldown} 次挖掘。`, 'warning');
                return;
            }
            if (e.focus < 15) {
                addMiningNotification('专注不足（至少15）无法执行稳井。', 'warning');
                return;
            }
            e.focus -= 15;
            const fm = getMiningFactionModifiers();
            const cut = Math.min(65, Math.floor((20 + Math.floor(player.mining.upgrades.detector * 0.5)) * fm.stabilizeMul));
            e.riskMeter = Math.max(0, e.riskMeter - cut);
            e.stabilizeCooldown = 30;
            const bonusOre = Math.max(1, Math.floor(player.mining.power * (10 + Math.random() * 18)));
            player.mining.ore += bonusOre;
            addMiningNotification(`稳井完成，风险下降${cut}点，并回收${formatMiningCost(bonusOre)}矿石。`, 'gem');
            gainMiningFactionXP('safe', 5);
            updateMiningUI();
            saveGame();
        }

        function activateMiningLanternScan() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (e.scanCharge < 60) {
                addMiningNotification('矿灯充能不足（需要60）', 'warning');
                return;
            }
            e.scanCharge -= 60;
            e.scanStacks = 16;
            e.scanBonus = 1.35 + Math.min(0.35, player.mining.upgrades.detector * 0.008);
            const frag = 1 + (Math.random() < 0.4 ? 1 : 0);
            player.mining.chestFragments = Math.min(999999, (player.mining.chestFragments || 0) + frag);
            addMiningNotification(`矿灯扫描成功！接下来${e.scanStacks}次收益x${e.scanBonus.toFixed(2)}，矿脉碎片+${frag}`, 'gem');
            gainMiningFactionXP('scan', 7);
            updateMiningUI();
            saveGame();
        }

        function rollMiningRandomEvents(isOffline = false, summary = null) {
            const e = player.mining.engagement;
            // 新增事件池：统一规则（奖励矿石受挖掘力量影响 + 概率掉宝石 + 风险仅扣体力）
            const randomEventPool = [
                { id: 'sparkVein', title: '火花矿脉', oreMinMul: 7, oreMaxMul: 12, staminaMin: 1, staminaMax: 2, gemChance: 0.24, detectorBonus: 1 },
                { id: 'echoDrift', title: '回声漂移层', oreMinMul: 6, oreMaxMul: 11, staminaMin: 1, staminaMax: 3, gemChance: 0.2, detectorBonus: 1 },
                { id: 'ironNest', title: '铁巢裂缝', oreMinMul: 8, oreMaxMul: 13, staminaMin: 2, staminaMax: 3, gemChance: 0.28, detectorBonus: 2 },
                { id: 'steamPocket', title: '蒸汽囊爆发', oreMinMul: 7, oreMaxMul: 10, staminaMin: 1, staminaMax: 2, gemChance: 0.18, detectorBonus: 0 },
                { id: 'crystalRain', title: '晶雨洒落', oreMinMul: 9, oreMaxMul: 14, staminaMin: 2, staminaMax: 4, gemChance: 0.33, detectorBonus: 3 },
                { id: 'fossilChamber', title: '化石暗室', oreMinMul: 6, oreMaxMul: 12, staminaMin: 1, staminaMax: 3, gemChance: 0.22, detectorBonus: 1 },
                { id: 'obsidianTrack', title: '黑曜矿道', oreMinMul: 8, oreMaxMul: 15, staminaMin: 2, staminaMax: 4, gemChance: 0.27, detectorBonus: 2 },
                { id: 'luminousFog', title: '荧雾矿坑', oreMinMul: 7, oreMaxMul: 13, staminaMin: 1, staminaMax: 3, gemChance: 0.3, detectorBonus: 2 },
                { id: 'copperWhirlpool', title: '铜旋涡层', oreMinMul: 6, oreMaxMul: 10, staminaMin: 1, staminaMax: 2, gemChance: 0.16, detectorBonus: 0 },
                { id: 'starShard', title: '星屑坠井', oreMinMul: 10, oreMaxMul: 16, staminaMin: 2, staminaMax: 4, gemChance: 0.36, detectorBonus: 4 },
                { id: 'riftOreBelt', title: '裂带富矿', oreMinMul: 9, oreMaxMul: 15, staminaMin: 2, staminaMax: 3, gemChance: 0.29, detectorBonus: 2 },
                { id: 'thunderDust', title: '雷尘矿云', oreMinMul: 8, oreMaxMul: 14, staminaMin: 2, staminaMax: 5, gemChance: 0.31, detectorBonus: 3 }
            ];

            if (Math.random() < 0.028) {
                const ev = randomEventPool[Math.floor(Math.random() * randomEventPool.length)];
                const oreGain = Math.max(1, Math.floor(player.mining.power * (ev.oreMinMul + Math.random() * (ev.oreMaxMul - ev.oreMinMul))));
                const staminaLoss = ev.staminaMin + Math.floor(Math.random() * (ev.staminaMax - ev.staminaMin + 1));
                player.mining.ore += oreGain;
                player.mining.stamina = Math.max(0, player.mining.stamina - staminaLoss);
                if (summary) {
                    summary.randomOre = (summary.randomOre || 0) + oreGain;
                    summary.randomRisk = (summary.randomRisk || 0) + staminaLoss;
                }
                let gemHit = false;
                if (Math.random() < ev.gemChance) {
                    gemHit = !!findGem(player.mining.depth, player.mining.upgrades.detector + ev.detectorBonus, isOffline);
                }
                if (!isOffline) {
                    addMiningNotification(
                        `随机事件【${ev.title}】触发：获得${formatMiningCost(oreGain)}矿石，体力-${staminaLoss}${gemHit ? '，并发现了宝石！' : '。'}`,
                        gemHit ? 'gem' : 'warning'
                    );
                }
            }

            if (Math.random() < 0.018) {
                const extraOre = Math.max(1, Math.floor(player.mining.power * (6 + Math.random() * 8)));
                player.mining.ore += extraOre;
                if (summary) summary.randomOre = (summary.randomOre || 0) + extraOre;
                if (!isOffline) addMiningNotification(`矿壁松动！额外掉落${formatMiningCost(extraOre)}矿石。`, 'info');
            }
            if (Math.random() < 0.012) {
                player.mining.stamina = Math.max(0, player.mining.stamina - 1);
                e.focus = Math.min(100, e.focus + 4);
                if (summary) summary.randomRisk = (summary.randomRisk || 0) + 1;
                if (!isOffline) addMiningNotification('碎石飞溅，体力-1，但你变得更专注。', 'warning');
            }
            if (Math.random() < 0.009) {
                const heatGain = 12;
                e.heat = Math.min(100, e.heat + heatGain);
                if (summary) summary.randomHeat = (summary.randomHeat || 0) + heatGain;
                if (!isOffline) addMiningNotification('蒸汽脉冲涌动，爆破能量快速充能！', 'gem');
            }
            if (Math.random() < 0.006) {
                player.mining.chestFragments = Math.min(999999, (player.mining.chestFragments || 0) + 2);
                if (summary) summary.randomFragments = (summary.randomFragments || 0) + 2;
                if (!isOffline) addMiningNotification('发现古旧工具箱，矿脉碎片+2！', 'gem');
            }
        }

        function rollMiningMegaEvents(isOffline = false, summary = null) {
            const e = player.mining.engagement;
            const fm = getMiningFactionModifiers();

            if (e.luckyVeinTicks > 0) e.luckyVeinTicks -= 1;
            if (e.relicBlessTicks > 0) e.relicBlessTicks -= 1;
            if (e.cartCooldown > 0) e.cartCooldown -= 1;
            if (e.merchantCooldown > 0) e.merchantCooldown -= 1;

            if (Math.random() < 0.008) {
                e.luckyVeinTicks = 18;
                if (!isOffline) addMiningNotification('幸运矿脉显形！接下来18次挖掘收益提升。', 'gem');
            }
            if (Math.random() < 0.007) {
                e.relicShards += 1;
                if (!isOffline) addMiningNotification(`发现遗迹碎片（${e.relicShards}/8）。`, 'info');
                if (e.relicShards >= 8) {
                    e.relicShards -= 8;
                    e.relicBlessTicks = 24;
                    if (!isOffline) addMiningNotification('遗迹共鸣激活！24次挖掘宝石率上升。', 'gem');
                }
            }
            if (e.merchantCooldown <= 0 && !e.merchantOfferType && Math.random() < 0.0065) {
                const offerTypes = ['ore', 'gem', 'heat', 'fragment'];
                const type = offerTypes[Math.floor(Math.random() * offerTypes.length)];
                e.merchantOfferType = type;
                e.merchantOfferCost = Math.max(1500, Math.floor(player.mining.power * (20 + Math.random() * 50)));
                e.merchantOfferReward = type === 'ore'
                    ? Math.floor(e.merchantOfferCost * (1.35 + Math.random() * 0.7))
                    : type === 'heat'
                    ? 25 + Math.floor(Math.random() * 30)
                    : type === 'fragment'
                    ? 2 + (Math.random() < 0.4 ? 1 : 0)
                    : 1;
                if (!isOffline) addMiningNotification('黑市矿商到访：矿工玩法中枢出现限时货单。', 'warning');
            }
            if (Math.random() < 0.009) {
                const add = Math.max(1, Math.floor(player.mining.power * (4 + Math.random() * 6)));
                e.cartOre += add;
                if (summary) summary.cartOre = (summary.cartOre || 0) + add;
            }
            if (e.cavePressure >= 85 && Math.random() < 0.08) {
                player.mining.stamina = Math.max(0, player.mining.stamina - 2);
                if (!isOffline) addMiningNotification('矿层震落！本次不扣矿石，体力-2。', 'warning');
            }
            if ((!e.qte || !e.qte.active) && (!e.riftPuzzle || !e.riftPuzzle.active) && !e.pendingEvent) {
                if (e.cavePressure >= 70 && Math.random() < 0.035) {
                    spawnMiningQTE(isOffline);
                } else if (e.cavePressure >= 42 && Math.random() < 0.022) {
                    spawnMiningRiftPuzzle(isOffline);
                }
            }
            if (e.beaconCharge >= 100) {
                e.beaconCharge = 0;
                const hit1 = findGem(player.mining.depth, player.mining.upgrades.detector + 5, isOffline);
                const hit2 = findGem(player.mining.depth, player.mining.upgrades.detector + 5, isOffline);
                if (!isOffline) addMiningNotification(`矿灯脉冲扫描完成！${hit1 || hit2 ? '侦测到稀有矿讯。' : '本次未发现稀有矿。'}`, 'gem');
            }
            if (e.luckyVeinTicks > 0 && Math.random() < (0.08 * fm.eventSpawnMul)) {
                const burst = Math.floor(player.mining.power * (6 + Math.random() * 11));
                player.mining.ore += burst;
                if (summary) summary.luckyOre = (summary.luckyOre || 0) + burst;
            }
            if (e.relicBlessTicks > 0 && Math.random() < 0.14) {
                findGem(player.mining.depth, player.mining.upgrades.detector + 3, isOffline);
            }
        }

        function claimMiningContract() {
            ensureMiningEngagementState();
            const c = player.mining.engagement.contract;
            if (!c || !c.done || c.claimed) {
                addMiningNotification('当前委托尚未完成，继续手动参与挖矿吧！', 'warning');
                return;
            }
            c.claimed = true;
            player.mining.ore += c.rewardOre;
            let gemMsg = '';
            if (c.rewardGemRoll > 0) {
                const got = !!findGem(player.mining.depth, player.mining.upgrades.detector + 4, false);
                gemMsg = got ? '，并触发了额外宝石奖励' : '，宝石奖励判定未命中';
            }
            addMiningNotification(`领取矿工委托奖励：+${formatMiningCost(c.rewardOre)}矿石${gemMsg}`, 'gem');
            generateMiningContract(true);
            updateMiningUI();
            saveGame();
        }

        function rerollMiningContract() {
            ensureMiningEngagementState();
            const cost = Math.max(5000, Math.floor(player.mining.power * 80));
            if (player.mining.ore < cost) {
                addMiningNotification(`重置委托需要${formatMiningCost(cost)}矿石`, 'warning');
                return;
            }
            player.mining.ore -= cost;
            generateMiningContract(true);
            addMiningNotification(`已重置委托，消耗${formatMiningCost(cost)}矿石`, 'info');
            updateMiningUI();
            saveGame();
        }

        function useMiningActiveSkill() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (e.heat < 100) {
                addMiningNotification('精准爆破能量不足，继续手动挖矿蓄能。', 'warning');
                return;
            }
            e.heat = 0;
            const bonusOre = Math.max(1, Math.floor(player.mining.power * (55 + Math.random() * 95)));
            player.mining.ore += bonusOre;
            player.mining.chestFragments = Math.min(999999, (player.mining.chestFragments || 0) + 1);
            const gotGem = !!findGem(player.mining.depth, player.mining.upgrades.detector + 6, false);
            addMiningNotification(`精准爆破成功！获得${formatMiningCost(bonusOre)}矿石、矿脉碎片+1${gotGem ? '，并发现额外宝石' : ''}`, 'gem');
            updateMiningUI();
            saveGame();
        }

        function startMiningSurvey() {
            ensureMiningEngagementState();
            const e = player.mining.engagement;
            if (e.surveyCooldown > 0) {
                addMiningNotification(`勘探冷却中，还需 ${e.surveyCooldown} 次挖掘。`, 'warning');
                return;
            }
            if (e.focus < 20) {
                addMiningNotification('专注不足（至少20），继续挖矿积累专注。', 'warning');
                return;
            }
            e.focus -= 20;
            e.surveyCooldown = 45;
            e.surveyStacks = 18;
            e.surveyBonus = 1.8 + Math.min(0.6, player.mining.upgrades.detector * 0.01);
            addMiningNotification(`手动勘探成功！接下来${e.surveyStacks}次挖掘收益提升到 x${e.surveyBonus.toFixed(2)}`, 'gem');
            updateMiningUI();
            saveGame();
        }


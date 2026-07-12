// 时光秘境
// 切换时光秘境界面
function toggleTimeSecretRealm() {
   if (player.reincarnationCount < 2000) {
        alert("需要达到2000转才能开启秘境系统！");
        return;
    }
    const overlay = document.getElementById('timeSecretRealmOverlay');
    const ui = document.getElementById('timeSecretRealmUI');
    
    if (ui.style.display === 'block') {
        // 关闭界面
        ui.style.display = 'none';
        overlay.style.display = 'none';
        if (player.timeSecretRealm.timer) {
            clearInterval(player.timeSecretRealm.timer);
            player.timeSecretRealm.timer = null;
        }
    } else {
        // 打开界面
        ui.style.display = 'block';
        overlay.style.display = 'block';
        
        // 根据是否在冒险中显示不同的界面
        const tsr = player.timeSecretRealm;
        if (tsr.currentRun && tsr.currentRun.isActive) {
            // 冒险进行中，显示冒险界面
            document.getElementById('tsrDifficultySelection').style.display = 'none';
            document.getElementById('startTsrBtn').style.display = 'none';
            document.getElementById('openTsrShopBtn').style.display = 'none';
            document.getElementById('tsrStatusDisplay').style.display = 'block';
            document.getElementById('tsrRoomDisplay').style.display = 'block';
            document.getElementById('tsrActionControls').style.display = 'block';
            document.getElementById('tsrBuffsDisplay').style.display = 'block';
            document.getElementById('tsrSkillsDisplay').style.display = 'block';
            document.getElementById('tsrHealthBar').style.display = 'block';
        } else {
            // 不在冒险中，显示难度选择界面
            document.getElementById('tsrDifficultySelection').style.display = 'block';
            document.getElementById('startTsrBtn').style.display = 'inline-block';
            document.getElementById('openTsrShopBtn').style.display = 'inline-block';
            document.getElementById('tsrStatusDisplay').style.display = 'none';
            document.getElementById('tsrRoomDisplay').style.display = 'none';
            document.getElementById('tsrActionControls').style.display = 'none';
            document.getElementById('tsrBuffsDisplay').style.display = 'none';
            document.getElementById('tsrSkillsDisplay').style.display = 'none';
            document.getElementById('tsrHealthBar').style.display = 'none';
        }
        
        updateTimeSecretRealmUI();
    }
}


// 更新时光秘境界面
function updateTimeSecretRealmUI() {
    const tsr = player.timeSecretRealm;
    
    // 更新永久数据
    document.getElementById('tsrCurrency').textContent = tsr.currency.toFixed(0);
    document.getElementById('tsrBestFloor').textContent = tsr.bestFloor;
    document.getElementById('tsrClearCount').textContent = tsr.clearCount;
    
    // 更新难度选择界面
    updateDifficultyUI();
    
    // 更新当前冒险数据（仅在冒险进行时显示）
    if (tsr.currentRun.isActive) {
        const difficulty = tsr.difficulty.levels[tsr.currentRun.difficulty];
        const clearFloor = difficulty.clearFloor;
        const progress = Math.min(100, (tsr.currentRun.currentFloor / clearFloor) * 100);
        
        document.getElementById('tsrCurrentFloor').textContent = `${tsr.currentRun.currentFloor}/${clearFloor}`;
        document.getElementById('tsrTimeLeft').textContent = tsr.currentRun.timeLeft + '秒';
        document.getElementById('tsrTempBuffs').textContent = tsr.currentRun.tempBuffs.length + '个';
        document.getElementById('tsrCurrentCurrency').textContent = tsr.currentRun.currencyEarned;
        
        // 添加通关进度显示
        const progressElement = document.getElementById('tsrProgress');
        if (!progressElement) {
            // 如果进度条不存在，创建一个
            const statusDisplay = document.getElementById('tsrStatusDisplay');
            const progressHTML = `
                <div id="tsrProgress" style="margin-top: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>通关进度:</span>
                        <span>${tsr.currentRun.currentFloor}/${clearFloor} (${progress.toFixed(1)}%)</span>
                    </div>
                    <div style="background: #333; height: 10px; border-radius: 5px; overflow: hidden;">
                        <div style="background: linear-gradient(to right, #00bfff, #ffd700); height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
                    </div>
                </div>
            `;
            statusDisplay.insertAdjacentHTML('beforeend', progressHTML);
        } else {
            // 更新现有进度条
            progressElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>通关进度:</span>
                    <span>${tsr.currentRun.currentFloor}/${clearFloor} (${progress.toFixed(1)}%)</span>
                </div>
                <div style="background: #333; height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="background: linear-gradient(to right, #00bfff, #ffd700); height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
                </div>
            `;
        }
        
        updateCurrentRoomDisplay();
        updateBuffsDisplay();
        updateSkillsDisplay();
    }
}
// 难度选择函数
function selectTsrDifficulty(difficulty) {
    const tsr = player.timeSecretRealm;
    
    // 检查是否已解锁该难度
    if (!tsr.difficulty.unlocked.includes(difficulty)) {
        const condition = tsr.difficulty.levels[difficulty].unlockCondition;
        logAction(`尚未解锁${tsr.difficulty.levels[difficulty].name}难度！需要：${condition}`, 'error');
        return;
    }
    
    tsr.difficulty.current = difficulty;
    updateDifficultyUI();
    logAction(`已选择${tsr.difficulty.levels[difficulty].name}难度`, 'success');
}

// 更新难度UI显示
function updateDifficultyUI() {
    const tsr = player.timeSecretRealm;
    const difficulty = tsr.difficulty.levels[tsr.difficulty.current];
    
    // 更新按钮状态
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.style.opacity = '0.6';
        btn.style.transform = 'scale(0.95)';
        btn.style.boxShadow = 'none';
    });
    
    const currentBtn = document.getElementById(`difficulty${tsr.difficulty.current.charAt(0).toUpperCase() + tsr.difficulty.current.slice(1)}`);
    if (currentBtn) {
        currentBtn.style.opacity = '1';
        currentBtn.style.transform = 'scale(1.05)';
        currentBtn.style.boxShadow = '0 0 15px currentColor';
    }
    
    // 更新难度信息
    document.getElementById('difficultyDescription').innerHTML = `
        <strong>${difficulty.name}难度</strong>: ${difficulty.description}<br>
        <span style="color: #ff6b6b;">怪物强度: ${difficulty.multiplier}x</span> | 
        <span style="color: #ffd700;">奖励倍数: ${difficulty.rewardMultiplier}x</span><br>
        <span style="color: #00bfff;">通关要求: ${difficulty.clearFloor}层</span>
    `;
    
    // 更新解锁条件显示
    let unlockInfo = '<strong>已解锁难度:</strong> ';
    tsr.difficulty.unlocked.forEach((diff, index) => {
        unlockInfo += `${tsr.difficulty.levels[diff].name}${index < tsr.difficulty.unlocked.length - 1 ? ', ' : ''}`;
    });
    document.getElementById('difficultyUnlockCondition').innerHTML = unlockInfo;
}

// 检查难度解锁条件（与描述一致：简单3次→普通，普通5次→困难，困难10次→噩梦，噩梦20次→地狱）
function checkDifficultyUnlocks() {
    const tsr = player.timeSecretRealm;
    const levels = tsr.difficulty.levels;
    const unlocked = tsr.difficulty.unlocked;
    const c = tsr.clearCountByDifficulty || { easy: 0, normal: 0, hard: 0, nightmare: 0, hell: 0 };
    
    if (!unlocked.includes('normal') && c.easy >= 3) {
        unlocked.push('normal');
        logAction('解锁了普通难度！（通关简单难度3次）', 'success');
    }
    if (!unlocked.includes('hard') && c.normal >= 5) {
        unlocked.push('hard');
        logAction('解锁了困难难度！（通关普通难度5次）', 'success');
    }
    if (!unlocked.includes('nightmare') && c.hard >= 10) {
        unlocked.push('nightmare');
        logAction('解锁了噩梦难度！（通关困难难度10次）', 'success');
    }
    if (!unlocked.includes('hell') && c.nightmare >= 20) {
        unlocked.push('hell');
        logAction('解锁了地狱难度！（通关噩梦难度20次）', 'success');
    }
    
    updateDifficultyUI();
}




// 开始时光秘境冒险
function startTimeSecretRealm() {
    if (player.items.fuben2 < 1) {
        alert("需要至少 1 把秘境钥匙才能进入！");
        return;
    }
    const tsr = player.timeSecretRealm;
    const difficulty = tsr.difficulty.levels[tsr.difficulty.current];
    
    // 检查是否已选择难度
    if (!tsr.difficulty.current) {
        logAction("请先选择难度！", "error");
        return;
    }    
    // 消耗秘境钥匙
    player.items.fuben2--;
    // 隐藏难度选择界面
    document.getElementById('tsrDifficultySelection').style.display = 'none';
    document.getElementById('startTsrBtn').style.display = 'none';
    document.getElementById('openTsrShopBtn').style.display = 'none';
    
    // 计算基础时间（应用永久加成）
    const baseTime = 300 + (tsr.permanentBonuses?.baseTime || 0);
    const adjustedTime = Math.floor(baseTime * (1 / difficulty.multiplier));
    
    // 初始化当前冒险数据
    tsr.currentRun = {
        isActive: true,
        currentFloor: 1,
        difficulty: tsr.difficulty.current,
        difficultyMultiplier: difficulty.multiplier,
        rewardMultiplier: difficulty.rewardMultiplier,
        clearFloor: difficulty.clearFloor,
        timeLeft: adjustedTime, // 应用永久时间加成
        tempBuffs: [],
        currentRoom: null,
        exploredRooms: 0,
        currencyEarned: 0,
        playerHealth: calculateTsrPlayerHealth(),
        playerAttack: calculateTsrPlayerAttack(),
        consecutiveFloors: 0,
        lastAction: null
    };
    
    // 应用起始祝福效果
    applyStartingBuffs();
    
    // 应用陷阱感知药水（商店购买的“下次冒险生效”）
    if (tsr.nextRunDetectionBoost) {
        tsr.currentRun.detectionBoost = true;
        tsr.nextRunDetectionBoost = false;
    }
    
    // 生成第一个房间
    generateNewRoom();
    
    // 开始计时器
    startTsrTimer();
    
    // 显示冒险界面元素
    document.getElementById('tsrStatusDisplay').style.display = 'block';
    document.getElementById('tsrRoomDisplay').style.display = 'block';
    document.getElementById('tsrActionControls').style.display = 'block';
    document.getElementById('tsrBuffsDisplay').style.display = 'block';
    document.getElementById('tsrSkillsDisplay').style.display = 'block';
    document.getElementById('tsrHealthBar').style.display = 'block';
    
    // 更新界面
    updateTimeSecretRealmUI();
    updateHealthBar();
    
    // 添加开始日志
    addTsrLog(`=== ${difficulty.name}难度冒险开始 ===`);
    addTsrLog(`时间限制: ${tsr.currentRun.timeLeft}秒（基础${baseTime}秒 + 永久加成${tsr.permanentBonuses?.baseTime || 0}秒）`);
    addTsrLog(`怪物强度: ${difficulty.multiplier}x`);
    addTsrLog(`奖励倍数: ${difficulty.rewardMultiplier}x`);
    addTsrLog(`通关要求: ${difficulty.clearFloor}层`);
}
// 应用起始祝福效果
function applyStartingBuffs() {
    const tsr = player.timeSecretRealm;
    const startingBuffCount = tsr.permanentBonuses?.startingBuffs || 0;
    
    if (startingBuffCount <= 0) return;
    
    // 可用的起始增益类型
    const availableBuffTypes = ['attack', 'health', 'critRate', 'critDamage', 'speed'];
    
    for (let i = 0; i < startingBuffCount; i++) {
        // 随机选择一个增益类型
        const randomType = availableBuffTypes[Math.floor(Math.random() * availableBuffTypes.length)];
        const buff = getStartingBuffByType(randomType);
        
        if (buff) {
            addTempBuff(buff);
            addTsrLog(`起始祝福生效！获得${buff.name}`, 'success');
        }
    }
}

// 根据类型获取起始增益
function getStartingBuffByType(type) {
    const tsr = player.timeSecretRealm;
    const buffs = tsr.tempBuffs;
    
    switch(type) {
        case 'attack':
            return {
                name: '起始攻击强化',
                effect: 'attack',
                value: 0.3, // 起始效果稍弱
                timeBonus: 30,
                duration: 0,
                isDebuff: false
            };
        case 'health':
            return {
                name: '起始生命强化',
                effect: 'health',
                value: 0.3,
                timeBonus: 60,
                duration: 0,
                isDebuff: false
            };
        case 'critRate':
            return {
                name: '起始暴击强化',
                effect: 'critRate',
                value: 0.05,
                timeBonus: 90,
                duration: 0,
                isDebuff: false
            };
        case 'critDamage':
            return {
                name: '起始爆伤强化',
                effect: 'critDamage',
                value: 0.3,
                timeBonus: 120,
                duration: 0,
                isDebuff: false
            };
        case 'speed':
            return {
                name: '起始速度强化',
                effect: 'speed',
                value: 5,
                timeBonus: 150,
                duration: 0,
                isDebuff: false
            };
        default:
            return null;
    }
}
// 生成新房间
function generateNewRoom() {
    const tsr = player.timeSecretRealm;
    const difficultyMultiplier = tsr.currentRun.difficultyMultiplier;
    
    // 根据难度调整房间类型权重
    const roomWeights = {
        battle: Math.floor(40 * difficultyMultiplier), // 难度越高战斗房间越多
        event: 25,
        treasure: Math.floor(20 / difficultyMultiplier), // 难度越高宝箱越少
        rest: Math.floor(10 / difficultyMultiplier), // 难度越高休息房间越少
        shop: Math.floor(5 / difficultyMultiplier) // 难度越高商店越少
    };
    
    // 根据权重随机选择房间类型
    const totalWeight = Object.values(roomWeights).reduce((sum, weight) => sum + weight, 0);
    let randomValue = Math.random() * totalWeight;
    
    let selectedType = null;
    for (const [type, weight] of Object.entries(roomWeights)) {
        randomValue -= weight;
        if (randomValue <= 0) {
            selectedType = type;
            break;
        }
    }
    
    // 决定是否包含陷阱（难度越高陷阱越多）
    let hasTrap = false;
    let trap = null;
    if (selectedType !== 'rest' && Math.random() < (0.3 * difficultyMultiplier)) {
        hasTrap = true;
        trap = generateRandomTrap();
        // 难度越高陷阱越强
        if (trap.damageType === 'percentage' || trap.damageType === 'fixed') {
            trap.damage *= difficultyMultiplier;
        }
    }
    
    // 创建房间对象
    tsr.currentRun.currentRoom = {
        type: selectedType,
        name: tsr.roomTypes[selectedType].name,
        explored: false,
        hasTrap: hasTrap,
        trap: trap,
        trapDetected: false,
        trapDisarmed: false,
        rewards: generateRoomRewards(selectedType, difficultyMultiplier)
    };
    
    updateCurrentRoomDisplay();
}

// 生成随机陷阱
function generateRandomTrap() {
    const traps = player.timeSecretRealm.traps.types;
    const totalWeight = Object.values(traps).reduce((sum, trap) => sum + trap.weight, 0);
    let randomValue = Math.random() * totalWeight;
    
    for (const [trapType, config] of Object.entries(traps)) {
        randomValue -= config.weight;
        if (randomValue <= 0) {
            return {
                type: trapType,
                name: config.name,
                damageType: config.damageType,
                damage: config.damage,
                effect: config.effect,
                value: config.value,
                duration: config.duration
            };
        }
    }
    
    // 默认返回毒液陷阱
    return {
        type: 'poison',
        name: '毒液陷阱',
        damageType: 'percentage',
        damage: 0.15,
        duration: 3
    };
}

// 更新当前房间显示
function updateCurrentRoomDisplay() {
    const room = player.timeSecretRealm.currentRun.currentRoom;
    const container = document.getElementById('tsrCurrentRoom');
    
    if (!room) return;
    
    let roomContent = '';
    let roomColor = '#00bfff';
    
    switch(room.type) {
        case 'battle':
            roomContent = `
                <div style="color: #ff6b6b; font-weight: bold; margin-bottom: 10px;">${room.name}</div>
                <div>这个房间充满了危险的怪物...</div>
            `;
            roomColor = '#ff6b6b';
            break;
            
        case 'event':
            roomContent = `
                <div style="color: #00bfff; font-weight: bold; margin-bottom: 10px;">${room.name}</div>
                <div>这个房间有一个神秘的事件...</div>
            `;
            roomColor = '#00bfff';
            break;
            
        case 'treasure':
            roomContent = `
                <div style="color: #ffd700; font-weight: bold; margin-bottom: 10px;">${room.name}</div>
                <div>这个房间有一个宝箱...</div>
            `;
            roomColor = '#ffd700';
            break;
            
        case 'rest':
            roomContent = `
                <div style="color: #32cd32; font-weight: bold; margin-bottom: 10px;">${room.name}</div>
                <div>这个房间可以休息恢复...</div>
            `;
            roomColor = '#32cd32';
            break;
            
        case 'shop':
            roomContent = `
                <div style="color: #9370db; font-weight: bold; margin-bottom: 10px;">${room.name}</div>
                <div>这个房间有一个神秘商店...</div>
            `;
            roomColor = '#9370db';
            break;
    }
    
    // 添加陷阱信息
    if (room.hasTrap && !room.trapDisarmed) {
        if (room.trapDetected) {
            roomContent += `
                <div style="margin-top: 10px; padding: 5px; background: rgba(255, 0, 0, 0.2); border: 1px solid #ff0000; border-radius: 3px;">
                    <div style="color: #ff6b6b; font-weight: bold;">⚠️ 发现陷阱: ${room.trap.name}</div>
                    <div style="font-size: 12px; color: #ff6b6b;">${getTrapDescription(room.trap)}</div>
                </div>
            `;
        } else {
            roomContent += `
                <div style="margin-top: 10px; padding: 5px; background: rgba(255, 165, 0, 0.2); border: 1px dashed #ffa500; border-radius: 3px;">
                    <div style="color: #ffa500; font-size: 12px;">⚠️ 这个房间可能有陷阱...</div>
                </div>
            `;
        }
    }
    
    // 添加奖励信息（商店房间无秘境币奖励，显示可购买）
    if (room.type === 'shop') {
        roomContent += `<div style="margin-top: 10px; color: ${roomColor};">可在此购买临时强化（消耗本次冒险获得的秘境币）</div>`;
    } else {
        roomContent += `<div style="margin-top: 10px; color: ${roomColor};">奖励: ${room.rewards.currency}秘境币</div>`;
    }
    
    container.innerHTML = roomContent;
    
    // 更新行动按钮
    updateActionButtons();
}
// 获取陷阱描述
function getTrapDescription(trap) {
    switch(trap.damageType) {
        case 'percentage':
            return `造成${(trap.damage * 100)}%生命值的伤害，持续${trap.duration}回合`;
        case 'fixed':
            return `造成${formatSci(trap.damage)}点固定伤害`;
        case 'debuff':
            return `${trap.effect === 'attack' ? '攻击力' : '暴击率'}降低${(trap.value * 100)}%，持续${trap.duration}回合`;
        case 'time':
            return `减少${trap.damage}秒探索时间`;
        case 'random':
            return `随机造成${(trap.damage * 100)}%生命值的伤害`;
        default:
            return '未知效果的陷阱';
    }
}
function updateActionButtons() {
    const actionContainer = document.getElementById('tsrActionControls');
    
    // 添加侦查和解除按钮
    actionContainer.innerHTML = `
        <button onclick="tsrDetectTrap()" id="tsrDetectBtn" style="display: none; background: linear-gradient(to bottom, #ffa500, #daa520); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">侦查陷阱</button>
        <button onclick="tsrDisarmTrap()" id="tsrDisarmBtn" style="display: none; background: linear-gradient(to bottom, #32cd32, #228b22); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">解除陷阱</button>
        <button onclick="tsrExploreRoom()" id="tsrExploreBtn" style="display: inline-block; background: linear-gradient(to bottom, #1e90ff, #006994); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">探索房间</button>
        <button onclick="tsrRest()" id="tsrRestBtn" style="background: linear-gradient(to bottom, #9370db, #6a5acd); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">休息恢复</button>
        <button onclick="tsrNextFloor()" id="tsrNextFloorBtn" style="background: linear-gradient(to bottom, #ffa500, #daa520); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">前往下一层</button>
        <button onclick="tsrExitRealm()" id="tsrExitBtn" style="background: linear-gradient(to bottom, #dc143c, #8b0000); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">退出秘境</button>
    `;
    
    // 更新按钮状态
    const room = player.timeSecretRealm.currentRun.currentRoom;
    const exploreBtn = document.getElementById('tsrExploreBtn');
    const detectBtn = document.getElementById('tsrDetectBtn');
    const disarmBtn = document.getElementById('tsrDisarmBtn');
    
    if (room.hasTrap && !room.trapDisarmed) {
        if (room.trapDetected) {
            exploreBtn.style.display = 'none';
            detectBtn.style.display = 'none';
            disarmBtn.style.display = 'inline-block';
        } else {
            exploreBtn.style.display = 'none';
            detectBtn.style.display = 'inline-block';
            disarmBtn.style.display = 'none';
        }
    } else {
        exploreBtn.style.display = 'inline-block';
        detectBtn.style.display = 'none';
        disarmBtn.style.display = 'none';
    }
}
// 更新增益效果显示
function updateBuffsDisplay() {
    const tsr = player.timeSecretRealm;
    const container = document.getElementById('tsrCurrentBuffs');
    container.innerHTML = '';
    
    if (!tsr.currentRun.tempBuffs || tsr.currentRun.tempBuffs.length === 0) {
        container.innerHTML = '<div style="color: #888; text-align: center; grid-column: 1 / -1;">无增益效果</div>';
        return;
    }
    
    tsr.currentRun.tempBuffs.forEach((buff, index) => {
        const buffElement = document.createElement('div');
        buffElement.style.cssText = `
            background: ${buff.isDebuff ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)'};
            padding: 10px;
            border-radius: 5px;
            border: 1px solid ${buff.isDebuff ? '#ff6b6b' : '#32cd32'};
            position: relative;
        `;
        
        let effectText = '';
        let valueText = '';
        let effectDescription = '';
        
        // 修复：正确显示各种增益效果
        switch(buff.effect) {
            case 'attack':
                effectText = '攻击力';
                valueText = `${buff.value > 0 ? '+' : ''}${(buff.value * 100).toFixed(0)}%`;
                effectDescription = `攻击力提升${(buff.value * 100).toFixed(0)}%`;
                break;
            case 'health':
                effectText = '生命值';
                valueText = `${buff.value > 0 ? '+' : ''}${(buff.value * 100).toFixed(0)}%`;
                effectDescription = `生命值提升${(buff.value * 100).toFixed(0)}%`;
                break;
            case 'critRate':
                effectText = '暴击率';
                valueText = `${buff.value > 0 ? '+' : ''}${(buff.value * 100).toFixed(1)}%`;
                effectDescription = `暴击率提升${(buff.value * 100).toFixed(1)}%`;
                break;
            case 'critDamage':
                effectText = '爆伤';
                valueText = `${buff.value > 0 ? '+' : ''}${(buff.value * 100).toFixed(0)}%`;
                effectDescription = `爆伤提升${(buff.value * 100).toFixed(0)}%`;
                break;
            case 'speed':
                effectText = '探索速度';
                valueText = buff.timeBonus ? `+${buff.timeBonus}秒` : `${buff.value > 0 ? '+' : ''}${buff.value}`;
                effectDescription = buff.timeBonus ? `探索时间+${buff.timeBonus}秒` : `探索速度提升`;
                break;
            case 'luck':
                effectText = '幸运';
                valueText = '双倍秘境币';
                effectDescription = '获得双倍秘境币';
                break;
            default:
                effectText = '未知效果';
                valueText = '';
                effectDescription = buff.name;
        }
        
        buffElement.innerHTML = `
            <div style="font-weight: bold; color: ${buff.isDebuff ? '#ff6b6b' : '#32cd32'}; margin-bottom: 5px;">
                ${buff.name}
            </div>
            <div style="font-size: 12px; color: ${buff.isDebuff ? '#ff6b6b' : '#32cd32'}; margin-bottom: 3px;">
                ${effectDescription}
            </div>
            ${buff.duration ? `
                <div style="font-size: 11px; color: #d8bfd8; margin-top: 5px;">
                    剩余: ${buff.duration}回合
                </div>
            ` : ''}
            ${buff.isDebuff ? `
                <div style="position: absolute; top: 5px; right: 5px; color: #ff6b6b;">⚠️</div>
            ` : `
                <div style="position: absolute; top: 5px; right: 5px; color: #32cd32;">✨</div>
            `}
        `;
        
        container.appendChild(buffElement);
    });
}
// 更新技能效果显示
function updateSkillsDisplay() {
    const tsr = player.timeSecretRealm;
    const container = document.getElementById('tsrCurrentSkills');
    container.innerHTML = '';
    
    const detectionSkill = tsr.traps.detectionSkills[tsr.traps.playerSkills.detection];
    const disarmSkill = tsr.traps.disarmSkills[tsr.traps.playerSkills.disarm];
    
    // 侦查技能显示
    const detectElement = document.createElement('div');
    detectElement.style.cssText = `
        background: rgba(0, 191, 255, 0.2);
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #00bfff;
    `;
    
    detectElement.innerHTML = `
        <div style="font-weight: bold; color: #00bfff; margin-bottom: 5px;">
            ${detectionSkill.name}
        </div>
        <div style="font-size: 12px; color: #00bfff;">
            成功率: ${(detectionSkill.successRate * 100).toFixed(0)}%
        </div>
        <div style="font-size: 11px; color: #d8bfd8;">
            消耗: ${detectionSkill.cost}秒
        </div>
    `;
    
    // 解除技能显示
    const disarmElement = document.createElement('div');
    disarmElement.style.cssText = `
        background: rgba(50, 205, 50, 0.2);
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #32cd32;
    `;
    
    disarmElement.innerHTML = `
        <div style="font-weight: bold; color: #32cd32; margin-bottom: 5px;">
            ${disarmSkill.name}
        </div>
        <div style="font-size: 12px; color: #32cd32;">
            成功率: ${(disarmSkill.successRate * 100).toFixed(0)}%
        </div>
        <div style="font-size: 11px; color: #d8bfd8;">
            消耗: ${disarmSkill.cost}秒
        </div>
    `;
    
    container.appendChild(detectElement);
    container.appendChild(disarmElement);
    
    // 如果有侦查加成，显示额外信息
    if (tsr.currentRun.detectionBoost) {
        const boostElement = document.createElement('div');
        boostElement.style.cssText = `
            background: rgba(255, 215, 0, 0.2);
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ffd700;
        `;
        
        boostElement.innerHTML = `
            <div style="font-weight: bold; color: #ffd700; margin-bottom: 5px;">
                陷阱感知药水
            </div>
            <div style="font-size: 12px; color: #ffd700;">
                侦查成功率 +30%
            </div>
            <div style="font-size: 11px; color: #d8bfd8;">
                本次冒险有效
            </div>
        `;
        
        container.appendChild(boostElement);
    }
}
// 在每次行动后更新增益持续时间
function updateBuffDurations() {
    const tsr = player.timeSecretRealm;
    
    // 更新增益持续时间
    tsr.currentRun.tempBuffs = tsr.currentRun.tempBuffs.filter(buff => {
        if (buff.duration) {
            buff.duration--;
            return buff.duration > 0;
        }
        return true; // 没有持续时间的增益永久有效
    });
    
    // 更新显示
    updateBuffsDisplay();
}
// 在探索房间、战斗等行动后调用
function afterAction() {
    updateBuffDurations();
    updateTimeSecretRealmUI();
}
// 侦查陷阱
function tsrDetectTrap() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    
    if (!room.hasTrap || room.trapDetected) return;
    
    const skill = tsr.traps.detectionSkills[tsr.traps.playerSkills.detection];
    const success = Math.random() < skill.successRate;
    
    // 消耗时间
    tsr.currentRun.timeLeft -= skill.cost;
    
    if (success) {
        room.trapDetected = true;
        addTsrLog(`侦查成功！发现了${room.trap.name}`, 'success');
    } else {
        addTsrLog(`侦查失败！没有发现陷阱`, 'warning');
    }
    
    updateCurrentRoomDisplay();
    
    // 检查时间是否用完
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
    }
}

// 解除陷阱
function tsrDisarmTrap() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    
    if (!room.hasTrap || !room.trapDetected || room.trapDisarmed) return;
    
    const skill = tsr.traps.disarmSkills[tsr.traps.playerSkills.disarm];
    const success = Math.random() < skill.successRate;
    
    // 消耗时间
    tsr.currentRun.timeLeft -= skill.cost;
    
    if (success) {
        room.trapDisarmed = true;
        addTsrLog(`解除成功！安全解除了${room.trap.name}`, 'success');
        
        // 解除陷阱奖励
        const reward = 200 + Math.floor(Math.random() * 30);
        tsr.currentRun.currencyEarned += reward;
        addTsrLog(`获得${reward}秘境币作为解除陷阱的奖励`);
    } else {
        // 解除失败，触发陷阱
        addTsrLog(`解除失败！触发了${room.trap.name}`, 'error');
        triggerTrap(room.trap);
    }
    
    updateCurrentRoomDisplay();
    
    // 检查时间是否用完
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
    }
}

// 触发陷阱效果
function triggerTrap(trap) {
    const tsr = player.timeSecretRealm;
    
    switch(trap.damageType) {
        case 'percentage':
            const percentageDamage = Math.floor(tsr.currentRun.playerHealth * trap.damage);
            applyDamage(percentageDamage);
            addTsrLog(`受到${percentageDamage}点伤害（${trap.damage * 100}%生命值）`, 'error');
            break;
            
        case 'fixed':
            applyDamage(trap.damage);
            addTsrLog(`受到${formatSci(trap.damage)}点固定伤害`, 'error');
            break;
            
        case 'debuff':
            // 添加减益效果
            const debuff = {
                name: trap.name + '减益',
                effect: trap.effect,
                value: trap.value,
                duration: trap.duration,
                isDebuff: true
            };
            addTempBuff(debuff);
            addTsrLog(`${trap.effect === 'attack' ? '攻击力' : '暴击率'}降低${trap.value * 100}%，持续${trap.duration}回合`, 'warning');
            break;
            
        case 'time':
            tsr.currentRun.timeLeft -= trap.damage;
            addTsrLog(`时间减少${trap.damage}秒`, 'warning');
            break;
            
        case 'random':
            const randomDamage = Math.floor(tsr.currentRun.playerHealth * (Math.random() * trap.damage));
            applyDamage(randomDamage);
            addTsrLog(`受到${randomDamage}点随机伤害`, 'error');
            break;
    }
    
    // 检查时间是否用完
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
    }
}
// 更新血条显示
function updateHealthBar() {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun || !tsr.currentRun.isActive) return;
    
    const maxHealth = calculateTsrPlayerHealth();
    const currentHealth = tsr.currentRun.playerHealth;
    const healthPercentage = (currentHealth / maxHealth) * 100;
    
    // 更新血条
    const healthBar = document.getElementById('tsrHealthBarFill');
    const healthText = document.getElementById('tsrHealthText');
    const healthWarning = document.getElementById('tsrHealthWarning');
    
    if (healthBar && healthText) {
        healthBar.style.width = `${healthPercentage}%`;
        healthText.textContent = `${healthPercentage.toFixed(1)}% (${formatSci(currentHealth)}/${formatSci(maxHealth)})`;
        
        // 警告显示
        if (healthPercentage <= 30) {
            healthWarning.style.display = 'inline';
            healthBar.style.background = 'linear-gradient(to right, #ff4500, #8b0000)';
        } else if (healthPercentage <= 50) {
            healthWarning.style.display = 'none';
            healthBar.style.background = 'linear-gradient(to right, #ffa500, #ff4500)';
        } else {
            healthWarning.style.display = 'none';
            healthBar.style.background = 'linear-gradient(to right, #32cd32, #ffa500)';
        }
    }
}

// 检查生命值是否低于失败阈值（30%）
function checkHealthFailure() {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun || !tsr.currentRun.isActive) return false;
    
    const maxHealth = calculateTsrPlayerHealth();
    const currentHealth = tsr.currentRun.playerHealth;
    const healthPercentage = (currentHealth / maxHealth) * 100;
    
    // 生命值低于30%时失败
    if (healthPercentage < 30) {
        endTimeSecretRealm('生命值过低');
        return true;
    }
    
    return false;
}
function applyDamage(damage) {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun) return;
    
    tsr.currentRun.playerHealth = bSub(tsr.currentRun.playerHealth, damage);
    
    // 更新血条
    updateHealthBar();
    
    // 检查是否失败
    if (checkHealthFailure()) {
        return;
    }
    
    // 检查是否死亡
    if (bLteZero(tsr.currentRun.playerHealth)) {
        endTimeSecretRealm('战斗失败');
        return;
    }
}
// 探索房间
function tsrExploreRoom() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    const difficultyMultiplier = tsr.currentRun.difficultyMultiplier;
    
    if (!room || room.explored) return;
    
    // 检查生命值是否过低
    if (checkHealthFailure()) {
        return;
    }
    
    room.explored = true;
    tsr.currentRun.exploredRooms++;
    tsr.currentRun.lastAction = 'explore';
    tsr.currentRun.consecutiveFloors = 0; // 重置连续层数
    
    // 消耗时间（难度越高消耗越多）
    const timeCost = Math.floor(10 * difficultyMultiplier);
    tsr.currentRun.timeLeft -= timeCost;
    
    // 如果有未解除的陷阱，触发它
    if (room.hasTrap && !room.trapDisarmed) {
        addTsrLog(`触发了${room.trap.name}！`, 'error');
        triggerTrap(room.trap);
        
        if (bLteZero(tsr.currentRun.playerHealth) || tsr.currentRun.timeLeft <= 0) {
            return;
        }
    }
    
    // 处理房间事件
    switch(room.type) {
        case 'battle':
            handleBattleRoom();
            break;
        case 'event':
            handleEventRoom();
            break;
        case 'treasure':
            handleTreasureRoom();
            break;
        case 'rest':
            handleRestRoom();
            break;
        case 'shop':
            handleShopRoom();
            break;
    }
    
    // 检查时间是否用完
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
        return;
    }
    
    updateTimeSecretRealmUI();
}



// 处理战斗房间
function handleBattleRoom() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    const difficultyMultiplier = tsr.currentRun.difficultyMultiplier;
    
    // 模拟战斗，难度越高成功率越低
    const baseSuccessRate = 0.7;
    const successRate = baseSuccessRate / difficultyMultiplier;
    const battleSuccess = Math.random() < successRate;
    
    if (battleSuccess) {
        // 战斗胜利，获得奖励（应用难度奖励倍数）
        const reward = Math.floor(room.rewards.currency * tsr.currentRun.rewardMultiplier);
        tsr.currentRun.currencyEarned += reward;
        
        addTsrLog(`战斗胜利！获得${reward}秘境币`, 'success');
        
        // 有几率获得临时强化（难度越高几率越低但效果更强）
        if (Math.random() < (0.2 / difficultyMultiplier)) {
            const buff = getRandomTempBuff();
            // 难度越高强化效果越强
            if (buff.value) {
                buff.value *= difficultyMultiplier;
            }
            // 确保增益包含时间奖励
            if (!buff.timeBonus) {
                buff.timeBonus = getTimeBonusByEffect(buff.effect);
            }
            addTempBuff(buff);
        }
    } else {
        // 战斗失败，受到伤害（难度越高伤害越大）
        const damage = Math.floor(tsr.currentRun.playerHealth * (0.2 * difficultyMultiplier));
        applyDamage(damage);
        addTsrLog(`战斗失败！受到${damage}点伤害`, 'error');
        
        if (bLteZero(tsr.currentRun.playerHealth)) return;
    }
    
    afterAction();
}
// 修复增益效果应用验证函数
function validateBuffEffects() {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun || !tsr.currentRun.tempBuffs) return;
    
    console.log('当前增益效果:');
    tsr.currentRun.tempBuffs.forEach((buff, index) => {
        console.log(`${index + 1}. ${buff.name}: ${buff.effect} = ${buff.value}`);
    });
    
    console.log('计算后的属性:');
    console.log('攻击力:', calculateTsrPlayerAttack());
    console.log('爆伤:', calculateTsrPlayerCritDamage());
    console.log('暴击率:', calculateTsrPlayerCritRate());
    console.log('生命值:', calculateTsrPlayerHealth());
}

// 处理事件房间
function handleEventRoom() {
    const tsr = player.timeSecretRealm;
    
    // 随机事件
    const events = [
        { 
            name: '神秘祝福', 
            effect: () => {
                const buff = getRandomTempBuff();
                // 确保增益包含时间奖励
                if (!buff.timeBonus) {
                    buff.timeBonus = getTimeBonusByEffect(buff.effect);
                }
                addTempBuff(buff);
                return `获得了临时强化: ${buff.name}`;
            }
        },
        { 
            name: '时间扭曲', 
            effect: () => {
                const timeChange = Math.random() > 0.5 ? 30 : -20;
                tsr.currentRun.timeLeft += timeChange;
                return `时间${timeChange > 0 ? '增加' : '减少'}了${Math.abs(timeChange)}秒`;
            }
        },
        { 
            name: '财富降临', 
            effect: () => {
                const currency = 100 + Math.floor(Math.random() * 100);
                tsr.currentRun.currencyEarned += currency;
                return `获得了${currency}秘境币`;
            }
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    const result = event.effect();
    afterAction();
    addTsrLog(`事件: ${event.name} - ${result}`);
}

// 辅助函数：根据增益效果获取时间奖励
function getTimeBonusByEffect(effect) {
    switch(effect) {
        case 'attack': return 30;
        case 'health': return 60;
        case 'critRate': return 90;
        case 'critDamage': return 120;
        case 'speed': return 150;
        default: return 0;
    }
}
function handleTreasureRoom() {
    const tsr = player.timeSecretRealm;
    const room = tsr.currentRun.currentRoom;
    
    tsr.currentRun.currencyEarned += room.rewards.currency;
    addTsrLog(`打开了宝箱！获得${room.rewards.currency}秘境币`);
    
    // 有几率获得稀有奖励
    if (Math.random() < 0.1) {
        const rareCurrency = room.rewards.currency * 3;
        tsr.currentRun.currencyEarned += rareCurrency;
        addTsrLog(`发现隐藏宝藏！额外获得${rareCurrency}秘境币`);
    }
}

// 处理休息房间
function handleRestRoom() {
    const tsr = player.timeSecretRealm;
    
    // 恢复生命值
    const maxHealth = calculateTsrPlayerHealth();
    const healAmount = Math.floor(maxHealth * 0.3);
    tsr.currentRun.playerHealth = Math.min(maxHealth, tsr.currentRun.playerHealth + healAmount);
    
    addTsrLog(`休息恢复！恢复了${healAmount}点生命值`, 'success');
    updateHealthBar();
}


// 处理商店房间
function handleShopRoom() {
    const tsr = player.timeSecretRealm;
    
    // 随机提供2-3个临时强化购买选项
    const availableBuffs = Object.values(tsr.tempBuffs);
    const numOffers = 2 + Math.floor(Math.random() * 2); // 2-3个选项
    const offers = [];
    
    for (let i = 0; i < numOffers; i++) {
        const randomIndex = Math.floor(Math.random() * availableBuffs.length);
        const buff = availableBuffs[randomIndex];
        const cost = 100 + Math.floor(Math.random() * 50); // 50-100秘境币
        
        offers.push({
            buff: buff,
            cost: cost
        });
    }
    
    // 显示购买选项
    addTsrLog(`神秘商店提供以下强化:`);
    offers.forEach((offer, index) => {
        addTsrLog(`${index + 1}. ${offer.buff.name} - ${offer.cost}秘境币`);
    });
    
    // 存储当前商店信息
    tsr.currentRun.currentShop = offers;
    
    // 显示购买按钮
    showShopOptions(offers);
}

// 显示商店购买选项
function showShopOptions(offers) {
    const container = document.getElementById('tsrCurrentRoom');
    let optionsHTML = '<div style="margin-top: 10px;">';
    
    offers.forEach((offer, index) => {
        optionsHTML += `
            <button onclick="buyTsrBuff(${index})" style="background: #9370db; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin: 2px; font-size: 12px;">
                ${offer.buff.name} (${offer.cost}币)
            </button>
        `;
    });
    
    optionsHTML += '</div>';
    container.innerHTML += optionsHTML;
}

// 购买临时强化
function buyTsrBuff(index) {
    const tsr = player.timeSecretRealm;
    const offer = tsr.currentRun.currentShop[index];
    
    if (!offer) return;
    
    if (tsr.currentRun.currencyEarned >= offer.cost) {
        tsr.currentRun.currencyEarned -= offer.cost;
        
        // 确保增益包含时间奖励
        if (!offer.buff.timeBonus) {
            offer.buff.timeBonus = getTimeBonusByEffect(offer.buff.effect);
        }
        
        addTempBuff(offer.buff);
        
        addTsrLog(`购买了${offer.buff.name}，消耗${offer.cost}秘境币`);
        updateTimeSecretRealmUI();
    } else {
        addTsrLog(`秘境币不足！需要${offer.cost}秘境币，只有${tsr.currentRun.currencyEarned}秘境币`);
    }
}

// 休息恢复
function tsrRest() {
    const tsr = player.timeSecretRealm;
    
    // 消耗时间
    tsr.currentRun.timeLeft -= 15;
    
    // 恢复生命值
    const maxHealth = calculateTsrPlayerHealth();
    const healAmount = Math.floor(maxHealth * 0.5);
    tsr.currentRun.playerHealth = Math.min(maxHealth, tsr.currentRun.playerHealth + healAmount);
    
    addTsrLog(`休息恢复！恢复了${healAmount}点生命值，消耗15秒时间`);
    
    // 检查时间是否用完
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
        return;
    }
    
    updateTimeSecretRealmUI();
}

// 前往下一层
function tsrNextFloor() {
    const tsr = player.timeSecretRealm;
    const difficulty = tsr.difficulty.levels[tsr.currentRun.difficulty];
    const clearFloor = difficulty.clearFloor;
    const difficultyMultiplier = tsr.currentRun.difficultyMultiplier;
    
    // 检查是否连续前往下一层（惩罚机制）
    if (tsr.currentRun.lastAction === 'nextFloor') {
        tsr.currentRun.consecutiveFloors++;
        
        // 连续层数越多，惩罚越大
        const penalty = Math.min(5, tsr.currentRun.consecutiveFloors);
        const timePenalty = 30 + (penalty * 15); // 额外时间惩罚
        const healthPenalty = Math.floor(tsr.currentRun.playerHealth * (penalty * 0.05)); // 生命值惩罚
        
        tsr.currentRun.timeLeft -= timePenalty;
        tsr.currentRun.playerHealth = bSub(tsr.currentRun.playerHealth, healthPenalty);
        
        addTsrLog(`连续探索惩罚！时间减少${timePenalty}秒，生命值减少${healthPenalty}点`, 'warning');
        
        // 检查是否失败
        if (checkHealthFailure() || tsr.currentRun.timeLeft <= 0) {
            return;
        }
    } else {
        tsr.currentRun.consecutiveFloors = 0;
    }
    
    tsr.currentRun.lastAction = 'nextFloor';
    
    // 消耗时间（难度越高消耗越多）
    const timeCost = Math.floor(30 * difficultyMultiplier);
    tsr.currentRun.timeLeft -= timeCost;
    
    // 增加层数
    tsr.currentRun.currentFloor++;
    tsr.currentRun.exploredRooms = 0;
    
    // 更新最佳层数
    if (tsr.currentRun.currentFloor > tsr.bestFloor) {
        tsr.bestFloor = tsr.currentRun.currentFloor;
    }
    
    // 生成新房间（难度越高房间越难）
    generateNewRoom();
    
    // 检查是否达到通关要求
    if (tsr.currentRun.currentFloor >= clearFloor) {
        addTsrLog(`🎉 恭喜！已达到${clearFloor}层通关要求！`, 'success');
        addTsrLog(`继续前进可获得更多奖励，或随时退出获得通关奖励`);
    } else if (tsr.currentRun.currentFloor >= clearFloor * 0.8) {
        addTsrLog(`📈 当前层数: ${tsr.currentRun.currentFloor}/${clearFloor}，接近通关！`, 'info');
    } else if (tsr.currentRun.currentFloor >= clearFloor * 0.5) {
        addTsrLog(`📈 当前层数: ${tsr.currentRun.currentFloor}/${clearFloor}，已完成一半进度`, 'info');
    }
    
    addTsrLog(`进入了第${tsr.currentRun.currentFloor}层！消耗${timeCost}秒时间`);
    
    // 检查时间是否用完
    if (tsr.currentRun.timeLeft <= 0) {
        endTimeSecretRealm('时间耗尽');
        return;
    }
    
    updateTimeSecretRealmUI();
}

// 退出秘境
function tsrExitRealm() {
    endTimeSecretRealm('主动退出');
}

// 结束时光秘境冒险
function endTimeSecretRealm(reason) {
    const tsr = player.timeSecretRealm;
    const difficulty = tsr.difficulty.levels[tsr.currentRun.difficulty];
    const clearFloor = difficulty.clearFloor;
    
    // 检查是否通关（达到该难度的通关层数要求）
    const isCleared = tsr.currentRun.currentFloor >= clearFloor;
    
    if (isCleared && reason !== '战斗失败' && reason !== '时间耗尽' && reason !== '生命值过低') {
        tsr.clearCount++;
        const diffKey = tsr.currentRun.difficulty;
        if (tsr.clearCountByDifficulty[diffKey] !== undefined) {
            tsr.clearCountByDifficulty[diffKey]++;
        }
        addTsrLog(`恭喜！成功通关${difficulty.name}难度（达到${clearFloor}层）`, 'success');
        
        // 检查难度解锁（按各难度通关次数，与界面描述一致）
        checkDifficultyUnlocks();
        
        // 通关额外奖励
        const clearBonus = Math.floor(tsr.currentRun.currencyEarned * 0.5); // 50%额外奖励
        tsr.currentRun.currencyEarned += clearBonus;
        addTsrLog(`通关奖励！额外获得${clearBonus}秘境币`, 'success');
    }
    
    // 计算最终奖励
    let finalReward = tsr.currentRun.currencyEarned * tsr.currentRun.rewardMultiplier;
    finalReward *= tsr.currentRun.currentFloor;
    tsr.currency += finalReward;
    
    // 更新最佳层数
    if (tsr.currentRun.currentFloor > tsr.bestFloor) {
        tsr.bestFloor = tsr.currentRun.currentFloor;
    }
    
    // 记录结束日志
    addTsrLog(`=== ${difficulty.name}难度冒险结束 ===`);
    addTsrLog(`结束原因: ${reason}`);
    addTsrLog(`最终层数: ${tsr.currentRun.currentFloor}/${clearFloor}`);
    addTsrLog(`通关要求: ${clearFloor}层`);
    addTsrLog(isCleared ? '状态: 通关成功 ✓' : '状态: 未通关 ✗');
    addTsrLog(`获得秘境币: ${finalReward}`);
    addTsrLog(`总秘境币: ${tsr.currency}`);
    
    // 重置当前冒险
    tsr.currentRun.isActive = false;
    
    // 显示难度选择界面
    document.getElementById('tsrDifficultySelection').style.display = 'block';
    document.getElementById('startTsrBtn').style.display = 'inline-block';
    document.getElementById('openTsrShopBtn').style.display = 'inline-block';
    
    // 隐藏冒险界面元素
    document.getElementById('tsrStatusDisplay').style.display = 'none';
    document.getElementById('tsrRoomDisplay').style.display = 'none';
    document.getElementById('tsrActionControls').style.display = 'none';
    document.getElementById('tsrBuffsDisplay').style.display = 'none';
    document.getElementById('tsrSkillsDisplay').style.display = 'none';
    document.getElementById('tsrHealthBar').style.display = 'none';
    
    // 更新界面
    updateTimeSecretRealmUI();
    saveGame();
}
function initTimeSecretRealm() {
    const tsr = player.timeSecretRealm;
     // 初始化永久加成数据
    if (!tsr.permanentBonuses) {
        tsr.permanentBonuses = {
            baseTime: 0,
            startingBuffs: 0
        };
    }
    
    // 初始化各难度通关次数（旧存档兼容：无此字段时用总通关次数当作简单难度次数，避免进度丢失）
    if (!tsr.clearCountByDifficulty) {
        tsr.clearCountByDifficulty = { easy: 0, normal: 0, hard: 0, nightmare: 0, hell: 0 };
        if (tsr.clearCount > 0) {
            tsr.clearCountByDifficulty.easy = Math.min(tsr.clearCount, 999);
        }
    }
    
    // 初始化商店物品购买记录
    Object.values(tsr.shopItems).forEach(item => {
        if (!item.purchased) {
            item.purchased = 0;
        }
    });
    if (!tsr.difficulty) {
        tsr.difficulty = {
            levels: {
                easy: { 
            name: '简单', 
            multiplier: 0.8, 
            rewardMultiplier: 0.7, 
            description: '适合新手玩家', 
            unlockCondition: '无',
            clearFloor: 10  // 通关层数要求
        },
        normal: { 
            name: '普通', 
            multiplier: 1.0, 
            rewardMultiplier: 1.0, 
            description: '标准难度', 
            unlockCondition: '通关简单难度3次',
            clearFloor: 15
        },
        hard: { 
            name: '困难', 
            multiplier: 1.5, 
            rewardMultiplier: 1.5, 
            description: '更具挑战性', 
            unlockCondition: '通关普通难度5次',
            clearFloor: 20
        },
        nightmare: { 
            name: '噩梦', 
            multiplier: 2.0, 
            rewardMultiplier: 2.5, 
            description: '极限挑战', 
            unlockCondition: '通关困难难度10次',
            clearFloor: 25
        },
        hell: { 
            name: '地狱', 
            multiplier: 3.0, 
            rewardMultiplier: 4.0, 
            description: '终极考验', 
            unlockCondition: '通关噩梦难度20次',
            clearFloor: 30
        }
            },
            current: 'easy', // 默认选择简单难度
            unlocked: ['easy']
        };
    }
    
    // 检查解锁条件
    checkDifficultyUnlocks();
    updateDifficultyUI();
}

// 开始秘境计时器
function startTsrTimer() {
    const tsr = player.timeSecretRealm;
    
    // 清除现有计时器
    if (tsr.timer) {
        clearInterval(tsr.timer);
    }
    
    // 每秒更新一次时间
    tsr.timer = registerInterval(() => {
        if (tsr.currentRun.isActive) {
            tsr.currentRun.timeLeft--;
            
            if (document.getElementById('tsrTimeLeft')) {
                document.getElementById('tsrTimeLeft').textContent = tsr.currentRun.timeLeft + '秒';
            }
            
            if (tsr.currentRun.timeLeft <= 0) {
                endTimeSecretRealm('时间耗尽');
            }
        }
    }, 1000);
}


// 在玩家属性计算中应用增益效果
function calculateTsrPlayerHealth() {
    const baseHealth = player.battle.playerHealth || 1e4;
    
    // 应用临时强化
    let multiplier = 1;
    const tsr = player.timeSecretRealm;
    if (tsr.currentRun && tsr.currentRun.tempBuffs) {
        tsr.currentRun.tempBuffs.forEach(buff => {
            if (buff.effect === 'health') {
                multiplier += buff.value;
            }
        });
    }
    
    return Math.floor(baseHealth * multiplier);
}

function calculateTsrPlayerAttack() {
    const baseAttack = player.battle.playerAttack || 1e4;
    
    // 应用临时强化
    let multiplier = 1;
    const tsr = player.timeSecretRealm;
    if (tsr.currentRun && tsr.currentRun.tempBuffs) {
        tsr.currentRun.tempBuffs.forEach(buff => {
            if (buff.effect === 'attack') {
                multiplier += buff.value;
            }
        });
    }
    
    return Math.floor(baseAttack * multiplier);
}

function calculateTsrPlayerCritRate() {
    const baseCritRate = player.battle.playerCritRate || 0.1;
    
    // 应用临时强化
    let bonus = 0;
    const tsr = player.timeSecretRealm;
    if (tsr.currentRun && tsr.currentRun.tempBuffs) {
        tsr.currentRun.tempBuffs.forEach(buff => {
            if (buff.effect === 'critRate') {
                bonus += buff.value;
            }
        });
    }
    
    return Math.min(0.9, baseCritRate + bonus);
}

function calculateTsrPlayerCritDamage() {
    const baseCritDamage = player.battle.playerCritDamage || 1.5;
    
    // 应用临时强化
    let multiplier = 1;
    const tsr = player.timeSecretRealm;
    if (tsr.currentRun && tsr.currentRun.tempBuffs) {
        tsr.currentRun.tempBuffs.forEach(buff => {
            if (buff.effect === 'critDamage') {
                multiplier += buff.value;
            }
        });
    }
    
    return baseCritDamage * multiplier;
}

function updatePlayerStatsDisplay() {
    const tsr = player.timeSecretRealm;
    
    // 计算正确的属性值
    const playerHealth = calculateTsrPlayerHealth();
    const playerAttack = calculateTsrPlayerAttack();
    const playerCritRate = calculateTsrPlayerCritRate();
    const playerCritDamage = calculateTsrPlayerCritDamage();
    
    // 更新界面显示
    document.getElementById('penglaiPlayerHealth').textContent = formatSci(playerHealth);
    document.getElementById('penglaiPlayerAttack').textContent = formatSci(playerAttack);
    document.getElementById('penglaiPlayerCritRate').textContent = (playerCritRate * 100).toFixed(2) + '%';
    document.getElementById('penglaiPlayerCritDamage').textContent = (playerCritDamage * 100).toFixed(1) + '%';
    
    // 更新当前运行数据（用于战斗计算）
    if (tsr.currentRun) {
        tsr.currentRun.playerHealth = playerHealth;
        tsr.currentRun.playerAttack = playerAttack;
    }
}
function calculateBattleDamage() {
    const tsr = player.timeSecretRealm;
    const baseAttack = tsr.currentRun.playerAttack;
    const critRate = calculateTsrPlayerCritRate();
    const critDamage = calculateTsrPlayerCritDamage();
    
    // 计算是否暴击
    const isCrit = Math.random() < critRate;
    let damage = baseAttack;
    
    if (isCrit) {
        damage *= critDamage;
        addTsrLog('暴击！', 'success');
    }
    
    return {
        damage: damage,
        isCrit: isCrit
    };
}
// 修复增益效果应用函数
function applyBuffEffects() {
    const tsr = player.timeSecretRealm;
    
    // 重置基础属性
    tsr.currentRun.playerHealth = calculateTsrPlayerHealth();
    tsr.currentRun.playerAttack = calculateTsrPlayerAttack();
    
    // 应用特殊效果（如幸运加成）
    tsr.currentRun.hasLuckBuff = tsr.currentRun.tempBuffs.some(buff => buff.effect === 'luck');
    tsr.currentRun.hasSpeedBuff = tsr.currentRun.tempBuffs.some(buff => buff.effect === 'speed');
}

// 修复增益显示函数，确保数值正确
function updateBuffsDisplay() {
    const tsr = player.timeSecretRealm;
    const container = document.getElementById('tsrCurrentBuffs');
    container.innerHTML = '';
    
    if (!tsr.currentRun.tempBuffs || tsr.currentRun.tempBuffs.length === 0) {
        container.innerHTML = '<div style="color: #888; text-align: center; grid-column: 1 / -1;">无增益效果</div>';
        return;
    }
    
    tsr.currentRun.tempBuffs.forEach((buff, index) => {
        const buffElement = document.createElement('div');
        buffElement.style.cssText = `
            background: ${buff.isDebuff ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)'};
            padding: 10px;
            border-radius: 5px;
            border: 1px solid ${buff.isDebuff ? '#ff6b6b' : '#32cd32'};
            position: relative;
        `;
        
        let effectText = '';
        let valueText = '';
        let timeBonusText = '';
        
        // 根据增益类型生成描述
        switch(buff.effect) {
            case 'attack':
                effectText = '攻击力';
                valueText = `${(buff.value * 100).toFixed(0)}%`;
                break;
            case 'health':
                effectText = '生命值';
                valueText = `${(buff.value * 100).toFixed(0)}%`;
                break;
            case 'critRate':
                effectText = '暴击率';
                valueText = `${(buff.value * 100).toFixed(1)}%`;
                break;
            case 'critDamage':
                effectText = '爆伤';
                valueText = `${(buff.value * 100).toFixed(0)}%`;
                break;
            case 'speed':
                effectText = '探索速度';
                valueText = `+${buff.value}秒`;
                break;
            case 'luck':
                effectText = '幸运';
                valueText = '双倍秘境币';
                break;
            default:
                effectText = '未知效果';
                valueText = '';
        }
        
        // 添加时间奖励显示
        if (buff.timeBonus && buff.timeBonus > 0) {
            timeBonusText = `<div style="font-size: 11px; color: #00bfff; margin-top: 3px;">⏱️ +${buff.timeBonus}秒</div>`;
        }
        
        buffElement.innerHTML = `
            <div style="font-weight: bold; color: ${buff.isDebuff ? '#ff6b6b' : '#32cd32'}; margin-bottom: 5px;">
                ${buff.name}
            </div>
            <div style="font-size: 12px; color: ${buff.isDebuff ? '#ff6b6b' : '#32cd32'}; margin-bottom: 3px;">
                ${effectText}: +${valueText}
            </div>
            ${timeBonusText}
            ${buff.duration ? `
                <div style="font-size: 11px; color: #d8bfd8; margin-top: 5px;">
                    剩余: ${buff.duration}回合
                </div>
            ` : ''}
            ${buff.isDebuff ? `
                <div style="position: absolute; top: 5px; right: 5px; color: #ff6b6b;">⚠️</div>
            ` : `
                <div style="position: absolute; top: 5px; right: 5px; color: #32cd32;">✨</div>
            `}
        `;
        
        container.appendChild(buffElement);
    });
}
// 在战斗日志中显示增益效果变化
function addBuffChangeLog(buff, isGained) {
    let effectDescription = '';
    let timeBonusText = '';
    
    // 生成效果描述
    switch(buff.effect) {
        case 'attack':
            effectDescription = `攻击力提升${(buff.value * 100).toFixed(0)}%`;
            break;
        case 'health':
            effectDescription = `生命值提升${(buff.value * 100).toFixed(0)}%`;
            break;
        case 'critRate':
            effectDescription = `暴击率提升${(buff.value * 100).toFixed(1)}%`;
            break;
        case 'critDamage':
            effectDescription = `爆伤提升${(buff.value * 100).toFixed(0)}%`;
            break;
        case 'speed':
            effectDescription = `探索速度提升`;
            break;
        case 'luck':
            effectDescription = '获得双倍秘境币';
            break;
        default:
            effectDescription = buff.name;
    }
    
    // 添加时间奖励描述
    if (buff.timeBonus && buff.timeBonus > 0) {
        timeBonusText = `，探索时间+${buff.timeBonus}秒`;
    }
    
    if (isGained) {
        addTsrLog(`获得增益: ${buff.name} (${effectDescription}${timeBonusText})`, 'success');
    } else {
        addTsrLog(`增益消失: ${buff.name}`, 'warning');
    }
}
// 修改增益添加逻辑，添加日志
function addTempBuff(buff) {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun.tempBuffs) {
        tsr.currentRun.tempBuffs = [];
    }
    
    // 检查是否已存在相同类型的增益
    const existingBuffIndex = tsr.currentRun.tempBuffs.findIndex(b => b.effect === buff.effect);
    
    if (existingBuffIndex !== -1) {
        // 如果已存在，替换为新的增益
        tsr.currentRun.tempBuffs[existingBuffIndex] = buff;
    } else {
        // 如果不存在，添加新增益
        tsr.currentRun.tempBuffs.push(buff);
    }
    
    // 应用时间奖励
    if (buff.timeBonus && buff.timeBonus > 0) {
        tsr.currentRun.timeLeft += buff.timeBonus;
        addTsrLog(`获得${buff.timeBonus}秒探索时间奖励！`, 'success');
    }
    
    addBuffChangeLog(buff, true);
    updateBuffsDisplay();
    
    // 重新计算玩家属性
    tsr.currentRun.playerHealth = calculateTsrPlayerHealth();
    tsr.currentRun.playerAttack = calculateTsrPlayerAttack();
    updateHealthBar();
    
    // 更新界面显示
    updateTimeSecretRealmUI();
}
// 修改增益移除逻辑，添加日志
function removeExpiredBuffs() {
    const tsr = player.timeSecretRealm;
    if (!tsr.currentRun.tempBuffs) return;
    
    const expiredBuffs = [];
    
    tsr.currentRun.tempBuffs = tsr.currentRun.tempBuffs.filter(buff => {
        if (buff.duration && buff.duration > 0) {
            buff.duration--;
            if (buff.duration <= 0) {
                expiredBuffs.push(buff);
                return false;
            }
        }
        return true;
    });
    
    expiredBuffs.forEach(buff => {
        addBuffChangeLog(buff, false);
    });
    
    // 重新计算玩家属性
    if (expiredBuffs.length > 0) {
        tsr.currentRun.playerHealth = calculateTsrPlayerHealth();
        tsr.currentRun.playerAttack = calculateTsrPlayerAttack();
        updateBuffsDisplay();
        updateHealthBar();
    }
}
// 生成房间奖励
function generateRoomRewards(roomType, difficultyMultiplier) {
    const baseRewards = {
        battle: { currency: 20, buffChance: 0.2 },
        event: { currency: 10, buffChance: 0.5 },
        treasure: { currency: 50, buffChance: 0.1 },
        rest: { currency: 0, buffChance: 0 },
        shop: { currency: 0, buffChance: 0 }
    };
    
    const reward = { ...baseRewards[roomType] };
    
    // 应用难度奖励倍数
    reward.currency = Math.floor(reward.currency * difficultyMultiplier);
    reward.buffChance *= difficultyMultiplier;
    
    return reward;
}


// 获取随机临时强化
function getRandomTempBuff() {
    const tsr = player.timeSecretRealm;
    const buffs = Object.values(tsr.tempBuffs);
    const randomBuff = buffs[Math.floor(Math.random() * buffs.length)];
    
    // 返回完整的buff对象，包含时间奖励
    return {
        name: randomBuff.name,
        effect: randomBuff.effect,
        value: randomBuff.value,
        timeBonus: randomBuff.timeBonus || getTimeBonusByEffect(randomBuff.effect),
        duration: randomBuff.duration || 0,
        isDebuff: false
    };
}

// 添加秘境日志
function addTsrLog(message) {
    const logContainer = document.getElementById('tsrBattleLog');
    if (!logContainer) return;
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEntry.style.margin = '2px 0';
    logEntry.style.padding = '2px 5px';
    
    // 根据消息类型添加颜色
    if (message.includes('获得') || message.includes('恢复') || message.includes('幸运')) {
        logEntry.style.color = '#00ff00';
    } else if (message.includes('消耗') || message.includes('时间')) {
        logEntry.style.color = '#ffa500';
    } else if (message.includes('失败') || message.includes('伤害') || message.includes('死亡')) {
        logEntry.style.color = '#ff6b6b';
    } else if (message.includes('进入') || message.includes('开始') || message.includes('层')) {
        logEntry.style.color = '#00bfff';
    } else if (message.includes('购买') || message.includes('商店')) {
        logEntry.style.color = '#9370db';
    }
    
    logContainer.appendChild(logEntry);
    while (logContainer.children.length > COPY_BATTLE_LOG_DOM_MAX) logContainer.removeChild(logContainer.firstChild);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// 打开秘境商店
function openTsrShop() {
    const overlay = document.getElementById('tsrShopOverlay');
    const ui = document.getElementById('tsrShopUI');
    
    overlay.style.display = 'block';
    ui.style.display = 'block';
    
    updateTsrShop();
}

// 关闭秘境商店
function closeTsrShop() {
    document.getElementById('tsrShopOverlay').style.display = 'none';
    document.getElementById('tsrShopUI').style.display = 'none';
}

// 更新秘境商店
function updateTsrShop() {
    const tsr = player.timeSecretRealm;
    const container = document.getElementById('tsrShopItems');
    
    // 更新货币显示
    document.getElementById('tsrShopCurrency').textContent = tsr.currency.toFixed(0);
    
    // 清空容器
    container.innerHTML = '';
    
    // 添加商店物品
    Object.entries(tsr.shopItems).forEach(([key, item]) => {
        const itemElement = document.createElement('div');
        
        // 检查是否已达到购买上限
        const isMaxPurchased = item.maxPurchase && item.purchased >= item.maxPurchase;
        const purchaseInfo = item.maxPurchase ? 
            `（${item.purchased || 0}/${item.maxPurchase}）` : '';
        
        itemElement.style.cssText = `
            background: ${isMaxPurchased ? 'rgba(128,128,128,0.3)' : 'rgba(0,0,0,0.3)'};
            padding: 15px;
            border-radius: 5px;
            border: 1px solid ${isMaxPurchased ? '#666' : '#ffd700'};
            text-align: left;
            opacity: ${isMaxPurchased ? 0.6 : 1};
        `;
        
        itemElement.innerHTML = `
            <div style="font-weight: bold; color: ${isMaxPurchased ? '#666' : '#ffd700'}; margin-bottom: 5px;">
                ${item.name}${purchaseInfo}
            </div>
            <div style="font-size: 14px; color: ${isMaxPurchased ? '#888' : '#d8bfd8'}; margin-bottom: 10px;">
                ${item.description}
            </div>
            <div style="color: #00bfff;">价格: ${item.cost}秘境币</div>
            <button onclick="buyTsrShopItem('${key}')" 
                style="background: ${isMaxPurchased ? '#666' : 'linear-gradient(to bottom, #ffd700, #daa520)'}; 
                       color: ${isMaxPurchased ? '#999' : '#004d73'}; 
                       border: none; padding: 5px 10px; border-radius: 3px; 
                       cursor: ${isMaxPurchased ? 'not-allowed' : 'pointer'}; 
                       margin-top: 10px; font-weight: bold;"
                ${isMaxPurchased ? 'disabled' : ''}>
                ${isMaxPurchased ? '已售罄' : '购买'}
            </button>
            ${isMaxPurchased ? `
                <div style="color: #ff6b6b; font-size: 12px; margin-top: 5px;">
                    ⚠️ 已达到购买上限
                </div>
            ` : ''}
        `;
        
        container.appendChild(itemElement);
    });
    
    // 显示永久加成信息
    updatePermanentBonusesDisplay();
}

// 显示永久加成信息
function updatePermanentBonusesDisplay() {
    const tsr = player.timeSecretRealm;
    const container = document.getElementById('tsrPermanentBonuses');
    
    if (!tsr.permanentBonuses) {
        container.innerHTML = '<div style="color: #888; text-align: center;">暂无永久加成</div>';
        return;
    }
    
    let bonusesHTML = '<div style="color: #ffd700; font-weight: bold; margin-bottom: 10px;">永久加成效果:</div>';
    
    if (tsr.permanentBonuses.baseTime) {
        bonusesHTML += `
            <div style="color: #00bfff; margin: 5px 0;">
                ⏱️ 时间沙漏: +${tsr.permanentBonuses.baseTime}秒基础探索时间
            </div>
        `;
    }
    
    if (tsr.permanentBonuses.startingBuffs) {
        bonusesHTML += `
            <div style="color: #32cd32; margin: 5px 0;">
                ✨ 起始祝福: 每次冒险开始获得${tsr.permanentBonuses.startingBuffs}个随机增益
            </div>
        `;
    }
    
    container.innerHTML = bonusesHTML;
}

// 购买商店物品
function buyTsrShopItem(itemKey) {
    const tsr = player.timeSecretRealm;
    const item = tsr.shopItems[itemKey];
    
    if (!item) return;
    
    // 检查限购
    if (item.maxPurchase && item.purchased >= item.maxPurchase) {
        logAction(`${item.name}已达到购买上限（${item.maxPurchase}个）`, 'error');
        return;
    }
    
    if (tsr.currency >= item.cost) {
        tsr.currency -= item.cost;
        
        // 增加已购买数量
        if (item.maxPurchase) {
            item.purchased = (item.purchased || 0) + 1;
        }
        
        // 应用物品效果
        switch(item.effect) {
            case 'time':
                // 时间沙漏：永久增加基础探索时间
                if (!tsr.permanentBonuses) {
                    tsr.permanentBonuses = {};
                }
                tsr.permanentBonuses.baseTime = (tsr.permanentBonuses.baseTime || 0) + 60;
                logAction(`永久增加60秒基础探索时间！当前总加成：${tsr.permanentBonuses.baseTime}秒`, 'success');
                break;
                
            case 'startingBuff':
                // 起始祝福：每次冒险开始时获得随机增益
                if (!tsr.permanentBonuses) {
                    tsr.permanentBonuses = {};
                }
                tsr.permanentBonuses.startingBuffs = (tsr.permanentBonuses.startingBuffs || 0) + 1;
                logAction(`永久获得起始祝福！每次冒险开始时随机获得${tsr.permanentBonuses.startingBuffs}个增益效果`, 'success');
                break;
                
            case 'attack':
                player.attributes.attackBonus += 0.50;
                logAction(`临时攻击力提升50%！当前总加成：${(player.attributes.attackBonus * 100).toFixed(2)}%`, 'success');
                break;
                
            case 'health':
                player.attributes.healthBonus += 0.50;
                logAction(`临时生命值提升50%！当前总加成：${(player.attributes.healthBonus * 100).toFixed(2)}%`, 'success');
                break;
                
            case 'detection_advanced':
                tsr.traps.playerSkills.detection = 'advanced';
                logAction('侦查技能提升至高级！成功率60%', 'success');
                break;
                
            case 'detection_expert':
                tsr.traps.playerSkills.detection = 'expert';
                logAction('侦查技能提升至专家级！成功率80%', 'success');
                break;
                
            case 'disarm_advanced':
                tsr.traps.playerSkills.disarm = 'advanced';
                logAction('解除技能提升至高级！成功率70%', 'success');
                break;
                
            case 'disarm_expert':
                tsr.traps.playerSkills.disarm = 'expert';
                logAction('解除技能提升至专家级！成功率85%', 'success');
                break;
                
            case 'detection_boost':
                // 下次冒险侦查加成（非冒险中购买时也生效）
                tsr.nextRunDetectionBoost = true;
                logAction('获得陷阱感知药水！下次冒险侦查成功率+30%', 'success');
                break;
                
            case 'material':
                player.items.yuzhou4 += 1000;
                logAction('获得1000个神器碎片', 'success');
                break;
        }
        
        // 标记物品为已解锁
        if (!tsr.unlockedItems.includes(itemKey)) {
            tsr.unlockedItems.push(itemKey);
        }
        
        logAction(`购买了${item.name}，消耗${item.cost}秘境币`, 'success');
        updateTsrShop();
        updateTimeSecretRealmUI();
        updateSkillsDisplay();
        saveGame();
    } else {
        logAction(`秘境币不足！需要${item.cost}秘境币，只有${tsr.currency}秘境币`, 'error');
    }
}
  // 种子属性
        const seedProperties = {
            "土豆": { price: 0, minWeight: 0.1, maxWeight: 10, color: "#8B4513" },
            "金桔": { price: 1000, minWeight: 0.1, maxWeight: 3, color: "#8B4513" },
            "牵牛花": { price: 3000, minWeight: 0.1, maxWeight: 5, color: "#9B59B6" },
            "无花果": { price: 5000, minWeight: 0.1, maxWeight: 5, color: "#9B59B6" },
            "黄瓜": { price: 9000, minWeight: 0.1, maxWeight: 6, color: "#27AE60" },
            "西瓜": { price: 30000, minWeight: 0.1, maxWeight: 7, color: "#2ECC71" },
            "猕猴桃": { price: 60000, minWeight: 0.1, maxWeight: 8, color: "#2ECC71" },
            "百合花": { price: 80000, minWeight: 0.1, maxWeight: 10, color: "#2ECC71" },
            "枣树": { price: 100000, minWeight: 0.1, maxWeight: 15, color: "#2ECC71" },
            "蓝莓": { price: 120000, minWeight: 0.1, maxWeight: 8, color: "#2ECC71" },
            "苹果": { price: 150000, minWeight: 0.1, maxWeight: 8, color: "#E74C3C" },
            "丝瓜": { price: 200000, minWeight: 0.1, maxWeight: 9, color: "#E74C3C" },
            "香蕉": { price: 300000, minWeight: 0.1, maxWeight: 10, color: "#F1C40F" },
            "哈密瓜": { price: 400000, minWeight: 0.1, maxWeight: 11, color: "#F1C40F" },
            "冰淇淋豆": { price: 500000, minWeight: 0.1, maxWeight: 12, color: "#F1C40F" },
            "南瓜": { price: 600000, minWeight: 0.1, maxWeight: 12, color: "#D35400" },
            "红茶": { price: 700000, minWeight: 0.1, maxWeight: 12, color: "#D35400" },
            "橙子": { price: 800000, minWeight: 0.1, maxWeight: 13, color: "#D35400" },
            "玫瑰花": { price: 900000, minWeight: 0.1, maxWeight: 13, color: "#D35400" },
            "茄子": { price: 1000000, minWeight: 0.1, maxWeight: 14, color: "#D35400" },
            "草莓": { price: 1200000, minWeight: 0.1, maxWeight: 15, color: "#E74C3C" },
            "芒果": { price: 1500000, minWeight: 0.1, maxWeight: 16, color: "#E74C3C" },
            "樱桃": { price: 2100000, minWeight: 0.1, maxWeight: 18, color: "#E74C3C" }, 
            "柚子": { price: 2400000, minWeight: 0.1, maxWeight: 19, color: "#E74C3C" }, 
            "向日葵": { price: 3000000, minWeight: 0.1, maxWeight: 20, color: "#F1C40F" },
            "松树": { price: 4000000, minWeight: 0.1, maxWeight: 22, color: "#F1C40F" },
            "茶树": { price: 5000000, minWeight: 0.1, maxWeight: 24, color: "#F1C40F" },
            "大王菊": { price: 6000000, minWeight: 0.1, maxWeight: 25, color: "#9B59B6" },
            "红袍梅": { price: 7000000, minWeight: 0.1, maxWeight: 26, color: "#9B59B6" },
            "火龙果": { price: 8000000, minWeight: 0.1, maxWeight: 22, color: "#9B59B6" },
            "柳树": { price: 9000000, minWeight: 0.1, maxWeight: 35, color: "#9B59B6" },
            "闫闫果": { price: 10000000, minWeight: 0.1, maxWeight: 29, color: "#9B59B6" },
            "菠萝": { price: 12000000, minWeight: 0.1, maxWeight: 31, color: "#9B59B6" },
            "葡萄": { price: 15000000, minWeight: 0.1, maxWeight: 30, color: "#8E44AD" },  
            "蟠桃": { price: 20000000, minWeight: 0.1, maxWeight: 30, color: "#8E44AD" },                       
            "惊奇菇": { price: 25000000, minWeight: 0.1, maxWeight: 50, color: "#8E44AD" },
            "红毛丹": { price: 30000000, minWeight: 0.1, maxWeight: 55, color: "#8E44AD" },
            "泡泡果": { price: 40000000, minWeight: 0.1, maxWeight: 50, color: "#8E44AD" },
            "人参树": { price: 50000000, minWeight: 0.1, maxWeight: 80, color: "#8E44AD" },
            "神秘果": { price: 100000000, minWeight: 0.1, maxWeight: 100, color: "#8E44AD" },
            "佛手柑": { price: 180000000, minWeight: 0.1, maxWeight: 35, color: "#FFA500" },
            "榴莲": { price: 350000000, minWeight: 0.1, maxWeight: 45, color: "#4a3728" },
            "山竹": { price: 450000000, minWeight: 0.1, maxWeight: 40, color: "#6B2D5C" },
            "百香果": { price: 550000000, minWeight: 0.1, maxWeight: 55, color: "#8B4513" },
            "释迦果": { price: 650000000, minWeight: 0.1, maxWeight: 60, color: "#90EE90" },
            "牛油果": { price: 800000000, minWeight: 0.1, maxWeight: 38, color: "#228B22" },
            "杨桃": { price: 950000000, minWeight: 0.1, maxWeight: 42, color: "#FFD700" },
            "莲雾": { price: 1100000000, minWeight: 0.1, maxWeight: 48, color: "#DC143C" },
            "番石榴": { price: 1300000000, minWeight: 0.1, maxWeight: 52, color: "#32CD32" },
            "黄皮": { price: 1500000000, minWeight: 0.1, maxWeight: 65, color: "#DAA520" }
        };

        /** 种子商店刷新库存：按种子价格分档随机数量 */
        function rollLandlordSeedStoreStock(seedName) {
            const price = seedProperties[seedName] ? seedProperties[seedName].price : 0;
            if (price >= 100000001) return 1;
            if (price < 100000) return 1 + Math.floor(Math.random() * 10);
            if (price < 1000000) return 1 + Math.floor(Math.random() * 5);
            if (price < 10000000) return 1 + Math.floor(Math.random() * 3);
            return 1 + Math.floor(Math.random() * 2);
        }

        // 种子刷新概率
        const refreshProbabilities = {
            "土豆": 100,
            "牵牛花": 100,
            "黄瓜": 100,
            "金桔": 100,
            "无花果": 100,
            "西瓜": 20,
            "苹果": 20,
            "香蕉": 20,
            "丝瓜": 20,
            "哈密瓜": 20,
            "猕猴桃": 20,
            "百合花": 20,
            "蓝莓": 20,
            "冰淇淋豆": 10,
            "枣树": 10,
            "茄子": 10,
            "南瓜": 10,
            "橙子": 10,
            "红茶": 10,
            "玫瑰花": 5,
            "草莓": 5,
            "樱桃": 5,
            "芒果": 5,
            "柚子": 3,
            "向日葵": 3,            
            "松树": 3,
            "茶树": 3,
            "大王菊": 1,
            "柳树": 1,
            "红袍梅": 1,
            "火龙果": 1,
            "菠萝": 1,            
            "闫闫果": 1,
            "葡萄": 1,
            "蟠桃": 0.1,
            "惊奇菇": 0.1,
            "红毛丹": 0.1,
            "泡泡果": 0.1,
            "人参树": 0.1,
           "神秘果": 0.01,
            "佛手柑": 0.008,
            "榴莲": 0.005,
            "山竹": 0.003,
            "百香果": 0.002,
            "释迦果": 0.001,
            "牛油果": 0.0008,
            "杨桃": 0.0005,
            "莲雾": 0.0003,
            "番石榴": 0.0002,
            "黄皮": 0.0001
        };

        // 道具属性
        const itemProperties = {
            "普通浇水器": { 
                price: 2000, 
                color: "#3498db",
                refreshProbability: 100,
                description: "加速成长10分钟，如果没有特殊突变或者基础突变，2%几率特殊突变和基础突变"
            },
            "高级浇水器": { 
                price: 20000, 
                color: "#9b59b6",
                refreshProbability: 20,
                description: "加速成长20分钟，如果没有特殊突变或者基础突变，5%几率特殊突变和基础突变"
            },
            "超级浇水器": { 
                price: 100000, 
                color: "#e74c3c",
                refreshProbability: 5,
                description: "加速成长60分钟，如果没有特殊突变或者基础突变，10%几率特殊突变和基础突变"
            },
            "天气附加器": { 
                price: 500000, 
                color: "#f1c40f",
                refreshProbability: 1,
                description: "直接获得一个没有获得的天气突变"
            },
         "流星棒": { 
        price: 200000, 
        color: "#ff6b6b",
        refreshProbability: 3,
        description: "已有天气词条时，如果词条中无亮晶晶词条，则直接获得亮晶晶词条"
    },
    "火盆": { 
        price: 20000, 
        color: "#ff6b35",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无灼热词条，则直接获得灼热词条"
    },
    "吹风机": { 
        price: 200000, 
        color: "#4d96ff",
        refreshProbability: 3,
        description: "已有天气词条时，如果词条中无龙卷风词条，则直接获得龙卷风词条"
    },
    "避雷针": { 
        price: 200000, 
        color: "#ffd93d",
        refreshProbability: 2,
        description: "已有天气词条时，如果词条中无落雷词条，则直接获得落雷词条"
    },
    "雪球机": { 
        price: 20000, 
        color: "#6bc5ff",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无覆雪词条，则直接获得覆雪词条"
    },
    "催化器": { 
        price: 50000, 
        color: "#6bcf7f",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无生机词条，则直接获得生机词条"
    },
    "臭气弹": { 
        price: 50000, 
        color: "#8b5a2b",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无臭气词条，则直接获得臭气词条"
    },
    "生化弹": { 
        price: 50000, 
        color: "#6b8b3d",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无腐烂词条，则直接获得腐烂词条"
    },
    "雾霾制造器": { 
        price: 50000, 
        color: "#a9a9a9",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无迷雾词条，则直接获得迷雾词条"
    },
    "时光沙漏": { 
        price: 150000, 
        color: "#2c3e50",
        refreshProbability: 2,
        description: "随机加速成长15~45分钟，并小概率触发基础突变"
    },
    "幸运四叶草": { 
        price: 300000, 
        color: "#27ae60",
        refreshProbability: 2,
        description: "10%几率获得一个随机未拥有的天气突变"
    },
    "大地祝福": { 
        price: 400000, 
        color: "#8B4513",
        refreshProbability: 1,
        description: "若当前无基础突变则必出基础突变，有则额外加速25分钟"
    },
    "丰收号角": { 
        price: 220000, 
        color: "#c0392b",
        refreshProbability: 2,
        description: "加速40分钟，且15%几率获得随机一个未拥有的天气词条"
    },
    "月光精华": { 
        price: 280000, 
        color: "#9b59b6",
        refreshProbability: 2,
        description: "已有天气词条时，若无比霓虹更高稀有度词条，则20%获得霓虹词条"
    },
    "闪电催化": { 
        price: 180000, 
        color: "#f1c40f",
        refreshProbability: 2,
        description: "加速20分钟并必定触发一次基础突变判定（若尚无基础突变）"
    },
    "晨曦露珠": { price: 8000, color: "#87CEEB", refreshProbability: 80, description: "加速8分钟，5%获得生机词条" },
    "烈日镜": { price: 25000, color: "#FF4500", refreshProbability: 5, description: "已有天气词条时，若无灼热则获得灼热词条" },
    "秋收镰刀": { price: 60000, color: "#DAA520", refreshProbability: 12, description: "加速成长35分钟" },
    "冬眠药剂": { price: 5000, color: "#4682B4", refreshProbability: 90, description: "加速5分钟（经济型）" },
    "春风扇": { price: 35000, color: "#98FB98", refreshProbability: 18, description: "加速12分钟，3%触发基础突变" },
    "雷云发生器": { price: 180000, color: "#4B0082", refreshProbability: 5, description: "已有天气词条时，若无落雷则获得落雷词条" },
    "彩虹喷雾": { price: 250000, color: "#FF69B4", refreshProbability: 3, description: "已有天气词条时，3%获得彩虹词条" },
    "星尘粉": { price: 95000, color: "#E6E6FA", refreshProbability: 8, description: "随机加速10~25分钟" },
    "月光瓶": { price: 120000, color: "#C0C0C0", refreshProbability: 5, description: "加速15分钟，8%获得荧光词条" },
    "日光灯": { price: 75000, color: "#FFD700", refreshProbability: 10, description: "加速18分钟" },
    "露水收集器": { price: 15000, color: "#B0E0E6", refreshProbability: 5, description: "已有天气词条时，若无潮湿则获得潮湿词条" },
    "暖阳石": { price: 45000, color: "#CD853F", refreshProbability: 15, description: "加速10分钟，10%获得沙尘词条" },
    "冰晶": { price: 55000, color: "#ADD8E6", refreshProbability: 12, description: "已有天气词条时，若无冰冻则获得冰冻词条" },
    "风铃": { price: 140000, color: "#DDA0DD", refreshProbability: 5, description: "已有天气词条时，5%获得龙卷风词条" },
    "雨伞": { price: 12000, color: "#6495ED", refreshProbability: 60, description: "已有天气词条时，若无潮湿则获得潮湿词条" }
        };
// 突变倍率
        const mutationMultipliers = {
            // 灰色词条
            "潮湿": 1, "颤栗": 1, "生机": 1, "覆雪": 1,"腐烂": 1,
            "迷雾": 1, "灼热": 1, "沙尘": 1, "结霜": 1,"臭气": 1,
            // 绿色词条
            "银": 3, "落雷": 3, "冰冻": 3, "陶化": 3,
            // 蓝色词条
            "金": 10, "荧光": 10, "彩虹": 10,"龙卷风": 10,
            // 紫色词条
            "星环": 15, "瓷化": 15, "亮晶晶": 15, "台风": 15,
            // 金色词条
            "水晶": 20, "红月": 20, "陨石": 20,
            // 彩色词条
            "流光": 25, "霓虹": 25, "渡劫": 25,
            // 田地专属词条（与银/金/水晶/流光元素词条不同；售价主要靠田地倍率，此处×1不参与元素倍率）
            "银土": 1, "金土": 1, "钻石土": 1, "流光土": 1,
            // 稀有词条
            "极光": 18, "极昼": 18,
            "霞光": 12, "霜华": 12,
            "暮色": 1, "薄雾": 1, "浓雾": 1, "细雨": 1, "阴云": 1,
            "雷暴": 3, "露珠": 3, "霜冻": 3, "微风": 3,
            "暴雨": 10, "晴空": 10, "冰雹": 10, "寒潮": 10, "季风": 10,
            "暴雪": 15, "雾凇": 15,
            "晨曦": 18, "热浪": 18, "霞蔚": 18,
            "虹彩": 22
        };

        // 田地等级：0 普通 → 1 银 → 2 金 → 3 钻石 → 4 流光；专属词条为 银土/金土/钻石土/流光土（与元素词条 银/金/水晶/流光 不同）
        const LANDLORD_FIELD_TIER_NAMES = ['普通地', '银土地', '金土地', '钻石土地', '流光土地'];
        const LANDLORD_TIER_LAND_AFFIX = ['', '银土', '金土', '钻石土', '流光土'];
        const LANDLORD_ALL_LAND_AFFIXES = ['银土', '金土', '钻石土', '流光土'];
        const LANDLORD_ELEMENT_BASIC_MUTATIONS = ['银', '金', '水晶', '流光'];
        const LANDLORD_TIER_EXCLUSIVE_PRICE_MULT = { '银土': 2, '金土': 3, '钻石土': 5, '流光土': 10 };
        const LANDLORD_TIER_UPGRADE_COST = [
            { barKey: 'silver', label: '银条', amount: 50 },
            { barKey: 'gold', label: '金条', amount: 50 },
            { barKey: 'diamond', label: '钻石条', amount: 50 },
            { barKey: 'flow', label: '流光条', amount: 50 }
        ];

        // 通天藤：果实类目顺序与种子合成链一致（土豆→…→黄皮），每级需100个对应果实；每级世界地图经验+5%
        const LANDLORD_SKY_VINE_FRUIT_ORDER = ['土豆', '金桔', '牵牛花', '无花果', '黄瓜', '西瓜', '猕猴桃', '百合花', '枣树', '蓝莓', '苹果', '丝瓜', '香蕉', '哈密瓜', '冰淇淋豆', '南瓜', '红茶', '橙子', '玫瑰花', '茄子', '草莓', '芒果', '樱桃', '柚子', '向日葵', '松树', '茶树', '大王菊', '红袍梅', '火龙果', '柳树', '闫闫果', '菠萝', '葡萄', '蟠桃', '惊奇菇', '红毛丹', '泡泡果', '人参树', '神秘果', '佛手柑', '榴莲', '山竹', '百香果', '释迦果', '牛油果', '杨桃', '莲雾', '番石榴', '黄皮'];
        const LANDLORD_SKY_VINE_FRUIT_PER_LEVEL = 100;
        const LANDLORD_SKY_VINE_WORLD_EXP_PER_LEVEL = 0.05;
        window.__landlordSkyVineConstantsReady = true;

        // 特殊突变
        const specialMutations = {
            "土豆": "薯片",
            "牵牛花": "牛郎", 
            "黄瓜": "黄瓜蛇",
            "西瓜": "方形",
            "金桔": "桔王",
            "无花果": "芜湖",
            "苹果": "糖葫芦",
            "枣树": "大枣王",
            "香蕉": "橡胶猴",
            "丝瓜": "丝雨",
            "茄子": "巨无霸",
            "红茶": "冰红茶",
            "草莓": "连体",
            "哈密瓜": "哈批",
            "樱桃": "双胞胎",
            "猕猴桃": "齐天大圣",
            "冰淇淋豆": "冰淇淋",
            "向日葵": "海绵宝宝",
            "大王菊": "超人菊", 
            "红袍梅": "红袍尊者",
            "玫瑰花": "爱心",
            "柚子": "柚水",
            "蓝莓": "蓝颜知己",
            "百合花": "友情",
            "惊奇菇": "奥特曼",
            "葡萄": "菩提祖师",
            "松树": "三只松鼠",
            "茶树": "茶茶萝莉",
            "蟠桃": "仙桃",
           "红毛丹": "仙丹",
           "闫闫果": "小闫闫",
           "人参树": "人参果",
           "菠萝": "菠萝吹雪",
            "泡泡果": "泡神",
             "柳树": "柳神",
           "火龙果": "火龙真身",
           "神秘果": "未来之心",
            "南瓜": "万圣节",
            "佛手柑": "佛手观音",
            "榴莲": "榴莲王",
            "山竹": "山竹仙子",
            "百香果": "百香王",
            "释迦果": "释迦尊者",
            "牛油果": "牛油果王",
            "杨桃": "五星杨桃",
            "莲雾": "莲雾仙子",
            "番石榴": "番石榴尊者",
            "黄皮": "黄皮大圣"
        };

        // 天气列表
        const weatherList = [
            "潮湿", "颤栗", "生机", "覆雪", "迷雾","冰冻", "陶化", "瓷化","臭气",
            "灼热", "沙尘", "结霜", "落雷", "荧光","龙卷风","台风","腐烂",
            "彩虹", "星环", "亮晶晶", "霓虹", "红月", "渡劫", "陨石",
            "极光", "极昼",
            "霞光", "霜华",
            "暮色", "晨曦", "薄雾", "浓雾", "雷暴", "细雨", "暴雨", "晴空", "阴云", "露珠", "霜冻", "冰雹", "热浪", "寒潮", "季风", "微风", "暴雪", "雾凇", "霞蔚", "虹彩"
        ];

        // 天气突变颜色映射
        const weatherMutationColors = {
            "潮湿": "grey",      // 灰色
            "腐烂": "grey", 
            "臭气": "grey", 
            "颤栗": "grey",    // 灰色
            "生机": "grey",     // 灰色
            "覆雪": "grey",           // 灰色
            "迷雾": "grey",           // 灰色
            "灼热": "grey",         // 灰色
            "沙尘": "grey",         // 灰色
            "结霜": "grey",     // 灰色
            "落雷": "green",          // 绿色
            "冰冻": "green", 
            "陶化": "green", 
            "荧光": "blue",           // 蓝色
            "龙卷风": "blue",  
            "彩虹": "rainbow",        // 彩虹色
            "星环": "purple",         // 紫色
            "瓷化": "purple",  
            "亮晶晶": "purple",
            "台风": "purple",  
            "霓虹": "rainbow",        // 彩虹色
            "渡劫": "rainbow",
            "陨石": "gold", 
            "红月": "gold",           // 金色
            "极光": "purple",
            "极昼": "blue",
            "霞光": "gold",
            "霜华": "green",
            "暮色": "grey", "晨曦": "gold", "薄雾": "grey", "浓雾": "grey", "雷暴": "green", "细雨": "grey", "暴雨": "blue", "晴空": "blue", "阴云": "grey", "露珠": "green", "霜冻": "green", "冰雹": "blue", "热浪": "gold", "寒潮": "blue", "季风": "blue", "微风": "green", "暴雪": "purple", "雾凇": "purple", "霞蔚": "gold", "虹彩": "rainbow"
                    };
const seedSynthesisRules = {
    "土豆": {
        nextLevel: "金桔",
        required: 3,
        description: "3个土豆可合成1个金桔种子"
    },
    "金桔": {
        nextLevel: "牵牛花",
        required: 3,
        description: "3个金桔可合成1个牵牛花种子"
    },
    "牵牛花": {
        nextLevel: "无花果", 
        required: 3,
        description: "3个牵牛花可合成1个无花果种子"
    },
       "无花果": {
        nextLevel: "黄瓜", 
        required: 3,
        description: "3个无花果可合成1个黄瓜种子"
    },
    "黄瓜": {
        nextLevel: "西瓜",
        required: 3,
        description: "3个黄瓜可合成1个西瓜种子"
    },
    "西瓜": {
        nextLevel: "猕猴桃",
        required: 3,
        description: "3个西瓜可合成1个猕猴桃种子"
    },
    "猕猴桃": {
        nextLevel: "百合花",
        required: 3,
        description: "3个猕猴桃可合成1个百合花种子"
    },
    "百合花": {
        nextLevel: "枣树",
        required: 3,
        description: "3个百合花可合成1个枣树种子"
    },
    "枣树": {
        nextLevel: "蓝莓",
        required: 3,
        description: "3个枣树可合成1个蓝莓种子"
    },
    "蓝莓": {
        nextLevel: "苹果",
        required: 3,
        description: "3个蓝莓可合成1个苹果种子"
    },
    "苹果": {
        nextLevel: "丝瓜",
        required: 3,
        description: "3个苹果可合成1个丝瓜种子"
    },
    "丝瓜": {
        nextLevel: "香蕉",
        required: 3,
        description: "3个丝瓜可合成1个香蕉种子"
    },
    "香蕉": {
        nextLevel: "哈密瓜",
        required: 3,
        description: "3个香蕉可合成1个哈密瓜种子"
    },
    "哈密瓜": {
        nextLevel: "冰淇淋豆",
        required: 3,
        description: "3个哈密瓜可合成1个冰淇淋豆种子"
    },
    "冰淇淋豆": {
        nextLevel: "南瓜",
        required: 3,
        description: "3个冰淇淋豆可合成1个南瓜种子"
    },
    "南瓜": {
        nextLevel: "红茶",
        required: 3,
        description: "3个南瓜可合成1个红茶种子"
    },
    "红茶": {
        nextLevel: "橙子",
        required: 3,
        description: "3个红茶可合成1个橙子种子"
    },
    "橙子": {
        nextLevel: "玫瑰花",
        required: 3,
        description: "3个橙子可合成1个玫瑰花种子"
    },
    "玫瑰花": {
        nextLevel: "茄子",
        required: 3,
        description: "3个玫瑰花可合成1个茄子种子"
    },
    "茄子": {
        nextLevel: "草莓",
        required: 3,
        description: "3个茄子可合成1个草莓种子"
    },
    "草莓": {
        nextLevel: "芒果",
        required: 3,
        description: "3个草莓可合成1个芒果种子"
    },
    "芒果": {
        nextLevel: "樱桃",
        required: 3,
        description: "3个芒果可合成1个樱桃种子"
    },
    "樱桃": {
        nextLevel: "柚子",
        required: 3,
        description: "3个樱桃可合成1个柚子种子"
    },
    "柚子": {
        nextLevel: "向日葵",
        required: 3,
        description: "3个柚子可合成1个向日葵种子"
    },
    "向日葵": {
        nextLevel: "松树",
        required: 3,
        description: "3个向日葵可合成1个松树种子"
    },
    "松树": {
        nextLevel: "茶树",
        required: 3,
        description: "3个松树可合成1个茶树种子"
    },
    "茶树": {
        nextLevel: "大王菊",
        required: 3,
        description: "3个茶树可合成1个大王菊种子"
    },
    "大王菊": {
        nextLevel: "红袍梅",
        required: 3,
        description: "3个大王菊可合成1个红袍梅种子"
    },
    "红袍梅": {
        nextLevel: "火龙果",
        required: 3,
        description: "3个红袍梅可合成1个火龙果种子"
    },
    "火龙果": {
        nextLevel: "柳树",
        required: 3,
        description: "3个火龙果可合成1个柳树种子"
    },
    "柳树": {
        nextLevel: "闫闫果",
        required: 3,
        description: "3个柳树可合成1个闫闫果种子"
    },
    "闫闫果": {
        nextLevel: "菠萝",
        required: 3,
        description: "3个闫闫果可合成1个菠萝种子"
    },
    "菠萝": {
        nextLevel: "葡萄",
        required: 3,
        description: "3个菠萝可合成1个葡萄种子"
    },
    "葡萄": {
        nextLevel: "蟠桃",
        required: 3,
        description: "3个葡萄可合成1个蟠桃种子"
    },
    "蟠桃": {
        nextLevel: "惊奇菇",
        required: 3,
        description: "3个蟠桃可合成1个惊奇菇种子"
    },
    "惊奇菇": {
        nextLevel: "红毛丹",
        required: 3,
        description: "3个惊奇菇可合成1个红毛丹种子"
    },
    "红毛丹": {
        nextLevel: "泡泡果",
        required: 3,
        description: "3个红毛丹可合成1个泡泡果种子"
    },
    "泡泡果": {
        nextLevel: "人参树",
        required: 3,
        description: "3个泡泡果可合成1个人参树种子"
    },
    "人参树": {
        nextLevel: "神秘果",
        required: 3,
        description: "3个人参树可合成1个神秘果种子"
    },
    "神秘果": {
        nextLevel: "佛手柑",
        required: 3,
        description: "3个神秘果可合成1个佛手柑种子"
    },
    "佛手柑": {
        nextLevel: "榴莲",
        required: 3,
        description: "3个佛手柑可合成1个榴莲种子"
    },
    "榴莲": {
        nextLevel: "山竹",
        required: 3,
        description: "3个榴莲可合成1个山竹种子"
    },
    "山竹": {
        nextLevel: "百香果",
        required: 3,
        description: "3个山竹可合成1个百香果种子"
    },
    "百香果": {
        nextLevel: "释迦果",
        required: 3,
        description: "3个百香果可合成1个释迦果种子"
    },
    "释迦果": {
        nextLevel: "牛油果",
        required: 3,
        description: "3个释迦果可合成1个牛油果种子"
    },
    "牛油果": {
        nextLevel: "杨桃",
        required: 3,
        description: "3个牛油果可合成1个杨桃种子"
    },
    "杨桃": {
        nextLevel: "莲雾",
        required: 3,
        description: "3个杨桃可合成1个莲雾种子"
    },
    "莲雾": {
        nextLevel: "番石榴",
        required: 3,
        description: "3个莲雾可合成1个番石榴种子"
    },
    "番石榴": {
        nextLevel: "黄皮",
        required: 3,
        description: "3个番石榴可合成1个黄皮种子"
    },
    "黄皮": {
        nextLevel: null, // 最高级，无法再合成
        required: 0,
        description: "黄皮是最高级种子，无法继续合成"
    }
};

/** 基因合成变异：彩光2×、炫彩3×、琉璃5×、琥珀10× 果实基础价 */
const LANDLORD_GENE_VARIANTS = {
    '彩光': { multiplier: 2, color: '#00cec9', cssClass: 'landlord-gene-caiguang' },
    '炫彩': { multiplier: 3, color: '#1e90ff', cssClass: 'landlord-gene-xuancai' },
    '琉璃': { multiplier: 5, color: '#74b9ff', cssClass: 'landlord-gene-liuli' },
    '琥珀': { multiplier: 10, color: '#fdcb6e', cssClass: 'landlord-gene-hupo' }
};
const LANDLORD_GENE_VARIANT_ORDER = ['彩光', '炫彩', '琉璃', '琥珀'];
const LANDLORD_GENE_VARIANT_WEIGHTS = [80, 14, 5, 1];
const LANDLORD_GENE_SYNTHESIS_VARIANT_CHANCE = 0.4;

function parseLandlordSeedKey(seedKey) {
    if (!seedKey || typeof seedKey !== 'string') {
        return { baseName: seedKey, variant: null, displayName: seedKey };
    }
    const match = seedKey.match(/^(.+?)（(彩光|炫彩|琉璃|琥珀)）$/);
    if (match && LANDLORD_GENE_VARIANTS[match[2]]) {
        return { baseName: match[1], variant: match[2], displayName: seedKey };
    }
    return { baseName: seedKey, variant: null, displayName: seedKey };
}

function formatLandlordVariantSeedName(baseName, variant) {
    return baseName + '（' + variant + '）';
}

function getLandlordSeedProperties(seedKey) {
    const parsed = parseLandlordSeedKey(seedKey);
    const base = seedProperties[parsed.baseName];
    if (!base) return null;
    if (!parsed.variant) return Object.assign({}, base);
    const vd = LANDLORD_GENE_VARIANTS[parsed.variant];
    return Object.assign({}, base, {
        price: base.price * vd.multiplier,
        color: vd.color,
        geneVariant: parsed.variant,
        geneMultiplier: vd.multiplier
    });
}

function getLandlordSeedBaseName(seedKey) {
    return parseLandlordSeedKey(seedKey).baseName;
}

function getLandlordGeneVariantLabelHtml(seedKey) {
    const parsed = parseLandlordSeedKey(seedKey);
    if (!parsed.variant) return parsed.displayName;
    const vd = LANDLORD_GENE_VARIANTS[parsed.variant];
    return '<span class="' + vd.cssClass + '">' + parsed.displayName + '</span>';
}

function rollLandlordGeneVariant() {
    const total = LANDLORD_GENE_VARIANT_WEIGHTS.reduce(function (a, b) { return a + b; }, 0);
    let r = Math.random() * total;
    for (let i = 0; i < LANDLORD_GENE_VARIANT_ORDER.length; i++) {
        r -= LANDLORD_GENE_VARIANT_WEIGHTS[i];
        if (r <= 0) return LANDLORD_GENE_VARIANT_ORDER[i];
    }
    return '彩光';
}

function getLandlordSeedsInPriceRange(minPrice, maxPrice) {
    const lo = Math.min(minPrice, maxPrice);
    const hi = Math.max(minPrice, maxPrice);
    const order = typeof LANDLORD_SKY_VINE_FRUIT_ORDER !== 'undefined'
        ? LANDLORD_SKY_VINE_FRUIT_ORDER
        : Object.keys(seedProperties);
    return order.filter(function (name) {
        const p = seedProperties[name];
        return p && p.price >= lo && p.price <= hi;
    });
}

function performLandlordGeneSynthesis(selectedSeeds) {
    if (!selectedSeeds || selectedSeeds.length !== 3) {
        return { ok: false, message: '请选择3个种子！' };
    }
    for (let i = 0; i < selectedSeeds.length; i++) {
        const s = selectedSeeds[i];
        if (!getLandlordSeedProperties(s)) {
            return { ok: false, message: '种子「' + s + '」无效！' };
        }
        if (!player.landlord.seedStorage[s] || player.landlord.seedStorage[s] < 1) {
            return { ok: false, message: '种子「' + s + '」数量不足！' };
        }
    }
    const usage = {};
    for (let j = 0; j < selectedSeeds.length; j++) {
        const key = selectedSeeds[j];
        usage[key] = (usage[key] || 0) + 1;
    }
    for (const key in usage) {
        if ((player.landlord.seedStorage[key] || 0) < usage[key]) {
            return { ok: false, message: '种子「' + key + '」数量不足！' };
        }
    }
    for (const key in usage) {
        player.landlord.seedStorage[key] -= usage[key];
        if (player.landlord.seedStorage[key] <= 0) delete player.landlord.seedStorage[key];
    }
    const prices = selectedSeeds.map(function (s) {
        return seedProperties[getLandlordSeedBaseName(s)].price;
    });
    const candidates = getLandlordSeedsInPriceRange(Math.min.apply(null, prices), Math.max.apply(null, prices));
    if (!candidates.length) {
        return { ok: false, message: '无法确定合成结果！' };
    }
    const outputBase = candidates[Math.floor(Math.random() * candidates.length)];
    let outputSeed = outputBase;
    let variant = null;
    if (Math.random() < LANDLORD_GENE_SYNTHESIS_VARIANT_CHANCE) {
        variant = rollLandlordGeneVariant();
        outputSeed = formatLandlordVariantSeedName(outputBase, variant);
    }
    if (!player.landlord.seedStorage[outputSeed]) player.landlord.seedStorage[outputSeed] = 0;
    player.landlord.seedStorage[outputSeed]++;
    player.landlord.stats.geneSynthesisCount = (player.landlord.stats.geneSynthesisCount || 0) + 1;
    player.landlord.stats.synthesisCount = (player.landlord.stats.synthesisCount || 0) + 1;
    return { ok: true, outputSeed: outputSeed, outputBase: outputBase, variant: variant };
}

const lotterySystem = {
    // 可抽奖的词条
    eligibleMutations: ["银", "金", "水晶", "流光"],
    
    // 奖品池
    prizePool: [
              { name: "西瓜", probability: 25,  weight: 1  },
         { name: "猕猴桃",  probability: 20,  weight: 1  },
        { name: "百合花", probability: 20,  weight: 1  },
          { name: "枣树", probability: 10,  weight: 1  },
        { name: "苹果", probability: 5,  weight: 1  },
        { name: "香蕉", probability: 4,  weight: 1  },
         { name: "冰淇淋豆", probability: 3,  weight: 1  },
        { name: "橙子", probability: 2,  weight: 1  },
       { name: "茄子", probability: 1,  weight: 1 },
       { name: "芒果", probability: 0.72,  weight: 1  },
       { name: "柚子", probability: 0.72,  weight: 1  },
       { name: "茶树", probability: 0.42,  weight: 1  },
       { name: "红袍梅", probability: 0.42,  weight: 1  },
     { name: "柳树", probability: 0.22,  weight: 1  },
      { name: "蟠桃", probability: 0.22,  weight: 1  },
      { name: "红毛丹", probability: 0.1,  weight: 1  },
        { name: "人参树", probability: 0.1,  weight: 1  },
      { name: "榴莲", probability: 0.01,  weight: 1  },
      { name: "百香果", probability: 0.001,  weight: 1  },
      { name: "杨桃", probability: 0.001,  weight: 1  },
        { name: "随机牧场动物", probability: 10, weight: 1, prizeType: "ranchAnimal" }
    ],
    
    // 抽奖消耗
    costPerDraw: 1, // 每次抽奖消耗1次抽奖次数
    
    // 初始化抽奖概率
    initPrizeProbabilities: function() {
        let totalProbability = 0;
        this.prizePool.forEach(prize => {
            totalProbability += prize.probability;
        });
        
        // 计算实际概率
        this.prizePool.forEach(prize => {
            prize.actualProbability = (prize.probability / totalProbability * 100).toFixed(2);
        });
    }
};

// 初始化抽奖概率
lotterySystem.initPrizeProbabilities();

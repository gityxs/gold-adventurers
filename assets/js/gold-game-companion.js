// 伴侣与探险
// 切换探险系统显示
function toggleExpeditionSystem() {
     if (player.reincarnationCount < 30) {

        alert("需要达到30转才能开启伴侣系统！");

        return;

    }
    const ui = document.getElementById('expeditionSystemUI');
    const overlay = document.getElementById('expeditionSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        initExpeditionData();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateExpeditionUI();
    }
}

// 更新探险系统UI
function updateExpeditionUI() {
    // 更新任务列表
    const tasksContainer = document.getElementById('expeditionTasks');
    tasksContainer.innerHTML = '';
    
    expeditionConfig.tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.style.cssText = 'background: linear-gradient(145deg, rgba(74,20,140,0.35), rgba(45,27,61,0.6)); border: 1px solid rgba(156,39,176,0.4); border-radius: 12px; padding: 14px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);';
        taskElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h4 style="margin: 0; font-size: 15px; color: #ce93d8;">${task.name}</h4>
                <span style="font-size: 11px; padding: 2px 8px; border-radius: 999px; background: rgba(156,39,176,0.4); color: #e1bee7;">${task.difficulty}</span>
            </div>
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #b0aec4; line-height: 1.4;">${task.description}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px; font-size: 12px;">
                <div style="color: #90a4ae;">⏱ 时长: <span style="color: #e1bee7;">${task.duration}分钟</span></div>
                <div style="color: #90a4ae;">📊 最低评分: <span style="color: #ffcc80;">${task.companionRequirement}</span></div>
            </div>
            <div style="padding: 8px 10px; border-radius: 8px; background: rgba(0,0,0,0.25); margin-bottom: 12px; font-size: 11px;">
                <div style="color: #9fa8da; margin-bottom: 4px;">基础奖励</div>
                <div>🌸 玫瑰花 ${task.baseReward.rose} · ⚡ VIP ${task.baseReward.vipPower} · 🪱 鱼饵 ${task.baseReward.bait}</div>
            </div>
            <button onclick="startExpedition('${task.id}')" 
                    style="width: 100%; background: linear-gradient(135deg, #7b1fa2, #9c27b0); color: #fff; border: none; padding: 8px; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: bold; box-shadow: 0 4px 12px rgba(156,39,176,0.4);"
                    ${player.companionExpedition.currentExpedition ? 'disabled' : ''}>
                开始探险
            </button>
        `;
        tasksContainer.appendChild(taskElement);
    });
    
    // 更新当前探险状态
    const currentContainer = document.getElementById('currentExpedition');
    if (player.companionExpedition.currentExpedition) {
        const task = expeditionConfig.tasks.find(t => t.id === player.companionExpedition.currentExpedition.taskId);
        const startTime = player.companionExpedition.currentExpedition.startTime;
        const duration = task.duration * 60 * 1000; // 转换为毫秒
        const endTime = startTime + duration;
        const remainingTime = Math.max(0, endTime - Date.now());
        const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
        
        currentContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div style="flex: 1; min-width: 180px;">
                    <div style="font-size: 14px; color: #ce93d8; font-weight: bold; margin-bottom: 4px;">${task.name} <span style="font-size: 11px; font-weight: normal; color: #9fa8da;">${task.difficulty}</span></div>
                    <div style="font-size: 12px; color: #b0aec4;">伴侣：<span style="color: #e1bee7;">${player.companionExpedition.currentExpedition.companionName}</span></div>
                    <div style="font-size: 12px; color: #b0aec4;">评分：<span style="color: #ffcc80;">${player.companionExpedition.currentExpedition.companionScore}</span></div>
                </div>
                <div style="padding: 8px 14px; border-radius: 10px; background: rgba(156,39,176,0.3); border: 1px solid rgba(206,147,216,0.4);">
                    <div style="font-size: 11px; color: #9fa8da;">剩余时间</div>
                    <div style="font-size: 18px; color: #ce93d8; font-weight: bold;">${remainingMinutes} 分钟</div>
                </div>
            </div>
        `;
    } else {
        currentContainer.innerHTML = '<p style="margin: 0; color: #90a4ae; font-size: 13px;">没有进行中的探险</p>';
    }
    
    // 更新探险历史
    const historyContainer = document.getElementById('expeditionHistory');
    historyContainer.innerHTML = '';
    
    if (player.companionExpedition.history.length === 0) {
        historyContainer.innerHTML = '<p style="margin: 0; color: #90a4ae; font-size: 13px;">暂无探险记录</p>';
    } else {
        player.companionExpedition.history.slice(0, 5).forEach(record => {
            const task = expeditionConfig.tasks.find(t => t.id === record.taskId);
            const recordElement = document.createElement('div');
            recordElement.style.cssText = 'margin-bottom: 10px; padding: 10px 12px; border-radius: 10px; background: rgba(45,27,61,0.5); border: 1px solid rgba(156,39,176,0.2);';
            recordElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <strong style="color: #ce93d8; font-size: 13px;">${task.name}</strong>
                    <span style="font-size: 11px; color: #ffcc80;">${record.rewardMultiplier.toFixed(2)}x</span>
                </div>
                <div style="font-size: 12px; color: #b0aec4;">${record.companionName} · 评分 ${record.companionScore}</div>
                <div style="font-size: 11px; color: #90a4ae; margin-top: 4px;">🌸 ${record.rewards.rose} · ⚡ ${record.rewards.vipPower} · 🪱 ${record.rewards.bait}</div>
                <div style="color: #78909c; font-size: 10px; margin-top: 4px;">${new Date(record.endTime).toLocaleString()}</div>
            `;
            historyContainer.appendChild(recordElement);
        });
    }
}

// 开始探险
// 伴侣数据结构增强
class Companion {
    constructor(id, name, rarity, score, talents) {
        this.id = id;
        this.name = name;
        this.rarity = rarity;
        this.score = score;
        this.talents = talents;
        this.locked = false; // 用户设置的锁定状态
        this.onExpedition = false; // 是否在探险中
        this.originalLockedState = false; // 原始锁定状态（用于恢复）
    }
}

// 开始探险
function startExpedition(taskId) {
    if (player.companionExpedition.currentExpedition) {
        logAction("已有进行中的探险", "error");
        return;
    }
    
    const task = expeditionConfig.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 检查是否有符合条件的伴侣
    const eligibleCompanions = player.companions.filter(c => 
        c.score >= task.companionRequirement && !c.onExpedition
    );
    
    if (eligibleCompanions.length === 0) {
        logAction("没有符合条件的伴侣", "error");
        return;
    }
    
    // 选择评分最高的伴侣
    const companion = eligibleCompanions.reduce((max, c) => 
        c.score > max.score ? c : max, eligibleCompanions[0]
    );
    
    // 保存原始锁定状态
    companion.originalLockedState = companion.locked;
    
    // 强制锁定伴侣
    companion.locked = true;
    
    // 标记伴侣为探险中
    companion.onExpedition = true;
    
    // 开始探险
    player.companionExpedition.currentExpedition = {
        taskId: task.id,
        companionId: companion.id,
        companionName: companion.name,
        companionScore: companion.score,
        startTime: Date.now()
    };
    
    player.companionExpedition.lastUpdate = Date.now();
    
    logAction(`派遣${companion.name}进行${task.name}探险，伴侣已自动锁定`, "success");
    updateExpeditionUI();
    updateCompanionDisplay();
}

// 完成探险
function completeExpedition(forceComplete = false) {
    if (!player.companionExpedition.currentExpedition) return;
    
    const expedition = player.companionExpedition.currentExpedition;
    const task = expeditionConfig.tasks.find(t => t.id === expedition.taskId);
    const companion = player.companions.find(c => c.id === expedition.companionId);
    
    if (!task || !companion) return;
    
    // 计算实际探险时间
    const startTime = expedition.startTime;
    const duration = task.duration * 60 * 1000; // 转换为毫秒
    const endTime = startTime + duration;
    const currentTime = Date.now();
    
    // 如果强制提前结束，计算实际探险时间比例
    const timeRatio = forceComplete ? 
        Math.min(1, (currentTime - startTime) / duration) : 1;
    
    // 计算奖励倍数（基于伴侣评分）
    const scoreRatio = expedition.companionScore / task.companionRequirement;
    const rewardMultiplier = Math.min(5, Math.max(1, scoreRatio * timeRatio));
    
    // 计算实际奖励
    const rewards = {
        rose: Math.floor(task.baseReward.rose * rewardMultiplier),
        vipPower: Math.floor(task.baseReward.vipPower * rewardMultiplier),
        bait: Math.floor(task.baseReward.bait * rewardMultiplier)
    };
    
    // 发放奖励
    player.items.rose += rewards.rose;
    player.items.vipPower += rewards.vipPower;
    player.items.baitCount += rewards.bait;
    
    // 添加历史记录
    player.companionExpedition.history.unshift({
        taskId: task.id,
        companionId: companion.id,
        companionName: companion.name,
        companionScore: companion.score,
        rewardMultiplier: rewardMultiplier,
        rewards: rewards,
        startTime: startTime,
        endTime: currentTime,
        duration: (currentTime - startTime) / (60 * 1000) // 分钟
    });
    
    // 限制历史记录数量
    if (player.companionExpedition.history.length > 10) {
        player.companionExpedition.history.pop();
    }
    
    // 清除当前探险
    player.companionExpedition.currentExpedition = null;
    
    // 解除伴侣的探险状态
    companion.onExpedition = false;
    
    // 恢复原始锁定状态
    companion.locked = companion.originalLockedState;
    
    logAction(
        `${companion.name}完成${task.name}探险，获得奖励: 玫瑰花x${rewards.rose}, VIP能力值x${rewards.vipPower}, 鱼饵x${rewards.bait}`,
        "success"
    );
    
    logAction(
        `${companion.name}已恢复${companion.locked ? "锁定" : "解锁"}状态`,
        "info"
    );
    
    updateExpeditionUI();
    updateCompanionDisplay();
    updateItemDisplay();
}

// 计算离线探险奖励
function calculateOfflineExpeditionRewards() {
    if (!player.companionExpedition || !player.companionExpedition.currentExpedition) return;
    
    const expedition = player.companionExpedition.currentExpedition;
    const task = expeditionConfig.tasks.find(t => t.id === expedition.taskId);
    const companion = player.companions.find(c => c.id === expedition.companionId);
    
    if (!task || !companion) return;
    
    const startTime = expedition.startTime;
    const duration = task.duration * 60 * 1000; // 转换为毫秒
    const endTime = startTime + duration;
    const currentTime = Date.now();
    
    // 如果探险已经完成
    if (currentTime >= endTime) {
        completeExpedition();
    }
}
// 伴侣商店相关函数
function toggleCompanionShop() {
    const shopUI = document.getElementById('companionShopUI');
    const overlay = document.getElementById('companionShopOverlay');
    
    if (shopUI.style.display === 'block') {
        shopUI.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        shopUI.style.display = 'block';
        overlay.style.display = 'block';
        updateSoulCounts();
    }
}

// 更新灵魂道具数量显示
function updateSoulCounts() {
    document.getElementById('soulCount1').textContent = player.items.banlv1 || 0;
    document.getElementById('soulCount2').textContent = player.items.banlv2 || 0;
    document.getElementById('soulCount3').textContent = player.items.banlv3 || 0;
    document.getElementById('soulCount4').textContent = player.items.banlv4 || 0;
    document.getElementById('soulCount5').textContent = player.items.banlv5 || 0;
    document.getElementById('soulCount6').textContent = player.items.banlv6 || 0;
    document.getElementById('soulCount7').textContent = player.items.banlv7 || 0;
    document.getElementById('soulCount8').textContent = player.items.banlv8 || 0;
    document.getElementById('soulCount9').textContent = player.items.banlv9 || 0;
}

// 灵魂道具兑换函数
function exchangeSoul(fromSoul, toSoul, fromAmount, toAmount) {
    // 确保灵魂道具字段存在
    if (player.items[fromSoul] === undefined) {
        player.items[fromSoul] = 0;
    }
    if (player.items[toSoul] === undefined) {
        player.items[toSoul] = 0;
    }
    
    // 检查是否有足够的灵魂道具
    if (player.items[fromSoul] < fromAmount) {
        const fromName = itemEffects[fromSoul]?.name || fromSoul;
        logAction(`${fromName}不足，需要${fromAmount}个`, "error");
        return;
    }
    
    // 执行兑换
    player.items[fromSoul] -= fromAmount;
    player.items[toSoul] += toAmount;
    
    // 获取道具名称
    const fromName = itemEffects[fromSoul]?.name || fromSoul;
    const toName = itemEffects[toSoul]?.name || toSoul;
    
    // 记录日志
    logAction(`成功兑换：${fromAmount}个${fromName} → ${toAmount}个${toName}`, "success");
    
    // 更新显示
    updateSoulCounts();
    updateItemDisplay();
    saveGame();
}
// 批量开启伴侣宝箱
function drawCompanionMultiple(count) {
    if (player.items.companionKey < count) {
        logAction("伴侣钥匙不足！", "error");
        return;
    }
    const maxCanAdd = COMPANION_MAX_LIMIT - player.companions.length;
    if (maxCanAdd <= 0) {
        logAction("伴侣数量已达上限(100)！", "error");
        return;
    }
    const drawsToDo = Math.min(count, maxCanAdd);
    player.items.companionKey -= drawsToDo;
    updateItemDisplay();
    // 用于统计各品质获得数量
    const rarityCount = {
        white: 0,
        blue: 0,
        epic: 0,
        pink: 0,
        orange: 0,
        red: 0,
        angel: 0,
        emyyyy: 0,
        jlyyyy: 0
    };
    
    // 保存获得的伴侣，用于最后显示
    const companionsObtained = [];
    
    // 执行多次开启
    for (let i = 0; i < drawsToDo; i++) {
        const result = drawOneCompanion();
        if (result) {
            rarityCount[result.rarity]++;
            companionsObtained.push(result);
        }
    }
    
   
    
    // 生成汇总消息
    let message = `开启${drawsToDo}次伴侣宝箱，获得：`;
    if (drawsToDo < count) message += `（因伴侣已满仅开启${drawsToDo}次）`;
    message += ' ';
    let hasCompanion = false;
    
    for (const rarity in rarityCount) {
        if (rarityCount[rarity] > 0) {
            const rarityName = companionRarities[rarity].name;
            message += `${rarityName}x${rarityCount[rarity]} `;
            hasCompanion = true;
        }
    }
    
    if (!hasCompanion) {
        message += "未获得任何伴侣";
    }
    
    logAction(message, 'success');
    
    // 更新显示
    updateCompanionDisplay();
}
// 提取单次开启逻辑到独立函数
function drawOneCompanion() {
    // 更新所有保底计数器
    player.companionChestGuarantee.epic++;
    player.companionChestGuarantee.pink++;
    player.companionChestGuarantee.orange++;
    player.companionChestGuarantee.red++;
    
    let selectedRarity;
    let isGuaranteed = false;
    
    // 检查保底机制（优先级从高到低）
    if (player.companionChestGuarantee.red >= guaranteeThresholds.red) {
        selectedRarity = "red";
        isGuaranteed = true;
        player.companionChestGuarantee.red = 0;
    } else if (player.companionChestGuarantee.orange >= guaranteeThresholds.orange) {
        selectedRarity = "orange";
        isGuaranteed = true;
        player.companionChestGuarantee.orange = 0;
    } else if (player.companionChestGuarantee.pink >= guaranteeThresholds.pink) {
        selectedRarity = "pink";
        isGuaranteed = true;
        player.companionChestGuarantee.pink = 0;
    } else if (player.companionChestGuarantee.epic >= guaranteeThresholds.epic) {
        selectedRarity = "epic";
        isGuaranteed = true;
        player.companionChestGuarantee.epic = 0;
    } else {
        // 没有触发保底，按原概率抽取
        let rand = Math.random();
        let cumulativeProb = 0;
        for (const { rarity, prob } of drawProbabilities) {
            cumulativeProb += prob;
            if (rand < cumulativeProb) {
                selectedRarity = rarity;
                break;
            }
        }
        // 概率未命中时兜底为普通（概率和小于1时可能发生）
        if (selectedRarity === undefined) selectedRarity = 'white';
    }
    
    // 生成天赋（防御：若配置不存在则用普通）
    let config = companionRarities[selectedRarity];
    if (!config) config = companionRarities['white'];
    const talentCount = config.talentCount === 0 ? 6 : config.talentCount;
    const [minRank, maxRank] = config.talentRange;
    const talents = [];
    
    while (talents.length < talentCount) {
        const type = Math.floor(Math.random() * talentTypes.length);
        const rank = Math.floor(Math.random() * (maxRank - minRank + 1)) + minRank;
        talents.push({ type, rank });
    }
    
    // 计算评分
    const baseScore = config.baseScore;
    const talentScore = talents.reduce((sum, t) => sum + (t.rank + 1) * 50, 0);
    const totalScore = Math.min(10000, baseScore + talentScore);
    
    // 生成伴侣
    const companion = {
        id: 'comp_' + Date.now() + Math.floor(Math.random() * 1000),
        name: companionNames[Math.floor(Math.random() * companionNames.length)],
        rarity: selectedRarity,
        talents,
        score: totalScore,
        locked: false,
        advanceLevel: 0,
        qualityMultiplier: 1.0
    };
    
    player.companions.push(companion);
    
    // 返回获得的伴侣信息
    return {
        rarity: selectedRarity,
        name: companion.name,
        isGuaranteed: isGuaranteed
    };
}

// 抽取伴侣
function drawCompanion() {
    if (player.items.companionKey < 1) {
        logAction("伴侣钥匙不足！", "error");
        return;
    }
    if (player.companions.length >= COMPANION_MAX_LIMIT) {
        logAction("伴侣数量已达上限(100)！", "error");
        return;
    }
    
     player.items.companionKey--;
    updateItemDisplay();
    
    const result = drawOneCompanion();
    if (result) {
        const rarityName = companionRarities[result.rarity].name;
        logAction(`获得了${rarityName}品质伴侣：${result.name}${result.isGuaranteed ? " (保底)" : ""}`, 'success');
        
        updateCompanionDisplay();
        
    }
}
// 添加伴侣进阶函数
function advanceCompanion(id) {
     const companion = player.companions.find(c => c.id === id);
    if (!companion) return;
    
    // 检查伴侣是否在探险中
    if (companion && companion.onExpedition) {
        logAction(`${companion.name}正在探险中，无法进阶！`, "error");
        return;
    }

    // 检查是否为可进阶品质
    if (!['white','blue','epic','pink', 'orange', 'red', 'angel', 'emyyyy', 'jlyyyy'].includes(companion.rarity)) {
        logAction("品质的伴侣可以进阶！", "error");
        return;
    }

     // 获取对应的灵魂道具配置
    const rarityConfig = companionRarities[companion.rarity];
    if (!rarityConfig || !rarityConfig.soulItem) {
        logAction("未找到该品质的进阶配置！", "error");
        return;
    }
    
    // 计算当前进阶等级和所需消耗
    const currentLevel = companion.advanceLevel || 0;
    const requiredCount = Math.pow(2, currentLevel); // 1, 2, 4, 8...
    
    // 检查是否有足够的灵魂道具
    const soulItemKey = rarityConfig.soulItem;
    if (!player.items[soulItemKey] || player.items[soulItemKey] < requiredCount) {
        const itemName = itemEffects[soulItemKey]?.name || "伴侣灵魂";
        logAction(`需要${requiredCount}个${itemName}才能进阶！`, "error");
        return;
    }
    
    // 消耗灵魂道具
    player.items[soulItemKey] -= requiredCount;
    
    // 提升进阶等级
    companion.advanceLevel = (companion.advanceLevel || 0) + 1;
    companion.score += Math.floor(companion.score * 0.1) + 100;
    
    // 提示信息
    const rarityName = companionRarities[companion.rarity].name;
    const itemName = itemEffects[soulItemKey]?.name || "伴侣灵魂";
    logAction(`${companion.name}使用${requiredCount}个${itemName}进阶成功！当前进阶等级+${companion.advanceLevel}`, "success");
    
    updateCompanionDisplay();
}
// 升级伴侣等级
function upgradeCompanion() {
    player.companionLevel = Math.max(1, Math.min(COMPANION_LEVEL_MAX, Math.floor(Number(player.companionLevel) || 1)));
    if (player.companionLevel >= COMPANION_LEVEL_MAX) {
        logAction(`伴侣等级已达到上限 Lv.${COMPANION_LEVEL_MAX} MAX`, 'info');
        updateCompanionDisplay();
        return;
    }
    const cost = getCompanionUpgradeCost(player.companionLevel);
    if (player.items.rose < cost) {
        logAction("玫瑰花不足！", "error");
        return;
    }
    
    player.items.rose -= cost;
    player.companionLevel = Math.min(COMPANION_LEVEL_MAX, player.companionLevel + 1);
    logAction(`伴侣等级提升至Lv.${player.companionLevel}${player.companionLevel >= COMPANION_LEVEL_MAX ? ' MAX' : ''}`, 'success');
    updateCompanionDisplay();
}

// 装备伴侣
function equipCompanion(id) {
    player.equippedCompanionId = id;
    logAction(`已装备伴侣：${player.companions.find(c => c.id === id).name}`, 'success');
    updateCompanionDisplay();
}
// 新增洗练面板相关函数
let currentWashCompanionId = null;

function openWashPanel(companionId) {
    const companion = player.companions.find(c => c.id === companionId);
    if (!companion) return;
    
    currentWashCompanionId = companionId;
    document.getElementById('washPanel').style.display = 'block';
    document.getElementById('settingsOverlay').style.display = 'block';
    document.getElementById('rebornDanCount').textContent = player.items.rebornDan || 0;
    
    // 显示当前伴侣信息（与伴侣系统卡片风格一致）
    const rc = companionRarities[companion.rarity].color;
    const infoElement = document.getElementById('washCompanionInfo');
    infoElement.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div>
                <span style="font-size: 16px; font-weight: 600; color: ${rc};">${companion.name}</span>
                <span style="margin-left: 8px; font-size: 12px; padding: 2px 8px; border-radius: 6px; background: ${rc}22; color: ${rc}; border: 1px solid ${rc}55;">${companionRarities[companion.rarity].name}</span>
            </div>
            <div style="font-size: 12px; color: #90a4ae;">天赋词条 <span style="color: #ffeb3b;">${companion.talents.length}</span> 条</div>
        </div>
    `;
    
    // 生成天赋列表和锁定选项
    updateTalentList(companion);
    
    // 隐藏之前的洗练结果
    document.getElementById('washResult').style.display = 'none';
    
    // 更新洗练消耗显示
    updateWashCost(companion);
}
// 更新天赋列表和锁定选项（与伴侣系统区块风格一致）
function updateTalentList(companion) {
    const talentListElement = document.getElementById('talentList');
    talentListElement.innerHTML = '';
    
    companion.talents.forEach((talent, index) => {
        const talentElement = document.createElement('div');
        talentElement.style.cssText = 'margin-bottom: 8px; padding: 8px 10px; border-radius: 8px; background: rgba(15,23,42,0.95); border: 1px solid rgba(111,207,151,0.2);';
        talentElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="font-size: 12px; color: #e0f2f1; flex: 1; min-width: 0;">${index + 1}. ${talentRanks[talent.rank]}${talentTypes[talent.type].name}: ${talentTypes[talent.type].description(talent.rank)}</span>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #90caf9; cursor: pointer; white-space: nowrap;">
                    <input type="checkbox" ${talent.locked ? 'checked' : ''} onchange="toggleTalentLock(${index}, this.checked)" style="cursor: pointer;">
                    锁定
                </label>
            </div>
        `;
        talentListElement.appendChild(talentElement);
    });
}

// 切换天赋锁定状态
function toggleTalentLock(talentIndex, isLocked) {
    const companion = player.companions.find(c => c.id === currentWashCompanionId);
    if (companion && companion.talents[talentIndex]) {
        companion.talents[talentIndex].locked = isLocked;
        updateWashCost(companion);
        // 可选：立即更新界面显示
        updateTalentList(companion);
    }
}

// 更新洗练消耗显示
function updateWashCost(companion) {
    const lockedCount = companion.talents.filter(t => t.locked).length;
    const totalCost = 1 + lockedCount * 2;
    
    document.getElementById('totalWashCost').textContent = 
        `${totalCost} 洗髓丹${lockedCount ? ` (锁定${lockedCount}×2)` : ''}`;
}

function closeWashPanel() {
    document.getElementById('washPanel').style.display = 'none';
    document.getElementById('settingsOverlay').style.display = 'none';
    currentWashCompanionId = null;
}

function washCompanion() {
    if (!currentWashCompanionId) return;
    
    const companion = player.companions.find(c => c.id === currentWashCompanionId);
    if (!companion) {
        closeWashPanel();
        return;
    }
    
    // 检查伴侣是否在探险中
    if (companion.onExpedition) {
        logAction(`${companion.name}正在探险中，无法洗练！`, "error");
        return;
    }
    
    // 计算消耗
    const lockedCount = companion.talents.filter(t => t.locked).length;
    const totalCost = 1 + lockedCount * 2;
    
    // 检查洗髓丹数量
    if ((player.items.rebornDan || 0) < totalCost) {
        logAction(`洗髓丹不足！需要${totalCost}个`, "error");
        return;
    }
    
    // 消耗洗髓丹
    player.items.rebornDan -= totalCost;
    document.getElementById('rebornDanCount').textContent = player.items.rebornDan;
    
    // 洗练逻辑：只重新生成未锁定的天赋
    let resultText = '洗练结果：<br>';
    
    companion.talents.forEach((talent, index) => {
        if (!talent.locked) {
            const oldType = talent.type;
            const oldRank = talent.rank;
            const oldTalentText = `${talentRanks[oldRank]}${talentTypes[oldType].name}`;
            
            
            const newType = Math.floor(Math.random() * talentTypes.length);
            const newRank = getWashTalentRank();
            talent.type = newType;
            talent.rank = newRank;
            
            
            const newTalentText = `${talentRanks[newRank]}${talentTypes[newType].name}`;
            resultText += `天赋#${index + 1}: ${oldTalentText} → ${newTalentText}<br>`;
        } else {
            resultText += `天赋#${index + 1}: [已锁定] ${talentRanks[talent.rank]}${talentTypes[talent.type].name}<br>`;
        }
    });
    updateTalentList(companion);
   
    
    // 显示洗练结果
    const resultElement = document.getElementById('washResult');
    resultElement.innerHTML = resultText;
    resultElement.style.display = 'block';
    
   
    
    
    // 更新洗练消耗显示
    updateWashCost(companion);
    
    logAction(`伴侣${companion.name}洗练完成，消耗${totalCost}洗髓丹`, 'success');
}
// 切换锁定状态
function toggleCompanionLock(id) {
    const companion = player.companions.find(c => c.id === id);
     if (companion.onExpedition) {
        logAction("伴侣在探险中，无法更改锁定状态", "error");
        return;
    }
    if (companion) {
        companion.locked = !companion.locked;
        logAction(`${companion.name}已${companion.locked ? '锁定' : '解锁'}`, 'success');
        updateCompanionDisplay();
    }
}
// 切换自动分解状态
function toggleAutoDecompose() {
    player.autoDecompose.enabled = !player.autoDecompose.enabled;
    const btn = document.getElementById('toggleAutoDecompose');
    btn.textContent = `自动分解：${player.autoDecompose.enabled ? '开启' : '关闭'}`;
    btn.style.background = player.autoDecompose.enabled ? '#4CAF50' : '#ff9800';
    logAction(`${player.autoDecompose.enabled ? '开启' : '关闭'}自动分解低于${getRarityName(player.autoDecompose.belowRarity)}的伴侣`, 'info');
    
    // 如果开启则立即检查一次
    if (player.autoDecompose.enabled) {
        checkAutoDecompose();
    }
}

// 设置自动分解的品阶阈值
function setAutoDecomposeRarity() {
    const rarity = document.getElementById('autoDecomposeBelowRarity').value;
    player.autoDecompose.belowRarity = rarity;
    logAction(`设置自动分解低于${getRarityName(rarity)}的伴侣`, 'info');
}

// 获取品阶名称
function getRarityName(rarity) {
    const names = {
        'white': '普通(白色)',
        'blue': '稀有(蓝色)',
        'epic': '史诗(紫色)',
        'pink': '卓越(粉色)',
        'orange': '完美(橙色)',
        'red': '神赐(红色)',
        'angel': '天使(彩色)',
        'emyyyy': '恶魔(深红色)',
        'jlyyyy': '精灵(绿色)'
    };
    return names[rarity] || '普通(白色)';
}

// 自动分解检查逻辑
function checkAutoDecompose() {
    if (!player.autoDecompose.enabled) return;
    
    const rarityOrder = ['white', 'blue', 'epic', 'pink', 'orange', 'red', 'angel', 'emyyyy', 'jlyyyy'];
    const targetIndex = rarityOrder.indexOf(player.autoDecompose.belowRarity);
    if (targetIndex === -1) return;
    
    // 找出所有低于等于目标品阶且未锁定的伴侣
    const toDecompose = player.companions.filter(c => 
        rarityOrder.indexOf(c.rarity) <= targetIndex && !c.locked
    );
     
    if (toDecompose.length > 0) {
        // 按品质分组统计
        const decomposeByRarity = {};
        toDecompose.forEach(companion => {
            const rarity = companion.rarity;
            if (!decomposeByRarity[rarity]) {
                decomposeByRarity[rarity] = [];
            }
            decomposeByRarity[rarity].push(companion);
        });
        
        // 计算总玫瑰花奖励
        const totalRoses = toDecompose.reduce((sum, c) => sum + companionRarities[c.rarity].decomposeRose, 0);
        player.items.rose += totalRoses;
        
        // 计算并添加灵魂道具
        for (const rarity in decomposeByRarity) {
            const companionsOfRarity = decomposeByRarity[rarity];
            const soulItemKey = companionRarities[rarity]?.soulItem;
            
            if (soulItemKey) {
                // 初始化灵魂道具数量（如果不存在）
                if (player.items[soulItemKey] === undefined) {
                    player.items[soulItemKey] = 0;
                }
                // 添加灵魂道具
                player.items[soulItemKey] += companionsOfRarity.length;
                
                const soulItemName = itemEffects[soulItemKey]?.name || "伴侣灵魂";
                logAction(`自动分解获得${companionsOfRarity.length}个${soulItemName}`, 'info');
            }
        }
        
        // 过滤掉分解的伴侣
        player.companions = player.companions.filter(c => 
            !(rarityOrder.indexOf(c.rarity) <= targetIndex && !c.locked)
        );
      
        // 如果装备的伴侣被分解，取消装备
        if (toDecompose.some(c => c.id === player.equippedCompanionId)) {
            player.equippedCompanionId = null;
        }
        
        logAction(`自动分解${toDecompose.length}个低于${getRarityName(player.autoDecompose.belowRarity)}的伴侣，获得${totalRoses}玫瑰花`, 'success');
        updateCompanionDisplay();
        updateItemDisplay();
        saveGame(); // 保存游戏
    }
}

// 添加到页面初始化函数中
function initAutoDecomposeUI() {
    const raritySelect = document.getElementById('autoDecomposeBelowRarity');
    raritySelect.value = player.autoDecompose.belowRarity;
    raritySelect.onchange = setAutoDecomposeRarity;
    
    const btn = document.getElementById('toggleAutoDecompose');
    btn.textContent = `自动分解：${player.autoDecompose.enabled ? '开启' : '关闭'}`;
    btn.style.background = player.autoDecompose.enabled ? '#4CAF50' : '#ff9800';
}



// 添加定时检查（每1秒一次）
registerInterval(checkAutoDecompose, 1000);
registerInterval(checkArtifactAutoDecompose, 10000);
registerInterval(checkWingAutoDecompose, 10000);
registerInterval(checkMountAutoDecompose, 10000);
registerInterval(checkParkingAutoDecompose, 10000);
registerInterval(function () {
    if (typeof runPixelAutoDiscard === 'function' && player.pixelPlayer && player.pixelPlayer.autoDiscard && player.pixelPlayer.autoDiscard.enabled) {
        runPixelAutoDiscard(true);
    }
}, 10000);
registerInterval(function () {
    if (typeof checkBeastAutoDiscard === 'function') checkBeastAutoDiscard();
}, 10000);
registerInterval(function () {
    if (typeof runReincarnationEquipAutoDiscard === 'function') runReincarnationEquipAutoDiscard(true);
}, 10000);
// 分解单个伴侣
function decomposeCompanion(id) {
    const companion = player.companions.find(c => c.id === id);
    if (!companion) return;
    
    if (companion.locked) {
        logAction("伴侣已锁定，无法分解！", "error");
        return;
    }
    
    // 获取分解奖励
    const rarityConfig = companionRarities[companion.rarity];
    const roses = rarityConfig ? rarityConfig.decomposeRose : 5; // 默认5朵玫瑰
    
    // 获取对应的灵魂道具
    const soulItemKey = rarityConfig.soulItem;
    const soulItemName = itemEffects[soulItemKey]?.name || "伴侣灵魂";
    
    // 移除伴侣
    player.companions = player.companions.filter(c => c.id !== id);
    
    // 如果分解的是装备的伴侣，取消装备
    if (player.equippedCompanionId === id) {
        player.equippedCompanionId = null;
    }
    
    // 添加奖励
    player.items.rose += roses;
    
    // 确保灵魂道具字段存在，然后增加1
    if (soulItemKey) {
        // 初始化灵魂道具数量（如果不存在）
        if (player.items[soulItemKey] === undefined) {
            player.items[soulItemKey] = 0;
        }
        player.items[soulItemKey] += 1;
    }
    
    logAction(`分解${companion.name}获得${roses}朵玫瑰花和1个${soulItemName}`, "success");
    updateCompanionDisplay();
    updateItemDisplay();
}

// 批量分解
function batchDecompose() {
    const rarity = document.getElementById('decomposeRarity').value;
    const toDecompose = player.companions.filter(c => c.rarity === rarity && !c.locked);
   
    if (toDecompose.length === 0) {
        logAction("没有可分解的伴侣", "error");
        return;
    }
    
    const totalRoses = toDecompose.reduce((sum, c) => sum + companionRarities[c.rarity].decomposeRose, 0);
    player.items.rose += totalRoses;
    
    // 获取对应的灵魂道具
    const soulItemKey = companionRarities[rarity].soulItem;
    const soulItemName = itemEffects[soulItemKey]?.name || "伴侣灵魂";
    
    // 添加灵魂道具
    if (soulItemKey) {
        // 初始化灵魂道具数量（如果不存在）
        if (player.items[soulItemKey] === undefined) {
            player.items[soulItemKey] = 0;
        }
        player.items[soulItemKey] += toDecompose.length;
    }
    
    // 过滤掉分解的伴侣
    player.companions = player.companions.filter(c => !(c.rarity === rarity && !c.locked));
    
    // 如果装备的伴侣被分解，取消装备
    if (toDecompose.some(c => c.id === player.equippedCompanionId)) {
        player.equippedCompanionId = null;
    }
    
    logAction(`批量分解${toDecompose.length}个${companionRarities[rarity].name}伴侣，获得${totalRoses}玫瑰花和${toDecompose.length}个${soulItemName}`, 'success');
    updateCompanionDisplay();
    updateItemDisplay();
}
// 打开合成面板
function openCombinePanel(mainId = null) {
    // 显示面板
    document.getElementById('combinePanel').style.display = 'block';
    
    // 填充可选伴侣列表
    const mainSelect = document.getElementById('mainCompanionSelect');
    const secondarySelect = document.getElementById('secondaryCompanionSelect');
    
    // 清空现有选项
    mainSelect.innerHTML = '';
    secondarySelect.innerHTML = '';
    
    // 只显示可合成的伴侣（史诗及以上且未锁定）
    const eligibleCompanions = player.companions.filter(c => 
        ['epic', 'pink', 'orange', 'red', 'angel', 'emyyyy', 'jlyyyy'].includes(c.rarity) && !c.locked
    );
    
    eligibleCompanions.forEach(companion => {
        const option = document.createElement('option');
        option.value = companion.id;
        option.textContent = `${companion.name} (${companionRarities[companion.rarity].name} +${companion.advanceLevel || 0})`;
        mainSelect.appendChild(option.cloneNode(true));
        secondarySelect.appendChild(option);
    });
    
    // 如果有传入主伴侣ID，设置为主选
    if (mainId && eligibleCompanions.some(c => c.id === mainId)) {
        mainSelect.value = mainId;
    }
    
    // 添加选择事件监听
    mainSelect.onchange = updateCombinePreview;
    secondarySelect.onchange = updateCombinePreview;
    
    // 初始更新预览
    updateCombinePreview();
}

// 关闭合成面板
function closeCombinePanel() {
    document.getElementById('combinePanel').style.display = 'none';
}

// 更新合成预览
function updateCombinePreview() {
    const mainId = document.getElementById('mainCompanionSelect').value;
    const secondaryId = document.getElementById('secondaryCompanionSelect').value;
    
    // 清除相同选择
    if (mainId && secondaryId && mainId === secondaryId) {
        document.getElementById('secondaryCompanionSelect').value = '';
    }
    
    const mainCompanion = player.companions.find(c => c.id === mainId);
   // 显示随机品质加成预览
    document.getElementById('previewQualityMultiplier').textContent = 
        `${(Math.random() * 0.6 + 0.7).toFixed(2)}x`;
    const secondaryCompanion = player.companions.find(c => c.id === secondaryId);
    
    // 更新伴侣信息显示
    updateCompanionInfo('mainCompanionInfo', mainCompanion);
    updateCompanionInfo('secondaryCompanionInfo', secondaryCompanion);
    
    // 更新预览信息
    const previewGeneration = document.getElementById('previewGeneration');
    const previewTalentCount = document.getElementById('previewTalentCount');
    const previewScoreRange = document.getElementById('previewScoreRange');
    
    if (mainCompanion && secondaryCompanion) {
        // 计算可能的代数
        const mainGen = getCompanionGeneration(mainCompanion);
        const secondaryGen = getCompanionGeneration(secondaryCompanion);
        const newGen = Math.max(mainGen, secondaryGen) + 1;
        previewGeneration.textContent = `${newGen}代`;
        
        // 计算可能的天赋数量范围
        const totalTalents = mainCompanion.talents.length + secondaryCompanion.talents.length;
        const minT1 = Math.floor(totalTalents * 0.01);
        const maxT1 = Math.floor(totalTalents * 0.5);
        const minT2 = Math.floor(maxT1 + 1);
        const maxT2 = Math.floor(totalTalents * 0.75);
        const minT3 = maxT2 + 1;
        const maxT3 = Math.floor(totalTalents * 1.0);
        previewTalentCount.textContent = `${minT1}-${maxT3} (80%概率 ${minT1}-${maxT1}, 18%概率 ${minT2}-${maxT2}, 2%概率 ${minT3}-${maxT3})`;
        
        // 计算可能的评分范围
        const minScore = Math.min(mainCompanion.score, secondaryCompanion.score);
        const maxScore = Math.max(mainCompanion.score, secondaryCompanion.score);
        const finalMin = Math.floor(minScore * 0.7); // 最低70%
        const finalMax = Math.ceil(maxScore * 1.3); // 最高130%
        previewScoreRange.textContent = `${finalMin}-${finalMax}`;
    } else {
        previewGeneration.textContent = '--';
        previewTalentCount.textContent = '--';
        previewScoreRange.textContent = '--';
    }
}

// 获取伴侣代数
function getCompanionGeneration(companion) {
    // 检查名字中是否包含代数信息
    const match = companion.name.match(/(\d+)代/);
    if (match) {
        return parseInt(match[1]);
    }
    return 1; // 默认1代
}

// 更新伴侣信息显示
function updateCompanionInfo(elementId, companion) {
    const element = document.getElementById(elementId);
    if (!companion) {
        element.innerHTML = '<p>未选择</p>';
        return;
    }
    
    element.innerHTML = `
        <p>名称: ${companion.name}</p>
        <p>品阶: <span style="color: ${companionRarities[companion.rarity].color}">${companionRarities[companion.rarity].name}</span></p>
        <p>评分: ${companion.score}</p>
        <p>天赋数量: ${companion.talents.length}</p>
        <p>进阶等级: +${companion.advanceLevel || 0}</p>
    `;
}

// 合成伴侣
function combineCompanions() {
    const mainId = document.getElementById('mainCompanionSelect').value;
    const secondaryId = document.getElementById('secondaryCompanionSelect').value;
    
    if (!mainId || !secondaryId || mainId === secondaryId) {
        logAction('请选择不同的主副伴侣', 'error');
        return;
    }
    
    const mainCompanion = player.companions.find(c => c.id === mainId);
    const secondaryCompanion = player.companions.find(c => c.id === secondaryId);
     // 检查伴侣是否在探险中
    if (mainCompanion && mainCompanion.onExpedition) {
        logAction(`${mainCompanion.name}正在探险中，无法合成！`, "error");
        return;
    }
    
    if (secondaryCompanion && secondaryCompanion.onExpedition) {
        logAction(`${secondaryCompanion.name}正在探险中，无法合成！`, "error");
        return;
    }
    if (!mainCompanion || !secondaryCompanion) {
        logAction('选择的伴侣不存在', 'error');
        return;
    }


    // 计算新一代数
    const mainGen = getCompanionGeneration(mainCompanion);
    const secondaryGen = getCompanionGeneration(secondaryCompanion);
    const newGen = Math.max(mainGen, secondaryGen) + 1;
    
    // 随机选择新名字（主或副的名字 + 代数）
    const newName = Math.random() > 0.5 ? 
        `${mainCompanion.name.replace(/ \d+代$/, '')} ${newGen}代` : 
        `${secondaryCompanion.name.replace(/ \d+代$/, '')} ${newGen}代`;
    
    // 计算天赋数量
    const totalTalents = mainCompanion.talents.length + secondaryCompanion.talents.length;
    let newTalentCount;
    const rand = Math.random();
    
    if (rand < 0.80) {
        // 80% 概率：1-50%
        newTalentCount = Math.floor(Math.random() * (totalTalents * 0.5) + totalTalents * 0.2);
    } else if (rand < 0.97) {
        // 18% 概率：50-75%
        newTalentCount = Math.floor(Math.random() * (totalTalents * 0.25) + totalTalents * 0.5);
    } else {
        // 2% 概率：75-100%
        newTalentCount = Math.floor(Math.random() * (totalTalents * 0.25) + totalTalents * 0.75);
    }
    newTalentCount = Math.max(1, newTalentCount); // 至少1个天赋
    
    // 计算新评分（基于主副评分范围，上下浮动30%）
    const minScore = Math.min(mainCompanion.score, secondaryCompanion.score);
    const maxScore = Math.max(mainCompanion.score, secondaryCompanion.score);
    const scoreRange = maxScore * 1.3 - minScore * 0.7;
    const newScore = Math.floor(Math.random() * scoreRange + minScore * 0.7);
    
    // 生成新天赋（结合主副天赋的类型，有几率生成新类型）
    const allTalentTypes = [...mainCompanion.talents.map(t => t.type), ...secondaryCompanion.talents.map(t => t.type), ...Array.from({length: 3}, () => Math.floor(Math.random() * talentTypes.length))];
    const newTalents = [];
    
    for (let i = 0; i < newTalentCount; i++) {
        // 随机选择天赋类型（优先从主副天赋中选择）
        const type = allTalentTypes[Math.floor(Math.random() * allTalentTypes.length)];
        
        // 天赋天赋等级（基于主副天赋等级范围）
        const mainRanks = mainCompanion.talents.filter(t => t.type === type).map(t => t.rank);
        const secondaryRanks = secondaryCompanion.talents.filter(t => t.type === type).map(t => t.rank);
        const allRanks = [...mainRanks, ...secondaryRanks];
        
        let rank;
        if (allRanks.length > 0) {
            const minRank = Math.min(...allRanks);
            const maxRank = Math.max(...allRanks);
            // 上下浮动30%
            const newMin = Math.max(0, Math.floor(minRank * 0.7));
            const newMax = Math.min(8, Math.ceil(maxRank * 1.3));
            rank = Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;
        } else {
            // 如果没有相同类型的天赋，随机生成
            rank = Math.floor(Math.random() * 8); // 0-8级
        }
        
        newTalents.push({ type, rank });
    }
   const newAdvanceLevel = Math.max(
        mainCompanion.advanceLevel || 0,
        secondaryCompanion.advanceLevel || 0
    );
  
    const rarities = ['angel', 'emyyyy', 'jlyyyy'];
    const randomIndex = Math.floor(Math.random() * rarities.length);
    const selectedRarity = rarities[randomIndex];
    // 创建新伴侣
    const newCompanion = {
        id: 'comp_' + Date.now() + Math.floor(Math.random() * 1000),
        name: newName,
        rarity: selectedRarity,// 合成后为天使品质
        talents: newTalents,
        score: Math.min(50000, newScore), // 天使品质上限更高
        locked: false,
        advanceLevel: newAdvanceLevel,
       qualityMultiplier: qualityMultiplier // 添加品质加成
    };
    
    // 移除主副伴侣
    player.companions = player.companions.filter(c => c.id !== mainId && c.id !== secondaryId);
    
    // 如果装备的是被合成的伴侣，取消装备
    if (player.equippedCompanionId === mainId || player.equippedCompanionId === secondaryId) {
        player.equippedCompanionId = null;
    }
    
    // 添加新伴侣
    player.companions.push(newCompanion);
    
    // 提示信息
   logAction(`成功合成${newGen}代特殊伴侣：${newName}（保留最高进阶等级${newAdvanceLevel}）`, 'success');
    
    // 更新显示
    updateCompanionDisplay();
    closeCombinePanel();
}
// 计算伴侣天赋加成（需要整合到属性计算中）
function getCompanionBonuses() {
    if (!player.equippedCompanionId) return {
        attackMultiplier: 1,
        critDamageMultiplier: 1,
        healthMultiplier: 1,
        allStatsMultiplier: 1,
        combo: 0,
        critRateMultiplier: 1
    };
    
    const companion = player.companions.find(c => c.id === player.equippedCompanionId);
    if (!companion) return {
        attackMultiplier: 1,
        critDamageMultiplier: 1,
        healthMultiplier: 1,
        allStatsMultiplier: 1,
        combo: 0,
        critRateMultiplier: 1
    };
    
    // 基础加成
    let bonuses = {
        attackMultiplier: 1,
        critDamageMultiplier: 1,
        healthMultiplier: 1,
        allStatsMultiplier: 1,
        combo: 0,
        critRateMultiplier: 1
    };
    
    
    const effectiveScore = Math.min(companion.score, 50000);
    
    // 应用天赋，最多25个
    const maxTalents = 25;
    const effectiveTalents = companion.talents.slice(0, maxTalents);
    
    effectiveTalents.forEach(talent => {
        const rank = talent.rank;
        const type = talentTypes[talent.type];
        const baseMultiplier = companionRarities[companion.rarity].upgradeMultiplier;
        const scoreDivided = Math.floor(effectiveScore / 100);
        const qualityMultiplier = (scoreDivided + baseMultiplier) * player.companionLevel;
        const advanceMultiplier = 1 + (companion.advanceLevel * 1);
        switch (talent.type) {
            case 0: // 攻击
                bonuses.attackMultiplier += (type.base + type.perLevel * rank) * (1+qualityMultiplier*0.01) * advanceMultiplier;
                break;
            case 1: // 爆伤
                bonuses.critDamageMultiplier += (type.base + type.perLevel * rank) *  (1+qualityMultiplier*0.01)  * advanceMultiplier;
                break;
            case 2: // 生命
                bonuses.healthMultiplier += (type.base + type.perLevel * rank) *  (1+qualityMultiplier*0.01)  * advanceMultiplier;
                break;
            case 3: // 全属性
                bonuses.allStatsMultiplier += (type.base + type.perLevel * rank) *  (1+qualityMultiplier*0.01)  * advanceMultiplier;
                break;
            case 4: // 连击
                bonuses.combo += (type.base + type.perLevel * rank) * 2 * advanceMultiplier ;
                break;
            case 5: // 暴击率
                bonuses.critRateMultiplier += (type.base + type.perLevel * rank) *  (1+qualityMultiplier*0.01)  * (1+advanceMultiplier*0.1) ;
                break;
        }
    });
    
    // 全属性加成应用到攻击和爆伤
    bonuses.attackMultiplier += bonuses.allStatsMultiplier;
    bonuses.critDamageMultiplier += bonuses.allStatsMultiplier;
    
    return bonuses;
}


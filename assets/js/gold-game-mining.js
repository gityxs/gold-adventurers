// 无尽挖矿
        function toggleMiningUI() {
       if (player.reincarnationCount < 1500) {
        alert("需要达到1500转才能开启无尽挖矿！");
        return;
    }
            const ui = document.getElementById('miningUI');
            if (ui.style.display === 'block') {
                ui.style.display = 'none';
            } else {
                ui.style.display = 'block';
                updateMiningUI();
                calculateOfflineMining();
            }
        }

        const MINING_POWER_MAX_LEVEL = 10000;
        const MINING_STAMINA_MAX_LEVEL = 100;
        const MINING_DETECTOR_MAX_LEVEL = 30;

        function getMiningPowerUpgradeCost(level) {
            const lv = Math.max(1, Math.floor(Number(level) || 1));
            const stageMul = lv > 100 ? Math.pow(10, Math.floor((lv - 1) / 100)) : 1;
            return Math.floor(1000 * lv * stageMul);
        }

        function getMiningStaminaUpgradeCost(level) {
            const lv = Math.max(1, Math.floor(Number(level) || 1));
            if (lv <= 10) return Math.floor(10000 * lv);
            return Math.floor(100000 * Math.pow(20, lv - 10));
        }

        function getMiningDetectorUpgradeCost(level) {
            const lv = Math.max(1, Math.floor(Number(level) || 1));
            if (lv <= 10) return Math.floor(50000 * lv);
            return Math.floor(500000 * Math.pow(100, lv - 10));
        }

        function formatMiningCost(cost) {
            if (!Number.isFinite(cost)) return '∞';
            return Math.floor(cost).toLocaleString();
        }

        function getMiningComboMultiplier() {
            const streak = Math.max(0, Math.floor(Number(player.mining && player.mining.comboStreak) || 0));
            return 1 + Math.min(1.5, streak * 0.01);
        }

        function ensureMiningFunState() {
            if (typeof player.mining.comboStreak !== 'number') player.mining.comboStreak = 0;
            if (typeof player.mining.comboBest !== 'number') player.mining.comboBest = 0;
            if (typeof player.mining.resonanceTurns !== 'number') player.mining.resonanceTurns = 0;
            if (typeof player.mining.resonanceBonus !== 'number') player.mining.resonanceBonus = 0;
            if (typeof player.mining.chestFragments !== 'number') player.mining.chestFragments = 0;
            if (typeof player.mining.chestOpened !== 'number') player.mining.chestOpened = 0;
        }

        function rollMiningFunEvents(isOffline = false, summary = null) {
            ensureMiningFunState();
            if (player.mining.resonanceTurns > 0) player.mining.resonanceTurns -= 1;
            if (player.mining.resonanceTurns <= 0) player.mining.resonanceBonus = 0;

            const detectorLv = Math.max(1, Number(player.mining.upgrades && player.mining.upgrades.detector) || 1);
            const resonanceChance = Math.min(0.06, 0.008 + detectorLv * 0.0006);
            if (player.mining.resonanceTurns <= 0 && Math.random() < resonanceChance) {
                player.mining.resonanceTurns = 20;
                player.mining.resonanceBonus = Math.min(0.2, 0.08 + detectorLv * 0.0015);
                if (summary) summary.resonanceCount = (summary.resonanceCount || 0) + 1;
                if (!isOffline) {
                    addMiningNotification(`矿脉共鸣触发！接下来20次挖掘宝石率提升 ${(player.mining.resonanceBonus * 100).toFixed(1)}%`, 'gem');
                }
            }

            const powerLv = Math.max(1, Number(player.mining.upgrades && player.mining.upgrades.power) || 1);
            const fragChance = Math.min(0.25, 0.06 + powerLv * 0.00005);
            if (Math.random() < fragChance) {
                player.mining.chestFragments += 1;
                if (summary) summary.fragments = (summary.fragments || 0) + 1;
                if (!isOffline) addMiningNotification(`获得矿脉宝箱碎片 1 个（${player.mining.chestFragments}/10）`, 'info');
            }

            while (player.mining.chestFragments >= 10) {
                player.mining.chestFragments -= 10;
                player.mining.chestOpened += 1;
                const chestOre = Math.max(1, Math.floor(player.mining.power * (30 + Math.random() * 70)));
                player.mining.ore += chestOre;
                const chestGem = !!findGem(player.mining.depth, detectorLv + 5, isOffline);
                if (summary) {
                    summary.chests = (summary.chests || 0) + 1;
                    summary.chestOre = (summary.chestOre || 0) + chestOre;
                    if (chestGem) summary.chestGem = (summary.chestGem || 0) + 1;
                }
                if (!isOffline) {
                    addMiningNotification(`开启矿脉宝箱！获得${chestOre}矿石${chestGem ? '、额外宝石' : ''}`, 'gem');
                }
            }
        }

        function getMiningVeinSurgeChance() {
            const powerLv = Math.max(1, Number(player.mining && player.mining.upgrades ? player.mining.upgrades.power : 1) || 1);
            const detectorLv = Math.max(1, Number(player.mining && player.mining.upgrades ? player.mining.upgrades.detector : 1) || 1);
            return Math.min(0.35, 0.03 + detectorLv * 0.002 + powerLv * 0.0001);
        }

        function triggerMiningVeinSurge(isOffline = false) {
            const fm = getMiningFactionModifiers();
            const chance = getMiningVeinSurgeChance() * (fm.faction === 'blaster' ? 1.12 : 1);
            if (Math.random() >= chance) return { triggered: false, bonusOre: 0, bonusGem: false };
            const bonusOre = Math.max(1, Math.floor(player.mining.power * (2 + Math.random() * 3) * fm.oreMul));
            player.mining.ore += bonusOre;
            const bonusGem = !!findGem(player.mining.depth, player.mining.upgrades.detector + 3, isOffline);
            if (!isOffline) {
                addMiningNotification(`矿脉暴击触发！额外获得${bonusOre}矿石${bonusGem ? '，并额外发现宝石' : ''}！`, 'success');
            }
            gainMiningFactionXP('risk', 2);
            return { triggered: true, bonusOre, bonusGem };
        }

        function getMiningMaxStamina() {
            return player.mining.baseMaxStamina + ((player.mining.staminaUpgradeLevel - 1) * 10);
        }

        function updateMiningUI() {
    ensureMiningEngagementState();
    const maxStamina = getMiningMaxStamina();
    const staminaPercent = (player.mining.stamina / maxStamina) * 100;
    
    // 更新基础信息
    document.getElementById('miningDepth').textContent = player.mining.depth.toLocaleString() + ' 米';
    document.getElementById('miningPower').textContent = `${player.mining.power} (连击x${getMiningComboMultiplier().toFixed(2)})`;
    const miningPowerLv = Math.max(1, Math.floor(Number(player.mining.upgrades && player.mining.upgrades.power) || 1));
    const powerBonusMul = 1 + Math.min(999, (miningPowerLv - 1) * (999 / 9999));
    const miningPowerBonusText = document.getElementById('miningPowerBonusText');
    if (miningPowerBonusText) {
        miningPowerBonusText.textContent = `奖励加成 x${powerBonusMul.toFixed(1)}（10000级封顶 x1000.0）`;
    }
    document.getElementById('miningMaxStamina').textContent = maxStamina;
    
    // 更新体力条
    document.getElementById('miningStaminaBar').style.width = staminaPercent + '%';
    document.getElementById('miningStaminaText').textContent = 
        Math.floor(player.mining.stamina) + ' / ' + maxStamina;
    
    // 确保所有宝石属性都存在
    for (let i = 0; i < miningGemsConfig.length; i++) {
        const gem = miningGemsConfig[i];
        if (player.mining.gems[gem.key] === undefined) {
            player.mining.gems[gem.key] = 0;
        }
    }
    
    // 更新宝石数量显示
    document.getElementById('miningRuby').textContent = player.mining.gems.ruby || 0;
    document.getElementById('miningSapphire').textContent = player.mining.gems.sapphire || 0;
    document.getElementById('miningEmerald').textContent = player.mining.gems.emerald || 0;
    document.getElementById('miningAmethyst').textContent = player.mining.gems.amethyst || 0;
    document.getElementById('miningDiamond').textContent = player.mining.gems.diamond || 0;
    document.getElementById('miningMysteryGem').textContent = player.mining.gems.mysteryGem || 0;
    document.getElementById('miningCultivationGem').textContent = player.mining.gems.cultivationGem || 0;
    document.getElementById('miningOre').textContent = player.mining.ore;
    
    // 更新药水数量
    document.getElementById('miningPotionCount').textContent = player.mining.potions;
    
    // 更新升级信息
    document.getElementById('miningPowerLevel').textContent = player.mining.upgrades.power;
    document.getElementById('miningStaminaLevel').textContent = player.mining.staminaUpgradeLevel;
    document.getElementById('miningDetectorLevel').textContent = player.mining.upgrades.detector;
    
    // 更新按钮状态
    const powerCost = getMiningPowerUpgradeCost(player.mining.upgrades.power);
    const staminaCost = getMiningStaminaUpgradeCost(player.mining.staminaUpgradeLevel);
    const detectorCost = getMiningDetectorUpgradeCost(player.mining.upgrades.detector);
    document.getElementById('upgradeMiningPowerBtn').textContent = `升级 (${formatMiningCost(powerCost)})`;
    document.getElementById('upgradeMiningStaminaBtn').textContent = `升级 (${formatMiningCost(staminaCost)})`;
    document.getElementById('upgradeMiningDetectorBtn').textContent = `升级 (${formatMiningCost(detectorCost)})`;
    
    document.getElementById('upgradeMiningPowerBtn').disabled = player.mining.upgrades.power >= MINING_POWER_MAX_LEVEL;
    document.getElementById('upgradeMiningStaminaBtn').disabled = player.mining.staminaUpgradeLevel >= MINING_STAMINA_MAX_LEVEL;
    document.getElementById('upgradeMiningDetectorBtn').disabled = player.mining.upgrades.detector >= MINING_DETECTOR_MAX_LEVEL;

    const engagement = player.mining.engagement;
    const heatPercent = Math.max(0, Math.min(100, engagement.heat));
    const miningHeatFill = document.getElementById('miningHeatFill');
    if (miningHeatFill) {
        miningHeatFill.style.width = `${heatPercent}%`;
        miningHeatFill.classList.toggle('heat-full', heatPercent >= 100);
    }
    const miningHeatText = document.getElementById('miningHeatText');
    if (miningHeatText) miningHeatText.textContent = `${engagement.heat} / 100`;
    const miningSurveyText = document.getElementById('miningSurveyText');
    if (miningSurveyText) miningSurveyText.textContent = `专注 ${engagement.focus} | 冷却 ${engagement.surveyCooldown} | 勘探层数 ${engagement.surveyStacks}`;
    const skillBtn = document.getElementById('miningSkillBtn');
    if (skillBtn) {
        const ready = engagement.heat >= 100;
        skillBtn.disabled = !ready;
        skillBtn.classList.toggle('skill-ready', ready);
    }
    const surveyBtn = document.getElementById('miningSurveyBtn');
    if (surveyBtn) surveyBtn.disabled = engagement.surveyCooldown > 0 || engagement.focus < 20;

    const eventBoard = document.getElementById('miningEventBoard');
    const eventText = document.getElementById('miningEventText');
    const eventSafeBtn = document.getElementById('miningEventSafeBtn');
    const eventRiskBtn = document.getElementById('miningEventRiskBtn');
    if (engagement.pendingEvent) {
        if (eventBoard) eventBoard.classList.add('event-active');
        if (eventText) eventText.textContent = `${engagement.pendingEvent.title}：${engagement.pendingEvent.desc}`;
        if (eventSafeBtn) eventSafeBtn.disabled = false;
        if (eventRiskBtn) eventRiskBtn.disabled = false;
    } else {
        if (eventBoard) eventBoard.classList.remove('event-active');
        const cd = engagement.eventCooldown || 0;
        if (eventText) eventText.textContent = `暂无事件，继续深入矿道可触发新机缘。${cd > 0 ? `（下一轮事件冷却 ${cd}）` : ''}`;
        if (eventSafeBtn) eventSafeBtn.disabled = true;
        if (eventRiskBtn) eventRiskBtn.disabled = true;
    }
    const riskText = document.getElementById('miningRiskText');
    if (riskText) {
        const merchant = engagement.merchantOfferType
            ? ` | 商人货单：${engagement.merchantOfferType}（${formatMiningCost(engagement.merchantOfferCost)}）`
            : '';
        riskText.textContent = `矿井风险 ${engagement.riskMeter} | 矿灯充能 ${engagement.scanCharge} | 扫描剩余 ${engagement.scanStacks}${merchant}`;
    }
    const factionText = document.getElementById('miningFactionText');
    const factionMap = {
        conservative: '保守派',
        blaster: '爆破派',
        scout: '勘探派'
    };
    const faction = engagement.faction || 'conservative';
    const fLevel = getMiningFactionLevel(faction);
    const fXP = engagement.factionXP && engagement.factionXP[faction] ? engagement.factionXP[faction] : 0;
    const nextXP = fLevel >= 20 ? '已满级' : `${fLevel * 120}`;
    if (factionText) factionText.textContent = `当前：${factionMap[faction]} Lv.${fLevel}（熟练度 ${fXP} / ${nextXP}）`;
    const fButtons = {
        conservative: document.getElementById('miningFactionConservative'),
        blaster: document.getElementById('miningFactionBlaster'),
        scout: document.getElementById('miningFactionScout')
    };
    Object.keys(fButtons).forEach((k) => {
        if (fButtons[k]) fButtons[k].classList.toggle('active', faction === k);
    });
    const stabilizeBtn = document.getElementById('miningStabilizeBtn');
    if (stabilizeBtn) stabilizeBtn.disabled = engagement.stabilizeCooldown > 0 || engagement.focus < 15;
    const scanBtn = document.getElementById('miningScanBtn');
    if (scanBtn) scanBtn.disabled = engagement.scanCharge < 60;
    const gameplaySummary = document.getElementById('miningGameplaySummary');
    if (gameplaySummary) {
        gameplaySummary.textContent =
            `耐久 ${engagement.drillDurability}/100 | 超频 ${engagement.overdriveTicks} | 幸运矿脉 ${engagement.luckyVeinTicks} | 遗迹碎片 ${engagement.relicShards}/8 | ` +
            `矿车载货 ${formatMiningCost(engagement.cartOre)}${engagement.cartCooldown > 0 ? `（冷却${engagement.cartCooldown}）` : ''} | 悬赏 ${engagement.bountyProgress}/${engagement.bountyTarget}`;
    }
    const overdriveBtn = document.getElementById('miningOverdriveBtn');
    if (overdriveBtn) overdriveBtn.disabled = engagement.heat < 80;
    const repairBtn = document.getElementById('miningRepairBtn');
    if (repairBtn) repairBtn.disabled = engagement.drillDurability >= 100;
    const dispatchBtn = document.getElementById('miningDispatchCartBtn');
    if (dispatchBtn) dispatchBtn.disabled = engagement.cartOre < 5000 || engagement.cartCooldown > 0;
    const merchantBtn = document.getElementById('miningMerchantBtn');
    if (merchantBtn) merchantBtn.disabled = !engagement.merchantOfferType || engagement.merchantOfferCost <= 0;
    const bountyBtn = document.getElementById('miningBountyBtn');
    if (bountyBtn) bountyBtn.disabled = !(engagement.bountyProgress >= engagement.bountyTarget && !engagement.bountyClaimed);
    const hudPressure = document.getElementById('miningHudPressure');
    if (hudPressure) hudPressure.textContent = `${engagement.cavePressure}`;
    const hudBeacon = document.getElementById('miningHudBeacon');
    if (hudBeacon) hudBeacon.textContent = `${engagement.beaconCharge}/100`;
    const hudRelic = document.getElementById('miningHudRelic');
    if (hudRelic) hudRelic.textContent = `${engagement.relicBlessTicks}`;
    const hudMerchant = document.getElementById('miningHudMerchant');
    if (hudMerchant) hudMerchant.textContent = engagement.merchantOfferType ? `${engagement.merchantOfferType}:${formatMiningCost(engagement.merchantOfferCost)}` : '无';
    const qteBox = document.getElementById('miningQteBox');
    const qteText = document.getElementById('miningQteText');
    const qteBtn = document.getElementById('miningQteBtn');
    if (engagement.qte && engagement.qte.active) {
        if (qteBox) qteBox.classList.add('active');
        if (qteText) qteText.textContent = `倒计时 ${engagement.qte.timeLeft} | 进度 ${engagement.qte.hits}/${engagement.qte.required} | 成功奖励 ${formatMiningCost(engagement.qte.rewardOre)}矿石`;
        if (qteBtn) qteBtn.disabled = false;
    } else {
        if (qteBox) qteBox.classList.remove('active');
        if (qteText) qteText.textContent = '当前矿道稳定，暂无灾变。';
        if (qteBtn) qteBtn.disabled = true;
    }

    const riftBox = document.getElementById('miningRiftBox');
    const riftClues = document.getElementById('miningRiftClues');
    const riftInput = document.getElementById('miningRiftCodeInput');
    const riftSubmit = document.getElementById('miningRiftSubmitBtn');
    const riftTimer = document.getElementById('miningRiftTimer');
    if (engagement.riftPuzzle && engagement.riftPuzzle.active) {
        if (riftBox) riftBox.classList.add('active');
        const clueLines = (engagement.riftPuzzle.clues || []).map((c) => `· ${c}`).join('<br/>');
        if (riftClues) riftClues.innerHTML = clueLines || '观察符文刻印…';
        if (riftTimer) {
            riftTimer.textContent = `剩余 ${engagement.riftPuzzle.timeLeft} 次挖掘前裂隙闭合（超时关闭，不扣矿石）`;
        }
        if (riftInput) riftInput.disabled = false;
        if (riftSubmit) riftSubmit.disabled = false;
    } else {
        if (riftBox) riftBox.classList.remove('active');
        if (riftClues) riftClues.textContent = '暂无裂隙波动。洞压波动时可能显现刻印锁。';
        if (riftTimer) riftTimer.textContent = '';
        if (riftInput) {
            riftInput.value = '';
            riftInput.disabled = true;
        }
        if (riftSubmit) riftSubmit.disabled = true;
    }

    const contract = engagement.contract || {};
    const contractDesc = document.getElementById('miningContractDesc');
    const contractProgress = document.getElementById('miningContractProgress');
    const contractReward = document.getElementById('miningContractReward');
    const claimBtn = document.getElementById('miningClaimContractBtn');
    if (contractDesc) contractDesc.textContent = `目标：累计挖掘 ${contract.target || 0} 次（手动技能与勘探可显著提速）`;
    if (contractProgress) contractProgress.textContent = `进度 ${contract.progress || 0} / ${contract.target || 0}`;
    if (contractReward) contractReward.textContent = `奖励：${formatMiningCost(contract.rewardOre || 0)}矿石${contract.rewardGemRoll ? ' + 1次宝石判定' : ''}`;
    if (claimBtn) claimBtn.disabled = !contract.done || !!contract.claimed;
    const contractBox = document.querySelector('#miningChallengePage .mining-contract-box');
    if (contractBox) {
        contractBox.classList.toggle('contract-done', !!contract.done && !contract.claimed);
    }
    
    // 更新挖矿按钮
    const miningBtn = document.getElementById('miningToggleBtn');
    miningBtn.textContent = player.mining.isMining ? '停止自动挖矿' : '开始自动挖矿';
    miningBtn.style.background = player.mining.isMining ? 
        'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)' : 
        'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    
    // 更新自动药水按钮
    const autoPotionBtn = document.getElementById('autoPotionToggleBtn');
    autoPotionBtn.textContent = player.mining.autoPotion ? '关闭自动药水' : '开启自动药水';
    autoPotionBtn.style.background = player.mining.autoPotion ? 
        'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)' : 
        'linear-gradient(135deg, #48cae4 0%, #0096c7 100%)';
    
    // 更新通知显示
    updateMiningNotifications();
}
      function toggleAutoPotion() {
    player.mining.autoPotion = !player.mining.autoPotion;
    
    // 确保阈值已正确初始化
    if (player.mining.autoPotionThreshold === undefined) {
        player.mining.autoPotionThreshold = 5;
    }
    
    if (player.mining.autoPotion) {
        addMiningNotification('已开启自动药水，体力低于' + player.mining.autoPotionThreshold + '时自动使用药水');
    } else {
        addMiningNotification('已关闭自动药水');
    }
    
    updateMiningUI();
    saveGame();
}
  function checkAutoPotion() {
    if (!player.mining.autoPotion || player.mining.potions === 0) {
        return false;
    }
    
    const maxStamina = getMiningMaxStamina();
    
    // 确保阈值已初始化
    const threshold = player.mining.autoPotionThreshold || 5;
    
    // 检查体力是否低于阈值
    if (player.mining.stamina <= threshold && 
        player.mining.stamina < maxStamina) {
        
        // 使用药水
        player.mining.potions -= 1;
        player.mining.stamina = maxStamina;
        
        addMiningNotification('自动使用体力药水，恢复全部体力！', 'gem');
        return true;
    }
    
    return false;
}
function setAutoPotionThreshold(threshold) {
    if (threshold >= 1 && threshold <= 50) { // 限制阈值范围
        player.mining.autoPotionThreshold = threshold;
        if (player.mining.autoPotion) {
            addMiningNotification(`已设置自动药水阈值为${threshold}点体力`);
        }
        updateMiningUI();
        saveGame();
    }
}
function adjustPotionThreshold() {
    const currentThreshold = player.mining.autoPotionThreshold || 5;
    const newThreshold = prompt(`请输入自动使用药水的体力阈值(1-50)`, currentThreshold);
    
    if (newThreshold !== null) {
        const num = parseInt(newThreshold);
        if (!isNaN(num) && num >= 1 && num <= 50) {
            setAutoPotionThreshold(num);
        } else {
            alert('请输入1到50之间的数字！');
        }
    }
}
        function addMiningNotification(message, type = 'info') {
            const now = new Date();
            const timestamp = now.toLocaleTimeString();
            
            player.mining.notifications.unshift({
                message: message,
                type: type,
                timestamp: timestamp
            });
            
            // 限制通知数量，防止数组无限增长导致内存增长
            if (player.mining.notifications.length > 20) {
                player.mining.notifications.pop();
            }
            
            // 仅当挖矿界面显示时才更新 DOM，避免后台挖矿时频繁操作 DOM 导致卡顿
            const miningUI = document.getElementById('miningUI');
            if (miningUI && miningUI.style.display === 'block') {
                updateMiningNotifications();
            }
        }

        function updateMiningNotifications() {
            const container = document.getElementById('miningNotifications');
            container.innerHTML = '';
            
            player.mining.notifications.forEach(notif => {
                const div = document.createElement('div');
                div.className = 'mining-notification';
                div.style.borderLeftColor = notif.type === 'gem' ? '#4CAF50' : 
                                          notif.type === 'warning' ? '#ff6b6b' : '#4CAF50';
                div.innerHTML = `[${notif.timestamp}] ${notif.message}`;
                container.appendChild(div);
            });
        }

        function clearMiningNotifications() {
            player.mining.notifications = [];
            updateMiningNotifications();
        }

        function toggleMining() {
            player.mining.isMining = !player.mining.isMining;
            
            if (player.mining.isMining) {
                addMiningNotification('开始自动挖矿！');
                // 不在此处创建 setInterval，避免与 initMiningSystem 的定时器重复导致泄漏；由 initMiningSystem 的单一定时器驱动
            } else {
                addMiningNotification('停止自动挖矿！');
                player.mining.comboStreak = 0;
            }
            
            updateMiningUI();
            saveGame();
        }function findGem(depth, detectorLevel, isOffline = false) {
        const resonanceBonus = Math.max(0, Number(player.mining && player.mining.resonanceBonus) || 0);
        const fm = getMiningFactionModifiers();
        const gemChance = Math.min(0.9, 0.02 + (detectorLevel * 0.005) + resonanceBonus + fm.gemChanceBonus);
        
        // 先检查是否发现宝石
        if (Math.random() < gemChance) {
            const gemRoll = Math.random();
            
            // 检查翡翠属性是否存在
            if (player.mining.gems.emerald === undefined) {
                player.mining.gems.emerald = 0;
            }
            
            // 收集符合条件的宝石
            const availableGems = [];
            let totalRarity = 0;
            
            for (let i = 0; i < miningGemsConfig.length; i++) {
                const gem = miningGemsConfig[i];
                if (depth >= gem.minDepth) {
                    availableGems.push(gem);
                    totalRarity += gem.rarity;
                }
            }
            
            let selectedGem = null;
            if (availableGems.length === 0) {
                selectedGem = miningGemsConfig[0]; // 红宝石
            } else {
                // 使用累积概率选择宝石
                let cumulative = 0;
                for (let i = 0; i < availableGems.length; i++) {
                    const gem = availableGems[i];
                    cumulative += gem.rarity / totalRarity; // 标准化概率
                    if (gemRoll <= cumulative) {
                        selectedGem = gem;
                        break;
                    }
                }
                if (!selectedGem) {
                    selectedGem = availableGems[availableGems.length - 1];
                }
            }
            
            if (selectedGem) {
                if (player.mining.gems[selectedGem.key] === undefined) {
                    player.mining.gems[selectedGem.key] = 0;
                }
                player.mining.gems[selectedGem.key] += 1;
                const prefix = isOffline ? '离线' : '';
                addMiningNotification(`${prefix}发现 ${selectedGem.name}！`, 'gem');
                gainMiningFactionXP('gem', 2);
                return true;
            }
        }
        
        return false;
    }


      function mine() {
    if (!player.mining.isMining) return;
    ensureMiningEngagementState();
    const factionMods = getMiningFactionModifiers();
    
    // 先检查是否需要自动使用药水
    if (checkAutoPotion()) {
        updateMiningUI();
        saveGame();
    }
    
    // 检查体力
    if (player.mining.stamina < 1) {
        player.mining.isMining = false;
        player.mining.comboStreak = 0;
        addMiningNotification('体力不足，自动挖矿停止！请使用体力药水恢复体力。', 'warning');
        updateMiningUI();
        return;
    }
    
    // 消耗体力
    player.mining.stamina -= 1;
    
    // 增加深度
    const depthGain = player.mining.power;
    player.mining.depth += depthGain;
    
    // 获得矿石
    const engagement = player.mining.engagement;
    if (engagement.surveyCooldown > 0) engagement.surveyCooldown -= 1;
    if (engagement.stabilizeCooldown > 0) engagement.stabilizeCooldown -= 1;
    engagement.focus = Math.min(100, engagement.focus + 1);
    engagement.heat = Math.min(100, engagement.heat + Math.max(1, Math.floor(4 * factionMods.heatGainMul)));
    engagement.scanCharge = Math.min(100, engagement.scanCharge + Math.max(1, Math.floor(3 * factionMods.scanChargeMul)));
    engagement.beaconCharge = Math.min(100, engagement.beaconCharge + 2);
    engagement.riskMeter = Math.min(100, engagement.riskMeter + Math.max(1, Math.floor((Math.random() < 0.5 ? 1 : 2) * factionMods.riskGrowthMul)));
    // 洞压随挖掘缓慢累积（否则仅超频/维修会改洞压，矿难QTE与裂隙密码几乎永不触发）
    if (Math.random() < 0.12) {
        engagement.cavePressure = Math.min(100, engagement.cavePressure + 1);
    }
    engagement.drillDurability = Math.max(0, engagement.drillDurability - 1);
    engagement.bountyProgress = Math.min(engagement.bountyTarget, (engagement.bountyProgress || 0) + 1);
    if (engagement.bountyProgress >= engagement.bountyTarget) engagement.bountyClaimed = false;
    maybeSpawnMiningChoiceEvent(false, null);
    player.mining.comboStreak += 1;
    player.mining.comboBest = Math.max(player.mining.comboBest || 0, player.mining.comboStreak);
    const comboMul = getMiningComboMultiplier();
    const surveyMul = engagement.surveyStacks > 0 ? engagement.surveyBonus : 1;
    if (engagement.surveyStacks > 0) engagement.surveyStacks -= 1;
    const scanMul = engagement.scanStacks > 0 ? engagement.scanBonus : 1;
    if (engagement.scanStacks > 0) engagement.scanStacks -= 1;
    const riskMul = engagement.riskMeter >= 80 ? 0.7 : engagement.riskMeter >= 60 ? 0.85 : 1;
    const durabilityMul = engagement.drillDurability <= 20 ? 0.6 : engagement.drillDurability <= 40 ? 0.82 : 1;
    const luckyMul = engagement.luckyVeinTicks > 0 ? 1.35 : 1;
    const overdriveMul = engagement.overdriveTicks > 0 ? 1.75 : 1;
    if (engagement.overdriveTicks > 0) engagement.overdriveTicks -= 1;
    const oreGain = Math.floor(player.mining.power * (0.2 + Math.random() * 0.5) * comboMul * surveyMul * scanMul * riskMul * durabilityMul * luckyMul * overdriveMul * factionMods.oreMul);
    player.mining.ore += oreGain;
    
    // 宝石发现逻辑
    findGem(player.mining.depth, player.mining.upgrades.detector, false);
    // 新玩法：矿脉暴击，概率触发额外矿石与额外宝石机会
    triggerMiningVeinSurge(false);
    if (surveyMul > 1 && Math.random() < 0.22) {
        findGem(player.mining.depth, player.mining.upgrades.detector + 2, false);
    }
    rollMiningRandomEvents(false, null);
    rollMiningMegaEvents(false, null);
    processMiningQTEProgress(false, null);
    processMiningRiftPuzzleProgress(false, null);
    rollMiningFunEvents(false, null);

    const c = engagement.contract;
    if (c && !c.claimed) {
        c.progress = Math.min(c.target, (c.progress || 0) + 1);
        if (c.progress >= c.target && !c.done) {
            c.done = true;
            addMiningNotification('矿工委托已完成！去「矿工委托」页领取奖励。', 'gem');
        }
    }
    checkTreasureDrop();
        if (Math.random() < 0.5) {
           dropMagicMaterial();
        }
    // 每挖掘100次自动保存
    if (player.mining.depth % 100 === 0) {
        saveGame();
    }
    
    // 仅当挖矿界面打开时更新 UI，减少后台挖矿时的 DOM 操作与重绘，避免越玩越卡
    const miningUI = document.getElementById('miningUI');
    if (miningUI && miningUI.style.display === 'block') {
        updateMiningUI();
    }
}

        function useMiningPotion() {
            if (player.mining.potions > 0 && player.mining.stamina < getMiningMaxStamina()) {
                player.mining.potions -= 1;
                player.mining.stamina = getMiningMaxStamina();
                addMiningNotification('使用体力药水，恢复全部体力！');
          if (player.mining.autoPotion) {
             addMiningNotification('已自动关闭自动药水功能');
             player.mining.autoPotion = false;
         }
                updateMiningUI();
                saveGame();
            }
        }

        function buyMiningPotion() {
            const cost = 1;
            if (player.items.primaryGemq >= cost) {
                player.items.primaryGemq -= cost;
                player.mining.potions += 1;
                addMiningNotification(`花费${cost}宝藏金币购买1个体力药水`);
                updateMiningUI();
                saveGame();
            } else {
                addMiningNotification('宝藏金币不足，无法购买药水', 'warning');
            }
        }

        function upgradeMiningPower() {
            if (player.mining.upgrades.power >= MINING_POWER_MAX_LEVEL) {
                addMiningNotification(`镐头已达到最大等级(${MINING_POWER_MAX_LEVEL}级)！`, 'warning');
                return;
            }
            
            const cost = getMiningPowerUpgradeCost(player.mining.upgrades.power);
            if (player.mining.ore >= cost) {
                player.mining.ore -= cost;
                player.mining.power += 1;
                player.mining.upgrades.power += 1;
                addMiningNotification(`升级镐头成功！当前等级: ${player.mining.upgrades.power}`);
                updateMiningUI();
                saveGame();
            } else {
                addMiningNotification(`矿石不足，需要${formatMiningCost(cost)}矿石`, 'warning');
            }
        }

        function upgradeMiningStamina() {
            if (player.mining.staminaUpgradeLevel >= MINING_STAMINA_MAX_LEVEL) {
                addMiningNotification(`体力上限已达到最大等级(${MINING_STAMINA_MAX_LEVEL}级)！`, 'warning');
                return;
            }
            
            const cost = getMiningStaminaUpgradeCost(player.mining.staminaUpgradeLevel);
            if (player.mining.ore >= cost) {
                player.mining.ore -= cost;
                
                // 保存当前体力比例
                const oldMaxStamina = getMiningMaxStamina();
                const staminaRatio = player.mining.stamina / oldMaxStamina;
                
                // 升级
                player.mining.staminaUpgradeLevel += 1;
                const newMaxStamina = getMiningMaxStamina();
                
                // 按比例恢复体力
                player.mining.stamina = Math.floor(newMaxStamina * staminaRatio);
                
                addMiningNotification(`升级体力上限成功！当前等级: ${player.mining.staminaUpgradeLevel}`);
                updateMiningUI();
                saveGame();
            } else {
                addMiningNotification(`矿石不足，需要${formatMiningCost(cost)}矿石`, 'warning');
            }
        }

        function upgradeMiningDetector() {
            if (player.mining.upgrades.detector >= MINING_DETECTOR_MAX_LEVEL) {
                addMiningNotification(`宝石探测器已达到最大等级(${MINING_DETECTOR_MAX_LEVEL}级)！`, 'warning');
                return;
            }
            
            const cost = getMiningDetectorUpgradeCost(player.mining.upgrades.detector);
            if (player.mining.ore >= cost) {
                player.mining.ore -= cost;
                player.mining.upgrades.detector += 1;
                addMiningNotification(`升级宝石探测器成功！当前等级: ${player.mining.upgrades.detector}`);
                updateMiningUI();
                saveGame();
            } else {
                addMiningNotification(`矿石不足，需要${formatMiningCost(cost)}矿石`, 'warning');
            }
        }

    function calculateOfflineMining() {
    const now = Date.now();
    const elapsed = Math.min(now - player.mining.lastUpdate, 86400000); // 最多24小时
    ensureMiningEngagementState();
    
    if (elapsed > 1000 && player.mining.isMining) {
        const seconds = Math.floor(elapsed / 1000);
        const maxStamina = getMiningMaxStamina();
        
        // 计算离线期间可以挖掘的次数
        const possibleMines = Math.min(seconds, player.mining.stamina);
        
        if (possibleMines > 0) {
            let gemsFound = 0;
            let potionsUsed = 0;
            let surgeCount = 0;
            let surgeOre = 0;
            const funSummary = { resonanceCount: 0, fragments: 0, chests: 0, chestOre: 0, chestGem: 0 };
            const eventSummary = { pendingEvents: 0, choiceOre: 0, choiceGem: 0, randomOre: 0, randomRisk: 0, randomHeat: 0, randomFragments: 0 };
            
            console.log(`开始离线挖矿: ${possibleMines}次, 当前深度: ${player.mining.depth}`);
            
            // 模拟离线挖掘
            for (let i = 0; i < possibleMines; i++) {
                // 检查是否需要自动使用药水
                if (player.mining.autoPotion && 
                    player.mining.potions > 0 && 
                    player.mining.stamina <= player.mining.autoPotionThreshold && 
                    player.mining.stamina < maxStamina) {
                    
                    player.mining.potions -= 1;
                    player.mining.stamina = maxStamina;
                    potionsUsed++;
                }
                
                // 检查体力
                if (player.mining.stamina < 1) {
                    break;
                }
                
                // 消耗体力
                player.mining.stamina -= 1;
                
                // 增加深度
                player.mining.depth += player.mining.power;
                
                // 获得矿石
                const engagement = player.mining.engagement;
                const factionMods = getMiningFactionModifiers();
                if (engagement.surveyCooldown > 0) engagement.surveyCooldown -= 1;
                if (engagement.stabilizeCooldown > 0) engagement.stabilizeCooldown -= 1;
                engagement.focus = Math.min(100, engagement.focus + 1);
                engagement.heat = Math.min(100, engagement.heat + Math.max(1, Math.floor(4 * factionMods.heatGainMul)));
                engagement.scanCharge = Math.min(100, engagement.scanCharge + Math.max(1, Math.floor(3 * factionMods.scanChargeMul)));
                engagement.beaconCharge = Math.min(100, engagement.beaconCharge + 2);
                engagement.riskMeter = Math.min(100, engagement.riskMeter + Math.max(1, Math.floor((Math.random() < 0.5 ? 1 : 2) * factionMods.riskGrowthMul)));
                if (Math.random() < 0.12) {
                    engagement.cavePressure = Math.min(100, engagement.cavePressure + 1);
                }
                engagement.drillDurability = Math.max(0, engagement.drillDurability - 1);
                engagement.bountyProgress = Math.min(engagement.bountyTarget, (engagement.bountyProgress || 0) + 1);
                if (engagement.bountyProgress >= engagement.bountyTarget) engagement.bountyClaimed = false;
                maybeSpawnMiningChoiceEvent(true, eventSummary);
                player.mining.comboStreak += 1;
                player.mining.comboBest = Math.max(player.mining.comboBest || 0, player.mining.comboStreak);
                const comboMul = getMiningComboMultiplier();
                const surveyMul = engagement.surveyStacks > 0 ? engagement.surveyBonus : 1;
                if (engagement.surveyStacks > 0) engagement.surveyStacks -= 1;
                const scanMul = engagement.scanStacks > 0 ? engagement.scanBonus : 1;
                if (engagement.scanStacks > 0) engagement.scanStacks -= 1;
                const riskMul = engagement.riskMeter >= 80 ? 0.7 : engagement.riskMeter >= 60 ? 0.85 : 1;
                const durabilityMul = engagement.drillDurability <= 20 ? 0.6 : engagement.drillDurability <= 40 ? 0.82 : 1;
                const luckyMul = engagement.luckyVeinTicks > 0 ? 1.35 : 1;
                const overdriveMul = engagement.overdriveTicks > 0 ? 1.75 : 1;
                if (engagement.overdriveTicks > 0) engagement.overdriveTicks -= 1;
                const oreGain = Math.floor(player.mining.power * (0.2 + Math.random() * 0.5) * comboMul * surveyMul * scanMul * riskMul * durabilityMul * luckyMul * overdriveMul * factionMods.oreMul);
                player.mining.ore += oreGain;
                
                // 宝石发现逻辑
                if (findGem(player.mining.depth, player.mining.upgrades.detector, true)) {
                    gemsFound++;
                }
                const surge = triggerMiningVeinSurge(true);
                if (surge.triggered) {
                    surgeCount++;
                    surgeOre += surge.bonusOre;
                    if (surge.bonusGem) gemsFound++;
                }
                rollMiningRandomEvents(true, eventSummary);
                rollMiningMegaEvents(true, eventSummary);
                processMiningQTEProgress(true, eventSummary);
                processMiningRiftPuzzleProgress(true, eventSummary);
                if (engagement.pendingEvent && Math.random() < 0.05) {
                    applyMiningChoiceOutcome(engagement.pendingEvent, 'safe', true, eventSummary);
                }
                const c = engagement.contract;
                if (c && !c.claimed) {
                    c.progress = Math.min(c.target, (c.progress || 0) + 1);
                    if (c.progress >= c.target) c.done = true;
                }
                rollMiningFunEvents(true, funSummary);
            }
            checkTreasureDrop();
            if (Math.random() < 0.5) {
           dropMagicMaterial();
        }
            console.log(`离线挖矿完成: 发现${gemsFound}个宝石, 使用${potionsUsed}个药水`);
            
            if (possibleMines > 0) {
                let message = `离线期间挖掘了 ${possibleMines} 次，发现 ${gemsFound} 个宝石`;
                if (surgeCount > 0) {
                    message += `，矿脉暴击 ${surgeCount} 次并额外获得 ${surgeOre} 矿石`;
                }
                if (funSummary.resonanceCount > 0) {
                    message += `，触发矿脉共鸣 ${funSummary.resonanceCount} 次`;
                }
                if (funSummary.chests > 0) {
                    message += `，开启矿脉宝箱 ${funSummary.chests} 次（额外${funSummary.chestOre}矿石${funSummary.chestGem > 0 ? `，宝石+${funSummary.chestGem}` : ''}）`;
                }
                if (eventSummary.choiceOre > 0 || eventSummary.randomOre > 0) {
                    message += `，事件系统额外带来 ${eventSummary.choiceOre + eventSummary.randomOre} 矿石`;
                }
                if (eventSummary.choiceGem > 0) {
                    message += `，事件额外宝石 +${eventSummary.choiceGem}`;
                }
                if (potionsUsed > 0) {
                    message += `，自动使用了 ${potionsUsed} 个体力药水`;
                }
                if ((eventSummary.riftWin || 0) > 0) {
                    message += `，解开裂隙密码 ${eventSummary.riftWin} 次`;
                }
                if ((eventSummary.riftFail || 0) > 0) {
                    message += `，裂隙闭合失败 ${eventSummary.riftFail} 次`;
                }
                addMiningNotification(message);
            }
        }
    }
    
    player.mining.lastUpdate = now;
    updateMiningUI();
}


        // 初始化无尽挖矿系统（只创建一次定时器，避免泄漏）
       function initMiningSystem() {
            if (window.miningInterval) return;
            window.miningInterval = registerInterval(() => {
                if (player.mining && player.mining.isMining) {
                    mine();
                }
            }, 2000);
            // 只注册一次 beforeunload，避免重复监听导致泄漏
            if (!window._miningBeforeUnloadRegistered) {
                window._miningBeforeUnloadRegistered = true;
                window.addEventListener('beforeunload', () => {
                    if (window.miningInterval) {
                        clearInterval(window.miningInterval);
                        window.miningInterval = null;
                    }
                });
            }
        }


        setTimeout(initMiningSystem, 1000);
function initMiningData() {
    if (!player.mining) {
        player.mining = {
            depth: 0,
            power: 1,
            isMining: false,
            ore: 100,
            stamina: 100,
            baseMaxStamina: 100,
            staminaUpgradeLevel: 1,
            potions: 3,
            gems: {
                ruby: 0,
                sapphire: 0,
                emerald: 0,
                amethyst: 0,
                diamond: 0,
                mysteryGem: 0,
                cultivationGem: 0
            },
            upgrades: {
                power: 1,
                detector: 1
            },
            notifications: [],
            lastUpdate: Date.now(),
            // 添加自动药水开关
            autoPotion: false,
            autoPotionThreshold: 5, // 自动使用药水的体力阈值
            comboStreak: 0,
            comboBest: 0,
            resonanceTurns: 0,
            resonanceBonus: 0,
            chestFragments: 0,
            chestOpened: 0,
            engagement: {
                heat: 0,
                focus: 0,
                surveyCooldown: 0,
                surveyStacks: 0,
                surveyBonus: 1,
                eventCooldown: 0,
                pendingEvent: null,
                eventStats: { triggered: 0, safe: 0, risk: 0 },
                riskMeter: 0,
                scanCharge: 0,
                scanStacks: 0,
                scanBonus: 1,
                stabilizeCooldown: 0,
                faction: 'conservative',
                factionXP: { conservative: 0, blaster: 0, scout: 0 },
                qte: null,
                riftPuzzle: null,
                contractSeed: 1,
                contract: { target: 140, progress: 0, rewardOre: 6000, rewardGemRoll: 1, done: false, claimed: false }
            }
        };
    }
    
    // 确保所有宝石属性都存在
    for (let i = 0; i < miningGemsConfig.length; i++) {
        const gem = miningGemsConfig[i];
        if (player.mining.gems[gem.key] === undefined) {
            console.log(`初始化宝石属性: ${gem.key}`);
            player.mining.gems[gem.key] = 0;
        }
    }
    
    // 确保自动药水属性存在
    if (player.mining.autoPotion === undefined) {
        player.mining.autoPotion = false;
    }
    if (player.mining.autoPotionThreshold === undefined) {
        player.mining.autoPotionThreshold = 5;
    }
    if (!player.mining.upgrades || typeof player.mining.upgrades !== 'object') {
        player.mining.upgrades = { power: 1, detector: 1 };
    }
    player.mining.upgrades.power = Math.max(1, Math.min(MINING_POWER_MAX_LEVEL, Math.floor(Number(player.mining.upgrades.power) || 1)));
    player.mining.upgrades.detector = Math.max(1, Math.min(MINING_DETECTOR_MAX_LEVEL, Math.floor(Number(player.mining.upgrades.detector) || 1)));
    player.mining.staminaUpgradeLevel = Math.max(1, Math.min(MINING_STAMINA_MAX_LEVEL, Math.floor(Number(player.mining.staminaUpgradeLevel) || 1)));
    player.mining.power = Math.max(1, player.mining.upgrades.power);
    player.mining.baseMaxStamina = Math.max(100, Math.floor(Number(player.mining.baseMaxStamina) || 100));
    player.mining.stamina = Math.max(0, Math.min(getMiningMaxStamina(), Math.floor(Number(player.mining.stamina) || 0)));
    ensureMiningFunState();
    player.mining.comboStreak = Math.max(0, Math.floor(Number(player.mining.comboStreak) || 0));
    player.mining.comboBest = Math.max(player.mining.comboStreak, Math.floor(Number(player.mining.comboBest) || 0));
    player.mining.resonanceTurns = Math.max(0, Math.floor(Number(player.mining.resonanceTurns) || 0));
    player.mining.resonanceBonus = Math.max(0, Math.min(0.3, Number(player.mining.resonanceBonus) || 0));
    player.mining.chestFragments = Math.max(0, Math.floor(Number(player.mining.chestFragments) || 0));
    player.mining.chestOpened = Math.max(0, Math.floor(Number(player.mining.chestOpened) || 0));
    ensureMiningEngagementState();
    if (!player.mining.engagement.contract || player.mining.engagement.contract.claimed) {
        generateMiningContract(true);
    }
}


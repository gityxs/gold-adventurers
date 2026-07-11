// 修仙系统
function initCultivationSystem() {
    if (!player.cultivation) {
        player.cultivation = {
            stage: 0, // 当前阶段索引
            exp: 0,   // 当前经验值
            root: null, // 当前灵根
            bloodline: null,
           bonus: 1 
        };
    }
}

// 切换修仙系统界面
function toggleCultivationSystem() {
    if (player.reincarnationCount < 500) {
        alert("需要达到500转才能开启修仙系统！");
        return;
    }
    initCultivationSystem();
    
    const ui = document.getElementById('cultivationSystemUI');
    const overlay = document.getElementById('cultivationSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateCultivationUI();
       updateMagicToolUI();
    }
}


function updateCultivationUI() {
    // 获取当前阶段信息
    const stageIndex = player.cultivation.stage;
    const stage = cultivationStages[stageIndex];
    
    // 确保阶段信息存在
    if (!stage) {
        console.error("无效的修仙阶段索引:", stageIndex);
        return;
    }
    
    // 更新当前阶段显示
    document.getElementById('currentStageq').textContent = stage.name;
      document.getElementById('currentStageqa').textContent = stage.name;
    // 其他更新逻辑保持不变...
    const nextStage = cultivationStages[stageIndex + 1];
    
    // 更新灵根信息
    const rootInfo = document.getElementById('currentRootInfo');
    if (player.cultivation.root) {
        rootInfo.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; color: #FFD700;">${player.cultivation.root.name}</div>
            <div>加成: ${player.cultivation.root.bonus * 100}%</div>
        `;
    } else {
        rootInfo.textContent = "尚未检测灵根";
    }
     const bloodlineInfo = document.getElementById('currentBloodlineInfo');
    if (player.cultivation.bloodline) {
        bloodlineInfo.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; color: #d4af37;">${player.cultivation.bloodline.name}</div>
            <div>加成: ${player.cultivation.bloodline.bonus * 100}%</div>
        `;
    } else {
        bloodlineInfo.textContent = "尚未检测血脉";
    }
    // 更新阶段信息
    document.getElementById('stageLevel').textContent = stageIndex;
    document.getElementById('currentExp').textContent = player.cultivation.exp.toFixed(0);
    
    if (nextStage) {
        document.getElementById('nextExp').textContent = nextStage.expRequired;
        
        // 计算经验进度
        const progress = Math.min(100, (player.cultivation.exp / nextStage.expRequired) * 100);
        document.getElementById('expProgress').style.width = `${progress}%`;
    } else {
        document.getElementById('nextExp').textContent = "已达最高境界";
        document.getElementById('expProgress').style.width = '100%';
    }
    
    // 更新加成信息
    document.getElementById('gpsMultiplier').textContent = stage.multiplier;
   // 计算法宝总加成
    let toolBonus = 1;
    let toolName = '无';
    if (player.magicTools && player.magicTools.equipped) {
        const tool = magicToolConfig.tools.find(t => t.id === player.magicTools.equipped);
        if (tool) {
            toolBonus = tool.bonus;
            toolName = tool.name;
        }
    }
    
    // 计算法宝收集加成
    let collectionBonus = 1;
    let ownedToolsCount = 0;
    if (player.magicTools && player.magicTools.inventory) {
        ownedToolsCount = player.magicTools.inventory.length;
        collectionBonus = 1 + (ownedToolsCount * 0.01);
    }
    
    // 总法宝加成 = 装备法宝加成 × 收集加成
    const totalToolBonus = toolBonus * collectionBonus;
    
    // 更新法宝加成显示
    const magicToolMultiplier = document.getElementById('magicToolMultiplier');
    if (magicToolMultiplier) {
        magicToolMultiplier.textContent = totalToolBonus.toFixed(2);
    }
}
// 打开灵根宝箱界面
function openRootBox() {
    if (player.items.rootDetector < 1) {
        logAction("灵根检测器不足！", "error");
        return;
    }
    
    document.getElementById('rootBoxUI').style.display = 'block';
    document.getElementById('rootBoxOverlay').style.display = 'block';
    document.getElementById('rootResult').textContent = "点击开启获取灵根";
}

// 关闭灵根宝箱界面
function closeRootBox() {
    document.getElementById('rootBoxUI').style.display = 'none';
    document.getElementById('rootBoxOverlay').style.display = 'none';
}

// 抽取灵根
function drawRoot() {
    if (player.items.rootDetector < 1) {
        logAction("灵根检测器不足！", "error");
        return;
    }
    
    player.items.rootDetector--;
    
    // 根据概率抽取灵根品阶
    const rand = Math.random();
    let tier;
    
    if (rand < 0.85) {
        tier = "tier1"; // 85%
    } else if (rand < 0.97) {
        tier = "tier2"; // 12%
    } else if (rand < 0.998) {
        tier = "tier3"; // 2.8%
    } else if (rand < 0.9998) {
        tier = "tier4"; // 0.18%
    } else if (rand < 0.99998) {
        tier = "tier5"; // 0.018%
    } else if (rand < 0.999998) {
        tier = "tier6"; // 0.0018%
    } else {
        tier = "tier7"; // 0.0002%
    }
    
    // 随机选择该品阶中的一个灵根
    const roots = rootConfig[tier];
    const root = roots[Math.floor(Math.random() * roots.length)];
    
    // 保存当前抽取的灵根到全局变量
    window.tempNewRoot = root;
    if (root.bonus >= 2.05) {
        // 保存当前抽取的灵根到全局变量
        window.tempRoot = root;
        // 显示自定义弹窗
        closeRootReplaceDialog();
        showRootRefreshDialog();
        
    } 
    // 检查是否有现有灵根
    if (player.cultivation.root) {
        // 有现有灵根，显示替换确认弹窗
        showRootReplaceDialog();
    } else {
        // 没有现有灵根，直接使用
        player.cultivation.root = root;
        
        // 显示结果
        document.getElementById('rootResult').innerHTML = `
            <div style="font-size: 20px; font-weight: bold; color: #FFD700;">获得${root.name}!</div>
            <div>加成: ${(root.bonus * 100).toFixed(1)}%</div>
        `;
        
        logAction(`获得灵根: ${root.name} (加成${(root.bonus * 100).toFixed(1)}%)`, "success");
        updateCultivationUI();
        updateDisplay();
    }
}
function showRootReplaceDialog() {
    if (!window.tempNewRoot) return;
    
    const oldRoot = player.cultivation.root;
    const newRoot = window.tempNewRoot;
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.8)';
    overlay.style.zIndex = '10000';
    overlay.id = 'rootReplaceOverlay';
    overlay.onclick = function(e) {
        if (e.target === this) closeRootReplaceDialog();
    };
    document.body.appendChild(overlay);
    
    // 创建弹窗
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.background = 'linear-gradient(145deg, #2c2c54, #40407a)';
    dialog.style.color = 'white';
    dialog.style.padding = '30px';
    dialog.style.border = '3px solid #FFD700';
    dialog.style.borderRadius = '20px';
    dialog.style.zIndex = '10001';
    dialog.style.width = '550px';
    dialog.style.textAlign = 'center';
    dialog.style.boxShadow = '0 10px 40px rgba(255,215,0,0.3)';
    dialog.style.animation = 'pop-up 0.3s';
    dialog.id = 'rootReplaceDialog';
    
    // 判断新旧灵根哪个更好
    const isNewBetter = newRoot.bonus > oldRoot.bonus;
    const compareColor = isNewBetter ? '#4CAF50' : '#f44336';
    const compareText = isNewBetter ? '✨ 新灵根更好！' : '⚠️ 旧灵根更好';
    
    dialog.innerHTML = `
        <div style="position: absolute; top: -15px; left: -15px; font-size: 30px;">✨</div>
        <div style="position: absolute; top: -15px; right: -15px; font-size: 30px;">⚡</div>
        
        <h3 style="color: #FFD700; margin-top: 0; margin-bottom: 20px; font-size: 28px;">🌿 灵根选择</h3>
        
        <div style="display: flex; gap: 20px; margin-bottom: 25px;">
            <!-- 旧灵根 -->
            <div style="flex: 1; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; border: 2px solid #666;">
                <div style="font-size: 24px; margin-bottom: 10px;">🔮</div>
                <div style="font-size: 18px; font-weight: bold; color: #aaa; margin-bottom: 5px;">当前灵根</div>
                <div style="font-size: 16px; color: #FFD700; margin-bottom: 10px;">${oldRoot.name}</div>
                <div style="font-size: 20px; color: #4CAF50; font-weight: bold;">${(oldRoot.bonus * 100).toFixed(1)}%</div>
            </div>
            
            <div style="display: flex; align-items: center; font-size: 24px; color: #FFD700;">VS</div>
            
            <!-- 新灵根 -->
            <div style="flex: 1; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; border: 2px solid ${isNewBetter ? '#4CAF50' : '#FFD700'};">
                <div style="font-size: 24px; margin-bottom: 10px;">✨</div>
                <div style="font-size: 18px; font-weight: bold; color: #FFD700; margin-bottom: 5px;">新灵根</div>
                <div style="font-size: 16px; color: #FFD700; margin-bottom: 10px;">${newRoot.name}</div>
                <div style="font-size: 20px; color: ${isNewBetter ? '#4CAF50' : '#FFD700'}; font-weight: bold;">${(newRoot.bonus * 100).toFixed(1)}%</div>
            </div>
        </div>
        
        <div style="margin-bottom: 25px; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 10px;">
            <span style="color: ${compareColor};">${compareText}</span>
        </div>
        
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button onclick="replaceRoot()" style="background: linear-gradient(45deg, #4CAF50, #2E7D32); color: white; border: none; padding: 15px 25px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px; flex: 1;">
                ✨ 替换为新灵根
            </button>
            <button onclick="keepOldRoot()" style="background: linear-gradient(45deg, #f44336, #c62828); color: white; border: none; padding: 15px 25px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px; flex: 1;">
                ❌ 保留旧灵根
            </button>
        </div>
        
        <button onclick="closeRootReplaceDialog()" style="background: rgba(255,255,255,0.1); color: #aaa; border: 2px solid #666; padding: 10px 25px; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 14px; margin-top: 20px;">
            取消 (不替换也不保留新灵根)
        </button>
    `;
    
    document.body.appendChild(dialog);
}
function replaceRoot() {
    if (window.tempNewRoot) {
        const newRoot = window.tempNewRoot;
        player.cultivation.root = newRoot;
        
        // 关闭弹窗
        closeRootReplaceDialog();
        
        // 显示结果
        document.getElementById('rootResult').innerHTML = `
            <div style="font-size: 20px; font-weight: bold; color: #FFD700;">替换为${newRoot.name}!</div>
            <div>加成: ${(newRoot.bonus * 100).toFixed(1)}%</div>
        `;
        
        logAction(`替换灵根为: ${newRoot.name} (加成${(newRoot.bonus * 100).toFixed(1)}%)`, "success");
        updateCultivationUI();
        updateDisplay();
        
        // 清除临时变量
        window.tempNewRoot = null;
    }
}
function keepOldRoot() {
    const oldRoot = player.cultivation.root;
    
    // 关闭弹窗
    closeRootReplaceDialog();
    
    // 显示结果（保留旧灵根）
    document.getElementById('rootResult').innerHTML = `
        <div style="font-size: 20px; font-weight: bold; color: #FFD700;">保留当前灵根</div>
        <div style="font-size: 16px; color: #aaa; margin-top: 5px;">${oldRoot.name} (${(oldRoot.bonus * 100).toFixed(1)}%)</div>
    `;
    
    logAction(`保留当前灵根: ${oldRoot.name}`, "info");
    
    // 清除临时变量
    window.tempNewRoot = null;
}

// 关闭灵根替换弹窗
function closeRootReplaceDialog() {
    const overlay = document.getElementById('rootReplaceOverlay');
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
    
    const dialog = document.getElementById('rootReplaceDialog');
    if (dialog && dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
    }
    
    // 清除临时变量
    window.tempNewRoot = null;
}

function showRootRefreshDialog() {
    // 检查是否有临时灵根
    if (!window.tempRoot) return;
    
    const root = window.tempRoot;
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.8)';
    overlay.style.zIndex = '10000';
    overlay.id = 'rootRefreshOverlay';
    overlay.onclick = function(e) {
        if (e.target === this) closeRootRefreshDialog();
    };
    document.body.appendChild(overlay);
    
    // 创建弹窗
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.background = 'linear-gradient(145deg, #2c2c54, #40407a)';
    dialog.style.color = 'white';
    dialog.style.padding = '30px';
    dialog.style.border = '3px solid #FFD700';
    dialog.style.borderRadius = '20px';
    dialog.style.zIndex = '1000111';
    dialog.style.width = '450px';
    dialog.style.textAlign = 'center';
    dialog.style.boxShadow = '0 10px 40px rgba(255,215,0,0.3)';
    dialog.style.animation = 'pop-up 0.3s';
    dialog.id = 'rootRefreshDialog';
    
    // 根据加成确定颜色
    let color = '#FFD700';
    if (root.bonus >= 3.9) color = '#FF4500';
    else if (root.bonus >= 2.9) color = '#FF69B4';
    else if (root.bonus >= 2.05) color = '#9C27B0';
    
    dialog.innerHTML = `
        <div style="position: absolute; top: -15px; left: -15px; font-size: 30px;">✨</div>
        <div style="position: absolute; top: -15px; right: -15px; font-size: 30px;">⚡</div>
        
        <h3 style="color: ${color}; margin-top: 0; margin-bottom: 20px; font-size: 28px; text-shadow: 0 0 10px ${color};">🎉 极品灵根出现！</h3>
        
        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; margin-bottom: 25px; border: 2px solid ${color};">
            <div style="font-size: 48px; margin-bottom: 10px;">✨</div>
            <div style="font-size: 26px; font-weight: bold; color: ${color}; margin-bottom: 10px;">${root.name}</div>
            <div style="font-size: 18px; color: #FFD700; margin-bottom: 5px;">加成: ${(root.bonus * 100).toFixed(1)}%</div>
            <div style="font-size: 14px; color: #aaa; margin-top: 10px;">品阶: ${getTierNameFromBonus(root.bonus)}</div>
        </div>
        
        <div style="margin-bottom: 25px;">
            <div style="color: #FFD700; font-size: 16px; margin-bottom: 10px;">是否保留这个灵根？</div>
            <div style="color: #aaa; font-size: 14px;">如果选择刷新，将重新抽取一个新灵根</div>
        </div>
        
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button onclick="confirmKeepRoot()" style="background: linear-gradient(45deg, #4CAF50, #2E7D32); color: white; border: none; padding: 15px 30px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px; flex: 1;">
                ✨ 保留
            </button>
        </div>
        
        <button onclick="closeRootRefreshDialog()" style="background: rgba(244,67,54,0.2); color: #f44336; border: 2px solid #f44336; padding: 10px 25px; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 14px; margin-top: 20px;">
            取消 (不保留)
        </button>
    `;
    
    document.body.appendChild(dialog);
}

// 获取品阶名称
function getTierNameFromBonus(bonus) {
    if (bonus >= 9.0) return '传说级';
    if (bonus >= 4.9) return '史诗级';
    if (bonus >= 3.9) return '神话级';
    if (bonus >= 2.9) return '极品';
    if (bonus >= 2.4) return '稀有';
    if (bonus >= 2.05) return '珍贵';
    return '普通';
}
function confirmKeepRoot() {
    if (window.tempRoot) {
        const root = window.tempRoot;
        player.cultivation.root = root;
        
        // 关闭弹窗
        closeRootRefreshDialog();
        
        // 显示结果
        const resultDiv = document.getElementById('rootResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div style="font-size: 20px; font-weight: bold; color: #FFD700;">获得${root.name}!</div>
                <div>加成: ${(root.bonus * 100).toFixed(1)}%</div>
            `;
        }
        
        logAction(`获得极品灵根: ${root.name} (加成${(root.bonus * 100).toFixed(1)}%)`, "success");
        updateCultivationUI();
        updateDisplay();
        
        // 清除临时变量
        window.tempRoot = null;
    } else {
        closeRootRefreshDialog();
    }
}
function refreshRoot() {
    // 关闭当前弹窗
    closeRootRefreshDialog();
    
    // 重新抽取
    const rand = Math.random();
    let tier;
    
    if (rand < 0.85) {
        tier = "tier1";
    } else if (rand < 0.97) {
        tier = "tier2";
    } else if (rand < 0.998) {
        tier = "tier3";
    } else if (rand < 0.9998) {
        tier = "tier4";
    } else if (rand < 0.99998) {
        tier = "tier5";
    } else if (rand < 0.999998) {
        tier = "tier6";
    } else {
        tier = "tier7";
    }
    
    const roots = rootConfig[tier];
    const newRoot = roots[Math.floor(Math.random() * roots.length)];
    
    // 检查新抽取的是否也达到205%以上
    if (newRoot.bonus >= 2.05) {
        window.tempRoot = newRoot;
        showRootRefreshDialog();
    } else {
        // 直接更新玩家灵根
        player.cultivation.root = newRoot;
        
        // 显示结果
        const resultDiv = document.getElementById('rootResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div style="font-size: 20px; font-weight: bold; color: #FFD700;">刷新获得${newRoot.name}!</div>
                <div>加成: ${(newRoot.bonus * 100).toFixed(1)}%</div>
            `;
        }
        
        logAction(`刷新获得灵根: ${newRoot.name} (加成${(newRoot.bonus * 100).toFixed(1)}%)`, "success");
        updateCultivationUI();
        updateDisplay();
        
        // 清除临时变量
        window.tempRoot = null;
    }
}

// 关闭灵根刷新弹窗（不保留也不刷新）
function closeRootRefreshDialog() {
    const overlay = document.getElementById('rootRefreshOverlay');
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
    
    const dialog = document.getElementById('rootRefreshDialog');
    if (dialog && dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
    }
    
    // 清除临时变量（如果用户取消，不保留灵根）
    window.tempRoot = null;
}
// 打开血脉宝箱
function openBloodlineBox() {
    if (player.items.bloodlineDetector < 1) {
        logAction("血脉检测剂不足！", "error");
        return;
    }
    
    document.getElementById('bloodlineBoxUI').style.display = 'block';
    document.getElementById('bloodlineBoxOverlay').style.display = 'block';
    document.getElementById('bloodlineResult').textContent = "点击开启获取血脉";
}

// 关闭血脉宝箱
function closeBloodlineBox() {
    document.getElementById('bloodlineBoxUI').style.display = 'none';
    document.getElementById('bloodlineBoxOverlay').style.display = 'none';
}

// 抽取血脉
function drawBloodline() {
    if (player.items.bloodlineDetector < 1) {
        logAction("血脉检测剂不足！", "error");
        return;
    }
    
    player.items.bloodlineDetector--;
    
    // 根据概率抽取血脉品阶
    const rand = Math.random();
    let tier;
    
    if (rand < 0.8) {
        tier = "tier1"; // 80%
    } else if (rand < 0.96) {
        tier = "tier2"; // 16%
    } else if (rand < 0.992) {
        tier = "tier3"; // 3.2%
    } else if (rand < 0.9984) {
        tier = "tier4"; // 0.64%
    } else if (rand < 0.99968) {
        tier = "tier5"; // 0.128%
    } else if (rand < 0.999936) {
        tier = "tier6"; // 0.0256%
    } else if (rand < 0.9999872) {
        tier = "tier7"; // 0.00512%
    } else if (rand < 0.99999744) {
        tier = "tier8"; // 0.001024%
    } else {
        tier = "tier9"; // 0.000256%
    }
    
    // 随机选择该品阶中的一个血脉
    const bloodlines = bloodlineConfig[tier];
    const bloodline = bloodlines[Math.floor(Math.random() * bloodlines.length)];
    
    // 保存当前抽取的血脉到全局变量
    window.tempNewBloodline = bloodline;
      if (bloodline.bonus >= 1.55) {
        // 保存当前抽取的血脉到全局变量
        window.tempBloodline = bloodline;
        // 显示自定义弹窗
        closeBloodlineReplaceDialog();
        showBloodlineContinueDialog();
      
    }
    // 检查是否有现有血脉
    if (player.cultivation.bloodline) {
        // 有现有血脉，显示替换确认弹窗
        showBloodlineReplaceDialog();
    } else {
        // 没有现有血脉，直接使用
        player.cultivation.bloodline = bloodline;
        
        // 显示结果
        document.getElementById('bloodlineResult').innerHTML = `
            <div style="font-size: 20px; font-weight: bold; color: #FFD700;">获得${bloodline.name}!</div>
            <div>加成: ${(bloodline.bonus * 100).toFixed(1)}%</div>
        `;
        
        logAction(`获得血脉: ${bloodline.name} (加成${(bloodline.bonus * 100).toFixed(1)}%)`, "success");
        updateCultivationUI();
        updateDisplay();
    }
}
function showBloodlineReplaceDialog() {
    if (!window.tempNewBloodline) return;
    
    const oldBloodline = player.cultivation.bloodline;
    const newBloodline = window.tempNewBloodline;
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.8)';
    overlay.style.zIndex = '10000';
    overlay.id = 'bloodlineReplaceOverlay';
    overlay.onclick = function(e) {
        if (e.target === this) closeBloodlineReplaceDialog();
    };
    document.body.appendChild(overlay);
    
    // 创建弹窗
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.background = 'linear-gradient(145deg, #2c2c54, #40407a)';
    dialog.style.color = 'white';
    dialog.style.padding = '30px';
    dialog.style.border = '3px solid #d4af37';
    dialog.style.borderRadius = '20px';
    dialog.style.zIndex = '10001';
    dialog.style.width = '550px';
    dialog.style.textAlign = 'center';
    dialog.style.boxShadow = '0 10px 40px rgba(212,175,55,0.3)';
    dialog.style.animation = 'pop-up 0.3s';
    dialog.id = 'bloodlineReplaceDialog';
    
    // 判断新旧血脉哪个更好
    const isNewBetter = newBloodline.bonus > oldBloodline.bonus;
    const compareColor = isNewBetter ? '#4CAF50' : '#f44336';
    const compareText = isNewBetter ? '✨ 新血脉更好！' : '⚠️ 旧血脉更好';
    
    // 检查是否达到170%以上（可以继续开启）
    const canContinue = newBloodline.bonus >= 1.7;
    
    dialog.innerHTML = `
        <div style="position: absolute; top: -15px; left: -15px; font-size: 30px;">💉</div>
        <div style="position: absolute; top: -15px; right: -15px; font-size: 30px;">⚡</div>
        
        <h3 style="color: #d4af37; margin-top: 0; margin-bottom: 20px; font-size: 28px;">💫 血脉选择</h3>
        
        <div style="display: flex; gap: 20px; margin-bottom: 25px;">
            <!-- 旧血脉 -->
            <div style="flex: 1; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; border: 2px solid #666;">
                <div style="font-size: 24px; margin-bottom: 10px;">🔮</div>
                <div style="font-size: 18px; font-weight: bold; color: #aaa; margin-bottom: 5px;">当前血脉</div>
                <div style="font-size: 14px; color: #FFD700; margin-bottom: 10px;">${oldBloodline.name}</div>
                <div style="font-size: 20px; color: #4CAF50; font-weight: bold;">${(oldBloodline.bonus * 100).toFixed(1)}%</div>
            </div>
            
            <div style="display: flex; align-items: center; font-size: 24px; color: #FFD700;">VS</div>
            
            <!-- 新血脉 -->
            <div style="flex: 1; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; border: 2px solid ${isNewBetter ? '#4CAF50' : '#d4af37'};">
                <div style="font-size: 24px; margin-bottom: 10px;">✨</div>
                <div style="font-size: 18px; font-weight: bold; color: #d4af37; margin-bottom: 5px;">新血脉</div>
                <div style="font-size: 14px; color: #FFD700; margin-bottom: 10px;">${newBloodline.name}</div>
                <div style="font-size: 20px; color: ${isNewBetter ? '#4CAF50' : '#d4af37'}; font-weight: bold;">${(newBloodline.bonus * 100).toFixed(1)}%</div>
            </div>
        </div>
        
        <div style="margin-bottom: 25px; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 10px;">
            <span style="color: ${compareColor};">${compareText}</span>
        </div>
        
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <button onclick="replaceBloodline()" style="background: linear-gradient(45deg, #4CAF50, #2E7D32); color: white; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 15px; flex: 1;">
                ✨ 替换为新血脉
            </button>
            <button onclick="keepOldBloodline()" style="background: linear-gradient(45deg, #f44336, #c62828); color: white; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 15px; flex: 1;">
                ❌ 保留旧血脉
            </button>
        </div>
        
        ${canContinue ? `
            <div style="margin-top: 15px;">
                <button onclick="continueBloodlineFromDialog()" style="background: linear-gradient(45deg, #d4af37, #b8941f); color: black; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 15px; width: 100%;">
                    🔄 继续开启 (消耗1个检测剂)
                </button>
            </div>
        ` : ''}
        
        <button onclick="closeBloodlineReplaceDialog()" style="background: rgba(255,255,255,0.1); color: #aaa; border: 2px solid #666; padding: 10px 25px; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 14px; margin-top: 20px;">
            取消
        </button>
    `;
    
    document.body.appendChild(dialog);
}
function replaceBloodline() {
    if (window.tempNewBloodline) {
        const newBloodline = window.tempNewBloodline;
        player.cultivation.bloodline = newBloodline;
        
        // 关闭弹窗
        closeBloodlineReplaceDialog();
        
        // 显示结果
        document.getElementById('bloodlineResult').innerHTML = `
            <div style="font-size: 20px; font-weight: bold; color: #FFD700;">替换为${newBloodline.name}!</div>
            <div>加成: ${(newBloodline.bonus * 100).toFixed(1)}%</div>
        `;
        
        logAction(`替换血脉为: ${newBloodline.name} (加成${(newBloodline.bonus * 100).toFixed(1)}%)`, "success");
        updateCultivationUI();
        updateDisplay();
        
        // 清除临时变量
        window.tempNewBloodline = null;
    }
}

// 保留旧血脉
function keepOldBloodline() {
    const oldBloodline = player.cultivation.bloodline;
    
    // 关闭弹窗
    closeBloodlineReplaceDialog();
    
    // 显示结果
    document.getElementById('bloodlineResult').innerHTML = `
        <div style="font-size: 20px; font-weight: bold; color: #FFD700;">保留当前血脉</div>
        <div style="font-size: 16px; color: #aaa; margin-top: 5px;">${oldBloodline.name} (${(oldBloodline.bonus * 100).toFixed(1)}%)</div>
    `;
    
    logAction(`保留当前血脉: ${oldBloodline.name}`, "info");
    
    // 清除临时变量
    window.tempNewBloodline = null;
}
function continueBloodlineFromDialog() {
    if (!window.tempNewBloodline) return;
    
    // 关闭当前弹窗
    closeBloodlineReplaceDialog();
    
    // 检查是否有检测剂
    if (player.items.bloodlineDetector < 1) {
        logAction("血脉检测剂不足，无法继续开启！", "error");
        
        // 如果没有检测剂，询问是否保留当前新血脉
        if (confirm('检测剂不足！是否保留刚才抽到的血脉？')) {
            replaceBloodline();
        }
        return;
    }
    
    // 消耗检测剂
    player.items.bloodlineDetector--;
    
    // 重新抽取
    const rand = Math.random();
    let tier;
    
    if (rand < 0.8) {
        tier = "tier1";
    } else if (rand < 0.96) {
        tier = "tier2";
    } else if (rand < 0.992) {
        tier = "tier3";
    } else if (rand < 0.9984) {
        tier = "tier4";
    } else if (rand < 0.99968) {
        tier = "tier5";
    } else if (rand < 0.999936) {
        tier = "tier6";
    } else if (rand < 0.9999872) {
        tier = "tier7";
    } else if (rand < 0.99999744) {
        tier = "tier8";
    } else {
        tier = "tier9";
    }
    
    const bloodlines = bloodlineConfig[tier];
    const newBloodline = bloodlines[Math.floor(Math.random() * bloodlines.length)];
    
    // 保存新抽取的血脉
    window.tempNewBloodline = newBloodline;
    
    // 再次显示替换弹窗
    showBloodlineReplaceDialog();
}
function closeBloodlineReplaceDialog() {
    const overlay = document.getElementById('bloodlineReplaceOverlay');
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
    
    const dialog = document.getElementById('bloodlineReplaceDialog');
    if (dialog && dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
    }
    
    // 清除临时变量
    window.tempNewBloodline = null;
}
function showBloodlineContinueDialog() {
    // 检查是否有临时血脉
    if (!window.tempBloodline) return;
    
    const bloodline = window.tempBloodline;
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.8)';
    overlay.style.zIndex = '10000';
    overlay.id = 'bloodlineContinueOverlay';
    overlay.onclick = function(e) {
        if (e.target === this) closeBloodlineContinueDialog();
    };
    document.body.appendChild(overlay);
    
    // 创建弹窗
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.background = 'linear-gradient(145deg, #2c2c54, #40407a)';
    dialog.style.color = 'white';
    dialog.style.padding = '30px';
    dialog.style.border = '3px solid #d4af37';
    dialog.style.borderRadius = '20px';
    dialog.style.zIndex = '1000111';
    dialog.style.width = '450px';
    dialog.style.textAlign = 'center';
    dialog.style.boxShadow = '0 10px 40px rgba(212,175,55,0.3)';
    dialog.style.animation = 'pop-up 0.3s';
    dialog.id = 'bloodlineContinueDialog';
    
    // 根据加成确定颜色
    let color = '#d4af37';
    if (bloodline.bonus >= 3.9) color = '#FF4500';
    else if (bloodline.bonus >= 2.9) color = '#FF69B4';
    else if (bloodline.bonus >= 1.9) color = '#9C27B0';
    else if (bloodline.bonus >= 1.55) color = '#2196F3';
    
    dialog.innerHTML = `
        <div style="position: absolute; top: -15px; left: -15px; font-size: 30px;">💉</div>
        <div style="position: absolute; top: -15px; right: -15px; font-size: 30px;">⚡</div>
        
        <h3 style="color: ${color}; margin-top: 0; margin-bottom: 20px; font-size: 28px; text-shadow: 0 0 10px ${color};">💫 稀有血脉出现！</h3>
        
        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; margin-bottom: 25px; border: 2px solid ${color};">
            <div style="font-size: 48px; margin-bottom: 10px;">💉</div>
            <div style="font-size: 26px; font-weight: bold; color: ${color}; margin-bottom: 10px;">${bloodline.name}</div>
            <div style="font-size: 18px; color: #FFD700; margin-bottom: 5px;">加成: ${(bloodline.bonus * 100).toFixed(1)}%</div>
            <div style="font-size: 14px; color: #aaa; margin-top: 10px;">品阶: ${getBloodlineTierName(bloodline.bonus)}</div>
        </div>
        
        <div style="margin-bottom: 25px;">
            <div style="color: #FFD700; font-size: 16px; margin-bottom: 10px;">是否继续开启宝箱？</div>
            <div style="color: #aaa; font-size: 14px;">如果选择继续，将消耗1个检测剂再次抽取</div>
        </div>
        
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button onclick="keepBloodlineAndStop()" style="background: linear-gradient(45deg, #4CAF50, #2E7D32); color: white; border: none; padding: 15px 20px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px; flex: 1;">
                ✨ 保留
            </button>
        </div>
        
        <button onclick="closeBloodlineContinueDialog()" style="background: rgba(244,67,54,0.2); color: #f44336; border: 2px solid #f44336; padding: 10px 25px; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 14px; margin-top: 20px;">
            取消 (不保留)
        </button>
    `;
    
    document.body.appendChild(dialog);
}

// 获取血脉品阶名称
function getBloodlineTierName(bonus) {
    if (bonus >= 9.9) return '神话级';
    if (bonus >= 4.9) return '传说级';
    if (bonus >= 3.9) return '史诗级';
    if (bonus >= 2.9) return '极品';
    if (bonus >= 1.9) return '稀有';
    if (bonus >= 1.55) return '珍贵';
    return '普通';
}

// 保留血脉并停止
function keepBloodlineAndStop() {
    if (window.tempBloodline) {
        const bloodline = window.tempBloodline;
        player.cultivation.bloodline = bloodline;
        
        // 关闭弹窗
        closeBloodlineContinueDialog();
        
        // 显示结果
        const resultDiv = document.getElementById('bloodlineResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div style="font-size: 20px; font-weight: bold; color: #FFD700;">获得${bloodline.name}!</div>
                <div>加成: ${(bloodline.bonus * 100).toFixed(1)}%</div>
            `;
        }
        
        logAction(`获得稀有血脉: ${bloodline.name} (加成${(bloodline.bonus * 100).toFixed(1)}%)`, "success");
        updateCultivationUI();
        updateDisplay();
        
        // 清除临时变量
        window.tempBloodline = null;
    } else {
        closeBloodlineContinueDialog();
    }
}

// 继续开启血脉宝箱
function continueBloodline() {
    // 关闭当前弹窗
    closeBloodlineContinueDialog();
    
    // 检查是否有检测剂
    if (player.items.bloodlineDetector < 1) {
        logAction("血脉检测剂不足，无法继续开启！", "error");
        
        // 如果没有检测剂，可以保留当前血脉
        if (window.tempBloodline) {
            if (confirm('检测剂不足！是否保留当前血脉？')) {
                keepBloodlineAndStop();
            }
        }
        return;
    }
    
    // 消耗检测剂
    player.items.bloodlineDetector--;
    
    // 重新抽取
    const rand = Math.random();
    let tier;
    
    if (rand < 0.8) {
        tier = "tier1";
    } else if (rand < 0.96) {
        tier = "tier2";
    } else if (rand < 0.992) {
        tier = "tier3";
    } else if (rand < 0.9984) {
        tier = "tier4";
    } else if (rand < 0.99968) {
        tier = "tier5";
    } else if (rand < 0.999936) {
        tier = "tier6";
    } else if (rand < 0.9999872) {
        tier = "tier7";
    } else if (rand < 0.99999744) {
        tier = "tier8";
    } else {
        tier = "tier9";
    }
    
    const bloodlines = bloodlineConfig[tier];
    const newBloodline = bloodlines[Math.floor(Math.random() * bloodlines.length)];
    
    // 检查新抽取的血脉是否达到155%以上
    if (newBloodline.bonus >= 1.55) {
        window.tempBloodline = newBloodline;
        showBloodlineContinueDialog();
    } else {
        // 直接更新玩家血脉
        player.cultivation.bloodline = newBloodline;
        
        // 显示结果
        const resultDiv = document.getElementById('bloodlineResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div style="font-size: 20px; font-weight: bold; color: #FFD700;">继续获得${newBloodline.name}!</div>
                <div>加成: ${(newBloodline.bonus * 100).toFixed(1)}%</div>
            `;
        }
        
        logAction(`继续获得血脉: ${newBloodline.name} (加成${(newBloodline.bonus * 100).toFixed(1)}%)`, "success");
        updateCultivationUI();
        updateDisplay();
    }
    
    // 清除临时变量
    window.tempBloodline = null;
}

// 关闭血脉继续弹窗（不保留也不继续）
function closeBloodlineContinueDialog() {
    const overlay = document.getElementById('bloodlineContinueOverlay');
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
    
    const dialog = document.getElementById('bloodlineContinueDialog');
    if (dialog && dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
    }
    
    // 清除临时变量（如果用户取消，不保留血脉）
    window.tempBloodline = null;
}
// 升级修仙阶段
function upgradeCultivation() {
    console.log("升级前阶段:", player.cultivation.stage);
    
    const nextStageIndex = player.cultivation.stage + 1;
    
    // 检查是否有下一阶段
    if (nextStageIndex >= cultivationStages.length) {
        logAction("已达最高境界，无法继续升级", "info");
        return;
    }
    
    const nextStage = cultivationStages[nextStageIndex];
    
    // 检查经验是否足够
    if (player.cultivation.exp < nextStage.expRequired) {
        logAction("经验不足，无法升级", "error");
        return;
    }
    
    // 扣除经验并升级
    player.cultivation.exp -= nextStage.expRequired;
    player.cultivation.stage = nextStageIndex;
    
    console.log("升级后阶段:", player.cultivation.stage);
    logAction(`成功晋升${nextStage.name}境界！`, "success");
    
    // 更新显示
    updateDisplay();
    updateCultivationUI(); // 如果修仙界面打开，也需要更新
}
// 更新修仙经验UI显示（与 gainCultivationExp 使用同一套 getCultivationExpPerMinute，避免法宝界面把「每分钟经验」错误刷成 0）
function updateCultivationExpUI() {
    let equippedBonus = 1;
    let collectionBonus = 1;
    if (player.magicTools && player.magicTools.equipped) {
        const tool = typeof magicToolConfig !== 'undefined' && magicToolConfig.tools
            ? magicToolConfig.tools.find(t => t.id === player.magicTools.equipped)
            : null;
        if (tool && typeof tool.bonus === 'number' && tool.bonus > 0) equippedBonus = tool.bonus;
    }
    if (player.magicTools && player.magicTools.inventory) {
        collectionBonus = 1 + (player.magicTools.inventory.length * 0.01);
    }
    const expPerMinute = typeof getCultivationExpPerMinute === 'function' ? getCultivationExpPerMinute() : 0;
    const expPerMinuteElement = document.getElementById('currentExpPerMinute');
    const collectionInfoElement = document.getElementById('magicToolCollectionInfo');
    
    if (expPerMinuteElement) {
        expPerMinuteElement.textContent = typeof formatNumber === 'function' ? formatNumber(expPerMinute) : expPerMinute.toFixed(2);
    }
    
    if (collectionInfoElement) {
        const ownedCount = player.magicTools?.inventory?.length || 0;
        collectionInfoElement.innerHTML = `
            <div style="color: #4CAF50; font-size: 14px;">
                法宝收集加成: ${ownedCount}个法宝 × 1% = <span style="color: #FFD700; font-weight: bold;">${((collectionBonus - 1) * 100).toFixed(1)}%</span>
            </div>
            <div style="color: #aaa; font-size: 12px; margin-top: 5px;">
                装备加成: ${equippedBonus.toFixed(1)}倍，总加成: ${(equippedBonus * collectionBonus).toFixed(2)}倍
            </div>
        `;
    }
    
    const magicToolBonusElement = document.getElementById('magicToolMultiplier');
    if (magicToolBonusElement) {
        magicToolBonusElement.textContent = (equippedBonus * collectionBonus).toFixed(2);
    }
}
// 每分钟获取经验
function gainCultivationExp() {
    if (!player.cultivation) {
        console.log("玩家没有修仙系统");
        return;
    }
    
    if (!player.cultivation.root || !player.cultivation.bloodline) {
        console.log("玩家没有灵根或血脉");
        document.getElementById('currentExpPerMinute').textContent = "0 (需要灵根和血脉)";
        return;
    }
    
    // 计算基础加成
    const rootBonus = player.cultivation.root.bonus;
    const bloodlineBonus = player.cultivation.bloodline.bonus;
    
    // 计算法宝加成（如果有装备法宝）
    let toolBonus = 1;
    if (player.magicTools && player.magicTools.equipped) {
        const tool = magicToolConfig.tools.find(t => t.id === player.magicTools.equipped);
        if (tool) {
            toolBonus = tool.bonus;
        }
    }
    
    // 计算法宝收集加成：每拥有一个法宝额外提升1%
    let collectionBonus = 1;
    if (player.magicTools && player.magicTools.inventory) {
        const ownedToolsCount = player.magicTools.inventory.length;
        collectionBonus = 1 + (ownedToolsCount * 0.01);
    }
     // 获取探险家职业的修仙经验加成
    const classBonuses = calculateClassBonuses();
    let cultivationExpMultiplier = classBonuses.cultivationExpMultiplier || 1;
    if (typeof window.isGoldGameFamilyBuffActive === 'function' && window.isGoldGameFamilyBuffActive('cultivation')) {
        cultivationExpMultiplier *= 6; // 修仙药水：修仙经验500%加成（×6）
    }
    // 每分钟经验 = 转生次数 × 灵根加成 × 血脉加成 × 装备法宝加成 × 收集加成 × 洞府聚灵阵加成
    const grottoBonus = typeof getGrottoCultivationExpBonus === 'function' ? getGrottoCultivationExpBonus() : 1;
    const lawCultivationMul = 1 + (((typeof getLawPowerBonuses === 'function' ? getLawPowerBonuses().cultivationExp : 0) || 0));
    const miningCultivationCount = Number(player.mining && player.mining.gems ? player.mining.gems.cultivationGem : 0) || 0;
    const miningCultivationMul = getMiningDiminishingExpGemMultiplier(miningCultivationCount);
    const expPerMinute = (rootBonus * bloodlineBonus * toolBonus * collectionBonus * cultivationExpMultiplier * grottoBonus * lawCultivationMul * miningCultivationMul) * player.reincarnationCount;
    
    // 每秒增加经验（除以60得到每秒经验）
    const expPerSecond = expPerMinute / 60;
    player.cultivation.exp += expPerSecond;
    
    // 悟道台挂机修仙经验
    if (typeof processEnlightenmentTick === 'function') processEnlightenmentTick();
    
    // 更新阶段加成
    const stage = cultivationStages[player.cultivation.stage];
    if (stage) {
        player.cultivation.bonus = stage.multiplier;
    }
    
    // 更新UI显示
    document.getElementById('currentExpPerMinute').textContent = formatNumber(expPerMinute);
    
    // 更新显示
    updateDisplay();
    if (typeof updateCultivationUI === 'function') {
        updateCultivationUI();
    }
}
let lastOnlineTime = Date.now();
function checkOfflineTime() {
    const now = Date.now();
    const offlineMinutes = Math.floor((now - lastOnlineTime) / 60000); // 转换为分钟
    
    console.log(`上次在线: ${new Date(lastOnlineTime).toLocaleString()}`);
    console.log(`当前时间: ${new Date(now).toLocaleString()}`);
    console.log(`离线分钟: ${offlineMinutes}`);
    
    if (offlineMinutes > 0) {
        
        const maxOfflineMinutes = 3 * 24 * 60; // 3天
        const actualOfflineMinutes = Math.min(offlineMinutes, maxOfflineMinutes);
        
        if (actualOfflineMinutes > 0) {
            calculateOfflineCultivationExp(actualOfflineMinutes);
        }
    }
    
    // 更新最后在线时间
    lastOnlineTime = now;
}
window.addEventListener('load', function() {
    // 从localStorage读取上次在线时间（与主存档一致：优先关页时间，否则用主存档 lastUpdate）
    const savedLastOnline = localStorage.getItem('lastOnlineTime');
    if (savedLastOnline) {
        lastOnlineTime = parseInt(savedLastOnline);
    } else {
        try {
            var save = JSON.parse(localStorage.getItem('goldGameSave'));
            if (save && save.lastUpdate != null) lastOnlineTime = save.lastUpdate;
        } catch (e) {}
    }
    
    // 检查离线时间
    checkOfflineTime();
    
    // 开始定时更新
    registerInterval(function() {
        // 每分钟更新一次最后在线时间
        lastOnlineTime = Date.now();
        localStorage.setItem('lastOnlineTime', lastOnlineTime.toString());
    }, 60000);
});

// 在页面关闭前保存最后在线时间
window.addEventListener('beforeunload', function() {
    localStorage.setItem('lastOnlineTime', Date.now().toString());
});
// 计算离线经验
function calculateOfflineCultivationExp(offlineMinutes) {
    console.log("计算离线经验，离线分钟数:", offlineMinutes);
    
    // 检查玩家是否有修仙系统
    if (!player.cultivation) {
        console.log("玩家没有修仙系统");
        return;
    }
    
    // 检查是否有灵根和血脉
    if (!player.cultivation.root || !player.cultivation.bloodline) {
        if (offlineMinutes >= 1) {
            logAction("需要先获取灵根和血脉才能获得离线修仙经验", "info");
        }
        return;
    }
    
    // 计算基础加成
    const rootBonus = player.cultivation.root.bonus;
    const bloodlineBonus = player.cultivation.bloodline.bonus;
    
    // 计算法宝加成（如果有装备法宝）；loadSave 可能早于 magicToolConfig 定义执行，用 try-catch 避免 TDZ 报错
    var toolBonus = 1;
    try {
        if (player.magicTools && player.magicTools.equipped) {
            var tool = magicToolConfig.tools.find(function(t) { return t.id === player.magicTools.equipped; });
            if (tool) toolBonus = tool.bonus;
        }
    } catch (e) {
        toolBonus = 1;
    }
    
    // 计算法宝收集加成：每拥有一个法宝额外提升1%
    let collectionBonus = 1;
    if (player.magicTools && player.magicTools.inventory) {
        const ownedToolsCount = player.magicTools.inventory.length;
        collectionBonus = 1 + (ownedToolsCount * 0.01);
    }
    // 获取探险家职业的修仙经验加成；loadSave 可能早于 classConfig 定义，用 try-catch 避免 TDZ 报错
    var cultivationExpMultiplier = 1;
    try {
        var classBonuses = calculateClassBonuses();
        cultivationExpMultiplier = classBonuses.cultivationExpMultiplier || 1;
    } catch (e) {
        cultivationExpMultiplier = 1;
    }
    // 洞府聚灵阵加成
    const grottoBonus = typeof getGrottoCultivationExpBonus === 'function' ? getGrottoCultivationExpBonus() : 1;
    // 每分钟经验 = 转生次数 × 灵根加成 × 血脉加成 × 装备法宝加成 × 收集加成 × 洞府聚灵阵加成
    const lawCultivationMul = 1 + (((typeof getLawPowerBonuses === 'function' ? getLawPowerBonuses().cultivationExp : 0) || 0));
    const miningCultivationCount = Number(player.mining && player.mining.gems ? player.mining.gems.cultivationGem : 0) || 0;
    const miningCultivationMul = getMiningDiminishingExpGemMultiplier(miningCultivationCount);
    const expPerMinute = (rootBonus * bloodlineBonus * toolBonus * collectionBonus * cultivationExpMultiplier * grottoBonus * lawCultivationMul * miningCultivationMul) * player.reincarnationCount;
    
    // 计算总离线经验
    const totalExpGain = expPerMinute * offlineMinutes;
    
    console.log(`每分钟经验: ${expPerMinute}, 离线分钟: ${offlineMinutes}, 总经验: ${totalExpGain}`);
    
    if (totalExpGain > 0) {
        // 增加修仙经验
        player.cultivation.exp += totalExpGain;
        
        // 记录日志
        logAction(`离线获得 ${formatNumber(totalExpGain)} 点修仙经验 (${offlineMinutes}分钟 × ${formatNumber(expPerMinute)}/分钟)`, "success");
        
        // 检查是否有境界突破；loadSave 可能早于 cultivationStages 定义，用 try-catch 避免 TDZ 报错
        try { checkCultivationBreakthrough(); } catch (e) { }
        
        // 更新显示
        updateDisplay();
        if (typeof updateCultivationUI === 'function') {
            try { updateCultivationUI(); } catch (e) { /* cultivationStages 可能尚未定义 */ }
        }
    } else {
        console.log("离线经验为0，可能是转生次数为0或加成倍率为0");
        if (player.reincarnationCount === 0) {
            logAction("转生次数为0，无法获得修仙经验", "info");
        }
    }
}
function checkCultivationBreakthrough() {
    if (!player.cultivation) return;
    
    let breakthrough = false;
    let currentStage = player.cultivation.stage;
    
    // 检查是否可以连续突破
    while (true) {
        const nextStageIndex = player.cultivation.stage + 1;
        if (nextStageIndex >= cultivationStages.length) break;
        
        const nextStage = cultivationStages[nextStageIndex];
        if (player.cultivation.exp >= nextStage.expRequired) {
            // 突破境界
            player.cultivation.exp -= nextStage.expRequired;
            player.cultivation.stage = nextStageIndex;
            breakthrough = true;
            
            logAction(`离线突破至 ${nextStage.name} 境界！`, "success");
        } else {
            break;
        }
    }
    
    return breakthrough;
}
// 称号配置（按分支分组）
const titleConfig = {
     towerBranyy: [
    { name: "钓竿初握", condition: (p) => p.fishing.level > 2, bonus: { attackMultiplier: 1.1 } },
    { name: "河塘渔夫", condition: (p) => p.fishing.level > 5, bonus: { attackMultiplier: 1.1 } },
    { name: "渔获大师", condition: (p) => p.fishing.level > 7, bonus: { attackMultiplier: 1.1 } },
    { name: "万鱼臣服", condition: (p) => p.fishing.level > 10, bonus: { attackMultiplier: 1.2 } },
    { name: "钓尽乾坤", condition: (p) => p.fishing.level > 14, bonus: { attackMultiplier: 1.2 } },
    { name: "小农夫", condition: (p) => p.farm.level > 2, bonus: { attackMultiplier: 1.1 } },
    { name: "田园熟手", condition: (p) => p.farm.level > 5, bonus: { attackMultiplier: 1.1 } },
    { name: "农耕大师", condition: (p) => p.farm.level > 15, bonus: { attackMultiplier: 1.1 } },
    { name: "庄园尊主", condition: (p) => p.farm.level > 25, bonus: { attackMultiplier: 1.2 } },
    { name: "大地主宰", condition: (p) => p.farm.level > 35, bonus: { attackMultiplier: 1.2 } },
    { name: "车途学徒", condition: (p) => p.parking.level > 2, bonus: { attackMultiplier: 1.1 } },
    { name: "赛道枭雄", condition: (p) => p.parking.level > 7, bonus: { attackMultiplier: 1.1 } },
    { name: "车坛至尊", condition: (p) => p.parking.level > 14, bonus: { attackMultiplier: 1.1 } },
    { name: "巅峰车皇", condition: (p) => p.parking.level > 24, bonus: { attackMultiplier: 1.2 } },
    { name: "寰宇车神", condition: (p) => p.parking.level > 34, bonus: { attackMultiplier: 1.2 } },
    { name: "创世车帝", condition: (p) => p.parking.level > 39, bonus: { attackMultiplier: 1.2 } },
    { name: "百万元户", condition: (p) => p.landlord.stats.totalCoinsEarned > 1000000, bonus: { healthMultiplier: 1.1 } },
    { name: "千万富翁", condition: (p) => p.landlord.stats.totalCoinsEarned > 10000000, bonus: { healthMultiplier: 1.1 } },
    { name: "亿富翁", condition: (p) => p.landlord.stats.totalCoinsEarned > 100000000, bonus: { healthMultiplier: 1.1 } },
    { name: "十亿富翁", condition: (p) => p.landlord.stats.totalCoinsEarned > 1000000000, bonus: { healthMultiplier: 1.2 } },
    { name: "百亿富翁", condition: (p) => p.landlord.stats.totalCoinsEarned > 10000000000, bonus: { healthMultiplier: 1.2 } },
    { name: "千亿富翁", condition: (p) => p.landlord.stats.totalCoinsEarned > 100000000000, bonus: { healthMultiplier: 1.2 } },
    { name: "万亿富翁", condition: (p) => p.landlord.stats.totalCoinsEarned > 1000000000000, bonus: { healthMultiplier: 1.2 } },
    { name: "高富帅", condition: (p) => p.landlord.stats.totalCoinsEarned > 10000000000000, bonus: { healthMultiplier: 1.2 } },
    { name: "股侠", condition: (p) => p.investmentGame.userData.availableFunds > 100000, bonus: { healthMultiplier: 1.1 } },
    { name: "股霸", condition: (p) => p.investmentGame.userData.availableFunds > 10000000, bonus: { healthMultiplier: 1.1 } },
    { name: "股王", condition: (p) => p.investmentGame.userData.availableFunds > 1000000000, bonus: { healthMultiplier: 1.1 } },
    { name: "股圣", condition: (p) => p.investmentGame.userData.availableFunds > 100000000000, bonus: { healthMultiplier: 1.2 } },
    { name: "股神", condition: (p) => p.investmentGame.userData.availableFunds > 10000000000000, bonus: { healthMultiplier: 1.2 } },
    { name: "股仙", condition: (p) => p.investmentGame.userData.availableFunds > 1000000000000000, bonus: { healthMultiplier: 1.2 } },
    { name: "股中仙人", condition: (p) => p.investmentGame.userData.availableFunds > 100000000000000000000, bonus: { healthMultiplier: 1.2 } },
    { name: "股中仙神", condition: (p) => p.investmentGame.userData.availableFunds > 10000000000000000000000000, bonus: { healthMultiplier: 1.2 } },
    { name: "股中仙圣", condition: (p) => p.investmentGame.userData.availableFunds > 1000000000000000000000000000000, bonus: { healthMultiplier: 1.2 } },    
    { name: "萌新矿工", condition: (p) => p.mining.depth > 1000, bonus: { attackMultiplier: 1.1 } },
    { name: "勤奋矿工", condition: (p) => p.mining.depth > 10000, bonus: { attackMultiplier: 1.1 } },
    { name: "黄金矿工", condition: (p) => p.mining.depth > 100000, bonus: { attackMultiplier: 1.1 } },
    { name: "钻石矿工", condition: (p) => p.mining.depth > 1000000, bonus: { attackMultiplier: 1.2 } },
    { name: "星辰矿工", condition: (p) => p.mining.depth > 10000000, bonus: { attackMultiplier: 1.2 } },
    { name: "创世矿工神", condition: (p) => p.mining.depth > 100000000, bonus: { attackMultiplier: 1.2 } },
    { name: "未来矿工神", condition: (p) => p.mining.depth > 500000000, bonus: { attackMultiplier: 1.2 } },
    { name: "星辰矿工神", condition: (p) => p.mining.depth > 1000000000, bonus: { attackMultiplier: 1.2 } },
    { name: "世劫矿工仙", condition: (p) => p.mining.depth > 5000000000, bonus: { attackMultiplier: 1.2 } }
   
   ], 
     towerBranch: [
    { name: "关破厉鬼", condition: (p) => p.tower.maxFloor > 10, bonus: { healthMultiplier: 1.1 } },
    { name: "阶碎无常", condition: (p) => p.tower.maxFloor > 500, bonus: { healthMultiplier: 1.1 } },
    { name: "踏塔马面", condition: (p) => p.tower.maxFloor > 1000, bonus: { healthMultiplier: 1.1 } },
    { name: "魔修夜叉", condition: (p) => p.tower.maxFloor > 5000, bonus: { healthMultiplier: 1.1 } },
    { name: "破阶修罗", condition: (p) => p.tower.maxFloor > 7500, bonus: { healthMultiplier: 1.1 } },
    { name: "千层煞主", condition: (p) => p.tower.maxFloor > 10000, bonus: { healthMultiplier: 1.1 } },
    { name: "踏关煞神", condition: (p) => p.tower.maxFloor > 25000, bonus: { healthMultiplier: 1.1 } },
    { name: "关前冥王", condition: (p) => p.tower.maxFloor > 50000, bonus: { healthMultiplier: 1.1 } },
    { name: "踏塔狂魔", condition: (p) => p.tower.maxFloor > 75000, bonus: { healthMultiplier: 1.1 } },
    { name: "混世魔王", condition: (p) => p.tower.maxFloor > 100000, bonus: { healthMultiplier: 1.1 } },
    { name: "屠戮之主", condition: (p) => p.tower.maxFloor > 150000, bonus: { healthMultiplier: 1.2 } },
    { name: "杀戮之神", condition: (p) => p.tower.maxFloor > 200000, bonus: { healthMultiplier: 1.2 } },
    { name: "十殿阎罗", condition: (p) => p.tower.maxFloor > 250000, bonus: { healthMultiplier: 1.2 } },
    { name: "弑神修罗", condition: (p) => p.tower.maxFloor > 300000, bonus: { healthMultiplier: 1.2 } },
    { name: "九幽魔尊", condition: (p) => p.tower.maxFloor > 350000, bonus: { healthMultiplier: 1.2 } },
    { name: "永夜君主", condition: (p) => p.tower.maxFloor > 400000, bonus: { healthMultiplier: 1.2 } },
    { name: "深渊主宰", condition: (p) => p.tower.maxFloor > 450000, bonus: { healthMultiplier: 1.2 } },
    { name: "万殿阎魔", condition: (p) => p.tower.maxFloor > 500000, bonus: { healthMultiplier: 1.2 } },
    { name: "虚无魔皇", condition: (p) => p.tower.maxFloor > 550000, bonus: { healthMultiplier: 1.2 } },
    { name: "轮回魔主", condition: (p) => p.tower.maxFloor > 600000, bonus: { healthMultiplier: 1.2 } },
    { name: "混沌魔尊", condition: (p) => p.tower.maxFloor > 650000, bonus: { healthMultiplier: 1.2 } },
    { name: "万法归魔", condition: (p) => p.tower.maxFloor > 700000, bonus: { healthMultiplier: 1.2 } }
],
    // 关卡分支
    stageBranch: [
        { name: "探险者", condition: (p) => p.battle.maxStage > 10, bonus: { attackMultiplier: 1.1 } },
        { name: "银翼斥候", condition: (p) => p.battle.maxStage > 100, bonus: { attackMultiplier: 1.1 } },
        { name: "圣域行者", condition: (p) => p.battle.maxStage > 250, bonus: { attackMultiplier: 1.1 } },
        { name: "苍穹之主", condition: (p) => p.battle.maxStage > 500, bonus: { attackMultiplier: 1.1 } },
        { name: "九天至尊", condition: (p) => p.battle.maxStage > 1000, bonus: { attackMultiplier: 1.2 } },
        { name: "万域之主", condition: (p) => p.battle.maxStage > 1500, bonus: { attackMultiplier: 1.2 } },
        { name: "寰宇独尊", condition: (p) => p.battle.maxStage > 2000, bonus: { attackMultiplier: 1.2 } },
        { name: "万界臣服", condition: (p) => p.battle.maxStage > 2500, bonus: { attackMultiplier: 1.3 } },
        { name: "天地共主", condition: (p) => p.battle.maxStage > 3000, bonus: { attackMultiplier: 1.4 } },
        { name: "星河主宰", condition: (p) => p.battle.maxStage > 3500, bonus: { attackMultiplier: 1.4 } },
        { name: "太虚之皇", condition: (p) => p.battle.maxStage > 4000, bonus: { attackMultiplier: 1.5 } },
        { name: "六道归一", condition: (p) => p.battle.maxStage > 4500, bonus: { attackMultiplier: 1.5 } },
        { name: "无极天尊", condition: (p) => p.battle.maxStage > 5000, bonus: { attackMultiplier: 1.5 } },
        { name: "混沌主宰", condition: (p) => p.battle.maxStage > 5500, bonus: { attackMultiplier: 1.5 } },
        { name: "永恒唯一", condition: (p) => p.battle.maxStage > 6000, bonus: { attackMultiplier: 1.5 } }, 
        { name: "无尽虚无", condition: (p) => p.battle.maxStage > 6500, bonus: { attackMultiplier: 1.5 } } 
    ],
    // 转生分支
    reincarnationBranch: [
        { name: "初涉江湖", condition: (p) => p.reincarnationCount > 5, bonus: { healthMultiplier: 1.2 } },
        { name: "俗世门徒", condition: (p) => p.reincarnationCount > 10, bonus: { healthMultiplier: 1.2 } },
        { name: "人中龙凤", condition: (p) => p.reincarnationCount > 50, bonus: { healthMultiplier: 1.2 } },
        { name: "一方翘楚", condition: (p) => p.reincarnationCount > 100, bonus: { healthMultiplier: 1.2 } },
        { name: "超凡入圣", condition: (p) => p.reincarnationCount > 250, bonus: { healthMultiplier: 1.2 } },
        { name: "一代宗师", condition: (p) => p.reincarnationCount > 500, bonus: { healthMultiplier: 1.2 } },
        { name: "盖世之才", condition: (p) => p.reincarnationCount > 1000, bonus: { healthMultiplier: 1.2 } },
        { name: "众仙之师", condition: (p) => p.reincarnationCount > 2000, bonus: { healthMultiplier: 1.2 } },
        { name: "创世之灵", condition: (p) => p.reincarnationCount > 3000, bonus: { healthMultiplier: 1.2 } },
        { name: "万神之主", condition: (p) => p.reincarnationCount > 5000, bonus: { healthMultiplier: 1.2 } },
        { name: "无上真神", condition: (p) => p.reincarnationCount > 10000, bonus: { healthMultiplier: 1.2 } },
        { name: "寰宇神尊", condition: (p) => p.reincarnationCount > 50000, bonus: { healthMultiplier: 1.2 } },
        { name: "创世神帝", condition: (p) => p.reincarnationCount > 100000, bonus: { healthMultiplier: 1.2 } }
    ],
    // 驯兽师分支
    tamerBranch: [
        { name: "初级驯兽师", condition: (p) => p.pets?.thunderKirin?.level > 50, bonus: { critMultiplier: 1.1 } },
        { name: "中级驯兽师", condition: (p) => p.pets?.netherQiongqi?.level > 30, bonus: { critMultiplier: 1.1 } },
        { name: "高级驯兽师", condition: (p) => p.pets?.primordialZhuLong?.level > 10, bonus: { critMultiplier: 1.2 } },
        { name: "圣级驯兽师", condition: (p) => p.pets?.yanYuBiAn?.level > 10, bonus: { critMultiplier: 1.2 } },
        { name: "神级驯兽师", condition: (p) => p.pets?.yuyu2?.level > 10, bonus: { critMultiplier: 1.3 } },
        { name: "人级驯兽师", condition: (p) => p.pets?.yuyu3?.level > 10, bonus: { critMultiplier: 1.3 } },
        { name: "地级驯兽师", condition: (p) => p.pets?.yuyu4?.level > 10, bonus: { critMultiplier: 1.4 } },
        { name: "天级驯兽师", condition: (p) => p.pets?.yuyu5?.level > 10, bonus: { critMultiplier: 1.4 } },
        { name: "帝级驯兽师", condition: (p) => p.pets?.yuyu6?.level > 10, bonus: { critMultiplier: 1.4 } },
        { name: "仙级驯兽师", condition: (p) => p.pets?.yuyu7?.level > 10, bonus: { critMultiplier: 1.5 } },
        { name: "创世级驯兽师", condition: (p) => p.pets?.yuyu8?.level > 10, bonus: { critMultiplier: 1.5 } }
    ],
    // 魂环分支
    soulRingBranch: [
        { name: "魂士", condition: (p) => hasSoulRing(p, "year1"), bonus: { attackMultiplier: 1.1 } },
        { name: "魂师", condition: (p) => hasSoulRing(p, "year100"), bonus: { attackMultiplier: 1.1 } },
        { name: "大魂师", condition: (p) => hasSoulRing(p, "year10000"), bonus: { attackMultiplier: 1.2 } },
        { name: "魂尊", condition: (p) => hasSoulRing(p, "year1000000"), bonus: { attackMultiplier: 1.2 } },
        { name: "魂宗", condition: (p) => hasSoulRing(p, "year3"), bonus: { attackMultiplier: 1.3 } },
        { name: "魂王", condition: (p) => hasSoulRing(p, "year7"), bonus: { attackMultiplier: 1.3 } },
        { name: "魂帝", condition: (p) => hasSoulRing(p, "year13"), bonus: { attackMultiplier: 1.3 } },
        { name: "魂圣", condition: (p) => hasSoulRing(p, "year18"), bonus: { attackMultiplier: 1.4 } },
        { name: "魂斗罗", condition: (p) => hasSoulRing(p, "year23"), bonus: { attackMultiplier: 1.4 } },
        { name: "普通封号斗罗", condition: (p) => hasSoulRing(p, "year28"), bonus: { attackMultiplier: 1.5 } },
        { name: "巅峰斗罗", condition: (p) => hasSoulRing(p, "year33"), bonus: { attackMultiplier: 1.5 } },
        { name: "绝世斗罗", condition: (p) => hasSoulRing(p, "year37"), bonus: { attackMultiplier: 1.5 } }
    ],
    // 特殊分支
    specialBranch: [
        { name: "萌新", condition: (p) => p.gold > 100000000000000, bonus: { attackMultiplier: 1.1 } },
        { name: "公测玩家", condition: (p) => p.usedActivationCodes.includes("VIP666777"), bonus: { attackMultiplier: 1.2 } },
        { name: "持剑学徒", condition: (p) => getEquipLevel(p, "废品") > 1, bonus: { attackMultiplier: 1.1 } },
        { name: "疾风剑者", condition: (p) => getEquipLevel(p, "废品") > 1000, bonus: { attackMultiplier: 1.1 } },
        { name: "断水剑师", condition: (p) => getEquipLevel(p, "废品") > 10000, bonus: { attackMultiplier: 1.1 } },
        { name: "九霄剑王", condition: (p) => getEquipLevel(p, "废品") > 100000, bonus: { attackMultiplier: 1.1 } },
        { name: "独孤剑皇", condition: (p) => getEquipLevel(p, "废品") > 500000, bonus: { attackMultiplier: 1.1 } },
        { name: "剑域之主", condition: (p) => getEquipLevel(p, "废品") > 1000000, bonus: { attackMultiplier: 1.2 } },
        { name: "万剑之神", condition: (p) => getEquipLevel(p, "废品") > 5000000, bonus: { attackMultiplier: 1.2 } },
        { name: "鸿蒙剑祖", condition: (p) => getEquipLevel(p, "废品") > 10000000, bonus: { attackMultiplier: 1.2 } },
        { name: "万劫剑神", condition: (p) => getEquipLevel(p, "废品") > 50000000, bonus: { attackMultiplier: 1.3 } },
        { name: "无上剑神", condition: (p) => getEquipLevel(p, "废品") > 100000000, bonus: { attackMultiplier: 1.3 } },
        { name: "剑狱之尊", condition: (p) => getEquipLevel(p, "废品") > 200000000, bonus: { attackMultiplier: 1.3 } },
        { name: "剑主洪荒", condition: (p) => getEquipLevel(p, "废品") > 300000000, bonus: { attackMultiplier: 1.3 } },
        { name: "御诸剑神", condition: (p) => getEquipLevel(p, "废品") > 400000000, bonus: { attackMultiplier: 1.4 } },
        { name: "创造剑神", condition: (p) => getEquipLevel(p, "废品") > 1000000000, bonus: { attackMultiplier: 1.4 } },
        { name: "位面剑荒", condition: (p) => getEquipLevel(p, "废品") > 5000000000, bonus: { attackMultiplier: 1.5 } },
        { name: "八荒之剑我为尊", condition: (p) => getEquipLevel(p, "废品") > 10000000000, bonus: { attackMultiplier: 1.5 } }
    ]
};
// 辅助函数：检查是否拥有指定魂环
function hasSoulRing(player, typeName) {
return player.soulRings.some(ring => ring.type === typeName);
}

// 辅助函数：获取指定类型装备的最高等级
function getEquipLevel(player, equipName) {
return player.dungeonEquipment
.filter(eq => eq.name === equipName)
.reduce((max, eq) => Math.max(max, eq.level || 0), 0);
}

// 显示称号界面
function showTitleDialog() {
   if (player.reincarnationCount < 10) {
        alert("需要达到10转才能开启称号系统！");
        return;
    }
    checkTitleUnlocks(); // 先检查解锁状态
    renderTitleBranches(); // 渲染称号
    document.getElementById("titleDialog").style.display = "block";
    document.getElementById("titleOverlay").style.display = "block";
}

// 关闭称号界面
function closeTitleDialog() {
    document.getElementById("titleDialog").style.display = "none";
    document.getElementById("titleOverlay").style.display = "none";
}

// 检查并解锁称号
function checkTitleUnlocks() {
    let newlyUnlocked = false;
    // 遍历所有分支的称号
    Object.values(titleConfig).forEach(branch => {
        branch.forEach(title => {
            if (!player.titles.unlocked.includes(title.name) && title.condition(player)) {
                player.titles.unlocked.push(title.name);
                newlyUnlocked = true;
                
                // 应用称号加成
                if (title.bonus) {
                    applyTitleBonus(title.bonus);
                }
                
                logAction(`解锁新称号：${title.name}`, 'success');
            }
        });
    });
    if (newlyUnlocked) {
        saveGame();
    }
}

// 应用称号加成
function applyTitleBonus(bonus) {
    // 直接修改玩家属性
    if (bonus.attackMultiplier) {
        player.battle.playerAttack = multiplyBigByFinite(player.battle.playerAttack, bonus.attackMultiplier);
    }
    if (bonus.healthMultiplier) {
        player.battle.playerHealth = bMul(player.battle.playerHealth, bonus.healthMultiplier);
    }
    if (bonus.critMultiplier) {
        player.battle.playerCritDamage *= bonus.critMultiplier;
    }
    // 其他属性...
    
    logAction(`称号加成生效: ${JSON.stringify(bonus)}`, 'success');
    updatePlayerBattleStats();
}

// 渲染称号分支
function renderTitleBranches() {
    // 遍历每个分支并渲染
    Object.entries(titleConfig).forEach(([branchKey, titles]) => {
        const container = document.getElementById(`${branchKey}Container`);
        if (!container) return;
        
        container.innerHTML = "";
        titles.forEach(title => {
            // 只显示已解锁的称号
            if (player.titles.unlocked.includes(title.name)) {
                const isSelected = player.titles.current === title.name;
                const titleEl = document.createElement("div");
                titleEl.className = `titleItem unlocked ${isSelected ? 'selected' : ''}`;
                titleEl.textContent = title.name;
                titleEl.onclick = () => selectTitle(title.name);
                container.appendChild(titleEl);
            }
        });
    });
}

// 选择称号
function selectTitle(titleName) {
    if (player.titles.unlocked.includes(titleName)) {
        player.titles.current = titleName;
        logAction(`已选择称号：${titleName}`, 'info');
        renderTitleBranches(); // 更新选中状态
        updateDisplay(); // 更新玩家名字旁的称号显示
        saveGame();
    }
}
// 计算称号总加成（在属性计算处调用）
function calculateTotalBonuses() {
    const bonuses = {
        attackMultiplier: 1,
        healthMultiplier: 1,
        critMultiplier: 1
    };
    
    // 累加所有已解锁称号的加成
    player.titles.unlocked.forEach(titleName => {
        // 查找对应的称号配置
        for (const branch of Object.values(titleConfig)) {
            for (const title of branch) {
                if (title.name === titleName && title.bonus) {
                    // 累乘加成
                    if (title.bonus.attackMultiplier) {
                        bonuses.attackMultiplier *= title.bonus.attackMultiplier;
                    }
                    if (title.bonus.healthMultiplier) {
                        bonuses.healthMultiplier *= title.bonus.healthMultiplier;
                    }
                    if (title.bonus.critMultiplier) {
                        bonuses.critMultiplier *= title.bonus.critMultiplier;
                    }
                    break;
                }
            }
        }
    });
    
    return bonuses;
}


// 伴侣数量上限
const COMPANION_MAX_LIMIT = 100;
const COMPANION_LEVEL_MAX = 999999;

function getCompanionUpgradeCost(level) {
    const lv = Math.max(1, Math.floor(Number(level) || 1));
    const tier = Math.floor((lv - 1) / 10000); // 每10000级一个档位
    const baseCost = 10 * lv;
    const tierMultiplier = Math.pow(2, tier); // 每档消耗×2
    return Math.floor(baseCost * tierMultiplier);
}

// 伴侣品阶配置
const companionRarities = {
    white: { 
        name: "普通", 
        color: "#FFFFFF", 
        baseScore: 100,
        upgradeMultiplier: 1,
        talentCount: 4,
        talentRange: [0, 3], // 初级到终极
        decomposeRose: 5,
         soulItem: "banlv1"
    },
    blue: { 
        name: "稀有", 
        color: "#0000FF", 
        baseScore: 500,
        upgradeMultiplier: 3,
        talentCount: 5,
        talentRange: [0, 4], // 初级到圣级
        decomposeRose: 20,
         soulItem: "banlv2"
    },
    epic: { 
        name: "史诗", 
        color: "#800080", 
        baseScore: 1000,
        upgradeMultiplier: 10,
        talentCount: 6,
        talentRange: [0, 5], // 初级到神级
        decomposeRose: 50,
         soulItem: "banlv3"
    },
    pink: { 
        name: "卓越", 
        color: "#FF69B4", 
        baseScore: 3000,
        upgradeMultiplier: 20,
        talentCount: 7,
        talentRange: [0, 6], // 初级到远古
        decomposeRose: 100,
         soulItem: "banlv4"
    },
    orange: { 
        name: "完美", 
        color: "#FFA500", 
        baseScore: 5000,
        upgradeMultiplier: 50,
        talentCount: 8,
        talentRange: [0, 15], // 初级到太古
        decomposeRose: 200,
         soulItem: "banlv5"
    },
    red: { 
        name: "神赐", 
        color: "#FF0000", 
        baseScore: 8000,
        upgradeMultiplier: 100,
        talentCount: 10,
        talentRange: [0, 15], // 初级到洪荒
        decomposeRose: 1000,
         soulItem: "banlv6"
    },
   angel: { 
        name: '天使', 
        color: '#87CEEB',
        baseScore: 1000,
        upgradeMultiplier: 30,
        talentCount: 0, // 动态计算
        talentRange: [0, 15], // 可达到洪荒级别
        decomposeRose: 100,
         soulItem: "banlv7"
    },
  emyyyy: { 
        name: '恶魔', 
        color: '#E63946',
        baseScore: 1000,
        upgradeMultiplier: 25,
        talentCount: 0, // 动态计算
        talentRange: [0, 15], // 可达到洪荒级别
        decomposeRose: 100,
         soulItem: "banlv8"
    },
  jlyyyy: { 
        name: '妖精', 
        color: '#7CFC00',
        baseScore: 1000,
        upgradeMultiplier: 20,
        talentCount: 0, // 动态计算
        talentRange: [0, 15], // 可达到洪荒级别
        decomposeRose: 100,
         soulItem: "banlv9"
    }
};

// 天赋类型配置
const talentTypes = [
    {
        name: "攻击",
        base: 1,
        perLevel: 5,
        description: (level) => `玩家总和攻击+${(1 + 5 * level).toFixed(1)}倍`
    },
    {
        name: "爆伤",
        base: 1,
        perLevel: 5,
        description: (level) => `玩家总和爆伤+${(1 + 5 * level).toFixed(1)}倍`
    },
    {
        name: "生命",
        base: 0.001,
        perLevel: 0.001,
        description: (level) => `玩家总和生命+${(0.001 + 0.001 * level).toFixed(3)}倍`
    },
    {
        name: "全属性",
        base: 0.5,
        perLevel: 2.5,
        description: (level) => `玩家总和全属性+${(0.5 + 2.5 * level).toFixed(2)}倍`
    },
    {
        name: "连击",
        base: 1,
        perLevel: 5,
        description: (level) => `玩家连击+${1 + 5 * level}`
    },
    {
        name: "暴击率",
        base: 0.001,
        perLevel: 0.001,
        description: (level) => `玩家暴击率+${(0.001 + 0.001 * level).toFixed(3)}倍`
    }
];

// 天赋品阶名称
const talentRanks = ["初级", "中级", "高级", "终极", "圣级", "神级", "远古", "太古", "洪荒", "无上", "太初", "混沌", "虚数", "永恒", "归墟", "炁叕"];

const washRankWeights = [48, 40, 32, 24, 18, 12, 8, 5, 4, 3, 2, 1, 1, 1, 1, 1];
const washRankTotal = washRankWeights.reduce((a,b)=>a+b,0);
function getWashTalentRank() {
    let r = Math.random() * washRankTotal;
    for (let i = 0; i < 16; i++) {
        if (r < washRankWeights[i]) return i;
        r -= washRankWeights[i];
    }
    return 15;
}

// 伴侣名字库
const companionNames = ["闫闫", "茶茶", "沈砚山", "苏绾月", "林清瑶", "楚棠溪", "慕玄尘", "许清尘", "温玉珞", "林灵枢", "叶棠音", "陆剑尘", "楚絮晚", "陆星辞", "王富贵", "洛千尘", "白小纯", "白芷晴", "顾长歌", "沈青岚", "慕雨柔", "陆天行", "乔曦", "柳如烟", "香香", "尝试", "小萝莉", "通元", "鱼鱼", "花花"];

// 抽奖概率
const drawProbabilities = [
    {rarity: "white", prob: 0.8},
    {rarity: "blue", prob: 0.15},
    {rarity: "epic", prob: 0.01889},
    {rarity: "pink", prob: 0.001},
    {rarity: "orange", prob: 0.0001},
    {rarity: "red", prob: 0.00001}
];
const guaranteeThresholds = {
    epic: 100,   // 100次保底史诗
    pink: 500,   // 500次保底卓越
    orange: 1000, // 1000次保底完美
    red: 5000    // 5000次保底神赐
};

// 打开伴侣系统
function openCompanionSystem() {
 if (player.reincarnationCount < 30) {
        alert("需要达到30转才能开启伴侣系统！");
        return;
    }
    document.getElementById('companionSystem').style.display = 'block';
    document.getElementById('companionOverlay').style.display = 'block';
    updateCompanionDisplay();
    if (typeof initAutoDecomposeUI === 'function') initAutoDecomposeUI(); // 打开伴侣界面时同步自动分解下拉与按钮，主循环不再每秒调用
   calculateOfflineExpeditionRewards();
    updateExpeditionUI();
}

// 关闭伴侣系统
function closeCompanionSystem() {
    document.getElementById('companionSystem').style.display = 'none';
    document.getElementById('companionOverlay').style.display = 'none';
}

// 更新伴侣系统显示
function updateCompanionDisplay() {
    // 更新等级和消耗
    player.companionLevel = Math.max(1, Math.min(COMPANION_LEVEL_MAX, Math.floor(Number(player.companionLevel) || 1)));
    document.getElementById('companionLevel').textContent = player.companionLevel >= COMPANION_LEVEL_MAX ? (COMPANION_LEVEL_MAX + ' MAX') : player.companionLevel;
    document.getElementById('upgradeCost').textContent = player.companionLevel >= COMPANION_LEVEL_MAX ? 'MAX' : getCompanionUpgradeCost(player.companionLevel);
    document.getElementById('companionKeyCount').textContent = player.items.companionKey;
    // 更新保底计数器显示
    document.getElementById('epicGuarantee').textContent = player.companionChestGuarantee.epic;
    document.getElementById('pinkGuarantee').textContent = player.companionChestGuarantee.pink;
    document.getElementById('orangeGuarantee').textContent = player.companionChestGuarantee.orange;
    document.getElementById('redGuarantee').textContent = player.companionChestGuarantee.red;
    // 更新伴侣数量显示 当前/上限
    document.getElementById('companionCountDisplay').textContent = player.companions.length + '/' + COMPANION_MAX_LIMIT;
    // 更新伴侣列表
    const listContainer = document.getElementById('companionList');
    listContainer.innerHTML = '';
    const companion = player.companions.find(c => c.id === player.equippedCompanionId);
    if (companion) {
        const rarityConfig = companionRarities[companion.rarity] || {};
        const bonuses = getCompanionBonuses();
        
        // 更新显示
        const uiScore = Math.min(Number(companion.score) || 0, 50000);
        document.getElementById('qualityMultiplier').textContent = 
    `${(Math.floor(uiScore / 100) + companionRarities[companion.rarity].upgradeMultiplier).toFixed(2)}x`;
        document.getElementById('attackTotalBonus').textContent = `${bonuses.attackMultiplier.toFixed(3)}倍`;
        document.getElementById('healthTotalBonus').textContent = `${bonuses.healthMultiplier.toFixed(3)}倍`;
        document.getElementById('critRateTotalBonus').textContent = `${bonuses.critRateMultiplier.toFixed(3)}倍`;
        document.getElementById('critDamageTotalBonus').textContent = `${bonuses.critDamageMultiplier.toFixed(3)}倍`;
        document.getElementById('comboTotalBonus').textContent = bonuses.combo;
        document.getElementById('allStatsTotalBonus').textContent = `${bonuses.allStatsMultiplier.toFixed(3)}倍`;
    } else {
        // 未装备伴侣时显示默认值
        const defaultText = '未装备';
        document.getElementById('qualityMultiplier').textContent = defaultText;
        document.getElementById('attackTotalBonus').textContent = defaultText;
        document.getElementById('healthTotalBonus').textContent = defaultText;
        document.getElementById('critRateTotalBonus').textContent = defaultText;
        document.getElementById('critDamageTotalBonus').textContent = defaultText;
        document.getElementById('comboTotalBonus').textContent = defaultText;
        document.getElementById('allStatsTotalBonus').textContent = defaultText;
    }

    player.companions.forEach(companion => {
        const isEquipped = player.equippedCompanionId === companion.id;
const rarityConfig = companionRarities[companion.rarity] || {};
        const rarityName = rarityConfig.name || "未知";
        const rarityColor = rarityConfig.color || "#CCCCCC";
        
        // 特殊处理天使品质的显示
        let displayName = companion.name;
        if (companion.rarity === 'angel') {
            displayName = `天使·${companion.name}`;
        }
        const capScore = Math.min(companion.score, 50000);
        let filled, emptyChar, filledChar;
        if (capScore <= 10000) {
            filled = Math.min(10, Math.floor(capScore / 1000));
            filledChar = '★'; emptyChar = '☆';
        } else if (capScore <= 20000) {
            filled = Math.min(10, Math.floor((capScore - 10000) / 1000));
            filledChar = '●'; emptyChar = '○';
        } else if (capScore <= 30000) {
            filled = Math.min(10, Math.floor((capScore - 20000) / 1000));
            filledChar = '◆'; emptyChar = '◇';
        } else if (capScore <= 40000) {
            filled = Math.min(10, Math.floor((capScore - 30000) / 1000));
            filledChar = '■'; emptyChar = '□';
        } else {
            filled = Math.min(10, Math.floor((capScore - 40000) / 1000));
            filledChar = '▲'; emptyChar = '△';
        }
        const scoreIcons = filledChar.repeat(filled) + emptyChar.repeat(10 - filled);
        
        const card = document.createElement('div');
        const rc = companionRarities[companion.rarity].color;
        card.style = `background: linear-gradient(165deg, ${rc}28 0%, ${rc}18 35%, rgba(25,32,39,0.97) 70%, rgba(18,24,30,0.98) 100%); border: 1px solid ${rc}66; border-radius: 12px; padding: 12px; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.35), 0 0 20px ${rc}25, inset 0 0 0 1px rgba(255,255,255,0.06);`;
        card.innerHTML = `
            <div style="position: absolute; top: 8px; right: 8px; font-size: 11px; padding: 2px 6px; border-radius: 6px; background: ${rc}22; color: ${rc}; border: 1px solid ${rc}55;">${companionRarities[companion.rarity].name}</div>
            <h4 style="color: ${rc}; margin: 0 0 6px 0; font-size: 15px; padding-right: 52px;">
                ${companion.name}
                <span style="margin-left: 4px; color: #ffd54f;">+${companion.advanceLevel || 0}</span>
                ${companion.locked ? ' <span style="font-size:12px;">🔒</span>' : ''}
            </h4>
            <div style="font-size: 11px; color: #90a4ae; margin-bottom: 8px;">${scoreIcons} <span style="color:#b0bec5;">(${capScore}/50000${(Number(companion.score) || 0) > 50000 ? ' MAX' : ''})</span></div>
            <div style="margin: 0; font-size: 11px; color: #b0bec5; max-height: 160px; overflow-y: auto; line-height: 1.4; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.06);">
                ${companion.talents.map(t => `${talentRanks[t.rank]}${talentTypes[t.type].name}: ${talentTypes[t.type].description(t.rank)}`).join('<br>')}
            </div>
            <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px;">
                <button onclick="equipCompanion('${companion.id}')" style="flex: 1; min-width: 52px; background: ${isEquipped ? 'linear-gradient(135deg,#43a047,#2e7d32)' : 'rgba(55,71,79,0.9)'}; color: #fff; border: none; padding: 5px 4px; border-radius: 8px; font-size: 11px; cursor: pointer;">${isEquipped ? '已装备' : '装备'}</button>
                <button onclick="toggleCompanionLock('${companion.id}')" style="min-width: 36px; background: ${companion.locked ? 'linear-gradient(135deg,#e53935,#c62828)' : 'rgba(55,71,79,0.9)'}; color: #fff; border: none; padding: 5px 6px; border-radius: 8px; font-size: 11px; cursor: pointer;">${companion.locked ? '已锁' : '开锁'}</button>
                <button onclick="decomposeCompanion('${companion.id}')" style="min-width: 36px; background: rgba(229,57,53,0.85); color: #fff; border: none; padding: 5px 6px; border-radius: 8px; font-size: 11px; cursor: pointer;" ${companion.locked ? 'disabled' : ''}>分解</button>
                <button onclick="advanceCompanion('${companion.id}')" style="min-width: 36px; background: rgba(255,193,7,0.9); color: #1a1a1a; border: none; padding: 5px 6px; border-radius: 8px; font-size: 11px; cursor: pointer;" ${companion.locked || !['white','blue','epic','pink', 'orange', 'red', 'angel', 'emyyyy', 'jlyyyy'].includes(companion.rarity) ? 'disabled' : ''}>进阶</button>
                <button onclick="openWashPanel('${companion.id}')" style="min-width: 36px; background: rgba(33,150,243,0.9); color: #fff; border: none; padding: 5px 6px; border-radius: 8px; font-size: 11px; cursor: pointer;" ${companion.locked || !['epic', 'pink', 'orange', 'red', 'angel', 'emyyyy', 'jlyyyy'].includes(companion.rarity) ? 'disabled' : ''}>洗练</button>
                <button onclick="openCombinePanel('${companion.id}')" style="min-width: 36px; background: rgba(156,39,176,0.9); color: #fff; border: none; padding: 5px 6px; border-radius: 8px; font-size: 11px; cursor: pointer;" ${companion.locked || !['epic', 'pink', 'orange', 'red', 'angel', 'emyyyy', 'jlyyyy'].includes(companion.rarity) ? 'disabled' : ''}>合成</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}
const expeditionConfig = {
    tasks: [
        {
            id: "forest",
            name: "迷雾森林",
            difficulty: "简单",
            duration: 30, // 分钟
            baseReward: {
                rose: 30,
                vipPower: 1,
                bait: 1
            },
            description: "探索神秘的迷雾森林，寻找稀有资源",
            companionRequirement: 3000 
        },
        {
            id: "mountain",
            name: "远古山脉",
            difficulty: "中等",
            duration: 60,
            baseReward: {
                rose: 80,
                vipPower: 3,
                bait: 3
            },
            description: "攀登危险的远古山脉，挑战极限",
            companionRequirement: 5000
        },
        {
            id: "ocean",
            name: "深渊海洋",
            difficulty: "困难",
            duration: 120,
            baseReward: {
                rose: 200,
                vipPower: 10,
                bait: 10
            },
            description: "潜入神秘的深渊海洋，探索未知领域",
            companionRequirement: 10000
        },
       {
            id: "volcano",
            name: "熔岩火山",
            difficulty: "极难",
            duration: 240,
            baseReward: {
                rose: 500,
                vipPower: 35,
                bait: 35
            },
            description: "穿越危险的熔岩火山，寻找传说宝藏",
            companionRequirement: 15000
        },
        {
            id: "emshen",
            name: "虚空裂缝",
            difficulty: "噩梦",
            duration: 480,
            baseReward: {
                rose: 1200,
                vipPower: 120,
                bait: 120
            },
            description: "穿越不稳定的虚空裂缝，直面维度之外的恐怖",
            companionRequirement: 20000
        },
        {
            id: "emyuan",
            name: "星际深渊",
            difficulty: "地狱",
            duration: 960,
            baseReward: {
                rose: 3000,
                vipPower: 480,
                bait: 480
            },
            description: "勇闯无尽的星际深渊，挑战宇宙终极奥秘",
            companionRequirement: 25000
        }
    ]
};

// 初始化伴侣探险数据
function initExpeditionData() {
    if (!player.companionExpedition) {
        player.companionExpedition = {
            currentExpedition: null,
            history: [],
            lastUpdate: Date.now()
        };
    }
}


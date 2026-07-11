// 等级与化圣
// 切换等级系统界面
function toggleLevelSystem() {
   if (player.reincarnationCount < 50) {
        alert("需要达到50转才能开启玩家等级！");
        return;
    }
    const overlay = document.getElementById('levelSystemOverlay');
    const ui = document.getElementById('levelSystemUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateLevelUI();
        updateDisplay();
    }
}
function ascendPlayer() {
    // 计算下次飞升所需等级
    const nextAscentionLevel = (player.level.ascentionCount + 1) * 100;
    
    // 检查是否满足飞升条件
    if (player.level.current < nextAscentionLevel) {
        logAction(`飞升需要等级${nextAscentionLevel}！当前等级${player.level.current}。`, "error");
        return;
    }
    
    // 执行飞升
    player.level.ascentionCount++;
    player.level.ascentionMultiplier =player.level.ascentionCount+1; // 属性加成
    player.level.current = 1; // 等级重置为1
    player.level.exp = 0;
    player.level.nextLevelExp = calculatePlayerNextLevelExp(player.level.current, player.level.ascentionCounta);
    
    // 更新加成
    const huaShengMul = (Number(player.level.huaShengMultiplier) || 1);
    player.level.clickBonus = 1 * player.level.ascentionMultiplier * player.level.ascentionMultipliera * huaShengMul;
    player.level.gpsBonus = 1 * player.level.ascentionMultiplier * player.level.ascentionMultipliera * huaShengMul;
    
    logAction(`飞升成功！当前飞升次数：${player.level.ascentionCount}，加成倍数：${player.level.ascentionMultiplier}`, "success");
    maybeNotifyReincarnationEligibleOnce();
    updateLevelUI();
    updateDisplay();
}
function ascendPlayera() {
    // 计算下次轮回所需等级
    const nextAscentionLevela = (player.level.ascentionCounta + 1) * 10;
    
    // 检查是否满足轮回条件
    if (player.level.ascentionCount < nextAscentionLevela) {
        logAction(`轮回需要飞升次数${nextAscentionLevela}！当前飞升次数${player.level.ascentionCount}。`, "error");
        return;
    }
    
    // 执行飞升
    player.level.ascentionCounta++;
    player.level.ascentionMultipliera =player.level.ascentionCounta*2; // 属性加成
    player.level.current = 1; // 等级重置为1
    player.level.ascentionCount= 0;
    player.level.ascentionMultiplier= 1;
    player.level.exp = 0;
    player.level.nextLevelExp = calculatePlayerNextLevelExp(player.level.current, player.level.ascentionCounta);
    
    // 更新加成
    const huaShengMul = (Number(player.level.huaShengMultiplier) || 1);
    player.level.clickBonus = 1 * player.level.ascentionMultiplier * player.level.ascentionMultipliera * huaShengMul;
    player.level.gpsBonus = 1 * player.level.ascentionMultiplier * player.level.ascentionMultipliera * huaShengMul;

    // 化圣：更高级的轮回突破
    const nextHuaShengRequirement = getNextHuaShengRequirement();
    if (player.level.ascentionCounta >= nextHuaShengRequirement) {
        huaShengPlayer();
        return;
    }
    
    logAction(`飞升成功！当前轮回次数：${player.level.ascentionCounta}，加成倍数：${player.level.ascentionMultipliera}`, "success");
    player.level.reincarnationEligibleHintForAca = null;
    updateLevelUI();
    updateDisplay();
}

// 计算下一次“化圣”所需的轮回次数阈值：30, 35, 40, ...
function getNextHuaShengRequirement() {
    const count = Math.floor(Number(player.level && player.level.huaShengCount) || 0);
    return 30 + count * 5;
}

// 化圣：属性 ×100，轮回次数回到 30
function huaShengPlayer() {
    // 化圣计数 +1
    player.level.huaShengCount = Math.floor(Number(player.level.huaShengCount) || 0) + 1;

    // 每次化圣属性提升 100 倍（乘法叠加）
    player.level.huaShengMultiplier = (Number(player.level.huaShengMultiplier) || 1) * 100;

    // 轮回次数回到 30 次
    player.level.ascentionCounta = 30;
    player.level.ascentionMultipliera = player.level.ascentionCounta * 2;

    // 化圣后沿用玩家等级重置逻辑（保持为 1 级）
    player.level.current = 1;
    player.level.ascentionCount = 0;
    player.level.ascentionMultiplier = 1;
    player.level.exp = 0;
    player.level.nextLevelExp = calculatePlayerNextLevelExp(player.level.current, player.level.ascentionCounta);

    const huaShengMul = (Number(player.level.huaShengMultiplier) || 1);
    player.level.clickBonus = player.level.current * 1 * player.level.ascentionMultiplier * player.level.ascentionMultipliera * huaShengMul;
    player.level.gpsBonus = player.level.current * 1 * player.level.ascentionMultiplier * player.level.ascentionMultipliera * huaShengMul;

    logAction(`化圣成功！化圣次数：${player.level.huaShengCount}，化圣倍率：${formatSci(player.level.huaShengMultiplier)}x（轮回回到30）`, 'success');
    player.level.reincarnationEligibleHintForAca = null;
    updateLevelUI();
    updateDisplay();
    if (typeof saveGame === 'function') saveGame({ silent: true });
}

// 化圣按钮点击入口：做门槛检查，避免玩家直接跳过
function tryHuaShengPlayer() {
    const nextHuaShengRequirement = getNextHuaShengRequirement();
    if ((player.level.ascentionCounta || 0) < nextHuaShengRequirement) {
        logAction(`化圣需要轮回次数 >= ${nextHuaShengRequirement}！当前轮回 ${player.level.ascentionCounta || 0}。`, "error");
        return;
    }
    huaShengPlayer();
}
// 更新等级界面（面板未打开时不操作 DOM，避免世界地图每次击杀重复刷新隐藏面板）
var _levelSystemUICache = null;
function updateLevelUI() {
    var ui = document.getElementById('levelSystemUI');
    if (!ui || ui.style.display !== 'block') return;
    if (!_levelSystemUICache) {
        _levelSystemUICache = {
            currentPlayerLevel: document.getElementById('currentPlayerLevel'),
            currentPlayerExp: document.getElementById('currentPlayerExp'),
            nextLevelExpq: document.getElementById('nextLevelExpq'),
            clickBonus: document.getElementById('clickBonus'),
            gpsBonus: document.getElementById('gpsBonus'),
            ascentionCount: document.getElementById('ascentionCount'),
            ascentionMultiplier: document.getElementById('ascentionMultiplier'),
            nextAscentionRequirement: document.getElementById('nextAscentionRequirement'),
            ascentionCounta: document.getElementById('ascentionCounta'),
            ascentionMultipliera: document.getElementById('ascentionMultipliera'),
            nextAscentionRequirementa: document.getElementById('nextAscentionRequirementa'),
            huaShengCountDisplay: document.getElementById('huaShengCountDisplay'),
            huaShengMultiplierDisplay: document.getElementById('huaShengMultiplierDisplay'),
            nextHuaShengRequirementDisplay: document.getElementById('nextHuaShengRequirementDisplay'),
            huaShengBtn: document.getElementById('huaShengBtn'),
            playerExpProgress: document.getElementById('playerExpProgress')
        };
    }
    var c = _levelSystemUICache;
    if (!c.currentPlayerLevel) return;
    c.currentPlayerLevel.textContent = player.level.current;
    c.currentPlayerExp.textContent = formatSci(player.level.exp);
    c.nextLevelExpq.textContent = formatSci(player.level.nextLevelExp);
    c.clickBonus.textContent = formatSci(player.level.clickBonus) + '倍';
    c.gpsBonus.textContent = formatSci(player.level.gpsBonus) + '倍';
    c.ascentionCount.textContent = player.level.ascentionCount;
    c.ascentionMultiplier.textContent = player.level.ascentionMultiplier + '倍';
    c.nextAscentionRequirement.textContent = (player.level.ascentionCount + 1) * 100;
    c.ascentionCounta.textContent = player.level.ascentionCounta;
    c.ascentionMultipliera.textContent = player.level.ascentionMultipliera + '倍';
    c.nextAscentionRequirementa.textContent = (player.level.ascentionCounta + 1) * 10;
    c.huaShengCountDisplay.textContent = player.level.huaShengCount || 0;
    c.huaShengMultiplierDisplay.textContent = formatSci(player.level.huaShengMultiplier || 1);
    c.nextHuaShengRequirementDisplay.textContent = getNextHuaShengRequirement();
    if (c.huaShengBtn) {
        var nextReq = getNextHuaShengRequirement();
        c.huaShengBtn.disabled = (player.level.ascentionCounta || 0) < nextReq;
        c.huaShengBtn.style.opacity = c.huaShengBtn.disabled ? 0.55 : 1;
    }
    var progress = (player.level.exp / player.level.nextLevelExp) * 100;
    if (c.playerExpProgress) c.playerExpProgress.style.width = progress + '%';
}


function getReincarnationLevelExpMultiplier(cycleCount) {
    const a = Math.floor(Number(cycleCount) || 0);
    if (a <= 30) return 1;
    const exponent = Math.floor((a - 31) / 10) + 1;
    return Math.pow(4, exponent);
}

function calculatePlayerNextLevelExp(level, cycleCount) {
    const lv = Math.max(1, Math.floor(Number(level) || 1));
    const cycle = Math.max(0, Math.floor(Number(cycleCount) || 0));
    const ascent = Math.max(0, Math.floor(Number(player.level && player.level.ascentionCount) || 0));
    const baseExp = 5600; // 升级所需经验基准
    // 经验曲线：轮回越高仍会变难，但比之前缓和
    const levelCurve = Math.pow(lv, 1.12);
    const ascentCurve = Math.pow(1 + ascent * 0.2, 1.32);
    const cycleLinear = 1 + cycle * 0.68;
    const cycleStage = getReincarnationLevelExpMultiplier(cycle);
    const cyclePower = Math.pow(1.065, cycle);
    const lateCycleBoost = cycle >= 20 ? Math.pow(1.18, cycle - 19) : 1;
    // 轮回30后：每10轮回触发一次更大阶跃（30/40/50...），并随档位递增
    let post30StepBoost = 1;
    if (cycle >= 30) {
        const tierCount = Math.floor((cycle - 30) / 10) + 1; // 30-39=1档，40-49=2档...
        for (let i = 1; i <= tierCount; i++) {
            post30StepBoost *= Math.pow(1.45, i);
        }
    }
    // 轮回 20 起：在公式结果上再提高一截（略抬高后期难度）
    const cycle20PlusFactor = cycle >= 20 ? 1.28 : 1;
    const globalExpNeedFactor = 1.06; // 全轮回段略抬高所需经验
    // 轮回 10 前（0～9）：所需经验再打折扣，低轮回阶段更易升级
    const earlyCycleEase = cycle < 10 ? 0.78 : 1;
    const out = Math.floor(baseExp * levelCurve * ascentCurve * cycleLinear * cyclePower * lateCycleBoost * post30StepBoost * cycleStage * cycle20PlusFactor * globalExpNeedFactor * earlyCycleEase);
    return Number.isFinite(out) && out > 0 ? out : baseExp;
}

// 飞升次数达到「下一次轮回」要求时，游戏日志只提示一次（同一轮回阶段内不重复）
function maybeNotifyReincarnationEligibleOnce() {
    if (!player || !player.level) return;
    const ac = Math.floor(Number(player.level.ascentionCount) || 0);
    const aca = Math.floor(Number(player.level.ascentionCounta) || 0);
    const need = (aca + 1) * 10;
    if (ac < need) return;
    const prev = player.level.reincarnationEligibleHintForAca;
    if (prev != null && Number(prev) === aca) return;
    player.level.reincarnationEligibleHintForAca = aca;
    logAction(`已达到第${aca + 1}次轮回条件，可进行轮回！`, 'info');
}

// 升级玩家等级
function upgradePlayerLevel(amount) {
    for (let i = 0; i < amount; i++) {
        if (player.level.exp >= player.level.nextLevelExp) {
            player.level.exp -= player.level.nextLevelExp;
            player.level.current++;
            
           
            player.level.nextLevelExp = calculatePlayerNextLevelExp(player.level.current, player.level.ascentionCounta);
            
            // 计算加成，考虑飞升倍数
            const huaShengMul = (Number(player.level.huaShengMultiplier) || 1);
            player.level.clickBonus = player.level.current * 1 * player.level.ascentionMultiplier * player.level.ascentionMultipliera * huaShengMul;
            player.level.gpsBonus = player.level.current * 1 * player.level.ascentionMultiplier * player.level.ascentionMultipliera * huaShengMul;
            // 不在游戏日志中逐条输出等级提升（连升多级会刷屏卡顿）；当前等级见顶栏/UI
            // 检查飞升条件 - 达标自动飞升
            const nextAscentionLevel = (player.level.ascentionCount + 1) * 100;
            if (player.level.current >= nextAscentionLevel) {
                ascendPlayer();
                break;
            }
        } else break;
    }
    updateLevelUI();
    updateDisplay();
}

// 添加经验
function addPlayerExp(amount) {
    const add = Number(amount) || 0;
    if (!Number.isFinite(add) || add <= 0) return;
    player.level.exp += add;
    
    // 检查是否可以升级
    while (player.level.exp >= player.level.nextLevelExp) {
        upgradePlayerLevel(1);
    }
    maybeNotifyReincarnationEligibleOnce();
    updateLevelUI();
}

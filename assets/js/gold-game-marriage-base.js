// 结婚系统基础
// 切换结婚系统界面
function toggleMarriageSystem() {
    if (player.investmentGame.userData.totalAssets < 50000) {
        alert("需要资金总额达到5W才能开启结婚系统！");
        return;
    }
    
    const ui = document.getElementById('marriageSystemUI');
    const overlay = document.getElementById('marriageSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        initMarriageData();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateMarriageUI();
    }
}

function closeMarriageSystem() {
    document.getElementById('marriageSystemUI').style.display = 'none';
    document.getElementById('marriageSystemOverlay').style.display = 'none';
}

function switchMarriageTab(tabName) {
    document.querySelectorAll('.marriage-panel .m-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.marriage-panel .m-section').forEach(function(s) { s.classList.remove('active'); });
    var tab = document.querySelector('.marriage-panel .m-tab[data-tab="' + tabName + '"]');
    var section = document.getElementById('marriageSection' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (tab) tab.classList.add('active');
    if (section) section.classList.add('active');
}

// 更新结婚系统UI
function updateMarriageUI() {
    const marriage = player.marriage;
    
    if (marriage.isMarried) {
        var expReq = getLoveExpRequired(marriage.loveLevel);
        var expNum = (typeof expReq === 'number') ? expReq : 999999999;
        var pct = marriage.loveLevel >= 999 ? 100 : (expNum > 0 ? Math.min(100, Math.floor(100 * marriage.loveExp / expNum)) : 0);
        document.getElementById('spouseInfo').innerHTML = 
            '<div class="m-info-row"><span>配偶</span><span>' + marriage.spouseName + '</span></div>' +
            '<div class="m-info-row"><span>性别</span><span>' + (marriage.spouseGender === 'male' ? '男性' : '女性') + '</span></div>' +
            '<div class="m-info-row"><span>结婚日期</span><span>' + new Date(marriage.marriageDate).toLocaleDateString() + '</span></div>' +
            '<div class="m-info-row"><span>恩爱等级</span><span>' + marriage.loveLevel + (marriage.loveLevel >= 999 ? ' (MAX)' : '') + '</span></div>' +
            '<div class="m-info-row"><span>赠送礼物</span><span>' + (marriage.totalGifts || 0) + ' 次</span></div>' +
            '<div class="m-info-row"><span>共度时光</span><span>' + (marriage.totalTimeSpent || 0) + ' 次</span></div>' +
            '<div class="m-info-row"><span>全国旅行</span><span>' + (marriage.totalAimeSpent || 0) + ' 次</span></div>' +
            (marriage.ringLevel ? '<div class="m-info-row"><span>婚戒等级</span><span>' + marriage.ringLevel + ' 级</span></div>' : '');
        document.getElementById('loveProgressWrap').style.display = 'block';
        document.getElementById('loveExpText').textContent = marriage.loveExp + '/' + (marriage.loveLevel >= 999 ? 'MAX' : expReq);
        document.getElementById('loveBar').style.width = pct + '%';
    } else {
        document.getElementById('spouseInfo').innerHTML = '<div class="m-info-row"><span>状态</span><span>当前单身，快去求婚吧</span></div>';
        document.getElementById('loveProgressWrap').style.display = 'none';
    }
    var tabProposal = document.getElementById('marriageTabProposal');
    if (tabProposal) tabProposal.style.display = marriage.isMarried ? 'none' : '';

    // 根据结婚状态控制各标签显示：未结婚时隐藏「状态 / 互动 / 趣味玩法 / 加成」，仅保留「求婚」
    var tabsToToggle = ['status', 'interact', 'fun', 'bonus'];
    tabsToToggle.forEach(function(name) {
        var el = document.querySelector('.marriage-panel .m-tab[data-tab="' + name + '"]');
        if (el) {
            el.style.display = marriage.isMarried ? '' : 'none';
        }
    });

    // 默认选中合适的标签
    if (marriage.isMarried) {
        switchMarriageTab('status');
    } else {
        switchMarriageTab('proposal');
    }

    updateMarriageBonuses();
    updateMarriageFunHint();
}

function updateMarriageFunHint() {
    var el = document.getElementById('marriageFunHint');
    if (!el) return;
    var m = player.marriage;
    if (!m || !m.isMarried) { el.innerHTML = '结婚后解锁趣味玩法。'; return; }
    var ring = (m.ringLevel || 0);
    var txt = '婚戒 ' + ring + ' 级 |                      你是我心跳漏拍的理由，是时光里最绵长的回响。此生只愿与你，共朝暮，度春秋。';
    el.innerHTML = txt;
}

// 求婚功能
function proposeMarriage() {
    const spouseName = document.getElementById('spouseNameInput').value.trim();
    const spouseGender = document.getElementById('spouseGenderSelect').value;
    
    if (!spouseName) {
        logAction("请输入伴侣名字", "error");
        return;
    }
    
    if (spouseName.length > 10) {
        logAction("伴侣名字不能超过10个字符", "error");
        return;
    }
    
    if (player.investmentGame.userData.availableFunds < 388888) {
        logAction("资金不足！需要38.8888W元彩礼", "error");
        return;
    }
    
    // 扣除转生币
    player.investmentGame.userData.availableFunds -= 388888;
    
    // 设置婚姻状态
    player.marriage.isMarried = true;
    player.marriage.spouseName = spouseName;
    player.marriage.spouseGender = spouseGender;
    player.marriage.marriageDate = Date.now();
    player.marriage.loveLevel = 1;
    player.marriage.loveExp = 0;
    
    logAction(`恭喜！您与 ${spouseName} 结婚了！`, "success");
    updateMarriageUI();
    updateDisplay();
    saveGame();
}

// 赠送礼物
function giveGiftToSpouse() {
    if (!player.marriage.isMarried) return;
    
    // 检查等级上限
    if (player.marriage.loveLevel >= 999) {
        logAction("恩爱等级已达上限(999级)，无法继续提升", "info");
        return;
    }
    
    if (player.investmentGame.userData.availableFunds < 1314) {
        logAction("资金不足！需要1314元", "error");
        return;
    }
    
    // 扣除资金
    player.investmentGame.userData.availableFunds -= 1314;
    
    // 增加恩爱经验
    const expGain = 100;
    player.marriage.loveExp += expGain;
    player.marriage.totalGifts++;
    addMarriageDailyQuestProgress(1, 0);
    checkLoveLevelUp();
    logAction(`您向 ${player.marriage.spouseName} 赠送了礼物，恩爱经验+${expGain}`, "success");
    updateMarriageUI();
    updateDisplay();
    saveGame();
}

// 共度时光
function spendTimeWithSpouse() {
    if (!player.marriage.isMarried) return;
    
    // 检查等级上限
    if (player.marriage.loveLevel >= 999) {
        logAction("恩爱等级已达上限(999级)，无法继续提升", "info");
        return;
    }
    
    if (player.investmentGame.userData.availableFunds < 99999) {
        logAction("资金不足！需要99999元", "error");
        return;
    }
    
    // 扣除转生币
    player.investmentGame.userData.availableFunds -= 99999;
    
    // 增加恩爱经验
    const expGain = 7000;
    player.marriage.loveExp += expGain;
    player.marriage.totalTimeSpent++;
    addMarriageDailyQuestProgress(0, 1);
    checkLoveLevelUp();
    logAction(`您与 ${player.marriage.spouseName} 共度了美好时光，恩爱经验+${expGain}`, "success");
    updateMarriageUI();
    updateDisplay();
    saveGame();
}

// 全国旅行
function spendAimeWithSpouse() {
    if (!player.marriage.isMarried) return;
    
    // 检查等级上限
    if (player.marriage.loveLevel >= 999) {
        logAction("恩爱等级已达上限(999级)，无法继续提升", "info");
        return;
    }
    
    if (player.marriage.loveLevel < 20) {
        alert("需要结婚等级20级！");
        return;
    }
    
    if (player.investmentGame.userData.availableFunds < 5201314) {
        logAction("资金不足！需要5201314元", "error");
        return;
    }
    
    // 扣除转生币
    player.investmentGame.userData.availableFunds -= 5201314;
    
    // 增加恩爱经验
    const expGain = 370000;
    player.marriage.loveExp += expGain;
    player.marriage.totalAimeSpent++;
    
    // 检查是否升级
    checkLoveLevelUp();
    
    logAction(`您与 ${player.marriage.spouseName} 全国旅行，恩爱经验+${expGain}`, "success");
    updateMarriageUI();
    updateDisplay();
    saveGame();
}

// 离婚
function divorce() {
    if (!player.marriage.isMarried) return;
    
    showCustomConfirm(`确定要与 ${player.marriage.spouseName} 离婚吗？这将失去所有婚姻加成！`, (confirmed) => {
        if (confirmed) {
            const spouseName = player.marriage.spouseName;
            
            // 重置婚姻状态（含趣味玩法数据）
            var def = getDefaultMarriageData();
            def.isMarried = false;
            player.marriage = def;
            logAction(`您与 ${spouseName} 离婚了`, "info");
            updateMarriageUI();
            updateDisplay();
            saveGame();
        }
    });
}

// 重命名伴侣
function renameSpouse() {
    if (!player.marriage.isMarried) return;
    
    showCustomPrompt(`请输入新的伴侣名字（当前: ${player.marriage.spouseName}）:`, (newName) => {
        if (newName && newName.trim()) {
            const oldName = player.marriage.spouseName;
            player.marriage.spouseName = newName.trim();
            
            logAction(`已将伴侣名字从 ${oldName} 改为 ${newName}`, "success");
            updateMarriageUI();
            saveGame();
        }
    });
}


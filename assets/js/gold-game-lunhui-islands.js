function toggleLunhuiPenglai() {
    if (!player.lunhuiPenglai) {
        player.lunhuiPenglai = { bossLevel: 1, bossHealth: 1e123, bossAttack: 1e23, bossMaxHealth: 1e123, bossResurrections: 0, isBattling: false, playerHealth: 0, playerAttack: 0, playerCritRate: 0, playerCritDamage: 0 };
    }
    if (player.level.ascentionCounta < 3) {
        alert("需要达到轮回3转才能开启轮回仙岛副本！");
        return;
    }
    var overlay = document.getElementById('lunhuiPenglaiOverlay');
    var ui = document.getElementById('lunhuiPenglaiUI');
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
        stopLunhuiCopyAutoAttack(player.lunhuiPenglai, 'lunhuiPenglaiAutoAttackStatus');
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateLunhuiPenglaiUI();
    }
}

function updateLunhuiPenglaiUI() {
    if (typeof ensureLunhuiBattleChrome === 'function') {
        ensureLunhuiBattleChrome('lunhuiPenglai', { bossName: '太古玄冥', glyph: '岛' });
    }
    document.getElementById('lunhuiPenglaiTokenCount').textContent = player.items.fuben1 || 0;
    var playerStats = calculatePlayerBattleStats();
    var battling = !!(player.lunhuiPenglai && player.lunhuiPenglai.isBattling);
    document.getElementById('lunhuiPenglaiPlayerHealth').textContent = formatSci(battling ? player.lunhuiPenglai.playerHealth : playerStats.health);
    document.getElementById('lunhuiPenglaiPlayerAttack').textContent = formatSci(battling ? player.lunhuiPenglai.playerAttack : playerStats.attack);
    document.getElementById('lunhuiPenglaiPlayerCritRate').textContent = ((battling ? player.lunhuiPenglai.playerCritRate : playerStats.critRate) * 100).toFixed(2) + '%';
    document.getElementById('lunhuiPenglaiPlayerCritDamage').textContent = ((battling ? player.lunhuiPenglai.playerCritDamage : playerStats.critDamage) * 100).toFixed(2) + '%';
    document.getElementById('lunhuiPenglaiBossLevel').textContent = player.lunhuiPenglai.bossLevel;
    document.getElementById('lunhuiPenglaiBossHealth').textContent = formatSci(player.lunhuiPenglai.bossHealth);
    document.getElementById('lunhuiPenglaiBossMaxHealth').textContent = formatSci(player.lunhuiPenglai.bossMaxHealth);
    document.getElementById('lunhuiPenglaiBossAttack').textContent = formatSci(player.lunhuiPenglai.bossAttack);
    document.getElementById('lunhuiPenglaiBossResurrections').textContent = player.lunhuiPenglai.bossResurrections;
    var startBtn = document.getElementById('startLunhuiPenglaiBattleBtn');
    var attackBtn = document.getElementById('attackLunhuiPenglaiBossBtn');
    var autoBtn = document.getElementById('autoAttackLunhuiPenglaiBossBtn');
    var fleeBtn = document.getElementById('fleeLunhuiPenglaiBossBtn');
    if (battling) {
        startBtn.style.display = 'none';
        attackBtn.style.display = 'inline-block';
        if (autoBtn) autoBtn.style.display = 'inline-block';
        fleeBtn.style.display = 'inline-block';
    } else {
        startBtn.style.display = 'inline-block';
        attackBtn.style.display = 'none';
        if (autoBtn) autoBtn.style.display = 'none';
        fleeBtn.style.display = 'none';
    }
    setLunhuiCopyAutoAttackStatus('lunhuiPenglaiAutoAttackStatus', !!player.lunhuiPenglai.isAutoAttacking);
    if (typeof syncLunhuiDungeonTokenCostDisplay === 'function') {
        syncLunhuiDungeonTokenCostDisplay('startLunhuiPenglaiBattleBtn', 'lunhuiPenglaiTokenCount', 'lunhuiPenglaiTokenCostHint', 3, 0);
    }
    if (typeof lunhuiBattleSync === 'function') lunhuiBattleSync('lunhuiPenglai', player.lunhuiPenglai, playerStats);
}

function startLunhuiPenglaiBattle() {
    if (!tryConsumeLunhuiDungeonToken(3, 0)) return;
    player.lunhuiPenglai.bossLevel = 1;
    player.lunhuiPenglai.bossMaxHealth = 1e123;
    player.lunhuiPenglai.bossHealth = 1e123;
    player.lunhuiPenglai.bossAttack = 1e23;
    player.lunhuiPenglai.bossResurrections = 0;
    player.lunhuiPenglai.isBattling = true;
    stopLunhuiCopyAutoAttack(player.lunhuiPenglai, 'lunhuiPenglaiAutoAttackStatus');
    var playerStats = calculatePlayerBattleStats();
    player.lunhuiPenglai.playerHealth = playerStats.health;
    player.lunhuiPenglai.playerMaxHealth = playerStats.health;
    player.lunhuiPenglai.playerAttack = playerStats.attack;
    player.lunhuiPenglai.playerCritRate = playerStats.critRate;
    player.lunhuiPenglai.playerCritDamage = playerStats.critDamage;
    document.getElementById('lunhuiPenglaiBattleLog').innerHTML = '';
    addLunhuiPenglaiBattleLog('=== 轮回仙岛副本挑战开始 ===');
    addLunhuiPenglaiBattleLog('挑战太古玄冥 Lv.' + player.lunhuiPenglai.bossLevel);
    addLunhuiPenglaiBattleLog('BOSS生命: ' + formatSci(player.lunhuiPenglai.bossHealth));
    addLunhuiPenglaiBattleLog('BOSS攻击: ' + formatSci(player.lunhuiPenglai.bossAttack));
    updateLunhuiPenglaiUI();
    if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx('lunhuiPenglai', { kind: 'start', text: '仙岛开启' });
    logAction('开始挑战轮回仙岛副本太古玄冥！', 'success');
}

function toggleLunhuiPenglaiAutoAttack() {
    toggleLunhuiCopyAutoAttack(
        player.lunhuiPenglai,
        attackLunhuiPenglaiBoss,
        function () { return !!(player.lunhuiPenglai && player.lunhuiPenglai.isBattling); },
        'lunhuiPenglaiAutoAttackStatus'
    );
}

function attackLunhuiPenglaiBoss() {
    if (!player.lunhuiPenglai.isBattling) return;
    var playerAttack = player.lunhuiPenglai.playerAttack;
    var critRate = player.lunhuiPenglai.playerCritRate;
    var critDamage = player.lunhuiPenglai.playerCritDamage;
    var isCrit = Math.random() < critRate;
    var damage = bigSciToStorageValue(playerAttack);
    if (isCrit) damage = multiplyBigByFinite(damage, critDamage);
    player.lunhuiPenglai.bossHealth = bSub(player.lunhuiPenglai.bossHealth, damage);
    addLunhuiPenglaiBattleLog('你对太古玄冥造成了' + formatSci(damage) + '点' + (isCrit ? '暴击 ' : '') + '伤害');
    addLunhuiPenglaiBattleLog('BOSS剩余生命: ' + formatSci(player.lunhuiPenglai.bossHealth) + '/' + formatSci(player.lunhuiPenglai.bossMaxHealth));
    if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx('lunhuiPenglai', { side: 'boss', damage: damage, isCrit: isCrit });
    if (bLteZero(player.lunhuiPenglai.bossHealth)) {
        handleLunhuiPenglaiBossDefeated();
    } else {
        lunhuiPenglaiBossCounterAttack();
    }
    updateLunhuiPenglaiUI();
}

function lunhuiPenglaiBossCounterAttack() {
    var bossAttack = player.lunhuiPenglai.bossAttack;
    player.lunhuiPenglai.playerHealth = bSub(player.lunhuiPenglai.playerHealth, bossAttack);
    addLunhuiPenglaiBattleLog('太古玄冥对你造成了' + formatSci(bossAttack) + '点伤害');
    addLunhuiPenglaiBattleLog('你剩余生命: ' + formatSci(player.lunhuiPenglai.playerHealth));
    if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx('lunhuiPenglai', { side: 'player', damage: bossAttack });
    if (bLteZero(player.lunhuiPenglai.playerHealth)) {
        handleLunhuiPenglaiPlayerDefeated();
    }
    updateLunhuiPenglaiUI();
}

function handleLunhuiPenglaiBossDefeated() {
    player.lunhuiPenglai.bossResurrections++;
    if (player.lunhuiPenglai.bossResurrections < 10) {
        player.lunhuiPenglai.bossHealth = bMul(player.lunhuiPenglai.bossMaxHealth, Math.pow(3, player.lunhuiPenglai.bossResurrections));
        player.lunhuiPenglai.bossAttack = bMul(player.lunhuiPenglai.bossAttack, 3);
        addLunhuiPenglaiBattleLog('太古玄冥复活了！(第' + player.lunhuiPenglai.bossResurrections + '次复活)');
        addLunhuiPenglaiBattleLog('BOSS属性提升3倍！');
        if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx('lunhuiPenglai', { kind: 'revive', text: '妖躯重生' });
        lunhuiPenglaiBossCounterAttack();
    } else {
        addLunhuiPenglaiBattleLog('太古玄冥被彻底击败！');
        player.lunhuiPenglai.bossLevel++;
        var levelMultiplier = bigSciToStorageValue('1e' + String(23 * (player.lunhuiPenglai.bossLevel - 1)));
        player.lunhuiPenglai.bossMaxHealth = bMul('1e123', levelMultiplier);
        player.lunhuiPenglai.bossHealth = player.lunhuiPenglai.bossMaxHealth;
        player.lunhuiPenglai.bossAttack = bMul('1e18', levelMultiplier);
        player.lunhuiPenglai.bossResurrections = 0;
        addLunhuiPenglaiBattleLog('太古玄冥晋升至 Lv.' + player.lunhuiPenglai.bossLevel);
        addLunhuiPenglaiBattleLog('BOSS属性提升' + formatSci(levelMultiplier) + '倍！');
        if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx('lunhuiPenglai', { kind: 'levelup', text: '境界晋升 Lv.' + player.lunhuiPenglai.bossLevel });
        lunhuiPenglaiBossCounterAttack();
    }
}

function handleLunhuiPenglaiPlayerDefeated() {
    addLunhuiPenglaiBattleLog('=== 你被太古玄冥击败了！ ===');
    player.lunhuiPenglai.isBattling = false;
    stopLunhuiCopyAutoAttack(player.lunhuiPenglai, 'lunhuiPenglaiAutoAttackStatus');
    if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx('lunhuiPenglai', { kind: 'lose', text: '道心受损' });
    if (player.lunhuiPenglai.bossLevel >= 2) {
        showLunhuiPenglaiRewards();
    } else {
        addLunhuiPenglaiBattleLog('等级1没有奖励，请继续挑战！');
    }
    updateLunhuiPenglaiUI();
}

function fleeLunhuiPenglaiBattle() {
    addLunhuiPenglaiBattleLog('=== 你选择逃离战斗 ===');
    player.lunhuiPenglai.isBattling = false;
    stopLunhuiCopyAutoAttack(player.lunhuiPenglai, 'lunhuiPenglaiAutoAttackStatus');
    if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx('lunhuiPenglai', { kind: 'flee', text: '抽身而退' });
    if (player.lunhuiPenglai.bossLevel >= 2) {
        showLunhuiPenglaiRewards();
    } else {
        addLunhuiPenglaiBattleLog('等级1没有奖励，请继续挑战！');
    }
    updateLunhuiPenglaiUI();
}

function showLunhuiPenglaiRewards() {
    if (player.lunhuiPenglai.bossLevel < 2) return;
    var rewardMultiplier = player.lunhuiPenglai.bossLevel - 1;
    var rewardResult = calculateLunhuiPenglaiRewards(rewardMultiplier);
    document.getElementById('lunhuiPenglaiRewardBossLevel').textContent = player.lunhuiPenglai.bossLevel;
    document.getElementById('lunhuiPenglaiRewardMultiplier').textContent = rewardMultiplier;
    var container = document.getElementById('lunhuiPenglaiRewardItems');
    container.innerHTML = '';
    rewardResult.texts.forEach(function(t) {
        var div = document.createElement('div');
        div.style.margin = '5px 0';
        div.innerHTML = '<span style="color: #ffd700;">' + t + '</span>';
        container.appendChild(div);
    });
    document.getElementById('lunhuiPenglaiRewardOverlay').style.display = 'block';
    document.getElementById('lunhuiPenglaiRewardUI').style.display = 'block';
}

// 轮回仙岛掉落数量结构（与轮回试炼一致：神兽蛋 1~2*倍数，其余 1~3*倍数）
var lunhuiPenglaiEggRange = { min: 1, max: 2 };
var lunhuiPenglaiOtherRange = { min: 1, max: 3 };

function calculateLunhuiPenglaiRewards(multiplier) {
    var texts = [];
    var mult = Math.max(1, multiplier);
    var r = Math.random();
    // 50% T2+S2；其余四类均分剩余 50%（各 12.5%）
    if (r < 0.50) {
        if (!player.reincarnationEquipment) {
            player.reincarnationEquipment = { inventory: [], equipped: { helmet: null, chest: null, pants: null, shoes: null, necklace: null, weapon: null }, lockedItems: [], batchDiscardMode: false, selectedItems: [] };
        }
        if (!player.beasts) player.beasts = { inventory: [], equipped: [] };
        if (!player.beasts.inventory) player.beasts.inventory = [];
        for (var i = 0; i < mult; i++) {
            var eq = generateT2ReincarnationEquipment();
            if (eq && tryPushReincarnationEquipment(eq)) {
                var spiritHint = (typeof getReincarnationSpiritLogSuffix === 'function') ? getReincarnationSpiritLogSuffix(eq) : '';
                var soulHint = (typeof getReincarnationSoulRingLogSuffix === 'function') ? getReincarnationSoulRingLogSuffix(eq) : '';
                var auraHint = (typeof getReincarnationAuraLogSuffix === 'function') ? getReincarnationAuraLogSuffix(eq) : '';
                texts.push('获得T2轮回装备: ' + eq.name + ' (' + reincarnationEquipmentConfig.rarities[eq.rarity].name + ')' + spiritHint + soulHint + auraHint);
                logAction('获得T2轮回装备: ' + eq.name + spiritHint + soulHint + auraHint, 'success');
            }
            var beast = generateS2Beast();
            if (beast && tryPushBeastToInventory(beast)) {
                texts.push('获得S2轮回神兽: ' + beast.name + '（' + beast.rarity + '·S2）');
                logAction('获得S2轮回神兽: ' + beast.name + '（' + beast.rarity + '·S2）', 'legendary');
            }
        }
        if (typeof updateBeastUI === 'function') updateBeastUI();
    } else if (r < 0.625) {
        var baseEgg = Math.floor(Math.random() * (lunhuiPenglaiEggRange.max - lunhuiPenglaiEggRange.min + 1)) + lunhuiPenglaiEggRange.min;
        var eggAmount = baseEgg * mult;
        player.items.shenshou1 = (player.items.shenshou1 || 0) + eggAmount;
        texts.push('神兽蛋 x' + eggAmount);
        logAction('获得神兽蛋 x' + eggAmount, 'success');
    } else if (r < 0.75) {
        var baseFuwen = Math.floor(Math.random() * (lunhuiPenglaiOtherRange.max - lunhuiPenglaiOtherRange.min + 1)) + lunhuiPenglaiOtherRange.min;
        var fuwenAmount = baseFuwen * mult;
        player.items.fuwen1 = (player.items.fuwen1 || 0) + fuwenAmount;
        texts.push('秘法符文 x' + fuwenAmount);
        logAction('获得秘法符文 x' + fuwenAmount, 'success');
    } else if (r < 0.875) {
        var baseWing = Math.floor(Math.random() * (lunhuiPenglaiOtherRange.max - lunhuiPenglaiOtherRange.min + 1)) + lunhuiPenglaiOtherRange.min;
        var wingAmount = baseWing * mult;
        player.items.chiban1 = (player.items.chiban1 || 0) + wingAmount;
        texts.push('黑龙王翅膀 x' + wingAmount);
        logAction('获得黑龙王翅膀 x' + wingAmount, 'success');
    } else {
        var baseJingpo = Math.floor(Math.random() * (lunhuiPenglaiOtherRange.max - lunhuiPenglaiOtherRange.min + 1)) + lunhuiPenglaiOtherRange.min;
        var jingpoAmount = baseJingpo * mult;
        player.items.zuoqi1 = (player.items.zuoqi1 || 0) + jingpoAmount;
        texts.push('远古圣兽精魄 x' + jingpoAmount);
        logAction('获得远古圣兽精魄 x' + jingpoAmount, 'success');
    }
    if (typeof updateReincarnationEquipmentUI === 'function') updateReincarnationEquipmentUI();
    return { texts: texts };
}

function closeLunhuiPenglaiReward() {
    document.getElementById('lunhuiPenglaiRewardOverlay').style.display = 'none';
    document.getElementById('lunhuiPenglaiRewardUI').style.display = 'none';
    logAction('轮回仙岛副本挑战结束，获得奖励！', 'success');
    updateDisplay();
}

function addLunhuiPenglaiBattleLog(message) {
    var logContainer = document.getElementById('lunhuiPenglaiBattleLog');
    if (!logContainer) return;
    var logEntry = document.createElement('div');
    logEntry.textContent = '[' + new Date().toLocaleTimeString() + '] ' + message;
    logEntry.style.margin = '2px 0';
    logEntry.style.padding = '2px 5px';
    if (message.indexOf('击败') !== -1 || message.indexOf('奖励') !== -1) logEntry.style.color = '#00ff00';
    else if (message.indexOf('伤害') !== -1) logEntry.style.color = '#ffa500';
    else if (message.indexOf('复活') !== -1) logEntry.style.color = '#ff0000';
    if (typeof styleLunhuiBattleLogEntry === 'function') styleLunhuiBattleLogEntry(logEntry, message);
    logContainer.appendChild(logEntry);
    while (logContainer.children.length > COPY_BATTLE_LOG_DOM_MAX) logContainer.removeChild(logContainer.firstChild);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// ========== 轮回高阶副本（战斗与升级规则同轮回仙岛；掉落结构同仙岛，装备/神兽档位见配置） ==========
var LUNHUI_ELITE_DUNGEONS = [
    {
        key: 'lunhuiXingYuan',
        dom: 'lunhuiElite1',
        name: '九霄星渊境',
        boss: '烛照星君',
        minAscention: 5,
        hpBase: '1e140',
        atkStart: '1e30',
        atkLevelMulBase: '1e25',
        levelExpStep: 23,
        genEq: function() { return generateT3ReincarnationEquipment(); },
        genBeast: function() { return generateS3Beast(); },
        tLabel: 'T3',
        sLabel: 'S3'
    },
    {
        key: 'lunhuiYaoChi',
        dom: 'lunhuiElite2',
        name: '瑶池云梦洲',
        boss: '云麒圣尊',
        minAscention: 8,
        hpBase: '1e160',
        atkStart: '1e35',
        atkLevelMulBase: '1e30',
        levelExpStep: 23,
        genEq: function() { return generateT4ReincarnationEquipment(); },
        genBeast: function() { return generateS4Beast(); },
        tLabel: 'T4',
        sLabel: 'S4'
    },
    {
        key: 'lunhuiGuiXu',
        dom: 'lunhuiElite3',
        name: '归墟鸿蒙阙',
        boss: '鸿蒙御宰',
        minAscention: 10,
        hpBase: '1e180',
        atkStart: '1e40',
        atkLevelMulBase: '1e35',
        levelExpStep: 23,
        genEq: function() { return generateT5ReincarnationEquipment(); },
        genBeast: function() { return generateS5Beast(); },
        tLabel: 'T5',
        sLabel: 'S5'
    },
    {
        key: 'lunhuiZiXiao',
        dom: 'lunhuiElite4',
        name: '紫霄雷狱殿',
        boss: '紫霄雷帝',
        minAscention: 12,
        hpBase: '1e210',
        atkStart: '1e50',
        atkLevelMulBase: '1e50',
        levelExpStep: 28,
        genEq: function() { return generateT6ReincarnationEquipment(); },
        genBeast: function() { return generateS6Beast(); },
        tLabel: 'T6',
        sLabel: 'S6'
    },
    {
        key: 'lunhuiJiMie',
        dom: 'lunhuiElite5',
        name: '太初寂灭原',
        boss: '寂灭天尊',
        minAscention: 15,
        hpBase: '1e240',
        atkStart: '1e60',
        atkLevelMulBase: '1e60',
        levelExpStep: 28,
        genEq: function() { return generateT7ReincarnationEquipment(); },
        genBeast: function() { return generateS7Beast(); },
        tLabel: 'T7',
        sLabel: 'S7'
    },
    {
        key: 'lunhuiHunDun',
        dom: 'lunhuiElite6',
        name: '无极混沌海',
        boss: '混沌主宰',
        minAscention: 20,
        hpBase: '1e270',
        atkStart: '1e70',
        atkLevelMulBase: '1e70',
        levelExpStep: 28,
        genEq: function() { return generateT8ReincarnationEquipment(); },
        genBeast: function() { return generateS8Beast(); },
        tLabel: 'T8',
        sLabel: 'S8'
    },
    {
        key: 'lunhuiShenYun',
        dom: 'lunhuiElite7',
        name: '永恒神陨谷',
        boss: '神陨武帝',
        minAscention: 25,
        hpBase: '1e300',
        atkStart: '1e80',
        atkLevelMulBase: '1e80',
        levelExpStep: 28,
        genEq: function() { return generateT9ReincarnationEquipment(); },
        genBeast: function() { return generateS9Beast(); },
        tLabel: 'T9',
        sLabel: 'S9'
    },
    {
        key: 'lunhuiZhongYan',
        dom: 'lunhuiElite8',
        name: '终焉轮回渊',
        boss: '轮回终皇',
        minAscention: 30,
        hpBase: '1e330',
        atkStart: '1e90',
        atkLevelMulBase: '1e90',
        levelExpStep: 28,
        genEq: function() { return generateT10ReincarnationEquipment(); },
        genBeast: function() { return generateS10Beast(); },
        tLabel: 'T10',
        sLabel: 'S10'
    },
    // T11–T15：相对 T10 再抬一档；开启需轮回30转 + 化圣次数
    {
        key: 'lunhuiHuaSheng1',
        dom: 'lunhuiElite9',
        name: '化圣劫火台',
        boss: '劫火圣君',
        minAscention: 30,
        minHuaSheng: 2,
        hpBase: '1e360',
        atkStart: '1e100',
        atkLevelMulBase: '1e100',
        levelExpStep: 30,
        genEq: function() { return generateT11ReincarnationEquipment(); },
        genBeast: function() { return generateS11Beast(); },
        tLabel: 'T11',
        sLabel: 'S11'
    },
    {
        key: 'lunhuiHuaSheng2',
        dom: 'lunhuiElite10',
        name: '化圣玄霜域',
        boss: '玄霜圣主',
        minAscention: 30,
        minHuaSheng: 3,
        hpBase: '1e390',
        atkStart: '1e110',
        atkLevelMulBase: '1e110',
        levelExpStep: 30,
        genEq: function() { return generateT12ReincarnationEquipment(); },
        genBeast: function() { return generateS12Beast(); },
        tLabel: 'T12',
        sLabel: 'S12'
    },
    {
        key: 'lunhuiHuaSheng3',
        dom: 'lunhuiElite11',
        name: '化圣紫霄宫',
        boss: '紫霄圣帝',
        minAscention: 30,
        minHuaSheng: 4,
        hpBase: '1e420',
        atkStart: '1e120',
        atkLevelMulBase: '1e120',
        levelExpStep: 30,
        genEq: function() { return generateT13ReincarnationEquipment(); },
        genBeast: function() { return generateS13Beast(); },
        tLabel: 'T13',
        sLabel: 'S13'
    },
    {
        key: 'lunhuiHuaSheng4',
        dom: 'lunhuiElite12',
        name: '化圣归墟渊',
        boss: '归墟圣皇',
        minAscention: 30,
        minHuaSheng: 5,
        hpBase: '1e450',
        atkStart: '1e130',
        atkLevelMulBase: '1e130',
        levelExpStep: 30,
        genEq: function() { return generateT14ReincarnationEquipment(); },
        genBeast: function() { return generateS14Beast(); },
        tLabel: 'T14',
        sLabel: 'S14'
    },
    {
        key: 'lunhuiHuaSheng5',
        dom: 'lunhuiElite13',
        name: '化圣轮回殿',
        boss: '轮回圣尊',
        minAscention: 30,
        minHuaSheng: 6,
        hpBase: '1e480',
        atkStart: '1e140',
        atkLevelMulBase: '1e140',
        levelExpStep: 30,
        genEq: function() { return generateT15ReincarnationEquipment(); },
        genBeast: function() { return generateS15Beast(); },
        tLabel: 'T15',
        sLabel: 'S15'
    }
];

function ensureLunhuiEliteDungeon(idx) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    if (!c) return null;
    if (!player[c.key]) {
        var h0 = bigSciToStorageValue(c.hpBase);
        var a0 = bigSciToStorageValue(c.atkStart);
        player[c.key] = { bossLevel: 1, bossHealth: h0, bossAttack: a0, bossMaxHealth: h0, bossResurrections: 0, isBattling: false, playerHealth: 0, playerAttack: 0, playerCritRate: 0, playerCritDamage: 0 };
    }
    return c;
}

function toggleLunhuiEliteDungeon(idx) {
    var c = ensureLunhuiEliteDungeon(idx);
    if (!c) return;
    if (player.level.ascentionCounta < c.minAscention) {
        alert('需要达到轮回' + c.minAscention + '转才能开启「' + c.name + '」！');
        return;
    }
    var needHua = Number(c.minHuaSheng) || 0;
    if (needHua > 0) {
        var haveHua = Number(player.level && player.level.huaShengCount) || 0;
        if (haveHua < needHua) {
            alert('需要化圣≥' + needHua + '次才能开启「' + c.name + '」！当前化圣' + haveHua + '次。');
            return;
        }
    }
    var overlay = document.getElementById(c.dom + 'Overlay');
    var ui = document.getElementById(c.dom + 'UI');
    if (!overlay || !ui) return;
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
        stopLunhuiCopyAutoAttack(player[c.key], c.dom + 'AutoAttackStatus');
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateLunhuiEliteDungeonUI(idx);
    }
}

function lunhuiEliteDomId(dom, suffix) {
    return dom + suffix;
}

function updateLunhuiEliteDungeonUI(idx) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    if (!c || !player[c.key]) return;
    var st = player[c.key];
    var d = c.dom;
    if (typeof ensureLunhuiBattleChrome === 'function') {
        ensureLunhuiBattleChrome(d, { bossName: c.boss });
    }
    document.getElementById(lunhuiEliteDomId(d, 'TokenCount')).textContent = player.items.fuben1 || 0;
    var playerStats = calculatePlayerBattleStats();
    var battling = !!st.isBattling;
    document.getElementById(lunhuiEliteDomId(d, 'PlayerHealth')).textContent = formatSci(battling ? st.playerHealth : playerStats.health);
    document.getElementById(lunhuiEliteDomId(d, 'PlayerAttack')).textContent = formatSci(battling ? st.playerAttack : playerStats.attack);
    document.getElementById(lunhuiEliteDomId(d, 'PlayerCritRate')).textContent = ((battling ? st.playerCritRate : playerStats.critRate) * 100).toFixed(2) + '%';
    document.getElementById(lunhuiEliteDomId(d, 'PlayerCritDamage')).textContent = ((battling ? st.playerCritDamage : playerStats.critDamage) * 100).toFixed(2) + '%';
    document.getElementById(lunhuiEliteDomId(d, 'BossLevel')).textContent = st.bossLevel;
    document.getElementById(lunhuiEliteDomId(d, 'BossHealth')).textContent = formatSci(st.bossHealth);
    document.getElementById(lunhuiEliteDomId(d, 'BossMaxHealth')).textContent = formatSci(st.bossMaxHealth);
    document.getElementById(lunhuiEliteDomId(d, 'BossAttack')).textContent = formatSci(st.bossAttack);
    document.getElementById(lunhuiEliteDomId(d, 'BossResurrections')).textContent = st.bossResurrections;
    var startBtn = document.getElementById('start' + c.dom.replace('lunhui', 'Lunhui') + 'BattleBtn');
    var attackBtn = document.getElementById('attack' + c.dom.replace('lunhui', 'Lunhui') + 'BossBtn');
    var autoBtn = document.getElementById('autoAttack' + c.dom.replace('lunhui', 'Lunhui') + 'BossBtn');
    var fleeBtn = document.getElementById('flee' + c.dom.replace('lunhui', 'Lunhui') + 'BossBtn');
    if (battling) {
        if (startBtn) startBtn.style.display = 'none';
        if (attackBtn) attackBtn.style.display = 'inline-block';
        if (autoBtn) autoBtn.style.display = 'inline-block';
        if (fleeBtn) fleeBtn.style.display = 'inline-block';
    } else {
        if (startBtn) startBtn.style.display = 'inline-block';
        if (attackBtn) attackBtn.style.display = 'none';
        if (autoBtn) autoBtn.style.display = 'none';
        if (fleeBtn) fleeBtn.style.display = 'none';
    }
    setLunhuiCopyAutoAttackStatus(c.dom + 'AutoAttackStatus', !!st.isAutoAttacking);
    if (typeof syncLunhuiDungeonTokenCostDisplay === 'function') {
        syncLunhuiDungeonTokenCostDisplay(
            'start' + c.dom.replace('lunhui', 'Lunhui') + 'BattleBtn',
            c.dom + 'TokenCount',
            c.dom + 'TokenCostHint',
            c.minAscention || 0,
            c.minHuaSheng || 0
        );
    }
    if (typeof lunhuiBattleSync === 'function') lunhuiBattleSync(d, st, playerStats);
}

function startLunhuiEliteDungeonBattle(idx) {
    var c = ensureLunhuiEliteDungeon(idx);
    if (!c) return;
    if (!tryConsumeLunhuiDungeonToken(c.minAscention || 0, c.minHuaSheng || 0)) return;
    var st = player[c.key];
    st.bossLevel = 1;
    st.bossMaxHealth = bigSciToStorageValue(c.hpBase);
    st.bossHealth = bigSciToStorageValue(c.hpBase);
    st.bossAttack = bigSciToStorageValue(c.atkStart);
    st.bossResurrections = 0;
    st.isBattling = true;
    stopLunhuiCopyAutoAttack(st, c.dom + 'AutoAttackStatus');
    var playerStats = calculatePlayerBattleStats();
    st.playerHealth = playerStats.health;
    st.playerMaxHealth = playerStats.health;
    st.playerAttack = playerStats.attack;
    st.playerCritRate = playerStats.critRate;
    st.playerCritDamage = playerStats.critDamage;
    var logEl = document.getElementById(c.dom + 'BattleLog');
    if (logEl) logEl.innerHTML = '';
    addLunhuiEliteDungeonBattleLog(idx, '=== 「' + c.name + '」挑战开始 ===');
    addLunhuiEliteDungeonBattleLog(idx, '挑战' + c.boss + ' Lv.' + st.bossLevel);
    addLunhuiEliteDungeonBattleLog(idx, 'BOSS生命: ' + formatSci(st.bossHealth));
    addLunhuiEliteDungeonBattleLog(idx, 'BOSS攻击: ' + formatSci(st.bossAttack));
    updateLunhuiEliteDungeonUI(idx);
    if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx(c.dom, { kind: 'start', text: '法阵开启' });
    logAction('开始挑战「' + c.name + '」' + c.boss + '！', 'success');
}

function toggleLunhuiEliteDungeonAutoAttack(idx) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    if (!c || !player[c.key]) return;
    toggleLunhuiCopyAutoAttack(
        player[c.key],
        function () { attackLunhuiEliteDungeonBoss(idx); },
        function () { return !!(player[c.key] && player[c.key].isBattling); },
        c.dom + 'AutoAttackStatus'
    );
}

function attackLunhuiEliteDungeonBoss(idx) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    if (!c || !player[c.key] || !player[c.key].isBattling) return;
    var st = player[c.key];
    var playerAttack = st.playerAttack;
    var critRate = st.playerCritRate;
    var critDamage = st.playerCritDamage;
    var isCrit = Math.random() < critRate;
    var damage = bigSciToStorageValue(playerAttack);
    if (isCrit) damage = multiplyBigByFinite(damage, critDamage);
    st.bossHealth = bSub(st.bossHealth, damage);
    addLunhuiEliteDungeonBattleLog(idx, '你对' + c.boss + '造成了' + formatSci(damage) + '点' + (isCrit ? '暴击 ' : '') + '伤害');
    addLunhuiEliteDungeonBattleLog(idx, 'BOSS剩余生命: ' + formatSci(st.bossHealth) + '/' + formatSci(st.bossMaxHealth));
    if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx(c.dom, { side: 'boss', damage: damage, isCrit: isCrit });
    if (bLteZero(st.bossHealth)) {
        handleLunhuiEliteDungeonBossDefeated(idx);
    } else {
        lunhuiEliteDungeonBossCounterAttack(idx);
    }
    updateLunhuiEliteDungeonUI(idx);
}

function lunhuiEliteDungeonBossCounterAttack(idx) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    if (!c || !player[c.key]) return;
    var st = player[c.key];
    var bossAttack = st.bossAttack;
    st.playerHealth = bSub(st.playerHealth, bossAttack);
    addLunhuiEliteDungeonBattleLog(idx, c.boss + '对你造成了' + formatSci(bossAttack) + '点伤害');
    addLunhuiEliteDungeonBattleLog(idx, '你剩余生命: ' + formatSci(st.playerHealth));
    if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx(c.dom, { side: 'player', damage: bossAttack });
    if (bLteZero(st.playerHealth)) {
        handleLunhuiEliteDungeonPlayerDefeated(idx);
    }
    updateLunhuiEliteDungeonUI(idx);
}

function handleLunhuiEliteDungeonBossDefeated(idx) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    if (!c || !player[c.key]) return;
    var st = player[c.key];
    st.bossResurrections++;
    if (st.bossResurrections < 10) {
        st.bossHealth = bMul(st.bossMaxHealth, Math.pow(3, st.bossResurrections));
        st.bossAttack = bMul(st.bossAttack, 3);
        addLunhuiEliteDungeonBattleLog(idx, c.boss + '复活了！(第' + st.bossResurrections + '次复活)');
        addLunhuiEliteDungeonBattleLog(idx, 'BOSS属性提升3倍！');
        if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx(c.dom, { kind: 'revive', text: '妖躯重生' });
        lunhuiEliteDungeonBossCounterAttack(idx);
    } else {
        addLunhuiEliteDungeonBattleLog(idx, c.boss + '被彻底击败！');
        st.bossLevel++;
        var levelMultiplier = bigSciToStorageValue('1e' + String(c.levelExpStep * (st.bossLevel - 1)));
        st.bossMaxHealth = bMul(c.hpBase, levelMultiplier);
        st.bossHealth = st.bossMaxHealth;
        st.bossAttack = bMul(c.atkLevelMulBase, levelMultiplier);
        st.bossResurrections = 0;
        addLunhuiEliteDungeonBattleLog(idx, c.boss + '晋升至 Lv.' + st.bossLevel);
        addLunhuiEliteDungeonBattleLog(idx, 'BOSS属性提升' + formatSci(levelMultiplier) + '倍！');
        if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx(c.dom, { kind: 'levelup', text: '境界晋升 Lv.' + st.bossLevel });
        lunhuiEliteDungeonBossCounterAttack(idx);
    }
}

function handleLunhuiEliteDungeonPlayerDefeated(idx) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    if (!c || !player[c.key]) return;
    var st = player[c.key];
    addLunhuiEliteDungeonBattleLog(idx, '=== 你被' + c.boss + '击败了！ ===');
    st.isBattling = false;
    stopLunhuiCopyAutoAttack(st, c.dom + 'AutoAttackStatus');
    if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx(c.dom, { kind: 'lose', text: '道心受损' });
    if (st.bossLevel >= 2) {
        showLunhuiEliteDungeonRewards(idx);
    } else {
        addLunhuiEliteDungeonBattleLog(idx, '等级1没有奖励，请继续挑战！');
    }
    updateLunhuiEliteDungeonUI(idx);
}

function fleeLunhuiEliteDungeonBattle(idx) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    if (!c || !player[c.key]) return;
    var st = player[c.key];
    addLunhuiEliteDungeonBattleLog(idx, '=== 你选择逃离战斗 ===');
    st.isBattling = false;
    stopLunhuiCopyAutoAttack(st, c.dom + 'AutoAttackStatus');
    if (typeof lunhuiBattleFx === 'function') lunhuiBattleFx(c.dom, { kind: 'flee', text: '抽身而退' });
    if (st.bossLevel >= 2) {
        showLunhuiEliteDungeonRewards(idx);
    } else {
        addLunhuiEliteDungeonBattleLog(idx, '等级1没有奖励，请继续挑战！');
    }
    updateLunhuiEliteDungeonUI(idx);
}

function showLunhuiEliteDungeonRewards(idx) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    if (!c || !player[c.key]) return;
    var st = player[c.key];
    if (st.bossLevel < 2) return;
    var rewardMultiplier = st.bossLevel - 1;
    var rewardResult = calculateLunhuiEliteDungeonRewards(idx, rewardMultiplier);
    document.getElementById(c.dom + 'RewardBossLevel').textContent = st.bossLevel;
    document.getElementById(c.dom + 'RewardMultiplier').textContent = rewardMultiplier;
    var container = document.getElementById(c.dom + 'RewardItems');
    if (!container) return;
    container.innerHTML = '';
    rewardResult.texts.forEach(function(t) {
        var div = document.createElement('div');
        div.style.margin = '5px 0';
        div.innerHTML = '<span style="color: #ffd700;">' + t + '</span>';
        container.appendChild(div);
    });
    document.getElementById(c.dom + 'RewardOverlay').style.display = 'block';
    document.getElementById(c.dom + 'RewardUI').style.display = 'block';
}

function calculateLunhuiEliteDungeonRewards(idx, multiplier) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    var texts = [];
    if (!c) return { texts: texts };
    var mult = Math.max(1, multiplier);
    var r = Math.random();
    // 50% T+S；其余四类均分剩余 50%（各 12.5%）
    if (r < 0.50) {
        if (!player.reincarnationEquipment) {
            player.reincarnationEquipment = { inventory: [], equipped: { helmet: null, chest: null, pants: null, shoes: null, necklace: null, weapon: null }, lockedItems: [], batchDiscardMode: false, selectedItems: [] };
        }
        if (!player.beasts) player.beasts = { inventory: [], equipped: [] };
        if (!player.beasts.inventory) player.beasts.inventory = [];
        for (var i = 0; i < mult; i++) {
            var eq = c.genEq();
            if (eq && tryPushReincarnationEquipment(eq)) {
                var spiritHint = (typeof getReincarnationSpiritLogSuffix === 'function') ? getReincarnationSpiritLogSuffix(eq) : '';
                var soulHint = (typeof getReincarnationSoulRingLogSuffix === 'function') ? getReincarnationSoulRingLogSuffix(eq) : '';
                var auraHint = (typeof getReincarnationAuraLogSuffix === 'function') ? getReincarnationAuraLogSuffix(eq) : '';
                texts.push('获得' + c.tLabel + '轮回装备: ' + eq.name + ' (' + reincarnationEquipmentConfig.rarities[eq.rarity].name + ')' + spiritHint + soulHint + auraHint);
                logAction('获得' + c.tLabel + '轮回装备: ' + eq.name + spiritHint + soulHint + auraHint, 'success');
            }
            var beast = c.genBeast();
            if (beast && tryPushBeastToInventory(beast)) {
                texts.push('获得' + c.sLabel + '轮回神兽: ' + beast.name + '（' + beast.rarity + '·' + c.sLabel + '）');
                logAction('获得' + c.sLabel + '轮回神兽: ' + beast.name + '（' + beast.rarity + '·' + c.sLabel + '）', 'legendary');
            }
        }
        if (typeof updateBeastUI === 'function') updateBeastUI();
    } else if (r < 0.625) {
        var baseEgg = Math.floor(Math.random() * (lunhuiPenglaiEggRange.max - lunhuiPenglaiEggRange.min + 1)) + lunhuiPenglaiEggRange.min;
        var eggAmount = baseEgg * mult;
        player.items.shenshou1 = (player.items.shenshou1 || 0) + eggAmount;
        texts.push('神兽蛋 x' + eggAmount);
        logAction('获得神兽蛋 x' + eggAmount, 'success');
    } else if (r < 0.75) {
        var baseFuwen = Math.floor(Math.random() * (lunhuiPenglaiOtherRange.max - lunhuiPenglaiOtherRange.min + 1)) + lunhuiPenglaiOtherRange.min;
        var fuwenAmount = baseFuwen * mult;
        player.items.fuwen1 = (player.items.fuwen1 || 0) + fuwenAmount;
        texts.push('秘法符文 x' + fuwenAmount);
        logAction('获得秘法符文 x' + fuwenAmount, 'success');
    } else if (r < 0.875) {
        var baseWing = Math.floor(Math.random() * (lunhuiPenglaiOtherRange.max - lunhuiPenglaiOtherRange.min + 1)) + lunhuiPenglaiOtherRange.min;
        var wingAmount = baseWing * mult;
        player.items.chiban1 = (player.items.chiban1 || 0) + wingAmount;
        texts.push('黑龙王翅膀 x' + wingAmount);
        logAction('获得黑龙王翅膀 x' + wingAmount, 'success');
    } else {
        var baseJingpo = Math.floor(Math.random() * (lunhuiPenglaiOtherRange.max - lunhuiPenglaiOtherRange.min + 1)) + lunhuiPenglaiOtherRange.min;
        var jingpoAmount = baseJingpo * mult;
        player.items.zuoqi1 = (player.items.zuoqi1 || 0) + jingpoAmount;
        texts.push('远古圣兽精魄 x' + jingpoAmount);
        logAction('获得远古圣兽精魄 x' + jingpoAmount, 'success');
    }
    if (typeof updateReincarnationEquipmentUI === 'function') updateReincarnationEquipmentUI();
    return { texts: texts };
}

function closeLunhuiEliteDungeonReward(idx) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    if (!c) return;
    document.getElementById(c.dom + 'RewardOverlay').style.display = 'none';
    document.getElementById(c.dom + 'RewardUI').style.display = 'none';
    logAction('「' + c.name + '」挑战结束，获得奖励！', 'success');
    updateDisplay();
}

function addLunhuiEliteDungeonBattleLog(idx, message) {
    var c = LUNHUI_ELITE_DUNGEONS[idx];
    if (!c) return;
    var logContainer = document.getElementById(c.dom + 'BattleLog');
    if (!logContainer) return;
    var logEntry = document.createElement('div');
    logEntry.textContent = '[' + new Date().toLocaleTimeString() + '] ' + message;
    logEntry.style.margin = '2px 0';
    logEntry.style.padding = '2px 5px';
    if (message.indexOf('击败') !== -1 || message.indexOf('奖励') !== -1) logEntry.style.color = '#00ff00';
    else if (message.indexOf('伤害') !== -1) logEntry.style.color = '#ffa500';
    else if (message.indexOf('复活') !== -1) logEntry.style.color = '#ff0000';
    if (typeof styleLunhuiBattleLogEntry === 'function') styleLunhuiBattleLogEntry(logEntry, message);
    logContainer.appendChild(logEntry);
    while (logContainer.children.length > COPY_BATTLE_LOG_DOM_MAX) logContainer.removeChild(logContainer.firstChild);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// 科学计数法格式化函数
function formatSci_lunhuiPenglaiLocal(number) {
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

// 战斗/副本/直播等
// 全屏横屏模式：再次点击则退出（仅在部分浏览器生效，需要用户点击触发）
function enterLandscapeFullscreen() {
    var btn = document.getElementById('btnLandscapeMode');
    var elem = document.documentElement;
    var isFull = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

    // 已经是全屏状态：尝试退出全屏，并还原按钮文字
    if (isFull) {
        var exitFull = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        if (exitFull) exitFull.call(document).catch && exitFull.call(document).catch(function() {});
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
        if (btn) btn.textContent = '全屏模式';
        return;
    }

    // 进入全屏并尝试锁定横屏
    var requestFull = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen;
    function lockLandscape() {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(function(){});
        }
    }
    if (requestFull) {
        var p = requestFull.call(elem);
        if (p && p.then) {
            p.then(lockLandscape).catch(lockLandscape);
        } else {
            lockLandscape();
        }
    } else {
        lockLandscape();
    }
    if (btn) btn.textContent = '退出全屏';
}

        // 新增：打怪模式逻辑
        function toggleMonsterUI() {
    if (player.reincarnationCount < 1) {
        alert("需要达到1转才能开启打怪模式！");
        return;
    }
    const monsterUI = document.getElementById('monsterUI');
    monsterUI.style.display = monsterUI.style.display === 'none' ? 'block' : 'none';
    if (monsterUI.style.display === 'block') {
        // 重新生成玩家属性，但不重新生成怪物
        player.battle.playerHealth = player.reincarnationCount;
        player.battle.playerAttack = getTotalClickValue();
      updateOfficialSystemDisplay();
        updateMonsterUI(); // 更新UI显示
      updatePlayerBattleStats();
      
    }
}

        function startBattle() {
    player.battle.playerHealth = 1 + player.reincarnationCount;
    player.battle.playerAttack = 1 + getTotalClickValue();
    player.battle.playerCritRate = 0.1 + player.attributes.critRate * 0.0005; // 初始暴击率 + 属性加成
    player.battle.playerCritDamage = 1.5 + player.attributes.critDamage * 0.005; // 初始爆伤 + 属性加成
    player.battle.currentStage = player.battle.currentStage || 0;
    player.battle.maxStage = Math.max(player.battle.maxStage, player.battle.currentStage);
   updateOfficialSystemDisplay();
    updateMonsterUI(); // 更新UI显示
}

        const monsterModifiers = {
    // 防御类词条
    "硬化": { damageReduction: 0.9 }, // 受到伤害减少10%
    "钢铁": { damageReduction: 0.99 }, // 受到伤害减少20%
    "金身": { damageReduction: 0.999 }, // 受到伤害减少50%
    "不败": { damageReduction: 0.9999 }, // 受到伤害减少70%
    "圣体": { damageReduction: 0.99999 }, // 受到伤害减少80%
    "不死": { damageReduction: 0.999999 }, // 受到伤害减少99%

    // 攻击类词条
    "强击": { attackMultiplier: 2.10 }, 
    "突击": { attackMultiplier: 3.20 }, 
    "嗜血": { attackMultiplier: 4.30 }, 
    "炼狱": { attackMultiplier: 5.40 }, 
    "修罗": { attackMultiplier: 6.50 }, 
    "死神": { attackMultiplier: 10.00 }, 

    // 闪避类词条
    "初级闪避": { dodgeChance: 0.5 },
    "中级闪避": { dodgeChance: 0.6 }, 
    "高级闪避": { dodgeChance: 0.7 }, 
    "终极闪避": { dodgeChance: 0.8 }, 
    "神级闪避": { dodgeChance: 0.9 }, 

    // 特殊效果类词条
    "抵消": { blockCount: 2 }, // 可以抵消玩家2次攻击
    "金光": { blockCount: 3 }, // 可以抵消玩家3次攻击
    "神盾": { blockCount: 5 }, // 可以抵消玩家5次攻击

    // 特殊攻击类词条
    "连击": { attackCount: 3 }, // 攻击5次
    "虚弱": { damageTakenMultiplier: 1.50 } // 受到玩家伤害增加50%
};
 
const monsterRankModifiers = {
    "普通": { pool: ["硬化", "强击", "初级闪避", "虚弱"], selectCount: 2 },
    "精英": { pool: ["连击", "硬化", "强击", "初级闪避"], selectCount: 2 },
    "普通BOSS": { pool: ["虚弱", "连击", "钢铁", "突击", "初级闪避"], selectCount: 3 },
    "特殊BOSS": { pool: ["连击",  "钢铁", "突击", "中级闪避"], selectCount: 3 },
    "领主BOSS": { pool: ["连击", "钢铁", "突击", "嗜血", "中级闪避", "抵消"], selectCount: 4 },
    "霸主级BOSS": { pool: ["金身", "连击", "嗜血", "突击", "中级闪避", "抵消"], selectCount: 4 },
    "王级BOSS": { pool: ["连击", "金身", "炼狱", "嗜血", "高级闪避", "抵消"], selectCount: 4 },
    "皇级BOSS": { pool: ["连击", "不败", "炼狱", "高级闪避", "抵消"], selectCount: 4 },
    "帝级BOSS": { pool: ["连击", "不败", "炼狱", "修罗", "高级闪避", "金光"], selectCount: 4 },
    "神级BOSS": { pool: ["连击", "圣体", "修罗", "终极闪避", "金光", "死神"], selectCount: 5 },
    "圣级BOSS": { pool: ["连击", "不死", "死神", "神级闪避", "神盾"], selectCount: 5 }
};
 const monsterNames = [
    "夜叉丸", "玄天青龙帝", "九幽冥凤尊", "太虚剑仙·凌霄", "紫微星君·太华",
    "黄泉引渡使", "焚天炎龙圣主", "噬魂夜叉皇", "青丘九尾天狐", "白骨夫人·夜魅",
    "天河银蛟龙王", "幽冥骑士·龙煞", "永恒梦魇·修普诺斯", "幽冥鬼判·玄煞", "金翅大鹏明王",
    "天启四骑士·天罚", "混沌主宰", "哥布林", "太虚剑灵", "月宫蟾仙",
    "九幽煞魔", "幽冥鬼王", "幽狱魔尊", "混元道傀", "八荒龙神",
    "炎阳帝君", "星垣神王", "黄金狮心王·理查德", "幽冥鬼判·玄煞", "金翅大鹏明王",
    "玉虚雷神将", "鸿蒙祖神", "玄天帝君", "风暴之眼", "暗月武士·凯恩",
    "黑丝女神·闫闫", "萝莉·茶茶", "修罗刀魔·无间", "机械降神·欧米茄", "光年守望者·天狼",
    "寒冰之魂", "血月狼王·芬里尔", "永恒黑暗·厄瑞玻斯", "虚数之龙·阿莱夫", "数据化身·尼奥"
];

function getRandomMonsterName() {
    return monsterNames[Math.floor(Math.random() * monsterNames.length)];
}

function generateMonster() {
    const stage = player.battle.currentStage;
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
    const usedModifiers = new Set(); // 用于记录已经使用的词条

    for (let i = 0; i < selectCount; i++) {
        let modifier;
        do {
            modifier = modifierPool[Math.floor(Math.random() * modifierPool.length)];
        } while (usedModifiers.has(modifier)); // 确保词条不重复
        usedModifiers.add(modifier); // 记录已使用的词条
        selectedModifiers.push(modifier);
    }

    // 计算怪物属性
    const baseHealth = powScaledBig(1.148698355, stage, 10000);
    // 怪物攻击与生命采用同一递增曲线，避免不同步导致的体验割裂
    const baseAttack = powScaledBig(1.148698355, stage, 10);

    // 应用词条效果
    let attack = bigSciToStorageValue(baseAttack);
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

    // 生成怪物
    player.battle.monster = {
        name: `${getRandomMonsterName()}             等级${stage  * 2 + 7}`, // 随机生成怪物名字
        rank: rank,
        health: baseHealth,
        attack: attack,
        modifiers: selectedModifiers,
        damageReduction: damageReduction,
        dodgeChance: dodgeChance,
        blockCount: blockCount,
        attackCount: attackCount,
        damageTakenMultiplier: damageTakenMultiplier
    };
}

       function updateMonsterUI() {
    document.getElementById('playerHealth').textContent = formatSci(player.battle.playerHealth);
    document.getElementById('playerAttack').textContent = formatSci(player.battle.playerAttack);
    document.getElementById('playerCritRate').textContent = `${((player.battle.playerCritRate + player.attributes.critRate * 0.0005) * 100).toFixed(1)}%`; // 更新暴击率显示
    document.getElementById('playerCritDamage').textContent = `${((player.battle.playerCritDamage + player.attributes.critDamage * 0.005) * 100).toFixed(1)}%`; // 更新爆伤显示
    document.getElementById('playerAccuracy').textContent = `${(player.battle.playerAccuracy * 100).toFixed(1)}%`;
    document.getElementById('playerDodge').textContent = `${(player.battle.playerDodge * 100).toFixed(1)}%`;

    document.getElementById('currentStage').textContent = player.battle.currentStage + 1;
    document.getElementById('monsterName').textContent = player.battle.monster.name;
    document.getElementById('monsterRank').textContent = player.battle.monster.rank;
    document.getElementById('monsterHealth').textContent = formatSci(player.battle.monster.health);
    document.getElementById('monsterAttack').textContent = formatSci(player.battle.monster.attack);

    // 显示怪物词条
    const modifiers = player.battle.monster.modifiers.join(', ');
    document.getElementById('monsterModifiers').textContent = ` ${modifiers}`;
     
}
       function attackMonster() {
const now = Date.now();
            // 移除超过1秒的点击记录
            player.clickTimestamps = player.clickTimestamps.filter(timestamp => now - timestamp < 1000);

            const clickLimit = 10 + player.reincarnationStats.clickLimitBonus.level; // 每级增加1次点击上限
            if (player.clickTimestamps.length >= clickLimit) {
                logAction("点击速度过快，请稍后再试！", "error");
                return;
            }

            player.clickTimestamps.push(now);
    const monster = player.battle.monster;
    
    // 应用属性加成
    const playerAttack = player.battle.playerAttack;
    const playerCritRate = player.battle.playerCritRate;
    const playerCritDamage = player.battle.playerCritDamage;
    const playerMultiAttack = player.battle.playerMultiAttack;
    const playerBlock = Math.floor(player.attributes.block / 5000000); // 每5000000点抵消属性点抵消1次攻击

    // 新增：统计变量
    let totalDamage = bigSciToStorageValue(0); // 总伤害（大数）
    let dodgeCount = 0;            // 闪避次数
    let critCount = 0;             // 暴击次数
    let normalDamage = bigSciToStorageValue(0); // 普通伤害总和（大数）
    const totalAttacks = playerMultiAttack + 1; // 总连击次数

    // 连击次数
    for (let i = 0; i < totalAttacks; i++) {
        // 计算命中
        if (Math.random() < monster.dodgeChance) {
            dodgeCount++; // 记录闪避次数
            continue;
        }

        // 计算伤害
        let damage = multiplyBigByFinite(playerAttack, monster.damageTakenMultiplier);
        damage = multiplyBigByFinite(damage, (1 - monster.damageReduction)); // 应用伤害减免

        // 抵消效果
        if (monster.blockCount > 0) {
            monster.blockCount--;
            logBattleAction(`你的攻击被抵消了！怪物剩余抵消次数：${monster.blockCount}`);
            continue;
        }

        // 暴击计算
        if (Math.random() < playerCritRate) {
            damage = multiplyBigByFinite(damage, playerCritDamage); // 应用爆伤加成
            critCount++;
            totalDamage = bigSciToStorageValue(addBigSci(totalDamage, damage));
        } else {
            normalDamage = bigSciToStorageValue(addBigSci(normalDamage, damage));
            totalDamage = bigSciToStorageValue(addBigSci(totalDamage, damage));
        }

        // 应用伤害
        monster.health = bSub(monster.health, damage);

        if (bLteZero(monster.health)) {
            break; // 如果怪物被击败，跳出连击循环
        }
    }

    // 新增：输出综合攻击日志
    logBattleAction(`你造成了${formatSci(totalDamage)}点伤害 (${totalAttacks}连击) - 普通伤害: ${formatSci(normalDamage)}, 闪避x${dodgeCount} 暴击x${critCount}`);

    // 检查怪物是否被击败
    if (bLteZero(monster.health)) {
        logBattleAction(`你击败了${monster.name}，通关第${player.battle.currentStage + 1}关！`);
        player.battle.currentStage++;
        player.battle.maxStage = Math.max(player.battle.maxStage, player.battle.currentStage);
        
        updatePlayerBattleStats();
        // 更新总属性点
        player.attributes.totalPoints = player.reincarnationCount * 1 + player.battle.maxStage * 10;
        // 检查最大关卡成就
        checkMaxStageAchievements();
        // 新增：检查称号解锁
        checkTitleUnlocks();
        updateOfficialSystemDisplay();
        // 掉落副本装备
        dropDungeonEquipment(player.battle.currentStage);

        // 掉落魂环
        dropSoulRing(player.battle.currentStage);
       
        // 掉落道具
        dropItemsAfterBattle();
                 
        generateMonster();
    }

    updateMonsterUI();

    function checkMaxStageAchievements() {
    const maxStage = player.battle.maxStage;
    const achievements = [
        { stage: 10, key: 'max_stage_10' },
        { stage: 30, key: 'max_stage_30' },
        { stage: 60, key: 'max_stage_60' },
        { stage: 90, key: 'max_stage_90' },
        { stage: 120, key: 'max_stage_120' },
        { stage: 200, key: 'max_stage_200' },
        { stage: 300, key: 'max_stage_300' },
        { stage: 400, key: 'max_stage_400' },
        { stage: 500, key: 'max_stage_500' },
        { stage: 600, key: 'max_stage_600' },
        { stage: 700, key: 'max_stage_700' },
        { stage: 800, key: 'max_stage_800' },
        { stage: 900, key: 'max_stage_900' },
        { stage: 1000, key: 'max_stage_1000' },
    ];

    achievements.forEach(({ stage, key }) => {
        if (maxStage >= stage && !player.achievements[key]) {
            player.achievements[key] = true;
            const reward = achievementRewards[key];
            if (reward) {
                player.gpsMultiplier += reward.gpsMultiplier;
                logAction(`成就达成：${reward.description}，GPS奖励 +${reward.gpsMultiplier * 100}%`, 'success');
                updatePlayerBattleStats();
            }
        }
    });
}
    // 怪物反击逻辑
    if (monster.health > 0) {
        for (let i = 0; i < monster.attackCount; i++) {
            if (Math.random() > player.battle.playerDodge) {
                if (playerBlock > 0) {
                    playerBlock--; // 消耗一次抵消次数
                    logBattleAction(`你抵消了怪物的攻击！剩余抵消次数：${playerBlock}`);
                } else {
                    player.battle.playerHealth = bSub(player.battle.playerHealth, monster.attack); // 如果没有抵消次数，玩家受到伤害
                    logBattleAction(`${monster.name}对你造成了${formatSci(monster.attack)}点伤害`);
                }
            } else {
                logBattleAction('你闪避了怪物的攻击！');
            }
        }
    // 检查玩家是否被击败
        if (bLteZero(player.battle.playerHealth)) {
            logBattleAction('你被怪物击败了！');
            monster.health = powScaledBig(1.148698355, player.battle.currentStage, 10000); // 重置怪物生命
          updatePlayerBattleStats();
       updateOfficialSystemDisplay();
        }
    }

    updateMonsterUI();
}
   // 掉落道具函数
function dropItemsAfterBattle() {
    const stage = player.battle.currentStage;

    // 洗炼石掉落（30关以上0.1%概率）
    if (stage >= 30 && Math.random() < 0.0005) {
        player.items.refineStone++;
        logBattleAction('获得了洗炼石！');
    }
     if (stage >= 1 && Math.random() < 0.0001) {
        player.items.vipPower++;
        logBattleAction('获得了VIP能力值！');
    }
   if (stage >= 50 && Math.random() < 0.0005) {
        player.items.primaryGem++;
        logBattleAction('获得了初级宝石！');
    }
     if (stage >= 100 && Math.random() < 0.0005) {
        player.items.advancedGem++;
        logBattleAction('获得了高级宝石！');
    }
     if (stage >= 150 && Math.random() < 0.0005) {
        player.items.superiorGem++;
        logBattleAction('获得了极品宝石！');
    }

     if (stage >= 1 && Math.random() < 0.001) {
        player.items.rose++;
        logBattleAction('获得了玫瑰花！');
    }

     if (stage >= 200 && Math.random() < 0.0001) {
        player.items.rebornDan++;
        logBattleAction('获得了洗髓丹！');
    }

     if (stage >= 1 && Math.random() < 0.0003) {
        player.items.companionKey++;
        logBattleAction('获得了伴侣钥匙！');
    }
    // 其他道具掉落逻辑可以在这里添加
}

// 更新道具显示
function updateItemDisplay() {
    const container = document.getElementById('itemContainer');
    if (!container) return;
    container.innerHTML = Object.entries(player.items || {})
        .map(([key, value]) => {
            const item = itemEffects[key];
            if (!item) {
                return `<div>${key}: ${value}（未知道具，无配置）</div>`;
            }
            return `<div>${item.name}: ${value} - ${item.description}</div>`;
        })
        .join('');
}
        function dropDungeonEquipment(stage) {
            const dropRates = getDropRatesByStage(stage);
            const drops = [];
            for (let i = 0; i < 3; i++) {
                const rand = Math.random();
                let cumulativeProb = 0;
                for (const [rarity, prob] of Object.entries(dropRates)) {
                    cumulativeProb += prob;
                    if (rand < cumulativeProb) {
                        drops.push(rarity);
                        break;
                    }
                }
            }

            drops.forEach(rarity => {
                addDungeonEquipment(rarity);
                logBattleAction(`获得了副本装备：${dungeonEquipmentTypes[rarity].name}`);
          // 新增：检查称号解锁
            checkTitleUnlocks();
            });
        }

        function dropSoulRing(stage) {
    const soulRingDrops = [
        { minStage: 1, type: 'year1', chance: 0.02 },
        { minStage: 105, type: 'year10', chance: 0.02 },
        { minStage: 205, type: 'year100', chance: 0.02 },
        { minStage: 305, type: 'year1000', chance: 0.02 },
        { minStage: 405, type: 'year10000', chance: 0.01 },
        { minStage: 505, type: 'year10000', chance: 0.01 },
        { minStage: 605, type: 'year100000', chance: 0.01 },
        { minStage: 705, type: 'year1000000', chance: 0.01 },
        { minStage: 890, type: 'year10000000', chance: 0.01 },
        { minStage: 920, type: 'year100000000', chance: 0.01 },
        { minStage: 1040, type: 'year2', chance: 0.01 },
        { minStage: 1160, type: 'year3', chance: 0.01 },
        { minStage: 1280, type: 'year4', chance: 0.01 },
        { minStage: 1300, type: 'year5', chance: 0.01 },
        { minStage: 1420, type: 'year6', chance: 0.01 },
        { minStage: 1540, type: 'year7', chance: 0.01 },
        { minStage: 1660, type: 'year8', chance: 0.01 },
        { minStage: 1780, type: 'year9', chance: 0.01 },
        { minStage: 1800, type: 'year11', chance: 0.01 },
        { minStage: 1920, type: 'year12', chance: 0.01 },
        { minStage: 2040, type: 'year13', chance: 0.01 },
        { minStage: 2160, type: 'year14', chance: 0.01 },
        { minStage: 2280, type: 'year15', chance: 0.01 },
        { minStage: 2300, type: 'year16', chance: 0.01 },
        { minStage: 2420, type: 'year17', chance: 0.01 },
        { minStage: 2540, type: 'year18', chance: 0.01 },
        { minStage: 2660, type: 'year19', chance: 0.01 },
        { minStage: 2780, type: 'year20', chance: 0.01 },
        { minStage: 2800, type: 'year21', chance: 0.01 },
        { minStage: 2920, type: 'year22', chance: 0.01 },
        { minStage: 3040, type: 'year23', chance: 0.01 },
        { minStage: 3100, type: 'year24', chance: 0.01 },
        { minStage: 3280, type: 'year25', chance: 0.01 },
        { minStage: 3300, type: 'year26', chance: 0.01 },
        { minStage: 3420, type: 'year27', chance: 0.01 },
        { minStage: 3540, type: 'year28', chance: 0.01 },
        { minStage: 3660, type: 'year29', chance: 0.01 },
        { minStage: 3780, type: 'year30', chance: 0.01 },
        { minStage: 3800, type: 'year31', chance: 0.01 },
        { minStage: 4020, type: 'year32', chance: 0.01 },
        { minStage: 4140, type: 'year33', chance: 0.01 },
        { minStage: 4280, type: 'year34', chance: 0.01 },
        { minStage: 4300, type: 'year35', chance: 0.01 },
        { minStage: 4420, type: 'year36', chance: 0.01 },
        { minStage: 4550, type: 'year37', chance: 0.01 }
    ];

    soulRingDrops.forEach(drop => {
        if (stage >= drop.minStage && Math.random() < drop.chance) {
            addSoulRing(drop.type);
            logBattleAction(`获得了${soulRingTypes[drop.type].name}`);
          // 新增：检查称号解锁
                checkTitleUnlocks();
            // 检查成就
            const ring = player.soulRings.find(r => r.type === drop.type);
            if (ring) {
                checkSoulRingAchievements(drop.type, ring.level);
            }
        }
    });
}

       function getDropRatesByStage(stage) {
            if (stage <= 5) {
                return { common: 0.9, rare: 0.1 };
            } else if (stage <= 20) {
                return { common: 0.9, rare: 0.04, epic: 0.05, legendary: 0.01  };
            } else if (stage <= 150) {
                return { common: 0.9, rare: 0.02, epic: 0.04, legendary: 0.03, ancient: 0.01 };
            } else if (stage <= 300) {
                return { common: 0.8, epic: 0.11, legendary: 0.03, ancient: 0.03, divine: 0.02, arcane: 0.01 };
            } else if (stage <= 450) {
                return { common: 0.8, legendary: 0.05, ancient: 0.06, divine: 0.04, arcane: 0.02, celestial: 0.02, infernal: 0.01 };
            } else if (stage <= 600) {
                return { common: 0.8, ancient: 0.04, divine: 0.06, arcane: 0.04, celestial: 0.02, infernal: 0.02, astral: 0.01, primeval: 0.01 };
            } else if (stage <= 750) {
                return { common: 0.8, divine: 0.03, arcane: 0.06, celestial: 0.04, infernal: 0.02, astral: 0.02, primeval: 0.01, transcendental: 0.01, quantum: 0.01 };
            } else if (stage <= 900) {
                return { common: 0.8, celestial: 0.03, infernal: 0.06, astral: 0.04, primeval: 0.02, transcendental: 0.02, quantum: 0.01, ultimate: 0.01, ultimate1: 0.01 };
            } else if (stage <= 1050) {
                return { common: 0.8, infernal: 0.03, astral: 0.06, primeval: 0.04, transcendental: 0.02, quantum: 0.02, ultimate: 0.01, ultimate2: 0.01, ultimate3: 0.01 };
            } else if (stage <= 1200) {
                return { common: 0.8, primeval: 0.03, transcendental: 0.06, quantum: 0.04, ultimate: 0.02, ultimate1: 0.02, ultimate2: 0.01, ultimate3: 0.01, ultimate4: 0.01 };
            } else if (stage <= 1350) {
                return { common: 0.8, quantum: 0.03, ultimate: 0.06, ultimate1: 0.04, ultimate2: 0.02, ultimate3: 0.02, ultimate4: 0.01, ultimate5: 0.01, ultimate6: 0.01 };
            } else if (stage <= 1500) {
                return { common: 0.8, ultimate1: 0.03, ultimate2: 0.06, ultimate3: 0.04, ultimate4: 0.02, ultimate5: 0.02, ultimate6: 0.01, ultimate7: 0.01, ultimate8: 0.01 };
            } else if (stage <= 1650) {
                return { common: 0.8, ultimate3: 0.03, ultimate4: 0.06, ultimate5: 0.04, ultimate6: 0.02, ultimate7: 0.02, ultimate8: 0.01, ultimate9: 0.01, ultimate10: 0.01 };
            } else if (stage <= 1800) {
                return { common: 0.8, ultimate5: 0.03, ultimate6: 0.06, ultimate7: 0.04, ultimate8: 0.02, ultimate9: 0.02, ultimate10: 0.01, ultimate11: 0.01, ultimate12: 0.01 };
            } else if (stage <= 1950) {
                return { common: 0.8, ultimate7: 0.03, ultimate8: 0.06, ultimate9: 0.04, ultimate10: 0.02, ultimate11: 0.02, ultimate12: 0.01, ultimate13: 0.01, ultimate14: 0.01 };
            } else if (stage <= 2100) {
                return { common: 0.8, ultimate9: 0.03, ultimate10: 0.06, ultimate11: 0.04, ultimate12: 0.02, ultimate13: 0.02, ultimate14: 0.01, ultimate15: 0.01, ultimate16: 0.01 };
            } else if (stage <= 2250) {
                return { common: 0.8, ultimate11: 0.03, ultimate12: 0.06, ultimate13: 0.04, ultimate14: 0.02, ultimate15: 0.02, ultimate16: 0.01, ultimate17: 0.01, ultimate18: 0.011 };
            } else if (stage <= 2400) {
                return { common: 0.8, ultimate13: 0.03, ultimate14: 0.06, ultimate15: 0.04, ultimate16: 0.02, ultimate17: 0.02, ultimate18: 0.01, ultimate19: 0.01, ultimate20: 0.01 };
            } else if (stage <= 2550) {
                return { common: 0.8, ultimate15: 0.03, ultimate16: 0.06, ultimate17: 0.04, ultimate18: 0.02, ultimate19: 0.02, ultimate20: 0.01, ultimate21: 0.01, ultimate22: 0.01 };
            } else if (stage <= 2700) {
                return { common: 0.8, ultimate17: 0.03, ultimate18: 0.06, ultimate19: 0.04, ultimate20: 0.02, ultimate21: 0.02, ultimate22: 0.01, ultimate23: 0.01, ultimate24: 0.01 };
            } else if (stage <= 2850) {
                return { common: 0.8, ultimate19: 0.03, ultimate20: 0.06, ultimate21: 0.04, ultimate22: 0.02, ultimate23: 0.02, ultimate24: 0.01, ultimate25: 0.01, ultimate26: 0.01 };
            } else if (stage <= 3000) {
                return { common: 0.8, ultimate21: 0.03, ultimate22: 0.06, ultimate23: 0.04, ultimate24: 0.02, ultimate25: 0.02, ultimate26: 0.01, ultimate27: 0.01, ultimate28: 0.01 };
            } else if (stage <= 3150) {
                return { common: 0.8, ultimate23: 0.03, ultimate24: 0.06, ultimate25: 0.04, ultimate26: 0.02, ultimate27: 0.02, ultimate28: 0.01, ultimate29: 0.01, ultimate30: 0.01 };
            } else if  (stage <= 3300) {
                return { common: 0.8, ultimate25: 0.03, ultimate26: 0.06, ultimate27: 0.04, ultimate28: 0.02, ultimate29: 0.02, ultimate30: 0.01, ultimate31: 0.01, ultimate32: 0.01 };
            } else if (stage <= 3450) {
                return { common: 0.8, ultimate27: 0.03, ultimate28: 0.06, ultimate29: 0.04, ultimate30: 0.02, ultimate31: 0.02, ultimate32: 0.01, ultimate33: 0.01, ultimate34: 0.01 };
            } else if (stage <= 3600) {
                return { common: 0.8, ultimate29: 0.03, ultimate30: 0.06, ultimate31: 0.04, ultimate32: 0.02, ultimate33: 0.02, ultimate34: 0.01, ultimate35: 0.01, ultimate36: 0.01 };
            } else if (stage <= 3750) {
                return { common: 0.8, ultimate31: 0.03, ultimate32: 0.06, ultimate33: 0.04, ultimate34: 0.02, ultimate35: 0.02, ultimate36: 0.01, ultimate37: 0.01, ultimate38: 0.01 };
            } else if (stage <= 3900) {
                return { common: 0.8, ultimate33: 0.03, ultimate34: 0.06, ultimate35: 0.04, ultimate36: 0.02, ultimate37: 0.02, ultimate38: 0.01, ultimate39: 0.01, ultimate40: 0.01 };
            } else if (stage <= 4050) {
                return { common: 0.8, ultimate35: 0.03, ultimate36: 0.06, ultimate37: 0.04, ultimate38: 0.02, ultimate39: 0.02, ultimate40: 0.01, ultimate41: 0.01, ultimate42: 0.01 };
            } else if (stage <= 4200) {
                return { common: 0.8, ultimate37: 0.03, ultimate38: 0.06, ultimate39: 0.04, ultimate40: 0.02, ultimate41: 0.02, ultimate42: 0.01, ultimate43: 0.01, ultimate44: 0.01 };
            } else if (stage <= 4350) {
                return { common: 0.8, ultimate39: 0.03, ultimate40: 0.06, ultimate41: 0.04, ultimate42: 0.02, ultimate43: 0.02, ultimate44: 0.01, ultimate45: 0.01, ultimate46: 0.01 };
            } else if (stage <= 4500) {
                return { common: 0.8, ultimate41: 0.03, ultimate42: 0.06, ultimate43: 0.04, ultimate44: 0.02, ultimate45: 0.02, ultimate46: 0.01, ultimate47: 0.01, ultimate48: 0.01 };
            } else {
                return { common: 0.8, ultimate43: 0.03, ultimate44: 0.06, ultimate45: 0.04, ultimate46: 0.02, ultimate47: 0.02, ultimate48: 0.01, ultimate49: 0.01, ultimate50: 0.01 };
            }
        }


        function fleeFromBattle() {
            const cost = player.battle.maxStage * 10;
            if (player.reincarnationCoin >= cost) {
                player.reincarnationCoin -= cost;
                player.battle.currentStage = 0;
                generateMonster();
               updateOfficialSystemDisplay();
                updateMonsterUI();
                logBattleAction(`你重置了关卡，消耗了${cost}转生币`);
            } else {
                logBattleAction('转生币不足，无法重置关卡！');
            }
        }
      
        function sweepStages() {
    const currentStage = player.battle.currentStage;
    const maxStage = player.battle.maxStage;
    const targetStage = Math.max(1, maxStage - 6); // 扫荡到最大关卡-5
    
    if (currentStage >= targetStage) {
        logBattleAction("没有可扫荡的关卡！");
        return;
    }
    
    // 计算消耗的转生币
    const cost = (targetStage - currentStage) * 2;
    
    if (player.reincarnationCoin < cost) {
        logBattleAction(`扫荡需要 ${cost} 转生币，当前不足！`);
        return;
    }
    
    // 确认对话框
    showCustomConfirm(`确定要扫荡从第${currentStage + 1}关到第${targetStage}关吗？消耗 ${cost} 转生币`, (confirmed) => {
        if (confirmed) {
            player.reincarnationCoin -= cost;
            
            // 记录扫荡前的状态
            const originalStage = player.battle.currentStage;
            let totalDrops = 0;
            let dungeonEquipmentDrops = 0;
            let soulRingDrops = 0;
            let itemDrops = 0;
            
            // 模拟扫荡过程
            for (let stage = currentStage; stage < targetStage; stage++) {
                player.battle.currentStage = stage;
                
                // 固定掉落3个副本装备
                for (let i = 0; i < 3; i++) {
                    const dungeonDrops = getDropRatesByStage(stage);
                    const rand = Math.random();
                    let cumulativeProb = 0;
                    
                    for (const [rarity, prob] of Object.entries(dungeonDrops)) {
                        cumulativeProb += prob;
                        if (rand < cumulativeProb) {
                            addDungeonEquipment(rarity);
                            dungeonEquipmentDrops++;
                            break;
                        }
                    }
                }
                
                // 魂环掉落（保持原逻辑）
                const soulRingResult = simulateSoulRingDrop(stage);
                if (soulRingResult) {
                    soulRingDrops++;
                }
                
                // 道具掉落（保持原逻辑）
                const itemResult = simulateItemDrop(stage);
                if (itemResult) {
                    itemDrops++;
                }
                
                // 更新显示（每10关更新一次）
                if (stage % 10 === 0) {
                    updateMonsterUI();
                }
            }
            
            // 扫荡完成后停留在目标关卡
            player.battle.currentStage = targetStage;
            generateMonster();
            
            logBattleAction(`扫荡完成！从第${originalStage + 1}关到第${targetStage}关`);
            logBattleAction(`获得副本装备: ${dungeonEquipmentDrops}件`);
            logBattleAction(`获得魂环: ${soulRingDrops}件`);
            logBattleAction(`获得道具: ${itemDrops}件`);
            updateMonsterUI();
           updateOfficialSystemDisplay();
        }
    });
}

// 单独提取魂环掉落逻辑
function simulateSoulRingDrop(stage) {
    const soulRingDrops = [
       { minStage: 1, type: 'year1', chance: 0.02 },
        { minStage: 105, type: 'year10', chance: 0.02 },
        { minStage: 205, type: 'year100', chance: 0.02 },
        { minStage: 305, type: 'year1000', chance: 0.02 },
        { minStage: 405, type: 'year10000', chance: 0.01 },
        { minStage: 505, type: 'year10000', chance: 0.01 },
        { minStage: 605, type: 'year100000', chance: 0.01 },
        { minStage: 705, type: 'year1000000', chance: 0.01 },
        { minStage: 890, type: 'year10000000', chance: 0.01 },
        { minStage: 920, type: 'year100000000', chance: 0.01 },
        { minStage: 1040, type: 'year2', chance: 0.01 },
        { minStage: 1160, type: 'year3', chance: 0.01 },
        { minStage: 1280, type: 'year4', chance: 0.01 },
        { minStage: 1300, type: 'year5', chance: 0.01 },
        { minStage: 1420, type: 'year6', chance: 0.01 },
        { minStage: 1540, type: 'year7', chance: 0.01 },
        { minStage: 1660, type: 'year8', chance: 0.01 },
        { minStage: 1780, type: 'year9', chance: 0.01 },
        { minStage: 1800, type: 'year11', chance: 0.01 },
        { minStage: 1920, type: 'year12', chance: 0.01 },
        { minStage: 2040, type: 'year13', chance: 0.01 },
        { minStage: 2160, type: 'year14', chance: 0.01 },
        { minStage: 2280, type: 'year15', chance: 0.01 },
        { minStage: 2300, type: 'year16', chance: 0.01 },
        { minStage: 2420, type: 'year17', chance: 0.01 },
        { minStage: 2540, type: 'year18', chance: 0.01 },
        { minStage: 2660, type: 'year19', chance: 0.01 },
        { minStage: 2780, type: 'year20', chance: 0.01 },
        { minStage: 2800, type: 'year21', chance: 0.01 },
        { minStage: 2920, type: 'year22', chance: 0.01 },
        { minStage: 3040, type: 'year23', chance: 0.01 },
        { minStage: 3100, type: 'year24', chance: 0.01 },
        { minStage: 3280, type: 'year25', chance: 0.01 },
        { minStage: 3300, type: 'year26', chance: 0.01 },
        { minStage: 3420, type: 'year27', chance: 0.01 },
        { minStage: 3540, type: 'year28', chance: 0.01 },
        { minStage: 3660, type: 'year29', chance: 0.01 },
        { minStage: 3780, type: 'year30', chance: 0.01 },
        { minStage: 3800, type: 'year31', chance: 0.01 },
        { minStage: 4020, type: 'year32', chance: 0.01 },
        { minStage: 4140, type: 'year33', chance: 0.01 },
        { minStage: 4280, type: 'year34', chance: 0.01 },
        { minStage: 4300, type: 'year35', chance: 0.01 },
        { minStage: 4420, type: 'year36', chance: 0.01 },
        { minStage: 4550, type: 'year37', chance: 0.01 }
    ];
    
    for (const drop of soulRingDrops) {
        if (stage >= drop.minStage && Math.random() < drop.chance) {
            addSoulRing(drop.type);
            return true;
        }
    }
    return false;
}

// 单独提取道具掉落逻辑
function simulateItemDrop(stage) {
    let hasDropped = false;
    
    // 洗炼石掉落（1000关以上0.05%概率）
    if (stage >= 1000 && Math.random() < 0.0001) {
        player.items.refineStone++;
        hasDropped = true;
    }
    
    // VIP能力值掉落（全关卡0.1%概率）
    if (stage >= 1 && Math.random() < 0.0002) {
        player.items.vipPower++;
        hasDropped = true;
    }
    
    // 初级宝石掉落（500关以上0.04%概率）
    if (stage >= 500 && Math.random() < 0.0003) {
        player.items.primaryGem++;
        hasDropped = true;
    }
    
    // 高级宝石掉落（1000关以上0.03%概率）
    if (stage >= 1000 && Math.random() < 0.0002) {
        player.items.advancedGem++;
        hasDropped = true;
    }
    
    // 极品宝石掉落（1500关以上0.01%概率）
    if (stage >= 1500 && Math.random() < 0.0001) {
        player.items.superiorGem++;
        hasDropped = true;
    }
    
    // 玫瑰花掉落（1关以上0.05%概率）
    if (stage >= 1 && Math.random() < 0.001) {
        player.items.rose++;
        hasDropped = true;
    }
    // 洗髓丹匙掉落（2000关以上0.001%概率）
    if (stage >= 2000 && Math.random() < 0.0001) {
        player.items.rebornDan++;
        hasDropped = true;
    }
    // 洗髓丹匙掉落（1000关以上0.001%概率）
    if (stage >= 1000 && Math.random() < 0.0001) {
        player.items.baitCount++;
        hasDropped = true;
    }
    // 伴侣钥匙掉落（1关以上0.001%概率）
    if (stage >= 1 && Math.random() < 0.0001) {
        player.items.companionKey++;
        hasDropped = true;
    }
    
    return hasDropped;
}
        function jumpToStage() {
            const stage = parseInt(document.getElementById('jumpStage').value) || 0;
            if (stage > player.battle.currentStage && stage <= player.battle.maxStage && player.reincarnationCoin >= stage) {
                player.reincarnationCoin -= stage;
                player.battle.currentStage = stage;
                generateMonster();
                updateMonsterUI();
                logBattleAction(`你跳到了第${stage + 1}关`);
            } else {
                logBattleAction('无法跳到该关卡！');
            }
        }
     function formatNumber(value) {
    return formatSci(value);
}
        function logBattleAction(message) {
    const formattedMessage = String(message);

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `<div class="battle-log-entry">[${timestamp}] ${formattedMessage}</div>`;
    
    const logContainer = document.getElementById("battleLogContent");
    logContainer.insertAdjacentHTML("afterbegin", logEntry);
    
    // 保持最多20条日志
    if (logContainer.children.length > 20) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// 添加自动扫荡控制函数
function toggleAutoSweep() {
    player.battle.autoSweepEnabled = !player.battle.autoSweepEnabled;
    
    // 更新UI显示
    document.getElementById('autoSweepStatus').textContent = 
        player.battle.autoSweepEnabled ? '开' : '关';
    
    // 如果开启自动扫荡，启动定时器
    if (player.battle.autoSweepEnabled) {
        startAutoSweep();
    } else {
        stopAutoSweep();
    }
    
    logAction(`自动扫荡已${player.battle.autoSweepEnabled ? '开启' : '关闭'}`, 'info');
    saveGame();
 
}

// 启动自动扫荡
function startAutoSweep() {
    // 清除现有定时器（如果有）
    stopAutoSweep();
    // 每4秒执行一次自动扫荡
    player.battle.autoSweepInterval = registerInterval(autoSweepProcess, 6000);
}

// 停止自动扫荡
function stopAutoSweep() {
    if (player.battle.autoSweepInterval) {
        clearInterval(player.battle.autoSweepInterval);
        player.battle.autoSweepInterval = null;
    }
}

// 自动扫荡处理流程
function autoSweepProcess() {
    // 检查是否需要重置关卡
    if (player.battle.currentStage >= Math.max(1, player.battle.maxStage - 1)) {
        // 重置关卡到0
        player.battle.currentStage = 0;
        logBattleAction("已自动重置关卡到初始位置");
    }
    
    // 执行扫荡
    const currentStage = player.battle.currentStage;
    const maxStage = player.battle.maxStage;
    const targetStage = Math.max(1, maxStage - 1);
    
    if (currentStage >= targetStage) {
        logBattleAction("自动扫荡：没有可扫荡的关卡，将重置关卡");
        return;
    }
    
    const sweepCount = targetStage - currentStage;
    const cost = sweepCount * 12;
    if (player.reincarnationCoin < cost) {
        logBattleAction(`自动扫荡：转生币不足（需要${cost}），已停止`);
        toggleAutoSweep(); // 停止自动扫荡
        return;
    }
    
    // 自动执行扫荡（无需确认）
    player.reincarnationCoin -= cost;
    
    const originalStage = player.battle.currentStage;
    let dungeonEquipmentDrops = 0;
    let soulRingDrops = 0;
    let itemDrops = 0;
    // 逐关静默模拟掉落，尽量减少不必要的计算
    for (let stage = currentStage; stage < targetStage; stage++) {
        player.battle.currentStage = stage;
        
        // 固定掉落3个副本装备 - 使用静默方式添加
        // 优化：同一关卡只获取一次掉落配置，避免重复构造对象
        const dungeonDrops = getDropRatesByStage(stage);
        const dungeonEntries = Object.entries(dungeonDrops);
        for (let i = 0; i < 3; i++) {
            const rand = Math.random();
            let cumulativeProb = 0;
            
            for (let j = 0; j < dungeonEntries.length; j++) {
                const [rarity, prob] = dungeonEntries[j];
                cumulativeProb += prob;
                if (rand < cumulativeProb) {
                    addDungeonEquipmentSilent(rarity); // 使用静默版本
                    dungeonEquipmentDrops++;
                    break;
                }
            }
        }
        
        // 魂环掉落 - 使用静默方式
        const soulRingResult = simulateSoulRingDropSilent(stage);
        if (soulRingResult) {
            soulRingDrops++;
        }
        
      // 道具掉落 - 保持原样（如果需要也可以静默）
        const itemResult = simulateItemDrop(stage);
        if (itemResult) {
            itemDrops++;
        }
    }

    // 扫荡完成后停留在目标关卡
    player.battle.currentStage = targetStage;
    generateMonster();
    
    // 合并日志，减少日志行数量，缓解长时间运行卡顿
    logBattleAction(
        `自动扫荡完成（共${sweepCount}关）：从第${originalStage + 1}关到第${targetStage}关，` +
        `获得副本装备 ${dungeonEquipmentDrops} 件，魂环 ${soulRingDrops} 个，道具 ${itemDrops} 个`
    );
    updateOfficialSystemDisplay();
    updateMonsterUI(); 
}
// 静默添加副本装备（不显示提示）
function addDungeonEquipmentSilent(rarity) {
    const config = dungeonEquipmentTypes[rarity];
    const growthRate = Math.random() * (config.growthRange[1] - config.growthRange[0]) + config.growthRange[0];

    const existingEq = player.dungeonEquipment.find(eq => eq.rarity === rarity);
    if (existingEq) {
        existingEq.quantity = (existingEq.quantity || 1) + 1;
        if (existingEq.quantity >= 3) {
            existingEq.level++;
            existingEq.quantity = 0;
        }
    } else {
        const newEq = {
            name: config.name,
            rarity: rarity,
            level: 1,
            growthRate: growthRate,
            quantity: 1
        };
        player.dungeonEquipment.push(newEq);
    }
}

// 静默添加魂环（不显示提示）
function simulateSoulRingDropSilent(stage) {
    const soulRingDrops = [
        { minStage: 1, type: 'year1', chance: 0.02 },
        { minStage: 105, type: 'year10', chance: 0.02 },
        { minStage: 205, type: 'year100', chance: 0.02 },
        { minStage: 305, type: 'year1000', chance: 0.02 },
        { minStage: 405, type: 'year10000', chance: 0.01 },
        { minStage: 505, type: 'year10000', chance: 0.01 },
        { minStage: 605, type: 'year100000', chance: 0.01 },
        { minStage: 705, type: 'year1000000', chance: 0.01 },
        { minStage: 890, type: 'year10000000', chance: 0.01 },
        { minStage: 920, type: 'year100000000', chance: 0.01 },
        { minStage: 1040, type: 'year2', chance: 0.01 },
        { minStage: 1160, type: 'year3', chance: 0.01 },
        { minStage: 1280, type: 'year4', chance: 0.01 },
        { minStage: 1300, type: 'year5', chance: 0.01 },
        { minStage: 1420, type: 'year6', chance: 0.01 },
        { minStage: 1540, type: 'year7', chance: 0.01 },
        { minStage: 1660, type: 'year8', chance: 0.01 },
        { minStage: 1780, type: 'year9', chance: 0.01 },
        { minStage: 1800, type: 'year11', chance: 0.01 },
        { minStage: 1920, type: 'year12', chance: 0.01 },
        { minStage: 2040, type: 'year13', chance: 0.01 },
        { minStage: 2160, type: 'year14', chance: 0.01 },
        { minStage: 2280, type: 'year15', chance: 0.01 },
        { minStage: 2300, type: 'year16', chance: 0.01 },
        { minStage: 2420, type: 'year17', chance: 0.01 },
        { minStage: 2540, type: 'year18', chance: 0.01 },
        { minStage: 2660, type: 'year19', chance: 0.01 },
        { minStage: 2780, type: 'year20', chance: 0.01 },
        { minStage: 2800, type: 'year21', chance: 0.01 },
        { minStage: 2920, type: 'year22', chance: 0.01 },
        { minStage: 3040, type: 'year23', chance: 0.01 },
        { minStage: 3100, type: 'year24', chance: 0.01 },
        { minStage: 3280, type: 'year25', chance: 0.01 },
        { minStage: 3300, type: 'year26', chance: 0.01 },
        { minStage: 3420, type: 'year27', chance: 0.01 },
        { minStage: 3540, type: 'year28', chance: 0.01 },
        { minStage: 3660, type: 'year29', chance: 0.01 },
        { minStage: 3780, type: 'year30', chance: 0.01 },
        { minStage: 3800, type: 'year31', chance: 0.01 },
        { minStage: 4020, type: 'year32', chance: 0.01 },
        { minStage: 4140, type: 'year33', chance: 0.01 },
        { minStage: 4280, type: 'year34', chance: 0.01 },
        { minStage: 4300, type: 'year35', chance: 0.01 },
        { minStage: 4420, type: 'year36', chance: 0.01 },
        { minStage: 4550, type: 'year37', chance: 0.01 }
    ];
    
    for (const drop of soulRingDrops) {
        if (stage >= drop.minStage && Math.random() < drop.chance) {
            addSoulRingSilent(drop.type); // 使用静默版本
            return true;
        }
    }
    return false;
}

function addSoulRingSilent(type) {
    const existing = player.soulRings.find(r => r.type === type);
    if(existing) {
        existing.level++;
    } else {
        player.soulRings.push({
            type: type,
            level: 1,
            multiplier: soulRingTypes[type].baseMult
        });
    }
}
  function addAttributePoint(attribute, amount) {
    // 计算实际要加的点数
    let pointsToAdd = 0;
    if (amount === 'all') {
        pointsToAdd = player.attributes.remainingPoints; // 全部剩余属性点
    } else {
        pointsToAdd = Math.min(amount, player.attributes.remainingPoints); // 不能超过剩余属性点
    }

    if (pointsToAdd <= 0) {
        logAction("剩余属性点不足！", "error");
        return;
    }

    // 根据属性类型加点
    switch (attribute) {
        case 'health':
            player.attributes.health += pointsToAdd;
            break;
        case 'attack':
            player.attributes.attack += pointsToAdd;
            break;
        case 'critRate':
            player.attributes.critRate += pointsToAdd;
            break;
        case 'critDamage':
            player.attributes.critDamage += pointsToAdd;
            break;
        case 'multiAttack':
            player.attributes.multiAttack += pointsToAdd;
            break;
        case 'block':
            player.attributes.block += pointsToAdd;
            break;
        default:
            logAction("无效的属性类型！", "error");
            return;
    }

    // 扣除剩余属性点
    player.attributes.remainingPoints -= pointsToAdd;

    // 更新显示
    updatePlayerAttributesDisplay();
    logAction(`成功为${attribute}属性增加${pointsToAdd}点`, 'success');
}

function resetAttributes() {
    if (player.reincarnationCoin >= 1) {
        player.reincarnationCoin -= 1;
        // 重置所有属性点
        player.attributes.health = 0;
        player.attributes.attack = 0;
        player.attributes.critRate = 0;
        player.attributes.critDamage = 0;
        player.attributes.multiAttack = 0;
        player.attributes.block = 0;
        // 重置剩余属性点 = 总属性点
        player.attributes.remainingPoints = player.attributes.totalPoints;
        updatePlayerAttributesDisplay(); // 更新显示
        logAction("属性点已重置", "success");
    } else {
        logAction("转生币不足！", "error");
    }
}

 function handleBattleResult(isVictory) {
    // 保存当前的功法加成
    const techniqueBonuses = {
        health: player.attributes.healthBonus,
        attack: player.attributes.attackBonus,
        critRate: player.attributes.critRateBonus,
        critDamage: player.attributes.critDamageBonus,
        multiAttack: player.attributes.multiAttackBonus
    };
    
    if (isVictory) {
        // 胜利逻辑...
        player.battle.currentStage++;
        player.battle.maxStage = Math.max(player.battle.maxStage, player.battle.currentStage);
    } else {
        // 失败逻辑...
        player.battle.playerHealth = player.reincarnationCount;
    }
    
    // 恢复功法加成
    player.attributes.healthBonus = techniqueBonuses.health;
    player.attributes.attackBonus = techniqueBonuses.attack;
    player.attributes.critRateBonus = techniqueBonuses.critRate;
    player.attributes.critDamageBonus = techniqueBonuses.critDamage;
    player.attributes.multiAttackBonus = techniqueBonuses.multiAttack;
    
    // 更新玩家战斗属性
    updatePlayerBattleStats();
    
}
function updatePlayerAttributesDisplay() {
    // 计算总属性点
    const totalAttributePoints = player.reincarnationCount * 1 + player.battle.maxStage * 10 + player.tower.currentFloor * 1;
    player.attributes.totalPoints = totalAttributePoints;

    // 更新总属性点和剩余属性点
    document.getElementById("totalAttributePoints").textContent = player.attributes.totalPoints;
    document.getElementById("remainingAttributePoints").textContent = player.attributes.remainingPoints;

    // 更新各属性加成显示和已投入点数
    document.getElementById("healthBonus").textContent = 
        (player.attributes.health * 1 + player.attributes.healthBonus * 100).toFixed(2) + "%";
    document.getElementById("healthPoints").textContent = player.attributes.health;
    
    document.getElementById("attackBonus").textContent = 
        (player.attributes.attack * 1 + player.attributes.attackBonus * 100).toFixed(2) + "%";
    document.getElementById("attackPoints").textContent = player.attributes.attack;
    
    document.getElementById("critRateBonus").textContent = 
        (player.attributes.critRate * 0.05 + player.attributes.critRateBonus * 100).toFixed(3) + "%";
    document.getElementById("critRatePoints").textContent = player.attributes.critRate;
    
    document.getElementById("critDamageBonus").textContent = 
        (player.attributes.critDamage * 0.50 + player.attributes.critDamageBonus * 100).toFixed(2) + "%";
    document.getElementById("critDamagePoints").textContent = player.attributes.critDamage;
    
    document.getElementById("multiAttackBonus").textContent = 
        Math.floor(player.attributes.multiAttack / 300) + player.attributes.multiAttackBonus;
    document.getElementById("multiAttackPoints").textContent = player.attributes.multiAttack;
}
function updateTechniqueBonuses() {
    // 重置所有加成
    player.attributes.healthBonus = 0;
    player.attributes.attackBonus = 0;
    player.attributes.critRateBonus = 0;
    player.attributes.critDamageBonus = 0;
    player.attributes.multiAttackBonus = 0;
    
    // 计算所有功法提供的加成
    Object.entries(player.techniques).forEach(([type, level]) => {
        const tech = techniqueConfig[type];
        if(tech) {
            switch(tech.type) {
                case 'health':
                    player.attributes.healthBonus += level * tech.effect;
                    break;
                case 'attack':
                    player.attributes.attackBonus += level * tech.effect;
                    break;
                case 'critRate':
                    player.attributes.critRateBonus += level * tech.effect;
                    break;
                case 'critDamage':
                    player.attributes.critDamageBonus += level * tech.effect;
                    break;
                case 'multiAttack':
                    player.attributes.multiAttackBonus += Math.floor(level * tech.effect);
                    break;
            }
        }
    });
    
    // 更新玩家战斗属性
    updatePlayerBattleStats();
     updateOfficialSystemDisplay();
    updatePlayerAttributesDisplay();
}
function updatePlayerBattleStats() {
 try {
 let mountHealthBonus = 0;
    let mountAttackBonus = 0;
    let mountCritDamageBonus = 0;  
    if (player.mounts.equipped) {
        const equippedMount = player.mounts.inventory.find(m => m.id === player.mounts.equipped);
        if (equippedMount) {
            // 坐骑等级加成（每级增加100%）
            const mountLevelMultiplier = player.mounts.level;
            
            // 计算各项属性加成
            if (equippedMount.stats.health) {
                mountHealthBonus = equippedMount.stats.health * mountLevelMultiplier;
            }
            if (equippedMount.stats.attack) {
                mountAttackBonus = equippedMount.stats.attack * mountLevelMultiplier;
            }
            if (equippedMount.stats.critDamage) {
                mountCritDamageBonus = equippedMount.stats.critDamage * mountLevelMultiplier;
            }
        }
    }

let wingHealthBonus = 0;
    if (player.wings.equipped) {
        const equippedWing = player.wings.inventory.find(w => w.id === player.wings.equipped);
        if (equippedWing) {
            wingHealthBonus = equippedWing.healthBonus * player.wings.level * 1; // 翅膀等级每级提供100%加成
        }
    }
     const runeBonuses = calculateRuneBonuses();
    // 1. 获取各类加成
    const classBonuses = calculateClassBonuses();
    const titleBonuses = calculateTotalBonuses(); // 重命名变量避免混淆
    const officialBonus = getOfficialBonus();
    const companionBonuses = getCompanionBonuses(); // 获取伴侣天赋加成
   const artifactBonuses = calculateArtifactBonuses();
    // 保存职业加成到player对象
    player.classBonuses = classBonuses;
    const bonuses = calculateGemBonuses(); 
    const techBonuses = calculateTechniqueBonuses();
   const equipmentStats = calculateTotalEquipmentStats();
   const beastBonus = calculateEquippedBeastBonus();
   const supremeBonus = (typeof calculateEquippedSupremeArtifactBonus === 'function') ? calculateEquippedSupremeArtifactBonus() : { health: 0, attack: 0, critDamage: 0 };
   const pixelBonus = getPixelPlayerBonus ? getPixelPlayerBonus() : { health: 0, attack: 0, critRate: 0, critDamage: 0 };
    // 联网深渊神器永久加成（仅联网登录时生效，数据在服务器）
    var networkHpPct = (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken() && typeof getNetworkArtifactHealthPct === 'function') ? (getNetworkArtifactHealthPct() / 100) : 0;
    var networkAtkPct = (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken() && typeof getNetworkArtifactAttackPct === 'function') ? (getNetworkArtifactAttackPct() / 100) : 0;
    var networkPetHpPct = (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken() && typeof getNetworkArtifactPetHpPct === 'function') ? (getNetworkArtifactPetHpPct() / 100) : 0;
    var networkPetAtkPct = (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken() && typeof getNetworkArtifactPetAtkPct === 'function') ? (getNetworkArtifactPetAtkPct() / 100) : 0;
    var networkPetCritRatePct = (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken() && typeof getNetworkArtifactPetCritRatePct === 'function') ? (getNetworkArtifactPetCritRatePct() / 100) : 0;
    var networkPetCritDmgPct = (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken() && typeof getNetworkArtifactPetCritDmgPct === 'function') ? (getNetworkArtifactPetCritDmgPct() / 100) : 0;

    const lawBonuses = (typeof getLawPowerBonuses === 'function') ? getLawPowerBonuses() : { attack: 0, health: 0, critDamage: 0, critRate: 0 };

    var worldMapAbyssFloorMul = (typeof getWorldMapAbyssBestFloorStatMultiplier === 'function') ? getWorldMapAbyssBestFloorStatMultiplier() : 1;
    var worldMapDivineCodexMul = (typeof getNetworkAbyssDivineCodexWorldMapMultiplier === 'function') ? getNetworkAbyssDivineCodexWorldMapMultiplier() : 1;
    var worldMapAbyssCombinedMul = worldMapAbyssFloorMul * worldMapDivineCodexMul;

    // 2. 计算玩家生命（大数安全）
    player.battle.playerHealth = multiplyBigByFactors(player.reincarnationCount, [
        (1 + player.attributes.healthBonus + player.attributes.health * 0.01),
        classBonuses.healthMultiplier,
        titleBonuses.healthMultiplier,
        companionBonuses.healthMultiplier,
        (1 + artifactBonuses.health),
        (1 + bonuses.health / 100),
        (1 + techBonuses.health),
        (1 + wingHealthBonus),
        (1 + mountHealthBonus),
        (1 + runeBonuses.health),
        (1 + (player.mining.gems.emerald * 0.05)),
        (1 + player.marriage.marriageBonuses.critRateBonus),
        (1 + player.children.childBonuses.critRateBonus),
        (1 + equipmentStats.health),
        (1 + beastBonus.health),
        (1 + supremeBonus.health),
        (1 + pixelBonus.health),
        (1 + player.fiveElements.fire.level * 3.00),
        (1 + networkHpPct),
        (1 + networkPetHpPct),
        (1 + (lawBonuses.health || 0)),
        getDongtianAnnihilationHpAtkMultiplier(),
        worldMapAbyssCombinedMul,
    ]);

    // 3. 计算玩家攻击（大数安全）
    player.battle.playerAttack = multiplyBigByFactors(getTotalClickValue(), [
        (1 + player.attributes.attackBonus + player.attributes.attack * 0.01),
        classBonuses.attackMultiplier,
        titleBonuses.attackMultiplier,
        officialBonus,
        companionBonuses.attackMultiplier,
        (1 + artifactBonuses.attack),
        (1 + bonuses.attack / 100),
        (1 + techBonuses.attack * 10),
        (1 + mountAttackBonus),
        (1 + runeBonuses.attack),
        (1 + (player.mining.gems.sapphire * 0.05)),
        (1 + player.children.childBonuses.goldMultiplier),
        (1 + equipmentStats.attack),
        (1 + beastBonus.attack),
        (1 + supremeBonus.attack),
        (1 + pixelBonus.attack),
        (1 + networkAtkPct),
        (1 + networkPetAtkPct),
        (1 + (lawBonuses.attack || 0)),
        getDongtianAnnihilationHpAtkMultiplier(),
        worldMapAbyssCombinedMul,
    ]);

    // 4. 计算暴击率（应用伴侣暴击率加成）
    const baseCritRate = 0.1 + player.attributes.critRateBonus + player.attributes.critRate * 0.00025 +
        classBonuses.critChance;
    player.battle.playerCritRate = Math.min(
        0.9,
        (baseCritRate * companionBonuses.critRateMultiplier +  (1 + techBonuses.critRate) + (0.001+
        runeBonuses.critRate) +
        equipmentStats.critRate + pixelBonus.critRate + (lawBonuses.critRate || 0)) * (1 + networkPetCritRatePct)
    );

    // 5. 计算爆伤（应用伴侣爆伤加成和全属性加成）
    player.battle.playerCritDamage = (1.5 + 
        player.attributes.critDamageBonus + 
        player.attributes.critDamage * 0.0025) *
        classBonuses.critMultiplier * titleBonuses.critMultiplier *
        companionBonuses.critDamageMultiplier * (1 + artifactBonuses.critDamage) * (1 + bonuses.critDamage / 100) *  (1 + techBonuses.critDamage* 10)  *  (1 + mountCritDamageBonus) *
        (1 + runeBonuses.critDamage)*         (1 + (player.mining.gems.amethyst*0.05)) * (1+player.marriage.marriageBonuses.critDamageBonus) *
       (1 +equipmentStats.critDamage) * (1 +beastBonus.critDamage) * (1 + supremeBonus.critDamage) * (1 + pixelBonus.critDamage) * (1+player.fiveElements.water.level * 3.00) * (1 + networkPetCritDmgPct) * (1 + (lawBonuses.critDamage || 0)) * worldMapAbyssCombinedMul; // 应用伴侣爆伤加成 + 无限深渊最佳层数 + 神兽图鉴（世界地图）

    // 6. 计算连击次数（应用伴侣连击加成）
    player.battle.playerMultiAttack = Math.max(1,
        Math.floor(player.attributes.multiAttack / 300) + 
        player.attributes.multiAttackBonus +
        companionBonuses.combo+ (1+techBonuses.multiAttack* 0.02) +
        (1+runeBonuses.combo))  // 应用伴侣连击加成
    ;

    // 更新UI显示
    updateMonsterUI();
 } catch (e) {
    if (typeof console !== 'undefined' && console.error) console.error('updatePlayerBattleStats error', e);
 }
}
function checkTimeValidity() {
    const now = Date.now();
    const storedTime = localStorage.getItem('lastValidTime');
    
    if (!storedTime) {
        localStorage.setItem('lastValidTime', now);
        return true;
    }
    
    const timeDiff = now - storedTime;
    if (timeDiff < 0 || timeDiff > 30 * 60 * 1000) { // 允许30分钟内偏差
        return false;
    }
    
    localStorage.setItem('lastValidTime', now);
    return true;
}

// 计算离线经验
function getMiningDiminishingExpGemMultiplier(count) {
    const n = Math.max(0, Math.floor(Number(count) || 0));
    if (n <= 100) return 1 + n * 0.01; // 前100个：每个+1%
    return 1 + 100 * 0.01 + (n - 100) * 0.0001; // 之后衰减：每个+0.01%
}

// 新增：计算离线奥秘经验
function calculateOfflineMysteryExp() {
    if (!player.mystery || !player.mystery.lastUpdateTime) return;
    
    const now = Date.now();
    const timeDiff = now - player.mystery.lastUpdateTime;
   // 时间回退检测
    if (timeDiff < 0) {
        console.warn("检测到时间回退，重置奥秘经验");
        player.mystery.exp = 0;
        player.mystery.lastUpdateTime = now;
        return;
    }
    const minutesPassed = Math.floor(timeDiff / (1000 * 60));
    
    if (minutesPassed > 0) {
        const towerFloor = player.tower.currentFloor || 0;
        const vipLevel = player.vip.level || 1;
        const expGained = minutesPassed * towerFloor * vipLevel;
        
        if (expGained > 0) {
            const classBonuses = calculateClassBonuses();
            const mysteryExpMultiplier = classBonuses.mysteryExpMultiplier || 1;
            const lawMysteryMul = 1 + (((typeof getLawPowerBonuses === 'function' ? getLawPowerBonuses().mysteryExp : 0) || 0));
            const miningMysteryCount = Number(player.mining && player.mining.gems ? player.mining.gems.mysteryGem : 0) || 0;
            const miningMysteryMul = getMiningDiminishingExpGemMultiplier(miningMysteryCount);
            player.mystery.exp += expGained * mysteryExpMultiplier * lawMysteryMul * miningMysteryMul;
            logAction(`离线获得 ${expGained} 奥秘经验`, 'success');
        }
    }
    
    // 更新最后更新时间
    player.mystery.lastUpdateTime = now;
}
// 定时增加经验
registerInterval(() => {
    if (player.mystery) {
        const towerFloor = parseInt(document.getElementById('towerFloor').textContent) || 0;
        const vipLevel = parseInt(document.getElementById('vipLevel').textContent) || 1;
        let expPerMinute = towerFloor * vipLevel;
        
        if (expPerMinute > 0) {
            // 获取探险家职业的奥秘经验加成
            const classBonuses = calculateClassBonuses();
            const mysteryExpMultiplier = classBonuses.mysteryExpMultiplier || 1;
            
            // 应用加成
            const lawMysteryMul = 1 + (((typeof getLawPowerBonuses === 'function' ? getLawPowerBonuses().mysteryExp : 0) || 0));
            const miningMysteryCount = Number(player.mining && player.mining.gems ? player.mining.gems.mysteryGem : 0) || 0;
            const miningMysteryMul = getMiningDiminishingExpGemMultiplier(miningMysteryCount);
            expPerMinute = expPerMinute * mysteryExpMultiplier * lawMysteryMul * miningMysteryMul;
            
            // 奥秘每分钟增加一次，这里按秒计算
            player.mystery.exp += expPerMinute / 60;
            player.mystery.lastUpdateTime = new Date().getTime();
            var mysteryUi = document.getElementById('mysterySystemUI');
            if (mysteryUi && mysteryUi.style.display === 'block') updateMysterySystemDisplay();
        }
    }
}, 1000);

// 切换奥秘系统界面
function toggleMysterySystem() {
   if (player.reincarnationCount < 100) {
        alert("需要达到100转才能开启奥秘系统！");
        return;
    }
  calculateOfflineMysteryExp();
    const ui = document.getElementById('mysterySystemUI');
    const overlay = document.getElementById('mysterySystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateMysterySystemDisplay();
    }
}

// 更新奥秘系统显示
function updateMysterySystemDisplay() {
    const currentStage = player.mystery.stage;
    const currentLevel = player.mystery.level;
    const currentConfig = mysteryConfig.find(c => c.stage === currentStage) || mysteryConfig[0];
    if (!currentConfig) return;
    const nextLevel = currentLevel < 10 ? currentLevel + 1 : 1;
    const nextStage = currentLevel < 10 ? currentStage : currentStage + 1;
    const nextConfig = mysteryConfig.find(c => c.stage === nextStage);
    
    // 更新当前奥秘信息
    const title = `${currentConfig.name} ${currentStage}阶${currentLevel}级`;
    document.getElementById('mysteryTitleDisplay').textContent = title;
    document.getElementById('currentMysteryTitle').textContent = title;
    
    // 更新加成显示
    const maxStageReached = Math.min(currentStage, mysteryConfig.length);
    const maxConfig = mysteryConfig.find(c => c.stage === maxStageReached);
    document.getElementById('mysteryBonusDisplay').textContent = maxConfig ? maxConfig.totalBonus : 1;
    
    // 更新经验显示
    document.getElementById('currentMysteryExp').textContent = Math.floor(player.mystery.exp);
    document.getElementById('nextMysteryExp').textContent = currentConfig.levelCost;
     const classBonuses = calculateClassBonuses();
     const mysteryExpMultiplier = classBonuses.mysteryExpMultiplier || 1;
    // 更新每分钟经验
    const towerFloor = parseInt(document.getElementById('towerFloor').textContent) || 0;
    const vipLevel = parseInt(document.getElementById('vipLevel').textContent) || 1;
    const miningMysteryCountDisplay = Number(player.mining && player.mining.gems ? player.mining.gems.mysteryGem : 0) || 0;
    const miningMysteryMulDisplay = getMiningDiminishingExpGemMultiplier(miningMysteryCountDisplay);
    document.getElementById('expPerMinute').textContent = (towerFloor * vipLevel * mysteryExpMultiplier * miningMysteryMulDisplay).toFixed(0) ;
    


    // 更新下一等级信息
    const nextMysteryInfo = document.getElementById('nextMysteryInfo');
    if (nextConfig && currentStage < mysteryConfig.length) {
        nextMysteryInfo.innerHTML = `${nextConfig.name} ${nextStage}阶${nextLevel}级 - 消耗: ${nextConfig.levelCost}经验`;
    } else {
        nextMysteryInfo.textContent = '已达到最高奥秘等级';
        const topCfg = mysteryConfig[mysteryConfig.length - 1];
        document.getElementById('mysteryBonusDisplay').textContent = topCfg ? topCfg.totalBonus : (player.mystery.bonus || 1);
    }
}

// 升级一次奥秘
function upgradeMystery() {
    const currentStage = player.mystery.stage;
    const currentLevel = player.mystery.level;
    const currentConfig = mysteryConfig.find(c => c.stage === currentStage);
    if (!currentConfig) {
        logAction("奥秘数据异常，请重开游戏或反馈存档", "error");
        return false;
    }
    
    // 检查是否已达最高等级
    if (currentStage >= mysteryConfig.length && currentLevel >= 10) {
        logAction("已达到最高奥秘等级！", "error");
        return false;
    }
    
    // 检查经验是否足够
    if (player.mystery.exp < currentConfig.levelCost) {
        logAction("奥秘经验不足，无法升级！", "error");
        return false;
    }
    
    // 消耗经验
    player.mystery.exp -= currentConfig.levelCost;
    
    // 升级处理
    if (currentLevel < 10) {
        player.mystery.level += 1;
    } else {
        player.mystery.level = 1;
        player.mystery.stage += 1;
    }
    const bonusCfg = mysteryConfig.find(c => c.stage === player.mystery.stage);
    if (bonusCfg) player.mystery.bonus = bonusCfg.totalBonus;
    updateDisplay();
    return true;
}

// 按指定次数升级奥秘
function upgradeMysteryByAmount() {
    calculateOfflineMysteryExp();
    const amount = parseInt(document.getElementById('mysteryUpgradeAmount').value) || 1;
    let upgraded = 0;
    
    for (let i = 0; i < amount; i++) {
        if (!upgradeMystery()) {
            break;
        }
        upgraded++;
    }
    
    if (upgraded > 0) {
        logAction(`成功升级${upgraded}级奥秘！`, 'success');
        updateMysterySystemDisplay();
        updateDisplay();
    }
}

// 一键升级奥秘到最大可能
function upgradeMysteryMaxPossible() {
    calculateOfflineMysteryExp();
    let upgraded = 0;
    
    while (upgradeMystery()) {
        upgraded++;
    }
    
    if (upgraded > 0) {
        logAction(`成功升级${upgraded}级奥秘！`, 'success');
        updateMysterySystemDisplay();
        updateDisplay();
    }
}
function resetFundData() {
    showCustomConfirm('确定要重置所有基金数据吗？这将清空所有投资和收益！', (confirmed) => {
        if (confirmed) {
            player.fundData = {
                funds: [
                    { name: "稳健型基金", netValue: 1.00, maxInvestment: 100000, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 },
                    { name: "平衡型基金", netValue: 1.00, maxInvestment: 1000000, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 },
                    { name: "成长型基金", netValue: 1.00, maxInvestment: 100000000, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 },
                    { name: "进取型基金", netValue: 1.00, maxInvestment: 1e15, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 },
                    { name: "激进型基金", netValue: 1.00, maxInvestment: 1e30, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 },
                    { name: "风险型基金", netValue: 1.00, maxInvestment: 1e50, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 }
                ],
                lastFundUpdate: Date.now()
            };
            
            logAction("基金数据已重置到初始状态", "success");
            updateFundDisplay();
        }
    });
}
// 切换基金系统显示状态
function toggleFundSystem() {
    const fundSystem = document.getElementById('fundSystem');
    const overlay = document.getElementById('fundOverlay');
    const isVisible = fundSystem.style.display !== 'none';
    
    fundSystem.style.display = isVisible ? 'none' : 'block';
    overlay.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        updateFundDisplay();
    }
}

function normalizeFundState() {
    if (!player) return;
    if (!player.fundData || typeof player.fundData !== 'object') {
        player.fundData = { funds: [], lastFundUpdate: Date.now() };
    }
    if (!Array.isArray(player.fundData.funds)) player.fundData.funds = [];
    player.fundData.funds.forEach((fund) => {
        fund.investment = bigSciToStorageValue(fund.investment || 0);
        fund.maxInvestment = bigSciToStorageValue(fund.maxInvestment || 0);
        fund.netValue = Math.max(0.0001, Number(fund.netValue) || 1);
        fund.returnRate = Number(fund.returnRate) || 0;
        fund.redemptionTime = Number(fund.redemptionTime) || 0;
    });
    if (!player.fundData.lastFundUpdate) player.fundData.lastFundUpdate = Date.now();
}

// 更新基金显示
function updateFundDisplay() {
    normalizeFundState();
    const container = document.getElementById('fundsContainer');
    container.innerHTML = player.fundData.funds.map((fund, index) => {
        const currentValue = mulBigSci(fund.investment, fund.netValue);
        const changeRate = ((fund.netValue - 1) * 100).toFixed(2);
        const isPositive = changeRate >= 0;
        const canRedeem = Date.now() >= fund.redemptionTime;
        const redemptionLeft = canRedeem ? 0 : Math.ceil((fund.redemptionTime - Date.now()) / 1000);
        const returnClass = fund.returnRate >= 0 ? 'positive' : 'negative';
        const changeClass = isPositive ? 'positive' : 'negative';
        const timerHtml = !canRedeem ? `<div class="fund-card-timer">赎回倒计时: ${Math.floor(redemptionLeft / 60)}分${redemptionLeft % 60}秒</div>` : '';
        return `
            <div class="fund-card">
                <h3 class="fund-card-title">${fund.name}</h3>
                <div class="fund-card-stats">
                    <div class="fund-card-stat"><span class="fund-card-stat-l">当前净值</span><span class="fund-card-stat-r">${fund.netValue.toFixed(4)}</span></div>
                    <div class="fund-card-stat"><span class="fund-card-stat-l">收益率</span><span class="fund-card-stat-r ${returnClass}">${fund.returnRate >= 0 ? '+' : ''}${fund.returnRate}%</span></div>
                    <div class="fund-card-stat"><span class="fund-card-stat-l">最大投资</span><span class="fund-card-stat-r">${formatSci(fund.maxInvestment)}</span></div>
                    <div class="fund-card-stat"><span class="fund-card-stat-l">你的投资</span><span class="fund-card-stat-r">${formatSci(fund.investment)}</span></div>
                    <div class="fund-card-stat"><span class="fund-card-stat-l">当前价值</span><span class="fund-card-stat-r">${formatSci(currentValue)}</span></div>
                    <div class="fund-card-stat"><span class="fund-card-stat-l">涨跌幅</span><span class="fund-card-stat-r ${changeClass}">${isPositive ? '+' : ''}${changeRate}%</span></div>
                </div>
                ${timerHtml}
                <div class="fund-card-actions">
                    <input type="text" id="fundAmount${index}" class="fund-card-input" placeholder="金额(支持1e22)" min="1">
                    <button type="button" class="fund-card-btn fund-card-btn-invest" onclick="investFund(${index})" ${cmpBigSci(fund.investment, fund.maxInvestment) >= 0 ? 'disabled' : ''}>投资</button>
                    <button type="button" class="fund-card-btn fund-card-btn-all" onclick="investAllFund(${index})" ${cmpBigSci(fund.investment, fund.maxInvestment) >= 0 ? 'disabled' : ''}>一键投资</button>
                    <button type="button" class="fund-card-btn fund-card-btn-redeem" onclick="redeemAllFund(${index})" ${cmpBigSci(fund.investment, 0) <= 0 || !canRedeem ? 'disabled' : ''}>一键赎回</button>
                </div>
            </div>
        `;
    }).join('');
}
// 投资基金
function investFund(index) {
   normalizeFundState();
   const fund = player.fundData.funds[index];
// 检查是否在赎回前5分钟内
    const now = Date.now();
    const redemptionTime = fund.redemptionTime;
    if (redemptionTime && now > redemptionTime - 5 * 60 * 1000 && now < redemptionTime) {
        logAction("赎回前最后5分钟内禁止投资！", "error");
        return;
    }
    
    const amount = bigSciToStorageValue(parseFloat(document.getElementById(`fundAmount${index}`).value) || 0);
    
    if (cmpBigSci(amount, 0) <= 0) {
        logAction("请输入有效的投资金额", "error");
        return;
    }
    
    if (cmpBigSci(addBigSci(fund.investment, amount), fund.maxInvestment) > 0) {
        logAction(`投资金额超过基金上限${formatNumber(fund.maxInvestment)}`, "error");
        return;
    }
    
    if (cmpBigSci(player.reincarnationCoin, amount) < 0) {
        logAction("转生币不足！", "error");
        return;
    }
    // 检查赎回倒计时状态
    if (fund.redemptionTime <= 0) {
        // 如果没有赎回倒计时，重置净值为1
        fund.netValue = 1.00;
        logAction(`重置基金净值至1.00`, "info");
    }
    player.reincarnationCoin = bigSciToStorageValue(subBigSci(player.reincarnationCoin, amount));
    fund.investment = bigSciToStorageValue(addBigSci(fund.investment, amount));
    
    // 设置赎回时间为10分钟后
    if (fund.redemptionTime < Date.now()) {
        fund.redemptionTime = Date.now() + 10 * 60 * 1000;
    }
    
    logAction(`成功投资${fund.name} ${formatSci(amount)}转生币`, "success");
    updateFundDisplay();
}

// 赎回基金
function redeemFund(index) {
    normalizeFundState();
    const fund = player.fundData.funds[index];
    const amount = bigSciToStorageValue(parseFloat(document.getElementById(`fundAmount${index}`).value) || 0);
    
    if (cmpBigSci(amount, 0) <= 0) {
        logAction("请输入有效的赎回金额", "error");
        return;
    }
    
    if (cmpBigSci(fund.investment, amount) < 0) {
        logAction("投资金额不足！", "error");
        return;
    }
    
    const redeemValue = mulBigSci(amount, fund.netValue);
    player.reincarnationCoin = bigSciToStorageValue(addBigSci(player.reincarnationCoin, redeemValue));
    fund.investment = bigSciToStorageValue(subBigSci(fund.investment, amount));
    
    logAction(`成功赎回${fund.name} ${formatSci(amount)}转生币，获得${formatSci(redeemValue)}转生币`, "success");
    
    if (cmpBigSci(fund.investment, 0) === 0) {
        fund.redemptionTime = 0;
    }
    
    updateFundDisplay();
}

// 一键投资
function investAllFund(index) {
    normalizeFundState();
    const fund = player.fundData.funds[index];
// 检查是否在赎回前5分钟内
    const now = Date.now();
    const redemptionTime = fund.redemptionTime;
    if (redemptionTime && now > redemptionTime - 5 * 60 * 1000 && now < redemptionTime) {
        logAction("赎回前最后5分钟内禁止投资！", "error");
        return;
    }
    const maxCanInvest = bigSciToStorageValue(subBigSci(fund.maxInvestment, fund.investment));
    const amount = cmpBigSci(player.reincarnationCoin, maxCanInvest) < 0 ? player.reincarnationCoin : maxCanInvest;
    
    if (cmpBigSci(amount, 0) <= 0) {
        logAction("没有可投资的转生币或已达投资上限", "error");
        return;
    }
    // 检查赎回倒计时状态
    if (fund.redemptionTime <= 0) {
        // 如果没有赎回倒计时，重置净值为1
        fund.netValue = 1.00;
        logAction(`重置基金净值至1.00`, "info");
    }
    player.reincarnationCoin = bigSciToStorageValue(subBigSci(player.reincarnationCoin, amount));
    fund.investment = bigSciToStorageValue(addBigSci(fund.investment, amount));
    
    // 设置赎回时间为10分钟后
    if (fund.redemptionTime < Date.now()) {
        fund.redemptionTime = Date.now() + 10 * 60 * 1000;
    }
    
    logAction(`成功全额投资${fund.name} ${formatSci(amount)}转生币`, "success");
    updateFundDisplay();
}

// 一键赎回
function redeemAllFund(index) {
    normalizeFundState();
    const fund = player.fundData.funds[index];
    
    if (cmpBigSci(fund.investment, 0) <= 0) {
        logAction("没有可赎回的投资", "error");
        return;
    }
    
    if (Date.now() < fund.redemptionTime) {
        logAction("未到赎回时间", "error");
        return;
    }
    
    const redeemValue = mulBigSci(fund.investment, fund.netValue);
    player.reincarnationCoin = bigSciToStorageValue(addBigSci(player.reincarnationCoin, redeemValue));
    
    logAction(`成功全额赎回${fund.name}，获得${formatSci(redeemValue)}转生币`, "success");
    
    fund.investment = 0;
    fund.redemptionTime = 0;
    
    updateFundDisplay();
}

// 更新基金净值
function updateFundValues() {
    normalizeFundState();
    const now = Date.now();
    const elapsed = now - player.fundData.lastFundUpdate;
    const intervals = Math.floor(elapsed / (60 * 1000)); // 每分钟更新一次
    
    if (intervals > 0) {
        player.fundData.funds.forEach(fund => {
           
            let riseProbability;
            if (fund.netValue < 1.0) {
                riseProbability = 0.45; 
            } else if (fund.netValue < 1.5) {
                riseProbability = 0.40; 
            } else if (fund.netValue < 2.0) {
                riseProbability = 0.35; 
            } else if (fund.netValue < 2.5) {
                riseProbability = 0.25; 
            } else {
                riseProbability = 0.10; 
            }

            // 计算投资比例（0-1）
            const maxInvNum = Number(fund.maxInvestment);
            const invNum = Number(fund.investment);
            let investmentRatio = 0;
            if (Number.isFinite(maxInvNum) && maxInvNum > 0 && Number.isFinite(invNum)) {
                investmentRatio = Math.min(invNum / maxInvNum, 1);
            } else {
                const logMax = getBigLog10(fund.maxInvestment);
                const logInv = getBigLog10(fund.investment);
                if (Number.isFinite(logMax) && Number.isFinite(logInv)) {
                    investmentRatio = Math.min(Math.max(Math.pow(10, logInv - logMax), 0), 1);
                }
            }
            
            // 根据投资比例计算波动幅度（10%-50%）
            const baseVolatility = 0.10 + (0.4 * investmentRatio);
            
           
            
            let newNetValue = fund.netValue;
            for (let i = 0; i < intervals; i++) {
                const willRise = Math.random() < riseProbability;
                const volatility = willRise ? 
                    Math.random() * baseVolatility : 
                    -Math.random() * baseVolatility;
                
                newNetValue *= (1 + volatility);
                
                // 检查是否跌到20%以下，若是则清零
                if (newNetValue <= 0.2) {
                    logAction(`${fund.name}已退市，投资已清零`, "error");
                    fund.investment = 0;
                    newNetValue = 1.00;
                    fund.redemptionTime = 0;
                    break;
                }
            }
            
            // 计算收益率（新增）
            const returnRate = ((newNetValue / fund.netValue - 1) * 100).toFixed(2);
            fund.returnRate = parseFloat(returnRate);
            
            // 更新净值
            fund.netValue = newNetValue;
        });
        
        player.fundData.lastFundUpdate = now - (elapsed % (60 * 1000));
        
        // 如果基金面板打开则更新显示
        if (document.getElementById('fundSystem').style.display !== 'none') {
            updateFundDisplay();
        }
    }
}


// 添加格式化大数字的辅助函数
function formatNumber(num) {
    return formatSci(num);
}

// 钓鱼系统配置
const fishQualities = [
    { name: "普通", color: "#000", exp: 1, rarity: 80 },
    { name: "稀有", color: "#008000", exp: 2, rarity: 12 },
    { name: "珍贵", color: "#0000CD", exp: 5, rarity: 5 },
    { name: "传说", color: "#8B4513", exp: 10, rarity: 2 },
    { name: "神话", color: "#FFD700", exp: 20, rarity: 1 }
];

const junkItems = [
    "破旧的鞋子", "生锈的铁片", "塑料瓶", "烂木头", "破布", "闫闫的黑丝", "比基尼", "杜蕾斯",
    "空罐头", "旧轮胎", "玻璃瓶", "渔网碎片", "朽木"
];

const fishNames = [
    "鲫鱼", "鲤鱼", "草鱼", "闫闫鱼", "黑鱼",
    "鲶鱼", "鳊鱼", "鳙鱼", "鲢鱼", "青鱼",
    "黄鱼", "鳕鳕鱼", "金枪鱼", "三文鱼", "鲨鱼",
    "鳗鱼", "带鱼", "比目鱼", "鲳鱼", "鲈鱼",
    "虹鳟鱼", "罗非鱼", "鲷鱼", "鲅鱼", "鲮鱼", "巨龙", "龙王", "金龙鱼",
    "泥鳅", "黄鳝", "河虾", "对虾", "龙虾", "鳄鱼", "石斑鱼", "秋刀鱼", "河豚",
    "螃蟹", "扇贝", "牡蛎", "蛤蜊", "叶鱼", "墨鱼", "黄花鱼", "中华鲟", "马口鱼",
    "章鱼", "墨鱼", "虾蛄", "海马", "海龙", "美人鱼",
    "河豚", "石斑鱼", "金鱼", "锦鲤", "斗鱼",
    "龙鱼", "天使鱼", "孔雀鱼", "罗汉鱼", "鹦鹉鱼"
];

const decompositionRewards = [
    "vip能力值", "洗髓丹", "洗练石", "玫瑰花"
];
const levelConfig = [
    { level: 1, requiredExp: 0, bonus: 1 },
    { level: 2, requiredExp: 100, bonus: 1 },
    { level: 3, requiredExp: 500, bonus: 1 },
    { level: 4, requiredExp: 1000, bonus: 1 },
    { level: 5, requiredExp: 2500, bonus: 1 },
    { level: 6, requiredExp: 5000, bonus: 1 },
    { level: 7, requiredExp: 10000, bonus: 1 },
    { level: 8, requiredExp: 25000, bonus: 1 },
    { level: 9, requiredExp: 50000, bonus: 1 },
    { level: 10, requiredExp: 100000, bonus: 1 },
    { level: 11, requiredExp: 500000, bonus: 1 },
    { level: 12, requiredExp: 1000000, bonus: 1 },
    { level: 13, requiredExp: 5000000, bonus: 1 },
    { level: 14, requiredExp: 10000000, bonus: 1 },
    { level: 15, requiredExp: 50000000, bonus: 1 }
];

// 钓鱼系统函数
function toggleFishingSystem() {
 if (player.reincarnationCount < 20) {
        alert("需要达到20转才能开启钓鱼系统！");
        return;
    }
    const ui = document.getElementById('fishingSystemUI');
    const overlay = document.getElementById('fishingSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateFishingUI();
    }
}
// 切换自动钓鱼状态
function toggleAutoFishing() {
    player.fishing.autoFishingEnabled = !player.fishing.autoFishingEnabled;
    const btn = document.getElementById('autoFishingBtn');
    btn.textContent = `自动钓鱼: ${player.fishing.autoFishingEnabled ? '开启' : '关闭'}`;
    btn.style.background = player.fishing.autoFishingEnabled ? '#4CAF50' : '#f44336';
    
    logAction(`自动钓鱼${player.fishing.autoFishingEnabled ? '开启' : '关闭'}`, 'info');
    
    // 如果开启自动钓鱼且当前没有在钓鱼，则开始钓鱼
    if (player.fishing.autoFishingEnabled && !player.fishing.isFishing) {
        startFishing();
    }
}

// 切换自动分解状态
function toggleAutoDecomposeFish() {
    player.fishing.autoDecomposeFishEnabled = !player.fishing.autoDecomposeFishEnabled;
    const btn = document.getElementById('autoDecomposeFishBtn');
    btn.textContent = `自动分解: ${player.fishing.autoDecomposeFishEnabled ? '开启' : '关闭'}`;
    btn.style.background = player.fishing.autoDecomposeFishEnabled ? '#2196F3' : '#f44336';
    
    logAction(`自动分解${player.fishing.autoDecomposeFishEnabled ? '开启' : '关闭'}`, 'info');
}

function updateFishingUI() {
    if (!player.fishing) return;
    
   document.getElementById('fishingLevel').textContent = player.fishing.level;
    document.getElementById('currentFishingExp').textContent = player.fishing.currentExp;
    
    // 使用玩家道具中的鱼饵数量
    document.getElementById('baitCount').textContent = player.items.baitCount || 0;
    
    document.getElementById('cageCount').textContent = player.fishing.fishCage.length;
    
    // 计算下一级所需经验
    const nextLevel = Math.min(player.fishing.level, levelConfig.length - 1);
     document.getElementById('nextFishingExp').textContent = levelConfig[player.fishing.level].requiredExp;
    
    document.getElementById('fishingBonus').textContent = player.fishing.bonus.toFixed(2) + '倍';
    
    // 同步自动钓鱼/自动分解按钮与存档一致，重新进游戏后显示正确
    var autoFishBtn = document.getElementById('autoFishingBtn');
    if (autoFishBtn) {
        autoFishBtn.textContent = '自动钓鱼: ' + (player.fishing.autoFishingEnabled ? '开启' : '关闭');
        autoFishBtn.style.background = player.fishing.autoFishingEnabled ? '#4CAF50' : '#f44336';
    }
    var autoDecomposeBtn = document.getElementById('autoDecomposeFishBtn');
    if (autoDecomposeBtn) {
        autoDecomposeBtn.textContent = '自动分解: ' + (player.fishing.autoDecomposeFishEnabled ? '开启' : '关闭');
        autoDecomposeBtn.style.background = player.fishing.autoDecomposeFishEnabled ? '#2196F3' : '#f44336';
    }
    
    updateFishCageDisplay();
}

function startFishing() {
    if (!player.fishing) return;
    try {
    // 检查是否有鱼饵（使用玩家道具中的鱼饵）
    if (!player.items.baitCount || player.items.baitCount <= 0) {
        var st = document.getElementById('fishingStatus'); if (st) st.textContent = "没有鱼饵了，无法钓鱼！";
        if (player.fishing.autoFishingEnabled) {
            player.fishing.autoFishingEnabled = false;
            var btn = document.getElementById('autoFishingBtn'); if (btn) { btn.textContent = "自动钓鱼: 关闭"; btn.style.background = '#f44336'; }
        }
        return;
    }
    
    // 检查鱼笼是否已满
    if (player.fishing.fishCage.length >= 20) {
        var st2 = document.getElementById('fishingStatus'); if (st2) st2.textContent = "鱼笼已满，请先分解一些鱼获！";
        return;
    }
    } catch (e) { console.warn('startFishing check', e); return; }
    
    try {
    // 消耗一个鱼饵（从玩家道具中扣除）
    player.items.baitCount--;
    updateFishingUI();
    
    // 更新状态（记录开始时间，供卡住检测用）
    player.fishing.isFishing = true;
    player.fishing.fishingStartTime = Date.now();
    var startBtn = document.getElementById('startFishingBtn'); if (startBtn) startBtn.style.display = 'none';
    var statusEl = document.getElementById('fishingStatus'); if (statusEl) statusEl.textContent = "正在下竿...等待鱼上钩...";
    var rod = document.getElementById('fishingRod'); if (rod) rod.style.display = 'block';
    var bob = document.getElementById('fishingBobber'); if (bob) bob.style.display = 'block';
    
    var biteDelay = 3000 + Math.random() * 7000; // 3-10秒
    player.fishing.biteTime = Date.now() + biteDelay;
    
    player.fishing.biteTimer = setTimeout(function() {
        try { fishBite(); } catch (e) { console.warn('fishBite', e); try { resetFishing(); } catch (e2) {} if (player.fishing && player.fishing.autoFishingEnabled) setTimeout(function() { startFishing(); }, 500); }
    }, biteDelay);
    } catch (e) {
        console.warn('startFishing', e);
        try { resetFishing(); } catch (e2) {}
        if (player.fishing && player.fishing.autoFishingEnabled) setTimeout(function() { startFishing(); }, 500);
    }
}

function fishBite() {
    if (!player.fishing) return;
    player.fishing.isBiting = true;
    try {
        var st = document.getElementById('fishingStatus'); if (st) st.textContent = "注意！有鱼对鱼饵感兴趣...";
        var bob = document.getElementById('fishingBobber'); if (bob) bob.style.animation = 'bobberMove 0.5s infinite alternate';
        var ind = document.getElementById('biteIndicator'); if (ind) ind.style.display = 'block';
        var reelBtn = document.getElementById('reelInBtn'); if (reelBtn) reelBtn.style.display = 'block';
    } catch (e) { console.warn('fishBite DOM', e); }
    
    // 如果开启了自动钓鱼，自动拉钩
    if (player.fishing.autoFishingEnabled) {
        var reelDelay = 500 + Math.random() * 1000;
        setTimeout(function() {
            try { reelInFish(); } catch (e) { console.warn('reelInFish auto', e); try { resetFishing(); } catch (e2) {} if (player.fishing.autoFishingEnabled) setTimeout(function() { startFishing(); }, 500); }
        }, reelDelay);
    }
    
    // 咬钩窗口期为2秒
    if (player.fishing.biteWindowTimer) {
        clearTimeout(player.fishing.biteWindowTimer);
    }
    
    player.fishing.biteWindowTimer = setTimeout(function() {
        try {
            if (player.fishing.isBiting) {
                var el = document.getElementById('fishingStatus');
                if (el) el.textContent = "鱼跑掉了！";
                resetFishing();
                if (player.fishing.autoFishingEnabled) setTimeout(function() { startFishing(); }, 300);
            }
        } catch (e) {
            console.warn('biteWindowTimer', e);
            try { resetFishing(); } catch (e2) {}
            if (player.fishing.autoFishingEnabled) setTimeout(function() { startFishing(); }, 500);
        }
    }, 2000);
}

function reelInFish() {
    // 若已不在咬钩状态（如窗口期已过或被其他逻辑清掉），仍要重置并续钓，避免自动钓鱼卡死
    if (!player.fishing.isBiting) {
        try { resetFishing(); } catch (e) { console.warn('resetFishing in reelInFish', e); }
        if (player.fishing.autoFishingEnabled) setTimeout(function() { startFishing(); }, 300);
        return;
    }
    
    // 清除定时器
    clearTimeout(player.fishing.biteWindowTimer);
    
    // 计算是否成功钓到鱼（基于时机）
    const currentTime = Date.now();
    const timeSinceBite = currentTime - player.fishing.biteTime;
    let success = timeSinceBite >= 0 && timeSinceBite <= 2000;
    
    if (success) {
        // 70%概率钓到鱼，30%概率钓到破烂
        if (Math.random() < 0.7) {
            catchFish();
        } else {
            catchJunk();
        }
    } else {
        document.getElementById('fishingStatus').textContent = "时机不对，鱼跑掉了！";
    }
    
    try { resetFishing(); } catch (e) { console.warn('resetFishing after reel', e); }
    if (player.fishing.autoFishingEnabled) setTimeout(function() { startFishing(); }, 300);
}

function catchFish() {
    // 随机选择鱼的品质
    let quality = determineQuality();
    
    // 随机选择鱼的名称
    let name = fishNames[Math.floor(Math.random() * fishNames.length)];
    
    // 随机长度和重量
    let length = (2 + Math.random() * 98).toFixed(1); // 2-100厘米
    let weight = (0.1 + Math.random() * 9.9).toFixed(1); // 0.1-10公斤
    
    // 创建鱼对象
    let fish = {
        type: 'fish',
        name: name,
        quality: quality,
        length: length,
        weight: weight,
        selected: false
    };
    // 如果开启了自动分解，立即分解这条鱼
    if (player.fishing.autoDecomposeFishEnabled) {
        decomposeSingleFish(fish);
        document.getElementById('fishingStatus').textContent = `钓到${fish.quality.name}的${fish.name}并自动分解！`;
    } else {
        // 否则放入鱼笼
        player.fishing.fishCage.push(fish);
        document.getElementById('fishingStatus').textContent = `成功钓到${fish.quality.name}的${fish.name}！`;
    }
    
  // 添加经验
    addExperience(quality.exp);
    
}

function catchJunk() {
    // 随机选择破烂
    let junkName = junkItems[Math.floor(Math.random() * junkItems.length)];
    
    // 创建破烂对象
    let junk = {
        type: 'junk',
        name: junkName,
        selected: false
    };
    
   // 如果开启了自动分解，立即分解这个破烂
    if (player.fishing.autoDecomposeFishEnabled) {
        decomposeSingleJunk(junk);
        document.getElementById('fishingStatus').textContent = `钓到${junk.name}并自动分解！`;
    } else {
        // 否则放入鱼笼
        player.fishing.fishCage.push(junk);
        document.getElementById('fishingStatus').textContent = `钓到了${junk.name}！`;
    }
}

function resetFishing() {
    if (!player.fishing) return;
    player.fishing.isFishing = false;
    player.fishing.isBiting = false;
    if (player.fishing.biteTimer != null) { clearTimeout(player.fishing.biteTimer); player.fishing.biteTimer = null; }
    if (player.fishing.biteWindowTimer != null) { clearTimeout(player.fishing.biteWindowTimer); player.fishing.biteWindowTimer = null; }
    try {
        var rod = document.getElementById('fishingRod');
        if (rod) rod.style.display = 'none';
        var bobber = document.getElementById('fishingBobber');
        if (bobber) { bobber.style.display = 'none'; bobber.style.animation = ''; }
        var ind = document.getElementById('biteIndicator');
        if (ind) ind.style.display = 'none';
        var reelBtn = document.getElementById('reelInBtn');
        if (reelBtn) reelBtn.style.display = 'none';
        var startBtn = document.getElementById('startFishingBtn');
        if (startBtn) startBtn.style.display = 'block';
        updateFishingUI();
    } catch (e) { console.warn('resetFishing DOM', e); }
}
function decomposeSingleFish(fish) {
    const qualityFactor = fishQualities.findIndex(q => q.name === fish.quality.name) + 2;
    const lengthFactor = parseFloat(fish.length) / 100;
    const weightFactor = parseFloat(fish.weight) / 10;
    
    // 计算基础数量
    let baseQuantity = Math.floor(1 + qualityFactor * (lengthFactor + weightFactor));
    // 应用收益加成
    baseQuantity = Math.floor(baseQuantity * getCurrentBonus());
    
    // 随机选择一种奖励
    const rewardType = decompositionRewards[Math.floor(Math.random() * decompositionRewards.length)];
    
    // 添加到玩家物品
    switch(rewardType) {
        case 'vip能力值':
            player.items.vipPower = (player.items.vipPower || 0) + baseQuantity;
            break;
        case '洗髓丹':
            player.items.rebornDan = (player.items.rebornDan || 0) + baseQuantity;
            break;
        case '洗练石':
            player.items.refineStone = (player.items.refineStone || 0) + baseQuantity;
            break;
        case '玫瑰花':
            player.items.rose = (player.items.rose || 0) + baseQuantity;
            break;
    }
    
    // 添加种子掉落
    if (Math.random() < 0.15) { // 15%概率获得种子
        dropSeedAfterDecompose();
    }
    
    // 更新显示
    updateFishingUI();
    updateItemDisplay();
   checkTitleUnlocks();
}

// 新增：分解单个破烂
function decomposeSingleJunk(junk) {
    // 破烂分解固定获得1朵玫瑰花
    player.items.rose = (player.items.rose || 0) + 1;
    
    // 更新显示
    updateFishingUI();
    updateItemDisplay();
  checkTitleUnlocks();
}
function addExperience(amount) {
    // 应用收益加成
    const bonus = getCurrentBonus();
    const actualAmount = amount * bonus;
    
    player.fishing.currentExp += actualAmount;
    checkLevelUp();
}

function checkLevelUp() {
    // 从当前等级开始检查是否可以升级
    let currentLevelIndex = levelConfig.findIndex(conf => conf.level === player.fishing.level);
    
    // 检查是否可以升级到下一级
    while (currentLevelIndex + 1 < levelConfig.length && 
           player.fishing.currentExp >= levelConfig[currentLevelIndex + 1].requiredExp) {
        player.fishing.level++;
        currentLevelIndex++;
        document.getElementById('fishingStatus').textContent += `恭喜！钓鱼等级提升到${player.fishing.level}级！`;
    }
    const fishingBonuses = [1, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000];
     player.fishing.bonus = fishingBonuses[player.fishing.level - 1] || 50000000;   // 每级增加50倍（10%）
    updateFishingUI();
}

function updateFishCageDisplay() {
    const cageContainer = document.getElementById('fishCage');
    cageContainer.innerHTML = '';
    
    if (!player.fishing.fishCage || player.fishing.fishCage.length === 0) {
        cageContainer.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #666;">鱼笼是空的，快去钓鱼吧！</div>';
        return;
    }
    
    player.fishing.fishCage.forEach((item, index) => {
        let itemElement = document.createElement('div');
        itemElement.style.padding = '5px';
        itemElement.style.borderRadius = '4px';
        itemElement.style.cursor = 'pointer';
        itemElement.style.transition = 'all 0.2s';
        
        // 设置选中状态样式
        if (item.selected) {
            itemElement.style.backgroundColor = '#e6f7ff';
            itemElement.style.border = '1px solid #91d5ff';
        } else {
            itemElement.style.backgroundColor = '#f9f9f9';
            itemElement.style.border = '1px solid transparent';
        }
        
        // 设置内容
        if (item.type === 'fish') {
            itemElement.innerHTML = `
                <span style="color: ${item.quality.color}; font-weight: bold;">${item.quality.name}</span>
                ${item.name} (${item.length}cm, ${item.weight}kg)
            `;
        } else {
            itemElement.textContent = item.name;
        }
        
        // 添加点击选中事件
        itemElement.addEventListener('click', () => {
            item.selected = !item.selected;
            updateFishCageDisplay();
        });
        
        cageContainer.appendChild(itemElement);
    });
}

function decomposeSelectedFish() {
    if (!player.fishing.fishCage || player.fishing.fishCage.length === 0) {
        alert('鱼笼是空的！');
        return;
    }
    
    const selectedItems = player.fishing.fishCage.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
        alert('请先选择要分解的鱼获！');
        return;
    }
    
    let rewards = [];
    
    // 处理每种选中的物品
    selectedItems.forEach(item => {
        // 添加种子掉落
    if (Math.random() < 0.15) { // 15%概率获得种子
        dropSeedAfterDecompose();
    }
       
        if (item.type === 'junk') {
            // 破烂分解固定获得1朵玫瑰花
            player.items.rose = (player.items.rose || 0) + 1; // 添加到玩家物品
            rewards.push({type: '玫瑰花', quantity: 1});
        } else if (item.type === 'fish') {
            // 鱼分解根据品质、长度和重量获得奖励
            const qualityFactor = fishQualities.findIndex(q => q.name === item.quality.name) + 2;
            const lengthFactor = parseFloat(item.length) / 100;
            const weightFactor = parseFloat(item.weight) / 10;
            
            // 计算基础数量
            let baseQuantity = Math.floor(1 + qualityFactor * (lengthFactor + weightFactor));
            // 应用收益加成
            baseQuantity = Math.floor(baseQuantity * getCurrentBonus());
            
            // 随机选择一种奖励
            const rewardType = decompositionRewards[Math.floor(Math.random() * decompositionRewards.length)];
            
            // 添加到玩家物品
            switch(rewardType) {
                case 'vip能力值':
                    player.items.vipPower = (player.items.vipPower || 0) + baseQuantity;
                    break;
                case '洗髓丹':
                    player.items.rebornDan = (player.items.rebornDan || 0) + baseQuantity;
                    break;
                case '洗练石':
                    player.items.refineStone = (player.items.refineStone || 0) + baseQuantity;
                    break;
                case '玫瑰花':
                    player.items.rose = (player.items.rose || 0) + baseQuantity;
                    break;
            }
            
            rewards.push({type: rewardType, quantity: baseQuantity});
        }
        
        // 从鱼笼中移除
        const index = player.fishing.fishCage.indexOf(item);
        if (index > -1) {
            player.fishing.fishCage.splice(index, 1);
        }
    });
    
    // 显示奖励
    let rewardMessage = '分解获得：\n';
    rewards.forEach(reward => {
        rewardMessage += `- ${reward.type} x ${reward.quantity}\n`;
    });
    alert(rewardMessage);
    
    // 更新显示
    updateFishingUI();
    updateItemDisplay(); // 更新物品显示
}

function determineQuality() {
    let rand = Math.random() * 100;
    let cumulative = 0;


    for (let quality of fishQualities) {
        cumulative += quality.rarity;

        if (rand <= cumulative) {
            return quality;
        }
    }
    
    return fishQualities[0]; // 默认普通品质
}

function getCurrentBonus() {
    if (!player.fishing.level) return 1;
    const currentLevelConfig = levelConfig.find(conf => conf.level === player.fishing.level);
    return currentLevelConfig ? currentLevelConfig.bonus : 1;
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes bobberMove {
        from { transform: translateY(0); }
        to { transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// 种子配置
const seedConfig = [
    { id: "seed1", name: "小麦种子", growthTime: 300, exp: 3, value: 2, rarity: 30 },
    { id: "seed2", name: "水稻种子", growthTime: 600, exp: 5, value: 4, rarity: 25 },
    { id: "seed3", name: "玉米种子", growthTime: 900, exp: 10, value: 10, rarity: 20 },
    { id: "seed4", name: "土豆种子", growthTime: 1200, exp: 15, value: 15, rarity: 18 },
    { id: "seed5", name: "胡萝卜种子", growthTime: 1500, exp: 20, value: 20, rarity: 15 },
    { id: "seed6", name: "番茄种子", growthTime: 1800, exp: 30, value: 25, rarity: 12 },
    { id: "seed7", name: "草莓种子", growthTime: 2100, exp: 40, value: 35, rarity: 10 },
    { id: "seed8", name: "蓝莓种子", growthTime: 2400, exp: 50, value: 40, rarity: 8 },
    { id: "seed9", name: "葡萄种子", growthTime: 2700, exp: 60, value: 50, rarity: 6 },
    { id: "seed10", name: "西瓜种子", growthTime: 3000, exp: 70, value: 60, rarity: 5 },
    { id: "seed11", name: "南瓜种子", growthTime: 3300, exp: 80, value: 70, rarity: 4 },
    { id: "seed12", name: "向日葵种子", growthTime: 3600, exp: 100, value: 80, rarity: 3 },
    { id: "seed13", name: "咖啡豆种子", growthTime: 7200, exp: 200, value: 160, rarity: 2 },
    { id: "seed14", name: "茶树种子", growthTime: 10800, exp: 500, value: 250, rarity: 1 },
    { id: "seed15", name: "金苹果种子", growthTime: 21600, exp: 1200, value: 500, rarity: 0.5 }
];

// 切换农场系统界面
function toggleFarmSystem() {
    if (player.reincarnationCount < 50) {
        alert("需要达到50转才能开启农场系统！");
        return;
    }
    const ui = document.getElementById('farmSystemUI');
    const overlay = document.getElementById('farmSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
        
        // 关闭界面时清除自动化检查
        if (window.farmAutoCheckInterval) {
            clearInterval(window.farmAutoCheckInterval);
            window.farmAutoCheckInterval = null;
        }
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateFarmDisplay();
        
        // 开启界面时启动自动化检查
        if (!window.farmAutoCheckInterval) {
            window.farmAutoCheckInterval = registerInterval(() => {
                if (player.farm.autoHarvest) autoHarvest();
                if (player.farm.autoPlant) autoPlant();
            }, 1000);
        }
    }
}

function closeFarmSystem() {
    document.getElementById('farmSystemUI').style.display = 'none';
    document.getElementById('farmSystemOverlay').style.display = 'none';
}

// 更新农场显示
function updateFarmDisplay() {
    // 更新基本信息
    document.getElementById('farmLevel').textContent = player.farm.level;
    document.getElementById('farmExp').textContent = player.farm.exp;
    document.getElementById('farmExpNext').textContent = player.farm.expToNextLevel;
    document.getElementById('farmFieldCount').textContent = player.farm.fields.filter(f => f.planted).length;
    document.getElementById('farmMaxFields').textContent = player.farm.maxFields;
    document.getElementById('waterCount').textContent = player.items.vipPower;
    const autoPlantBtn = document.getElementById('autoPlantBtn');
    const autoHarvestBtn = document.getElementById('autoHarvestBtn');
    autoPlantBtn.textContent = `自动种植: ${player.farm.autoPlant ? '开启' : '关闭'}`;
    autoPlantBtn.classList.toggle('on', player.farm.autoPlant);
    autoHarvestBtn.textContent = `自动收获: ${player.farm.autoHarvest ? '开启' : '关闭'}`;
    autoHarvestBtn.classList.toggle('on', player.farm.autoHarvest);
    // 更新农田显示
    const fieldsContainer = document.getElementById('farmFields');
    fieldsContainer.innerHTML = '';
    
    for (let i = 0; i < player.farm.maxFields; i++) {
        const field = player.farm.fields[i] || { planted: false };
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'farm-field';
        
        if (i >= player.farm.maxFields) {
            fieldDiv.classList.add('farm-field-locked');
            fieldDiv.innerHTML = '<div>未解锁</div>';
            fieldsContainer.appendChild(fieldDiv);
            continue;
        }
        
        if (!field.planted) {
            fieldDiv.classList.add('farm-field-empty');
            fieldDiv.innerHTML = `
                <div class="farm-field-name">空闲农田</div>
                <button type="button" class="farm-field-btn farm-field-btn-plant" onclick="openSeedSelection(${i})">种植</button>
            `;
        } else {
            const seed = seedConfig.find(s => s.id === field.seedId);
            const now = Date.now();
            const elapsed = now - field.plantTime;
            const progress = Math.min(100, (elapsed / (seed.growthTime * 1000)) * 100);
            const needWater = field.wateredAt && (now - field.wateredAt) > 1800000000;
            const isReady = progress >= 100;
            if (isReady) fieldDiv.classList.add('farm-field-ready'); else fieldDiv.classList.add('farm-field-growing');
            let statusHtml = '';
            if (isReady) {
                statusHtml = '<span class="farm-field-status ready">可收获!</span>';
            } else {
                statusHtml = needWater
                    ? '<span class="farm-field-status need-water">需要浇水!</span>'
                    : '<span class="farm-field-status">生长中: ' + Math.floor(progress) + '%</span>';
            }
            fieldDiv.innerHTML = `
                <div class="farm-field-name">${seed.name}</div>
                <div>${statusHtml}</div>
                <div class="farm-field-progress"><div class="farm-field-progress-fill" style="width:${progress}%"></div></div>
                <div class="farm-field-actions"></div>
            `;
            const actions = fieldDiv.querySelector('.farm-field-actions');
            if (progress < 100) {
                const waterBtn = document.createElement('button');
                waterBtn.type = 'button';
                waterBtn.className = 'farm-field-btn farm-field-btn-water';
                waterBtn.textContent = '浇水';
                waterBtn.onclick = () => waterCrop(i);
                actions.appendChild(waterBtn);
            } else {
                const harvestBtn = document.createElement('button');
                harvestBtn.type = 'button';
                harvestBtn.className = 'farm-field-btn farm-field-btn-harvest';
                harvestBtn.textContent = '收获';
                harvestBtn.onclick = () => harvestCrop(i);
                actions.appendChild(harvestBtn);
            }
        }
        fieldsContainer.appendChild(fieldDiv);
    }
    
    // 更新种子仓库
    const seedContainer = document.getElementById('seedInventory');
    seedContainer.innerHTML = '';
    
    seedConfig.forEach(seed => {
        const count = player.farm.seeds[seed.id] || 0;
        if (count > 0) {
            const seedDiv = document.createElement('div');
            seedDiv.className = 'farm-seed-item';
            seedDiv.innerHTML = `
                <div class="farm-seed-name">${seed.name}</div>
                <div class="farm-seed-meta">数量: ${count} · ${formatTimeq(seed.growthTime)}</div>
            `;
            seedContainer.appendChild(seedDiv);
        }
    });
}

// 打开种子选择界面
function openSeedSelection(fieldIndex) {
    const seedContainer = document.getElementById('seedInventory');
    seedContainer.innerHTML = '';
    
    seedConfig.forEach(seed => {
        const count = player.farm.seeds[seed.id] || 0;
        if (count > 0) {
            const seedDiv = document.createElement('div');
            seedDiv.className = 'farm-seed-item';
            seedDiv.innerHTML = `
                <div class="farm-seed-name">${seed.name}</div>
                <div class="farm-seed-meta">数量: ${count} · ${formatTimeq(seed.growthTime)}</div>
            `;
            seedDiv.onclick = () => plantSeed(fieldIndex, seed.id);
            seedContainer.appendChild(seedDiv);
        }
    });
    
    const cancelDiv = document.createElement('div');
    cancelDiv.className = 'farm-seed-item cancel';
    cancelDiv.innerHTML = '<div class="farm-seed-name">取消</div>';
    cancelDiv.onclick = updateFarmDisplay;
    seedContainer.appendChild(cancelDiv);
}

// 种植种子
function plantSeed(fieldIndex, seedId) {
    if (player.farm.seeds[seedId] <= 0) return;
    
    // 初始化农田数组
    while (player.farm.fields.length <= fieldIndex) {
        player.farm.fields.push({ planted: false });
    }
    
    player.farm.fields[fieldIndex] = {
        planted: true,
        seedId: seedId,
        plantTime: Date.now(),
        wateredAt: Date.now()
    };
    
    player.farm.seeds[seedId]--;
    
    updateFarmDisplay();
    logAction(`在农田${fieldIndex + 1}种植了种子`, 'success');
}

// 浇水
function waterCrop(fieldIndex) {
    if (player.items.vipPower <= 30) {
        logAction("水滴不足！", "error");
        return;
    }
    
    const field = player.farm.fields[fieldIndex];
    if (!field || !field.planted) return;
    
    // 减少3分钟成熟时间（180000毫秒）
    field.plantTime -= 180000;
    
    field.wateredAt = Date.now();
    player.items.vipPower-=30;
    
    updateFarmDisplay();
    logAction(`为农田${fieldIndex + 1}浇水，成熟时间减少3分钟`, 'info');
}

// 收获作物
function harvestCrop(fieldIndex) {
    const field = player.farm.fields[fieldIndex];
    if (!field || !field.planted) return;
    
    const seed = seedConfig.find(s => s.id === field.seedId);
    const now = Date.now();
    const elapsed = now - field.plantTime;
    
    if (elapsed < seed.growthTime * 1000) {
        logAction("作物还未成熟！", "error");
        return;
    }
    
    // 获得经验和转生币
    player.farm.exp += seed.exp;
    player.items.vipPower += seed.value;
    
    // 检查升级
    checkFarmLevelUp();
    
    // 重置农田
    player.farm.fields[fieldIndex] = { planted: false };
    onFarmHarvest();
    updateFarmDisplay();
    updateDisplay(); // 更新主界面显示
   checkTitleUnlocks();
    logAction(`收获${seed.name}，获得${seed.exp}农场经验和${seed.value}VIP能力值`, 'success');
}

// 一键浇水
function waterAllCrops() {
    if (player.items.vipPower <= 0) {
        logAction("水滴不足！", "error");
        return;
    }
    
    let watered = 0;
    player.farm.fields.forEach((field, index) => {
        if (field.planted) {
            const now = Date.now();
            if (field.wateredAt && (now - field.wateredAt) > 1800000) {
                if (player.items.vipPower > 0) {
                    field.wateredAt = now;
                    playe.items.vipPower--;
                    watered++;
                }
            }
        }
    });
    
    if (watered > 0) {
        updateFarmDisplay();
        logAction(`一键浇水完成，浇灌了${watered}块农田`, 'success');
    } else {
        logAction("没有需要浇水的农田", "info");
    }
}

// 一键收获
function harvestAllCrops() {
    let harvested = 0;
    let totalExp = 0;
    let totalCoins = 0;
    
    player.farm.fields.forEach((field, index) => {
        if (field.planted) {
            const seed = seedConfig.find(s => s.id === field.seedId);
            const now = Date.now();
            const elapsed = now - field.plantTime;
            
            if (elapsed >= seed.growthTime * 1000) {
                // 收获作物
                player.farm.exp += seed.exp;
                player.items.vipPower += seed.value;
                totalExp += seed.exp;
                totalCoins += seed.value;
                
                // 重置农田
                player.farm.fields[index] = { planted: false };
               onFarmHarvest();
                harvested++;
            }
        }
    });
    
    if (harvested > 0) {
        // 检查升级
        checkFarmLevelUp();
        updateFarmDisplay();
        updateDisplay(); // 更新主界面显示
        logAction(`一键收获完成，收获${harvested}块农田，获得${totalExp}农场经验和${totalCoins}VIP能力值`, 'success');
    } else {
        logAction("没有可收获的农田", "info");
    }
}

// 检查农场升级
function checkFarmLevelUp() {
    while (player.farm.exp >= player.farm.expToNextLevel) {
        player.farm.exp -= player.farm.expToNextLevel;
        player.farm.level++;
        
        // 每级增加最大农田数量
        if (player.farm.level % 3 === 0) {
            player.farm.maxFields++;
        }
        
        // 更新下一级所需经验
        player.farm.expToNextLevel = Math.floor(player.farm.expToNextLevel * 1.5);
        
        logAction(`农场升级到${player.farm.level}级！解锁新农田`, 'success');
    }
}
function dropSeedAfterDecompose() {
    const totalRarity = seedConfig.reduce((sum, seed) => sum + seed.rarity, 0);
    const rand = Math.random() * totalRarity;
    
    let cumulative = 0;
    for (const seed of seedConfig) {
        cumulative += seed.rarity;
        if (rand <= cumulative) {
            // 添加种子到仓库
            player.farm.seeds[seed.id] = (player.farm.seeds[seed.id] || 0) + 1;
            logAction(`分解获得${seed.name}`, 'success');
            break;
        }
    }
}
// 时间格式化辅助函数
function formatTimeq(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? hours + '小时' : ''}${minutes > 0 ? minutes + '分' : ''}${secs}秒`;
}
// 离线时更新农场
function updateFarmOffline() {
    const now = Date.now();
    const elapsed = (now - player.farm.lastUpdate) / 1000; // 转换为秒
    
    player.farm.fields.forEach(field => {
        if (field.planted) {
            const seed = seedConfig.find(s => s.id === field.seedId);
            // 更新生长进度（但不自动收获）
            // 实际收获需要玩家手动操作
        }
    });
    
    player.farm.lastUpdate = now;
}
function initFarmData() {
    if (!player.farm) {
        player.farm = {
            level: 1,
            exp: 0,
            expToNextLevel: 150,
            fields: Array(2).fill().map(() => ({ planted: false })),
            maxFields: 2,
            seeds: {},
            water: 10,
            lastUpdate: Date.now(),
          autoPlant: false,    // 新增自动种植设置
            autoHarvest: false 
        };
    }
    
    // 确保农田数组大小正确
    while (player.farm.fields.length < player.farm.maxFields) {
        player.farm.fields.push({ planted: false });
    }
}
// 切换自动种植功能
function toggleAutoPlant() {
    player.farm.autoPlant = !player.farm.autoPlant;
    const btn = document.getElementById('autoPlantBtn');
    btn.textContent = `自动种植: ${player.farm.autoPlant ? '开启' : '关闭'}`;
    btn.style.background = player.farm.autoPlant ? '#4CAF50' : '#FF9800';
    
    logAction(`自动种植${player.farm.autoPlant ? '开启' : '关闭'}`, 'info');
    
    // 如果开启自动种植，立即执行一次
    if (player.farm.autoPlant) {
        autoPlant();
    }
}

// 切换自动收获功能
function toggleAutoHarvest() {
    player.farm.autoHarvest = !player.farm.autoHarvest;
    const btn = document.getElementById('autoHarvestBtn');
    btn.textContent = `自动收获: ${player.farm.autoHarvest ? '开启' : '关闭'}`;
    btn.style.background = player.farm.autoHarvest ? '#4CAF50' : '#9C27B0';
    
    logAction(`自动收获${player.farm.autoHarvest ? '开启' : '关闭'}`, 'info');
    
    // 如果开启自动收获，立即执行一次
    if (player.farm.autoHarvest) {
        autoHarvest();
    }
}

// 自动种植逻辑
function autoPlant() {
    if (!player.farm.autoPlant) return;
    
    let planted = false;
    
    // 检查是否有空闲农田
    for (let i = 0; i < player.farm.fields.length; i++) {
        const field = player.farm.fields[i];
        
        // 如果农田空闲且有种子可用
        if (!field.planted && Object.keys(player.farm.seeds).length > 0) {
            // 选择第一个有库存的种子
            for (const seedId in player.farm.seeds) {
                if (player.farm.seeds[seedId] > 0) {
                    plantSeed(i, seedId);
                    planted = true;
                    break;
                }
            }
        }
    }
    
    if (planted) {
        logAction("自动种植执行完成", 'success');
    }
}

// 自动收获逻辑
function autoHarvest() {
    if (!player.farm.autoHarvest) return;
    
    let harvested = false;
    
    // 检查所有农田
    for (let i = 0; i < player.farm.fields.length; i++) {
        const field = player.farm.fields[i];
        
        if (field.planted) {
            const seed = seedConfig.find(s => s.id === field.seedId);
            const now = Date.now();
            const elapsed = now - field.plantTime;
            
            // 如果作物已成熟
            if (elapsed >= seed.growthTime * 1000) {
                harvestCrop(i);
                harvested = true;
            }
        }
    }
    
    if (harvested) {
        logAction("自动收获执行完成", 'success');
    }
}

const liveStreamSystem = {
    level: 1,
    exp: 0,
    expToNextLevel: [1000, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 3600000, 3700000, 4000000, 4500000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000, 9000000, 9500000, 10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000, 10000000000],
    isLive: false,
    viewers: [],
    viewerCount: 0,
    maxViewers: 10,
    totalEarnings: 1000,
    expMultiplier: 1,
    lastUpdate: Date.now(),
   danmakuGeneratorActive: false,
    aiMessages: [
        "主播今天玩什么？", "加油！支持主播！", "这个游戏看起来好有趣", "刚刚的打斗太精彩了！", "主播技术真好", "求教学怎么快速转生",
        "关注了，下次还来", "礼物已送上，继续加油", "今天运气不错啊", "这个装备怎么获得的？", "6666666", "我喜欢你主播",
        "太强了", "主播嫁给我", "哈哈哈，这个操作笑死我了", "主播多大了？", "什么时候下次直播？", "求背景音乐名字", "画质好清晰啊",
        "卡了吗？怎么不动了", "第一次来看，感觉不错！", "求问主播用的什么鼠标？", "支持支持！打赏走一波", "这个角色怎么加点？",
        "新来的，关注了", "背景音乐好好听！", "刚刚那下没看清，能回放吗？", "主播吃饭了吗", "这游戏需要氪金吗？", "太厉害了吧，学到了",
        "卡了卡了，主播那边还好吗？", "下次能玩无限升级吗？", "礼物收到了吗？主播", "666，必须录屏了", "今天直播到几点呀？",
        "新手能玩这个游戏吗？", "主播加油，别慌！", "求组队一起玩！", "这个地图怎么解锁？", "哈哈哈，主播被坑了", "关注了，主播多更新",
        "主播今天状态不错啊", "网络有点卡，刷新试试", "这个技能怎么放的？", "刚刚那波失误有点可惜", "求主播带飞！", "这个游戏什么时候上线的？",
        "主播累不累？歇会儿吧", "新来的，求问这是什么游戏？", "太精彩了，全程没快进", "主播用的什么显卡？画质这么好", "下次直播能提前说一声吗？",
        "刚刚那下反应好快！", "卡退了，重新进来了", "求问这个游戏怎么下载？", "主播技术比我朋友好多了", "哈哈哈，主播的表情太逗了",
        "这个游戏有手游吗？", "主播快回复一下我的问题呀", "网络怎么回事，老是卡顿", "主播明天几点直播？", "求教学怎么躲这个技能",
        "这个游戏画质真不错", "支持主播，会一直关注", "主播用的什么耳机？", "这个角色哪个职业最强？", "新来的，求主播带一下",
        "这个游戏需要什么配置？", "背景音乐是什么歌？好熟悉", "卡了，主播能等一下吗？", "主播今天直播内容好丰富", "求问怎么快速升级？",
        "礼物已刷，主播看得到吗？", "主播技术真的没话说，太强了", "新来的，觉得主播很有趣", "主播什么时候换游戏玩？", "关注了，下次开播提醒我",
        "支持主播，打赏不能少", "网络恢复了吗？刚才好卡", "求问这个游戏有攻略吗？", "这个游戏多人玩吗？", "关注了，主播要常开播哦",
        "主播今天心情不错呀", "新来的，求问主播常玩什么游戏？", "主播技术比我想象中好太多", "礼物送上，祝主播越来越好", "卡了卡了，大家都卡吗？",
        "主播明天还播这个游戏吗？", "支持主播，会推荐朋友来看", "关注了，主播多玩点新游戏", "主播今天直播时长多久呀？", "礼物已送，主播辛苦了",
        "主播什么时候开粉丝群？", "求问怎么获得金币快？", "支持主播，每天都来看", "关注了，主播记得回关哦", "网络终于不卡了",
        "主播技术真的很专业", "这个游戏有等级上限吗？", "支持主播，打赏走起", "新来的，觉得直播很精彩", "背景音乐是谁唱的",
        "关注了，主播多搞点福利活动", "主播今天吃的什么呀？", "新来的，关注了不后悔", "主播技术越来越好的", "美女", "支持主播，永远是粉丝",
        "这个游戏怎么创建角色？", "这个游戏有公会系统吗？", "关注了，下次开播不见不散", "求教学怎么放风筝", "老公吃饭了吗", "老婆吃饭了吗",
        "牛逼", "好厉害", "CPDD", "主播我喜欢你！", "你好菜啊", "网络又卡了，服了", "支持主播，会一直陪伴", "这个游戏画面风格我喜欢",
        "这个游戏怎么举报外挂？", "主播下次能早点直播吗？", "这个游戏有师徒系统吗？", "主播有女朋友吗？", "礼物送上，主播越来越火",
        "这个装备怎么镶嵌宝石？", "新来的，关注了，主播多播哦", "晚安，先睡了", "明天还直播吗？",
        "刚进来，有人吗", "主播声音好好听", "这波操作学到了", "手速可以啊", "主播是哪里人", "今天人好多", "前排占座",
        "主播别慌慢慢来", "这游戏叫什么名字", "有群吗拉我", "录屏了录屏了", "笑死我了", "主播单身吗", "关注不迷路",
        "今天播到几点", "主播用的什么键盘", "画质可以调吗", "刚才那段没看到", "重播一下呗", "主播多大了", "学生党路过",
        "上班摸鱼看直播", "午休时间刷到了", "晚上好呀", "早上好主播", "周末快乐", "今天星期几", "主播吃饭了没",
        "外卖到了先去拿", "主播别下播啊", "再播一会呗", "今天状态拉满", "昨天那场我看了", "明天还来", "已关注已三连",
        "新人求眼熟", "老粉了", "从第一期追到现在", "主播记得我不", "上次说的攻略呢", "催更催更", "更新了吗",
        "等了好久了", "终于开播了", "差点错过", "刚好赶上", "来晚了来晚了", "弹幕护体", "前方高能",
        "名场面", "经典回顾", "梦开始的地方", "爷青回", "有内味了", "yyds", "绝绝子",
        "破防了", "蚌埠住了", "笑不活了", "离谱", "就离谱", "离大谱", "麻了",
        "这谁顶得住", "顶不住顶不住", "绷不住了", "好家伙", "直呼好家伙", "针不戳", "针不辍",
        "可以可以", "行行行", "彳亍", "中", "妥了", "稳", "稳了",
        "问题不大", "小意思", "洒洒水", "基操勿六", "基操", "坐下坐下", "常规操作",
        "有手就行", "我上我也行", "我上我不行", "手残党哭了", "脑子会了手不会", "眼睛学会了",
        "主播带带我", "求带飞", "躺好了", "抱大腿", "大腿缺挂件吗", "求组队", "一起玩啊",
        "加个好友呗", "ID多少", "区服哪个", "同区吗", "不同区可惜了", "跨区能一起吗",
        "这装备哪出的", "爆率怎么样", "非酋路过", "欧皇本皇", "吸欧气", "沾沾喜气",
        "沾霉气了我", "又非了", "保底人", "保底了保底了", "下次一定出", "玄学一波",
        "主播信玄学吗", "玄不改非", "氪不改命", "零氪玩家", "微氪", "重氪大佬",
        "肝帝", "秃头警告", "养生玩家", "咸鱼玩家", "佛系", "随缘",
        "这游戏肝吗", "氪吗", "适合休闲吗", "有自动吗", "能挂机吗", "离线有收益吗",
        "新手友好吗", "老玩家回归", "弃坑一年了", "回坑了", "版本更新了吗", "新版本有啥",
        "新活动出了吗", "活动肝不肝", "限时吗", "错过就没了", "还有机会吗",
        "主播讲细一点", "没听懂", "能再讲一遍吗", "笔记记好了", "收藏了", "回头慢慢看",
        "有回放吗", "有录播吗", "剪辑版有吗", "精彩集锦呢", "投稿了吗",
        "三连了", "硬币给了", "收藏了", "分享给朋友了", "安利成功", "朋友也来看了",
        "直播间氛围好", "弹幕有意思", "大家都很友好", "没有喷子好评", "和谐和谐",
        "主播脾气真好", "心态可以", "被坑了也不骂", "素质主播", "爱了爱了",
        "今天礼物刷爆", "榜一大哥来了", "土豪来了", "感谢老板", "老板大气",
        "主播念我ID了", "被翻牌了", "开心", "圆满了", "今天没白来",
        "主播注意休息", "别太拼", "身体重要", "熬夜伤身", "早点下播吧",
        "明天见", "下次见", "拜拜", "撤了撤了", "溜了溜了", "先下了",
        "手机没电了", "流量没了", "WiFi断了", "要开会了", "要上课了", "要干活了",
        "摸鱼结束", "老板来了", "家长来了", "先匿了", "暗中观察",
        "刚才卡了", "黑屏了一下", "有声音没画面", "有画面没声音", "双声道吗",
        "主播能听到吗", "麦没问题", "音质可以", "有杂音", "电流声",
        "画质糊了", "码率够吗", "清晰度可以", "4K吗", "高画质爱了",
        "主播玩得开心", "开心就好", "娱乐为主", "别上头", "心态心态",
        "这局能赢", "稳赢", "翻盘翻盘", "让一追二", "逆风局", "顺风别浪",
        "别送", "别浪", "别上头", "冷静", "稳住", "我们能赢",
        "对面不行", "碾压", "虐泉了", "投降吧", "投了投了", "下一把",
        "再来一局", "继续继续", "不打了", "今天先到这", "明天再战",
        "主播今天话好多", "今天话好少", "是不是累了", "兴奋剂打多了", "喝红牛了吧",
        "主播今天穿啥", "背景换了", "装修了", "新皮肤", "新装扮",
        "今天什么主题", "有活动吗", "有福利吗", "抽奖吗", "弹幕抽奖吗",
        "参与一下", "万一中了呢", "分母来了", "分子在此", "中奖绝缘体",
        "感谢主播", "感谢陪伴", "辛苦了", "今天也很快乐", "明天继续",
        "主播加油", "永远支持", "会一直看的", "不离不弃", "铁粉",
        "新粉报道", "路人转粉", "黑转粉", "路转粉", "真香",
        "打脸了", "真香警告", "当初说不看现在", "真香虽迟但到",
        "主播别理节奏", "带节奏的来了", "别管喷子", "房管干活", "封了封了",
        "和谐发言", "文明观播", "理性讨论", "别吵别吵", "和气生财",
        "主播解释一下", "求科普", "啥意思", "没看懂", "求弹幕科普",
        "弹幕大神多", "卧虎藏龙", "评论区见", "弹幕见", "私信了",
        "主播回关吗", "互粉吗", "求互关", "已回关", "关注列表见",
        "今天人气可以", "人越来越多了", "破万了", "十万了", "百万主播",
        "小主播不容易", "慢慢来", "会火的", "迟早的事", "未来可期",
        "主播坚持住", "别放弃", "我们都在", "陪你成长", "一起加油",
        "感动了", "泪目", "破防了", "绷不住了", "主播太好了",
        "正能量", "三观正", "爱了", "值得关注", "推荐推荐",
        "路人路过", "随便看看", "被推荐来的", "首页来的", "搜索来的",
        "朋友推荐的", "看到广告来的", "偶然刷到", "缘分啊", "有缘再见",
        "今天先这样", "撤了", "溜了", "下次一定", "下次一定来",
        "说到做到", "明天准时", "不见不散", "约好了", "一言为定",
        "主播记得我", "老观众了", "从零开始看的", "一路见证", "老粉泪目",
        "新观众不懂就问", "萌新提问", "大佬轻喷", "求轻虐", "温柔点",
        "暴躁老哥", "淡定淡定", "别激动", "冷静分析", "理性分析",
        "感性发言", "情绪上来了", "代入感强", "沉浸了", "入戏了",
        "节目效果", "效果拉满", "整活", "会整", "活整挺好",
        "笑死", "笑yue了", "笑不活了", "笑裂了", "笑傻了",
        "心疼主播", "主播太难了", "不容易", "心酸", "抱抱",
        "加油鸭", "冲鸭", "奥利给", "干就完了", "莽就完事了",
        "怂一点", "别莽", "稳一点", "苟住", "猥琐发育",
        "别送别送", "别冲动", "等机会", "找节奏", "等一波",
        "可以打了", "开团开团", "跟上跟上", "撤撤撤", "卖卖卖",
        "保主播", "保C位", "保输出", "别死", "活下来",
        "赢了赢了", "nice", "漂亮", "完美", "精彩",
        "可惜了", "差一点", "失误了", "下次注意", "问题不大",
        "复盘一下", "哪里出了问题", "改进空间", "还能更好", "继续努力",
        "主播声音好听", "开摄像头吗", "露脸吗", "声音爱了", "声控福利",
        "今天标题啥意思", "标题党", "被标题骗进来的", "标题成功", "点进来不亏",
        "主播会唱歌吗", "来首歌", "点歌", "BGM好听", "歌单交出来",
        "主播有对象吗", "单身狗羡慕", "情侣档?", "一个人玩吗", "队友呢",
        "延迟高吗", "多少ping", "网络稳定吗", "掉线了?", "重连了",
        "主播方言哪的", "口音可爱", "普通话标准", "听懂了", "没听懂但好笑",
        "今天穿的好看", "背景换了", "设备升级了", "麦克风不错", "摄像头清晰",
        "主播多大年纪", "看着年轻", "声音年轻", "老玩家了", "玩多久了",
        "全职主播吗", "兼职播吗", "播多久了", "坚持不易", "respect",
        "今天为啥晚播", "迟到了迟到了", "终于来了", "等了好久", "以为不播了",
        "提前下播?", "再播一会", "别走", "再一局", "最后一局",
        "今天状态不好?", "累了就休息", "别硬撑", "明天再战", "身体要紧",
        "今天超常发挥", "打鸡血了", "状态拉满", "今天不一样", "手感来了",
        "玄学时间", "玄学一波", "毒奶了", "别毒奶", "反向毒奶",
        "这波在大气层", "千层饼", "预判了预判", "心理博弈", "智商碾压",
        "节目效果拉满", "整活成功", "会整", "效果有了", "笑果满分",
        "冷场了", "尴尬", "救场", "弹幕救一下", "气氛组呢",
        "主播别念弹幕了", "专心打", "打完再念", "弹幕太多念不过来", "选择性失明",
        "房管在吗", "封一下", "带节奏的来了", "黑子来了", "别理",
        "今天有抽奖吗", "弹幕抽奖", "参与一下", "分母+1", "万一呢",
        "主播玩过某某游戏吗", "双修玩家", "多修", "啥都玩", "全能",
        "今天失误有点多", "状态不好", "没睡醒", "手冷", "下次注意",
        "今天发挥稳定", "稳如老狗", "一如既往", "靠谱", "放心",
        "新版本适应了吗", "版本答案", "跟版本", "逆版本而行", "头铁",
        "主播主玩什么", "绝活哥", "绝活", "本命英雄", "绝活英雄",
        "今天练英雄?", "练英雄可以", "娱乐局", "随便玩", "开心就好",
        "高端局", "低端局", "炸鱼", "鱼塘", "质量局",
        "队友靠谱吗", "路人局", "组排吗", "单排", "双排",
        "今天赢了几把", "胜率可以", "连胜了", "连败了", "止败",
        "主播心态好", "不喷人", "素质高", "学习", "榜样",
        "今天有嘉宾吗", "连麦吗", "双人播?", "一个人也挺好", "安静",
        "主播喝水", "歇会", "喘口气", "别噎着", "慢慢来",
        "今天弹幕多", "人气可以", "破纪录", "新高", "继续涨",
        "老观众了", "从零开始", "一路看过来的", "见证成长", "泪目",
        "新来的不懂", "求科普", "弹幕科普", "评论区见", "看简介",
        "主播说的对", "学到了", "受教了", "记下了", "有用",
        "主播说的不对", " respectfully", "理性讨论", "各有各的理解", "求同存异",
        "别吵了", "和气", "理性", "好好看直播", "弹幕和谐",
        "主播加油啊", "别放弃", "我们都在", "陪你", "支持",
        "今天先到这", "撤了", "下次见", "拜拜", "晚安",
        "明天同一时间", "不见不散", "约好了", "准时到", "蹲",
        "主播记得我不", "眼熟我", "老粉", "常来的", "天天在",
        "主播回复我一下", "翻牌", "求翻牌", "被翻牌了", "开心",
        "主播念我ID", "念到了", "圆满了", "今天没白来", "值了",
        "弹幕太多看不见我的", "刷上去", "刷屏", "存在感", "眼熟",
        "主播下播干啥", "休息吗", "明天见", "早点睡", "晚安",
        "今天感谢大家", "感谢观看", "感谢礼物", "感谢陪伴", "谢谢大家",
        "主播辛苦了", "辛苦了", "早点休息", "明天继续", "加油",
        "刚点进来，这是播的啥", "主播声音好像我同学", "有一起看的吗", "弹幕走一波", "人气可以啊",
        "我卡了还是主播卡了", "刚才闪退了又进来了", "主播别慌慢慢打", "这波我上我也行（狗头）", "手残党表示学不会",
        "记笔记了记笔记了", "收藏了回头慢慢看", "主播讲得挺细的", "没听清能再说一遍吗", "懂了懂了",
        "今天怎么这么晚", "还以为今天不播了", "准时蹲到了", "刚下班赶上", "边吃边看美滋滋",
        "主播今天心情不错啊", "感觉今天状态拉满", "是不是喝了红牛", "今天话好多哈哈", "今天好安静啊",
        "有没有水友赛", "能上车吗", "带我一个呗", "我菜别嫌弃", "娱乐局可以",
        "这游戏肝不肝", "适合养老吗", "有自动战斗吗", "氪金严重吗", "零氪能玩吗",
        "主播主玩啥职业", "哪个职业强", "新手推荐啥", "有攻略链接吗", "wiki有吗",
        "刚才那波绝了", "名场面预定", "可以当集锦了", "主播剪一下呗", "投稿了吗",
        "又白给了", "血压上来了", "心态崩了", "冷静冷静", "下一把下一把",
        "主播别理节奏", "带节奏的省省吧", "房管呢", "封一下", "和谐观播",
        "今天有抽奖吗", "弹幕抽奖参与一下", "分母来了", "万一中了呢", "从来没中过",
        "主播哪里人", "听口音像南方的", "普通话挺标准", "方言挺有意思", "没听懂但挺好玩的",
        "主播多大", "看着好年轻", "玩这游戏多久了", "全职播吗", "兼职不容易",
        "今天为啥迟到了", "等了好久", "终于开了", "差点以为鸽了", "下次早点呗",
        "再播一会呗", "别下别下", "最后一局", "再一局就睡", "根本停不下来",
        "今天发挥可以", "稳如老狗", "一如既往", "今天失误有点多", "状态不好吧",
        "新版本玩明白了吗", "跟版本走", "逆版本头铁", "版本答案啥", "平衡性咋样",
        "主播有粉丝群吗", "群号多少", "能加吗", "群满了吗", "QQ还是微信",
        "刚才说的啥没听清", "麦有点小", "能大点声吗", "音质还行", "有回音吗",
        "画质可以", "码率够吗", "不卡", "我这边挺流畅", "啥设备播的",
        "主播露脸吗", "不露脸也行", "声音好听就够了", "声控满足了", "开摄像头了吗",
        "今天标题啥意思", "被标题骗进来的", "点进来不亏", "标题党实锤", "内容对得起标题",
        "主播会唱歌吗", "来首 BGM", "歌单交出来", "背景音乐啥歌", "好听",
        "主播有对象吗", "单身狗+1", "情侣档?", "一个人玩不无聊吗", "队友在线吗",
        "延迟多少", "ping 高吗", "掉线了?", "重连了", "网络稳吗",
        "主播今天穿啥", "背景换了?", "设备升级了?", "麦克风啥牌子", "摄像头清晰",
        "为啥晚播", "今天有事吗", "等得花都谢了", "来了就好", "下次提前说声",
        "提前下播?", "再播半小时呗", "舍不得关", "明天见", "晚安晚安",
        "今天超常发挥啊", "打鸡血了", "手感来了", "今天不一样", "玄学时间",
        "毒奶了毒奶了", "别毒奶", "反向毒奶", "这波在大气层", "预判了预判",
        "节目效果有了", "整活成功", "会整", "效果拉满", "笑果满分",
        "冷场了", "尴尬", "救场救场", "气氛组呢", "弹幕救一下",
        "主播专心打别念弹幕了", "打完再念", "弹幕太多", "选择性念", "翻我翻我",
        "今天人气可以", "人多了", "破纪录了吧", "继续涨", "小主播加油",
        "老粉了", "从零开始看的", "一路见证", "泪目", "不离不弃",
        "新来的", "求科普", "弹幕科普一下", "评论区见", "看简介",
        "主播说的对", "学到了", "受教", "记下了", "有用",
        "理性讨论", "各有各的理解", "求同存异", "别吵", "和气和气",
        "主播加油", "别放弃", "我们都在", "陪你", "支持你",
        "今天先到这", "撤了撤了", "下次见", "拜拜", "晚安好梦",
        "明天同一时间", "不见不散", "约好了", "准时蹲", "一定来",
        "主播眼熟我", "老粉了", "常来的", "天天在", "记得我不",
        "求翻牌", "翻我翻我", "被翻牌了", "开心", "圆满了",
        "弹幕太多看不见", "刷上去", "存在感", "眼熟眼熟", "念我ID",
        "主播下播干啥", "休息吗", "明天见", "早点睡", "晚安",
        "感谢大家", "感谢观看", "感谢礼物", "感谢陪伴", "谢谢"
    ],
    aiNames: [
        "闫闫", "花花", "茶茶", "鱼鱼", "通元","叶子", "沉鱼", "探探", "凡", "尝试", "胖大仙", "水芙蓉", "亲情相爱一家人", "伍思凯", "吖晴儿", 
        "苏菲", "王荣", "瑶瑶", "悸声", "反骨仔", "冰糖红茶", "蝴蝶效应,", "悦悦", "老倪", "慕白", "轩辕", "阿孝", "yuan", "王北的北,", "我已经在拉扯了", "林贝", "慕白", "阿迪", "微软是你", "王汝刚", "刘禹锡", "艾夫华", "渥太华", "阿杰", "阿道夫", "豆腐花茜茜", "阿法和阿伟","峰", "好人", "奥格威", "阿睿", "星嗄","阿华田", "子女不能", "开膛手杰华", "埃弗阿福", "黑丝姐姐", "黑菲","爱喝牛奶", "骚粉", "王如玉", "血红女爵", "水果",
        "萩", "我不高兴", "山麒麟", "管者", "阿斯巴甜","圣光", "征服他哥", "字画大师", "诗人睡睡", "孙国辉",
        "君子不气", "空白", "香香", "浪荡丶", "啦喇菈辣","十分", "神烦狗", "张枫五", "偶见", "孙国伟","时迁", "Plan B", "冥王", "阿顺帆",
        "Tung", "迷雾", "源", "泯潮猫", "寻良","冰箭", "赵哥", "张德荣", "三国英", "清茶", 
        "有意思", "非酋本酋", "肝双", "氪金佬", "舍尔", "赵哥帅", "张宝华", "祝福鱼", "珍贵仁",
         "Cardiac", "战无极", "凹凸曼", "白饭鱼", "独钓寒江雪",
        "锅巴", "花海", "怀安", "金刚骷髅娃", "锦瑟笙箫落",
        "旧", "举着戒指对你笑i", "磊哥", "凛", "六号线",
        "Numb", "柠檬妖精", "PoRo", "随风", "墨清",
        "桃子姐姐", "温存i", "我叫MMT", "我呀我", "小末影", "风影", "笑气气", "炫月", "燁燁",
        "一梦千年", "佳音如期", "功不唐捐", "卡子哥", "晨曦",
        "帅到分手", "午夜飞升", "星君", "预言", "成",
        "红尘", "幻月", "幻雪", "山与海", "虾仁哥哥",
        "风之奇影", "爱上风", "Dddddddd", "珊迪", "木子升", "建议击毙", "潮起潮落", "风云祭", "100分",
        "谷丶然", "无敌的话", "勿忘", "Rayn", "哈哈哈哈哈",
        "钵钵鸡", "笑气气", "花海", "Æternø", "天赋与努力",
        "晨落", "徒手", "柠檬", "余晖", "隐",
        "D", "三都", "大白菜帮子", "佳南",  "休闲玩家"
    ],
    donationMessages: [
        "送上小心心！",
        "给你点鼓励！",
        "支持主播！",
        "继续加油！",
        "小小礼物不成敬意",
        "今天的表现太棒了！",
        "值得鼓励！",
        "希望主播越来越好",
        "这是你应得的！",
        "打赏一波，主播辛苦了！",
        "希望越来越好，礼物支持",
        "一点心意，买杯奶茶喝~！",
        "看得尽兴，打赏表示",
        "关注很久了，今天送个礼物",
        "今天的直播超赞，打赏！",
        "主播加油，礼物来了哦",
        "小小礼物，不成敬意，继续加油",
        "每天必看，今天打赏一下",
        "这波太秀了，送礼物！",
        "希望你一直播下去，礼物支持",
        "主播辛苦了，送个小礼物",
        "支持你到底，打赏一波",
        "感谢带来欢乐，礼物请查收",
        "主播越来越好了，送个礼物",
        "今天看得过瘾，必须打赏",
        "喜欢你的直播，送点心意",
        "感谢分享，礼物送上！",
        "这波操作值个礼物！",
        "主播真棒，必须鼓励！",
        "感谢你的直播陪伴"
    ],
    // PK段位：青铜/白银/黄金/钻石/星耀/王者，每段5小级；3分钟结束对手总分范围见 pkScoreMin/Max，初始与每次增长见 pkInitial*/pkGrowth*
    pkTiers: [
        { id: 0, name: "青铜", icon: "🥉", mult: 0.6, gpsBase: 1, pkScoreMin: 1000, pkScoreMax: 5000, pkInitialMin: 150, pkInitialMax: 500, pkGrowthMin: 40, pkGrowthMax: 220 },
        { id: 1, name: "白银", icon: "🥈", mult: 1, gpsBase: 5, pkScoreMin: 5000, pkScoreMax: 10000, pkInitialMin: 500, pkInitialMax: 1500, pkGrowthMin: 200, pkGrowthMax: 420 },
        { id: 2, name: "黄金", icon: "🥇", mult: 1.5, gpsBase: 10, pkScoreMin: 10000, pkScoreMax: 30000, pkInitialMin: 1000, pkInitialMax: 3500, pkGrowthMin: 400, pkGrowthMax: 1280 },
        { id: 3, name: "钻石", icon: "💎", mult: 2.2, gpsBase: 15, pkScoreMin: 30000, pkScoreMax: 45000, pkInitialMin: 3000, pkInitialMax: 7500, pkGrowthMin: 1000, pkGrowthMax: 1900 },
        { id: 4, name: "星耀", icon: "🌟", mult: 3, gpsBase: 20, pkScoreMin: 45000, pkScoreMax: 100000, pkInitialMin: 5000, pkInitialMax: 15000, pkGrowthMin: 1800, pkGrowthMax: 4200 },
        { id: 5, name: "王者", icon: "👑", mult: 4, gpsBase: 30, pkScoreMin: 100000, pkScoreMax: 999999, pkInitialMin: 15000, pkInitialMax: 80000, pkGrowthMin: 4000, pkGrowthMax: 42000 }
    ],
    pkSubNames: ["", "I", "II", "III", "IV", "V"],
    // 1. 直播主题活动（随机事件解锁）
    themes: [
        { id: 0, name: "常规直播", expMult: 1, earnMult: 1, icon: "📺" },
        { id: 1, name: "打BOSS专场", expMult: 1.5, earnMult: 1.3, icon: "⚔️" },
        { id: 2, name: "装备展示会", expMult: 1.3, earnMult: 1.5, icon: "✨" },
        { id: 3, name: "冲级冲刺日", expMult: 2, earnMult: 1.2, icon: "🚀" },
        { id: 4, name: "午夜惊魂夜", expMult: 1.8, earnMult: 1.6, icon: "🌙" },
        { id: 5, name: "土豪粉丝见面会", expMult: 1.2, earnMult: 2, icon: "👑" }
    ],
    // 2. 超级金主名字（打赏3-10倍）
    vipNames: ["王总", "李董事长", "马老板", "神秘大佬", "榜一大哥", "富二代小张", "土豪666", "氪金之神"],
    // 6. 随机直播事件（含主题活动解锁，扩充）
    randomEvents: [
        { id: "tycoon", name: "神秘大佬空降", desc: "一位神秘大佬进入直播间并豪刷礼物！", viewerBonus: 5, earnBonus: 3, prob: 0.03 },
        { id: "surge", name: "服务器抽风", desc: "平台推荐位异常，观众暴涨！", viewerBonus: 15, earnBonus: 1, prob: 0.04 },
        { id: "hater", name: "黑粉捣乱", desc: "黑粉带节奏，少量观众离开", viewerBonus: -1, earnBonus: 0.5, prob: 0.02 },
        { id: "celebrity", name: "明星串门", desc: "知名主播来串门，人气暴涨！", viewerBonus: 20, earnBonus: 1.5, prob: 0.02 },
        { id: "lucky", name: "幸运星降临", desc: "今日运势爆棚，打赏概率翻倍！", viewerBonus: 0, earnBonus: 2, prob: 0.06 },
        { id: "theme_unlock", name: "主题活动解锁", desc: "解锁新的直播主题活动！", viewerBonus: 0, earnBonus: 1, prob: 0.08, unlockTheme: true },
        { id: "flash_gift", name: "礼物风暴", desc: "观众集体刷礼物，收益短暂提升！", viewerBonus: 0, earnBonus: 2.5, prob: 0.04 },
        { id: "new_fans", name: "粉丝团扩列", desc: "一波新粉丝涌入直播间！", viewerBonus: 12, earnBonus: 1, prob: 0.05 },
        { id: "hot_search", name: "上热搜", desc: "直播间话题上热搜，人气飙升！", viewerBonus: 25, earnBonus: 1.2, prob: 0.02 },
        { id: "boss_visit", name: "平台老板查房", desc: "平台老板来查房，打赏一波！", viewerBonus: 0, earnBonus: 3, prob: 0.015 }
    ],
    // 7. 直播成就（扩充）
    achievements: [
        { id: "first_1k", name: "百人主播", desc: "单次直播观众破百", reward: 5000, check: () => player.liveStream.viewers.length >= 100 },
        { id: "live_10h", name: "劳模主播", desc: "累计直播10小时", reward: 10000, check: () => (player.liveStream.totalLiveTime || 0) >= 36000000 },
        { id: "combo_10", name: "礼物连击王", desc: "达成10连击", reward: 8000, check: () => (player.liveStream.giftCombo || 0) >= 10 },
        { id: "earn_1m", name: "百万粉丝", desc: "粉丝数破百万", reward: 20000, check: () => (player.liveStream.totalEarnings || 0) >= 10000000 },
        { id: "pk_win", name: "PK无敌", desc: "赢得直播PK", reward: 15000, check: () => (player.liveStream.achievements || {}).pk_win },
        { id: "theme_master", name: "主题达人", desc: "解锁全部直播主题(随机事件)", reward: 25000, check: () => (player.liveStream.unlockedThemes || [0]).length >= 6 },
        { id: "wheel_10", name: "轮盘达人", desc: "使用幸运轮盘10次", reward: 3000, check: () => (player.liveStream.wheelTotalCount || 0) >= 10 },
        { id: "lottery_5", name: "抽奖主播", desc: "发起弹幕抽奖5次", reward: 5000, check: () => (player.liveStream.lotteryTotalCount || 0) >= 5 },
        { id: "guess_3", name: "竞猜王", desc: "竞猜猜中3次", reward: 4000, check: () => (player.liveStream.guessWinCount || 0) >= 3 },
        { id: "checkin_7", name: "打卡达人", desc: "连续7天直播签到", reward: 8000, check: () => (player.liveStream.checkInStreak || 0) >= 7 },
        { id: "daily_all", name: "任务狂人", desc: "单日完成全部每日任务", reward: 10000, check: function() { var d = player.liveStream.dailyTaskDone || {}; return Object.keys(d).length >= liveStreamSystem.dailyTasks.length; } }
    ],
    // 8. 弹幕投票选项（扩充）
    voteTemplates: [
        { options: ["去打小怪", "去挑战BOSS", "去挖矿"], action: "冒险方向" },
        { options: ["升级攻击", "升级防御", "升级生命"], action: "属性加点" },
        { options: ["开盲盒", "继续打怪", "休息一下"], action: "下一步" },
        { options: ["抽奖", "福袋", "竞猜"], action: "直播间玩法" },
        { options: ["再播半小时", "再播一小时", "准时下播"], action: "直播时长" },
        { options: ["唱首歌", "讲段子", "抽奖"], action: "观众福利" },
        { options: ["冲级", "打装备", "做任务"], action: "今日目标" }
    ],
    // 每日直播任务（每日重置，完成给经验+玫瑰花）
    dailyTasks: [
        { id: "live_30m", name: "直播30分钟", desc: "单次直播满30分钟", target: 30*60*1000, rewardExp: 2000, rewardRose: 500, check: function() { return (player.liveStream.lastLiveStart && (Date.now() - player.liveStream.lastLiveStart) >= 30*60*1000); } },
        { id: "viewer_50", name: "观众破50", desc: "单次直播观众数达到50", target: 50, rewardExp: 3000, rewardRose: 800, check: function() { return player.liveStream.viewers.length >= 50; } },
        { id: "gift_10", name: "收到10次打赏", desc: "单次直播收到至少10次打赏", target: 10, rewardExp: 2500, rewardRose: 600, check: function() { return (player.liveStream.donationCountThisLive || 0) >= 10; } },
        { id: "combo_5", name: "礼物5连击", desc: "达成5连击", target: 5, rewardExp: 1500, rewardRose: 400, check: function() { return (player.liveStream.giftCombo || 0) >= 5; } },
        { id: "heat_50", name: "热度达50", desc: "直播间热度达到50", target: 50, rewardExp: 1800, rewardRose: 450, check: function() { return (player.liveStream.heat || 0) >= 50; } },
        { id: "pk_win_once", name: "赢一场PK", desc: "直播中赢得一次PK", target: 1, rewardExp: 5000, rewardRose: 1500, check: function() { return (player.liveStream.achievements || {}).pk_win; } }
    ],
    // 幸运轮盘奖励（消耗5000✨或50热度一次）
    wheelItems: [
        { name: "500玫瑰花", type: "rose", value: 500, prob: 25, icon: "🌹" },
        { name: "2000玫瑰花", type: "rose", value: 2000, prob: 15, icon: "💐" },
        { name: "100经验", type: "exp", value: 100, prob: 20, icon: "⭐" },
        { name: "5名观众", type: "viewer", value: 5, prob: 18, icon: "👥" },
        { name: "热度+20", type: "heat", value: 20, prob: 12, icon: "🔥" },
        { name: "10000玫瑰花", type: "rose", value: 10000, prob: 5, icon: "🎁" },
        { name: "400经验", type: "exp", value: 400, prob: 3, icon: "🌟" },
        { name: "超级金主入场", type: "vip", value: 1, prob: 2, icon: "👑" }
    ],
    // 竞猜选项文案
    guessTemplates: [
        { name: "下一分钟礼物数", options: ["单数", "双数"] },
        { name: "观众数变化", options: ["增加", "减少"] },
        { name: "热度趋势", options: ["上升", "下降"] }
    ],
    // 贵族进场特效文案
    nobleEnterMessages: ["👑 贵族【{name}】驾临直播间！", "✨ 尊贵的【{name}】进入直播间！", "🎉 欢迎大人物【{name}】到来！"],
    // 直播挑战（本场目标，完成得奖励；难度×10，奖励÷10）
    liveChallenges: [
        { type: "rose", name: "本场收玫瑰", target: 300000, rewardRose: 60, rewardExp: 120 },
        { type: "rose", name: "本场收玫瑰", target: 700000, rewardRose: 150, rewardExp: 280 },
        { type: "rose", name: "本场收玫瑰", target: 1200000, rewardRose: 300, rewardExp: 500 },
        { type: "rose", name: "本场收玫瑰", target: 2000000, rewardRose: 550, rewardExp: 900 },
        { type: "heat", name: "本场热度", target: 600, rewardRose: 50, rewardExp: 100 },
        { type: "heat", name: "本场热度", target: 1200, rewardRose: 110, rewardExp: 220 },
        { type: "heat", name: "本场热度", target: 2000, rewardRose: 200, rewardExp: 400 },
        { type: "viewer", name: "本场观众", target: 500, rewardRose: 40, rewardExp: 80 },
        { type: "viewer", name: "本场观众", target: 1000, rewardRose: 100, rewardExp: 200 },
        { type: "viewer", name: "本场观众", target: 1800, rewardRose: 200, rewardExp: 380 },
        { type: "donation", name: "本场打赏次数", target: 250, rewardRose: 80, rewardExp: 160 },
        { type: "donation", name: "本场打赏次数", target: 500, rewardRose: 180, rewardExp: 350 },
        { type: "donation", name: "本场打赏次数", target: 800, rewardRose: 320, rewardExp: 600 }
    ],
    // 观众心愿单关键词与奖励
    wishListKeywords: ["加油", "冲冲冲", "主播最棒", "666", "支持", "关注了", "点赞", "厉害了", "牛啊", "好看"],
    // 弹幕口令词库
    danmakuPasswordWords: ["666", "冲冲冲", "主播加油", "礼物走一波", "排面", "大气", "感谢", "支持主播", "关注了", "来了"],
    // 9. 直播间装扮（按等级解锁，共10种，玩家可任选已解锁的）
    roomThemes: [
        { level: 1, name: "默认", bg: "linear-gradient(to bottom, #1a1a2a, #0f0f23)", color: "#ff00ff" },
        { level: 5, name: "炫紫", bg: "linear-gradient(135deg, #2d1b4e, #1a0a2e)", color: "#bb86fc" },
        { level: 10, name: "金碧辉煌", bg: "linear-gradient(135deg, #3d2c1a, #1a1510)", color: "#FFD700" },
        { level: 15, name: "赛博朋克", bg: "linear-gradient(135deg, #0d0221, #261447)", color: "#00fff5" },
        { level: 20, name: "梦幻星空", bg: "linear-gradient(180deg, #0c0c1e 0%, #1a1a3e 50%, #0c0c1e 100%)", color: "#e040fb" },
        { level: 25, name: "翡翠秘境", bg: "linear-gradient(160deg, #0a2f1a 0%, #1a4d2e 40%, #0d2818 100%)", color: "#00e676" },
        { level: 30, name: "熔岩之心", bg: "linear-gradient(180deg, #2a0a0a 0%, #8b2500 50%, #1a0505 100%)", color: "#ff6d00" },
        { level: 40, name: "极光幻境", bg: "linear-gradient(135deg, #0d2137 0%, #1a4a6e 30%, #00acc1 70%, #0d2137 100%)", color: "#18ffff" },
        { level: 50, name: "神谕殿堂", bg: "linear-gradient(180deg, #1a0a2e 0%, #4a148c 30%, #7b1fa2 60%, #1a0a2e 100%)", color: "#ea80fc" },
        { level: 60, name: "永恒王座", bg: "linear-gradient(135deg, #1a1a0a 0%, #3d3d1a 25%, #ffd700 50%, #1a1a0a 100%)", color: "#fff59d" }
    ],
    // 10. 情境化观众发言（按直播主题/状态选句，更真实）
    lastAiDanmaku: null,
    themeMessages: {
        0: ["主播今天玩什么？", "氛围不错啊", "刚进来，这是什么游戏？", "主播多播一会呗", "关注了~", "今天人不少", "前排", "有人吗", "晚上好", "主播好", "随便看看", "推荐来的", "画质可以", "声音清楚", "今天播啥", "多播会呗", "别急着下", "再玩一局", "常规直播也好看", "稳", "刚点进来", "人气可以", "弹幕走一波", "今天状态不错", "主播多讲点", "有一起看的吗", "记笔记了", "收藏了", "今天话好多", "和谐和谐"],
        1: ["BOSS要出了吗？", "这BOSS血好厚", "主播小心技能！", "打BOSS专场太燃了", "快放大招啊", "这伤害绝了", "注意走位", "别贪刀", "BOSS快死了", "补刀补刀", "躲技能啊", "这BOSS会秒人", "拉仇恨", "奶一口", "输出够吗", "T住T住", "破防了破防了", "暴击了", "连招漂亮", "BOSS专场值了", "刺激", "要翻车了", "稳住能过", "过了过了", "牛逼", "打BOSS还得看主播", "装备爆了没", "掉啥了", "名场面", "这波学到了", "主播别贪", "走位走位", "小心反杀", "稳一点"],
        2: ["装备好闪", "这件装备哪打的？", "求装备攻略", "属性太顶了", "羡慕这身装备", "主播装备展示会爱了", "这套装齐了？", "强化多少了", "镶嵌的啥宝石", "词条完美", "毕业装了吧", "肝了多久", "氪了多少", "欧皇装备", "吸欧气", "同款求链接", "展示会太养眼了", "属性拉满", "战力多少", "能看看详细吗", "截图了", "抄作业", "学不来学不来", "装备碾压", "这套多少钱", "非酋哭了", "欧皇本皇", "求同款", "词条咋洗的"],
        3: ["冲级冲级！", "今天能冲多少级？", "加油冲啊", "冲级日必须看", "主播冲级好快", "一起冲！", "经验条满了", "升级了升级了", "冲级日buff在", "肝就完事", "今天能满级吗", "还差多少", "冲冲冲", "别停", "效率拉满", "双倍经验?", "冲级榜第几了", "卷起来了", "肝帝本帝", "秃头警告", "养生玩家看看就好", "冲级日不冲亏了", "今天冲多少", "经验飞起", "肝就完了", "秃头警告", "卷不动了"],
        4: ["午夜档来了", "半夜看直播刺激", "惊魂夜有内味了", "气氛到位", "半夜不睡看主播", "凌晨党", "夜猫子集合", "半夜人还不少", "惊魂夜应景", "关灯看", "背后发凉", "不困了", "熬夜+1", "明天不用上班吗", "学生党明天没课", "午夜档老观众了", "就等这个点", "夜深人静看直播", "惊魂夜效果拉满", "弹幕护体", "有点怕", "刺激", "不敢关灯", "弹幕护体护体", "有内味了", "明天不用早起吗"],
        5: ["土豪见面会哈哈", "金主爸爸来了", "今天打赏氛围好", "榜一大哥在哪", "礼物刷起来", "老板大气", "榜一稳了", "见面会排面", "礼物没停过", "感谢老板", "土豪们开始了", "刷屏了刷屏了", "小礼物走一波", "心意到了", "土豪专场", "围观大佬", "沾沾财气", "今天打赏破纪录了吧", "金主爸爸们好", "粉丝见面会排面足", "礼物雨", "老板们别停", "榜一大哥稳", "排面排面", "沾光沾光", "大气大气"]
    },
    pkMessages: ["PK冲啊！", "对面不行", "稳住我们能赢", "PK太刺激了", "主播加油PK！", "这波PK好看", "别送", "拿人头", "团他们", "单杀单杀", "反杀反杀", "翻盘翻盘", "让一追二", "碾压了", "对面投了吧", "PK节奏带起来", "经济领先了", "别浪别浪", "一波一波", "推塔推塔", "守家守家", "开团了", "跟上输出", "保主播", "PK不能输", "气势上赢了", "对面心态崩了", "稳赢局", "别被翻", "PK必胜"],
    giftComboMessages: ["连击了连击了！", "礼物刷屏了", "大佬们别停", "连击牛啊", "这波连击绝了", "十连击了", "破纪录了", "礼物雨", "停不下来", "老板们威武", "连击别断", "冲冲冲", "继续继续", "破百连击", "直播间炸了", "感谢各位老板", "大气大气", "刷屏了", "眼花缭乱", "连击王", "礼物风暴", "壕无人性", "沾光沾光", "排面"],
    followUpMessages: ["+1", "同上", "说的对", "我也觉得", "顶", "排", "附议", "确实", "没错", "有道理", "同意", "复议", "跟了", "一样", "同", "+10086", "说得好", "对头", "没毛病", "正解", "就是这样", "懂", "对对对", "没错没错", "确实确实", "同感", "+1+1", "顶顶", "附议附议", "跟了跟了", "同意同意", "说的在理", "正解正解", "没毛病没毛病", "对对对", "就是这样就是这样"],
    // 11. 玩家发言后AI回复规则（关键词→多条候选，更像真人，扩列更智能）
    replyRules: [
        { keywords: ["谢谢", "感谢", "多谢"], responses: ["不客气~", "应该的！", "主播辛苦了咱们支持应该的", "小意思~", "客气啥", "不用谢", "没事没事", "举手之劳", "主播值得", "谢啥谢", "应该的应该的", "主播加油就行"] },
        { keywords: ["？", "?", "怎么", "如何", "啥", "哪", "为什么", "为啥"], responses: ["同问！", "好问题，坐等主播答", "我也想知道", "同求解答", "主播快回复一下", "+1 我也想问这个", "同问+1", "蹲一个答案", "弹幕有没有懂的", "同好奇", "同问+10086", "等主播说", "弹幕大神科普一下"] },
        { keywords: ["大家好", "嗨", "hello", "你们好", "在吗"], responses: ["在的在的", "嗨~", "欢迎主播", "在呢", "来了来了", "在", "这儿呢", "晚上好", "你好呀", "欢迎欢迎", "在的在的", "嗨嗨", "晚上好呀"] },
        { keywords: ["晚安", "睡了", "拜拜", "下了"], responses: ["晚安~", "早点休息", "明天见", "拜拜~", "下次再来呀", "好梦", "撤了撤了", "溜了溜了", "明天见呀", "注意身体", "晚安好梦", "明天见~", "撤了"] },
        { keywords: ["厉害", "强", "牛", "秀", "666", "牛逼"], responses: ["确实秀", "主播技术一直在线", "这波我服", "学到了", "必须666", "同感", "强啊", "yyds", "基操基操", "有手就行（不是", "秀啊", "这波在大气层", "强强强", "66666"] },
        { keywords: ["菜", "不行", "翻车"], responses: ["哈哈哈翻车了", "没事再来", "主播也有失误嘛", "下一把赢回来", "笑死", "节目效果", "故意哒", "下一把carry", "问题不大", "下一把稳回来", "翻车日常", "节目效果拉满"] },
        { keywords: ["礼物", "打赏", "送"], responses: ["已送已送", "小小礼物不成敬意", "支持主播", "礼物走一波", "刚打赏了", "心意到了", "小礼物", "老板们上", "打赏了打赏了", "送了送了", "一点心意", "支持一下"] },
        { keywords: ["几点", "什么时候", "下次"], responses: ["同问下次啥时候播", "主播常驻时间说一下呗", "关注了等开播提醒", "同问", "蹲开播", "下次一定来", "准时到", "同问+1", "蹲一个开播时间", "关注了等通知"] },
        { keywords: ["攻略", "怎么玩", "怎么升级", "技巧"], responses: ["坐等主播教学", "同求攻略", "主播讲讲呗", "新手求带", "同求", "笔记准备好了", "收藏了等更", "催更攻略", "同求+1", "主播出个教程呗", "记笔记了"] },
        { keywords: ["卡", "卡了", "不动"], responses: ["我这边还好", "刷新试试", "可能是网络", "等等看", "我这也卡", "刚卡完", "重启试试", "换线路", "我这儿不卡", "你网络问题吧", "等等就好了"] },
        { keywords: ["喜欢", "爱了", "粉了"], responses: ["+1 关注了", "同喜欢", "主播值得粉", "已关注", "路转粉", "爱了爱了", "关注不迷路", "铁粉+1", "同爱", "已关注不迷路", "路转粉+1"] },
        { keywords: ["录屏", "录了", "回放"], responses: ["我也录了", "坐等剪辑", "录屏组辛苦了", "有回放吗", "同求回放", "录了录了", "精彩已存", "同求剪辑", "录屏+1", "等投稿"] },
        { keywords: ["关注", "订阅"], responses: ["已关注", "关注了", "订阅了", "不迷路", "老粉了", "新粉报道", "关注走一波", "早关注了", "关注不迷路", "订阅走起"] },
        { keywords: ["笑", "哈哈", "哈哈哈"], responses: ["笑死", "笑不活了", "蚌埠住了", "同笑", "节目效果", "哈哈哈", "笑yue了", "笑裂了", "笑傻了", "哈哈哈哈", "绷不住了"] },
        { keywords: ["抽奖", "福利", "红包"], responses: ["分母+1", "参与一下", "万一中了呢", "从来没中过", "同参与", "抽我抽我", "分母来了", "分子在此", "来当分母"] },
        { keywords: ["迟到", "晚播", "鸽"], responses: ["等了好久", "终于来了", "还以为鸽了", "来了就好", "下次早点呗", "准时蹲到了", "差点以为不播了"] },
        { keywords: ["再播", "别下", "一会"], responses: ["再播一会呗", "别下别下", "最后一局", "再一局", "舍不得关", "再半小时呗", "别走"] },
        { keywords: ["失误", "翻车", "白给"], responses: ["没事没事", "下一把", "节目效果", "问题不大", "主播也有今天", "笑死", "下一把carry"] },
        { keywords: ["音乐", "BGM", "歌", "背景"], responses: ["同求歌名", "BGM好听", "歌单交出来", "啥歌啊", "同问背景音乐", "好听", "坐等歌名"] },
        { keywords: ["群", "粉丝群", "QQ", "微信"], responses: ["同问群号", "有群吗", "想加群", "群满了吗", "同求", "主播说下群号呗"] },
        { keywords: ["露脸", "摄像头", "开播"], responses: ["不露脸也行", "声音好听就够了", "开摄像头了吗", "声控满足了", "露不露都行"] },
        { keywords: ["吃饭", "吃", "饿"], responses: ["主播快去吃饭", "别饿着", "边吃边看", "吃饱再播", "身体重要"] },
        { keywords: ["休息", "累", "睡"], responses: ["主播注意休息", "别太拼", "累了就下吧", "身体要紧", "早点休息"] },
        { keywords: ["明天", "下次", "见"], responses: ["明天见", "不见不散", "下次一定", "准时到", "约好了"] },
        { keywords: ["翻牌", "念我", "ID"], responses: ["求翻牌", "念我ID", "翻我翻我", "被翻牌了开心", "眼熟我"] },
        { keywords: ["人气", "人好多", "破万"], responses: ["人气可以", "人越来越多了", "小主播加油", "会火的", "迟早的事"] },
        { keywords: ["和谐", "别吵", "喷子"], responses: ["和气生财", "理性观播", "别理喷子", "房管干活", "和谐和谐"] }
    ],
    defaultReplies: ["收到！", "同意主播！", "说的对", "有道理", "嗯嗯", "哈哈哈", "可以可以", "主播说得对", "支持", "好", "行", "中", "妥了", "稳", "没问题", "懂了", "明白", "get", "确实", "没错", "对对对", "就是这样", "没毛病", "顶", "赞", "好活", "可以", "彳亍", "针不戳", "不错", "nice", "漂亮", "ok", "收到", "了解", "晓得", "在了", "看到了", "+1", "同上", "嗯", "对", "是的", "同意", "附议", "跟了", "同", "说得好", "正解", "对头", "没毛病", "在了", "好哒", "行吧", "成", "欧克", "okok", "好嘞", "得", "妥", "中中中", "可以可以可以", "对对对", "没错没错", "确实确实", "哈哈哈好", "笑死", "绷不住了", "有道理有道理", "学到了", "记下了", "懂了懂了", "明白明白", "get了", "收到收到", "了解了解", "妥妥的", "稳稳的", "没问题没问题", "支持支持", "顶顶", "赞赞", "好活好活"]
};
const danmakuSystem = {
    active: true,
    speed: 5, // 1-10
    density: 3, // 1-10
    container: null,
    colors: {
        system: '#ff00ff',
        viewer: '#ffffff',
        player: '#4CAF50',
        donation: '#FFD700'
    },
    tracks: [], // 弹幕轨道
    trackHeight: 30, // 每条轨道的高度
    maxTracks: 10, // 最大轨道数
    fontSizes: [14, 16, 18, 20],
    styles: ['normal', 'bold', 'italic']
};
// 初始化弹幕系统（事件只绑定一次，避免每次开播重复绑定导致内存泄漏）
function initDanmakuSystem() {
    danmakuSystem.container = document.getElementById('danmakuContainer');
    if (!danmakuSystem.container) return;
    var containerHeight = danmakuSystem.container.clientHeight;
    danmakuSystem.maxTracks = Math.floor(containerHeight / danmakuSystem.trackHeight) || 1;
    danmakuSystem.tracks = [];
    for (var i = 0; i < danmakuSystem.maxTracks; i++) {
        danmakuSystem.tracks.push({ occupied: false, lastUsed: 0 });
    }
    if (liveStreamSystem.danmakuUiInitialized) return;
    liveStreamSystem.danmakuUiInitialized = true;
    var toggleEl = document.getElementById('danmakuToggle');
    var speedEl = document.getElementById('danmakuSpeed');
    var densityEl = document.getElementById('danmakuDensity');
    if (toggleEl) toggleEl.addEventListener('change', function() {
        danmakuSystem.active = this.checked;
        if (!this.checked) clearDanmaku();
    });
    if (speedEl) speedEl.addEventListener('input', function() { danmakuSystem.speed = parseInt(this.value) || 5; });
    if (densityEl) densityEl.addEventListener('input', function() { danmakuSystem.density = parseInt(this.value) || 3; });
}

// 清除弹幕函数（修复）
function clearDanmaku() {
    if (!danmakuSystem.container) return;
    
    // 获取所有弹幕元素
    const danmakuElements = danmakuSystem.container.querySelectorAll('.danmaku');
    
    // 遍历所有弹幕元素
    danmakuElements.forEach(danmaku => {
        // 获取所有正在运行的动画
        const animations = danmaku.getAnimations();
        
        // 取消所有动画
        animations.forEach(animation => {
            animation.cancel();
        });
        
        // 移除元素
        danmaku.remove();
    });
    
    // 重置所有轨道状态
    if (danmakuSystem.tracks) {
        for (let i = 0; i < danmakuSystem.tracks.length; i++) {
            danmakuSystem.tracks[i].occupied = false;
            danmakuSystem.tracks[i].lastUsed = Date.now();
        }
    }
}

// 添加弹幕到直播画面
function addDanmakuToScreen(sender, message, type) {
    if (!danmakuSystem.active || !player.liveStream.isLive || !danmakuSystem.container) return;
    
    // 找到可用的轨道
    const availableTrack = findAvailableTrack();
    if (availableTrack === -1) return;
    
    // 创建弹幕元素
    const danmaku = document.createElement('div');
    danmaku.className = 'danmaku';
    danmaku.style.position = 'absolute';
    danmaku.style.top = `${availableTrack * danmakuSystem.trackHeight}px`;
    danmaku.style.right = '0';
    danmaku.style.color = danmakuSystem.colors[type] || '#ffffff';
    danmaku.style.fontSize = `${danmakuSystem.fontSizes[Math.floor(Math.random() * danmakuSystem.fontSizes.length)]}px`;
    danmaku.style.fontWeight = Math.random() > 0.7 ? 'bold' : 'normal';
    danmaku.style.fontStyle = Math.random() > 0.8 ? 'italic' : 'normal';
    danmaku.style.textShadow = '1px 1px 2px rgba(0,0,0,0.7)';
    danmaku.style.whiteSpace = 'nowrap';
    danmaku.style.zIndex = '2';
    danmaku.style.opacity = '0.9';
    danmaku.style.transform = 'translateX(100%)';
    danmaku.innerHTML = `<span style="color: #aaa;">${sender}:</span> ${message}`;
    
    // 添加到容器
    danmakuSystem.container.appendChild(danmaku);
    
    // 标记轨道占用
    danmakuSystem.tracks[availableTrack].occupied = true;
    
    // 计算动画时间
    const containerWidth = danmakuSystem.container.clientWidth;
    const danmakuWidth = danmaku.offsetWidth;
    const distance = containerWidth + danmakuWidth;
    const duration = distance / (danmakuSystem.speed * 50);
    
    // 应用动画
    const animation = danmaku.animate(
        [
            { transform: 'translateX(100%)' },
            { transform: `translateX(-${danmakuWidth}px)` }
        ],
        {
            duration: duration * 1000,
            easing: 'linear'
        }
    );
    
    animation.onfinish = () => {
        // 动画完成后移除元素并释放轨道
        if (danmaku.parentNode === danmakuSystem.container) {
            danmaku.remove();
        }
        if (availableTrack < danmakuSystem.tracks.length) {
            danmakuSystem.tracks[availableTrack].occupied = false;
            danmakuSystem.tracks[availableTrack].lastUsed = Date.now();
        }
    };
}

// 查找可用轨道
function findAvailableTrack() {
    if (!danmakuSystem.tracks || danmakuSystem.tracks.length === 0) return -1;
    
    // 按最后使用时间排序
    const sortedTracks = [...danmakuSystem.tracks]
        .map((track, index) => ({ ...track, index }))
        .sort((a, b) => a.lastUsed - b.lastUsed);
    
    for (let i = 0; i < sortedTracks.length; i++) {
        if (!sortedTracks[i].occupied) {
            return sortedTracks[i].index;
        }
    }
    
    // 如果没有空闲轨道，尝试使用最久未使用的轨道
    const oldestTrack = sortedTracks[0];
    if (Date.now() - oldestTrack.lastUsed > 5000) {
        return oldestTrack.index;
    }
    
    return -1;
}


// 初始化直播系统
function initLiveStreamSystem() {
    if (!player.liveStream) {
        player.liveStream = {
            level: 1,
            exp: 0,
            totalEarnings: 1000,
            isLive: false,
            lastLiveStart: 0,
            totalLiveTime: 0,
            expMultiplier: 1,
            viewers: [],
            donationHistory: [],
            lastDanmaku: null,
            // 新增玩法数据
            currentTheme: null,
            themeEndTime: 0,
            heat: 0,
            lastGiftTime: 0,
            giftCombo: 0,
            lastGiftType: null,
            pkScore: 0,
            pkActive: false,
            pkTier: 0,
            pkSubLevel: 1,
            roomTitle: "转生大陆冒险日记",
            unlockedThemes: [0],
            achievements: {},
            voteOptions: [],
            voteEndTime: 0,
            eventCooldown: 0,
            donationCountThisLive: 0,
            lastDailyReset: 0,
            dailyTaskDone: {},
            wheelTotalCount: 0,
            lotteryTotalCount: 0,
            lotteryEndTime: 0,
            lotteryParticipants: [],
            lotteryPrize: 0,
            guessWinCount: 0,
            guessActive: false,
            guessEndTime: 0,
            guessOption: null,
            guessResult: null,
            checkInDoneToday: false,
            checkInStreak: 0,
            lastCheckInDate: "",
            guardList: [],
            lastConnectMcTime: 0,
            nobleEnterShown: {},
            pkCooldownEndTime: 0,
            lotteryCooldownEndTime: 0,
            guessCooldownEndTime: 0,
            hourlyEarningsStart: 0,
            hourlyEarnings: 0,
            weeklyEarningsStart: 0,
            weeklyEarnings: 0,
            promotionHotEndTime: 0,
            promotionBannerEndTime: 0,
            promotionFeaturedEndTime: 0,
            promotionBigvEndTime: 0,
            promotionSplashEndTime: 0,
            currentChallenge: null,
            challengeCompletedThisLive: 0,
            selectedRoomThemeIndex: 0,
            wishList: null,
            lastMilestoneMinutes: 0,
            taskChainClaimedToday: false,
            danmakuPassword: null,
            danmakuPasswordParticipants: []
        };
    }
    // 迁移老存档
    const def = { currentTheme: null, themeEndTime: 0, heat: 0, lastGiftTime: 0, giftCombo: 0, lastGiftType: null, pkScore: 0, pkActive: false, pkTier: 0, pkSubLevel: 1, roomTitle: "转生大陆冒险日记", unlockedThemes: [0], achievements: {}, voteOptions: [], voteEndTime: 0, eventCooldown: 0, donationCountThisLive: 0, lastDailyReset: 0, dailyTaskDone: {}, wheelTotalCount: 0, lotteryTotalCount: 0, lotteryEndTime: 0, lotteryParticipants: [], lotteryPrize: 0, guessWinCount: 0, guessActive: false, guessEndTime: 0, guessOption: null, guessResult: null, checkInDoneToday: false, checkInStreak: 0, lastCheckInDate: "", guardList: [], lastConnectMcTime: 0, nobleEnterShown: {}, pkCooldownEndTime: 0, lotteryCooldownEndTime: 0, guessCooldownEndTime: 0, hourlyEarningsStart: 0, hourlyEarnings: 0, weeklyEarningsStart: 0, weeklyEarnings: 0, promotionHotEndTime: 0, promotionBannerEndTime: 0, promotionFeaturedEndTime: 0, promotionBigvEndTime: 0, promotionSplashEndTime: 0, currentChallenge: null, challengeCompletedThisLive: 0, selectedRoomThemeIndex: 0, wishList: null, lastMilestoneMinutes: 0, taskChainClaimedToday: false, danmakuPassword: null, danmakuPasswordParticipants: [] };
    for (const k in def) {
        if (player.liveStream[k] === undefined) player.liveStream[k] = def[k];
    }
    if (player.liveStream.pkTier === undefined) player.liveStream.pkTier = 0;
    if (player.liveStream.pkSubLevel === undefined) player.liveStream.pkSubLevel = 1;
    if (player.liveStream.roseThisLive === undefined) player.liveStream.roseThisLive = 0;
    if (player.liveStream.lastMilestoneMinutes === undefined) player.liveStream.lastMilestoneMinutes = 0;
    if (player.liveStream.roomTitle === undefined) player.liveStream.roomTitle = "转生大陆冒险日记";
    var topicInput = document.getElementById("liveTopicInput");
    if (topicInput) {
        topicInput.value = player.liveStream.roomTitle || "转生大陆冒险日记";
        topicInput.onchange = topicInput.onblur = function() {
            var v = (topicInput.value || "").trim();
            player.liveStream.roomTitle = v || "转生大陆冒险日记";
            if (!v) topicInput.value = player.liveStream.roomTitle;
        };
    }
    var avEl = document.getElementById("livePlayerAvatar");
    var nameEl = document.getElementById("livePlayerName");
    if (avEl) {
        if (player.avatar) { avEl.src = player.avatar; avEl.style.display = ""; } else { avEl.src = ""; avEl.style.background = "#444"; avEl.alt = "头像"; }
    }
    if (nameEl) nameEl.textContent = player.name || "主播";
}

// 切换直播系统界面
function toggleLiveStreamSystem() {
    if (player.reincarnationCount < 500) {
        alert("需要达到500转才能开启直播系统！");
        return;
    }
    const overlay = document.getElementById('liveStreamSystemOverlay');
    const ui = document.getElementById('liveStreamSystemUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        initLiveStreamSystem();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        var ti = document.getElementById("liveTopicInput");
        if (ti) ti.value = player.liveStream.roomTitle || "转生大陆冒险日记";
        var av = document.getElementById("livePlayerAvatar");
        var na = document.getElementById("livePlayerName");
        if (av) { if (player.avatar) { av.src = player.avatar; av.style.display = ""; } else { av.src = ""; av.style.background = "#444"; } }
        if (na) na.textContent = player.name || "主播";
        updateLiveStreamUI();
    }
}

// 更新直播画面左上角：PK结束时间、福袋倒计时、投票
function updateLiveStreamOverlay() {
    const pkEl = document.getElementById('liveOverlayPk');
    const fortuneEl = document.getElementById('liveOverlayFortune');
    const voteEl = document.getElementById('liveOverlayVote');
    if (!pkEl || !fortuneEl || !voteEl) return;
    if (!player.liveStream || !player.liveStream.isLive) {
        pkEl.style.display = fortuneEl.style.display = voteEl.style.display = 'none';
        return;
    }
    const ls = player.liveStream;
    const liveViewerCount = Array.isArray(ls.viewers) ? ls.viewers.length : 0;
    const now = Date.now();
    
    pkEl.style.display = 'none';
    fortuneEl.style.display = 'none';
    voteEl.style.display = 'none';
    
    if (ls.pkActive && ls.pkEndTime) {
        const secLeft = Math.max(0, Math.ceil((ls.pkEndTime - now) / 1000));
        if (secLeft <= 0) {
            endLivePk();
        } else {
        pkEl.style.display = 'block';
        pkEl.innerHTML = `⚔️ PK对战 剩余 <b>${secLeft}</b>秒 | 我方:${ls.pkScore || 0} vs 对手:${ls.pkRivalScore || 0}`;
        const pkCd = document.getElementById('pkCountdown');
        if (pkCd) pkCd.textContent = secLeft;
        }
    }
    
    if (ls.fortuneBagNextTime && ls.fortuneBagNextTime > now) {
        const secLeft = Math.ceil((ls.fortuneBagNextTime - now) / 1000);
        fortuneEl.style.display = 'block';
        fortuneEl.innerHTML = `🎁 福袋 <b>${secLeft}</b>秒后开奖`;
    } else if (ls.fortuneBagNextTime) {
        fortuneEl.style.display = 'block';
        fortuneEl.innerHTML = `🎁 福袋 即将开奖...`;
    }
    
    if (ls.voteEndTime > now && ls.voteOptions && ls.voteOptions.length > 0) {
        const secLeft = Math.ceil((ls.voteEndTime - now) / 1000);
        const opts = ls.voteOptions.map(o => `${o.text}(${o.votes || 0})`).join(' ');
        voteEl.style.display = 'block';
        voteEl.innerHTML = `🗳 投票剩余 <b>${secLeft}</b>秒<br><span style="font-size:11px;">${opts}</span>`;
    }
    const guessEl = document.getElementById('liveOverlayGuess');
    const lotteryEl = document.getElementById('liveOverlayLottery');
    if (guessEl) {
        if (ls.guessActive && ls.guessEndTime > now) {
            const secLeft = Math.ceil((ls.guessEndTime - now) / 1000);
            guessEl.style.display = 'block';
            guessEl.innerHTML = `🎯 竞猜剩余 <b>${secLeft}</b>秒 | ${ls.guessName || ''}：${(ls.guessOptions || []).join(' / ')}`;
        } else guessEl.style.display = 'none';
    }
    if (lotteryEl) {
        if (ls.lotteryEndTime > now) {
            const secLeft = Math.ceil((ls.lotteryEndTime - now) / 1000);
            lotteryEl.style.display = 'block';
            lotteryEl.innerHTML = `🎲 弹幕抽奖 <b>${secLeft}</b>秒后开奖 | 参与 <span id="lotteryPartCount">${(ls.lotteryParticipants || []).length}</span> 人`;
        } else lotteryEl.style.display = 'none';
    }
    // 趣味玩法 overlay：本场挑战、观众心愿单、弹幕口令
    var chEl = document.getElementById('liveOverlayChallenge');
    if (chEl) {
        if (ls.currentChallenge) {
            chEl.style.display = 'block';
            var cur = 0;
            if (ls.currentChallenge.type === 'rose') cur = ls.roseThisLive || 0;
            else if (ls.currentChallenge.type === 'heat') cur = Math.floor(ls.heat || 0);
            else if (ls.currentChallenge.type === 'viewer') cur = liveViewerCount;
            else if (ls.currentChallenge.type === 'donation') cur = ls.donationCountThisLive || 0;
            chEl.innerHTML = '🎯 本场挑战: ' + ls.currentChallenge.name + ' ' + cur + '/' + ls.currentChallenge.target + ' → ' + ls.currentChallenge.rewardRose + '🌹';
        } else chEl.style.display = 'none';
    }
    var wishEl = document.getElementById('liveOverlayWishList');
    if (wishEl) {
        if (ls.wishList && ls.wishList.endTime > now) {
            wishEl.style.display = 'block';
            wishEl.innerHTML = '💝 心愿: 发弹幕「' + ls.wishList.keyword + '」→ ' + ls.wishList.rewardRose + '🌹 (剩余' + Math.ceil((ls.wishList.endTime - now)/1000) + '秒)';
        } else wishEl.style.display = 'none';
    }
    var pwEl = document.getElementById('liveOverlayPassword');
    if (pwEl) {
        if (ls.danmakuPassword && ls.danmakuPassword.endTime > now) {
            pwEl.style.display = 'block';
            pwEl.innerHTML = '🎲 弹幕口令【' + ls.danmakuPassword.word + '】剩余' + Math.ceil((ls.danmakuPassword.endTime - now)/1000) + '秒 | 参与' + (ls.danmakuPasswordParticipants || []).length + '人';
        } else pwEl.style.display = 'none';
    }
}

// 更新直播系统UI
function updateLiveStreamUI() {
    const ls = player.liveStream;
    if (!ls) return;
    // 主循环每秒会调用本函数；面板关闭时跳过，避免无界面时仍全量 DOM/innerHTML（否则会随游玩时间累积无意义开销）
    var lsUi = document.getElementById('liveStreamSystemUI');
    if (!lsUi || lsUi.style.display !== 'block') return;
    const lsLevel = Math.max(1, parseInt(ls.level, 10) || 1);
    document.getElementById('liveStreamLevel').textContent = lsLevel;
    document.getElementById('liveStreamExp').textContent = Math.floor(Number(ls.exp) || 0);
    const expArr = liveStreamSystem.expToNextLevel || [];
    document.getElementById('liveStreamNextExp').textContent = expArr[lsLevel - 1] != null ? expArr[lsLevel - 1] : 10000000000;
    const earnShow = Number(ls.totalEarnings);
    document.getElementById('totalLiveEarnings').textContent = Number.isFinite(earnShow) ? (earnShow / 10).toFixed(0) : '0';
    const viewers = Array.isArray(ls.viewers) ? ls.viewers : [];
    document.getElementById('liveViewerCount').textContent = viewers.length;
    const liveViewerCountSideEl = document.getElementById('liveViewerCountSide');
    if (liveViewerCountSideEl) liveViewerCountSideEl.textContent = viewers.length;
    var effectiveHeat = (ls.heat || 0) + (ls.promotionHotEndTime && Date.now() < ls.promotionHotEndTime ? 500 : 0);
    const heat = Math.floor(effectiveHeat);
    document.getElementById('liveHeat').textContent = heat;
    document.getElementById('liveCombo').textContent = ls.giftCombo || 0;
    document.getElementById('heatBonus').textContent = (effectiveHeat * 0.5).toFixed(1);
    document.getElementById('comboBonus').textContent = ((ls.giftCombo || 0) * 10).toFixed(0);
    
    const theme = liveStreamSystem.themes.find(t => t.id === (ls.currentTheme || 0)) || liveStreamSystem.themes[0];
    const themeLeft = ls.themeEndTime > Date.now() ? Math.ceil((ls.themeEndTime - Date.now()) / 60000) : 0;
    document.getElementById('liveThemeInfo').textContent = `当前主题: ${theme ? theme.icon + theme.name : '常规'}${themeLeft ? ' (剩余' + themeLeft + '分钟)' : ''}`;
    
    const pkTierInfo = liveStreamSystem.pkTiers && liveStreamSystem.pkTiers[ls.pkTier || 0];
    const pkSub = ls.pkSubLevel || 1;
    const pkRankText = pkTierInfo ? pkTierInfo.icon + pkTierInfo.name + (liveStreamSystem.pkSubNames || ["","I","II","III","IV","V"])[pkSub] : '';
    const pkRankEl = document.getElementById('livePkRank');
    if (pkRankEl) pkRankEl.textContent = pkRankText ? `PK段位: ${pkRankText}` : '';
    
    const pkInfo = document.getElementById('livePkInfo');
    if (ls.pkActive) {
        pkInfo.style.display = 'block';
        document.getElementById('pkMyScore').textContent = ls.pkScore || 0;
        document.getElementById('pkRivalScore').textContent = ls.pkRivalScore || 0;
    } else {
        pkInfo.style.display = 'none';
    }
    
    const unlocked = ls.unlockedThemes || [0];
    let themeHtml = '';
    liveStreamSystem.themes.forEach(t => {
        if (unlocked.includes(t.id)) {
            themeHtml += `<button onclick="selectLiveTheme(${t.id})" style="margin:2px; padding:4px 8px; background:#333; color:${t.id === (ls.currentTheme || 0) ? '#ff0' : '#fff'}; border-radius:4px; cursor:pointer;">${t.icon}${t.name}</button>`;
        } else {
            themeHtml += `<span style="margin:2px; padding:4px 8px; background:#222; color:#666; border-radius:4px;" title="随机事件解锁">${t.icon}???</span>`;
        }
    });
    const tsArea = document.getElementById('themeSelectArea');
    if (tsArea) tsArea.innerHTML = themeHtml || '无';
    var now = Date.now();
    const pkBtn = document.getElementById('pkBtn');
    if (pkBtn) {
        var pkCd = ls.pkCooldownEndTime && now < ls.pkCooldownEndTime;
        pkBtn.disabled = ls.pkActive || ls.viewers.length < 5 || pkCd;
        if (ls.pkActive) pkBtn.textContent = 'PK进行中';
        else if (pkCd) pkBtn.textContent = 'PK冷却' + Math.ceil((ls.pkCooldownEndTime - now) / 60000) + '分';
        else pkBtn.textContent = 'PK对战';
    }
    const lotteryBtn = document.getElementById('lotteryBtn');
    if (lotteryBtn) {
        var lotActive = ls.lotteryEndTime && ls.lotteryEndTime > now;
        var lotCd = !lotActive && ls.lotteryCooldownEndTime && now < ls.lotteryCooldownEndTime;
        lotteryBtn.disabled = lotActive || lotCd;
        if (lotActive) lotteryBtn.textContent = '抽奖进行中';
        else if (lotCd) lotteryBtn.textContent = '抽奖冷却' + Math.ceil((ls.lotteryCooldownEndTime - now) / 60000) + '分';
        else lotteryBtn.textContent = '弹幕抽奖';
    }
    const guessBtn = document.getElementById('guessBtn');
    if (guessBtn) {
        var guessActive = ls.guessActive && ls.guessEndTime > now;
        var guessCd = !guessActive && ls.guessCooldownEndTime && now < ls.guessCooldownEndTime;
        guessBtn.disabled = guessActive || guessCd;
        if (guessActive) guessBtn.textContent = '竞猜中';
        else if (guessCd) guessBtn.textContent = '竞猜冷却' + Math.ceil((ls.guessCooldownEndTime - now) / 60000) + '分';
        else guessBtn.textContent = '竞猜';
    }
    const connectMcBtn = document.getElementById('connectMcBtn');
    if (connectMcBtn) {
        var mcCd = ls.lastConnectMcTime && now < ls.lastConnectMcTime;
        connectMcBtn.disabled = !ls.isLive || mcCd;
        if (mcCd) connectMcBtn.textContent = '连麦冷却' + Math.ceil((ls.lastConnectMcTime - now) / 60000) + '分';
        else connectMcBtn.textContent = '连麦';
    }
    const checkInBtn = document.getElementById('checkInBtn');
    if (checkInBtn) { checkInBtn.disabled = ls.checkInDoneToday; checkInBtn.textContent = ls.checkInDoneToday ? '已签到' : '直播签到'; }
    var guardBox = document.getElementById('guardListBox');
    if (guardBox) {
        var gl = ls.guardList || [];
        if (gl.length === 0) guardBox.innerHTML = '<div style="text-align:center;color:#555;">暂无数据</div>';
        else guardBox.innerHTML = gl.slice(0, 8).map(function(g, i) { return '<div style="margin-bottom:2px;">' + (i+1) + '. ' + g.name + ' ' + g.amount + '🌹</div>'; }).join('');
    }
    // 直播间装扮：优先使用玩家选择的（若已解锁），否则用当前等级能用的最高档
    const themes = liveStreamSystem.roomThemes;
    const selIdx = ls.selectedRoomThemeIndex != null ? ls.selectedRoomThemeIndex : 0;
    const selectedUnlocked = themes[selIdx] && ls.level >= themes[selIdx].level;
    const roomTheme = selectedUnlocked ? themes[selIdx] : (themes.filter(rt => ls.level >= rt.level).pop() || themes[0]);
    const videoEl = document.getElementById('liveStreamVideo');
    if (videoEl) videoEl.style.background = roomTheme.bg;
    // 应用装扮主色到标题/边框/高亮
    const accent = roomTheme.color || '#ff00ff';
    const levelEl = document.getElementById('liveStreamLevel');
    if (levelEl) levelEl.style.color = accent;
    const expBar = document.getElementById('liveExpProgress');
    if (expBar) { expBar.style.background = accent; expBar.style.background = 'linear-gradient(90deg, ' + accent + ', ' + (accent === '#ff00ff' ? '#cc00cc' : accent) + 'dd)'; }
    const topicInput = document.getElementById('liveTopicInput');
    if (topicInput) { topicInput.style.borderColor = accent; topicInput.style.outline = 'none'; topicInput.style.boxShadow = '0 0 0 1px ' + accent + '40'; }
    const rightPanel = document.getElementById('liveStreamRightPanel');
    if (rightPanel) rightPanel.style.borderLeftColor = accent;
    const sendBtn = document.getElementById('sendDanmakuBtn');
    if (sendBtn) { sendBtn.style.background = accent; sendBtn.style.borderColor = accent; }
    // 装扮选择区：10 种，按等级解锁，当前选中的高亮
    const roomThemeArea = document.getElementById('roomThemeSelectArea');
    if (roomThemeArea) {
        var currentIdx = themes.indexOf(roomTheme);
        if (currentIdx < 0) currentIdx = 0;
        roomThemeArea.innerHTML = themes.map(function(rt, i) {
            var unlocked = ls.level >= rt.level;
            var selected = (currentIdx === i);
            return '<button type="button" onclick="selectRoomTheme(' + i + ')" ' + (unlocked ? '' : 'disabled ') + 'style="margin:2px;padding:4px 10px;border-radius:6px;cursor:' + (unlocked ? 'pointer' : 'not-allowed') + ';border:1px solid ' + (selected ? rt.color : '#444') + ';background:' + (selected ? rt.color + '33' : '#333') + ';color:' + (unlocked ? (selected ? rt.color : '#e0e0e0') : '#555') + ';font-size:11px;" title="直播等级' + rt.level + '解锁">' + rt.name + (unlocked ? '' : ' (' + rt.level + ')') + '</button>';
        }).join('');
    }
    
    const expPercent = Math.min(100, (ls.exp / (liveStreamSystem.expToNextLevel[ls.level - 1] || 10000000000)) * 100);
    document.getElementById('liveExpProgress').style.width = `${expPercent}%`;
    var d = new Date();
    var hourKey = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + '-' + d.getHours();
    var weekKey = getLiveWeekKey();
    if (ls.hourlyEarningsStart !== hourKey) ls.hourlyEarnings = 0;
    if (ls.weeklyEarningsStart !== weekKey) ls.weeklyEarnings = 0;
    var hourEl = document.getElementById('liveHourlyEarnings');
    var weekEl = document.getElementById('liveWeeklyEarnings');
    if (hourEl) hourEl.textContent = (ls.hourlyEarnings || 0).toLocaleString();
    if (weekEl) weekEl.textContent = (ls.weeklyEarnings || 0).toLocaleString();
    
    const achEl = document.getElementById('liveAchievements');
    if (achEl) {
        const ach = ls.achievements || {};
        achEl.innerHTML = liveStreamSystem.achievements.map(a => 
            `<span style="padding:4px 8px; background:${ach[a.id] ? '#2d5a27' : '#333'}; border-radius:4px; color:${ach[a.id] ? '#4CAF50' : '#888'};">${ach[a.id] ? '✓' : '○'} ${a.name}</span>`
        ).join('');
    }
    
    const viewerList = document.getElementById('viewerList');
    viewerList.innerHTML = '';
    
    if (player.liveStream.viewers.length === 0) {
        viewerList.innerHTML = '<div style="text-align: center; color: #666; padding: 20px 0;">暂无观众</div>';
    } else {
        player.liveStream.viewers.forEach(viewer => {
            const viewerElement = document.createElement('div');
            viewerElement.style.marginBottom = '5px';
            viewerElement.style.padding = '5px';
            viewerElement.style.background = '#0a0a1a';
            viewerElement.style.borderRadius = '3px';
            viewerElement.innerHTML = (viewer.isVip ? '👑' : '👤') + ' ' + viewer.name + (viewer.isVip ? ' <span style="color:#FFD700;font-size:10px;">VIP</span>' : '');
            viewerList.appendChild(viewerElement);
        });
    }
    
    // 更新打赏记录
    const donationHistory = document.getElementById('donationHistory');
    donationHistory.innerHTML = '';
    
    if (player.liveStream.donationHistory.length === 0) {
        donationHistory.innerHTML = '<div style="text-align: center; color: #666; padding: 20px 0;">暂无打赏记录</div>';
    } else {
        // 只显示最近10条记录
        const recentDonations = player.liveStream.donationHistory.slice(-10);
        recentDonations.forEach(donation => {
            const donationElement = document.createElement('div');
            donationElement.style.marginBottom = '5px';
            donationElement.style.padding = '5px';
            donationElement.style.background = '#0a0a1a';
            donationElement.style.borderRadius = '3px';
            donationElement.innerHTML = `🎁 ${donation.viewer} 打赏了 ${donation.amount} 朵玫瑰花 - ${donation.message}`;
            donationHistory.appendChild(donationElement);
        });
    }
    
    // 更新直播状态
    const liveStatus = document.getElementById('liveStatus');
    const startLiveBtn = document.getElementById('startLiveBtn');
    
    if (player.liveStream.isLive) {
        liveStatus.innerHTML = `<div style="font-size: 24px; color: ${accent};">直播中</div><div style="color: ${accent}99;">已直播: ${formatTimew(Date.now() - player.liveStream.lastLiveStart)}</div>`;
        startLiveBtn.textContent = '结束直播';
        startLiveBtn.style.background = '#f44336';
    } else {
        liveStatus.textContent = '直播未开始';
        startLiveBtn.textContent = '开始直播';
        startLiveBtn.style.background = accent;
    }
}
// 根据当前直播情境智能选择观众发言（主题/PK/连击/接上条，更真实）
function getSmartAIMessage() {
    const ls = player.liveStream;
    // 弹幕口令期间：约12%概率观众发出口令参与抽奖
    if (ls.danmakuPassword && ls.danmakuPassword.endTime > Date.now() && Math.random() < 0.12)
        return ls.danmakuPassword.word + "！支持主播！";
    const themes = liveStreamSystem.themeMessages;
    const themeId = (ls.currentTheme !== undefined && ls.currentTheme !== null) ? ls.currentTheme : 0;
    const pool = [];
    // 10% 概率接上一条弹幕（+1、同上）
    if (liveStreamSystem.lastAiDanmaku && Math.random() < 0.1) {
        const follow = liveStreamSystem.followUpMessages;
        if (follow && follow.length) pool.push({ w: 3, msg: follow[Math.floor(Math.random() * follow.length)] });
    }
    // 当前主题情境化发言 30%
    if (themes[themeId] && themes[themeId].length && Math.random() < 0.3) {
        pool.push({ w: 5, msg: themes[themeId][Math.floor(Math.random() * themes[themeId].length)] });
    }
    // PK 中 20%
    if (ls.pkActive && liveStreamSystem.pkMessages && liveStreamSystem.pkMessages.length && Math.random() < 0.2) {
        pool.push({ w: 4, msg: liveStreamSystem.pkMessages[Math.floor(Math.random() * liveStreamSystem.pkMessages.length)] });
    }
    // 礼物连击 15%
    if ((ls.giftCombo || 0) >= 3 && liveStreamSystem.giftComboMessages && liveStreamSystem.giftComboMessages.length && Math.random() < 0.15) {
        pool.push({ w: 4, msg: liveStreamSystem.giftComboMessages[Math.floor(Math.random() * liveStreamSystem.giftComboMessages.length)] });
    }
    // 通用池
    const general = liveStreamSystem.aiMessages;
    if (general && general.length) pool.push({ w: 1, msg: general[Math.floor(Math.random() * general.length)] });
    if (pool.length === 0) return "支持主播！";
    let total = 0;
    for (let i = 0; i < pool.length; i++) total += pool[i].w;
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
        r -= pool[i].w;
        if (r <= 0) return pool[i].msg;
    }
    return pool[pool.length - 1].msg;
}

// 根据玩家发言内容返回AI观众回复（关键词匹配，多条候选）
function getAIReplyToPlayer(playerMessage) {
    const msg = (playerMessage || "").trim();
    if (!msg) return liveStreamSystem.defaultReplies[Math.floor(Math.random() * liveStreamSystem.defaultReplies.length)];
    const rules = liveStreamSystem.replyRules;
    const def = liveStreamSystem.defaultReplies;
    for (let i = 0; i < rules.length; i++) {
        const r = rules[i];
        for (let k = 0; k < r.keywords.length; k++) {
            if (msg.indexOf(r.keywords[k]) !== -1 && r.responses && r.responses.length) {
                return r.responses[Math.floor(Math.random() * r.responses.length)];
            }
        }
    }
    return def[Math.floor(Math.random() * def.length)];
}

function generateAIDanmaku() {
    if (!player.liveStream.isLive || !danmakuSystem.active) {
        liveStreamSystem.danmakuGeneratorActive = false;
        return;
    }
    
const minInterval = 10000 - (danmakuSystem.density * 800);
    const maxInterval = 20000 - (danmakuSystem.density * 1500);
    const interval = Math.random() * (maxInterval - minInterval) + minInterval;
    
    liveStreamSystem.danmakuGeneratorTimer = setTimeout(() => {
        if (player.liveStream.isLive && player.liveStream.viewers.length > 0) {
            const viewerIndex = Math.floor(Math.random() * player.liveStream.viewers.length);
            const viewer = player.liveStream.viewers[viewerIndex];
            const message = getSmartAIMessage();
            liveStreamSystem.lastAiDanmaku = { sender: viewer.name, message: message };
            addDanmakuMessageq(viewer.name, message, "viewer");
            
            // 有小概率打赏
            if (Math.random() < 0.05) {
                generateDonation(viewer);
            }
        }
        
        // 递归调用前检查直播状态
        if (player.liveStream.isLive) {
            generateAIDanmaku();
        } else {
            liveStreamSystem.danmakuGeneratorActive = false;
        }
    }, interval);
}

// 开始直播
function startLiveStream() {
    if (player.liveStream.isLive) {
        stopLiveStream();
        return;
    }
    clearLiveStreamTimersOnly();
     // 清除可能存在的弹幕生成器
    if (liveStreamSystem.danmakuGeneratorActive) {
        clearDanmakuGenerator();
    }
    player.liveStream.isLive = true;
    player.liveStream.lastLiveStart = Date.now();
    player.liveStream.viewers = [];
    player.liveStream.donationCountThisLive = 0;
    player.liveStream.guardList = [];
    player.liveStream.roseThisLive = 0;
    liveStreamSystem.maxViewers = getEffectiveMaxViewers();
    // 添加初始观众
    addViewers(liveStreamSystem.maxViewers*0.86);
    // 直播挑战：随机一个本场目标
    pickNextLiveChallenge();
    // 观众心愿单：5分钟后可能触发
    player.liveStream.wishList = null;
    player.liveStream.danmakuPassword = null;
    player.liveStream.danmakuPasswordParticipants = [];
    // 弹幕口令定时器（每10分钟一轮）
    if (player.liveStream.danmakuPasswordInterval) { clearInterval(player.liveStream.danmakuPasswordInterval); player.liveStream.danmakuPasswordInterval = null; }
    player.liveStream.danmakuPasswordInterval = registerInterval(triggerDanmakuPassword, 600000);
    setTimeout(triggerDanmakuPassword, 30000); // 30秒后第一次口令
    // 心愿单定时器（每5分钟可能刷新）
    if (player.liveStream.wishListInterval) { clearInterval(player.liveStream.wishListInterval); player.liveStream.wishListInterval = null; }
    player.liveStream.wishListInterval = registerInterval(maybeTriggerWishList, 300000);
    setTimeout(maybeTriggerWishList, 60000); // 1分钟后可能出心愿单
     
    // 开始观众和互动定时器
    player.liveStream.viewerInterval = registerInterval(updateViewers, 20000);
    player.liveStream.interactionInterval = registerInterval(generateInteractions, 20000);
    player.liveStream.themeInterval = registerInterval(checkLiveTheme, 60000);
    player.liveStream.eventInterval = registerInterval(triggerRandomLiveEvent, 60000);
    player.liveStream.voteInterval = registerInterval(triggerVote, 180000);
    player.liveStream.fortuneInterval = registerInterval(triggerFortuneBag, 120000);
    player.liveStream.heatInterval = registerInterval(decayHeat, 10000);
    player.liveStream.fortuneBagNextTime = Date.now() + 120000;
    player.liveStream.overlayInterval = registerInterval(updateLiveStreamOverlay, 3000);
    tryStartRandomTheme();
   initDanmakuSystem();
 // 启动弹幕生成器（确保只启动一次）
    if (!liveStreamSystem.danmakuGeneratorActive) {
        generateAIDanmaku();
        liveStreamSystem.danmakuGeneratorActive = true;
    }
    updateLiveStreamUI();
    addDanmakuMessageq("系统", "直播开始了！欢迎大家来到直播间！", "system");
    logAction("开始直播", "success");
}

/** 清除直播相关定时器（无论 isLive 状态，用于开播前清理遗留 interval） */
function clearLiveStreamTimersOnly() {
    var ls = player.liveStream;
    if (!ls) return;
    function stopOne(key) {
        if (!ls[key]) return;
        if (typeof unregisterInterval === 'function') unregisterInterval(ls[key]);
        else clearInterval(ls[key]);
        ls[key] = null;
    }
    stopOne('viewerInterval');
    stopOne('interactionInterval');
    stopOne('themeInterval');
    stopOne('eventInterval');
    stopOne('voteInterval');
    stopOne('fortuneInterval');
    stopOne('heatInterval');
    stopOne('pkInterval');
    stopOne('voteInterval2');
    stopOne('overlayInterval');
    stopOne('danmakuPasswordInterval');
    stopOne('wishListInterval');
    if (ls.danmakuPasswordTimer) { clearTimeout(ls.danmakuPasswordTimer); ls.danmakuPasswordTimer = null; }
    if (ls.lotteryEndTimer) { clearTimeout(ls.lotteryEndTimer); ls.lotteryEndTimer = null; }
    if (ls.guessEndTimer) { clearTimeout(ls.guessEndTimer); ls.guessEndTimer = null; }
    if (ls.connectMcTimer) { clearTimeout(ls.connectMcTimer); ls.connectMcTimer = null; }
    clearDanmakuGenerator();
}

// 停止直播
function stopLiveStream() {
    clearLiveStreamTimersOnly();
    if (!player.liveStream.isLive) return;
    
    player.liveStream.isLive = false;
    const liveTime = Date.now() - player.liveStream.lastLiveStart;
    player.liveStream.totalLiveTime += liveTime;
    
    // 计算经验
    const expGain = Math.floor(liveTime / 1000) * player.liveStream.expMultiplier;
    player.liveStream.exp += expGain;
     liveStreamSystem.maxViewers = getEffectiveMaxViewers();
     // 检查升级
    checkLiveLevelUp();
    
    player.liveStream.lotteryEndTime = 0;
    player.liveStream.guessActive = false;
    // 清空观众
    player.liveStream.viewers = [];
    clearDanmaku();
    
    updateLiveStreamUI();
    addDanmakuMessageq("系统", "直播已结束，感谢观看！", "system");
    
    logAction(`结束直播，获得 ${expGain} 直播经验`, "success");
    
}
function clearDanmakuGenerator() {
    if (liveStreamSystem.danmakuGeneratorTimer) {
        clearTimeout(liveStreamSystem.danmakuGeneratorTimer);
        liveStreamSystem.danmakuGeneratorTimer = null;
    }
    liveStreamSystem.danmakuGeneratorActive = false;
}



// 成就/宠物/商店等系统
        function checkAchievement(rarity) {
    if (!player.achievements[rarity]) {
        player.achievements[rarity] = true;
        const reward = achievementRewards[rarity];
        if (reward) {
            player.gpsMultiplier += reward.gpsMultiplier;
            logAction(`成就达成：获得${equipmentTypes[rarity].name}装备，GPS奖励 +${reward.gpsMultiplier * 100}%`, 'success');
            updateAchievementsDisplay();
        }
    }
}

        // 更新成就显示
       function updateAchievementsDisplay() {
    const achievementsContainer = document.getElementById('achievements');
    const unlockedAchievements = Object.entries(player.achievements)
        .filter(([key, unlocked]) => unlocked)
        .map(([key]) => key);

    // 定义排序优先级
    const achievementOrder = [
     'common', 'rare', 'epic', 'legendary',
     'ancient', 'divine', 'arcane', 'celestial',
     'infernal', 'astral', 'primeval', 'transcendental',
     'quantum', 'ultimate', 'chaos', 'eternal',
     'void', 'genesis', 'divineRealm', 'apocalypse', 'yeyu1', 'yeyu2', 'yeyu3', 'yeyu4', 'yeyu5', 'yeyu6','yeyu7', 'yeyu8', 'yeyu9', 'yeyu10', 'yeyu11', 'yeyu12','yeyu13', 'yeyu14', 'yeyu15', 'yeyu16', 'yeyu17', 'yeyu18','yeyu19', 'yeyu20', 'yeyu21', 'yeyu22', 'yeyu23', 'yeyu24', 
    'common_chest_100',
    'common_chest_10000',
    'common_chest_1000000',
    'common_chest_10000000',
    'common_chest_100000000',
    'advanced_chest_100',
    'advanced_chest_10000',
    'advanced_chest_1000000',
    'advanced_chest_10000000',
    'advanced_chest_100000000',
    'rare_chest_100',
    'rare_chest_10000',
    'rare_chest_1000000',
    'rare_chest_10000000',
    'rare_chest_100000000',
    'epic_chest_100',
    'epic_chest_10000',
    'epic_chest_1000000',
    'epic_chest_10000000',
    'epic_chest_100000000',
    'legendary_chest_100',
    'legendary_chest_10000',
    'legendary_chest_1000000',
    'legendary_chest_10000000',
    'legendary_chest_100000000',
    'chaos_chest_100',
    'chaos_chest_10000',
    'chaos_chest_1000000',
    'chaos_chest_10000000',
    'chaos_chest_100000000',
    'apocalypse_chest_100',
    'apocalypse_chest_10000',
    'apocalypse_chest_1000000',
    'apocalypse_chest_10000000',
    'apocalypse_chest_100000000',
    'yeyu1_chest_100',
    'yeyu1_chest_10000',
    'yeyu1_chest_1000000',
    'yeyu1_chest_10000000',
    'yeyu1_chest_100000000',
    'yeyu2_chest_100',
    'yeyu2_chest_10000',
    'yeyu2_chest_1000000',
    'yeyu2_chest_10000000',
    'yeyu2_chest_100000000',
    'yeyu3_chest_100',
    'yeyu3_chest_10000',
    'yeyu3_chest_1000000',
    'yeyu3_chest_10000000',
    'yeyu3_chest_100000000',
    'yeyu4_chest_100',
    'yeyu4_chest_10000',
    'yeyu4_chest_1000000',
    'yeyu4_chest_10000000',
    'yeyu4_chest_100000000',
    'yeyu5_chest_100',
    'yeyu5_chest_10000',
    'yeyu5_chest_1000000',
    'yeyu5_chest_10000000',
    'yeyu5_chest_100000000',
    'yeyu6_chest_100',
    'yeyu6_chest_10000',
    'yeyu6_chest_1000000',
    'yeyu6_chest_10000000',
    'yeyu6_chest_100000000',
    'yeyu7_chest_100',
    'yeyu7_chest_10000',
    'yeyu7_chest_1000000',
    'yeyu7_chest_10000000',
    'yeyu7_chest_100000000',
    'yeyu8_chest_100',
    'yeyu8_chest_10000',
    'yeyu8_chest_1000000',
    'yeyu8_chest_10000000',
    'yeyu8_chest_100000000',
  'max_stage_10', 'max_stage_30', 'max_stage_60', 'max_stage_90',
   'max_stage_120', 'max_stage_200', 'max_stage_300', 'max_stage_400',
   'max_stage_500', 'max_stage_600', 'max_stage_700', 'max_stage_800',
   'max_stage_900', 'max_stage_1000',
 'thunderKirin_10',
    'thunderKirin_50',
    'thunderKirin_100',
    'chaosTaotie_10',
    'chaosTaotie_50',
    'chaosTaotie_100',
    'netherQiongqi_10',
    'netherQiongqi_50',
    'netherQiongqi_100',
    'abyssKun_10',
    'abyssKun_50',
    'abyssKun_100',
    'primordialZhuLong_10',
    'primordialZhuLong_50',
    'primordialZhuLong_100',
    'wanJunSuanNi_10',
    'wanJunSuanNi_50',
    'wanJunSuanNi_100',
    'yanYuBiAn_10',
    'yanYuBiAn_50',
    'yanYuBiAn_100',
    'yuyu1_10',
    'yuyu1_50',
    'yuyu1_100',
    'yuyu2_10',
    'yuyu2_50',
    'yuyu2_100',
    'yuyu3_10',
    'yuyu3_50',
    'yuyu3_100',
    'yuyu4_10',
    'yuyu4_50',
    'yuyu4_100',
    'yuyu5_10',
    'yuyu5_50',
    'yuyu5_100',
    'yuyu6_10',
    'yuyu6_50',
    'yuyu6_100',
    'yuyu7_10',
    'yuyu7_50',
    'yuyu7_100',
    'yuyu8_10',
    'yuyu8_50',
    'yuyu8_100',
     'year1_10',
    'year10_10',
    'year100_10',
    'year1000_10',
    'year10000_10',
    'year100000_10',
    'year1000000_10',
    'year10000000_10',
    'year100000000_10',
    'year1_100',
    'year10_100',
    'year100_100',
    'year1000_100',
    'year10000_100',
    'year100000_100',
    'year1000000_100',
    'year10000000_100',
    'year100000000_100',
    'year1_1000',
    'year10_1000',
    'year100_1000',
    'year1000_1000',
    'year10000_1000',
    'year100000_1000',
    'year1000000_1000',
    'year10000000_1000',
    'year100000000_1000',
    'year1_10000',
    'year10_10000',
    'year100_10000',
    'year1000_10000',
    'year10000_10000',
    'year100000_10000',
    'year1000000_10000',
    'year10000000_10000',
    'year100000000_10000',
    'year2_10',
    'year2_100',
    'year2_1000',
    'year2_10000',
    'year3_10',
    'year3_100',
    'year3_1000',
    'year3_10000',
    'year4_10',
    'year4_100',
    'year4_1000',
    'year4_10000',
    'year5_10',
    'year5_100',
    'year5_1000',
    'year5_10000',
    'year6_10',
    'year6_100',
    'year6_1000',
    'year6_10000',
    'year7_10',
    'year7_100',
    'year7_1000',
    'year7_10000',
    'year8_10',
    'year8_100',
    'year8_1000',
    'year8_10000',
    'year9_10',
    'year9_100',
    'year9_1000',
    'year9_10000',
    'year11_10',
    'year11_100',
    'year11_1000',
    'year11_10000',
    'year12_10',
    'year12_100',
    'year12_1000',
    'year12_10000',
    'year13_10',
    'year13_100',
    'year13_1000',
    'year13_10000',
    'year14_10',
    'year14_100',
    'year14_1000',
    'year14_10000',
    'year15_10',
    'year15_100',
    'year15_1000',
    'year15_10000',
    'year16_10',
    'year16_100',
    'year16_1000',
    'year16_10000',
    'year17_10',
    'year17_100',
    'year17_1000',
    'year17_10000',
    'year18_10',
    'year18_100',
    'year18_1000',
    'year18_10000',
    'year19_10',
    'year19_100',
    'year19_1000',
    'year19_10000',
    'year20_10',
    'year20_100',
    'year20_1000',
    'year20_10000',
    'year21_10',
    'year21_100',
    'year21_1000',
    'year21_10000',
    'year22_10',
    'year22_100',
    'year22_1000',
    'year22_10000',
    'year23_10',
    'year23_100',
    'year23_1000',
    'year23_10000',
    'year24_10',
    'year24_100',
    'year24_1000',
    'year24_10000',
    'year25_10',
    'year25_100',
    'year25_1000',
    'year25_10000',
    'year26_10',
    'year26_100',
    'year26_1000',
    'year26_10000',
    'year27_10',
    'year27_100',
    'year27_1000',
    'year27_10000',
    'year28_10',
    'year28_100',
    'year28_1000',
    'year28_10000',
    'year29_10',
    'year29_100',
    'year29_1000',
    'year29_10000',
    'year30_10',
    'year30_100',
    'year30_1000',
    'year30_10000',
    'year31_10',
    'year31_100',
    'year31_1000',
    'year31_10000',
    'year32_10',
    'year32_100',
    'year32_1000',
    'year32_10000',
    'year33_10',
    'year33_100',
    'year33_1000',
    'year33_10000',
    'year34_10',
    'year34_100',
    'year34_1000',
    'year34_10000',
    'year35_10',
    'year35_100',
    'year35_1000',
    'year35_10000',
    'year36_10',
    'year36_100',
    'year36_1000',
    'year36_10000',
    'year37_10',
    'year37_100',
    'year37_1000',
    'year37_10000',
   'reincarnation_10', 'reincarnation_100', 
   'reincarnation_1000', 'reincarnation_10000', 'world_boss_1st', 'world_boss_top5', 'world_boss_top10', 'world_boss_participant'
    ];

    // 按定义顺序过滤并排序已解锁成就
    const sortedAchievements = achievementOrder
        .filter(key => unlockedAchievements.includes(key))
        .map(key => ({
            key,
            ...achievementRewards[key]
        }));

    achievementsContainer.innerHTML = Object.entries(player.achievements)
        .filter(([key, value]) => value && achievementRewards[key]) // 只显示已解锁的成就
        .map(([key, value]) => {
            const reward = achievementRewards[key];
            return `<div class="achievement unlocked">${reward.description}</div>`;
        })
        .join('');
}

        // 切换装备、道具和收藏物页面
        function switchTab(tab) {
            document.getElementById('equipmentList').style.display = tab === 'equipment' ? 'block' : 'none';
            document.getElementById('itemList').style.display = tab === 'items' ? 'block' : 'none';
            document.getElementById('collectionList').style.display = tab === 'collections' ? 'block' : 'none';
            document.getElementById('reincarnationList').style.display = tab === 'reincarnation' ? 'block' : 'none';
            document.getElementById('petList').style.display = tab === 'pets' ? 'block' : 'none';
            document.getElementById('stockList').style.display = tab === 'stocks' ? 'block' : 'none';
            document.getElementById('lotteryList').style.display = tab === 'lottery' ? 'block' : 'none';
            document.getElementById('bankList').style.display = tab === 'bank' ? 'block' : 'none';
            document.getElementById('dungeonEquipmentList').style.display = tab === 'dungeonEquipment' ? 'block' : 'none'; // 新增副本装备页面
            document.getElementById('soulRingList').style.display = tab === 'soulRings' ? 'block' : 'none'; // 新增魂环页面
            document.getElementById('playerAttributesList').style.display = tab === 'playerAttributes' ? 'block' : 'none';
            document.getElementById('techniquesList').style.display = tab === 'techniques' ? 'block' : 'none';
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            var oldTab = document.querySelector(`.tab[onclick="switchTab('${tab}')"]`);
            if (oldTab) oldTab.classList.add('active');
            document.querySelectorAll('.tab-item-new').forEach(t => t.classList.remove('active'));
            var newTab = document.querySelector(`.tab-item-new[onclick="switchTab('${tab}')"]`);
            if (newTab) newTab.classList.add('active');
            if (tab === 'items') updateItemDisplay();
            if (tab === 'collections') updateCollectionDisplay();
            if (tab === 'reincarnation') updateReincarnationDisplay();
            if (tab === 'pets') updatePetDisplay();
            if (tab === 'stocks') updateStockDisplay();
            if (tab === 'bank') updateBankDisplay();
            if (tab === 'dungeonEquipment') updateDungeonEquipmentDisplay(); // 新增：更新副本装备显示
            if (tab === 'soulRings') updateSoulRingDisplay(); // 新增：更新魂环显示
            if (tab === 'techniques') updateTechniquesDisplay();
            if (tab === 'playerAttributes') updatePlayerAttributesDisplay();
        }

        // 道具列表刷新见全局 updateItemDisplay（#itemContainer）

       // 重置收藏物显示
function resetCollectionDisplay() {
    resetCollectionEffects();
    logAction("已完全重置收藏物效果计算", "success");
    // 重新计算所有收藏物效果（确保加法叠加）
    Object.keys(player.collections).forEach(collectionType => {
        const ce = collectionEffects[collectionType];
        if (!ce) return;
        const effect = ce.effect;
        const count = player.collections[collectionType];
        const totalEffect = count * effect;

        player.equipment.forEach(eq => {
            eq.collectionMultiplier = totalEffect;
        });
    });

    updateCollectionDisplay();
    logAction("已重置收藏物效果计算", "info");
}

// 更新后的收藏物显示函数
function updateCollectionDisplay() {
    const container = document.getElementById("collectionInfoContainer");
    if (!container) return;
    
    // 计算全部收藏物总加成
    const totalEffect = player.equipment.length > 0 ? 
        player.equipment[0].collectionMultiplier * 100 : 0;
    
    // 顶部总加成显示（保持不变）
    container.innerHTML = `
        <div style="margin-bottom: 15px; font-weight: bold;">
            当前全部收藏物总加成: +${totalEffect.toFixed(0)}%
        </div>
    `;
    
    // 每个收藏物的详细显示（增加总效果）
    container.innerHTML += Object.entries(player.collections)
        .map(([key, value]) => {
            const collection = collectionEffects[key];
            if (!collection) {
                return `<div style="margin-bottom:10px;color:#f44336;">${key}: ${value}（未配置收藏物）</div>`;
            }
            const singleEffect = collection.effect * 100;
            const totalEffect = value * singleEffect;
            
            return `
                <div style="margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                    <strong>${collection.name}</strong>: 
                    <span>数量: ${value}</span> | 
                    <span>单个效果: +${singleEffect.toFixed(0)}%</span> |
                    <span>总效果: +${totalEffect.toFixed(0)}%</span>
                    <div style="color:#666; font-size:0.9em; margin-top: 3px;">${collection.description}</div>
                </div>
            `;
        })
        .join('');
}
        // 按等级校准转生属性升级消耗，修复历史异常存档导致的“等级与消耗不匹配”
        function syncReincarnationStatsWithLevels() {
    if (!player) return;
    player.reincarnationCoin = bigSciToStorageValue(player.reincarnationCoin);
    if (!player.reincarnationStats || typeof player.reincarnationStats !== 'object') {
        player.reincarnationStats = {};
    }
    const defaults = ['gpsBonus', 'equipmentLevelBonus', 'clickLimitBonus'];
    defaults.forEach((stat) => {
        if (!player.reincarnationStats[stat] || typeof player.reincarnationStats[stat] !== 'object') {
            player.reincarnationStats[stat] = { level: 0, cost: 1 };
        }
        const statData = player.reincarnationStats[stat];
        statData.level = Math.max(0, Math.floor(Number(statData.level) || 0));
        const factor = stat === 'equipmentLevelBonus' ? 5 : 1.2;
        let expectedCost = 1;
        for (let i = 0; i < statData.level; i++) {
            expectedCost = multiplyBigByFinite(expectedCost, factor);
        }
        expectedCost = bigSciToStorageValue(expectedCost);
        if (cmpBigSci(statData.cost, expectedCost) !== 0) {
            statData.cost = expectedCost;
        } else {
            statData.cost = bigSciToStorageValue(statData.cost);
        }
    });
}

        // 更新转生属性显示
        function updateReincarnationDisplay() {
    syncReincarnationStatsWithLevels();
    const reincarnationContainer = document.getElementById('reincarnationList');
    const gpsCost = formatSci(bigSciToStorageValue(player.reincarnationStats.gpsBonus.cost));
    const eqCost = formatSci(bigSciToStorageValue(player.reincarnationStats.equipmentLevelBonus.cost));
    const clickCost = formatSci(bigSciToStorageValue(player.reincarnationStats.clickLimitBonus.cost));
    reincarnationContainer.innerHTML = `
        <div>
            <h3>转生属性</h3>
            <div>
                <strong>收益加成</strong>: 每级装备属性 +${player.reincarnationStats.gpsBonus.level * 100}% (等级: ${player.reincarnationStats.gpsBonus.level})
                <button onclick="upgradeReincarnationStat('gpsBonus')">升级 (消耗 ${gpsCost} 转生币)</button>
            </div>
            <div>
                <strong>装备等级</strong>: 全部装备初始等级 +${player.reincarnationStats.equipmentLevelBonus.level * 200} 级 (等级: ${player.reincarnationStats.equipmentLevelBonus.level})
                <button onclick="upgradeReincarnationStat('equipmentLevelBonus')">升级 (消耗 ${eqCost} 转生币)</button>
            </div>
            <div>
                <strong>点击上限</strong>: 每秒点击上限 +${player.reincarnationStats.clickLimitBonus.level} 次 (等级: ${player.reincarnationStats.clickLimitBonus.level})
                <button onclick="upgradeReincarnationStat('clickLimitBonus')">升级 (消耗 ${clickCost} 转生币)</button>
            </div>
        </div>
    `;
}
   function updateTechniquesDisplay() {
    const container = document.getElementById('techniquesContainer');
    
    // 按预定顺序筛选已获得的功法
    const sortedTechniques = TECHNIQUE_DISPLAY_ORDER
        .filter(id => player.techniques[id])
        .map(id => {
            const tech = techniqueConfig[id];
            return {
                id,
                name: tech.name,
                level: player.techniques[id],
                description: tech.description,
                effect: tech.effect,
                type: tech.type
            };
        });

    // 生成HTML
    container.innerHTML = sortedTechniques.map(tech => `
        <div class="technique ${tech.type}">
            <h4>${tech.name} [Lv.${tech.level}]</h4>
            <p>${tech.description}</p>
            <div class="tech-effect">
                当前效果: ${
                    tech.type === 'multiAttack' 
                        ? `攻击次数+${tech.level * tech.effect}`
                        : `${(tech.level * tech.effect * 100).toFixed(tech.type === 'critRate' ? 4 : 4)}%`
                }
            </div>
        </div>
    `).join('');
}

// 添加功法秘笈获取函数
function addTechnique(type) {
    if (player.techniques[type]) {
        player.techniques[type]++;
    } else {
        player.techniques[type] = 1;
    }
    logAction(`获得功法: ${techniqueConfig[type].name} Lv.${player.techniques[type]}`, 'success');
    updateTechniqueBonuses(); // 新增调用
    updateTechniquesDisplay();
}

function calculateTechniqueBonuses() {
    const bonuses = {
        health: 0,
        attack: 0,
        critRate: 0,
        critDamage: 0,
        multiAttack: 0
    };

    // 计算所有功法加成
    Object.entries(player.techniques).forEach(([techId, level]) => {
        const tech = techniqueConfig[techId];
        if (tech && tech.effect && tech.type && bonuses[tech.type] !== undefined) {
            // 获取宗门功法等级加成
            const sectLevel = (player.sect && player.sect.techniques && player.sect.techniques[techId]) || 0;
            const sectMultiplier = 1 + (sectLevel * 2); // 每级增加2倍效果
            
            // 应用宗门加成
            bonuses[tech.type] += level * tech.effect * sectMultiplier;
        }
    });

    return bonuses;
}
        // 重置宠物页面
function resetPetDisplay() {
    // 保留宠物的等级和升级成本
    const petData = {};
    Object.keys(player.pets).forEach(petKey => {
        petData[petKey] = {
            level: player.pets[petKey].level, // 保留等级
            cost: player.pets[petKey].cost    // 保留升级成本
        };
    });

    function keepPetCost(v) { return bigSciToStorageValue(v != null ? v : 1); }
    // 重置宠物页面（重新生成宠物数据）
    player.pets = {
        thunderKirin: { level: petData.thunderKirin?.level || 0, cost: keepPetCost(petData.thunderKirin?.cost), multiplier: 0.10 },
        chaosTaotie: { level: petData.chaosTaotie?.level || 0, cost: keepPetCost(petData.chaosTaotie?.cost), multiplier: 0.30 },
        netherQiongqi: { level: petData.netherQiongqi?.level || 0, cost: keepPetCost(petData.netherQiongqi?.cost), multiplier: 0.90 },
        abyssKun: { level: petData.abyssKun?.level || 0, cost: keepPetCost(petData.abyssKun?.cost), multiplier: 2.70 },
        primordialZhuLong: { level: petData.primordialZhuLong?.level || 0, cost: keepPetCost(petData.primordialZhuLong?.cost), multiplier: 8.10 },
        wanJunSuanNi: { level: petData.wanJunSuanNi?.level || 0, cost: keepPetCost(petData.wanJunSuanNi?.cost), multiplier: 24.30 },
        yanYuBiAn: { level: petData.yanYuBiAn?.level || 0, cost: keepPetCost(petData.yanYuBiAn?.cost), multiplier: 72.90 },
       yuyu1: { level: petData.yuyu1?.level || 0, cost: keepPetCost(petData.yuyu1?.cost), multiplier: 218.70 },
        yuyu2: { level: petData.yuyu2?.level || 0, cost: keepPetCost(petData.yuyu2?.cost), multiplier: 656.10 },
       yuyu3: { level: petData.yuyu3?.level || 0, cost: keepPetCost(petData.yuyu3?.cost), multiplier: 1968.30 },
        yuyu4: { level: petData.yuyu4?.level || 0, cost: keepPetCost(petData.yuyu4?.cost), multiplier: 5904.90 },
       yuyu5: { level: petData.yuyu5?.level || 0, cost: keepPetCost(petData.yuyu5?.cost), multiplier: 17714.70 },
       yuyu6: { level: petData.yuyu6?.level || 0, cost: keepPetCost(petData.yuyu6?.cost), multiplier: 53144.10 },
        yuyu7: { level: petData.yuyu7?.level || 0, cost: keepPetCost(petData.yuyu7?.cost), multiplier: 159432.30 },
       yuyu8: { level: petData.yuyu8?.level || 0, cost: keepPetCost(petData.yuyu8?.cost), multiplier: 478296.90 }
    };

    // 更新宠物页面显示
    updatePetDisplay();
    logAction('宠物页面已重置，等级和升级消耗保留', 'success');
}

// 按等级校准宠物升级消耗，修复历史异常存档导致的“等级与消耗不匹配”
function syncPetCostsWithLevels() {
    if (!player || !player.pets) return;

    function calcExpectedPetCost(level) {
        const lv = Math.max(0, Math.floor(Number(level) || 0));
        let cost = 1;
        for (let i = 0; i < lv; i++) {
            cost = multiplyBigByFinite(cost, 2);
        }
        return bigSciToStorageValue(cost);
    }

    Object.keys(petConfig || {}).forEach((petKey) => {
        if (!player.pets[petKey]) return;
        const pet = player.pets[petKey];
        pet.level = Math.max(0, Math.floor(Number(pet.level) || 0));
        const expectedCost = calcExpectedPetCost(pet.level);
        if (cmpBigSci(pet.cost, expectedCost) !== 0) {
            pet.cost = expectedCost;
        } else {
            pet.cost = bigSciToStorageValue(pet.cost);
        }
    });
}

// 更新宠物页面显示
function updatePetDisplay() {
    syncPetCostsWithLevels();
    const petContainer = document.getElementById('petContainer');
    if (!petContainer) {
        console.error('宠物容器未找到！');
        return;
    }
    
    // 货币类型到中文名称的映射
    const currencyNames = {
        gold: '金币',
        diamond: '钻石',
        titanium: '钛晶石',
        starstone: '星耀石',
        cosmicstone: '宇宙石',
        superstone: '超能石',
        otherworldstone: '异界石',
        xingjiestone: '星界石',
        hundunstone: '混沌石',
        lingtone: '灵髓石',
        huangtone: '幻空石',
        mingtone: '冥源石',
        xutong: '虚空石',
        shitone: '时空石',
        weitone: '未来石'  
    };
    
    petContainer.innerHTML = Object.entries(player.pets)
        .map(([key, pet]) => {
            const config = petConfig[key];
            if (!config) {
                console.error(`宠物配置未找到：${key}`);
                return '';
            }
            const cost = bigSciToStorageValue(pet.cost);
            const formattedCost = formatSci(cost);
            
            // 获取货币中文名称
            const currencyName = currencyNames[config.currency] || config.currency;
            
            return `
                <div>
                    <strong>${config.name}</strong>: 等级 ${pet.level} - 装备属性加成 ${(pet.level * pet.multiplier * 100).toFixed(2)}%
                    <button onclick="upgradePet('${key}')">升级 (消耗 ${formattedCost} ${currencyName})</button>
                </div>
            `;
        })
        .join('');
}
    // 如果需要真正的重置功能（保留等级但刷新效果），可以添加这个函数
function resetTechniquesData() {
    showCustomConfirm('确定要重置功法数据吗？这将保留等级但重置所有效果计算！', (confirmed) => {
        if (confirmed) {
            // 重新计算所有功法效果
            updateTechniqueBonuses();
            updateTechniquesDisplay();
            logAction('功法数据已重置，效果重新计算', 'success');
        }
    });
}






   // 重置道具页面
function resetItemDisplay() {
    // 保留道具的数量
    const itemCounts = { ...player.items }; // 复制当前道具数量

    // 重置道具页面（重新生成道具数据）
    player.items = {
        primaryGem: itemCounts.primaryGem || 0,
        advancedGem: itemCounts.advancedGem || 0,
        superiorGem: itemCounts.superiorGem || 0,
        divineGem: itemCounts.divineGem || 0,
        vipPower: itemCounts.vipPower || 0,
        refineStone: itemCounts.refineStone || 0,
        rose: itemCounts.rose || 0,
        companionKey: itemCounts.companionKey || 0,
         rebornDan: itemCounts.rebornDan || 0,
      baitCount: itemCounts.baitCount || 0,
   rootDetector: itemCounts.rootDetector || 0,
 bloodlineDetector: itemCounts.bloodlineDetector || 0,
 advanceStone: itemCounts.advanceStone || 0, 
 primaryGemq: itemCounts.primaryGemq || 0, 
  zongmen: itemCounts.zongmen || 0, 
roseq: itemCounts.roseq || 0,
 yuzhou1: itemCounts.yuzhou1 || 0, 
  yuzhou2: itemCounts.yuzhou2 || 0, 
  yuzhou3: itemCounts.yuzhou3 || 0, 
  yuzhou4: itemCounts.yuzhou4 || 0,
  banlv1: itemCounts.banlv1 || 0,
  banlv2: itemCounts.banlv2 || 0,
  banlv3: itemCounts.banlv3 || 0,
  banlv4: itemCounts.banlv4 || 0,
  banlv5: itemCounts.banlv5 || 0,
  banlv6: itemCounts.banlv6 || 0,
  banlv7: itemCounts.banlv7 || 0,
  banlv8: itemCounts.banlv8 || 0,
  banlv9: itemCounts.banlv9 || 0,
  zhiye1: itemCounts.zhiye1 || 0,
  chiban1: itemCounts.chiban1 || 0,
  zuoqi1: itemCounts.zuoqi1 || 0,
  fuben1: itemCounts.fuben1 || 0,
  shenshou1: itemCounts.shenshou1 || 0,
 lawPowerMaterial: itemCounts.lawPowerMaterial || 0,
 fuwen1: itemCounts.fuwen1 || 0,
  fuben2: itemCounts.fuben2 || 0,
  danyao1: itemCounts.danyao1 || 0,
  danyao2: itemCounts.danyao2 || 0,
  danyao3: itemCounts.danyao3 || 0,
  danyao4: itemCounts.danyao4 || 0,
  danyao5: itemCounts.danyao5 || 0,
  fubeng1: itemCounts.fubeng1 || 0,
  cultivationpill: itemCounts.cultivationpill || 0,
  seed_herb1: itemCounts.seed_herb1 || 0,
seed_herb2: itemCounts.seed_herb2 || 0,
seed_herb3: itemCounts.seed_herb3 || 0,
seed_herb4: itemCounts.seed_herb4 || 0,
seed_herb5: itemCounts.seed_herb5 || 0
    };

    // 更新道具页面显示
    updateItemDisplay();
    logAction('道具页面已重置，道具数量保留', 'success');
}

 window._startGameAfterLogin = function() {
    if (window._goldGameStartAfterLoginDone) return;
    window._goldGameStartAfterLoginDone = true;
    if (typeof loadGame === 'function') {
        loadGame({ skipLoadSave: !!window._goldGameSaveLoadedOk });
    } else {
        loadSave();
    }
    // 跑商：初始化主循环（更新城市价格、旅行状态）并启动自动贸易定时器
    if (player && player.reincarnationCount >= 1000) {
        if (!player.trading && typeof initTradingData === 'function') initTradingData();
        if (typeof initTradingSystem === 'function') initTradingSystem();
        if (player.trading && player.trading.autoTrade && player.trading.autoTrade.enabled && typeof startAutoTradeSystem === 'function') startAutoTradeSystem();
    }
      // 执行重置函数
    resetItemDisplay();
    updatePetDisplay();
    updateExplorationUI();
   updateDimensionUI();
    // 恢复自动扫荡状态显示
    var autoSweepEl = document.getElementById('autoSweepStatus');
    if (autoSweepEl && player && player.battle) autoSweepEl.textContent = player.battle.autoSweepEnabled ? '开' : '关';
    // 如果自动扫荡是开启状态，重新启动
    if (player && player.battle && player.battle.autoSweepEnabled && typeof startAutoSweep === 'function') {
        startAutoSweep();
    }
};
 window.onload = function() {
    window._startGameAfterLogin();
    if (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken() && typeof goldGameFamilyBonus === 'function') {
        goldGameFamilyBonus().catch(function() {});
    }
};
        function normalizeBankAndStockState() {
    if (!player) return;
    if (!player.bank || typeof player.bank !== 'object') {
        player.bank = { deposit: 0, interestRate: 0.002, lastInterestUpdate: Date.now() };
    }
    player.bank.deposit = bigSciToStorageValue(player.bank.deposit);
    // 勿用 !lastInterestUpdate：0 为非法时间戳，若用 ! 会每帧重置为 Date.now()，导致利息永远无法结算
    var _liu = Number(player.bank.lastInterestUpdate);
    if (!Number.isFinite(_liu) || _liu <= 0) player.bank.lastInterestUpdate = Date.now();

    if (!player.stockData || typeof player.stockData !== 'object') return;
    if (!Array.isArray(player.stockData.stocks)) player.stockData.stocks = [];
    player.stockData.stocks.forEach((stock) => {
        stock.shares = bigSciToStorageValue(stock.shares || 0);
        stock.basePrice = Number(stock.basePrice) || 1;
        stock.currentPrice = Math.max(0.01, Number(stock.currentPrice) || stock.basePrice || 1);
        stock.lastPrice = Math.max(0.01, Number(stock.lastPrice) || stock.currentPrice || stock.basePrice || 1);
        stock.avgCost = Math.max(0, Number(stock.avgCost) || 0);
    });
    if (!player.stockData.lastStockUpdate) player.stockData.lastStockUpdate = Date.now();
}

function getBigLog10(value) {
    const x = parseBigSci(value);
    if (!x || x.m <= 0) return -Infinity;
    return Math.log10(x.m) + Number(x.e);
}

        // 更新股票显示
        function updateStockDisplay() {
    normalizeBankAndStockState();
    const container = document.getElementById('stocksContainer');
    container.innerHTML = player.stockData.stocks.map((stock, index) => `
        <div class="stock-item" data-index="${index}" onclick="this.parentNode.querySelectorAll('.stock-item').forEach(e=>e.classList.remove('selected'));this.classList.add('selected')">
            <strong>${stock.name}</strong><br>
            当前价: ${stock.currentPrice.toFixed(2)} | 涨跌幅: ${((stock.currentPrice / stock.lastPrice - 1) * 100).toFixed(2)}%<br>
            持有: ${formatSci(stock.shares)}股 | 均价: ${stock.avgCost.toFixed(2)}<br>
            市值: ${formatSci(bigSciToStorageValue(mulBigSci(stock.shares, stock.currentPrice)))} | 收益率: ${stock.avgCost ? ((stock.currentPrice / stock.avgCost - 1) * 100).toFixed(2) + '%' : '-'}
        </div>
    `).join('');
}
/* 新手必看由顶栏「攻略」、更新日志由顶栏「日志」呼出，已移除原浮动按钮 */
        // 升级宠物
        function upgradePet(petKey) {
    const pet = player.pets[petKey];
    const config = petConfig[petKey];
    syncPetCostsWithLevels();
    if (spendCurrency(config.currency, pet.cost)) {
        pet.level++;
        pet.cost = multiplyBigByFinite(pet.cost, 2); // 每次升级成本翻倍（大数安全）

        // 检查宠物成就
        checkPetAchievements(petKey, pet.level);

        logAction(`升级 ${config.name} 成功！`, 'success');
        updatePetDisplay();
        updateDisplay();
    } else {
        const currencyName = ({ gold:'金币', diamond:'钻石', titanium:'钛晶石', starstone:'星耀石', cosmicstone:'宇宙石', superstone:'超能石', otherworldstone:'异界石', xingjiestone:'星界石', hundunstone:'混沌石', lingtone:'灵髓石', huangtone:'幻空石', mingtone:'冥源石', xutong:'虚空石', shitone:'时空石', weitone:'未来石' })[config.currency] || config.currency;
        logAction(`${currencyName}不足！`, "error");
    }
}

function checkPetAchievements(petKey, level) {
    const achievements = [
        { level: 10, key: `${petKey}_10` },
        { level: 50, key: `${petKey}_50` },
        { level: 100, key: `${petKey}_100` },
    ];

    achievements.forEach(({ level: targetLevel, key }) => {
        if (level >= targetLevel && !player.achievements[key]) {
            player.achievements[key] = true;
            const reward = achievementRewards[key];
            if (reward) {
                player.gpsMultiplier += reward.gpsMultiplier;
                logAction(`成就达成：${reward.description}，GPS奖励 +${reward.gpsMultiplier * 100}%`, 'success');
                updateAchievementsDisplay();
            }
        }
    });
}

        // 升级转生属性
        function upgradeReincarnationStat(stat) {
            syncReincarnationStatsWithLevels();
            const statData = player.reincarnationStats[stat];
            if (!statData) {
                logAction("转生属性不存在！", "error");
                return;
            }
            if (cmpBigSci(player.reincarnationCoin, statData.cost) >= 0) {
                player.reincarnationCoin = bigSciToStorageValue(subBigSci(player.reincarnationCoin, statData.cost));
                statData.level++;
                if (stat === 'equipmentLevelBonus') {
                    statData.cost = multiplyBigByFinite(statData.cost, 5); // 装备等级加成每次升级消耗增加5倍（大数安全）
                } else {
                    statData.cost = multiplyBigByFinite(statData.cost, 1.2); // 其他属性每次升级消耗增加20%（大数安全）
                }
                logAction(`升级 ${stat} 成功！`, 'success');
                updateReincarnationDisplay();
                updateDisplay();
            } else {
                logAction("转生币不足！", "error");
            }
        }

function resetGemEffects() {
    player.equipment.forEach(eq => {
        eq.gemMultiplier = 0;
    });
    logAction("已重置所有宝石效果", "info");
    updateDisplay();
}
        // 使用宝石升级装备
        function useGem(index, gemType) {
    const eq = player.equipment[index];
    const gem = itemEffects[gemType];
    
    if (player.items[gemType] > 0) {
        player.items[gemType]--;
        // 改为加法叠加
        eq.gemMultiplier += gem.effect;
        
        logAction(`使用${gem.name}升级 ${eq.name}装备 (当前加成: +${(eq.gemMultiplier * 100).toFixed(2)}%)`, 'success');
        updateDisplay();
    } else {
        logAction(`${gem.name}不足！`, "error");
    }
}
// 新增一键使用宝石函数
function useAllGems(index, gemType) {
    const eq = player.equipment[index];
    const gem = itemEffects[gemType];
    const count = player.items[gemType];
    
    if (count > 0) {
        // 计算总加成
        const totalEffect = gem.effect * count;
        // 减少宝石数量
        player.items[gemType] = 0;
        // 增加装备宝石加成
        eq.gemMultiplier += totalEffect;
        
        logAction(`一键使用${count}个${gem.name}升级 ${eq.name}装备 (当前总加成: +${(eq.gemMultiplier * 100).toFixed(2)}%)`, 'success');
        updateDisplay();
    } else {
        logAction(`${gem.name}不足！`, "error");
    }
}
        // 股票价格波动函数
        function updateStockPrices() {
            normalizeBankAndStockState();
            const now = Date.now();
            const elapsed = now - player.stockData.lastStockUpdate;
            const intervals = Math.floor(elapsed / (10 * 60 * 1000));

            player.stockData.stocks.forEach(stock => {
                for (let i = 0; i < intervals; i++) {
                    stock.lastPrice = stock.currentPrice;

                    // 计算当前价格与初始价格的比例
                    const priceRatio = stock.currentPrice / stock.basePrice;

                    // 根据比例动态调整涨跌概率（触底不再高概率必涨，避免玩家只抄底最便宜股）
                    let riseProbability; // 涨的概率
                    if (priceRatio <= 0.5) {
                        riseProbability = 0.55;  // 原0.8改为0.55，触底时涨跌更均衡
                    } else if (priceRatio <= 0.7) {
                        riseProbability = 0.52;
                    } else if (priceRatio <= 0.8) {
                        riseProbability = 0.5;
                    } else if (priceRatio <= 0.9) {
                        riseProbability = 0.48;
                    } else if (priceRatio >= 1.6) {
                        riseProbability = 0.35;
                    } else if (priceRatio >= 1.8) {
                        riseProbability = 0.25;
                    } else if (priceRatio >= 2.0) {
                        riseProbability = 0.1;
                    } else {
                        riseProbability = 0.5;
                    }

                    // 根据涨跌概率决定价格波动
                    const willRise = Math.random() < riseProbability; // 是否上涨
                    const fluctuation = willRise ? Math.random() * 0.1 : -Math.random() * 0.1; // 涨跌幅度
                    stock.currentPrice *= 1 + fluctuation;

                    // 价格保护：下限为 basePrice*0.3，上限为 basePrice*5（避免低价股无限涨、只买最便宜股无脑赚）
                    const minPrice = stock.basePrice * 0.3;
                    const maxPrice = stock.basePrice * 5;
                    if (stock.currentPrice < minPrice) stock.currentPrice = minPrice;
                    if (stock.currentPrice > maxPrice) stock.currentPrice = maxPrice;
                }
            });
            player.stockData.lastStockUpdate = now - (elapsed % (10 * 60 * 1000));
        }

        // 股票购买逻辑（使用 parseFloat 支持科学计数法如 1e20）
        function buyStock() {
            const amount = Math.max(0, parseFloat(document.getElementById('stockAmount').value) || 0);
            const selectedIndex = document.querySelector('.stock-item.selected')?.dataset.index;
            
            if(selectedIndex === undefined || !(amount > 0)) {
                logAction("请先选择股票并输入有效数量", "error");
                return;
            }

            const stock = player.stockData.stocks[selectedIndex];
            const totalCost = mulBigSci(stock.currentPrice, amount);
            
            if(cmpBigSci(player.reincarnationCoin, totalCost) >= 0) {
                player.reincarnationCoin = bigSciToStorageValue(subBigSci(player.reincarnationCoin, totalCost));
                // totalCost 为 mulBigSci 返回的 BigSci 对象，不可 Number(totalCost)
                const oldShares = stock.shares || 0;
                const oldCostTotal = mulBigSciValues(oldShares, Number(stock.avgCost) > 0 ? stock.avgCost : 0);
                const numer = addBigSci(oldCostTotal, totalCost);
                const den = addBigSci(oldShares, amount);
                const numerN = Number(bigSciToStorageValue(numer));
                const denN = Number(bigSciToStorageValue(den));
                stock.avgCost = (Number.isFinite(numerN) && Number.isFinite(denN) && denN > 0) ? (numerN / denN) : stock.currentPrice;
                stock.shares = bigSciToStorageValue(addBigSci(stock.shares, amount));
                logAction(`成功购买${stock.name} ${amount}股`, "success");
            } else {
                logAction("转生币不足！", "error");
            }
            updateStockDisplay();
        }

        // 股票出售逻辑（使用 parseFloat 支持科学计数法如 1e20）
        function sellStock() {
            const amount = Math.max(0, parseFloat(document.getElementById('stockAmount').value) || 0);
            const selectedIndex = document.querySelector('.stock-item.selected')?.dataset.index;
            
            if(selectedIndex === undefined || !(amount > 0)) {
                logAction("请先选择股票并输入有效数量", "error");
                return;
            }

            const stock = player.stockData.stocks[selectedIndex];
            if(cmpBigSci(stock.shares, amount) < 0) {
                logAction("持有份额不足！", "error");
                return;
            }

            const totalValue = mulBigSci(stock.currentPrice, amount);
            player.reincarnationCoin = bigSciToStorageValue(addBigSci(player.reincarnationCoin, totalValue));
            stock.shares = bigSciToStorageValue(subBigSci(stock.shares, amount));
            logAction(`成功出售${stock.name} ${amount}股`, "success");
            
            if(cmpBigSci(stock.shares, 0) === 0) stock.avgCost = 0;
            updateStockDisplay();
        }
      // 购买所有股票
function buyAllStock() {
    const selectedIndex = document.querySelector('.stock-item.selected')?.dataset.index;
    if (selectedIndex === undefined) {
        logAction("请先选择股票", "error");
        return;
    }

    const stock = player.stockData.stocks[selectedIndex];
    const coinLog = getBigLog10(player.reincarnationCoin);
    const priceLog = Math.log10(Math.max(stock.currentPrice, 0.01));
    let maxShares = 0;
    if (Number.isFinite(coinLog)) {
        const approx = sciFromLog10(coinLog - priceLog);
        maxShares = bigSciToStorageValue(approx);
        // 回退校准：若估算略高导致买不起，二分衰减到可购买
        let guard = 0;
        while (cmpBigSci(maxShares, 1) >= 0 && cmpBigSci(player.reincarnationCoin, mulBigSci(stock.currentPrice, maxShares)) < 0 && guard < 32) {
            maxShares = bigSciToStorageValue(mulBigSci(maxShares, 0.5));
            guard++;
        }
    }

    if (cmpBigSci(maxShares, 1) >= 0) {
        const totalCost = mulBigSci(stock.currentPrice, maxShares);
        player.reincarnationCoin = bigSciToStorageValue(subBigSci(player.reincarnationCoin, totalCost));
        const oldShares = stock.shares || 0;
        const oldCostTotal = mulBigSciValues(oldShares, Number(stock.avgCost) > 0 ? stock.avgCost : 0);
        const numer = addBigSci(oldCostTotal, totalCost);
        const den = addBigSci(oldShares, maxShares);
        const numerN = Number(bigSciToStorageValue(numer));
        const denN = Number(bigSciToStorageValue(den));
        stock.avgCost = (Number.isFinite(numerN) && Number.isFinite(denN) && denN > 0) ? (numerN / denN) : stock.currentPrice;
        stock.shares = bigSciToStorageValue(addBigSci(stock.shares, maxShares));
        logAction(`成功购买${stock.name} ${maxShares}股`, "success");
    } else {
        logAction("转生币不足，无法购买任何股票", "error");
    }
    updateStockDisplay();
}

// 出售所有股票
function sellAllStock() {
    const selectedIndex = document.querySelector('.stock-item.selected')?.dataset.index;
    if (selectedIndex === undefined) {
        logAction("请先选择股票", "error");
        return;
    }

    const stock = player.stockData.stocks[selectedIndex];
    if (cmpBigSci(stock.shares, 0) <= 0) {
        logAction("没有持有该股票", "error");
        return;
    }

    const totalValue = mulBigSci(stock.currentPrice, stock.shares);
    player.reincarnationCoin = bigSciToStorageValue(addBigSci(player.reincarnationCoin, totalValue));
    logAction(`成功出售${stock.name} ${formatSci(stock.shares)}股`, "success");
    stock.shares = 0;
    stock.avgCost = 0;
    updateStockDisplay();
}

        // 购买传统数字彩票
     function buyTraditionalLottery() {
    if (player.traditionalLotteryBought) {
        logAction("您已购买过传统数字彩票，需等待开奖后才能重新购买。", "error");
        return;
    }

    if (player.reincarnationCoin >= 10) {
        player.reincarnationCoin -= 10;
        const numbers = generateTraditionalLotteryNumbers();
        player.traditionalLotteryNumbers = numbers;
        player.traditionalLotteryBought = true; // 设置购买标记
         player.traditionalLotteryDrawTime = Date.now() + 30 * 60 * 1000;
        updateTraditionalLotteryDisplay();
        logAction(`购买了传统数字彩票，号码为：${numbers.join(', ')}`, 'info');
        
        setTimeout(() => {
            checkTraditionalLotteryResult();
            resetTraditionalLottery(); // 开奖后重置状态
        }, 1800000);
    } else {
        logAction("转生币不足！无法购买传统数字彩票", "error");
    }
}

// 新增重置函数
function resetTraditionalLottery() {
    player.traditionalLotteryNumbers = [];
    player.traditionalLotteryBought = false; // 重置购买标记
    player.traditionalLotteryPurchased = false; // 重置原有限购标记
   player.traditionalLotteryDrawTime = 0;
    updateTraditionalLotteryDisplay();
}


        // 生成传统数字彩票号码
        function generateTraditionalLotteryNumbers() {
            const numbers = [];
            while (numbers.length < 6) {
                const num = Math.floor(Math.random() * 50) + 1; // 生成1到50的随机数
                if (!numbers.includes(num)) { // 确保号码不重复
                    numbers.push(num);
                }
            }
            return numbers.sort((a, b) => a - b); // 返回排序后的号码
        }

        // 检查传统数字彩票结果
        function checkTraditionalLotteryResult() {
    const winningNumbers = generateTraditionalLotteryNumbers();
    const matchedNumbers = player.traditionalLotteryNumbers.filter(num => winningNumbers.includes(num)).length;
    let reward = 0;
    switch (matchedNumbers) {
        case 6:
            reward = 1000000;
            break;
        case 5:
            reward = 100000;
            break;
        case 4:
            reward = 10000;
            break;
        case 3:
            reward = 1000;
            break;
        case 2:
            reward = 100;
            break;
        case 1:
            reward = 10;
            break;
      }
    player.items.yuzhou1 += reward;

     // 添加开奖结果
    player.lotteryResults.unshift({
        type: '传统数字彩票',
        numbers: winningNumbers,
        matched: matchedNumbers,
        reward: reward,
       timestamp: new Date().toLocaleTimeString()
    });

    // 保持开奖结果不超过 20 条
    if (player.lotteryResults.length > 20) {
        player.lotteryResults.pop(); // 移除最旧的一条开奖结果
    }
    
    logAction(`传统数字彩票开奖结果：中奖号码为 ${winningNumbers.join(', ')}，你中了 ${matchedNumbers} 个号码，获得 ${reward} 星尘发票`, 'success');
  // 开奖后重置购买状态
     resetTraditionalLottery();
    player.traditionalLotteryPurchased = false;
    updateLotteryResultsDisplay();
    saveGame();

}

  

        // 购买蛇年刮刮卡
        function buySnakeScratchCard() {
            if (player.reincarnationCoin >= 50) {
                player.reincarnationCoin -= 50;
                const reward = getSnakeScratchCardReward();
                player.reincarnationCoin += reward;

              // 添加开奖结果
        player.lotteryResults.unshift({
            type: '蛇年刮刮卡',
            reward: reward,
            timestamp: new Date().toLocaleTimeString()
        });

        // 保持开奖结果不超过 20 条
        if (player.lotteryResults.length > 20) {
            player.lotteryResults.pop(); // 移除最旧的一条开奖结果
        }
                logAction(`购买了蛇年刮刮卡，获得 ${reward} 转生币`, 'info');
                updateLotteryResultsDisplay();
            } else {
                logAction("转生币不足！无法购买蛇年刮刮卡", "error");
            }
        }

        // 获取蛇年刮刮卡奖励
        function getSnakeScratchCardReward() {
            const rand = Math.random();
            if (rand < 0.6) return 0;
            if (rand < 0.95) return Math.floor(Math.random() * 91) + 10; // 10-100
            if (rand < 0.989) return Math.floor(Math.random() * 401) + 100; // 100-500
            if (rand < 0.999) return Math.floor(Math.random() * 1501) + 500; // 500-2000
            return Math.floor(Math.random() * 8001) + 2000; // 2000-10000
        }

        // 购买发财刮刮卡
        function buyFortuneScratchCard() {
            if (player.reincarnationCoin >= 500) {
                player.reincarnationCoin -= 500;
                const reward = getFortuneScratchCardReward();
                player.reincarnationCoin += reward;

                 // 添加开奖结果
        player.lotteryResults.unshift({
            type: '发财刮刮卡',
            reward: reward,
            timestamp: new Date().toLocaleTimeString()
        });

        // 保持开奖结果不超过 20 条
        if (player.lotteryResults.length > 20) {
            player.lotteryResults.pop(); // 移除最旧的一条开奖结果
        }
                logAction(`购买了发财刮刮卡，获得 ${reward} 转生币`, 'info');
                updateLotteryResultsDisplay();
            } else {
                logAction("转生币不足！无法购买发财刮刮卡", "error");
            }
        }

        // 获取发财刮刮卡奖励
        function getFortuneScratchCardReward() {
            const rand = Math.random();
            if (rand < 0.6) return 0;
            if (rand < 0.95) return Math.floor(Math.random() * 901) + 100; // 100-1000
            if (rand < 0.989) return Math.floor(Math.random() * 4001) + 1000; // 1000-5000
            if (rand < 0.999) return Math.floor(Math.random() * 15001) + 5000; // 5000-20000
            return Math.floor(Math.random() * 80001) + 20000; // 20000-100000
        }

        // 更新传统数字彩票显示
     function updateTraditionalLotteryDisplay() {
            const container = document.getElementById('traditionalLotteryNumbers');
            const buyBtn = document.querySelector('.buy-traditional-lottery-btn');
            if (!container) return;
            if (player.traditionalLotteryBought) {
                container.textContent = `您的号码：${(player.traditionalLotteryNumbers || []).join(', ')} (已购买，等待开奖...)`;
                if (buyBtn) buyBtn.style.display = 'none';
            } else {
                container.textContent = "您还没有购买彩票";
                if (buyBtn) buyBtn.style.display = 'block';
            }
            // 更新倒计时显示
            updateLotteryCountdown();
        }
      // 更新彩票倒计时
        function updateLotteryCountdown() {
            const countdownElement = document.getElementById('traditionalLotteryCountdown');
            if (!countdownElement) return;

            if (player.traditionalLotteryBought && player.traditionalLotteryDrawTime > 0) {
                const now = Date.now();
                const timeLeft = player.traditionalLotteryDrawTime - now;
                
                if (timeLeft <= 0) {
                    countdownElement.textContent = '开奖中...';
                    // 时间到了，立即开奖
                    checkTraditionalLotteryResult();
                } else {
                    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                    countdownElement.textContent = `下次开奖: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            } else {
                countdownElement.textContent = '下次开奖: --:--:--';
            }
        }
        // 更新开奖结果显示
        function updateLotteryResultsDisplay() {
    const container = document.getElementById('lotteryResults');
    container.innerHTML = player.lotteryResults
        .slice(0, 20)
        .map(result => {
            if (result.type === '传统数字彩票') {
                return `<div>${result.type} - 中奖号码: ${result.numbers.join(', ')}，你中了 ${result.matched} 个号码，获得 ${result.reward} 星尘发票</div>`;
            } else {
                return `<div>${result.type} - 获得 ${result.reward} 转生币</div>`;
            }
        })
        .join('');
}

        // 银行系统逻辑（使用 parseFloat 支持科学计数法如 1e24，避免 parseInt("1e24") 只得到 1）
        function depositToBank() {
            normalizeBankAndStockState();
            const amount = Math.floor(parseFloat(document.getElementById('bankAmount').value) || 0);
            if (amount < 1) {
                logAction("请输入有效的存款金额", "error");
                return;
            }
            if (cmpBigSci(player.reincarnationCoin, amount) >= 0) {
                player.reincarnationCoin = bigSciToStorageValue(subBigSci(player.reincarnationCoin, amount));
                player.bank.deposit = bigSciToStorageValue(addBigSci(player.bank.deposit, amount));
                logAction(`成功存款 ${formatSci(amount)} 转生币`, "success");
                updateBankDisplay();
            } else {
                logAction("转生币不足！", "error");
            }
        }

        function withdrawFromBank() {
            normalizeBankAndStockState();
            const amount = Math.floor(parseFloat(document.getElementById('bankAmount').value) || 0);
            if (amount < 1) {
                logAction("请输入有效的取款金额", "error");
                return;
            }
            if (cmpBigSci(player.bank.deposit, amount) >= 0) {
                player.bank.deposit = bigSciToStorageValue(subBigSci(player.bank.deposit, amount));
                player.reincarnationCoin = bigSciToStorageValue(addBigSci(player.reincarnationCoin, amount));
                logAction(`成功取款 ${formatSci(amount)} 转生币`, "success");
                updateBankDisplay();
            } else {
                logAction("存款不足！", "error");
            }
        }

        // 按百分比设置存取款金额（1%、10%、25%、50%）
        function setBankAmountPercent(type, percent) {
            normalizeBankAndStockState();
            const base = type === 'deposit' ? player.reincarnationCoin : player.bank.deposit;
            let amount = Math.floor((Number(base) || 0) * (percent / 100));
            if (amount < 1) {
                logAction("当前金额太少，无法按该比例操作", "error");
                return;
            }
            document.getElementById('bankAmount').value = amount;
        }
     // 存款所有转生币
function depositAllToBank() {
    normalizeBankAndStockState();
    const amount = player.reincarnationCoin; // 获取当前所有转生币
    if (cmpBigSci(amount, 1) < 0) {
        logAction("没有可存款的转生币", "error");
        return;
    }

    player.reincarnationCoin = 0;
    player.bank.deposit = bigSciToStorageValue(addBigSci(player.bank.deposit, amount));
    logAction(`成功存款所有 ${formatSci(amount)} 转生币`, "success");
    updateBankDisplay();
}

// 取款所有转生币
function withdrawAllFromBank() {
    normalizeBankAndStockState();
    const amount = player.bank.deposit; // 获取当前所有存款
    if (cmpBigSci(amount, 1) < 0) {
        logAction("没有可取款的转生币", "error");
        return;
    }

    player.bank.deposit = 0;
    player.reincarnationCoin = bigSciToStorageValue(addBigSci(player.reincarnationCoin, amount));
    logAction(`成功取款所有 ${formatSci(amount)} 转生币`, "success");
    updateBankDisplay();
    }      
        function calculateBankInterest() {
            normalizeBankAndStockState();
            const now = Date.now();
            const elapsed = now - player.bank.lastInterestUpdate;
            const intervals = Math.floor(elapsed / (6 * 60 * 1000)); // 每6分钟计算一次利息

            if (intervals > 0) {
                const interestRate = 0.002; // 0.2% 利息
                const interestMultiplier = 1 + interestRate * intervals;
                const newDeposit = mulBigSci(player.bank.deposit, interestMultiplier);
                const interest = subBigSci(newDeposit, player.bank.deposit);
                player.bank.deposit = bigSciToStorageValue(newDeposit);
                player.bank.lastInterestUpdate = now - (elapsed % (6 * 60 * 1000));
                // subBigSci 返回 BigSci 对象，formatSci 无法识别会显示成 0；先转存储值再用 formatSciEarlyLocal 显示小数/大数
                logAction(`银行利息: +${formatSciEarlyLocal(bigSciToStorageValue(interest))} 转生币`, "info");
                if (typeof updateBankDisplay === 'function') updateBankDisplay();
                if (typeof saveGame === 'function') saveGame({ silent: true });
            }
        }

       function formatSciEarlyLocal(value) {
    if (value == null) return '0';
    if (typeof value === 'number') {
        if (!Number.isFinite(value)) return value > 0 ? '1e308+' : (value < 0 ? '-1e308+' : '0');
        if (Math.abs(value) >= 1e8) return value.toExponential(3);
        return value.toLocaleString();
    }
    const text = String(value).trim();
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
    const expFromSci = m[4] != null ? BigInt(m[4]) : 0n;
    const exp10 = expFromSci + BigInt(intPart.length - 1);
    const mantissaTail = allDigits.slice(1, 4).replace(/0+$/, '');
    const mantissa = allDigits[0] + (mantissaTail ? ('.' + mantissaTail) : '');
    return sign + mantissa + 'e' + exp10.toString();
}

// 更新银行显示函数
function updateBankDisplay() {
    normalizeBankAndStockState();
    document.getElementById("bankDeposit").textContent = formatSci(player.bank.deposit);
    document.getElementById("bankTotal").textContent = formatSci(player.bank.deposit);
}

        // 新增：副本装备系统
        function addDungeonEquipment(rarity) {
    const config = dungeonEquipmentTypes[rarity];
    const growthRate = Math.random() * (config.growthRange[1] - config.growthRange[0]) + config.growthRange[0];

    // 检查是否已经有相同的副本装备
    const existingEq = player.dungeonEquipment.find(eq => eq.rarity === rarity);
    if (existingEq) {
        existingEq.quantity = (existingEq.quantity || 1) + 1; // 增加数量
        if (existingEq.quantity >= 3) {
            existingEq.level++; // 升级装备等级
            existingEq.quantity = 0; // 重置数量
            
       
        }
    } else {
        // 如果没有相同的副本装备，则添加新的装备
        const newEq = {
            name: config.name,
            rarity: rarity,
            level: 1,
            growthRate: growthRate,
            quantity: 1 // 初始化数量
        };
        player.dungeonEquipment.push(newEq);
        logAction(`获得副本装备：${newEq.name}`, rarity);
    }

    updateDungeonEquipmentDisplay(); // 更新副本装备显示
}

        function upgradeDungeonEquipment(index) {
            const eq = player.dungeonEquipment[index];
            const cost = eq.level * 100;
            if (player.reincarnationCoin >= cost) {
                player.reincarnationCoin -= cost;
                eq.level++;
                logAction(`升级副本装备：${eq.name} 至 Lv.${eq.level}`, eq.rarity);
                updateDungeonEquipmentDisplay(); // 刷新副本装备页面
                updateDisplay();
            } else {
                logAction("转生币不足！", "error");
            }
        }

        function refineDungeonEquipment(index) {
            const eq = player.dungeonEquipment[index];
            if (player.items.refineStone > 0) {
                player.items.refineStone--;
                const config = dungeonEquipmentTypes[eq.rarity];
                eq.growthRate = Math.random() * (config.growthRange[1] - config.growthRange[0]) + config.growthRange[0];
                logAction(`洗炼副本装备：${eq.name}，新的成长属性为 ${(eq.growthRate * 100).toFixed(2)}%`, 'success');
                updateDungeonEquipmentDisplay(); // 刷新副本装备页面
                updateDisplay();
            } else {
                logAction("洗炼石不足！", "error");
            }
        }

       function updateDungeonEquipmentDisplay() {

    const container = document.getElementById('dungeonEquipmentContainer');
    const rarityOrder = [
        'common',     
    'rare',       
    'epic',       
    'legendary',  
    'ancient',    
    'divine',    
    'arcane',     
    'celestial',  
    'infernal',  
    'astral',     
    'primeval',  
    'transcendental', 
    'quantum',    
    'ultimate',  
    'ultimate1',     
    'ultimate2',   
    'ultimate3',       
    'ultimate4',   
    'ultimate5', 
    'ultimate6',    
    'ultimate7',     
    'ultimate8',   
    'ultimate9',       
    'ultimate10',   
    'ultimate11', 
    'ultimate12',     
    'ultimate13',     
    'ultimate14',   
    'ultimate15',       
    'ultimate16',   
    'ultimate17', 
    'ultimate18',   
    'ultimate19',     
    'ultimate20',   
    'ultimate21',       
    'ultimate22',   
    'ultimate23', 
    'ultimate24',   
    'ultimate25',   
    'ultimate26',       
    'ultimate27',   
    'ultimate28', 
    'ultimate29',     
    'ultimate30',     
    'ultimate31',   
    'ultimate32',       
    'ultimate33',   
    'ultimate34', 
    'ultimate35',     
    'ultimate36',     
    'ultimate37',   
    'ultimate38',       
    'ultimate39',   
    'ultimate40', 
    'ultimate41',    
    'ultimate42',     
    'ultimate43',   
    'ultimate44',       
    'ultimate45',   
    'ultimate46', 
    'ultimate47', 
    'ultimate48',   
    'ultimate49', 
    'ultimate50'
    ];
    
    // 按品质排序
    const sortedEquipment = player.dungeonEquipment.sort((a, b) => {
        // 先按品质排序
        const rarityDiff = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        if (rarityDiff !== 0) return rarityDiff;
        
        // 同品质按成长属性降序
        return b.growthRate - a.growthRate;
    });
    const totalBonus = player.dungeonEquipment.reduce((sum, eq) => sum + eq.level * eq.growthRate, 0);
    container.innerHTML = `
        <div>总加成: +${(totalBonus * 100).toFixed(2)}%</div>
        ${player.dungeonEquipment.map((eq, index) => `
            <div class="equipment ${eq.rarity}">
                ${eq.name} Lv.${eq.level} (数量: ${eq.quantity}/3, 成长属性: +${(eq.growthRate * 100).toFixed(2)}%)
                <button onclick="refineDungeonEquipment(${index})">洗炼</button>
                <button onclick="dismantleDungeonEquipment(${index})">分解</button>
            </div>
        `).join('')}
    `;
}

        // 分解副本装备
        function dismantleDungeonEquipment(index) {
            const eq = player.dungeonEquipment[index];
            player.dungeonEquipment.splice(index, 1);
            logAction(`分解了副本装备：${eq.name}`, 'success');
            updateDungeonEquipmentDisplay();
        }

        // 新增：魂环系统
        function addSoulRing(type) {
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

        function upgradeSoulRing(type) {
    const ring = player.soulRings.find(r => r.type === type);
    const cost = ring.level * soulRingTypes[type].costBase * 1000;

    if (player.reincarnationCoin >= cost) {
        player.reincarnationCoin -= cost;
        ring.level++;

        // 检查魂环成就
        checkSoulRingAchievements(type, ring.level);

        logAction(`${soulRingTypes[type].name} 升级到 Lv.${ring.level}`, 'success');
    } else {
        logAction("转生币不足！", "error");
    }
}

function checkSoulRingAchievements(type, level) {
    const achievements = [
        { level: 10, key: `${type}_10` },
        { level: 100, key: `${type}_100` },
        { level: 1000, key: `${type}_1000` },
        { level: 10000, key: `${type}_10000` },
    ];

    achievements.forEach(({ level: targetLevel, key }) => {
        if (level >= targetLevel && !player.achievements[key]) {
            player.achievements[key] = true;
            const reward = achievementRewards[key];
            if (reward) {
                player.gpsMultiplier += reward.gpsMultiplier;
                logAction(`成就达成：${reward.description}，GPS奖励 +${reward.gpsMultiplier * 100}%`, 'success');
                updateAchievementsDisplay();
            }
        }
    });
}
        function updateSoulRingDisplay() {
            const container = document.getElementById('soulRingsContainer');
            container.innerHTML = player.soulRings.map(ring => `
                <div class="equipment">
                    ${soulRingTypes[ring.type].name} Lv.${ring.level}
                    (全属性+${(ring.level * ring.multiplier * 100).toFixed(1)}%)

                    </button>
                </div>
            `).join('');
        }
      function showRenameDialog() {
    document.getElementById("renameDialog").style.display = "block";
    document.getElementById("renameOverlay").style.display = "block";
    document.getElementById("renameDialogTitle").textContent = "输入新名字:";
    document.getElementById("newNameInput").value = player.name;
    document.getElementById("newNameInput").focus();
}

function cancelRename() {
    document.getElementById("renameDialog").style.display = "none";
    document.getElementById("renameOverlay").style.display = "none";
}

function updatePlayerAvatarDisplay() {
    var el = document.getElementById("playerAvatar");
    if (!el) return;
    if (player.avatar) {
        el.src = player.avatar;
        el.style.display = "";
        el.alt = player.name + "的头像";
    } else {
        el.src = "";
        el.style.display = "none";
    }
    try {
        var dongIframe = document.getElementById("dongtianJieIframe");
        if (dongIframe && dongIframe.contentWindow && typeof dongIframe.contentWindow.syncHudBarAvatar === "function") {
            dongIframe.contentWindow.syncHudBarAvatar();
        }
    } catch (e) {}
}

function clearAvatar() {
    player.avatar = "";
    updatePlayerAvatarDisplay();
    saveGame();
    logAction("已清除头像", "info");
}

(function initAvatarInput() {
    var input = document.getElementById("avatarInput");
    if (!input) return;
    input.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file || !file.type.match(/^image\//)) {
            e.target.value = "";
            return;
        }
        var reader = new FileReader();
        reader.onload = function() {
            var img = new Image();
            img.onload = function() {
                var canvas = document.createElement("canvas");
                canvas.width = 48;
                canvas.height = 48;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, 48, 48);
                player.avatar = canvas.toDataURL("image/png");
                updatePlayerAvatarDisplay();
                saveGame();
                logAction("头像已更新", "success");
                e.target.value = "";
            };
            img.onerror = function() { e.target.value = ""; };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
})();

function confirmRename() {
    const newName = document.getElementById("newNameInput").value.trim();
    if (newName && newName.length <= 10) {
        player.name = newName;
        document.getElementById("playerName").textContent = newName;
        saveGame();  // 确保保存玩家数据
        cancelRename();
    } else {
        alert("请输入有效的名字（1-10个字符）");
    }
}

        // 星币全局上限
        const MAX_STAR_COINS = 9999999999;

        // 统一处理星币加减并确保不超过上限、不低于0
        function clampStarCoins() {
            if (!player || !player.nightClub) return;
            if (typeof player.nightClub.starCoins !== 'number') {
                player.nightClub.starCoins = player.nightClub.starCoins || 0;
            }
            if (player.nightClub.starCoins > MAX_STAR_COINS) {
                player.nightClub.starCoins = MAX_STAR_COINS;
            } else if (player.nightClub.starCoins < 0) {
                player.nightClub.starCoins = 0;
            }
        }

        function addStarCoins(amount) {
            if (!player || !player.nightClub) return;
            if (typeof player.nightClub.starCoins !== 'number') {
                player.nightClub.starCoins = player.nightClub.starCoins || 0;
            }
            player.nightClub.starCoins += amount;
            clampStarCoins();
        }

        // 界面更新
        // 核心数值显示：可被主循环高频调用，尽量只做轻量 DOM 更新
        const _cachedDOMElements = {};
        function updateCoreStatsDisplay() {
        // 每次刷新界面前，对星币做一次强制夹紧，确保任何来源都不会突破上限
        clampStarCoins();
        // 战斗界面打开时跳过大部分刷新，避免与战斗 UI 抢资源
        if (!_cachedDOMElements.battleUI) {
            _cachedDOMElements.battleUI = document.getElementById('battleUI');
        }
        if (_cachedDOMElements.battleUI && _cachedDOMElements.battleUI.style.display === 'block') return;
        syncOnlineOptionLabels();
        const soulRingRingBonus = typeof getTotalSoulRingBonus === 'function' ? getTotalSoulRingBonus() : 0;
  const dungeonEquipBonus = typeof getTotalDungeonEquipBonus === 'function' ? getTotalDungeonEquipBonus() : 0;
      if (!_cachedDOMElements.playerName) {
          _cachedDOMElements.playerName = document.getElementById("playerName");
      }
      _cachedDOMElements.playerName.textContent = player.name;
      updatePlayerAvatarDisplay();
       if (!_cachedDOMElements.currentTitle) {
           _cachedDOMElements.currentTitle = document.getElementById("currentTitle");
       }
    _cachedDOMElements.currentTitle.textContent = player.titles.current ? `[${player.titles.current}]` : "";
    const runeBonuses = typeof calculateRuneBonuses === 'function' ? calculateRuneBonuses() : {};
    let runeBonusText = '';
    
    if (player.runes.equipped) {
        runeBonusText = '符文加成: ';
        const bonuses = [];
        
        if (runeBonuses.attack > 0) bonuses.push(`攻击+${(runeBonuses.attack * 100).toFixed(1)}%`);
        if (runeBonuses.health > 0) bonuses.push(`生命+${(runeBonuses.health * 100).toFixed(1)}%`);
        if (runeBonuses.critRate > 0) bonuses.push(`暴击+${(runeBonuses.critRate * 100).toFixed(2)}%`);
        if (runeBonuses.critDamage > 0) bonuses.push(`爆伤+${(runeBonuses.critDamage * 100).toFixed(1)}%`);
        if (runeBonuses.combo > 0) bonuses.push(`连击+${runeBonuses.combo.toFixed(0)}次`);
        if (runeBonuses.worldExp > 0) bonuses.push(`世界经验+${(runeBonuses.worldExp * 100).toFixed(1)}%`);
        
        runeBonusText += bonuses.join(' ');
    }
    
    // 将符文加成信息添加到界面中合适的位置
    if (!_cachedDOMElements.runeBonusDisplay) {
        _cachedDOMElements.runeBonusDisplay = document.getElementById('runeBonusDisplay');
    }
    const runeBonusElement = _cachedDOMElements.runeBonusDisplay;
    if (!runeBonusElement) {
        // 如果不存在，创建一个新的元素
        const newElement = document.createElement('div');
        newElement.id = 'runeBonusDisplay';
        newElement.style.cssText = 'color: #90ee90; font-size: 12px; margin-top: 5px;';
        newElement.textContent = runeBonusText;
        
        // 找到合适的位置插入（例如在玩家属性显示区域）
        const playerStatsContainer = document.querySelector('.player-stats-container');
        if (playerStatsContainer) {
            playerStatsContainer.appendChild(newElement);
        }
    } else {
        runeBonusElement.textContent = runeBonusText;
    }
    
 
    // 数值显示
    const display = (value) => {
    // 兼容字符串大数（如 1e9999）
    return formatSci(value);
};
   
  
    // 更新显示
   const currencies = ['gold', 'diamond', 'titanium', 'starstone', 'cosmicstone', 
                       'superstone', 'otherworldstone', 'xingjiestone', 'hundunstone', 
                       'lingtone', 'huangtone', 'mingtone', 'xutong', 'shitone', 'weitone'];
    
    currencies.forEach(currency => {
        if (!_cachedDOMElements[currency]) {
            _cachedDOMElements[currency] = document.getElementById(currency);
        }
        const element = _cachedDOMElements[currency];
        if (!element) return;
        if (isZeroLike(player[currency])) {
            // 金币为 0 时仍显示 0，避免“开启自动兑换后金币消失”的误解
            element.textContent = currency === 'gold' ? '0' : '';
        } else {
            element.textContent = display(player[currency]);
        }
    });
    // 钻石/钛晶石/星耀石等数量为0时隐藏对应货币卡片（金币、转生币始终显示）
    const hideWhenZero = ['diamond', 'titanium', 'starstone', 'cosmicstone', 'superstone', 'otherworldstone', 'xingjiestone', 'hundunstone', 'lingtone', 'huangtone', 'mingtone', 'xutong', 'shitone', 'weitone'];
    hideWhenZero.forEach(id => {
        if (!_cachedDOMElements[id]) {
            _cachedDOMElements[id] = document.getElementById(id);
        }
        const el = _cachedDOMElements[id];
        if (!el) return;
        const card = el.closest('.currency-card');
        if (!card) return;
        card.style.display = isZeroLike(player[id]) ? 'none' : '';
    });
    if (!_cachedDOMElements.reincarnationCoin) {
        _cachedDOMElements.reincarnationCoin = document.getElementById("reincarnationCoin");
    }
    _cachedDOMElements.reincarnationCoin.textContent = display(player.reincarnationCoin);
    const totalAssets = player.investmentGame && player.investmentGame.userData
        ? (player.investmentGame.userData.totalAssets != null ? player.investmentGame.userData.totalAssets : 0) : 0;
    if (!_cachedDOMElements.zijze) {
        _cachedDOMElements.zijze = document.getElementById("zijze");
    }
    _cachedDOMElements.zijze.textContent = `${formatInvestmentNumber(totalAssets)}元`;
    if (!_cachedDOMElements.reincarnationCount) {
        _cachedDOMElements.reincarnationCount = document.getElementById("reincarnationCount");
    }
    _cachedDOMElements.reincarnationCount.textContent = player.reincarnationCount;
    if (!_cachedDOMElements.maxStage) {
        _cachedDOMElements.maxStage = document.getElementById("maxStage");
    }
    _cachedDOMElements.maxStage.textContent = player.battle.maxStage;
    if (!_cachedDOMElements.gps) {
        _cachedDOMElements.gps = document.getElementById("gps");
    }
    _cachedDOMElements.gps.textContent = display(getTotalGPS());
    if (!_cachedDOMElements.clickValue) {
        _cachedDOMElements.clickValue = document.getElementById("clickValue");
    }
    _cachedDOMElements.clickValue.textContent = display(getTotalClickValue());
    if (!_cachedDOMElements.vipPowerCount) {
        _cachedDOMElements.vipPowerCount = document.getElementById("vipPowerCount");
    }
    _cachedDOMElements.vipPowerCount.textContent = player.items.vipPower || 0;
   if (!_cachedDOMElements.mysteryBonusDisplay) {
       _cachedDOMElements.mysteryBonusDisplay = document.getElementById("mysteryBonusDisplay");
   }
   _cachedDOMElements.mysteryBonusDisplay.textContent = player.mystery.bonus;
  if (!_cachedDOMElements.playerLevelDisplay) {
      _cachedDOMElements.playerLevelDisplay = document.getElementById('playerLevelDisplay');
  }
  _cachedDOMElements.playerLevelDisplay.textContent = `Lv.${player.level.current}级`;
  if (!_cachedDOMElements.ascentionCountq) {
      _cachedDOMElements.ascentionCountq = document.getElementById('ascentionCountq');
  }
  _cachedDOMElements.ascentionCountq.textContent = `飞升.${player.level.ascentionCount}次`;
  if (!_cachedDOMElements.ascentionCountqa) {
      _cachedDOMElements.ascentionCountqa = document.getElementById('ascentionCountqa');
  }
  const huaShengCount = Number(player.level && player.level.huaShengCount) || 0;
  _cachedDOMElements.ascentionCountqa.textContent = `化圣.${huaShengCount}次·轮回.${player.level.ascentionCounta}转`;

    // 更新材料宝箱购买成本显示
    if (!_cachedDOMElements.materialChestCost) {
        _cachedDOMElements.materialChestCost = document.getElementById("materialChestCost");
    }
    _cachedDOMElements.materialChestCost.textContent = display(player.materialChestCost);

        // 更新宝箱成本显示
    if (!_cachedDOMElements.techniqueChestCost) {
        _cachedDOMElements.techniqueChestCost = document.getElementById("techniqueChestCost");
    }
     _cachedDOMElements.techniqueChestCost.textContent = display(player.techniqueChestCost);

    // 更新怪物生命和攻击显示
    if (player.battle.monster) {
        if (!_cachedDOMElements.monsterHealth) {
            _cachedDOMElements.monsterHealth = document.getElementById("monsterHealth");
        }
        _cachedDOMElements.monsterHealth.textContent = display(player.battle.monster.health);
        if (!_cachedDOMElements.monsterAttack) {
            _cachedDOMElements.monsterAttack = document.getElementById("monsterAttack");
        }
        _cachedDOMElements.monsterAttack.textContent = display(player.battle.monster.attack);
    }
   
    // 更新玩家攻击显示
    if (!_cachedDOMElements.playerAttack) {
        _cachedDOMElements.playerAttack = document.getElementById("playerAttack");
    }
    _cachedDOMElements.playerAttack.textContent = display(player.battle.playerAttack);
        }

        // 装备/成就等重型 UI：仅在数据变化或低频节拍下调用
        function updateHeavyDisplay() {
            // 装备列表：仅当装备数量或等级等变化时重建，避免频繁大量 DOM 操作导致卡顿
            var equipmentSignature = player.equipment.length + '-' + player.equipment.reduce(function(s, eq){
                return s + (eq.level || 0) + String(bigSciToStorageValue(eq.gps)).length;
            }, 0);
            if (!window._equipmentListSignature || window._equipmentListSignature !== equipmentSignature) {
                window._equipmentListSignature = equipmentSignature;
                const fragment = document.createDocumentFragment();
                player.equipment.forEach((eq, index) => {
                    const div = document.createElement("div");
                    div.className = `equipment ${eq.rarity}`;
                    div.innerHTML = `
                        ${getEquipmentName(eq)} Lv.${eq.level}
                        (GPS +${formatSci(eq.gps)} 点击 +${formatSci(eq.click)})
                        <button onclick="useAllGems(${index}, 'primaryGem')">一键使用初级宝石</button>
                        <button onclick="useAllGems(${index}, 'advancedGem')">一键使用高级宝石</button>
                        <button onclick="useAllGems(${index}, 'superiorGem')">一键使用极品宝石</button>
                        <button onclick="useAllGems(${index}, 'divineGem')">一键使用神级宝石</button>
                        <div class="tooltip">
                                品质: ${eq.name}<br>
                                等级: ${eq.level}<br>
                                成长率: +${(eq.growthRate * 100).toFixed(1)}%/级<br>
                                宝石加成: +${(eq.gemMultiplier * 100).toFixed(2)}%<br>
                            </div>
                        `;
                    fragment.appendChild(div);
                });
                document.getElementById("equipmentList").innerHTML = "";
                document.getElementById("equipmentList").appendChild(fragment);
            }

            // 成就：每 5 秒更新一次即可，成就不会每秒变化，减轻主循环负担
            var now = Date.now();
            if (!window._lastAchievementsUpdate || now - window._lastAchievementsUpdate > 5000) {
                window._lastAchievementsUpdate = now;
                updateAchievementsDisplay();
            }
            // 节流自动存档：每 30 秒最多写一次，避免每秒 JSON.stringify+localStorage 导致严重卡顿
            if (!versionErrorBlocked && !window._goldGameSaveLoadBlocked && window._goldGameSaveLoadedOk) {
                const now = Date.now();
                if (!player._lastAutoSave || now - player._lastAutoSave > 30000) {
                    player._lastAutoSave = now;
                    var chartCache = player.investmentGame && player.investmentGame.chartHistoryCache;
                    if (chartCache) player.investmentGame.chartHistoryCache = {};
                    if (window._goldGameSaveLoadBlocked) { if (chartCache) player.investmentGame.chartHistoryCache = chartCache; return; }
                    try {
                        if (typeof window.writeGoldGameSaveToLocal === 'function') window.writeGoldGameSaveToLocal(player);
                        else localStorage.setItem("goldGameSave", JSON.stringify(player));
                    } catch (e) {}
                    if (chartCache) player.investmentGame.chartHistoryCache = chartCache;
                }
            }
        }

        // 兼容原有调用：updateDisplay 作为“整合入口”，内部再拆为轻量与重型两部分
        let _lastDisplayUpdateTime = 0;
        const DISPLAY_UPDATE_THROTTLE = 100;
        function updateDisplay() {
            const now = Date.now();
            if (now - _lastDisplayUpdateTime < DISPLAY_UPDATE_THROTTLE) {
                return;
            }
            _lastDisplayUpdateTime = now;
            updateCoreStatsDisplay();
            updateHeavyDisplay();
        }

        // 辅助函数
        function getEquipmentName(eq) {
            return eq.name || equipmentTypes[eq.rarity]?.name || '神秘装备';
        }

        function validateRarity(rarity) {
            return equipmentTypes[rarity] ? rarity : 'common';
        }

        function getDefaultGrowthRate(rarity) {
            return equipmentTypes[rarity]?.growthRate || 0.01;
        }
            function formatSci(number) {
    if (number == null) return '0';
    if (typeof number === 'number') {
        if (!Number.isFinite(number)) return number > 0 ? '1e308+' : (number < 0 ? '-1e308+' : '0');
        if (Math.abs(number) >= 1e9) {
            return number.toExponential(3)
                .replace(/(\.\d+?)0+e/, '$1e')
                .replace(/\.?e\+?/, 'e');
        }
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


        function formatTime(ms) {
            const seconds = Math.floor(ms / 1000);
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            return [hours && `${hours}小时`, minutes && `${minutes}分`, `${secs}秒`]
                .filter(Boolean).join(' ');
        }

       function logAction(message, type = 'info') {
    // 过滤包含"自动购买"的消息
    if (message.includes('自动购买')) {
        return; // 直接返回，不记录这类消息
    }
    if (message.includes("获得了轮回神兽")) {
        // 提取神兽名和品质
        const match = message.match(/获得了轮回神兽：(.*?)（(.*?)·(.*?)）/);
        if (match) {
            const [, beastName, rarity, sLevel] = match;
            const rarityColor = beastConfig.rarities[rarity]?.color || '#FFFFFF';
            // 可以用特殊样式显示
        }
    }
    const timestamp = new Date().toLocaleTimeString();

    // 辅助函数：将大数值转换为科学计数法
    const formatNumber = (value) => formatSci(value);

    // 格式化消息中的数值
    const formattedMessage = message.replace(/\d+(\.\d+)?/g, (match) => {
        const number = parseFloat(match);
        return formatNumber(number);
    });

    // 添加到统一日志数组
    player.actionLogs.unshift({ message: formattedMessage, type, timestamp });
    // 保持日志长度不超过 20 条
    if (player.actionLogs.length > 20) {
        player.actionLogs.pop(); // 移除最旧的一条日志
    }

    // 原有 DOM 更新逻辑保持不变...
    const logEntry = document.createElement('div');
    logEntry.className = type;
    logEntry.textContent = `[${timestamp}] ${message}`;

    const logContainer = document.getElementById('actionLog');
    if (logContainer.firstChild) {
        logContainer.insertBefore(logEntry, logContainer.firstChild);
    } else {
        logContainer.appendChild(logEntry);
    }
    if (logContainer.children.length > 20) {
        logContainer.removeChild(logContainer.lastChild);
    }
}


        // 保存游戏（不再写入「游戏已保存」到游戏日志；兼容 saveGame({ silent: true }) 调用）
        function saveGame() {
    if (versionErrorBlocked) return; // 版本被阻止时不写入，避免覆盖新版本存档
    if (window._goldGameSaveLoadBlocked) return; // 绑定账号未就绪时不写入，避免默认档覆盖真实档
    if (!window._goldGameSaveLoadedOk) {
        var hadLocal = false;
        try {
            var rawGuard = null;
            if (typeof readGoldGameSaveRawFromStorage === 'function') rawGuard = readGoldGameSaveRawFromStorage();
            if (!rawGuard) rawGuard = localStorage.getItem('goldGameSave');
            hadLocal = !!(rawGuard && rawGuard.length > 20);
        } catch (eGuard) {}
        if (hadLocal) return;
    }
    // 云同步锁仅阻止上传（见 scheduleGoldGameCloudUpload / canUploadGoldGameCloudSave），本地落盘必须始终可用
    player.gameVersion = GAME_VERSION;
    player.lastUpdate = Date.now(); // 确保保存时更新最后更新时间
    player.clientLocalSaveAt = Date.now(); // 本机落盘墙钟，与云端 savedAt 对照，减少登录同步时误判
    player.accountId = (typeof window.getGoldGameAuthToken === 'function' && window.getGoldGameAuthToken() && typeof window.goldGameResolveAccountId === 'function')
        ? (window.goldGameResolveAccountId() || '')
        : '';
    normalizeMainCurrencies();
    player.actionLogs = player.actionLogs.slice(0, 5);
    player.lotteryResults = player.lotteryResults.slice(0, 5);
   
    if (player.liveStream && player.liveStream.donationHistory) {
        player.liveStream.donationHistory = player.liveStream.donationHistory.slice(-5);
    }
     if (player.investmentGame && player.investmentGame.userData) {
        player.investmentGame.userData.lastUpdateTime = Date.now();
    }
    // 直播中完全保留观众列表，不截断不清空，避免保存后人数变少
    if (player.liveStream && player.liveStream.viewers && !player.liveStream.isLive) {
        player.liveStream.viewers = [];
        player.liveStream.displayViewerCount = 0;
    }
    if (player.reincarnationEquipment) {
        player.reincarnationEquipment.inventory = player.reincarnationEquipment.inventory.filter(eq => eq);
    }
    player.mystery.lastUpdateTime = Date.now();
   cleanupArtifactAdvanceLevels(); 
    saveInvestmentGameData();
    player.tower.lastUpdate = Date.now();
    syncExplorationDataToPlayer();
    
    if (player.battleLog && player.battleLog.length > 50) player.battleLog = player.battleLog.slice(0, 50);
    if (player.goldLogs && player.goldLogs.length > 20) player.goldLogs = player.goldLogs.slice(0, 20);
    if (player.clickTimestamps && player.clickTimestamps.length > 30) player.clickTimestamps = player.clickTimestamps.slice(-30);
    if (player.exploration && player.exploration.logs && player.exploration.logs.length > 20) {
        player.exploration.logs = player.exploration.logs.slice(0, 20);
    }
    if (player.liveStream) {
        delete player.liveStream.danmakuPasswordInterval;
        delete player.liveStream.wishListInterval;
        delete player.liveStream.danmakuPasswordTimer;
        if (player.liveStream.isLive && player.liveStream.viewers && player.liveStream.viewers.length > 100) {
            player.liveStream.viewers = player.liveStream.viewers.slice(-100);
        }
    }
    if (player.trading && player.trading.autoTrade && player.trading.autoTrade.logs && player.trading.autoTrade.logs.length > 10) {
        player.trading.autoTrade.logs = player.trading.autoTrade.logs.slice(0, 10);
    }
    if (player.companionExpedition && player.companionExpedition.history && player.companionExpedition.history.length > 10) {
        player.companionExpedition.history = player.companionExpedition.history.slice(0, 10);
    }
    // 勿对运行中的 player 做 applyGoldGameSaveCompaction：会清空 interval 引用却不停止定时器，导致世界地图自动战斗无法关闭且越叠越快
    var chartCache = player.investmentGame && player.investmentGame.chartHistoryCache;
    if (chartCache) player.investmentGame.chartHistoryCache = {};
    try {
        if (typeof window.writeGoldGameSaveToLocal === 'function') window.writeGoldGameSaveToLocal(player);
        else localStorage.setItem('goldGameSave', JSON.stringify(player));
    } catch (saveErr) {
        if (saveErr && (saveErr.name === 'QuotaExceededError' || saveErr.code === 22)) {
            var quotaMsg = '本地存档空间已满，本次改动可能未保存。请清理浏览器站点数据、删除过大的自定义背景，或登录后使用云存档。';
            if (typeof logAction === 'function') logAction(quotaMsg, 'error');
            else if (typeof alert === 'function') alert(quotaMsg);
        } else {
            throw saveErr;
        }
    } finally { if (chartCache) player.investmentGame.chartHistoryCache = chartCache; }
    try { localStorage.setItem('traditionalLotteryPurchased', player.traditionalLotteryPurchased); } catch (eLot) {}
    // 不在 saveGame 里写 goldGameLastUnload，否则自动/手动保存会覆盖「离开时间」，导致重开时离线时长恒为 0；仅 beforeunload 写入
    if (typeof window.scheduleGoldGameCloudUpload === 'function') window.scheduleGoldGameCloudUpload();
}

        // ========== 账号与联网排行榜（可选，需配置 GOLD_GAME_API_BASE） ==========
        (function() {
            var AUTH_KEY = 'goldGameAuth';
            var AUTH_USER_KEY = 'goldGameAuthUser';
            var ACCOUNT_ID_KEY = 'goldGameAccountId';
            function getToken() { try { return localStorage.getItem(AUTH_KEY) || ''; } catch (e) { return ''; } }
            function setToken(t) { try { localStorage.setItem(AUTH_KEY, t || ''); } catch (e) {} }
            function getAuthUser() { try { return localStorage.getItem(AUTH_USER_KEY) || ''; } catch (e) { return ''; } }
            function setAuthUser(u) { try { localStorage.setItem(AUTH_USER_KEY, u || ''); } catch (e) {} }
            function getAccountId() { try { return localStorage.getItem(ACCOUNT_ID_KEY) || ''; } catch (e) { return ''; } }
            function setAccountId(id) { try { localStorage.setItem(ACCOUNT_ID_KEY, id || ''); } catch (e) {} }
            /** 解析当前账号 ID（须已登录；未登录一律视为纯本地档，走 goldGameSave） */
            function goldGameResolveAccountId() {
                if (!getToken()) return '';
                var id = '';
                try {
                    id = String(getAccountId() || '').trim();
                } catch (e0) {}
                if (!id) {
                    try {
                        id = String(localStorage.getItem(ACCOUNT_ID_KEY) || '').trim();
                    } catch (e1) {}
                }
                /** 刷新后 goldGameAccountId 偶发丢失：从 goldGameSave_* 键名恢复，避免读不到 scoped 档 */
                if (!id) {
                    try {
                        var candidates = [];
                        for (var ri = 0; ri < localStorage.length; ri++) {
                            var rk = localStorage.key(ri);
                            if (!rk || rk.indexOf(SAVE_KEY_PREFIX) !== 0) continue;
                            var raid = rk.slice(SAVE_KEY_PREFIX.length).trim();
                            if (!raid) continue;
                            var rraw = localStorage.getItem(rk);
                            if (!rraw || rraw.length < 20) continue;
                            var rts = 0;
                            try {
                                rts = Number(JSON.parse(rraw).lastUpdate) || 0;
                            } catch (eParseAid) {}
                            candidates.push({ aid: raid, ts: rts });
                        }
                        if (candidates.length > 0) {
                            candidates.sort(function(a, b) { return b.ts - a.ts; });
                            id = candidates[0].aid;
                            setAccountId(id);
                        }
                    } catch (eRecoverAid) {}
                }
                return id;
            }
            window.goldGameResolveAccountId = goldGameResolveAccountId;
            window.setGoldGameAccountId = setAccountId;
            var LEGACY_SAVE_KEY = 'goldGameSave';
            var SAVE_KEY_PREFIX = 'goldGameSave_';
            function goldGameSaveStorageKey(accountId) {
                var id = String(accountId || goldGameResolveAccountId() || '').trim();
                return id ? (SAVE_KEY_PREFIX + id) : LEGACY_SAVE_KEY;
            }
            function removeLegacyGoldGameSave() {
                try { localStorage.removeItem(LEGACY_SAVE_KEY); } catch (e) {}
            }
            function isStorageQuotaError(e) {
                return !!(e && (e.name === 'QuotaExceededError' || e.code === 22));
            }
            function applyGoldGameSaveCompaction(p, aggressive) {
                if (!p || typeof p !== 'object') return p;
                if (Array.isArray(p.actionLogs) && p.actionLogs.length > 5) p.actionLogs = p.actionLogs.slice(0, 5);
                if (Array.isArray(p.lotteryResults) && p.lotteryResults.length > 5) p.lotteryResults = p.lotteryResults.slice(0, 5);
                if (Array.isArray(p.battleLog) && p.battleLog.length > (aggressive ? 15 : 50)) {
                    p.battleLog = p.battleLog.slice(0, aggressive ? 15 : 50);
                }
                if (Array.isArray(p.goldLogs) && p.goldLogs.length > (aggressive ? 5 : 20)) {
                    p.goldLogs = p.goldLogs.slice(0, aggressive ? 5 : 20);
                }
                if (Array.isArray(p.clickTimestamps) && p.clickTimestamps.length > 0) {
                    p.clickTimestamps = p.clickTimestamps.slice(-(aggressive ? 10 : 30));
                }
                if (p.exploration && Array.isArray(p.exploration.logs) && p.exploration.logs.length > 20) {
                    p.exploration.logs = p.exploration.logs.slice(0, 20);
                }
                if (p.investmentGame) {
                    p.investmentGame.chartHistoryCache = {};
                    if (aggressive && Array.isArray(p.investmentGame.stocks)) {
                        p.investmentGame.stocks.forEach(function(stock) {
                            if (!stock) return;
                            if (Array.isArray(stock.priceHistory) && stock.priceHistory.length > 20) {
                                stock.priceHistory = stock.priceHistory.slice(-20);
                            }
                            if (stock.randomParams && Array.isArray(stock.randomParams.priceHistory) && stock.randomParams.priceHistory.length > 20) {
                                stock.randomParams.priceHistory = stock.randomParams.priceHistory.slice(-20);
                            }
                        });
                    }
                }
                if (p.liveStream) {
                    var ls = p.liveStream;
                    delete ls.danmakuPasswordInterval;
                    delete ls.wishListInterval;
                    delete ls.danmakuPasswordTimer;
                    if (Array.isArray(ls.donationHistory) && ls.donationHistory.length > 5) {
                        ls.donationHistory = ls.donationHistory.slice(-5);
                    }
                    if (!ls.isLive && Array.isArray(ls.viewers)) ls.viewers = [];
                    else if (Array.isArray(ls.viewers)) {
                        var maxV = aggressive ? 80 : 100;
                        if (ls.viewers.length > maxV) ls.viewers = ls.viewers.slice(-maxV);
                    }
                    if (typeof ls.displayViewerCount !== 'number' || ls.displayViewerCount < 0) {
                        ls.displayViewerCount = Array.isArray(ls.viewers) ? ls.viewers.length : 0;
                    }
                    if (ls.displayViewerCount < ls.viewers.length) {
                        ls.displayViewerCount = ls.viewers.length;
                    }
                }
                if (p.trading && p.trading.autoTrade && Array.isArray(p.trading.autoTrade.logs)) {
                    p.trading.autoTrade.logs = p.trading.autoTrade.logs.slice(0, aggressive ? 5 : 10);
                }
                if (p.companionExpedition && Array.isArray(p.companionExpedition.history)) {
                    p.companionExpedition.history = p.companionExpedition.history.slice(0, aggressive ? 3 : 10);
                }
                if (p.landlord && Object.prototype.hasOwnProperty.call(p.landlord, '_timerId')) delete p.landlord._timerId;
                if (p.worldMapBattle && p.worldMapBattle.autoBattleInterval != null) p.worldMapBattle.autoBattleInterval = null;
                if (p.backgroundBattle && p.backgroundBattle.interval != null) p.backgroundBattle.interval = null;
                if (aggressive && typeof p.avatar === 'string' && p.avatar.length > 12000) p.avatar = '';
                return p;
            }
            /** 本地存储满时仅清理非存档大项；绝不删除 goldGameSave / goldGameSave_* */
            function freeLocalStorageQuotaForSave(currentKey) {
                void currentKey;
                try {
                    var bg = localStorage.getItem('goldGameMainBackgroundUrl');
                    if (bg && bg.length > 150000) localStorage.removeItem('goldGameMainBackgroundUrl');
                } catch (e) {}
            }
            function readGoldGameSaveRawFromStorage(accountId) {
                var id = String(accountId != null ? accountId : '').trim();
                var loggedIn = !!getToken();
                if (!id && loggedIn) id = goldGameResolveAccountId();
                if (id) {
                    var key = goldGameSaveStorageKey(id);
                    try {
                        var rawScoped = localStorage.getItem(key);
                        if (rawScoped) return rawScoped;
                    } catch (e0) {}
                    try {
                        var legacyBound = localStorage.getItem(LEGACY_SAVE_KEY);
                        if (legacyBound) {
                            var oBound = JSON.parse(legacyBound);
                            if (oBound && oBound.accountId === id) return legacyBound;
                        }
                    } catch (e1) {}
                    /** 已登录且本账号 scoped 档为空：禁止回退读到其它账号或 legacy 开放档 */
                    if (loggedIn) return null;
                }
                try {
                    var legacyOpen = localStorage.getItem(LEGACY_SAVE_KEY);
                    if (legacyOpen) return legacyOpen;
                } catch (e2) {}
                /** 未登录 / 已登出：legacy 为空时回退读取 goldGameSave_*（避免登出后 scoped 档读不到） */
                try {
                    var bestRaw = null;
                    var bestTs = 0;
                    for (var i = 0; i < localStorage.length; i++) {
                        var k = localStorage.key(i);
                        if (!k || k.indexOf(SAVE_KEY_PREFIX) !== 0) continue;
                        var scoped = localStorage.getItem(k);
                        if (!scoped) continue;
                        var ts = 0;
                        try {
                            var parsed = JSON.parse(scoped);
                            ts = parsed && parsed.lastUpdate ? Number(parsed.lastUpdate) || 0 : 0;
                        } catch (eParse) {}
                        if (!bestRaw || ts >= bestTs) {
                            bestRaw = scoped;
                            bestTs = ts;
                        }
                    }
                    if (bestRaw) return bestRaw;
                } catch (eScan) {}
                return null;
            }
            function writeGoldGameSaveToLocal(data, accountId) {
                var id = String(accountId != null ? accountId : goldGameResolveAccountId() || '').trim();
                var key = goldGameSaveStorageKey(id);
                var obj = (typeof data === 'string') ? null : data;
                var saveObj = obj;
                if (obj) {
                    try {
                        saveObj = JSON.parse(JSON.stringify(obj));
                    } catch (cloneErr) {
                        saveObj = obj;
                    }
                    applyGoldGameSaveCompaction(saveObj, false);
                }
                var payload = (typeof data === 'string') ? data : JSON.stringify(saveObj);
                function tryWrite(p) {
                    localStorage.setItem(key, p);
                    if (id) removeLegacyGoldGameSave();
                }
                try {
                    tryWrite(payload);
                } catch (e) {
                    if (!isStorageQuotaError(e)) throw e;
                    freeLocalStorageQuotaForSave(key);
                    if (saveObj) {
                        applyGoldGameSaveCompaction(saveObj, true);
                        payload = JSON.stringify(saveObj);
                    } else {
                        try {
                            var parsed = JSON.parse(payload);
                            applyGoldGameSaveCompaction(parsed, true);
                            payload = JSON.stringify(parsed);
                        } catch (eParse) {}
                    }
                    try {
                        tryWrite(payload);
                    } catch (e2) {
                        var msg = '本地存档失败：浏览器存储空间已满（约 5MB）。可清理站点数据、删除过大的自定义背景，或登录后使用云存档。';
                        if (typeof logAction === 'function') logAction(msg, 'error');
                        else if (typeof alert === 'function') alert(msg);
                        throw e2;
                    }
                }
            }
            function lockGoldGameCloudSync() {
                window._goldGameCloudSyncLocked = true;
                window._goldGameCloudHydratedForAccountId = '';
            }
            function markGoldGameCloudHydrated(accountId) {
                var aid = String(accountId != null ? accountId : getAccountId() || '').trim();
                window._goldGameCloudHydratedForAccountId = aid;
                window._goldGameLocalSaveReadyForAccountId = aid;
                window._goldGameCloudSyncLocked = false;
            }
            function markGoldGameLocalSaveReady(accountId) {
                var aid = String(accountId != null ? accountId : getAccountId() || '').trim();
                if (aid) window._goldGameLocalSaveReadyForAccountId = aid;
            }
            function canUploadGoldGameCloudSave() {
                if (window._goldGameCloudSyncLocked) return false;
                if (!window._goldGameSaveLoadedOk) return false;
                if (!getToken() || !hasApi()) return false;
                var aid = String(getAccountId() || '').trim();
                if (!aid) aid = String(goldGameResolveAccountId() || '').trim();
                if (!aid) return false;
                var ready = String(window._goldGameLocalSaveReadyForAccountId || window._goldGameCloudHydratedForAccountId || '').trim();
                return ready === aid;
            }
            function clearDongtianInvShadowForAccount(accountId) {
                try { localStorage.removeItem('dongtian_inv_shadow_v1'); } catch (e0) {}
                try { sessionStorage.removeItem('dongtian_inv_shadow_v1'); } catch (e1) {}
                var id = String(accountId || '').trim();
                if (!id) return;
                var scoped = 'dongtian_inv_shadow_v2:' + id;
                try { localStorage.removeItem(scoped); } catch (e2) {}
                try { sessionStorage.removeItem(scoped); } catch (e3) {}
            }
            function onGoldGameAccountSwitch(prevAccountId, nextAccountId) {
                if (prevAccountId) clearDongtianInvShadowForAccount(prevAccountId);
                try {
                    var iframe = document.getElementById('dongtianJieIframe');
                    if (iframe && iframe.contentWindow && typeof iframe.contentWindow.dongtianResetClientSessionForAccountSwitch === 'function') {
                        iframe.contentWindow.dongtianResetClientSessionForAccountSwitch();
                    }
                } catch (eDtReset) {}
                removeLegacyGoldGameSave();
                window._goldGamePendingCloudSave = null;
                window._goldGameCloudHydratedForAccountId = '';
                window._goldGameLocalSaveReadyForAccountId = '';
                if (window._goldGameCloudUploadDebounceTimer) {
                    clearTimeout(window._goldGameCloudUploadDebounceTimer);
                    window._goldGameCloudUploadDebounceTimer = null;
                }
            }
            window.goldGameSaveStorageKey = goldGameSaveStorageKey;
            window.readGoldGameSaveRawFromStorage = readGoldGameSaveRawFromStorage;
            window.writeGoldGameSaveToLocal = writeGoldGameSaveToLocal;
            window.applyGoldGameSaveCompaction = applyGoldGameSaveCompaction;
            window.removeLegacyGoldGameSave = removeLegacyGoldGameSave;
            window.lockGoldGameCloudSync = lockGoldGameCloudSync;
            window.markGoldGameCloudHydrated = markGoldGameCloudHydrated;
            window.markGoldGameLocalSaveReady = markGoldGameLocalSaveReady;
            window.canUploadGoldGameCloudSave = canUploadGoldGameCloudSave;
            window.onGoldGameAccountSwitch = onGoldGameAccountSwitch;
            window.clearDongtianInvShadowForAccount = clearDongtianInvShadowForAccount;
            window.getGoldGameAuthToken = getToken;
            window.getGoldGameAuthUsername = getAuthUser;
            window.getGoldGameAccountId = getAccountId;

            function apiBase() { return (window.GOLD_GAME_API_BASE || '').replace(/\/$/, ''); }
            function hasApi() { return apiBase().length > 0; }
            window.hasApi = hasApi;

            function apiRequest(method, path, body, needAuth, timeoutMs) {
                var base = apiBase();
                if (!base) return Promise.reject(new Error('未配置服务器地址：请设置 window.GOLD_GAME_API_BASE'));
                var opt = { method: method || 'GET', headers: {}, cache: 'no-store' };
                if (needAuth && getToken()) opt.headers['Authorization'] = 'Bearer ' + getToken();
                // 仅 POST/PUT 等带 body 的请求才设 Content-Type，避免 GET 跨域时多一次 OPTIONS 预检
                if (body !== undefined) {
                    opt.headers['Content-Type'] = 'application/json';
                    opt.body = typeof body === 'string' ? body : JSON.stringify(body);
                }
                var uploadAbort = null;
                var uploadTimer = null;
                if (timeoutMs && typeof AbortController === 'function') {
                    uploadAbort = new AbortController();
                    opt.signal = uploadAbort.signal;
                    uploadTimer = setTimeout(function() {
                        try { uploadAbort.abort(); } catch (e) {}
                    }, timeoutMs);
                }
                return fetch(base + path, opt)
                    .then(function(r) {
                        return r.json().catch(function() { return { ok: false, message: '网络错误' }; }).then(function(data) {
                            if (r.status === 403 && data && data.banned) {
                                if (typeof goldGameLogout === 'function') goldGameLogout(true);
                                var statusEl = document.getElementById('goldGameAccountStatus');
                                if (statusEl) statusEl.textContent = '未登录';
                                if (data.message) alert(data.message);
                            }
                            // 需登录的接口返回 401：踢下线、过期、无效 token 等，一律清本地登录态（否则界面仍显示已登录但云存档无法上传）
                            if (r.status === 401 && needAuth && data) {
                                var reloadAfter = data.kicked === true;
                                if (typeof goldGameLogout === 'function') goldGameLogout(reloadAfter);
                                var statusEl401 = document.getElementById('goldGameAccountStatus');
                                if (statusEl401) statusEl401.textContent = '未登录';
                                if (data.message) alert(data.message);
                            }
                            if (data && typeof data === 'object') data.__httpStatus = r.status;
                            return data;
                        });
                    })
                    .catch(function(err) {
                        var msg = (err && err.message) ? String(err.message) : '';
                        if (uploadAbort && (err && err.name === 'AbortError')) {
                            return Promise.reject(new Error('上传超时（存档较大时请稍候再试或手动点「上传云存档」）'));
                        }
                        if (/failed to fetch|networkerror|cors|跨域/i.test(msg) || !msg) {
                            return Promise.reject(new Error('请求失败：当前网页无法联网，想要联网模式加QQ群902481027。'));
                        }
                        return Promise.reject(err);
                    })
                    .finally(function() {
                        if (uploadTimer) clearTimeout(uploadTimer);
                    });
            }

            
            window.goldGameApiRequest = apiRequest;

            /** 拉取 API 启动时生成的静态资源版本号，供主游戏/洞天劫脚本 ?b= / iframe ?v= 使用（重启 API 即更新） */
            function goldGameReloadForStaleMainAssets(serverBuild) {
                if (!serverBuild) return false;
                var loaded = window.__GOLD_GAME_ASSET_BUILD || window.__goldGameClientBuild || '';
                if (!loaded || String(serverBuild) === String(loaded)) return false;
                if (window.__goldGameMainReloadInProgress) return false;
                if (window._goldGameCloudLoadActive || window._goldGameCloudSyncLocked) return false;
                window.__goldGameMainReloadInProgress = true;
                try {
                    localStorage.setItem('__goldGameClientBuild', String(serverBuild));
                } catch (eLs) {}
                try {
                    if (typeof saveGame === 'function') saveGame();
                } catch (eSave) {}
                try {
                    if (typeof flushGoldGameCloudSaveKeepalive === 'function') flushGoldGameCloudSaveKeepalive();
                } catch (eCloud) {}
                try {
                    var url = new URL(location.href);
                    url.searchParams.set('v', String(serverBuild));
                    location.replace(url.toString());
                } catch (eUrl) {
                    location.reload();
                }
                return true;
            }
            window.goldGameReloadForStaleMainAssets = goldGameReloadForStaleMainAssets;

            function goldGameRefreshClientBuild() {
                if (!hasApi()) return Promise.resolve(null);
                var base = apiBase();
                if (!base) return Promise.resolve(window.__goldGameClientBuild || null);
                return fetch(base + '/api/client-build', { method: 'GET', cache: 'no-store' })
                    .then(function (r) {
                        return r.json().catch(function () {
                            return { ok: false };
                        });
                    })
                    .then(function (res) {
                        if (res && res.ok && res.build != null && res.build !== '') {
                            var serverBuild = String(res.build);
                            window.__goldGameClientBuild = serverBuild;
                            try {
                                localStorage.setItem('__goldGameClientBuild', serverBuild);
                            } catch (eStore) {}
                            goldGameReloadForStaleMainAssets(serverBuild);
                        }
                        return window.__goldGameClientBuild || null;
                    })
                    .catch(function () {
                        return window.__goldGameClientBuild || null;
                    });
            }
            window.goldGameRefreshClientBuild = goldGameRefreshClientBuild;

            function startGoldGameMainBuildWatch() {
                if (window.__goldGameMainBuildWatchHooked) return;
                window.__goldGameMainBuildWatchHooked = true;
                setTimeout(function () {
                    if (typeof goldGameRefreshClientBuild === 'function') goldGameRefreshClientBuild();
                }, 5000);
                document.addEventListener('visibilitychange', function () {
                    if (document.visibilityState === 'visible' && typeof goldGameRefreshClientBuild === 'function') {
                        goldGameRefreshClientBuild();
                    }
                });
                setInterval(function () {
                    if (typeof goldGameRefreshClientBuild === 'function') goldGameRefreshClientBuild();
                }, 60000);
            }
            window.startGoldGameMainBuildWatch = startGoldGameMainBuildWatch;

            function startGoldGamePostLoginLoops() {
                if (typeof startGoldGameMainBuildWatch === 'function') startGoldGameMainBuildWatch();
                else if (typeof goldGameRefreshClientBuild === 'function') goldGameRefreshClientBuild();
                if (typeof window.startGoldGameMapleCoinMinuteLoop === 'function') window.startGoldGameMapleCoinMinuteLoop();
                if (typeof window.startGoldGameNetworkFloatAnnouncementLoop === 'function') window.startGoldGameNetworkFloatAnnouncementLoop();
            }
            var _goldGameCloudLoadHideTimer = null;
            var _goldGameCloudLoadStepOrder = ['auth', 'fetch', 'save', 'parse', 'init', 'done'];
            function _goldGameCloudLoadStepIndex(stepKey) {
                if (!stepKey) return -1;
                return _goldGameCloudLoadStepOrder.indexOf(stepKey);
            }
            function showGoldGameCloudLoadProgress(statusText, percent, stepKey) {
                window._goldGameCloudLoadActive = true;
                if (_goldGameCloudLoadHideTimer) {
                    clearTimeout(_goldGameCloudLoadHideTimer);
                    _goldGameCloudLoadHideTimer = null;
                }
                var overlay = document.getElementById('goldGameCloudLoadOverlay');
                var dialog = document.getElementById('goldGameCloudLoadDialog');
                var status = document.getElementById('goldGameCloudLoadStatus');
                var bar = document.getElementById('goldGameCloudLoadBarFill');
                var pctEl = document.getElementById('goldGameCloudLoadPercent');
                if (status && statusText) status.textContent = statusText;
                if (typeof percent === 'number' && !isNaN(percent)) {
                    var p = Math.min(100, Math.max(0, Math.round(percent)));
                    if (pctEl) pctEl.textContent = p + '%';
                    if (bar) bar.style.width = p + '%';
                }
                if (stepKey) {
                    var idx = _goldGameCloudLoadStepIndex(stepKey);
                    var stepsRoot = document.getElementById('goldGameCloudLoadSteps');
                    if (stepsRoot) {
                        var rows = stepsRoot.querySelectorAll('[data-step]');
                        for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];
                            var sk = row.getAttribute('data-step');
                            var si = _goldGameCloudLoadStepIndex(sk);
                            var icon = row.querySelector('.gold-game-cloud-step-icon');
                            row.classList.remove('active', 'done');
                            if (si >= 0 && si < idx) {
                                row.classList.add('done');
                                if (icon) icon.textContent = '✓';
                            } else if (si === idx) {
                                row.classList.add('active');
                                if (icon) icon.textContent = '●';
                            } else if (icon) {
                                icon.textContent = '○';
                            }
                        }
                    }
                }
                if (overlay) overlay.style.display = 'block';
                if (dialog) dialog.style.display = 'block';
            }
            window.showGoldGameCloudLoadProgress = showGoldGameCloudLoadProgress;
            window.updateGoldGameCloudLoadProgress = showGoldGameCloudLoadProgress;
            window.hideGoldGameCloudLoadProgress = function(delayMs) {
                var d = typeof delayMs === 'number' ? delayMs : 400;
                if (_goldGameCloudLoadHideTimer) clearTimeout(_goldGameCloudLoadHideTimer);
                _goldGameCloudLoadHideTimer = setTimeout(function() {
                    _goldGameCloudLoadHideTimer = null;
                    window._goldGameCloudLoadActive = false;
                    var overlay = document.getElementById('goldGameCloudLoadOverlay');
                    var dialog = document.getElementById('goldGameCloudLoadDialog');
                    if (overlay) overlay.style.display = 'none';
                    if (dialog) dialog.style.display = 'none';
                    var bar = document.getElementById('goldGameCloudLoadBarFill');
                    var pctEl = document.getElementById('goldGameCloudLoadPercent');
                    var status = document.getElementById('goldGameCloudLoadStatus');
                    if (bar) bar.style.width = '0%';
                    if (pctEl) pctEl.textContent = '0%';
                    if (status) status.textContent = '准备中…';
                    var stepsRoot = document.getElementById('goldGameCloudLoadSteps');
                    if (stepsRoot) {
                        var rows = stepsRoot.querySelectorAll('[data-step]');
                        for (var i = 0; i < rows.length; i++) {
                            rows[i].classList.remove('active', 'done');
                            var icon = rows[i].querySelector('.gold-game-cloud-step-icon');
                            if (icon) icon.textContent = '○';
                        }
                    }
                }, Math.max(0, d));
            };
            function hideGoldGameCloudLoadProgress(delayMs) {
                window.hideGoldGameCloudLoadProgress(delayMs);
            }
            /** 应用云端存档：写 localStorage 后立即 resolve，重 loadGame 放到下一帧，登录弹窗不必等 loadSave 跑完 */
            function applyGoldGameCloudSaveData(data, opts) {
                opts = opts || {};
                if (!data || typeof data !== 'object') return Promise.resolve(false);
                var rawProbe = '';
                try { rawProbe = JSON.stringify(data); } catch (eProbe) { return Promise.resolve(false); }
                if (typeof isPlausibleGoldGameSaveRaw === 'function' && !isPlausibleGoldGameSaveRaw(rawProbe)) {
                    return Promise.resolve(false);
                }
                if (opts.showProgress !== false) showGoldGameCloudLoadProgress('正在写入本地存档…', 55, 'save');
                try {
                    var writeAid = data && data.accountId != null ? String(data.accountId).trim() : goldGameResolveAccountId();
                    if (typeof writeGoldGameSaveToLocal === 'function') writeGoldGameSaveToLocal(data, writeAid || undefined);
                    else localStorage.setItem('goldGameSave', JSON.stringify(data));
                } catch (e) {
                    hideGoldGameCloudLoadProgress(0);
                    return Promise.reject(new Error('写入本地失败'));
                }
                window._goldGamePendingCloudSave = data;
                return new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        try {
                            showGoldGameCloudLoadProgress('正在解析存档数据…', 72, 'parse');
                            if (typeof loadGame === 'function') loadGame();
                            else if (typeof loadSave === 'function') loadSave(data);
                            if (typeof markGoldGameCloudHydrated === 'function') markGoldGameCloudHydrated(data.accountId);
                            showGoldGameCloudLoadProgress('加载完成，即将进入游戏…', 100, 'done');
                            if (opts.logMessage && typeof logAction === 'function') logAction(opts.logMessage, 'success');
                            hideGoldGameCloudLoadProgress(opts.hideDelay != null ? opts.hideDelay : 550);
                            resolve(true);
                        } catch (eLoad) {
                            hideGoldGameCloudLoadProgress(0);
                            console.error('applyGoldGameCloudSaveData', eLoad);
                            reject(eLoad);
                        }
                    }, 0);
                });
            }
            function finishGoldGameAuthAfterCloudSync(msgEl, successText) {
                if (msgEl && successText) {
                    msgEl.textContent = successText;
                    msgEl.style.color = 'green';
                }
                if (document.getElementById('goldGameAccountStatus') && typeof getGoldGameAuthUsername === 'function') {
                    document.getElementById('goldGameAccountStatus').textContent = '已登录: ' + getGoldGameAuthUsername();
                }
                if (typeof closeGoldGameLoginDialog === 'function') closeGoldGameLoginDialog();
            }
            window.goldGameLoginAndDownloadSave = function(username, password, msgEl) {
                var prevAccountId = (typeof getAccountId === 'function') ? String(getAccountId() || '').trim() : '';
                var switched = false;
                lockGoldGameCloudSync();
                showGoldGameCloudLoadProgress('正在验证账号并登录…', 8, 'auth');
                return goldGameLogin(username, password, { includeSave: true, skipPostLoginLoops: true, prevAccountId: prevAccountId }).then(function(res) {
                    if (typeof closeGoldGameLoginDialog === 'function') closeGoldGameLoginDialog();
                    showGoldGameCloudLoadProgress('登录成功，正在从服务器获取云存档…', 38, 'fetch');
                    var newAccountId = (typeof getAccountId === 'function') ? String(getAccountId() || '').trim() : '';
                    switched = !!(prevAccountId && newAccountId && prevAccountId !== newAccountId);
                    if (res.saveData !== undefined) {
                        if (res.saveData && typeof res.saveData === 'object' && Object.keys(res.saveData).length > 0) {
                            return applyGoldGameCloudSaveData(res.saveData, { logMessage: '已从云端加载最新存档' }).then(function () {
                                if (switched) {
                                    setTimeout(function () { window.location.reload(); }, 80);
                                }
                            });
                        }
                        showGoldGameCloudLoadProgress('云端暂无存档，即将进入游戏…', 100, 'done');
                        if (typeof logAction === 'function') logAction('云端暂无存档', 'common');
                        if (typeof markGoldGameCloudHydrated === 'function') markGoldGameCloudHydrated(newAccountId);
                        hideGoldGameCloudLoadProgress(700);
                        if (switched) {
                            setTimeout(function () { window.location.reload(); }, 80);
                        }
                        return null;
                    }
                    return goldGameDownloadSaveNoCooldown();
                }).then(function() {
                    if (switched) {
                        setTimeout(function () { window.location.reload(); }, 80);
                        return;
                    }
                    finishGoldGameAuthAfterCloudSync(msgEl, '');
                }).catch(function(e) {
                    hideGoldGameCloudLoadProgress(0);
                    window._goldGameCloudSyncLocked = false;
                    var err = e && e.message ? e.message : '登录失败';
                    if (typeof getGoldGameAuthUsername === 'function' && getGoldGameAuthUsername()) {
                        finishGoldGameAuthAfterCloudSync(msgEl, '登录成功，云存档未加载: ' + err);
                    } else {
                        if (msgEl) { msgEl.style.color = ''; msgEl.textContent = err; }
                    }
                    throw e;
                }).finally(function() {
                    if (typeof markGoldGameCloudHydrated === 'function' && typeof getAccountId === 'function' && getToken()) {
                        markGoldGameCloudHydrated(getAccountId());
                    }
                    startGoldGamePostLoginLoops();
                });
            };
            window.goldGameRegisterAndDownloadSave = function(username, password, msgEl) {
                var prevAccountId = (typeof getAccountId === 'function') ? String(getAccountId() || '').trim() : '';
                lockGoldGameCloudSync();
                showGoldGameCloudLoadProgress('正在注册账号…', 10, 'auth');
                return goldGameRegister(username, password, { includeSave: true, skipPostLoginLoops: true, prevAccountId: prevAccountId }).then(function(res) {
                    if (typeof closeGoldGameLoginDialog === 'function') closeGoldGameLoginDialog();
                    showGoldGameCloudLoadProgress('注册成功，正在检查云存档…', 40, 'fetch');
                    if (res.saveData !== undefined) {
                        showGoldGameCloudLoadProgress('注册成功，云端暂无存档…', 100, 'done');
                        if (typeof logAction === 'function') logAction('云端暂无存档', 'common');
                        if (typeof markGoldGameCloudHydrated === 'function') markGoldGameCloudHydrated(getAccountId());
                        hideGoldGameCloudLoadProgress(700);
                        if (prevAccountId && getAccountId() && prevAccountId !== getAccountId()) {
                            setTimeout(function () { window.location.reload(); }, 80);
                        }
                        return null;
                    }
                    return goldGameDownloadSaveNoCooldown();
                }).then(function() {
                    finishGoldGameAuthAfterCloudSync(msgEl, '');
                }).catch(function(e) {
                    hideGoldGameCloudLoadProgress(0);
                    window._goldGameCloudSyncLocked = false;
                    var err = e && e.message ? e.message : '注册失败';
                    if (typeof getGoldGameAuthUsername === 'function' && getGoldGameAuthUsername()) {
                        finishGoldGameAuthAfterCloudSync(msgEl, '注册成功，云存档未加载: ' + err);
                    } else {
                        if (msgEl) { msgEl.style.color = ''; msgEl.textContent = err; }
                    }
                    throw e;
                }).finally(function() {
                    if (typeof markGoldGameCloudHydrated === 'function' && typeof getAccountId === 'function' && getToken()) {
                        markGoldGameCloudHydrated(getAccountId());
                    }
                    startGoldGamePostLoginLoops();
                });
            };

            window.goldGameLogin = function(username, password, opts) {
                opts = opts || {};
                var prevAccountId = opts.prevAccountId != null ? String(opts.prevAccountId || '').trim() : String(getAccountId() || '').trim();
                var body = { username: username, password: password };
                if (opts.includeSave) body.includeSave = true;
                return apiRequest('POST', '/api/login', body, false).then(function(res) {
                    if (res.ok && res.token) {
                        var nextAccountId = String(res.accountId || '').trim();
                        var needSwitch = prevAccountId && nextAccountId && prevAccountId !== nextAccountId;
                        var closeP =
                            needSwitch && typeof dongtianEnsureClosedBeforeAuthChange === 'function'
                                ? dongtianEnsureClosedBeforeAuthChange()
                                : Promise.resolve();
                        return closeP.then(function() {
                            if (needSwitch && typeof onGoldGameAccountSwitch === 'function') {
                                onGoldGameAccountSwitch(prevAccountId, nextAccountId);
                            }
                            setToken(res.token); setAuthUser(res.username || username); setAccountId(nextAccountId);
                            if (typeof window.syncGoldGameAccountAuthButtons === 'function') window.syncGoldGameAccountAuthButtons();
                            if (res.sessionNotice && typeof logAction === 'function') logAction(res.sessionNotice, 'common');
                            if (!opts.skipPostLoginLoops) startGoldGamePostLoginLoops();
                            return res;
                        });
                    }
                    throw new Error(res.message || '登录失败');
                });
            };
            window.goldGameRegister = function(username, password, opts) {
                opts = opts || {};
                var prevAccountId = opts.prevAccountId != null ? String(opts.prevAccountId || '').trim() : String(getAccountId() || '').trim();
                var body = { username: username, password: password };
                if (opts.includeSave) body.includeSave = true;
                return apiRequest('POST', '/api/register', body, false).then(function(res) {
                    if (res.ok && res.token) {
                        var nextAccountId = String(res.accountId || '').trim();
                        var needSwitch = prevAccountId && nextAccountId && prevAccountId !== nextAccountId;
                        var closeP =
                            needSwitch && typeof dongtianEnsureClosedBeforeAuthChange === 'function'
                                ? dongtianEnsureClosedBeforeAuthChange()
                                : Promise.resolve();
                        return closeP.then(function() {
                            if (needSwitch && typeof onGoldGameAccountSwitch === 'function') {
                                onGoldGameAccountSwitch(prevAccountId, nextAccountId);
                            }
                            setToken(res.token); setAuthUser(res.username || username); setAccountId(nextAccountId);
                            if (typeof window.syncGoldGameAccountAuthButtons === 'function') window.syncGoldGameAccountAuthButtons();
                            if (res.sessionNotice && typeof logAction === 'function') logAction(res.sessionNotice, 'common');
                            if (!opts.skipPostLoginLoops) startGoldGamePostLoginLoops();
                            return res;
                        });
                    }
                    throw new Error(res.message || '注册失败');
                });
            };
            window.goldGameLogout = function(optReload) {
                if (window._goldGameLogoutInProgress) return;
                window._goldGameLogoutInProgress = true;
                if (typeof window.stopGoldGameMapleCoinMinuteLoop === 'function') window.stopGoldGameMapleCoinMinuteLoop();
                if (typeof window.stopGoldGameNetworkFloatAnnouncementLoop === 'function') window.stopGoldGameNetworkFloatAnnouncementLoop();
                var prevAid = (typeof getAccountId === 'function') ? String(getAccountId() || '').trim() : '';
                if (prevAid && typeof player !== 'undefined' && player && !window._goldGameCloudSyncLocked) {
                    try {
                        player.accountId = prevAid;
                        if (typeof writeGoldGameSaveToLocal === 'function') writeGoldGameSaveToLocal(player, prevAid);
                    } catch (eLogoutSave) {}
                }
                var logoutToken = (typeof getToken === 'function') ? getToken() : '';
                var logoutBase = (typeof apiBase === 'function') ? apiBase() : '';
                var shouldReload = optReload === true || (hasApi() && !!prevAid);
                function finishGoldGameLocalLogout() {
                    if (typeof lockGoldGameCloudSync === 'function') lockGoldGameCloudSync();
                    if (prevAid && typeof player !== 'undefined' && player) {
                        try {
                            var offlineCopy = JSON.stringify(player);
                            localStorage.setItem(LEGACY_SAVE_KEY, offlineCopy);
                        } catch (eLeg) {}
                    }
                    if (prevAid && typeof clearDongtianInvShadowForAccount === 'function') {
                        clearDongtianInvShadowForAccount(prevAid);
                    } else if (prevAid) {
                        try { localStorage.removeItem('dongtian_inv_shadow_v1'); } catch (eSh0) {}
                    }
                    setToken(''); setAuthUser(''); setAccountId('');
                    if (shouldReload) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 0);
                        return;
                    }
                    if (typeof window.syncGoldGameAccountAuthButtons === 'function') window.syncGoldGameAccountAuthButtons();
                    window._goldGameLogoutInProgress = false;
                }
                function doServerLogoutAndFinish() {
                    if (logoutToken && logoutBase) {
                        fetch(logoutBase + '/api/logout', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + logoutToken,
                                'Content-Type': 'application/json'
                            },
                            keepalive: true
                        }).catch(function() {}).finally(finishGoldGameLocalLogout);
                    } else {
                        finishGoldGameLocalLogout();
                    }
                }
                /** 登出账号/登出游戏前尽力上传云存档，最多等待约 15 秒再清 token */
                function flushCloudBeforeLogoutThenProceed() {
                    var preClose =
                        typeof dongtianEnsureClosedBeforeAuthChange === 'function'
                            ? dongtianEnsureClosedBeforeAuthChange()
                            : Promise.resolve();
                    preClose.finally(function () {
                    var uploadDone = Promise.resolve();
                    if (logoutToken && logoutBase) {
                        try {
                            if (typeof saveGame === 'function') saveGame();
                        } catch (eSave) {}
                        if (typeof canUploadGoldGameCloudSave === 'function' && canUploadGoldGameCloudSave() && typeof goldGameUploadSave === 'function') {
                            uploadDone = goldGameUploadSave({ silentInvalid: true, uploadTimeoutMs: 45000 }).catch(function() {});
                        } else if (typeof flushGoldGameCloudSaveKeepalive === 'function') {
                            flushGoldGameCloudSaveKeepalive();
                        }
                    }
                    Promise.race([
                        uploadDone,
                        new Promise(function(r) { setTimeout(r, 15000); })
                    ]).finally(doServerLogoutAndFinish);
                    });
                }
                flushCloudBeforeLogoutThenProceed();
            };
          
            document.addEventListener('keydown', function(e) {
                if (!hasApi() || !getToken()) return;
                if (e.key === 'F12' || (e.keyCode && e.keyCode === 123)) {
                    e.preventDefault();
                    apiRequest('POST', '/api/cheat-trigger', {}, true).then(function(res) {
                        if (typeof goldGameLogout === 'function') goldGameLogout(true);
                        var statusEl = document.getElementById('goldGameAccountStatus');
                        if (statusEl) statusEl.textContent = '未登录';
                        alert(res.message || '检测到违规操作，账号已被封禁');
                    }).catch(function() {});
                }
            }, true);
            function isPlausibleGoldGameSaveRaw(raw) {
                if (!raw || typeof raw !== 'string' || raw.length < 20 || raw === '{}') return false;
                try {
                    var o = JSON.parse(raw);
                    if (!o || typeof o !== 'object' || Array.isArray(o)) return false;
                    if ('gold' in o || typeof o.name === 'string' || typeof o.dimensionLevel === 'number' || Array.isArray(o.equipment)) return true;
                    return Object.keys(o).length >= 10;
                } catch (e) { return false; }
            }
            function runGoldGameUploadSaveOnce(opts) {
                opts = opts || {};
                if (!hasApi()) {
                    var noApiErr = new Error('未配置服务器地址');
                    if (!opts.silentInvalid && typeof logAction === 'function') logAction('未配置服务器地址', 'common');
                    return Promise.reject(noApiErr);
                }
                if (!canUploadGoldGameCloudSave()) {
                    if (opts.silentInvalid) return Promise.resolve();
                    return Promise.reject(new Error('登录同步尚未完成，请稍后再上传云存档'));
                }
                // 用 setTimeout(0) 而非 requestAnimationFrame：后台/最小化标签页会暂停 rAF，导致「每 5 秒定时器在跑但永远不真正上传」
                return new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        try {
                            if (typeof saveGame === 'function') saveGame();
                        } catch (e) {
                            reject(e);
                            return;
                        }
                        var raw = '';
                        try {
                            if (typeof readGoldGameSaveRawFromStorage === 'function') raw = readGoldGameSaveRawFromStorage() || '{}';
                            else raw = localStorage.getItem('goldGameSave') || '{}';
                        } catch (e) { raw = '{}'; }
                        if (!isPlausibleGoldGameSaveRaw(raw)) {
                            if (opts.silentInvalid) { resolve(); return; }
                            reject(new Error('本地存档尚未就绪或内容无效，请开始游戏后再上传'));
                            return;
                        }
                        try {
                            var parsed = JSON.parse(raw);
                            var curAid = String(getAccountId() || '').trim();
                            if (parsed && parsed.accountId && curAid && parsed.accountId !== curAid) {
                                if (opts.silentInvalid) { resolve(); return; }
                                reject(new Error('本地存档与当前登录账号不一致，已取消上传'));
                                return;
                            }
                        } catch (eParse) {}
                        apiRequest('POST', '/api/save', raw, true, opts.uploadTimeoutMs).then(function(res) {
                            if (!res.ok) throw new Error(res.message || '上传失败');
                        }).then(resolve).catch(reject);
                    }, 0);
                });
            }
            // 串行上传：大存档一次 POST 可能超过 5 秒，避免定时器叠加上传导致超时/503 与 saveGame 卡死
            window.goldGameUploadSave = function(opts) {
                if (window._goldGameUploadPromise) {
                    window._goldGameUploadPending = true;
                    return window._goldGameUploadPromise;
                }
                var uploadOpts = opts || {};
                if (!uploadOpts.uploadTimeoutMs) uploadOpts.uploadTimeoutMs = 120000;
                window._goldGameUploadPromise = runGoldGameUploadSaveOnce(uploadOpts).finally(function() {
                    window._goldGameUploadPromise = null;
                    if (window._goldGameUploadPending) {
                        window._goldGameUploadPending = false;
                        window.goldGameUploadSave({ silentInvalid: true, uploadTimeoutMs: uploadOpts.uploadTimeoutMs }).catch(function() {});
                    }
                });
                return window._goldGameUploadPromise;
            };
            window.goldGameDownloadSave = function() {
                if (!hasApi()) { if (typeof logAction === 'function') logAction('未配置服务器地址', 'common'); return Promise.reject(); }
                showGoldGameCloudLoadProgress('正在从服务器下载云存档…', 35, 'fetch');
                return apiRequest('GET', '/api/save', undefined, true).then(function(res) {
                    if (!res.ok) { hideGoldGameCloudLoadProgress(0); throw new Error(res.message || '下载失败'); }
                    if (res.data && typeof res.data === 'object') {
                        var rawProbe = '';
                        try { rawProbe = JSON.stringify(res.data); } catch (eP) { rawProbe = ''; }
                        if (rawProbe && typeof isPlausibleGoldGameSaveRaw === 'function' && isPlausibleGoldGameSaveRaw(rawProbe)) {
                            return applyGoldGameCloudSaveData(res.data, { logMessage: '已从云端加载存档' });
                        }
                    }
                    if (typeof markGoldGameCloudHydrated === 'function') markGoldGameCloudHydrated(getAccountId());
                    showGoldGameCloudLoadProgress('云端暂无存档', 100, 'done');
                    hideGoldGameCloudLoadProgress(600);
                    if (typeof logAction === 'function') logAction('云端暂无存档', 'common');
                }).catch(function(e) {
                    hideGoldGameCloudLoadProgress(0);
                    throw e;
                });
            };
            window.goldGameDownloadSaveNoCooldown = function() {
                if (!hasApi()) { if (typeof logAction === 'function') logAction('未配置服务器地址', 'common'); return Promise.reject(); }
                if (!window._goldGameCloudLoadActive) showGoldGameCloudLoadProgress('正在从服务器获取云存档…', 38, 'fetch');
                return apiRequest('GET', '/api/save-no-cooldown', undefined, true).then(function(res) {
                    if (!res.ok) { hideGoldGameCloudLoadProgress(0); throw new Error(res.message || '下载失败'); }
                    if (res.data && typeof res.data === 'object') {
                        var rawProbe = '';
                        try { rawProbe = JSON.stringify(res.data); } catch (eP2) { rawProbe = ''; }
                        if (rawProbe && typeof isPlausibleGoldGameSaveRaw === 'function' && isPlausibleGoldGameSaveRaw(rawProbe)) {
                            return applyGoldGameCloudSaveData(res.data, { logMessage: '已从云端加载最新存档' });
                        }
                    }
                    if (typeof markGoldGameCloudHydrated === 'function') markGoldGameCloudHydrated(getAccountId());
                    showGoldGameCloudLoadProgress('云端暂无存档', 100, 'done');
                    hideGoldGameCloudLoadProgress(600);
                    if (typeof logAction === 'function') logAction('云端暂无存档', 'common');
                }).catch(function(e) {
                    hideGoldGameCloudLoadProgress(0);
                    throw e;
                });
            };
           
            window.goldGameCheckAbyssCurrency = function(exclusiveCurrency) {
                if (!hasApi() || !getToken()) return Promise.resolve();
                var val = (exclusiveCurrency != null && !isNaN(exclusiveCurrency)) ? Number(exclusiveCurrency) : 0;
                return apiRequest('POST', '/api/abyss-currency-check', { exclusiveCurrency: val }, true).then(function(res) {
                    if (res && res.banned) {
                        if (typeof goldGameLogout === 'function') goldGameLogout(true);
                        var statusEl = document.getElementById('goldGameAccountStatus');
                        if (statusEl) statusEl.textContent = '未登录';
                        alert(res.message || '深渊币异常，账号已被封禁');
                    }
                    return res;
                }).catch(function() {});
            };
            window.goldGameCheckAbyssVault = function(abyssVaultTotal) {
                if (!hasApi() || !getToken()) return Promise.resolve();
                var val = (abyssVaultTotal != null && !isNaN(abyssVaultTotal)) ? Number(abyssVaultTotal) : 0;
                return apiRequest('POST', '/api/abyss-vault-check', { abyssVaultTotal: val }, true).then(function(res) {
                    if (res && res.banned) {
                        if (typeof goldGameLogout === 'function') goldGameLogout(true);
                        var statusEl = document.getElementById('goldGameAccountStatus');
                        if (statusEl) statusEl.textContent = '未登录';
                        alert(res.message || '深渊宝库数量异常，账号已被封禁');
                    }
                    return res;
                }).catch(function() {});
            };
            function logGoldGameAutoUploadFailureThrottled(err) {
                var now = Date.now();
                if (!window._goldGameAutoUploadFailAt) window._goldGameAutoUploadFailAt = 0;
                if (now - window._goldGameAutoUploadFailAt < 120000) return;
                window._goldGameAutoUploadFailAt = now;
                var msg = (err && err.message) ? String(err.message) : '未知错误';
                if (typeof logAction === 'function') {
                    logAction('云存档自动上传失败（进度仅在本机，换设备前请点「上传云存档」或重新登录）: ' + msg, 'common');
                }
            }
            function shouldRetryGoldGameAutoUpload(err) {
                var msg = (err && err.message) ? String(err.message) : '';
                return /timeout|超时|503|网络|fetch|failed to fetch|请求失败/i.test(msg);
            }
            function retryGoldGameAutoUploadOnce(delayMs) {
                if (window._goldGameAutoUploadRetryTimer) return;
                window._goldGameAutoUploadRetryTimer = setTimeout(function() {
                    window._goldGameAutoUploadRetryTimer = null;
                    if (!getToken() || !hasApi() || typeof goldGameUploadSave !== 'function') return;
                    if (!canUploadGoldGameCloudSave()) return;
                    goldGameUploadSave({ silentInvalid: true }).catch(function(e) {
                        logGoldGameAutoUploadFailureThrottled(e);
                    });
                }, delayMs || 8000);
            }
            /** 关页/切后台：用 keepalive 尽力把当前本地档 POST 出去（beforeunload 里 6 秒 debounce 来不及完成） */
            function flushGoldGameCloudSaveKeepalive() {
                if (!canUploadGoldGameCloudSave() || !hasApi()) return false;
                try {
                    if (typeof saveGame === 'function') saveGame();
                } catch (eSave) {}
                var raw = '';
                try {
                    if (typeof readGoldGameSaveRawFromStorage === 'function') raw = readGoldGameSaveRawFromStorage() || '{}';
                    else raw = localStorage.getItem('goldGameSave') || '{}';
                } catch (e) { return false; }
                if (!isPlausibleGoldGameSaveRaw(raw)) return false;
                try {
                    var parsed = JSON.parse(raw);
                    var curAid = String(getAccountId() || '').trim();
                    if (parsed && parsed.accountId && curAid && parsed.accountId !== curAid) return false;
                } catch (eParse) {}
                var base = apiBase();
                var token = getToken();
                if (!base || !token) return false;
                fetch(base + '/api/save', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                    body: raw,
                    keepalive: true
                }).catch(function() {});
                return true;
            }
            window.flushGoldGameCloudSaveKeepalive = flushGoldGameCloudSaveKeepalive;
            if (typeof document !== 'undefined') {
                document.addEventListener('visibilitychange', function() {
                    if (document.visibilityState === 'hidden') flushGoldGameCloudSaveKeepalive();
                });
                window.addEventListener('pagehide', function() {
                    flushGoldGameCloudSaveKeepalive();
                });
            }
            var GOLD_GAME_AUTO_UPLOAD_MS = 60 * 1000;
            function isDongtianJiePanelOpen() {
                try {
                    var ui = document.getElementById('dongtianJieUI');
                    return !!(ui && ui.classList && ui.classList.contains('dongtian-open'));
                } catch (eDt) { return false; }
            }
            function tickGoldGameAutoUpload() {
                if (!getToken() || !hasApi() || typeof goldGameUploadSave !== 'function') return;
                if (!canUploadGoldGameCloudSave()) return;
                if (isDongtianJiePanelOpen()) return;
                setTimeout(function() {
                    goldGameUploadSave({ silentInvalid: true }).catch(function(e) {
                        logGoldGameAutoUploadFailureThrottled(e);
                        if (shouldRetryGoldGameAutoUpload(e)) retryGoldGameAutoUploadOnce(8000);
                    });
                }, 0);
            }
            if (typeof registerInterval === 'function') {
                registerInterval(tickGoldGameAutoUpload, GOLD_GAME_AUTO_UPLOAD_MS);
            } else {
                setInterval(tickGoldGameAutoUpload, GOLD_GAME_AUTO_UPLOAD_MS);
            }
            // 手动 saveGame 后延迟上传（与定时轮询互补，连续存档只触发一次）
            var _goldGameCloudUploadDebounceTimer = null;
            window.scheduleGoldGameCloudUpload = function() {
                if (!getToken() || !hasApi() || typeof goldGameUploadSave !== 'function') return;
                if (!canUploadGoldGameCloudSave()) return;
                if (_goldGameCloudUploadDebounceTimer) clearTimeout(_goldGameCloudUploadDebounceTimer);
                _goldGameCloudUploadDebounceTimer = setTimeout(function() {
                    _goldGameCloudUploadDebounceTimer = null;
                    goldGameUploadSave({ silentInvalid: true }).catch(function(e) {
                        logGoldGameAutoUploadFailureThrottled(e);
                        if (shouldRetryGoldGameAutoUpload(e)) retryGoldGameAutoUploadOnce(6000);
                    });
                }, 6000);
            };
            window.getGoldGameNetworkFloatAnnouncementEnabled = function() {
                return localStorage.getItem('goldGameNetworkFloatAnnouncementEnabled') !== 'false';
            };
            window.toggleGoldGameNetworkFloatAnnouncement = function() {
                var key = 'goldGameNetworkFloatAnnouncementEnabled';
                var on = localStorage.getItem(key) !== 'false';
                localStorage.setItem(key, on ? 'false' : 'true');
                if (typeof window.updateGoldGameNetworkFloatToggleButton === 'function') window.updateGoldGameNetworkFloatToggleButton();
                if (typeof logAction === 'function') logAction(on ? '已关闭联网掉落漂浮播报' : '已开启联网掉落漂浮播报', on ? 'common' : 'success');
            };
            window.updateGoldGameNetworkFloatToggleButton = function() {
                var btn = document.getElementById('goldGameNetworkFloatToggleBtn');
                if (!btn) return;
                btn.textContent = (localStorage.getItem('goldGameNetworkFloatAnnouncementEnabled') !== 'false') ? '关闭' : '开启';
            };
            window._goldGameNetworkFloatLoopTimer = window._goldGameNetworkFloatLoopTimer || null;
            window._goldGameNetworkFloatEventSource = window._goldGameNetworkFloatEventSource || null;
            window.pollGoldGameNetworkFloatAnnouncements = function() {
                if (!hasApi() || !getToken()) return Promise.resolve({ ok: false, list: [] });
                if (localStorage.getItem('goldGameNetworkFloatAnnouncementEnabled') === 'false') return Promise.resolve({ ok: true, list: [] });
                var since = 0;
                try { since = parseInt(localStorage.getItem('goldGameNetworkFloatLastSeenId') || '0', 10) || 0; } catch (e) { since = 0; }
                return apiRequest('GET', '/api/network-float-announcements?sinceId=' + encodeURIComponent(String(since)), undefined, true).then(function(res) {
                    if (!res || !res.ok) return res || { ok: false };
                    var latestId = Number(res.latestId || 0);
                    // 服务器重启后序号会从 0 重新开始；若本地 sinceId 过大，会导致一直收不到新播报
                    if (Number.isFinite(latestId) && latestId < since) {
                        since = latestId;
                        localStorage.setItem('goldGameNetworkFloatLastSeenId', String(since));
                    }
                    if (!Array.isArray(res.list) || res.list.length <= 0) return res;
                    var nextId = since;
                    for (var i = 0; i < res.list.length; i++) {
                        var a = res.list[i] || {};
                        var idNum = Number(a.id || 0);
                        if (idNum > nextId) nextId = idNum;
                        if (typeof window.showNetworkFloatAnnouncementBar === 'function') window.showNetworkFloatAnnouncementBar(a);
                    }
                    localStorage.setItem('goldGameNetworkFloatLastSeenId', String(nextId));
                    return res;
                }).catch(function() { return { ok: false, list: [] }; });
            };
            window.startGoldGameNetworkFloatAnnouncementLoop = function() {
                if (window._goldGameNetworkFloatEventSource || window._goldGameNetworkFloatLoopTimer) return;
                // 先拉一次历史，避免连接建立前漏显示
                window.pollGoldGameNetworkFloatAnnouncements();
                if (typeof EventSource === 'function' && hasApi() && getToken()) {
                    try {
                        var url = apiBase() + '/api/network-float-stream?token=' + encodeURIComponent(getToken());
                        var es = new EventSource(url);
                        window._goldGameNetworkFloatEventSource = es;
                        es.onmessage = function(ev) {
                            try {
                                var a = JSON.parse(ev.data || '{}');
                                var idNum = Number(a.id || 0);
                                var since = 0;
                                try { since = parseInt(localStorage.getItem('goldGameNetworkFloatLastSeenId') || '0', 10) || 0; } catch (e) { since = 0; }
                                if (idNum > since) {
                                    localStorage.setItem('goldGameNetworkFloatLastSeenId', String(idNum));
                                    if (typeof window.showNetworkFloatAnnouncementBar === 'function') window.showNetworkFloatAnnouncementBar(a);
                                }
                            } catch (e) {}
                        };
                        es.onerror = function() {
                            if (window._goldGameNetworkFloatEventSource) {
                                try { window._goldGameNetworkFloatEventSource.close(); } catch (e) {}
                            }
                            window._goldGameNetworkFloatEventSource = null;
                            if (!window._goldGameNetworkFloatLoopTimer) {
                                window._goldGameNetworkFloatLoopTimer = setInterval(function() { window.pollGoldGameNetworkFloatAnnouncements(); }, 4000);
                            }
                        };
                        return;
                    } catch (e) {}
                }
                if (!window._goldGameNetworkFloatLoopTimer) {
                    window._goldGameNetworkFloatLoopTimer = setInterval(function() { window.pollGoldGameNetworkFloatAnnouncements(); }, 4000);
                }
            };
            window.stopGoldGameNetworkFloatAnnouncementLoop = function() {
                if (window._goldGameNetworkFloatEventSource) {
                    try { window._goldGameNetworkFloatEventSource.close(); } catch (e) {}
                    window._goldGameNetworkFloatEventSource = null;
                }
                if (!window._goldGameNetworkFloatLoopTimer) return;
                clearInterval(window._goldGameNetworkFloatLoopTimer);
                window._goldGameNetworkFloatLoopTimer = null;
            };
            if (getToken()) {
                setTimeout(function() {
                    if (typeof window.startGoldGameNetworkFloatAnnouncementLoop === 'function') window.startGoldGameNetworkFloatAnnouncementLoop();
                }, 1200);
            }
            window.goldGameGetAbyssChat = function() {
                if (!hasApi() || !getToken()) return Promise.resolve({ ok: false, list: [] });
                return apiRequest('GET', '/api/abyss-chat', undefined, true).catch(function() { return { ok: false, list: [] }; });
            };
            window.goldGameSendAbyssChat = function(message) {
                if (!hasApi() || !getToken()) return Promise.reject(new Error('未联网登录'));
                var txt = String(message == null ? '' : message).trim();
                if (!txt) return Promise.reject(new Error('消息不能为空'));
                if (txt.length > 120) return Promise.reject(new Error('消息太长（最多120字）'));
                var playerName = '';
                if (typeof player !== 'undefined' && player && player.name != null) playerName = String(player.name || '').trim();
                var nameEl = document.getElementById('playerName');
                if (!playerName && nameEl && nameEl.textContent != null) playerName = String(nameEl.textContent || '').trim();
                if (!playerName) playerName = '神秘玩家';
                return apiRequest('POST', '/api/abyss-chat/send', { message: txt, playerName: playerName }, true);
            };
            window.goldGameGetLeaderboard = function(limit, type) {
                if (!hasApi()) return Promise.resolve({ ok: true, list: [] });
                var url = '/api/leaderboard?limit=' + (limit || 100);
                if (type) url += '&type=' + encodeURIComponent(type);
                return apiRequest('GET', url, undefined, false);
            };
            window.goldGameGetLeaderboardPayload = function() {
                if (typeof player === 'undefined') return { total: 0, stage: 0, tower: 0, reincarnation: 0, wealth: 0, bestFloor: 0 };
                var at = player.abyssTower;
                var bestFloor = (at && at.bestFloor != null && !isNaN(at.bestFloor)) ? Number(at.bestFloor) : 0;
                var inv = player.investmentGame && player.investmentGame.userData;
                var wealth = (inv && inv.totalAssets != null && !isNaN(inv.totalAssets)) ? Number(inv.totalAssets) : ((inv && inv.availableFunds != null && !isNaN(inv.availableFunds)) ? Number(inv.availableFunds) : 0);
                var r = (player.reincarnationCount != null && !isNaN(player.reincarnationCount)) ? Number(player.reincarnationCount) : 0;
                var stage = (player.battle && player.battle.maxStage != null && !isNaN(player.battle.maxStage)) ? Number(player.battle.maxStage) : 0;
                var tower = (player.tower && player.tower.currentFloor != null && !isNaN(player.tower.currentFloor)) ? Number(player.tower.currentFloor) : 0;
                if (tower === 0 && player.trialTower && player.trialTower.currentFloor != null) tower = Number(player.trialTower.currentFloor) || 0;
                return { total: bestFloor, stage: stage, tower: tower, reincarnation: r, wealth: wealth, bestFloor: bestFloor };
            };
            window.goldGameSubmitLeaderboard = function(scoreOrPayload, displayName) {
                if (!hasApi()) { if (typeof logAction === 'function') logAction('未配置服务器地址', 'common'); return Promise.reject(); }
                var name = (displayName != null && String(displayName).trim()) ? String(displayName).trim() : (player && player.name) || getAuthUser();
                var avatar = (player && player.avatar) ? player.avatar : '';
                var body;
                if (scoreOrPayload != null && typeof scoreOrPayload === 'object' && !isNaN(scoreOrPayload.total)) {
                    body = { score: scoreOrPayload.total, name: name, avatar: avatar, stage: scoreOrPayload.stage, tower: scoreOrPayload.tower, reincarnation: scoreOrPayload.reincarnation, wealth: scoreOrPayload.wealth, bestFloor: scoreOrPayload.bestFloor };
                } else {
                    var num = typeof scoreOrPayload === 'number' ? scoreOrPayload : parseFloat(scoreOrPayload);
                    if (isNaN(num)) num = goldGameGetLeaderboardPayload().total;
                    body = { score: num, name: name, avatar: avatar };
                }
                return apiRequest('POST', '/api/leaderboard', body, true).then(function(res) {
                    if (res.ok && typeof logAction === 'function') logAction('已更新排行榜', 'success');
                    else throw new Error(res.message || '提交失败');
                });
            };
            window.goldGameGetLeaderboardScore = function() {
                return goldGameGetLeaderboardPayload().total;
            };
            window.showGoldGameLoginDialog = function() {
                if (getToken()) return;
                var d = document.getElementById('goldGameLoginDialog');
                var o = document.getElementById('goldGameLoginOverlay');
                var input = document.getElementById('goldGameApiBaseInput');
                if (input && window.GOLD_GAME_API_BASE) input.value = window.GOLD_GAME_API_BASE;
                if (typeof window.syncGoldGameAccountAuthButtons === 'function') window.syncGoldGameAccountAuthButtons();
                if (d) d.style.display = 'block';
                if (o) o.style.display = 'block';
            };
            window.closeGoldGameLoginDialog = function() {
                var d = document.getElementById('goldGameLoginDialog');
                var o = document.getElementById('goldGameLoginOverlay');
                if (d) d.style.display = 'none';
                if (o) o.style.display = 'none';
                if (getToken()) {
                    if (typeof goldGameGetNetworkArtifacts === 'function') goldGameGetNetworkArtifacts().catch(function() {});
                    if (typeof goldGameGetNetworkCoin === 'function') goldGameGetNetworkCoin().catch(function() {});
                    if (typeof goldGameFamilyBonus === 'function') goldGameFamilyBonus().catch(function() {});
                    if (typeof window.startGoldGameNetworkFloatAnnouncementLoop === 'function') window.startGoldGameNetworkFloatAnnouncementLoop();
                }
                if (window._loginGateActive) {
                    window._loginGateActive = false;
                    var gate = document.getElementById('goldGameLoginGateOverlay');
                    if (gate) gate.style.display = 'none';
                    var closeBtn = document.getElementById('goldGameLoginCloseBtn');
                    if (closeBtn) closeBtn.style.display = '';
                    if (typeof window._startGameAfterLogin === 'function') window._startGameAfterLogin();
                }
                if (typeof window.syncGoldGameAccountAuthButtons === 'function') window.syncGoldGameAccountAuthButtons();
            };
            var _goldGameLeaderboardCurrentType = 'total';

            function renderGoldGameLeaderboard(listEl, type) {
                if (!listEl) return;
                listEl.innerHTML = '<p style="color:#666;">加载中…</p>';
                if (typeof goldGameGetLeaderboard !== 'function') return;
                var cat = type || _goldGameLeaderboardCurrentType || 'total';
                _goldGameLeaderboardCurrentType = cat;
                goldGameGetLeaderboard(100, cat).then(function(res) {
                    if (!listEl) return;
                    if (!res.ok || !Array.isArray(res.list)) { listEl.innerHTML = '<p style="color:#999;">暂无数据或未配置服务器</p>'; return; }
                    if (res.list.length === 0) { listEl.innerHTML = '<p style="color:#999;">暂无排行</p>'; return; }
                    var scoreLabel = (cat === 'total') ? '最佳层数' : (cat === 'wealth') ? '资金' : '分数';
                    listEl.innerHTML = '<table style="width:100%;border-collapse:collapse;"><tr style="background:#f0f0f0;"><th style="padding:6px;">排名</th><th>玩家</th><th>' + scoreLabel + '</th></tr>' +
                        res.list.map(function(item, index) {
                            var rank = (item.rank != null && !isNaN(item.rank)) ? item.rank : (index + 1);
                            var scoreStr = (item.score != null && !isNaN(item.score)) ? (cat === 'total' ? Math.floor(Number(item.score)).toLocaleString() : (item.score >= 1e15 ? (item.score).toExponential(2) : Number(item.score).toLocaleString())) : '-';
                            var name = item.displayName || item.username || '未知玩家';
                            var avatar = item.avatar || item.avatarUrl || '';
                            var playerHtml = avatar
                                ? '<div style="display:flex;align-items:center;gap:6px;"><img src="' + avatar + '" alt="avatar" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:1px solid #ddd;"><span>' + name + '</span></div>'
                                : name;
                            return '<tr><td style="padding:6px;">' + rank + '</td><td>' + playerHtml + '</td><td>' + scoreStr + '</td></tr>';
                        }).join('') + '</table>';
                }).catch(function() { if (listEl) listEl.innerHTML = '<p style="color:#c00;">加载失败</p>'; });
            }

            window.switchGoldGameLeaderboard = function(type) {
                _goldGameLeaderboardCurrentType = type || 'total';
                var listEl = document.getElementById('goldGameLeaderboardList');
                renderGoldGameLeaderboard(listEl, _goldGameLeaderboardCurrentType);
            };

            window.showGoldGameLeaderboardDialog = function(type, onlyRefresh) {
                var d = document.getElementById('goldGameLeaderboardDialog');
                var o = document.getElementById('goldGameLeaderboardOverlay');
                if (!onlyRefresh) {
                    if (d) d.style.display = 'block';
                    if (o) o.style.display = 'block';
                }
                var listEl = document.getElementById('goldGameLeaderboardList');
                if (!onlyRefresh && type) _goldGameLeaderboardCurrentType = type;
                renderGoldGameLeaderboard(listEl, type);
            };
            window.closeGoldGameLeaderboardDialog = function() {
                var d = document.getElementById('goldGameLeaderboardDialog');
                var o = document.getElementById('goldGameLeaderboardOverlay');
                if (d) d.style.display = 'none';
                if (o) o.style.display = 'none';
            };
            window.openGoldGameLeaderboardWithUpload = function() {
                if (typeof hasApi === 'function' && hasApi() && typeof goldGameUploadSave === 'function') {
                    goldGameUploadSave().then(function() { showGoldGameLeaderboardDialog(); }).catch(function(e) { alert((e && e.message) || '上传失败'); });
                } else {
                    showGoldGameLeaderboardDialog();
                }
            };
            function renderGoldGameActivityContent() {
                var contentEl = document.getElementById('goldGameActivityContent');
                var statusEl = document.getElementById('goldGameActivityTimeStatus');
                if (!contentEl) return;
                var fallback = [
                    '活动状态：枫叶币获取已结束，在线随机与保底均已关闭（历史余额与排行仍保留）',
                    '排行规则：按枫叶币数量从高到低排名，展示前10名',
                    '温馨提示：打开活动排行榜会自动上传云存档，确保数据最新',
                ];
                if (typeof window.goldGameApiRequest === 'function' && hasApi()) {
                    window.goldGameApiRequest('GET', '/api/activity-info', undefined, false).then(function(res) {
                        if (res && res.ok && res.clientBuild != null && res.clientBuild !== '') {
                            window.__goldGameClientBuild = String(res.clientBuild);
                        }
                        var title = (res && res.ok && res.title) ? String(res.title) : '枫叶收集活动';
                        var lines = (res && res.ok && Array.isArray(res.lines) && res.lines.length > 0) ? res.lines : fallback;
                        if (statusEl) statusEl.innerHTML = formatActivityTimeStatus(res && res.startAt, res && res.endAt);
                        contentEl.innerHTML = '<div style="font-weight:700;color:#7a3f00;margin-bottom:6px;">' + title + '</div><ul style="margin:0;padding-left:18px;">' + lines.map(function(t) {
                            return '<li style="margin:4px 0;">' + String(t) + '</li>';
                        }).join('') + '</ul>';
                    }).catch(function() {
                        if (statusEl) statusEl.textContent = '';
                        contentEl.innerHTML = '<div style="font-weight:700;color:#7a3f00;margin-bottom:6px;">枫叶收集活动</div><ul style="margin:0;padding-left:18px;">' + fallback.map(function(t) {
                            return '<li style="margin:4px 0;">' + String(t) + '</li>';
                        }).join('') + '</ul>';
                    });
                    return;
                }
                var lines = Array.isArray(window.GOLD_GAME_ACTIVITY_INFO) ? window.GOLD_GAME_ACTIVITY_INFO : fallback;
                if (statusEl) statusEl.textContent = '';
                contentEl.innerHTML = '<div style="font-weight:700;color:#7a3f00;margin-bottom:6px;">枫叶收集活动</div><ul style="margin:0;padding-left:18px;">' + lines.map(function(t) {
                    return '<li style="margin:4px 0;">' + String(t) + '</li>';
                }).join('') + '</ul>';
            }
            function formatActivityTimeStatus(startAt, endAt) {
                var s = Number(startAt) || 0;
                var e = Number(endAt) || 0;
                if (!s && !e) return '';
                var now = Date.now();
                function fmt(ms) {
                    var d = new Date(ms);
                    if (isNaN(d.getTime())) return '--';
                    var y = d.getFullYear();
                    var m = String(d.getMonth() + 1).padStart(2, '0');
                    var day = String(d.getDate()).padStart(2, '0');
                    var h = String(d.getHours()).padStart(2, '0');
                    var min = String(d.getMinutes()).padStart(2, '0');
                    return y + '-' + m + '-' + day + ' ' + h + ':' + min;
                }
                if (s && now < s) {
                    return '活动状态：<span style="color:#ef6c00;font-weight:bold;">未开始</span>（开始时间：' + fmt(s) + '）';
                }
                if (e) {
                    if (now >= e) return '活动状态：<span style="color:#8d6e63;font-weight:bold;">已结束</span>（结束时间：' + fmt(e) + '）';
                    var left = e - now;
                    var d = Math.floor(left / 86400000);
                    var h = Math.floor((left % 86400000) / 3600000);
                    var min = Math.floor((left % 3600000) / 60000);
                    return '活动状态：<span style="color:#2e7d32;font-weight:bold;">进行中</span> · 剩余 <b>' + d + '</b>天 <b>' + h + '</b>小时 <b>' + min + '</b>分钟';
                }
                return '活动状态：<span style="color:#2e7d32;font-weight:bold;">进行中</span>';
            }
            function renderGoldGameActivityLeaderboard() {
                var listEl = document.getElementById('goldGameActivityLeaderboardList');
                if (!listEl) return;
                listEl.innerHTML = '<p style="color:#9b6a1f;">加载中…</p>';
                if (!hasApi()) {
                    listEl.innerHTML = '<p style="color:#9b6a1f;">未配置服务器地址</p>';
                    return;
                }
                var myName = (typeof getGoldGameAuthUsername === 'function' && getGoldGameAuthUsername()) ? String(getGoldGameAuthUsername()).trim() : '';
                var url = '/api/activity-leaderboard?limit=10';
                if (myName) url += '&username=' + encodeURIComponent(myName);
                apiRequest('GET', url, undefined, false).then(function(res) {
                    if (!res || !res.ok || !Array.isArray(res.list)) {
                        listEl.innerHTML = '<p style="color:#9b6a1f;">暂无活动排行数据</p>';
                        return;
                    }
                    if (res.list.length === 0) {
                        listEl.innerHTML = '<p style="color:#9b6a1f;">暂无玩家上榜</p>';
                        return;
                    }
                    listEl.innerHTML = '<table style="width:100%;border-collapse:collapse;background:#fffaf3;border-radius:10px;overflow:hidden;">'
                        + '<tr style="background:#ffd180;color:#6d3b00;"><th style="padding:8px 6px;">排行</th><th>玩家名字</th><th>枫叶币数量</th></tr>'
                        + res.list.map(function(item, idx) {
                            var rank = item.rank != null ? item.rank : (idx + 1);
                            var medal = rank === 1 ? '🥇' : (rank === 2 ? '🥈' : (rank === 3 ? '🥉' : '🍁'));
                            var name = item.displayName || item.username || '未知玩家';
                            var amount = (item.mapleCoin != null && !isNaN(item.mapleCoin)) ? Number(item.mapleCoin).toLocaleString() : '0';
                            var bg = rank <= 3 ? 'background:rgba(255,224,178,0.35);' : '';
                            return '<tr style="' + bg + 'border-top:1px solid #ffe0b2;"><td style="padding:8px 6px;color:#8a4b00;font-weight:bold;">' + medal + ' ' + rank + '</td><td style="padding:8px 6px;">' + name + '</td><td style="padding:8px 6px;color:#bf360c;font-weight:bold;">' + amount + ' 🍁</td></tr>';
                        }).join('')
                        + '</table>';
                    if (myName) {
                        if (res.myRank && res.myRank.rank != null) {
                            listEl.innerHTML += '<div style="margin-top:10px;padding:8px 10px;border:1px solid #ffcc80;border-radius:8px;background:#fff3e0;color:#7a3f00;">我的名次：第 <b>' + res.myRank.rank + '</b> 名，枫叶币 <b>' + Number(res.myRank.mapleCoin || 0).toLocaleString() + '</b> 🍁</div>';
                        } else {
                            listEl.innerHTML += '<div style="margin-top:10px;padding:8px 10px;border:1px solid #ffe0b2;border-radius:8px;background:#fffaf3;color:#8a6d3b;">我的名次：暂未上榜（继续加油收集枫叶币🍁）</div>';
                        }
                    }
                }).catch(function() {
                    listEl.innerHTML = '<p style="color:#c62828;">加载失败，请稍后重试</p>';
                });
            }
            window.refreshGoldGameActivityLeaderboard = function() {
                renderGoldGameActivityContent();
                renderGoldGameActivityLeaderboard();
            };
            window.showGoldGameActivityLeaderboardDialog = function() {
                var d = document.getElementById('goldGameActivityLeaderboardDialog');
                var o = document.getElementById('goldGameActivityLeaderboardOverlay');
                if (d) d.style.display = 'block';
                if (o) o.style.display = 'block';
                if (typeof refreshGoldGameActivityLeaderboard === 'function') refreshGoldGameActivityLeaderboard();
            };
            window.openGoldGameActivityLeaderboardWithUpload = function() {
                if (typeof hasApi === 'function' && hasApi() && typeof goldGameUploadSave === 'function') {
                    goldGameUploadSave().then(function() { showGoldGameActivityLeaderboardDialog(); }).catch(function(e) { alert((e && e.message) || '上传失败'); });
                } else {
                    showGoldGameActivityLeaderboardDialog();
                }
            };
            window.closeGoldGameActivityLeaderboardDialog = function() {
                var d = document.getElementById('goldGameActivityLeaderboardDialog');
                var o = document.getElementById('goldGameActivityLeaderboardOverlay');
                if (d) d.style.display = 'none';
                if (o) o.style.display = 'none';
            };

            window.refreshGoldGameMapleShopBalance = function() {
                var el = document.getElementById('goldGameMapleShopBalance');
                if (!el) return;
                if (typeof hasApi !== 'function' || !hasApi() || typeof getToken !== 'function' || !getToken()) {
                    el.textContent = '--';
                    return;
                }
                if (typeof goldGameGetMapleCoin !== 'function') {
                    el.textContent = '--';
                    return;
                }
                goldGameGetMapleCoin().then(function(r) {
                    if (el && r && r.ok && typeof r.amount === 'number') el.textContent = r.amount.toLocaleString();
                    else if (el) el.textContent = '--';
                }).catch(function() { if (el) el.textContent = '--'; });
            };
            window.openGoldGameMapleShopDialog = function() {
                var d = document.getElementById('goldGameMapleShopDialog');
                var o = document.getElementById('goldGameMapleShopOverlay');
                if (d) d.style.display = 'block';
                if (o) o.style.display = 'block';
                refreshGoldGameMapleShopBalance();
            };
            window.closeGoldGameMapleShopDialog = function() {
                var d = document.getElementById('goldGameMapleShopDialog');
                var o = document.getElementById('goldGameMapleShopOverlay');
                if (d) d.style.display = 'none';
                if (o) o.style.display = 'none';
            };
            window.goldGameMapleShopExchange = function(productId) {
                if (typeof hasApi !== 'function' || !hasApi()) {
                    alert('未配置服务器');
                    return;
                }
                if (typeof getToken !== 'function' || !getToken()) {
                    alert('请先登录账号');
                    return;
                }
                var pid = String(productId || '').trim();
                var body = { productId: pid };
                if (pid === 'random_shoujue') {
                    if (!confirm('消耗 88 枫叶币🍁，随机获得 1 本深渊宠物兽决？')) return;
                } else if (pid === 'random_beast_120_normal') {
                    if (!confirm('消耗 288 枫叶币🍁，随机获得 1 只 120 层宝宝品质深渊神兽？\n请确认神兽列表有空位。')) return;
                } else if (pid === 'network_coin') {
                    var qEl = document.getElementById('goldGameMapleShopNetworkCoinQty');
                    var netQty = qEl ? Math.floor(Number(qEl.value)) : 1;
                    if (!Number.isFinite(netQty) || netQty < 1) {
                        alert('请输入有效的兑换数量（至少 1）');
                        return;
                    }
                    if (netQty > 100000) {
                        alert('单次兑换数量不能超过 100000');
                        return;
                    }
                    var needMaple = 3 * netQty;
                    if (!confirm('消耗 ' + needMaple.toLocaleString() + ' 枫叶币🍁，兑换 ' + netQty.toLocaleString() + ' 联网币？')) return;
                    body.quantity = netQty;
                } else if (pid === 'abyss_upgrade_stone') {
                    if (!confirm('消耗 55 枫叶币🍁，兑换 1 个深渊升级石？')) return;
                } else if (pid === 'abyss_refine_stone') {
                    if (!confirm('消耗 88 枫叶币🍁，兑换 1 个深渊洗练石？')) return;
                } else if (pid === 'random_neidan') {
                    if (!confirm('消耗 108 枫叶币🍁，随机获得 1 个深渊宠物内丹？')) return;
                } else {
                    alert('未知商品');
                    return;
                }
                apiRequest('POST', '/api/maple-coin/shop-exchange', body, true).then(function(res) {
                    if (!res || !res.ok) {
                        alert((res && res.message) || '兑换失败');
                        return;
                    }
                    var balEl = document.getElementById('goldGameMapleShopBalance');
                    if (balEl && typeof res.mapleCoin === 'number') balEl.textContent = res.mapleCoin.toLocaleString();
                    var mapleDisp = document.getElementById('goldGameMapleCoinDisplay');
                    if (mapleDisp && typeof res.mapleCoin === 'number') mapleDisp.textContent = res.mapleCoin;
                    if (typeof res.networkCoin === 'number') {
                        window._networkCoinCache = res.networkCoin;
                        var ncDisp = document.getElementById('goldGameNetworkCoinDisplay');
                        if (ncDisp) ncDisp.textContent = res.networkCoin;
                    }
                    if (typeof res.upgradeStoneAmount === 'number' && typeof goldGameGetUpgradeStones === 'function') {
                        goldGameGetUpgradeStones();
                    }
                    if (typeof res.refineStoneAmount === 'number' && typeof goldGameGetRefineStones === 'function') {
                        goldGameGetRefineStones();
                    }
                    var rw = res.reward || {};
                    var msg = '兑换成功！';
                    if (rw.label) msg += '\n获得：' + rw.label;
                    alert(msg);
                }).catch(function(e) {
                    alert((e && e.message) || '请求失败');
                });
            };

            // ========== 联网深渊神器 / 联网币 / 联网装备市场（数据存服务器，按账号） ==========
            var NETWORK_ARTIFACT_SLOTS = ['necklace', 'ring', 'bracelet'];
            var NETWORK_ARTIFACT_SLOT_NAMES = { necklace: '项链', ring: '戒指', bracelet: '手镯' };
            var NETWORK_ARTIFACT_QUALITIES = ['灰', '绿', '蓝', '紫', '橙', '红', '金'];
            var NETWORK_ARTIFACT_QUALITY_RATES = [90, 8.349, 1, 0.5, 0.1, 0.05, 0.001];
            var NETWORK_ARTIFACT_ATTR_RANGES = [
                [1, 5], [6, 10], [10, 21], [21, 40], [41, 60], [61, 80], [81, 100]
            ];
            window._networkArtifactBonuses = { atkPct: 0, defPct: 0, hpPct: 0, critRatePct: 0, critDmgPct: 0, petAtkPct: 0, petDefPct: 0, petHpPct: 0, petCritRatePct: 0, petCritDmgPct: 0 };
            window._networkArtifactsCache = null;
            window._networkCoinCache = null;
            window._networkUpgradeStonesCache = 0;
            window._supremeArtifactsCache = null;

            window.goldGameGetSupremeArtifacts = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, equipped: {}, bag: [] });
                return apiRequest('GET', '/api/supreme-artifacts', undefined, true).then(function(res) {
                    if (res && res.ok) {
                        window._supremeArtifactsCache = {
                            equipped: (res.equipped != null && typeof res.equipped === 'object') ? res.equipped : {},
                            bag: Array.isArray(res.bag) ? res.bag : []
                        };
                    }
                    return res;
                }).catch(function() { return { ok: false, equipped: {}, bag: [] }; });
            };
            window.goldGameTryDropSupremeArtifact = function(dimensionLevel) {
                if (!hasApi() || !getToken() || dimensionLevel < 2) return Promise.resolve({ ok: false, dropped: false });
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                return apiRequest('POST', '/api/supreme-artifacts/try-drop', { dimensionLevel: dimensionLevel, playerName: playerName }, true).then(function(res) {
                    if (res.ok && res.dropped && res.supremeArtifact && window._supremeArtifactsCache) {
                        window._supremeArtifactsCache.bag = window._supremeArtifactsCache.bag || [];
                        window._supremeArtifactsCache.bag.push(res.supremeArtifact);
                    }
                    return res;
                }).catch(function() { return { ok: false, dropped: false }; });
            };
            window.goldGameEquipSupremeArtifact = function(artifactId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/supreme-artifacts/equip', { artifactId: artifactId }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetSupremeArtifacts();
                    throw new Error(res.message || '装备失败');
                });
            };
            window.goldGameUnequipSupremeArtifact = function(slotId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/supreme-artifacts/unequip', { slotId: slotId }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetSupremeArtifacts();
                    throw new Error(res.message || '卸下失败');
                });
            };
            window.goldGameDiscardSupremeArtifact = function(artifactId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/supreme-artifacts/discard', { artifactId: artifactId }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetSupremeArtifacts();
                    throw new Error(res.message || '丢弃失败');
                });
            };
            window.goldGameDiscardSupremeArtifactsBatch = function(artifactIds) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/supreme-artifacts/discard-batch', { artifactIds: artifactIds }, true).then(function(res) {
                    if (!res.ok) throw new Error(res.message || '批量丢弃失败');
                    return window.goldGameGetSupremeArtifacts().then(function() { return res; });
                });
            };
            window.goldGameToggleSupremeArtifactLock = function(artifactId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/supreme-artifacts/toggle-lock', { artifactId: artifactId }, true).then(function(res) {
                    if (!res.ok) throw new Error(res.message || '锁定操作失败');
                    return window.goldGameGetSupremeArtifacts().then(function() { return res; });
                });
            };
            window.goldGameMarketSellSupremeArtifact = function(artifactId, price, opts) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                var body = Object.assign({
                    artifactId: artifactId,
                    price: price,
                    playerName: (typeof player !== 'undefined' && player && player.name) ? player.name : '',
                }, opts || {});
                return apiRequest('POST', '/api/network-market/sell-supreme-artifact', body, true).then(function(res) {
                    if (!res.ok) throw new Error(res.message || '上架失败');
                    return window.goldGameGetSupremeArtifacts().then(function() { return res; });
                });
            };

            window.goldGameGetNetworkArtifacts = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, equipped: {}, bag: [] });
                return apiRequest('GET', '/api/network-artifacts', undefined, true).then(function(res) {
                    if (res.ok && res.equipped !== undefined) {
                        window._networkArtifactsCache = { equipped: res.equipped || {}, bag: res.bag || [] };
                        var b = { atkPct: 0, defPct: 0, hpPct: 0, critRatePct: 0, critDmgPct: 0, petAtkPct: 0, petDefPct: 0, petHpPct: 0, petCritRatePct: 0, petCritDmgPct: 0 };
                        function addBonus(eq) {
                            if (!eq || !eq.attrPct) return;
                            var mult = 1 + ((eq.enhanceLevel != null ? eq.enhanceLevel : 0) * 0.1);
                            var pct = eq.attrPct * mult;
                            if (eq.attrType === 'atk') b.atkPct += pct; else if (eq.attrType === 'def') b.defPct += pct; else if (eq.attrType === 'hp') b.hpPct += pct;
                            else if (eq.attrType === 'critRate') b.critRatePct += pct; else if (eq.attrType === 'critDmg') b.critDmgPct += pct;
                            else if (eq.attrType === 'petAtk') b.petAtkPct += pct; else if (eq.attrType === 'petDef') b.petDefPct += pct; else if (eq.attrType === 'petHp') b.petHpPct += pct;
                            else if (eq.attrType === 'petCritRate') b.petCritRatePct += pct; else if (eq.attrType === 'petCritDmg') b.petCritDmgPct += pct;
                        }
                        NETWORK_ARTIFACT_SLOTS.forEach(function(slot) { addBonus((res.equipped || {})[slot]); });
                        window._networkArtifactBonuses = b;
                    }
                    return res;
                }).catch(function() { return { ok: false, equipped: {}, bag: [] }; });
            };
            window.goldGameTryDropNetworkArtifact = function(floor) {
                if (!hasApi() || !getToken() || floor < 20) return Promise.resolve({ ok: false, dropped: false });
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                return apiRequest('POST', '/api/network-artifacts/try-drop', { floor: floor, playerName: playerName }, true).then(function(res) {
                    if (res.ok && res.dropped && res.artifact) {
                        if (window._networkArtifactsCache) {
                            window._networkArtifactsCache.bag = window._networkArtifactsCache.bag || [];
                            window._networkArtifactsCache.bag.push(res.artifact);
                        }
                        return res;
                    }
                    return res;
                }).catch(function() { return { ok: false, dropped: false }; });
            };
            window.goldGameGetNetworkCoin = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, amount: 0 });
                return apiRequest('GET', '/api/network-coin', undefined, true).then(function(res) {
                    if (res.ok && typeof res.amount === 'number') window._networkCoinCache = res.amount;
                    return res;
                }).catch(function() { return { ok: false, amount: 0 }; });
            };
            window.goldGameGetMapleCoin = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, amount: 0 });
                return apiRequest('GET', '/api/maple-coin', undefined, true).then(function(res) {
                    if (res.ok && typeof res.amount === 'number') window._mapleCoinCache = res.amount;
                    if (res && res.grantEnabled === false) window._goldGameMapleGrantEnabled = false;
                    else if (res && res.grantEnabled === true) window._goldGameMapleGrantEnabled = true;
                    return res;
                }).catch(function() { return { ok: false, amount: 0 }; });
            };
            window.goldGameTryDropNetworkCoin = function(dimensionLevel) {
                if (!hasApi() || !getToken() || dimensionLevel < 1) return Promise.resolve({ ok: false, dropped: false });
                return apiRequest('POST', '/api/network-coin/try-drop', { dimensionLevel: dimensionLevel }, true).then(function(res) {
                    if (res.ok && res.dropped && typeof res.amount === 'number') window._networkCoinCache = res.amount;
                    return res;
                }).catch(function() { return { ok: false, dropped: false }; });
            };
            window.goldGameTryDropMapleCoin = function(dimensionLevel) {
                if (!hasApi() || !getToken() || dimensionLevel < 1) return Promise.resolve({ ok: false, dropped: false });
                return apiRequest('POST', '/api/maple-coin/try-drop', { dimensionLevel: dimensionLevel }, true).then(function(res) {
                    if (res.ok && res.dropped && typeof res.amount === 'number') window._mapleCoinCache = res.amount;
                    return res;
                }).catch(function() { return { ok: false, dropped: false }; });
            };
            // 与服务器 MAPLE_COIN_ACTIVITY_GRANT_ENABLED 同步；活动重开时可置 undefined，由 GET /api/maple-coin 更新
            window._goldGameMapleGrantEnabled = false;
            window.goldGameMapleCoinMinuteTick = function() {
                if (window._goldGameMapleGrantEnabled === false) {
                    return Promise.resolve({ ok: true, dropped: false, grantDisabled: true });
                }
                if (!hasApi() || !getToken()) return Promise.resolve({ ok: false });
                return apiRequest('POST', '/api/maple-coin/minute-tick', {}, true).then(function(res) {
                    if (res.ok && typeof res.amount === 'number') window._mapleCoinCache = res.amount;
                    return res;
                }).catch(function() { return { ok: false }; });
            };
            function scheduleGoldGameMapleCoinAlignedTick() {
                if (window._goldGameMapleGrantEnabled === false) return;
                if (window._goldGameMapleCoinMinuteTimeoutId != null) {
                    clearTimeout(window._goldGameMapleCoinMinuteTimeoutId);
                    window._goldGameMapleCoinMinuteTimeoutId = null;
                }
                if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) return;
                var now = Date.now();
                var delay = 60000 - (now % 60000) + 500;
                if (delay < 1500) delay += 60000;
                window._goldGameMapleCoinMinuteTimeoutId = setTimeout(function() {
                    window._goldGameMapleCoinMinuteTimeoutId = null;
                    if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) return;
                    window.goldGameMapleCoinMinuteTick().then(function(res) {
                        if (res && res.ok && res.dropped && typeof logAction === 'function') logAction('获得枫叶币🍁 x1（在线发放）', 'success');
                        var el = document.getElementById('goldGameMapleCoinDisplay');
                        if (el && res && res.ok && typeof res.amount === 'number') el.textContent = res.amount;
                    }).catch(function() {}).finally(function() { scheduleGoldGameMapleCoinAlignedTick(); });
                }, delay);
            }
            window.startGoldGameMapleCoinMinuteLoop = function() {
                if (window._goldGameMapleGrantEnabled === false) return;
                if (typeof window.goldGameMapleCoinMinuteTick !== 'function') return;
                if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) return;
                if (typeof window.stopGoldGameMapleCoinMinuteLoop === 'function') window.stopGoldGameMapleCoinMinuteLoop();
                window.goldGameMapleCoinMinuteTick().then(function(res) {
                    if (res && res.grantDisabled) {
                        window._goldGameMapleGrantEnabled = false;
                        if (typeof window.stopGoldGameMapleCoinMinuteLoop === 'function') window.stopGoldGameMapleCoinMinuteLoop();
                        return;
                    }
                    var el = document.getElementById('goldGameMapleCoinDisplay');
                    if (el && res && res.ok && typeof res.amount === 'number') el.textContent = res.amount;
                    if (res && res.ok && res.dropped && typeof logAction === 'function') logAction('获得枫叶币🍁 x1（在线发放）', 'success');
                }).catch(function() {}).finally(function() { scheduleGoldGameMapleCoinAlignedTick(); });
            };
            window.goldGameMapleCoinWorldMapMaybeTick = function() {
                if (window._goldGameMapleGrantEnabled === false) return;
                if (!hasApi() || typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) return;
                if (typeof window.goldGameMapleCoinMinuteTick !== 'function') return;
                var t = Date.now();
                if (t - (window._goldGameMapleWorldMapHookLast || 0) < 28000) return;
                window._goldGameMapleWorldMapHookLast = t;
                window.goldGameMapleCoinMinuteTick().then(function(res) {
                    var el = document.getElementById('goldGameMapleCoinDisplay');
                    if (el && res && res.ok && typeof res.amount === 'number') el.textContent = res.amount;
                    if (res && res.ok && res.dropped && typeof logAction === 'function') logAction('获得枫叶币🍁 x1（在线发放）', 'success');
                }).catch(function() {});
            };
            window.stopGoldGameMapleCoinMinuteLoop = function() {
                if (window._goldGameMapleCoinMinuteIntervalId != null) {
                    clearInterval(window._goldGameMapleCoinMinuteIntervalId);
                    window._goldGameMapleCoinMinuteIntervalId = null;
                }
                if (window._goldGameMapleCoinMinuteTimeoutId != null) {
                    clearTimeout(window._goldGameMapleCoinMinuteTimeoutId);
                    window._goldGameMapleCoinMinuteTimeoutId = null;
                }
            };
            window.goldGameEquipNetworkArtifact = function(slot, artifactId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-artifacts/equip', { slot: slot, artifactId: artifactId }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetNetworkArtifacts();
                    throw new Error(res.message || '装备失败');
                });
            };
            window.goldGameUnequipNetworkArtifact = function(slot) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-artifacts/unequip', { slot: slot }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetNetworkArtifacts();
                    throw new Error(res.message || '卸下失败');
                });
            };
            window.goldGameMarketList = function(page, filters) {
                if (!hasApi()) return Promise.resolve({ ok: true, list: [], page: 1, pageSize: 20, total: 0 });
                var p = page != null && !isNaN(parseInt(page, 10)) ? Math.max(1, parseInt(page, 10)) : 1;
                var mineQ = (typeof window._networkMarketViewMode !== 'undefined' && window._networkMarketViewMode === 'mine') ? '&mine=1' : '';
                var needTok = mineQ !== '';
                filters = (filters && typeof filters === 'object') ? filters : {};
                var q = '';
                var keys = ['keyword', 'itemType', 'slot', 'attrType', 'saleMode', 'sellerId', 'minPrice', 'maxPrice', 'minQuality', 'maxQuality', 'minEnhanceLevel', 'maxEnhanceLevel', 'sLevel', 'supremeAffixType'];
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    var v = filters[k];
                    if (v == null) continue;
                    var sv = String(v).trim();
                    if (sv === '') continue;
                    q += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(sv);
                }
                return apiRequest('GET', '/api/network-market/list?page=' + encodeURIComponent(String(p)) + '&pageSize=20' + mineQ + q, undefined, needTok).then(function(res) {
                    return res.ok ? res : { ok: false, list: [], page: p, pageSize: 20, total: 0 };
                }).catch(function() { return { ok: false, list: [], page: p, pageSize: 20, total: 0 }; });
            };
            window.goldGameMarketSell = function(artifactId, price, opts) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                opts = opts || {};
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                var body = { artifactId: artifactId, playerName: playerName };
                if (opts.saleMode === 'auction') {
                    body.saleMode = 'auction';
                    body.minBid = opts.minBid;
                    if (opts.buyNowPrice != null && opts.buyNowPrice !== '' && !isNaN(Number(opts.buyNowPrice))) body.buyNowPrice = Number(opts.buyNowPrice);
                } else {
                    body.price = price;
                }
                return apiRequest('POST', '/api/network-market/sell', body, true).then(function(res) {
                    if (res.ok) { window.goldGameGetNetworkArtifacts(); window.goldGameGetNetworkCoin(); return res; }
                    throw new Error(res.message || '上架失败');
                });
            };
            window.goldGameMarketBid = function(listingId, bidAmount) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                return apiRequest('POST', '/api/network-market/bid', { listingId: listingId, bidAmount: bidAmount, playerName: playerName }, true).then(function(res) {
                    if (res.ok) { window.goldGameGetNetworkCoin(); return res; }
                    throw new Error(res.message || '出价失败');
                });
            };
            window.goldGameMarketBuy = function(listingId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                return apiRequest('POST', '/api/network-market/buy', { listingId: listingId, playerName: playerName }, true).then(function(res) {
                    if (res.ok) { window.goldGameGetNetworkArtifacts(); window.goldGameGetNetworkCoin(); if (typeof window.goldGameGetUpgradeStones === 'function') window.goldGameGetUpgradeStones(); return res; }
                    throw new Error(res.message || '购买失败');
                });
            };
            window.getNetworkArtifactAttackPct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.atkPct) || 0; };
            window.getNetworkArtifactDefensePct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.defPct) || 0; };
            window.getNetworkArtifactHealthPct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.hpPct) || 0; };
            window.getNetworkArtifactCritRatePct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.critRatePct) || 0; };
            window.getNetworkArtifactCritDmgPct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.critDmgPct) || 0;             };

            // ========== 联网深渊神器 / 联网币 / 联网装备市场（数据存服务器，按账号） ==========
            var NETWORK_ARTIFACT_SLOTS = ['necklace', 'ring', 'bracelet'];
            var NETWORK_ARTIFACT_SLOT_NAMES = { necklace: '项链', ring: '戒指', bracelet: '手镯' };
            var NETWORK_ARTIFACT_QUALITIES = ['灰', '绿', '蓝', '紫', '橙', '红', '金'];
            var NETWORK_ARTIFACT_QUALITY_RATES = [90, 8.349, 1, 0.5, 0.1, 0.05, 0.001];
            var NETWORK_ARTIFACT_ATTR_RANGES = [
                [1, 5], [6, 10], [10, 21], [21, 40], [41, 60], [61, 80], [81, 100]
            ];
            window._networkArtifactBonuses = { atkPct: 0, defPct: 0, hpPct: 0, critRatePct: 0, critDmgPct: 0, petAtkPct: 0, petDefPct: 0, petHpPct: 0, petCritRatePct: 0, petCritDmgPct: 0 };
            window._networkArtifactsCache = null;
            window._networkCoinCache = null;
            window._networkUpgradeStonesCache = 0;
            window._supremeArtifactsCache = null;

            window.goldGameGetSupremeArtifacts = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, equipped: {}, bag: [] });
                return apiRequest('GET', '/api/supreme-artifacts', undefined, true).then(function(res) {
                    if (res && res.ok) {
                        window._supremeArtifactsCache = {
                            equipped: (res.equipped != null && typeof res.equipped === 'object') ? res.equipped : {},
                            bag: Array.isArray(res.bag) ? res.bag : []
                        };
                    }
                    return res;
                }).catch(function() { return { ok: false, equipped: {}, bag: [] }; });
            };
            window.goldGameTryDropSupremeArtifact = function(dimensionLevel) {
                if (!hasApi() || !getToken() || dimensionLevel < 2) return Promise.resolve({ ok: false, dropped: false });
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                return apiRequest('POST', '/api/supreme-artifacts/try-drop', { dimensionLevel: dimensionLevel, playerName: playerName }, true).then(function(res) {
                    if (res.ok && res.dropped && res.supremeArtifact && window._supremeArtifactsCache) {
                        window._supremeArtifactsCache.bag = window._supremeArtifactsCache.bag || [];
                        window._supremeArtifactsCache.bag.push(res.supremeArtifact);
                    }
                    return res;
                }).catch(function() { return { ok: false, dropped: false }; });
            };
            window.goldGameEquipSupremeArtifact = function(artifactId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/supreme-artifacts/equip', { artifactId: artifactId }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetSupremeArtifacts();
                    throw new Error(res.message || '装备失败');
                });
            };
            window.goldGameUnequipSupremeArtifact = function(slotId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/supreme-artifacts/unequip', { slotId: slotId }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetSupremeArtifacts();
                    throw new Error(res.message || '卸下失败');
                });
            };
            window.goldGameDiscardSupremeArtifact = function(artifactId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/supreme-artifacts/discard', { artifactId: artifactId }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetSupremeArtifacts();
                    throw new Error(res.message || '丢弃失败');
                });
            };
            window.goldGameDiscardSupremeArtifactsBatch = function(artifactIds) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/supreme-artifacts/discard-batch', { artifactIds: artifactIds }, true).then(function(res) {
                    if (!res.ok) throw new Error(res.message || '批量丢弃失败');
                    return window.goldGameGetSupremeArtifacts().then(function() { return res; });
                });
            };
            window.goldGameToggleSupremeArtifactLock = function(artifactId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/supreme-artifacts/toggle-lock', { artifactId: artifactId }, true).then(function(res) {
                    if (!res.ok) throw new Error(res.message || '锁定操作失败');
                    return window.goldGameGetSupremeArtifacts().then(function() { return res; });
                });
            };
            window.goldGameMarketSellSupremeArtifact = function(artifactId, price, opts) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                var body = Object.assign({
                    artifactId: artifactId,
                    price: price,
                    playerName: (typeof player !== 'undefined' && player && player.name) ? player.name : '',
                }, opts || {});
                return apiRequest('POST', '/api/network-market/sell-supreme-artifact', body, true).then(function(res) {
                    if (!res.ok) throw new Error(res.message || '上架失败');
                    return window.goldGameGetSupremeArtifacts().then(function() { return res; });
                });
            };

            window.goldGameGetNetworkArtifacts = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, equipped: {}, bag: [] });
                return apiRequest('GET', '/api/network-artifacts', undefined, true).then(function(res) {
                    if (res.ok && res.equipped !== undefined) {
                        window._networkArtifactsCache = { equipped: res.equipped || {}, bag: res.bag || [] };
                        var b = { atkPct: 0, defPct: 0, hpPct: 0, critRatePct: 0, critDmgPct: 0, petAtkPct: 0, petDefPct: 0, petHpPct: 0, petCritRatePct: 0, petCritDmgPct: 0 };
                        function addBonus(eq) {
                            if (!eq || !eq.attrPct) return;
                            var mult = 1 + ((eq.enhanceLevel != null ? eq.enhanceLevel : 0) * 0.1);
                            var pct = eq.attrPct * mult;
                            if (eq.attrType === 'atk') b.atkPct += pct; else if (eq.attrType === 'def') b.defPct += pct; else if (eq.attrType === 'hp') b.hpPct += pct;
                            else if (eq.attrType === 'critRate') b.critRatePct += pct; else if (eq.attrType === 'critDmg') b.critDmgPct += pct;
                            else if (eq.attrType === 'petAtk') b.petAtkPct += pct; else if (eq.attrType === 'petDef') b.petDefPct += pct; else if (eq.attrType === 'petHp') b.petHpPct += pct;
                            else if (eq.attrType === 'petCritRate') b.petCritRatePct += pct; else if (eq.attrType === 'petCritDmg') b.petCritDmgPct += pct;
                        }
                        NETWORK_ARTIFACT_SLOTS.forEach(function(slot) { addBonus((res.equipped || {})[slot]); });
                        window._networkArtifactBonuses = b;
                    }
                    return res;
                }).catch(function() { return { ok: false, equipped: {}, bag: [] }; });
            };
            window.goldGameTryDropNetworkArtifact = function(floor) {
                if (!hasApi() || !getToken() || floor < 20) return Promise.resolve({ ok: false, dropped: false });
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                return apiRequest('POST', '/api/network-artifacts/try-drop', { floor: floor, playerName: playerName }, true).then(function(res) {
                    if (res.ok && res.dropped && res.artifact) {
                        if (window._networkArtifactsCache) {
                            window._networkArtifactsCache.bag = window._networkArtifactsCache.bag || [];
                            window._networkArtifactsCache.bag.push(res.artifact);
                        }
                        return res;
                    }
                    return res;
                }).catch(function() { return { ok: false, dropped: false }; });
            };
            window.goldGameGetNetworkCoin = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, amount: 0 });
                return apiRequest('GET', '/api/network-coin', undefined, true).then(function(res) {
                    if (res.ok && typeof res.amount === 'number') window._networkCoinCache = res.amount;
                    return res;
                }).catch(function() { return { ok: false, amount: 0 }; });
            };
            window.goldGameTryDropNetworkCoin = function(dimensionLevel) {
                if (!hasApi() || !getToken() || dimensionLevel < 1) return Promise.resolve({ ok: false, dropped: false });
                return apiRequest('POST', '/api/network-coin/try-drop', { dimensionLevel: dimensionLevel }, true).then(function(res) {
                    if (res.ok && res.dropped && typeof res.amount === 'number') window._networkCoinCache = res.amount;
                    return res;
                }).catch(function() { return { ok: false, dropped: false }; });
            };
            window.goldGameEquipNetworkArtifact = function(slot, artifactId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-artifacts/equip', { slot: slot, artifactId: artifactId }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetNetworkArtifacts();
                    throw new Error(res.message || '装备失败');
                });
            };
            window.goldGameUnequipNetworkArtifact = function(slot) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-artifacts/unequip', { slot: slot }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetNetworkArtifacts();
                    throw new Error(res.message || '卸下失败');
                });
            };
            window.goldGameMarketList = function(page, filters) {
                if (!hasApi()) return Promise.resolve({ ok: true, list: [], page: 1, pageSize: 20, total: 0 });
                var p = page != null && !isNaN(parseInt(page, 10)) ? Math.max(1, parseInt(page, 10)) : 1;
                var mineQ = (typeof window._networkMarketViewMode !== 'undefined' && window._networkMarketViewMode === 'mine') ? '&mine=1' : '';
                var needTok = mineQ !== '';
                filters = (filters && typeof filters === 'object') ? filters : {};
                var q = '';
                var keys = ['keyword', 'itemType', 'slot', 'attrType', 'saleMode', 'sellerId', 'minPrice', 'maxPrice', 'minQuality', 'maxQuality', 'minEnhanceLevel', 'maxEnhanceLevel', 'sLevel', 'supremeAffixType'];
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    var v = filters[k];
                    if (v == null) continue;
                    var sv = String(v).trim();
                    if (sv === '') continue;
                    q += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(sv);
                }
                return apiRequest('GET', '/api/network-market/list?page=' + encodeURIComponent(String(p)) + '&pageSize=20' + mineQ + q, undefined, needTok).then(function(res) {
                    return res.ok ? res : { ok: false, list: [], page: p, pageSize: 20, total: 0 };
                }).catch(function() { return { ok: false, list: [], page: p, pageSize: 20, total: 0 }; });
            };
            window.goldGameMarketSell = function(artifactId, price, opts) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                opts = opts || {};
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                var body = { artifactId: artifactId, playerName: playerName };
                if (opts.saleMode === 'auction') {
                    body.saleMode = 'auction';
                    body.minBid = opts.minBid;
                    if (opts.buyNowPrice != null && opts.buyNowPrice !== '' && !isNaN(Number(opts.buyNowPrice))) body.buyNowPrice = Number(opts.buyNowPrice);
                } else {
                    body.price = price;
                }
                return apiRequest('POST', '/api/network-market/sell', body, true).then(function(res) {
                    if (res.ok) { window.goldGameGetNetworkArtifacts(); window.goldGameGetNetworkCoin(); return res; }
                    throw new Error(res.message || '上架失败');
                });
            };
            window.goldGameMarketBid = function(listingId, bidAmount) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                return apiRequest('POST', '/api/network-market/bid', { listingId: listingId, bidAmount: bidAmount, playerName: playerName }, true).then(function(res) {
                    if (res.ok) { window.goldGameGetNetworkCoin(); return res; }
                    throw new Error(res.message || '出价失败');
                });
            };
            window.goldGameMarketBuy = function(listingId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                return apiRequest('POST', '/api/network-market/buy', { listingId: listingId, playerName: playerName }, true).then(function(res) {
                    if (res.ok) { window.goldGameGetNetworkArtifacts(); window.goldGameGetNetworkCoin(); if (typeof window.goldGameGetUpgradeStones === 'function') window.goldGameGetUpgradeStones(); return res; }
                    throw new Error(res.message || '购买失败');
                });
            };
            window.goldGameMarketDelist = function(listingId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-market/delist', { listingId: listingId }, true).then(function(res) {
                    if (res.ok) { window.goldGameGetNetworkArtifacts(); if (typeof window.goldGameGetUpgradeStones === 'function') window.goldGameGetUpgradeStones(); return res; }
                    throw new Error(res.message || '下架失败');
                });
            };
            window.goldGameGetUpgradeStones = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, amount: 0 });
                return apiRequest('GET', '/api/network-upgrade-stones', undefined, true).then(function(res) {
                    if (res.ok && typeof res.amount === 'number') window._networkUpgradeStonesCache = res.amount;
                    return res;
                }).catch(function() { return { ok: false, amount: 0 }; });
            };
            window.goldGameTryDropUpgradeStone = function(floor) {
                if (!hasApi() || !getToken() || floor < 20) return Promise.resolve({ ok: false, dropped: false });
                var playerName = getCurrentPlayerDisplayName();
                return apiRequest('POST', '/api/network-upgrade-stones/try-drop', { floor: floor, playerName: playerName }, true).then(function(res) {
                    if (res.ok && res.dropped && typeof res.amount === 'number') window._networkUpgradeStonesCache = res.amount;
                    return res;
                }).catch(function() { return { ok: false, dropped: false }; });
            };
            window.goldGameArtifactEnhance = function(artifactId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-artifacts/enhance', { artifactId: artifactId }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetNetworkArtifacts().then(function() { return res; });
                    throw new Error(res.message || '强化失败');
                });
            };
            window.goldGameGetRefineStones = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, amount: 0 });
                return apiRequest('GET', '/api/network-refine-stones', undefined, true).then(function(res) {
                    if (res.ok && typeof res.amount === 'number') window._networkRefineStonesCache = res.amount;
                    return res;
                }).catch(function() { return { ok: false, amount: 0 }; });
            };
            function getCurrentPlayerDisplayName() {
                var n = '';
                if (typeof player !== 'undefined' && player && player.name != null) n = String(player.name || '').trim();
                if (!n) {
                    var el = document.getElementById('playerName');
                    if (el && el.textContent != null) n = String(el.textContent || '').trim();
                }
                return n || '神秘玩家';
            }
            window.goldGameTryDropRefineStone = function(floor) {
                if (!hasApi() || !getToken() || floor < 20) return Promise.resolve({ ok: false, dropped: false });
                var playerName = getCurrentPlayerDisplayName();
                return apiRequest('POST', '/api/network-refine-stones/try-drop', { floor: floor, playerName: playerName }, true).then(function(res) {
                    if (res.ok && res.dropped && typeof res.amount === 'number') window._networkRefineStonesCache = res.amount;
                    return res;
                }).catch(function() { return { ok: false, dropped: false }; });
            };
            window.goldGameArtifactRefine = function(artifactId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-artifacts/refine', { artifactId: artifactId }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetRefineStones().then(function() { return window.goldGameGetNetworkArtifacts().then(function() { return res; }); });
                    throw new Error(res.message || '洗练失败');
                });
            };
            window.goldGameArtifactDiscard = function(artifactId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-artifacts/discard', { artifactId: artifactId }, true).then(function(res) {
                    if (res.ok) return window.goldGameGetNetworkArtifacts();
                    throw new Error(res.message || '丢弃失败');
                });
            };
            window.goldGameMarketSellStone = function(amount, price, opts) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                opts = opts || {};
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                var body = { amount: amount, playerName: playerName };
                if (opts.saleMode === 'auction') {
                    body.saleMode = 'auction';
                    body.minBid = opts.minBid;
                    if (opts.buyNowPrice != null && opts.buyNowPrice !== '' && !isNaN(Number(opts.buyNowPrice))) body.buyNowPrice = Number(opts.buyNowPrice);
                } else {
                    body.price = price;
                }
                return apiRequest('POST', '/api/network-market/sell-stone', body, true).then(function(res) {
                    if (res.ok) { window.goldGameGetUpgradeStones(); return res; }
                    throw new Error(res.message || '上架失败');
                });
            };
            window.goldGameMarketSellRefineStone = function(amount, price, opts) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                opts = opts || {};
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                var body = { amount: amount, playerName: playerName };
                if (opts.saleMode === 'auction') {
                    body.saleMode = 'auction';
                    body.minBid = opts.minBid;
                    if (opts.buyNowPrice != null && opts.buyNowPrice !== '' && !isNaN(Number(opts.buyNowPrice))) body.buyNowPrice = Number(opts.buyNowPrice);
                } else {
                    body.price = price;
                }
                return apiRequest('POST', '/api/network-market/sell-refine-stone', body, true).then(function(res) {
                    if (res.ok) { window.goldGameGetRefineStones(); return res; }
                    throw new Error(res.message || '上架失败');
                });
            };
            // ========== 深渊神兽（联网） ==========
            window.goldGameGetNetworkAbyssDivine = function() {
                if (!hasApi()) return Promise.resolve({ ok: false });
                return apiRequest('GET', '/api/network-abyss-divine', undefined, true).then(function(res) {
                    if (res.ok) {
                        window._networkAbyssDivineCache = { equippedId: res.equippedId, beasts: res.beasts || [], petEquip: res.petEquip || [], petNeidan: res.petNeidan || [], petShoujue: res.petShoujue || [], beastVault: res.beastVault || { list: [], capacity: 5, expandCount: 0 }, speciesCodex: res.speciesCodex || [], speciesCatalog: res.speciesCatalog || [] };
                        if (typeof updatePlayerBattleStats === 'function') updatePlayerBattleStats();
                    }
                    return res;
                }).catch(function() { return { ok: false }; });
            };
            // 深渊神兽联网掉落：增加简单节流，避免自动深渊高速闯关时每层都打网络请求导致前端感觉卡顿
            window._lastAbyssDivineDropCheck = window._lastAbyssDivineDropCheck || 0;
            window.goldGameTryDropAbyssDivine = function(floor) {
                var nf = Math.floor(Number(floor));
                if (!hasApi() || !getToken() || !Number.isFinite(nf) || nf < 40) return Promise.resolve({ ok: true, dropped: false });
                var now = Date.now();
                // 与服务器交互最少间隔 1000ms；间隔内直接视为未掉落，减少高频联网带来的卡顿感
                if (now - window._lastAbyssDivineDropCheck < 1000) {
                    return Promise.resolve({ ok: true, dropped: false });
                }
                window._lastAbyssDivineDropCheck = now;
                var playerName = getCurrentPlayerDisplayName();
                return apiRequest('POST', '/api/network-abyss-divine/try-drop', { floor: nf, playerName: playerName }, true).then(function(res) {
                    if (res.ok && res.dropped && window._networkAbyssDivineCache) {
                        if (res.dropType === 'abyssBeast' && res.beast) { window._networkAbyssDivineCache.beasts = window._networkAbyssDivineCache.beasts || []; window._networkAbyssDivineCache.beasts.push(res.beast); }
                        else if (res.dropType === 'abyssPetEquip' && res.item) { window._networkAbyssDivineCache.petEquip = window._networkAbyssDivineCache.petEquip || []; window._networkAbyssDivineCache.petEquip.push(res.item); }
                        else if (res.dropType === 'abyssPetNeidan' && res.item) { window._networkAbyssDivineCache.petNeidan = window._networkAbyssDivineCache.petNeidan || []; window._networkAbyssDivineCache.petNeidan.push(res.item); }
                        else if (res.dropType === 'abyssPetShoujue' && res.item) { window._networkAbyssDivineCache.petShoujue = window._networkAbyssDivineCache.petShoujue || []; window._networkAbyssDivineCache.petShoujue.push(res.item); }
                    }
                    return res;
                }).catch(function() { return { ok: false, dropped: false }; });
            };
            window.goldGameAbyssDivineEquipBeast = function(beastId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/equip-beast', { beastId: beastId }, true).then(function(res) { if (res.ok) window._networkAbyssDivineCache.equippedId = beastId; return res; });
            };
            window.goldGameAbyssDivineUnequipBeast = function() {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/unequip-beast', {}, true).then(function(res) { if (res.ok) window._networkAbyssDivineCache.equippedId = null; return res; });
            };
            window.goldGameAbyssDivineEquipPetEquip = function(beastId, itemId, slot) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/equip-pet-equip', { beastId: beastId, itemId: itemId, slot: slot }, true);
            };
            window.goldGameAbyssDivineUnequipPetEquip = function(beastId, slot) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/unequip-pet-equip', { beastId: beastId, slot: slot }, true);
            };
            window.goldGameAbyssDivineRenameBeast = function(beastId, name) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/rename-beast', { beastId: beastId, name: name }, true);
            };
            window.openNetworkAbyssDivineRenameBeast = function(beastId, currentName) {
                if (!hasApi()) { alert('未联网'); return; }
                var nn = prompt('请输入新的神兽名字（最多16个字符）', currentName || '');
                if (!nn || !nn.trim()) return;
                goldGameAbyssDivineRenameBeast(beastId, nn.trim()).then(function(r) {
                    if (r && r.ok) {
                        goldGameGetNetworkAbyssDivine().then(function() {
                            refreshNetworkAbyssDivinePanel();
                        });
                    } else {
                        alert((r && r.message) || '改名失败');
                    }
                }).catch(function(e) { alert((e && e.message) || '改名失败'); });
            };
            window.goldGameAbyssDivineEquipNeidan = function(beastId, neidanId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/equip-neidan', { beastId: beastId, neidanId: neidanId }, true);
            };
            window.goldGameAbyssDivineUnequipNeidan = function(beastId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/unequip-neidan', { beastId: beastId }, true);
            };
            window.goldGameAbyssDivineUseShoujue = function(beastId, shoujueId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/use-shoujue', { beastId: beastId, shoujueId: shoujueId }, true);
            };
            window.goldGameAbyssDivineReleaseBeast = function(beastId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/release-beast', { beastId: beastId }, true);
            };
            window.goldGameAbyssDivineSynthesize = function(beastId1, beastId2) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/synthesize', { beastId1: beastId1, beastId2: beastId2 }, true);
            };
            window.goldGameAbyssDivineStoreBeast = function(beastId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/store-beast', { beastId: beastId }, true);
            };
            window.goldGameAbyssDivineWithdrawBeast = function(beastId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/withdraw-beast', { beastId: beastId }, true);
            };
            window.goldGameAbyssDivineExpandVault = function() {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/expand-vault', {}, true);
            };
            window.goldGameAbyssDivineSpeciesCodexPlace = function(beastId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/species-codex-place', { beastId: beastId }, true);
            };
            window.goldGameAbyssDivineSpeciesCodexRemove = function(speciesId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/species-codex-remove', { speciesId: speciesId }, true);
            };
            window.goldGameAbyssDivineDiscardPetEquip = function(itemId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/discard-pet-equip', { itemId: itemId }, true);
            };
            window.goldGameAbyssDivineDiscardPetNeidan = function(neidanId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/discard-pet-neidan', { neidanId: neidanId }, true);
            };
            window.goldGameAbyssDivineUpgradeNeidan = function(neidanId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/upgrade-neidan', { neidanId: neidanId }, true);
            };
            window.goldGameAbyssDivineDiscardPetShoujue = function(shoujueId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/network-abyss-divine/discard-pet-shoujue', { shoujueId: shoujueId }, true);
            };
            window.goldGameMarketSellAbyssDivine = function(itemType, itemId, price, opts) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                opts = opts || {};
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                var body = { itemType: itemType, itemId: itemId, playerName: playerName };
                if (opts.saleMode === 'auction') {
                    body.saleMode = 'auction';
                    body.minBid = opts.minBid;
                    if (opts.buyNowPrice != null && opts.buyNowPrice !== '' && !isNaN(Number(opts.buyNowPrice))) body.buyNowPrice = Number(opts.buyNowPrice);
                } else {
                    body.price = price;
                }
                return apiRequest('POST', '/api/network-market/sell-abyss-divine', body, true);
            };
            // ========== 联网家族 ==========
            window._familyWorldExpBonusPercent = 0;
            window.goldGameFamilyList = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, list: [] });
                return apiRequest('GET', '/api/family/list', undefined, false).then(function(res) { return res.ok ? res : { ok: false, list: [] }; }).catch(function() { return { ok: false, list: [] }; });
            };
            window.goldGameFamilyCreate = function(name) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/family/create', { name: (name || '').trim() }, true).then(function(res) {
                    if (res.ok) { window.goldGameGetNetworkCoin().catch(function(){}); return res; }
                    throw new Error(res.message || '创建失败');
                });
            };
            window.goldGameFamilyApply = function(familyId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/family/apply', { familyId: familyId }, true).then(function(res) {
                    if (res.ok) return res;
                    throw new Error(res.message || '申请失败');
                });
            };
            window.goldGameFamilyApplications = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, list: [], canManage: false });
                return apiRequest('GET', '/api/family/applications', undefined, true).catch(function() { return { ok: false, list: [], canManage: false }; });
            };
            window.goldGameFamilyApproveApplication = function(applicantId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/family/approve-application', { applicantId: applicantId }, true).then(function(res) {
                    if (res.ok) return res;
                    throw new Error(res.message || '操作失败');
                });
            };
            window.goldGameFamilyRejectApplication = function(applicantId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/family/reject-application', { applicantId: applicantId }, true).then(function(res) {
                    if (res.ok) return res;
                    throw new Error(res.message || '操作失败');
                });
            };
            window.goldGameFamilyLeave = function() {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/family/leave', {}, true).then(function(res) {
                    if (res.ok) return res;
                    throw new Error(res.message || '退出失败');
                });
            };
            window.goldGameFamilyMine = function() {
                if (!hasApi()) return Promise.resolve({ ok: true, family: null });
                return apiRequest('GET', '/api/family/mine', undefined, true).then(function(res) {
                    if (res.ok && res.family) window._familyWorldExpBonusPercent = (res.family.worldExpBonusPercent != null ? res.family.worldExpBonusPercent : 0);
                    return res;
                }).catch(function() { return { ok: false, family: null }; });
            };
            window.goldGameFamilyBonus = function() {
                if (!hasApi() || !getToken()) {
                    window._goldGameFamilyName = null;
                    if (typeof updateGoldGameFamilyNameDisplay === 'function') updateGoldGameFamilyNameDisplay();
                    return Promise.resolve({ ok: true, worldExpBonusPercent: 0, inFamily: false, familyName: null });
                }
                return apiRequest('GET', '/api/family/bonus', undefined, true).then(function(res) {
                    if (res.ok && typeof res.worldExpBonusPercent === 'number') window._familyWorldExpBonusPercent = res.worldExpBonusPercent;
                    window._goldGameFamilyName = (res.ok && res.familyName != null && res.familyName !== '') ? String(res.familyName) : null;
                    if (typeof updateGoldGameFamilyNameDisplay === 'function') updateGoldGameFamilyNameDisplay();
                    if (res.ok && res.inFamily && typeof window.goldGameFamilyShopStatus === 'function') {
                        window.goldGameFamilyShopStatus().catch(function() {});
                    }
                    return res;
                }).catch(function() {
                    window._goldGameFamilyName = null;
                    if (typeof updateGoldGameFamilyNameDisplay === 'function') updateGoldGameFamilyNameDisplay();
                    return { ok: false, worldExpBonusPercent: 0, inFamily: false, familyName: null };
                });
            };
            window.updateGoldGameFamilyNameDisplay = function() {
                var el = document.getElementById('goldGameFamilyNameDisplay');
                if (!el) return;
                var hasToken = typeof getToken === 'function' && getToken();
                var name = (typeof window._goldGameFamilyName === 'string' && window._goldGameFamilyName) ? window._goldGameFamilyName : null;
                if (hasToken && name) {
                    el.textContent = '\u5bb6\u65cf\uff1a' + name;
                    el.style.display = '';
                } else {
                    el.textContent = '';
                    el.style.display = 'none';
                }
            };
            window.getFamilyWorldExpBonusPercent = function() {
                var base = (typeof window._familyWorldExpBonusPercent === 'number') ? window._familyWorldExpBonusPercent : 0;
                if (typeof window.isGoldGameFamilyBuffActive === 'function' && window.isGoldGameFamilyBuffActive('exp')) {
                    return base + 200; // 经验药水：额外+200% 世界经验
                }
                return base;
            };
            window.goldGameFamilyKick = function(memberId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/family/kick', { memberId: memberId }, true).then(function(res) {
                    if (res.ok) return res;
                    throw new Error(res.message || '操作失败');
                });
            };
            window.goldGameFamilyTransferLeader = function(memberId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/family/transfer-leader', { memberId: memberId }, true).then(function(res) {
                    if (res.ok) return res;
                    throw new Error(res.message || '操作失败');
                });
            };
            window.goldGameFamilyDisband = function() {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/family/disband', {}, true).then(function(res) {
                    if (res.ok) return res;
                    throw new Error(res.message || '操作失败');
                });
            };
            window.goldGameFamilyAppointVice = function(memberId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/family/appoint-vice', { memberId: memberId }, true).then(function(res) {
                    if (res.ok) return res;
                    throw new Error(res.message || '操作失败');
                });
            };
            window.goldGameFamilyRemoveVice = function(memberId) {
                if (!hasApi()) return Promise.reject(new Error('未联网'));
                return apiRequest('POST', '/api/family/remove-vice', { memberId: memberId }, true).then(function(res) {
                    if (res.ok) return res;
                    throw new Error(res.message || '操作失败');
                });
            };
            window._goldGameFamilyBuffs = null;
            window._goldGameFamilyBuffTimer = null;
            window._goldGameFamilyInFamily = false;
            window.isGoldGameFamilyBuffActive = function(key) {
                if (!hasApi() || !getToken()) return false;
                var buffs = window._goldGameFamilyBuffs || {};
                var b = buffs[key];
                if (!b || b.expiresAt == null) return false;
                var exp = Number(b.expiresAt);
                return Number.isFinite(exp) && exp > Date.now();
            };
            window.goldGameFamilyShopStatus = function() {
                if (!hasApi() || !getToken()) return Promise.resolve({ ok: false });
                return apiRequest('GET', '/api/family/shop-status', undefined, true).then(function(res) {
                    if (res && res.ok) {
                        window._goldGameFamilyInFamily = !!res.inFamily;
                        window._goldGameFamilyBuffs = res.buffs || {};
                        if (typeof updateGoldGameFamilyBuffUI === 'function') updateGoldGameFamilyBuffUI(res);
                    }
                    return res;
                }).catch(function() { return { ok: false }; });
            };
            window.goldGameFamilyBuyBuff = function(type) {
                if (!hasApi() || !getToken()) return Promise.reject(new Error('未联网，无法购买家族药水'));
                return apiRequest('POST', '/api/family/buy-buff', { type: type }, true).then(function(res) {
                    if (res && res.ok) {
                        window._goldGameFamilyInFamily = !!res.inFamily;
                        window._goldGameFamilyBuffs = res.buffs || {};
                        if (typeof updateGoldGameFamilyBuffUI === 'function') updateGoldGameFamilyBuffUI(res);
                    }
                    return res;
                });
            };
            window.updateGoldGameFamilyBuffUI = function(res) {
                var data = res || {};
                var total = (data.totalContribution != null) ? data.totalContribution : (data.family && data.family.totalContribution != null ? data.family.totalContribution : 0);
                var buffs = data.buffs || window._goldGameFamilyBuffs || {};
                var totalEl = document.getElementById('goldGameFamilyTotalContribution');
                if (totalEl) totalEl.textContent = String(total || 0);
                function fmtRemain(expiresAt) {
                    var exp = Number(expiresAt);
                    if (!Number.isFinite(exp)) return '无';
                    var remain = exp - Date.now();
                    if (remain <= 0) return '无';
                    var sec = Math.floor(remain / 1000);
                    var h = Math.floor(sec / 3600);
                    var m = Math.floor((sec % 3600) / 60);
                    var s = sec % 60;
                    return (h > 0 ? h + '小时' : '') + (m > 0 ? (h > 0 ? ' ' : '') + m + '分' : (h > 0 ? '' : '')) + (h === 0 && m === 0 ? s + '秒' : '');
                }
                function setTimerSpan(id, buffKey) {
                    var span = document.getElementById(id);
                    if (!span) return;
                    var b = buffs && buffs[buffKey] ? buffs[buffKey] : null;
                    span.textContent = fmtRemain(b && b.expiresAt);
                }
                setTimerSpan('goldGameFamilyBuffTimer-exp', 'exp');
                setTimerSpan('goldGameFamilyBuffTimer-gps', 'gps');
                setTimerSpan('goldGameFamilyBuffTimer-click', 'click');
                setTimerSpan('goldGameFamilyBuffTimer-cultivation', 'cultivation');
                var summaryEl = document.getElementById('goldGameFamilyShopBuffStatus');
                var lines = [];
                if (typeof window.isGoldGameFamilyBuffActive === 'function' && window.isGoldGameFamilyBuffActive('exp')) lines.push('经验药水生效中');
                if (typeof window.isGoldGameFamilyBuffActive === 'function' && window.isGoldGameFamilyBuffActive('gps')) lines.push('金币药水生效中');
                if (typeof window.isGoldGameFamilyBuffActive === 'function' && window.isGoldGameFamilyBuffActive('click')) lines.push('伤害药水生效中');
                if (typeof window.isGoldGameFamilyBuffActive === 'function' && window.isGoldGameFamilyBuffActive('cultivation')) lines.push('修仙药水生效中');
                if (summaryEl) summaryEl.textContent = lines.length ? ('当前生效：' + lines.join('，')) : '当前无生效中的家族药水';
                var buffStatusEl = document.getElementById('goldGameFamilyBuffStatus');
                if (buffStatusEl) {
                    var parts = [];
                    parts.push('家族总贡献：' + (total || 0));
                    if (lines.length) parts.push(lines.join('，'));
                    buffStatusEl.textContent = parts.join(' ｜ ');
                }
                if (window._goldGameFamilyBuffTimer) {
                    clearInterval(window._goldGameFamilyBuffTimer);
                    window._goldGameFamilyBuffTimer = null;
                }
                if (buffs && ((buffs.exp && buffs.exp.expiresAt) || (buffs.gps && buffs.gps.expiresAt) || (buffs.click && buffs.click.expiresAt) || (buffs.cultivation && buffs.cultivation.expiresAt))) {
                    window._goldGameFamilyBuffTimer = setInterval(function() {
                        window.updateGoldGameFamilyBuffUI({ totalContribution: total, buffs: window._goldGameFamilyBuffs, inFamily: window._goldGameFamilyInFamily });
                    }, 1000);
                }
            };
            window.goldGameFamilyDailyReport = function(floor) {
                if (!hasApi() || !getToken()) return Promise.resolve({ ok: false });
                var playerName = (typeof player !== 'undefined' && player && player.name) ? player.name : '';
                return apiRequest('POST', '/api/family/daily-report', { floor: floor, playerName: playerName }, true).then(function(res) {
                    if (res.ok && res.artifactDropped && res.artifact && window._networkArtifactsCache) {
                        window._networkArtifactsCache.bag = window._networkArtifactsCache.bag || [];
                        window._networkArtifactsCache.bag.push(res.artifact);
                    }
                    if (res.ok && res.networkCoinGranted > 0 && typeof goldGameGetNetworkCoin === 'function') {
                        goldGameGetNetworkCoin().catch(function() {});
                    }
                    return res;
                }).catch(function() { return { ok: false }; });
            };
            window.goldGameFamilyDailyProgress = function() {
                if (!hasApi() || !getToken()) return Promise.resolve({ ok: true, layers: [], artifactDrops: [] });
                return apiRequest('GET', '/api/family/daily-progress', undefined, true).catch(function() { return { ok: false, layers: [], artifactDrops: [], milestoneNetworkCoins: [] }; });
            };
            window.getNetworkArtifactAttackPct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.atkPct) || 0; };
            window.getNetworkArtifactDefensePct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.defPct) || 0; };
            window.getNetworkArtifactHealthPct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.hpPct) || 0; };
            window.getNetworkArtifactCritRatePct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.critRatePct) || 0; };
            window.getNetworkArtifactCritDmgPct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.critDmgPct) || 0; };
            window.getNetworkArtifactPetAtkPct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.petAtkPct) || 0; };
            window.getNetworkArtifactPetDefPct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.petDefPct) || 0; };
            window.getNetworkArtifactPetHpPct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.petHpPct) || 0; };
            window.getNetworkArtifactPetCritRatePct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.petCritRatePct) || 0; };
            window.getNetworkArtifactPetCritDmgPct = function() { return (window._networkArtifactBonuses && window._networkArtifactBonuses.petCritDmgPct) || 0; };
            /** 已登录时禁用「登录/注册」、弹窗内「登录」「注册」及用户名/密码框，仅允许「登出」 */
            window.syncGoldGameAccountAuthButtons = function() {
                var logged = !!getToken();
                var ids = [
                    'goldGameLoginRegisterBtn',
                    'goldGameLoginSubmitBtn',
                    'goldGameRegisterSubmitBtn',
                    'goldGameLoginUsername',
                    'goldGameLoginPassword'
                ];
                for (var i = 0; i < ids.length; i++) {
                    var el = document.getElementById(ids[i]);
                    if (!el) continue;
                    el.disabled = logged;
                    el.setAttribute('aria-disabled', logged ? 'true' : 'false');
                    el.style.opacity = logged ? '0.55' : '';
                    el.style.cursor = logged ? 'not-allowed' : '';
                    el.title = logged ? '已登录，请先点「登出」后再登录其他账号' : '';
                }
            };
            setTimeout(function() { if (typeof window.syncGoldGameAccountAuthButtons === 'function') window.syncGoldGameAccountAuthButtons(); }, 0);
        })();

        // 加载游戏
        function loadGame(opts) {
    opts = opts || {};
    window._tradingOfflineRunThisSession = false; // 主动加载存档时允许本次离线结算
    window._tradingOfflineCheckedThisSession = false;
    if (window._goldGameCloudLoadActive && typeof window.updateGoldGameCloudLoadProgress === 'function') {
        window.updateGoldGameCloudLoadProgress('正在初始化游戏界面…', 88, 'init');
    }
    if (!opts.skipLoadSave) loadSave();
    if (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken() && typeof goldGameGetNetworkArtifacts === 'function') {
        goldGameGetNetworkArtifacts().catch(function() {});
        if (typeof goldGameGetNetworkAbyssDivine === 'function') goldGameGetNetworkAbyssDivine().catch(function() {});
        if (typeof goldGameGetSupremeArtifacts === 'function') goldGameGetSupremeArtifacts().catch(function() {});
        if (typeof goldGameGetNetworkCoin === 'function') goldGameGetNetworkCoin().catch(function() {});
        if (typeof goldGameFamilyBonus === 'function') goldGameFamilyBonus().catch(function() {});
        else if (typeof goldGameFamilyShopStatus === 'function') goldGameFamilyShopStatus().catch(function() {});
        if (typeof window.startGoldGameMapleCoinMinuteLoop === 'function') window.startGoldGameMapleCoinMinuteLoop();
        if (typeof syncDongtianProfileToMainPlayer === 'function') syncDongtianProfileToMainPlayer();
    }
    if (typeof runTradingOfflineIfNeeded === 'function') runTradingOfflineIfNeeded();
    if (player && player.trading && player.trading.autoTrade && player.trading.autoTrade.enabled && typeof startAutoTradeSystem === 'function') {
        startAutoTradeSystem();
    }
  initReincarnationEquipmentSystem();
   updateSectNameDisplay();
    updateDisplay();
   calculateTotalGPS();
  initMarriageSystem();
 initTreasureData();
 initChildData();
addChildSystemToGameLoop();
      if (player.investmentGame) {
        // 先模拟离线变化
        simulateOfflinePriceChanges();
        
        // 再启动实时模拟
        setTimeout(() => {
            startPriceSimulation();
        }, 1000);
    }
  if (!player.timeSecretRealm) {
        player.timeSecretRealm = {
            currency: 0,
            bestFloor: 0,
            clearCount: 0,
            unlockedItems: [],
            currentRun: {
                isActive: false,
                currentFloor: 1,
                timeLeft: 300,
                tempBuffs: [],
                currentRoom: null,
                exploredRooms: 0,
                currencyEarned: 0,
                playerHealth: 0,
                playerAttack: 0
            },
         difficulty: {
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
    current: 'easy',
    unlocked: ['easy']
},
            roomTypes: {
                battle: { weight: 40, name: '战斗房间' },
                event: { weight: 25, name: '事件房间' },
                treasure: { weight: 20, name: '宝箱房间' },
                rest: { weight: 10, name: '休息房间' },
                shop: { weight: 5, name: '商店房间' }
            },
            tempBuffs: {
                attack: { 
        name: '攻击强化', 
        description: '攻击力提升50%，探索时间+30秒', 
        effect: 'attack', 
        value: 0.5, 
        duration: 0,
        timeBonus: 30  // 新增：增加20秒探索时间
    },
    health: { 
        name: '生命强化', 
        description: '生命值提升50%，探索时间+60秒', 
        effect: 'health', 
        value: 0.5, 
        duration: 0,
        timeBonus: 60  // 新增：增加40秒探索时间
    },
    critRate: { 
        name: '暴击强化', 
        description: '暴击率提升10%，探索时间+90秒', 
        effect: 'critRate', 
        value: 0.1, 
        duration: 0,
        timeBonus: 90  // 新增：增加60秒探索时间
    },
    critDamage: { 
        name: '爆伤强化', 
        description: '爆伤提升50%，探索时间+120秒', 
        effect: 'critDamage', 
        value: 0.5, 
        duration: 0,
        timeBonus: 120  // 新增：增加80秒探索时间
    },
    speed: { 
        name: '速度强化', 
        description: '探索速度提升，探索时间+150秒', 
        effect: 'speed', 
        value: 10, 
        duration: 0,
        timeBonus: 150  // 新增：增加100秒探索时间
    },
                luck: { name: '幸运强化', description: '获得双倍秘境币', effect: 'luck', value: 1, duration: 0  }
            },
            shopItems: {
                permanentAttack: { 
                    name: '永恒攻击符文', 
                    description: '临时提升现有攻击力50%可以叠加（转生失效)', 
                    cost: 100000, 
                    type: 'permanent',
                    effect: 'attack'
                },
                permanentHealth: { 
                    name: '永恒生命符文', 
                    description: '临时提升现有生命值50%可以叠加（转生失效)', 
                    cost: 100000, 
                    type: 'permanent',
                    effect: 'health'
                },
                timeExtension: { 
        name: '时间沙漏', 
        description: '永久增加探索时间60秒（限购50个）', 
        cost: 500000, 
        type: 'permanent',
        effect: 'time',
        maxPurchase: 50, // 限购50个
        purchased: 0, // 已购买数量
        permanentEffect: true // 永久效果
    },
    startingBuff: { 
        name: '起始祝福', 
        description: '每次冒险开始时永久获得1个随机增益效果（限购2个）', 
        cost: 800000, 
        type: 'permanent',
        effect: 'startingBuff',
        maxPurchase: 2, // 限购2个
        purchased: 0, // 已购买数量
        permanentEffect: true // 永久效果
    },
           trapSkillBook1: {
    name: '侦查技能书·初级',
    description: '提升陷阱侦查成功率到60%',
    cost: 500000,
    type: 'permanent',
    effect: 'detection_advanced'
},
 trapSkillBook2: {
    name: '侦查技能书·高级',
    description: '提升陷阱侦查成功率到80%',
    cost: 800000,
    type: 'permanent',
    effect: 'detection_expert'
},
 trapSkillBook3: {
    name: '解除技能书·初级',
    description: '提升陷阱解除成功率到70%',
    cost: 500000,
    type: 'permanent',
    effect: 'disarm_advanced'
},
 trapSkillBook4: {
    name: '解除技能书·高级',
    description: '提升陷阱解除成功率到85%',
    cost: 800000,
    type: 'permanent',
    effect: 'disarm_expert'
},
 trapSense: {
    name: '陷阱感知药水',
    description: '下次冒险陷阱侦查成功率提升30%',
    cost: 10000,
    type: 'consumable',
    effect: 'detection_boost'
},
                rareMaterial: { 
                    name: '秘境结晶', 
                    description: '神器碎片1000个', 
                    cost: 100000, 
                    type: 'material',
                    effect: 'material'
                }
            },
traps: {
    // 陷阱类型配置
    types: {
        poison: { weight: 20, name: '毒液陷阱', damageType: 'percentage', damage: 0.15, duration: 3 },
        spike: { weight: 15, name: '尖刺陷阱', damageType: 'fixed', damage: 1000, duration: 1 },
        curse: { weight: 10, name: '诅咒陷阱', damageType: 'debuff', effect: 'attack', value: -0.3, duration: 5 },
        slow: { weight: 12, name: '迟缓陷阱', damageType: 'time', damage: 30, duration: 0 },
        confusion: { weight: 8, name: '混乱陷阱', damageType: 'random', damage: 0.2, duration: 2 },
        disarm: { weight: 5, name: '缴械陷阱', damageType: 'debuff', effect: 'critRate', value: -0.5, duration: 4 }
    },
    
    // 陷阱检测技能
    detectionSkills: {
        basic: { name: '基础侦查', successRate: 0.3, cost: 5 },
        advanced: { name: '高级侦查', successRate: 0.6, cost: 15 },
        expert: { name: '专家侦查', successRate: 0.8, cost: 25 },
        master: { name: '大师侦查', successRate: 0.95, cost: 40 }
    },
    
    // 陷阱解除技能
    disarmSkills: {
        basic: { name: '基础解除', successRate: 0.4, cost: 10 },
        advanced: { name: '高级解除', successRate: 0.7, cost: 20 },
        expert: { name: '专家解除', successRate: 0.85, cost: 35 },
        master: { name: '大师解除', successRate: 1.0, cost: 50 }
    },
    
    // 玩家掌握的陷阱技能
    playerSkills: {
        detection: 'basic',
        disarm: 'basic'
    }
 }
        };
    
    
    updateTimeSecretRealmUI();
}
 player.traditionalLotteryPurchased = localStorage.getItem('traditionalLotteryPurchased') === 'true';
 if (player.parking) {
        calculateOfflineParkingIncome();
    }
    logAction('游戏已加载', 'success');
}
 const ENCRYPTION_KEY = "your-secure-key-here-123";
        // 导出存档
        function exportSave() {
        try {
            // 转换玩家数据为JSON字符串
            const saveData = JSON.stringify(player);
            // 使用AES加密
            const encryptedData = CryptoJS.AES.encrypt(
                saveData,
                ENCRYPTION_KEY
            ).toString();
            
            // 复制加密后的数据到剪贴板
            const textArea = document.createElement('textarea');
            textArea.value = encryptedData;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            logAction('加密存档已复制到剪贴板', 'success');
        } catch (error) {
            logAction('存档导出失败', 'error');
            console.error('导出错误:', error);
        }
    }
function downloadSave() {
    try {
        // 获取当前存档数据
        const saveData = JSON.stringify(player);
        
        // 使用AES加密存档
        const encryptedData = CryptoJS.AES.encrypt(
            saveData,
            ENCRYPTION_KEY
        ).toString();
        
        // 创建Blob对象
        const blob = new Blob([encryptedData], { type: 'text/plain' });
        
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gold_adventurer_save_${new Date().toISOString().slice(0, 10)}.txt`;
        
        // 触发下载
        document.body.appendChild(a);
        a.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        logAction('存档已加密并下载', 'success');
    } catch (error) {
        logAction('存档下载失败: ' + error.message, 'error');
        console.error('存档下载错误:', error);
    }
}
function importEncryptedSave() {
    const lastImportTime = localStorage.getItem('lastImportTime');
    if (lastImportTime) {
        const currentTime = Date.now();
        const timeDiff = currentTime - parseInt(lastImportTime);
        const cooldown = 6 * 60 * 60 * 1000; // 6小时冷却时间
        
        if (timeDiff < cooldown) {
            const remaining = Math.ceil((cooldown - timeDiff) / (60 * 1000));
            logAction(`导入功能冷却中，请等待 ${remaining} 分钟后再试`, "error");
            return;
        }
    }
    
    // 触发文件选择器
    document.getElementById('fileInput').click();
    
    // 添加文件选择事件监听
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
}


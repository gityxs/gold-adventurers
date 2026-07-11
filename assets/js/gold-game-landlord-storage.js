// 地主仓库与合成
        function toggleLockLandlordFruit(fruitIndex) {
            const fruit = player.landlord.fruitStorage[fruitIndex];
            
            if (!fruit) {
                showLandlordNotification("果实不存在！", "error");
                return;
            }
            
            // 切换锁定状态
            fruit.isLocked = !fruit.isLocked;
            
            // 更新显示
            renderLandlordFruitStorage();
            
            showLandlordNotification(`${fruit.type}已${fruit.isLocked ? '锁定' : '解锁'}！`, "info");
            saveGame();
        }

        // 解锁新地块
        function unlockLandlordField() {
            const currentFields = player.landlord.unlockedFields;
            let unlockCost = 0;
            
            if (currentFields === 5) {
                unlockCost = 100000; // 解锁6-10块地
            } else if (currentFields === 10) {
                unlockCost = 2000000; // 解锁11-15块地
            } else if (currentFields === 15) {
                unlockCost = 50000000; // 解锁16-20块地
            } else if (currentFields === 20) {
                unlockCost = 500000000; // 解锁21-25块地
             } else if (currentFields === 25) {
                unlockCost = 5000000000; // 解锁26-30块地
             } else if (currentFields === 30) {
                unlockCost = 50000000000; // 解锁31-35块地
             } else if (currentFields === 35) {
                unlockCost = 5000000000000; // 解锁36-40块地
            } else if (currentFields === 40) {
                unlockCost = 500000000000000; // 解锁41-45块地
            } else if (currentFields === 45) {
                unlockCost = 50000000000000000; // 解锁46-50块地
            } else {
                showLandlordNotification("已解锁所有地块！", "info");
                return;
            }
            
            if (player.landlord.coins < unlockCost) {
                showLandlordNotification(`需要${formatNumber(unlockCost)}地主币！`, "error");
                return;
            }
            
            // 扣除地主币
            player.landlord.coins -= unlockCost;
            
            // 解锁新地块
            player.landlord.unlockedFields += 5;
            
            // 扩展田地数组
            for (let i = 0; i < 5; i++) {
                player.landlord.fields.push(null);
            }
            
            // 更新显示
            updateLandlordCoinDisplay();
            renderLandlordFields();
            updateLandlordStats();
            
            showLandlordNotification(`成功解锁5块新田地！`, "success");
            saveGame();
        }

        // 更新天气（每10分钟判定一次：40%改天气并给作物加词条，60%保持晴朗；必须更新 lastWeatherChange 否则会每秒重判）
        function updateLandlordWeather() {
            const now = Date.now();
            const timeSinceChange = now - player.landlord.lastWeatherChange;
            
            if (timeSinceChange >= 10 * 60 * 1000) {
                player.landlord.lastWeatherChange = now; // 无论是否改天气都重置，保证下一个10分钟再判定
                // 40%几率改变天气
                if (Math.random() * 100 < 40) {
                    const newWeather = weatherList[Math.floor(Math.random() * weatherList.length)];
                    player.landlord.weather = newWeather;
                    
                    // 应用天气突变
                    applyLandlordWeatherMutation();
                    
                    showLandlordNotification(`天气变为：${newWeather}`, "info");
                } else {
                    player.landlord.weather = "晴朗";
                }
                
                updateLandlordStats();
            }
        }

        // 应用天气突变（每块有作物的地 15% 几率获得当前天气词条）；silent 为 true 时不弹窗、不逐格重绘（离线批量用）
        function applyLandlordWeatherMutation(silent) {
            silent = !!silent;
            if (player.landlord.weather === "晴朗") return;

            let weatherApplied = false;
            if (Array.isArray(player.landlord.fields)) {
                player.landlord.fields.forEach((plant, index) => {
                    if (plant) {
                        if (!plant.weatherMutations || !Array.isArray(plant.weatherMutations)) plant.weatherMutations = [];
                        if (Math.random() * 100 < 15) {
                            if (!plant.weatherMutations.includes(player.landlord.weather)) {
                                plant.weatherMutations.push(player.landlord.weather);
                                if (player.landlord.stats) player.landlord.stats.weatherMutations = (player.landlord.stats.weatherMutations || 0) + 1;
                                weatherApplied = true;
                                if (!silent) renderLandlordField(index);
                            }
                        }
                    }
                });
            }

            if (weatherApplied && !silent) {
                showLandlordNotification(`${player.landlord.weather}天气影响了田地！`, "info");
            }
            if (typeof applyLandlordRanchPastureMood === "function") applyLandlordRanchPastureMood(silent);
        }

        function applyLandlordRanchPastureMood(silent) {
            if (typeof player === 'undefined' || !player.landlord || !player.landlord.weather) return;
            var w = player.landlord.weather;
            if (w === '晴朗') return;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            var applied = 0;
            for (var si = 0; si < r.unlockedSlots; si++) {
                var sl = r.slots[si];
                if (!sl || !sl.animalId) continue;
                var stFull = Math.min(LANDLORD_RANCH_STOCKPILE_CAP, Math.floor(Number(sl.stockpile) || 0));
                if (stFull >= LANDLORD_RANCH_STOCKPILE_CAP) continue;
                if (!Array.isArray(sl.pastureMood)) sl.pastureMood = [];
                if (sl.pastureMood.indexOf(w) >= 0) continue;
                if (Math.random() * 100 < 15) {
                    sl.pastureMood.push(w);
                    applied++;
                }
            }
            if (applied > 0) {
                if (!silent) {
                    showLandlordNotification('草场合鸣：「' + w + '」已记入 ' + applied + ' 个牧场栏（未满囤可无限叠层；囤满后不再叠加）', 'info');
                    var tab = document.getElementById('landlordRanchTab');
                    if (tab && tab.classList.contains('active') && typeof renderLandlordRanch === 'function') renderLandlordRanch();
                }
            }
        }

        // 检查植物生长状态
        function checkLandlordPlantGrowth() {
            const now = Date.now();
            let changed = false;
            
            player.landlord.fields.forEach((plant, index) => {
                if (plant && !plant.isMature) {
                    const plantedAt = plant.plantedAt;
                    const elapsedMinutes = (now - plantedAt) / (1000 * 60);
                    
                    if (elapsedMinutes >= plant.growTime) {
                        plant.isMature = true;
                        changed = true;
                        
                        // 渲染这个地块
                        renderLandlordField(index);
                    }
                }
            });
            
            if (changed) {
                saveGame();
            }
        }

        // 渲染种子商店
        function renderLandlordStore() {
            const storeContainer = document.getElementById('landlordStoreItems');
            if (!storeContainer) return;
            
            storeContainer.innerHTML = '';
            
            for (const seedName in seedProperties) {
                const seed = seedProperties[seedName];
                const stock = player.landlord.storeItems[seedName] || 0;
                const canAfford = player.landlord.coins >= seed.price;
                
                const seedDiv = document.createElement('div');
                seedDiv.className = 'landlord-seed-item';
                seedDiv.innerHTML = `
                    <div class="landlord-seed-icon" style="background: ${seed.color};">${seedName.charAt(0)}</div>
                    <div style="font-weight: bold;">${seedName}</div>
                    <div style="font-size: 0.9em; color: #7f8c8d; margin: 5px 0;">
                        重量: ${seed.minWeight}-${seed.maxWeight}kg
                    </div>
                    <div class="landlord-seed-price">${formatNumber(seed.price)} 地主币</div>
                    <div style="margin: 5px 0; font-size: 0.9em;">库存: ${stock}</div>
                    <button class="landlord-buy-button" ${stock <= 0 || !canAfford ? 'disabled' : ''} 
                            onclick="buyLandlordSeed('${seedName}')">
                        ${stock <= 0 ? '售罄' : (canAfford ? '购买' : '货币不足')}
                    </button>
                `;
                
                storeContainer.appendChild(seedDiv);
            }
            
            // 更新刷新计时器
            updateLandlordSeedRefreshTimer();
        }

        // 渲染道具商店
        function renderLandlordItemStore() {
            const storeContainer = document.getElementById('landlordItemStoreItems');
            if (!storeContainer) return;
            
            storeContainer.innerHTML = '';
            
            for (const itemName in itemProperties) {
                const item = itemProperties[itemName];
                const stock = player.landlord.itemStoreItems[itemName] || 0;
                const canAfford = player.landlord.coins >= item.price;
                
                const itemDiv = document.createElement('div');
                itemDiv.className = 'landlord-item-item';
                itemDiv.innerHTML = `
                    <div class="landlord-item-icon" style="background: ${item.color};">${itemName.charAt(0)}</div>
                    <div style="font-weight: bold;">${itemName}</div>
                    <div style="font-size: 0.8em; color: #7f8c8d; margin: 5px 0;">${item.description}</div>
                    <div class="landlord-item-price">${formatNumber(item.price)} 地主币</div>
                    <div style="margin: 5px 0; font-size: 0.9em;">库存: ${stock}</div>
                    <button class="landlord-buy-button" ${stock <= 0 || !canAfford ? 'disabled' : ''} 
                            onclick="buyLandlordItem('${itemName}')">
                        ${stock <= 0 ? '售罄' : (canAfford ? '购买' : '货币不足')}
                    </button>
                `;
                
                storeContainer.appendChild(itemDiv);
            }
            
            // 更新刷新计时器
            updateLandlordItemRefreshTimer();
        }

        // 渲染田地
        function renderLandlordFields() {
    const fieldsContainer = document.getElementById('landlordFieldsContainer');
    const unlockSection = document.getElementById('landlordUnlockSection');
    
    if (!fieldsContainer) return;

    ensureLandlordFieldTiers(player.landlord);
    ensureLandlordBars(player.landlord);
    
    fieldsContainer.innerHTML = '';
    
    for (let i = 0; i < player.landlord.unlockedFields; i++) {
        const plant = player.landlord.fields[i];
        const isLocked = player.landlord.lockedFields[i];
        const tier = Number(player.landlord.fieldTiers[i]) || 0;
        let tierUpgradeRow = '';
        if (tier < 4) {
            const cost = LANDLORD_TIER_UPGRADE_COST[tier];
            const enough = (player.landlord.bars[cost.barKey] || 0) >= cost.amount;
            tierUpgradeRow = '<div class="landlord-field-upgrade-row"><button type="button" class="landlord-tier-upgrade-btn landlord-tier-next-' + (tier + 1) + '" ' +
                (enough ? '' : 'disabled ') +
                'onclick="upgradeLandlordFieldTier(' + i + ')">升级→' + LANDLORD_FIELD_TIER_NAMES[tier + 1] +
                '（' + cost.amount + cost.label + '）</button></div>';
        } else {
            tierUpgradeRow = '<div class="landlord-field-tier-max">已满级·流光土地</div>';
        }
        const tierLabel = '<div class="landlord-field-tier-label">' + LANDLORD_FIELD_TIER_NAMES[tier] + '</div>';
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'landlord-field landlord-field-tier-' + tier + ' ' + (!plant ? 'empty' : '') + ' ' + (isLocked ? 'locked' : '');
        
        if (!plant) {
            fieldDiv.innerHTML = `
                <div class="landlord-field-header">
                    <div class="landlord-field-info">
                        <div class="landlord-field-number">田地 ${i + 1}</div>
                        ${tierLabel}
                        <div class="landlord-field-status">空闲</div>
                    </div>
                    <button class="landlord-lock-button ${isLocked ? 'active' : ''}" 
                            onclick="toggleFieldLock(${i})" 
                            title="${isLocked ? '解锁田地' : '锁定田地'}">
                        ${isLocked ? '🔓' : '🔒'}
                    </button>
                </div>
                ${tierUpgradeRow}
                <div class="landlord-empty-content">
                    <div style="font-size: 3em; color: rgba(0,0,0,0.1); margin: 20px 0;">+</div>
                    <button class="landlord-plant-button" onclick="selectLandlordSeedForPlanting(${i})">种植</button>
                </div>
            `;
        } else {
            const timeLeft = plant.isMature ? 0 : 
                Math.max(0, Math.ceil(plant.growTime - (Date.now() - plant.plantedAt) / (1000 * 60)));
            
            const progress = plant.isMature ? 100 : 
                Math.min(100, Math.floor(((Date.now() - plant.plantedAt) / (1000 * 60)) / plant.growTime * 100));
            
            // 突变标签
            let mutationTags = '';
            
            plant.mutations.forEach(mutation => {
                const colorClass = getLandlordMutationColorClass(mutation);
                mutationTags += `<span class="landlord-mutation-tag ${colorClass}">${mutation}</span>`;
            });
            
            plant.weatherMutations.forEach(mutation => {
                const colorClass = getLandlordMutationColorClass(mutation);
                mutationTags += `<span class="landlord-mutation-tag ${colorClass}">${mutation}</span>`;
            });
            
            if (plant.specialMutation) {
                const specialName = specialMutations[plant.type] || '特殊突变';
                mutationTags += `<span class="landlord-mutation-tag landlord-mutation-rainbow">${specialName}</span>`;
            }
            
            fieldDiv.innerHTML = `
                <div class="landlord-field-header">
                    <div class="landlord-field-info">
                        <div class="landlord-field-number">田地 ${i + 1}</div>
                        ${tierLabel}
                        <div class="landlord-field-status">
                            <span class="plant-name">${plant.type}</span>
                            ${plant.isMature ? '<span class="mature-badge">已成熟</span>' : ''}
                            ${isLocked ? '<span class="lock-badge">已锁定</span>' : ''}
                        </div>
                    </div>
                    <button class="landlord-lock-button ${isLocked ? 'active' : ''}" 
                            onclick="toggleFieldLock(${i})" 
                            title="${isLocked ? '解锁田地' : '锁定田地'}">
                        ${isLocked ? '🔓' : '🔒'}
                    </button>
                </div>
                ${tierUpgradeRow}
                <div class="landlord-plant-details">
                    <div class="landlord-plant-info">
                        <div class="plant-weight">重量: <span>${plant.weight.toFixed(2)}kg</span></div>
                        <div class="plant-growth">
                            ${plant.isMature ? 
                                '<span style="color: #27ae60;">✓ 可收获</span>' : 
                                `<span style="color: #f39c12;">成长中... ${timeLeft}分钟</span>`
                            }
                        </div>
                        ${mutationTags ? `<div class="landlord-mutations-list">${mutationTags}</div>` : ''}
                    </div>
                    
                    ${!plant.isMature ? `
                        <div class="landlord-progress-bar">
                            <div class="landlord-progress-fill" style="width: ${progress}%"></div>
                        </div>
                    ` : ''}
                    
                    <div class="landlord-field-actions">
                        <div class="landlord-action-row">
                            ${plant.isMature ? 
                                `<button class="landlord-harvest-button" onclick="harvestLandlordPlant(${i})">收获</button>` : 
                                `<button class="landlord-growth-button" disabled>${progress}%</button>`
                            }
                            <button class="landlord-remove-button" onclick="removeLandlordPlant(${i})">铲除</button>
                        </div>
                        <div class="landlord-action-row">
                            <button class="landlord-item-button" onclick="selectLandlordItemForUsing(${i})">使用道具</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        fieldsContainer.appendChild(fieldDiv);
    }
            
            // 解锁地块信息
            let unlockCost = 0;
            if (player.landlord.unlockedFields === 5) {
                unlockCost = 100000;
            } else if (player.landlord.unlockedFields === 10) {
                unlockCost = 2000000;
            } else if (player.landlord.unlockedFields === 15) {
                unlockCost = 50000000;
            } else if (player.landlord.unlockedFields === 20) {
                unlockCost = 500000000;
            } else if (player.landlord.unlockedFields === 25) {
                unlockCost = 5000000000;
            }else if (player.landlord.unlockedFields === 30) {
                unlockCost = 50000000000;
            }else if (player.landlord.unlockedFields === 35) {
                unlockCost = 5000000000000;
            }else if (player.landlord.unlockedFields === 40) {
                unlockCost = 500000000000000;
            }else if (player.landlord.unlockedFields === 45) {
                unlockCost = 50000000000000000;
            }
            
            if (unlockCost > 0) {
                unlockSection.innerHTML = `
                    <h3>解锁更多田地</h3>
                    <p>解锁${player.landlord.unlockedFields + 1}-${player.landlord.unlockedFields + 5}号田地</p>
                    <p>需要: ${formatNumber(unlockCost)} 地主币</p>
                    <button class="landlord-unlock-button" ${player.landlord.coins >= unlockCost ? '' : 'disabled'} 
                            onclick="unlockLandlordField()">
                        ${player.landlord.coins >= unlockCost ? '解锁' : '货币不足'}
                    </button>
                `;
            } else {
                unlockSection.innerHTML = '<p>所有田地已解锁！</p>';
            }
        }

        // 渲染种子仓库
       function renderLandlordSeedStorage() {
    const storageContainer = document.getElementById('landlordSeedStorage');
    if (!storageContainer) return;
    
    storageContainer.innerHTML = '';
    
    // 添加合成界面标题
    const synthesisHeader = document.createElement('div');
    synthesisHeader.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #3498db;">
            <h3 style="margin: 0; color: #2c3e50;">种子仓库</h3>
            <button onclick="toggleSynthesisMode()" class="synthesis-toggle-button" style="background: #9b59b6; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                ${player.landlord.synthesisMode ? '退出合成' : '种子合成'}
            </button>
        </div>
    `;
    storageContainer.appendChild(synthesisHeader);
    
    // 合成模式下的界面
    if (player.landlord.synthesisMode) {
        renderSynthesisInterface(storageContainer);
        return;
    }
    
    // 正常模式下的种子仓库
    let hasSeeds = false;
    
    for (const seedName in player.landlord.seedStorage) {
        if (player.landlord.seedStorage[seedName] > 0) {
            hasSeeds = true;
            const seedDiv = document.createElement('div');
            seedDiv.className = 'landlord-storage-item';
            seedDiv.innerHTML = `
                <div class="landlord-item-info">
                    <div style="font-weight: bold;">${seedName}</div>
                    <div>价格: ${formatNumber(seedProperties[seedName].price)}</div>
                    ${seedSynthesisRules[seedName] && seedSynthesisRules[seedName].nextLevel ? 
                        `<div style="font-size: 0.8em; color: #9b59b6;">可合成: ${seedSynthesisRules[seedName].nextLevel}</div>` : 
                        ''}
                </div>
                <div style="font-weight: bold; color: #3498db; font-size: 1.2em;">${player.landlord.seedStorage[seedName]}</div>
            `;
            storageContainer.appendChild(seedDiv);
        }
    }
    
    if (!hasSeeds) {
        storageContainer.innerHTML += '<div style="text-align: center; padding: 20px; color: #7f8c8d;">种子仓库为空</div>';
    }
}

        // 渲染果实仓库
       function renderLandlordFruitStorage() {
            const storageContainer = document.getElementById('landlordFruitStorage');
            const totalAssets = document.getElementById('landlordTotalAssetsValue');
            
            if (!storageContainer) return;
            
            storageContainer.innerHTML = '';
             // 添加抽奖信息提示
    const lotteryInfo = document.createElement('div');
    lotteryInfo.style.background = '#fff3cd';
    lotteryInfo.style.padding = '15px';
    lotteryInfo.style.borderRadius = '5px';
    lotteryInfo.style.marginBottom = '15px';
    lotteryInfo.style.borderLeft = '4px solid #f39c12';
    
    const eligibleCount = player.landlord.fruitStorage.filter(fruit => 
        fruit && isFruitEligibleForLottery(fruit) && !fruit.isLocked
    ).length;
    
    lotteryInfo.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: bold; color: #856404;">🎯 抽奖提示</div>
                <div style="font-size: 0.9em; color: #8d6a00; margin-top: 5px;">
                    出售带有【银、金、水晶、流光】词条的果实可获得抽奖机会
                </div>
                <div style="font-size: 0.8em; color: #8d6a00; margin-top: 3px;">
                    当前可获抽奖次数: <span style="font-weight: bold;">${eligibleCount}</span> 次
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 0.9em; color: #8d6a00;">当前抽奖次数</div>
                <div style="font-size: 1.5em; font-weight: bold; color: #e74c3c;">
                    ${player.landlord.lottery.drawCount || 0}
                </div>
            </div>
        </div>
    `;
    
    storageContainer.appendChild(lotteryInfo);
            let totalValue = 0;
            let lockedValue = 0;
            let unlockedValue = 0;
            
            if (player.landlord.fruitStorage.length === 0) {
                storageContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #7f8c8d;">果实仓库为空</div>';
            } else {
                player.landlord.fruitStorage.forEach((fruit, index) => {
                    totalValue += fruit.value;
                    if (fruit.isLocked) {
                        lockedValue += fruit.value;
                    } else {
                        unlockedValue += fruit.value;
                    }
                    
                    const fruitDiv = document.createElement('div');
                    fruitDiv.className = `landlord-storage-item ${fruit.isLocked ? 'locked' : ''}`;
                    if (fruit.isLocked) {
                        fruitDiv.style.background = 'linear-gradient(135deg, #fff3cd, #ffeaa7)';
                        fruitDiv.style.border = '2px solid #f39c12';
                    }
                    
                    // 突变标签
                    let mutationTags = '';
                    
                    // 基础突变标签
                    fruit.mutations.forEach(mutation => {
                        const colorClass = getLandlordMutationColorClass(mutation);
                        mutationTags += `<span class="landlord-mutation-tag ${colorClass}" style="font-size: 0.7em; margin-right: 2px;">${mutation}</span>`;
                    });
                    
                    // 天气突变标签
                    fruit.weatherMutations.forEach(mutation => {
                        const colorClass = getLandlordMutationColorClass(mutation);
                        mutationTags += `<span class="landlord-mutation-tag ${colorClass}" style="font-size: 0.7em; margin-right: 2px;">${mutation}</span>`;
                    });
                    
                    // 特殊突变标签
                    if (fruit.specialMutation) {
                        const specialName = specialMutations[fruit.type] || '特殊';
                        mutationTags += `<span class="landlord-mutation-tag landlord-mutation-rainbow" style="font-size: 0.7em; margin-right: 2px;">${specialName}</span>`;
                    }
                    
                    fruitDiv.innerHTML = `
                        <div class="landlord-item-info" style="flex: 1;">
                            <div style="font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                                <span>${fruit.type} ${fruit.isLocked ? '🔒' : ''}</span>
                                <span>${fruit.weight.toFixed(2)}kg</span>
                            </div>
                            <div style="color: #27ae60; font-weight: bold; font-size: 1.1em;">
                                ${formatNumber(fruit.value)} 地主币
                                ${fruit.isLocked ? '<span style="color: #f39c12; font-size: 0.8em;"> (已锁定)</span>' : ''}
                            </div>
                            <div style="margin-top: 5px;">
                                ${mutationTags || '<span style="color: #95a5a6; font-size: 0.9em;">无突变</span>'}
                            </div>
                            <div style="color: #7f8c8d; font-size: 0.8em; margin-top: 5px;">
                                收获: ${fruit.harvestedAt}
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <button onclick="toggleLockLandlordFruit(${index})" 
                                    style="background: ${fruit.isLocked ? '#f39c12' : '#95a5a6'}; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 0.8em;">
                                ${fruit.isLocked ? '解锁' : '锁定'}
                            </button>
                            <button onclick="sellLandlordFruit(${index})" 
                                    ${fruit.isLocked ? 'disabled' : ''}
                                    style="background: ${fruit.isLocked ? '#bdc3c7' : '#2ecc71'}; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 0.8em;">
                                ${fruit.isLocked ? '已锁定' : '卖出'}
                            </button>
                        </div>
                    `;
                    
                    storageContainer.appendChild(fruitDiv);
                });
            }
            
            if (totalAssets) {
                let displayText = formatNumber(unlockedValue) + ' 地主币';
                if (lockedValue > 0) {
                    displayText += ` (锁定: ${formatNumber(lockedValue)})`;
                }
                totalAssets.textContent = displayText;
            }
        }

        // 渲染道具仓库
        function renderLandlordItemStorage() {
            const storageContainer = document.getElementById('landlordItemStorage');
            if (!storageContainer) return;
            
            storageContainer.innerHTML = '';
            
            let hasItems = false;
            
            for (const itemName in player.landlord.itemStorage) {
                if (player.landlord.itemStorage[itemName] > 0) {
                    hasItems = true;
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'landlord-storage-item';
                    
                    const itemColor = itemProperties[itemName].color;
                    
                    itemDiv.innerHTML = `
                        <div class="landlord-item-info">
                            <div style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                                <div style="width: 20px; height: 20px; border-radius: 50%; background: ${itemColor};"></div>
                                <span>${itemName}</span>
                            </div>
                            <div style="font-size: 0.9em; color: #7f8c8d;">${itemProperties[itemName].description}</div>
                        </div>
                        <div style="font-weight: bold; color: #9b59b6; font-size: 1.2em;">${player.landlord.itemStorage[itemName]}</div>
                    `;
                    storageContainer.appendChild(itemDiv);
                }
            }
            
            if (!hasItems) {
                storageContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #7f8c8d;">道具仓库为空</div>';
            }
        }

        // 更新统计
        function updateLandlordStats() {
            const stats = player.landlord.stats;
            
            document.getElementById('landlordTotalPlants').textContent = stats.totalPlants;
            document.getElementById('landlordTotalHarvests').textContent = stats.totalHarvests;
            document.getElementById('landlordTotalCoinsEarned').textContent = formatNumber(stats.totalCoinsEarned);
            var fishMarketEl = document.getElementById('landlordFishMarketCoinsEarned');
            if (fishMarketEl) fishMarketEl.textContent = formatNumber(stats.marketFishCoinsEarned || 0);
            var ranchCoinEl = document.getElementById('landlordRanchCoinsEarned');
            if (ranchCoinEl) ranchCoinEl.textContent = formatNumber(stats.ranchCoinsEarned || 0);
            var ranchHarvEl = document.getElementById('landlordRanchHarvests');
            if (ranchHarvEl) ranchHarvEl.textContent = String(Math.floor(Number(stats.ranchHarvests) || 0));
            var ranchVisEl = document.getElementById('landlordRanchVisitorArrivals');
            if (ranchVisEl) ranchVisEl.textContent = String(Math.floor(Number(stats.ranchVisitorArrivals) || 0));
            var ranchTickEl = document.getElementById('landlordRanchTickleCount');
            if (ranchTickEl) ranchTickEl.textContent = String(Math.floor(Number(stats.ranchTickleCount) || 0));
            var ranchLuckEl = document.getElementById('landlordRanchLuckyGrassCount');
            if (ranchLuckEl) ranchLuckEl.textContent = String(Math.floor(Number(stats.ranchLuckyGrassCount) || 0));
            var ranchRingEl = document.getElementById('landlordRanchRingGames');
            if (ranchRingEl) ranchRingEl.textContent = String(Math.floor(Number(stats.ranchRingGames) || 0));
            var ranchStarEl = document.getElementById('landlordRanchStarSpins');
            if (ranchStarEl) ranchStarEl.textContent = String(Math.floor(Number(stats.ranchStarSpins) || 0));
            var ranchDexEl = document.getElementById('landlordRanchDexSpecies');
            var ranchDexTot = document.getElementById('landlordRanchDexTotal');
            if (ranchDexEl && player.landlord.ranch) {
                ensureLandlordRanch(player.landlord);
                ranchDexEl.textContent = String(landlordRanchDexSpeciesCount(player.landlord.ranch));
            }
            if (ranchDexTot) ranchDexTot.textContent = String(typeof LANDLORD_RANCH_ANIMALS !== 'undefined' ? LANDLORD_RANCH_ANIMALS.length : 0);
            document.getElementById('landlordCurrentWeather').textContent = player.landlord.weather;
            document.getElementById('landlordBasicMutations').textContent = stats.basicMutations;
            document.getElementById('landlordWeatherMutations').textContent = stats.weatherMutations;
            document.getElementById('landlordSpecialMutations').textContent = stats.specialMutations;
            document.getElementById('landlordHighestMultiplier').textContent = stats.highestMultiplier.toFixed(1) + 'x';
            document.getElementById('landlordUnlockedFields').textContent = player.landlord.unlockedFields;
            document.getElementById('landlordItemUsageCount').textContent = stats.itemsUsed;
            document.getElementById('landlordSynthesisCount').textContent = stats.synthesisCount || 0;
            document.getElementById('landlordSeedsUpgraded').textContent = stats.seedsUpgraded || 0;
            ensureLandlordBars(player.landlord);
            var bs = document.getElementById('landlordBarSilver');
            if (bs) bs.textContent = formatNumber(player.landlord.bars.silver || 0);
            var bg = document.getElementById('landlordBarGold');
            if (bg) bg.textContent = formatNumber(player.landlord.bars.gold || 0);
            var bd = document.getElementById('landlordBarDiamond');
            if (bd) bd.textContent = formatNumber(player.landlord.bars.diamond || 0);
            var bf = document.getElementById('landlordBarFlow');
            if (bf) bf.textContent = formatNumber(player.landlord.bars.flow || 0);
             // 计算种子和果实数量
            let seedCount = 0;
            for (const seed in player.landlord.seedStorage) {
                seedCount += player.landlord.seedStorage[seed];
            }
            document.getElementById('landlordSeedStorageCount').textContent = seedCount;
            
            // 计算锁定果实数量
            let lockedFruitCount = 0;
            let totalFruitValue = 0;
            let lockedFruitValue = 0;
            
            player.landlord.fruitStorage.forEach(fruit => {
                totalFruitValue += fruit.value;
                if (fruit.isLocked) {
                    lockedFruitCount++;
                    lockedFruitValue += fruit.value;
                }
            });
            
            document.getElementById('landlordFruitStorageCount').textContent = 
                `${player.landlord.fruitStorage.length} (${lockedFruitCount}锁定)`;
            
            // 在仓库总资产中显示锁定信息
            const totalAssetsElement = document.getElementById('landlordTotalAssetsValue');
            if (totalAssetsElement) {
                let assetsText = formatNumber(totalFruitValue) + ' 地主币';
                if (lockedFruitCount > 0) {
                    assetsText += ` (锁定: ${formatNumber(lockedFruitValue)})`;
                }
                totalAssetsElement.textContent = assetsText;
            }
        }
        // 更新货币显示
        function updateLandlordCoinDisplay() {
            document.getElementById('landlordCoinBalance').textContent = formatNumber(player.landlord.coins);
        }

        // 更新种子商店刷新计时器
        function updateLandlordSeedRefreshTimer() {
            const now = Date.now();
            const timeSinceRefresh = now - player.landlord.lastSeedRefreshTime;
            const timeUntilRefresh = Math.max(0, 10 * 60 * 1000 - timeSinceRefresh);
            
            const minutes = Math.floor(timeUntilRefresh / (1000 * 60));
            const seconds = Math.floor((timeUntilRefresh % (1000 * 60)) / 1000);
            
            const timerElement = document.getElementById('landlordSeedRefreshTimer');
            if (timerElement) {
                timerElement.textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }

        // 更新道具商店刷新计时器
        function updateLandlordItemRefreshTimer() {
            const now = Date.now();
            const timeSinceRefresh = now - player.landlord.lastItemRefreshTime;
            const timeUntilRefresh = Math.max(0, 10 * 60 * 1000 - timeSinceRefresh);
            
            const minutes = Math.floor(timeUntilRefresh / (1000 * 60));
            const seconds = Math.floor((timeUntilRefresh % (1000 * 60)) / 1000);
            
            const timerElement = document.getElementById('landlordItemRefreshTimer');
            if (timerElement) {
                timerElement.textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }

        // 获取突变颜色类
        function getLandlordMutationColorClass(mutation) {
            // 基础突变颜色
            if (["银", "银土", "落雷", "冰冻", "陶化"].includes(mutation)) return "landlord-mutation-green";
            if (["金", "金土", "荧光", "彩虹"].includes(mutation)) return "landlord-mutation-blue";
            if (["星环", "瓷化", "亮晶晶"].includes(mutation)) return "landlord-mutation-purple";
            if (["水晶", "钻石土", "红月"].includes(mutation)) return "landlord-mutation-gold";
            if (["流光", "流光土", "霓虹"].includes(mutation)) return "landlord-mutation-rainbow";
            
            // 天气突变颜色
            if (weatherMutationColors[mutation]) {
                return `landlord-mutation-${weatherMutationColors[mutation]}`;
            }
            
            return "landlord-mutation-grey";
        }

function addLotteryTabToNavigation() {
    const navTabs = document.querySelector('.landlord-nav');
    if (!navTabs) {
        console.error('导航栏未找到！');
        return;
    }
    
    // 检查是否已存在抽奖标签
    if (!navTabs.querySelector('.lottery-tab')) {
        const lotteryTab = document.createElement('button');
        lotteryTab.className = 'landlord-tab lottery-tab';
        lotteryTab.innerHTML = '🎰 果实抽奖';
        lotteryTab.setAttribute('onclick', "switchLandlordTab('lottery'); return false;");
        navTabs.appendChild(lotteryTab);
    }
    
    // 添加抽奖内容区域
    const tabContent = document.querySelector('.landlord-content');
    if (tabContent && !tabContent.querySelector('#landlordLotteryTab')) {
        const lotteryTab = document.createElement('div');
        lotteryTab.id = 'landlordLotteryTab';
        lotteryTab.className = 'landlord-tab-content';
        lotteryTab.innerHTML = '<div id="landlordLotteryContainer"></div>';
        tabContent.appendChild(lotteryTab);
    }
}

// 14. 在游戏初始化时添加抽奖界面
function initLotterySystem() {
    // 确保抽奖数据存在
    if (!player.landlord.lottery) {
        player.landlord.lottery = {
            drawCount: 0,
            totalDraws: 0,
            prizesWon: {},
            lastDrawTime: 0,
            drawHistory: []
        };
    }
    
    // 确保奖品统计存在
    if (!player.landlord.lottery.prizesWon) {
        player.landlord.lottery.prizesWon = {};
    }
    
    // 确保抽奖历史存在
    if (!player.landlord.lottery.drawHistory) {
        player.landlord.lottery.drawHistory = [];
    }
    
    addLotteryTabToNavigation();
}

// 15. 添加CSS动画
const lotteryStyles = `
    @keyframes lotteryWin {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        70% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    .lottery-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .lottery-button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
    
    .eligible-fruit {
        border: 2px solid #f39c12 !important;
        position: relative;
    }
    
    .eligible-fruit::before {
        content: '🎯';
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 1.2em;
    }
`;

// 添加样式
const lotteryStyleSheet = document.createElement('style');
lotteryStyleSheet.textContent = lotteryStyles;
document.head.appendChild(lotteryStyleSheet);

// 16. 在游戏加载时初始化抽奖系统
window.addEventListener('load', function() {
    setTimeout(function() {
        initLotterySystem();
        console.log('抽奖系统已初始化');
    }, 1000);
});
function renderSynthesisInterface(container) {
    // 合成说明
    const infoDiv = document.createElement('div');
    infoDiv.style.background = '#e8f4fd';
    infoDiv.style.padding = '15px';
    infoDiv.style.borderRadius = '5px';
    infoDiv.style.marginBottom = '15px';
    infoDiv.style.borderLeft = '4px solid #3498db';
    infoDiv.innerHTML = `
        <h4 style="margin: 0 0 10px 0; color: #2c3e50;">种子合成规则</h4>
        <div style="font-size: 0.9em; color: #34495e;">
            <div>• 3个低级种子可合成1个高级种子</div>
            <div>• 合成不可逆，高级种子无法拆分为低级种子</div>
            <div>• 神秘果为最高级种子，无法继续合成</div>
        </div>
    `;
    container.appendChild(infoDiv);
    
    // 合成统计
    const statsDiv = document.createElement('div');
    statsDiv.style.background = '#f8f9fa';
    statsDiv.style.padding = '10px';
    statsDiv.style.borderRadius = '5px';
    statsDiv.style.marginBottom = '15px';
    statsDiv.style.textAlign = 'center';
    statsDiv.innerHTML = `
        <div style="font-weight: bold; color: #2c3e50;">合成统计</div>
        <div style="display: flex; justify-content: space-around; margin-top: 10px;">
            <div>
                <div style="font-size: 1.2em; color: #e74c3c;">${player.landlord.stats.synthesisCount || 0}</div>
                <div style="font-size: 0.8em; color: #7f8c8d;">总合成次数</div>
            </div>
            <div>
                <div style="font-size: 1.2em; color: #27ae60;">${player.landlord.stats.seedsUpgraded || 0}</div>
                <div style="font-size: 0.8em; color: #7f8c8d;">升级种子数</div>
            </div>
        </div>
    `;
    container.appendChild(statsDiv);
    
    // 合成列表
    const synthesisList = document.createElement('div');
    synthesisList.className = 'synthesis-list';
    
    let hasSynthesisOptions = false;
    
    for (const seedName in seedSynthesisRules) {
        const rule = seedSynthesisRules[seedName];
        if (!rule.nextLevel) continue; // 跳过最高级种子
        
        const currentCount = player.landlord.seedStorage[seedName] || 0;
        const canSynthesize = currentCount >= rule.required;
        const nextSeedValue = seedProperties[rule.nextLevel] ? seedProperties[rule.nextLevel].price : 0;
        const currentSeedValue = seedProperties[seedName] ? seedProperties[seedName].price : 0;
        const valueIncrease = nextSeedValue - (currentSeedValue * rule.required);
        
        const synthesisItem = document.createElement('div');
        synthesisItem.className = 'synthesis-item';
        synthesisItem.style.background = canSynthesize ? '#f8fff8' : '#f8f9fa';
        synthesisItem.style.border = canSynthesize ? '2px solid #27ae60' : '1px solid #ddd';
        synthesisItem.style.padding = '15px';
        synthesisItem.style.borderRadius = '8px';
        synthesisItem.style.marginBottom = '10px';
        synthesisItem.style.transition = 'all 0.3s';
        
        synthesisItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <div style="font-weight: bold; font-size: 1.1em;">${seedName} → ${rule.nextLevel}</div>
                        <span style="background: ${canSynthesize ? '#27ae60' : '#95a5a6'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">
                            ${canSynthesize ? '可合成' : '材料不足'}
                        </span>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <span style="font-weight: bold; color: #e74c3c;">${currentCount}</span>
                            <span style="color: #7f8c8d;">/</span>
                            <span style="font-weight: bold;">${rule.required}</span>
                            <span style="color: #7f8c8d;">个${seedName}</span>
                        </div>
                        <div style="color: #7f8c8d;">→</div>
                        <div style="font-weight: bold; color: #27ae60;">1个${rule.nextLevel}</div>
                    </div>
                    
                    <div style="font-size: 0.8em; color: #7f8c8d;">
                        ${rule.description}
                        ${valueIncrease > 0 ? 
                            `<span style="color: #27ae60;"> (价值提升: +${formatNumber(valueIncrease)})</span>` : 
                            ''}
                    </div>
                </div>
                
                <div style="margin-left: 15px;">
                    <button onclick="synthesizeSeed('${seedName}')" 
                            ${canSynthesize ? '' : 'disabled'}
                            class="synthesis-button"
                            style="background: ${canSynthesize ? '#27ae60' : '#bdc3c7'}; 
                                   color: white; border: none; padding: 8px 15px; 
                                   border-radius: 5px; cursor: pointer; min-width: 80px;">
                        ${canSynthesize ? '合成' : '材料不足'}
                    </button>
                </div>
            </div>
        `;
        
        synthesisList.appendChild(synthesisItem);
        hasSynthesisOptions = true;
    }
    
    if (!hasSynthesisOptions) {
        synthesisList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #7f8c8d;">
                <div style="font-size: 3em; margin-bottom: 10px;">🌱</div>
                <div>暂无可合成的种子</div>
                <div style="font-size: 0.9em; margin-top: 5px;">请先收集足够的低级种子</div>
            </div>
        `;
    }
    
    container.appendChild(synthesisList);
    
    // 一键合成区域
    const autoSynthesisDiv = document.createElement('div');
    autoSynthesisDiv.style.background = '#fff3cd';
    autoSynthesisDiv.style.padding = '15px';
    autoSynthesisDiv.style.borderRadius = '5px';
    autoSynthesisDiv.style.marginTop = '20px';
    autoSynthesisDiv.style.border = '1px solid #ffeaa7';
    autoSynthesisDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: bold; color: #856404;">一键合成</div>
                <div style="font-size: 0.9em; color: #8d6a00; margin-top: 5px;">
                    自动合成所有可合成的种子
                </div>
            </div>
            <button onclick="autoSynthesizeAll()" class="auto-synthesis-button"
                    style="background: #f39c12; color: white; border: none; 
                           padding: 10px 20px; border-radius: 5px; cursor: pointer;
                           font-weight: bold;">
                一键合成全部
            </button>
        </div>
    `;
    container.appendChild(autoSynthesisDiv);
}
function synthesizeSeed(seedName) {
    const rule = seedSynthesisRules[seedName];
    if (!rule || !rule.nextLevel) {
        showLandlordNotification("合成规则不存在！", "error");
        return;
    }
    
    const currentCount = player.landlord.seedStorage[seedName] || 0;
    if (currentCount < rule.required) {
        showLandlordNotification(`${seedName}数量不足！需要${rule.required}个`, "error");
        return;
    }
    
    // 消耗种子
    player.landlord.seedStorage[seedName] -= rule.required;
    
    // 如果数量为0，删除该键
    if (player.landlord.seedStorage[seedName] <= 0) {
        delete player.landlord.seedStorage[seedName];
    }
    
    // 获得新种子
    if (!player.landlord.seedStorage[rule.nextLevel]) {
        player.landlord.seedStorage[rule.nextLevel] = 0;
    }
    player.landlord.seedStorage[rule.nextLevel] += 1;
    
    // 更新统计
    player.landlord.stats.synthesisCount = (player.landlord.stats.synthesisCount || 0) + 1;
    player.landlord.stats.seedsUpgraded = (player.landlord.stats.seedsUpgraded || 0) + rule.required;
    
    // 显示合成动画效果
    showSynthesisAnimation(seedName, rule.nextLevel);
    
    // 更新显示
    renderLandlordSeedStorage();
    
    showLandlordNotification(`成功合成！${rule.required}个${seedName} → 1个${rule.nextLevel}`, "success");
    saveGame();
}
function autoSynthesizeAll() {
    let totalSynthesized = 0;
    let synthesizedItems = [];
    
    // 从低级到高级依次合成
    const seedOrder = ["土豆", "金桔", "牵牛花", "无花果", "黄瓜", "西瓜", "猕猴桃", "百合花", "枣树", "蓝莓", "苹果", "丝瓜", "香蕉", "哈密瓜", "冰淇淋豆", "南瓜", "红茶", "橙子", "玫瑰花", "茄子", "草莓", "芒果", "樱桃", "柚子", "向日葵", "松树", "茶树", "大王菊", "红袍梅", "火龙果", "柳树", "闫闫果", "菠萝", "葡萄", "蟠桃", "惊奇菇", "红毛丹", "泡泡果", "人参树", "神秘果", "佛手柑", "榴莲", "山竹", "百香果", "释迦果", "牛油果", "杨桃", "莲雾", "番石榴"];
    
    let hasSynthesis = true;
    while (hasSynthesis) {
        hasSynthesis = false;
        
        for (const seedName of seedOrder) {
            const rule = seedSynthesisRules[seedName];
            if (!rule || !rule.nextLevel) continue;
            
            const currentCount = player.landlord.seedStorage[seedName] || 0;
            if (currentCount >= rule.required) {
                // 计算可合成次数
                const synthesisTimes = Math.floor(currentCount / rule.required);
                
                // 消耗种子
                player.landlord.seedStorage[seedName] -= synthesisTimes * rule.required;
                if (player.landlord.seedStorage[seedName] <= 0) {
                    delete player.landlord.seedStorage[seedName];
                }
                
                // 获得新种子
                if (!player.landlord.seedStorage[rule.nextLevel]) {
                    player.landlord.seedStorage[rule.nextLevel] = 0;
                }
                player.landlord.seedStorage[rule.nextLevel] += synthesisTimes;
                
                // 更新统计
                totalSynthesized += synthesisTimes;
                synthesizedItems.push(`${synthesisTimes}次 ${seedName}→${rule.nextLevel}`);
                
                hasSynthesis = true;
            }
        }
    }
    
    if (totalSynthesized > 0) {
        // 更新总统计
        player.landlord.stats.synthesisCount = (player.landlord.stats.synthesisCount || 0) + totalSynthesized;
        player.landlord.stats.seedsUpgraded = (player.landlord.stats.seedsUpgraded || 0) + totalSynthesized;
        
        // 更新显示
        renderLandlordSeedStorage();
        
        showLandlordNotification(`一键合成完成！共合成${totalSynthesized}次`, "success");
        saveGame();
    } else {
        showLandlordNotification("没有可合成的种子！", "info");
    }
}
function toggleSynthesisMode() {
    player.landlord.synthesisMode = !player.landlord.synthesisMode;
    renderLandlordSeedStorage();
}
function showSynthesisAnimation(fromSeed, toSeed) {
    const animationContainer = document.createElement('div');
    animationContainer.style.position = 'fixed';
    animationContainer.style.top = '50%';
    animationContainer.style.left = '50%';
    animationContainer.style.transform = 'translate(-50%, -50%)';
    animationContainer.style.zIndex = '1000';
    animationContainer.style.pointerEvents = 'none';
    
    animationContainer.innerHTML = `
        <div style="background: rgba(39, 174, 96, 0.9); color: white; padding: 20px; border-radius: 10px; text-align: center; animation: synthesisPop 0.5s ease-out;">
            <div style="font-size: 2em; margin-bottom: 10px;">✨</div>
            <div style="font-weight: bold; font-size: 1.2em;">合成成功！</div>
            <div style="margin: 10px 0;">${fromSeed} → ${toSeed}</div>
        </div>
    `;
    
    document.body.appendChild(animationContainer);
    
    setTimeout(() => {
        document.body.removeChild(animationContainer);
    }, 1000);
}

// 8. 添加合成相关CSS样式
const synthesisStyles = `
    .synthesis-toggle-button:hover {
        background: #8e44ad !important;
        transform: translateY(-2px);
    }
    
    .synthesis-button:hover:not(:disabled) {
        background: #219653 !important;
        transform: scale(1.05);
    }
    
    .synthesis-button:disabled {
        cursor: not-allowed;
    }
    
    .auto-synthesis-button:hover {
        background: #e67e22 !important;
        transform: translateY(-2px);
    }
    
    .synthesis-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    @keyframes synthesisPop {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        70% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = synthesisStyles;
document.head.appendChild(styleSheet);

// 9. 初始化合成模式状态
if (typeof player.landlord.synthesisMode === 'undefined') {
    player.landlord.synthesisMode = false;
}
        // 检查离线收益
        function checkLandlordOfflineEarnings() {
            const now = Date.now();
            if (player.landlord && typeof landlordRanchSimulateToNow === 'function') landlordRanchSimulateToNow();
            // 优先用地主存档时间；无则用全局存档时间，避免老存档或未保存过地主导致离线时长恒为0、一晚上都不生成天气词条
            const lastPlayTime = player.landlord.lastSaveTime || player.lastUpdate || now;
            const offlineMinutes = (now - lastPlayTime) / (1000 * 60);
            
            // 最大离线20小时
            const maxOfflineMinutes = 1200;
            const effectiveOfflineMinutes = Math.min(offlineMinutes, maxOfflineMinutes);
            
            if (effectiveOfflineMinutes >= 10) {
                // 计算商店刷新次数
                const refreshCount = Math.floor(effectiveOfflineMinutes / 10);
                
                // 生长进度计算
                player.landlord.fields.forEach((plant, index) => {
                    if (plant && !plant.isMature) {
                        const plantedAt = plant.plantedAt;
                        const elapsedMinutes = (now - plantedAt) / (1000 * 60);
                        
                        if (elapsedMinutes >= plant.growTime) {
                            plant.isMature = true;
                        }
                    }
                });
                
                // 天气变化计算（与在线 updateLandlordWeather 对齐：每10分钟一次，40% 随机天气并叠词条+牧场草场合鸣，60% 置为晴朗）
                const weatherChangeCount = Math.floor(effectiveOfflineMinutes / 10);
                for (let i = 0; i < weatherChangeCount; i++) {
                    if (Math.random() * 100 < 40) {
                        const newWeather = weatherList[Math.floor(Math.random() * weatherList.length)];
                        player.landlord.weather = newWeather;
                        applyLandlordWeatherMutation(true);
                    } else {
                        player.landlord.weather = "晴朗";
                    }
                }
                player.landlord.lastWeatherChange = now;
                
                // 商店刷新
                for (let i = 0; i < refreshCount; i++) {
                    // 刷新种子商店
                    for (const seed in refreshProbabilities) {
                        if (Math.random() * 100 < refreshProbabilities[seed]) {
                            player.landlord.storeItems[seed] = 1;
                        } else {
                            player.landlord.storeItems[seed] = 0;
                        }
                    }
                    
                    // 刷新道具商店
                    for (const item in itemProperties) {
                        const probability = itemProperties[item].refreshProbability;
                        if (Math.random() * 100 < probability) {
                            player.landlord.itemStoreItems[item] = 1;
                        } else {
                            player.landlord.itemStoreItems[item] = 0;
                        }
                    }
                }
                
                if (refreshCount > 0) {
                    showLandlordNotification(`离线期间商店刷新了${refreshCount}次，天气变化了${weatherChangeCount}次`, "info");
                }
            }
            
            // 保存当前时间
            player.landlord.lastSaveTime = now;
        }

        // 切换标签页
        function switchLandlordTab(tabName) {
    // 用 .active 切换内容区（含 flex:1、min-height:0、overflow 等）；勿仅用内联 display，否则会丢失布局导致商店/田地/仓库/统计等显示异常
    document.querySelectorAll('.landlord-tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = '';
    });
    
    // 移除所有标签页的活动状态
    document.querySelectorAll('.landlord-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 显示目标标签页（海钓/鱼图鉴用固定 id，避免大小写或拼接问题）
    var targetTab = null;
    if (tabName === 'seaFishing') targetTab = document.getElementById('landlordSeaFishingTab');
    else if (tabName === 'seaFishingDex') targetTab = document.getElementById('landlordSeaFishingDexTab');
    else targetTab = document.getElementById('landlord' + tabName.charAt(0).toUpperCase() + tabName.slice(1) + 'Tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // 激活目标标签按钮
    const activeButton = document.querySelector(`.landlord-tab[onclick*="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // 根据标签页加载相应内容
    switch(tabName) {
        case 'lottery':
            renderLotteryInterface();
            break;
        case 'store':
            renderLandlordStore();
            break;
        case 'itemStore':
            renderLandlordItemStore();
            break;
        case 'fields':
            renderLandlordFields();
            break;
        case 'skyVine':
            renderLandlordSkyVine();
            break;
        case 'storage':
            renderLandlordSeedStorage();
            renderLandlordFruitStorage();
            renderLandlordItemStorage();
            break;
        case 'stats':
            updateLandlordStats();
            break;
        case 'seaFishing':
            initSeaFishingUI();
            break;
        case 'seaFishingDex':
            initSeaFishingDexTab();
            break;
        case 'ranch':
            renderLandlordRanch();
            break;
    }
}


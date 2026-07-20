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

        function isLandlordShopInStockOnly() {
            return !!(player && player.landlord && player.landlord.shopShowInStockOnly);
        }

        function syncLandlordShopStockFilterButtons() {
            var on = isLandlordShopInStockOnly();
            ['landlordSeedStockFilterBtn', 'landlordItemStockFilterBtn'].forEach(function (id) {
                var btn = document.getElementById(id);
                if (!btn) return;
                btn.classList.toggle('is-active', on);
                btn.setAttribute('aria-pressed', on ? 'true' : 'false');
                btn.textContent = on ? '有货显示 · 开' : '只显示有货';
            });
        }

        function toggleLandlordShopInStockOnly() {
            if (!player || !player.landlord) return;
            player.landlord.shopShowInStockOnly = !player.landlord.shopShowInStockOnly;
            syncLandlordShopStockFilterButtons();
            renderLandlordStore();
            renderLandlordItemStore();
            if (typeof saveGame === 'function') saveGame();
        }

        // 渲染种子商店
        function renderLandlordStore() {
            const storeContainer = document.getElementById('landlordStoreItems');
            if (!storeContainer) return;
            
            storeContainer.innerHTML = '';
            syncLandlordShopStockFilterButtons();
            if (typeof syncLandlordSeedBuyPriorityButtons === 'function') syncLandlordSeedBuyPriorityButtons();
            const inStockOnly = isLandlordShopInStockOnly();
            let shown = 0;
            
            for (const seedName in seedProperties) {
                const seed = seedProperties[seedName];
                const stock = player.landlord.storeItems[seedName] || 0;
                if (inStockOnly && stock <= 0) continue;
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
                shown++;
            }
            if (shown === 0) {
                const empty = document.createElement('div');
                empty.className = 'landlord-store-empty';
                empty.textContent = inStockOnly ? '当前没有有库存的种子' : '商店暂无商品';
                storeContainer.appendChild(empty);
            }
            
            // 更新刷新计时器
            updateLandlordSeedRefreshTimer();
        }

        // 渲染道具商店
        function renderLandlordItemStore() {
            const storeContainer = document.getElementById('landlordItemStoreItems');
            if (!storeContainer) return;
            
            storeContainer.innerHTML = '';
            syncLandlordShopStockFilterButtons();
            const inStockOnly = isLandlordShopInStockOnly();
            let shown = 0;
            
            for (const itemName in itemProperties) {
                const item = itemProperties[itemName];
                const stock = player.landlord.itemStoreItems[itemName] || 0;
                if (inStockOnly && stock <= 0) continue;
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
                shown++;
            }
            if (shown === 0) {
                const empty = document.createElement('div');
                empty.className = 'landlord-store-empty';
                empty.textContent = inStockOnly ? '当前没有有库存的道具' : '商店暂无商品';
                storeContainer.appendChild(empty);
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
                const specialName = specialMutations[getLandlordSeedBaseName(plant.type)] || '特殊突变';
                mutationTags += `<span class="landlord-mutation-tag landlord-mutation-rainbow">${specialName}</span>`;
            }
            
            fieldDiv.innerHTML = `
                <div class="landlord-field-header">
                    <div class="landlord-field-info">
                        <div class="landlord-field-number">田地 ${i + 1}</div>
                        ${tierLabel}
                        <div class="landlord-field-status">
                            <span class="plant-name">${getLandlordGeneVariantLabelHtml(plant.type)}</span>
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
    
    // 标题 + 打开合成弹窗
    const synthesisHeader = document.createElement('div');
    synthesisHeader.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #3498db; gap: 10px; flex-wrap: wrap;">
            <h3 style="margin: 0; color: #2c3e50;">种子仓库</h3>
            <button type="button" onclick="openLandlordSynthesisModal()" class="landlord-synth-open-btn">种子合成</button>
        </div>
    `;
    storageContainer.appendChild(synthesisHeader);
    
    // 正常模式下的种子仓库（合成已改为弹窗，不再占用仓库列表）
    let hasSeeds = false;
    
    for (const seedName in player.landlord.seedStorage) {
        if (player.landlord.seedStorage[seedName] > 0) {
            hasSeeds = true;
            const seedDiv = document.createElement('div');
            seedDiv.className = 'landlord-storage-item';
            const seedProps = getLandlordSeedProperties(seedName);
            seedDiv.innerHTML = `
                <div class="landlord-item-info">
                    <div style="font-weight: bold;">${getLandlordGeneVariantLabelHtml(seedName)}</div>
                    <div>价格: ${formatNumber(seedProps ? seedProps.price : 0)}</div>
                    ${seedSynthesisRules[getLandlordSeedBaseName(seedName)] && seedSynthesisRules[getLandlordSeedBaseName(seedName)].nextLevel ? 
                        `<div style="font-size: 0.8em; color: #9b59b6;">可合成: ${seedSynthesisRules[getLandlordSeedBaseName(seedName)].nextLevel}</div>` : 
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
                const empty = document.createElement('div');
                empty.style.cssText = 'text-align: center; padding: 20px; color: #7f8c8d;';
                empty.textContent = '果实仓库为空';
                storageContainer.appendChild(empty);
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
                        const specialName = specialMutations[getLandlordSeedBaseName(fruit.type)] || '特殊';
                        mutationTags += `<span class="landlord-mutation-tag landlord-mutation-rainbow" style="font-size: 0.7em; margin-right: 2px;">${specialName}</span>`;
                    }
                    
                    fruitDiv.innerHTML = `
                        <div class="landlord-item-info" style="flex: 1;">
                            <div style="font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                                <span>${getLandlordGeneVariantLabelHtml(fruit.type)} ${fruit.isLocked ? '🔒' : ''}</span>
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
function normalizeGeneSynthesisSelection() {
    if (!player || !player.landlord) return [null, null];
    var raw = player.landlord.geneSynthesisSelection;
    if (!Array.isArray(raw)) {
        player.landlord.geneSynthesisSelection = [null, null];
        return player.landlord.geneSynthesisSelection;
    }
    var filled = [];
    for (var i = 0; i < raw.length; i++) {
        if (raw[i]) filled.push(raw[i]);
    }
    // 固定 2 槽：有值的依次填入，其余为 null（避免旧存档/稀疏数组导致放不进去）
    player.landlord.geneSynthesisSelection = [filled[0] || null, filled[1] || null];
    return player.landlord.geneSynthesisSelection;
}

function getGeneSynthesisSelectedCount(seedName, ignoreSlotIndex) {
    var selection = normalizeGeneSynthesisSelection();
    var n = 0;
    for (var i = 0; i < selection.length; i++) {
        if (ignoreSlotIndex !== undefined && i === ignoreSlotIndex) continue;
        if (selection[i] === seedName) n++;
    }
    return n;
}

function renderGeneSynthesisInterface(container) {
    const selection = normalizeGeneSynthesisSelection();

    const infoDiv = document.createElement('div');
    infoDiv.style.background = '#fff8e8';
    infoDiv.style.padding = '12px 14px';
    infoDiv.style.borderRadius = '8px';
    infoDiv.style.marginBottom = '14px';
    infoDiv.style.borderLeft = '4px solid #e67e22';
    infoDiv.innerHTML = `
        <h4 style="margin: 0 0 6px 0; color: #d35400; font-size: 1.02em;">基因合成规则</h4>
        <div style="font-size: 0.9em; color: #5d6d7e; line-height: 1.5;">
            <div>• 选 2 个种子各耗 1 个，按价区间随机产出</div>
            <div>• 40% 变异：彩光80% / 炫彩14% / 琉璃5% / 琥珀1%</div>
            <div>• 点击材料框弹出列表选种</div>
        </div>
    `;
    container.appendChild(infoDiv);

    const slotsDiv = document.createElement('div');
    slotsDiv.style.display = 'flex';
    slotsDiv.style.gap = '14px';
    slotsDiv.style.marginBottom = '14px';
    slotsDiv.style.flexWrap = 'wrap';
    for (let i = 0; i < 2; i++) {
        const slot = document.createElement('div');
        slot.className = 'gene-synthesis-slot';
        slot.style.flex = '1';
        slot.style.minWidth = '180px';
        slot.style.minHeight = '140px';
        slot.style.padding = '22px';
        slot.style.border = '2px dashed ' + (selection[i] ? '#e67e22' : '#c5ced6');
        slot.style.borderRadius = '12px';
        slot.style.textAlign = 'center';
        slot.style.background = selection[i] ? '#fffaf0' : '#f8f9fa';
        slot.style.cursor = 'pointer';
        slot.style.display = 'flex';
        slot.style.flexDirection = 'column';
        slot.style.justifyContent = 'center';
        slot.title = selection[i] ? '点击更换种子' : '点击选择种子';
        if (selection[i]) {
            slot.innerHTML = `
                <div style="font-size: 0.88em; color: #7f8c8d; margin-bottom: 6px;">材料 ${i + 1}</div>
                <div style="font-weight: 700; margin-bottom: 10px; font-size: 1.06em;">${getLandlordGeneVariantLabelHtml(selection[i])}</div>
                <button type="button" data-gene-remove="${i}" style="background:#e74c3c;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:0.86em;">移除</button>
            `;
        } else {
            slot.innerHTML = `
                <div style="font-size: 0.88em; color: #95a5a6; margin-bottom: 6px;">材料 ${i + 1}</div>
                <div style="color: #c5ced6; font-size: 1.7em; line-height: 1;">+</div>
                <div style="font-size: 0.88em; color: #95a5a6; margin-top: 6px;">点击选择种子</div>
            `;
        }
        slot.addEventListener('click', (function (slotIndex) {
            return function (e) {
                if (e.target && e.target.getAttribute && e.target.getAttribute('data-gene-remove') != null) {
                    e.stopPropagation();
                    removeGeneSynthesisSlot(slotIndex);
                    return;
                }
                openGeneSynthesisSeedPicker(slotIndex);
            };
        })(i));
        slotsDiv.appendChild(slot);
    }
    container.appendChild(slotsDiv);

    const actionDiv = document.createElement('div');
    actionDiv.style.display = 'flex';
    actionDiv.style.justifyContent = 'space-between';
    actionDiv.style.alignItems = 'center';
    actionDiv.style.marginBottom = '14px';
    actionDiv.style.gap = '10px';
    actionDiv.style.flexWrap = 'wrap';
    const filledCount = (selection[0] ? 1 : 0) + (selection[1] ? 1 : 0);
    const canSynth = filledCount === 2;
    const batchTimes = canSynth ? getGeneSynthesisBatchTimes(selection[0], selection[1]) : 0;
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.textContent = '清空';
    clearBtn.style.cssText = 'background:#95a5a6;color:white;border:none;padding:9px 14px;border-radius:8px;cursor:pointer;font-size:0.9em;';
    clearBtn.addEventListener('click', function () { clearGeneSynthesisSelection(); });
    const synthBtn = document.createElement('button');
    synthBtn.type = 'button';
    synthBtn.textContent = canSynth ? '基因合成' : '需选满2个';
    synthBtn.disabled = !canSynth;
    synthBtn.style.cssText = 'background:' + (canSynth ? '#e67e22' : '#bdc3c7') + ';color:white;border:none;padding:9px 18px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.9em;min-width:110px;';
    synthBtn.addEventListener('click', function () { executeGeneSynthesis(); });
    const batchBtn = document.createElement('button');
    batchBtn.type = 'button';
    batchBtn.textContent = batchTimes > 0 ? ('一键合成×' + batchTimes) : '一键合成';
    batchBtn.disabled = batchTimes < 1;
    batchBtn.title = batchTimes > 0 ? '按当前材料连续合成，直到数量不足' : '需选满2个且库存足够';
    batchBtn.style.cssText = 'background:' + (batchTimes > 0 ? '#d35400' : '#bdc3c7') + ';color:white;border:none;padding:9px 16px;border-radius:8px;cursor:' + (batchTimes > 0 ? 'pointer' : 'not-allowed') + ';font-weight:700;font-size:0.9em;min-width:120px;';
    batchBtn.addEventListener('click', function () { executeGeneSynthesisBatch(); });
    const countDiv = document.createElement('div');
    countDiv.style.cssText = 'font-size:0.95em;color:#7f8c8d;';
    countDiv.innerHTML = '已选 <strong style="color:#e67e22;">' + filledCount + '</strong> / 2' +
        (batchTimes > 1 ? ' · 可连合 <strong style="color:#d35400;">' + batchTimes + '</strong> 次' : '');
    const actionRight = document.createElement('div');
    actionRight.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
    actionRight.appendChild(clearBtn);
    actionRight.appendChild(synthBtn);
    actionRight.appendChild(batchBtn);
    actionDiv.appendChild(countDiv);
    actionDiv.appendChild(actionRight);
    container.appendChild(actionDiv);

    // 一键最优放入
    const autoDiv = document.createElement('div');
    autoDiv.style.background = '#fff8e6';
    autoDiv.style.padding = '14px 16px';
    autoDiv.style.borderRadius = '10px';
    autoDiv.style.marginBottom = '12px';
    autoDiv.style.border = '1px solid #f0e0b8';
    const autoTitle = document.createElement('div');
    autoTitle.style.marginBottom = '10px';
    autoTitle.innerHTML = '<div style="font-weight:700;color:#856404;font-size:1em;">选择目标 · 一键最优放入</div><div style="font-size:0.86em;color:#9a7b2e;margin-top:4px;">点目标自动放入成功率最高的 2 个材料</div>';
    autoDiv.appendChild(autoTitle);
    try {
        const autoTargets = typeof listGeneSynthesisAutoTargets === 'function' ? listGeneSynthesisAutoTargets() : [];
        if (!autoTargets.length) {
            const emptyAuto = document.createElement('div');
            emptyAuto.style.cssText = 'text-align:center;padding:14px;color:#8d6a00;font-size:0.9em;';
            emptyAuto.textContent = '当前仓库暂无可合成目标';
            autoDiv.appendChild(emptyAuto);
        } else {
            const autoList = document.createElement('div');
            autoList.style.cssText = 'display:flex;flex-direction:column;gap:8px;max-height:420px;overflow-y:auto;';
            for (let ti = 0; ti < autoTargets.length; ti++) {
                const t = autoTargets[ti];
                const row = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;background:#fffaf0;border:1px solid #f0dcc0;border-radius:8px;padding:12px 14px;';
                const pairLabel = (t.pair || []).map(function (p) {
                    return typeof getLandlordGeneVariantLabelHtml === 'function' ? getLandlordGeneVariantLabelHtml(p) : String(p);
                }).join(' + ');
                const leftWrap = document.createElement('div');
                leftWrap.style.cssText = 'display:flex;align-items:center;gap:10px;min-width:0;';
                leftWrap.innerHTML = '<div style="min-width:30px;height:30px;border-radius:50%;background:#e67e22;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.86em;flex-shrink:0;">' + t.chainIndex + '</div>';
                const textWrap = document.createElement('div');
                textWrap.style.minWidth = '0';
                const nameEl = document.createElement('div');
                nameEl.style.cssText = 'font-weight:700;color:#2c3e50;font-size:0.98em;';
                nameEl.textContent = t.base;
                const metaEl = document.createElement('div');
                metaEl.style.cssText = 'font-size:0.84em;color:#9a7b2e;margin-top:2px;';
                metaEl.innerHTML = pairLabel + ' · 约 ' + t.chanceText;
                textWrap.appendChild(nameEl);
                textWrap.appendChild(metaEl);
                leftWrap.appendChild(textWrap);
                row.appendChild(leftWrap);
                const fillBtn = document.createElement('button');
                fillBtn.type = 'button';
                fillBtn.textContent = '放入';
                fillBtn.style.cssText = 'flex-shrink:0;background:#f39c12;color:white;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:700;font-size:0.88em;';
                fillBtn.addEventListener('click', (function (baseName) {
                    return function () { autoFillGeneSynthesisForTarget(baseName); };
                })(t.base));
                row.appendChild(fillBtn);
                autoList.appendChild(row);
            }
            autoDiv.appendChild(autoList);
        }
    } catch (autoErr) {
        console.warn('gene auto targets render failed', autoErr);
        const errDiv = document.createElement('div');
        errDiv.style.cssText = 'color:#c0392b;font-size:0.9em;';
        errDiv.textContent = '一键列表加载失败，可点材料框手动选种。';
        autoDiv.appendChild(errDiv);
    }
    container.appendChild(autoDiv);

    const statsDiv = document.createElement('div');
    statsDiv.style.background = '#f8f9fa';
    statsDiv.style.padding = '10px 12px';
    statsDiv.style.borderRadius = '8px';
    statsDiv.style.marginTop = '8px';
    statsDiv.style.textAlign = 'center';
    statsDiv.innerHTML = '<div style="font-size: 0.9em; color: #7f8c8d;">基因合成次数: <strong style="color:#e67e22;">' + (player.landlord.stats.geneSynthesisCount || 0) + '</strong></div>';
    container.appendChild(statsDiv);
}

function setLandlordSynthesisSubMode(mode) {
    var next = mode === 'gene' ? 'gene' : 'linear';
    player.landlord.synthesisSubMode = next;
    player.landlord._genePickSlot = null;
    closeGeneSynthesisSeedPicker();
    closeGeneBatchInfoModal();
    if (next === 'gene') {
        normalizeGeneSynthesisSelection();
    }
    syncLandlordSynthesisModalTabs();
    refreshLandlordSynthesisModal();
}

function isLandlordSynthesisModalOpen() {
    var modal = document.getElementById('landlordSynthesisModal');
    return !!(modal && modal.classList.contains('is-open'));
}

function syncLandlordSynthesisModalTabs() {
    var mode = player.landlord.synthesisSubMode === 'gene' ? 'gene' : 'linear';
    document.querySelectorAll('.landlord-synth-tab').forEach(function (tab) {
        tab.classList.toggle('is-active', tab.getAttribute('data-synth-tab') === mode);
    });
    var linear = document.getElementById('landlordSynthLinearPanel');
    var gene = document.getElementById('landlordSynthGenePanel');
    if (linear) {
        var onL = mode === 'linear';
        linear.classList.toggle('is-active', onL);
        if (onL) linear.removeAttribute('hidden');
        else linear.setAttribute('hidden', '');
    }
    if (gene) {
        var onG = mode === 'gene';
        gene.classList.toggle('is-active', onG);
        if (onG) gene.removeAttribute('hidden');
        else gene.setAttribute('hidden', '');
    }
}

function refreshLandlordSynthesisModal() {
    if (!isLandlordSynthesisModalOpen()) return;
    var mode = player.landlord.synthesisSubMode === 'gene' ? 'gene' : 'linear';
    var linear = document.getElementById('landlordSynthLinearPanel');
    var gene = document.getElementById('landlordSynthGenePanel');
    if (mode === 'gene' && gene) {
        gene.innerHTML = '';
        renderGeneSynthesisInterface(gene);
    } else if (linear) {
        linear.innerHTML = '';
        renderSynthesisInterface(linear);
    }
}

function openLandlordSynthesisModal(preferredMode) {
    if (!player || !player.landlord) return;
    if (preferredMode === 'gene' || preferredMode === 'linear') {
        player.landlord.synthesisSubMode = preferredMode;
    } else if (!player.landlord.synthesisSubMode) {
        player.landlord.synthesisSubMode = 'linear';
    }
    player.landlord.synthesisMode = true;
    player.landlord._genePickSlot = null;
    if (player.landlord.synthesisSubMode === 'gene') {
        normalizeGeneSynthesisSelection();
    }
    var modal = document.getElementById('landlordSynthesisModal');
    if (!modal) {
        showLandlordNotification('合成弹窗未找到！', 'error');
        return;
    }
    modal.style.display = 'flex';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    syncLandlordSynthesisModalTabs();
    // 初次打开两个面板都预渲染，切换更顺
    var linear = document.getElementById('landlordSynthLinearPanel');
    var gene = document.getElementById('landlordSynthGenePanel');
    if (linear) {
        linear.innerHTML = '';
        renderSynthesisInterface(linear);
    }
    if (gene) {
        gene.innerHTML = '';
        renderGeneSynthesisInterface(gene);
    }
    syncLandlordSynthesisModalTabs();
}

function closeLandlordSynthesisModal() {
    closeGeneSynthesisSeedPicker();
    closeGeneBatchInfoModal();
    var modal = document.getElementById('landlordSynthesisModal');
    if (modal) {
        modal.classList.remove('is-open');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
    if (player && player.landlord) {
        player.landlord.synthesisMode = false;
        player.landlord._genePickSlot = null;
        player.landlord.geneSynthesisSelection = [null, null];
    }
    if (typeof renderLandlordSeedStorage === 'function') renderLandlordSeedStorage();
}

/** 填充基因材料选种列表 */
function populateGeneSynthesisSeedPickerList(slotIndex) {
    var list = document.getElementById('landlordGeneSeedPickerList');
    if (!list) return;
    list.innerHTML = '';
    normalizeGeneSynthesisSelection();
    var seedKeys = Object.keys(player.landlord.seedStorage || {}).sort(function (a, b) {
        var pa = getLandlordSeedProperties(a);
        var pb = getLandlordSeedProperties(b);
        return (pa ? pa.price : 0) - (pb ? pb.price : 0);
    });
    var hasSeeds = false;
    for (var si = 0; si < seedKeys.length; si++) {
        var seedName = seedKeys[si];
        var count = Math.floor(Number(player.landlord.seedStorage[seedName]) || 0);
        if (count <= 0) continue;
        hasSeeds = true;
        var selectedCount = getGeneSynthesisSelectedCount(seedName, slotIndex);
        var available = count - selectedCount;
        var canPick = available > 0;
        var seedProps = getLandlordSeedProperties(seedName);
        var chainIndex = typeof getLandlordSeedChainIndex === 'function' ? getLandlordSeedChainIndex(seedName) : 0;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'landlord-gene-seed-pick-item';
        btn.disabled = !canPick;
        if (!canPick) {
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
        btn.innerHTML =
            '<div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">' +
                '<div style="min-width:28px;height:28px;border-radius:50%;background:#e67e22;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85em;flex-shrink:0;">' + (chainIndex > 0 ? chainIndex : '-') + '</div>' +
                '<div class="landlord-gene-seed-pick-item-main">' +
                    '<div class="landlord-gene-seed-pick-item-name">' + getLandlordGeneVariantLabelHtml(seedName) + '</div>' +
                    '<div class="landlord-gene-seed-pick-item-meta">价格 ' + formatNumber(seedProps ? seedProps.price : 0) +
                        (selectedCount > 0 ? ' · 已选 ' + selectedCount : '') + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="landlord-gene-seed-pick-item-qty">×' + count + '</div>';
        if (canPick) {
            btn.addEventListener('click', (function (name) {
                return function () { setGeneSynthesisSlot(slotIndex, name); };
            })(seedName));
        }
        list.appendChild(btn);
    }
    if (!hasSeeds) {
        var empty = document.createElement('div');
        empty.style.cssText = 'text-align:center;padding:28px 12px;color:#95a5a6;font-size:0.85em;';
        empty.textContent = '种子仓库为空';
        list.appendChild(empty);
    }
}

/** 点击材料框：弹出种子选择层 */
function openGeneSynthesisSeedPicker(slotIndex) {
    var idx = parseInt(slotIndex, 10);
    if (!Number.isFinite(idx) || idx < 0 || idx > 1) return;
    if (!isLandlordSynthesisModalOpen()) {
        openLandlordSynthesisModal('gene');
    }
    normalizeGeneSynthesisSelection();
    player.landlord._genePickSlot = idx;
    var picker = document.getElementById('landlordGeneSeedPicker');
    var title = document.getElementById('landlordGeneSeedPickerTitle');
    if (title) title.textContent = '选择材料 ' + (idx + 1);
    populateGeneSynthesisSeedPickerList(idx);
    if (picker) {
        picker.style.display = 'flex';
        picker.classList.add('is-open');
        picker.setAttribute('aria-hidden', 'false');
    }
}

function closeGeneSynthesisSeedPicker() {
    var picker = document.getElementById('landlordGeneSeedPicker');
    if (picker) {
        picker.classList.remove('is-open');
        picker.style.display = 'none';
        picker.setAttribute('aria-hidden', 'true');
    }
    if (player && player.landlord) {
        player.landlord._genePickSlot = null;
    }
}

function setGeneSynthesisSlot(slotIndex, seedName) {
    var idx = parseInt(slotIndex, 10);
    if (!Number.isFinite(idx) || idx < 0 || idx > 1) return;
    if (!seedName) return;
    normalizeGeneSynthesisSelection();
    var count = Math.floor(Number(player.landlord.seedStorage[seedName]) || 0);
    var selectedCount = getGeneSynthesisSelectedCount(seedName, idx);
    if (selectedCount >= count) {
        showLandlordNotification('该种子库存不足！', 'error');
        return;
    }
    player.landlord.geneSynthesisSelection[idx] = seedName;
    player.landlord._genePickSlot = null;
    closeGeneSynthesisSeedPicker();
    if (typeof closeLandlordSeedModal === 'function') {
        try { closeLandlordSeedModal(); } catch (e) {}
    }
    refreshLandlordSynthesisModal();
    renderLandlordSeedStorage();
}

function autoFillGeneSynthesisForTarget(targetSeedKey) {
    if (typeof findOptimalGeneSynthesisPair !== 'function') {
        showLandlordNotification('一键放入功能不可用！', 'error');
        return;
    }
    var opt = findOptimalGeneSynthesisPair(targetSeedKey);
    if (!opt || !opt.pair || opt.pair.length !== 2) {
        showLandlordNotification('当前仓库无法为该目标找到合适材料！', 'warning');
        return;
    }
    player.landlord.geneSynthesisSelection = [opt.pair[0], opt.pair[1]];
    player.landlord._genePickSlot = null;
    refreshLandlordSynthesisModal();
    renderLandlordSeedStorage();
    showLandlordNotification(
        '已放入最优材料：' + opt.pair.join(' + ') + '（目标「' + opt.targetBase + '」约 ' + opt.chanceText + '）',
        'success'
    );
}

function addGeneSynthesisSeed(seedName) {
    if (!seedName) return;
    normalizeGeneSynthesisSelection();
    var selection = player.landlord.geneSynthesisSelection;
    var emptyIndex = selection[0] ? (selection[1] ? -1 : 1) : 0;
    if (emptyIndex < 0) {
        showLandlordNotification('已选满2个种子！', 'info');
        return;
    }
    var count = Math.floor(Number(player.landlord.seedStorage[seedName]) || 0);
    var selectedCount = getGeneSynthesisSelectedCount(seedName);
    if (selectedCount >= count) {
        showLandlordNotification('该种子库存不足！', 'error');
        return;
    }
    selection[emptyIndex] = seedName;
    player.landlord._genePickSlot = null;
    refreshLandlordSynthesisModal();
    renderLandlordSeedStorage();
}

function removeGeneSynthesisSlot(index) {
    normalizeGeneSynthesisSelection();
    var idx = parseInt(index, 10);
    if (!Number.isFinite(idx) || idx < 0 || idx > 1) return;
    player.landlord.geneSynthesisSelection[idx] = null;
    normalizeGeneSynthesisSelection();
    player.landlord._genePickSlot = null;
    refreshLandlordSynthesisModal();
}

function clearGeneSynthesisSelection() {
    player.landlord.geneSynthesisSelection = [null, null];
    player.landlord._genePickSlot = null;
    refreshLandlordSynthesisModal();
}

function executeGeneSynthesis() {
    const selection = normalizeGeneSynthesisSelection().filter(function (s) { return !!s; });
    const result = performLandlordGeneSynthesis(selection);
    if (!result.ok) {
        showLandlordNotification(result.message, 'error');
        return;
    }
    player.landlord.geneSynthesisSelection = [null, null];
    player.landlord._genePickSlot = null;
    showSynthesisAnimation('基因融合', result.outputSeed);
    refreshLandlordSynthesisModal();
    renderLandlordSeedStorage();
    let msg = '基因合成成功！获得 ' + result.outputSeed;
    if (result.variant) {
        msg = '基因合成大成功！获得变异种子「' + result.outputSeed + '」';
    }
    showLandlordNotification(msg, result.variant ? 'success' : 'info');
    saveGame();
}

/** 当前材料对最多可连续合成几次（按仓库库存） */
function getGeneSynthesisBatchTimes(seedA, seedB) {
    if (!seedA || !seedB) return 0;
    var stockA = Math.floor(Number(player.landlord.seedStorage[seedA]) || 0);
    var stockB = Math.floor(Number(player.landlord.seedStorage[seedB]) || 0);
    if (seedA === seedB) {
        return Math.floor(stockA / 2);
    }
    return Math.min(stockA, stockB);
}

/** 按当前选中的材料一键连续合成，直到数量不足 */
function executeGeneSynthesisBatch() {
    var selection = normalizeGeneSynthesisSelection();
    var seedA = selection[0];
    var seedB = selection[1];
    if (!seedA || !seedB) {
        showLandlordNotification('请先选满2个材料！', 'error');
        return;
    }
    var planned = getGeneSynthesisBatchTimes(seedA, seedB);
    if (planned < 1) {
        showLandlordNotification('当前材料数量不足，无法合成！', 'error');
        return;
    }
    openGeneBatchConfirmModal(seedA, seedB, planned);
}

function openGeneBatchInfoModal() {
    var modal = document.getElementById('landlordGeneBatchInfoModal');
    if (!modal) return null;
    modal.style.display = 'flex';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    return modal;
}

function closeGeneBatchInfoModal() {
    var modal = document.getElementById('landlordGeneBatchInfoModal');
    if (modal) {
        modal.classList.remove('is-open');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
    var footer = document.getElementById('landlordGeneBatchInfoFooter');
    if (footer) footer.innerHTML = '';
}

function setGeneBatchInfoHeader(title, sub) {
    var titleEl = document.getElementById('landlordGeneBatchInfoTitle');
    var subEl = document.getElementById('landlordGeneBatchInfoSub');
    if (titleEl) titleEl.textContent = title || '';
    if (subEl) subEl.textContent = sub || '';
}

function openGeneBatchConfirmModal(seedA, seedB, planned) {
    if (!document.getElementById('landlordGeneBatchInfoModal')) {
        if (!window.confirm('确定一键合成 ' + planned + ' 次吗？')) return;
        runGeneSynthesisBatch(seedA, seedB, planned);
        return;
    }
    var labelA = getLandlordGeneVariantLabelPlain(seedA);
    var labelB = getLandlordGeneVariantLabelPlain(seedB);
    var stockA = Math.floor(Number(player.landlord.seedStorage[seedA]) || 0);
    var stockB = Math.floor(Number(player.landlord.seedStorage[seedB]) || 0);
    setGeneBatchInfoHeader('确认一键合成', '将按当前材料连续合成，直到达到预计次数');
    var body = document.getElementById('landlordGeneBatchInfoBody');
    if (body) {
        var labelAHtml = typeof getLandlordGeneVariantLabelHtml === 'function' ? getLandlordGeneVariantLabelHtml(seedA) : labelA;
        var labelBHtml = typeof getLandlordGeneVariantLabelHtml === 'function' ? getLandlordGeneVariantLabelHtml(seedB) : labelB;
        body.innerHTML =
            '<div class="landlord-gene-batch-info-stats">' +
                '<div class="landlord-gene-batch-info-stat"><div class="landlord-gene-batch-info-stat-value">' + planned + '</div><div class="landlord-gene-batch-info-stat-label">预计次数</div></div>' +
                '<div class="landlord-gene-batch-info-stat"><div class="landlord-gene-batch-info-stat-value">×' + stockA + '</div><div class="landlord-gene-batch-info-stat-label">材料1库存</div></div>' +
                '<div class="landlord-gene-batch-info-stat"><div class="landlord-gene-batch-info-stat-value">×' + stockB + '</div><div class="landlord-gene-batch-info-stat-label">材料2库存</div></div>' +
            '</div>' +
            '<div class="landlord-gene-batch-info-block">' +
                '<div class="landlord-gene-batch-info-block-title">材料组合</div>' +
                '<div class="landlord-gene-batch-info-row"><div class="landlord-gene-batch-info-row-name">材料1：' + labelAHtml + '</div><div class="landlord-gene-batch-info-row-qty">×' + stockA + '</div></div>' +
                '<div class="landlord-gene-batch-info-row"><div class="landlord-gene-batch-info-row-name">材料2：' + labelBHtml + '</div><div class="landlord-gene-batch-info-row-qty">×' + stockB + '</div></div>' +
                '<div class="landlord-gene-batch-info-row"><div class="landlord-gene-batch-info-row-name">每次消耗</div><div class="landlord-gene-batch-info-row-qty">' + (seedA === seedB ? '同种×2' : '各×1') + '</div></div>' +
            '</div>' +
            '<div style="font-size:0.86em;color:#8a939c;line-height:1.45;">确认后将立即执行全部合成，结果会以弹窗汇总展示。</div>';
    }
    var footer = document.getElementById('landlordGeneBatchInfoFooter');
    if (footer) {
        footer.innerHTML = '';
        var cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'landlord-gene-batch-info-btn landlord-gene-batch-info-btn-cancel';
        cancelBtn.textContent = '取消';
        cancelBtn.addEventListener('click', closeGeneBatchInfoModal);
        var okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'landlord-gene-batch-info-btn landlord-gene-batch-info-btn-ok alt';
        okBtn.textContent = '确认合成×' + planned;
        okBtn.addEventListener('click', function () {
            closeGeneBatchInfoModal();
            runGeneSynthesisBatch(seedA, seedB, planned);
        });
        footer.appendChild(cancelBtn);
        footer.appendChild(okBtn);
    }
    openGeneBatchInfoModal();
}

function openGeneBatchResultModal(info) {
    if (!document.getElementById('landlordGeneBatchInfoModal')) {
        showLandlordNotification(info.summaryMsg, info.variantCount > 0 ? 'success' : 'info');
        return;
    }
    setGeneBatchInfoHeader('一键合成完成', info.materialsLabel || '');
    var body = document.getElementById('landlordGeneBatchInfoBody');
    if (body) {
        var rowsHtml = '';
        var outputs = info.sortedOutputs || [];
        if (!outputs.length) {
            rowsHtml = '<div style="text-align:center;color:#95a5a6;padding:12px;">无产出明细</div>';
        } else {
            for (var i = 0; i < outputs.length; i++) {
                var item = outputs[i];
                var nameHtml = typeof getLandlordGeneVariantLabelHtml === 'function'
                    ? getLandlordGeneVariantLabelHtml(item.name)
                    : item.name;
                rowsHtml += '<div class="landlord-gene-batch-info-row"><div class="landlord-gene-batch-info-row-name">' +
                    nameHtml + '</div><div class="landlord-gene-batch-info-row-qty">×' + item.count + '</div></div>';
            }
        }
        body.innerHTML =
            '<div class="landlord-gene-batch-info-stats">' +
                '<div class="landlord-gene-batch-info-stat"><div class="landlord-gene-batch-info-stat-value">' + info.successCount + '</div><div class="landlord-gene-batch-info-stat-label">合成次数</div></div>' +
                '<div class="landlord-gene-batch-info-stat"><div class="landlord-gene-batch-info-stat-value">' + info.variantCount + '</div><div class="landlord-gene-batch-info-stat-label">变异次数</div></div>' +
                '<div class="landlord-gene-batch-info-stat"><div class="landlord-gene-batch-info-stat-value">' + outputs.length + '</div><div class="landlord-gene-batch-info-stat-label">产出种类</div></div>' +
            '</div>' +
            '<div class="landlord-gene-batch-info-block">' +
                '<div class="landlord-gene-batch-info-block-title">产出明细</div>' +
                rowsHtml +
            '</div>';
    }
    var footer = document.getElementById('landlordGeneBatchInfoFooter');
    if (footer) {
        footer.innerHTML = '';
        var okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'landlord-gene-batch-info-btn landlord-gene-batch-info-btn-ok';
        okBtn.textContent = '知道了';
        okBtn.addEventListener('click', closeGeneBatchInfoModal);
        footer.appendChild(okBtn);
    }
    openGeneBatchInfoModal();
}

function runGeneSynthesisBatch(seedA, seedB, planned) {
    var materials = [seedA, seedB];
    var successCount = 0;
    var variantCount = 0;
    var outputMap = {};
    var lastOutput = null;
    var maxSafe = Math.min(planned, 5000);
    for (var i = 0; i < maxSafe; i++) {
        var result = performLandlordGeneSynthesis(materials);
        if (!result.ok) break;
        successCount++;
        lastOutput = result.outputSeed;
        outputMap[result.outputSeed] = (outputMap[result.outputSeed] || 0) + 1;
        if (result.variant) variantCount++;
    }

    player.landlord.geneSynthesisSelection = [null, null];
    player.landlord._genePickSlot = null;
    if (successCount <= 0) {
        showLandlordNotification('一键合成失败：材料不足或无法合成', 'error');
        refreshLandlordSynthesisModal();
        return;
    }
    if (lastOutput) {
        showSynthesisAnimation('基因融合×' + successCount, lastOutput);
    }
    refreshLandlordSynthesisModal();
    renderLandlordSeedStorage();

    var sortedOutputs = Object.keys(outputMap).sort(function (a, b) {
        return outputMap[b] - outputMap[a];
    }).map(function (name) {
        return { name: name, count: outputMap[name] };
    });
    var topOutputs = sortedOutputs.slice(0, 3).map(function (item) {
        return item.name + '×' + item.count;
    }).join('、');
    var summaryMsg = '一键基因合成完成：共 ' + successCount + ' 次';
    if (variantCount > 0) summaryMsg += '（变异 ' + variantCount + ' 次）';
    if (topOutputs) summaryMsg += '。获得：' + topOutputs;

    openGeneBatchResultModal({
        successCount: successCount,
        variantCount: variantCount,
        sortedOutputs: sortedOutputs,
        summaryMsg: summaryMsg,
        materialsLabel: getLandlordGeneVariantLabelPlain(seedA) + ' + ' + getLandlordGeneVariantLabelPlain(seedB)
    });
    showLandlordNotification(summaryMsg, variantCount > 0 ? 'success' : 'info');
    saveGame();
}

function getLandlordGeneVariantLabelPlain(seedName) {
    if (!seedName) return '';
    try {
        if (typeof parseLandlordSeedKey === 'function') {
            return parseLandlordSeedKey(seedName).displayName || String(seedName);
        }
    } catch (e) {}
    return String(seedName);
}

// 确保内联/跨文件可调用
window.normalizeGeneSynthesisSelection = normalizeGeneSynthesisSelection;
window.openGeneSynthesisSeedPicker = openGeneSynthesisSeedPicker;
window.closeGeneSynthesisSeedPicker = closeGeneSynthesisSeedPicker;
window.setGeneSynthesisSlot = setGeneSynthesisSlot;
window.addGeneSynthesisSeed = addGeneSynthesisSeed;
window.removeGeneSynthesisSlot = removeGeneSynthesisSlot;
window.clearGeneSynthesisSelection = clearGeneSynthesisSelection;
window.executeGeneSynthesis = executeGeneSynthesis;
window.executeGeneSynthesisBatch = executeGeneSynthesisBatch;
window.getGeneSynthesisBatchTimes = getGeneSynthesisBatchTimes;
window.closeGeneBatchInfoModal = closeGeneBatchInfoModal;
window.autoFillGeneSynthesisForTarget = autoFillGeneSynthesisForTarget;
window.setLandlordSynthesisSubMode = setLandlordSynthesisSubMode;
window.renderGeneSynthesisInterface = renderGeneSynthesisInterface;
window.openLandlordSynthesisModal = openLandlordSynthesisModal;
window.closeLandlordSynthesisModal = closeLandlordSynthesisModal;
window.refreshLandlordSynthesisModal = refreshLandlordSynthesisModal;
window.toggleSynthesisMode = toggleSynthesisMode;


function renderSynthesisInterface(container) {
    // 合成说明
    const infoDiv = document.createElement('div');
    infoDiv.style.background = '#e8f4fd';
    infoDiv.style.padding = '12px 14px';
    infoDiv.style.borderRadius = '8px';
    infoDiv.style.marginBottom = '14px';
    infoDiv.style.borderLeft = '4px solid #3498db';
    infoDiv.innerHTML = `
        <h4 style="margin: 0 0 6px 0; color: #2c3e50; font-size: 1.02em;">种子合成规则</h4>
        <div style="font-size: 0.9em; color: #5d6d7e; line-height: 1.5;">
            <div>• 3 个低级种子可合成 1 个高级种子</div>
            <div>• 合成不可逆；神秘果为最高级，无法继续</div>
        </div>
    `;
    container.appendChild(infoDiv);
    
    // 合成统计
    const statsDiv = document.createElement('div');
    statsDiv.style.background = '#f8f9fa';
    statsDiv.style.padding = '12px 14px';
    statsDiv.style.borderRadius = '8px';
    statsDiv.style.marginBottom = '14px';
    statsDiv.style.textAlign = 'center';
    statsDiv.innerHTML = `
        <div style="font-weight: 700; color: #2c3e50; font-size: 0.98em;">合成统计</div>
        <div style="display: flex; justify-content: space-around; margin-top: 10px;">
            <div>
                <div style="font-size: 1.28em; color: #e74c3c; font-weight:700;">${player.landlord.stats.synthesisCount || 0}</div>
                <div style="font-size: 0.86em; color: #7f8c8d;">总合成次数</div>
            </div>
            <div>
                <div style="font-size: 1.28em; color: #27ae60; font-weight:700;">${player.landlord.stats.seedsUpgraded || 0}</div>
                <div style="font-size: 0.86em; color: #7f8c8d;">升级种子数</div>
            </div>
        </div>
    `;
    container.appendChild(statsDiv);

    // 一键合成放在列表上方，避免长列表时要滚到底
    const autoSynthesisDiv = document.createElement('div');
    autoSynthesisDiv.style.background = '#fff8e6';
    autoSynthesisDiv.style.padding = '14px 16px';
    autoSynthesisDiv.style.borderRadius = '8px';
    autoSynthesisDiv.style.marginBottom = '14px';
    autoSynthesisDiv.style.border = '1px solid #f0e0b8';
    autoSynthesisDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
            <div>
                <div style="font-weight: 700; color: #856404; font-size: 1em;">一键合成</div>
                <div style="font-size: 0.86em; color: #9a7b2e; margin-top: 4px;">
                    自动合成所有可合成种子
                </div>
            </div>
            <button onclick="autoSynthesizeAll()" class="auto-synthesis-button"
                    style="background: #f39c12; color: white; border: none; 
                           padding: 10px 18px; border-radius: 8px; cursor: pointer;
                           font-weight: 700; font-size: 0.9em; flex-shrink:0;">
                一键合成全部
            </button>
        </div>
    `;
    container.appendChild(autoSynthesisDiv);
    
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
        synthesisItem.style.border = canSynthesize ? '2px solid #27ae60' : '1px solid #e5e8eb';
        synthesisItem.style.padding = '14px 16px';
        synthesisItem.style.borderRadius = '10px';
        synthesisItem.style.marginBottom = '10px';
        synthesisItem.style.transition = 'all 0.2s';
        
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
                
                <div style="margin-left: 15px; display: flex; flex-direction: column; gap: 8px;">
                    <button onclick="synthesizeSeed('${seedName}')" 
                            ${canSynthesize ? '' : 'disabled'}
                            class="synthesis-button"
                            style="background: ${canSynthesize ? '#27ae60' : '#bdc3c7'}; 
                                   color: white; border: none; padding: 8px 15px; 
                                   border-radius: 5px; cursor: pointer; min-width: 80px;">
                        ${canSynthesize ? '合成' : '材料不足'}
                    </button>
                    <button onclick="autoSynthesizeSeed('${seedName}')" 
                            ${canSynthesize ? '' : 'disabled'}
                            class="auto-synthesis-seed-button"
                            style="background: ${canSynthesize ? '#f39c12' : '#bdc3c7'}; 
                                   color: white; border: none; padding: 8px 15px; 
                                   border-radius: 5px; cursor: pointer; min-width: 80px; font-weight: 700;">
                        ${canSynthesize ? ('一键合成×' + Math.floor(currentCount / rule.required)) : '一键合成'}
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
    refreshLandlordSynthesisModal();
    renderLandlordSeedStorage();
    
    showLandlordNotification(`成功合成！${rule.required}个${seedName} → 1个${rule.nextLevel}`, "success");
    saveGame();
}
/** 线性合成：将指定种子一次性合到库存允许的最大次数 */
function autoSynthesizeSeed(seedName) {
    const rule = seedSynthesisRules[seedName];
    if (!rule || !rule.nextLevel) {
        showLandlordNotification("合成规则不存在！", "error");
        return;
    }

    const currentCount = player.landlord.seedStorage[seedName] || 0;
    const synthesisTimes = Math.floor(currentCount / rule.required);
    if (synthesisTimes <= 0) {
        showLandlordNotification(`${seedName}数量不足！需要${rule.required}个`, "error");
        return;
    }

    player.landlord.seedStorage[seedName] -= synthesisTimes * rule.required;
    if (player.landlord.seedStorage[seedName] <= 0) {
        delete player.landlord.seedStorage[seedName];
    }

    if (!player.landlord.seedStorage[rule.nextLevel]) {
        player.landlord.seedStorage[rule.nextLevel] = 0;
    }
    player.landlord.seedStorage[rule.nextLevel] += synthesisTimes;

    player.landlord.stats.synthesisCount = (player.landlord.stats.synthesisCount || 0) + synthesisTimes;
    player.landlord.stats.seedsUpgraded = (player.landlord.stats.seedsUpgraded || 0) + synthesisTimes * rule.required;

    showSynthesisAnimation(seedName, rule.nextLevel);
    refreshLandlordSynthesisModal();
    renderLandlordSeedStorage();

    showLandlordNotification(
        `一键合成完成！${synthesisTimes * rule.required}个${seedName} → ${synthesisTimes}个${rule.nextLevel}`,
        "success"
    );
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
        refreshLandlordSynthesisModal();
        renderLandlordSeedStorage();
        
        showLandlordNotification(`一键合成完成！共合成${totalSynthesized}次`, "success");
        saveGame();
    } else {
        showLandlordNotification("没有可合成的种子！", "info");
    }
}
function toggleSynthesisMode() {
    if (isLandlordSynthesisModalOpen()) closeLandlordSynthesisModal();
    else openLandlordSynthesisModal();
}
function showSynthesisAnimation(fromSeed, toSeed) {
    const toLabel = typeof getLandlordGeneVariantLabelHtml === 'function' ? getLandlordGeneVariantLabelHtml(toSeed) : toSeed;
    const animationContainer = document.createElement('div');
    animationContainer.style.position = 'fixed';
    animationContainer.style.top = '50%';
    animationContainer.style.left = '50%';
    animationContainer.style.transform = 'translate(-50%, -50%)';
    animationContainer.style.zIndex = '1100';
    animationContainer.style.pointerEvents = 'none';
    
    animationContainer.innerHTML = `
        <div style="background: rgba(39, 174, 96, 0.9); color: white; padding: 20px; border-radius: 10px; text-align: center; animation: synthesisPop 0.5s ease-out;">
            <div style="font-size: 2em; margin-bottom: 10px;">✨</div>
            <div style="font-weight: bold; font-size: 1.2em;">合成成功！</div>
            <div style="margin: 10px 0;">${fromSeed} → ${toLabel}</div>
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

    .auto-synthesis-seed-button:hover:not(:disabled) {
        background: #e67e22 !important;
        transform: scale(1.05);
    }

    .auto-synthesis-seed-button:disabled {
        cursor: not-allowed;
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

    .landlord-gene-caiguang {
        font-weight: bold;
        background: linear-gradient(90deg, #00b894, #55efc4, #ffffff, #f9ca24, #00cec9, #10ac84, #7bed9f, #00b894);
        background-size: 300% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: landlordGeneShine 2s linear infinite;
        filter: drop-shadow(0 0 4px rgba(0, 206, 201, 0.65));
    }
    .landlord-gene-xuancai {
        font-weight: bold;
        background: linear-gradient(90deg, #1e90ff, #70a1ff, #3742fa, #ff6b81, #1e90ff);
        background-size: 300% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: landlordGeneShine 2.5s linear infinite;
    }
    .landlord-gene-liuli {
        font-weight: bold;
        background: linear-gradient(90deg, #6c5ce7, #a29bfe, #dfe6e9, #74b9ff, #81ecec, #b8e994, #a29bfe, #6c5ce7);
        background-size: 300% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: landlordGeneShine 2.2s linear infinite;
        filter: drop-shadow(0 0 3px rgba(116, 185, 255, 0.45));
    }
    .landlord-gene-hupo {
        font-weight: bold;
        background: linear-gradient(90deg, #e17055, #fdcb6e, #fff8e7, #f39c12, #ffeaa7, #fab1a0, #fdcb6e, #e17055);
        background-size: 300% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: landlordGeneShine 1.8s linear infinite;
        filter: drop-shadow(0 0 3px rgba(253, 203, 110, 0.55));
    }
    @keyframes landlordGeneShine {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
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
if (typeof player.landlord.synthesisSubMode === 'undefined') {
    player.landlord.synthesisSubMode = 'linear';
}
if (typeof player.landlord.geneSynthesisSelection === 'undefined') {
    player.landlord.geneSynthesisSelection = [null, null];
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
                            player.landlord.storeItems[seed] = rollLandlordSeedStoreStock(seed);
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
                    // 与在线刷新对齐，避免随后 refreshLandlordStore 再刷一遍、倒计时也不准
                    player.landlord.lastSeedRefreshTime = now;
                    player.landlord.lastItemRefreshTime = now;
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
        case 'geneTree':
            renderLandlordGeneTree();
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


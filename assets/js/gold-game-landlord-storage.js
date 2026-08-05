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
                    const newWeather = (typeof pickLandlordNaturalWeather === 'function')
                        ? pickLandlordNaturalWeather()
                        : weatherList[Math.floor(Math.random() * weatherList.length)];
                    player.landlord.weather = newWeather;
                    
                    // 应用天气突变
                    applyLandlordWeatherMutation();
                    
                    showLandlordNotification(`天气变为：${newWeather}`, "info");
                } else {
                    player.landlord.weather = "晴朗";
                }
                
                updateLandlordStats();
            }
            if (typeof updateLandlordFieldWeatherDisplay === 'function') updateLandlordFieldWeatherDisplay();
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
                if (item.lotteryOnly) {
                    if (player.landlord.itemStoreItems && player.landlord.itemStoreItems[itemName]) {
                        player.landlord.itemStoreItems[itemName] = 0;
                    }
                    continue;
                }
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

        // —— 田地卡片：词条整理与折叠（默认收起） ——
        window.__landlordFieldTagsExpanded = window.__landlordFieldTagsExpanded || {};

        function getLandlordMutationDisplayMult(name) {
            if (!name) return 1;
            if (typeof mutationMultipliers !== 'undefined' && mutationMultipliers[name] != null) {
                return Number(mutationMultipliers[name]) || 1;
            }
            return 1;
        }

        function collectLandlordFieldMutationEntries(plant) {
            const entries = [];
            (plant.mutations || []).forEach(function (m) {
                entries.push({ name: m, kind: 'basic', mult: getLandlordMutationDisplayMult(m) });
            });
            (plant.weatherMutations || []).forEach(function (m) {
                entries.push({ name: m, kind: 'weather', mult: getLandlordMutationDisplayMult(m) });
            });
            if (plant.specialMutation) {
                const specialName = (typeof specialMutations !== 'undefined' && specialMutations[getLandlordSeedBaseName(plant.type)])
                    ? specialMutations[getLandlordSeedBaseName(plant.type)]
                    : '特殊突变';
                entries.push({ name: specialName, kind: 'special', mult: 5 });
            }
            entries.sort(function (a, b) { return b.mult - a.mult; });
            return entries;
        }

        function landlordFieldTagsToggleLabel(expanded, restCount) {
            return expanded ? '收起词条' : ('展开词条 +' + restCount);
        }

        function buildLandlordFieldTagsHtml(plant, fieldIndex) {
            const entries = collectLandlordFieldMutationEntries(plant);
            if (!entries.length) {
                return '<div class="lf-tags lf-tags--empty">暂无词条</div>';
            }
            const previewMax = 4;
            // 默认收起；仅用户点过展开的地块才保持展开
            const expanded = window.__landlordFieldTagsExpanded[fieldIndex] === true;
            const preview = entries.slice(0, previewMax);
            const rest = entries.slice(previewMax);
            let html = '<div class="lf-tags' + (expanded ? ' is-expanded' : '') + '" data-field="' + fieldIndex + '">';
            html += '<div class="lf-tags-head"><span class="lf-tags-title">词缀光华</span><span class="lf-tags-meta">' + entries.length + ' 条</span></div>';
            html += '<div class="lf-tags-preview">';
            preview.forEach(function (e) {
                const colorClass = e.kind === 'special'
                    ? 'landlord-mutation-rainbow'
                    : getLandlordMutationColorClass(e.name);
                html += '<span class="landlord-mutation-tag lf-tag ' + colorClass + '">' + e.name + '</span>';
            });
            html += '</div>';
            if (rest.length) {
                html += '<div class="lf-tags-extra"' + (expanded ? '' : ' hidden') + '>';
                rest.forEach(function (e) {
                    const colorClass = e.kind === 'special'
                        ? 'landlord-mutation-rainbow'
                        : getLandlordMutationColorClass(e.name);
                    html += '<span class="landlord-mutation-tag lf-tag ' + colorClass + '">' + e.name + '</span>';
                });
                html += '</div>';
                html += '<button type="button" class="lf-tags-toggle" onclick="event.stopPropagation();toggleLandlordFieldTagsExpand(' + fieldIndex + ', this)">' +
                    landlordFieldTagsToggleLabel(expanded, rest.length) + '</button>';
            }
            html += '</div>';
            return html;
        }

        function toggleLandlordFieldTagsExpand(fieldIndex, btn) {
            const fi = typeof fieldIndex === 'number' ? fieldIndex : parseInt(fieldIndex, 10);
            if (!Number.isFinite(fi)) return;
            const card = (btn && btn.closest) ? btn.closest('.landlord-field') : null;
            const wrap = (card && card.querySelector('.lf-tags')) ||
                document.querySelector('.lf-tags[data-field="' + fi + '"]');
            if (!wrap) return;
            const extra = wrap.querySelector('.lf-tags-extra');
            const willExpand = !wrap.classList.contains('is-expanded');
            wrap.classList.toggle('is-expanded', willExpand);
            window.__landlordFieldTagsExpanded[fi] = willExpand;
            if (extra) {
                if (willExpand) extra.removeAttribute('hidden');
                else extra.setAttribute('hidden', '');
            }
            if (btn) {
                const n = extra ? extra.querySelectorAll('.lf-tag').length : 0;
                btn.textContent = landlordFieldTagsToggleLabel(willExpand, n);
            }
        }
        window.toggleLandlordFieldTagsExpand = toggleLandlordFieldTagsExpand;

        function buildLandlordFieldCardMarkup(i) {
            const plant = player.landlord.fields[i];
            const isLocked = !!player.landlord.lockedFields[i];
            const tier = Number(player.landlord.fieldTiers[i]) || 0;
            const tierName = LANDLORD_FIELD_TIER_NAMES[tier] || '普通地';
            let tierUpgradeRow = '';
            if (tier < LANDLORD_FIELD_TIER_MAX) {
                const cost = LANDLORD_TIER_UPGRADE_COST[tier];
                const enough = cost && (player.landlord.bars[cost.barKey] || 0) >= cost.amount;
                tierUpgradeRow = '<div class="lf-upgrade"><button type="button" class="landlord-tier-upgrade-btn landlord-tier-next-' + (tier + 1) + '" ' +
                    (enough ? '' : 'disabled ') +
                    'onclick="upgradeLandlordFieldTier(' + i + ')">升级 ' + LANDLORD_FIELD_TIER_NAMES[tier + 1] +
                    '<span class="lf-upgrade-cost">' + cost.amount + cost.label + '</span></button></div>';
            } else {
                tierUpgradeRow = '<div class="lf-upgrade lf-upgrade--max">已满级 · 无上土地</div>';
            }

            const className = 'landlord-field lf-card landlord-field-tier-' + tier +
                (!plant ? ' empty' : '') +
                (isLocked ? ' locked' : '') +
                (plant && plant.isMature ? ' is-mature' : '') +
                (plant && !plant.isMature ? ' is-growing' : '');

            const lockBtn = '<button type="button" class="landlord-lock-button lf-lock ' + (isLocked ? 'active' : '') + '" ' +
                'onclick="toggleFieldLock(' + i + ')" title="' + (isLocked ? '解锁田地' : '锁定田地') + '">' +
                (isLocked ? '🔓' : '🔒') + '</button>';

            const headHtml =
                '<div class="lf-head">' +
                    '<div class="lf-head-left">' +
                        '<span class="lf-plot">#' + (i + 1) + '</span>' +
                        '<span class="lf-tier landlord-field-tier-label">' + tierName + '</span>' +
                    '</div>' +
                    lockBtn +
                '</div>';

            const fxLayers = tier >= 1
                ? (
                    '<div class="lf-veil" aria-hidden="true"></div>' +
                    '<div class="lf-shine" aria-hidden="true"></div>' +
                    '<div class="lf-shine lf-shine--lag" aria-hidden="true"></div>' +
                    '<div class="lf-sparks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
                    '<div class="lf-rim" aria-hidden="true"></div>'
                )
                : '';

            let html;
            if (!plant) {
                html =
                    fxLayers +
                    (tier >= 1 ? '<div class="lf-leaf" aria-hidden="true"></div>' : '') +
                    headHtml +
                    '<div class="lf-empty-body">' +
                        '<div class="lf-seed" aria-hidden="true"><span></span></div>' +
                        '<div class="lf-empty-mark">空闲地块</div>' +
                        '<p class="lf-empty-hint">播下一颗种子，静候生长</p>' +
                        '<button type="button" class="landlord-plant-button lf-btn-plant" onclick="selectLandlordSeedForPlanting(' + i + ')">种植</button>' +
                    '</div>' +
                    tierUpgradeRow;
            } else {
                const timeLeft = plant.isMature ? 0 :
                    Math.max(0, Math.ceil(plant.growTime - (Date.now() - plant.plantedAt) / (1000 * 60)));
                const progress = plant.isMature ? 100 :
                    Math.min(100, Math.floor(((Date.now() - plant.plantedAt) / (1000 * 60)) / plant.growTime * 100));
                const statusChip = plant.isMature
                    ? '<span class="lf-chip lf-chip--ready">可收获</span>'
                    : '<span class="lf-chip lf-chip--grow">成长 ' + timeLeft + ' 分</span>';
                const lockChip = isLocked ? '<span class="lf-chip lf-chip--lock">已锁定</span>' : '';
                const weightChip = '<span class="lf-chip lf-chip--weight">' + plant.weight.toFixed(2) + ' kg</span>';
                let multChip = '';
                if (typeof calculateLandlordMultiplier === 'function') {
                    const multNum = Number(calculateLandlordMultiplier(plant)) || 1;
                    let multLabel;
                    if (typeof formatNumber === 'function' && multNum >= 1000) {
                        multLabel = formatNumber(multNum) + '倍';
                    } else if (Math.abs(multNum - Math.round(multNum)) < 1e-9) {
                        multLabel = Math.round(multNum) + '倍';
                    } else {
                        multLabel = multNum.toFixed(1) + '倍';
                    }
                    multChip = '<span class="lf-chip lf-chip--mult" title="词条总倍率">' + multLabel + '</span>';
                }
                const tagsHtml = buildLandlordFieldTagsHtml(plant, i);
                const progressHtml = plant.isMature
                    ? '<div class="lf-progress lf-progress--ready" title="已成熟"><div class="lf-progress-fill" style="width:100%"></div><span class="lf-progress-label">成熟可收</span></div>'
                    : '<div class="lf-progress" title="成长进度 ' + progress + '%">' +
                        '<div class="lf-progress-fill" style="width:' + progress + '%"></div>' +
                        '<span class="lf-progress-label">' + progress + '%</span>' +
                      '</div>';

                html =
                    fxLayers +
                    headHtml +
                    '<div class="lf-hero">' +
                        '<div class="lf-crop plant-name">' + getLandlordGeneVariantLabelHtml(plant.type) + '</div>' +
                        '<div class="lf-status-row">' + statusChip + weightChip + multChip + lockChip + '</div>' +
                    '</div>' +
                    '<div class="lf-panel">' +
                        progressHtml +
                        tagsHtml +
                        '<div class="lf-actions landlord-field-actions">' +
                            (plant.isMature
                                ? '<button type="button" class="landlord-harvest-button lf-btn" onclick="harvestLandlordPlant(' + i + ')">收获</button>'
                                : '<button type="button" class="landlord-growth-button lf-btn lf-btn--muted" disabled>成长中</button>') +
                            '<button type="button" class="landlord-item-button lf-btn" onclick="selectLandlordItemForUsing(' + i + ')">道具</button>' +
                            '<button type="button" class="landlord-remove-button lf-btn lf-btn--danger" onclick="removeLandlordPlant(' + i + ')">铲除</button>' +
                        '</div>' +
                    '</div>' +
                    tierUpgradeRow;
            }
            return { className: className, html: html };
        }

        function applyLandlordFieldCard(fieldDiv, i) {
            if (!fieldDiv) return;
            const built = buildLandlordFieldCardMarkup(i);
            fieldDiv.className = built.className;
            fieldDiv.setAttribute('data-field-index', String(i));
            fieldDiv.innerHTML = built.html;
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
        const fieldDiv = document.createElement('div');
        applyLandlordFieldCard(fieldDiv, i);
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
                    <div class="lf-unlock-card">
                        <div class="lf-unlock-title">拓荒新地</div>
                        <div class="lf-unlock-desc">解锁第 ${player.landlord.unlockedFields + 1}-${player.landlord.unlockedFields + 5} 号田地</div>
                        <div class="lf-unlock-cost">需要 <strong>${formatNumber(unlockCost)}</strong> 地主币</div>
                        <button class="landlord-unlock-button lf-unlock-btn" ${player.landlord.coins >= unlockCost ? '' : 'disabled'}
                                onclick="unlockLandlordField()">
                            ${player.landlord.coins >= unlockCost ? '解锁五块田地' : '货币不足'}
                        </button>
                    </div>
                `;
            } else {
                unlockSection.innerHTML = '<div class="lf-unlock-card lf-unlock-card--done">全部田地已解锁</div>';
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
                    出售带有【银/金/水晶/流光/神辉/太初/无上】基础词条的果实可获得抽奖机会
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
            var bdv = document.getElementById('landlordBarDivine');
            if (bdv) bdv.textContent = formatNumber(player.landlord.bars.divine || 0);
            var bp = document.getElementById('landlordBarPrimal');
            if (bp) bp.textContent = formatNumber(player.landlord.bars.primal || 0);
            var bsp = document.getElementById('landlordBarSupreme');
            if (bsp) bsp.textContent = formatNumber(player.landlord.bars.supreme || 0);
            var ldc = document.getElementById('landlordLotteryDrawCountStat');
            if (ldc && player.landlord.lottery) {
                ldc.textContent = formatNumber(player.landlord.lottery.drawCount || 0);
            }
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
            // 超彩基础词 / 顶级土地 / 超彩天气（比彩色更炫）
            if (["至道", "无上", "无上土"].includes(mutation)) return "landlord-mutation-genesis";
            if (["圣劫", "太初", "太初土"].includes(mutation)) return "landlord-mutation-stellar";
            if (["仙霓", "神辉", "神辉土"].includes(mutation)) return "landlord-mutation-aurora";
            // 基础突变颜色
            if (["银", "银土", "落雷", "冰冻", "陶化"].includes(mutation)) return "landlord-mutation-green";
            if (["金", "金土", "荧光", "彩虹"].includes(mutation)) return "landlord-mutation-blue";
            if (["星环", "瓷化", "亮晶晶", "星陨", "幻潮", "雷狱", "霜龙"].includes(mutation)) return "landlord-mutation-purple";
            if (["水晶", "钻石土", "红月", "日曜", "月蚀", "焚天", "苍穹裂"].includes(mutation)) return "landlord-mutation-gold";
            if (["流光", "流光土", "霓虹", "虚空潮", "神罚雷", "混沌雨", "天道虹", "创世霞", "永恒极光"].includes(mutation)) return "landlord-mutation-rainbow";
            
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
    infoDiv.className = 'landlord-synth-info-box landlord-synth-info-box--gene';
    infoDiv.innerHTML = `
        <h4>基因合成规则</h4>
        <ul>
            <li>选 2 个种子各耗 1 个，按价区间随机产出</li>
            <li>40% 变异：彩光80% / 炫彩14% / 琉璃5% / 琥珀1%</li>
            <li>点击材料框弹出列表选种</li>
        </ul>
    `;
    container.appendChild(infoDiv);

    const slotsDiv = document.createElement('div');
    slotsDiv.className = 'landlord-synth-gene-slots';
    for (let i = 0; i < 2; i++) {
        const slot = document.createElement('div');
        slot.className = 'landlord-synth-gene-slot' + (selection[i] ? ' is-filled' : '');
        slot.title = selection[i] ? '点击更换种子' : '点击选择种子';
        if (selection[i]) {
            slot.innerHTML = `
                <div class="landlord-synth-gene-slot-label">材料 ${i + 1}</div>
                <div class="landlord-synth-gene-slot-name">${getLandlordGeneVariantLabelHtml(selection[i])}</div>
                <button type="button" class="landlord-synth-btn landlord-synth-btn--ghost" data-gene-remove="${i}">移除</button>
            `;
        } else {
            slot.innerHTML = `
                <div class="landlord-synth-gene-slot-label">材料 ${i + 1}</div>
                <div class="landlord-synth-gene-slot-plus">+</div>
                <div class="landlord-synth-gene-slot-hint">点击选择种子</div>
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

    const filledCount = (selection[0] ? 1 : 0) + (selection[1] ? 1 : 0);
    const canSynth = filledCount === 2;
    const batchTimes = canSynth ? getGeneSynthesisBatchTimes(selection[0], selection[1]) : 0;

    const toolbar = document.createElement('div');
    toolbar.className = 'landlord-synth-gene-toolbar';
    const countDiv = document.createElement('div');
    countDiv.className = 'landlord-synth-gene-count';
    countDiv.innerHTML = '已选 <strong>' + filledCount + '</strong> / 2' +
        (batchTimes > 1 ? ' · 可连合 <strong>' + batchTimes + '</strong> 次' : '');
    const actionRight = document.createElement('div');
    actionRight.className = 'landlord-synth-gene-actions';
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'landlord-synth-btn landlord-synth-btn--ghost';
    clearBtn.textContent = '清空';
    clearBtn.addEventListener('click', function () { clearGeneSynthesisSelection(); });
    const synthBtn = document.createElement('button');
    synthBtn.type = 'button';
    synthBtn.className = 'landlord-synth-btn ' + (canSynth ? 'landlord-synth-btn--warning' : 'landlord-synth-btn--muted');
    synthBtn.textContent = canSynth ? '基因合成' : '需选满2个';
    synthBtn.disabled = !canSynth;
    synthBtn.addEventListener('click', function () { executeGeneSynthesis(); });
    const batchBtn = document.createElement('button');
    batchBtn.type = 'button';
    batchBtn.className = 'landlord-synth-btn ' + (batchTimes > 0 ? 'landlord-synth-btn--warning' : 'landlord-synth-btn--muted');
    batchBtn.textContent = batchTimes > 0 ? ('一键合成×' + batchTimes) : '一键合成';
    batchBtn.disabled = batchTimes < 1;
    batchBtn.title = batchTimes > 0 ? '按当前材料连续合成，直到数量不足' : '需选满2个且库存足够';
    batchBtn.addEventListener('click', function () { executeGeneSynthesisBatch(); });
    actionRight.appendChild(clearBtn);
    actionRight.appendChild(synthBtn);
    actionRight.appendChild(batchBtn);
    toolbar.appendChild(countDiv);
    toolbar.appendChild(actionRight);
    container.appendChild(toolbar);

    const autoDiv = document.createElement('div');
    autoDiv.className = 'landlord-synth-auto-section';
    autoDiv.innerHTML = '<div class="landlord-synth-action-bar-title">选择目标 · 一键最优放入</div><div class="landlord-synth-action-bar-desc">点击卡片自动放入成功率最高的 2 个材料</div>';
    try {
        const autoTargets = typeof listGeneSynthesisAutoTargets === 'function' ? listGeneSynthesisAutoTargets() : [];
        if (!autoTargets.length) {
            const emptyAuto = document.createElement('div');
            emptyAuto.className = 'landlord-synth-empty';
            emptyAuto.style.padding = '24px';
            emptyAuto.textContent = '当前仓库暂无可合成目标';
            autoDiv.appendChild(emptyAuto);
        } else {
            const autoList = document.createElement('div');
            autoList.className = 'landlord-synth-auto-grid';
            for (let ti = 0; ti < autoTargets.length; ti++) {
                const t = autoTargets[ti];
                const card = document.createElement('div');
                card.className = 'landlord-synth-auto-card';
                const pair = t.pair || [];
                const matA = pair[0] ? (typeof getLandlordGeneVariantLabelHtml === 'function' ? getLandlordGeneVariantLabelHtml(pair[0]) : String(pair[0])) : '-';
                const matB = pair[1] ? (typeof getLandlordGeneVariantLabelHtml === 'function' ? getLandlordGeneVariantLabelHtml(pair[1]) : String(pair[1])) : '-';
                card.innerHTML =
                    '<div class="landlord-synth-auto-card-top">' +
                        '<div class="landlord-synth-auto-card-index">' + t.chainIndex + '</div>' +
                        '<div class="landlord-synth-auto-card-chance">约 ' + t.chanceText + '</div>' +
                    '</div>' +
                    '<div class="landlord-synth-auto-card-target">' + t.base + '</div>' +
                    '<div class="landlord-synth-auto-card-materials">' +
                        '<div class="landlord-synth-auto-card-material">' + matA + '</div>' +
                        '<div class="landlord-synth-auto-card-plus">+</div>' +
                        '<div class="landlord-synth-auto-card-material">' + matB + '</div>' +
                    '</div>' +
                    '<div class="landlord-synth-auto-card-meta">' + (t.candidateCount ? ('候选 ' + t.candidateCount + ' 种 · ') : '') + '价值 ' + formatNumber(t.price || 0) + '</div>';
                const fillBtn = document.createElement('button');
                fillBtn.type = 'button';
                fillBtn.className = 'landlord-synth-auto-card-btn';
                fillBtn.textContent = '一键放入';
                fillBtn.addEventListener('click', (function (baseName) {
                    return function (e) {
                        e.stopPropagation();
                        autoFillGeneSynthesisForTarget(baseName);
                    };
                })(t.base));
                card.appendChild(fillBtn);
                card.addEventListener('click', (function (baseName) {
                    return function (e) {
                        if (e.target.closest('button')) return;
                        autoFillGeneSynthesisForTarget(baseName);
                    };
                })(t.base));
                autoList.appendChild(card);
            }
            autoDiv.appendChild(autoList);
        }
    } catch (autoErr) {
        console.warn('gene auto targets render failed', autoErr);
        const errDiv = document.createElement('div');
        errDiv.style.cssText = 'color:#c0392b;font-size:0.92em;margin-top:10px;';
        errDiv.textContent = '一键列表加载失败，可点材料框手动选种。';
        autoDiv.appendChild(errDiv);
    }
    container.appendChild(autoDiv);

    const statsDiv = document.createElement('div');
    statsDiv.className = 'landlord-synth-stats-bar';
    statsDiv.innerHTML =
        '<div><div class="landlord-synth-stat-value landlord-synth-stat-value--orange">' + (player.landlord.stats.geneSynthesisCount || 0) + '</div><div class="landlord-synth-stat-label">基因合成次数</div></div>';
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
        btn.innerHTML =
            '<div class="landlord-gene-seed-pick-item-index">' + (chainIndex > 0 ? chainIndex : '-') + '</div>' +
            '<div class="landlord-gene-seed-pick-item-main">' +
                '<div class="landlord-gene-seed-pick-item-name">' + getLandlordGeneVariantLabelHtml(seedName) + '</div>' +
                '<div class="landlord-gene-seed-pick-item-meta">价格 ' + formatNumber(seedProps ? seedProps.price : 0) +
                    (selectedCount > 0 ? ' · 已选 ' + selectedCount : '') + '</div>' +
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
        empty.className = 'landlord-gene-seed-picker-empty';
        empty.innerHTML = '<div class="landlord-synth-empty-icon">🌱</div>种子仓库为空';
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
        picker.classList.add('is-open');
        picker.setAttribute('aria-hidden', 'false');
    }
}

function closeGeneSynthesisSeedPicker() {
    var picker = document.getElementById('landlordGeneSeedPicker');
    if (picker) {
        picker.classList.remove('is-open');
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
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    return modal;
}

function closeGeneBatchInfoModal() {
    var modal = document.getElementById('landlordGeneBatchInfoModal');
    if (modal) {
        modal.classList.remove('is-open');
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
            '<div class="landlord-gene-batch-info-hint">确认后将立即执行全部合成，结果会以弹窗汇总展示。</div>';
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
    const infoDiv = document.createElement('div');
    infoDiv.className = 'landlord-synth-info-box';
    infoDiv.innerHTML = `
        <h4>种子合成规则</h4>
        <ul>
            <li>3 个低级种子可合成 1 个高级种子</li>
            <li>合成不可逆；神秘果为最高级，无法继续</li>
        </ul>
    `;
    container.appendChild(infoDiv);

    const statsDiv = document.createElement('div');
    statsDiv.className = 'landlord-synth-stats-bar';
    statsDiv.innerHTML = `
        <div>
            <div class="landlord-synth-stat-value">${player.landlord.stats.synthesisCount || 0}</div>
            <div class="landlord-synth-stat-label">总合成次数</div>
        </div>
        <div>
            <div class="landlord-synth-stat-value landlord-synth-stat-value--green">${player.landlord.stats.seedsUpgraded || 0}</div>
            <div class="landlord-synth-stat-label">升级种子数</div>
        </div>
    `;
    container.appendChild(statsDiv);

    const autoSynthesisDiv = document.createElement('div');
    autoSynthesisDiv.className = 'landlord-synth-action-bar';
    autoSynthesisDiv.innerHTML = `
        <div>
            <div class="landlord-synth-action-bar-title">一键合成</div>
            <div class="landlord-synth-action-bar-desc">自动合成所有可合成种子</div>
        </div>
        <button onclick="autoSynthesizeAll()" class="landlord-synth-btn landlord-synth-btn--warning">一键合成全部</button>
    `;
    container.appendChild(autoSynthesisDiv);

    const synthesisList = document.createElement('div');
    synthesisList.className = 'landlord-synth-linear-grid';

    let hasSynthesisOptions = false;

    for (const seedName in seedSynthesisRules) {
        const rule = seedSynthesisRules[seedName];
        if (!rule.nextLevel) continue;

        const currentCount = player.landlord.seedStorage[seedName] || 0;
        const canSynthesize = currentCount >= rule.required;
        const nextSeedValue = seedProperties[rule.nextLevel] ? seedProperties[rule.nextLevel].price : 0;
        const currentSeedValue = seedProperties[seedName] ? seedProperties[seedName].price : 0;
        const valueIncrease = nextSeedValue - (currentSeedValue * rule.required);
        const batchCount = Math.floor(currentCount / rule.required);

        const card = document.createElement('div');
        card.className = 'landlord-synth-linear-card' + (canSynthesize ? ' is-ready' : '');

        card.innerHTML = `
            <div class="landlord-synth-linear-card-top">
                <span class="landlord-synth-linear-card-badge${canSynthesize ? ' is-ready' : ''}">${canSynthesize ? '可合成' : '材料不足'}</span>
            </div>
            <div class="landlord-synth-linear-card-route">${seedName} → ${rule.nextLevel}</div>
            <div class="landlord-synth-linear-card-formula">
                <span class="landlord-synth-linear-card-from"><strong>${currentCount}</strong> / ${rule.required} 个${seedName}</span>
                <span class="landlord-synth-linear-card-arrow">↓</span>
                <span class="landlord-synth-linear-card-to">1 个${rule.nextLevel}</span>
            </div>
            <div class="landlord-synth-linear-card-desc">
                ${rule.description}
                ${valueIncrease > 0 ? '<span class="value-up">价值 +' + formatNumber(valueIncrease) + '</span>' : ''}
            </div>
            <div class="landlord-synth-linear-card-actions">
                <button onclick="synthesizeSeed('${seedName}')"
                        ${canSynthesize ? '' : 'disabled'}
                        class="landlord-synth-btn ${canSynthesize ? 'landlord-synth-btn--primary' : 'landlord-synth-btn--muted'}">
                    ${canSynthesize ? '合成' : '材料不足'}
                </button>
                <button onclick="autoSynthesizeSeed('${seedName}')"
                        ${canSynthesize ? '' : 'disabled'}
                        class="landlord-synth-btn ${canSynthesize ? 'landlord-synth-btn--warning' : 'landlord-synth-btn--muted'}">
                    ${canSynthesize ? ('一键×' + batchCount) : '一键合成'}
                </button>
            </div>
        `;

        synthesisList.appendChild(card);
        hasSynthesisOptions = true;
    }

    if (!hasSynthesisOptions) {
        synthesisList.innerHTML = `
            <div class="landlord-synth-empty">
                <div class="landlord-synth-empty-icon">🌱</div>
                <div>暂无可合成的种子</div>
                <div style="font-size:0.85em;margin-top:6px;color:#95a5a6;">请先收集足够的低级种子</div>
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
    animationContainer.style.zIndex = '1005';
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

// 8. 添加合成相关CSS样式（动画与基因特效）
const synthesisStyles = `
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
                        const newWeather = (typeof pickLandlordNaturalWeather === 'function')
                            ? pickLandlordNaturalWeather()
                            : weatherList[Math.floor(Math.random() * weatherList.length)];
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
                        if (itemProperties[item].lotteryOnly) {
                            player.landlord.itemStoreItems[item] = 0;
                            continue;
                        }
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


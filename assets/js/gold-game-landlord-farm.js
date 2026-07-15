// 地主种植
        function initLandlordGame() {
            refreshLandlordStore();
            refreshLandlordItemStore();
            // 先离线补算（内含天气与牧场草场合鸣），再按 lastWeatherChange 补在线漏 tick，避免同一时段天气被算两次
            checkLandlordOfflineEarnings();
            updateLandlordWeather();
            renderAllLandlordUI();
            startLandlordTimers();
        }

        // 刷新种子商店
        function refreshLandlordStore() {
            const now = Date.now();
            const timeSinceRefresh = now - player.landlord.lastSeedRefreshTime;
            
            // 每10分钟刷新一次
            if (timeSinceRefresh >= 10 * 60 * 1000) {
                player.landlord.storeItems = {};
                
                for (const seed in refreshProbabilities) {
                    if (Math.random() * 100 < refreshProbabilities[seed]) {
                        player.landlord.storeItems[seed] = rollLandlordSeedStoreStock(seed);
                    } else {
                        player.landlord.storeItems[seed] = 0; // 无库存
                    }
                }
                
                player.landlord.lastSeedRefreshTime = now;
                showLandlordNotification("种子商店已刷新！", "info");
            }
            
            renderLandlordStore();
        }

        // 刷新道具商店
        function refreshLandlordItemStore() {
            const now = Date.now();
            const timeSinceRefresh = now - player.landlord.lastItemRefreshTime;
            
            // 每10分钟刷新一次
            if (timeSinceRefresh >= 10 * 60 * 1000) {
                player.landlord.itemStoreItems = {};
                
                for (const item in itemProperties) {
                    const probability = itemProperties[item].refreshProbability;
                    if (Math.random() * 100 < probability) {
                        player.landlord.itemStoreItems[item] = 1; // 库存1个
                    } else {
                        player.landlord.itemStoreItems[item] = 0; // 无库存
                    }
                }
                
                player.landlord.lastItemRefreshTime = now;
                showLandlordNotification("道具商店已刷新！", "info");
            }
            
            renderLandlordItemStore();
        }

        // 购买种子
        function buyLandlordSeed(seedName) {
            const seed = getLandlordSeedProperties(seedName) || seedProperties[seedName];
            
            if (!seed) {
                showLandlordNotification("种子不存在！", "error");
                return;
            }
            
            if (player.landlord.storeItems[seedName] <= 0) {
                showLandlordNotification("该种子已售罄！", "error");
                return;
            }
            
            if (player.landlord.coins < seed.price) {
                showLandlordNotification("地主币不足！", "error");
                return;
            }
            
            // 扣除货币
            player.landlord.coins -= seed.price;
            
            // 添加到种子仓库
            if (!player.landlord.seedStorage[seedName]) {
                player.landlord.seedStorage[seedName] = 0;
            }
            player.landlord.seedStorage[seedName]++;
            
            // 减少库存
            player.landlord.storeItems[seedName]--;
            
            // 更新显示
            updateLandlordCoinDisplay();
            renderLandlordStore();
            renderLandlordSeedStorage();
            
            showLandlordNotification(`成功购买${seedName}种子！`, "success");
            saveGame();
        }

        // 购买道具
        function buyLandlordItem(itemName) {
            const item = itemProperties[itemName];
            
            if (!item) {
                showLandlordNotification("道具不存在！", "error");
                return;
            }
            
            if (player.landlord.itemStoreItems[itemName] <= 0) {
                showLandlordNotification("该道具已售罄！", "error");
                return;
            }
            
            if (player.landlord.coins < item.price) {
                showLandlordNotification("地主币不足！", "error");
                return;
            }
            
            // 扣除货币
            player.landlord.coins -= item.price;
            
            // 添加到道具仓库
            if (!player.landlord.itemStorage[itemName]) {
                player.landlord.itemStorage[itemName] = 0;
            }
            player.landlord.itemStorage[itemName]++;
            
            // 减少库存
            player.landlord.itemStoreItems[itemName]--;
            
            // 更新显示
            updateLandlordCoinDisplay();
            renderLandlordItemStore();
            renderLandlordItemStorage();
            
            showLandlordNotification(`成功购买${itemName}！`, "success");
            saveGame();
        }

        // 选择种子种植
        function selectLandlordSeedForPlanting(fieldIndex) {
            player.landlord.selectedFieldIndex = fieldIndex;
            
            // 打开种子选择模态框
            const modal = document.getElementById('landlordSeedModal');
            const content = document.getElementById('landlordSeedModalContent');
            
            content.innerHTML = '';
            
            for (const seedName in player.landlord.seedStorage) {
                if (player.landlord.seedStorage[seedName] > 0) {
                    const seedDiv = document.createElement('div');
                    seedDiv.className = 'landlord-seed-item';
                    seedDiv.style.cursor = 'pointer';
                    seedDiv.style.marginBottom = '10px';
                    seedDiv.onclick = () => plantLandlordSeed(fieldIndex, seedName);
                    
                    const seedProps = getLandlordSeedProperties(seedName);
                    const seedColor = seedProps ? seedProps.color : '#8B4513';
                    
                    seedDiv.innerHTML = `
                        <div class="landlord-seed-icon" style="background: ${seedColor};">${getLandlordSeedBaseName(seedName).charAt(0)}</div>
                        <div>${getLandlordGeneVariantLabelHtml(seedName)}</div>
                        <div>库存: ${player.landlord.seedStorage[seedName]}</div>
                        <div style="font-size:0.85em;color:#7f8c8d;">价格: ${formatNumber(seedProps ? seedProps.price : 0)}</div>
                    `;
                    
                    content.appendChild(seedDiv);
                }
            }
            
            if (content.children.length === 0) {
                content.innerHTML = '<div style="text-align: center; padding: 20px;">种子仓库为空</div>';
            }
            
            modal.style.display = 'block';
        }

        // 关闭种子选择模态框
        function closeLandlordSeedModal() {
            document.getElementById('landlordSeedModal').style.display = 'none';
            player.landlord.selectedFieldIndex = null;
        }

        // 选择道具使用
        function selectLandlordItemForUsing(fieldIndex) {
            player.landlord.selectedFieldIndex = fieldIndex;
            
            // 打开道具选择模态框
            const modal = document.getElementById('landlordItemModal');
            const content = document.getElementById('landlordItemModalContent');
            
            content.innerHTML = '';
            
            for (const itemName in player.landlord.itemStorage) {
                if (player.landlord.itemStorage[itemName] > 0) {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'landlord-item-item';
                    itemDiv.style.cursor = 'pointer';
                    itemDiv.style.marginBottom = '10px';
                    itemDiv.onclick = () => useLandlordItem(fieldIndex, itemName);
                    
                    const itemColor = itemProperties[itemName].color;
                    const itemDesc = itemProperties[itemName].description;
                    
                    itemDiv.innerHTML = `
                        <div class="landlord-item-icon" style="background: ${itemColor};">${itemName.charAt(0)}</div>
                        <div>${itemName}</div>
                        <div style="font-size: 0.8em; color: #7f8c8d; margin: 5px 0;">${itemDesc}</div>
                        <div>库存: ${player.landlord.itemStorage[itemName]}</div>
                    `;
                    
                    content.appendChild(itemDiv);
                }
            }
            
            if (content.children.length === 0) {
                content.innerHTML = '<div style="text-align: center; padding: 20px;">道具仓库为空</div>';
            }
            
            modal.style.display = 'block';
        }

        // 关闭道具选择模态框
        function closeLandlordItemModal() {
            document.getElementById('landlordItemModal').style.display = 'none';
            player.landlord.selectedFieldIndex = null;
        }

        // 种植种子
        function plantLandlordSeed(fieldIndex, seedName) {
            if (!player.landlord.seedStorage[seedName] || player.landlord.seedStorage[seedName] <= 0) {
                showLandlordNotification("种子不足！", "error");
                closeLandlordSeedModal();
                return;
            }
            
            if (player.landlord.fields[fieldIndex] !== null) {
                showLandlordNotification("地块已被占用！", "error");
                closeLandlordSeedModal();
                return;
            }
            
            // 消耗种子
            player.landlord.seedStorage[seedName]--;
            
            // 创建新植物
            const plant = createNewLandlordPlant(seedName, fieldIndex);
            if (!plant) {
                closeLandlordSeedModal();
                return;
            }
            
            // 放置到田地
            player.landlord.fields[fieldIndex] = plant;
            
            // 更新统计
            player.landlord.stats.totalPlants++;
            
            // 更新显示
            renderLandlordFields();
            renderLandlordSeedStorage();
            closeLandlordSeedModal();
            
            showLandlordNotification(`${seedName}已种植！`, "success");
            saveGame();
        }

        // 使用道具
        function useLandlordItem(fieldIndex, itemName) {
            const plant = player.landlord.fields[fieldIndex];
            
            if (!plant) {
                showLandlordNotification("地块为空，无法使用道具！", "error");
                closeLandlordItemModal();
                return;
            }
            
            if (!player.landlord.itemStorage[itemName] || player.landlord.itemStorage[itemName] <= 0) {
                showLandlordNotification("道具不足！", "error");
                closeLandlordItemModal();
                return;
            }
            
            // 消耗道具
            player.landlord.itemStorage[itemName]--;
            
            // 应用道具效果
            let effectMessage = applyLandlordItemEffect(plant, itemName);
            
            // 更新统计
            player.landlord.stats.itemsUsed++;
            
            // 更新显示
            renderLandlordFields();
            renderLandlordItemStorage();
            closeLandlordItemModal();
            
            showLandlordNotification(`使用${itemName}成功！${effectMessage}`, "success");
            saveGame();
        }

        // 应用道具效果
        function applyLandlordItemEffect(plant, itemName) {
            let effectMessage = "";
            
            switch(itemName) {
                case "普通浇水器":
                    // 加速成长5分钟
                    const acceleratedTime1 = Date.now() - 10 * 60 * 1000;
                    plant.plantedAt = Math.min(plant.plantedAt, acceleratedTime1);
                    effectMessage = "生长加速10分钟！";
                    
                    // 如果没有特殊突变或者基础突变，2%几率特殊突变和基础突变
                    if (plant.mutations.length === 0 && !plant.specialMutation) {
                        if (Math.random() * 100 < 2) {
                            const hadSpecial = !!plant.specialMutation;
                            applyLandlordBasicMutation(plant, { guaranteeBasic: true });
                            effectMessage += " 触发了基础突变！";
                            if (plant.specialMutation && !hadSpecial) effectMessage += " 并触发特殊突变！";
                        }
                    }
                    break;
                    
                case "高级浇水器":
                    // 加速成长15分钟
                    const acceleratedTime2 = Date.now() - 20 * 60 * 1000;
                    plant.plantedAt = Math.min(plant.plantedAt, acceleratedTime2);
                    effectMessage = "生长加速20分钟！";
                    
                    // 如果没有特殊突变或者基础突变，5%几率特殊突变和基础突变
                    if (plant.mutations.length === 0 && !plant.specialMutation) {
                        if (Math.random() * 100 < 5) {
                            const hadSpecial = !!plant.specialMutation;
                            applyLandlordBasicMutation(plant, { guaranteeBasic: true });
                            effectMessage += " 触发了基础突变！";
                            if (plant.specialMutation && !hadSpecial) effectMessage += " 并触发特殊突变！";
                        }
                    }
                    break;
                    
                case "超级浇水器":
                    // 加速成长30分钟
                    const acceleratedTime3 = Date.now() - 60 * 60 * 1000;
                    plant.plantedAt = Math.min(plant.plantedAt, acceleratedTime3);
                    effectMessage = "生长加速60分钟！";
                    
                    // 如果没有特殊突变或者基础突变，10%几率特殊突变和基础突变
                    if (plant.mutations.length === 0 && !plant.specialMutation) {
                        if (Math.random() * 100 < 10) {
                            const hadSpecial = !!plant.specialMutation;
                            applyLandlordBasicMutation(plant, { guaranteeBasic: true });
                            effectMessage += " 触发了基础突变！";
                            if (plant.specialMutation && !hadSpecial) effectMessage += " 并触发特殊突变！";
                        }
                    }
                    break;
                    
                case "天气附加器":
                    // 直接获得一个没有获得的天气突变
                    const availableWeathers = weatherList.filter(weather => 
                        !plant.weatherMutations.includes(weather)
                    );
                    
                    if (availableWeathers.length > 0) {
                        const randomWeather = availableWeathers[Math.floor(Math.random() * availableWeathers.length)];
                        plant.weatherMutations.push(randomWeather);
                        player.landlord.stats.weatherMutations++;
                        effectMessage = `获得了${randomWeather}天气突变！`;
                    } else {
                        effectMessage = "已拥有所有天气突变！";
                    }
                    break;
            case "流星棒":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("亮晶晶")) {
                    plant.weatherMutations.push("亮晶晶");
                    player.landlord.stats.weatherMutations++;
                    effectMessage = "获得了亮晶晶词条！";
                } else {
                    effectMessage = "已有亮晶晶词条！";
                }
            } else {
                effectMessage = "没有天气词条，无法使用！";
            }
            break;
            
        case "火盆":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("灼热")) {
                    plant.weatherMutations.push("灼热");
                    player.landlord.stats.weatherMutations++;
                    effectMessage = "获得了灼热词条！";
                } else {
                    effectMessage = "已有灼热词条！";
                }
            } else {
                effectMessage = "没有天气词条，无法使用！";
            }
            break;
            
        case "吹风机":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("龙卷风")) {
                    plant.weatherMutations.push("龙卷风");
                    player.landlord.stats.weatherMutations++;
                    effectMessage = "获得了龙卷风词条！";
                } else {
                    effectMessage = "已有龙卷风词条！";
                }
            } else {
                effectMessage = "没有天气词条，无法使用！";
            }
            break;
            
        case "避雷针":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("落雷")) {
                    plant.weatherMutations.push("落雷");
                    player.landlord.stats.weatherMutations++;
                    effectMessage = "获得了落雷词条！";
                } else {
                    effectMessage = "已有落雷词条！";
                }
            } else {
                effectMessage = "没有天气词条，无法使用！";
            }
            break;
            
        case "雪球机":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("覆雪")) {
                    plant.weatherMutations.push("覆雪");
                    player.landlord.stats.weatherMutations++;
                    effectMessage = "获得了覆雪词条！";
                } else {
                    effectMessage = "已有覆雪词条！";
                }
            } else {
                effectMessage = "没有天气词条，无法使用！";
            }
            break;
            
        case "催化器":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("生机")) {
                    plant.weatherMutations.push("生机");
                    player.landlord.stats.weatherMutations++;
                    effectMessage = "获得了生机词条！";
                } else {
                    effectMessage = "已有生机词条！";
                }
            } else {
                effectMessage = "没有天气词条，无法使用！";
            }
            break;
            
        case "臭气弹":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("臭气")) {
                    plant.weatherMutations.push("臭气");
                    player.landlord.stats.weatherMutations++;
                    effectMessage = "获得了臭气词条！";
                } else {
                    effectMessage = "已有臭气词条！";
                }
            } else {
                effectMessage = "没有天气词条，无法使用！";
            }
            break;
            
        case "生化弹":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("腐烂")) {
                    plant.weatherMutations.push("腐烂");
                    player.landlord.stats.weatherMutations++;
                    effectMessage = "获得了腐烂词条！";
                } else {
                    effectMessage = "已有腐烂词条！";
                }
            } else {
                effectMessage = "没有天气词条，无法使用！";
            }
            break;
            
        case "雾霾制造器":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("迷雾")) {
                    plant.weatherMutations.push("迷雾");
                    player.landlord.stats.weatherMutations++;
                    effectMessage = "获得了迷雾词条！";
                } else {
                    effectMessage = "已有迷雾词条！";
                }
            } else {
                effectMessage = "没有天气词条，无法使用！";
            }
            break;
            
        case "时光沙漏":
            const sandMinutes = 15 + Math.floor(Math.random() * 31);
            const sandAccel = Date.now() - sandMinutes * 60 * 1000;
            plant.plantedAt = Math.min(plant.plantedAt, sandAccel);
            effectMessage = `随机加速了${sandMinutes}分钟！`;
            if (plant.mutations.length === 0 && !plant.specialMutation && Math.random() * 100 < 8) {
                applyLandlordBasicMutation(plant);
                effectMessage += " 触发了基础突变！";
            }
            break;
            
        case "幸运四叶草":
            if (Math.random() * 100 < 10) {
                const availableW = weatherList.filter(w => !plant.weatherMutations.includes(w));
                if (availableW.length > 0) {
                    const rw = availableW[Math.floor(Math.random() * availableW.length)];
                    plant.weatherMutations.push(rw);
                    player.landlord.stats.weatherMutations++;
                    effectMessage = `幸运触发！获得了${rw}天气突变！`;
                } else {
                    effectMessage = "已拥有所有天气突变！";
                }
            } else {
                effectMessage = "未触发幸运，下次一定！";
            }
            break;
            
        case "大地祝福":
            if (plant.mutations.length === 0 && !plant.specialMutation) {
                applyLandlordBasicMutation(plant);
                effectMessage = "大地祝福！必出基础突变！";
            } else {
                const earthAccel = Date.now() - 25 * 60 * 1000;
                plant.plantedAt = Math.min(plant.plantedAt, earthAccel);
                effectMessage = "额外加速成长25分钟！";
            }
            break;
            
        case "丰收号角":
            const hornAccel = Date.now() - 40 * 60 * 1000;
            plant.plantedAt = Math.min(plant.plantedAt, hornAccel);
            effectMessage = "丰收号角！加速成长40分钟！";
            if (plant.weatherMutations.length < weatherList.length && Math.random() * 100 < 15) {
                const availW = weatherList.filter(w => !plant.weatherMutations.includes(w));
                if (availW.length > 0) {
                    const rw = availW[Math.floor(Math.random() * availW.length)];
                    plant.weatherMutations.push(rw);
                    player.landlord.stats.weatherMutations++;
                    effectMessage += ` 获得了${rw}词条！`;
                }
            }
            break;
            
        case "月光精华":
            if (plant.weatherMutations.length > 0) {
                const hasRare = plant.weatherMutations.some(w => ["流光", "霓虹", "渡劫", "陨石", "红月", "水晶"].includes(w));
                if (!hasRare && !plant.weatherMutations.includes("霓虹") && Math.random() * 100 < 20) {
                    plant.weatherMutations.push("霓虹");
                    player.landlord.stats.weatherMutations++;
                    effectMessage = "月光精华！获得了霓虹词条！";
                } else {
                    effectMessage = "月光精华生效，未触发霓虹。";
                }
            } else {
                effectMessage = "需要先有天气词条才能使用月光精华！";
            }
            break;
            
        case "闪电催化":
            const lightningAccel = Date.now() - 20 * 60 * 1000;
            plant.plantedAt = Math.min(plant.plantedAt, lightningAccel);
            effectMessage = "闪电催化！加速20分钟！";
            if (plant.mutations.length === 0 && !plant.specialMutation) {
                applyLandlordBasicMutation(plant);
                effectMessage += " 触发了基础突变！";
            }
            break;
        case "晨曦露珠":
            const dawnAccel = Date.now() - 8 * 60 * 1000;
            plant.plantedAt = Math.min(plant.plantedAt, dawnAccel);
            effectMessage = "晨曦露珠！加速8分钟！";
            if (plant.weatherMutations.length > 0 && !plant.weatherMutations.includes("生机") && Math.random() * 100 < 5) {
                plant.weatherMutations.push("生机"); player.landlord.stats.weatherMutations++; effectMessage += " 获得了生机词条！";
            }
            break;
        case "烈日镜":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("灼热")) { plant.weatherMutations.push("灼热"); player.landlord.stats.weatherMutations++; effectMessage = "获得了灼热词条！"; }
                else { effectMessage = "已有灼热词条！"; }
            } else { effectMessage = "没有天气词条，无法使用！"; }
            break;
        case "秋收镰刀":
            const sickleAccel = Date.now() - 35 * 60 * 1000;
            plant.plantedAt = Math.min(plant.plantedAt, sickleAccel);
            effectMessage = "秋收镰刀！加速35分钟！";
            break;
        case "冬眠药剂":
            const sleepAccel = Date.now() - 5 * 60 * 1000;
            plant.plantedAt = Math.min(plant.plantedAt, sleepAccel);
            effectMessage = "冬眠药剂生效，加速5分钟！";
            break;
        case "春风扇":
            const springAccel = Date.now() - 12 * 60 * 1000;
            plant.plantedAt = Math.min(plant.plantedAt, springAccel);
            effectMessage = "春风扇！加速12分钟！";
            if (plant.mutations.length === 0 && !plant.specialMutation && Math.random() * 100 < 3) { applyLandlordBasicMutation(plant); effectMessage += " 触发了基础突变！"; }
            break;
        case "雷云发生器":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("落雷")) { plant.weatherMutations.push("落雷"); player.landlord.stats.weatherMutations++; effectMessage = "获得了落雷词条！"; }
                else { effectMessage = "已有落雷词条！"; }
            } else { effectMessage = "没有天气词条，无法使用！"; }
            break;
        case "彩虹喷雾":
            if (plant.weatherMutations.length > 0 && !plant.weatherMutations.includes("彩虹") && Math.random() * 100 < 3) {
                plant.weatherMutations.push("彩虹"); player.landlord.stats.weatherMutations++; effectMessage = "获得了彩虹词条！";
            } else { effectMessage = "彩虹喷雾生效，未触发彩虹。"; }
            break;
        case "星尘粉":
            const starMin = 10 + Math.floor(Math.random() * 16);
            plant.plantedAt = Math.min(plant.plantedAt, Date.now() - starMin * 60 * 1000);
            effectMessage = `星尘粉！随机加速了${starMin}分钟！`;
            break;
        case "月光瓶":
            const moonAccel = Date.now() - 15 * 60 * 1000;
            plant.plantedAt = Math.min(plant.plantedAt, moonAccel);
            effectMessage = "月光瓶！加速15分钟！";
            if (plant.weatherMutations.length > 0 && !plant.weatherMutations.includes("荧光") && Math.random() * 100 < 8) {
                plant.weatherMutations.push("荧光"); player.landlord.stats.weatherMutations++; effectMessage += " 获得了荧光词条！";
            }
            break;
        case "日光灯":
            const sunAccel = Date.now() - 18 * 60 * 1000;
            plant.plantedAt = Math.min(plant.plantedAt, sunAccel);
            effectMessage = "日光灯！加速18分钟！";
            break;
        case "露水收集器":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("潮湿")) { plant.weatherMutations.push("潮湿"); player.landlord.stats.weatherMutations++; effectMessage = "获得了潮湿词条！"; }
                else { effectMessage = "已有潮湿词条！"; }
            } else { effectMessage = "没有天气词条，无法使用！"; }
            break;
        case "暖阳石":
            const warmAccel = Date.now() - 10 * 60 * 1000;
            plant.plantedAt = Math.min(plant.plantedAt, warmAccel);
            effectMessage = "暖阳石！加速10分钟！";
            if (plant.weatherMutations.length > 0 && !plant.weatherMutations.includes("沙尘") && Math.random() * 100 < 10) {
                plant.weatherMutations.push("沙尘"); player.landlord.stats.weatherMutations++; effectMessage += " 获得了沙尘词条！";
            }
            break;
        case "冰晶":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("冰冻")) { plant.weatherMutations.push("冰冻"); player.landlord.stats.weatherMutations++; effectMessage = "获得了冰冻词条！"; }
                else { effectMessage = "已有冰冻词条！"; }
            } else { effectMessage = "没有天气词条，无法使用！"; }
            break;
        case "风铃":
            if (plant.weatherMutations.length > 0 && !plant.weatherMutations.includes("龙卷风") && Math.random() * 100 < 5) {
                plant.weatherMutations.push("龙卷风"); player.landlord.stats.weatherMutations++; effectMessage = "风铃作响！获得了龙卷风词条！";
            } else { effectMessage = "风铃轻响，未触发龙卷风。"; }
            break;
        case "雨伞":
            if (plant.weatherMutations.length > 0) {
                if (!plant.weatherMutations.includes("潮湿")) { plant.weatherMutations.push("潮湿"); player.landlord.stats.weatherMutations++; effectMessage = "获得了潮湿词条！"; }
                else { effectMessage = "已有潮湿词条！"; }
            } else { effectMessage = "没有天气词条，无法使用！"; }
            break;
            }
            
            return effectMessage;
        }

        function ensureLandlordBars(ll) {
            if (!ll) return;
            if (!ll.bars || typeof ll.bars !== 'object') ll.bars = { silver: 0, gold: 0, diamond: 0, flow: 0 };
            ['silver', 'gold', 'diamond', 'flow'].forEach(function (k) {
                if (typeof ll.bars[k] !== 'number' || !Number.isFinite(ll.bars[k])) ll.bars[k] = 0;
            });
        }

        function ensureLandlordFieldTiers(ll) {
            if (!ll) return;
            var out = new Array(50);
            var i;
            var src = ll.fieldTiers;
            if (Array.isArray(src)) {
                for (i = 0; i < 50; i++) {
                    var v = Number(src[i]);
                    out[i] = Number.isFinite(v) ? Math.max(0, Math.min(4, Math.floor(v))) : 0;
                }
            } else if (src && typeof src === 'object') {
                for (i = 0; i < 50; i++) {
                    var v2 = Number(src[i]);
                    out[i] = Number.isFinite(v2) ? Math.max(0, Math.min(4, Math.floor(v2))) : 0;
                }
            } else {
                for (i = 0; i < 50; i++) out[i] = 0;
            }
            ll.fieldTiers = out;
        }

        function ensureLandlordSkyVine(ll) {
            if (!ll) return;
            var maxLv = window.__landlordSkyVineConstantsReady
                ? LANDLORD_SKY_VINE_FRUIT_ORDER.length : 80;
            var lv = Number(ll.skyVineLevel);
            if (!Number.isFinite(lv) || lv < 0) lv = 0;
            if (lv > maxLv) lv = maxLv;
            ll.skyVineLevel = Math.floor(lv);
            var pr = Number(ll.skyVineProgress);
            if (!Number.isFinite(pr) || pr < 0) pr = 0;
            pr = Math.floor(pr);
            if (lv >= maxLv) {
                ll.skyVineProgress = 0;
                return;
            }
            while (pr >= 100 && lv < maxLv) {
                pr -= 100;
                lv++;
            }
            ll.skyVineLevel = lv;
            ll.skyVineProgress = Math.min(99, Math.max(0, pr));
        }

        function getLandlordSkyVineWorldExpMultiplier() {
            if (typeof player === 'undefined' || !player.landlord) return 1;
            ensureLandlordSkyVine(player.landlord);
            var perLevel = window.__landlordSkyVineConstantsReady
                ? LANDLORD_SKY_VINE_WORLD_EXP_PER_LEVEL : 0.05;
            return 1 + player.landlord.skyVineLevel * perLevel;
        }

        function ensureLandlordGeneTrees(ll) {
            if (!ll) return;
            if (!ll.geneTrees || typeof ll.geneTrees !== 'object') ll.geneTrees = {};
            var order = (window.__landlordGeneTreeConstantsReady && typeof LANDLORD_GENE_TREE_ORDER !== 'undefined')
                ? LANDLORD_GENE_TREE_ORDER : ['彩光', '炫彩', '琉璃', '琥珀'];
            var maxLv = window.__landlordSkyVineConstantsReady
                ? LANDLORD_SKY_VINE_FRUIT_ORDER.length : 80;
            var perLevel = window.__landlordGeneTreeConstantsReady
                ? LANDLORD_GENE_TREE_FRUIT_PER_LEVEL : 500;
            for (var i = 0; i < order.length; i++) {
                var key = order[i];
                var node = ll.geneTrees[key];
                if (!node || typeof node !== 'object') node = { level: 0, progress: 0 };
                var lv = Number(node.level);
                if (!Number.isFinite(lv) || lv < 0) lv = 0;
                if (lv > maxLv) lv = maxLv;
                lv = Math.floor(lv);
                var pr = Number(node.progress);
                if (!Number.isFinite(pr) || pr < 0) pr = 0;
                pr = Math.floor(pr);
                if (lv >= maxLv) {
                    ll.geneTrees[key] = { level: maxLv, progress: 0 };
                    continue;
                }
                while (pr >= perLevel && lv < maxLv) {
                    pr -= perLevel;
                    lv++;
                }
                ll.geneTrees[key] = {
                    level: lv,
                    progress: lv >= maxLv ? 0 : Math.min(perLevel - 1, Math.max(0, pr))
                };
            }
        }

        /** 基因树世界地图乘区：攻击/生命/爆伤/经验（与其它乘区叠乘） */
        function getLandlordGeneTreeWorldMapBonuses() {
            var out = { attack: 1, health: 1, critDamage: 1, exp: 1 };
            if (typeof player === 'undefined' || !player.landlord) return out;
            ensureLandlordGeneTrees(player.landlord);
            var defs = (window.__landlordGeneTreeConstantsReady && typeof LANDLORD_GENE_TREE_DEFS !== 'undefined')
                ? LANDLORD_GENE_TREE_DEFS : null;
            var order = (window.__landlordGeneTreeConstantsReady && typeof LANDLORD_GENE_TREE_ORDER !== 'undefined')
                ? LANDLORD_GENE_TREE_ORDER : ['彩光', '炫彩', '琉璃', '琥珀'];
            if (!defs) {
                defs = {
                    '彩光': { attackPerLevel: 1, healthPerLevel: 0, critDamagePerLevel: 0, expPerLevel: 0 },
                    '炫彩': { attackPerLevel: 0, healthPerLevel: 1, critDamagePerLevel: 0, expPerLevel: 0 },
                    '琉璃': { attackPerLevel: 3, healthPerLevel: 3, critDamagePerLevel: 3, expPerLevel: 0 },
                    '琥珀': { attackPerLevel: 0, healthPerLevel: 0, critDamagePerLevel: 0, expPerLevel: 0.1 }
                };
            }
            for (var i = 0; i < order.length; i++) {
                var key = order[i];
                var def = defs[key] || {};
                var lv = Number(player.landlord.geneTrees[key] && player.landlord.geneTrees[key].level) || 0;
                if (lv <= 0) continue;
                out.attack *= 1 + lv * (Number(def.attackPerLevel) || 0);
                out.health *= 1 + lv * (Number(def.healthPerLevel) || 0);
                out.critDamage *= 1 + lv * (Number(def.critDamagePerLevel) || 0);
                out.exp *= 1 + lv * (Number(def.expPerLevel) || 0);
            }
            return out;
        }

        var LANDLORD_RANCH_MAX_SLOTS = 40;
        var LANDLORD_RANCH_STOCKPILE_CAP = 10;
        /** 牧场仓库·待售产出：累计批数上限（+100 → 200） */
        var LANDLORD_RANCH_PRODUCE_WAREHOUSE_MAX_BATCHES = 200;
        /** 牧场仓库·动物库存：累计头数上限（+100 → 200） */
        var LANDLORD_RANCH_ANIMAL_INVENTORY_MAX = 200;
        var LANDLORD_RANCH_HOUR_MS = 60 * 60 * 1000;
        var LANDLORD_RANCH_QUALITY_NAMES = ['凡品', '良品', '精品', '珍品', '灵品', '玄品', '天品', '圣品'];
        var LANDLORD_RANCH_QUALITY_MULT = [1, 1.08, 1.18, 1.32, 1.5, 1.75, 2.05, 2.45];
        var LANDLORD_RANCH_QUALITY_WEIGHTS = [0.528, 0.22, 0.12, 0.07, 0.038, 0.016, 0.0065, 0.0015];
        /** 第 3～40 栏解锁费：log10 从 5 平滑到 25（1e5 → 1e25） */
        var LANDLORD_RANCH_UNLOCK_FIRST_SLOT = 3;
        var LANDLORD_RANCH_UNLOCK_LOG10_START = 5;
        var LANDLORD_RANCH_UNLOCK_LOG10_END = 25;
        function landlordRanchUnlockCost(slotNumber) {
            var n = Math.floor(Number(slotNumber) || 0);
            if (n < LANDLORD_RANCH_UNLOCK_FIRST_SLOT || n > LANDLORD_RANCH_MAX_SLOTS) return null;
            var denom = LANDLORD_RANCH_MAX_SLOTS - LANDLORD_RANCH_UNLOCK_FIRST_SLOT;
            var t = denom > 0 ? (n - LANDLORD_RANCH_UNLOCK_FIRST_SLOT) / denom : 0;
            var logC = LANDLORD_RANCH_UNLOCK_LOG10_START + t * (LANDLORD_RANCH_UNLOCK_LOG10_END - LANDLORD_RANCH_UNLOCK_LOG10_START);
            return Math.max(100, Math.round(Math.pow(10, logC)));
        }
        var LANDLORD_RANCH_PASTURE_YIELD_PER_TAG = 0.025;
        var LANDLORD_RANCH_PASTURE_CYCLE_RED_PER_TAG = 0.02;
        var LANDLORD_RANCH_TICKLE_COOLDOWN_MS = 24 * 60 * 60 * 1000;
        var LANDLORD_RANCH_LUCKY_GRASS_CD_MS = 24 * 60 * 60 * 1000;
        var LANDLORD_RANCH_RING_CD_MS = 24 * 60 * 60 * 1000;

        function landlordRanchPad2(n) {
            var v = Math.floor(Number(n) || 0);
            return (v < 10 ? '0' : '') + v;
        }
        function landlordRanchTodayKey() {
            var d = new Date();
            return d.getFullYear() + '-' + landlordRanchPad2(d.getMonth() + 1) + '-' + landlordRanchPad2(d.getDate());
        }

        function landlordRanchDexSpeciesCount(r) {
            if (!r || !r.dexSeen || typeof r.dexSeen !== 'object') return 0;
            var keys = Object.keys(r.dexSeen);
            var n = 0;
            for (var i = 0; i < keys.length; i++) {
                var v = r.dexSeen[keys[i]];
                var num = typeof v === 'number' ? v : (v ? 1 : 0);
                if (num > 0) n++;
            }
            return n;
        }
        /** 牧光祝福：图鉴已解锁物种数越多，牧场产出额外倍率越高（仅影响牧场币结算） */
        function landlordRanchPastureLightMult(r) {
            var c = landlordRanchDexSpeciesCount(r);
            if (c >= 50) return 1.05;
            if (c >= 40) return 1.04;
            if (c >= 30) return 1.03;
            if (c >= 20) return 1.025;
            if (c >= 10) return 1.015;
            if (c >= 5) return 1.008;
            return 1;
        }

        function landlordRanchDailyFortuneMult(r) {
            if (!r || !r.dailyFortune || typeof r.dailyFortune !== 'object') return 1;
            if (String(r.dailyFortune.dayKey || '') !== landlordRanchTodayKey()) return 1;
            var m = Number(r.dailyFortune.mult);
            if (!Number.isFinite(m) || m < 1) return 1;
            return Math.min(1.1, Math.max(1.01, m));
        }

        function landlordRanchStarBuffMult(r) {
            if (!r || !r.starBuffDayKey || String(r.starBuffDayKey) !== landlordRanchTodayKey()) return 1;
            var ex = Number(r.starBuffUntil) || 0;
            if (ex <= Date.now()) return 1;
            var m = Number(r.starBuffMult);
            if (!Number.isFinite(m) || m < 1) return 1;
            return Math.min(1.06, Math.max(1.01, m));
        }

        function landlordRanchVisitorMult(r) {
            if (!r) return 1;
            var ex = Number(r.visitorBuffUntil) || 0;
            if (ex <= Date.now()) return 1;
            var m = Number(r.visitorYieldMult);
            if (!Number.isFinite(m) || m < 1) return 1;
            return Math.min(1.08, Math.max(1.01, m));
        }

        function landlordRanchGlobalYieldMult(r) {
            return landlordRanchPastureLightMult(r) * landlordRanchDailyFortuneMult(r) * landlordRanchStarBuffMult(r) * landlordRanchVisitorMult(r);
        }

        function landlordRanchPendingTreatMult(slot) {
            if (!slot) return 1;
            var m = Number(slot.pendingTreatMult);
            if (!Number.isFinite(m) || m < 1) return 1;
            return Math.min(1.15, m);
        }

        function landlordRanchRollVisitor(r, now) {
            if (!r || typeof player === 'undefined' || !player.landlord) return;
            var ts = now != null ? now : Date.now();
            if (!Number.isFinite(Number(r.visitorBuffUntil))) r.visitorBuffUntil = 0;
            if (Number(r.visitorBuffUntil) > ts) return;
            r.visitorYieldMult = 1;
            r.visitorName = '';
            r.visitorIcon = '';
            if (!Number.isFinite(Number(r._visitorNextTryAt)) || r._visitorNextTryAt <= 0) {
                r._visitorNextTryAt = ts + (20 + Math.random() * 40) * 60 * 1000;
            }
            if (ts < Number(r._visitorNextTryAt)) return;
            r._visitorNextTryAt = ts + (18 + Math.random() * 52) * 60 * 1000;
            if (Math.random() > 0.4) return;
            var V = [
                { n: '云游牧童', i: '🎒', m: 1.03 },
                { n: '送草老马', i: '🐴', m: 1.035 },
                { n: '铃鹿行商', i: '🔔', m: 1.042 },
                { n: '望尘道长', i: '☯️', m: 1.038 },
                { n: '花间小妖', i: '🧚', m: 1.048 },
                { n: '迷途画师', i: '🎨', m: 1.033 }
            ];
            var x = V[Math.floor(Math.random() * V.length)];
            r.visitorBuffUntil = ts + (35 + Math.random() * 42) * 60 * 1000;
            r.visitorYieldMult = x.m;
            r.visitorName = x.n;
            r.visitorIcon = x.i;
            ensureLandlordRanch(player.landlord);
            player.landlord.stats.ranchVisitorArrivals = (Number(player.landlord.stats.ranchVisitorArrivals) || 0) + 1;
            var tab = document.getElementById('landlordRanchTab');
            if (tab && tab.classList.contains('active')) {
                showLandlordNotification('牧场访客：「' + x.i + ' ' + x.n + '」路过，约 ' + Math.round((r.visitorBuffUntil - ts) / 60000) + ' 分钟内牧场产出 +' + Math.round((x.m - 1) * 1000) / 10 + '%', 'success');
            }
        }

        function landlordRanchYieldMultFromSlot(slot) {
            if (!slot || !Array.isArray(slot.pastureMood)) return 1;
            var n = slot.pastureMood.length;
            return 1 + n * LANDLORD_RANCH_PASTURE_YIELD_PER_TAG;
        }
        function landlordRanchCycleMultFromSlot(slot) {
            if (!slot || !Array.isArray(slot.pastureMood)) return 1;
            var n = slot.pastureMood.length;
            return Math.max(0.88, 1 - n * LANDLORD_RANCH_PASTURE_CYCLE_RED_PER_TAG);
        }
        var LANDLORD_RANCH_ANIMALS = (function () {
            var common = [
                ['chicken', '散养鸡', '🐔', '常见家禽。', 620],
                ['duck', '荷塘鸭', '🦆', '常见水禽。', 580],
                ['rabbit', '长毛兔', '🐰', '常见毛用。', 540],
                ['pig', '小香猪', '🐷', '常见肉用。', 500],
                ['bee', '蜂箱', '🐝', '常见采蜜。', 480],
                ['sheep', '绵羊', '🐑', '常见毛用。', 460],
                ['goat', '山羊', '🐐', '常见奶用。', 440],
                ['cow', '奶牛', '🐄', '常见奶用。', 420],
                ['horse', '踏青马', '🐎', '常见骑乘。', 400],
                ['goose', '大白鹅', '🦢', '常见看家。', 380],
                ['turkey', '火鸡', '🦃', '常见肉禽。', 360],
                ['deer', '梅花鹿', '🦌', '略珍。', 340],
                ['wbuf', '水牛', '🐃', '略珍。', 320],
                ['ostrich', '鸵鸟', '🐦', '略珍。', 300],
                ['camel', '双峰驼', '🐫', '略珍。', 285],
                ['yak', '牦牛', '🐂', '略珍。', 270],
                ['peacock', '蓝孔雀', '🦚', '略珍。', 255],
                ['pigeon', '信鸽', '🕊️', '略珍。', 240],
                ['quail', '鹌鹑', '🐣', '略珍。', 225],
                ['parrot', '鹦鹉', '🦜', '略珍。', 210],
                ['fox', '赤狐', '🦊', '略珍。', 198],
                ['donkey', '毛驴', '🐴', '略珍。', 186],
                ['llama', '羊驼', '🦙', '略珍。', 174],
                ['muskrat', '麝鼠', '🐀', '略珍。', 162],
                ['frog', '牛蛙', '🐸', '略珍。', 150],
                ['koi', '锦鲤', '🎏', '略珍。', 140],
                ['marmot', '土拨鼠', '🐹', '略珍。', 130],
                ['swan', '白天鹅', '🦢', '略珍。', 120],
                ['silkworm', '桑蚕', '🐛', '略珍。', 100]
            ];
            var rare = [
                ['r_cloudram', '云绒羊', '☁️', '稀有种。', 14],
                ['r_spiritfox', '灵狐', '🦊', '稀有种。', 13],
                ['r_mistele', '雾象', '🐘', '稀有种。', 12],
                ['r_rockturtle', '岩龟', '🐢', '稀有种。', 11],
                ['r_thunderbird', '雷鸟', '⚡', '稀有种。', 10],
                ['r_flamehoof', '炎蹄驹', '🔥', '稀有种。', 10],
                ['r_icewolf', '冰原狼', '❄️', '稀有种。', 9],
                ['r_sturtle', '星纹龟', '✨', '稀有种。', 9],
                ['r_moondeer', '月华鹿', '🌙', '稀有种。', 8],
                ['r_pearlclam', '珂海珠母', '🐚', '稀有种。', 8],
                ['r_stoneliz', '岩龙蜥', '🦎', '稀有种。', 7],
                ['r_goldroc', '金翅雏鹏', '🦅', '极稀。', 6],
                ['r_darkserp', '玄鳞蛇', '🐍', '极稀。', 6],
                ['r_whitetig', '雪纹虎崽', '🐯', '极稀。', 5],
                ['r_jadehare', '玉兔', '🐇', '极稀。', 5],
                ['r_colorluan', '彩鸾', '🐦', '极稀。', 5],
                ['r_jadefrog', '碧玉蟾', '🐸', '极稀。', 4],
                ['r_ironrhino', '铁甲犀', '🦏', '极稀。', 4],
                ['r_silverdeer', '银角鹿', '🦌', '极稀。', 4],
                ['r_purplemart', '紫金貂', '🟣', '极稀。', 3],
                ['r_jadesnail', '翡翠螺', '💚', '极稀。', 3],
                ['r_seahorse', '海龙马', '🐠', '极稀。', 3],
                ['r_shadowcat', '幽影猫', '🐈‍⬛', '极稀。', 2],
                ['r_glazebut', '琉璃蝶', '🦋', '极稀。', 2],
                ['r_flamelion', '赤焰狮崽', '🦁', '极稀。', 2],
                ['r_armorbear', '玄甲熊', '🐻', '极稀。', 2],
                ['r_frostcrane', '霜羽鹤', '🕊️', '极稀。', 2],
                ['r_stormleo', '雷霆豹', '🐆', '极稀。', 1],
                ['r_starfall', '星陨龟', '🌠', '传说级。', 1],
                ['r_dragonm', '龙涎兽', '🐉', '传说级。', 1]
            ];
            var rows = common.concat(rare);
            var nc = common.length;
            var nr = rows.length - nc;
            var lastIdx = rows.length - 1;
            var commonSumRaw = 0;
            for (var cix = 0; cix < nc; cix++) {
                commonSumRaw += 7200 * Math.pow(0.868, cix);
            }
            var rareFrontRaw = 0;
            for (var rjx = 0; rjx < nr - 1; rjx++) {
                rareFrontRaw += 38 * Math.pow(0.695, rjx);
            }
            // 常见/稀有两段按原始几何权重缩放；末位物种使用 W_DRAGON_FIXED，与 W_* 常量共同决定 pick 分布
            var W_COMMON_TARGET = 98000;
            var W_RARE_TOTAL_TARGET = 2000;
            var W_DRAGON_FIXED = 1;
            var W_RARE_FRONT_TARGET = W_RARE_TOTAL_TARGET - W_DRAGON_FIXED;
            var scaleC = commonSumRaw > 0 ? W_COMMON_TARGET / commonSumRaw : 1;
            var scaleR = rareFrontRaw > 0 ? W_RARE_FRONT_TARGET / rareFrontRaw : 1;
            var out = [];
            for (var i = 0; i < rows.length; i++) {
                var cycleH = 1 + (11 * i) / (rows.length - 1 || 1);
                var cycleMs = Math.round(LANDLORD_RANCH_HOUR_MS * cycleH);
                var reward = Math.round(2200 + (92000 - 2200) * i / (rows.length - 1 || 1));
                var dw;
                if (i < nc) {
                    dw = 7200 * Math.pow(0.868, i) * scaleC;
                } else if (i < lastIdx) {
                    dw = 38 * Math.pow(0.695, i - nc) * scaleR;
                } else {
                    dw = W_DRAGON_FIXED;
                }
                out.push({
                    id: rows[i][0],
                    name: rows[i][1],
                    icon: rows[i][2],
                    cycleMs: cycleMs,
                    reward: reward,
                    dropWeight: dw,
                    desc: rows[i][3] + ' 周期约 ' + (cycleMs / LANDLORD_RANCH_HOUR_MS).toFixed(1) + 'h。'
                });
            }
            return out;
        })();

        function ensureLandlordRanch(ll) {
            if (!ll) return;
            if (!ll.ranch || typeof ll.ranch !== 'object') ll.ranch = {};
            var r = ll.ranch;
            var us = parseInt(r.unlockedSlots, 10);
            if (!Number.isFinite(us) || us < 2) r.unlockedSlots = 2;
            if (r.unlockedSlots > LANDLORD_RANCH_MAX_SLOTS) r.unlockedSlots = LANDLORD_RANCH_MAX_SLOTS;
            if (!Array.isArray(r.slots) || r.slots.length !== LANDLORD_RANCH_MAX_SLOTS) {
                var prev = Array.isArray(r.slots) ? r.slots : [];
                r.slots = [];
                for (var i = 0; i < LANDLORD_RANCH_MAX_SLOTS; i++) {
                    r.slots.push(i < prev.length ? prev[i] : null);
                }
            }
            if (!r.dexSeen || typeof r.dexSeen !== 'object') r.dexSeen = {};
            if (!r.animalInventory || typeof r.animalInventory !== 'object') r.animalInventory = {};
            if (!Array.isArray(r.ranchProduceWarehouse)) r.ranchProduceWarehouse = [];
            if (r.lastLuckyGrassAt == null || !Number.isFinite(Number(r.lastLuckyGrassAt))) r.lastLuckyGrassAt = 0;
            if (r.lastRingAt == null || !Number.isFinite(Number(r.lastRingAt))) r.lastRingAt = 0;
            if (r.lastGlobalTickleAt == null || !Number.isFinite(Number(r.lastGlobalTickleAt))) r.lastGlobalTickleAt = 0;
            if (!r.animalInventoryLocked || typeof r.animalInventoryLocked !== 'object') r.animalInventoryLocked = {};
            if (!r.dailyFortune || typeof r.dailyFortune !== 'object') r.dailyFortune = {};
            if (r.starBuffUntil == null || !Number.isFinite(Number(r.starBuffUntil))) r.starBuffUntil = 0;
            if (r.starBuffMult == null || !Number.isFinite(Number(r.starBuffMult))) r.starBuffMult = 1;
            if (r.visitorBuffUntil == null || !Number.isFinite(Number(r.visitorBuffUntil))) r.visitorBuffUntil = 0;
            landlordRanchNormalizeInventoryAndDex(r);
            for (var rsi = 0; rsi < r.slots.length; rsi++) {
                var rsl = r.slots[rsi];
                if (rsl && rsl.animalId) {
                    var sp0 = Math.floor(Number(rsl.stockpile) || 0);
                    if (sp0 > LANDLORD_RANCH_STOCKPILE_CAP) rsl.stockpile = LANDLORD_RANCH_STOCKPILE_CAP;
                    else if (sp0 < 0) rsl.stockpile = 0;
                    if (!Array.isArray(rsl.pastureMood)) rsl.pastureMood = [];
                    if (rsl.lastTickleAt == null || !Number.isFinite(Number(rsl.lastTickleAt))) rsl.lastTickleAt = 0;
                    var ptm = Number(rsl.pendingTreatMult);
                    if (!Number.isFinite(ptm) || ptm < 1) rsl.pendingTreatMult = 1;
                }
            }
            if (!ll.stats) return;
            if (ll.stats.ranchCoinsEarned == null || !Number.isFinite(Number(ll.stats.ranchCoinsEarned))) ll.stats.ranchCoinsEarned = 0;
            if (ll.stats.ranchHarvests == null || !Number.isFinite(Number(ll.stats.ranchHarvests))) ll.stats.ranchHarvests = 0;
            if (ll.stats.ranchVisitorArrivals == null || !Number.isFinite(Number(ll.stats.ranchVisitorArrivals))) ll.stats.ranchVisitorArrivals = 0;
            if (ll.stats.ranchTickleCount == null || !Number.isFinite(Number(ll.stats.ranchTickleCount))) ll.stats.ranchTickleCount = 0;
            if (ll.stats.ranchLuckyGrassCount == null || !Number.isFinite(Number(ll.stats.ranchLuckyGrassCount))) ll.stats.ranchLuckyGrassCount = 0;
            if (ll.stats.ranchRingGames == null || !Number.isFinite(Number(ll.stats.ranchRingGames))) ll.stats.ranchRingGames = 0;
            if (ll.stats.ranchStarSpins == null || !Number.isFinite(Number(ll.stats.ranchStarSpins))) ll.stats.ranchStarSpins = 0;
        }

        function getLandlordRanchAnimalDef(animalId) {
            for (var i = 0; i < LANDLORD_RANCH_ANIMALS.length; i++) {
                if (LANDLORD_RANCH_ANIMALS[i].id === animalId) return LANDLORD_RANCH_ANIMALS[i];
            }
            return null;
        }

        function landlordRanchFormatRemain(ms) {
            var v = Math.max(0, Math.ceil(ms / 1000));
            if (v <= 0) return '即将出批';
            var d = Math.floor(v / 86400);
            v -= d * 86400;
            var h = Math.floor(v / 3600);
            v -= h * 3600;
            var m = Math.floor(v / 60);
            var s = v % 60;
            var z2 = function (n) { return (n < 10 ? '0' : '') + n; };
            if (d > 0) return d + '天' + h + '时';
            if (h > 0) return h + ':' + z2(m) + ':' + z2(s);
            return m + ':' + z2(s);
        }

        function updateLandlordRanchPenTimers() {
            if (typeof player === 'undefined' || !player.landlord) return;
            var tab = document.getElementById('landlordRanchTab');
            if (!tab || !tab.classList.contains('active')) return;
            ensureLandlordRanch(player.landlord);
            landlordRanchSimulateToNow();
            var now = Date.now();
            var r = player.landlord.ranch;
            var cap = LANDLORD_RANCH_STOCKPILE_CAP;
            for (var si = 0; si < r.unlockedSlots; si++) {
                var slot = r.slots[si];
                var cdEl = document.getElementById('ranchPenCd-' + si);
                var barEl = document.getElementById('ranchPenBar-' + si);
                var penEl = document.getElementById('ranchPenCard-' + si);
                if (!slot || !slot.animalId) {
                    if (cdEl) cdEl.textContent = '—';
                    if (barEl) barEl.style.width = '0%';
                    if (penEl) penEl.classList.remove('landlord-ranch-pen--full');
                    continue;
                }
                var def = getLandlordRanchAnimalDef(slot.animalId);
                if (!def) {
                    if (cdEl) cdEl.textContent = '—';
                    continue;
                }
                var st = Math.min(cap, Math.floor(Number(slot.stockpile) || 0));
                var na = Number(slot.nextHarvestAt);
                if (cdEl) {
                    if (st >= cap) {
                        cdEl.textContent = '囤满 · 请收取';
                        cdEl.classList.add('ranch-pen-countdown--full');
                    } else {
                        cdEl.classList.remove('ranch-pen-countdown--full');
                        var rem = (Number.isFinite(na) ? na : 0) - now;
                        cdEl.textContent = rem <= 0 ? '即将出批' : landlordRanchFormatRemain(rem);
                    }
                }
                if (barEl) barEl.style.width = (100 * st / cap) + '%';
                if (penEl) {
                    if (st >= cap) penEl.classList.add('landlord-ranch-pen--full');
                    else penEl.classList.remove('landlord-ranch-pen--full');
                }
                var estEl = document.getElementById('ranchPenEst-' + si);
                if (estEl) {
                    var q = Math.min(8, Math.max(1, parseInt(slot.quality, 10) || 1));
                    var mult = LANDLORD_RANCH_QUALITY_MULT[q - 1] || 1;
                    var pm = landlordRanchYieldMultFromSlot(slot);
                    var gm = landlordRanchGlobalYieldMult(r);
                    var tm = landlordRanchPendingTreatMult(slot);
                    estEl.textContent = formatNumber(Math.floor(st * def.reward * mult * pm * gm * tm));
                }
            }
        }

        function landlordRanchInvKey(animalId, quality) {
            var q = Math.min(8, Math.max(1, parseInt(quality, 10) || 1));
            return animalId + ':' + q;
        }

        function landlordRanchSumProduceWarehouseBatches(r) {
            var arr = r && r.ranchProduceWarehouse;
            if (!Array.isArray(arr)) return 0;
            var s = 0;
            for (var i = 0; i < arr.length; i++) {
                var row = arr[i];
                if (!row) continue;
                s += Math.max(0, Math.floor(Number(row.batches) || 0));
            }
            return s;
        }

        function landlordRanchSumAnimalInventory(r) {
            var inv = r && r.animalInventory;
            if (!inv || typeof inv !== 'object') return 0;
            var keys = Object.keys(inv);
            var s = 0;
            for (var i = 0; i < keys.length; i++) {
                s += Math.max(0, Math.floor(Number(inv[keys[i]]) || 0));
            }
            return s;
        }

        function landlordRanchProduceWarehouseSpace(r) {
            return Math.max(0, LANDLORD_RANCH_PRODUCE_WAREHOUSE_MAX_BATCHES - landlordRanchSumProduceWarehouseBatches(r));
        }

        function landlordRanchAnimalInventorySpace(r) {
            return Math.max(0, LANDLORD_RANCH_ANIMAL_INVENTORY_MAX - landlordRanchSumAnimalInventory(r));
        }

        function landlordRanchNormalizeInventoryAndDex(r) {
            var inv = r.animalInventory;
            if (!inv || typeof inv !== 'object') return;
            var next = {};
            var k = Object.keys(inv);
            for (var i = 0; i < k.length; i++) {
                var key = k[i];
                var val = Math.floor(Number(inv[key]) || 0);
                if (val <= 0) continue;
                if (key.indexOf(':') >= 0) {
                    next[key] = (next[key] || 0) + val;
                } else {
                    var nk = landlordRanchInvKey(key, 1);
                    next[nk] = (next[nk] || 0) + val;
                }
            }
            r.animalInventory = next;
            var ds = r.dexSeen;
            if (!ds || typeof ds !== 'object') return;
            var nk2 = Object.keys(ds);
            for (var j = 0; j < nk2.length; j++) {
                var aid = nk2[j];
                if (aid.indexOf(':') >= 0) continue;
                var v = ds[aid];
                if (v === true) ds[aid] = 1;
            }
        }

        function pickRanchAnimalQualityTier() {
            var t = Math.random();
            var c = 0;
            for (var i = 0; i < LANDLORD_RANCH_QUALITY_WEIGHTS.length; i++) {
                c += LANDLORD_RANCH_QUALITY_WEIGHTS[i];
                if (t <= c) return i + 1;
            }
            return 8;
        }

        function pickWeightedRanchAnimalDef() {
            var arr = LANDLORD_RANCH_ANIMALS;
            if (!arr.length) return null;
            var tw = 0;
            for (var i = 0; i < arr.length; i++) {
                tw += Math.max(1e-6, Number(arr[i].dropWeight) || 1e-6);
            }
            var rnd = Math.random() * tw;
            var s = 0;
            for (var j = 0; j < arr.length; j++) {
                s += Math.max(1e-6, Number(arr[j].dropWeight) || 1e-6);
                if (rnd <= s) return arr[j];
            }
            return arr[0];
        }

        function landlordRanchGrantOneFromLottery() {
            var def = pickWeightedRanchAnimalDef();
            if (!def) return { label: '?', animalId: '', quality: 1 };
            var q = pickRanchAnimalQualityTier();
            landlordRanchAddAnimalInventory(def.id, 1, q);
            var qn = LANDLORD_RANCH_QUALITY_NAMES[q - 1] || ('Q' + q);
            return { label: def.icon + def.name + '·' + qn, animalId: def.id, quality: q };
        }

        function landlordRanchSumInventoryForAnimal(r, animalId) {
            var s = 0;
            for (var qi = 1; qi <= 8; qi++) {
                s += Math.floor((r.animalInventory && r.animalInventory[landlordRanchInvKey(animalId, qi)]) || 0);
            }
            return s;
        }

        function landlordRanchAddAnimalInventory(animalId, amount, quality) {
            if (typeof player === 'undefined' || !player.landlord || !animalId) return false;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            if (!r.animalInventory) r.animalInventory = {};
            var n = Math.max(1, Math.floor(Number(amount) || 1));
            var space = landlordRanchAnimalInventorySpace(r);
            if (space < 1) {
                showLandlordNotification('动物库存已满（' + LANDLORD_RANCH_ANIMAL_INVENTORY_MAX + ' 头），请先卖出或放养后再来。', 'warning');
                return false;
            }
            n = Math.min(n, space);
            var q = quality != null ? parseInt(quality, 10) : pickRanchAnimalQualityTier();
            if (!Number.isFinite(q) || q < 1) q = 1;
            if (q > 8) q = 8;
            var key = landlordRanchInvKey(animalId, q);
            r.animalInventory[key] = (r.animalInventory[key] || 0) + n;
            landlordRanchMarkDex(animalId, q);
            return true;
        }

        /** 牧场仓库：按份出售库存动物（与放养共用 animalInventory），单价≈基础每批×品质×全局牧场加成 */
        function landlordRanchInventorySelectOptionsHtml(r) {
            var html = '';
            var optAdded = 0;
            for (var ai = 0; ai < LANDLORD_RANCH_ANIMALS.length; ai++) {
                var ad = LANDLORD_RANCH_ANIMALS[ai];
                for (var qq = 8; qq >= 1; qq--) {
                    var ikk = landlordRanchInvKey(ad.id, qq);
                    var invn = (r.animalInventory && r.animalInventory[ikk]) || 0;
                    if (invn < 1) continue;
                    optAdded++;
                    var qnm = LANDLORD_RANCH_QUALITY_NAMES[qq - 1] || ('' + qq);
                    html += '<option value="' + ad.id + ':' + qq + '">' + ad.icon + ' ' + ad.name + ' · ' + qnm + ' ×' + invn + '</option>';
                }
            }
            if (optAdded === 0) {
                html += '<option value="" disabled>暂无库存（请先抽奖）</option>';
            }
            return html;
        }

        function landlordRanchWarehouseUnitPrice(invKey) {
            if (typeof player === 'undefined' || !player.landlord) return 0;
            var li = String(invKey).lastIndexOf(':');
            if (li < 0) return 0;
            var aid = String(invKey).slice(0, li);
            var q = parseInt(String(invKey).slice(li + 1), 10);
            if (!Number.isFinite(q) || q < 1) q = 1;
            if (q > 8) q = 8;
            var def = getLandlordRanchAnimalDef(aid);
            if (!def) return 0;
            var mult = LANDLORD_RANCH_QUALITY_MULT[q - 1] || 1;
            ensureLandlordRanch(player.landlord);
            var g = landlordRanchGlobalYieldMult(player.landlord.ranch);
            return Math.max(1, Math.floor(Number(def.reward) * mult * g));
        }

        function landlordRanchSellWarehouseStack(invKey, amount) {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            if (!r.animalInventory) return;
            if (r.animalInventoryLocked && r.animalInventoryLocked[invKey]) {
                showLandlordNotification('该条动物库存已锁定，请先解锁再卖。', 'info');
                return;
            }
            var n0 = Math.floor(Number(r.animalInventory[invKey]) || 0);
            if (n0 < 1) {
                showLandlordNotification('该条库存已不足。', 'info');
                renderLandlordRanch();
                return;
            }
            var sellN = amount === 'all' || amount === -1 ? n0 : Math.min(n0, Math.max(1, Math.floor(Number(amount) || 1)));
            var unit = landlordRanchWarehouseUnitPrice(invKey);
            var total = unit * sellN;
            r.animalInventory[invKey] = n0 - sellN;
            if (r.animalInventory[invKey] <= 0) delete r.animalInventory[invKey];
            landlordRanchGrantCoins(total, 0);
            var li = String(invKey).lastIndexOf(':');
            var aid = li >= 0 ? String(invKey).slice(0, li) : '';
            var def = getLandlordRanchAnimalDef(aid);
            var label = def ? (String(def.icon || '') + String(def.name || '').replace(/</g, '')) : String(invKey).replace(/</g, '');
            showLandlordNotification('牧场仓库：已出售 ' + sellN + ' 份「' + label + '」库存，+' + formatNumber(total) + ' 地主币', 'success');
            updateLandlordCoinDisplay();
            updateLandlordStats();
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchSellWarehouseBtn(btn, mode) {
            if (!btn) return;
            var k = decodeURIComponent(btn.getAttribute('data-ranch-inv') || '');
            if (!k) return;
            landlordRanchSellWarehouseStack(k, mode === 'all' ? 'all' : 1);
        }

        function landlordRanchSellAllWarehouseStock() {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            var inv = r.animalInventory;
            if (!inv || typeof inv !== 'object') {
                showLandlordNotification('牧场仓库为空。', 'info');
                return;
            }
            var keys = Object.keys(inv);
            var snap = {};
            for (var si = 0; si < keys.length; si++) {
                var sk = keys[si];
                var sc = Math.floor(Number(inv[sk]) || 0);
                if (sc >= 1) snap[sk] = sc;
            }
            var grand = 0;
            var parts = 0;
            var kept = {};
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var cnt = snap[key];
                if (!cnt) continue;
                if (r.animalInventoryLocked && r.animalInventoryLocked[key]) {
                    kept[key] = cnt;
                    continue;
                }
                var u = landlordRanchWarehouseUnitPrice(key);
                grand += u * cnt;
                parts += cnt;
            }
            if (grand <= 0 || parts <= 0) {
                showLandlordNotification('牧场仓库没有可出售的库存（未锁定部分为空）。', 'info');
                return;
            }
            r.animalInventory = kept;
            landlordRanchGrantCoins(grand, 0);
            var remKinds = Object.keys(kept).length;
            var tailInv = remKinds > 0 ? '（已保留 ' + remKinds + ' 条锁定库存）' : '';
            showLandlordNotification('牧场仓库：一键卖出共 ' + parts + ' 份动物库存，+' + formatNumber(grand) + ' 地主币' + tailInv, 'success');
            updateLandlordCoinDisplay();
            updateLandlordStats();
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchMarkDex(animalId, quality) {
            if (typeof player === 'undefined' || !player.landlord || !player.landlord.ranch) return;
            var q = Math.min(8, Math.max(1, parseInt(quality, 10) || 1));
            var prev = player.landlord.ranch.dexSeen[animalId];
            var num = typeof prev === 'number' ? prev : (prev ? 1 : 0);
            player.landlord.ranch.dexSeen[animalId] = Math.max(num, q);
        }

        function landlordRanchSimulateToNow() {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            var now = Date.now();
            var r = player.landlord.ranch;
            var cap = LANDLORD_RANCH_STOCKPILE_CAP;
            for (var si = 0; si < r.unlockedSlots; si++) {
                var slot = r.slots[si];
                if (!slot || !slot.animalId) continue;
                var def = getLandlordRanchAnimalDef(slot.animalId);
                if (!def) continue;
                var cycle = Math.round(def.cycleMs * landlordRanchCycleMultFromSlot(slot));
                if (cycle < 60000) cycle = 60000;
                var stock = Math.min(Math.max(0, Math.floor(Number(slot.stockpile) || 0)), cap);
                var nextAt = Number(slot.nextHarvestAt);
                if (!Number.isFinite(nextAt) || nextAt <= 0) {
                    slot.nextHarvestAt = now + cycle;
                    slot.stockpile = stock;
                    continue;
                }
                var guard = 0;
                while (now >= nextAt && stock < cap && guard < 8000) {
                    stock++;
                    nextAt += cycle;
                    guard++;
                }
                slot.stockpile = stock;
                slot.nextHarvestAt = nextAt;
            }
            landlordRanchRollVisitor(r, now);
        }

        function landlordRanchGrantCoins(addCoins, harvestCount) {
            addCoins = Math.floor(Number(addCoins) || 0);
            harvestCount = Math.floor(Number(harvestCount) || 0);
            if (addCoins > 0) {
                player.landlord.coins += addCoins;
                player.landlord.stats.totalCoinsEarned += addCoins;
                player.landlord.stats.ranchCoinsEarned = (Number(player.landlord.stats.ranchCoinsEarned) || 0) + addCoins;
            }
            if (harvestCount > 0) {
                player.landlord.stats.ranchHarvests = (Number(player.landlord.stats.ranchHarvests) || 0) + harvestCount;
            }
        }

        function landlordRanchPushProduceWarehouse(animalId, quality, batches, coinValue, pastureMoodsAtHarvest) {
            if (typeof player === 'undefined' || !player.landlord) return false;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            if (!Array.isArray(r.ranchProduceWarehouse)) r.ranchProduceWarehouse = [];
            var b = Math.floor(Number(batches) || 0);
            var c = Math.floor(Number(coinValue) || 0);
            if (b < 1 || c < 1) return false;
            var space = landlordRanchProduceWarehouseSpace(r);
            if (space < 1) {
                showLandlordNotification('待售产出已满（' + LANDLORD_RANCH_PRODUCE_WAREHOUSE_MAX_BATCHES + ' 批），请先卖出后再收取。', 'warning');
                return false;
            }
            if (b > space) {
                showLandlordNotification('待售产出仅剩 ' + space + ' 批空间（上限 ' + LANDLORD_RANCH_PRODUCE_WAREHOUSE_MAX_BATCHES + ' 批），请先卖出部分后再收取。', 'warning');
                return false;
            }
            var q = Math.min(8, Math.max(1, parseInt(quality, 10) || 1));
            var moodArr = [];
            if (Array.isArray(pastureMoodsAtHarvest)) {
                for (var mi = 0; mi < pastureMoodsAtHarvest.length; mi++) {
                    var mv = pastureMoodsAtHarvest[mi];
                    if (mv == null || mv === '') continue;
                    moodArr.push(String(mv));
                }
            }
            r.ranchProduceWarehouse.push({
                animalId: String(animalId || ''),
                quality: q,
                batches: b,
                coinValue: c,
                pastureMoods: moodArr
            });
            return true;
        }

        function landlordRanchSellProduceWarehouseAt(idx, modeAll) {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            var arr = r.ranchProduceWarehouse;
            if (!Array.isArray(arr) || idx < 0 || idx >= arr.length) return;
            var e = arr[idx];
            if (!e || e.batches < 1 || e.coinValue < 1) return;
            if (e.locked) {
                showLandlordNotification('该行待售产出已锁定，请先解锁再卖。', 'info');
                return;
            }
            var gain;
            if (modeAll) {
                gain = Math.floor(Number(e.coinValue) || 0);
                arr.splice(idx, 1);
            } else {
                gain = Math.floor(Number(e.coinValue) / e.batches);
                e.batches--;
                e.coinValue -= gain;
                if (e.batches < 1 || e.coinValue < 1) arr.splice(idx, 1);
            }
            if (gain < 1) {
                renderLandlordRanch();
                return;
            }
            landlordRanchGrantCoins(gain, 0);
            showLandlordNotification('牧场仓库：已出售待售产出，+' + formatNumber(gain) + ' 地主币', 'success');
            updateLandlordCoinDisplay();
            updateLandlordStats();
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchSellProduceWarehouseBtn(btn, mode) {
            if (!btn) return;
            var idx = parseInt(btn.getAttribute('data-ranch-produce-i'), 10);
            if (!Number.isFinite(idx)) return;
            landlordRanchSellProduceWarehouseAt(idx, mode === 'all');
        }

        function landlordRanchSellAllProduceWarehouseStock() {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            var arr = r.ranchProduceWarehouse;
            if (!Array.isArray(arr) || arr.length < 1) {
                showLandlordNotification('暂无待售栏内产出。', 'info');
                return;
            }
            var sum = 0;
            var kept = [];
            var lockedLeft = 0;
            for (var i = 0; i < arr.length; i++) {
                var row = arr[i];
                if (!row || row.batches < 1) continue;
                if (row.locked) {
                    kept.push(row);
                    lockedLeft++;
                    continue;
                }
                sum += Math.floor(Number(row.coinValue) || 0);
            }
            if (sum < 1) {
                showLandlordNotification('没有可一键卖出的待售产出（可能已全部锁定）。', 'info');
                return;
            }
            r.ranchProduceWarehouse = kept;
            landlordRanchGrantCoins(sum, 0);
            var tail = lockedLeft > 0 ? '（已保留 ' + lockedLeft + ' 条锁定行）' : '';
            showLandlordNotification('牧场仓库：一键卖光未锁定待售产出，+' + formatNumber(sum) + ' 地主币' + tail, 'success');
            updateLandlordCoinDisplay();
            updateLandlordStats();
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchHarvestSlot(slotIndex) {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            landlordRanchSimulateToNow();
            var r = player.landlord.ranch;
            if (slotIndex < 0 || slotIndex >= r.unlockedSlots) return;
            var slot = r.slots[slotIndex];
            if (!slot || !slot.animalId) {
                showLandlordNotification('该栏位没有饲养动物。', 'info');
                return;
            }
            var def = getLandlordRanchAnimalDef(slot.animalId);
            if (!def) return;
            var n = Math.floor(Number(slot.stockpile) || 0);
            if (n <= 0) {
                showLandlordNotification('产出尚未就绪，请稍后再来收取。', 'info');
                return;
            }
            var q = Math.min(8, Math.max(1, parseInt(slot.quality, 10) || 1));
            var mult = LANDLORD_RANCH_QUALITY_MULT[q - 1] || 1;
            var pastureMult = landlordRanchYieldMultFromSlot(slot);
            var gMult = landlordRanchGlobalYieldMult(r);
            var tMult = landlordRanchPendingTreatMult(slot);
            var coins = Math.floor(n * def.reward * mult * pastureMult * gMult * tMult);
            var moodSnap = Array.isArray(slot.pastureMood) ? slot.pastureMood.slice() : [];
            if (!landlordRanchPushProduceWarehouse(slot.animalId, q, n, coins, moodSnap)) {
                renderLandlordRanch();
                return;
            }
            slot.stockpile = 0;
            slot.pendingTreatMult = 1;
            slot.pastureMood = [];
            landlordRanchGrantCoins(0, n);
            var qn = LANDLORD_RANCH_QUALITY_NAMES[q - 1] || '';
            showLandlordNotification('栏位' + (slotIndex + 1) + ' 已收取 ' + n + ' 批「' + def.name + '·' + qn + '」至牧场仓库（待售约 ' + formatNumber(coins) + ' 地主币），草场合鸣已清空', 'success');
            updateLandlordCoinDisplay();
            updateLandlordStats();
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchHarvestAll() {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            landlordRanchSimulateToNow();
            var r = player.landlord.ranch;
            var totalCoins = 0;
            var totalN = 0;
            var blocked = false;
            for (var si = 0; si < r.unlockedSlots; si++) {
                var slot = r.slots[si];
                if (!slot || !slot.animalId) continue;
                var def = getLandlordRanchAnimalDef(slot.animalId);
                if (!def) continue;
                var n = Math.floor(Number(slot.stockpile) || 0);
                if (n <= 0) continue;
                var q2 = Math.min(8, Math.max(1, parseInt(slot.quality, 10) || 1));
                var mult2 = LANDLORD_RANCH_QUALITY_MULT[q2 - 1] || 1;
                var pastureMult2 = landlordRanchYieldMultFromSlot(slot);
                var gMult2 = landlordRanchGlobalYieldMult(r);
                var tMult2 = landlordRanchPendingTreatMult(slot);
                var lineCoins = Math.floor(n * def.reward * mult2 * pastureMult2 * gMult2 * tMult2);
                var moodSnapAll = Array.isArray(slot.pastureMood) ? slot.pastureMood.slice() : [];
                if (!landlordRanchPushProduceWarehouse(slot.animalId, q2, n, lineCoins, moodSnapAll)) {
                    blocked = true;
                    break;
                }
                totalCoins += lineCoins;
                totalN += n;
                slot.stockpile = 0;
                slot.pendingTreatMult = 1;
                slot.pastureMood = [];
            }
            if (totalN <= 0) {
                if (!blocked) showLandlordNotification('当前没有可收取的牧场产出。', 'info');
                return;
            }
            landlordRanchGrantCoins(0, totalN);
            if (blocked) {
                showLandlordNotification('一键收取：已收取 ' + totalN + ' 批（待售约 ' + formatNumber(totalCoins) + ' 地主币）；待售仓库已满，其余请先卖出后再收。', 'warning');
            } else {
                showLandlordNotification('一键收取：共 ' + totalN + ' 批产出已进入牧场仓库（待售约 ' + formatNumber(totalCoins) + ' 地主币），各栏草场合鸣已清空', 'success');
            }
            updateLandlordCoinDisplay();
            updateLandlordStats();
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchPlaceAnimal(slotIndex, invKey) {
            if (typeof player === 'undefined' || !player.landlord || !invKey) return;
            ensureLandlordRanch(player.landlord);
            var li = String(invKey).lastIndexOf(':');
            var animalId = li >= 0 ? String(invKey).slice(0, li) : String(invKey);
            var quality = li >= 0 ? parseInt(String(invKey).slice(li + 1), 10) : 1;
            if (!Number.isFinite(quality) || quality < 1) quality = 1;
            if (quality > 8) quality = 8;
            var def = getLandlordRanchAnimalDef(animalId);
            if (!def) return;
            var r = player.landlord.ranch;
            if (slotIndex < 0 || slotIndex >= r.unlockedSlots) {
                showLandlordNotification('栏位无效或未解锁。', 'error');
                return;
            }
            if (r.slots[slotIndex]) {
                showLandlordNotification('该栏已有动物，请先迁出。', 'warning');
                return;
            }
            var ikey = landlordRanchInvKey(animalId, quality);
            var inv = (r.animalInventory && r.animalInventory[ikey]) || 0;
            if (inv < 1) {
                showLandlordNotification('该品质库存不足！请通过「果实抽奖」获得（约10%池；动物与品质均为加权，越稀有越低）。', 'warning');
                return;
            }
            r.animalInventory[ikey] = inv - 1;
            var newSlot = {
                animalId: animalId,
                quality: quality,
                nextHarvestAt: 0,
                stockpile: 0,
                pastureMood: [],
                lastTickleAt: 0,
                pendingTreatMult: 1
            };
            var c0 = Math.round(def.cycleMs * landlordRanchCycleMultFromSlot(newSlot));
            if (c0 < 60000) c0 = 60000;
            newSlot.nextHarvestAt = Date.now() + c0;
            r.slots[slotIndex] = newSlot;
            landlordRanchMarkDex(animalId, quality);
            var qn = LANDLORD_RANCH_QUALITY_NAMES[quality - 1] || '';
            showLandlordNotification('已在栏位' + (slotIndex + 1) + ' 放养「' + def.name + '·' + qn + '」', 'success');
            updateLandlordCoinDisplay();
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchEvacuateSlot(slotIndex) {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            landlordRanchSimulateToNow();
            var r = player.landlord.ranch;
            if (slotIndex < 0 || slotIndex >= r.unlockedSlots) return;
            var slot = r.slots[slotIndex];
            if (!slot || !slot.animalId) return;
            var n = Math.floor(Number(slot.stockpile) || 0);
            if (n > 0) {
                showLandlordNotification('请先收取栏内产出，再迁出动物。', 'warning');
                return;
            }
            var aid = slot.animalId;
            var qv = Math.min(8, Math.max(1, parseInt(slot.quality, 10) || 1));
            var def = getLandlordRanchAnimalDef(aid);
            if (!landlordRanchAddAnimalInventory(aid, 1, qv)) return;
            r.slots[slotIndex] = null;
            var qn2 = LANDLORD_RANCH_QUALITY_NAMES[qv - 1] || '';
            showLandlordNotification('已迁出' + (def ? '「' + def.name + '·' + qn2 + '」' : '') + '，已退回同品质库存 ×1', 'info');
            updateLandlordCoinDisplay();
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchUnlockSlot() {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            if (r.unlockedSlots >= LANDLORD_RANCH_MAX_SLOTS) {
                showLandlordNotification('牧场栏位已达上限（' + LANDLORD_RANCH_MAX_SLOTS + '）。', 'info');
                return;
            }
            var nextSlot = r.unlockedSlots + 1;
            var cost = landlordRanchUnlockCost(nextSlot);
            if (cost == null) return;
            if (player.landlord.coins < cost) {
                showLandlordNotification('解锁下一栏需要 ' + formatNumber(cost) + ' 地主币', 'error');
                return;
            }
            player.landlord.coins -= cost;
            r.unlockedSlots = nextSlot;
            showLandlordNotification('已解锁牧场栏位 ' + nextSlot + ' / ' + LANDLORD_RANCH_MAX_SLOTS, 'success');
            updateLandlordCoinDisplay();
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchDrawDailyFortune() {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            var tk = landlordRanchTodayKey();
            if (r.dailyFortune && String(r.dailyFortune.dayKey) === tk && Number(r.dailyFortune.mult) > 1) {
                showLandlordNotification('今日牧签已抽：「' + (r.dailyFortune.icon || '') + ' ' + (r.dailyFortune.title || '吉') + '」≈ +' + Math.round((Number(r.dailyFortune.mult) - 1) * 1000) / 10 + '%', 'info');
                return;
            }
            var names = ['丰壤', '晨练', '甘霖', '悸动', '鹿鸣', '星坠', '小确幸'];
            var icons = ['🌾', '🏃', '💧', '💓', '🦌', '⭐', '🎐'];
            var idx = Math.floor(Math.random() * names.length);
            var mult = Math.round((1.02 + Math.random() * 0.064) * 1000) / 1000;
            r.dailyFortune = { dayKey: tk, mult: mult, title: names[idx], icon: icons[idx] };
            showLandlordNotification('今日牧签：「' + icons[idx] + ' ' + names[idx] + '」本日收取牧场 +' + Math.round((mult - 1) * 1000) / 10 + '%', 'success');
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchConstellationSpin() {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            var tk = landlordRanchTodayKey();
            if (String(r.starBuffDayKey || '') === tk) {
                showLandlordNotification('今日星象小转已用过，明日再来～', 'info');
                return;
            }
            var end = new Date();
            end.setHours(23, 59, 59, 999);
            r.starBuffDayKey = tk;
            r.starBuffMult = Math.round((1.022 + Math.random() * 0.028) * 1000) / 1000;
            r.starBuffUntil = end.getTime();
            player.landlord.stats.ranchStarSpins = (Number(player.landlord.stats.ranchStarSpins) || 0) + 1;
            showLandlordNotification('星象小转：至今日结束前牧场再 +' + Math.round((r.starBuffMult - 1) * 1000) / 10 + '% 产出', 'success');
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchTouchLuckyGrass() {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            landlordRanchSimulateToNow();
            var r = player.landlord.ranch;
            var now = Date.now();
            if (r.lastLuckyGrassAt && now - r.lastLuckyGrassAt < LANDLORD_RANCH_LUCKY_GRASS_CD_MS) {
                showLandlordNotification('幸运牧草冷却：' + landlordRanchFormatRemain(LANDLORD_RANCH_LUCKY_GRASS_CD_MS - (now - r.lastLuckyGrassAt)), 'info');
                return;
            }
            r.lastLuckyGrassAt = now;
            player.landlord.stats.ranchLuckyGrassCount = (Number(player.landlord.stats.ranchLuckyGrassCount) || 0) + 1;
            var u = Math.random();
            if (u < 0.28) {
                var bonus = 4000 + Math.floor(Math.random() * 36000);
                landlordRanchGrantCoins(bonus, 0);
                showLandlordNotification('幸运牧草：刨出 ' + formatNumber(bonus) + ' 地主币！', 'success');
            } else if (u < 0.48) {
                if (Number(r.visitorBuffUntil) > now) {
                    r.visitorBuffUntil = Number(r.visitorBuffUntil) + 12 * 60 * 1000;
                    showLandlordNotification('幸运牧草：访客愿意多留 12 分钟～', 'success');
                } else {
                    for (var a = 0; a < r.unlockedSlots; a++) {
                        var sl = r.slots[a];
                        if (sl && sl.animalId) {
                            sl.pendingTreatMult = Math.min(1.12, Math.round((Number(sl.pendingTreatMult) || 1) * 1.035 * 1000) / 1000);
                        }
                    }
                    showLandlordNotification('幸运牧草：全栏动物蹭蹭你，下次收取略多一点～', 'success');
                }
            } else if (u < 0.68) {
                showLandlordNotification('幸运牧草：风吹草低…今天什么也没捡到，但动物很开心', 'info');
            } else if (u < 0.82 && r.dailyFortune && String(r.dailyFortune.dayKey) === landlordRanchTodayKey()) {
                r.dailyFortune.mult = Math.min(1.1, Math.round(((Number(r.dailyFortune.mult) || 1) + 0.008) * 1000) / 1000);
                showLandlordNotification('幸运牧草：牧签微微发亮，今日加成略涨～', 'success');
            } else {
                showLandlordNotification('幸运牧草：风吹草低…今天什么也没捡到，但动物很开心', 'info');
            }
            updateLandlordCoinDisplay();
            updateLandlordStats();
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchRingToss(guess) {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            var g = parseInt(guess, 10);
            if (!Number.isFinite(g) || g < 1 || g > 3) return;
            var now = Date.now();
            if (r.lastRingAt && now - r.lastRingAt < LANDLORD_RANCH_RING_CD_MS) {
                showLandlordNotification('牧圈三桩冷却：' + landlordRanchFormatRemain(LANDLORD_RANCH_RING_CD_MS - (now - r.lastRingAt)), 'info');
                return;
            }
            r.lastRingAt = now;
            player.landlord.stats.ranchRingGames = (Number(player.landlord.stats.ranchRingGames) || 0) + 1;
            var ans = 1 + Math.floor(Math.random() * 3);
            if (g === ans) {
                var pay = 12000 + Math.floor(Math.random() * 70000);
                landlordRanchGrantCoins(pay, 0);
                showLandlordNotification('套圈中靶！+' + formatNumber(pay) + ' 地主币（幸运桩 #' + ans + '）', 'success');
            } else {
                showLandlordNotification('套圈擦边而过…答案在 #' + ans + ' 号桩，下次再来！', 'info');
            }
            updateLandlordCoinDisplay();
            updateLandlordStats();
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchTickleGlobal() {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            landlordRanchSimulateToNow();
            var r = player.landlord.ranch;
            var now = Date.now();
            var hasAnimal = false;
            var hi = 0;
            for (; hi < r.unlockedSlots; hi++) {
                if (r.slots[hi] && r.slots[hi].animalId) {
                    hasAnimal = true;
                    break;
                }
            }
            if (!hasAnimal) {
                showLandlordNotification('牧场里没有饲养动物，无法逗乐。', 'info');
                return;
            }
            var lt = Number(r.lastGlobalTickleAt) || 0;
            if (lt > 0 && now - lt < LANDLORD_RANCH_TICKLE_COOLDOWN_MS) {
                showLandlordNotification('全场逗乐冷却：' + landlordRanchFormatRemain(LANDLORD_RANCH_TICKLE_COOLDOWN_MS - (now - lt)), 'info');
                return;
            }
            r.lastGlobalTickleAt = now;
            for (var si = 0; si < r.unlockedSlots; si++) {
                var slot = r.slots[si];
                if (!slot || !slot.animalId) continue;
                slot.pendingTreatMult = Math.min(1.12, Math.round((Number(slot.pendingTreatMult) || 1) * 1.06 * 1000) / 1000);
            }
            player.landlord.stats.ranchTickleCount = (Number(player.landlord.stats.ranchTickleCount) || 0) + 1;
            showLandlordNotification('全场逗乐成功！各栏位下次收取均叠一层逗乐加成（每栏独立上限不变）。', 'success');
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchToggleProduceWarehouseLock(idx) {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            var arr = player.landlord.ranch.ranchProduceWarehouse;
            if (!Array.isArray(arr) || idx < 0 || idx >= arr.length) return;
            var e = arr[idx];
            if (!e) return;
            e.locked = !e.locked;
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchToggleAnimalInvLock(invKey) {
            if (typeof player === 'undefined' || !player.landlord || !invKey) return;
            ensureLandlordRanch(player.landlord);
            var r = player.landlord.ranch;
            if (!r.animalInventoryLocked) r.animalInventoryLocked = {};
            if (r.animalInventoryLocked[invKey]) delete r.animalInventoryLocked[invKey];
            else r.animalInventoryLocked[invKey] = true;
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchToggleAnimalInvLockFromEnc(enc) {
            if (!enc) return;
            try {
                landlordRanchToggleAnimalInvLock(decodeURIComponent(enc));
            } catch (e) {}
        }

        function landlordRanchRelocateNearest(fromIdx) {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            landlordRanchSimulateToNow();
            var r = player.landlord.ranch;
            var fi = parseInt(fromIdx, 10);
            if (!Number.isFinite(fi) || fi < 0 || fi >= r.unlockedSlots) return;
            var slot = r.slots[fi];
            if (!slot || !slot.animalId) {
                showLandlordNotification('该栏没有动物。', 'info');
                return;
            }
            var tgt = -1;
            var i;
            for (i = fi + 1; i < r.unlockedSlots; i++) {
                if (!r.slots[i] || !r.slots[i].animalId) {
                    tgt = i;
                    break;
                }
            }
            if (tgt < 0) {
                for (i = 0; i < fi; i++) {
                    if (!r.slots[i] || !r.slots[i].animalId) {
                        tgt = i;
                        break;
                    }
                }
            }
            if (tgt < 0) {
                showLandlordNotification('没有其它空地可挪窝（请先解锁更多栏）。', 'info');
                return;
            }
            r.slots[tgt] = slot;
            r.slots[fi] = null;
            showLandlordNotification('已从 #' + (fi + 1) + ' 平移到 #' + (tgt + 1) + ' 空地', 'success');
            renderLandlordRanch();
            saveGame();
        }

        function landlordRanchSetPenFilter(mode) {
            var g = document.getElementById('landlordRanchPensGrid');
            if (!g) return;
            var m = mode === 'harvest' || mode === 'empty' ? mode : 'all';
            g.setAttribute('data-ranch-filter', m);
            var chips = document.querySelectorAll('.ranch-filter-chip');
            for (var i = 0; i < chips.length; i++) {
                var ch = chips[i];
                var mm = ch.getAttribute('data-ranch-filter') || '';
                if (ch.classList) ch.classList.toggle('ranch-filter-chip--active', mm === m);
            }
        }

        function landlordRanchPlaceFromPenCard(slotIndex) {
            var si = parseInt(slotIndex, 10);
            if (!Number.isFinite(si)) return;
            var sel = document.getElementById('ranchPenPlaceSel-' + si);
            if (!sel || !sel.value) {
                showLandlordNotification('请在本栏卡片中选择有库存的「动物·品质」后再点放养。', 'warning');
                return;
            }
            landlordRanchPlaceAnimal(si, sel.value);
        }

        function renderLandlordRanch() {
            var root = document.getElementById('landlordRanchRoot');
            if (!root || typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordRanch(player.landlord);
            landlordRanchSimulateToNow();
            var r = player.landlord.ranch;
            var html = '';
            var nowR = Date.now();
            var wx = player.landlord.weather || '晴朗';
            var wxCls = typeof getLandlordMutationColorClass === 'function' ? getLandlordMutationColorClass(wx) : 'landlord-mutation-grey';
            var twx = Math.max(0, 10 * 60 * 1000 - (nowR - (Number(player.landlord.lastWeatherChange) || nowR)));
            var speciesN = landlordRanchDexSpeciesCount(r);
            var bless = landlordRanchPastureLightMult(r);
            var blessPct = Math.round((bless - 1) * 1000) / 10;
            var invKeys = r.animalInventory ? Object.keys(r.animalInventory) : [];
            var invSum = 0;
            for (var ik = 0; ik < invKeys.length; ik++) {
                invSum += Math.floor(Number(r.animalInventory[invKeys[ik]]) || 0);
            }
            var produceBatches = 0;
            var produceVal = 0;
            var pwhArr = r.ranchProduceWarehouse;
            if (Array.isArray(pwhArr)) {
                for (var pi = 0; pi < pwhArr.length; pi++) {
                    var pe = pwhArr[pi];
                    if (!pe) continue;
                    produceBatches += Math.floor(Number(pe.batches) || 0);
                    produceVal += Math.floor(Number(pe.coinValue) || 0);
                }
            }
            var activePn = 0;
            var readyPn = 0;
            for (var pj = 0; pj < r.unlockedSlots; pj++) {
                var ps = r.slots[pj];
                if (ps && ps.animalId) {
                    activePn++;
                    var stc = Math.min(LANDLORD_RANCH_STOCKPILE_CAP, Math.floor(Number(ps.stockpile) || 0));
                    if (stc > 0) readyPn++;
                }
            }
            var grassRem = (r.lastLuckyGrassAt && nowR - r.lastLuckyGrassAt < LANDLORD_RANCH_LUCKY_GRASS_CD_MS) ? (LANDLORD_RANCH_LUCKY_GRASS_CD_MS - (nowR - r.lastLuckyGrassAt)) : 0;
            var ringRem = (r.lastRingAt && nowR - r.lastRingAt < LANDLORD_RANCH_RING_CD_MS) ? (LANDLORD_RANCH_RING_CD_MS - (nowR - r.lastRingAt)) : 0;
            var tickleGlobalRem =
                r.lastGlobalTickleAt && nowR - r.lastGlobalTickleAt < LANDLORD_RANCH_TICKLE_COOLDOWN_MS
                    ? LANDLORD_RANCH_TICKLE_COOLDOWN_MS - (nowR - r.lastGlobalTickleAt)
                    : 0;
            var dfDone = !!(r.dailyFortune && String(r.dailyFortune.dayKey) === landlordRanchTodayKey() && Number(r.dailyFortune.mult) > 1);
            var spinDone = !!(String(r.starBuffDayKey || '') === landlordRanchTodayKey() && Number(r.starBuffUntil) > nowR);
            var globMUi = landlordRanchGlobalYieldMult(r);
            var globUiPct = Math.round((globMUi - 1) * 1000) / 10;
            html += '<div class="ranch-dashboard">';
            html += '<div class="ranch-dash-col">';
            html += '<div class="ranch-dash-title">天气变化</div>';
            html += '<div class="ranch-dash-value"><span class="landlord-mutation-tag ' + wxCls + '" style="font-size:0.9em">' + String(wx).replace(/</g, '') + '</span></div>';
            html += '<div class="ranch-dash-sub">约 ' + landlordRanchFormatRemain(twx) + ' 后再次判定（10 分钟周期）</div>';
            html += '</div>';
            html += '<div class="ranch-dash-col">';
            html += '<div class="ranch-dash-title">牧光祝福 · 图鉴</div>';
            html += '<div class="ranch-dash-value">+' + blessPct + '% 牧场产出</div>';
            html += '<div class="ranch-dash-sub">已解锁物种 <strong>' + speciesN + '</strong> / ' + LANDLORD_RANCH_ANIMALS.length + ' · 5/10/20/30/40/50 档递升 · 全局动态合计约 <strong>+' + globUiPct + '%</strong></div>';
            html += '</div>';
            html += '<div class="ranch-dash-col">';
            html += '<div class="ranch-dash-title">栏位概览</div>';
            html += '<div class="ranch-dash-value">饲养 <strong>' + activePn + '</strong> / ' + r.unlockedSlots + '</div>';
            html += '<div class="ranch-dash-sub">可收栏 <strong>' + readyPn + '</strong> · 动物库存 <strong>' + invSum + '</strong>/' + LANDLORD_RANCH_ANIMAL_INVENTORY_MAX + ' 头 · 待售产出 <strong>' + produceBatches + '</strong>/' + LANDLORD_RANCH_PRODUCE_WAREHOUSE_MAX_BATCHES + ' 批（约 ' + formatNumber(produceVal) + ' 币）</div>';
            html += '<div class="ranch-filter-row">';
            html += '<button type="button" class="ranch-filter-chip ranch-filter-chip--active" data-ranch-filter="all" onclick="landlordRanchSetPenFilter(\'all\')">全部栏位</button>';
            html += '<button type="button" class="ranch-filter-chip" data-ranch-filter="harvest" onclick="landlordRanchSetPenFilter(\'harvest\')">可收取</button>';
            html += '<button type="button" class="ranch-filter-chip" data-ranch-filter="empty" onclick="landlordRanchSetPenFilter(\'empty\')">空地</button>';
            html += '</div></div></div>';
            var visStripM = landlordRanchVisitorMult(r);
            if (visStripM > 1 && r.visitorName) {
                html += '<div class="ranch-visitor-strip">途中访客 ' + (r.visitorIcon || '') + ' <strong>' + String(r.visitorName).replace(/</g, '') + '</strong> · 牧场 +' + Math.round((visStripM - 1) * 1000) / 10 + '% · 剩余 ' + landlordRanchFormatRemain(Math.max(0, Number(r.visitorBuffUntil) - nowR)) + '</div>';
            }
            html += '<details class="ranch-intro-details"><summary>玩法说明（解锁 · 合鸣 · 抽奖 · 牧光 · 免费趣味）</summary>';
            html += '<p class="landlord-ranch-intro">牧场 <strong>' + LANDLORD_RANCH_MAX_SLOTS + '</strong> 栏，第 3～40 栏解锁费指数递增。每栏<strong>已囤上限 ' + LANDLORD_RANCH_STOCKPILE_CAP + ' 批</strong>；未满囤时<strong>草场合鸣</strong>随天气变化叠层<strong>无条数上限</strong>（同种天气不重复记入），<strong>囤满后不再获得新的草场合鸣</strong>，离线会与田地天气同步结算。<strong>收取产出</strong>先入<strong>牧场仓库·待售</strong>，手动卖出才得地主币；收取后该栏<strong>草场合鸣清空</strong>。<strong>牧光祝福</strong>按图鉴物种叠收取加成。<strong>牧场仓库</strong>另可出售未放养<strong>动物库存</strong>（与栏位放养共用）。<strong>免费趣味</strong>：每日牧签、星象小转、幸运牧草、牧圈三桩套圈、随机访客、<strong>全场逗乐</strong>与一键挪窝——均<strong>不消耗地主币</strong>。空栏卡片内选动物后点<strong>放养</strong>；动物来自<strong>果实抽奖</strong>；迁出退回同品质×1。</p>';
            html += '</details>';
            html += '<div class="landlord-ranch-bar">';
            html += '<button type="button" class="landlord-ranch-harvest-all" onclick="landlordRanchHarvestAll()">一键收取全部栏位</button>';
            if (r.unlockedSlots < LANDLORD_RANCH_MAX_SLOTS) {
                var nextN = r.unlockedSlots + 1;
                var uc = landlordRanchUnlockCost(nextN);
                html += '<button type="button" class="landlord-ranch-unlock-btn" onclick="landlordRanchUnlockSlot()">解锁第 ' + nextN + ' 栏（' + formatNumber(uc) + ' 地主币）</button>';
            }
            html += '</div>';
            html += '<div class="ranch-fun-row">';
            html += '<span class="ranch-fun-label">免费趣味</span>';
            if (dfDone) {
                html += '<span style="font-size:0.78rem;font-weight:700;color:#2e7d32">' + (r.dailyFortune.icon || '') + ' 今日牧签 +' + Math.round((Number(r.dailyFortune.mult) - 1) * 1000) / 10 + '%</span>';
            } else {
                html += '<button type="button" class="ranch-fun-btn" onclick="landlordRanchDrawDailyFortune()">抽今日牧签</button>';
            }
            if (spinDone) {
                html += '<span style="font-size:0.78rem;font-weight:700;color:#6a1b9a">✨ 星象 +' + Math.round((Number(r.starBuffMult) - 1) * 1000) / 10 + '% 至今日末</span>';
            } else {
                html += '<button type="button" class="ranch-fun-btn ranch-fun-btn--violet" onclick="landlordRanchConstellationSpin()">星象小转</button>';
            }
            html += '<button type="button" class="ranch-fun-btn ranch-fun-btn--teal" onclick="landlordRanchTouchLuckyGrass()"' + (grassRem > 0 ? ' disabled title="冷却中"' : '') + '>' + (grassRem > 0 ? ('幸运牧草 ' + landlordRanchFormatRemain(grassRem)) : '幸运牧草') + '</button>';
            html += '<span style="font-size:0.72rem;color:#5d4037;font-weight:700">套圈</span>';
            html += '<button type="button" class="ranch-fun-btn ranch-fun-btn--sky" onclick="landlordRanchRingToss(1)"' + (ringRem > 0 ? ' disabled' : '') + '>①</button>';
            html += '<button type="button" class="ranch-fun-btn ranch-fun-btn--sky" onclick="landlordRanchRingToss(2)"' + (ringRem > 0 ? ' disabled' : '') + '>②</button>';
            html += '<button type="button" class="ranch-fun-btn ranch-fun-btn--sky" onclick="landlordRanchRingToss(3)"' + (ringRem > 0 ? ' disabled' : '') + '>③</button>';
            html +=
                '<button type="button" class="ranch-fun-btn ranch-fun-btn--pink" onclick="landlordRanchTickleGlobal()"' +
                (tickleGlobalRem > 0 ? ' disabled title="冷却中"' : '') +
                '>' +
                (tickleGlobalRem > 0 ? '全场逗乐 ' + landlordRanchFormatRemain(tickleGlobalRem) : '🎾 全场逗乐叠欢') +
                '</button>';
            html += '<span style="font-size:0.68rem;color:#78909c;margin-left:4px">套圈·牧草·全场逗乐 各24h</span>';
            html += '</div>';
            html += '<div class="ranch-warehouse-panel">';
            html += '<div class="ranch-warehouse-head">';
            html += '<span class="ranch-warehouse-title">牧场仓库</span>';
            html += '</div>';
            html += '<p class="ranch-warehouse-desc"><strong>待售栏内产出</strong>：收取栏位产出后先进入此处，卖出后才入地主币（与果实仓库类似），<strong>累计上限 ' + LANDLORD_RANCH_PRODUCE_WAREHOUSE_MAX_BATCHES + ' 批</strong>。<strong>动物库存</strong>：与栏位<strong>放养</strong>共用，抽奖获得的动物，<strong>累计上限 ' + LANDLORD_RANCH_ANIMAL_INVENTORY_MAX + ' 头</strong>；卖出规则见下区。两行均可<strong>锁定</strong>以防误卖。</p>';
            html += '<div class="ranch-warehouse-subhead">已收取产出（待售） · ' + produceBatches + '/' + LANDLORD_RANCH_PRODUCE_WAREHOUSE_MAX_BATCHES + ' 批</div>';
            if (!Array.isArray(r.ranchProduceWarehouse) || r.ranchProduceWarehouse.length < 1) {
                html += '<div class="ranch-warehouse-empty" style="margin-bottom:14px">暂无待售产出；栏位点「收取产出」或一键收取后，对应批次会出现在这里。</div>';
            } else {
                html += '<div style="display:flex;flex-wrap:wrap;justify-content:flex-end;margin:0 0 8px 0">';
                html += '<button type="button" class="ranch-warehouse-sell-all" onclick="landlordRanchSellAllProduceWarehouseStock()">一键卖光全部待售产出</button>';
                html += '</div>';
                html += '<div class="ranch-warehouse-grid ranch-warehouse-grid--scroll" id="ranchWarehouseProduceGrid" style="margin-bottom:16px">';
                for (var pwi = 0; pwi < r.ranchProduceWarehouse.length; pwi++) {
                    var pw = r.ranchProduceWarehouse[pwi];
                    if (!pw || Math.floor(Number(pw.batches) || 0) < 1) continue;
                    var pwd = getLandlordRanchAnimalDef(pw.animalId);
                    var pico = pwd ? pwd.icon : '❔';
                    var pnm = pwd ? String(pwd.name || '').replace(/</g, '') : String(pw.animalId || '').replace(/</g, '');
                    var pq = Math.min(8, Math.max(1, parseInt(pw.quality, 10) || 1));
                    var pqn = LANDLORD_RANCH_QUALITY_NAMES[pq - 1] || String(pq);
                    var pb = Math.floor(Number(pw.batches) || 0);
                    var pcv = Math.floor(Number(pw.coinValue) || 0);
                    var pwLocked = !!pw.locked;
                    html += '<div class="ranch-warehouse-card' + (pwLocked ? ' ranch-warehouse-card--locked' : '') + '">';
                    html += '<div class="ranch-warehouse-card__top">';
                    html += '<div class="ranch-warehouse-card__ico">' + pico + '</div>';
                    html += '<div class="ranch-warehouse-card__meta">';
                    html += '<div class="ranch-warehouse-card__name">栏内产出 · ' + pnm + '</div>';
                    html += '<div class="ranch-warehouse-card__sub">品质 ' + pqn + ' · <strong>' + pb + '</strong> 批' + (pwLocked ? ' · <span style="color:#e65100;font-weight:700">已锁定</span>' : '') + '</div>';
                    html += '<div class="ranch-warehouse-card__price">待售合计 <strong>' + formatNumber(pcv) + '</strong> 地主币</div>';
                    html += '</div></div>';
                    var pwMoods = Array.isArray(pw.pastureMoods)
                        ? pw.pastureMoods
                        : Array.isArray(pw.pastureMood)
                          ? pw.pastureMood
                          : [];
                    html += '<div class="ranch-warehouse-moods">';
                    html += '<div class="ranch-warehouse-moods__label">收取时天气词条（草场合鸣）</div>';
                    if (pwMoods.length < 1) {
                        html += '<div class="ranch-warehouse-moods__empty">本批收取时无叠层（多为晴朗或未触发叠层）</div>';
                    } else {
                        html += '<div class="ranch-warehouse-moods__tags">';
                        for (var pmi = 0; pmi < pwMoods.length; pmi++) {
                            var mwp = String(pwMoods[pmi]).replace(/</g, '');
                            var mccP =
                                typeof getLandlordMutationColorClass === 'function'
                                    ? getLandlordMutationColorClass(pwMoods[pmi])
                                    : 'landlord-mutation-grey';
                            html += '<span class="landlord-mutation-tag ' + mccP + '">' + mwp + '</span>';
                        }
                        html += '</div>';
                    }
                    html += '</div>';
                    html += '<div class="ranch-warehouse-card__actions">';
                    html +=
                        '<button type="button" class="ranch-warehouse-lock' +
                        (pwLocked ? ' ranch-warehouse-lock--on' : '') +
                        '" onclick="landlordRanchToggleProduceWarehouseLock(' +
                        pwi +
                        ')">' +
                        (pwLocked ? '已锁定' : '锁定') +
                        '</button>';
                    html +=
                        '<button type="button" class="ranch-warehouse-btn ranch-warehouse-btn--one" data-ranch-produce-i="' +
                        pwi +
                        '" onclick="landlordRanchSellProduceWarehouseBtn(this,\'one\')"' +
                        (pwLocked ? ' disabled style="opacity:0.45;cursor:not-allowed"' : '') +
                        '>卖 1 批</button>';
                    html +=
                        '<button type="button" class="ranch-warehouse-btn ranch-warehouse-btn--all" data-ranch-produce-i="' +
                        pwi +
                        '" onclick="landlordRanchSellProduceWarehouseBtn(this,\'all\')"' +
                        (pwLocked ? ' disabled style="opacity:0.45;cursor:not-allowed"' : '') +
                        '>全卖本行</button>';
                    html += '</div></div>';
                }
                html += '</div>';
            }
            html += '<div class="ranch-warehouse-subhead">动物库存（放养用） · ' + invSum + '/' + LANDLORD_RANCH_ANIMAL_INVENTORY_MAX + ' 头</div>';
            html += '<p class="ranch-warehouse-desc" style="margin-top:4px">单价 = 基础每批 × 品质 × 当前全局牧场加成（与栏内实收含草场合鸣、逗乐<strong>不同</strong>）。</p>';
            var whKeys = r.animalInventory ? Object.keys(r.animalInventory) : [];
            var whCount = invSum;
            if (whCount < 1) {
                html += '<div class="ranch-warehouse-empty">暂无动物库存；果实抽奖可获得动物。</div>';
            } else {
                html += '<div style="display:flex;flex-wrap:wrap;justify-content:flex-end;margin:0 0 8px 0">';
                html += '<button type="button" class="ranch-warehouse-sell-all" onclick="landlordRanchSellAllWarehouseStock()">一键卖光全部动物库存</button>';
                html += '</div>';
                html += '<div class="ranch-warehouse-grid ranch-warehouse-grid--scroll" id="ranchWarehouseInvGrid">';
                whKeys.sort();
                for (var whj = 0; whj < whKeys.length; whj++) {
                    var whKey = whKeys[whj];
                    var whQty = Math.floor(Number(r.animalInventory[whKey]) || 0);
                    if (whQty < 1) continue;
                    var whLi = String(whKey).lastIndexOf(':');
                    var whAid = whLi >= 0 ? String(whKey).slice(0, whLi) : '';
                    var whQ = whLi >= 0 ? parseInt(String(whKey).slice(whLi + 1), 10) : 1;
                    var whDef = getLandlordRanchAnimalDef(whAid);
                    var whIcon = whDef ? whDef.icon : '❔';
                    var whName = whDef ? String(whDef.name || '').replace(/</g, '') : String(whAid).replace(/</g, '');
                    var whQn = Math.min(8, Math.max(1, Number.isFinite(whQ) ? whQ : 1));
                    var whQnm = LANDLORD_RANCH_QUALITY_NAMES[whQn - 1] || String(whQn);
                    var whUnit = landlordRanchWarehouseUnitPrice(whKey);
                    var whTot = whUnit * whQty;
                    var whEnc = encodeURIComponent(whKey);
                    var invLocked = !!(r.animalInventoryLocked && r.animalInventoryLocked[whKey]);
                    html += '<div class="ranch-warehouse-card' + (invLocked ? ' ranch-warehouse-card--locked' : '') + '">';
                    html += '<div class="ranch-warehouse-card__top">';
                    html += '<div class="ranch-warehouse-card__ico">' + whIcon + '</div>';
                    html += '<div class="ranch-warehouse-card__meta">';
                    html += '<div class="ranch-warehouse-card__name">' + whName + '</div>';
                    html +=
                        '<div class="ranch-warehouse-card__sub">品质 ' +
                        whQnm +
                        ' · 库存 <strong>' +
                        whQty +
                        '</strong> 份' +
                        (invLocked ? ' · <span style="color:#e65100;font-weight:700">已锁定</span>' : '') +
                        '</div>';
                    html += '<div class="ranch-warehouse-card__price">单价 ' + formatNumber(whUnit) + ' · 本行合计约 ' + formatNumber(whTot) + ' 地主币</div>';
                    html += '</div></div>';
                    html += '<div class="ranch-warehouse-card__actions">';
                    html +=
                        '<button type="button" class="ranch-warehouse-lock' +
                        (invLocked ? ' ranch-warehouse-lock--on' : '') +
                        '" onclick="landlordRanchToggleAnimalInvLockFromEnc(\'' + whEnc + '\')">' +
                        (invLocked ? '已锁定' : '锁定') +
                        '</button>';
                    html +=
                        '<button type="button" class="ranch-warehouse-btn ranch-warehouse-btn--one" data-ranch-inv="' +
                        whEnc +
                        '" onclick="landlordRanchSellWarehouseBtn(this,\'one\')"' +
                        (invLocked ? ' disabled style="opacity:0.45;cursor:not-allowed"' : '') +
                        '>卖 1 份</button>';
                    html +=
                        '<button type="button" class="ranch-warehouse-btn ranch-warehouse-btn--all" data-ranch-inv="' +
                        whEnc +
                        '" onclick="landlordRanchSellWarehouseBtn(this,\'all\')"' +
                        (invLocked ? ' disabled style="opacity:0.45;cursor:not-allowed"' : '') +
                        '>全卖该条</button>';
                    html += '</div></div>';
                }
                html += '</div>';
            }
            html += '</div>';
            html += '<div class="landlord-ranch-layout" style="margin-top:14px;">';
            html += '<div class="ranch-pens-section">';
            html += '<div class="ranch-pens-section__head">';
            html += '<span class="ranch-pens-section__title">牧场栏位</span>';
            html += '<span class="ranch-pens-section__hint">共 ' + r.unlockedSlots + ' 栏 · 整页可上下滑动</span>';
            html += '</div>';
            html += '<div id="landlordRanchPensGrid" class="landlord-ranch-pens" data-ranch-filter="all">';
            for (var si = 0; si < r.unlockedSlots; si++) {
                var slot = r.slots[si];
                if (!slot || !slot.animalId) {
                    html += '<div id="ranchPenCard-' + si + '" class="landlord-ranch-pen landlord-ranch-pen--empty">';
                    html += '<div class="ranch-pen-head"><span class="ranch-pen-slot-num">#' + (si + 1) + '</span><span class="ranch-pen-qtag">空闲</span></div>';
                    html += '<div class="ranch-pen-stockbar"><div class="ranch-pen-stockbar__fill" style="width:0%"></div></div>';
                    html += '<div class="landlord-ranch-pen-icon">🌿</div>';
                    html += '<div class="landlord-ranch-pen-name">空地</div>';
                    html += '<div class="ranch-pen-place-row">';
                    html += '<select id="ranchPenPlaceSel-' + si + '" class="ranch-pen-place-sel">' + landlordRanchInventorySelectOptionsHtml(r) + '</select>';
                    html +=
                        '<button type="button" class="landlord-ranch-btn landlord-ranch-btn-place" onclick="landlordRanchPlaceFromPenCard(' +
                        si +
                        ')">放养</button>';
                    html += '</div>';
                    html += '<div class="ranch-pen-est-row" style="opacity:0.65;flex:1;display:flex;align-items:center;justify-content:center">—</div>';
                    html += '</div>';
                    continue;
                }
                var def = getLandlordRanchAnimalDef(slot.animalId);
                var icon = def ? def.icon : '❓';
                var nm = def ? def.name : slot.animalId;
                var qslot = Math.min(8, Math.max(1, parseInt(slot.quality, 10) || 1));
                var qnms = LANDLORD_RANCH_QUALITY_NAMES[qslot - 1] || '';
                var mults = LANDLORD_RANCH_QUALITY_MULT[qslot - 1] || 1;
                var st = Math.min(LANDLORD_RANCH_STOCKPILE_CAP, Math.floor(Number(slot.stockpile) || 0));
                var yMult = landlordRanchYieldMultFromSlot(slot);
                var cMult = landlordRanchCycleMultFromSlot(slot);
                var cycTxt = def ? formatTimes(def.cycleMs) : '--';
                var cycEffTxt = def ? formatTimes(Math.max(60000, Math.round(def.cycleMs * cMult))) : '--';
                var treatPart = landlordRanchPendingTreatMult(slot);
                var perBatch = def ? Math.floor(def.reward * mults * yMult * globMUi * treatPart) : 0;
                var estCoins = def ? Math.floor(st * def.reward * mults * yMult * globMUi * treatPart) : 0;
                var na = Number(slot.nextHarvestAt);
                var remMs = (Number.isFinite(na) ? na : 0) - nowR;
                var cdCls = (st >= LANDLORD_RANCH_STOCKPILE_CAP) ? ' ranch-pen-countdown--full' : '';
                var cdText = (st >= LANDLORD_RANCH_STOCKPILE_CAP) ? '囤满 · 请收取' : (remMs <= 0 ? '即将出批' : landlordRanchFormatRemain(remMs));
                var penFullCls = (st >= LANDLORD_RANCH_STOCKPILE_CAP) ? ' landlord-ranch-pen--full' : '';
                var readyCls = (st > 0) ? ' ranch-pen--ready' : '';
                html += '<div id="ranchPenCard-' + si + '" class="landlord-ranch-pen landlord-ranch-pen--q' + qslot + penFullCls + readyCls + '">';
                html += '<div class="ranch-pen-head"><span class="ranch-pen-slot-num">#' + (si + 1) + '</span><span class="ranch-pen-qtag">' + qnms + '</span></div>';
                html += '<div class="ranch-pen-stockbar"><div id="ranchPenBar-' + si + '" class="ranch-pen-stockbar__fill" style="width:' + (100 * st / LANDLORD_RANCH_STOCKPILE_CAP) + '%"></div></div>';
                html += '<div class="landlord-ranch-pen-icon">' + icon + '</div>';
                html += '<div class="landlord-ranch-pen-name">' + nm + '</div>';
                html += '<div class="landlord-ranch-pen-meta">基础间隔 ' + cycTxt + ' · <strong>当前约 ' + cycEffTxt + '</strong> · 已囤 <strong>' + st + '</strong>/' + LANDLORD_RANCH_STOCKPILE_CAP + ' 批' + (st >= LANDLORD_RANCH_STOCKPILE_CAP ? ' · <span style="color:#c62828;font-weight:700">满仓</span>' : '') + '</div>';
                html += '<div style="margin-top:6px;font-size:0.66rem;color:#607d8b;letter-spacing:0.02em">距下一批成熟</div>';
                html += '<div id="ranchPenCd-' + si + '" class="ranch-pen-countdown' + cdCls + '">' + cdText + '</div>';
                html += '<div class="ranch-pen-est-row">已囤预计价值 <strong id="ranchPenEst-' + si + '">' + formatNumber(estCoins) + '</strong> 地主币</div>';
                html += '<div class="ranch-pen-perbatch">每批约 <strong>' + formatNumber(perBatch) + '</strong> 币（品质×' + mults.toFixed(2) + ' · 合鸣 · 全局+' + globUiPct + '% · 逗乐×' + treatPart.toFixed(2) + '）</div>';
                html += '<div class="ranch-pen-bonus-line">草场合鸣：+' + Math.round((yMult - 1) * 100) + '% 产出 · −' + Math.round((1 - cMult) * 100) + '% 间隔</div>';
                var moods = Array.isArray(slot.pastureMood) ? slot.pastureMood : [];
                if (moods.length > 0) {
                    html += '<div class="ranch-pen-moods">';
                    for (var mi = 0; mi < moods.length; mi++) {
                        var mw = String(moods[mi]).replace(/</g, '');
                        var mcc = typeof getLandlordMutationColorClass === 'function' ? getLandlordMutationColorClass(moods[mi]) : 'landlord-mutation-grey';
                        html += '<span class="landlord-mutation-tag ' + mcc + '">' + mw + '</span>';
                    }
                    html += '</div>';
                }
                html += '<div class="landlord-ranch-pen-actions">';
                html += '<button type="button" class="landlord-ranch-btn landlord-ranch-btn-harvest" ' + (st <= 0 ? 'disabled' : '') + ' onclick="landlordRanchHarvestSlot(' + si + ')">收取产出</button>';
                html += '<button type="button" class="landlord-ranch-btn landlord-ranch-btn-nudge" onclick="landlordRanchRelocateNearest(' + si + ')">挪窝找空地</button>';
                html += '<button type="button" class="landlord-ranch-btn landlord-ranch-btn-evac" onclick="landlordRanchEvacuateSlot(' + si + ')">迁出（退回同品质×1）</button>';
                html += '</div></div>';
            }
            html += '</div></div>';
            html += '<details class="landlord-ranch-dex-details">';
            html +=
                '<summary>牧场图鉴 <span style="font-weight:400;color:#689f38;font-size:0.88em;">（全' +
                LANDLORD_RANCH_ANIMALS.length +
                '种 · 下列仅显示已收录 ✓ · 悬停看详情 · 点击展开）</span></summary>';
            html += '<div class="landlord-ranch-dex-grid">';
            var ranchDexGridCount = 0;
            for (var bi = 0; bi < LANDLORD_RANCH_ANIMALS.length; bi++) {
                var b = LANDLORD_RANCH_ANIMALS[bi];
                var dm = r.dexSeen[b.id];
                var dmNum = typeof dm === 'number' ? dm : (dm ? 1 : 0);
                var seen = dmNum > 0;
                if (!seen) continue;
                ranchDexGridCount++;
                var sumInv = landlordRanchSumInventoryForAnimal(r, b.id);
                var qShort = LANDLORD_RANCH_QUALITY_NAMES[dmNum - 1] || String(dmNum);
                var tipRaw = b.desc + ' 周期' + formatTimes(b.cycleMs) + ' 基础每批' + formatNumber(b.reward) + '币（实收×品质倍率）';
                var tipEsc = String(tipRaw).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
                html += '<div class="landlord-ranch-dex-cell seen" title="' + tipEsc + '">';
                html += '<span class="dex-ico">' + b.icon + '</span>';
                html += '<span class="dex-nm">' + b.name + ' ✓</span>';
                html += '<span class="dex-sub">最高' + qShort + ' · 库存' + sumInv + '</span>';
                html += '</div>';
            }
            if (ranchDexGridCount === 0) {
                html +=
                    '<div class="landlord-ranch-dex-empty" style="grid-column:1/-1;padding:12px 10px;font-size:0.82rem;color:#78909c;text-align:center;line-height:1.45;">暂无已收录物种。放养或抽中动物并点亮图鉴后，将在此显示（带 ✓）。</div>';
            }
            html += '</div></details></div>';
            root.innerHTML = html;
            bindRanchWarehouseWheelScroll();
            if (typeof updateLandlordRanchPenTimers === 'function') updateLandlordRanchPenTimers();
        }

        function countLandlordUnlockedFruitsByType(fruitType) {
            if (typeof player === 'undefined' || !player.landlord || !Array.isArray(player.landlord.fruitStorage)) return 0;
            var n = 0;
            for (var i = 0; i < player.landlord.fruitStorage.length; i++) {
                var f = player.landlord.fruitStorage[i];
                if (f && !f.isLocked && getLandlordSeedBaseName(f.type) === fruitType) n++;
            }
            return n;
        }

        function removeLandlordFruitsOfTypeUnlocked(fruitType, amount) {
            var removed = 0;
            if (typeof player === 'undefined' || !player.landlord || !Array.isArray(player.landlord.fruitStorage)) return 0;
            for (var i = player.landlord.fruitStorage.length - 1; i >= 0 && removed < amount; i--) {
                var fr = player.landlord.fruitStorage[i];
                if (fr && !fr.isLocked && getLandlordSeedBaseName(fr.type) === fruitType) {
                    player.landlord.fruitStorage.splice(i, 1);
                    removed++;
                }
            }
            return removed;
        }

        function countLandlordUnlockedFruitsByExactType(fruitKey) {
            if (typeof player === 'undefined' || !player.landlord || !Array.isArray(player.landlord.fruitStorage)) return 0;
            var n = 0;
            for (var i = 0; i < player.landlord.fruitStorage.length; i++) {
                var f = player.landlord.fruitStorage[i];
                if (f && !f.isLocked && f.type === fruitKey) n++;
            }
            return n;
        }

        function removeLandlordFruitsOfExactTypeUnlocked(fruitKey, amount) {
            var removed = 0;
            if (typeof player === 'undefined' || !player.landlord || !Array.isArray(player.landlord.fruitStorage)) return 0;
            for (var i = player.landlord.fruitStorage.length - 1; i >= 0 && removed < amount; i--) {
                var fr = player.landlord.fruitStorage[i];
                if (fr && !fr.isLocked && fr.type === fruitKey) {
                    player.landlord.fruitStorage.splice(i, 1);
                    removed++;
                }
            }
            return removed;
        }

        function renderLandlordSkyVine() {
            var el = document.getElementById('landlordSkyVineContent');
            if (!el || typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordSkyVine(player.landlord);
            var lv = player.landlord.skyVineLevel;
            var maxLv = LANDLORD_SKY_VINE_FRUIT_ORDER.length;
            var prog = Number(player.landlord.skyVineProgress) || 0;
            var bonusPct = lv * LANDLORD_SKY_VINE_WORLD_EXP_PER_LEVEL * 100;
            var html = '';
            html += '<div class="landlord-sky-vine-panel">';
            html += '<div class="landlord-sky-vine-hero">';
            html += '<div class="landlord-sky-vine-glow"></div>';
            html += '<div class="landlord-sky-vine-tree">🌲</div>';
            html += '<div class="landlord-sky-vine-title">通天藤</div>';
            html += '<div class="landlord-sky-vine-sub">每级世界地图经验 +5% · 当前累计 +' + bonusPct.toFixed(0) + '%</div>';
            html += '</div>';
            html += '<div class="landlord-sky-vine-card">';
            html += '<p style="margin-top:0;">等级 <strong>' + lv + '</strong> / ' + maxLv + '</p>';
            if (lv >= maxLv) {
                var topFruit = LANDLORD_SKY_VINE_FRUIT_ORDER[maxLv - 1] || '大道果';
                html += '<p class="landlord-sky-vine-max" style="color:#e1bee7;">已达最高级（' + topFruit + '），藤已通天。</p>';
            } else {
                var needFruit = LANDLORD_SKY_VINE_FRUIT_ORDER[lv];
                var have = countLandlordUnlockedFruitsByType(needFruit);
                var stillNeed = LANDLORD_SKY_VINE_FRUIT_PER_LEVEL - prog;
                var pctFill = (prog / LANDLORD_SKY_VINE_FRUIT_PER_LEVEL) * 100;
                html += '<p>本级需「<strong>' + needFruit + '</strong>」×' + LANDLORD_SKY_VINE_FRUIT_PER_LEVEL + '，已积累 <strong>' + prog + '</strong> / ' + LANDLORD_SKY_VINE_FRUIT_PER_LEVEL + '</p>';
                html += '<div class="landlord-sky-vine-progress-bar"><div class="landlord-sky-vine-progress-fill" style="width:' + pctFill.toFixed(1) + '%;"></div></div>';
                html += '<p>仓库未锁定「' + needFruit + '」：<strong>' + have + '</strong> 个（本次最多可上交 <strong>' + Math.min(have, stillNeed) + '</strong> 个）</p>';
                html += '<button type="button" class="landlord-buy-button" style="width:100%;max-width:100%;" onclick="submitLandlordSkyVineFruits()" ' + (have > 0 ? '' : 'disabled') + '>一键上交对应果实</button>';
                html += '<p class="landlord-sky-vine-hint">每次从仓库扣除未锁定果实，凑满 100 个本级果实即升 1 级；不足 100 可先存进度。</p>';
            }
            html += '</div></div>';
            el.innerHTML = html;
        }

        function submitLandlordSkyVineFruits() {
            if (typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordSkyVine(player.landlord);
            var lv = player.landlord.skyVineLevel;
            var maxLv = LANDLORD_SKY_VINE_FRUIT_ORDER.length;
            if (lv >= maxLv) {
                showLandlordNotification('通天藤已满级！', 'info');
                return;
            }
            var needFruit = LANDLORD_SKY_VINE_FRUIT_ORDER[lv];
            var have = countLandlordUnlockedFruitsByType(needFruit);
            if (have <= 0) {
                showLandlordNotification('仓库里没有可上交的未锁定「' + needFruit + '」果实！', 'error');
                return;
            }
            var prog = Number(player.landlord.skyVineProgress) || 0;
            var stillNeed = LANDLORD_SKY_VINE_FRUIT_PER_LEVEL - prog;
            var take = Math.min(have, stillNeed);
            if (take <= 0) {
                showLandlordNotification('本级进度异常，请重开界面或联系存档修复。', 'error');
                return;
            }
            var rm = removeLandlordFruitsOfTypeUnlocked(needFruit, take);
            if (rm < take) {
                showLandlordNotification('上交失败，请重试！', 'error');
                return;
            }
            prog += rm;
            var leveled = false;
            while (prog >= LANDLORD_SKY_VINE_FRUIT_PER_LEVEL && lv < maxLv) {
                prog -= LANDLORD_SKY_VINE_FRUIT_PER_LEVEL;
                lv++;
                leveled = true;
            }
            player.landlord.skyVineLevel = lv;
            player.landlord.skyVineProgress = lv >= maxLv ? 0 : prog;
            ensureLandlordSkyVine(player.landlord);
            if (leveled) {
                showLandlordNotification('通天藤升至 ' + player.landlord.skyVineLevel + ' 级！世界地图经验累计 +' + (player.landlord.skyVineLevel * LANDLORD_SKY_VINE_WORLD_EXP_PER_LEVEL * 100).toFixed(0) + '%', 'success');
            } else {
                showLandlordNotification('已上交 ' + rm + ' 个「' + needFruit + '」，当前进度 ' + player.landlord.skyVineProgress + ' / ' + LANDLORD_SKY_VINE_FRUIT_PER_LEVEL, 'success');
            }
            renderLandlordSkyVine();
            if (typeof renderLandlordFruitStorage === 'function') renderLandlordFruitStorage();
            if (typeof updateLandlordStats === 'function') updateLandlordStats();
            saveGame();
        }

        function selectLandlordGeneTreeVariant(variant) {
            if (!variant || !LANDLORD_GENE_TREE_DEFS[variant]) return;
            window._landlordGeneTreeSelected = variant;
            renderLandlordGeneTree();
        }

        function landlordGeneTreeBonusShort(def, lv) {
            var parts = [];
            if (def.attackPerLevel) parts.push('攻击+' + (lv * def.attackPerLevel * 100).toFixed(0) + '%');
            if (def.healthPerLevel) parts.push('生命+' + (lv * def.healthPerLevel * 100).toFixed(0) + '%');
            if (def.critDamagePerLevel) parts.push('爆伤+' + (lv * def.critDamagePerLevel * 100).toFixed(0) + '%');
            if (def.expPerLevel) parts.push('经验+' + (lv * def.expPerLevel * 100).toFixed(0) + '%');
            return parts.length ? parts.join(' · ') : '暂无加成';
        }

        function renderLandlordGeneTree() {
            var el = document.getElementById('landlordGeneTreeContent');
            if (!el || typeof player === 'undefined' || !player.landlord) return;
            ensureLandlordGeneTrees(player.landlord);
            var maxLv = LANDLORD_SKY_VINE_FRUIT_ORDER.length;
            var perLevel = LANDLORD_GENE_TREE_FRUIT_PER_LEVEL;
            var slugMap = { '彩光': 'caiguang', '炫彩': 'xuancai', '琉璃': 'liuli', '琥珀': 'hupo' };
            var sel = window._landlordGeneTreeSelected;
            if (!sel || !LANDLORD_GENE_TREE_DEFS[sel]) sel = LANDLORD_GENE_TREE_ORDER[0];
            window._landlordGeneTreeSelected = sel;

            var html = '<div class="landlord-gene-tree-wrap">';
            html += '<div class="landlord-gene-tree-head">';
            html += '<div class="landlord-gene-tree-head-title">基因树</div>';
            html += '<div class="landlord-gene-tree-head-desc">上交基因突变果实升级 · 每级需 ' + perLevel + ' 个</div>';
            html += '</div>';

            html += '<div class="landlord-gene-tree-switch" role="tablist">';
            for (var ti = 0; ti < LANDLORD_GENE_TREE_ORDER.length; ti++) {
                var v = LANDLORD_GENE_TREE_ORDER[ti];
                var d = LANDLORD_GENE_TREE_DEFS[v];
                var n = player.landlord.geneTrees[v] || { level: 0, progress: 0 };
                var lvShort = Number(n.level) || 0;
                var active = v === sel ? ' is-active' : '';
                html += '<button type="button" class="landlord-gene-tree-switch-btn landlord-gene-tree-' + (slugMap[v] || 'caiguang') + active + '" onclick="selectLandlordGeneTreeVariant(\'' + v + '\')">';
                html += '<span class="gt-ico">' + d.icon + '</span>';
                html += '<span class="gt-name">' + v + '</span>';
                html += '<span class="gt-lv">Lv.' + lvShort + '</span>';
                html += '</button>';
            }
            html += '</div>';

            var def = LANDLORD_GENE_TREE_DEFS[sel];
            var node = player.landlord.geneTrees[sel] || { level: 0, progress: 0 };
            var lv = Number(node.level) || 0;
            var prog = Number(node.progress) || 0;
            var slug = slugMap[sel] || 'caiguang';

            html += '<div class="landlord-gene-tree-detail landlord-gene-tree-' + slug + '">';
            html += '<div class="landlord-gene-tree-detail-top">';
            html += '<div class="landlord-gene-tree-detail-icon">' + def.icon + '</div>';
            html += '<div class="landlord-gene-tree-detail-meta">';
            html += '<div class="landlord-gene-tree-detail-name">' + sel + '基因树</div>';
            html += '<div class="landlord-gene-tree-detail-rule">' + def.sub + '</div>';
            html += '<div class="landlord-gene-tree-detail-bonus">' + landlordGeneTreeBonusShort(def, lv) + '</div>';
            html += '</div>';
            html += '<div class="landlord-gene-tree-detail-lv"><span class="gt-num">' + lv + '</span><span class="gt-den">/' + maxLv + '</span></div>';
            html += '</div>';

            if (lv >= maxLv) {
                var topFruit = LANDLORD_SKY_VINE_FRUIT_ORDER[maxLv - 1] || '大道果';
                html += '<div class="landlord-gene-tree-max">已圆满 · 最高级果实「' + formatLandlordVariantSeedName(topFruit, sel) + '」</div>';
            } else {
                var needBase = LANDLORD_SKY_VINE_FRUIT_ORDER[lv];
                var needFruit = formatLandlordVariantSeedName(needBase, sel);
                var have = countLandlordUnlockedFruitsByExactType(needFruit);
                var stillNeed = perLevel - prog;
                var pctFill = (prog / perLevel) * 100;
                var needLabel = (typeof getLandlordGeneVariantLabelHtml === 'function')
                    ? getLandlordGeneVariantLabelHtml(needFruit) : needFruit;
                html += '<div class="landlord-gene-tree-body">';
                html += '<div class="landlord-gene-tree-row"><span class="gt-k">本级需求</span><span class="gt-v">' + needLabel + ' ×' + perLevel + '</span></div>';
                html += '<div class="landlord-gene-tree-progress"><div class="landlord-gene-tree-progress-fill" style="width:' + pctFill.toFixed(1) + '%;"></div></div>';
                html += '<div class="landlord-gene-tree-row gt-muted"><span class="gt-k">进度</span><span class="gt-v">' + prog + ' / ' + perLevel + '</span></div>';
                html += '<div class="landlord-gene-tree-row gt-muted"><span class="gt-k">仓库可交</span><span class="gt-v">' + have + ' 个（本次最多 ' + Math.min(have, stillNeed) + '）</span></div>';
                html += '<button type="button" class="landlord-gene-tree-submit" onclick="submitLandlordGeneTreeFruits(\'' + sel + '\')" ' + (have > 0 ? '' : 'disabled') + '>一键上交</button>';
                html += '</div>';
            }
            html += '</div></div>';
            el.innerHTML = html;
        }

        function submitLandlordGeneTreeFruits(variant) {
            if (typeof player === 'undefined' || !player.landlord) return;
            if (!variant || !LANDLORD_GENE_TREE_DEFS[variant]) {
                showLandlordNotification('未知基因树！', 'error');
                return;
            }
            ensureLandlordGeneTrees(player.landlord);
            var maxLv = LANDLORD_SKY_VINE_FRUIT_ORDER.length;
            var perLevel = LANDLORD_GENE_TREE_FRUIT_PER_LEVEL;
            var node = player.landlord.geneTrees[variant];
            var lv = Number(node.level) || 0;
            if (lv >= maxLv) {
                showLandlordNotification(variant + '基因树已满级！', 'info');
                return;
            }
            var needBase = LANDLORD_SKY_VINE_FRUIT_ORDER[lv];
            var needFruit = formatLandlordVariantSeedName(needBase, variant);
            var have = countLandlordUnlockedFruitsByExactType(needFruit);
            if (have <= 0) {
                showLandlordNotification('仓库里没有可上交的未锁定「' + needFruit + '」！', 'error');
                return;
            }
            var prog = Number(node.progress) || 0;
            var stillNeed = perLevel - prog;
            var take = Math.min(have, stillNeed);
            if (take <= 0) {
                showLandlordNotification('本级进度异常，请重开界面或联系存档修复。', 'error');
                return;
            }
            var rm = removeLandlordFruitsOfExactTypeUnlocked(needFruit, take);
            if (rm < take) {
                showLandlordNotification('上交失败，请重试！', 'error');
                return;
            }
            prog += rm;
            var leveled = false;
            while (prog >= perLevel && lv < maxLv) {
                prog -= perLevel;
                lv++;
                leveled = true;
            }
            player.landlord.geneTrees[variant] = {
                level: lv,
                progress: lv >= maxLv ? 0 : prog
            };
            ensureLandlordGeneTrees(player.landlord);
            var def = LANDLORD_GENE_TREE_DEFS[variant];
            var curLv = player.landlord.geneTrees[variant].level;
            if (leveled) {
                var msg = variant + '基因树升至 ' + curLv + ' 级！';
                if (def.attackPerLevel) msg += '攻击累计 +' + (curLv * def.attackPerLevel * 100).toFixed(0) + '%';
                if (def.healthPerLevel) msg += ' 生命累计 +' + (curLv * def.healthPerLevel * 100).toFixed(0) + '%';
                if (def.critDamagePerLevel) msg += ' 爆伤累计 +' + (curLv * def.critDamagePerLevel * 100).toFixed(0) + '%';
                if (def.expPerLevel) msg += ' 经验累计 +' + (curLv * def.expPerLevel * 100).toFixed(0) + '%';
                showLandlordNotification(msg, 'success');
                if (typeof updatePlayerBattleStats === 'function') updatePlayerBattleStats();
            } else {
                showLandlordNotification('已上交 ' + rm + ' 个「' + needFruit + '」，当前进度 ' + player.landlord.geneTrees[variant].progress + ' / ' + perLevel, 'success');
            }
            renderLandlordGeneTree();
            if (typeof renderLandlordFruitStorage === 'function') renderLandlordFruitStorage();
            if (typeof updateLandlordStats === 'function') updateLandlordStats();
            saveGame();
        }

        function syncLandlordPlantFieldTierFromFieldIndex(fieldIndex, plant) {
            if (!plant || typeof fieldIndex !== 'number' || fieldIndex < 0) return;
            ensureLandlordFieldTiers(player.landlord);
            const tier = Number(player.landlord.fieldTiers[fieldIndex]) || 0;
            plant.fieldTier = tier;
            if (tier >= 1 && tier <= 4) {
                const affix = LANDLORD_TIER_LAND_AFFIX[tier];
                // 只校正田地专属词条（银土/金土/钻石土/流光土），与 upgradeLandlordFieldTier 一致；
                // 勿过滤元素类基础突变（银/金/水晶/流光），否则每次读档/刷新页面都会把道具等叠上的元素词条清掉。
                plant.mutations = (plant.mutations || []).filter(function (m) {
                    return LANDLORD_ALL_LAND_AFFIXES.indexOf(m) < 0;
                });
                if (affix && plant.mutations.indexOf(affix) < 0) plant.mutations.push(affix);
            }
        }

        function applyLandlordLandExclusivePriceMult(plant, price) {
            const tier = Number(plant.fieldTier) || 0;
            if (tier < 1 || tier > 4) return price;
            const affix = LANDLORD_TIER_LAND_AFFIX[tier];
            const mult = LANDLORD_TIER_EXCLUSIVE_PRICE_MULT[affix];
            if (mult && mult > 1 && plant.mutations && plant.mutations.indexOf(affix) >= 0) {
                return price * mult;
            }
            return price;
        }

        function grantLandlordBarsForSoldFruit(fruit) {
            ensureLandlordBars(player.landlord);
            const map = { '银': 'silver', '金': 'gold', '水晶': 'diamond', '流光': 'flow' };
            const labels = { silver: '银条', gold: '金条', diamond: '钻石条', flow: '流光条' };
            const parts = [];
            (fruit.mutations || []).forEach(function (m) {
                const k = map[m];
                if (k) {
                    player.landlord.bars[k]++;
                    if (parts.indexOf(labels[k]) < 0) parts.push(labels[k]);
                }
            });
            return parts;
        }

        function upgradeLandlordFieldTier(fieldIndex) {
            var fi = typeof fieldIndex === 'number' ? fieldIndex : parseInt(fieldIndex, 10);
            if (!Number.isFinite(fi) || fi < 0 || fi >= player.landlord.unlockedFields) {
                showLandlordNotification('无效田地！', 'error');
                return;
            }
            fieldIndex = fi;
            ensureLandlordFieldTiers(player.landlord);
            ensureLandlordBars(player.landlord);
            const cur = Number(player.landlord.fieldTiers[fieldIndex]) || 0;
            if (cur >= 4) {
                showLandlordNotification('该田地已是最高级流光土地！', 'info');
                return;
            }
            const cost = LANDLORD_TIER_UPGRADE_COST[cur];
            if (!cost) return;
            const have = player.landlord.bars[cost.barKey] || 0;
            if (have < cost.amount) {
                showLandlordNotification('升级需要' + cost.amount + cost.label + '，当前不足！', 'error');
                return;
            }
            player.landlord.bars[cost.barKey] -= cost.amount;
            player.landlord.fieldTiers[fieldIndex] = cur + 1;
            const plant = player.landlord.fields[fieldIndex];
            if (plant) {
                plant.fieldTier = cur + 1;
                const nt = LANDLORD_TIER_LAND_AFFIX[cur + 1];
                plant.mutations = (plant.mutations || []).filter(function (m) { return LANDLORD_ALL_LAND_AFFIXES.indexOf(m) < 0; });
                if (nt) plant.mutations.push(nt);
            }
            showLandlordNotification('田地' + (fieldIndex + 1) + '升级为' + LANDLORD_FIELD_TIER_NAMES[cur + 1] + '！', 'success');
            renderLandlordFields();
            updateLandlordStats();
            saveGame();
        }

        // 创建新植物
        function createNewLandlordPlant(seedName, fieldIndex) {
            const seedProps = getLandlordSeedProperties(seedName);
            if (!seedProps) {
                showLandlordNotification('种子数据异常：' + seedName, 'error');
                return null;
            }
            // 计算重量
            const maxWeight = seedProps.maxWeight;
            let weight = calculateLandlordWeight(maxWeight);
            
            // 计算生长时间（10分钟基础 + 每kg加1分钟）
            const growTime = 10 + Math.floor(weight);

            ensureLandlordFieldTiers(player.landlord);
            const tier = (typeof fieldIndex === 'number' && fieldIndex >= 0)
                ? (Number(player.landlord.fieldTiers[fieldIndex]) || 0)
                : 0;
            
            // 创建植物对象
            const plant = {
                type: seedName,
                weight: weight,
                plantedAt: Date.now(),
                growTime: growTime, // 分钟
                mutations: [], // 基础突变
                weatherMutations: [], // 天气突变
                specialMutation: false, // 特殊突变
                isMature: false,
                fieldTier: tier
            };
            
            // 应用基础突变（高等级田地必出对应 银土/金土/钻石土/流光土）
            applyLandlordBasicMutation(plant, { fieldTier: tier });
            
            return plant;
        }

        // 计算重量
        function calculateLandlordWeight(maxWeight) {
            const random = Math.random() * 100;
            let weightPercentage;
            
            if (random < 90) {
                weightPercentage = 0.05 + Math.random() * 0.05; // 5%-10%
            } else if (random < 94) {
                weightPercentage = 0.1 + Math.random() * 0.2; // 10%-30%
            } else if (random < 97) {
                weightPercentage = 0.3 + Math.random() * 0.5; // 30%-80%
            } else if (random < 99) {
                weightPercentage = 0.5 + Math.random() * 0.5; // 50%-100%
            } else {
                weightPercentage = Math.random(); // 0-100%
            }
            
            // 确保重量在最小值和最大值之间
            const minWeight = 0.1;
            return Math.max(minWeight, Math.min(maxWeight, maxWeight * weightPercentage));
        }

        // 应用基础突变；专属田地 fieldTier 1~4 必出 银土/金土/钻石土/流光土；opts.guaranteeBasic 为 true 时必出一条元素词条 银/金/水晶/流光（权重 2:1:1:1）
        function applyLandlordBasicMutation(plant, opts) {
            opts = opts || {};
            const fieldTier = opts.fieldTier != null ? opts.fieldTier : (Number(plant.fieldTier) || 0);
            if (fieldTier >= 1 && fieldTier <= 4) {
                const affix = LANDLORD_TIER_LAND_AFFIX[fieldTier];
                plant.mutations = [affix];
                player.landlord.stats.basicMutations++;
            } else if (opts.guaranteeBasic) {
                const r = Math.random() * 5;
                if (r < 2) plant.mutations.push("银");
                else if (r < 3) plant.mutations.push("金");
                else if (r < 4) plant.mutations.push("水晶");
                else plant.mutations.push("流光");
                player.landlord.stats.basicMutations++;
            } else {
                const random = Math.random() * 100;
                if (random < 95) {
                    // 无突变
                } else if (random < 97) {
                    plant.mutations.push("银");
                    player.landlord.stats.basicMutations++;
                } else if (random < 98) {
                    plant.mutations.push("金");
                    player.landlord.stats.basicMutations++;
                } else if (random < 99) {
                    plant.mutations.push("水晶");
                    player.landlord.stats.basicMutations++;
                } else {
                    plant.mutations.push("流光");
                    player.landlord.stats.basicMutations++;
                }
            }
            // 检查特殊突变 (5%几率)
            if (Math.random() * 100 < 5) {
                plant.specialMutation = true;
                player.landlord.stats.specialMutations++;
            }
        }

        // 收获植物
       function harvestLandlordPlant(fieldIndex) {
            const plant = player.landlord.fields[fieldIndex];
            
            if (!plant || !plant.isMature) {
                showLandlordNotification("植物尚未成熟！", "error");
                return;
            }
            
            // 计算价格
            const value = calculateLandlordPlantValue(plant);
            
            // 添加到果实仓库
            const fruit = {
                type: plant.type,
                weight: plant.weight,
                value: value,
                mutations: [...plant.mutations],
                weatherMutations: [...plant.weatherMutations],
                specialMutation: plant.specialMutation,
                harvestedAt: new Date().toLocaleString('zh-CN', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                harvestedTimestamp: Date.now(),
                isLocked: false,  // 添加锁定状态，默认为未锁定
                fieldTier: Number(plant.fieldTier) || 0
            };
            
            // 检查仓库容量
            if (player.landlord.fruitStorage.length >= 200) {
                showLandlordNotification("果实仓库已满！", "error");
                return;
            }
            
            player.landlord.fruitStorage.push(fruit);
            
            // 重新生成一个新植物（同种类，但重量和突变重新随机；继承当前田地等级）
            const newPlant = createNewLandlordPlant(plant.type, fieldIndex);
            
            // 注意：收获后天气突变重置，不复制旧植物的天气突变
            
            // 替换地块上的植物
            player.landlord.fields[fieldIndex] = newPlant;
            
            // 更新统计
            player.landlord.stats.totalHarvests++;
            player.landlord.stats.totalCoinsEarned += value;
            
            // 更新最高倍率
            const multiplier = calculateLandlordMultiplier(plant);
            if (multiplier > player.landlord.stats.highestMultiplier) {
                player.landlord.stats.highestMultiplier = multiplier;
            }
            
            // 更新显示
            renderLandlordFields();
            renderLandlordFruitStorage();
            updateLandlordStats();
            
            showLandlordNotification(`收获${plant.type}，价值${formatNumber(value)}地主币！`, "success");
            saveGame();
        }

        // 铲除植物
        function removeLandlordPlant(fieldIndex) {
            if (!player.landlord.fields[fieldIndex]) {
                showLandlordNotification("地块为空！", "error");
                return;
            }
            const plant = player.landlord.fields[fieldIndex];
            const fieldNo = fieldIndex + 1;
            const doRemove = () => {
                player.landlord.fields[fieldIndex] = null;
                renderLandlordFields();
                showLandlordNotification("植物已移除！", "info");
                saveGame();
            };
            const msg = `确认要铲除田地${fieldNo}的${plant.type}吗？此操作不可撤销。`;
            if (typeof showCustomConfirm === 'function') {
                showCustomConfirm(msg, function(confirmed) {
                    if (confirmed) doRemove();
                });
            } else {
                const ok = confirm(msg);
                if (!ok) return;
                doRemove();
            }
        }

        // 计算植物价值
        function calculateLandlordPlantValue(plant) {
            const seedProps = getLandlordSeedProperties(plant.type);
            const seedPrice = seedProps ? seedProps.price : 0;
            
            // 基础价格
            const basePrice = (1 + (seedPrice / 100)) * plant.weight;
            
            // 基础突变倍率
            let basicMultiplier = 1;
            plant.mutations.forEach(mutation => {
                basicMultiplier *= (mutationMultipliers[mutation] || 1);
            });
            
            // 天气突变倍率 (加法)
            let weatherMultiplier = 1;
            if (plant.weatherMutations.length > 0) {
                const weatherMultipliers = plant.weatherMutations.map(m => mutationMultipliers[m] || 1);
                weatherMultiplier = 1 + weatherMultipliers.reduce((a, b) => a + b) - weatherMultipliers.length;
            }
            
            // 特殊突变倍率
            const specialMultiplier = plant.specialMutation ? 5 : 1;
            
            // 最终价格
            let finalPrice = basePrice * basicMultiplier * weatherMultiplier * specialMultiplier;
            
            // 如果是特殊突变植物，应用额外的5倍倍率
            if (plant.specialMutation && specialMutations[getLandlordSeedBaseName(plant.type)]) {
                finalPrice *= 5;
            }

            finalPrice = applyLandlordLandExclusivePriceMult(plant, finalPrice);
            
            return Math.floor(finalPrice);
        }

        // 计算总倍率
        function calculateLandlordMultiplier(plant) {
            let multiplier = 1;
            
            plant.mutations.forEach(mutation => {
                multiplier *= (mutationMultipliers[mutation] || 1);
            });
            
            if (plant.weatherMutations.length > 0) {
                const weatherMultipliers = plant.weatherMutations.map(m => mutationMultipliers[m] || 1);
                multiplier *= (1 + weatherMultipliers.reduce((a, b) => a + b) - weatherMultipliers.length);
            }
            
            if (plant.specialMutation) {
                multiplier *= 5;
            }

            const tier = Number(plant.fieldTier) || 0;
            if (tier >= 1 && tier <= 4) {
                const affix = LANDLORD_TIER_LAND_AFFIX[tier];
                const em = LANDLORD_TIER_EXCLUSIVE_PRICE_MULT[affix];
                if (em && em > 1 && plant.mutations && plant.mutations.indexOf(affix) >= 0) {
                    multiplier *= em;
                }
            }
            
            return multiplier;
        }

        // 卖出果实
       function sellLandlordFruit(fruitIndex) {
    const fruit = player.landlord.fruitStorage[fruitIndex];
    
    if (!fruit) {
        showLandlordNotification("果实不存在！", "error");
        return;
    }
    
    // 检查是否锁定
    if (fruit.isLocked) {
        showLandlordNotification("该果实已锁定，无法卖出！", "error");
        return;
    }
    
    let lotteryEarned = 0;
    
    // 检查是否获得抽奖次数
    if (isFruitEligibleForLottery(fruit)) {
        lotteryEarned = 1;
        player.landlord.lottery.drawCount += lotteryEarned;
    }

    const barParts = grantLandlordBarsForSoldFruit(fruit);
    
    // 增加地主币
    player.landlord.coins += fruit.value;
    
    // 移除果实
    player.landlord.fruitStorage.splice(fruitIndex, 1);
    
    // 更新显示
    updateLandlordCoinDisplay();
    renderLandlordFruitStorage();
    updateLotteryDisplay();
    updateLandlordStats();
    
    let message = `卖出${fruit.type}，获得${formatNumber(fruit.value)}地主币`;
    if (barParts.length > 0) {
        message += '，获得' + barParts.join('、');
    }
    if (lotteryEarned > 0) {
        message += `，获得${lotteryEarned}次抽奖机会！`;
    }
    
    showLandlordNotification(message, "success");
    saveGame();
}
 // 添加锁定/解锁果实函数

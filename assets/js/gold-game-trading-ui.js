// 跑商界面
// 跑商系统
function toggleTradingSystem() {
    if (player.reincarnationCount < 1000) {
        alert("需要达到1000转才能开启跑商系统！");
        return;
    }
    
    initTradingData();
    updateCityPrices();
    
    const overlay = document.getElementById('tradingSystemOverlay');
    const ui = document.getElementById('tradingSystemUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
        if (window.priceRefreshCountdownTimer) {
            clearInterval(window.priceRefreshCountdownTimer);
            window.priceRefreshCountdownTimer = null;
        }
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateTradingUI();
        if (!window.priceRefreshCountdownTimer) {
            window._lastCountdownWasRefresh = false;
            window.priceRefreshCountdownTimer = setInterval(function() {
                const marketTab = document.getElementById('marketTab');
                const ui = document.getElementById('tradingSystemUI');
                if (ui && ui.style.display === 'block' && marketTab && marketTab.classList.contains('active')) {
                    var txt = getPriceRefreshCountdown();
                    if (txt === '（即将刷新）' && typeof updateCityPrices === 'function') {
                        var refreshed = updateCityPrices();
                        if (refreshed && typeof updateMarketTab === 'function') updateMarketTab();
                        txt = getPriceRefreshCountdown();
                    }
                    const el = document.getElementById('priceRefreshCountdown');
                    if (el) el.textContent = txt;
                }
            }, 1000);
        }
    }
}

// 更新跑商界面显示
function updateTradingUI() {
    if (!player || !player.trading || !player.nightClub) return;
    // 每次刷新界面时根据实际库存重算货仓占用，避免货仓数字与「我的库存」不一致
    if (typeof syncWarehouseUsedFromInventory === 'function') syncWarehouseUsedFromInventory();
    if (typeof ensureTradingWorldPulse === 'function') ensureTradingWorldPulse();
    // 更新状态栏
    var cityEl = document.getElementById('currentCity');
    if (cityEl) cityEl.textContent = player.trading.currentCity;
    var starEl = document.getElementById('tradingStarCoins');
    if (starEl) starEl.textContent = (player.nightClub.starCoins != null ? player.nightClub.starCoins : 0).toFixed(0);
    var capEl = document.getElementById('warehouseCapacity');
    if (capEl) capEl.textContent = (player.trading.warehouse.used != null ? player.trading.warehouse.used : 0) + '/' + (typeof getTradingTotalCapacity === 'function' ? getTradingTotalCapacity() : 20);
    var transEl = document.getElementById('transportType');
    if (transEl) transEl.textContent = (player.trading.transport && player.trading.transport.type) ? player.trading.transport.type : '手推车';
    addCancelTravelButton();
    // 添加库存统计按钮
    addInventorySummaryButton();

    // 更新市场标签页
    updateMarketTab();
    
    // 更新地图标签页
    updateMapTab();
    
    // 更新自动贸易标签页
    updateAutoTradeTab();
    
    // 更新经营管理标签页
    updateManagementTab();
    // 更新趣味玩法标签页（若当前显示）
    var funTab = document.getElementById('funTab');
    if (funTab && funTab.classList.contains('active')) updateFunTab();
}

// 更新市场标签页
function updateMarketTab() {
    const city = player.trading.currentCity;
    const goodsList = document.getElementById('cityGoodsList');
    const inventoryList = document.getElementById('playerInventory');
    
    // 更新价格刷新倒计时
    const countdownEl = document.getElementById('priceRefreshCountdown');
    if (countdownEl) countdownEl.textContent = getPriceRefreshCountdown();
    
    // 清空现有内容
    goodsList.innerHTML = '';
    inventoryList.innerHTML = '';
    
    // 生成商品列表（市场商品）
    Object.keys(tradingConfig.goods).forEach(good => {
        const price = player.trading.cityPrices[city][good];
        const goodConfig = tradingConfig.goods[good];
        
        const trend = getPriceTrend(good, city);
        const trendColor = getPriceTrendColorByTrend(trend);
        const trendHint = getPriceTrendHint(good, city);
        const goodElement = document.createElement('div');
        goodElement.className = 'good-item';
        goodElement.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr; gap: 10px; padding: 5px; border-bottom: 1px solid #444; align-items: center;">
                <div><strong>${good}</strong></div>
                <div>${price.toLocaleString()}星币</div>
                <div>${goodConfig.type}</div>
                <div>${goodConfig.slots}格</div>
                <div style="color: ${trendColor}; cursor: help;" title="${trendHint}">${trend}</div>
                <div>
                    <button onclick="buyGood('${good}', 1)" style="padding: 2px 8px; margin: 1px;">买1</button>
                    <button onclick="buyGood('${good}', 10)" style="padding: 2px 8px; margin: 1px;">买10</button>
                </div>
            </div>
        `;
        goodsList.appendChild(goodElement);
    });
    
    // 生成库存列表（玩家库存）
    Object.keys(player.trading.inventory).forEach(good => {
        const inventoryItem = player.trading.inventory[good];
        const quantity = inventoryItem.quantity;
        const currentPrice = player.trading.cityPrices[city][good];
        const averageCost = inventoryItem.averageCost;
        const totalCost = inventoryItem.totalCost;
        
        // 计算盈亏
        const currentValue = currentPrice * quantity;
        const profit = currentValue - totalCost;
        const profitRate = totalCost > 0 ? (profit / totalCost) * 100 : 0;
        
        const goodConfig = tradingConfig.goods[good];
        const profitColor = profit >= 0 ? '#4CAF50' : '#f44336'; // 绿色盈利，红色亏损
        const profitSign = profit >= 0 ? '+' : '';
        
        const inventoryElement = document.createElement('div');
        inventoryElement.className = 'inventory-item';
        inventoryElement.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr; gap: 10px; padding: 5px; border-bottom: 1px solid #444; align-items: center;">
                <div><strong>${good}</strong></div>
                <div>${quantity}个</div>
                <div>${currentPrice.toLocaleString()}星币</div>
                <div title="平均成本：${averageCost.toFixed(0)}星币">${averageCost.toFixed(0)}星币</div>
                <div style="color: ${profitColor}; font-weight: bold;">
                    ${profitSign}${profitRate.toFixed(1)}%
                </div>
                <div style="color: ${profitColor};">
                    ${profitSign}${Math.abs(profit).toFixed(0)}
                </div>
                <div>
                    <button onclick="sellGood('${good}', 1)" style="padding: 2px 8px; margin: 1px;">卖1</button>
                    <button onclick="sellGood('${good}', 10)" style="padding: 2px 8px; margin: 1px;">卖10</button>
                </div>
            </div>
        `;
        inventoryList.appendChild(inventoryElement);
    });
    
    // 如果没有库存，显示提示
    if (Object.keys(player.trading.inventory).length === 0) {
        inventoryList.innerHTML = '<div style="text-align: center; padding: 20px; color: #888;">暂无库存商品</div>';
    }
}
// 价格趋势：基于「当前价/基础价」判断，对跑商有参考意义
// 低于基础价=便宜=看涨(↑)适合在此买入；高于基础价=贵=看跌(↓)适合卖出或去别处买
function getPriceTrend(good, city) {
    var goodConfig, basePrice, currentPrice, ratio;
    try {
        goodConfig = tradingConfig.goods[good];
        if (!goodConfig || goodConfig.basePrice <= 0) return '→';
        basePrice = goodConfig.basePrice;
        currentPrice = (player.trading && player.trading.cityPrices && player.trading.cityPrices[city]) ? player.trading.cityPrices[city][good] : null;
        if (currentPrice == null) return '→';
        ratio = currentPrice / basePrice;
        if (ratio >= 1.25) return '↓↓↓';
        if (ratio >= 1.15) return '↓↓';
        if (ratio >= 1.05) return '↓';
        if (ratio <= 0.75) return '↑↑↑';
        if (ratio <= 0.85) return '↑↑';
        if (ratio <= 0.95) return '↑';
        return '→';
    } catch (e) {
        return '→';
    }
}

// 趋势说明（用于 title 提示）
function getPriceTrendHint(good, city) {
    var goodConfig, basePrice, currentPrice, ratio, pct;
    try {
        goodConfig = tradingConfig.goods[good];
        if (!goodConfig || goodConfig.basePrice <= 0) return '价格平稳';
        basePrice = goodConfig.basePrice;
        currentPrice = (player.trading && player.trading.cityPrices && player.trading.cityPrices[city]) ? player.trading.cityPrices[city][good] : null;
        if (currentPrice == null) return '价格平稳';
        ratio = currentPrice / basePrice;
        pct = Math.round((ratio - 1) * 100);
        if (ratio >= 1.05) return '当前价比基础价高' + pct + '%，偏高，适合卖出或去产地买';
        if (ratio <= 0.95) return '当前价比基础价低' + Math.abs(pct) + '%，偏低，适合在此买入';
        return '当前价接近基础价，平稳';
    } catch (e) {
        return '价格平稳';
    }
}

// 根据趋势符号返回颜色（不重复调用 getPriceTrend，避免与显示不一致）
function getPriceTrendColorByTrend(trend) {
    if (trend && trend.indexOf('↑') >= 0) return '#4CAF50';
    if (trend && trend.indexOf('↓') >= 0) return '#f44336';
    return '#FFC107';
}

// 获取价格趋势颜色（兼容其它调用处）
function getPriceTrendColor(good, city) {
    return getPriceTrendColorByTrend(getPriceTrend(good, city));
}
// 更新地图标签页
function updateMapTab() {
    const mapContainer = document.getElementById('mapTab');
    if (!mapContainer) return;
    
    mapContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px;">
            <h3>世界地图</h3>
            <div style="font-size: 0.9em; color: #aaa;">点击城市选择目的地</div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
            ${generateRegionMap()}
        </div>
        
        <div style="margin-bottom: 15px; padding: 12px; background: #2a2a2a; border-radius: 5px;">
            <h4 style="color: #FFD700; margin: 0 0 8px 0;">城市路线与时间</h4>
            <div style="font-size: 0.85em; color: #aaa; max-height: 200px; overflow-y: auto;">
                ${generateRoutesWithTime()}
            </div>
        </div>
        
        <div id="travelInfo" style="margin-top: 15px; padding: 15px; background: #333; border-radius: 5px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div><strong>当前位置:</strong> <span id="currentLocation">${player.trading.currentCity}</span></div>
                <div><strong>目标城市:</strong> <span id="targetCity">${player.trading.travelDestination || '-'}</span></div>
                <div><strong>预计时间:</strong> <span id="travelTime">${calculateTravelTime()}</span></div>
                <div><strong>状态:</strong> <span id="travelStatus">${getTravelStatus()}</span></div>
            </div>
            
            <div id="travelProgressContainer" style="${player.trading.isTraveling ? '' : 'display: none;'}">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>旅行进度</span>
                    <span id="progressPercentage">0%</span>
                </div>
                <div style="width: 100%; height: 10px; background: #444; border-radius: 5px;">
                    <div id="travelProgressBar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #4CAF50, #8BC34A); border-radius: 5px; transition: width 0.5s;"></div>
                </div>
            </div>
            
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button id="startTravelBtn" onclick="startTravel()" style="flex: 1; padding: 8px; ${getStartTravelButtonStyle()}">${getTravelButtonText()}</button>
                <button id="cancelTravelBtn" onclick="cancelTravel()" style="flex: 1; padding: 8px; background: #f44336; ${!player.trading.isTraveling ? 'display: none;' : ''}">取消旅行</button>
             <button onclick="showIntelligencePurchaseOptions('${player.trading.currentCity}')" style="flex: 1; padding: 8px; background: #9C27B0; color: white; border: none; border-radius: 3px; cursor: pointer;">购买情报</button>
            </div>
            
            ${player.trading.autoTrade.enabled ? `
                <div style="margin-top: 10px; padding: 8px; background: #2a2a2a; border-radius: 3px; border-left: 3px solid #FF9800;">
                    <div style="color: #FF9800; font-size: 0.9em; text-align: center;">
                        ⚠️ 自动贸易已启用，手动旅行已禁用
                    </div>
                </div>
            ` : ''}
        </div>
    <!-- 显示当前城市的情报信息 -->
        <div style="margin-top: 20px;">
            <h4>当前情报信息</h4>
            ${generateCurrentIntelligenceInfo()}
        </div>
    `;
    
    // 更新旅行进度（如果正在旅行中）
    if (player.trading.isTraveling) {
        updateTravelProgress();
    }
}
// 生成当前情报信息
function generateCurrentIntelligenceInfo() {
    if (!player || !player.trading || !player.trading.intelligence || !player.trading.currentCity || !player.trading.intelligence[player.trading.currentCity]) {
        return `
            <div style="text-align: center; color: #aaa; padding: 20px; background: #2a2a2a; border-radius: 5px;">
                <p>暂无可用情报</p>
                <p style="font-size: 0.9em;">点击上方"购买情报"按钮获取市场信息</p>
            </div>
        `;
    }
    
    const cityIntelligence = player.trading.intelligence[player.trading.currentCity];
    let infoHtml = '';
    const titles = { 'marketPrices': '市场价格', 'supplyDemand': '供需情况', 'futureTrends': '未来趋势', 'specialEvents': '特殊事件' };
    
    Object.keys(cityIntelligence).forEach(type => {
        const intel = cityIntelligence[type];
        const expiryTime = intel.expiryTime != null ? intel.expiryTime : 0;
        const isExpired = Date.now() > expiryTime;
        const remainingMin = isExpired ? 0 : Math.max(0, Math.ceil((expiryTime - Date.now()) / (60 * 1000)));
        const borderColor = isExpired ? "#f44336" : "#4CAF50";
        const textColor = isExpired ? "#f44336" : "#4CAF50";
        const subColor = isExpired ? "#f44336" : "#aaa";
        const statusText = isExpired ? "已过期" : ("剩余 " + remainingMin + " 分钟");
        infoHtml += "<div style=\"background: #2a2a2a; border-radius: 5px; padding: 15px; margin-bottom: 10px; border-left: 4px solid " + borderColor + ";\">" +
            "<div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;\">" +
            "<div style=\"font-weight: bold; color: " + textColor + ";\">" + titles[type] + "</div>" +
            "<div style=\"font-size: 0.8em; color: " + subColor + ";\">" + statusText + "</div>" +
            "</div>" +
            "<div style=\"font-size: 0.85em; color: #888;\">购买: " + (intel.purchaseTime ? new Date(intel.purchaseTime).toLocaleString() : "-") + " · " + (intel.price != null ? intel.price : 0).toLocaleString() + "星币</div>" +
            "<div style=\"margin-top: 10px;\">" +
            "<button onclick=\"viewIntelligenceDetails('" + player.trading.currentCity + "', '" + type + "')\" style=\"background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 0.8em;\">查看详情</button>" +
            "</div></div>";
    });
    
    return infoHtml;
}

// 查看情报详情
function viewIntelligenceDetails(city, type) {
    const intelligence = player.trading.intelligence[city][type];
    showIntelligenceDetails(city, type, intelligence.data, intelligence.isFake);
}

// 添加情报配置到游戏配置
function initTradingConfig() {
    if (!tradingConfig.intelligence) {
        tradingConfig.intelligence = {
            marketPrices: {
                price: 5000,
                duration: 60, // 60分钟
                description: "获取所有商品的当前市场价格"
            },
            supplyDemand: {
                price: 8000,
                duration: 45, // 45分钟
                description: "了解市场供需情况，发现潜在机会"
            },
            futureTrends: {
                price: 12000,
                duration: 30, // 30分钟
                description: "预测未来价格趋势，把握市场动向"
            },
            specialEvents: {
                price: 15000,
                duration: 20, // 20分钟
                description: "获取特殊市场事件信息，抢占先机"
            }
        };
    }
}
function getStartTravelButtonStyle() {
    if (player.trading.autoTrade.enabled) {
        return 'background: #666; color: #999; cursor: not-allowed;';
    } else if (player.trading.isTraveling) {
        return 'background: #666; cursor: not-allowed;';
    } else {
        return 'background: #4CAF50; color: white; cursor: pointer;';
    }
}
// 生成「城市路线与时间」列表（基础行程时间，双向只按起点列一次）
function generateRoutesWithTime() {
    const cities = tradingConfig.cities || {};
    const list = [];
    Object.keys(cities).forEach(from => {
        const conns = cities[from].connections || [];
        const parts = conns.map(to => {
            const baseMin = (cities[to] && cities[to].travelTime != null) ? cities[to].travelTime : '-';
            return `${to}(${baseMin}分)`;
        });
        if (parts.length) list.push(`${from} → ${parts.join('、')}`);
    });
    return list.length ? list.join('<br>') : '暂无路线';
}

function generateRegionMap() {
    // 从 tradingConfig.cities 动态生成区域与城市，新城市自动显示
    const regions = {};
    Object.keys(tradingConfig.cities).forEach(city => {
        const region = tradingConfig.cities[city].region;
        if (!regions[region]) regions[region] = [];
        regions[region].push(city);
    });
    const regionOrder = ['森林区', '山区', '沿海区', '平原区', '沙漠区', '都市区', '边陲区', '远境', '极远境'];
    const orderedRegionKeys = regionOrder.filter(r => regions[r]);
    Object.keys(regions).forEach(r => { if (orderedRegionKeys.indexOf(r) === -1) orderedRegionKeys.push(r); });
    
    let html = '';
    orderedRegionKeys.forEach(region => {
        html += `
            <div class="region" style="background: #2a2a2a; padding: 10px; border-radius: 5px;">
                <h4 style="color: #FFD700; margin-top: 0; border-bottom: 1px solid #444; padding-bottom: 5px;">${region}</h4>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                    ${regions[region].map(city => generateCityButton(city)).join('')}
                </div>
            </div>
        `;
    });
    
    return html;
}

// 计算到某城市的预计行程时间（分钟，含运输/停车加成）
function getTravelTimeToCity(destinationCity) {
    const cityCfg = tradingConfig.cities[destinationCity];
    if (!cityCfg) return null;
    const baseTime = cityCfg.travelTime;
    const speedBonus = player.trading.transport && player.trading.transport.speedBonus ? player.trading.transport.speedBonus : 0;
    const parkingLevel = (player.parking && typeof player.parking.level === 'number') ? player.parking.level : 0;
    const parkingReduce = Math.min(parkingLevel / 33, 1.21);
    return Math.max(0.1, (baseTime * (100 - speedBonus) / 100) - parkingReduce);
}

// 生成城市按钮（含行程时间）
function generateCityButton(city) {
    const isCurrentCity = player.trading.currentCity === city;
    const isSelected = player.trading.travelDestination === city;
    const isConnected = tradingConfig.cities[player.trading.currentCity].connections.includes(city);
    const timeStr = isCurrentCity ? '当前' : (isConnected ? getTravelTimeToCity(city).toFixed(1) + '分钟' : '-');
    
    let buttonStyle = 'padding: 8px; border-radius: 3px; border: none; cursor: pointer;';
    
    // 如果自动贸易启用，禁用所有城市按钮
    if (player.trading.autoTrade.enabled) {
        buttonStyle += 'background: #666; color: #999; cursor: not-allowed;';
    } else if (isCurrentCity) {
        buttonStyle += 'background: #FFD700; color: black; font-weight: bold;';
    } else if (isSelected) {
        buttonStyle += 'background: #4CAF50; color: white;';
    } else if (isConnected) {
        buttonStyle += 'background: #2196F3; color: white;';
    } else {
        buttonStyle += 'background: #666; color: white; cursor: not-allowed;';
    }
    
    return `
        <button 
            onclick="selectDestination('${city}')" 
            style="${buttonStyle}"
            ${(player.trading.autoTrade.enabled || !isConnected && !isCurrentCity) ? 'disabled' : ''}
            title="${player.trading.autoTrade.enabled ? '自动贸易已启用，无法手动选择' : (!isConnected && !isCurrentCity ? '未连接到此城市' : `点击选择${city}，预计${timeStr}`)}"
        >
            ${city}${timeStr !== '当前' ? ' (' + timeStr + ')' : ''}
        </button>
    `;
}
function calculateTravelTime() {
    if (!player.trading.travelDestination) return '-';
    const cityCfg = tradingConfig.cities[player.trading.travelDestination];
    if (!cityCfg) return '-';
    const baseTime = cityCfg.travelTime;
    const speedBonus = player.trading.transport.speedBonus || 0;
    const parkingLevel = (player.parking && typeof player.parking.level === 'number') ? player.parking.level : 0;
    const parkingReduce = Math.min(parkingLevel / 33, 1.21);
    let actualTime = Math.max(0.1, (baseTime * (100 - speedBonus) / 100) - parkingReduce);
    var empTravel = (typeof getEmployeeTravelSpeedBonus === 'function') ? getEmployeeTravelSpeedBonus() : 0;
    if (empTravel > 0) actualTime = Math.max(0.1, actualTime * (1 - empTravel / 100));
    if (player.trading.travelTimeReductionEnd && Date.now() <= player.trading.travelTimeReductionEnd && (player.trading.travelTimeReduction || 0) > 0)
        actualTime = Math.max(0.1, actualTime * (1 - player.trading.travelTimeReduction));
    return `${actualTime.toFixed(1)}分钟`;
}

function getTravelStatus() {
    if (player.trading.isTraveling) {
        const now = Date.now();
        const progress = Math.min(100, ((now - player.trading.travelStartTime) / (player.trading.travelEndTime - player.trading.travelStartTime)) * 100);
        return `旅行中... ${progress.toFixed(1)}%`;
    }
    return player.trading.travelDestination ? '准备出发' : '选择目的地';
}

// 获取旅行按钮文本
function getTravelButtonText() {
    if (player.trading.autoTrade.enabled) {
        return '自动贸易中';
    } else if (player.trading.isTraveling) {
        return '旅行中';
    } else {
        return player.trading.travelDestination ? '开始旅行' : '选择目的地';
    }
}
function selectDestination(city) {
    // 如果自动贸易启用，禁用手动选择目的地
    if (player.trading.autoTrade.enabled) {
        logAction("自动贸易已启用，无法手动选择目的地", "warning");
        return;
    }
    
    if (player.trading.isTraveling) {
        logAction("当前正在旅行中，无法更改目的地", "error");
        return;
    }
    
    if (city === player.trading.currentCity) {
        logAction("已经在当前城市", "info");
        return;
    }
    
    // 检查是否连接
    if (!tradingConfig.cities[player.trading.currentCity].connections.includes(city)) {
        logAction(`无法直接前往${city}，需要先连接到该城市`, "error");
        return;
    }
    
    player.trading.travelDestination = city;
    logAction(`已选择目的地：${city}`, "info");
    
    // 更新界面
    updateMapTab();
}

// 更新自动贸易标签页

// 修改自动贸易界面HTML
function updateAutoTradeTab() {
    const autoTab = document.getElementById('autoTab');
    if (!autoTab) return;
    
    // 检查是否有保存的路线
    const hasRoutes = player.trading.autoTrade.routes && player.trading.autoTrade.routes.length > 0;
    
    // 获取当前城市的采购和销售机会数量
    const purchaseOpportunities = getAllPurchasableGoods().length;
    const saleOpportunities = getAllSalableGoods().length;
    
    autoTab.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3>智能灵活贸易系统 ${player.trading.autoTrade.backgroundMode ? '(后台运行中)' : ''}</h3>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                <label>
                    <input type="checkbox" id="autoTradeEnabled" onchange="toggleAutoTrade()" ${player.trading.autoTrade.enabled ? 'checked' : ''} ${!hasRoutes ? 'disabled' : ''}>
                    启用自动贸易
                </label>
                <span id="autoTradeState" style="color: #FFD700; font-weight: bold;">${getAutoTradeStateText()}</span>
                <span id="backgroundIndicator" style="color: #4CAF50; font-size: 0.9em; ${player.trading.autoTrade.backgroundMode ? '' : 'display: none;'}">
                    ✓ 后台运行中
                </span>
                <button onclick="showAutoTradeLog()" style="margin-left: auto; background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">查看日志</button>
            </div>
            
            ${!hasRoutes ? `
                <div style="background: #2a2a2a; border-left: 4px solid #FF9800; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                    <h4 style="color: #FF9800; margin-top: 0;">⚠️ 未设置自动贸易路线</h4>
                    <p style="margin: 0; color: #aaa;">请先设置自动贸易路线才能启用自动贸易功能。</p>
                </div>
            ` : generateAutoTradeProgressBar()}
            
            <div id="autoTradeStatus" class="auto-trade-status" style="${player.trading.autoTrade.enabled ? '' : 'display: none;'}">
                <h4>当前状态 - ${player.trading.currentCity}</h4>
                
                <!-- 机会概览 -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div style="background: rgba(76,175,80,0.1); border-left: 4px solid #4CAF50; padding: 10px; border-radius: 4px;">
                        <div style="font-size: 0.9em; color: #aaa;">采购机会</div>
                        <div style="font-size: 1.2em; font-weight: bold; color: #4CAF50;">${purchaseOpportunities}</div>
                    </div>
                    <div style="background: rgba(33,150,243,0.1); border-left: 4px solid #2196F3; padding: 10px; border-radius: 4px;">
                        <div style="font-size: 0.9em; color: #aaa;">销售机会</div>
                        <div style="font-size: 1.2em; font-weight: bold; color: #2196F3;">${saleOpportunities}</div>
                    </div>
                </div>
                
                <div class="auto-trade-stats">
                    <div class="stat-item">
                        <div class="stat-label">当前城市</div>
                        <div class="stat-value">${player.trading.currentCity}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">运行模式</div>
                        <div class="stat-value">${player.trading.autoTrade.backgroundMode ? '后台运行' : '前台运行'}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">贸易状态</div>
                        <div class="stat-value">${getFlexibleTradeStateText()}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">城市停留</div>
                        <div class="stat-value">${formatTimeInCity()}分钟</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">货仓使用率</div>
                        <div class="stat-value">${calculateWarehouseUsage()}%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">货仓使用率阈值</div>
                        <div class="stat-value">${Math.round((typeof getEffectiveMaxWarehouseUsage === 'function' ? getEffectiveMaxWarehouseUsage() : (player.trading.autoTrade.purchaseSettings.maxWarehouseUsage || 0.8)) * 100)}%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">可用资金</div>
                        <div class="stat-value">${player.nightClub.starCoins.toLocaleString()}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">今日利润</div>
                        <div class="stat-value" style="color: ${player.trading.tradeVolumeToday >= 0 ? '#4CAF50' : '#f44336'}">
                            ${player.trading.tradeVolumeToday >= 0 ? '+' : ''}${player.trading.tradeVolumeToday.toLocaleString()}
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">总利润</div>
                        <div class="stat-value" style="color: ${player.trading.autoTrade.stats.totalProfit >= 0 ? '#4CAF50' : '#f44336'}">
                            ${player.trading.autoTrade.stats.totalProfit >= 0 ? '+' : ''}${player.trading.autoTrade.stats.totalProfit.toLocaleString()}
                        </div>
                    </div>
                </div>
                 
                <div class="auto-trade-controls">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-top: 15px;">
                        <button onclick="pauseAutoTrade()" class="control-btn warning">${player.trading.autoTrade.backgroundMode ? '暂停后台' : '暂停'}</button>
                        <div class="auto-trade-controls">
                        <button onclick="stopAutoTrade()" class="control-btn danger">停止</button>
                         
                        <button onclick="showAutoTradeLog()" class="control-btn primary">查看日志</button>
                        ${player.trading.autoTrade.backgroundMode ? 
                         '<button onclick="forceForeground()" class="control-btn secondary">切换到前台</button>' : ''}
                        <button onclick="forceMoveToNewCity()" class="control-btn info">前往新城市</button>
                        <button onclick="forceStayInCurrentCity()" class="control-btn success">停留当前城市</button>
                        <button onclick="resetAutoTradeState()" class="control-btn default">重置状态</button>
                        <button onclick="forceCheckOpportunities()" class="control-btn primary">立即检查机会</button>
                    </div>
                </div>
                
                ${isFrequentTravelDetected() ? `
                    <div style="margin-top: 15px; padding: 10px; background: #f44336; border-radius: 5px; text-align: center;">
                        <strong style="color: white;">⚠️ 检测到频繁旅行，建议重置状态或停留当前城市</strong>
                    </div>
                ` : ''}
            </div>
        </div>
        
        
        <div id="autoTradeSettings" style="${player.trading.autoTrade.enabled ? 'display: none;' : 'display: block;'}">
            <h4>设置灵活贸易路线</h4>
            <p style="color: #aaa; font-size: 0.9em; margin: 0 0 10px 0;">只需设置：<strong>最小利润率、单次资金、勾选贸易商品</strong>并点击「保存路线」，无需选择采购城/销售城，系统会自动在各城市寻找买卖机会。</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div>
                    <label>最小利润率:</label>
                    <input type="number" id="minProfitMargin" value="10">%
                </div>
                <div>
                    <label>单次资金:</label>
                    <input type="number" id="tradeCapital" value="10000">
                </div>
            </div>
            
            <h4>选择贸易商品（最多50种）</h4>
            <div id="goodsSelection" style="margin-bottom: 15px;">
                ${generateGoodsSelection()}
            </div>
            
            <h4>采购策略设置</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div>
                    <label>最多商品种类:</label>
                    <input type="number" id="maxGoods" value="${(player.trading.autoTrade.purchaseSettings.maxGoods || 50)}" min="1" max="50" title="可选择1-50种贸易商品" onchange="if(typeof updateSelectedGoodsCount==='function')updateSelectedGoodsCount()">
                </div>
                <div>
                    <label>采购策略:</label>
                    <select id="purchaseStrategy">
                        <option value="priceDesc">价格降序（先买最贵的）</option>
                        <option value="priceAsc">价格升序（先买最便宜的）</option>
                        <option value="profitMargin">利润率优先</option>
                    </select>
                </div>
                <div>
                    <label>最大货仓使用率:</label>
                    <input type="number" id="maxWarehouseUsage" value="${Math.round((typeof getEffectiveMaxWarehouseUsage === 'function' ? getEffectiveMaxWarehouseUsage() : (player.trading.autoTrade.purchaseSettings.maxWarehouseUsage || 0.8)) * 100)}" min="50" max="100" title="与存档一致，最高 100%">%
                </div>
                <div>
                    <label>价格容忍度:</label>
                    <input type="number" id="priceTolerance" value="0" min="0" max="50">%
                </div>
            </div>
            
            <h4>灵活贸易设置</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div>
                    <label>最大城市停留时间:</label>
                    <input type="number" id="maxCityStayTime" value="60" min="10" max="240">分钟
                </div>
                <div>
                    <label>探索新城市概率:</label>
                    <input type="number" id="explorationChance" value="20" min="0" max="100">%
                </div>
                <div>
                    <label>最小利润阈值:</label>
                    <input type="number" id="minProfitThreshold" value="5" min="0" max="50">%
                </div>
                <div>
                    <label>价格监控:</label>
                    <select id="priceMonitoring">
                        <option value="true">启用</option>
                        <option value="false">禁用</option>
                    </select>
                </div>
                <div>
                    <label>库存总金额上限:</label>
                    <input type="number" id="maxInventoryValue" value="${((player.trading.autoTrade.flexibleTrade || {}).maxInventoryValue) || 0}" min="0" placeholder="0=不限制" title="库存总成本超过此值则不再购买">
                </div>
            </div>
            
            <button onclick="saveAutoTradeRoute()" style="background: #4CAF50; padding: 8px 16px;">保存路线</button>
        </div>
        
       <div id="autoTradeRoutes" style="margin-top: 20px;">
            <h4>已保存的路线 ${hasRoutes ? `(${player.trading.autoTrade.routes.length}条)` : ''}</h4>
            ${hasRoutes ? generateAutoTradeRoutes() : `
                <div style="text-align: center; color: #aaa; padding: 20px; background: #2a2a2a; border-radius: 5px;">
                    <p>暂无保存的路线</p>
                    <p style="font-size: 0.9em;">请在下方设置贸易路线</p>
                </div>
            `}
        </div>
        
        <div style="margin-top: 20px; padding: 10px; background: #2a2a2a; border-radius: 5px; border-left: 4px solid #4CAF50;">
            <h4 style="color: #4CAF50; margin-top: 0;">灵活贸易说明</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.9em;">
                <li>系统会在任何城市寻找采购和销售机会</li>
                <li>到达新城市后会同时检查采购和销售机会</li>
                <li>货仓满了或资金不足时会自动前往其他城市</li>
                <li>会根据价格自动决定最佳行动</li>
                <li>会自动探索新城市寻找更好的机会</li>
                <li>可以手动控制前往新城市或停留当前城市</li>
                <li>检测到频繁旅行时会自动重置状态</li>
            </ul>
        </div>
    `;
    
    // 如果自动贸易启用且界面打开，启动进度条更新定时器
    if (player.trading.autoTrade.enabled && !player.trading.autoTrade.backgroundMode) {
        startProgressUpdateTimer();
    }
}

function isFrequentTravelDetected() {
    const recentLogs = player.trading.autoTrade.logs.slice(0, 10);
    const travelLogs = recentLogs.filter(log => log.message.includes("前往") || log.message.includes("旅行"));
    
    // 如果最近10条日志中有5条以上是关于旅行的，认为是频繁旅行
    return travelLogs.length >= 5;
}
function forceCheckOpportunities() {
    if (!player.trading.autoTrade.enabled) {
        logAction("自动贸易未启用", "error");
        return;
    }
    
    addAutoTradeLog("手动触发检查采购和销售机会", "info");
    checkBothPurchaseAndSaleOpportunities();
}


function resetAutoTradeState() {
    addAutoTradeLog("手动重置自动贸易状态", "info");
    
    // 停止所有旅行
    if (player.trading.isTraveling) {
        if (player.trading.travelInterval) {
            clearInterval(player.trading.travelInterval);
            player.trading.travelInterval = null;
        }
        player.trading.isTraveling = false;
        player.trading.travelDestination = '';
    }
    
    // 重置自动贸易状态
    player.trading.autoTrade.currentState = 'monitoring';
    player.trading.autoTrade.currentProgress = 0;
    player.trading.autoTrade.currentRoute = player.trading.autoTrade.routes.length > 0 ? player.trading.autoTrade.routes[0] : null;
    player.trading.autoTrade.currentCityStayStart = tradingNow();
    player.trading.autoTrade.lastUpdate = tradingNow();
    player.trading.autoTrade.nextMonitorTime = tradingNow() + 30000; // 30秒后再开始监控（离线模拟时用模拟时间）
    
    // 清除频繁旅行的检测标志
    if (player.trading.autoTrade.frequentTravelDetection) {
        delete player.trading.autoTrade.frequentTravelDetection;
    }
    
    addAutoTradeLog("自动贸易状态已重置，将在当前城市重新开始监控", "success");
    
    // 更新界面
    updateAutoTradeTab();
    updateMapTab();
}
function forceStayInCurrentCity() {
    addAutoTradeLog("手动设置为停留在当前城市", "info");
    
    // 重置当前城市停留时间
    player.trading.autoTrade.currentCityStayStart = tradingNow();
    
    // 设置较长的停留时间阈值
    player.trading.autoTrade.nextMonitorTime = tradingNow() + 600000; // 10分钟后再检查是否移动（离线模拟时用模拟时间）
    
    // 强制设置为监控状态
    player.trading.autoTrade.currentState = 'monitoring';
    
    addAutoTradeLog("将在当前城市停留至少10分钟，深入寻找机会", "success");
    updateAutoTradeTab();
}


function getFlexibleTradeStateText() {
    if (!player.trading.autoTrade.enabled) return '未启用';
    
    switch (player.trading.autoTrade.currentState) {
        case 'idle': return '空闲';
        case 'buying': return '采购中';
        case 'traveling': return `旅行中 (${getTravelProgress()}%)`;
        case 'selling': return '销售中';
        case 'monitoring': return '监控价格';
        default: return '未知';
    }
}
function getTravelProgress() {
    if (!player.trading.isTraveling) return 0;
    
    const now = Date.now();
    const totalTime = player.trading.travelEndTime - player.trading.travelStartTime;
    const elapsedTime = now - player.trading.travelStartTime;
    const progress = Math.min(100, (elapsedTime / totalTime) * 100);
    
    return progress.toFixed(1);
}
function formatTimeInCity() {
    const now = Date.now();
    const timeInCity = now - player.trading.autoTrade.currentCityStayStart;
    const minutes = Math.floor(timeInCity / (1000 * 60));
    return minutes;
}
function forceMoveToNewCity() {
    if (!player.trading.autoTrade.enabled) {
        logAction("自动贸易未启用", "error");
        return;
    }
    
    if (player.trading.isTraveling) {
        logAction("当前正在旅行中，无法更改目的地", "error");
        return;
    }
    
    addAutoTradeLog("手动触发前往新城市", "info");
    decideNextDestination();
}

function forceForeground() {
    if (player.trading.autoTrade.backgroundMode) {
        exitBackgroundMode();
    }
}
function generateGoodsSelection() {
    const maxGoods = player.trading.autoTrade.purchaseSettings.maxGoods || 50;
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">';
    
    Object.keys(tradingConfig.goods).forEach(good => {
        const goodConfig = tradingConfig.goods[good];
        const basePrice = goodConfig.basePrice;
        
        html += `
            <div class="good-selection-item" style="border: 1px solid #444; border-radius: 5px; padding: 10px; background: #2a2a2a;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <input type="checkbox" id="good_${good}" value="${good}" onchange="toggleGoodSelection('${good}')">
                    <label for="good_${good}" style="margin-left: 5px; font-weight: bold;">${good}</label>
                </div>
                <div style="font-size: 0.9em; color: #aaa;">
                    <div>类型: ${goodConfig.type}</div>
                    <div>基础价格: ${basePrice.toLocaleString()}</div>
                    <div>占用空间: ${goodConfig.slots}格</div>
                </div>
                <div id="priceInput_${good}" style="display: none; margin-top: 8px;">
                    <label style="font-size: 0.9em;">最大买入价:</label>
                    <input type="number" id="maxPrice_${good}" value="${Math.round(basePrice * 1.2)}" style="width: 100%; padding: 3px; background: #333; color: white; border: 1px solid #555;">
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    html += '<div id="selectedGoodsCount" style="margin-top: 10px; color: #aaa;">已选择 0/' + maxGoods + ' 种商品</div>';
    
    return html;
}

function toggleGoodSelection(good) {
    const checkbox = document.getElementById(`good_${good}`);
    const priceInput = document.getElementById(`priceInput_${good}`);
    
    // 获取最多商品种类限制（优先从输入框读取，否则从设置）
    const maxGoodsInput = document.getElementById('maxGoods');
    const maxGoods = maxGoodsInput ? Math.min(50, Math.max(1, parseInt(maxGoodsInput.value) || 50)) : (player.trading.autoTrade.purchaseSettings.maxGoods || 50);
    
    // 检查已选择的商品数量
    const selectedCount = document.querySelectorAll('#goodsSelection input[type="checkbox"]:checked').length;
    
    if (selectedCount > maxGoods) {
        // 超过限制，取消选择
        checkbox.checked = false;
        priceInput.style.display = 'none';
        updateSelectedGoodsCount();
        logAction(`最多只能选择${maxGoods}种商品`, "error");
        return;
    }
    
    // 显示或隐藏价格输入框
    priceInput.style.display = checkbox.checked ? 'block' : 'none';
    
    // 更新已选择商品计数
    updateSelectedGoodsCount();
}

// 更新已选择商品计数

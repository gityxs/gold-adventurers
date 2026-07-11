// 跑商买卖与旅行
function updateSelectedGoodsCount() {
    const selectedCount = document.querySelectorAll('#goodsSelection input[type="checkbox"]:checked').length;
    const maxGoodsInput = document.getElementById('maxGoods');
    const maxGoods = maxGoodsInput ? Math.min(50, Math.max(1, parseInt(maxGoodsInput.value) || 50)) : (player.trading.autoTrade.purchaseSettings.maxGoods || 50);
    const countEl = document.getElementById('selectedGoodsCount');
    if (countEl) countEl.textContent = `已选择 ${selectedCount}/${maxGoods} 种商品`;
}
function calculateWarehouseUsage() {
    const totalCapacity = getTradingTotalCapacity();
    if (totalCapacity === 0) return 0;
    
    const usageRate = (player.trading.warehouse.used / totalCapacity) * 100;
    return usageRate.toFixed(1);
}

// 获取自动贸易目标
function getAutoTradeTarget() {
    if (!player.trading.autoTrade.currentRoute) return '-';
    
    switch (player.trading.autoTrade.currentState) {
        case 'buying':
            return player.trading.autoTrade.currentRoute.buyCity ? `在${player.trading.autoTrade.currentRoute.buyCity}采购` : `在${player.trading.currentCity}采购`;
        case 'traveling':
            return `前往${player.trading.travelDestination}`;
        case 'selling':
            return player.trading.autoTrade.currentRoute.sellCity ? `在${player.trading.autoTrade.currentRoute.sellCity}销售` : `在${player.trading.currentCity}销售`;
        default:
            return '等待指令';
    }
}
function savePurchaseStrategy() {
    const maxGoods = parseInt(document.getElementById('maxGoods').value);
    const purchaseStrategy = document.getElementById('purchaseStrategy').value;
    const maxWarehouseUsage = parseInt(document.getElementById('maxWarehouseUsage').value) / 100;
    const priceTolerance = parseInt(document.getElementById('priceTolerance').value) / 100;
    
    player.trading.autoTrade.purchaseSettings.maxGoods = maxGoods;
    player.trading.autoTrade.purchaseSettings.purchaseStrategy = purchaseStrategy;
    player.trading.autoTrade.purchaseSettings.maxWarehouseUsage = maxWarehouseUsage;
    player.trading.autoTrade.purchaseSettings.priceTolerance = priceTolerance;
    
    logAction("采购策略设置已保存", "success");
}


function generateAutoTradeProgressBar() {
    if (!player.trading.autoTrade.enabled) {
        return '<div style="text-align: center; color: #aaa; padding: 10px;">自动贸易未启用</div>';
    }
    
    let progressPercent = 0;
    let statusText = '';
    
    if (player.trading.isTraveling) {
        progressPercent = getTravelProgress();
        statusText = `前往 ${player.trading.travelDestination}`;
    } else {
        switch (player.trading.autoTrade.currentState) {
            case 'buying':
                progressPercent = 50;
                statusText = `在 ${player.trading.currentCity} 采购`;
                break;
            case 'selling':
                progressPercent = 50;
                statusText = `在 ${player.trading.currentCity} 销售`;
                break;
            case 'monitoring':
                progressPercent = 25;
                statusText = `在 ${player.trading.currentCity} 监控价格`;
                break;
            default:
                progressPercent = 0;
                statusText = '等待开始';
        }
    }
    
    return `
        <div class="auto-trade-progress" style="margin-bottom: 15px;">
            <div class="progress-label">
                <span>${statusText}</span>
                <span id="autoTravelPercentage">${progressPercent}%</span>
            </div>
            <div class="progress-bar">
                <div id="autoTravelProgress" class="progress-fill" style="width: ${progressPercent}%;"></div>
            </div>
        </div>
    `;
}
function startProgressUpdateTimer() {
    // 清除现有定时器
    stopProgressUpdateTimer();
    
    // 启动新定时器
    window.autoTradeProgressInterval = registerInterval(() => {
        safeUpdateAutoTradeProgressBar();
    }, 1000);
}

// 生成自动贸易进度显示
function generateAutoTradeProgress() {
    if (player.trading.autoTrade.currentState === 'traveling') {
        const progressPercent = Math.min(100, (player.trading.autoTrade.currentProgress / player.trading.autoTrade.totalTravelTime) * 100);
        return `
            <div style="margin-top: 10px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>旅行进度</span>
                    <span>${progressPercent.toFixed(1)}%</span>
                </div>
                <div style="width: 100%; height: 10px; background: #444; border-radius: 5px;">
                    <div style="height: 100%; width: ${progressPercent}%; background: linear-gradient(90deg, #4CAF50, #8BC34A); border-radius: 5px; transition: width 0.5s;"></div>
                </div>
                <div style="text-align: center; margin-top: 5px; font-size: 0.8em; color: #aaa;">
                    前往 ${player.trading.travelDestination}
                </div>
            </div>
        `;
    }
    
    if (player.trading.autoTrade.currentState === 'buying' || player.trading.autoTrade.currentState === 'selling') {
        const action = player.trading.autoTrade.currentState === 'buying' ? '采购' : '销售';
        const route = player.trading.autoTrade.currentRoute;
        const city = (route && (action === 'buying' ? route.buyCity : route.sellCity)) || player.trading.currentCity || '-';
        const good = (route && route.goods && route.goods[0]) ? route.goods[0].good : (route && route.good) || '商品';
        
        return `
            <div style="text-align: center; margin-top: 10px;">
                <div style="color: #FFD700; font-weight: bold;">${action}中...</div>
                <div style="font-size: 0.9em; color: #aaa;">
                    在${city}${action}${good}
                </div>
            </div>
        `;
    }
    
    return '<div style="text-align: center; color: #aaa; margin-top: 10px;">等待开始...</div>';
}

// 生成自动贸易路线列表
function generateAutoTradeRoutes() {
    if (!player.trading.autoTrade.routes || player.trading.autoTrade.routes.length === 0) {
        return '<div style="text-align: center; color: #aaa; padding: 20px;">暂无保存的路线</div>';
    }
    
    let routesHtml = '';
    player.trading.autoTrade.routes.forEach((route, index) => {
        const isActive = player.trading.autoTrade.currentRoute === route;
        
        routesHtml += `
            <div class="auto-trade-route ${isActive ? 'active' : ''}" style="border: 1px solid #444; border-radius: 5px; padding: 15px; margin-bottom: 10px; background: #2a2a2a;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h5 style="margin: 0; color: #FFD700;">灵活贸易路线 ${index + 1}</h5>
                    <span style="color: ${isActive ? '#4CAF50' : '#aaa'}">${isActive ? '运行中' : '已保存'}</span>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">贸易商品:</div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 5px;">
                        ${route.goods.map(item => `
                            <div style="background: #333; padding: 5px; border-radius: 3px; font-size: 0.9em;">
                                <div>${item.good}</div>
                                <div style="color: #aaa; font-size: 0.8em;">最大买入: ${item.maxBuyPrice.toLocaleString()}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 10px;">
                    <div>
                        <div style="font-size: 0.9em; color: #aaa;">最小利润率</div>
                        <div>${route.minProfitMargin}%</div>
                    </div>
                    <div>
                        <div style="font-size: 0.9em; color: #aaa;">单次资金</div>
                        <div>${route.tradeCapital.toLocaleString()}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.9em; color: #aaa;">状态</div>
                        <div>${isActive ? getFlexibleTradeStateText() : '等待中'}</div>
                    </div>
                </div>
                
                <div style="text-align: right;">
                    ${!isActive ? `
                        <button onclick="setActiveRoute(${index})" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">设为活动</button>
                    ` : ''}
                    <button onclick="deleteRoute(${index})" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">删除</button>
                </div>
            </div>
        `;
    });
    
    return routesHtml;
}
// 获取自动贸易状态文本
function getAutoTradeStateText() {
    if (!player.trading.autoTrade.enabled) return '未启用';
    
    switch (player.trading.autoTrade.currentState) {
        case 'idle': return '空闲';
        case 'buying': return '采购中';
        case 'traveling': return '旅行中';
        case 'selling': return '销售中';
        default: return '未知';
    }
}
function validateTradingData() {
    // 验证自动贸易数据
    if (!player.trading.autoTrade) {
        player.trading.autoTrade = {
            enabled: false,
            routes: [],
            efficiency: 0.6,
            currentRoute: null,
            currentState: 'idle',
            currentProgress: 0,
            totalTravelTime: 0,
            lastUpdate: Date.now(),
            logs: [],
            stats: {
                totalProfit: 0,
                totalTrades: 0,
                successfulTrades: 0,
                failedTrades: 0,
                totalTravelTime: 0,
                startTime: Date.now()
            },
            purchaseSettings: {
                maxGoods: 50,
                purchaseStrategy: 'priceDesc',
                minProfitMargin: 10,
                maxWarehouseUsage: 0.8,
                priceTolerance: 0
            },
            backgroundMode: false,
            lastBackgroundUpdate: Date.now(),
            backgroundInterval: null
        };
    }
    
    // 兼容旧存档：flexibleTrade 及 maxInventoryValue、purchaseSettings.maxGoods
    if (!player.trading.autoTrade.flexibleTrade) player.trading.autoTrade.flexibleTrade = {};
    if (player.trading.autoTrade.flexibleTrade.maxInventoryValue === undefined) player.trading.autoTrade.flexibleTrade.maxInventoryValue = 0;
    if (!player.trading.autoTrade.purchaseSettings) player.trading.autoTrade.purchaseSettings = {};
    if (player.trading.autoTrade.purchaseSettings.maxGoods === undefined) player.trading.autoTrade.purchaseSettings.maxGoods = 50;
    if (player.trading.autoTrade.purchaseSettings.maxWarehouseUsage == null || !Number.isFinite(player.trading.autoTrade.purchaseSettings.maxWarehouseUsage)) {
        player.trading.autoTrade.purchaseSettings.maxWarehouseUsage = 0.8;
    } else if (player.trading.autoTrade.purchaseSettings.maxWarehouseUsage > 1) {
        player.trading.autoTrade.purchaseSettings.maxWarehouseUsage = Math.min(1, player.trading.autoTrade.purchaseSettings.maxWarehouseUsage / 100);
    }
    
    // 验证路线数据
    if (!Array.isArray(player.trading.autoTrade.routes)) {
        player.trading.autoTrade.routes = [];
    }
    
    // 清理无效路线：支持「固定路线」(buyCity+sellCity) 与「灵活路线」(仅 goods+tradeCapital)
    player.trading.autoTrade.routes = player.trading.autoTrade.routes.filter(route => {
        if (!route || !Array.isArray(route.goods) || route.goods.length === 0) return false;
        if (route.buyCity && route.sellCity) return true;  // 固定路线
        return (route.tradeCapital != null && route.tradeCapital > 0) || true; // 灵活路线：有商品即可
    });
    
    // 验证当前路线
    if (player.trading.autoTrade.currentRoute && 
        !player.trading.autoTrade.routes.includes(player.trading.autoTrade.currentRoute)) {
        player.trading.autoTrade.currentRoute = null;
    }
    
    // 验证日志
    if (!Array.isArray(player.trading.autoTrade.logs)) {
        player.trading.autoTrade.logs = [];
    }
}

// 设置活动路线
function setActiveRoute(index) {
    if (!player.trading.autoTrade.routes || index >= player.trading.autoTrade.routes.length) {
        logAction("无效的路线索引", "error");
        return;
    }
    
    player.trading.autoTrade.currentRoute = player.trading.autoTrade.routes[index];
    player.trading.autoTrade.currentState = 'idle';
    logAction(`已设置活动路线：灵活贸易路线${index + 1}`, "success");
    updateAutoTradeTab();
}

// 删除路线
function deleteRoute(index) {
    if (!player.trading.autoTrade.routes || index >= player.trading.autoTrade.routes.length) {
        logAction("无效的路线索引", "error");
        return;
    }
    
    const route = player.trading.autoTrade.routes[index];
    
    showCustomConfirm(`确定要删除灵活贸易路线${index + 1}吗？`, (confirmed) => {
        if (confirmed) {
            player.trading.autoTrade.routes.splice(index, 1);
            
            // 如果删除的是当前活动路线，重置状态
            if (player.trading.autoTrade.currentRoute === route) {
                player.trading.autoTrade.currentRoute = null;
                player.trading.autoTrade.currentState = 'idle';
                
                // 如果自动贸易已启用，停用它
                if (player.trading.autoTrade.enabled) {
                    player.trading.autoTrade.enabled = false;
                    stopAutoTradeSystem();
                    stopProgressUpdateTimer();
                    logAction("活动路线已删除，自动贸易已停用", "info");
                }
            }
            
            logAction("贸易路线已删除", "success");
            updateAutoTradeTab();
        }
    });
}

// 暂停自动贸易
function pauseAutoTrade() {
    player.trading.autoTrade.enabled = false;
    
    // 停止进度条更新定时器
    if (window.autoTradeProgressInterval) {
        clearInterval(window.autoTradeProgressInterval);
        window.autoTradeProgressInterval = null;
    }
    
    logAction("自动贸易已暂停", "info");
    
    // 更新自动贸易界面
    updateAutoTradeTab();
    
    // 如果世界地图界面打开，也更新它
    if (document.getElementById('mapTab').style.display !== 'none') {
        updateMapTab();
    }
}

function stopAutoTrade() {
    player.trading.autoTrade.enabled = false;
    player.trading.autoTrade.currentState = 'idle';
    player.trading.autoTrade.currentRoute = null;
    player.trading.autoTrade.currentProgress = 0;
    
    // 停止进度条更新定时器
    if (window.autoTradeProgressInterval) {
        clearInterval(window.autoTradeProgressInterval);
        window.autoTradeProgressInterval = null;
    }
    
    logAction("自动贸易已停止", "info");
    
    // 更新自动贸易界面
    updateAutoTradeTab();
    
    // 如果世界地图界面打开，也更新它
    if (document.getElementById('mapTab').style.display !== 'none') {
        updateMapTab();
    }
}


// 显示自动贸易日志
function showAutoTradeLog() {
    createAutoTradeLogModal();
    updateAutoTradeLogDisplay();
    updateAutoTradeStats();
    
    document.getElementById('autoTradeLogModal').style.display = 'block';
    document.getElementById('autoTradeLogOverlay').style.display = 'block';
}
// 关闭自动贸易日志
function closeAutoTradeLog() {
    document.getElementById('autoTradeLogModal').style.display = 'none';
    document.getElementById('autoTradeLogOverlay').style.display = 'none';
}

// 更新自动贸易日志显示
function updateAutoTradeLogDisplay() {
    const container = document.getElementById('autoTradeLogContainer');
    const searchTerm = document.getElementById('logSearch')?.value || '';
    const filterType = document.getElementById('logFilter')?.value || 'all';
    
    let filteredLogs = player.trading.autoTrade.logs;
    
    // 应用筛选
    if (filterType !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.type === filterType);
    }
    
    // 应用搜索
    if (searchTerm) {
        filteredLogs = filteredLogs.filter(log => 
            log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.timestamp.includes(searchTerm) ||
            log.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    container.innerHTML = '';
    
    if (filteredLogs.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">暂无日志记录</div>';
        return;
    }
    
    filteredLogs.forEach(log => {
        const logElement = document.createElement('div');
        logElement.className = 'log-entry';
        logElement.style.cssText = `
            padding: 8px;
            margin-bottom: 5px;
            border-radius: 3px;
            border-left: 4px solid ${getLogColor(log.type)};
            background: #2a2a2a;
            font-size: 0.9em;
        `;
        
        logElement.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #aaa;">[${log.timestamp}] ${log.city}</span>
                <span style="color: ${getLogColor(log.type)}; font-weight: bold;">${getLogTypeText(log.type)}</span>
            </div>
            <div style="margin-top: 5px;">${log.message}</div>
            <div style="margin-top: 5px; font-size: 0.8em; color: #666;">
                资金: ${log.funds.toLocaleString()} | 货仓: ${log.warehouseUsage}% | 状态: ${log.state}
                ${log.purchaseOpportunities > 0 ? `| 采购: ${log.purchaseOpportunities}` : ''}
                ${log.saleOpportunities > 0 ? `| 销售: ${log.saleOpportunities}` : ''}
            </div>
        `;
        
        container.appendChild(logElement);
    });
}

// 获取日志颜色
function getLogColor(type) {
    switch (type) {
        case 'success': return '#4CAF50';
        case 'warning': return '#FF9800';
        case 'error': return '#f44336';
        default: return '#2196F3';
    }
}

// 获取日志类型文本
function getLogTypeText(type) {
    switch (type) {
        case 'success': return '成功';
        case 'warning': return '警告';
        case 'error': return '错误';
        default: return '信息';
    }
}
// 更新自动贸易统计信息
function updateAutoTradeStats() {
    const statsContainer = document.getElementById('autoTradeStats');
    const stats = player.trading.autoTrade.stats;
    
    // 计算运行时间
    const runTime = Date.now() - stats.startTime;
    const hours = Math.floor(runTime / (1000 * 60 * 60));
    const minutes = Math.floor((runTime % (1000 * 60 * 60)) / (1000 * 60));
    
    // 计算成功率
    const successRate = stats.totalTrades > 0 ? 
        (stats.successfulTrades / stats.totalTrades * 100).toFixed(1) : 0;
    
    statsContainer.innerHTML = `
        <div style="text-align: center; background: #333; padding: 10px; border-radius: 5px;">
            <div style="font-size: 0.9em; color: #aaa;">总利润</div>
            <div style="font-size: 1.2em; font-weight: bold; color: ${stats.totalProfit >= 0 ? '#4CAF50' : '#f44336'}">
                ${stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toLocaleString()}
            </div>
        </div>
        <div style="text-align: center; background: #333; padding: 10px; border-radius: 5px;">
            <div style="font-size: 0.9em; color: #aaa;">交易次数</div>
            <div style="font-size: 1.2em; font-weight: bold;">${stats.totalTrades}</div>
        </div>
        <div style="text-align: center; background: #333; padding: 10px; border-radius: 5px;">
            <div style="font-size: 0.9em; color: #aaa;">成功率</div>
            <div style="font-size: 1.2em; font-weight: bold;">${successRate}%</div>
        </div>
        <div style="text-align: center; background: #333; padding: 10px; border-radius: 5px;">
            <div style="font-size: 0.9em; color: #aaa;">运行时间</div>
            <div style="font-size: 1.2em; font-weight: bold;">${hours}h ${minutes}m</div>
        </div>
        <div style="text-align: center; background: #333; padding: 10px; border-radius: 5px;">
            <div style="font-size: 0.9em; color: #aaa;">当前状态</div>
            <div style="font-size: 1.2em; font-weight: bold;">${getAutoTradeStateText()}</div>
        </div>
        <div style="text-align: center; background: #333; padding: 10px; border-radius: 5px;">
            <div style="font-size: 0.9em; color: #aaa;">贸易效率</div>
            <div style="font-size: 1.2em; font-weight: bold;">${(player.trading.autoTrade.efficiency * 100).toFixed(0)}%</div>
        </div>
    `;
}

// 清空自动贸易日志
function clearAutoTradeLogs() {
    showCustomConfirm("确定要清空所有自动贸易日志吗？此操作不可撤销。", (confirmed) => {
        if (confirmed) {
            player.trading.autoTrade.logs = [];
            updateAutoTradeLogDisplay();
            addAutoTradeLog("日志已清空", "info");
        }
    });
}


function updateAutoTradeStatus() {
    const state = player.trading.autoTrade.currentState;
    let stateText = '';
    let progressHtml = '';
    
    switch (state) {
        case 'idle':
            stateText = '空闲';
            break;
        case 'buying':
            stateText = `在${player.trading.autoTrade.currentRoute?.buyCity || '-'}采购`;
            break;
        case 'traveling':
            const progressPercent = (player.trading.autoTrade.currentProgress / player.trading.autoTrade.totalTravelTime) * 100;
            stateText = `前往${player.trading.travelDestination}`;
            progressHtml = `
                <div style="margin-top: 10px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>旅行进度</span>
                        <span id="autoTravelPercentage">${progressPercent.toFixed(1)}%</span>
                    </div>
                    <div style="width: 100%; height: 10px; background: #444; border-radius: 5px;">
                        <div id="autoTravelProgress" style="height: 100%; width: ${progressPercent}%; background: linear-gradient(90deg, #4CAF50, #8BC34A); border-radius: 5px;"></div>
                    </div>
                </div>
            `;
            break;
        case 'selling':
            stateText = `在${player.trading.autoTrade.currentRoute?.sellCity || '-'}销售`;
            break;
    }
    
    document.getElementById('autoTradeState').textContent = stateText;
    document.getElementById('autoTradeProgress').innerHTML = progressHtml;
    document.getElementById('autoTradeEfficiency').textContent = `${(player.trading.autoTrade.efficiency * 100).toFixed(0)}%`;
    const usageEl = document.getElementById('autoTradeWarehouseUsage');
    const thresholdEl = document.getElementById('autoTradeWarehouseThreshold');
    if (usageEl) usageEl.textContent = `${calculateWarehouseUsage()}%`;
    if (thresholdEl) thresholdEl.textContent = `${Math.round((typeof getEffectiveMaxWarehouseUsage === 'function' ? getEffectiveMaxWarehouseUsage() : (player.trading.autoTrade.purchaseSettings.maxWarehouseUsage || 0.8)) * 100)}%`;
    
    // 今日利润可能是负数（如果买入多于卖出），但我们只显示净收入
    const todayProfit = player.trading.tradeVolumeToday;
    document.getElementById('todayProfit').textContent = 
        `${todayProfit >= 0 ? '+' : ''}${todayProfit.toLocaleString()}星币`;
}

// 更新经营管理标签页
function updateManagementTab() {
    if (!player || !player.trading) return;
    if (!player.trading.insurance) player.trading.insurance = { goods: false, transport: false, bundle: false };
    if (player.trading.insurance.bundle === undefined) player.trading.insurance.bundle = false;
    if (!player.trading.riskAppetite) player.trading.riskAppetite = 'balanced';
    if (typeof ensureGuildQuests === 'function') ensureGuildQuests();
    // 商人声望与等级
    const rep = player.trading.reputation != null ? player.trading.reputation : 0;
    const ml = player.trading.merchantLevel != null ? player.trading.merchantLevel : 1;
    const repEl = document.getElementById('merchantReputation');
    const mlEl = document.getElementById('merchantLevel');
    const mlDescEl = document.getElementById('merchantLevelDesc');
    if (repEl) repEl.textContent = rep;
    if (mlEl) mlEl.textContent = ml;
    if (mlDescEl) {
        var whB = typeof getMerchantWarehouseBonus === 'function' ? getMerchantWarehouseBonus() : 0;
        var sellPct = (typeof getMerchantSellRevenueMultiplier === 'function' ? (getMerchantSellRevenueMultiplier() - 1) : 0) * 100;
        var nextTxt = '';
        if (typeof MERCHANT_MAX_LEVEL !== 'undefined' && ml >= MERCHANT_MAX_LEVEL) nextTxt = '（已满级）';
        else if (typeof MERCHANT_LEVEL_REPUTATION !== 'undefined' && MERCHANT_LEVEL_REPUTATION[ml + 1] != null) {
            var need = MERCHANT_LEVEL_REPUTATION[ml + 1] - rep;
            nextTxt = need > 0 ? '（距下一级约' + Math.ceil(need).toLocaleString() + '声望）' : '';
        }
        mlDescEl.textContent = '货仓+' + whB + '格 · 当前卖价加成约+' + sellPct.toFixed(1) + '% · Lv.3+情报、Lv.4+抗劫' + nextTxt;
    }
    // 商会任务（5个）+ 刷新倒计时
    const gqBlock = document.getElementById('guildQuestsBlock');
    if (gqBlock && player.trading.guildQuests) {
        var countdownHtml = '<div id="guildQuestCountdown" style="margin-bottom:8px; font-size:13px;"></div>';
        if (player.trading.guildQuests.list && player.trading.guildQuests.list.length > 0) {
            const list = player.trading.guildQuests.list;
            let html = countdownHtml;
            for (let i = 0; i < list.length; i++) {
                const q = list[i];
                if (q.type === 'deliver') html += `<div style="margin:6px 0; padding:6px; background:#2a2a2a; border-radius:4px;">运送：带 ${q.amount} 件【${q.good}】到达 ${q.toCity} · 奖励 ${q.reward} 星币</div>`;
                else if (q.type === 'profit') html += `<div style="margin:6px 0; padding:6px; background:#2a2a2a; border-radius:4px;">当日利润：达到 ${q.target.toLocaleString()} · 进度 ${Math.floor(player.trading.profitToday || 0).toLocaleString()}/${q.target.toLocaleString()} · 奖励 ${q.reward} 星币</div>`;
                else if (q.type === 'visit') html += `<div style="margin:6px 0; padding:6px; background:#2a2a2a; border-radius:4px;">旅游：抵达 ${q.toCity} 即完成 · 奖励 ${q.reward} 星币</div>`;
                else if (q.type === 'tour') html += `<div style="margin:6px 0; padding:6px; background:#2a2a2a; border-radius:4px;">跑图：路过 ${q.targetCount} 座不同城市 · 进度 ${q.progress || 0}/${q.targetCount} · 奖励 ${q.reward} 星币</div>`;
                else if (q.type === 'travelLegs') html += `<div style="margin:6px 0; padding:6px; background:#2a2a2a; border-radius:4px;">急件：累计抵达城市 ${q.legs} 次（自动/手动旅行均可） · 进度 ${q.progress || 0}/${q.legs} · 奖励 ${q.reward} 星币</div>`;
                else if (q.type === 'buyAtCity') html += `<div style="margin:6px 0; padding:6px; background:#2a2a2a; border-radius:4px;">代购：在【${q.city}】购买 ${q.amount} 件【${q.good}】 · 进度 ${q.progress || 0}/${q.amount} · 奖励 ${q.reward} 星币</div>`;
            }
            gqBlock.innerHTML = html;
        } else {
            gqBlock.innerHTML = countdownHtml + '<div style="color:#888;">任务已全部完成，下次进入本页或 24 小时后将刷新 5 个新任务</div>';
        }
        updateGuildQuestCountdownOnly();
    }
    // 货仓信息
    const currentLevel = player.trading.warehouse.level;
    const nextLevel = Math.min(currentLevel + 1, tradingConfig.warehouseLevels.length);
    const nextLevelConfig = tradingConfig.warehouseLevels[nextLevel - 1];
    
    document.getElementById('warehouseLevel').textContent = currentLevel;
    document.getElementById('currentCapacity').textContent = getTradingTotalCapacity();
    document.getElementById('upgradeCosta').textContent = nextLevelConfig.cost.toLocaleString();
    
    // 运输工具
    const transportList = document.getElementById('transportList');
    transportList.innerHTML = '';
    
    if (!player.trading.ownedTransports) player.trading.ownedTransports = ['手推车'];
    tradingConfig.transports.forEach(transport => {
        const canBuy = player.nightClub.starCoins >= transport.cost;
        const isOwned = player.trading.ownedTransports.indexOf(transport.name) >= 0;
        const isCurrent = player.trading.transport.type === transport.name;
        
        const transportElement = document.createElement('div');
        let actionHtml;
        if (isOwned) {
            if (isCurrent) {
                actionHtml = '<span style="color: #4CAF50;">使用中</span>';
            } else {
                actionHtml = `<button onclick="switchTransport('${transport.name}')">切换使用</button>`;
            }
        } else {
            actionHtml = `<button onclick="buyTransport('${transport.name}')" ${!canBuy ? 'disabled' : ''}>购买</button>`;
        }
        transportElement.innerHTML = `
            <div style="border: 1px solid #444; padding: 10px; margin: 5px 0;">
                <strong>${transport.name}</strong><br>
                容量: +${transport.capacityBonus}格<br>
                速度: +${transport.speedBonus}%<br>
                价格: ${transport.cost.toLocaleString()}星币<br>
                ${actionHtml}
            </div>
        `;
        transportList.appendChild(transportElement);
    });
    
    // 雇员管理：从配置生成全部可雇类型，已雇佣的显示效果
    const employeeList = document.getElementById('employeeList');
    if (!employeeList) return;
    employeeList.innerHTML = '';
    const cap = (player.trading.warehouse && player.trading.warehouse.capacity) ? player.trading.warehouse.capacity : 20;
    const hasRobbery = !!player.trading.hasExperiencedRobbery;
    var empList = player.trading.employees;
    if (!Array.isArray(empList)) player.trading.employees = empList = [];
    if (tradingConfig.employees && tradingConfig.employees.length) {
        tradingConfig.employees.forEach(empCfg => {
            const hired = empList.find(e => e.type === empCfg.type);
            let reqText = '';
            if (empCfg.requirement === 'warehouse30') reqText = '货仓30格';
            else if (empCfg.requirement === 'warehouse40') reqText = '货仓40格';
            else if (empCfg.requirement === 'warehouse50') reqText = '货仓50格';
            else if (empCfg.requirement === 'reputation3') reqText = '商人Lv.3';
            else if (empCfg.requirement === 'reputation5') reqText = '商人Lv.5';
            else if (empCfg.requirement === 'reputation4') reqText = '商人Lv.4';
            else if (empCfg.requirement === 'reputation6') reqText = '商人Lv.6';
            else if (empCfg.requirement === 'experiencedRobbery') reqText = '曾遇劫';
            let canHire = !hired && (player.nightClub && player.nightClub.starCoins >= empCfg.cost);
            if (empCfg.requirement === 'warehouse30' && cap < 30) canHire = false;
            if (empCfg.requirement === 'warehouse40' && cap < 40) canHire = false;
            if (empCfg.requirement === 'warehouse50' && cap < 50) canHire = false;
            if (empCfg.requirement === 'reputation3' && ml < 3) canHire = false;
            if (empCfg.requirement === 'reputation5' && ml < 5) canHire = false;
            if (empCfg.requirement === 'reputation4' && ml < 4) canHire = false;
            if (empCfg.requirement === 'reputation6' && ml < 6) canHire = false;
            if (empCfg.requirement === 'experiencedRobbery' && !hasRobbery) canHire = false;
            const btn = hired ? '<span style="color:#4CAF50;">已雇佣</span>' : ('<button onclick="hireEmployee(\'' + empCfg.type + '\')" ' + (!canHire ? 'disabled' : '') + ' style="padding:4px 10px;">雇佣</button>');
            employeeList.innerHTML += '<div style="border:1px solid #444; padding:8px; margin:5px 0; font-size:0.9em;"><strong>' + empCfg.type + '</strong> ' + (empCfg.desc || '') + '<br>费用' + empCfg.cost.toLocaleString() + ' 工资' + empCfg.salary + '/天 条件:' + reqText + ' ' + btn + '</div>';
        });
    }
    
    // 保险状态
    if (!player.trading.insurance.bundle) {
        document.getElementById('goodsInsurance').checked = player.trading.insurance.goods;
        document.getElementById('transportInsurance').checked = player.trading.insurance.transport;
    } else {
        document.getElementById('goodsInsurance').checked = true;
        document.getElementById('transportInsurance').checked = true;
    }
    var bundleEl = document.getElementById('bundleInsurance');
    if (bundleEl) bundleEl.checked = !!player.trading.insurance.bundle;
    var riskEl = document.getElementById('riskAppetite');
    if (riskEl) riskEl.value = player.trading.riskAppetite || 'balanced';
}

// 趣味玩法标签页
function updateFunTab() {
    var bmBlock = document.getElementById('blackMarketBlock');
    var rumorBlock = document.getElementById('rumorBlock');
    var dailyBlock = document.getElementById('dailyLuckyBlock');
    if (!bmBlock || !rumorBlock || !dailyBlock) return;
    var bm = player.trading.blackMarket || {};
    var rumor = player.trading.rumor || {};
    var daily = player.trading.dailyLucky || {};
    var now = Date.now();
    if (bm.available && bm.endTime <= now) {
        player.trading.blackMarket = { available: false, endTime: 0, city: '' };
        bm = player.trading.blackMarket;
    }
    if (rumor.effectEndTime && rumor.effectEndTime <= now) {
        player.trading.rumor = { text: '', good: '', city: '', effectEndTime: 0 };
        rumor = player.trading.rumor;
    }
    var todayStr = new Date().toDateString();
    if (daily.lastDate && daily.lastDate !== todayStr) {
        player.trading.dailyLucky = { lastDate: todayStr, used: false, buff: null };
        daily = player.trading.dailyLucky;
    }

    if (bm.available && bm.city === player.trading.currentCity) {
        var goods = Object.keys(tradingConfig.goods);
        if (!bm.goods || !Array.isArray(bm.goods) || bm.goods.length === 0) {
            var pick = [];
            while (pick.length < 3) {
                var g = goods[Math.floor(Math.random() * goods.length)];
                if (pick.indexOf(g) === -1) pick.push(g);
            }
            player.trading.blackMarket.goods = pick;
        }
        var pick = player.trading.blackMarket.goods;
        var listHtml = '<p style="color:#aaa; font-size:0.9em;">黑市买入价约市价70%，卖出价约150%，每次交易10%概率被查罚款</p>';
        pick.forEach(function(g) {
            var mkt = player.trading.cityPrices[player.trading.currentCity][g] || tradingConfig.goods[g].basePrice;
            var buyP = Math.floor(mkt * 0.7);
            var sellP = Math.floor(mkt * 1.5);
            listHtml += '<div style="margin:8px 0; padding:8px; background:#333; border-radius:4px;">' +
                '<strong>' + g + '</strong> 买:' + buyP.toLocaleString() + ' 卖:' + sellP.toLocaleString() + ' ' +
                '<button onclick="blackMarketBuy(\'' + g + '\', 1)" style="margin-left:6px;">买1</button>' +
                '<button onclick="blackMarketSell(\'' + g + '\', 1)">卖1</button></div>';
        });
        listHtml += '<p style="color:#888; font-size:0.85em;">剩余' + Math.max(0, Math.ceil((bm.endTime - now) / 60000)) + '分钟</p>';
        bmBlock.innerHTML = listHtml;
    } else {
        bmBlock.innerHTML = '<p style="color:#888;">当前无黑市入口。旅行到达某城市时有机遇事件「发现黑市入口」可开启。</p>';
    }

    if (rumor.text) {
        var remain = rumor.effectEndTime ? Math.max(0, Math.ceil((rumor.effectEndTime - now) / 60000)) : 0;
        rumorBlock.innerHTML = '<p style="color:#FF9800;">' + rumor.text + '</p><p style="color:#888; font-size:0.85em;">效果剩余约' + remain + '分钟</p>';
    } else {
        rumorBlock.innerHTML = '<p style="color:#888;">暂无传闻。机遇事件「打听到小道消息」可获得某城某商品涨价提示。</p>';
    }

    if (!daily.lastDate) player.trading.dailyLucky = { lastDate: todayStr, used: false, buff: null };
    daily = player.trading.dailyLucky;
    if (daily.used && daily.buff) {
        dailyBlock.innerHTML = '<p style="color:#4CAF50;">今日已领取：' + (daily.buff.name || daily.buff) + '</p>';
    } else {
        dailyBlock.innerHTML = '<p style="color:#aaa;">每日可领取一次随机幸运加成。</p><button onclick="doDailyLucky()" style="padding:8px 16px; background:#4CAF50; color:white; border:none; border-radius:4px; cursor:pointer;">领取今日幸运</button>';
    }

    var roadBlock = document.getElementById('merchantRoadExtrasBlock');
    if (roadBlock && player && player.trading && typeof ensureMerchantRoadExtrasDay === 'function') {
        ensureMerchantRoadExtrasDay();
        var ex = player.trading.merchantExtra || {};
        var vPaid = ex.vPaidCount || 0;
        var nowM = typeof tradingNow === 'function' ? tradingNow() : Date.now();
        var chAct = player.trading.merchantCharter;
        var chRem = (chAct && chAct.endTime > nowM) ? Math.max(0, Math.ceil((chAct.endTime - nowM) / 60000)) : 0;
        var rh = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
        rh += '<div style="background:#333;padding:10px;border-radius:6px;"><strong>商会罗盘</strong><p style="color:#aaa;font-size:0.85em;margin:6px 0;">免费1次/日；付费最多3次（每次 ' + (typeof MERCHANT_VAULT_PAID_COST === 'number' ? MERCHANT_VAULT_PAID_COST.toLocaleString() : '12000') + ' 星币）。随机声望、星币或短期旅行/卖价加成。</p>';
        if (!ex.vFreeDone) rh += '<button type="button" onclick="merchantVaultSpin(false)" style="padding:6px 12px;margin-right:6px;background:#00BCD4;color:#111;border:none;border-radius:4px;cursor:pointer;">免费占卜</button>';
        else rh += '<span style="color:#888;">今日免费已用</span> ';
        if (vPaid < 3) rh += '<button type="button" onclick="merchantVaultSpin(true)" style="padding:6px 12px;background:#00838F;color:#fff;border:none;border-radius:4px;cursor:pointer;">付费占卜</button>';
        else rh += '<span style="color:#888;">付费次数已满</span>';
        rh += '</div><div style="background:#333;padding:10px;border-radius:6px;"><strong>特许采购证</strong><p style="color:#aaa;font-size:0.85em;margin:6px 0;">支付动态星币（约1.6%当前星币，上下限已设）后45分钟内<strong>市价买入×0.93</strong>。每自然日限购一次。</p>';
        if (chRem > 0) rh += '<p style="color:#8BC34A;">特许生效中，剩余约 ' + chRem + ' 分钟</p>';
        else if (!ex.charter) rh += '<button type="button" onclick="merchantCharterBuy()" style="padding:6px 12px;background:#7CB342;color:#111;border:none;border-radius:4px;cursor:pointer;">购买特许</button>';
        else rh += '<span style="color:#888;">今日已买过特许</span>';
        rh += '</div><div style="background:#333;padding:10px;border-radius:6px;grid-column:span 2;"><strong>暗线竞拍</strong><p style="color:#aaa;font-size:0.85em;margin:6px 0;">消耗 ' + (typeof MERCHANT_SNIPE_COST === 'number' ? MERCHANT_SNIPE_COST.toLocaleString() : '20000') + ' 星币：55% 大量商人声望，25% 星币回馈，20% 被对手反咬一口。</p>';
        if (!ex.snipe) rh += '<button type="button" onclick="merchantShadowSnipe()" style="padding:6px 12px;background:#5C6BC0;color:#fff;border:none;border-radius:4px;cursor:pointer;">参与暗拍</button>';
        else rh += '<span style="color:#888;">今日暗拍已结束</span>';
        rh += '</div></div>';
        roadBlock.innerHTML = rh;
    }
    var pulseBlock = document.getElementById('tradingWorldPulseBlock');
    if (pulseBlock && player && player.trading && typeof ensureTradingWorldPulse === 'function') {
        ensureTradingWorldPulse();
        var nowP = typeof tradingNow === 'function' ? tradingNow() : Date.now();
        var hd = player.trading.hotDeal;
        var rp = player.trading.regionPulse;
        var sh = player.trading.treasureShards || 0;
        var miles = player.trading.merchantMiles || 0;
        var nextM = 10 - (miles % 10);
        var ph = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
        ph += '<div style="background:#333;padding:10px;border-radius:6px;"><strong>全服今日热卖</strong>';
        if (hd && hd.good) ph += '<p style="color:#FFB74D;margin:8px 0 0 0;">「' + hd.good + '」全地图卖价约×' + (hd.sellMult != null ? hd.sellMult.toFixed(3) : '1.08') + '（每日换品）</p>';
        else ph += '<p style="color:#888;">—</p>';
        ph += '</div><div style="background:#333;padding:10px;border-radius:6px;"><strong>区域景气</strong>';
        if (rp && rp.endTime > nowP && rp.region) {
            var remH = Math.max(0, Math.ceil((rp.endTime - nowP) / 3600000));
            var lab = rp.kind === 'boom' ? '景气（该区进货略廉、卖货略贵）' : '萧条（该区进货偏贵、卖货承压）';
            ph += '<p style="color:#81D4FA;margin:8px 0 0 0;">' + rp.region + ' · ' + lab + '</p><p style="color:#888;font-size:0.85em;">剩余约' + remH + '小时</p>';
        } else ph += '<p style="color:#888;">今日暂无显著区域波动</p>';
        ph += '</div><div style="background:#333;padding:10px;border-radius:6px;grid-column:span 2;"><strong>商路里程</strong> ' + miles + ' 次抵达 · 再抵达 <strong>' + nextM + '</strong> 次领取里程奖（星币+声望）<br>';
        ph += '<strong>秘宝碎片</strong> ' + sh + ' / 5 片集齐自动兑换大奖（旅行机遇可掉落）</div></div>';
        pulseBlock.innerHTML = ph;
    }
}

function blackMarketBuy(good, quantity) {
    if (!player.trading.blackMarket || !player.trading.blackMarket.available || player.trading.blackMarket.city !== player.trading.currentCity) return;
    var price = Math.floor((player.trading.cityPrices[player.trading.currentCity][good] || tradingConfig.goods[good].basePrice) * 0.7) * quantity;
    var slots = (tradingConfig.goods[good].slots || 1) * quantity;
    if (player.nightClub.starCoins < price) { logAction('星币不足', 'error'); return; }
    if (player.trading.warehouse.used + slots > getTradingTotalCapacity()) { logAction('货仓不足', 'error'); return; }
    if (Math.random() < 0.1) {
        var fine = Math.floor(player.nightClub.starCoins * 0.05);
        if (fine > 0) { player.nightClub.starCoins -= fine; logAction('黑市被查！罚款' + fine + '星币', 'event'); }
    }
    player.nightClub.starCoins -= price;
    var bmCity = player.trading.currentCity;
    var item = player.trading.inventory[good];
    if (item) {
        item.quantity += quantity;
        item.totalCost += price;
        item.averageCost = item.totalCost / item.quantity;
        item.purchaseCity = mergeInventoryPurchaseCity(item.purchaseCity, bmCity);
    } else {
        player.trading.inventory[good] = { quantity: quantity, averageCost: price / quantity, totalCost: price, purchaseCity: bmCity, lastBuyPrice: Math.ceil(price / quantity) };
    }
    player.trading.warehouse.used += slots;
    logAction('黑市购入' + quantity + '件' + good, 'success');
    updateTradingUI(); updateFunTab();
}

function blackMarketSell(good, quantity) {
    if (!player.trading.blackMarket || !player.trading.blackMarket.available || player.trading.blackMarket.city !== player.trading.currentCity) return;
    var item = player.trading.inventory[good];
    if (!item || (typeof item === 'object' ? item.quantity : 0) < quantity) { logAction('库存不足', 'error'); return; }
    var price = Math.floor((player.trading.cityPrices[player.trading.currentCity][good] || tradingConfig.goods[good].basePrice) * 1.5) * quantity;
    if (Math.random() < 0.1) {
        var fine = Math.floor(price * 0.2);
        if (fine > 0) { price -= fine; logAction('黑市被查！收益扣减' + fine + '星币', 'event'); }
    }
    player.nightClub.starCoins += price;
    item.quantity -= quantity;
    if (item.quantity <= 0) { delete player.trading.inventory[good]; player.trading.warehouse.used -= (tradingConfig.goods[good].slots || 1) * quantity; }
    else { item.totalCost = item.averageCost * item.quantity; player.trading.warehouse.used -= (tradingConfig.goods[good].slots || 1) * quantity; }
    syncWarehouseUsedFromInventory();
    logAction('黑市售出' + quantity + '件' + good + '，获得' + price + '星币', 'success');
    updateTradingUI(); updateFunTab();
}

function doDailyLucky() {
    var daily = player.trading.dailyLucky || {};
    var todayStr = new Date().toDateString();
    if (daily.lastDate !== todayStr) player.trading.dailyLucky = { lastDate: todayStr, used: false, buff: null };
    daily = player.trading.dailyLucky;
    if (daily.used) { logAction('今日已领取过幸运', 'info'); return; }
    var buffs = [
        { name: '今日卖价+5%', key: 'dailySellBonus', value: 1.05, endTime: Date.now() + 24 * 60 * 60 * 1000 },
        { name: '下次购买+1件', key: 'luckyMerchantNextBuy', value: true },
        { name: '下次旅行时间-15%', key: 'travelTimeReduction', value: 0.15, endKey: 'travelTimeReductionEnd', endValue: Date.now() + 12 * 60 * 60 * 1000 },
        { name: '获得5000星币', key: 'starCoinsBonus', value: 5000 },
        { name: '商人声望+3', key: 'reputationBonus', value: 3 },
        { name: '商人声望+12', key: 'reputationBonus', value: 12 }
    ];
    var b = buffs[Math.floor(Math.random() * buffs.length)];
    if (b.key === 'starCoinsBonus') { player.nightClub.starCoins += b.value; }
    else if (b.key === 'reputationBonus') { player.trading.reputation = (player.trading.reputation || 0) + b.value; if (typeof updateMerchantLevelFromReputation === 'function') updateMerchantLevelFromReputation(); }
    else if (b.key === 'luckyMerchantNextBuy') { player.trading.luckyMerchantNextBuy = true; }
    else if (b.key === 'travelTimeReduction') { player.trading.travelTimeReduction = b.value; player.trading.travelTimeReductionEnd = b.endValue; }
    else if (b.key === 'dailySellBonus') { player.trading.dailySellBonus = b.value; player.trading.dailySellBonusEnd = b.endTime; }
    player.trading.dailyLucky.used = true;
    player.trading.dailyLucky.buff = b;
    logAction('今日幸运：' + b.name, 'success');
    updateFunTab(); updateTradingUI();
}

// 切换标签页
function switchTradingTab(tabName) {
    // 隐藏所有标签页
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 移除所有标签按钮的激活状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签页
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // 激活对应的标签按钮
    if (event && event.target) event.target.classList.add('active');
    
    // 切换到世界地图时强制刷新地图，避免重启后仍显示静态旧城市列表
    if (tabName === 'map') updateMapTab();
    // 切换到经营管理时刷新声望、等级、商会任务，并启动刷新倒计时
    if (tabName === 'management') {
        updateManagementTab();
        if (window._guildQuestCountdownTimer) clearInterval(window._guildQuestCountdownTimer);
        window._guildQuestCountdownTimer = setInterval(updateGuildQuestCountdownOnly, 1000);
    } else {
        if (window._guildQuestCountdownTimer) { clearInterval(window._guildQuestCountdownTimer); window._guildQuestCountdownTimer = null; }
    }
    if (tabName === 'fun') updateFunTab();
}

// 合并进货来源城市：仅当全部在同一城市购入时保留城市，否则视为「已跨城混合」不再享受同城判定
function mergeInventoryPurchaseCity(existingCity, buyCity) {
    if (existingCity == null || existingCity === buyCity) return buyCity;
    return null;
}

// 获取商品的实际买入价（含关税加成等）
function getActualBuyPrice(city, good) {
    let price = player.trading.cityPrices && player.trading.cityPrices[city] && player.trading.cityPrices[city][good];
    if (price == null || !Number.isFinite(price)) return price;
    if (player.trading.tariffBonus && player.trading.tariffBonus.city === city && Date.now() <= player.trading.tariffBonus.endTime && player.trading.tariffBonus.buyMultiplier)
        price = Math.ceil(price * player.trading.tariffBonus.buyMultiplier);
    var _nowC = typeof tradingNow === 'function' ? tradingNow() : Date.now();
    var ch = player.trading.merchantCharter;
    if (ch && ch.endTime && _nowC <= ch.endTime && ch.buyMult > 0 && ch.buyMult < 1)
        price = Math.ceil(price * ch.buyMult);
    var gbm = player.trading.globalBuyMult;
    if (gbm != null && gbm > 0 && gbm < 1 && player.trading.globalBuyMultEnd > _nowC)
        price = Math.ceil(price * gbm);
    var rp = player.trading.regionPulse;
    if (rp && rp.endTime > _nowC && rp.buyMult && tradingConfig.cities[city] && tradingConfig.cities[city].region === rp.region)
        price = Math.ceil(price * rp.buyMult);
    return price;
}

// 购买商品
function buyGood(good, quantity) {
    // 确保商品名称有效
    if (!good || typeof good !== 'string') {
        addAutoTradeLog("无法购买无效的商品", "error");
        return;
    }
    
    const city = player.trading.currentCity;
    const price = getActualBuyPrice(city, good);
    const totalCost = price * quantity;
    const goodConfig = tradingConfig.goods[good];
    const slotsNeeded = goodConfig.slots * quantity;
    
    // 检查资金
    if (player.nightClub.starCoins < totalCost) {
        logAction(`星币不足！需要${totalCost.toLocaleString()}星币`, "error");
        return;
    }
    
    // 检查货仓空间
    const availableSlots = getTradingTotalCapacity() - player.trading.warehouse.used;
    if (slotsNeeded > availableSlots) {
        logAction(`货仓空间不足！需要${slotsNeeded}格，可用${availableSlots}格`, "error");
        return;
    }
    
    // 执行购买
    player.nightClub.starCoins -= totalCost;
    
    // 更新库存（计算平均成本）
    if (!player.trading.inventory[good]) {
        // 第一次购买此商品
        player.trading.inventory[good] = {
            quantity: quantity,
            averageCost: price,
            totalCost: totalCost,
            lastBuyPrice: price,
            purchaseCity: city
        };
    } else {
        // 已有库存，计算新的平均成本
        const current = player.trading.inventory[good];
        const newTotalCost = current.totalCost + totalCost;
        const newQuantity = current.quantity + quantity;
        const newAverageCost = newTotalCost / newQuantity;
        
        player.trading.inventory[good] = {
            quantity: newQuantity,
            averageCost: newAverageCost,
            totalCost: newTotalCost,
            lastBuyPrice: price,
            purchaseCity: mergeInventoryPurchaseCity(current.purchaseCity, city)
        };
    }
    
    player.trading.warehouse.used += slotsNeeded;
    
    if (player.trading.luckyMerchantNextBuy) {
        player.trading.inventory[good].quantity += 1;
        player.trading.warehouse.used += goodConfig.slots;
        player.trading.luckyMerchantNextBuy = false;
        logAction('幸运商人！额外获得1个' + good, "success");
    }
    
    if (typeof checkGuildQuestProgress === 'function') checkGuildQuestProgress('buy', good, quantity, totalCost, city);
    
    // 记录交易
    recordTrade('buy', good, quantity, price, totalCost);
    
    logAction(`购买了${quantity}个${good}，花费${totalCost.toLocaleString()}星币`, "success");
    updateTradingUI();
    updateDisplay();
}

// 出售商品
function sellGood(good, quantity) {
    const city = player.trading.currentCity;
    const price = player.trading.cityPrices[city][good];
    const totalRevenue = price * quantity;
    const goodConfig = tradingConfig.goods[good];
    
    // 检查库存
    if (!player.trading.inventory[good] || player.trading.inventory[good].quantity < quantity) {
        logAction(`库存不足！只有${player.trading.inventory[good] ? player.trading.inventory[good].quantity : 0}个${good}`, "error");
        return;
    }
    
    const inventoryItem = player.trading.inventory[good];
    const costOfGoodsSold = inventoryItem.averageCost * quantity;
    const fullProfit = totalRevenue - costOfGoodsSold;
    // 短途跑商：只对「利润」打折，成本必收回，不会亏本；旅行不足15分钟则利润按比例打折
    const lastTravelMin = (player.trading && typeof player.trading.lastTravelTimeMinutes === 'number') ? player.trading.lastTravelTimeMinutes : 999;
    const fullRevenueMinutes = 15;
    const profitMultiplier = Math.min(1, lastTravelMin / fullRevenueMinutes);
    const actualProfit = Math.floor(fullProfit * profitMultiplier);
    let actualRevenue = costOfGoodsSold + actualProfit;
    
    var _mrSell = typeof getMerchantSellRevenueMultiplier === 'function' ? getMerchantSellRevenueMultiplier() : 1;
    if (_mrSell > 1) actualRevenue = Math.floor(actualRevenue * _mrSell);
    if (player.trading.eventBonus && player.trading.eventBonus.city === city && Date.now() <= player.trading.eventBonus.endTime && player.trading.eventBonus.sellMultiplier) {
        actualRevenue = Math.floor(actualRevenue * player.trading.eventBonus.sellMultiplier);
        if (typeof logAction === 'function') logAction('节日促销！出售收益+' + Math.round((player.trading.eventBonus.sellMultiplier - 1) * 100) + '%', 'success');
    }
    if (player.trading.dailySellBonus && player.trading.dailySellBonusEnd && Date.now() <= player.trading.dailySellBonusEnd) {
        actualRevenue = Math.floor(actualRevenue * player.trading.dailySellBonus);
    }
    var empSellBonus = (typeof getEmployeeSellBonus === 'function') ? getEmployeeSellBonus() : 0;
    if (empSellBonus > 0) actualRevenue = Math.floor(actualRevenue * (1 + empSellBonus / 100));
    if (player.trading.riskAppetite === 'aggressive') actualRevenue = Math.floor(actualRevenue * 1.05);
    // 同城倒卖：在未跨城前就地卖出，成交价按最终计算再打 50%，防止「成本保底 + 卖价加成」叠乘刷星币
    var sameCitySellPenalty = false;
    if (inventoryItem.purchaseCity != null && inventoryItem.purchaseCity === city) {
        actualRevenue = Math.floor(actualRevenue * 0.5);
        sameCitySellPenalty = true;
    }
    var _tSell = typeof tradingNow === 'function' ? tradingNow() : Date.now();
    if (player.trading.hotDeal && player.trading.hotDeal.good === good && player.trading.hotDeal.sellMult > 1)
        actualRevenue = Math.floor(actualRevenue * player.trading.hotDeal.sellMult);
    var rpS = player.trading.regionPulse;
    if (rpS && rpS.endTime > _tSell && rpS.sellMult && tradingConfig.cities[city] && tradingConfig.cities[city].region === rpS.region)
        actualRevenue = Math.floor(actualRevenue * rpS.sellMult);
    if (player.trading.globalSellMult != null && player.trading.globalSellMult > 1 && player.trading.globalSellMultEnd > _tSell)
        actualRevenue = Math.floor(actualRevenue * player.trading.globalSellMult);
    var sd = player.trading.sellDebuff;
    if (sd && sd.endTime > _tSell && sd.city === city && sd.mult > 0 && sd.mult < 1)
        actualRevenue = Math.floor(actualRevenue * sd.mult);
    const profit = actualRevenue - costOfGoodsSold;
    const profitRate = costOfGoodsSold > 0 ? (profit / costOfGoodsSold) * 100 : 0;
    if (profit > 0 && player.trading.reputation != null) {
        player.trading.reputation = (player.trading.reputation || 0) + Math.max(1, Math.floor(profit / 400));
        if (typeof updateMerchantLevelFromReputation === 'function') updateMerchantLevelFromReputation();
    }
    if (typeof addDailyProfit === 'function') addDailyProfit(profit);
    
    // 执行出售（成本全收，利润按旅行时长折算，保证不亏本）
    player.nightClub.starCoins += actualRevenue;
    
    // 更新库存
    if (inventoryItem.quantity === quantity) {
        // 全部售出
        delete player.trading.inventory[good];
    } else {
        // 部分售出（平均成本不变，因为采用加权平均法）
        inventoryItem.quantity -= quantity;
        inventoryItem.totalCost -= costOfGoodsSold;
        // 平均成本保持不变，因为我们采用先进先出或加权平均
    }
    
    player.trading.warehouse.used -= goodConfig.slots * quantity;
    
    if (typeof checkGuildQuestProgress === 'function') checkGuildQuestProgress('sell', good, quantity, actualRevenue, city);
    
    // 记录交易（按实际收入记录）
    recordTrade('sell', good, quantity, price, actualRevenue);
    
    // 更新自动贸易总利润（灵活贸易路径依赖此处，否则离线收益始终为0）
    if (player.trading.autoTrade && player.trading.autoTrade.stats) {
        if (player.trading.autoTrade.stats.totalProfit == null) player.trading.autoTrade.stats.totalProfit = 0;
        player.trading.autoTrade.stats.totalProfit += profit;
    }
    
    // 显示盈亏信息（若短途打折则提示，成本必收不会亏本）
    const profitSign = profit >= 0 ? '+' : '';
    const shortTripHint = profitMultiplier < 1 ? `（短途利润${(profitMultiplier * 100).toFixed(0)}%）` : '';
    const sameCityHint = sameCitySellPenalty ? '（同城抛售，成交价50%）' : '';
    logAction(`出售了${quantity}个${good}，获得${actualRevenue.toLocaleString()}星币${shortTripHint}${sameCityHint}（${profitSign}${profit.toFixed(0)}星币，${profitSign}${profitRate.toFixed(1)}%）`, "success");
    
    updateTradingUI();
    updateDisplay();
}

// 记录交易
function recordTrade(type, good, quantity, price, amount) {
    const trade = {
        type: type,
        good: good,
        quantity: quantity,
        price: price,
        amount: amount,
        city: player.trading.currentCity,
        timestamp: Date.now()
    };
    
    player.trading.tradeHistory.unshift(trade);
    
    // 买入是支出（减少利润），卖出是收入（增加利润）
    if (type === 'buy') {
        player.trading.tradeVolumeToday -= amount; // 买入减少利润
    } else if (type === 'sell') {
        player.trading.tradeVolumeToday += amount; // 卖出增加利润
    }
    
    player.trading.tradeCountToday++;
    
    // 限制交易记录数量
    if (player.trading.tradeHistory.length > 100) {
        player.trading.tradeHistory.pop();
    }
}

// 商人等级上限与声望阈值（1=起步，2..100 由声望解锁；曲线中后期明显变难）
var MERCHANT_MAX_LEVEL = 100;
var MERCHANT_LEVEL_REPUTATION = (function () {
    var a = [];
    a[0] = 0;
    a[1] = 0;
    for (var L = 2; L <= MERCHANT_MAX_LEVEL; L++) {
        var x = L - 1;
        var v = 900 * Math.pow(x, 1.95) * (1 + 0.014 * x)
            + Math.pow(Math.max(0, x - 32), 2.6) * 62
            + Math.pow(Math.max(0, x - 62), 2.95) * 48
            + Math.pow(Math.max(0, x - 88), 3.1) * 22;
        a[L] = Math.floor(Math.max((a[L - 1] || 0) + 2400, v));
    }
    return a;
})();
var MERCHANT_VAULT_PAID_COST = 12000;
var MERCHANT_SNIPE_COST = 20000;
function updateMerchantLevelFromReputation() {
    if (!player.trading || player.trading.reputation == null) return;
    const r = player.trading.reputation;
    let level = 1;
    for (let i = MERCHANT_MAX_LEVEL; i >= 1; i--) {
        if (r >= MERCHANT_LEVEL_REPUTATION[i]) { level = i; break; }
    }
    if (level > MERCHANT_MAX_LEVEL) level = MERCHANT_MAX_LEVEL;
    player.trading.merchantLevel = level;
}

// 出售时商人等级加成：Lv.2–20 维持原 每级+2%；高等级额外小幅递增（避免 L100 时数值爆炸）
function getMerchantSellRevenueMultiplier() {
    if (!player || !player.trading) return 1;
    var ml = player.trading.merchantLevel || 1;
    if (ml <= 1) return 1;
    var early = Math.min(ml, 20);
    var earlyPart = (early - 1) * 0.02;
    var late = Math.max(0, ml - 20);
    var latePart = Math.min(late * 0.0045, 0.36);
    return 1 + earlyPart + latePart;
}

// 商人等级货仓加成：每5级+5格（Lv.100 时 +100 格）
function getMerchantWarehouseBonus() {
    if (!player.trading) return 0;
    const ml = player.trading.merchantLevel || 1;
    return Math.floor(ml / 5) * 5;
}

function ensureMerchantRoadExtrasDay() {
    if (!player || !player.trading) return;
    if (!player.trading.merchantExtra) player.trading.merchantExtra = { dayStr: '', vFreeDone: false, vPaidCount: 0, charter: false, snipe: false };
    var ex = player.trading.merchantExtra;
    var ds = new Date(typeof tradingNow === 'function' ? tradingNow() : Date.now()).toDateString();
    if (ex.dayStr !== ds) {
        ex.dayStr = ds;
        ex.vFreeDone = false;
        ex.vPaidCount = 0;
        ex.charter = false;
        ex.snipe = false;
    }
    var now = typeof tradingNow === 'function' ? tradingNow() : Date.now();
    var ch = player.trading.merchantCharter;
    if (ch && ch.endTime && now > ch.endTime) player.trading.merchantCharter = null;
}

function merchantVaultSpin(isPaid) {
    if (!player || !player.trading) return;
    ensureMerchantRoadExtrasDay();
    var ex = player.trading.merchantExtra;
    if (isPaid) {
        if ((ex.vPaidCount || 0) >= 3) { logAction('今日商会罗盘付费次数已满', 'info'); return; }
        if (!player.nightClub || player.nightClub.starCoins < MERCHANT_VAULT_PAID_COST) { logAction('星币不足', 'error'); return; }
        player.nightClub.starCoins -= MERCHANT_VAULT_PAID_COST;
        ex.vPaidCount = (ex.vPaidCount || 0) + 1;
    } else {
        if (ex.vFreeDone) { logAction('今日免费占卜已使用', 'info'); return; }
        ex.vFreeDone = true;
    }
    var roll = Math.random();
    var now = typeof tradingNow === 'function' ? tradingNow() : Date.now();
    if (roll < 0.34) {
        var rep = 6 + Math.floor(Math.random() * 20);
        player.trading.reputation = (player.trading.reputation || 0) + rep;
        if (typeof updateMerchantLevelFromReputation === 'function') updateMerchantLevelFromReputation();
        logAction('商会罗盘：吉星高照，商人声望+' + rep, 'success');
    } else if (roll < 0.62) {
        var coin = 4000 + Math.floor(Math.random() * 9001);
        player.nightClub.starCoins += coin;
        logAction('商会罗盘：财星照临，+' + coin.toLocaleString() + ' 星币', 'success');
    } else if (roll < 0.82) {
        player.trading.dailySellBonus = 1.04;
        player.trading.dailySellBonusEnd = now + 6 * 60 * 60 * 1000;
        logAction('商会罗盘：接下来约6小时卖价+4%', 'success');
    } else if (roll < 0.93) {
        player.trading.travelTimeReduction = 0.1;
        player.trading.travelTimeReductionEnd = now + 8 * 60 * 60 * 1000;
        logAction('商会罗盘：驿马星动，约8小时内旅行时间-10%', 'success');
    } else {
        logAction('商会罗盘：盘面模糊，今日宜稳健持货', 'info');
    }
    updateFunTab();
    updateTradingUI();
}

function merchantCharterBuy() {
    if (!player || !player.trading) return;
    ensureMerchantRoadExtrasDay();
    var ex = player.trading.merchantExtra;
    if (ex.charter) { logAction('今日特许证购买次数已用尽', 'info'); return; }
    var coins = player.nightClub.starCoins || 0;
    var cost = Math.min(900000, Math.max(18000, Math.floor(coins * 0.016)));
    if (coins < cost) { logAction('星币不足以支付特许费用（约需' + cost.toLocaleString() + '）', 'error'); return; }
    player.nightClub.starCoins -= cost;
    ex.charter = true;
    var now = typeof tradingNow === 'function' ? tradingNow() : Date.now();
    player.trading.merchantCharter = { endTime: now + 45 * 60 * 1000, buyMult: 0.93 };
    logAction('特许采购证：约45分钟内市价买入×0.93（与关税等乘算）', 'success');
    updateFunTab();
    updateTradingUI();
}

function merchantShadowSnipe() {
    if (!player || !player.trading) return;
    ensureMerchantRoadExtrasDay();
    var ex = player.trading.merchantExtra;
    if (ex.snipe) { logAction('今日暗拍已参与', 'info'); return; }
    if (!player.nightClub || player.nightClub.starCoins < MERCHANT_SNIPE_COST) { logAction('星币不足', 'error'); return; }
    player.nightClub.starCoins -= MERCHANT_SNIPE_COST;
    ex.snipe = true;
    var r = Math.random();
    if (r < 0.55) {
        var rep = 14 + Math.floor(Math.random() * 32);
        player.trading.reputation = (player.trading.reputation || 0) + rep;
        if (typeof updateMerchantLevelFromReputation === 'function') updateMerchantLevelFromReputation();
        logAction('暗线竞拍：大客户落槌！商人声望+' + rep, 'success');
    } else if (r < 0.8) {
        var gain = 6000 + Math.floor(Math.random() * 14001);
        player.nightClub.starCoins += gain;
        logAction('暗线竞拍：席间套利，+' + gain.toLocaleString() + ' 星币', 'success');
    } else {
        var loss = 5000 + Math.floor(Math.random() * 6001);
        player.nightClub.starCoins = Math.max(0, (player.nightClub.starCoins || 0) - loss);
        logAction('暗线竞拍：对手恶意抬价，额外损失约' + loss.toLocaleString() + ' 星币', 'warning');
    }
    updateFunTab();
    updateTradingUI();
}

// 货仓本体格数：取存档值与「当前等级对应配置」的较大者，避免升级后 capacity 未写入导致总上限偏小（约 100/125 时误触 80% 停购）
function getWarehouseBaseSlotCapacity() {
    if (!player.trading || !player.trading.warehouse) return 0;
    if (typeof tradingConfig === 'undefined' || !tradingConfig.warehouseLevels || !tradingConfig.warehouseLevels.length) {
        return Math.max(0, Math.floor(Number(player.trading.warehouse.capacity) || 0));
    }
    const w = player.trading.warehouse;
    const stored = Math.max(0, Math.floor(Number(w.capacity) || 0));
    const lv = Math.min(Math.max(1, Math.floor(Number(w.level) || 1)), tradingConfig.warehouseLevels.length);
    const fromLevel = tradingConfig.warehouseLevels[lv - 1].capacity;
    return Math.max(stored, fromLevel);
}

// 自动贸易「最大货仓使用率」：兼容误存成 80 表示 80% 的旧数据；缺省 0.8
function getEffectiveMaxWarehouseUsage() {
    if (!player.trading || !player.trading.autoTrade || !player.trading.autoTrade.purchaseSettings) return 0.8;
    let u = player.trading.autoTrade.purchaseSettings.maxWarehouseUsage;
    if (u == null || !Number.isFinite(u)) return 0.8;
    if (u > 1) u = u / 100;
    return Math.min(1, Math.max(0.5, u));
}

// 总货仓容量（含仓库+运输工具+商人等级加成）。transport 缺失时按手推车+5格计算，避免自动贸易误用“仅仓库容量”导致到100就停买。
function getTradingTotalCapacity() {
    if (!player.trading) return 0;
    var transportBonus = 0;
    if (player.trading.transport && typeof player.trading.transport.capacityBonus === 'number') {
        transportBonus = player.trading.transport.capacityBonus;
    } else if (typeof tradingConfig !== 'undefined' && tradingConfig.transports) {
        var handcart = tradingConfig.transports.find(function(t) { return t.name === '手推车'; });
        transportBonus = handcart ? handcart.capacityBonus : 5;
    } else {
        transportBonus = 5;
    }
    const base = getWarehouseBaseSlotCapacity() + transportBonus;
    return base + getMerchantWarehouseBonus();
}

// 自动贸易：在「最大货仓使用率」下还可占用的格数（例：总 100 格、99%、已用 20 → 79，而非物理空 80）
function getAutoTradeRemainingSlotBudgetSlots() {
    if (!player.trading || !player.trading.warehouse) return 0;
    const totalCapacity = getTradingTotalCapacity();
    if (!(totalCapacity > 0)) return 0;
    const maxWU = typeof getEffectiveMaxWarehouseUsage === 'function' ? getEffectiveMaxWarehouseUsage() : ((player.trading.autoTrade && player.trading.autoTrade.purchaseSettings && player.trading.autoTrade.purchaseSettings.maxWarehouseUsage) || 0.8);
    const used = player.trading.warehouse.used || 0;
    return Math.max(0, totalCapacity * maxWU - used);
}

// 每日商会任务：5 个；刷新条件 = 任务全完成（list 为空）或距上次生成已过 24 小时
function ensureGuildQuests() {
    if (!player.trading || !player.trading.guildQuests) return;
    const gq = player.trading.guildQuests;
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    var shouldRefresh = false;
    if (!gq.list || gq.list.length === 0) shouldRefresh = true;
    else if (gq.lastReset > 0 && now - gq.lastReset >= dayMs) shouldRefresh = true;
    if (!shouldRefresh) return;
    const cities = Object.keys(tradingConfig.cities || {});
    const goods = Object.keys(tradingConfig.goods || {});
    if (cities.length < 2 || goods.length < 1) return;
    gq.list = [];
    gq.lastReset = now;
    if (player.trading.profitToday == null) player.trading.profitToday = 0;
    player.trading.profitToday = 0;
    for (let i = 0; i < 5; i++) {
        const typeRoll = i % 5;
        if (typeRoll === 0) {
            const good = goods[Math.floor(Math.random() * goods.length)];
            const toCity = cities[Math.floor(Math.random() * cities.length)];
            const amount = 5 + Math.floor(Math.random() * 16);
            const reward = 2000 + Math.floor(Math.random() * 6000);
            gq.list.push({ type: 'deliver', good, toCity, amount, reward, progress: 0, id: 'd' + i + now });
        } else if (typeRoll === 1) {
            const target = 50000 + Math.floor(Math.random() * 250001);
            const reward = 5000 + Math.floor(Math.random() * 10000);
            gq.list.push({ type: 'profit', target, reward, progress: 0, id: 'p' + i + now });
        } else if (typeRoll === 2) {
            const toCity = cities[Math.floor(Math.random() * cities.length)];
            const reward = 3000 + Math.floor(Math.random() * 4000);
            gq.list.push({ type: 'visit', toCity, reward, id: 'v' + i + now });
        } else if (typeRoll === 3) {
            if (Math.random() < 0.48) {
                const targetCount = 3 + Math.floor(Math.random() * 4);
                const reward = 4000 + Math.floor(Math.random() * 5000);
                gq.list.push({ type: 'tour', targetCount, reward, progress: 0, visitedCities: {}, id: 't' + i + now });
            } else {
                const legs = 5 + Math.floor(Math.random() * 6);
                const reward = 6500 + Math.floor(Math.random() * 9000);
                gq.list.push({ type: 'travelLegs', legs, reward, progress: 0, id: 'tl' + i + now });
            }
        } else {
            const good = goods[Math.floor(Math.random() * goods.length)];
            const toCity = cities[Math.floor(Math.random() * cities.length)];
            const amount = 3 + Math.floor(Math.random() * 8);
            const reward = 3500 + Math.floor(Math.random() * 4500);
            gq.list.push({ type: 'buyAtCity', good, city: toCity, amount, reward, progress: 0, id: 'ba' + i + now });
        }
    }
}

// 仅更新商会任务刷新倒计时（供定时器调用）
function updateGuildQuestCountdownOnly() {
    const el = document.getElementById('guildQuestCountdown');
    if (!el || !player.trading || !player.trading.guildQuests) return;
    const gq = player.trading.guildQuests;
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    if (!gq.list || gq.list.length === 0) {
        el.textContent = '任务已全部完成，下次进入本页将刷新';
        el.style.color = '#8BC34A';
        return;
    }
    if (!gq.lastReset || gq.lastReset <= 0) {
        el.textContent = '刷新计时：--';
        return;
    }
    const nextRefresh = gq.lastReset + dayMs;
    let remain = nextRefresh - now;
    if (remain <= 0) {
        el.textContent = '已到刷新时间，下次进入本页将刷新';
        el.style.color = '#FF9800';
        return;
    }
    const h = Math.floor(remain / 3600000);
    const m = Math.floor((remain % 3600000) / 60000);
    const s = Math.floor((remain % 60000) / 1000);
    el.textContent = '下次刷新：' + (h + '时' + String(m).padStart(2, '0') + '分' + String(s).padStart(2, '0') + '秒');
    el.style.color = '#aaa';
}

// 更新商会任务进度；type: 'sell'|'buy'|'arrive'；buy 时第5参为购买所在城市（代购用）
function checkGuildQuestProgress(type, good, quantity, amountOrRevenue, arrivedCity) {
    if (!player.trading || !player.trading.guildQuests || !player.trading.guildQuests.list) return;
    const list = player.trading.guildQuests.list;
    if (type === 'arrive' && arrivedCity) {
        for (let i = list.length - 1; i >= 0; i--) {
            const q = list[i];
            if (q.type === 'deliver' && q.toCity === arrivedCity) {
                const inv = (player.trading.inventory && player.trading.inventory[q.good]) ? player.trading.inventory[q.good].quantity : 0;
                if (inv >= q.amount) {
                    if (player.nightClub && player.nightClub.starCoins != null) player.nightClub.starCoins += q.reward;
                    if (typeof logAction === 'function') logAction(`商会任务完成：将${q.amount}件${q.good}运至${arrivedCity}，获得${q.reward}星币`, 'success');
                    list.splice(i, 1);
                }
            } else if (q.type === 'visit' && q.toCity === arrivedCity) {
                if (player.nightClub && player.nightClub.starCoins != null) player.nightClub.starCoins += q.reward;
                if (typeof logAction === 'function') logAction(`商会任务完成：抵达${arrivedCity}（旅游），获得${q.reward}星币`, 'success');
                list.splice(i, 1);
            } else if (q.type === 'tour') {
                if (!q.visitedCities[arrivedCity]) {
                    q.visitedCities[arrivedCity] = true;
                    q.progress = (q.progress || 0) + 1;
                }
                if (q.progress >= q.targetCount) {
                    if (player.nightClub && player.nightClub.starCoins != null) player.nightClub.starCoins += q.reward;
                    if (typeof logAction === 'function') logAction(`商会任务完成：跑图路过${q.targetCount}座城市，获得${q.reward}星币`, 'success');
                    list.splice(i, 1);
                }
            } else if (q.type === 'travelLegs') {
                q.progress = (q.progress || 0) + 1;
                if (q.progress >= q.legs) {
                    if (player.nightClub && player.nightClub.starCoins != null) player.nightClub.starCoins += q.reward;
                    if (typeof logAction === 'function') logAction(`商会任务完成：累计抵达城市 ${q.legs} 次，获得${q.reward}星币`, 'success');
                    list.splice(i, 1);
                }
            }
        }
        return;
    }
    if (type === 'sell' && good != null) {
        for (let i = list.length - 1; i >= 0; i--) {
            const q = list[i];
            if (q.type !== 'profit') continue;
            q.progress = Math.floor(player.trading.profitToday || 0);
            if (q.progress >= q.target) {
                if (player.nightClub && player.nightClub.starCoins != null) player.nightClub.starCoins += q.reward;
                if (typeof logAction === 'function') logAction(`商会任务完成：当日利润达到${q.target}，获得${q.reward}星币`, 'success');
                list.splice(i, 1);
            }
        }
    }
    if (type === 'buy' && good != null) {
        const buyCity = arrivedCity;
        for (let i = list.length - 1; i >= 0; i--) {
            const q = list[i];
            if (q.type !== 'buyAtCity' || q.good !== good || !buyCity || q.city !== buyCity) continue;
            q.progress = (q.progress || 0) + quantity;
            if (q.progress >= q.amount) {
                if (player.nightClub && player.nightClub.starCoins != null) player.nightClub.starCoins += q.reward;
                if (typeof logAction === 'function') logAction(`商会任务完成：在${q.city}代购${q.amount}件${good}，获得${q.reward}星币`, 'success');
                list.splice(i, 1);
            }
        }
    }
}

// 在卖出时累计当日利润（用于“当日利润”任务）
function addDailyProfit(profit) {
    if (!player.trading) return;
    if (player.trading.profitToday == null) player.trading.profitToday = 0;
    player.trading.profitToday += profit;
}

// 旅行到其他城市
function travelToCity(city) {
    updateMapTab();
    if (player.trading.isTraveling) {
        logAction("当前正在旅行中，无法更改目的地", "error");
        return;
    }
    
    if (city === player.trading.currentCity) {
        logAction("已经在目标城市", "info");
        return;
    }
    
    player.trading.travelDestination = city;
    
    // 显示旅行信息
    const baseTime = tradingConfig.cities[city].travelTime;
    const speedBonus = player.trading.transport.speedBonus;
    const actualTime = baseTime * (100 - speedBonus) / 100 - Math.min(player.parking.level / 33, 1.21);
       
    logAction(`已选择目的地：${city}，预计需要${actualTime.toFixed(1)}分钟`, "info");
    updateMapTab();
     
}
function cancelTravel() {
    // 如果自动贸易启用，禁用手动取消旅行
    if (player.trading.autoTrade.enabled) {
        logAction("自动贸易已启用，无法手动取消旅行", "warning");
        return;
    }
    
    if (!player.trading.isTraveling) {
        logAction("当前没有进行中的旅行", "info");
        return;
    }
    
    showCustomConfirm("确定要取消当前旅行吗？已花费的时间将不会返还。", (confirmed) => {
        if (confirmed) {
            if (player.trading.travelInterval) {
                clearInterval(player.trading.travelInterval);
                player.trading.travelInterval = null;
            }
            
            player.trading.isTraveling = false;
            player.trading.travelDestination = '';
            
            logAction("已取消旅行", "info");
            updateMapTab();
        }
    });
}
function addCancelTravelButton() {
    const travelInfo = document.getElementById('travelInfo');
    if (!document.getElementById('cancelTravelBtn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancelTravelBtn';
        cancelBtn.textContent = '取消旅行';
        cancelBtn.style.marginLeft = '10px';
        cancelBtn.style.background = '#f44336';
        cancelBtn.onclick = cancelTravel;
        travelInfo.appendChild(cancelBtn);
    }
}
// 开始旅行
function startTravel() {
    // 如果自动贸易启用，禁用手动旅行
    if (player.trading.autoTrade.enabled) {
        logAction("自动贸易已启用，无法手动旅行", "warning");
        return;
    }
    
    if (!player.trading.travelDestination) {
        logAction("请先选择目的地", "error");
        return;
    }
    
    if (player.trading.isTraveling) {
        logAction("当前正在旅行中", "error");
        return;
    }
    
    const destination = player.trading.travelDestination;
    const baseTime = tradingConfig.cities[destination].travelTime;
    const speedBonus = player.trading.transport.speedBonus || 0;
    const parkingLevel = (player.parking && typeof player.parking.level === 'number') ? player.parking.level : 0;
    let actualTime = Math.max(0.1, baseTime * (100 - speedBonus) / 100 - Math.min(parkingLevel / 33, 1.21));
    var empTravel = (typeof getEmployeeTravelSpeedBonus === 'function') ? getEmployeeTravelSpeedBonus() : 0;
    if (empTravel > 0) actualTime = Math.max(0.1, actualTime * (1 - empTravel / 100));
    if (player.trading.travelTimeReductionEnd && Date.now() <= player.trading.travelTimeReductionEnd && (player.trading.travelTimeReduction || 0) > 0) {
        actualTime = Math.max(0.1, actualTime * (1 - player.trading.travelTimeReduction));
        player.trading.travelTimeReduction = 0;
        player.trading.travelTimeReductionEnd = 0;
    }
    player.trading.isTraveling = true;
    player.trading.travelStartTime = Date.now();
    player.trading.travelEndTime = Date.now() + actualTime * 60 * 1000;
    
    logAction(`开始前往${destination}，预计需要${actualTime.toFixed(1)}分钟`, "info");
    
    // 确保清除之前的计时器
    if (player.trading.travelInterval) {
        clearInterval(player.trading.travelInterval);
    }
    
    // 启动旅行计时器
    player.trading.travelInterval = registerInterval(checkTravelStatus, 1000);
    
    updateMapTab();
}

// 检查旅行状态
function checkTravelStatus() {
    if (!player.trading.isTraveling) return;
    
    const now = Date.now();
    if (now >= player.trading.travelEndTime) {
        // 到达目的地：自动贸易走 completeAutoTravel，手动旅行走 completeTravel（含随机事件）
        if (player.trading.autoTrade && player.trading.autoTrade.enabled) {
            completeAutoTravel();
        } else {
            completeTravel();
        }
    } else {
        // 更新旅行进度显示
        updateTravelProgress();
    }
}
// 完成旅行
function completeTravel() {
    if (player.trading.travelInterval) {
        clearInterval(player.trading.travelInterval);
        player.trading.travelInterval = null;
    }
    // 记录本次旅行时长（用于短途收益衰减，抑制王都↔附近城市刷钱）
    if (player.trading.travelEndTime != null && player.trading.travelStartTime != null) {
        player.trading.lastTravelTimeMinutes = (player.trading.travelEndTime - player.trading.travelStartTime) / 60000;
    }
    
    player.trading.currentCity = player.trading.travelDestination;
    const arrivedCity = player.trading.currentCity;
    player.trading.isTraveling = false;
    player.trading.travelDestination = '';
    
    logAction(`已到达${arrivedCity}`, "success");
    
    if (typeof checkGuildQuestProgress === 'function') checkGuildQuestProgress('arrive', null, 0, 0, arrivedCity);
    
    // 更新界面
    updateMapTab();
    updateTradingUI();
    
    if (typeof onTradingArrival === 'function') onTradingArrival({ isAuto: false });
    else triggerRandomEvent();
    updateMapTab();
    updateTradingUI();
}

function updateTravelProgress() {
    const now = Date.now();
    const elapsed = now - player.trading.travelStartTime;
    const total = player.trading.travelEndTime - player.trading.travelStartTime;
    const progress = Math.min(100, (elapsed / total) * 100);
    
    // 更新UI显示
    const minutesRemaining = Math.ceil((player.trading.travelEndTime - now) / (1000 * 60));
    
    // 更新自动贸易进度条
    updateAutoTradeProgressBar();
    
    // 如果世界地图界面打开，也更新那里的进度条
    if (document.getElementById('travelProgressBar')) {
        document.getElementById('travelProgressBar').style.width = `${progress}%`;
        document.getElementById('travelTime').textContent = `${minutesRemaining}分钟`;
        document.getElementById('travelStatus').textContent = `旅行中... ${progress.toFixed(1)}%`;
    }
}


// 触发随机事件（受风险偏好、雇员风控与斥候影响）
function triggerRandomEvent() {
    if (!player || !player.trading) return;
    var eventChance = Math.random();
    var risk = (player.trading.riskAppetite != null && player.trading.riskAppetite !== '') ? player.trading.riskAppetite : 'balanced';
    var pPos = 0.26, pNeg = 0.2, pOpp = 0.2;
    if (risk === 'aggressive') { pPos = 0.28; pNeg = 0.22; pOpp = 0.21; }
    if (risk === 'steady') { pPos = 0.24; pNeg = 0.17; pOpp = 0.19; }
    var luck = typeof getEmployeeTravelEventLuck === 'function' ? getEmployeeTravelEventLuck() : 0;
    pPos += luck * 0.004;
    pOpp += luck * 0.0035;
    var negRed = typeof getEmployeeNegativeEventReduction === 'function' ? getEmployeeNegativeEventReduction() : 0;
    pNeg *= Math.max(0.38, 1 - Math.min(0.55, negRed / 100));
    if (eventChance < pPos) {
        triggerPositiveEvent();
    } else if (eventChance < pPos + pNeg) {
        if (risk === 'steady' && Math.random() < 0.1) return;
        triggerNegativeEvent();
    } else if (eventChance < pPos + pNeg + pOpp) {
        triggerOpportunityEvent();
    }
}

// 正面事件
function triggerPositiveEvent() {
    const events = [
        {
            type: 'discount',
            message: '特价采购！所有商品临时降价40%，持续1小时',
            effect: () => {
                logAction("特价采购事件触发！商品价格下降40%", "success");
            }
        },
        {
            type: 'demand',
            message: '豪商收购！随机商品临时涨价50%，持续1小时',
            effect: () => {
                const goods = Object.keys(tradingConfig.goods);
                const randomGood = goods[Math.floor(Math.random() * goods.length)];
                logAction(`豪商收购事件触发！${randomGood}价格上涨50%`, "success");
            }
        },
        {
            type: 'festival',
            message: '节日促销！当前城市出售收益+15%，持续10分钟',
            effect: () => {
                if (player.trading && player.trading.currentCity) {
                    player.trading.eventBonus = {
                        endTime: Date.now() + 10 * 60 * 1000,
                        sellMultiplier: 1.15,
                        city: player.trading.currentCity
                    };
                    logAction("节日促销！当前城市出售收益+15%，持续10分钟", "success");
                }
            }
        },
        {
            type: 'luckyMerchant',
            message: '幸运商人眷顾！下次购买任意商品将额外获得1个',
            effect: () => {
                if (player.trading) {
                    player.trading.luckyMerchantNextBuy = true;
                    logAction("幸运商人眷顾！下次购买将额外获得1个该商品", "success");
                }
            }
        },
        {
            type: 'mysteryMerchant',
            message: '神秘商人出现！以市价七折卖给你一批随机货物',
            effect: () => {
                const goods = Object.keys(tradingConfig.goods);
                const good = goods[Math.floor(Math.random() * goods.length)];
                const city = player.trading.currentCity;
                const marketPrice = player.trading.cityPrices[city][good] || tradingConfig.goods[good].basePrice;
                const qty = 3 + Math.floor(Math.random() * 5);
                const cost = Math.floor(marketPrice * 0.7 * qty);
                if (player.nightClub.starCoins >= cost) {
                    player.nightClub.starCoins -= cost;
                    const item = player.trading.inventory[good];
                    const slots = tradingConfig.goods[good].slots * qty;
                    if (getTradingTotalCapacity() >= (player.trading.warehouse.used || 0) + slots) {
                        if (item) {
                            item.quantity += qty;
                            item.totalCost += cost;
                            item.averageCost = item.totalCost / item.quantity;
                            item.purchaseCity = mergeInventoryPurchaseCity(item.purchaseCity, city);
                        } else {
                            player.trading.inventory[good] = { quantity: qty, averageCost: cost / qty, totalCost: cost, purchaseCity: city, lastBuyPrice: Math.ceil(cost / qty) };
                        }
                        player.trading.warehouse.used = (player.trading.warehouse.used || 0) + slots;
                        if (typeof logAction === 'function') logAction(`神秘商人：以${cost.toLocaleString()}星币购入${qty}件${good}`, "success");
                    }
                }
            }
        },
        {
            type: 'roadTreasure',
            message: '路边发现宝箱！获得一笔星币',
            effect: () => {
                const amount = 5000 + Math.floor(Math.random() * 15001);
                if (player.nightClub && player.nightClub.starCoins != null) player.nightClub.starCoins += amount;
                if (typeof logAction === 'function') logAction(`路边宝箱：获得${amount.toLocaleString()}星币`, "success");
            }
        },
        {
            type: 'travelBoost',
            message: '贵人相助！下次旅行时间减少20%',
            effect: () => {
                if (player.trading) {
                    player.trading.travelTimeReduction = (player.trading.travelTimeReduction || 0) + 0.2;
                    player.trading.travelTimeReductionEnd = Date.now() + 60 * 60 * 1000;
                    if (typeof logAction === 'function') logAction("贵人相助！1小时内下次旅行时间-20%", "success");
                }
            }
        },
        {
            type: 'guildGratuity',
            message: '商会犒赏！发放一笔慰问星币',
            effect: () => {
                var amt = 8000 + Math.floor(Math.random() * 22001);
                if (player.nightClub && player.nightClub.starCoins != null) player.nightClub.starCoins += amt;
                if (typeof logAction === 'function') logAction('商会犒赏：+' + amt.toLocaleString() + ' 星币', 'success');
            }
        },
        {
            type: 'teaBreak',
            message: '商队茶歇！全体卖价微幅提振',
            effect: () => {
                var t = typeof tradingNow === 'function' ? tradingNow() : Date.now();
                player.trading.globalSellMult = 1.025;
                player.trading.globalSellMultEnd = t + 35 * 60 * 1000;
                if (typeof logAction === 'function') logAction('茶歇加成：约35分钟内卖价×1.025', 'success');
            }
        },
        {
            type: 'supplySeason',
            message: '进货季！各地进货价短暂回落',
            effect: () => {
                var t2 = typeof tradingNow === 'function' ? tradingNow() : Date.now();
                player.trading.globalBuyMult = 0.97;
                player.trading.globalBuyMultEnd = t2 + 28 * 60 * 1000;
                if (typeof logAction === 'function') logAction('进货季：约28分钟内市价买入×0.97', 'success');
            }
        },
        {
            type: 'reputationWindfall',
            message: '行商口碑发酵！商人声望提升',
            effect: () => {
                var r = 10 + Math.floor(Math.random() * 31);
                player.trading.reputation = (player.trading.reputation || 0) + r;
                if (typeof updateMerchantLevelFromReputation === 'function') updateMerchantLevelFromReputation();
                if (typeof logAction === 'function') logAction('口碑发酵：商人声望+' + r, 'success');
            }
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    event.effect();
    logAction(event.message, "event");
}

// 负面事件
function triggerNegativeEvent() {
    const events = [
        {
            type: 'robbery',
            message: '遭遇强盗！损失部分货物',
            effect: () => {
                if (!player.trading.insurance) player.trading.insurance = { goods: false, transport: false, bundle: false };
                if (player.trading.insurance.goods || player.trading.insurance.bundle) {
                    logAction("强盗事件触发！但已投保，损失由保险公司承担", "event");
                    return;
                }
                // 员工「保镖队长」+ 商人等级L4+ 减免抢劫损失
                let robberyReduction = 0;
                if (player.trading.employees && player.trading.employees.length > 0) {
                    player.trading.employees.forEach(emp => {
                        if (emp.robberyReduction) robberyReduction = Math.min(100, robberyReduction + emp.robberyReduction);
                    });
                }
                var ml = player.trading.merchantLevel || 1;
                if (ml >= 4) robberyReduction = Math.min(100, robberyReduction + 10 + Math.min(32, ml - 4));
                const lossMultiplier = Math.max(0, 1 - robberyReduction / 100);
                const lossPercentage = (0.1 + Math.random() * 0.2) * lossMultiplier;
                let totalLoss = 0;
                const inv = player.trading.inventory;
                Object.keys(inv).forEach(good => {
                    const item = inv[good];
                    const qty = typeof item === 'object' && item != null && 'quantity' in item ? item.quantity : 0;
                    if (qty <= 0) return;
                    const lossQuantity = Math.floor(qty * lossPercentage);
                    if (lossQuantity > 0) {
                        const goodConfig = tradingConfig.goods[good];
                        if (!goodConfig) return;
                        if (item.quantity === lossQuantity) {
                            player.trading.warehouse.used -= goodConfig.slots * lossQuantity;
                            delete player.trading.inventory[good];
                        } else {
                            item.quantity -= lossQuantity;
                            item.totalCost = item.averageCost * item.quantity;
                            player.trading.warehouse.used -= goodConfig.slots * lossQuantity;
                        }
                        totalLoss += lossQuantity;
                    }
                });
                player.trading.hasExperiencedRobbery = true;
                logAction(`强盗事件触发！损失了约${Math.round(lossPercentage * 100)}%的货物`, "event");
            }
        },
        {
            type: 'spoilage',
            message: '商品腐败！部分易腐商品价值归零',
            effect: () => {
                // 先检查是否有易腐商品，没有则直接返回，避免误报或仓库异常
                let hasPerishable = false;
                Object.keys(tradingConfig.goods).forEach(good => {
                    const goodConfig = tradingConfig.goods[good];
                    if (goodConfig.shelfLife === Infinity) return;
                    const item = player.trading.inventory[good];
                    if (item && typeof item === 'object' && 'quantity' in item && item.quantity > 0) hasPerishable = true;
                });
                if (!hasPerishable) return;

                let anySpoiled = false;
                Object.keys(tradingConfig.goods).forEach(good => {
                    const goodConfig = tradingConfig.goods[good];
                    if (goodConfig.shelfLife === Infinity) return;
                    const item = player.trading.inventory[good];
                    if (!item) return;
                    const qty = typeof item === 'object' && item != null && 'quantity' in item ? item.quantity : 0;
                    if (qty <= 0) return;
                    var spoilChance = 0.1;
                    var spoilRed = (typeof getEmployeeSpoilReduction === 'function') ? getEmployeeSpoilReduction() : 0;
                    spoilChance = spoilChance * Math.max(0.05, 1 - spoilRed / 100);
                    if (Math.random() < spoilChance) {
                        const spoilQuantity = Math.max(1, Math.floor(qty * 0.5));
                        if (item.quantity === spoilQuantity) {
                            player.trading.warehouse.used -= goodConfig.slots * spoilQuantity;
                            delete player.trading.inventory[good];
                        } else {
                            item.quantity -= spoilQuantity;
                            item.totalCost = item.averageCost * item.quantity;
                            player.trading.warehouse.used -= goodConfig.slots * spoilQuantity;
                        }
                        logAction(`${good}腐败了${spoilQuantity}个`, "event");
                        anySpoiled = true;
                    }
                });
                // 无论是否发生腐败，都按当前库存重算仓库占用，避免 used 与库存不同步
                syncWarehouseUsedFromInventory();
            }
        },
        {
            type: 'tariff',
            message: '临时关税！当前城市买入价临时上涨10%，持续30分钟',
            effect: () => {
                if (player.trading) {
                    player.trading.tariffBonus = { endTime: Date.now() + 30 * 60 * 1000, buyMultiplier: 1.1, city: player.trading.currentCity };
                    if (typeof logAction === 'function') logAction("临时关税：当前城市买入价+10%，持续30分钟", "event");
                }
            }
        },
        {
            type: 'transportFailure',
            message: '运输故障！车辆损坏需维修',
            effect: () => {
                if (!player.trading.insurance) player.trading.insurance = { goods: false, transport: false, bundle: false };
                if (player.trading.insurance.transport || player.trading.insurance.bundle) {
                    logAction("运输故障！运输险已赔付，无损失", "event");
                    return;
                }
                var transport = tradingConfig.transports.find(function(t) { return t.name === player.trading.transport.type; });
                if (transport && transport.maintenance > 0) {
                    var repairCost = Math.floor(transport.maintenance * 3);
                    if (player.nightClub.starCoins >= repairCost) {
                        player.nightClub.starCoins -= repairCost;
                        logAction("运输故障！支付维修费" + repairCost.toLocaleString() + "星币", "event");
                    } else {
                        player.trading.transport = { type: '手推车', capacityBonus: 5, speedBonus: 0 };
                        logAction("运输故障！资金不足维修，降级为手推车", "warning");
                    }
                }
            }
        },
        {
            type: 'tollBooth',
            message: '关卡乱收费！支付一笔过路费',
            effect: () => {
                var toll = 3000 + Math.floor(Math.random() * 12001);
                if (player.nightClub && player.nightClub.starCoins != null) {
                    player.nightClub.starCoins = Math.max(0, player.nightClub.starCoins - toll);
                    if (typeof logAction === 'function') logAction('过路费：-' + toll.toLocaleString() + ' 星币', 'warning');
                }
            }
        },
        {
            type: 'pettyHaggle',
            message: '当地买家刁钻议价！本城短时卖价承压',
            effect: () => {
                var t3 = typeof tradingNow === 'function' ? tradingNow() : Date.now();
                if (player.trading && player.trading.currentCity) {
                    player.trading.sellDebuff = { city: player.trading.currentCity, mult: 0.9, endTime: t3 + 22 * 60 * 1000 };
                    if (typeof logAction === 'function') logAction('刁民议价：当前城市约22分钟内卖价×0.9', 'warning');
                }
            }
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    event.effect();
    logAction(event.message, "event");
}

// 机遇事件
function triggerOpportunityEvent() {
    const events = [
        {
            type: 'limitedOffer',
            message: '发现限时商机！特定商品利润丰厚',
            effect: () => {
                const goods = Object.keys(tradingConfig.goods);
                const randomGood = goods[Math.floor(Math.random() * goods.length)];
                logAction(`限时商机：${randomGood}当前利润丰厚！`, "opportunity");
            }
        },
        {
            type: 'blackMarket',
            message: '发现黑市入口！当前城市可进入黑市交易，持续1小时',
            effect: () => {
                if (player.trading && player.trading.currentCity) {
                    player.trading.blackMarket = { available: true, endTime: Date.now() + 60 * 60 * 1000, city: player.trading.currentCity };
                    if (typeof logAction === 'function') logAction("黑市入口已开启！请到「趣味玩法」- 黑市进行交易", "opportunity");
                }
            }
        },
        {
            type: 'rumor',
            message: '打听到小道消息！某城某商品即将涨价',
            effect: () => {
                const cities = Object.keys(tradingConfig.cities);
                const goods = Object.keys(tradingConfig.goods);
                const city = cities[Math.floor(Math.random() * cities.length)];
                const good = goods[Math.floor(Math.random() * goods.length)];
                const effectEndTime = Date.now() + 2 * 60 * 60 * 1000;
                if (player.trading) {
                    player.trading.rumor = { text: `传闻：${city}的${good}两小时内可能涨价`, good: good, city: city, effectEndTime: effectEndTime };
                    if (typeof logAction === 'function') logAction(`小道消息：${city}的${good}两小时内可能涨价`, "opportunity");
                }
            }
        },
        {
            type: 'bargain',
            message: '捡漏成功！随机一种商品以五折购入1件（若货仓有余）',
            effect: () => {
                const goods = Object.keys(tradingConfig.goods);
                const good = goods[Math.floor(Math.random() * goods.length)];
                const city = player.trading.currentCity;
                const marketPrice = player.trading.cityPrices[city][good] || tradingConfig.goods[good].basePrice;
                const cost = Math.floor(marketPrice * 0.5);
                const slots = tradingConfig.goods[good].slots;
                if (player.nightClub.starCoins >= cost && (player.trading.warehouse.used || 0) + slots <= getTradingTotalCapacity()) {
                    player.nightClub.starCoins -= cost;
                    const item = player.trading.inventory[good];
                    if (item) {
                        item.quantity += 1;
                        item.totalCost += cost;
                        item.averageCost = item.totalCost / item.quantity;
                        item.purchaseCity = mergeInventoryPurchaseCity(item.purchaseCity, city);
                    } else {
                        player.trading.inventory[good] = { quantity: 1, averageCost: cost, totalCost: cost, purchaseCity: city, lastBuyPrice: cost };
                    }
                    player.trading.warehouse.used = (player.trading.warehouse.used || 0) + slots;
                    if (typeof logAction === 'function') logAction(`捡漏：以${cost}星币购入1件${good}`, "success");
                }
            }
        },
        {
            type: 'treasureShard',
            message: '商路秘宝！获得一片商会藏宝图碎片',
            effect: () => {
                if (typeof addTradingTreasureShard === 'function') addTradingTreasureShard(1);
                else { player.trading.treasureShards = (player.trading.treasureShards || 0) + 1; }
                if (typeof logAction === 'function') logAction('获得商路秘宝碎片×1（集齐5片自动兑换大奖）', 'opportunity');
            }
        },
        {
            type: 'doubleRumor',
            message: '线人加急！更可靠的涨价传闻',
            effect: () => {
                var cities = Object.keys(tradingConfig.cities);
                var goods = Object.keys(tradingConfig.goods);
                var city = cities[Math.floor(Math.random() * cities.length)];
                var good = goods[Math.floor(Math.random() * goods.length)];
                var effectEndTime = (typeof tradingNow === 'function' ? tradingNow() : Date.now()) + 3 * 60 * 60 * 1000;
                player.trading.rumor = { text: '加急线报：' + city + '的「' + good + '」三小时内强烈看涨', good: good, city: city, effectEndTime: effectEndTime, strong: true };
                if (typeof logAction === 'function') logAction('加急传闻已更新（涨价幅度略高于普通传闻）', 'opportunity');
            }
        },
        {
            type: 'stormArbitrage',
            message: '风暴套利情报！记下两地价差机会',
            effect: () => {
                var c1 = Object.keys(tradingConfig.cities);
                var g1 = Object.keys(tradingConfig.goods);
                var A = c1[Math.floor(Math.random() * c1.length)];
                var B = c1[Math.floor(Math.random() * c1.length)];
                var g = g1[Math.floor(Math.random() * g1.length)];
                var pa = (player.trading.cityPrices[A] && player.trading.cityPrices[A][g]) || tradingConfig.goods[g].basePrice;
                var pb = (player.trading.cityPrices[B] && player.trading.cityPrices[B][g]) || tradingConfig.goods[g].basePrice;
                if (typeof logAction === 'function') logAction('套利情报：「' + g + '」在 ' + A + ' 约 ' + pa + ' 币，' + B + ' 约 ' + pb + ' 币——可自行比对规划路线', 'opportunity');
            }
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    event.effect();
    logAction(event.message, "opportunity");
}


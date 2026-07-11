// 跑商自动贸易
// 自动贸易功能
function toggleAutoTrade() {
    // 检查是否有保存的路线
    if (player.trading.autoTrade.routes.length === 0) {
        logAction("请先设置自动贸易路线", "error");
        
        // 显示设置界面
        document.getElementById('autoTradeSettings').style.display = 'block';
        document.getElementById('autoTradeStatus').style.display = 'none';
        
        return;
    }
    
    player.trading.autoTrade.enabled = !player.trading.autoTrade.enabled;
    
    if (player.trading.autoTrade.enabled) {
        // 重置状态
        player.trading.autoTrade.currentState = 'idle';
        player.trading.autoTrade.currentRoute = player.trading.autoTrade.routes[0]; // 使用第一条路线
        player.trading.autoTrade.currentProgress = 0;
        player.trading.autoTrade.lastUpdate = Date.now();
        
        // 启动自动贸易系统
        startAutoTradeSystem();
        
        // 启动进度条更新定时器（如果界面打开）
        if (document.getElementById('autoTab').style.display !== 'none') {
            startProgressUpdateTimer();
        }
        
        logAction("自动贸易已启用", "success");
    } else {
        // 停止自动贸易系统
        stopAutoTradeSystem();
        
        // 停止进度条更新定时器
        stopProgressUpdateTimer();
        
        logAction("自动贸易已停用", "info");
    }
    
    updateAutoTradeTab();
}


// 运行自动贸易
function runAutoTrade() {
    if (!player.trading.autoTrade.enabled) return;
    
    const now = tradingNow();
    const elapsed = now - player.trading.autoTrade.lastUpdate;
    
    // 更严格的频率控制：至少间隔10秒才执行一次；离线模拟时不节流，保证每次循环都执行
    if (player.trading._simulatedNow == null && elapsed < 10000) return;
    
    player.trading.autoTrade.lastUpdate = now;
    
    // 检查是否正在旅行中，如果是则跳过其他逻辑
    if (player.trading.isTraveling) {
        updateAutoTravel(elapsed);
        return;
    }
    
    // 检查是否有下一次监控的时间设置
    if (player.trading.autoTrade.nextMonitorTime && now < player.trading.autoTrade.nextMonitorTime) {
        return; // 等待下一次监控时间
    }
    
    // 验证数据
    validateAutoTradeData();
    
    // 检查状态是否有效
    validateAutoTradeState();
    
    switch (player.trading.autoTrade.currentState) {
        case 'idle':
            startFlexibleTrade();
            break;
        case 'buying':
            executeFlexibleBuying();
            break;
        case 'selling':
            executeFlexibleSelling();
            break;
        case 'monitoring':
            monitorPricesAndDecide();
            break;
    }
    
    // 离线模拟时不更新进度条，避免 DOM 未就绪
    if (player.trading._simulatedNow != null) return;
    updateAutoTradeProgressBar();
}

function startFlexibleTrade() {
    if (player.trading.autoTrade.routes.length === 0) {
        if (player.trading._simulatedNow != null) return; // 离线模拟时不关闭 enabled，避免加载后自动贸易被关
        addAutoTradeLog("没有设置自动贸易路线", "warning");
        player.trading.autoTrade.enabled = false;
        updateAutoTradeTab();
        return;
    }
    
    // 选择一条路线
    player.trading.autoTrade.currentRoute = player.trading.autoTrade.routes[0];
    
    // 开始在当前城市寻找机会
    player.trading.autoTrade.currentState = 'monitoring';
    addAutoTradeLog(`开始在${player.trading.currentCity}寻找贸易机会`, "info");
}

function executeFlexibleBuying() {
    // 检查是否正在旅行中
    if (player.trading.isTraveling) {
        return;
    }
    
    const city = player.trading.currentCity;
    if (typeof syncWarehouseUsedFromInventory === 'function') syncWarehouseUsedFromInventory();
    
    // 检查货仓使用率
    const totalCapacity = getTradingTotalCapacity();
    const maxWU = typeof getEffectiveMaxWarehouseUsage === 'function' ? getEffectiveMaxWarehouseUsage() : (player.trading.autoTrade.purchaseSettings.maxWarehouseUsage || 0.8);
    const usageRate = player.trading.warehouse.used / totalCapacity;
    
    if (usageRate >= maxWU) {
        addAutoTradeLog(`已达到最大货仓使用率阈值(${Math.round(maxWU * 100)}%)，开始寻找销售机会`, "info");
        player.trading.autoTrade.currentState = 'selling';
        return;
    }
    
    // 检查库存总金额上限（超限则不再购买）
    const maxInvVal = player.trading.autoTrade.flexibleTrade.maxInventoryValue || 0;
    if (maxInvVal > 0) {
        const totalInvCost = getTotalInventoryCost();
        if (totalInvCost >= maxInvVal) {
            addAutoTradeLog(`库存总金额已达上限${maxInvVal.toLocaleString()}，当前${totalInvCost.toLocaleString()}，不再购买`, "info");
            player.trading.autoTrade.currentState = 'selling';
            return;
        }
    }
    
    // 检查可用资金（路线可能无 tradeCapital，用星币或默认 10000 兜底）
    const availableFunds = player.nightClub.starCoins || 0;
    const routeCapital = player.trading.autoTrade.currentRoute.tradeCapital;
    const minCapital = (routeCapital != null && routeCapital > 0) ? routeCapital * 0.1 : 1000;
    if (availableFunds < minCapital) {
        addAutoTradeLog("资金不足，开始寻找其他城市的机会", "info");
        decideNextDestination();
        return;
    }
    
    // 获取所有可购买的商品
    const allPurchasableGoods = getAllPurchasableGoods();
    
    if (allPurchasableGoods.length === 0) {
        addAutoTradeLog("当前没有价格合适的商品可购买，开始寻找其他城市的机会", "info");
        decideNextDestination();
        return;
    }
    
    // 根据策略选择商品
    const targetGood = selectGoodForPurchase(allPurchasableGoods);
    
    if (!targetGood) {
        addAutoTradeLog("无法确定要购买的商品，开始寻找其他城市的机会", "warning");
        decideNextDestination();
        return;
    }
    
    const route = player.trading.autoTrade.currentRoute;
    const actualPrice = getActualBuyPrice(city, targetGood);
    const routeGood = route && route.goods ? route.goods.find(g => g && g.good === targetGood) : null;
    const maxBuyPrice = routeGood && routeGood.maxBuyPrice != null && Number.isFinite(routeGood.maxBuyPrice) ? routeGood.maxBuyPrice : Infinity;
    if (actualPrice > maxBuyPrice) {
        addAutoTradeLog(`${targetGood}实际买入价${actualPrice}超过最大${maxBuyPrice}，跳过购买`, "info");
        decideNextDestination();
        return;
    }
    const capitalForPurchase = (routeCapital != null && routeCapital > 0) ? routeCapital : Math.max(availableFunds, 10000);
    const quantity = calculateOptimalPurchaseQuantity(targetGood, capitalForPurchase);
    
    if (quantity > 0) {
        buyGood(targetGood, quantity);
        addAutoTradeLog(`购买了${quantity}个${targetGood}，花费${(actualPrice * quantity).toLocaleString()}星币`, "success");
        
        // 购买后按最新占用判断（避免沿用购买前的 usageRate）
        const capAfter = getTradingTotalCapacity();
        const usageAfter = capAfter > 0 ? player.trading.warehouse.used / capAfter : 0;
        if (usageAfter >= maxWU) {
            addAutoTradeLog(`已达到最大货仓使用率阈值(${Math.round(maxWU * 100)}%)，开始寻找销售机会`, "info");
            player.trading.autoTrade.currentState = 'selling';
        }
    } else {
        addAutoTradeLog(`无法购买${targetGood}，资金或空间不足，开始寻找其他城市的机会`, "warning");
        decideNextDestination();
    }
}

function executeFlexibleSelling() {
    // 检查是否正在旅行中
    if (player.trading.isTraveling) {
        return;
    }
    
    const city = player.trading.currentCity;
    if (typeof syncWarehouseUsedFromInventory === 'function') syncWarehouseUsedFromInventory();
    
    // 获取所有可销售的商品
    const allSalableGoods = getAllSalableGoods();
    
    if (allSalableGoods.length === 0) {
        addAutoTradeLog("当前没有利润率合适的商品可销售，开始寻找其他城市的机会", "info");
        decideNextDestination();
        return;
    }
    
    // 选择利润率最高的商品
    const targetGood = allSalableGoods[0].good;
    const price = player.trading.cityPrices[city][targetGood];
    const averageCost = player.trading.inventory[targetGood].averageCost;
    const profitMargin = ((price - averageCost) / averageCost) * 100;
    
    // 计算销售数量
    const quantity = calculateOptimalSaleQuantity(targetGood);
    
    if (quantity > 0) {
        sellGood(targetGood, quantity);
        addAutoTradeLog(`出售了${quantity}个${targetGood}，利润率${profitMargin.toFixed(1)}%`, "success");
        
        // 销售后检查是否需要转为采购模式
        const totalCapacity = getTradingTotalCapacity();
        const usageRate = totalCapacity > 0 ? player.trading.warehouse.used / totalCapacity : 0;
        const maxWU = typeof getEffectiveMaxWarehouseUsage === 'function' ? getEffectiveMaxWarehouseUsage() : (player.trading.autoTrade.purchaseSettings.maxWarehouseUsage || 0.8);
        
        if (usageRate <= maxWU * 0.3) {
            addAutoTradeLog("货仓空间充足，开始寻找采购机会", "info");
            player.trading.autoTrade.currentState = 'buying';
        }
    } else {
        addAutoTradeLog(`无法销售${targetGood}，库存不足，开始寻找其他城市的机会`, "warning");
        decideNextDestination();
    }
}

function validateAutoTradeState() {
    // 离线模拟时跳过“频繁旅行”检测，否则会误判并取消旅行导致离线无收益
    if (player.trading._simulatedNow != null) return;
    // 检查是否处于无效状态循环
    const recentLogs = player.trading.autoTrade.logs.slice(0, 10);
    const travelLogs = recentLogs.filter(log => log.message.includes("前往") || log.message.includes("旅行"));
    
    // 如果最近10条日志中有6条以上是关于旅行的，自动重置状态
    if (travelLogs.length >= 6) {
        addAutoTradeLog("检测到频繁旅行，自动重置为监控状态", "warning");
        player.trading.autoTrade.currentState = 'monitoring';
        player.trading.autoTrade.nextMonitorTime = Date.now() + 120000; // 等待2分钟再检查
        
        // 如果当前正在旅行，取消旅行
        if (player.trading.isTraveling) {
            if (player.trading.travelInterval) {
                clearInterval(player.trading.travelInterval);
                player.trading.travelInterval = null;
            }
            player.trading.isTraveling = false;
            player.trading.travelDestination = '';
        }
        
        // 标记频繁旅行检测
        player.trading.autoTrade.frequentTravelDetection = true;
    }
}

function monitorPricesAndDecide() {
    const city = player.trading.currentCity;
    
    // 检查是否正在旅行中
    if (player.trading.isTraveling) {
        return;
    }
    
    // 同时检查采购和销售机会
    checkBothPurchaseAndSaleOpportunities();
}


function getAllPurchasableGoods() {
    const city = player.trading.currentCity;
    if (!player.trading.cityPrices || !player.trading.cityPrices[city]) return [];
    // 灵活贸易：只考虑路线中选定的商品
    const route = player.trading.autoTrade.currentRoute;
    const allGoods = (route && Array.isArray(route.goods) && route.goods.length > 0)
        ? route.goods.map(g => g && g.good).filter(Boolean)
        : Object.keys(tradingConfig.goods || {});
    const purchasableGoods = [];
    
    allGoods.forEach(good => {
        const price = getActualBuyPrice(city, good); // 使用实际买入价（含关税），严格不超过用户设置
        let maxBuyPrice = Infinity;
        
        // 检查是否有设置该商品的最大买入价（缺省或无效时视为不限制）
        if (player.trading.autoTrade.currentRoute && Array.isArray(player.trading.autoTrade.currentRoute.goods)) {
            const routeGood = player.trading.autoTrade.currentRoute.goods.find(g => g && g.good === good);
            if (routeGood && routeGood.maxBuyPrice != null && Number.isFinite(routeGood.maxBuyPrice)) {
                maxBuyPrice = routeGood.maxBuyPrice; // 用户设置的最大买入价，实际成交价不得超过
            }
        }
        
        if (price != null && Number.isFinite(price) && price <= maxBuyPrice) {
            const basePrice = tradingConfig.goods[good].basePrice;
            const priceRatio = price / basePrice;
            
            purchasableGoods.push({
                good: good,
                price: price,
                basePrice: basePrice,
                priceRatio: priceRatio,
                maxBuyPrice: maxBuyPrice
            });
        }
    });
    
    // 根据策略排序
    const strategy = player.trading.autoTrade.purchaseSettings.purchaseStrategy;
    switch (strategy) {
        case 'priceDesc':
            purchasableGoods.sort((a, b) => b.price - a.price);
            break;
        case 'priceAsc':
            purchasableGoods.sort((a, b) => a.price - b.price);
            break;
        case 'profitMargin':
            purchasableGoods.sort((a, b) => {
                const aProfitPotential = 1 / a.priceRatio;
                const bProfitPotential = 1 / b.priceRatio;
                return bProfitPotential - aProfitPotential;
            });
            break;
    }
    
    return purchasableGoods;
}

function getAllSalableGoods() {
    const city = player.trading.currentCity;
    const salableGoods = [];
    
    // 检查库存中的商品
    Object.keys(player.trading.inventory).forEach(good => {
        if (player.trading.inventory[good].quantity > 0) {
            const price = player.trading.cityPrices[city][good];
            const averageCost = player.trading.inventory[good].averageCost;
            
            if (averageCost > 0) {
                const profitMargin = ((price - averageCost) / averageCost) * 100;
                const minProfitMargin = player.trading.autoTrade.currentRoute?.minProfitMargin || 
                                      player.trading.autoTrade.purchaseSettings.minProfitMargin;
                
                if (profitMargin >= minProfitMargin) {
                    salableGoods.push({
                        good: good,
                        profitMargin: profitMargin,
                        price: price,
                        cost: averageCost,
                        quantity: player.trading.inventory[good].quantity
                    });
                }
            }
        }
    });
    
    // 按利润率降序排序
    salableGoods.sort((a, b) => b.profitMargin - a.profitMargin);
    
    return salableGoods;
}


function selectGoodForPurchase(goodsList) {
    if (goodsList.length === 0) return null;
    
    const strategy = player.trading.autoTrade.purchaseSettings.purchaseStrategy;
    
    switch (strategy) {
        case 'priceDesc':
            return goodsList[0].good; // 最贵的商品
        case 'priceAsc':
            return goodsList[goodsList.length - 1].good; // 最便宜的商品
        case 'profitMargin':
            return goodsList[0].good; // 利润率潜力最高的商品
        default:
            return goodsList[0].good;
    }
}

// 决定下一个目的地
function decideNextDestination() {
    const currentCity = player.trading.currentCity;
    const connectedCities = tradingConfig.cities[currentCity].connections;
    
    if (connectedCities.length === 0) {
        addAutoTradeLog("没有可连接的城市，继续在当前城市监控", "warning");
        player.trading.autoTrade.currentState = 'monitoring';
        return;
    }
    
    // 评估每个城市的潜在机会
    const cityScores = [];
    
    connectedCities.forEach(city => {
        let score = 0;
        
        // 基本分数：随机性
        score += Math.random() * 20;
        
        // 检查采购机会
        const purchasableGoods = evaluateCityPurchasePotential(city);
        score += purchasableGoods.length * 15;
        
        // 检查销售机会
        const salableGoods = evaluateCitySalePotential(city);
        score += salableGoods.length * 20;
        
        // 检查城市类型（优先选择不同类型的城市）
        const currentCityType = tradingConfig.cities[currentCity].region;
        const targetCityType = tradingConfig.cities[city].region;
        if (currentCityType !== targetCityType) {
            score += 25; // 不同类型城市加分
        }
        
        // 最近访问过的城市分数降低
        if (isRecentlyVisited(city)) {
            score -= 30;
        }
        
        // 检查是否有库存商品在该城市有高利润
        const highProfitGoods = getHighProfitGoodsInCity(city);
        score += highProfitGoods.length * 30;
        
        // 检查是否有便宜的商品可购买
        const cheapGoods = getCheapGoodsInCity(city);
        score += cheapGoods.length * 10;
        
        cityScores.push({
            city: city,
            score: score,
            purchasePotential: purchasableGoods.length,
            salePotential: salableGoods.length,
            highProfitGoods: highProfitGoods.length,
            cheapGoods: cheapGoods.length
        });
    });
    
    // 选择分数最高的城市
    cityScores.sort((a, b) => b.score - a.score);
    const bestCity = cityScores[0].city;
    const bestCityScore = cityScores[0];
    
    // 记录决策原因
    let decisionReason = "决定前往";
    if (bestCityScore.purchasePotential > 0) {
        decisionReason += ` ${bestCityScore.purchasePotential}个采购机会`;
    }
    if (bestCityScore.salePotential > 0) {
        decisionReason += ` ${bestCityScore.salePotential}个销售机会`;
    }
    if (bestCityScore.highProfitGoods > 0) {
        decisionReason += ` ${bestCityScore.highProfitGoods}个高利润商品`;
    }
    if (bestCityScore.cheapGoods > 0) {
        decisionReason += ` ${bestCityScore.cheapGoods}个低价商品`;
    }
    if (bestCityScore.purchasePotential === 0 && bestCityScore.salePotential === 0) {
        decisionReason += " 探索新城市";
    }
    
    addAutoTradeLog(`${decisionReason}，前往${bestCity}`, "info");
    startAutoTravel(bestCity);
}
function getHighProfitGoodsInCity(city) {
    const highProfitGoods = [];
    
    // 检查库存中的商品
    Object.keys(player.trading.inventory).forEach(good => {
        if (player.trading.inventory[good].quantity > 0) {
            const price = player.trading.cityPrices[city][good];
            const averageCost = player.trading.inventory[good].averageCost;
            
            if (averageCost > 0) {
                const profitMargin = ((price - averageCost) / averageCost) * 100;
                const highProfitThreshold = (player.trading.autoTrade.currentRoute?.minProfitMargin || 
                                           player.trading.autoTrade.purchaseSettings.minProfitMargin) * 2;
                
                if (profitMargin >= highProfitThreshold) {
                    highProfitGoods.push({
                        good: good,
                        profitMargin: profitMargin
                    });
                }
            }
        }
    });
    
    return highProfitGoods;
}

function getCheapGoodsInCity(city) {
    const cheapGoods = [];
    const allGoods = Object.keys(tradingConfig.goods);
    
    allGoods.forEach(good => {
        const price = player.trading.cityPrices[city][good];
        const basePrice = tradingConfig.goods[good].basePrice;
        const priceRatio = price / basePrice;
        
        // 价格低于基础价格的商品认为是便宜的
        if (priceRatio < 0.9) {
            cheapGoods.push({
                good: good,
                price: price,
                basePrice: basePrice,
                discount: (1 - priceRatio) * 100
            });
        }
    });
    
    return cheapGoods;
}

function evaluateCityPurchasePotential(city) {
    const goods = Object.keys(tradingConfig.goods);
    const purchasableGoods = [];
    
    goods.forEach(good => {
        const price = getActualBuyPrice(city, good);
        let maxBuyPrice = Infinity;
        
        if (player.trading.autoTrade.currentRoute) {
            const routeGood = player.trading.autoTrade.currentRoute.goods.find(g => g && g.good === good);
            if (routeGood && routeGood.maxBuyPrice != null && Number.isFinite(routeGood.maxBuyPrice)) {
                maxBuyPrice = routeGood.maxBuyPrice;
            }
        }
        
        if (price != null && Number.isFinite(price) && price <= maxBuyPrice) {
            purchasableGoods.push(good);
        }
    });
    
    return purchasableGoods;
}

// 评估城市的销售潜力
function evaluateCitySalePotential(city) {
    const salableGoods = [];
    
    Object.keys(player.trading.inventory).forEach(good => {
        if (player.trading.inventory[good].quantity > 0) {
            const price = player.trading.cityPrices[city][good];
            const averageCost = player.trading.inventory[good].averageCost;
            
            if (averageCost > 0) {
                const profitMargin = ((price - averageCost) / averageCost) * 100;
                const minProfitMargin = player.trading.autoTrade.currentRoute?.minProfitMargin || 
                                      player.trading.autoTrade.purchaseSettings.minProfitMargin;
                
                if (profitMargin >= minProfitMargin) {
                    salableGoods.push(good);
                }
            }
        }
    });
    
    return salableGoods;
}

// 检查城市是否最近访问过
function isRecentlyVisited(city) {
    // 简化实现：检查最近5条日志中是否提到该城市
    const recentLogs = player.trading.autoTrade.logs.slice(0, 5);
    return recentLogs.some(log => log.message.includes(city));
}
function updateAutoTradeProgressBar() {
    // 检查进度条元素是否存在
    const progressBar = document.getElementById('autoTravelProgress');
    const percentageText = document.getElementById('autoTravelPercentage');
    const statusElement = document.querySelector('#autoTradeProgress .progress-label span:first-child');
    
    // 如果元素不存在，直接返回
    if (!progressBar || !percentageText || !statusElement) {
        return;
    }
    
    let progressPercent = 0;
    let statusText = '';
    
    switch (player.trading.autoTrade.currentState) {
        case 'traveling':
            progressPercent = Math.min(100, (player.trading.autoTrade.currentProgress / player.trading.autoTrade.totalTravelTime) * 100);
            statusText = `前往 ${player.trading.travelDestination}`;
            break;
        case 'buying':
            progressPercent = 50;
            statusText = `在 ${player.trading.autoTrade.currentRoute?.buyCity || player.trading.currentCity || '-'} 采购`;
            break;
        case 'selling':
            progressPercent = 50;
            statusText = `在 ${player.trading.autoTrade.currentRoute?.sellCity || player.trading.currentCity || '-'} 销售`;
            break;
        default:
            progressPercent = 0;
            statusText = '等待开始';
    }
    
    // 更新进度条
    progressBar.style.width = `${progressPercent}%`;
    percentageText.textContent = `${progressPercent.toFixed(1)}%`;
    
    // 更新状态文本
    statusElement.textContent = statusText;
}
const safeUpdateAutoTradeProgressBar = withRetry(updateAutoTradeProgressBar);

// 智能采购逻辑
function executeSmartBuying() {
    // 确保当前城市有效
    if (!player.trading.currentCity || !tradingConfig.cities[player.trading.currentCity]) {
        logAction("当前城市无效，重置为默认城市", "error");
        player.trading.currentCity = '王都'; // 默认城市
        return;
    }
    
    const route = player.trading.autoTrade.currentRoute;
    const city = player.trading.currentCity;
    if (typeof syncWarehouseUsedFromInventory === 'function') syncWarehouseUsedFromInventory();
    
    // 检查货仓使用率
    const totalCapacity = getTradingTotalCapacity();
    const maxWU = typeof getEffectiveMaxWarehouseUsage === 'function' ? getEffectiveMaxWarehouseUsage() : (player.trading.autoTrade.purchaseSettings.maxWarehouseUsage || 0.8);
    const usageRate = totalCapacity > 0 ? player.trading.warehouse.used / totalCapacity : 0;
    
    if (usageRate >= maxWU) {
        addAutoTradeLog("货仓使用率超过设定值，开始前往销售城市", "info");
        startAutoTravel(route.sellCity);
        return;
    }
    
    // 获取可购买的商品列表（按策略排序）
    const availableGoods = getAvailableGoodsForPurchase(route);
    
    if (availableGoods.length === 0) {
        addAutoTradeLog("没有价格合适的商品可购买，开始前往销售城市", "info");
        startAutoTravel(route.sellCity);
        return;
    }
    
    // 购买策略选择的商品
    const targetGood = availableGoods[0];
    
    // 确保商品名称有效
    if (!targetGood || typeof targetGood !== 'string') {
        addAutoTradeLog("无法确定要购买的商品，开始前往销售城市", "error");
        startAutoTravel(route.sellCity);
        return;
    }
    
    const actualPrice = getActualBuyPrice(city, targetGood);
    const routeGood = route.goods.find(g => g && g.good === targetGood);
    const maxBuyPrice = routeGood && routeGood.maxBuyPrice != null && Number.isFinite(routeGood.maxBuyPrice) ? routeGood.maxBuyPrice : Infinity;
    if (actualPrice > maxBuyPrice) {
        addAutoTradeLog(`${targetGood}实际买入价${actualPrice}超过最大${maxBuyPrice}，跳过`, "info");
        startAutoTravel(route.sellCity);
        return;
    }
    const quantity = calculateOptimalPurchaseQuantity(targetGood, route.tradeCapital);
    
    if (quantity > 0) {
        buyGood(targetGood, quantity);
        addAutoTradeLog(`购买了${quantity}个${targetGood}，花费${(actualPrice * quantity).toLocaleString()}星币`, "success");
    } else {
        addAutoTradeLog(`无法购买${targetGood}，资金或空间不足`, "warning");
        
        // 尝试购买下一个商品
        if (availableGoods.length > 1) {
            player.trading.autoTrade.currentRoute.currentGoodIndex = 
                (player.trading.autoTrade.currentRoute.currentGoodIndex + 1) % availableGoods.length;
        } else {
            // 没有其他商品可买，开始旅行
            addAutoTradeLog("所有商品都无法购买，开始前往销售城市", "info");
            startAutoTravel(route.sellCity);
        }
    }
}

function getAvailableGoodsForPurchase(route) {
    const city = player.trading.currentCity;
    const availableGoods = [];
    const strategy = player.trading.autoTrade.purchaseSettings.purchaseStrategy;
    
    // 确保route和route.goods存在
    if (!route || !route.goods || !Array.isArray(route.goods)) {
        return [];
    }
    
    route.goods.forEach(item => {
        // 确保item和item.good存在
        if (!item || !item.good) return;
        
        const good = item.good;
        const price = getActualBuyPrice(city, good); // 使用实际买入价（含关税）
        // 使用用户设置的最大买入价，实际成交价不得超过
        const maxPrice = item.maxBuyPrice;
        
        if (price != null && Number.isFinite(price) && price <= maxPrice) {
            const basePrice = tradingConfig.goods[good].basePrice;
            const priceRatio = price / basePrice;
            
            availableGoods.push({
                good: good,
                price: price,
                basePrice: basePrice,
                priceRatio: priceRatio,
                maxBuyPrice: item.maxBuyPrice
            });
        }
    });
    
    // 根据策略排序
    switch (strategy) {
        case 'priceDesc':
            // 价格降序（先买最贵的）
            availableGoods.sort((a, b) => b.price - a.price);
            break;
        case 'priceAsc':
            // 价格升序（先买最便宜的）
            availableGoods.sort((a, b) => a.price - b.price);
            break;
        case 'profitMargin':
            // 利润率优先（基于基础价格计算潜在利润率）
            availableGoods.sort((a, b) => {
                // 价格接近基础价格的商品有更高潜在利润率
                const aProfitPotential = 1 / a.priceRatio;
                const bProfitPotential = 1 / b.priceRatio;
                return bProfitPotential - aProfitPotential;
            });
            break;
    }
    
    return availableGoods.map(item => item.good);
}


// 计算最优购买数量（使用实际买入价，含关税；按最大货仓使用率一次性买到上限，不再固定最多 10 个）
function calculateOptimalPurchaseQuantity(good, availableCapital) {
    const city = player.trading.currentCity;
    const price = getActualBuyPrice(city, good);
    const goodConfig = tradingConfig.goods[good];
    if (!price || price <= 0 || !goodConfig) return 0;
    const slotsPer = goodConfig.slots;
    if (!Number.isFinite(slotsPer) || slotsPer <= 0) return 0;
    var cap = Number(availableCapital);
    if (!Number.isFinite(cap) || cap <= 0) cap = player.nightClub.starCoins || 0;
    var funds = player.nightClub.starCoins || 0;
    
    const maxByFunds = Math.floor(Math.min(cap, funds) / price);
    const slotBudget = getAutoTradeRemainingSlotBudgetSlots();
    const maxBySlots = Math.floor(slotBudget / slotsPer);
    
    const q = Math.max(0, Math.min(maxByFunds, maxBySlots));
    return q >= 1 ? q : (maxByFunds >= 1 && maxBySlots >= 1 ? 1 : 0);
}

function executeSmartSelling() {
    const route = player.trading.autoTrade.currentRoute;
    const city = player.trading.currentCity;
    
    // 获取可销售的商品列表（按利润率降序）
    const availableGoods = getAvailableGoodsForSale(route);
    
    if (availableGoods.length === 0) {
        addAutoTradeLog("没有利润率合适的商品可销售", "info");
        
        // 决定下一步行动
        decideNextAction();
         
        return;
    }
    
    // 销售利润率最高的商品
    const targetGood = availableGoods[0];
    const price = player.trading.cityPrices[city][targetGood.good];
    const averageCost = player.trading.inventory[targetGood.good].averageCost;
    const profitMargin = ((price - averageCost) / averageCost) * 100;
    
    // 计算销售数量（基于库存和策略）
    const quantity = calculateOptimalSaleQuantity(targetGood.good);
    
    if (quantity > 0) {
        sellGood(targetGood.good, quantity);
        addAutoTradeLog(`出售了${quantity}个${targetGood.good}，利润率${profitMargin.toFixed(1)}%`, "success");
    } else {
        addAutoTradeLog(`无法销售${targetGood.good}，库存不足`, "warning");
        
        // 尝试销售下一个商品
        if (availableGoods.length > 1) {
            availableGoods.shift(); // 移除当前商品
            const nextGood = availableGoods[0];
            // 继续尝试销售下一个商品
        } else {
            // 没有其他商品可卖，决定下一步行动
            decideNextAction();
        }
    }
}
function getAvailableGoodsForSale(route) {
    const city = player.trading.currentCity;
    const availableGoods = [];
    
    // 检查库存中的商品
    Object.keys(player.trading.inventory).forEach(good => {
        if (player.trading.inventory[good].quantity > 0) {
            const price = player.trading.cityPrices[city][good];
            const averageCost = player.trading.inventory[good].averageCost;
            
            if (averageCost > 0) {
                const profitMargin = ((price - averageCost) / averageCost) * 100;
                
                if (profitMargin >= route.minProfitMargin) {
                    availableGoods.push({
                        good: good,
                        profitMargin: profitMargin,
                        price: price,
                        cost: averageCost
                    });
                }
            }
        }
    });
    
    // 按利润率降序排序
    availableGoods.sort((a, b) => b.profitMargin - a.profitMargin);
    
    return availableGoods;
}
function calculateOptimalSaleQuantity(good) {
    const inventory = player.trading.inventory[good];
    if (!inventory) return 0;
    
    const quantity = inventory.quantity;
    
    // 销售策略：利润率越高，销售比例越大
    const currentPrice = player.trading.cityPrices[player.trading.currentCity][good];
    const profitMargin = ((currentPrice - inventory.averageCost) / inventory.averageCost) * 100;
    
    let saleRatio = 0.5; // 默认销售50%
    
    if (profitMargin >= 50) {
        saleRatio = 0.8; // 高利润率时销售80%
    } else if (profitMargin >= 20) {
        saleRatio = 0.6; // 中等利润率时销售60%
    } else if (profitMargin >= 10) {
        saleRatio = 0.4; // 低利润率时销售40%
    }
    
    // 确保至少销售1个，最多销售库存数量
    return Math.max(1, Math.min(quantity, Math.floor(quantity * saleRatio)));
}


// 决定下一步行动（智能决策）
function decideNextAction() {
    const route = player.trading.autoTrade.currentRoute;
    const city = player.trading.currentCity;
    
    // 确保当前城市有效
    if (!city || !tradingConfig.cities[city]) {
        logAction("当前城市无效，重置为默认城市", "error");
        player.trading.currentCity = '王都'; // 默认城市
        return;
    }
    
    // 检查当前城市是否有库存
    const hasInventory = Object.keys(player.trading.inventory).some(good => 
        player.trading.inventory[good].quantity > 0
    );
    
    // 检查当前城市是否有可购买的商品
    const hasPurchasableGoods = getAvailableGoodsForPurchase(route).length > 0;
    
    // 灵活路线（无 buyCity/sellCity）：统一用 decideNextDestination 决定下一站
    if (!route.buyCity || !route.sellCity) {
        if (hasPurchasableGoods) {
            player.trading.autoTrade.currentState = 'buying';
            addAutoTradeLog("继续在当前城市寻找可购买的商品", "info");
        } else if (hasInventory) {
            player.trading.autoTrade.currentState = 'selling';
            addAutoTradeLog("有库存，寻找销售机会", "info");
        } else {
            decideNextDestination();
        }
        return;
    }
    // 固定路线决策逻辑
    if (city === route.buyCity) {
        if (hasPurchasableGoods) {
            player.trading.autoTrade.currentState = 'buying';
            addAutoTradeLog("继续在采购城市寻找可购买的商品", "info");
        } else {
            startAutoTravel(route.sellCity);
        }
    } else if (city === route.sellCity) {
        if (hasInventory) {
            const randomDecision = Math.random();
            if (randomDecision < 0.3) {
                goToRandomCity();
            } else if (randomDecision < 0.6) {
                startAutoTravel(route.buyCity);
            } else {
                addAutoTradeLog("利润率不足，等待价格变化", "info");
                setTimeout(() => {
                    if (player.trading.autoTrade.currentState === 'selling') {
                        executeSmartSelling();
                    }
                }, 30000);
            }
        } else {
            startAutoTravel(route.buyCity);
        }
    } else {
        startAutoTravel(route.buyCity);
    }
}
function goToRandomCity() {
    const currentCity = player.trading.currentCity;
    
    // 确保当前城市有效
    if (!currentCity || !tradingConfig.cities[currentCity]) {
        logAction("当前城市无效，重置为默认城市", "error");
        player.trading.currentCity = '王都'; // 默认城市
        return;
    }
    
    const connectedCities = tradingConfig.cities[currentCity].connections;
    
    if (connectedCities.length === 0) {
        addAutoTradeLog("没有可连接的城市，返回采购城市", "warning");
        startAutoTravel(player.trading.autoTrade.currentRoute.buyCity);
        return;
    }
    
    // 随机选择一个城市
    const randomIndex = Math.floor(Math.random() * connectedCities.length);
    const randomCity = connectedCities[randomIndex];
    
    // 确保随机城市有效
    if (!randomCity || !tradingConfig.cities[randomCity]) {
        addAutoTradeLog("随机选择的城市无效，返回采购城市", "error");
        startAutoTravel(player.trading.autoTrade.currentRoute.buyCity);
        return;
    }
    
    addAutoTradeLog(`随机选择前往${randomCity}`, "info");
    startAutoTravel(randomCity);
}

function startAutoTradeRoute() {
    if (player.trading.autoTrade.routes.length === 0) {
        addAutoTradeLog("没有设置自动贸易路线", "warning");
        player.trading.autoTrade.enabled = false;
        updateAutoTradeTab();
        return;
    }
    
    // 选择一条路线（简单实现：选择第一条）
    player.trading.autoTrade.currentRoute = player.trading.autoTrade.routes[0];
    
    // 确保路线有效
    if (!player.trading.autoTrade.currentRoute) {
        addAutoTradeLog("自动贸易路线无效", "error");
        player.trading.autoTrade.enabled = false;
        updateAutoTradeTab();
        return;
    }
    
    // 检查是否已经在采购城市
    if (player.trading.currentCity === player.trading.autoTrade.currentRoute.buyCity) {
        player.trading.autoTrade.currentState = 'buying';
        
        // 修复日志显示 - 不指定具体商品，因为可能采购多种商品
        addAutoTradeLog(`开始在${player.trading.currentCity}采购商品`, "info");
    } else {
        // 需要旅行到采购城市
        startAutoTravel(player.trading.autoTrade.currentRoute.buyCity);
    }
}
function startAutoTravel(destination) {
    // 确保当前城市有效
    if (!player.trading.currentCity || !tradingConfig.cities[player.trading.currentCity]) {
        logAction("当前城市无效，重置为默认城市", "error");
        player.trading.currentCity = '王都'; // 默认城市
        return;
    }
    
    // 确保目标城市有效
    if (!destination || !tradingConfig.cities[destination]) {
        addAutoTradeLog("目标城市无效，无法开始旅行", "error");
        player.trading.autoTrade.currentState = 'monitoring';
        return;
    }
    
    if (player.trading.currentCity === destination) {
        // 已经在目的地
        player.trading.autoTrade.currentState = player.trading.autoTrade.currentState === 'buying' ? 'buying' : 'selling';
        return;
    }
    
    // 检查是否连接
    if (!tradingConfig.cities[player.trading.currentCity].connections.includes(destination)) {
        addAutoTradeLog(`无法直接前往${destination}，需要先连接到该城市`, "error");
        player.trading.autoTrade.currentState = 'monitoring';
        return;
    }
    
    const baseTime = tradingConfig.cities[destination].travelTime;
    const speedBonus = player.trading.transport.speedBonus || 0;
    const parkingLevel = (player.parking && typeof player.parking.level === 'number') ? player.parking.level : 0;
    const actualTime = Math.max(0.1, baseTime * (100 - speedBonus) / 100 - Math.min(parkingLevel / 33, 1.21));
    
    player.trading.autoTrade.currentState = 'traveling';
    player.trading.autoTrade.totalTravelTime = actualTime * 60 * 1000;
    player.trading.autoTrade.currentProgress = 0;
    player.trading.travelDestination = destination;
    player.trading.isTraveling = true;
    const tNow = tradingNow();
    player.trading.travelStartTime = tNow;
    player.trading.travelEndTime = tNow + actualTime * 60 * 1000;
    
    addAutoTradeLog(`开始前往${destination}，预计需要${actualTime.toFixed(1)}分钟`, "info");
    
    // 离线模拟时不创建真实定时器，由 simulateOfflineAutoTrade 的循环按模拟时间推进并判定到达
    if (player.trading._simulatedNow != null) return;
    // 确保清除之前的计时器
    if (player.trading.travelInterval) {
        clearInterval(player.trading.travelInterval);
    }
    // 启动旅行计时器
    player.trading.travelInterval = registerInterval(checkTravelStatus, 1000);
}



function updateAutoTravel(elapsed) {
    player.trading.autoTrade.currentProgress += elapsed;
    
    // 更新旅行进度显示
    updateTravelProgress();
    
    // 检查是否到达目的地
    if (player.trading.autoTrade.currentProgress >= player.trading.autoTrade.totalTravelTime) {
        completeAutoTravel();
    }
}

function completeAutoTravel() {
    if (player.trading.travelInterval) {
        clearInterval(player.trading.travelInterval);
        player.trading.travelInterval = null;
    }
    // 记录本次旅行时长（用于短途收益衰减）
    if (player.trading.autoTrade && typeof player.trading.autoTrade.totalTravelTime === 'number') {
        player.trading.lastTravelTimeMinutes = player.trading.autoTrade.totalTravelTime / 60000;
    }
    
    player.trading.currentCity = player.trading.travelDestination;
    const arrivedCityAuto = player.trading.currentCity;
    player.trading.isTraveling = false;
    player.trading.travelDestination = '';
    player.trading.autoTrade.currentProgress = 0;
    
    if (typeof checkGuildQuestProgress === 'function') checkGuildQuestProgress('arrive', null, 0, 0, arrivedCityAuto);
    
    if (typeof onTradingArrival === 'function') {
        onTradingArrival({ isAuto: true, skipRandomEvents: player.trading._simulatedNow != null });
    }
    
    // 重置当前城市停留时间（离线模拟时使用模拟时间）
    player.trading.autoTrade.currentCityStayStart = tradingNow();
    
    // 先检查采购/销售机会并更新状态，再打日志，这样日志里状态会显示 selling/buying/monitoring 而不是 traveling
    checkBothPurchaseAndSaleOpportunities();
    addAutoTradeLog(`已到达${arrivedCityAuto}，开始寻找贸易机会`, "success");
    
    // 离线模拟时不更新 DOM
    if (player.trading._simulatedNow != null) return;
    updateMapTab();
    updateTradingUI();
}
function checkBothPurchaseAndSaleOpportunities() {
    const city = player.trading.currentCity;
    
    // 检查是否有销售机会（优先检查，因为可能已有库存）
    const salableGoods = getAllSalableGoods();
    if (salableGoods.length > 0) {
        addAutoTradeLog(`发现${salableGoods.length}个销售机会，开始销售`, "info");
        player.trading.autoTrade.currentState = 'selling';
        return;
    }
    
    // 检查是否有采购机会
    const purchasableGoods = getAllPurchasableGoods();
    if (purchasableGoods.length > 0) {
        addAutoTradeLog(`发现${purchasableGoods.length}个采购机会，开始采购`, "info");
        player.trading.autoTrade.currentState = 'buying';
        return;
    }
    
    // 如果都没有机会，前往其他城市寻找机会（否则会一直卡在当前城市）
    addAutoTradeLog("当前城市没有发现采购或销售机会，前往其他城市", "info");
    decideNextDestination();
}

function executeAutoBuy() {
    const route = player.trading.autoTrade.currentRoute;
    const city = player.trading.currentCity;
    const listPrice = player.trading.cityPrices[city][route.good];
    const actPrice = typeof getActualBuyPrice === 'function' ? getActualBuyPrice(city, route.good) : listPrice;
    const priceForQty = (actPrice != null && Number.isFinite(actPrice) && actPrice > 0) ? actPrice : listPrice;
    
    if (listPrice > route.maxBuyPrice) {
        addAutoTradeLog(`${route.good}价格${listPrice}高于最大购买价${route.maxBuyPrice}，等待降价`, "info");
        return;
    }
    
    const goodConfig = tradingConfig.goods[route.good];
    if (!goodConfig || !Number.isFinite(goodConfig.slots) || goodConfig.slots <= 0 || !priceForQty || priceForQty <= 0) {
        addAutoTradeLog("无法计算采购数量（商品配置或价格无效）", "warning");
        return;
    }
    
    // 计算可购买数量（与 buyGood 一致用实际买入价；货仓按最大使用率剩余格数，不再限制为 10）
    const availableFunds = Math.min(player.nightClub.starCoins, route.tradeCapital);
    const maxByFunds = Math.floor(availableFunds / priceForQty);
    const slotBudget = typeof getAutoTradeRemainingSlotBudgetSlots === 'function' ? getAutoTradeRemainingSlotBudgetSlots() : Math.max(0, getTradingTotalCapacity() - player.trading.warehouse.used);
    const maxBySlots = Math.floor(slotBudget / goodConfig.slots);
    
    const quantity = Math.min(maxByFunds, maxBySlots);
    
    if (quantity > 0) {
        buyGood(route.good, quantity);
        addAutoTradeLog(`购买了${quantity}个${route.good}，花费${(priceForQty * quantity).toLocaleString()}星币`, "success");
        
        // 购买完成后，前往销售城市
        startAutoTravel(route.sellCity);
    } else {
        addAutoTradeLog("资金或货仓空间不足，无法购买", "warning");
    }
}

function validateCity(cityName) {
    return cityName && tradingConfig.cities[cityName];
}
function validateAutoTradeData() {
    // 确保routes数组存在
    if (!player.trading.autoTrade.routes) {
        player.trading.autoTrade.routes = [];
    }
    
    var cur = player.trading.autoTrade.currentRoute;
    var routes = player.trading.autoTrade.routes;
    // 存档加载后 currentRoute 与 routes[i] 是不同引用，用 includes 会误判为「当前路线无效已重置」；改为按内容匹配或直接选用第一条
    if (cur && !routes.includes(cur) && routes.length > 0) {
        var match = routes.find(function (r) {
            if (!r || !cur) return false;
            if (r.buyCity != null && cur.buyCity != null)
                return r.buyCity === cur.buyCity && r.sellCity === cur.sellCity && Array.isArray(r.goods) && Array.isArray(cur.goods) && r.goods.length === cur.goods.length;
            return Array.isArray(r.goods) && Array.isArray(cur.goods) && r.goods.length === cur.goods.length && r.tradeCapital === cur.tradeCapital && (r.minProfitMargin == null ? cur.minProfitMargin == null : r.minProfitMargin === cur.minProfitMargin);
        });
        player.trading.autoTrade.currentRoute = match || routes[0];
        if (player.trading._simulatedNow == null) {
            addAutoTradeLog("已恢复当前路线引用", "info");
        }
    }
    
    // 如果没有当前路线但有保存的路线，选择第一条
    if (!player.trading.autoTrade.currentRoute && player.trading.autoTrade.routes.length > 0) {
        player.trading.autoTrade.currentRoute = player.trading.autoTrade.routes[0];
        if (player.trading._simulatedNow == null) {
            addAutoTradeLog("已选择第一条路线作为活动路线", "info");
        }
    }
}

function executeAutoSell() {
    const route = player.trading.autoTrade.currentRoute;
    const city = player.trading.currentCity;
    const price = player.trading.cityPrices[city][route.good];
    
    // 检查库存
    if (!player.trading.inventory[route.good] || player.trading.inventory[route.good].quantity === 0) {
        addAutoTradeLog("没有库存可出售，返回采购城市", "info");
        startAutoTravel(route.buyCity);
        return;
    }
    
    // 计算利润率
    const averageCost = player.trading.inventory[route.good].averageCost;
    const profitMargin = ((price - averageCost) / averageCost) * 100;
    
    if (profitMargin < route.minProfitMargin) {
        addAutoTradeLog(`${route.good}利润率${profitMargin.toFixed(1)}%低于最低要求${route.minProfitMargin}%，等待价格上涨`, "info");
        return;
    }
    
    // 出售部分库存
    const quantity = Math.min(player.trading.inventory[route.good].quantity, 5);
    const revenue = price * quantity;
    const cost = averageCost * quantity;
    const profit = revenue - cost;
    
    sellGood(route.good, quantity);
    
    // 更新统计信息
    player.trading.autoTrade.stats.totalProfit += profit;
    player.trading.autoTrade.stats.totalTrades++;
    player.trading.autoTrade.stats.successfulTrades++;
    
    addAutoTradeLog(`出售了${quantity}个${route.good}，获得${revenue.toLocaleString()}星币，利润${profit.toLocaleString()}星币，利润率${profitMargin.toFixed(1)}%`, "success");
    
    // 出售完成后，返回采购城市继续采购
    startAutoTravel(route.buyCity);
}

function createAutoTradeLogModal() {
    const modalHTML = `
    <div id="autoTradeLogModal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1a1a1a; color: white; padding: 20px; border: 3px solid #FFD700; border-radius: 10px; z-index: 1002; width: 800px; max-height: 80vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: #FFD700; margin: 0;">自动贸易日志</h2>
            <button onclick="closeAutoTradeLog()" style="background: #f44336; color: white; border: none; padding: 5px 15px; border-radius: 3px; cursor: pointer;">关闭</button>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <input type="text" id="logSearch" placeholder="搜索日志..." style="flex: 1; padding: 5px; background: #333; color: white; border: 1px solid #444; border-radius: 3px;">
                <select id="logFilter" style="padding: 5px; background: #333; color: white; border: 1px solid #444; border-radius: 3px;">
                    <option value="all">所有类型</option>
                    <option value="info">信息</option>
                    <option value="success">成功</option>
                    <option value="warning">警告</option>
                    <option value="error">错误</option>
                </select>
                <button onclick="clearAutoTradeLogs()" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">清空日志</button>
            </div>
        </div>
        
        <div id="autoTradeLogContainer" style="max-height: 400px; overflow-y: auto; background: #222; border-radius: 5px; padding: 10px;">
            <!-- 日志内容将在这里动态生成 -->
        </div>
        
        <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #444;">
            <h3 style="color: #FFD700;">统计信息</h3>
            <div id="autoTradeStats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <!-- 统计信息将在这里动态生成 -->
            </div>
        </div>
    </div>
    <div id="autoTradeLogOverlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1001;"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 尝试自动买入
function tryAutoBuy(route) {
    const good = route.good;
    const maxPrice = route.maxBuyPrice;
    const currentPrice = getActualBuyPrice(player.trading.currentCity, good);
    
    if (currentPrice != null && Number.isFinite(currentPrice) && currentPrice <= maxPrice) {
        // 计算可购买数量
        const nc = player.nightClub;
        const star = nc && typeof nc.starCoins === 'number' ? nc.starCoins : Number(nc && nc.starCoins) || 0;
        const availableFunds = star * 0.1;
        const maxByFunds = Math.floor(availableFunds / currentPrice);
        const goodConfig = tradingConfig.goods[good];
        if (!goodConfig || !Number.isFinite(goodConfig.slots) || goodConfig.slots <= 0) return;
        const slotBudget = typeof getAutoTradeRemainingSlotBudgetSlots === 'function' ? getAutoTradeRemainingSlotBudgetSlots() : Math.max(0, getTradingTotalCapacity() - player.trading.warehouse.used);
        const maxBySlots = Math.floor(slotBudget / goodConfig.slots);
        
        const quantity = Math.min(maxByFunds, maxBySlots);
        
        if (quantity > 0) {
            buyGood(good, quantity);
        }
    }
}

// 尝试自动卖出
function tryAutoSell(route) {
    const good = route.good;
    const minProfitMargin = route.minProfitMargin;
    
    if (player.trading.inventory[good] && player.trading.inventory[good].quantity > 0) {
        const currentPrice = player.trading.cityPrices[player.trading.currentCity][good];
        const averageCost = player.trading.inventory[good].averageCost;
        const ac = Number(averageCost);
        if (!Number.isFinite(currentPrice) || !Number.isFinite(ac) || ac <= 0) return;
        const profitMargin = ((currentPrice - ac) / ac) * 100;
        
        if (Number.isFinite(profitMargin) && profitMargin >= minProfitMargin) {
            const quantity = Math.min(player.trading.inventory[good].quantity, 5);
            sellGood(good, quantity);
        }
    }
}

function createInventorySummaryModal() {
    // 检查是否已存在弹窗，避免重复创建
    if (document.getElementById('inventorySummaryModal')) {
        return;
    }
    
    const modalHTML = `
    <div id="inventorySummaryModal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1a1a1a; color: white; padding: 20px; border: 3px solid #FFD700; border-radius: 10px; z-index: 1002; width: 800px; max-height: 80vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: #FFD700; margin: 0;">库存统计详情</h2>
            <button onclick="closeInventorySummary()" style="background: #f44336; color: white; border: none; padding: 5px 15px; border-radius: 3px; cursor: pointer;">关闭</button>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3>总体统计</h3>
            <div id="overallStats" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #333; padding: 10px; border-radius: 5px;">
                <!-- 总体统计数据将在这里动态生成 -->
            </div>
        </div>
        
        <div>
            <h3>商品详情</h3>
            <div style="max-height: 400px; overflow-y: auto;">
                <table id="inventoryDetails" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #333;">
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #444;">商品</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #444;">数量</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #444;">当前价格</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #444;">平均成本</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #444;">总成本</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #444;">当前价值</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #444;">盈亏金额</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #444;">盈亏率</th>
                        </tr>
                    </thead>
                    <tbody id="inventoryDetailsBody">
                        <!-- 商品详情将在这里动态生成 -->
                    </tbody>
                </table>
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button onclick="sortInventoryBy('profitRate')" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 3px; cursor: pointer;">按盈亏率排序</button>
        </div>
    </div>
    <div id="inventorySummaryOverlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1001;"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showInventorySummary() {
    // 确保弹窗已创建
    createInventorySummaryModal();
    
    // 计算库存统计数据
    const stats = calculateInventoryStats();
    
    // 更新总体统计
    updateOverallStats(stats);
    
    // 更新商品详情
    updateInventoryDetails(stats);
    
    // 显示弹窗
    document.getElementById('inventorySummaryModal').style.display = 'block';
    document.getElementById('inventorySummaryOverlay').style.display = 'block';
}

// 关闭库存统计弹窗
function closeInventorySummary() {
    document.getElementById('inventorySummaryModal').style.display = 'none';
    document.getElementById('inventorySummaryOverlay').style.display = 'none';
}

// 获取库存总成本金额（用于库存总金额上限检查）
function getTotalInventoryCost() {
    if (!player.trading || !player.trading.inventory) return 0;
    let total = 0;
    Object.keys(player.trading.inventory).forEach(good => {
        const item = player.trading.inventory[good];
        if (item && typeof item === 'object' && item.totalCost != null && Number.isFinite(item.totalCost)) {
            total += item.totalCost;
        }
    });
    return total;
}

// 计算库存统计数据
function calculateInventoryStats() {
    let totalValue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    let itemCount = 0;
    let bestPerformer = { name: '', profitRate: -Infinity };
    let worstPerformer = { name: '', profitRate: Infinity };
    
    const items = [];
    
    Object.keys(player.trading.inventory).forEach(good => {
        const item = player.trading.inventory[good];
        const currentPrice = player.trading.cityPrices[player.trading.currentCity][good];
        const itemValue = currentPrice * item.quantity;
        const itemCost = item.totalCost;
        const itemProfit = itemValue - itemCost;
        const itemProfitRate = itemCost > 0 ? (itemProfit / itemCost) * 100 : 0;
        
        totalValue += itemValue;
        totalCost += itemCost;
        totalProfit += itemProfit;
        itemCount++;
        
        // 更新最佳和最差表现者
        if (itemProfitRate > bestPerformer.profitRate) {
            bestPerformer = { name: good, profitRate: itemProfitRate };
        }
        if (itemProfitRate < worstPerformer.profitRate) {
            worstPerformer = { name: good, profitRate: itemProfitRate };
        }
        
        // 添加商品详情
        items.push({
            name: good,
            quantity: item.quantity,
            currentPrice: currentPrice,
            averageCost: item.averageCost,
            totalCost: itemCost,
            currentValue: itemValue,
            profit: itemProfit,
            profitRate: itemProfitRate
        });
    });
    
    const overallProfitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    
    return {
        totalValue,
        totalCost,
        totalProfit,
        overallProfitRate,
        itemCount,
        bestPerformer,
        worstPerformer,
        items
    };
}
function updateOverallStats(stats) {
    const overallStats = document.getElementById('overallStats');
    const profitColor = stats.totalProfit >= 0 ? '#4CAF50' : '#f44336';
    const profitSign = stats.totalProfit >= 0 ? '+' : '';
    
    overallStats.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 0.9em; color: #aaa;">商品种类</div>
            <div style="font-size: 1.2em; font-weight: bold;">${stats.itemCount}</div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 0.9em; color: #aaa;">总成本</div>
            <div style="font-size: 1.2em; font-weight: bold;">${stats.totalCost.toLocaleString()}</div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 0.9em; color: #aaa;">总价值</div>
            <div style="font-size: 1.2em; font-weight: bold;">${stats.totalValue.toLocaleString()}</div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 0.9em; color: #aaa;">总盈亏</div>
            <div style="font-size: 1.2em; font-weight: bold; color: ${profitColor};">${profitSign}${stats.totalProfit.toLocaleString()}</div>
            <div style="font-size: 0.9em; color: ${profitColor};">${profitSign}${stats.overallProfitRate.toFixed(2)}%</div>
        </div>
    `;
    
    // 添加最佳和最差表现者
    if (stats.itemCount > 0) {
        overallStats.innerHTML += `
            <div style="text-align: center; grid-column: 1 / span 2;">
                <div style="font-size: 0.9em; color: #aaa;">最佳表现</div>
                <div style="font-size: 1em; color: #4CAF50;">${stats.bestPerformer.name}</div>
                <div style="font-size: 0.9em; color: #4CAF50;">+${stats.bestPerformer.profitRate.toFixed(2)}%</div>
            </div>
            <div style="text-align: center; grid-column: 3 / span 2;">
                <div style="font-size: 0.9em; color: #aaa;">最差表现</div>
                <div style="font-size: 1em; color: #f44336;">${stats.worstPerformer.name}</div>
                <div style="font-size: 0.9em; color: #f44336;">${stats.worstPerformer.profitRate.toFixed(2)}%</div>
            </div>
        `;
    }
}
function updateInventoryDetails(stats) {
    const tbody = document.getElementById('inventoryDetailsBody');
    tbody.innerHTML = '';
    
    if (stats.items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: #888;">暂无库存商品</td>
            </tr>
        `;
        return;
    }
    
    stats.items.forEach(item => {
        const profitColor = item.profit >= 0 ? '#4CAF50' : '#f44336';
        const profitSign = item.profit >= 0 ? '+' : '';
        
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #444';
        row.innerHTML = `
            <td style="padding: 8px;">${item.name}</td>
            <td style="padding: 8px; text-align: right;">${item.quantity}</td>
            <td style="padding: 8px; text-align: right;">${item.currentPrice.toLocaleString()}</td>
            <td style="padding: 8px; text-align: right;">${item.averageCost.toFixed(0)}</td>
            <td style="padding: 8px; text-align: right;">${item.totalCost.toLocaleString()}</td>
            <td style="padding: 8px; text-align: right;">${item.currentValue.toLocaleString()}</td>
            <td style="padding: 8px; text-align: right; color: ${profitColor};">${profitSign}${item.profit.toLocaleString()}</td>
            <td style="padding: 8px; text-align: right; color: ${profitColor};">${profitSign}${item.profitRate.toFixed(2)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// 按指定字段排序库存
function sortInventoryBy(field) {
    const stats = calculateInventoryStats();
    
    stats.items.sort((a, b) => {
        if (field === 'profitRate') {
            return b.profitRate - a.profitRate; // 降序排列
        } else if (field === 'name') {
            return a.name.localeCompare(b.name);
        } else if (field === 'quantity') {
            return b.quantity - a.quantity;
        } else if (field === 'profit') {
            return b.profit - a.profit;
        }
        return 0;
    });
    
    updateInventoryDetails(stats);
}
function addInventorySummaryButton() {
    const inventoryList = document.getElementById('playerInventory');
    if (!document.getElementById('inventorySummaryBtn')) {
        const summaryBtn = document.createElement('button');
        summaryBtn.id = 'inventorySummaryBtn';
        summaryBtn.textContent = '库存统计';
        summaryBtn.style.marginTop = '10px';
        summaryBtn.style.padding = '5px 15px';
        summaryBtn.onclick = showInventorySummary; // 改为显示弹窗
        inventoryList.parentNode.insertBefore(summaryBtn, inventoryList.nextSibling);
    }
}

// 保存自动贸易路线
function saveAutoTradeRoute() {
    const minProfitMargin = parseInt(document.getElementById('minProfitMargin').value);
    let tradeCapital = parseInt(document.getElementById('tradeCapital').value);
    const purchaseStrategy = document.getElementById('purchaseStrategy').value;
    const maxWarehouseUsage = parseInt(document.getElementById('maxWarehouseUsage').value) / 100;
    const priceTolerance = parseInt(document.getElementById('priceTolerance').value) / 100;

    // 校验单次资金，防止被设置为极端大数
    if (isNaN(tradeCapital) || tradeCapital <= 0) {
        logAction("请输入有效的单次资金（>0）", "error");
        return;
    }

    // 基于当前星币和全局上限，对单次资金做限制，避免离线收益被不合理放大
    const currentFunds = (player && player.nightClub && typeof player.nightClub.starCoins === 'number')
        ? player.nightClub.starCoins
        : 0;
    const HARD_CAP_TRADE_CAPITAL = 1e8; // 单次最大可配置资金上限：1亿（在星币上限约99亿的前提下）

    // 单次资金不能超过「当前星币的 80%」以及「硬上限1亿」
    tradeCapital = Math.min(tradeCapital, currentFunds * 0.8, HARD_CAP_TRADE_CAPITAL);

    if (tradeCapital <= 0) {
        logAction("当前星币不足，无法设置这么高的单次资金", "error");
        return;
    }
    
    // 获取灵活贸易设置
    const maxCityStayTime = parseInt(document.getElementById('maxCityStayTime').value) * 60 * 1000; // 转换为毫秒
    const explorationChance = parseInt(document.getElementById('explorationChance').value) / 100;
    const minProfitThreshold = parseInt(document.getElementById('minProfitThreshold').value);
    const priceMonitoring = document.getElementById('priceMonitoring').value === 'true';
    const maxInventoryValue = parseInt(document.getElementById('maxInventoryValue').value) || 0;
    
    // 获取采购策略设置（含最多商品种类）
    const maxGoods = Math.min(50, Math.max(1, parseInt(document.getElementById('maxGoods').value) || 50));
    
    // 获取选择的商品和对应的最大买入价
    const selectedGoods = [];
    const selectedCheckboxes = document.querySelectorAll('#goodsSelection input[type="checkbox"]:checked');
    
    if (selectedCheckboxes.length === 0) {
        logAction("请至少选择一种商品", "error");
        return;
    }
    
    selectedCheckboxes.forEach(checkbox => {
        const good = checkbox.value;
        const maxPrice = parseInt(document.getElementById(`maxPrice_${good}`).value);
        
        selectedGoods.push({
            good: good,
            maxBuyPrice: maxPrice
        });
    });
    
    // 保存采购策略设置
    player.trading.autoTrade.purchaseSettings.purchaseStrategy = purchaseStrategy;
    player.trading.autoTrade.purchaseSettings.maxWarehouseUsage = maxWarehouseUsage;
    player.trading.autoTrade.purchaseSettings.priceTolerance = priceTolerance;
    
    // 保存采购策略（最多商品种类）
    player.trading.autoTrade.purchaseSettings.maxGoods = maxGoods;
    
    // 保存灵活贸易设置
    player.trading.autoTrade.flexibleTrade.maxCityStayTime = maxCityStayTime;
    player.trading.autoTrade.flexibleTrade.explorationChance = explorationChance;
    player.trading.autoTrade.flexibleTrade.minProfitThreshold = minProfitThreshold;
    player.trading.autoTrade.flexibleTrade.priceMonitoring = priceMonitoring;
    player.trading.autoTrade.flexibleTrade.maxInventoryValue = maxInventoryValue;
    
    const route = {
        goods: selectedGoods,
        minProfitMargin: minProfitMargin,
        tradeCapital: tradeCapital
    };
    
    // 确保routes数组存在
    if (!player.trading.autoTrade.routes) {
        player.trading.autoTrade.routes = [];
    }
    
    player.trading.autoTrade.routes.push(route);
    logAction(`灵活贸易路线已保存，包含${selectedGoods.length}种商品，单次资金已按当前星币自动限制为 ${tradeCapital.toLocaleString()} 星币`, "success");
    
    // 如果自动贸易已启用，设置为当前路线
    if (player.trading.autoTrade.enabled) {
        player.trading.autoTrade.currentRoute = route;
        player.trading.autoTrade.currentState = 'idle';
        addAutoTradeLog("已切换到新保存的路线", "info");
    }
    
    // 更新界面
    updateAutoTradeTab();
}

// 货仓升级
function upgradeWarehouse() {
    const currentLevel = player.trading.warehouse.level;
    if (currentLevel >= tradingConfig.warehouseLevels.length) {
        logAction("货仓已达最高等级", "info");
        return;
    }
    
    const nextLevelConfig = tradingConfig.warehouseLevels[currentLevel];
    
    if (player.nightClub.starCoins < nextLevelConfig.cost) {
        logAction(`星币不足！升级需要${nextLevelConfig.cost.toLocaleString()}星币`, "error");
        return;
    }
    
    player.nightClub.starCoins -= nextLevelConfig.cost;
    player.trading.warehouse.level++;
    player.trading.warehouse.capacity = nextLevelConfig.capacity;
    
    logAction(`货仓升级到${player.trading.warehouse.level}级，容量增加到${nextLevelConfig.capacity}格`, "success");
    updateTradingUI();
    updateDisplay();
}
function buyTransport(transportName) {
    const transport = tradingConfig.transports.find(t => t.name === transportName);
    
    if (!transport) {
        logAction("无效的运输工具", "error");
        return;
    }
    
    if (!player.trading.ownedTransports) player.trading.ownedTransports = ['手推车'];
    const isOwned = player.trading.ownedTransports.indexOf(transportName) >= 0;
    
    if (isOwned) {
        // 已拥有：直接切换使用，不扣费
        player.trading.transport = {
            type: transport.name,
            capacityBonus: transport.capacityBonus,
            speedBonus: transport.speedBonus
        };
        logAction(`已切换为使用${transport.name}`, "success");
    } else {
        // 未拥有：需购买
        if (player.nightClub.starCoins < transport.cost) {
            logAction(`星币不足！购买需要${transport.cost.toLocaleString()}星币`, "error");
            return;
        }
        player.nightClub.starCoins -= transport.cost;
        player.trading.tradeVolumeToday -= transport.cost;
        player.trading.ownedTransports.push(transportName);
        player.trading.transport = {
            type: transport.name,
            capacityBonus: transport.capacityBonus,
            speedBonus: transport.speedBonus
        };
        logAction(`购买了${transport.name}，容量+${transport.capacityBonus}格，速度+${transport.speedBonus}%，已拥有可随时切换`, "success");
    }
    updateTradingUI();
    updateDisplay();
}

// 仅切换已拥有的运输工具（不扣费），供界面“切换”按钮调用
function switchTransport(transportName) {
    buyTransport(transportName);
}

// 雇佣雇员
function hireEmployee(employeeType) {
    const employee = tradingConfig.employees.find(e => e.type === employeeType);
    
    if (!employee) {
        logAction("无效的雇员类型", "error");
        return;
    }
    
    var rep = (player.trading.reputation != null) ? player.trading.reputation : 0;
    var ml = (player.trading.merchantLevel != null) ? player.trading.merchantLevel : 1;
    
    if (employee.requirement === 'warehouse30' && player.trading.warehouse.capacity < 30) {
        logAction("需要货仓容量达到30格才能雇佣此雇员", "error");
        return;
    }
    if (employee.requirement === 'warehouse40' && player.trading.warehouse.capacity < 40) {
        logAction("需要货仓容量达到40格才能雇佣此雇员", "error");
        return;
    }
    if (employee.requirement === 'warehouse50' && player.trading.warehouse.capacity < 50) {
        logAction("需要货仓容量达到50格才能雇佣此雇员", "error");
        return;
    }
    if (employee.requirement === 'reputation3' && ml < 3) {
        logAction("需要商人等级达到3级才能雇佣此雇员", "error");
        return;
    }
    if (employee.requirement === 'reputation5' && ml < 5) {
        logAction("需要商人等级达到5级才能雇佣此雇员", "error");
        return;
    }
    if (employee.requirement === 'reputation4' && ml < 4) {
        logAction("需要商人等级达到4级才能雇佣此雇员", "error");
        return;
    }
    if (employee.requirement === 'reputation6' && ml < 6) {
        logAction("需要商人等级达到6级才能雇佣此雇员", "error");
        return;
    }
    if (employee.requirement === 'experiencedRobbery' && !player.trading.hasExperiencedRobbery) {
        logAction("需要经历过强盗事件才能雇佣此雇员", "error");
        return;
    }
    
    if (player.nightClub.starCoins < employee.cost) {
        logAction(`星币不足！雇佣需要${employee.cost.toLocaleString()}星币`, "error");
        return;
    }
    if (player.trading.employees.some(e => e.type === employeeType)) {
        logAction("已经雇佣了此类型的雇员", "error");
        return;
    }
    
    player.nightClub.starCoins -= employee.cost;
    player.trading.tradeVolumeToday -= employee.cost;
    
    var empObj = {
        type: employee.type,
        efficiencyBonus: employee.efficiencyBonus || 0,
        intelligenceDiscount: employee.intelligenceDiscount || 0,
        robberyReduction: employee.robberyReduction || 0,
        sellBonus: employee.sellBonus || 0,
        travelSpeedBonus: employee.travelSpeedBonus || 0,
        spoilReduction: employee.spoilReduction || 0,
        rumorBonus: employee.rumorBonus || 0,
        negativeEventReduction: employee.negativeEventReduction || 0,
        travelEventLuck: employee.travelEventLuck || 0,
        salary: employee.salary
    };
    player.trading.employees.push(empObj);
    
    if (employee.efficiencyBonus) {
        player.trading.autoTrade.efficiency += employee.efficiencyBonus / 100;
    }
    
    logAction(`雇佣了${employee.type}，每日工资${employee.salary}星币`, "success");
    updateTradingUI();
    updateDisplay();
}

// 雇员效果汇总：卖价加成（百分比）
function getEmployeeSellBonus() {
    var sum = 0;
    if (player.trading.employees && player.trading.employees.length > 0) {
        player.trading.employees.forEach(function(emp) { if (emp.sellBonus) sum += emp.sellBonus; });
    }
    return Math.min(50, sum);
}
// 雇员效果：旅行时间减免（百分比）
function getEmployeeTravelSpeedBonus() {
    var sum = 0;
    if (player.trading.employees && player.trading.employees.length > 0) {
        player.trading.employees.forEach(function(emp) { if (emp.travelSpeedBonus) sum += emp.travelSpeedBonus; });
    }
    return Math.min(25, sum);
}
// 雇员效果：腐败概率减免（百分比）
function getEmployeeSpoilReduction() {
    var sum = 0;
    if (player.trading.employees && player.trading.employees.length > 0) {
        player.trading.employees.forEach(function(emp) { if (emp.spoilReduction) sum += emp.spoilReduction; });
    }
    return Math.min(80, sum);
}
// 雇员效果：传闻涨价倍率加成（如 20 表示在基础 15% 上再乘 (1+20%)=1.2，即 18%）
function getEmployeeRumorBonusMultiplier() {
    var sum = 0;
    if (player.trading.employees && player.trading.employees.length > 0) {
        player.trading.employees.forEach(function(emp) { if (emp.rumorBonus) sum += emp.rumorBonus; });
    }
    return 1 + Math.min(50, sum) / 100;
}

function getEmployeeNegativeEventReduction() {
    var sum = 0;
    if (player && player.trading && player.trading.employees && player.trading.employees.length > 0) {
        player.trading.employees.forEach(function(emp) { if (emp.negativeEventReduction) sum += emp.negativeEventReduction; });
    }
    return Math.min(45, sum);
}

function getEmployeeTravelEventLuck() {
    var sum = 0;
    if (player && player.trading && player.trading.employees && player.trading.employees.length > 0) {
        player.trading.employees.forEach(function(emp) { if (emp.travelEventLuck) sum += emp.travelEventLuck; });
    }
    return Math.min(25, sum);
}

function getTradingCalendarDayStr() {
    return new Date(typeof tradingNow === 'function' ? tradingNow() : Date.now()).toDateString();
}

function ensureTradingWorldPulse() {
    if (!player || !player.trading || typeof tradingConfig === 'undefined' || !tradingConfig.cities) return;
    var now = typeof tradingNow === 'function' ? tradingNow() : Date.now();
    if (player.trading.sellDebuff && player.trading.sellDebuff.endTime && now > player.trading.sellDebuff.endTime) player.trading.sellDebuff = null;
    if (player.trading.globalSellMultEnd && now > player.trading.globalSellMultEnd) { player.trading.globalSellMult = null; player.trading.globalSellMultEnd = 0; }
    if (player.trading.globalBuyMultEnd && now > player.trading.globalBuyMultEnd) { player.trading.globalBuyMult = null; player.trading.globalBuyMultEnd = 0; }
    var rp = player.trading.regionPulse;
    if (rp && rp.endTime && now > rp.endTime) player.trading.regionPulse = null;
    var dk = getTradingCalendarDayStr();
    if (player.trading.worldPulseDayStr === dk) return;
    player.trading.worldPulseDayStr = dk;
    var goods = Object.keys(tradingConfig.goods || {});
    if (goods.length) {
        var hot = goods[Math.floor(Math.random() * goods.length)];
        player.trading.hotDeal = { good: hot, sellMult: 1.07 + Math.random() * 0.1 };
    } else player.trading.hotDeal = null;
    player.trading.regionPulse = null;
    if (Math.random() < 0.68) {
        var regMap = {};
        Object.keys(tradingConfig.cities).forEach(function(c) {
            var reg = tradingConfig.cities[c].region;
            if (reg) regMap[reg] = true;
        });
        var regs = Object.keys(regMap);
        if (regs.length) {
            var reg = regs[Math.floor(Math.random() * regs.length)];
            var boom = Math.random() < 0.52;
            player.trading.regionPulse = {
                region: reg,
                kind: boom ? 'boom' : 'slump',
                buyMult: boom ? 0.95 : 1.09,
                sellMult: boom ? 1.11 : 0.87,
                endTime: now + 8 * 3600000
            };
        }
    }
}

function addTradingTreasureShard(n) {
    if (!player || !player.trading) return;
    var add = n != null ? n : 1;
    player.trading.treasureShards = Math.min(99, (player.trading.treasureShards || 0) + add);
    while (player.trading.treasureShards >= 5) {
        player.trading.treasureShards -= 5;
        var coin = 62000 + Math.floor(Math.random() * 88001);
        var rep = 28 + Math.floor(Math.random() * 35);
        if (player.nightClub && player.nightClub.starCoins != null) player.nightClub.starCoins += coin;
        player.trading.reputation = (player.trading.reputation || 0) + rep;
        if (typeof updateMerchantLevelFromReputation === 'function') updateMerchantLevelFromReputation();
        if (typeof logAction === 'function') logAction('商路秘宝：集齐5片碎片！商会回购 +' + coin.toLocaleString() + ' 星币，声望 +' + rep, 'success');
    }
}

function onTradingArrival(opts) {
    opts = opts || {};
    var isAuto = !!opts.isAuto;
    var skipRandom = !!opts.skipRandomEvents;
    if (!player || !player.trading) return;
    if (typeof ensureTradingWorldPulse === 'function') ensureTradingWorldPulse();
    var inBulkSim = player.trading._simulatedNow != null;
    if (!inBulkSim) {
        player.trading.merchantMiles = (player.trading.merchantMiles || 0) + 1;
        var mm = player.trading.merchantMiles;
        if (mm > 0 && mm % 10 === 0 && player.nightClub) {
            var bonus = 4000 + Math.floor(Math.random() * 14001);
            var repB = 5 + Math.floor(Math.random() * 16);
            player.nightClub.starCoins += bonus;
            player.trading.reputation = (player.trading.reputation || 0) + repB;
            if (typeof updateMerchantLevelFromReputation === 'function') updateMerchantLevelFromReputation();
            if (typeof logAction === 'function') logAction('商路里程达成×' + mm + '：里程奖 +' + bonus.toLocaleString() + ' 星币，声望 +' + repB, 'success');
        }
    }
    if (!skipRandom && !inBulkSim) {
        if (isAuto) {
            if (Math.random() < 0.42) triggerRandomEvent();
        } else {
            triggerRandomEvent();
        }
    }
}


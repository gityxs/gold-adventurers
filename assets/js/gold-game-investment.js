// 模拟投资
function toggleInvestmentGame() {
    if (player.battle.maxStage < 2) {
        alert("需要打怪模式达到第3层才能开启模拟投资！");
        return;
    }
    const ui = document.getElementById('investmentGameUI');
    if (!ui) return;
    if (ui.style.display === 'none') {
        try {
            // 初始化游戏数据
            initInvestmentGame();
            // 若 50 只股票全是 basePrice 10（旧档或默认模板），改为 5/8/12/18/25 分档，避免“全市场同一抄底价”
            migrateInvestmentStocksToVariedBases();
            // 检查价格合理性
            validateStockPrices();
            sanitizeAllInvestmentHoldings(player.investmentGame);
            // 模拟离线期间的价格变化
            simulateOfflinePriceChanges();
            // 生成游戏界面
            renderInvestmentGame();
            // 开始价格模拟
            startPriceSimulation();
            ui.style.display = 'block';
        } catch (e) {
            console.error('打开模拟投资异常:', e);
            alert('打开模拟投资时出错: ' + (e && e.message ? e.message : String(e)));
        }
    } else {
        closeInvestmentGame();
    }
}
function simulateOfflinePriceChanges() {
    if (!player.investmentGame || !player.investmentGame.userData) {
        return;
    }
    
    const game = player.investmentGame;
    const now = Date.now();
    
    // 使用单独的离线计时器
    if (!game.offlineData) {
        game.offlineData = {
            lastOfflineUpdate: now
        };
    }
    
    const lastOfflineUpdate = game.offlineData.lastOfflineUpdate || now;
    const timeDiff = now - lastOfflineUpdate;
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    if (minutesDiff > 0) {
        console.log(`检测到离线 ${minutesDiff} 分钟，模拟价格变化`);
        
        // 初始化价格边界
        game.stocks.forEach(stock => {
            if (!stock.priceBounds) {
                const basePrice = stock.basePrice || 10;
                stock.priceBounds = {
                    min: 0.1,
                    max: 200,
                    support: Math.max(0.5, basePrice * 0.5),
                    resistance: Math.min(150, basePrice * 1.5)
                };
            }
        });
        
        // 每分钟模拟一次价格变化（新号/异常存档需先保证 price、params、bounds 有效，避免 NaN）
        for (let i = 0; i < Math.min(minutesDiff, 1440); i++) { // 最多模拟24小时
            game.stocks.forEach((stock, index) => {
                const basePrice = Math.max(0.0001, Number(stock.basePrice) || Number(stock.price) || 10);
                if (!Number.isFinite(stock.price) || stock.price <= 0) stock.price = roundInvestmentPrice(basePrice);
                const bounds = stock.priceBounds || { min: Math.max(0.01, basePrice * 0.2), max: Math.max(basePrice * 4, basePrice + 10), support: basePrice * 0.5, resistance: basePrice * 1.5 };
                const safeMin = Math.max(0.0001, bounds.min);
                const safeMax = Math.max(safeMin * 2, bounds.max || (basePrice * 4));
                if (!stock.randomParams) {
                    stock.randomParams = {
                        baseVolatility: 0.005 + Math.random() * 0.025,
                        trendStrength: (Math.random() - 0.5) * 0.002,
                        meanReversion: 0.2 + Math.random() * 0.3,
                        lastChange: 0
                    };
                }
                const params = stock.randomParams;
                const vol = typeof params.baseVolatility === 'number' ? params.baseVolatility : (0.005 + Math.random() * 0.025);
                const trend = typeof params.trendStrength === 'number' ? params.trendStrength : ((Math.random() - 0.5) * 0.002);
                const meanRev = typeof params.meanReversion === 'number' ? params.meanReversion : (0.2 + Math.random() * 0.3);
                const currentPrice = Number(stock.price);
                
                const normalRand = (Math.random() + Math.random() + Math.random() - 1.5) * 2;
                let priceChange = normalRand * vol;
                priceChange += trend;
                const deviation = basePrice > 0 ? (currentPrice - basePrice) / basePrice : 0;
                priceChange += -deviation * meanRev * 0.004;
                const distanceToMin = safeMin > 0 ? (currentPrice - safeMin) / safeMin : 0;
                if (distanceToMin < 0.5 && priceChange < 0) priceChange *= (1 - (0.5 - distanceToMin));
                if (!Number.isFinite(priceChange)) priceChange = 0;
                
                let newPrice = currentPrice * (1 + priceChange);
                if (newPrice < safeMin) {
                    if (Math.random() < 0.6) newPrice = currentPrice * (1 + Math.abs(priceChange) * 0.5);
                    else newPrice = Math.max(safeMin * 0.8, newPrice);
                }
                if (newPrice > safeMax) {
                    if (Math.random() < 0.6) newPrice = currentPrice * (1 - Math.abs(priceChange) * 0.5);
                    else newPrice = Math.min(safeMax * 1.2, newPrice);
                }
                
                stock.price = roundInvestmentPrice((Number.isFinite(newPrice) && newPrice > 0) ? newPrice : currentPrice);
                stock.change = safeChangePercent(stock.price, basePrice);
                
                // 记录历史（只存2位小数）
                params.lastChange = priceChange;
        stock.priceHistory = stock.priceHistory || [];
    stock.priceHistory.push(roundInvestmentPrice(stock.price));
    if (stock.priceHistory.length > 50) {
        stock.priceHistory.shift();
    }
    
    // 同时记录到randomParams中
    if (stock.randomParams) {
        stock.randomParams.priceHistory = stock.randomParams.priceHistory || [];
        stock.randomParams.priceHistory.push(roundInvestmentPrice(stock.price));
        if (stock.randomParams.priceHistory.length > 100) {
            stock.randomParams.priceHistory.shift();
        }
    }
    
    // 清除缓存
    if (stock._changeCache) {
        delete stock._changeCache;
    }
            });
        }
        
        // 更新离线计时器
        game.offlineData.lastOfflineUpdate = now;
        
        // 更新总资产
        updateInvestmentTotalAssets();

        logAction(`离线期间模拟了 ${Math.min(minutesDiff, 1440)} 分钟的价格变化`, 'info');
    }
}
function initPriceHistory() {
    const game = player.investmentGame;
    if (!game) return;
    
    game.stocks.forEach(stock => {
        const basePrice = Math.max(0.0001, Number(stock.basePrice) || Number(stock.price) || 10);
        if (!Number.isFinite(stock.price) || stock.price <= 0) stock.price = roundInvestmentPrice(basePrice);
        // 如果价格历史为空，填充一些初始数据
        if (!stock.priceHistory || stock.priceHistory.length === 0) {
            stock.priceHistory = [roundInvestmentPrice(stock.price)];
            
            // 生成一些模拟历史数据
            let currentPrice = Number(stock.price);
            for (let i = 0; i < 20; i++) {
                const change = (Math.random() - 0.5) * 0.1;
                currentPrice = Math.max(0.1, currentPrice * (1 + change));
                stock.priceHistory.unshift(currentPrice);
            }
            
            // 确保历史数据不超过50个
            if (stock.priceHistory.length > 50) {
                stock.priceHistory = stock.priceHistory.slice(-50);
            }
        }
        
        // 确保randomParams中也有价格历史
        if (!stock.randomParams) {
            stock.randomParams = {};
        }
        if (!stock.randomParams.priceHistory) {
            stock.randomParams.priceHistory = [...stock.priceHistory];
        }
    });
}
function closeInvestmentGame() {
    const ui = document.getElementById('investmentGameUI');
    ui.style.display = 'none';
    
    // 清理定时器（须 unregister，避免 _gameIntervals 僵尸条目）
    const game = player.investmentGame;
    if (game.priceUpdateTimer) {
        if (typeof unregisterInterval === 'function') unregisterInterval(game.priceUpdateTimer);
        else clearInterval(game.priceUpdateTimer);
        game.priceUpdateTimer = null;
    }
    if (game.chartUpdateTimer) {
        if (typeof unregisterInterval === 'function') unregisterInterval(game.chartUpdateTimer);
        else clearInterval(game.chartUpdateTimer);
        game.chartUpdateTimer = null;
    }
    
    // 保存游戏数据
    saveGame();
}

// 渲染模拟投资游戏界面
function renderInvestmentGame() {
    const content = document.getElementById('investmentGameContent');
    const game = player.investmentGame;
    if (game && game.userData) updateInvestmentTotalAssets(); // 渲染前先按当前股价重算总资产，避免显示 NaN
    
    content.innerHTML = `
        <style>
            .investment-game * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
            }
            
            .investment-game {
                background-color: #f5f7fa;
                color: #333;
                line-height: 1.6;
                padding: 20px;
                max-width: 1200px;
                margin: 0 auto;
            }
            .investment-game .profit-up {
    color: #10b981;
    font-weight: 600;
}

.investment-game .profit-up:after {
    content: ""; /* 移除默认的箭头 */
}

.investment-game .profit-down {
    color: #ef4444;
    font-weight: 600;
}

.investment-game .profit-down:after {
    content: ""; /* 移除默认的箭头 */
}
.investment-game .clickable {
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.investment-game .clickable:hover {
    background-color: #f0f7ff !important;
}

.investment-game .holding-item:hover {
    background-color: #f8fafc !important;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.investment-game .holding-item.selected {
    background-color: #eff6ff !important;
    border-left: 3px solid #3b82f6;
}
            .investment-game .header {
                text-align: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e0e6ef;
                position: relative;
            }
            
            .investment-game h1 {
                color: #2c3e50;
                font-size: 2.2rem;
                margin-bottom: 8px;
            }
            
            .investment-game .subtitle {
                color: #7f8c8d;
                font-size: 1rem;
            }
            
            .investment-game .tabs {
                display: flex;
                background: white;
                border-radius: 12px 12px 0 0;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                margin-bottom: 0;
            }
            
            .investment-game .tab {
                flex: 1;
                padding: 18px 5px;
                text-align: center;
                cursor: pointer;
                background: #f8f9fa;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
                font-weight: 600;
                color: #6c757d;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
            }
            
            .investment-game .tab i {
                font-size: 1.2rem;
            }
            
            .investment-game .tab.active {
                background: white;
                color: #4361ee;
                border-bottom: 3px solid #4361ee;
            }
            
            .investment-game .tab-content {
                display: none;
                background: white;
                padding: 25px;
                border-radius: 0 0 12px 12px;
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
                min-height: 550px;
            }
            
            .investment-game .tab-content.active {
                display: block;
            }
            
            .investment-game .stock-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eaeaea;
            }
            
            .investment-game .stock-name {
                font-size: 1.8rem;
                font-weight: 700;
                color: #2c3e50;
            }
            
            .investment-game .stock-price {
                font-size: 2.5rem;
                font-weight: 800;
                color: #10b981;
            }
            
            .investment-game .stock-price.down {
                color: #ef4444;
            }
            
            .investment-game .holdings-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 25px;
                background: #f8fafc;
                padding: 20px;
                border-radius: 10px;
            }
            
            .investment-game .info-item {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px dashed #e2e8f0;
            }
            
            .investment-game .info-item:last-child {
                border-bottom: none;
            }
            
            .investment-game .info-label {
                color: #64748b;
                font-weight: 500;
            }
            
            .investment-game .info-value {
                font-weight: 600;
                color: #334155;
            }
            
            .investment-game .transaction-section {
                margin-top: 30px;
            }
            
            .investment-game .transaction-title {
                font-size: 1.3rem;
                margin-bottom: 20px;
                color: #2c3e50;
                padding-bottom: 10px;
                border-bottom: 2px solid #e0e6ef;
            }
            
            .investment-game .transaction-form {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 25px;
            }
            
            .investment-game .form-group {
                margin-bottom: 20px;
            }
            
            .investment-game .form-label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #475569;
            }
            
            .investment-game .input-group {
                display: flex;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .investment-game .input-group input {
                flex: 1;
                border: none;
                padding: 12px 15px;
                font-size: 1rem;
                outline: none;
            }
            
            .investment-game .input-group .unit {
                background: #f1f5f9;
                padding: 12px 15px;
                color: #475569;
                font-weight: 500;
            }
            
            .investment-game .quantity-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
            }
            
            .investment-game .qty-btn {
                flex: 1;
                min-width: calc(20% - 8px);
                padding: 10px 5px;
                background: #f1f5f9;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
                text-align: center;
            }
            
            .investment-game .qty-btn:hover {
                background: #e2e8f0;
            }
            
            .investment-game .qty-btn.highlight {
                background: #3b82f6;
                color: white;
                border-color: #3b82f6;
            }
            
            .investment-game .transaction-type {
                display: flex;
                gap: 15px;
                margin-top: 10px;
            }
            
            .investment-game .type-option {
                flex: 1;
                text-align: center;
                padding: 12px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
                touch-action: manipulation;
                user-select: none;
                -webkit-user-select: none;
            }
            
            .investment-game .type-option.active {
                border-color: #3b82f6;
                background: #eff6ff;
                color: #3b82f6;
            }
            
            .investment-game .type-buy.active {
                border-color: #10b981;
                background: #d1fae5;
                color: #10b981;
            }
            
            .investment-game .type-sell.active {
                border-color: #ef4444;
                background: #fee2e2;
                color: #ef4444;
            }
            
            .investment-game .fee-info {
                background: #fef3c7;
                padding: 12px 15px;
                border-radius: 8px;
                margin: 20px 0;
                color: #92400e;
                font-size: 0.95rem;
            }
            
            .investment-game .chart-container {
                margin-top: 30px;
                border-top: 1px solid #eaeaea;
                padding-top: 25px;
            }
            
            .investment-game .chart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .investment-game .chart-title {
                font-size: 1.3rem;
                font-weight: 600;
                color: #2c3e50;
            }
            
            .investment-game .time-filters {
                display: flex;
                gap: 10px;
            }
            
            .investment-game .time-filter {
                padding: 8px 15px;
                background: #f1f5f9;
                border-radius: 20px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .investment-game .time-filter.active {
                background: #3b82f6;
                color: white;
            }
            
            .investment-game .chart-placeholder {
                height: 250px;
                background: #f8fafc;
                border-radius: 10px;
                position: relative;
                overflow: hidden;
                border: 1px solid #e2e8f0;
            }
            
            .investment-game .submit-section {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid #eaeaea;
            }
            
            .investment-game .trade-count {
                color: #6b7280;
                font-size: 0.95rem;
            }
            
            .investment-game .trade-count span {
                color: #3b82f6;
                font-weight: 600;
            }
            
            .investment-game .btn-submit {
                padding: 14px 40px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .investment-game .btn-submit:hover {
                background: #2563eb;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(37, 99, 235, 0.2);
            }
            
            .investment-game .assets-header {
                background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
                color: white;
                padding: 25px;
                border-radius: 12px;
                margin-bottom: 25px;
            }
            
            .investment-game .assets-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
            }
            
            .investment-game .stat-item {
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 10px;
                backdrop-filter: blur(10px);
            }
            
            .investment-game .stat-label {
                font-size: 0.9rem;
                opacity: 0.9;
                margin-bottom: 8px;
            }
            
            .investment-game .stat-value {
                font-size: 1.8rem;
                font-weight: 700;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .investment-game .holdings-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                border-radius: 10px;
                overflow: hidden;
            }
            
            .investment-game .holdings-table th {
                background: #f8fafc;
                padding: 18px 15px;
                text-align: left;
                color: #475569;
                font-weight: 600;
                border-bottom: 2px solid #e2e8f0;
            }
            
            .investment-game .holdings-table td {
                padding: 18px 15px;
                border-bottom: 1px solid #f1f5f9;
            }
            
            .investment-game .holdings-table tr:hover {
                background: #f8fafc;
            }
            
            .investment-game .stock-code {
                font-weight: 600;
                color: #334155;
            }
            
            .investment-game .profit-up {
                color: #10b981;
                font-weight: 600;
            }
            
            .investment-game .profit-up:after {
                content: " ↑";
            }
            
            .investment-game .profit-down {
                color: #ef4444;
                font-weight: 600;
            }
            
            .investment-game .profit-down:after {
                content: " ↓";
            }
            
            .investment-game .holding-percent {
                color: #3b82f6;
                font-weight: 600;
            }
            
            .investment-game .stocks-table-container {
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                border: 1px solid #e2e8f0;
            }
            
            .investment-game .stocks-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .investment-game .stocks-table th {
                background: #f1f5f9;
                padding: 18px 15px;
                text-align: left;
                color: #475569;
                font-weight: 600;
            }
            
            .investment-game .stocks-table td {
                padding: 18px 15px;
                border-bottom: 1px solid #f1f5f9;
            }
            
            .investment-game .stocks-table tr:last-child td {
                border-bottom: none;
            }
            
            .investment-game .stock-item {
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .investment-game .stock-item:hover {
                background: #f8fafc;
            }
            
            .investment-game .stock-item.selected {
                background: #eff6ff;
            }
            
            .investment-game .footer-nav {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eaeaea;
            }
            
            .investment-game .nav-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #6b7280;
                text-decoration: none;
                transition: all 0.3s;
                padding: 10px 20px;
                border-radius: 10px;
            }
            
            .investment-game .nav-btn i {
                font-size: 1.5rem;
                margin-bottom: 8px;
            }
            
            .investment-game .nav-btn.active {
                color: #3b82f6;
                background: #eff6ff;
            }
         .investment-game .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                color: white;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                display: none;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            }
            
            .investment-game .notification.success {
                background: #10b981;
            }
            
            .investment-game .notification.error {
                background: #ef4444;
            }
            
            .investment-game .notification.info {
                background: #3b82f6;
            }
            
            @keyframes slideIn {
                from {transform: translateX(100%); opacity: 0;}
                to {transform: translateX(0); opacity: 1;}
            }
            
            .investment-game .no-holding {
                text-align: center;
                padding: 40px 20px;
                color: #6b7280;
            }
            
            .investment-game .no-holding i {
                font-size: 3rem;
                margin-bottom: 15px;
                color: #cbd5e1;
            }
            
            @media (max-width: 768px) {
                .investment-game .transaction-form {
                    grid-template-columns: 1fr;
                }
                
                .investment-game .holdings-info {
                    grid-template-columns: 1fr;
                }
                
                .investment-game .assets-stats {
                    grid-template-columns: 1fr;
                }
                
                .investment-game .quantity-buttons {
                    justify-content: center;
                }
                
                .investment-game .qty-btn {
                    min-width: calc(33% - 8px);
                }
            }
        </style>
        
        <div class="investment-game">
            <div class="header">
                <h1>模拟投资交易游戏</h1>
                <p class="subtitle">虚拟交易 | 离线模拟 | 刺激体验</p>
            </div>
            
            <!-- 标签页导航 -->
            <div class="tabs">
                <div class="tab active" data-tab="trade">
                    <i class="fas fa-chart-line"></i>
                    <span>股票交易</span>
                </div>
                <div class="tab" data-tab="assets">
                    <i class="fas fa-chart-pie"></i>
                    <span>资产详情</span>
                </div>
                <div class="tab" data-tab="stocks">
                    <i class="fas fa-list"></i>
                    <span>股票列表</span>
                </div>
            </div>
            
            <!-- 股票交易界面 -->
            <div id="trade" class="tab-content active">
                <div class="stock-header">
                    <div>
                        <div class="stock-name" id="current-stock-name">${game.stocks[game.currentStockIndex].name}</div>
                        <div class="stock-update" id="update-time">股价上次更新时间：${new Date().toLocaleString()}</div>
                    </div>
                    <div class="stock-price" id="current-price">${(function(){ var p = game.stocks[game.currentStockIndex].price; return Number.isFinite(Number(p)) ? Number(p).toFixed(3) : '0.000'; })()}</div>
                </div>
                
                <div class="holdings-info">
                    <div>
                        <div class="info-item">
                            <span class="info-label">当前持有数量：</span>
                            <span class="info-value" id="hold-amount">${formatInvestmentNumber(game.stocks[game.currentStockIndex].holdings || 0, 'shares')}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">成本价格：</span>
                            <span class="info-value" id="cost-price">${(function(){ var c = game.stocks[game.currentStockIndex].costPrice; return c > 0 && Number.isFinite(Number(c)) ? Number(c).toFixed(3) : "0.000"; })()}</span>
                        </div>
                    </div>
                    <div>
                        <div class="info-item">
                            <span class="info-label">持仓市值：</span>
                            <span class="info-value" id="hold-value">${formatInvestmentNumber(mulBigSciValues(game.stocks[game.currentStockIndex].holdings || 0, Number.isFinite(Number(game.stocks[game.currentStockIndex].price)) ? Number(game.stocks[game.currentStockIndex].price) : 10))}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">持仓盈亏：</span>
                            <span class="info-value" id="hold-profit">${calculateStockProfit(game.stocks[game.currentStockIndex])}</span>
                        </div>
                    </div>
                </div>
                
                <div class="transaction-section">
                    <h3 class="transaction-title">股票交易</h3>
                    
                    <div class="transaction-form">
                        <div>
                            <div class="form-group">
                                <label class="form-label">交易数量：</label>
                                <div class="input-group">
                                    <input type="text" id="trade-quantity" value="0" placeholder="0 或 1e22">
                                    <div class="unit">股</div>
                                </div>
                                
                                <div class="quantity-buttons">
                                    <div class="qty-btn" data-action="clear">清零</div>
                                    <div class="qty-btn" data-action="1">+1</div>
                                    <div class="qty-btn" data-action="10">+10</div>
                                    <div class="qty-btn" data-action="100">+100</div>
                                    <div class="qty-btn" data-action="max">最大</div>
                                    <div class="qty-btn" data-action="quarter">1/4仓</div>
                                    <div class="qty-btn" data-action="half">半仓</div>
                                    <div class="qty-btn" data-action="third">1/3仓</div>
                                    <div class="qty-btn" data-action="-1">-1</div>
                                    <div class="qty-btn" data-action="-10">-10</div>
                                    <div class="qty-btn" data-action="-100">-100</div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">交易类型：</label>
                                <div class="transaction-type">
                                    <div class="type-option type-buy" data-type="buy">买入</div>
                                    <div class="type-option type-sell" data-type="sell">卖出</div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="form-group">
                                <label class="form-label">成交额（不含手续费）：</label>
                                <div class="input-group">
                                    <input type="text" id="trade-amount" value="0.00" readonly>
                                    <div class="unit">元</div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">交易手续费：</label>
                                <div class="input-group">
                                    <input type="text" id="trade-fee" value="0.00" readonly>
                                    <div class="unit">元</div>
                                </div>
                            </div>
                            
                            <div class="fee-info" id="trade-fee-info">
                                手续费率为成交额的 0.48%。<span id="trade-fee-summary"></span>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">最大可交易数量：</label>
                                <div class="input-group">
                                    <input type="text" id="max-quantity" value="0" readonly>
                                    <div class="unit">股</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
<div class="chart-container">
    <div class="chart-header">
        <div>
            <div class="chart-title">
                <i class="fas fa-chart-line"></i>
                价格走势图
            </div>
            <div class="price-range-info">
                <div class="price-range-item">
                    <span class="price-range-label">最高：</span>
                    <span class="price-range-value" id="chart-max-price">--</span>
                </div>
                <div class="price-range-item">
                    <span class="price-range-label">最低：</span>
                    <span class="price-range-value" id="chart-min-price">--</span>
                </div>
                <div class="price-range-item">
                    <span class="price-range-label">波动：</span>
                    <span class="price-range-value" id="chart-range">--</span>
                </div>
            </div>
        </div>
        <div class="time-filters">
            <div class="time-filter" id="refresh-chart-btn" title="刷新图表">
                <i class="fas fa-redo">点击刷新图表</i>
            </div>
        </div>
    </div>
    
    <div class="chart-placeholder" id="price-chart">
        <!-- 图表将通过JS动态生成 -->
    </div>
</div>
                    
                    <div class="submit-section">
                        <div class="trade-count">可用交易次数：<span id="trade-count">${game.userData.tradeCount}</span> 
                            <a href="#" id="add-trade-count" style="color: #3b82f6; text-decoration: none;">点我增加</a>
                        </div>
                        <button class="btn-submit" id="submit-trade">提交交易</button>
                    </div>
                </div>
            </div>
            
            <!-- 资产详情界面 -->
<div id="assets" class="tab-content">
    <div class="assets-header">
        <h2 style="margin-bottom: 20px;">资产详情</h2>
        <div class="assets-stats">
            <div class="stat-item">
                <div class="stat-label">可用资金</div>
                <div class="stat-value" id="available-funds">${formatInvestmentNumber(game.userData.availableFunds)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">总资产</div>
                <div class="stat-value" id="total-assets">${formatInvestmentNumber(game.userData.totalAssets)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">总持仓价值</div>
                <div class="stat-value" id="total-hold-value">${formatInvestmentNumber(calculateTotalHoldingsValue())}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">总持仓占比</div>
                <div class="stat-value" id="total-holding-percent">${(Number.isFinite(Number(game.userData.holdingPercent)) ? Number(game.userData.holdingPercent) : 0).toFixed(3)}%</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">总盈亏金额</div>
                <div class="stat-value" id="total-profit-amount">${formatInvestmentNumber(calculateTotalProfitAmount())}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">总盈亏比例</div>
                <div class="stat-value" id="total-profit-percent">${calculateTotalProfitPercent()}%</div>
            </div>
        </div>
    </div>
    
    <h3 style="margin-bottom: 15px; color: #2c3e50;">持仓详情 <span style="font-size: 0.8rem; color: #6b7280; font-weight: normal;">（点击任意持仓股票可快速切换到交易页面）</span></h3>
    
    <table class="holdings-table" id="holdings-table">
        <thead>
            <tr>
                <th>股票代码</th>
                <th>股票名称</th>
                <th>持股数量</th>
                <th>当前价格</th>
                <th>成本价格</th>
                <th>总市值</th>
                <th>盈亏金额</th>
                <th>盈亏比例</th>
                <th>持仓占比</th>
            </tr>
        </thead>
        <tbody id="holdings-body">
            ${generateHoldingsTable()}
        </tbody>
    </table>
    
    <div id="no-holdings" class="no-holding" style="${hasHoldings() ? 'display: none;' : ''}">
        <i class="fas fa-chart-line"></i>
        <h3>暂无持仓</h3>
        <p>您还没有持有任何股票，快去交易页面买入股票吧！</p>
    </div>
</div>
            
            <!-- 股票列表界面 -->
            <div id="stocks" class="tab-content">
                <h2 style="font-size: 1.8rem; margin-bottom: 25px; color: #2c3e50; text-align: center;">股票列表</h2>
                
                <div class="stocks-table-container">
                    <table class="stocks-table">
                        <thead>
                            <tr>
                                <th>股票代码</th>
                                <th>股票名称</th>
                                <th>当前价格</th>
                                <th>涨跌幅</th>
                            </tr>
                        </thead>
                        <tbody id="stocks-list">
                            ${generateStocksList()}
                        </tbody>
                    </table>
                </div>
                
                <div class="footer-nav">
                    <a href="#" class="nav-btn" data-nav="trade">
                        <i class="fas fa-chart-line"></i>
                        <span>股票交易</span>
                    </a>
                    <a href="#" class="nav-btn" data-nav="assets">
                        <i class="fas fa-chart-pie"></i>
                        <span>资产详情</span>
                    </a>
                </div>
            </div>
            
            <!-- 交易成功提示 -->
            <div class="notification" id="investment-notification"></div>
        </div>
    `;
    
    // 初始化事件监听
    initInvestmentEventListeners();
    syncInvestmentTradeTypeUI();
    // 初始化价格图表
    initInvestmentChart();
    // 更新交易信息
    updateInvestmentTradeInfo();
}

// 计算单只股票的盈亏（持仓可能为大数字符串/BigSci，不可用普通乘法）
function calculateStockProfit(stock) {
    const safe = (v, d) => (v != null && Number.isFinite(Number(v)) ? Number(v) : (d || 0));
    const price = safe(stock.price, 10);
    const costPrice = safe(stock.costPrice, 0);
    const holdings = stock.holdings || 0;
    if (costPrice <= 0 || cmpBigSci(holdings, 0) <= 0) return "0.000 (0.000%)";
    const profit = mulBigSciValues(holdings, price - costPrice);
    const profitPercent = safeChangePercent(price, costPrice);
    const sign = cmpBigSci(profit, 0) >= 0 ? '+' : '';
    return `${sign}${formatInvestmentNumber(profit)} (${profitPercent >= 0 ? '+' : ''}${(Number.isFinite(profitPercent) ? profitPercent : 0).toFixed(3)}%)`;
}

// 计算总持仓价值
function calculateTotalHoldingsValue() {
    const game = player.investmentGame;
    if (!game) return 0;
    return game.stocks.reduce((sum, stock) => {
        const price = Number.isFinite(Number(stock.price)) ? Number(stock.price) : 10;
        return addBigSci(sum, mulBigSciValues(stock.holdings || 0, price));
    }, 0);
}
function calculateTotalProfitAmount() {
    const game = player.investmentGame;
    if (!game) return 0;
    return game.stocks.reduce((sum, stock) => {
        const costPrice = Number.isFinite(Number(stock.costPrice)) ? Number(stock.costPrice) : 0;
        const price = Number.isFinite(Number(stock.price)) ? Number(stock.price) : 10;
        if (costPrice <= 0) return sum;
        return addBigSci(sum, mulBigSciValues(stock.holdings || 0, price - costPrice));
    }, 0);
}
// 更新图表价格范围显示
function updateChartPriceRange(data) {
    if (!data || data.length === 0) return;
    const valid = data.filter(function (p) { return Number.isFinite(p) && p > 0; });
    if (valid.length === 0) return;
    
    const minPrice = Math.min(...valid);
    const maxPrice = Math.max(...valid);
    const range = maxPrice - minPrice;
    const rangePercent = minPrice > 0 ? (range / minPrice * 100).toFixed(3) : '0.000';
    
    const maxElement = document.getElementById('chart-max-price');
    const minElement = document.getElementById('chart-min-price');
    const rangeElement = document.getElementById('chart-range');
    
    if (maxElement) maxElement.textContent = maxPrice.toFixed(3);
    if (minElement) minElement.textContent = minPrice.toFixed(3);
    if (rangeElement) rangeElement.textContent = `${range.toFixed(3)} (${rangePercent}%)`;
}
// 计算总盈亏比例（与大数持仓一致，避免 h*c 溢出或持仓为科学计数字符串时算错）
function calculateTotalProfitPercent() {
    const game = player.investmentGame;
    if (!game) return "0.000";
    let totalCost = 0;
    let totalValue = 0;
    const safe = (v, d) => (v != null && Number.isFinite(Number(v)) ? Number(v) : (d || 0));
    game.stocks.forEach(stock => {
        const h = stock.holdings || 0;
        const c = safe(stock.costPrice, 0);
        const p = safe(stock.price, 10);
        if (cmpBigSci(h, 0) > 0 && c > 0) {
            totalCost = addBigSci(totalCost, mulBigSciValues(h, c));
            totalValue = addBigSci(totalValue, mulBigSciValues(h, p));
        }
    });
    const costNum = Number(bigSciToStorageValue(totalCost));
    const valNum = Number(bigSciToStorageValue(totalValue));
    if (!(costNum > 0) || !Number.isFinite(valNum)) return "0.000";
    const profitPercent = ((valNum - costNum) / costNum * 100);
    return Number.isFinite(profitPercent) ? `${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(3)}` : "0.000";
}
// 生成持仓表格
function generateHoldingsTable() {
    const game = player.investmentGame;
    const holdings = game.stocks.filter(stock => cmpBigSci(stock.holdings || 0, 0) > 0);
    const currentStock = game.stocks[game.currentStockIndex];
    
    if (holdings.length === 0) {
        return '';
    }
    
    const totalHoldingsValue = calculateTotalHoldingsValue();
    const totalHoldingsValueNum = Number(bigSciToStorageValue(totalHoldingsValue));
    const safeTotal = Number.isFinite(totalHoldingsValueNum) && totalHoldingsValueNum > 0 ? totalHoldingsValueNum : 1;
    const safe = (v, d) => (v != null && Number.isFinite(Number(v)) ? Number(v) : (d || 0));
    
    return holdings.map(stock => {
        const price = safe(stock.price, 10);
        const costPrice = safe(stock.costPrice, 0);
        const h = stock.holdings || 0;
        const hNum = safe(h, 0);
        const holdValue = mulBigSciValues(h, price);
        const profitAmount = costPrice > 0 ? mulBigSciValues(h, price - costPrice) : 0;
        const profitPercent = costPrice > 0 ? safeChangePercent(price, costPrice) : 0;
        const holdValueNum = Number(bigSciToStorageValue(holdValue));
        const profitNonNeg = cmpBigSci(profitAmount, 0) >= 0;
        const holdingPercent = Number.isFinite(holdValueNum) ? (holdValueNum / safeTotal * 100) : 0;
        const isSelected = stock.code === currentStock.code;
        
        return `
            <tr class="holding-item clickable ${isSelected ? 'selected' : ''}" data-code="${stock.code}">
                <td class="stock-code">${stock.code}</td>
                <td>${stock.name}</td>
                <td>${formatInvestmentNumber(h, 'shares')}</td>
                <td>${price >= 1e12 ? price.toExponential(3) : price.toFixed(3)}</td>
                <td>${costPrice > 0 ? (costPrice >= 1e12 ? costPrice.toExponential(3) : costPrice.toFixed(3)) : "0.000"}</td>
                <td>${formatInvestmentNumber(holdValue)}</td>
                <td class="${profitNonNeg ? 'profit-up' : 'profit-down'}">
                    ${profitNonNeg ? '+' : ''}${formatInvestmentNumber(profitAmount)}
                </td>
                <td class="${profitPercent >= 0 ? 'profit-up' : 'profit-down'}">
                    ${profitPercent >= 0 ? '+' : ''}${(Number.isFinite(profitPercent) ? profitPercent : 0).toFixed(3)}%
                </td>
                <td class="holding-percent">${(Number.isFinite(holdingPercent) ? holdingPercent : 0).toFixed(3)}%</td>
            </tr>
        `;
    }).join('');
}

// 检查是否有持仓
function hasHoldings() {
    const game = player.investmentGame;
    return game.stocks.some(stock => cmpBigSci(stock.holdings || 0, 0) > 0);
}

// 生成股票列表
function generateStocksList() {
    const game = player.investmentGame;
    const currentStock = game.stocks[game.currentStockIndex];
    
    return game.stocks.map(stock => {
        const recentChange = calculateRecentPriceChange(stock);
        const safeChange = Number.isFinite(recentChange) ? Math.max(-999, Math.min(999, recentChange)) : 0;
        stock.change = safeChange;
        
        const isSelected = stock.code === currentStock.code;
        const price = Number(stock.price);
        const priceStr = Number.isFinite(price) ? price.toFixed(3) : '0.000';
        
        return `
            <tr class="stock-item ${isSelected ? 'selected' : ''}" data-code="${stock.code}">
                <td class="stock-code">${stock.code}</td>
                <td>${stock.name}</td>
                <td>${priceStr}</td>
                <td class="${safeChange >= 0 ? 'profit-up' : 'profit-down'}">
                    ${safeChange >= 0 ? '+' : ''}${safeChange.toFixed(3)}%
                </td>
            </tr>
        `;
    }).join('');
}
function calculateRecentPriceChange(stock) {
    const priceHistory = stock.priceHistory || [];
    const historyLength = priceHistory.length;
    
    if (historyLength < 2) {
        // 新号无历史数据，用 basePrice 算涨跌幅，并保证不返回 NaN
        const basePrice = Math.max(0.0001, Number(stock.basePrice) || Number(stock.price) || 10);
        const price = Number(stock.price);
        return safeChangePercent(Number.isFinite(price) ? price : basePrice, basePrice);
    }
    
    const currentPrice = priceHistory[historyLength - 1];
    const lookbackPeriods = Math.min(10, historyLength - 1);
    const previousPrice = priceHistory[historyLength - 1 - lookbackPeriods];
    
    if (previousPrice <= 0 || !Number.isFinite(previousPrice) || !Number.isFinite(currentPrice)) {
        return 0;
    }
    
    return safeChangePercent(currentPrice, previousPrice);
}
function calculateChangeFromArray(priceArray) {
    const length = priceArray.length;
    const lookback = Math.min(10, length - 1);
    
    if (lookback < 1) return 0;
    
    let totalChange = 0;
    let changes = [];
    
    // 收集最近的变化
    for (let i = length - 1; i >= length - lookback; i--) {
        if (i > 0 && priceArray[i-1] > 0) {
            const change = ((priceArray[i] - priceArray[i-1]) / priceArray[i-1]) * 100;
            changes.push(change);
        }
    }
    
    if (changes.length === 0) return 0;
    
    // 计算总变化（不是平均值）
    totalChange = changes.reduce((sum, change) => sum + change, 0);
    
    // 可选：对近期变化给予更高权重
    if (changes.length >= 3) {
        const weights = [1.5, 1.3, 1.1, 1, 1, 1, 1, 1, 1, 1];
        totalChange = 0;
        for (let i = 0; i < Math.min(changes.length, 10); i++) {
            totalChange += changes[i] * (weights[i] || 1);
        }
        // 归一化
        totalChange = totalChange / changes.length;
    }
    
    return totalChange;
}
function getRecentPriceChange(stock) {
    // 创建缓存
    if (!stock._changeCache) {
        stock._changeCache = {
            value: 0,
            timestamp: 0,
            cacheDuration: 60000 // 缓存1分钟
        };
    }
    
    const cache = stock._changeCache;
    const now = Date.now();
    
    // 如果缓存有效且未过期，直接返回缓存值（保证不返回 NaN）
    if (now - cache.timestamp < cache.cacheDuration) {
        return Number.isFinite(cache.value) ? cache.value : 0;
    }
    
    // 重新计算涨跌幅
    const recentChange = calculateRecentPriceChange(stock);
    const safe = Number.isFinite(recentChange) ? recentChange : 0;
    
    cache.value = safe;
    cache.timestamp = now;
    
    return safe;
}
// 保证 tradeData 存在，避免读档或异常路径下 game.tradeData 缺失导致点击买入/卖出或刷新时报错、后续交互失效
function ensureInvestmentTradeData(game) {
    const g = game || player.investmentGame;
    if (!g) return;
    if (!g.tradeData || typeof g.tradeData !== 'object') {
        g.tradeData = { quantity: 0, type: 'buy', feeRate: 0.0048 };
        return;
    }
    if (g.tradeData.type !== 'buy' && g.tradeData.type !== 'sell') g.tradeData.type = 'buy';
    const fr = Number(g.tradeData.feeRate);
    if (!Number.isFinite(fr) || fr < 0) g.tradeData.feeRate = 0.0048;
}
// 根据 game.tradeData 同步「买入/卖出」按钮高亮（模板默认曾固定为买入 active，与内存状态不一致会导致表现错乱）
function syncInvestmentTradeTypeUI() {
    const game = player.investmentGame;
    if (!game) return;
    ensureInvestmentTradeData(game);
    const t = game.tradeData.type === 'sell' ? 'sell' : 'buy';
    document.querySelectorAll('.investment-game .type-option').forEach(function (opt) {
        if (opt.getAttribute('data-type') === t) opt.classList.add('active');
        else opt.classList.remove('active');
    });
}
// 初始化投资游戏事件监听。每次打开面板会重新渲染 DOM（innerHTML 替换），因此标签/按钮等需每次重新绑定；document 委托只注册一次避免重复。
function initInvestmentEventListeners() {
    const game = player.investmentGame;
    if (!game) return;
    ensureInvestmentTradeData(game);
    
    // 标签页切换（每次打开都会重新渲染 DOM，必须每次绑定到新节点）
    document.querySelectorAll('.investment-game .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 更新活跃标签
            document.querySelectorAll('.investment-game .tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 更新活跃内容
            document.querySelectorAll('.investment-game .tab-content').forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
            
            // 更新底部导航
            document.querySelectorAll('.investment-game .nav-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-nav') === tabId) {
                    btn.classList.add('active');
                }
            });
        });
    });
    
    // 底部导航点击
    document.querySelectorAll('.investment-game .nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-nav');
            const targetTab = document.querySelector(`.investment-game .tab[data-tab="${tabId}"]`);
            if (targetTab) {
                targetTab.click();
            }
        });
    });
    
    // 交易数量按钮
    document.querySelectorAll('.investment-game .qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            updateInvestmentTradeQuantity(action);
        });
    });
    
    // 交易类型切换
    document.querySelectorAll('.investment-game .type-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.investment-game .type-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            game.tradeData.type = this.getAttribute('data-type');
            updateInvestmentTradeInfo();
        });
    });
    
    // 交易数量输入
    const quantityInput = document.getElementById('trade-quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', updateInvestmentTradeInfo);
        quantityInput.addEventListener('change', updateInvestmentTradeInfo);
    }
    
    // 增加交易次数按钮
    const addTradeCountBtn = document.getElementById('add-trade-count');
    if (addTradeCountBtn) {
        addTradeCountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            game.userData.tradeCount += 5;
            document.getElementById('trade-count').textContent = game.userData.tradeCount;
            showInvestmentNotification('交易次数已增加5次！', 'success');
            saveGame();
        });
    }
    
    // 提交交易按钮
    const submitBtn = document.getElementById('submit-trade');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitInvestmentTrade);
    }
    
    // 时间过滤器
    document.querySelectorAll('.investment-game .time-filter').forEach(filter => {
    filter.addEventListener('click', function() {
        document.querySelectorAll('.investment-game .time-filter').forEach(f => {
            f.classList.remove('active');
        });
        this.classList.add('active');
        updateInvestmentChartFromCache(100); // 固定使用100个点
    });
});
    
    // 持仓行/股票列表行点击（事件委托，只注册一次，避免每次打开面板重复绑定）
    if (!window._investmentDocClickInitialized) {
        window._investmentDocClickInitialized = true;
        document.addEventListener('click', function(e) {
            // 检查是否点击了持仓行（限定在投资面板表格内，避免与其它表格冲突）
            const holdingRow = e.target.closest('#holdings-body tr.holding-item.clickable');
            if (holdingRow) {
                e.preventDefault();
                const stockCode = holdingRow.getAttribute('data-code');
                const game = player.investmentGame;
                if (!game) return;
                const stockIndex = game.stocks.findIndex(s => s.code === stockCode);
                
                if (stockIndex >= 0) {
                    game.currentStockIndex = stockIndex;
                    
                    // 切换到交易标签页
                    const tradeTab = document.querySelector('.investment-game .tab[data-tab="trade"]');
                    if (tradeTab) {
                        tradeTab.click();
                    }
                    
                    // 更新显示
                    updateInvestmentStockDisplay();
                    updateInvestmentTradeInfo();
                    updateInvestmentHoldingsInfo();
                    showInvestmentNotification(`已切换到持仓股票: ${game.stocks[stockIndex].name}`, 'info');
                }
            }
            
            // 检查是否点击了股票列表行（限定 tbody#stocks-list，避免与转生股票等其它 .stock-item 冲突）
            const stockRow = e.target.closest('#stocks-list tr.stock-item');
            if (stockRow) {
                e.preventDefault();
                const stockCode = stockRow.getAttribute('data-code');
                const game = player.investmentGame;
                if (!game) return;
                const stockIndex = game.stocks.findIndex(s => s.code === stockCode);
                
                if (stockIndex >= 0) {
                    game.currentStockIndex = stockIndex;
                    
                    // 切换到交易标签页
                    const tradeTab = document.querySelector('.investment-game .tab[data-tab="trade"]');
                    if (tradeTab) {
                        tradeTab.click();
                    }
                    
                    // 更新显示
                    updateInvestmentStockDisplay();
                    updateInvestmentTradeInfo();
                    updateInvestmentHoldingsInfo();
                    showInvestmentNotification(`已切换到股票: ${game.stocks[stockIndex].name}`, 'info');
                }
            }
        });
    }
}
function cleanInvestmentChartCache() {
    const game = player.investmentGame;
    if (!game || !game.chartHistoryCache) return;
    const cache = game.chartHistoryCache;
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30分钟
    const maxEntries = 100;
    const keys = Object.keys(cache);
    // 按时间戳删除过期条目
    for (const key of keys) {
        const entry = cache[key];
        if (entry && (now - (entry.timestamp || 0) > maxAge)) {
            delete cache[key];
        }
    }
    // 若仍超过数量上限，删除最旧的一部分
    const remaining = Object.keys(cache);
    if (remaining.length > maxEntries) {
        const entries = remaining.map(k => ({ k, ts: (cache[k] && cache[k].timestamp) || 0 }));
        entries.sort((a, b) => a.ts - b.ts);
        for (let i = 0; i < entries.length - maxEntries; i++) {
            delete cache[entries[i].k];
        }
    }
}
// 更新股票显示
function updateInvestmentStockDisplay() {
    const game = player.investmentGame;
    if (!game || !game.stocks || !game.stocks.length) return;
    const currentStock = game.stocks[game.currentStockIndex];
    if (!currentStock) return;
    const safePrice = Number.isFinite(Number(currentStock.price)) ? Number(currentStock.price) : (currentStock.basePrice || 10);
    const safeChange = Number.isFinite(Number(currentStock.change)) ? Number(currentStock.change) : 0;
    
    const nameEl = document.getElementById('current-stock-name');
    const priceElement = document.getElementById('current-price');
    const timeEl = document.getElementById('update-time');
    if (!nameEl || !priceElement || !timeEl) return;
    nameEl.textContent = currentStock.name;
    priceElement.textContent = safePrice.toFixed(3);
    
    // 根据涨跌设置颜色（使用安全值，避免 NaN 导致样式错乱）
    if (safeChange >= 0) {
        priceElement.className = 'stock-price';
    } else {
        priceElement.className = 'stock-price down';
    }
    
    // 更新时间显示
    timeEl.textContent = `股价上次更新时间：${new Date().toLocaleString()}`;
    
    // 高亮当前选中的股票行
    // 在股票列表页高亮（仅模拟投资面板内，避免误改其它系统的 .stock-item）
    document.querySelectorAll('.investment-game #stocks-list tr.stock-item').forEach(row => {
        row.classList.remove('selected');
        if (row.getAttribute('data-code') === currentStock.code) {
            row.classList.add('selected');
        }
    });
    
    // 在持仓列表高亮
    document.querySelectorAll('.investment-game #holdings-body tr.holding-item').forEach(row => {
        row.classList.remove('selected');
        if (row.getAttribute('data-code') === currentStock.code) {
            row.classList.add('selected');
        }
    });
}

// 交易数量输入框用：≥1e12 或超大数时禁止 toExponential(0)/toBigSciString(...,0)，否则 1.7e15 会变成 2e15 导致买不起或卖不出
function investmentTradeQuantityInputString(val) {
    const x = parseBigSci(val);
    if (x.m === 0) return '0';
    const n = Number(bigSciToStorageValue(x));
    if (Number.isFinite(n) && Math.abs(n) < 1e12) {
        const clamped = Math.max(0, n);
        if (clamped === 0) return '0';
        if (Number.isInteger(clamped) && Math.abs(clamped) <= Number.MAX_SAFE_INTEGER) return String(clamped);
        let s = clamped.toLocaleString('en-US', { maximumFractionDigits: 12, useGrouping: false });
        if (s.includes('.')) s = s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
        return s;
    }
    return toBigSciString(x, 12);
}
// 按上限比例取整股数；超大数时 Number(max) 为 Infinity，原先用 isFinite 判断会导致 1/2 仓等分支完全不更新
function investmentScaleMaxShares(maxQuantity, fraction) {
    if (!(fraction > 0) || !Number.isFinite(fraction)) return 0;
    const mx = parseBigSci(maxQuantity);
    if (cmpBigSci(mx, 0) <= 0) return 0;
    const scaled = mulBigSci(mx, fraction);
    const sv = bigSciToStorageValue(scaled);
    const n = Number(sv);
    if (!Number.isFinite(n)) return toBigSciString(parseBigSci(sv), 12);
    if (Math.abs(n) >= 1e12) return toBigSciString(parseBigSci(sv), 12);
    return Math.max(0, n);
}

function investmentParseTradeQuantityInput(quantityInput) {
    if (!quantityInput) return 0;
    const t = String(quantityInput.value || '').trim();
    if (!t) return 0;
    const v = bigSciToStorageValue(parseBigSci(t));
    if (cmpBigSci(v, 0) < 0) return 0;
    return v;
}

// 更新交易数量
function updateInvestmentTradeQuantity(action) {
    const quantityInput = document.getElementById('trade-quantity');
    if (!quantityInput) return;
    let quantity = investmentParseTradeQuantityInput(quantityInput);
    const maxQuantity = calculateInvestmentMaxQuantity();
    let act = action == null ? '' : String(action).trim();
    if (act === '0') act = 'clear';
    
    switch (act) {
        case 'clear':
            quantity = 0;
            break;
        case 'max': {
            const q = investmentScaleMaxShares(maxQuantity, 1);
            if (typeof q === 'string') {
                quantityInput.value = q;
                updateInvestmentTradeInfo();
                return;
            }
            quantity = q;
            break;
        }
        case 'quarter': {
            const q = investmentScaleMaxShares(maxQuantity, 0.25);
            if (typeof q === 'string') {
                quantityInput.value = q;
                updateInvestmentTradeInfo();
                return;
            }
            quantity = q;
            break;
        }
        case 'half': {
            const q = investmentScaleMaxShares(maxQuantity, 0.5);
            if (typeof q === 'string') {
                quantityInput.value = q;
                updateInvestmentTradeInfo();
                return;
            }
            quantity = q;
            break;
        }
        case 'third': {
            const q = investmentScaleMaxShares(maxQuantity, 1 / 3);
            if (typeof q === 'string') {
                quantityInput.value = q;
                updateInvestmentTradeInfo();
                return;
            }
            quantity = q;
            break;
        }
        default:
            quantity = bigSciToStorageValue(addBigSci(quantity, parseInt(act, 10) || 0));
            if (cmpBigSci(quantity, 0) < 0) quantity = 0;
            if (cmpBigSci(quantity, maxQuantity) > 0) {
                const cap = investmentScaleMaxShares(maxQuantity, 1);
                if (typeof cap === 'string') {
                    quantityInput.value = cap;
                    updateInvestmentTradeInfo();
                    return;
                }
                quantity = cap;
            }
            break;
    }
    
    quantityInput.value = investmentTradeQuantityInputString(quantity);
    updateInvestmentTradeInfo();
}

// 计算最大可交易数量
function calculateInvestmentMaxQuantity() {
    const game = player.investmentGame;
    if (!game || !game.stocks || !game.stocks.length) return 0;
    ensureInvestmentTradeData(game);
    const currentStock = game.stocks[game.currentStockIndex];
    if (!currentStock) return 0;
    
    if (game.tradeData.type === 'buy') {
        // 根据可用资金计算最大可买入数量
        const unitCost = Number(currentStock.price) * (1 + Number(game.tradeData.feeRate || 0));
        if (!Number.isFinite(unitCost) || unitCost <= 0) return 0;
        const fundsNum = Number(game.userData.availableFunds);
        if (Number.isFinite(fundsNum) && Math.abs(fundsNum) < 1e15) return Math.max(0, fundsNum / unitCost);
        const f = parseBigSci(game.userData.availableFunds);
        const u = parseBigSci(unitCost);
        if (f.m <= 0 || u.m <= 0) return 0;
        return bigSciToStorageValue(normalizeBigSci(f.m / u.m, f.e - u.e));
    } else {
        // 卖出时最多可卖出持有数量（先清理负持仓/碎股误差）
        return sanitizeInvestmentStockHoldings(currentStock);
    }
}

// 更新交易信息
function updateInvestmentTradeInfo() {
    const game = player.investmentGame;
    if (!game || !game.stocks || !game.stocks.length) return;
    ensureInvestmentTradeData(game);
    const currentStock = game.stocks[game.currentStockIndex];
    if (!currentStock) return;
    const quantityInput = document.getElementById('trade-quantity');
    const amountInput = document.getElementById('trade-amount');
    const feeInput = document.getElementById('trade-fee');
    const maxQuantityInput = document.getElementById('max-quantity');
    if (!quantityInput || !amountInput || !feeInput || !maxQuantityInput) return;
    
    // 更新交易数量（支持超大科学计数，如 1e400）
    let quantity = bigSciToStorageValue(parseBigSci(String(quantityInput.value || '').trim() || '0'));
    const maxQuantity = calculateInvestmentMaxQuantity();
    
    if (cmpBigSci(quantity, maxQuantity) > 0) {
        quantity = maxQuantity;
        quantityInput.value = investmentTradeQuantityInputString(quantity);
    }
    
    // 计算交易金额和手续费
    const amount = mulBigSciValues(quantity, currentStock.price);
    const fee = mulBigSciValues(amount, game.tradeData.feeRate);
    
    // 更新显示
    amountInput.value = formatInvestmentNumber(amount);
    feeInput.value = formatInvestmentNumber(fee);
    maxQuantityInput.value = formatInvestmentNumber(maxQuantity, 'shares');
    
    const summaryEl = document.getElementById('trade-fee-summary');
    if (summaryEl) {
        if (game.tradeData.type === 'buy') {
            const totalOut = addBigSci(amount, fee);
            summaryEl.textContent = '买入合计扣款（成交额+手续费）：¥' + formatInvestmentNumber(totalOut);
        } else {
            const netIn = subBigSci(amount, fee);
            summaryEl.textContent = '卖出实际到账（成交额−手续费）：¥' + formatInvestmentNumber(netIn);
        }
    }
    
    // 更新持仓信息
    updateInvestmentHoldingsInfo();
}

// 更新持仓信息（价格、盈亏用安全值，避免 NaN）
function updateInvestmentHoldingsInfo() {
    const game = player.investmentGame;
    if (!game || !game.stocks || !game.stocks.length) return;
    const currentStock = game.stocks[game.currentStockIndex];
    if (!currentStock) return;
    const safe = (v, d) => (v != null && Number.isFinite(Number(v)) ? Number(v) : (d || 0));
    const price = safe(currentStock.price, 10);
    const costPrice = safe(currentStock.costPrice, 0);
    const holdings = currentStock.holdings || 0;
    const holdingsNum = safe(holdings, 0);
    const holdValue = mulBigSciValues(holdings, price);
    const profit = costPrice > 0 ? mulBigSciValues(holdings, (price - costPrice)) : 0;
    const profitPercent = costPrice > 0 ? safeChangePercent(price, costPrice) : 0;
    
    const holdAmtEl = document.getElementById('hold-amount');
    const costEl = document.getElementById('cost-price');
    const holdValEl = document.getElementById('hold-value');
    const profitElement = document.getElementById('hold-profit');
    if (!holdAmtEl || !costEl || !holdValEl || !profitElement) return;
    holdAmtEl.textContent = formatInvestmentNumber(holdings, 'shares');
    costEl.textContent = costPrice > 0 ? costPrice.toFixed(3) : "0.000";
    holdValEl.textContent = formatInvestmentNumber(holdValue);
    
    const profitText = costPrice > 0 ? 
        `${cmpBigSci(profit, 0) >= 0 ? '+' : ''}${formatInvestmentNumber(profit)} (${profitPercent >= 0 ? '+' : ''}${(Number.isFinite(profitPercent) ? profitPercent : 0).toFixed(3)}%)` : 
        "0.000 (0.000%)";
    
    profitElement.textContent = profitText;
    
    const pc = cmpBigSci(profit, 0);
    if (pc > 0) {
        profitElement.className = 'info-value profit-up';
    } else if (pc < 0) {
        profitElement.className = 'info-value profit-down';
    } else {
        profitElement.className = 'info-value';
    }
}

// 初始化价格图表
function initInvestmentChart() {
    updateInvestmentChartFromCache(100);
}

// 从缓存更新图表
function updateInvestmentChartFromCache(points = 100) {
    const game = player.investmentGame;
    const currentStock = game.stocks[game.currentStockIndex];
    const chartContainer = document.getElementById('price-chart');
    
    if (!chartContainer) return;
    
    // 生成图表数据
    const data = generateInvestmentChartData(currentStock.code, points);
    
    // 更新价格范围显示
    updateChartPriceRange(data);
    
    // 创建SVG图表
    chartContainer.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
            ${generateInvestmentChartSVG(data, currentStock)}
        </svg>
    `;
}

// 生成图表数据
function generateInvestmentChartData(stockCode, points) {
    const game = player.investmentGame;
    const cacheKey = `${stockCode}_${points}`;
    const stock = game.stocks.find(s => s.code === stockCode);
    
    if (!stock) return [];
    
    // 检查缓存
    if (game.chartHistoryCache[cacheKey] && 
        Date.now() - (game.chartHistoryCache[cacheKey].timestamp || 0) < 30000) {
        return game.chartHistoryCache[cacheKey].data;
    }
    
    // 固定生成100个点
    const dataPoints = Math.min(points, 100);
    const data = [];
    
    // 获取最近的价格历史（如果有的话）
    const priceHistory = stock.randomParams?.priceHistory || [];
    const historyLength = priceHistory.length;
    
    if (historyLength >= dataPoints) {
        // 如果有足够的历史数据，直接使用（保留2位小数）
        data.push(...priceHistory.slice(-dataPoints).map(function(p) { return roundInvestmentPrice(p); }));
    } else {
        // 生成模拟历史数据
        let currentPrice = stock.price;
        
        for (let i = 0; i < dataPoints; i++) {
            // 模拟价格波动
            const progress = i / dataPoints;
            const volatility = 0.005 * (1 - progress * 0.5);
            
            const randomFactor = (Math.random() - 0.5) * 2;
            const timeFactor = Math.sin(i * 0.1) * 0.2;
            const noise = randomFactor * volatility + timeFactor * volatility * 0.3;
            
            currentPrice *= (1 + noise);
            
            // 确保价格在合理范围内（按 basePrice 的区间）
            const basePrice = Math.max(0.01, Number(stock.basePrice) || Number(stock.price) || 10);
            const bounds = stock.priceBounds || { min: Math.max(0.01, basePrice * 0.2), max: Math.max(basePrice * 4, basePrice + 10) };
            if (currentPrice < bounds.min) {
                currentPrice = bounds.min * (1 + Math.random() * 0.1);
            }
            if (currentPrice > bounds.max) {
                currentPrice = bounds.max * (0.9 + Math.random() * 0.1);
            }
            
            // 确保数据足够平滑
            if (i > 0 && Math.abs(data[i-1] - currentPrice) > data[i-1] * 0.1) {
                currentPrice = data[i-1] * (1 + (Math.random() - 0.5) * 0.05);
            }
            
            data.unshift(roundInvestmentPrice(currentPrice)); // 添加到开头，只存2位小数
        }
        
        // 确保最后一个点是当前价格
        data[dataPoints - 1] = roundInvestmentPrice(stock.price);
    }
    
    // 平滑数据
    smoothChartData(data);
    
    // 确保价格有合理的波动范围
    const minPrice = Math.min(...data);
    const maxPrice = Math.max(...data);
    
    if (maxPrice - minPrice < 0.01) {
        // 如果价格波动太小，增加一些波动
        const midPrice = (maxPrice + minPrice) / 2;
        data.forEach((price, i) => {
            const variation = (Math.sin(i * 0.2) * 0.05 + (Math.random() - 0.5) * 0.02) * midPrice;
            data[i] = roundInvestmentPrice(Math.max(midPrice * 0.8, Math.min(midPrice * 1.2, price + variation)));
        });
    }
    
    // 存档只保留2位小数（原地修改，避免对 const data 重新赋值）
    for (let i = 0; i < data.length; i++) data[i] = roundInvestmentPrice(data[i]);
    
    // 缓存数据（带时间戳）
    game.chartHistoryCache[cacheKey] = {
        data: data,
        timestamp: Date.now(),
        min: roundInvestmentPrice(Math.min(...data)),
        max: roundInvestmentPrice(Math.max(...data))
    };
    
    return data;
}

function smoothChartData(data) {
    if (data.length < 3) return data;
    
    const smoothed = [...data];
    const smoothingFactor = 0.3; // 平滑系数
    
    for (let i = 1; i < data.length - 1; i++) {
        // 使用加权平均进行平滑
        smoothed[i] = (
            data[i-1] * smoothingFactor + 
            data[i] * (1 - smoothingFactor * 2) + 
            data[i+1] * smoothingFactor
        );
    }
    
    // 保持首尾不变
    smoothed[0] = data[0];
    smoothed[data.length - 1] = data[data.length - 1];
    
    // 复制回原数组
    for (let i = 0; i < data.length; i++) {
        data[i] = smoothed[i];
    }
}
function updateInvestmentChart() {
    const chartContainer = document.getElementById('price-chart');
    if (!chartContainer) return;
    
    const game = player.investmentGame;
    const currentStock = game.stocks[game.currentStockIndex];
    
    // 清除缓存，强制重新生成
    const cacheKey = `${currentStock.code}_100`;
    delete game.chartHistoryCache[cacheKey];
    
    // 更新图表
    updateInvestmentChartFromCache(100);
    
    // 添加更新动画效果
    chartContainer.style.opacity = '0.7';
    setTimeout(() => {
        chartContainer.style.opacity = '1';
    }, 300);
}
// 生成SVG图表
function generateInvestmentChartSVG(data, stock) {
    if (data.length === 0) return '';
    
    const width = 800;
    const height = 300;
    const padding = { top: 20, right: 60, bottom: 20, left: 60 }; // 增加左右边距
    
    const availableWidth = width - padding.left - padding.right;
    const availableHeight = height - padding.top - padding.bottom;
    
    const minPrice = Math.min(...data);
    const maxPrice = Math.max(...data);
    const range = maxPrice - minPrice || 1;
    
    // 生成更平滑的路径
    let pathData = '';
    data.forEach((price, index) => {
        const x = padding.left + (index / (data.length - 1)) * availableWidth;
        const y = padding.top + availableHeight - ((price - minPrice) / range) * availableHeight;
        
        if (index === 0) {
            pathData += `M ${x} ${y} `;
        } else {
            // 使用三次贝塞尔曲线让路径更平滑
            const prevX = padding.left + ((index - 1) / (data.length - 1)) * availableWidth;
            const prevY = padding.top + availableHeight - ((data[index - 1] - minPrice) / range) * availableHeight;
            const cp1x = prevX + (x - prevX) / 3;
            const cp1y = prevY;
            const cp2x = prevX + (x - prevX) * 2 / 3;
            const cp2y = y;
            
            pathData += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y} `;
        }
    });
    
    // 创建渐变填充
    const fillColor = stock.change >= 0 ? '#10b981' : '#ef4444';
    const gradientId = `gradient-${stock.code}-${Date.now()}`;
    
    // 计算当前价格在图表中的位置
    const currentPrice = data[data.length - 1];
    const currentX = width - padding.right;
    const currentY = padding.top + availableHeight - ((currentPrice - minPrice) / range) * availableHeight;
    
    return `
        <defs>
            <!-- 网格线 -->
            <pattern id="grid-${gradientId}" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="0.5"/>
            </pattern>
            
            <!-- 渐变填充 -->
            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${fillColor}" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="${fillColor}" stop-opacity="0.1"/>
            </linearGradient>
        </defs>
        
        <!-- 网格背景 -->
        <rect x="${padding.left}" y="${padding.top}" width="${availableWidth}" height="${availableHeight}" 
              fill="url(#grid-${gradientId})" stroke="none"/>
        
        <!-- Y轴价格标签背景 -->
        <rect x="0" y="${padding.top}" width="${padding.left}" height="${availableHeight}" 
              fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
        
        <!-- 价格填充区域 -->
        <path d="${pathData} L ${width - padding.right} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z" 
              fill="url(#${gradientId})" stroke="none"/>
        
        <!-- 价格路径 -->
        <path d="${pathData}" fill="none" stroke="${fillColor}" 
              stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        
        <!-- 当前价格点 -->
        <circle cx="${currentX}" cy="${currentY}" 
                r="4" fill="white" stroke="${fillColor}" stroke-width="2"/>
        
        <!-- Y轴价格标签 -->
        <g font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#6b7280">
            <!-- 最高价标签（左上角） -->
            <rect x="5" y="${padding.top - 10}" width="${padding.left - 10}" height="20" 
                  rx="4" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
            <text x="${padding.left / 2}" y="${padding.top + 4}" text-anchor="middle" font-weight="600" fill="#334155">
                ${maxPrice.toFixed(3)}
            </text>
            
            <!-- 最低价标签（左下角） -->
            <rect x="5" y="${height - padding.bottom - 10}" width="${padding.left - 10}" height="20" 
                  rx="4" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
            <text x="${padding.left / 2}" y="${height - padding.bottom + 4}" text-anchor="middle" font-weight="600" fill="#334155">
                ${minPrice.toFixed(3)}
            </text>
            
            <!-- 中间价格标签（可选） -->
            <rect x="5" y="${height / 2 - 10}" width="${padding.left - 10}" height="20" 
                  rx="4" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
            <text x="${padding.left / 2}" y="${height / 2 + 4}" text-anchor="middle" font-weight="600" fill="#334155">
                ${((maxPrice + minPrice) / 2).toFixed(3)}
            </text>
        </g>
        
        <!-- 当前价格标签 -->
        <g font-family="'Segoe UI', Arial, sans-serif" font-size="12">
            <rect x="${width - padding.right - 80}" y="${padding.top + 10}" width="70" height="24" rx="4" 
                  fill="${stock.change >= 0 ? '#10b981' : '#ef4444'}" fill-opacity="0.9"/>
            <text x="${width - padding.right - 45}" y="${padding.top + 26}" text-anchor="middle" fill="white" font-weight="600">
                ${stock.price.toFixed(3)}
            </text>
        </g>
        
        <!-- X轴网格线 -->
        <g stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2">
            <line x1="${padding.left}" y1="${padding.top + availableHeight * 0.25}" 
                  x2="${width - padding.right}" y2="${padding.top + availableHeight * 0.25}"/>
            <line x1="${padding.left}" y1="${padding.top + availableHeight * 0.5}" 
                  x2="${width - padding.right}" y2="${padding.top + availableHeight * 0.5}"/>
            <line x1="${padding.left}" y1="${padding.top + availableHeight * 0.75}" 
                  x2="${width - padding.right}" y2="${padding.top + availableHeight * 0.75}"/>
        </g>
        
        <!-- Y轴网格线 -->
        <g stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2">
            <line x1="${padding.left + availableWidth * 0.25}" y1="${padding.top}" 
                  x2="${padding.left + availableWidth * 0.25}" y2="${height - padding.bottom}"/>
            <line x1="${padding.left + availableWidth * 0.5}" y1="${padding.top}" 
                  x2="${padding.left + availableWidth * 0.5}" y2="${height - padding.bottom}"/>
            <line x1="${padding.left + availableWidth * 0.75}" y1="${padding.top}" 
                  x2="${padding.left + availableWidth * 0.75}" y2="${height - padding.bottom}"/>
        </g>
        
        <!-- 坐标轴 -->
        <g stroke="#cbd5e1" stroke-width="2">
            <!-- Y轴 -->
            <line x1="${padding.left}" y1="${padding.top}" 
                  x2="${padding.left}" y2="${height - padding.bottom}"/>
            <!-- X轴 -->
            <line x1="${padding.left}" y1="${height - padding.bottom}" 
                  x2="${width - padding.right}" y2="${height - padding.bottom}"/>
        </g>
        
        <!-- 时间标签（可选） -->
        <g font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">
            <text x="${padding.left}" y="${height - 5}">过去</text>
            <text x="${width - padding.right}" y="${height - 5}">现在</text>
        </g>
    `;
}

// 提交交易
function submitInvestmentTrade() {
    const game = player.investmentGame;
    if (!game || !game.stocks || !game.stocks.length) return;
    ensureInvestmentTradeData(game);
    const currentStock = game.stocks[game.currentStockIndex];
    if (!currentStock) return;
    
    if (game.userData.tradeCount <= 0) {
        showInvestmentNotification('交易次数不足！', 'error');
        return;
    }
    
    const quantityInput = document.getElementById('trade-quantity');
    if (!quantityInput) return;
    const quantityText = String(quantityInput.value || '').trim();
    let quantity = parseBigSci(quantityText);
    
    if (cmpBigSci(quantity, 0) <= 0) {
        showInvestmentNotification('请输入有效的交易数量', 'error');
        return;
    }
    
    if (game.tradeData.type === 'sell') {
        const holdings = sanitizeInvestmentStockHoldings(currentStock);
        if (cmpBigSci(holdings, 0) <= 0) {
            showInvestmentNotification('当前无持仓，无法卖出', 'error');
            return;
        }
        const clamped = investmentClampSellQuantity(quantity, holdings);
        if (clamped == null) {
            showInvestmentNotification('持有数量不足，无法卖出', 'error');
            return;
        }
        quantity = parseBigSci(clamped);
        if (cmpBigSci(quantity, 0) <= 0) {
            showInvestmentNotification('请输入有效的交易数量', 'error');
            return;
        }
    }
    
    const amount = mulBigSciValues(quantity, currentStock.price);
    const fee = mulBigSciValues(amount, game.tradeData.feeRate);
    const totalCost = addBigSci(amount, fee);
    
    if (game.tradeData.type === 'buy') {
        if (cmpBigSci(totalCost, game.userData.availableFunds) > 0) {
            showInvestmentNotification('可用资金不足，无法完成买入', 'error');
            return;
        }
        
        // 执行买入
        game.userData.availableFunds = bigSciToStorageValue(subBigSci(game.userData.availableFunds, totalCost));
        
        // 更新持仓（amount/quantity 为 BigSci 对象，不能用 Number(amount)）
        const oldHoldings = currentStock.holdings || 0;
        const newTotalShares = bigSciToStorageValue(addBigSci(oldHoldings, quantity));
        const oldCostTotal = mulBigSciValues(oldHoldings, Number(currentStock.costPrice) > 0 ? currentStock.costPrice : 0);
        const numer = addBigSci(oldCostTotal, amount);
        const den = addBigSci(oldHoldings, quantity);
        const numerN = Number(bigSciToStorageValue(numer));
        const denN = Number(bigSciToStorageValue(den));
        let newCostPrice = Number(currentStock.price) || 0;
        if (Number.isFinite(numerN) && Number.isFinite(denN) && denN > 0) {
            newCostPrice = numerN / denN;
        }
        
        currentStock.holdings = roundInvestmentHoldings(newTotalShares);
        currentStock.costPrice = newCostPrice;
        sanitizeInvestmentStockHoldings(currentStock);
        game.userData.tradeCount--;
        
        showInvestmentNotification(`成功买入 ${formatInvestmentNumber(quantity, 'shares')} 股 ${currentStock.name}，花费 ¥${formatInvestmentNumber(totalCost)}`, 'success');
    } else {
        // 执行卖出
        let sellAmount = subBigSci(amount, fee);
        if (cmpBigSci(sellAmount, 0) < 0) sellAmount = { m: 0, e: 0n };
        game.userData.availableFunds = bigSciToStorageValue(addBigSci(game.userData.availableFunds, sellAmount));
        currentStock.holdings = roundInvestmentHoldings(bigSciToStorageValue(subBigSci(currentStock.holdings || 0, quantity)));
        sanitizeInvestmentStockHoldings(currentStock);
        game.userData.tradeCount--;
        
        showInvestmentNotification(`成功卖出 ${formatInvestmentNumber(quantity, 'shares')} 股 ${currentStock.name}，获得 ¥${formatInvestmentNumber(sellAmount)}`, 'success');
    }
    
    // 更新总资产
    updateInvestmentTotalAssets();
    
    // 更新界面
    document.getElementById('trade-count').textContent = game.userData.tradeCount;
    document.getElementById('available-funds').textContent = formatInvestmentNumber(game.userData.availableFunds);
    
    // 重置交易数量
    quantityInput.value = 0;
    
    // 更新所有信息
    updateInvestmentTradeInfo();
    updateInvestmentHoldingsInfo();
    updateInvestmentAssetsDisplay();
    
    // 保存游戏
    saveGame();
}

// 更新总资产（所有参与计算的值都做 NaN 防护，避免总资产变 NaN）
function updateInvestmentTotalAssets() {
    const game = player.investmentGame;
    if (!game || !game.userData) return;

    const totalHoldingsValueBig = game.stocks.reduce((sum, stock) => {
        const price = Number.isFinite(Number(stock.price)) ? Number(stock.price) : 10;
        return addBigSci(sum, mulBigSciValues(stock.holdings || 0, price));
    }, 0);
    
    const totalHoldingsCostBig = game.stocks.reduce((sum, stock) => {
        const cost = Number.isFinite(Number(stock.costPrice)) ? Number(stock.costPrice) : 0;
        return addBigSci(sum, mulBigSciValues(stock.holdings || 0, cost));
    }, 0);
    
    const totalProfitLossBig = subBigSci(totalHoldingsValueBig, totalHoldingsCostBig);
    const totalHoldingsValueNum = Number(bigSciToStorageValue(totalHoldingsValueBig));
    const totalHoldingsCostNum = Number(bigSciToStorageValue(totalHoldingsCostBig));
    const totalProfitLossNum = Number(bigSciToStorageValue(totalProfitLossBig));
    const totalProfitLossPercent = (Number.isFinite(totalHoldingsCostNum) && totalHoldingsCostNum > 0 && Number.isFinite(totalProfitLossNum))
        ? (totalProfitLossNum / totalHoldingsCostNum * 100) : 0;
    
    const availableFunds = bigSciToStorageValue(game.userData.availableFunds != null ? game.userData.availableFunds : 1000);
    const totalAssetsBig = addBigSci(availableFunds, totalHoldingsValueBig);
    const safeTotalAssets = cmpBigSci(totalAssetsBig, 0) >= 0 ? totalAssetsBig : availableFunds;
    const safeTotalAssetsStored = bigSciToStorageValue(safeTotalAssets);
    const safeTotalAssetsNum = Number(safeTotalAssetsStored);
    const holdingPercent = (Number.isFinite(safeTotalAssetsNum) && safeTotalAssetsNum > 0 && Number.isFinite(totalHoldingsValueNum))
        ? (totalHoldingsValueNum / safeTotalAssetsNum * 100) : 0;
    
    game.userData.availableFunds = availableFunds;
    game.userData.totalAssets = safeTotalAssetsStored;
    game.userData.holdingPercent = Number.isFinite(holdingPercent) ? Math.max(0, Math.min(100, holdingPercent)) : 0;
    game.userData.todayProfit = Number.isFinite(totalProfitLossPercent) ? totalProfitLossPercent : 0;
    game.userData.totalProfitAmount = bigSciToStorageValue(totalProfitLossBig);
    game.userData.totalProfitPercent = Number.isFinite(totalProfitLossPercent) ? totalProfitLossPercent : 0;
}

// 更新资产显示（总资产等做 NaN 防护，避免界面显示 NaN）
function updateInvestmentAssetsDisplay() {
    const game = player.investmentGame;
    if (!game || !game.userData) return;
    const totalAssets = game.userData.totalAssets != null ? game.userData.totalAssets : 0;
    const holdingPercent = (game.userData.holdingPercent != null && Number.isFinite(Number(game.userData.holdingPercent))) ? Number(game.userData.holdingPercent) : 0;
    
    const totalAssetsEl = document.getElementById('total-assets');
    if (totalAssetsEl) totalAssetsEl.textContent = formatInvestmentNumber(totalAssets);
    
    const holdVal = calculateTotalHoldingsValue();
    const totalHoldEl = document.getElementById('total-hold-value');
    if (totalHoldEl) totalHoldEl.textContent = formatInvestmentNumber(holdVal);
    
    const holdPctEl = document.getElementById('total-holding-percent');
    if (holdPctEl) holdPctEl.textContent = (Number.isFinite(holdingPercent) ? holdingPercent : 0).toFixed(3) + '%';
    
    // 更新总盈亏
    const profitAmount = calculateTotalProfitAmount();
    const profitAmountEl = document.getElementById('total-profit-amount');
    if (profitAmountEl) profitAmountEl.textContent = formatInvestmentNumber(profitAmount);
    const profitPercentEl = document.getElementById('total-profit-percent');
    if (profitPercentEl) profitPercentEl.textContent = calculateTotalProfitPercent() + '%';
    
    // 更新持仓表格
    const holdingsBody = document.getElementById('holdings-body');
    if (holdingsBody) holdingsBody.innerHTML = generateHoldingsTable();
    
    // 显示/隐藏无持仓提示
    const noHold = document.getElementById('no-holdings');
    if (noHold) noHold.style.display = hasHoldings() ? 'none' : 'block';
}

// 显示投资游戏通知
function showInvestmentNotification(message, type) {
    const notification = document.getElementById('investment-notification');
    if (!notification) return;
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// 开始价格模拟
function startPriceSimulation() {
    const game = player.investmentGame;
    
    // 初始化随机参数
    if (!game.stocks[0]?.randomParams) {
        game.stocks.forEach((stock, index) => {
            if (!stock.randomParams) {
                stock.randomParams = {
                    baseVolatility: 0.005 + Math.random() * 0.025,
                    trendStrength: (Math.random() - 0.5) * 0.002,
                    eventProbability: 0.001,
                    meanReversion: 0.2 + Math.random() * 0.3,
                    noiseLevel: Math.random() * 0.8 + 0.2,
                    lastChange: 0,
                    priceHistory: []
                };
            }
            if (!stock.basePrice) {
                stock.basePrice = stock.price || 10;
            }
            if (!stock.priceBounds) {
                stock.priceBounds = {
                    min: 0.1,   // 最低0.1元
                    max: 200,   // 最高200元
                    support: Math.max(0.5, stock.basePrice * 0.5), // 支撑位
                    resistance: Math.min(150, stock.basePrice * 1.5) // 阻力位
                };
            }
        });
    }
    
    // 清除之前的定时器
    if (game.priceUpdateTimer) {
        if (typeof unregisterInterval === 'function') unregisterInterval(game.priceUpdateTimer);
        else clearInterval(game.priceUpdateTimer);
        game.priceUpdateTimer = null;
    }
    if (game.chartUpdateTimer) {
        if (typeof unregisterInterval === 'function') unregisterInterval(game.chartUpdateTimer);
        else clearInterval(game.chartUpdateTimer);
        game.chartUpdateTimer = null;
    }
    
    // 设置游戏开始时间（只在第一次启动时）
    if (!game.startTime) {
        game.startTime = Date.now();
    }
    
    // 先模拟一次离线价格变化
    simulateOfflinePriceChanges();
    
    let lastMarketEventTime = Date.now();
    let currentMarketMood = 0;
    let lastUpdateTime = Date.now();
    
    // 每分钟更新一次价格
    game.priceUpdateTimer = registerInterval(() => {
        const updateTime = Date.now();
        const minutesSinceStart = Math.floor((updateTime - game.startTime) / 60000);
        
        // 每5分钟可能更新市场情绪
        if (minutesSinceStart % 5 === 0) {
            if (Math.random() < 0.3) {
                currentMarketMood += (Math.random() - 0.5) * 0.4;
                currentMarketMood = Math.max(-1, Math.min(1, currentMarketMood));
            }
        }
        
        // 检查市场事件
        let marketEffect = 0;
        const timeSinceLastEvent = updateTime - lastMarketEventTime;
        
        if (timeSinceLastEvent > 5 * 60 * 1000) {
            const eventRoll = Math.random();
            if (eventRoll < 0.0005) {
                marketEffect = (Math.random() - 0.5) * 0.08;
                lastMarketEventTime = updateTime;
                logAction(`市场发生重大事件！影响: ${(marketEffect * 100).toFixed(2)}%`, 'market');
            } else if (eventRoll < 0.005) {
                marketEffect = (Math.random() - 0.5) * 0.02;
                lastMarketEventTime = updateTime;
            }
        }
        
        // 为所有股票更新价格（修复版）：新号无 params/bounds 会算出 NaN，必须先补全并保证 price 有效
        game.stocks.forEach((stock, index) => {
            const basePrice = Math.max(0.0001, Number(stock.basePrice) || Number(stock.price) || 10);
            if (!Number.isFinite(stock.price) || stock.price <= 0) stock.price = roundInvestmentPrice(basePrice);
            if (!stock.randomParams) {
                stock.randomParams = {
                    baseVolatility: 0.005 + Math.random() * 0.025,
                    trendStrength: (Math.random() - 0.5) * 0.002,
                    meanReversion: 0.2 + Math.random() * 0.3,
                    lastChange: 0,
                    priceHistory: [],
                    eventProbability: 0.01
                };
            } else {
                if (typeof stock.randomParams.trendStrength !== 'number') stock.randomParams.trendStrength = (Math.random() - 0.5) * 0.002;
                if (typeof stock.randomParams.baseVolatility !== 'number') stock.randomParams.baseVolatility = 0.005 + Math.random() * 0.025;
                if (typeof stock.randomParams.meanReversion !== 'number') stock.randomParams.meanReversion = 0.2 + Math.random() * 0.3;
                if (typeof stock.randomParams.lastChange !== 'number') stock.randomParams.lastChange = 0;
                if (typeof stock.randomParams.eventProbability !== 'number') stock.randomParams.eventProbability = 0.01;
                if (!Array.isArray(stock.randomParams.priceHistory)) stock.randomParams.priceHistory = [];
            }
            if (!stock.priceBounds) {
                stock.priceBounds = {
                    min: Math.max(0.01, basePrice * 0.2),
                    max: Math.max(basePrice * 4, basePrice + 10),
                    support: Math.max(0.5, basePrice * 0.5),
                    resistance: Math.min(basePrice * 4, basePrice * 1.5)
                };
            }
            const params = stock.randomParams;
            const bounds = stock.priceBounds;
            // 兼容旧存档：若仍是全市场统一的 0.1/200 边界，改为按 basePrice 的区间
            if (bounds.min <= 0.15 && bounds.max >= 150) {
                bounds.min = Math.max(0.01, basePrice * 0.2);
                bounds.max = Math.max(basePrice * 4, basePrice + 10);
                bounds.support = Math.max(0.5, basePrice * 0.5);
                bounds.resistance = Math.min(bounds.max, basePrice * 1.5);
            }
            if (typeof bounds.min !== 'number' || bounds.min <= 0) bounds.min = Math.max(0.01, basePrice * 0.2);
            if (typeof bounds.max !== 'number' || bounds.max < bounds.min) bounds.max = Math.max(basePrice * 4, bounds.min * 2);
            
            // 计算自上次更新以来的时间间隔
            const timeDiff = updateTime - lastUpdateTime;
            const timeFactor = Math.min(timeDiff / 60000, 5);
            
            // 1. 基础趋势
            const trendChange = params.trendStrength * timeFactor;
            
            // 2. 生成随机因子
            const timeBasedRand = Math.sin(updateTime * 0.0001 + index) * 0.5 + 0.5;
            const normalRand = (Math.random() + Math.random() + Math.random() - 1.5) * 2;
            
            // 3. 波动率（动态调整）
            let currentVolatility = params.baseVolatility;
            
            // 价格越低，波动率相对越高
            if (stock.price < 5) {
                currentVolatility *= 1.5;
            }
            // 价格接近边界时降低波动率
            if (stock.price < bounds.min * 1.5) {
                currentVolatility *= 0.7;
            }
            if (stock.price > bounds.max * 0.8) {
                currentVolatility *= 0.7;
            }
            
            // 时间波动
            currentVolatility *= (0.9 + Math.sin(updateTime * 0.00005) * 0.2);
            
            // 4. 随机事件
            if (Math.random() < params.eventProbability * timeFactor) {
                const eventMagnitude = 1 + Math.random() * 3;
                currentVolatility *= eventMagnitude;
            }
            
            // 5. 均值回归（使用前面已算好的 basePrice）
            const deviationFromMean = (stock.price - basePrice) / basePrice;
            let reversionForce = -deviationFromMean * params.meanReversion * 0.003 * timeFactor;
            
            // 6. 边界效应（更平滑的处理）
            const distanceToMin = (stock.price - bounds.min) / bounds.min;
            const distanceToMax = (bounds.max - stock.price) / bounds.max;
            
            // 接近下限时增加反弹概率
            if (distanceToMin < 0.5) {
                const bounceProbability = 1 - (distanceToMin * 2);
                if (Math.random() < bounceProbability * 0.1) {
                    reversionForce += Math.abs(reversionForce) * 0.5;
                }
            }
            
            // 接近上限时增加回调概率
            if (distanceToMax < 0.5) {
                const pullbackProbability = 1 - (distanceToMax * 2);
                if (Math.random() < pullbackProbability * 0.1) {
                    reversionForce -= Math.abs(reversionForce) * 0.5;
                }
            }
            
            // 7. 动量效应
            const momentumEffect = params.lastChange * 0.15;
            
            // 8. 计算价格变化
            const modelIndex = minutesSinceStart % 6;
            let priceChange = 0;
            
            switch (modelIndex) {
                case 0:
                    priceChange = normalRand * currentVolatility * timeFactor;
                    break;
                case 1:
                    priceChange = (normalRand * currentVolatility + momentumEffect) * timeFactor;
                    break;
                case 2:
                    priceChange = (normalRand * currentVolatility * 0.7 + reversionForce) * timeFactor;
                    break;
                case 3:
                    priceChange = normalRand * currentVolatility * 1.5 * timeFactor;
                    break;
                case 4:
                    priceChange = normalRand * currentVolatility * 0.5 * timeFactor;
                    break;
                default:
                    priceChange = (normalRand + timeBasedRand - 0.5) * currentVolatility * timeFactor;
            }
            
            // 添加趋势和市场情绪
            priceChange += trendChange;
            priceChange += currentMarketMood * 0.002 * timeFactor;
            
            // 市场事件影响
            if (marketEffect !== 0) {
                const stockSensitivity = 0.5 + Math.random() * 0.5;
                priceChange += marketEffect * stockSensitivity;
            }
            
            // 板块效应
            if (index % 3 === minutesSinceStart % 3) {
                priceChange += (Math.random() - 0.5) * 0.002;
            }
            if (!Number.isFinite(priceChange)) priceChange = 0;
            
            // 记录历史变化（只存2位小数）
            params.lastChange = priceChange;
            params.priceHistory = params.priceHistory || [];
            params.priceHistory.push(roundInvestmentPrice(stock.price));
            if (params.priceHistory.length > 100) {
                params.priceHistory.shift();
            }
            
            // 应用价格变化（修复版）
            const oldPrice = stock.price;
            
            // 计算新价格
            let newPrice = stock.price * (1 + priceChange);
            
            // 触底处理：仅约 35% 概率小幅反弹，多数时候在底线附近震荡，避免“抄最低价必涨”
            if (newPrice < bounds.min) {
                if (Math.random() < 0.35) {
                    const bounceStrength = 0.02 + Math.random() * 0.05;
                    newPrice = stock.price * (1 + bounceStrength);
                } else {
                    // 65% 概率压在底线附近（92%～100% min），可继续横盘或微跌
                    newPrice = bounds.min * (0.92 + Math.random() * 0.08);
                }
            }
            
            if (newPrice > bounds.max) {
                // 触顶时约一半概率回调
                if (Math.random() < 0.5) {
                    const pullbackStrength = 0.05 + Math.random() * 0.1;
                    newPrice = stock.price * (1 - pullbackStrength);
                } else {
                    newPrice = Math.min(bounds.max * 1.05, newPrice);
                }
            }
            
            // 防止价格停滞
            if (Number.isFinite(newPrice) && Math.abs(newPrice - oldPrice) < 0.001) {
                const microChange = (Math.random() - 0.5) * 0.005;
                newPrice = stock.price * (1 + microChange);
            }
            if (!Number.isFinite(priceChange)) priceChange = 0;
            
            // 只接受有效正数，避免新号或异常时把 NaN 写入 stock.price；存档只保留2位小数
            stock.price = roundInvestmentPrice((Number.isFinite(newPrice) && newPrice > 0) ? newPrice : oldPrice);
            
            // 更新涨跌幅（安全计算，避免 NaN）
            stock.change = safeChangePercent(stock.price, basePrice);
            
            // 记录最高/最低价
            if (!stock.highestPrice || stock.price > stock.highestPrice) {
                stock.highestPrice = roundInvestmentPrice(stock.price);
            }
            if (!stock.lowestPrice || stock.price < stock.lowestPrice) {
                stock.lowestPrice = roundInvestmentPrice(stock.price);
            }
            
            // 动态调整阻力位和支撑位
            const avgPrice = params.priceHistory.length > 0 ?
                params.priceHistory.reduce((a, b) => a + b, 0) / params.priceHistory.length :
                basePrice;
            
            stock.priceBounds.support = roundInvestmentPrice(Math.max(bounds.min, avgPrice * 0.7));
            stock.priceBounds.resistance = roundInvestmentPrice(Math.min(bounds.max, avgPrice * 1.3));
              params.priceHistory = params.priceHistory || [];
params.priceHistory.push(roundInvestmentPrice(stock.price));

// 只保留最近50个价格记录
if (params.priceHistory.length > 50) {
    params.priceHistory.shift();
}

// 同时更新stock对象的价格历史
stock.priceHistory = stock.priceHistory || [];
stock.priceHistory.push(roundInvestmentPrice(stock.price));
if (stock.priceHistory.length > 50) {
    stock.priceHistory.shift();
}
if (stock._changeCache) {
    delete stock._changeCache;
}
        });

        // 更新最后更新时间
        lastUpdateTime = updateTime;
        
        // 如果游戏界面打开，先按新股价重算总资产再更新显示，避免总资产变 NaN
        if (document.getElementById('investmentGameUI')?.style.display === 'block') {
            updateInvestmentTotalAssets();
            updateInvestmentStockDisplay();
            updateInvestmentTradeInfo();
            updateInvestmentHoldingsInfo();
            updateInvestmentAssetsDisplay();
            
            const timeElement = document.getElementById('update-time');
            if (timeElement) {
                timeElement.textContent = `股价更新时间：${new Date().toLocaleTimeString()}`;
            }
        }
        
        // 每5分钟记录一次日志
        if (minutesSinceStart % 5 === 0) {
            const avgChange = game.stocks.reduce((sum, s) => sum + (Number.isFinite(s.change) ? s.change : 0), 0) / game.stocks.length;
            console.log(`实时模拟: 平均涨跌幅 ${Number.isFinite(avgChange) ? avgChange.toFixed(2) : '0.00'}%, 市场情绪: ${currentMarketMood.toFixed(2)}`);
        }
        
    }, 60000); // 每分钟更新一次
    
    // 图表更新频率更快
    game.chartUpdateTimer = registerInterval(() => {
        if (document.getElementById('investmentGameUI')?.style.display === 'block') {
            updateInvestmentStockDisplay();
            updateInvestmentChartFromCache(100);
        }
        if (typeof cleanInvestmentChartCache === 'function') cleanInvestmentChartCache();
    }, 15000);
    
    logAction('股票价格实时模拟已启动', 'system');
}

// 模拟投资：价格只保留小数点后3位，避免存档中价格走势图数据过长
function roundInvestmentPrice(v) {
    var n = Number(v);
    return Number.isFinite(n) ? Math.round(n * 1000) / 1000 : (typeof v === 'number' ? v : 0);
}
function roundInvestmentHoldings(val) {
    const stored = bigSciToStorageValue(parseBigSci(val));
    const n = Number(stored);
    if (Number.isFinite(n) && Math.abs(n) < 1e15) return Math.round(n * 1e12) / 1e12;
    return stored;
}
function sanitizeInvestmentStockHoldings(stock) {
    if (!stock) return 0;
    let h = roundInvestmentHoldings(stock.holdings || 0);
    if (typeof h === 'number' && (!Number.isFinite(h) || h < 0)) h = 0;
    if (cmpBigSci(h, 0) < 0) h = 0;
    if (cmpBigSci(h, 0) > 0 && cmpBigSci(h, INVESTMENT_HOLDINGS_DUST) <= 0) h = 0;
    stock.holdings = bigSciToStorageValue(h);
    if (cmpBigSci(stock.holdings, 0) === 0) stock.costPrice = 0;
    return stock.holdings;
}
function sanitizeAllInvestmentHoldings(game) {
    if (!game || !Array.isArray(game.stocks)) return;
    game.stocks.forEach(sanitizeInvestmentStockHoldings);
}
function investmentClampSellQuantity(requestedQty, holdings) {
    const req = parseBigSci(requestedQty);
    const hold = parseBigSci(holdings);
    if (cmpBigSci(req, 0) <= 0) return bigSciToStorageValue(req);
    if (cmpBigSci(hold, 0) <= 0) return 0;
    if (cmpBigSci(req, hold) <= 0) return bigSciToStorageValue(req);
    const over = subBigSci(req, hold);
    if (cmpBigSci(over, INVESTMENT_HOLDINGS_DUST) <= 0) return bigSciToStorageValue(hold);
    return null;
}
function normalizeInvestmentGamePrices() {
    try {
        if (!player || !player.investmentGame || !Array.isArray(player.investmentGame.stocks)) return;
        player.investmentGame.stocks.forEach(function(stock) {
            if (!stock || typeof stock !== 'object') return;
            stock.price = roundInvestmentPrice(stock.price);
            if (stock.basePrice != null) stock.basePrice = roundInvestmentPrice(stock.basePrice);
            if (stock.highestPrice != null) stock.highestPrice = roundInvestmentPrice(stock.highestPrice);
            if (stock.lowestPrice != null) stock.lowestPrice = roundInvestmentPrice(stock.lowestPrice);
            if (stock.costPrice != null) stock.costPrice = roundInvestmentPrice(stock.costPrice);
            if (Array.isArray(stock.priceHistory)) stock.priceHistory = stock.priceHistory.map(roundInvestmentPrice);
            if (stock.randomParams && stock.randomParams !== null && Array.isArray(stock.randomParams.priceHistory)) stock.randomParams.priceHistory = stock.randomParams.priceHistory.map(roundInvestmentPrice);
            if (stock.priceBounds && typeof stock.priceBounds === 'object') {
                stock.priceBounds.min = roundInvestmentPrice(stock.priceBounds.min);
                stock.priceBounds.max = roundInvestmentPrice(stock.priceBounds.max);
                stock.priceBounds.support = roundInvestmentPrice(stock.priceBounds.support);
                stock.priceBounds.resistance = roundInvestmentPrice(stock.priceBounds.resistance);
            }
        });
        sanitizeAllInvestmentHoldings(player.investmentGame);
        // chartHistoryCache 不参与存档，加载时已清空，此处不再处理
    } catch (e) {
        console.warn('normalizeInvestmentGamePrices 执行异常，已跳过:', e);
    }
}

// 旧档/默认模板迁移：若 50 只股票全是 basePrice 10，改为 5/8/12/18/25 分档
function migrateInvestmentStocksToVariedBases() {
    const game = player.investmentGame;
    if (!game || !Array.isArray(game.stocks) || game.stocks.length !== 50) return;
    const bases = [5, 8, 12, 18, 25];
    const allSameBase = game.stocks.every(s => {
        const b = s.basePrice != null ? s.basePrice : s.price;
        return b === 10 || b == null;
    });
    if (!allSameBase) return;
    game.stocks.forEach((stock, i) => {
        const basePrice = bases[i % bases.length];
        stock.basePrice = basePrice;
        const min = Math.max(0.01, basePrice * 0.2);
        const max = Math.max(basePrice * 4, basePrice + 10);
        if (!stock.priceBounds) stock.priceBounds = {};
        stock.priceBounds.min = min;
        stock.priceBounds.max = max;
        stock.priceBounds.support = Math.max(0.5, basePrice * 0.5);
        stock.priceBounds.resistance = Math.min(max, basePrice * 1.5);
        if (stock.price < min || stock.price > max * 1.5) stock.price = basePrice;
    });
}

// 初始化投资游戏
function initInvestmentGame() {
    if (!player.investmentGame) {
        player.investmentGame = {
            stocks: (function() {
                // 50 只股票用不同 basePrice（5/8/12/18/25 五档循环），最低价分散为 1/1.6/2.4/3.6/5 等，避免全市场同一“抄底价”
                const bases = [5, 8, 12, 18, 25];
                const list = [
                {code: "zj0001", name: "鱼鱼基金", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0002", name: "闫闫基金", change: 0, holdings: 0, costPrice: 0},           
                {code: "zj0003", name: "茶茶金股", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0004", name: "麒麟企业", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0005", name: "云南白药", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0006", name: "黑三逢源", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0007", name: "乐途企业", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0008", name: "PDD企业", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0009", name: "空白控股", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0010", name: "慢手企业", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0011", name: "斗音公司", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0012", name: "阿里妈妈", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0013", name: "淘宝宝", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0014", name: "千达有限", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0015", name: "通元房产", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0016", name: "预言鱼塘", change: 0, holdings: 0, costPrice: 0},            
                {code: "zj0017", name: "新股长虹", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0018", name: "萩萩萩萩音乐", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0019", name: "盛通快递", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0020", name: "十鼎洗浴", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0021", name: "九鼎红楼", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0022", name: "星巴克", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0023", name: "大吴疆土", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0024", name: "九转仙股", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0025", name: "乌龟科技", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0026", name: "阿斯塔特", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0027", name: "万里药业", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0028", name: "万里证券", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0029", name: "顶峰相见", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0030", name: "顺封快递", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0031", name: "晋商银行", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0032", name: "爆涨房产", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0033", name: "书法银行", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0034", name: "阳城银行", change: 0, holdings: 0, costPrice: 0},            
                {code: "zj0035", name: "程羽银行", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0036", name: "中铁银行", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0037", name: "工商银行", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0038", name: "明港基金", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0039", name: "东坑企业", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0040", name: "黑龙银行", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0041", name: "韵达银行", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0042", name: "巴士企业", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0043", name: "京东公司", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0044", name: "科技企业", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0045", name: "羊同药业", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0046", name: "风雪药业", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0047", name: "霸王别姬", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0048", name: "一点点奶茶", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0049", name: "古茗奶茶", change: 0, holdings: 0, costPrice: 0},
                {code: "zj0050", name: "蜜雪冰城", change: 0, holdings: 0, costPrice: 0}
                ];
                return list.map((stock, i) => {
                const basePrice = bases[i % bases.length];
                const price = basePrice;
                return { ...stock, price: price, basePrice: basePrice };
                });
            })().map(stock => {
                // 为每只股票添加完整的初始数据
                const basePrice = stock.basePrice;
                return {
                    ...stock,
                    basePrice: basePrice,  // 基础价格
                    priceBounds: {         // 价格边界（按基础价设定，避免全市场都挤在0.1抄底）
                        min: Math.max(0.01, basePrice * 0.2),   // 最低价为 base 的 20%
                        max: Math.max(basePrice * 4, basePrice + 10), // 最高价为 base 的 4 倍
                        support: Math.max(0.5, basePrice * 0.5),
                        resistance: Math.min(basePrice * 4, basePrice * 1.5)
                    },
                    randomParams: null,    // 随机参数（运行时生成）
                    highestPrice: basePrice, // 历史最高价
                    lowestPrice: basePrice,  // 历史最低价
                    priceHistory: [],        // 价格历史记录
                    tradeHistory: []         // 交易历史记录
                };
            }),
            
            // 用户数据
            userData: {
                availableFunds: 1000.00,        // 可用资金
                totalAssets: 1000.00,           // 总资产
                holdingPercent: 0.00,           // 持仓占比
                todayProfit: 0.00,              // 今日盈亏比例
                totalProfitAmount: 0.00,        // 总盈亏金额
                totalProfitPercent: 0.00,       // 总盈亏比例
                tradeCount: 16,                 // 交易次数
                initialFunds: 1000.00,          // 初始资金
                lastUpdateTime: Date.now(),     // 最后更新时间
                totalTrades: 0,                 // 总交易次数
                totalVolume: 0,                 // 总交易量
                totalCommission: 0              // 总手续费
            },
            
            // 当前选中的股票
            currentStockIndex: 0,
            
            // 交易数据
            tradeData: {
                quantity: 0,                    // 交易数量
                type: "buy",                    // 交易类型：buy/sell
                feeRate: 0.0048                 // 手续费率 0.48%
            },
            
            // 图表缓存
            chartHistoryCache: {},
            
            // 定时器
            priceUpdateTimer: null,
            chartUpdateTimer: null,
            
            // 离线数据
            offlineData: {
                lastOfflineUpdate: Date.now()
            },
            
            // 游戏状态
            gameState: {
                startTime: Date.now(),          // 游戏开始时间
                marketMood: 0,                  // 市场情绪 (-1 到 1)
                lastMarketEvent: Date.now(),    // 上次市场事件时间
                totalMarketEvents: 0,           // 总市场事件数
                marketTrend: 0                  // 市场趋势
            },
            
            // 统计信息
            statistics: {
                totalBuyOrders: 0,              // 总买入订单
                totalSellOrders: 0,             // 总卖出订单
                totalProfit: 0,                 // 总盈利
                totalLoss: 0,                   // 总亏损
                bestTrade: {                    // 最佳交易
                    stockCode: "",
                    profit: 0,
                    date: 0
                },
                worstTrade: {                   // 最差交易
                    stockCode: "",
                    loss: 0,
                    date: 0
                }
            },
            
            // 设置选项
            settings: {
                autoUpdateChart: true,          // 自动更新图表
                showPriceBounds: true,          // 显示价格边界
                notificationEnabled: true,      // 启用通知
                chartPoints: 100,               // 图表点数
                refreshInterval: 10000          // 刷新间隔（毫秒）
            }
        };
    } else {
        // 确保现有股票数据的完整性
        player.investmentGame.stocks = player.investmentGame.stocks.map(stock => {
            // 如果股票数据不完整，补充缺失字段
            const basePrice = stock.basePrice || stock.price || 10;
            
            return {
                code: stock.code || `zj${(player.investmentGame.stocks.indexOf(stock) + 1).toString().padStart(4, '0')}`,
                name: stock.name || "未知股票",
                price: stock.price || 10.00,
                change: stock.change || 0,
                holdings: stock.holdings || 0,
                costPrice: stock.costPrice || 0,
                basePrice: basePrice,
                priceBounds: stock.priceBounds || {
                    min: 0.1,
                    max: 200,
                    support: Math.max(0.5, basePrice * 0.5),
                    resistance: Math.min(150, basePrice * 1.5)
                },
                randomParams: stock.randomParams || null,
                highestPrice: stock.highestPrice || basePrice,
                lowestPrice: stock.lowestPrice || basePrice,
                priceHistory: stock.priceHistory || [],
                tradeHistory: stock.tradeHistory || []
            };
        });
        
        // 确保用户数据完整性
        player.investmentGame.userData = {
            availableFunds: player.investmentGame.userData?.availableFunds || 1000.00,
            totalAssets: player.investmentGame.userData?.totalAssets || 1000.00,
            holdingPercent: player.investmentGame.userData?.holdingPercent || 0.00,
            todayProfit: player.investmentGame.userData?.todayProfit || 0.00,
            totalProfitAmount: player.investmentGame.userData?.totalProfitAmount || 0.00,
            totalProfitPercent: player.investmentGame.userData?.totalProfitPercent || 0.00,
            tradeCount: player.investmentGame.userData?.tradeCount || 16,
            initialFunds: player.investmentGame.userData?.initialFunds || 1000.00,
            lastUpdateTime: player.investmentGame.userData?.lastUpdateTime || Date.now(),
            totalTrades: player.investmentGame.userData?.totalTrades || 0,
            totalVolume: player.investmentGame.userData?.totalVolume || 0,
            totalCommission: player.investmentGame.userData?.totalCommission || 0
        };
        
        // 确保交易数据完整性
        player.investmentGame.tradeData = {
            quantity: player.investmentGame.tradeData?.quantity || 0,
            type: player.investmentGame.tradeData?.type || "buy",
            feeRate: player.investmentGame.tradeData?.feeRate || 0.0048
        };
        
        // 确保游戏状态完整性
        player.investmentGame.gameState = {
            startTime: player.investmentGame.gameState?.startTime || Date.now(),
            marketMood: player.investmentGame.gameState?.marketMood || 0,
            lastMarketEvent: player.investmentGame.gameState?.lastMarketEvent || Date.now(),
            totalMarketEvents: player.investmentGame.gameState?.totalMarketEvents || 0,
            marketTrend: player.investmentGame.gameState?.marketTrend || 0
        };
        
        // 确保统计信息完整性
        player.investmentGame.statistics = {
            totalBuyOrders: player.investmentGame.statistics?.totalBuyOrders || 0,
            totalSellOrders: player.investmentGame.statistics?.totalSellOrders || 0,
            totalProfit: player.investmentGame.statistics?.totalProfit || 0,
            totalLoss: player.investmentGame.statistics?.totalLoss || 0,
            bestTrade: player.investmentGame.statistics?.bestTrade || {
                stockCode: "",
                profit: 0,
                date: 0
            },
            worstTrade: player.investmentGame.statistics?.worstTrade || {
                stockCode: "",
                loss: 0,
                date: 0
            }
        };
        
        // 确保设置选项完整性
        player.investmentGame.settings = {
            autoUpdateChart: player.investmentGame.settings?.autoUpdateChart !== false,
            showPriceBounds: player.investmentGame.settings?.showPriceBounds !== false,
            notificationEnabled: player.investmentGame.settings?.notificationEnabled !== false,
            chartPoints: player.investmentGame.settings?.chartPoints || 100,
            refreshInterval: player.investmentGame.settings?.refreshInterval || 10000
        };
        
        // 确保其他数据完整性
        player.investmentGame.chartHistoryCache = player.investmentGame.chartHistoryCache || {};
        player.investmentGame.offlineData = player.investmentGame.offlineData || {
            lastOfflineUpdate: Date.now()
        };
        
        // 初始化价格边界并修复 NaN/异常价格（新号或坏档）
        player.investmentGame.stocks.forEach(stock => {
            const basePrice = Math.max(0.0001, Number(stock.basePrice) || Number(stock.price) || 10);
            if (!Number.isFinite(stock.price) || stock.price <= 0) stock.price = roundInvestmentPrice(basePrice);
            if (!stock.priceBounds) {
                stock.priceBounds = {
                    min: 0.1,
                    max: 200,
                    support: Math.max(0.5, basePrice * 0.5),
                    resistance: Math.min(150, basePrice * 1.5)
                };
            }
            if (stock.price < stock.priceBounds.min) stock.price = roundInvestmentPrice(stock.priceBounds.min * (1 + Math.random() * 0.5));
            if (stock.price > stock.priceBounds.max) stock.price = roundInvestmentPrice(stock.priceBounds.max * (0.8 + Math.random() * 0.2));
            stock.change = safeChangePercent(stock.price, basePrice);
        });
    }
    
    // 验证价格合理性
    validateStockPrices();
    sanitizeAllInvestmentHoldings(player.investmentGame);
    initPriceHistory();
    logAction('投资游戏数据初始化完成', 'system');
}

// 在游戏加载时初始化投资游戏数据
function initInvestmentGameOnLoad() {
    if (!player.investmentGame) {
        initInvestmentGame();
    }
}

// 在页面加载时调用
window.addEventListener('load', function() {
    // 确保在游戏加载后初始化投资游戏
    if (player) {
        initInvestmentGameOnLoad();
    }
});

// 在游戏保存时包含投资游戏数据
function saveInvestmentGameData() {
    // 投资游戏数据已经包含在player对象中
    // 保存时会自动保存
}

// 在游戏加载时恢复投资游戏数据
// 读档或打开前修复所有股票的 price/change 为有效数，避免 NaN 导致坏档或界面异常
function repairInvestmentGameStockChanges() {
    const game = player.investmentGame;
    if (!game || !Array.isArray(game.stocks)) return;
    game.stocks.forEach(stock => {
        const base = Math.max(0.0001, Number(stock.basePrice) || Number(stock.price) || 10);
        if (!Number.isFinite(stock.price) || stock.price <= 0) stock.price = roundInvestmentPrice(base);
        if (stock.change != null && !Number.isFinite(stock.change)) stock.change = safeChangePercent(stock.price, base);
    });
    sanitizeAllInvestmentHoldings(game);
}
function loadInvestmentGameData() {
    if (player.investmentGame) {
        repairInvestmentGameStockChanges();
        if (document.getElementById('investmentGameUI') && document.getElementById('investmentGameUI').style.display === 'block') {
            startPriceSimulation();
        }
    }
}
  // 房屋配置
        const houseTypes = [
            { id: 1, name: "茅草屋", rarity: 1, baseCost: 10000, income: 10, description: "简陋的茅草屋，提供基本住所" },
            { id: 2, name: "木屋", rarity: 2, baseCost: 50000, income: 50, description: "简单的木屋，比茅草屋舒适" },
            { id: 3, name: "石屋", rarity: 3, baseCost: 100000, income: 100, description: "坚固的石屋，能抵御风雨" },
            { id: 4, name: "砖房", rarity: 4, baseCost: 500000, income: 500, description: "砖砌房屋，更加耐用" },
            { id: 5, name: "别墅", rarity: 5, baseCost: 1000000, income: 1000, description: "豪华别墅，舒适宜居" },
            { id: 6, name: "庄园", rarity: 6, baseCost: 5000000, income: 5000, description: "广阔庄园，带有花园" },
            { id: 7, name: "城堡", rarity: 7, baseCost: 10000000, income: 10000, description: "宏伟城堡，彰显地位" },
            { id: 8, name: "宫殿", rarity: 8, baseCost: 50000000, income: 50000, description: "皇家宫殿，极尽奢华" },
            { id: 9, name: "天空之城", rarity: 9, baseCost: 100000000, income: 100000, description: "悬浮在空中的神奇城市" },
            { id: 10, name: "海底宫殿", rarity: 10, baseCost: 500000000, income: 500000, description: "深海中的神秘宫殿" },
            { id: 11, name: "星际堡垒", rarity: 11, baseCost: 1000000000, income: 1000000, description: "跨越星际的军事堡垒" },
            { id: 12, name: "时间之屋", rarity: 12, baseCost: 5000000000, income: 5000000, description: "能操控时间的奇异房屋" },
            { id: 13, name: "维度别墅", rarity: 13, baseCost: 10000000000, income: 10000000, description: "存在于多个维度的别墅" },
            { id: 14, name: "创世神殿", rarity: 14, baseCost: 50000000000, income: 50000000, description: "创世神居住的神圣殿堂" },
            { id: 15, name: "永恒居所", rarity: 15, baseCost: 100000000000, income: 100000000, description: "超越时间与空间的永恒住所" },
            { id: 16, name: "宇宙宫殿", rarity: 16, baseCost: 1000000000000, income: 250000000, description: "连接多个宇宙的神秘圣殿" },
            { id: 17, name: "星系府邸", rarity: 17, baseCost: 10000000000000, income: 500000000, description: "统领整个星系的宏伟宫殿" },
            { id: 18, name: "无限领域", rarity: 18, baseCost: 100000000000000, income: 750000000, description: "涵盖无限可能性的领域" },
            { id: 19, name: "终极天堂", rarity: 19, baseCost: 1000000000000000, income: 1000000000, description: "超越一切存在的终极居所" },
            { id: 20, name: "起源圣所", rarity: 20, baseCost: 10000000000000000, income: 1250000000, description: "宇宙基本法则的具现化殿堂" },
            { id: 21, name: "法则圣殿", rarity: 21, baseCost: 100000000000000000, income: 1500000000, description: "涵盖无限可能性的领域" },   
            { id: 22, name: "概念之居", rarity: 22, baseCost: 1000000000000000000, income: 1750000000, description: "超越现实与想象的概念住所" },
            { id: 23, name: "真理圣域", rarity: 23, baseCost: 10000000000000000000, income: 2000000000, description: "容纳宇宙终极真理的绝对领域" },
            { id: 24, name: "存在之源", rarity: 24, baseCost: 100000000000000000000, income: 5000000000, description: "一切存在与非存在的最终源头" }          
        ];

        function getHouseOwnedCount() {
            return (player.houses && player.houses.ownedHouses) ? player.houses.ownedHouses.length : 0;
        }
        function getHouseOwnedFreeSlots() {
            return Math.max(0, SECONDARY_INVENTORY_MAX - getHouseOwnedCount());
        }
        function trimHouseOwnedOverCap() {
            if (!player.houses || !player.houses.ownedHouses) return 0;
            var trimmed = 0, totalValue = 0;
            while (getHouseOwnedCount() > SECONDARY_INVENTORY_MAX) {
                var sorted = player.houses.ownedHouses.slice().sort(function (a, b) {
                    return (a.rarity || 0) - (b.rarity || 0);
                });
                var target = null, idx = -1;
                for (var i = 0; i < sorted.length; i++) {
                    if (sorted[i].locked) continue;
                    target = sorted[i];
                    idx = player.houses.ownedHouses.findIndex(function (h) { return h.id === target.id; });
                    break;
                }
                if (idx < 0) break;
                totalValue += (target.rarity || 0) * 5000;
                player.houses.ownedHouses.splice(idx, 1);
                trimmed++;
            }
            if (trimmed > 0 && player.investmentGame && player.investmentGame.userData) {
                player.investmentGame.userData.availableFunds = (player.investmentGame.userData.availableFunds || 0) + totalValue;
                logAction('房屋库超限，自动分解 ' + trimmed + ' 间低稀有度房屋', 'info');
            }
            return trimmed;
        }
        function updateHouseOwnedCountDisplay() {
            var el = document.getElementById('houseOwnedCountDisplay');
            if (el) el.textContent = getHouseOwnedCount() + '/' + SECONDARY_INVENTORY_MAX;
        }
        function tryPushOwnedHouse(house) {
            if (!house || getHouseOwnedFreeSlots() <= 0) return false;
            if (!player.houses) initHouseData();
            player.houses.ownedHouses.push(house);
            trimHouseOwnedOverCap();
            return true;
        }
        function syncHouseOwnedCaps() {
            if (!player.houses) return;
            initHouseData();
            trimHouseOwnedOverCap();
        }
        window.syncHouseOwnedCaps = syncHouseOwnedCaps;

        // 初始化房屋系统数据
        function initHouseData() {
            if (!player.houses) {
                player.houses = {
                    level: 1,
                    exp: 0,
                    maxHouses: 5,
                    ownedHouses: [],
                    rentedHouses: [],
                    lastUpdate: Date.now(),
                    totalIncome: 0
                };
            }
        }

        // 切换房屋系统界面
        function toggleHouseSystem() {
            if (player.reincarnationCount < 200) {
                alert("需要达到200转才能开启房屋系统！");
                return;
            }
            
            const ui = document.getElementById('houseSystemUI');
            const overlay = document.getElementById('houseSystemOverlay');
            
            if (ui.style.display === 'block') {
                ui.style.display = 'none';
                overlay.style.display = 'none';
            } else {
                syncHouseOwnedCaps();
                ui.style.display = 'block';
                overlay.style.display = 'block';
                updateHouseUI();
            }
        }

        function closeHouseSystem() {
            document.getElementById('houseSystemUI').style.display = 'none';
            document.getElementById('houseSystemOverlay').style.display = 'none';
        }

        // 更新房屋界面
        function updateHouseUI() {
            // 更新基本信息
            document.getElementById('houseLevel').textContent = player.houses.level;
            document.getElementById('houseCount').textContent = player.houses.rentedHouses.length;
            document.getElementById('maxHouses').textContent = player.houses.maxHouses;
            document.getElementById('houseExp').textContent = player.houses.exp.toFixed(1);
            document.getElementById('houseExpNext').textContent = getNextHouseLevelExp();
            document.getElementById('totalHouseIncome').textContent = player.houses.totalIncome.toExponential(1);
            document.getElementById('totalHouseIncoma').textContent = player.investmentGame.userData.availableFunds.toFixed(0);
            // 更新房屋商店
            updateHouseStore();
            
            // 更新房屋列表
            updateHouseList();
            
            // 更新房屋槽位显示
            updateHouseSlots();
            
            // 更新分解界面
            updateDecomposeHouseUI();
            updateHouseOwnedCountDisplay();
        }

        // 获取下一级所需经验
        function getNextHouseLevelExp() {
            const expRequirements = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1000000000, 5000000000, 10000000000, 50000000000, 100000000000, 1000000000000000000];
            const currentLevel = Math.min(player.houses.level, expRequirements.length);
            return expRequirements[currentLevel - 1] || expRequirements[expRequirements.length - 1];
        }

        // 更新房屋商店
        function updateHouseStore() {
            const container = document.getElementById('houseStore');
            container.innerHTML = '';
            
            houseTypes.forEach(houseType => {
                const houseCard = document.createElement('div');
                houseCard.className = `house-card house-${getHouseRarityClass(houseType.rarity)}`;
                
                houseCard.innerHTML = `
                    <div style="font-weight: bold;">${houseType.name}</div>
                    <div style="font-size: 0.8em; margin: 5px 0;">${houseType.description}</div>
                    <div style="font-size: 0.8em;">稀有度: ${houseType.rarity}</div>
                    <div style="font-size: 0.8em; color: #FFD700;">收益: ${houseType.income.toExponential(0)}/小时</div>
                    <div style="font-size: 0.8em; color: #32CD32;">价格: ${houseType.baseCost.toExponential(0)} 资金</div>
                    <button onclick="buyHouse(${houseType.id})" style="margin-top: 10px; background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; width: 100%;">购买</button>
                `;
                
                container.appendChild(houseCard);
            });
        }

        // 根据稀有度获取CSS类名
        function getHouseRarityClass(rarity) {
            if (rarity <= 3) return 'common';
            if (rarity <= 6) return 'rare';
            if (rarity <= 9) return 'epic';
            if (rarity <= 12) return 'legendary';
            return 'mythic';
        }

        // 购买房屋
        function buyHouse(houseId) {
            const houseType = houseTypes.find(h => h.id === houseId);
            
            if (!houseType) {
                logAction("无效的房屋类型", "error");
                return;
            }
            
            if (player.investmentGame.userData.availableFunds < houseType.baseCost) {
                logAction(`资金不足！需要 ${houseType.baseCost.toLocaleString()} 资金`, "error");
                return;
            }
            if (getHouseOwnedFreeSlots() <= 0) {
                logAction('房屋库已满（' + SECONDARY_INVENTORY_MAX + '），请先分解或出租', 'error');
                return;
            }
            
            // 扣除转生币
            player.investmentGame.userData.availableFunds -= houseType.baseCost;
            
            // 创建房屋实例
            const newHouse = {
                id: 'house_' + Date.now(),
                type: houseType.id,
                name: houseType.name,
                rarity: houseType.rarity,
                baseIncome: houseType.income,
                rentTime: 0,
                isRented: false
            };
            
            if (!tryPushOwnedHouse(newHouse)) {
                player.investmentGame.userData.availableFunds += houseType.baseCost;
                logAction('房屋库已满（' + SECONDARY_INVENTORY_MAX + '）', 'error');
                return;
            }
            
            logAction(`成功购买了 ${houseType.name}！`, "success");
            updateHouseUI();
            updateDisplay();
            saveGame();
        }

        // 更新房屋列表
        function updateHouseList() {
            const container = document.getElementById('houseList');
            container.innerHTML = '';
            
            if (player.houses.ownedHouses.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">尚未购买任何房屋</div>';
                return;
            }
            
            player.houses.ownedHouses.forEach((house, index) => {
                const houseCard = document.createElement('div');
                houseCard.className = `house-card house-${getHouseRarityClass(house.rarity)}`;
                houseCard.style.cursor = 'pointer';
                houseCard.dataset.index = index;
                
                houseCard.innerHTML = `
                    <div style="font-weight: bold;">${house.name}</div>
                    <div style="font-size: 0.8em; margin: 5px 0;">稀有度: ${house.rarity}</div>
                    <div style="font-size: 0.8em; color: #FFD700;">收益: ${house.baseIncome}/小时</div>
                    <div style="font-size: 0.8em; color: ${house.isRented ? '#4CAF50' : '#f44336'};">${house.isRented ? '已出租' : '未出租'}</div>
                `;
                
                // 点击房屋进行出租操作
                houseCard.onclick = function() {
                    rentHouse(index);
                };
                
                container.appendChild(houseCard);
            });
        }

        // 出租房屋
        function rentHouse(houseIndex) {
            // 检查是否有空闲房屋槽位
            if (player.houses.rentedHouses.length >= player.houses.maxHouses) {
                logAction("没有空闲房屋槽位了！", "error");
                return;
            }
            
            const house = player.houses.ownedHouses[houseIndex];
            
            // 将房屋移动到出租列表
            player.houses.rentedHouses.push({
                ...house,
                rentTime: Date.now(),
                isRented: true
            });
            
            // 从拥有列表中移除
            player.houses.ownedHouses.splice(houseIndex, 1);
            
            logAction(`已将 ${house.name} 出租`, "success");
            updateHouseUI();
            saveGame();
        }

        // 更新房屋槽位显示
        function updateHouseSlots() {
            const container = document.getElementById('houseSlotsContainer');
            container.innerHTML = '';
            
            // 创建房屋槽位卡片
            for (let i = 0; i < player.houses.maxHouses; i++) {
                const slotCard = document.createElement('div');
                slotCard.className = 'house-slot';
                slotCard.style.border = '1px solid #ddd';
                slotCard.style.padding = '10px';
                slotCard.style.borderRadius = '5px';
                slotCard.style.textAlign = 'center';
                
                if (i < player.houses.rentedHouses.length) {
                    const house = player.houses.rentedHouses[i];
                    slotCard.innerHTML = `
                        <div style="font-weight: bold;">${house.name}</div>
                        <div>收益: ${calculateHouseIncome(house)} 资金</div>
                        <div>经验: ${calculateHouseIncome(house) / 1000} 经验值</div>
                        <button onclick="stopRentingHouse(${i})" style="margin-top: 10px; background: #ff9800; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">停止出租</button>
                    `;
                } else {
                    slotCard.innerHTML = '<div>空闲房屋槽位</div>';
                }
                
                container.appendChild(slotCard);
            }
        }

        // 计算房屋收益
        function calculateHouseIncome(house) {
            // 收益 = 房屋基础收益 * 出租时间(小时)
            const hoursRented = (Date.now() - house.rentTime) / (1000 * 60 * 60);
            return Math.floor(house.baseIncome * hoursRented);
        }

        // 停止出租房屋
        function stopRentingHouse(slotIndex) {
            if (slotIndex >= player.houses.rentedHouses.length) return;
            
            // 获取房屋信息
            const house = player.houses.rentedHouses[slotIndex];
            
            var returnedHouse = Object.assign({}, house, { isRented: false });
            if (!tryPushOwnedHouse(returnedHouse)) {
                logAction('房屋库已满（' + SECONDARY_INVENTORY_MAX + '），无法收回', 'error');
                return;
            }
            
            // 从出租列表移除
            player.houses.rentedHouses.splice(slotIndex, 1);
            
            // 计算并收取收益
            const income = calculateHouseIncome(house);
            player.investmentGame.userData.availableFunds += income;
            player.houses.totalIncome += income;
            player.houses.exp += income / 1000;
            
            logAction(`停止出租: ${house.name}, 获得收益 ${income} 资金`, 'success');
            updateHouseUI();
            updateDisplay();
            saveGame();
        }

        // 一键出租
        function rentAllHouses() {
            // 计算可出租数量
            const availableSlots = player.houses.maxHouses - player.houses.rentedHouses.length;
            const housesToRent = Math.min(availableSlots, player.houses.ownedHouses.length);
            
            if (housesToRent === 0) {
                logAction("没有可出租的房屋或没有空闲槽位", "info");
                return;
            }
            
            // 出租操作
            for (let i = 0; i < housesToRent; i++) {
                const house = player.houses.ownedHouses[0];
                player.houses.rentedHouses.push({
                    ...house,
                    rentTime: Date.now(),
                    isRented: true
                });
                player.houses.ownedHouses.shift();
            }
            
            logAction(`已自动出租 ${housesToRent} 间房屋`, "success");
            updateHouseUI();
            saveGame();
        }

        // 收取所有房屋收益
        function collectAllHouseIncome() {
            let totalIncome = 0;
            
            player.houses.rentedHouses.forEach(house => {
                const income = calculateHouseIncome(house);
                totalIncome += income;
                
                // 添加房屋经验
                player.houses.exp += income / 1000;
                
                // 重置出租时间
                house.rentTime = Date.now();
            });
            
            // 添加收益
            player.investmentGame.userData.availableFunds += totalIncome;
            player.houses.totalIncome += totalIncome;
            
            logAction(`收取了所有房屋收益: ${totalIncome} 资金`, "success");
            updateHouseUI();
            updateDisplay();
            saveGame();
        }

        // 房屋分解功能
        function updateDecomposeHouseUI() {
            const container = document.getElementById('decomposeHouseContainer');
            container.innerHTML = '';
            
            if (player.houses.ownedHouses.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">没有可分解的房屋</div>';
                return;
            }
            
            // 添加拥有的房屋
            player.houses.ownedHouses.forEach((house, index) => {
                const houseDiv = document.createElement('div');
                houseDiv.className = `decompose-house-item house-${getHouseRarityClass(house.rarity)}`;
                houseDiv.style.display = 'flex';
                houseDiv.style.alignItems = 'center';
                houseDiv.style.justifyContent = 'space-between';
                houseDiv.style.marginBottom = '10px';
                houseDiv.style.padding = '10px';
                houseDiv.style.background = '#444';
                houseDiv.style.borderRadius = '5px';
                
                const decomposeValue = house.rarity * 5000;
                
                houseDiv.innerHTML = `
                    <div style="display: flex; align-items: center; flex: 1;">
                        <input type="checkbox" id="houseCheckbox${index}" 
                               style="margin-right: 10px; width: 16px; height: 16px;">
                        <div style="flex: 1;">
                            <div style="font-weight: bold; font-size: 14px;">
                                ${house.name}
                            </div>
                            <div style="font-size: 12px; color: #ccc;">
                                稀有度: ${house.rarity}
                            </div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 12px; color: #FFD700;">
                            价值: ${decomposeValue.toLocaleString()}
                        </div>
                        <div style="font-size: 10px; color: #888;">
                            资金
                        </div>
                    </div>
                `;
                
                container.appendChild(houseDiv);
            });
        }

        // 按稀有度批量选择房屋
        function selectHousesByRarity(maxRarity) {
            player.houses.ownedHouses.forEach((house, index) => {
                const checkbox = document.getElementById(`houseCheckbox${index}`);
                if (checkbox) {
                    checkbox.checked = house.rarity <= maxRarity;
                }
            });
            logAction(`已选择稀有度${maxRarity}及以下的房屋`, "info");
        }

        // 全选房屋
        function selectAllHouses() {
            player.houses.ownedHouses.forEach((house, index) => {
                const checkbox = document.getElementById(`houseCheckbox${index}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
            logAction("已选择所有房屋", "info");
        }

        // 取消全选
        function deselectAllHouses() {
            player.houses.ownedHouses.forEach((house, index) => {
                const checkbox = document.getElementById(`houseCheckbox${index}`);
                if (checkbox) {
                    checkbox.checked = false;
                }
            });
            logAction("已取消选择所有房屋", "info");
        }

        // 分解选中房屋
        function decomposeSelectedHouse() {
            const housesToDecompose = [];
            
            // 收集选中的房屋
            player.houses.ownedHouses.forEach((house, index) => {
                const checkbox = document.getElementById(`houseCheckbox${index}`);
                if (checkbox && checkbox.checked) {
                    housesToDecompose.push({
                        index,
                        house
                    });
                }
            });
            
            if (housesToDecompose.length === 0) {
                logAction("请选择要分解的房屋", "error");
                return;
            }
            
            // 计算总收益和显示信息
            let totalValue = 0;
            let houseList = "";
            
            housesToDecompose.forEach(item => {
                totalValue += item.house.rarity * 5000;
                houseList += `\n${item.house.name} (稀有度${item.house.rarity})`;
            });
            
            // 显示确认对话框
            showCustomConfirm(`确定要分解以下 ${housesToDecompose.length} 间房屋吗？${houseList}\n\n总计可获得: ${totalValue.toLocaleString()} 资金`,
                (confirmed) => {
                    if (confirmed) {
                        // 从高索引到低索引删除，避免索引变化问题
                        housesToDecompose.sort((a, b) => b.index - a.index);
                        housesToDecompose.forEach(item => {
                            player.houses.ownedHouses.splice(item.index, 1);
                        });
                        
                        // 添加收益
                        player.investmentGame.userData.availableFunds += totalValue;
                        
                        logAction(`分解了 ${housesToDecompose.length} 间房屋，获得 ${totalValue.toLocaleString()} 资金`, "success");
                        updateHouseUI();
                        updateDisplay();
                        saveGame();
                    }
                }
            );
        }

        // 升级房屋系统
        function upgradeHouseSystem() {
            const requiredExp = getNextHouseLevelExp();
            
            if (player.houses.exp < requiredExp) {
                logAction(`经验不足！需要 ${requiredExp} 经验`, "error");
                return;
            }
            
            // 扣除经验
            player.houses.exp -= requiredExp;
            
            // 升级
            player.houses.level++;
            player.houses.maxHouses++;
            
            logAction(`房屋系统升级到 ${player.houses.level} 级！最大房屋槽位增加到 ${player.houses.maxHouses}`, "success");
            updateHouseUI();
            saveGame();
        }

        // 计算离线房屋收益
        function calculateOfflineHouseIncome() {
            if (!player.houses || !player.houses.rentedHouses) return;
            
            const now = Date.now();
            const elapsed = now - player.houses.lastUpdate;
            
            player.houses.rentedHouses.forEach(house => {
                const income = house.baseIncome * (elapsed / (1000 * 60 * 60)); // 每小时收益
                player.houses.totalIncome += income;
                player.houses.exp += income / 1000;
            });
            
            player.houses.lastUpdate = now;
        }

        // 在游戏加载时初始化房屋数据
        function initHouseSystemOnLoad() {
            if (!player.houses) {
                player.houses = {
                    level: 1,
                    exp: 0,
                    maxHouses: 5,
                    ownedHouses: [],
                    rentedHouses: [],
                    lastUpdate: Date.now(),
                    totalIncome: 0
                };
            } else {
                // 计算离线收益
                calculateOfflineHouseIncome();
            }
        }
 function addHouseSystemToGameLoop() {
            // 在现有的游戏循环中添加房屋收益计算（单例，避免重复注册）
            var start = (typeof registerSingletonInterval === 'function')
                ? function(fn, ms) { return registerSingletonInterval('_houseSystemLoopId', fn, ms); }
                : registerInterval;
            start(() => {
                if (player.houses && player.houses.rentedHouses.length > 0) {
                    // 每秒计算一次收益（实际收益按小时计算，这里只是累加）
                    const incomePerSecond = player.houses.rentedHouses.reduce((sum, house) => 
                        sum + house.baseIncome / 3600, 0
                    );
                    
                    player.investmentGame.userData.availableFunds += incomePerSecond;
                    player.houses.totalIncome += incomePerSecond;
                    player.houses.exp += incomePerSecond / 1000;
                    
                    // 每10秒更新一次UI（避免过于频繁的更新）
                    if (Math.floor(Date.now() / 1000) % 10 === 0) {
                        updateHouseUI();
                    }
                }
            }, 1000);
        }
function initMarriageData() {
    if (!player.marriage) {
        player.marriage = getDefaultMarriageData();
    }
    var m = player.marriage;
    if (m.lastAnniversaryClaim == null) m.lastAnniversaryClaim = 0;
    if (m.loveLettersWritten == null) m.loveLettersWritten = 0;
    if (m.coupleChallengesDone == null) m.coupleChallengesDone = 0;
    if (m.dateSpotLevel == null) m.dateSpotLevel = 0;
    if (m.vowsRenewed == null) m.vowsRenewed = 0;
    if (m.spouseWorkLastTime == null) m.spouseWorkLastTime = 0;
    if (m.syncQuizCount == null) m.syncQuizCount = 0;
    if (m.surpriseGiftCount == null) m.surpriseGiftCount = 0;
    if (m.surpriseGiftLastAttemptTime == null) m.surpriseGiftLastAttemptTime = 0;
    if (m.dailyQuestProgress == null) m.dailyQuestProgress = { day: 0, completed: 0, gifts: 0, timeSpent: 0 };
    if (m.ringLevel == null) m.ringLevel = 0;
}

function getDefaultMarriageData() {
    return {
        isMarried: false,
        spouseName: "",
        spouseGender: "female",
        marriageDate: null,
        loveLevel: 1,
        loveExp: 0,
        totalGifts: 0,
        totalTimeSpent: 0,
        totalAimeSpent: 0,
        lastAnniversaryClaim: 0,
        loveLettersWritten: 0,
        coupleChallengesDone: 0,
        dateSpotLevel: 0,
        vowsRenewed: 0,
        spouseWorkLastTime: 0,
        syncQuizCount: 0,
        surpriseGiftCount: 0,
        surpriseGiftLastAttemptTime: 0,
        dailyQuestProgress: { day: 0, completed: 0, gifts: 0, timeSpent: 0 },
        ringLevel: 0,
        marriageBonuses: { gpsMultiplier: 1.0, clickMultiplier: 1.0, critRateBonus: 0, critDamageBonus: 0, multiAttackBonus: 0 }
    };
}


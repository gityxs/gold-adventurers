// 投资股价工具
// 安全计算涨跌幅，保证返回有限数字，避免 NaN 导致界面显示异常（新号无历史时易出 NaN）
function safeChangePercent(currentPrice, basePrice) {
    const curr = Number(currentPrice);
    const base = Number(basePrice);
    if (base <= 0 || !Number.isFinite(base)) return 0;
    if (!Number.isFinite(curr)) return 0;
    const pct = ((curr - base) / base) * 100;
    return Number.isFinite(pct) ? Math.max(-999, Math.min(999, pct)) : 0;
}

// 检查并修复价格合理性
function validateStockPrices() {
    const game = player.investmentGame;
    if (!game) return;
    
    game.stocks.forEach((stock, index) => {
        const basePrice = Math.max(0.0001, Number(stock.basePrice) || Number(stock.price) || 10);
        if (!Number.isFinite(stock.price) || stock.price <= 0) stock.price = roundInvestmentPrice(basePrice);
        // 确保价格边界存在（按 basePrice 设定，避免全市场 0.1 抄底）
        if (!stock.priceBounds) {
            stock.priceBounds = {
                min: Math.max(0.01, basePrice * 0.2),
                max: Math.max(basePrice * 4, basePrice + 10),
                support: Math.max(0.5, basePrice * 0.5),
                resistance: Math.min(basePrice * 4, basePrice * 1.5)
            };
        }
        
        const bounds = stock.priceBounds;
        
        // 如果价格异常，进行修复
        if (stock.price <= 0) {
            stock.price = roundInvestmentPrice(bounds.min);
            console.warn(`修复股票 ${stock.code} 的异常价格: ${stock.price} -> ${bounds.min}`);
        }
        
        if (stock.price < bounds.min) {
            if (Math.random() < 0.5) {
                stock.price = roundInvestmentPrice(bounds.support);
            }
        }
        
        if (stock.price > bounds.max * 1.5) {
            // 价格过高时回调
            stock.price = roundInvestmentPrice(bounds.resistance);
        }
        
        // 更新涨跌幅（安全计算，避免 NaN）
        stock.change = safeChangePercent(stock.price, basePrice);
    });
}

// 在每次打开游戏界面时调用

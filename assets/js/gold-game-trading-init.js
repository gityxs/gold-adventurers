// 跑商初始化与清理
// 切换保险
function toggleInsurance(type) {
    if (!player || !player.trading) return;
    if (!player.trading.insurance) player.trading.insurance = { goods: false, transport: false, bundle: false };
    if (type === 'bundle') {
        player.trading.insurance.bundle = !player.trading.insurance.bundle;
        if (player.trading.insurance.bundle) {
            player.trading.insurance.goods = true;
            player.trading.insurance.transport = true;
            logAction("已购买综合险（货物+运输），保费合计6%", "info");
        } else {
            player.trading.insurance.goods = false;
            player.trading.insurance.transport = false;
            logAction("已取消综合险", "info");
        }
    } else {
        if (player.trading.insurance.bundle) return;
        player.trading.insurance[type] = !player.trading.insurance[type];
        const insuranceCost = type === 'goods' ? 0.05 : 0.03;
        const message = player.trading.insurance[type] ? 
            `已购买${type === 'goods' ? '货物' : '运输'}险，保费${insuranceCost * 100}%` : 
            `已取消${type === 'goods' ? '货物' : '运输'}险`;
        logAction(message, "info");
    }
    updateTradingUI();
}

// 风险偏好
function setRiskAppetite(value) {
    if (!player || !player.trading) return;
    player.trading.riskAppetite = value || 'balanced';
    var msg = value === 'steady' ? '稳健：负面事件概率-10%' : (value === 'aggressive' ? '激进：收益+5%，负面事件+5%' : '平衡');
    logAction("风险偏好已设为：" + msg, "info");
}

// 获取情报折扣（雇员 + 商人等级L3+加成）
function getIntelligenceDiscount() {
    let discount = 0;
    try {
        if (player && player.trading && player.trading.employees && player.trading.employees.length > 0) {
            player.trading.employees.forEach(emp => {
                if (emp.intelligenceDiscount) discount = Math.min(100, discount + emp.intelligenceDiscount);
            });
        }
        var ml = (player && player.trading && player.trading.merchantLevel) ? player.trading.merchantLevel : 1;
        if (ml >= 3) discount = Math.min(100, discount + 10 + Math.min(35, ml - 3));
    } catch (e) {}
    return discount;
}

// 购买情报
function buyIntelligence(city, intelligenceType) {
    const intelligenceConfig = tradingConfig.intelligence[intelligenceType];
    const listPrice = intelligenceConfig.price;
    const discount = getIntelligenceDiscount();
    const price = Math.max(1, Math.floor(listPrice * (1 - discount / 100)));
    
    if (player.nightClub.starCoins < price) {
        logAction(`星币不足！需要${price.toLocaleString()}星币购买情报`, "error");
        return;
    }
    
    player.nightClub.starCoins -= price;
    
    // 假情报率：基础25%，有商业间谍则降低（每30%折扣约降10%假情报率，最低约10%）
    const baseFakeRate = 0.25;
    const fakeRate = Math.max(0.1, baseFakeRate - (discount / 100) * 0.2);
    const isFake = Math.random() < fakeRate;
    const intelligenceData = generateIntelligenceData(city, intelligenceType, isFake);
    
    if (!player.trading.intelligence) player.trading.intelligence = {};
    if (!player.trading.intelligence[city]) player.trading.intelligence[city] = {};
    
    player.trading.intelligence[city][intelligenceType] = {
        data: intelligenceData,
        isFake: isFake,
        purchaseTime: Date.now(),
        expiryTime: Date.now() + intelligenceConfig.duration * 60 * 1000,
        price: price
    };
    
    closeIntelligencePurchaseModal();
    showIntelligenceDetails(city, intelligenceType, intelligenceData, isFake);
    logAction(`购买了${city}的${intelligenceConfig.description}，花费${price.toLocaleString()}星币${discount > 0 ? `（已享${discount}%折扣）` : ''}`, "success");
    updateTradingUI();
}
function generateIntelligenceData(city, intelligenceType, isFake) {
    const data = {};
    
    switch (intelligenceType) {
        case 'marketPrices':
            Object.keys(tradingConfig.goods).forEach(good => {
                const realPrice = player.trading.cityPrices[city][good];
                if (isFake) {
                    const fluctuation = 0.2 + Math.random() * 0.3;
                    const direction = Math.random() > 0.5 ? 1 : -1;
                    data[good] = Math.max(1, Math.round(realPrice * (1 + direction * fluctuation)));
                } else {
                    data[good] = realPrice;
                }
            });
            break;
            
        case 'supplyDemand':
            // 真实数据：根据产地/稀缺计算。产地=供应高，稀缺=需求高
            Object.keys(tradingConfig.goods).forEach(good => {
                const cfg = tradingConfig.goods[good];
                const inProduction = cfg.production && cfg.production.indexOf(city) >= 0;
                const inScarcity = cfg.scarcity && cfg.scarcity.indexOf(city) >= 0;
                if (isFake) {
                    data[good] = {
                        supply: Math.max(0, Math.min(100, 50 + Math.round((Math.random() - 0.5) * 40))),
                        demand: Math.max(0, Math.min(100, 50 + Math.round((Math.random() - 0.5) * 40)))
                    };
                } else {
                    const supply = inProduction ? 75 + Math.round(Math.random() * 20) : (inScarcity ? 25 + Math.round(Math.random() * 25) : 45 + Math.round(Math.random() * 20));
                    const demand = inScarcity ? 75 + Math.round(Math.random() * 20) : (inProduction ? 25 + Math.round(Math.random() * 25) : 45 + Math.round(Math.random() * 20));
                    data[good] = { supply: Math.min(100, supply), demand: Math.min(100, demand) };
                }
            });
            break;
            
        case 'futureTrends':
            const trends = ['上涨', '下跌', '平稳'];
            Object.keys(tradingConfig.goods).forEach(good => {
                if (isFake) {
                    data[good] = trends[Math.floor(Math.random() * trends.length)];
                } else {
                    const currentPrice = player.trading.cityPrices[city][good];
                    const basePrice = tradingConfig.goods[good].basePrice;
                    const ratio = currentPrice / basePrice;
                    if (ratio > 1.2) data[good] = '下跌';
                    else if (ratio < 0.8) data[good] = '上涨';
                    else data[good] = '平稳';
                }
            });
            break;
            
        case 'specialEvents':
            const events = [
                "商会促销活动", "货物运输延误", "市场需求激增", "供应商提价",
                "政府征税调整", "天气影响收成", "新贸易路线开通", "库存积压处理"
            ];
            if (isFake) {
                data.event = events[Math.floor(Math.random() * events.length)];
                data.impact = Math.random() > 0.5 ? "正面" : "负面";
                data.confidence = Math.round(60 + Math.random() * 35);
            } else {
                // 真实：根据当前城市是否为多商品产地/稀缺地生成描述
                const cityCfg = tradingConfig.cities[city];
                const isRemote = cityCfg && (cityCfg.region === '边陲区' || cityCfg.region === '远境' || cityCfg.region === '极远境');
                let productionCount = 0, scarcityCount = 0;
                Object.keys(tradingConfig.goods).forEach(good => {
                    const cfg = tradingConfig.goods[good];
                    if (cfg.production && cfg.production.indexOf(city) >= 0) productionCount++;
                    if (cfg.scarcity && cfg.scarcity.indexOf(city) >= 0) scarcityCount++;
                });
                if (productionCount >= 3) {
                    data.event = "本地为多处产地，供应充足";
                    data.impact = "正面";
                    data.confidence = 88;
                } else if (scarcityCount >= 3) {
                    data.event = "本地多种商品稀缺，价格偏高";
                    data.impact = "负面";
                    data.confidence = 90;
                } else if (isRemote) {
                    data.event = "远境商路稳定，适合长途贩运";
                    data.impact = "中性";
                    data.confidence = 82;
                } else {
                    data.event = "市场正常波动";
                    data.impact = "中性";
                    data.confidence = 85;
                }
            }
            break;
    }
    
    return data;
}
function showIntelligenceDetails(city, intelligenceType, intelligenceData, isFake) {
    // 创建模态框
    const modalId = 'intelligenceModal';
    const overlayId = 'intelligenceOverlay';
    
    // 移除已存在的模态框
    removeElement(modalId);
    removeElement(overlayId);
    
    // 创建覆盖层
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10050;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.style.cssText = `
        background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
        border: 2px solid #FFD700;
        border-radius: 10px;
        padding: 20px;
        width: 80%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        color: white;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        position: relative;
        z-index: 10051;
    `;
    
    // 生成情报内容
    let intelligenceContent = '';
    const intelligenceTitles = {
        'marketPrices': '市场价格情报',
        'supplyDemand': '供需情况情报',
        'futureTrends': '未来趋势预测',
        'specialEvents': '特殊事件情报'
    };
    
    // 标题
    intelligenceContent += `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #FFD700; margin: 0; border-bottom: 2px solid #444; padding-bottom: 10px;">${city} - ${intelligenceTitles[intelligenceType]}</h2>
            <div style="font-size: 0.9em; color: #aaa; margin-top: 5px;">
                获取时间: ${new Date().toLocaleString()}
            </div>
        </div>
    `;
    
    // 根据情报类型生成不同内容
    switch (intelligenceType) {
        case 'marketPrices':
            intelligenceContent += generateMarketPricesContent(intelligenceData);
            break;
        case 'supplyDemand':
            intelligenceContent += generateSupplyDemandContent(intelligenceData);
            break;
        case 'futureTrends':
            intelligenceContent += generateFutureTrendsContent(intelligenceData);
            break;
        case 'specialEvents':
            intelligenceContent += generateSpecialEventsContent(intelligenceData);
            break;
    }
    
    // 添加可信度指示器（但不透露真假）
    intelligenceContent += `
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #444;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #aaa;">情报可信度评估</span>
                <div style="display: flex; align-items: center;">
                    <div style="width: 100px; height: 6px; background: #333; border-radius: 3px; margin-right: 10px;">
                        <div style="width: ${isFake ? (70 + Math.random() * 25) : (80 + Math.random() * 15)}%; height: 100%; background: linear-gradient(90deg, #4CAF50, #8BC34A); border-radius: 3px;"></div>
                    </div>
                    <span style="color: #4CAF50; font-weight: bold;">${isFake ? '高' : '很高'}</span>
                </div>
            </div>
            <div style="font-size: 0.8em; color: #666; margin-top: 5px;">
                基于多方来源交叉验证，仅供参考
            </div>
        </div>
    `;
    
    // 添加免责声明
    intelligenceContent += `
        <div style="margin-top: 15px; padding: 10px; background: rgba(255, 215, 0, 0.1); border-radius: 5px; border-left: 3px solid #FFD700;">
            <div style="font-size: 0.8em; color: #FFD700;">
                <strong>免责声明:</strong> 市场情报基于多方来源收集，实际市场情况可能有所变化。本情报仅供参考，不构成投资建议。
            </div>
        </div>
    `;
    
    // 添加关闭按钮
    intelligenceContent += `
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="closeIntelligenceModal()" style="background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                关闭情报
            </button>
        </div>
    `;
    
    modal.innerHTML = intelligenceContent;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // 添加动画效果
    setTimeout(() => {
        modal.style.transform = 'scale(1)';
        modal.style.opacity = '1';
    }, 10);
}

// 生成市场价格情报内容（按机会排序：偏低优先，便于采购决策）
function generateMarketPricesContent(data) {
    const rows = [];
    Object.keys(data).forEach(good => {
        const price = data[good];
        const basePrice = tradingConfig.goods[good].basePrice;
        const ratio = basePrice > 0 ? price / basePrice : 1;
        let status = ratio > 1.2 ? '偏高' : (ratio < 0.8 ? '偏低' : '正常');
        let statusColor = ratio > 1.2 ? '#f44336' : (ratio < 0.8 ? '#4CAF50' : '#FFC107');
        rows.push({ good, price, ratio, status, statusColor });
    });
    rows.sort((a, b) => a.ratio - b.ratio);
    
    let content = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: #FFD700; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">商品价格信息（按性价比排序）</h3>
            <div style="max-height: 300px; overflow-y: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: rgba(255, 215, 0, 0.1);">
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #333;">商品</th>
                            <th style="padding: 8px; text-align: right; border-bottom: 1px solid #333;">价格 (星币)</th>
                            <th style="padding: 8px; text-align: center; border-bottom: 1px solid #333;">状态</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    rows.forEach(r => {
        content += `
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 8px;">${r.good}</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">${r.price.toLocaleString()}</td>
                <td style="padding: 8px; text-align: center; color: ${r.statusColor};">${r.status}</td>
            </tr>
        `;
    });
    content += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return content;
}

// 生成供需情况情报内容
function generateSupplyDemandContent(data) {
    let content = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: #FFD700; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">市场供需情况</h3>
            <div style="max-height: 300px; overflow-y: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: rgba(255, 215, 0, 0.1);">
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #333;">商品</th>
                            <th style="padding: 8px; text-align: center; border-bottom: 1px solid #333;">供应量</th>
                            <th style="padding: 8px; text-align: center; border-bottom: 1px solid #333;">需求量</th>
                            <th style="padding: 8px; text-align: center; border-bottom: 1px solid #333;">市场状况</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    Object.keys(data).forEach(good => {
        const supply = data[good].supply;
        const demand = data[good].demand;
        const balance = supply - demand;
        
        let condition = '';
        let conditionColor = '';
        
        if (balance > 20) {
            condition = '供过于求';
            conditionColor = '#f44336';
        } else if (balance < -20) {
            condition = '供不应求';
            conditionColor = '#4CAF50';
        } else {
            condition = '供需平衡';
            conditionColor = '#FFC107';
        }
        
        content += `
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 8px;">${good}</td>
                <td style="padding: 8px; text-align: center;">
                    <div style="display: inline-block; width: 50px; height: 10px; background: #333; border-radius: 5px; position: relative;">
                        <div style="width: ${supply}%; height: 100%; background: linear-gradient(90deg, #2196F3, #03A9F4); border-radius: 5px;"></div>
                    </div>
                    <span style="margin-left: 5px;">${supply}%</span>
                </td>
                <td style="padding: 8px; text-align: center;">
                    <div style="display: inline-block; width: 50px; height: 10px; background: #333; border-radius: 5px; position: relative;">
                        <div style="width: ${demand}%; height: 100%; background: linear-gradient(90deg, #E91E63, #AD1457); border-radius: 5px;"></div>
                    </div>
                    <span style="margin-left: 5px;">${demand}%</span>
                </td>
                <td style="padding: 8px; text-align: center; color: ${conditionColor}; font-weight: bold;">${condition}</td>
            </tr>
        `;
    });
    
    content += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return content;
}

// 生成未来趋势情报内容
function generateFutureTrendsContent(data) {
    let content = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: #FFD700; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">价格趋势预测</h3>
            <div style="max-height: 300px; overflow-y: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: rgba(255, 215, 0, 0.1);">
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #333;">商品</th>
                            <th style="padding: 8px; text-align: center; border-bottom: 1px solid #333;">预期趋势</th>
                            <th style="padding: 8px; text-align: center; border-bottom: 1px solid #333;">建议操作</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    Object.keys(data).forEach(good => {
        const trend = data[good];
        
        let trendColor = '';
        let suggestion = '';
        
        switch (trend) {
            case '上涨':
                trendColor = '#4CAF50';
                suggestion = '考虑买入';
                break;
            case '下跌':
                trendColor = '#f44336';
                suggestion = '考虑卖出';
                break;
            case '平稳':
                trendColor = '#FFC107';
                suggestion = '持有观望';
                break;
        }
        
        content += `
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 8px;">${good}</td>
                <td style="padding: 8px; text-align: center; color: ${trendColor}; font-weight: bold;">${trend}</td>
                <td style="padding: 8px; text-align: center;">${suggestion}</td>
            </tr>
        `;
    });
    
    content += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return content;
}

// 生成特殊事件情报内容
function generateSpecialEventsContent(data) {
    let content = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: #FFD700; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">特殊市场事件</h3>
            <div style="background: rgba(255, 215, 0, 0.1); padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <div style="font-size: 1.1em; font-weight: bold; margin-bottom: 10px;">${data.event}</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>预期影响: <strong style="color: ${data.impact === '正面' ? '#4CAF50' : data.impact === '负面' ? '#f44336' : '#FFC107'}">${data.impact}</strong></span>
                    <span>可信度: <strong>${data.confidence}%</strong></span>
                </div>
                <div style="font-size: 0.9em; color: #aaa;">
                    ${generateEventDescription(data.event, data.impact)}
                </div>
            </div>
        </div>
    `;
    
    return content;
}

// 生成事件描述
function generateEventDescription(event, impact) {
    const descriptions = {
        "商会促销活动": "本地商会即将举办大型促销活动，预计将刺激消费者需求。",
        "货物运输延误": "主要贸易路线出现运输问题，可能导致商品短缺。",
        "市场需求激增": "近期市场需求异常增长，价格可能上涨。",
        "供应商提价": "主要供应商宣布提高批发价格，成本将增加。",
        "政府征税调整": "政府计划调整贸易税率，可能影响商品价格。",
        "天气影响收成": "不利天气条件影响农作物收成，供应可能减少。",
        "新贸易路线开通": "新贸易路线即将开通，可能带来新的商机。",
        "库存积压处理": "商家处理积压库存，可能提供折扣优惠。",
        "市场正常波动": "市场处于正常波动周期，无明显特殊事件。",
        "本地为多处产地，供应充足": "该城市为多种商品产地，进货价格有优势，适合在此采购后运往稀缺地销售。",
        "本地多种商品稀缺，价格偏高": "该城市多种商品依赖外地输入，售价偏高，适合作为销售目的地而非采购地。",
        "远境商路稳定，适合长途贩运": "远境城市商路稳定，高价商品在此有产地优势，适合规划长途跑商路线。"
    };
    return descriptions[event] || "市场情报显示特殊事件可能影响贸易环境。";
}
function closeIntelligenceModal() {
    const modal = document.getElementById('intelligenceModal');
    const overlay = document.getElementById('intelligenceOverlay');
    
    if (modal) {
        modal.style.transform = 'scale(0.9)';
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

// 添加移除元素的辅助函数
function removeElement(elementId) {
    const element = document.getElementById(elementId);
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}


// 添加情报购买界面
function showIntelligencePurchaseOptions(city) {
    if (typeof initTradingConfig === 'function') initTradingConfig();
    const modalId = 'intelligencePurchaseModal';
    const overlayId = 'intelligencePurchaseOverlay';
    
    // 移除已存在的模态框
    removeElement(modalId);
    removeElement(overlayId);
    
    // 创建覆盖层
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10050;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    overlay.onclick = function(e) { if (e.target === overlay) closeIntelligencePurchaseModal(); };
    
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.style.cssText = `
        background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
        border: 2px solid #FFD700;
        border-radius: 10px;
        padding: 20px;
        width: 80%;
        max-width: 500px;
        color: white;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        position: relative;
        z-index: 10051;
    `;
    modal.onclick = function(e) { e.stopPropagation(); };
    
    // 生成情报购买选项
    modal.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #FFD700; margin: 0;">${city} - 情报购买</h2>
            <div style="font-size: 0.9em; color: #aaa; margin-top: 5px;">
                选择您需要的情报类型
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 20px;">
            ${generateIntelligenceOptions(city)}
        </div>
        
        <div style="text-align: center;">
            <button onclick="closeIntelligencePurchaseModal()" style="background: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                取消
            </button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // 添加动画效果
    setTimeout(() => {
        modal.style.transform = 'scale(1)';
        modal.style.opacity = '1';
    }, 10);
}

// 生成情报选项
function generateIntelligenceOptions(city) {
    const intelligenceTypes = tradingConfig.intelligence;
    const discount = getIntelligenceDiscount();
    let optionsHtml = '';
    
    Object.keys(intelligenceTypes).forEach(type => {
        const config = intelligenceTypes[type];
        const listPrice = config.price;
        const actualPrice = Math.max(1, Math.floor(listPrice * (1 - discount / 100)));
        const titles = {
            'marketPrices': '市场价格情报',
            'supplyDemand': '供需情况情报',
            'futureTrends': '未来趋势预测',
            'specialEvents': '特殊事件情报'
        };
        
        optionsHtml += `
            <div style="background: rgba(255,255,255,0.05); border-radius: 5px; padding: 15px; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #FFD700;" 
                 onclick="buyIntelligence('${city}', '${type}')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: bold; color: #FFD700;">${titles[type]}</div>
                        <div style="font-size: 0.9em; color: #aaa; margin-top: 5px;">${config.description}</div>
                    </div>
                    <div style="text-align: right;">
                        ${actualPrice < listPrice ? `<div style="font-size: 0.75em; color: #888; text-decoration: line-through;">${listPrice.toLocaleString()}</div>` : ''}
                        <div style="font-size: 1.2em; font-weight: bold; color: #4CAF50;">${actualPrice.toLocaleString()}</div>
                        <div style="font-size: 0.8em; color: #aaa;">星币${discount > 0 ? ' · 已享' + discount + '%折扣' : ''}</div>
                    </div>
                </div>
                <div style="margin-top: 10px; font-size: 0.8em; color: #666;">
                    有效期: ${config.duration}分钟
                </div>
            </div>
        `;
    });
    
    return optionsHtml;
}

// 关闭情报购买模态框
function closeIntelligencePurchaseModal() {
    const modal = document.getElementById('intelligencePurchaseModal');
    const overlay = document.getElementById('intelligencePurchaseOverlay');
    
    if (modal) {
        modal.style.transform = 'scale(0.9)';
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

// 检查情报过期
function checkIntelligenceExpiry() {
    const now = Date.now();
    
    if (player.trading.intelligence.advanced && player.trading.intelligence.advancedExpire < now) {
        player.trading.intelligence.advanced = false;
        logAction("高级情报已过期", "info");
    }
    
    if (player.trading.intelligence.full && player.trading.intelligence.fullExpire < now) {
        player.trading.intelligence.full = false;
        logAction("全境情报已过期", "info");
    }
}

// 每日重置
function resetDailyTrading() {
    player.trading.tradeVolumeToday = 0; // 重置为0，而不是正数
    player.trading.tradeCountToday = 0;
    
    // 支付雇员工资
    let totalSalary = 0;
    player.trading.employees.forEach(employee => {
        totalSalary += employee.salary;
    });
    
    if (totalSalary > 0) {
        if (player.nightClub.starCoins >= totalSalary) {
            player.nightClub.starCoins -= totalSalary;
            // 工资支出也减少今日利润
            player.trading.tradeVolumeToday -= totalSalary;
            logAction(`支付雇员工资${totalSalary.toLocaleString()}星币`, "info");
        } else {
            // 资金不足，解雇所有雇员
            logAction("资金不足支付工资，所有雇员已被解雇", "warning");
            player.trading.employees = [];
        }
    }
    
    // 支付运输工具维护费
    const transport = tradingConfig.transports.find(t => t.name === player.trading.transport.type);
    if (transport && transport.maintenance > 0) {
        if (player.nightClub.starCoins >= transport.maintenance) {
            player.nightClub.starCoins -= transport.maintenance;
            // 维护费支出也减少今日利润
            player.trading.tradeVolumeToday -= transport.maintenance;
            logAction(`支付${transport.name}维护费${transport.maintenance.toLocaleString()}星币`, "info");
        } else {
            // 降级到免费运输工具
            logAction("资金不足支付维护费，运输工具降级为手推车", "warning");
            player.trading.transport = {
                type: '手推车',
                capacityBonus: 5,
                speedBonus: 0
            };
        }
    }
}

// 跑商系统主循环
function tradingSystemLoop() {
    // 每小时更新一次价格
    const pricesRefreshed = updateCityPrices();
    if (pricesRefreshed) {
        var ui = document.getElementById('tradingSystemUI');
        var marketTab = document.getElementById('marketTab');
        if (ui && ui.style.display === 'block' && marketTab && marketTab.classList.contains('active') && typeof updateMarketTab === 'function') {
            updateMarketTab();
        }
    }
    
    // 检查情报过期
    checkIntelligenceExpiry();
    
    // 检查旅行状态
    if (player.trading.isTraveling) {
        checkTravelStatus();
    }
    
    // 更新自动贸易（如果启用）
    if (player.trading.autoTrade.enabled) {
        runAutoTrade();
        
        // 更新界面显示（每秒更新一次进度）
        if (Date.now() % 1000 < 50) { // 大约每秒更新一次
            updateAutoTradeTab();
        }
    }
    
    
}

function startAutoTradeSystem() {
    if (player.trading.autoTrade.enabled && !window.autoTradeInterval) {
        window.autoTradeInterval = registerInterval(() => {
            try {
                if (player.trading.autoTrade.enabled) {
                    validateAutoTradeData();
                    runAutoTrade();
                }
            } catch (error) {
                console.error("自动贸易系统错误:", error);
                handleTradingError(error, "autoTradeSystem");
            }
        }, 2000);
    }
}
function safeUpdateUI() {
    // 检查自动贸易界面是否可见
    if (isElementVisible('autoTab')) {
        updateAutoTradeTab();
    }
    
    // 检查世界地图界面是否可见
    if (isElementVisible('mapTab')) {
        updateMapTab();
    }
    
    // 检查市场界面是否可见
    if (isElementVisible('marketTab')) {
        updateMarketTab();
    }
}
// 停止自动贸易系统
function stopAutoTradeSystem() {
    if (window.autoTradeInterval) {
        clearInterval(window.autoTradeInterval);
        window.autoTradeInterval = null;
    }
}
function isElementVisible(elementId) {
    const element = document.getElementById(elementId);
    return element && element.offsetParent !== null;
}
function stopProgressUpdateTimer() {
    if (window.autoTradeProgressInterval) {
        clearInterval(window.autoTradeProgressInterval);
        window.autoTradeProgressInterval = null;
    }
}
// 初始化跑商系统
function initTradingSystem() {
    // 确保玩家数据存在
    if (!player.trading) {
        initTradingData();
    }
    
    // 启动主循环（每分钟检查一次）
    if (!window.tradingInterval) {
        window.tradingInterval = registerInterval(tradingSystemLoop, 60000);
    }
}
window.addEventListener('error', function(event) {
    console.error("全局错误:", event.error);
    // 可以在这里添加错误报告或用户通知
});

// 添加页面卸载时的清理函数
window.addEventListener('beforeunload', function() {
    // 先写入离开时间戳（跑商离线用），避免 saveGame 未执行完页面就被关闭导致离线时长为 0
    try { localStorage.setItem('goldGameLastUnload', String(Date.now())); } catch (e) {}
    // 保存游戏状态
    saveGame();
    if (typeof window.flushGoldGameCloudSaveKeepalive === 'function') window.flushGoldGameCloudSaveKeepalive();
    
    // 停止所有定时器
    try { stopProgressUpdateTimer(); stopAutoTradeSystem(); } catch (e) {}
    if (player && player.trading && player.trading.autoTrade && player.trading.autoTrade.backgroundInterval) {
        clearInterval(player.trading.autoTrade.backgroundInterval);
        player.trading.autoTrade.backgroundInterval = null;
    }
    // 统一清理所有已注册的定时器，避免页面关闭后仍运行
    try {
        if (window._gameIntervals && window._gameIntervals.length) {
            window._gameIntervals.forEach(function(id) { clearInterval(id); });
            window._gameIntervals.length = 0;
        }
    } catch (e) {}
    // 清理未纳入 _gameIntervals 的定时器，防止泄漏
    try {
        if (window.priceRefreshCountdownTimer) { clearInterval(window.priceRefreshCountdownTimer); window.priceRefreshCountdownTimer = null; }
        if (window._guildQuestCountdownTimer) { clearInterval(window._guildQuestCountdownTimer); window._guildQuestCountdownTimer = null; }
        if (window._networkMarketCountdownTimer) { clearInterval(window._networkMarketCountdownTimer); window._networkMarketCountdownTimer = null; }
        if (window._goldGameFamilyBuffTimer) { clearInterval(window._goldGameFamilyBuffTimer); window._goldGameFamilyBuffTimer = null; }
        if (window._abyssOnlineChatLoopTimer) { clearInterval(window._abyssOnlineChatLoopTimer); window._abyssOnlineChatLoopTimer = null; }
        if (window._abyssOnlineChatVisibilityTimer) { clearInterval(window._abyssOnlineChatVisibilityTimer); window._abyssOnlineChatVisibilityTimer = null; }
        if (typeof abyssTeardownUiTimers === 'function') abyssTeardownUiTimers();
        if (typeof window.stopGoldGameNetworkFloatAnnouncementLoop === 'function') window.stopGoldGameNetworkFloatAnnouncementLoop();
        if (typeof stopTreasureAutoUseLoop === 'function') stopTreasureAutoUseLoop();
        if (typeof stopTreasureAutoAttackLoop === 'function') stopTreasureAutoAttackLoop();
    } catch (e) {}
});

// 修改页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    const game = player.investmentGame;
    if (!game) return;
    
    if (document.hidden) {
        // 页面隐藏时停止定时器
        if (game.priceUpdateTimer) {
            clearInterval(game.priceUpdateTimer);
            game.priceUpdateTimer = null;
        }
        if (game.chartUpdateTimer) {
            clearInterval(game.chartUpdateTimer);
            game.chartUpdateTimer = null;
        }
    } else {
        // 页面显示时重新开始定时器
        if (document.getElementById('investmentGameUI').style.display === 'block') {
            startPriceSimulation();
        }
    }
});
function enterBackgroundMode() {
    if (!player.trading.autoTrade.enabled) return;
    
    try {
        player.trading.autoTrade.backgroundMode = true;
        player.trading.autoTrade.lastBackgroundUpdate = Date.now();
        
        // 停止前台定时器
        stopProgressUpdateTimer();
        
        // 启动后台定时器（频率较低，节省资源）
        if (!player.trading.autoTrade.backgroundInterval) {
            player.trading.autoTrade.backgroundInterval = registerInterval(() => {
                try {
                    updateBackgroundTrade();
                } catch (error) {
                    console.error("后台贸易更新错误:", error);
                    // 发生错误时停止后台定时器
                    if (player.trading.autoTrade.backgroundInterval) {
                        clearInterval(player.trading.autoTrade.backgroundInterval);
                        player.trading.autoTrade.backgroundInterval = null;
                    }
                }
            }, 10000);
        }
        
        addAutoTradeLog("自动贸易已切换到后台模式", "info");
    } catch (error) {
        console.error("进入后台模式错误:", error);
    }
}

// 退出后台模式
function exitBackgroundMode() {
    if (!player.trading.autoTrade.enabled) return;
    
    try {
        player.trading.autoTrade.backgroundMode = false;
        
        // 停止后台定时器
        if (player.trading.autoTrade.backgroundInterval) {
            clearInterval(player.trading.autoTrade.backgroundInterval);
            player.trading.autoTrade.backgroundInterval = null;
        }
        
        // 启动前台定时器
        startProgressUpdateTimer();
        
        // 更新界面
        updateAutoTradeTab();
        
        addAutoTradeLog("自动贸易已切换到前台模式", "info");
    } catch (error) {
        console.error("退出后台模式错误:", error);
    }
}
function updateBackgroundTrade() {
    if (!player.trading.autoTrade.enabled || !player.trading.autoTrade.backgroundMode) return;
    
    const now = Date.now();
    const elapsed = now - player.trading.autoTrade.lastBackgroundUpdate;
    player.trading.autoTrade.lastBackgroundUpdate = now;
    
    // 模拟时间流逝，处理后台运行
    simulateBackgroundTrade(elapsed);
}

// 模拟后台贸易
function simulateBackgroundTrade(elapsed) {
    // 验证数据
    validateAutoTradeData();
    
    // 根据时间流逝模拟贸易活动
    const timeScale = elapsed / 1000; // 转换为秒
    
    switch (player.trading.autoTrade.currentState) {
        case 'traveling':
            // 模拟旅行进度
            player.trading.autoTrade.currentProgress += elapsed;
            
            // 检查是否到达目的地
            if (player.trading.autoTrade.currentProgress >= player.trading.autoTrade.totalTravelTime) {
                completeBackgroundTravel();
            }
            break;
            
        case 'buying':
            // 模拟采购（简化处理）
            if (Math.random() < 0.3 * timeScale) { // 30%概率每秒
                simulateBackgroundPurchase();
            }
            break;
            
        case 'selling':
            // 模拟销售（简化处理）
            if (Math.random() < 0.4 * timeScale) { // 40%概率每秒
                simulateBackgroundSale();
            }
            break;
            
        default:
            // 空闲状态，尝试开始新的贸易路线
            if (Math.random() < 0.1 * timeScale) { // 10%概率每秒
                startAutoTradeRoute();
            }
    }
    
    // 保存游戏状态（后台运行期间定期保存）
    if (Math.random() < 0.05) { // 5%概率每次更新时保存
        saveGame();
    }
}
function completeBackgroundTravel() {
    // 确保目标城市有效
    if (!player.trading.travelDestination || !tradingConfig.cities[player.trading.travelDestination]) {
        logAction("后台旅行：目标城市无效，重置为默认城市", "error");
        player.trading.currentCity = '王都';
        player.trading.travelDestination = '';
        player.trading.isTraveling = false;
        return;
    }
    
    const route = player.trading.autoTrade.currentRoute;
    if (!route) return;
    
    player.trading.currentCity = player.trading.travelDestination;
    player.trading.isTraveling = false;
    player.trading.travelDestination = '';
    player.trading.autoTrade.currentProgress = 0;
    
    // 根据目的地决定下一步行动（灵活路线无 buyCity/sellCity 时用检查机会）
    if (route.buyCity && route.sellCity) {
        if (player.trading.currentCity === route.buyCity) {
            player.trading.autoTrade.currentState = 'buying';
            addAutoTradeLog(`后台运行：已到达${route.buyCity}，开始采购`, "info");
        } else if (player.trading.currentCity === route.sellCity) {
            player.trading.autoTrade.currentState = 'selling';
            addAutoTradeLog(`后台运行：已到达${route.sellCity}，开始销售`, "info");
        }
    } else if (typeof checkBothPurchaseAndSaleOpportunities === 'function') {
        checkBothPurchaseAndSaleOpportunities();
        addAutoTradeLog(`后台运行：已到达${player.trading.currentCity}，寻找贸易机会`, "info");
    }
    
    // 触发随机事件（简化版）
    if (Math.random() < 0.2) {
        triggerBackgroundRandomEvent();
    }
}
// 模拟后台采购
function simulateBackgroundPurchase() {
    const route = player.trading.autoTrade.currentRoute;
    if (!route || player.trading.autoTrade.currentState !== 'buying') return;
    
    const city = player.trading.currentCity;
    
    // 随机选择一个商品
    const availableGoods = getAvailableGoodsForPurchase(route);
    if (availableGoods.length === 0) {
        if (route.sellCity) startAutoTravel(route.sellCity);
        else if (typeof decideNextDestination === 'function') decideNextDestination();
        return;
    }
    
    const randomGood = availableGoods[Math.floor(Math.random() * availableGoods.length)];
    const routeCapital = route.tradeCapital;
    const capitalForPurchase = (routeCapital != null && routeCapital > 0) ? routeCapital : Math.max(player.nightClub.starCoins || 0, 10000);
    const quantity = typeof calculateOptimalPurchaseQuantity === 'function' ? calculateOptimalPurchaseQuantity(randomGood, capitalForPurchase) : 0;
    const unitPrice = getActualBuyPrice(city, randomGood);
    
    if (quantity > 0 && player.nightClub.starCoins >= (unitPrice || 0) * quantity) {
        buyGood(randomGood, quantity);
        addAutoTradeLog(`后台运行：购买了${quantity}个${randomGood}，花费${((unitPrice || 0) * quantity).toLocaleString()}星币`, "success");
        
        // 检查货仓使用率
        const totalCapacity = getTradingTotalCapacity();
        const maxWU = typeof getEffectiveMaxWarehouseUsage === 'function' ? getEffectiveMaxWarehouseUsage() : (player.trading.autoTrade.purchaseSettings.maxWarehouseUsage || 0.8);
        const usageRate = totalCapacity > 0 ? player.trading.warehouse.used / totalCapacity : 0;
        
        if (usageRate >= maxWU) {
            addAutoTradeLog("后台运行：货仓已满，开始前往其他城市", "info");
            if (route.sellCity) startAutoTravel(route.sellCity);
            else if (typeof decideNextDestination === 'function') decideNextDestination();
        }
    }
}

// 模拟后台销售
function simulateBackgroundSale() {
    const route = player.trading.autoTrade.currentRoute;
    if (!route || player.trading.autoTrade.currentState !== 'selling') return;
    
    const city = player.trading.currentCity;
    
    // 检查库存
    const availableGoods = getAvailableGoodsForSale(route);
    if (availableGoods.length === 0) {
        if (route.buyCity) startAutoTravel(route.buyCity);
        else if (typeof decideNextDestination === 'function') decideNextDestination();
        return;
    }
    
    const targetGood = availableGoods[0].good;
    const price = player.trading.cityPrices[city][targetGood];
    const quantity = Math.min(player.trading.inventory[targetGood].quantity, Math.floor(Math.random() * 3) + 1); // 随机销售1-3个
    
    // 模拟销售
    if (quantity > 0) {
        sellGood(targetGood, quantity);
        addAutoTradeLog(`后台运行：出售了${quantity}个${targetGood}，获得${(price * quantity).toLocaleString()}星币`, "success");
        
        // 检查是否还有库存
        if (Object.keys(player.trading.inventory).every(good => player.trading.inventory[good].quantity === 0)) {
            addAutoTradeLog("后台运行：库存已清空，前往其他城市", "info");
            if (route.buyCity) startAutoTravel(route.buyCity);
            else if (typeof decideNextDestination === 'function') decideNextDestination();
        }
    }
}

// 触发后台随机事件
function triggerBackgroundRandomEvent() {
    const events = [
        {
            type: 'priceChange',
            message: "市场价格波动",
            effect: () => {
                // 随机调整一些商品价格
                Object.keys(tradingConfig.goods).forEach(good => {
                    if (Math.random() < 0.3) {
                        const change = (Math.random() - 0.5) * 0.2; // ±10%变化
                        player.trading.cityPrices[player.trading.currentCity][good] *= (1 + change);
                    }
                });
                addAutoTradeLog("后台运行：市场价格发生波动", "info");
            }
        },
        {
            type: 'specialOffer',
            message: "特价优惠",
            effect: () => {
                // 随机选择一个商品打折
                const goods = Object.keys(tradingConfig.goods);
                const randomGood = goods[Math.floor(Math.random() * goods.length)];
                const discount = 0.1 + Math.random() * 0.2; // 10%-30%折扣
                player.trading.cityPrices[player.trading.currentCity][randomGood] *= (1 - discount);
                
                addAutoTradeLog(`后台运行：${randomGood}特价优惠，降价${(discount * 100).toFixed(0)}%`, "success");
            }
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    if (Math.random() < 0.1) { // 10%概率触发事件
        event.effect();
    }
}
function handleTradingError(error, context) {
    console.error(`自动贸易错误 (${context}):`, error);
    addAutoTradeLog(`自动贸易系统遇到问题: ${error.message}`, "error");
    
    // 尝试恢复系统
    try {
        recoverFromAutoTradeError();
        updateAutoTradeTab();
    } catch (recoveryError) {
        console.error("自动贸易恢复失败:", recoveryError);
        player.trading.autoTrade.enabled = false;
        addAutoTradeLog("自动贸易已停用，请重新设置路线", "error");
    }
}

// 在游戏加载时初始化
window.addEventListener('load', function() {
    // 延迟初始化，确保玩家数据已加载
    setTimeout(() => {
        initTradingData();
          initTradingConfig();
        // 验证自动贸易数据
        validateAutoTradeData();
        
        // 检查是否有后台运行的自动贸易
        if (player.trading.autoTrade.enabled) {
            // 自动贸易在运行，检查是否在后台模式
            if (document.hidden) {
                player.trading.autoTrade.backgroundMode = true;
            } else {
                player.trading.autoTrade.backgroundMode = false;
                startProgressUpdateTimer();
            }
            
            // 启动自动贸易系统
            startAutoTradeSystem();
        }
        
        updateAutoTradeTab();
    }, 1000);
});
function recoverFromAutoTradeError() {
    logAction("自动贸易系统遇到问题，正在尝试恢复", "warning");
    
    // 重置自动贸易状态
    player.trading.autoTrade.currentState = 'idle';
    player.trading.autoTrade.currentProgress = 0;
    
    // 验证并修复城市数据
    validateAutoTradeData();
    
    // 如果当前城市无效，设置为默认城市
    if (!validateCity(player.trading.currentCity)) {
        player.trading.currentCity = '王都';
    }
    
    // 清除无效的旅行目的地
    if (player.trading.travelDestination && !validateCity(player.trading.travelDestination)) {
        player.trading.travelDestination = '';
    }
    
    // 停止所有旅行
    player.trading.isTraveling = false;
    if (player.trading.travelInterval) {
        clearInterval(player.trading.travelInterval);
        player.trading.travelInterval = null;
    }
    
    // 尝试重新开始自动贸易
    if (player.trading.autoTrade.enabled && player.trading.autoTrade.routes.length > 0) {
        player.trading.autoTrade.currentRoute = player.trading.autoTrade.routes[0];
        startAutoTradeRoute();
    }
    
    logAction("自动贸易系统已恢复", "success");
}

// 符文属性配置
const runeAttributes = {
    types: ['critRate', 'health', 'critDamage','critRate', 'combo', 'attack', 'critRate', 'critDamage', 'combo', 'worldExp', 'combo'],
    ranges: {
        attack: { min: 0.01, max: 2.00 }, // 1% - 200%
        health: { min: 0.01, max: 2.00 },
        critDamage: { min: 0.01, max: 2.00 },
        combo: { min: 1, max: 10 }, // 1-10次连击
        critRate: { min: 0.01, max: 0.05 },
        worldExp: { min: 0.01, max: 0.20 } // 1% - 20%
    },
    names: {
        attack: '攻击加成',
        health: '生命加成',
        critDamage: '爆伤加成',
        combo: '连击次数',
        critRate: '暴击率',
        worldExp: '世界经验'
    }
};

// 材料名称映射
const materialNames = {
    gold: '金',
    wood: '木',
    water: '水',
    fire: '火',
    earth: '土',
    light: '光',
    dark: '暗',
    wind: '风',
    ice: '冰',
    electric: '电'
};


function tradingNow() {
    return (player.trading && player.trading._simulatedNow != null) ? player.trading._simulatedNow : Date.now();
}
const tradingConfig = {
    cities: {
        '绿叶镇': { region: '森林区', connections: ['林荫城', '精灵之都'], travelTime: 9 },
        '林荫城': { region: '森林区', connections: ['绿叶镇', '精灵之都', '铁石堡'], travelTime: 11 },
        '精灵之都': { region: '森林区', connections: ['绿叶镇', '林荫城', '王都'], travelTime: 14 },
        '铁石堡': { region: '山区', connections: ['林荫城', '高山城', '矿石镇'], travelTime: 10 },
        '高山城': { region: '山区', connections: ['铁石堡', '矿石镇', '金沙城'], travelTime: 12 },
        '矿石镇': { region: '山区', connections: ['铁石堡', '高山城', '平原镇'], travelTime: 11 },
        '海港城': { region: '沿海区', connections: ['渔村', '珍珠港', '贸易中心'], travelTime: 9 },
        '渔村': { region: '沿海区', connections: ['海港城', '珍珠港'], travelTime: 8 },
        '珍珠港': { region: '沿海区', connections: ['海港城', '渔村', '香料市'], travelTime: 10 },
        '谷物乡': { region: '平原区', connections: ['牧野城', '平原镇'], travelTime: 9 },
        '牧野城': { region: '平原区', connections: ['谷物乡', '平原镇', '王都'], travelTime: 11 },
        '平原镇': { region: '平原区', connections: ['谷物乡', '牧野城', '矿石镇'], travelTime: 10 },
        '金沙城': { region: '沙漠区', connections: ['高山城', '绿洲镇', '香料市'], travelTime: 14 },
        '绿洲镇': { region: '沙漠区', connections: ['金沙城', '香料市'], travelTime: 11 },
        '香料市': { region: '沙漠区', connections: ['金沙城', '绿洲镇', '珍珠港', '荒漠哨站'], travelTime: 12 },
        '王都': { region: '都市区', connections: ['精灵之都', '牧野城', '商盟总部', '贸易中心'], travelTime: 6 },
        '商盟总部': { region: '都市区', connections: ['王都', '贸易中心', '工艺之都'], travelTime: 8 },
        '贸易中心': { region: '都市区', connections: ['王都', '商盟总部', '海港城'], travelTime: 6 },
        '工艺之都': { region: '都市区', connections: ['商盟总部', '魔法学院'], travelTime: 9 },
        '魔法学院': { region: '都市区', connections: ['工艺之都', '边陲集市'], travelTime: 10 },
        '边陲集市': { region: '边陲区', connections: ['魔法学院', '北境关', '荒漠哨站', '虚空裂隙'], travelTime: 16 },
        '北境关': { region: '边陲区', connections: ['边陲集市', '雪原堡', '龙脊城', '天穹哨塔'], travelTime: 17 },
        '雪原堡': { region: '边陲区', connections: ['北境关', '龙脊城', '极北冰原'], travelTime: 18 },
        '龙脊城': { region: '边陲区', connections: ['北境关', '雪原堡', '荒漠哨站', '龙巢深渊'], travelTime: 18 },
        '荒漠哨站': { region: '边陲区', connections: ['边陲集市', '龙脊城', '香料市', '荒漠废墟'], travelTime: 19 },
        '极北冰原': { region: '远境', connections: ['雪原堡', '永冻神殿'], travelTime: 23 },
        '龙巢深渊': { region: '远境', connections: ['龙脊城', '龙心禁地'], travelTime: 24 },
        '荒漠废墟': { region: '远境', connections: ['荒漠哨站', '太古遗迹'], travelTime: 25 },
        '天穹哨塔': { region: '远境', connections: ['北境关', '星界之门'], travelTime: 22 },
        '虚空裂隙': { region: '远境', connections: ['边陲集市', '虚空深渊'], travelTime: 21 },
        '永冻神殿': { region: '极远境', connections: ['极北冰原'], travelTime: 27 },
        '龙心禁地': { region: '极远境', connections: ['龙巢深渊'], travelTime: 28 },
        '太古遗迹': { region: '极远境', connections: ['荒漠废墟'], travelTime: 29 },
        '星界之门': { region: '极远境', connections: ['天穹哨塔'], travelTime: 26 },
        '虚空深渊': { region: '极远境', connections: ['虚空裂隙'], travelTime: 30 }
    },

    goods: {
        '木材': { basePrice: 100, type: '资源', slots: 1, shelfLife: Infinity, fluctuation: '小', 
                production: ['绿叶镇', '林荫城', '精灵之都'], scarcity: ['金沙城', '绿洲镇', '香料市'] },
        '铁矿': { basePrice: 150, type: '资源', slots: 1, shelfLife: Infinity, fluctuation: '中',
                production: ['铁石堡', '高山城', '矿石镇'], scarcity: ['海港城', '渔村', '珍珠港'] },
        '谷物': { basePrice: 80, type: '农产品', slots: 1, shelfLife: 15, fluctuation: '中',
                production: ['谷物乡', '牧野城', '平原镇'], scarcity: ['铁石堡', '高山城', '矿石镇'] },
        '棉花': { basePrice: 180, type: '农产品', slots: 1, shelfLife: 30, fluctuation: '中',
                production: ['平原镇', '谷物乡'], scarcity: ['铁石堡', '高山城', '矿石镇'] },
        '盐': { basePrice: 300, type: '必需品', slots: 1, shelfLife: Infinity, fluctuation: '小',
                production: ['渔村', '海港城'], scarcity: ['铁石堡', '高山城', '矿石镇', '金沙城', '绿洲镇', '香料市'] },
        '鱼类': { basePrice: 280, type: '食品', slots: 1, shelfLife: 7, fluctuation: '大',
                production: ['渔村', '珍珠港'], scarcity: ['铁石堡', '高山城', '矿石镇', '金沙城', '绿洲镇', '香料市'] },
        '皮毛': { basePrice: 400, type: '特产', slots: 1, shelfLife: 90, fluctuation: '中',
                production: ['牧野城', '绿叶镇'], scarcity: ['海港城', '渔村', '珍珠港'] },
        '草药': { basePrice: 250, type: '特产', slots: 1, shelfLife: 30, fluctuation: '大',
                production: ['林荫城', '香料市'], scarcity: ['海港城', '渔村', '珍珠港', '金沙城', '绿洲镇'] },
        '陶器': { basePrice: 350, type: '工艺品', slots: 1, shelfLife: Infinity, fluctuation: '中',
                production: ['绿洲镇', '工艺之都'], scarcity: ['绿叶镇', '林荫城', '精灵之都'] },
        '香料': { basePrice: 500, type: '奢侈品', slots: 1, shelfLife: 180, fluctuation: '极大',
                production: ['香料市', '金沙城'], scarcity: ['绿叶镇', '林荫城', '精灵之都', '铁石堡', '高山城', '矿石镇'] },
        '丝绸': { basePrice: 900, type: '奢侈品', slots: 1, shelfLife: Infinity, fluctuation: '大',
                production: ['平原镇', '工艺之都'], scarcity: ['绿叶镇', '林荫城', '精灵之都', '铁石堡', '高山城', '矿石镇'] },
        '珠宝': { basePrice: 1300, type: '奢侈品', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['高山城', '王都'], scarcity: ['渔村', '海港城', '珍珠港', '谷物乡', '牧野城', '平原镇'] },
        '葡萄酒': { basePrice: 400, type: '特产', slots: 1, shelfLife: 60, fluctuation: '中',
                production: ['精灵之都', '王都'], scarcity: ['铁石堡', '高山城', '矿石镇', '金沙城', '绿洲镇'] },
        '牲畜': { basePrice: 600, type: '活物', slots: 1, shelfLife: Infinity, fluctuation: '小',
                production: ['牧野城', '平原镇'], scarcity: ['王都', '商盟总部', '贸易中心', '工艺之都', '魔法学院'] },
        '魔法水晶': { basePrice: 1000, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['魔法学院', '高山城'], scarcity: ['渔村', '海港城', '珍珠港', '谷物乡', '牧野城', '平原镇'] },
        '茶叶': { basePrice: 320, type: '特产', slots: 1, shelfLife: 90, fluctuation: '中',
                production: ['林荫城', '绿叶镇'], scarcity: ['金沙城', '绿洲镇', '铁石堡'] },
        '瓷器': { basePrice: 550, type: '工艺品', slots: 1, shelfLife: Infinity, fluctuation: '中',
                production: ['工艺之都', '绿洲镇'], scarcity: ['渔村', '海港城', '牧野城'] },
        '蜜糖': { basePrice: 220, type: '食品', slots: 1, shelfLife: 60, fluctuation: '小',
                production: ['精灵之都', '绿叶镇'], scarcity: ['海港城', '珍珠港', '金沙城'] },
        '玉器': { basePrice: 1100, type: '奢侈品', slots: 1, shelfLife: Infinity, fluctuation: '大',
                production: ['高山城', '王都'], scarcity: ['渔村', '谷物乡', '平原镇'] },
        '药材': { basePrice: 380, type: '特产', slots: 1, shelfLife: 45, fluctuation: '大',
                production: ['魔法学院', '林荫城'], scarcity: ['渔村', '珍珠港', '平原镇'] },
        '龙鳞矿': { basePrice: 2500, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '大',
                production: ['龙脊城', '边陲集市'], scarcity: ['王都', '渔村', '海港城', '珍珠港', '谷物乡'] },
        '冰晶': { basePrice: 2200, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '中',
                production: ['雪原堡', '北境关'], scarcity: ['王都', '渔村', '珍珠港', '金沙城', '香料市'] },
        '陨铁': { basePrice: 2800, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '大',
                production: ['荒漠哨站', '龙脊城'], scarcity: ['王都', '渔村', '海港城', '牧野城', '平原镇'] },
        '圣水': { basePrice: 3000, type: '稀有', slots: 1, shelfLife: 90, fluctuation: '极大',
                production: ['边陲集市', '北境关'], scarcity: ['王都', '渔村', '海港城', '铁石堡', '金沙城'] },
        '凤凰羽': { basePrice: 3500, type: '奢侈品', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['边陲集市', '荒漠哨站'], scarcity: ['王都', '铁石堡', '矿石镇', '渔村', '珍珠港'] },
        '龙涎香': { basePrice: 3200, type: '奢侈品', slots: 1, shelfLife: 180, fluctuation: '极大',
                production: ['边陲集市', '荒漠哨站'], scarcity: ['王都', '绿叶镇', '林荫城', '铁石堡', '高山城'] },
        '星陨石': { basePrice: 4000, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['荒漠哨站', '龙脊城'], scarcity: ['王都', '渔村', '海港城', '谷物乡', '牧野城', '平原镇'] },
        '秘银': { basePrice: 2600, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '中',
                production: ['北境关', '雪原堡'], scarcity: ['王都', '渔村', '珍珠港', '绿叶镇', '精灵之都'] },
        '魔核': { basePrice: 3800, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['雪原堡', '龙脊城'], scarcity: ['王都', '渔村', '海港城', '谷物乡', '牧野城'] },
        '神谕卷轴': { basePrice: 4500, type: '奢侈品', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['边陲集市', '龙脊城'], scarcity: ['王都', '渔村', '海港城', '铁石堡', '金沙城', '绿洲镇'] },
        '极寒之心': { basePrice: 5500, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['极北冰原'], scarcity: ['王都', '渔村', '海港城', '珍珠港', '金沙城', '香料市'] },
        '龙魂结晶': { basePrice: 7200, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['龙巢深渊'], scarcity: ['王都', '渔村', '海港城', '谷物乡', '牧野城', '平原镇'] },
        '远古符文': { basePrice: 6800, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '大',
                production: ['荒漠废墟'], scarcity: ['王都', '渔村', '珍珠港', '绿叶镇', '精灵之都'] },
        '天穹星砂': { basePrice: 9000, type: '奢侈品', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['天穹哨塔'], scarcity: ['王都', '铁石堡', '矿石镇', '渔村', '海港城', '牧野城'] },
        '虚空精华': { basePrice: 10000, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['虚空裂隙'], scarcity: ['王都', '渔村', '海港城', '谷物乡', '铁石堡', '金沙城'] },
        '永恒冰髓': { basePrice: 6000, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '大',
                production: ['极北冰原'], scarcity: ['王都', '渔村', '海港城', '珍珠港', '绿洲镇', '香料市', '牧野城'] },
        '太古龙骨': { basePrice: 8500, type: '奢侈品', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['龙巢深渊'], scarcity: ['王都', '渔村', '珍珠港', '谷物乡', '平原镇', '精灵之都'] },
        '神格碎片': { basePrice: 9500, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['荒漠废墟'], scarcity: ['王都', '海港城', '渔村', '牧野城', '林荫城', '工艺之都'] },
        '命运丝线': { basePrice: 7500, type: '奢侈品', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['天穹哨塔'], scarcity: ['王都', '渔村', '珍珠港', '铁石堡', '金沙城', '绿叶镇'] },
        '混沌之核': { basePrice: 8000, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['虚空裂隙'], scarcity: ['王都', '渔村', '海港城', '谷物乡', '高山城', '矿石镇'] },
        '永霜之心': { basePrice: 11500, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['永冻神殿'], scarcity: ['王都', '渔村', '海港城', '珍珠港', '金沙城', '香料市'] },
        '龙神之泪': { basePrice: 12800, type: '奢侈品', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['龙心禁地'], scarcity: ['王都', '渔村', '海港城', '谷物乡', '牧野城', '平原镇'] },
        '创世残页': { basePrice: 14200, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['太古遗迹'], scarcity: ['王都', '渔村', '珍珠港', '绿叶镇', '精灵之都', '工艺之都'] },
        '星河之种': { basePrice: 13800, type: '奢侈品', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['星界之门'], scarcity: ['王都', '铁石堡', '矿石镇', '渔村', '海港城', '牧野城'] },
        '虚空王冠': { basePrice: 15000, type: '稀有', slots: 1, shelfLife: Infinity, fluctuation: '极大',
                production: ['虚空深渊'], scarcity: ['王都', '渔村', '海港城', '谷物乡', '铁石堡', '金沙城', '绿洲镇'] }
    },

    warehouseLevels: [
        { level: 1, capacity: 20, cost: 0 },
        { level: 2, capacity: 30, cost: 300000 },
        { level: 3, capacity: 40, cost: 1000000 },
        { level: 4, capacity: 50, cost: 5000000 },
        { level: 5, capacity: 60, cost: 10000000 },
        { level: 6, capacity: 70, cost: 50000000 },
        { level: 7, capacity: 80, cost: 100000000 },
        { level: 8, capacity: 90, cost: 500000000 },
        { level: 9, capacity: 100, cost: 1000000000 },
        { level: 10, capacity: 120, cost: 5000000000 }
    ],

    transports: [
        { name: '手推车', capacityBonus: 5, speedBonus: 0, cost: 10, maintenance: 0 },
        { name: '驴车', capacityBonus: 10, speedBonus: 1, cost: 200000, maintenance: 10000 },
        { name: '马队', capacityBonus: 20, speedBonus: 2, cost: 1000000, maintenance: 20000 },
        { name: '商队', capacityBonus: 30, speedBonus: 3, cost: 5000000, maintenance: 40000 },
        { name: 'A级战队', capacityBonus: 40, speedBonus: 4, cost: 50000000, maintenance: 50000 },
        { name: '王国商队', capacityBonus: 60, speedBonus: 5, cost: 100000000, maintenance: 800000 },
        { name: '帝国商队', capacityBonus: 80, speedBonus: 6, cost: 1000000000, maintenance: 100000 },
        { name: '皇国商队', capacityBonus: 100, speedBonus: 7, cost: 5000000000, maintenance: 200000 }
    ],

    employees: [
        { type: '初级商贩', efficiencyBonus: 5, cost: 5000, salary: 1000, requirement: 'warehouse30', desc: '自动贸易效率+5%' },
        { type: '资深掌柜', efficiencyBonus: 15, cost: 20000, salary: 5000, requirement: 'warehouse50', desc: '自动贸易效率+15%' },
        { type: '商业间谍', intelligenceDiscount: 30, cost: 50000, salary: 10000, requirement: 'reputation3', desc: '情报折扣30%，假情报率降低' },
        { type: '保镖队长', robberyReduction: 50, cost: 30000, salary: 8000, requirement: 'experiencedRobbery', desc: '被劫损失减免50%' },
        { type: '账房先生', sellBonus: 2, cost: 40000, salary: 6000, requirement: 'warehouse40', desc: '出售收益+2%' },
        { type: '跑腿伙计', travelSpeedBonus: 5, cost: 15000, salary: 2500, requirement: 'warehouse30', desc: '旅行时间-5%' },
        { type: '防损专员', spoilReduction: 30, cost: 25000, salary: 4000, requirement: 'warehouse40', desc: '商品腐败概率-30%' },
        { type: '市场顾问', rumorBonus: 20, cost: 80000, salary: 15000, requirement: 'reputation5', desc: '传闻涨价效果+20%（如15%→18%）' },
        { type: '风控师', negativeEventReduction: 24, cost: 95000, salary: 14000, requirement: 'reputation6', desc: '负面旅行事件概率约-24%（劫匪/腐败/关税等）' },
        { type: '商路斥候', travelEventLuck: 10, cost: 55000, salary: 9000, requirement: 'reputation4', desc: '正面与机遇类旅行事件略更易触发' }
    ]
};

// 初始化玩家跑商数据（可选传入 save 对象，用于离线跑商时用 save.lastUpdate 计算离线时长）
function initTradingData(saveForOffline) {
    try {
        if (typeof tradingConfig === 'undefined') {
            setTimeout(function() { initTradingData(saveForOffline); }, 200);
            return;
        }
    } catch (e) {
        setTimeout(function() { initTradingData(saveForOffline); }, 200);
        return;
    }
    if (!player.trading) {
        player.trading = {
            currentCity: '王都',
            warehouse: {
                level: 1,
                capacity: 20,
                used: 0
            },
            transport: {
                type: '手推车',
                capacityBonus: 5,
                speedBonus: 0
            },
            ownedTransports: ['手推车'], // 已拥有的运输工具，购买后永久拥有可切换
            inventory: {}, // 改为对象结构，记录每个商品的详细数据
           autoTrade: {
                enabled: false,
                routes: [],
                efficiency: 0.6,
                currentRoute: null,
                currentState: 'idle',
                currentProgress: 0,
                totalTravelTime: 0,
                lastUpdate: Date.now(),
                logs: [], // 新增：自动贸易日志
                stats: { // 新增：统计信息
                    totalProfit: 0,
                    totalTrades: 0,
                    successfulTrades: 0,
                    failedTrades: 0,
                    totalTravelTime: 0,
                    startTime: Date.now()
                },
            purchaseSettings: {
                    maxGoods: 50, // 最多采购50种商品
                    purchaseStrategy: 'priceDesc', // 价格降序策略
                    minProfitMargin: 10, // 最小利润率
                    maxWarehouseUsage: 0.8, // 最大货仓使用率
                    priceTolerance: 0 // 价格容忍度（0=严格按最大买入价，不超限）
                },
             flexibleTrade: {
                    enabled: true, // 启用灵活贸易
                    maxInventoryValue: 0, // 库存总金额上限（0=不限制）
                    minProfitThreshold: 5, // 最小利润阈值
                    maxCityStayTime: 3600000, // 最大城市停留时间（1小时）
                    explorationChance: 0.2, // 探索新城市的概率
                    returnToBaseChance: 0.3, // 返回基地的概率
                    priceMonitoring: true // 启用价格监控
                },
            backgroundMode: false,
                lastBackgroundUpdate: Date.now(),
                backgroundInterval: null, 
                 currentCityStayStart: Date.now()
            },
            employees: [],
            tradeHistory: [],
             lastTradeTime: player.lastUpdate || Date.now(),
            tradeVolumeToday: 0,
            tradeCountToday: 0,
            cityPrices: {},
           lastPriceUpdate: player.lastUpdate || Date.now(), 
            isTraveling: false,
            travelStartTime: 0,
            travelEndTime: 0,
            travelDestination: '',
            insurance: {
                goods: false,
                transport: false,
                bundle: false
            },
            riskAppetite: 'balanced',
            intelligence: {
                basic: true,
                advanced: false,
                full: false
            },
            reputation: 0,
            merchantLevel: 1,
            guildQuests: { list: [], lastReset: 0 },
            eventBonus: null,
            luckyMerchantNextBuy: false,
            blackMarket: { available: false, endTime: 0, city: '' },
            rumor: { text: '', good: '', city: '', effectEndTime: 0 },
            dailyLucky: { lastDate: '', used: false, buff: null },
            merchantExtra: { dayStr: '', vFreeDone: false, vPaidCount: 0, charter: false, snipe: false },
            merchantCharter: null,
            merchantMiles: 0,
            treasureShards: 0,
            worldPulseDayStr: '',
            hotDeal: null,
            regionPulse: null,
            globalSellMult: null,
            globalSellMultEnd: 0,
            globalBuyMult: null,
            globalBuyMultEnd: 0,
            sellDebuff: null
        };
        
        // 初始化城市价格
        initCityPrices();
    } else {
        // 离线后加载：先更新城市价格；离线跑商由 loadSave 末尾统一执行
        if (typeof updateCityPrices === 'function') updateCityPrices();
        if (player.trading.reputation == null) player.trading.reputation = 0;
        if (player.trading.merchantLevel == null) player.trading.merchantLevel = 1;
        if (!player.trading.guildQuests) player.trading.guildQuests = { list: [], lastReset: 0 };
        if (player.trading.eventBonus === undefined) player.trading.eventBonus = null;
        if (player.trading.luckyMerchantNextBuy === undefined) player.trading.luckyMerchantNextBuy = false;
        if (!player.trading.blackMarket) player.trading.blackMarket = { available: false, endTime: 0, city: '' };
        if (!player.trading.rumor) player.trading.rumor = { text: '', good: '', city: '', effectEndTime: 0 };
        if (!player.trading.dailyLucky) player.trading.dailyLucky = { lastDate: '', used: false, buff: null };
        if (!player.trading.merchantExtra) player.trading.merchantExtra = { dayStr: '', vFreeDone: false, vPaidCount: 0, charter: false, snipe: false };
        if (player.trading.merchantCharter === undefined) player.trading.merchantCharter = null;
        if (player.trading.merchantMiles == null) player.trading.merchantMiles = 0;
        if (player.trading.treasureShards == null) player.trading.treasureShards = 0;
        if (player.trading.worldPulseDayStr == null) player.trading.worldPulseDayStr = '';
        if (player.trading.hotDeal === undefined) player.trading.hotDeal = null;
        if (player.trading.regionPulse === undefined) player.trading.regionPulse = null;
        if (player.trading.globalSellMult === undefined) player.trading.globalSellMult = null;
        if (player.trading.globalSellMultEnd === undefined) player.trading.globalSellMultEnd = 0;
        if (player.trading.globalBuyMult === undefined) player.trading.globalBuyMult = null;
        if (player.trading.globalBuyMultEnd === undefined) player.trading.globalBuyMultEnd = 0;
        if (player.trading.sellDebuff === undefined) player.trading.sellDebuff = null;
        if (player.trading.insurance.bundle === undefined) player.trading.insurance.bundle = false;
        if (!player.trading.riskAppetite) player.trading.riskAppetite = 'balanced';
        if (typeof updateMerchantLevelFromReputation === 'function') updateMerchantLevelFromReputation();
        if (typeof ensureGuildQuests === 'function') ensureGuildQuests();
        // 兼容旧存档：已拥有运输工具列表，若不存在则至少包含手推车和当前使用的
        if (!player.trading.ownedTransports || !Array.isArray(player.trading.ownedTransports)) {
            player.trading.ownedTransports = ['手推车'];
            if (player.trading.transport && player.trading.transport.type && player.trading.ownedTransports.indexOf(player.trading.transport.type) === -1) {
                player.trading.ownedTransports.push(player.trading.transport.type);
            }
        }
        // 兼容旧存档：transport 缺失或无效时补全为手推车，避免总容量只按仓库算导致“到100就不买”
        if (!player.trading.transport || typeof player.trading.transport.capacityBonus !== 'number') {
            var defaultTransport = tradingConfig.transports && tradingConfig.transports.find(function(t) { return t.name === '手推车'; });
            if (defaultTransport) {
                player.trading.transport = { type: '手推车', capacityBonus: defaultTransport.capacityBonus, speedBonus: defaultTransport.speedBonus || 0 };
            } else {
                player.trading.transport = { type: '手推车', capacityBonus: 5, speedBonus: 0 };
            }
        }
        // 兼容旧存档：capacity 低于当前等级配置时补全，避免总上限少算（自动贸易约到 100/125 就按 80% 停购）
        if (player.trading.warehouse && typeof tradingConfig !== 'undefined' && tradingConfig.warehouseLevels && tradingConfig.warehouseLevels.length) {
            var _wl = Math.min(Math.max(1, Math.floor(Number(player.trading.warehouse.level) || 1)), tradingConfig.warehouseLevels.length);
            var _capLv = tradingConfig.warehouseLevels[_wl - 1].capacity;
            if ((player.trading.warehouse.capacity || 0) < _capLv) player.trading.warehouse.capacity = _capLv;
        }
        // 兼容旧数据：如果inventory是简单数量形式，转换为新格式
        if (player.trading.inventory && typeof player.trading.inventory === 'object') {
            let needsConversion = false;
            Object.keys(player.trading.inventory).forEach(good => {
                if (typeof player.trading.inventory[good] === 'number') {
                    needsConversion = true;
                }
            });
            
            if (needsConversion) {
                const oldInventory = {...player.trading.inventory};
                player.trading.inventory = {};
                Object.keys(oldInventory).forEach(good => {
                    if (oldInventory[good] > 0) {
                        // 使用当前价格作为估算成本（因为没有历史记录）
                        const estimatedCost = player.trading.cityPrices[player.trading.currentCity][good] || tradingConfig.goods[good].basePrice;
                        player.trading.inventory[good] = {
                            quantity: oldInventory[good],
                            averageCost: estimatedCost,
                            totalCost: estimatedCost * oldInventory[good]
                        };
                    }
                });
                logAction("库存数据已升级为新格式", "info");
            }
        }
        
        // 检查是否有未完成的旅行（含离线期间已到达的情况）
        // 若 tradingConfig 尚未定义（loadSave 在脚本前部执行时），延迟执行以免 ReferenceError
        if (player.trading.isTraveling) {
            const now = Date.now();
            const doTravelComplete = function() {
                if (typeof tradingConfig === 'undefined') return;
                if (!player.trading.isTraveling) return;
                if (Date.now() >= player.trading.travelEndTime) {
                    if (player.trading.autoTrade && player.trading.autoTrade.enabled) completeAutoTravel();
                    else completeTravel();
                } else {
                    if (player.trading.travelInterval) {
                        clearInterval(player.trading.travelInterval);
                        player.trading.travelInterval = null;
                    }
                    player.trading.travelInterval = registerInterval(checkTravelStatus, 1000);
                }
            };
            if (typeof tradingConfig === 'undefined') {
                setTimeout(doTravelComplete, 150);
            } else {
                if (now >= player.trading.travelEndTime) {
                    if (player.trading.autoTrade && player.trading.autoTrade.enabled) completeAutoTravel();
                    else completeTravel();
                } else {
                    if (player.trading.travelInterval) {
                        clearInterval(player.trading.travelInterval);
                        player.trading.travelInterval = null;
                    }
                    player.trading.travelInterval = registerInterval(checkTravelStatus, 1000);
                }
            }
        }
    }
}

// 根据当前库存重算仓库占用，避免 warehouse.used 与库存不同步
function syncWarehouseUsedFromInventory() {
    if (!player.trading || !player.trading.inventory || !player.trading.warehouse) return;
    let used = 0;
    const toDelete = [];
    Object.keys(player.trading.inventory).forEach(good => {
        const item = player.trading.inventory[good];
        const qty = typeof item === 'object' && item != null && 'quantity' in item ? item.quantity : 0;
        if (qty <= 0) {
            toDelete.push(good);
            return;
        }
        const goodConfig = tradingConfig.goods[good];
        if (goodConfig && goodConfig.slots) used += goodConfig.slots * qty;
    });
    toDelete.forEach(good => { delete player.trading.inventory[good]; });
    player.trading.warehouse.used = used;
}

// 初始化城市价格
function initCityPrices() {
    Object.keys(tradingConfig.cities).forEach(city => {
        player.trading.cityPrices[city] = {};
        Object.keys(tradingConfig.goods).forEach(good => {
            player.trading.cityPrices[city][good] = calculateCurrentPrice(city, good);
        });
    });
}
function calculateCurrentPrice(city, good) {
    const goodConfig = tradingConfig.goods[good];
    let price = goodConfig.basePrice;
    
    // 地区修正
    if (goodConfig.production.includes(city)) {
        price *= 0.75; // 产地价格-25%
    } else if (goodConfig.scarcity.includes(city)) {
        price *= 1.3; // 稀缺地价格+30%
    } else {
        price *= 1.1; // 普通地区+10%
    }
    
    // 随机波动 (-30% 到 +50%)
    const randomFluctuation = Math.random() * 0.8 - 0.3;
    price *= (1 + randomFluctuation);
    
    return Math.round(price);
}

// 跑商价格刷新间隔（与 updateCityPrices 一致，确保倒计时同步）
const TRADING_PRICE_REFRESH_INTERVAL_MS = 60 * 60 * 1000;

// 获取价格刷新倒计时文本（与跑商1小时价格刷新同步）
function getPriceRefreshCountdown() {
    if (!player || !player.trading || player.trading.lastPriceUpdate == null) return '';
    const now = Date.now();
    const nextRefresh = (player.trading.lastPriceUpdate || 0) + TRADING_PRICE_REFRESH_INTERVAL_MS;
    let ms = nextRefresh - now;
    if (ms <= 0) return '（即将刷新）';
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return '（' + mins + '分' + secs + '秒后刷新）';
}

// 更新城市价格（每小时，与价格刷新倒计时同步），返回是否执行了刷新
function updateCityPrices() {
    const now = Date.now();
    const hoursSinceUpdate = (now - player.trading.lastPriceUpdate) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate >= 1) {
        if (!player.trading.cityPrices) player.trading.cityPrices = {};
        Object.keys(tradingConfig.cities).forEach(city => {
            if (!player.trading.cityPrices[city]) player.trading.cityPrices[city] = {};
            Object.keys(tradingConfig.goods).forEach(good => {
                player.trading.cityPrices[city][good] = calculateCurrentPrice(city, good);
            });
        });
        if (player.trading.rumor && player.trading.rumor.city && player.trading.rumor.good && player.trading.rumor.effectEndTime > now) {
            var c = player.trading.rumor.city, g = player.trading.rumor.good;
            var rumorMult = (typeof getEmployeeRumorBonusMultiplier === 'function') ? getEmployeeRumorBonusMultiplier() : 1;
            var baseBump = player.trading.rumor.strong ? 0.22 : 0.15;
            if (player.trading.cityPrices[c] && player.trading.cityPrices[c][g] != null)
                player.trading.cityPrices[c][g] = Math.ceil((player.trading.cityPrices[c][g] || 0) * (1 + baseBump * rumorMult));
        }
        player.trading.lastPriceUpdate = now;
        return true;
    }
    return false;
}

function addAutoTradeLog(message, type = 'info') {
    // 确保消息有效
    if (!message || typeof message !== 'string') {
        console.error("无效的日志消息:", message);
        return;
    }
    
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
        timestamp,
        message,
        type,
        city: player.trading.currentCity,
        state: player.trading.autoTrade.currentState,
        funds: player.nightClub.starCoins,
        warehouseUsage: calculateWarehouseUsage(),
        isTraveling: player.trading.isTraveling,
        purchaseOpportunities: getAllPurchasableGoods().length,
        saleOpportunities: getAllSalableGoods().length
    };
    
    player.trading.autoTrade.logs.unshift(logEntry);
    
    // 限制日志数量
    if (player.trading.autoTrade.logs.length > 50) {
        player.trading.autoTrade.logs.pop();
    }
    
    // 离线模拟时不更新 DOM，避免报错或界面未就绪
    if (player.trading._simulatedNow != null) return;
    
    // 如果日志界面打开，实时更新
    const logModal = document.getElementById('autoTradeLogModal');
    if (logModal && logModal.style.display === 'block') {
        updateAutoTradeLogDisplay();
    }
    
    // 更新界面状态显示
    updateAutoTradeTab();
}

// 智能灵活贸易：离线期间模拟推进（多次到达、买卖），使重新打开游戏时数据已更新
function simulateOfflineAutoTrade(offlineMs) {
    if (!player.trading || !player.trading.autoTrade || !player.trading.autoTrade.enabled) return;
    offlineMs = Math.min(offlineMs, 24 * 3600 * 1000);
    if (offlineMs < 60000) {
        if (typeof logAction === 'function') logAction('跑商离线: 需至少离线1分钟才模拟，当前约' + Math.floor(offlineMs / 1000) + '秒，未执行', 'info');
        return;
    }
    // 确保城市价格结构存在；价格刷新遵守1小时规则，不因离线而强制刷新
    if (typeof tradingConfig !== 'undefined' && tradingConfig.cities) {
        if (!player.trading.cityPrices) player.trading.cityPrices = {};
        Object.keys(tradingConfig.cities).forEach(function(city) {
            if (!player.trading.cityPrices[city]) player.trading.cityPrices[city] = {};
        });
    }
    if (typeof updateCityPrices === 'function') updateCityPrices();
    if (!player.trading.autoTrade.stats) player.trading.autoTrade.stats = { totalProfit: 0, totalTrades: 0, successfulTrades: 0, failedTrades: 0, totalTravelTime: 0, startTime: Date.now() };
    if (player.trading.autoTrade.stats.totalProfit == null) player.trading.autoTrade.stats.totalProfit = 0;
    var profitBefore = player.trading.autoTrade.stats.totalProfit;
    var simulatedNow = Date.now() - offlineMs;
    var iter = 0;
    var maxIter = 4000; // 提高上限以支持约24小时离线（每步约20–60秒）
    player.trading._simulatedNow = simulatedNow;
    player.trading.autoTrade.nextMonitorTime = 0;
    player.trading.autoTrade.lastUpdate = simulatedNow - 20000;
    try {
        while (simulatedNow < Date.now() && iter < maxIter) {
            iter++;
            player.trading._simulatedNow = simulatedNow;
            try {
                if (player.trading.isTraveling) {
                    if (player.trading.travelEndTime <= simulatedNow) {
                        completeAutoTravel();
                        simulatedNow += 60000;
                    } else {
                        simulatedNow = Math.min(simulatedNow + 60000, player.trading.travelEndTime);
                    }
                } else {
                    player.trading.autoTrade.nextMonitorTime = 0;
                    player.trading.autoTrade.lastUpdate = simulatedNow - 20000;
                    runAutoTrade();
                    simulatedNow += 20000; // 非旅行时每次推进20秒，兼顾次数与覆盖时长
                }
            } catch (e) {
                console.warn('离线跑商模拟单步异常，继续下一轮:', e);
                simulatedNow += 20000;
            }
        }
        if (player.trading.isTraveling && player.trading.travelEndTime > Date.now()) {
            var remaining = player.trading.travelEndTime - simulatedNow;
            player.trading.travelStartTime = Date.now();
            player.trading.travelEndTime = Date.now() + Math.max(0, remaining);
        }
    } finally {
        player.trading._simulatedNow = undefined;
        player.trading.autoTrade.nextMonitorTime = 0;
        player.trading.autoTrade.lastUpdate = Date.now() - 15000;
        var profitAfter = (player.trading.autoTrade.stats && player.trading.autoTrade.stats.totalProfit != null) ? player.trading.autoTrade.stats.totalProfit : 0;
        var offlineProfit = profitAfter - profitBefore;
        var usedSimplified = false;
        if (offlineProfit <= 0 && offlineMs >= 120000) {
            var cap = 0;
            var currentFundsForOffline = (player && player.nightClub && typeof player.nightClub.starCoins === 'number')
                ? player.nightClub.starCoins
                : 0;
            var configuredCap = 0;

            if (player.trading.autoTrade.routes && player.trading.autoTrade.routes[0]) {
                configuredCap = player.trading.autoTrade.routes[0].tradeCapital || 0;
            }

            // 先以玩家配置值为基础，但不能超过当前资金的一定比例
            if (configuredCap > 0 && currentFundsForOffline > 0) {
                cap = Math.min(configuredCap, currentFundsForOffline * 0.8);
            }

            // 如果上面没有得到合理 cap，则按当前资金的一半回退
            if (cap <= 0 && currentFundsForOffline > 0) {
                cap = Math.max(10000, currentFundsForOffline * 0.5);
            }

            // 全局硬上限，避免离线收益被不现实的配置撑爆（与单次资金上限保持一致：1亿）
            var HARD_CAP_OFFLINE = 1e8;
            cap = Math.max(0, Math.min(cap, HARD_CAP_OFFLINE));

            if (cap > 0) {
                var offlineHours = offlineMs / (3600 * 1000);
                var simplified = Math.floor(Math.min(offlineHours * cap * 0.008, cap * 0.8));
                if (simplified > 0) {
                    if (!player.trading.autoTrade.stats) player.trading.autoTrade.stats = { totalProfit: 0 };
                    player.trading.autoTrade.stats.totalProfit = (player.trading.autoTrade.stats.totalProfit || 0) + simplified;
                    addStarCoins(simplified);
                    offlineProfit = simplified;
                    usedSimplified = true;
                }
            }
        }
        if (typeof logAction === 'function') {
            if (usedSimplified)
                logAction('跑商离线总收益: +' + offlineProfit.toLocaleString() + ' 星币（简化结算）', 'success');
            else if (offlineProfit !== 0)
                logAction((offlineProfit >= 0 ? '跑商离线总收益: +' : '跑商离线总收益: ') + (Math.abs(offlineProfit) >= 1e8 ? offlineProfit.toExponential(2) : Math.floor(offlineProfit).toLocaleString()) + ' 星币', offlineProfit >= 0 ? 'success' : 'error');
            else
                logAction('跑商离线总收益: 0 星币', 'info');
        }
        var profitText = usedSimplified ? ('+' + offlineProfit.toLocaleString() + ' 星币（简化结算）') : (offlineProfit !== 0 ? ((offlineProfit >= 0 ? '+' : '') + (Math.abs(offlineProfit) >= 1e8 ? offlineProfit.toExponential(2) : Math.floor(offlineProfit).toLocaleString()) + ' 星币') : '0 星币');
        if (typeof addAutoTradeLog === 'function') addAutoTradeLog('[离线] 总收益: ' + profitText, offlineProfit > 0 ? 'success' : (offlineProfit < 0 ? 'error' : 'info'));
    }
}

// 统一执行离线跑商结算（在 loadSave 之后调用；会清空 window._tradingOfflineMs）
function runTradingOfflineIfNeeded() {
    var offMs = 0;
    // 最高优先级：页面加载时 head 里抢先读的 lastUpdate（在任何写存档之前），保证离线时长不被覆盖
    if (window.__goldGameSaveLastUpdate != null) {
        var fromFirstRead = Date.now() - window.__goldGameSaveLastUpdate;
        if (fromFirstRead > 0) offMs = Math.min(fromFirstRead, 24 * 3600 * 1000);
        window.__goldGameSaveLastUpdate = null;
    }
    // 其次：loadSave 内算好的 _tradingOfflineMsFromSave
    if (offMs <= 0 && window._tradingOfflineMsFromSave > 0) {
        offMs = Math.min(window._tradingOfflineMsFromSave, 24 * 3600 * 1000);
        window._tradingOfflineMsFromSave = 0;
    }
    var lastUnload = parseInt(localStorage.getItem('goldGameLastUnload') || '0', 10);
    // 来源1：关页时写入的 goldGameLastUnload（任意正数即用，不要求>1分钟）
    if (offMs <= 0 && lastUnload > 0) {
        var fromStorage = Date.now() - lastUnload;
        if (fromStorage > 0) offMs = Math.min(fromStorage, 24 * 3600 * 1000);
    }
    // 来源2：loadSave 里算好的 _tradingOfflineMs / 快照
    if (offMs <= 0) offMs = window._tradingOfflineMs || window._tradingOfflineMsSnapshot || 0;
    // 来源3：直接读存档 lastUpdate（关页未写入 lastUnload 时用）
    if (offMs <= 0) {
        try {
            var save = JSON.parse(localStorage.getItem('goldGameSave'));
            if (save && save.lastUpdate != null) {
                var fromSave = Date.now() - save.lastUpdate;
                if (fromSave > 0) offMs = Math.min(fromSave, 24 * 3600 * 1000);
            }
        } catch (e) {}
    }
    if (typeof logAction === 'function') logAction('跑商离线: 检查中(离线' + Math.floor(offMs / 60000) + '分钟, ' + (player ? player.reincarnationCount + '转' : '无玩家') + ')', 'info');
    if (offMs > 0 && typeof logAction === 'function') logAction('跑商离线: 检测到离线' + Math.floor(offMs / 60000) + '分钟，准备结算…', 'info');
    if (offMs <= 0) {
        window._tradingOfflineMs = 0;
        window._tradingOfflineMsSnapshot = 0;
        if (typeof logAction === 'function') logAction('跑商离线: 未结算 — 原因：离线时长为0（未检测到有效离线间隔，请关页/关游戏一段时间后再打开）', 'info');
        return;
    }
    if (!player) {
        window._tradingOfflineMs = 0;
        window._tradingOfflineMsSnapshot = 0;
        if (typeof logAction === 'function') logAction('跑商离线: 未结算 — 原因：玩家数据未就绪', 'info');
        return;
    }
    if (player.reincarnationCount < 1000) {
        window._tradingOfflineMs = 0;
        window._tradingOfflineMsSnapshot = 0;
        if (typeof logAction === 'function') logAction('跑商离线: 未结算 — 原因：需1000转以上才开启跑商', 'info');
        return;
    }
    if (!player.trading && typeof initTradingData === 'function') initTradingData();
    if (!player.trading || !player.trading.autoTrade || !player.trading.autoTrade.enabled) {
        window._tradingOfflineMs = 0;
        window._tradingOfflineMsSnapshot = 0;
        if (typeof logAction === 'function') logAction('跑商离线: 未结算 — 原因：请先在跑商中勾选「启用自动贸易」并保存路线后再离线', 'info');
        return;
    }
    if (!player.trading.autoTrade.routes || player.trading.autoTrade.routes.length === 0) {
        window._tradingOfflineMs = 0;
        window._tradingOfflineMsSnapshot = 0;
        if (typeof logAction === 'function') logAction('跑商离线: 未结算 — 原因：未保存自动贸易路线（请先设好路线并点「保存路线」）', 'info');
        return;
    }
    window._tradingOfflineRunThisSession = true; // 防止同一会话重复结算
    var offMinutes = Math.floor(offMs / 60000);
    if (typeof logAction === 'function') logAction('跑商离线结算: 开始（离线约' + offMinutes + '分钟）', 'info');
    if (typeof addAutoTradeLog === 'function') addAutoTradeLog('[离线] 开始结算，离线约' + offMinutes + '分钟', 'info');
    try {
        if (typeof updateCityPrices === 'function') updateCityPrices();
        if (typeof simulateOfflineAutoTrade === 'function') {
            simulateOfflineAutoTrade(offMs);
            if (typeof updateDisplay === 'function') updateDisplay();
        }
        if (typeof addAutoTradeLog === 'function') addAutoTradeLog('[离线] 结算完成', 'success');
    } catch (e) {
        console.warn('跑商离线执行异常', e);
        if (typeof logAction === 'function') logAction('跑商离线结算异常: ' + (e && e.message), 'error');
        if (typeof addAutoTradeLog === 'function') addAutoTradeLog('[离线] 结算异常: ' + (e && e.message), 'error');
    }
    window._tradingOfflineMs = 0;
    window._tradingOfflineMsSnapshot = 0;
    localStorage.setItem('goldGameLastUnload', String(Date.now())); // 结算后更新，避免重复计入
}

function withRetry(func, maxRetries = 3, delay = 100) {
    return function(...args) {
        let retries = 0;
        
        function attempt() {
            try {
                return func.apply(this, args);
            } catch (error) {
                if (retries < maxRetries) {
                    retries++;
                    console.warn(`操作失败，第${retries}次重试:`, error);
                    setTimeout(attempt, delay * retries);
                } else {
                    console.error(`操作失败，已达到最大重试次数:`, error);
                    throw error;
                }
            }
        }
        
        return attempt();
    };
}

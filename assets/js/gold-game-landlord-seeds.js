// 地主种子、道具与抽奖数据（从时光秘境文件迁出）
  // 种子属性
        const seedProperties = {
            "土豆": { price: 0, minWeight: 0.1, maxWeight: 10, color: "#8B4513" },
            "金桔": { price: 1000, minWeight: 0.1, maxWeight: 3, color: "#8B4513" },
            "牵牛花": { price: 3000, minWeight: 0.1, maxWeight: 5, color: "#9B59B6" },
            "无花果": { price: 5000, minWeight: 0.1, maxWeight: 5, color: "#9B59B6" },
            "黄瓜": { price: 9000, minWeight: 0.1, maxWeight: 6, color: "#27AE60" },
            "西瓜": { price: 30000, minWeight: 0.1, maxWeight: 7, color: "#2ECC71" },
            "猕猴桃": { price: 60000, minWeight: 0.1, maxWeight: 8, color: "#2ECC71" },
            "百合花": { price: 80000, minWeight: 0.1, maxWeight: 10, color: "#2ECC71" },
            "枣树": { price: 100000, minWeight: 0.1, maxWeight: 15, color: "#2ECC71" },
            "蓝莓": { price: 120000, minWeight: 0.1, maxWeight: 8, color: "#2ECC71" },
            "苹果": { price: 150000, minWeight: 0.1, maxWeight: 8, color: "#E74C3C" },
            "丝瓜": { price: 200000, minWeight: 0.1, maxWeight: 9, color: "#E74C3C" },
            "香蕉": { price: 300000, minWeight: 0.1, maxWeight: 10, color: "#F1C40F" },
            "哈密瓜": { price: 400000, minWeight: 0.1, maxWeight: 11, color: "#F1C40F" },
            "冰淇淋豆": { price: 500000, minWeight: 0.1, maxWeight: 12, color: "#F1C40F" },
            "南瓜": { price: 600000, minWeight: 0.1, maxWeight: 12, color: "#D35400" },
            "红茶": { price: 700000, minWeight: 0.1, maxWeight: 12, color: "#D35400" },
            "橙子": { price: 800000, minWeight: 0.1, maxWeight: 13, color: "#D35400" },
            "玫瑰花": { price: 900000, minWeight: 0.1, maxWeight: 13, color: "#D35400" },
            "茄子": { price: 1000000, minWeight: 0.1, maxWeight: 14, color: "#D35400" },
            "草莓": { price: 1200000, minWeight: 0.1, maxWeight: 15, color: "#E74C3C" },
            "芒果": { price: 1500000, minWeight: 0.1, maxWeight: 16, color: "#E74C3C" },
            "樱桃": { price: 2100000, minWeight: 0.1, maxWeight: 18, color: "#E74C3C" }, 
            "柚子": { price: 2400000, minWeight: 0.1, maxWeight: 19, color: "#E74C3C" }, 
            "向日葵": { price: 3000000, minWeight: 0.1, maxWeight: 20, color: "#F1C40F" },
            "松树": { price: 4000000, minWeight: 0.1, maxWeight: 22, color: "#F1C40F" },
            "茶树": { price: 5000000, minWeight: 0.1, maxWeight: 24, color: "#F1C40F" },
            "大王菊": { price: 6000000, minWeight: 0.1, maxWeight: 25, color: "#9B59B6" },
            "红袍梅": { price: 7000000, minWeight: 0.1, maxWeight: 26, color: "#9B59B6" },
            "火龙果": { price: 8000000, minWeight: 0.1, maxWeight: 22, color: "#9B59B6" },
            "柳树": { price: 9000000, minWeight: 0.1, maxWeight: 35, color: "#9B59B6" },
            "闫闫果": { price: 10000000, minWeight: 0.1, maxWeight: 29, color: "#9B59B6" },
            "菠萝": { price: 12000000, minWeight: 0.1, maxWeight: 31, color: "#9B59B6" },
            "葡萄": { price: 15000000, minWeight: 0.1, maxWeight: 30, color: "#8E44AD" },  
            "蟠桃": { price: 20000000, minWeight: 0.1, maxWeight: 30, color: "#8E44AD" },                       
            "惊奇菇": { price: 25000000, minWeight: 0.1, maxWeight: 50, color: "#8E44AD" },
            "红毛丹": { price: 30000000, minWeight: 0.1, maxWeight: 55, color: "#8E44AD" },
            "泡泡果": { price: 40000000, minWeight: 0.1, maxWeight: 50, color: "#8E44AD" },
            "人参树": { price: 50000000, minWeight: 0.1, maxWeight: 80, color: "#8E44AD" },
            "神秘果": { price: 100000000, minWeight: 0.1, maxWeight: 100, color: "#8E44AD" },
            "佛手柑": { price: 180000000, minWeight: 0.1, maxWeight: 35, color: "#FFA500" },
            "榴莲": { price: 350000000, minWeight: 0.1, maxWeight: 45, color: "#4a3728" },
            "山竹": { price: 450000000, minWeight: 0.1, maxWeight: 40, color: "#6B2D5C" },
            "百香果": { price: 550000000, minWeight: 0.1, maxWeight: 55, color: "#8B4513" },
            "释迦果": { price: 650000000, minWeight: 0.1, maxWeight: 60, color: "#90EE90" },
            "牛油果": { price: 800000000, minWeight: 0.1, maxWeight: 38, color: "#228B22" },
            "杨桃": { price: 950000000, minWeight: 0.1, maxWeight: 42, color: "#FFD700" },
            "莲雾": { price: 1100000000, minWeight: 0.1, maxWeight: 48, color: "#DC143C" },
            "番石榴": { price: 1300000000, minWeight: 0.1, maxWeight: 52, color: "#32CD32" },
            "黄皮": { price: 1500000000, minWeight: 0.1, maxWeight: 65, color: "#DAA520" },
            "荔枝": { price: 1800000000, minWeight: 0.1, maxWeight: 68, color: "#C0392B" },
            "龙眼": { price: 2200000000, minWeight: 0.1, maxWeight: 70, color: "#B8860B" },
            "枇杷": { price: 2800000000, minWeight: 0.1, maxWeight: 72, color: "#F4A460" },
            "椰子": { price: 3500000000, minWeight: 0.1, maxWeight: 75, color: "#8B5A2B" },
            "木瓜": { price: 4500000000, minWeight: 0.1, maxWeight: 78, color: "#FF8C00" },
            "橄榄": { price: 5800000000, minWeight: 0.1, maxWeight: 80, color: "#6B8E23" },
            "余甘子": { price: 7500000000, minWeight: 0.1, maxWeight: 82, color: "#9ACD32" },
            "人心果": { price: 9500000000, minWeight: 0.1, maxWeight: 85, color: "#CD853F" },
            "蛋黄果": { price: 12000000000, minWeight: 0.1, maxWeight: 88, color: "#FFD700" },
            "蛇皮果": { price: 15000000000, minWeight: 0.1, maxWeight: 90, color: "#A0522D" },
            "嘉宝果": { price: 19000000000, minWeight: 0.1, maxWeight: 92, color: "#8B008B" },
            "诺丽果": { price: 24000000000, minWeight: 0.1, maxWeight: 95, color: "#556B2F" },
            "树葡萄": { price: 30000000000, minWeight: 0.1, maxWeight: 98, color: "#4B0082" },
            "仙人掌果": { price: 38000000000, minWeight: 0.1, maxWeight: 100, color: "#E91E63" },
            "银杏果": { price: 46000000000, minWeight: 0.1, maxWeight: 105, color: "#F0E68C" },
            "金刺梨": { price: 55000000000, minWeight: 0.1, maxWeight: 110, color: "#DAA520" },
            "沙棘果": { price: 64000000000, minWeight: 0.1, maxWeight: 115, color: "#FF8C00" },
            "血橙": { price: 72000000000, minWeight: 0.1, maxWeight: 120, color: "#B71C1C" },
            "月光果": { price: 78000000000, minWeight: 0.1, maxWeight: 125, color: "#E8EAF6" },
            "星辉果": { price: 83000000000, minWeight: 0.1, maxWeight: 130, color: "#7E57C2" },
            "霜华果": { price: 87000000000, minWeight: 0.1, maxWeight: 135, color: "#90CAF9" },
            "龙珠果": { price: 90000000000, minWeight: 0.1, maxWeight: 140, color: "#FF6F00" },
            "凤巢果": { price: 92500000000, minWeight: 0.1, maxWeight: 145, color: "#FF1744" },
            "玄冥果": { price: 94500000000, minWeight: 0.1, maxWeight: 150, color: "#1A237E" },
            "混沌果": { price: 96000000000, minWeight: 0.1, maxWeight: 155, color: "#4A148C" },
            "太虚果": { price: 97500000000, minWeight: 0.1, maxWeight: 160, color: "#263238" },
            "鸿蒙果": { price: 98500000000, minWeight: 0.1, maxWeight: 165, color: "#5D4037" },
            "永恒果": { price: 99200000000, minWeight: 0.1, maxWeight: 170, color: "#00695C" },
            "无极果": { price: 99700000000, minWeight: 0.1, maxWeight: 180, color: "#01579B" },
            "大道果": { price: 100000000000, minWeight: 0.1, maxWeight: 200, color: "#BF360C" }
        };

        /** 种子商店刷新库存：按种子价格分档随机数量 */
        function rollLandlordSeedStoreStock(seedName) {
            const price = seedProperties[seedName] ? seedProperties[seedName].price : 0;
            if (price >= 55000000001) return 1;
            if (price < 100000) return 1 + Math.floor(Math.random() * 20);
            if (price < 1000000) return 1 + Math.floor(Math.random() * 10);
            if (price < 10000000) return 1 + Math.floor(Math.random() * 8);
            if (price < 100000000) return 1 + Math.floor(Math.random() * 5);
            if (price < 1000000000) return 1 + Math.floor(Math.random() * 3);
            if (price < 10000000000) return 1 + Math.floor(Math.random() * 2);
            return 1 + Math.floor(Math.random() * 2);
        }

        // 种子刷新概率
        const refreshProbabilities = {
            "土豆": 100,
            "牵牛花": 100,
            "黄瓜": 100,
            "金桔": 100,
            "无花果": 100,
            "西瓜": 20,
            "苹果": 20,
            "香蕉": 20,
            "丝瓜": 20,
            "哈密瓜": 20,
            "猕猴桃": 20,
            "百合花": 20,
            "蓝莓": 20,
            "冰淇淋豆": 10,
            "枣树": 10,
            "茄子": 10,
            "南瓜": 10,
            "橙子": 10,
            "红茶": 10,
            "玫瑰花": 5,
            "草莓": 5,
            "樱桃": 5,
            "芒果": 5,
            "柚子": 5,
            "向日葵": 3,            
            "松树": 3,
            "茶树": 3,
            "大王菊": 3,
            "柳树": 3,
            "红袍梅": 3,
            "火龙果": 3,
            "菠萝": 2,            
            "闫闫果": 2,
            "葡萄": 2,
            "蟠桃": 2,
            "惊奇菇": 2,
            "红毛丹": 2,
            "泡泡果": 2,
            "人参树": 1,
           "神秘果": 1,
            "佛手柑": 1,
            "榴莲": 1,
            "山竹": 1,
            "百香果": 1,
            "释迦果": 1,
            "牛油果": 1,
            "杨桃": 1,
            "莲雾": 1,
            "番石榴": 1,
            "黄皮": 1,
            "荔枝": 0.5,
            "龙眼": 0.5,
            "枇杷": 0.5,
            "椰子": 0.5,
            "木瓜": 0.5,
            "橄榄": 0.5,
            "余甘子": 0.4,
            "人心果": 0.4,
            "蛋黄果": 0.4,
            "蛇皮果": 0.4,
            "嘉宝果": 0.4,
            "诺丽果": 0.2,
            "树葡萄": 0.2,
            "仙人掌果": 0.2,
            "银杏果": 0.2,
            "金刺梨": 0.2,
            "沙棘果": 0.2,
            "血橙": 0.2,
            "月光果": 0.1,
            "星辉果": 0.1,
            "霜华果": 0.1,
            "龙珠果": 0.1,
            "凤巢果": 0.1,
            "玄冥果": 0.01,
            "混沌果": 0.01,
            "太虚果": 0.01,
            "鸿蒙果": 0.01,
            "永恒果": 0.001,
            "无极果": 0.001,
            "大道果": 0.001
        };

        // 道具属性
        const itemProperties = {
            "普通浇水器": { 
                price: 2000, 
                color: "#3498db",
                refreshProbability: 100,
                description: "加速成长10分钟，如果没有特殊突变或者基础突变，2%几率特殊突变和基础突变"
            },
            "高级浇水器": { 
                price: 20000, 
                color: "#9b59b6",
                refreshProbability: 20,
                description: "加速成长20分钟，如果没有特殊突变或者基础突变，5%几率特殊突变和基础突变"
            },
            "超级浇水器": { 
                price: 100000, 
                color: "#e74c3c",
                refreshProbability: 5,
                description: "加速成长60分钟，如果没有特殊突变或者基础突变，10%几率特殊突变和基础突变"
            },
            "天气附加器": { 
                price: 500000, 
                color: "#f1c40f",
                refreshProbability: 1,
                description: "直接获得一个没有获得的天气突变"
            },
         "流星棒": { 
        price: 200000, 
        color: "#ff6b6b",
        refreshProbability: 3,
        description: "已有天气词条时，如果词条中无亮晶晶词条，则直接获得亮晶晶词条"
    },
    "火盆": { 
        price: 20000, 
        color: "#ff6b35",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无灼热词条，则直接获得灼热词条"
    },
    "吹风机": { 
        price: 200000, 
        color: "#4d96ff",
        refreshProbability: 3,
        description: "已有天气词条时，如果词条中无龙卷风词条，则直接获得龙卷风词条"
    },
    "避雷针": { 
        price: 200000, 
        color: "#ffd93d",
        refreshProbability: 2,
        description: "已有天气词条时，如果词条中无落雷词条，则直接获得落雷词条"
    },
    "雪球机": { 
        price: 20000, 
        color: "#6bc5ff",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无覆雪词条，则直接获得覆雪词条"
    },
    "催化器": { 
        price: 50000, 
        color: "#6bcf7f",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无生机词条，则直接获得生机词条"
    },
    "臭气弹": { 
        price: 50000, 
        color: "#8b5a2b",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无臭气词条，则直接获得臭气词条"
    },
    "生化弹": { 
        price: 50000, 
        color: "#6b8b3d",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无腐烂词条，则直接获得腐烂词条"
    },
    "雾霾制造器": { 
        price: 50000, 
        color: "#a9a9a9",
        refreshProbability: 5,
        description: "已有天气词条时，如果词条中无迷雾词条，则直接获得迷雾词条"
    },
    "时光沙漏": { 
        price: 150000, 
        color: "#2c3e50",
        refreshProbability: 2,
        description: "随机加速成长15~45分钟，并小概率触发基础突变"
    },
    "幸运四叶草": { 
        price: 300000, 
        color: "#27ae60",
        refreshProbability: 2,
        description: "10%几率获得一个随机未拥有的天气突变"
    },
    "大地祝福": { 
        price: 400000, 
        color: "#8B4513",
        refreshProbability: 1,
        description: "若当前无基础突变则必出基础突变，有则额外加速25分钟"
    },
    "丰收号角": { 
        price: 220000, 
        color: "#c0392b",
        refreshProbability: 2,
        description: "加速40分钟，且15%几率获得随机一个未拥有的天气词条"
    },
    "月光精华": { 
        price: 280000, 
        color: "#9b59b6",
        refreshProbability: 2,
        description: "已有天气词条时，若无比霓虹更高稀有度词条，则20%获得霓虹词条"
    },
    "闪电催化": { 
        price: 180000, 
        color: "#f1c40f",
        refreshProbability: 2,
        description: "加速20分钟并必定触发一次基础突变判定（若尚无基础突变）"
    },
    "晨曦露珠": { price: 8000, color: "#87CEEB", refreshProbability: 80, description: "加速8分钟，5%获得生机词条" },
    "烈日镜": { price: 25000, color: "#FF4500", refreshProbability: 5, description: "已有天气词条时，若无灼热则获得灼热词条" },
    "秋收镰刀": { price: 60000, color: "#DAA520", refreshProbability: 12, description: "加速成长35分钟" },
    "冬眠药剂": { price: 5000, color: "#4682B4", refreshProbability: 90, description: "加速5分钟（经济型）" },
    "春风扇": { price: 35000, color: "#98FB98", refreshProbability: 18, description: "加速12分钟，3%触发基础突变" },
    "雷云发生器": { price: 180000, color: "#4B0082", refreshProbability: 5, description: "已有天气词条时，若无落雷则获得落雷词条" },
    "彩虹喷雾": { price: 250000, color: "#FF69B4", refreshProbability: 3, description: "已有天气词条时，3%获得彩虹词条" },
    "星尘粉": { price: 95000, color: "#E6E6FA", refreshProbability: 8, description: "随机加速10~25分钟" },
    "月光瓶": { price: 120000, color: "#C0C0C0", refreshProbability: 5, description: "加速15分钟，8%获得荧光词条" },
    "日光灯": { price: 75000, color: "#FFD700", refreshProbability: 10, description: "加速18分钟" },
    "露水收集器": { price: 15000, color: "#B0E0E6", refreshProbability: 5, description: "已有天气词条时，若无潮湿则获得潮湿词条" },
    "暖阳石": { price: 45000, color: "#CD853F", refreshProbability: 15, description: "加速10分钟，10%获得沙尘词条" },
    "冰晶": { price: 55000, color: "#ADD8E6", refreshProbability: 12, description: "已有天气词条时，若无冰冻则获得冰冻词条" },
    "风铃": { price: 140000, color: "#DDA0DD", refreshProbability: 5, description: "已有天气词条时，5%获得龙卷风词条" },
    "雨伞": { price: 12000, color: "#6495ED", refreshProbability: 60, description: "已有天气词条时，若无潮湿则获得潮湿词条" }
        };
// 突变倍率
        const mutationMultipliers = {
            // 灰色词条
            "潮湿": 1, "颤栗": 1, "生机": 1, "覆雪": 1,"腐烂": 1,
            "迷雾": 1, "灼热": 1, "沙尘": 1, "结霜": 1,"臭气": 1,
            // 绿色词条
            "银": 3, "落雷": 3, "冰冻": 3, "陶化": 3,
            // 蓝色词条
            "金": 10, "荧光": 10, "彩虹": 10,"龙卷风": 10,
            // 紫色词条
            "星环": 15, "瓷化": 15, "亮晶晶": 15, "台风": 15,
            // 金色词条
            "水晶": 20, "红月": 20, "陨石": 20,
            // 彩色词条
            "流光": 25, "霓虹": 25, "渡劫": 25,
            // 田地专属词条（与银/金/水晶/流光元素词条不同；售价主要靠田地倍率，此处×1不参与元素倍率）
            "银土": 1, "金土": 1, "钻石土": 1, "流光土": 1,
            // 稀有词条
            "极光": 18, "极昼": 18,
            "霞光": 12, "霜华": 12,
            "暮色": 1, "薄雾": 1, "浓雾": 1, "细雨": 1, "阴云": 1,
            "雷暴": 3, "露珠": 3, "霜冻": 3, "微风": 3,
            "暴雨": 10, "晴空": 10, "冰雹": 10, "寒潮": 10, "季风": 10,
            "暴雪": 15, "雾凇": 15,
            "晨曦": 18, "热浪": 18, "霞蔚": 18,
            "虹彩": 22
        };

        // 田地等级：0 普通 → 1 银 → 2 金 → 3 钻石 → 4 流光；专属词条为 银土/金土/钻石土/流光土（与元素词条 银/金/水晶/流光 不同）
        const LANDLORD_FIELD_TIER_NAMES = ['普通地', '银土地', '金土地', '钻石土地', '流光土地'];
        const LANDLORD_TIER_LAND_AFFIX = ['', '银土', '金土', '钻石土', '流光土'];
        const LANDLORD_ALL_LAND_AFFIXES = ['银土', '金土', '钻石土', '流光土'];
        const LANDLORD_ELEMENT_BASIC_MUTATIONS = ['银', '金', '水晶', '流光'];
        const LANDLORD_TIER_EXCLUSIVE_PRICE_MULT = { '银土': 2, '金土': 3, '钻石土': 5, '流光土': 10 };
        const LANDLORD_TIER_UPGRADE_COST = [
            { barKey: 'silver', label: '银条', amount: 50 },
            { barKey: 'gold', label: '金条', amount: 50 },
            { barKey: 'diamond', label: '钻石条', amount: 50 },
            { barKey: 'flow', label: '流光条', amount: 50 }
        ];

        // 通天藤：果实类目顺序与种子合成链一致（土豆→…→大道果），每级需100个对应果实；每级世界地图经验+5%
        const LANDLORD_SKY_VINE_FRUIT_ORDER = ['土豆', '金桔', '牵牛花', '无花果', '黄瓜', '西瓜', '猕猴桃', '百合花', '枣树', '蓝莓', '苹果', '丝瓜', '香蕉', '哈密瓜', '冰淇淋豆', '南瓜', '红茶', '橙子', '玫瑰花', '茄子', '草莓', '芒果', '樱桃', '柚子', '向日葵', '松树', '茶树', '大王菊', '红袍梅', '火龙果', '柳树', '闫闫果', '菠萝', '葡萄', '蟠桃', '惊奇菇', '红毛丹', '泡泡果', '人参树', '神秘果', '佛手柑', '榴莲', '山竹', '百香果', '释迦果', '牛油果', '杨桃', '莲雾', '番石榴', '黄皮', '荔枝', '龙眼', '枇杷', '椰子', '木瓜', '橄榄', '余甘子', '人心果', '蛋黄果', '蛇皮果', '嘉宝果', '诺丽果', '树葡萄', '仙人掌果', '银杏果', '金刺梨', '沙棘果', '血橙', '月光果', '星辉果', '霜华果', '龙珠果', '凤巢果', '玄冥果', '混沌果', '太虚果', '鸿蒙果', '永恒果', '无极果', '大道果'];
        const LANDLORD_SKY_VINE_FRUIT_PER_LEVEL = 100;
        const LANDLORD_SKY_VINE_WORLD_EXP_PER_LEVEL = 0.05;
        window.__landlordSkyVineConstantsReady = true;

        // 基因树：与通天藤同果实顺序，上交对应基因突变果实；每级需500个；共4棵树各80级
        const LANDLORD_GENE_TREE_FRUIT_PER_LEVEL = 500;
        const LANDLORD_GENE_TREE_ORDER = ['彩光', '炫彩', '琉璃', '琥珀'];
        const LANDLORD_GENE_TREE_DEFS = {
            '彩光': { icon: '🌈', attackPerLevel: 1, healthPerLevel: 0, critDamagePerLevel: 0, expPerLevel: 0, sub: '每级世界地图总攻击 +100%' },
            '炫彩': { icon: '✨', attackPerLevel: 0, healthPerLevel: 1, critDamagePerLevel: 0, expPerLevel: 0, sub: '每级世界地图总生命 +100%' },
            '琉璃': { icon: '💎', attackPerLevel: 3, healthPerLevel: 3, critDamagePerLevel: 3, expPerLevel: 0, sub: '每级世界地图攻击/生命/爆伤各 +300%' },
            '琥珀': { icon: '🔶', attackPerLevel: 0, healthPerLevel: 0, critDamagePerLevel: 0, expPerLevel: 0.1, sub: '每级世界地图总经验 +10%' }
        };
        window.__landlordGeneTreeConstantsReady = true;

        // 特殊突变
        const specialMutations = {
            "土豆": "薯片",
            "牵牛花": "牛郎", 
            "黄瓜": "黄瓜蛇",
            "西瓜": "方形",
            "金桔": "桔王",
            "无花果": "芜湖",
            "苹果": "糖葫芦",
            "枣树": "大枣王",
            "香蕉": "橡胶猴",
            "丝瓜": "丝雨",
            "茄子": "巨无霸",
            "红茶": "冰红茶",
            "草莓": "连体",
            "哈密瓜": "哈批",
            "樱桃": "双胞胎",
            "猕猴桃": "齐天大圣",
            "冰淇淋豆": "冰淇淋",
            "向日葵": "海绵宝宝",
            "大王菊": "超人菊", 
            "红袍梅": "红袍尊者",
            "玫瑰花": "爱心",
            "柚子": "柚水",
            "蓝莓": "蓝颜知己",
            "百合花": "友情",
            "惊奇菇": "奥特曼",
            "葡萄": "菩提祖师",
            "松树": "三只松鼠",
            "茶树": "茶茶萝莉",
            "蟠桃": "仙桃",
           "红毛丹": "仙丹",
           "闫闫果": "小闫闫",
           "人参树": "人参果",
           "菠萝": "菠萝吹雪",
            "泡泡果": "泡神",
             "柳树": "柳神",
           "火龙果": "火龙真身",
           "神秘果": "未来之心",
            "南瓜": "万圣节",
            "佛手柑": "佛手观音",
            "榴莲": "榴莲王",
            "山竹": "山竹仙子",
            "百香果": "百香王",
            "释迦果": "释迦尊者",
            "牛油果": "牛油果王",
            "杨桃": "五星杨桃",
            "莲雾": "莲雾仙子",
            "番石榴": "番石榴尊者",
            "黄皮": "黄皮大圣",
            "荔枝": "荔枝王",
            "龙眼": "龙眼尊者",
            "枇杷": "枇杷仙子",
            "椰子": "椰岛之王",
            "木瓜": "木瓜大帝",
            "橄榄": "橄榄仙翁",
            "余甘子": "余甘仙果",
            "人心果": "人心合一",
            "蛋黄果": "金蛋黄",
            "蛇皮果": "蛇王果",
            "嘉宝果": "嘉宝之星",
            "诺丽果": "诺丽神果",
            "树葡萄": "紫晶葡萄",
            "仙人掌果": "仙人掌王",
            "银杏果": "银杏仙子",
            "金刺梨": "金刺帝",
            "沙棘果": "沙棘战神",
            "血橙": "血月橙",
            "月光果": "月华之种",
            "星辉果": "星辉圣果",
            "霜华果": "霜华灵果",
            "龙珠果": "龙珠真身",
            "凤巢果": "凤凰巢",
            "玄冥果": "玄冥真果",
            "混沌果": "混沌初开",
            "太虚果": "太虚之核",
            "鸿蒙果": "鸿蒙种子",
            "永恒果": "永恒之心",
            "无极果": "无极之道",
            "大道果": "大道至果"
        };

        // 天气列表
        const weatherList = [
            "潮湿", "颤栗", "生机", "覆雪", "迷雾","冰冻", "陶化", "瓷化","臭气",
            "灼热", "沙尘", "结霜", "落雷", "荧光","龙卷风","台风","腐烂",
            "彩虹", "星环", "亮晶晶", "霓虹", "红月", "渡劫", "陨石",
            "极光", "极昼",
            "霞光", "霜华",
            "暮色", "晨曦", "薄雾", "浓雾", "雷暴", "细雨", "暴雨", "晴空", "阴云", "露珠", "霜冻", "冰雹", "热浪", "寒潮", "季风", "微风", "暴雪", "雾凇", "霞蔚", "虹彩"
        ];

        // 天气突变颜色映射
        const weatherMutationColors = {
            "潮湿": "grey",      // 灰色
            "腐烂": "grey", 
            "臭气": "grey", 
            "颤栗": "grey",    // 灰色
            "生机": "grey",     // 灰色
            "覆雪": "grey",           // 灰色
            "迷雾": "grey",           // 灰色
            "灼热": "grey",         // 灰色
            "沙尘": "grey",         // 灰色
            "结霜": "grey",     // 灰色
            "落雷": "green",          // 绿色
            "冰冻": "green", 
            "陶化": "green", 
            "荧光": "blue",           // 蓝色
            "龙卷风": "blue",  
            "彩虹": "rainbow",        // 彩虹色
            "星环": "purple",         // 紫色
            "瓷化": "purple",  
            "亮晶晶": "purple",
            "台风": "purple",  
            "霓虹": "rainbow",        // 彩虹色
            "渡劫": "rainbow",
            "陨石": "gold", 
            "红月": "gold",           // 金色
            "极光": "purple",
            "极昼": "blue",
            "霞光": "gold",
            "霜华": "green",
            "暮色": "grey", "晨曦": "gold", "薄雾": "grey", "浓雾": "grey", "雷暴": "green", "细雨": "grey", "暴雨": "blue", "晴空": "blue", "阴云": "grey", "露珠": "green", "霜冻": "green", "冰雹": "blue", "热浪": "gold", "寒潮": "blue", "季风": "blue", "微风": "green", "暴雪": "purple", "雾凇": "purple", "霞蔚": "gold", "虹彩": "rainbow"
                    };
const seedSynthesisRules = {
    "土豆": {
        nextLevel: "金桔",
        required: 3,
        description: "3个土豆可合成1个金桔种子"
    },
    "金桔": {
        nextLevel: "牵牛花",
        required: 3,
        description: "3个金桔可合成1个牵牛花种子"
    },
    "牵牛花": {
        nextLevel: "无花果", 
        required: 3,
        description: "3个牵牛花可合成1个无花果种子"
    },
       "无花果": {
        nextLevel: "黄瓜", 
        required: 3,
        description: "3个无花果可合成1个黄瓜种子"
    },
    "黄瓜": {
        nextLevel: "西瓜",
        required: 3,
        description: "3个黄瓜可合成1个西瓜种子"
    },
    "西瓜": {
        nextLevel: "猕猴桃",
        required: 3,
        description: "3个西瓜可合成1个猕猴桃种子"
    },
    "猕猴桃": {
        nextLevel: "百合花",
        required: 3,
        description: "3个猕猴桃可合成1个百合花种子"
    },
    "百合花": {
        nextLevel: "枣树",
        required: 3,
        description: "3个百合花可合成1个枣树种子"
    },
    "枣树": {
        nextLevel: "蓝莓",
        required: 3,
        description: "3个枣树可合成1个蓝莓种子"
    },
    "蓝莓": {
        nextLevel: "苹果",
        required: 3,
        description: "3个蓝莓可合成1个苹果种子"
    },
    "苹果": {
        nextLevel: "丝瓜",
        required: 3,
        description: "3个苹果可合成1个丝瓜种子"
    },
    "丝瓜": {
        nextLevel: "香蕉",
        required: 3,
        description: "3个丝瓜可合成1个香蕉种子"
    },
    "香蕉": {
        nextLevel: "哈密瓜",
        required: 3,
        description: "3个香蕉可合成1个哈密瓜种子"
    },
    "哈密瓜": {
        nextLevel: "冰淇淋豆",
        required: 3,
        description: "3个哈密瓜可合成1个冰淇淋豆种子"
    },
    "冰淇淋豆": {
        nextLevel: "南瓜",
        required: 3,
        description: "3个冰淇淋豆可合成1个南瓜种子"
    },
    "南瓜": {
        nextLevel: "红茶",
        required: 3,
        description: "3个南瓜可合成1个红茶种子"
    },
    "红茶": {
        nextLevel: "橙子",
        required: 3,
        description: "3个红茶可合成1个橙子种子"
    },
    "橙子": {
        nextLevel: "玫瑰花",
        required: 3,
        description: "3个橙子可合成1个玫瑰花种子"
    },
    "玫瑰花": {
        nextLevel: "茄子",
        required: 3,
        description: "3个玫瑰花可合成1个茄子种子"
    },
    "茄子": {
        nextLevel: "草莓",
        required: 3,
        description: "3个茄子可合成1个草莓种子"
    },
    "草莓": {
        nextLevel: "芒果",
        required: 3,
        description: "3个草莓可合成1个芒果种子"
    },
    "芒果": {
        nextLevel: "樱桃",
        required: 3,
        description: "3个芒果可合成1个樱桃种子"
    },
    "樱桃": {
        nextLevel: "柚子",
        required: 3,
        description: "3个樱桃可合成1个柚子种子"
    },
    "柚子": {
        nextLevel: "向日葵",
        required: 3,
        description: "3个柚子可合成1个向日葵种子"
    },
    "向日葵": {
        nextLevel: "松树",
        required: 3,
        description: "3个向日葵可合成1个松树种子"
    },
    "松树": {
        nextLevel: "茶树",
        required: 3,
        description: "3个松树可合成1个茶树种子"
    },
    "茶树": {
        nextLevel: "大王菊",
        required: 3,
        description: "3个茶树可合成1个大王菊种子"
    },
    "大王菊": {
        nextLevel: "红袍梅",
        required: 3,
        description: "3个大王菊可合成1个红袍梅种子"
    },
    "红袍梅": {
        nextLevel: "火龙果",
        required: 3,
        description: "3个红袍梅可合成1个火龙果种子"
    },
    "火龙果": {
        nextLevel: "柳树",
        required: 3,
        description: "3个火龙果可合成1个柳树种子"
    },
    "柳树": {
        nextLevel: "闫闫果",
        required: 3,
        description: "3个柳树可合成1个闫闫果种子"
    },
    "闫闫果": {
        nextLevel: "菠萝",
        required: 3,
        description: "3个闫闫果可合成1个菠萝种子"
    },
    "菠萝": {
        nextLevel: "葡萄",
        required: 3,
        description: "3个菠萝可合成1个葡萄种子"
    },
    "葡萄": {
        nextLevel: "蟠桃",
        required: 3,
        description: "3个葡萄可合成1个蟠桃种子"
    },
    "蟠桃": {
        nextLevel: "惊奇菇",
        required: 3,
        description: "3个蟠桃可合成1个惊奇菇种子"
    },
    "惊奇菇": {
        nextLevel: "红毛丹",
        required: 3,
        description: "3个惊奇菇可合成1个红毛丹种子"
    },
    "红毛丹": {
        nextLevel: "泡泡果",
        required: 3,
        description: "3个红毛丹可合成1个泡泡果种子"
    },
    "泡泡果": {
        nextLevel: "人参树",
        required: 3,
        description: "3个泡泡果可合成1个人参树种子"
    },
    "人参树": {
        nextLevel: "神秘果",
        required: 3,
        description: "3个人参树可合成1个神秘果种子"
    },
    "神秘果": {
        nextLevel: "佛手柑",
        required: 3,
        description: "3个神秘果可合成1个佛手柑种子"
    },
    "佛手柑": {
        nextLevel: "榴莲",
        required: 3,
        description: "3个佛手柑可合成1个榴莲种子"
    },
    "榴莲": {
        nextLevel: "山竹",
        required: 3,
        description: "3个榴莲可合成1个山竹种子"
    },
    "山竹": {
        nextLevel: "百香果",
        required: 3,
        description: "3个山竹可合成1个百香果种子"
    },
    "百香果": {
        nextLevel: "释迦果",
        required: 3,
        description: "3个百香果可合成1个释迦果种子"
    },
    "释迦果": {
        nextLevel: "牛油果",
        required: 3,
        description: "3个释迦果可合成1个牛油果种子"
    },
    "牛油果": {
        nextLevel: "杨桃",
        required: 3,
        description: "3个牛油果可合成1个杨桃种子"
    },
    "杨桃": {
        nextLevel: "莲雾",
        required: 3,
        description: "3个杨桃可合成1个莲雾种子"
    },
    "莲雾": {
        nextLevel: "番石榴",
        required: 3,
        description: "3个莲雾可合成1个番石榴种子"
    },
    "番石榴": {
        nextLevel: "黄皮",
        required: 3,
        description: "3个番石榴可合成1个黄皮种子"
    },
    "黄皮": {
        nextLevel: "荔枝",
        required: 3,
        description: "3个黄皮可合成1个荔枝种子"
    },
    "荔枝": {
        nextLevel: "龙眼",
        required: 3,
        description: "3个荔枝可合成1个龙眼种子"
    },
    "龙眼": {
        nextLevel: "枇杷",
        required: 3,
        description: "3个龙眼可合成1个枇杷种子"
    },
    "枇杷": {
        nextLevel: "椰子",
        required: 3,
        description: "3个枇杷可合成1个椰子种子"
    },
    "椰子": {
        nextLevel: "木瓜",
        required: 3,
        description: "3个椰子可合成1个木瓜种子"
    },
    "木瓜": {
        nextLevel: "橄榄",
        required: 3,
        description: "3个木瓜可合成1个橄榄种子"
    },
    "橄榄": {
        nextLevel: "余甘子",
        required: 3,
        description: "3个橄榄可合成1个余甘子种子"
    },
    "余甘子": {
        nextLevel: "人心果",
        required: 3,
        description: "3个余甘子可合成1个人心果种子"
    },
    "人心果": {
        nextLevel: "蛋黄果",
        required: 3,
        description: "3个人心果可合成1个蛋黄果种子"
    },
    "蛋黄果": {
        nextLevel: "蛇皮果",
        required: 3,
        description: "3个蛋黄果可合成1个蛇皮果种子"
    },
    "蛇皮果": {
        nextLevel: "嘉宝果",
        required: 3,
        description: "3个蛇皮果可合成1个嘉宝果种子"
    },
    "嘉宝果": {
        nextLevel: "诺丽果",
        required: 3,
        description: "3个嘉宝果可合成1个诺丽果种子"
    },
    "诺丽果": {
        nextLevel: "树葡萄",
        required: 3,
        description: "3个诺丽果可合成1个树葡萄种子"
    },
    "树葡萄": {
        nextLevel: "仙人掌果",
        required: 3,
        description: "3个树葡萄可合成1个仙人掌果种子"
    },
    "仙人掌果": {
        nextLevel: "银杏果",
        required: 3,
        description: "3个仙人掌果可合成1个银杏果种子"
    },
    "银杏果": {
        nextLevel: "金刺梨",
        required: 3,
        description: "3个银杏果可合成1个金刺梨种子"
    },
    "金刺梨": {
        nextLevel: "沙棘果",
        required: 3,
        description: "3个金刺梨可合成1个沙棘果种子"
    },
    "沙棘果": {
        nextLevel: "血橙",
        required: 3,
        description: "3个沙棘果可合成1个血橙种子"
    },
    "血橙": {
        nextLevel: "月光果",
        required: 3,
        description: "3个血橙可合成1个月光果种子"
    },
    "月光果": {
        nextLevel: "星辉果",
        required: 3,
        description: "3个月光果可合成1个星辉果种子"
    },
    "星辉果": {
        nextLevel: "霜华果",
        required: 3,
        description: "3个星辉果可合成1个霜华果种子"
    },
    "霜华果": {
        nextLevel: "龙珠果",
        required: 3,
        description: "3个霜华果可合成1个龙珠果种子"
    },
    "龙珠果": {
        nextLevel: "凤巢果",
        required: 3,
        description: "3个龙珠果可合成1个凤巢果种子"
    },
    "凤巢果": {
        nextLevel: "玄冥果",
        required: 3,
        description: "3个凤巢果可合成1个玄冥果种子"
    },
    "玄冥果": {
        nextLevel: "混沌果",
        required: 3,
        description: "3个玄冥果可合成1个混沌果种子"
    },
    "混沌果": {
        nextLevel: "太虚果",
        required: 3,
        description: "3个混沌果可合成1个太虚果种子"
    },
    "太虚果": {
        nextLevel: "鸿蒙果",
        required: 3,
        description: "3个太虚果可合成1个鸿蒙果种子"
    },
    "鸿蒙果": {
        nextLevel: "永恒果",
        required: 3,
        description: "3个鸿蒙果可合成1个永恒果种子"
    },
    "永恒果": {
        nextLevel: "无极果",
        required: 3,
        description: "3个永恒果可合成1个无极果种子"
    },
    "无极果": {
        nextLevel: "大道果",
        required: 3,
        description: "3个无极果可合成1个大道果种子"
    },
    "大道果": {
        nextLevel: null, // 最高级，无法再合成
        required: 0,
        description: "大道果是最高级种子，无法继续合成"
    }
};

/** 基因合成变异：彩光2×、炫彩3×、琉璃5×、琥珀10× 果实基础价 */
const LANDLORD_GENE_VARIANTS = {
    '彩光': { multiplier: 2, color: '#00cec9', cssClass: 'landlord-gene-caiguang' },
    '炫彩': { multiplier: 3, color: '#1e90ff', cssClass: 'landlord-gene-xuancai' },
    '琉璃': { multiplier: 5, color: '#74b9ff', cssClass: 'landlord-gene-liuli' },
    '琥珀': { multiplier: 10, color: '#fdcb6e', cssClass: 'landlord-gene-hupo' }
};
const LANDLORD_GENE_VARIANT_ORDER = ['彩光', '炫彩', '琉璃', '琥珀'];
const LANDLORD_GENE_VARIANT_WEIGHTS = [80, 14, 5, 1];
const LANDLORD_GENE_SYNTHESIS_VARIANT_CHANCE = 0.4;

function parseLandlordSeedKey(seedKey) {
    if (!seedKey || typeof seedKey !== 'string') {
        return { baseName: seedKey, variant: null, displayName: seedKey };
    }
    const match = seedKey.match(/^(.+?)（(彩光|炫彩|琉璃|琥珀)）$/);
    if (match && LANDLORD_GENE_VARIANTS[match[2]]) {
        return { baseName: match[1], variant: match[2], displayName: seedKey };
    }
    return { baseName: seedKey, variant: null, displayName: seedKey };
}

function formatLandlordVariantSeedName(baseName, variant) {
    return baseName + '（' + variant + '）';
}

function getLandlordSeedProperties(seedKey) {
    const parsed = parseLandlordSeedKey(seedKey);
    const base = seedProperties[parsed.baseName];
    if (!base) return null;
    if (!parsed.variant) return Object.assign({}, base);
    const vd = LANDLORD_GENE_VARIANTS[parsed.variant];
    return Object.assign({}, base, {
        price: base.price * vd.multiplier,
        color: vd.color,
        geneVariant: parsed.variant,
        geneMultiplier: vd.multiplier
    });
}

function getLandlordSeedBaseName(seedKey) {
    return parseLandlordSeedKey(seedKey).baseName;
}

function getLandlordGeneVariantLabelHtml(seedKey) {
    const parsed = parseLandlordSeedKey(seedKey);
    if (!parsed.variant) return parsed.displayName;
    const vd = LANDLORD_GENE_VARIANTS[parsed.variant];
    return '<span class="' + vd.cssClass + '">' + parsed.displayName + '</span>';
}

function rollLandlordGeneVariant() {
    const total = LANDLORD_GENE_VARIANT_WEIGHTS.reduce(function (a, b) { return a + b; }, 0);
    let r = Math.random() * total;
    for (let i = 0; i < LANDLORD_GENE_VARIANT_ORDER.length; i++) {
        r -= LANDLORD_GENE_VARIANT_WEIGHTS[i];
        if (r <= 0) return LANDLORD_GENE_VARIANT_ORDER[i];
    }
    return '彩光';
}

function getLandlordSeedsInPriceRange(minPrice, maxPrice) {
    const lo = Math.min(minPrice, maxPrice);
    const hi = Math.max(minPrice, maxPrice);
    const order = typeof LANDLORD_SKY_VINE_FRUIT_ORDER !== 'undefined'
        ? LANDLORD_SKY_VINE_FRUIT_ORDER
        : Object.keys(seedProperties);
    return order.filter(function (name) {
        const p = seedProperties[name];
        return p && p.price >= lo && p.price <= hi;
    });
}

function performLandlordGeneSynthesis(selectedSeeds) {
    if (!selectedSeeds || selectedSeeds.length !== 3) {
        return { ok: false, message: '请选择3个种子！' };
    }
    for (let i = 0; i < selectedSeeds.length; i++) {
        const s = selectedSeeds[i];
        if (!getLandlordSeedProperties(s)) {
            return { ok: false, message: '种子「' + s + '」无效！' };
        }
        if (!player.landlord.seedStorage[s] || player.landlord.seedStorage[s] < 1) {
            return { ok: false, message: '种子「' + s + '」数量不足！' };
        }
    }
    const usage = {};
    for (let j = 0; j < selectedSeeds.length; j++) {
        const key = selectedSeeds[j];
        usage[key] = (usage[key] || 0) + 1;
    }
    for (const key in usage) {
        if ((player.landlord.seedStorage[key] || 0) < usage[key]) {
            return { ok: false, message: '种子「' + key + '」数量不足！' };
        }
    }
    for (const key in usage) {
        player.landlord.seedStorage[key] -= usage[key];
        if (player.landlord.seedStorage[key] <= 0) delete player.landlord.seedStorage[key];
    }
    const prices = selectedSeeds.map(function (s) {
        return seedProperties[getLandlordSeedBaseName(s)].price;
    });
    const candidates = getLandlordSeedsInPriceRange(Math.min.apply(null, prices), Math.max.apply(null, prices));
    if (!candidates.length) {
        return { ok: false, message: '无法确定合成结果！' };
    }
    const outputBase = candidates[Math.floor(Math.random() * candidates.length)];
    let outputSeed = outputBase;
    let variant = null;
    if (Math.random() < LANDLORD_GENE_SYNTHESIS_VARIANT_CHANCE) {
        variant = rollLandlordGeneVariant();
        outputSeed = formatLandlordVariantSeedName(outputBase, variant);
    }
    if (!player.landlord.seedStorage[outputSeed]) player.landlord.seedStorage[outputSeed] = 0;
    player.landlord.seedStorage[outputSeed]++;
    player.landlord.stats.geneSynthesisCount = (player.landlord.stats.geneSynthesisCount || 0) + 1;
    player.landlord.stats.synthesisCount = (player.landlord.stats.synthesisCount || 0) + 1;
    return { ok: true, outputSeed: outputSeed, outputBase: outputBase, variant: variant };
}

const lotterySystem = {
    // 可抽奖的词条
    eligibleMutations: ["银", "金", "水晶", "流光"],
    
    // 奖品池
    prizePool: [
              { name: "西瓜", probability: 25,  weight: 1  },
         { name: "猕猴桃",  probability: 20,  weight: 1  },
        { name: "百合花", probability: 20,  weight: 1  },
          { name: "枣树", probability: 10,  weight: 1  },
        { name: "苹果", probability: 5,  weight: 1  },
        { name: "香蕉", probability: 4,  weight: 1  },
         { name: "冰淇淋豆", probability: 3,  weight: 1  },
        { name: "橙子", probability: 2,  weight: 1  },
       { name: "茄子", probability: 1,  weight: 1 },
       { name: "芒果", probability: 0.72,  weight: 1  },
       { name: "柚子", probability: 0.72,  weight: 1  },
       { name: "茶树", probability: 0.42,  weight: 1  },
       { name: "红袍梅", probability: 0.42,  weight: 1  },
     { name: "柳树", probability: 0.22,  weight: 1  },
      { name: "蟠桃", probability: 0.22,  weight: 1  },
      { name: "红毛丹", probability: 0.1,  weight: 1  },
        { name: "人参树", probability: 0.1,  weight: 1  },
      { name: "榴莲", probability: 0.01,  weight: 1  },
      { name: "百香果", probability: 0.001,  weight: 1  },
      { name: "杨桃", probability: 0.001,  weight: 1  },
        { name: "随机牧场动物", probability: 10, weight: 1, prizeType: "ranchAnimal" }
    ],
    
    // 抽奖消耗
    costPerDraw: 1, // 每次抽奖消耗1次抽奖次数
    
    // 初始化抽奖概率
    initPrizeProbabilities: function() {
        let totalProbability = 0;
        this.prizePool.forEach(prize => {
            totalProbability += prize.probability;
        });
        
        // 计算实际概率
        this.prizePool.forEach(prize => {
            prize.actualProbability = (prize.probability / totalProbability * 100).toFixed(2);
        });
    }
};

// 初始化抽奖概率
lotterySystem.initPrizeProbabilities();

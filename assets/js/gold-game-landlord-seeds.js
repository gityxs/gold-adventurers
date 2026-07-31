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
    "雨伞": { price: 12000, color: "#6495ED", refreshProbability: 60, description: "已有天气词条时，若无潮湿则获得潮湿词条" },
    /* —— 稀有 / 高级道具 —— */
    "星陨杖": { price: 480000, color: "#7B68EE", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无星陨则直接获得星陨词条（×15）（仅抽奖获得）" },
    "幻潮珠": { price: 520000, color: "#00CED1", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无幻潮则直接获得幻潮词条（×16）（仅抽奖获得）" },
    "雷狱柱": { price: 560000, color: "#8A2BE2", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无雷狱则直接获得雷狱词条（×16）（仅抽奖获得）" },
    "霜龙笛": { price: 580000, color: "#B0C4DE", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无霜龙则直接获得霜龙词条（×17）（仅抽奖获得）" },
    "日曜镜": { price: 720000, color: "#FF8C00", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无日曜则直接获得日曜词条（×20）（仅抽奖获得）" },
    "月蚀灯": { price: 750000, color: "#708090", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无月蚀则直接获得月蚀词条（×21）（仅抽奖获得）" },
    "焚天炉": { price: 800000, color: "#DC143C", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无焚天则直接获得焚天词条（×21）（仅抽奖获得）" },
    "苍穹卷轴": { price: 850000, color: "#4169E1", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无苍穹裂则直接获得苍穹裂词条（×22）（仅抽奖获得）" },
    "虚空棱镜": { price: 980000, color: "#483D8B", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，8%获得虚空潮词条（×26）（仅抽奖获得）" },
    "神罚符": { price: 1050000, color: "#FFD700", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，5%获得神罚雷词条（×27）（仅抽奖获得）" },
    "混沌瓶": { price: 1200000, color: "#4B0082", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，3%获得混沌雨词条（×28）（仅抽奖获得）" },
    "天道铃": { price: 1350000, color: "#FF1493", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，2%获得天道虹词条（×30）（仅抽奖获得）" },
    "创世喷雾": { price: 1500000, color: "#FF69B4", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，1.5%获得创世霞词条（×30）（仅抽奖获得）" },
    "永恒极光仪": { price: 1600000, color: "#00FA9A", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，1%获得永恒极光词条（×32）（仅抽奖获得）" },
    "仙霓壶": { price: 2800000, color: "#7FFFD4", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.5%获得仙霓词条（×50）（仅抽奖获得）" },
    "圣劫印": { price: 4500000, color: "#E6C200", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.2%获得圣劫词条（×100）（仅抽奖获得）" },
    "至道玉": { price: 8000000, color: "#FFF8DC", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.08%获得至道词条（×200）（仅抽奖获得）" },
    "紫金匣": { price: 900000, color: "#DAA520", refreshProbability: 0, lotteryOnly: true, description: "直接获得一个尚未拥有的金色天气词条（仅抽奖获得）" },
    "虹彩敕": { price: 1800000, color: "#FF69B4", refreshProbability: 0, lotteryOnly: true, description: "直接获得一个尚未拥有的彩色天气词条（仅抽奖获得）" },
    "超彩残卷": { price: 5000000, color: "#E0FFFF", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，3%随机获得一个尚未拥有的超彩天气词条（仅抽奖获得）" },
    /* —— 新增多量稀有道具（仅抽奖） —— */
    "紫电符": { price: 500000, color: "#9B59B6", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无紫电则直接获得紫电（×15）（仅抽奖）" },
    "冥潮珠": { price: 510000, color: "#5D6D7E", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无冥潮则直接获得冥潮（×15）（仅抽奖）" },
    "冰魄镜": { price: 530000, color: "#AED6F1", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无冰魄则直接获得冰魄（×16）（仅抽奖）" },
    "星砂袋": { price: 540000, color: "#F5B7B1", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无星砂则直接获得星砂（×16）（仅抽奖）" },
    "玄霜瓶": { price: 550000, color: "#D6EAF8", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无玄霜则直接获得玄霜（×16）（仅抽奖）" },
    "雷蟒鞭": { price: 570000, color: "#8E44AD", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无雷蟒则直接获得雷蟒（×17）（仅抽奖）" },
    "暗潮螺": { price: 575000, color: "#1A5276", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无暗潮则直接获得暗潮（×17）（仅抽奖）" },
    "雪凰羽": { price: 580000, color: "#FCF3CF", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无雪凰则直接获得雪凰（×17）（仅抽奖）" },
    "魔岚扇": { price: 600000, color: "#6C3483", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无魔岚则直接获得魔岚（×18）（仅抽奖）" },
    "幽萤灯": { price: 610000, color: "#58D68D", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无幽萤则直接获得幽萤（×18）（仅抽奖）" },
    "金乌镜": { price: 740000, color: "#E67E22", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无金乌则直接获得金乌（×20）（仅抽奖）" },
    "银蟾灯": { price: 760000, color: "#BDC3C7", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无银蟾则直接获得银蟾（×20）（仅抽奖）" },
    "劫火炉": { price: 780000, color: "#C0392B", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无劫火则直接获得劫火（×21）（仅抽奖）" },
    "天裂卷": { price: 800000, color: "#2980B9", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无天裂则直接获得天裂（×21）（仅抽奖）" },
    "帝晖印": { price: 820000, color: "#F4D03F", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无帝晖则直接获得帝晖（×21）（仅抽奖）" },
    "龙息笛": { price: 860000, color: "#1ABC9C", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无龙息则直接获得龙息（×22）（仅抽奖）" },
    "凤羽扇": { price: 870000, color: "#E74C3C", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无凤羽则直接获得凤羽（×22）（仅抽奖）" },
    "星坠杖": { price: 880000, color: "#5B2C6F", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无星坠则直接获得星坠（×22）（仅抽奖）" },
    "月华刃": { price: 890000, color: "#85929E", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无月华杀则直接获得月华杀（×22）（仅抽奖）" },
    "日冕冠": { price: 900000, color: "#F39C12", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，若无日冕则直接获得日冕（×22）（仅抽奖）" },
    "万法潮瓶": { price: 1000000, color: "#3498DB", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，8%获得万法潮（×26）（仅抽奖）" },
    "九霄雷符": { price: 1080000, color: "#8E44AD", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，6%获得九霄雷（×27）（仅抽奖）" },
    "阴阳雨壶": { price: 1150000, color: "#2C3E50", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，5%获得阴阳雨（×28）（仅抽奖）" },
    "诸天虹铃": { price: 1250000, color: "#E91E63", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，4%获得诸天虹（×29）（仅抽奖）" },
    "开天霞雾": { price: 1320000, color: "#FF8A65", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，3.5%获得开天霞（×30）（仅抽奖）" },
    "不灭极光仪": { price: 1450000, color: "#00BCD4", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，3%获得不灭极光（×31）（仅抽奖）" },
    "轮回霓珠": { price: 1550000, color: "#AB47BC", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，2.5%获得轮回霓（×32）（仅抽奖）" },
    "破界渡符": { price: 1650000, color: "#FF7043", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，2%获得破界渡（×33）（仅抽奖）" },
    "星河瀑瓶": { price: 1700000, color: "#5C6BC0", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，1.8%获得星河瀑（×34）（仅抽奖）" },
    "神域岚灯": { price: 1750000, color: "#26A69A", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，1.5%获得神域岚（×34）（仅抽奖）" },
    "道韵潮鼎": { price: 1850000, color: "#7E57C2", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，1.2%获得道韵潮（×35）（仅抽奖）" },
    "元初虹玉": { price: 1900000, color: "#EC407A", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，1%获得元初虹（×35）（仅抽奖）" },
    "瑶光劫壶": { price: 2600000, color: "#80DEEA", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.4%获得瑶光劫（×48）（仅抽奖）" },
    "紫微霓印": { price: 2700000, color: "#CE93D8", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.35%获得紫微霓（×52）（仅抽奖）" },
    "天河裂卷": { price: 2900000, color: "#90CAF9", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.3%获得天河裂（×55）（仅抽奖）" },
    "帝星陨杖": { price: 4200000, color: "#FFD54F", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.15%获得帝星陨（×85）（仅抽奖）" },
    "昊天劫印": { price: 4600000, color: "#FFB74D", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.12%获得昊天劫（×95）（仅抽奖）" },
    "太上极光仪": { price: 9000000, color: "#FFF59D", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.015%获得太上极光（×220）（仅抽奖）" },
    "月阙岚瓶": { price: 2750000, color: "#81D4FA", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.32%获得月阙岚（×54）（仅抽奖）" },
    "青霄霓印": { price: 2850000, color: "#80CBC4", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.28%获得青霄霓（×56）（仅抽奖）" },
    "灵泉劫壶": { price: 3000000, color: "#A5D6A7", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.25%获得灵泉劫（×62）（仅抽奖）" },
    "紫极罚符": { price: 4800000, color: "#B39DDB", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.1%获得紫极罚（×105）（仅抽奖）" },
    "穹苍陨杖": { price: 5200000, color: "#FFCC80", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.08%获得穹苍陨（×115）（仅抽奖）" },
    "天衡劫印": { price: 5600000, color: "#FFE082", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.06%获得天衡劫（×125）（仅抽奖）" },
    "混沌元珠": { price: 7200000, color: "#F8BBD0", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.04%获得混沌元（×165）（仅抽奖）" },
    "玄黄裂卷": { price: 8000000, color: "#FFE0B2", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.025%获得玄黄裂（×190）（仅抽奖）" },
    "无极霞玉": { price: 9500000, color: "#E1BEE7", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，0.012%获得无极霞（×230）（仅抽奖）" },
    "紫霄匣": { price: 850000, color: "#9C27B0", refreshProbability: 0, lotteryOnly: true, description: "直接获得一个尚未拥有的紫色天气词条（仅抽奖）" },
    "元素坩埚": { price: 950000, color: "#FF5722", refreshProbability: 0, lotteryOnly: true, description: "若尚无基础词，25%必出基础突变（含神辉/太初/无上）（仅抽奖）" },
    "永恒沙漏": { price: 1200000, color: "#607D8B", refreshProbability: 0, lotteryOnly: true, description: "大幅加速成长180分钟（仅抽奖）" },
    "重天鼓": { price: 1100000, color: "#795548", refreshProbability: 0, lotteryOnly: true, description: "加速90分钟，且8%获得一个尚未拥有的高级天气词条（仅抽奖）" },
    "双生风铃": { price: 780000, color: "#4DB6AC", refreshProbability: 0, lotteryOnly: true, description: "已有天气词条时，连续尝试获得最多2个未拥有的普通天气词条（各30%）（仅抽奖）" },
    "时空怀表": { price: 680000, color: "#2F4F4F", refreshProbability: 0, lotteryOnly: true, description: "大幅加速成长120分钟（仅抽奖获得）" },
    "鸿蒙露": { price: 900000, color: "#9370DB", refreshProbability: 0, lotteryOnly: true, description: "加速60分钟，且10%必出基础突变（若尚无）（仅抽奖获得）" },
    "万象附加器": { price: 2000000, color: "#FF4500", refreshProbability: 0, lotteryOnly: true, description: "直接获得一个尚未拥有的高级天气词条（紫/金/彩）（仅抽奖获得）" },
    "天机罗盘": { price: 1100000, color: "#20B2AA", refreshProbability: 0, lotteryOnly: true, description: "15%获得一个尚未拥有的紫色及以上天气词条（仅抽奖获得）" }
        };

        /** 稀有道具：直接赋予指定天气词条 */
        const LANDLORD_LOTTERY_ITEM_GRANT_TAGS = {
            "星陨杖": "星陨", "幻潮珠": "幻潮", "雷狱柱": "雷狱", "霜龙笛": "霜龙",
            "日曜镜": "日曜", "月蚀灯": "月蚀", "焚天炉": "焚天", "苍穹卷轴": "苍穹裂",
            "紫电符": "紫电", "冥潮珠": "冥潮", "冰魄镜": "冰魄", "星砂袋": "星砂", "玄霜瓶": "玄霜",
            "雷蟒鞭": "雷蟒", "暗潮螺": "暗潮", "雪凰羽": "雪凰", "魔岚扇": "魔岚", "幽萤灯": "幽萤",
            "金乌镜": "金乌", "银蟾灯": "银蟾", "劫火炉": "劫火", "天裂卷": "天裂", "帝晖印": "帝晖",
            "龙息笛": "龙息", "凤羽扇": "凤羽", "星坠杖": "星坠", "月华刃": "月华杀", "日冕冠": "日冕"
        };
        /** 稀有道具：概率赋予指定天气词条 */
        const LANDLORD_LOTTERY_ITEM_ROLL_TAGS = {
            "虚空棱镜": { tag: "虚空潮", chance: 8 },
            "神罚符": { tag: "神罚雷", chance: 5 },
            "混沌瓶": { tag: "混沌雨", chance: 3 },
            "天道铃": { tag: "天道虹", chance: 2 },
            "创世喷雾": { tag: "创世霞", chance: 1.5 },
            "永恒极光仪": { tag: "永恒极光", chance: 1 },
            "仙霓壶": { tag: "仙霓", chance: 0.5 },
            "圣劫印": { tag: "圣劫", chance: 0.2 },
            "至道玉": { tag: "至道", chance: 0.08 },
            "万法潮瓶": { tag: "万法潮", chance: 8 },
            "九霄雷符": { tag: "九霄雷", chance: 6 },
            "阴阳雨壶": { tag: "阴阳雨", chance: 5 },
            "诸天虹铃": { tag: "诸天虹", chance: 4 },
            "开天霞雾": { tag: "开天霞", chance: 3.5 },
            "不灭极光仪": { tag: "不灭极光", chance: 3 },
            "轮回霓珠": { tag: "轮回霓", chance: 2.5 },
            "破界渡符": { tag: "破界渡", chance: 2 },
            "星河瀑瓶": { tag: "星河瀑", chance: 1.8 },
            "神域岚灯": { tag: "神域岚", chance: 1.5 },
            "道韵潮鼎": { tag: "道韵潮", chance: 1.2 },
            "元初虹玉": { tag: "元初虹", chance: 1 },
            "瑶光劫壶": { tag: "瑶光劫", chance: 0.4 },
            "紫微霓印": { tag: "紫微霓", chance: 0.35 },
            "天河裂卷": { tag: "天河裂", chance: 0.3 },
            "帝星陨杖": { tag: "帝星陨", chance: 0.15 },
            "昊天劫印": { tag: "昊天劫", chance: 0.12 },
            "太上极光仪": { tag: "太上极光", chance: 0.015 },
            "月阙岚瓶": { tag: "月阙岚", chance: 0.32 },
            "青霄霓印": { tag: "青霄霓", chance: 0.28 },
            "灵泉劫壶": { tag: "灵泉劫", chance: 0.25 },
            "紫极罚符": { tag: "紫极罚", chance: 0.1 },
            "穹苍陨杖": { tag: "穹苍陨", chance: 0.08 },
            "天衡劫印": { tag: "天衡劫", chance: 0.06 },
            "混沌元珠": { tag: "混沌元", chance: 0.04 },
            "玄黄裂卷": { tag: "玄黄裂", chance: 0.025 },
            "无极霞玉": { tag: "无极霞", chance: 0.012 }
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
            "星陨": 15, "幻潮": 16, "雷狱": 16, "霜龙": 17,
            "紫电": 15, "冥潮": 15, "冰魄": 16, "星砂": 16, "玄霜": 16,
            "雷蟒": 17, "暗潮": 17, "雪凰": 17, "魔岚": 18, "幽萤": 18,
            // 金色词条
            "水晶": 20, "红月": 20, "陨石": 20,
            "日曜": 20, "月蚀": 21, "焚天": 21, "苍穹裂": 22,
            "金乌": 20, "银蟾": 20, "劫火": 21, "天裂": 21, "帝晖": 21,
            "龙息": 22, "凤羽": 22, "星坠": 22, "月华杀": 22, "日冕": 22,
            // 彩色词条
            "流光": 25, "霓虹": 25, "渡劫": 25,
            "虚空潮": 26, "神罚雷": 27, "混沌雨": 28, "天道虹": 30, "创世霞": 30, "永恒极光": 32,
            "万法潮": 26, "九霄雷": 27, "阴阳雨": 28, "诸天虹": 29, "开天霞": 30,
            "不灭极光": 31, "轮回霓": 32, "破界渡": 33, "星河瀑": 34, "神域岚": 34,
            "道韵潮": 35, "元初虹": 35, "三界霓": 33, "灵霄劫": 34, "太虚雨": 32,
            // 超彩基础词（对应神辉/太初/无上土地材料；极低获得）
            "神辉": 40, "太初": 55, "无上": 80,
            // 超彩天气词条（彩色之上，极低获得）
            "仙霓": 50, "圣劫": 100, "至道": 200,
            "瑶光劫": 48, "紫微霓": 52, "天河裂": 55, "仙阙潮": 58, "星君怒": 60,
            "月阙岚": 54, "青霄霓": 56, "灵泉劫": 62,
            "帝星陨": 85, "昊天劫": 95, "万灵罚": 100, "混元雷": 110, "太乙虹": 120,
            "紫极罚": 105, "穹苍陨": 115, "天衡劫": 125,
            "鸿蒙裂": 150, "大道潮": 170, "无极虹": 180, "真如劫": 200, "太上极光": 220,
            "混沌元": 165, "玄黄裂": 190, "无极霞": 230,
            // 田地专属词条（与银/金/水晶/流光/神辉/太初/无上元素词条不同；售价主要靠田地倍率，此处×1不参与元素倍率）
            "银土": 1, "金土": 1, "钻石土": 1, "流光土": 1, "神辉土": 1, "太初土": 1, "无上土": 1,
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

        /** 高级天气词条（紫及以上至彩色），供稀有道具抽取（不含银/金/水晶/流光等元素基础突变、不含超彩） */
        const LANDLORD_ADVANCED_WEATHER_TAGS = [
            "星环", "瓷化", "亮晶晶", "台风", "星陨", "幻潮", "雷狱", "霜龙",
            "紫电", "冥潮", "冰魄", "星砂", "玄霜", "雷蟒", "暗潮", "雪凰", "魔岚", "幽萤",
            "极光", "极昼", "暴雪", "雾凇",
            "红月", "陨石", "日曜", "月蚀", "焚天", "苍穹裂", "晨曦", "热浪", "霞蔚", "虹彩",
            "金乌", "银蟾", "劫火", "天裂", "帝晖", "龙息", "凤羽", "星坠", "月华杀", "日冕",
            "霓虹", "渡劫", "虚空潮", "神罚雷", "混沌雨", "天道虹", "创世霞", "永恒极光",
            "万法潮", "九霄雷", "阴阳雨", "诸天虹", "开天霞", "不灭极光", "轮回霓", "破界渡",
            "星河瀑", "神域岚", "道韵潮", "元初虹", "三界霓", "灵霄劫", "太虚雨"
        ];
        /** 超彩词条（不进万象/天机普通高级池，仅专属道具） */
        const LANDLORD_ULTRA_WEATHER_TAGS = [
            "仙霓", "圣劫", "至道",
            "瑶光劫", "紫微霓", "天河裂", "仙阙潮", "星君怒",
            "月阙岚", "青霄霓", "灵泉劫",
            "帝星陨", "昊天劫", "万灵罚", "混元雷", "太乙虹",
            "紫极罚", "穹苍陨", "天衡劫",
            "鸿蒙裂", "大道潮", "无极虹", "真如劫", "太上极光",
            "混沌元", "玄黄裂", "无极霞"
        ];
        /** 仙霓档超彩：可进入自然天气刷新 */
        const LANDLORD_AURORA_WEATHER_TAGS = [
            "仙霓", "瑶光劫", "紫微霓", "天河裂", "仙阙潮", "星君怒",
            "月阙岚", "青霄霓", "灵泉劫"
        ];
        /** 圣劫档超彩：可进自然天气，权重大幅低于仙霓档 */
        const LANDLORD_STELLAR_WEATHER_TAGS = [
            "圣劫", "帝星陨", "昊天劫", "万灵罚", "混元雷", "太乙虹",
            "紫极罚", "穹苍陨", "天衡劫"
        ];
        /** 至道档超彩：可进自然天气，权重最低 */
        const LANDLORD_GENESIS_WEATHER_TAGS = [
            "至道", "鸿蒙裂", "大道潮", "无极虹", "真如劫", "太上极光",
            "混沌元", "玄黄裂", "无极霞"
        ];

        // 田地等级：0 普通 → 1 银 → 2 金 → 3 钻石 → 4 流光 → 5 神辉 → 6 太初 → 7 无上
        const LANDLORD_FIELD_TIER_MAX = 7;
        const LANDLORD_FIELD_TIER_NAMES = ['普通地', '银土地', '金土地', '钻石土地', '流光土地', '神辉土地', '太初土地', '无上土地'];
        const LANDLORD_TIER_LAND_AFFIX = ['', '银土', '金土', '钻石土', '流光土', '神辉土', '太初土', '无上土'];
        const LANDLORD_ALL_LAND_AFFIXES = ['银土', '金土', '钻石土', '流光土', '神辉土', '太初土', '无上土'];
        const LANDLORD_ELEMENT_BASIC_MUTATIONS = ['银', '金', '水晶', '流光', '神辉', '太初', '无上'];
        const LANDLORD_TIER_EXCLUSIVE_PRICE_MULT = {
            '银土': 2, '金土': 3, '钻石土': 5, '流光土': 10,
            '神辉土': 25, '太初土': 50, '无上土': 100
        };
        const LANDLORD_TIER_UPGRADE_COST = [
            { barKey: 'silver', label: '银条', amount: 50 },
            { barKey: 'gold', label: '金条', amount: 50 },
            { barKey: 'diamond', label: '钻石条', amount: 50 },
            { barKey: 'flow', label: '流光条', amount: 50 },
            { barKey: 'divine', label: '神辉条', amount: 50 },
            { barKey: 'primal', label: '太初条', amount: 50 },
            { barKey: 'supreme', label: '无上条', amount: 50 }
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
            '彩光': { icon: '🌈', attackPerLevel: 1, healthPerLevel: 0, critDamagePerLevel: 0, expPerLevel: 0.01, sub: '每级世界地图总攻击 +100%，经验 +1%' },
            '炫彩': { icon: '✨', attackPerLevel: 0, healthPerLevel: 1, critDamagePerLevel: 0, expPerLevel: 0.02, sub: '每级世界地图总生命 +100%，经验 +2%' },
            '琉璃': { icon: '💎', attackPerLevel: 3, healthPerLevel: 3, critDamagePerLevel: 3, expPerLevel: 0.03, sub: '每级世界地图攻击/生命/爆伤各 +300%，经验 +3%' },
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
            "暮色", "晨曦", "薄雾", "浓雾", "雷暴", "细雨", "暴雨", "晴空", "阴云", "露珠", "霜冻", "冰雹", "热浪", "寒潮", "季风", "微风", "暴雪", "雾凇", "霞蔚", "虹彩",
            /* 高级新增 */
            "星陨", "幻潮", "雷狱", "霜龙",
            "日曜", "月蚀", "焚天", "苍穹裂",
            "虚空潮", "神罚雷", "混沌雨", "天道虹", "创世霞", "永恒极光",
            "仙霓", "圣劫", "至道",
            /* 高品天气大批量扩展 */
            "紫电", "冥潮", "冰魄", "星砂", "玄霜", "雷蟒", "暗潮", "雪凰", "魔岚", "幽萤",
            "金乌", "银蟾", "劫火", "天裂", "帝晖", "龙息", "凤羽", "星坠", "月华杀", "日冕",
            "万法潮", "九霄雷", "阴阳雨", "诸天虹", "开天霞", "不灭极光", "轮回霓", "破界渡",
            "星河瀑", "神域岚", "道韵潮", "元初虹", "三界霓", "灵霄劫", "太虚雨",
            "瑶光劫", "紫微霓", "天河裂", "仙阙潮", "星君怒",
            "月阙岚", "青霄霓", "灵泉劫",
            "帝星陨", "昊天劫", "万灵罚", "混元雷", "太乙虹",
            "紫极罚", "穹苍陨", "天衡劫",
            "鸿蒙裂", "大道潮", "无极虹", "真如劫", "太上极光",
            "混沌元", "玄黄裂", "无极霞"
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
            "暮色": "grey", "晨曦": "gold", "薄雾": "grey", "浓雾": "grey", "雷暴": "green", "细雨": "grey", "暴雨": "blue", "晴空": "blue", "阴云": "grey", "露珠": "green", "霜冻": "green", "冰雹": "blue", "热浪": "gold", "寒潮": "blue", "季风": "blue", "微风": "green", "暴雪": "purple", "雾凇": "purple", "霞蔚": "gold", "虹彩": "rainbow",
            "星陨": "purple", "幻潮": "purple", "雷狱": "purple", "霜龙": "purple",
            "紫电": "purple", "冥潮": "purple", "冰魄": "purple", "星砂": "purple", "玄霜": "purple",
            "雷蟒": "purple", "暗潮": "purple", "雪凰": "purple", "魔岚": "purple", "幽萤": "purple",
            "日曜": "gold", "月蚀": "gold", "焚天": "gold", "苍穹裂": "gold",
            "金乌": "gold", "银蟾": "gold", "劫火": "gold", "天裂": "gold", "帝晖": "gold",
            "龙息": "gold", "凤羽": "gold", "星坠": "gold", "月华杀": "gold", "日冕": "gold",
            "虚空潮": "rainbow", "神罚雷": "rainbow", "混沌雨": "rainbow", "天道虹": "rainbow", "创世霞": "rainbow", "永恒极光": "rainbow",
            "万法潮": "rainbow", "九霄雷": "rainbow", "阴阳雨": "rainbow", "诸天虹": "rainbow", "开天霞": "rainbow",
            "不灭极光": "rainbow", "轮回霓": "rainbow", "破界渡": "rainbow", "星河瀑": "rainbow", "神域岚": "rainbow",
            "道韵潮": "rainbow", "元初虹": "rainbow", "三界霓": "rainbow", "灵霄劫": "rainbow", "太虚雨": "rainbow",
            "仙霓": "aurora", "圣劫": "stellar", "至道": "genesis",
            "瑶光劫": "aurora", "紫微霓": "aurora", "天河裂": "aurora", "仙阙潮": "aurora", "星君怒": "aurora",
            "月阙岚": "aurora", "青霄霓": "aurora", "灵泉劫": "aurora",
            "帝星陨": "stellar", "昊天劫": "stellar", "万灵罚": "stellar", "混元雷": "stellar", "太乙虹": "stellar",
            "紫极罚": "stellar", "穹苍陨": "stellar", "天衡劫": "stellar",
            "鸿蒙裂": "genesis", "大道潮": "genesis", "无极虹": "genesis", "真如劫": "genesis", "太上极光": "genesis",
            "混沌元": "genesis", "玄黄裂": "genesis", "无极霞": "genesis"
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

/** 种子合成链编号（土豆=1，金桔=2…）；变异种子按基础名编号 */
function getLandlordSeedChainIndex(seedKey) {
    const base = typeof getLandlordSeedBaseName === 'function' ? getLandlordSeedBaseName(seedKey) : String(seedKey || '');
    const order = typeof LANDLORD_SKY_VINE_FRUIT_ORDER !== 'undefined'
        ? LANDLORD_SKY_VINE_FRUIT_ORDER
        : (typeof seedProperties !== 'undefined' ? Object.keys(seedProperties) : []);
    const idx = order.indexOf(base);
    return idx >= 0 ? idx + 1 : 0;
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

/**
 * 为一键基因合成找最优材料对：使目标基础种落在价区间内，且候选种尽量少（成功率最高）。
 * @returns {{ pair: string[], candidateCount: number, chanceText: string, targetBase: string }|null}
 */
function findOptimalGeneSynthesisPair(targetSeedKey) {
    if (!player || !player.landlord || !player.landlord.seedStorage) return null;
    const targetBase = getLandlordSeedBaseName(targetSeedKey);
    const targetProps = seedProperties[targetBase];
    if (!targetProps) return null;
    const targetPrice = targetProps.price;

    const keys = Object.keys(player.landlord.seedStorage).filter(function (k) {
        return (player.landlord.seedStorage[k] || 0) > 0 && !!getLandlordSeedProperties(k);
    });
    if (keys.length === 0) return null;

    let best = null;
    for (let i = 0; i < keys.length; i++) {
        for (let j = i; j < keys.length; j++) {
            const a = keys[i];
            const b = keys[j];
            if (a === b) {
                if ((player.landlord.seedStorage[a] || 0) < 2) continue;
            } else {
                if ((player.landlord.seedStorage[a] || 0) < 1 || (player.landlord.seedStorage[b] || 0) < 1) continue;
            }
            const baseA = getLandlordSeedBaseName(a);
            const baseB = getLandlordSeedBaseName(b);
            const pa = seedProperties[baseA] ? seedProperties[baseA].price : NaN;
            const pb = seedProperties[baseB] ? seedProperties[baseB].price : NaN;
            if (!Number.isFinite(pa) || !Number.isFinite(pb)) continue;
            const lo = Math.min(pa, pb);
            const hi = Math.max(pa, pb);
            if (targetPrice < lo || targetPrice > hi) continue;

            const candidates = getLandlordSeedsInPriceRange(lo, hi);
            if (!candidates.length || candidates.indexOf(targetBase) < 0) continue;

            const usesTarget = (baseA === targetBase ? 1 : 0) + (baseB === targetBase ? 1 : 0);
            const span = hi - lo;
            const score = {
                pair: [a, b],
                candidateCount: candidates.length,
                usesTarget: usesTarget,
                span: span,
                targetBase: targetBase
            };
            if (!best) {
                best = score;
                continue;
            }
            if (score.candidateCount < best.candidateCount) {
                best = score;
            } else if (score.candidateCount === best.candidateCount) {
                if (score.usesTarget > best.usesTarget) best = score;
                else if (score.usesTarget === best.usesTarget && score.span < best.span) best = score;
            }
        }
    }
    if (!best) return null;
    best.chanceText = '1/' + best.candidateCount;
    return best;
}

/** 当前仓库下，所有可用最优材料对合成到的目标基础种子列表 */
function listGeneSynthesisAutoTargets() {
    const order = typeof LANDLORD_SKY_VINE_FRUIT_ORDER !== 'undefined'
        ? LANDLORD_SKY_VINE_FRUIT_ORDER
        : Object.keys(seedProperties);
    const result = [];
    for (let i = 0; i < order.length; i++) {
        const base = order[i];
        if (!seedProperties[base]) continue;
        const opt = findOptimalGeneSynthesisPair(base);
        if (!opt) continue;
        result.push({
            base: base,
            chainIndex: i + 1,
            price: seedProperties[base].price,
            candidateCount: opt.candidateCount,
            chanceText: opt.chanceText,
            pair: opt.pair
        });
    }
    return result;
}

function performLandlordGeneSynthesis(selectedSeeds) {
    if (!selectedSeeds || selectedSeeds.length !== 2) {
        return { ok: false, message: '请选择2个种子！' };
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
    eligibleMutations: ["银", "金", "水晶", "流光", "神辉", "太初", "无上"],
    
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
        /* 1亿以下高价种子（权重偏低，越贵越稀有） */
        { name: "向日葵", probability: 0.1, weight: 1 },
        { name: "松树", probability: 0.08, weight: 1 },
        { name: "大王菊", probability: 0.07, weight: 1 },
        { name: "火龙果", probability: 0.055, weight: 1 },
        { name: "闫闫果", probability: 0.045, weight: 1 },
        { name: "菠萝", probability: 0.04, weight: 1 },
        { name: "葡萄", probability: 0.032, weight: 1 },
        { name: "惊奇菇", probability: 0.025, weight: 1 },
        { name: "泡泡果", probability: 0.018, weight: 1 },
      { name: "榴莲", probability: 0.01,  weight: 1  },
      { name: "百香果", probability: 0.001,  weight: 1  },
      { name: "杨桃", probability: 0.001,  weight: 1  },
        { name: "随机牧场动物", probability: 10, weight: 1, prizeType: "ranchAnimal" },
        /* 稀有道具（权重较低，按归一化概率抽取） */
        { name: "超级浇水器", probability: 0.45, weight: 1, prizeType: "item" },
        { name: "天气附加器", probability: 0.22, weight: 1, prizeType: "item" },
        { name: "时空怀表", probability: 0.28, weight: 1, prizeType: "item" },
        { name: "永恒沙漏", probability: 0.12, weight: 1, prizeType: "item" },
        { name: "鸿蒙露", probability: 0.2, weight: 1, prizeType: "item" },
        { name: "元素坩埚", probability: 0.14, weight: 1, prizeType: "item" },
        { name: "重天鼓", probability: 0.1, weight: 1, prizeType: "item" },
        { name: "双生风铃", probability: 0.13, weight: 1, prizeType: "item" },
        { name: "星陨杖", probability: 0.16, weight: 1, prizeType: "item" },
        { name: "幻潮珠", probability: 0.14, weight: 1, prizeType: "item" },
        { name: "雷狱柱", probability: 0.12, weight: 1, prizeType: "item" },
        { name: "霜龙笛", probability: 0.11, weight: 1, prizeType: "item" },
        { name: "紫电符", probability: 0.12, weight: 1, prizeType: "item" },
        { name: "冥潮珠", probability: 0.11, weight: 1, prizeType: "item" },
        { name: "冰魄镜", probability: 0.1, weight: 1, prizeType: "item" },
        { name: "星砂袋", probability: 0.1, weight: 1, prizeType: "item" },
        { name: "玄霜瓶", probability: 0.095, weight: 1, prizeType: "item" },
        { name: "雷蟒鞭", probability: 0.09, weight: 1, prizeType: "item" },
        { name: "暗潮螺", probability: 0.09, weight: 1, prizeType: "item" },
        { name: "雪凰羽", probability: 0.085, weight: 1, prizeType: "item" },
        { name: "魔岚扇", probability: 0.08, weight: 1, prizeType: "item" },
        { name: "幽萤灯", probability: 0.08, weight: 1, prizeType: "item" },
        { name: "紫霄匣", probability: 0.05, weight: 1, prizeType: "item" },
        { name: "日曜镜", probability: 0.08, weight: 1, prizeType: "item" },
        { name: "月蚀灯", probability: 0.08, weight: 1, prizeType: "item" },
        { name: "焚天炉", probability: 0.07, weight: 1, prizeType: "item" },
        { name: "苍穹卷轴", probability: 0.07, weight: 1, prizeType: "item" },
        { name: "金乌镜", probability: 0.07, weight: 1, prizeType: "item" },
        { name: "银蟾灯", probability: 0.07, weight: 1, prizeType: "item" },
        { name: "劫火炉", probability: 0.065, weight: 1, prizeType: "item" },
        { name: "天裂卷", probability: 0.065, weight: 1, prizeType: "item" },
        { name: "帝晖印", probability: 0.06, weight: 1, prizeType: "item" },
        { name: "龙息笛", probability: 0.055, weight: 1, prizeType: "item" },
        { name: "凤羽扇", probability: 0.055, weight: 1, prizeType: "item" },
        { name: "星坠杖", probability: 0.05, weight: 1, prizeType: "item" },
        { name: "月华刃", probability: 0.05, weight: 1, prizeType: "item" },
        { name: "日冕冠", probability: 0.048, weight: 1, prizeType: "item" },
        { name: "紫金匣", probability: 0.025, weight: 1, prizeType: "item" },
        { name: "天机罗盘", probability: 0.06, weight: 1, prizeType: "item" },
        { name: "虚空棱镜", probability: 0.045, weight: 1, prizeType: "item" },
        { name: "神罚符", probability: 0.035, weight: 1, prizeType: "item" },
        { name: "混沌瓶", probability: 0.028, weight: 1, prizeType: "item" },
        { name: "万法潮瓶", probability: 0.04, weight: 1, prizeType: "item" },
        { name: "九霄雷符", probability: 0.032, weight: 1, prizeType: "item" },
        { name: "阴阳雨壶", probability: 0.028, weight: 1, prizeType: "item" },
        { name: "诸天虹铃", probability: 0.024, weight: 1, prizeType: "item" },
        { name: "开天霞雾", probability: 0.02, weight: 1, prizeType: "item" },
        { name: "天道铃", probability: 0.02, weight: 1, prizeType: "item" },
        { name: "创世喷雾", probability: 0.015, weight: 1, prizeType: "item" },
        { name: "永恒极光仪", probability: 0.012, weight: 1, prizeType: "item" },
        { name: "不灭极光仪", probability: 0.014, weight: 1, prizeType: "item" },
        { name: "轮回霓珠", probability: 0.012, weight: 1, prizeType: "item" },
        { name: "破界渡符", probability: 0.01, weight: 1, prizeType: "item" },
        { name: "星河瀑瓶", probability: 0.009, weight: 1, prizeType: "item" },
        { name: "神域岚灯", probability: 0.008, weight: 1, prizeType: "item" },
        { name: "道韵潮鼎", probability: 0.007, weight: 1, prizeType: "item" },
        { name: "元初虹玉", probability: 0.006, weight: 1, prizeType: "item" },
        { name: "虹彩敕", probability: 0.01, weight: 1, prizeType: "item" },
        { name: "万象附加器", probability: 0.008, weight: 1, prizeType: "item" },
        { name: "超彩残卷", probability: 0.003, weight: 1, prizeType: "item" },
        { name: "仙霓壶", probability: 0.004, weight: 1, prizeType: "item" },
        { name: "瑶光劫壶", probability: 0.0035, weight: 1, prizeType: "item" },
        { name: "紫微霓印", probability: 0.003, weight: 1, prizeType: "item" },
        { name: "天河裂卷", probability: 0.0025, weight: 1, prizeType: "item" },
        { name: "帝星陨杖", probability: 0.0018, weight: 1, prizeType: "item" },
        { name: "昊天劫印", probability: 0.0014, weight: 1, prizeType: "item" },
        { name: "圣劫印", probability: 0.0015, weight: 1, prizeType: "item" },
        { name: "至道玉", probability: 0.0005, weight: 1, prizeType: "item" },
        { name: "太上极光仪", probability: 0.0003, weight: 1, prizeType: "item" },
        { name: "月阙岚瓶", probability: 0.0028, weight: 1, prizeType: "item" },
        { name: "青霄霓印", probability: 0.0024, weight: 1, prizeType: "item" },
        { name: "灵泉劫壶", probability: 0.002, weight: 1, prizeType: "item" },
        { name: "紫极罚符", probability: 0.0011, weight: 1, prizeType: "item" },
        { name: "穹苍陨杖", probability: 0.0009, weight: 1, prizeType: "item" },
        { name: "天衡劫印", probability: 0.0007, weight: 1, prizeType: "item" },
        { name: "混沌元珠", probability: 0.00045, weight: 1, prizeType: "item" },
        { name: "玄黄裂卷", probability: 0.00035, weight: 1, prizeType: "item" },
        { name: "无极霞玉", probability: 0.00025, weight: 1, prizeType: "item" }
    ],
    
    // 抽奖消耗
    costPerDraw: 1, // 每次抽奖消耗1次抽奖次数

    /** 大类总概率：种子 / 牧场动物 / 道具 */
    categoryTargets: { seed: 80, ranchAnimal: 10, item: 10 },

    _prizeCategory: function(prize) {
        if (prize.prizeType === 'item') return 'item';
        if (prize.prizeType === 'ranchAnimal') return 'ranchAnimal';
        return 'seed';
    },

    /** 类内相对权重：种子越贵越低；道具均分；动物固定 */
    _relativeWeight: function(prize) {
        const cat = this._prizeCategory(prize);
        if (cat === 'item' || cat === 'ranchAnimal') return 1;
        var price = 30000;
        if (typeof seedProperties !== 'undefined' && seedProperties[prize.name]) {
            price = Number(seedProperties[prize.name].price);
            if (!(price > 0)) price = 1000;
        }
        // 价格越高权重越低（0.8 次方，避免顶级种子几乎抽不到）
        return 1 / Math.pow(price, 0.8);
    },

    // 初始化抽奖概率（按大类目标占比，再按类内相对权重拆分）
    initPrizeProbabilities: function() {
        const targets = this.categoryTargets || { seed: 80, ranchAnimal: 10, item: 10 };
        const buckets = { seed: [], ranchAnimal: [], item: [] };
        this.prizePool.forEach((prize) => {
            buckets[this._prizeCategory(prize)].push(prize);
        });
        Object.keys(buckets).forEach((key) => {
            const list = buckets[key];
            let sum = 0;
            list.forEach((p) => {
                p._relWeight = this._relativeWeight(p);
                sum += p._relWeight;
            });
            const catTarget = Number(targets[key]) || 0;
            list.forEach((p) => {
                const share = sum > 0 ? p._relWeight / sum : 0;
                p.actualProbability = (share * catTarget).toFixed(2);
                p._drawWeight = share * catTarget;
            });
        });
    },

    /** 按大类目标 + 类内相对权重抽取 */
    pickPrize: function() {
        this.initPrizeProbabilities();
        const targets = this.categoryTargets || { seed: 80, ranchAnimal: 10, item: 10 };
        const buckets = { seed: [], ranchAnimal: [], item: [] };
        this.prizePool.forEach((prize) => {
            buckets[this._prizeCategory(prize)].push(prize);
        });
        let catTotal = 0;
        const cats = [];
        ['seed', 'ranchAnimal', 'item'].forEach((key) => {
            if (buckets[key].length > 0 && (Number(targets[key]) || 0) > 0) {
                cats.push(key);
                catTotal += Number(targets[key]) || 0;
            }
        });
        if (!cats.length) return this.prizePool[0];
        let r = Math.random() * catTotal;
        let chosenCat = cats[cats.length - 1];
        for (let i = 0; i < cats.length; i++) {
            r -= Number(targets[cats[i]]) || 0;
            if (r <= 0) {
                chosenCat = cats[i];
                break;
            }
        }
        const list = buckets[chosenCat];
        let sum = 0;
        for (let i = 0; i < list.length; i++) {
            list[i]._relWeight = this._relativeWeight(list[i]);
            sum += list[i]._relWeight;
        }
        if (sum <= 0) return list[0];
        let rr = Math.random() * sum;
        for (let i = 0; i < list.length; i++) {
            rr -= list[i]._relWeight;
            if (rr <= 0) return list[i];
        }
        return list[list.length - 1];
    }
};

// 初始化抽奖概率
lotterySystem.initPrizeProbabilities();

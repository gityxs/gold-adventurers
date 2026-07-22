        const GAME_VERSION = "2.0.40";
        const GAME_INVENTORY_MAX = 100;
        var WING_RARITY_ORDER = ["劣质级", "普通级", "优秀级", "精良级", "卓越级", "史诗级", "传说级", "神圣级", "不朽级", "仙境级", "神域级", "圣域级", "天域级", "无极级", "鸿蒙级", "归墟级"];
        var MOUNT_RARITY_ORDER = ["劣质级", "普通级", "优秀级", "精良级", "卓越级", "史诗级", "传说级", "神圣级", "不朽级", "仙境级", "神域级", "圣域级", "天域级", "无极级", "鸿蒙级", "归墟级"];
        const ARTIFACT_INVENTORY_MAX = 100;
        const SECONDARY_INVENTORY_MAX = 50;
        let versionErrorBlocked = false;
        var _apiHost = '114.132.157.120';
        window.GOLD_GAME_API_BASE = window.GOLD_GAME_API_BASE || (typeof location !== 'undefined' && location.protocol === 'https:' ? 'https://' + _apiHost : 'http://' + _apiHost + ':3000');

        
        function isCurrentVersionOlderThan(saveVersion) {
            if (!saveVersion) return false;
            var cur = (GAME_VERSION + "").split(".").map(Number);
            var sav = (saveVersion + "").split(".").map(Number);
            for (var i = 0; i < Math.max(cur.length, sav.length); i++) {
                var c = cur[i] || 0, s = sav[i] || 0;
                if (c < s) return true;
                if (c > s) return false;
            }
            return false;
        }

        
        function showVersionError(saveVersion) {
            versionErrorBlocked = true;
            setTimeout(function() {
                var dialog = document.getElementById('versionErrorDialog');
                var overlay = document.getElementById('versionErrorOverlay');
                var messageEl = document.getElementById('versionErrorMessage');
                if (dialog && overlay && messageEl) {
                    messageEl.textContent = "该存档是在更新版本（v" + saveVersion + "）中保存的，当前游戏版本为 v" + GAME_VERSION + "。";
                    dialog.style.display = 'block';
                    overlay.style.display = 'block';
                } else {
                    alert("该存档是在更新版本（v" + saveVersion + "）中保存的，当前游戏版本为 v" + GAME_VERSION + "。\n请使用新版本游戏进行游玩。");
                }
            }, 100);
        }

        
        function checkVersionBlocked() {
            return versionErrorBlocked;
        }

        // 定时器统一管理：页面卸载时统一清理，避免遗漏导致越来越卡
        window._gameIntervals = window._gameIntervals || [];
        function registerInterval(fn, ms) {
            var id = (arguments.length > 2) ? setInterval.apply(window, arguments) : setInterval(fn, ms);
            window._gameIntervals.push(id);
            return id;
        }
        function unregisterInterval(id) {
            if (id == null) return;
            clearInterval(id);
            var arr = window._gameIntervals;
            if (!arr || !arr.length) return;
            for (var i = arr.length - 1; i >= 0; i--) {
                if (arr[i] === id) { arr.splice(i, 1); break; }
            }
        }
        /** 按全局 key 单例注册 interval，重复调用会先清旧表项，避免 loadGame 叠定时器 */
        function registerSingletonInterval(storeKey, fn, ms) {
            if (!storeKey) return registerInterval(fn, ms);
            if (window[storeKey] != null) unregisterInterval(window[storeKey]);
            window[storeKey] = registerInterval(fn, ms);
            return window[storeKey];
        }
        window.registerInterval = registerInterval;
        window.unregisterInterval = unregisterInterval;
        window.registerSingletonInterval = registerSingletonInterval;

        // 初始化玩家数据
    let player = {
    name: "勇者",
    avatar: "",  // 玩家头像 base64，显示为 48x48
    gold: 0,
    diamond: 0,
    titanium: 0,
    starstone: 0,
    cosmicstone: 0,
    superstone: 0,
    otherworldstone: 0,
    xingjiestone: 0,
    hundunstone: 0,
    lingtone: 0,
    huangtone: 0,
    mingtone: 0,
    xutong: 0,
    shitone: 0,
    weitone: 0,
    yongtone: 0,
    wujitone: 0,
    daotone: 0,
    reincarnationCoin: 0,
    reincarnationCount: 0,
    equipment: [],
    usedActivationCodes: [],
    dimensionLevel: 1,
    class: null, // 当前职业: null, 'warrior', 'mage'
    classSecond: null,    // 二转职业
    classThird: null,    // 三转职业  
    classFourth: null,
    classFifth: null,
    classSixth: null,
    classSeventh: null,
    classBranches: [], // 已选择的分支 [0, 2, 1] 表示第1排选第0个，第2排选第2个等
    classBonuses: { // 新增：存储职业分支选择的加成
    soulRingMultiplier: 1,    // 魂环总加成乘数（默认1倍）
    dungeonEquipMultiplier: 1 // 副本装备总加成乘数（默认1倍）
  },
trialTower: {
            currentFloor: 1,
            highestFloor: 0,
            totalChallenges: 0,
            totalWins: 0
        },
        abyssTower: {
            exclusiveCurrency: 0,
            bestFloor: 0,
            level: 0,
            startGearCount: 0,
            startGearPurchaseCount: 0,
            startGoldBonus: 0,
            startPetCount: 0,
            deployedSlotsPurchases: 0,
            permanentBonuses: { hp: 0, atk: 0, def: 0, critRate: 0, critDmg: 0, dodge: 0, lifesteal: 0, combo: 0 },
            abyssVault: {}
        },
nianBeast: {
            dungeonToken: 0, // 副本令牌
            highestLevel: 0, // 最高通关层数
            totalKills: 0, // 总击杀次数
            rewardsCollected: 0 // 总奖励数量
        },
beasts: {
        inventory: [], // 拥有的神兽列表
        equipped: [],
        selectedId: null, // 当前选中的神兽ID
        shareLevel: {
        level: 0, // 共享等级
        totalExp: 0, // 总消耗的神兽蛋数量
        bonusMultiplier: 1.0 // 总属性加成倍率
    }
    },
reincarnationEquipment: {
            equipped: {
                helmet: null,
                chest: null,
                pants: null,
                shoes: null,
                necklace: null,
                weapon: null
            },
            inventory: [],
            lockedItems: [] // 锁定的装备ID列表
        },
 treasures: {
            inventory: [], // 拥有的宝物列表
            totalFound: 0, // 总共找到的宝物数量
            totalSold: 0, // 总共出售获得的金钱
            foundCount: Array(10).fill(0), // 每个宝物找到的数量
            soldCount: Array(10).fill(0) // 每个宝物出售的数量
        }, 
       magicTools: {
            equipped: null, // 当前装备的法宝ID
            inventory: [],  // 拥有的法宝ID列表
            materials: {},  // 拥有的材料数量
            // 初始化基础材料
            materials: {
                spirit_stone: 0,
                wood: 0,
                water_crystal: 0,
                fire_crystal: 0,
                metal_crystal: 0,
                wood_crystal: 0,
                earth_crystal: 0,
                yin_stone: 0,
                yang_stone: 0,
                immortal_feather: 0,
                celestial_silk: 0,
                chaos_fragment: 0,
                space_stone: 0,
                time_sand: 0,
                destiny_fragment: 0,
                star_dust: 0,
                law_crystal: 0,
                eternity_core: 0,
                time_essence: 0,
                space_crystal: 0
            }
        },
children: {
            isPregnant: false,
            pregnancyStart: 0,
            pregnancyProgress: 0,
            children: [],
            totalChildren: 0,
            trainingHistory: [],
            lineageLevel: 1,
            lineageExp: 0,
            claimedMilestones: [],
            childBonuses: {
                gpsMultiplier: 1.0,
                clickMultiplier: 1.0,
                critRateBonus: 0,
                goldMultiplier: 1.0,
                worldAtkBonus: 0,
                worldHpBonus: 0,
                worldCritDmgBonus: 0
            }
        },
  marriage: {
            isMarried: false,
            spouseName: "",
            spouseGender: "female",
            marriageDate: null,
            loveLevel: 1,
            loveExp: 0,
            totalGifts: 0,
            totalTimeSpent: 0,
            totalAimeSpent: 0,
            marriageBonuses: {
                gpsMultiplier: 1.0,
                clickMultiplier: 1.0,
                critRateBonus: 0,
                critDamageBonus: 0
            }
        },
  houses: {
                    level: 1,
                    exp: 0,
                    maxHouses: 5,
                    ownedHouses: [],
                    rentedHouses: [],
                    lastUpdate: Date.now(),
                    totalIncome: 0
                },
 investmentGame: {
            stocks: [
                {code: "zj0001", name: "鱼鱼基金", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0002", name: "闫闫基金", price: 10.00, change: 0, holdings: 0, costPrice: 0},           
                {code: "zj0003", name: "茶茶金股", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0004", name: "麒麟企业", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0005", name: "云南白药", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0006", name: "黑三逢源", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0007", name: "乐途企业", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0008", name: "PDD企业", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0009", name: "空白控股", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0010", name: "慢手企业", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0011", name: "斗音公司", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0012", name: "阿里妈妈", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0013", name: "淘宝宝", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0014", name: "千达有限", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0015", name: "通元房产", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0016", name: "预言鱼塘", price: 10.00, change: 0, holdings: 0, costPrice: 0},            
                {code: "zj0017", name: "新股长虹", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0018", name: "萩萩萩萩音乐", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0019", name: "盛通快递", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0020", name: "十鼎洗浴", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0021", name: "九鼎红楼", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0022", name: "星巴克", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0023", name: "大吴疆土", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0024", name: "九转仙股", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0025", name: "乌龟科技", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0026", name: "阿斯塔特", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0027", name: "万里药业", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0028", name: "万里证券", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0029", name: "顶峰相见", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0030", name: "顺封快递", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0031", name: "晋商银行", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0032", name: "爆涨房产", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0033", name: "书法银行", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0034", name: "阳城银行", price: 10.00, change: 0, holdings: 0, costPrice: 0},            
                {code: "zj0035", name: "程羽银行", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0036", name: "中铁银行", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0037", name: "工商银行", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0038", name: "明港基金", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0039", name: "东坑企业", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0040", name: "黑龙银行", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0041", name: "韵达银行", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0042", name: "巴士企业", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0043", name: "京东公司", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0044", name: "科技企业", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0045", name: "羊同药业", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0046", name: "风雪药业", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0047", name: "霸王别姬", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0048", name: "一点点奶茶", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0049", name: "古茗奶茶", price: 10.00, change: 0, holdings: 0, costPrice: 0},
                {code: "zj0050", name: "蜜雪冰城", price: 10.00, change: 0, holdings: 0, costPrice: 0}
            ],
            userData: {
                availableFunds: 1000.00,
                totalAssets: 1000.00,
                holdingPercent: 0.00,
                todayProfit: 0.00,
                totalProfitAmount: 0.00,  // 新增：总盈亏金额
                totalProfitPercent: 0.00,
                tradeCount: 16,
                initialFunds: 1000.00,
                lastUpdateTime: Date.now()
            },
            currentStockIndex: 0,
            tradeData: {
                quantity: 0,
                type: "buy",
                feeRate: 0.0048
            },
            chartHistoryCache: {},
            priceUpdateTimer: null,
            chartUpdateTimer: null
        },
    mining: {
            depth: 0,
            power: 1,
            isMining: false,
            ore: 1500,
            stamina: 100,
            baseMaxStamina: 100,
            staminaUpgradeLevel: 1,
            potions: 3,
            gems: {
                ruby: 0,
                sapphire: 0,
                emerald: 0,
                amethyst: 0,
                diamond: 0,
                mysteryGem: 0,
                cultivationGem: 0
            },
            upgrades: {
                power: 1,
                detector: 1
            },
            notifications: [],
            lastUpdate: Date.now(),
            autoPotion: false,
            autoPotionThreshold: 5
        },

        fiveElements: {
        metal: { name: "金", level: 0, cost: 1, symbol: "⭐" }, // 金
        wood: { name: "木", level: 0, cost: 1, symbol: "🌳" }, // 木
        water: { name: "水", level: 0, cost: 1, symbol: "💧" }, // 水
        fire: { name: "火", level: 0, cost: 1, symbol: "🔥" }, // 火
        earth: { name: "土", level: 0, cost: 1, symbol: "🏔️" }  // 土
    },
    pixelPlayer: {
        helmetSkin: null,
        clothesSkin: null,
        cloakSkin: null,
        pantsSkin: null,
        shoesSkin: null,
        weaponSkin: null,
        inventory: []
    },
landlord: {
                coins: 10000,
                unlockedFields: 5,
                fields: Array(50).fill(null),
                lockedFields: Array(50).fill(false),
                fieldTiers: Array(50).fill(0),
                skyVineLevel: 0,
                skyVineProgress: 0,
                geneTrees: {
                    '彩光': { level: 0, progress: 0 },
                    '炫彩': { level: 0, progress: 0 },
                    '琉璃': { level: 0, progress: 0 },
                    '琥珀': { level: 0, progress: 0 }
                },
                bars: { silver: 0, gold: 0, diamond: 0, flow: 0 },
                seedStorage: {},
                fruitStorage: [],
                itemStorage: {},
                storeItems: {},
                itemStoreItems: {},
                lastSeedRefreshTime: Date.now(),
                lastItemRefreshTime: Date.now(),
                weather: "晴朗",
                lastWeatherChange: Date.now(),
           lottery: {
        drawCount: 0, // 当前抽奖次数
        totalDraws: 0, // 总抽奖次数
        prizesWon: {}, // 获得的奖品统计
        lastDrawTime: 0, // 上次抽奖时间
        drawHistory: [] // 抽奖历史记录
    },
                stats: {
                    totalPlants: 0,
                    totalHarvests: 0,
                    totalCoinsEarned: 0,
                    basicMutations: 0,
                    weatherMutations: 0,
                    specialMutations: 0,
                    highestMultiplier: 1,
                    itemsUsed: 0
                },
                selectedFieldIndex: null,
                seaFishing: {
                    currentVenue: 0,
                    dexVenue: 0,
                    fishTank: [],
                    marketListings: [],
                    fishDex: {},
                    lastCustomerTime: 0,
                    fishingState: 'idle',
                    tension: 0.5,
                    tensionDir: 1,
                    struggleTimer: null,
                    biteTimer: null,
                    selectedIds: {},
                    marketSelectedIds: {},
                    rightTab: 'market'
                }
            },
        
 penglaiIsland: {
    bossLevel: 1,
    bossHealth: 1e150,
    bossAttack: 1e20,
    bossMaxHealth: 1e150,
    bossResurrections: 0,
    isBattling: false,
    playerHealth: 0,
    playerAttack: 0,
    playerCritRate: 0,
    playerCritDamage: 0
},
lunhuiFuben: {
    bossLevel: 1,
    bossHealth: 1e98,
    bossAttack: 1e8,
    bossMaxHealth: 1e98,
    bossResurrections: 0,
    isBattling: false,
    playerHealth: 0,
    playerAttack: 0,
    playerCritRate: 0,
    playerCritDamage: 0
},
lunhuiPenglai: {
    bossLevel: 1,
    bossHealth: 1e123,
    bossAttack: 1e23,
    bossMaxHealth: 1e123,
    bossResurrections: 0,
    isBattling: false,
    playerHealth: 0,
    playerAttack: 0,
    playerCritRate: 0,
    playerCritDamage: 0
},
lunhuiXingYuan: {
    bossLevel: 1,
    bossHealth: 1e140,
    bossAttack: 1e30,
    bossMaxHealth: 1e140,
    bossResurrections: 0,
    isBattling: false,
    playerHealth: 0,
    playerAttack: 0,
    playerCritRate: 0,
    playerCritDamage: 0
},
lunhuiYaoChi: {
    bossLevel: 1,
    bossHealth: 1e160,
    bossAttack: 1e35,
    bossMaxHealth: 1e160,
    bossResurrections: 0,
    isBattling: false,
    playerHealth: 0,
    playerAttack: 0,
    playerCritRate: 0,
    playerCritDamage: 0
},
lunhuiGuiXu: {
    bossLevel: 1,
    bossHealth: 1e180,
    bossAttack: 1e40,
    bossMaxHealth: 1e180,
    bossResurrections: 0,
    isBattling: false,
    playerHealth: 0,
    playerAttack: 0,
    playerCritRate: 0,
    playerCritDamage: 0
},
holyBeastIsland: {
    bossLevel: 1,
    bossHealth: 1e100,
    bossAttack: 1e10,
    bossMaxHealth: 1e100,
    bossResurrections: 0,
    isBattling: false,
    playerHealth: 0,
    playerAttack: 0,
    playerCritRate: 0,
    playerCritDamage: 0
},
runes: {
    materials: {
        gold: 0,
        wood: 0,
        water: 0,
        fire: 0,
        earth: 0,
        light: 0,
        dark: 0,
        wind: 0,
        ice: 0,
        electric: 0
    },
    equipped: null,
    inventory: [],
    level: 1,
    upgradeCost: 10,
    selectedMaterials: [],
    currentFilter: 'all'
},
  sect: {
            created: false,
            name: "",
            level: 0,
            exp: 0,
            spiritStones: 0,
            members: [],
            missions: [],
            techniques: {},
            creationTime: 0,
            maxMembers: 5,
            grotto: {
                spiritArrayLevel: 0,
                spiritFields: []
            }
        },
   battle: {
    currentZone: null,
    currentMonster: null,
    monsterResurrections: 0,
},
  worldMapBattle: {
    autoBattle: false,
    autoBattleInterval: null
},
/** 洞天劫修士名录同步到主游戏：用于世界地图经验加成与湮灭诸敌生命/攻击加成 */
dongtianMaxFloor: 1,
dongtianKills: 0,
liveStream: {
            level: 1,
            exp: 0,
            totalEarnings: 1000,
            isLive: false,
            lastLiveStart: 0,
            totalLiveTime: 0,
            expMultiplier: 1,
            viewers: [],
            displayViewerCount: 0,
            donationHistory: [],
           lastDanmaku: null
        },
level: {
    current: 1,
    exp: 0,
    nextLevelExp: 4630,
    clickBonus: 1,
    gpsBonus: 1,
    ascentionCount: 0, // 飞升次数
    ascentionMultiplier: 1, // 飞升加成倍数
    ascentionCounta: 0, 
    ascentionMultipliera: 1,
    huaShengCount: 0, // 化圣次数
    huaShengMultiplier: 1, // 化圣属性提升倍率（每次×100）
    reincarnationEligibleHintForAca: null // 已提示过「可轮回」的轮回阶段，避免刷屏（与 ascentionCounta 对齐）
},
lawPower: {
    attack: 0,
    health: 0,
    critDamage: 0,
    critRate: 0,
    worldExp: 0,
    cultivationExp: 0,
    mysteryExp: 0
},
cultivation: {
            stage: 0, // 当前阶段索引
            exp: 0,   // 当前经验值
            root: null, // 当前灵根
            bloodline: null,
           bonus: 1
        },
 artifacts: {
            fragments: 0,
            crystals: 0,
            inventory: [],
            equipped: {
                helmet: null,
                clothes: null,
                pants: null,
                shoes: null,
                necklace: null,
                weapon: null
            },
        advanceLevels: {}
        },
   mystery: {
        stage: 1,
        level: 1,
        exp: 0,
        bonus: 1, // 默认加成1倍
        lastUpdateTime: Date.now() // 添加这个字段
    },
    autoReincarnation: false, // 新增自动转生状态
    officialLevel: 0, // 官职等级，初始为0
    officialBonus: 1, // 初始加成1倍
    vip: {
        level: 1,
        power: 0 // 累计VIP能力值数量
    },
   companionExpedition: {
            currentExpedition: null,
            history: [],
            lastUpdate: Date.now()
        },
   bossBattleSnapshot: {
    playerAttack: 0,
    playerMultiAttack: 0,
    playerCritRate: 0,
    playerCritDamage: 0
},
 backgroundBattle: {
    active: false,
    interval: null
},
battleLog: [], // 世界地图战斗日志（关闭再打开界面时显示），addBattleLog 会限制最多 100 条
treasure: {
        keys: 0, // 藏宝图钥匙数量
        maps: [], // 拥有的藏宝图
        currentBattle: null // 当前战斗信息
    },
 parking: {
    level: 1, // 停车位等级
    exp: 0, // 停车经验
    expToNextLevel: [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000, 200000000], // 每级所需经验
    parkingLots: [], // 停车位数组，每个元素是一个对象 { carId: 'car1', parkTime: 1234567890 }
    cars: [] // 拥有的车辆数组，每个元素是车辆ID
},
   companionChestGuarantee: {
    epic: 0,     // 史诗保底计数器
    pink: 0,     // 卓越保底计数器
    orange: 0,  // 完美保底计数器
    red: 0       // 神赐保底计数器
},
 fishing: {
    level: 1,
    currentExp: 0,
    fishCage: [],
    isFishing: false,
    isBiting: false,
    biteTimer: null,
    biteWindowTimer: null,
    biteTime: 0,
    bonus: 1,
    autoFishingEnabled: false,
    autoDecomposeFishEnabled: false

},
mounts: {
            inventory: [], // 拥有的坐骑列表
            equipped: null, // 当前装备的坐骑ID
            level: 1, // 坐骑等级
            upgradeCost: 5 // 升级所需远古圣兽精魄数量
        },

wings: {
    inventory: [], // 拥有的翅膀列表
    equipped: null, // 当前装备的翅膀ID
    level: 1, // 翅膀等级（共享）
    upgradeCost: 5 // 下次升级所需的黑龙王翅膀数量
},
exploration: {
            speed: { level: 1, cost: 100 },
            capacity: { level: 1, cost: 100 },
            durability: { level: 1, cost: 100 },
            resources: {
                stardust: 0,
                darkMatter: 0,
                cosmicCrystal: 0,
                artifactFragment: 0
            },
            activeMission: null,
            missionEndTime: 0,
            logs: []
        },
tower: {
    currentFloor: 0,
    maxFloor: 0,
    isAutoAttacking: false,
    autoAttackInterval: null,
    battleLog: [],
    playerHealth: 0,
    playerAttack: 0,
    playerCritRate: 0,
    playerCritDamage: 0,
    monster: null
},
gems: {
            red: {},   // {等级: 数量}
            blue: {},
            black: {},
            green: {},
            pink: {},
            yellow: {}
        },
        companions: [], // 伴侣列表
    equippedCompanionId: null, // 当前装备的伴侣ID
    companionLevel: 1, // 共享的伴侣等级
   autoDecompose: {
    enabled: false,
    belowRarity: 'white' // 默认分解普通及以下
},
    items: {
        primaryGem: 0,
        advancedGem: 0,
        superiorGem: 0,
        divineGem: 0,
        refineStone: 0,
        vipPower: 0,
        rose: 0, // 玫瑰花
        companionKey: 0, // 伴侣钥匙
        rebornDan: 0,
        baitCount: 0,
        rootDetector: 0,
        bloodlineDetector: 0,
        advanceStone: 0,
        primaryGemq: 0,
        zongmen: 0,
        roseq: 0,
        yuzhou1: 0,  
       yuzhou2: 0, 
      yuzhou3: 0, 
     yuzhou4: 0, 
    banlv1: 0, 
     banlv2: 0, 
    banlv3: 0, 
    banlv4: 0, 
    banlv5: 0, 
     banlv6: 0, 
    banlv7: 0,
   banlv8: 0,
   banlv9: 0,
   zhiye1: 0,
   chiban1: 0,
   zuoqi1: 0,
   fuben1: 0,
 shenshou1: 0,
 lawPowerMaterial: 0,
   fuwen1: 0,
  fuben2: 0,
 danyao1: 0, 
     danyao2: 0, 
    danyao3: 0, 
    danyao4: 0, 
    danyao5: 0,
   fubeng1: 0,
 cultivationpill: 0,
  seed_herb1: 0,
  seed_herb2: 0,
  seed_herb3: 0,
  seed_herb4: 0,
  seed_herb5: 0
    },
timeSecretRealm: {
    currency: 0,
    bestFloor: 0,
    clearCount: 0,
    totalRuns: 0,
    clearCountByDifficulty: { easy: 0, normal: 0, hard: 0, nightmare: 0, hell: 0 },
    difficulty: { current: 'easy', unlocked: ['easy'] },
    codex: { rooms: {}, relics: {}, elites: 0, gambles: 0 },
    permanentBonuses: { baseTime: 0, startingBuffs: 0, eternalAttackBonus: 0, eternalHealthBonus: 0 },
    currentRun: {
        isActive: false,
        currentFloor: 1,
        timeLeft: 0,
        tempBuffs: [],
        relics: [],
        currentRoom: null,
        exploredRooms: 0,
        currencyEarned: 0,
        playerHealth: 0,
        playerAttack: 0
    }
},
  nightClub: {
    level: 1,
    exp: 0,
    starCoins: 0,
    staff: [
        { type: 'waiter', level: 1, expOutput: 0.5, coinsOutput: 0.2 },
        { type: 'guard', level: 1, expOutput: 0.3, coinsOutput: 0.1 },
        { type: 'dj', level: 1, expOutput: 1.0, coinsOutput: 0.5 },
        { type: 'chef', level: 1, expOutput: 0.4, coinsOutput: 0.3 },
        { type: 'hostess', level: 1, expOutput: 0.7, coinsOutput: 0.4 }
    ],
    equipment: [
        { type: 'sound', level: 1, bonus: 1.05 },
        { type: 'light', level: 1, bonus: 1.03 },
        { type: 'bar', level: 1, bonus: 1.02 },
        { type: 'dancefloor', level: 1, bonus: 1.04 }
    ],
    vip: {
        lastVisit: 0,
        nextVisit: 0
    },
    activeEvent: null,
    lastUpdate: Date.now(),
    goods: []
},
    collections: {
        lightSpeedHand: 0,
        empHand: 0,
        godlyHand: 0,
        quickHand: 0,
        shadowHand: 0,
        quantumHand: 0,
        lightningHand: 0,
        divineHand: 0
    },
    pets: {
        thunderKirin: { level: 0, cost: 1, multiplier: 0.10 },
        chaosTaotie: { level: 0, cost: 1, multiplier: 0.30 },
        netherQiongqi: { level: 0, cost: 1, multiplier: 0.90 },
        abyssKun: { level: 0, cost: 1, multiplier: 2.70 },
        primordialZhuLong: { level: 0, cost: 1, multiplier: 8.10 },
        wanJunSuanNi: { level: 0, cost: 1, multiplier: 24.30 },
         yanYuBiAn: { level: 0, cost: 1, multiplier: 72.90 },
        yuyu1: { level: 0, cost: 1, multiplier: 218.70 },
         yuyu2: { level: 0, cost: 1, multiplier: 656.10 },   
              yuyu3: { level: 0, cost: 1, multiplier: 1968.30 },
         yuyu4: { level: 0, cost: 1, multiplier: 5904.90 },
              yuyu5: { level: 0, cost: 1, multiplier: 17714.70 },
              yuyu6: { level: 0, cost: 1, multiplier: 53144.10 },
         yuyu7: { level: 0, cost: 1, multiplier: 159432.30 },
              yuyu8: { level: 0, cost: 1, multiplier: 478296.50 },
              yuyu9: { level: 0, cost: 1, multiplier: 1434890.70 },
              yuyu10: { level: 0, cost: 1, multiplier: 4304672.10 },
              yuyu11: { level: 0, cost: 1, multiplier: 12914016.30 }
    },
    dungeonEquipment: [],
     techniques: {}, 
            soulRings: [], 
            attributes: {
              totalPoints: 0,
               remainingPoints: 0,
                health: 0,
            attack: 0,
             critRate: 0,
              critDamage: 0,
             multiAttack: 0,
           block: 0
            },
      farm: {
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    fields: [],
    maxFields: 2,
    seeds: {},
    water: 10,
    lastUpdate: Date.now(),
    autoPlant: false,    // 新增自动种植设置
    autoHarvest: false
},
            lastUpdate: Date.now(),
            achievements: {
    "first_equipment": false,
    "first_rare": false,
    "first_epic": false,
    "first_legendary": false,
    "first_ancient": false,
    "first_divine": false,
    "first_arcane": false,
    "first_celestial": false,
    "first_infernal": false,
    "first_astral": false,
    "first_primeval": false,
    "first_transcendental": false,
    "first_quantum": false,
    "first_ultimate": false,
    "first_chaos": false,
    "first_eternal": false,
    "first_void": false,
    "first_genesis": false,
    "first_divineRealm": false,
    "first_apocalypse": false,
    "first_yeyu1": false,
    "first_yeyu2": false,
    "first_yeyu3": false,
    "first_yeyu4": false,
    "first_yeyu5": false,
    "first_yeyu6": false,
    "first_yeyu7": false,
    "first_yeyu8": false,
    "first_yeyu9": false,
    "first_yeyu10": false,
    "first_yeyu11": false,
    "first_yeyu12": false,
    "first_yeyu13": false,
    "first_yeyu14": false,
    "first_yeyu15": false,
    "first_yeyu16": false,
    "first_yeyu17": false,
    "first_yeyu18": false,
    "first_yeyu19": false,
    "first_yeyu20": false,
    "first_yeyu21": false,
    "first_yeyu22": false,
    "first_yeyu23": false,
    "first_yeyu24": false,
    "first_yeyu25": false,
    "first_yeyu26": false,
    "first_yeyu27": false,
    "first_yeyu28": false,
    "first_yeyu29": false,
    "first_yeyu30": false,
    "first_yeyu31": false,
    "first_yeyu32": false,
    "first_yeyu33": false,
    "common_chest_100": false,
    "common_chest_10000": false,
    "common_chest_1000000": false,
    "common_chest_10000000": false,
    "common_chest_100000000": false,
    "advanced_chest_100": false,
    "advanced_chest_10000": false,
    "advanced_chest_1000000": false,
    "advanced_chest_10000000": false,
    "advanced_chest_100000000": false,
    "rare_chest_100": false,
    "rare_chest_10000": false,
    "rare_chest_1000000": false,
    "rare_chest_10000000": false,
    "rare_chest_100000000": false,
    "epic_chest_100": false,
    "epic_chest_10000": false,
    "epic_chest_1000000": false,
    "epic_chest_10000000": false,
    "epic_chest_100000000": false,
    "legendary_chest_100": false,
    "legendary_chest_10000": false,
    "legendary_chest_1000000": false,
    "legendary_chest_10000000": false,
    "legendary_chest_100000000": false,
    "chaos_chest_100": false,
    "chaos_chest_10000": false,
    "chaos_chest_1000000": false,
    "chaos_chest_10000000": false,
    "chaos_chest_100000000": false,
    "apocalypse_chest_100": false,
    "apocalypse_chest_10000": false,
    "apocalypse_chest_1000000": false,
    "apocalypse_chest_10000000": false,
    "apocalypse_chest_100000000": false,
    "yeyu1_chest_100": false,
    "yeyu1_chest_10000": false,
    "yeyu1_chest_1000000": false,
    "yeyu1_chest_10000000": false,
    "yeyu1_chest_100000000": false,
    "yeyu2_chest_100": false,
    "yeyu2_chest_10000": false,
    "yeyu2_chest_1000000": false,
    "yeyu2_chest_10000000": false,
    "yeyu2_chest_100000000": false,
    "yeyu3_chest_100": false,
    "yeyu3_chest_10000": false,
    "yeyu3_chest_1000000": false,
    "yeyu3_chest_10000000": false,
    "yeyu3_chest_100000000": false,
    "yeyu4_chest_100": false,
    "yeyu4_chest_10000": false,
    "yeyu4_chest_1000000": false,
    "yeyu4_chest_10000000": false,
    "yeyu4_chest_100000000": false,
    "yeyu5_chest_100": false,
    "yeyu5_chest_10000": false,
    "yeyu5_chest_1000000": false,
    "yeyu5_chest_10000000": false,
    "yeyu5_chest_100000000": false,
    "yeyu6_chest_100": false,
    "yeyu6_chest_10000": false,
    "yeyu6_chest_1000000": false,
    "yeyu6_chest_10000000": false,
    "yeyu6_chest_100000000": false,
    "yeyu7_chest_100": false,
    "yeyu7_chest_10000": false,
    "yeyu7_chest_1000000": false,
    "yeyu7_chest_10000000": false,
    "yeyu7_chest_100000000": false,
    "yeyu8_chest_100": false,
    "yeyu8_chest_10000": false,
    "yeyu8_chest_1000000": false,
    "yeyu8_chest_10000000": false,
    "yeyu8_chest_100000000": false,
    "yeyu9_chest_100": false,
    "yeyu9_chest_10000": false,
    "yeyu9_chest_1000000": false,
    "yeyu9_chest_10000000": false,
    "yeyu9_chest_100000000": false,
    "yeyu10_chest_100": false,
    "yeyu10_chest_10000": false,
    "yeyu10_chest_1000000": false,
    "yeyu10_chest_10000000": false,
    "yeyu10_chest_100000000": false,
    "yeyu11_chest_100": false,
    "yeyu11_chest_10000": false,
    "yeyu11_chest_1000000": false,
    "yeyu11_chest_10000000": false,
    "yeyu11_chest_100000000": false,
    "max_stage_10": false,
    "max_stage_30": false,
    "max_stage_60": false,
    "max_stage_90": false,
    "max_stage_120": false,
    "max_stage_200": false,
    "max_stage_300": false,
    "max_stage_400": false,
    "max_stage_500": false,
    "max_stage_600": false,
    "max_stage_700": false,
    "max_stage_800": false,
    "max_stage_900": false,
    "max_stage_1000": false,

    // 新增宠物成就状态
    "thunderKirin_10": false,
    "thunderKirin_50": false,
    "thunderKirin_100": false,
    "chaosTaotie_10": false,
    "chaosTaotie_50": false,
    "chaosTaotie_100": false,
    "netherQiongqi_10": false,
    "netherQiongqi_50": false,
    "netherQiongqi_100": false,
    "abyssKun_10": false,
    "abyssKun_50": false,
    "abyssKun_100": false,
    "primordialZhuLong_10": false,
    "primordialZhuLong_50": false,
    "primordialZhuLong_100": false,
    "wanJunSuanNi_10": false,
    "wanJunSuanNi_50": false,
    "wanJunSuanNi_100": false,
    "yanYuBiAn_10": false,
    "yanYuBiAn_50": false,
    "yanYuBiAn_100": false,
    "yuyu1_10": false,
    "yuyu1_50": false,
    "yuyu1_100": false,
    "yuyu2_10": false,
    "yuyu2_50": false,
    "yuyu2_100": false,
    "yuyu3_10": false,
    "yuyu3_50": false,
    "yuyu3_100": false,
    "yuyu4_10": false,
    "yuyu4_50": false,
    "yuyu4_100": false,
    "yuyu5_10": false,
    "yuyu5_50": false,
    "yuyu5_100": false,
    "yuyu6_10": false,
    "yuyu6_50": false,
    "yuyu6_100": false,
    "yuyu7_10": false,
    "yuyu7_50": false,
    "yuyu7_100": false,
    "yuyu8_10": false,
    "yuyu8_50": false,
    "yuyu8_100": false,
    "yuyu9_10": false,
    "yuyu9_50": false,
    "yuyu9_100": false,
    "yuyu10_10": false,
    "yuyu10_50": false,
    "yuyu10_100": false,
    "yuyu11_10": false,
    "yuyu11_50": false,
    "yuyu11_100": false,

    // 新增魂环成就状态
    "year1_10": false,
    "year10_10": false,
    "year100_10": false,
    "year1000_10": false,
    "year10000_10": false,
    "year100000_10": false,
    "year1000000_10": false,
    "year10000000_10": false,
    "year100000000_10": false,
    "year1_100": false,
    "year10_100": false,
    "year100_100": false,
    "year1000_100": false,
    "year10000_100": false,
    "year100000_100": false,
    "year1000000_100": false,
    "year10000000_100": false,
    "year100000000_100": false,
    "year1_1000": false,
    "year10_1000": false,
    "year100_1000": false,
    "year1000_1000": false,
    "year10000_1000": false,
    "year100000_1000": false,
    "year1000000_1000": false,
    "year10000000_1000": false,
    "year100000000_1000": false,
    "year1_10000": false,
    "year10_10000": false,
    "year100_10000": false,
    "year1000_10000": false,
    "year10000_10000": false,
    "year100000_10000": false,
    "year1000000_10000": false,
    "year10000000_10000": false,
    "year100000000_10000": false,
    "year2_10": false,
    "year2_100": false,
    "year2_1000": false,
    "year2_10000": false,
    "year3_10": false,
    "year3_100": false,
    "year3_1000": false,
    "year3_10000": false,
    "year4_10": false,
    "year4_100": false,
    "year4_1000": false,
    "year4_10000": false,
    "year5_10": false,
    "year5_100": false,
    "year5_1000": false,
    "year5_10000": false,
    "year6_10": false,
    "year6_100": false,
    "year6_1000": false,
    "year6_10000": false,
    "year7_10": false,
    "year7_100": false,
    "year7_1000": false,
    "year7_10000": false,
    "year8_10": false,
    "year8_100": false,
    "year8_1000": false,
    "year8_10000": false,
    "year9_10": false,
    "year9_100": false,
    "year9_1000": false,
    "year9_10000": false,
    "year11_10": false,
    "year11_100": false,
    "year11_1000": false,
    "year11_10000": false,
    "year12_10": false,
    "year12_100": false,
    "year12_1000": false,
    "year12_10000": false,
    "year13_10": false,
    "year13_100": false,
    "year13_1000": false,
    "year13_10000": false,
    "year14_10": false,
    "year14_100": false,
    "year14_1000": false,
    "year14_10000": false,
    "year15_10": false,
    "year15_100": false,
    "year15_1000": false,
    "year15_10000": false,
    "year16_10": false,
    "year16_100": false,
    "year16_1000": false,
    "year16_10000": false,
    "year17_10": false,
    "year17_100": false,
    "year17_1000": false,
    "year17_10000": false,
    "year18_10": false,
    "year18_100": false,
    "year18_1000": false,
    "year18_10000": false,
    "year19_10": false,
    "year19_100": false,
    "year19_1000": false,
    "year19_10000": false,
    "year20_10": false,
    "year20_100": false,
    "year20_1000": false,
    "year20_10000": false,
    "year21_10": false,
    "year21_100": false,
    "year21_1000": false,
    "year21_10000": false,
    "year22_10": false,
    "year22_100": false,
    "year22_1000": false,
    "year22_10000": false,
    "year23_10": false,
    "year23_100": false,
    "year23_1000": false,
    "year23_10000": false,
    "year24_10": false,
    "year24_100": false,
    "year24_1000": false,
    "year24_10000": false,
    "year25_10": false,
    "year25_100": false,
    "year25_1000": false,
    "year25_10000": false,
    "year26_10": false,
    "year26_100": false,
    "year26_1000": false,
    "year26_10000": false,
    "year27_10": false,
    "year27_100": false,
    "year27_1000": false,
    "year27_10000": false,
    "year28_10": false,
    "year28_100": false,
    "year28_1000": false,
    "year28_10000": false,
    "year29_10": false,
    "year29_100": false,
    "year29_1000": false,
    "year29_10000": false,
    "year30_10": false,
    "year30_100": false,
    "year30_1000": false,
    "year30_10000": false,
    "year31_10": false,
    "year31_100": false,
    "year31_1000": false,
    "year31_10000": false,
    "year32_10": false,
    "year32_100": false,
    "year32_1000": false,
    "year32_10000": false,
    "year33_10": false,
    "year33_100": false,
    "year33_1000": false,
    "year33_10000": false,
    "year34_10": false,
    "year34_100": false,
    "year34_1000": false,
    "year34_10000": false,
    "year35_10": false,
    "year35_100": false,
    "year35_1000": false,
    "year35_10000": false,
    "year36_10": false,
    "year36_100": false,
    "year36_1000": false,
    "year36_10000": false,
    "year37_10": false,
    "year37_100": false,
    "year37_1000": false,
    "year37_10000": false,
    "year38_10": false,
    "year38_100": false,
    "year38_1000": false,
    "year38_10000": false,
    "year39_10": false,
    "year39_100": false,
    "year39_1000": false,
    "year39_10000": false,
    "year40_10": false,
    "year40_100": false,
    "year40_1000": false,
    "year40_10000": false,
    "year41_10": false,
    "year41_100": false,
    "year41_1000": false,
    "year41_10000": false,
    "year42_10": false,
    "year42_100": false,
    "year42_1000": false,
    "year42_10000": false,
    "year43_10": false,
    "year43_100": false,
    "year43_1000": false,
    "year43_10000": false,
    "year44_10": false,
    "year44_100": false,
    "year44_1000": false,
    "year44_10000": false,
    "year45_10": false,
    "year45_100": false,
    "year45_1000": false,
    "year45_10000": false,
    "year46_10": false,
    "year46_100": false,
    "year46_1000": false,
    "year46_10000": false,
    "year47_10": false,
    "year47_100": false,
    "year47_1000": false,
    "year47_10000": false,
    "year48_10": false,
    "year48_100": false,
    "year48_1000": false,
    "year48_10000": false,
    "year49_10": false,
    "year49_100": false,
    "year49_1000": false,
    "year49_10000": false,
    "year50_10": false,
    "year50_100": false,
    "year50_1000": false,
    "year50_10000": false,
    "year51_10": false,
    "year51_100": false,
    "year51_1000": false,
    "year51_10000": false,
    "year52_10": false,
    "year52_100": false,
    "year52_1000": false,
    "year52_10000": false,
    "year53_10": false,
    "year53_100": false,
    "year53_1000": false,
    "year53_10000": false,
    "year54_10": false,
    "year54_100": false,
    "year54_1000": false,
    "year54_10000": false,
    "year55_10": false,
    "year55_100": false,
    "year55_1000": false,
    "year55_10000": false,
    "year56_10": false,
    "year56_100": false,
    "year56_1000": false,
    "year56_10000": false,
    "year57_10": false,
    "year57_100": false,
    "year57_1000": false,
    "year57_10000": false,
    "world_boss_1st": false,
    "world_boss_top5": false,
    "world_boss_top10": false,
    "world_boss_participant": false,
    "reincarnation_10": false,
    "reincarnation_100": false,
    "reincarnation_1000": false,
    "reincarnation_10000": false
      },
            actionLogs: [], 
            goldLogs: [],
            autoBuy: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], 
            autoBuySpeedBoost: false,
            onlineBoostEnabled: false,
            autoBuyMaterialChest: false, 
            autoBuyTechniqueChest: false, 
            autoBuyTechniqueMaxCost: 0.1,
            gpsMultiplier: 1, 
            clickMultiplier: 1,
            autoConvert: false,
            autoConvertDebug: false,
            autoConvertCurrency: {
                gold: false,
                diamond: false,
                titanium: false,
                starstone: false,
                cosmicstone: false,
                superstone: false,
                otherworldstone: false,
                xingjiestone: false,
                hundunstone: false,
                lingtone: false,
                huangtone: false,
                mingtone: false,
                xutong: false,
                shitone: false,
                weitone: false,
                yongtone: false,
                wujitone: false
            },
            clickTimestamps: [], 
            chestCounts: { 
                common: 0,
                advanced: 0,
                rare: 0,
                epic: 0,
                legendary: 0
            },
            reincarnationStats: { 
                gpsBonus: { level: 0, cost: 1 },
                equipmentLevelBonus: { level: 0, cost: 1 },
                clickLimitBonus: { level: 0, cost: 1 },
                reincarnationCoinBonus: { level: 0, cost: 1 }
            },
            materialChestCost: 1,
            techniqueChestCost: 1,
            stockData: { 
                stocks: [
                    { name: '青龙至尊股', basePrice: 1, currentPrice: 1, lastPrice: 1, shares: 0, avgCost: 0 },
                    { name: '白虎至尊股', basePrice: 10, currentPrice: 10, lastPrice: 10, shares: 0, avgCost: 0 },
                    { name: '朱雀至尊股', basePrice: 100, currentPrice: 100, lastPrice: 100, shares: 0, avgCost: 0 },
                    { name: '玄武至尊股', basePrice: 1000, currentPrice: 1000, lastPrice: 1000, shares: 0, avgCost: 0 },
                    { name: '瑞兽白泽股', basePrice: 10000, currentPrice: 10000, lastPrice: 10000, shares: 0, avgCost: 0 }
                ],
                lastStockUpdate: Date.now()
            },
     fundData: {
    funds: [
        { name: "稳健型基金", netValue: 1.00, maxInvestment: 100000, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 },
        { name: "平衡型基金", netValue: 1.00, maxInvestment: 1000000, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 },
        { name: "成长型基金", netValue: 1.00, maxInvestment: 100000000, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 },
        { name: "进取型基金", netValue: 1.00, maxInvestment: 1e15, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 },
        { name: "激进型基金", netValue: 1.00, maxInvestment: 1e30, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 },
        { name: "风险型基金", netValue: 1.00, maxInvestment: 1e50, investment: 0, lastUpdate: Date.now(), redemptionTime: 0, returnRate: 0 }
    ],
    lastFundUpdate: Date.now()
},
            lotteryResults: [],
            traditionalLotteryNumbers: [],
         traditionalLotteryPurchased: false,
          traditionalLotteryBought: false,
         traditionalLotteryDrawTime: 0,
            lastLotteryDraw: Date.now(),
           titles: {
        unlocked: [], // 已解锁称号列表
        current: null // 当前选择的称号
    },
            bank: { 
                deposit: 0, 
                lastInterestUpdate: Date.now() 
            },
         parking: {
            level: 1,
            exp: 0,
            maxSpots: 1,
            vehicles: [],
            parkedVehicles: [],
            lastUpdate: Date.now(),
            totalIncome: 0
        },
            battle: {
                currentStage: 0,
        maxStage: 0,
        monster: null,
        playerHealth: 0,
        playerAttack: 0,
        playerCritRate: 0.1,
        playerCritDamage: 1.5,
        playerAccuracy: 0.9,
        playerDodge: 0.1,
        autoSweepEnabled: false  
    }
};
        // 成就奖励配置
        const achievementRewards = {
    "common": { gpsMultiplier: 0.15, description: "获得普通装备，GPS +15%" },
    "rare": { gpsMultiplier: 0.30, description: "获得稀有装备，GPS +30%" },
    "epic": { gpsMultiplier: 0.45, description: "获得史诗装备，GPS +45%" },
    "legendary": { gpsMultiplier: 0.60, description: "获得传说装备，GPS +60%" },
    "ancient": { gpsMultiplier: 0.75, description: "获得远古装备，GPS +75%" },
    "divine": { gpsMultiplier: 0.90, description: "获得神圣装备，GPS +90%" },
    "arcane": { gpsMultiplier: 1.05, description: "获得奥术装备，GPS +105%" },
    "celestial": { gpsMultiplier: 1.30, description: "获得天空装备，GPS +130%" },
    "infernal": { gpsMultiplier: 1.45, description: "获得地狱装备，GPS +145%" },
    "astral": { gpsMultiplier: 1.60, description: "获得星界装备，GPS +160%" },
    "primeval": { gpsMultiplier: 1.75, description: "获得原初装备，GPS +175%" },
    "transcendental": { gpsMultiplier: 1.90, description: "获得超凡装备，GPS +190%" },
    "quantum": { gpsMultiplier: 2.05, description: "获得量子装备，GPS +205%" },
    "ultimate": { gpsMultiplier: 2.20, description: "获得究极装备，GPS +220%" },
    "chaos": { gpsMultiplier: 2.35, description: "获得混沌装备，GPS +235%" },
    "eternal": { gpsMultiplier: 2.50, description: "获得永恒装备，GPS +250%" },
    "void": { gpsMultiplier: 2.70, description: "获得虚无装备，GPS +270%" },
    "genesis": { gpsMultiplier: 2.80, description: "获得创世装备，GPS +280%" },
    "divineRealm": { gpsMultiplier: 2.90, description: "获得神域装备，GPS +290%" },
    "apocalypse": { gpsMultiplier: 3.00, description: "获得终焉装备，GPS +300%" },
    "yeyu1": { gpsMultiplier: 3.10, description: "获得星辰装备，GPS +310%" },
    "yeyu2": { gpsMultiplier: 3.20, description: "获得起源装备，GPS +320%" },
    "yeyu3": { gpsMultiplier: 3.30, description: "获得时光装备，GPS +330%" },
    "yeyu4": { gpsMultiplier: 3.40, description: "获得造物装备，GPS +340%" },
    "yeyu5": { gpsMultiplier: 3.50, description: "获得银河装备，GPS +350%" },
    "yeyu6": { gpsMultiplier: 3.60, description: "获得天界装备，GPS +360%" },
    "yeyu7": { gpsMultiplier: 3.70, description: "获得星云装备，GPS +370%" },
    "yeyu8": { gpsMultiplier: 3.80, description: "获得星河装备，GPS +380%" },
    "yeyu9": { gpsMultiplier: 3.90, description: "获得纪元装备，GPS +390%" },
    "yeyu10": { gpsMultiplier: 4.00, description: "获得鸿蒙装备，GPS +400%" },
    "yeyu11": { gpsMultiplier: 4.10, description: "获得星穹装备，GPS +410%" },
    "yeyu12": { gpsMultiplier: 4.20, description: "获得亘古装备，GPS +420%" },
    "yeyu13": { gpsMultiplier: 4.30, description: "获得万象装备，GPS +430%" },
    "yeyu14": { gpsMultiplier: 4.40, description: "获得太虚装备，GPS +440%" },
    "yeyu15": { gpsMultiplier: 4.50, description: "获得九垓装备，GPS +450%" },
    "yeyu16": { gpsMultiplier: 4.60, description: "获得穿梭装备，GPS +460%" },
    "yeyu17": { gpsMultiplier: 4.70, description: "获得恒古装备，GPS +470%" },
    "yeyu18": { gpsMultiplier: 4.80, description: "获得虚空装备，GPS +480%" },    
     "yeyu19": { gpsMultiplier: 4.90, description: "获得蔚来装备，GPS +490%" },
    "yeyu20": { gpsMultiplier: 5.00, description: "获得神罚装备，GPS +500%" },
    "yeyu21": { gpsMultiplier: 5.10, description: "获得时空装备，GPS +510%" },    
    "yeyu22": { gpsMultiplier: 5.20, description: "获得未来装备，GPS +520%" },
    "yeyu23": { gpsMultiplier: 5.30, description: "获得从前装备，GPS +530%" },
    "yeyu24": { gpsMultiplier: 5.40, description: "获得星澜装备，GPS +540%" },
    "yeyu25": { gpsMultiplier: 5.50, description: "获得逆旅装备，GPS +550%" },
    "yeyu26": { gpsMultiplier: 5.60, description: "获得终章装备，GPS +560%" },
    "yeyu27": { gpsMultiplier: 5.70, description: "获得轮回装备，GPS +570%" },
    "yeyu28": { gpsMultiplier: 5.80, description: "获得恒宇装备，GPS +580%" },
    "yeyu29": { gpsMultiplier: 5.90, description: "获得无垠装备，GPS +590%" },
    "yeyu30": { gpsMultiplier: 6.00, description: "获得寂灭装备，GPS +600%" },
    "yeyu31": { gpsMultiplier: 6.10, description: "获得大道装备，GPS +610%" },
    "yeyu32": { gpsMultiplier: 6.20, description: "获得本源装备，GPS +620%" },
    "yeyu33": { gpsMultiplier: 6.30, description: "获得至高装备，GPS +630%" },
    // 新增成就奖励
    "common_chest_100": { gpsMultiplier: 0.10, description: "购买普通宝箱总数达到100个，GPS +10%" },
    "common_chest_10000": { gpsMultiplier: 0.20, description: "购买普通宝箱总数达到1万个，GPS +20%" },
    "common_chest_1000000": { gpsMultiplier: 0.40, description: "购买普通宝箱总数达到100万个，GPS +40%" },
    "common_chest_10000000": { gpsMultiplier: 0.80, description: "购买普通宝箱总数达到1000万个，GPS +80%" },
    "common_chest_100000000": { gpsMultiplier: 1.00, description: "购买普通宝箱总数达到1亿个，GPS +100%" },
    "advanced_chest_100": { gpsMultiplier: 0.20, description: "购买高级宝箱总数达到100个，GPS +20%" },
    "advanced_chest_10000": { gpsMultiplier: 0.40, description: "购买高级宝箱总数达到1万个，GPS +40%" },
    "advanced_chest_1000000": { gpsMultiplier: 0.70, description: "购买高级宝箱总数达到100万个，GPS +70%" },
    "advanced_chest_10000000": { gpsMultiplier: 1.20, description: "购买高级宝箱总数达到1000万个，GPS +120%" },
    "advanced_chest_100000000": { gpsMultiplier: 1.70, description: "购买高级宝箱总数达到1亿个，GPS +170%" },
    "rare_chest_100": { gpsMultiplier: 0.30, description: "购买稀有宝箱总数达到100个，GPS +30%" },
    "rare_chest_10000": { gpsMultiplier: 0.60, description: "购买稀有宝箱总数达到1万个，GPS +60%" },
    "rare_chest_1000000": { gpsMultiplier: 1.00, description: "购买稀有宝箱总数达到100万个，GPS +100%" },
    "rare_chest_10000000": { gpsMultiplier: 1.60, description: "购买稀有宝箱总数达到1000万个，GPS +160%" },
    "rare_chest_100000000": { gpsMultiplier: 2.40, description: "购买稀有宝箱总数达到1亿个，GPS +240%" },
    "epic_chest_100": { gpsMultiplier: 0.40, description: "购买史诗宝箱总数达到100个，GPS +40%" },
    "epic_chest_10000": { gpsMultiplier: 0.80, description: "购买史诗宝箱总数达到1万个，GPS +80%" },
    "epic_chest_1000000": { gpsMultiplier: 1.30, description: "购买史诗宝箱总数达到100万个，GPS +130%" },
    "epic_chest_10000000": { gpsMultiplier: 2.00, description: "购买史诗宝箱总数达到1000万个，GPS +200%" },
    "epic_chest_100000000": { gpsMultiplier: 3.10, description: "购买史诗宝箱总数达到1亿个，GPS +310%" },
    "legendary_chest_100": { gpsMultiplier: 0.50, description: "购买传说宝箱总数达到100个，GPS +50%" },
    "legendary_chest_10000": { gpsMultiplier: 1.00, description: "购买传说宝箱总数达到1万个，GPS +100%" },
    "legendary_chest_1000000": { gpsMultiplier: 1.60, description: "购买传说宝箱总数达到100万个，GPS +160%" },
    "legendary_chest_10000000": { gpsMultiplier: 2.40, description: "购买传说宝箱总数达到1000万个，GPS +240%" },
    "legendary_chest_100000000": { gpsMultiplier: 3.80, description: "购买传说宝箱总数达到1亿个，GPS +380%" },
    "chaos_chest_100": { gpsMultiplier: 0.60, description: "购买混沌宝箱总数达到100个，GPS +60%" },
    "chaos_chest_10000": { gpsMultiplier: 1.20, description: "购买混沌宝箱总数达到1万个，GPS +120%" },
    "chaos_chest_1000000": { gpsMultiplier: 1.90, description: "购买混沌宝箱总数达到100万个，GPS +190%" },
    "chaos_chest_10000000": { gpsMultiplier: 2.80, description: "购买混沌宝箱总数达到1000万个，GPS +280%" },
    "chaos_chest_100000000": { gpsMultiplier: 4.50, description: "购买混沌宝箱总数达到1亿个，GPS +450%" },
    "apocalypse_chest_100": { gpsMultiplier: 0.70, description: "购买终焉宝箱总数达到100个，GPS +70%" },
    "apocalypse_chest_10000": { gpsMultiplier: 1.40, description: "购买终焉宝箱总数达到1万个，GPS +140%" },
    "apocalypse_chest_1000000": { gpsMultiplier: 2.20, description: "购买终焉宝箱总数达到100万个，GPS +220%" },
    "apocalypse_chest_10000000": { gpsMultiplier: 3.20, description: "购买终焉宝箱总数达到1000万个，GPS +320%" },
    "apocalypse_chest_100000000": { gpsMultiplier: 5.20, description: "购买终焉宝箱总数达到1亿个，GPS +520%" },
    "yeyu1_chest_100": { gpsMultiplier: 0.80, description: "购买星辰宝箱总数达到100个，GPS +80%" },
    "yeyu1_chest_10000": { gpsMultiplier: 1.50, description: "购买星辰宝箱总数达到1万个，GPS +150%" },
    "yeyu1_chest_1000000": { gpsMultiplier: 2.30, description: "购买星辰宝箱总数达到100万个，GPS +230%" },
    "yeyu1_chest_10000000": { gpsMultiplier: 3.30, description: "购买星辰宝箱总数达到1000万个，GPS +330%" },
    "yeyu1_chest_100000000": { gpsMultiplier: 5.30, description: "购买星辰宝箱总数达到1亿个，GPS +530%" },
    "yeyu2_chest_100": { gpsMultiplier: 0.90, description: "购买银河宝箱总数达到100个，GPS +90%" },
    "yeyu2_chest_10000": { gpsMultiplier: 1.60, description: "购买银河宝箱总数达到1万个，GPS +160%" },
    "yeyu2_chest_1000000": { gpsMultiplier: 2.40, description: "购买银河宝箱总数达到100万个，GPS +240%" },
    "yeyu2_chest_10000000": { gpsMultiplier: 3.40, description: "购买银河宝箱总数达到1000万个，GPS +340%" },
    "yeyu2_chest_100000000": { gpsMultiplier: 5.40, description: "购买银河宝箱总数达到1亿个，GPS +540%" },
        "yeyu3_chest_100": { gpsMultiplier: 1.00, description: "购买星云宝箱总数达到100个，GPS +100%" },
    "yeyu3_chest_10000": { gpsMultiplier: 1.70, description: "购买星云宝箱总数达到1万个，GPS +170%" },
    "yeyu3_chest_1000000": { gpsMultiplier: 2.50, description: "购买星云宝箱总数达到100万个，GPS +250%" },
    "yeyu3_chest_10000000": { gpsMultiplier: 3.50, description: "购买星云宝箱总数达到1000万个，GPS +350%" },
    "yeyu3_chest_100000000": { gpsMultiplier: 5.50, description: "购买星云宝箱总数达到1亿个，GPS +550%" },
        "yeyu4_chest_100": { gpsMultiplier: 1.10, description: "购买鸿蒙宝箱总数达到100个，GPS +110%" },
    "yeyu4_chest_10000": { gpsMultiplier: 1.80, description: "购买鸿蒙宝箱总数达到1万个，GPS +180%" },
    "yeyu4_chest_1000000": { gpsMultiplier: 2.60, description: "购买鸿蒙宝箱总数达到100万个，GPS +260%" },
    "yeyu4_chest_10000000": { gpsMultiplier: 3.60, description: "购买鸿蒙宝箱总数达到1000万个，GPS +360%" },
    "yeyu4_chest_100000000": { gpsMultiplier: 5.60, description: "购买鸿蒙宝箱总数达到1亿个，GPS +560%" },
        "yeyu5_chest_100": { gpsMultiplier: 1.20, description: "购买太虚宝箱总数达到100个，GPS +120%" },
    "yeyu5_chest_10000": { gpsMultiplier: 1.90, description: "购买太虚宝箱总数达到1万个，GPS +190%" },
    "yeyu5_chest_1000000": { gpsMultiplier: 2.70, description: "购买太虚宝箱总数达到100万个，GPS +270%" },
    "yeyu5_chest_10000000": { gpsMultiplier: 3.70, description: "购买太虚宝箱总数达到1000万个，GPS +370%" },
    "yeyu5_chest_100000000": { gpsMultiplier: 5.70, description: "购买太虚宝箱总数达到1亿个，GPS +570%" },
       "yeyu6_chest_100": { gpsMultiplier: 1.30, description: "购买星云宝箱总数达到100个，GPS +130%" },
    "yeyu6_chest_10000": { gpsMultiplier: 2.00, description: "购买星云宝箱总数达到1万个，GPS +200%" },
    "yeyu6_chest_1000000": { gpsMultiplier: 2.80, description: "购买星云宝箱总数达到100万个，GPS +280%" },
    "yeyu6_chest_10000000": { gpsMultiplier: 3.70, description: "购买星云宝箱总数达到1000万个，GPS +370%" },
    "yeyu6_chest_100000000": { gpsMultiplier: 5.70, description: "购买星云宝箱总数达到1亿个，GPS +570%" },
    "yeyu7_chest_100": { gpsMultiplier: 1.40, description: "购买鸿蒙宝箱总数达到100个，GPS +140%" },
    "yeyu7_chest_10000": { gpsMultiplier: 2.10, description: "购买鸿蒙宝箱总数达到1万个，GPS +210%" },
    "yeyu7_chest_1000000": { gpsMultiplier: 2.90, description: "购买鸿蒙宝箱总数达到100万个，GPS +290%" },
    "yeyu7_chest_10000000": { gpsMultiplier: 3.80, description: "购买鸿蒙宝箱总数达到1000万个，GPS +380%" },
    "yeyu7_chest_100000000": { gpsMultiplier: 5.80, description: "购买鸿蒙宝箱总数达到1亿个，GPS +580%" },
    "yeyu8_chest_100": { gpsMultiplier: 1.50, description: "购买太虚宝箱总数达到100个，GPS +120%" },
    "yeyu8_chest_10000": { gpsMultiplier: 2.20, description: "购买太虚宝箱总数达到1万个，GPS +220%" },
    "yeyu8_chest_1000000": { gpsMultiplier: 3.00, description: "购买太虚宝箱总数达到100万个，GPS +300%" },
    "yeyu8_chest_10000000": { gpsMultiplier: 3.90, description: "购买太虚宝箱总数达到1000万个，GPS +390%" },
    "yeyu8_chest_100000000": { gpsMultiplier: 5.90, description: "购买太虚宝箱总数达到1亿个，GPS +590%" },
    "yeyu9_chest_100": { gpsMultiplier: 1.60, description: "购买永恒宝箱总数达到100个，GPS +160%" },
    "yeyu9_chest_10000": { gpsMultiplier: 2.30, description: "购买永恒宝箱总数达到1万个，GPS +230%" },
    "yeyu9_chest_1000000": { gpsMultiplier: 3.10, description: "购买永恒宝箱总数达到100万个，GPS +310%" },
    "yeyu9_chest_10000000": { gpsMultiplier: 4.00, description: "购买永恒宝箱总数达到1000万个，GPS +400%" },
    "yeyu9_chest_100000000": { gpsMultiplier: 6.00, description: "购买永恒宝箱总数达到1亿个，GPS +600%" },
    "yeyu10_chest_100": { gpsMultiplier: 1.70, description: "购买无极宝箱总数达到100个，GPS +170%" },
    "yeyu10_chest_10000": { gpsMultiplier: 2.40, description: "购买无极宝箱总数达到1万个，GPS +240%" },
    "yeyu10_chest_1000000": { gpsMultiplier: 3.20, description: "购买无极宝箱总数达到100万个，GPS +320%" },
    "yeyu10_chest_10000000": { gpsMultiplier: 4.10, description: "购买无极宝箱总数达到1000万个，GPS +410%" },
    "yeyu10_chest_100000000": { gpsMultiplier: 6.10, description: "购买无极宝箱总数达到1亿个，GPS +610%" },
    "yeyu11_chest_100": { gpsMultiplier: 1.80, description: "购买大道宝箱总数达到100个，GPS +180%" },
    "yeyu11_chest_10000": { gpsMultiplier: 2.50, description: "购买大道宝箱总数达到1万个，GPS +250%" },
    "yeyu11_chest_1000000": { gpsMultiplier: 3.30, description: "购买大道宝箱总数达到100万个，GPS +330%" },
    "yeyu11_chest_10000000": { gpsMultiplier: 4.20, description: "购买大道宝箱总数达到1000万个，GPS +420%" },
    "yeyu11_chest_100000000": { gpsMultiplier: 6.20, description: "购买大道宝箱总数达到1亿个，GPS +620%" },
    "max_stage_10": { gpsMultiplier: 0.20, description: "达到最大关卡10，GPS +20%" },
    "max_stage_30": { gpsMultiplier: 0.50, description: "达到最大关卡30，GPS +50%" },
    "max_stage_60": { gpsMultiplier: 0.80, description: "达到最大关卡60，GPS +80%" },
    "max_stage_90": { gpsMultiplier: 1.20, description: "达到最大关卡90，GPS +120%" },
    "max_stage_120": { gpsMultiplier: 1.50, description: "达到最大关卡120，GPS +150%" },
    "max_stage_200": { gpsMultiplier: 1.80, description: "达到最大关卡200，GPS +180%" },
    "max_stage_300": { gpsMultiplier: 2.10, description: "达到最大关卡300，GPS +210%" },
    "max_stage_400": { gpsMultiplier: 2.40, description: "达到最大关卡400，GPS +240%" },
    "max_stage_500": { gpsMultiplier: 2.70, description: "达到最大关卡500，GPS +270%" },
    "max_stage_600": { gpsMultiplier: 3.00, description: "达到最大关卡600，GPS +300%" },
    "max_stage_700": { gpsMultiplier: 3.30, description: "达到最大关卡700，GPS +330%" },
    "max_stage_800": { gpsMultiplier: 3.60, description: "达到最大关卡800，GPS +360%" },
    "max_stage_900": { gpsMultiplier: 3.90, description: "达到最大关卡900，GPS +390%" },
    "max_stage_1000": { gpsMultiplier: 4.10, description: "达到最大关卡1000，GPS +410%" },

    // 新增宠物成就
    "thunderKirin_10": { gpsMultiplier: 0.10, description: "苍雷麒麟达到10级，GPS +10%" },
    "thunderKirin_50": { gpsMultiplier: 0.30, description: "苍雷麒麟达到50级，GPS +30%" },
    "thunderKirin_100": { gpsMultiplier: 1.00, description: "苍雷麒麟达到100级，GPS +100%" },
    "chaosTaotie_10": { gpsMultiplier: 0.20, description: "混沌饕餮达到10级，GPS +20%" },
    "chaosTaotie_50": { gpsMultiplier: 0.40, description: "混沌饕餮达到50级，GPS +40%" },
    "chaosTaotie_100": { gpsMultiplier: 1.20, description: "混沌饕餮达到100级，GPS +120%" },
    "netherQiongqi_10": { gpsMultiplier: 0.20, description: "九幽穷奇达到10级，GPS +20%" },
    "netherQiongqi_50": { gpsMultiplier: 0.50, description: "九幽穷奇达到50级，GPS +50%" },
    "netherQiongqi_100": { gpsMultiplier: 1.50, description: "九幽穷奇达到100级，GPS +150%" },
    "abyssKun_10": { gpsMultiplier: 0.30, description: "霸渊巨鲲达到10级，GPS +30%" },
    "abyssKun_50": { gpsMultiplier: 0.70, description: "霸渊巨鲲达到50级，GPS +70%" },
    "abyssKun_100": { gpsMultiplier: 2.00, description: "霸渊巨鲲达到100级，GPS +200%" },
    "primordialZhuLong_10": { gpsMultiplier: 0.50, description: "太初烛龙达到10级，GPS +50%" },
    "primordialZhuLong_50": { gpsMultiplier: 1.00, description: "太初烛龙达到50级，GPS +100%" },
    "primordialZhuLong_100": { gpsMultiplier: 2.50, description: "太初烛龙达到100级，GPS +250%" },
    "wanJunSuanNi_10": { gpsMultiplier: 0.70, description: "万钧狻猊达到10级，GPS +70%" },
    "wanJunSuanNi_50": { gpsMultiplier: 1.50, description: "万钧狻猊达到50级，GPS +150%" },
    "wanJunSuanNi_100": { gpsMultiplier: 3.00, description: "万钧狻猊达到100级，GPS +300%" },
    "yanYuBiAn_10": { gpsMultiplier: 1.00, description: "炎狱狴犴达到10级，GPS +100%" },
    "yanYuBiAn_50": { gpsMultiplier: 2.00, description: "炎狱狴犴达到50级，GPS +200%" },
    "yanYuBiAn_100": { gpsMultiplier: 3.50, description: "炎狱狴犴达到100级，GPS +350%" },
     "yuyu1_10": { gpsMultiplier: 1.00, description: "赤霄夔龙达到10级，GPS +100%" },
    "yuyu1_50": { gpsMultiplier: 2.50, description: "赤霄夔龙达到50级，GPS +250%" },
    "yuyu1_100": { gpsMultiplier: 4.00, description: "赤霄夔龙达到100级，GPS +400%" },
    "yuyu2_10": { gpsMultiplier: 1.30, description: "震岳白泽达到10级，GPS +130%" },
    "yuyu2_50": { gpsMultiplier: 3.00, description: "震岳白泽达到50级，GPS +300%" },
    "yuyu2_100": { gpsMultiplier: 4.50, description: "震岳白泽达到100级，GPS +450%" },
    "yuyu3_10": { gpsMultiplier: 1.60, description: "焚天蛊雕达到10级，GPS +160%" },
    "yuyu3_50": { gpsMultiplier: 3.50, description: "焚天蛊雕达到50级，GPS +350%" },
    "yuyu3_100": { gpsMultiplier: 5.00, description: "焚天蛊雕达到100级，GPS +500%" },
    "yuyu4_10": { gpsMultiplier: 1.90, description: "血煞梼杌达到10级，GPS +190%" },
    "yuyu4_50": { gpsMultiplier: 4.00, description: "血煞梼杌达到50级，GPS +400%" },
    "yuyu4_100": { gpsMultiplier: 5.50, description: "血煞梼杌达到100级，GPS +550%" },
    "yuyu5_10": { gpsMultiplier: 2.20, description: "玄渊白犼达到10级，GPS +220%" },
    "yuyu5_50": { gpsMultiplier: 4.50, description: "玄渊白犼达到50级，GPS +450%" },
    "yuyu5_100": { gpsMultiplier: 6.00, description: "玄渊白犼达到100级，GPS +600%" },
    "yuyu6_10": { gpsMultiplier: 2.50, description: "灾祸蜚牛达到10级，GPS +250%" },
    "yuyu6_50": { gpsMultiplier: 5.00, description: "灾祸蜚牛达到50级，GPS +500%" },
    "yuyu6_100": { gpsMultiplier: 6.50, description: "灾祸蜚牛达到100级，GPS +650%" },
    "yuyu7_10": { gpsMultiplier: 2.80, description: "寂灭罗睺达到10级，GPS +280%" },
    "yuyu7_50": { gpsMultiplier: 5.50, description: "寂灭罗睺达到50级，GPS +550%" },
    "yuyu7_100": { gpsMultiplier: 7.00, description: "寂灭罗睺达到100级，GPS +700%" },
    "yuyu8_10": { gpsMultiplier: 3.10, description: "永劫蚩尤达到10级，GPS +310%" },
    "yuyu8_50": { gpsMultiplier: 6.50, description: "永劫蚩尤达到50级，GPS +650%" },
    "yuyu8_100": { gpsMultiplier: 7.50, description: "永劫蚩尤达到100级，GPS +750%" },
    "yuyu9_10": { gpsMultiplier: 3.40, description: "天罚刑天达到10级，GPS +340%" },
    "yuyu9_50": { gpsMultiplier: 7.00, description: "天罚刑天达到50级，GPS +700%" },
    "yuyu9_100": { gpsMultiplier: 8.00, description: "天罚刑天达到100级，GPS +800%" },
    "yuyu10_10": { gpsMultiplier: 3.70, description: "浑沌帝江达到10级，GPS +370%" },
    "yuyu10_50": { gpsMultiplier: 7.50, description: "浑沌帝江达到50级，GPS +750%" },
    "yuyu10_100": { gpsMultiplier: 8.50, description: "浑沌帝江达到100级，GPS +850%" },
    "yuyu11_10": { gpsMultiplier: 4.00, description: "无极烛阴达到10级，GPS +400%" },
    "yuyu11_50": { gpsMultiplier: 8.00, description: "无极烛阴达到50级，GPS +800%" },
    "yuyu11_100": { gpsMultiplier: 9.00, description: "无极烛阴达到100级，GPS +900%" },

    // 新增魂环成就
    "year1_10": { gpsMultiplier: 0.20, description: "一年魂环达到10级，GPS +20%" },
    "year10_10": { gpsMultiplier: 0.30, description: "十年魂环达到10级，GPS +30%" },
    "year100_10": { gpsMultiplier: 0.40, description: "百年魂环达到10级，GPS +40%" },
    "year1000_10": { gpsMultiplier: 0.50, description: "千年魂环达到10级，GPS +50%" },
    "year10000_10": { gpsMultiplier: 0.60, description: "万年魂环达到10级，GPS +60%" },
    "year100000_10": { gpsMultiplier: 0.70, description: "十万年魂环达到10级，GPS +70%" },
    "year1000000_10": { gpsMultiplier: 0.80, description: "百万年魂环达到10级，GPS +80%" },
    "year10000000_10": { gpsMultiplier: 0.90, description: "千万年魂环达到10级，GPS +90%" },
    "year100000000_10": { gpsMultiplier: 1.00, description: "亿年魂环达到10级，GPS +100%" },
    "year1_100": { gpsMultiplier: 0.50, description: "一年魂环达到100级，GPS +50%" },
    "year10_100": { gpsMultiplier: 0.60, description: "十年魂环达到100级，GPS +60%" },
    "year100_100": { gpsMultiplier: 0.70, description: "百年魂环达到100级，GPS +70%" },
    "year1000_100": { gpsMultiplier: 0.80, description: "千年魂环达到100级，GPS +80%" },
    "year10000_100": { gpsMultiplier: 0.90, description: "万年魂环达到100级，GPS +90%" },
    "year100000_100": { gpsMultiplier: 1.00, description: "十万年魂环达到100级，GPS +100%" },
    "year1000000_100": { gpsMultiplier: 1.10, description: "百万年魂环达到100级，GPS +110%" },
    "year10000000_100": { gpsMultiplier: 1.20, description: "千万年魂环达到100级，GPS +120%" },
    "year100000000_100": { gpsMultiplier: 1.30, description: "亿年魂环达到100级，GPS +130%" },
    "year1_1000": { gpsMultiplier: 1.00, description: "一年魂环达到1000级，GPS +100%" },
    "year10_1000": { gpsMultiplier: 1.10, description: "十年魂环达到1000级，GPS +110%" },
    "year100_1000": { gpsMultiplier: 1.20, description: "百年魂环达到1000级，GPS +120%" },
    "year1000_1000": { gpsMultiplier: 1.30, description: "千年魂环达到1000级，GPS +130%" },
    "year10000_1000": { gpsMultiplier: 1.40, description: "万年魂环达到1000级，GPS +140%" },
    "year100000_1000": { gpsMultiplier: 1.50, description: "十万年魂环达到1000级，GPS +150%" },
    "year1000000_1000": { gpsMultiplier: 1.60, description: "百万年魂环达到1000级，GPS +160%" },
    "year10000000_1000": { gpsMultiplier: 1.70, description: "千万年魂环达到1000级，GPS +170%" },
    "year100000000_1000": { gpsMultiplier: 1.80, description: "亿年魂环达到1000级，GPS +180%" },
    "year1_10000": { gpsMultiplier: 2.00, description: "一年魂环达到10000级，GPS +200%" },
    "year10_10000": { gpsMultiplier: 2.10, description: "十年魂环达到10000级，GPS +210%" },
    "year100_10000": { gpsMultiplier: 2.20, description: "百年魂环达到10000级，GPS +220%" },
    "year1000_10000": { gpsMultiplier: 2.30, description: "千年魂环达到10000级，GPS +230%" },
    "year10000_10000": { gpsMultiplier: 2.40, description: "万年魂环达到10000级，GPS +240%" },
    "year100000_10000": { gpsMultiplier: 2.50, description: "十万年魂环达到10000级，GPS +250%" },
    "year1000000_10000": { gpsMultiplier: 2.60, description: "百万年魂环达到10000级，GPS +260%" },
    "year10000000_10000": { gpsMultiplier: 2.70, description: "千万年魂环达到10000级，GPS +270%" },
    "year100000000_10000": { gpsMultiplier: 2.80, description: "亿年魂环达到10000级，GPS +280%" },
    "year2_10": { gpsMultiplier: 1.10, description: "太古·混沌亿年魂环达到10级，GPS +110%" },
    "year2_100": { gpsMultiplier: 1.40, description: "太古·混沌亿年魂环达到100级，GPS +140%" },
    "year2_1000": { gpsMultiplier: 1.90, description: "太古·混沌亿年魂环达到1000级，GPS +190%" },
    "year2_10000": { gpsMultiplier: 3.80, description: "太古·混沌亿年魂环达到10000级，GPS +380%" },
    "year3_10": { gpsMultiplier: 1.20, description: "鸿蒙·始源亿年魂环达到10级，GPS +120%" },
    "year3_100": { gpsMultiplier: 1.50, description: "鸿蒙·始源亿年魂环达到100级，GPS +150%" },
    "year3_1000": { gpsMultiplier: 2.00, description: "鸿蒙·始源亿年魂环达到1000级，GPS +200%" },
    "year3_10000": { gpsMultiplier: 3.90, description: "鸿蒙·始源亿年魂环达到10000级，GPS +390%" },
    "year4_10": { gpsMultiplier: 1.30, description: "亘古·时空亿年魂环达到10级，GPS +130%" },
    "year4_100": { gpsMultiplier: 1.60, description: "亘古·时空亿年魂环达到100级，GPS +160%" },
    "year4_1000": { gpsMultiplier: 2.10, description: "亘古·时空亿年魂环达到1000级，GPS +210%" },
    "year4_10000": { gpsMultiplier: 4.00, description: "亘古·时空亿年魂环达到10000级，GPS +400%" },
    "year5_10": { gpsMultiplier: 1.40, description: "九幽·冥渊亿年魂环达到10级，GPS +140%" },
    "year5_100": { gpsMultiplier: 1.70, description: "九幽·冥渊亿年魂环达到100级，GPS +170%" },
    "year5_1000": { gpsMultiplier: 2.20, description: "九幽·冥渊亿年魂环达到1000级，GPS +220%" },
    "year5_10000": { gpsMultiplier: 4.10, description: "九幽·冥渊亿年魂环达到10000级，GPS +410%" },
    "year6_10": { gpsMultiplier: 1.50, description: "皓宇·星辰亿年魂环达到10级，GPS +150%" },
    "year6_100": { gpsMultiplier: 1.80, description: "皓宇·星辰亿年魂环达到100级，GPS +180%" },
    "year6_1000": { gpsMultiplier: 2.30, description: "皓宇·星辰亿年魂环达到1000级，GPS +230%" },
    "year6_10000": { gpsMultiplier: 4.20, description: "皓宇·星辰亿年魂环达到10000级，GPS +420%" },
    "year7_10": { gpsMultiplier: 1.60, description: "炎狱·焚天亿年魂环达到10级，GPS +160%" },
    "year7_100": { gpsMultiplier: 1.90, description: "炎狱·焚天亿年魂环达到100级，GPS +190%" },
    "year7_1000": { gpsMultiplier: 2.40, description: "炎狱·焚天亿年魂环达到1000级，GPS +240%" },
    "year7_10000": { gpsMultiplier: 4.30, description: "炎狱·焚天亿年魂环达到10000级，GPS +430%" },
    "year8_10": { gpsMultiplier: 1.70, description: "霜烬·极寒亿年魂环达到10级，GPS +170%" },
    "year8_100": { gpsMultiplier: 2.00, description: "霜烬·极寒亿年魂环达到100级，GPS +200%" },
    "year8_1000": { gpsMultiplier: 2.50, description: "霜烬·极寒亿年魂环达到1000级，GPS +250%" },
    "year8_10000": { gpsMultiplier: 4.40, description: "霜烬·极寒亿年魂环达到10000级，GPS +440%" },
    "year9_10": { gpsMultiplier: 1.80, description: "灵幻·万象亿年魂环达到10级，GPS +180%" },
    "year9_100": { gpsMultiplier: 2.10, description: "灵幻·万象亿年魂环达到100级，GPS +210%" },
    "year9_1000": { gpsMultiplier: 2.60, description: "灵幻·万象亿年魂环达到1000级，GPS +260%" },
    "year9_10000": { gpsMultiplier: 4.50, description: "灵幻·万象亿年魂环达到10000级，GPS +450%" },
    "year11_10": { gpsMultiplier: 1.90, description: "炽阳·耀世亿年魂环达到10级，GPS +190%" },
    "year11_100": { gpsMultiplier: 2.20, description: "炽阳·耀世亿年魂环达到100级，GPS +220%" },
    "year11_1000": { gpsMultiplier: 2.70, description: "炽阳·耀世亿年魂环达到1000级，GPS +270%" },
    "year11_10000": { gpsMultiplier: 4.60, description: "炽阳·耀世亿年魂环达到10000级，GPS +460%" },
    "year12_10": { gpsMultiplier: 2.00, description: "暗蚀·灭世亿年魂环达到10级，GPS +200%" },
    "year12_100": { gpsMultiplier: 2.30, description: "暗蚀·灭世亿年魂环达到100级，GPS +230%" },
    "year12_1000": { gpsMultiplier: 2.80, description: "暗蚀·灭世亿年魂环达到1000级，GPS +280%" },
    "year12_10000": { gpsMultiplier: 4.70, description: "暗蚀·灭世亿年魂环达到10000级，GPS +470%" },
    "year13_10": { gpsMultiplier: 2.10, description: "圣辉·救赎亿年魂环达到10级，GPS +210%" },
    "year13_100": { gpsMultiplier: 2.40, description: "圣辉·救赎亿年魂环达到100级，GPS +240%" },
    "year13_1000": { gpsMultiplier: 2.90, description: "圣辉·救赎亿年魂环达到1000级，GPS +290%" },
    "year13_10000": { gpsMultiplier: 4.80, description: "圣辉·救赎亿年魂环达到10000级，GPS +480%" },
    "year14_10": { gpsMultiplier: 2.30, description: "紫霄·雷罚亿年魂环达到10级，GPS +220%" },
    "year14_100": { gpsMultiplier: 2.50, description: "紫霄·雷罚亿年魂环达到100级，GPS +250%" },
    "year14_1000": { gpsMultiplier: 3.00, description: "紫霄·雷罚亿年魂环达到1000级，GPS +300%" },
    "year14_10000": { gpsMultiplier: 4.90, description: "紫霄·雷罚亿年魂环达到10000级，GPS +490%" },
    "year15_10": { gpsMultiplier: 2.30, description: "青木·生机亿年魂环达到10级，GPS +230%" },
    "year15_100": { gpsMultiplier: 2.60, description: "青木·生机亿年魂环达到100级，GPS +260%" },
    "year15_1000": { gpsMultiplier: 3.00, description: "青木·生机亿年魂环达到1000级，GPS +300%" },
    "year15_10000": { gpsMultiplier: 5.00, description: "青木·生机亿年魂环达到10000级，GPS +500%" },
    "year16_10": { gpsMultiplier: 2.40, description: "星澜·幻梦亿年魂环达到10级，GPS +240%" },
    "year16_100": { gpsMultiplier: 2.70, description: "星澜·幻梦亿年魂环达到100级，GPS +270%" },
    "year16_1000": { gpsMultiplier: 3.10, description: "星澜·幻梦亿年魂环达到1000级，GPS +310%" },
    "year16_10000": { gpsMultiplier: 5.10, description: "星澜·幻梦亿年魂环达到10000级，GPS +510%" },
    "year17_10": { gpsMultiplier: 2.50, description: "渊海·无尽亿年魂环达到10级，GPS +250%" },
    "year17_100": { gpsMultiplier: 2.80, description: "渊海·无尽亿年魂环达到100级，GPS +280%" },
    "year17_1000": { gpsMultiplier: 3.20, description: "渊海·无尽亿年魂环达到1000级，GPS +320%" },
    "year17_10000": { gpsMultiplier: 5.20, description: "渊海·无尽亿年魂环达到10000级，GPS +520%" },
    "year18_10": { gpsMultiplier: 2.60, description: "荒古·遗世亿年魂环达到10级，GPS +260%" },
    "year18_100": { gpsMultiplier: 2.90, description: "荒古·遗世亿年魂环达到100级，GPS +290%" },
    "year18_1000": { gpsMultiplier: 3.30, description: "荒古·遗世亿年魂环达到1000级，GPS +330%" },
    "year18_10000": { gpsMultiplier: 5.30, description: "荒古·遗世亿年魂环达到10000级，GPS +530%" },
    "year19_10": { gpsMultiplier: 2.70, description: "净世·光明亿年魂环达到10级，GPS +270%" },
    "year19_100": { gpsMultiplier: 3.00, description: "净世·光明亿年魂环达到100级，GPS +300%" },
    "year19_1000": { gpsMultiplier: 3.40, description: "净世·光明亿年魂环达到1000级，GPS +340%" },
    "year19_10000": { gpsMultiplier: 5.40, description: "净世·光明亿年魂环达到10000级，GPS +540%" },
    "year20_10": { gpsMultiplier: 2.80, description: "蚀灵·诅咒亿年魂环达到10级，GPS +280%" },
    "year20_100": { gpsMultiplier: 3.10, description: "蚀灵·诅咒亿年魂环达到100级，GPS +310%" },
    "year20_1000": { gpsMultiplier: 3.50, description: "蚀灵·诅咒亿年魂环达到1000级，GPS +350%" },
    "year20_10000": { gpsMultiplier: 5.50, description: "蚀灵·诅咒亿年魂环达到10000级，GPS +550%" },
    "year21_10": { gpsMultiplier: 2.90, description: "逆乱·时空亿年魂环达到10级，GPS +290%" },
    "year21_100": { gpsMultiplier: 3.20, description: "逆乱·时空亿年魂环达到100级，GPS +320%" },
    "year21_1000": { gpsMultiplier: 3.60, description: "逆乱·时空亿年魂环达到1000级，GPS +360%" },
    "year21_10000": { gpsMultiplier: 5.60, description: "逆乱·时空亿年魂环达到10000级，GPS +560%" },
    "year22_10": { gpsMultiplier: 3.00, description: "龙渊·霸者亿年魂环达到10级，GPS +300%" },
    "year22_100": { gpsMultiplier: 3.30, description: "龙渊·霸者亿年魂环达到100级，GPS +330%" },
    "year22_1000": { gpsMultiplier: 3.70, description: "龙渊·霸者亿年魂环达到1000级，GPS +370%" },
    "year22_10000": { gpsMultiplier: 5.70, description: "龙渊·霸者亿年魂环达到10000级，GPS +570%" },
    "year23_10": { gpsMultiplier: 3.10, description: "凤羽·炎舞亿年魂环达到10级，GPS +310%" },
    "year23_100": { gpsMultiplier: 3.40, description: "凤羽·炎舞亿年魂环达到100级，GPS +340%" },
    "year23_1000": { gpsMultiplier: 3.80, description: "凤羽·炎舞亿年魂环达到1000级，GPS +380%" },
    "year23_10000": { gpsMultiplier: 5.80, description: "凤羽·炎舞亿年魂环达到10000级，GPS +580%" },
    "year24_10": { gpsMultiplier: 3.20, description: "星辰·命数亿年魂环达到10级，GPS +320%" },
    "year24_100": { gpsMultiplier: 3.50, description: "星辰·命数亿年魂环达到100级，GPS +350%" },
    "year24_1000": { gpsMultiplier: 3.90, description: "星辰·命数亿年魂环达到1000级，GPS +390%" },
    "year24_10000": { gpsMultiplier: 5.90, description: "星辰·命数亿年魂环达到10000级，GPS +590%" },
    "year25_10": { gpsMultiplier: 3.30, description: "荒炎·破灭亿年魂环达到10级，GPS +330%" },
    "year25_100": { gpsMultiplier: 3.60, description: "荒炎·破灭亿年魂环达到100级，GPS +360%" },
    "year25_1000": { gpsMultiplier: 4.00, description: "荒炎·破灭亿年魂环达到1000级，GPS +400%" },
    "year25_10000": { gpsMultiplier: 6.00, description: "荒炎·破灭亿年魂环达到10000级，GPS +600%" },
    "year26_10": { gpsMultiplier: 3.40, description: "玄冰·永冻亿年魂环达到10级，GPS +340%" },
    "year26_100": { gpsMultiplier: 3.70, description: "玄冰·永冻亿年魂环达到100级，GPS +370%" },
    "year26_1000": { gpsMultiplier: 4.10, description: "玄冰·永冻亿年魂环达到1000级，GPS +410%" },
    "year26_10000": { gpsMultiplier: 6.10, description: "玄冰·永冻亿年魂环达到10000级，GPS +610%" },
    "year27_10": { gpsMultiplier: 3.50, description: "灵犀·心眼亿年魂环达到10级，GPS +350%" },
    "year27_100": { gpsMultiplier: 3.80, description: "灵犀·心眼亿年魂环达到100级，GPS +380%" },
    "year27_1000": { gpsMultiplier: 4.20, description: "灵犀·心眼亿年魂环达到1000级，GPS +420%" },
    "year27_10000": { gpsMultiplier: 6.20, description: "灵犀·心眼亿年魂环达到10000级，GPS +620%" },
    "year28_10": { gpsMultiplier: 3.60, description: "圣谕·裁决亿年魂环达到10级，GPS +360%" },
    "year28_100": { gpsMultiplier: 3.90, description: "圣谕·裁决亿年魂环达到100级，GPS +390%" },
    "year28_1000": { gpsMultiplier: 4.30, description: "圣谕·裁决亿年魂环达到1000级，GPS +430%" },
    "year28_10000": { gpsMultiplier: 6.30, description: "圣谕·裁决亿年魂环达到10000级，GPS +630%" },
    "year29_10": { gpsMultiplier: 3.70, description: "九幽·黄泉亿年魂环达到10级，GPS +370%" },
    "year29_100": { gpsMultiplier: 4.00, description: "九幽·黄泉亿年魂环达到100级，GPS +400%" },
    "year29_1000": { gpsMultiplier: 4.40, description: "九幽·黄泉亿年魂环达到1000级，GPS +440%" },
    "year29_10000": { gpsMultiplier: 6.40, description: "九幽·黄泉亿年魂环达到10000级，GPS +640%" },
    "year30_10": { gpsMultiplier: 3.80, description: "灵蕴·造化亿年魂环达到10级，GPS +380%" },
    "year30_100": { gpsMultiplier: 4.10, description: "灵蕴·造化亿年魂环达到100级，GPS +410%" },
    "year30_1000": { gpsMultiplier: 4.50, description: "灵蕴·造化亿年魂环达到1000级，GPS +450%" },
    "year30_10000": { gpsMultiplier: 6.50, description: "灵蕴·造化亿年魂环达到10000级，GPS +650%" },
    "year31_10": { gpsMultiplier: 3.90, description: "混沌·元始亿年魂环达到10级，GPS +390%" },
    "year31_100": { gpsMultiplier: 4.20, description: "混沌·元始亿年魂环达到100级，GPS +420%" },
    "year31_1000": { gpsMultiplier: 4.60, description: "混沌·元始亿年魂环达到1000级，GPS +460%" },
    "year31_10000": { gpsMultiplier: 6.60, description: "混沌·元始亿年魂环达到10000级，GPS +660%" },
    "year32_10": { gpsMultiplier: 4.00, description: "苍穹·御天亿年魂环达到10级，GPS +400%" },
    "year32_100": { gpsMultiplier: 4.30, description: "苍穹·御天亿年魂环达到100级，GPS +430%" },
    "year32_1000": { gpsMultiplier: 4.70, description: "苍穹·御天亿年魂环达到1000级，GPS +470%" },
    "year32_10000": { gpsMultiplier: 6.70, description: "苍穹·御天亿年魂环达到10000级，GPS +670%" },
    "year33_10": { gpsMultiplier: 4.10, description: "龙炎·焚天亿年魂环达到10级，GPS +410%" },
    "year33_100": { gpsMultiplier: 4.40, description: "龙炎·焚天亿年魂环达到100级，GPS +440%" },
    "year33_1000": { gpsMultiplier: 4.80, description: "龙炎·焚天亿年魂环达到1000级，GPS +480%" },
    "year33_10000": { gpsMultiplier: 6.80, description: "龙炎·焚天亿年魂环达到10000级，GPS +680%" },
    "year34_10": { gpsMultiplier: 4.20, description: "血狱·魔神亿年魂环达到10级，GPS +420%" },
    "year34_100": { gpsMultiplier: 4.50, description: "血狱·魔神亿年魂环达到100级，GPS +450%" },
    "year34_1000": { gpsMultiplier: 4.90, description: "血狱·魔神亿年魂环达到1000级，GPS +490%" },
    "year34_10000": { gpsMultiplier: 6.90, description: "血狱·魔神亿年魂环达到10000级，GPS +690%" },
    "year35_10": { gpsMultiplier: 4.30, description: "赤霄·苍穹亿年魂环达到10级，GPS +430%" },
    "year35_100": { gpsMultiplier: 4.60, description: "赤霄·苍穹亿年魂环达到100级，GPS +460%" },
    "year35_1000": { gpsMultiplier: 5.00, description: "赤霄·苍穹亿年魂环达到1000级，GPS +500%" },
    "year35_10000": { gpsMultiplier: 7.00, description: "赤霄·苍穹亿年魂环达到10000级，GPS +700%" },
    "year36_10": { gpsMultiplier: 4.40, description: "炎凤·涅槃亿年魂环达到10级，GPS +440%" },
    "year36_100": { gpsMultiplier: 4.70, description: "炎凤·涅槃亿年魂环达到100级，GPS +470%" },
    "year36_1000": { gpsMultiplier: 5.10, description: "炎凤·涅槃亿年魂环达到1000级，GPS +510%" },
    "year36_10000": { gpsMultiplier: 7.10, description: "炎凤·涅槃亿年魂环达到10000级，GPS +710%" },
    "year37_10": { gpsMultiplier: 4.50, description: "闫闫·黑丝亿年魂环达到10级，GPS +450%" },
    "year37_100": { gpsMultiplier: 4.80, description: "闫闫·黑丝亿年魂环达到100级，GPS +480%" },
    "year37_1000": { gpsMultiplier: 5.20, description: "闫闫·黑丝亿年魂环达到1000级，GPS +520%" },
    "year37_10000": { gpsMultiplier: 7.20, description: "闫闫·黑丝亿年魂环达到10000级，GPS +720%" },
    "year38_10": { gpsMultiplier: 4.60, description: "霜月·清辉亿年魂环达到10级，GPS +460%" },
    "year38_100": { gpsMultiplier: 4.90, description: "霜月·清辉亿年魂环达到100级，GPS +490%" },
    "year38_1000": { gpsMultiplier: 5.30, description: "霜月·清辉亿年魂环达到1000级，GPS +530%" },
    "year38_10000": { gpsMultiplier: 7.30, description: "霜月·清辉亿年魂环达到10000级，GPS +730%" },
    "year39_10": { gpsMultiplier: 4.70, description: "紫电·雷鸣亿年魂环达到10级，GPS +470%" },
    "year39_100": { gpsMultiplier: 5.00, description: "紫电·雷鸣亿年魂环达到100级，GPS +500%" },
    "year39_1000": { gpsMultiplier: 5.40, description: "紫电·雷鸣亿年魂环达到1000级，GPS +540%" },
    "year39_10000": { gpsMultiplier: 7.40, description: "紫电·雷鸣亿年魂环达到10000级，GPS +740%" },
    "year40_10": { gpsMultiplier: 4.80, description: "金乌·耀日亿年魂环达到10级，GPS +480%" },
    "year40_100": { gpsMultiplier: 5.10, description: "金乌·耀日亿年魂环达到100级，GPS +510%" },
    "year40_1000": { gpsMultiplier: 5.50, description: "金乌·耀日亿年魂环达到1000级，GPS +550%" },
    "year40_10000": { gpsMultiplier: 7.50, description: "金乌·耀日亿年魂环达到10000级，GPS +750%" },
    "year41_10": { gpsMultiplier: 4.90, description: "玉衡·星枢亿年魂环达到10级，GPS +490%" },
    "year41_100": { gpsMultiplier: 5.20, description: "玉衡·星枢亿年魂环达到100级，GPS +520%" },
    "year41_1000": { gpsMultiplier: 5.60, description: "玉衡·星枢亿年魂环达到1000级，GPS +560%" },
    "year41_10000": { gpsMultiplier: 7.60, description: "玉衡·星枢亿年魂环达到10000级，GPS +760%" },
    "year42_10": { gpsMultiplier: 5.00, description: "青莲·化劫亿年魂环达到10级，GPS +500%" },
    "year42_100": { gpsMultiplier: 5.30, description: "青莲·化劫亿年魂环达到100级，GPS +530%" },
    "year42_1000": { gpsMultiplier: 5.70, description: "青莲·化劫亿年魂环达到1000级，GPS +570%" },
    "year42_10000": { gpsMultiplier: 7.70, description: "青莲·化劫亿年魂环达到10000级，GPS +770%" },
    "year43_10": { gpsMultiplier: 5.10, description: "朱殷·血魄亿年魂环达到10级，GPS +510%" },
    "year43_100": { gpsMultiplier: 5.40, description: "朱殷·血魄亿年魂环达到100级，GPS +540%" },
    "year43_1000": { gpsMultiplier: 5.80, description: "朱殷·血魄亿年魂环达到1000级，GPS +580%" },
    "year43_10000": { gpsMultiplier: 7.80, description: "朱殷·血魄亿年魂环达到10000级，GPS +780%" },
    "year44_10": { gpsMultiplier: 5.20, description: "玄龟·镇渊亿年魂环达到10级，GPS +520%" },
    "year44_100": { gpsMultiplier: 5.50, description: "玄龟·镇渊亿年魂环达到100级，GPS +550%" },
    "year44_1000": { gpsMultiplier: 5.90, description: "玄龟·镇渊亿年魂环达到1000级，GPS +590%" },
    "year44_10000": { gpsMultiplier: 7.90, description: "玄龟·镇渊亿年魂环达到10000级，GPS +790%" },
    "year45_10": { gpsMultiplier: 5.30, description: "白虎·裂空亿年魂环达到10级，GPS +530%" },
    "year45_100": { gpsMultiplier: 5.60, description: "白虎·裂空亿年魂环达到100级，GPS +560%" },
    "year45_1000": { gpsMultiplier: 6.00, description: "白虎·裂空亿年魂环达到1000级，GPS +600%" },
    "year45_10000": { gpsMultiplier: 8.00, description: "白虎·裂空亿年魂环达到10000级，GPS +800%" },
    "year46_10": { gpsMultiplier: 5.40, description: "青龙·御宇亿年魂环达到10级，GPS +540%" },
    "year46_100": { gpsMultiplier: 5.70, description: "青龙·御宇亿年魂环达到100级，GPS +570%" },
    "year46_1000": { gpsMultiplier: 6.10, description: "青龙·御宇亿年魂环达到1000级，GPS +610%" },
    "year46_10000": { gpsMultiplier: 8.10, description: "青龙·御宇亿年魂环达到10000级，GPS +810%" },
    "year47_10": { gpsMultiplier: 5.50, description: "朱雀·焚野亿年魂环达到10级，GPS +550%" },
    "year47_100": { gpsMultiplier: 5.80, description: "朱雀·焚野亿年魂环达到100级，GPS +580%" },
    "year47_1000": { gpsMultiplier: 6.20, description: "朱雀·焚野亿年魂环达到1000级，GPS +620%" },
    "year47_10000": { gpsMultiplier: 8.20, description: "朱雀·焚野亿年魂环达到10000级，GPS +820%" },
    "year48_10": { gpsMultiplier: 5.60, description: "玄武·镇狱亿年魂环达到10级，GPS +560%" },
    "year48_100": { gpsMultiplier: 5.90, description: "玄武·镇狱亿年魂环达到100级，GPS +590%" },
    "year48_1000": { gpsMultiplier: 6.30, description: "玄武·镇狱亿年魂环达到1000级，GPS +630%" },
    "year48_10000": { gpsMultiplier: 8.30, description: "玄武·镇狱亿年魂环达到10000级，GPS +830%" },
    "year49_10": { gpsMultiplier: 5.70, description: "麒麟·显圣亿年魂环达到10级，GPS +570%" },
    "year49_100": { gpsMultiplier: 6.00, description: "麒麟·显圣亿年魂环达到100级，GPS +600%" },
    "year49_1000": { gpsMultiplier: 6.40, description: "麒麟·显圣亿年魂环达到1000级，GPS +640%" },
    "year49_10000": { gpsMultiplier: 8.40, description: "麒麟·显圣亿年魂环达到10000级，GPS +840%" },
    "year50_10": { gpsMultiplier: 5.80, description: "凤凰·涅槃亿年魂环达到10级，GPS +580%" },
    "year50_100": { gpsMultiplier: 6.10, description: "凤凰·涅槃亿年魂环达到100级，GPS +610%" },
    "year50_1000": { gpsMultiplier: 6.50, description: "凤凰·涅槃亿年魂环达到1000级，GPS +650%" },
    "year50_10000": { gpsMultiplier: 8.50, description: "凤凰·涅槃亿年魂环达到10000级，GPS +850%" },
    "year51_10": { gpsMultiplier: 5.90, description: "鲲鹏·扶摇亿年魂环达到10级，GPS +590%" },
    "year51_100": { gpsMultiplier: 6.20, description: "鲲鹏·扶摇亿年魂环达到100级，GPS +620%" },
    "year51_1000": { gpsMultiplier: 6.60, description: "鲲鹏·扶摇亿年魂环达到1000级，GPS +660%" },
    "year51_10000": { gpsMultiplier: 8.60, description: "鲲鹏·扶摇亿年魂环达到10000级，GPS +860%" },
    "year52_10": { gpsMultiplier: 6.00, description: "应龙·行雨亿年魂环达到10级，GPS +600%" },
    "year52_100": { gpsMultiplier: 6.30, description: "应龙·行雨亿年魂环达到100级，GPS +630%" },
    "year52_1000": { gpsMultiplier: 6.70, description: "应龙·行雨亿年魂环达到1000级，GPS +670%" },
    "year52_10000": { gpsMultiplier: 8.70, description: "应龙·行雨亿年魂环达到10000级，GPS +870%" },
    "year53_10": { gpsMultiplier: 6.10, description: "白泽·通幽亿年魂环达到10级，GPS +610%" },
    "year53_100": { gpsMultiplier: 6.40, description: "白泽·通幽亿年魂环达到100级，GPS +640%" },
    "year53_1000": { gpsMultiplier: 6.80, description: "白泽·通幽亿年魂环达到1000级，GPS +680%" },
    "year53_10000": { gpsMultiplier: 8.80, description: "白泽·通幽亿年魂环达到10000级，GPS +880%" },
    "year54_10": { gpsMultiplier: 6.20, description: "重明·照冥亿年魂环达到10级，GPS +620%" },
    "year54_100": { gpsMultiplier: 6.50, description: "重明·照冥亿年魂环达到100级，GPS +650%" },
    "year54_1000": { gpsMultiplier: 6.90, description: "重明·照冥亿年魂环达到1000级，GPS +690%" },
    "year54_10000": { gpsMultiplier: 8.90, description: "重明·照冥亿年魂环达到10000级，GPS +890%" },
    "year55_10": { gpsMultiplier: 6.30, description: "穷奇·吞恶亿年魂环达到10级，GPS +630%" },
    "year55_100": { gpsMultiplier: 6.60, description: "穷奇·吞恶亿年魂环达到100级，GPS +660%" },
    "year55_1000": { gpsMultiplier: 7.00, description: "穷奇·吞恶亿年魂环达到1000级，GPS +700%" },
    "year55_10000": { gpsMultiplier: 9.00, description: "穷奇·吞恶亿年魂环达到10000级，GPS +900%" },
    "year56_10": { gpsMultiplier: 6.40, description: "梼杌·破军亿年魂环达到10级，GPS +640%" },
    "year56_100": { gpsMultiplier: 6.70, description: "梼杌·破军亿年魂环达到100级，GPS +670%" },
    "year56_1000": { gpsMultiplier: 7.10, description: "梼杌·破军亿年魂环达到1000级，GPS +710%" },
    "year56_10000": { gpsMultiplier: 9.10, description: "梼杌·破军亿年魂环达到10000级，GPS +910%" },
    "year57_10": { gpsMultiplier: 6.50, description: "混沌·无名亿年魂环达到10级，GPS +650%" },
    "year57_100": { gpsMultiplier: 6.80, description: "混沌·无名亿年魂环达到100级，GPS +680%" },
    "year57_1000": { gpsMultiplier: 7.20, description: "混沌·无名亿年魂环达到1000级，GPS +720%" },
    "year57_10000": { gpsMultiplier: 9.20, description: "混沌·无名亿年魂环达到10000级，GPS +920%" },
    "world_boss_1st": { gpsMultiplier: 10.0, description: "在世界BOSS中获得第1名，GPS +1000%"  },
    "world_boss_top5": { gpsMultiplier: 5.0, description: "在世界BOSS中获得第2-10名，GPS +500%"  },
    "world_boss_top10": { gpsMultiplier: 3.0, description: "在世界BOSS中获得第11-30名，GPS +300%"  },
    "world_boss_participant": { gpsMultiplier: 1.00, description: "参与世界BOSS战斗，GPS +100%"  },
    // 新增转生成就奖励
    "reincarnation_10": { gpsMultiplier: 0.50, description: "转生10次，GPS +50%" },
    "reincarnation_100": { gpsMultiplier: 1.00, description: "转生100次，GPS +100%" },
    "reincarnation_1000": { gpsMultiplier: 5.00, description: "转生1000次，GPS +500%" },
    "reincarnation_10000": { gpsMultiplier: 10.00, description: "转生10000次，GPS +1000%" }
};
 
// 功法秘笈配置
const techniqueConfig = {
    "immortalAsuraBody": { name: "不灭修罗体", type: "health", effect: 0.0001, description: "每一级增加0.01%生命永久属性" },
    "eightDesolationsWarDemonBody": { name: "八荒战魔躯", type: "health", effect: 0.001, description: "每一级增加0.1%生命永久属性" },
    "nineRevolutionsProfoundBody": { name: "九转玄黄身", type: "health", effect: 0.005, description: "每一级增加0.5%生命永久属性" },
    "loneDestinyBone": { name: "天煞孤星骨", type: "health", effect: 0.01, description: "每一级增加1%生命永久属性" },
    "bloodPrisonMadGodArmor": { name: "血狱狂神铠", type: "health", effect: 0.10, description: "每一级增加10%生命永久属性" },
    "godSlayingBurningHeavenArt": { name: "弑神焚天诀", type: "attack", effect: 0.0001, description: "每一级增加0.01%攻击永久属性" },
    "burialHeavenBladePrisonManual": { name: "葬天刀狱谱", type: "attack", effect: 0.001, description: "每一级增加0.1%攻击永久属性" },
    "tenDirectionsAnnihilationSpearCodex": { name: "十方俱灭枪典", type: "attack", effect: 0.005, description: "每一级增加0.5%攻击永久属" },
    "thousandCalamitiesVoidArrowArt": { name: "千劫裂空箭术", type: "attack", effect: 0.05, description: "每一级增加5%攻击永久属性" },
    "ancientAnnihilationHalberdArt": { name: "万古寂灭戟法", type: "attack", effect: 0.10, description: "每一级增加10%攻击永久属性" },
    "nineCalamitiesWorldDestroyingPalm": { name: "九劫灭世掌", type: "critDamage", effect: 0.001, description: "每一级增加0.1%爆伤永久属性" },
    "chaosCreationForce": { name: "混沌开天劲", type: "critDamage", effect: 0.005, description: "每一级增加0.5%爆伤永久属性" },
    "dragonElephantShatteringVoidArt": { name: "龙象碎穹功", type: "critDamage", effect: 0.01, description: "每一级增加1%爆伤永久属性" },
    "greatSunFallingStarFist": { name: "大日陨星拳", type: "critDamage", effect: 0.10, description: "每一级增加10%爆伤永久属性" },
    "nineHeavensThunderboltTruth": { name: "九霄雷殛真解", type: "critRate", effect: 0.00001, description: "每一级增加0.001%暴击率永久属性" },
    "netherBloodSeaDiagram": { name: "幽冥血海图录", type: "critRate", effect: 0.0005, description: "每一级增加0.05%暴击率永久属性" },
    "riverStarsHangingSecretScroll": { name: "星河倒悬秘卷", type: "critRate", effect: 0.0001, description: "每一级增加0.01%暴击率永久属性" },
    "eightDesolationsFireDragonRecord": { name: "八荒火龙焚世录", type: "critRate", effect: 0.001, description: "每一级增加0.1%暴击率永久属性" },
    "iceSealThreeThousandRealmArt": { name: "冰封三千界心法", type: "critRate", effect: 0.01, description: "每一级增加1%暴击率永久属性" },
    "greatVoidReturnToVoidCodex": { name: "太虚归墟典", type: "multiAttack", effect: 2, description: "每一级攻击次数+2永久属性" },
    "samsaraCalamityAnnihilationSutra": { name: "轮回劫灭经", type: "multiAttack", effect: 3, description: "每一级攻击次数+3永久属性" },
    "yinYangReversalArt": { name: "阴阳逆命术", type: "multiAttack", effect: 5, description: "每一级攻击次数+5永久属性" },
    "zhouHeavenStarsFallingWay": { name: "周天星陨道", type: "multiAttack", effect: 10, description: "每一级攻击次数+10永久属性" },
    "ancientVoidRecord": { name: "万古空冥录", type: "multiAttack", effect: 50, description: "每一级攻击次数+50永久属性" }
};
const vipConfig = [
    { level: 1, requiredPower: 0, bonus: 1 }, 
    { level: 2, requiredPower: 5, bonus: 2 }, 
    { level: 3, requiredPower: 15, bonus: 4 }, 
    { level: 4, requiredPower: 32, bonus: 6 }, 
    { level: 5, requiredPower: 64, bonus: 8 },
    { level: 6, requiredPower: 128, bonus: 10 },
    { level: 7, requiredPower: 648, bonus: 20 }, 
    { level: 8, requiredPower: 1280, bonus: 40 }, 
    { level: 9, requiredPower: 3280, bonus: 60 }, 
    { level: 10, requiredPower: 6480, bonus: 80 }, 
    { level: 11, requiredPower: 10000, bonus: 100 },
    { level: 12, requiredPower: 20000, bonus: 200 },
    { level: 13, requiredPower: 30000, bonus: 400 },
    { level: 14, requiredPower: 40000, bonus: 600 },
    { level: 15, requiredPower: 50000, bonus: 800 },
    { level: 16, requiredPower: 60000, bonus: 1000 },
    { level: 17, requiredPower: 70000, bonus: 2000 },
    { level: 18, requiredPower: 80000, bonus: 4000 },
    { level: 19, requiredPower: 90000, bonus: 6000 },
    { level: 20, requiredPower: 100000, bonus: 8000 },
    { level: 21, requiredPower: 125000, bonus: 10000 },
    { level: 22, requiredPower: 150000, bonus: 20000 },
    { level: 23, requiredPower: 200000, bonus: 40000 },
    { level: 24, requiredPower: 250000, bonus: 60000 },
    { level: 25, requiredPower: 300000, bonus: 80000 },
    { level: 26, requiredPower: 400000, bonus: 100000 },
    { level: 27, requiredPower: 500000, bonus: 200000 },
    { level: 28, requiredPower: 600000, bonus: 400000 },
    { level: 29, requiredPower: 750000, bonus: 600000 },
    { level: 30, requiredPower: 1000000, bonus: 800000 },
    { level: 31, requiredPower: 2000000, bonus: 1000000 },
    { level: 32, requiredPower: 4000000, bonus: 2000000 },
    { level: 33, requiredPower: 6000000, bonus: 4000000 },
    { level: 34, requiredPower: 8000000, bonus: 6000000 },
    { level: 35, requiredPower: 10000000, bonus: 8000000 },
    { level: 36, requiredPower: 20000000, bonus: 10000000 },
    { level: 37, requiredPower: 40000000, bonus: 20000000 },
    { level: 38, requiredPower: 60000000, bonus: 40000000 },
    { level: 39, requiredPower: 80000000, bonus: 60000000 },
    { level: 40, requiredPower: 100000000, bonus: 80000000 },
    { level: 41, requiredPower: 100000000, bonus: 100000000 },
    { level: 42, requiredPower: 100000000, bonus: 200000000 },
    { level: 43, requiredPower: 100000000, bonus: 400000000 },
    { level: 44, requiredPower: 100000000, bonus: 600000000 },
    { level: 45, requiredPower: 100000000, bonus: 800000000 },
    { level: 46, requiredPower: 100000000, bonus: 1000000000 },
    { level: 47, requiredPower: 100000000, bonus: 2000000000 },
    { level: 48, requiredPower: 100000000, bonus: 4000000000 },
    { level: 49, requiredPower: 100000000, bonus: 6000000000 },
    { level: 50, requiredPower: 100000000, bonus: 8000000000 },
    { level: 51, requiredPower: 100000000, bonus: 10000000000 },
    { level: 52, requiredPower: 100000000, bonus: 20000000000 },
    { level: 53, requiredPower: 100000000, bonus: 40000000000 },
    { level: 54, requiredPower: 100000000, bonus: 60000000000 },
    { level: 55, requiredPower: 100000000, bonus: 80000000000 },
    { level: 56, requiredPower: 100000000, bonus: 100000000000 },
    { level: 57, requiredPower: 100000000, bonus: 200000000000 },
    { level: 58, requiredPower: 100000000, bonus: 400000000000 },
    { level: 59, requiredPower: 100000000, bonus: 600000000000 },
    { level: 60, requiredPower: 100000000, bonus: 800000000000 },
    { level: 61, requiredPower: 100000000, bonus: 1000000000000 },
    { level: 62, requiredPower: 100000000, bonus: 2000000000000 },
    { level: 63, requiredPower: 100000000, bonus: 4000000000000 },
    { level: 64, requiredPower: 100000000, bonus: 6000000000000 },
    { level: 65, requiredPower: 100000000, bonus: 8000000000000 },
    { level: 66, requiredPower: 100000000, bonus: 10000000000000 },
    { level: 67, requiredPower: 100000000, bonus: 20000000000000 },
    { level: 68, requiredPower: 100000000, bonus: 40000000000000 },
    { level: 69, requiredPower: 100000000, bonus: 60000000000000 },
    { level: 70, requiredPower: 100000000, bonus: 80000000000000 },
    { level: 71, requiredPower: 100000000, bonus: 100000000000000 },
    { level: 72, requiredPower: 100000000, bonus: 200000000000000 },
    { level: 73, requiredPower: 100000000, bonus: 400000000000000 },
    { level: 74, requiredPower: 100000000, bonus: 600000000000000 },
    { level: 75, requiredPower: 100000000, bonus: 800000000000000 },
    { level: 76, requiredPower: 100000000, bonus: 1000000000000000 },
    { level: 77, requiredPower: 100000000, bonus: 2000000000000000 },
    { level: 78, requiredPower: 100000000, bonus: 4000000000000000 },
    { level: 79, requiredPower: 100000000, bonus: 6000000000000000 },
    { level: 80, requiredPower: 100000000, bonus: 8000000000000000 },
    { level: 81, requiredPower: 100000000, bonus: 10000000000000000 },
    { level: 82, requiredPower: 100000000, bonus: 20000000000000000 },
    { level: 83, requiredPower: 100000000, bonus: 40000000000000000 },
    { level: 84, requiredPower: 100000000, bonus: 60000000000000000 },
    { level: 85, requiredPower: 100000000, bonus: 80000000000000000 },
    { level: 86, requiredPower: 100000000, bonus: 100000000000000000 },
    { level: 87, requiredPower: 100000000, bonus: 200000000000000000 },
    { level: 88, requiredPower: 100000000, bonus: 400000000000000000 },
    { level: 89, requiredPower: 100000000, bonus: 600000000000000000 },
    { level: 90, requiredPower: 100000000, bonus: 800000000000000000 },
    { level: 91, requiredPower: 100000000, bonus: 1000000000000000000 },
    { level: 92, requiredPower: 100000000, bonus: 2000000000000000000 },
    { level: 93, requiredPower: 100000000, bonus: 4000000000000000000 },
    { level: 94, requiredPower: 100000000, bonus: 6000000000000000000 },
    { level: 95, requiredPower: 100000000, bonus: 8000000000000000000 },
    { level: 96, requiredPower: 100000000, bonus: 10000000000000000000 },
    { level: 97, requiredPower: 100000000, bonus: 20000000000000000000 },
    { level: 98, requiredPower: 100000000, bonus: 40000000000000000000 },
    { level: 99, requiredPower: 100000000, bonus: 60000000000000000000 },
    { level: 100, requiredPower: 100000000, bonus: 100000000000000000000 }
];
        // 道具配置
        const itemEffects = {
    primaryGem: { name: '初级宝石', effect: 10.00, description: '增加装备属性+1000%' },
    advancedGem: { name: '高级宝石', effect: 50.00, description: '增加装备属性+5000%' },
    superiorGem: { name: '极品宝石', effect: 500.00, description: '增加装备属性+50000%' },
    divineGem: { name: '神级宝石', effect: 5000.00, description: '增加装备属性+500000%' },
    vipPower: { name: 'VIP能力值', effect: 1, description: '提升VIP等级的特殊道具' },
    refineStone: { name: '洗炼石', effect: 0, description: '用于重铸副本装备的成长属性' }, // 新增洗炼石
    rose: { name: '玫瑰花', effect: 1, description: '用于升级伴侣等级' },
    companionKey: { name: '伴侣钥匙', effect: 0, description: '用于开启伴侣宝箱' }, 
    rebornDan: { name: '洗髓丹', effect: 0, description: '用于洗练伴侣天赋' },
    baitCount: { name: '鱼饵', effect: 0, description: '用于钓鱼消耗品' },
    rootDetector: { name: '灵根检测器', effect: 0, description: '用于开启灵根宝箱' },
    bloodlineDetector: { name: '血脉检测剂', effect: 0, description: '用于开启血脉宝箱' },
    advanceStone: { name: '进阶神石', effect: 0, description: '用于进阶神器' },  
   primaryGemq: { name: '宝藏金币', effect: 0, description: '用于兑换藏宝图商店物品' },
   zongmen: { name: '宗门令牌', effect: 0, description: '创建宗门消耗的必须品' },  
   roseq: { name: '香囊', effect: 0, description: '赠送宗门成员增加忠诚度' }, 
  yuzhou1: { name: '星尘发票', effect: 0, description: '兑换星尘专用' }, 
   yuzhou2: { name: '暗物质发票', effect: 0, description: '兑换暗物质专用' }, 
   yuzhou3: { name: '宇宙晶体发票', effect: 0, description: '兑换宇宙晶体专用' }, 
   yuzhou4: { name: '神器碎片发票', effect: 0, description: '兑换神器碎片专用' },
  banlv1: { name: '普通伴侣灵魂', effect: 0, description: '普通伴侣进阶必需品' },
 banlv2: { name: '稀有伴侣灵魂', effect: 0, description: '稀有伴侣进阶必需品' },
 banlv3: { name: '史诗伴侣灵魂', effect: 0, description: '史诗伴侣进阶必需品' },
 banlv4: { name: '卓越伴侣灵魂', effect: 0, description: '卓越伴侣进阶必需品' },
banlv5: { name: '完美伴侣灵魂', effect: 0, description: '完美伴侣进阶必需品' },
banlv6: { name: '神赐伴侣灵魂', effect: 0, description: '神赐伴侣进阶必需品' },
banlv7: { name: '天使伴侣灵魂', effect: 0, description: '天使伴侣进阶必需品' },
banlv8: { name: '恶魔伴侣灵魂', effect: 0, description: '恶魔伴侣进阶必需品' },
banlv9: { name: '精灵伴侣灵魂', effect: 0, description: '精灵伴侣进阶必需品' },
zhiye1: { name: '职业转换书', effect: 0, description: '用于更换职业' },
chiban1: { name: '黑龙王翅膀', effect: 0, description: '用于强化翅膀' },
zuoqi1: { name: '远古圣兽精魄', effect: 0, description: '用于强化坐骑' },
fuben1: { name: '副本令牌', effect: 0, description: '用于挑战副本' },
shenshou1: { name: '神兽蛋', effect: 0, description: '用于强化轮回神兽' },
lawPowerMaterial: { name: '法则之力材料', effect: 0, description: '用于升级法则之力词条' },
fuwen1: { name: '秘法符文', effect: 0, description: '用于强化符文' },
fuben2: { name: '秘境钥匙', effect: 0, description: '用于开启秘境' },
danyao1: { name: '蕴灵筑基丹', effect: 0, description: '用于提升微量修仙经验' },
danyao2: { name: '凝元固窍丹', effect: 0, description: '用于提升少量修仙经验' },
danyao3: { name: '渡厄金还丹', effect: 0, description: '用于提升中量修仙经验' },
danyao4: { name: '九转轮回丹', effect: 0, description: '用于提升大量修仙经验' },
danyao5: { name: '混元道果丹', effect: 0, description: '用于提升极量修仙经验' },
fubeng1: { name: '深渊令牌', effect: 0, description: '用于挑战无限深渊' },
cultivationpill: { name: '修炼丹', effect: 0, description: '暂时无用处' },
seed_herb1: { name: '蕴灵草药种子', effect: 0, description: '洞府灵田可种植，收获蕴灵筑基丹' },
seed_herb2: { name: '凝元草药种子', effect: 0, description: '洞府灵田可种植，收获凝元固窍丹' },
seed_herb3: { name: '渡厄草药种子', effect: 0, description: '洞府灵田可种植，收获渡厄金还丹' },
seed_herb4: { name: '九转草药种子', effect: 0, description: '洞府灵田可种植，收获九转轮回丹' },
seed_herb5: { name: '混元草药种子', effect: 0, description: '洞府灵田可种植，收获混元道果丹' }
};

        // 收藏物配置
        const collectionEffects = {
             lightSpeedHand: { name: '光速幻影手', effect: 0.01, description: '增加全部装备属性 +1%' },
    empHand: { name: '电磁脉冲快手', effect: 0.05, description: '增加全部装备属性 +5%' },
    godlyHand: { name: '神级手速怪', effect: 0.30, description: '增加全部装备属性 +30%' },
    quickHand: { name: '秒点快手侠', effect: 2.00, description: '增加全部装备属性 +200%' },
    shadowHand: { name: '无影闪击手', effect: 5.00, description: '增加全部装备属性 +500%' },
    quantumHand: { name: '量子跃迁快手', effect: 10.00, description: '增加全部装备属性 +1000%' },
    lightningHand: { name: '闪电连点器之手', effect: 100.00, description: '增加全部装备属性 +10000%' },
    divineHand: { name: '天神之手', effect: 5000.00, description: '增加全部装备属性 +500000%' }
};

        // 材料宝箱掉落概率配置
        const materialChestProbabilities = [
     { type: 'lightSpeedHand', prob: 0.71188 },
    { type: 'empHand', prob: 0.2305 },
    { type: 'godlyHand', prob: 0.0324 },
    { type: 'quickHand', prob: 0.01 },
    { type: 'shadowHand', prob: 0.005 },
    { type: 'quantumHand', prob: 0.0005 },
    { type: 'lightningHand', prob: 0.00005 },
    { type: 'divineHand', prob: 0.00001 },
    { type: 'primaryGem', prob: 0.005 },
    { type: 'advancedGem', prob: 0.0005 },
    { type: 'superiorGem', prob: 0.00005 },
    { type: 'divineGem', prob: 0.00001 },
    { type: 'vipPower', prob: 0.001 },
    { type: 'refineStone', prob: 0.001 }, 
    { type: 'companionKey', prob: 0.001 }, 
     { type: 'rebornDan', prob: 0.001 }, 
    
];
    const techniqueChestDrops = [
    // 第一档 22%~21.8%
    { id: "immortalAsuraBody", prob: 0.21 },          // 不灭修罗体 21%
    { id: "godSlayingBurningHeavenArt", prob: 0.21 }, // 弑神焚天诀 21%
    { id: "nineHeavensThunderboltTruth", prob: 0.23299 }, // 九霄雷殛真解 20.65%
    
    // 第二档 5%
    { id: "eightDesolationsWarDemonBody", prob: 0.05 },  // 八荒战魔躯 5%
    { id: "burialHeavenBladePrisonManual", prob: 0.05 }, // 葬天刀狱谱 5%
    { id: "nineCalamitiesWorldDestroyingPalm", prob: 0.05 }, // 九劫灭世掌 5%
    { id: "netherBloodSeaDiagram", prob: 0.05 },        // 幽冥血海图录 5%
    
    // 第三档 2%
    { id: "nineRevolutionsProfoundBody", prob: 0.02 },  // 九转玄黄身 2%
    { id: "tenDirectionsAnnihilationSpearCodex", prob: 0.02 }, // 十方俱灭枪典 2%
    { id: "chaosCreationForce", prob: 0.02 },           // 混沌开天劲 2%
    { id: "riverStarsHangingSecretScroll", prob: 0.02 }, // 星河倒悬秘卷 2%
    
    // 第四档 1%
    { id: "loneDestinyBone", prob: 0.01 },              // 天煞孤星骨 1%
    { id: "thousandCalamitiesVoidArrowArt", prob: 0.01 }, // 千劫裂空箭术 1%
    { id: "dragonElephantShatteringVoidArt", prob: 0.01 }, // 龙象碎穹功 1%
    { id: "eightDesolationsFireDragonRecord", prob: 0.01 }, // 八荒火龙焚世录 1%
    
    // 第五档 0.5%
    { id: "bloodPrisonMadGodArmor", prob: 0.0051 },      // 血狱狂神铠 0.5%
    { id: "ancientAnnihilationHalberdArt", prob: 0.0051 }, // 万古寂灭戟法 0.5%
    { id: "greatSunFallingStarFist", prob: 0.0051 },     // 大日陨星拳 0.5%
    { id: "iceSealThreeThousandRealmArt", prob: 0.0051 }, // 冰封三千界心法 0.5%
    
    // 第六档 0.5%~0.001%
    { id: "greatVoidReturnToVoidCodex", prob: 0.005 },  // 太虚归墟典 0.5%
    { id: "samsaraCalamityAnnihilationSutra", prob: 0.001 }, // 轮回劫灭经 0.1%
    { id: "yinYangReversalArt", prob: 0.0005 },         // 阴阳逆命术 0.05%
    { id: "zhouHeavenStarsFallingWay", prob: 0.0001 },  // 周天星陨道 0.01%
    { id: "ancientVoidRecord", prob: 0.00001 }          // 万古空冥录 0.001%
];
 // 奥秘系统配置
const mysteryConfig = [
    { stage: 1, name: "初级秘法师", levelCost: 100, totalBonus: 1 },
    { stage: 2, name: "奥法转运者", levelCost: 10000, totalBonus: 2 },
    { stage: 3, name: "奥术掌握者", levelCost: 100000, totalBonus: 4 },
    { stage: 4, name: "秘能大师", levelCost: 500000, totalBonus: 6 },
    { stage: 5, name: "奥术之灵", levelCost: 1000000, totalBonus: 8 },
    { stage: 6, name: "神圣秘灵师", levelCost: 5000000, totalBonus: 10 },
    { stage: 7, name: "神之奥术掌握者", levelCost: 10000000, totalBonus: 20 },
    { stage: 8, name: "先知大师", levelCost: 50000000, totalBonus: 40 },
    { stage: 9, name: "恒星秘法师", levelCost: 100000000, totalBonus: 60 },
    { stage: 10, name: "暗能量宗师", levelCost: 200000000, totalBonus: 80 },
    { stage: 11, name: "星光秘耀使者", levelCost: 300000000, totalBonus: 100 },
    { stage: 12, name: "混沌秘能主宰", levelCost: 400000000, totalBonus: 200 },
    { stage: 13, name: "维度漫游大师", levelCost: 500000000, totalBonus: 400 },
    { stage: 14, name: "终焉秘法先知", levelCost: 600000000, totalBonus: 600 },
    { stage: 15, name: "时律操纵者", levelCost: 800000000, totalBonus: 800 },
    { stage: 16, name: "创世星芒导师", levelCost: 1000000000, totalBonus: 1000 },
    { stage: 17, name: "虚无之光缔造者", levelCost: 2000000000, totalBonus: 2000 },
    { stage: 18, name: "神谕秘能神", levelCost: 4000000000, totalBonus: 4000 },
    { stage: 19, name: "永恒奥术神", levelCost: 6000000000, totalBonus: 6000 },
    { stage: 20, name: "超维秘耀神", levelCost: 8000000000, totalBonus: 8000 },
    { stage: 21, name: "奥秘本身", levelCost: 10000000000, totalBonus: 10000 },
    { stage: 22, name: "万物创造者", levelCost: 25000000000, totalBonus: 20000 },
    { stage: 23, name: "奥秘创造者", levelCost: 50000000000, totalBonus: 60000 },
    { stage: 24, name: "创世神", levelCost: 75000000000, totalBonus: 80000 },
    { stage: 25, name: "位面之子", levelCost: 100000000000, totalBonus: 100000 },
    { stage: 26, name: "版本之子", levelCost: 500000000000, totalBonus: 200000 },
    { stage: 27, name: "维度主宰", levelCost: 1000000000000, totalBonus: 400000 },
    { stage: 28, name: "时空旅者", levelCost: 5000000000000, totalBonus: 600000 },
    { stage: 29, name: "次元神", levelCost: 10000000000000, totalBonus: 800000 },
    { stage: 30, name: "超越者", levelCost: 50000000000000, totalBonus: 1000000 },
    { stage: 31, name: "无名之铭", levelCost: 70000000000000, totalBonus: 5000000 },
    { stage: 32, name: "法则之上", levelCost: 100000000000000, totalBonus: 10000000 },
    { stage: 33, name: "永恒问号", levelCost: 200000000000000, totalBonus: 50000000 },
    { stage: 34, name: "不可观测", levelCost: 300000000000000, totalBonus: 100000000 },
    { stage: 35, name: "次元本身", levelCost: 400000000000000, totalBonus: 500000000 },
    { stage: 36, name: "超越次元", levelCost: 500000000000000, totalBonus: 1000000000 },
    { stage: 37, name: "绝对未知", levelCost: 1000000000000000, totalBonus: 5000000000 },
    { stage: 38, name: "因果之外", levelCost: 5000000000000000, totalBonus: 10000000000 },
    { stage: 39, name: "唯一的谜", levelCost: 10000000000000000, totalBonus: 50000000000 },
    { stage: 40, name: "我就是谜", levelCost: 50000000000000000, totalBonus: 100000000000 }

];
        // 装备配置
      const equipmentTypes = {
            common: { name: '普通', gps: 1, click: 0, prob: 0.6, growthRate: 0.025 },
            rare: { name: '稀有', gps: 3, click: 3, prob: 0.15, growthRate: 0.05 },
            epic: { name: '史诗', gps: 15, click: 15, prob: 0.1, growthRate: 0.10 },
            legendary: { name: '传说', gps: 20, click: 20, prob: 0.05, growthRate: 0.15 },
            ancient: { name: '远古', gps: 50, click: 50, prob: 0.03, growthRate: 0.20 },
            divine: { name: '神圣', gps: 100, click: 100, prob: 0.02, growthRate: 0.30 },
            arcane: { name: '奥术', gps: 300, click: 300, prob: 0.015, growthRate: 0.35 },
            celestial: { name: '天空', gps: 1000, click: 1000, prob: 0.01, growthRate: 0.40 },
            infernal: { name: '地狱', gps: 5000, click: 5000, prob: 0.005, growthRate: 0.50 },
            astral: { name: '星界', gps: 10000, click: 10000, prob: 0.003, growthRate: 0.60 },
            primeval: { name: '原初', gps: 50000, click: 50000, prob: 0.002, growthRate: 0.70 },
            transcendental: { name: '超凡', gps: 100000, click: 100000, prob: 0.001, growthRate: 0.80 },
            quantum: { name: '量子', gps: 500000, click: 500000, prob: 0.0005, growthRate: 0.90 },
            ultimate: { name: '究极', gps: 1000000, click: 1000000, prob: 0.0134, growthRate: 1.00 },
            chaos: { name: '混沌', gps: 10000000, click: 10000000, prob: 0.01, growthRate: 1.20 },
            eternal: { name: '永恒', gps: 20000000, click: 20000000, prob: 0.01, growthRate: 1.50 },
           void: { name: '虚无', gps: 50000000, click: 50000000, prob: 0.001, growthRate: 2.00 },
          genesis: { name: '创世', gps: 1e9, click: 1e9, prob: 0.01, growthRate: 2.50 },
          divineRealm: { name: '神域', gps: 2e9, click: 2e9, prob: 0.01, growthRate: 2.70 },
          apocalypse: { name: '终焉', gps: 5e9, click: 5e9, prob: 0.01, growthRate: 3.00 },
         yeyu1: { name: '星辰', gps: 1e11, click: 1e11, prob: 0.0001, growthRate: 3.20 },
         yeyu2: { name: '起源', gps: 2e11, click: 2e11, prob: 0.00005, growthRate: 3.50 },
         yeyu3: { name: '时光', gps: 5e11, click: 5e11, prob: 0.00001, growthRate: 4.00 },
         yeyu4: { name: '造物', gps: 1e13, click: 1e13, prob: 0.000005, growthRate: 4.20 },
         yeyu5: { name: '银河', gps: 2e13, click: 2e13, prob: 0.000001, growthRate: 4.50 },
         yeyu6: { name: '天界', gps: 5e13, click: 5e13, prob: 0.0000001, growthRate: 5.00 },
         yeyu7: { name: '星云', gps: 1e15, click: 1e15, prob: 0.0000001, growthRate: 5.50 },
         yeyu8: { name: '星河', gps: 2e15, click: 2e15, prob: 0.0000001, growthRate: 6.00 },
         yeyu9: { name: '纪元', gps: 5e15, click: 5e15, prob: 0.0000001, growthRate: 6.50 }, 
         yeyu10: { name: '鸿蒙', gps: 1e17, click: 1e17, prob: 0.0000001, growthRate: 7.00 },
         yeyu11: { name: '星穹', gps: 2e17, click: 2e17, prob: 0.0000001, growthRate: 7.50 },
         yeyu12: { name: '亘古', gps: 5e17, click: 5e17, prob: 0.0000001, growthRate: 8.00 },
         yeyu13: { name: '万象', gps: 1e19, click: 1e19, prob: 0.0000001, growthRate: 8.50 },
         yeyu14: { name: '太虚', gps: 2e19, click: 2e19, prob: 0.0000001, growthRate: 9.00 },
         yeyu15: { name: '九垓', gps: 5e19, click: 5e19, prob: 0.0000001, growthRate: 9.50 },
         yeyu16: { name: '穿梭', gps: 1e21, click: 1e21, prob: 0.0000001, growthRate: 10.00 },
         yeyu17: { name: '恒古', gps: 2e21, click: 2e21, prob: 0.0000001, growthRate: 10.50 },
         yeyu18: { name: '虚空', gps: 5e21, click: 5e21, prob: 0.0000001, growthRate: 11.00 },
         yeyu19: { name: '蔚来', gps: 1e23, click: 1e23, prob: 0.0000001, growthRate: 11.50 },
         yeyu20: { name: '神罚', gps: 2e23, click: 2e23, prob: 0.0000001, growthRate: 12.00 },
         yeyu21: { name: '时空', gps: 5e23, click: 5e23, prob: 0.0000001, growthRate: 12.50 },
         yeyu22: { name: '未来', gps: 1e25, click: 1e26, prob: 0.0000001, growthRate: 13.00 },
         yeyu23: { name: '从前', gps: 2e25, click: 2e26, prob: 0.0000001, growthRate: 13.50 },
         yeyu24: { name: '星澜', gps: 5e25, click: 5e26, prob: 0.0000001, growthRate: 14.00 },
         yeyu25: { name: '逆旅', gps: 1e27, click: 1e28, prob: 0.0000001, growthRate: 14.50 },
         yeyu26: { name: '终章', gps: 2e27, click: 2e28, prob: 0.0000001, growthRate: 15.00 },
         yeyu27: { name: '轮回', gps: 5e27, click: 5e28, prob: 0.0000001, growthRate: 15.50 },
         yeyu28: { name: '恒宇', gps: 1e29, click: 1e30, prob: 0.0000001, growthRate: 16.00 },
         yeyu29: { name: '无垠', gps: 2e29, click: 2e30, prob: 0.0000001, growthRate: 16.50 },
         yeyu30: { name: '寂灭', gps: 5e29, click: 5e30, prob: 0.0000001, growthRate: 17.00 },
         yeyu31: { name: '大道', gps: 1e31, click: 1e32, prob: 0.0000001, growthRate: 17.50 },
         yeyu32: { name: '本源', gps: 2e31, click: 2e32, prob: 0.0000001, growthRate: 18.00 },
         yeyu33: { name: '至高', gps: 5e31, click: 5e32, prob: 0.0000001, growthRate: 18.50 }
        };
        // 副本装备配置
        const dungeonEquipmentTypes = {
            common: { name: '废品', growthRange: [0.00001, 0.0005] },
            rare: { name: '倚天剑', growthRange: [0.001, 0.10] },
            epic: { name: '青龙枪', growthRange: [0.001, 0.15] },
            legendary: { name: '白虎斧', growthRange: [0.001, 0.20] },
            ancient: { name: '朱雀弓', growthRange: [0.001, 0.25] },
            divine: { name: '玄武盾', growthRange: [0.001, 0.30] },
            arcane: { name: '麒麟杖', growthRange: [0.001, 0.35] },
            celestial: { name: '凤凰剑', growthRange: [0.001, 0.40] },
            infernal: { name: '饕餮刀', growthRange: [0.001, 0.45] },
            astral: { name: '穷奇戟', growthRange: [0.001, 0.50] },
            primeval: { name: '烛龙枪', growthRange: [0.001, 0.60] },
            transcendental: { name: '白泽剑', growthRange: [0.001, 0.70] },
            quantum: { name: '混沌斧', growthRange: [0.001, 0.80] },
            ultimate: { name: '太初刃', growthRange: [0.001, 0.90] },
            ultimate1: { name: '幻梦·洪荒刃☆', growthRange: [0.001, 1.00] },
            ultimate2: { name: '灵蕴神界剑★', growthRange: [0.001, 1.10] },
            ultimate3: { name: '蚀魂·地狱斧★★', growthRange: [0.001, 1.20] },
            ultimate4: { name: '蚀魂·暗夜枪★★★', growthRange: [0.001, 1.30] },
            ultimate5: { name: '遗梦·异界弓★★★★', growthRange: [0.001, 1.40] },
            ultimate6: { name: '幻月·现代盾★★★★★', growthRange: [0.001, 1.50] },
            ultimate7: { name: '寒星·风神杖★★★★★★', growthRange: [0.001, 1.60] },
            ultimate8: { name: '炎凤·雷霆戟★★★★★★★', growthRange: [0.001, 1.70] },
            ultimate9: { name: '雾霭·星辰刃★★★★★★★★', growthRange: [0.001, 1.80] },
            ultimate10: { name: '月尘·虚空斧★★★★★★★★', growthRange: [0.001, 1.90] },
            ultimate11: { name: '焚天·混沌枪○', growthRange: [0.001, 2.00] },
            ultimate12: { name: '焚天·永恒剑●', growthRange: [0.001, 2.10] },
            ultimate13: { name: '混沌·幽冥弓●●', growthRange: [0.001, 2.20] },
            ultimate14: { name: '星辰·天启盾●●●', growthRange: [0.001, 2.30] },
            ultimate15: { name: '太古·破晓杖●●●●', growthRange: [0.001, 2.40] },
            ultimate16: { name: '月尘·末日戟●●●●●', growthRange: [0.001, 2.50] },
            ultimate17: { name: '月尘·苍穹刃●●●●●●', growthRange: [0.001, 2.60] },
            ultimate18: { name: '流萤·幻影斧●●●●●●●', growthRange: [0.001, 2.70] },
            ultimate19: { name: '皓宇·天罚枪●●●●●●●●', growthRange: [0.001, 2.80] },
            ultimate20: { name: '灵幻·神罚剑●●●●●●●●●', growthRange: [0.001, 2.90] },
            ultimate21: { name: '炽阳·魔界弓◇', growthRange: [0.001, 3.00] },
            ultimate22: { name: '琥珀·圣光盾◆', growthRange: [0.001, 3.10] },
            ultimate23: { name: '紫霄·暗影杖◆◆', growthRange: [0.001, 3.20] },
            ultimate24: { name: '荒古·龙魂戟◆◆◆', growthRange: [0.001, 3.30] },
            ultimate25: { name: '破晓·天穹刃◆◆◆◆', growthRange: [0.001, 3.40] },
            ultimate26: { name: '星澜·炎狱斧◆◆◆◆◆', growthRange: [0.001, 3.50] },
            ultimate27: { name: '龙炎·神枪戟◆◆◆◆◆◆', growthRange: [0.001, 3.60] },
            ultimate28: { name: '鸿蒙·冥界剑◆◆◆◆◆◆◆', growthRange: [0.001, 3.70] },
            ultimate29: { name: '鸿蒙·天界弓◆◆◆◆◆◆◆◆', growthRange: [0.001, 3.80] },
            ultimate30: { name: '荒古·地狱盾◆◆◆◆◆◆◆◆◆', growthRange: [0.001, 3.90] },
            ultimate31: { name: '荒炎·太古杖□', growthRange: [0.001, 4.00] },
            ultimate32: { name: '荒炎·异界戟■', growthRange: [0.001, 4.10] },
            ultimate33: { name: '荒炎·现代刃■■', growthRange: [0.001, 4.20] },
            ultimate34: { name: '凤羽·风神斧■■■', growthRange: [0.001, 4.30] },
            ultimate35: { name: '荒炎·雷霆枪■■■■', growthRange: [0.001, 4.40] },
            ultimate36: { name: '荒炎·星辰剑■■■■■', growthRange: [0.001, 4.50] },
            ultimate37: { name: '虚空·玄冰弓■■■■■■', growthRange: [0.001, 4.60] },
            ultimate38: { name: '虚空·混沌盾■■■■■■■', growthRange: [0.001, 4.70] },
            ultimate39: { name: '虚空·永恒杖■■■■■■■■', growthRange: [0.001, 4.80] },
            ultimate40: { name: '虚空·幽冥戟■■■■■■■■■', growthRange: [0.001, 4.90] },
            ultimate41: { name: '天启·穿越刃△', growthRange: [0.001, 5.00] },
            ultimate42: { name: '天启·破晓斧▲', growthRange: [0.001, 5.10] },
            ultimate43: { name: '时空·末日枪▲▲', growthRange: [0.001, 5.20] },
            ultimate44: { name: '九幽·苍穹剑▲▲▲', growthRange: [0.001, 5.30] },
            ultimate45: { name: '幻影·雷电弓▲▲▲▲', growthRange: [0.001, 5.40] },
            ultimate46: { name: '天罚·雷霆盾▲▲▲▲▲', growthRange: [0.001, 5.50] },
            ultimate47: { name: '神罚·雷霆杖▲▲▲▲▲▲', growthRange: [0.001, 5.60] },
            ultimate48: { name: '魔界·邪战戟▲▲▲▲▲▲▲', growthRange: [0.001, 5.70] },
            ultimate49: { name: '圣光·灭世剑▲▲▲▲▲▲▲▲', growthRange: [0.001, 5.80] },
            ultimate50: { name: '宇宙·神王剑▲▲▲▲▲▲▲▲▲', growthRange: [0.001, 5.90] },
            ultimate51: { name: '归墟·太初刃▽', growthRange: [0.001, 6.00] },
            ultimate52: { name: '归墟·太初斧▼', growthRange: [0.001, 6.10] },
            ultimate53: { name: '归墟·太初枪▼▼', growthRange: [0.001, 6.20] },
            ultimate54: { name: '归墟·太初剑▼▼▼', growthRange: [0.001, 6.30] },
            ultimate55: { name: '归墟·太初弓▼▼▼▼', growthRange: [0.001, 6.40] },
            ultimate56: { name: '归墟·太初盾▼▼▼▼▼', growthRange: [0.001, 6.50] },
            ultimate57: { name: '归墟·太初杖▼▼▼▼▼▼', growthRange: [0.001, 6.60] },
            ultimate58: { name: '归墟·太初戟▼▼▼▼▼▼▼', growthRange: [0.001, 6.70] },
            ultimate59: { name: '归墟·永恒刃▼▼▼▼▼▼▼▼', growthRange: [0.001, 6.80] },
            ultimate60: { name: '归墟·永恒斧▼▼▼▼▼▼▼▼▼', growthRange: [0.001, 6.90] },
            ultimate61: { name: '本源·至高刃★▽', growthRange: [0.001, 7.00] },
            ultimate62: { name: '本源·至高斧★▼', growthRange: [0.001, 7.10] },
            ultimate63: { name: '本源·至高枪★▼▼', growthRange: [0.001, 7.20] },
            ultimate64: { name: '本源·至高剑★▼▼▼', growthRange: [0.001, 7.30] },
            ultimate65: { name: '本源·至高弓★▼▼▼▼', growthRange: [0.001, 7.40] },
            ultimate66: { name: '本源·至高盾★▼▼▼▼▼', growthRange: [0.001, 7.50] },
            ultimate67: { name: '本源·至高杖★▼▼▼▼▼▼', growthRange: [0.001, 7.60] },
            ultimate68: { name: '本源·至高戟★▼▼▼▼▼▼▼', growthRange: [0.001, 7.70] },
            ultimate69: { name: '本源·大道刃★▼▼▼▼▼▼▼▼', growthRange: [0.001, 7.80] },
            ultimate70: { name: '本源·大道斧★▼▼▼▼▼▼▼▼▼', growthRange: [0.001, 7.90] }
        };

        // 宝箱概率配置
        const chestProbabilities = {
    1: [ { rarity: 'common', prob: 0.8 }, { rarity: 'rare', prob: 0.2 } ],
    2: [ { rarity: 'rare', prob: 0.8 }, { rarity: 'epic', prob: 0.14 }, { rarity: 'legendary', prob: 0.05 }, { rarity: 'ancient', prob: 0.01 } ],
    3: [ { rarity: 'ancient', prob: 0.8 }, { rarity: 'divine', prob: 0.14 }, { rarity: 'arcane', prob: 0.05 }, { rarity: 'celestial', prob: 0.01 } ],
    4: [ { rarity: 'celestial', prob: 0.8 }, { rarity: 'infernal', prob: 0.14 }, { rarity: 'astral', prob: 0.05 }, { rarity: 'primeval', prob: 0.01 } ],
    5: [ { rarity: 'primeval', prob: 0.8 }, { rarity: 'transcendental', prob: 0.14 }, { rarity: 'quantum', prob: 0.05 }, { rarity: 'ultimate', prob: 0.01 } ],
    6: [ { rarity: 'ultimate', prob: 0.8 }, { rarity: 'chaos', prob: 0.14 }, { rarity: 'eternal', prob: 0.05 }, { rarity: 'void', prob: 0.01 } ],
    7: [ { rarity: 'void', prob: 0.8 }, { rarity: 'genesis', prob: 0.14 }, { rarity: 'divineRealm', prob: 0.05 }, { rarity: 'apocalypse', prob: 0.01 } ],
    8: [ { rarity: 'apocalypse', prob: 0.8 }, { rarity: 'yeyu1', prob: 0.14 }, { rarity: 'yeyu2', prob: 0.05 }, { rarity: 'yeyu3', prob: 0.01 } ],
    9: [ { rarity: 'yeyu3', prob: 0.8 }, { rarity: 'yeyu4', prob: 0.14 }, { rarity: 'yeyu5', prob: 0.05 }, { rarity: 'yeyu6', prob: 0.01 } ],
    10: [ { rarity: 'yeyu6', prob: 0.8 }, { rarity: 'yeyu7', prob: 0.14 }, { rarity: 'yeyu8', prob: 0.05 }, { rarity: 'yeyu9', prob: 0.01 } ],
    11: [ { rarity: 'yeyu9', prob: 0.8 }, { rarity: 'yeyu10', prob: 0.14 }, { rarity: 'yeyu11', prob: 0.05 }, { rarity: 'yeyu12', prob: 0.01 } ],
    12: [ { rarity: 'yeyu12', prob: 0.8 }, { rarity: 'yeyu13', prob: 0.14 }, { rarity: 'yeyu14', prob: 0.05 }, { rarity: 'yeyu15', prob: 0.01 } ],
    13: [ { rarity: 'yeyu15', prob: 0.8 }, { rarity: 'yeyu16', prob: 0.14 }, { rarity: 'yeyu17', prob: 0.05 }, { rarity: 'yeyu18', prob: 0.01 } ],
    14: [ { rarity: 'yeyu18', prob: 0.8 }, { rarity: 'yeyu19', prob: 0.14 }, { rarity: 'yeyu20', prob: 0.05 }, { rarity: 'yeyu21', prob: 0.01 } ],
    15: [ { rarity: 'yeyu21', prob: 0.8 }, { rarity: 'yeyu22', prob: 0.14 }, { rarity: 'yeyu23', prob: 0.05 }, { rarity: 'yeyu24', prob: 0.01 } ],
    16: [ { rarity: 'yeyu24', prob: 0.8 }, { rarity: 'yeyu25', prob: 0.14 }, { rarity: 'yeyu26', prob: 0.05 }, { rarity: 'yeyu27', prob: 0.01 } ],
    17: [ { rarity: 'yeyu27', prob: 0.8 }, { rarity: 'yeyu28', prob: 0.14 }, { rarity: 'yeyu29', prob: 0.05 }, { rarity: 'yeyu30', prob: 0.01 } ],
    18: [ { rarity: 'yeyu30', prob: 0.8 }, { rarity: 'yeyu31', prob: 0.14 }, { rarity: 'yeyu32', prob: 0.05 }, { rarity: 'yeyu33', prob: 0.01 } ]
};

        // 宠物配置
        const petConfig = {
            thunderKirin: { name: '苍雷麒麟', currency: 'gold', multiplier: 0.10 }, 
            chaosTaotie: { name: '混沌饕餮', currency: 'diamond', multiplier: 0.30 }, 
            netherQiongqi: { name: '九幽穷奇', currency: 'titanium', multiplier: 0.90 }, 
            abyssKun: { name: '霸渊巨鲲', currency: 'starstone', multiplier: 2.70 }, 
            primordialZhuLong: { name: '太初烛龙', currency: 'cosmicstone', multiplier: 8.10 }, 
        wanJunSuanNi: { name: '万钧狻猊', currency: 'superstone', multiplier: 24.30 }, 
          yanYuBiAn: { name: '炎狱狴犴', currency: 'otherworldstone', multiplier: 72.90 }, 
          yuyu1: { name: '赤霄夔龙', currency: 'xingjiestone', multiplier: 218.70 }, 
          yuyu2: { name: '震岳白泽', currency: 'hundunstone', multiplier: 656.10 }, 
         yuyu3: { name: '焚天蛊雕', currency: 'lingtone', multiplier: 1968.30 }, 
         yuyu4: { name: '血煞梼杌', currency: 'huangtone', multiplier: 5904.90 }, 
        yuyu5: { name: '玄渊白犼', currency: 'mingtone', multiplier: 17714.70 },
         yuyu6: { name: '灾祸蜚牛', currency: 'xutong', multiplier: 53144.10 }, 
         yuyu7: { name: '寂灭罗睺', currency: 'shitone', multiplier: 159432.30 }, 
        yuyu8: { name: '永劫蚩尤', currency: 'weitone', multiplier: 478296.90 },
        yuyu9: { name: '天罚刑天', currency: 'yongtone', multiplier: 1434890.70 },
        yuyu10: { name: '浑沌帝江', currency: 'wujitone', multiplier: 4304672.10 },
        yuyu11: { name: '无极烛阴', currency: 'daotone', multiplier: 12914016.30 }
     };

        // 魂环配置
        const soulRingTypes = {
            year1: { name: '一年魂环', baseMult: 0.02, costBase: 1000 },
            year10: { name: '十年魂环', baseMult: 0.05, costBase: 1000 },
            year100: { name: '百年魂环', baseMult: 0.08, costBase: 1000 },
            year1000: { name: '千年魂环', baseMult: 0.10, costBase: 1000 },
            year10000: { name: '万年魂环', baseMult: 0.12, costBase: 1000 },
            year100000: { name: '十万年魂环', baseMult: 0.15, costBase: 1000 },
            year1000000: { name: '百万年魂环', baseMult: 0.18, costBase: 1000 },
            year10000000: { name: '千万年魂环', baseMult: 0.20, costBase: 1000 },
            year100000000: { name: '亿年魂环', baseMult: 0.25, costBase: 1000 },
            year2: { name: '太古·混沌亿年魂环', baseMult: 0.30, costBase: 1000 },
            year3: { name: '鸿蒙·始源亿年魂环', baseMult: 0.35, costBase: 1000 },
            year4: { name: '亘古·时空亿年魂环', baseMult: 0.40, costBase: 1000 },
            year5: { name: '九幽·冥渊亿年魂环', baseMult: 0.45, costBase: 1000 },
            year6: { name: '皓宇·星辰亿年魂环', baseMult: 0.50, costBase: 1000 },
            year7: { name: '炎狱·焚天亿年魂环', baseMult: 0.55, costBase: 1000 },
            year8: { name: '霜烬·极寒亿年魂环', baseMult: 0.60, costBase: 1000 },
            year9: { name: '灵幻·万象亿年魂环', baseMult: 0.65, costBase: 1000 },
            year11: { name: '炽阳·耀世亿年魂环', baseMult: 0.70, costBase: 1000 },
            year12: { name: '暗蚀·灭世亿年魂环', baseMult: 0.75, costBase: 1000 },
            year13: { name: '圣辉·救赎亿年魂环', baseMult: 0.80, costBase: 1000 },
            year14: { name: '紫霄·雷罚亿年魂环', baseMult: 0.85, costBase: 1000 },
            year15: { name: '青木·生机亿年魂环', baseMult: 0.90, costBase: 1000 },
            year16: { name: '星澜·幻梦亿年魂环', baseMult: 0.95, costBase: 1000 },
            year17: { name: '渊海·无尽亿年魂环', baseMult: 1.00, costBase: 1000 },
            year18: { name: '荒古·遗世亿年魂环', baseMult: 1.10, costBase: 1000 },
            year19: { name: '净世·光明亿年魂环', baseMult: 1.20, costBase: 1000 },
            year20: { name: '蚀灵·诅咒亿年魂环', baseMult: 1.30, costBase: 1000 },
            year21: { name: '逆乱·时空亿年魂环', baseMult: 1.40, costBase: 1000 },
            year22: { name: '龙渊·霸者亿年魂环', baseMult: 1.50, costBase: 1000 },
            year23: { name: '凤羽·炎舞亿年魂环', baseMult: 1.60, costBase: 1000 },
            year24: { name: '星辰·命数亿年魂环', baseMult: 1.70, costBase: 1000 },
            year25: { name: '荒炎·破灭亿年魂环', baseMult: 1.80, costBase: 1000 },
            year26: { name: '玄冰·永冻亿年魂环', baseMult: 1.90, costBase: 1000 },
            year27: { name: '灵犀·心眼亿年魂环', baseMult: 2.00, costBase: 1000 },
            year28: { name: '圣谕·裁决亿年魂环', baseMult: 2.10, costBase: 1000 },
            year29: { name: '九幽·黄泉亿年魂环', baseMult: 2.20, costBase: 1000 },
            year30: { name: '灵蕴·造化亿年魂环', baseMult: 2.30, costBase: 1000 },
            year31: { name: '混沌·元始亿年魂环', baseMult: 2.40, costBase: 1000 },
            year32: { name: '苍穹·御天亿年魂环', baseMult: 2.50, costBase: 1000 },
            year33: { name: '龙炎·焚天亿年魂环', baseMult: 2.60, costBase: 1000 }, 
            year34: { name: '血狱·魔神亿年魂环', baseMult: 2.70, costBase: 1000 },  
            year35: { name: '赤霄·苍穹亿年魂环', baseMult: 2.80, costBase: 1000 },
            year36: { name: '炎凤·涅槃亿年魂环', baseMult: 2.90, costBase: 1000 },
            year37: { name: '闫闫·黑丝亿年魂环', baseMult: 3.00, costBase: 1000 },
            year38: { name: '霜月·清辉亿年魂环', baseMult: 3.10, costBase: 1000 },
            year39: { name: '紫电·雷鸣亿年魂环', baseMult: 3.20, costBase: 1000 },
            year40: { name: '金乌·耀日亿年魂环', baseMult: 3.30, costBase: 1000 },
            year41: { name: '玉衡·星枢亿年魂环', baseMult: 3.40, costBase: 1000 },
            year42: { name: '青莲·化劫亿年魂环', baseMult: 3.50, costBase: 1000 },
            year43: { name: '朱殷·血魄亿年魂环', baseMult: 3.60, costBase: 1000 },
            year44: { name: '玄龟·镇渊亿年魂环', baseMult: 3.70, costBase: 1000 },
            year45: { name: '白虎·裂空亿年魂环', baseMult: 3.80, costBase: 1000 },
            year46: { name: '青龙·御宇亿年魂环', baseMult: 3.90, costBase: 1000 },
            year47: { name: '朱雀·焚野亿年魂环', baseMult: 4.00, costBase: 1000 },
            year48: { name: '玄武·镇狱亿年魂环', baseMult: 4.10, costBase: 1000 },
            year49: { name: '麒麟·显圣亿年魂环', baseMult: 4.20, costBase: 1000 },
            year50: { name: '凤凰·涅槃亿年魂环', baseMult: 4.30, costBase: 1000 },
            year51: { name: '鲲鹏·扶摇亿年魂环', baseMult: 4.40, costBase: 1000 },
            year52: { name: '应龙·行雨亿年魂环', baseMult: 4.50, costBase: 1000 },
            year53: { name: '白泽·通幽亿年魂环', baseMult: 4.60, costBase: 1000 },
            year54: { name: '重明·照冥亿年魂环', baseMult: 4.70, costBase: 1000 },
            year55: { name: '穷奇·吞恶亿年魂环', baseMult: 4.80, costBase: 1000 },
            year56: { name: '梼杌·破军亿年魂环', baseMult: 4.90, costBase: 1000 },
            year57: { name: '混沌·无名亿年魂环', baseMult: 5.00, costBase: 1000 }
        };
           const TECHNIQUE_DISPLAY_ORDER = [
    // 生命类（防御型）
    "immortalAsuraBody",       // 不灭修罗体
    "eightDesolationsWarDemonBody", // 八荒战魔躯
    "nineRevolutionsProfoundBody",  // 九转玄黄身
    "loneDestinyBone",         // 天煞孤星骨
    "bloodPrisonMadGodArmor",  // 血狱狂神铠
    
    // 攻击类（输出型）
    "godSlayingBurningHeavenArt",  // 弑神焚天诀
    "burialHeavenBladePrisonManual", // 葬天刀狱谱
    "tenDirectionsAnnihilationSpearCodex", // 十方俱灭枪典
    "thousandCalamitiesVoidArrowArt", // 千劫裂空箭术
    "ancientAnnihilationHalberdArt", // 万古寂灭戟法
    
    // 暴击类
    "nineHeavensThunderboltTruth", // 九霄雷殛真解
    "netherBloodSeaDiagram",    // 幽冥血海图录
    "riverStarsHangingSecretScroll", // 星河倒悬秘卷
    "eightDesolationsFireDragonRecord", // 八荒火龙焚世录
    "iceSealThreeThousandRealmArt", // 冰封三千界心法
    
    // 爆伤类
    "nineCalamitiesWorldDestroyingPalm", // 九劫灭世掌
    "chaosCreationForce",      // 混沌开天劲
    "dragonElephantShatteringVoidArt", // 龙象碎穹功
    "greatSunFallingStarFist", // 大日陨星拳
    
    // 特殊效果类（连击/多段攻击）
    "greatVoidReturnToVoidCodex", // 太虚归墟典
    "samsaraCalamityAnnihilationSutra", // 轮回劫灭经
    "yinYangReversalArt",      // 阴阳逆命术
    "zhouHeavenStarsFallingWay", // 周天星陨道
    "ancientVoidRecord"        // 万古空冥录
];
   const DUNGEON_EQUIPMENT_ORDER = [
    'common',     
    'rare',       
    'epic',       
    'legendary',  
    'ancient',    
    'divine',    
    'arcane',     
    'celestial',  
    'infernal',  
    'astral',     
    'primeval',  
    'transcendental', 
    'quantum',   
    'ultimate',
    'ultimate1',     
    'ultimate2',   
    'ultimate3',       
    'ultimate4',   
    'ultimate5', 
    'ultimate6',    
    'ultimate7',     
    'ultimate8',   
    'ultimate9',       
    'ultimate10',   
    'ultimate11', 
    'ultimate12',     
    'ultimate13',     
    'ultimate14',   
    'ultimate15',       
    'ultimate16',   
    'ultimate17', 
    'ultimate18',   
    'ultimate19',     
    'ultimate20',   
    'ultimate21',       
    'ultimate22',   
    'ultimate23', 
    'ultimate24',   
    'ultimate25',   
    'ultimate26',       
    'ultimate27',   
    'ultimate28', 
    'ultimate29',     
    'ultimate30',     
    'ultimate31',   
    'ultimate32',       
    'ultimate33',   
    'ultimate34', 
    'ultimate35',     
    'ultimate36',     
    'ultimate37',   
    'ultimate38',       
    'ultimate39',   
    'ultimate40', 
    'ultimate41',    
    'ultimate42',     
    'ultimate43',   
    'ultimate44',       
    'ultimate45',   
    'ultimate46', 
    'ultimate47', 
    'ultimate48',   
    'ultimate49', 
    'ultimate50',
    'ultimate51',
    'ultimate52',
    'ultimate53',
    'ultimate54',
    'ultimate55',
    'ultimate56',
    'ultimate57',
    'ultimate58',
    'ultimate59',
    'ultimate60',
    'ultimate61',
    'ultimate62',
    'ultimate63',
    'ultimate64',
    'ultimate65',
    'ultimate66',
    'ultimate67',
    'ultimate68',
    'ultimate69',
    'ultimate70'
];

// 切换自动转生状态
function toggleAutoReincarnation() {
    player.autoReincarnation = !player.autoReincarnation;
    document.getElementById('autoReincarnationStatus').textContent = player.autoReincarnation ? '开启' : '关闭';
    logAction(`自动转生已${player.autoReincarnation ? '开启' : '关闭'}`, 'info');
}

// 检查自动转生条件
function checkAutoReincarnation() {
    if (!player.autoReincarnation) return;
    
    // 计算当前转生所需的总等级
    const requiredLevel = 10000 + player.reincarnationCount * 20;
    
    // 计算所有普通装备的总等级
    const totalCommonLevel = player.equipment
        .filter(eq => eq.rarity === 'common')
        .reduce((sum, eq) => sum + eq.level, 0);
    
    if (totalCommonLevel >= requiredLevel) {
        // 直接执行转生逻辑，不弹出确认对话框
        autoReincarnate();
    }
}

// 自动转生逻辑（不弹出确认对话框）
function autoReincarnate() {
    // 计算当前转生所需的总等级
    const requiredLevel = 10000 + player.reincarnationCount * 20;
    
    // 计算所有普通装备的总等级
    const totalCommonLevel = player.equipment
        .filter(eq => eq.rarity === 'common')
        .reduce((sum, eq) => sum + eq.level, 0);
    
    if (totalCommonLevel < requiredLevel) {
        logAction(`自动转生失败：普通装备总等级不足（需要${requiredLevel}级，当前${totalCommonLevel}级）`, "error");
        return;
    }

    let totalReincarnationCoin = 0;

    // 计算转生币奖励
    player.equipment.forEach(eq => {
        switch (eq.rarity) {
            case 'common':
                totalReincarnationCoin += eq.level * 0.0001;
                break;
            case 'rare':
                totalReincarnationCoin += eq.level * 0.0002;
                break;
            case 'epic':
                totalReincarnationCoin += eq.level * 0.001;
                break;
            case 'legendary':
                totalReincarnationCoin += eq.level * 0.003;
                break;
            case 'ancient':
                totalReincarnationCoin += eq.level * 0.005;
                break;
            case 'divine':
                totalReincarnationCoin += eq.level * 0.008;
                break;
            case 'arcane':
                totalReincarnationCoin += eq.level * 0.01;
                break;
            case 'celestial':
                totalReincarnationCoin += eq.level * 0.03;
                break;
            case 'infernal':
                totalReincarnationCoin += eq.level * 0.05;
                break;
            case 'astral':
                totalReincarnationCoin += eq.level * 0.08;
                break;
            case 'primeval':
                totalReincarnationCoin += eq.level * 0.1;
                break;
            case 'transcendental':
                totalReincarnationCoin += eq.level * 0.3;
                break;
            case 'quantum':
                totalReincarnationCoin += eq.level * 0.5;
                break;
            case 'ultimate':
                totalReincarnationCoin += eq.level * 1.0;
                break;
            case 'chaos':
                totalReincarnationCoin += eq.level * 3.0;
                break;
            case 'eternal':
                totalReincarnationCoin += eq.level * 5.0;
                break;
            case 'void':
                totalReincarnationCoin += eq.level * 10.0;
                break;
            case 'genesis':
                totalReincarnationCoin += eq.level * 20.0;
                break;
            case 'divineRealm':
                totalReincarnationCoin += eq.level * 30.0;
                break;
            case 'apocalypse':
                totalReincarnationCoin += eq.level * 40.0;
                break;
            case 'yeyu1':
                totalReincarnationCoin += eq.level * 50.0;
                break;
            case 'yeyu2':
                totalReincarnationCoin += eq.level * 60.0;
                break;
            case 'yeyu3':
                totalReincarnationCoin += eq.level * 70.0;
                break;
            case 'yeyu4':
                totalReincarnationCoin += eq.level * 80.0;
                break;
            case 'yeyu5':
                totalReincarnationCoin += eq.level * 90.0;
                break;
            case 'yeyu6':
                totalReincarnationCoin += eq.level * 100.0;
                break;
            case 'yeyu7':
                totalReincarnationCoin += eq.level * 200.0;
                break;
            case 'yeyu8':
                totalReincarnationCoin += eq.level * 300.0;
                break;
            case 'yeyu9':
                totalReincarnationCoin += eq.level * 400.0;
                break;
            case 'yeyu10':
                totalReincarnationCoin += eq.level * 500.0;
                break;
            case 'yeyu11':
                totalReincarnationCoin += eq.level * 600.0;
                break;
            case 'yeyu12':
                totalReincarnationCoin += eq.level * 700.0;
                break;
            case 'yeyu13':
                totalReincarnationCoin += eq.level * 800.0;
                break;
            case 'yeyu14':
                totalReincarnationCoin += eq.level * 900.0;
                break;
            case 'yeyu15':
                totalReincarnationCoin += eq.level * 1000.0;
                break;
            case 'yeyu16':
                totalReincarnationCoin += eq.level * 2000.0;
                break;
            case 'yeyu17':
                totalReincarnationCoin += eq.level * 3000.0;
                break;
            case 'yeyu18':
                totalReincarnationCoin += eq.level * 4000.0;
                break;
            case 'yeyu19':
                totalReincarnationCoin += eq.level * 5000.0;
                break;
            case 'yeyu20':
                totalReincarnationCoin += eq.level * 6000.0;
                break;
            case 'yeyu21':
                totalReincarnationCoin += eq.level * 7000.0;
                break;
            case 'yeyu22':
                totalReincarnationCoin += eq.level * 8000.0;
                break;
            case 'yeyu23':
                totalReincarnationCoin += eq.level * 9000.0;
                break;
            case 'yeyu24':
                totalReincarnationCoin += eq.level * 10000.0;
                break;
            case 'yeyu25':
                totalReincarnationCoin += eq.level * 11000.0;
                break;
            case 'yeyu26':
                totalReincarnationCoin += eq.level * 12000.0;
                break;
            case 'yeyu27':
                totalReincarnationCoin += eq.level * 13000.0;
                break;
            case 'yeyu28':
                totalReincarnationCoin += eq.level * 14000.0;
                break;
            case 'yeyu29':
                totalReincarnationCoin += eq.level * 15000.0;
                break;
            case 'yeyu30':
                totalReincarnationCoin += eq.level * 16000.0;
                break;
            case 'yeyu31':
                totalReincarnationCoin += eq.level * 17000.0;
                break;
            case 'yeyu32':
                totalReincarnationCoin += eq.level * 18000.0;
                break;
            case 'yeyu33':
                totalReincarnationCoin += eq.level * 19000.0;
                break;
        }
    });

    // 转生收益：每级转生币总加成 +10%
    const coinBonusLv = (player.reincarnationStats && player.reincarnationStats.reincarnationCoinBonus)
        ? (Number(player.reincarnationStats.reincarnationCoinBonus.level) || 0)
        : 0;
    totalReincarnationCoin *= (1 + coinBonusLv * 0.1);

    // 重置装备等级
    player.equipment.forEach(eq => {
        eq.level = 1 + player.reincarnationStats.equipmentLevelBonus.level * 200; // 转生属性加成
        eq.gps = equipmentTypes[eq.rarity].gps * (1 + player.reincarnationStats.gpsBonus.level); // 每级装备属性乘以100%
        eq.click = equipmentTypes[eq.rarity].click * (1 + player.reincarnationStats.gpsBonus.level); // 每级装备属性乘以100%
    });

    // 清空货币
    player.gold = 0;
    player.diamond = 0;
    player.titanium = 0;
    player.starstone = 0;
    player.cosmicstone = 0;
    player.superstone = 0;
    player.otherworldstone = 0;
    player.xingjiestone = 0;
    player.hundunstone = 0;
    player.lingtone = 0;
    player.huangtone = 0;
    player.mingtone = 0;
    player.xutong = 0;
    player.shitone = 0;
    player.weitone = 0;
    player.yongtone = 0;
    player.wujitone = 0;
    player.daotone = 0;   
 // 重置材料宝箱购买成本
            player.materialChestCost = 1;
            player.techniqueChestCost = 1;

            if (typeof resetTsrEternalRuneBonuses === 'function') {
                resetTsrEternalRuneBonuses();
            }

    // 增加转生币
    player.reincarnationCoin += totalReincarnationCoin;
    player.reincarnationCount++;
 player.autoBuyTechniqueChest = true;
    // 修改属性点计算逻辑
    player.attributes.totalPoints = player.reincarnationCount * 1 + player.battle.maxStage * 10 + player.tower.currentFloor * 1;
    player.attributes.remainingPoints += 1; // 每次转生增加1点剩余属性点

    // 检查转生成就
    checkReincarnationAchievements();

    logAction(`自动转生成功！获得转生币: ${totalReincarnationCoin.toFixed(4)}`, 'success');
    updateDisplay();
    updateTechniqueBonuses(); // 转生后更新功法加成
    updatePlayerBattleStats(); // 更新战斗属性
}


        // 转生系统
        function reincarnate() {
   // 计算当前转生所需的总等级
    const requiredLevel = 10000 + player.reincarnationCount * 20;
    
    // 计算所有普通装备的总等级
    const totalCommonLevel = player.equipment
        .filter(eq => eq.rarity === 'common')
        .reduce((sum, eq) => sum + eq.level, 0);
    
    if (totalCommonLevel < requiredLevel) {
        logAction(`转生需要普通装备总等级达到${requiredLevel}级（当前${totalCommonLevel}级）！`, "error");
        return;
    }

    showCustomConfirm(`确定要转生吗？需要普通装备总等级≥${requiredLevel}级，所有装备等级将重置为1级，货币将被清空！`, (confirmed) => {
        if (confirmed) {
            let totalReincarnationCoin = 0;

            // 计算转生币奖励
            player.equipment.forEach(eq => {
                switch (eq.rarity) {
                    case 'common':
                        totalReincarnationCoin += eq.level * 0.0001;
                        break;
                    case 'rare':
                        totalReincarnationCoin += eq.level * 0.0002;
                        break;
                    case 'epic':
                        totalReincarnationCoin += eq.level * 0.001;
                        break;
                    case 'legendary':
                        totalReincarnationCoin += eq.level * 0.003;
                        break;
                    case 'ancient':
                        totalReincarnationCoin += eq.level * 0.005;
                        break;
                    case 'divine':
                        totalReincarnationCoin += eq.level * 0.008;
                        break;
                    case 'arcane':
                        totalReincarnationCoin += eq.level * 0.01;
                        break;
                    case 'celestial':
                        totalReincarnationCoin += eq.level * 0.03;
                        break;
                    case 'infernal':
                        totalReincarnationCoin += eq.level * 0.05;
                        break;
                    case 'astral':
                        totalReincarnationCoin += eq.level * 0.08;
                        break;
                    case 'primeval':
                        totalReincarnationCoin += eq.level * 0.1;
                        break;
                    case 'transcendental':
                        totalReincarnationCoin += eq.level * 0.3;
                        break;
                    case 'quantum':
                        totalReincarnationCoin += eq.level * 0.5;
                        break;
                    case 'ultimate':
                        totalReincarnationCoin += eq.level * 1.0;
                        break;
                    case 'chaos':
                        totalReincarnationCoin += eq.level * 3.0;
                        break;
                   case 'eternal':
                        totalReincarnationCoin += eq.level * 5.0;
                        break;
                   case 'void':
                        totalReincarnationCoin += eq.level * 10.0;
                        break;
                   case 'genesis':
                        totalReincarnationCoin += eq.level * 20.0;
                        break;
                   case 'divineRealm':
                        totalReincarnationCoin += eq.level * 30.0;
                        break;
                   case 'apocalypse':
                        totalReincarnationCoin += eq.level * 40.0;
                        break;
                    case 'yeyu1':
                        totalReincarnationCoin += eq.level * 50.0;
                        break;
                    case 'yeyu2':
                        totalReincarnationCoin += eq.level * 60.0;
                        break;
                     case 'yeyu3':
                        totalReincarnationCoin += eq.level * 70.0;
                        break;
                     case 'yeyu4':
                        totalReincarnationCoin += eq.level * 80.0;
                        break;
                     case 'yeyu5':
                        totalReincarnationCoin += eq.level * 90.0;
                        break;
                     case 'yeyu6':
                        totalReincarnationCoin += eq.level * 100.0;
                        break;
                    case 'yeyu7':
                        totalReincarnationCoin += eq.level * 200.0;
                        break;
                    case 'yeyu8':
                        totalReincarnationCoin += eq.level * 300.0;
                        break;
                     case 'yeyu9':
                        totalReincarnationCoin += eq.level * 400.0;
                        break;
                     case 'yeyu10':
                        totalReincarnationCoin += eq.level * 500.0;
                        break;
                     case 'yeyu11':
                        totalReincarnationCoin += eq.level * 600.0;
                        break;
                     case 'yeyu12':
                        totalReincarnationCoin += eq.level * 700.0;
                        break; 
                       case 'yeyu13':
                        totalReincarnationCoin += eq.level * 800.0;
                        break;
                    case 'yeyu14':
                        totalReincarnationCoin += eq.level * 900.0;
                        break;
                     case 'yeyu15':
                        totalReincarnationCoin += eq.level * 1000.0;
                        break;
                    case 'yeyu16':
                        totalReincarnationCoin += eq.level * 2000.0;
                        break;
                    case 'yeyu17':
                        totalReincarnationCoin += eq.level * 3000.0;
                        break;
                     case 'yeyu18':
                        totalReincarnationCoin += eq.level * 4000.0;
                        break;
                     case 'yeyu19':
                        totalReincarnationCoin += eq.level * 5000.0;
                        break;
                     case 'yeyu20':
                        totalReincarnationCoin += eq.level * 6000.0;
                        break;
                     case 'yeyu21':
                        totalReincarnationCoin += eq.level * 7000.0;
                        break; 
                       case 'yeyu22':
                        totalReincarnationCoin += eq.level * 8000.0;
                        break;
                    case 'yeyu23':
                        totalReincarnationCoin += eq.level * 9000.0;
                        break;
                     case 'yeyu24':
                        totalReincarnationCoin += eq.level * 10000.0;
                        break;
                     case 'yeyu25':
                        totalReincarnationCoin += eq.level * 11000.0;
                        break;
                     case 'yeyu26':
                        totalReincarnationCoin += eq.level * 12000.0;
                        break;
                     case 'yeyu27':
                        totalReincarnationCoin += eq.level * 13000.0;
                        break;
                     case 'yeyu28':
                        totalReincarnationCoin += eq.level * 14000.0;
                        break;
                     case 'yeyu29':
                        totalReincarnationCoin += eq.level * 15000.0;
                        break;
                     case 'yeyu30':
                        totalReincarnationCoin += eq.level * 16000.0;
                        break;
                     case 'yeyu31':
                        totalReincarnationCoin += eq.level * 17000.0;
                        break;
                     case 'yeyu32':
                        totalReincarnationCoin += eq.level * 18000.0;
                        break;
                     case 'yeyu33':
                        totalReincarnationCoin += eq.level * 19000.0;
                        break;
                }
            });

            // 转生收益：每级转生币总加成 +10%
            const coinBonusLv = (player.reincarnationStats && player.reincarnationStats.reincarnationCoinBonus)
                ? (Number(player.reincarnationStats.reincarnationCoinBonus.level) || 0)
                : 0;
            totalReincarnationCoin *= (1 + coinBonusLv * 0.1);

            // 重置装备等级
            player.equipment.forEach(eq => {
                eq.level = 1 + player.reincarnationStats.equipmentLevelBonus.level * 200; // 转生属性加成
                eq.gps = equipmentTypes[eq.rarity].gps * (1 + player.reincarnationStats.gpsBonus.level); // 每级装备属性乘以100%
                eq.click = equipmentTypes[eq.rarity].click * (1 + player.reincarnationStats.gpsBonus.level); // 每级装备属性乘以100%
            });

            // 清空货币
            player.gold = 0;
            player.diamond = 0;
            player.titanium = 0;
            player.starstone = 0;
            player.cosmicstone = 0;
            player.superstone = 0;
            player.otherworldstone = 0;
            player.xingjiestone = 0;
            player.hundunstone = 0;
            player.lingtone = 0;
            player.huangtone = 0;
            player.mingtone = 0;
            player.xutong = 0;
            player.shitone = 0;
            player.weitone = 0;
            player.yongtone = 0;
            player.wujitone = 0;
            player.daotone = 0;

            // 重置材料宝箱购买成本
            player.materialChestCost = 1;
            player.techniqueChestCost = 1;

            if (typeof resetTsrEternalRuneBonuses === 'function') {
                resetTsrEternalRuneBonuses();
            }

            // 增加转生币
            player.reincarnationCoin += totalReincarnationCoin;
            player.reincarnationCount++;
            player.autoBuyTechniqueChest = true;
            // 修改属性点计算逻辑
            player.attributes.totalPoints = player.reincarnationCount * 1 + player.battle.maxStage * 10 + player.tower.currentFloor * 1;
            player.attributes.remainingPoints += 1; // 每次转生增加1点剩余属性点

            // 检查转生成就
            checkReincarnationAchievements();
       
            logAction(`转生成功！获得转生币: ${totalReincarnationCoin.toFixed(4)}`, 'success');
            updateDisplay();
            updateTechniqueBonuses(); // 转生后更新功法加成
            updatePlayerBattleStats(); // 更新战斗属性
        }
    });
}
        // 检查转生成就
        function checkReincarnationAchievements() {
            const achievements = [
                { count: 10, key: 'reincarnation_10' },
                { count: 100, key: 'reincarnation_100' },
                { count: 1000, key: 'reincarnation_1000' },
                { count: 10000, key: 'reincarnation_10000' }
            ];

            achievements.forEach(({ count, key }) => {
                if (player.reincarnationCount >= count && !player.achievements[key]) {
                    player.achievements[key] = true;
                    const reward = achievementRewards[key];
                    if (reward) {
                        player.gpsMultiplier += reward.gpsMultiplier;
                        logAction(`成就达成：${reward.description}，GPS奖励 +${reward.gpsMultiplier * 100}%`, 'success');
                        updateAchievementsDisplay();
                    }
                }
            });
        }
      function showActivationCodeDialog() {
        if (player.battle.maxStage < 2) {
        alert("需要打怪模式达到第3层才能开启激活码兑换！");
        return;
    }
    document.getElementById("activationCodeDialog").style.display = "block";
    document.getElementById("activationCodeOverlay").style.display = "block";
    document.getElementById("activationCodeInput").focus();
}

function cancelActivationCode() {
    document.getElementById("activationCodeDialog").style.display = "none";
    document.getElementById("activationCodeOverlay").style.display = "none";
}

function confirmActivationCode() {
      if (player.battle.maxStage < 2) {
        alert("需要打怪模式达到第3层才能开启激活码兑换！");
        return;
    }
    const code = document.getElementById("activationCodeInput").value.trim().toUpperCase();
    const usedCodes = player.usedActivationCodes || [];
    
    if (!code) {
        logAction("请输入激活码", "error");
        return;
    }
    
    if (usedCodes.includes(code)) {
        logAction("该激活码已使用过", "error");
        cancelActivationCode();
        return;
    }
    
    let rewardMsg = "";
    let success = false;
    
    switch(code) {
        case "VIP666":
            player.reincarnationCoin += 1000;
            rewardMsg = "获得1000转生币";
            success = true;
            break;
        case "VIP777":
            // 假设洗炼石字段为refineStone，若实际字段不同请修改
            player.items.refineStone = (player.items.refineStone || 0) + 10;
            rewardMsg = "获得10个洗炼石";
            success = true;
            break;
        case "VIP888":
            player.items.advancedGem = (player.items.advancedGem || 0) + 3;
            rewardMsg = "获得3个高级宝石";
            success = true;
            break;
        case "XINGBI":
            // 领取星币兑换码时，星币总量不超过上限
            addStarCoins(300);
            rewardMsg = "获得300星币";
            success = true;
            break;
        case "YUYU":
            addCurrency('cosmicstone', 2);
            rewardMsg = "获得2个宇宙石";
            success = true;
            break;
       case "BANLV":
            player.items.companionKey += 10; 
            player.items.rose += 520;
            rewardMsg = "获得10个伴侣钥匙和520朵玫瑰花";
            success = true;
            break;  
          case "BANLV1":
            player.items.companionKey += 30; 
            player.items.rose += 520;
            rewardMsg = "获得30个伴侣钥匙和520朵玫瑰花";
            success = true;
            break;     
          case "XISUIDAN":
            player.items.rebornDan = (player.items.rebornDan || 0) + 10;
            rewardMsg = "获得10个洗髓丹";
            success = true;
            break;
           case "XIUXIAN":
            player.items.rootDetector = (player.items.rootDetector || 0) + 5;
            rewardMsg = "获得5个灵根检测器";
            success = true;
            break;
            case "XIUXIAN1":
            player.items.bloodlineDetector = (player.items.bloodlineDetector || 0) + 5;
            rewardMsg = "获得5个血脉检测剂";
            success = true;
            break;
           case "WOYAOCHE":
            const models = ["Portofino", "Roma", "SF90"];
            const randomModel = models[Math.floor(Math.random() * models.length)];
            const newVehicle = {
                id: 'vehicle_' + Date.now(),
                brand: "法拉利",
                model: randomModel,
                rarity: 15, // 普通稀有度
                parkTime: 0,
                income: 0
            };
            
            if (!player.parking) initParkingData();
            if (tryPushParkingVehicle(newVehicle)) {
                rewardMsg = `获得一辆法拉利${randomModel}汽车`;
                success = true;
            } else {
                rewardMsg = `车库已满（${SECONDARY_INVENTORY_MAX}），无法获得车辆`;
            }
            break;
      case "WOYAOBYFANG":
            // 兑换别墅
            const villaType = houseTypes.find(h => h.id === 5); // 别墅的id为5
            if (!villaType) {
                logAction("无效的房屋类型", "error");
                return false;
            }
            
            // 创建别墅实例
            const newHouse = {
                id: 'house_' + Date.now(),
                type: villaType.id,
                name: villaType.name,
                rarity: villaType.rarity,
                baseIncome: villaType.income,
                rentTime: 0,
                isRented: false
            };
            
            if (!player.houses) initHouseData();
            if (tryPushOwnedHouse(newHouse)) {
                rewardMsg = "成功兑换激活码  获得别墅！";
                success = true;
            } else {
                rewardMsg = "房屋库已满（" + SECONDARY_INVENTORY_MAX + "），无法获得别墅";
            }
            break;
        case "SHENQI":
            player.items.yuzhou4 = (player.items.yuzhou4 || 0) + 200;
            rewardMsg = "获得200个神器碎片发票";
            success = true;
            break;       
       case "YUZHOU":
            player.items.yuzhou3 = (player.items.yuzhou3 || 0) + 200;
            rewardMsg = "获得200个宇宙晶体发票";
            success = true;
            break;    
       case "ANBAO":
            player.items.yuzhou2 = (player.items.yuzhou2 || 0) + 1000;
            rewardMsg = "获得1000个暗物质发票";
            success = true;
            break; 
       case "MIMI":
            player.items.fuben1 = (player.items.fuben1 || 0) + 10;
            rewardMsg = "获得10个副本令牌";
            success = true;
            break; 
       case "FUBEN":
            player.items.fuben2 = (player.items.fuben2 || 0) + 10;
            rewardMsg = "获得10个秘境钥匙";
            success = true;
            break; 
       case "YUANDAN":
            player.items.baitCount = (player.items.baitCount || 0) + 200;
            rewardMsg = "获得200个鱼饵";
            success = true;
            break; 
       case "YUANDAN1":
            player.items.vipPower = (player.items.vipPower || 0) + 500;
            rewardMsg = "500个VIP能力值";
            success = true;
            break; 
       case "YUANDAN2":
            player.items.companionKey = (player.items.companionKey || 0) + 100;
            rewardMsg = "获得100个伴侣钥匙";
            success = true;
            break; 
        case "YUER":
            player.items.baitCount = (player.items.baitCount || 0) + 20;
            rewardMsg = "获得20个鱼饵";
            success = true;
            break;
        case "VIP666666":
        player.items.vipPower = (player.items.vipPower || 0) + 10;
        rewardMsg = "获得10个VIP能力值";
        success = true;
        break;
        case "ZHIYESHU1":
        player.items.zhiye1 = (player.items.zhiye1 || 0) + 10;
        rewardMsg = "获得10个职业转换书";
        success = true;
        break;
        case "DAGUAIWU1":
        player.items.fuben1 = (player.items.fuben1 || 0) + 3;
        rewardMsg = "获得3个副本令牌";
        success = true;
        break;
            case "HUOBAN1":
        player.items.roseq = (player.items.roseq || 0) + 20;
        rewardMsg = "获得20个香囊";
        success = true;
        break;   
       case "VIP666777":
            // 添加"公测玩家"称号
            if (!player.titles.unlocked.includes("公测玩家")) {
                player.titles.unlocked.push("公测玩家");
                rewardMsg = "获得称号：公测玩家";
                success = true;
                // 自动选择新称号
                player.titles.current = "公测玩家";
                updateDisplay();
            } else {
                logAction("您已拥有此称号", "info");
            }
            break;
case "LINGQI1":
  
    if (player.magicTools.inventory.includes("moonlight_pearlu")) {
        logAction("已拥有落宝金钱法宝，无法重复兑换", "error");
        success = false;
    } else {
        // 添加法宝到库存
        player.magicTools.inventory.push("moonlight_pearlu");
        rewardMsg = "获得法宝：落宝金钱";
        success = true;
        // 可选：自动装备该法宝
        player.magicTools.equipped = "moonlight_pearlu";
    }
    break;
  case "DANIANSHOU":
    
    if (player.magicTools.inventory.includes("yin_yang_mirrorbaab")) {
        logAction("已拥有驱年爆竹法宝，无法重复兑换", "error");
        success = false;
    } else {
        // 添加法宝到库存
        player.magicTools.inventory.push("yin_yang_mirrorbaab");
        rewardMsg = "获得法宝：驱年爆竹";
        success = true;
        // 可选：自动装备该法宝
        player.magicTools.equipped = "yin_yang_mirrorbaab";
    }
    break;
   case "XIUXIANA":
            player.items.rootDetector = (player.items.rootDetector || 0) + 17;
            rewardMsg = "获得17个灵根检测器";
            success = true;
            break;
            case "XIUXIANB":
            player.items.bloodlineDetector = (player.items.bloodlineDetector || 0) + 17;
            rewardMsg = "获得17个血脉检测剂";
            success = true;
            break;
       case "XIANNIANHONGBAO":
            player.investmentGame.userData.availableFunds += 1000000;
            rewardMsg = "获得1000000元资金";
            success = true;
            break;
             case "SHENYUAN2":
            player.abyssTower.exclusiveCurrency += 1000;
            rewardMsg = "获得1000深渊币";
            success = true;
            break;
        case "XIUXIANFUBEN":
        player.nianBeast.dungeonToken = (player.nianBeast.dungeonToken || 0) + 10;
        rewardMsg = "获得10个修仙令牌";
        success = true;
        break;
        case "BAOZANG1":
        player.items.primaryGemq = (player.items.primaryGemq || 0) + 20;
        rewardMsg = "获得20个宝藏金币";
        success = true;
        break;
        case "BAOZANG2":
        player.items.fuben1 = (player.items.fuben1 || 0) + 20;
        rewardMsg = "获得20个副本令牌";
        success = true;
        break;
        case "BAOZANG6":
        player.items.danyao5 = (player.items.danyao5 || 0) + 1;
        rewardMsg = "获得1个混元道果丹";
        success = true;
        break;
        case "BAOZANG7":
        player.items.advanceStone = (player.items.advanceStone || 0) + 50;
        rewardMsg = "获得50个进阶神石";
        success = true;
        break;
        case "BAOZANG8":
        player.items.rootDetector = (player.items.rootDetector || 0) + 50;
        rewardMsg = "获得50个灵根检测器 ";
        success = true;
        break;
        case "BAOZANG9":
        player.items.bloodlineDetector = (player.items.bloodlineDetector || 0) + 50;
        rewardMsg = "获得50个血脉检测剂 ";
        success = true;
        break;
        case "BAOZANG11":
        player.items.baitCount = (player.items.baitCount || 0) + 500;
        rewardMsg = "获得500个鱼饵 ";
        success = true;
        break;
        case "BAOZANG4":
        player.items.companionKey = (player.items.companionKey || 0) + 200;
        rewardMsg = "获得200个伴侣钥匙";
        success = true;
        break;
        case "BAOZANG5":
         player.investmentGame.userData.availableFunds += 2000000;
            rewardMsg = "获得2000000元资金";
            success = true;
            break;
        case "BAOZANG3":
        player.nianBeast.dungeonToken = (player.nianBeast.dungeonToken || 0) + 20;
        rewardMsg = "获得20个修仙令牌";
        success = true;
        break;
        case "SHENYUAN1":
        player.items.fubeng1 = (player.items.fubeng1 || 0) + 20;
        rewardMsg = "获得20个深渊令牌";
        success = true;
        break;
        case "补偿宝石损失":
        player.items.divineGem = (player.items.divineGem || 0) + 1;
        rewardMsg = "获得1个神级宝石";
        success = true;
        break;
        default:
            logAction("无效的激活码", "error");
            return;
    }
    
    if (success) {
        // 记录已使用的激活码
        usedCodes.push(code);
        player.usedActivationCodes = usedCodes;
        
        logAction(`激活码兑换成功：${rewardMsg}`, "success");
        updateDisplay(); // 更新界面显示
        cancelActivationCode();
         saveGame();
      setTimeout(() => {
                location.reload(true);
            }, 1000);
    }
}
// 添加VIP等级计算函数
function calculateVipLevel() {
    let currentLevel = 1;
    const { power } = player.vip;
    
    for (let i = vipConfig.length - 1; i >= 0; i--) {
        if (power >= vipConfig[i].requiredPower) {
            currentLevel = vipConfig[i].level;
            break;
        }
    }
    
    return currentLevel;
}

// 获取当前VIP等级的加成
function getVipBonus() {
    const level = player.vip.level;
    const config = vipConfig.find(c => c.level === level) || vipConfig[0];
    return config.bonus;
}

// 更新VIP显示（loadSave 时 DOM 可能尚未就绪，需判空避免报错）
function updateVipDisplay() {
    if (!player.vip) return;
    const { level, power } = player.vip;
    const currentConfig = vipConfig.find(c => c.level === level) || vipConfig[0];
    const nextConfig = vipConfig.find(c => c.level === level + 1);
    
    var elLevel = document.getElementById('vipLevel');
    if (elLevel) elLevel.textContent = level;
    
    let progressPercent = 0;
    let progressText = '';
    
    if (nextConfig) {
        const progress = power - currentConfig.requiredPower;
        const total = nextConfig.requiredPower - currentConfig.requiredPower;
        progressPercent = Math.min(100, (progress / total) * 100);
        progressText = `${progress}/${total}`;
    } else {
        progressPercent = 100;
        progressText = '已达最高级';
    }
    
    var elBar = document.getElementById('vipProgressBar');
    if (elBar) elBar.style.width = progressPercent + '%';
    var elText = document.getElementById('vipProgressText');
    if (elText) elText.textContent = progressText;
    
    var elVipDisplay = document.querySelector('.vip-level-display');
    if (elVipDisplay) {
        var hue = (level - 1) * (360 / 20);
        elVipDisplay.style.background = 'linear-gradient(to right, hsl(' + hue + ', 100%, 50%), hsl(' + ((hue + 60) % 360) + ', 100%, 50%))';
        elVipDisplay.style.webkitBackgroundClip = 'text';
    }
}
function useAllVipPower() {
    if (player.items.vipPower && player.items.vipPower > 0) {
        const useCount = player.items.vipPower;
        player.items.vipPower = 0;
        player.vip.power += useCount;
        
        const newLevel = calculateVipLevel();
        if (newLevel > player.vip.level) {
            const oldLevel = player.vip.level;
            player.vip.level = newLevel;
            logAction(`VIP等级提升至${newLevel}级！全属性装备提升${vipConfig[newLevel - 1].bonus * 100}%`, 'success');
            
            // 刷新所有装备属性
            const newVipBonus = 1 + getVipBonus();
            player.equipment.forEach(eq => {
                eq.gps = safeNumber(eq.gps / (1 + getVipBonusByLevel(oldLevel)) * newVipBonus); 
                eq.click = safeNumber(eq.click / (1 + getVipBonusByLevel(oldLevel)) * newVipBonus);
            });
        }
        
        updateVipDisplay();
        updateDisplay();
        logAction(`使用了${useCount}个VIP能力值`, "info");
    } else {
        logAction("VIP能力值不足！", "error");
    }
}

// 辅助函数：根据等级获取旧的VIP加成（需要实现）
function getVipBonusByLevel(level) {
    const config = vipConfig.find(c => c.level === level) || vipConfig[0];
    return config.bonus;
}
// 计算总GPS时，实时应用当前VIP加成
function calculateTotalGPS() {
    let totalGps = 0;
    player.equipment.forEach(eq => {
        totalGps += eq.gps * (1 + getVipBonus()); // 实时获取最新VIP加成
    });
    // 其他加成（如成就、转生等）
    var familyMult = (typeof window.isGoldGameFamilyBuffActive === 'function' && window.isGoldGameFamilyBuffActive('gps')) ? 10000 : 1;
    return totalGps * familyMult;
}
// 添加设置界面切换函数
function toggleAutoBuySettings() {
    const settings = document.getElementById('autoBuySettings');
    if (settings.style.display === 'none') {
        settings.style.display = 'block';
        // 将当前设置的值填入输入框
        document.getElementById('techniqueMaxCost').value = player.autoBuyTechniqueMaxCost;
    } else {
        settings.style.display = 'none';
    }
}

function _pageBgCssUrl(href) {
    return 'url("' + String(href).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '")';
}
var DEFAULT_UI_TEXT_HEX = '#1E293B';
function normalizeUiTextHex(s) {
    s = String(s || '').trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s.toUpperCase();
    if (/^[0-9A-Fa-f]{6}$/.test(s)) return ('#' + s).toUpperCase();
    return '';
}
function syncPageUiTextColorControls(hex) {
    var h = normalizeUiTextHex(hex) || DEFAULT_UI_TEXT_HEX;
    var pc = document.getElementById('pageUiTextColorPicker');
    var ph = document.getElementById('pageUiTextColorHex');
    if (pc) pc.value = h.toLowerCase();
    if (ph) ph.value = h.toUpperCase();
}
function applyUiTextColorFromStorage() {
    try {
        var c = normalizeUiTextHex(localStorage.getItem('goldGameUiTextColor'));
        if (c) document.documentElement.style.setProperty('--page-text-custom', c);
        else document.documentElement.style.removeProperty('--page-text-custom');
    } catch (e) {}
}
function onPageUiTextColorInput(val) {
    var c = normalizeUiTextHex(val);
    if (c) try { localStorage.setItem('goldGameUiTextColor', c); } catch (e) {}
    else try { localStorage.removeItem('goldGameUiTextColor'); } catch (e) {}
    if (document.documentElement.classList.contains('gold-game-has-page-bg')) {
        if (c) document.documentElement.style.setProperty('--page-text-custom', c);
        else document.documentElement.style.removeProperty('--page-text-custom');
    }
    syncPageUiTextColorControls(c || DEFAULT_UI_TEXT_HEX);
}
function onPageUiTextColorFromPicker(val) {
    onPageUiTextColorInput(val);
}
function onPageUiTextColorFromHexInput(val) {
    var c = normalizeUiTextHex(val);
    if (c) onPageUiTextColorInput(c);
    else if (typeof logAction === 'function') logAction('请输入有效 #RRGGBB 颜色，例如 #1E293B', 'error');
}
function pickUiTextPreset(hex) {
    onPageUiTextColorInput(hex);
}
function resetUiTextColorToDefault() {
    try { localStorage.removeItem('goldGameUiTextColor'); } catch (e) {}
    document.documentElement.style.removeProperty('--page-text-custom');
    syncPageUiTextColorControls(DEFAULT_UI_TEXT_HEX);
    if (typeof logAction === 'function') logAction('已恢复默认字色', 'success');
}
function panelOpacityPctToAlpha(pct) {
    var p = parseInt(pct, 10);
    if (!isFinite(p)) p = 74;
    p = Math.min(100, Math.max(1, p));
    return (p - 1) / 99;
}
function applyPanelOpacityFromStorage() {
    try {
        var op = localStorage.getItem('goldGamePanelOpacity');
        document.documentElement.style.setProperty('--panel-alpha', String(panelOpacityPctToAlpha(op != null && op !== '' ? op : '74')));
    } catch (e) {
        document.documentElement.style.setProperty('--panel-alpha', String(panelOpacityPctToAlpha(74)));
    }
}
function onPagePanelOpacityInput(val) {
    var p = parseInt(val, 10);
    if (!isFinite(p)) p = 74;
    p = Math.min(100, Math.max(1, p));
    try { localStorage.setItem('goldGamePanelOpacity', String(p)); } catch (e) {}
    document.documentElement.style.setProperty('--panel-alpha', String(panelOpacityPctToAlpha(p)));
    var lab = document.getElementById('pagePanelOpacityLabel');
    if (lab) lab.textContent = p + '%';
    var rng = document.getElementById('pagePanelOpacityRange');
    if (rng && String(rng.value) !== String(p)) rng.value = String(p);
}
function applyPageBackgroundCss(url) {
    if (url) {
        document.documentElement.style.setProperty('--page-bg-image', _pageBgCssUrl(url));
        document.documentElement.classList.add('gold-game-has-page-bg');
        applyPanelOpacityFromStorage();
        applyUiTextColorFromStorage();
    } else {
        document.documentElement.style.setProperty('--page-bg-image', 'none');
        document.documentElement.classList.remove('gold-game-has-page-bg');
        try { document.documentElement.style.removeProperty('--panel-alpha'); } catch (e) {}
        try { document.documentElement.style.removeProperty('--page-text-custom'); } catch (e) {}
    }
}
function saveAndApplyPageBackground(url) {
    try {
        if (url) localStorage.setItem('goldGameMainBackgroundUrl', url);
        else localStorage.removeItem('goldGameMainBackgroundUrl');
    } catch (e) {
        if (typeof logAction === 'function') logAction('保存背景失败（可能超出浏览器存储限额），请换较小的图片或使用图片链接。', 'error');
        else alert('保存背景失败（可能超出浏览器存储限额），请换较小的图片或使用图片链接。');
        return;
    }
    applyPageBackgroundCss(url || '');
}
function togglePageBackgroundSettings() {
    var el = document.getElementById('pageBackgroundSettings');
    if (!el) return;
    var on = el.style.display === 'none' || el.style.display === '';
    el.style.display = on ? 'block' : 'none';
    if (on) {
        var inp = document.getElementById('pageBackgroundUrlInput');
        if (inp) {
            inp.value = '';
            inp.placeholder = 'https://... 或 data:image/...';
            try {
                var cur = localStorage.getItem('goldGameMainBackgroundUrl') || '';
                if (cur.indexOf('data:') === 0) inp.placeholder = '当前为本地保存的动图/图片；可重新上传或填链接覆盖';
                else if (cur) inp.value = cur;
            } catch (e) {}
        }
        var fin = document.getElementById('pageBackgroundFileInput');
        if (fin) fin.value = '';
        var opR = document.getElementById('pagePanelOpacityRange');
        var opL = document.getElementById('pagePanelOpacityLabel');
        try {
            var op = localStorage.getItem('goldGamePanelOpacity');
            var p = parseInt(op != null && op !== '' ? op : '74', 10);
            if (!isFinite(p)) p = 74;
            p = Math.min(100, Math.max(1, p));
            if (opR) opR.value = String(p);
            if (opL) opL.textContent = p + '%';
        } catch (e) {
            if (opR) opR.value = '74';
            if (opL) opL.textContent = '74%';
        }
        try {
            var tc = localStorage.getItem('goldGameUiTextColor');
            syncPageUiTextColorControls(normalizeUiTextHex(tc) || DEFAULT_UI_TEXT_HEX);
        } catch (e2) {
            syncPageUiTextColorControls(DEFAULT_UI_TEXT_HEX);
        }
    }
}
function applyPageBackgroundFromFile(input) {
    var file = input && input.files && input.files[0];
    if (!file) return;
    if (!/^image\//i.test(file.type)) {
        if (typeof logAction === 'function') logAction('请选择图片文件', 'error');
        return;
    }
    var reader = new FileReader();
    reader.onload = function() {
        saveAndApplyPageBackground(reader.result);
        if (typeof logAction === 'function') logAction('已更换主页背景图', 'success');
    };
    reader.readAsDataURL(file);
}
function applyPageBackgroundFromUrlInput() {
    var raw = (document.getElementById('pageBackgroundUrlInput') && document.getElementById('pageBackgroundUrlInput').value || '').trim();
    if (!raw) {
        if (typeof logAction === 'function') logAction('请输入图片地址', 'error');
        return;
    }
    saveAndApplyPageBackground(raw);
    if (typeof logAction === 'function') logAction('已应用主页背景链接', 'success');
}
function resetPageBackground() {
    try { localStorage.removeItem('goldGamePanelOpacity'); } catch (e) {}
    try { localStorage.removeItem('goldGameUiTextColor'); } catch (e) {}
    saveAndApplyPageBackground('');
    var inp = document.getElementById('pageBackgroundUrlInput');
    if (inp) inp.value = '';
    var fin = document.getElementById('pageBackgroundFileInput');
    if (fin) fin.value = '';
    var opR = document.getElementById('pagePanelOpacityRange');
    var opL = document.getElementById('pagePanelOpacityLabel');
    if (opR) opR.value = '74';
    if (opL) opL.textContent = '74%';
    syncPageUiTextColorControls(DEFAULT_UI_TEXT_HEX);
    if (typeof logAction === 'function') logAction('已还原默认主页背景', 'success');
}

// 添加设置价格上限函数
function setTechniqueMaxCost() {
    const input = document.getElementById('techniqueMaxCost');
    const value = parseFloat(input.value);
    
    if (!isNaN(value) && value > 0) {
        player.autoBuyTechniqueMaxCost = value;
        logAction(`已设置功法秘籍宝箱自动购买价格上限为: ${formatNumber(value)}`, 'success');
    } else {
        logAction("请输入有效的价格上限", "error");
    }
}

        // 加载存档
       function loadSave(saveOverride) {
    window._goldGameSaveLoadedOk = false;
    var _tradingOfflineMs = 0; // 用于末尾统一执行跑商离线结算，避免被中间逻辑跳过
    // 若本会话已跑过离线结算则不再覆盖，避免重复结算
    if (!window._tradingOfflineRunThisSession) window._tradingOfflineMs = 0;
    try {
        let save = (saveOverride && typeof saveOverride === 'object' && !Array.isArray(saveOverride))
            ? saveOverride
            : (window._goldGamePendingCloudSave && typeof window._goldGamePendingCloudSave === 'object'
                ? (function () { var s = window._goldGamePendingCloudSave; window._goldGamePendingCloudSave = null; return s; })()
                : null)
            || (function () {
                try {
                    if (typeof window.readGoldGameSaveRawFromStorage === 'function') {
                        var rawScoped = window.readGoldGameSaveRawFromStorage();
                        if (rawScoped) return JSON.parse(rawScoped);
                    }
                    return JSON.parse(localStorage.getItem('goldGameSave'));
                } catch (eRead) { return null; }
            })();
        window._goldGameSaveLoadBlocked = false;
        if (save) {
            // 防伪：存档带 accountId 时，必须与当前登录账号一致，否则禁止使用该存档（但不得删除本地档）
            var currentAccountId = '';
            if (typeof window.goldGameResolveAccountId === 'function') {
                currentAccountId = String(window.goldGameResolveAccountId() || '').trim();
            } else if (typeof window.getGoldGameAccountId === 'function') {
                currentAccountId = String(window.getGoldGameAccountId() || '').trim();
            } else {
                try { currentAccountId = String(localStorage.getItem('goldGameAccountId') || '').trim(); } catch (eAid) {}
            }
            var hasAuthToken = false;
            try {
                hasAuthToken = !!(typeof window.getGoldGameAuthToken === 'function' && window.getGoldGameAuthToken());
            } catch (eTok) {}
            if (save.accountId) {
                var saveAid = String(save.accountId).trim();
                if (!currentAccountId && hasAuthToken) {
                    currentAccountId = saveAid;
                    if (typeof window.setGoldGameAccountId === 'function') window.setGoldGameAccountId(saveAid);
                    else {
                        try { localStorage.setItem('goldGameAccountId', saveAid); } catch (eSetAid) {}
                    }
                }
                // 未登录：允许直接使用本机档（含曾绑定账号的本地副本），不再拦截
                if (hasAuthToken && saveAid !== currentAccountId) {
                    var scopedRaw = null;
                    if (typeof window.readGoldGameSaveRawFromStorage === 'function') {
                        scopedRaw = window.readGoldGameSaveRawFromStorage(currentAccountId);
                    }
                    if (scopedRaw) {
                        try {
                            save = JSON.parse(scopedRaw);
                            saveAid = save && save.accountId != null ? String(save.accountId).trim() : saveAid;
                        } catch (eRescope) {}
                    }
                    if (!save || saveAid !== currentAccountId) {
                        window._goldGameSaveLoadBlocked = true;
                        if (typeof logAction === 'function') logAction('存档与当前登录账号不匹配，请切换正确账号（本地档已保留）', 'error');
                        return;
                    }
                }
            }
            // 跑商离线：用「第一次读档」的 lastUpdate 立即固定离线时长，避免后面有人写回存档导致第二次 loadSave 读到 lastUpdate=现在 从而变成 0
            if (save.lastUpdate != null && !window._tradingOfflineRunThisSession) {
                var offFirst = Date.now() - save.lastUpdate;
                if (offFirst > 0) {
                    var offCapped = Math.min(offFirst, 24 * 3600 * 1000);
                    if (window._tradingOfflineMsFromSave == null || window._tradingOfflineMsFromSave === 0)
                        window._tradingOfflineMsFromSave = offCapped;
                }
            }
            // 仅当从未记录过「离开时间」时，用存档时间作为回退（供跑商离线结算用）；有记录则不覆盖，避免把离线时长算成 0
            if (save.lastUpdate != null) {
                var cur = parseInt(localStorage.getItem('goldGameLastUnload') || '0', 10);
                if (cur === 0) localStorage.setItem('goldGameLastUnload', String(save.lastUpdate));
            }
            if (save.lastUpdate != null && !window._tradingOfflineRunThisSession) {
                var off = Date.now() - save.lastUpdate;
                if (off > 0) {
                    _tradingOfflineMs = Math.min(off, 24 * 3600 * 1000);
                    window._tradingOfflineMs = _tradingOfflineMs;
                    window._tradingOfflineMsSnapshot = _tradingOfflineMs;
                }
            }
            if (save.gameVersion && isCurrentVersionOlderThan(save.gameVersion)) {
                showVersionError(save.gameVersion);
                return;
            }
            if (save.lastUpdate && save.lastUpdate > Date.now()) {
                throw new Error("检测到时间回退，强制重置游戏");
            }
            // 读档会整体替换 player；须先注销仍在运行的世界地图定时器，否则会泄漏多个后台战斗 interval
            if (typeof stopAllWorldMapBattles === 'function') {
                stopAllWorldMapBattles();
            } else if (typeof detachWorldMapAutoBattleTimersFromPlayer === 'function') {
                detachWorldMapAutoBattleTimersFromPlayer(player);
            }
            // 时光秘境秒表同理：旧 player 被替换后孤儿 interval 会扣到新局上，表现为「刚进就时间耗尽」
            if (typeof stopTsrTimer === 'function') {
                try { stopTsrTimer(); } catch (eTsrStop) {}
            } else if (window._tsrIntervalId != null) {
                try {
                    if (typeof unregisterInterval === 'function') unregisterInterval(window._tsrIntervalId);
                    else clearInterval(window._tsrIntervalId);
                } catch (eTsrId) {}
                window._tsrIntervalId = null;
            }
            player = migrateSaveData(save);
            window._goldGameSaveLoadedOk = true;
            if (currentAccountId && typeof window.writeGoldGameSaveToLocal === 'function') {
                try { window.writeGoldGameSaveToLocal(save, currentAccountId); } catch (eScopedWrite) {}
            } else if (!hasAuthToken && typeof window.writeGoldGameSaveToLocal === 'function') {
                try { window.writeGoldGameSaveToLocal(player); } catch (eOfflineWrite) {}
            }
            if (currentAccountId && typeof window.markGoldGameLocalSaveReady === 'function') {
                window.markGoldGameLocalSaveReady(currentAccountId);
            }
            if (window._goldGameCloudLoadActive && typeof window.updateGoldGameCloudLoadProgress === 'function') {
                window.updateGoldGameCloudLoadProgress('正在迁移并校验存档数据…', 80, 'parse');
            }
            normalizeMainCurrencies();
            player.equipment = validateEquipmentList(save.equipment);
            // ========== 离线收益：尽早执行，避免后续初始化抛错导致被跳过 ==========
            (function() {
                const currentTime = Date.now();
                const maxOfflineTime = 86400 * 1000;
                const lastUpdateTime = (save.lastUpdate != null ? save.lastUpdate : player.lastUpdate) || currentTime;
                const offlineTime = Math.min(currentTime - lastUpdateTime, maxOfflineTime);
                // 与其它离线系统一致：把离线时长交给跑商离线结算用，避免跑商用错来源导致不结算
                if (offlineTime > 0 && !window._tradingOfflineRunThisSession) {
                    window._tradingOfflineMsFromSave = Math.min(offlineTime, maxOfflineTime);
                }
                const offlineSeconds = Math.floor(offlineTime / 1000);
                if (offlineTime <= 1000) return;
                const offlineMinutes = Math.floor(offlineSeconds / 60);
                if (!Array.isArray(player.equipment)) return;
                player.equipment.forEach(eq => {
                    eq.level = (eq.level || 1) + offlineMinutes * 1000;
                    var config = typeof equipmentTypes !== 'undefined' && equipmentTypes[eq.rarity] ? equipmentTypes[eq.rarity] : (equipmentTypes && equipmentTypes.common) || { gps: 0, click: 0, growthRate: 0.01 };
                    var vipBonus = 1 + (typeof getVipBonus === 'function' ? getVipBonus() : 0);
                    var gpsBonusLv = (player.reincarnationStats && player.reincarnationStats.gpsBonus && player.reincarnationStats.gpsBonus.level) ? player.reincarnationStats.gpsBonus.level : 0;
                    eq.gps = typeof safeNumber === 'function' ? safeNumber(config.gps * (1 + (config.growthRate * eq.level * 0.01)) * (1 + gpsBonusLv) * vipBonus, 0) : (config.gps * (1 + (config.growthRate * eq.level * 0.01)) * (1 + gpsBonusLv) * vipBonus);
                    eq.click = typeof safeNumber === 'function' ? safeNumber(config.click * (1 + (config.growthRate * eq.level * 0.01)) * (1 + gpsBonusLv) * vipBonus, 0) : (config.click * (1 + (config.growthRate * eq.level * 0.01)) * (1 + gpsBonusLv) * vipBonus);
                });
                var offlineGPS = 0;
                try { if (typeof getTotalGPS === 'function') offlineGPS = getTotalGPS(); } catch (err) { console.warn('离线 getTotalGPS 异常', err); }
                addGold(offlineSeconds * offlineGPS);
                if (typeof logAction === 'function' && typeof formatTime === 'function') {
                    var fm = (offlineSeconds * offlineGPS) >= 1e8 ? (offlineSeconds * offlineGPS).toExponential(3) : (offlineSeconds * offlineGPS).toLocaleString();
                    logAction('离线收益: +' + fm + '金币 (' + formatTime(offlineTime) + ')，装备每件+' + (offlineMinutes * 1000) + '级', 'offline-reward');
                }
                if (typeof simulateOfflineAutoBuy === 'function') simulateOfflineAutoBuy(offlineSeconds);
                if (player.traditionalLotteryNumbers && player.traditionalLotteryNumbers.length > 0 && typeof checkTraditionalLotteryResult === 'function') {
                    var lotteryIntervals = Math.floor(offlineTime / 1800000);
                    for (var i = 0; i < lotteryIntervals; i++) checkTraditionalLotteryResult();
                }
                if (typeof calculateOfflineCultivationExp === 'function') calculateOfflineCultivationExp(offlineMinutes);
                if (typeof calculateBankInterest === 'function') calculateBankInterest();
                if (player.landlord && player.landlord.seaFishing && (player.landlord.seaFishing.marketListings || []).length > 0 && typeof processSeaFishingMarketOffline === 'function') {
                    try {
                        if (typeof SEA_CUSTOMER_TYPES !== 'undefined' && SEA_CUSTOMER_TYPES && SEA_CUSTOMER_TYPES.length
                            && typeof SEA_CUSTOMER_MOODS !== 'undefined' && SEA_CUSTOMER_MOODS && SEA_CUSTOMER_MOODS.length) {
                            processSeaFishingMarketOffline(offlineTime);
                        } else {
                            window.__pendingSeaFishingMarketOfflineMs = Math.max(window.__pendingSeaFishingMarketOfflineMs || 0, offlineTime);
                        }
                    } catch (seaOffErr) {
                        console.warn('海钓鱼市离线结算跳过:', seaOffErr);
                        window.__pendingSeaFishingMarketOfflineMs = Math.max(window.__pendingSeaFishingMarketOfflineMs || 0, offlineTime);
                    }
                }
            })();
            // 银行利息：离线块在 offlineTime<=1s 时会提前 return，此处再结算一次，避免读档/切回标签后漏算
            if (typeof calculateBankInterest === 'function') calculateBankInterest();
            // 恢复星域探索舰队属性，避免重启后变回1级
            if (typeof restoreExplorationDataFromSave === 'function') restoreExplorationDataFromSave(save);
            if (save.battle && save.battle.autoSweepEnabled !== undefined) {
            player.battle.autoSweepEnabled = save.battle.autoSweepEnabled;
        }
         
        if (!player.battle) {
        player.battle = {
            playerHealth: 100 + player.reincarnationCount * 10,
            playerAttack: getTotalClickValue(),
            playerCritRate: 0.1 + player.attributes.critRate * 0.0005,
            playerCritDamage: 1.5 + player.attributes.critDamage * 0.005,
            currentZone: null,
            currentMonster: null,
            monsterResurrections: 0,
            autoBattle: false,
            autoBattleInterval: null
        };
    }
        if (save.autoBuyTechniqueMaxCost !== undefined) {
    player.autoBuyTechniqueMaxCost = save.autoBuyTechniqueMaxCost;
}
  

 if (!player.wings) {
        player.wings = {
            inventory: [],
            equipped: null,
            level: 1,
            upgradeCost: 5,
            autoDecompose: { enabled: false, belowRarity: '劣质级' }
        };
    }
          if (save.level) {
                player.level = {
                    current: save.level.current || 1,
                    exp: save.level.exp || 0,
                    nextLevelExp: save.level.nextLevelExp || 4630,
                    clickBonus: save.level.clickBonus || 0,
                    gpsBonus: save.level.gpsBonus || 0,
                    ascentionCount: save.level.ascentionCount || 0,
                    ascentionMultiplier: save.level.ascentionMultiplier || 1,
                     ascentionCounta: save.level.ascentionCounta || 0,
                    ascentionMultipliera: save.level.ascentionMultipliera || 1,
                    huaShengCount: save.level.huaShengCount || 0,
                    huaShengMultiplier: save.level.huaShengMultiplier || 1,
                    reincarnationEligibleHintForAca: save.level.reincarnationEligibleHintForAca != null ? save.level.reincarnationEligibleHintForAca : null
                };
                if (typeof getReincarnationLevelExpMultiplier === 'function') {
                    player.level.nextLevelExp = calculatePlayerNextLevelExp(player.level.current, player.level.ascentionCounta);
                }
            }
            if (typeof ensureLawPowerData === 'function') ensureLawPowerData();
            else {
                if (!player.lawPower || typeof player.lawPower !== 'object') {
                    player.lawPower = {
                        attack: 0,
                        health: 0,
                        critDamage: 0,
                        critRate: 0,
                        worldExp: 0,
                        cultivationExp: 0,
                        mysteryExp: 0
                    };
                }
                if (!player.items || typeof player.items !== 'object') player.items = {};
                if (!Number.isFinite(Number(player.items.lawPowerMaterial))) player.items.lawPowerMaterial = 0;
            }
            if (save.lawPower && typeof save.lawPower === 'object') {
                var _lawKeys = ['attack', 'health', 'critDamage', 'critRate', 'worldExp', 'cultivationExp', 'mysteryExp'];
                for (var _li = 0; _li < _lawKeys.length; _li++) {
                    var _lk = _lawKeys[_li];
                    var _lv = save.lawPower[_lk];
                    if (_lv != null && Number.isFinite(Number(_lv))) player.lawPower[_lk] = Math.max(0, Math.floor(Number(_lv)));
                }
            }
            if (save.items && save.items.lawPowerMaterial != null && Number.isFinite(Number(save.items.lawPowerMaterial))) {
                if (!player.items || typeof player.items !== 'object') player.items = {};
                player.items.lawPowerMaterial = Math.max(0, Math.floor(Number(save.items.lawPowerMaterial)));
            }

             // 确保加载通天塔数据
          if (!player.fishing) {
        player.fishing = {
            level: 1,
            currentExp: 0,
            fishCage: [],
            isFishing: false,
            isBiting: false,
            biteTimer: null,
            biteWindowTimer: null,
            biteTime: 0,
            bonus: 1
        };
    }
         
           
           if (typeof updateTowerUI === 'function') updateTowerUI();
          // 延后执行，避免在 classConfig 尚未定义时（如首次初始化）访问导致 TDZ 报错
          setTimeout(calculateOfflineMysteryExp, 0);
            // 重置并重新计算收藏物效果
            resetAllCollectionEffects();
         // 新增：加载存档后自动计算并更新VIP等级
            const actualVipLevel = calculateVipLevel();
            player.vip.level = actualVipLevel;
            updateVipDisplay(); // 立即更新VIP显示
               updateAutoConvertDisplay();
            // 确保自动购买状态被正确加载
            player.autoBuy = save.autoBuy || [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
            player.autoBuyMaterialChest = save.autoBuyMaterialChest || false;
           player.autoBuyTechniqueChest = save.autoBuyTechniqueChest || false;
            // 强制覆盖宠物的 multiplier，同时保留等级和其他数据；补全新宠物/货币/自动购买槽
            if (!player.pets || typeof player.pets !== 'object') player.pets = {};
            Object.keys(petConfig).forEach(petKey => {
                if (!player.pets[petKey]) {
                    player.pets[petKey] = { level: 0, cost: 1, multiplier: petConfig[petKey].multiplier };
                } else {
                    player.pets[petKey].multiplier = petConfig[petKey].multiplier;
                }
            });
            ['yongtone', 'wujitone', 'daotone'].forEach((c) => {
                if (player[c] == null) player[c] = 0;
            });
            if (!Array.isArray(player.autoBuy)) player.autoBuy = [];
            while (player.autoBuy.length < 18) player.autoBuy.push(false);
            if (!player.chestCounts || typeof player.chestCounts !== 'object') player.chestCounts = {};
            ['yeyu9', 'yeyu10', 'yeyu11'].forEach((k) => {
                if (player.chestCounts[k] == null) player.chestCounts[k] = 0;
            });
       
            // 初始化自动购买按钮状态
            player.autoBuy.forEach((enabled, index) => {
                const btn = document.getElementById(`autoChest${index + 1}`);
                if (btn) {
                    btn.textContent = `${['普通', '高级', '稀有', '史诗', '传说', '混沌', '终焉', '星辰', '银河', '星云', '鸿蒙', '太虚', '虚空', '时空', '未来', '永恒', '无极', '大道'][index]}宝箱自动购买：${enabled ? '开启' : '关闭'}`;
                }
            });
   

            // 初始化材料宝箱自动购买按钮状态
            const materialChestBtn = document.getElementById('autoMaterialChest');
            if (materialChestBtn) {
                materialChestBtn.textContent = `材料宝箱自动购买：${player.autoBuyMaterialChest ? '开启' : '关闭'}`;
            }
 const techniqueChestBtn = document.getElementById('autoTechniqueChest');
    if (techniqueChestBtn) {
        techniqueChestBtn.textContent = `功法秘籍宝箱自动购买：${player.autoBuyTechniqueChest ? '开启' : '关闭'}`;
    }
         // 在初始化自动购买按钮状态的地方添加
const speedBoostBtn = document.getElementById('autoBuySpeedBoost');
if (speedBoostBtn) {
    speedBoostBtn.textContent = `在线自动购买100倍数量：${player.autoBuySpeedBoost ? '开启' : '关闭'}`;
    var autoBuyLabel = document.getElementById('autoBuySpeedLabel');
    if (autoBuyLabel) autoBuyLabel.textContent = player.autoBuySpeedBoost ? '开' : '关';
}
      const onlineBoostBtn = document.getElementById('toggleOnlineBoost');
    if (onlineBoostBtn) {
        onlineBoostBtn.textContent = `在线金币加速100倍: ${player.onlineBoostEnabled ? '开启' : '关闭'}`;
    }
    var onlineBoostLabel = document.getElementById('onlineBoostLabel');
    if (onlineBoostLabel) onlineBoostLabel.textContent = player.onlineBoostEnabled ? '开' : '关';
    // 同步自动转生侧栏显示
    var autoReincEl = document.getElementById('autoReincarnationStatus');
    if (autoReincEl) autoReincEl.textContent = player.autoReincarnation ? '开启' : '关闭';
      
            // 确保日志不超过 20 条
            if (!Array.isArray(player.actionLogs)) player.actionLogs = [];
            if (!Array.isArray(player.lotteryResults)) player.lotteryResults = [];
            player.actionLogs = player.actionLogs.slice(0, 20);
            player.lotteryResults = player.lotteryResults.slice(0, 20);
            if (typeof updateLotteryResultsDisplay === 'function') updateLotteryResultsDisplay();

         
          // 分批初始化，避免阻塞主线程
          var initQueue = [
            function() { initSlotMachine(); },
            function() { initMountData(); },
            function() { initFarmData(); },
            function() { initFishingData(); },
            function() { updateSectNameDisplay(); },
            function() { initExplorationSystem(); },
            function() { initExpeditionData(); },
            function() { initTreasureMapSystem(); },
            function() { initHouseSystemOnLoad(); }
          ];
          var initIndex = 0;
          function processInitQueue() {
            if (initIndex < initQueue.length) {
              try {
                initQueue[initIndex]();
                initIndex++;
                if (initIndex < initQueue.length) {
                  requestAnimationFrame(processInitQueue);
                }
              } catch (e) {
                console.warn('初始化失败:', e);
                initIndex++;
                if (initIndex < initQueue.length) {
                  requestAnimationFrame(processInitQueue);
                }
              }
            }
          }
          requestAnimationFrame(processInitQueue);
          
          // 夜店/轮回装备配置在脚本后部定义，由 runDeferredLoadSaveInits 统一延迟初始化
          setTimeout(function() { if (typeof calculateOfflineExpeditionRewards === 'function') calculateOfflineExpeditionRewards(); }, 200);
   initHouseSystemOnLoad();
    // 离线跑商结算：传入存档以便用 save.lastUpdate 计算离线时长（避免被后面代码改掉）
    if (typeof initTradingData === 'function' && player.reincarnationCount >= 1000) {
        initTradingData(save);
    }
  
       if (save.tower) {
                player.tower = save.tower;
            }
            // 读档后清除过期的自动攻击状态（interval id 失效会导致异常；避免打开通天塔时 UI 不刷新）
            if (player.tower) {
                player.tower.isAutoAttacking = false;
                player.tower.autoAttackInterval = null;
                player.tower._lastUIUpdateTime = 0;
                if (player.tower.monster && player.tower.monster.modifiers && !Array.isArray(player.tower.monster.modifiers)) {
                    player.tower.monster.modifiers = [];
                }
            }
            // 读档后清除世界地图失效定时器；怪物已死但未结算时清空，避免自动攻击空转
            if (!player.worldMapBattle) {
                player.worldMapBattle = { autoBattle: false, autoBattleInterval: null };
            } else if (player.worldMapBattle.autoBattleInterval != null) {
                if (typeof unregisterInterval === 'function') unregisterInterval(player.worldMapBattle.autoBattleInterval);
                else try { clearInterval(player.worldMapBattle.autoBattleInterval); } catch (e) {}
                player.worldMapBattle.autoBattleInterval = null;
            }
            if (!player.backgroundBattle) {
                player.backgroundBattle = { active: false, interval: null };
            } else {
                if (player.backgroundBattle.interval != null) {
                    if (typeof unregisterInterval === 'function') unregisterInterval(player.backgroundBattle.interval);
                    else try { clearInterval(player.backgroundBattle.interval); } catch (e) {}
                }
                player.backgroundBattle.interval = null;
                player.backgroundBattle.active = false;
            }
            if (player.battle && player.battle.currentMonster && typeof bLteZero === 'function' && bLteZero(player.battle.currentMonster.health)) {
                player.battle.currentMonster = null;
            }
            if (player.battle) player.battle._worldMapDefeatBusy = false;
            try {
                if (typeof resumeWorldMapAutoBattleIfNeeded === 'function') resumeWorldMapAutoBattleIfNeeded();
            } catch (e) { /* loadSave 可能早于 dimensionConfig 定义，由脚本后部延迟恢复 */ }
        // 加载投资游戏数据
            if (save.investmentGame) {
                player.investmentGame = save.investmentGame;
                if (player.investmentGame) player.investmentGame.chartHistoryCache = {}; // 走势图缓存仅运行时用，不读档
                try {
                    if (typeof normalizeInvestmentGamePrices === 'function') normalizeInvestmentGamePrices();
                } catch (e) { /* 读档时部分投资常量/函数可能尚未初始化，由 setTimeout(300) 内 init 再规范化 */ }
            }
            
            // 初始化投资游戏（延迟执行，避免阻塞）
            setTimeout(function() {
                initInvestmentGameOnLoad();
                loadInvestmentGameData();
                try {
                    if (typeof normalizeInvestmentGamePrices === 'function') normalizeInvestmentGamePrices();
                } catch (e) { /* ignore */ }
            }, 300);
            // 初始化投资游戏数据
            if (!player.investmentGame) {
                setTimeout(function() {
                    initInvestmentGame();
                }, 400);
            } else {
                setTimeout(function() {
                    simulateOfflinePriceChanges();
                }, 500);
            }
          if (save.runes) {
                player.runes = save.runes;
                           }
          
    if (save.traditionalLotteryBought && save.traditionalLotteryDrawTime) {
                        if (Date.now() >= save.traditionalLotteryDrawTime) {
                            // 立即开奖
                            checkTraditionalLotteryResult();
                        } else {
                            // 设置开奖时间
                            player.traditionalLotteryDrawTime = save.traditionalLotteryDrawTime;
                        }
                    }
            if (!window._goldGameSaveLoadBlocked) {
                player.lastUpdate = Date.now();
            }
        }
        if (!save && !window._goldGameSaveLoadBlocked) {
            var hadLocalSaveOnDisk = false;
            try {
                var rawDisk = null;
                if (typeof window.readGoldGameSaveRawFromStorage === 'function') rawDisk = window.readGoldGameSaveRawFromStorage();
                if (!rawDisk) rawDisk = localStorage.getItem('goldGameSave');
                hadLocalSaveOnDisk = !!(rawDisk && rawDisk.length > 20);
            } catch (eDisk) {}
            if (!hadLocalSaveOnDisk) window._goldGameSaveLoadedOk = true;
        }
    } catch (e) {
        console.warn('存档加载失败，使用默认数据:', e);
    }
    if (typeof initArtifactSystem === 'function') initArtifactSystem();
    // 轮回装备/夜店配置在脚本后部；由 defer 标记 + 配置定义处或 runDeferredLoadSaveInits 统一初始化
    window.__deferReincarnationEquipInit = true;
    window.__deferNightClubInit = true;
    if (typeof runDeferredLoadSaveInits === 'function') {
        runDeferredLoadSaveInits();
    } else {
        window.__pendingDeferredLoadSaveInits = true;
    }
    if (typeof syncWingInventoryCaps === 'function') syncWingInventoryCaps();
    else if (typeof ensureWingInventorySettings === 'function') ensureWingInventorySettings();
    if (typeof initMountData === 'function') initMountData();
    if (typeof syncBeastInventoryCaps === 'function' && typeof BEAST_RARITY_ORDER !== 'undefined') {
        syncBeastInventoryCaps();
    } else if (typeof ensureBeastInventorySettings === 'function') {
        ensureBeastInventorySettings();
        window.__pendingBeastInventorySync = true;
    }
    if (typeof syncParkingGarageCaps === 'function') syncParkingGarageCaps();
    if (typeof syncHouseOwnedCaps === 'function') syncHouseOwnedCaps();
    if (typeof syncPixelInventoryCaps === 'function') syncPixelInventoryCaps();
    if (window.__pendingSeaFishingMarketOfflineMs > 0 && typeof processSeaFishingMarketOffline === 'function'
        && typeof SEA_CUSTOMER_TYPES !== 'undefined' && SEA_CUSTOMER_TYPES && SEA_CUSTOMER_TYPES.length
        && typeof SEA_CUSTOMER_MOODS !== 'undefined' && SEA_CUSTOMER_MOODS && SEA_CUSTOMER_MOODS.length) {
        try {
            processSeaFishingMarketOffline(window.__pendingSeaFishingMarketOfflineMs);
        } catch (e) { console.warn('processSeaFishingMarketOffline pending in loadSave', e); }
        window.__pendingSeaFishingMarketOfflineMs = 0;
    }
    // 地主常量在脚本后部定义；首屏 loadSave 时不可引用 const 名（同作用域 TDZ 下 typeof 也会抛错）
    if (typeof loadLandlordGameData === 'function') {
        if (window.__landlordSkyVineConstantsReady) {
            loadLandlordGameData();
        } else {
            window.__pendingLandlordGameDataInit = true;
        }
    }
}

  



        // 模拟离线期间的自动购买
        function simulateOfflineAutoBuy(offlineSeconds) {
    const maxOfflineTime = 86400; // 24小时（秒）
    const actualOfflineTime = Math.min(offlineSeconds, maxOfflineTime);
    const minutes = Math.floor(actualOfflineTime / 86400); // 转换为分钟数
    const chestsPerMinute = 1; // 每分钟购买数量

    player.autoBuy.forEach((enabled, index) => {
        if (enabled) {
            const type = index + 1;
            const costConfig = [
                { currency: "gold", amount: 100 },
                { currency: "diamond", amount: 10 },
                { currency: "titanium", amount: 1 },
                { currency: "starstone", amount: 1 },
                { currency: "cosmicstone", amount: 1 },
                { currency: "superstone", amount: 1 },
                { currency: "otherworldstone", amount: 1 },
                { currency: "xingjiestone", amount: 1 },
                { currency: "hundunstone", amount: 1 },
                { currency: "lingtone", amount: 1 },
                { currency: "huangtone", amount: 1 },
                { currency: "mingtone", amount: 1 },
                { currency: "xutong", amount: 1 },
                { currency: "shitone", amount: 1 },
                { currency: "weitone", amount: 1 },
                { currency: "yongtone", amount: 1 },
                { currency: "wujitone", amount: 1 },
                { currency: "daotone", amount: 1 }
            ][index];

            // 计算最大可购买数量：分钟数 × 每分钟500个
            const maxPossible = minutes * chestsPerMinute;
            // 计算实际能购买的数量（受限于货币数量）
            const affordable = divFloorCurrencyByRate(costConfig.currency, costConfig.amount);
            const actualBuy = Math.min(maxPossible, affordable);

            if (actualBuy > 0) {
                // 扣除总消耗
                deductCurrencyBatch(costConfig.currency, costConfig.amount, actualBuy);
                
                // 更新宝箱计数
                const chestType = ['common', 'advanced', 'rare', 'epic', 'legendary', 'chaos', 'apocalypse','yeyu1', 'yeyu2', 'yeyu3', 'yeyu4', 'yeyu5', 'yeyu6', 'yeyu7', 'yeyu8', 'yeyu9', 'yeyu10', 'yeyu11'][index];
                player.chestCounts[chestType] += actualBuy;
                
                // 批量处理装备获取（这里简化处理，实际可根据需要调整概率计算）
                for (let i = 0; i < actualBuy; i++) {
                    const selectedRarity = selectRarity(type);
                    handleEquipment(selectedRarity);
                }
                
                // 检查成就（会自动处理区间判断）
                checkChestAchievements(chestType, player.chestCounts[chestType]);
            }
        }
    });




    // 材料宝箱类似处理
    if (player.autoBuyMaterialChest) {
        const maxPossible = minutes * chestsPerMinute;
        let remaining = maxPossible;
        let totalCost = 0;
        
        // 计算材料宝箱可购买数量（考虑成本递增）
        while (remaining > 0 && cmpCurrency('diamond', player.materialChestCost + totalCost) >= 0) {
            totalCost += player.materialChestCost;
            player.materialChestCost *= 2; // 成本翻倍
            remaining--;
        }
        
        if (maxPossible - remaining > 0) {
            deductCurrencyBatch('diamond', 1, totalCost);
            // 批量处理材料宝箱奖励
            for (let i = 0; i < maxPossible - remaining; i++) {
                const selectedItem = selectMaterialChestItem();
                if (selectedItem.type in player.collections) {
                    player.collections[selectedItem.type]++;
                    applyCollectionEffect(selectedItem.type);
                } else if (selectedItem.type in player.items) {
                    player.items[selectedItem.type]++;
                }
            }
        }
    }

}
function handleVipPowerGain() {
    player.vip.power++;
    const newLevel = calculateVipLevel();
    
    if (newLevel > player.vip.level) {
        const oldLevel = player.vip.level;
        player.vip.level = newLevel;
        logAction(`VIP等级提升至${newLevel}级！全属性装备提升${vipConfig[newLevel - 1].bonus * 100}%`, 'success');
    }
    
    updateVipDisplay();
}
        /** 读档时深合并疯狂地主数据，避免浅覆盖丢失 coins / seedStorage / itemStorage */
        function mergeLandlordSaveFromOld(saved, defaults) {
            var def = (defaults && typeof defaults === 'object') ? defaults : {};
            if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
                return (def && typeof def === 'object') ? def : null;
            }
            var merged = Object.assign({}, def, saved);
            merged.seedStorage = Object.assign({}, def.seedStorage || {}, saved.seedStorage || {});
            merged.itemStorage = Object.assign({}, def.itemStorage || {}, saved.itemStorage || {});
            merged.storeItems = Object.assign({}, def.storeItems || {}, saved.storeItems || {});
            merged.itemStoreItems = Object.assign({}, def.itemStoreItems || {}, saved.itemStoreItems || {});
            merged.stats = Object.assign({}, def.stats || {}, saved.stats || {});
            merged.bars = Object.assign({}, def.bars || {}, saved.bars || {});
            if (def.lottery || saved.lottery) {
                merged.lottery = Object.assign({}, def.lottery || {}, saved.lottery || {});
            }
            if (def.ranch || saved.ranch) {
                merged.ranch = Object.assign({}, def.ranch || {}, saved.ranch || {});
            }
            if (def.seaFishing || saved.seaFishing) {
                merged.seaFishing = Object.assign({}, def.seaFishing || {}, saved.seaFishing || {});
            }
            if (saved.coins != null && Number.isFinite(Number(saved.coins))) {
                merged.coins = Number(saved.coins);
            } else if (def.coins != null && Number.isFinite(Number(def.coins))) {
                merged.coins = Number(def.coins);
            }
            return merged;
        }
        // 数据迁移
        function migrateSaveData(oldSave) {
    return {
        ...player,
        ...oldSave,
        achievements: {
            ...player.achievements, // 使用默认成就数据
            ...(oldSave.achievements || {}) // 覆盖旧存档的成就数据
        },
        equipment: oldSave.equipment || [],
        items: Object.assign({
            primaryGem: 0, advancedGem: 0, superiorGem: 0, divineGem: 0, vipPower: 0, refineStone: 0, rose: 0, companionKey: 0, rebornDan: 0, baitCount: 0, rootDetector: 0, bloodlineDetector: 0, advanceStone: 0, primaryGemq: 0, zongmen: 0, roseq: 0, yuzhou1: 0, yuzhou2: 0, yuzhou3: 0, yuzhou4: 0, banlv1: 0, banlv2: 0, banlv3: 0, banlv4: 0, banlv5: 0, banlv6: 0, banlv7: 0, banlv8: 0, banlv9: 0, zhiye1: 0, chiban1: 0, zuoqi1: 0, fuben1: 0, shenshou1: 0, lawPowerMaterial: 0, fuwen1: 0, fuben2: 0, danyao1: 0, danyao2: 0, danyao3: 0, danyao4: 0, danyao5: 0, fubeng1: 0, cultivationpill: 0, seed_herb1: 0, seed_herb2: 0, seed_herb3: 0, seed_herb4: 0, seed_herb5: 0
        }, (oldSave.items && typeof oldSave.items === 'object') ? oldSave.items : {}),
        collections: oldSave.collections || {
            lightSpeedHand: 0,
            empHand: 0,
            godlyHand: 0,
            quickHand: 0,
            shadowHand: 0,
            quantumHand: 0,
            lightningHand: 0,
            divineHand: 0
        },
     houses: oldSave.houses || {
                    level: 1,
                    exp: 0,
                    maxHouses: 5,
                    ownedHouses: [],
                    rentedHouses: [],
                    lastUpdate: Date.now(),
                    totalIncome: 0
                },
        pets: oldSave.pets || {
            thunderKirin: { level: 0, cost: 1, multiplier: 0.10 },
            chaosTaotie: { level: 0, cost: 1, multiplier: 0.30 },
            netherQiongqi: { level: 0, cost: 1, multiplier: 0.90 },
            abyssKun: { level: 0, cost: 1, multiplier: 2.70 },
            primordialZhuLong: { level: 0, cost: 1, multiplier: 8.10 },
           wanJunSuanNi: { level: 0, cost: 1, multiplier: 24.30 },
           yanYuBiAn: { level: 0, cost: 1, multiplier: 72.90 },
          yuyu1: { level: 0, cost: 1, multiplier: 218.70 },
         yuyu2: { level: 0, cost: 1, multiplier: 656.10 },
          yuyu3: { level: 0, cost: 1, multiplier: 1968.30 },
         yuyu4: { level: 0, cost: 1, multiplier: 5904.90 },
          yuyu5: { level: 0, cost: 1, multiplier: 17714.70 },
          yuyu6: { level: 0, cost: 1, multiplier: 53144.10 },
         yuyu7: { level: 0, cost: 1, multiplier: 159432.30 },
          yuyu8: { level: 0, cost: 1, multiplier: 478296.90 },
          yuyu9: { level: 0, cost: 1, multiplier: 1434890.70 },
          yuyu10: { level: 0, cost: 1, multiplier: 4304672.10 },
          yuyu11: { level: 0, cost: 1, multiplier: 12914016.30 }
        },
        dungeonEquipment: oldSave.dungeonEquipment || [],
        soulRings: oldSave.soulRings || [],
        achievements: oldSave.achievements || player.achievements,
        autoBuy: oldSave.autoBuy || [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // 新增宝箱自动购买状态
        autoBuyMaterialChest: oldSave.autoBuyMaterialChest || false,
        autoBuyTechniqueChest: oldSave.autoBuyTechniqueChest || false,
       autoBuyTechniqueMaxCost: oldSave.autoBuyTechniqueMaxCost ||0.1,
        gpsMultiplie: oldSave.gpsMultiplier ||1,
        clickMultiplier: oldSave.clickMultiplier || 1,
        autoConvert: oldSave.autoConvert || false,
        autoConvertDebug: !!oldSave.autoConvertDebug,
        autoConvertCurrency: Object.assign({
            gold: false,
            diamond: false,
            titanium: false,
            starstone: false,
            cosmicstone: false,
            superstone: false,
            otherworldstone: false,
            xingjiestone: false,
            hundunstone: false,
            lingtone: false,
            huangtone: false,
            mingtone: false,
            xutong: false,
            shitone: false,
            weitone: false,
            yongtone: false,
            wujitone: false
        }, (oldSave && oldSave.autoConvertCurrency && typeof oldSave.autoConvertCurrency === 'object') ? oldSave.autoConvertCurrency : {}),
        clickTimestamps: oldSave.clickTimestamps || [],
        chestCounts: oldSave.chestCounts || { common: 0, advanced: 0, rare: 0, epic: 0, legendary: 0, chaos: 0, apocalypse: 0, yeyu1: 0, yeyu2: 0, yeyu3: 0, yeyu4: 0, yeyu5: 0, yeyu6: 0, yeyu7: 0, yeyu8: 0, yeyu9: 0, yeyu10: 0, yeyu11: 0 }, // 新增宝箱计数
        reincarnationCoin: bigSciToStorageValue((oldSave && oldSave.reincarnationCoin != null) ? oldSave.reincarnationCoin : 0),
        reincarnationCount: oldSave.reincarnationCount || 0,
        reincarnationStats: oldSave.reincarnationStats || {
            gpsBonus: { level: 0, cost: 1 },
            equipmentLevelBonus: { level: 0, cost: 1 },
            clickLimitBonus: { level: 0, cost: 1 },
            reincarnationCoinBonus: { level: 0, cost: 1 }
        },
        materialChestCost: oldSave.materialChestCost || 1,
        stockData: oldSave.stockData || {
            stocks: [
                { name: '青龙至尊股', basePrice: 1, currentPrice: 1, lastPrice: 1, shares: 0, avgCost: 0 },
                { name: '白虎至尊股', basePrice: 10, currentPrice: 10, lastPrice: 10, shares: 0, avgCost: 0 },
                { name: '朱雀至尊股', basePrice: 100, currentPrice: 100, lastPrice: 100, shares: 0, avgCost: 0 },
                { name: '玄武至尊股', basePrice: 1000, currentPrice: 1000, lastPrice: 1000, shares: 0, avgCost: 0 },
                { name: '瑞兽白泽股', basePrice: 10000, currentPrice: 10000, lastPrice: 10000, shares: 0, avgCost: 0 }
            ],
            lastStockUpdate: Date.now()
        },
        lotteryResults: oldSave.lotteryResults || [],
        traditionalLotteryNumbers: oldSave.traditionalLotteryNumbers || [],
        lastLotteryDraw: oldSave.lastLotteryDraw || Date.now(),
        bank: oldSave.bank || {
            deposit: 0,
            lastInterestUpdate: Date.now()
        },
        lawPower: Object.assign({
            attack: 0, health: 0, critDamage: 0, critRate: 0, worldExp: 0, cultivationExp: 0, mysteryExp: 0
        }, (oldSave.lawPower && typeof oldSave.lawPower === 'object') ? oldSave.lawPower : {}),
        landlord: mergeLandlordSaveFromOld(oldSave.landlord, player.landlord)
    };
}

        // 装备验证
        function validateEquipmentList(equipmentList) {
            return (equipmentList || []).map(eq => ({
                name: eq.name || getEquipmentName(eq),
                rarity: validateRarity(eq.rarity),
                level: Math.max(1, parseInt(eq.level) || 1),
                gps: bigSciToStorageValue(eq.gps),
                click: bigSciToStorageValue(eq.click),
                growthRate: safeNumber(eq.growthRate, getDefaultGrowthRate(eq.rarity)),
                gemMultiplier: safeNumber(eq.gemMultiplier, 0),
                collectionMultiplier: safeNumber(eq.collectionMultiplier, 0)
            }));
        }

        // 安全数值处理
        function safeNumber(value, fallback = 0) {
            return typeof value === 'number' ? value : parseFloat(value) || fallback;
        }
        function multiplyBigByFinite(value, factor) {
            const f = Number(factor);
            if (!Number.isFinite(f) || f <= 0) return bigSciToStorageValue(value);
            return bigSciToStorageValue(mulBigSci(value, f));
        }
        function multiplyBigByFactors(value, factors) {
            let out = bigSciToStorageValue(value);
            (factors || []).forEach((factor) => {
                const f = Number(factor);
                if (!Number.isFinite(f) || f <= 0) return;
                out = bigSciToStorageValue(mulBigSci(out, f));
            });
            return out;
        }
        function sciFromLog10(log10Value) {
            const lv = Number(log10Value);
            if (!Number.isFinite(lv)) return '1e309';
            const exp = Math.floor(lv);
            const frac = lv - exp;
            const mantissa = Math.pow(10, frac);
            return bigSciToStorageValue(`${mantissa}e${exp}`);
        }
        function powScaledBig(base, stage, scale) {
            const b = Number(base);
            const s = Number(stage) || 0;
            const k = Number(scale);
            if (!(b > 0) || !(k > 0)) return 0;
            const log10Value = Math.log10(k) + s * Math.log10(b);
            return sciFromLog10(log10Value);
        }

        // 魂环/副本装备总加成（须在 save 主循环调用 getTotalGPS 前可用，故放在 core）
        function getTotalSoulRingBonus() {
            let total = 0;
            (player.soulRings || []).forEach(ring => {
                total += (Number(ring.level) || 0) * (Number(ring.multiplier) || 0);
            });
            const mult = (player.classBonuses && Number(player.classBonuses.soulRingMultiplier)) || 1;
            return total * mult;
        }
        function getTotalDungeonEquipBonus() {
            let total = 0;
            (player.dungeonEquipment || []).forEach(eq => {
                total += (Number(eq.level) || 0) * (Number(eq.growthRate) || 0);
            });
            const mult = (player.classBonuses && Number(player.classBonuses.dungeonEquipMultiplier)) || 1;
            return total * mult;
        }

        // 核心游戏逻辑
        function getTotalGPS() {
    const towerMultiplier = 1 + (Number(player.tower && player.tower.currentFloor) || 0) * 0.01;
    const gpsBonus = (Number(player.reincarnationStats && player.reincarnationStats.gpsBonus && player.reincarnationStats.gpsBonus.level) || 0) * 1.00; // 每级增加100% GPS
    const petMultiplier = Object.values(player.pets || {}).reduce((sum, pet) => sum + (Number(pet.level) || 0) * (Number(pet.multiplier) || 0), 1);

    const dungeonBonus = getTotalDungeonEquipBonus();
    const soulRingBonus = getTotalSoulRingBonus();
 const mysteryBonus = player.mystery.bonus || 1;
const cultivationBonus = player.cultivation.bonus || 1;
const gpsEnhancements =  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 1];
const farmGPSEnhancement  = gpsEnhancements[player.farm.level - 1] || gpsEnhancements[gpsEnhancements.length - 1];

const gpsEnhancementss =  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 1];
const farmGPSEnhancements  = gpsEnhancementss[player.parking.level - 1] || gpsEnhancementss[gpsEnhancementss.length - 1];

const gpsEnhancemenzss =  [1, 3, 6, 8, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400, 1];
const farmGPSEnhancemezts  = gpsEnhancemenzss[player.houses.level - 1] || gpsEnhancemenzss[gpsEnhancemenzss.length - 1];
    const gpsBonuqqqq = 1+player.fiveElements.metal.level * 3.00;  
   const gpsBonuqqqa = player.trialTower.currentFloor * 1.00; 
    const gpsBonuss = (Number(player.level && player.level.gpsBonus) || 0) * 1.00;   
   const _liveEarn = Number(player.liveStream && player.liveStream.totalEarnings) || 0;
   const gpsBonusssq = _liveEarn * 0.00001;
    let pkGpsMult = 1;
    try {
        if (typeof liveStreamSystem !== "undefined" && liveStreamSystem.pkTiers && player.liveStream) {
            const pkTierData = liveStreamSystem.pkTiers[player.liveStream.pkTier || 0];
            if (pkTierData) pkGpsMult = (pkTierData.gpsBase || 1) + (player.liveStream.pkSubLevel || 1) - 1;
        }
    } catch (_) {}
const _landlordStats = player.landlord && player.landlord.stats;
const gpsBonusssqaa = (Number(_landlordStats && _landlordStats.totalCoinsEarned) || 0) * 0.0001;  
 const gpsBonusssqaawq = (1 + (Number(_landlordStats && _landlordStats.marketFishCoinsEarned) || 0) * 0.02) * (1 + (Number(_landlordStats && _landlordStats.ranchCoinsEarned) || 0) * 0.015);  
 const gpsBonussbb = (player.mining && player.mining.gems && Number(player.mining.gems.diamond)) || 0;  
   const gpsBonusssqasa = 1+player.abyssTower.bestFloor * 2.00;  
const gpsEnhancementsp =  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 1];
    const _sectLv = (player.sect && Number(player.sect.level)) || 0;
    const _sectIdx = _sectLv <= 0 ? 0 : Math.min(_sectLv, gpsEnhancementsp.length) - 1;
const farmGPSEnhancementp  = gpsEnhancementsp[_sectIdx] || gpsEnhancementsp[gpsEnhancementsp.length - 1];
 const marriageBonus = (player.marriage && player.marriage.isMarried && player.marriage.marriageBonuses) ? (Number(player.marriage.marriageBonuses.gpsMultiplier) || 1) : 1;
        const childBonus = (player.children && player.children.childBonuses) ? (Number(player.children.childBonuses.gpsMultiplier) || 1) : 1;
    const sectTributeBonus = typeof getSectTributeGPSBonus === 'function' ? getSectTributeGPSBonus() : 1;

    const equipSum = (player.equipment || []).reduce((sum, eq) => {
        const mul = 1 + (Number(eq.gemMultiplier) || 0) + (Number(eq.collectionMultiplier) || 0);
        const part = bigSciToStorageValue(mulBigSci(eq.gps, mul));
        return bigSciToStorageValue(addBigSci(sum, part));
    }, 0);
    const equipBase = bigSciToStorageValue(addBigSci(1, equipSum));
    const totalMul = (Number(player.gpsMultiplier) || 1)
        * (1 + gpsBonus)
        * petMultiplier * (1 + dungeonBonus) * (1 + soulRingBonus) * towerMultiplier * mysteryBonus * farmGPSEnhancement * farmGPSEnhancements * cultivationBonus * (Number(gpsBonuss) || 0) * (1 + gpsBonusssq) * farmGPSEnhancementp * (1 + gpsBonusssqaa) * (1 + (Number(gpsBonussbb) || 0)) * farmGPSEnhancemezts * marriageBonus * childBonus * gpsBonuqqqq * gpsBonuqqqa * gpsBonusssqasa * sectTributeBonus * pkGpsMult * gpsBonusssqaawq;
    var familyGpsMult = (typeof window.isGoldGameFamilyBuffActive === 'function' && window.isGoldGameFamilyBuffActive('gps')) ? 10000 : 1;
    return multiplyBigByFinite(equipBase, totalMul * familyGpsMult);
}

function getTotalClickValue() {
    const petMultiplier = Object.values(player.pets || {}).reduce((sum, pet) => sum + (Number(pet.level) || 0) * (Number(pet.multiplier) || 0), 1);
    // 改为使用带职业加成的总装备加成
    const dungeonBonus = getTotalDungeonEquipBonus();
    // 改为使用带职业加成的总魂环加成
   const fishingBonus = player.fishing ? player.fishing.bonus : 1;
    const soulRingBonus = getTotalSoulRingBonus();
   const cultivationBonus = player.cultivation.bonus || 1;
    const farmClickMultipliers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 1];
 const farmClickBonus = farmClickMultipliers[player.farm.level - 1] || farmClickMultipliers[farmClickMultipliers.length - 1];

const farmClickMultiplierss = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 1];
    const farmClickBonuss = farmClickMultiplierss[player.parking.level - 1] || farmClickMultiplierss[farmClickMultiplierss.length - 1];
const farmClickMultipliersss = [1, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 1];
    const farmClickBonusss = farmClickMultipliersss[player.nightClub.level - 1] || farmClickMultipliersss[farmClickMultipliersss.length - 1];     
     const gpsBonuvvs = player.houses.totalIncome *  0.0001;
    const gpsBonubbs = player.parking.totalIncome *  0.0001;
    const gpsBonusss = (Number(player.level && player.level.clickBonus) || 0) * 1.00;      
    const gpsBonuqregg = 1+player.fiveElements.wood.level * 3.00; 
    const gpsBonuqregga = 1+player.trialTower.currentFloor * 0.10; 
    const gpsBonuqreggsa = 1+player.abyssTower.bestFloor * 2.00;
const farmClickMultiplierssa = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1];
    const farmClickBonussa = farmClickMultiplierssa[player.liveStream.level - 1] || farmClickMultiplierssa[farmClickMultiplierssa.length - 1];
       const _landlordStatsC = player.landlord && player.landlord.stats;
       const farmClickBonussw = (Number(_landlordStatsC && _landlordStatsC.totalCoinsEarned) || 0) * 0.0001;
         const farmClickBonusswqq = (1 + (Number(_landlordStatsC && _landlordStatsC.marketFishCoinsEarned) || 0) * 0.02) * (1 + (Number(_landlordStatsC && _landlordStatsC.ranchCoinsEarned) || 0) * 0.015);     
     const marriageBonus = (player.marriage && player.marriage.isMarried && player.marriage.marriageBonuses) ? (Number(player.marriage.marriageBonuses.clickMultiplier) || 1) : 1;
   const childBonus = (player.children && player.children.childBonuses) ? (Number(player.children.childBonuses.clickMultiplier) || 1) : 1;
    const equipClickSum = (player.equipment || []).reduce((sum, eq) => {
        const mul = 1 + (Number(eq.gemMultiplier) || 0) + (Number(eq.collectionMultiplier) || 0);
        const part = bigSciToStorageValue(mulBigSci(eq.click, mul));
        return bigSciToStorageValue(addBigSci(sum, part));
    }, 0);
    const equipClickBase = bigSciToStorageValue(addBigSci(1, equipClickSum));
    const totalClickMul = (Number(player.clickMultiplier) || 1)
        * petMultiplier
        * (1 + dungeonBonus)
        * (1 + soulRingBonus) * fishingBonus * farmClickBonus * farmClickBonuss * cultivationBonus * farmClickBonusss * (Number(gpsBonusss) || 0) * farmClickBonussa * (1 + farmClickBonussw) * (1 + gpsBonuvvs) * (1 + gpsBonubbs) * marriageBonus * childBonus * gpsBonuqregg * gpsBonuqregga * gpsBonuqreggsa * farmClickBonusswqq * getFamilyClickMultiplier();
    return multiplyBigByFinite(equipClickBase, totalClickMul);
}


     
        // 自动兑换货币
        function autoConvertCurrency() {
    ensureAutoConvertCurrencyState();
    const conversions = [
        { from: 'gold', to: 'diamond', rate: 1e5 },
        { from: 'diamond', to: 'titanium', rate: 1e8 },
        { from: 'titanium', to: 'starstone', rate: 1e8 },
        { from: 'starstone', to: 'cosmicstone', rate: 1e8 },
        { from: 'cosmicstone', to: 'superstone', rate: 1e9 },
        { from: 'superstone', to: 'otherworldstone', rate: 1e12 },
        { from: 'otherworldstone', to: 'xingjiestone', rate: 1e12 },
        { from: 'xingjiestone', to: 'hundunstone', rate: 1e12 },
        { from: 'hundunstone', to: 'lingtone', rate: 1e15 },
        { from: 'lingtone', to: 'huangtone', rate: 1e15 },
        { from: 'huangtone', to: 'mingtone', rate: 1e15 },
        { from: 'mingtone', to: 'xutong', rate: 1e20 },
        { from: 'xutong', to: 'shitone', rate: 1e20 },
        { from: 'shitone', to: 'weitone', rate: 1e20 },
        { from: 'weitone', to: 'yongtone', rate: 1e20 },
        { from: 'yongtone', to: 'wujitone', rate: 1e20 },
        { from: 'wujitone', to: 'daotone', rate: 1e20 }
    ];

    conversions.forEach(({ from, to, rate }) => {
        if (!player.autoConvertCurrency[from]) return;
        const original = player[from];
        if (original == null) return;
        const detail = convertAllCurrencyByRate(from, to, rate, original);
        if (player.autoConvertDebug && detail) {
            if (!autoConvertCurrency._debugRows) autoConvertCurrency._debugRows = [];
            autoConvertCurrency._debugRows.push(detail);
        }
    });
    if (player.autoConvertDebug && autoConvertCurrency._debugRows && autoConvertCurrency._debugRows.length > 0) {
        const now = Date.now();
        const last = autoConvertCurrency._lastDebugLogAt || 0;
        if (now - last >= 1000) {
            autoConvertCurrency._lastDebugLogAt = now;
            const text = autoConvertCurrency._debugRows.map((r) => {
                const convertedText = formatSci(bigSciToStorageValue(r.converted));
                const remainText = formatSci(bigSciToStorageValue(r.remain));
                return `${getCurrencyName(r.from)}->${getCurrencyName(r.to)} 兑${convertedText} 留${remainText}`;
            }).join(' | ');
            logAction(`[自动兑换调试] ${text}`, 'info');
        }
        autoConvertCurrency._debugRows = [];
    }
}

        function getFamilyClickMultiplier() {
            if (typeof window.isGoldGameFamilyBuffActive === 'function' && window.isGoldGameFamilyBuffActive('click')) {
                return 10000;
            }
            return 1;
        }

        // 点击获取金币，限制每秒10次
        function clickGold() {
            const now = Date.now();
            player.clickTimestamps = player.clickTimestamps.filter(timestamp => now - timestamp < 1000);

            const clickLimit = 10 + player.reincarnationStats.clickLimitBonus.level;
            if (player.clickTimestamps.length >= clickLimit) {
                logAction("点击速度过快，请稍后再试！", "error");
                return;
            }

            player.clickTimestamps.push(now);

            const value = getTotalClickValue();
            addGold(value);
            logAction(`点击获取金币: +${value}`, 'info');
            
            const lastUpdate = clickGold._lastUpdate || 0;
            if (now - lastUpdate > 100) {
                clickGold._lastUpdate = now;
                updateDisplay();
            }
        }

        function buyChest(type) {
    const costConfig = [
        { currency: "gold", amount: 100 },
        { currency: "diamond", amount: 10 },
        { currency: "titanium", amount: 1 },
        { currency: "starstone", amount: 1 },
        { currency: "cosmicstone", amount: 1 },
        { currency: "superstone", amount: 1 }, 
        { currency: "otherworldstone", amount: 1 }, 
        { currency: "xingjiestone", amount: 1 },
        { currency: "hundunstone", amount: 1 },
        { currency: "lingtone", amount: 1 }, 
        { currency: "huangtone", amount: 1 },
        { currency: "mingtone", amount: 1 }, 
        { currency: "xutong", amount: 1 }, 
        { currency: "shitone", amount: 1 },
        { currency: "weitone", amount: 1 },
        { currency: "yongtone", amount: 1 },
        { currency: "wujitone", amount: 1 },
        { currency: "daotone", amount: 1 }
    ][type - 1];

    const canPay = spendCurrency(costConfig.currency, costConfig.amount);
    if (canPay) {
        const selectedRarity = selectRarity(type);
        console.log(`购买宝箱类型: ${type}, 掉落装备品质: ${selectedRarity}`); // 调试信息
        handleEquipment(selectedRarity);

        // 更新宝箱购买计数
        const chestType = ['common', 'advanced', 'rare', 'epic', 'legendary', 'chaos', 'apocalypse', 'yeyu1', 'yeyu2', 'yeyu3', 'yeyu4', 'yeyu5', 'yeyu6', 'yeyu7', 'yeyu8', 'yeyu9', 'yeyu10', 'yeyu11'][type - 1];
        player.chestCounts[chestType]++;
        checkChestAchievements(chestType, player.chestCounts[chestType]);
    } else {
        logAction(`${costConfig.currency}不足！无法购买${['普通','高级','稀有','史诗','传说','混沌','终焉','星辰','银河','星云','鸿蒙','太虚', '虚空', '时空', '未来', '永恒', '无极', '大道'][type-1]}宝箱`, 'error');
    }
    updateDisplay();
}

        // 检查宝箱成就
        function checkChestAchievements(chestType, count) {
    const achievements = [
        { count: 100, key: `${chestType}_chest_100` },
        { count: 10000, key: `${chestType}_chest_10000` },
        { count: 1000000, key: `${chestType}_chest_1000000` },
        { count: 10000000, key: `${chestType}_chest_10000000` },
        { count: 100000000, key: `${chestType}_chest_100000000` }
    ];

    achievements.forEach(({ count: targetCount, key }) => {
        if (count >= targetCount && !player.achievements[key]) {
            player.achievements[key] = true;
            const reward = achievementRewards[key];
            if (reward) {
                player.gpsMultiplier += reward.gpsMultiplier;
                logAction(`成就达成：${reward.description}，GPS奖励 +${reward.gpsMultiplier * 100}%`, 'success');
                updateAchievementsDisplay();
            }
        }
    });
}

        function buyMaterialChest() {
    const cost = player.materialChestCost;
    if (spendCurrency('diamond', cost)) {
        const selectedItem = selectMaterialChestItem();
        
        if (selectedItem.type in player.collections) {
            player.collections[selectedItem.type]++;
            onCollectionAdded(selectedItem.type); // 应用效果
            const cn = collectionEffects[selectedItem.type];
            logAction(`获得收藏物：${cn && cn.name ? cn.name : selectedItem.type}`, 'success');
            updateCollectionDisplay(); // 更新收藏物页面
        } else if (selectedItem.type in player.items) {
            player.items[selectedItem.type]++;
            const it = itemEffects[selectedItem.type];
            logAction(`获得道具：${it && it.name ? it.name : selectedItem.type}`, 'success');
            updateItemDisplay(); // 更新道具页面
        }
// 新增：处理VIP能力值道具
        else if (selectedItem.type === 'vipPower') {
            handleVipPowerGain(); // 调用VIP能力值处理函数
        } else {
            logAction(`材料宝箱获得未知类型：${selectedItem.type}（已跳过）`, 'warning');
        }
        // 更新材料宝箱购买成本
             player.materialChestCost *= 2;
            updateDisplay();
      }   else {
        logAction("钻石不足！无法购买材料宝箱", "error");
    }
}
     function buyTechniqueChest() {
    const cost = player.techniqueChestCost;
    if (player.reincarnationCoin >= cost) {
        player.reincarnationCoin -= cost;
        player.techniqueChestCost *= 2;  // 下次消耗翻倍
        player.techniqueChestLevel++;
        
        // 根据概率随机选择功法
        const roll = Math.random();
        let cumulativeProb = 0;
        
        for (const drop of techniqueChestDrops) {
            cumulativeProb += drop.prob;
            if (roll <= cumulativeProb) {
                addTechnique(drop.id);
                break;
            }
        }
        
        logAction("打开了功法秘笈宝箱！", "success");
        updateDisplay();
    } else {
        logAction("转生币不足！", "error");

    }
}
   // 初始化或重置时调用
function resetAllCollectionEffects() {
    // 重置所有装备的收藏物加成
    player.equipment.forEach(eq => {
        eq.collectionMultiplier = 0;
    });
    
    // 重新应用所有收藏物效果
    applyAllCollectionEffects();
}

// 应用所有收藏物效果
function applyAllCollectionEffects() {
    // 先重置所有效果
    player.equipment.forEach(eq => {
        eq.collectionMultiplier = 0;
    });
    
    // 累加所有收藏物效果
    Object.entries(player.collections).forEach(([type, count]) => {
        if(count > 0) {
            const effect = collectionEffects[type].effect * count;
            player.equipment.forEach(eq => {
                eq.collectionMultiplier += effect;
            });
        }
    });
    
    updateCollectionDisplay();
}

// 获得新收藏物时调用
function onCollectionAdded(collectionType) {
    const effect = collectionEffects[collectionType].effect;
    player.equipment.forEach(eq => {
        eq.collectionMultiplier += effect;
    });
    updateCollectionDisplay();
}


        // 选择材料宝箱掉落物品
        function selectMaterialChestItem() {
            let totalProb = materialChestProbabilities.reduce((sum, p) => sum + p.prob, 0);
            let rand = Math.random() * totalProb;
            for (const { type, prob } of materialChestProbabilities) {
                if (rand < prob) return { type };
                rand -= prob;
            }
            return { type: 'lightSpeedHand' }; // 默认掉落
        }

        function selectRarity(type) {
    const probConfig = chestProbabilities[type];
    let totalProb = probConfig.reduce((sum, p) => sum + p.prob, 0);
    let rand = Math.random() * totalProb;
    for (const { rarity, prob } of probConfig) {
        if (rand < prob) return validateRarity(rarity);
        rand -= prob;
    }
    return 'common';
}

        function handleEquipment(rarity) {
    const existingIndex = player.equipment.findIndex(eq => eq.rarity === rarity);
    if (existingIndex >= 0) {
        upgradeExistingEquipment(existingIndex, rarity);
    } else {
        addNewEquipment(rarity);
    }
    checkAchievement(rarity);
}

        function upgradeExistingEquipment(index, rarity) {
    const eq = player.equipment[index];
    const config = equipmentTypes[rarity] || equipmentTypes.common;
    eq.level++;
            const vipBonus = 1 + getVipBonus();
            const factor = (1 + (config.growthRate * eq.level * 0.01)) * (1 + player.reincarnationStats.gpsBonus.level) * vipBonus;
            eq.gps = multiplyBigByFinite(config.gps, factor);
            eq.click = multiplyBigByFinite(config.click, factor);

        }

        function addNewEquipment(rarity) {
            const config = equipmentTypes[rarity] || equipmentTypes.common;
            const newEq = {
                name: config.name,
                gps: multiplyBigByFinite(config.gps, (1 + player.reincarnationStats.gpsBonus.level)),
                click: multiplyBigByFinite(config.click, (1 + player.reincarnationStats.gpsBonus.level)),
                rarity: rarity,
                level: 1 + player.reincarnationStats.equipmentLevelBonus.level * 200, // 转生属性加成
                growthRate: config.growthRate,
                gemMultiplier: 0,
                collectionMultiplier: 0
            };
            player.equipment.push(newEq);
            logAction(`获得 ${newEq.name}装备`, rarity);
        }

        function upgradeEquipment(index) {
            const eq = player.equipment[index];
            const cost = Math.floor(100 * Math.pow(1.5, eq.level));
            if (spendGold(cost)) {
                eq.level++;
                const vipBonus = 1 + getVipBonus();
                const factor = (1 + eq.growthRate) * (1 + player.reincarnationStats.gpsBonus.level) * vipBonus;
                eq.gps = multiplyBigByFinite(eq.gps, factor);
                eq.click = multiplyBigByFinite(eq.click, factor);
                logAction(`主动升级 ${eq.name}装备 至 Lv.${eq.level}`, eq.rarity);
                updateDisplay();
              updateVipDisplay();
            } else {
                logAction("金币不足！", "error");
            }
        }

        // 自动购买逻辑
       function checkAutoBuy() {
    const speedMultiplier = player.autoBuySpeedBoost ? 600 : 1;
    player.autoBuy.forEach((enabled, index) => {
        if (enabled) {
            const type = index + 1;
            const costConfig = [
                { currency: "gold", amount: 100 },
                { currency: "diamond", amount: 10 },
                { currency: "titanium", amount: 1 },
                { currency: "starstone", amount: 1 },
                { currency: "cosmicstone", amount: 1 },
                { currency: "superstone", amount: 1 },
                { currency: "otherworldstone", amount: 1 },
                { currency: "xingjiestone", amount: 1 },
                { currency: "hundunstone", amount: 1 },
                { currency: "lingtone", amount: 1 },
                { currency: "huangtone", amount: 1 },
                { currency: "mingtone", amount: 1 },
                { currency: "xutong", amount: 1 },
                { currency: "shitone", amount: 1 },
                { currency: "weitone", amount: 1 },
                { currency: "yongtone", amount: 1 },
                { currency: "wujitone", amount: 1 },
                { currency: "daotone", amount: 1 }
            ][index];
            
            if (cmpCurrency(costConfig.currency, costConfig.amount) >= 0) {
                // 计算最大可购买数量（最多1000个）
                const maxBuy = Math.min(speedMultiplier, (100+player.cultivation.stage * 3));
                const affordable = divFloorCurrencyByRate(costConfig.currency, costConfig.amount);
                const actualBuy = Math.min(maxBuy, affordable);
                
                if (actualBuy > 0) {
                    // 批量扣除货币
                    deductCurrencyBatch(costConfig.currency, costConfig.amount, actualBuy);
                    
                    // 统计装备升级总级数
                    let totalLevelsUp = 0;
                    const chestTypeName = ['普通','高级','稀有','史诗','传说','混沌','终焉','星辰','银河','星云','鸿蒙','太虚', '虚空', '时空', '未来', '永恒', '无极', '大道'][index];
                    
                    // 批量处理装备获取并统计升级计数
                    for (let i = 0; i < actualBuy; i++) {
                        const selectedRarity = selectRarity(type);
                        // 临时修改handleEquipment，使其返回升级的级数
                        const levelsUp = handleEquipment(selectedRarity);
                        totalLevelsUp += levelsUp;
                    }
                    
                    // 更新宝箱计数
                    const chestType = ['common', 'advanced', 'rare', 'epic', 'legendary', 'chaos', 'apocalypse', 'yeyu1', 'yeyu2', 'yeyu3', 'yeyu4', 'yeyu5', 'yeyu6', 'yeyu7', 'yeyu8', 'yeyu9', 'yeyu10', 'yeyu11'][index];
                    player.chestCounts[chestType] += actualBuy;
                    checkChestAchievements(chestType, player.chestCounts[chestType]);
                    
                    // 统一记录日志
                    logAction(`自动购买${chestTypeName}宝箱 x${actualBuy},${name}`, 'success');
                    updateDisplay();
                }
            }
        }
    });
if (player.autoBuyTechniqueChest && player.reincarnationCoin >= player.techniqueChestCost) {
       // 检查价格是否超过上限
        if (player.techniqueChestCost <= player.autoBuyTechniqueMaxCost) {
            buyTechniqueChest();
        } else {
            // 可选: 记录日志或通知玩家
           player.autoBuyTechniqueChest = false;
            logAction("功法秘籍宝箱价格超过上限，停止自动购买", "info");
        }
    }

    

    // 新增：自动购买材料宝箱
if (player.autoBuyMaterialChest && cmpCurrency('diamond', player.materialChestCost) >= 0) {
        buyMaterialChest();
    }
}

        // 切换自动购买状态
        function toggleAutoBuy(typeIndex) {
    const index = typeIndex - 1; // 将宝箱类型转换为数组索引
    player.autoBuy[index] = !player.autoBuy[index]; // 切换状态
    const btn = document.getElementById(`autoChest${typeIndex}`);
    btn.textContent = `${['普通', '高级', '稀有', '史诗', '传说', '混沌', '终焉', '星辰', '银河', '星云', '鸿蒙', '太虚', '虚空', '时空', '未来', '永恒', '无极', '大道'][index]}宝箱自动购买：${player.autoBuy[index] ? '开启' : '关闭'}`;
    logAction(`${player.autoBuy[index] ? '开启' : '关闭'}自动购买${['普通', '高级', '稀有', '史诗', '传说', '混沌', '终焉', '星辰', '银河', '星云', '鸿蒙', '太虚', '虚空', '时空', '未来', '永恒', '无极', '大道'][index]}宝箱`, 'info');
}

        // 切换自动购买材料宝箱状态
        function toggleAutoBuyMaterialChest() {
    player.autoBuyMaterialChest = !player.autoBuyMaterialChest;
    const btn = document.getElementById('autoMaterialChest');
    btn.textContent = `材料宝箱自动购买：${player.autoBuyMaterialChest ? '开启' : '关闭'}`;
    logAction(`${player.autoBuyMaterialChest ? '开启' : '关闭'}自动购买材料宝箱`, 'info');
}
  function toggleAutoBuyTechniqueChest() {
    player.autoBuyTechniqueChest = !player.autoBuyTechniqueChest;
    const btn = document.getElementById('autoTechniqueChest');
    btn.textContent = `功法秘籍宝箱自动购买：${player.autoBuyTechniqueChest ? '开启' : '关闭'}`;
    logAction(`${player.autoBuyTechniqueChest ? '开启' : '关闭'}功法秘籍宝箱自动购买`, 'info');
}
     function toggleOnlineBoost() {
    player.onlineBoostEnabled = !player.onlineBoostEnabled;
    const btn = document.getElementById('toggleOnlineBoost');
    if (btn) btn.textContent = `在线金币加速100倍: ${player.onlineBoostEnabled ? '开启' : '关闭'}`;
    var olbl = document.getElementById('onlineBoostLabel');
    if (olbl) olbl.textContent = player.onlineBoostEnabled ? '开' : '关';
    logAction(`${player.onlineBoostEnabled ? '开启' : '关闭'}在线金币100倍加速`, 'info');
}
     function toggleAutoBuySpeedBoost() {
    player.autoBuySpeedBoost = !player.autoBuySpeedBoost;
    const btn = document.getElementById('autoBuySpeedBoost');
     if (btn) btn.textContent = `在线自动购买100倍数量：${player.autoBuySpeedBoost ? '开启' : '关闭'}`;
    var olbl = document.getElementById('autoBuySpeedLabel');
     if (olbl) olbl.textContent = player.autoBuySpeedBoost ? '开' : '关';
    logAction(`${player.autoBuySpeedBoost ? '开启' : '关闭'}在线自动购买100倍数量`, 'info');
}

     // 根据存档同步侧栏「在线百倍购买/在线百倍加速/自动转生」显示，避免下线再上线显示为关
     function syncOnlineOptionLabels() {
         if (typeof player === 'undefined') return;
         var lbl = document.getElementById('autoBuySpeedLabel');
         if (lbl) lbl.textContent = player.autoBuySpeedBoost ? '开' : '关';
         var olbl = document.getElementById('onlineBoostLabel');
         if (olbl) olbl.textContent = player.onlineBoostEnabled ? '开' : '关';
         var reincLbl = document.getElementById('autoReincarnationStatus');
         if (reincLbl) reincLbl.textContent = player.autoReincarnation ? '开启' : '关闭';
     }

     // 根据存档同步「在线自动购买」面板内所有宝箱/材料/功法按钮显示，打开面板时调用
     function syncAutoBuyPanelDisplay() {
         if (typeof player === 'undefined' || !player.autoBuy) return;
         var names = ['普通', '高级', '稀有', '史诗', '传说', '混沌', '终焉', '星辰', '银河', '星云', '鸿蒙', '太虚', '虚空', '时空', '未来', '永恒', '无极', '大道'];
         player.autoBuy.forEach(function(enabled, index) {
             var btn = document.getElementById('autoChest' + (index + 1));
             if (btn) btn.textContent = names[index] + '宝箱自动购买：' + (enabled ? '开启' : '关闭');
         });
         var materialBtn = document.getElementById('autoMaterialChest');
         if (materialBtn) materialBtn.textContent = '材料宝箱自动购买：' + (player.autoBuyMaterialChest ? '开启' : '关闭');
         var techniqueBtn = document.getElementById('autoTechniqueChest');
         if (techniqueBtn) techniqueBtn.textContent = '功法秘籍宝箱自动购买：' + (player.autoBuyTechniqueChest ? '开启' : '关闭');
     }

     // 添加更新自动兑换货币显示的函数
function getAllAutoConvertCurrencies() {
    return ['gold', 'diamond', 'titanium', 'starstone', 'cosmicstone',
        'superstone', 'otherworldstone', 'xingjiestone', 'hundunstone',
        'lingtone', 'huangtone', 'mingtone', 'xutong', 'shitone', 'weitone',
        'yongtone', 'wujitone'];
}
function ensureAutoConvertCurrencyState() {
    if (!player || typeof player !== 'object') return;
    if (typeof player.autoConvertDebug !== 'boolean') {
        player.autoConvertDebug = false;
    }
    if (!player.autoConvertCurrency || typeof player.autoConvertCurrency !== 'object') {
        player.autoConvertCurrency = {};
    }
    getAllAutoConvertCurrencies().forEach((currency) => {
        if (typeof player.autoConvertCurrency[currency] !== 'boolean') {
            player.autoConvertCurrency[currency] = false;
        }
    });
}
function updateAutoConvertDisplay() {
    ensureAutoConvertCurrencyState();
    const currencies = getAllAutoConvertCurrencies();
    
    currencies.forEach(currency => {
        const btn = document.getElementById(`autoConvert${currency.charAt(0).toUpperCase() + currency.slice(1)}`);
        if (btn) {
            const ratioText = getAutoConvertRatioText(currency);
            btn.textContent = `${getCurrencyName(currency)}自动兑换：${player.autoConvertCurrency[currency] ? '开启' : '关闭'}${ratioText ? '（' + ratioText + '）' : ''}`;
        }
    });
    updateAutoConvertDebugButton();
}
function updateAutoConvertDebugButton() {
    const btn = document.getElementById('autoConvertDebugBtn');
    if (!btn) return;
    const enabled = !!(player && player.autoConvertDebug);
    btn.textContent = `自动兑换调试日志：${enabled ? '开启' : '关闭'}`;
}
function toggleAutoConvertDebug() {
    if (!player || typeof player !== 'object') return;
    player.autoConvertDebug = !player.autoConvertDebug;
    updateAutoConvertDebugButton();
    logAction(`自动兑换调试日志${player.autoConvertDebug ? '开启' : '关闭'}`, 'info');
}

// 辅助函数：获取货币中文名称
function getCurrencyName(currency) {
    const names = {
        gold: '金币',
        diamond: '钻石',
        titanium: '钛晶石',
        starstone: '星耀石',
        cosmicstone: '宇宙石',
        superstone: '超能石',
        otherworldstone: '异界石',
        xingjiestone: '星界石',
        hundunstone: '混沌石',
        lingtone: '灵髓石',
        huangtone: '幻空石',
        mingtone: '冥源石',
        xutong: '虚空石',
        shitone: '时空石',
        weitone: '未来石',
        yongtone: '永恒石',
        wujitone: '无极石',
        daotone: '大道石'
    };
    return names[currency] || currency;
}
function getAutoConvertRatioText(currency) {
    const conversions = {
        gold: { to: 'diamond', rate: 1e5 },
        diamond: { to: 'titanium', rate: 1e8 },
        titanium: { to: 'starstone', rate: 1e8 },
        starstone: { to: 'cosmicstone', rate: 1e8 },
        cosmicstone: { to: 'superstone', rate: 1e9 },
        superstone: { to: 'otherworldstone', rate: 1e12 },
        otherworldstone: { to: 'xingjiestone', rate: 1e12 },
        xingjiestone: { to: 'hundunstone', rate: 1e12 },
        hundunstone: { to: 'lingtone', rate: 1e15 },
        lingtone: { to: 'huangtone', rate: 1e15 },
        huangtone: { to: 'mingtone', rate: 1e15 },
        mingtone: { to: 'xutong', rate: 1e20 },
        xutong: { to: 'shitone', rate: 1e20 },
        shitone: { to: 'weitone', rate: 1e20 },
        weitone: { to: 'yongtone', rate: 1e20 },
        yongtone: { to: 'wujitone', rate: 1e20 },
        wujitone: { to: 'daotone', rate: 1e20 }
    };
    const cfg = conversions[currency];
    if (!cfg) return '';
    return `${cfg.rate.toLocaleString()} ${getCurrencyName(currency)} = 1 ${getCurrencyName(cfg.to)}`;
}

// 修改切换函数，确保更新显示
function toggleAutoConvertCurrency(currency) {
    ensureAutoConvertCurrencyState();
    if (!getAllAutoConvertCurrencies().includes(currency)) return;
    player.autoConvertCurrency[currency] = !player.autoConvertCurrency[currency];
    
    // 更新按钮显示
    const btn = document.getElementById(`autoConvert${currency.charAt(0).toUpperCase() + currency.slice(1)}`);
    if (btn) {
        const ratioText = getAutoConvertRatioText(currency);
        btn.textContent = `${getCurrencyName(currency)}自动兑换：${player.autoConvertCurrency[currency] ? '开启' : '关闭'}${ratioText ? '（' + ratioText + '）' : ''}`;
    }
    
    logAction(`${getCurrencyName(currency)}自动兑换${player.autoConvertCurrency[currency] ? '开启' : '关闭'}`, 'info');
}

// 全局兜底：避免任意系统直接调用 toExponential 时输出 Infinity
(function patchNumberToExponentialOnce() {
    if (Number.prototype.__goldGameSafeExpPatched) return;
    const nativeToExponential = Number.prototype.toExponential;
    Object.defineProperty(Number.prototype, 'toExponential', {
        configurable: true,
        writable: true,
        value: function (fractionDigits) {
            const v = Number(this.valueOf());
            if (!Number.isFinite(v)) return v > 0 ? '1e308+' : (v < 0 ? '-1e308+' : '0');
            return nativeToExponential.call(v, fractionDigits);
        }
    });
    Object.defineProperty(Number.prototype, '__goldGameSafeExpPatched', {
        configurable: true,
        writable: false,
        enumerable: false,
        value: true
    });
})();


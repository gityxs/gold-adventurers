function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== "text/plain" && !file.name.endsWith('.txt')) {
        logAction("请选择.txt格式的存档文件", "error");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const encryptedData = e.target.result;
            decryptAndLoadSave(encryptedData);
        } catch (error) {
            logAction("存档导入失败：" + error.message, "error");
            console.error("存档导入错误:", error);
        }
    };
    reader.readAsText(file);
}

function decryptAndLoadSave(encryptedData) {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        const saveData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        
        player = migrateSaveData(saveData);
        if (typeof restoreExplorationDataFromSave === 'function') restoreExplorationDataFromSave(saveData);
        updateDisplay();
        logAction('加密存档导入成功！', 'success');
        
        localStorage.setItem('lastImportTime', Date.now().toString());
       saveGame();
      setTimeout(() => {
                location.reload(true);
            }, 1000);
    } catch (error) {
        logAction('存档导入失败：无效的存档或密钥错误', 'error');
        console.error('导入错误:', error);
    }
}

    function importSave() {
    const lastImportTime = localStorage.getItem('lastImportTime');
    if (lastImportTime) {
        const currentTime = Date.now();
        const timeDiff = currentTime - parseInt(lastImportTime);
        const cooldown = 6 * 60 * 60 * 1000; // 6小时冷却时间
        
        if (timeDiff < cooldown) {
            const remaining = Math.ceil((cooldown - timeDiff) / (60 * 1000));
            logAction(`导入功能冷却中，请等待 ${remaining} 分钟后再试`, "error");
            return;
        }
    }
    
    showCustomPrompt('请输入加密存档代码：', async (encryptedData) => {
        if (!encryptedData) return;
        
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
            const saveData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            
            player = migrateSaveData(saveData);
            if (typeof restoreExplorationDataFromSave === 'function') restoreExplorationDataFromSave(saveData);
            updateDisplay();
            logAction('存档已成功导入！', 'success');
            
            localStorage.setItem('lastImportTime', Date.now().toString());
      saveGame();
      setTimeout(() => {
                location.reload(true);
            }, 1000);
        } catch (error) {
            logAction('存档导入失败：无效的存档或密钥错误', 'error');
            console.error('导入错误:', error);
        }
    });
}

async function getEncryptedTime(key) {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
        return parseInt(decrypted.toString(CryptoJS.enc.Utf8));
    } catch {
        return null;
    }
}

async function setEncryptedTime(key, value) {
    const encrypted = CryptoJS.AES.encrypt(String(value), ENCRYPTION_KEY);
    localStorage.setItem(key, encrypted.toString());
}

function formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const mins = Math.floor((milliseconds % 3600000) / 60000);
    return `${hours}小时${mins}分钟`;
}
          function resetItems() {
      showCustomConfirm('确定要重置道具数据吗？所有道具将被清除！', (confirmed) => {
          if (confirmed) {
            player.items = {
                primaryGem: 0,
                advancedGem: 0,
                superiorGem: 0,
                divineGem: 0,
                vipPower: 0,
                refineStone: 0
            };

            updateItemDisplay();
            logAction('道具数据已重置', 'success');
           }
        });
   }
        function resetGame() {
            showCustomConfirm('确定要重置游戏吗？所有进度将丢失！', (confirmed) => {
                if (confirmed) {
                    localStorage.removeItem('goldGameSave');
                    player = {
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
                        reincarnationCoin: 0,
                        reincarnationCount: 0,
                        equipment: [],
                        vip: {
        level: 1,
        power: 0, // 累计VIP能力值数量
    },
                        items: {
                            primaryGem: 0,
                            advancedGem: 0,
                            superiorGem: 0,
                            divineGem: 0,
                            vipPower: 0,
                            refineStone: 0 // 新增洗炼石
                           
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
                            yanYuBiAn: { level: 0, cost: 1, multiplier: 72.30 },
                            yuyu1: { level: 0, cost: 1, multiplier: 218.70 },
                              yuyu2: { level: 0, cost: 1, multiplier: 656.10 },
                            yuyu3: { level: 0, cost: 1, multiplier: 1968.30 },
                              yuyu4: { level: 0, cost: 1, multiplier: 5904.90 },
                            yuyu5: { level: 0, cost: 1, multiplier: 17714.70 },
                            yuyu6: { level: 0, cost: 1, multiplier: 53144.10 },
                              yuyu7: { level: 0, cost: 1, multiplier: 159432.30 },
                            yuyu8: { level: 0, cost: 1, multiplier: 478296.90 }
                        },
                        dungeonEquipment: [], // 新增副本装备
                        soulRings: [], // 新增魂环系统
                        techniques: {},
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
                        lastUpdate: Date.now(),
                        achievements: {
        first_equipment: false,
        first_rare: false,
        first_epic: false,
        first_legendary: false,
        first_ancient: false,
        first_divine: false,
        first_arcane: false,
        first_celestial: false,
        first_infernal: false,
        first_astral: false,
        first_primeval: false,
        first_transcendental: false,
        first_quantum: false,
        first_ultimate: false,
        first_chaos: false,
        first_eternal: false,
        first_void: false,
        first_genesis: false,
        first_divineRealm: false,
        first_apocalypse: false,
        first_yeyu1: false,
        first_yeyu2: false,
        first_yeyu3: false,
        first_yeyu4: false,
        first_yeyu5: false,
        first_yeyu6: false,
        first_yeyu7: false,
        first_yeyu8: false,
        first_yeyu9: false,
        first_yeyu10: false,
        first_yeyu11: false,
        first_yeyu12: false,
        first_yeyu13: false,
        first_yeyu14: false,
        first_yeyu15: false,
        first_yeyu16: false,
        first_yeyu17: false,
        first_yeyu18: false,
        first_yeyu19: false,
        first_yeyu20: false,
        first_yeyu21: false,
        first_yeyu22: false,
        first_yeyu23: false,
        first_yeyu24: false,
        // 宝箱成就
        common_chest_100: false,
        common_chest_10000: false,
        common_chest_1000000: false,
        common_chest_10000000: false,
        common_chest_100000000: false,
        advanced_chest_100: false,
        advanced_chest_10000: false,
        advanced_chest_1000000: false,
        advanced_chest_10000000: false,
        advanced_chest_100000000: false,
        rare_chest_100: false,
        rare_chest_10000: false,
        rare_chest_1000000: false,
        rare_chest_10000000: false,
        rare_chest_100000000: false,
        epic_chest_100: false,
        epic_chest_10000: false,
        epic_chest_1000000: false,
        epic_chest_10000000: false,
        epic_chest_100000000: false,
        legendary_chest_100: false,
        legendary_chest_10000: false,
        legendary_chest_1000000: false,
        legendary_chest_10000000: false,
        legendary_chest_100000000: false,
        chaos_chest_100: false,
        chaos_chest_10000: false,
        chaos_chest_1000000: false,
        chaos_chest_10000000: false,
        chaos_chest_100000000: false,
        apocalypse_chest_100: false,
        apocalypse_chest_10000: false,
        apocalypse_chest_1000000: false,
        apocalypse_chest_10000000: false,
        apocalypse_chest_100000000: false,
        yeyu1_chest_100: false,
        yeyu1_chest_10000: false,
        yeyu1_chest_1000000: false,
        yeyu1_chest_10000000: false,
        yeyu1_chest_100000000: false,
        yeyu2_chest_100: false,
        yeyu2_chest_10000: false,
        yeyu2_chest_1000000: false,
        yeyu2_chest_10000000: false,
        yeyu2_chest_100000000: false,
        yeyu3_chest_100: false,
        yeyu3_chest_10000: false,
        yeyu3_chest_1000000: false,
        yeyu3_chest_10000000: false,
        yeyu3_chest_100000000: false,
        yeyu4_chest_100: false,
        yeyu4_chest_10000: false,
        yeyu4_chest_1000000: false,
        yeyu4_chest_10000000: false,
        yeyu4_chest_100000000: false,
        yeyu5_chest_100: false,
        yeyu5_chest_10000: false,
        yeyu5_chest_1000000: false,
        yeyu5_chest_10000000: false,
        yeyu5_chest_100000000: false,
        yeyu6_chest_100: false,
        yeyu6_chest_10000: false,
        yeyu6_chest_1000000: false,
        yeyu6_chest_10000000: false,
        yeyu6_chest_100000000: false,
        yeyu7_chest_100: false,
        yeyu7_chest_10000: false,
        yeyu7_chest_1000000: false,
        yeyu7_chest_10000000: false,
        yeyu7_chest_100000000: false,
        yeyu8_chest_100: false,
        yeyu8_chest_10000: false,
        yeyu8_chest_1000000: false,
        yeyu8_chest_10000000: false,
        yeyu8_chest_100000000: false,
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
    "world_boss_1st": false,
    "world_boss_top5": false,
    "world_boss_top10": false,
    "world_boss_participant": false,
    
        // 转生成就
        reincarnation_10: false,
        reincarnation_100: false,
        reincarnation_1000: false,
        reincarnation_10000: false
                        },
                        actionLogs: [], // 新增：统一存储所有操作日志
                        goldLogs: [], // 保留原有金币日志（如果仍需单独使用）
                        autoBuy: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // 对应 7 种宝箱的自动购买状态
                        autoBuyMaterialChest: false, // 新增：自动购买材料宝箱的状态
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
                            weitone: false
                        }, // 新增：自动兑换货币状态
                        clickTimestamps: [],
                        chestCounts: { common: 0, advanced: 0, rare: 0, epic: 0, legendary: 0 },
                        reincarnationStats: {
                            gpsBonus: { level: 0, cost: 1 },
                            equipmentLevelBonus: { level: 0, cost: 1 },
                            clickLimitBonus: { level: 0, cost: 1 }
                        },
                        materialChestCost: 1,
                        stockData: { // 新增股票数据
                            stocks: [
                                { name: '青龙至尊股', basePrice: 1, currentPrice: 1, lastPrice: 1, shares: 0, avgCost: 0 },
                                { name: '白虎至尊股', basePrice: 10, currentPrice: 10, lastPrice: 10, shares: 0, avgCost: 0 },
                                { name: '朱雀至尊股', basePrice: 100, currentPrice: 100, lastPrice: 100, shares: 0, avgCost: 0 },
                                { name: '玄武至尊股', basePrice: 1000, currentPrice: 1000, lastPrice: 1000, shares: 0, avgCost: 0 },
                                { name: '瑞兽白泽股', basePrice: 10000, currentPrice: 10000, lastPrice: 10000, shares: 0, avgCost: 0 }
                            ],
                            lastStockUpdate: Date.now()
                        },
                        lotteryResults: [], // 新增：彩票开奖结果
                        traditionalLotteryNumbers: [], // 新增：传统数字彩票号码
                        lastLotteryDraw: Date.now(), // 新增：上次开奖时间
                        bank: { // 新增银行系统
                            deposit: 0, // 存款金额
                            lastInterestUpdate: Date.now() // 上次利息计算时间
                        }
                    };
                    updateDisplay();
                    logAction('游戏已重置', 'success');
                }
            });
        }

        function showCustomConfirm(message, callback) {
            const dialog = document.getElementById('customDialog');
            const overlay = document.getElementById('dialogOverlay');
            document.getElementById('dialogMessage').textContent = message;
            document.getElementById('dialogInput').style.display = 'none';
            dialog.style.display = 'block';
            overlay.style.display = 'block';

            const confirmBtn = document.getElementById('dialogConfirm');
            const cancelBtn = document.getElementById('dialogCancel');

            const handler = (result) => {
                dialog.style.display = 'none';
                overlay.style.display = 'none';
                callback(result);
                confirmBtn.removeEventListener('click', confirmHandler);
                cancelBtn.removeEventListener('click', cancelHandler);
                overlay.removeEventListener('click', cancelHandler);
            };

            const confirmHandler = () => handler(true);
            const cancelHandler = () => handler(false);

            confirmBtn.addEventListener('click', confirmHandler);
            cancelBtn.addEventListener('click', cancelHandler);
            overlay.addEventListener('click', cancelHandler);
        }

        function showCustomPrompt(message, callback) {
            const dialog = document.getElementById('customDialog');
            const overlay = document.getElementById('dialogOverlay');
            document.getElementById('dialogMessage').textContent = message;
            document.getElementById('dialogInput').style.display = 'block'; // 显示输入框
            document.getElementById('dialogInput').value = ''; // 清空输入框

            dialog.style.display = 'block';
            overlay.style.display = 'block';

            const confirmBtn = document.getElementById('dialogConfirm');
            const cancelBtn = document.getElementById('dialogCancel');

            const handler = (result) => {
                dialog.style.display = 'none';
                overlay.style.display = 'none';
                document.getElementById('dialogInput').style.display = 'none'; // 隐藏输入框
                callback(result);
                confirmBtn.removeEventListener('click', confirmHandler);
                cancelBtn.removeEventListener('click', cancelHandler);
            };

            const confirmHandler = () => handler(document.getElementById('dialogInput').value);
            const cancelHandler = () => handler(null);

            confirmBtn.addEventListener('click', confirmHandler);
            cancelBtn.addEventListener('click', cancelHandler);
        }

        // 游戏初始化（loadSave 与首次改名提示见 bootstrap.js）
        // 主循环：高频逻辑每秒执行一次，重型逻辑按节拍分摊，避免每秒全量重算导致卡顿
        let _mainLoopTick = 0;
        registerInterval(() => {
    if (checkVersionBlocked()) return;
    // 保障：读档若走的是 loadSave() 未走 loadGame()，地主定时器不会启动；主循环里补启，确保不点进疯狂地主也会刷新天气/作物
    if (player.landlord && player.battle && player.battle.maxStage >= 2 && (player.landlord._timerId == null || player.landlord._timerId === undefined) && typeof startLandlordTimers === 'function') {
        startLandlordTimers();
    }

    _mainLoopTick = (_mainLoopTick + 1) % 600; // 最长到 600 秒后回滚，防止无限增大
    const is2sTick = _mainLoopTick % 2 === 0;   // 每 2 秒
    const is5sTick = _mainLoopTick % 5 === 0;   // 每 5 秒
    const is30sTick = _mainLoopTick % 30 === 0; // 每 30 秒

    let gpsPerSecond = getTotalGPS();
    // 如果在线且开启了加速，应用100倍加成
    if (document.visibilityState === 'visible' && player.onlineBoostEnabled) {
        gpsPerSecond = multiplyBigByFinite(gpsPerSecond, 100);
    }
    addGold(gpsPerSecond); // 每秒增加GPS（支持 >1e308）
    normalizeMainCurrencies();
    autoConvertCurrency();
    normalizeMainCurrencies();
    try { gainCultivationExp(); } catch (e) {
        if (typeof console !== 'undefined' && console.error) console.error('gainCultivationExp error', e);
    }
    try { calculateNightClubIncome(); } catch (e) {
        if (typeof console !== 'undefined' && console.error) console.error('calculateNightClubIncome error', e);
    }
    if (is2sTick) {
        try { updateLiveStreamUI(); } catch (e) {
            if (typeof console !== 'undefined' && console.error) console.error('updateLiveStreamUI error', e);
        }
    }
  // initAutoDecomposeUI 不再每秒调用，避免重复绑定 onchange 导致卡顿；仅在打开自动分解界面时调用
    checkAutoBuy();
    // 自动分解由下方 registerInterval(checkAutoDecompose, 10000) 负责，勿在此每秒遍历伴侣

    // 股票/基金/银行等重型计算改为每 5 秒刷新一次，明显降低压力
    if (is5sTick) {
        updateStockPrices(); 
        calculateBankInterest(); 
       updateFundValues();
    }

    // 离线远征奖励只需要低频刷新预览，这里降为每 30 秒一次
    if (is30sTick) {
      calculateOfflineExpeditionRewards();
    }

    checkAutoReincarnation(); // 检查自动转生
    if (is5sTick) {
        updateCompanionDisplay();
        updateLotteryCountdown();
    }

    // 核心数值相对轻量，可保持每秒刷新，保证数值体验
    updateCoreStatsDisplay();

    // 重型 UI（装备列表、成就等）开销较大，仅在低频节拍调用
    if (is2sTick) {
        updateHeavyDisplay();
    }

   if (player.battle.maxStage > 55555) {
        localStorage.removeItem('goldGameSave');
        player = {
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
                        reincarnationCoin: 0,
                        reincarnationCount: 0,
                        equipment: [],
                        vip: {
        level: 1,
        power: 0, // 累计VIP能力值数量
    },
                        items: {
                            primaryGem: 0,
                            advancedGem: 0,
                            superiorGem: 0,
                            divineGem: 0,
                            vipPower: 0,
                            refineStone: 0 // 新增洗炼石
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
                            yuyu8: { level: 0, cost: 1, multiplier: 478296.90 }
                        },
                        dungeonEquipment: [], // 新增副本装备
                        soulRings: [], // 新增魂环系统
                        techniques: {},
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
                        lastUpdate: Date.now(),
                        achievements: {
        first_equipment: false,
        first_rare: false,
        first_epic: false,
        first_legendary: false,
        first_ancient: false,
        first_divine: false,
        first_arcane: false,
        first_celestial: false,
        first_infernal: false,
        first_astral: false,
        first_primeval: false,
        first_transcendental: false,
        first_quantum: false,
        first_ultimate: false,
        first_chaos: false,
        first_eternal: false,
        first_void: false,
        first_genesis: false,
        first_divineRealm: false,
        first_apocalypse: false,
        first_yeyu1: false,
        first_yeyu2: false,
        first_yeyu3: false,
        first_yeyu4: false,
        first_yeyu5: false,
        first_yeyu6: false,
        first_yeyu7: false,
        first_yeyu8: false,
        first_yeyu9: false,
        first_yeyu10: false,
        first_yeyu11: false,
        first_yeyu12: false,
        first_yeyu13: false,
        first_yeyu14: false,
        first_yeyu15: false,
        first_yeyu16: false,
        first_yeyu17: false,
        first_yeyu18: false,
        first_yeyu19: false,
        first_yeyu20: false,
        first_yeyu21: false,
        first_yeyu22: false,
        first_yeyu23: false,
        first_yeyu24: false,
        // 宝箱成就
        common_chest_100: false,
        common_chest_10000: false,
        common_chest_1000000: false,
        common_chest_10000000: false,
        common_chest_100000000: false,
        advanced_chest_100: false,
        advanced_chest_10000: false,
        advanced_chest_1000000: false,
        advanced_chest_10000000: false,
        advanced_chest_100000000: false,
        rare_chest_100: false,
        rare_chest_10000: false,
        rare_chest_1000000: false,
        rare_chest_10000000: false,
        rare_chest_100000000: false,
        epic_chest_100: false,
        epic_chest_10000: false,
        epic_chest_1000000: false,
        epic_chest_10000000: false,
        epic_chest_100000000: false,
        legendary_chest_100: false,
        legendary_chest_10000: false,
        legendary_chest_1000000: false,
        legendary_chest_10000000: false,
        legendary_chest_100000000: false,
        chaos_chest_100: false,
        chaos_chest_10000: false,
        chaos_chest_1000000: false,
        chaos_chest_10000000: false,
        chaos_chest_100000000: false,
        apocalypse_chest_100: false,
        apocalypse_chest_10000: false,
        apocalypse_chest_1000000: false,
        apocalypse_chest_10000000: false,
        apocalypse_chest_100000000: false,
        yeyu1_chest_100: false,
        yeyu1_chest_10000: false,
        yeyu1_chest_1000000: false,
        yeyu1_chest_10000000: false,
        yeyu1_chest_100000000: false,
        yeyu2_chest_100: false,
        yeyu2_chest_10000: false,
        yeyu2_chest_1000000: false,
        yeyu2_chest_10000000: false,
        yeyu2_chest_100000000: false,
        yeyu3_chest_100: false,
        yeyu3_chest_10000: false,
        yeyu3_chest_1000000: false,
        yeyu3_chest_10000000: false,
        yeyu3_chest_100000000: false,
        yeyu4_chest_100: false,
        yeyu4_chest_10000: false,
        yeyu4_chest_1000000: false,
        yeyu4_chest_10000000: false,
        yeyu4_chest_100000000: false,
        yeyu5_chest_100: false,
        yeyu5_chest_10000: false,
        yeyu5_chest_1000000: false,
        yeyu5_chest_10000000: false,
        yeyu5_chest_100000000: false,
        yeyu6_chest_100: false,
        yeyu6_chest_10000: false,
        yeyu6_chest_1000000: false,
        yeyu6_chest_10000000: false,
        yeyu6_chest_100000000: false,
        yeyu7_chest_100: false,
        yeyu7_chest_10000: false,
        yeyu7_chest_1000000: false,
        yeyu7_chest_10000000: false,
        yeyu7_chest_100000000: false,
        yeyu8_chest_100: false,
        yeyu8_chest_10000: false,
        yeyu8_chest_1000000: false,
        yeyu8_chest_10000000: false,
        yeyu8_chest_100000000: false,
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
    "world_boss_1st": false,
    "world_boss_top5": false,
    "world_boss_top10": false,
    "world_boss_participant": false,
    
        // 转生成就
        reincarnation_10: false,
        reincarnation_100: false,
        reincarnation_1000: false,
        reincarnation_10000: false
                        },
                        actionLogs: [], // 新增：统一存储所有操作日志
                        goldLogs: [], // 保留原有金币日志（如果仍需单独使用）
                        autoBuy: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // 对应 7 种宝箱的自动购买状态
                        autoBuyMaterialChest: false, // 新增：自动购买材料宝箱的状态
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
                            weitone: false
                        }, // 新增：自动兑换货币状态
                        clickTimestamps: [],
                        chestCounts: { common: 0, advanced: 0, rare: 0, epic: 0, legendary: 0 },
                        reincarnationStats: {
                            gpsBonus: { level: 0, cost: 1 },
                            equipmentLevelBonus: { level: 0, cost: 1 },
                            clickLimitBonus: { level: 0, cost: 1 }
                        },
                        materialChestCost: 1,
                        stockData: { // 新增股票数据
                            stocks: [
                                { name: '青龙至尊股', basePrice: 1, currentPrice: 1, lastPrice: 1, shares: 0, avgCost: 0 },
                                { name: '白虎至尊股', basePrice: 10, currentPrice: 10, lastPrice: 10, shares: 0, avgCost: 0 },
                                { name: '朱雀至尊股', basePrice: 100, currentPrice: 100, lastPrice: 100, shares: 0, avgCost: 0 },
                                { name: '玄武至尊股', basePrice: 1000, currentPrice: 1000, lastPrice: 1000, shares: 0, avgCost: 0 },
                                { name: '瑞兽白泽股', basePrice: 10000, currentPrice: 10000, lastPrice: 10000, shares: 0, avgCost: 0 }
                            ],
                            lastStockUpdate: Date.now()
                        },
                        lotteryResults: [], // 新增：彩票开奖结果
                        traditionalLotteryNumbers: [], // 新增：传统数字彩票号码
                        lastLotteryDraw: Date.now(), // 新增：上次开奖时间
                        bank: { // 新增银行系统
                            deposit: 0, // 存款金额
                            lastInterestUpdate: Date.now() // 上次利息计算时间
                        }
        };
        updateDisplay();
        logAction('游戏已自动重置', 'success');
    }
}, 1000);

        // 页面可见性监听
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
                if (player && player.worldMapBattle && player.worldMapBattle.autoBattle && player.battle && player.battle.currentZone) {
                    window._worldMapBattleHiddenAt = Date.now();
                }
                if (typeof saveGame === 'function') saveGame({ silent: true });
            } else if (document.visibilityState === 'visible') {
                window._tradingOfflineRunThisSession = false; // 切回标签允许本次离线结算
                // loadSave 会替换 player，必须先停掉旧定时器，否则每次切回都会多挂一套后台战斗
                if (typeof stopAllWorldMapBattles === 'function') stopAllWorldMapBattles();
                loadSave();
                if (typeof clearWorldMapForegroundBattleTimer === 'function') clearWorldMapForegroundBattleTimer();
                if (player && player.backgroundBattle && typeof stopBackgroundBattle === 'function') stopBackgroundBattle();
                if (typeof catchUpWorldMapBackgroundBattle === 'function') catchUpWorldMapBackgroundBattle();
                if (typeof syncWorldMapAutoBattleTimers === 'function') syncWorldMapAutoBattleTimers();
                else if (typeof resumeWorldMapAutoBattleIfNeeded === 'function') resumeWorldMapAutoBattleIfNeeded();
                if (typeof runTradingOfflineIfNeeded === 'function') runTradingOfflineIfNeeded();
                updateDisplay();
                // 自动钓鱼防卡：切回页面后若已挂机超过约25秒仍显示在钓，视为被卡住，强制重置并续钓
                if (player.fishing && player.fishing.autoFishingEnabled && player.fishing.isFishing && player.fishing.fishingStartTime && (Date.now() - player.fishing.fishingStartTime > 25000)) {
                    try { resetFishing(); } catch (e) {}
                    if (player.fishing.autoFishingEnabled) setTimeout(function() { startFishing(); }, 500);
                }
            }
        });

        // 新增：切换游戏日志分页
        function switchLogTab(page) {
            document.getElementById('gameLogPage1').classList.remove('active');
            document.getElementById('gameLogPage2').classList.remove('active');
            document.getElementById('gameLogPage3').classList.remove('active');
            document.getElementById('gameLogPage4').classList.remove('active');
            document.getElementById(`gameLogPage${page}`).classList.add('active');
            document.querySelectorAll('.log-tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`.log-tab[onclick="switchLogTab(${page})"]`).classList.add('active');
        }
   function toggleAutoConvertUI() {
    const ui = document.getElementById('autoConvertUI');
    const overlay = document.getElementById('autoConvertOverlay');
    
    if (ui.style.display === 'none') {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        if (typeof updateAutoConvertDisplay === 'function') updateAutoConvertDisplay();
    } else {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    }
}
function toggleAutoBuyShopa() {
      if (player.level.ascentionCounta < 1) {
        alert("需要达到轮回1转才能开启轮回副本！");
        return;
    }
    const shop = document.getElementById('autoBuyShopa');
    shop.style.display = shop.style.display === 'none' ? 'block' : 'none';
}
function toggleAutoBuyShopb() {
      if (player.cultivation.stage < 2) {
        alert("需要达到修仙2级才能开启修仙副本！");
        return;
    }
    const shop = document.getElementById('autoBuyShopb');
    shop.style.display = shop.style.display === 'none' ? 'block' : 'none';
}
function toggleAutoBuyShop() {
    const shop = document.getElementById('autoBuyShop');
    if (shop.style.display === 'none') {
        shop.style.display = 'block';
        if (typeof syncAutoBuyPanelDisplay === 'function') syncAutoBuyPanelDisplay();
    } else {
        shop.style.display = 'none';
    }
}
function toggleShopUI() {
    const shopUI = document.getElementById('shopUI');
    const overlay = document.getElementById('shopOverlay');
    
    if (shopUI.style.display === 'none') {
        shopUI.style.display = 'block';
        overlay.style.display = 'block';
    } else {
        shopUI.style.display = 'none';
        overlay.style.display = 'none';
    }
}
function toggleSettingsUI() {
    const dialog = document.getElementById('settingsDialog');
    const overlay = document.getElementById('settingsOverlay');
    
    if (dialog.style.display === 'none') {
        dialog.style.display = 'block';
        overlay.style.display = 'block';
        var statusEl = document.getElementById('goldGameAccountStatus');
        if (statusEl && typeof getGoldGameAuthUsername === 'function')
            statusEl.textContent = getGoldGameAuthUsername() ? ('已登录: ' + getGoldGameAuthUsername()) : '未登录';
        if (typeof syncGoldGameAccountAuthButtons === 'function') syncGoldGameAccountAuthButtons();
        if (typeof updateGoldGameNetworkFloatToggleButton === 'function') updateGoldGameNetworkFloatToggleButton();
        if (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken() && typeof goldGameGetNetworkCoin === 'function') {
            goldGameGetNetworkCoin().then(function(r) {
                var el = document.getElementById('goldGameNetworkCoinDisplay');
                if (el) el.textContent = (r && r.ok && typeof r.amount === 'number') ? r.amount : '--';
            });
            if (typeof goldGameGetMapleCoin === 'function') {
                goldGameGetMapleCoin().then(function(r2) {
                    var el2 = document.getElementById('goldGameMapleCoinDisplay');
                    if (el2) el2.textContent = (r2 && r2.ok && typeof r2.amount === 'number') ? r2.amount : '--';
                });
            }
        } else {
            var el = document.getElementById('goldGameNetworkCoinDisplay');
            if (el) el.textContent = '--';
            var el2 = document.getElementById('goldGameMapleCoinDisplay');
            if (el2) el2.textContent = '--';
        }
    } else {
        dialog.style.display = 'none';
        overlay.style.display = 'none';
    }
}

window._networkFloatAnnouncementQueue = window._networkFloatAnnouncementQueue || [];
window._networkFloatAnnouncementPlaying = window._networkFloatAnnouncementPlaying || false;
window._networkFloatEscapeHtml = function(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};
window._networkFloatRarityColor = function(rarity) {
    var r = String(rarity || 'normal').toLowerCase();
    if (r === 'super' || r === 'legendary') return '#ffb300';
    if (r === 'shiny' || r === 'epic') return '#c77dff';
    if (r === 'variant' || r === 'rare') return '#64b5f6';
    return '#e0e0e0';
};
window._networkFloatTypeLabel = function(itemType) {
    var t = String(itemType || '').toLowerCase();
    if (t === 'artifact') return '深渊神器';
    if (t === 'abyssmaterial' || t === 'stone' || t === 'refinestone') return '深渊材料';
    if (t === 'abyssbeast') return '深渊神兽';
    if (t === 'abysspetequip') return '深渊宠物装备';
    if (t === 'abysspetneidan') return '深渊宠物内丹';
    if (t === 'abysspetshoujue') return '深渊宠物兽决';
    return '联网掉落';
};
window.showNetworkFloatAnnouncementBar = function(payload) {
    if (!payload) return;
    var msg = '';
    if (typeof payload === 'string') msg = payload.trim();
    if (!msg && typeof payload === 'object') {
        var pName = (payload.playerName != null && String(payload.playerName).trim()) ? String(payload.playerName).trim() : '神秘玩家';
        var floor = Number.isFinite(Number(payload.floor)) ? Number(payload.floor) : 0;
        var itemName = (payload.itemName != null && String(payload.itemName).trim()) ? String(payload.itemName).trim() : '未知联网物品';
        var itemColor = window._networkFloatRarityColor(payload.rarity);
        var typeLabel = window._networkFloatTypeLabel(payload.itemType);
        msg = window._networkFloatEscapeHtml(pName) + ' 在无限深渊击败第' + window._networkFloatEscapeHtml(floor) + '层BOSS，运气爆棚获得了【' + window._networkFloatEscapeHtml(typeLabel) + '】<span style="color:' + itemColor + ';text-shadow:0 0 8px rgba(255,255,255,.18);">' + window._networkFloatEscapeHtml(itemName) + '</span>';
    }
    if (!msg) return;
    var enabled = true;
    try { enabled = localStorage.getItem('goldGameNetworkFloatAnnouncementEnabled') !== 'false'; } catch (e) { enabled = true; }
    if (!enabled) return;
    var _floatQ = window._networkFloatAnnouncementQueue;
    _floatQ.push(msg);
    // 单条播报约 8s+，若入队快于播放会无限积压字符串，导致内存升高与主线程卡顿
    var _FLOAT_Q_MAX = 64;
    if (_floatQ.length > _FLOAT_Q_MAX) _floatQ.splice(0, _floatQ.length - _FLOAT_Q_MAX);
    if (window._networkFloatAnnouncementPlaying) return;
    var el = document.getElementById('networkFloatAnnouncementBar');
    if (!el) return;
    window._networkFloatAnnouncementPlaying = true;
    var playNext = function() {
        if (window._networkFloatAnnouncementQueue.length <= 0) {
            window._networkFloatAnnouncementPlaying = false;
            el.style.display = 'none';
            return;
        }
        var cur = window._networkFloatAnnouncementQueue.shift();
        el.innerHTML = cur;
        el.style.display = 'block';
        el.style.opacity = '0';
        el.style.transform = 'translateX(-50%) translateY(-16px)';
        requestAnimationFrame(function() {
            el.style.opacity = '1';
            el.style.transform = 'translateX(-50%) translateY(0)';
        });
        setTimeout(function() {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-50%) translateY(-14px)';
            setTimeout(playNext, 360);
        }, 8000);
    };
    playNext();
};

window._abyssOnlineChatLoopTimer = window._abyssOnlineChatLoopTimer || null;
window._abyssOnlineChatVisible = window._abyssOnlineChatVisible || false;
window._abyssOnlineChatLastRenderedId = window._abyssOnlineChatLastRenderedId || 0;
window._abyssOnlineChatCollapsed = window._abyssOnlineChatCollapsed || false;
window._abyssOnlineChatDragInited = window._abyssOnlineChatDragInited || false;
window._abyssOnlineChatDragActive = window._abyssOnlineChatDragActive || false;
window._abyssOnlineChatDragPointerId = window._abyssOnlineChatDragPointerId || null;
window._abyssOnlineChatPosKey = 'goldGameAbyssOnlineChatPos_v1';
window._abyssOnlineChatPos = window._abyssOnlineChatPos || null;

window._loadAbyssOnlineChatPos = function() {
    try {
        var raw = localStorage.getItem(window._abyssOnlineChatPosKey);
        if (!raw) return null;
        var obj = JSON.parse(raw);
        if (!obj || typeof obj !== 'object') return null;
        var left = Number(obj.left);
        var top = Number(obj.top);
        if (!Number.isFinite(left) || !Number.isFinite(top)) return null;
        return { left: left, top: top };
    } catch (e) {
        return null;
    }
};
window._saveAbyssOnlineChatPos = function(pos) {
    try {
        if (!pos || !Number.isFinite(pos.left) || !Number.isFinite(pos.top)) return;
        localStorage.setItem(window._abyssOnlineChatPosKey, JSON.stringify({ left: pos.left, top: pos.top }));
    } catch (e) {}
};
window._clampAbyssOnlineChatPos = function(panel, pos) {
    if (!panel || !pos) return pos;
    var w = panel.offsetWidth || 320;
    var h = panel.offsetHeight || 260;
    var maxLeft = Math.max(0, (window.innerWidth || 0) - w);
    var maxTop = Math.max(0, (window.innerHeight || 0) - h);
    return {
        left: Math.min(Math.max(0, pos.left), maxLeft),
        top: Math.min(Math.max(0, pos.top), maxTop),
    };
};
window.applyAbyssOnlineChatPanelPos = function() {
    var panel = document.getElementById('abyssOnlineChatPanel');
    if (!panel) return;
    var pos = window._abyssOnlineChatPos || window._loadAbyssOnlineChatPos();
    if (!pos) return; // 没保存就维持默认 top/right
    pos = window._clampAbyssOnlineChatPos(panel, pos);
    window._abyssOnlineChatPos = pos;
    panel.style.left = pos.left + 'px';
    panel.style.top = pos.top + 'px';
    panel.style.right = 'auto';
};
window.resetAbyssOnlineChatPanelPos = function() {
    var panel = document.getElementById('abyssOnlineChatPanel');
    if (!panel) return;
    window._abyssOnlineChatPos = null;
    try { localStorage.removeItem(window._abyssOnlineChatPosKey); } catch (e) {}
    panel.style.left = '';
    panel.style.top = '88px';
    panel.style.right = '12px';
};
window.initAbyssOnlineChatDraggable = function() {
    if (window._abyssOnlineChatDragInited) return;
    var panel = document.getElementById('abyssOnlineChatPanel');
    var handle = document.getElementById('abyssOnlineChatDragHandle');
    if (!panel || !handle) return;
    window._abyssOnlineChatDragInited = true;

    function isInteractiveTarget(t) {
        if (!t) return false;
        var tag = (t.tagName || '').toLowerCase();
        if (tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'select') return true;
        return false;
    }

    handle.addEventListener('dblclick', function(e) {
        // 双击标题栏：恢复默认位置
        try { e.preventDefault(); } catch (err) {}
        if (typeof window.resetAbyssOnlineChatPanelPos === 'function') window.resetAbyssOnlineChatPanelPos();
    });

    handle.addEventListener('pointerdown', function(e) {
        try { if (isInteractiveTarget(e.target)) return; } catch (err) {}
        if (!panel) return;
        window._abyssOnlineChatDragActive = true;
        window._abyssOnlineChatDragPointerId = e.pointerId;
        try { handle.setPointerCapture(e.pointerId); } catch (err) {}

        // 基于当前真实位置计算拖拽偏移（支持默认 right 定位或已保存 left）
        var rect = panel.getBoundingClientRect();
        var startLeft = rect.left;
        var startTop = rect.top;
        var dx = e.clientX - startLeft;
        var dy = e.clientY - startTop;
        panel.style.right = 'auto';

        function onMove(ev) {
            if (!window._abyssOnlineChatDragActive) return;
            if (window._abyssOnlineChatDragPointerId != null && ev.pointerId !== window._abyssOnlineChatDragPointerId) return;
            var left = ev.clientX - dx;
            var top = ev.clientY - dy;
            var pos = window._clampAbyssOnlineChatPos(panel, { left: left, top: top });
            panel.style.left = pos.left + 'px';
            panel.style.top = pos.top + 'px';
            window._abyssOnlineChatPos = pos;
        }
        function onUp(ev) {
            if (window._abyssOnlineChatDragPointerId != null && ev.pointerId !== window._abyssOnlineChatDragPointerId) return;
            window._abyssOnlineChatDragActive = false;
            window._abyssOnlineChatDragPointerId = null;
            document.removeEventListener('pointermove', onMove, true);
            document.removeEventListener('pointerup', onUp, true);
            if (window._abyssOnlineChatPos) window._saveAbyssOnlineChatPos(window._abyssOnlineChatPos);
        }
        document.addEventListener('pointermove', onMove, true);
        document.addEventListener('pointerup', onUp, true);
        try { e.preventDefault(); } catch (err) {}
    }, { passive: false });

    window.addEventListener('resize', function() {
        if (typeof window.applyAbyssOnlineChatPanelPos === 'function') window.applyAbyssOnlineChatPanelPos();
    });
};
window.applyAbyssOnlineChatCollapsed = function() {
    var body = document.getElementById('abyssOnlineChatBody');
    var btn = document.getElementById('abyssOnlineChatCollapseBtn');
    if (!body || !btn) return;
    if (window._abyssOnlineChatCollapsed) {
        body.style.display = 'none';
        btn.textContent = '展开';
    } else {
        body.style.display = 'block';
        btn.textContent = '折叠';
    }
};
window.toggleAbyssOnlineChatCollapse = function() {
    window._abyssOnlineChatCollapsed = !window._abyssOnlineChatCollapsed;
    window.applyAbyssOnlineChatCollapsed();
};
window._abyssChatViewportPrevContent = window._abyssChatViewportPrevContent || '';

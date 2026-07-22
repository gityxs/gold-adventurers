// 结婚系统
// ========== 结婚系统 · 10种趣味玩法 ==========
function marriageAnniversaryCelebrate() {
    if (!player.marriage || !player.marriage.isMarried) { logAction("需要先结婚", "error"); return; }
    var m = player.marriage;
    var marriedDate = new Date(m.marriageDate);
    var now = new Date();
    var thisYear = now.getFullYear();
    if ((m.lastAnniversaryClaim || 0) >= thisYear) { logAction("今年纪念日已庆祝过啦，明年再来！", "info"); return; }
    var annivMonth = marriedDate.getMonth(), annivDay = marriedDate.getDate();
    var nowMonth = now.getMonth(), nowDay = now.getDate();
    if (nowMonth !== annivMonth || Math.abs(nowDay - annivDay) > 3) { logAction("请在结婚纪念日前后3天内庆祝（纪念日: " + (annivMonth+1) + "月" + annivDay + "日）", "info"); return; }
    var reward = 50000 + m.loveLevel * 500;
    var expGain = 5000 + m.loveLevel * 50;
    showCustomConfirm("【纪念日庆祝】\n\n消耗：无（需在结婚纪念日前后3天内）\n获得：资金 " + reward + " 元，恩爱经验 +" + expGain + "\n\n确定庆祝吗？", function(confirmed) {
        if (!confirmed) return;
        m.lastAnniversaryClaim = thisYear;
        player.investmentGame.userData.availableFunds += reward;
        if (m.loveLevel < 999) { m.loveExp += expGain; checkLoveLevelUp(); }
        logAction("纪念日庆祝！获得 " + reward + " 资金，恩爱经验 +" + expGain, "success");
        updateMarriageUI(); updateDisplay(); saveGame();
    });
}

function marriageWriteLoveLetter() {
    if (!player.marriage || !player.marriage.isMarried) { logAction("需要先结婚", "error"); return; }
    var m = player.marriage;
    if (m.loveLevel >= 999) { logAction("恩爱已满，情书无法再增加经验", "info"); return; }
    if (player.investmentGame.userData.availableFunds < 520) { logAction("需要 520 元买信纸", "error"); return; }
    showCustomConfirm("【写情书】\n\n消耗：520 元（信纸）\n获得：恩爱经验 10～100（随机）\n\n确定书写吗？", function(confirmed) {
        if (!confirmed) return;
        player.investmentGame.userData.availableFunds -= 520;
        m.loveLettersWritten = (m.loveLettersWritten || 0) + 1;
        var expGain = 10 + Math.floor(Math.random() * 91);
        m.loveExp += expGain;
        checkLoveLevelUp();
        logAction("你给 " + m.spouseName + " 写了一封情书，恩爱经验 +" + expGain, "success");
        updateMarriageUI(); updateDisplay(); saveGame();
    });
}

function marriageCoupleChallenge() {
    if (!player.marriage || !player.marriage.isMarried) { logAction("需要先结婚", "error"); return; }
    var m = player.marriage;
    var cost = 88888;
    if (player.investmentGame.userData.availableFunds < cost) { logAction("需要 " + cost + " 元报名夫妻挑战", "error"); return; }
    showCustomConfirm("【夫妻挑战】\n\n消耗：88,888 元（报名费）\n获得：约 60%+ 概率胜利；胜利得恩爱 800～1500 + 资金 10000～80000；失败无奖励\n\n确定参加吗？", function(confirmed) {
        if (!confirmed) return;
        player.investmentGame.userData.availableFunds -= cost;
        var win = Math.random() < 0.6 + m.loveLevel * 0.0003;
        m.coupleChallengesDone = (m.coupleChallengesDone || 0) + 1;
        if (win) {
            var expGain = 800 + Math.floor(Math.random() * 701);
            m.loveExp += expGain;
            checkLoveLevelUp();
            var gold = Math.floor(10000 + Math.random() * 70001);
            player.investmentGame.userData.availableFunds += gold;
            logAction("夫妻挑战胜利！恩爱 +" + expGain + "，获得 " + gold + " 资金", "success");
        } else {
            logAction("夫妻挑战失败，下次加油！默契会越来越好的", "info");
        }
        updateMarriageUI(); updateDisplay(); saveGame();
    });
}

var marriageDateSpots = [
    { name: "咖啡厅", cost: 1999, exp: 500, needLevel: 1 },
    { name: "游乐园", cost: 9999, exp: 2500, needLevel: 5 },
    { name: "海边日落", cost: 29999, exp: 8000, needLevel: 15 },
    { name: "雪山温泉", cost: 88888, exp: 25000, needLevel: 30 },
    { name: "环球旅行", cost: 520000, exp: 100000, needLevel: 50 }
];
function marriageDateSpot() {
    if (!player.marriage || !player.marriage.isMarried) { logAction("需要先结婚", "error"); return; }
    var m = player.marriage;
    var idx = Math.min(m.dateSpotLevel || 0, marriageDateSpots.length - 1);
    var spot = marriageDateSpots[idx];
    if (m.loveLevel < spot.needLevel) { logAction("需要恩爱等级 " + spot.needLevel + " 才能去「" + spot.name + "」", "error"); return; }
    if (player.investmentGame.userData.availableFunds < spot.cost) { logAction("需要 " + spot.cost + " 元", "error"); return; }
    showCustomConfirm("【约会地点 · " + spot.name + "】\n\n消耗：" + spot.cost.toLocaleString() + " 元\n获得：恩爱经验 +" + spot.exp + "（需恩爱等级 " + spot.needLevel + "）\n\n确定去约会吗？", function(confirmed) {
        if (!confirmed) return;
        player.investmentGame.userData.availableFunds -= spot.cost;
        if (m.loveLevel < 999) { m.loveExp += spot.exp; checkLoveLevelUp(); }
        if (idx < marriageDateSpots.length - 1 && m.loveLevel >= marriageDateSpots[idx + 1].needLevel) m.dateSpotLevel = idx + 1;
        logAction("与 " + m.spouseName + " 在「" + spot.name + "」约会，恩爱 +" + spot.exp, "success");
        updateMarriageUI(); updateDisplay(); saveGame();
    });
}

function marriageRenewVows() {
    if (!player.marriage || !player.marriage.isMarried) { logAction("需要先结婚", "error"); return; }
    var m = player.marriage;
    var cost = 52013140;
    if (player.investmentGame.userData.availableFunds < cost) { logAction("需要 " + cost.toLocaleString() + " 元重温誓言", "error"); return; }
    var nextExp = 15000 + (m.vowsRenewed || 0) * 1000 + 1000;
    showCustomConfirm("【誓言重温】\n\n消耗：52,013,140 元\n获得：恩爱经验 +" + (15000 + (m.vowsRenewed || 0) * 1000) + "～+" + nextExp + "（次数越多单次越多）\n\n确定重温吗？", function(confirmed) {
        if (!confirmed) return;
        player.investmentGame.userData.availableFunds -= cost;
        m.vowsRenewed = (m.vowsRenewed || 0) + 1;
        var expGain = 15000 + m.vowsRenewed * 1000;
        if (m.loveLevel < 999) { m.loveExp += expGain; checkLoveLevelUp(); }
        logAction("与 " + m.spouseName + " 重温誓言，恩爱 +" + expGain, "success");
        updateMarriageUI(); updateDisplay(); saveGame();
    });
}

function marriageSpouseWork() {
    if (!player.marriage || !player.marriage.isMarried) { logAction("需要先结婚", "error"); return; }
    var m = player.marriage;
    var cooldown = 60 * 60 * 1000;
    var now = Date.now();
    if (m.spouseWorkLastTime && (now - m.spouseWorkLastTime) < cooldown) {
        var left = Math.ceil((cooldown - (now - m.spouseWorkLastTime)) / 60000);
        logAction("配偶打工冷却中，约 " + left + " 分钟后再试", "info"); return;
    }
    var earnMin = 5000 + m.loveLevel * 80;
    var earnMax = earnMin + 2000;
    showCustomConfirm("【配偶打工】\n\n消耗：无（冷却 1 小时）\n获得：资金 " + earnMin + "～" + earnMax + " 元（随恩爱等级与随机）\n\n确定让配偶去打工吗？", function(confirmed) {
        if (!confirmed) return;
        m.spouseWorkLastTime = Date.now();
        var earn = 5000 + m.loveLevel * 80 + Math.floor(Math.random() * 2000);
        player.investmentGame.userData.availableFunds += earn;
        logAction(m.spouseName + " 打工归来，带回 " + earn + " 元", "success");
        updateDisplay(); saveGame();
    });
}

function marriageSyncQuiz() {
    if (!player.marriage || !player.marriage.isMarried) { logAction("需要先结婚", "error"); return; }
    var m = player.marriage;
    if (m.loveLevel >= 999) { logAction("恩爱已满，默契考验不再增加经验", "info"); return; }
    var quizCost = 52022;
    if (player.investmentGame.userData.availableFunds < quizCost) { logAction("需要 " + quizCost.toLocaleString() + " 元参加默契考验", "error"); return; }
    showCustomConfirm("【默契考验】\n\n消耗：52,022 元\n获得：答对恩爱 +1200，答错恩爱 +300（安慰奖）\n\n确定开始考验吗？", function(confirmed) {
        if (!confirmed) return;
        if (player.investmentGame.userData.availableFunds < quizCost) { logAction("资金不足", "error"); return; }
        player.investmentGame.userData.availableFunds -= quizCost;
        var questions = [
            { q: "伴侣最爱吃什么？", opts: ["甜食", "辣味", "清淡", "随便"], right: 0 },
            { q: "纪念日最想怎么过？", opts: ["旅行", "在家", "大餐", "惊喜"], right: 3 },
            { q: "吵架后谁先和好？", opts: ["我", "对方", "一起", "从不吵"], right: 2 }
        ];
        var r = questions[Math.floor(Math.random() * questions.length)];
        var choice = r.right;
        if (Math.random() < 0.3) choice = Math.floor(Math.random() * r.opts.length);
        m.syncQuizCount = (m.syncQuizCount || 0) + 1;
        var expGain = choice === r.right ? 1200 : 300;
        if (m.loveLevel < 999) { m.loveExp += expGain; checkLoveLevelUp(); }
        logAction((choice === r.right ? "默契考验答对！" : "默契考验答错，也有安慰奖。") + " 恩爱 +" + expGain, choice === r.right ? "success" : "info");
        updateMarriageUI(); saveGame();
    });
}

function marriageSurpriseGift() {
    if (!player.marriage || !player.marriage.isMarried) { logAction("需要先结婚", "error"); return; }
    var m = player.marriage;
    var surpriseGiftCooldownMs = 24 * 60 * 60 * 1000;
    var now = Date.now();
    var last = m.surpriseGiftLastAttemptTime || 0;
    if (last && (now - last) < surpriseGiftCooldownMs) {
        var leftMin = Math.ceil((surpriseGiftCooldownMs - (now - last)) / 60000);
        logAction("惊喜礼物冷却中，约 " + leftMin + " 分钟后再试（每 24 小时限试 1 次）", "info");
        return;
    }
    var giftMin = 3000 + m.loveLevel * 30;
    var giftMax = giftMin + 5000;
    showCustomConfirm("【惊喜礼物】\n\n消耗：无（冷却 24 小时，每次确认即计一次尝试）\n获得：约 35% 概率触发，获得资金 " + giftMin + "～" + giftMax + " 元（未触发则无奖励）\n\n确定试试手气吗？", function(confirmed) {
        if (!confirmed) return;
        if (!player.marriage || !player.marriage.isMarried) return;
        m = player.marriage;
        now = Date.now();
        last = m.surpriseGiftLastAttemptTime || 0;
        if (last && (now - last) < surpriseGiftCooldownMs) {
            var leftM = Math.ceil((surpriseGiftCooldownMs - (now - last)) / 60000);
            logAction("惊喜礼物冷却中，约 " + leftM + " 分钟后再试", "info");
            return;
        }
        m.surpriseGiftLastAttemptTime = Date.now();
        if (Math.random() > 0.35) { logAction("这次没有惊喜，冷却已计入，下次再来~", "info"); saveGame(); return; }
        m.surpriseGiftCount = (m.surpriseGiftCount || 0) + 1;
        var gift = 3000 + m.loveLevel * 30 + Math.floor(Math.random() * 5000);
        player.investmentGame.userData.availableFunds += gift;
        logAction(m.spouseName + " 送你惊喜礼物，获得 " + gift + " 元！", "success");
        updateDisplay(); saveGame();
    });
}

function marriageDailyQuest() {
    if (!player.marriage || !player.marriage.isMarried) { logAction("需要先结婚", "error"); return; }
    var m = player.marriage;
    var today = Math.floor(Date.now() / 86400000);
    var prog = m.dailyQuestProgress || { day: 0, completed: 0, gifts: 0, timeSpent: 0 };
    if (prog.day !== today) { prog.day = today; prog.completed = 0; prog.gifts = 0; prog.timeSpent = 0; }
    if (prog.completed) { logAction("今日恩爱任务已完成，明日再来", "info"); return; }
    var needGifts = 2, needTime = 1;
    var msg = "【恩爱任务】\n\n消耗：今日完成「送礼物 " + needGifts + " 次」+「共度时光 " + needTime + " 次」\n获得：恩爱经验 +3000，资金 +8,888 元\n\n当前进度：送礼物 " + prog.gifts + "/" + needGifts + "，共度时光 " + prog.timeSpent + "/" + needTime + "\n\n确定领取/查看吗？";
    showCustomConfirm(msg, function(confirmed) {
        if (!confirmed) return;
        m.dailyQuestProgress = prog;
        if (prog.gifts >= needGifts && prog.timeSpent >= needTime) {
            prog.completed = 1;
            var expGain = 3000;
            if (m.loveLevel < 999) { m.loveExp += expGain; checkLoveLevelUp(); }
            player.investmentGame.userData.availableFunds += 8888;
            logAction("完成今日恩爱任务！恩爱 +" + expGain + "，获得 8888 元", "success");
        } else {
            logAction("今日任务：送礼物 " + prog.gifts + "/" + needGifts + " 次，共度时光 " + prog.timeSpent + "/" + needTime + " 次", "info");
        }
        updateMarriageUI(); updateDisplay(); saveGame();
    });
}

function marriageRingUpgrade() {
    if (!player.marriage || !player.marriage.isMarried) { logAction("需要先结婚", "error"); return; }
    var m = player.marriage;
    var maxRing = 100;
    var lv = m.ringLevel || 0;
    if (lv >= maxRing) { logAction("婚戒已满级 " + maxRing + " 级", "info"); return; }
    var cost = Math.floor(10000 * Math.pow(2, lv));
    if (player.investmentGame.userData.availableFunds < cost) { logAction("升级婚戒需要 " + cost.toLocaleString() + " 元", "error"); return; }
    showCustomConfirm("【婚戒升级】\n\n消耗：" + cost.toLocaleString() + " 元（当前 " + lv + " 级 → " + (lv + 1) + " 级，每级消耗×2，初始 10000）\n获得：永久 GPS +50%，点击 +20%（每级，最高 " + maxRing + " 级）\n\n确定升级吗？", function(confirmed) {
        if (!confirmed) return;
        player.investmentGame.userData.availableFunds -= cost;
        m.ringLevel = lv + 1;
        updateMarriageBonuses();
        logAction("婚戒升级至 " + m.ringLevel + " 级！永久加成提升", "success");
        updateMarriageUI(); updateDisplay(); saveGame();
    });
}

function checkMarriageAchievements() { }

// 恩爱任务进度：在赠送礼物/共度时光时增加计数
function addMarriageDailyQuestProgress(gifts, timeSpent) {
    var m = player.marriage;
    if (!m || !m.isMarried || !m.dailyQuestProgress) return;
    var today = Math.floor(Date.now() / 86400000);
    if (m.dailyQuestProgress.day !== today) return;
    if (gifts) m.dailyQuestProgress.gifts = (m.dailyQuestProgress.gifts || 0) + 1;
    if (timeSpent) m.dailyQuestProgress.timeSpent = (m.dailyQuestProgress.timeSpent || 0) + 1;
}

// 恩爱等级系统
function getLoveExpRequired(level) {
    // 999级为上限
    if (level >= 999) {
        return "∞";
    }
    
    // 动态经验公式：每级需求逐渐增加
    const baseExp = 1000;
    const growthFactor = 1.1; // 每级增加10%需求
    return Math.floor(baseExp * Math.pow(growthFactor, level - 1));
}

function checkLoveLevelUp() {
    const marriage = player.marriage;
    
    // 检查是否已达上限
    if (marriage.loveLevel >= 999) {
        marriage.loveExp = 0;
        return;
    }
    
    let expRequired = getLoveExpRequired(marriage.loveLevel);
    
    while (marriage.loveExp >= expRequired && marriage.loveLevel < 9999) {
        marriage.loveExp -= expRequired;
        marriage.loveLevel++;
        
        logAction(`恩爱等级提升到 ${marriage.loveLevel} 级！`, "success");
        
        // 达到上限时提示
        if (marriage.loveLevel >= 999) {
            logAction("恭喜！恩爱等级已达上限(999级)！", "success");
            marriage.loveExp = 0;
            break;
        }
        
        expRequired = getLoveExpRequired(marriage.loveLevel);
        
        // 更新婚姻加成
        updateMarriageBonuses();
    }
}

// 更新婚姻加成（含婚戒）
function updateMarriageBonuses() {
    const marriage = player.marriage;
    if (!marriage || !marriage.marriageBonuses) return;
    const level = marriage.loveLevel;
    const ring = marriage.ringLevel || 0;
    const ringGps = ring * 0.50;
    const ringClick = ring * 0.20;
    marriage.marriageBonuses.gpsMultiplier = 1 + (level * 1) + ringGps;
    marriage.marriageBonuses.clickMultiplier = 1 + (level * 0.5) + ringClick;
    marriage.marriageBonuses.critRateBonus = 1 + (level * 1);
    marriage.marriageBonuses.critDamageBonus = 1 + (level * 0.5);
    const bonusInfo = document.getElementById('bonusInfo');
    if (bonusInfo) {
        const isMaxLevel = level >= 999;
        var html = '<div class="m-info-row"><span>GPS加成</span><span>+' + ((marriage.marriageBonuses.gpsMultiplier - 1) * 100).toFixed(1) + '%' + (ring ? ' (含婚戒+' + (ring * 50) + '%)' : '') + '</span></div>';
        html += '<div class="m-info-row"><span>点击加成</span><span>+' + ((marriage.marriageBonuses.clickMultiplier - 1) * 100).toFixed(1) + '%' + (ring ? ' (含婚戒+' + (ring * 20) + '%)' : '') + '</span></div>';
        html += '<div class="m-info-row"><span>生命</span><span>+' + (marriage.marriageBonuses.critRateBonus * 100).toFixed(2) + '%</span></div>';
        html += '<div class="m-info-row"><span>爆伤</span><span>+' + (marriage.marriageBonuses.critDamageBonus * 100).toFixed(1) + '%</span></div>';
        bonusInfo.innerHTML = html;
    }
}

function addMarriageSystemToGameLoop() {
    var reg = typeof registerSingletonInterval === 'function' ? registerSingletonInterval : null;
    var start = function(fn, ms) {
        return reg ? reg('_marriageSystemLoopId', fn, ms) : registerInterval(fn, ms);
    };
    start(() => {
        if (player.marriage && player.marriage.isMarried) {
            // 每分钟自动增加少量恩爱经验（离线收益）
            const now = Date.now();
            const lastUpdate = player.marriage.lastUpdate || now;
            const minutesPassed = Math.floor((now - lastUpdate) / (1000 * 60));
            
            if (minutesPassed > 0) {
                // 达到上限时不增加经验
                if (player.marriage.loveLevel < 999) {
                    player.marriage.loveExp += minutesPassed * player.marriage.loveLevel;
                    player.marriage.lastUpdate = now;
                    
                    // 检查是否升级
                    checkLoveLevelUp();
                    
                    // 每10分钟保存一次
                    if (minutesPassed % 10 === 0) {
                        saveGame();
                    }
                }
            }
            
            // 检查成就
            checkMarriageAchievements();
        }
    }, 60000); // 每分钟检查一次
}

function initMarriageSystem() {
    if (!player.marriage) {
        player.marriage = getDefaultMarriageData();
    }
    player.marriage.lastUpdate = player.marriage.lastUpdate || Date.now();
    if (player.marriage.marriageBonuses.multiAttackBonus == null) player.marriage.marriageBonuses.multiAttackBonus = 0;
    initMarriageData();
    addMarriageSystemToGameLoop();
}

// 新增：检查是否达到等级上限的函数
function isMaxLoveLevel() {
    return player.marriage && player.marriage.isMarried && player.marriage.loveLevel >= 999;
}
// 宝物配置
const treasureConfig = [
    { id: 1, name: "青铜古剑", rarity: 1, baseValue: 200, description: "古老的青铜剑，散发着历史的气息", color: "#CD7F32" },
    { id: 2, name: "翡翠玉佩", rarity: 2, baseValue: 5000, description: "晶莹剔透的翡翠，蕴含着神秘力量", color: "#32CD32" },
    { id: 3, name: "夜明珠", rarity: 3, baseValue: 50000, description: "夜晚能发出柔和光芒的宝珠", color: "#87CEEB" },
    { id: 4, name: "龙纹宝鼎", rarity: 4, baseValue: 100000, description: "刻有龙纹的神秘宝鼎，传说能炼化万物", color: "#FF4500" },
    { id: 5, name: "凤凰羽扇", rarity: 5, baseValue: 1000000, description: "用凤凰羽毛制成的扇子，轻轻一扇可呼风唤雨", color: "#FF1493" },
    { id: 6, name: "麒麟角", rarity: 6, baseValue: 5000000, description: "神兽麒麟的角，蕴含着强大的生命力量", color: "#9400D3" },
    { id: 7, name: "玄武甲", rarity: 7, baseValue: 10000000, description: "神兽玄武的甲壳，坚不可摧", color: "#008080" },
    { id: 8, name: "白虎牙", rarity: 8, baseValue: 50000000, description: "神兽白虎的牙齿，锋利无比", color: "#F5F5F5" },
    { id: 9, name: "朱雀羽", rarity: 9, baseValue: 100000000, description: "神兽朱雀的羽毛，燃烧着永恒火焰", color: "#DC143C" },
    { id: 10, name: "青龙鳞", rarity: 10, baseValue: 5201314, description: "彩礼青龙鳞，象征爱情结晶", color: "#1E90FF" }
];

// 初始化宝物数据
function initTreasureData() {
    if (!player.treasures) {
        player.treasures = {
            inventory: [],
            totalFound: 0,
            totalSold: 0,
            foundCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 确保10个元素的数组
            soldCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
    } else {
        // 确保数组长度正确
        if (!player.treasures.foundCount || player.treasures.foundCount.length < 10) {
            player.treasures.foundCount = new Array(10).fill(0);
        }
        if (!player.treasures.soldCount || player.treasures.soldCount.length < 10) {
            player.treasures.soldCount = new Array(10).fill(0);
        }
        if (!player.treasures.inventory) {
            player.treasures.inventory = [];
        }
    }
}

// 切换宝物系统界面
function toggleTreasureSystem() {
    const ui = document.getElementById('treasureSystemUI');
    const overlay = document.getElementById('treasureSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        initTreasureData();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateTreasureUI();
    }
}

function closeTreasureSystem() {
    document.getElementById('treasureSystemUI').style.display = 'none';
    document.getElementById('treasureSystemOverlay').style.display = 'none';
}

// 挖矿时有1%几率获得宝物
function checkTreasureDrop() {
    try {
        // 确保宝物系统已初始化
        if (!player.treasures) {
            initTreasureData();
        }
        
        // 1%几率获得宝物
        if (Math.random() < 0.01) {
            const treasure = getRandomTreasure();
            if (treasure) {
                addTreasureToInventory(treasure.id);
                logAction(`🎉 挖矿时发现了宝物：${treasure.name}！`, "success");
                return true; // 成功获得宝物
            }
        }
        return false; // 未获得宝物
    } catch (error) {
        console.error('宝物掉落错误详情:', error);
        logAction("宝物掉落出现错误，请检查控制台", "error");
        return false;
    }
}

// 获取随机宝物（稀有度越高的宝物几率越低）
function getRandomTreasure() {
    try {
        const rand = Math.random();
        let rarity;
        
        // 根据概率分布确定稀有度
    if (rand < 0.85) rarity = 1;        // 85% 几率获得1级宝物
else if (rand < 0.954) rarity = 2;  // 10.4% 几率获得2级宝物
else if (rand < 0.9893) rarity = 3; // 3.53% 几率获得3级宝物
else if (rand < 0.9993334) rarity = 4; // 1.0034% 几率获得4级宝物
else if (rand < 0.9993834) rarity = 5; // 0.05% 几率获得5级宝物
else if (rand < 0.9993934) rarity = 6; // 0.01% 几率获得6级宝物
else if (rand < 0.9993984) rarity = 7; // 0.005% 几率获得7级宝物
else if (rand < 0.9993994) rarity = 8; // 0.001% 几率获得8级宝物
else if (rand < 0.9993999) rarity = 9; // 0.0005% 几率获得9级宝物
else rarity = 10;                     // 0.0001% 几率获得10级宝物                 
        
        // 获取该稀有度的所有宝物
        const availableTreasures = treasureConfig.filter(t => t.rarity === rarity);
        
        if (availableTreasures.length === 0) {
            console.warn(`没有找到稀有度为 ${rarity} 的宝物`);
            // 如果该稀有度没有宝物，返回最低稀有度的宝物
            return treasureConfig[0];
        }
        
        const selectedTreasure = availableTreasures[Math.floor(Math.random() * availableTreasures.length)];
        console.log(`获得宝物: ${selectedTreasure.name}, 稀有度: ${selectedTreasure.rarity}`);
        return selectedTreasure;
        
    } catch (error) {
        console.error('获取随机宝物错误:', error);
        // 出错时返回默认的第一个宝物
        return treasureConfig[0];
    }
}
// 添加宝物到库存
function addTreasureToInventory(treasureId) {
    try {
        // 验证宝物ID
        if (!treasureId || treasureId < 1 || treasureId > 10) {
            console.error('无效的宝物ID:', treasureId);
            return false;
        }
        
        const treasure = treasureConfig.find(t => t.id === treasureId);
        if (!treasure) {
            console.error('未找到ID为', treasureId, '的宝物');
            return false;
        }
        
        // 确保inventory数组存在
        if (!player.treasures.inventory) {
            player.treasures.inventory = [];
        }
        
        // 检查是否已拥有该宝物
        let existingTreasure = null;
        for (let i = 0; i < player.treasures.inventory.length; i++) {
            if (player.treasures.inventory[i].id === treasureId) {
                existingTreasure = player.treasures.inventory[i];
                break;
            }
        }
        
        if (existingTreasure) {
            // 增加数量
            existingTreasure.quantity = (existingTreasure.quantity || 0) + 1;
        } else {
            // 添加新宝物
            player.treasures.inventory.push({
                id: treasureId,
                quantity: 1,
                foundDate: Date.now()
            });
        }
        
        // 更新统计
        player.treasures.totalFound = (player.treasures.totalFound || 0) + 1;
        
        // 确保统计数组存在
        if (!player.treasures.foundCount) {
            player.treasures.foundCount = new Array(10).fill(0);
        }
        if (!player.treasures.soldCount) {
            player.treasures.soldCount = new Array(10).fill(0);
        }
        
        // 更新找到次数统计
        player.treasures.foundCount[treasureId - 1] = (player.treasures.foundCount[treasureId - 1] || 0) + 1;
        
    
        
        // 保存游戏
        saveGame();
        
        // 更新UI
        updateTreasureUI();
        
        return true;
        
    } catch (error) {
        console.error('添加宝物到库存错误:', error);
        logAction("添加宝物失败", "error");
        return false;
    }
}
function showTreasureNotification() {
    try {
        // 简单的视觉反馈
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: black;
            padding: 20px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10000;
            animation: treasurePop 0.5s ease-out;
        `;
        notification.innerHTML = '🎉 发现宝物！';
        
        document.body.appendChild(notification);
        
        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes treasurePop {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                70% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // 2秒后移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 1000);
        
    } catch (error) {
        console.error('显示宝物通知错误:', error);
    }
}

// 更新宝物系统UI
function updateTreasureUI() {
    // 安全初始化数据
    if (!player.treasures) {
        initTreasureData();
    }
    
    // 更新统计信息
    const totalTreasures = player.treasures.inventory ? 
        player.treasures.inventory.reduce((sum, t) => sum + (t.quantity || 0), 0) : 0;
    
    const totalValue = player.treasures.inventory ? 
        player.treasures.inventory.reduce((sum, t) => {
            const treasure = treasureConfig.find(tc => tc.id === t.id);
            return sum + (treasure ? treasure.baseValue * (t.quantity || 0) : 0);
        }, 0) : 0;
    
    document.getElementById('totalTreasures').textContent = formatNumber(totalTreasures);
    document.getElementById('totalTreasureValue').textContent = formatNumber(totalValue);
    document.getElementById('totalSoldValue').textContent = formatNumber(player.treasures.totalSold || 0);
    
    // 更新各个显示区域
    updateTreasureCollection();
    updateSellList();
    updateTreasureEncyclopedia();
    
    // 更新按钮状态
    updateTreasureButtons();
}
function updateTreasureButtons() {
    const hasTreasures = player.treasures.inventory && 
        player.treasures.inventory.some(t => t.quantity > 0);
    
    const sellAllBtn = document.querySelector('button[onclick="sellAllTreasures()"]');
    const selectAllBtn = document.querySelector('button[onclick="selectAllTreasures()"]');
    const deselectAllBtn = document.querySelector('button[onclick="deselectAllTreasures()"]');
    
    if (sellAllBtn) {
        sellAllBtn.disabled = !hasTreasures;
        sellAllBtn.style.opacity = hasTreasures ? '1' : '0.5';
    }
    
    if (selectAllBtn) {
        selectAllBtn.disabled = !hasTreasures;
        selectAllBtn.style.opacity = hasTreasures ? '1' : '0.5';
    }
    
    if (deselectAllBtn) {
        deselectAllBtn.disabled = !hasTreasures;
        deselectAllBtn.style.opacity = hasTreasures ? '1' : '0.5';
    }
}
// 更新宝物收藏显示
function updateTreasureCollection() {
    const container = document.getElementById('treasureCollection');
    container.innerHTML = '';
    
    // 检查是否有宝物
    if (!player.treasures || !player.treasures.inventory || player.treasures.inventory.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 20px; font-size: 14px;">尚未发现任何宝物<br><small>继续挖矿有几率获得宝物</small></div>';
        return;
    }
    
    // 过滤掉数量为0的宝物
    const validTreasures = player.treasures.inventory.filter(t => t.quantity > 0);
    
    if (validTreasures.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 20px; font-size: 14px;">宝物已售罄<br><small>继续挖矿可以获得更多宝物</small></div>';
        return;
    }
    
    validTreasures.forEach(treasureItem => {
        const treasure = treasureConfig.find(t => t.id === treasureItem.id);
        if (!treasure) return;
        
        const treasureCard = document.createElement('div');
        treasureCard.className = 'treasure-card';
        treasureCard.style.background = '#444';
        treasureCard.style.border = `2px solid ${treasure.color}`;
        treasureCard.style.borderRadius = '5px';
        treasureCard.style.padding = '10px';
        treasureCard.style.textAlign = 'center';
        treasureCard.style.minHeight = '80px';
        
        treasureCard.innerHTML = `
            <div style="font-weight: bold; color: ${treasure.color}; font-size: 14px; margin-bottom: 5px;">${treasure.name}</div>
            <div style="font-size: 12px; color: #ccc; margin-bottom: 3px;">稀有度: ${treasure.rarity}</div>
            <div style="font-size: 12px; color: #FFD700; margin-bottom: 3px;">价值: ${formatNumber(treasure.baseValue)}</div>
            <div style="font-size: 12px; color: #32CD32; margin-bottom: 5px;">数量: ${treasureItem.quantity}</div>
            <div style="font-size: 10px; color: #888;">${treasure.description}</div>
        `;
        
        container.appendChild(treasureCard);
    });
}

// 更新出售列表
function updateSellList() {
    const container = document.getElementById('treasureSellList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 检查是否有可出售的宝物
    if (!player.treasures || !player.treasures.inventory || player.treasures.inventory.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 20px;">没有可出售的宝物</div>';
        return;
    }
    
    // 过滤掉数量为0的宝物
    const validTreasures = player.treasures.inventory.filter(t => t.quantity > 0);
    
    if (validTreasures.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 20px;">所有宝物已售出</div>';
        return;
    }
    
    validTreasures.forEach((treasureItem, index) => {
        const treasure = treasureConfig.find(t => t.id === treasureItem.id);
        if (!treasure) return;
        
        const sellItem = document.createElement('div');
        sellItem.className = 'sell-item';
        sellItem.style.display = 'flex';
        sellItem.style.alignItems = 'center';
        sellItem.style.justifyContent = 'space-between';
        sellItem.style.padding = '8px';
        sellItem.style.background = '#555';
        sellItem.style.borderRadius = '3px';
        sellItem.style.borderLeft = `3px solid ${treasure.color}`;
        sellItem.style.marginBottom = '5px';
        
        sellItem.innerHTML = `
            <div style="display: flex; align-items: center; flex: 1;">
                <input type="checkbox" id="treasureCheckbox${index}" 
                       style="margin-right: 10px; width: 16px; height: 16px;">
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: ${treasure.color}; font-size: 12px;">
                        ${treasure.name}
                    </div>
                    <div style="font-size: 10px; color: #ccc;">
                        数量: ${treasureItem.quantity} | 稀有度: ${treasure.rarity}
                    </div>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 11px; color: #FFD700;">
                    ${formatNumber(treasure.baseValue)}
                </div>
                <div style="font-size: 9px; color: #888;">
                    资金/个
                </div>
            </div>
        `;
        
        container.appendChild(sellItem);
    });
}

// 更新宝物图鉴
function updateTreasureEncyclopedia() {
    const container = document.getElementById('treasureEncyclopedia');
    if (!container) return;
    
    container.innerHTML = '';
    
    treasureConfig.forEach(treasure => {
        // 安全获取统计数据
        const foundCount = (player.treasures && player.treasures.foundCount) ? 
            (player.treasures.foundCount[treasure.id - 1] || 0) : 0;
        const soldCount = (player.treasures && player.treasures.soldCount) ? 
            (player.treasures.soldCount[treasure.id - 1] || 0) : 0;
        
        // 安全获取拥有数量
        let ownedCount = 0;
        if (player.treasures && player.treasures.inventory) {
            const treasureItem = player.treasures.inventory.find(t => t.id === treasure.id);
            ownedCount = treasureItem ? treasureItem.quantity : 0;
        }
        
        const isDiscovered = foundCount > 0;
        
        const encyclopediaItem = document.createElement('div');
        encyclopediaItem.className = 'encyclopedia-item';
        encyclopediaItem.style.background = isDiscovered ? '#2a2a2a' : '#1a1a1a';
        encyclopediaItem.style.border = `1px solid ${isDiscovered ? treasure.color : '#555'}`;
        encyclopediaItem.style.borderRadius = '5px';
        encyclopediaItem.style.padding = '10px';
        encyclopediaItem.style.marginBottom = '10px';
        
        encyclopediaItem.innerHTML = `
            <div style="font-weight: bold; color: ${isDiscovered ? treasure.color : '#888'}; font-size: 14px; margin-bottom: 5px;">
                ${isDiscovered ? treasure.name : '未发现的宝物'} 
                ${isDiscovered ? '✓' : '?'}
            </div>
            <div style="font-size: 11px; color: ${isDiscovered ? '#ccc' : '#666'}; margin-bottom: 5px;">
                ${isDiscovered ? treasure.description : '继续挖矿来发现这个宝物'}
            </div>
            <div style="font-size: 10px; color: ${isDiscovered ? '#FFD700' : '#666'};">稀有度: ${treasure.rarity}</div>
            <div style="font-size: 10px; color: ${isDiscovered ? '#32CD32' : '#666'};">价值: ${formatNumber(treasure.baseValue)} 资金</div>
            ${isDiscovered ? `
                <div style="font-size: 9px; color: #87CEEB; margin-top: 5px;">
                    发现: ${foundCount}次 | 拥有: ${ownedCount}个 | 出售: ${soldCount}个
                </div>
            ` : ''}
        `;
        
        container.appendChild(encyclopediaItem);
    });
}
// 全选宝物
function selectAllTreasures() {
    player.treasures.inventory.forEach((treasure, index) => {
        const checkbox = document.getElementById(`treasureCheckbox${index}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

// 全不选宝物
function deselectAllTreasures() {
    player.treasures.inventory.forEach((treasure, index) => {
        const checkbox = document.getElementById(`treasureCheckbox${index}`);
        if (checkbox) {
            checkbox.checked = false;
        }
    });
}

// 出售选中宝物
function sellSelectedTreasures() {
    const sellAmount = parseInt(document.getElementById('sellAmount').value) || 1;
    let totalEarned = 0;
    let soldTreasures = [];
    
    // 从后往前遍历，避免索引变化
    for (let i = player.treasures.inventory.length - 1; i >= 0; i--) {
        const checkbox = document.getElementById(`treasureCheckbox${i}`);
        if (checkbox && checkbox.checked) {
            const treasureItem = player.treasures.inventory[i];
            const treasure = treasureConfig.find(t => t.id === treasureItem.id);
            
            if (treasure) {
                const sellCount = Math.min(sellAmount, treasureItem.quantity);
                const earned = treasure.baseValue * sellCount;
                
                totalEarned += earned;
                treasureItem.quantity -= sellCount;
                
                // 更新统计
                player.treasures.totalSold += earned;
                player.treasures.soldCount[treasure.id - 1] += sellCount;
                
                soldTreasures.push({
                    name: treasure.name,
                    count: sellCount,
                    earned: earned
                });
                
                // 如果数量为0，移除该宝物
                if (treasureItem.quantity <= 0) {
                    player.treasures.inventory.splice(i, 1);
                }
            }
        }
    }
    
    if (totalEarned > 0) {
        // 添加金币
        player.investmentGame.userData.availableFunds += totalEarned;
        
        // 显示出售结果
        const soldText = soldTreasures.map(t => `${t.name} x${t.count}`).join(', ');
        logAction(`出售宝物获得 ${formatNumber(totalEarned)} 资金！ (${soldText})`, "success");
        
        updateTreasureUI();
        updateDisplay();
        saveGame();
    } else {
        logAction("请选择要出售的宝物", "error");
    }
}

// 一键出售所有宝物
function sellAllTreasures() {
    // 检查是否有可出售的宝物
    const hasTreasures = player.treasures.inventory && 
        player.treasures.inventory.some(t => t.quantity > 0);
    
    if (!hasTreasures) {
        logAction("没有可出售的宝物", "error");
        return;
    }
    
    // 计算总价值
    const totalValue = player.treasures.inventory.reduce((sum, treasureItem) => {
        const treasure = treasureConfig.find(t => t.id === treasureItem.id);
        return sum + (treasure ? treasure.baseValue * treasureItem.quantity : 0);
    }, 0);
    
    showCustomConfirm(`确定要一键出售所有宝物吗？\n总计可获得 ${formatNumber(totalValue)} 资金`, (confirmed) => {
        if (confirmed) {
            let totalEarned = 0;
            let soldCount = 0;
            
            // 计算总价值和数量
            player.treasures.inventory.forEach(treasureItem => {
                const treasure = treasureConfig.find(t => t.id === treasureItem.id);
                if (treasure) {
                    const earned = treasure.baseValue * treasureItem.quantity;
                    totalEarned += earned;
                    soldCount += treasureItem.quantity;
                    
                    // 更新统计
                    player.treasures.soldCount[treasure.id - 1] += treasureItem.quantity;
                }
            });
            
            // 添加金币
            player.investmentGame.userData.availableFunds += totalEarned;
            player.treasures.totalSold += totalEarned;
            
            // 清空库存
            player.treasures.inventory = [];
            
            logAction(`一键出售了 ${soldCount} 个宝物，获得 ${formatNumber(totalEarned)} 资金！`, "success");
            
            updateTreasureUI();
            updateDisplay();
            saveGame();
        }
    });
}


// 数字格式化函数
function formatNumber(num) {
    return formatSci(num);
}
const childConfig = {
    pregnancy: {
        duration: 24 * 60 * 60 * 1000,
        cost: 52013.14,
        maxChildren: 10
    },
    growthStages: [
        { name: "婴儿", age: 0, duration: 1 * 24 * 60 * 60 * 1000 },
        { name: "幼儿", age: 1, duration: 2 * 24 * 60 * 60 * 1000 },
        { name: "儿童", age: 2, duration: 3 * 24 * 60 * 60 * 1000 },
        { name: "少年", age: 3, duration: 7 * 24 * 60 * 60 * 1000 },
        { name: "青年", age: 4, duration: Infinity }
    ],
    trainingTypes: [
        { id: "education", name: "教育", cost: 13145, effect: "intelligence", description: "提高智力属性" },
        { id: "sports", name: "体育", cost: 52100, effect: "physique", description: "提高体质属性" },
        { id: "arts", name: "艺术", cost: 131400, effect: "charm", description: "提高魅力属性" },
        { id: "business", name: "商业", cost: 52100, effect: "business", description: "提高商业能力" }
    ],
    attributeBonuses: {
        intelligence: { gps: 1, description: "每点智力增加100% GPS" },
        physique: { click: 1, description: "每点体质增加100% 点击" },
        charm: { critRate: 1, description: "每点魅力增加100% 生命" },
        business: { gold: 1, description: "每点商业增加100% 攻击" }
    },
    // 子孙后代 / 传宗接代 · 祖宗十八代
    lineage: {
        maxGeneration: 18,
        maxPerParent: 3,
        maxTotalMembers: 180,
        pregnancyDuration: 24 * 60 * 60 * 1000,
        pregnancyCost: 88888,
        rushCost: 188888,
        marriageCost: 2000000,
        inheritanceRate: 0.35,
        generationMult: {
            1: 1.0, 2: 1.25, 3: 1.55, 4: 1.9, 5: 2.3, 6: 2.8, 7: 3.4, 8: 4.1,
            9: 5.0, 10: 6.0, 11: 7.2, 12: 8.6, 13: 10.2, 14: 12.0, 15: 14.0, 16: 16.5, 17: 19.5, 18: 23.0
        },
        generationNames: {
            1: "子女", 2: "孙子", 3: "曾孙", 4: "玄孙", 5: "来孙", 6: "晜孙", 7: "仍孙", 8: "云孙",
            9: "耳孙", 10: "远孙", 11: "弥孙", 12: "胎孙", 13: "灰孙", 14: "衍孙", 15: "昆孙", 16: "裔孙", 17: "末孙", 18: "终世孙"
        },
        milestones: [
            { id: "m1", title: "开枝散叶", need: 3, bonus: 0.05, desc: "家族成员≥3：全加成+5%" },
            { id: "m2", title: "四世同堂", need: 8, bonus: 0.10, desc: "家族成员≥8：全加成+10%" },
            { id: "m3", title: "人丁兴旺", need: 15, bonus: 0.15, desc: "家族成员≥15：全加成+15%" },
            { id: "m4", title: "名门望族", need: 22, bonus: 0.25, desc: "家族成员≥22：全加成+25%" },
            { id: "m5", title: "五世其昌", need: 35, bonus: 0.35, desc: "家族成员≥35：全加成+35%" },
            { id: "m6", title: "百世流芳", need: 50, bonus: 0.50, desc: "家族成员≥50：全加成+50%" },
            { id: "m7", title: "十世其昌", need: 80, bonus: 0.80, desc: "家族成员≥80：全加成+80%" },
            { id: "m8", title: "十八代传", need: 120, bonus: 1.20, desc: "家族成员≥120：全加成+120%" },
            { id: "m9", title: "血脉如海", need: 160, bonus: 2.00, desc: "家族成员≥160：全加成+200%" }
        ]
    }
};

var _childOffspringFilter = 'all';
var _childActiveTab = 'overview';

function initChildData() {
    if (!player.children) {
        player.children = {
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
                critRateBonus: 1.0,
                goldMultiplier: 1.0,
                worldAtkBonus: 0,
                worldHpBonus: 0,
                worldCritDmgBonus: 0
            }
        };
    }
    if (!Array.isArray(player.children.children)) player.children.children = [];
    if (!Array.isArray(player.children.claimedMilestones)) player.children.claimedMilestones = [];
    if (player.children.lineageLevel == null) player.children.lineageLevel = 1;
    if (player.children.lineageExp == null) player.children.lineageExp = 0;
    player.children.children.forEach(function(c) {
        if (c.generation == null) c.generation = 1;
        if (c.parentId === undefined) c.parentId = null;
        ensureChildAttributes(c);
        isFamilyMemberAdult(c); // 同步成长阶段与 isAdult 标记
    });
    // 初始化时刷新一次加成，避免读档后世界地图/GPS 仍用旧值
    if (typeof calculateChildBonuses === 'function') {
        player.children.childBonuses = calculateChildBonuses();
    }
}

// 切换孩子系统界面
function toggleChildSystem() {
    if (!player.marriage || !player.marriage.isMarried) {
        alert("需要先结婚才能开启家族传承！");
        return;
    }
    if (player.marriage.loveLevel < 25) {
        alert("需要结婚恩爱等级25级！");
        return;
    }
    
    const ui = document.getElementById('childSystemUI');
    const overlay = document.getElementById('childSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        initChildData();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        if (typeof restoreChildNavCollapse === 'function') restoreChildNavCollapse();
        if (typeof restoreChildQuickTabs === 'function') restoreChildQuickTabs();
        switchChildTab(_childActiveTab || 'overview');
        updateChildSystemUI();
        if (typeof applyChildSubTabForPrimary === 'function') {
            try { applyChildSubTabForPrimary(_childActiveTab || 'overview'); } catch (eSub) {}
        }
    }
}

function closeChildSystem() {
    document.getElementById('childSystemUI').style.display = 'none';
    document.getElementById('childSystemOverlay').style.display = 'none';
}

function switchChildTab(tab) {
    _childActiveTab = tab || 'overview';
    var tabs = document.querySelectorAll('#childSystemUI .c-tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.toggle('active', tabs[i].getAttribute('data-tab') === _childActiveTab);
    }
    var map = {
        overview: 'childSectionOverview',
        birth: 'childSectionBirth',
        offspring: 'childSectionOffspring',
        train: 'childSectionTrain',
        work: 'childSectionWork',
        interact: 'childSectionInteract',
        lineage: 'childSectionLineage',
        talent: 'childSectionTalent',
        business: 'childSectionBusiness',
        ancestral: 'childSectionAncestral',
        quests: 'childSectionQuests',
        events: 'childSectionEvents',
        life: 'childSectionLife',
        estate: 'childSectionEstate',
        festival: 'childSectionFestival',
        feast: 'childSectionFeast',
        precept: 'childSectionPrecept',
        trial: 'childSectionTrial',
        cultivate: 'childSectionCultivate',
        spiritroot: 'childSectionSpiritroot',
        dongfu: 'childSectionDongfu',
        alchemy: 'childSectionAlchemy',
        artifact: 'childSectionArtifact',
        tribulation: 'childSectionTribulation',
        martial: 'childSectionMartial',
        eighteen: 'childSectionEighteen',
        glory: 'childSectionGlory',
        tree: 'childSectionTree',
        living: 'childSectionLiving',
        illness: 'childSectionIllness',
        marital: 'childSectionMarital',
        realty: 'childSectionRealty',
        descendants: 'childSectionDescendants',
        descplus: 'childSectionDescPlus',
        eightdepth: 'childSectionEighteenDepth',
        descnova: 'childSectionDescNova',
        descsaga: 'childSectionDescSaga',
        descchro: 'childSectionDescChronicle',
        descflow: 'childSectionDescFlow',
        descnpc: 'childSectionDescNpc'
    };
    Object.keys(map).forEach(function(key) {
        var el = document.getElementById(map[key]);
        if (el) el.classList.toggle('active', key === _childActiveTab);
    });
    // 自动展开当前页签所在导航分组
    if (typeof expandChildNavForTab === 'function') expandChildNavForTab(_childActiveTab);
    if (typeof updateChildQuickTabsLabel === 'function') updateChildQuickTabsLabel();
    // 页内二级标签（由 lineage-ui-perf / lineage-subtabs 提供）
    if (typeof applyChildSubTabForPrimary === 'function') {
        try { applyChildSubTabForPrimary(_childActiveTab); } catch (eSub2) {}
    }
}

window.toggleChildNavGroup = function (groupId) {
    var group = document.querySelector('#childSystemUI .c-nav-group[data-nav-group="' + groupId + '"]');
    if (!group) return;
    var collapsed = group.classList.toggle('collapsed');
    var btn = group.querySelector('.c-nav-label');
    if (btn) btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    try {
        var st = JSON.parse(localStorage.getItem('childNavCollapse') || '{}');
        st[groupId] = collapsed;
        localStorage.setItem('childNavCollapse', JSON.stringify(st));
    } catch (e) { /* ignore */ }
};

window.expandChildNavForTab = function (tab) {
    var btn = document.querySelector('#childSystemUI .c-nav .c-tab[data-tab="' + tab + '"]');
    if (!btn) return;
    var group = btn.closest ? btn.closest('.c-nav-group') : null;
    if (!group) {
        var p = btn.parentElement;
        while (p && (!p.classList || !p.classList.contains('c-nav-group'))) p = p.parentElement;
        group = p;
    }
    if (!group) return;
    group.classList.remove('collapsed');
    var lab = group.querySelector('.c-nav-label');
    if (lab) lab.setAttribute('aria-expanded', 'true');
    try {
        var st = JSON.parse(localStorage.getItem('childNavCollapse') || '{}');
        var gid = group.getAttribute('data-nav-group');
        if (gid) {
            st[gid] = false;
            localStorage.setItem('childNavCollapse', JSON.stringify(st));
        }
    } catch (e) { /* ignore */ }
};

window.restoreChildNavCollapse = function () {
    var groups = document.querySelectorAll('#childSystemUI .c-nav-group[data-nav-group]');
    var st = {};
    try {
        st = JSON.parse(localStorage.getItem('childNavCollapse') || '{}');
    } catch (e) { st = {}; }
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var id = group.getAttribute('data-nav-group');
        // 默认叠起；仅当本地明确记录为展开(false)时才展开
        var collapsed = st[id] !== false;
        group.classList.toggle('collapsed', collapsed);
        var lab = group.querySelector('.c-nav-label');
        if (lab) lab.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
};

window.toggleChildQuickTabs = function () {
    var box = document.getElementById('childQuickTabs');
    if (!box) return;
    var collapsed = box.classList.toggle('collapsed');
    var btn = document.getElementById('childQuickTabsLabel');
    if (btn) btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    try {
        localStorage.setItem('childQuickTabsCollapsed', collapsed ? '1' : '0');
    } catch (e) { /* ignore */ }
    if (typeof updateChildQuickTabsLabel === 'function') updateChildQuickTabsLabel();
};

window.restoreChildQuickTabs = function () {
    var box = document.getElementById('childQuickTabs');
    if (!box) return;
    var collapsed = false;
    try {
        collapsed = localStorage.getItem('childQuickTabsCollapsed') === '1';
    } catch (e) { collapsed = false; }
    box.classList.toggle('collapsed', collapsed);
    var btn = document.getElementById('childQuickTabsLabel');
    if (btn) btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    if (typeof updateChildQuickTabsLabel === 'function') updateChildQuickTabsLabel();
};

window.updateChildQuickTabsLabel = function () {
    var cur = document.getElementById('childQuickTabsCurrent');
    if (!cur) return;
    var tab = (typeof _childActiveTab !== 'undefined' && _childActiveTab) || 'overview';
    var active = document.querySelector('#childSystemUI .c-tabs-mobile .c-tab[data-tab="' + tab + '"]')
        || document.querySelector('#childSystemUI .c-nav .c-tab[data-tab="' + tab + '"]');
    var name = active ? String(active.textContent || '').trim() : tab;
    var box = document.getElementById('childQuickTabs');
    if (box && box.classList.contains('collapsed')) {
        cur.textContent = name ? ('· 当前「' + name + '」') : '';
    } else {
        cur.textContent = name ? ('· ' + name) : '';
    }
};

function setOffspringFilter(filter) {
    _childOffspringFilter = filter || 'all';
    var chips = document.querySelectorAll('#childSystemUI .c-chip');
    for (var i = 0; i < chips.length; i++) {
        chips[i].classList.toggle('active', chips[i].getAttribute('data-filter') === String(_childOffspringFilter));
    }
    var sel = document.getElementById('offspringGenSelect');
    if (sel) {
        if (!sel._genFilled) {
            var maxG = (childConfig.lineage && childConfig.lineage.maxGeneration) || 18;
            for (var g = 1; g <= maxG; g++) {
                var opt = document.createElement('option');
                opt.value = String(g);
                opt.textContent = '第' + g + '代·' + getGenerationLabel(g);
                sel.appendChild(opt);
            }
            sel._genFilled = true;
        }
        sel.value = (_childOffspringFilter === 'all') ? 'all' : String(_childOffspringFilter);
    }
    updateChildrenList();
}

function getDirectChildrenCount() {
    return (player.children.children || []).filter(function(c) { return (c.generation || 1) === 1; }).length;
}

function getGenerationMult(gen) {
    var g = Number(gen) || 1;
    if (childConfig.lineage.generationMult[g] != null) return childConfig.lineage.generationMult[g];
    return 1 + (g - 1) * 0.35;
}

function getGenerationLabel(gen) {
    return childConfig.lineage.generationNames[gen] || ('第' + gen + '代');
}

function getChildById(id) {
    if (!id) return null;
    return (player.children.children || []).find(function(c) { return c.id === id; }) || null;
}

function countOffspringOf(parentId) {
    return (player.children.children || []).filter(function(c) { return c.parentId === parentId; }).length;
}

function isFamilyMemberAdult(member) {
    if (!member) return false;
    if (member.isAdult === true) return true;
    if (member.growthStage >= childConfig.growthStages.length - 1) {
        member.isAdult = true;
        return true;
    }
    return false;
}

function updateChildSystemUI() {
    if (!document.getElementById('childSystemUI')) return;
    var tab = _childActiveTab || 'overview';
    var force = !!window.__lineageForceFullRefresh;

    // 轻量：状态/加成几乎处处需要
    updateFamilyStatus();
    updateChildBonuses();

    if (force || tab === 'overview' || tab === 'birth') {
        updatePregnancyStatus();
        updateConceptionButton();
        updateGrowthOverview();
    }
    if (force || tab === 'overview' || tab === 'offspring' || tab === 'train') {
        updateChildrenList();
        if (force || tab === 'train' || tab === 'overview') updateTrainingSection();
    }
    if (force || tab === 'work') updateChildWorkSystem();
    if (force || tab === 'interact') updateChildInteractionSystem();
    if (force || tab === 'lineage' || tab === 'overview' || tab === 'tree') {
        updateLineageOverview();
        updateLineageActionList();
        updateLineageMilestones();
        if (force || tab === 'tree' || tab === 'overview') updateFamilyTreeView();
        if (typeof enhanceLineageMarriageUI === 'function') enhanceLineageMarriageUI();
    }

    // 扩展页：只刷当前页签，避免一次重建全部子孙/智邻面板
    if (typeof refreshActiveChildTabPanels === 'function') {
        refreshActiveChildTabPanels(tab);
    } else if (typeof updateLineageExtUI === 'function') {
        updateLineageExtUI();
    }
}

function addWorkAndInteractionSections() {
    // 新 UI 已内置打工/互动分区，保留空实现兼容旧调用
}

function startGrowthCountdownTimer() {
    var reg = typeof registerSingletonInterval === 'function' ? registerSingletonInterval : null;
    var start = function(fn, ms) {
        return reg ? reg('_childGrowthCountdownId', fn, ms) : registerInterval(fn, ms);
    };
    start(function() {
        var ui = document.getElementById('childSystemUI');
        if (ui && ui.style.display === 'block') {
            updateChildrenList();
            updateGrowthOverview();
            updateLineageActionList();
        }
    }, 60000);
}


function showTrainingStrategy() {
    const strategies = [
        { id: 'balanced', name: '均衡发展', description: '所有属性平均发展' },
        { id: 'intelligence', name: '智力优先', description: '优先发展智力属性' },
        { id: 'physique', name: '体质优先', description: '优先发展体质属性' },
        { id: 'charm', name: '魅力优先', description: '优先发展魅力属性' },
        { id: 'business', name: '商业优先', description: '优先发展商业属性' }
    ];
    
    let message = '选择培养策略：\n\n';
    strategies.forEach(strategy => {
        message += `${strategy.name}: ${strategy.description}\n`;
    });
    
    showCustomPrompt(message, (selected) => {
        if (selected) {
            const strategy = strategies.find(s => selected.includes(s.name));
            if (strategy) {
                player.children.trainingStrategy = strategy.id;
                logAction(`已设置为${strategy.name}策略`, "success");
            }
        }
    });
}
function trainWithStrategy(childIndex) {
    const strategy = player.children.trainingStrategy || 'balanced';
    let trainingType;
    
    switch(strategy) {
        case 'intelligence':
            trainingType = 'education';
            break;
        case 'physique':
            trainingType = 'sports';
            break;
        case 'charm':
            trainingType = 'arts';
            break;
        case 'business':
            trainingType = 'business';
            break;
        default: // balanced
            // 均衡发展：选择最弱的属性
            const child = player.children.children[childIndex];
            const attributes = child.attributes;
            const weakestAttribute = Object.keys(attributes).reduce((weakest, attr) => {
                return attributes[attr] < attributes[weakest] ? attr : weakest;
            });
            
            trainingType = childConfig.trainingTypes.find(t => t.effect === weakestAttribute)?.id || 'education';
            break;
    }
    
    trainChild(childIndex, trainingType);
}

// 更新家庭状态
function updateFamilyStatus() {
    const container = document.getElementById('familyStatus');
    if (!container) return;
    const members = player.children.children || [];
    const pregnant = player.children.isPregnant;
    const now = Date.now();
    const availableChildren = members.filter(function(child) {
        return (now - (child.lastTraining || 0)) >= 60 * 60 * 1000;
    }).length;
    const gen1 = members.filter(function(c) { return (c.generation || 1) === 1; }).length;
    const gen2 = members.filter(function(c) { return c.generation === 2; }).length;
    const gen3 = members.filter(function(c) { return c.generation === 3; }).length;
    const gen4plus = members.filter(function(c) { return (c.generation || 1) >= 4; }).length;
    let maxGen = 0;
    members.forEach(function(c) { maxGen = Math.max(maxGen, c.generation || 1); });
    const marriedCount = members.filter(function(c) { return c.isMarried; }).length;
    const adultCount = members.filter(isFamilyMemberAdult).length;
    const workingCount = members.filter(function(c) { return isFamilyMemberAdult(c) && c.currentJob; }).length;
    const pregnantKids = members.filter(function(c) { return c.isPregnant; }).length;

    container.innerHTML =
        '<div class="c-stat"><span class="lab">配偶</span><span class="val">' + (player.marriage.spouseName || '-') + '</span></div>' +
        '<div class="c-stat"><span class="lab">直系子女</span><span class="val">' + gen1 + '/' + childConfig.pregnancy.maxChildren + '</span></div>' +
        '<div class="c-stat"><span class="lab">家族总人数</span><span class="val">' + members.length + '/' + childConfig.lineage.maxTotalMembers + '</span></div>' +
        '<div class="c-stat"><span class="lab">子/孙/曾/更远</span><span class="val">' + gen1 + '/' + gen2 + '/' + gen3 + '/' + gen4plus + '</span></div>' +
        '<div class="c-stat"><span class="lab">最远代数</span><span class="val">' + (maxGen ? (getGenerationLabel(maxGen) + ' · 第' + maxGen + '代') : '-') + '</span></div>' +
        '<div class="c-stat"><span class="lab">成年 / 成婚</span><span class="val">' + adultCount + ' / ' + marriedCount + '</span></div>' +
        '<div class="c-stat"><span class="lab">打工中</span><span class="val">' + workingCount + '/' + adultCount + '</span></div>' +
        '<div class="c-stat"><span class="lab">可培养</span><span class="val" style="color:' + (availableChildren > 0 ? '#4CAF50' : '#FF6B6B') + '">' + availableChildren + '/' + members.length + '</span></div>' +
        '<div class="c-stat"><span class="lab">怀孕中</span><span class="val">' + (pregnant ? '本人' : '否') + (pregnantKids ? ' · 子女' + pregnantKids + '人' : '') + '</span></div>' +
        '<div class="c-stat"><span class="lab">家庭幸福度</span><span class="val">' + calculateFamilyHappiness() + '%</span></div>' +
        '<div class="c-stat"><span class="lab">血脉等级</span><span class="val">Lv.' + (player.children.lineageLevel || 1) + '</span></div>' +
        '<div class="c-stat"><span class="lab">家族声望</span><span class="val">' + (player.children.clanPrestige || 0) + '</span></div>';

    // 总览横幅：十八代进度
    var titleEl = document.getElementById('childBannerTitle');
    var descEl = document.getElementById('childBannerDesc');
    var meterEl = document.getElementById('childGenMeter');
    if (titleEl) {
        titleEl.textContent = maxGen
            ? ('血脉已至 · ' + getGenerationLabel(maxGen) + '（第' + maxGen + '/18 代）')
            : '血脉未开 · 祖宗十八代';
    }
    if (descEl) {
        descEl.textContent = maxGen >= 18
            ? '终世孙已立，十八代圆满。继续修缮家业与武道，让地图三维更盛。'
            : ('可传宗至终世孙共十八代 · 当前人数 ' + members.length + '/' + childConfig.lineage.maxTotalMembers +
               ' · 世界地图攻/血/爆伤随血脉成长');
    }
    if (meterEl) {
        var cells = '';
        for (var gi = 1; gi <= 18; gi++) {
            cells += '<span class="' + (gi <= maxGen ? 'on' : '') + '" title="第' + gi + '代·' + getGenerationLabel(gi) + '"></span>';
        }
        meterEl.innerHTML = cells;
    }
}

function initChildSystem() {
    initChildData();
    startChildCooldownTimer();
    startGrowthCountdownTimer();
    startDescendantPregnancyTimer();
}

function updatePregnancyStatus() {
    const pregnancySection = document.getElementById('pregnancySection');
    const pregnancyInfo = document.getElementById('pregnancyInfo');
    if (!pregnancySection || !pregnancyInfo) return;

    if (player.children.isPregnant) {
        pregnancySection.style.display = 'block';
        const progress = calculatePregnancyProgress();
        const remainingTime = Math.max(0, childConfig.pregnancy.duration - (Date.now() - player.children.pregnancyStart));
        const hoursRemaining = Math.floor(remainingTime / (60 * 60 * 1000));
        const minutesRemaining = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

        if (progress >= 100) {
            pregnancyInfo.innerHTML =
                '<div style="color:#4CAF50;font-weight:bold;margin-bottom:8px;">怀孕完成！可以分娩了</div>' +
                '<button class="c-btn c-btn-green" style="width:100%;" onclick="giveBirth()">立即分娩</button>';
            setTimeout(function() {
                if (player.children.isPregnant && calculatePregnancyProgress() >= 100) giveBirth();
            }, 1000);
        } else {
            pregnancyInfo.innerHTML =
                '<div class="c-stat" style="margin-bottom:8px;"><span class="lab">预计出生</span><span class="val">' +
                new Date(player.children.pregnancyStart + childConfig.pregnancy.duration).toLocaleString() + '</span></div>' +
                '<div>剩余约 ' + hoursRemaining + ' 小时 ' + minutesRemaining + ' 分钟</div>' +
                '<div class="c-progress"><i style="width:' + progress + '%"></i><span>' + progress.toFixed(1) + '%</span></div>' +
                '<button class="c-btn c-btn-orange" style="width:100%;margin-top:8px;" onclick="giveBirthNow()">95%以上催产（88888 元）</button>';
        }
    } else {
        pregnancySection.style.display = 'none';
    }
}

function calculatePregnancyProgress() {
    if (!player.children.isPregnant || !player.children.pregnancyStart) return 0;
    const elapsed = Date.now() - player.children.pregnancyStart;
    return Math.min(100, (elapsed / childConfig.pregnancy.duration) * 100);
}

// 怀孕功能
function conceiveChild() {
    if (!player.marriage.isMarried) {
        logAction("需要先结婚才能怀孕", "error");
        return;
    }
    
    if (player.children.isPregnant) {
        logAction("已经怀孕了，请等待分娩", "error");
        return;
    }
    
    if (getDirectChildrenCount() >= childConfig.pregnancy.maxChildren) {
        logAction("最多只能有 " + childConfig.pregnancy.maxChildren + " 个直系子女", "error");
        return;
    }

    if ((player.children.children || []).length >= childConfig.lineage.maxTotalMembers) {
        logAction("家族人数已达上限 " + childConfig.lineage.maxTotalMembers, "error");
        return;
    }
    
    const childName = document.getElementById('childNameInput').value.trim();
    const childGender = document.getElementById('childGenderSelect').value;
    
    if (!childName) {
        logAction("请输入孩子名字", "error");
        return;
    }
    
    if (childName.length > 10) {
        logAction("孩子名字不能超过10个字符", "error");
        return;
    }
    
    if (player.investmentGame.userData.availableFunds < childConfig.pregnancy.cost) {
        logAction("资金不足！需要 " + childConfig.pregnancy.cost + " 元", "error");
        return;
    }
    
    player.investmentGame.userData.availableFunds -= childConfig.pregnancy.cost;
    
    player.children.isPregnant = true;
    player.children.pregnancyStart = Date.now();
    player.children.pregnancyProgress = 0;
    player.children.expectedChild = {
        name: childName,
        gender: childGender,
        generation: 1,
        parentId: null
    };
    
    const expectedBirthTime = new Date(Date.now() + childConfig.pregnancy.duration);
    logAction("恭喜！您怀孕了！孩子预计在 " + expectedBirthTime.toLocaleString() + " 出生", "success");
    
    updateChildSystemUI();
    updateDisplay();
    saveGame();
    
    startPregnancyTimer();
}

// 开始怀孕计时器
function startPregnancyTimer() {
    if (player.children.pregnancyTimer) {
        if (typeof unregisterInterval === 'function') unregisterInterval(player.children.pregnancyTimer);
        else clearInterval(player.children.pregnancyTimer);
        player.children.pregnancyTimer = null;
    }
    
    player.children.pregnancyTimer = registerInterval(() => {
        if (player.children.isPregnant) {
            const progress = calculatePregnancyProgress();
            player.children.pregnancyProgress = progress;
            
            console.log('怀孕计时器检查，进度:', progress.toFixed(1) + '%');
            
            // 更新UI
            updatePregnancyStatus();
            
            // 当进度达到100%时触发分娩
            if (progress >= 100) {
                console.log('怀孕完成，触发分娩...');
                giveBirth();
            }
        } else {
            // 怀孕结束，清除计时器
            if (typeof unregisterInterval === 'function') unregisterInterval(player.children.pregnancyTimer);
            else clearInterval(player.children.pregnancyTimer);
            player.children.pregnancyTimer = null;
        }
    }, 30000); // 每30秒检查一次（更频繁的检查）
}

// 分娩
function giveBirth() {
    try {
        console.log('开始分娩检查...');
        console.log('怀孕状态:', player.children.isPregnant);
        console.log('预期孩子:', player.children.expectedChild);
        
        if (!player.children.isPregnant) {
            logAction("当前没有怀孕", "error");
            return;
        }
        
        if (!player.children.expectedChild) {
            logAction("怀孕数据异常，无法分娩", "error");
            // 重置怀孕状态
            player.children.isPregnant = false;
            player.children.pregnancyStart = 0;
            player.children.pregnancyProgress = 0;
            updateChildSystemUI();
            saveGame();
            return;
        }
        
        const progress = calculatePregnancyProgress();
        console.log('当前怀孕进度:', progress + '%');
        
        // 即使进度未满100%也允许分娩（容错处理）
        if (progress < 95) {
            logAction(`怀孕进度不足 (${progress.toFixed(1)}%)，还不能分娩`, "error");
            return;
        }
        
        console.log('创建新孩子...');
        const expected = player.children.expectedChild;
        const child = createNewChild(
            expected.name,
            expected.gender,
            expected.generation || 1,
            expected.parentId || null,
            expected.inheritFrom || null
        );
        
        // 添加到孩子列表
        player.children.children.push(child);
        player.children.totalChildren = (player.children.totalChildren || 0) + 1;
        
        // 重置怀孕状态
        player.children.isPregnant = false;
        player.children.pregnancyStart = 0;
        player.children.pregnancyProgress = 0;
        delete player.children.expectedChild;
        
        // 清除计时器
        if (player.children.pregnancyTimer) {
            if (typeof unregisterInterval === 'function') unregisterInterval(player.children.pregnancyTimer);
            else clearInterval(player.children.pregnancyTimer);
            player.children.pregnancyTimer = null;
        }
        
        const genderText = child.gender === 'boy' ? '男孩' : '女孩';
        logAction(`🎉 恭喜！您生下了一个${genderText}：${child.name}！`, "success");
        
 
        
        
        updateChildSystemUI();
        updateDisplay();
        saveGame();
        
        console.log('分娩完成，当前孩子数量:', player.children.children.length);
        
    } catch (error) {
        console.error('分娩过程中发生错误:', error);
        logAction("分娩过程中出现错误，已重置怀孕状态", "error");
        
        // 错误恢复：重置怀孕状态
        player.children.isPregnant = false;
        player.children.pregnancyStart = 0;
        player.children.pregnancyProgress = 0;
        delete player.children.expectedChild;
        
        updateChildSystemUI();
        saveGame();
    }
}


// 立即分娩
function giveBirthNow() {
    if (!player.children.isPregnant) {
        logAction("当前没有怀孕", "error");
        return;
    }
    
    if (player.investmentGame.userData.availableFunds < 88888) {
        logAction("资金不足！需要88888元", "error");
        return;
    }
    
    showCustomConfirm("确定要立即分娩吗？消耗88888元", (confirmed) => {
        if (confirmed) {
            player.investmentGame.userData.availableFunds -= 88888;
            giveBirth();
        }
    });
}

// 更新孩子列表
function updateChildrenList() {
    const container = document.getElementById('childrenList');
    if (!container) return;
    const children = player.children.children || [];
    const filter = _childOffspringFilter || 'all';
    const list = children.filter(function(child) {
        if (filter === 'all') return true;
        return String(child.generation || 1) === String(filter);
    });

    if (list.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#C9A0B8;padding:24px;">暂无成员</div>';
        return;
    }

    container.innerHTML = '';
    list.forEach(function(child) {
        const index = children.findIndex(function(c) { return c.id === child.id; });
        if (index < 0) return;
        container.appendChild(buildFamilyMemberCard(child, index, true));
    });
}

function buildFamilyMemberCard(child, index, showTrain) {
    const safeChild = ensureChildAttributes(child);
    const gen = safeChild.generation || 1;
    const currentStage = childConfig.growthStages[safeChild.growthStage] || childConfig.growthStages[0];
    const isAdult = isFamilyMemberAdult(safeChild);
    if (isAdult && !safeChild.isAdult) safeChild.isAdult = true;
    const growthInfo = calculateGrowthCountdown(safeChild);
    const now = Date.now();
    const remainingTime = Math.max(0, 60 * 60 * 1000 - (now - (safeChild.lastTraining || 0)));
    const isOnCooldown = remainingTime > 0;
    const minutesRemaining = Math.ceil(remainingTime / (60 * 1000));
    const parent = getChildById(safeChild.parentId);
    const parentText = parent ? ('父母：' + parent.name) : (gen === 1 ? '直系' : '');

    const card = document.createElement('div');
    card.className = 'c-member gen-' + gen;
    let badges = '<span class="c-badge gen">' + getGenerationLabel(gen) + '</span>';
    if (safeChild.isMarried) badges = '<span class="c-badge married">已婚</span>';
    else if (isAdult) badges = '<span class="c-badge adult">成年</span>';

    let trainHtml = '';
    if (showTrain) {
        trainHtml =
            '<div class="c-actions">' +
            '<button class="c-btn c-btn-sm c-btn-blue" onclick="trainChild(' + index + ',\'education\')" ' + (isOnCooldown ? 'disabled' : '') + '>教育</button>' +
            '<button class="c-btn c-btn-sm c-btn-green" onclick="trainChild(' + index + ',\'sports\')" ' + (isOnCooldown ? 'disabled' : '') + '>体育</button>' +
            '<button class="c-btn c-btn-sm c-btn-purple" onclick="trainChild(' + index + ',\'arts\')" ' + (isOnCooldown ? 'disabled' : '') + '>艺术</button>' +
            '<button class="c-btn c-btn-sm c-btn-orange" onclick="trainChild(' + index + ',\'business\')" ' + (isOnCooldown ? 'disabled' : '') + '>商业</button>' +
            '</div>';
    }

    let extraActions = '';
    if (isAdult && !safeChild.isMarried && gen < childConfig.lineage.maxGeneration) {
        extraActions += '<button class="c-btn c-btn-sm c-btn-gold" style="width:100%;margin-top:6px;" onclick="arrangeMarriage(' + index + ')">安排成婚</button>';
    }
    if (safeChild.isMarried && safeChild.spouse) {
        extraActions += '<div class="meta" style="margin-top:4px;">配偶：' + safeChild.spouse.name +
            (safeChild.marriageTier && safeChild.marriageTier !== 'common' ? '（' + safeChild.marriageTier + '）' : '') + '</div>';
    }
    var talentLabel = '';
    if (safeChild.talentId && typeof window.lineageExtConfig !== 'undefined') {
        var td = window.lineageExtConfig.talents.find(function(t) { return t.id === safeChild.talentId; });
        if (td) talentLabel = ' · <span style="color:' + td.color + ';">' + td.name + (safeChild.talentAwakened ? '★' : '') + '</span>';
    }

    card.innerHTML =
        badges +
        '<div class="name">' + safeChild.name + '</div>' +
        '<div class="meta">' + (safeChild.gender === 'boy' ? '男' : '女') + ' · ' + currentStage.name +
        (isAdult ? ' · 可打工' : '') + (parentText ? ' · ' + parentText : '') + talentLabel + '</div>' +
        '<div style="margin:6px 0;">' + growthInfo.countdownHtml + '</div>' +
        '<div class="attrs">' +
        '<div style="color:#32CD32;">智力 ' + safeChild.attributes.intelligence + '</div>' +
        '<div style="color:#FFA500;">体质 ' + safeChild.attributes.physique + '</div>' +
        '<div style="color:#FF69B4;">魅力 ' + safeChild.attributes.charm + '</div>' +
        '<div style="color:#FFD700;">商业 ' + safeChild.attributes.business + '</div>' +
        '</div>' +
        '<div style="font-size:10px;color:' + (isOnCooldown ? '#FF6B6B' : '#4CAF50') + ';">' +
        (isOnCooldown ? ('培养冷却 ' + minutesRemaining + ' 分钟') : '可培养') +
        ' · 培养 ' + (safeChild.totalTraining || 0) + ' 次</div>' +
        trainHtml + extraActions;

    return card;
}

function calculateGrowthCountdown(child) {
    const currentStage = childConfig.growthStages[child.growthStage];
    const nextStage = childConfig.growthStages[child.growthStage + 1];

    if (!nextStage) {
        return {
            countdownHtml: '<div style="color:#FFD700;font-size:11px;">已达最高阶段 · ' + currentStage.name + '</div>',
            canGrow: false,
            timeRemaining: 0,
            attributesNeeded: 0
        };
    }

    const birthDate = child.birthDate || Date.now();
    const now = Date.now();
    const timeInCurrentStage = now - birthDate - childConfig.growthStages.slice(0, child.growthStage).reduce(function(sum, stage) { return sum + stage.duration; }, 0);
    const timeRequired = currentStage.duration;
    const timeRemaining = Math.max(0, timeRequired - timeInCurrentStage);
    const totalAttributes = Object.values(child.attributes).reduce(function(a, b) { return a + b; }, 0);
    const attributesRequired = (child.growthStage + 1) * 10;
    const attributesNeeded = Math.max(0, attributesRequired - totalAttributes);
    const timeProgress = Math.min(100, (timeInCurrentStage / timeRequired) * 100);
    const attributeProgress = Math.min(100, (totalAttributes / attributesRequired) * 100);
    const overallProgress = Math.min(timeProgress, attributeProgress);
    const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    const canGrow = timeRemaining <= 0 && attributesNeeded <= 0;

    let countdownHtml = '';
    if (canGrow) {
        countdownHtml = '<div style="color:#4CAF50;font-size:11px;">可成长至 ' + nextStage.name + '（培养即可升级）</div>';
    } else {
        if (timeRemaining > 0) countdownHtml += '<div style="color:#87CEEB;font-size:10px;">剩余 ' + hoursRemaining + '时' + minutesRemaining + '分</div>';
        if (attributesNeeded > 0) countdownHtml += '<div style="color:#FFA500;font-size:10px;">还需 ' + attributesNeeded + ' 点属性</div>';
        countdownHtml += '<div class="c-progress"><i style="width:' + overallProgress + '%"></i><span>' + overallProgress.toFixed(0) + '%</span></div>';
    }

    return {
        countdownHtml: countdownHtml,
        canGrow: canGrow,
        timeRemaining: timeRemaining,
        attributesNeeded: attributesNeeded,
        nextStage: nextStage.name
    };
}

// 更新培养区域
function updateTrainingSection() {
    const container = document.getElementById('childTrainingSection');
    if (!container) return;
    container.innerHTML = '';

    const children = player.children.children || [];
    const now = Date.now();
    const availableCount = children.filter(function(child) {
        return (now - (child.lastTraining || 0)) >= 60 * 60 * 1000;
    }).length;

    const overview = document.createElement('div');
    overview.style.cssText = 'grid-column:1/-1;';
    overview.innerHTML =
        '<div class="c-stat" style="text-align:center;">可培养 <span style="color:' + (availableCount > 0 ? '#4CAF50' : '#FF6B6B') + ';font-weight:bold;">' +
        availableCount + '/' + children.length + '</span> · 含子子孙孙</div>';
    container.appendChild(overview);

    childConfig.trainingTypes.forEach(function(training) {
        const card = document.createElement('div');
        card.className = 'c-train-card';
        card.innerHTML =
            '<div style="font-weight:bold;color:' + getTrainingColor(training.id) + ';">' + training.name + '</div>' +
            '<div class="c-hint">' + training.description + '</div>' +
            '<div style="font-size:11px;color:#FFD700;margin:6px 0;">' + training.cost + ' 元/人 · ' + getAttributeDisplayName(training.effect) + '+1</div>' +
            '<button class="c-btn c-btn-pink" style="width:100%;background:' + (availableCount > 0 ? getTrainingColor(training.id) : '#555') + ';" ' +
            'onclick="trainAllChildren(\'' + training.id + '\')" ' + (availableCount === 0 ? 'disabled' : '') + '>全体' + training.name + '（' + availableCount + '）</button>';
        container.appendChild(card);
    });

    const smart = document.createElement('div');
    smart.className = 'c-train-card';
    smart.style.gridColumn = '1 / -1';
    smart.innerHTML =
        '<div style="font-weight:bold;color:#FF69B4;">智能培养</div>' +
        '<div class="c-hint">按每位成员最弱属性自动分配培养</div>' +
        '<button class="c-btn c-btn-pink" style="width:100%;margin-top:8px;" onclick="smartTrainAllChildren()" ' +
        (availableCount === 0 ? 'disabled' : '') + '>智能培养（' + availableCount + '）</button>';
    container.appendChild(smart);
}
function getCurrentStrategyName() {
    const strategies = {
        'balanced': '均衡发展',
        'intelligence': '智力优先',
        'physique': '体质优先',
        'charm': '魅力优先',
        'business': '商业优先'
    };
    return strategies[player.children.trainingStrategy || 'balanced'];
}
function getTrainingColor(trainingType) {
    const colors = {
        'education': '#2196F3',    // 蓝色
        'sports': '#4CAF50',       // 绿色
        'arts': '#9C27B0',         // 紫色
        'business': '#FF9800'      // 橙色
    };
    return colors[trainingType] || '#666';
}
function smartTrainAllChildren() {
    const children = player.children.children || [];
    if (children.length === 0) {
        logAction("没有孩子可以培养", "error");
        return;
    }
    
    const now = Date.now();
    const availableChildren = children.filter(child => {
        const lastTraining = child.lastTraining || 0;
        return (now - lastTraining) >= 60 * 60 * 1000;
    });
    
    if (availableChildren.length === 0) {
        logAction("所有孩子都在培养冷却中", "error");
        return;
    }
    
    let totalCost = 0;
    const trainingPlan = [];
    
    // 为每个孩子选择最优的培养方式
    availableChildren.forEach(child => {
        // 找出孩子最弱的属性
        const attributes = child.attributes;
        const weakestAttribute = Object.keys(attributes).reduce((weakest, attr) => {
            return attributes[attr] < attributes[weakest] ? attr : weakest;
        });
        
        // 找到对应的培养方式
        const bestTraining = childConfig.trainingTypes.find(t => t.effect === weakestAttribute);
        if (bestTraining) {
            totalCost += bestTraining.cost;
            trainingPlan.push({
                childName: child.name,
                training: bestTraining,
                attribute: weakestAttribute,
                currentValue: attributes[weakestAttribute]
            });
        }
    });
    
    if (totalCost === 0) {
        logAction("无法制定培养计划", "error");
        return;
    }
    
    if (player.investmentGame.userData.availableFunds < totalCost) {
        logAction(`资金不足！智能培养需要 ${totalCost} 元`, "error");
        return;
    }
    
    // 显示培养计划
    const planText = trainingPlan.map(plan => 
        `${plan.childName}: ${plan.training.name} (${getAttributeDisplayName(plan.attribute)} ${plan.currentValue}→${plan.currentValue + 1})`
    ).join('\n');
    
    showCustomConfirm(`智能培养计划：\n\n${planText}\n\n总计消耗: ${totalCost} 元`, (confirmed) => {
        if (confirmed) {
            let trainedCount = 0;
            let totalAttributeIncrease = 0;
            
            trainingPlan.forEach(plan => {
                const child = children.find(c => c.name === plan.childName);
                if (child) {
                    const oldValue = child.attributes[plan.attribute];
                    child.attributes[plan.attribute] += 1;
                    child.lastTraining = now;
                    child.totalTraining = (child.totalTraining || 0) + 1;
                    trainedCount++;
                    totalAttributeIncrease += 1;
                    
                    // 检查成长
                    const childIndex = children.indexOf(child);
                    if (childIndex !== -1) {
                        checkChildGrowth(childIndex);
                    }
                }
            });
            
            if (trainedCount > 0) {
                player.investmentGame.userData.availableFunds -= totalCost;
                logAction(`智能培养了 ${trainedCount} 个孩子，总共增加了 ${totalAttributeIncrease} 点属性`, "success");
                
                updateChildSystemUI();
                updateDisplay();
                saveGame();
            }
        }
    });
}
function quickTrainAll() {
    const children = player.children.children || [];
    if (children.length === 0) {
        logAction("没有孩子可以培养", "error");
        return;
    }
    
    const now = Date.now();
    const availableChildren = children.filter(child => {
        const lastTraining = child.lastTraining || 0;
        return (now - lastTraining) >= 60 * 60 * 1000;
    });
    
    if (availableChildren.length === 0) {
        logAction("所有孩子都在培养冷却中", "error");
        return;
    }
    
    // 使用最便宜的教育培养
    const training = childConfig.trainingTypes[0]; // 教育培养
    const totalCost = training.cost * availableChildren.length;
    
    if (player.investmentGame.userData.availableFunds < totalCost) {
        logAction(`资金不足！需要 ${totalCost} 元`, "error");
        return;
    }
    
    showCustomConfirm(`确定要对 ${availableChildren.length} 个孩子进行快速教育培养吗？\n消耗 ${totalCost} 元`, (confirmed) => {
        if (confirmed) {
            let trainedCount = 0;
            
            availableChildren.forEach(child => {
                child.attributes.intelligence += 1;
                child.lastTraining = now;
                child.totalTraining = (child.totalTraining || 0) + 1;
                trainedCount++;
                
                // 检查成长
                const childIndex = children.indexOf(child);
                if (childIndex !== -1) {
                    checkChildGrowth(childIndex);
                }
            });
            
            if (trainedCount > 0) {
                player.investmentGame.userData.availableFunds -= totalCost;
                logAction(`快速培养了 ${trainedCount} 个孩子，智力+${trainedCount}`, "success");
                
                updateChildSystemUI();
                updateDisplay();
                saveGame();
            }
        }
    });
}
// 培养孩子
function trainChild(childIndex, trainingType = null) {
    try {
        console.log('开始培养孩子:', childIndex, '培养类型:', trainingType);
        
        const children = player.children.children;
        if (childIndex >= children.length) {
            logAction("无效的孩子索引", "error");
            return;
        }
        
        const child = children[childIndex];
        console.log('目标孩子:', child);
        
        // 检查培养冷却
        const now = Date.now();
        const lastTraining = child.lastTraining || 0;
        const cooldown = 60 * 60 * 1000; // 1小时冷却
        const remainingTime = cooldown - (now - lastTraining);
        
        if (remainingTime > 0) {
            const minutesRemaining = Math.ceil(remainingTime / (60 * 1000));
            logAction(`${child.name} 培养冷却中，还需等待 ${minutesRemaining} 分钟`, "error");
            return;
        }
        
        // 如果没有指定培养类型，弹出选择框
        if (!trainingType) {
            showTrainingSelection(childIndex);
            return;
        }
        
        const training = childConfig.trainingTypes.find(t => t.id === trainingType);
        if (!training) {
            logAction("无效的培养类型", "error");
            return;
        }
        
        console.log('选择的培养:', training);
        var costMult = (typeof getLineageTrainCostMult === 'function') ? getLineageTrainCostMult() : 1;
        var realCost = Math.floor(training.cost * costMult);
        
        if (player.investmentGame.userData.availableFunds < realCost) {
            logAction("资金不足！需要 " + realCost + " 元", "error");
            return;
        }
        
        // 保存旧的属性值用于比较
        const oldAttributeValue = child.attributes[training.effect];
        console.log('培养前属性值:', training.effect, '=', oldAttributeValue);
        
        
        player.investmentGame.userData.availableFunds -= realCost;
        console.log('扣除资金:', realCost, '剩余:', player.investmentGame.userData.availableFunds);
        
        // 确保属性对象存在
        if (!child.attributes) {
            child.attributes = {
                intelligence: 1,
                physique: 1,
                charm: 1,
                business: 1
            };
        }
        
        // 增加属性 - 确保使用正确的属性名
        const effectMapping = {
            'education': 'intelligence',
            'sports': 'physique',
            'arts': 'charm',
            'business': 'business'
        };
        
        const actualEffect = effectMapping[trainingType] || training.effect;
        console.log('实际影响的属性:', actualEffect);
        
        if (child.attributes[actualEffect] === undefined) {
            child.attributes[actualEffect] = 1; // 初始化属性
        }
        
        // 增加属性值（命格可加成）
        var gain = 1;
        if (typeof applyLineageTalentOnTrain === 'function') {
            gain = applyLineageTalentOnTrain(child, actualEffect, 1);
        }
        child.attributes[actualEffect] += gain;
        const newAttributeValue = child.attributes[actualEffect];
        console.log('培养后属性值:', actualEffect, '=', newAttributeValue);
        
        // 更新其他数据
        child.lastTraining = now;
        child.totalTraining = (child.totalTraining || 0) + 1;
        
        // 记录培养历史（限制长度防止长时间游戏内存增长）
        if (!player.children.trainingHistory) {
            player.children.trainingHistory = [];
        }
        player.children.trainingHistory.push({
            childName: child.name,
            trainingType: training.name,
            attribute: actualEffect,
            oldValue: oldAttributeValue,
            newValue: newAttributeValue,
            timestamp: now
        });
        if (player.children.trainingHistory.length > 100) {
            player.children.trainingHistory = player.children.trainingHistory.slice(-100);
        }
        
        logAction("对 " + child.name + " 进行了" + training.name + "培养，" + getAttributeDisplayName(actualEffect) + "+" + gain + " (" + oldAttributeValue + " → " + newAttributeValue + ")", "success");
        
        // 检查成长阶段
        checkChildGrowth(childIndex);
        
        // 强制更新UI
        updateChildSystemUI();
        updateDisplay();
        saveGame();
        
        console.log('培养完成，当前孩子属性:', child.attributes);
        
    } catch (error) {
        console.error('培养孩子时发生错误:', error);
        logAction("培养过程中出现错误", "error");
    }
}


// 全体培养
function trainAllChildren(trainingType) {
    try {
        console.log('开始全体培养，类型:', trainingType);
        
        const children = player.children.children;
        if (children.length === 0) {
            logAction("没有孩子可以培养", "error");
            return;
        }
        
        const training = childConfig.trainingTypes.find(t => t.id === trainingType);
        if (!training) {
            logAction("无效的培养类型", "error");
            return;
        }
        
        // 检查哪些孩子可以培养
        const now = Date.now();
        const availableChildren = children.filter((child, index) => {
            const lastTraining = child.lastTraining || 0;
            const canTrain = (now - lastTraining) >= 60 * 60 * 1000;
            console.log(`孩子 ${child.name} 可培养:`, canTrain);
            return canTrain;
        });
        
        if (availableChildren.length === 0) {
            const cooldownInfo = children.map(child => {
                const lastTraining = child.lastTraining || 0;
                const remainingTime = Math.max(0, 60 * 60 * 1000 - (now - lastTraining));
                const minutesRemaining = Math.ceil(remainingTime / (60 * 1000));
                return `${child.name}: ${minutesRemaining}分钟`;
            }).join(', ');
            
            logAction(`所有孩子都在培养冷却中: ${cooldownInfo}`, "error");
            return;
        }
        
        const totalCost = training.cost * availableChildren.length;
        if (player.investmentGame.userData.availableFunds < totalCost) {
            logAction(`资金不足！需要 ${totalCost} 元`, "error");
            return;
        }
        
        showCustomConfirm(`确定要对 ${availableChildren.length} 个可培养的孩子进行${training.name}培养吗？\n消耗 ${totalCost} 元\n\n效果: ${getAttributeDisplayName(training.effect)}+1/孩子`, (confirmed) => {
            if (confirmed) {
                let trainedCount = 0;
                let totalAttributeIncrease = 0;
                
                availableChildren.forEach((child) => {
                    const childIndex = children.findIndex(c => c.id === child.id);
                    if (childIndex !== -1) {
                        // 保存旧值
                        const oldValue = child.attributes[training.effect] || 1;
                        
                        // 增加属性
                        if (!child.attributes[training.effect]) {
                            child.attributes[training.effect] = 1;
                        }
                        child.attributes[training.effect] += 1;
                        const newValue = child.attributes[training.effect];
                        
                        child.lastTraining = now;
                        child.totalTraining = (child.totalTraining || 0) + 1;
                        trainedCount++;
                        totalAttributeIncrease += (newValue - oldValue);
                        
                        console.log(`孩子 ${child.name} ${training.effect}: ${oldValue} → ${newValue}`);
                        
                        // 检查成长
                        checkChildGrowth(childIndex);
                    }
                });
                
                if (trainedCount > 0) {
                    player.investmentGame.userData.availableFunds -= totalCost;
                    
                    logAction(`对 ${trainedCount} 个孩子进行了${training.name}培养，${getAttributeDisplayName(training.effect)} 总共增加了 ${totalAttributeIncrease} 点`, "success");
                    
                    updateChildSystemUI();
                    updateDisplay();
                    saveGame();
                }
            }
        });
        
    } catch (error) {
        console.error('全体培养时发生错误:', error);
        logAction("全体培养过程中出现错误", "error");
    }
}
function getAttributeDisplayName(attribute) {
    const displayNames = {
        'intelligence': '智力',
        'physique': '体质',
        'charm': '魅力',
        'business': '商业'
    };
    return displayNames[attribute] || attribute;
}

function ensureChildAttributes(child) {
    if (!child.attributes) {
        child.attributes = {
            intelligence: 1,
            physique: 1,
            charm: 1,
            business: 1
        };
    }
    
    // 确保所有属性都存在
    const defaultAttributes = ['intelligence', 'physique', 'charm', 'business'];
    defaultAttributes.forEach(attr => {
        if (child.attributes[attr] === undefined || child.attributes[attr] === null) {
            child.attributes[attr] = 1;
        }
    });
    
    return child;
}
function createNewChild(name, gender, generation, parentId, inheritFrom) {
    const gen = generation || 1;
    const rate = childConfig.lineage.inheritanceRate;
    let attrs = { intelligence: 1, physique: 1, charm: 1, business: 1 };

    if (inheritFrom && inheritFrom.attributes) {
        attrs = {
            intelligence: Math.max(1, Math.floor(1 + (inheritFrom.attributes.intelligence || 1) * rate)),
            physique: Math.max(1, Math.floor(1 + (inheritFrom.attributes.physique || 1) * rate)),
            charm: Math.max(1, Math.floor(1 + (inheritFrom.attributes.charm || 1) * rate)),
            business: Math.max(1, Math.floor(1 + (inheritFrom.attributes.business || 1) * rate))
        };
        // 血脉暴击：小概率额外继承
        if (Math.random() < 0.15) {
            const keys = Object.keys(attrs);
            const k = keys[Math.floor(Math.random() * keys.length)];
            attrs[k] += Math.max(1, Math.floor((inheritFrom.attributes[k] || 1) * 0.1));
        }
    }

    const child = {
        id: 'child_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
        name: name,
        gender: gender,
        birthDate: Date.now(),
        age: 0,
        growthStage: 0,
        isAdult: false,
        generation: gen,
        parentId: parentId || null,
        attributes: attrs,
        lastTraining: 0,
        totalTraining: 0,
        lastInteraction: 0,
        totalInteractions: 0,
        intimacy: 0,
        currentJob: null,
        workStartTime: 0,
        isMarried: false,
        isPregnant: false,
        pregnancyStart: 0
    };

    addLineageExp(gen === 1 ? 10 : (gen === 2 ? 18 : (gen === 3 ? 28 : 36)));
    if (typeof assignLineageTalentToNewborn === 'function') {
        assignLineageTalentToNewborn(child);
    }
    return ensureChildAttributes(child);
}

// 检查孩子成长
function checkChildGrowth(childIndex) {
    const child = player.children.children[childIndex];
    if (!child || isFamilyMemberAdult(child)) return;
    
    const growthInfo = calculateGrowthCountdown(child);
    
    // 如果满足成长条件，自动成长
    if (growthInfo.canGrow) {
        growChildToNextStage(childIndex);
    }
}
function growChildToNextStage(childIndex) {
    const child = player.children.children[childIndex];
    if (!child) return;
    
    const currentStage = childConfig.growthStages[child.growthStage];
    const nextStage = childConfig.growthStages[child.growthStage + 1];
    
    if (!nextStage) {
        // 到达最后阶段，标记为成年
        child.isAdult = true;
        child.growthStage = childConfig.growthStages.length - 1; // 确保索引正确
        logAction(`🎉 ${child.name} 已经长大成人了！现在可以工作了！`, "success");
    } else {
        // 成长到下一阶段
        const oldStage = currentStage.name;
        child.growthStage++;
        const newStage = nextStage.name;
        
        // 成长奖励
        const growthBonus = calculateGrowthBonus(child);
        applyGrowthBonus(child, growthBonus);
        
        logAction(`🎉 ${child.name} 从 ${oldStage} 成长到了 ${newStage}！`, "success");
        
        // 检查是否到达成年阶段
        if (child.growthStage >= childConfig.growthStages.length - 1) {
            child.isAdult = true;
            logAction(`🎉 ${child.name} 已经长大成人了！现在可以工作了！`, "success");
        }
    }
    
    updateChildSystemUI();
    saveGame();
    
    // 递归检查是否可以继续成长
    setTimeout(() => checkChildGrowth(childIndex), 100);
}


function calculateGrowthBonus(child) {
    const stageMultiplier = child.growthStage * 0.1; // 每阶段增加10%奖励
    
    return {
        intelligence: Math.floor(1 + stageMultiplier),
        physique: Math.floor(1 + stageMultiplier),
        charm: Math.floor(1 + stageMultiplier),
        business: Math.floor(1 + stageMultiplier)
    };
}
// 应用成长奖励
function applyGrowthBonus(child, bonus) {
    Object.keys(bonus).forEach(attribute => {
        child.attributes[attribute] += bonus[attribute];
    });
}
function updateGrowthOverview() {
    const container = document.getElementById('growthOverview');
    if (!container) return;

    const children = player.children.children || [];
    if (children.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#C9A0B8;">还没有家族成员</div>';
        return;
    }

    let canGrowCount = 0;
    let growingChildren = 0;
    let totalTimeRemaining = 0;
    children.forEach(function(child) {
        const growthInfo = calculateGrowthCountdown(child);
        if (growthInfo.canGrow) canGrowCount++;
        if (growthInfo.timeRemaining > 0 || growthInfo.attributesNeeded > 0) growingChildren++;
        totalTimeRemaining += growthInfo.timeRemaining;
    });
    const avgHours = Math.floor(totalTimeRemaining / children.length / (60 * 60 * 1000));
    const avgMins = Math.floor((totalTimeRemaining / children.length % (60 * 60 * 1000)) / (60 * 1000));

    container.innerHTML =
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:12px;">' +
        '<div style="color:#4CAF50;">可成长 ' + canGrowCount + '</div>' +
        '<div style="color:#87CEEB;">成长中 ' + growingChildren + '</div>' +
        '<div style="color:#FFA500;">平均 ' + avgHours + 'h' + avgMins + 'm</div>' +
        '</div>';
}

function updateChildBonuses() {
    const container = document.getElementById('childBonuses');
    const detail = document.getElementById('childBonusesDetail');
    const bonuses = calculateChildBonuses();
    const milestoneBonus = getClaimedMilestoneBonus();
    const html =
        '<div class="c-bonus-grid">' +
        '<div class="c-bonus-item"><div class="lab">GPS 加成</div><div class="val">+' + ((bonuses.gpsMultiplier - 1) * 100).toFixed(1) + '%</div></div>' +
        '<div class="c-bonus-item"><div class="lab">点击加成</div><div class="val">+' + ((bonuses.clickMultiplier - 1) * 100).toFixed(1) + '%</div></div>' +
        '<div class="c-bonus-item"><div class="lab">生命加成</div><div class="val">+' + ((bonuses.critRateBonus - 1) * 100).toFixed(1) + '%</div></div>' +
        '<div class="c-bonus-item"><div class="lab">攻击加成</div><div class="val">+' + ((bonuses.goldMultiplier - 1) * 100).toFixed(1) + '%</div></div>' +
        '<div class="c-bonus-item"><div class="lab">世界地图·攻击</div><div class="val">+' + (((bonuses.worldAtkBonus || 0) * 100).toFixed(1)) + '%</div></div>' +
        '<div class="c-bonus-item"><div class="lab">世界地图·生命</div><div class="val">+' + (((bonuses.worldHpBonus || 0) * 100).toFixed(1)) + '%</div></div>' +
        '<div class="c-bonus-item"><div class="lab">世界地图·爆伤</div><div class="val">+' + (((bonuses.worldCritDmgBonus || 0) * 100).toFixed(1)) + '%</div></div>' +
        '</div>' +
        '<p class="c-hint">含代际倍率、血脉里程碑与武道/战魂等世界地图专属加成（当前里程碑 +' + (milestoneBonus * 100).toFixed(0) + '%）</p>';
    if (container) container.innerHTML = html;
    if (detail) detail.innerHTML = html;
    player.children.childBonuses = bonuses;
    // 同步世界地图攻/血/爆伤，避免只开家族面板才刷新
    if (typeof updatePlayerBattleStats === 'function') {
        try { updatePlayerBattleStats(); } catch (e) { /* ignore */ }
    }
}
function triggerChildEvents() {
    if (!player.children || !player.children.children.length) return;
    
    const events = [
        {
            name: "孩子生日",
            condition: () => {
                const today = new Date();
                return player.children.children.some(child => {
                    const birthDate = new Date(child.birthDate);
                    return birthDate.getDate() === today.getDate() && 
                           birthDate.getMonth() === today.getMonth();
                });
            },
            effect: () => {
                const birthdayChildren = player.children.children.filter(child => {
                    const birthDate = new Date(child.birthDate);
                    const today = new Date();
                    return birthDate.getDate() === today.getDate() && 
                           birthDate.getMonth() === today.getMonth();
                });
                
                birthdayChildren.forEach(child => {
                    // 生日奖励
                    Object.keys(child.attributes).forEach(attr => {
                        child.attributes[attr]++;
                    });
                    logAction(`${child.name} 过生日，所有属性+1！`, "success");
                });
            }
        },
        {
            name: "家庭聚会",
            condition: () => Math.random() < 0.01, // 1%几率触发
            effect: () => {
                const happinessBonus = 10;
                logAction("举办了家庭聚会，家庭幸福度大幅提升！", "success");
                // 这里可以添加具体的幸福度提升逻辑
            }
        }
    ];
    
    events.forEach(event => {
        if (event.condition()) {
            event.effect();
        }
    });
}

// 孩子互动功能
function interactWithChild(childIndex) {
    const child = player.children.children[childIndex];
    if (!child) return;
    
    const now = Date.now();
    const lastInteraction = child.lastInteraction || 0;
    const interactionCooldown = 3 * 60 * 60 * 1000; // 3小时冷却
    
    if (now - lastInteraction < interactionCooldown) {
        const remainingTime = interactionCooldown - (now - lastInteraction);
        const hoursRemaining = Math.floor(remainingTime / (60 * 60 * 1000));
        const minutesRemaining = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        logAction(`${child.name} 互动冷却中，还需等待 ${hoursRemaining}小时${minutesRemaining}分钟`, "error");
        return;
    }
    
    if (player.investmentGame.userData.availableFunds < 5000) {
        logAction("资金不足！需要 5000 元", "error");
        return;
    }
    
    // 扣除金币
    player.investmentGame.userData.availableFunds -= 5000;
    
    // 互动效果
    const interactions = [
        { name: "玩耍", effect: "physique", message: "和孩子一起玩耍" },
        { name: "讲故事", effect: "intelligence", message: "给孩子讲故事" },
        { name: "外出", effect: "charm", message: "带孩子外出游玩" },
        { name: "购物", effect: "business", message: "教孩子购物" }
    ];
    
    const interaction = interactions[Math.floor(Math.random() * interactions.length)];
    
    // 增加属性
    child.attributes[interaction.effect] = (child.attributes[interaction.effect] || 0) + 1;
    
    // 增加亲密度
    child.intimacy = (child.intimacy || 0) + 1;
    child.totalInteractions = (child.totalInteractions || 0) + 1;
    child.lastInteraction = now;
    
    // 小几率获得额外奖励（命格可提高几率）
    let bonusMessage = "";
    var extraHit = (typeof onLineageInteractHook === 'function')
        ? onLineageInteractHook(child)
        : (Math.random() < 0.1);
    if (extraHit) {
        const bonusAttribute = Object.keys(child.attributes)[Math.floor(Math.random() * Object.keys(child.attributes).length)];
        child.attributes[bonusAttribute] += 1;
        bonusMessage = "，并且额外增加了" + getAttributeDisplayName(bonusAttribute);
    }
    
    logAction(interaction.message + "，" + child.name + " 的" + getAttributeDisplayName(interaction.effect) + "+1" + bonusMessage + "，亲密度+1", "success");
    
    updateChildSystemUI();
    updateDisplay();
    saveGame();
}
function interactWithAllChildren() {
    const children = player.children.children || [];
    const now = Date.now();
    const interactionCooldown = 3 * 60 * 60 * 1000;
    
    const availableChildren = children.filter(child => {
        const lastInteraction = child.lastInteraction || 0;
        return now - lastInteraction >= interactionCooldown;
    });
    
    if (availableChildren.length === 0) {
        logAction("所有孩子都在互动冷却中", "error");
        return;
    }
    
    const totalCost = 5000 * availableChildren.length;
    if (player.investmentGame.userData.availableFunds < totalCost) {
        logAction(`资金不足！需要 ${totalCost} 元`, "error");
        return;
    }
    
    showCustomConfirm(`确定要与 ${availableChildren.length} 个孩子互动吗？\n消耗 ${totalCost} 元`, (confirmed) => {
        if (confirmed) {
            let interactedCount = 0;
            let totalAttributes = 0;
            
            availableChildren.forEach(child => {
                const interactions = [
                    { effect: "physique" }, { effect: "intelligence" }, 
                    { effect: "charm" }, { effect: "business" }
                ];
                const interaction = interactions[Math.floor(Math.random() * interactions.length)];
                
                child.attributes[interaction.effect] += 1;
                child.intimacy = (child.intimacy || 0) + 1;
                child.totalInteractions = (child.totalInteractions || 0) + 1;
                child.lastInteraction = now;
                if (typeof onLineageInteractHook === 'function') onLineageInteractHook(child);
                
                interactedCount++;
                totalAttributes++;
            });
            
            if (interactedCount > 0) {
                player.investmentGame.userData.availableFunds -= totalCost;
                logAction(`与 ${interactedCount} 个孩子互动，总共增加了 ${totalAttributes} 点属性`, "success");
                
                updateChildSystemUI();
                updateDisplay();
                saveGame();
            }
        }
    });
}

// 辅助函数：获取孩子年龄
function getChildAge(child) {
    const birthDate = child.birthDate || Date.now();
    const ageInYears = Math.floor((Date.now() - birthDate) / (1 * 24 * 60 * 60 * 1000));
    return Math.max(0, ageInYears);
}

function updateChildWorkSystem() {
    const container = document.getElementById('childWorkSystem');
    if (!container) return;

    const children = player.children.children || [];
    const adultChildren = children.filter(isFamilyMemberAdult);

    if (adultChildren.length === 0) {
        container.innerHTML =
            '<div style="text-align:center;color:#C9A0B8;padding:16px;">还没有成年成员可打工<br><span style="font-size:12px;">需成长至青年阶段 · 当前：' +
            getGrowthStageInfo(children) + '</span></div>';
        return;
    }

    container.innerHTML =
        '<div class="c-hint" style="margin-top:0;">成年家族成员可打工（' + adultChildren.length + '/' + children.length +
        '）。时薪随属性与代数提升：子孙代数越高，同属性收入越高。</div>' +
        '<div id="workChildrenList" class="c-member-grid" style="margin:10px 0;"></div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        '<button class="c-btn c-btn-green" style="flex:1;" onclick="collectAllChildWorkIncome()">收取全部收入</button>' +
        '<button class="c-btn c-btn-blue" style="flex:1;" onclick="autoAssignAllJobs()">自动分配工作</button>' +
        '</div>';
    updateWorkChildrenList();
}

function updateWorkChildrenList() {
    const container = document.getElementById('workChildrenList');
    if (!container) return;
    const children = player.children.children || [];
    const adultChildren = children.filter(isFamilyMemberAdult);
    container.innerHTML = '';

    adultChildren.forEach(function(child) {
        const actualIndex = children.findIndex(function(c) { return c.id === child.id; });
        if (actualIndex < 0) return;
        const workInfo = getChildWorkInfo(child);
        const growthStage = childConfig.growthStages[child.growthStage];
        const card = document.createElement('div');
        card.className = 'c-member gen-' + (child.generation || 1);
        card.innerHTML =
            '<span class="c-badge gen">' + getGenerationLabel(child.generation || 1) + '</span>' +
            '<div class="name">' + child.name + '</div>' +
            '<div class="meta">' + (child.gender === 'boy' ? '男' : '女') + ' · ' + (growthStage ? growthStage.name : '成年') + '</div>' +
            (workInfo.currentJob
                ? ('<div style="font-size:12px;color:#4CAF50;">职业 ' + workInfo.currentJob + '</div>' +
                   '<div style="font-size:11px;color:#FFD700;">时薪 ' + formatNumber(workInfo.hourlyIncome) + '</div>' +
                   '<div style="font-size:11px;color:#87CEEB;">已工作 ' + workInfo.hoursWorked.toFixed(1) + 'h · 待收 ' + formatNumber(workInfo.pendingIncome) + '</div>')
                : '<div style="font-size:12px;color:#FF6B6B;">待业中</div>') +
            '<div class="attrs" style="margin-top:6px;">' +
            '<div style="color:#2196F3;">智 ' + child.attributes.intelligence + '</div>' +
            '<div style="color:#4CAF50;">体 ' + child.attributes.physique + '</div>' +
            '<div style="color:#9C27B0;">魅 ' + child.attributes.charm + '</div>' +
            '<div style="color:#FF9800;">商 ' + child.attributes.business + '</div></div>' +
            '<div class="c-actions">' +
            (!workInfo.currentJob
                ? '<button class="c-btn c-btn-sm c-btn-green" onclick="startChildWork(' + actualIndex + ')">开始</button>'
                : ('<button class="c-btn c-btn-sm c-btn-orange" onclick="stopChildWork(' + actualIndex + ')">停止</button>' +
                   '<button class="c-btn c-btn-sm c-btn-blue" onclick="collectChildWorkIncome(' + actualIndex + ')">收取</button>')) +
            '<button class="c-btn c-btn-sm c-btn-purple" onclick="showJobSelection(' + actualIndex + ')">换工作</button>' +
            '</div>';
        container.appendChild(card);
    });
}


function getChildJobDefs() {
    return {
        "学者": { attribute: "intelligence", baseIncome: 12000 },
        "运动员": { attribute: "physique", baseIncome: 8400 },
        "艺人": { attribute: "charm", baseIncome: 5600 },
        "商人": { attribute: "business", baseIncome: 9500 },
        "家将": { attribute: "physique", baseIncome: 15000 },
        "族吏": { attribute: "intelligence", baseIncome: 14000 }
    };
}

function getChildWorkInfo(child) {
    const now = Date.now();
    const jobs = getChildJobDefs();
    
    if (!child.currentJob) {
        return { currentJob: null, hourlyIncome: 0, hoursWorked: 0, pendingIncome: 0 };
    }
    
    const job = jobs[child.currentJob];
    if (!job) {
        return { currentJob: null, hourlyIncome: 0, hoursWorked: 0, pendingIncome: 0 };
    }
    
    const workStartTime = child.workStartTime || now;
    const hoursWorked = (now - workStartTime) / (60 * 60 * 1000);
    const genMult = getGenerationMult(child.generation || 1);
    const hourlyIncome = job.baseIncome * (child.attributes[job.attribute] || 1) * genMult;
    const pendingIncome = Math.floor(hoursWorked * hourlyIncome);
    
    return {
        currentJob: child.currentJob,
        hourlyIncome: hourlyIncome,
        hoursWorked: hoursWorked,
        pendingIncome: pendingIncome
    };
}

// 孩子工作系统（成年孩子）
function startChildWork(childIndex) {
    const child = player.children.children[childIndex];
    if (!child) {
        logAction("无效的成员索引", "error");
        return;
    }
    
    if (!isFamilyMemberAdult(child)) {
        const currentStage = childConfig.growthStages[child.growthStage]?.name || '未知';
        logAction(child.name + " 还是" + currentStage + "，需要成长到青年阶段才能工作", "error");
        return;
    }
    
    if (child.currentJob) {
        logAction(child.name + " 已经在工作了", "error");
        return;
    }
    
    const bestJob = getBestJobForChild(child);
    child.currentJob = bestJob.name;
    child.workStartTime = Date.now();
    
    logAction(child.name + " 开始从事" + bestJob.name + "工作，时薪 " + formatNumber(bestJob.hourlyIncome) + " 元", "success");
    updateChildSystemUI();
    saveGame();
}
function collectChildWorkIncome(childIndex) {
    const child = player.children.children[childIndex];
    if (!child || !child.currentJob) {
        logAction("该孩子没有在工作", "error");
        return;
    }
    
    const workInfo = getChildWorkInfo(child);
    if (workInfo.pendingIncome > 0) {
        player.investmentGame.userData.availableFunds += workInfo.pendingIncome;
        child.workStartTime = Date.now(); // 重置工作时间
        
        logAction(`收取 ${child.name} 的工作收入: ${formatNumber(workInfo.pendingIncome)} 元`, "success");
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    } else {
        logAction(`${child.name} 还没有收入可以收取`, "info");
    }
}
function autoAssignAllJobs() {
    const children = player.children.children || [];
    const adultChildren = children.filter(function(child) {
        return isFamilyMemberAdult(child) && !child.currentJob;
    });
    
    if (adultChildren.length === 0) {
        logAction("没有需要分配工作的成员", "info");
        return;
    }
    
    let assignedCount = 0;
    adultChildren.forEach(function(child) {
        const bestJob = getBestJobForChild(child);
        child.currentJob = bestJob.name;
        child.workStartTime = Date.now();
        assignedCount++;
    });
    
    if (assignedCount > 0) {
        logAction("为 " + assignedCount + " 个成员自动分配了工作", "success");
        updateChildSystemUI();
        saveGame();
    }
}
function getBestJobForChild(child) {
    const jobs = [
        { name: "学者", attribute: "intelligence", baseIncome: 12000 },
        { name: "运动员", attribute: "physique", baseIncome: 8400 },
        { name: "艺人", attribute: "charm", baseIncome: 5600 },
        { name: "商人", attribute: "business", baseIncome: 9500 },
        { name: "家将", attribute: "physique", baseIncome: 15000 },
        { name: "族吏", attribute: "intelligence", baseIncome: 14000 }
    ];
    const genMult = getGenerationMult(child.generation || 1);
    const jobOptions = jobs.map(function(job) {
        const hourlyIncome = job.baseIncome * (child.attributes[job.attribute] || 1) * genMult;
        return Object.assign({}, job, { hourlyIncome: hourlyIncome });
    });
    return jobOptions.reduce(function(best, job) {
        return job.hourlyIncome > best.hourlyIncome ? job : best;
    });
}
function showJobSelection(childIndex) {
    const child = player.children.children[childIndex];
    if (!child || !isFamilyMemberAdult(child)) {
        logAction("只有成年家族成员才能工作", "error");
        return;
    }
    
    const genMult = getGenerationMult(child.generation || 1);
    const jobs = [
        { 
            id: "scholar", 
            name: "学者", 
            attribute: "intelligence", 
            baseIncome: 12000, 
            description: "适合智力高的成员", 
            color: "#2196F3",
            icon: "📚"
        },
        { 
            id: "athlete", 
            name: "运动员", 
            attribute: "physique", 
            baseIncome: 8400, 
            description: "适合体质高的成员", 
            color: "#4CAF50",
            icon: "🏃"
        },
        { 
            id: "artist", 
            name: "艺人", 
            attribute: "charm", 
            baseIncome: 5600, 
            description: "适合魅力高的成员", 
            color: "#9C27B0",
            icon: "🎭"
        },
        { 
            id: "businessman", 
            name: "商人", 
            attribute: "business", 
            baseIncome: 9500, 
            description: "适合商业能力高的成员", 
            color: "#FF9800",
            icon: "💼"
        },
        {
            id: "guard",
            name: "家将",
            attribute: "physique",
            baseIncome: 15000,
            description: "家族护卫，体质越高收入越高（含代际加成）",
            color: "#E53935",
            icon: "⚔"
        },
        {
            id: "clerk",
            name: "族吏",
            attribute: "intelligence",
            baseIncome: 14000,
            description: "打理族务，智力越高收入越高（含代际加成）",
            color: "#00897B",
            icon: "📜"
        }
    ];
    
    // 计算每个工作的时薪
    const jobOptions = jobs.map(job => {
        const hourlyIncome = job.baseIncome * (child.attributes[job.attribute] || 1) * genMult;
        const currentAttribute = child.attributes[job.attribute] || 1;
        const suitability = calculateJobSuitability(child, job);
        
        return {
            ...job,
            hourlyIncome: hourlyIncome,
            currentAttribute: currentAttribute,
            suitability: suitability,
            isCurrent: child.currentJob === job.name
        };
    });
    
    // 按适合度排序
    jobOptions.sort((a, b) => b.suitability - a.suitability);
    
    // 创建选择对话框
    const dialog = document.createElement('div');
    dialog.id = 'jobSelectionDialog';
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #2a2a2a;
        border: 3px solid #FF69B4;
        border-radius: 10px;
        padding: 20px;
        z-index: 1002;
        width: 500px;
        max-width: 90vw;
        max-height: 80vh;
        overflow-y: auto;
        color: white;
    `;
    
    dialog.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #FF69B4; padding-bottom: 10px;">
            <h3 style="color: #FF69B4; margin: 0;">为 ${child.name} 选择职业</h3>
            <button onclick="closeJobSelection()" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">关闭</button>
        </div>
        
        <div style="margin-bottom: 15px; background: #333; padding: 10px; border-radius: 5px;">
            <div style="font-size: 12px; color: #ccc;">当前属性 · ${getGenerationLabel(child.generation || 1)} · 代际收入×${genMult.toFixed(2)}</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 5px;">
                <div style="color: #2196F3;">智力: ${child.attributes.intelligence}</div>
                <div style="color: #4CAF50;">体质: ${child.attributes.physique}</div>
                <div style="color: #9C27B0;">魅力: ${child.attributes.charm}</div>
                <div style="color: #FF9800;">商业: ${child.attributes.business}</div>
            </div>
        </div>
        
        <div id="jobOptionsContainer" style="display: grid; gap: 10px;">
            <!-- 工作选项会动态生成 -->
        </div>
        
        <div style="margin-top: 15px; text-align: center; font-size: 12px; color: #888;">
            点击职业卡片进行选择
        </div>
    `;
    
    // 添加遮罩层
    const overlay = document.createElement('div');
    overlay.id = 'jobSelectionOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 1001;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    
    // 生成工作选项
    const container = document.getElementById('jobOptionsContainer');
    container.innerHTML = '';
    
    jobOptions.forEach((job, index) => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-option';
        jobCard.style.cssText = `
            background: ${job.isCurrent ? '#1a1a1a' : '#333'};
            border: 2px solid ${job.color};
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        `;
        
        if (job.isCurrent) {
            jobCard.innerHTML += `
                <div style="position: absolute; top: 5px; right: 5px; background: ${job.color}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">
                    当前职业
                </div>
            `;
        }
        
        jobCard.innerHTML += `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="font-size: 24px; margin-right: 10px;">${job.icon}</div>
                <div>
                    <div style="font-weight: bold; color: ${job.color}; font-size: 16px;">${job.name}</div>
                    <div style="font-size: 12px; color: #ccc;">适合度: ${job.suitability}%</div>
                </div>
            </div>
            
            <div style="margin-bottom: 10px;">
                <div style="font-size: 12px; color: #ccc;">${job.description}</div>
                <div style="font-size: 11px; color: #FFD700;">时薪: ${formatNumber(job.hourlyIncome)} 金币</div>
                <div style="font-size: 11px; color: ${job.color};">需要: ${getAttributeDisplayName(job.attribute)} ${job.currentAttribute}</div>
            </div>
            
            <div style="background: #444; border-radius: 3px; height: 6px; margin: 5px 0;">
                <div style="background: ${job.color}; height: 100%; border-radius: 3px; width: ${job.suitability}%;"></div>
            </div>
            <div style="font-size: 10px; color: #ccc; text-align: center;">适合度</div>
            
            ${job.isCurrent ? `
                <div style="margin-top: 10px; text-align: center;">
                    <div style="color: #4CAF50; font-size: 11px;">✓ 当前职业</div>
                </div>
            ` : `
                <button onclick="selectJob(${childIndex}, '${job.id}')" 
                        style="margin-top: 10px; background: ${job.color}; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; width: 100%; font-size: 12px;">
                    选择此职业
                </button>
            `}
        `;
        
        // 添加悬停效果
        jobCard.onmouseenter = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        };
        jobCard.onmouseleave = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };
        
        container.appendChild(jobCard);
    });
}
function calculateJobSuitability(child, job) {
    const attributeValue = child.attributes[job.attribute] || 1;
    const maxAttribute = Math.max(1, ...Object.values(child.attributes));
    
    // 基础适合度基于属性值
    let suitability = (attributeValue / maxAttribute) * 100;
    
    // 如果这是当前工作，增加适合度
    if (child.currentJob === job.name) {
        suitability += 20;
    }
    
    // 确保在0-100范围内
    return Math.min(100, Math.max(0, Math.round(suitability)));
}
function selectJob(childIndex, jobId) {
    const child = player.children.children[childIndex];
    if (!child || !isFamilyMemberAdult(child)) {
        logAction("只有成年家族成员才能工作", "error");
        return;
    }
    
    const jobs = {
        "scholar": { name: "学者", attribute: "intelligence", baseIncome: 12000 },
        "athlete": { name: "运动员", attribute: "physique", baseIncome: 8400 },
        "artist": { name: "艺人", attribute: "charm", baseIncome: 5600 },
        "businessman": { name: "商人", attribute: "business", baseIncome: 9500 },
        "guard": { name: "家将", attribute: "physique", baseIncome: 15000 },
        "clerk": { name: "族吏", attribute: "intelligence", baseIncome: 14000 }
    };
    
    const selectedJob = jobs[jobId];
    if (!selectedJob) {
        logAction("无效的职业", "error");
        return;
    }
    
    // 先收取当前工作收入（如果有）
    if (child.currentJob) {
        collectChildWorkIncome(childIndex);
    }
    
    child.currentJob = selectedJob.name;
    child.workStartTime = Date.now();
    
    const genMult = getGenerationMult(child.generation || 1);
    const hourly = selectedJob.baseIncome * (child.attributes[selectedJob.attribute] || 1) * genMult;
    logAction(child.name + " 现在从事" + selectedJob.name + "工作，时薪 " + formatNumber(hourly) + "（含代际×" + genMult.toFixed(2) + "）", "success");
    
    // 关闭对话框
    closeJobSelection();
    
    updateChildSystemUI();
    saveGame();
}
function closeJobSelection() {
    const dialog = document.getElementById('jobSelectionDialog');
    const overlay = document.getElementById('jobSelectionOverlay');
    
    if (dialog) dialog.remove();
    if (overlay) overlay.remove();
}

function updateChildInteractionSystem() {
    const container = document.getElementById('childInteractionSystem');
    if (!container) return;

    const children = player.children.children || [];
    if (children.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#C9A0B8;padding:16px;">还没有成员可以互动</div>';
        return;
    }

    container.innerHTML =
        '<div class="c-hint" style="margin-top:0;">互动增加亲密度与随机属性（5000 元/次，3 小时冷却）</div>' +
        '<div id="interactionChildrenList" class="c-member-grid" style="margin:10px 0;"></div>' +
        '<button class="c-btn c-btn-pink" style="width:100%;" onclick="interactWithAllChildren()">与全部可互动成员互动</button>';
    updateInteractionChildrenList();
}

function updateInteractionChildrenList() {
    const container = document.getElementById('interactionChildrenList');
    if (!container) return;
    const children = player.children.children || [];
    container.innerHTML = '';

    children.forEach(function(child, index) {
        const now = Date.now();
        const remainingTime = Math.max(0, 3 * 60 * 60 * 1000 - (now - (child.lastInteraction || 0)));
        const canInteract = remainingTime <= 0;
        const hoursRemaining = Math.floor(remainingTime / (60 * 60 * 1000));
        const minutesRemaining = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        const card = document.createElement('div');
        card.className = 'c-member gen-' + (child.generation || 1);
        card.innerHTML =
            '<span class="c-badge gen">' + getGenerationLabel(child.generation || 1) + '</span>' +
            '<div class="name">' + child.name + '</div>' +
            '<div class="meta">' + (child.gender === 'boy' ? '男' : '女') + ' · ' + getChildAge(child) + ' 岁</div>' +
            '<div style="font-size:11px;color:' + (canInteract ? '#4CAF50' : '#FF6B6B') + ';">' +
            (canInteract ? '可互动' : ('冷却 ' + hoursRemaining + '时' + minutesRemaining + '分')) + '</div>' +
            '<div class="attrs"><div style="color:#32CD32;">亲密 ' + (child.intimacy || 0) + '</div>' +
            '<div style="color:#FFD700;">互动 ' + (child.totalInteractions || 0) + '</div></div>' +
            '<button class="c-btn c-btn-sm c-btn-pink" style="width:100%;margin-top:8px;" onclick="interactWithChild(' + index + ')" ' +
            (canInteract ? '' : 'disabled') + '>' + (canInteract ? '互动（5000）' : '冷却中') + '</button>';
        container.appendChild(card);
    });
}

function collectAllChildWorkIncome() {
    const children = player.children.children || [];
    let totalIncome = 0;
    let collectedCount = 0;

    children.forEach(function(child) {
        if (isFamilyMemberAdult(child) && child.currentJob) {
            const workInfo = getChildWorkInfo(child);
            if (workInfo.pendingIncome > 0) {
                player.investmentGame.userData.availableFunds += workInfo.pendingIncome;
                totalIncome += workInfo.pendingIncome;
                child.workStartTime = Date.now();
                collectedCount++;
            }
        }
    });

    if (totalIncome > 0) {
        logAction("收取了 " + collectedCount + " 人的工作收入，总计: " + formatNumber(totalIncome) + " 元", "success");
        if (typeof onLineageCollectHook === 'function') onLineageCollectHook();
        updateDisplay();
        updateChildSystemUI();
        saveGame();
    } else {
        logAction("没有工作收入可以收取", "info");
    }
}

function getJobByAttribute(jobName) {
    const def = getChildJobDefs()[jobName];
    if (!def) return null;
    return { attribute: def.attribute, income: def.baseIncome };
}

function getGrowthStageInfo(children) {
    if (!children || children.length === 0) return "没有成员";
    const stageCounts = {};
    children.forEach(function(child) {
        const stage = (childConfig.growthStages[child.growthStage] && childConfig.growthStages[child.growthStage].name) || '未知';
        stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });
    return Object.keys(stageCounts).map(function(stage) { return stage + '×' + stageCounts[stage]; }).join(', ');
}

function stopChildWork(childIndex) {
    const child = player.children.children[childIndex];
    if (!child || !child.currentJob) {
        logAction("该成员没有在工作", "error");
        return;
    }
    const workInfo = getChildWorkInfo(child);
    if (workInfo.pendingIncome > 0) {
        player.investmentGame.userData.availableFunds += workInfo.pendingIncome;
        logAction("停止工作并收取 " + child.name + " 收入 " + formatNumber(workInfo.pendingIncome) + " 元", "success");
    } else {
        logAction(child.name + " 已停止工作", "info");
    }
    child.currentJob = null;
    child.workStartTime = 0;
    updateDisplay();
    updateChildSystemUI();
    saveGame();
}

// 孩子婚姻系统（扩展功能）
function arrangeMarriage(childIndex) {
    const child = player.children.children[childIndex];
    if (!child || !isFamilyMemberAdult(child)) {
        logAction("只有成年成员才能结婚", "error");
        return;
    }
    if (child.isMarried) {
        logAction(child.name + " 已经成婚", "error");
        return;
    }
    if ((child.generation || 1) >= childConfig.lineage.maxGeneration) {
        logAction("玄孙/终世孙一代已达上限，无法继续成婚传宗", "error");
        return;
    }

    const marriageCost = childConfig.lineage.marriageCost;
    if (player.investmentGame.userData.availableFunds < marriageCost) {
        logAction("资金不足！需要 " + marriageCost + " 元", "error");
        return;
    }

    showCustomConfirm("确定要为 " + child.name + " 安排婚姻吗？消耗 " + marriageCost + " 元\n成婚后可孕育下一代", function(confirmed) {
        if (confirmed) {
            player.investmentGame.userData.availableFunds -= marriageCost;
            child.isMarried = true;
            child.marriageDate = Date.now();
            const spouseGender = child.gender === 'boy' ? 'girl' : 'boy';
            const spouseNames = {
                boy: ['子轩', '浩然', '明哲', '俊杰', '天佑', '承安'],
                girl: ['婉清', '诗涵', '若雪', '雨桐', '雅琴', '慕晴']
            };
            child.spouse = {
                name: spouseNames[spouseGender][Math.floor(Math.random() * spouseNames[spouseGender].length)],
                gender: spouseGender
            };
            addLineageExp(15);
            logAction("为 " + child.name + " 安排了婚姻，配偶：" + child.spouse.name + "。可在「传宗」页孕育后代！", "success");
            updateChildSystemUI();
            updateDisplay();
            saveGame();
        }
    });
}

function calculateChildBonuses() {
    const children = player.children.children || [];
    let totalIntelligence = 0;
    let totalPhysique = 0;
    let totalCharm = 0;
    let totalBusiness = 0;
    var ext = (typeof getLineageExtBonusMult === 'function') ? getLineageExtBonusMult() : { global: 1, gps: 1, click: 1, life: 1, atk: 1, contrib: 1, worldAtk: 0, worldHp: 0, worldCritDmg: 0 };
    var contrib = ext.contrib || 1;

    children.forEach(function(child) {
        const mult = getGenerationMult(child.generation || 1) * contrib;
        totalIntelligence += (child.attributes.intelligence || 0) * mult;
        totalPhysique += (child.attributes.physique || 0) * mult;
        totalCharm += (child.attributes.charm || 0) * mult;
        totalBusiness += (child.attributes.business || 0) * mult;
    });

    const milestone = 1 + getClaimedMilestoneBonus();
    const lineageLv = 1 + ((player.children.lineageLevel || 1) - 1) * 0.02;
    var g = (ext.global || 1);

    // 世界地图专属加成：魅力→生命、商业→攻击、体质→爆伤（基础倍率已大幅提升），再叠加武道/战魂/十八代等
    var worldAtk = (totalBusiness * 0.8) + (ext.worldAtk || 0);
    var worldHp = (totalCharm * 0.8) + (ext.worldHp || 0);
    var worldCritDmg = (totalPhysique * 0.5) + (ext.worldCritDmg || 0);

    return {
        gpsMultiplier: (1 + totalIntelligence * childConfig.attributeBonuses.intelligence.gps) * milestone * lineageLv * g * (ext.gps || 1),
        clickMultiplier: (1 + totalPhysique * childConfig.attributeBonuses.physique.click) * milestone * lineageLv * g * (ext.click || 1),
        critRateBonus: (1 + totalCharm * childConfig.attributeBonuses.charm.critRate) * milestone * lineageLv * g * (ext.life || 1),
        goldMultiplier: (1 + totalBusiness * childConfig.attributeBonuses.business.gold) * milestone * lineageLv * g * (ext.atk || 1),
        worldAtkBonus: worldAtk,
        worldHpBonus: worldHp,
        worldCritDmgBonus: worldCritDmg
    };
}

function calculateFamilyHappiness() {
    const children = player.children.children || [];
    let happiness = 50;
    happiness += children.length * 6;
    children.forEach(function(child) {
        happiness += (child.attributes.charm || 0) * 1.5;
        if (isFamilyMemberAdult(child)) happiness += 12;
        if (child.isMarried) happiness += 8;
        happiness += (child.generation || 1) * 3;
    });
    happiness += (player.children.tempHappiness || 0);
    return Math.min(100, Math.floor(happiness));
}

function updateConceptionButton() {
    const button = document.getElementById('conceiveBtn');
    if (!button) return;
    if (player.children.isPregnant) {
        button.disabled = true;
        button.textContent = '已怀孕';
    } else {
        button.disabled = false;
        button.textContent = '怀孕（消耗 ' + childConfig.pregnancy.cost + ' 元）';
    }
}

/* ========== 子孙后代 / 传宗接代 ========== */
function getClaimedMilestoneBonus() {
    const claimed = player.children.claimedMilestones || [];
    let bonus = 0;
    childConfig.lineage.milestones.forEach(function(m) {
        if (claimed.indexOf(m.id) >= 0) bonus += m.bonus;
    });
    return bonus;
}

function addLineageExp(amount) {
    if (!player.children) return;
    player.children.lineageExp = (player.children.lineageExp || 0) + (amount || 0);
    var need = (player.children.lineageLevel || 1) * 40;
    while (player.children.lineageExp >= need) {
        player.children.lineageExp -= need;
        player.children.lineageLevel = (player.children.lineageLevel || 1) + 1;
        logAction("血脉等级提升至 Lv." + player.children.lineageLevel + "！家族加成略微增强", "success");
        need = player.children.lineageLevel * 40;
    }
    tryClaimLineageMilestones();
}

function tryClaimLineageMilestones() {
    const members = (player.children.children || []).length;
    if (!player.children.claimedMilestones) player.children.claimedMilestones = [];
    childConfig.lineage.milestones.forEach(function(m) {
        if (members >= m.need && player.children.claimedMilestones.indexOf(m.id) < 0) {
            player.children.claimedMilestones.push(m.id);
            logAction("达成血脉里程碑【" + m.title + "】！" + m.desc, "success");
        }
    });
}

function updateLineageOverview() {
    const el = document.getElementById('lineageOverview');
    if (!el) return;
    const lv = player.children.lineageLevel || 1;
    const exp = player.children.lineageExp || 0;
    const need = lv * 40;
    const pct = Math.min(100, (exp / need) * 100);
    const members = (player.children.children || []).length;
    el.innerHTML =
        '<div class="c-bonus-grid">' +
        '<div class="c-bonus-item"><div class="lab">血脉等级</div><div class="val">Lv.' + lv + '</div></div>' +
        '<div class="c-bonus-item"><div class="lab">血脉经验</div><div class="val">' + exp + '/' + need + '</div></div>' +
        '<div class="c-bonus-item"><div class="lab">家族人数</div><div class="val">' + members + '</div></div>' +
        '<div class="c-bonus-item"><div class="lab">里程碑加成</div><div class="val">+' + (getClaimedMilestoneBonus() * 100).toFixed(0) + '%</div></div>' +
        '</div>' +
        '<div class="c-progress" style="margin-top:10px;"><i style="width:' + pct + '%"></i><span>升级进度 ' + pct.toFixed(0) + '%</span></div>' +
        '<p class="c-hint">孙子贡献 ×1.25，曾孙 ×1.55；下一代继承父母约 ' + (childConfig.lineage.inheritanceRate * 100) + '% 天赋</p>';
}

function updateLineageMilestones() {
    const el = document.getElementById('lineageMilestones');
    if (!el) return;
    const members = (player.children.children || []).length;
    const claimed = player.children.claimedMilestones || [];
    el.innerHTML = childConfig.lineage.milestones.map(function(m) {
        const done = claimed.indexOf(m.id) >= 0 || members >= m.need;
        return '<div class="c-milestone' + (done ? ' done' : '') + '">' +
            '<div><div class="ms-title">' + m.title + '</div><div class="ms-desc">' + m.desc + '</div></div>' +
            '<div style="color:' + (done ? '#4CAF50' : '#C9A0B8') + ';font-weight:bold;">' + Math.min(members, m.need) + '/' + m.need + '</div></div>';
    }).join('');
}

function updateLineageActionList() {
    const container = document.getElementById('lineageActionList');
    if (!container) return;
    const children = player.children.children || [];
    const eligible = children.filter(function(c) {
        return isFamilyMemberAdult(c) && (c.generation || 1) < childConfig.lineage.maxGeneration;
    });

    if (eligible.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#C9A0B8;padding:20px;">暂无成年子女可传宗<br>先培养子女至青年并安排成婚</div>';
        return;
    }

    container.innerHTML = '';
    eligible.forEach(function(child) {
        const index = children.findIndex(function(c) { return c.id === child.id; });
        if (index < 0) return;
        const offspringCount = countOffspringOf(child.id);
        const card = document.createElement('div');
        card.className = 'c-member gen-' + (child.generation || 1);

        let body = '';
        if (!child.isMarried) {
            body =
                '<div class="c-hint">尚未成婚，无法生育下一代</div>' +
                '<button class="c-btn c-btn-gold" style="width:100%;margin-top:8px;" onclick="arrangeMarriage(' + index + ')">安排成婚（多档可选）</button>';
        } else if (child.isPregnant) {
            const progress = calculateDescendantPregnancyProgress(child);
            const remain = Math.max(0, childConfig.lineage.pregnancyDuration - (Date.now() - (child.pregnancyStart || 0)));
            const h = Math.floor(remain / 3600000);
            const m = Math.floor((remain % 3600000) / 60000);
            body =
                '<div style="color:#FF69B4;font-size:12px;">孕育中 · 与 ' + (child.spouse && child.spouse.name ? child.spouse.name : '配偶') + '</div>' +
                '<div class="c-progress"><i style="width:' + progress + '%"></i><span>' + progress.toFixed(1) + '%</span></div>' +
                '<div class="c-hint">剩余约 ' + h + '时' + m + '分</div>' +
                (progress >= 100
                    ? '<button class="c-btn c-btn-green" style="width:100%;" onclick="giveDescendantBirth(' + index + ')">迎接新生儿</button>'
                    : '<button class="c-btn c-btn-orange" style="width:100%;" onclick="rushDescendantBirth(' + index + ')">催生（' + childConfig.lineage.rushCost + '，需95%）</button>');
        } else {
            const canMore = offspringCount < childConfig.lineage.maxPerParent;
            body =
                '<div class="meta">配偶 ' + (child.spouse ? child.spouse.name : '-') + ' · 已育 ' + offspringCount + '/' + childConfig.lineage.maxPerParent + '</div>' +
                (canMore
                    ? ('<div class="c-form-row" style="margin-top:8px;"><input class="c-input" id="descName_' + index + '" placeholder="后代名字" maxlength="10" style="min-width:0;flex:1;width:100%;"></div>' +
                       '<div class="c-form-row"><select class="c-input" id="descGender_' + index + '" style="min-width:0;width:100%;"><option value="boy">男孩</option><option value="girl">女孩</option></select></div>' +
                       '<button class="c-btn c-btn-pink" style="width:100%;" onclick="conceiveDescendant(' + index + ')">孕育下一代（' + childConfig.lineage.pregnancyCost + '）</button>')
                    : '<div class="c-hint" style="color:#FF6B6B;">该分支已达生育上限</div>');
        }

        card.innerHTML =
            '<span class="c-badge gen">' + getGenerationLabel(child.generation || 1) + '</span>' +
            '<div class="name">' + child.name + '</div>' +
            '<div class="meta">' + (child.gender === 'boy' ? '男' : '女') + ' · 将诞下第 ' + ((child.generation || 1) + 1) + ' 代</div>' +
            body;
        container.appendChild(card);
    });
}

function calculateDescendantPregnancyProgress(parent) {
    if (!parent || !parent.isPregnant || !parent.pregnancyStart) return 0;
    return Math.min(100, ((Date.now() - parent.pregnancyStart) / childConfig.lineage.pregnancyDuration) * 100);
}

function conceiveDescendant(parentIndex) {
    const parent = player.children.children[parentIndex];
    if (!parent || !parent.isMarried || !isFamilyMemberAdult(parent)) {
        logAction("只有已婚成年成员才能孕育后代", "error");
        return;
    }
    if (parent.isPregnant) {
        logAction(parent.name + " 已经在孕育中", "error");
        return;
    }
    if ((parent.generation || 1) >= childConfig.lineage.maxGeneration) {
        logAction("已达最大代数", "error");
        return;
    }
    if (countOffspringOf(parent.id) >= childConfig.lineage.maxPerParent) {
        logAction("每位成员最多生育 " + childConfig.lineage.maxPerParent + " 个后代", "error");
        return;
    }
    if ((player.children.children || []).length >= childConfig.lineage.maxTotalMembers) {
        logAction("家族人数已达上限", "error");
        return;
    }

    const nameInput = document.getElementById('descName_' + parentIndex);
    const genderInput = document.getElementById('descGender_' + parentIndex);
    const name = nameInput ? nameInput.value.trim() : '';
    const gender = genderInput ? genderInput.value : 'boy';
    if (!name) {
        logAction("请输入后代名字", "error");
        return;
    }
    if (name.length > 10) {
        logAction("名字不能超过10个字符", "error");
        return;
    }
    if (player.investmentGame.userData.availableFunds < childConfig.lineage.pregnancyCost) {
        logAction("资金不足！需要 " + childConfig.lineage.pregnancyCost + " 元", "error");
        return;
    }

    player.investmentGame.userData.availableFunds -= childConfig.lineage.pregnancyCost;
    parent.isPregnant = true;
    parent.pregnancyStart = Date.now();
    parent.expectedOffspring = { name: name, gender: gender };
    logAction(parent.name + " 与 " + (parent.spouse ? parent.spouse.name : "配偶") + " 开始孕育下一代：" + name, "success");
    updateChildSystemUI();
    updateDisplay();
    saveGame();
}

function giveDescendantBirth(parentIndex) {
    const parent = player.children.children[parentIndex];
    if (!parent || !parent.isPregnant || !parent.expectedOffspring) {
        logAction("没有可分娩的孕育状态", "error");
        return;
    }
    const progress = calculateDescendantPregnancyProgress(parent);
    if (progress < 95) {
        logAction("孕育进度不足（" + progress.toFixed(1) + "%）", "error");
        return;
    }

    const nextGen = (parent.generation || 1) + 1;
    const baby = createNewChild(
        parent.expectedOffspring.name,
        parent.expectedOffspring.gender,
        nextGen,
        parent.id,
        parent
    );
    player.children.children.push(baby);
    player.children.totalChildren = (player.children.totalChildren || 0) + 1;
    parent.isPregnant = false;
    parent.pregnancyStart = 0;
    delete parent.expectedOffspring;

    tryClaimLineageMilestones();
    logAction("喜得" + getGenerationLabel(nextGen) + "：" + baby.name + "！继承了 " + parent.name + " 的部分天赋", "success");
    updateChildSystemUI();
    updateDisplay();
    saveGame();
}

function rushDescendantBirth(parentIndex) {
    const parent = player.children.children[parentIndex];
    if (!parent || !parent.isPregnant) {
        logAction("当前没有孕育中的后代", "error");
        return;
    }
    const progress = calculateDescendantPregnancyProgress(parent);
    if (progress < 95) {
        logAction("需达到 95% 才能催生（当前 " + progress.toFixed(1) + "%）", "error");
        return;
    }
    if (player.investmentGame.userData.availableFunds < childConfig.lineage.rushCost) {
        logAction("资金不足！需要 " + childConfig.lineage.rushCost + " 元", "error");
        return;
    }
    showCustomConfirm("确定催生？消耗 " + childConfig.lineage.rushCost + " 元", function(ok) {
        if (ok) {
            player.investmentGame.userData.availableFunds -= childConfig.lineage.rushCost;
            giveDescendantBirth(parentIndex);
        }
    });
}

function updateFamilyTreeView() {
    const el = document.getElementById('familyTreeView');
    if (!el) return;
    const members = player.children.children || [];
    const spouseName = (player.marriage && player.marriage.spouseName) || '配偶';

    let html = '<div class="c-tree-gen"><div class="c-tree-label">第 0 代 · 本家</div><div class="c-tree-row">' +
        '<div class="c-tree-node c-tree-root"><div class="tn-name">你</div><div class="tn-sub">与 ' + spouseName + '</div></div></div></div>';

    for (var gen = 1; gen <= childConfig.lineage.maxGeneration; gen++) {
        var list = members.filter(function(c) { return (c.generation || 1) === gen; });
        html += '<div class="c-tree-gen"><div class="c-tree-label">第 ' + gen + ' 代 · ' + getGenerationLabel(gen) +
            '（' + list.length + '）</div><div class="c-tree-row">';
        if (list.length === 0) {
            html += '<div class="c-tree-node"><div class="tn-sub">虚位以待</div></div>';
        } else {
            list.forEach(function(c) {
                var parent = getChildById(c.parentId);
                html += '<div class="c-tree-node"><div class="tn-name">' + c.name + '</div><div class="tn-sub">' +
                    (c.gender === 'boy' ? '男' : '女') +
                    (parent ? ' · ' + parent.name + '之子嗣' : '') +
                    (c.isMarried ? ' · 已婚' : '') +
                    (isFamilyMemberAdult(c) ? ' · 成年' : '') +
                    '</div></div>';
            });
        }
        html += '</div></div>';
    }
    el.innerHTML = html;
}

function startDescendantPregnancyTimer() {
    var reg = typeof registerSingletonInterval === 'function' ? registerSingletonInterval : null;
    var start = function(fn, ms) {
        return reg ? reg('_descendantPregnancyId', fn, ms) : registerInterval(fn, ms);
    };
    start(function() {
        if (!player.children || !player.children.children) return;
        var changed = false;
        player.children.children.forEach(function(parent, index) {
            if (parent.isPregnant) {
                var progress = calculateDescendantPregnancyProgress(parent);
                if (progress >= 100) {
                    giveDescendantBirth(index);
                    changed = true;
                }
            }
        });
        var ui = document.getElementById('childSystemUI');
        if (!changed && ui && ui.style.display === 'block' && _childActiveTab === 'lineage') {
            updateLineageActionList();
        }
    }, 30000);
}
function showTrainingSelection(childIndex) {
    const child = player.children.children[childIndex];
    if (!child) return;
    
    const now = Date.now();
    const lastTraining = child.lastTraining || 0;
    const cooldown = 60 * 60 * 1000;
    const remainingTime = Math.max(0, cooldown - (now - lastTraining));
    const minutesRemaining = Math.ceil(remainingTime / (60 * 1000));
    
    let message = `选择对 ${child.name} 的培养方式：\n\n`;
    
    if (remainingTime > 0) {
        message += `⚠️ 培养冷却中: ${minutesRemaining}分钟后可再次培养\n\n`;
    }
    
    message += childConfig.trainingTypes.map(training => 
        `${training.name} (${training.cost}元) - ${training.description}`
    ).join('\n');
    
    showCustomPrompt(message, (selected) => {
        if (selected) {
            const trainingIndex = childConfig.trainingTypes.findIndex(t => 
                selected.includes(t.name)
            );
            if (trainingIndex !== -1) {
                trainChild(childIndex, childConfig.trainingTypes[trainingIndex].id);
            }
        }
    });
}
function startChildCooldownTimer() {
    var reg = typeof registerSingletonInterval === 'function' ? registerSingletonInterval : null;
    var start = function(fn, ms) {
        return reg ? reg('_childCooldownTimerId', fn, ms) : registerInterval(fn, ms);
    };
    start(() => {
        var ui = document.getElementById('childSystemUI');
        if (ui && ui.style.display === 'block') {
            updateChildrenList(); // 每分钟更新一次冷却时间显示
        }
    }, 60000); // 每分钟更新一次
}

// 在游戏主循环中添加孩子系统检查
function addChildSystemToGameLoop() {
    var reg = typeof registerSingletonInterval === 'function' ? registerSingletonInterval : null;
    var start = function(fn, ms) {
        return reg ? reg('_childSystemLoopId', fn, ms) : registerInterval(fn, ms);
    };
    start(function() {
        if (!player.children) return;
        if (player.children.isPregnant) {
            if (calculatePregnancyProgress() >= 100) giveBirth();
        }
        if (player.children.children) {
            player.children.children.forEach(function(child, index) {
                checkChildGrowth(index);
                if (child.isPregnant && calculateDescendantPregnancyProgress(child) >= 100) {
                    giveDescendantBirth(index);
                }
            });
        }
        tryClaimLineageMilestones();
        if (Math.floor(Date.now() / 1000) % 300 === 0) {
            var ui = document.getElementById('childSystemUI');
            if (ui && ui.style.display === 'block') updateChildSystemUI();
        }
    }, 60000);
}
document.addEventListener('DOMContentLoaded', function() {
    if (typeof hasApi === 'function' && hasApi() && typeof goldGameRefreshClientBuild === 'function') {
        goldGameRefreshClientBuild();
    }
    // 确保孩子系统正确初始化
    initChildData();
     initChildSystem();
    // 启动孩子系统主循环
    addChildSystemToGameLoop();
  if (typeof addReincarnationEquipmentButton === 'function') setTimeout(addReincarnationEquipmentButton, 1000);
});
const reincarnationEquipmentConfig = {
    // 装备部位
    slots: ['helmet', 'chest', 'pants', 'shoes', 'necklace', 'weapon'],
    
    // 装备部位名称
    slotNames: {
        helmet: '头盔',
        chest: '衣服',
        pants: '裤子',
        shoes: '鞋子',
        necklace: '项链',
        weapon: '武器'
    },
    
    // 品质配置
    rarities: {
        'common': { name: '普通', min: 1, max: 20, color: '#FFFFFF', weight: 80 },
        'uncommon': { name: '优秀', min: 5, max: 30, color: '#1EFF00', weight: 8.439 },
        'rare': { name: '精良', min: 10, max: 40, color: '#0070DD', weight: 5 },
        'epic': { name: '史诗', min: 20, max: 50, color: '#A335EE', weight: 3 },
        'legendary': { name: '传说', min: 30, max: 60, color: '#FF8000', weight: 2 },
        'mythic': { name: '神话', min: 40, max: 70, color: '#E6CC80', weight: 1 },
        'supreme': { name: '至尊', min: 50, max: 80, color: '#00CCFF', weight: 0.5 },
        'ancient': { name: '远古', min: 60, max: 90, color: '#FF4040', weight: 0.05 },
        'primordial': { name: '上古', min: 70, max: 100, color: '#FF00FF', weight: 0.01 },
        'eternal': { name: '荒古', min: 100, max: 100, color: '#FFD700', weight: 0.001 }
    },
    
    // 装备等级配置 (T1-T15)；T11+ 需轮回30转且满足化圣次数；掉落权重低于 T10
    tiers: {
        1: { name: 'T1', minReincarnation: 1, multiplier: 1, weight: 70 },
        2: { name: 'T2', minReincarnation: 3, multiplier: 3, weight: 23.1117 },
        3: { name: 'T3', minReincarnation: 5, multiplier: 12, weight: 5 },
        4: { name: 'T4', minReincarnation: 8, multiplier: 42, weight: 1 },
        5: { name: 'T5', minReincarnation: 10, multiplier: 150, weight: 0.5 },
        6: { name: 'T6', minReincarnation: 12, multiplier: 525, weight: 0.2 },
        7: { name: 'T7', minReincarnation: 15, multiplier: 1840, weight: 0.1 },
        8: { name: 'T8', minReincarnation: 20, multiplier: 6433, weight: 0.05 },
        9: { name: 'T9', minReincarnation: 25, multiplier: 22520, weight: 0.02 },
        10: { name: 'T10', minReincarnation: 30, multiplier: 78880, weight: 0.01 },
        11: { name: 'T11', minReincarnation: 30, minHuaSheng: 2, multiplier: 276080, weight: 0.005 },
        12: { name: 'T12', minReincarnation: 30, minHuaSheng: 3, multiplier: 966280, weight: 0.002 },
        13: { name: 'T13', minReincarnation: 30, minHuaSheng: 4, multiplier: 3381980, weight: 0.001 },
        14: { name: 'T14', minReincarnation: 30, minHuaSheng: 5, multiplier: 11836930, weight: 0.0002 },
        15: { name: 'T15', minReincarnation: 30, minHuaSheng: 6, multiplier: 41429255, weight: 0.0001 }
    },
    
    // 属性类型
    stats: ['health', 'attack', 'critRate', 'critDamage'],
    
    // 属性名称
    statNames: {
        health: '生命加成',
        attack: '攻击加成',
        critRate: '暴击率',
        critDamage: '爆伤加成'
    },
    
    // 词条数量概率
    statCountWeights: [80, 8.3334, 4, 2.5, 2, 1.5, 1, 0.5, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 0.0001], // 1-15个词条的概率
    
    // 套装配置
    sets: {
        'warrior': { name: '战士套装', bonuses: { 2: { health: 1.41, attack: 1.11 }, 4: { critRate: 2.05, critDamage: 2.2 }, 6: { health: 2.4, attack: 2.3 } } },
        'mage': { name: '法师套装', bonuses: { 2: { attack: 1.25, critRate: 2.03 }, 4: { critDamage: 1.55 }, 6: { attack: 2.4, critRate: 2.08 } } },
        'assassin': { name: '刺客套装', bonuses: { 2: { critRate: 2.06 }, 4: { critDamage: 1.3 }, 6: { critRate: 2.1, critDamage: 1.9 } } },
        'tank': { name: '坦克套装', bonuses: { 2: { health: 1.5 }, 4: { health: 1.8 }, 6: { health: 2.8 } } },
        'archer': { name: '射手套装', bonuses: { 2: { attack: 1.12, critRate: 2.04 }, 4: { critDamage: 1.28 }, 6: { attack: 2.35, critRate: 2.09 } } },
        'support': { name: '辅助套装', bonuses: { 2: { health: 1.25 }, 4: { health: 1.55, attack: 1.2 }, 6: { health: 2.5, attack: 2.4 } } },
        'suppora': { name: '神话套装', bonuses: { 2: { attack: 1.44 }, 4: { health: 1.45, attack: 1.5 }, 6: { health: 2.9, attack: 2.4 } } },
        'supporb': { name: '侠客套装', bonuses: { 2: { critRate: 2.235 }, 4: { health: 1.35, attack: 1.4 }, 6: { health: 2.6, attack: 1.8 } } },
        'supporc': { name: '拳皇套装', bonuses: { 2: { attack: 1.55 }, 4: { health: 1.21, critDamage: 1.2 }, 6: { health: 1.3, critDamage: 1.7 } } },
        'suppord': { name: '洪荒套装', bonuses: { 2: { health: 2.15 }, 4: { health: 2.25, attack: 2.4 }, 6: { health: 2.2, attack: 2.2, critRate: 2.012, critDamage: 2.3 } } },
       'suppore': { name: '渡劫套装', bonuses: { 2: { attack: 4.22 }, 4: { critDamage: 4.25, attack: 4.21 }, 6: { health: 6.3, critRate: 6.01, attack: 6.4 } } },
        'supporf': { name: '鱼鱼套装', bonuses: { 2: { health: 1.35 }, 4: { health: 1.25, attack: 1.21 }, 6: { health: 2.2, attack: 4.2, critRate: 2.212, critDamage: 1.2 } } },
       'supporaaa': { name: '茶茶套装', bonuses: { 2: { critDamage: 1.31 }, 4: { attack: 1.35, critDamage: 1.15 }, 6: { health: 2.5, attack: 2.8, critRate: 2.022, critDamage: 1.6 } } },
        'supporaaa': { name: '武神套装', bonuses: { 2: { attack: 1.75 }, 4: { health: 1.75, attack: 1.21 }, 6: { health: 4.2, attack: 2.2, critRate: 2.042, critDamage: 1.3 } } },
     'supporaaa': { name: '蚩尤套装', bonuses: { 2: { attack: 1.55 }, 4: { critDamage: 1.55, attack: 1.21 }, 6: { health: 2.00, attack: 4.00, critRate: 1.012, critDamage: 2.2 } } },
      'supporaaa': { name: '弑神套装', bonuses: { 2: { attack: 1.25 }, 4: { health: 1.45, attack: 1.21 }, 6: { health: 2.5, attack: 2.1, critRate: 2.023, critDamage: 1.72 } } },
    'supporaab': { name: '五行套装', bonuses: { 2: { health: 1.1, attack: 1.1, critRate: 1.01, critDamage: 1.10 }, 4: { health: 1.5, attack: 1.5, critRate: 1.05, critDamage: 1.5}, 6: { health: 1.8, attack: 1.8, critRate: 1.08, critDamage: 1.80 } } },
   'supporaac': { name: '八荒套装', bonuses: { 2: { health: 1.2, attack: 1.1, critRate: 1.023, critDamage: 1.22 }, 4: { health: 1.4, attack: 2.0, critRate: 1.023, critDamage: 1.2}, 6: { health: 1.4, attack: 2.0, critRate: 1.021, critDamage: 1.44 } } },
    'supporaad': { name: '圣王套装', bonuses: { 2: { health: 1.55, attack: 1.51 }, 4: { health: 1.85, attack: 1.8 }, 6: { health: 4.5, attack: 1.6, critRate: 2.01, critDamage: 1.22 } } },
      'supporaae': { name: '永恒套装', bonuses: { 2: { health: 1.13, attack: 1.12, critRate: 1.012, critDamage: 1.15 }, 4: { health: 1.5, attack: 1.25, critRate: 2.045, critDamage: 1.40}, 6: { health: 1.98, attack: 1.78, critRate: 2.033, critDamage: 1.92 } } },
      'supporaaf': { name: '地煞套装', bonuses: { 2: { health: 1.25, attack: 1.57 }, 4: { health: 1.35, attack: 1.91 }, 6: { health: 2.2, attack: 2.00, critRate: 2.05, critDamage: 2.72 } } },
    'supporaag': { name: '诸神套装', bonuses: { 2: { critDamage: 1.75 }, 4: { health: 1.25, critDamage: 2.51 }, 6: { health: 2.0,  critRate: 2.03, critDamage: 4.52 } } },
    'supporaah': { name: '不可思议套装', bonuses: { 2: { critRate: 2.1 }, 4: {  health: 2.2 , critDamage: 2.00 }, 6: { critRate: 2.3, critDamage: 8.00 } } },
       'supporg': { name: '闫闫套装', bonuses: { 2: { critRate: 1.015 }, 4: { health: 1.35, attack: 1.22 }, 6: { health: 1.4, attack: 2.6, critRate: 2.013, critDamage: 0.8 } } },
       'supporh': { name: '修罗套装', bonuses: { 2: { attack: 1.45 }, 4: { critDamage: 1.66, attack: 1.66 }, 6: { health: 2.5, attack: 2.1, critRate: 2.011, critDamage: 1.5 } } },
      'suppori': { name: '麒麟套装', bonuses: { 2: { attack: 1.75 }, 4: { health: 1.75, attack: 1.7 }, 6: { health: 2.5, attack: 6.4 } } },
     'suppork': { name: '鬼王套装', bonuses: { 2: { critDamage: 2.75 }, 4: { health: 2.35, critDamage: 2.31 }, 6: { health: 4.5, critDamage: 4.4 } } },
   'supporl': { name: '无极套装', bonuses: { 2: { critDamage: 1.95, attack: 1.4 }, 4: { health: 1.35, critDamage: 2.9 }, 6: { critDamage: 3.9, attack: 1.6 } } },
      'supporz': { name: '紫薇套装', bonuses: { 2: { critDamage: 1.45, attack: 1.37 }, 4: { health: 1.65, attack: 1.62 }, 6: { critRate: 2.15, attack: 2.4 } } },
       'supporx': { name: '地藏套装', bonuses: { 2: { critRate: 2.045 }, 4: { health: 2.05, attack: 3.2 }, 6: { health: 2.6, attack: 4.12 } } },
    'supporv': { name: '儒圣套装', bonuses: { 2: { critRate: 2.032 }, 4: { critRate: 3.055, critDamage: 3.9 }, 6: { critRate: 3.15, critDamage: 7.94 } } },
   'supporn': { name: '玄武套装', bonuses: { 2: { health: 1.80 }, 4: { health: 2.5 }, 6: { health: 5.5 } } },
    'supporm': { name: '青龙套装', bonuses: { 2: { attack: 1.80 }, 4: {  attack: 2.5 }, 6: {  attack: 6.0  } } },
   'supporq': { name: '朱雀套装', bonuses: { 2: { health: 1.45, attack: 1.34 }, 4: { health: 1.55, attack: 1.55 }, 6: { health: 2.2, attack: 2.2 } } },
   'supporw': { name: '白虎套装', bonuses: { 2: { critRate: 1.08 }, 4: { health: 1.75, critDamage: 1.72 }, 6: { attack: 2.1, critDamage: 2.2 } } },
  'supporrqw': { name: '神威套装', bonuses: { 2: { critRate: 2.07 }, 4: { health: 2.35, attack: 2.52 }, 6: { health: 2.35, attack: 2.3 } } },
        'hybrid': { name: '混合套装', bonuses: { 2: { health: 1.28, attack: 1.28 }, 4: { critRate: 1.24, critDamage: 1.95 }, 6: { health: 2.2, attack: 2.2, critRate: 4.06, critDamage: 3.3 } } }
    },
    
    // 霸气名字词库
    namePrefixes: [
        '霸天', '灭世', '混沌', '永恒', '不朽', '至尊', '无敌', '破天', '斩神', '弑魔', 
        '焚天', '冰封', '雷霆', '风暴', '星辰', '日月', '乾坤', '阴阳', '洪荒', '太古',
        '诸神', '万界', '九幽', '轮回', '天命', '造化', '鸿蒙', '太初', '虚无', '创世',
        '天罚', '神威', '魔尊', '帝皇', '圣王', '天尊', '神王', '魔帝', '妖皇', '仙帝',
        '龙魂', '凤血', '麒麟', '玄武', '白虎', '朱雀', '青龙', '饕餮', '穷奇', '梼杌',
        '时空', '命运', '因果', '轮回', '生死', '阴阳', '五行', '八卦', '九宫', '十方',
        '无量', '无极', '太极', '两仪', '四象', '六合', '七星', '八荒', '九天', '十地',
        '天魔', '地煞', '人皇', '鬼王', '神尊', '佛主', '道祖', '儒圣', '武神', '文曲',
        '紫薇', '太微', '天市', '北斗', '南斗', '东皇', '西王', '中天', '北极', '南极',
        '金乌', '玉兔', '麒麟', '凤凰', '真龙', '神龟', '白虎', '朱雀', '玄武', '青龙',
        '盘古', '女娲', '伏羲', '神农', '轩辕', '蚩尤', '共工', '祝融', '后羿', '夸父',
        '如来', '观音', '地藏', '文殊', '普贤', '弥勒', '燃灯', '药师', '阿弥陀', '大势至',
        '三清', '四御', '五老', '六司', '七元', '八极', '九曜', '十都', '百解', '千劫',
        '万法', '亿兆', '兆亿', '京垓', '秭穰', '沟涧', '正载', '极恒', '阿僧', '那由',
        '不可思议', '无量大数', '无边', '无数', '无知', '无想', '无念', '无相', '无我', '无心'
    ],
    
    nameSuffixes: [
        '战盔', '神甲', '圣袍', '魔铠', '灵衣', '帝冠', '皇靴', '王戒', '圣链', '神兵',
        '魔刃', '仙器', '法宝', '圣物', '神器', '魔器', '帝兵', '皇器', '王装', '圣装',
        '战甲', '法袍', '道衣', '佛珠', '儒冠', '武靴', '文佩', '兵刃', '法器', '灵宝',
        '天书', '地卷', '人符', '鬼玺', '神印', '魔纹', '妖丹', '仙草', '佛骨', '道心',
        '龙鳞', '凤羽', '麒麟角', '玄武壳', '白虎牙', '朱雀翎', '青龙爪', '饕餮胃', '穷奇翼', '梼杌骨',
        '时空轮', '命运盘', '因果线', '轮回镜', '生死簿', '阴阳图', '五行旗', '八卦阵', '九宫格', '十方印',
        '无量塔', '无极图', '太极印', '两仪剑', '四象旗', '六合锁', '七星灯', '八荒戟', '九天剑', '十地盾',
        '天魔琴', '地煞刀', '人皇印', '鬼王幡', '神尊冠', '佛主钵', '道祖拂', '儒圣笔', '武神枪', '文曲尺',
        '紫薇斗', '太微仪', '天市秤', '北斗勺', '南斗尺', '东皇钟', '西王簪', '中天镜', '北极星', '南极光',
        '金乌羽', '玉兔耳', '麒麟心', '凤凰胆', '真龙珠', '神龟甲', '白虎皮', '朱雀火', '玄武水', '青龙木',
        '盘古斧', '女娲石', '伏羲琴', '神农鼎', '轩辕剑', '蚩尤旗', '共工柱', '祝融火', '后羿弓', '夸父杖',
        '如来掌', '观音瓶', '地藏珠', '文殊剑', '普贤象', '弥勒袋', '燃灯古', '药师壶', '阿弥陀', '大势至',
        '三清铃', '四御印', '五老冠', '六司簿', '七元灯', '八极图', '九曜珠', '十都符', '百解锁', '千劫链',
        '万法轮', '亿兆镜', '兆亿尺', '京垓秤', '秭穰斗', '沟涧仪', '正载表', '极恒钟', '阿僧数', '那由算',
        '不可思议', '无量大数', '无边海', '无数星', '无知界', '无想天', '无念地', '无相空', '无我境', '无心法'
    ]
};

var REINCARNATION_EQUIP_RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'supreme', 'ancient', 'primordial', 'eternal'];
if (window.__deferReincarnationEquipInit && typeof initReincarnationEquipmentSystem === 'function') {
    initReincarnationEquipmentSystem();
    window.__deferReincarnationEquipInit = false;
}
function getReincarnationEquipInventoryCount() {
    return (player.reincarnationEquipment && player.reincarnationEquipment.inventory) ? player.reincarnationEquipment.inventory.length : 0;
}
function getReincarnationEquipFreeSlots() {
    return Math.max(0, GAME_INVENTORY_MAX - getReincarnationEquipInventoryCount());
}
function ensureReincarnationEquipAutoDiscardSettings() {
    if (!player.reincarnationEquipment) return;
    if (!player.reincarnationEquipment.autoDiscard) {
        player.reincarnationEquipment.autoDiscard = { enabled: false, belowRarity: 'common', belowTier: 1 };
    }
    if (player.reincarnationEquipment.autoDiscard.belowTier == null) {
        player.reincarnationEquipment.autoDiscard.belowTier = 1;
    }
}
function isReincarnationEquipLocked(eq) {
    return player.reincarnationEquipment.lockedItems && player.reincarnationEquipment.lockedItems.indexOf(eq.id) >= 0;
}
function shouldReincarnationEquipAutoDiscard(eq) {
    if (!eq || !player.reincarnationEquipment || !player.reincarnationEquipment.autoDiscard) return false;
    if (!REINCARNATION_EQUIP_RARITY_ORDER || !REINCARNATION_EQUIP_RARITY_ORDER.length) return false;
    if (isReincarnationEquipLocked(eq)) return false;
    var cfg = player.reincarnationEquipment.autoDiscard;
    var rarityKey = eq.rarity && REINCARNATION_EQUIP_RARITY_ORDER.indexOf(eq.rarity) >= 0 ? eq.rarity : 'common';
    var ri = REINCARNATION_EQUIP_RARITY_ORDER.indexOf(rarityKey);
    var rth = REINCARNATION_EQUIP_RARITY_ORDER.indexOf(cfg.belowRarity || 'common');
    var rarityOk = (ri >= 0 ? ri : 0) <= (rth >= 0 ? rth : 0);
    var tierOk = (eq.tier || 1) <= (cfg.belowTier || 1);
    return rarityOk && tierOk;
}
function runReincarnationEquipAutoDiscard(silent) {
    if (!REINCARNATION_EQUIP_RARITY_ORDER || !REINCARNATION_EQUIP_RARITY_ORDER.length) return 0;
    ensureReincarnationEquipAutoDiscardSettings();
    if (!player.reincarnationEquipment.autoDiscard.enabled) return 0;
    var before = getReincarnationEquipInventoryCount();
    player.reincarnationEquipment.inventory = player.reincarnationEquipment.inventory.filter(function (eq) {
        return !shouldReincarnationEquipAutoDiscard(eq);
    });
    var count = before - getReincarnationEquipInventoryCount();
    if (count > 0 && !silent) logAction('自动丢弃 ' + count + ' 件轮回装备', 'success');
    if (count > 0) updateReincarnationEquipmentUI();
    return count;
}
function trimReincarnationEquipInventoryOverCap() {
    var over = getReincarnationEquipInventoryCount() - GAME_INVENTORY_MAX;
    if (over <= 0) return 0;
    var sorted = player.reincarnationEquipment.inventory.slice().sort(function (a, b) {
        var ta = (a.tier || 1) - (b.tier || 1);
        if (ta !== 0) return ta;
        if (!REINCARNATION_EQUIP_RARITY_ORDER || !REINCARNATION_EQUIP_RARITY_ORDER.length) return 0;
        var ar = a.rarity && REINCARNATION_EQUIP_RARITY_ORDER.indexOf(a.rarity) >= 0 ? a.rarity : 'common';
        var br = b.rarity && REINCARNATION_EQUIP_RARITY_ORDER.indexOf(b.rarity) >= 0 ? b.rarity : 'common';
        return REINCARNATION_EQUIP_RARITY_ORDER.indexOf(ar) - REINCARNATION_EQUIP_RARITY_ORDER.indexOf(br);
    });
    var trimmed = 0;
    for (var i = 0; i < sorted.length && getReincarnationEquipInventoryCount() > GAME_INVENTORY_MAX; i++) {
        if (isReincarnationEquipLocked(sorted[i])) continue;
        var idx = player.reincarnationEquipment.inventory.findIndex(function (e) { return e.id === sorted[i].id; });
        if (idx >= 0) { player.reincarnationEquipment.inventory.splice(idx, 1); trimmed++; }
    }
    if (trimmed > 0) logAction('轮回装备仓库超限，已自动丢弃 ' + trimmed + ' 件低阶装备', 'info');
    return trimmed;
}
function updateReincarnationEquipCountDisplay() {
    var el = document.getElementById('reincarnationEquipCountDisplay');
    if (el) el.textContent = getReincarnationEquipInventoryCount() + '/' + GAME_INVENTORY_MAX;
}
function initReincarnationEquipAutoDiscardUI() {
    ensureReincarnationEquipAutoDiscardSettings();
    var cfg = player.reincarnationEquipment.autoDiscard;
    var rSel = document.getElementById('reincarnationEquipAutoRarity');
    var tSel = document.getElementById('reincarnationEquipAutoTier');
    var btn = document.getElementById('toggleReincarnationEquipAutoDiscard');
    if (rSel) rSel.value = cfg.belowRarity || 'common';
    if (tSel) tSel.value = String(cfg.belowTier || 1);
    if (btn) {
        btn.textContent = '自动丢弃：' + (cfg.enabled ? '开' : '关');
        btn.style.background = cfg.enabled ? '#4CAF50' : '#ff9800';
    }
}
function setReincarnationEquipAutoThreshold() {
    ensureReincarnationEquipAutoDiscardSettings();
    var rSel = document.getElementById('reincarnationEquipAutoRarity');
    var tSel = document.getElementById('reincarnationEquipAutoTier');
    if (rSel) player.reincarnationEquipment.autoDiscard.belowRarity = rSel.value;
    if (tSel) player.reincarnationEquipment.autoDiscard.belowTier = parseInt(tSel.value, 10) || 1;
}
function toggleReincarnationEquipAutoDiscard() {
    ensureReincarnationEquipAutoDiscardSettings();
    player.reincarnationEquipment.autoDiscard.enabled = !player.reincarnationEquipment.autoDiscard.enabled;
    initReincarnationEquipAutoDiscardUI();
    if (player.reincarnationEquipment.autoDiscard.enabled) runReincarnationEquipAutoDiscard(false);
}
function canAddReincarnationEquipToInventory() {
    return getReincarnationEquipFreeSlots() > 0;
}
function tryPushReincarnationEquipment(eq) {
    if (!eq || !canAddReincarnationEquipToInventory()) return false;
    player.reincarnationEquipment.inventory.push(eq);
    runReincarnationEquipAutoDiscard(true);
    trimReincarnationEquipInventoryOverCap();
    return true;
}
function tryPushBeastToInventory(beast) {
    if (!beast || getBeastInventoryFreeSlots() <= 0) return false;
    player.beasts.inventory.push(beast);
    runBeastAutoDiscard(true);
    trimBeastInventoryOverCap();
    return true;
}
function normalizeReincarnationEquipEntry(eq) {
    if (!eq || typeof eq !== 'object') return null;
    if (typeof REINCARNATION_EQUIP_RARITY_ORDER !== 'undefined') {
        if (!eq.rarity || REINCARNATION_EQUIP_RARITY_ORDER.indexOf(eq.rarity) < 0) {
            eq.rarity = 'common';
        }
    } else if (!eq.rarity) {
        eq.rarity = 'common';
    }
    var tierN = parseInt(eq.tier, 10);
    eq.tier = isFinite(tierN) && tierN >= 1 ? tierN : 1;
    if (!eq.id) {
        eq.id = 'req_fix_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    return eq;
}
// 初始化轮回装备系统
function initReincarnationEquipmentSystem() {
    if (!REINCARNATION_EQUIP_RARITY_ORDER || !REINCARNATION_EQUIP_RARITY_ORDER.length) return;
    if (!player.reincarnationEquipment) {
        player.reincarnationEquipment = {
            equipped: {
                helmet: null,
                chest: null,
                pants: null,
                shoes: null,
                necklace: null,
                weapon: null
            },
            inventory: [],
            lockedItems: [],
            batchDiscardMode: false,
            selectedItems: [],
            autoDiscard: { enabled: false, belowRarity: 'common', belowTier: 1 }
        };
    }
    if (!Array.isArray(player.reincarnationEquipment.inventory)) {
        player.reincarnationEquipment.inventory = [];
    }
    player.reincarnationEquipment.inventory = player.reincarnationEquipment.inventory
        .map(normalizeReincarnationEquipEntry)
        .filter(Boolean);
    ensureReincarnationEquipAutoDiscardSettings();
    trimReincarnationEquipInventoryOverCap();
    runReincarnationEquipAutoDiscard(true);
}

/** loadSave 在脚本前部执行，轮回装备/夜店配置在其后；读档后的初始化须等配置就绪再跑 */
function runDeferredLoadSaveInits() {
    var reincReady = typeof REINCARNATION_EQUIP_RARITY_ORDER !== 'undefined'
        && REINCARNATION_EQUIP_RARITY_ORDER && REINCARNATION_EQUIP_RARITY_ORDER.length;
    if (!reincReady || !window.__nightClubConfigReady) {
        setTimeout(runDeferredLoadSaveInits, 0);
        return;
    }
    if (!window.__reincarnationEquipInitDone) {
        window.__reincarnationEquipInitDone = true;
        if (typeof initReincarnationEquipmentSystem === 'function') {
            try {
                initReincarnationEquipmentSystem();
            } catch (eReq) {
                console.warn('轮回装备初始化失败:', eReq);
            }
        }
    }
    if (!window.__nightClubInitDone) {
        window.__nightClubInitDone = true;
        if (typeof initNightClubSystem === 'function') {
            try {
                initNightClubSystem();
            } catch (eNc) {
                console.warn('夜店系统初始化失败:', eNc);
            }
        }
    }
    window.__pendingDeferredLoadSaveInits = false;
}
if (window.__pendingDeferredLoadSaveInits) {
    runDeferredLoadSaveInits();
}

// 生成随机装备名字
function generateEquipmentName() {
    const config = reincarnationEquipmentConfig;
    
    // 根据装备品质和等级决定名字的霸气程度
    const prefixPool = [...config.namePrefixes];
    const suffixPool = [...config.nameSuffixes];
    
    // 高品质装备使用更霸气的名字
    let prefixIndex, suffixIndex;
    
    if (Math.random() < 0.3) {
        // 30%几率生成三字名字（前缀+中缀+后缀）
        const midfixes = ['·', '之', '的', '', '·', '之', ''];
        const midfix = midfixes[Math.floor(Math.random() * midfixes.length)];
        
        prefixIndex = Math.floor(Math.random() * prefixPool.length);
        suffixIndex = Math.floor(Math.random() * suffixPool.length);
        
        return prefixPool[prefixIndex] + midfix + suffixPool[suffixIndex];
    } else {
        // 70%几率生成四字名字（双前缀或双后缀）
        if (Math.random() < 0.5) {
            // 双前缀+后缀
            const prefix1 = prefixPool[Math.floor(Math.random() * prefixPool.length)];
            let prefix2 = prefixPool[Math.floor(Math.random() * prefixPool.length)];
            // 确保两个前缀不同
            while (prefix2 === prefix1) {
                prefix2 = prefixPool[Math.floor(Math.random() * prefixPool.length)];
            }
            const suffix = suffixPool[Math.floor(Math.random() * suffixPool.length)];
            return prefix1 + prefix2 + suffix;
        } else {
            // 前缀+双后缀
            const prefix = prefixPool[Math.floor(Math.random() * prefixPool.length)];
            const suffix1 = suffixPool[Math.floor(Math.random() * suffixPool.length)];
            let suffix2 = suffixPool[Math.floor(Math.random() * suffixPool.length)];
            // 确保两个后缀不同
            while (suffix2 === suffix1) {
                suffix2 = suffixPool[Math.floor(Math.random() * suffixPool.length)];
            }
            return prefix + suffix1 + suffix2;
        }
    }
}
function generateEquipmentNameWithRarity(rarity, tier) {
    const config = reincarnationEquipmentConfig;
    let name = '';
    
    // 根据品质和等级决定名字的复杂度
    const rarityComplexity = {
        'common': 1, 'uncommon': 1, 'rare': 2, 'epic': 2, 
        'legendary': 3, 'mythic': 3, 'supreme': 4, 
        'ancient': 4, 'primordial': 5, 'eternal': 5
    };
    
    const complexity = rarityComplexity[rarity] || 1;
    const tierBonus = Math.min(tier, 15); // T等级加成（含 T11-T15）
    
    // 高品质高等级装备生成更复杂的名字
    const totalComplexity = complexity + Math.floor(tierBonus / 3);
    
    if (totalComplexity >= 5) {
        // 最高复杂度：四字或五字名字
        name = generateComplexName(3);
    } else if (totalComplexity >= 3) {
        // 中等复杂度：三字或四字名字
        name = Math.random() < 0.7 ? generateComplexName(2) : generateSimpleName();
    } else {
        // 低复杂度：二字或三字名字
        name = Math.random() < 0.3 ? generateComplexName(1) : generateSimpleName();
    }
    
    return name;
}
function generateSimpleName() {
    const config = reincarnationEquipmentConfig;
    const prefix = config.namePrefixes[Math.floor(Math.random() * config.namePrefixes.length)];
    const suffix = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
    
    if (Math.random() < 0.3) {
        // 30%几率加连接符
        const connectors = ['·', '之', '的', ''];
        const connector = connectors[Math.floor(Math.random() * connectors.length)];
        return prefix + connector + suffix;
    }
    
    return prefix + suffix;
}

// 生成复杂名字
function generateComplexName(complexityLevel) {
    const config = reincarnationEquipmentConfig;
    let name = '';
    
    switch (complexityLevel) {
        case 1: // 三字名字
            const prefix1 = config.namePrefixes[Math.floor(Math.random() * config.namePrefixes.length)];
            const suffix1 = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
            const midfixes = ['·', '之', '的', ''];
            const midfix = midfixes[Math.floor(Math.random() * midfixes.length)];
            name = prefix1 + midfix + suffix1;
            break;
            
        case 2: // 四字名字（双前缀或双后缀）
            if (Math.random() < 0.5) {
                // 双前缀
                const prefixA = config.namePrefixes[Math.floor(Math.random() * config.namePrefixes.length)];
                let prefixB = config.namePrefixes[Math.floor(Math.random() * config.namePrefixes.length)];
                while (prefixB === prefixA) {
                    prefixB = config.namePrefixes[Math.floor(Math.random() * config.namePrefixes.length)];
                }
                const suffix = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
                name = prefixA + prefixB + suffix;
            } else {
                // 双后缀
                const prefix = config.namePrefixes[Math.floor(Math.random() * config.namePrefixes.length)];
                const suffixA = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
                let suffixB = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
                while (suffixB === suffixA) {
                    suffixB = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
                }
                name = prefix + suffixA + suffixB;
            }
            break;
            
        case 3: // 五字名字（双前缀+双后缀或前缀+中缀+双后缀）
            if (Math.random() < 0.5) {
                // 双前缀+双后缀（取前后各两字）
                const prefixA = config.namePrefixes[Math.floor(Math.random() * config.namePrefixes.length)];
                let prefixB = config.namePrefixes[Math.floor(Math.random() * config.namePrefixes.length)];
                while (prefixB === prefixA) {
                    prefixB = config.namePrefixes[Math.floor(Math.random() * config.namePrefixes.length)];
                }
                const suffixA = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
                let suffixB = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
                while (suffixB === suffixA) {
                    suffixB = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
                }
                name = prefixA + prefixB + suffixA + suffixB;
            } else {
                // 前缀+中缀+双后缀
                const prefix = config.namePrefixes[Math.floor(Math.random() * config.namePrefixes.length)];
                const midfixes = ['·', '之', '的', ''];
                const midfix = midfixes[Math.floor(Math.random() * midfixes.length)];
                const suffixA = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
                let suffixB = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
                while (suffixB === suffixA) {
                    suffixB = config.nameSuffixes[Math.floor(Math.random() * config.nameSuffixes.length)];
                }
                name = prefix + midfix + suffixA + suffixB;
            }
            break;
    }
    
    return name;
}
// 根据权重随机选择
function weightedRandom(weights) {
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * total;
    
    for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return i + 1; // 返回1-6
        }
    }
    return 1;
}

// 生成轮回装备
function generateReincarnationEquipment(dimensionLevel) {
    if (dimensionLevel < 2) return null; // 次元2以上才掉落
    
    if (Math.random() > 0.001) return null; // 0.1%掉落几率
    
    const config = reincarnationEquipmentConfig;
    
    // 随机选择部位
    const slot = config.slots[Math.floor(Math.random() * config.slots.length)];
    
    // 根据权重随机选择T等级
    const tierWeights = Object.values(config.tiers).map(t => t.weight);
    const tierIndex = weightedRandom(tierWeights) - 1;
    const tier = Object.keys(config.tiers)[tierIndex];
    
    // 根据权重随机选择品质
    const rarityWeights = Object.values(config.rarities).map(r => r.weight);
    const rarityIndex = weightedRandom(rarityWeights) - 1;
    const rarity = Object.keys(config.rarities)[rarityIndex];
    const rarityConfig = config.rarities[rarity];
    
    // 随机选择词条数量
    const statCount = weightedRandom(config.statCountWeights);
    
    // 生成属性
    const stats = {};
    const availableStats = [...config.stats];
    
    for (let i = 0; i < statCount; i++) {
        if (availableStats.length === 0) break;
        
        const statIndex = Math.floor(Math.random() * availableStats.length);
        const stat = availableStats[statIndex];
        const statValue = (Math.random() * (rarityConfig.max - rarityConfig.min) + rarityConfig.min) / 100;
        
        stats[stat] = (stats[stat] || 0) + statValue;
    }
    
    // 检查是否生成套装
    let setBonus = null;
    if (['mythic', 'supreme', 'ancient', 'primordial', 'eternal'].includes(rarity) && Math.random() < 0.80) {
        const setNames = Object.keys(config.sets);
        setBonus = setNames[Math.floor(Math.random() * setNames.length)];
    }
    // 使用新的名字生成算法
    const equipmentName = generateEquipmentNameWithRarity(rarity, parseInt(tier));
    // 创建装备对象
    const equipment = {
        id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: equipmentName,
        slot: slot,
        tier: parseInt(tier),
        rarity: rarity,
        stats: stats,
        setBonus: setBonus,
        owner: player.name,
        dropTime: new Date().toLocaleString('zh-CN'), 
        isLocked: false,
        createdAt: Date.now()
    };
    
    return equipment;
}

// 生成固定T1轮回装备（用于轮回试炼副本等）
function generateT1ReincarnationEquipment() {
    const config = reincarnationEquipmentConfig;
    const slot = config.slots[Math.floor(Math.random() * config.slots.length)];
    const tier = 1;
    const rarityWeights = Object.values(config.rarities).map(r => r.weight);
    const rarityIndex = weightedRandom(rarityWeights) - 1;
    const rarity = Object.keys(config.rarities)[rarityIndex];
    const rarityConfig = config.rarities[rarity];
    const statCount = weightedRandom(config.statCountWeights);
    const stats = {};
    const availableStats = [...config.stats];
    for (let i = 0; i < statCount; i++) {
        if (availableStats.length === 0) break;
        const statIndex = Math.floor(Math.random() * availableStats.length);
        const stat = availableStats[statIndex];
        const statValue = (Math.random() * (rarityConfig.max - rarityConfig.min) + rarityConfig.min) / 100;
        stats[stat] = (stats[stat] || 0) + statValue;
    }
    let setBonus = null;
    if (['mythic', 'supreme', 'ancient', 'primordial', 'eternal'].includes(rarity) && Math.random() < 0.10) {
        const setNames = Object.keys(config.sets);
        setBonus = setNames[Math.floor(Math.random() * setNames.length)];
    }
    const equipmentName = generateEquipmentNameWithRarity(rarity, tier);
    return {
        id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: equipmentName,
        slot: slot,
        tier: tier,
        rarity: rarity,
        stats: stats,
        setBonus: setBonus,
        owner: player.name,
        dropTime: new Date().toLocaleString('zh-CN'),
        isLocked: false,
        createdAt: Date.now()
    };
}

// 生成固定T2轮回装备（用于轮回仙岛副本等）
function generateT3ReincarnationEquipment() {
    const config = reincarnationEquipmentConfig;
    const slot = config.slots[Math.floor(Math.random() * config.slots.length)];
    const tier = 3;
    const rarityWeights = Object.values(config.rarities).map(r => r.weight);
    const rarityIndex = weightedRandom(rarityWeights) - 1;
    const rarity = Object.keys(config.rarities)[rarityIndex];
    const rarityConfig = config.rarities[rarity];
    const statCount = weightedRandom(config.statCountWeights);
    const stats = {};
    const availableStats = [...config.stats];
    for (let i = 0; i < statCount; i++) {
        if (availableStats.length === 0) break;
        const statIndex = Math.floor(Math.random() * availableStats.length);
        const stat = availableStats[statIndex];
        const statValue = (Math.random() * (rarityConfig.max - rarityConfig.min) + rarityConfig.min) / 100;
        stats[stat] = (stats[stat] || 0) + statValue;
    }
    let setBonus = null;
    if (['mythic', 'supreme', 'ancient', 'primordial', 'eternal'].includes(rarity) && Math.random() < 0.10) {
        const setNames = Object.keys(config.sets);
        setBonus = setNames[Math.floor(Math.random() * setNames.length)];
    }
    const equipmentName = generateEquipmentNameWithRarity(rarity, tier);
    return {
        id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: equipmentName,
        slot: slot,
        tier: tier,
        rarity: rarity,
        stats: stats,
        setBonus: setBonus,
        owner: player.name,
        dropTime: new Date().toLocaleString('zh-CN'),
        isLocked: false,
        createdAt: Date.now()
    };
}

function generateT4ReincarnationEquipment() {
    const config = reincarnationEquipmentConfig;
    const slot = config.slots[Math.floor(Math.random() * config.slots.length)];
    const tier = 4;
    const rarityWeights = Object.values(config.rarities).map(r => r.weight);
    const rarityIndex = weightedRandom(rarityWeights) - 1;
    const rarity = Object.keys(config.rarities)[rarityIndex];
    const rarityConfig = config.rarities[rarity];
    const statCount = weightedRandom(config.statCountWeights);
    const stats = {};
    const availableStats = [...config.stats];
    for (let i = 0; i < statCount; i++) {
        if (availableStats.length === 0) break;
        const statIndex = Math.floor(Math.random() * availableStats.length);
        const stat = availableStats[statIndex];
        const statValue = (Math.random() * (rarityConfig.max - rarityConfig.min) + rarityConfig.min) / 100;
        stats[stat] = (stats[stat] || 0) + statValue;
    }
    let setBonus = null;
    if (['mythic', 'supreme', 'ancient', 'primordial', 'eternal'].includes(rarity) && Math.random() < 0.10) {
        const setNames = Object.keys(config.sets);
        setBonus = setNames[Math.floor(Math.random() * setNames.length)];
    }
    const equipmentName = generateEquipmentNameWithRarity(rarity, tier);
    return {
        id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: equipmentName,
        slot: slot,
        tier: tier,
        rarity: rarity,
        stats: stats,
        setBonus: setBonus,
        owner: player.name,
        dropTime: new Date().toLocaleString('zh-CN'),
        isLocked: false,
        createdAt: Date.now()
    };
}

function generateT5ReincarnationEquipment() {
    const config = reincarnationEquipmentConfig;
    const slot = config.slots[Math.floor(Math.random() * config.slots.length)];
    const tier = 5;
    const rarityWeights = Object.values(config.rarities).map(r => r.weight);
    const rarityIndex = weightedRandom(rarityWeights) - 1;
    const rarity = Object.keys(config.rarities)[rarityIndex];
    const rarityConfig = config.rarities[rarity];
    const statCount = weightedRandom(config.statCountWeights);
    const stats = {};
    const availableStats = [...config.stats];
    for (let i = 0; i < statCount; i++) {
        if (availableStats.length === 0) break;
        const statIndex = Math.floor(Math.random() * availableStats.length);
        const stat = availableStats[statIndex];
        const statValue = (Math.random() * (rarityConfig.max - rarityConfig.min) + rarityConfig.min) / 100;
        stats[stat] = (stats[stat] || 0) + statValue;
    }
    let setBonus = null;
    if (['mythic', 'supreme', 'ancient', 'primordial', 'eternal'].includes(rarity) && Math.random() < 0.10) {
        const setNames = Object.keys(config.sets);
        setBonus = setNames[Math.floor(Math.random() * setNames.length)];
    }
    const equipmentName = generateEquipmentNameWithRarity(rarity, tier);
    return {
        id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: equipmentName,
        slot: slot,
        tier: tier,
        rarity: rarity,
        stats: stats,
        setBonus: setBonus,
        owner: player.name,
        dropTime: new Date().toLocaleString('zh-CN'),
        isLocked: false,
        createdAt: Date.now()
    };
}

function generateT2ReincarnationEquipment() {
    const config = reincarnationEquipmentConfig;
    const slot = config.slots[Math.floor(Math.random() * config.slots.length)];
    const tier = 2;
    const rarityWeights = Object.values(config.rarities).map(r => r.weight);
    const rarityIndex = weightedRandom(rarityWeights) - 1;
    const rarity = Object.keys(config.rarities)[rarityIndex];
    const rarityConfig = config.rarities[rarity];
    const statCount = weightedRandom(config.statCountWeights);
    const stats = {};
    const availableStats = [...config.stats];
    for (let i = 0; i < statCount; i++) {
        if (availableStats.length === 0) break;
        const statIndex = Math.floor(Math.random() * availableStats.length);
        const stat = availableStats[statIndex];
        const statValue = (Math.random() * (rarityConfig.max - rarityConfig.min) + rarityConfig.min) / 100;
        stats[stat] = (stats[stat] || 0) + statValue;
    }
    let setBonus = null;
    if (['mythic', 'supreme', 'ancient', 'primordial', 'eternal'].includes(rarity) && Math.random() < 0.10) {
        const setNames = Object.keys(config.sets);
        setBonus = setNames[Math.floor(Math.random() * setNames.length)];
    }
    const equipmentName = generateEquipmentNameWithRarity(rarity, tier);
    return {
        id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: equipmentName,
        slot: slot,
        tier: tier,
        rarity: rarity,
        stats: stats,
        setBonus: setBonus,
        owner: player.name,
        dropTime: new Date().toLocaleString('zh-CN'),
        isLocked: false,
        createdAt: Date.now()
    };
}

// 计算装备总加成
function calculateEquipmentTotalBonus(equipment) {
    const tierMultiplier = reincarnationEquipmentConfig.tiers[equipment.tier].multiplier;
    let totalBonus = 0;
    
    Object.values(equipment.stats).forEach(value => {
        totalBonus += value * tierMultiplier;
    });
    
    return totalBonus;
}

// 获取装备显示颜色
function getEquipmentColor(equipment) {
    return reincarnationEquipmentConfig.rarities[equipment.rarity].color;
}

// 格式化属性值显示
function formatStatValue(value, statType) {
    if (statType === 'critRate') {
        return (value * 100).toFixed(2) + '%';
    }
    return (value * 100).toFixed(1) + '%';
}
// 切换轮回装备系统界面
function toggleReincarnationEquipmentUI() {
   if (player.level.ascentionCounta < 1) {
        alert("需要达到轮回1转才能开启轮回装备！");
        return;
    }
    const overlay = document.getElementById('reincarnationEquipmentOverlay');
    const ui = document.getElementById('reincarnationEquipmentUI');
    
    if (ui.style.display === 'block') {
        // 退出界面时自动退出批量模式
        if (player.reincarnationEquipment.batchDiscardMode) {
            player.reincarnationEquipment.batchDiscardMode = false;
            player.reincarnationEquipment.selectedItems = [];
        }
        
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        initReincarnationEquipmentSystem();
        initReincarnationEquipAutoDiscardUI();
        updateReincarnationEquipmentUI();
    }
}

// 更新轮回装备界面
function updateReincarnationEquipmentUI() {
    updateReincarnationEquipCountDisplay();
    updateEquippedEquipmentDisplay();
    updateEquipmentInventoryDisplay();
    updateSetBonusesDisplay();
    updateEquipmentStatsSummary();
}

// 更新已装备的装备显示
function updateEquippedEquipmentDisplay() {
    const container = document.getElementById('equippedEquipmentContainer');
    const config = reincarnationEquipmentConfig;
    
    let html = '<div class="equipment-slots">';
    
    config.slots.forEach(slot => {
        const equipment = player.reincarnationEquipment.equipped[slot];
        const slotName = config.slotNames[slot];
        
        html += `
            <div class="equipment-slot" data-slot="${slot}">
                <div class="slot-name">${slotName}</div>
                <div class="equipment-display" onclick="unequipItem('${slot}')">
                    ${equipment ? `
                        <div style="color: ${getEquipmentColor(equipment)}; font-weight: bold;">
                            ${equipment.name}
                        </div>
                        <div>T${equipment.tier} ${config.rarities[equipment.rarity].name}</div>
                        <div>签名: ${equipment.owner}</div>
                        <div class="equipment-stats">
                            ${Object.entries(equipment.stats).map(([stat, value]) => `
                                <div>${config.statNames[stat]}: +${formatStatValue(value, stat)}</div>
                            `).join('')}
                        </div>
                        ${equipment.setBonus ? `<div style="color: #FFD700;">${config.sets[equipment.setBonus].name}</div>` : ''}
                    ` : '<div style="color: #666;">空</div>'}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// 更新装备仓库显示
function updateEquipmentInventoryDisplay() {
    const container = document.getElementById('equipmentInventoryContainer');
    const config = reincarnationEquipmentConfig;
    
    // 获取筛选条件
    const filterTier = document.getElementById('inventoryFilterTier').value;
    const filterRarity = document.getElementById('inventoryFilterRarity').value;
    const filterSlot = document.getElementById('inventoryFilterSlot').value;
    const filterSet = document.getElementById('inventoryFilterSet').value;
    
    // 筛选装备
    let filteredEquipment = player.reincarnationEquipment.inventory;
    
    if (filterTier !== 'all') {
        filteredEquipment = filteredEquipment.filter(eq => eq.tier === parseInt(filterTier));
    }
    
    if (filterRarity !== 'all') {
        filteredEquipment = filteredEquipment.filter(eq => eq.rarity === filterRarity);
    }
    
    if (filterSlot !== 'all') {
        filteredEquipment = filteredEquipment.filter(eq => eq.slot === filterSlot);
    }
    
    if (filterSet !== 'all') {
        if (filterSet === 'hasSet') {
            filteredEquipment = filteredEquipment.filter(eq => eq.setBonus);
        } else if (filterSet === 'noSet') {
            filteredEquipment = filteredEquipment.filter(eq => !eq.setBonus);
        }
    }
    
    // 批量丢弃模式下的控制面板
    let controlPanel = '';
    if (player.reincarnationEquipment.batchDiscardMode) {
        const selectedCount = player.reincarnationEquipment.selectedItems.length;
        const totalDiscardable = filteredEquipment.filter(eq => isItemDiscardable(eq)).length;
        
        controlPanel = `
            <div style="background: #444; padding: 10px; border-radius: 5px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>批量丢弃模式</strong>
                    <span style="margin-left: 10px;">已选择: ${selectedCount}/${totalDiscardable}</span>
                </div>
                <div>
                    <button onclick="toggleSelectAll()" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">
                        ${selectedCount === totalDiscardable ? '取消全选' : '全选'}
                    </button>
                    <button onclick="executeBatchDiscard()" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">
                        丢弃选中(${selectedCount})
                    </button>
                    <button onclick="toggleBatchDiscardMode()" style="background: #ff9800; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                        退出模式
                    </button>
                </div>
            </div>
        `;
    }
    
    if (filteredEquipment.length === 0) {
        container.innerHTML = controlPanel + '<div style="text-align: center; color: #666; padding: 20px;">仓库为空</div>';
        return;
    }
    
    let html = controlPanel + '<div class="equipment-inventory-grid">';
    
    filteredEquipment.forEach(equipment => {
        const isLocked = player.reincarnationEquipment.lockedItems.includes(equipment.id);
        const isSelected = isItemSelected(equipment.id);
        const isDiscardable = isItemDiscardable(equipment);
        
        html += `
            <div class="equipment-item ${isLocked ? 'locked' : ''} ${isSelected ? 'selected' : ''}" 
                 data-id="${equipment.id}"
                 onclick="${player.reincarnationEquipment.batchDiscardMode ? `toggleSelectItem('${equipment.id}')` : ''}">
                
                ${player.reincarnationEquipment.batchDiscardMode ? `
                    <div class="selection-checkbox">
                        <input type="checkbox" ${isSelected ? 'checked' : ''} 
                               ${!isDiscardable ? 'disabled' : ''} 
                               onclick="event.stopPropagation(); toggleSelectItem('${equipment.id}')">
                    </div>
                ` : ''}
                
                <div class="equipment-header">
                    <span style="color: ${getEquipmentColor(equipment)}; font-weight: bold;">${equipment.name}</span>
                    <div class="equipment-actions">
                        ${!player.reincarnationEquipment.batchDiscardMode ? `
                            <button onclick="event.stopPropagation(); equipItem('${equipment.id}')" 
                                    ${canEquip(equipment) ? '' : 'disabled'}>装备</button>
                            <button onclick="event.stopPropagation(); toggleLockItem('${equipment.id}')" 
                                    style="background: ${isLocked ? '#ff6b6b' : '#51cf66'}">
                                ${isLocked ? '解锁' : '锁定'}
                            </button>
                            <button onclick="event.stopPropagation(); showExportDialog('${equipment.id}')">导出</button>
                            <button onclick="event.stopPropagation(); discardItem('${equipment.id}')" 
                                    style="background: #ff6b6b" ${isLocked ? 'disabled' : ''}>丢弃</button>
                        ` : ''}
                    </div>
                </div>
                <div class="equipment-info">
                    <div>部位: ${config.slotNames[equipment.slot]}</div>
                    <div>品质: ${config.rarities[equipment.rarity].name}</div>
                    <div>等级: T${equipment.tier}</div>
                    <div>要求: ${getReincarnationEquipmentTierRequirementLabel(equipment.tier)}</div>
                    <div>归属: ${equipment.owner}</div>
                    <div style="color: #aaa; font-size: 0.85em;">掉落: ${equipment.dropTime}</div>
                </div>
                <div class="equipment-stats">
                    ${Object.entries(equipment.stats).map(([stat, value]) => `
                        <div>${config.statNames[stat]}: +${formatStatValue(value, stat)}</div>
                    `).join('')}
                </div>
                ${equipment.setBonus ? `
                    <div class="set-bonus" style="color: #FFD700;">
                        套装: ${config.sets[equipment.setBonus].name}
                    </div>
                ` : ''}
                <div class="equipment-total">
                    总加成: +${(calculateEquipmentTotalBonus(equipment) * 100).toFixed(1)}%
                </div>
                ${!isDiscardable && player.reincarnationEquipment.batchDiscardMode ? `
                    <div style="color: #ff6b6b; font-size: 0.8em; margin-top: 5px;">已锁定</div>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}
// 更新套装加成显示
function updateSetBonusesDisplay() {
    const container = document.getElementById('setBonusesContainer');
    const config = reincarnationEquipmentConfig;
    
    // 计算当前激活的套装
    const equippedSets = {};
    Object.values(player.reincarnationEquipment.equipped).forEach(equipment => {
        if (equipment && equipment.setBonus) {
            equippedSets[equipment.setBonus] = (equippedSets[equipment.setBonus] || 0) + 1;
        }
    });
    
    let html = '<div class="set-bonuses">';
    
    Object.entries(equippedSets).forEach(([setName, count]) => {
        const setConfig = config.sets[setName];
        html += `<div class="set-info">`;
        html += `<h4>${setConfig.name} (${count}/6)</h4>`;
        
        Object.entries(setConfig.bonuses).forEach(([pieceCount, bonuses]) => {
            const isActive = count >= parseInt(pieceCount);
            html += `<div class="set-bonus ${isActive ? 'active' : 'inactive'}">`;
            html += `<span>${pieceCount}件: </span>`;
            html += Object.entries(bonuses).map(([stat, value]) => 
                `${config.statNames[stat]} +${(value * 100).toFixed(1)}%`
            ).join(', ');
            html += `</div>`;
        });
        
        html += `</div>`;
    });
    
    if (Object.keys(equippedSets).length === 0) {
        html += '<div style="color: #666; text-align: center;">未激活任何套装效果</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// 更新装备属性总览
function updateEquipmentStatsSummary() {
    const container = document.getElementById('equipmentStatsSummary');
    
    const totalStats = calculateTotalEquipmentStats();
    
    let html = `
        <div class="stats-summary">
            <h4>装备属性总览</h4>
            <div>生命加成: +${(totalStats.health * 100).toFixed(1)}%</div>
            <div>攻击加成: +${(totalStats.attack * 100).toFixed(1)}%</div>
            <div>暴击率: +${(totalStats.critRate * 100).toFixed(2)}%</div>
            <div>爆伤加成: +${(totalStats.critDamage * 100).toFixed(1)}%</div>
        </div>
    `;
    
    container.innerHTML = html;
}
// 轮回装备：穿戴条件文案（含 T11+ 化圣门槛）
function getReincarnationEquipmentTierRequirementLabel(tier) {
    const tierCfg = reincarnationEquipmentConfig.tiers[tier];
    if (!tierCfg) return '';
    let s = '轮回' + tierCfg.minReincarnation + '转';
    if (tierCfg.minHuaSheng != null && tierCfg.minHuaSheng > 0) {
        s += ' + 化圣≥' + tierCfg.minHuaSheng + '次';
    }
    return s;
}

// 检查是否可以装备
function canEquip(equipment) {
    const tierCfg = reincarnationEquipmentConfig.tiers[equipment.tier];
    if (!tierCfg) return false;
    if ((player.level.ascentionCounta || 0) < tierCfg.minReincarnation) return false;
    const minHua = tierCfg.minHuaSheng;
    if (minHua != null && minHua > 0) {
        if ((Number(player.level && player.level.huaShengCount) || 0) < minHua) return false;
    }
    return true;
}

// 装备物品
function equipItem(equipmentId) {
    const equipment = player.reincarnationEquipment.inventory.find(eq => eq.id === equipmentId);
    if (!equipment) return;
    
    if (!canEquip(equipment)) {
        const tierCfg = reincarnationEquipmentConfig.tiers[equipment.tier];
        let msg = '装备要求：' + getReincarnationEquipmentTierRequirementLabel(equipment.tier);
        msg += '！当前轮回' + (player.level.ascentionCounta || 0) + '转';
        if (tierCfg && tierCfg.minHuaSheng != null && tierCfg.minHuaSheng > 0) {
            msg += '，化圣' + (Number(player.level && player.level.huaShengCount) || 0) + '次';
        }
        logAction(msg, "error");
        return;
    }
    
    const slot = equipment.slot;
    
    // 如果该部位已有装备，先卸下
    if (player.reincarnationEquipment.equipped[slot]) {
        unequipItem(slot);
    }
    
    // 从仓库移除并装备
    player.reincarnationEquipment.equipped[slot] = equipment;
    player.reincarnationEquipment.inventory = player.reincarnationEquipment.inventory.filter(eq => eq.id !== equipmentId);
    
    logAction(`装备了${reincarnationEquipmentConfig.slotNames[slot]}: ${equipment.name}`, "success");
    updateReincarnationEquipmentUI();
    updatePlayerBattleStats();
}

// 卸下物品
function unequipItem(slot) {
    const equipment = player.reincarnationEquipment.equipped[slot];
    if (!equipment) return;
    if (getReincarnationEquipFreeSlots() <= 0) {
        logAction('轮回装备仓库已满（' + GAME_INVENTORY_MAX + '），无法卸下', 'error');
        return;
    }
    
    player.reincarnationEquipment.equipped[slot] = null;
    if (getReincarnationEquipFreeSlots() <= 0) {
        player.reincarnationEquipment.equipped[slot] = equipment;
        logAction('轮回装备仓库已满（' + GAME_INVENTORY_MAX + '），无法卸下', 'error');
        return;
    }
    player.reincarnationEquipment.inventory.push(equipment);
    
    logAction(`卸下了${reincarnationEquipmentConfig.slotNames[slot]}: ${equipment.name}`, "info");
    updateReincarnationEquipmentUI();
    updatePlayerBattleStats();
}

// 切换物品锁定状态
function toggleLockItem(equipmentId) {
    const index = player.reincarnationEquipment.lockedItems.indexOf(equipmentId);
    
    if (index === -1) {
        player.reincarnationEquipment.lockedItems.push(equipmentId);
        logAction("物品已锁定", "info");
    } else {
        player.reincarnationEquipment.lockedItems.splice(index, 1);
        logAction("物品已解锁", "info");
    }
    
    updateReincarnationEquipmentUI();
}

// 丢弃物品
function discardItem(equipmentId) {
    const equipment = player.reincarnationEquipment.inventory.find(eq => eq.id === equipmentId);
    if (!equipment) return;
    
    if (player.reincarnationEquipment.lockedItems.includes(equipmentId)) {
        logAction("物品已锁定，无法丢弃", "error");
        return;
    }
    
    showCustomConfirm(`确定要丢弃 ${equipment.name} 吗？`, (confirmed) => {
        if (confirmed) {
            player.reincarnationEquipment.inventory = player.reincarnationEquipment.inventory.filter(eq => eq.id !== equipmentId);
            logAction(`已丢弃: ${equipment.name}`, "info");
            updateReincarnationEquipmentUI();
        }
    });
}

// 显示导出对话框
function showExportDialog(equipmentId) {
    const equipment = player.reincarnationEquipment.inventory.find(eq => eq.id === equipmentId);
    if (!equipment) return;
    
    // 加密装备数据
    const encryptedData = encryptEquipmentData(equipment);
    const data = decryptEquipmentData(encryptedData); // 解密以获取时间信息
    
    document.getElementById('exportEquipmentData').value = encryptedData;
    document.getElementById('exportTimeInfo').innerHTML = `
        <div style="margin: 10px 0; padding: 10px; background: #444; border-radius: 5px;">
            <div>导出时间: ${new Date(data.exportTime).toLocaleString('zh-CN')}</div>
            <div>过期时间: ${new Date(data.expireTime).toLocaleString('zh-CN')}</div>
            <div id="remainingTime" style="color: #4CAF50; font-weight: bold;">
                剩余时间: ${calculateRemainingTime(data.expireTime)}
            </div>
        </div>
    `;
    
    // 启动倒计时更新
    startExportCountdown(data.expireTime);
    
    document.getElementById('exportDialog').style.display = 'block';
    document.getElementById('exportOverlay').style.display = 'block';
}
function startExportCountdown(expireTime) {
    const countdownElement = document.getElementById('remainingTime');
    if (window.exportCountdownInterval) {
        if (typeof unregisterInterval === 'function') unregisterInterval(window.exportCountdownInterval);
        else clearInterval(window.exportCountdownInterval);
        window.exportCountdownInterval = null;
    }
    
    const countdownInterval = registerInterval(() => {
        const remaining = calculateRemainingTime(expireTime);
        countdownElement.textContent = `剩余时间: ${remaining}`;
        
        if (remaining === '已过期') {
            if (typeof unregisterInterval === 'function') unregisterInterval(countdownInterval);
            else clearInterval(countdownInterval);
            if (window.exportCountdownInterval === countdownInterval) window.exportCountdownInterval = null;
            countdownElement.style.color = '#f44336';
            document.getElementById('copyExportBtn').disabled = true;
        }
    }, 1000);
    
    // 保存interval以便清理
    window.exportCountdownInterval = countdownInterval;
}
// 隐藏导出对话框
function hideExportDialog() {
    if (window.exportCountdownInterval) {
        if (typeof unregisterInterval === 'function') unregisterInterval(window.exportCountdownInterval);
        else clearInterval(window.exportCountdownInterval);
        window.exportCountdownInterval = null;
    }
    document.getElementById('exportDialog').style.display = 'none';
    document.getElementById('exportOverlay').style.display = 'none';
}

// 显示导入对话框
function showImportDialog() {
    document.getElementById('importDialog').style.display = 'block';
    document.getElementById('importOverlay').style.display = 'block';
    document.getElementById('importEquipmentData').value = '';
    document.getElementById('importTimeInfo').innerHTML = '';
    document.getElementById('importEquipmentData').focus();
}
function validateImportCode() {
    const encryptedData = document.getElementById('importEquipmentData').value.trim();
    
    if (!encryptedData) {
        document.getElementById('importTimeInfo').innerHTML = '';
        return null;
    }
    
    try {
        const data = decryptEquipmentData(encryptedData);
        if (!data) {
            document.getElementById('importTimeInfo').innerHTML = 
                '<div style="color: #f44336; margin: 10px 0;">无效的装备代码</div>';
            return null;
        }
        
        const remainingTime = calculateRemainingTime(data.expireTime);
        const isExpired = remainingTime === '已过期';
        
        document.getElementById('importTimeInfo').innerHTML = `
            <div style="margin: 10px 0; padding: 10px; background: #444; border-radius: 5px;">
                <div>装备名称: ${data.name}</div>
                <div>品质: ${reincarnationEquipmentConfig.rarities[data.rarity].name}</div>
                <div>等级: T${data.tier}</div>
                <div>导出时间: ${new Date(data.exportTime).toLocaleString('zh-CN')}</div>
                <div>过期时间: ${new Date(data.expireTime).toLocaleString('zh-CN')}</div>
                <div style="color: ${isExpired ? '#f44336' : '#4CAF50'}; font-weight: bold;">
                    剩余时间: ${remainingTime}
                </div>
                ${isExpired ? '<div style="color: #f44336;">⚠️ 该代码已过期，无法导入</div>' : ''}
            </div>
        `;
        
        return { data: data, isValid: !isExpired };
    } catch (error) {
        document.getElementById('importTimeInfo').innerHTML = 
            `<div style="color: #f44336; margin: 10px 0;">${error.message}</div>`;
        return null;
    }
}
// 隐藏导入对话框
function hideImportDialog() {
    document.getElementById('importDialog').style.display = 'none';
    document.getElementById('importOverlay').style.display = 'none';
}

// 加密装备数据
function encryptEquipmentData(equipment) {
    const data = {
        name: equipment.name,
        slot: equipment.slot,
        tier: equipment.tier,
        rarity: equipment.rarity,
        stats: equipment.stats,
        setBonus: equipment.setBonus,
        owner: equipment.owner,
        dropTime: equipment.dropTime,
        createdAt: equipment.createdAt,
        // 添加时间限制信息
        exportTime: Date.now(), // 导出时间
        expireTime: Date.now() + 10 * 60 * 1000, // 10分钟过期时间
        version: '1.0' // 数据版本
    };
    
    const jsonString = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(jsonString)));
}

// 解密装备数据
function decryptEquipmentData(encryptedData) {
    try {
        const jsonString = decodeURIComponent(escape(atob(encryptedData)));
        const data = JSON.parse(jsonString);
        
        // 验证数据格式
        if (!data.exportTime || !data.expireTime) {
            throw new Error('无效的装备代码：缺少时间信息');
        }
        
        // 检查是否过期
        const currentTime = Date.now();
        if (currentTime > data.expireTime) {
            throw new Error('装备代码已过期（超过10分钟）');
        }
        
        // 检查导出时间是否合理
        if (data.exportTime > currentTime) {
            throw new Error('无效的装备代码：导出时间异常');
        }
        
        return data;
    } catch (error) {
        console.error('解密装备数据失败:', error);
        return null;
    }
}
function calculateRemainingTime(expireTime) {
    const currentTime = Date.now();
    const remaining = expireTime - currentTime;
    
    if (remaining <= 0) {
        return '已过期';
    }
    
    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    return `${minutes}分${seconds}秒`;
}

// 导入装备
function importEquipment() {
    const encryptedData = document.getElementById('importEquipmentData').value.trim();
    
    if (!encryptedData) {
        logAction("请输入装备代码", "error");
        return;
    }
    
    const validation = validateImportCode();
    if (!validation || !validation.isValid) {
        logAction("装备代码无效或已过期", "error");
        return;
    }
    
    const equipmentData = validation.data;
    
    // 检查是否已导入过相同的装备（防止重复导入）
    const existingImport = player.reincarnationEquipment.inventory.find(eq => 
        eq.exportSignature === encryptedData
    );
    
    if (existingImport) {
        logAction("该装备代码已被导入过", "error");
        return;
    }
    
    // 创建新的装备对象
    const newEquipment = {
        id: 'req_import_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: equipmentData.name,
        slot: equipmentData.slot,
        tier: equipmentData.tier,
        rarity: equipmentData.rarity,
        stats: equipmentData.stats,
        setBonus: equipmentData.setBonus,
        owner: equipmentData.owner || '导入的装备',
        dropTime: equipmentData.dropTime || new Date().toLocaleString('zh-CN'),
        isLocked: false,
        createdAt: Date.now(),
        // 记录导入信息
        importTime: Date.now(),
        originalExportTime: equipmentData.exportTime,
        exportSignature: encryptedData // 防止重复导入
    };
    
    if (getReincarnationEquipFreeSlots() <= 0) {
        logAction('轮回装备仓库已满（' + GAME_INVENTORY_MAX + '），无法导入', 'error');
        return;
    }
    player.reincarnationEquipment.inventory.push(newEquipment);
    runReincarnationEquipAutoDiscard(true);
    trimReincarnationEquipInventoryOverCap();
    
    logAction(`成功导入装备: ${newEquipment.name}`, "success");
    hideImportDialog();
    updateReincarnationEquipmentUI();
    
    // 记录导入历史
    recordImportHistory(newEquipment, equipmentData.owner);
}

// 记录导入历史
function recordImportHistory(equipment, originalOwner) {
    if (!player.reincarnationEquipment.importHistory) {
        player.reincarnationEquipment.importHistory = [];
    }
    
    player.reincarnationEquipment.importHistory.push({
        equipmentName: equipment.name,
        originalOwner: originalOwner,
        importTime: Date.now(),
        rarity: equipment.rarity,
        tier: equipment.tier
    });
    
    // 只保留最近10条记录
    if (player.reincarnationEquipment.importHistory.length > 10) {
        player.reincarnationEquipment.importHistory.shift();
    }
}

// 复制导出代码
function copyExportCode() {
    const exportData = document.getElementById('exportEquipmentData');
    exportData.select();
    document.execCommand('copy');
    logAction("装备代码已复制到剪贴板", "success");
}
// 计算总装备属性
function calculateTotalEquipmentStats() {
    const totalStats = {
        health: 0,
        attack: 0,
        critRate: 0,
        critDamage: 0
    };
    
    // 计算单件装备属性
    Object.values(player.reincarnationEquipment.equipped).forEach(equipment => {
        if (equipment) {
            const tierMultiplier = reincarnationEquipmentConfig.tiers[equipment.tier].multiplier;
            
            Object.entries(equipment.stats).forEach(([stat, value]) => {
                totalStats[stat] += value * tierMultiplier;
            });
        }
    });
    
    // 计算套装加成
    const setBonuses = calculateSetBonuses();
    Object.entries(setBonuses).forEach(([stat, value]) => {
        totalStats[stat] += value;
    });
    
    return totalStats;
}

// 计算套装加成
function calculateSetBonuses() {
    const setBonuses = {
        health: 0,
        attack: 0,
        critRate: 0,
        critDamage: 0
    };
    
    const config = reincarnationEquipmentConfig;
    const equippedSets = {};
    
    // 统计各套装件数
    Object.values(player.reincarnationEquipment.equipped).forEach(equipment => {
        if (equipment && equipment.setBonus) {
            equippedSets[equipment.setBonus] = (equippedSets[equipment.setBonus] || 0) + 1;
        }
    });
    
    // 应用套装效果
    Object.entries(equippedSets).forEach(([setName, count]) => {
        const setConfig = config.sets[setName];
        if (!setConfig) return;
        
        Object.entries(setConfig.bonuses).forEach(([pieceCount, bonuses]) => {
            if (count >= parseInt(pieceCount)) {
                Object.entries(bonuses).forEach(([stat, value]) => {
                    // 每轮回1转增加10倍效果
                    const multiplier = 1 + (player.level.ascentionCounta * 10);
                    setBonuses[stat] += value * multiplier;
                });
            }
        });
    });
    
    return setBonuses;
}
function dropReincarnationEquipment() {
    if (!player.reincarnationEquipment || !Array.isArray(player.reincarnationEquipment.inventory)) return;
    if (getReincarnationEquipFreeSlots() <= 0) return;
    const dimensionLevel = player.dimensionLevel;
    const newEquipment = generateReincarnationEquipment(dimensionLevel);
    
    if (newEquipment) {
        player.reincarnationEquipment.inventory.push(newEquipment);
        runReincarnationEquipAutoDiscard(true);
        trimReincarnationEquipInventoryOverCap();
        logAction(`获得轮回装备: ${newEquipment.name} (${reincarnationEquipmentConfig.rarities[newEquipment.rarity].name}) - ${newEquipment.dropTime}`, 'success');
        safePanelUpdate(updateReincarnationEquipmentUI);
    }
}
function toggleBatchDiscardMode() {
    player.reincarnationEquipment.batchDiscardMode = !player.reincarnationEquipment.batchDiscardMode;
    
    const batchDiscardBtn = document.getElementById('batchDiscardBtn');
    if (player.reincarnationEquipment.batchDiscardMode) {
        batchDiscardBtn.innerHTML = '退出批量丢弃模式';
        batchDiscardBtn.style.background = '#f44336';
        // 初始化选中列表
        player.reincarnationEquipment.selectedItems = [];
        logAction("已进入批量丢弃模式，请勾选要丢弃的装备", "info");
    } else {
        batchDiscardBtn.innerHTML = '批量丢弃';
        batchDiscardBtn.style.background = '#ff9800';
        // 清除选中状态
        player.reincarnationEquipment.selectedItems = [];
        logAction("已退出批量丢弃模式", "info");
    }
    
    updateReincarnationEquipmentUI();
}
function toggleSelectItem(equipmentId) {
    if (!player.reincarnationEquipment.batchDiscardMode) return;
    
    const index = player.reincarnationEquipment.selectedItems.indexOf(equipmentId);
    if (index === -1) {
        player.reincarnationEquipment.selectedItems.push(equipmentId);
    } else {
        player.reincarnationEquipment.selectedItems.splice(index, 1);
    }
    
    updateReincarnationEquipmentUI();
}
function executeBatchDiscard() {
    if (!player.reincarnationEquipment.batchDiscardMode || !player.reincarnationEquipment.selectedItems.length) {
        logAction("请先选择要丢弃的装备", "error");
        return;
    }
    
    const selectedCount = player.reincarnationEquipment.selectedItems.length;
    
    // 检查是否有锁定的装备被选中
    const lockedItems = player.reincarnationEquipment.selectedItems.filter(id => 
        player.reincarnationEquipment.lockedItems.includes(id)
    );
    
    if (lockedItems.length > 0) {
        logAction(`有${lockedItems.length}件装备已锁定，无法丢弃`, "error");
        return;
    }
    
    showCustomConfirm(`确定要丢弃选中的${selectedCount}件装备吗？此操作不可撤销！`, (confirmed) => {
        if (confirmed) {
            let discardedCount = 0;
            let failedCount = 0;
            
            player.reincarnationEquipment.selectedItems.forEach(equipmentId => {
                const equipmentIndex = player.reincarnationEquipment.inventory.findIndex(eq => eq.id === equipmentId);
                if (equipmentIndex !== -1) {
                    const equipment = player.reincarnationEquipment.inventory[equipmentIndex];
                    
                    // 再次检查是否锁定（防止状态变化）
                    if (!player.reincarnationEquipment.lockedItems.includes(equipmentId)) {
                        player.reincarnationEquipment.inventory.splice(equipmentIndex, 1);
                        discardedCount++;
                        logAction(`已丢弃: ${equipment.name}`, "info");
                    } else {
                        failedCount++;
                    }
                }
            });
            
            // 退出批量丢弃模式
            player.reincarnationEquipment.batchDiscardMode = false;
            player.reincarnationEquipment.selectedItems = [];
            
            if (failedCount > 0) {
                logAction(`批量丢弃完成，成功丢弃${discardedCount}件装备，${failedCount}件装备因锁定而无法丢弃`, "warning");
            } else {
                logAction(`批量丢弃完成，成功丢弃${discardedCount}件装备`, "success");
            }
            
            updateReincarnationEquipmentUI();
        }
    });
}
function toggleSelectAll() {
    if (!player.reincarnationEquipment.batchDiscardMode) return;
    
    // 获取当前筛选条件下的所有装备ID（未锁定的）
    const allItems = getFilteredEquipmentIds();
    
    if (player.reincarnationEquipment.selectedItems.length === allItems.length) {
        // 取消全选
        player.reincarnationEquipment.selectedItems = [];
    } else {
        // 全选
        player.reincarnationEquipment.selectedItems = [...allItems];
    }
    
    updateReincarnationEquipmentUI();
}

// 获取筛选后的装备ID列表（只包含未锁定的）
function getFilteredEquipmentIds() {
    const config = reincarnationEquipmentConfig;
    
    // 获取筛选条件
    const filterTier = document.getElementById('inventoryFilterTier').value;
    const filterRarity = document.getElementById('inventoryFilterRarity').value;
    const filterSlot = document.getElementById('inventoryFilterSlot').value;
    const filterSet = document.getElementById('inventoryFilterSet').value;
    
    // 筛选装备
    let filteredEquipment = player.reincarnationEquipment.inventory;
    
    if (filterTier !== 'all') {
        filteredEquipment = filteredEquipment.filter(eq => eq.tier === parseInt(filterTier));
    }
    
    if (filterRarity !== 'all') {
        filteredEquipment = filteredEquipment.filter(eq => eq.rarity === filterRarity);
    }
    
    if (filterSlot !== 'all') {
        filteredEquipment = filteredEquipment.filter(eq => eq.slot === filterSlot);
    }
    
    if (filterSet !== 'all') {
        if (filterSet === 'hasSet') {
            filteredEquipment = filteredEquipment.filter(eq => eq.setBonus);
        } else if (filterSet === 'noSet') {
            filteredEquipment = filteredEquipment.filter(eq => !eq.setBonus);
        }
    }
    
    // 只返回未锁定的装备ID
    return filteredEquipment
        .filter(eq => !player.reincarnationEquipment.lockedItems.includes(eq.id))
        .map(eq => eq.id);
}
function isItemSelected(equipmentId) {
    return player.reincarnationEquipment.batchDiscardMode && 
           player.reincarnationEquipment.selectedItems.includes(equipmentId);
}

// 检查装备是否可丢弃（未锁定）
function isItemDiscardable(equipment) {
    return !player.reincarnationEquipment.lockedItems.includes(equipment.id);
}
function showImportHistory() {
    if (!player.reincarnationEquipment.importHistory || player.reincarnationEquipment.importHistory.length === 0) {
        document.getElementById('importHistoryList').innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">暂无导入历史</div>';
    } else {
        let html = '<div class="import-history-list">';
        player.reincarnationEquipment.importHistory.reverse().forEach((record, index) => {
            const timeAgo = formatTimeAgo(record.importTime);
            html += `
                <div class="import-history-item">
                    <div class="import-info">
                        <strong style="color: ${getRarityColor(record.rarity)}">${record.equipmentName}</strong>
                        <div>来自: ${record.originalOwner || '未知玩家'}</div>
                        <div>品质: ${reincarnationEquipmentConfig.rarities[record.rarity].name}</div>
                        <div>等级: T${record.tier}</div>
                    </div>
                    <div class="import-time">${timeAgo}</div>
                </div>
            `;
        });
        html += '</div>';
        document.getElementById('importHistoryList').innerHTML = html;
    }
    
    document.getElementById('importHistoryDialog').style.display = 'block';
    document.getElementById('importHistoryOverlay').style.display = 'block';
}

// 隐藏导入历史
function hideImportHistory() {
    document.getElementById('importHistoryDialog').style.display = 'none';
    document.getElementById('importHistoryOverlay').style.display = 'none';
}

// 格式化时间显示
function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
}

// 获取品质颜色
function getRarityColor(rarity) {
    return reincarnationEquipmentConfig.rarities[rarity]?.color || '#FFFFFF';
}

const beastConfig = {
    // S级别配置：所需轮回转生次数、属性加成范围
    sLevels: {
        'S1': { requiredAscention: 1, multiplierRange: [0.01, 1.00] }, 
        'S2': { requiredAscention: 3, multiplierRange: [0.30, 3.00] }, 
        'S3': { requiredAscention: 5, multiplierRange: [1.00, 9.00] },
        'S4': { requiredAscention: 8, multiplierRange: [3.00, 27.00] },
        'S5': { requiredAscention: 10, multiplierRange: [7.00, 81.00] },
        'S6': { requiredAscention: 12, multiplierRange: [25.00, 243.00] },
        'S7': { requiredAscention: 15, multiplierRange: [80.00, 729.00] },
        'S8': { requiredAscention: 20, multiplierRange: [224.50, 2187.00] },
        'S9': { requiredAscention: 25, multiplierRange: [793.50, 6561.00] },
        'S10': { requiredAscention: 30, multiplierRange: [2250.50, 19683.00] },
        // S11+：属性区间按 S9→S10 量级继续递增；穿戴需轮回30转 + 化圣次数；掉落比 S10 更稀有
        'S11': { requiredAscention: 30, minHuaSheng: 2, multiplierRange: [6751.50, 59049.00] },
        'S12': { requiredAscention: 30, minHuaSheng: 3, multiplierRange: [20253.50, 177147.00] },
        'S13': { requiredAscention: 30, minHuaSheng: 4, multiplierRange: [60759.50, 531441.00] },
        'S14': { requiredAscention: 30, minHuaSheng: 5, multiplierRange: [182277.50, 1594323.00] },
        'S15': { requiredAscention: 30, minHuaSheng: 6, multiplierRange: [546831.50, 4782969.00] }
    },

    // 品质配置：名称、颜色、掉落权重
    rarities: {
        '小宠物': { 
            name: '小宠物', 
            chineseName: '小宠',
            color: '#CCCCCC', // 灰色
            dropWeight: 90, 
            effectMultiplier: 1.0,
            loreWeight: 1, // 背景故事权重
            description: '灵性初开，稚嫩可掬'
        },
        '野兽': { 
            name: '野兽', 
            chineseName: '野兽',
            color: '#1E90FF', // 亮蓝色
            dropWeight: 7.34, 
            effectMultiplier: 1.25,
            loreWeight: 2,
            description: '山林霸主，野性难驯'
        },
        '凶兽': { 
            name: '凶兽', 
            chineseName: '凶兽',
            color: '#8A2BE2', // 紫色
            dropWeight: 1.5, 
            effectMultiplier: 1.5,
            loreWeight: 3,
            description: '嗜血成性，凶威盖世'
        },
        '灵兽': { 
            name: '灵兽', 
            chineseName: '灵兽',
            color: '#00CED1', // 青色
            dropWeight: 1, 
            effectMultiplier: 1.75,
            loreWeight: 4,
            description: '通晓灵性，亲近自然'
        },
        '圣兽': { 
            name: '圣兽', 
            chineseName: '圣兽',
            color: '#FFD700', // 金色
            dropWeight: 0.1, 
            effectMultiplier: 2.0,
            loreWeight: 5,
            description: '祥瑞化身，圣光护体'
        },
        '神兽': { 
            name: '神兽', 
            chineseName: '神兽',
            color: '#FF4500', // 橙红色
            dropWeight: 0.05, 
            effectMultiplier: 2.5,
            loreWeight: 6,
            description: '神威浩荡，镇压一方'
        },
        '炁兽': { 
            name: '炁兽', 
            chineseName: '炁兽',
            color: '#FF1493', // 亮粉色/品红色
            dropWeight: 0.01, 
            effectMultiplier: 3.0,
            loreWeight: 7,
            description: '炁之本源，大道显化'
        }
    },

    // 可获得的属性词条类型
    affixTypes: ['生命加成', '攻击加成', '爆伤加成'],

    // 词条数概率分布
    affixCountProbs: {
        1: 90,
        2: 8.39,
        3: 1,
        4: 0.5,
        5: 0.1,
        6: 0.01
    },

    // S级别掉落概率
    sLevelDropProbs: {
        'S1': 70,
        'S2': 23.1117,
        'S3': 5,
        'S4': 1,
        'S5': 0.5,
        'S6': 0.2,
        'S7': 0.1,
        'S8': 0.05,
        'S9': 0.02,
        'S10': 0.01,
        'S11': 0.005,
        'S12': 0.002,
        'S13': 0.001,
        'S14': 0.0002,
        'S15': 0.0001
    }
};

// 轮回神兽穿戴：S11+ 需满足 minHuaSheng（与轮回装备 T11+ 规则一致）
const BEAST_S_LEVEL_ORDER = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15'];
var BEAST_RARITY_ORDER = ['小宠物', '野兽', '凶兽', '灵兽', '圣兽', '神兽', '炁兽'];
function getBeastRarityOrderSafe() {
    return (typeof BEAST_RARITY_ORDER !== 'undefined' && BEAST_RARITY_ORDER && BEAST_RARITY_ORDER.length)
        ? BEAST_RARITY_ORDER
        : ['小宠物', '野兽', '凶兽', '灵兽', '圣兽', '神兽', '炁兽'];
}
function getBeastSLevelOrderSafe() {
    return (typeof BEAST_S_LEVEL_ORDER !== 'undefined' && BEAST_S_LEVEL_ORDER && BEAST_S_LEVEL_ORDER.length)
        ? BEAST_S_LEVEL_ORDER
        : ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15'];
}
if (window.__pendingBeastInventorySync && typeof syncBeastInventoryCaps === 'function') {
    try { syncBeastInventoryCaps(); } catch (e) { console.warn('syncBeastInventoryCaps deferred', e); }
    window.__pendingBeastInventorySync = false;
}
function getBeastInventoryCount() {
    return (player.beasts && player.beasts.inventory) ? player.beasts.inventory.length : 0;
}
function getBeastInventoryFreeSlots() {
    return Math.max(0, GAME_INVENTORY_MAX - getBeastInventoryCount());
}
function ensureBeastInventorySettings() {
    if (!player.beasts) {
        player.beasts = { inventory: [], equipped: [], autoDiscard: { enabled: false, belowRarity: '小宠物', belowSLevel: 'S1' } };
    }
    if (!player.beasts.inventory) player.beasts.inventory = [];
    if (!player.beasts.equipped) player.beasts.equipped = [];
    if (!player.beasts.autoDiscard) player.beasts.autoDiscard = { enabled: false, belowRarity: '小宠物', belowSLevel: 'S1' };
}
function syncBeastInventoryCaps() {
    if (!player.beasts) return;
    ensureBeastInventorySettings();
    trimBeastInventoryOverCap();
    runBeastAutoDiscard(true);
}
function isBeastEquipped(beastId) {
    return player.beasts.equipped && player.beasts.equipped.indexOf(beastId) >= 0;
}
function shouldBeastAutoDiscard(beast) {
    if (!beast || !player.beasts || !player.beasts.autoDiscard) return false;
    if (beast.isLocked || isBeastEquipped(beast.id)) return false;
    var cfg = player.beasts.autoDiscard;
    var rarityOrder = getBeastRarityOrderSafe();
    var sLevelOrder = getBeastSLevelOrderSafe();
    var ri = rarityOrder.indexOf(beast.rarity);
    var rth = rarityOrder.indexOf(cfg.belowRarity || '小宠物');
    var si = sLevelOrder.indexOf(beast.sLevel);
    var sth = sLevelOrder.indexOf(cfg.belowSLevel || 'S1');
    var rarityOk = (ri >= 0 ? ri : 0) <= (rth >= 0 ? rth : 0);
    var sOk = (si >= 0 ? si : 0) <= (sth >= 0 ? sth : 0);
    return rarityOk && sOk;
}
function runBeastAutoDiscard(silent) {
    if (!player.beasts) return 0;
    ensureBeastInventorySettings();
    if (!player.beasts.autoDiscard.enabled) return 0;
    var before = getBeastInventoryCount();
    player.beasts.inventory = player.beasts.inventory.filter(function (b) { return !shouldBeastAutoDiscard(b); });
    var count = before - getBeastInventoryCount();
    if (count > 0 && !silent) logAction('自动丢弃 ' + count + ' 只轮回神兽', 'success');
    if (count > 0) updateBeastUI();
    return count;
}
function trimBeastInventoryOverCap() {
    var over = getBeastInventoryCount() - GAME_INVENTORY_MAX;
    if (over <= 0) return 0;
    var sLevelOrder = getBeastSLevelOrderSafe();
    var rarityOrder = getBeastRarityOrderSafe();
    var sorted = player.beasts.inventory.slice().sort(function (a, b) {
        var sa = sLevelOrder.indexOf(a.sLevel) - sLevelOrder.indexOf(b.sLevel);
        if (sa !== 0) return sa;
        return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
    });
    var trimmed = 0;
    for (var i = 0; i < sorted.length && getBeastInventoryCount() > GAME_INVENTORY_MAX; i++) {
        var b = sorted[i];
        if (b.isLocked || isBeastEquipped(b.id)) continue;
        var idx = player.beasts.inventory.findIndex(function (x) { return x.id === b.id; });
        if (idx >= 0) { player.beasts.inventory.splice(idx, 1); trimmed++; }
    }
    if (trimmed > 0) logAction('神兽仓库超限，已自动丢弃 ' + trimmed + ' 只低阶神兽', 'info');
    return trimmed;
}
function updateBeastInventoryCountDisplay() {
    var el = document.getElementById('beastInventoryCountDisplay');
    if (el) el.textContent = getBeastInventoryCount() + '/' + GAME_INVENTORY_MAX;
}
function initBeastAutoDiscardUI() {
    ensureBeastInventorySettings();
    var cfg = player.beasts.autoDiscard;
    var rSel = document.getElementById('beastAutoDiscardRarity');
    var sSel = document.getElementById('beastAutoDiscardSLevel');
    var btn = document.getElementById('toggleBeastAutoDiscard');
    if (rSel) rSel.value = cfg.belowRarity || '小宠物';
    if (sSel) sSel.value = cfg.belowSLevel || 'S1';
    if (btn) {
        btn.textContent = '自动丢弃：' + (cfg.enabled ? '开' : '关');
        btn.style.background = cfg.enabled ? '#4CAF50' : '#ff9800';
    }
}
function setBeastAutoDiscardThreshold() {
    ensureBeastInventorySettings();
    var rSel = document.getElementById('beastAutoDiscardRarity');
    var sSel = document.getElementById('beastAutoDiscardSLevel');
    if (rSel) player.beasts.autoDiscard.belowRarity = rSel.value;
    if (sSel) player.beasts.autoDiscard.belowSLevel = sSel.value;
}
function toggleBeastAutoDiscard() {
    ensureBeastInventorySettings();
    player.beasts.autoDiscard.enabled = !player.beasts.autoDiscard.enabled;
    initBeastAutoDiscardUI();
    if (player.beasts.autoDiscard.enabled) runBeastAutoDiscard(false);
}
function checkBeastAutoDiscard() {
    if (player.beasts && player.beasts.autoDiscard && player.beasts.autoDiscard.enabled) runBeastAutoDiscard(true);
}

function playerCanEquipSLevel(sLevelKey) {
    const cfg = beastConfig.sLevels[sLevelKey];
    if (!cfg) return false;
    if ((player.level.ascentionCounta || 0) < cfg.requiredAscention) return false;
    const minHua = cfg.minHuaSheng;
    if (minHua != null && minHua > 0) {
        if ((Number(player.level && player.level.huaShengCount) || 0) < minHua) return false;
    }
    return true;
}

function playerCanEquipBeast(beast) {
    if (!beast || !beast.sLevel) return false;
    return playerCanEquipSLevel(beast.sLevel);
}

function getBeastEquipRequirementLabelBySLevel(sLevelKey) {
    const cfg = beastConfig.sLevels[sLevelKey];
    if (!cfg) return '';
    let s = '轮回' + cfg.requiredAscention + '转';
    if (cfg.minHuaSheng != null && cfg.minHuaSheng > 0) {
        s += ' + 化圣≥' + cfg.minHuaSheng + '次';
    }
    return s;
}

// 神兽名字词库
const beastNameParts = {
    小宠物: {
        prefixes: ['茸茸', '团团', '豆豆', '球球', '毛毛', '雪雪', '绒绒', '嘟嘟', '咪咪', '波波'],
        suffixes: ['兔', '猫', '狗', '鼠', '雀', '龟', '蛙', '鱼', '狐', '狸']
    },
    
    // 野兽 - 常见、威猛
    野兽: {
        prefixes: ['利爪', '钢牙', '迅影', '铁背', '灰鬃', '棕毛', '赤瞳', '银尾', '铜皮', '金睛'],
        suffixes: ['狼', '虎', '豹', '熊', '狮', '象', '牛', '马', '鹰', '雕']
    },
    
    // 凶兽 - 凶残、暴戾
    凶兽: {
        prefixes: ['血瞳', '噬魂', '裂骨', '撕风', '断金', '碎岩', '吞月', '饮血', '屠城', '灭世'],
        suffixes: ['饕餮', '穷奇', '梼杌', '混沌', '朱厌', '祸斗', '狰', '蛊雕', '九婴', '相柳']
    },
    
    // 灵兽 - 灵性、优雅
    灵兽: {
        prefixes: ['灵瞳', '玉角', '星纹', '月华', '霞光', '云翼', '风痕', '水镜', '雷音', '虹霓'],
        suffixes: ['鹿', '鹤', '鸾', '鸢', '鲲', '鹏', '蛟', '螭', '夔', '虺']
    },
    
    // 圣兽 - 神圣、威严
    圣兽: {
        prefixes: ['圣光', '天威', '神恩', '净世', '守护', '裁决', '福音', '天命', '至理', '永恒'],
        suffixes: ['麒麟', '白泽', '貔貅', '谛听', '当康', '英招', '陆吾', '毕方', '重明', '腓腓']
    },
    
    // 神兽 - 强大、尊贵
    神兽: {
        prefixes: ['天穹', '混沌', '虚空', '轮回', '时空', '造化', '开天', '创世', '主宰', '至尊'],
        suffixes: ['青龙', '白虎', '朱雀', '玄武', '应龙', '烛龙', '腾蛇', '勾陈', '黄龙', '凤凰']
    },
    
    // 炁兽 - 神秘、本源
    炁兽: {
        prefixes: ['太初', '鸿蒙', '元始', '无极', '太易', '太始', '太素', '太极', '两仪', '四象'],
        suffixes: ['炁', '道', '源', '始', '元', '一', '极', '玄', '妙', '真']
    }
};

// 神兽背景故事模板
const beastLoreTemplates = {
    // 小宠物背景 - 平凡、可爱
    小宠物: [
        '只是一只普通的{0}，喜欢在{1}嬉戏玩耍。',
        '{0}族的幼崽，对世界充满好奇，经常{1}。',
        '被主人收养的流浪{0}，虽然弱小但{1}。',
        '在{0}中发现的幼兽，天性{1}惹人怜爱。',
        '这只{0}似乎有着不寻常的{1}天赋。'
    ],
    
    // 野兽背景 - 自然、野生
    野兽: [
        '山林间的{0}霸主，凭借{1}在{2}称王。',
        '曾与猎人周旋多年的{0}，学会了{1}的生存技巧。',
        '从{0}迁徙而来的{1}，适应了这里的{2}环境。',
        '这只{0}的{1}在族群中堪称一绝，{2}。',
        '在{0}的残酷竞争中存活下来的{1}，{2}。'
    ],
    
    // 凶兽背景 - 凶残、危险
    凶兽: [
        '以{0}为食的{1}，所到之处{2}。',
        '被{0}侵蚀心智的{1}，只剩下{2}的本能。',
        '上古{0}的后裔，传承了{1}的凶性，{2}。',
        '这只{0}曾{1}，被列为{2}级危险凶兽。',
        '{0}的化身，每当{1}时便会现身{2}。'
    ],
    
    // 灵兽背景 - 灵性、智慧
    灵兽: [
        '通晓{0}之道的{1}，能{2}。',
        '在{0}中修炼千年的{1}，已初具{2}之能。',
        '这只{0}天生能与{1}沟通，掌握着{2}的秘密。',
        '{0}族的智者，曾{1}，被尊为{2}。',
        '吸收{0}精华而诞生的{1}，拥有{2}的力量。'
    ],
    
    // 圣兽背景 - 神圣、祥瑞
    圣兽: {
        '麒麟': '仁兽麒麟，不践生草，不履生虫，王者有德则现。',
        '白泽': '通晓万物之情，能言人语，祥瑞之兽，辟除人间邪气。',
        '貔貅': '纳食四方之财，吞万物而不泻，招财进宝，镇宅辟邪。',
        '谛听': '能辨世间万物，尤善听人心，坐地听八百，卧耳听三千。',
        '当康': '其鸣自叫，见则天下大穰，丰穰的瑞兽。',
        '英招': '人面马身，身有虎纹，生鸟翼，徇于四海，其音如榴。',
        '陆吾': '司天之九部及帝之囿时，人面虎身九尾，镇守昆仑。',
        '毕方': '见则其邑有讹火，御火之精，不食五谷。',
        '重明': '双睛在背，能搏逐猛兽虎狼，使妖灾群恶不能为害。',
        '腓腓': '养之可以解忧愁，其状如狸，白尾有鬣。'
    },
    
    // 神兽背景 - 强大、古老
    神兽: {
        '青龙': '东方之神，五行主木，司春，为四象之首，万物生发之始。',
        '白虎': '西方之神，五行主金，司秋，杀伐之神，兵戈之主。',
        '朱雀': '南方之神，五行主火，司夏，涅槃之鸟，浴火重生。',
        '玄武': '北方之神，五行主水，司冬，龟蛇合体，司命之神。',
        '应龙': '背生双翼，司云布雨，曾助黄帝战蚩尤，斩夸父。',
        '烛龙': '视为昼，瞑为夜，吹为冬，呼为夏，身长千里，人面龙身。',
        '腾蛇': '能兴云雾而游其中，无足而飞，星宿之精。',
        '勾陈': '天皇大帝，雷神之祖，司权柄，掌兵戎之事。',
        '黄龙': '中央之神，五行主土，轩辕之星，权柄之象。',
        '凤凰': '非梧桐不栖，非竹实不食，非醴泉不饮，见则天下安宁。'
    },
    
    // 炁兽背景 - 本源、大道
    炁兽: [
        '太初{0}所化的{1}，象征着{2}的本源。',
        '鸿蒙未判之时便已存在的{0}，见证过{1}的{2}。',
        '大道{0}的具现化，其{1}便是{2}的体现。',
        '元始{0}凝聚而成的{1}，掌握着{2}的真理。',
        '这并非{0}，而是{1}本身，{2}的源头。'
    ]
};
const beastLoreElements = {
    // 通用元素
    地点: ['山林', '深谷', '秘境', '古地', '遗迹', '洞天', '福地', '绝地', '险境', '渊薮'],
    特征: ['灵敏的嗅觉', '锋利的爪牙', '坚韧的皮毛', '强大的力量', '迅捷的速度', '狡猾的智慧', '顽强的生命力', '特殊的能力', '变异的血脉', '先祖的传承'],
    行为: ['捕猎', '守护领地', '哺育后代', '争夺配偶', '躲避天敌', '寻找食物', '探索未知', '遵循本能', '学习技能', '积累力量'],
    
    // 小宠物特有
    小宠物特征: ['柔软的绒毛', '可爱的叫声', '灵动的眼睛', '娇小的体型', '温顺的性格', '贪吃的习惯', '好奇的天性', '粘人的习性', '活泼好动', '胆小谨慎'],
    
    // 野兽特有
    野兽能力: ['潜伏突袭', '群体狩猎', '追踪痕迹', '辨别方向', '适应环境', '季节性迁徙', '领地标记', '求偶展示', '伪装隐藏', '耐力持久'],
    
    // 凶兽特有
    凶兽行为: ['屠戮生灵', '毁灭村庄', '吞噬修士', '引发灾祸', '制造恐慌', '污染土地', '散播瘟疫', '引发战乱', '破坏平衡', '挑战秩序'],
    凶兽特征: ['嗜血的眼睛', '狰狞的面容', '腐臭的气息', '扭曲的肢体', '疯狂的神智', '无尽的饥饿', '毁灭的欲望', '诅咒的血脉', '痛苦的嘶吼', '邪恶的本能'],
    
    // 灵兽特有
    灵兽能力: ['沟通自然', '预知危险', '治愈伤势', '净化污染', '引导灵气', '点化生灵', '破除幻象', '穿梭空间', '操控元素', '领悟道法'],
    灵兽地点: ['灵脉源头', '月华汇聚之地', '星辰照耀之所', '灵气潮汐之处', '先天福地', '上古道场', '神圣祭坛', '自然圣地', '天地节点', '轮回间隙'],
    
    // 圣兽特有
    圣兽象征: ['祥瑞', '仁德', '守护', '公正', '智慧', '慈悲', '净化', '治愈', '祝福', '指引'],
    圣兽事迹: ['驱散瘟疫', '平息战乱', '指引迷途', '守护苍生', '镇压邪祟', '赐福大地', '启示真理', '平衡自然', '教化生灵', '传播文明'],
    
    // 神兽特有
    神兽权柄: ['司掌四季', '统御元素', '掌管星辰', '主宰生死', '操控时间', '执掌轮回', '镇压气运', '守护天道', '平衡阴阳', '创生万物'],
    神兽传说: ['开天辟地时诞生', '混沌中孕育', '参与创世之战', '定立天地法则', '划分三界六道', '镇压上古灾厄', '封印灭世魔神', '建立秩序纪元', '见证文明兴衰', '守护世界本源'],
    
    // 炁兽特有
    炁兽本质: ['太初之气', '鸿蒙紫气', '混沌元气', '玄黄母气', '阴阳二气', '五行本源', '时空法则', '轮回印记', '因果丝线', '命运轨迹'],
    炁兽形态: ['气的聚合体', '道的显化形', '规则的具现', '概念的载体', '真理的投影', '本源的波动', '大道的涟漪', '存在的证明', '虚空的回响', '无的边界']
};

var SUPREME_SLOT_UI_ORDER = [
    { id: 'sx_crown', short: '灵冕' },
    { id: 'sx_throat', short: '咽阙' },
    { id: 'sx_heart', short: '心枢' },
    { id: 'sx_spine', short: '脊骨' },
    { id: 'sx_waist', short: '腰封' },
    { id: 'sx_armL', short: '左臂' },
    { id: 'sx_armR', short: '右臂' },
    { id: 'sx_handL', short: '左掌' },
    { id: 'sx_handR', short: '右掌' },
    { id: 'sx_legL', short: '左腿' },
    { id: 'sx_legR', short: '右腿' },
    { id: 'sx_sole', short: '足印' },
];

var SUPREME_BAG_MAX = 150;

function supremeHtmlAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function supremeEscapeHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** 至尊神器词条：与 calculateEquippedSupremeArtifactBonus 一致，存为加成系数（战斗为 1+sum），界面用百分比展示 */
function formatSupremeAffixPct(affix) {
    var v = Number(affix && affix.value);
    if (!isFinite(v)) v = 0;
    var pct = Math.round(v * 10000) / 100;
    var t = pct.toFixed(2);
    if (t.endsWith('.00')) t = t.slice(0, -3);
    else if (t.endsWith('0')) t = t.replace(/0$/, '');
    return '+' + t + '%';
}

function supremeAffixPillsHtml(affixes) {
    var arr = Array.isArray(affixes) ? affixes : [];
    if (!arr.length) return '';
    var chips = arr.map(function(a) {
        return '<span style="display:inline-block;padding:5px 10px;border-radius:10px;background:rgba(74,20,140,0.5);border:1px solid rgba(186,104,200,0.5);font-size:11px;color:#f3e5f5;">' +
            supremeEscapeHtml(String(a.type || '')) + ' <b style="color:#ffe082;font-size:12px;">' + formatSupremeAffixPct(a) + '</b></span>';
    }).join('');
    return '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">' + chips + '</div>';
}

/** 单件至尊神器词条系数合计（与 calculateEquippedSupremeArtifactBonus 单件逻辑一致） */
function supremeSummarizeAffixCoeffs(art) {
    var totals = { health: 0, attack: 0, critDamage: 0 };
    if (!art || !Array.isArray(art.affixes)) return totals;
    for (var i = 0; i < art.affixes.length; i++) {
        var affix = art.affixes[i];
        if (!affix || affix.type == null) continue;
        var bonusType = typeof getBonusType === 'function' ? getBonusType(affix.type) : 'health';
        if (totals[bonusType] !== undefined) totals[bonusType] += Number(affix.value) || 0;
    }
    return totals;
}

/** 系数差转为界面用 ±% HTML（与 formatSupremeAffixPct 同量纲） */
function formatSupremeCoeffDeltaHtml(delta) {
    var v = Number(delta);
    if (!isFinite(v)) v = 0;
    var pct = Math.round(v * 10000) / 100;
    var absPct = Math.abs(pct);
    var t = absPct.toFixed(2);
    if (t.endsWith('.00')) t = t.slice(0, -3);
    else if (t.endsWith('0')) t = t.replace(/0$/, '');
    if (pct === 0) return '<span style="color:#9e9e9e;font-weight:600;">±0%</span>';
    if (pct > 0) return '<span style="color:#69f0ae;font-weight:700;">+' + t + '%</span>';
    return '<span style="color:#ff8a80;font-weight:700;">-' + t + '%</span>';
}

/** 背包容器卡片：相对同部位已穿戴（或空位）的生命/攻击/爆伤系数差 */
function supremeBagCompareVsEquippedHtml(b, equipped) {
    var eq = equipped && typeof equipped === 'object' ? equipped : {};
    var slotId = String(b && b.slotId || '');
    var curArt = slotId && eq[slotId] ? eq[slotId] : null;
    var cur = supremeSummarizeAffixCoeffs(curArt);
    var nxt = supremeSummarizeAffixCoeffs(b);
    var rows = [
        { key: 'health', name: '生命' },
        { key: 'attack', name: '攻击' },
        { key: 'critDamage', name: '爆伤' }
    ];
    var parts = [];
    for (var r = 0; r < rows.length; r++) {
        var k = rows[r].key;
        var d = nxt[k] - cur[k];
        parts.push('<span style="white-space:nowrap;">' + rows[r].name + ' ' + formatSupremeCoeffDeltaHtml(d) + '</span>');
    }
    var hint = curArt
        ? '<span style="opacity:0.9;">相对同部位已穿戴</span>'
        : '<span style="opacity:0.9;">同部位未穿戴 · 相对空位</span>';
    return '<div style="margin-top:8px;padding:8px 10px;border-radius:10px;background:rgba(0,0,0,0.38);border:1px solid rgba(186,104,200,0.28);font-size:11px;line-height:1.65;color:#e1bee7;">' +
        '<div style="font-size:10px;color:#b39ddb;margin-bottom:6px;letter-spacing:0.02em;">' + hint + '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;">' + parts.join('') + '</div></div>';
}

function supremeDropMetaHtml(art) {
    var rows = [];
    var pn = art && art.dropPlayerName;
    if (pn != null && String(pn).trim() !== '') {
        rows.push('<div style="font-size:12px;color:#b3e5fc;line-height:1.45;"><span style="opacity:0.85;font-size:11px;">游戏角色名</span> <strong style="color:#e1f5fe;">' + supremeEscapeHtml(String(pn).trim()) + '</strong></div>');
    }
    var dt = art && art.dropTime;
    if (dt != null && !isNaN(Number(dt))) {
        var d = new Date(Number(dt));
        if (!isNaN(d.getTime())) {
            var ds = d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            rows.push('<div style="font-size:11px;color:#cfd8dc;line-height:1.45;margin-top:2px;"><span style="opacity:0.8;">掉落时间</span> ' + supremeEscapeHtml(ds) + '</div>');
        }
    }
    if (!rows.length) {
        return '<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:#78909c;">暂无掉落记录（旧存档、市场购入或未记录）</div>';
    }
    return '<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);line-height:1.5;">' + rows.join('') + '</div>';
}

function supremeSelectFilteredBag(checked) {
    var cbs = document.querySelectorAll('#supremeArtifactBagList input.supreme-bag-cb');
    for (var i = 0; i < cbs.length; i++) {
        if (!cbs[i].disabled) cbs[i].checked = !!checked;
    }
}

function supremeBatchDiscardSelected() {
    var cbs = document.querySelectorAll('#supremeArtifactBagList input.supreme-bag-cb:checked');
    var ids = [];
    for (var i = 0; i < cbs.length; i++) {
        if (!cbs[i].disabled) ids.push(cbs[i].getAttribute('data-id'));
    }
    if (ids.length === 0) {
        alert('请先勾选未锁定的装备');
        return;
    }
    if (!confirm('确定批量丢弃选中的 ' + ids.length + ' 件？已锁定或不在背包的将被跳过，且不可恢复。')) return;
    if (typeof goldGameDiscardSupremeArtifactsBatch !== 'function') {
        alert('未联网或接口未就绪');
        return;
    }
    goldGameDiscardSupremeArtifactsBatch(ids).then(function(res) {
        refreshSupremeArtifactUI();
        if (typeof updatePlayerBattleStats === 'function') updatePlayerBattleStats();
        var r = (res && res.removedCount != null) ? res.removedCount : ((res && res.removed) ? res.removed.length : 0);
        var sk = (res && res.skipped) ? res.skipped.length : 0;
        if (sk > 0) alert('已删除 ' + r + ' 件，跳过 ' + sk + ' 件（锁定或不在背包）');
    }).catch(function(e) {
        alert(e && e.message ? e.message : '批量丢弃失败');
    });
}

function refreshSupremeArtifactUI() {
    var grid = document.getElementById('supremeArtifactSlotGrid');
    var bagEl = document.getElementById('supremeArtifactBagList');
    var cntEl = document.getElementById('supremeArtifactBagCount');
    var maxEl = document.getElementById('supremeArtifactBagMax');
    var hintEl = document.getElementById('supremeArtifactBagFilteredHint');
    var qF = document.getElementById('supremeArtifactFilterQuality');
    var sF = document.getElementById('supremeArtifactFilterSlot');
    var sLvF = document.getElementById('supremeArtifactFilterSLevel');
    var cache = window._supremeArtifactsCache || { equipped: {}, bag: [] };
    var equipped = cache.equipped || {};
    var bagAll = cache.bag || [];
    if (maxEl) maxEl.textContent = String(SUPREME_BAG_MAX);
    if (cntEl) cntEl.textContent = String(bagAll.length);
    var qVal = null;
    if (qF && qF.value !== '') {
        var qn = parseInt(qF.value, 10);
        if (!isNaN(qn)) qVal = qn;
    }
    var sVal = (sF && sF.value) ? String(sF.value) : null;
    var sLevelFilter = (sLvF && sLvF.value) ? String(sLvF.value).trim().toUpperCase() : '';
    var bagShow = bagAll.filter(function(b) {
        if (qVal != null && (b.qualityTier | 0) !== qVal) return false;
        if (sVal && String(b.slotId || '') !== sVal) return false;
        if (sLevelFilter) {
            var sl = String(b.sLevel == null ? '' : b.sLevel).trim().toUpperCase();
            if (sl !== sLevelFilter) return false;
        }
        return true;
    });
    if (hintEl) hintEl.textContent = (bagShow.length !== bagAll.length) ? '（筛选 ' + bagShow.length + ' 件）' : '';
    if (grid) {
        var html = '';
        for (var i = 0; i < SUPREME_SLOT_UI_ORDER.length; i++) {
            var def = SUPREME_SLOT_UI_ORDER[i];
            var art = equipped[def.id];
            var border = art ? 'linear-gradient(145deg, rgba(255,213,79,0.35), rgba(106,27,154,0.25))' : 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.2))';
            if (art) {
                var sid = String(art.id || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                var lockedEq = !!art.isLocked;
                var lockBtnLabel = lockedEq ? '解锁' : '锁定';
                var sellEq = lockedEq
                    ? '<span style="padding:4px 8px;font-size:11px;color:#9575cd;border:1px solid rgba(149,117,205,0.4);border-radius:8px;">已锁定不可上架</span>'
                    : '<button type="button" onclick="openNetworkArtifactSellDialog(\'supremeArtifact\',{artifactId:\'' + sid + '\'});" style="padding:4px 10px;font-size:12px;border-radius:8px;border:1px solid #ffb74d;background:rgba(74,44,8,0.95);color:#fff3e0;cursor:pointer;">上架</button>';
                var titleLine = supremeEscapeHtml(String(art.displayName || art.name || ''));
                var subLine = supremeEscapeHtml(String(art.partLabel || '')) + ' · ' + supremeEscapeHtml(String(art.sLevel || '')) + ' · ' + supremeEscapeHtml(String(art.qualityName || ''));
                html += '<div style="border-radius:14px;padding:12px;border:1px solid rgba(255,213,128,0.4);background:' + border + ';box-shadow:inset 0 1px 0 rgba(255,255,255,0.06);min-height:140px;display:flex;flex-direction:column;gap:4px;">' +
                    '<div style="font-size:10px;color:#b39ddb;letter-spacing:0.5px;">' + def.short + ' · 已穿戴' + (lockedEq ? ' · <span style="color:#ffab91;">已锁定</span>' : '') + '</div>' +
                    '<div style="font-weight:800;color:#fff8e1;font-size:12px;line-height:1.35;">' + titleLine + '</div>' +
                    '<div style="font-size:11px;color:#d1c4e9;opacity:0.95;">' + subLine + '</div>' +
                    supremeAffixPillsHtml(art.affixes) +
                    supremeDropMetaHtml(art) +
                    '<div style="margin-top:auto;padding-top:8px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;">' +
                    '<button type="button" onclick="goldGameUnequipSupremeArtifact(\'' + def.id + '\').then(function(){ return goldGameGetSupremeArtifacts(); }).then(function(){ refreshSupremeArtifactUI(); if(typeof updatePlayerBattleStats===\'function\')updatePlayerBattleStats(); }).catch(function(e){ alert(e.message); });" style="padding:4px 10px;font-size:12px;border-radius:8px;border:1px solid #9575cd;background:rgba(48,27,80,0.9);color:#ede7f6;cursor:pointer;">卸下</button>' +
                    '<button type="button" onclick="if(typeof goldGameToggleSupremeArtifactLock!==\'function\'){alert(\'未联网\');return;}goldGameToggleSupremeArtifactLock(\'' + sid + '\').then(function(){ refreshSupremeArtifactUI(); if(typeof updatePlayerBattleStats===\'function\')updatePlayerBattleStats(); }).catch(function(e){ alert(e.message); });" style="padding:4px 10px;font-size:12px;border-radius:8px;border:1px solid #5c6bc0;background:rgba(40,53,147,0.5);color:#e8eaf6;cursor:pointer;">' + lockBtnLabel + '</button>' +
                    sellEq +
                    '</div></div>';
            } else {
                html += '<div style="border-radius:12px;padding:10px;border:1px dashed rgba(255,255,255,0.12);background:' + border + ';min-height:118px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">' +
                    '<div style="font-size:12px;color:#9e9e9e;">' + def.short + '</div>' +
                    '<div style="font-size:11px;color:#6d4c41;margin-top:6px;opacity:0.85;">空位</div></div>';
            }
        }
        grid.innerHTML = html;
    }
    if (bagEl) {
        if (bagAll.length === 0) {
            bagEl.innerHTML = '<div style="grid-column:1/-1;color:#888;padding:20px;text-align:center;">背包为空</div>';
        } else if (bagShow.length === 0) {
            bagEl.innerHTML = '<div style="grid-column:1/-1;color:#888;padding:20px;text-align:center;">当前筛选无结果，请调整品质、部位或 S 档</div>';
        } else {
            var bh = '';
            for (var j = 0; j < bagShow.length; j++) {
                var b = bagShow[j];
                var bid = String(b.id || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                var hid = supremeHtmlAttr(b.id || '');
                var lockedBag = !!b.isLocked;
                var lockBagLabel = lockedBag ? '解锁' : '锁定';
                var cbHtml = '<input type="checkbox" class="supreme-bag-cb" data-id="' + hid + '"' + (lockedBag ? ' disabled title="已锁定"' : '') + ' style="width:16px;height:16px;cursor:pointer;flex-shrink:0;" />';
                var sellBag = lockedBag
                    ? '<span style="padding:5px 8px;font-size:10px;color:#9575cd;border:1px solid rgba(149,117,205,0.35);border-radius:8px;">不可上架</span>'
                    : '<button type="button" onclick="openNetworkArtifactSellDialog(\'supremeArtifact\',{artifactId:\'' + bid + '\'});" style="padding:5px 10px;font-size:11px;border-radius:8px;border:1px solid #ffb74d;background:#5d4037;color:#fff3e0;cursor:pointer;">上架</button>';
                var discardBag = lockedBag
                    ? ''
                    : '<button type="button" onclick="if(confirm(\'确定丢弃该至尊神器？不可恢复\'))goldGameDiscardSupremeArtifact(\'' + bid + '\').then(function(){ return goldGameGetSupremeArtifacts(); }).then(function(){ refreshSupremeArtifactUI(); if(typeof updatePlayerBattleStats===\'function\')updatePlayerBattleStats(); }).catch(function(e){ alert(e.message); });" style="padding:5px 10px;font-size:11px;border-radius:8px;border:1px solid #c62828;background:#3e2723;color:#ffcdd2;cursor:pointer;">丢弃</button>';
                var bagTitle = supremeEscapeHtml(String(b.displayName || b.name || '')) + (lockedBag ? ' <span style="font-size:10px;color:#ffab91;">[锁]</span>' : '');
                var bagSub = supremeEscapeHtml(String(b.partLabel || '')) + ' · ' + supremeEscapeHtml(String(b.sLevel || '')) + ' · ' + supremeEscapeHtml(String(b.qualityName || ''));
                bh += '<div class="supreme-bag-card" style="display:flex;flex-direction:column;border-radius:16px;padding:14px 14px 12px;background:linear-gradient(165deg,rgba(52,30,92,0.96),rgba(18,10,34,0.96));border:1px solid rgba(255,213,128,0.3);box-shadow:0 8px 28px rgba(0,0,0,0.42),inset 0 1px 0 rgba(255,255,255,0.06);min-height:240px;">' +
                    '<div style="display:flex;align-items:center;justify-content:flex-end;margin-bottom:4px;">' + cbHtml + '</div>' +
                    '<div style="font-weight:800;color:#ffe082;font-size:14px;line-height:1.35;">' + bagTitle + '</div>' +
                    '<div style="font-size:11px;color:#b39ddb;margin-top:4px;opacity:0.95;">' + bagSub + '</div>' +
                    supremeAffixPillsHtml(b.affixes) +
                    supremeBagCompareVsEquippedHtml(b, equipped) +
                    supremeDropMetaHtml(b) +
                    '<div style="margin-top:auto;padding-top:12px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;border-top:1px solid rgba(255,255,255,0.06);">' +
                    '<button type="button" onclick="goldGameEquipSupremeArtifact(\'' + bid + '\').then(function(){ return goldGameGetSupremeArtifacts(); }).then(function(){ refreshSupremeArtifactUI(); if(typeof updatePlayerBattleStats===\'function\')updatePlayerBattleStats(); }).catch(function(e){ alert(e.message); });" style="padding:6px 12px;font-size:12px;border-radius:8px;border:1px solid #7e57c2;background:#4527a0;color:#fff;cursor:pointer;">穿戴</button>' +
                    '<button type="button" onclick="if(typeof goldGameToggleSupremeArtifactLock!==\'function\'){alert(\'未联网\');return;}goldGameToggleSupremeArtifactLock(\'' + bid + '\').then(function(){ refreshSupremeArtifactUI(); if(typeof updatePlayerBattleStats===\'function\')updatePlayerBattleStats(); }).catch(function(e){ alert(e.message); });" style="padding:6px 12px;font-size:12px;border-radius:8px;border:1px solid #5c6bc0;background:#283593;color:#e8eaf6;cursor:pointer;">' + lockBagLabel + '</button>' +
                    sellBag +
                    discardBag +
                    '</div></div>';
            }
            bagEl.innerHTML = bh;
        }
    }
}

function toggleSupremeArtifactUI() {
    var ui = document.getElementById('supremeArtifactUI');
    var ov = document.getElementById('supremeArtifactOverlay');
    if (!ui || !ov) return;
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        ov.style.display = 'none';
        return;
    }
    if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) {
        alert('请先登录账号');
        return;
    }
    if (typeof goldGameGetSupremeArtifacts !== 'function') {
        alert('当前环境未初始化联网接口');
        return;
    }
    goldGameGetSupremeArtifacts().then(function(res) {
        if (!res || !res.ok) {
            alert((res && res.message) || '加载至尊神器失败（需已上传云存档）');
            return;
        }
        ov.style.display = 'block';
        ui.style.display = 'block';
        refreshSupremeArtifactUI();
    }).catch(function() {
        alert('加载至尊神器失败');
    });
}
(function bindSupremeArtifactOverlay() {
    var ov = document.getElementById('supremeArtifactOverlay');
    if (ov && !ov._supTapBound) {
        ov._supTapBound = true;
        ov.addEventListener('click', function() { toggleSupremeArtifactUI(); });
    }
})();

// 切换轮回神兽系统界面
function toggleBeastSystem() {
     if (player.level.ascentionCounta < 1) {
        alert("需要达到轮回1转才能开启轮回神兽！");
        return;
    }
    const overlay = document.getElementById('beastSystemOverlay');
    const ui = document.getElementById('beastSystemUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ensureBeastInventorySettings();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        initBeastAutoDiscardUI();
        updateBeastUI();
    }
}

// 在世界地图战斗胜利时，有几率掉落轮回神兽
function tryDropBeastAfterBattle() {
  if (!player.beasts || !Array.isArray(player.beasts.inventory)) return;
  const dimensionLevel = player.dimensionLevel; 
    if (player.dimensionLevel < 2) return;
    
    // 0.1% 的掉落几率
    if (Math.random() < 0.001) {
        const newBeast = generateRandomBeast();
        if (!newBeast) return;
        if (getBeastInventoryFreeSlots() <= 0) return;
        player.beasts.inventory.push(newBeast);
        runBeastAutoDiscard(true);
        trimBeastInventoryOverCap();
        
        logAction(`🎉 恭喜！在世界地图战斗中获得了轮回神兽：${newBeast.name}（${newBeast.rarity}·${newBeast.sLevel}）`, 'legendary');
        safePanelUpdate(updateBeastUI);
    }
}


// 推广入口
// ========== 推广入口：6种推广方式 ==========
var PROMO_FLOW_COST = 10000;
var PROMO_HOT_COST = 20000;
var PROMO_BANNER_COST = 30000;
var PROMO_FEATURED_COST = 50000;
var PROMO_BIGV_COST = 40000;
var PROMO_SPLASH_COST = 80000;
/** 观众名单最多展示/保留的不同名字数量 */
var LIVE_VIEWER_LIST_MAX = 100;

function getLiveDisplayViewerCount() {
    var ls = player && player.liveStream;
    if (!ls) return 0;
    if (typeof ls.displayViewerCount === 'number' && ls.displayViewerCount >= 0) {
        return Math.floor(ls.displayViewerCount);
    }
    return Array.isArray(ls.viewers) ? ls.viewers.length : 0;
}

function syncLiveDisplayViewerCount() {
    var ls = player && player.liveStream;
    if (!ls) return;
    if (typeof ls.displayViewerCount !== 'number' || ls.displayViewerCount < 0) {
        ls.displayViewerCount = Array.isArray(ls.viewers) ? ls.viewers.length : 0;
    }
    ls.displayViewerCount = Math.max(0, Math.floor(ls.displayViewerCount));
}

function pickUniqueViewerName(isVip) {
    var pool = isVip ? liveStreamSystem.vipNames : liveStreamSystem.aiNames;
    if (!pool || pool.length === 0) return '观众' + Math.floor(Math.random() * 10000);
    var used = {};
    (player.liveStream.viewers || []).forEach(function(v) { if (v && v.name) used[v.name] = true; });
    for (var t = 0; t < 50; t++) {
        var name = pool[Math.floor(Math.random() * pool.length)];
        if (!used[name]) return name;
    }
    for (var i = 0; i < pool.length; i++) {
        if (!used[pool[i]]) return pool[i];
    }
    return pool[Math.floor(Math.random() * pool.length)] + String(Math.floor(Math.random() * 9000) + 1000);
}

function openPromotionEntryModal() {
    var modal = document.getElementById('promotionEntryModal');
    if (modal) {
        var el = document.getElementById('promoModalStarCoins');
        if (el) el.textContent = (player.nightClub && player.nightClub.starCoins) ? player.nightClub.starCoins.toLocaleString() : '0';
        modal.style.display = 'flex';
    }
}
function closePromotionEntryModal() {
    var modal = document.getElementById('promotionEntryModal');
    if (modal) modal.style.display = 'none';
}

// 1. 流量推广
function doPromotionFlow() {
    if (player.nightClub.starCoins < PROMO_FLOW_COST) {
        logAction("星币不足！需要" + PROMO_FLOW_COST + "✨", "error");
        return;
    }
    player.nightClub.starCoins -= PROMO_FLOW_COST;
    player.liveStream.expMultiplier = 2;
    player.liveStream.boostEndTime = Date.now() + 1 * 60 * 60 * 1000;
    liveStreamSystem.maxViewers = getEffectiveMaxViewers();
    addViewers(getEffectiveMaxViewers() * 0.4);
    updateLiveStreamUI();
    addDanmakuMessageq("系统", "主播使用了流量推广，直播间人气上升！", "system");
    logAction("使用流量推广，直播经验获取速度提升2倍，持续1小时", "success");
}

// 2. 热门推荐位：热度+500，30分钟
function doPromotionHot() {
    if (player.nightClub.starCoins < PROMO_HOT_COST) {
        logAction("星币不足！需要" + PROMO_HOT_COST + "✨", "error");
        return;
    }
    player.nightClub.starCoins -= PROMO_HOT_COST;
    player.liveStream.promotionHotEndTime = Date.now() + 30 * 60 * 1000;
    updateLiveStreamUI();
    addDanmakuMessageq("系统", "主播购买了热门推荐位，直播间热度飙升！", "system");
    logAction("热门推荐位：热度+500，持续30分钟", "success");
}

// 3. 首页横幅：观众上限+20%，1小时
function doPromotionBanner() {
    if (player.nightClub.starCoins < PROMO_BANNER_COST) {
        logAction("星币不足！需要" + PROMO_BANNER_COST + "✨", "error");
        return;
    }
    player.nightClub.starCoins -= PROMO_BANNER_COST;
    player.liveStream.promotionBannerEndTime = Date.now() + 1 * 60 * 60 * 1000;
    updateLiveStreamUI();
    addDanmakuMessageq("系统", "直播间登上首页横幅，更多观众正在涌入！", "system");
    logAction("首页横幅：观众上限+20%，持续1小时", "success");
}

// 4. 平台精选：打赏1.5倍，45分钟
function doPromotionFeatured() {
    if (player.nightClub.starCoins < PROMO_FEATURED_COST) {
        logAction("星币不足！需要" + PROMO_FEATURED_COST + "✨", "error");
        return;
    }
    player.nightClub.starCoins -= PROMO_FEATURED_COST;
    player.liveStream.promotionFeaturedEndTime = Date.now() + 45 * 60 * 1000;
    updateLiveStreamUI();
    addDanmakuMessageq("系统", "直播间入选平台精选，打赏金额提升！", "system");
    logAction("平台精选：打赏金额1.5倍，持续45分钟", "success");
}

// 5. 大V转发：VIP出现率翻倍，30分钟
function doPromotionBigv() {
    if (player.nightClub.starCoins < PROMO_BIGV_COST) {
        logAction("星币不足！需要" + PROMO_BIGV_COST + "✨", "error");
        return;
    }
    player.nightClub.starCoins -= PROMO_BIGV_COST;
    player.liveStream.promotionBigvEndTime = Date.now() + 30 * 60 * 1000;
    updateLiveStreamUI();
    addDanmakuMessageq("系统", "大V转发引流，更多土豪观众正在进入！", "system");
    logAction("大V转发：超级金主出现概率翻倍，持续30分钟", "success");
}

// 6. 开屏广告：经验3倍20分钟 + 大量观众
function doPromotionSplash() {
    if (player.nightClub.starCoins < PROMO_SPLASH_COST) {
        logAction("星币不足！需要" + PROMO_SPLASH_COST + "✨", "error");
        return;
    }
    player.nightClub.starCoins -= PROMO_SPLASH_COST;
    player.liveStream.promotionSplashEndTime = Date.now() + 20 * 60 * 1000;
    addViewers(Math.floor(getEffectiveMaxViewers() * 0.7));
    updateLiveStreamUI();
    addDanmakuMessageq("系统", "开屏广告投放！直播间人气爆棚，经验加成开启！", "system");
    logAction("开屏广告：经验3倍持续20分钟，并涌入大量观众", "success");
}

// 有效观众上限（含首页横幅+20%）
function getEffectiveMaxViewers() {
    var base = 10 + Math.floor((player.liveStream && player.liveStream.level) ? player.liveStream.level * 5 : 0);
    var mult = 1;
    if (player.liveStream && player.liveStream.promotionBannerEndTime && Date.now() < player.liveStream.promotionBannerEndTime)
        mult = 1.2;
    return Math.floor(base * mult);
}

// 推广流量（保留原名供兼容，实际入口已改为推广入口）
function boostLiveStream() {
    doPromotionFlow();
}

// 添加观众（2. 超级金主：3%概率出现VIP，大V转发时翻倍）
function addViewers(count) {
    if (!player.liveStream.isLive) return;
    liveStreamSystem.maxViewers = getEffectiveMaxViewers();
    syncLiveDisplayViewerCount();
    var vipRate = 0.03;
    if (player.liveStream.promotionBigvEndTime && Date.now() < player.liveStream.promotionBigvEndTime) vipRate = 0.06;
    for (let i = 0; i < count; i++) {
        if (getLiveDisplayViewerCount() >= liveStreamSystem.maxViewers) break;

        player.liveStream.displayViewerCount = getLiveDisplayViewerCount() + 1;

        if (player.liveStream.viewers.length < LIVE_VIEWER_LIST_MAX) {
            const isVip = Math.random() < vipRate;
            const viewerName = pickUniqueViewerName(isVip);
            var v = {
                id: Date.now() + Math.random(),
                name: viewerName,
                joinTime: Date.now(),
                activity: Math.random(),
                isVip: isVip
            };
            player.liveStream.viewers.push(v);
            if (isVip) tryNobleEnterEffect(v);
        }
    }

    updateLiveStreamUI();
}

// 更新观众（修复：降低离开率、提高加入率，避免人数莫名其妙变少）
function updateViewers() {
    if (!player.liveStream.isLive) return;
    liveStreamSystem.maxViewers = getEffectiveMaxViewers();
    syncLiveDisplayViewerCount();
    const max = liveStreamSystem.maxViewers;
    const displayCount = getLiveDisplayViewerCount();
    const listLen = player.liveStream.viewers.length;

    // 随机有观众离开（降低到12%，避免流失过快）
    if (displayCount > 0 && Math.random() < 0.12) {
        player.liveStream.displayViewerCount = displayCount - 1;
        if (listLen > 0) {
            const leaveIndex = Math.floor(Math.random() * listLen);
            const leaveViewer = player.liveStream.viewers[leaveIndex];
            player.liveStream.viewers.splice(leaveIndex, 1);
            addDanmakuMessageq("系统", `${leaveViewer.name} 离开了直播间`, "system");
        } else {
            addDanmakuMessageq("系统", "一位观众 离开了直播间", "system");
        }
    }

    // 随机有新观众加入（提高至88%，确保人数倾向于增长）
    if (getLiveDisplayViewerCount() < max && Math.random() < 0.88) {
        const listBefore = player.liveStream.viewers.length;
        addViewers(1);
        if (getLiveDisplayViewerCount() > displayCount) {
            const viewers = player.liveStream.viewers;
            const joinName = viewers.length > listBefore ? viewers[viewers.length - 1].name : "一位观众";
            addDanmakuMessageq("系统", `${joinName} 进入了直播间`, "system");
        }
    }

    updateLiveStreamUI();
}

// 生成互动消息
function generateInteractions() {
    if (!player.liveStream.isLive || getLiveDisplayViewerCount() === 0 || player.liveStream.viewers.length === 0) return;
    
    // 随机生成1-8条互动消息（使用智能情境化发言）
    const messageCount = Math.floor(Math.random() * 7) + 1;
    
    for (let i = 0; i < messageCount; i++) {
        const viewerIndex = Math.floor(Math.random() * player.liveStream.viewers.length);
        const viewer = player.liveStream.viewers[viewerIndex];
        
        const message = getSmartAIMessage();
        liveStreamSystem.lastAiDanmaku = { sender: viewer.name, message: message };
        addDanmakuMessageq(viewer.name, message, "viewer");
        
        // 有小概率打赏
        if (Math.random() < 0.05) {
            generateDonation(viewer);
        }
    }
}

// 生成打赏（2.VIP加成 3.热度 10.连击）
function generateDonation(viewer, giftType) {
    let baseAmount = player.liveStream.level * 1;
    baseAmount = Math.floor(baseAmount * (1 + Math.random() * 50));
    
    let vipMult = 1;
    if (viewer && viewer.isVip) {
        vipMult = 3 + Math.random() * 7;
        baseAmount = Math.floor(baseAmount * vipMult);
        addDanmakuMessageq("系统", `👑 超级金主【${viewer.name}】驾到！豪气打赏！`, "donation");
    }
    
    const now = Date.now();
    const ls = player.liveStream;
    const comboWindow = 8000;
    if (giftType !== undefined && ls.lastGiftTime && (now - ls.lastGiftTime) < comboWindow && ls.lastGiftType === giftType) {
        ls.giftCombo = (ls.giftCombo || 0) + 1;
        const comboBonus = 1 + ls.giftCombo * 0.1;
        baseAmount = Math.floor(baseAmount * comboBonus);
        addDanmakuMessageq("系统", `🔥 ${ls.giftCombo}连击！额外加成+${Math.floor((comboBonus-1)*100)}%！`, "donation");
    } else {
        ls.giftCombo = 1;
    }
    ls.lastGiftTime = now;
    ls.lastGiftType = giftType !== undefined ? giftType : "rose";
    
    ls.heat = Math.min(100, (ls.heat || 0) + 5);
    var effectiveHeatDonation = (ls.heat || 0) + (ls.promotionHotEndTime && now < ls.promotionHotEndTime ? 500 : 0);
    const heatMult = 1 + effectiveHeatDonation * 0.005;
    baseAmount = Math.floor(baseAmount * heatMult);
    
    const theme = liveStreamSystem.themes.find(t => t.id === (ls.currentTheme || 0)) || liveStreamSystem.themes[0];
    const earnMult = ls.currentTheme ? theme.earnMult : 1;
    let amount = Math.floor(baseAmount * earnMult);
    if (ls.promotionFeaturedEndTime && now < ls.promotionFeaturedEndTime) amount = Math.floor(amount * 1.5);
    
    player.items.rose += amount;
    ls.totalEarnings += amount;
    ls.roseThisLive = (ls.roseThisLive || 0) + amount;
    var d = new Date();
    var hourKey = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + '-' + d.getHours();
    var weekKey = getLiveWeekKey();
    if (ls.hourlyEarningsStart !== hourKey) { ls.hourlyEarningsStart = hourKey; ls.hourlyEarnings = 0; }
    if (ls.weeklyEarningsStart !== weekKey) { ls.weeklyEarningsStart = weekKey; ls.weeklyEarnings = 0; }
    ls.hourlyEarnings = (ls.hourlyEarnings || 0) + amount;
    ls.weeklyEarnings = (ls.weeklyEarnings || 0) + amount;
    
    const message = liveStreamSystem.donationMessages[Math.floor(Math.random() * liveStreamSystem.donationMessages.length)];
    ls.donationCountThisLive = (ls.donationCountThisLive || 0) + 1;
    ls.donationHistory.push({
        viewer: viewer ? viewer.name : "系统",
        amount: amount,
        message: message,
        time: Date.now()
    });
    if (ls.donationHistory.length > 100) ls.donationHistory = ls.donationHistory.slice(-100);
    updateLiveGuardList(viewer ? viewer.name : "观众", amount);
    addDanmakuMessageq("系统", `🎉 ${viewer ? viewer.name : "观众"} 打赏了 ${amount} 朵玫瑰花！${message}`, "donation");
    if (player.liveStream.pkActive) addPkScore(amount);
    checkLiveAchievements();
    updateLiveStreamUI();
    updateDisplay();
}

// 发送弹幕
function sendDanmaku() {
    const input = document.getElementById('danmakuInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    addDanmakuMessageq(player.name, message, "player");
    checkWishListComplete(message); // 观众心愿单：弹幕含关键词得奖励
    input.value = '';
    
    // 玩家发送消息后，多名AI观众有概率陆续回复（更真实）
    if (player.liveStream.viewers.length > 0 && Math.random() < 0.65) {
        const replyCount = Math.random() < 0.35 ? 2 : 1;
        const usedIndex = {};
        for (let i = 0; i < replyCount; i++) {
            (function(idx) {
                setTimeout(() => {
                    if (!player.liveStream.isLive || player.liveStream.viewers.length === 0) return;
                    let viewerIndex = Math.floor(Math.random() * player.liveStream.viewers.length);
                    let tries = 0;
                    while (usedIndex[viewerIndex] && tries < player.liveStream.viewers.length) {
                        viewerIndex = (viewerIndex + 1) % player.liveStream.viewers.length;
                        tries++;
                    }
                    usedIndex[viewerIndex] = true;
                    const viewer = player.liveStream.viewers[viewerIndex];
                    const response = getAIReplyToPlayer(message);
                    addDanmakuMessageq(viewer.name, response, "viewer");
                }, 800 + idx * 1200 + Math.random() * 1500);
            })(i);
        }
    }
}

// 添加弹幕消息
function addDanmakuMessageq(sender, message, type) {
    const container = document.getElementById('danmakuContainerq');
    const messageElement = document.createElement('div');
    messageElement.className = 'danmaku-message';
    
    // 根据消息类型设置样式
    switch(type) {
        case "system":
            messageElement.style.color = '#ff00ff';
            break;
        case "donation":
            messageElement.style.color = '#FFD700';
            messageElement.style.fontWeight = 'bold';
            break;
        case "player":
            messageElement.style.color = '#4CAF50';
            break;
        default:
            messageElement.style.color = '#ccc';
    }
    
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    container.appendChild(messageElement);
      if (player.liveStream.isLive) {
        addDanmakuToScreen(sender, message, type);
        // 弹幕口令：观众发出口令即参与抽奖
        var pw = player.liveStream.danmakuPassword;
        if (pw && type === "viewer" && (message || "").indexOf(pw.word) >= 0) {
            var arr = player.liveStream.danmakuPasswordParticipants || [];
            if (arr.indexOf(sender) < 0) arr.push(sender);
            player.liveStream.danmakuPasswordParticipants = arr;
        }
      }
    // 自动滚动到底部
    container.scrollTop = container.scrollHeight;
   
    // 限制消息数量
    if (container.children.length > 30) {
        container.removeChild(container.children[0]);
    }
}

// 检查直播等级提升
function checkLiveLevelUp() {
    const nextLevelExp = liveStreamSystem.expToNextLevel[player.liveStream.level - 1] || 10000000000;
    
    if (player.liveStream.exp >= nextLevelExp) {
        player.liveStream.level++;
        player.liveStream.exp -= nextLevelExp;
        
        // 增加最大观众数
        liveStreamSystem.maxViewers = getEffectiveMaxViewers();
        
        addDanmakuMessageq("系统", `恭喜！直播等级提升到 ${player.liveStream.level} 级！`, "system");
        logAction(`直播等级提升到 ${player.liveStream.level} 级！`, "success");
        
        // 递归检查是否还能升级
        checkLiveLevelUp();
    }
    
    updateLiveStreamUI();
}

// 格式化时间
function formatTimew(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

// 1. 随机触发直播主题
function tryStartRandomTheme() {
    if (!player.liveStream.isLive || player.liveStream.currentTheme !== null) return;
    if (Math.random() < 0.25) {
        const idx = Math.floor(Math.random() * liveStreamSystem.themes.length);
        const t = liveStreamSystem.themes[idx];
        if (!player.liveStream.unlockedThemes.includes(t.id)) {
            player.liveStream.unlockedThemes = player.liveStream.unlockedThemes || [0];
            player.liveStream.unlockedThemes.push(t.id);
        }
        player.liveStream.currentTheme = t.id;
        player.liveStream.themeEndTime = Date.now() + 5 * 60 * 1000;
        addDanmakuMessageq("系统", `🎬 触发主题活动：【${t.icon}${t.name}】！经验${t.expMult}倍，收益${t.earnMult}倍，持续5分钟！`, "system");
    }
}
function checkLiveTheme() {
    if (!player.liveStream.isLive) return;
    if (player.liveStream.currentTheme !== null && Date.now() > player.liveStream.themeEndTime) {
        player.liveStream.currentTheme = null;
        addDanmakuMessageq("系统", "主题活动已结束", "system");
    }
    if (player.liveStream.currentTheme === null && Math.random() < 0.15) tryStartRandomTheme();
}

// 3. 热度衰减
function decayHeat() {
    if (!player.liveStream.isLive) return;
    const ls = player.liveStream;
    if ((ls.heat || 0) > 0) ls.heat = Math.max(0, (ls.heat || 0) - 0.5);
    updateLiveStreamUI();
}

// 4. 福袋抽奖
function triggerFortuneBag() {
    if (!player.liveStream.isLive || getLiveDisplayViewerCount() < 3 || player.liveStream.viewers.length === 0) return;
    player.liveStream.fortuneBagNextTime = Date.now() + 90000; // 下次福袋90秒后
    const viewers = player.liveStream.viewers;
    const winner = viewers[Math.floor(Math.random() * viewers.length)];
    const giftValue = Math.floor((1000 + player.liveStream.level * 50) * (1 + Math.random() * 2));
    player.items.rose += giftValue;
    player.liveStream.totalEarnings += giftValue;
    player.liveStream.donationHistory.push({ viewer: winner.name, amount: giftValue, message: "福袋中奖", time: Date.now() });
    if (player.liveStream.donationHistory.length > 100) player.liveStream.donationHistory = player.liveStream.donationHistory.slice(-100);
    addDanmakuMessageq("系统", `🎁 福袋抽奖！恭喜【${winner.name}】中奖，为主播送上 ${giftValue} 朵玫瑰花！`, "donation");
    updateLiveStreamUI();
    updateDisplay();
}

// 5. 直播PK - 结算并关闭，胜利晋升段位
function endLivePk() {
    const ls = player.liveStream;
    if (!ls || !ls.pkActive) return;
    if (ls.pkInterval) {
        clearInterval(ls.pkInterval);
        ls.pkInterval = null;
    }
    ls.pkActive = false;
    const won = (ls.pkScore || 0) >= (ls.pkRivalScore || 0);
    if (won) {
        const reward = 5000 + ls.level * 100;
        player.items.rose += reward;
        ls.totalEarnings += reward;
        (ls.achievements = ls.achievements || {})["pk_win"] = true;
        addDanmakuMessageq("系统", `🏆 PK胜利！获得${reward}玫瑰花奖励！`, "donation");
        ls.pkSubLevel = (ls.pkSubLevel || 1) + 1;
        if (ls.pkSubLevel > 5) {
            ls.pkSubLevel = 1;
            ls.pkTier = Math.min(5, (ls.pkTier || 0) + 1);
            const tier = liveStreamSystem.pkTiers && liveStreamSystem.pkTiers[ls.pkTier];
            addDanmakuMessageq("系统", `🎉 晋升大段！当前段位：${tier ? tier.icon + tier.name : ''}${(liveStreamSystem.pkSubNames || ["","I","II","III","IV","V"])[1]}！`, "donation");
        } else {
            const tier = liveStreamSystem.pkTiers && liveStreamSystem.pkTiers[ls.pkTier || 0];
            const subName = (liveStreamSystem.pkSubNames || ["","I","II","III","IV","V"])[ls.pkSubLevel];
            addDanmakuMessageq("系统", `📈 晋升小段！当前：${tier ? tier.icon + tier.name : ''}${subName}`, "system");
        }
    } else {
        addDanmakuMessageq("系统", "😢 PK失败，下次加油！", "system");
        if (ls.pkSubLevel > 1) {
            ls.pkSubLevel--;
        } else if ((ls.pkTier || 0) > 0) {
            ls.pkTier--;
            ls.pkSubLevel = 5;
        }
    }
    ls.pkCooldownEndTime = Date.now() + 30 * 60 * 1000;
    updateLiveStreamUI();
    updateDisplay();
}

// 5. 直播PK（按段位匹配对手，对手人气会随时间增长；每次结束后冷却30分钟）
function startLivePk() {
    if (!player.liveStream.isLive || player.liveStream.pkActive) return;
    var now = Date.now();
    if (player.liveStream.pkCooldownEndTime && now < player.liveStream.pkCooldownEndTime) {
        var minLeft = Math.ceil((player.liveStream.pkCooldownEndTime - now) / 60000);
        logAction("PK冷却中，还需 " + minLeft + " 分钟", "error");
        return;
    }
    if (getLiveDisplayViewerCount() < 5) {
        logAction("观众太少，无法发起PK！", "error");
        return;
    }
    const ls = player.liveStream;
    ls.pkActive = true;
    ls.pkScore = 0;
    const tier = liveStreamSystem.pkTiers[ls.pkTier || 0] || liveStreamSystem.pkTiers[0];
    const subLevel = ls.pkSubLevel || 1;
    var initMin = tier.pkInitialMin != null ? tier.pkInitialMin : 10;
    var initMax = tier.pkInitialMax != null ? tier.pkInitialMax : 50;
    var growthMin = tier.pkGrowthMin != null ? tier.pkGrowthMin : 5;
    var growthMax = tier.pkGrowthMax != null ? tier.pkGrowthMax : 30;
    const rivalScore = Math.floor(initMin + Math.random() * (initMax - initMin + 1));
    const duration = 180;
    ls.pkEndTime = Date.now() + duration * 1000;
    ls.pkRivalScore = Math.max(10, rivalScore);
    ls.pkRivalGrowthMin = growthMin;
    ls.pkRivalGrowthMax = growthMax;
    const tierName = tier.icon ? tier.icon + tier.name : "对手";
    const subName = (liveStreamSystem.pkSubNames || ["","I","II","III","IV","V"])[subLevel] || "";
    addDanmakuMessageq("系统", `⚔️ 直播PK开始！${tierName}${subName}段对手，初始人气${ls.pkRivalScore}，3分钟内比拼礼物人气！对手也会收到礼物增长人气！`, "system");
    ls.pkInterval = registerInterval(() => {
        if (!ls.isLive || !ls.pkActive) return;
        if (Date.now() >= ls.pkEndTime) {
            endLivePk();
            return;
        }
        if (Math.random() < 0.2) {
            const amt = Math.floor(ls.level * 10 * (1 + Math.random()));
            ls.pkScore += amt;
            ls.totalEarnings += amt;
        }
        if (Math.random() < 0.25) {
            var gMin = ls.pkRivalGrowthMin != null ? ls.pkRivalGrowthMin : 5;
            var gMax = ls.pkRivalGrowthMax != null ? ls.pkRivalGrowthMax : 30;
            const rivalGain = Math.floor(gMin + Math.random() * (gMax - gMin + 1));
            ls.pkRivalScore += rivalGain;
        }
    }, 2000);
}
function addPkScore(amount) {
    if (player.liveStream.pkActive) player.liveStream.pkScore = (player.liveStream.pkScore || 0) + amount;
}

// 6. 随机直播事件（含主题活动解锁）
function triggerRandomLiveEvent() {
    if (!player.liveStream.isLive || (player.liveStream.eventCooldown || 0) > Date.now()) return;
    for (const ev of liveStreamSystem.randomEvents) {
        if (Math.random() < ev.prob) {
            player.liveStream.eventCooldown = Date.now() + 120000;
            const vb = ev.viewerBonus;
            if (vb > 0) addViewers(vb);
            else if (vb < 0 && getLiveDisplayViewerCount() > 5) {
                for (let i = 0; i < Math.min(-vb, getLiveDisplayViewerCount() - 3); i++) {
                    player.liveStream.displayViewerCount = Math.max(0, getLiveDisplayViewerCount() - 1);
                    if (player.liveStream.viewers.length > 0) {
                        const idx = Math.floor(Math.random() * player.liveStream.viewers.length);
                        const v = player.liveStream.viewers[idx];
                        player.liveStream.viewers.splice(idx, 1);
                        addDanmakuMessageq("系统", `${v.name} 离开了直播间`, "system");
                    } else {
                        addDanmakuMessageq("系统", "一位观众 离开了直播间", "system");
                    }
                }
            }
            if (ev.earnBonus > 1 && Math.random() < 0.5) {
                const viewer = player.liveStream.viewers[Math.floor(Math.random() * player.liveStream.viewers.length)];
                if (viewer) generateDonation(viewer);
            }
            if (ev.unlockTheme) {
                const unlocked = player.liveStream.unlockedThemes || [0];
                const locked = liveStreamSystem.themes.filter(t => !unlocked.includes(t.id));
                if (locked.length > 0) {
                    const t = locked[Math.floor(Math.random() * locked.length)];
                    player.liveStream.unlockedThemes = player.liveStream.unlockedThemes || [0];
                    if (!player.liveStream.unlockedThemes.includes(t.id)) {
                        player.liveStream.unlockedThemes.push(t.id);
                        addDanmakuMessageq("系统", `🎬 解锁新主题活动：${t.icon}${t.name}！`, "donation");
                    }
                }
            }
            addDanmakuMessageq("系统", `📢 【${ev.name}】${ev.desc}`, "system");
            break;
        }
    }
}


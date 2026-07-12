// 趣味玩法
// ========== 5个趣味玩法 ==========
// 1. 直播挑战：随机本场目标，完成得奖励
function pickNextLiveChallenge() {
    var list = liveStreamSystem.liveChallenges;
    if (!list || list.length === 0) return;
    var c = list[Math.floor(Math.random() * list.length)];
    player.liveStream.currentChallenge = {
        type: c.type,
        name: c.name,
        target: c.target,
        rewardRose: c.rewardRose,
        rewardExp: c.rewardExp
    };
    addDanmakuMessageq("系统", "🎯 本场挑战：" + c.name + " 达到 " + c.target + "，完成可得 " + c.rewardRose + "🌹+" + c.rewardExp + "经验！", "system");
}
function checkLiveChallenge() {
    var ls = player.liveStream;
    var ch = ls.currentChallenge;
    if (!ch) return;
    var current = 0;
    if (ch.type === "rose") current = ls.roseThisLive || 0;
    else if (ch.type === "heat") current = Math.floor(ls.heat || 0);
    else if (ch.type === "viewer") current = typeof getLiveDisplayViewerCount === 'function' ? getLiveDisplayViewerCount() : ls.viewers.length;
    else if (ch.type === "donation") current = ls.donationCountThisLive || 0;
    if (current >= ch.target) {
        player.items.rose += ch.rewardRose;
        ls.exp += ch.rewardExp;
        ls.challengeCompletedThisLive = (ls.challengeCompletedThisLive || 0) + 1;
        addDanmakuMessageq("系统", "🎯 挑战完成！" + ch.name + " 已达 " + ch.target + "，获得 " + ch.rewardRose + "🌹+" + ch.rewardExp + "经验！", "donation");
        ls.currentChallenge = null;
        pickNextLiveChallenge();
        updateDisplay();
    }
}

// 2. 观众心愿单：发弹幕包含关键词得奖励
function maybeTriggerWishList() {
    if (!player.liveStream.isLive || player.liveStream.wishList) return;
    if (Math.random() > 0.4) return;
    var words = liveStreamSystem.wishListKeywords;
    var kw = words[Math.floor(Math.random() * words.length)];
    player.liveStream.wishList = {
        keyword: kw,
        endTime: Date.now() + 3 * 60 * 1000,
        rewardRose: 200 + Math.floor(Math.random() * 300),
        rewardExp: 300 + Math.floor(Math.random() * 500)
    };
    addDanmakuMessageq("系统", "💝 观众心愿：发送弹幕「" + kw + "」即可获得奖励！限时3分钟", "system");
}
function checkWishListComplete(keyword) {
    var w = player.liveStream.wishList;
    if (!w || Date.now() > w.endTime) return;
    if ((keyword || "").indexOf(w.keyword) >= 0) {
        player.items.rose += w.rewardRose;
        player.liveStream.exp += w.rewardExp;
        addDanmakuMessageq("系统", "💝 心愿达成！获得 " + w.rewardRose + "🌹+" + w.rewardExp + "经验！", "donation");
        player.liveStream.wishList = null;
        updateDisplay();
    }
}

// 3. 弹幕口令：期间发出口令的观众参与抽奖
function triggerDanmakuPassword() {
    if (!player.liveStream.isLive) return;
    var words = liveStreamSystem.danmakuPasswordWords;
    var word = words[Math.floor(Math.random() * words.length)];
    player.liveStream.danmakuPassword = {
        word: word,
        endTime: Date.now() + 2 * 60 * 1000
    };
    player.liveStream.danmakuPasswordParticipants = [];
    addDanmakuMessageq("系统", "🎲 弹幕口令【" + word + "】已开启！2分钟内发送含该口令的弹幕即可参与抽奖！", "system");
    if (player.liveStream.danmakuPasswordTimer) { clearTimeout(player.liveStream.danmakuPasswordTimer); player.liveStream.danmakuPasswordTimer = null; }
    player.liveStream.danmakuPasswordTimer = setTimeout(function() {
        player.liveStream.danmakuPasswordTimer = null;
        if (!player.liveStream.isLive || !player.liveStream.danmakuPassword) return;
        var parts = player.liveStream.danmakuPasswordParticipants || [];
        if (parts.length > 0) {
            var winner = parts[Math.floor(Math.random() * parts.length)];
            var reward = 500 + Math.floor(Math.random() * 500);
            player.items.rose += reward;
            addDanmakuMessageq("系统", "🎲 口令抽奖结果：恭喜 " + winner + " 中奖，获得 " + reward + "🌹！", "donation");
        } else {
            addDanmakuMessageq("系统", "🎲 本轮流弹幕口令无人参与，下次再来～", "system");
        }
        player.liveStream.danmakuPassword = null;
        player.liveStream.danmakuPasswordParticipants = [];
        updateLiveStreamUI();
    }, 2 * 60 * 1000 + 500);
}

// 4. 任务链奖励：当日完成≥3个每日任务可领额外奖励（在每日任务面板中显示并领取）
function claimTaskChainReward() {
    var ls = player.liveStream;
    if (ls.taskChainClaimedToday) {
        logAction("今日已领取过任务链奖励", "error");
        return;
    }
    var doneCount = Object.keys(ls.dailyTaskDone || {}).length;
    if (doneCount < 3) {
        logAction("需完成至少3个每日任务才能领取任务链奖励", "error");
        return;
    }
    ls.taskChainClaimedToday = true;
    player.items.rose += 2000;
    ls.exp += 500;
    addDanmakuMessageq("系统", "📋 任务链奖励已领取！获得 2000🌹+500 经验！", "donation");
    logAction("领取任务链奖励：2000🌹+500经验", "success");
    updateDisplay();
    updateLiveStreamUI();
}

// 7. 成就检查
function checkLiveAchievements() {
    const ach = player.liveStream.achievements || {};
    for (const a of liveStreamSystem.achievements) {
        if (ach[a.id]) continue;
        try {
            if (a.check && a.check()) {
                ach[a.id] = true;
                player.items.rose += a.reward;
                addDanmakuMessageq("系统", `🏅 达成成就【${a.name}】！获得${a.reward}玫瑰花！`, "donation");
                updateDisplay();
            }
        } catch (e) {}
    }
}

// 8. 弹幕投票（先清除上一轮投票定时器，避免多定时器泄漏）
function triggerVote() {
    if (!player.liveStream.isLive || player.liveStream.voteEndTime > Date.now()) return;
    var ls = player.liveStream;
    if (ls.voteInterval2) { clearInterval(ls.voteInterval2); ls.voteInterval2 = null; }
    var tpl = liveStreamSystem.voteTemplates[Math.floor(Math.random() * liveStreamSystem.voteTemplates.length)];
    ls.voteOptions = tpl.options.map(function(o, i) { return { text: o, votes: 0, id: i }; });
    ls.voteEndTime = Date.now() + 60000;
    ls.voteAction = tpl.action;
    addDanmakuMessageq("系统", "🗳 观众投票：" + tpl.action + " - " + tpl.options.join(" / "), "system");
    ls.voteInterval2 = registerInterval(function() {
        if (ls.viewers.length > 0 && Math.random() < 0.3) {
            var opt = ls.voteOptions[Math.floor(Math.random() * ls.voteOptions.length)];
            opt.votes++;
        }
    }, 3000);
    setTimeout(function() {
        if (ls.voteInterval2) { clearInterval(ls.voteInterval2); ls.voteInterval2 = null; }
        var opts = ls.voteOptions || [];
        var winner = opts.length ? opts.reduce(function(a, b) { return (a.votes || 0) >= (b.votes || 0) ? a : b; }) : null;
        if (winner && winner.text) {
            addDanmakuMessageq("系统", "投票结果：观众选择【" + winner.text + "】！", "system");
            ls.exp += Math.floor(500 * ls.level);
        }
    }, 61000);
}

// 9. 选择直播主题（玩家手动，随机事件解锁）
function selectLiveTheme(id) {
    const unlocked = player.liveStream.unlockedThemes || [0];
    if (!unlocked.includes(id)) return;
    player.liveStream.currentTheme = id;
    player.liveStream.themeEndTime = Date.now() + 10 * 60 * 1000;
    const t = liveStreamSystem.themes.find(x => x.id === id);
    addDanmakuMessageq("系统", `主播切换主题：${t ? t.icon + t.name : id}`, "system");
}

// 选择直播间装扮（按等级解锁，10 种任选已解锁的）
function selectRoomTheme(index) {
    const ls = player.liveStream;
    const themes = liveStreamSystem.roomThemes;
    if (index < 0 || index >= themes.length) return;
    if (ls.level < themes[index].level) return;
    ls.selectedRoomThemeIndex = index;
    updateLiveStreamUI();
    if (ls.isLive) addDanmakuMessageq("系统", "🎨 直播间装扮已切换为：" + themes[index].name, "system");
}

function getLiveWeekKey() {
    var d = new Date();
    var one = new Date(d.getFullYear(), 0, 1);
    var dayCount = Math.floor((d - one) / 86400000);
    var weekNum = Math.floor(dayCount / 7) + 1;
    return d.getFullYear() + '-W' + weekNum;
}

// 本场守护榜（按打赏累计，取前10）
function updateLiveGuardList(name, amount) {
    const ls = player.liveStream;
    if (!ls.guardList) ls.guardList = [];
    let found = ls.guardList.find(function(g) { return g.name === name; });
    if (found) found.amount += amount; else ls.guardList.push({ name: name, amount: amount });
    ls.guardList.sort(function(a, b) { return b.amount - a.amount; });
    ls.guardList = ls.guardList.slice(0, 10);
}

// 每日任务：若跨天则重置
function resetDailyTasksIfNewDay() {
    const ls = player.liveStream;
    var today = new Date().toDateString();
    if (ls.lastDailyReset && new Date(ls.lastDailyReset).toDateString() !== today) {
        ls.dailyTaskDone = {};
        ls.taskChainClaimedToday = false;
        ls.lastDailyReset = Date.now();
    }
    if (!ls.lastDailyReset) ls.lastDailyReset = Date.now();
}

function openDailyTaskPanel() {
    resetDailyTasksIfNewDay();
    var listEl = document.getElementById('dailyTaskList');
    if (!listEl) return;
    var html = '';
    liveStreamSystem.dailyTasks.forEach(function(t) {
        var done = (player.liveStream.dailyTaskDone || {})[t.id];
        var ok = false;
        try { if (t.check) ok = t.check(); } catch(e) {}
        html += '<div style="padding:8px;background:' + (done ? '#1b3d1b' : '#252525') + ';border-radius:6px;margin-bottom:6px;">';
        html += '<span style="color:' + (done ? '#4CAF50' : '#ccc') + ';">' + (done ? '✓' : '○') + ' ' + t.name + '</span><br><span style="font-size:11px;color:#888;">' + t.desc + '</span>';
        if (!done && ok) html += ' <button onclick="claimDailyTask(\'' + t.id + '\')" style="margin-left:8px;padding:2px 8px;background:#2e7d32;color:white;border:none;border-radius:4px;cursor:pointer;">领取</button>';
        html += '</div>';
    });
    var doneCount = Object.keys(player.liveStream.dailyTaskDone || {}).length;
    if (doneCount >= 3 && !player.liveStream.taskChainClaimedToday) {
        html += '<div style="margin-top:12px;padding:12px;background:linear-gradient(90deg,#2e7d32,#1b5e20);border-radius:8px;border:1px solid #4CAF50;">';
        html += '<span style="color:#fff;">📋 任务链奖励</span> 今日已完成' + doneCount + '个任务，可领额外奖励！';
        html += ' <button onclick="claimTaskChainReward(); document.getElementById(\'liveDailyTaskPanel\').style.display=\'none\'" style="margin-left:8px;padding:6px 14px;background:#FFD700;color:#000;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">领取 2000🌹+500经验</button>';
        html += '</div>';
    }
    listEl.innerHTML = html || '<div style="color:#666;">暂无任务</div>';
    document.getElementById('liveDailyTaskPanel').style.display = 'flex';
}

function claimDailyTask(id) {
    var t = liveStreamSystem.dailyTasks.find(function(x) { return x.id === id; });
    if (!t || (player.liveStream.dailyTaskDone || {})[id]) return;
    var ok = false;
    try { if (t.check) ok = t.check(); } catch(e) {}
    if (!ok) return;
    player.liveStream.dailyTaskDone = player.liveStream.dailyTaskDone || {};
    player.liveStream.dailyTaskDone[id] = true;
    player.liveStream.exp += t.rewardExp || 0;
    player.items.rose += t.rewardRose || 0;
    addDanmakuMessageq("系统", "📋 完成每日任务【" + t.name + "】，获得 " + (t.rewardExp||0) + " 经验、" + (t.rewardRose||0) + " 玫瑰花！", "donation");
    openDailyTaskPanel();
    checkLiveAchievements();
    updateDisplay();
}

function openWheelModal() {
    document.getElementById('liveWheelModal').style.display = 'flex';
    document.getElementById('wheelResult').textContent = '';
}

function spinLiveWheel(useStarCoin) {
    var ls = player.liveStream;
    if (useStarCoin) {
        if ((player.nightClub && player.nightClub.starCoins < 5000) || !player.nightClub) {
            logAction("星币不足5000！", "error");
            return;
        }
        player.nightClub.starCoins -= 5000;
    } else {
        if ((ls.heat || 0) < 50) {
            logAction("热度不足50！", "error");
            return;
        }
        ls.heat = Math.max(0, (ls.heat || 0) - 50);
    }
    var items = liveStreamSystem.wheelItems;
    var total = 0;
    for (var i = 0; i < items.length; i++) total += items[i].prob;
    var r = Math.random() * total;
    var idx = 0;
    for (var i = 0; i < items.length; i++) {
        r -= items[i].prob;
        if (r <= 0) { idx = i; break; }
    }
    var item = items[idx];
    ls.wheelTotalCount = (ls.wheelTotalCount || 0) + 1;
    if (item.type === 'rose') {
        player.items.rose += item.value;
        ls.totalEarnings += item.value;
    } else if (item.type === 'exp') {
        ls.exp += item.value;
    } else if (item.type === 'viewer' && ls.isLive) {
        addViewers(item.value);
    } else if (item.type === 'heat') {
        ls.heat = Math.min(100, (ls.heat || 0) + item.value);
    } else if (item.type === 'vip' && ls.isLive) {
        addViewers(1);
        var v = ls.viewers[ls.viewers.length - 1];
        if (v) { v.isVip = true; v.name = liveStreamSystem.vipNames[Math.floor(Math.random() * liveStreamSystem.vipNames.length)]; }
        addDanmakuMessageq("系统", "👑 超级金主【" + (v ? v.name : "神秘大佬") + "】进入直播间！", "donation");
    }
    document.getElementById('wheelResult').textContent = '获得：' + (item.icon || '') + item.name + '！';
    checkLiveAchievements();
    updateLiveStreamUI();
    updateDisplay();
}

function startDanmakuLottery() {
    var ls = player.liveStream;
    if (!ls.isLive) { logAction("请先开始直播", "error"); return; }
    var now = Date.now();
    if (ls.lotteryEndTime && ls.lotteryEndTime > now) return;
    if (ls.lotteryCooldownEndTime && now < ls.lotteryCooldownEndTime) {
        var minLeft = Math.ceil((ls.lotteryCooldownEndTime - now) / 60000);
        logAction("弹幕抽奖冷却中，还需 " + minLeft + " 分钟", "error");
        return;
    }
    ls.lotteryEndTime = Date.now() + 60000;
    ls.lotteryParticipants = [];
    for (var i = 0; i < ls.viewers.length; i++) ls.lotteryParticipants.push(ls.viewers[i].name);
    ls.lotteryPrize = Math.floor(2000 + ls.level * 100);
    ls.lotteryTotalCount = (ls.lotteryTotalCount || 0) + 1;
    addDanmakuMessageq("系统", "🎲 弹幕抽奖开始！60秒后开奖，奖品 " + ls.lotteryPrize + " 玫瑰花，当前在场观众均可参与！", "system");
    if (ls.lotteryEndTimer) { clearTimeout(ls.lotteryEndTimer); ls.lotteryEndTimer = null; }
    ls.lotteryEndTimer = setTimeout(function() {
        ls.lotteryEndTimer = null;
        if (!player.liveStream.isLive || !player.liveStream.lotteryEndTime) return;
        var parts = player.liveStream.lotteryParticipants || [];
        var winner = parts.length ? parts[Math.floor(Math.random() * parts.length)] : "无人";
        player.items.rose += player.liveStream.lotteryPrize;
        player.liveStream.totalEarnings += player.liveStream.lotteryPrize;
        player.liveStream.donationHistory.push({ viewer: winner, amount: player.liveStream.lotteryPrize, message: "弹幕抽奖中奖", time: Date.now() });
        addDanmakuMessageq("系统", "🎲 弹幕抽奖开奖！恭喜【" + winner + "】中奖，为主播送上 " + player.liveStream.lotteryPrize + " 朵玫瑰花！", "donation");
        player.liveStream.lotteryEndTime = 0;
        player.liveStream.lotteryCooldownEndTime = Date.now() + 5 * 60 * 1000;
        checkLiveAchievements();
        updateLiveStreamUI();
        updateDisplay();
    }, 61000);
    updateLiveStreamUI();
}

function startLiveGuess() {
    var ls = player.liveStream;
    if (!ls.isLive) { logAction("请先开始直播", "error"); return; }
    var now = Date.now();
    if (ls.guessActive && ls.guessEndTime > now) return;
    if (ls.guessCooldownEndTime && now < ls.guessCooldownEndTime) {
        var minLeft = Math.ceil((ls.guessCooldownEndTime - now) / 60000);
        logAction("竞猜冷却中，还需 " + minLeft + " 分钟", "error");
        return;
    }
    var tpl = liveStreamSystem.guessTemplates[Math.floor(Math.random() * liveStreamSystem.guessTemplates.length)];
    ls.guessName = tpl.name;
    ls.guessOptions = tpl.options;
    ls.guessEndTime = Date.now() + 60000;
    ls.guessActive = true;
    ls.guessStartDonationCount = ls.donationCountThisLive || 0;
    ls.guessStartHeat = ls.heat || 0;
    addDanmakuMessageq("系统", "🎯 竞猜开始：" + tpl.name + " — " + tpl.options.join(" / ") + "，60秒后揭晓！", "system");
    ls.guessTplName = tpl.name;
    ls.guessTplOptions = tpl.options;
    if (ls.guessEndTimer) { clearTimeout(ls.guessEndTimer); ls.guessEndTimer = null; }
    ls.guessEndTimer = setTimeout(function() {
        ls.guessEndTimer = null;
        if (!player.liveStream.isLive || !player.liveStream.guessActive) return;
        var ls = player.liveStream;
        var gName = ls.guessTplName || "";
        var gOpts = ls.guessTplOptions || ["单数", "双数"];
        var endDonation = ls.donationCountThisLive || 0;
        var endHeat = ls.heat || 0;
        var single = (endDonation - (ls.guessStartDonationCount || 0)) % 2 === 1;
        var up = endHeat >= (ls.guessStartHeat || 0);
        var winnerOpt = gOpts[0];
        if (gName.indexOf("礼物数") !== -1) winnerOpt = single ? gOpts[0] : gOpts[1];
        else if (gName.indexOf("观众") !== -1) winnerOpt = up ? gOpts[0] : gOpts[1];
        else winnerOpt = up ? gOpts[0] : gOpts[1];
        var reward = 1000 + ls.level * 50;
        ls.guessWinCount = (ls.guessWinCount || 0) + 1;
        player.items.rose += reward;
        ls.totalEarnings += reward;
        addDanmakuMessageq("系统", "🎯 竞猜揭晓：结果【" + winnerOpt + "】！主播获得 " + reward + " 玫瑰花！", "donation");
        ls.guessActive = false;
        ls.guessCooldownEndTime = Date.now() + 10 * 60 * 1000;
        checkLiveAchievements();
        updateLiveStreamUI();
        updateDisplay();
    }, 61000);
    updateLiveStreamUI();
}

function doLiveCheckIn() {
    var ls = player.liveStream;
    if (ls.checkInDoneToday) { logAction("今日已签到", "error"); return; }
    var today = new Date().toDateString();
    var last = ls.lastCheckInDate || "";
    var streak = ls.checkInStreak || 0;
    if (last && new Date(last).getTime() < new Date(today).getTime() - 86400000 * 2) streak = 0;
    if (last === today) return;
    streak = (last && new Date(today).getTime() - new Date(last).getTime() <= 86400000 * 1.5) ? streak + 1 : 1;
    ls.checkInStreak = streak;
    ls.lastCheckInDate = today;
    ls.checkInDoneToday = true;
    var expReward = 1500 + streak * 500;
    var roseReward = 500 + streak * 200;
    ls.exp += expReward;
    player.items.rose += roseReward;
    addDanmakuMessageq("系统", "✅ 直播签到成功！连续 " + streak + " 天，获得 " + expReward + " 经验、" + roseReward + " 玫瑰花！", "donation");
    checkLiveAchievements();
    updateLiveStreamUI();
    updateDisplay();
}

// 连麦：随机观众连麦，带来人气与礼物，冷却15分钟
function startConnectMc() {
    var ls = player.liveStream;
    if (!ls.isLive) { logAction("请先开始直播", "error"); return; }
    var now = Date.now();
    if (ls.lastConnectMcTime && now < ls.lastConnectMcTime) {
        var minLeft = Math.ceil((ls.lastConnectMcTime - now) / 60000);
        logAction("连麦冷却中，还需 " + minLeft + " 分钟", "error");
        return;
    }
    if (getLiveDisplayViewerCount() === 0 || ls.viewers.length === 0) {
        logAction("暂无观众，无法连麦", "error");
        return;
    }
    var viewer = ls.viewers[Math.floor(Math.random() * ls.viewers.length)];
    addDanmakuMessageq("系统", "🎤 【" + viewer.name + "】申请连麦……", "system");
    if (ls.connectMcTimer) { clearTimeout(ls.connectMcTimer); ls.connectMcTimer = null; }
    ls.connectMcTimer = setTimeout(function() {
        ls.connectMcTimer = null;
        if (!player.liveStream.isLive) return;
        addDanmakuMessageq("系统", "🎤 连麦成功！【" + viewer.name + "】带来人气与礼物！", "donation");
        var addCount = 3 + Math.floor(Math.random() * 6);
        addViewers(addCount);
        var giftAmt = Math.floor((500 + ls.level * 80) * (1 + Math.random() * 1.5));
        player.items.rose += giftAmt;
        ls.totalEarnings += giftAmt;
        ls.donationHistory.push({ viewer: viewer.name, amount: giftAmt, message: "连麦礼物", time: Date.now() });
        if (ls.donationHistory.length > 100) ls.donationHistory = ls.donationHistory.slice(-100);
        updateLiveGuardList(viewer.name, giftAmt);
        addDanmakuMessageq("系统", "🎁 " + viewer.name + " 连麦打赏 " + giftAmt + " 朵玫瑰花！", "donation");
        player.liveStream.lastConnectMcTime = Date.now() + 15 * 60 * 1000;
        updateLiveStreamUI();
        updateDisplay();
    }, 2500);
    updateLiveStreamUI();
}

// 贵族进场：VIP 进入时全屏提示（节流）
function tryNobleEnterEffect(viewer) {
    if (!viewer || !viewer.isVip) return;
    var key = viewer.name + "_" + viewer.id;
    if (player.liveStream.nobleEnterShown && player.liveStream.nobleEnterShown[key]) return;
    player.liveStream.nobleEnterShown = player.liveStream.nobleEnterShown || {};
    player.liveStream.nobleEnterShown[key] = true;
    var msg = liveStreamSystem.nobleEnterMessages[Math.floor(Math.random() * liveStreamSystem.nobleEnterMessages.length)];
    addDanmakuMessageq("系统", msg.replace("{name}", viewer.name), "donation");
}

// 在游戏主循环中更新直播经验
function updateLiveStreamExperience() {
    if (player.liveStream && player.liveStream.isLive) {
        const now = Date.now();
        const elapsed = now - player.liveStream.lastUpdate;
        player.liveStream.lastUpdate = now;
        
        // 检查各类推广效果是否结束
        if (player.liveStream.boostEndTime && now > player.liveStream.boostEndTime) {
            player.liveStream.expMultiplier = 1;
            player.liveStream.boostEndTime = null;
            addDanmakuMessageq("系统", "流量推广效果已结束", "system");
        }
        if (player.liveStream.promotionSplashEndTime && now > player.liveStream.promotionSplashEndTime) {
            player.liveStream.promotionSplashEndTime = null;
            addDanmakuMessageq("系统", "开屏广告效果已结束", "system");
        }
        if (player.liveStream.promotionHotEndTime && now > player.liveStream.promotionHotEndTime) {
            player.liveStream.promotionHotEndTime = null;
            addDanmakuMessageq("系统", "热门推荐位效果已结束", "system");
        }
        if (player.liveStream.promotionBannerEndTime && now > player.liveStream.promotionBannerEndTime) {
            player.liveStream.promotionBannerEndTime = null;
            addDanmakuMessageq("系统", "首页横幅效果已结束", "system");
        }
        if (player.liveStream.promotionFeaturedEndTime && now > player.liveStream.promotionFeaturedEndTime) {
            player.liveStream.promotionFeaturedEndTime = null;
            addDanmakuMessageq("系统", "平台精选效果已结束", "system");
        }
        if (player.liveStream.promotionBigvEndTime && now > player.liveStream.promotionBigvEndTime) {
            player.liveStream.promotionBigvEndTime = null;
            addDanmakuMessageq("系统", "大V转发效果已结束", "system");
        }
        
        // 经验倍数：开屏广告3倍 > 流量推广2倍
        let expMult = 1;
        if (player.liveStream.promotionSplashEndTime && now < player.liveStream.promotionSplashEndTime) expMult = 3;
        else if (player.liveStream.boostEndTime && now < player.liveStream.boostEndTime) expMult = player.liveStream.expMultiplier || 2;
        const theme = liveStreamSystem.themes.find(t => t.id === (player.liveStream.currentTheme || 0));
        if (theme) expMult *= theme.expMult;
        const expGain = (elapsed / 1000) * expMult;
        player.liveStream.exp += expGain;
        
        // 检查升级
        checkLiveLevelUp();
        
        // 直播挑战检查（本场目标）
        checkLiveChallenge();
        
        // 直播里程碑：每累计直播60分钟领一次奖励（含本场已播时长）
        var effectiveTotalMs = (player.liveStream.totalLiveTime || 0) + (Date.now() - player.liveStream.lastLiveStart);
        var totalMin = Math.floor(effectiveTotalMs / 60000);
        var lastMilestone = player.liveStream.lastMilestoneMinutes || 0;
        if (totalMin > lastMilestone && totalMin >= 1) {
            var steps = Math.min(totalMin - lastMilestone, 10);
            player.liveStream.lastMilestoneMinutes = lastMilestone + steps;
            var roseReward = 300 * steps;
            var expReward = 500 * steps;
            player.items.rose += roseReward;
            player.liveStream.exp += expReward;
            addDanmakuMessageq("系统", "📺 直播里程碑达成！累计直播" + (lastMilestone + steps) + "分钟，获得" + roseReward + "🌹+" + expReward + "经验！", "system");
        }
        
        // 更新UI
        updateLiveStreamUI();
    }
}

// 盲盒系统：每个档位独立奖励池，概率统一 80% / 15% / 3% / 1.84% / 0.15% / 0.01%（按价值从低到高），奖励略降
const giftBoxSystem = {
    boxTiers: [
        { id: 0, name: "幸运盲盒", price: 5000, gifts: [
            { name: "鲜花", value: 8000, probability: 80, icon: "💐", color: "#4CAF50" },
            { name: "棒棒糖", value: 14400, probability: 15, icon: "🍭", color: "#E91E63" },
            { name: "墨镜", value: 28000, probability: 3, icon: "🕶️", color: "#2196F3" },
            { name: "礼花筒", value: 64000, probability: 1.84, icon: "🎆", color: "#FFC107" },
            { name: "比心兔兔", value: 120000, probability: 0.15, icon: "🐰💖", color: "#E91E63" },
            { name: "热气球", value: 400000, probability: 0.01, icon: "🎈", color: "#9C27B0" }
        ]},
        { id: 1, name: "白银盲盒", price: 10000, gifts: [
            { name: "小心心", value: 12000, probability: 80, icon: "💗", color: "#F48FB1" },
            { name: "啤酒", value: 24000, probability: 15, icon: "🍺", color: "#FFC107" },
            { name: "墨镜", value: 44000, probability: 3, icon: "🕶️", color: "#2196F3" },
            { name: "礼花筒", value: 96000, probability: 1.84, icon: "🎆", color: "#FFC107" },
            { name: "比心兔兔", value: 224000, probability: 0.15, icon: "🐰💖", color: "#E91E63" },
            { name: "热气球", value: 640000, probability: 0.01, icon: "🎈", color: "#9C27B0" }
        ]},
        { id: 2, name: "黄金盲盒", price: 25000, gifts: [
            { name: "荧光棒", value: 20000, probability: 80, icon: "✨", color: "#FFEB3B" },
            { name: "跑车模型", value: 48000, probability: 15, icon: "🏎️", color: "#FF5722" },
            { name: "礼花筒", value: 120000, probability: 3, icon: "🎆", color: "#FFC107" },
            { name: "比心兔兔", value: 320000, probability: 1.84, icon: "🐰💖", color: "#E91E63" },
            { name: "热气球", value: 960000, probability: 0.15, icon: "🎈", color: "#9C27B0" },
            { name: "梦幻城堡", value: 2400000, probability: 0.01, icon: "🏰", color: "#9C27B0" }
        ]},
        { id: 3, name: "钻石盲盒", price: 50000, gifts: [
            { name: "钻石", value: 40000, probability: 80, icon: "💎", color: "#00BCD4" },
            { name: "超级跑车", value: 96000, probability: 15, icon: "🏎️", color: "#FF5722" },
            { name: "比心兔兔", value: 280000, probability: 3, icon: "🐰💖", color: "#E91E63" },
            { name: "热气球", value: 720000, probability: 1.84, icon: "🎈", color: "#9C27B0" },
            { name: "嘉年华", value: 2000000, probability: 0.15, icon: "🎪", color: "#00BCD4" },
            { name: "星际战舰", value: 4800000, probability: 0.01, icon: "🚀", color: "#673AB7" }
        ]},
        { id: 4, name: "梦幻盲盒", price: 100000, gifts: [
            { name: "梦幻水晶", value: 64000, probability: 80, icon: "🔮", color: "#E040FB" },
            { name: "彩虹礼花", value: 160000, probability: 15, icon: "🌈", color: "#FFC107" },
            { name: "热气球", value: 480000, probability: 3, icon: "🎈", color: "#9C27B0" },
            { name: "嘉年华", value: 1600000, probability: 1.84, icon: "🎪", color: "#00BCD4" },
            { name: "梦幻城堡", value: 4000000, probability: 0.15, icon: "🏰", color: "#9C27B0" },
            { name: "龙腾祥云", value: 9600000, probability: 0.01, icon: "🐉", color: "#FF9800" }
        ]},
        { id: 5, name: "至尊盲盒", price: 250000, gifts: [
            { name: "至尊礼包", value: 120000, probability: 80, icon: "👑", color: "#FFD700" },
            { name: "豪华跑车", value: 400000, probability: 15, icon: "🏎️", color: "#FF5722" },
            { name: "嘉年华", value: 1440000, probability: 3, icon: "🎪", color: "#00BCD4" },
            { name: "梦幻城堡", value: 3600000, probability: 1.84, icon: "🏰", color: "#9C27B0" },
            { name: "龙腾祥云", value: 8000000, probability: 0.15, icon: "🐉", color: "#FF9800" },
            { name: "凤舞九天", value: 20000000, probability: 0.01, icon: "🦚", color: "#E91E63" }
        ]},
        { id: 6, name: "帝王盲盒", price: 500000, gifts: [
            { name: "帝王之冠", value: 240000, probability: 80, icon: "👑", color: "#FFD700" },
            { name: "嘉年华", value: 1200000, probability: 15, icon: "🎪", color: "#00BCD4" },
            { name: "梦幻城堡", value: 3200000, probability: 3, icon: "🏰", color: "#9C27B0" },
            { name: "龙腾祥云", value: 7200000, probability: 1.84, icon: "🐉", color: "#FF9800" },
            { name: "凤舞九天", value: 17600000, probability: 0.15, icon: "🦚", color: "#E91E63" },
            { name: "星河传说", value: 44000000, probability: 0.01, icon: "🌌", color: "#2196F3" }
        ]},
        { id: 7, name: "传说盲盒", price: 1000000, gifts: [
            { name: "传说之证", value: 400000, probability: 80, icon: "📜", color: "#FFD700" },
            { name: "梦幻城堡", value: 2800000, probability: 15, icon: "🏰", color: "#9C27B0" },
            { name: "龙腾祥云", value: 6400000, probability: 3, icon: "🐉", color: "#FF9800" },
            { name: "凤舞九天", value: 16000000, probability: 1.84, icon: "🦚", color: "#E91E63" },
            { name: "星河传说", value: 40000000, probability: 0.15, icon: "🌌", color: "#2196F3" },
            { name: "创世神光", value: 96000000, probability: 0.01, icon: "✨", color: "#E040FB" }
        ]},
        { id: 8, name: "史诗盲盒", price: 2500000, gifts: [
            { name: "史诗宝箱", value: 640000, probability: 80, icon: "📦", color: "#9C27B0" },
            { name: "龙腾祥云", value: 5600000, probability: 15, icon: "🐉", color: "#FF9800" },
            { name: "凤舞九天", value: 14400000, probability: 3, icon: "🦚", color: "#E91E63" },
            { name: "星河传说", value: 36000000, probability: 1.84, icon: "🌌", color: "#2196F3" },
            { name: "创世神光", value: 80000000, probability: 0.15, icon: "✨", color: "#E040FB" },
            { name: "永恒至尊", value: 224000000, probability: 0.01, icon: "🌟", color: "#FFD700" }
        ]},
        { id: 9, name: "星河盲盒", price: 5000000, gifts: [
            { name: "星河碎片", value: 960000, probability: 80, icon: "🌌", color: "#2196F3" },
            { name: "凤舞九天", value: 12800000, probability: 15, icon: "🦚", color: "#E91E63" },
            { name: "星河传说", value: 32000000, probability: 3, icon: "🌌", color: "#2196F3" },
            { name: "创世神光", value: 72000000, probability: 1.84, icon: "✨", color: "#E040FB" },
            { name: "永恒至尊", value: 200000000, probability: 0.15, icon: "🌟", color: "#FFD700" },
            { name: "虚空神话", value: 480000000, probability: 0.01, icon: "🌀", color: "#00BCD4" }
        ]},
        { id: 10, name: "嘉年华盲盒", price: 10000000, gifts: [
            { name: "嘉年华礼包", value: 1600000, probability: 80, icon: "🎪", color: "#00BCD4" },
            { name: "创世神光", value: 64000000, probability: 15, icon: "✨", color: "#E040FB" },
            { name: "永恒至尊", value: 176000000, probability: 3, icon: "🌟", color: "#FFD700" },
            { name: "虚空神话", value: 440000000, probability: 1.84, icon: "🌀", color: "#00BCD4" },
            { name: "全服唯一", value: 960000000, probability: 0.15, icon: "💫", color: "#FFD700" },
            { name: "神话降临", value: 2240000000, probability: 0.01, icon: "👼", color: "#E040FB" }
        ]}
    ]
};

// 打开盲盒宝箱入口界面，填充档位下拉
function openGiftBox() {
    document.getElementById('giftBoxModal').style.display = 'flex';
    resetGiftBox();
    var sel = document.getElementById('giftBoxTierSelect');
    if (sel && !sel.options.length) {
        giftBoxSystem.boxTiers.forEach(function(t) {
            var opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name + ' (' + (t.price >= 1e6 ? (t.price/1e6)+'M' : t.price.toLocaleString()) + '✨)';
            sel.appendChild(opt);
        });
    }
    updateGiftBoxTierButton();
}

// 切换盲盒档位时更新按钮、价格、以及当前档位奖励列表
function updateGiftBoxTierButton() {
    var sel = document.getElementById('giftBoxTierSelect');
    var priceEl = document.getElementById('giftBoxTierPrice');
    var btn = document.getElementById('drawGiftBtn');
    if (!sel || !priceEl || !btn) return;
    var id = parseInt(sel.value, 10);
    var tier = giftBoxSystem.boxTiers.find(function(t) { return t.id === id; });
    if (tier) {
        priceEl.textContent = tier.price >= 1e6 ? (tier.price/1e6) + 'M✨' : tier.price.toLocaleString() + '✨';
        btn.textContent = '开启盲盒 (' + (tier.price >= 1e6 ? (tier.price/1e6)+'M' : tier.price.toLocaleString()) + '✨)';
        refreshGiftBoxTierRewards(tier);
    }
}

// 根据选中档位刷新「当前盲盒奖励」列表
function refreshGiftBoxTierRewards(tier) {
    var titleEl = document.getElementById('giftBoxTierRewardsTitle');
    var container = document.getElementById('giftBoxTierRewards');
    if (!container || !tier || !tier.gifts) return;
    if (titleEl) titleEl.textContent = '【' + tier.name + '】奖励';
    container.innerHTML = '';
    tier.gifts.forEach(function(g) {
        var div = document.createElement('div');
        div.innerHTML = '<span style="color:' + (g.color || '#fff') + '">' + g.icon + ' ' + g.name + ':</span> ' + g.probability + '% (' + (g.value >= 1e6 ? (g.value/1e6)+'M' : g.value.toLocaleString()) + ')';
        container.appendChild(div);
    });
}

// 关闭盲盒宝箱界面
function closeGiftBox() {
    document.getElementById('giftBoxModal').style.display = 'none';
}

// 重置盲盒显示
function resetGiftBox() {
    const boxInner = document.getElementById('boxInner');
    boxInner.style.transform = 'rotateY(0deg)';
    
    document.getElementById('giftIcon').textContent = '🎁';
    document.getElementById('giftName').textContent = '未知礼物';
    document.getElementById('giftValue').textContent = '价值: 0 玫瑰花';
}

// 抽取礼物（按当前选中的盲盒档位扣费与倍率）
function drawGift() {
    var sel = document.getElementById('giftBoxTierSelect');
    var tierId = sel ? parseInt(sel.value, 10) : 0;
    var tier = giftBoxSystem.boxTiers.find(function(t) { return t.id === tierId; }) || giftBoxSystem.boxTiers[0];
    var cost = tier.price;
    if (player.nightClub.starCoins < cost) {
        logAction("星币不足！需要 " + cost.toLocaleString() + "✨", "error");
        return;
    }
    
    player.nightClub.starCoins -= cost;
    
    var gifts = tier.gifts || [];
    if (!gifts.length) { logAction("该盲盒暂无奖励配置", "error"); player.nightClub.starCoins += cost; return; }
    var totalProbability = gifts.reduce(function(sum, g) { return sum + g.probability; }, 0);
    var random = Math.random() * totalProbability;
    var cumulative = 0;
    var selectedGift = null;
    for (var i = 0; i < gifts.length; i++) {
        cumulative += gifts[i].probability;
        if (random <= cumulative) {
            selectedGift = gifts[i];
            break;
        }
    }
    if (!selectedGift) selectedGift = gifts[0];
    
    var ls = player.liveStream;
    var theme = liveStreamSystem.themes.find(function(t) { return t.id === (ls.currentTheme || 0); }) || liveStreamSystem.themes[0];
    var amount = Math.floor(selectedGift.value * (theme.earnMult || 1));
    const now = Date.now();
    if (ls.lastGiftTime && (now - ls.lastGiftTime) < 8000 && ls.lastGiftType === selectedGift.name) {
        ls.giftCombo = (ls.giftCombo || 0) + 1;
        amount = Math.floor(amount * (1 + ls.giftCombo * 0.1));
        addDanmakuMessageq("系统", `🔥 盲盒${ls.giftCombo}连击！加成+${ls.giftCombo*10}%！`, "donation");
    } else { ls.giftCombo = 1; }
    ls.lastGiftTime = now; ls.lastGiftType = selectedGift.name;
    ls.heat = Math.min(100, (ls.heat || 0) + 5);
    amount = Math.floor(amount * (1 + (ls.heat || 0) * 0.005));
    ls.totalEarnings += amount;
    ls.donationHistory.push({ viewer: "主播自己", amount: amount, message: `获得${selectedGift.name}`, time: Date.now() });
    if (ls.donationHistory.length > 100) ls.donationHistory = ls.donationHistory.slice(-100);
    checkLiveAchievements();
    
    showGiftResult(selectedGift, amount);
    
    addDanmakuMessageq("系统", "恭喜主播从【" + tier.name + "】中抽到了" + selectedGift.name, "system");
    
    updateLiveStreamUI();
    updateDisplay();
    
    logAction("开启【" + tier.name + "】获得" + selectedGift.name + "，价值" + amount.toLocaleString() + "朵玫瑰花", "success");
}

// 显示礼物结果（actualValue 为实际获得的玫瑰花数，可选）
function showGiftResult(gift, actualValue) {
    var boxInner = document.getElementById('boxInner');
    var giftIcon = document.getElementById('giftIcon');
    var giftName = document.getElementById('giftName');
    var giftValue = document.getElementById('giftValue');
    
    giftIcon.textContent = gift.icon;
    giftName.textContent = gift.name;
    giftName.style.color = gift.color;
    giftValue.textContent = "价值: " + (actualValue != null ? actualValue.toLocaleString() : gift.value.toLocaleString()) + " 玫瑰花";
    
    // 添加动画效果
    boxInner.style.transform = 'rotateY(180deg)';
    
    // 添加粒子效果
    createParticles();
}

// 创建粒子效果
function createParticles() {
    const giftBox = document.getElementById('giftBox');
    const colors = ['#ff9966', '#ff5e62', '#ffcc00', '#4CAF50', '#2196F3'];
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.zIndex = '10';
        
        // 随机位置
        const posX = Math.random() * 200;
        const posY = Math.random() * 200;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        
        giftBox.appendChild(particle);
        
        // 动画效果
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const duration = 1000 + Math.random() * 500;
        
        particle.animate(
            [
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
            ],
            {
                duration: duration,
                easing: 'ease-out'
            }
        ).onfinish = () => {
            particle.remove();
        };
    }
}



const worldZones = [
    {
        id: 'beginner',
        name: '新手村',
        minLevel: 1,
        maxLevel: 49,
        expRange: [1, 10],
        monsterNames: ['小妖', '小怪', '小兽', '小魔', '小精', '小灵', '小魂', '小魄'],
        modifiers: [
            { name: '普通', health: 1.0, attack: 2.0 },
            { name: '强壮', health: 1.5, attack: 3.2 },
            { name: '野蛮', health: 2.2, attack: 2.5 },
            { name: '弱小', health: 0.5, attack: 0.2 },
            { name: '强大', health: 5.2, attack: 5.5 },
            { name: '影子', health: 3.5, attack: 2.2 },
            { name: '敏捷', health: 2.2, attack: 10.5 },
            { name: '狂暴', health: 1.3, attack: 11.8 }
        ]
    },
    {
        id: 'forest',
        name: '落木林',
        minLevel: 50,
        maxLevel: 99,
        expRange: [10, 25],
        monsterNames: ['树妖', '木精', '叶魔', '根魂', '枝魄', '森灵', '林怪', '藤妖'],
        modifiers: [
            { name: '剧毒', health: 3.2, attack: 1.8 },
            { name: '缠绕', health: 5.8, attack: 31.2 },
            { name: '吸血', health: 7.5, attack: 5.5 },
            { name: '邪恶', health: 23.8, attack: 3.2 },
            { name: '幽魂', health: 6.5, attack: 7.5 },
            { name: '火焰', health: 7.8, attack: 8.2 },
            { name: '冰霜', health: 9.5, attack: 13.5 },   
            { name: '雷霆', health: 10.8, attack: 23.2 },
            { name: '闪电', health: 5.5, attack: 5.5 },
            { name: '再生', health: 7.0, attack: 1.0 }
            
        ]
    },
    {
        id: 'plains',
        name: '青风平原',
        minLevel: 100,
        maxLevel: 149,
        expRange: [25, 50],
        monsterNames: ['风灵', '草妖', '石魔', '土魂', '沙魄', '云精', '雾怪', '雨灵'],
        modifiers: [
            { name: '疾风', health: 21.0, attack: 12.0 },
            { name: '厚土', health: 12.0, attack: 13.0 },
            { name: '飞沙', health: 11.5, attack: 15.8 },
            { name: '风暴', health: 21.0, attack: 18.0 },
            { name: '流沙', health: 12.0, attack: 11.0 },
            { name: '魅影', health: 21.5, attack: 21.8 },
            { name: '龙卷风', health: 21.0, attack: 32.0 },
            { name: '法师', health: 12.0, attack: 41.0 },
            { name: '刺客', health: 12.5, attack: 51.8 },
            { name: '迷雾', health: 15.8, attack: 21.5 }

        ]
    },
    {
        id: 'swamp',
        name: '迷雾沼泽',
        minLevel: 150,
        maxLevel: 199,
        expRange: [50, 100],
        monsterNames: ['沼魔', '泥妖', '水精', '雾魂', '毒魄', '瘴灵', '腐怪', '湿妖'],
        modifiers: [
            { name: '剧毒', health: 10.5, attack: 20.0 },
            { name: '腐蚀', health: 20.0, attack: 10.8 },
            { name: '减速', health: 104.8, attack: 10.5 },
            { name: '灼烧', health: 10.5, attack: 70.0 },
            { name: '冰冻', health: 20.0, attack: 80.8 },
            { name: '野蛮', health: 100.8, attack: 380.5 },
            { name: '毒粉', health: 10.5, attack: 250.0 },
            { name: '妖化', health: 20.0, attack: 140.8 },
            { name: '电王', health: 140.8, attack: 130.5 },
            { name: '致盲', health: 100.5, attack: 200.2 }
        ]
    },
    {
        id: 'nest',
        name: '剧毒巢穴',
        minLevel: 200,
        maxLevel: 249,
        expRange: [100, 250],
        monsterNames: ['毒蛛', '蝎魔', '蛇妖', '蜈蚣精', '蟾蜍怪', '蜂后', '蚁王', '蝇魔'],
        modifiers: [
            { name: '致命毒液', health: 10.8, attack: 52.5 },
            { name: '麻痹毒素', health: 280.0, attack: 172.0 },
            { name: '神经毒素', health: 180.5, attack: 113.0 },
            { name: '灵魂毒液', health: 30.8, attack: 412.5 },
            { name: '肉体毒素', health: 280.0, attack: 221.0 },
            { name: '轻微毒素', health: 20.5, attack: 433.0 },
            { name: '智障毒液', health: 10.8, attack: 302.5 },
            { name: '雷雨毒素', health: 23.0, attack: 602.0 },
            { name: '闪电毒素', health: 101.5, attack: 333.0 },
            { name: '腐蚀酸液', health: 87.5, attack: 702.2 }
        ]
    },
    {
        id: 'wetland',
        name: '浅滩湿地',
        minLevel: 250,
        maxLevel: 299,
        expRange: [250, 500],
        monsterNames: ['水妖', '泽魔', '滩魂', '湿魄', '藻精', '贝怪', '蟹灵', '虾妖'],
        modifiers: [
            { name: '水之护盾', health: 32.0, attack: 12.5 },
            { name: '潮汐之力', health: 11.8, attack: 52.8 },
            { name: '深海恐惧', health: 21.5, attack: 23.5 },
            { name: '水之战舰', health: 341.0, attack: 123.5 },
            { name: '潮汐冰箭', health: 11.8, attack: 312.8 },
            { name: '深海咆哮', health: 21.5, attack: 232.5 },
            { name: '水王', health: 53.0, attack: 791.5 },
            { name: '水皇', health: 551.8, attack: 552.8 },
            { name: '水尊', health: 288.5, attack: 882.5 },
            { name: '漩涡牵引', health: 26.0, attack: 356.0 }
        ]
    },
    {
        id: 'canyon',
        name: '黑风峡谷',
        minLevel: 300,
        maxLevel: 349,
        expRange: [500, 1000],
        monsterNames: ['岩魔', '石怪', '山精', '谷魂', '崖魄', '壁妖', '穴灵', '洞魔'],
        modifiers: [
            { name: '岩甲', health: 40.0, attack: 100.8 },
            { name: '落石', health: 20.5, attack: 300.0 },
            { name: '地震', health: 30.5, attack: 200.8 },
            { name: '石小妖', health: 2.0, attack: 10.8 },
            { name: '石头怪', health: 20.5, attack: 30.0 },
            { name: '石帝', health: 30.5, attack: 310.8 },
            { name: '石妖', health: 100.0, attack: 120.8 },
            { name: '石王', health: 20.5, attack: 300.0 },
            { name: '石皇', health: 200.5, attack: 200.8 },
            { name: '山崩', health: 200.0, attack: 300.5 }
        ]
    },
    {
        id: 'swamp2',
        name: '迷雾沼泽深处',
        minLevel: 350,
        maxLevel: 399,
        expRange: [1000, 2500],
        monsterNames: ['沼王', '泥后', '水帝', '雾皇', '毒尊', '瘴圣', '腐神', '湿魔'],
        modifiers: [
            { name: '剧毒领域', health: 100.0, attack: 400.0 },
            { name: '腐蚀领域', health: 20.0, attack: 300.5 },
            { name: '迷雾领域', health: 30.5, attack: 200.5 },
            { name: '氧化领域', health: 30.0, attack: 400.0 },
            { name: '腐闪领域', health: 40.0, attack: 300.5 },
            { name: '蜂石领域', health: 30.5, attack: 800.5 },
            { name: '恶徒领域', health: 30.0, attack: 400.0 },
            { name: '螣神领域', health: 40.0, attack: 100.5 },
            { name: '山峰领域', health: 30.5, attack: 300.5 },
            { name: '死亡领域', health: 100.0, attack: 500.0 }
        ]
    },
    {
        id: 'abyss',
        name: '暗影深渊',
        minLevel: 400,
        maxLevel: 449,
        expRange: [2500, 5000],
        monsterNames: ['影魔', '暗妖', '渊魂', '冥魄', '夜精', '幽怪', '鬼灵', '魅魔'],
        modifiers: [
            { name: '暗影突袭', health: 30.5, attack: 700.0 },
            { name: '深渊凝视', health: 150.0, attack: 310.0 },
            { name: '虚空吞噬', health: 140.5, attack: 450.8 },
            { name: '时间回溯', health: 230.5, attack: 500.0 },
            { name: '精神屏障', health: 50.0, attack: 300.0 },
            { name: '晶体穿刺', health: 210.5, attack: 100.8 },
            { name: '空间封锁', health: 100.5, attack: 200.0 },
            { name: '声波共振', health: 50.0, attack: 200.0 },
            { name: '精神链接', health: 30.5, attack: 400.8 },
            { name: '永夜降临', health: 200.0, attack: 600.0 }
        ]
    },
    {
        id: 'rift',
        name: '混沌之隙',
        minLevel: 450,
        maxLevel: 499,
        expRange: [5000, 10000],
        monsterNames: ['混沌兽', '无序魔', '混乱妖', '虚空精', '扭曲魂', '裂痕魄', '次元怪', '位面灵'],
        modifiers: [
            { name: '混沌护盾', health: 80.0, attack: 500.0 },
            { name: '空间撕裂', health: 50.5, attack: 800.0 },
            { name: '时间扭曲', health: 70.0, attack: 700.0 },
            { name: '时间停滞', health: 200.0, attack: 500.0 },
            { name: '空间暗影', health: 100.5, attack: 100.0 },
            { name: '时间风暴', health: 70.0, attack: 200.0 },
            { name: '维度停滞', health: 20.0, attack: 500.0 },
            { name: '暗影风暴', health: 200.5, attack: 200.0 },
            { name: '混沌风暴', health: 70.0, attack: 700.0 },
            { name: '位面崩塌', health: 100.0, attack: 100.0 }
        ]
    },
    {
        id: 'battlefield',
        name: '血狱战场',
        minLevel: 500,
        maxLevel: 549,
        expRange: [10000, 15000],
        monsterNames: ['血魔', '狱妖', '战魂', '争魄', '杀精', '戮怪', '伐灵', '征魔'],
        modifiers: [
            { name: '嗜血', health: 400.0, attack: 10000.0 },
            { name: '狂战', health: 80.0, attack: 8000.0 },
            { name: '不屈', health: 10.0, attack: 5000.0 },
            { name: '血族', health: 300.0, attack: 10000.0 },
            { name: '狂战族', health: 50.0, attack: 3000.0 },
            { name: '不屈族', health: 150.0, attack: 2000.0 },
            { name: '嗜血族', health: 600.0, attack: 10000.0 },
            { name: '狂战血脉', health: 500.0, attack: 1800.0 },
            { name: '不屈血脉', health: 150.0, attack: 1500.0 },
            { name: '死战', health: 530.0, attack: 15000.0 }
        ]
    },
    {
        id: 'lair',
        name: '恶魔巢穴',
        minLevel: 550,
        maxLevel: 599,
        expRange: [15000, 25000],
        monsterNames: ['恶魔领主', '深渊魔王', '地狱公爵', '炼狱侯爵', '邪能伯爵', '堕落子爵', '腐化男爵', '扭曲骑士'],
        modifiers: [
            { name: '恶魔之怒', health: 100.0, attack: 3500.0 },
            { name: '深渊之力', health: 20.0, attack: 8200.0 },
            { name: '炼狱之力', health: 120.0, attack: 18000.0 },
            { name: '恶魔之力', health: 130.0, attack: 1500.0 },
            { name: '夜魔之力', health: 30.0, attack: 1200.0 },
            { name: '地狱之力', health: 120.0, attack: 18000.0 },
            { name: '魔神之力', health: 10.0, attack: 15000.0 },
            { name: '深渊核心', health: 110.0, attack: 12000.0 },
            { name: '地火核心', health: 120.0, attack: 1800.0 },
            { name: '邪能腐蚀', health: 480.0, attack: 38000.0 }
        ]
    },
    {
        id: 'throne',
        name: '冰封王座',
        minLevel: 600,
        maxLevel: 649,
        expRange: [25000, 50000],
        monsterNames: ['冰霜巨龙', '寒冰巫妖', '极地巨人', '雪域女王', '冰川领主', '冻土之王', '永冬守卫', '霜寒使者'],
        modifiers: [
            { name: '绝对零度', health: 20.0, attack: 1200.0 },
            { name: '冰封领域', health: 100.0, attack: 7000.0 },
            { name: '霜冻新星', health: 20.0, attack: 1300.0 },
            { name: '零度之力', health: 20.0, attack: 4800.0 },
            { name: '封神领域', health: 320.0, attack: 10000.0 },
            { name: '霜冻之力', health: 10.0, attack: 800.0 },
            { name: '霜寒死神', health: 200.0, attack: 3200.0 },
            { name: '冰封之力', health: 30.0, attack: 2200.0 },
            { name: '灵魂深王', health: 250.0, attack: 13020.0 },
            { name: '寒冰牢笼', health: 550.0, attack: 45000.0 }
        ]
    },
    {
        id: 'wasteland',
        name: '血月荒原',
        minLevel: 650,
        maxLevel: 699,
        expRange: [50000, 100000],
        monsterNames: ['血月狼王', '赤红巨蝎', '绯色狮鹫', '猩红飞龙', '朱红泰坦', '深红梦魇', '鲜红收割者', '暗红破坏神'],
        modifiers: [
            { name: '血月之力', health: 400.0, attack: 5000.0 },
            { name: '猩红狂暴', health: 90.0, attack: 7200.0 },
            { name: '赤红领域', health: 300.0, attack: 4400.0 },
            { name: '血月暗魔', health: 400.0, attack: 2000.0 },
            { name: '猩红之力', health: 70.0, attack: 31000.0 },
            { name: '血族领域', health: 61.0, attack: 14000.0 },
            { name: '血月战刃', health: 30.0, attack: 25000.0 },
            { name: '收割者领域', health: 40.0, attack: 5000.0 },
            { name: '梦魇领域', health: 69.0, attack: 41000.0 },
            { name: '深红诅咒', health: 390.0, attack: 60000.0 }
        ]
    },
    {
        id: 'ruins',
        name: '时空废墟',
        minLevel: 700,
        maxLevel: 749,
        expRange: [100000, 500000],
        monsterNames: ['时空守护者', '裂隙观察者', '维度旅行者', '位面穿梭者', '虚空漫步者', '次元监察者', '宇宙编织者', '现实扭曲者'],
        modifiers: [
            { name: '时间加速', health: 20.0, attack: 8000.0 },
            { name: '空间折叠', health: 280.0, attack: 7000.0 },
            { name: '维度撕裂', health: 190.0, attack: 4000.0 },
            { name: '量子隐身', health: 70.0, attack: 81000.0 },
            { name: '时间碎片', health: 380.0, attack: 23000.0 },
            { name: '维度错位', health: 90.0, attack: 18000.0 },
            { name: '中子星脉冲', health: 70.0, attack: 20000.0 },
            { name: '时间分流', health: 80.0, attack: 30000.0 },
            { name: '超声波攻击', health: 400.0, attack: 50000.0 },
            { name: '现实重构', health: 600.0, attack: 100000.0 }
        ]
    },
    {
        id: 'land',
        name: '星陨之地',
        minLevel: 750,
        maxLevel: 799,
        expRange: [500000, 1000000],
        monsterNames: ['星陨巨兽', '陨石领主', '彗星使者', '流星猎人', '行星吞噬者', '恒星毁灭者', '星系守护者', '宇宙创造者'],
        modifiers: [
            { name: '星辰坠落', health: 150.0, attack: 5800.0 },
            { name: '黑洞吞噬', health: 20.0, attack: 25000.0 },
            { name: '超新星爆发', health: 180.0, attack: 53000.0 },
            { name: '星辰碰撞', health: 150.0, attack: 70100.0 },
            { name: '流星吞噬', health: 200.0, attack: 15000.0 },
            { name: '毁灭爆发', health: 18.0, attack: 30000.0 },
            { name: '星辰爆炸', health: 150.0, attack: 80000.0 },
            { name: '银河吞噬', health: 200.0, attack: 45000.0 },
            { name: '超新爆风', health: 180.0, attack: 220000.0 },
            { name: '宇宙大爆炸', health: 700.0, attack: 300000.0 }
        ]
    },
    {
        id: 'temple',
        name: '永恒圣殿',
        minLevel: 800,
        maxLevel: 849,
        expRange: [1000000, 5000000],
        monsterNames: ['圣殿守卫', '永恒骑士', '不朽祭司', '神圣主教', '天界大天使', '神域审判者', '至高仲裁者', '创世神使'],
        modifiers: [
            { name: '神圣庇护', health: 50.0, attack: 10000.0 },
            { name: '永恒之光', health: 140.0, attack: 30100.0 },
            { name: '神之裁决', health: 310.0, attack: 151000.0 },
            { name: '神圣打击', health: 520.0, attack: 301020.0 },
            { name: '神圣之光', health: 240.0, attack: 60200.0 },
            { name: '神之神剑', health: 600.0, attack: 51000.0 },
            { name: '神圣护盾', health: 450.0, attack: 440000.0 },
            { name: '神王护体', health: 240.0, attack: 360000.0 },
            { name: '神尊破灭', health: 160.0, attack: 252000.0 },
            { name: '创世之力', health: 1000.0, attack: 800000.0 }
        ]
    },
    {
        id: 'realm',
        name: '万象界域',
        minLevel: 850,
        maxLevel: 899,
        expRange: [5000000, 10000000],
        monsterNames: ['万象之主', '元素皇帝', '法则掌控者', '秩序守护神', '混沌化身', '虚空君主', '位面主宰', '多元宇宙观察者'],
        modifiers: [
            { name: '元素风暴', health: 130.0, attack: 42000.0 },
            { name: '法则扭曲', health: 750.0, attack: 80000.0 },
            { name: '秩序崩坏', health: 420.0, attack: 65000.0 },
            { name: '元素至尊', health: 300.0, attack: 92000.0 },
            { name: '法则至尊', health: 280.0, attack: 100000.0 },
            { name: '秩序至尊', health: 240.0, attack: 250000.0 },
            { name: '万象至尊', health: 400.0, attack: 320000.0 },
            { name: '混沌至尊', health: 430.0, attack: 400000.0 },
            { name: '位面至尊', health: 320.0, attack: 750000.0 },
            { name: '混沌初开', health: 1000.0, attack: 1000000.0 }
        ]
    },
    {
        id: 'realm2',
        name: '鸿蒙秘境',
        minLevel: 900,
        maxLevel: 949,
        expRange: [10000000, 50000000],
        monsterNames: ['鸿蒙巨兽', '太初古神', '元始天尊', '造化之主', '命运编织者', '因果律者', '真理守护者', '终极观察者'],
        modifiers: [
            { name: '鸿蒙初开', health: 500.0, attack: 1100000.0 },
            { name: '太初之力', health: 700.0, attack: 2400000.0 },
            { name: '造化神功', health: 200.0, attack: 1100000.0 },
            { name: '鸿蒙尊者', health: 100.0, attack: 2050000.0 },
            { name: '太初尊者', health: 700.0, attack: 3020000.0 },
            { name: '未来尊者', health: 80.0, attack: 4001000.0 },
            { name: '命运尊者', health: 200.0, attack: 6000000.0 },
            { name: '太古尊者', health: 70.0, attack: 3000000.0 },
            { name: '九亥古神', health: 200.0, attack: 7000000.0 },
            { name: '终极真理', health: 1000.0, attack: 10000000.0 }
        ]
    },
    {
        id: 'domain',
        name: '终焉神域',
        minLevel: 950,
        maxLevel: 1000,
        expRange: [50000000, 100000000],
        monsterNames: ['终焉之主', '灭世魔神', '创世之神', '永恒终结者', '无限吞噬者', '绝对虚无', '最终答案', '一切之终'],
        modifiers: [
            { name: '终焉降临', health: 20.0, attack: 5000000.0 },
            { name: '灭世之力', health: 80.0, attack: 12000000.0 },
            { name: '创世之力', health: 20.0, attack: 8000000.0 },
            { name: '终焉之力', health: 240.0, attack: 27000000.0 },
            { name: '永恒之力', health: 310.0, attack: 12000000.0 },
            { name: '无限之力', health: 120.0, attack: 6000000.0 },
            { name: '绝对之力', health: 300.0, attack: 24000000.0 },
            { name: '灭世之力', health: 700.0, attack: 4200000.0 },
            { name: '灰烬之力', health: 550.0, attack: 20100000.0 },
            { name: '绝对虚无', health: 1000.0, attack: 50000000.0 }
        ]
    }
];
const dimensionConfig = {
    1: { cost: 1, expMultiplier: 1, healthMultiplier: 1, attackMultiplier: 1, name: "次元1", ascentionRequired: 0 },
    2: { cost: 3, expMultiplier: 5, healthMultiplier: 1e10, attackMultiplier: 100000, name: "次元2", ascentionRequired: 1 },
    3: { cost: 5, expMultiplier: 10, healthMultiplier: 1e20, attackMultiplier: 1e10, name: "次元3", ascentionRequired: 2 },
    4: { cost: 25, expMultiplier: 50, healthMultiplier: 1e40, attackMultiplier: 1e20, name: "次元4", ascentionRequired: 3 },
    5: { cost: 50, expMultiplier: 100, healthMultiplier: 1e60, attackMultiplier: 1e30, name: "次元5", ascentionRequired: 4 },
    6: { cost: 100, expMultiplier: 200, healthMultiplier: 1e80, attackMultiplier: 1e40, name: "次元6", ascentionRequired: 6 },
    7: { cost: 250, expMultiplier: 500, healthMultiplier: 1e100, attackMultiplier: 1e50, name: "次元7", ascentionRequired: 8 },
    8: { cost: 500, expMultiplier: 1000, healthMultiplier: 1e120, attackMultiplier: 1e60, name: "次元8", ascentionRequired: 10 },
    9: { cost: 1000, expMultiplier: 6000, healthMultiplier: 1e140, attackMultiplier: 1e70, name: "次元9", ascentionRequired: 13 },
    10: { cost: 2500, expMultiplier: 15000, healthMultiplier: 1e160, attackMultiplier: 1e80, name: "次元10", ascentionRequired: 17 },
    11: { cost: 5000, expMultiplier: 30000, healthMultiplier: 1e180, attackMultiplier: 1e90, name: "次元11", ascentionRequired: 21 },
    12: { cost: 10000, expMultiplier: 60000, healthMultiplier: 1e200, attackMultiplier: 1e100, name: "次元12", ascentionRequired: 25 },
    13: { cost: 25000, expMultiplier: 150000, healthMultiplier: 1e220, attackMultiplier: 1e110, name: "次元13", ascentionRequired: 29 },
    14: { cost: 50000, expMultiplier: 300000, healthMultiplier: 1e240, attackMultiplier: 1e120, name: "次元14", ascentionRequired: 33 },
    15: { cost: 100000, expMultiplier: 600000, healthMultiplier: 1e260, attackMultiplier: 1e130, name: "次元15", ascentionRequired: 37 }
};
// loadSave 在脚本前部执行时 dimensionConfig 尚未初始化，读档后延迟恢复世界地图自动战斗
setTimeout(function() {
    try {
        if (typeof resumeWorldMapAutoBattleIfNeeded === 'function') resumeWorldMapAutoBattleIfNeeded();
    } catch (e) { /* ignore */ }
}, 0);

        // 切换次元难度
      function changeDimension(level) {
    const config = dimensionConfig[level];
    
    // 检查轮回转生次数要求
    if (player.level.ascentionCounta < config.ascentionRequired) {
        logAction(`进入${config.name}需要轮回${config.ascentionRequired}转！当前轮回${player.level.ascentionCounta}转`, "error");
        return;
    }
    
    player.dimensionLevel = level;
    updateDimensionUI();
    // 同步刷新右侧区域卡片（否则“次元倍数”不会立刻变化）
    const ui = document.getElementById('worldMapUI');
    if (ui && ui.style.display === 'block') {
        updateWorldMapUI();
    }
    saveGame();
    logAction(`已切换到${config.name}`, "success");
}

// 修改更新次元难度UI显示函数
function updateDimensionUI() {
    // 更新按钮激活状态和可用性
    document.querySelectorAll('.dimension-btn').forEach((btn, index) => {
        const level = index + 1;
        const config = dimensionConfig[level];
        const canAccess = player.level.ascentionCounta >= config.ascentionRequired;
        
        if (level === player.dimensionLevel) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        // 根据是否可访问设置按钮样式
        if (!canAccess) {
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            btn.title = `需要轮回${config.ascentionRequired}转`;
        } else {
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.title = '';
        }
    });
    
    // 更新难度信息
    const config = dimensionConfig[player.dimensionLevel];
    document.getElementById('currentDimension').textContent = config.name;
    document.getElementById('dimensionCost').textContent = config.cost;
    document.getElementById('dimensionExpMultiplier').textContent = config.expMultiplier;
    document.getElementById('dimensionAttackMultiplier').textContent = config.attackMultiplier.toExponential(1);
    
    // 显示轮回转生要求
    const infoEl =
        document.querySelector('#worldMapUI .dimension-info') ||
        document.querySelector('.dimension-info');
    if (infoEl) {
        infoEl.innerHTML = `
            当前难度: <span id="currentDimension">${config.name}</span><br>
            轮回要求: ${config.ascentionRequired}转<br>
            星币消耗: <span id="dimensionCost">${config.cost}</span><br>
            经验倍数: <span id="dimensionExpMultiplier">${config.expMultiplier}</span>倍<br>
            怪物生命: <span id="dimensionHealthMultiplier">${config.healthMultiplier || 1}</span>倍<br>
            怪物攻击: <span id="dimensionAttackMultiplier">${config.attackMultiplier.toExponential(1)}</span>倍
        `;
    }
}
/** 世界地图自动战斗间隔（前台/后台统一） */
var WORLD_MAP_AUTO_BATTLE_TICK_MS = 1000;

// 切换世界地图界面
function toggleWorldMap() {
    if (player.reincarnationCount < 50) {
        alert("需要达到50转才能开启世界地图！");
        return;
    }
    
    const overlay = document.getElementById('worldMapOverlay');
    const ui = document.getElementById('worldMapUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        if (player.worldMapBattle && player.worldMapBattle.autoBattle) {
            player.worldMapBattle.autoBattle = false;
            updateWorldMapAutoBattleStatusUI();
            stopAllWorldMapBattles();
            window._worldMapBattleHiddenAt = 0;
            logAction('已进入世界地图，自动战斗已关闭', 'info');
        }
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateDimensionUI();
        updateWorldMapUI();
    }
}
/** 从指定 player 上注销世界地图战斗定时器（读档替换 player 前使用） */
function detachWorldMapAutoBattleTimersFromPlayer(p) {
    if (!p) return;
    if (p.worldMapBattle && p.worldMapBattle.autoBattleInterval != null) {
        var fg = p.worldMapBattle.autoBattleInterval;
        if (typeof unregisterInterval === 'function') unregisterInterval(fg);
        else try { clearInterval(fg); } catch (e) {}
        p.worldMapBattle.autoBattleInterval = null;
    }
    if (p.backgroundBattle && p.backgroundBattle.interval != null) {
        var bg = p.backgroundBattle.interval;
        if (typeof unregisterInterval === 'function') unregisterInterval(bg);
        else try { clearInterval(bg); } catch (e) {}
        p.backgroundBattle.interval = null;
        p.backgroundBattle.active = false;
    }
}

function clearWorldMapForegroundBattleTimer() {
    var id = (player && player.worldMapBattle && player.worldMapBattle.autoBattleInterval != null)
        ? player.worldMapBattle.autoBattleInterval
        : window._worldMapForegroundBattleInterval;
    if (id == null) {
        window._worldMapForegroundBattleInterval = null;
        if (player && player.worldMapBattle) player.worldMapBattle.autoBattleInterval = null;
        return;
    }
    if (typeof unregisterInterval === 'function') unregisterInterval(id);
    else try { clearInterval(id); } catch (e) {}
    if (player && player.worldMapBattle) player.worldMapBattle.autoBattleInterval = null;
    window._worldMapForegroundBattleInterval = null;
}

function clearWorldMapBackgroundBattleTimer() {
    var id = (player && player.backgroundBattle && player.backgroundBattle.interval != null)
        ? player.backgroundBattle.interval
        : window._worldMapBackgroundBattleInterval;
    if (id == null) {
        window._worldMapBackgroundBattleInterval = null;
        if (player && player.backgroundBattle) player.backgroundBattle.interval = null;
        return;
    }
    if (typeof unregisterInterval === 'function') unregisterInterval(id);
    else try { clearInterval(id); } catch (e) {}
    if (player && player.backgroundBattle) player.backgroundBattle.interval = null;
    window._worldMapBackgroundBattleInterval = null;
}

function updateWorldMapAutoBattleStatusUI() {
    var on = !!(player && player.worldMapBattle && player.worldMapBattle.autoBattle);
    var text = on ? '开启' : '关闭';
    try {
        document.querySelectorAll('#worldMapAutoBattleStatus').forEach(function(el) {
            el.textContent = text;
        });
    } catch (e) {}
}

function stopAllWorldMapBattles() {
    clearWorldMapForegroundBattleTimer();
    stopBackgroundBattle();
    if (player.backgroundBattle) player.backgroundBattle.active = false;
}

/** 世界地图自动战斗：同一时刻只保留一套定时器（前台/后台均为 1 秒） */
function syncWorldMapAutoBattleTimers() {
    if (!player || !player.worldMapBattle) return;

    clearWorldMapForegroundBattleTimer();
    stopBackgroundBattle();

    if (!player.worldMapBattle.autoBattle) return;
    if (!player.battle || !player.battle.currentZone) return;

    var dimension;
    try {
        dimension = dimensionConfig[player.dimensionLevel];
    } catch (e) {
        return;
    }
    if (!dimension) return;
    if ((player.nightClub.starCoins || 0) < dimension.cost) return;

    var battleEl = document.getElementById('battleUI');
    var battleUiOpen = battleEl && battleEl.style.display === 'block';

    if (battleUiOpen) {
        player.worldMapBattle.autoBattleInterval = registerInterval(worldMapAttackMonster, WORLD_MAP_AUTO_BATTLE_TICK_MS);
        window._worldMapForegroundBattleInterval = player.worldMapBattle.autoBattleInterval;
    } else {
        player.backgroundBattle.active = true;
        startBackgroundBattle();
    }
}
// 更新世界地图界面
function updateWorldMapUI() {
    const container = document.getElementById('zoneList');
    container.innerHTML = '';

    const dimension = dimensionConfig[player.dimensionLevel] || dimensionConfig[1];
    const vipLevel = Math.max(1, Number(player.vip && player.vip.level) || 1);
    const vipMultiplier = vipLevel * 10;
    const dimExpMultiplier = Number(dimension.expMultiplier) || 1;

    worldZones.forEach(zone => {
        const zoneElement = document.createElement('div');
        zoneElement.style.background = 'linear-gradient(180deg, rgba(78, 60, 90, 0.92) 0%, rgba(23, 16, 28, 0.92) 100%)';
        zoneElement.style.padding = '12px 12px 10px 12px';
        zoneElement.style.borderRadius = '10px';
        zoneElement.style.textAlign = 'left';
        zoneElement.style.cursor = 'pointer';
        zoneElement.style.transition = 'transform .15s ease, box-shadow .15s ease, border-color .15s ease';
        zoneElement.style.border = '1px solid rgba(255, 215, 0, 0.18)';
        zoneElement.style.boxShadow = '0 8px 20px rgba(0,0,0,0.30), inset 0 0 0 1px rgba(255,231,173,0.07)';
        
        const expMin = (zone.expRange && zone.expRange.length > 0) ? zone.expRange[0] : 0;
        const expMax = (zone.expRange && zone.expRange.length > 1) ? zone.expRange[1] : 0;

        zoneElement.innerHTML = `
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px;">
                <div style="min-width:0;">
                    <div style="color:#ffd54f; font-weight:800; font-size:14px; letter-spacing:.3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        ${zone.name}
                    </div>
                    <div style="margin-top:4px; font-size:11px; color:#c8b59a;">
                        等级：${zone.minLevel}-${zone.maxLevel}
                    </div>
                    <div style="margin-top:3px; font-size:11px; color:#8ee2ff;">
                        经验基础：${formatSci(expMin)} - ${formatSci(expMax)}
                    </div>
                    <div style="margin-top:3px; font-size:11px; color:#81d4fa;">
                        经验倍率预估：VIP*10 × 次元经验倍数
                    </div>
                    <div style="margin-top:3px; font-size:10px; color:#d6f6ff; opacity:.95;">
                        (VIP*10=${vipMultiplier}) × (次元 x${formatSci(dimExpMultiplier)})
                    </div>
                </div>
                <div style="flex-shrink:0; text-align:right;">
                    <div style="font-size:10px; color:#ffeb3b; opacity:.95; margin-bottom:6px;">${dimension.name}</div>
                    <div style="font-size:11px; color:#ffe7cf; background:rgba(255,215,0,0.10); border:1px solid rgba(255,215,0,0.18); padding:3px 9px; border-radius:999px; white-space:nowrap;">
                        x${formatSci(dimExpMultiplier)}
                    </div>
                </div>
            </div>
            <div style="margin-top:10px; display:flex; justify-content:flex-end; align-items:center;">
                <div style="font-size:11px; color:#fff2d8; opacity:.95;">点击挑战</div>
            </div>
        `;
        
        zoneElement.onmouseenter = function() {
            zoneElement.style.transform = 'translateY(-2px)';
            zoneElement.style.boxShadow = '0 16px 38px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,231,173,0.12)';
            zoneElement.style.borderColor = 'rgba(255, 215, 0, 0.30)';
        };
        zoneElement.onmouseleave = function() {
            zoneElement.style.transform = 'translateY(0)';
            zoneElement.style.boxShadow = '0 8px 20px rgba(0,0,0,0.30), inset 0 0 0 1px rgba(255,231,173,0.07)';
            zoneElement.style.borderColor = 'rgba(255, 215, 0, 0.18)';
        };
        
        zoneElement.onclick = () => startBattleInZone(zone);
        container.appendChild(zoneElement);
    });
}

// 在指定区域开始战斗
function startBattleInZone(zone) {
    const dimension = dimensionConfig[player.dimensionLevel];
    
    // 检查轮回转生要求
    if (player.level.ascentionCounta < dimension.ascentionRequired) {
        logAction(`进入${dimension.name}需要轮回${dimension.ascentionRequired}转！当前轮回${player.level.ascentionCounta}转`, "error");
        toggleWorldMap();
        return;
    }
    
    if (player.nightClub.starCoins < dimension.cost) {
        logAction(`星币不足！需要${dimension.cost}个星币`, "error");
        toggleWorldMap();
        return;
    }
    
    player.nightClub.starCoins -= dimension.cost;
    logAction(`消耗${dimension.cost}个星币生成怪物（${dimension.name}）`, "info");
    player.battle.currentZone = zone;
    
    // 生成怪物（考虑次元难度）
    generateMonsterForZone(zone, dimension);
    
    // 初始化战斗状态
    player.battle.monsterResurrections = 0;
    
    // 进入战斗前先刷新玩家战斗属性，避免界面用旧数据且减少后续卡顿
    updatePlayerBattleStats();
    
    document.getElementById('worldMapUI').style.display = 'none';
    document.getElementById('worldMapOverlay').style.display = 'none';
    openBattleUI();
}
// 为区域生成怪物
function generateMonsterForZone(zone, dimension) {
            // 随机选择怪物名字
            const name = zone.monsterNames[Math.floor(Math.random() * zone.monsterNames.length)];
            
            // 随机选择词条
            const modifier = zone.modifiers[Math.floor(Math.random() * zone.modifiers.length)];
            
            // 计算基础属性
            const stage = Math.floor((zone.minLevel + zone.maxLevel) / 2);
            const attackMultiplier = calculateAttackMultiplier(stage);
            
            // 应用词条加成和次元难度加成
            const health = multiplyBigByFinite(
                multiplyBigByFinite(powScaledBig(2, stage, 10000), modifier.health),
                Number(dimension.healthMultiplier) || 1
            );
            const attack = multiplyBigByFinite(bigSciToStorageValue(attackMultiplier), modifier.attack * dimension.attackMultiplier);
            
            player.battle.currentMonster = {
                name: `${name}`,
                rank: modifier.name,
                health: health,
                maxHealth: health,
                baseMaxHealth: health,
                attack: attack,
                resurrections: 0,
                modifier: modifier
            };
            
            player.battle.monsterResurrections = 0;
        }

/** 击败后或怪物丢失时刷下一只；星币不足返回 false */
function spawnNextWorldMapMonster(options) {
    options = options || {};
    var zone = player.battle.currentZone;
    var dimension = dimensionConfig[player.dimensionLevel];
    if (!zone || !zone.expRange) {
        if (!options.silent) addBattleLog('战斗区域数据异常，已重置战斗状态');
        player.battle.currentMonster = null;
        player.battle.monsterResurrections = 0;
        return false;
    }
    if (!dimension) {
        player.battle.currentMonster = null;
        player.battle.monsterResurrections = 0;
        if (!options.silent) addBattleLog('当前次元配置异常，请重新选择次元后开始战斗');
        return false;
    }
    if (player.nightClub.starCoins < dimension.cost) {
        if (!options.silent) addBattleLog('星币不足，无法生成新怪物！');
        player.battle.currentMonster = null;
        player.battle.monsterResurrections = 0;
        return false;
    }
    player.nightClub.starCoins -= dimension.cost;
    if (!options.silent) addBattleLog('消耗' + dimension.cost + '个星币生成新怪物');
    generateMonsterForZone(zone, dimension);
    player.battle.monsterResurrections = 0;
    updatePlayerBattleStats();
    if (typeof updateItemDisplay === 'function') updateItemDisplay();
    return true;
}

/** 怪物对象丢失时尝试补刷（需扣星币） */
function tryRecoverWorldMapMonster(options) {
    return spawnNextWorldMapMonster(Object.assign({ silent: false }, options || {}));
}

function bumpWorldMapMonsterDeathCount() {
    var mr = Number(player.battle.monsterResurrections);
    if (!Number.isFinite(mr) || mr < 0) mr = 0;
    player.battle.monsterResurrections = Math.floor(mr) + 1;
}

/** 洞天劫历史最高秘境层数：第1层不加成，从第2层起每层 +10% 世界地图经验 */
function getDongtianWorldMapExpMultiplier() {
    var f = Number(player && player.dongtianMaxFloor);
    if (!Number.isFinite(f) || f < 1) f = 1;
    return 1 + Math.max(0, f - 1) * 0.1;
}

/** 湮灭诸敌（洞天劫累计击杀）：每 1 个 +1% 生命与攻击（与其它乘区叠乘） */
function getDongtianAnnihilationHpAtkMultiplier() {
    var k = Number(player && player.dongtianKills);
    if (!Number.isFinite(k) || k < 0) k = 0;
    return 1 + k * 0.01;
}

/**
 * 无限深渊最佳层数 → 世界地图生命/攻击/爆伤乘区（与其它乘区叠乘）。
 * 仅统计超过 50 层后的层数，分段累加：51–100 每层 +1，101–200 每层 +10，201–300 +100，
 * 301–400 +1000，401–500 +10000，501 层起每层 +100000（均为加在 1 上的“倍”系数）。
 */
function getWorldMapAbyssBestFloorStatMultiplier() {
    var f = Math.floor(Number(player && player.abyssTower && player.abyssTower.bestFloor) || 0);
    if (!Number.isFinite(f) || f <= 50) return 1;
    var add = 0;
    if (f > 50) add += (Math.min(f, 100) - 50) * 1;
    if (f > 100) add += (Math.min(f, 200) - 100) * 10;
    if (f > 200) add += (Math.min(f, 300) - 200) * 100;
    if (f > 300) add += (Math.min(f, 400) - 300) * 1000;
    if (f > 400) add += (Math.min(f, 500) - 400) * 10000;
    if (f > 500) add += (f - 500) * 100000;
    return 1 + add;
}

/** 联网深渊神兽图鉴：按登记先后顺序分段累加「倍」到乘区（1+累加），再与无限深渊层数乘区叠乘 */
function abyssDivineCodexTierWeight(slotIndex1Based) {
    var i = Math.floor(Number(slotIndex1Based) || 0);
    if (i <= 0) return 0;
    if (i >= 81) return 1000000000;
    if (i === 80) return 100000000;
    if (i === 79) return 70000000;
    if (i === 78) return 50000000;
    if (i === 77) return 40000000;
    if (i === 76) return 20000000;
    if (i > 70) return 10000000;
    if (i > 65) return 5000000;
    if (i > 60) return 1000000;
    if (i > 55) return 500000;
    if (i > 50) return 100000;
    if (i > 45) return 50000;
    if (i > 40) return 10000;
    if (i > 35) return 5000;
    if (i > 30) return 1000;
    if (i > 25) return 500;
    if (i > 20) return 100;
    if (i > 15) return 50;
    if (i > 10) return 10;
    if (i > 5) return 5;
    return 1;
}
function getNetworkAbyssDivineCodexWorldMapMultiplier() {
    if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) return 1;
    var codex = (window._networkAbyssDivineCache && window._networkAbyssDivineCache.speciesCodex) || [];
    if (!codex.length) return 1;
    var sorted = codex.slice().sort(function(a, b) {
        var ta = Number(a.placedAt) || 0;
        var tb = Number(b.placedAt) || 0;
        return ta - tb;
    });
    var add = 0;
    for (var s = 0; s < sorted.length; s++) {
        add += abyssDivineCodexTierWeight(s + 1);
    }
    return 1 + add;
}

function syncDongtianProfileToMainPlayer(done) {
    try {
        if (typeof goldGameApiRequest !== "function" || typeof getGoldGameAuthToken !== "function" || !getGoldGameAuthToken()) {
            if (typeof done === "function") done();
            return;
        }
        goldGameApiRequest("GET", "/api/dongtian-jie/save", undefined, true)
            .then(function (res) {
                if (res && res.ok && res.data && res.data.player) {
                    var p = res.data.player;
                    var mf = typeof p.maxDungeonFloor === "number" && !isNaN(p.maxDungeonFloor) ? Math.floor(p.maxDungeonFloor) : 1;
                    var dk = typeof p.kills === "number" && !isNaN(p.kills) ? Math.floor(p.kills) : 0;
                    if (mf < 1) mf = 1;
                    if (dk < 0) dk = 0;
                    player.dongtianMaxFloor = mf;
                    player.dongtianKills = dk;
                    if (typeof updatePlayerBattleStats === "function") updatePlayerBattleStats();
                    if (typeof updatePlayerAttributesDisplay === "function") updatePlayerAttributesDisplay();
                }
                if (typeof done === "function") done();
            })
            .catch(function () {
                if (typeof done === "function") done();
            });
    } catch (e) {
        if (typeof done === "function") done();
    }
}

function calculateWorldMapExpReward(zone, dimension) {
    if (!zone || !Array.isArray(zone.expRange) || zone.expRange.length < 2 || !dimension) return 0;
    const expMin = Number(zone.expRange[0]) || 0;
    const expMax = Number(zone.expRange[1]) || 0;
    if (expMax < expMin || expMin < 0) return 0;
    const baseExp = Math.floor(Math.random() * (expMax - expMin + 1)) + expMin;
    const runeBonuses = calculateRuneBonuses();
    const worldExpBonus = 1 + (Number(runeBonuses && runeBonuses.worldExp) || 0);
    const classBonuses = getCachedClassBonuses();
    const explorerWorldExpBonus = Number(classBonuses && classBonuses.worldExpMultiplier) || 1;
    const familyWorldExpPct = (typeof getFamilyWorldExpBonusPercent === 'function') ? Number(getFamilyWorldExpBonusPercent()) || 0 : 0;
    const rubyLevel = Number(player.mining && player.mining.gems ? player.mining.gems.ruby : 0) || 0;
    const rubyMultiplier = 1 + rubyLevel * 1;
    const vipLevel = Math.max(1, Number(player.vip && player.vip.level) || 1);
    const vipMultiplier = vipLevel * 10;
    const earthLevel = Number(player.fiveElements && player.fiveElements.earth ? player.fiveElements.earth.level : 0) || 0;
    const earthMultiplier = 1 + earthLevel * 0.2;
    const abyssBestFloor = Number(player.abyssTower && player.abyssTower.bestFloor) || 0;
    const abyssMultiplier = 1 + abyssBestFloor * 0.01;
    const dimensionExpMultiplier = Number(dimension.expMultiplier) || 1;
    const familyMultiplier = 1 + familyWorldExpPct / 100;
    const lawBonusObj = (typeof getLawPowerBonuses === 'function') ? getLawPowerBonuses() : { worldExp: 0 };
    const lawWorldExpMultiplier = 1 + (Number(lawBonusObj.worldExp) || 0);
    const skyVineMultiplier = (typeof getLandlordSkyVineWorldExpMultiplier === 'function') ? getLandlordSkyVineWorldExpMultiplier() : 1;
    const seaFishingDexMultiplier = (typeof getSeaFishingDexWorldExpMultiplier === 'function') ? getSeaFishingDexWorldExpMultiplier() : 1;
    const dongtianWorldExpMul = typeof getDongtianWorldMapExpMultiplier === "function" ? getDongtianWorldMapExpMultiplier() : 1;
    const totalMultiplier =
        vipMultiplier *
        dimensionExpMultiplier *
        worldExpBonus *
        earthMultiplier *
        abyssMultiplier *
        explorerWorldExpBonus *
        familyMultiplier *
        rubyMultiplier *
        lawWorldExpMultiplier *
        skyVineMultiplier *
        seaFishingDexMultiplier *
        dongtianWorldExpMul;
    const finalExp = Math.floor(baseExp * totalMultiplier);
    return Number.isFinite(finalExp) && finalExp > 0 ? finalExp : 0;
}

// 世界地图：按复活阶段回满血（用 baseMaxHealth 避免 maxHealth 被反复乘算错误）
function applyWorldMapMonsterRevive(monster, resurrectionCount) {
    if (!monster) return;
    var base = monster.baseMaxHealth != null ? monster.baseMaxHealth : monster.maxHealth;
    var hp = multiplyBigByFinite(base, Math.pow(2, resurrectionCount));
    monster.health = bigSciToStorageValue(hp);
    monster.maxHealth = bigSciToStorageValue(hp);
}

// 计算攻击乘数
function calculateAttackMultiplier(stage) {
    if (stage <= 5) return Math.floor(Math.random() * 3) + 1;
    if (stage <= 25) return 100 + (stage - 4) * 10;
    if (stage <= 50) return 1000 + (stage - 24) * 100;
    if (stage <= 100) return 5000 + (stage - 49) * 500;
    if (stage <= 150) return 50000 + (stage - 99) * 1000;
    if (stage <= 200) return 10000 + (stage - 149) * 10000;
    if (stage <= 250) return 500000 + (stage - 199) * 100000;
    if (stage <= 300) return 5000000 + (stage - 249) * 1000000;
    if (stage <= 350) return 10000000 + (stage - 299) * 100000000;
    if (stage <= 400) return 100000000 + (stage - 349) * 1000000000;
    if (stage <= 450) return 1000000000 + (stage - 399) * 100000000000;
    if (stage <= 500) return 10000000000 + (stage - 349) * 100000000000000;
    if (stage <= 550) return 100000000000 + (stage - 499) * 10000000000000000;
    if (stage <= 600) return 1000000000000 + (stage - 549) * 1000000000000000000;
    if (stage <= 650) return 10000000000000 + (stage - 599) * 1000000000000000000000;
    if (stage <= 700) return 100000000000000 + (stage - 649) * 1000000000000000000000000;
    if (stage <= 750) return 1000009000000000 + (stage - 699) * 10000000000000000000000000000;
    if (stage <= 800) return 10000000000000900 + (stage - 749) * 1000000000000000000000000000000000;
    if (stage <= 850) return 100000000000000900 + (stage - 799) * 10000000000000000000000000000000000000000;
    if (stage <= 900) return 10000000000000000900 + (stage - 849) * 10000000000000000000000000000000000000000000000;
    if (stage <= 950) return 6500000000000000000900 + (stage - 899) * 1000000000000000000000000000000000000000000000000000000;    
    return 650000000000000000000000000000000900 + (stage - 949) * 100000000000000000000000000000000000000000000000000000000000000;
}


function formatBattleNumber(value) {
    return formatSci(value);
}
// 更新战斗界面
function updateBattleUI() {
    // 玩家属性
    document.getElementById('battlePlayerHealth').textContent = formatSci(player.battle.playerHealth);
    document.getElementById('battlePlayerAttack').textContent = formatSci(player.battle.playerAttack);
    document.getElementById('battlePlayerCritRate').textContent = (player.battle.playerCritRate * 100).toFixed(2) + '%';
    document.getElementById('battlePlayerCritDamage').textContent = (player.battle.playerCritDamage * 100).toExponential(3) + '%';
    document.getElementById('battleRebornDanCount').textContent = (player.nightClub.starCoins || 0).toFixed(1);

    
    // 怪物属性（用 formatBattleNumber 避免次元5等超大数值时 formatNumber 导致卡顿）
    const monster = player.battle.currentMonster;
    if (!monster) return;
    document.getElementById('battleMonsterName').textContent = monster.name;
    document.getElementById('battleMonsterHealth').textContent = formatBattleNumber(monster.health);
    document.getElementById('battleMonsterMaxHealth').textContent = formatBattleNumber(monster.maxHealth);
    document.getElementById('battleMonsterAttack').textContent = formatBattleNumber(monster.attack);
    document.getElementById('battleMonsterModifier').textContent = ` ${monster.rank}`;
   document.getElementById('battleMonsterResurrections').textContent = (function () {
        var n = Number(player.battle.monsterResurrections);
        return Number.isFinite(n) ? n : 0;
    })();
}

// 切换自动战斗
function toggleWorldMapAutoBattle() {
    player.worldMapBattle.autoBattle = !player.worldMapBattle.autoBattle;
    updateWorldMapAutoBattleStatusUI();
    
    if (player.worldMapBattle.autoBattle) {
        syncWorldMapAutoBattleTimers();
    } else {
        stopAllWorldMapBattles();
    }
    
    logAction(`世界地图自动战斗${player.worldMapBattle.autoBattle ? '开启' : '关闭'}`, "info");
}

// 世界地图联网币掉落请求保护：限制并发与频率，避免长挂机后请求堆积导致卡顿
window._networkCoinDropRequestInFlight = false;
window._networkCoinDropLastAt = 0;
window._networkCoinDropMinIntervalMs = 1200;
function tryDropNetworkCoinSafe(dimensionLevel, onDropped) {
    try {
        if (!(dimensionLevel >= 1)) return;
        if (typeof goldGameTryDropNetworkCoin !== 'function') return;
        if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) return;
        const now = Date.now();
        if (window._networkCoinDropRequestInFlight) return;
        if ((now - (window._networkCoinDropLastAt || 0)) < (window._networkCoinDropMinIntervalMs || 1200)) return;
        window._networkCoinDropRequestInFlight = true;
        window._networkCoinDropLastAt = now;
        goldGameTryDropNetworkCoin(dimensionLevel).then(function(res) {
            if (res && res.ok && res.dropped && typeof onDropped === 'function') onDropped();
        }).catch(function() {
        }).finally(function() {
            window._networkCoinDropRequestInFlight = false;
            if (typeof window.goldGameMapleCoinWorldMapMaybeTick === 'function') window.goldGameMapleCoinWorldMapMaybeTick();
        });
    } catch (e) {
        window._networkCoinDropRequestInFlight = false;
    }
}

window._supremeArtifactDropRequestInFlight = false;
window._supremeArtifactDropLastAt = 0;
function tryDropSupremeArtifactSafe(dimensionLevel, onDropped) {
    try {
        if (!(dimensionLevel >= 2)) return;
        if (typeof goldGameTryDropSupremeArtifact !== 'function') return;
        if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) return;
        var now = Date.now();
        if (window._supremeArtifactDropRequestInFlight) return;
        if ((now - (window._supremeArtifactDropLastAt || 0)) < (window._networkCoinDropMinIntervalMs || 1200)) return;
        window._supremeArtifactDropRequestInFlight = true;
        window._supremeArtifactDropLastAt = now;
        goldGameTryDropSupremeArtifact(dimensionLevel).then(function(res) {
            if (res && res.ok && res.dropped && typeof onDropped === 'function') onDropped();
        }).catch(function() {
        }).finally(function() {
            window._supremeArtifactDropRequestInFlight = false;
            if (typeof window.goldGameMapleCoinWorldMapMaybeTick === 'function') window.goldGameMapleCoinWorldMapMaybeTick();
        });
    } catch (e) {
        window._supremeArtifactDropRequestInFlight = false;
    }
}

// 攻击怪物
function worldMapAttackMonster() {
    if (!player || !player.worldMapBattle || !player.worldMapBattle.autoBattle) return;
    try {
    const monster = player.battle.currentMonster;
    if (!monster) {
        if (tryRecoverWorldMapMonster()) {
            addBattleLog('检测到怪物数据异常，已消耗星币恢复战斗');
            updateBattleUI();
        } else if (!player.battle.currentZone || !dimensionConfig[player.dimensionLevel]) {
            stopAllWorldMapBattles();
            addBattleLog('战斗区域数据丢失，请重新进入世界地图');
            logAction("前台自动战斗停止：战斗区域数据丢失，请重新进入世界地图", "warning");
        } else if (player.nightClub.starCoins < (dimensionConfig[player.dimensionLevel] || {}).cost) {
            stopAllWorldMapBattles();
            addBattleLog('星币不足，无法生成新怪物！');
            if (player.worldMapBattle.autoBattle) {
                player.worldMapBattle.autoBattle = false;
                updateWorldMapAutoBattleStatusUI();
            }
        }
        return;
    }
    if (bLteZero(monster.health)) {
        handleMonsterDefeated();
        updateBattleUI();
        return;
    }
    const playerAttack = bigSciToStorageValue(player.battle.playerAttack);
    if (cmpBigSci(playerAttack, 0) <= 0) {
        updatePlayerBattleStats();
        if (cmpBigSci(bigSciToStorageValue(player.battle.playerAttack), 0) <= 0) {
            stopAllWorldMapBattles();
            addBattleLog('角色攻击异常，已停止自动战斗，请重新进入世界地图');
            logAction("前台自动战斗停止：角色攻击异常", "warning");
            return;
        }
    }
    
    // 计算伤害（考虑暴击）
    let isCrit = Math.random() < player.battle.playerCritRate;
    let damage = isCrit ? multiplyBigByFinite(playerAttack, player.battle.playerCritDamage) : playerAttack;
    if (cmpBigSci(damage, 0) <= 0) {
        updatePlayerBattleStats();
        return;
    }
    
    // 应用伤害
    monster.health = bSub(monster.health, damage);
    
    // 记录战斗日志
    addBattleLog(`你对${monster.name}造成了${formatSci(damage)}点${isCrit ? '暴击 ' : ''}伤害`);
    
    // 检查怪物是否死亡
    if (bLteZero(monster.health)) {
        handleMonsterDefeated();
    } else {
        // 怪物反击
        monsterCounterAttack();
    }
    
    updateBattleUI();
    } catch (e) {
        stopAllWorldMapBattles();
        addBattleLog('战斗发生异常，已自动停止并保护存档，请重新进入世界地图');
        logAction("前台自动战斗停止：检测到异常并自动保护（" + ((e && e.message) ? e.message : '未知错误') + "）", "warning");
        if (typeof console !== 'undefined' && console.error) console.error('worldMapAttackMonster error', e);
    }
}

// 怪物反击
function monsterCounterAttack() {
    const monster = player.battle.currentMonster;
    if (!monster) return;
    const damage = monster.attack;
    
    // 应用伤害
    player.battle.playerHealth = bSub(player.battle.playerHealth, damage);
    
    // 记录战斗日志
    addBattleLog(`${monster.name}对你造成了${formatSci(damage)}点伤害`);
    
    // 检查玩家是否死亡
    if (bLteZero(player.battle.playerHealth)) {
        addBattleLog('你被怪物击败了！');
        closeBattle();
     updatePlayerBattleStats();
    }
    
    updateBattleUI();
}
let cachedClassBonuses = null;
let lastClassUpdate = 0;

function getCachedClassBonuses() {
    // 每秒钟重新计算一次，或者当职业相关数据变化时更新
    const now = Date.now();
    if (!cachedClassBonuses || now - lastClassUpdate > 1000) {
        cachedClassBonuses = calculateClassBonuses();
        lastClassUpdate = now;
    }
    return cachedClassBonuses;
}

/** 界面未打开时刷新 DOM 可能报错，掉落逻辑里统一走此函数避免误报「奖励异常」 */
function safePanelUpdate(fn) {
    try {
        if (typeof fn === 'function') fn();
    } catch (e) {
        if (typeof console !== 'undefined' && console.warn) console.warn('panel update skipped', e);
    }
}

function safeWorldMapRewardCall(fn, label) {
    try {
        if (typeof fn === 'function') fn();
    } catch (err) {
        const msg = (err && err.message) ? err.message : String(err || '未知错误');
        if (typeof logAction === 'function') logAction('世界地图奖励异常(' + label + ')：' + msg, 'warning');
        if (typeof console !== 'undefined' && console.error) console.error('world map reward error [' + label + ']', err);
    }
}
// 处理怪物被击败
function handleMonsterDefeated() {
            if (player.battle._worldMapDefeatBusy) return;
            player.battle._worldMapDefeatBusy = true;
            try {
            const monster = player.battle.currentMonster;
            const zone = player.battle.currentZone;
            const dimension = dimensionConfig[player.dimensionLevel];
            if (!monster) return;
            if (!dimension) {
                player.battle.currentMonster = null;
                player.battle.monsterResurrections = 0;
                stopAllWorldMapBattles();
                addBattleLog('当前次元配置异常，请重新选择次元后开始战斗');
                logAction("前台自动战斗停止：当前次元配置异常，请重新选择次元", "warning");
                return;
            }
            
            bumpWorldMapMonsterDeathCount();
            
            if (player.battle.monsterResurrections < 3) {
                // 怪物复活（属性增强）
                applyWorldMapMonsterRevive(monster, player.battle.monsterResurrections);
                monster.attack = multiplyBigByFinite(monster.attack, 2);
                
                addBattleLog(`${monster.name}复活了！(第${player.battle.monsterResurrections}次)`);
                monsterCounterAttack();
            } else {
                // 怪物真正死亡
                if (!zone || !zone.expRange) {
                    addBattleLog('战斗区域数据异常，已重置战斗状态');
                    player.battle.currentMonster = null;
                    player.battle.monsterResurrections = 0;
                    stopAllWorldMapBattles();
                    logAction("前台自动战斗停止：战斗区域数据丢失，请重新进入世界地图", "warning");
                    updateBattleUI();
                    updateLevelUI();
                    updateDisplay();
                    return;
                }
                addBattleLog(`你击败了${monster.name}！`);
                
                const finalExp = calculateWorldMapExpReward(zone, dimension);
                addPlayerExp(finalExp);
                addBattleLog(`获得${formatSci(finalExp)}经验！`);
              
               safeWorldMapRewardCall(dropRuneMaterials, '符文材料');
               safeWorldMapRewardCall(dropMount, '坐骑');
                safeWorldMapRewardCall(dropWing, '翅膀');
               safeWorldMapRewardCall(tryDropLawPowerMaterial, '法则材料');
                if (Math.random() < 0.01) { // 1%掉落率
            safeWorldMapRewardCall(dropItemsByDimension, '次元掉落');          
            }
           safeWorldMapRewardCall(dropReincarnationEquipment, '轮回装备');
           safeWorldMapRewardCall(tryDropBeastAfterBattle, '轮回神兽');
           safeWorldMapRewardCall(tryDropPixelSkinAfterBattle, '像素皮肤');
                // 联网币：次元1以上打怪0.1%几率（由服务器发放，存账号）
                tryDropNetworkCoinSafe(player.dimensionLevel, function() {
                    addBattleLog('获得 联网币 x1（已存入账号）');
                    if (typeof logAction === 'function') logAction('获得联网币 x1', 'success');
                });
                tryDropSupremeArtifactSafe(player.dimensionLevel, function() {
                    addBattleLog('获得 至尊神器（已存入账号）');
                    if (typeof logAction === 'function') logAction('获得至尊神器（已存入账号）', 'legendary');
                    if (typeof updatePlayerBattleStats === 'function') updatePlayerBattleStats();
                });
                if (!spawnNextWorldMapMonster()) {
                    if (player.worldMapBattle.autoBattle) {
                        player.worldMapBattle.autoBattle = false;
                        updateWorldMapAutoBattleStatusUI();
                    }
                    stopAllWorldMapBattles();
                    closeBattle();
                    return;
                }
            }
            
            updateBattleUI();
            // addPlayerExp 内已调用 updateLevelUI，此处省略避免重复刷新 DOM
            updateDisplay();
            } finally {
                player.battle._worldMapDefeatBusy = false;
            }
        }
function dropItemsByDimension() {
    const dimNum = parseInt(player.dimensionLevel, 10);
    const dimension = (dimNum >= 1 && dimNum <= 5) ? dimNum : (dimNum > 5 ? 5 : 1);
    let droppedItems = [];
    
    switch(dimension) {
        case 1:
            if (Math.random() < 0.5) droppedItems.push('vipPower');
            if (Math.random() < 0.2) droppedItems.push('banlv1');
            break;
        case 2:
            if (Math.random() < 0.5) droppedItems.push('vipPower');
            if (Math.random() < 0.2) droppedItems.push('banlv1');
            if (Math.random() < 0.2) droppedItems.push('yuzhou1');
            break;
        case 3:
            if (Math.random() < 0.5) droppedItems.push('vipPower');
            if (Math.random() < 0.2) droppedItems.push('banlv1');
            if (Math.random() < 0.2) droppedItems.push('yuzhou1');
            if (Math.random() < 0.2) droppedItems.push('yuzhou2');
            break;
        case 4:
            if (Math.random() < 0.5) droppedItems.push('vipPower');
            if (Math.random() < 0.2) droppedItems.push('banlv1');
            if (Math.random() < 0.2) droppedItems.push('yuzhou1');
            if (Math.random() < 0.2) droppedItems.push('yuzhou2');
            if (Math.random() < 0.2) droppedItems.push('yuzhou3');
            break;
        case 5:
            if (Math.random() < 0.5) droppedItems.push('vipPower');
            if (Math.random() < 0.2) droppedItems.push('banlv1');
            if (Math.random() < 0.2) droppedItems.push('yuzhou1');
            if (Math.random() < 0.2) droppedItems.push('yuzhou2');
            if (Math.random() < 0.2) droppedItems.push('yuzhou3');
            if (Math.random() < 0.1) droppedItems.push('yuzhou4');
            break;
    }
    
    // 处理掉落物品
    if (droppedItems.length > 0) {
        if (!player.items || typeof player.items !== 'object') player.items = {};
        let dropMessage = "怪物掉落: ";
        droppedItems.forEach(itemKey => {
            const meta = itemEffects[itemKey];
            const displayName = (meta && meta.name) ? meta.name : String(itemKey);
            player.items[itemKey] = (player.items[itemKey] || 0) + 1;
            dropMessage += `${displayName} `;
        });
        
        addBattleLog(dropMessage);
        logAction(dropMessage, 'success');
        safePanelUpdate(updateItemDisplay);
    }
}

function tryDropLawPowerMaterial() {
    if ((Number(player.dimensionLevel) || 0) < 9) return false;
    if (Math.random() >= 0.001) return false; 
    if (!player.items || typeof player.items !== 'object') player.items = {};
    player.items.lawPowerMaterial = Math.floor(Number(player.items.lawPowerMaterial) || 0) + 1;
    addBattleLog('掉落：法则之力材料 x1');
    if (typeof logAction === 'function') logAction('获得法则之力材料 x1', 'legendary');
    if (typeof saveGame === 'function') saveGame({ silent: true });
    return true;
}

// 添加战斗日志（同时写入 player.battleLog 以便关闭再打开界面仍能看到，并限制长度防泄漏）
function addBattleLog(message) {
    if (!player.battleLog || !Array.isArray(player.battleLog)) player.battleLog = [];
    var logLine = '[' + new Date().toLocaleTimeString() + '] ' + message;
    player.battleLog.push(logLine);
    if (player.battleLog.length > 100) player.battleLog = player.battleLog.slice(-100);

    const logContainer = document.getElementById('addbattleLog');
    if (!logContainer) return;
    const logElement = document.createElement('div');
    logElement.textContent = logLine;

    logContainer.appendChild(logElement);
    if (logContainer.children.length > 10) logContainer.removeChild(logContainer.firstChild);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// 关闭战斗
function closeBattle() {
    document.getElementById('battleUI').style.display = 'none';
    document.getElementById('battleOverlay').style.display = 'none';

    if (player.worldMapBattle.autoBattle) {
        syncWorldMapAutoBattleTimers();
        logAction("已切换到后台自动战斗", "info");
    }
}
function startBackgroundBattle() {
    clearWorldMapForegroundBattleTimer();
    clearWorldMapBackgroundBattleTimer();
    
    // 检查是否有足够的星币
    const dimension = dimensionConfig[player.dimensionLevel];
    if (player.nightClub.starCoins < dimension.cost) {
        logAction("星币不足，无法启动后台自动战斗", "warning");
        player.backgroundBattle.active = false;
        return;
    }
    
    player.backgroundBattle.active = true;
    // 每秒钟执行一次后台战斗
    player.backgroundBattle.interval = registerInterval(() => {
        if (!player || !player.worldMapBattle || !player.worldMapBattle.autoBattle || !player.backgroundBattle || !player.backgroundBattle.active) {
            clearWorldMapBackgroundBattleTimer();
            return;
        }
        var dim = dimensionConfig[player.dimensionLevel];
        if (!dim || player.nightClub.starCoins < dim.cost) {
            stopBackgroundBattle();
            logAction("星币不足，后台自动战斗已停止", "warning");
            return;
        }
        
        // 执行一次攻击
        backgroundWorldMapAttackMonster();
    }, WORLD_MAP_AUTO_BATTLE_TICK_MS);
    window._worldMapBackgroundBattleInterval = player.backgroundBattle.interval;
    
    logAction("后台自动战斗已启动", "info");
}
function backgroundWorldMapAttackMonster() {
    if (!player || !player.worldMapBattle || !player.worldMapBattle.autoBattle || !player.backgroundBattle.active) return;
    try {
    const monster = player.battle.currentMonster;
    if (!monster) {
        if (!tryRecoverWorldMapMonster({ silent: true })) {
            if (!player.battle.currentZone || !dimensionConfig[player.dimensionLevel]) {
                stopBackgroundBattle();
                logAction("后台自动战斗停止：战斗区域数据丢失，请重新进入世界地图", "warning");
            } else if (player.nightClub.starCoins < (dimensionConfig[player.dimensionLevel] || {}).cost) {
                player.worldMapBattle.autoBattle = false;
                updateWorldMapAutoBattleStatusUI();
                stopAllWorldMapBattles();
                logAction("星币不足，后台自动战斗已停止", "warning");
            }
        }
        return;
    }
    if (bLteZero(monster.health)) {
        backgroundHandleMonsterDefeated();
        return;
    }
    const playerAttack = bigSciToStorageValue(player.battle.playerAttack);
    if (cmpBigSci(playerAttack, 0) <= 0) {
        updatePlayerBattleStats();
        if (cmpBigSci(bigSciToStorageValue(player.battle.playerAttack), 0) <= 0) {
            stopBackgroundBattle();
            logAction("后台自动战斗停止：角色攻击异常", "warning");
            return;
        }
    }
    
    // 计算伤害（考虑暴击）
    let isCrit = Math.random() < player.battle.playerCritRate;
    let damage = isCrit ? multiplyBigByFinite(playerAttack, player.battle.playerCritDamage) : playerAttack;
    if (cmpBigSci(damage, 0) <= 0) {
        updatePlayerBattleStats();
        return;
    }
    
    // 应用伤害
    monster.health = bSub(monster.health, damage);
    
    // 检查怪物是否死亡
    if (bLteZero(monster.health)) {
        backgroundHandleMonsterDefeated();
    } else {
        // 怪物反击
        backgroundMonsterCounterAttack();
    }
    } catch (e) {
        stopBackgroundBattle();
        logAction("后台自动战斗停止：检测到异常并自动保护（" + ((e && e.message) ? e.message : '未知错误') + "）", "warning");
        if (typeof console !== 'undefined' && console.error) console.error('backgroundWorldMapAttackMonster error', e);
    }
}

// 后台怪物反击
function backgroundMonsterCounterAttack() {
    const monster = player.battle.currentMonster;
    if (!monster) return;
    const damage = monster.attack;
    
    // 应用伤害
    player.battle.playerHealth = bSub(player.battle.playerHealth, damage);
    
    // 检查玩家是否死亡
    if (bLteZero(player.battle.playerHealth)) {
        stopBackgroundBattle();
        logAction("你在后台战斗中被怪物击败！", "error");
        updatePlayerBattleStats();
    }
}

// 后台处理怪物被击败
function backgroundHandleMonsterDefeated() {
    if (player.battle._worldMapDefeatBusy) return;
    player.battle._worldMapDefeatBusy = true;
    try {
    const monster = player.battle.currentMonster;
    const zone = player.battle.currentZone;
    const dimension = dimensionConfig[player.dimensionLevel]; 
    if (!monster) return;
    if (!dimension) {
        player.battle.currentMonster = null;
        player.battle.monsterResurrections = 0;
        stopBackgroundBattle();
        logAction("后台自动战斗停止：当前次元配置异常，请重新选择次元", "warning");
        return;
    }
    
    bumpWorldMapMonsterDeathCount();
    
    if (player.battle.monsterResurrections < 3) {
        // 怪物复活（属性增强）
        applyWorldMapMonsterRevive(monster, player.battle.monsterResurrections);
        monster.attack = multiplyBigByFinite(monster.attack, 2);
        
        
        
        backgroundMonsterCounterAttack();
    } else {
        // 怪物真正死亡
        if (!zone || !zone.expRange) {
            player.battle.currentMonster = null;
            player.battle.monsterResurrections = 0;
            updatePlayerBattleStats();
            stopBackgroundBattle();
            logAction("后台自动战斗停止：战斗区域数据丢失，请重新进入世界地图", "warning");
            return;
        }
        const finalExp = calculateWorldMapExpReward(zone, dimension);
        addPlayerExp(finalExp);

       safeWorldMapRewardCall(dropMagicMaterial, '法宝材料');
        safeWorldMapRewardCall(dropRuneMaterials, '符文材料');
        safeWorldMapRewardCall(dropMount, '坐骑');
        safeWorldMapRewardCall(dropWing, '翅膀');
        safeWorldMapRewardCall(tryDropLawPowerMaterial, '法则材料');
        
        if (Math.random() < 0.01) {
            safeWorldMapRewardCall(dropItemsByDimension, '次元掉落');
        }
        safeWorldMapRewardCall(dropReincarnationEquipment, '轮回装备');
       safeWorldMapRewardCall(tryDropBeastAfterBattle, '轮回神兽');
       safeWorldMapRewardCall(tryDropPixelSkinAfterBattle, '像素皮肤');
        
        tryDropNetworkCoinSafe(player.dimensionLevel, function() {
            if (typeof logAction === 'function') logAction('获得联网币 x1', 'success');
        });
        tryDropSupremeArtifactSafe(player.dimensionLevel, function() {
            if (typeof logAction === 'function') logAction('获得至尊神器（已存入账号）', 'legendary');
            if (typeof updatePlayerBattleStats === 'function') updatePlayerBattleStats();
        });
        if (!spawnNextWorldMapMonster({ silent: true })) {
            player.worldMapBattle.autoBattle = false;
            updateWorldMapAutoBattleStatusUI();
            stopAllWorldMapBattles();
            logAction("星币不足，后台自动战斗已停止", "warning");
            return;
        }
    }
    } finally {
        player.battle._worldMapDefeatBusy = false;
    }
}

// 停止后台战斗
function stopBackgroundBattle() {
    clearWorldMapBackgroundBattleTimer();
    if (player.backgroundBattle) player.backgroundBattle.active = false;
}

/** 读档 / 切回标签后：若自动战斗仍为开启且仍在世界中，重新挂上定时器 */
function resumeWorldMapAutoBattleIfNeeded() {
    if (!player || !player.worldMapBattle || !player.worldMapBattle.autoBattle) return;
    syncWorldMapAutoBattleTimers();
}

/** 标签页在后台时浏览器会节流/暂停定时器，切回时按离开时长补算若干次战斗（有上限） */
function catchUpWorldMapBackgroundBattle() {
    if (!player || !player.worldMapBattle || !player.worldMapBattle.autoBattle) return;
    if (!player.battle || !player.battle.currentZone) return;
    var hiddenAt = window._worldMapBattleHiddenAt;
    if (!hiddenAt) return;
    var elapsed = Date.now() - hiddenAt;
    window._worldMapBattleHiddenAt = 0;
    if (elapsed < 1500) return;

    clearWorldMapForegroundBattleTimer();
    stopBackgroundBattle();

    var battleEl = document.getElementById('battleUI');
    var battleUiOpen = battleEl && battleEl.style.display === 'block';
    var tickMs = WORLD_MAP_AUTO_BATTLE_TICK_MS;
    var maxTicks = 90;
    var ticks = Math.min(maxTicks, Math.floor(elapsed / tickMs));
    if (ticks < 1) return;

    for (var i = 0; i < ticks; i++) {
        if (!player.worldMapBattle.autoBattle) break;
        try {
            if (battleUiOpen) worldMapAttackMonster();
            else backgroundWorldMapAttackMonster();
        } catch (e) {
            if (typeof console !== 'undefined' && console.warn) console.warn('world map catch-up tick', e);
            break;
        }
    }
    if (typeof logAction === 'function') {
        logAction('切回页面，已补算世界地图战斗约' + Math.round(elapsed / 1000) + '秒', 'info');
    }
}

function openBattleUI() {
    document.getElementById('battleUI').style.display = 'block';
    document.getElementById('battleOverlay').style.display = 'block';

    updateWorldMapAutoBattleStatusUI();
    if (player.worldMapBattle.autoBattle) {
        syncWorldMapAutoBattleTimers();
    } else {
        stopAllWorldMapBattles();
    }

    updateBattleUI();
    
    // 显示后台战斗日志（先清空再追加；限制条数避免存档异常时 DOM 过多导致卡顿）
    const logContainer = document.getElementById('addbattleLog');
    logContainer.innerHTML = '';
    const logsToShow = (player.battleLog && Array.isArray(player.battleLog) ? player.battleLog : []).slice(0, 100);
    logsToShow.forEach(log => {
        const logElement = document.createElement('div');
        logElement.textContent = typeof log === 'string' ? log : (log && log.message) || String(log);
        logContainer.appendChild(logElement);
    });
    
    // 滚动到底部
    logContainer.scrollTop = logContainer.scrollHeight;
}
// 车辆品牌配置
const vehicleBrands = [
    { id: 1, name: "大众", models: ["Polo", "Golf", "Passat"], rarity: 1 },
    { id: 2, name: "丰田", models: ["卡罗拉", "凯美瑞", "RAV4"], rarity: 2 },
    { id: 3, name: "本田", models: ["思域", "雅阁", "CR-V"], rarity: 3 },
    { id: 4, name: "福特", models: ["福克斯", "蒙迪欧", "探险者"], rarity: 4 },
    { id: 5, name: "日产", models: ["轩逸", "天籁", "奇骏"], rarity: 5 },
    { id: 6, name: "现代", models: ["伊兰特", "索纳塔", "途胜"], rarity: 6 },
    { id: 7, name: "宝马", models: ["3系", "5系", "X5"], rarity: 7 },
    { id: 8, name: "奔驰", models: ["C级", "E级", "GLC"], rarity: 8 },
    { id: 9, name: "奥迪", models: ["A4", "A6", "Q5"], rarity: 9 },
    { id: 10, name: "雷克萨斯", models: ["ES", "RX", "NX"], rarity: 10 },
    { id: 11, name: "沃尔沃", models: ["S60", "S90", "XC60"], rarity: 11 },
    { id: 12, name: "凯迪拉克", models: ["CT5", "XT5", "Escalade"], rarity: 12 },
    { id: 13, name: "保时捷", models: ["911", "Cayenne", "Panamera"], rarity: 13 },
    { id: 14, name: "玛莎拉蒂", models: ["Ghibli", "Levante", "Quattroporte"], rarity: 14 },
    { id: 15, name: "法拉利", models: ["Portofino", "Roma", "SF90"], rarity: 15 },
    { id: 16, name: "兰博基尼", models: ["Huracan", "Aventador", "Urus"], rarity: 16 },
    { id: 17, name: "宾利", models: ["飞驰", "添越", "欧陆"], rarity: 17 },
    { id: 18, name: "劳斯莱斯", models: ["古斯特", "幻影", "库里南"], rarity: 18 },
    { id: 19, name: "迈凯伦", models: ["GT", "720S", "Artura"], rarity: 19 },
    { id: 20, name: "阿斯顿马丁", models: ["DB11", "Vantage", "DBS"], rarity: 20 },
    { id: 21, name: "布加迪", models: ["Chiron", "Divo", "Centodieci"], rarity: 21 },
    { id: 22, name: "柯尼塞格", models: ["Jesko", "Gemera", "Regera"], rarity: 22 },
    { id: 23, name: "帕加尼", models: ["Huayra", "Zonda", "Utopia"], rarity: 23 },
    { id: 24, name: "世爵", models: ["C8", "D12", "B6"], rarity: 24 },
    { id: 25, name: "威兹曼", models: ["GT", "Roadster", "MF5"], rarity: 25 },
    { id: 26, name: "西尔贝", models: ["Tuatara", "Aero", "Ultimate"], rarity: 26 },
    { id: 27, name: "轩尼诗", models: ["Venom F5", "Venom GT", "Exorcist"], rarity: 27 },
    { id: 28, name: "里马克", models: ["C_Two", "Concept_One", "Nevera"], rarity: 28 },
    { id: 29, name: "阿波罗", models: ["IE", "Intensa", "Project Evo"], rarity: 29 },
    { id: 30, name: "Zenvo", models: ["TSR-S", "ST1", "TS1"], rarity: 30 },
    { id: 31, name: "锐马克", models: ["Nevera", "C_Two", "Concept Two"], rarity: 31 },
    { id: 32, name: "宾尼法利纳", models: ["Battista", "PF0", "PF1"], rarity: 32 },
    { id: 33, name: "克钦格", models: ["21C", "22C", "23C"], rarity: 33 },
    { id: 34, name: "SCG", models: ["007 LMH", "008 Stradale", "009 Hypercar"], rarity: 34 },
    { id: 35, name: "唐克沃特", models: ["D8 GTO", "D8 GT", "D8 Spider"], rarity: 35 },
    { id: 36, name: "凡克", models: ["Shield", "P60", "S1"], rarity: 36 },
    { id: 37, name: "梅尔库斯", models: ["RS2000", "RS3000", "RS4000"], rarity: 37 },
    { id: 38, name: "德托马索", models: ["P72", "Valerio", "Mangusta"], rarity: 38 },
    { id: 39, name: "向量", models: ["WX-8", "WX-12", "V12 Supercharged"], rarity: 39 },
    { id: 40, name: "帕诺兹", models: ["Evviva", "Abruzzi", "Roadster"], rarity: 40 },
    { id: 41, name: "阿尔派", models: ["A110 Stradale", "A110 GT", "A110 S"], rarity: 41 },
    { id: 42, name: "路特斯", models: ["Evija", "Emira", "Elise"], rarity: 42 },
    { id: 43, name: "赫尔姆", models: ["Fury", "GT", "Spider"], rarity: 43 },
    { id: 44, name: "泰格鲁斯·腾风", models: ["GT96 T Revival", "AT96 T", "GT96 T Electric"], rarity: 44 },
    { id: 45, name: "Vencer", models: ["Shield", "P60", "S1"], rarity: 45 },
    { id: 46, name: "比扎里尼", models: ["5000 GT", "Strada", "P538"], rarity: 46 },
    { id: 47, name: "BAC Mono", models: ["Mono", "Mono R", "Mono X"], rarity: 47 },
    { id: 48, name: "Panoz", models: ["Evviva", "Abruzzi", "Roadster"], rarity: 48 },
    { id: 49, name: "Fisker", models: ["Pearl", "Ronin", "Force E"], rarity: 49 },
    { id: 50, name: "Koenigsegg", models: ["Jesko Absolut", "Gemera", "Regera"], rarity: 50 }
];

function getParkingGarageCount() {
    return (player.parking && player.parking.vehicles) ? player.parking.vehicles.length : 0;
}
function getParkingGarageFreeSlots() {
    return Math.max(0, SECONDARY_INVENTORY_MAX - getParkingGarageCount());
}
function ensureParkingAutoDecomposeSettings() {
    if (!player.parking) return;
    if (!player.parking.autoDecompose) {
        player.parking.autoDecompose = { enabled: false, maxRarity: 10 };
    }
}
function shouldParkingVehicleAutoDecompose(vehicle) {
    if (!vehicle || vehicle.locked) return false;
    ensureParkingAutoDecomposeSettings();
    return (vehicle.rarity || 0) <= (player.parking.autoDecompose.maxRarity || 10);
}
function runParkingAutoDecompose(silent) {
    if (!player.parking) return 0;
    ensureParkingAutoDecomposeSettings();
    if (!player.parking.autoDecompose.enabled) return 0;
    var totalValue = 0, count = 0;
    player.parking.vehicles = player.parking.vehicles.filter(function (v) {
        if (!shouldParkingVehicleAutoDecompose(v)) return true;
        totalValue += (v.rarity || 0) * 10000;
        count++;
        return false;
    });
    if (count > 0) {
        player.reincarnationCoin = (player.reincarnationCoin || 0) + totalValue;
        if (!silent) logAction('自动分解 ' + count + ' 辆车，获得 ' + totalValue.toLocaleString() + ' 转生币', 'success');
        updateParkingUI();
        updateDisplay();
    }
    return count;
}
function trimParkingGarageOverCap() {
    var over = getParkingGarageCount() - SECONDARY_INVENTORY_MAX;
    if (over <= 0) return 0;
    var sorted = player.parking.vehicles.slice().sort(function (a, b) {
        return (a.rarity || 0) - (b.rarity || 0);
    });
    var trimmed = 0, totalValue = 0;
    for (var i = 0; i < sorted.length && getParkingGarageCount() > SECONDARY_INVENTORY_MAX; i++) {
        var v = sorted[i];
        if (v.locked) continue;
        var idx = player.parking.vehicles.findIndex(function (x) { return x.id === v.id; });
        if (idx >= 0) {
            totalValue += (v.rarity || 0) * 10000;
            player.parking.vehicles.splice(idx, 1);
            trimmed++;
        }
    }
    if (trimmed > 0) {
        player.reincarnationCoin = (player.reincarnationCoin || 0) + totalValue;
        logAction('车库超限，自动分解 ' + trimmed + ' 辆低稀有度车辆', 'info');
    }
    return trimmed;
}
function updateParkingGarageCountDisplay() {
    var el = document.getElementById('parkingGarageCountDisplay');
    if (el) el.textContent = getParkingGarageCount() + '/' + SECONDARY_INVENTORY_MAX;
}
function initParkingAutoDecomposeUI() {
    ensureParkingAutoDecomposeSettings();
    var sel = document.getElementById('parkingAutoDecomposeRarity');
    var btn = document.getElementById('toggleParkingAutoDecompose');
    if (sel) sel.value = String(player.parking.autoDecompose.maxRarity || 10);
    if (btn) {
        btn.textContent = '自动分解：' + (player.parking.autoDecompose.enabled ? '开' : '关');
        btn.style.background = player.parking.autoDecompose.enabled ? '#4CAF50' : '#ff9800';
    }
}
function setParkingAutoDecomposeRarity() {
    var sel = document.getElementById('parkingAutoDecomposeRarity');
    if (!sel || !player.parking) return;
    player.parking.autoDecompose.maxRarity = parseInt(sel.value, 10) || 10;
}
function toggleParkingAutoDecompose() {
    ensureParkingAutoDecomposeSettings();
    player.parking.autoDecompose.enabled = !player.parking.autoDecompose.enabled;
    initParkingAutoDecomposeUI();
    if (player.parking.autoDecompose.enabled) runParkingAutoDecompose(false);
}
function checkParkingAutoDecompose() {
    if (player.parking && player.parking.autoDecompose && player.parking.autoDecompose.enabled) {
        runParkingAutoDecompose(true);
    }
}
function tryPushParkingVehicle(vehicle) {
    if (!vehicle || getParkingGarageFreeSlots() <= 0) return false;
    if (!player.parking) initParkingData();
    player.parking.vehicles.push(vehicle);
    runParkingAutoDecompose(true);
    trimParkingGarageOverCap();
    return true;
}
function syncParkingGarageCaps() {
    if (!player.parking) return;
    initParkingData();
    ensureParkingAutoDecomposeSettings();
    trimParkingGarageOverCap();
    runParkingAutoDecompose(true);
}
// 初始化玩家停车位数据
function initParkingData() {
    if (!player.parking) {
        player.parking = {
            level: 1,
            exp: 0,
            maxSpots: 1,
            vehicles: [],
            parkedVehicles: [],
            lastUpdate: Date.now(),
            totalIncome: 0,
            autoDecompose: { enabled: false, maxRarity: 10 }
        };
    }
    ensureParkingAutoDecomposeSettings();
}

// 切换停车位系统界面
function toggleParkingSystem() {
   if (player.reincarnationCount < 200) {
        alert("需要达到200转才能开启停车场系统！");
        return;
    }
    const ui = document.getElementById('parkingSystemUI');
    const overlay = document.getElementById('parkingSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        syncParkingGarageCaps();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateParkingUI();
    }
}

function closeParkingSystem() {
    document.getElementById('parkingSystemUI').style.display = 'none';
    document.getElementById('parkingSystemOverlay').style.display = 'none';
}

// 更新停车位界面
function updateParkingUI() {
    // 更新基本信息
    document.getElementById('parkingLevel').textContent = player.parking.level;
    document.getElementById('parkingSpotCount').textContent = player.parking.parkedVehicles.length;
    document.getElementById('maxParkingSpots').textContent = player.parking.maxSpots;
    document.getElementById('parkingExp').textContent = player.parking.exp.toFixed(1);
    document.getElementById('nextLevelExp').textContent = getNextLevelExpq();
    document.getElementById('totalParkingIncome').textContent = player.parking.totalIncome.toExponential(1);
    
    // 更新车辆列表
    updateVehicleList();
    
    // 更新停车位显示
    updateParkingSpots();
    
    // 更新分解界面
    updateDecomposeUI();
    updateParkingGarageCountDisplay();
    initParkingAutoDecomposeUI();
}

// 获取下一级所需经验
function getNextLevelExpq() {
    const expRequirements = [100, 200, 300, 400, 600, 800, 1000, 1300, 1700, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 15000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 125000, 150000, 200000, 400000, 600000, 800000, 1000000, 2500000, 5000000, 10000000, 100000000];
    const currentLevel = Math.min(player.parking.level, expRequirements.length);
    return expRequirements[currentLevel - 1];
}

// 更新车辆列表
function updateVehicleList() {
    const container = document.getElementById('vehicleList');
    container.innerHTML = '';
    
    player.parking.vehicles.forEach((vehicle, index) => {
        const rarityColor = getRarityColorq(vehicle.rarity);
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'parking-vehicle-card vehicle-card';
        vehicleCard.style.borderColor = rarityColor;
        vehicleCard.style.boxShadow = `0 0 15px ${rarityColor}40`;
        vehicleCard.dataset.index = index;
        vehicleCard.innerHTML = `
            <div class="brand" style="color:${rarityColor}">${vehicle.brand}</div>
            <div class="model">${vehicle.model}</div>
            <div class="rarity">稀有度 ${vehicle.rarity}</div>
        `;
        vehicleCard.onclick = function() { parkVehicle(index); };
        container.appendChild(vehicleCard);
    });
}

// 根据稀有度获取颜色
function getRarityColorq(rarity) {
    if (rarity <= 5) return '#1E90FF'; // 普通 - 蓝色
    if (rarity <= 10) return '#32CD32'; // 稀有 - 绿色
    if (rarity <= 15) return '#FFD700'; // 史诗 - 金色
    if (rarity <= 20) return '#9370DB'; // 传说 - 紫色
    if (rarity <= 25) return '#013220'; // 传说 - 紫色
    if (rarity <= 30) return '#8a2be2'; // 传说 - 紫色
    if (rarity <= 35) return '#FF1493'; // 传说 - 紫色
    if (rarity <= 45) return '#FF4500'; // 神话 - 橙色
    return '#f44336'; // 至尊 - 粉色
}

// 更新停车位显示
function updateParkingSpots() {
    const container = document.getElementById('parkingSpotsContainer');
    container.innerHTML = '';
    
    for (let i = 0; i < player.parking.maxSpots; i++) {
        const spotCard = document.createElement('div');
        spotCard.className = 'parking-spot-card parking-spot';
        if (i < player.parking.parkedVehicles.length) {
            const vehicle = player.parking.parkedVehicles[i];
            const rarityColor = getRarityColorq(vehicle.rarity);
            const income = calculateParkingIncome(vehicle);
            spotCard.classList.add('filled');
            spotCard.innerHTML = `
                <div class="brand" style="color:${rarityColor}">${vehicle.brand}</div>
                <div class="model">${vehicle.model}</div>
                <div class="income">${income.toLocaleString()} 转生币</div>
                <button type="button" class="unpark-btn" onclick="unparkVehicle(${i})">卸下</button>
            `;
        } else {
            spotCard.innerHTML = '<div class="spot-empty">空闲车位</div>';
        }
        container.appendChild(spotCard);
    }
}
function unparkVehicle(spotIndex) {
    if (spotIndex >= player.parking.parkedVehicles.length) return;
    
    // 获取车辆信息
    const vehicle = player.parking.parkedVehicles[spotIndex];
    
    if (!tryPushParkingVehicle(vehicle)) {
        logAction('车库已满（' + SECONDARY_INVENTORY_MAX + '），无法卸下', 'error');
        return;
    }
    
    // 从停车位移除
    player.parking.parkedVehicles.splice(spotIndex, 1);
    
    // 计算并收取收益
    const income = calculateParkingIncome(vehicle);
    player.reincarnationCoin += income;
    player.parking.totalIncome += income;
    player.parking.exp += income / 10000;
    logAction(`卸下车辆: ${vehicle.brand} ${vehicle.model}, 获得收益 ${income} 转生币`, 'success');
    updateParkingUI();
    
    // 更新显示
    updateParkingDisplay();
    updateDisplay();
    checkTitleUnlocks();
    saveGame();
}

// 计算停车收益
function calculateParkingIncome(vehicle) {
    // 收益 = 车辆稀有度 * 停车时间(小时)
    const hoursParked = (Date.now() - vehicle.parkTime) / (100 * 60 * 60);
    return Math.floor(vehicle.rarity * hoursParked) * 1000;
}

// 停车操作
function parkVehicle(vehicleIndex) {
    // 检查是否有空闲车位
    if (player.parking.parkedVehicles.length >= player.parking.maxSpots) {
        logAction("没有空闲车位了！", "error");
        return;
    }
    
    const vehicle = player.parking.vehicles[vehicleIndex];
    
    // 将车辆移动到停车位
    player.parking.parkedVehicles.push({
        ...vehicle,
        parkTime: Date.now()
    });
    
    // 从车辆列表中移除
    player.parking.vehicles.splice(vehicleIndex, 1);
    
    logAction(`已将 ${vehicle.brand} ${vehicle.model} 停入车位`, "success");
    updateParkingUI();
    saveGame();
}

// 一键停车
function parkAllVehicles() {
    // 计算可停车数量
    const availableSpots = player.parking.maxSpots - player.parking.parkedVehicles.length;
    const vehiclesToPark = Math.min(availableSpots, player.parking.vehicles.length);
    
    if (vehiclesToPark === 0) {
        logAction("没有可停车的车辆或没有空闲车位", "info");
        return;
    }
    
    // 停车操作
    for (let i = 0; i < vehiclesToPark; i++) {
        const vehicle = player.parking.vehicles[0];
        player.parking.parkedVehicles.push({
            ...vehicle,
            parkTime: Date.now()
        });
        player.parking.vehicles.shift();
    }
    
    logAction(`已自动停放 ${vehiclesToPark} 辆车辆`, "success");
    updateParkingUI();
    saveGame();
}

// 收取单个车位收益
function collectParkingIncome(spotIndex) {
    const vehicle = player.parking.parkedVehicles[spotIndex];
    const income = calculateParkingIncome(vehicle);
    
    // 添加收益
    player.reincarnationCoin += income;
    player.parking.totalIncome += income;
    
    // 添加停车经验
    player.parking.exp += income / 10000;
    
    // 重置停车时间
    vehicle.parkTime = Date.now();
    
    logAction(`收取了 ${vehicle.brand} ${vehicle.model} 的停车收益: ${income} 转生币`, "success");
    updateParkingUI();
    updateDisplay();
    saveGame();
}

// 收取所有收益
function collectAllParkingIncome() {
    let totalIncome = 0;
    
    player.parking.parkedVehicles.forEach(vehicle => {
        const income = calculateParkingIncome(vehicle);
        totalIncome += income;
        
        // 添加停车经验
        player.parking.exp += income / 10000;
        
        // 重置停车时间
        vehicle.parkTime = Date.now();
    });
    
    // 添加收益
    player.reincarnationCoin += totalIncome;
    player.parking.totalIncome += totalIncome;
    
    logAction(`收取了所有停车收益: ${totalIncome} 转生币`, "success");
    updateParkingUI();
    updateDisplay();
   checkTitleUnlocks();
    saveGame();
}

// 按稀有度批量选择车辆
function selectByRarity(maxRarity) {
    player.parking.vehicles.forEach((vehicle, index) => {
        const checkbox = document.getElementById(`vehicleCheckbox${index}`);
        if (checkbox) {
            checkbox.checked = vehicle.rarity <= maxRarity;
        }
    });
    logAction(`已选择稀有度${maxRarity}及以下的车辆`, "info");
}

// 全选车辆
function selectAllVehicles() {
    player.parking.vehicles.forEach((vehicle, index) => {
        const checkbox = document.getElementById(`vehicleCheckbox${index}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    logAction("已选择所有车辆", "info");
}

// 取消全选
function deselectAllVehicles() {
    player.parking.vehicles.forEach((vehicle, index) => {
        const checkbox = document.getElementById(`vehicleCheckbox${index}`);
        if (checkbox) {
            checkbox.checked = false;
        }
    });
    logAction("已取消选择所有车辆", "info");
}

// 修改更新分解界面的函数，确保每个车辆都有唯一的checkbox ID
function updateDecomposeUI() {
    const container = document.getElementById('decomposeVehicleContainer');
    container.innerHTML = '';
    
    if (player.parking.vehicles.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.4); padding: 20px; font-size: 12px;">车库中没有可分解的车辆</div>';
        return;
    }
    
    player.parking.vehicles.forEach((vehicle, index) => {
        const rarityColor = getRarityColorq(vehicle.rarity);
        const decomposeValue = vehicle.rarity * 10000;
        const vehicleDiv = document.createElement('div');
        vehicleDiv.className = 'parking-decompose-item decompose-vehicle-item';
        vehicleDiv.style.borderColor = rarityColor;
        vehicleDiv.innerHTML = `
            <input type="checkbox" id="vehicleCheckbox${index}">
            <div class="info">
                <div class="brand-model" style="color:${rarityColor}">${vehicle.brand} ${vehicle.model}</div>
                <div class="rarity-line">稀有度 <span style="color:${rarityColor}">${vehicle.rarity}</span></div>
            </div>
            <div class="value">
                <div>${decomposeValue.toLocaleString()}</div>
                <div class="value-unit">转生币</div>
            </div>
        `;
        container.appendChild(vehicleDiv);
    });
}

// 修改分解选中车辆函数，增加确认对话框
function decomposeSelectedVehicle() {
    const vehiclesToDecompose = [];
    
    // 收集选中的车辆
    player.parking.vehicles.forEach((vehicle, index) => {
        const checkbox = document.getElementById(`vehicleCheckbox${index}`);
        if (checkbox && checkbox.checked) {
            vehiclesToDecompose.push({
                index,
                vehicle
            });
        }
    });
    
    if (vehiclesToDecompose.length === 0) {
        logAction("请选择要分解的车辆", "error");
        return;
    }
    
    // 计算总收益和显示信息
    let totalValue = 0;
    let vehicleList = "";
    
    vehiclesToDecompose.forEach(item => {
        totalValue += item.vehicle.rarity * 10000;
        vehicleList += `\n${item.vehicle.brand} ${item.vehicle.model} (稀有度${item.vehicle.rarity})`;
    });
    
    // 显示确认对话框
    showCustomConfirm(
        `确定要分解以下 ${vehiclesToDecompose.length} 辆车辆吗？${vehicleList}\n\n总计可获得: ${totalValue.toLocaleString()} 转生币`,
        (confirmed) => {
            if (confirmed) {
                // 从高索引到低索引删除，避免索引变化问题
                vehiclesToDecompose.sort((a, b) => b.index - a.index);
                vehiclesToDecompose.forEach(item => {
                    player.parking.vehicles.splice(item.index, 1);
                });
                
                // 添加收益
                player.reincarnationCoin += totalValue;
                
                logAction(`分解了 ${vehiclesToDecompose.length} 辆车辆，获得 ${totalValue.toLocaleString()} 转生币`, "success");
                updateParkingUI();
                updateDisplay();
                saveGame();
            }
        }
    );
}

// 升级停车位
function upgradeParking() {
    const requiredExp = getNextLevelExpq();
    
    if (player.parking.exp < requiredExp) {
        logAction(`经验不足！需要 ${requiredExp} 经验`, "error");
        return;
    }
    
    // 扣除经验
    player.parking.exp -= requiredExp;
    
    // 升级
    player.parking.level++;
    player.parking.maxSpots++;
    
    logAction(`停车位升级到 ${player.parking.level} 级！最大车位增加到 ${player.parking.maxSpots}`, "success");
    updateParkingUI();
    saveGame();
}
// 在农场收获时获得车辆
function onFarmHarvest() {
 if (Math.random() < 0.2) {
        // 根据品阶设置掉落概率
        const rand = Math.random();
        let rarityRange;
        
        if (rand < 0.70) {
            rarityRange = [1, 7];
        } else if (rand < 0.88) {
            rarityRange = [8, 14];
        } else if (rand < 0.96) {
           rarityRange = [15, 22];
            } else if (rand < 0.99) {
           rarityRange = [23, 30];
        } else if (rand < 0.998) {
            rarityRange = [31, 38];
        } else if (rand < 0.9999) {
            rarityRange = [39, 44];
        } else {
            rarityRange = [45, 50];
        }
        
        // 在指定品阶范围内筛选符合条件的车辆
        const eligibleBrands = vehicleBrands.filter(brand => 
            brand.rarity >= rarityRange[0] && brand.rarity <= rarityRange[1]
        );
        
        if (eligibleBrands.length > 0) {
            // 随机选择一个品牌
            const brand = eligibleBrands[Math.floor(Math.random() * eligibleBrands.length)];
            
            // 随机选择型号
            const model = brand.models[Math.floor(Math.random() * brand.models.length)];
            
            // 创建车辆对象
            const newVehicle = {
                id: 'vehicle_' + Date.now(),
                brand: brand.name,
                model: model,
                rarity: brand.rarity,
                parkTime: 0,
                income: 0
            };
            
            if (tryPushParkingVehicle(newVehicle)) {
                logAction(`收获时获得了一辆${brand.name} ${model}（品阶${brand.rarity}）！`, "success");
            } else {
                logAction(`收获获得${brand.name} ${model}，但车库已满（${SECONDARY_INVENTORY_MAX}）`, "warning");
            }
        }
    }
}
function calculateOfflineParkingIncome() {
    const now = Date.now();
    const elapsed = now - player.parking.lastUpdate;
    
    player.parking.parkedVehicles.forEach(vehicle => {
        const income = vehicle.rarity * (elapsed / (100 * 60 * 60)); // 每小时收益
        player.parking.totalIncome += income;
        player.parking.exp += income / 10000;
    });
    
    player.parking.lastUpdate = now;
}
// 星域探索系统数据
const explorationData = {
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
};

/** 星域资源唯一数据源（界面、存档、兑换商店均读写此对象） */
function getExplorationResources() {
    if (!explorationData.resources) {
        explorationData.resources = { stardust: 0, darkMatter: 0, cosmicCrystal: 0, artifactFragment: 0 };
    }
    return explorationData.resources;
}

/** 将 explorationData 写回 player.exploration，保证存档与内存一致 */
function syncExplorationDataToPlayer() {
    try {
        if (typeof player === 'undefined' || !player) return;
        player.exploration = {
            speed: explorationData.speed,
            capacity: explorationData.capacity,
            durability: explorationData.durability,
            resources: getExplorationResources(),
            activeMission: explorationData.activeMission,
            missionEndTime: explorationData.missionEndTime,
            logs: explorationData.logs
        };
    } catch (e) { /* player 未就绪 */ }
}

/** 读档后若 player 与 explorationData 曾分叉，取较大值避免误清空 */
function mergeExplorationResourcesFromPlayer() {
    try {
        if (typeof player === 'undefined' || !player || !player.exploration || !player.exploration.resources) return;
        var pr = player.exploration.resources;
        var er = getExplorationResources();
        ['stardust', 'darkMatter', 'cosmicCrystal', 'artifactFragment'].forEach(function(k) {
            var pv = Number(pr[k]) || 0;
            var ev = Number(er[k]) || 0;
            if (pv > ev) er[k] = pv;
        });
    } catch (e) { /* 忽略 */ }
}

/** 从存档对象恢复星域探索数据到全局 explorationData（用于加载/导入后避免舰队属性变1级）；loadSave 可能早于 explorationData 定义执行，用 try-catch 避免 TDZ 报错 */
function restoreExplorationDataFromSave(save) {
    try {
        var exp = (save && save.exploration) ? save.exploration : save;
        if (!exp || typeof exp !== 'object') return;
        if (exp.speed && typeof exp.speed.level === 'number') {
            explorationData.speed.level = exp.speed.level;
            if (typeof exp.speed.cost === 'number' || typeof exp.speed.cost === 'string') explorationData.speed.cost = exp.speed.cost;
        }
        if (exp.capacity && typeof exp.capacity.level === 'number') {
            explorationData.capacity.level = exp.capacity.level;
            if (typeof exp.capacity.cost === 'number' || typeof exp.capacity.cost === 'string') explorationData.capacity.cost = exp.capacity.cost;
        }
        if (exp.durability && typeof exp.durability.level === 'number') {
            explorationData.durability.level = exp.durability.level;
            if (typeof exp.durability.cost === 'number' || typeof exp.durability.cost === 'string') explorationData.durability.cost = exp.durability.cost;
        }
        if (exp.resources && typeof exp.resources === 'object') {
            if (typeof exp.resources.stardust === 'number') explorationData.resources.stardust = exp.resources.stardust;
            if (typeof exp.resources.darkMatter === 'number') explorationData.resources.darkMatter = exp.resources.darkMatter;
            if (typeof exp.resources.cosmicCrystal === 'number') explorationData.resources.cosmicCrystal = exp.resources.cosmicCrystal;
            if (typeof exp.resources.artifactFragment === 'number') explorationData.resources.artifactFragment = exp.resources.artifactFragment;
        }
        explorationData.activeMission = exp.activeMission ?? null;
        explorationData.missionEndTime = exp.missionEndTime ?? 0;
        if (Array.isArray(exp.logs)) explorationData.logs = exp.logs;
        mergeExplorationResourcesFromPlayer();
        syncExplorationDataToPlayer();
    } catch (e) {
        /* explorationData 尚未初始化时跳过恢复，避免存档加载失败 */
    }
}

// 任务配置
const missions = {
    easy: {
        name: "近地星域",
        time: 120, // 分钟
        rewards: {
            stardust: { min: 1, max: 15 },
            darkMatter: { min: 1, max: 15 }
        },
        damageRisk: 50
    },
    medium: {
        name: "深空星域",
        time: 180,
        rewards: { 
            stardust: { min: 1, max: 25 },
            darkMatter: { min: 1, max: 30 },
             cosmicCrystal: { min: 1, max: 20 }
        },
        damageRisk: 60
    },
    hard: {
        name: "黑洞边缘",
        time: 240,
        rewards: {
            stardust: { min: 1, max: 50 },
            darkMatter: { min: 1, max: 50 },
            cosmicCrystal: { min: 1, max: 50 }
        },
        damageRisk: 70
    },
    extreme: {
        name: "宇宙边缘",
        time: 360,
        rewards: {
            cosmicCrystal: { min: 1, max: 50 },
            artifactFragment: { min: 1, max: 50 }
        },
        damageRisk: 80
    }
};

// 切换探索系统界面
function toggleExplorationSystem() {
    if (player.reincarnationCount < 300) {
        alert("需要达到300转才能开启星域探索！");
        return;
    }
    const ui = document.getElementById('explorationSystemUI');
    const overlay = document.getElementById('explorationSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateExplorationUI();
    }
}

// 更新探索系统界面
function updateExplorationUI() {
    // 更新资源仓库显示
    document.getElementById('speedLevel').textContent = explorationData.speed.level;
    document.getElementById('capacityLevel').textContent = explorationData.capacity.level;
    document.getElementById('durabilityLevel').textContent = explorationData.durability.level;
    
    // 计算属性效果
    const speedEffect = 60 - (explorationData.speed.level - 1) * 5;
    const capacityEffect = 100 + (explorationData.capacity.level - 1) * 20;
    const durabilityEffect = 5 + (explorationData.durability.level - 1) * 2;
    const damageReduction = 10 - (explorationData.durability.level - 1) * 1;
    
    document.getElementById('explorationTime').textContent = Math.max(10, speedEffect);
    document.getElementById('resourceGain').textContent = capacityEffect + '%';
    document.getElementById('rareRate').textContent = durabilityEffect + '%';
    document.getElementById('damageRate').textContent = Math.max(1, damageReduction) + '%';
    
    // 更新资源显示
    document.getElementById('stardustCount').textContent = explorationData.resources.stardust || 0;
    document.getElementById('darkMatterCount').textContent = explorationData.resources.darkMatter || 0;
    document.getElementById('cosmicCrystalCount').textContent = explorationData.resources.cosmicCrystal || 0;
    document.getElementById('artifactFragmentCount').textContent = explorationData.resources.artifactFragment || 0;
    
    // 更新任务按钮状态
    const missionButtons = document.querySelectorAll('.start-mission-btn');
    missionButtons.forEach(button => {
        if (explorationData.activeMission) {
            button.disabled = true;
            button.textContent = "任务进行中";
        } else {
            button.disabled = false;
            button.textContent = "开始探索";
        }
    });
    
    // 更新任务时间显示（应用速度加成）- 修复部分
    const missionCards = document.querySelectorAll('.mission-card');
    missionCards.forEach(card => {
        const difficulty = card.getAttribute('data-difficulty');
         // 添加安全检查
        if (!missions[difficulty]) {
            console.error("未找到任务配置:", difficulty);
            return; // 跳过这个卡片
        }
   
        
        const mission = missions[difficulty];
        const baseTime = mission.time;
        const actualTime = Math.max(10, baseTime - (explorationData.speed.level - 1) * 5);
        card.querySelector('.mission-time').textContent = actualTime + "分钟";
        
        // 应用耐久加成后的损坏率
        const baseRisk = mission.damageRisk;
        const actualRisk = Math.max(1, baseRisk - (explorationData.durability.level - 1));
        card.querySelector('.damage-risk').textContent = actualRisk + "%";
    });
    
    // 更新属性升级按钮的显示
    const attributes = ['speed', 'capacity', 'durability'];
    attributes.forEach(attr => {
        const btn = document.querySelector(`.upgrade-btn[data-attr="${attr}"]`);
        if (btn) {
            const cost = explorationData[attr].cost;
            btn.textContent = `升级 (${formatNumber(cost)}转生币)`;
            btn.disabled = cmpBigSci(player.reincarnationCoin, cost) < 0;
        }
    });

    // 更新日志
    updateExplorationLog();
    
    // 如果有进行中的任务，显示倒计时
    if (explorationData.activeMission) {
        const remaining = Math.max(0, explorationData.missionEndTime - Date.now());
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        addLog(`任务进行中: ${missions[explorationData.activeMission]?.name || '未知任务'} - 剩余: ${minutes}分${seconds}秒`);
        
        if (remaining <= 0) {
            completeMission();
        }
    }
}

// 升级属性（转生币与消耗支持 >1e308 科学计数字符串）
function upgradeAttribute(attribute) {
    const cost = explorationData[attribute].cost;
    
    if (cmpBigSci(player.reincarnationCoin, cost) >= 0) {
        player.reincarnationCoin = bigSciToStorageValue(subBigSci(player.reincarnationCoin, cost));
        explorationData[attribute].level++;
        explorationData[attribute].cost = bigSciToStorageValue(mulBigSci(cost, 10));
        
        addLog(`${attribute === 'speed' ? '速度' : attribute === 'capacity' ? '容量' : '耐久'}升级到 ${explorationData[attribute].level}级`);
        updateExplorationUI();
        logAction(`星域探索: ${attribute}升级成功`, 'success');
    } else {
        logAction(`转生币不足！需要${formatNumber(cost)}转生币`, "error");
    }
}

// 一键升级全部属性
function upgradeAllAttributes() {
    const attributes = ['speed', 'capacity', 'durability'];
    let upgraded = false;
    
    attributes.forEach(attr => {
        while (cmpBigSci(player.reincarnationCoin, explorationData[attr].cost) >= 0) {
            const cost = explorationData[attr].cost;
            player.reincarnationCoin = bigSciToStorageValue(subBigSci(player.reincarnationCoin, cost));
            explorationData[attr].level++;
            explorationData[attr].cost = bigSciToStorageValue(mulBigSci(cost, 10));
            upgraded = true;
        }
    });
    
    if (upgraded) {
        addLog("一键升级全部属性成功");
        updateExplorationUI();
        logAction("星域探索: 一键升级成功", 'success');
    } else {
        const costs = attributes.map(attr => explorationData[attr].cost);
        let minCost = costs[0];
        for (let i = 1; i < costs.length; i++) {
            if (cmpBigSci(costs[i], minCost) < 0) minCost = costs[i];
        }
        logAction(`转生币不足，至少需要${formatNumber(minCost)}转生币才能升级任一属性`, "error");
    }
}

// 开始任务
function startMission(difficulty) {
    if (explorationData.activeMission) {
        logAction("已有任务进行中", "error");
        return;
    }
    
    // 计算实际任务时间（应用速度加成）
    const baseTime = missions[difficulty].time;
    const actualTime = Math.max(10, baseTime - (explorationData.speed.level - 1) * 5) * 60000;
    
    explorationData.activeMission = difficulty;
    explorationData.missionEndTime = Date.now() + actualTime;
    
    addLog(`开始探索: ${missions[difficulty].name} - 预计完成时间: ${new Date(explorationData.missionEndTime).toLocaleTimeString()}`);
    updateExplorationUI();
    
    // 设置任务完成检查
    setTimeout(completeMission, actualTime);
    
    // 立即保存游戏
    saveGame();
}

// 完成任务
function completeMission() {
    if (!explorationData.activeMission) return;
    
    const mission = missions[explorationData.activeMission];
    const difficulty = explorationData.activeMission;
    
    // 计算实际损坏率（应用耐久加成）
    const baseRisk = mission.damageRisk;
    const actualRisk = Math.max(1, baseRisk - (explorationData.durability.level - 1));
    
    // 检查是否发生损坏
    let damaged = false;
    if (Math.random() * 100 < actualRisk) {
        damaged = true;
        addLog(`任务完成，但舰队受到损坏！`);
    } else {
        addLog(`任务成功完成: ${mission.name}`);
    }
    
    // 计算资源获取（应用容量加成）
    const capacityMultiplier = 1 + (explorationData.capacity.level - 1) * 0.2;
    
    // 发放发票奖励（不再是直接发放资源）
    let rewards = "";
    for (const resource in mission.rewards) {
        const min = mission.rewards[resource].min;
        const max = mission.rewards[resource].max;
        let amount = Math.floor((Math.random() * (max - min + 1) + min) * capacityMultiplier);
    
        if (damaged) {
            amount = Math.floor(amount * 0.2); // 损坏时奖励减半
        }
        
        // 根据资源类型确定对应的发票类型
        let ticketType;
        switch(resource) {
            case 'stardust':
                ticketType = 'yuzhou1';
                break;
            case 'darkMatter':
                ticketType = 'yuzhou2';
                break;
            case 'cosmicCrystal':
                ticketType = 'yuzhou3';
                break;
            case 'artifactFragment':
                ticketType = 'yuzhou4';
                break;
            default:
                ticketType = null;
        }
        
        if (ticketType) {
            // 将发票数量加到player.items中
            player.items[ticketType] = (player.items[ticketType] || 0) + amount;
            rewards += `${getTicketName(ticketType)}: ${amount} `;
        }
    }
    
    addLog(`获得奖励: ${rewards}`);
    
    // 重置任务状态
    explorationData.activeMission = null;
    explorationData.missionEndTime = 0;
    
    updateExplorationUI();
    saveGame();
}

// 获取发票名称
function getTicketName(ticketType) {
    const names = {
        'yuzhou1': '星尘发票',
        'yuzhou2': '暗物质发票',
        'yuzhou3': '宇宙晶体发票',
        'yuzhou4': '神器碎片发票'
    };
    return names[ticketType] || ticketType;
}

// 添加日志
function addLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    explorationData.logs.unshift(`[${timestamp}] ${message}`);
    
    if (explorationData.logs.length > 20) {
        explorationData.logs.pop();
    }
    
    updateExplorationLog();
}

// 更新日志显示
function updateExplorationLog() {
    const logContainer = document.getElementById('explorationLog');
    logContainer.innerHTML = explorationData.logs.map(log => 
        `<div class="log-entry">${log}</div>`
    ).join('');
}

/** loadSave 可能早于 explorationData 定义执行，用 try-catch 避免 TDZ 报错 */
function initExplorationSystem() {
    try {
        explorationData.speed = explorationData.speed || { level: 1, cost: 100 };
        explorationData.capacity = explorationData.capacity || { level: 1, cost: 100 };
        explorationData.durability = explorationData.durability || { level: 1, cost: 100 };
        explorationData.resources = explorationData.resources || {
            stardust: 0,
            darkMatter: 0,
            cosmicCrystal: 0,
            artifactFragment: 0
        };
        explorationData.activeMission = explorationData.activeMission || null;
        explorationData.missionEndTime = explorationData.missionEndTime || 0;
        explorationData.logs = explorationData.logs || [];
        
        if (explorationData.activeMission && explorationData.missionEndTime > Date.now()) {
            var remaining = explorationData.missionEndTime - Date.now();
            setTimeout(completeMission, remaining);
            if (typeof addLog === 'function') addLog('恢复进行中的探索任务: ' + (missions[explorationData.activeMission] && missions[explorationData.activeMission].name) + ' - 剩余时间: ' + Math.floor(remaining/60000) + '分钟');
        } else if (explorationData.activeMission && explorationData.missionEndTime <= Date.now()) {
            completeMission();
        }
        mergeExplorationResourcesFromPlayer();
        syncExplorationDataToPlayer();
    } catch (e) {
        /* explorationData 尚未初始化时跳过，避免存档加载失败 */
    }
}
// 切换兑换商店显示
function toggleExchangeShop() {
    if (player.reincarnationCount < 300) {

        alert("需要达到300转才能开启星域探索！");

        return;

    }
    const overlay = document.getElementById('exchangeShopOverlay');
    const ui = document.getElementById('exchangeShopUI');
    
    if (ui.style.display === 'none') {
        // 打开商店时更新显示
        updateExchangeDisplay();
        overlay.style.display = 'block';
        ui.style.display = 'block';
    } else {
        overlay.style.display = 'none';
        ui.style.display = 'none';
    }
}

// 更新兑换商店显示
function updateExchangeDisplay() {
    var res = getExplorationResources();
    // 更新资源数量
    document.getElementById('currentStardustExchange').textContent = res.stardust || 0;
    document.getElementById('currentDarkMatterExchange').textContent = res.darkMatter || 0;
    document.getElementById('currentCosmicCrystalExchange').textContent = res.cosmicCrystal || 0;
    document.getElementById('currentArtifactFragmentExchange').textContent = res.artifactFragment || 0;
    
    // 更新发票数量
    document.getElementById('currentStardustTicket').textContent = player.items.yuzhou1 || 0;
    document.getElementById('currentDarkMatterTicket').textContent = player.items.yuzhou2 || 0;
    document.getElementById('currentCosmicCrystalTicket').textContent = player.items.yuzhou3 || 0;
    document.getElementById('currentArtifactFragmentTicket').textContent = player.items.yuzhou4 || 0;
}

// 资源兑换函数
function exchangeResource(resourceType, direction) {
    // 确定兑换数量和输入框
    let amountInput, amount;
    let ticketType;
    
    switch(resourceType) {
        case 'stardust':
            amountInput = document.getElementById('stardustAmount');
            ticketType = 'yuzhou1';
            break;
        case 'darkMatter':
            amountInput = document.getElementById('darkMatterAmount');
            ticketType = 'yuzhou2';
            break;
        case 'cosmicCrystal':
            amountInput = document.getElementById('cosmicCrystalAmount');
            ticketType = 'yuzhou3';
            break;
        case 'artifactFragment':
            amountInput = document.getElementById('artifactFragmentAmount');
            ticketType = 'yuzhou4';
            break;
    }
    
    amount = parseInt(amountInput.value);
    if (isNaN(amount) || amount < 1) {
        logAction("请输入有效的兑换数量", "error");
        return;
    }
    
    var res = getExplorationResources();
    if (direction === 'toTicket') {
        // 资源兑换发票
        if ((res[resourceType] || 0) < amount) {
            logAction(`${getResourceName(resourceType)}不足`, "error");
            return;
        }
        
        res[resourceType] -= amount;
        player.items[ticketType] = (player.items[ticketType] || 0) + amount;
        
        logAction(`成功将${amount}个${getResourceName(resourceType)}兑换为${amount}张${getTicketName(ticketType)}`, "success");
    } else {
        // 发票兑换资源
        if ((player.items[ticketType] || 0) < amount) {
            logAction(`${getTicketName(ticketType)}不足`, "error");
            return;
        }
        
        player.items[ticketType] -= amount;
        res[resourceType] = (res[resourceType] || 0) + amount;
        
        logAction(`成功将${amount}张${getTicketName(ticketType)}兑换为${amount}个${getResourceName(resourceType)}`, "success");
    }
    
    syncExplorationDataToPlayer();
    updateExchangeDisplay();
    if (typeof updateExplorationUI === 'function') updateExplorationUI();
    saveGame();
}

// 获取资源名称
function getResourceName(type) {
    const names = {
        'stardust': '星尘',
        'darkMatter': '暗物质',
        'cosmicCrystal': '宇宙晶体',
        'artifactFragment': '神器碎片'
    };
    return names[type] || type;
}

// 获取发票名称
function getTicketName(type) {
    const names = {
        'yuzhou1': '星尘发票',
        'yuzhou2': '暗物质发票',
        'yuzhou3': '宇宙晶体发票',
        'yuzhou4': '神器碎片发票'
    };
    return names[type] || type;
}
// 神器部位配置
const artifactParts = [
    { id: "helmet", name: "头盔" },
    { id: "clothes", name: "衣服" },
    { id: "pants", name: "裤子" },
    { id: "shoes", name: "鞋子" },
    { id: "necklace", name: "项链" },
    { id: "weapon", name: "武器" }
];

// 神器品质配置
const artifactQualities = [
    { id: "common", name: "普通", color: "#FFFFFF", minBonus: 0.1, maxBonus: 1 },
    { id: "uncommon", name: "精良", color: "#1E90FF", minBonus: 0.5, maxBonus: 5 },
    { id: "rare", name: "稀有", color: "#9B30FF", minBonus: 1, maxBonus: 10 },
    { id: "epic", name: "史诗", color: "#FF4500", minBonus: 2, maxBonus: 20 },
    { id: "legendary", name: "传说", color: "#FFD700", minBonus: 5, maxBonus: 50 },
    { id: "mythic", name: "神话", color: "#FF1493", minBonus: 10, maxBonus: 100 }
];
const ARTIFACT_QUALITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
const ARTIFACT_PAGE_SIZE = 24;

function getArtifactInventoryCount() {
    return (player.artifacts && player.artifacts.inventory) ? player.artifacts.inventory.length : 0;
}
function getArtifactInventoryFreeSlots() {
    return Math.max(0, ARTIFACT_INVENTORY_MAX - getArtifactInventoryCount());
}
function ensureArtifactAutoDecomposeSettings() {
    if (!player.artifacts) return;
    if (!player.artifacts.autoDecompose) {
        player.artifacts.autoDecompose = { enabled: false, belowQuality: 'common', keepSets: [] };
    }
    if (!Array.isArray(player.artifacts.autoDecompose.keepSets)) {
        player.artifacts.autoDecompose.keepSets = [];
    }
    if (player.artifacts.inventoryPage == null) player.artifacts.inventoryPage = 0;
}
function getArtifactQualityIndex(qualityId) {
    var i = ARTIFACT_QUALITY_ORDER.indexOf(qualityId);
    return i >= 0 ? i : 0;
}
function shouldArtifactAutoDecompose(artifact) {
    if (!artifact || artifact.locked) return false;
    ensureArtifactAutoDecomposeSettings();
    var cfg = player.artifacts.autoDecompose;
    if (cfg.keepSets && cfg.keepSets.indexOf(artifact.set) >= 0) return false;
    var threshold = getArtifactQualityIndex(cfg.belowQuality || 'common');
    return getArtifactQualityIndex(artifact.quality) <= threshold;
}
function applyArtifactDecomposeRewards(artifact) {
    var rewards = calculateDecompositionReward(artifact);
    var expRes = getExplorationResources();
    expRes.artifactFragment = (expRes.artifactFragment || 0) + rewards.fragments;
    expRes.cosmicCrystal = (expRes.cosmicCrystal || 0) + rewards.crystals;
    syncExplorationDataToPlayer();
    return rewards;
}
function removeArtifactFromInventoryById(artifactId) {
    var idx = player.artifacts.inventory.findIndex(function (a) { return a.id === artifactId; });
    if (idx === -1) return null;
    return player.artifacts.inventory.splice(idx, 1)[0];
}
function runArtifactAutoDecompose(silent) {
    ensureArtifactAutoDecomposeSettings();
    if (!player.artifacts.autoDecompose.enabled) return 0;
    var totalFragments = 0, totalCrystals = 0, count = 0;
    var toRemove = player.artifacts.inventory.filter(shouldArtifactAutoDecompose).map(function (a) { return a.id; });
    toRemove.forEach(function (id) {
        var artifact = removeArtifactFromInventoryById(id);
        if (!artifact) return;
        var r = applyArtifactDecomposeRewards(artifact);
        totalFragments += r.fragments;
        totalCrystals += r.crystals;
        count++;
    });
    if (count > 0) {
        cleanupArtifactAdvanceLevels();
        if (!silent) {
            logAction('自动分解 ' + count + ' 件神器，获得碎片 ' + totalFragments + '、晶体 ' + totalCrystals, 'success');
        }
        updateArtifactUI();
        updateExplorationUI();
    }
    return count;
}
function trimArtifactInventoryOverCap() {
    var over = getArtifactInventoryCount() - ARTIFACT_INVENTORY_MAX;
    if (over <= 0) return 0;
    var sorted = player.artifacts.inventory.slice().sort(function (a, b) {
        var qa = getArtifactQualityIndex(a.quality);
        var qb = getArtifactQualityIndex(b.quality);
        if (qa !== qb) return qa - qb;
        return (a.upgradeLevel || 0) - (b.upgradeLevel || 0);
    });
    var trimmed = 0;
    for (var i = 0; i < sorted.length && trimmed < over; i++) {
        var art = sorted[i];
        if (art.locked) continue;
        if (removeArtifactFromInventoryById(art.id)) {
            applyArtifactDecomposeRewards(art);
            trimmed++;
        }
    }
    for (var j = 0; j < sorted.length && getArtifactInventoryCount() > ARTIFACT_INVENTORY_MAX; j++) {
        var art2 = sorted[j];
        if (!art2.locked && removeArtifactFromInventoryById(art2.id)) {
            applyArtifactDecomposeRewards(art2);
            trimmed++;
        }
    }
    if (trimmed > 0) {
        cleanupArtifactAdvanceLevels();
        logAction('仓库超过上限，已自动分解 ' + trimmed + ' 件低品阶神器（请开启自动分解并保留套装）', 'info');
    }
    return trimmed;
}
function updateArtifactInventoryCountDisplay() {
    var el = document.getElementById('artifactInventoryCountDisplay');
    var hint = document.getElementById('artifactInventoryFullHint');
    var cnt = getArtifactInventoryCount();
    if (el) el.textContent = cnt + '/' + ARTIFACT_INVENTORY_MAX;
    if (hint) hint.style.display = cnt >= ARTIFACT_INVENTORY_MAX ? 'inline' : 'none';
}
function toggleArtifactAutoDecompose() {
    ensureArtifactAutoDecomposeSettings();
    player.artifacts.autoDecompose.enabled = !player.artifacts.autoDecompose.enabled;
    var btn = document.getElementById('toggleArtifactAutoDecompose');
    if (btn) {
        btn.textContent = '自动分解：' + (player.artifacts.autoDecompose.enabled ? '开' : '关');
        btn.style.background = player.artifacts.autoDecompose.enabled ? '#4CAF50' : '#ff9800';
    }
    logAction((player.artifacts.autoDecompose.enabled ? '开启' : '关闭') + '神器自动分解', 'info');
    if (player.artifacts.autoDecompose.enabled) runArtifactAutoDecompose(false);
}
function setArtifactAutoDecomposeQuality() {
    var sel = document.getElementById('artifactAutoDecomposeQuality');
    if (!sel) return;
    ensureArtifactAutoDecomposeSettings();
    player.artifacts.autoDecompose.belowQuality = sel.value;
}
function toggleArtifactKeepSet(setName, checked) {
    ensureArtifactAutoDecomposeSettings();
    var list = player.artifacts.autoDecompose.keepSets;
    var idx = list.indexOf(setName);
    if (checked && idx < 0) list.push(setName);
    else if (!checked && idx >= 0) list.splice(idx, 1);
}
function initArtifactKeepSetsUI() {
    var box = document.getElementById('artifactKeepSetsBox');
    if (!box) return;
    ensureArtifactAutoDecomposeSettings();
    var keep = player.artifacts.autoDecompose.keepSets;
    var setNames = artifactSets.map(function (s) { return s.name; });
    box.innerHTML = setNames.map(function (name) {
        var checked = keep.indexOf(name) >= 0 ? ' checked' : '';
        var safe = name.replace(/'/g, "\\'");
        return '<label style="cursor:pointer;color:#ccc;white-space:nowrap;"><input type="checkbox"' + checked + ' onchange="toggleArtifactKeepSet(\'' + safe + '\', this.checked)" style="vertical-align:middle;margin-right:3px;">' + name + '</label>';
    }).join('');
}
function initArtifactAutoDecomposeUI() {
    ensureArtifactAutoDecomposeSettings();
    var sel = document.getElementById('artifactAutoDecomposeQuality');
    if (sel) sel.value = player.artifacts.autoDecompose.belowQuality || 'common';
    var btn = document.getElementById('toggleArtifactAutoDecompose');
    if (btn) {
        btn.textContent = '自动分解：' + (player.artifacts.autoDecompose.enabled ? '开' : '关');
        btn.style.background = player.artifacts.autoDecompose.enabled ? '#4CAF50' : '#ff9800';
    }
    initArtifactKeepSetsUI();
}
function changeArtifactInventoryPage(delta) {
    var filtered = getFilteredArtifacts();
    var maxPage = Math.max(0, Math.ceil(filtered.length / ARTIFACT_PAGE_SIZE) - 1);
    if (!player.artifacts.inventoryPage) player.artifacts.inventoryPage = 0;
    player.artifacts.inventoryPage = Math.min(maxPage, Math.max(0, player.artifacts.inventoryPage + delta));
    updateArtifactInventory();
}
function checkArtifactAutoDecompose() {
    if (!player.artifacts || !player.artifacts.autoDecompose || !player.artifacts.autoDecompose.enabled) return;
    runArtifactAutoDecompose(true);
}

// 神器套装配置
const artifactSets = [
    {
        name: "青龙套装",
        bonuses: {
            2: { health: 30, description: "生命加成+3000%" },
            4: { attack: 200, description: "攻击加成+20000%" },
            6: { critDamage: 1500, description: "爆伤加成+150000%" }
        }
    },
 {
        name: "新手套装",
        bonuses: {
            2: { health: 2, description: "生命加成+200%" },
            4: { attack: 20, description: "攻击加成+2000%" },
            6: { critDamage: 150, description: "爆伤加成+15000%" }
        }
    },
 {
        name: "废品套装",
        bonuses: {
            2: { health: 1, description: "生命加成+100%" },
            4: { attack: 1, description: "攻击加成+100%" },
            6: { critDamage: 1, description: "爆伤加成+100%" }
        }
},
 {
        name: "闫闫套装",
        bonuses: {
            2: { health: 10, description: "生命加成+1000%" },
            4: { health: 10, description: "生命加成+1000%" },
            6: { health: 10, description: "生命加成+1000%" }
        }
},
 {
        name: "茶茶套装",
        bonuses: {
            2: { attack: 20, description: "攻击加成+2000%" },
            4: { attack: 20, description: "攻击加成+2000%" },
            6: { attack: 20, description: "攻击加成+2000%" }
        }
    },
 {
        name: "幼儿园套装",
        bonuses: {
            2: { health: 2, description: "生命加成+200%" },
            4: { attack: 2, description: "攻击加成+200%" },
            6: { critDamage: 2, description: "爆伤加成+200%" }
        }
    },
 {
        name: "梦想套装",
        bonuses: {
            2: { health: 1, description: "生命加成+100%" },
            4: { attack: 10, description: "攻击加成+1000%" },
            6: { critDamage: 100, description: "爆伤加成+10000%" }
        }
    },
 {
        name: "堕入套装",
        bonuses: {
            2: { attack: 3, description: "攻击加成+300%" },
            4: { attack: 5, description: "攻击加成+500%" },
            6: { critDamage: 80, description: "爆伤加成+8000%" }
        }
    },
 {
        name: "邪恶套装",
        bonuses: {
            2: { critDamage: 2, description: "爆伤加成+200%" },
            4: { critDamage: 10, description: "爆伤加成+1000%" },
            6: { critDamage: 170, description: "爆伤加成+17000%" }
        }
    },
 {
        name: "猎人套装",
        bonuses: {
            2: { health: 2, description: "生命加成+200%" },
            4: { attack: 30, description: "攻击加成+3000%" },
            6: { critDamage: 150, description: "爆伤加成+15000%" }
        }
    },
 {
        name: "死神套装",
        bonuses: {
            2: { health: 10, description: "生命加成+1000%" },
            4: { attack: 500, description: "攻击加成+50000%" },
            6: { attack: 4000, description: "攻击加成+400000%" }
        }
    },
 {
        name: "冥王套装",
        bonuses: {
            2: { health: 10, description: "生命加成+1000%" },
            4: { attack: 300, description: "攻击加成+30000%" },
            6: { critDamage: 3000, description: "爆伤加成+300000%" }
        }
    },
 {
        name: "至尊套装",
        bonuses: {
            2: { attack: 30, description: "攻击加成+3000%" },
            4: { health: 500, description: "生命加成+50000%" },
            6: { critDamage: 1700, description: "爆伤加成+170000%" }
        }
    },
 {
        name: "雷霆套装",
        bonuses: {
            2: { attack: 100, description: "攻击加成+10000%" },
            4: { attack: 550, description: "攻击加成+55000%" },
            6: { critDamage: 1300, description: "爆伤加成+130000%" }
        }
    },
 {
        name: "堕落套装",
        bonuses: {
            2: { health: 5, description: "生命加成+500%" },
            4: { attack: 10, description: "攻击加成+1000%" },
            6: { critDamage: 53, description: "爆伤加成+5300%" }
        }
    },
 {
        name: "神话套装",
        bonuses: {
            2: { health: 22, description: "生命加成+2200%" },
            4: { critDamage: 400, description: "攻击加成+40000%" },
            6: { critDamage: 2000, description: "爆伤加成+200000%" }
        }
    },
 {
        name: "圣光套装",
        bonuses: {
            2: { health: 15, description: "生命加成+1500%" },
            4: { attack: 100, description: "攻击加成+10000%" },
            6: { critDamage: 1300, description: "爆伤加成+130000%" }
        }
    },
 {
        name: "混沌套装",
        bonuses: {
            2: { health: 10, description: "生命加成+1000%" },
            4: { attack: 300, description: "攻击加成+30000%" },
            6: { health: 1500, description: "生命加成+150000%" }
        }
    },
    {
        name: "白虎套装",
        bonuses: {
            2: { attack: 15, description: "攻击加成+1500%" },
            4: { attack: 400, description: "攻击加成+40000%" },
            6: { attack: 1850, description: "攻击加成+185000%" }
        }
    },
    {
        name: "朱雀套装",
        bonuses: {
            2: { critDamage: 20, description: "爆伤加成+2000%" },
            4: { critDamage: 250, description: "爆伤加成+25000%" },
            6: { attack: 1650, description: "攻击加成+165000%" }
        }
    },
    {
        name: "玄武套装",
        bonuses: {
            2: { health: 50, description: "生命加成+5000%" },
            4: { health: 500, description: "生命加成+50000%" },
            6: { health: 1800, description: "生命加成+180000%" }
        }
    },
    {
        name: "麒麟套装",
        bonuses: {
            2: { attack: 50, description: "攻击加成+5000%" },
            4: { attack: 550, description: "攻击加成+55000%" },
            6: { health: 1000, description: "生命加成+100000%" }
        }
    }
];

// 神器名字库
const artifactNames = {
    helmet: ["玄铁战盔", "流光宝冠", "暗影头盔", "烈焰头环", "凤羽冠", "圣光战盔", "疾风头盔", "雷霆战盔", "雷霆战盔", "守护者头盔", "幽魂头罩", "精灵之冠", "矮人战盔", "毒藤头环", "寒冰面甲", "荣耀战盔", "耻辱面甲", "刹那冠冕", "雨龙盔", "龟甲盔", "云龙盔", "饕餮头盔", "虬龙头盔", "青鸾头盔", "火凤头盔", "蛟龙头盔", "龙鳞头盔", "苍龙头盔", "虚无头盔"],
    clothes: ["龙鳞甲", "玄冰法袍", "暗影披风", "圣光铠甲", "大地之袍", "疾风劲装", "藤蔓风衣", "王者披风", "毁灭者战衣", "混沌战甲", "黎明法衣", "黄昏披风", "幽魂长衫", "泰坦铠甲", "矮人战甲", "恶魔披风", "磐石铠甲", "熔岩铠甲", "寒冰法袍", "静谧长衫", "狂怒战甲", "意志披风", "龙纹战甲", "流光战衣", "深渊战甲", "永恒战甲", "信仰战甲", "狂怒长衫", "闫闫内衣"],
    pants: ["星空护腿", "玄铁战裤", "暗影皮裤", "冰晶长裤", "圣光战裤", "幽冥长裤", "疾风短裤", "大地之裤", "藤蔓短裤", "混沌护腿", "雷霆战裤", "藤蔓护腿", "幻影护腿", "守护者护腿", "黎明护腿", "幽魂护腿", "恶魔护腿", "天使护腿", "毒藤护腿", "磐石护腿", "狂怒护腿", "勇气护腿", "雷神护腿", "火神护腿", "暗夜护腿", "星光护腿", "死神护腿", "闫闫黑丝"],
    shoes: ["流光战靴", "烈焰履", "黑麒麟战靴", "神玄武战靴", "邪白虎战靴", "圣朱雀羽靴", "灭世青龙战靴", "赫光圣靴", "疾风战靴", "混沌战靴", "死神战靴", "雷神战靴", "至尊战靴", "剑圣战靴", "剑神战靴", "灭神战靴", "永恒战靴", "火迷战靴", "镭射战靴", "冥王战靴", "仙人神靴", "风暴战靴", "荣耀圣靴", "暗夜神靴", "圣飒战靴", "强韧战靴", "傲世神靴"],
    necklace: ["星空项链", "烈焰项链", "王者项链", "玄德项链", "迪虎项链", "黎明项链", "幽魂项链", "黄昏圣链", "泰坦项链", "恶魔项链", "熔岩吊坠", "寒冰吊坠", "风暴吊坠", "狂怒吊坠", "力量吊坠", "勇气项链", "至尊项链", "荣耀项链", "凤羽项链", "流光项链", "顺神项链", "风日项链", "邪神吊坠", "睡神项链", "水神项链", "敖包吊坠", "死亡项链"],
    weapon: ["万古绝尘剑", "撼天动地斧", "焚天怒焰刀", "惊鸿掠影剑", "血狱幽冥枪", "破界陨星锤", "冰封千里杖", "地狱修罗刀", "九霄龙吟剑", "噬魂夺魄刃", "乾坤逆转戟", "裂地崩山斧", "焚天炽羽弓", "玄冰锁魂镰", "紫电灭魔剑", "血饮狂刀", "雷霆碎岳锤", "万劫不灭矛", "破空穿云箭", "寒霜冻世剑", "炎狱修罗枪", "星河碎影剑", "混沌开天斧", "白虎裂山刃", "炼狱修罗爪", "破天裂穹剑", "轩辕剑", "湛泸剑", "赤霄剑", "泰阿剑", "承影剑", "干将", "莫邪", "鱼肠剑", "无影剑艾雷诺", "破碎之命运", "光炎剑", "泰拉石手枪", "永恒之枪", "潘多拉魔盒", "三叉戟", "方天画戟", "草薙剑", "圣剑格拉墨", "命运之矛", "埃癸斯之盾", "杜蕾斯", "闫闫爱心锤", "茶茶小奶瓶"]
};
const advanceCosts = [5, 10, 20, 40, 80, 160, 320]; // 进阶1-7级所需神石
const advancePrefixes = [
    "", 
    "高·", 
    "超·", 
    "圣·", 
    "仙·", 
    "神·", 
    "荒·", 
    "帝·"
];
// 初始化神器系统
function initArtifactSystem() {
    if (!player.artifacts) {
        player.artifacts = {
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
            advanceLevels: {}, // 神器ID -> 进阶等级 (0-7)
            lockedArtifacts: []
        };
    }
    if (!player.artifacts.batchSelection) {
    player.artifacts.batchSelection = {
        selectedIds: [],
        filters: {
            quality: 'all',
            set: 'all',
            part: 'all'
        }
    };
}
    // 修复旧装备初始化问题
    if (!player.artifacts.advanceLevels) {
        player.artifacts.advanceLevels = {};
    }
     player.artifacts.inventory.forEach(artifact => {
        if (artifact.locked === undefined) {
            artifact.locked = false;
        }
    });
    
    Object.values(player.artifacts.equipped).forEach(artifact => {
        if (artifact && artifact.locked === undefined) {
            artifact.locked = false;
        }
    });
    // 确保所有神器都有进阶等级
    player.artifacts.inventory.forEach(artifact => {
        if (!player.artifacts.advanceLevels[artifact.id]) {
            player.artifacts.advanceLevels[artifact.id] = 0;
        }
    });
    
    Object.values(player.artifacts.equipped).forEach(artifact => {
        if (artifact && !player.artifacts.advanceLevels[artifact.id]) {
            player.artifacts.advanceLevels[artifact.id] = 0;
        }
    });
 player.artifacts.inventory.forEach(artifact => {
        if (!artifact.baseName) {
            artifact.baseName = artifact.name;
        }
    });
    
    Object.values(player.artifacts.equipped).forEach(artifact => {
        if (artifact && !artifact.baseName) {
            artifact.baseName = artifact.name;
        }
    });
    ensureArtifactAutoDecomposeSettings();
    trimArtifactInventoryOverCap();
    cleanupArtifactAdvanceLevels();
}
// 切换神器查看标签
function switchArtifactTab(tab) {
    const allTab = document.querySelector('.artifact-tab[onclick="switchArtifactTab(\'all\')"]');
    const setsTab = document.querySelector('.artifact-tab[onclick="switchArtifactTab(\'sets\')"]');
    
    if (tab === 'all') {
        document.getElementById('artifactInventory').style.display = 'grid';
        document.getElementById('artifactSetsView').style.display = 'none';
        allTab.classList.add('active');
        setsTab.classList.remove('active');
    } else {
        document.getElementById('artifactInventory').style.display = 'none';
        document.getElementById('artifactSetsView').style.display = 'block';
        allTab.classList.remove('active');
        setsTab.classList.add('active');
        updateArtifactSetsView();
    }
}

// 更新套装视图
function updateArtifactSetsView() {
    const container = document.getElementById('artifactSetsContainer');
    container.innerHTML = '';
    
    // 按套装分组
    const sets = {};
    player.artifacts.inventory.forEach(artifact => {
        const setName = artifact.set || '无套装';
        if (!sets[setName]) {
            sets[setName] = [];
        }
        sets[setName].push(artifact);
    });
    
    // 创建套装组
    Object.keys(sets).sort().forEach(setName => {
        const artifacts = sets[setName];
        const setGroup = document.createElement('div');
        setGroup.className = 'set-group set-collapsed';
        setGroup.id = `set-group-${setName.replace(/\s+/g, '-')}`;
        
        setGroup.innerHTML = `
            <div class="set-header" onclick="toggleSetGroup('${setName.replace(/\s+/g, '-')}')">
                <div class="set-name">${setName}</div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="set-count">${artifacts.length}件</span>
                    <span class="folder-arrow">▼</span>
                </div>
            </div>
            <div class="set-content">
                ${artifacts.map(artifact => createArtifactCardHTML(artifact)).join('')}
            </div>
        `;
        
        container.appendChild(setGroup);
    });
}

// 切换套装组展开/收起
function toggleSetGroup(setName) {
    const group = document.getElementById(`set-group-${setName}`);
    group.classList.toggle('set-collapsed');
}

// 创建神器卡片HTML（复用原有函数或创建新函数）
function createArtifactCardHTML(artifact) {
    const quality = artifactQualities.find(q => q.id === artifact.quality);
    const part = artifactParts.find(p => p.id === artifact.part);
    
    return `
        <div class="artifact-card" style="border: 2px solid ${quality.color};">
            <div style="color: ${quality.color}; font-weight: bold;">${artifact.name}</div>
            <div>${part.name}</div>
            <div style="font-size: 0.8em;">
                <div>等级: ${artifact.upgradeLevel}</div>
                <div>生命: +${(artifact.bonuses.health * 100).toFixed(1)}%</div>
                <div>攻击: +${(artifact.bonuses.attack * 100).toFixed(1)}%</div>
                <div>爆伤: +${(artifact.bonuses.critDamage * 100).toFixed(1)}%</div>
            </div>
            <div style="margin-top: 10px;">
                <button onclick="equipArtifact('${artifact.id}')" style="background: #4CAF50; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em; margin-right: 5px;">装备</button>
                <button onclick="showArtifactDetails('${artifact.id}')" style="background: #2196F3; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em;">详情</button>
               <button onclick="decomposeArtifactItem('${artifact.id}')" style="background: #f44336; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em;">分解</button>

            </div>
        </div>
    `;
}
// 切换神器系统界面
function toggleArtifactSystem() {
    if (player.reincarnationCount < 500) {
        alert("需要达到500转才能开启神器系统！");
        return;
    }
    const overlay = document.getElementById('artifactSystemOverlay');
    const ui = document.getElementById('artifactSystemUI');


    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        initArtifactSystem();
        initArtifactAutoDecomposeUI();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateArtifactUI();
    }
}

// 更新神器系统界面
   function updateArtifactUI() {
    updateArtifactInventoryCountDisplay();
    updateArtifactSlots();
    updateArtifactInventory();
    updateFilteredCount();
    updateSetBonuses();
}
function cleanupArtifactAdvanceLevels() {
    if (!player.artifacts || !player.artifacts.advanceLevels) return;
    
    // 获取所有有效的神器ID（仓库中的和装备中的）
    const validArtifactIds = new Set();
    
    // 添加仓库中的神器ID
    player.artifacts.inventory.forEach(artifact => {
        validArtifactIds.add(artifact.id);
    });
    
    // 添加装备中的神器ID
    Object.values(player.artifacts.equipped).forEach(artifact => {
        if (artifact) {
            validArtifactIds.add(artifact.id);
        }
    });
    
    // 清理无效的进阶等级数据
    const oldCount = Object.keys(player.artifacts.advanceLevels).length;
    
    Object.keys(player.artifacts.advanceLevels).forEach(artifactId => {
        if (!validArtifactIds.has(artifactId)) {
            delete player.artifacts.advanceLevels[artifactId];
        }
    });
    
    const newCount = Object.keys(player.artifacts.advanceLevels).length;
    const removedCount = oldCount - newCount;
    
    if (removedCount > 0) {
        console.log(`清理了 ${removedCount} 个无效的进阶等级记录`);
    }
}
// 更新装备部位显示
function updateArtifactSlots() {
    const slotsContainer = document.getElementById('artifactSlots');
    slotsContainer.innerHTML = '';
    
    artifactParts.forEach(part => {
        const slot = document.createElement('div');
        slot.className = 'artifact-slot';
        slot.style.border = '1px solid #d4af37';
        slot.style.padding = '10px';
        slot.style.borderRadius = '5px';
        slot.style.textAlign = 'center';
        slot.style.backgroundColor = '#222';
        
        const equippedArtifact = player.artifacts.equipped[part.id];
        
        if (equippedArtifact) {
            const quality = artifactQualities.find(q => q.id === equippedArtifact.quality);
            const set = artifactSets.find(s => s.name === equippedArtifact.set);
            
            slot.innerHTML = `
                <div style="color: ${quality.color}; font-weight: bold;">${equippedArtifact.name}</div>
                <div>${part.name}</div>
                <div style="font-size: 0.8em; margin-top: 5px;">
                    <div>等级: ${equippedArtifact.upgradeLevel}</div>
                    <div>套装: <span style="color: #d4af37;">${equippedArtifact.set}</span></div>
                    <div>生命: +${(equippedArtifact.bonuses.health * 100).toFixed(1)}%</div>
                    <div>攻击: +${(equippedArtifact.bonuses.attack * 100).toFixed(1)}%</div>
                    <div>爆伤: +${(equippedArtifact.bonuses.critDamage * 100).toFixed(1)}%</div>
                </div>
                <button onclick="unequipArtifact('${part.id}')" style="margin-top: 10px; background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 0.8em;">卸下</button>
            `;
        } else {
            slot.innerHTML = `
                <div>${part.name}</div>
                <div style="color: #888; font-size: 0.9em; margin-top: 5px;">未装备</div>
            `;
        }
        
        slotsContainer.appendChild(slot);
    });
}

// 更新神器仓库显示
function updateArtifactInventory() {

    const inventoryContainer = document.getElementById('artifactInventory');
    const filterContainer = document.getElementById('artifactFilterUI');
    
    if (!filterContainer) {
        createFilterUI();
    }
    
    const filteredArtifacts = getFilteredArtifacts();
    var maxPage = Math.max(0, Math.ceil(filteredArtifacts.length / ARTIFACT_PAGE_SIZE) - 1);
    if (!player.artifacts.inventoryPage) player.artifacts.inventoryPage = 0;
    if (player.artifacts.inventoryPage > maxPage) player.artifacts.inventoryPage = maxPage;
    var pageStart = player.artifacts.inventoryPage * ARTIFACT_PAGE_SIZE;
    var pageArtifacts = filteredArtifacts.slice(pageStart, pageStart + ARTIFACT_PAGE_SIZE);
    
    var pager = document.getElementById('artifactInventoryPager');
    var pageInfo = document.getElementById('artifactInventoryPageInfo');
    if (pager) pager.style.display = filteredArtifacts.length > ARTIFACT_PAGE_SIZE ? 'flex' : 'none';
    if (pageInfo) pageInfo.textContent = (maxPage + 1) > 0 ? (player.artifacts.inventoryPage + 1) + '/' + (maxPage + 1) : '0/0';
    
    inventoryContainer.innerHTML = '';
    
    if (filteredArtifacts.length === 0) {
        inventoryContainer.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 20px;">没有符合条件的神器</div>';
        return;
    }
    
    inventoryContainer.innerHTML = `
     <div style="grid-column: 1 / -1; margin-bottom: 15px; padding: 10px; background: #333; border-radius: 5px;">
            <strong style="color: #d4af37;">批量操作</strong>
            <button onclick="selectAllArtifacts()" style="margin: 0 5px; padding: 5px 10px;">全选</button>
            <button onclick="deselectAllArtifacts()" style="margin: 0 5px; padding: 5px 10px;">取消全选</button>
            <button onclick="batchLockArtifacts()" style="margin: 0 5px; padding: 5px 10px; background: #FF9800; color: white;">批量锁定选中神器</button>
            <button onclick="batchUnlockArtifacts()" style="margin: 0 5px; padding: 5px 10px; background: #666; color: white;">批量解锁选中神器</button>
            <button onclick="batchDecomposeArtifacts()" style="margin: 0 5px; padding: 5px 10px; background: #f44336; color: white;">批量分解选中神器 (${player.artifacts.batchSelection.selectedIds.length})</button>
            <span style="margin-left: 10px; color: #4CAF50;">选中: ${player.artifacts.batchSelection.selectedIds.length}/${filteredArtifacts.length}</span>
            <span style="margin-left: 10px; color: #888;">本页 ${pageArtifacts.length} 件</span>
        </div>
    `;
    
     pageArtifacts.forEach(artifact => {
        const quality = artifactQualities.find(q => q.id === artifact.quality);
        const part = artifactParts.find(p => p.id === artifact.part);
        const isSelected = player.artifacts.batchSelection.selectedIds.includes(artifact.id);
        const isLocked = artifact.locked;
        
        const artifactCard = document.createElement('div');
        artifactCard.className = 'artifact-card';
        artifactCard.style.border = `2px solid ${isSelected ? '#4CAF50' : (isLocked ? '#FFD700' : quality.color)}`;
        artifactCard.style.padding = '10px';
        artifactCard.style.borderRadius = '5px';
        artifactCard.style.cursor = 'pointer';
        artifactCard.style.backgroundColor = isSelected ? '#2a2a2a' : '#1a1a1a';
        artifactCard.style.position = 'relative';
        artifactCard.onclick = (e) => {
            if (!e.target.closest('button')) {
                toggleArtifactSelection(artifact.id);
            }
        };
        
        // 添加锁定图标
        const lockIcon = isLocked ? '🔒' : '🔓';
        
        artifactCard.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <input type="checkbox" ${isSelected ? 'checked' : ''} 
                       onchange="toggleArtifactSelection('${artifact.id}')"
                       style="margin-right: 10px; transform: scale(1.2);">
                <div style="color: ${isLocked ? '#FFD700' : quality.color}; font-weight: bold; flex-grow: 1;">
                    ${artifact.name} ${lockIcon}
                </div>
            </div>
            <div>${part.name} | ${quality.name}</div>
            <div style="font-size: 0.8em; margin-top: 5px;">
                <div>等级: ${artifact.upgradeLevel}</div>
                <div>套装: <span style="color: #d4af37;">${artifact.set}</span></div>
                <div>生命: +${(artifact.bonuses.health * 100).toFixed(1)}%</div>
                <div>攻击: +${(artifact.bonuses.attack * 100).toFixed(1)}%</div>
                <div>爆伤: +${(artifact.bonuses.critDamage * 100).toFixed(1)}%</div>
            </div>
            <div style="margin-top: 10px; display: flex; gap: 5px; flex-wrap: wrap;">
                <button onclick="event.stopPropagation(); toggleArtifactLock('${artifact.id}')" 
                        style="background: ${isLocked ? '#FF9800' : '#666'}; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em;">
                    ${isLocked ? '解锁' : '锁定'}
                </button>
                <button onclick="event.stopPropagation(); showArtifactDetails('${artifact.id}')" 
                        style="background: #2196F3; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em;">详情</button>
                <button onclick="event.stopPropagation(); equipArtifact('${artifact.id}')" 
                        style="background: #4CAF50; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em;">装备</button>
                <button onclick="event.stopPropagation(); upgradeArtifact('${artifact.id}')" 
                        style="background: #FF9800; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em;">升级</button>
                <button onclick="event.stopPropagation(); decomposeArtifactItem('${artifact.id}')" 
                        style="background: #f44336; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em;"
                        ${isLocked ? 'disabled' : ''}>分解</button>
            </div>
        `;
        
        inventoryContainer.appendChild(artifactCard);
    });
}

 function createFilterUI() {
    if (document.getElementById('artifactFilterUI')) return;
    const anchor = document.getElementById('artifactFilterUIAnchor') || document.getElementById('artifactSystemUI');
    
    const filterHTML = `
        <div id="artifactFilterUI" style="margin-bottom: 20px; padding: 15px; background: #333; border-radius: 8px;">
            <h4 style="color: #d4af37; margin-top: 0;">筛选条件</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                <div>
                    <label>品质筛选:</label>
                    <select id="qualityFilter" onchange="updateArtifactFilter('quality', this.value)" style="width: 100%; padding: 5px;">
                        <option value="all">全部品质</option>
                        ${artifactQualities.map(q => `<option value="${q.id}">${q.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label>套装筛选:</label>
                    <select id="setFilter" onchange="updateArtifactFilter('set', this.value)" style="width: 100%; padding: 5px;">
                        <option value="all">全部套装</option>
                        ${[...new Set(artifactSets.map(s => s.name))].map(set => `<option value="${set}">${set}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label>部位筛选:</label>
                    <select id="partFilter" onchange="updateArtifactFilter('part', this.value)" style="width: 100%; padding: 5px;">
                        <option value="all">全部部位</option>
                        ${artifactParts.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div style="margin-top: 10px;">
                <button onclick="clearArtifactFilters()" style="background: #666; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 10px;">清除筛选</button>
                <span style="color: #888;">当前显示: <span id="filteredCount">0</span> 个神器</span>
            </div>
        </div>
    `;
    
    anchor.insertAdjacentHTML('afterbegin', filterHTML);
}

// 获取筛选后的神器列表
function getFilteredArtifacts() {
    const filters = player.artifacts.batchSelection.filters;
    
    return player.artifacts.inventory.filter(artifact => {
        // 品质筛选
        if (filters.quality !== 'all' && artifact.quality !== filters.quality) {
            return false;
        }
        
        // 套装筛选
        if (filters.set !== 'all' && artifact.set !== filters.set) {
            return false;
        }
        
        // 部位筛选
        if (filters.part !== 'all' && artifact.part !== filters.part) {
            return false;
        }
        
        return true;
    });
}

// 更新筛选条件
function updateArtifactFilter(type, value) {
    player.artifacts.batchSelection.filters[type] = value;
    
    // 清空选择（因为列表改变了）
    player.artifacts.batchSelection.selectedIds = [];
    player.artifacts.inventoryPage = 0;
    
    updateArtifactInventory();
    updateFilteredCount();
}

// 清除所有筛选条件
function clearArtifactFilters() {
    player.artifacts.batchSelection.filters = {
        quality: 'all',
        set: 'all',
        part: 'all'
    };
    
    // 重置下拉菜单
    document.getElementById('qualityFilter').value = 'all';
    document.getElementById('setFilter').value = 'all';
    document.getElementById('partFilter').value = 'all';
    
    player.artifacts.batchSelection.selectedIds = [];
    player.artifacts.inventoryPage = 0;
    updateArtifactInventory();
    updateFilteredCount();
}

// 更新筛选计数显示
function updateFilteredCount() {
    const filteredArtifacts = getFilteredArtifacts();
    document.getElementById('filteredCount').textContent = filteredArtifacts.length;
}
function batchLockArtifacts() {
    const selectedIds = player.artifacts.batchSelection.selectedIds;
    
    if (selectedIds.length === 0) {
        logAction("请先选择要锁定的神器", "error");
        return;
    }
    
    let lockedCount = 0;
    selectedIds.forEach(artifactId => {
        const artifact = player.artifacts.inventory.find(a => a.id === artifactId);
        if (artifact && !artifact.locked) {
            artifact.locked = true;
            lockedCount++;
        }
    });
    
    if (lockedCount > 0) {
        logAction(`成功锁定 ${lockedCount} 个神器`, "success");
        updateArtifactUI();
    } else {
        logAction("选中的神器已经全部被锁定", "info");
    }
}

// 批量解锁函数
function batchUnlockArtifacts() {
    const selectedIds = player.artifacts.batchSelection.selectedIds;
    
    if (selectedIds.length === 0) {
        logAction("请先选择要解锁的神器", "error");
        return;
    }
    
    let unlockedCount = 0;
    selectedIds.forEach(artifactId => {
        const artifact = player.artifacts.inventory.find(a => a.id === artifactId);
        if (artifact && artifact.locked) {
            artifact.locked = false;
            unlockedCount++;
        }
    });
    
    if (unlockedCount > 0) {
        logAction(`成功解锁 ${unlockedCount} 个神器`, "success");
        updateArtifactUI();
    } else {
        logAction("选中的神器已经全部未锁定", "info");
    }
}

// 新增锁定/解锁函数
function toggleArtifactLock(artifactId) {
    // 在仓库中查找神器
    let artifact = player.artifacts.inventory.find(a => a.id === artifactId);
    
    // 如果在仓库中没找到，可能在装备中
    if (!artifact) {
        artifact = Object.values(player.artifacts.equipped).find(a => a && a.id === artifactId);
    }
    
    if (!artifact) return;
    
    artifact.locked = !artifact.locked;
    
    if (artifact.locked) {
        logAction(`已锁定神器：${artifact.name}`, 'success');
    } else {
        logAction(`已解锁神器：${artifact.name}`, 'success');
    }
    
    updateArtifactUI();
}
// 切换神器选择状态
function toggleArtifactSelection(artifactId) {
    const index = player.artifacts.batchSelection.selectedIds.indexOf(artifactId);
    
    if (index > -1) {
        // 如果已选中，则取消选择
        player.artifacts.batchSelection.selectedIds.splice(index, 1);
    } else {
        // 如果未选中，则选择
        player.artifacts.batchSelection.selectedIds.push(artifactId);
    }
    
    updateArtifactInventory();
}

// 全选当前筛选结果
function selectAllArtifacts() {
    const filteredArtifacts = getFilteredArtifacts();
    player.artifacts.batchSelection.selectedIds = filteredArtifacts.map(artifact => artifact.id);
    updateArtifactInventory();
}

// 取消全选
function deselectAllArtifacts() {
    player.artifacts.batchSelection.selectedIds = [];
    updateArtifactInventory();
}

// 批量分解选中的神器
function batchDecomposeArtifacts() {
    const selectedIds = player.artifacts.batchSelection.selectedIds;
    
    if (selectedIds.length === 0) {
        logAction("请先选择要分解的神器", "error");
        return;
    }
    
    // 过滤掉被锁定的神器
    const decomposableIds = selectedIds.filter(id => {
        const artifact = player.artifacts.inventory.find(a => a.id === id);
        return artifact && !artifact.locked;
    });
    
    const lockedCount = selectedIds.length - decomposableIds.length;
    
    if (lockedCount > 0) {
        logAction(`跳过 ${lockedCount} 个被锁定的神器`, "info");
    }
    
    if (decomposableIds.length === 0) {
        logAction("没有可分解的神器（所有选中的神器都被锁定）", "error");
        return;
    }
    
    showCustomConfirm(`确定要批量分解 ${decomposableIds.length} 个神器吗？${lockedCount > 0 ? `（跳过 ${lockedCount} 个被锁定的神器）` : ''}此操作不可撤销！`, (confirmed) => {
        if (confirmed) {
            let totalFragments = 0;
            let totalCrystals = 0;
            let decomposedCount = 0;
            
            // 分解选中的神器（只分解未锁定的）
            decomposableIds.forEach(artifactId => {
                const artifactIndex = player.artifacts.inventory.findIndex(a => a.id === artifactId);
                if (artifactIndex > -1) {
                    const artifact = player.artifacts.inventory[artifactIndex];
                    const rewards = calculateDecompositionReward(artifact);
                    
                    totalFragments += rewards.fragments;
                    totalCrystals += rewards.crystals;
                    decomposedCount++;
                    
                    // 从仓库中移除
                    player.artifacts.inventory.splice(artifactIndex, 1);
                }
            });
            
            // 添加资源
            var expRes = getExplorationResources();
            expRes.artifactFragment = (expRes.artifactFragment || 0) + totalFragments;
            expRes.cosmicCrystal = (expRes.cosmicCrystal || 0) + totalCrystals;
            syncExplorationDataToPlayer();
            
            // 清空选择
            player.artifacts.batchSelection.selectedIds = [];
            
            // 更新显示
            updateArtifactUI();
            updateExplorationUI();
            
            // 显示分解结果
            showBatchDecompositionResult(decomposedCount, totalFragments, totalCrystals);
        }
    });
}

// 显示批量分解结果
function showBatchDecompositionResult(count, fragments, crystals) {
    const resultOverlay = document.createElement('div');
    resultOverlay.id = 'batchDecompositionResultOverlay';
    resultOverlay.style.position = 'fixed';
    resultOverlay.style.top = '0';
    resultOverlay.style.left = '0';
    resultOverlay.style.width = '100%';
    resultOverlay.style.height = '100%';
    resultOverlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    resultOverlay.style.zIndex = '2000';
    resultOverlay.style.display = 'flex';
    resultOverlay.style.justifyContent = 'center';
    resultOverlay.style.alignItems = 'center';
    
    const resultCard = document.createElement('div');
    resultCard.style.backgroundColor = '#1a1a1a';
    resultCard.style.padding = '30px';
    resultCard.style.borderRadius = '10px';
    resultCard.style.border = '3px solid #4CAF50';
    resultCard.style.width = '450px';
    resultCard.style.maxWidth = '90%';
    resultCard.style.textAlign = 'center';
    
    resultCard.innerHTML = `
        <h2 style="color: #4CAF50; margin-top: 0;">批量分解完成</h2>
        <div style="margin-bottom: 20px;">
            <div style="font-size: 1.2em; margin-bottom: 10px;">成功分解了 <span style="color: #4CAF50;">${count}</span> 个神器</div>
        </div>
        <div style="background: #333; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <div style="font-weight: bold; margin-bottom: 10px; color: #d4af37;">获得资源</div>
            <div style="display: flex; justify-content: space-around; margin-top: 15px;">
                <div>
                    <div style="font-size: 1.2em; color: #FF9800;">${fragments}</div>
                    <div>神器碎片</div>
                </div>
                <div>
                    <div style="font-size: 1.2em; color: #2196F3;">${crystals}</div>
                    <div>宇宙晶体</div>
                </div>
            </div>
        </div>
        <button onclick="document.body.removeChild(document.getElementById('batchDecompositionResultOverlay'))" 
                style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 1.1em;">
            确认
        </button>
    `;
    
    resultOverlay.appendChild(resultCard);
    document.body.appendChild(resultOverlay);
    
    logAction(`批量分解了 ${count} 个神器，获得 ${fragments} 碎片和 ${crystals} 晶体`, "success");
}
// 更新套装效果显示
function updateSetBonuses() {
    const setContainer = document.getElementById('setBonuses');
    setContainer.innerHTML = '';
    
    // 计算当前装备的套装数量
    const setCounts = {};
    Object.values(player.artifacts.equipped).forEach(artifact => {
        if (artifact) {
            if (!setCounts[artifact.set]) {
                setCounts[artifact.set] = 0;
            }
            setCounts[artifact.set]++;
        }
    });
    
    // 显示激活的套装效果
    Object.entries(setCounts).forEach(([setName, count]) => {
        const set = artifactSets.find(s => s.name === setName);
        if (!set) return;
        
        const setDiv = document.createElement('div');
        setDiv.style.marginBottom = '15px';
        setDiv.style.padding = '15px';
        setDiv.style.border = '1px solid #d4af37';
        setDiv.style.borderRadius = '5px';
        setDiv.style.backgroundColor = '#1a1a1a';
        
        let bonusesHtml = `<div style="font-weight: bold; color: #d4af37; font-size: 1.1em; margin-bottom: 10px;">${setName} (${count}/6)</div>`;
        
        // 显示已激活的效果
        Object.entries(set.bonuses).forEach(([pieceCount, bonus]) => {
            const pieceNum = parseInt(pieceCount);
            const isActive = count >= pieceNum;
            
            bonusesHtml += `
                <div style="margin-top: 8px; ${isActive ? 'color: #4CAF50;' : 'color: #888;'}">
                    ${isActive ? '✓ ' : ''}${pieceCount}件: ${bonus.description}
                </div>
            `;
        });
        
        setDiv.innerHTML = bonusesHtml;
        setContainer.appendChild(setDiv);
    });
    
    if (Object.keys(setCounts).length === 0) {
        setContainer.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">未装备任何套装神器</div>';
    }
}
function showArtifactDetails(artifactId) {
   // 先移除可能已存在的详情弹窗
    const existingOverlay = document.getElementById('artifactDetailOverlay');
    if (existingOverlay) {
        document.body.removeChild(existingOverlay);
    }
    const artifact = player.artifacts.inventory.find(a => a.id === artifactId);
    if (!artifact) return;
    
    const quality = artifactQualities.find(q => q.id === artifact.quality);
    const part = artifactParts.find(p => p.id === artifact.part);
    
    // 创建详情弹窗
    const detailOverlay = document.createElement('div');
    detailOverlay.id = 'artifactDetailOverlay';
    detailOverlay.style.position = 'fixed';
    detailOverlay.style.top = '0';
    detailOverlay.style.left = '0';
    detailOverlay.style.width = '100%';
    detailOverlay.style.height = '100%';
    detailOverlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    detailOverlay.style.zIndex = '2000';
    detailOverlay.style.display = 'flex';
    detailOverlay.style.justifyContent = 'center';
    detailOverlay.style.alignItems = 'center';
    
    const detailCard = document.createElement('div');
    detailCard.style.backgroundColor = '#1a1a1a';
    detailCard.style.padding = '20px';
    detailCard.style.borderRadius = '10px';
    detailCard.style.border = `3px solid ${quality.color}`;
    detailCard.style.width = '400px';
    detailCard.style.maxWidth = '90%';
    

     // 在详情页面添加锁定按钮
    const isLocked = artifact.locked;
    
    detailCard.innerHTML = `
        <div style="text-align: right;">
            <button onclick="document.body.removeChild(document.getElementById('artifactDetailOverlay'))" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">关闭</button>
        </div>
        <div style="text-align: center; margin-bottom: 15px;">
            <div style="color: ${quality.color}; font-size: 1.2em; font-weight: bold;">${artifact.name} ${isLocked ? '🔒' : '🔓'}</div>
            <div> ${part.name}</div>
            <div style="margin-top: 10px; font-size: 1.1em; color: #d4af37;">${artifact.set}套装</div>
        </div>
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>品质:</span>
                <span style="color: ${quality.color};">${quality.name}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>升级等级:</span>
                <span>${artifact.upgradeLevel}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>锁定状态:</span>
                <span style="color: ${isLocked ? '#FFD700' : '#666'};">${isLocked ? '已锁定' : '未锁定'}</span>
            </div>
        </div>
        <div style="background: #333; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <div style="font-weight: bold; margin-bottom: 10px; color: #d4af37;">属性加成</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>生命加成:</span>
                <span>+${(artifact.bonuses.health * 100).toFixed(1)}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>攻击加成:</span>
                <span>+${(artifact.bonuses.attack * 100).toFixed(1)}%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>爆伤加成:</span>
                <span>+${(artifact.bonuses.critDamage * 100).toFixed(1)}%</span>
            </div>
        </div>
        <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            <button onclick="toggleArtifactLock('${artifact.id}'); showArtifactDetails('${artifact.id}')" 
                    style="background: ${isLocked ? '#FF9800' : '#666'}; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                ${isLocked ? '解锁神器' : '锁定神器'}
            </button>
            <button onclick="equipArtifact('${artifact.id}')" style="background: #4CAF50; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">装备</button>
            <button onclick="upgradeArtifact('${artifact.id}')" style="background: #2196F3; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">升级</button>
            <button onclick="decomposeArtifactItem('${artifact.id}')" 
                    style="background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;"
                    ${isLocked ? 'disabled' : ''}>分解</button>
        </div>
    `;
     // 获取进阶等级
     const baseName = artifact.baseName || artifact.name;
    const advanceLevel = player.artifacts.advanceLevels[artifactId] || 0;
    
    // 更新进阶信息显示
    const advanceInfo = document.getElementById('artifactAdvanceInfo');
    const advanceBtn = document.getElementById('advanceArtifactBtn');
    advanceBtn.onclick = function() {
        advanceArtifact(artifactId);
    };
    
    if (advanceLevel < 7) {
        const cost = advanceCosts[advanceLevel];
        advanceInfo.innerHTML = `
            <div>当前进阶: ${advanceLevel}级 (${advancePrefixes[advanceLevel]}${baseName})</div>
            <div>下一进阶: ${advanceLevel + 1}级 (${advancePrefixes[advanceLevel + 1]}${baseName})</div>
            <div>消耗: ${cost} 进阶神石</div>
            <div>属性提升: ${Math.pow(2, advanceLevel + 1).toFixed(1)}倍</div>
        `;
        
        // 检查是否有足够进阶神石
        if (player.items.advanceStone >= cost) {
            advanceBtn.disabled = false;
            advanceBtn.textContent = "进阶神器";
        } else {
            advanceBtn.disabled = true;
            advanceBtn.textContent = "进阶神石不足";
        }
    } else {
        advanceInfo.innerHTML = `
            <div>当前进阶: 7级 (${advancePrefixes[7]}${baseName})</div>
            <div>已达最高进阶等级</div>
            <div>属性加成: ${Math.pow(2, 7).toFixed(1)}倍</div>
        `;
        advanceBtn.disabled = true;
        advanceBtn.textContent = "已达最高进阶";
    }

    detailOverlay.appendChild(detailCard);
    document.body.appendChild(detailOverlay);
}
function advanceArtifact(artifactId) {
    const artifact = player.artifacts.inventory.find(a => a.id === artifactId);
    if (!artifact) return;
    
    const advanceLevel = player.artifacts.advanceLevels[artifactId] || 0;
    if (advanceLevel >= 7) return;
    
    const cost = advanceCosts[advanceLevel];
    if (player.items.advanceStone < cost) {
        logAction("进阶神石不足！", "error");
        return;
    }
    
    // 扣除进阶神石
    player.items.advanceStone -= cost;
    
    // 提升进阶等级
    player.artifacts.advanceLevels[artifactId] = advanceLevel + 1;
    
    // 更新名字前缀
    artifact.name = advancePrefixes[advanceLevel + 1] + artifact.baseName;
    
    logAction(`成功将${artifact.baseName}进阶到${advanceLevel + 1}级！`, "success");
    
    // 更新显示
    updateArtifactUI();
    showArtifactDetails(artifactId); // 重新加载详情页面
}

function decomposeArtifactItem(artifactId) {
    const artifact = player.artifacts.inventory.find(a => a.id === artifactId);
    if (!artifact) return;
    if (artifact.locked) {
        logAction('无法分解被锁定的神器：' + artifact.name, 'error');
        return;
    }
    const decompositionRewards = applyArtifactDecomposeRewards(artifact);
    removeArtifactFromInventoryById(artifactId);
    cleanupArtifactAdvanceLevels();
    updateArtifactUI();
    updateExplorationUI();
    updateArtifactSetsView();
    showDecompositionResult(artifact, decompositionRewards);
}

// 计算分解收益
function calculateDecompositionReward(artifact) {
    // 基础收益基于品质
    const quality = artifactQualities.find(q => q.id === artifact.quality);
    const baseRewards = {
        common: { fragments: 1, crystals: 1 },
        uncommon: { fragments: 3, crystals: 2 },
        rare: { fragments: 5, crystals: 5 },
        epic: { fragments: 8, crystals: 8 },
        legendary: { fragments: 20, crystals: 10 },
        mythic: { fragments: 50, crystals: 20 }
    };
    
    // 获取基础收益
    const base = baseRewards[artifact.quality] || baseRewards.common;
    
    // 升级加成：每级增加20%收益
    const upgradeMultiplier = 1 + (artifact.upgradeLevel * 0.2);
    
    // 套装加成：套装神器额外增加50%收益
    const setMultiplier = artifact.set ? 1.5 : 1;
    
    // 计算最终收益
    const fragments = Math.floor(base.fragments * upgradeMultiplier * setMultiplier);
    const crystals = Math.floor(base.crystals * upgradeMultiplier * setMultiplier);
    
    return { fragments, crystals };
}

// 显示分解结果
function showDecompositionResult(artifact, rewards) {
    const quality = artifactQualities.find(q => q.id === artifact.quality);
    const part = artifactParts.find(p => p.id === artifact.part);
    
    // 创建结果弹窗
    const resultOverlay = document.createElement('div');
    resultOverlay.id = 'decompositionResultOverlay';
    resultOverlay.style.position = 'fixed';
    resultOverlay.style.top = '0';
    resultOverlay.style.left = '0';
    resultOverlay.style.width = '100%';
    resultOverlay.style.height = '100%';
    resultOverlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    resultOverlay.style.zIndex = '2000';
    resultOverlay.style.display = 'flex';
    resultOverlay.style.justifyContent = 'center';
    resultOverlay.style.alignItems = 'center';
    
    const resultCard = document.createElement('div');
    resultCard.style.backgroundColor = '#1a1a1a';
    resultCard.style.padding = '30px';
    resultCard.style.borderRadius = '10px';
    resultCard.style.border = `3px solid ${quality.color}`;
    resultCard.style.width = '450px';
    resultCard.style.maxWidth = '90%';
    resultCard.style.textAlign = 'center';
    
    resultCard.innerHTML = `
        <h2 style="color: ${quality.color}; margin-top: 0;">分解成功</h2>
        <div style="margin-bottom: 20px;">
            <div style="font-size: 1.1em; margin-bottom: 10px;">${artifact.name} (${part.name})</div>
            <div style="color: #d4af37; margin-bottom: 10px;">${artifact.set}套装</div>
            <div>品质: <span style="color: ${quality.color};">${quality.name}</span></div>
            <div>升级等级: ${artifact.upgradeLevel}</div>
        </div>
        <div style="background: #333; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <div style="font-weight: bold; margin-bottom: 10px; color: #d4af37;">获得资源</div>
            <div style="display: flex; justify-content: space-around; margin-top: 15px;">
                <div>
                    <div style="font-size: 1.2em; color: #FF9800;">${rewards.fragments}</div>
                    <div>神器碎片</div>
                </div>
                <div>
                    <div style="font-size: 1.2em; color: #2196F3;">${rewards.crystals}</div>
                    <div>宇宙晶体</div>
                </div>
            </div>
        </div>
        <button onclick="document.body.removeChild(document.getElementById('decompositionResultOverlay'))" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 1.1em;">确认</button>
    `;
    
    resultOverlay.appendChild(resultCard);
    document.body.appendChild(resultOverlay);
}


// 锻造神器
function forgeArtifact(batchCount = 1) {
    initArtifactSystem();
    const freeSlots = getArtifactInventoryFreeSlots();
    if (freeSlots <= 0) {
        logAction('神器仓库已满（' + ARTIFACT_INVENTORY_MAX + '/' + ARTIFACT_INVENTORY_MAX + '），请先分解或装备', 'error');
        return;
    }
    batchCount = Math.min(Math.max(1, Math.floor(batchCount) || 1), freeSlots);
    const costPerForge = 10;
    const totalCost = costPerForge * batchCount;
    
    var expResForge = getExplorationResources();
    if ((expResForge.artifactFragment || 0) < totalCost) {
        logAction(`神器碎片不足！需要 ${totalCost}，当前只有 ${expResForge.artifactFragment || 0}`, "error");
        return;
    }
    
    expResForge.artifactFragment -= totalCost;
    syncExplorationDataToPlayer();
    
    // 记录获得的各品质神器数量
    const qualityCounts = {};
    artifactQualities.forEach(q => {
        qualityCounts[q.id] = 0;
    });
    
    // 批量锻造
    for (let i = 0; i < batchCount; i++) {
        // 随机选择部位
        const part = artifactParts[Math.floor(Math.random() * artifactParts.length)];
    // 随机选择品质（概率不同）
    const qualityRoll = Math.random();
    let quality;
    if (qualityRoll < 0.7) quality = artifactQualities[0]; 
    else if (qualityRoll < 0.95) quality = artifactQualities[1]; 
    else if (qualityRoll < 0.995) quality = artifactQualities[2]; 
    else if (qualityRoll < 0.9995) quality = artifactQualities[3]; 
    else if (qualityRoll < 0.99999) quality = artifactQualities[4]; 
    else quality = artifactQualities[5]; 
      // 记录品质数量
        qualityCounts[quality.id]++;
    // 随机选择名字
    const name = artifactNames[part.id][Math.floor(Math.random() * artifactNames[part.id].length)];
    
    // 随机选择套装
    const set = artifactSets[Math.floor(Math.random() * artifactSets.length)];
    
    // 生成随机属性（在品质范围内）
    const bonuses = {
        health: (Math.random() * (quality.maxBonus - quality.minBonus) + quality.minBonus).toFixed(3),
        attack: (Math.random() * (quality.maxBonus - quality.minBonus) + quality.minBonus).toFixed(3),
        critDamage: (Math.random() * (quality.maxBonus - quality.minBonus) + quality.minBonus).toFixed(3)
    };
    
    // 创建神器
    const artifact = {
        id: 'artifact_' + Date.now() + Math.random(),
        name: name,
        baseName: name,
        part: part.id,
        quality: quality.id,
        set: set.name,
        bonuses: bonuses,
        upgradeLevel: 0,
        advanceLevel: 0
    };
    
     player.artifacts.inventory.push(artifact);
        
        // 单次锻造时显示消息
        if (batchCount === 1) {
            logAction(`成功锻造 ${quality.name}品质${part.name}：${name}`, 'success');
        }
    }
    
    // 批量锻造时显示汇总消息
    if (batchCount > 1) {
        let summaryMessage = `批量锻造 ${batchCount} 次，消耗 ${totalCost} 神器碎片，获得：`;
        
        // 添加各品质数量
        artifactQualities.forEach(q => {
            if (qualityCounts[q.id] > 0) {
                summaryMessage += `${q.name}x${qualityCounts[q.id]} `;
            }
        });
        
        logAction(summaryMessage, 'success');
    }
    
    runArtifactAutoDecompose(true);
    updateArtifactUI();
    updateArtifactSetsView();
    updateExplorationUI();
}

// 装备神器
function equipArtifact(artifactId) {
    const artifact = player.artifacts.inventory.find(a => a.id === artifactId);
    if (!artifact) return;
    
    // 检查该部位是否已装备
    if (player.artifacts.equipped[artifact.part]) {
        // 卸下当前装备
        const currentArtifact = player.artifacts.equipped[artifact.part];
        player.artifacts.inventory.push(currentArtifact);
    }
    
    // 装备新神器
    player.artifacts.equipped[artifact.part] = artifact;
    
    // 从仓库移除
    player.artifacts.inventory = player.artifacts.inventory.filter(a => a.id !== artifactId);
    
    logAction(`装备了神器：${artifact.name}`, 'success');
   updateExplorationUI();
  updateArtifactUI();
    updatePlayerBattleStats(); // 更新玩家战斗属性
}

// 卸下神器
function unequipArtifact(part) {
    const artifact = player.artifacts.equipped[part];
    if (!artifact) return;
    if (getArtifactInventoryFreeSlots() <= 0) {
        logAction('仓库已满（' + ARTIFACT_INVENTORY_MAX + '），无法卸下', 'error');
        return;
    }
    
    player.artifacts.inventory.push(artifact);
    player.artifacts.equipped[part] = null;
    
    logAction(`卸下了神器：${artifact.name}`, 'success');
    updateArtifactUI();
    updatePlayerBattleStats(); // 更新玩家战斗属性
}

// 升级神器
function upgradeArtifact(artifactId) {
    const artifact = player.artifacts.inventory.find(a => a.id === artifactId);
    if (!artifact) return;
    
    const upgradeCost = 10 * (artifact.upgradeLevel + 1);
    var expResUpgrade = getExplorationResources();
    if ((expResUpgrade.cosmicCrystal || 0) < upgradeCost) {
        logAction(`宇宙晶体不足！需要${upgradeCost}`, "error");
        return;
    }
    
    expResUpgrade.cosmicCrystal -= upgradeCost;
    syncExplorationDataToPlayer();
    artifact.upgradeLevel++;
    
    // 提升属性（最多提升50%）
    const quality = artifactQualities.find(q => q.id === artifact.quality);
    const maxBonus = quality.maxBonus * 10000000; // 最大提升100%
    
    Object.keys(artifact.bonuses).forEach(key => {
        const currentBonus = parseFloat(artifact.bonuses[key]);
        const upgradeAmount = Math.min(
            maxBonus - currentBonus,
            quality.maxBonus * 0.1 // 每次升级提升10%的品质上限
        );
        
        if (upgradeAmount > 0) {
            artifact.bonuses[key] = (currentBonus + upgradeAmount).toFixed(3);
        }
    });
     // 在升级成功后，检查是否有打开的详情弹窗，如果有则刷新它
    const detailOverlay = document.getElementById('artifactDetailOverlay');
    if (detailOverlay) {
        // 先关闭现有弹窗
        document.body.removeChild(detailOverlay);
        // 重新打开详情弹窗显示最新数据
        showArtifactDetails(artifactId);
    }
    logAction(`成功升级 ${artifact.name} 到 Lv.${artifact.upgradeLevel}`, 'success');
updateArtifactUI();
  updateArtifactSetsView();
}

// 计算神器总加成
function calculateArtifactBonuses() {
    const bonuses = {
        health: 0,
        attack: 0,
        critDamage: 0
    };
    
    // 累加所有装备神器的加成
    Object.values(player.artifacts.equipped).forEach(artifact => {
        if (artifact) {
            const advanceLevel = player.artifacts.advanceLevels[artifact.id] || 0;
            const advanceMultiplier = Math.pow(2, advanceLevel);
            bonuses.health += parseFloat(artifact.bonuses.health) * advanceMultiplier;
            bonuses.attack += parseFloat(artifact.bonuses.attack) * advanceMultiplier;
            bonuses.critDamage += parseFloat(artifact.bonuses.critDamage) * advanceMultiplier;
        }
    });
    
    // 应用套装效果
    const setCounts = {};
    Object.values(player.artifacts.equipped).forEach(artifact => {
        if (artifact) {
            if (!setCounts[artifact.set]) {
                setCounts[artifact.set] = 0;
            }
            setCounts[artifact.set]++;
        }
    });
    
    Object.entries(setCounts).forEach(([setName, count]) => {
        const set = artifactSets.find(s => s.name === setName);
        if (!set) return;
        
        Object.entries(set.bonuses).forEach(([pieceCount, bonus]) => {
            if (count >= parseInt(pieceCount)) {
                bonuses.health += bonus.health || 0;
                bonuses.attack += bonus.attack || 0;
                bonuses.critDamage += bonus.critDamage || 0;
            }
        });
    });
    
    return bonuses;
}
function initSectData() {
    if (!player.sect) {
        player.sect = {
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
            tributeTotal: 0,
            trialAuto: false,
            trialLastTime: 0,
            libraryInherit: {},
            elders: [],
            libraryLevels: {}
        };
    }
    if (!player.sect.tributeTotal) player.sect.tributeTotal = 0;
    if (player.sect.trialAuto === undefined) player.sect.trialAuto = false;
    if (!player.sect.trialLastTime) player.sect.trialLastTime = 0;
    if (!player.sect.libraryInherit) player.sect.libraryInherit = {};
    if (!player.sect.elders) player.sect.elders = [];
    if (!player.sect.libraryLevels) {
        const oldLv = player.sect.libraryLevel;
        const oldInherit = player.sect.libraryInherit || {};
        const oldCount = Object.keys(oldInherit).filter(k => oldInherit[k]).length;
        let migratedLv = oldLv || (oldCount > 0 ? Math.min(SECT_LIBRARY_MAX_LEVEL, oldCount * 2) : 0);
        player.sect.libraryLevels = {};
        if (migratedLv > 0 && sectLibraryItems) {
            sectLibraryItems.forEach(item => { player.sect.libraryLevels[item.id] = Math.min(migratedLv, SECT_LIBRARY_MAX_LEVEL); });
        }
    }
    if (!player.sect.transmitLastTime) player.sect.transmitLastTime = {};
    if (!player.sect.spiritPoolLastTime) player.sect.spiritPoolLastTime = 0;
    if (!player.sect.enlightenmentStart) player.sect.enlightenmentStart = 0;
}

// 切换宗门系统界面
function toggleSectSystem() {
    if (player.reincarnationCount < 1000) {
        alert("需要达到1000转才能开启宗门系统！");
        return;
    }
    
    const ui = document.getElementById('sectSystemUI');
    const overlay = document.getElementById('sectSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        initSectData();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateSectUI();
    }
}

// 创建宗门
function createSect() {
    if (player.sect.created) {
        logAction("你已经创建过宗门了！", "error");
        return;
    }
    
    const zongmenCount = Number(player.items && player.items.zongmen) || 0;
    if (zongmenCount < 1) {
        logAction("宗门令牌不足，无法创建宗门！", "error");
        return;
    }
    
    // 消耗宗门令牌
    player.items.zongmen = zongmenCount - 1;
    
    // 初始化宗门数据
    player.sect = {
        created: true,
        name: "无名宗门",
        level: 1,
        exp: 0,
        spiritStones: 1000,
        members: [],
        missions: [],
        techniques: {},
        creationTime: Date.now(),
        maxMembers: 5,
        tributeTotal: 0,
        trialAuto: false,
        trialLastTime: 0,
        libraryInherit: {},
        elders: [],
        libraryLevels: {},
        grotto: { spiritArrayLevel: 0, spiritFields: [] },
        transmitLastTime: {},
        spiritPoolLastTime: 0,
        enlightenmentStart: 0
    };
    
    // 自动添加掌门（玩家自己）
    player.sect.members.push({
    id: "leader",
    name: player.name,
    aptitude: "SS",  // 可以设置玩家资质，比如SS
    loyalty: 100,
    status: "idle",
    joinTime: Date.now(),
    isPlayer: true  // 添加标记，表示这是玩家
});
    
    logAction("成功创建宗门！", "success");
    updateSectUI();
   updateSectNameDisplay();
}
function getIdleMembers(includePlayer = true) {
    return player.sect.members.filter(member => {
        if (member.status !== 'idle') return false;
        if (member.id === 'leader' && !includePlayer) return false;
        return true;
    });
}
// 更新宗门界面
function updateSectUI() {
    // 打开/刷新界面时，优先检查一次是否满足升级条件（防止读档后声望已超阈值但未升级）
    if (player.sect && player.sect.created && typeof checkSectLevelUp === 'function') {
        checkSectLevelUp();
    }
    if (!player.sect.created) {
        document.getElementById('sectInfoContainer').innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3 style="color: #8B4513;">尚未创建宗门</h3>
                <p>创建宗门需要消耗1个宗门令牌</p>
                <button onclick="createSect()" style="background: #8B4513; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">创建宗门</button>
            </div>
        `;
        return;
    }
    
    // 更新宗门信息
    document.getElementById('sectInfoContainer').innerHTML = `
        <div style="display: flex; justify-content: space-between;">
            <div>
                <h3 style="color: #8B4513; margin: 0;">${player.sect.name}</h3>
                <div>等级: ${player.sect.level} | 声望: ${player.sect.exp.toFixed(0)}/${getNextLevelExp().toFixed(0)}</div>
                <div>成员: ${player.sect.members.length}/${player.sect.maxMembers}</div>
            </div>
            <div style="text-align: right;">
                <div>宗门灵石: <span style="color: #FFD700;">${player.sect.spiritStones.toFixed(0)}</span></div>
                <div>功法数量: ${Object.keys(player.sect.techniques).length}</div>
            </div>
        </div>
    `;
     // 更新招募消耗显示
    document.getElementById('recruitCost').textContent = calculateRecruitCost().toFixed(0);
    // 更新成员列表
    updateMemberList();
    
    // 更新任务列表
    updateMissionList();
    
    // 更新功法列表
    updateTechniqueList();
    
    // 更新设置页面
    document.getElementById('sectNameInput').value = player.sect.name;
    document.getElementById('sectCreationDate').textContent = new Date(player.sect.creationTime).toLocaleDateString();
    
    // 更新新功能界面
    updateSectTributeUI();
    updateSectTrialUI();
    updateSectLibraryUI();
    updateSectShopUI();
    if (typeof updateSectGrottoUI === 'function') updateSectGrottoUI();
    if (typeof updateSectTransmitUI === 'function') updateSectTransmitUI();
    if (typeof updateSectSpiritpoolUI === 'function') updateSectSpiritpoolUI();
    if (typeof updateSectEnlightenmentUI === 'function') updateSectEnlightenmentUI();
}

// 更新成员列表
function updateMemberList() {
    const container = document.getElementById('memberList');
    container.innerHTML = '';
    
    player.sect.members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        memberCard.style.background = '#444';
        memberCard.style.padding = '10px';
        memberCard.style.borderRadius = '5px';
        
        // 根据资质设置颜色
        let aptitudeColor = '#ccc';
        if (member.aptitude === 'SSS') aptitudeColor = '#FFD700';
        else if (member.aptitude === 'SS') aptitudeColor = '#FF6B6B';
        else if (member.aptitude === 'S') aptitudeColor = '#4ECDC4';
        else if (member.aptitude === 'A') aptitudeColor = '#FF9FF3';
        else if (member.aptitude === 'B') aptitudeColor = '#FECA57';
        else if (member.aptitude === 'C') aptitudeColor = '#54A0FF';
        
        // 检查成员是否在任务中
        const isOnMission = member.status === 'onMission';
        
        // 判断是否为玩家
        const isPlayer = member.id === 'leader';
        const isElder = (player.sect.elders || []).includes(member.id);
        const canBeElder = !isPlayer && (member.aptitude === 'S' || member.aptitude === 'SS' || member.aptitude === 'SSS');
        
        memberCard.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <div style="font-weight: bold; ${isPlayer ? 'color: #FFD700;' : ''}">
                    ${member.name} ${isPlayer ? '👑' : ''} ${isElder ? '⚜️' : ''}
                </div>
                <div style="color: ${aptitudeColor};">${member.aptitude}${isElder ? ' 长老' : ''}</div>
            </div>
            <div>忠诚度: ${member.loyalty}</div>
            <div>状态: ${isOnMission ? '<span style="color: #FF9800;">任务中</span>' : '空闲'}</div>
            ${!isPlayer && !isOnMission ? `
            <div style="display: flex; gap: 5px; margin-top: 10px; flex-wrap: wrap;">
                <button onclick="expelMember('${member.id}')" style="flex: 1; min-width: 45px; background: #f44336; color: white; border: none; padding: 5px; border-radius: 3px; cursor: pointer; font-size: 12px;">驱逐</button>
                <button onclick="giftMember('${member.id}')" style="flex: 1; min-width: 45px; background: #4CAF50; color: white; border: none; padding: 5px; border-radius: 3px; cursor: pointer; font-size: 12px;">赠礼</button>
                ${canBeElder ? `<button onclick="toggleElder('${member.id}')" style="flex: 1; min-width: 60px; background: ${isElder ? '#666' : '#FF9800'}; color: white; border: none; padding: 5px; border-radius: 3px; cursor: pointer; font-size: 12px;">${isElder ? '罢免' : '任命长老'}</button>` : ''}
            </div>
            ` : ''}
        `;
        
        container.appendChild(memberCard);
    });
}
function updateSectNameDisplay() {
    const sectNameDisplay = document.getElementById('sectNameDisplay');
    
    if (player.sect && player.sect.created) {
        sectNameDisplay.textContent = `宗门: ${player.sect.name}`;
        sectNameDisplay.style.display = 'block';
    } else {
        sectNameDisplay.style.display = 'none';
    }
}
function giftMember(memberId) {
    const member = player.sect.members.find(m => m.id === memberId);
    if (!member) return;
    
    // 检查玫瑰花数量
    if (player.items.roseq < 1) {
        logAction("香囊不足！", "error");
        return;
    }
    
    // 检查忠诚度是否已达上限
    if (member.loyalty >= 100) {
        logAction(`${member.name}的忠诚度已达上限！`, "info");
        return;
    }
    
    // 消耗香囊
    player.items.roseq--;
    
    // 增加忠诚度
    member.loyalty += 5;
    if (member.loyalty > 100) member.loyalty = 100;
    
    logAction(`赠送给${member.name}一个香囊，忠诚度提升5点！`, "success");
    updateSectUI();
    updateDisplay();
}
// 招募弟子
function recruitMember() {
    if (!player.sect.created) {
        logAction("请先创建宗门！", "error");
        return;
    }
    
    if (player.sect.members.length >= player.sect.maxMembers) {
        logAction("宗门成员已满！", "error");
        return;
    }
    
    const cost = calculateRecruitCost();
    if (player.sect.spiritStones < cost) {
        logAction(`灵石不足！需要 ${cost} 灵石`, "error");
        return;
    }
    
    // 消耗灵石
    player.sect.spiritStones -= cost;
    
    // 随机生成弟子属性
    const aptitudes = ['C', 'B', 'A', 'S', 'SS', 'SSS'];
    const weights = [0.60, 0.25, 0.10, 0.039, 0.01, 0.001]; 
    
    let rand = Math.random();
    let aptitude = 'C';
    for (let i = 0; i < weights.length; i++) {
        rand -= weights[i];
        if (rand <= 0) {
            aptitude = aptitudes[i];
            break;
        }
    }
    
    // 生成随机名字
    const familyNames = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫'];
    const givenNames = ['明', '华', '强', '伟', '芳', '娜', '秀英', '勇', '军', '杰', '磊', '超', '鹏', '婷'];
    const name = familyNames[Math.floor(Math.random() * familyNames.length)] + 
                 givenNames[Math.floor(Math.random() * givenNames.length)];
    
    // 添加新成员
    const newMember = {
        id: 'member_' + Date.now(),
        name: name,
        aptitude: aptitude,
        loyalty: 70 + Math.floor(Math.random() * 20), // 70-89的忠诚度
        status: 'idle',
        joinTime: Date.now()
    };
    
    player.sect.members.push(newMember);
    
    logAction(`成功招募弟子: ${name} (${aptitude}资质)`, "success");
    document.getElementById('recruitCost').textContent = calculateRecruitCost().toFixed(0);
    updateSectUI();
}

// 计算招募成本
function calculateRecruitCost() {
    let cost = 100 * Math.pow(1.15, player.sect.members.length);
    const elderBonus = getSectElderBonus();
    if (elderBonus && elderBonus.recruitCost < 0) cost *= (1 + elderBonus.recruitCost);
    return Math.floor(cost);
}
function startAllAvailableMissions() {
    if (!player.sect.created) {
        logAction("请先创建宗门！", "error");
        return;
    }
    
    // 获取所有任务
    const missions = initSectMissions();
    const aptitudesOrder = { 'C': 1, 'B': 2, 'A': 3, 'S': 4, 'SS': 5, 'SSS': 6 };
    
    // 获取所有空闲成员（包括玩家）
    const idleMembers = player.sect.members
        .filter(member => member.status === 'idle')
        .sort((a, b) => {
            // 玩家优先
            if (a.id === 'leader' && b.id !== 'leader') return -1;
            if (b.id === 'leader' && a.id !== 'leader') return 1;
            
            // 按资质等级降序排序
            const aLevel = aptitudesOrder[a.aptitude] || 0;
            const bLevel = aptitudesOrder[b.aptitude] || 0;
            if (bLevel !== aLevel) return bLevel - aLevel;
            
            // 同资质按忠诚度降序排序
            return b.loyalty - a.loyalty;
        });
    
    if (idleMembers.length === 0) {
        logAction("没有空闲的成员可以派遣！", "error");
        return;
    }
    
    let missionsAssigned = 0;
    let membersAssigned = 0;
    
    // 为每个空闲成员寻找能执行的任务
    idleMembers.forEach(member => {
        const memberLevel = aptitudesOrder[member.aptitude] || 0;
        
        // 寻找该成员能执行的所有任务
        const availableMissions = missions.filter(mission => {
            const requiredLevel = aptitudesOrder[mission.requiredAptitude];
            return memberLevel >= requiredLevel;
        });
        
        if (availableMissions.length > 0) {
            // 选择最适合的任务（按难度排序，先做高难度）
            availableMissions.sort((a, b) => b.difficulty - a.difficulty);
            const selectedMission = availableMissions[0];
            
            // 为这个任务创建一个新的任务实例
            const missionInstanceId = `${selectedMission.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // 更新成员状态
            member.status = 'onMission';
            
            // 添加任务实例
            player.sect.missions.push({
                id: missionInstanceId,
                baseMissionId: selectedMission.id,
                name: selectedMission.name,
                memberId: member.id,
                memberName: member.name,
                memberAptitude: member.aptitude,
                isPlayer: member.id === 'leader',  // 标记是否为玩家
                startTime: Date.now(),
                duration: selectedMission.duration,
                reward: selectedMission.reward,
                difficulty: selectedMission.difficulty
            });
            
            // 计算忠诚度加成（玩家忠诚度固定100）
            const loyaltyBonus = calculateLoyaltyBonus(member.loyalty);
            const bonusPercent = (loyaltyBonus * 100 - 100).toFixed(1);
            
            // 如果是玩家，显示特殊信息
            if (member.id === 'leader') {
                logAction(`🗡️ 掌门 ${member.name} 亲自出马执行任务: ${selectedMission.name}`, "success");
            } else {
                logAction(`派遣 ${member.name}(${member.aptitude}) 执行任务: ${selectedMission.name}`, "success");
            }
            
            missionsAssigned++;
            membersAssigned++;
        }
    });
    
    if (membersAssigned > 0) {
        const playerCount = idleMembers.filter(m => m.id === 'leader' && m.status === 'onMission').length;
        const discipleCount = membersAssigned - playerCount;
        
        let message = `成功派遣 ${membersAssigned} 名成员执行任务！`;
        if (playerCount > 0) {
            message += `（其中掌门亲自执行 ${playerCount} 个任务）`;
        }
        logAction(message, "success");
    } else {
        logAction("没有可以执行的任务", "warning");
    }
    
    updateSectUI();
}
function recallAllMissions() {
    if (!player.sect.created || player.sect.missions.length === 0) {
        logAction("当前没有进行中的任务", "info");
        return;
    }
    
    if (!confirm("确定要召回所有弟子吗？召回后不会获得任何任务奖励！")) {
        return;
    }
    
    const missionCount = player.sect.missions.length;
    
    // 召回所有任务中的弟子
    player.sect.missions.forEach(mission => {
        const member = player.sect.members.find(m => m.id === mission.memberId);
        if (member) {
            member.status = 'idle';
        }
    });
    
    // 清空任务列表
    player.sect.missions = [];
    
    logAction(`已召回所有${missionCount}个任务中的弟子`, "info");
    updateSectUI();
}

// 驱逐弟子
function expelMember(memberId) {
    const memberIndex = player.sect.members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) return;
    
    const member = player.sect.members[memberIndex];
    
    // 移除该成员正在执行的任务，避免任务列表泄漏
    player.sect.missions = player.sect.missions.filter(m => m.memberId !== memberId);
    if (player.sect.elders) player.sect.elders = player.sect.elders.filter(id => id !== memberId);
    
    // 移除成员
    player.sect.members.splice(memberIndex, 1);
    
    // 降低其他成员忠诚度（1-5点）
    player.sect.members.forEach(m => {
        if (m.id !== 'leader') {
            m.loyalty -= 1 + Math.floor(Math.random() * 4);
            if (m.loyalty < 0) m.loyalty = 0;
        }
    });
    
    logAction(`已驱逐弟子: ${member.name}`, "info");
    updateSectUI();
}

// 切换宗门标签页
function openSectTab(tabName, evt) {
    // 隐藏所有标签内容
    document.querySelectorAll('.sect-tabcontent').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // 移除所有标签的active类
    document.querySelectorAll('.sect-tablink').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 显示选中的标签内容并添加active类
    document.getElementById('sect' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).style.display = 'block';
    const e = evt || (typeof event !== 'undefined' ? event : null);
    if (e && e.currentTarget) e.currentTarget.classList.add('active');
}

// 初始化宗门任务
function initSectMissions() {
    return [
        {
            id: "gather_stones",
            name: "采集灵石",
            description: "派遣弟子前往灵脉采集灵石",
            requiredAptitude: "C",
            duration: 21600000, // 6小时
            reward: { stones: 600, exp: 300, cultivationExp: 10000 },
            difficulty: 1
        },
        {
            id: "hunt_demon",
            name: "剿灭妖兽",
            description: "清除宗门附近的低阶妖兽",
            requiredAptitude: "B",
            duration: 21600000, // 6小时
            reward: { stones: 800, exp: 400, cultivationExp: 50000 },
            difficulty: 2
        },
        {
            id: "explore_ruins",
            name: "探索遗迹",
            description: "探索古代修士遗留的洞府遗迹",
            requiredAptitude: "A",
            duration: 21600000, // 6小时
            reward: { stones: 1200, exp: 500, itemChance: 0.3, cultivationExp: 100000 },
            difficulty: 3
        },
        {
            id: "guard_caravan",
            name: "护送商队",
            description: "护送商队通过危险区域",
            requiredAptitude: "S",
            duration: 21600000, // 6小时
            reward: { stones: 1700, exp: 750, itemChance: 0.5, cultivationExp: 500000 },
            difficulty: 4
        },
        {
            id: "compete_tournament",
            name: "参加论道大会",
            description: "代表宗门参加修仙界论道大会",
            requiredAptitude: "SS",
            duration: 21600000, // 6小时
            reward: { stones: 2500, exp: 1000, itemChance: 0.7, cultivationExp: 1000000 },
            difficulty: 5
        },
        {
            id: "slay_ancient_demon",
            name: "讨伐上古魔头",
            description: "讨伐苏醒的上古魔头，维护修仙界和平",
            requiredAptitude: "SSS",
            duration: 21600000, // 6小时
            reward: { stones: 6000, exp: 2000, itemChance: 0.9, cultivationExp: 5000000 },
            difficulty: 6
        }
    ];
}

// 更新任务列表
function updateMissionList() {
    const missionContainer = document.getElementById('missionList');
    const activeMissionContainer = document.getElementById('activeMissionList');
    
    missionContainer.innerHTML = '';
    activeMissionContainer.innerHTML = '';
    
    // 获取所有基础任务
    const missions = initSectMissions();
    
    // 计算每个基础任务有多少个实例在执行
    const missionStats = {};
    player.sect.missions.forEach(mission => {
        if (mission.baseMissionId) {
            missionStats[mission.baseMissionId] = (missionStats[mission.baseMissionId] || 0) + 1;
        }
    });
    
    // 显示任务卡片
    missions.forEach(mission => {
        const missionCard = document.createElement('div');
        missionCard.className = 'mission-card';
        missionCard.style.background = '#444';
        missionCard.style.padding = '10px';
        missionCard.style.borderRadius = '5px';
        
        // 计算该任务有多少人在执行
        const activeCount = missionStats[mission.id] || 0;
        const maxActiveCount = 99; // 可设置最大同时执行人数
        
        missionCard.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #8B4513;">${mission.name}</h4>
            <p style="margin: 0 0 10px 0; font-size: 0.9em;">${mission.description}</p>
            <div style="font-size: 0.9em; margin-bottom: 10px;">
                <div>要求资质: ${mission.requiredAptitude}</div>
                <div>耗时: ${formatTimes(mission.duration)}</div>
                <div>奖励: ${mission.reward.stones}灵石/人, ${mission.reward.exp}声望/人${mission.reward.cultivationExp ? ', ' + mission.reward.cultivationExp + '修仙经验/人' : ''}</div>
                ${mission.reward.itemChance ? `<div>物品掉落几率: ${(mission.reward.itemChance * 100).toFixed(0)}%</div>` : ''}
                <div style="color: ${activeCount > 0 ? '#4CAF50' : '#FF9800'}; margin-top: 5px;">
                    🚀 执行中: ${activeCount}人
                </div>
            </div>
            <button onclick="startMissionq('${mission.id}')" 
                style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; width: 100%;">
                🚀 派遣符合条件的弟子
            </button>
            <div style="font-size: 0.8em; color: #999; text-align: center; margin-top: 5px;">
                可多人同时执行
            </div>
        `;
        
        missionContainer.appendChild(missionCard);
    });
    
    // 显示进行中的任务实例
    if (player.sect.missions.length === 0) {
        activeMissionContainer.innerHTML = '<p style="text-align: center; color: #999;">当前没有进行中的任务</p>';
    } else {
        // 按任务类型分组显示
        const missionsByType = {};
        
        player.sect.missions.forEach(mission => {
            if (!missionsByType[mission.name]) {
                missionsByType[mission.name] = [];
            }
            missionsByType[mission.name].push(mission);
        });
        
        Object.entries(missionsByType).forEach(([missionName, missionInstances]) => {
            const missionGroup = document.createElement('div');
            missionGroup.style.marginBottom = '15px';
            missionGroup.style.padding = '10px';
            missionGroup.style.background = '#555';
            missionGroup.style.borderRadius = '8px';
            
            let groupContent = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #8B4513;">${missionName}</h4>
                    <span style="color: #FFD700;">${missionInstances.length}人执行中</span>
                </div>
            `;
            
            missionInstances.forEach(mission => {
                const remaining = mission.startTime + mission.duration - Date.now();
                const progress = remaining > 0 ? 100 - (remaining / mission.duration * 100) : 100;
                const member = player.sect.members.find(m => m.id === mission.memberId);
                const memberName = member ? member.name : "未知弟子";
                
                groupContent += `
                    <div style="margin-bottom: 8px; padding: 8px; background: #444; border-radius: 5px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9em;">
                            <span>${memberName}(${mission.memberAptitude || member?.aptitude || '?'})</span>
                            <span style="color: ${remaining > 0 ? '#FFD700' : '#4CAF50'}">
                                ${remaining > 0 ? formatTimes(remaining) : '已完成'}
                            </span>
                        </div>
                        <div style="height: 4px; background: #333; border-radius: 2px; margin-top: 5px;">
                            <div style="height: 100%; background: #8B4513; border-radius: 2px; width: ${progress}%;"></div>
                        </div>
                    </div>
                `;
            });
            
            missionGroup.innerHTML = groupContent;
            activeMissionContainer.appendChild(missionGroup);
        });
    }
}


// 开始任务
function startMissionq(missionId) {
    if (!player.sect.created) {
        logAction("请先创建宗门！", "error");
        return;
    }
    
    // 获取任务详情
    const missions = initSectMissions();
    const baseMission = missions.find(m => m.id === missionId);
    if (!baseMission) return;
    
    // 查找所有符合条件的空闲成员（包括玩家）
    const aptitudesOrder = { 'C': 1, 'B': 2, 'A': 3, 'S': 4, 'SS': 5, 'SSS': 6 };
    const requiredLevel = aptitudesOrder[baseMission.requiredAptitude];
    
    const availableMembers = player.sect.members.filter(member => 
        member.status === 'idle' && aptitudesOrder[member.aptitude] >= requiredLevel
    );
    
    if (availableMembers.length === 0) {
        logAction("没有符合条件的空闲成员！", "error");
        return;
    }
    
    let membersAssigned = 0;
    let playerAssigned = false;
    
    // 为所有符合条件的成员创建任务实例
    availableMembers.forEach(member => {
        const missionInstanceId = `${missionId}_${Date.now()}_${member.id}_${Math.random().toString(36).substr(2, 9)}`;
        
        // 更新成员状态
        member.status = 'onMission';
        
        // 添加任务实例
        player.sect.missions.push({
            id: missionInstanceId,
            baseMissionId: missionId,
            name: baseMission.name,
            memberId: member.id,
            memberName: member.name,
            memberAptitude: member.aptitude,
            isPlayer: member.id === 'leader',
            startTime: Date.now(),
            duration: baseMission.duration,
            reward: baseMission.reward,
            difficulty: baseMission.difficulty
        });
        
        // 计算忠诚度加成
        const loyaltyBonus = calculateLoyaltyBonus(member.loyalty);
        
        // 如果是玩家，显示特殊信息
        if (member.id === 'leader') {
            logAction(`🗡️ 掌门 ${member.name} 亲自出马执行任务: ${baseMission.name}`, "success");
            playerAssigned = true;
        } else {
            const bonusPercent = (loyaltyBonus * 100 - 100).toFixed(1);
            logAction(`派遣 ${member.name}(${member.aptitude}) 执行任务: ${baseMission.name}`, "success");
        }
        
        membersAssigned++;
    });
    
    if (membersAssigned > 0) {
        let message = `成功派遣 ${membersAssigned} 名成员执行 ${baseMission.name} 任务！`;
        if (playerAssigned) {
            message += `（掌门亲自参与）`;
        }
        logAction(message, "success");
    }
    
    updateSectUI();
}

// 修改任务完成函数，为玩家添加特殊奖励
function completeMissionq(missionInstanceId) {
    const missionIndex = player.sect.missions.findIndex(m => m.id === missionInstanceId);
    if (missionIndex === -1) return;
    
    const mission = player.sect.missions[missionIndex];
    const member = player.sect.members.find(m => m.id === mission.memberId);
    
    // 成员已被驱逐等情况：只移除任务实例，避免任务列表泄漏
    if (!member) {
        player.sect.missions.splice(missionIndex, 1);
        return;
    }
    
    if (member) {
        // 检查任务是否已经完成
        if (member.status !== 'onMission') {
            player.sect.missions.splice(missionIndex, 1);
            updateSectUI();
            return;
        }
        
        // 恢复成员状态
        member.status = 'idle';
        
        // 计算忠诚度加成（玩家忠诚度固定100）
        const loyaltyBonus = calculateLoyaltyBonus(member.loyalty);
        const elderBonus = getSectElderBonus();
        const elderTaskMult = 1 + (elderBonus && elderBonus.taskReward ? elderBonus.taskReward : 0);
        const libraryBonus = getSectLibraryBonus();
        const libraryMissionMult = 1 + (libraryBonus && libraryBonus.missionReward ? libraryBonus.missionReward : 0);
        
        // 发放奖励（应用忠诚度、长老、藏经阁加成）
        let stonesReward = Math.floor(mission.reward.stones * loyaltyBonus * elderTaskMult * libraryMissionMult);
        let expReward = Math.floor(mission.reward.exp * loyaltyBonus * elderTaskMult * libraryMissionMult);
        let cultivationExpReward = 0;
        if (mission.reward.cultivationExp && player.cultivation) {
            cultivationExpReward = Math.floor(mission.reward.cultivationExp * loyaltyBonus * elderTaskMult * libraryMissionMult);
            if (member.id === 'leader') cultivationExpReward = Math.floor(cultivationExpReward * 1.2);
        }
        
        // 如果是玩家，可以给予额外奖励
        if (member.id === 'leader') {
            // 掌门执行任务获得额外20%奖励
            stonesReward = Math.floor(stonesReward * 1.2);
            expReward = Math.floor(expReward * 1.2);
        }
        
        player.sect.spiritStones += stonesReward;
        player.sect.exp += expReward;
        if (cultivationExpReward > 0 && player.cultivation) {
            player.cultivation.exp += cultivationExpReward;
        }
        
        // 物品掉落
        if (mission.reward.itemChance && Math.random() < mission.reward.itemChance) {
            const items = ['primaryGem', 'advancedGem', 'rebornDan', 'cultivationPill'];
            const randomItem = items[Math.floor(Math.random() * items.length)];
            player.items[randomItem] = (player.items[randomItem] || 0) + 1;
            
            // 如果是玩家，可能有更高几率获得稀有物品
            if (member.id === 'leader' && Math.random() < 0.3) {
                // 掌门有30%几率额外获得一个物品
                const additionalItem = items[Math.floor(Math.random() * items.length)];
                player.items[additionalItem] = (player.items[additionalItem] || 0) + 1;
                logAction(`🗡️ 掌门 ${member.name} 完成${mission.name}，带回${getItemName(randomItem)}和${getItemName(additionalItem)}！获得${stonesReward}灵石、${expReward}声望${cultivationExpReward > 0 ? '、' + cultivationExpReward + '修仙经验' : ''}！`, "success");
            } else {
                logAction(`${member.name}完成${mission.name}带回${getItemName(randomItem)}！获得${stonesReward}灵石、${expReward}声望${cultivationExpReward > 0 ? '、' + cultivationExpReward + '修仙经验' : ''}！`, "success");
            }
        } else {
            if (member.id === 'leader') {
                logAction(`🗡️ 掌门 ${member.name} 完成${mission.name}，获得${stonesReward}灵石、${expReward}声望${cultivationExpReward > 0 ? '、' + cultivationExpReward + '修仙经验' : ''}！（额外20%奖励）`, "success");
            } else {
                logAction(`${member.name}完成${mission.name}，获得${stonesReward}灵石、${expReward}声望${cultivationExpReward > 0 ? '、' + cultivationExpReward + '修仙经验' : ''}！`, "success");
            }
        }
        
        // 根据忠诚度变化调整忠诚度（玩家的忠诚度不变）
        if (member.id !== 'leader') {
            const loyaltyChange = Math.floor((loyaltyBonus - 1) * 5);
            member.loyalty += loyaltyChange;
            
            // 确保忠诚度在合理范围内
            if (member.loyalty < 0) member.loyalty = 0;
            if (member.loyalty > 100) member.loyalty = 100;
            
            if (loyaltyChange > 0) {
                logAction(`${member.name}的忠诚度提升了${loyaltyChange}点！`, "info");
            } else if (loyaltyChange < 0) {
                logAction(`${member.name}的忠诚度降低了${Math.abs(loyaltyChange)}点！`, "warning");
            }
        }
        
        // 检查升级
        checkSectLevelUp();
        
        // 移除任务实例
        player.sect.missions.splice(missionIndex, 1);
        
        setTimeout(() => {
            updateSectUI();
        }, 100);
    }
}
let isCheckingMissions = false;

registerInterval(() => {
    if (player.sect && player.sect.created && !isCheckingMissions) {
        isCheckingMissions = true;
        
        // 复制任务列表，避免在遍历时修改数组
        const missionsToCheck = [...player.sect.missions];
        
        missionsToCheck.forEach(mission => {
            if (Date.now() - mission.startTime >= mission.duration) {
                // 只处理尚未完成的任务
                const missionInProgress = player.sect.missions.find(m => m.id === mission.id);
                if (missionInProgress) {
                    completeMissionq(mission.id);
                }
            }
        });
        
        isCheckingMissions = false;
    }
    if (player.sect && player.sect.created && player.sect.trialAuto && typeof checkSectTrialAuto === 'function') {
        checkSectTrialAuto();
    }
}, 1000);

function calculateLoyaltyBonus(loyalty) {
    if (loyalty >= 50) {
        // 高于50忠诚度，每点增加1.5%奖励
        return 1 + (loyalty - 50) * 0.015;
    } else {
        // 低于50忠诚度，每点减少1.5%奖励
        return 1 - (50 - loyalty) * 0.015;
    }
}
// 检查宗门升级
function checkSectLevelUp() {
    const nextLevelExp = getNextLevelExp();
    if (player.sect.exp >= nextLevelExp) {
        player.sect.level++;
        player.sect.exp -= nextLevelExp;
        
        // 升级奖励
        player.sect.maxMembers += 2;
        player.sect.spiritStones += 500 * player.sect.level;
        
        logAction(`宗门升级至${player.sect.level}级！成员上限增加至${player.sect.maxMembers}`, "success");
    }
}

// 获取下一级所需经验
function getNextLevelExp() {
    return 1000 * Math.pow(1.5, player.sect.level - 1);
}

// 更新功法列表
function updateTechniqueList() {
    const container = document.getElementById('techniqueList');
    container.innerHTML = '';
    
    // 获取玩家所有功法
    const techniques = Object.keys(player.techniques).filter(t => t !== 'none');
    
    if (techniques.length === 0) {
        container.innerHTML = '<p>尚未习得任何功法</p>';
        return;
    }
    
    techniques.forEach(techId => {
        const techLevel = player.techniques[techId] || 1;
        const sectTechLevel = player.sect.techniques[techId] || 1;
        
        // 获取功法配置
        const techConfig = techniqueConfig[techId];
        const techName = techConfig ? techConfig.name : techId;
        
        // 计算当前加成效果
        const baseEffect = techConfig ? techConfig.effect : 0;
        const sectMultiplier = 1 + (sectTechLevel * 2); // 每级增加2倍效果
        const totalEffect = techLevel * baseEffect * sectMultiplier;
        
        // 格式化效果显示
        let effectDisplay = '';
        if (techConfig && techConfig.type) {
            switch (techConfig.type) {
                case 'health':
                    effectDisplay = `生命加成: +${(totalEffect * 100).toFixed(1)}%`;
                    break;
                case 'attack':
                    effectDisplay = `攻击加成: +${(totalEffect * 100 * 10) .toFixed(1)}%`;
                    break;
                case 'critRate':
                    effectDisplay = `暴击率: +${(totalEffect * 100).toFixed(1)}%`;
                    break;
                case 'critDamage':
                    effectDisplay = `爆伤加成: +${(totalEffect * 100 * 10).toFixed(1)}%`;
                    break;
                case 'multiAttack':
                    effectDisplay = `连击次数: +${(totalEffect * 0.02).toFixed(4)}`;
                    break;
                default:
                    effectDisplay = `效果: +${(totalEffect * 100).toFixed(1)}%`;
            }
        }
        
        const techCard = document.createElement('div');
        techCard.className = 'tech-card';
        techCard.style.background = '#444';
        techCard.style.padding = '10px';
        techCard.style.borderRadius = '5px';
        
        techCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4 style="margin: 0; color: #8B4513;">${techName}</h4>
                <div style="font-size: 0.9em;">宗门等级: ${sectTechLevel}</div>
            </div>
            <div style="margin: 10px 0; font-size: 0.9em;">
                <div>个人等级: ${techLevel}</div>
                <div>${effectDisplay}</div>
                <div>升级消耗: ${calculateUpgradeCost(techId).toFixed(0)}灵石</div>
            </div>
            <button onclick="upgradeTechnique('${techId}')" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; width: 100%;">升级功法</button>
        `;
        
        container.appendChild(techCard);
    });
    

    
    // 更新一键升级成本
    document.getElementById('upgradeAllCost').textContent = calculateUpgradeAllCost().toFixed(0);
}

// 升级功法
function upgradeTechnique(techName) {
    if (!player.sect.created) {
        logAction("请先创建宗门！", "error");
        return;
    }
    
    const cost = calculateUpgradeCost(techName);
    if (player.sect.spiritStones < cost) {
        logAction(`灵石不足！需要 ${cost} 灵石`, "error");
        return;
    }
    
    // 消耗灵石
    player.sect.spiritStones -= cost;
    
    // 升级功法
    if (!player.sect.techniques[techName]) {
        player.sect.techniques[techName] = 1;
    } else {
        player.sect.techniques[techName]++;
    }
     
       

    logAction(`成功升级功法: ${techName} (当前宗门等级: ${player.sect.techniques[techName]})`, "success");
   updatePlayerBattleStats();
    updateSectUI();
}

// 计算功法升级成本
function calculateUpgradeCost(techName) {
    const currentLevel = player.sect.techniques[techName] || 0;
    return 100 * Math.pow(1.2, currentLevel);
}

// 一键升级所有功法
function upgradeAllTechniques() {
    if (!player.sect.created) {
        logAction("请先创建宗门！", "error");
        return;
    }
    
    const totalCost = calculateUpgradeAllCost();
    if (player.sect.spiritStones < totalCost) {
        logAction(`灵石不足！需要 ${totalCost} 灵石`, "error");
        return;
    }
    
    // 消耗灵石
    player.sect.spiritStones -= totalCost;
    
    // 升级所有功法
    Object.keys(player.techniques).forEach(techName => {
        if (techName !== 'none') {
            if (!player.sect.techniques[techName]) {
                player.sect.techniques[techName] = 1;
            } else {
                player.sect.techniques[techName]++;
            }
        }
    });
    
    logAction("成功一键升级所有功法！", "success");
   updatePlayerBattleStats();
    updateSectUI();
}

// 计算一键升级总成本
function calculateUpgradeAllCost() {
    let totalCost = 0;
    Object.keys(player.techniques).forEach(techName => {
        if (techName !== 'none') {
            totalCost += calculateUpgradeCost(techName);
        }
    });
    return totalCost;
}

// 修改宗门名称
function changeSectName() {
    const newName = document.getElementById('sectNameInput').value.trim();
    
    if (!newName) {
        logAction("宗门名称不能为空！", "error");
        return;
    }
    
    if (newName.length > 20) {
        logAction("宗门名称过长（最多20字符）！", "error");
        return;
    }
    
    player.sect.name = newName;
    logAction(`宗门名称已修改为: ${newName}`, "success");
    updateSectUI();
  updateSectNameDisplay();
}

// 解散宗门
function disbandSect() {
    if (!confirm("确定要解散宗门吗？将会失去所有宗门成员和等级！")) {
        return;
    }
    
    // 返还部分资源
    const refund = Math.floor(player.sect.spiritStones * 0.5);
    player.spiritStones += refund;
    
    // 重置宗门数据
    player.sect = {
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
        tributeTotal: 0,
        trialAuto: false,
        trialLastTime: 0,
        libraryInherit: {},
        elders: [],
        libraryLevels: {}
    };
    
    logAction(`宗门已解散，返还${refund}灵石`, "info");
    updateSectUI();
   updateSectNameDisplay();
}

// 辅助函数：格式化时间
function formatTimes(ms) {
    if (ms <= 0) return "已完成";
    
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    return `${hours}小时 ${minutes}分钟 ${seconds}秒`;
}

// 辅助函数：获取物品名称
function getItemName(itemKey) {
    const names = {
        'superiorGem': '极品宝石',
        'baitCount': '鱼饵',
        'rebornDan': '洗髓丹',
        'companionKey': '伴侣钥匙',
        'primaryGem': '初级宝石',
        'advancedGem': '高级宝石',
        'cultivationPill': '修炼丹',
        'roseq': '香囊',
        'zongmen': '宗门令牌',
        'danyao1': '蕴灵筑基丹', 'danyao2': '凝元固窍丹', 'danyao3': '渡厄金还丹', 'danyao4': '九转轮回丹', 'danyao5': '混元道果丹'
    };
    return names[itemKey] || itemKey;
}


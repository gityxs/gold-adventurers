// 夜店系统
// 十大特色玩法
// ========== 10 大特色玩法逻辑 ==========
function getThemeOfDay() {
    var nc = player.nightClub;
    if (!nc) return '';
    var now = new Date();
    var today = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    if (nc.themeDayDate === today && nc.themeOfDay) return nc.themeOfDay;
    var themes = nightClubConfig.themeDay && nightClubConfig.themeDay.themes ? nightClubConfig.themeDay.themes : [];
    nc.themeDayDate = today;
    if (themes.length === 0) { nc.themeOfDay = ''; nc.themeOfDayDesc = ''; return ''; }
    var theme = themes[today % themes.length];
    nc.themeOfDay = typeof theme === 'string' ? theme : (theme.name || '');
    nc.themeOfDayDesc = typeof theme === 'object' && theme.desc ? theme.desc : '';
    return nc.themeOfDay;
}
function nightClubCheckCollectibles() {
    if (!nightClubConfig.collectibles || !nightClubConfig.collectibles.items) return;
    var list = player.nightClub.collectiblesUnlocked || [];
    nightClubConfig.collectibles.items.forEach(function(item) {
        if (list.indexOf(item.id) !== -1) return;
        if (typeof item.unlockCond === 'function' && item.unlockCond(player)) {
            list.push(item.id);
            player.nightClub.collectiblesUnlocked = list;
            logAction('收藏品解锁：' + item.name + '！', 'success');
        }
    });
}

function getNightClubMemberTier() {
    var tiers = nightClubConfig.membershipTiers;
    if (!tiers || !tiers.length) return -1;
    var spent = (player.nightClub && player.nightClub.totalSpentForBlackCard) ? player.nightClub.totalSpentForBlackCard : 0;
    for (var i = tiers.length - 1; i >= 0; i--) {
        if (spent >= tiers[i].requiredSpend) return i;
    }
    return -1;
}
function openNightClubMemberModal() {
    var listEl = document.getElementById('nightClubMemberList');
    if (!listEl) return;
    var tiers = nightClubConfig.membershipTiers || [];
    var spent = (player.nightClub && player.nightClub.totalSpentForBlackCard) ? player.nightClub.totalSpentForBlackCard : 0;
    var currentTier = getNightClubMemberTier();
    var html = '<p style="color:#aaa;font-size:12px;margin-bottom:10px;">已累计消费 <span style="color:#FFD700;">' + Math.floor(spent).toLocaleString() + '</span> 星币</p>';
    tiers.forEach(function(t, i) {
        var unlocked = spent >= t.requiredSpend;
        var coinsPct = ((t.bonusCoins - 1) * 100).toFixed(0);
        var expPct = ((t.bonusExp - 1) * 100).toFixed(0);
        html += '<div style="background:' + (unlocked ? 'linear-gradient(135deg,rgba(21,101,192,0.25),#252535)' : '#252535') + ';border-radius:8px;padding:10px 12px;margin-bottom:6px;border-left:4px solid ' + (unlocked ? '#42a5f5' : '#555') + ';">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
        html += '<span style="color:' + (unlocked ? '#42a5f5' : '#888') + ';font-weight:600;">' + (i + 1) + '. ' + t.name + '</span>';
        html += '<span style="font-size:11px;color:' + (unlocked ? '#4CAF50' : '#888') + ';">' + (unlocked ? '已解锁' : (Math.floor(spent).toLocaleString() + ' / ' + t.requiredSpend.toLocaleString())) + '</span>';
        html += '</div>';
        html += '<div style="font-size:11px;color:#aaa;">星币+' + coinsPct + '% · 经验+' + expPct + '%</div>';
        html += '</div>';
    });
    listEl.innerHTML = html;
    document.getElementById('nightClubMemberModal').style.display = 'block';
}
function openCollectiblesShowcaseModal() {
    nightClubCheckCollectibles();
    var listEl = document.getElementById('nightClubCollectiblesList');
    if (!listEl) return;
    var items = nightClubConfig.collectibles && nightClubConfig.collectibles.items ? nightClubConfig.collectibles.items : [];
    var unlocked = player.nightClub.collectiblesUnlocked || [];
    var html = '';
    items.forEach(function(item, idx) {
        var isUnlocked = unlocked.indexOf(item.id) !== -1;
        var effectText = [];
        if (item.effect && item.effect.coins) effectText.push('星币+' + ((item.effect.coins - 1) * 100).toFixed(0) + '%');
        if (item.effect && item.effect.exp) effectText.push('经验+' + ((item.effect.exp - 1) * 100).toFixed(0) + '%');
        var effectStr = effectText.length ? effectText.join('、') : '-';
        html += '<div style="background:' + (isUnlocked ? 'linear-gradient(135deg,rgba(255,215,0,0.2),#252535)' : '#252535') + ';border-radius:10px;padding:12px;border-left:4px solid ' + (isUnlocked ? '#FFD700' : '#555') + ';">';
        html += '<div style="color:' + (isUnlocked ? '#FFD700' : '#888') + ';font-weight:600;">' + (idx + 1) + '. ' + item.name + '</div>';
        html += '<div style="font-size:11px;color:#4CAF50;margin:4px 0;">' + effectStr + '</div>';
        html += '<div style="font-size:10px;color:#888;">' + (isUnlocked ? '已解锁' : ('解锁条件：' + (item.condDesc || '达成条件'))) + '</div>';
        html += '</div>';
    });
    listEl.innerHTML = html || '<p style="color:#888;">暂无收藏品</p>';
    document.getElementById('nightClubCollectiblesModal').style.display = 'block';
}

function updateNightClubPlayTab() {
    var grid = document.getElementById('nightClubPlayGrid');
    if (!grid) return;
    nightClubCheckCollectibles();
    getThemeOfDay();
    var luckyStatus = player.nightClub.luckyMomentEndTime > Date.now() ? (player.nightClub.luckyMomentName || '幸运') + '进行中' : '等待触发';
    var themeName = player.nightClub.themeOfDay || getThemeOfDay();
    var themeDesc = player.nightClub.themeOfDayDesc ? ' · ' + player.nightClub.themeOfDayDesc : '';
    var tips = [
        { title: ' 幸运时刻', desc: '小幸运/幸运时刻/大幸运/超级幸运四档随机触发，收益×2～×3持续5～12分钟', status: luckyStatus, btn: null },
        { title: '调酒师小游戏', desc: '消耗500星币，QTE成功得800星币+口碑', status: '', btn: '<button onclick="openBartenderGameModal()" style="background:#00897b;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;">玩一次</button>' },
        { title: '豪华包厢竞拍', desc: '普通/豪华/至尊/总统四档包厢，收益+25%～+85%', status: (player.nightClub.vipBoxEndTime > Date.now() ? '生效中' : ''), btn: '<button onclick="openVipBoxAuctionModal()" style="background:#6a1b9a;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;">竞拍</button>' },
        { title: '人气打榜', desc: '每周按人气档位领奖，9档(人气200～5万+)', status: '', btn: '<button onclick="claimPopularityRank()" style="background:#ff9800;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;">领奖</button>' },
        { title: '派对主题日', desc: '今日：' + themeName + themeDesc + '，全收益+15%', status: '', btn: null },
        { title: '神秘嘉宾', desc: '当红明星/隐形富豪等6类', status: '', btn: null },
        { title: '限时挑战', desc: '10项限时挑战，售出/星币/VIP多目标', status: (player.nightClub.timeChallengeActive ? '挑战中' : ''), btn: '<button onclick="openNightClubChallengeModal()" style="background:#7b1fa2;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;">挑战</button>' },
        { title: '会员查看', desc: '累计消费解锁16档会员，星币与经验永久加成', status: (function(){ var t = getNightClubMemberTier(); var tiers = nightClubConfig.membershipTiers; return '当前：' + (t >= 0 && tiers && tiers[t] ? tiers[t].name : '未达标'); })(), btn: '<button onclick="openNightClubMemberModal()" style="background:#1565c0;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;">查看</button>' },
        { title: '员工才艺秀', desc: '歌唱/舞蹈/魔术/脱口秀等6种才艺，45分钟共享冷却', status: '', btn: '<button onclick="openStaffTalentShowModal()" style="background:#2e7d32;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;">举办</button>' },
        { title: '收藏品展示', desc: '已解锁 ' + (player.nightClub.collectiblesUnlocked || []).length + '/33 件，永久收益加成', status: '', btn: '<button onclick="openCollectiblesShowcaseModal()" style="background:#FFD700;color:#1a1a1a;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;">查看展示</button>' }
    ];
    var html = '';
    tips.forEach(function(t) {
        html += '<div style="background:linear-gradient(135deg,#252535 0%,#1a1a2a 100%);border-radius:10px;padding:12px;border:1px solid rgba(156,39,176,0.3);">';
        html += '<div style="color:#ce93d8;font-weight:600;margin-bottom:6px;">' + t.title + '</div>';
        html += '<div style="font-size:11px;color:#aaa;margin-bottom:6px;">' + t.desc + '</div>';
        if (t.status) html += '<div style="font-size:11px;color:#ffd54f;">' + t.status + '</div>';
        if (t.btn) html += '<div style="margin-top:8px;">' + t.btn + '</div>';
        html += '</div>';
    });
    grid.innerHTML = html;
}

var bartenderGameRunning = false;
var bartenderGameSliderPos = 0;
var bartenderGameDir = 1;
var bartenderGameAnimId = null;
function openBartenderGameModal() {
    var cfg = nightClubConfig.bartenderGame;
    if (!cfg || player.nightClub.starCoins < cfg.cost) {
        logAction('星币不足 ' + cfg.cost + '！', 'error');
        return;
    }
    player.nightClub.starCoins -= cfg.cost;
    player.nightClub.totalSpentForBlackCard = (player.nightClub.totalSpentForBlackCard || 0) + cfg.cost;
    document.getElementById('nightClubBartenderModal').style.display = 'flex';
    document.getElementById('bartenderGameResult').textContent = '';
    bartenderGameRunning = true;
    bartenderGameSliderPos = Math.random() * 80;
    bartenderGameDir = 1;
    var zone = document.getElementById('bartenderGameZone');
    var green = document.getElementById('bartenderGreen');
    if (zone && green) {
        var zoneW = zone.offsetWidth - 20;
        var greenLeft = (zoneW * 0.35);
        green.style.width = '60px';
        green.style.left = (greenLeft + 'px');
    }
    function animate() {
        if (!bartenderGameRunning) return;
        var zone = document.getElementById('bartenderGameZone');
        if (!zone) return;
        var zoneW = zone.offsetWidth - 20;
        bartenderGameSliderPos += bartenderGameDir * (zoneW * 0.02);
        if (bartenderGameSliderPos >= zoneW) { bartenderGameSliderPos = zoneW; bartenderGameDir = -1; }
        if (bartenderGameSliderPos <= 0) { bartenderGameSliderPos = 0; bartenderGameDir = 1; }
        var slider = document.getElementById('bartenderSlider');
        if (slider) slider.style.left = bartenderGameSliderPos + 'px';
        bartenderGameAnimId = requestAnimationFrame(animate);
    }
    if (bartenderGameAnimId) cancelAnimationFrame(bartenderGameAnimId);
    animate();
    updateNightClubUI();
}
function bartenderGameClick() {
    if (!bartenderGameRunning) return;
    bartenderGameRunning = false;
    if (bartenderGameAnimId) { cancelAnimationFrame(bartenderGameAnimId); bartenderGameAnimId = null; }
    var zone = document.getElementById('bartenderGameZone');
    var green = document.getElementById('bartenderGreen');
    if (!zone || !green) return;
    var zoneW = zone.offsetWidth - 20;
    var greenLeft = parseFloat(green.style.left) || (zoneW * 0.35);
    var greenW = 60;
    var hit = bartenderGameSliderPos >= greenLeft && bartenderGameSliderPos <= greenLeft + greenW;
    var cfg = nightClubConfig.bartenderGame;
    var resultEl = document.getElementById('bartenderGameResult');
    if (hit && cfg) {
        if (cfg.successReward.coins) player.nightClub.starCoins += cfg.successReward.coins;
        if (cfg.successReward.reputation) player.nightClub.reputation = (player.nightClub.reputation || 0) + cfg.successReward.reputation;
        if (resultEl) resultEl.textContent = '成功！+' + (cfg.successReward.coins || 0) + '星币，+' + (cfg.successReward.reputation || 0) + '口碑';
        logAction('调酒成功！', 'success');
    } else {
        if (cfg && cfg.failReward.coins) player.nightClub.starCoins += cfg.failReward.coins;
        if (resultEl) resultEl.textContent = '失败，安慰奖 +' + (cfg.failReward.coins || 0) + '星币';
    }
    updateNightClubUI();
}
function closeBartenderGameModal() {
    bartenderGameRunning = false;
    if (bartenderGameAnimId) { cancelAnimationFrame(bartenderGameAnimId); bartenderGameAnimId = null; }
    document.getElementById('nightClubBartenderModal').style.display = 'none';
}

function openVipBoxAuctionModal() {
    var cfg = nightClubConfig.vipBoxAuction;
    if (!cfg || !cfg.tiers) return;
    var listEl = document.getElementById('nightClubVipBoxList');
    if (!listEl) return;
    var html = '';
    cfg.tiers.forEach(function(t) {
        var can = player.nightClub.starCoins >= t.cost;
        html += '<div style="background:#252535;border-radius:8px;padding:12px;margin-bottom:8px;border-left:4px solid #6a1b9a;">';
        html += '<div style="color:#ce93d8;">' + t.name + '</div>';
        html += '<div style="font-size:11px;color:#888;">' + t.durationMin + '分钟 · 收益+' + ((t.bonusMultiplier - 1) * 100).toFixed(0) + '%</div>';
        html += '<button onclick="doVipBoxAuction(\'' + t.id + '\'); document.getElementById(\'nightClubVipBoxModal\').style.display=\'none\'" style="background:' + (can ? '#6a1b9a' : '#555') + ';color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;margin-top:6px;" ' + (can ? '' : 'disabled') + '>竞拍 ' + t.cost.toLocaleString() + '✨</button>';
        html += '</div>';
    });
    listEl.innerHTML = html;
    document.getElementById('nightClubVipBoxModal').style.display = 'block';
}
function doVipBoxAuction(tierId) {
    var cfg = nightClubConfig.vipBoxAuction;
    if (!cfg || !cfg.tiers) return;
    var tier = tierId ? cfg.tiers.find(function(t) { return t.id === tierId; }) : cfg.tiers[0];
    if (!tier || player.nightClub.starCoins < tier.cost) {
        logAction('星币不足 ' + tier.cost + '！', 'error');
        return;
    }
    player.nightClub.starCoins -= tier.cost;
    player.nightClub.totalSpentForBlackCard = (player.nightClub.totalSpentForBlackCard || 0) + tier.cost;
    player.nightClub.vipBoxEndTime = Date.now() + tier.durationMin * 60 * 1000;
    player.nightClub.vipBoxMultiplier = tier.bonusMultiplier;
    logAction(tier.name + '竞拍成功！' + tier.durationMin + '分钟内收益+' + ((tier.bonusMultiplier - 1) * 100).toFixed(0) + '%', 'success');
    updateNightClubUI();
    if (document.getElementById('nightClubPlay') && document.getElementById('nightClubPlay').style.display === 'block') updateNightClubPlayTab();
}

function claimPopularityRank() {
    var cfg = nightClubConfig.popularityRank;
    if (!cfg || !cfg.rewards) return;
    var now = new Date();
    var weekNum = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
    var last = player.nightClub.lastPopularityRankWeek || 0;
    if (weekNum <= last) {
        logAction('本周已领过人气榜奖励或未到新一周', 'info');
        return;
    }
    var pop = Math.floor(player.nightClub.popularity || 0);
    var reward = null;
    var tierDesc = '';
    for (var ri = 0; ri < cfg.rewards.length; ri++) {
        if (pop >= cfg.rewards[ri].minPop) {
            reward = cfg.rewards[ri];
            tierDesc = '人气≥' + cfg.rewards[ri].minPop.toLocaleString();
            break;
        }
    }
    if (!reward) {
        logAction('人气不足' + (cfg.rewards[cfg.rewards.length - 1].minPop || 200) + '，无法领取人气榜奖励', 'info');
        return;
    }
    player.nightClub.lastPopularityRankWeek = weekNum;
    if (reward.coins) player.nightClub.starCoins += reward.coins;
    if (reward.pop) player.nightClub.popularity = (player.nightClub.popularity || 0) + reward.pop;
    logAction('人气榜领奖 ' + tierDesc + '：+' + (reward.coins || 0) + '星币，+' + (reward.pop || 0) + '人气', 'success');
    updateNightClubUI();
}

function openStaffTalentShowModal() {
    var cfg = nightClubConfig.staffTalentShow;
    if (!cfg || !cfg.shows) return;
    var listEl = document.getElementById('nightClubTalentShowList');
    if (!listEl) return;
    var cooldownMin = cfg.cooldownMin || 60;
    var last = player.nightClub.staffTalentShowLastTime || 0;
    var remain = Math.ceil((last + cooldownMin * 60 * 1000 - Date.now()) / 60000);
    var onCooldown = remain > 0;
    var html = onCooldown ? '<p style="color:#ff9800;font-size:12px;">冷却中，剩余 ' + remain + ' 分钟</p>' : '';
    cfg.shows.forEach(function(s) {
        var can = !onCooldown && player.nightClub.starCoins >= s.cost;
        html += '<div style="background:#252535;border-radius:8px;padding:10px;margin-bottom:6px;border-left:4px solid #2e7d32;">';
        html += '<div style="color:#a5d6a7;">' + s.name + '</div>';
        html += '<div style="font-size:11px;color:#888;">人气+' + s.popularityGain + ' 经验+' + s.expGain + ' · ' + s.cost.toLocaleString() + '✨</div>';
        html += '<button onclick="doStaffTalentShow(\'' + s.id + '\'); document.getElementById(\'nightClubTalentShowModal\').style.display=\'none\'" style="background:' + (can ? '#2e7d32' : '#555') + ';color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;margin-top:4px;" ' + (can ? '' : 'disabled') + '>举办</button>';
        html += '</div>';
    });
    listEl.innerHTML = html || '<p style="color:#888;">暂无才艺秀</p>';
    document.getElementById('nightClubTalentShowModal').style.display = 'block';
}
function doStaffTalentShow(showId) {
    var cfg = nightClubConfig.staffTalentShow;
    if (!cfg || !cfg.shows) return;
    var show = showId ? cfg.shows.find(function(s) { return s.id === showId; }) : cfg.shows[0];
    if (!show || player.nightClub.starCoins < show.cost) {
        logAction('星币不足 ' + show.cost + '！', 'error');
        return;
    }
    var cooldownMin = cfg.cooldownMin || 60;
    var last = player.nightClub.staffTalentShowLastTime || 0;
    if (Date.now() - last < cooldownMin * 60 * 1000) {
        logAction('才艺秀冷却中，请稍后再试', 'error');
        return;
    }
    player.nightClub.starCoins -= show.cost;
    player.nightClub.totalSpentForBlackCard = (player.nightClub.totalSpentForBlackCard || 0) + show.cost;
    player.nightClub.staffTalentShowLastTime = Date.now();
    player.nightClub.popularity = (player.nightClub.popularity || 0) + show.popularityGain;
    player.nightClub.exp += show.expGain;
    logAction(show.name + '成功！人气+' + show.popularityGain + '，经验+' + show.expGain, 'success');
    updateNightClubUI();
}

function openNightClubChallengeModal() {
    var listEl = document.getElementById('nightClubChallengeList');
    if (!listEl) return;
    var cfg = nightClubConfig.timeChallenge;
    var active = player.nightClub.timeChallengeActive;
    var html = '';
    if (active) {
        var elapsed = (Date.now() - player.nightClub.timeChallengeStart) / (60 * 1000);
        var prog = player.nightClub[active.progressKey] || 0;
        html += '<p style="color:#ffd54f;">进行中：' + active.name + '</p>';
        html += '<p style="font-size:12px;">进度 ' + prog + '/' + active.target + ' · 已过 ' + elapsed.toFixed(1) + ' 分钟</p>';
    } else {
        (cfg.list || []).forEach(function(c) {
            html += '<div style="background:#252535;border-radius:8px;padding:10px;margin-bottom:8px;">';
            html += '<div style="color:#e0e0e0;">' + c.name + '</div>';
            html += '<div style="font-size:11px;color:#888;">奖励: ' + (c.reward.coins || 0) + '星币 ' + (c.reward.popularity ? '人气+' + c.reward.popularity : '') + (c.reward.reputation ? ' 口碑+' + c.reward.reputation : '') + '</div>';
            html += '<button onclick="startNightClubChallenge(\'' + c.id + '\'); document.getElementById(\'nightClubChallengeModal\').style.display=\'none\'" style="background:#7b1fa2;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;margin-top:6px;">开始</button>';
            html += '</div>';
        });
    }
    listEl.innerHTML = html || '<p style="color:#888;">暂无挑战</p>';
    document.getElementById('nightClubChallengeModal').style.display = 'flex';
}
function startNightClubChallenge(id) {
    var cfg = nightClubConfig.timeChallenge && nightClubConfig.timeChallenge.list.find(function(c) { return c.id === id; });
    if (!cfg || player.nightClub.timeChallengeActive) return;
    player.nightClub.timeChallengeActive = cfg;
    player.nightClub.timeChallengeStart = Date.now();
    player.nightClub.challengeSold = 0;
    player.nightClub.challengeEarned = 0;
    player.nightClub.challengeVip = 0;
    logAction('限时挑战开始：' + cfg.name, 'success');
    updateNightClubUI();
}


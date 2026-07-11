// 宗门修仙建筑
// ========== 供奉殿功能 ==========
function updateSectTributeUI() {
    const container = document.getElementById('sectTribute');
    if (!container || !player.sect.created) return;
    const fmt = (n) => (n >= 1e8 ? n.toExponential(2) : (n||0).toLocaleString());
    document.getElementById('tributeSectStones').textContent = fmt(player.sect.spiritStones);
    document.getElementById('tributeTotal').textContent = fmt(player.sect.tributeTotal || 0);
    const sectLevel = player.sect.level || 1;
    const maxBonusPercent = sectLevel * 100;
    const rawPercent = Math.floor((player.sect.tributeTotal || 0) / 10000);
    const bonusPercent = Math.min(rawPercent, maxBonusPercent);
    document.getElementById('tributeBonusPercent').textContent = bonusPercent;
    const capHint = document.getElementById('tributeBonusCapHint');
    if (capHint) capHint.textContent = `（上限: 宗门等级×100 = ${maxBonusPercent}%）`;
}
function tributeToSect() {
    if (!player.sect.created) { logAction("请先创建宗门！", "error"); return; }
    const amount = parseInt(document.getElementById('tributeAmount').value) || 0;
    if (amount <= 0) { logAction("请输入有效数量！", "error"); return; }
    if ((player.sect.spiritStones || 0) < amount) { logAction("宗门灵石不足！", "error"); return; }
    player.sect.spiritStones -= amount;
    player.sect.tributeTotal = (player.sect.tributeTotal || 0) + amount;
    logAction(`消耗 ${amount} 宗门灵石供奉，获得祝福加成！`, "success");
    updateSectUI(); updateDisplay();
}
function withdrawFromSect() {
    if (!player.sect.created) { logAction("请先创建宗门！", "error"); return; }
    const amount = parseInt(document.getElementById('tributeAmount').value) || 0;
    if (amount <= 0) { logAction("请输入有效数量！", "error"); return; }
    if (player.sect.spiritStones < amount) { logAction("宗门灵石不足！", "error"); return; }
    player.sect.spiritStones -= amount;
    player.spiritStones = (player.spiritStones || 0) + amount;
    // 提取时同步减少累计供奉额，祝福按净供奉（供奉-提取）计算，防止无限刷祝福
    player.sect.tributeTotal = Math.max(0, (player.sect.tributeTotal || 0) - amount);
    logAction(`从宗门提取 ${amount} 灵石！`, "success");
    updateSectUI(); updateDisplay();
}
function getSectTributeGPSBonus() {
    if (!player.sect || !player.sect.created) return 1;
    const sectLevel = player.sect.level || 1;
    const maxBonusPercent = sectLevel * 100;
    const rawPercent = Math.floor((player.sect.tributeTotal || 0) / 10000);
    const bonusPercent = Math.min(rawPercent, maxBonusPercent);
    return 1 + bonusPercent * 0.01;
}

// ========== 试炼塔功能 ==========
const SECT_TRIAL_INTERVAL = 6 * 60 * 60 * 1000;
function updateSectTrialUI() {
    const container = document.getElementById('sectTrial');
    if (!container || !player.sect.created) return;
    const checkbox = document.getElementById('trialAutoToggle');
    if (checkbox) checkbox.checked = player.sect.trialAuto || false;
    const lastTime = player.sect.trialLastTime || 0;
    const remaining = lastTime > 0 ? Math.max(0, lastTime + SECT_TRIAL_INTERVAL - Date.now()) : 0;
    const nextEl = document.getElementById('trialNextTime');
    const btnEl = document.getElementById('trialRunBtn');
    const hintEl = document.getElementById('trialCooldownHint');
    if (nextEl) nextEl.textContent = lastTime > 0 ? formatTimes(remaining) : '随时可试炼';
    if (btnEl) {
        const onCooldown = remaining > 0;
        btnEl.disabled = onCooldown;
        btnEl.style.opacity = onCooldown ? '0.6' : '1';
    }
    if (hintEl) hintEl.textContent = remaining > 0 ? '试炼冷却中，每6小时可试炼一次' : '';
}
function toggleSectTrialAuto() {
    if (!player.sect.created) return;
    player.sect.trialAuto = document.getElementById('trialAutoToggle').checked;
    logAction(player.sect.trialAuto ? "已开启自动试炼" : "已关闭自动试炼", "info");
    updateSectUI();
}
function runSectTrial(fromAuto) {
    if (!player.sect.created) { logAction("请先创建宗门！", "error"); return; }
    const now = Date.now();
    const lastTime = player.sect.trialLastTime || 0;
    if (lastTime > 0 && (now - lastTime) < SECT_TRIAL_INTERVAL) {
        const remaining = SECT_TRIAL_INTERVAL - (now - lastTime);
        logAction("试炼冷却中，请等待 " + formatTimes(remaining), "warning");
        return;
    }
    const idleCount = player.sect.members.filter(m => m.status === 'idle').length;
    if (idleCount === 0) {
        if (!fromAuto) logAction("没有空闲弟子可参与试炼！", "warning");
        return;
    }
    const expReward = idleCount * 1000;
    const stonesReward = idleCount * (player.sect.level || 1) * 5000;
    player.sect.exp += expReward;
    player.sect.spiritStones += stonesReward;
    player.sect.trialLastTime = Date.now();
    logAction(`试炼完成！${idleCount}名弟子获得 ${expReward} 声望、${stonesReward} 灵石（下次试炼需等待6小时）`, "success");
    // 试炼获得声望后检查是否满足升级条件
    if (typeof checkSectLevelUp === 'function') {
        checkSectLevelUp();
    }
    updateSectUI();
}
function checkSectTrialAuto() {
    if (!player.sect || !player.sect.created || !player.sect.trialAuto) return;
    const lastTime = player.sect.trialLastTime || 0;
    if (Date.now() - lastTime >= SECT_TRIAL_INTERVAL) runSectTrial(true);
}

// ========== 藏经阁传承功法（分开展示，每项10级，消耗=100万×目标等级） ==========
const SECT_LIBRARY_MAX_LEVEL = 10;
const SECT_LIBRARY_BASE_COST = 1000000;
const sectLibraryItems = [
    { id: 'inherit_attack', name: '破军传承', desc: '修仙副本攻击+20%/级', key: 'dungeonAttack', perLevel: 0.2 },
    { id: 'inherit_health', name: '护体传承', desc: '修仙副本生命+50%/级', key: 'dungeonHealth', perLevel: 0.5 },
    { id: 'inherit_crit', name: '必杀传承', desc: '修仙副本暴击率+2%/级', key: 'dungeonCritRate', perLevel: 0.02 },
    { id: 'inherit_critDmg', name: '爆裂传承', desc: '修仙副本爆伤+20%/级', key: 'dungeonCritDamage', perLevel: 0.2 },
    { id: 'inherit_mission', name: '勤修传承', desc: '宗门任务奖励+5%/级', key: 'missionReward', perLevel: 0.05 }
];
function getSectLibraryUpgradeCost(inheritId) {
    const levels = player.sect.libraryLevels || {};
    const lv = levels[inheritId] || 0;
    return Math.floor(SECT_LIBRARY_BASE_COST * (lv + 1));
}
function updateSectLibraryUI() {
    const container = document.getElementById('libraryList');
    const bonusEl = document.getElementById('libraryActiveBonus');
    if (!player.sect.created) return;
    const levels = player.sect.libraryLevels || {};
    const bonus = getSectLibraryBonus();
    const parts = [];
    if (bonus.dungeonAttack) parts.push('攻击+' + (bonus.dungeonAttack * 100).toFixed(0) + '%');
    if (bonus.dungeonHealth) parts.push('生命+' + (bonus.dungeonHealth * 100).toFixed(0) + '%');
    if (bonus.dungeonCritRate) parts.push('暴击+' + (bonus.dungeonCritRate * 100).toFixed(0) + '%');
    if (bonus.dungeonCritDamage) parts.push('爆伤+' + (bonus.dungeonCritDamage * 100).toFixed(0) + '%');
    if (bonus.missionReward) parts.push('任务+' + (bonus.missionReward * 100).toFixed(0) + '%');
    if (bonusEl) bonusEl.innerHTML = parts.length > 0 ? '当前生效: ' + parts.join(' | ') : '暂无传承加成';
    if (!container) return;
    const fmt = (n) => (n >= 1e6 ? (n/1e6).toFixed(1) + 'M' : n.toLocaleString());
    container.innerHTML = sectLibraryItems.map(item => {
        const lv = levels[item.id] || 0;
        const cost = getSectLibraryUpgradeCost(item.id);
        const canUpgrade = lv < SECT_LIBRARY_MAX_LEVEL && player.sect.spiritStones >= cost;
        return `
            <div style="background: #444; padding: 12px; border-radius: 5px; ${lv > 0 ? 'border: 2px solid #4CAF50;' : ''}">
                <h4 style="margin: 0 0 8px 0; color: #8B4513;">${item.name} Lv.${lv}/${SECT_LIBRARY_MAX_LEVEL}</h4>
                <p style="margin: 0 0 8px 0; font-size: 0.9em;">${item.desc}</p>
                ${lv < SECT_LIBRARY_MAX_LEVEL ? `
                <div style="font-size: 0.85em; margin-bottom: 8px;">升级消耗: ${fmt(cost)} 灵石</div>
                <button onclick="upgradeSectLibrary('${item.id}')" ${!canUpgrade ? 'disabled' : ''} style="background: #2196F3; color: white; border: none; padding: 6px 12px; border-radius: 3px; cursor: pointer; width: 100%; font-size: 13px; ${!canUpgrade ? 'opacity:0.6;cursor:not-allowed;' : ''}">升级</button>
                ` : '<div style="color: #4CAF50;">已满级</div>'}
            </div>
        `;
    }).join('');
}
function upgradeSectLibrary(inheritId) {
    if (!player.sect.created) { logAction("请先创建宗门！", "error"); return; }
    const item = sectLibraryItems.find(i => i.id === inheritId);
    if (!item) return;
    const levels = player.sect.libraryLevels || {};
    const lv = levels[inheritId] || 0;
    if (lv >= SECT_LIBRARY_MAX_LEVEL) { logAction(`${item.name}已满级！`, "info"); return; }
    const cost = getSectLibraryUpgradeCost(inheritId);
    if (player.sect.spiritStones < cost) { logAction(`宗门灵石不足！需要 ${cost.toLocaleString()}`, "error"); return; }
    player.sect.spiritStones -= cost;
    if (!player.sect.libraryLevels) player.sect.libraryLevels = {};
    player.sect.libraryLevels[inheritId] = lv + 1;
    logAction(`${item.name} 升级至 Lv.${player.sect.libraryLevels[inheritId]}！`, "success");
    updatePlayerBattleStats();
    updateSectUI();
}
function getSectLibraryBonus() {
    if (!player || !player.sect || !player.sect.created) return {};
    const levels = player.sect.libraryLevels || {};
    const bonus = { dungeonAttack: 0, dungeonHealth: 0, dungeonCritRate: 0, dungeonCritDamage: 0, missionReward: 0 };
    sectLibraryItems.forEach(item => {
        const lv = levels[item.id] || 0;
        if (lv > 0 && bonus[item.key] !== undefined) bonus[item.key] += lv * item.perLevel;
    });
    return bonus;
}

// ========== 声望商店 ==========
const sectShopItems = [
    { id: 'shop_rootDetector', name: '灵根检测器', desc: '用于开启灵根宝箱', cost: 3000, item: 'rootDetector', amount: 1 },
    { id: 'shop_bloodlineDetector', name: '血脉检测剂', desc: '用于开启血脉宝箱', cost: 3000, item: 'bloodlineDetector', amount: 1 },
    { id: 'shop_roseq', name: '香囊', desc: '赠送宗门成员增加忠诚度', cost: 800, item: 'roseq', amount: 1 },
    { id: 'shop_fubeng1', name: '深渊令牌', desc: '用于挑战无限深渊', cost: 2000, item: 'fubeng1', amount: 1 },
    { id: 'shop_fuben1', name: '副本令牌', desc: '用于挑战副本', cost: 5000, item: 'fuben1', amount: 1 },
    { id: 'shop_fuben2', name: '秘境钥匙', desc: '用于开启秘境', cost: 5000, item: 'fuben2', amount: 1 },
    { id: 'shop_zhiye1', name: '职业转换书', desc: '用于更换职业', cost: 10000, item: 'zhiye1', amount: 1 },
    { id: 'shop_seed_herb1', name: '蕴灵草药种子', desc: '洞府灵田种植，10分钟收获蕴灵筑基丹1-100个', cost: 100, item: 'seed_herb1', amount: 1 },
    { id: 'shop_seed_herb2', name: '凝元草药种子', desc: '洞府灵田种植，30分钟收获凝元固窍丹1-70个', cost: 600, item: 'seed_herb2', amount: 1 },
    { id: 'shop_seed_herb3', name: '渡厄草药种子', desc: '洞府灵田种植，60分钟收获渡厄金还丹1-50个', cost: 3600, item: 'seed_herb3', amount: 1 },
    { id: 'shop_seed_herb4', name: '九转草药种子', desc: '洞府灵田种植，300分钟收获九转轮回丹1-40个', cost: 22000, item: 'seed_herb4', amount: 1 },
    { id: 'shop_seed_herb5', name: '混元草药种子', desc: '洞府灵田种植，1200分钟收获混元道果丹1-25个', cost: 132000, item: 'seed_herb5', amount: 1 }
];
function updateSectShopUI() {
    const container = document.getElementById('sectShopList');
    const expEl = document.getElementById('shopSectExp');
    if (!container || !player.sect.created) return;
    if (expEl) expEl.textContent = Math.floor(player.sect.exp).toLocaleString();
    container.innerHTML = sectShopItems.map(item => `
        <div style="background: #444; padding: 12px; border-radius: 5px;">
            <h4 style="margin: 0 0 8px 0; color: #8B4513;">${item.name}</h4>
            <p style="margin: 0 0 10px 0; font-size: 0.9em;">${item.desc}</p>
            <div style="margin-bottom: 8px;">消耗: ${item.cost} 声望</div>
            <button onclick="buySectShopItem('${item.id}')" style="background: #FF9800; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; width: 100%;">兑换</button>
        </div>
    `).join('');
}
function buySectShopItem(itemId) {
    if (!player.sect.created) { logAction("请先创建宗门！", "error"); return; }
    const item = sectShopItems.find(i => i.id === itemId);
    if (!item) return;
    if (player.sect.exp < item.cost) { logAction(`声望不足！需要${item.cost}`, "error"); return; }
    player.sect.exp -= item.cost;
    if (item.item) { player.items[item.item] = (player.items[item.item] || 0) + (item.amount || 1); }
    if (item.gives === 'sectStones') player.sect.spiritStones += item.amount || 0;
    logAction(`兑换成功：${item.name}`, "success");
    updateSectUI(); updateDisplay();
}

// ========== 洞府系统 ==========
const grottoHerbConfig = {
    herb1: { name: '蕴灵草药', seedKey: 'seed_herb1', growMin: 10, itemKey: 'danyao1', minReward: 1, maxReward: 100, color: '#4CAF50' },
    herb2: { name: '凝元草药', seedKey: 'seed_herb2', growMin: 30, itemKey: 'danyao2', minReward: 1, maxReward: 70, color: '#2196F3' },
    herb3: { name: '渡厄草药', seedKey: 'seed_herb3', growMin: 60, itemKey: 'danyao3', minReward: 1, maxReward: 50, color: '#FF5722' },
    herb4: { name: '九转草药', seedKey: 'seed_herb4', growMin: 300, itemKey: 'danyao4', minReward: 1, maxReward: 40, color: '#9C27B0' },
    herb5: { name: '混元草药', seedKey: 'seed_herb5', growMin: 1200, itemKey: 'danyao5', minReward: 1, maxReward: 25, color: '#E91E63' }
};
function getGrottoMaxFields() {
    if (!player.sect || !player.sect.grotto) return 3;
    const lv = player.sect.grotto.spiritArrayLevel || 0;
    return 3 + Math.floor(lv / 5);
}
function getGrottoCultivationExpBonus() {
    if (!player.sect || !player.sect.created || !player.sect.grotto) return 1;
    const lv = player.sect.grotto.spiritArrayLevel || 0;
    return 1 + lv * 0.1;
}
function ensureGrottoData() {
    if (!player.sect || !player.sect.created) return;
    if (!player.sect.grotto) player.sect.grotto = { spiritArrayLevel: 0, spiritFields: [] };
    const max = getGrottoMaxFields();
    while ((player.sect.grotto.spiritFields || []).length < max) {
        if (!player.sect.grotto.spiritFields) player.sect.grotto.spiritFields = [];
        player.sect.grotto.spiritFields.push(null);
    }
}
function upgradeGrottoSpiritArray() {
    if (!player.sect.created) { logAction("请先创建宗门！", "error"); return; }
    ensureGrottoData();
    const grotto = player.sect.grotto;
    const nextLv = grotto.spiritArrayLevel + 1;
    if (nextLv > 100) { logAction("聚灵阵已达最高等级！", "error"); return; }
    const cost = nextLv * 1000000;
    if (player.sect.spiritStones < cost) { logAction(`灵石不足！需要${cost.toLocaleString()}`, "error"); return; }
    player.sect.spiritStones -= cost;
    grotto.spiritArrayLevel = nextLv;
    const newMax = getGrottoMaxFields();
    while (grotto.spiritFields.length < newMax) grotto.spiritFields.push(null);
    logAction(`聚灵阵升级至${nextLv}级！修仙经验+10%`, "success");
    updateSectUI();
    if (typeof saveGame === 'function') saveGame();
}
function plantGrottoHerb(fieldIndex, herbType) {
    if (!player.sect.created) { logAction("请先创建宗门！", "error"); return; }
    ensureGrottoData();
    const cfg = grottoHerbConfig[herbType];
    if (!cfg) return;
    const seedCount = player.items[cfg.seedKey] || 0;
    if (seedCount < 1) { logAction(`${cfg.name}种子不足！`, "error"); return; }
    const fields = player.sect.grotto.spiritFields;
    if (fieldIndex >= fields.length || fields[fieldIndex]) { logAction("该位置不可种植！", "error"); return; }
    player.items[cfg.seedKey]--;
    fields[fieldIndex] = { type: herbType, plantedAt: Date.now(), growMin: cfg.growMin };
    logAction(`种植${cfg.name}成功！${cfg.growMin}分钟后可收获`, "success");
    updateSectUI();
    if (typeof saveGame === 'function') saveGame();
}
function harvestGrottoHerb(fieldIndex) {
    if (!player.sect.created) { logAction("请先创建宗门！", "error"); return; }
    ensureGrottoData();
    const plant = player.sect.grotto.spiritFields[fieldIndex];
    if (!plant) { logAction("该位置为空！", "error"); return; }
    const cfg = grottoHerbConfig[plant.type];
    if (!cfg) return;
    const elapsedMin = (Date.now() - plant.plantedAt) / 60000;
    if (elapsedMin < plant.growMin) {
        const remain = Math.ceil(plant.growMin - elapsedMin);
        logAction(`尚未成熟！还需${remain}分钟`, "error");
        return;
    }
    const amount = cfg.minReward + Math.floor(Math.random() * (cfg.maxReward - cfg.minReward + 1));
    player.items[cfg.itemKey] = (player.items[cfg.itemKey] || 0) + amount;
    player.sect.grotto.spiritFields[fieldIndex] = null;
    logAction(`收获${cfg.name}，获得${getItemName(cfg.name)}×${amount}！`, "success");
    updateSectUI();
    updateDisplay();
    if (typeof saveGame === 'function') saveGame();
}
function updateSectGrottoUI() {
    const levEl = document.getElementById('grottoSpiritArrayLevel');
    const bonusEl = document.getElementById('grottoExpBonus');
    const costEl = document.getElementById('grottoUpgradeCost');
    const btnEl = document.getElementById('grottoUpgradeBtn');
    const maxEl = document.getElementById('grottoMaxFields');
    const fieldsEl = document.getElementById('grottoSpiritFields');
    const fieldCountEl = document.getElementById('grottoFieldCount');
    if (!player.sect.created || !levEl) return;
    ensureGrottoData();
    const grotto = player.sect.grotto;
    const lv = grotto.spiritArrayLevel || 0;
    const maxFields = getGrottoMaxFields();
    const nextCost = (lv < 100) ? (lv + 1) * 1000000 : 0;
    const canUpgrade = player.sect.spiritStones >= nextCost && lv < 100;
    levEl.textContent = lv;
    bonusEl.textContent = (lv * 10) + '%';
    costEl.textContent = nextCost > 0 ? (nextCost / 10000) + '万' : '已满级';
    if (btnEl) { btnEl.disabled = !canUpgrade; btnEl.textContent = lv >= 100 ? '已满级' : '升级聚灵阵'; }
    if (maxEl) maxEl.textContent = maxFields;
    const usedCount = (grotto.spiritFields || []).filter(Boolean).length;
    if (fieldCountEl) fieldCountEl.textContent = usedCount;
    if (fieldsEl) {
        fieldsEl.style.gridTemplateColumns = 'repeat(' + Math.min(5, maxFields) + ', 1fr)';
        fieldsEl.innerHTML = '';
        for (let i = 0; i < maxFields; i++) {
            const plant = grotto.spiritFields[i];
            const div = document.createElement('div');
            div.style.background = '#444';
            div.style.padding = '12px';
            div.style.borderRadius = '8px';
            div.style.border = '1px solid #555';
            if (!plant) {
                let seedOptions = '';
                for (const [k, cfg] of Object.entries(grottoHerbConfig)) {
                    const cnt = player.items[cfg.seedKey] || 0;
                    if (cnt > 0) seedOptions += `<button onclick="plantGrottoHerb(${i},'${k}')" style="background:${cfg.color};color:#fff;border:none;padding:4px 8px;border-radius:4px;margin:2px;cursor:pointer;font-size:12px;">${cfg.name}(${cnt})</button>`;
                }
                div.innerHTML = `<div style="font-size:12px;color:#999;">灵田 ${i+1}</div><div style="margin-top:8px;">${seedOptions || '<span style="color:#666;">无种子</span>'}</div>`;
            } else {
                const cfg = grottoHerbConfig[plant.type];
                const elapsed = (Date.now() - plant.plantedAt) / 60000;
                const ready = elapsed >= plant.growMin;
                const remain = ready ? 0 : Math.ceil(plant.growMin - elapsed);
                div.innerHTML = `<div style="color:${cfg ? cfg.color : '#fff'};">${cfg ? cfg.name : plant.type}</div>` +
                    (ready ? `<button onclick="harvestGrottoHerb(${i})" style="background:#FF9800;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;margin-top:8px;">收获</button>` : `<div style="font-size:11px;color:#aaa;">成熟还需${remain}分钟</div>`);
            }
            fieldsEl.appendChild(div);
        }
    }
}

// ========== 长老任命 ==========
function toggleElder(memberId) {
    if (!player.sect.created) return;
    if (!player.sect.elders) player.sect.elders = [];
    const idx = player.sect.elders.indexOf(memberId);
    const member = player.sect.members.find(m => m.id === memberId);
    if (!member || member.id === 'leader') return;
    const maxElders = Math.min(3, Math.floor((player.sect.members.length - 1) / 2));
    if (idx >= 0) {
        player.sect.elders.splice(idx, 1);
        logAction(`已罢免 ${member.name} 的长老之位`, "info");
    } else {
        if (player.sect.elders.length >= maxElders) { logAction(`长老席位已满（最多${maxElders}位）`, "error"); return; }
        if (!['S','SS','SSS'].includes(member.aptitude)) { logAction("仅S及以上资质可任命长老", "error"); return; }
        player.sect.elders.push(memberId);
        logAction(`任命 ${member.name} 为长老！`, "success");
    }
    updateSectUI();
}
function getSectElderBonus() {
    if (!player.sect || !player.sect.created || !player.sect.elders) return { taskReward: 0, recruitCost: 0 };
    const count = player.sect.elders.length;
    return { taskReward: count * 0.05, recruitCost: -count * 0.05 };
}

// ========== 传功殿：弟子传功给掌门修仙经验 ==========
const SECT_TRANSMIT_COST = 5000;
const SECT_TRANSMIT_COOLDOWN = 6 * 60 * 60 * 1000; // 6小时
const APTITUDE_TRANSMIT_EXP = { 'C': 10000, 'B': 50000, 'A': 100000, 'S': 500000, 'SS': 1000000, 'SSS': 10000000 };
function getTransmitExp(member) {
    return APTITUDE_TRANSMIT_EXP[member.aptitude] || 10000;
}
function transmitToLeader(memberId) {
    if (!player.sect.created) { logAction("请先创建宗门！", "error"); return; }
    if (!player.cultivation) { logAction("请先开启修仙系统！", "error"); return; }
    const member = player.sect.members.find(m => m.id === memberId);
    if (!member || member.id === 'leader') { logAction("掌门不能给自己传功！", "error"); return; }
    if (member.status !== 'idle') { logAction("该弟子正在执行任务！", "error"); return; }
    if (player.sect.spiritStones < SECT_TRANSMIT_COST) { logAction(`宗门灵石不足！需要${SECT_TRANSMIT_COST}`, "error"); return; }
    const lastTime = (player.sect.transmitLastTime || {})[memberId] || 0;
    if (Date.now() - lastTime < SECT_TRANSMIT_COOLDOWN) {
        const remain = Math.ceil((SECT_TRANSMIT_COOLDOWN - (Date.now() - lastTime)) / 60000);
        logAction(`${member.name}传功冷却中，还需${remain}分钟`, "warning");
        return;
    }
    player.sect.spiritStones -= SECT_TRANSMIT_COST;
    if (!player.sect.transmitLastTime) player.sect.transmitLastTime = {};
    player.sect.transmitLastTime[memberId] = Date.now();
    const expGain = getTransmitExp(member);
    const grottoBonus = typeof getGrottoCultivationExpBonus === 'function' ? getGrottoCultivationExpBonus() : 1;
    const finalExp = Math.floor(expGain * grottoBonus);
    player.cultivation.exp += finalExp;
    logAction(`${member.name}(${member.aptitude})传功成功！掌门获得${finalExp}修仙经验`, "success");
    updateSectUI();
    if (typeof updateCultivationUI === 'function') updateCultivationUI();
}
function updateSectTransmitUI() {
    const stonesEl = document.getElementById('transmitSectStones');
    const expEl = document.getElementById('transmitCultivationExp');
    const listEl = document.getElementById('transmitMemberList');
    if (!player.sect.created || !listEl) return;
    if (stonesEl) stonesEl.textContent = Math.floor(player.sect.spiritStones).toLocaleString();
    if (expEl) expEl.textContent = (player.cultivation ? Math.floor(player.cultivation.exp).toLocaleString() : '0');
    const idleMembers = player.sect.members.filter(m => m.id !== 'leader' && m.status === 'idle');
    const lastMap = player.sect.transmitLastTime || {};
    listEl.innerHTML = idleMembers.length === 0 ? '<div style="grid-column:1/-1;color:#999;">暂无空闲弟子可传功</div>' : idleMembers.map(m => {
        const cd = lastMap[m.id] || 0;
        const canTransmit = Date.now() - cd >= SECT_TRANSMIT_COOLDOWN && player.sect.spiritStones >= SECT_TRANSMIT_COST;
        const exp = getTransmitExp(m);
        const remainMin = cd > 0 ? Math.ceil((SECT_TRANSMIT_COOLDOWN - (Date.now() - cd)) / 60000) : 0;
        return `<div style="background:#444;padding:12px;border-radius:8px;">
            <div style="font-weight:bold;color:#8B4513;">${m.name} (${m.aptitude})</div>
            <div style="font-size:0.9em;">传功消耗: ${SECT_TRANSMIT_COST} 灵石 | 可获得: ${exp} 修仙经验</div>
            <div style="font-size:0.85em;color:#999;">${remainMin > 0 ? '冷却: ' + remainMin + '分钟' : '可传功'}</div>
            <button onclick="transmitToLeader('${m.id}')" ${!canTransmit ? 'disabled' : ''} style="background:#4CAF50;color:white;border:none;padding:6px 12px;border-radius:5px;cursor:pointer;margin-top:8px;width:100%;${!canTransmit?'opacity:0.6;':''}">传功</button>
        </div>`;
    }).join('');
}

// ========== 灵泉池：消耗灵石浸泡获得修仙经验 ==========
const SECT_SPIRIT_POOL_COST = 500000;
const SECT_SPIRIT_POOL_COOLDOWN = 12 * 60 * 60 * 1000; // 12小时
function getSpiritPoolReward() {
    // 当前等级升级所需经验的10%
    if (!player.cultivation || !cultivationStages) return 0;
    const nextStage = cultivationStages[player.cultivation.stage + 1];
    if (!nextStage) return 0; // 已达最高境界
    const maxExp = nextStage.expRequired;
    return Math.floor(maxExp * 0.1);
}
function useSpiritPool() {
    if (!player.sect.created) { logAction("请先创建宗门！", "error"); return; }
    if (!player.cultivation) { logAction("请先开启修仙系统！", "error"); return; }
    const reward = getSpiritPoolReward();
    if (reward <= 0) { logAction("已达最高境界，灵泉池无法再提供经验！", "warning"); return; }
    if (player.sect.spiritStones < SECT_SPIRIT_POOL_COST) { logAction(`宗门灵石不足！需要${(SECT_SPIRIT_POOL_COST/10000)}万`, "error"); return; }
    const lastTime = player.sect.spiritPoolLastTime || 0;
    if (Date.now() - lastTime < SECT_SPIRIT_POOL_COOLDOWN) {
        logAction("灵泉池浸泡冷却中，请稍后再试", "warning");
        return;
    }
    player.sect.spiritStones -= SECT_SPIRIT_POOL_COST;
    player.sect.spiritPoolLastTime = Date.now();
    const expGain = getSpiritPoolReward();
    player.cultivation.exp += expGain;
    logAction(`灵泉池浸泡成功！获得${expGain}修仙经验`, "success");
    updateSectUI();
    if (typeof updateCultivationUI === 'function') updateCultivationUI();
}
function updateSectSpiritpoolUI() {
    const costEl = document.getElementById('spiritPoolCost');
    const rewardEl = document.getElementById('spiritPoolReward');
    const nextEl = document.getElementById('spiritPoolNext');
    const btnEl = document.getElementById('spiritPoolBtn');
    if (!player.sect.created || !costEl) return;
    const lastTime = player.sect.spiritPoolLastTime || 0;
    const reward = getSpiritPoolReward();
    const canUse = reward > 0 && Date.now() - lastTime >= SECT_SPIRIT_POOL_COOLDOWN && player.sect.spiritStones >= SECT_SPIRIT_POOL_COST;
    costEl.textContent = (SECT_SPIRIT_POOL_COST / 10000) + '万';
    rewardEl.textContent = reward > 0 ? reward.toLocaleString() : '已达最高境界';
    if (nextEl) nextEl.textContent = lastTime > 0 ? formatTimes(Math.max(0, SECT_SPIRIT_POOL_COOLDOWN - (Date.now() - lastTime))) : '--';
    if (btnEl) { btnEl.disabled = !canUse || !player.cultivation; btnEl.textContent = reward > 0 ? (canUse ? '浸泡灵泉' : '冷却中') : '已达最高境界'; }
}

// ========== 悟道台：挂机悟道获得修仙经验 ==========
const SECT_ENLIGHTENMENT_COST = 200000;
const SECT_ENLIGHTENMENT_DURATION = 2 * 60 * 60 * 1000; // 2小时
function getCultivationExpPerMinute() {
    if (!player.cultivation || !player.cultivation.root || !player.cultivation.bloodline) return 0;
    const rootBonus = player.cultivation.root.bonus;
    const bloodlineBonus = player.cultivation.bloodline.bonus;
    let toolBonus = 1;
    if (player.magicTools && player.magicTools.equipped) {
        const tool = magicToolConfig.tools.find(t => t.id === player.magicTools.equipped);
        if (tool) toolBonus = tool.bonus;
    }
    let collectionBonus = 1;
    if (player.magicTools && player.magicTools.inventory) {
        collectionBonus = 1 + (player.magicTools.inventory.length * 0.01);
    }
    const classBonuses = typeof calculateClassBonuses === 'function' ? calculateClassBonuses() : {};
    let cultivationExpMultiplier = classBonuses.cultivationExpMultiplier || 1;
    if (typeof window.isGoldGameFamilyBuffActive === 'function' && window.isGoldGameFamilyBuffActive('cultivation')) {
        cultivationExpMultiplier *= 6; // 修仙药水：修仙经验500%加成（×6）
    }
    const grottoBonus = typeof getGrottoCultivationExpBonus === 'function' ? getGrottoCultivationExpBonus() : 1;
    const lawCultivationMul = 1 + (((typeof getLawPowerBonuses === 'function' ? getLawPowerBonuses().cultivationExp : 0) || 0));
    const miningCultivationCount = Number(player.mining && player.mining.gems ? player.mining.gems.cultivationGem : 0) || 0;
    const miningCultivationMul = getMiningDiminishingExpGemMultiplier(miningCultivationCount);
    return (rootBonus * bloodlineBonus * toolBonus * collectionBonus * cultivationExpMultiplier * grottoBonus * lawCultivationMul * miningCultivationMul) * (player.reincarnationCount || 0);
}
function getEnlightenmentExpPerSecond() {
    // 每秒经验 = (当前每分钟经验 / 60) × 2 = 正常每秒经验的2倍
    const expPerMinute = getCultivationExpPerMinute();
    return (expPerMinute / 60) * 2;
}
function startEnlightenment() {
    if (!player.sect.created) { logAction("请先创建宗门！", "error"); return; }
    if (!player.cultivation) { logAction("请先开启修仙系统！", "error"); return; }
    if (player.sect.enlightenmentStart > 0) { logAction("已在悟道中！", "warning"); return; }
    if (player.sect.spiritStones < SECT_ENLIGHTENMENT_COST) { logAction(`宗门灵石不足！需要${(SECT_ENLIGHTENMENT_COST/10000)}万`, "error"); return; }
    player.sect.spiritStones -= SECT_ENLIGHTENMENT_COST;
    player.sect.enlightenmentStart = Date.now();
    logAction("开始悟道！2小时内持续获得修仙经验", "success");
    updateSectUI();
}
function processEnlightenmentTick() {
    if (!player.sect || !player.sect.created || !player.cultivation) return;
    const start = player.sect.enlightenmentStart || 0;
    if (start <= 0) return;
    const elapsed = Date.now() - start;
    if (elapsed >= SECT_ENLIGHTENMENT_DURATION) {
        player.sect.enlightenmentStart = 0;
        logAction("悟道结束", "info");
        return;
    }
    const expPerSec = getEnlightenmentExpPerSecond();
    player.cultivation.exp += expPerSec; // 每秒增加（由 gainCultivationExp 每秒调用）
}
function updateSectEnlightenmentUI() {
    const statusEl = document.getElementById('enlightenmentStatus');
    const costEl = document.getElementById('enlightenmentCost');
    const btnEl = document.getElementById('enlightenmentBtn');
    if (!player.sect.created || !statusEl) return;
    const start = player.sect.enlightenmentStart || 0;
    const isActive = start > 0;
    const elapsed = isActive ? Date.now() - start : 0;
    const remain = Math.max(0, SECT_ENLIGHTENMENT_DURATION - elapsed);
    const canStart = !isActive && player.sect.spiritStones >= SECT_ENLIGHTENMENT_COST;
    costEl.textContent = (SECT_ENLIGHTENMENT_COST / 10000) + '万';
    if (isActive) {
        statusEl.innerHTML = `<span style="color:#4CAF50;">悟道中...</span> 剩余: ${formatTimes(remain)} | 每秒+${getEnlightenmentExpPerSecond().toFixed(1)} 修仙经验`;
    } else {
        statusEl.innerHTML = '未悟道';
    }
    if (btnEl) { btnEl.disabled = !canStart || !player.cultivation; btnEl.textContent = isActive ? '悟道中' : '开始悟道'; }
}

// 宗门任务完成检查已由上方 setInterval（isCheckingMissions 防护）统一处理，此处删除重复定时器避免双倍执行与资源浪费
// 夜店系统数据结构
const nightClubConfig = {
    staffTypes: [
        { id: 'waiter', name: '服务员', baseExp: 0.5, baseCoins: 0.2, expPerLevel: 0.1, coinsPerLevel: 0.05, baseCost: 10 },
        { id: 'guard', name: '保安', baseExp: 0.3, baseCoins: 0.1, expPerLevel: 0.05, coinsPerLevel: 0.03, baseCost: 8 },
        { id: 'dj', name: 'DJ师', baseExp: 1.0, baseCoins: 0.5, expPerLevel: 0.2, coinsPerLevel: 0.1, baseCost: 20 },
        { id: 'chef', name: '厨师', baseExp: 0.4, baseCoins: 0.3, expPerLevel: 0.08, coinsPerLevel: 0.07, baseCost: 15 },
        { id: 'hostess', name: '小妹', baseExp: 0.7, baseCoins: 0.4, expPerLevel: 0.15, coinsPerLevel: 0.08, baseCost: 18 }
    ],
    equipmentTypes: [
        { id: 'sound', name: '音响系统', baseBonus: 1.05, bonusPerLevel: 0.05, baseCost: 50 },
        { id: 'light', name: '灯光系统', baseBonus: 1.03, bonusPerLevel: 0.03, baseCost: 40 },
        { id: 'bar', name: '吧台', baseBonus: 1.02, bonusPerLevel: 0.02, baseCost: 30 },
        { id: 'dancefloor', name: '舞池', baseBonus: 1.04, bonusPerLevel: 0.04, baseCost: 45 }
    ],
    vipConfig: {
        baseInterval: 30, // 分钟
        baseExp: 50,
        baseCoins: 25,
        levelMultiplier: 1.1
    },
    events: [
        { 
            name: "周末狂欢夜", 
            description: "激情音乐、炫酷灯光，打造周末不眠之夜！吸引大量年轻顾客涌入，现场气氛火爆。收益：经验获取速度3倍！", 
            effect: { expMultiplier: 3.0, duration: 60 },
            cost: 100 
        },
        { 
            name: "啤酒狂欢节", 
            description: "精选全球特色啤酒买一送一，搭配德式香肠拼盘，带来纯正欧陆风情体验。收益：金币收益提升50%！", 
            effect: { coinsMultiplier: 1.5, duration: 45 },
            cost: 75 
        },
     { 
            name: "闫闫魅惑之夜", 
            description: "国际超模闫闫领衔内衣大秀，水晶舞台搭配梦幻泡泡机，打造视觉盛宴。收益：金币收益暴涨400%！", 
            effect: { coinsMultiplier: 5.0, duration: 30 },
            cost: 100 
        },
      { 
            name: "茶茶烈焰舞台", 
            description: "亚洲舞后茶茶带来全新编舞，钢管舞与灯光艺术完美融合，限定特调鸡尾酒同步上市。收益：金币收益提升150%！", 
            effect: { coinsMultiplier: 2.5, duration: 30 },
            cost: 50 
        },
    { 
            name: "午夜折扣狂欢", 
            description: "零点后所有酒水买二送一，深夜食堂特色小食买一送一，打造深夜聚会圣地。收益：金币收益提升80%！", 
            effect: { coinsMultiplier: 1.8, duration: 40 },
            cost: 70 
        },
    { 
            name: "电音风暴派对", 
            description: "国际知名DJ现场打碟，激光矩阵与干冰特效，配备专业舞池震动装置。收益：经验获取7.5倍！", 
            effect: { expMultiplier: 7.5, duration: 30 },
            cost: 100 
        },
   { 
            name: "威士忌品鉴会", 
            description: "精选单一麦芽威士忌五折畅饮，配雪茄套餐，专业品酒师现场讲解。收益：金币收益提升120%！", 
            effect: { coinsMultiplier: 2.2, duration: 35 },
            cost: 50 
        },
      { 
            name: "泳池派对季", 
            description: "屋顶泳池派对限时开放，比基尼时装秀、水上飞人表演，特调热带鸡尾酒无限供应。收益：金币收益提升200%！", 
            effect: { coinsMultiplier: 3.0, duration: 40 },
            cost: 100 
        },
      { 
            name: "精英商务酒会", 
            description: "高端雪茄吧限时开放，陈年干邑买一送一，配备私人管家服务。收益：金币收益提升180%！", 
            effect: { coinsMultiplier: 2.8, duration: 35 },
            cost: 50 
        },
      { 
            name: "校园青春派对", 
            description: "学生证专属优惠，廉价啤酒畅饮套餐，街机游戏区免费开放。收益：经验获取3.2倍！", 
            effect: { expMultiplier: 3.2, duration: 55 },
            cost: 50 
        },
     { 
            name: "极光梦幻之夜", 
            description: "全息极光投影覆盖整个场馆，搭配空灵电子音乐，打造迷幻视觉盛宴。收益：经验获取7.2倍+金币收益2.8倍！", 
            effect: { expMultiplier: 7.2, coinsMultiplier: 2.8, duration: 35 },
            cost: 150 
        },
     { 
            name: "拳王争霸观赛", 
            description: "大型投影直播拳击赛事，拳击台造型卡座，能量饮料无限供应。收益：经验获取3.3倍！", 
            effect: { expMultiplier: 3.3, duration: 45 },
            cost: 60 
        },
     { 
            name: "黑色礼服之夜", 
            description: "正式着装限定派对， 茶茶在喷泉里洗澡，交响乐团现场演奏。收益：金币收益提升220%！", 
            effect: { coinsMultiplier: 3.2, duration: 40 },
            cost: 100 
        },
     { 
            name: "热带雨林探险", 
            description: "真实植物墙与人工瀑布，丛林动物音效，特色热带鸡尾酒。收益：经验获取5.7倍+金币收益1.9倍！", 
            effect: { expMultiplier: 5.7, coinsMultiplier: 1.9, duration: 55 },
            cost: 100 
        },
      { 
            name: "魔术大师秀", 
            description: "国际魔术冠军近距离表演，神秘道具展示，魔术主题特饮。收益：金币收益提升190%！", 
            effect: { coinsMultiplier: 2.9, duration: 35 },
            cost: 100 
        },
      { 
            name: "啤酒花园节", 
            description: "露天花园派对，30种精酿啤酒品尝，德式烤肠与pretzel。收益：经验获取5.0倍！", 
            effect: { expMultiplier: 5.0, duration: 60 },
            cost: 50 
        },
      { 
            name: "1920黄金时代", 
            description: "盖茨比风格派对，女郎表演，古董车展示。收益：金币收益提升240%！", 
            effect: { coinsMultiplier: 3.4, duration: 30 },
            cost: 60 
        },
       { 
            name: "高空露台电影", 
            description: "屋顶露天电影院，经典电影放映，懒人沙发与毛毯服务。收益：经验获取2.5倍！", 
            effect: { expMultiplier: 2.5, duration: 60 },
            cost: 40 
        },
       { 
            name: "龙舌兰日出", 
            description: "墨西哥主题派对，龙舌兰shot免费续杯，墨西哥卷饼自助。收益：金币收益提升170%！", 
            effect: { coinsMultiplier: 2.7, duration: 45 },
            cost: 100 
        },
      { 
            name: "科幻赛博朋克夜", 
            description: "赛博朋克未来风装饰，VR游戏体验，发光鸡尾酒。收益：经验获取6.8倍+金币收益2.5倍！", 
            effect: { expMultiplier: 6.8, coinsMultiplier: 2.5, duration: 40 },
            cost: 150 
        },
      { 
            name: "葡萄酒庄之旅", 
            description: "纳帕谷葡萄酒品尝，奶酪拼盘无限续，品酒师讲座。收益：金币收益提升210%！", 
            effect: { coinsMultiplier: 3.1, duration: 40 },
            cost: 50 
        },
      { 
            name: "卡拉OK冠军赛", 
            description: "专业级KTV设备，歌唱比赛有奖竞猜，气泡酒免费续杯。收益：经验获取3.9倍！", 
            effect: { expMultiplier: 3.9, duration: 60 },
            cost: 60 
        },
      { 
            name: "白色派对庆典", 
            description: "全白着装主题派对，泡沫机与雪花特效，冰雕vodka吧台。收益：金币收益提升190%！", 
            effect: { coinsMultiplier: 2.9, duration: 45 },
            cost: 100 
        },
      { 
            name: "密室逃脱之夜", 
            description: "真人密室游戏联动，线索收集换优惠，神秘特调隐藏菜单。收益：经验获取4.3倍！", 
            effect: { expMultiplier: 4.3, duration: 60 },
            cost: 70 
        },
       { 
            name: "生蚝生鲜吧", 
            description: "空运新鲜生蚝半价，专业开蚝师表演，白葡萄酒搭配。收益：金币收益提升130%！", 
            effect: { coinsMultiplier: 2.3, duration: 30 },
            cost: 60 
        },
      { 
            name: "哈利波特魔法夜", 
            description: "分院帽体验，黄油啤酒特供，魔杖决斗大赛。收益：经验获取6.0倍！", 
            effect: { expMultiplier: 6.0, duration: 30 },
            cost: 200 
        },
        { 
            name: "夏日冲浪派对", 
            description: "人工波浪机体验，比基尼时装秀，热带水果鸡尾酒。收益：金币收益提升180%！", 
            effect: { coinsMultiplier: 2.8, duration: 30 },
            cost: 70 
        },
     { 
            name: "爵士灵魂之夜", 
            description: "蓝调爵士乐队演出，复古唱片点播，经典马提尼。收益：经验获取4.8倍+金币收益2.1倍！", 
            effect: { expMultiplier: 4.8, coinsMultiplier: 2.1, duration: 50 },
            cost: 200 
        },
     { 
            name: "万圣惊魂夜", 
            description: "恐怖主题装饰，化妆比赛，限量血袋鸡尾酒。收益：金币收益提升140%！", 
            effect: { coinsMultiplier: 2.4, duration: 50 },
            cost: 80 
        },
       { 
            name: "威士忌收藏家", 
            description: "稀有威士忌品尝，雪茄套餐买一送一，专家讲解。收益：金币收益提升250%！", 
            effect: { coinsMultiplier: 3.5, duration: 30 },
            cost: 120 
        },
      { 
            name: "电子竞技联赛", 
            description: "大型赛事直播，电竞椅专属区，游戏主题特饮。收益：经验获取4.4倍！", 
            effect: { expMultiplier: 4.4, duration: 50 },
            cost: 150 
        },
     { 
            name: "极限运动嘉年华", 
            description: "室内滑板表演区，攀岩墙挑战，能量饮料赞助与运动明星见面会。收益：经验获取5.9倍+金币收益2.4倍！", 
            effect: { expMultiplier: 5.9, coinsMultiplier: 2.4, duration: 45 },
            cost: 200 
        },
     { 
            name: "白色情人节", 
            description: "浪漫装饰，情侣套餐买一送一，玫瑰花瓣雨。收益：金币收益提升230%！", 
            effect: { coinsMultiplier: 3.3, duration: 30 },
            cost: 70 
        },
       { 
            name: "睡衣派对", 
            description: "舒适睡衣主题，床头鸡尾酒，枕头大战区。收益：经验获取3.3倍！", 
            effect: { expMultiplier: 3.3, duration: 40 },
            cost: 50 
        },
        { 
            name: "黑金会员专属", 
            description: "会员专属通道，稀有威士忌品尝，手工雪茄免费派送。收益：金币收益提升260%！", 
            effect: { coinsMultiplier: 3.6, duration: 30 },
            cost: 100 
        },
       { 
            name: "夏威夷草裙舞", 
            description: "草裙舞表演教学，鲜花项链迎宾，热带水果鸡尾酒。收益：金币收益提升70%！", 
            effect: { coinsMultiplier: 1.7, duration: 30 },
            cost: 60 
        },
        { 
            name: "午夜拉面食堂", 
            description: "日式拉面宵夜，清酒买一送一，午夜限定菜单。收益：金币收益提升110%！", 
            effect: { coinsMultiplier: 2.1, duration: 30 },
            cost: 70 
        },
      { 
            name: "终极单身派对", 
            description: "速配游戏活动，爱情灵药特调，约会基金抽奖。收益：金币收益提升350%！", 
            effect: { coinsMultiplier: 4.5, duration: 30 },
            cost: 100 
        },
       { 
            name: "复古迪斯科之夜", 
            description: "70年代复古装扮派对，disco球与霓虹灯装饰，经典老歌串烧狂欢。收益：经验1.8倍+金币1.6倍！", 
            effect: { expMultiplier: 1.8, coinsMultiplier: 1.6, duration: 45 },
            cost: 150 
        },
        { 
            name: "巨星闪耀夜", 
            description: "特邀顶流明星驻场表演，红毯入场仪式+签名合影环节，钻石香槟塔无限供应。收益：经验获取4倍+金币收益2倍！", 
            effect: { expMultiplier: 4.0, coinsMultiplier: 2.0, duration: 30 },
            cost: 200 
        }
    ],
    levelExpRequirements: [200, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000],
    // 售卖商品：maxStockTotal 为库存上限（普通9999 / 贵重999）；单次补货量 = restockCap + 1；补货需达到 restockUnlockLevel
    shopGoods: [
        { id: 'beer', name: '啤酒', category: 'drink', cost: 8, basePrice: 24, appeal: 0.7, restockCap: 50, maxStockTotal: 9999, restockUnlockLevel: 3 },
        { id: 'snack', name: '小吃拼盘', category: 'snack', cost: 20, basePrice: 48, appeal: 0.65, restockCap: 45, maxStockTotal: 9999, restockUnlockLevel: 4 },
        { id: 'fruitplate', name: '果盘', category: 'snack', cost: 24, basePrice: 56, appeal: 0.6, restockCap: 40, maxStockTotal: 9999, restockUnlockLevel: 5 },
        { id: 'cocktail', name: '鸡尾酒', category: 'drink', cost: 36, basePrice: 84, appeal: 0.5, restockCap: 30, maxStockTotal: 9999, restockUnlockLevel: 6 },
        { id: 'champagne', name: '香槟', category: 'drink', cost: 110, basePrice: 260, appeal: 0.35, restockCap: 15, maxStockTotal: 9999, restockUnlockLevel: 7 },
        { id: 'vipset', name: 'VIP套餐', category: 'vip', cost: 240, basePrice: 560, appeal: 0.25, restockCap: 10, maxStockTotal: 999, restockUnlockLevel: 8 },
        { id: 'caviar', name: '鱼子酱', category: 'vip', cost: 500, basePrice: 1200, appeal: 0.28, restockCap: 8, maxStockTotal: 999, restockUnlockLevel: 9 },
        { id: 'truffle', name: '松露拼盘', category: 'vip', cost: 600, basePrice: 1500, appeal: 0.22, restockCap: 6, maxStockTotal: 999, restockUnlockLevel: 10 },
        { id: 'ace', name: '黑桃A香槟', category: 'vip', cost: 800, basePrice: 2000, appeal: 0.2, restockCap: 5, maxStockTotal: 999, restockUnlockLevel: 11 },
        { id: 'diamond', name: '钻石香槟塔', category: 'vip', cost: 2000, basePrice: 5000, appeal: 0.15, restockCap: 3, maxStockTotal: 999, restockUnlockLevel: 12 }
    ],
    // AI顾客：preferCategory(drink/snack/vip/any), budgetRatio, priceSensitive(0-1越高越嫌贵), maxQtyPerItem(单商品最多买几件), minLevel(夜店等级达到才出现)
    customerTypes: [
        { id: 'passerby', name: '路人', weight: 28, buyDesire: 0.2, preferHigh: 0, preferCategory: 'any', budgetRatio: 0.3, priceSensitive: 0.8, maxQtyPerItem: 1, coinMul: 0.8, expMul: 0.5 },
        { id: 'student', name: '学生党', weight: 22, buyDesire: 0.35, preferHigh: 0, preferCategory: 'drink', budgetRatio: 0.4, priceSensitive: 0.9, maxQtyPerItem: 1, coinMul: 0.7, expMul: 0.6 },
        { id: 'normal', name: '散客', weight: 45, buyDesire: 0.45, preferHigh: 0.2, preferCategory: 'drink', budgetRatio: 0.6, priceSensitive: 0.4, maxQtyPerItem: 1, coinMul: 1, expMul: 1 },
        { id: 'office', name: '上班族', weight: 35, buyDesire: 0.5, preferHigh: 0.25, preferCategory: 'drink', budgetRatio: 0.7, priceSensitive: 0.5, maxQtyPerItem: 2, coinMul: 1.05, expMul: 1 },
        { id: 'foodie', name: '美食家', weight: 18, buyDesire: 0.65, preferHigh: 0.15, preferCategory: 'snack', budgetRatio: 0.9, priceSensitive: 0.3, maxQtyPerItem: 2, coinMul: 1.1, expMul: 1.1 },
        { id: 'drunk', name: '酒鬼', weight: 15, buyDesire: 0.75, preferHigh: 0.1, preferCategory: 'drink', budgetRatio: 0.8, priceSensitive: 0.5, maxQtyPerItem: 3, coinMul: 1, expMul: 1 },
        { id: 'couple', name: '情侣', weight: 20, buyDesire: 0.55, preferHigh: 0.3, preferCategory: 'any', budgetRatio: 0.85, priceSensitive: 0.4, maxQtyPerItem: 2, coinMul: 1.15, expMul: 1.05 },
        { id: 'party', name: '派对团', weight: 12, buyDesire: 0.6, preferHigh: 0.2, preferCategory: 'drink', budgetRatio: 0.95, priceSensitive: 0.35, maxQtyPerItem: 3, coinMul: 1.1, expMul: 1.05 },
        { id: 'influencer', name: '网红', weight: 14, buyDesire: 0.6, preferHigh: 0.7, preferCategory: 'vip', budgetRatio: 1.1, priceSensitive: 0.2, maxQtyPerItem: 2, coinMul: 1.3, expMul: 1.15 },
        { id: 'business', name: '商务人士', weight: 16, buyDesire: 0.65, preferHigh: 0.55, preferCategory: 'vip', budgetRatio: 1.15, priceSensitive: 0.25, maxQtyPerItem: 2, coinMul: 1.35, expMul: 1.1 },
        { id: 'rich', name: '土豪', weight: 12, buyDesire: 0.7, preferHigh: 0.6, preferCategory: 'vip', budgetRatio: 1.2, priceSensitive: 0.1, maxQtyPerItem: 2, coinMul: 1.5, expMul: 1.2 },
        { id: 'collector', name: '收藏家', weight: 6, buyDesire: 0.5, preferHigh: 0.95, preferCategory: 'vip', budgetRatio: 1.5, priceSensitive: 0, maxQtyPerItem: 1, coinMul: 1.8, expMul: 1.3 },
        { id: 'vip', name: 'VIP贵宾', weight: 5, buyDesire: 0.9, preferHigh: 0.8, preferCategory: 'vip', budgetRatio: 2, priceSensitive: 0, maxQtyPerItem: 3, coinMul: 2.5, expMul: 2 },
        { id: 'celebrity', name: '明星', weight: 2, buyDesire: 0.85, preferHigh: 0.9, preferCategory: 'vip', budgetRatio: 2.5, priceSensitive: 0, maxQtyPerItem: 2, coinMul: 3, expMul: 2.2, minLevel: 5 }
    ],
    dailyTasks: [
        { id: 'sell10', name: '售出100件商品', target: 100, reward: { coins: 500, popularity: 15 }, progressKey: 'dailySold' },
        { id: 'vip1', name: '接待10位VIP', target: 10, reward: { coins: 1000, reputation: 10 }, progressKey: 'dailyVipCount' },
        { id: 'earn500', name: '单日星币收益50000', target: 50000, reward: { coins: 800, popularity: 25 }, progressKey: 'dailyEarnedCoins' },
        { id: 'restock3', name: '补货30次', target: 30, reward: { coins: 300, reputation: 8 }, progressKey: 'dailyRestockCount' },
        { id: 'customer15', name: '接待150位顾客', target: 150, reward: { coins: 600, popularity: 20 }, progressKey: 'dailyCustomerCount' }
    ],
    achievements: [
        { id: 'firstSale', name: '首次售出', targetDesc: '售出1件', cond: function(p) { return (p.nightClub.totalSold || 0) >= 1; }, reward: { reputation: 5 } },
        { id: 'sell100', name: '累计售出1千件', targetDesc: '售出1000件', cond: function(p) { return (p.nightClub.totalSold || 0) >= 1000; }, reward: { coins: 2000 } },
        { id: 'sell1w', name: '累计售出1万件', targetDesc: '售出10000件', cond: function(p) { return (p.nightClub.totalSold || 0) >= 10000; }, reward: { coins: 10000, reputation: 20 } },
        { id: 'sell10w', name: '累计售出10万件', targetDesc: '售出100000件', cond: function(p) { return (p.nightClub.totalSold || 0) >= 100000; }, reward: { coins: 50000, popularity: 50 } },
        { id: 'popularity50', name: '人气达到500', targetDesc: '人气500', cond: function(p) { return (p.nightClub.popularity || 0) >= 500; }, reward: { reputation: 30 } },
        { id: 'popularity2k', name: '人气达到2000', targetDesc: '人气2000', cond: function(p) { return (p.nightClub.popularity || 0) >= 2000; }, reward: { coins: 8000, reputation: 40 } },
        { id: 'reputation30', name: '口碑达到300', targetDesc: '口碑300', cond: function(p) { return (p.nightClub.reputation || 0) >= 300; }, reward: { popularity: 50 } },
        { id: 'reputation1k', name: '口碑达到1000', targetDesc: '口碑1000', cond: function(p) { return (p.nightClub.reputation || 0) >= 1000; }, reward: { coins: 15000, popularity: 80 } },
        { id: 'vip10', name: '累计接待VIP 100次', targetDesc: 'VIP 100次', cond: function(p) { return (p.nightClub.totalVipVisits || 0) >= 100; }, reward: { coins: 3000 } },
        { id: 'vip500', name: '累计接待VIP 500次', targetDesc: 'VIP 500次', cond: function(p) { return (p.nightClub.totalVipVisits || 0) >= 500; }, reward: { coins: 20000, reputation: 50 } },
        { id: 'returnGuest5', name: '单日回头客50人', targetDesc: '单日回头客50', cond: function(p) { return (p.nightClub.dailyReturnCount || 0) >= 50; }, reward: { reputation: 25 } },
        { id: 'returnGuest100', name: '单日回头客100人', targetDesc: '单日回头客100', cond: function(p) { return (p.nightClub.dailyReturnCount || 0) >= 100; }, reward: { coins: 10000, popularity: 30 } },
        { id: 'level5', name: '店铺等级5', targetDesc: '店铺Lv.5', cond: function(p) { return (p.nightClub.level || 0) >= 5; }, reward: { coins: 5000 } },
        { id: 'level10', name: '店铺等级10', targetDesc: '店铺Lv.10', cond: function(p) { return (p.nightClub.level || 0) >= 10; }, reward: { coins: 20000, reputation: 40 } }
    ],
    wheelRewards: [
        { type: 'coins', value: 1000, text: '1000 星币' },
        { type: 'coins', value: 3000, text: '3000 星币' },
        { type: 'coins', value: 5000, text: '5000 星币' },
        { type: 'popularity', value: 5, text: '人气+5' },
        { type: 'reputation', value: 3, text: '口碑+3' },
        { type: 'exp', value: 250, text: '250 经验' },
        { type: 'exp', value: 500, text: '500 经验' },
        { type: 'nothing', value: 0, text: '谢谢惠顾' }
    ],
    promotions: [
        { id: 'hot', name: '人气推广', cost: 8000, effect: { popularity: 20 }, duration: 30, desc: '人气+20，持续30分钟' },
        { id: 'word', name: '口碑营销', cost: 12000, effect: { reputation: 15 }, duration: 45, desc: '口碑+15，持续45分钟' }
    ],
    // ========== 10 大特色玩法配置 ==========
    luckyMoment: {
        desc: '随机触发多档幸运，收益加成持续一段时间',
        totalChancePerMin: 0.025,
        tiers: [
            { name: '小幸运', chanceWeight: 15, durationMin: 5, multiplier: 2 },
            { name: '幸运时刻', chanceWeight: 6, durationMin: 8, multiplier: 2.2 },
            { name: '大幸运', chanceWeight: 3, durationMin: 10, multiplier: 2.5 },
            { name: '超级幸运', chanceWeight: 1, durationMin: 12, multiplier: 3 }
        ]
    },
    bartenderGame: { cost: 500, successReward: { coins: 800, reputation: 1 }, failReward: { coins: 100 }, desc: '调酒QTE，成功得星币+口碑' },
    vipBoxAuction: {
        desc: '竞拍多档包厢，持续时间内收益加成',
        tiers: [
            { id: 'normal', name: '普通包厢', cost: 3000, durationMin: 20, bonusMultiplier: 1.25 },
            { id: 'luxury', name: '豪华包厢', cost: 8000, durationMin: 30, bonusMultiplier: 1.4 },
            { id: 'supreme', name: '至尊包厢', cost: 20000, durationMin: 45, bonusMultiplier: 1.6 },
            { id: 'president', name: '总统包厢', cost: 50000, durationMin: 60, bonusMultiplier: 1.85 }
        ]
    },
    popularityRank: {
        weekStartKey: 'lastPopularityRankWeek',
        desc: '每周人气榜，按人气档位领奖',
        rewards: [
            { minPop: 50000, coins: 80000, pop: 150 },
            { minPop: 20000, coins: 40000, pop: 80 },
            { minPop: 12000, coins: 25000, pop: 50 },
            { minPop: 8000, coins: 15000, pop: 35 },
            { minPop: 5000, coins: 10000, pop: 25 },
            { minPop: 2000, coins: 6000, pop: 15 },
            { minPop: 1000, coins: 15000, pop: 30 },
            { minPop: 500, coins: 8000, pop: 15 },
            { minPop: 200, coins: 3000, pop: 5 }
        ]
    },
    themeDay: {
        desc: '每日随机主题，全收益加成',
        bonusMatch: 1.15,
        themes: [
            { name: '复古爵士', desc: '蓝调爵士乐队，经典马提尼' },
            { name: '电音风暴', desc: '国际DJ打碟，激光矩阵' },
            { name: '嘻哈街头', desc: '说唱Battle，街头文化' },
            { name: '拉丁热舞', desc: '萨尔萨与雷鬼，热情似火' },
            { name: '赛博朋克', desc: '霓虹未来，VR体验' },
            { name: '黄金年代', desc: '盖茨比风格，纸醉金迷' },
            { name: '热带派对', desc: '草裙舞与热带鸡尾酒' },
            { name: '魔法奇幻', desc: '哈利波特主题，黄油啤酒' },
            { name: '白色派对', desc: '全白着装，泡沫与冰雕' },
            { name: '黑色礼服', desc: '正式着装，交响乐团' },
            { name: '万圣惊魂', desc: '恐怖主题，化妆大赛' },
            { name: '夏日冲浪', desc: '人工波浪，比基尼秀' }
        ]
    },
    mysteryGuest: {
        desc: '随机神秘大咖到访，奖励倍数不同',
        minLevel: 3,
        chanceBase: 0.025,
        guests: [
            { name: '当红明星', multiplier: 5, weight: 10 },
            { name: '隐形富豪', multiplier: 6, weight: 6 },
            { name: '顶流网红', multiplier: 5.5, weight: 8 },
            { name: '国际巨星', multiplier: 7, weight: 3 },
            { name: '神秘大佬', multiplier: 8, weight: 2 },
            { name: '传奇投资人', multiplier: 6.5, weight: 4 }
        ]
    },
    timeChallenge: {
        desc: '限时挑战，完成得丰厚奖励',
        list: [
            { id: 'sell30', name: '8分钟售出30件', target: 30, durationMin: 8, progressKey: 'challengeSold', reward: { coins: 1500, popularity: 3 } },
            { id: 'sell50', name: '10分钟售出50件', target: 50, durationMin: 10, progressKey: 'challengeSold', reward: { coins: 2000, popularity: 5 } },
            { id: 'sell100', name: '15分钟售出100件', target: 100, durationMin: 15, progressKey: 'challengeSold', reward: { coins: 5000, popularity: 10 } },
            { id: 'earn5k', name: '15分钟赚5000星币', target: 5000, durationMin: 15, progressKey: 'challengeEarned', reward: { coins: 3000, reputation: 3 } },
            { id: 'earn15k', name: '25分钟赚1.5万星币', target: 15000, durationMin: 25, progressKey: 'challengeEarned', reward: { coins: 8000, reputation: 8 } },
            { id: 'vip3', name: '20分钟内接待3位VIP', target: 3, durationMin: 20, progressKey: 'challengeVip', reward: { coins: 5000, popularity: 10 } },
            { id: 'vip5', name: '30分钟内接待5位VIP', target: 5, durationMin: 30, progressKey: 'challengeVip', reward: { coins: 12000, popularity: 20, reputation: 5 } },
            { id: 'sell200', name: '25分钟售出200件', target: 200, durationMin: 25, progressKey: 'challengeSold', reward: { coins: 15000, popularity: 25, reputation: 10 } },
            { id: 'earn30k', name: '40分钟赚3万星币', target: 30000, durationMin: 40, progressKey: 'challengeEarned', reward: { coins: 20000, reputation: 15 } },
            { id: 'vip8', name: '45分钟内接待8位VIP', target: 8, durationMin: 45, progressKey: 'challengeVip', reward: { coins: 25000, popularity: 35, reputation: 12 } }
        ]
    },
    membershipTiers: [
        { name: '黑卡会员', requiredSpend: 100000, bonusCoins: 1.1, bonusExp: 1.05 },
        { name: '银钻会员', requiredSpend: 300000, bonusCoins: 1.12, bonusExp: 1.06 },
        { name: '金钻会员', requiredSpend: 600000, bonusCoins: 1.14, bonusExp: 1.07 },
        { name: '铂金会员', requiredSpend: 1000000, bonusCoins: 1.16, bonusExp: 1.08 },
        { name: '星耀会员', requiredSpend: 2000000, bonusCoins: 1.18, bonusExp: 1.09 },
        { name: '至尊会员', requiredSpend: 5000000, bonusCoins: 1.2, bonusExp: 1.1 },
        { name: '传奇会员', requiredSpend: 10000000, bonusCoins: 1.22, bonusExp: 1.12 },
        { name: '神话会员', requiredSpend: 20000000, bonusCoins: 1.25, bonusExp: 1.14 },
        { name: '永恒会员', requiredSpend: 50000000, bonusCoins: 1.28, bonusExp: 1.16 },
        { name: '巅峰会员', requiredSpend: 100000000, bonusCoins: 1.32, bonusExp: 1.18 },
        { name: '夜店之王', requiredSpend: 200000000, bonusCoins: 1.36, bonusExp: 1.2 },
        { name: '传奇至尊', requiredSpend: 500000000, bonusCoins: 1.4, bonusExp: 1.22 },
        { name: '神话至尊', requiredSpend: 1000000000, bonusCoins: 1.44, bonusExp: 1.24 },
        { name: '永恒至尊', requiredSpend: 2000000000, bonusCoins: 1.48, bonusExp: 1.26 },
        { name: '巅峰至尊', requiredSpend: 5000000000, bonusCoins: 1.52, bonusExp: 1.28 },
        { name: '无上夜皇', requiredSpend: 10000000000, bonusCoins: 1.56, bonusExp: 1.3 }
    ],
    staffTalentShow: {
        desc: '多种才艺秀，人气与经验加成，共享冷却',
        cooldownMin: 45,
        shows: [
            { id: 'sing', name: '歌唱秀', cost: 2000, popularityGain: 8, expGain: 50 },
            { id: 'dance', name: '舞蹈秀', cost: 3500, popularityGain: 14, expGain: 80 },
            { id: 'magic', name: '魔术秀', cost: 5000, popularityGain: 20, expGain: 120 },
            { id: 'comedy', name: '脱口秀', cost: 2800, popularityGain: 12, expGain: 70 },
            { id: 'acrobat', name: '杂技秀', cost: 6000, popularityGain: 25, expGain: 150 },
            { id: 'band', name: '乐队演出', cost: 4500, popularityGain: 18, expGain: 100 }
        ]
    },
    collectibles: {
        desc: '收集展示品，永久收益加成',
        items: [
            { id: 'crystal', name: '水晶酒瓶', condDesc: '累计售出5000件', effect: { coins: 1.03 }, unlockCond: function(p) { return (p.nightClub.totalSold || 0) >= 5000; } },
            { id: 'golden', name: '金色纪念杯', condDesc: '店铺等级达到5', effect: { exp: 1.05 }, unlockCond: function(p) { return (p.nightClub.level || 0) >= 5; } },
            { id: 'diamond', name: '钻石开瓶器', condDesc: '人气达到1000', effect: { coins: 1.05, exp: 1.03 }, unlockCond: function(p) { return (p.nightClub.popularity || 0) >= 1000; } },
            { id: 'blackAce', name: '黑桃A空瓶', condDesc: '累计售出2万件', effect: { coins: 1.04 }, unlockCond: function(p) { return (p.nightClub.totalSold || 0) >= 20000; } },
            { id: 'celebrityPhoto', name: '名人签名照', condDesc: '人气达到2000', effect: { exp: 1.06 }, unlockCond: function(p) { return (p.nightClub.popularity || 0) >= 2000; } },
            { id: 'cigarBox', name: '雪茄盒', condDesc: '口碑达到1500', effect: { coins: 1.04 }, unlockCond: function(p) { return (p.nightClub.reputation || 0) >= 1500; } },
            { id: 'vipGoldCard', name: 'VIP金卡', condDesc: '累计接待VIP 200次', effect: { coins: 1.05, exp: 1.02 }, unlockCond: function(p) { return (p.nightClub.totalVipVisits || 0) >= 200; } },
            { id: 'neonSign', name: '霓虹招牌', condDesc: '店铺等级达到15', effect: { exp: 1.08 }, unlockCond: function(p) { return (p.nightClub.level || 0) >= 15; } },
            { id: 'champagneTower', name: '香槟塔模型', condDesc: '累计售出5万件', effect: { coins: 1.06 }, unlockCond: function(p) { return (p.nightClub.totalSold || 0) >= 50000; } },
            { id: 'discoBall', name: '舞池灯球', condDesc: '人气达到5000', effect: { coins: 1.05, exp: 1.03 }, unlockCond: function(p) { return (p.nightClub.popularity || 0) >= 5000; } },
            { id: 'whiskeyBarrel', name: '威士忌橡木桶', condDesc: '口碑达到2500', effect: { coins: 1.06, exp: 1.02 }, unlockCond: function(p) { return (p.nightClub.reputation || 0) >= 2500; } },
            { id: 'djTurntable', name: 'DJ打碟机', condDesc: '店铺等级达到20', effect: { exp: 1.1 }, unlockCond: function(p) { return (p.nightClub.level || 0) >= 20; } },
            { id: 'diamondIce', name: '钻石冰桶', condDesc: '累计售出10万件', effect: { coins: 1.07 }, unlockCond: function(p) { return (p.nightClub.totalSold || 0) >= 100000; } },
            { id: 'redCarpet', name: '红毯卷轴', condDesc: '人气达到8000', effect: { coins: 1.04, exp: 1.06 }, unlockCond: function(p) { return (p.nightClub.popularity || 0) >= 8000; } },
            { id: 'vipPlague', name: 'VIP铭牌', condDesc: '累计接待VIP 500次', effect: { coins: 1.06, exp: 1.04 }, unlockCond: function(p) { return (p.nightClub.totalVipVisits || 0) >= 500; } },
            { id: 'crystalChandelier', name: '水晶吊灯', condDesc: '口碑达到4000', effect: { coins: 1.07, exp: 1.03 }, unlockCond: function(p) { return (p.nightClub.reputation || 0) >= 4000; } },
            { id: 'goldMicrophone', name: '金话筒', condDesc: '店铺等级达到25', effect: { coins: 1.03, exp: 1.1 }, unlockCond: function(p) { return (p.nightClub.level || 0) >= 25; } },
            { id: 'millionBottle', name: '百万香槟瓶', condDesc: '累计售出20万件', effect: { coins: 1.08 }, unlockCond: function(p) { return (p.nightClub.totalSold || 0) >= 200000; } },
            { id: 'starWall', name: '明星墙相框', condDesc: '人气达到1.2万', effect: { exp: 1.12 }, unlockCond: function(p) { return (p.nightClub.popularity || 0) >= 12000; } },
            { id: 'velvetRope', name: '天鹅绒绳柱', condDesc: '口碑达到6000', effect: { coins: 1.06, exp: 1.05 }, unlockCond: function(p) { return (p.nightClub.reputation || 0) >= 6000; } },
            { id: 'vip1000', name: '钻石会员卡', condDesc: '累计接待VIP 1000次', effect: { coins: 1.08, exp: 1.05 }, unlockCond: function(p) { return (p.nightClub.totalVipVisits || 0) >= 1000; } },
            { id: 'skyBar', name: '天台吧台模型', condDesc: '店铺等级达到30', effect: { coins: 1.05, exp: 1.12 }, unlockCond: function(p) { return (p.nightClub.level || 0) >= 30; } },
            { id: 'halfMillion', name: '五十万销量奖杯', condDesc: '累计售出50万件', effect: { coins: 1.1, exp: 1.05 }, unlockCond: function(p) { return (p.nightClub.totalSold || 0) >= 500000; } },
            { id: 'spotlight', name: '聚光灯', condDesc: '人气达到2万', effect: { coins: 1.06, exp: 1.08 }, unlockCond: function(p) { return (p.nightClub.popularity || 0) >= 20000; } },
            { id: 'masterSommelier', name: '品酒师徽章', condDesc: '口碑达到1万', effect: { coins: 1.08, exp: 1.06 }, unlockCond: function(p) { return (p.nightClub.reputation || 0) >= 10000; } },
            { id: 'vip2000', name: '传奇VIP勋章', condDesc: '累计接待VIP 2000次', effect: { coins: 1.1, exp: 1.06 }, unlockCond: function(p) { return (p.nightClub.totalVipVisits || 0) >= 2000; } },
            { id: 'level40', name: '夜店之王匾额', condDesc: '店铺等级达到40', effect: { coins: 1.07, exp: 1.15 }, unlockCond: function(p) { return (p.nightClub.level || 0) >= 40; } },
            { id: 'millionSold', name: '百万销量纪念碑', condDesc: '累计售出100万件', effect: { coins: 1.12, exp: 1.08 }, unlockCond: function(p) { return (p.nightClub.totalSold || 0) >= 1000000; } },
            { id: 'pop50k', name: '顶流人气奖', condDesc: '人气达到5万', effect: { coins: 1.08, exp: 1.1 }, unlockCond: function(p) { return (p.nightClub.popularity || 0) >= 50000; } },
            { id: 'rep20k', name: '金字口碑牌', condDesc: '口碑达到2万', effect: { coins: 1.1, exp: 1.08 }, unlockCond: function(p) { return (p.nightClub.reputation || 0) >= 20000; } },
            { id: 'vip5k', name: '至尊VIP皇冠', condDesc: '累计接待VIP 5000次', effect: { coins: 1.12, exp: 1.1 }, unlockCond: function(p) { return (p.nightClub.totalVipVisits || 0) >= 5000; } },
            { id: 'level50', name: '传奇夜店徽章', condDesc: '店铺等级达到50', effect: { coins: 1.1, exp: 1.18 }, unlockCond: function(p) { return (p.nightClub.level || 0) >= 50; } },
            { id: 'fiveMillion', name: '五百万销量金像', condDesc: '累计售出500万件', effect: { coins: 1.15, exp: 1.1 }, unlockCond: function(p) { return (p.nightClub.totalSold || 0) >= 5000000; } },
            { id: 'pop100k', name: '现象级人气奖杯', condDesc: '人气达到10万', effect: { coins: 1.1, exp: 1.12 }, unlockCond: function(p) { return (p.nightClub.popularity || 0) >= 100000; } },
            { id: 'rep50k', name: '神话口碑勋章', condDesc: '口碑达到5万', effect: { coins: 1.12, exp: 1.1 }, unlockCond: function(p) { return (p.nightClub.reputation || 0) >= 50000; } },
            { id: 'vip10k', name: '永恒VIP之星', condDesc: '累计接待VIP 1万次', effect: { coins: 1.15, exp: 1.12 }, unlockCond: function(p) { return (p.nightClub.totalVipVisits || 0) >= 10000; } }
        ]
    }
};
window.__nightClubConfigReady = true;
if (window.__deferNightClubInit && typeof initNightClubSystem === 'function') {
    initNightClubSystem();
    window.__deferNightClubInit = false;
}

// 初始化夜店系统
function initNightClubSystem() {
    if (!window.__nightClubConfigReady) {
        setTimeout(initNightClubSystem, 0);
        return;
    }
    try {
        if (!nightClubConfig || !nightClubConfig.shopGoods) return;
    } catch (e) {
        setTimeout(initNightClubSystem, 0);
        return;
    }
    if (!player.nightClub) {
        player.nightClub = {
            level: 1,
            exp: 0,
            starCoins: 0,
            staff: nightClubConfig.staffTypes.map(type => ({
                type: type.id,
                level: 1,
                expOutput: type.baseExp,
                coinsOutput: type.baseCoins
            })),
            equipment: nightClubConfig.equipmentTypes.map(type => ({
                type: type.id,
                level: 1,
                bonus: type.baseBonus
            })),
            vip: {
                lastVisit: 0,
                nextVisit: 0
            },
            activeEvent: null,
            lastUpdate: Date.now(),
            // 售卖商品：每种商品的库存与当前售价
            goods: nightClubConfig.shopGoods.map(g => ({
                type: g.id,
                stock: 0,
                price: g.basePrice
            })),
            // 顾客光顾记录（最近20条，用于模拟养成展示）
            customerLog: [],
            lastCustomerRoll: 0,
            popularity: 0,
            reputation: 0,
            totalSold: 0,
            totalVipVisits: 0,
            dailySold: 0,
            dailyVipCount: 0,
            dailyEarnedCoins: 0,
            dailyRestockCount: 0,
            dailyCustomerCount: 0,
            dailyReturnCount: 0,
            lastDailyReset: 0,
            checkInLastDay: -1,
            achievements: [],
            activePromo: null,
            todayEarnedCoins: 0,
            luckyMomentEndTime: 0,
            luckyMomentMultiplier: 1,
            luckyMomentName: '',
            vipBoxEndTime: 0,
            vipBoxMultiplier: 1,
            lastPopularityRankWeek: 0,
            themeDayDate: 0,
            themeOfDay: '',
            timeChallengeActive: null,
            timeChallengeStart: 0,
            challengeSold: 0,
            challengeEarned: 0,
            challengeVip: 0,
            totalSpentForBlackCard: 0,
            staffTalentShowLastTime: 0,
            collectiblesUnlocked: []
        };
    }
    if (!player.nightClub.goods) {
        player.nightClub.goods = nightClubConfig.shopGoods.map(g => ({
            type: g.id,
            stock: 0,
            price: g.basePrice
        }));
    }
    // 兼容新加的高价值商品：若配置里有而存档里没有，则追加
    nightClubConfig.shopGoods.forEach(g => {
        if (!player.nightClub.goods.some(x => x.type === g.id)) {
            player.nightClub.goods.push({ type: g.id, stock: 0, price: g.basePrice });
        }
    });
    // 库存上限：按 maxStockTotal（或旧档等级×maxStockPerLevel）收敛
    if (nightClubConfig.shopGoods && nightClubConfig.shopGoods.length) {
        player.nightClub.goods.forEach(function(g) {
            var cap = getNightClubGoodMaxStock(g.type);
            if (g.stock > cap) g.stock = cap;
        });
    }
    if (!player.nightClub.customerLog) player.nightClub.customerLog = [];
    if (player.nightClub.lastCustomerRoll === undefined) player.nightClub.lastCustomerRoll = 0;
    if (player.nightClub.popularity === undefined) player.nightClub.popularity = 0;
    if (player.nightClub.reputation === undefined) player.nightClub.reputation = 0;
    if (player.nightClub.totalSold === undefined) player.nightClub.totalSold = 0;
    if (player.nightClub.totalVipVisits === undefined) player.nightClub.totalVipVisits = 0;
    if (!player.nightClub.achievements) player.nightClub.achievements = [];
    if (player.nightClub.luckyMomentEndTime === undefined) player.nightClub.luckyMomentEndTime = 0;
    if (player.nightClub.luckyMomentMultiplier === undefined) player.nightClub.luckyMomentMultiplier = 1;
    if (player.nightClub.luckyMomentName === undefined) player.nightClub.luckyMomentName = '';
    if (player.nightClub.vipBoxMultiplier === undefined) player.nightClub.vipBoxMultiplier = 1;
    if (player.nightClub.vipBoxEndTime === undefined) player.nightClub.vipBoxEndTime = 0;
    if (player.nightClub.lastPopularityRankWeek === undefined) player.nightClub.lastPopularityRankWeek = 0;
    if (player.nightClub.themeDayDate === undefined) player.nightClub.themeDayDate = 0;
    if (player.nightClub.themeOfDay === undefined) player.nightClub.themeOfDay = '';
    if (player.nightClub.timeChallengeActive === undefined) player.nightClub.timeChallengeActive = null;
    if (player.nightClub.timeChallengeStart === undefined) player.nightClub.timeChallengeStart = 0;
    if (player.nightClub.challengeSold === undefined) player.nightClub.challengeSold = 0;
    if (player.nightClub.challengeEarned === undefined) player.nightClub.challengeEarned = 0;
    if (player.nightClub.challengeVip === undefined) player.nightClub.challengeVip = 0;
    if (player.nightClub.totalSpentForBlackCard === undefined) player.nightClub.totalSpentForBlackCard = 0;
    if (player.nightClub.staffTalentShowLastTime === undefined) player.nightClub.staffTalentShowLastTime = 0;
    if (!player.nightClub.collectiblesUnlocked) player.nightClub.collectiblesUnlocked = [];
    nightClubResetDailyIfNeeded();
}

// 切换夜店系统界面
function toggleNightClubSystem() {
      if (player.reincarnationCount < 600) {
        alert("需要达到600转才能开启夜店系统！");
        return;
    }
    const overlay = document.getElementById('nightClubOverlay');
    const ui = document.getElementById('nightClubUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
        // 关闭界面时清除 VIP 倒计时定时器，避免定时器泄漏与后台持续更新 DOM 导致卡顿
        if (window.vipTimer) { clearInterval(window.vipTimer); window.vipTimer = null; }
        // 关闭调酒小游戏动画并隐藏弹窗，避免 requestAnimationFrame 持续运行造成内存/CPU 泄漏
        if (typeof bartenderGameAnimId !== 'undefined' && bartenderGameAnimId) {
            cancelAnimationFrame(bartenderGameAnimId);
            bartenderGameAnimId = null;
        }
        bartenderGameRunning = false;
        var bartenderModal = document.getElementById('nightClubBartenderModal');
        if (bartenderModal) bartenderModal.style.display = 'none';
        // 关闭其他夜店子弹窗，避免残留
        var subModals = ['nightClubDailyModal', 'nightClubWheelModal', 'nightClubPromoModal', 'nightClubChallengeModal', 'nightClubVipBoxModal', 'nightClubTalentShowModal', 'nightClubMemberModal', 'nightClubCollectiblesModal'];
        for (var i = 0; i < subModals.length; i++) {
            var el = document.getElementById(subModals[i]);
            if (el) el.style.display = 'none';
        }
    } else {
        initNightClubSystem();
        ui.style.display = 'block';
        overlay.style.display = 'block';
        openNightClubTab('staff');
        updateNightClubUI();
    }
}

// 切换标签页
function openNightClubTab(tabName) {
    var ui = document.getElementById('nightClubUI');
    if (!ui) return;
    var tabcontents = ui.getElementsByClassName('nightclub-tabcontent');
    for (var i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = 'none';
    }
    var tablinks = ui.querySelectorAll('.tablink');
    for (var j = 0; j < tablinks.length; j++) {
        tablinks[j].classList.remove('active');
    }
    
    // 显示当前标签内容并添加活动类
    var tabEl = document.getElementById('nightClub' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (tabEl) tabEl.style.display = 'block';
    let activeBtn = (event && event.currentTarget && event.currentTarget.classList && event.currentTarget.classList.contains('tablink')) ? event.currentTarget : null;
    if (!activeBtn && ui) {
        var btns = ui.querySelectorAll('.nightclub-tabs .tablink');
        for (var k = 0; k < btns.length; k++) {
            var oc = btns[k].getAttribute('onclick') || '';
            if (oc.indexOf("'" + tabName + "'") !== -1) { activeBtn = btns[k]; break; }
        }
    }
    if (activeBtn) activeBtn.classList.add('active');
    
    // 更新标签内容
    if (tabName === 'staff') {
        updateStaffTab();
    } else if (tabName === 'equipment') {
        updateEquipmentTab();
    } else if (tabName === 'shop') {
        updateShopTab();
    } else if (tabName === 'customers') {
        updateCustomersTab();
    } else if (tabName === 'special') {
        updateSpecialTab();
    } else if (tabName === 'events') {
        updateEventsTab();
    } else if (tabName === 'achieve') {
        updateNightClubAchieveTab();
    } else if (tabName === 'play') {
        updateNightClubPlayTab();
    }
}

// 更新夜店系统UI
function updateNightClubUI() {
    // 更新店铺信息
    document.getElementById('nightClubLevel').textContent = player.nightClub.level;
    document.getElementById('nightClubExp').textContent = player.nightClub.exp.toFixed(1);
    
    const nextLevelExp = nightClubConfig.levelExpRequirements[player.nightClub.level - 1] || 
                         nightClubConfig.levelExpRequirements[nightClubConfig.levelExpRequirements.length - 1];
    document.getElementById('nightClubExpNext').textContent = nextLevelExp;
    
    const expPercent = Math.min(100, (player.nightClub.exp / nextLevelExp) * 100);
    document.getElementById('nightClubExpBar').style.width = expPercent + '%';
    
    document.getElementById('starCoinCount').textContent = player.nightClub.starCoins.toFixed(1);
    
    // 会员称号：未达任意档位显示青铜会员，否则显示当前档位名称
    var memberTitleEl = document.getElementById('nightClubMemberTitle');
    if (memberTitleEl) {
        var mt = getNightClubMemberTier();
        var tiers = nightClubConfig.membershipTiers;
        memberTitleEl.textContent = (mt >= 0 && tiers && tiers[mt]) ? tiers[mt].name : '青铜会员';
    }

    // 计算每分钟收益
    let totalExpPerMin = 0;
    let totalCoinsPerMin = 0;
    
    // 店员收益
    player.nightClub.staff.forEach(staff => {
        totalExpPerMin += staff.expOutput;
        totalCoinsPerMin += staff.coinsOutput;
    });
    
    // 设备加成
    let bonusMultiplier = 1;
    player.nightClub.equipment.forEach(eq => {
        bonusMultiplier *= eq.bonus;
    });
    
    // 活动加成
    if (player.nightClub.activeEvent) {
        if (player.nightClub.activeEvent.effect.expMultiplier) {
            totalExpPerMin *= player.nightClub.activeEvent.effect.expMultiplier;
        }
        if (player.nightClub.activeEvent.effect.coinsMultiplier) {
            totalCoinsPerMin *= player.nightClub.activeEvent.effect.coinsMultiplier;
        }
    }
    
    totalExpPerMin *= bonusMultiplier;
    totalCoinsPerMin *= bonusMultiplier;
    
    document.getElementById('expPerMinuteq').textContent = totalExpPerMin.toFixed(2);
    document.getElementById('coinsPerMinute').textContent = totalCoinsPerMin.toFixed(2);
    var popEl = document.getElementById('nightClubPopularity');
    var repEl = document.getElementById('nightClubReputation');
    if (popEl) popEl.textContent = Math.floor(player.nightClub.popularity || 0);
    if (repEl) repEl.textContent = Math.floor(player.nightClub.reputation || 0);
    var acEl = document.getElementById('nightClubAchieveCount');
    var atEl = document.getElementById('nightClubAchieveTotal');
    if (acEl) acEl.textContent = (player.nightClub.achievements || []).length;
    if (atEl) atEl.textContent = (nightClubConfig.achievements || []).length;
    updateNightClubLeftExtra();
}

// 夜店金句（随机一条，眼前一亮）
var nightClubRandomTips = [
    '今晚的每一杯，都是故事。', '人气不够，金句来凑。', '卖的不是酒，是氛围。', '回头客才是真·财富自由。',
    'VIP在左，土豪在右，你在中间数星币。', '缺货一次，口碑-1。补货要勤。', '路人会变成散客，散客会变成土豪。',
    '夜店没有早睡的人，只有还没来的人。', '香槟开得越响，钱包越安静。', '口碑上去，高消费顾客自己来。',
    '签到一天，快乐一天。', '轮盘一转，惊喜不断。', '促销一时爽，一直促销一直爽。',
    '钻石香槟塔是检验土豪的唯一标准。', '卖啤酒走量，卖黑桃A走心。', '刚刚那位顾客可能明天就是VIP。'
];

function updateNightClubLeftExtra() {
    var lastEl = document.getElementById('nightClubLastAction');
    var tipEl = document.getElementById('nightClubRandomTip');
    if (!lastEl && !tipEl) return;
    if (lastEl && player.nightClub && player.nightClub.customerLog && player.nightClub.customerLog.length > 0) {
        var last = player.nightClub.customerLog[player.nightClub.customerLog.length - 1];
        var timeStr = new Date(last.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        var txt = last.customerName + ' ' + (last.bought && last.bought.length > 0 ? '买了 ' + last.bought.map(function(b) { return b.name + '×' + b.qty; }).join('、') + '，+' + last.totalCoins + '✨' : '逛了逛没消费');
        lastEl.textContent = '[' + timeStr + '] ' + txt;
    } else if (lastEl) {
        lastEl.textContent = '等待顾客光临…';
    }
    if (tipEl && nightClubRandomTips && nightClubRandomTips.length > 0) {
        var idx = Math.floor(Math.random() * nightClubRandomTips.length);
        tipEl.textContent = nightClubRandomTips[idx];
    }
}

function nightClubResetDailyIfNeeded() {
    if (!player.nightClub) return;
    var now = new Date();
    var today = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    var last = player.nightClub.lastDailyReset || 0;
    if (last > 0 && last !== today) {
        player.nightClub.dailySold = 0;
        player.nightClub.dailyVipCount = 0;
        player.nightClub.dailyEarnedCoins = 0;
        player.nightClub.dailyRestockCount = 0;
        player.nightClub.dailyCustomerCount = 0;
        player.nightClub.dailyReturnCount = 0;
        player.nightClub.todayEarnedCoins = 0;
        player.nightClub.dailyTaskClaimed = {};
    }
    player.nightClub.lastDailyReset = today;
}

// 更新店员标签页（拼接字符串后一次性写入，避免循环内 innerHTML+= 导致重排卡顿）
function updateStaffTab() {
    const container = document.getElementById('nightClubStaffGrid') || document.getElementById('nightClubStaff');
    if (!container) return;
    var html = '';
    player.nightClub.staff.forEach(staff => {
        const config = nightClubConfig.staffTypes.find(t => t.id === staff.type);
        const cost = calculateStaffUpgradeCost(staff.type);
        html += '<div class="staff-card" style="background: linear-gradient(135deg, #252535 0%, #1a1a2a 100%); border-radius: 10px; padding: 14px; border: 1px solid rgba(156,39,176,0.4);">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
            '<h3 style="margin: 0; color: #ce93d8;">' + config.name + '</h3>' +
            '<span style="color: #FFD700;">Lv.' + staff.level + '</span></div>' +
            '<div style="margin-bottom: 10px; font-size: 12px; color: #aaa;">' +
            '<div>经验/分: ' + staff.expOutput.toFixed(3) + ' · 星币/分: ' + staff.coinsOutput.toFixed(3) + '</div></div>' +
            '<button onclick="upgradeStaff(\'' + staff.type + '\')" style="width: 100%; background: ' + (player.nightClub.starCoins >= cost ? 'linear-gradient(90deg, #4CAF50, #388E3C)' : '#555') + '; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 12px;"' + (player.nightClub.starCoins < cost ? ' disabled' : '') + '>升级 (' + cost + '✨)</button></div>';
    });
    container.innerHTML = html;
}

// 计算店员升级成本
function calculateStaffUpgradeCost(staffType) {
    const staff = player.nightClub.staff.find(s => s.type === staffType);
    const config = nightClubConfig.staffTypes.find(t => t.id === staffType);
    return Math.floor(config.baseCost * Math.pow(1.5, staff.level - 1));
}

// 升级店员
function upgradeStaff(staffType) {
    const staff = player.nightClub.staff.find(s => s.type === staffType);
    const config = nightClubConfig.staffTypes.find(t => t.id === staffType);
    const cost = calculateStaffUpgradeCost(staffType);
    
    if (player.nightClub.starCoins < cost) {
        logAction("星币不足！", "error");
        return;
    }
    
    player.nightClub.starCoins -= cost;
    player.nightClub.totalSpentForBlackCard = (player.nightClub.totalSpentForBlackCard || 0) + cost;
    staff.level++;
    staff.expOutput = config.baseExp + (config.expPerLevel * (staff.level - 1));
    staff.coinsOutput = config.baseCoins + (config.coinsPerLevel * (staff.level - 1));
    
    logAction(`${config.name}升级到Lv.${staff.level}！`, "success");
    updateNightClubUI();
    updateStaffTab();
}

// 更新设备标签页（拼接字符串后一次性写入，避免循环内 innerHTML+= 导致重排卡顿）
function updateEquipmentTab() {
    const container = document.getElementById('nightClubEquipmentGrid') || document.getElementById('nightClubEquipment');
    if (!container) return;
    var html = '';
    player.nightClub.equipment.forEach(eq => {
        const config = nightClubConfig.equipmentTypes.find(t => t.id === eq.type);
        const cost = calculateEquipmentUpgradeCost(eq.type);
        html += '<div class="equipment-card" style="background: linear-gradient(135deg, #252535 0%, #1a1a2a 100%); border-radius: 10px; padding: 14px; border: 1px solid rgba(156,39,176,0.4);">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
            '<h3 style="margin: 0; color: #ce93d8;">' + config.name + '</h3>' +
            '<span style="color: #FFD700;">Lv.' + eq.level + '</span></div>' +
            '<div style="margin-bottom: 10px; font-size: 12px; color: #aaa;">全局加成: ' + (eq.bonus * 100 - 100).toFixed(1) + '%</div>' +
            '<button onclick="upgradeEquipment(\'' + eq.type + '\')" style="width: 100%; background: ' + (player.nightClub.starCoins >= cost ? 'linear-gradient(90deg, #4CAF50, #388E3C)' : '#555') + '; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 12px;"' + (player.nightClub.starCoins < cost ? ' disabled' : '') + '>升级 (' + cost + '✨)</button></div>';
    });
    container.innerHTML = html;
}

// 计算设备升级成本
function calculateEquipmentUpgradeCost(eqType) {
    const eq = player.nightClub.equipment.find(e => e.type === eqType);
    const config = nightClubConfig.equipmentTypes.find(t => t.id === eqType);
    return Math.floor(config.baseCost * Math.pow(1.8, eq.level - 1));
}

// 升级设备
function upgradeEquipment(eqType) {
    const eq = player.nightClub.equipment.find(e => e.type === eqType);
    const config = nightClubConfig.equipmentTypes.find(t => t.id === eqType);
    const cost = calculateEquipmentUpgradeCost(eqType);
    
    if (player.nightClub.starCoins < cost) {
        logAction("星币不足！", "error");
        return;
    }
    
    player.nightClub.starCoins -= cost;
    player.nightClub.totalSpentForBlackCard = (player.nightClub.totalSpentForBlackCard || 0) + cost;
    eq.level++;
    eq.bonus = config.baseBonus + (config.bonusPerLevel * (eq.level - 1));
    
    logAction(`${config.name}升级到Lv.${eq.level}！`, "success");
    updateNightClubUI();
    updateEquipmentTab();
}

// 根据配置计算某商品库存上限（优先 maxStockTotal；否则兼容旧档 等级×maxStockPerLevel）
function getNightClubGoodMaxStock(goodType) {
    var config = nightClubConfig.shopGoods.find(function(c) { return c.id === goodType; });
    if (!config) return 99999;
    if (config.maxStockTotal != null) return config.maxStockTotal;
    if (config.maxStockPerLevel == null) return 99999;
    var level = (player.nightClub && player.nightClub.level) ? player.nightClub.level : 1;
    return level * config.maxStockPerLevel;
}

function getNightClubRestockBatchSize(config) {
    return Math.max(1, (config.restockCap != null ? config.restockCap : 0) + 1);
}

// 更新售卖商品标签页（拼接字符串后一次性写入，避免循环内 innerHTML+= 导致重排卡顿）
function updateShopTab() {
    const container = document.getElementById('nightClubShopGoodsList');
    if (!container) return;
    var html = '';
    var sortedGoods = player.nightClub.goods.slice().sort(function(a, b) { return (a.price || 0) - (b.price || 0); });
    var level = player.nightClub.level || 1;
    sortedGoods.forEach(good => {
        const config = nightClubConfig.shopGoods.find(c => c.id === good.type);
        if (!config) return;
        good.price = config.basePrice;
        var unlockLevel = config.restockUnlockLevel != null ? config.restockUnlockLevel : 1;
        var canRestockByLevel = level >= unlockLevel;
        var maxStock = getNightClubGoodMaxStock(good.type);
        good.stock = Math.min(good.stock, maxStock);
        var space = maxStock - good.stock;
        var batchSize = getNightClubRestockBatchSize(config);
        var canAdd = canRestockByLevel ? Math.min(batchSize, space) : 0;
        var restockCost = config.cost * canAdd;
        const canRestock = canRestockByLevel && space > 0 && canAdd > 0 && player.nightClub.starCoins >= restockCost;
        var btnText = !canRestockByLevel ? (unlockLevel + '级可补货') : (space <= 0 ? '已满' : ('补货 +' + (canAdd < batchSize ? canAdd : batchSize)));
        var line2 = !canRestockByLevel ? (unlockLevel + '级可补货') : (canAdd > 0 ? canAdd + '件=' + restockCost + '✨' : '已满');
        var fullCost = space > 0 ? config.cost * space : 0;
        var canFull = canRestockByLevel && space > 0 && player.nightClub.starCoins >= fullCost;
        var fullBtnLabel = !canRestockByLevel ? (unlockLevel + '级补满') : (space <= 0 ? '已满' : (player.nightClub.starCoins < fullCost ? '补满(星币不足)' : ('补满 ' + space + '件')));
        html += '<div class="shop-good-card" style="background: linear-gradient(135deg, #252535 0%, #1a1a2a 100%); border-radius: 10px; padding: 12px; border-left: 4px solid #FF9800;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
            '<h4 style="margin: 0; color: #ffb74d;">' + config.name + '</h4>' +
            '<span style="color: #4CAF50; font-size: 12px;">库存 ' + good.stock + '/' + maxStock + '</span></div>' +
            '<div style="font-size: 11px; color: #888; margin-bottom: 8px;">' +
            '<div>售价 <span style="color: #FFD700;">' + good.price + '</span>✨ · 吸引力' + (config.appeal * 100).toFixed(0) + '%</div>' +
            '<div>补货' + line2 + '</div>' +
            (canRestockByLevel && space > 0 ? '<div style="color:#9575cd;margin-top:4px;">补满需 ' + fullCost + '✨</div>' : '') + '</div>' +
            '<div style="display: flex; gap: 6px; margin-top: 2px;">' +
            '<button type="button" onclick="restockGood(\'' + good.type + '\')" style="flex:1; background: ' + (canRestock ? 'linear-gradient(90deg, #FF9800, #F57C00)' : '#555') + '; color: white; border: none; padding: 6px 4px; border-radius: 6px; cursor: pointer; font-size: 11px;"' + (!canRestock ? ' disabled' : '') + '>' + btnText + '</button>' +
            '<button type="button" onclick="restockGoodFull(\'' + good.type + '\')" style="flex:1; background: ' + (canFull ? 'linear-gradient(90deg, #7E57C2, #5E35B1)' : '#444') + '; color: white; border: none; padding: 6px 4px; border-radius: 6px; cursor: pointer; font-size: 11px;"' + (!canFull ? ' disabled' : '') + ' title="' + (space > 0 && canRestockByLevel ? ('一次补到 ' + maxStock + '，需 ' + fullCost + '✨') : '') + '">' + fullBtnLabel + '</button>' +
            '</div></div>';
    });
    container.innerHTML = html;
}

// 补货（不超过库存上限，按实际补货量扣费；需达到补货解锁等级）
function restockGood(goodType) {
    const config = nightClubConfig.shopGoods.find(c => c.id === goodType);
    const good = player.nightClub.goods.find(g => g.type === goodType);
    if (!config || !good) return;
    var level = player.nightClub.level || 1;
    var unlockLevel = config.restockUnlockLevel != null ? config.restockUnlockLevel : 1;
    if (level < unlockLevel) {
        logAction(config.name + " 需要夜店" + unlockLevel + "级才能补货！", "error");
        updateShopTab();
        return;
    }
    var maxStock = getNightClubGoodMaxStock(goodType);
    good.stock = Math.min(good.stock, maxStock);
    var batchSize = getNightClubRestockBatchSize(config);
    var canAdd = Math.min(batchSize, maxStock - good.stock);
    if (canAdd <= 0) {
        logAction(config.name + " 库存已满！", "error");
        updateShopTab();
        return;
    }
    var cost = config.cost * canAdd;
    if (player.nightClub.starCoins < cost) {
        logAction("星币不足，无法补货！", "error");
        return;
    }
    player.nightClub.starCoins -= cost;
    player.nightClub.totalSpentForBlackCard = (player.nightClub.totalSpentForBlackCard || 0) + cost;
    good.stock += canAdd;
    player.nightClub.dailyRestockCount = (player.nightClub.dailyRestockCount || 0) + 1;
    logAction(config.name + " 补货 +" + canAdd + "，当前库存 " + good.stock + "/" + maxStock, "success");
    updateNightClubUI();
    updateShopTab();
}

// 一键补满到库存上限（按缺货件数扣星币；每日补货次数计 1 次）
function restockGoodFull(goodType) {
    const config = nightClubConfig.shopGoods.find(c => c.id === goodType);
    const good = player.nightClub.goods.find(g => g.type === goodType);
    if (!config || !good) return;
    var level = player.nightClub.level || 1;
    var unlockLevel = config.restockUnlockLevel != null ? config.restockUnlockLevel : 1;
    if (level < unlockLevel) {
        logAction(config.name + " 需要夜店" + unlockLevel + "级才能补货！", "error");
        updateShopTab();
        return;
    }
    var maxStock = getNightClubGoodMaxStock(goodType);
    good.stock = Math.min(good.stock, maxStock);
    var canAdd = maxStock - good.stock;
    if (canAdd <= 0) {
        logAction(config.name + " 库存已满！", "error");
        updateShopTab();
        return;
    }
    var cost = config.cost * canAdd;
    if (player.nightClub.starCoins < cost) {
        logAction("星币不足，无法补满（需 " + cost + "✨）！", "error");
        return;
    }
    player.nightClub.starCoins -= cost;
    player.nightClub.totalSpentForBlackCard = (player.nightClub.totalSpentForBlackCard || 0) + cost;
    good.stock += canAdd;
    player.nightClub.dailyRestockCount = (player.nightClub.dailyRestockCount || 0) + 1;
    logAction(config.name + " 一键补满 +" + canAdd + "，当前库存 " + good.stock + "/" + maxStock + "，消耗 " + cost + "✨", "success");
    updateNightClubUI();
    updateShopTab();
}

// 更新顾客光顾标签页
function updateCustomersTab() {
    const container = document.getElementById('nightClubCustomerLog');
    if (!container) return;
    if (!player.nightClub.customerLog || player.nightClub.customerLog.length === 0) {
        container.innerHTML = '<p style="color: #888;">暂无光顾记录，保持上架商品并等待顾客到来～</p>';
        return;
    }
    container.innerHTML = player.nightClub.customerLog.slice().reverse().map(entry => {
        const timeStr = new Date(entry.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const buyText = entry.bought.length > 0 
            ? ' 购买了 ' + entry.bought.map(b => `${b.name} x${b.qty}(+${b.coins}星币)`).join('、')
            : ' 逛了逛没有消费';
        return `<div style="padding: 6px 0; border-bottom: 1px solid #333; font-size: 0.9em;">[${timeStr}] <span style="color: #E91E63;">${entry.customerName}</span>${buyText}</div>`;
    }).join('');
}

// 更新成就标签页（成就系统显示）
function updateNightClubAchieveTab() {
    var container = document.getElementById('nightClubAchieveList');
    if (!container) return;
    var list = (player.nightClub && player.nightClub.achievements) ? player.nightClub.achievements : [];
    var achievements = nightClubConfig.achievements || [];
    var html = '';
    achievements.forEach(function(a) {
        var done = list.indexOf(a.id) !== -1;
        var rewardText = [];
        if (a.reward.coins) rewardText.push(a.reward.coins + '✨');
        if (a.reward.popularity) rewardText.push('人气+' + a.reward.popularity);
        if (a.reward.reputation) rewardText.push('口碑+' + a.reward.reputation);
        var rewardStr = rewardText.length ? rewardText.join(' ') : '';
        html += '<div style="background: ' + (done ? 'linear-gradient(135deg, rgba(76,175,80,0.2), #252535)' : '#252535') + '; border-radius: 8px; padding: 10px 12px; border-left: 4px solid ' + (done ? '#4CAF50' : '#555') + ';">';
        html += '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">';
        html += '<span style="color: #e0e0e0;">' + (done ? '✅ ' : '❌ ') + a.name + '</span>';
        html += '<span style="font-size: 11px; color: ' + (done ? '#4CAF50' : '#888') + ';">' + (done ? '已完成' : a.targetDesc || '') + '</span>';
        html += '</div>';
        if (rewardStr) html += '<div style="font-size: 11px; color: #888; margin-top: 4px;">奖励: ' + rewardStr + '</div>';
        html += '</div>';
    });
    container.innerHTML = html || '<p style="color: #888;">暂无成就</p>';
}

// 更新特殊人群标签页
function updateSpecialTab() {
    const container = document.getElementById('nightClubSpecial');
    const vipInfo = document.getElementById('vipInfo');
    
    // 计算VIP下次到访时间
    const now = Date.now();
    const timeSinceLastVisit = (now - player.nightClub.vip.lastVisit) / (1000 * 60); // 分钟
    const timeUntilNextVisit = Math.max(0, player.nightClub.vip.nextVisit - now);
    
    vipInfo.innerHTML = `
        <div style="margin-bottom: 10px;">
            <strong>下次VIP到访:</strong> 
            ${timeUntilNextVisit > 0 ? 
                `<span id="vipTimer">${formatTime(timeUntilNextVisit)}</span>` : 
                "VIP随时可能光临！"}
        </div>
    `;
    
    // 如果VIP即将到来，启动计时器
    if (timeUntilNextVisit > 0) {
        startVipTimer();
    }
}

// 格式化时间
function formatTime(ms) {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}分${seconds}秒`;
}

// 启动VIP计时器
function startVipTimer() {
    if (window.vipTimer) clearInterval(window.vipTimer);
    
    window.vipTimer = registerInterval(() => {
        var uiEl = document.getElementById('nightClubUI');
        if (!uiEl || uiEl.style.display !== 'block') {
            if (window.vipTimer) { clearInterval(window.vipTimer); window.vipTimer = null; }
            return;
        }
        const now = Date.now();
        const timeUntilNextVisit = Math.max(0, player.nightClub.vip.nextVisit - now);
        
        if (timeUntilNextVisit <= 0) {
            if (window.vipTimer) { clearInterval(window.vipTimer); window.vipTimer = null; }
            var timerEl = document.getElementById('vipTimer');
            if (timerEl) timerEl.textContent = "VIP已到达！";
            triggerVipVisit();
        } else {
            var el = document.getElementById('vipTimer');
            if (el) el.textContent = formatTime(timeUntilNextVisit);
        }
    }, 1000);
}

// 触发VIP访问
function triggerVipVisit() {
    const baseExp = nightClubConfig.vipConfig.baseExp;
    const baseCoins = nightClubConfig.vipConfig.baseCoins;
    const multiplier = Math.pow(nightClubConfig.vipConfig.levelMultiplier, player.nightClub.level - 1);
    
    const expGain = Math.floor(baseExp * multiplier);
    const coinsGain = Math.floor(baseCoins * multiplier);
    
    player.nightClub.exp += expGain;
    player.nightClub.starCoins += coinsGain;
    
    // 设置下次访问时间
    const now = Date.now();
    player.nightClub.vip.lastVisit = now;
    player.nightClub.vip.nextVisit = now + (nightClubConfig.vipConfig.baseInterval * 60 * 1000);
    
    logAction(`VIP光临！获得${expGain}经验和${coinsGain}星币！`, "success");
    updateNightClubUI();
    updateSpecialTab();
    checkNightClubLevelUp();
}

// 更新事件标签页
function updateEventsTab() {
    const container = document.getElementById('nightClubEvents');
    const currentEventDiv = document.getElementById('currentEvent');
    
    if (player.nightClub.activeEvent) {
        const timeLeft = Math.max(0, player.nightClub.activeEvent.endTime - Date.now());
        currentEventDiv.innerHTML = `
            <div style="background: #333; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                <h4 style="margin-top: 0; color: #FFD700;">${player.nightClub.activeEvent.name}</h4>
                <p>${player.nightClub.activeEvent.description}</p>
                <div>剩余时间: ${formatTime(timeLeft)}</div>
            </div>
        `;
    } else {
        currentEventDiv.innerHTML = "<p>当前没有活跃事件</p>";
    }
}

// 触发随机事件
function triggerRandomEventa() {
    if (player.nightClub.activeEvent) {
        logAction("当前已有活跃事件！", "error");
        return;
    }
    
    const randomEvent = nightClubConfig.events[Math.floor(Math.random() * nightClubConfig.events.length)];
    
    if (player.nightClub.starCoins < randomEvent.cost) {
        logAction(`星币不足！需要${randomEvent.cost}星币`, "error");
        return;
    }
    
    player.nightClub.starCoins -= randomEvent.cost;
    player.nightClub.totalSpentForBlackCard = (player.nightClub.totalSpentForBlackCard || 0) + randomEvent.cost;
    player.nightClub.activeEvent = {
        name: randomEvent.name,
        description: randomEvent.description,
        effect: randomEvent.effect,
        startTime: Date.now(),
        endTime: Date.now() + (randomEvent.effect.duration * 60 * 1000)
    };
    
    logAction(`已启动事件: ${randomEvent.name}！`, "success");
    updateNightClubUI();
    updateEventsTab();
}

// 检查店铺升级
function checkNightClubLevelUp() {
    const nextLevelExp = nightClubConfig.levelExpRequirements[player.nightClub.level - 1];
    
    if (player.nightClub.exp >= nextLevelExp && player.nightClub.level < nightClubConfig.levelExpRequirements.length) {
        player.nightClub.level++;
        player.nightClub.exp -= nextLevelExp;
        logAction(`店铺升级到Lv.${player.nightClub.level}！`, "success");
        updateNightClubUI();
    }
}

// 每分钟计算夜店收益
function calculateNightClubIncome() {
    if (!player.nightClub) return;
    // 兼容旧存档：主循环可能在 initNightClubSystem 之前调用
    if (!Array.isArray(player.nightClub.goods)) {
        if (nightClubConfig && nightClubConfig.shopGoods) {
            player.nightClub.goods = nightClubConfig.shopGoods.map(function(g) {
                return { type: g.id, stock: 0, price: g.basePrice };
            });
        } else {
            return;
        }
    }
    if (!Array.isArray(player.nightClub.staff)) player.nightClub.staff = [];
    if (!Array.isArray(player.nightClub.equipment)) player.nightClub.equipment = [];
    if (!player.nightClub.vip) player.nightClub.vip = { lastVisit: 0, nextVisit: 0 };
    
    const now = Date.now();
    const elapsedMinutes = (now - player.nightClub.lastUpdate) / (1000 * 60);
    
    if (elapsedMinutes < 1) return;
    var minutesElapsed = Math.floor(elapsedMinutes);
    
    player.nightClub.goods.forEach(good => {
        const config = nightClubConfig.shopGoods.find(c => c.id === good.type);
        if (config) good.price = config.basePrice;
    });
    
    let totalExp = 0;
    let totalCoins = 0;
    
    // 计算店员收益
    player.nightClub.staff.forEach(staff => {
        totalExp += staff.expOutput * elapsedMinutes;
        totalCoins += staff.coinsOutput * elapsedMinutes;
    });
    
    // 应用设备加成
    let bonusMultiplier = 1;
    player.nightClub.equipment.forEach(eq => {
        bonusMultiplier *= eq.bonus;
    });
    
    // 应用活动加成
    if (player.nightClub.activeEvent) {
        if (player.nightClub.activeEvent.effect.expMultiplier) {
            totalExp *= player.nightClub.activeEvent.effect.expMultiplier;
        }
        if (player.nightClub.activeEvent.effect.coinsMultiplier) {
            totalCoins *= player.nightClub.activeEvent.effect.coinsMultiplier;
        }
        
        // 检查事件是否结束
        if (now > player.nightClub.activeEvent.endTime) {
            logAction(`事件"${player.nightClub.activeEvent.name}"已结束`, "info");
            player.nightClub.activeEvent = null;
        }
    }
    
    // 幸运时刻：多档位随机触发
    var luckyCfg = nightClubConfig.luckyMoment;
    if (luckyCfg && luckyCfg.tiers && !player.nightClub.activeEvent && player.nightClub.luckyMomentEndTime < now) {
        var totalChance = (luckyCfg.totalChancePerMin || 0.025) * minutesElapsed;
        for (var lm = 0; lm < minutesElapsed; lm++) {
            if (Math.random() >= (luckyCfg.totalChancePerMin || 0.025)) continue;
            var totalW = luckyCfg.tiers.reduce(function(s, t) { return s + (t.chanceWeight || 1); }, 0);
            var r = Math.random() * totalW;
            for (var ti = 0; ti < luckyCfg.tiers.length; ti++) {
                r -= luckyCfg.tiers[ti].chanceWeight || 1;
                if (r <= 0) {
                    var tier = luckyCfg.tiers[ti];
                    player.nightClub.luckyMomentEndTime = now + (tier.durationMin || 5) * 60 * 1000;
                    player.nightClub.luckyMomentMultiplier = tier.multiplier || 2;
                    player.nightClub.luckyMomentName = tier.name || '幸运时刻';
                    logAction(tier.name + '降临！收益×' + tier.multiplier + '持续' + tier.durationMin + '分钟', 'success');
                    break;
                }
            }
            break;
        }
    }
    if (player.nightClub.luckyMomentEndTime > now) {
        var mult = player.nightClub.luckyMomentMultiplier || 1;
        if (mult > 1) { totalExp *= mult; totalCoins *= mult; }
    }
    // 豪华包厢（使用竞拍时记录的倍率）
    if (player.nightClub.vipBoxEndTime > now) {
        var boxMult = player.nightClub.vipBoxMultiplier || 1;
        if (boxMult > 1) { totalExp *= boxMult; totalCoins *= boxMult; }
    }
    // 派对主题日：小幅全加成
    if (nightClubConfig.themeDay && getThemeOfDay()) {
        totalExp *= (nightClubConfig.themeDay.bonusMatch || 1.05);
        totalCoins *= (nightClubConfig.themeDay.bonusMatch || 1.05);
    }
    // 会员等级加成（按当前达到的最高档位）
    var memberTiers = nightClubConfig.membershipTiers;
    if (memberTiers && memberTiers.length) {
        var spent = player.nightClub.totalSpentForBlackCard || 0;
        for (var mt = memberTiers.length - 1; mt >= 0; mt--) {
            if (spent >= memberTiers[mt].requiredSpend) {
                totalExp *= memberTiers[mt].bonusExp;
                totalCoins *= memberTiers[mt].bonusCoins;
                break;
            }
        }
    }
    // 收藏品
    var coll = nightClubConfig.collectibles && nightClubConfig.collectibles.items;
    var unlocked = player.nightClub.collectiblesUnlocked || [];
    if (coll) {
        coll.forEach(function(item) {
            if (unlocked.indexOf(item.id) === -1) return;
            if (item.effect && item.effect.coins) totalCoins *= item.effect.coins;
            if (item.effect && item.effect.exp) totalExp *= item.effect.exp;
        });
    }
    
    totalExp *= bonusMultiplier;
    totalCoins *= bonusMultiplier;
    
    player.nightClub.exp += totalExp;
    player.nightClub.starCoins += totalCoins;
    player.nightClub.lastUpdate = now;
    
    // AI顾客光顾：在线逐分钟模拟；离线超过3天的部分用批量售卖结算，保证离线也能售卖
    var maxVisitMinutes = 4320; // 最多逐分钟模拟3天，避免卡顿
    var visitMinutes = Math.min(minutesElapsed, maxVisitMinutes);
    for (let i = 0; i < visitMinutes; i++) {
        tryNightClubCustomerVisit();
    }
    if (minutesElapsed > maxVisitMinutes) {
        var offlineMinutes = minutesElapsed - maxVisitMinutes;
        var nc = player.nightClub;
        var lv = nc.level || 1;
        var pop = nc.popularity || 0;
        var rep = nc.reputation || 0;
        var avgCoinsPerMin = 5 * lv * (1 + pop / 1000) * (1 + rep / 500);
        var avgExpPerMin = 2 * lv * (1 + pop / 2000);
        var offlineCoins = avgCoinsPerMin * offlineMinutes * 0.5;
        var offlineExp = avgExpPerMin * offlineMinutes * 0.5;
        nc.starCoins += offlineCoins;
        nc.exp += offlineExp;
        nc.totalSold = (nc.totalSold || 0) + Math.floor(offlineMinutes * 0.4);
        if (offlineMinutes >= 60) logAction('离线售卖结算：' + Math.floor(offlineMinutes/60) + ' 小时，+' + Math.floor(offlineCoins) + '星币、+' + Math.floor(offlineExp) + '经验', 'success');
    }
    
    // 检查VIP访问
    if (now > player.nightClub.vip.nextVisit) {
        triggerVipVisit();
    }
    
    // 限时挑战结束判定
    var chal = player.nightClub.timeChallengeActive;
    if (chal) {
        var chalElapsed = (now - player.nightClub.timeChallengeStart) / (60 * 1000);
        if (chalElapsed >= chal.durationMin) {
            var prog = player.nightClub[chal.progressKey];
            if (prog >= chal.target) {
                if (chal.reward.coins) player.nightClub.starCoins += chal.reward.coins;
                if (chal.reward.popularity) player.nightClub.popularity = (player.nightClub.popularity || 0) + chal.reward.popularity;
                if (chal.reward.reputation) player.nightClub.reputation = (player.nightClub.reputation || 0) + chal.reward.reputation;
                logAction('限时挑战完成：' + chal.name + '！', 'success');
            } else {
                logAction('限时挑战失败：' + chal.name, 'info');
            }
            player.nightClub.timeChallengeActive = null;
        }
    }
    
    // 检查店铺升级
    checkNightClubLevelUp();
    
    // 更新UI（如果界面打开）- 先检查元素存在再访问，避免空引用导致卡顿/报错
    var nightClubUIEl = document.getElementById('nightClubUI');
    if (nightClubUIEl && nightClubUIEl.style.display === 'block') {
        updateNightClubUI();
        var shopEl = document.getElementById('nightClubShop');
        if (shopEl && shopEl.style.display === 'block') updateShopTab();
        var customersEl = document.getElementById('nightClubCustomers');
        if (customersEl && customersEl.style.display === 'block') updateCustomersTab();
    }
}

// 尝试一次顾客光顾：智能顾客（多类型/偏好/预算/心情/回头客/价格敏感/多件购买）
function tryNightClubCustomerVisit() {
    if (!player.nightClub || !player.nightClub.goods) return;
    var level = player.nightClub.level || 1;
    var baseChance = 0.4 + (level - 1) * 0.005;
    var pop = player.nightClub.popularity || 0;
    var rep = player.nightClub.reputation || 0;
    baseChance += Math.min(0.15, pop / 500) + Math.min(0.1, rep / 300);
    if (Math.random() > baseChance) return;
    
    var types = nightClubConfig.customerTypes.filter(function(c) {
        return (c.minLevel == null || level >= c.minLevel);
    });
    if (types.length === 0) types = nightClubConfig.customerTypes;
    var weights = types.map(function(c) {
        var w = c.weight;
        if (c.id === 'rich' || c.id === 'business') w += Math.floor(pop / 35) + Math.floor(rep / 22);
        if (c.id === 'vip' || c.id === 'influencer') w += Math.floor(pop / 50) + Math.floor(rep / 28);
        if (c.id === 'collector' || c.id === 'celebrity') w += Math.floor(pop / 80) + Math.floor(rep / 40);
        return Math.max(1, w);
    });
    var totalW = weights.reduce(function(a, b) { return a + b; }, 0);
    var r = Math.random() * totalW;
    var customer = null;
    for (var i = 0; i < types.length; i++) {
        if (r < weights[i]) { customer = types[i]; break; }
        r -= weights[i];
    }
    if (!customer) customer = types[0];
    var mysteryCfg = nightClubConfig.mysteryGuest;
    var mysteryGuestType = null;
    if (mysteryCfg && mysteryCfg.guests && mysteryCfg.guests.length && level >= (mysteryCfg.minLevel || 3)) {
        var chance = mysteryCfg.chanceBase != null ? mysteryCfg.chanceBase : 0.03;
        if (Math.random() < chance) {
            var gTotal = mysteryCfg.guests.reduce(function(s, g) { return s + (g.weight || 1); }, 0);
            var gr = Math.random() * gTotal;
            for (var gi = 0; gi < mysteryCfg.guests.length; gi++) {
                gr -= mysteryCfg.guests[gi].weight || 1;
                if (gr <= 0) { mysteryGuestType = mysteryCfg.guests[gi]; break; }
            }
            if (!mysteryGuestType) mysteryGuestType = mysteryCfg.guests[0];
        }
    }
    var isMysteryGuest = !!mysteryGuestType;
    
    var mood = 0.72 + Math.random() * 0.48;
    var preferCat = customer.preferCategory || 'any';
    var isReturning = Math.random() < 0.12 + rep / 600;
    var cats = ['drink', 'snack', 'vip'];
    var wantedCategory = (preferCat === 'any') ? cats[Math.floor(Math.random() * 3)] : preferCat;
    // 非「任意」型顾客也会偶尔改主意，更像真人
    if (preferCat !== 'any' && Math.random() < 0.32) {
        wantedCategory = cats[Math.floor(Math.random() * 3)];
    }
    var priceSensitive = customer.priceSensitive != null ? customer.priceSensitive : 0.3;
    var maxQtyPerItem = Math.max(1, customer.maxQtyPerItem || 1);
    var spendPowerEarly = (customer.coinMul || 1) * 0.55 + (customer.budgetRatio || 1) * 0.45 + (customer.preferHigh || 0) * 2.1 + (1 - (customer.priceSensitive != null ? customer.priceSensitive : 0.35)) * 0.75;
    var tierEarly = Math.min(5.8, Math.max(0.45, spendPowerEarly));
    // 本轮可买几种货：先扫一批酒再配小吃很常见，上限放宽
    var maxSkuThisVisit = Math.min(18, 3 + Math.floor(Math.random() * 9) + (tierEarly > 2.2 ? Math.floor(Math.random() * 5) : 0));
    var impulseVisitor = Math.random() < (0.12 + mood * 0.14);
    
    var goodsWithConfig = player.nightClub.goods.map(function(g) {
        var cfg = nightClubConfig.shopGoods.find(function(c) { return c.id === g.type; });
        return cfg ? { good: g, config: cfg } : null;
    }).filter(Boolean).filter(function(x) { return x.good.stock > 0; });
    // 打乱顺序，避免总是先扣预算在列表前段的商品上，导致末尾几条（多为高价）长期卖不动
    var visitOrder = goodsWithConfig.slice();
    for (var sh = visitOrder.length - 1; sh > 0; sh--) {
        var shj = Math.floor(Math.random() * (sh + 1));
        var sht = visitOrder[sh];
        visitOrder[sh] = visitOrder[shj];
        visitOrder[shj] = sht;
    }
    
    var prices = goodsWithConfig.map(function(x) { return x.good.price; });
    var maxPrice = prices.length ? Math.max.apply(null, prices.concat([1])) : 1;
    var medPrice = maxPrice;
    if (prices.length > 1) {
        var sp = prices.slice().sort(function(a, b) { return a - b; });
        medPrice = sp[Math.floor((sp.length - 1) / 2)];
    } else if (prices.length === 1) {
        medPrice = prices[0];
    }
    // 智能预算：与货架现价、等级、人气挂钩，避免「店里全是贵价货但顾客永远只有几百块」
    var rawBudget = (customer.coinMul * 80) * (customer.budgetRatio || 1) * (0.75 + Math.random() * 0.55);
    var spendPower = (customer.coinMul || 1) * 0.55 + (customer.budgetRatio || 1) * 0.45 + (customer.preferHigh || 0) * 2.1 + (1 - (customer.priceSensitive != null ? customer.priceSensitive : 0.35)) * 0.75;
    var tier = Math.min(5.8, Math.max(0.45, spendPower));
    var shopFloor = maxPrice * (0.09 + tier * 0.052 + Math.random() * 0.11) + medPrice * (0.1 + Math.random() * 0.14);
    shopFloor += (level - 1) * 22 + Math.min(900, pop * 0.07) + Math.min(700, rep * 0.055);
    if (wantedCategory === 'vip') shopFloor += maxPrice * (0.06 + Math.random() * 0.1);
    if (maxPrice > rawBudget * 2.5) {
        shopFloor = Math.max(shopFloor, maxPrice * (0.28 + tier * 0.06 + Math.random() * 0.12));
        shopFloor = Math.max(shopFloor, maxPrice * Math.min(1.08, 0.38 + tier * 0.12 + Math.random() * 0.14));
    }
    var budget = Math.max(rawBudget, shopFloor);
    var shopCeil = maxPrice * (1.02 + tier * 0.38 + Math.min(0.55, level * 0.038) + Math.min(0.3, pop / 2200));
    budget = Math.min(budget, shopCeil * (0.9 + Math.random() * 0.22));
    // 至少够买 1 件最高价（例如单价 5000），下限用 1.0 倍起，避免 0.88×max 永远差一截
    if (Math.random() < 0.14 + (customer.preferHigh || 0) * 0.2 + (wantedCategory === 'vip' ? 0.1 : 0)) {
        budget = Math.max(budget, maxPrice * (1.0 + Math.random() * 0.35));
    }
    if (maxPrice >= 1500 && Math.random() < 0.1 + tier * 0.035) {
        budget = Math.max(budget, maxPrice * (1.0 + Math.random() * 0.28));
    }
    var jitterMul = 0.92 + Math.random() * 0.16;
    var preJ = budget;
    budget = preJ * jitterMul;
    if (preJ >= maxPrice && budget < maxPrice) budget = maxPrice * (0.98 + Math.random() * 0.06);
    if (preJ >= maxPrice * 1.2) budget = Math.max(budget, maxPrice);
    // 大客户现金包：土豪/VIP/明星等带「几十万」量级预算也合理（与货架价联动，并封顶防溢出）
    var whaleBoost = 0;
    switch (customer.id) {
        case 'celebrity': whaleBoost = 2.85; break;
        case 'vip': whaleBoost = 2.25; break;
        case 'rich': whaleBoost = 1.75; break;
        case 'collector': whaleBoost = 1.15; break;
        case 'business': whaleBoost = 0.95; break;
        case 'influencer': whaleBoost = 0.72; break;
        default: whaleBoost = 0;
    }
    if (whaleBoost > 0) {
        var wMix = 0.5 + Math.random() * 1.05;
        budget += medPrice * (5 + Math.random() * 22) * whaleBoost * wMix;
        budget += maxPrice * (3 + Math.random() * 26) * whaleBoost * wMix;
        budget += (12000 + Math.random() * 420000) * whaleBoost * wMix;
    }
    if (customer.id === 'party' || customer.id === 'drunk') {
        budget += medPrice * (1.2 + Math.random() * 5) + maxPrice * (0.25 + Math.random() * 1.35);
    }
    if (isMysteryGuest && mysteryGuestType) budget *= 1.08 + Math.random() * 0.15;
    budget = Math.min(budget, 1800000);
    var bought = [];
    var earnedCoins = 0;
    var earnedExp = 0;
    var wantedOutOfStock = false;
    var wantedGoods = goodsWithConfig.filter(function(x) { return x.config.category === wantedCategory; });
    if (isReturning && wantedGoods.length === 0 && goodsWithConfig.length > 0) wantedOutOfStock = true;
    
    for (var idx = 0; idx < visitOrder.length; idx++) {
        var x = visitOrder[idx];
        var good = x.good;
        var config = x.config;
        if (good.stock <= 0) continue;
        if (bought.length >= maxSkuThisVisit) break;
        var priceRatio = good.price / maxPrice;
        var appealFactor = (config.appeal || 0.5) * (customer.buyDesire || 0.5) * mood;
        var highBonus = (customer.preferHigh || 0) * priceRatio * 0.8;
        var categoryMatch = (config.category === wantedCategory || preferCat === 'any') ? 1.35 : 0.88;
        if (isReturning && config.category === wantedCategory) categoryMatch = 1.65;
        // 冲动型/逛店：品类匹配放宽，更容易随机买到「本来不主打」的货
        if (impulseVisitor) {
            categoryMatch = 0.92 + (config.category === wantedCategory ? 0.35 : 0.2) + Math.random() * 0.15;
        }
        var budgetOk = (good.price <= budget);
        var overBudgetRatio = budget > 0 ? good.price / budget : 2;
        var pricePenalty = priceSensitive * (overBudgetRatio > 1 ? Math.min(0.7, (overBudgetRatio - 1) * 0.5) : 0);
        var buyChance = appealFactor * (1 + highBonus) * categoryMatch * (budgetOk ? 1 : (0.55 - pricePenalty));
        buyChance += Math.random() * 0.22 * mood;
        if (Math.random() < 0.07 + mood * 0.06) buyChance += 0.08 + Math.random() * 0.2;
        buyChance = Math.min(0.94, buyChance);
        if (Math.random() > buyChance) continue;
        var splurge = Math.random() < 0.22 ? (2 + Math.floor(Math.random() * 6)) : 0;
        var perItemCap = maxQtyPerItem + splurge;
        if (config.category === 'drink') {
            var drinkBinge = (customer.id === 'drunk' || customer.id === 'party' || (preferCat === 'drink' && Math.random() < 0.52));
            var drinkCap = drinkBinge ? (18 + Math.floor(Math.random() * 42)) : (5 + Math.floor(Math.random() * 24));
            if (wantedCategory === 'drink') drinkCap += 4 + Math.floor(Math.random() * 14);
            perItemCap = Math.max(perItemCap, drinkCap);
        } else if (config.category === 'snack') {
            perItemCap = Math.max(perItemCap, 4 + Math.floor(Math.random() * 16));
        } else {
            perItemCap = Math.max(perItemCap, 2 + Math.floor(Math.random() * 14) + ((customer.preferHigh || 0) > 0.45 ? Math.floor(Math.random() * 8) : 0));
        }
        perItemCap = Math.min(perItemCap, 99, good.stock, Math.max(1, Math.floor(budget / good.price)));
        var maxBuy = perItemCap;
        if (maxBuy < 1) continue;
        var qty;
        if (maxBuy <= 1) {
            qty = 1;
        } else if (config.category === 'drink' && maxBuy >= 10 && (customer.id === 'drunk' || customer.id === 'party') && Math.random() < 0.48) {
            qty = Math.max(6, Math.min(maxBuy, Math.floor(maxBuy * (0.32 + Math.random() * 0.68))));
        } else {
            var qRoll = Math.random();
            if (qRoll < 0.26) {
                qty = 1 + Math.floor(Math.random() * Math.min(3, maxBuy));
            } else if (qRoll < 0.7) {
                qty = Math.floor(Math.random() * maxBuy) + 1;
            } else {
                qty = Math.max(1, Math.ceil(Math.pow(Math.random(), 0.4) * maxBuy));
            }
            qty = Math.min(qty, maxBuy);
        }
        if (qty <= 0) continue;
        good.stock -= qty;
        var coins = Math.floor(good.price * qty * customer.coinMul);
        var exp = Math.floor(3 * qty * customer.expMul * (1 + level * 0.1));
        earnedCoins += coins;
        earnedExp += exp;
        budget -= good.price * qty;
        bought.push({ name: config.name, qty: qty, coins: coins });
        player.nightClub.totalSold = (player.nightClub.totalSold || 0) + qty;
        player.nightClub.dailySold = (player.nightClub.dailySold || 0) + qty;
    }
    if (isMysteryGuest && mysteryGuestType) {
        var mul = mysteryGuestType.multiplier || 5;
        earnedCoins = Math.floor(earnedCoins * mul);
        earnedExp = Math.floor(earnedExp * mul);
    }
    
    if (wantedOutOfStock) {
        player.nightClub.reputation = Math.max(0, (player.nightClub.reputation || 0) - 0.5);
    }
    if (customer.id === 'vip' || customer.id === 'celebrity') {
        player.nightClub.totalVipVisits = (player.nightClub.totalVipVisits || 0) + 1;
        player.nightClub.dailyVipCount = (player.nightClub.dailyVipCount || 0) + 1;
    }
    player.nightClub.dailyCustomerCount = (player.nightClub.dailyCustomerCount || 0) + 1;
    if (isReturning) player.nightClub.dailyReturnCount = (player.nightClub.dailyReturnCount || 0) + 1;
    player.nightClub.starCoins += earnedCoins;
    player.nightClub.exp += earnedExp;
    player.nightClub.todayEarnedCoins = (player.nightClub.todayEarnedCoins || 0) + earnedCoins;
    player.nightClub.dailyEarnedCoins = (player.nightClub.dailyEarnedCoins || 0) + earnedCoins;
    
    var logEntry = {
        time: Date.now(),
        customerName: (isMysteryGuest && mysteryGuestType ? '【' + mysteryGuestType.name + '】' : '') + customer.name + (isReturning ? '(回头客)' : ''),
        bought: bought,
        totalCoins: earnedCoins,
        totalExp: earnedExp
    };
    player.nightClub.customerLog = player.nightClub.customerLog || [];
    player.nightClub.customerLog.push(logEntry);
    if (player.nightClub.customerLog.length > 25) player.nightClub.customerLog.shift();
    
    if (player.nightClub.timeChallengeActive) {
        var soldQty = bought.reduce(function(a, b) { return a + b.qty; }, 0);
        player.nightClub.challengeSold = (player.nightClub.challengeSold || 0) + soldQty;
        player.nightClub.challengeEarned = (player.nightClub.challengeEarned || 0) + earnedCoins;
        if (customer.id === 'vip' || customer.id === 'celebrity') player.nightClub.challengeVip = (player.nightClub.challengeVip || 0) + 1;
    }
    
    if (bought.length > 0) {
        logAction((isMysteryGuest && mysteryGuestType ? mysteryGuestType.name + ' ' : '') + (isReturning ? '回头客' : '') + customer.name + '光顾消费！+' + earnedCoins + '星币、+' + earnedExp + '经验', 'success');
    }
    nightClubCheckAchievements();
}

function nightClubCheckAchievements() {
    if (!player.nightClub || !nightClubConfig.achievements) return;
    var list = player.nightClub.achievements || [];
    nightClubConfig.achievements.forEach(function(a) {
        if (list.indexOf(a.id) !== -1) return;
        if (typeof a.cond !== 'function' || !a.cond(player)) return;
        list.push(a.id);
        if (a.reward.coins) player.nightClub.starCoins += a.reward.coins;
        if (a.reward.popularity) player.nightClub.popularity = (player.nightClub.popularity || 0) + a.reward.popularity;
        if (a.reward.reputation) player.nightClub.reputation = (player.nightClub.reputation || 0) + a.reward.reputation;
        player.nightClub.achievements = list;
        logAction('夜店成就：' + a.name + '！', 'success');
    });
}

function doNightClubCheckIn() {
    if (!player.nightClub) return;
    var today = new Date().getDate();
    if (player.nightClub.checkInLastDay === today) {
        logAction('今日已签到过！', 'error');
        return;
    }
    player.nightClub.checkInLastDay = today;
    player.nightClub.starCoins += 8000;
    player.nightClub.popularity = (player.nightClub.popularity || 0) + 3;
    logAction('夜店签到成功！+8000星币，+3人气', 'success');
    updateNightClubUI();
}

function openNightClubDailyModal() {
    nightClubResetDailyIfNeeded();
    var listEl = document.getElementById('nightClubDailyTaskList');
    if (!listEl) return;
    var claimed = player.nightClub.dailyTaskClaimed || {};
    var html = '';
    (nightClubConfig.dailyTasks || []).forEach(function(t) {
        var prog = player.nightClub[t.progressKey] || 0;
        if (t.progressKey === 'dailyEarnedCoins') prog = player.nightClub.todayEarnedCoins || player.nightClub.dailyEarnedCoins || 0;
        var done = prog >= t.target;
        if (done && !claimed[t.id]) {
            if (t.reward.coins) player.nightClub.starCoins += t.reward.coins;
            if (t.reward.popularity) player.nightClub.popularity = (player.nightClub.popularity || 0) + t.reward.popularity;
            if (t.reward.reputation) player.nightClub.reputation = (player.nightClub.reputation || 0) + t.reward.reputation;
            claimed[t.id] = true;
            logAction('每日任务完成：' + t.name, 'success');
        }
        player.nightClub.dailyTaskClaimed = claimed;
        var rewardText = (t.reward.coins ? t.reward.coins + '星币 ' : '') + (t.reward.popularity ? '人气+' + t.reward.popularity : '') + (t.reward.reputation ? '口碑+' + t.reward.reputation : '');
        html += '<div style="background: #252535; border-radius: 8px; padding: 10px; margin-bottom: 8px; border-left: 4px solid ' + (done ? '#4CAF50' : '#555') + ';">';
        html += '<div style="color: #e0e0e0;">' + t.name + '</div>';
        html += '<div style="font-size: 11px; color: #888;">' + prog + '/' + t.target + ' · 奖励: ' + rewardText + '</div>';
        if (done) html += '<div style="font-size: 11px; color: #4CAF50;">已' + (claimed[t.id] ? '领取' : '完成') + '</div>';
        html += '</div>';
    });
    listEl.innerHTML = html || '<p style="color: #888;">暂无每日任务</p>';
    document.getElementById('nightClubDailyModal').style.display = 'flex';
    updateNightClubUI();
}

function nightClubClaimDailyRewards() {
    if (!player.nightClub || !nightClubConfig.dailyTasks) return;
    nightClubConfig.dailyTasks.forEach(function(t) {
        var prog = player.nightClub[t.progressKey] || 0;
        if (prog < t.target) return;
        if (t.reward.coins) player.nightClub.starCoins += t.reward.coins;
        if (t.reward.popularity) player.nightClub.popularity = (player.nightClub.popularity || 0) + t.reward.popularity;
        if (t.reward.reputation) player.nightClub.reputation = (player.nightClub.reputation || 0) + t.reward.reputation;
    });
}

function openNightClubWheelModal() {
    document.getElementById('nightClubWheelModal').style.display = 'flex';
    document.getElementById('nightClubWheelResult').textContent = '';
}

function spinNightClubWheel() {
    if (!player.nightClub) return;
    if (player.nightClub.starCoins < 5000) {
        logAction('星币不足 5000！', 'error');
        return;
    }
    player.nightClub.starCoins -= 5000;
    player.nightClub.totalSpentForBlackCard = (player.nightClub.totalSpentForBlackCard || 0) + 5000;
    var rewards = nightClubConfig.wheelRewards || [];
    var r = rewards[Math.floor(Math.random() * rewards.length)];
    if (r.type === 'coins') player.nightClub.starCoins += r.value;
    if (r.type === 'popularity') player.nightClub.popularity = (player.nightClub.popularity || 0) + r.value;
    if (r.type === 'reputation') player.nightClub.reputation = (player.nightClub.reputation || 0) + r.value;
    if (r.type === 'exp') player.nightClub.exp += r.value;
    document.getElementById('nightClubWheelResult').textContent = '获得：' + r.text;
    logAction('夜店轮盘：' + r.text, 'success');
    updateNightClubUI();
}

function openNightClubPromoModal() {
    var listEl = document.getElementById('nightClubPromoList');
    if (!listEl) return;
    var html = '';
    (nightClubConfig.promotions || []).forEach(function(p) {
        var can = player.nightClub.starCoins >= p.cost;
        html += '<div style="background: #252535; border-radius: 8px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">';
        html += '<div><strong style="color: #e0e0e0;">' + p.name + '</strong><br><span style="font-size: 11px; color: #888;">' + p.desc + '</span></div>';
        html += '<button onclick="doNightClubPromo(\'' + p.id + '\'); document.getElementById(\'nightClubPromoModal\').style.display=\'none\'" style="background: ' + (can ? '#e65100' : '#555') + '; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;" ' + (can ? '' : 'disabled') + '>' + p.cost + '✨</button>';
        html += '</div>';
    });
    listEl.innerHTML = html || '<p style="color: #888;">暂无促销</p>';
    document.getElementById('nightClubPromoModal').style.display = 'flex';
}

function doNightClubPromo(id) {
    var p = nightClubConfig.promotions && nightClubConfig.promotions.find(function(x) { return x.id === id; });
    if (!p || player.nightClub.starCoins < p.cost) return;
    player.nightClub.starCoins -= p.cost;
    player.nightClub.totalSpentForBlackCard = (player.nightClub.totalSpentForBlackCard || 0) + p.cost;
    if (p.effect.popularity) player.nightClub.popularity = (player.nightClub.popularity || 0) + p.effect.popularity;
    if (p.effect.reputation) player.nightClub.reputation = (player.nightClub.reputation || 0) + p.effect.reputation;
    player.nightClub.activePromo = { id: p.id, endTime: Date.now() + p.duration * 60 * 1000 };
    logAction('促销已开启：' + p.name, 'success');
    updateNightClubUI();
}


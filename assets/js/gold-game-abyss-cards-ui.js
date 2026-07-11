// 深渊界面
function toggleAbyssTower() {
      if (player.reincarnationCount < 50) {
        alert("需要达到50转才能开启无限深渊！");
        return;
    }
    var overlay = document.getElementById('abyssTowerOverlay');
    var ui = document.getElementById('abyssTowerUI');
    var fsRoot = document.getElementById('abyssTowerFullscreenRoot');
    if (overlay.style.display === 'none' || !overlay.style.display) {
        if (fsRoot) fsRoot.style.display = 'block';
        overlay.style.display = 'block';
        ui.style.display = 'block';
        if (typeof stopAbyssAutoAttack === 'function') stopAbyssAutoAttack();
        refreshAbyssTowerUI();
        // 延后执行联网校验，避免打开面板时与后端请求、回调挤在同一帧导致卡顿
        if (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken()) {
            var at = getAbyssTower();
            setTimeout(function() {
                if (typeof goldGameCheckAbyssCurrency === 'function') goldGameCheckAbyssCurrency(at.exclusiveCurrency || 0);
                if (typeof goldGameCheckAbyssVault === 'function') {
                    var vault = at.abyssVault || {};
                    var vaultTotal = Object.keys(vault).reduce(function(s, id) { return s + (parseInt(vault[id], 10) || 0); }, 0);
                    goldGameCheckAbyssVault(vaultTotal);
                }
            }, 0);
        }
    } else {
        if (typeof stopAbyssAutoAttack === 'function') stopAbyssAutoAttack();  // 隐藏时停止自动攻击定时器，防止内存泄漏
        abyssTowerExitFullscreenIfNeeded(fsRoot);
        overlay.style.display = 'none';
        ui.style.display = 'none';
        if (fsRoot) fsRoot.style.display = 'none';
    }
}

function abyssTowerIsFullscreenEl(el) {
    if (!el) return false;
    return document.fullscreenElement === el || document.webkitFullscreenElement === el || document.mozFullScreenElement === el || document.msFullscreenElement === el;
}

/** 全屏时取消 #abyssTowerUI 的窗口限高/滚条（内联已移除，此处用 !important 兜底） */
function abyssSyncTowerUiScrollStyles() {
    var root = document.getElementById('abyssTowerFullscreenRoot');
    var ui = document.getElementById('abyssTowerUI');
    if (!ui) return;
    if (root && typeof abyssTowerIsFullscreenEl === 'function' && abyssTowerIsFullscreenEl(root)) {
        ui.style.setProperty('max-height', 'none', 'important');
        ui.style.setProperty('overflow', 'visible', 'important');
        ui.style.setProperty('overflow-x', 'visible', 'important');
        ui.style.setProperty('overflow-y', 'visible', 'important');
    } else {
        ui.style.removeProperty('max-height');
        ui.style.removeProperty('overflow');
        ui.style.removeProperty('overflow-x');
        ui.style.removeProperty('overflow-y');
    }
}

/** 全屏：主界面整块「装进一屏」— scale = min(视口/宽, 视口/内容高)。优先用 zoom 缩放（参与布局尺寸，避免全屏根出现「缩放前高度」的滚条）；否则用 transform scale + --abyss-fs-scale */
function abyssUpdateFullscreenZoomScale() {
    var root = document.getElementById('abyssTowerFullscreenRoot');
    var ui = document.getElementById('abyssTowerUI');
    if (!root) return;
    if (!abyssTowerIsFullscreenEl(root)) {
        root.style.removeProperty('--abyss-fs-scale');
        try { root.style.removeProperty('overflow'); } catch (eO) {}
        if (ui) {
            try { ui.style.removeProperty('zoom'); } catch (eZ) {}
        }
        abyssSyncTowerUiScrollStyles();
        return;
    }
    if (!ui || ui.style.display === 'none') return;
    abyssSyncTowerUiScrollStyles();
    var w = root.clientWidth || (typeof window.innerWidth === 'number' ? window.innerWidth : 1200);
    var h = root.clientHeight || (typeof window.innerHeight === 'number' ? window.innerHeight : 800);
    if (w < 8 || h < 8) return;
    try { ui.style.removeProperty('zoom'); } catch (eZ) {}
    var designW = 1200;
    var nw = Math.max(ui.offsetWidth || 0, designW);
    if (nw < designW) nw = designW;
    var nh = Math.max(ui.scrollHeight || 0, ui.offsetHeight || 0, 320);
    var pad = 12;
    var sW = (w - pad) / nw;
    var sH = (h - pad) / nh;
    var s = Math.min(sW, sH);
    if (s > 2.5) s = 2.5;
    if (s < 0.12) s = 0.12;
    var useZoom = false;
    try { useZoom = !!(ui.style && 'zoom' in ui.style); } catch (e) {}
    if (useZoom) {
        root.style.setProperty('--abyss-fs-scale', '1');
        try { ui.style.setProperty('zoom', String(s), 'important'); } catch (e2) { root.style.setProperty('--abyss-fs-scale', String(s)); }
    } else {
        try { ui.style.removeProperty('zoom'); } catch (e3) {}
        root.style.setProperty('--abyss-fs-scale', String(s));
    }
    try {
        if (useZoom && ui.style.getPropertyValue('zoom')) root.style.setProperty('overflow', 'clip', 'important');
        else root.style.setProperty('overflow', 'visible', 'important');
    } catch (eR) {}
}

/** 战斗 UI 刷新后合并到下一帧再量高度，避免 scrollHeight 未稳定 */
function abyssScheduleFullscreenZoomScale() {
    var root = document.getElementById('abyssTowerFullscreenRoot');
    if (!root || typeof abyssTowerIsFullscreenEl !== 'function' || !abyssTowerIsFullscreenEl(root)) return;
    if (abyssScheduleFullscreenZoomScale._raf) cancelAnimationFrame(abyssScheduleFullscreenZoomScale._raf);
    abyssScheduleFullscreenZoomScale._raf = requestAnimationFrame(function() {
        abyssScheduleFullscreenZoomScale._raf = null;
        if (typeof abyssUpdateFullscreenZoomScale === 'function') abyssUpdateFullscreenZoomScale();
        requestAnimationFrame(function() {
            if (typeof abyssUpdateFullscreenZoomScale === 'function') abyssUpdateFullscreenZoomScale();
        });
    });
}

function abyssTowerExitFullscreenIfNeeded(el) {
    if (!el || !abyssTowerIsFullscreenEl(el)) return;
    try {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    } catch (eFs) {}
    var fsb = document.getElementById('abyssTowerFullscreenBtn');
    if (fsb) fsb.textContent = '全屏';
    if (el) {
        el.style.removeProperty('--abyss-fs-scale');
        try { el.style.removeProperty('overflow'); } catch (eO) {}
    }
    var ui = document.getElementById('abyssTowerUI');
    if (ui) {
        try { ui.style.removeProperty('zoom'); } catch (eZ) {}
        try {
            ui.style.removeProperty('max-height');
            ui.style.removeProperty('overflow');
            ui.style.removeProperty('overflow-x');
            ui.style.removeProperty('overflow-y');
        } catch (eS) {}
    }
    setTimeout(function () {
        if (typeof abyssSyncTowerUiScrollStyles === 'function') abyssSyncTowerUiScrollStyles();
    }, 0);
}

function toggleAbyssTowerFullscreen() {
    var el = document.getElementById('abyssTowerFullscreenRoot');
    var btn = document.getElementById('abyssTowerFullscreenBtn');
    if (!el) return;
    try {
        if (abyssTowerIsFullscreenEl(el)) {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
        } else {
            var req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            if (req) req.call(el);
        }
    } catch (eFs) {}
    setTimeout(function () {
        if (!btn) return;
        btn.textContent = abyssTowerIsFullscreenEl(el) ? '退出全屏' : '全屏';
        if (typeof abyssUpdateFullscreenZoomScale === 'function') abyssUpdateFullscreenZoomScale();
        requestAnimationFrame(function () {
            if (typeof abyssUpdateFullscreenZoomScale === 'function') abyssUpdateFullscreenZoomScale();
        });
    }, 0);
}

document.addEventListener('fullscreenchange', function () {
    var el = document.getElementById('abyssTowerFullscreenRoot');
    var btn = document.getElementById('abyssTowerFullscreenBtn');
    if (!btn || !el) return;
    btn.textContent = abyssTowerIsFullscreenEl(el) ? '退出全屏' : '全屏';
    if (typeof abyssUpdateFullscreenZoomScale === 'function') abyssUpdateFullscreenZoomScale();
    requestAnimationFrame(function () {
        if (typeof abyssUpdateFullscreenZoomScale === 'function') abyssUpdateFullscreenZoomScale();
    });
});
document.addEventListener('webkitfullscreenchange', function () {
    var el = document.getElementById('abyssTowerFullscreenRoot');
    var btn = document.getElementById('abyssTowerFullscreenBtn');
    if (!btn || !el) return;
    btn.textContent = abyssTowerIsFullscreenEl(el) ? '退出全屏' : '全屏';
    if (typeof abyssUpdateFullscreenZoomScale === 'function') abyssUpdateFullscreenZoomScale();
    requestAnimationFrame(function () {
        if (typeof abyssUpdateFullscreenZoomScale === 'function') abyssUpdateFullscreenZoomScale();
    });
});
document.addEventListener('mozfullscreenchange', function () {
    var el = document.getElementById('abyssTowerFullscreenRoot');
    var btn = document.getElementById('abyssTowerFullscreenBtn');
    if (!btn || !el) return;
    btn.textContent = abyssTowerIsFullscreenEl(el) ? '退出全屏' : '全屏';
    if (typeof abyssUpdateFullscreenZoomScale === 'function') abyssUpdateFullscreenZoomScale();
    requestAnimationFrame(function () {
        if (typeof abyssUpdateFullscreenZoomScale === 'function') abyssUpdateFullscreenZoomScale();
    });
});

if (!window._abyssFullscreenZoomResizeBound) {
    window._abyssFullscreenZoomResizeBound = true;
    window.addEventListener('resize', function () {
        var r = document.getElementById('abyssTowerFullscreenRoot');
        if (!r || typeof abyssTowerIsFullscreenEl !== 'function' || !abyssTowerIsFullscreenEl(r)) return;
        clearTimeout(window._abyssFullscreenZoomResizeTimer);
        window._abyssFullscreenZoomResizeTimer = setTimeout(function () {
            if (typeof abyssUpdateFullscreenZoomScale === 'function') abyssUpdateFullscreenZoomScale();
        }, 80);
    });
}

/** 无限深渊：释放 UI 定时器/缓存，避免关闭面板或结束闯关后残留 */
function abyssTeardownUiTimers() {
    if (typeof stopAbyssAutoAttack === 'function') stopAbyssAutoAttack();
    if (updateAbyssRunUI._pending) { clearTimeout(updateAbyssRunUI._pending); updateAbyssRunUI._pending = null; }
    updateAbyssRunUI._rafScheduled = false;
    updateAbyssRunUI._rafAgain = false;
    updateAbyssRunUI._lastRun = 0;
    if (updateAbyssRunUI._el) updateAbyssRunUI._el = null;
    updateAbyssRunUI._monsterSignature = null;
    updateAbyssRunUI._beastSignature = null;
    if (abyssDeferUpdate._raf) { try { window.cancelAnimationFrame(abyssDeferUpdate._raf); } catch (e) {} abyssDeferUpdate._raf = null; }
    if (typeof abyssAttackReleaseLock === 'function') abyssAttackReleaseLock();
    if (typeof _abyssLogBuffer !== 'undefined') _abyssLogBuffer.length = 0;
    if (window._abyssFullscreenZoomResizeTimer) {
        clearTimeout(window._abyssFullscreenZoomResizeTimer);
        window._abyssFullscreenZoomResizeTimer = null;
    }
}

function closeAbyssTower() {
    abyssTeardownUiTimers();
    if (typeof closeAbyssRunSpeciesCodexView === 'function') closeAbyssRunSpeciesCodexView();
    var fsRoot = document.getElementById('abyssTowerFullscreenRoot');
    abyssTowerExitFullscreenIfNeeded(fsRoot);
    document.getElementById('abyssTowerOverlay').style.display = 'none';
    document.getElementById('abyssTowerUI').style.display = 'none';
    if (fsRoot) fsRoot.style.display = 'none';
}

function refreshAbyssTowerUI() {
    var at = getAbyssTower();
    document.getElementById('abyssExclusiveCurrency').textContent = (at.exclusiveCurrency || 0);
    document.getElementById('abyssBestFloor').textContent = (at.bestFloor || 0);
    var sgEl = document.getElementById('abyssStartGearCount');
    if (sgEl) sgEl.textContent = Math.min(20, at.startGearCount || 0);
    var pName = (typeof player !== 'undefined' && player && player.name) ? player.name : '勇者';
    var pAvatar = (typeof player !== 'undefined' && player && player.avatar) ? player.avatar : '';
    var nameEl = document.getElementById('abyssPlayerName');
    var avatarEl = document.getElementById('abyssPlayerAvatar');
    var placeholderEl = document.getElementById('abyssPlayerAvatarPlaceholder');
    if (nameEl) nameEl.textContent = pName;
    if (avatarEl && placeholderEl) {
        if (pAvatar) {
            avatarEl.src = pAvatar;
            avatarEl.style.display = '';
            placeholderEl.style.display = 'none';
        } else {
            avatarEl.src = '';
            avatarEl.style.display = 'none';
            placeholderEl.style.display = 'flex';
            placeholderEl.textContent = (pName && pName.length > 0) ? pName.charAt(0) : '?';
        }
    }
    var running = abyssRun && abyssRun.active;
    if (!running && typeof stopAbyssAutoAttack === 'function') stopAbyssAutoAttack();
    document.getElementById('abyssStartPanel').style.display = running ? 'none' : 'block';
    document.getElementById('abyssRunPanel').style.display = running ? 'block' : 'none';
    var escapeBtn = document.getElementById('abyssEscapeBtn');
    if (escapeBtn) escapeBtn.style.display = running ? 'inline-block' : 'none';
    if (!running) abyssSelectClass(abyssSelectedClass || 'warrior');
    if (running) {
        // 延迟到下一帧再刷新战斗 UI，避免打开面板时主线程长时间阻塞导致点击无响应
        requestAnimationFrame(function() { updateAbyssRunUI(); });
    }
    if (typeof abyssUpdateFullscreenZoomScale === 'function') {
        requestAnimationFrame(function() { abyssUpdateFullscreenZoomScale(); });
    }
}

function abyssSelectClass(classId) {
    abyssSelectedClass = classId;
    var descEl = document.getElementById('abyssClassDesc');
    if (descEl) {
        var c = ABYSS_CLASSES.find(function(x) { return x.id === classId; });
        descEl.textContent = c ? c.desc : '';
    }
    var ids = ['Warrior','Mage','Archer','Tamer','Onmyoji','Mechanic','Jester','Riftbinder'];
    var map = { warrior: 'Warrior', mage: 'Mage', archer: 'Archer', tamer: 'Tamer', onmyoji: 'Onmyoji', mechanic: 'Mechanic', jester: 'Jester', riftbinder: 'Riftbinder' };
    ids.forEach(function(cap) {
        var btn = document.getElementById('abyssClass' + cap);
        if (btn) {
            var id = cap.toLowerCase();
            btn.style.borderWidth = (id === classId) ? '3px' : '2px';
            btn.style.boxShadow = (id === classId) ? '0 0 12px rgba(255,215,0,0.6)' : 'none';
        }
    });
}

function abyssShowBranchSelection() {
    if (!abyssRun || !abyssRun.active || abyssRun.classBranch) return;
    var classId = abyssRun.playerClass || 'warrior';
    var info = ABYSS_BRANCH_INFO[classId];
    if (!info) return;
    var descEl = document.getElementById('abyssBranchDesc');
    if (descEl) {
        var a = info.branchA ? info.branchA.name + '</b><br/><span style="color:#aaa;">' + info.branchA.desc : '';
        var b = info.branchB ? info.branchB.name + '</b><br/><span style="color:#aaa;">' + info.branchB.desc : '';
        var c = info.branchC ? info.branchC.name + '</b><br/><span style="color:#aaa;">' + info.branchC.desc : '';
        var d = info.branchD ? info.branchD.name + '</b><br/><span style="color:#aaa;">' + info.branchD.desc : '';
        descEl.innerHTML = '<div style="margin-bottom:6px;"><b style="color:#ff6b6b;">分支A · ' + a + '</span></div><div style="margin-bottom:6px;"><b style="color:#42a5f5;">分支B · ' + b + '</span></div><div style="margin-bottom:6px;"><b style="color:#4caf50;">分支C · ' + c + '</span></div><div><b style="color:#9c27b0;">分支D · ' + d + '</span></div>';
    }
    document.getElementById('abyssBranchOverlay').style.display = 'block';
    document.getElementById('abyssBranchUI').style.display = 'block';
    var btnA = document.getElementById('abyssBranchABtn'); var btnB = document.getElementById('abyssBranchBBtn'); var btnC = document.getElementById('abyssBranchCBtn'); var btnD = document.getElementById('abyssBranchDBtn');
    if (btnA) { btnA.onclick = function() { abyssChooseBranch('branchA'); }; btnA.textContent = (info.branchA ? info.branchA.name : '分支A'); }
    if (btnB) { btnB.onclick = function() { abyssChooseBranch('branchB'); }; btnB.textContent = (info.branchB ? info.branchB.name : '分支B'); }
    if (btnC) { btnC.onclick = function() { abyssChooseBranch('branchC'); }; btnC.textContent = (info.branchC ? info.branchC.name : '分支C'); }
    if (btnD) { btnD.onclick = function() { abyssChooseBranch('branchD'); }; btnD.textContent = (info.branchD ? info.branchD.name : '分支D'); }
}
function abyssChooseBranch(branch) {
    if (!abyssRun || !abyssRun.active || abyssRun.classBranch) return;
    abyssRun.classBranch = branch;
    document.getElementById('abyssBranchOverlay').style.display = 'none';
    document.getElementById('abyssBranchUI').style.display = 'none';
    var info = ABYSS_BRANCH_INFO[abyssRun.playerClass] || {};
    var name = (info[branch] && info[branch].name) ? info[branch].name : branch;
    abyssLog('选择职业分支：' + name + '！');
    abyssRebuildSoulCardBuffs();
    abyssApplySoulSynergies();
    updateAbyssRunUI();
}

function startAbyssRun() {
    
    if (!player.items.fubeng1 || player.items.fubeng1 < 1) {
        logAction('深渊令牌不足！', 'error');
        return;
    }
    var proceed = function() {
    
    var sumEl = document.getElementById('abyssSoulCardSummary');
    if (sumEl) sumEl.textContent = '灵魂卡牌击杀倒计数：计算中…';
    
    player.items.fubeng1--;

    var at0 = getAbyssTower();
    abyssRun = {
        active: true,
        floor: 1,
        gold: ((at0.startGoldBonus || 0) * 2),
        playerClass: abyssSelectedClass || 'warrior',
        player: {
            hp: 1000, maxHp: 1000, atk: 100, def: 50, critRate: 5, critDmg: 150, dodge: 0, lifesteal: 0, combo: 0,
            shield: 0, mp: 50
        },
        equipped: { helmet: null, chest: null, pants: null, shoes: null, necklace: null, ring: null, weapon: null },
        inventory: [],
        runeInventory: [],
        gemInventory: [],
        materials: { enhanceStone: 0, enchantBook: 0, potion: 0, upgradeStone: 0, petRevivePotion: 0, petSkillBook: 0, runeSlotOpener: 0, gemSlotOpener: 0, skillExtractStone: 0 },
        neidanBeads: 0,
        skillStoneInventory: [],
        tempStats: { hp: 0, atk: 0, def: 0, critRate: 0, critDmg: 0, dodge: 0, lifesteal: 0, combo: 0, skillDmg: 0, reduceMonsterDef: 0 },
        talentPoints: 0,
        talents: {},
        lastGrantedTalentLevel: 0,
        skillCooldowns: {},
        nextSkillId: null,
        buffs: {},
        thisRoundDodgeBonus: 0,
        thisRoundReduceDmg: 0,
        monster: null,
        justKilledBoss: false,
        pendingChoice: false,
        pendingUpgradeChoice: false,
        lastUpgradeChoiceLevel: 0,
        runLevel: 0,
        exp: 0,
        pets: [],
        petEquipmentInventory: [],
        neidanBeads: 0,
        petNeidanInventory: [],
        deployedPetIds: [],
        petGuard: false,
        playerTargetIndex: 0,
        learnedSkillIds: [],
        equippedSkillIds: (abyssSelectedClass === 'tamer')
            ? [null, null, null, ABYSS_TAMER_BOUND_SKILL_ID]
            : (abyssSelectedClass === 'warrior')
                ? [null, null, null, ABYSS_WARRIOR_BOUND_SKILL_ID]
                : (abyssSelectedClass === 'mage')
                    ? [null, null, null, ABYSS_MAGE_BOUND_SKILL_ID, ABYSS_MAGE_BOUND_SKILL_ID2]
                    : (abyssSelectedClass === 'archer')
                        ? [null, null, null, ABYSS_ARCHER_BOUND_SKILL_ID]
                        : (abyssSelectedClass === 'onmyoji')
                            ? [null, null, null, ABYSS_ONMYOJI_BOUND_SKILL_ID, ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID, ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID]
                            : (abyssSelectedClass === 'mechanic')
                                ? [null, null, null, ABYSS_MECHANIC_BOUND_SKILL_ID, ABYSS_MECHANIC_BOUND_SKILL_ID2, ABYSS_MECHANIC_BOUND_SKILL_ID3]
                            : (abyssSelectedClass === 'jester')
                                ? [null, null, null, ABYSS_JESTER_BOUND_SKILL_ID, ABYSS_JESTER_BOUND_SKILL_ID2]
                            : (abyssSelectedClass === 'riftbinder')
                                ? [null, null, null, ABYSS_RIFTBINDER_BOUND_SKILL_ID, ABYSS_RIFTBINDER_BOUND_SKILL_ID2, ABYSS_RIFTBINDER_BOUND_SKILL_ID3]
                            : [null, null, null],
        beastSummons: [],
        classBranch: null,
        triggeredBuffs: [],
        soulKillCount: 0,
        soulKillsSinceLastCard: 0,
        soulCards: [],
        lastWaveMonsterCount: 0,
        pendingSoulChoice: false,
        soulSynergyBuffs: null,
        soulManualAtkStacks: 0,
        soulDodgeStacks: 0,
        _soulCardBuffSnap: null
    };
    if (abyssSelectedClass === 'tamer') {
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_TAMER_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_TAMER_BOUND_SKILL_ID);
    }
    if (abyssSelectedClass === 'warrior') {
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_WARRIOR_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_WARRIOR_BOUND_SKILL_ID);
    }
    if (abyssSelectedClass === 'mage') {
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_MAGE_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_MAGE_BOUND_SKILL_ID);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_MAGE_BOUND_SKILL_ID2) < 0) abyssRun.learnedSkillIds.push(ABYSS_MAGE_BOUND_SKILL_ID2);
    }
    if (abyssSelectedClass === 'archer') {
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_ARCHER_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ARCHER_BOUND_SKILL_ID);
    }
    if (abyssSelectedClass === 'onmyoji') {
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_ONMYOJI_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_ID);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_SHIELD_ID);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_ONMYOJI_BOUND_SKILL_SACRIFICE_ID);
    }
    if (abyssSelectedClass === 'mechanic') {
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_MECHANIC_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_MECHANIC_BOUND_SKILL_ID);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_MECHANIC_BOUND_SKILL_ID2) < 0) abyssRun.learnedSkillIds.push(ABYSS_MECHANIC_BOUND_SKILL_ID2);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_MECHANIC_BOUND_SKILL_ID3) < 0) abyssRun.learnedSkillIds.push(ABYSS_MECHANIC_BOUND_SKILL_ID3);
    }
    if (abyssSelectedClass === 'jester') {
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_JESTER_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_JESTER_BOUND_SKILL_ID);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_JESTER_BOUND_SKILL_ID2) < 0) abyssRun.learnedSkillIds.push(ABYSS_JESTER_BOUND_SKILL_ID2);
    }
    if (abyssSelectedClass === 'riftbinder') {
        abyssRun.learnedSkillIds = abyssRun.learnedSkillIds || [];
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_RIFTBINDER_BOUND_SKILL_ID) < 0) abyssRun.learnedSkillIds.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_RIFTBINDER_BOUND_SKILL_ID2) < 0) abyssRun.learnedSkillIds.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID2);
        if (abyssRun.learnedSkillIds.indexOf(ABYSS_RIFTBINDER_BOUND_SKILL_ID3) < 0) abyssRun.learnedSkillIds.push(ABYSS_RIFTBINDER_BOUND_SKILL_ID3);
    }
    var at = getAbyssTower();
    var pb = at.permanentBonuses || {};
    abyssRun.player.hp = bAdd(abyssRun.player.hp, (pb.hp || 0));
    abyssRun.player.maxHp = bAdd(abyssRun.player.maxHp, (pb.hp || 0));
    abyssRun.player.atk += (pb.atk || 0);
    abyssRun.player.def += (pb.def || 0);
    abyssRun.player.critRate += (pb.critRate || 0);
    abyssRun.player.critDmg += (pb.critDmg || 0);
    abyssRun.player.dodge += (pb.dodge || 0);
    abyssRun.player.lifesteal += (pb.lifesteal || 0);
    abyssRun.player.combo += (pb.combo || 0);
    var cls = ABYSS_CLASSES.find(function(x) { return x.id === (abyssRun.playerClass || 'warrior'); });
    if (cls && cls.bonus) {
        for (var bk in cls.bonus) {
            var v = cls.bonus[bk];
            abyssRun.player[bk] = (abyssRun.player[bk] || 0) + v;
        }
        if (cls.bonus.hp) {
            abyssRun.player.maxHp = (abyssRun.player.maxHp || 0) + cls.bonus.hp;
            abyssRun.player.hp = abyssRun.player.maxHp;
        }
    }
    // 机械师：出场即装备6件机械铠甲（绑定，无法卸下/更换，随层数自动成长）
    if (abyssRun.playerClass === 'mechanic') {
        abyssInitMechanicGear();
    }
    var vault = at.abyssVault || {};
    var vAtkPct = 0, vHpPct = 0, vDefPct = 0, vCritDmgPct = 0, vAtkFlat = 0, vDefFlat = 0, vHpFlat = 0;
    ABYSS_VAULT_TREASURES.forEach(function(t) {
        var c = vault[t.id] || 0;
        if (c <= 0) return;
        var e = t.effect;
        if (e.type === 'atkVaultPct') vAtkPct += e.value * c; else if (e.type === 'hpVaultPct') vHpPct += e.value * c; else if (e.type === 'defVaultPct') vDefPct += e.value * c; else if (e.type === 'critDmgVaultPct') vCritDmgPct += e.value * c;
        else if (e.type === 'atkVaultFlat') vAtkFlat += e.value * c; else if (e.type === 'defVaultFlat') vDefFlat += e.value * c; else if (e.type === 'hpVaultFlat') vHpFlat += e.value * c;
    });
    abyssRun.player.atk = Math.floor((abyssRun.player.atk + vAtkFlat) * (1 + vAtkPct / 100));
    abyssRun.player.def = Math.floor((abyssRun.player.def + vDefFlat) * (1 + vDefPct / 100));
    abyssRun.player.critDmg = (abyssRun.player.critDmg || 0) + vCritDmgPct;
    var newMaxHp = Math.floor((abyssRun.player.maxHp + vHpFlat) * (1 + vHpPct / 100));
    abyssRun.player.maxHp = newMaxHp;
    abyssRun.player.hp = newMaxHp;
    abyssRun.autoAttack = false;
    stopAbyssAutoAttack();
    giveAbyssStartGearFromShop();
    var at1 = getAbyssTower();
    var startPetCount = Math.min(5, at1.startPetCount || 0);
    if (abyssSelectedClass === 'tamer') startPetCount = Math.min(5, startPetCount + 1);
    for (var spi = 0; spi < startPetCount; spi++) {
        var mName = ABYSS_NORMAL_MONSTER_NAMES[Math.floor(Math.random() * ABYSS_NORMAL_MONSTER_NAMES.length)];
        var newPet = abyssGenPet(mName, 1);
        if (newPet) abyssRun.pets.push(newPet);
    }
    if (startPetCount > 0) abyssLog('开局获得 ' + startPetCount + ' 只宠物。');
    // 深渊神兽：仅在开局根据当前缓存复制一只进战斗，整个闯关过程中不再依赖网络状态；下次开局若断网则不会再带入
    if (window._networkAbyssDivineCache && window._networkAbyssDivineCache.equippedId) {
        var divBeastId = window._networkAbyssDivineCache.equippedId;
        var divBeast = (window._networkAbyssDivineCache.beasts || []).filter(function(b){ return b.id === divBeastId; })[0];
        if (divBeast) {
            var eqCopy = { '项圈': null, '护腕': null, '铠甲': null };
            var eqq = divBeast.equippedEquip || {};
            if (eqq['项圈']) eqCopy['项圈'] = JSON.parse(JSON.stringify(eqq['项圈']));
            if (eqq['护腕']) eqCopy['护腕'] = JSON.parse(JSON.stringify(eqq['护腕']));
            if (eqq['铠甲']) eqCopy['铠甲'] = JSON.parse(JSON.stringify(eqq['铠甲']));
            var ndCopy = divBeast.equippedNeidan ? JSON.parse(JSON.stringify(divBeast.equippedNeidan)) : null;
            var codexListForBonus = (window._networkAbyssDivineCache && window._networkAbyssDivineCache.speciesCodex) || [];
            var codexGrowBonus = codexListForBonus.length * 30;
            var growthBase = divBeast.growth ? JSON.parse(JSON.stringify(divBeast.growth)) : { atk: 1500, def: 1500, hp: 1500, speed: 1500 };
            growthBase.atk = (growthBase.atk || 0) + codexGrowBonus;
            growthBase.def = (growthBase.def || 0) + codexGrowBonus;
            growthBase.hp = (growthBase.hp || 0) + codexGrowBonus;
            growthBase.speed = (growthBase.speed || 0) + codexGrowBonus;
            var runPet = { id: divBeast.id, name: divBeast.name, type: divBeast.type || 'balance', variant: !!divBeast.variant, shiny: !!divBeast.shiny, super: !!divBeast.super, wild: !!divBeast.wild, growth: growthBase, skills: divBeast.skills ? JSON.parse(JSON.stringify(divBeast.skills)) : [], level: 1, exp: 0, equipment: eqCopy, neidan: ndCopy, hp: null, maxHp: 0, isDivine: true, speciesId: divBeast.speciesId, speciesName: divBeast.speciesName, speciesDesc: divBeast.speciesDesc };
            abyssRun.pets.unshift(runPet);
            abyssLog('深渊神兽 ' + (divBeast.name || '神兽') + ' 加入战斗（等级1，不计入宠物上限）。');
        }
    }
    abyssSpawnMonster();
    refreshAbyssTowerUI();
    abyssRenderSoulSummary();
    var at2 = getAbyssTower();
    abyssLog('无限深渊开始！等级' + abyssRun.runLevel + '，开局装备' + (at2.startGearCount || 0) + '件，闯关金币' + (abyssRun.gold || 0) + '。');
    };
    // 若本地尚无深渊神兽缓存且已登录，则在开局前尝试联网拉取一次，确保已出战神兽能自动加入战斗
    var shouldFetchDivine = !window._networkAbyssDivineCache
        && typeof goldGameGetNetworkAbyssDivine === 'function'
        && typeof getGoldGameAuthToken === 'function'
        && getGoldGameAuthToken();
    if (shouldFetchDivine) {
        goldGameGetNetworkAbyssDivine().then(function () {
            proceed();
        }).catch(function () {
            proceed();
        });
    } else {
        proceed();
    }
}

function giveAbyssStartGearFromShop() {
    var at = getAbyssTower();
    var count = Math.min(20, at.startGearCount || 0);
    for (var i = 0; i < count; i++) {
        var eq = abyssGenEquipment(1, true);
        if (eq) abyssRun.inventory.push(eq);
    }
}

// 机械师专属：初始化机械铠甲（7件绑定装备，无法卸下/更换，品质固定为橙色）
function abyssInitMechanicGear() {
    if (!abyssRun || abyssRun.playerClass !== 'mechanic') return;
    abyssRun.equipped = abyssRun.equipped || { helmet: null, chest: null, pants: null, shoes: null, necklace: null, ring: null, weapon: null };
    var slots = ['helmet','chest','pants','shoes','necklace','ring','weapon'];
    var nameMap = {
        helmet: '机械核心头盔',
        chest: '机械装甲胸甲',
        pants: '机械增幅护腿',
        shoes: '磁轨动力战靴',
        necklace: '能量矩阵项链',
        ring: '指令控制指环',
        weapon: '机械臂刃武器'
    };
    for (var i = 0; i < slots.length; i++) {
        var s = slots[i];
        var ref = abyssGenEquipment(1, true);
        if (!ref) continue;
        var baseStats = {};
        for (var k in ref.stats) {
        if (!ref.stats.hasOwnProperty(k)) continue;
        baseStats[k] = Math.floor((ref.stats[k] || 0) * 0.8);
        }
        baseStats.critRate = (baseStats.critRate || 0) + 3;    
        baseStats.critDmg  = (baseStats.critDmg  || 0) + 15;   
        baseStats.skillDmg = (baseStats.skillDmg || 0) + 8;    
        
        var runeSlots = 0;
        var gemSlots = 0;
        var runesArr = [];
        var gemsArr = [];
        for (var rs = 0; rs < runeSlots; rs++) runesArr.push(null);
        for (var gs = 0; gs < gemSlots; gs++) gemsArr.push(null);
        abyssRun.equipped[s] = {
            id: abyssGenId(),
            slot: s,
            quality: 4,
            set: '机械',
            equipLevel: 1,
            level: 0,
            enchant: null,
            stats: baseStats,
            name: nameMap[s] || ('机械铠甲·' + (s || '部位')),
            equipSkill: null,
            runes: runesArr,
            gems: gemsArr,
            skillSlot: null,
            boundMechanic: true,
            mechanicBaseFloor: 1
        };
    }
}

function abyssUpdateMechanicGearByFloor(floor) {
    if (!abyssRun || abyssRun.playerClass !== 'mechanic') return;
    if (!floor || floor < 1) floor = abyssRun.floor || 1;
    for (var k in abyssRun.equipped) {
        var eq = abyssRun.equipped[k];
        if (!eq || !eq.boundMechanic) continue;
        var ref = abyssGenEquipment(floor, false, eq.quality != null ? eq.quality : undefined);
        if (!ref || !ref.stats) continue;
        var newStats = {};
        for (var sk in ref.stats) {
            if (!ref.stats.hasOwnProperty(sk)) continue;
            newStats[sk] = Math.floor((ref.stats[sk] || 0) * 0.8);
        }
        newStats.critRate = (newStats.critRate || 0) + 3;
        newStats.critDmg  = (newStats.critDmg  || 0) + 15;
        newStats.skillDmg = (newStats.skillDmg || 0) + 8;
        eq.stats = newStats;
        eq.autoEquipLevel = 1 + Math.floor((floor || 1) / 5) + Math.floor(Math.random() * 2);
    }
}

function abyssGetEffectiveEquipLevel(eq) {
    if (!eq) return 1;
    if (eq.boundMechanic && eq.autoEquipLevel != null) {
        var manualLv = Math.max(1, eq.equipLevel != null ? eq.equipLevel : 1);
        return (eq.autoEquipLevel || 1) + (manualLv - 1);
    }
    return eq.equipLevel != null ? eq.equipLevel : (eq.level || 0);
}

function abyssGenId() { return 'abyss_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9); }

function abyssGenEquipment(floor, forStart, maxQuality, fixedQuality) {
    var quality;
    if (fixedQuality !== undefined && fixedQuality !== null) {
        quality = Math.min(4, Math.max(0, Math.floor(fixedQuality)));
    } else {
        var qMax = (maxQuality !== undefined) ? (maxQuality + 1) : 5;
        quality = forStart ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * qMax);
        if (maxQuality !== undefined && quality > maxQuality) quality = maxQuality;
    }
    var slot = ABYSS_SLOTS[Math.floor(Math.random() * ABYSS_SLOTS.length)];
    var setIdx = quality >= 2 ? Math.floor(Math.random() * (ABYSS_SET_NAMES.length - 1)) + 1 : 0;
    var willHaveEquipSkill = Math.random() < 0.28;
    var baseQualityForStats = (setIdx || willHaveEquipSkill) ? 0 : quality;
    var base = { hp: 0, atk: 0, def: 0, critRate: 0, critDmg: 0, dodge: 0, lifesteal: 0, combo: 0, skillDmg: 0, reduceMonsterDef: 0, str: 0, agi: 0, int: 0, sta: 0, metalAtk: 0, woodAtk: 0, waterAtk: 0, fireAtk: 0, earthAtk: 0, metalRes: 0, woodRes: 0, waterRes: 0, fireRes: 0, earthRes: 0 };
    var f = Math.max(1, floor || 1);
    var scale = Math.floor(Math.sqrt(f * 1.15) * (1 + baseQualityForStats * 0.1));
    var roll = Math.floor(Math.random() * 3) + 1;
    base.hp += Math.floor(scale * 9 * roll);
    base.atk += Math.floor(scale * 2.4 * roll);
    base.def += Math.floor(scale * 1.2 * roll);
    if (Math.random() < 0.3) base.critRate += 1 + baseQualityForStats;
    if (Math.random() < 0.3) base.critDmg += 5 + baseQualityForStats * 5;
    if (Math.random() < 0.2) base.dodge += 0.5 + baseQualityForStats * 0.5;
    if (Math.random() < 0.2) base.lifesteal += 1 + baseQualityForStats;
    if (Math.random() < 0.2) base.combo += 2 + baseQualityForStats;
    if (Math.random() < 0.15) base.skillDmg += 10 + baseQualityForStats * 10;
    if (Math.random() < 0.25) base.str += 2 + baseQualityForStats * 2;
    if (Math.random() < 0.25) base.agi += 2 + baseQualityForStats * 2;
    if (Math.random() < 0.25) base.int += 2 + baseQualityForStats * 2;
    if (Math.random() < 0.25) base.sta += 2 + baseQualityForStats * 2;
    for (var ei = 0; ei < ABYSS_ELEMENTS.length; ei++) {
        var el = ABYSS_ELEMENTS[ei];
        if (Math.random() < 0.22) base[el + 'Atk'] = (base[el + 'Atk'] || 0) + (2 + baseQualityForStats + Math.floor(Math.random() * 5));
        if (Math.random() < 0.22) base[el + 'Res'] = (base[el + 'Res'] || 0) + (1 + baseQualityForStats + Math.floor(Math.random() * 4));
    }
    var equipLevel = forStart ? 1 : (1 + Math.floor((floor || 1) / 5) + Math.floor(Math.random() * 2));
    var names = ABYSS_EQUIP_NAMES[slot] || ['未知'];
    var equipName = names[Math.floor(Math.random() * names.length)];
    var equipSkill = null;
    if (willHaveEquipSkill) {
        var sk = forStart ? abyssPickEquipSkillForStartGear() : abyssPickEquipSkillByTier();
        equipSkill = { id: sk.id, name: sk.name, effect: JSON.parse(JSON.stringify(sk.effect)) };
    }
    var displayName = ABYSS_QUALITIES[quality] + '·' + equipName + (setIdx ? '(' + ABYSS_SET_NAMES[setIdx] + ')' : '') + (equipSkill ? '[' + equipSkill.name + ']' : '');
    var runeSlots = abyssRollRuneSlotCount();
    var gemSlots = abyssRollGemSlotCount();
    var runesArr = [];
    for (var rs = 0; rs < runeSlots; rs++) runesArr.push(null);
    var gemsArr = [];
    for (var gs = 0; gs < gemSlots; gs++) gemsArr.push(null);
    return {
        id: abyssGenId(), slot: slot, quality: quality, set: ABYSS_SET_NAMES[setIdx], equipLevel: equipLevel, level: 0, enchant: null,
        stats: base, name: displayName, equipSkill: equipSkill,
        runes: runesArr,
        gems: gemsArr,
        skillSlot: null
    };
}

/* 联网深渊神器技能效果与无限深渊装备技能一致，仅无限深渊内生效；由 ABYSS_EQUIP_SKILLS 同名取第一个 */
var ABYSS_NETWORK_SKILL_NAMES = ['破甲', '吸血', '暴怒', '坚韧', '神速', '奥术', '穿透', '守护'];
function abyssGetNetworkSkillEffect(skillName) {
    if (!skillName || !window.ABYSS_EQUIP_SKILLS) return null;
    for (var i = 0; i < ABYSS_EQUIP_SKILLS.length; i++) {
        if (ABYSS_EQUIP_SKILLS[i].name === skillName && ABYSS_EQUIP_SKILLS[i].effect)
            return ABYSS_EQUIP_SKILLS[i].effect;
    }
    if (skillName === '穿透') return { reduceMonsterDef: 12, critDmg: 26 };
    if (skillName === '守护') return { def: 45, hp: 240 };
    return null;
}
function abyssCalcPlayerStats() {
    if (!abyssRun || !abyssRun.active) return null;
    
    var cacheKey = abyssRun.playerClass + '-' + (abyssRun.playerLevel || 0) + '-' + JSON.stringify(abyssRun.equipped) + '-' + JSON.stringify(abyssRun.talents) + '-' + JSON.stringify(abyssRun.buffs) + '-' + JSON.stringify(abyssRun.tempStats || {}) + '-soul:' + JSON.stringify(abyssRun.soulCards || []) + '-' + (abyssRun.soulManualAtkStacks || 0) + '-' + (abyssRun.soulDodgeStacks || 0) + '-' + ((abyssRun.beastSummons || []).length) + '-' + ((abyssRun.beastSummons || []).filter(function(b){ return b && b.hp > 0; }).length);
    if (abyssCalcPlayerStats._cacheKey === cacheKey && abyssCalcPlayerStats._cachedStats) {
        return abyssCalcPlayerStats._cachedStats;
    }
    
    var p = abyssRun.player;
    var t = abyssRun.tempStats;
    var hp = p.maxHp + (t.hp || 0), atk = p.atk + (t.atk || 0), def = p.def + (t.def || 0);
    var critRate = p.critRate + (t.critRate || 0), critDmg = p.critDmg + (t.critDmg || 0);
    var dodge = p.dodge + (t.dodge || 0), lifesteal = p.lifesteal + (t.lifesteal || 0), combo = p.combo + (t.combo || 0);
    var skillDmg = (t.skillDmg || 0);
    var reduceMonsterDef = (t.reduceMonsterDef || 0);
    var totalStr = 0, totalAgi = 0, totalInt = 0, totalSta = 0;
    var elementAtk = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
    var elementRes = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
    var setCount = {};
    var damageIncreasePct = 0, vulnerablePct = 0, thornsPct = 0, hpRegenPerRound = 0;
    var atkPctWhenLowHp = 0, defPctWhenLowHp = 0, lowHpThreshold = 0.5;
    var appliedAbyssEquipSkillKeys = {};
    for (var _aslot = 0; _aslot < ABYSS_SLOTS.length; _aslot++) {
        var k = ABYSS_SLOTS[_aslot];
        var eq = abyssRun.equipped[k];
        if (!eq) continue;
        var s = eq.stats || {};
        var equipLv = abyssGetEffectiveEquipLevel(eq);
        var enhanceLv = eq.equipLevel != null ? (eq.level || 0) : 0;
        var baseLevelMult = 1 + equipLv * 0.2;
        var enhanceMult = 1 + enhanceLv * 0.05;
        var statMult = 1;
        if (eq.enchant && typeof eq.enchant === 'object' && eq.enchant.statMult) statMult = eq.enchant.statMult;
        else if (eq.enchant === true) statMult = 1.2;
        hp += Math.floor((s.hp || 0) * baseLevelMult * statMult * enhanceMult);
        atk += Math.floor((s.atk || 0) * baseLevelMult * statMult * enhanceMult);
        def += Math.floor((s.def || 0) * baseLevelMult * statMult * enhanceMult);
        critRate += (s.critRate || 0) * baseLevelMult * statMult * enhanceMult;
        critDmg += (s.critDmg || 0) * baseLevelMult * statMult * enhanceMult;
        dodge += (s.dodge || 0) * baseLevelMult * statMult * enhanceMult;
        lifesteal += (s.lifesteal || 0) * baseLevelMult * statMult * enhanceMult;
        combo += (s.combo || 0) * baseLevelMult * statMult * enhanceMult;
        skillDmg += (s.skillDmg || 0) * baseLevelMult * statMult * enhanceMult;
        totalStr += (s.str || 0) * baseLevelMult * statMult * enhanceMult;
        totalAgi += (s.agi || 0) * baseLevelMult * statMult * enhanceMult;
        totalInt += (s.int || 0) * baseLevelMult * statMult * enhanceMult;
        totalSta += (s.sta || 0) * baseLevelMult * statMult * enhanceMult;
        for (var ei = 0; ei < ABYSS_ELEMENTS.length; ei++) {
            var el = ABYSS_ELEMENTS[ei];
            elementAtk[el] += (s[el + 'Atk'] || 0) * baseLevelMult * statMult * enhanceMult;
            elementRes[el] += (s[el + 'Res'] || 0) * baseLevelMult * statMult * enhanceMult;
        }
        var lvMult = 1 + enhanceLv * 0.05;
        var skillMult = (eq.enchant && typeof eq.enchant === 'object' && eq.enchant.skillMult) ? eq.enchant.skillMult : 1;
        if (eq.equipSkill && eq.equipSkill.effect) {
            var _dkEq = abyssEquipSkillDedupeKey(eq.equipSkill);
            if (_dkEq && appliedAbyssEquipSkillKeys[_dkEq]) { /* 重复装备技能已生效过 */ }
            else {
            if (_dkEq) appliedAbyssEquipSkillKeys[_dkEq] = true;
            var eff = eq.equipSkill.effect;
            if (eff.hp) hp += Math.floor((eff.hp || 0) * lvMult * skillMult);
            if (eff.atk) atk += Math.floor((eff.atk || 0) * lvMult * skillMult);
            if (eff.def) def += Math.floor((eff.def || 0) * lvMult * skillMult);
            if (eff.critRate) critRate += (eff.critRate || 0) * lvMult * skillMult;
            if (eff.critDmg) critDmg += (eff.critDmg || 0) * lvMult * skillMult;
            if (eff.dodge) dodge += (eff.dodge || 0) * lvMult * skillMult;
            if (eff.lifesteal) lifesteal += (eff.lifesteal || 0) * lvMult * skillMult;
            if (eff.combo) combo += (eff.combo || 0) * lvMult * skillMult;
            if (eff.skillDmg) skillDmg += Math.floor((eff.skillDmg || 0) * lvMult * (1 + (skillMult - 1) * 0.5) * 1.5);
            if (eff.reduceMonsterDef) reduceMonsterDef += (eff.reduceMonsterDef || 0) * lvMult * skillMult;
            for (var eei = 0; eei < ABYSS_ELEMENTS.length; eei++) {
                var elx = ABYSS_ELEMENTS[eei];
                if (eff[elx + 'Atk']) elementAtk[elx] += (eff[elx + 'Atk'] || 0) * lvMult * skillMult;
                if (eff[elx + 'Res']) elementRes[elx] = (elementRes[elx] || 0) + (eff[elx + 'Res'] || 0) * lvMult * skillMult;
            }
            if (eff.damageIncreasePct) damageIncreasePct += (eff.damageIncreasePct || 0) * lvMult * skillMult;
            if (eff.vulnerablePct) vulnerablePct += (eff.vulnerablePct || 0) * lvMult * skillMult;
            if (eff.thornsPct) thornsPct += (eff.thornsPct || 0) * lvMult * skillMult;
            if (eff.hpRegenPerRound) hpRegenPerRound += Math.floor((eff.hpRegenPerRound || 0) * lvMult * skillMult);
            if (eff.atkPctWhenLowHp != null) { atkPctWhenLowHp += (eff.atkPctWhenLowHp || 0) * lvMult * skillMult; if (eff.lowHpThreshold != null) lowHpThreshold = Math.min(lowHpThreshold, eff.lowHpThreshold); }
            if (eff.defPctWhenLowHp != null) { defPctWhenLowHp += (eff.defPctWhenLowHp || 0) * lvMult * skillMult; if (eff.lowHpThreshold != null) lowHpThreshold = Math.min(lowHpThreshold, eff.lowHpThreshold); }
            }
        }
        if (eq.skillSlot && eq.skillSlot.effect) {
            var _dkSl = abyssEquipSkillDedupeKey(eq.skillSlot);
            if (_dkSl && appliedAbyssEquipSkillKeys[_dkSl]) { /* 重复技能槽与自带视为同一技能只生效一次 */ }
            else {
            if (_dkSl) appliedAbyssEquipSkillKeys[_dkSl] = true;
            var effSlot = eq.skillSlot.effect;
            if (effSlot.hp) hp += Math.floor((effSlot.hp || 0) * lvMult * skillMult);
            if (effSlot.atk) atk += Math.floor((effSlot.atk || 0) * lvMult * skillMult);
            if (effSlot.def) def += Math.floor((effSlot.def || 0) * lvMult * skillMult);
            if (effSlot.critRate) critRate += (effSlot.critRate || 0) * lvMult * skillMult;
            if (effSlot.critDmg) critDmg += (effSlot.critDmg || 0) * lvMult * skillMult;
            if (effSlot.dodge) dodge += (effSlot.dodge || 0) * lvMult * skillMult;
            if (effSlot.lifesteal) lifesteal += (effSlot.lifesteal || 0) * lvMult * skillMult;
            if (effSlot.combo) combo += (effSlot.combo || 0) * lvMult * skillMult;
            if (effSlot.skillDmg) skillDmg += Math.floor((effSlot.skillDmg || 0) * lvMult * (1 + (skillMult - 1) * 0.5) * 1.5);
            if (effSlot.reduceMonsterDef) reduceMonsterDef += (effSlot.reduceMonsterDef || 0) * lvMult * skillMult;
            for (var eei2 = 0; eei2 < ABYSS_ELEMENTS.length; eei2++) {
                var elx2 = ABYSS_ELEMENTS[eei2];
                if (effSlot[elx2 + 'Atk']) elementAtk[elx2] += (effSlot[elx2 + 'Atk'] || 0) * lvMult * skillMult;
                if (effSlot[elx2 + 'Res']) elementRes[elx2] = (elementRes[elx2] || 0) + (effSlot[elx2 + 'Res'] || 0) * lvMult * skillMult;
            }
            if (effSlot.damageIncreasePct) damageIncreasePct += (effSlot.damageIncreasePct || 0) * lvMult * skillMult;
            if (effSlot.vulnerablePct) vulnerablePct += (effSlot.vulnerablePct || 0) * lvMult * skillMult;
            if (effSlot.thornsPct) thornsPct += (effSlot.thornsPct || 0) * lvMult * skillMult;
            if (effSlot.hpRegenPerRound) hpRegenPerRound += Math.floor((effSlot.hpRegenPerRound || 0) * lvMult * skillMult);
            if (effSlot.atkPctWhenLowHp != null) { atkPctWhenLowHp += (effSlot.atkPctWhenLowHp || 0) * lvMult * skillMult; if (effSlot.lowHpThreshold != null) lowHpThreshold = Math.min(lowHpThreshold, effSlot.lowHpThreshold); }
            if (effSlot.defPctWhenLowHp != null) { defPctWhenLowHp += (effSlot.defPctWhenLowHp || 0) * lvMult * skillMult; if (effSlot.lowHpThreshold != null) lowHpThreshold = Math.min(lowHpThreshold, effSlot.lowHpThreshold); }
            }
        }
        if (eq.enchant && typeof eq.enchant === 'object' && eq.enchant.addedSkill && eq.enchant.addedSkill.effect) {
            var _dkAd = abyssEquipSkillDedupeKey(eq.enchant.addedSkill);
            if (_dkAd && appliedAbyssEquipSkillKeys[_dkAd]) { }
            else {
            if (_dkAd) appliedAbyssEquipSkillKeys[_dkAd] = true;
            var addEff = eq.enchant.addedSkill.effect;
            if (addEff.hp) hp += Math.floor((addEff.hp || 0) * lvMult);
            if (addEff.atk) atk += Math.floor((addEff.atk || 0) * lvMult);
            if (addEff.def) def += Math.floor((addEff.def || 0) * lvMult);
            if (addEff.critRate) critRate += (addEff.critRate || 0) * lvMult;
            if (addEff.critDmg) critDmg += (addEff.critDmg || 0) * lvMult;
            if (addEff.dodge) dodge += (addEff.dodge || 0) * lvMult;
            if (addEff.lifesteal) lifesteal += (addEff.lifesteal || 0) * lvMult;
            if (addEff.combo) combo += (addEff.combo || 0) * lvMult;
            if (addEff.skillDmg) skillDmg += Math.floor((addEff.skillDmg || 0) * lvMult * 1.5 * 0.5);
            if (addEff.reduceMonsterDef) reduceMonsterDef += (addEff.reduceMonsterDef || 0) * lvMult;
            }
        }
        var runes = eq.runes || [];
        for (var ri = 0; ri < runes.length; ri++) {
            var runeId = runes[ri];
            if (!runeId) continue;
            var rune = getAbyssRuneById(runeId);
            if (rune && rune.effect) {
                var re = rune.effect;
                if (re.hp) hp += Math.floor(re.hp * enhanceMult);
                if (re.atk) atk += Math.floor(re.atk * enhanceMult);
                if (re.def) def += Math.floor(re.def * enhanceMult);
                if (re.critRate) critRate += (re.critRate || 0) * enhanceMult;
                if (re.critDmg) critDmg += (re.critDmg || 0) * enhanceMult;
                if (re.dodge) dodge += (re.dodge || 0) * enhanceMult;
                if (re.lifesteal) lifesteal += (re.lifesteal || 0) * enhanceMult;
                if (re.combo) combo += (re.combo || 0) * enhanceMult;
                if (re.skillDmg) skillDmg += (re.skillDmg || 0) * enhanceMult;
                if (re.reduceMonsterDef) reduceMonsterDef += (re.reduceMonsterDef || 0) * enhanceMult;
                if (re.str) totalStr += (re.str || 0) * enhanceMult;
                if (re.agi) totalAgi += (re.agi || 0) * enhanceMult;
                if (re.int) totalInt += (re.int || 0) * enhanceMult;
                if (re.sta) totalSta += (re.sta || 0) * enhanceMult;
                for (var rei = 0; rei < ABYSS_ELEMENTS.length; rei++) {
                    var el = ABYSS_ELEMENTS[rei];
                    if (re[el + 'Atk']) elementAtk[el] += (re[el + 'Atk'] || 0) * enhanceMult;
                }
            }
        }
        var gems = eq.gems || [];
        for (var gi = 0; gi < gems.length; gi++) {
            var gemId = gems[gi];
            if (!gemId) continue;
            var gem = getAbyssGemById(gemId);
            if (gem && gem.effect) {
                var ge = gem.effect;
                if (ge.hp) hp += Math.floor(ge.hp * enhanceMult);
                if (ge.atk) atk += Math.floor(ge.atk * enhanceMult);
                if (ge.def) def += Math.floor(ge.def * enhanceMult);
                if (ge.critRate) critRate += (ge.critRate || 0) * enhanceMult;
                if (ge.critDmg) critDmg += (ge.critDmg || 0) * enhanceMult;
                if (ge.dodge) dodge += (ge.dodge || 0) * enhanceMult;
                if (ge.lifesteal) lifesteal += (ge.lifesteal || 0) * enhanceMult;
                if (ge.combo) combo += (ge.combo || 0) * enhanceMult;
                if (ge.skillDmg) skillDmg += (ge.skillDmg || 0) * enhanceMult;
                if (ge.reduceMonsterDef) reduceMonsterDef += (ge.reduceMonsterDef || 0) * enhanceMult;
                if (ge.str) totalStr += (ge.str || 0) * enhanceMult;
                if (ge.agi) totalAgi += (ge.agi || 0) * enhanceMult;
                if (ge.int) totalInt += (ge.int || 0) * enhanceMult;
                if (ge.sta) totalSta += (ge.sta || 0) * enhanceMult;
            }
        }
        if (eq.set) setCount[eq.set] = (setCount[eq.set] || 0) + 1;
    }
    if (setCount['勇者'] >= 2) { atk += 40; }
    if (setCount['勇者'] >= 4) { atk += 60; critRate += 10; }
    if (setCount['暗影'] >= 2) { dodge += 10; }
    if (setCount['暗影'] >= 4) { critDmg += 55; }
    if (setCount['龙心'] >= 2) { hp += 400; }
    if (setCount['龙心'] >= 4) { lifesteal += 10; hp += 300; }
    if (setCount['虚空'] >= 2) { critRate += 10; }
    if (setCount['虚空'] >= 4) { skillDmg += 45; critRate += 5; }
    if (setCount['永恒'] >= 2) { def += 60; }
    if (setCount['永恒'] >= 4) { hp += 1000; def += 40; }
    if (setCount['修罗'] >= 2) { atk += 35; critDmg += 20; }
    if (setCount['修罗'] >= 4) { atk += 50; critDmg += 40; lifesteal += 5; }
    if (setCount['天罡'] >= 2) { def += 50; hp += 250; }
    if (setCount['天罡'] >= 4) { def += 120; hp += 700; }
    if (setCount['幽冥'] >= 2) { dodge += 8; skillDmg += 15; }
    if (setCount['幽冥'] >= 4) { dodge += 12; skillDmg += 35; critRate += 6; }
    if (setCount['神罚'] >= 2) { skillDmg += 30; critRate += 8; }
    if (setCount['神罚'] >= 4) { skillDmg += 50; critDmg += 40; }
    if (setCount['破灭'] >= 2) { atk += 30; reduceMonsterDef += 8; }
    if (setCount['破灭'] >= 4) { atk += 55; reduceMonsterDef += 15; combo += 8; }
    var lv = (abyssRun.runLevel || 0);
    hp += lv * 25;
    atk += lv * 3;
    def += lv * 2;
    if (abyssRun.buffs) {
        if (abyssRun.buffs.atkPct != null) atk = Math.floor(atk * (1 + abyssRun.buffs.atkPct / 100));
        if (abyssRun.buffs.hpPct != null) hp = Math.floor(hp * (1 + abyssRun.buffs.hpPct / 100));
        if (abyssRun.buffs.defPct != null) def = Math.floor(def * (1 + abyssRun.buffs.defPct / 100));
        if (abyssRun.buffs.lifestealPct != null) lifesteal += abyssRun.buffs.lifestealPct;
        if (abyssRun.buffs.critRatePct != null) critRate += abyssRun.buffs.critRatePct;
        if (abyssRun.buffs.critDmgPct != null) critDmg += abyssRun.buffs.critDmgPct;
        if (abyssRun.buffs.dodgePct != null) dodge += abyssRun.buffs.dodgePct;
        if (abyssRun.buffs.critRate != null) critRate += abyssRun.buffs.critRate;
        if (abyssRun.buffs.critDmg != null) critDmg += abyssRun.buffs.critDmg;
        if (abyssRun.buffs.combo != null) combo += abyssRun.buffs.combo;
        if (abyssRun.buffs.skillDmg != null) skillDmg += abyssRun.buffs.skillDmg;
        if (abyssRun.buffs.reduceMonsterDef != null) reduceMonsterDef += abyssRun.buffs.reduceMonsterDef;
    }
    // 灵魂卡动态：万兽朝圣、召唤流·每存在召唤物；连击究极、极限闪避（层数）
    if (abyssRun && abyssRun.soulCards && abyssRun.soulCards.length) {
        var scList = abyssRun.soulCards;
        var beastN = 0, petN = 0;
        if (abyssRun.beastSummons) for (var _bn = 0; _bn < abyssRun.beastSummons.length; _bn++) if (abyssRun.beastSummons[_bn] && abyssRun.beastSummons[_bn].hp > 0) beastN++;
        if (typeof abyssGetDeployedPets === 'function') {
            var dpp = abyssGetDeployedPets();
            for (var _pn = 0; _pn < dpp.length; _pn++) if (abyssIsPetCombatAlive(dpp[_pn])) petN++;
        }
        var dynAtk = 0, dynDef = 0;
        for (var si = 0; si < scList.length; si++) {
            var sce = scList[si];
            if (!sce || !sce.card || !sce.card.effect) continue;
            var seff = sce.card.effect;
            var sst = sce.stack || 1;
            if (seff.atkPerBeastOrSummonPct != null) {
                var cap = seff.beastOrSummonCap != null ? seff.beastOrSummonCap : 5;
                var n = Math.min(cap, beastN + petN);
                dynAtk += (seff.atkPerBeastOrSummonPct || 0) * sst * n;
                dynDef += (seff.defPerBeastOrSummonPct || 0) * sst * n;
            }
            if (seff.atkPerSummonPct != null) {
                dynAtk += (seff.atkPerSummonPct || 0) * sst * beastN;
            }
        }
        if (dynAtk) atk = Math.floor(atk * (1 + dynAtk / 100));
        if (dynDef) def = Math.floor(def * (1 + dynDef / 100));
        var manPct = 0, manCap = 40;
        for (var mi = 0; mi < scList.length; mi++) {
            var mce = scList[mi].card && scList[mi].card.effect;
            if (mce && mce.manualAttackStackAtkPct != null) {
                manPct = mce.manualAttackStackAtkPct;
                manCap = mce.manualAttackStackCap != null ? mce.manualAttackStackCap : 40;
                break;
            }
        }
        if (manPct && (abyssRun.soulManualAtkStacks || 0) > 0) {
            atk = Math.floor(atk * (1 + Math.min(manCap, abyssRun.soulManualAtkStacks) * manPct / 100));
        }
        var dodD = 0, dodA = 0, dodCap = 30;
        for (var di = 0; di < scList.length; di++) {
            var dce = scList[di].card && scList[di].card.effect;
            if (dce && dce.onDodgeStackDodgePct != null) {
                dodD = dce.onDodgeStackDodgePct;
                dodA = dce.onDodgeStackAtkPct != null ? dce.onDodgeStackAtkPct : dodD;
                dodCap = dce.onDodgeStackCap != null ? dce.onDodgeStackCap : 30;
                break;
            }
        }
        if (dodD && (abyssRun.soulDodgeStacks || 0) > 0) {
            var dL = Math.min(dodCap, abyssRun.soulDodgeStacks);
            dodge += dL * dodD;
            atk = Math.floor(atk * (1 + dL * dodA / 100));
        }
    }
    var ndAll = abyssGetNeidanBonuses();
    if (ndAll.atkPct) atk = Math.floor(atk * (1 + ndAll.atkPct / 100));
    if (ndAll.hpPct) hp = Math.floor(hp * (1 + ndAll.hpPct / 100));
    if (ndAll.defPct) def = Math.floor(def * (1 + ndAll.defPct / 100));
    if (ndAll.critRate) critRate += ndAll.critRate;
    if (ndAll.critDmg) critDmg += ndAll.critDmg;
    if (ndAll.lifestealPct) lifesteal += ndAll.lifestealPct;
    if (ndAll.damageReduction) def += Math.floor(def * ndAll.damageReduction / 100);
    if (ndAll.reduceMonsterDef) reduceMonsterDef += ndAll.reduceMonsterDef;
    if (abyssRun.curseRounds > 0 && (abyssRun.curseEffects || abyssRun.rewardEffects)) {
        var c = abyssRun.curseEffects || {};
        var r = abyssRun.rewardEffects || {};
        var atkPct = (c.atkPct || 0) + (r.atkPct || 0);
        var hpPct = (c.hpPct || 0) + (r.hpPct || 0);
        var defPct = (c.defPct || 0) + (r.defPct || 0);
        if (atkPct) atk = Math.floor(atk * (1 + atkPct / 100));
        if (hpPct) hp = Math.floor(hp * (1 + hpPct / 100));
        if (defPct) def = Math.floor(def * (1 + defPct / 100));
        lifesteal += (c.lifestealPct || 0) + (r.lifestealPct || 0);
        critRate += (c.critRatePct || 0) + (r.critRatePct || 0);
        critDmg += (c.critDmgPct || 0) + (r.critDmgPct || 0);
        dodge += (c.dodgePct || 0) + (r.dodgePct || 0);
    }
    if (abyssRun.trialId === 'lowHp' && abyssRun.trialRoundsLeft > 0) hp = Math.floor(hp * 0.75);
    critRate += lv * 0.3;
    critDmg += lv * 1;
    dodge += lv * 0.2;
    lifesteal += lv * 0.1;
    skillDmg += lv * 0.5;
    var cls = ABYSS_CLASSES.find(function(x) { return x.id === (abyssRun.playerClass || 'warrior'); });
    var strAtk = Math.floor(totalStr * 2);
    if (cls && cls.strConversionMult) strAtk = Math.floor(strAtk * cls.strConversionMult);
    var agiDodge = totalAgi * 0.3, agiCrit = totalAgi * 0.2, agiCombo = totalAgi * 0.2;
    if (cls && cls.agiMult) { agiDodge *= cls.agiMult; agiCrit *= cls.agiMult; agiCombo *= cls.agiMult; }
    var intSkill = totalInt * 0.5;
    if (cls && cls.intToSkillDmgMult) intSkill *= cls.intToSkillDmgMult;
    var staHp = Math.floor(totalSta * 8), staDef = totalSta * 0.5;
    if (cls && cls.staConversionMult) { staHp = Math.floor(staHp * cls.staConversionMult); staDef *= cls.staConversionMult; }
    atk += strAtk;
    dodge += agiDodge;
    critRate += agiCrit;
    combo += agiCombo;
    skillDmg += intSkill;
    hp += staHp;
    def += Math.floor(staDef);
    var talents = abyssRun.talents || {};
    for (var ti = 0; ti < ABYSS_TALENTS.length; ti++) {
        var tal = ABYSS_TALENTS[ti];
        var lvl = talents[tal.id] || 0;
        if (lvl <= 0) continue;
        if (tal.id === 'tal_str') {
            atk += Math.floor(totalStr * 5 * lvl);
            continue;
        }
        if (tal.id === 'tal_int') {
            skillDmg += totalInt * 1.5 * lvl;
            continue;
        }
        if (tal.id === 'tal_agi') {
            critRate += totalAgi * (1.25 / 3) * lvl;
            dodge += totalAgi * (1 / 3) * lvl;
            continue;
        }
        if (tal.id === 'tal_sta') {
            hp += Math.floor(totalSta * 27.5 * lvl);
            def += Math.floor(totalSta * 2 * lvl);
            continue;
        }
        if (!tal.effect) continue;
        var eff = tal.effect;
        if (eff.hp) hp += (eff.hp || 0) * lvl;
        if (eff.atk) atk += (eff.atk || 0) * lvl;
        if (eff.def) def += (eff.def || 0) * lvl;
        if (eff.critRate) critRate += (eff.critRate || 0) * lvl;
        if (eff.critDmg) critDmg += (eff.critDmg || 0) * lvl;
        if (eff.dodge) dodge += (eff.dodge || 0) * lvl;
        if (eff.lifesteal) lifesteal += (eff.lifesteal || 0) * lvl;
        if (eff.combo) combo += (eff.combo || 0) * lvl;
        if (eff.skillDmg) skillDmg += (eff.skillDmg || 0) * lvl;
        if (eff.reduceMonsterDef) reduceMonsterDef += (eff.reduceMonsterDef || 0) * lvl;
    }
    var runLv = abyssRun.runLevel != null ? abyssRun.runLevel : Math.floor((abyssRun.exp || 0) / 100);
    var maxMp = abyssMaxMpForLevel(runLv);
    var zhuan = abyssZhuan(runLv);
    /* 出战宠物被动：给玩家增加攻击、防御、体力、魔法值、吸血、爆伤、技能加成、闪避、五行之力（多只出战宠物叠加） */
    var deployedPets = abyssGetDeployedPets();
    for (var dpi = 0; dpi < deployedPets.length; dpi++) {
        var dp = deployedPets[dpi];
        if (!dp || !dp.skills || !dp.skills.length) continue;
        for (var pi = 0; pi < dp.skills.length; pi++) {
            var sk = null;
            for (var sj = 0; sj < ABYSS_PET_SKILLS.length; sj++) {
                if (ABYSS_PET_SKILLS[sj].id === dp.skills[pi].id) { sk = ABYSS_PET_SKILLS[sj]; break; }
            }
            if (sk && sk.playerBonus) {
                var pb = sk.playerBonus;
                if (pb.atk) atk += pb.atk;
                if (pb.def) def += pb.def;
                if (pb.hp) hp += pb.hp;
                if (pb.maxMp) maxMp += pb.maxMp;
                if (pb.critRate) critRate += pb.critRate;
                if (pb.critDmg) critDmg += pb.critDmg;
                if (pb.dodge) dodge += pb.dodge;
                if (pb.lifesteal) lifesteal += pb.lifesteal;
                if (pb.skillDmg) skillDmg += pb.skillDmg;
                if (pb.elementAtk && typeof elementAtk === 'object') {
                    for (var ei = 0; ei < ABYSS_ELEMENTS.length; ei++) {
                        var el = ABYSS_ELEMENTS[ei];
                        elementAtk[el] = (elementAtk[el] || 0) + pb.elementAtk;
                    }
                }
            }
        }
    }
    /* 联网深渊神器：装备技能与无限深渊一致，仅无限深渊生效 */
    if (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken() && window._networkArtifactsCache && window._networkArtifactsCache.equipped && typeof abyssGetNetworkSkillEffect === 'function') {
        var netEquipped = window._networkArtifactsCache.equipped;
        ['necklace', 'ring', 'bracelet'].forEach(function(slot) {
            var eq = netEquipped[slot];
            if (!eq || !eq.skillName) return;
            var eff = abyssGetNetworkSkillEffect(eq.skillName);
            if (!eff) return;
            if (eff.hp) hp += eff.hp;
            if (eff.atk) atk += eff.atk;
            if (eff.def) def += eff.def;
            if (eff.critRate) critRate += eff.critRate;
            if (eff.critDmg) critDmg += eff.critDmg;
            if (eff.dodge) dodge += eff.dodge;
            if (eff.lifesteal) lifesteal += eff.lifesteal;
            if (eff.combo) combo += eff.combo;
            if (eff.skillDmg) skillDmg += eff.skillDmg;
            if (eff.reduceMonsterDef) reduceMonsterDef += eff.reduceMonsterDef;
            if (eff.damageIncreasePct) damageIncreasePct += eff.damageIncreasePct;
            if (eff.atkPctWhenLowHp != null) atkPctWhenLowHp += eff.atkPctWhenLowHp;
            if (eff.lowHpThreshold != null) lowHpThreshold = Math.min(lowHpThreshold, eff.lowHpThreshold);
        });
    }
    /* 联网深渊神器：数值加成在无限深渊也生效 */
    if (typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken()) {
        if (typeof getNetworkArtifactHealthPct === 'function') hp = Math.floor(hp * (1 + getNetworkArtifactHealthPct() / 100));
        if (typeof getNetworkArtifactAttackPct === 'function') atk = Math.floor(atk * (1 + getNetworkArtifactAttackPct() / 100));
        if (typeof getNetworkArtifactDefensePct === 'function') def = Math.floor(def * (1 + getNetworkArtifactDefensePct() / 100));
        if (typeof getNetworkArtifactCritRatePct === 'function') critRate = critRate * (1 + getNetworkArtifactCritRatePct() / 100);
        if (typeof getNetworkArtifactCritDmgPct === 'function') critDmg = critDmg * (1 + getNetworkArtifactCritDmgPct() / 100);
    }
    var curHp = abyssRun.player.hp != null ? abyssRun.player.hp : hp;
    if (hp > 0 && (atkPctWhenLowHp > 0 || defPctWhenLowHp > 0) && curHp / hp < lowHpThreshold) {
        if (atkPctWhenLowHp > 0) atk = Math.floor(atk * (1 + atkPctWhenLowHp / 100));
        if (defPctWhenLowHp > 0) def = Math.floor(def * (1 + defPctWhenLowHp / 100));
    }
    var dodgeCap = 70;
    var excessDodge = Math.max(0, dodge - dodgeCap);
    var finalDodge = Math.min(dodgeCap, dodge);
    var finalCritDmg = critDmg + excessDodge;
    var soulDR = (abyssRun.buffs && abyssRun.buffs.soulDamageReductionPct) || 0;
    // 技能持续：造成伤害增加 / 易伤（来自 abyssRun.buffs，回合末随 roundsLeft 清除）
    if (abyssRun.buffs && abyssRun.buffs.damageIncreasePct != null) damageIncreasePct += abyssRun.buffs.damageIncreasePct;
    if (abyssRun.buffs && abyssRun.buffs.vulnerablePct != null) vulnerablePct += abyssRun.buffs.vulnerablePct;
    var result = { hp: hp, maxHp: hp, atk: atk, def: def, critRate: Math.min(100, critRate), critDmg: finalCritDmg, dodge: finalDodge, lifesteal: lifesteal, combo: combo, skillDmg: skillDmg, reduceMonsterDef: reduceMonsterDef, str: Math.floor(totalStr), agi: Math.floor(totalAgi), int: Math.floor(totalInt), sta: Math.floor(totalSta), elementAtk: elementAtk, elementRes: elementRes, maxMp: maxMp, zhuan: zhuan, damageIncreasePct: damageIncreasePct, vulnerablePct: vulnerablePct, thornsPct: thornsPct, hpRegenPerRound: hpRegenPerRound, soulDamageReductionPct: soulDR };
    abyssCalcPlayerStats._cachedStats = result;
    abyssCalcPlayerStats._cacheKey = cacheKey;
    return result;
}


/**
 * 时光秘境 · Build 预设 + 教学局
 * 开局构筑摘要 / 3 槽预设 / 引导式教学跑（10 层、减负、免首钥）
 * 教学局不计入正式闯关：图鉴/成就/秘境币/徽章/装备纪念/精灵养成等一律不外带
 */
const TSR_BUILD_PRESET_SLOTS = 3;

const TSR_TUTORIAL_FLOOR_TIPS = {
    1: '📚 教学①：点「探索」进入当前层。本局共 10 层通关，时间很宽裕。',
    2: '📚 教学②：遇战斗可选战术再开战；未探索/未击杀不能点下一层。',
    3: '📚 教学③：特殊房与休息房能回血加时，不要只硬刚。',
    4: '📚 教学④：词条怪更危险但赏金更高；教学局已弱化词条。',
    5: '📚 教学⑤：右侧「装备」栏可穿戴强化；开局默认显示装备。',
    6: '📚 教学⑥：战斗房必须打完才能下一层，不能跳过怪物。',
    7: '📚 教学⑦：连续赶层会有额外惩罚，注意时间与生命。',
    8: '📚 教学⑧：增益 / 遗物 / 装备都在右侧边栏切换查看。',
    9: '📚 教学⑨：休息与神龛是保命手段，关键时别省。',
    10: '📚 教学⑩：达到通关层后可撤离；教学局不外带任何进度与奖励。'
};

function ensureTsrGuideData() {
    if (!player.timeSecretRealm) {
        if (typeof ensureTimeSecretRealmData === 'function') ensureTimeSecretRealmData();
        else player.timeSecretRealm = {};
    }
    const tsr = player.timeSecretRealm;
    if (!tsr.buildPresets) tsr.buildPresets = [null, null, null];
    while (tsr.buildPresets.length < TSR_BUILD_PRESET_SLOTS) tsr.buildPresets.push(null);
    if (tsr.tutorialCompleted == null) tsr.tutorialCompleted = false;
    if (tsr.tutorialRuns == null) tsr.tutorialRuns = 0;
    // 大厅摘要可能在 ensureTimeSecretRealmData 之前跑到，兜底难度结构
    if (!tsr.difficulty || typeof tsr.difficulty !== 'object') {
        tsr.difficulty = { current: '', unlocked: ['easy'], levels: typeof getDefaultTsrDifficultyLevels === 'function' ? getDefaultTsrDifficultyLevels() : {} };
    } else if (!tsr.difficulty.levels && typeof getDefaultTsrDifficultyLevels === 'function') {
        tsr.difficulty.levels = getDefaultTsrDifficultyLevels();
    }
    return tsr;
}

function getTsrBuildSnapshot() {
    const tsr = player.timeSecretRealm;
    const stance = typeof getTsrActiveStance === 'function' ? getTsrActiveStance() : null;
    const destiny = tsr.destinyGrid?.activeRoute || 'combat';
    const arts = Object.keys(tsr.combatTrain?.arts || {});
    return {
        name: '',
        at: Date.now(),
        difficulty: tsr.difficulty?.current || '',
        contract: tsr.selectedContract || 'none',
        subContract: tsr.selectedSubContract || 'none',
        fate: tsr.selectedFateCard || null,
        stance: stance?.id || tsr.combatTrain?.stance || 'balance',
        destinyRoute: destiny,
        arts: arts.slice(0, 8)
    };
}

function formatTsrBuildLine(snap) {
    if (!snap) return '空槽';
    const diff = snap.difficulty
        ? (player.timeSecretRealm.difficulty?.levels?.[snap.difficulty]?.name || snap.difficulty)
        : '未选难度';
    const c1 = TSR_RUN_CONTRACTS?.[snap.contract]?.name || snap.contract || '无契约';
    const c2 = snap.subContract && snap.subContract !== 'none'
        ? (TSR_RUN_CONTRACTS?.[snap.subContract]?.name || snap.subContract)
        : '无副约';
    const fate = snap.fate && TSR_FATE_CARDS?.[snap.fate]
        ? TSR_FATE_CARDS[snap.fate].name
        : '命运未选';
    const stance = TSR_COMBAT_STANCES?.[snap.stance]?.name || snap.stance || '均衡';
    const route = TSR_DESTINY_ROUTES?.[snap.destinyRoute]?.name || snap.destinyRoute || '—';
    return `${diff} · ${c1}+${c2} · ${stance} · ${fate} · ${route}`;
}

function renderTsrBuildSummary() {
    const el = document.getElementById('tsrBuildSummary');
    if (!el || !player?.timeSecretRealm) return;
    ensureTsrGuideData();
    const snap = getTsrBuildSnapshot();
    const levels = player.timeSecretRealm?.difficulty?.levels;
    const diffName = snap.difficulty ? (levels?.[snap.difficulty]?.name || snap.difficulty) : '';
    const diffOk = !!diffName;
    const stance = TSR_COMBAT_STANCES?.[snap.stance];
    const contract = TSR_RUN_CONTRACTS?.[snap.contract];
    const artsN = (snap.arts || []).length;
    el.innerHTML = `
        <div class="tsr-build-head">本局构筑摘要</div>
        <ul class="tsr-build-list">
            <li><span>难度</span><b>${diffOk ? diffName : '未选择'}</b></li>
            <li><span>主契约</span><b>${contract ? contract.icon + ' ' + contract.name : '无'}</b></li>
            <li><span>副契约</span><b>${snap.subContract && snap.subContract !== 'none' ? (TSR_RUN_CONTRACTS?.[snap.subContract]?.name || snap.subContract) : '无'}</b></li>
            <li><span>命运卡</span><b>${snap.fate && TSR_FATE_CARDS?.[snap.fate] ? TSR_FATE_CARDS[snap.fate].icon + ' ' + TSR_FATE_CARDS[snap.fate].name : '未选（可空）'}</b></li>
            <li><span>战斗姿态</span><b>${stance ? stance.icon + ' ' + stance.name : '均衡'}</b></li>
            <li><span>命格路线</span><b>${TSR_DESTINY_ROUTES?.[snap.destinyRoute]?.name || snap.destinyRoute || '—'}</b></li>
            <li><span>已悟武技</span><b>${artsN} 种</b></li>
        </ul>
        <p class="tsr-build-hint">${diffOk ? '确认无误后点下方开始；也可用预设一键装卸。' : '请先选择难度。'}</p>`;
}

function renderTsrBuildPresetPanel() {
    const el = document.getElementById('tsrBuildPresetPanel');
    if (!el) return;
    ensureTsrGuideData();
    const presets = player.timeSecretRealm.buildPresets;
    el.innerHTML = `<div class="tsr-build-head">构筑预设（${TSR_BUILD_PRESET_SLOTS} 槽）</div>
        <div class="tsr-preset-grid">${presets.map((p, i) => `
            <div class="tsr-preset-card">
                <div class="tsr-preset-title">槽 ${i + 1}${p?.name ? ' · ' + p.name : ''}</div>
                <div class="tsr-preset-desc">${formatTsrBuildLine(p)}</div>
                <div class="tsr-preset-actions">
                    <button type="button" class="tsr-btn tsr-btn-gold" onclick="saveTsrBuildPreset(${i})">保存当前</button>
                    <button type="button" class="tsr-btn tsr-btn-safe" ${p ? '' : 'disabled'} onclick="loadTsrBuildPreset(${i})">载入</button>
                    <button type="button" class="tsr-btn tsr-btn-ghost" ${p ? '' : 'disabled'} onclick="clearTsrBuildPreset(${i})">清空</button>
                </div>
            </div>`).join('')}</div>`;
}

function refreshTsrGuideBuildPanels() {
    try {
        if (!player?.timeSecretRealm) return;
        ensureTsrGuideData();
        renderTsrBuildSummary();
        renderTsrBuildPresetPanel();
    } catch (e) {
        console.warn('refreshTsrGuideBuildPanels', e);
    }
}

function saveTsrBuildPreset(slot) {
    ensureTsrGuideData();
    if (slot < 0 || slot >= TSR_BUILD_PRESET_SLOTS) return;
    const snap = getTsrBuildSnapshot();
    if (!snap.difficulty) {
        logAction('请先选择难度再保存预设', 'error');
        return;
    }
    const label = prompt('给此构筑起个短名（可空）', snap.name || `构筑${slot + 1}`);
    if (label === null) return;
    snap.name = (label || `构筑${slot + 1}`).slice(0, 12);
    player.timeSecretRealm.buildPresets[slot] = snap;
    logAction(`已保存预设槽 ${slot + 1}：${snap.name}`, 'success');
    refreshTsrGuideBuildPanels();
}

function clearTsrBuildPreset(slot) {
    ensureTsrGuideData();
    player.timeSecretRealm.buildPresets[slot] = null;
    logAction(`已清空预设槽 ${slot + 1}`, 'info');
    refreshTsrGuideBuildPanels();
}

function loadTsrBuildPreset(slot) {
    ensureTsrGuideData();
    const p = player.timeSecretRealm.buildPresets[slot];
    if (!p) { logAction('该槽为空', 'error'); return; }
    const tsr = player.timeSecretRealm;
    if (p.difficulty && tsr.difficulty.unlocked.includes(p.difficulty)) {
        selectTsrDifficulty(p.difficulty);
    } else if (p.difficulty) {
        logAction(`预设难度未解锁：${p.difficulty}，已跳过`, 'warning');
    }
    try { selectTsrContract(p.contract || 'none'); } catch (e) {}
    if (typeof canUseTsrSubContract === 'function' && canUseTsrSubContract()) {
        try { selectTsrSubContract(p.subContract || 'none'); } catch (e) {}
    }
    if (p.fate && tsr.fateCardOptions?.includes(p.fate)) {
        selectTsrFateCard(p.fate);
    }
    if (p.stance && typeof setTsrCombatStance === 'function' && TSR_COMBAT_STANCES?.[p.stance]) {
        setTsrCombatStance(p.stance);
    }
    if (p.destinyRoute && tsr.destinyGrid && TSR_DESTINY_ROUTES?.[p.destinyRoute]) {
        if (typeof canUnlockTsrDestinyRoute !== 'function' || canUnlockTsrDestinyRoute(p.destinyRoute)) {
            tsr.destinyGrid.activeRoute = p.destinyRoute;
        }
    }
    logAction(`已载入预设：${p.name || ('槽' + (slot + 1))}`, 'success');
    refreshTsrGuideBuildPanels();
}

/* ========== 教学局 ========== */
function startTsrTutorialRun() {
    const tsr = player.timeSecretRealm;
    ensureTsrGuideData();
    if (!tsr.difficulty.unlocked.includes('easy')) {
        logAction('简单难度未解锁，无法开教学局', 'error');
        return;
    }
    selectTsrDifficulty('easy');
    selectTsrContract('none');
    if (typeof canUseTsrSubContract === 'function' && canUseTsrSubContract()) {
        selectTsrSubContract('none');
    }
    tsr.selectedFateCard = null;
    if (typeof updateTsrFateCardUI === 'function') updateTsrFateCardUI();
    // 开局前快照永久养成；结束时整包还原，确保教学局零外带
    if (typeof captureTsrTutorialMetaSnapshot === 'function') {
        tsr._tutorialMetaSnapshot = captureTsrTutorialMetaSnapshot();
    }
    tsr.pendingTutorial = true;
    const free = !tsr.tutorialCompleted;
    if (free) {
        player.items.fuben2 = (player.items.fuben2 || 0) + 1;
        logAction('首次教学局免钥匙（已临时补给一把）', 'success');
    } else if ((player.items.fuben2 || 0) < 1) {
        tsr.pendingTutorial = false;
        delete tsr._tutorialMetaSnapshot;
        alert('需要至少 1 把秘境钥匙！');
        return;
    }
    startTimeSecretRealm();
}

function initTsrTutorialRun() {
    const tsr = player.timeSecretRealm;
    if (!tsr.pendingTutorial) return;
    tsr.pendingTutorial = false;
    const run = tsr.currentRun;
    if (!run?.isActive) return;
    run.isTutorial = true;
    run.clearFloor = 10;
    run.timeLeft = Math.max(run.timeLeft, 520);
    run.initialTime = Math.max(run.initialTime || 0, run.timeLeft);
    run.tutorialEase = 0.72;
    run.tutorialTipShown = {};
    if (tsr._tutorialMetaSnapshot) {
        run._tutorialMetaSnapshot = tsr._tutorialMetaSnapshot;
        delete tsr._tutorialMetaSnapshot;
    }
    tsr.tutorialRuns = (tsr.tutorialRuns || 0) + 1;
    addTempBuff?.({ name: '教学护符', effect: 'attack', value: 0.08, duration: 99, isDebuff: false });
    addTsrLog('📘 教学局开幕：10 层练习 · 怪弱 · 时宽 · 词条弱化。本局图鉴/成就/币/徽章/装备都不外带。', 'warning');
    showTsrTutorialBanner(TSR_TUTORIAL_FLOOR_TIPS[1]);
}

function showTsrTutorialBanner(text) {
    if (!text) return;
    let bar = document.getElementById('tsrTutorialBanner');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'tsrTutorialBanner';
        bar.className = 'tsr-tutorial-banner';
        const host = document.getElementById('tsrAdventurePanel') || document.body;
        host.insertBefore(bar, host.firstChild);
    }
    bar.style.display = 'block';
    bar.textContent = text;
}

function hideTsrTutorialBanner() {
    const bar = document.getElementById('tsrTutorialBanner');
    if (bar) bar.style.display = 'none';
}

function tickTsrTutorialCoach() {
    const run = player.timeSecretRealm?.currentRun;
    if (!run?.isTutorial || !run.isActive) return;
    const f = run.currentFloor || 1;
    if (run.tutorialTipShown?.[f]) return;
    const tip = TSR_TUTORIAL_FLOOR_TIPS[f];
    if (!tip) return;
    run.tutorialTipShown[f] = true;
    showTsrTutorialBanner(tip);
    addTsrLog(tip, 'info');
}

function completeTsrTutorialIfNeeded(reason) {
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    if (!run?.isTutorial) return;
    const flags = typeof resolveTsrEndClearFlags === 'function' ? resolveTsrEndClearFlags(reason) : null;
    // 教学局 countsAsClearCount 恒为 false，用 debriefAsCleared / 层数判断「完成教学」
    const ok = !!(flags?.debriefAsCleared)
        || (run.currentFloor >= (run.clearFloor || 10)
            && typeof isTsrSuccessfulClear === 'function'
            && isTsrSuccessfulClear(reason));
    if (ok) {
        tsr.tutorialCompleted = true;
        try { localStorage.setItem('tsr_guide_v1', '1'); } catch (e) {}
        addTsrLog?.('📘 教学局完成！进度不外带。可用构筑预设保存常用开局。', 'success');
    }
    hideTsrTutorialBanner();
}

function finalizeTsrTutorialIsolation(snap, keep) {
    if (!snap || typeof restoreTsrTutorialMetaSnapshot !== 'function') return false;
    const ok = restoreTsrTutorialMetaSnapshot(snap, keep);
    if (!ok) return false;
    try {
        if (typeof updateTechniqueBonuses === 'function') updateTechniqueBonuses();
        else if (typeof applyTsrBadgeMainWorldBonuses === 'function') applyTsrBadgeMainWorldBonuses();
    } catch (e) { /* ignore */ }
    try { if (typeof saveGame === 'function') saveGame(); } catch (e) { /* ignore */ }
    logAction('📘 教学局结束：永久进度已还原，本局收获全部清空', 'info');
    return true;
}

/* ========== 增强指引弹层 ========== */
function showTsrGuideFlow(force) {
    try {
        if (!force && localStorage.getItem('tsr_guide_v1')) return;
    } catch (e) { /* continue */ }
    let tip = document.getElementById('tsrGuideTip');
    if (!tip) {
        tip = document.createElement('div');
        tip.id = 'tsrGuideTip';
        tip.className = 'tsr-guide-tip';
        document.body.appendChild(tip);
    }
    const steps = [
        { t: '选难度 → 看右侧「构筑摘要」确认契约/姿态', a: null },
        { t: '可用「构筑预设」保存 3 套常用开局，一键载入', a: null },
        { t: '推荐先打「教学局」：10 层、怪弱、免首钥；练习不外带任何进度', a: 'tutorial' },
        { t: '正式局注意气候、词条与多命横幅；打不过就撤', a: null },
        { t: '赛季 / 势力 / 终局 / 传说 / 战修在上方 Tab', a: null }
    ];
    let i = 0;
    const render = () => {
        tip.style.display = 'block';
        const step = steps[i];
        tip.innerHTML = `<strong>时光秘境入门</strong><p>${step.t}</p>
            <div class="tsr-guide-actions">
                ${step.a === 'tutorial' ? '<button type="button" class="tsr-btn tsr-btn-purple" id="tsrGuideTutorial">📘 开教学局</button>' : ''}
                <button type="button" class="tsr-btn tsr-btn-gold" id="tsrGuideNext">${i < steps.length - 1 ? '下一步' : '知道了'}</button>
            </div>`;
        tip.querySelector('#tsrGuideNext').onclick = () => {
            if (i < steps.length - 1) { i++; render(); }
            else {
                tip.style.display = 'none';
                try { localStorage.setItem('tsr_guide_v1', '1'); } catch (e) {}
            }
        };
        const tb = tip.querySelector('#tsrGuideTutorial');
        if (tb) {
            tb.onclick = () => {
                tip.style.display = 'none';
                startTsrTutorialRun();
            };
        }
    };
    render();
}

/* ========== UI ========== */
function injectTsrGuideLobbyUI() {
    const adv = document.getElementById('tsrTabAdventure');
    if (!adv) return;
    const actions = adv.querySelector('.tsr-lobby-actions');
    if (actions && !document.getElementById('tsrBuildSummary')) {
        const wrap = document.createElement('div');
        wrap.className = 'tsr-build-wrap';
        wrap.innerHTML = `
            <div id="tsrBuildSummary" class="tsr-build-summary"></div>
            <div id="tsrBuildPresetPanel" class="tsr-build-presets"></div>`;
        actions.parentNode.insertBefore(wrap, actions);
    }
    const modeBox = adv.querySelector('.tsr-mode-box');
    if (modeBox && !document.getElementById('tsrTutorialBtn')) {
        const b = document.createElement('button');
        b.type = 'button';
        b.id = 'tsrTutorialBtn';
        b.className = 'tsr-btn tsr-btn-purple';
        b.textContent = '📘 教学局（首通免钥）';
        b.onclick = () => startTsrTutorialRun();
        modeBox.appendChild(b);
        const guideBtn = modeBox.querySelector('button[onclick*="maybeShowTsrGuide"]');
        if (guideBtn) {
            guideBtn.onclick = () => showTsrGuideFlow(true);
            guideBtn.textContent = '📘 新手指引';
        }
    }
}

function initTsrGuideExtensions() {
    ensureTsrGuideData();

    if (typeof TSR_LOBBY_TAB_REFRESH === 'object') {
        const prev = TSR_LOBBY_TAB_REFRESH.adventure;
        TSR_LOBBY_TAB_REFRESH.adventure = function () {
            if (typeof prev === 'function') prev();
            refreshTsrGuideBuildPanels();
        };
    }

    const wrapSelect = (name) => {
        if (typeof window[name] !== 'function' || window[name].__tsrGuidePatched) return;
        const _orig = window[name];
        window[name] = function (...args) {
            const r = _orig.apply(this, args);
            refreshTsrGuideBuildPanels();
            return r;
        };
        window[name].__tsrGuidePatched = true;
    };
    wrapSelect('selectTsrDifficulty');
    wrapSelect('selectTsrContract');
    wrapSelect('selectTsrSubContract');
    wrapSelect('selectTsrFateCard');
    if (typeof setTsrCombatStance === 'function' && !setTsrCombatStance.__tsrGuidePatched) {
        const _orig = setTsrCombatStance;
        setTsrCombatStance = function (id) {
            const r = _orig(id);
            refreshTsrGuideBuildPanels();
            return r;
        };
        setTsrCombatStance.__tsrGuidePatched = true;
    }

    if (typeof maybeShowTsrGuide === 'function' && !maybeShowTsrGuide.__tsrGuidePatched) {
        maybeShowTsrGuide = function () { showTsrGuideFlow(true); };
        maybeShowTsrGuide.__tsrGuidePatched = true;
    }

    if (typeof startTimeSecretRealm === 'function' && !startTimeSecretRealm.__tsrGuidePatched) {
        const _orig = startTimeSecretRealm;
        startTimeSecretRealm = function () {
            _orig();
            if (player?.timeSecretRealm?.currentRun?.isActive) initTsrTutorialRun();
        };
        startTimeSecretRealm.__tsrGuidePatched = true;
    }

    if (typeof afterAction === 'function' && !afterAction.__tsrGuidePatched) {
        const _orig = afterAction;
        afterAction = function (light) {
            const r = _orig(light);
            tickTsrTutorialCoach();
            return r;
        };
        afterAction.__tsrGuidePatched = true;
    }

    if (typeof generateNewRoom === 'function' && !generateNewRoom.__tsrGuidePatched) {
        const _orig = generateNewRoom;
        generateNewRoom = function () {
            const r = _orig();
            tickTsrTutorialCoach();
            return r;
        };
        generateNewRoom.__tsrGuidePatched = true;
    }

    if (typeof ensureTsrMonsterAffixes === 'function' && !ensureTsrMonsterAffixes.__tsrGuidePatched) {
        const _orig = ensureTsrMonsterAffixes;
        ensureTsrMonsterAffixes = function (monster, opts) {
            const run = player.timeSecretRealm?.currentRun;
            if (run?.isTutorial && monster) {
                monster.affixKeys = [];
                monster.affixes = [];
                return monster;
            }
            return _orig(monster, opts);
        };
        ensureTsrMonsterAffixes.__tsrGuidePatched = true;
    }

    if (typeof computeTsrMonsterStats === 'function' && !computeTsrMonsterStats.__tsrGuidePatched) {
        const _orig = computeTsrMonsterStats;
        computeTsrMonsterStats = function (opts) {
            const stats = _orig(opts);
            const ease = player.timeSecretRealm?.currentRun?.tutorialEase;
            if (ease && ease > 0 && ease < 1 && stats) {
                return {
                    ...stats,
                    hp: Math.max(1, Math.floor(stats.hp * ease)),
                    atk: Math.max(1, Math.floor(stats.atk * ease))
                };
            }
            return stats;
        };
        computeTsrMonsterStats.__tsrGuidePatched = true;
    }

    if (typeof endTimeSecretRealm === 'function' && !endTimeSecretRealm.__tsrGuidePatched) {
        const _orig = endTimeSecretRealm;
        endTimeSecretRealm = function (reason) {
            const tsr = player?.timeSecretRealm;
            const run = tsr?.currentRun;
            const wasTutorial = !!run?.isTutorial;
            const snap = run?._tutorialMetaSnapshot || tsr?._tutorialMetaSnapshot || null;
            completeTsrTutorialIfNeeded(reason);
            const keep = {
                tutorialCompleted: tsr?.tutorialCompleted,
                tutorialRuns: tsr?.tutorialRuns
            };
            _orig(reason);
            if (wasTutorial) {
                finalizeTsrTutorialIsolation(snap, keep);
                delete tsr?._tutorialMetaSnapshot;
            }
        };
        endTimeSecretRealm.__tsrGuidePatched = true;
    }

    if (typeof updateTsrLobbyDashboard === 'function' && !updateTsrLobbyDashboard.__tsrGuidePatched) {
        const _orig = updateTsrLobbyDashboard;
        updateTsrLobbyDashboard = function () {
            _orig();
            refreshTsrGuideBuildPanels();
        };
        updateTsrLobbyDashboard.__tsrGuidePatched = true;
    }

    setTimeout(() => {
        try {
            if (typeof ensureTimeSecretRealmData === 'function') ensureTimeSecretRealmData();
            ensureTsrGuideData();
            injectTsrGuideLobbyUI();
            refreshTsrGuideBuildPanels();
            if (!player?.timeSecretRealm?.tutorialCompleted) {
                try {
                    if (!localStorage.getItem('tsr_guide_v1')) showTsrGuideFlow(false);
                } catch (e) {
                    showTsrGuideFlow(false);
                }
            }
        } catch (e) {
            console.warn('initTsrGuideExtensions deferred', e);
        }
    }, 90);
}

initTsrGuideExtensions();

/**
 * 时光秘境 · 养成表达深化
 * 灵脉技能树可视化 / 局终装备纪念展柜 / 大厅养成总览
 */
const TSR_SPIRIT_BRANCH_ROOTS = {
    charge1: 'pulse',
    heal1: 'life',
    time1: 'chrono',
    rally1: 'war',
    exp1: 'life',
    voidPulse: 'war'
};

const TSR_SPIRIT_BRANCH_META = {
    pulse: { name: '灵息支', color: '#38bdf8' },
    life: { name: '愈灵支', color: '#4ade80' },
    chrono: { name: '时序支', color: '#a78bfa' },
    war: { name: '战阵支', color: '#fb7185' },
    star: { name: '终焉星脉', color: '#fbbf24' },
    lore: { name: '图鉴支', color: '#94a3b8' },
    other: { name: '异脉', color: '#cbd5e1' }
};

function ensureTsrExpressData() {
    const tsr = player.timeSecretRealm;
    if (!tsr.equipMemorial) tsr.equipMemorial = [];
    if (!tsr.express) tsr.express = { skillTreeView: 'tree', branchFilter: 'all' };
    return tsr;
}

function getTsrSpiritSkillDepth(id, memo) {
    memo = memo || {};
    if (memo[id] != null) return memo[id];
    const sk = TSR_SPIRIT_SKILLS[id];
    if (!sk) return memo[id] = 0;
    if (!sk.need || !sk.need.length) return memo[id] = 0;
    let d = 0;
    sk.need.forEach(n => { d = Math.max(d, getTsrSpiritSkillDepth(n, memo) + 1); });
    return memo[id] = d;
}

function getTsrSpiritSkillBranch(id, memo) {
    memo = memo || {};
    if (memo[id]) return memo[id];
    if (id === 'starOrigin' || id === 'starVeil' || id === 'apocalypsePulse' || id === 'starDominion'
        || id === 'starJudgment' || id === 'starAffixBreak' || id === 'singularityCore'
        || id === 'apocalypseCrown' || id === 'eternalPulse' || id === 'nexusHeart') {
        return memo[id] = 'star';
    }
    if (id === 'affixHunter' || id === 'codexPath' || id === 'libraryPath') return memo[id] = 'lore';
    if (TSR_SPIRIT_BRANCH_ROOTS[id]) return memo[id] = TSR_SPIRIT_BRANCH_ROOTS[id];
    const sk = TSR_SPIRIT_SKILLS[id];
    if (!sk?.need?.length) return memo[id] = 'other';
    return memo[id] = getTsrSpiritSkillBranch(sk.need[0], memo);
}

function buildTsrSpiritSkillTreeLayout() {
    const memoD = {};
    const memoB = {};
    const nodes = Object.values(TSR_SPIRIT_SKILLS).map(sk => ({
        ...sk,
        depth: getTsrSpiritSkillDepth(sk.id, memoD),
        branch: getTsrSpiritSkillBranch(sk.id, memoB)
    }));
    const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0);
    const columns = [];
    for (let d = 0; d <= maxDepth; d++) {
        columns.push(nodes.filter(n => n.depth === d).sort((a, b) => a.branch.localeCompare(b.branch) || a.name.localeCompare(b.name)));
    }
    return { columns, maxDepth, nodes };
}

function renderTsrSpiritSkillTreeHtml(filter) {
    ensureTsrExpressData();
    const sp = ensureTsrSpiritPet();
    filter = filter || player.timeSecretRealm.express.branchFilter || 'all';
    const { columns } = buildTsrSpiritSkillTreeLayout();
    const branchFilters = ['all', 'pulse', 'life', 'chrono', 'war', 'lore', 'star']
        .map(b => {
            const label = b === 'all' ? '全部' : (TSR_SPIRIT_BRANCH_META[b]?.name || b);
            return `<button type="button" class="tsr-tree-filter ${filter === b ? 'active' : ''}" onclick="setTsrSpiritTreeFilter('${b}')">${label}</button>`;
        }).join('');

    const colsHtml = columns.map((col, di) => {
        const cards = col.filter(sk => filter === 'all' || sk.branch === filter).map(sk => {
            const owned = (sp.skills || []).includes(sk.id);
            const can = canUnlockTsrSpiritSkill(sk.id);
            const meta = TSR_SPIRIT_BRANCH_META[sk.branch] || TSR_SPIRIT_BRANCH_META.other;
            const needOk = (sk.need || []).every(n => (sp.skills || []).includes(n));
            return `<div class="tsr-tree-node ${owned ? 'owned' : ''} ${can ? 'can' : ''} ${!needOk && !owned ? 'locked' : ''}" style="--branch:${meta.color}" title="${sk.desc}">
                <div class="tsr-tree-node-icon">${sk.icon}</div>
                <div class="tsr-tree-node-name">${sk.name}</div>
                <div class="tsr-tree-node-cost">${sk.cost}点${sk.needEvo != null ? ' · 需终焉' : ''}</div>
                ${owned ? '<span class="tsr-tree-badge">已学</span>'
                : `<button type="button" class="tsr-btn tsr-btn-sm tsr-btn-purple" onclick="unlockTsrSpiritSkill('${sk.id}');updateTsrSpiritDisplay()" ${can ? '' : 'disabled'}>领悟</button>`}
            </div>`;
        }).join('');
        if (!cards) return '';
        return `<div class="tsr-tree-col" data-depth="${di}">
            <div class="tsr-tree-col-label">第${di + 1}脉</div>
            <div class="tsr-tree-col-nodes">${cards}</div>
        </div>`;
    }).filter(Boolean).join('');

    const learned = (sp.skills || []).length;
    const total = Object.keys(TSR_SPIRIT_SKILLS).length;
    return `
        <div class="tsr-spirit-tree-panel">
            <div class="tsr-tree-toolbar">
                <span class="tsr-tree-progress">脉络进度 ${learned}/${total} · 可用点 ${getTsrSpiritAvailableSkillPoints()}</span>
                <div class="tsr-tree-filters">${branchFilters}</div>
                <button type="button" class="tsr-btn tsr-btn-ghost tsr-btn-sm" onclick="toggleTsrSpiritSkillView()">切换列表视图</button>
            </div>
            <div class="tsr-spirit-tree-scroll">${colsHtml || '<p class="tsr-build-hint">该分支暂无节点</p>'}</div>
            <p class="tsr-build-hint">按依赖深度展开：左侧是根脉，向右进阶。彩色边框区分支脉。</p>
        </div>`;
}

function setTsrSpiritTreeFilter(branch) {
    ensureTsrExpressData();
    player.timeSecretRealm.express.branchFilter = branch || 'all';
    updateTsrSpiritDisplay();
}

function toggleTsrSpiritSkillView() {
    ensureTsrExpressData();
    const ex = player.timeSecretRealm.express;
    ex.skillTreeView = ex.skillTreeView === 'tree' ? 'list' : 'tree';
    updateTsrSpiritDisplay();
}

function scoreTsrEquipMemorialItem(item) {
    if (!item) return 0;
    const tierIdx = Math.max(0, TSR_EQUIP_TIER_ORDER.indexOf(item.tier || 'common'));
    return tierIdx * 22
        + (Number(item.enhanceLevel) || 0) * 9
        + ((item.affixes || []).length) * 6
        + (item.exclusive ? 18 : 0)
        + Math.floor(Object.values(item.stats || {}).reduce((s, v) => s + (Number(v) || 0), 0) * 40);
}

function captureTsrEquipMemorial(cleared, reason) {
    if (typeof isTsrTutorialRun === 'function' && isTsrTutorialRun()) return null;
    const tsr = player.timeSecretRealm;
    const run = tsr?.currentRun;
    if (!run?.isActive && !run?.equipped) return null;
    ensureTsrExpressData();
    const pieces = [];
    (TSR_EQUIP_SLOTS || []).forEach(slot => {
        const item = run.equipped?.[slot];
        if (!item) return;
        pieces.push({
            slot,
            slotName: TSR_EQUIP_SLOT_META?.[slot]?.name || slot,
            name: item.name,
            icon: item.icon || TSR_EQUIP_SLOT_META?.[slot]?.icon || '📦',
            tier: item.tier || 'common',
            enhance: Number(item.enhanceLevel) || 0,
            prefix: item.prefix || '',
            exclusive: !!item.exclusive,
            score: scoreTsrEquipMemorialItem(item),
            stats: typeof formatTsrEquipStatsCompact === 'function'
                ? formatTsrEquipStatsCompact(item, true, 3)
                : ''
        });
    });
    if (!pieces.length) return null;
    pieces.sort((a, b) => b.score - a.score);
    const entry = {
        id: 'em_' + Date.now().toString(36),
        at: Date.now(),
        cleared: !!cleared,
        reason: reason || '',
        difficulty: run.difficulty,
        floor: run.currentFloor,
        tutorial: !!run.isTutorial,
        pieces,
        best: pieces[0],
        totalScore: pieces.reduce((s, p) => s + p.score, 0)
    };
    tsr.equipMemorial.unshift(entry);
    if (tsr.equipMemorial.length > 12) tsr.equipMemorial.length = 12;
    return entry;
}

function renderTsrEquipMemorialPanel() {
    const el = document.getElementById('tsrEquipMemorialPanel');
    if (!el) return;
    ensureTsrExpressData();
    const list = player.timeSecretRealm.equipMemorial || [];
    if (!list.length) {
        el.innerHTML = `<div class="tsr-build-head">装备纪念展柜</div><p class="tsr-build-hint">通关或撤离时，身上的局内装备会留下剪影供回味。</p>`;
        return;
    }
    el.innerHTML = `<div class="tsr-build-head">装备纪念展柜 · ${list.length} 场</div>
        <div class="tsr-memorial-list">${list.map(e => {
            const diff = player.timeSecretRealm.difficulty?.levels?.[e.difficulty]?.name || e.difficulty || '?';
            const best = e.best;
            return `<div class="tsr-memorial-card ${e.cleared ? 'cleared' : ''}">
                <div class="tsr-memorial-meta">${e.cleared ? '通关' : '撤离'} · ${diff} · ${e.floor}层 · 评分 ${e.totalScore}</div>
                <div class="tsr-memorial-best">${best ? `${best.icon} <b>${best.name}</b> · ${(typeof formatTsrTierLabel === 'function' ? formatTsrTierLabel(best.tier) : best.tier)}+${best.enhance} · ${best.stats}` : '无装备'}</div>
                <div class="tsr-memorial-slots">${(e.pieces || []).map(p =>
                    `<span class="tsr-memorial-chip tsr-tier-${p.tier}" title="${p.stats}">${p.icon}${p.slotName}</span>`
                ).join('')}</div>
            </div>`;
        }).join('')}</div>`;
}

function appendTsrEquipMemorialToDebrief(debrief, memorial) {
    if (!memorial || !debrief) return;
    debrief.equipMemorialId = memorial.id;
    debrief.equipBest = memorial.best ? `${memorial.best.icon}${memorial.best.name}` : '';
    const overlay = document.getElementById('tsrDebriefOverlay');
    const card = overlay?.querySelector('.tsr-debrief-card');
    if (!card || card.querySelector('.tsr-debrief-equip')) return;
    const block = document.createElement('div');
    block.className = 'tsr-debrief-equip';
    block.innerHTML = `<div class="tsr-debrief-equip-title">本局装备剪影</div>
        <div class="tsr-debrief-equip-best">高光：${memorial.best ? `${memorial.best.icon} ${memorial.best.name}（${(typeof formatTsrTierLabel === 'function' ? formatTsrTierLabel(memorial.best.tier) : memorial.best.tier)}+${memorial.best.enhance}）` : '空手而归'}</div>
        <div class="tsr-memorial-slots">${memorial.pieces.map(p =>
            `<span class="tsr-memorial-chip tsr-tier-${p.tier}">${p.icon}${p.name}</span>`
        ).join('')}</div>
        <button type="button" class="tsr-btn tsr-btn-safe tsr-btn-sm" onclick="closeTsrDebrief();switchTsrLobbyTab('adventure');setTimeout(()=>document.getElementById('tsrEquipMemorialPanel')?.scrollIntoView({behavior:'smooth'}),80)">查看展柜</button>`;
    const btn = card.querySelector('button');
    if (btn) card.insertBefore(block, btn);
    else card.appendChild(block);
}

function getTsrCultivationExpressSnapshot() {
    const tsr = player.timeSecretRealm;
    const pb = tsr.permanentBonuses || {};
    const sp = typeof ensureTsrSpiritPet === 'function' ? ensureTsrSpiritPet() : { level: 1, skills: [] };
    const dg = tsr.destinyGrid?.unlocked || {};
    const train = tsr.combatTrain?.tracks || {};
    const trainSum = Object.values(train).reduce((a, b) => a + (Number(b) || 0), 0);
    const sigils = (tsr.sigils?.equipped || []).filter(Boolean).length;
    const rank = typeof getTsrCombatRankInfo === 'function' ? getTsrCombatRankInfo().cur : null;
    const dustCraft = Object.values(tsr.refineCrafted || {}).reduce((a, b) => a + b, 0);
    return {
        atk: pb.eternalAttackBonus || 0,
        hp: pb.eternalHealthBonus || 0,
        floorTime: pb.floorTimeBonus || 0,
        spiritLv: sp.level || 1,
        spiritSkills: (sp.skills || []).length,
        destinyNodes: Object.keys(dg).length,
        trainSum,
        sigils,
        rankName: rank ? `${rank.icon}${rank.name}` : '—',
        dustCraft,
        memorials: (tsr.equipMemorial || []).length,
        refineDust: tsr.refineDust || 0
    };
}

function renderTsrCultivationExpressPanel() {
    const el = document.getElementById('tsrCultivationExpressPanel');
    if (!el) return;
    const s = getTsrCultivationExpressSnapshot();
    el.innerHTML = `
        <div class="tsr-build-head">养成表达 · 永久进度</div>
        <div class="tsr-express-grid">
            <div class="tsr-express-stat"><span>永恒攻击</span><b>+${(s.atk * 100).toFixed(1)}%</b></div>
            <div class="tsr-express-stat"><span>永恒生命</span><b>+${(s.hp * 100).toFixed(1)}%</b></div>
            <div class="tsr-express-stat"><span>层阶时砂</span><b>+${s.floorTime}秒</b></div>
            <div class="tsr-express-stat"><span>精灵</span><b>Lv${s.spiritLv} · ${s.spiritSkills}脉</b></div>
            <div class="tsr-express-stat"><span>命格节点</span><b>${s.destinyNodes}</b></div>
            <div class="tsr-express-stat"><span>道场等级</span><b>${s.trainSum}</b></div>
            <div class="tsr-express-stat"><span>时纹装备</span><b>${s.sigils}/3</b></div>
            <div class="tsr-express-stat"><span>战阶</span><b>${s.rankName}</b></div>
            <div class="tsr-express-stat"><span>精炼次数</span><b>${s.dustCraft}</b></div>
            <div class="tsr-express-stat"><span>装备纪念</span><b>${s.memorials}场</b></div>
        </div>
        <div class="tsr-express-links">
            <button type="button" class="tsr-btn tsr-btn-safe tsr-btn-sm" onclick="switchTsrLobbyTab('spirit')">查看灵脉树</button>
            <button type="button" class="tsr-btn tsr-btn-safe tsr-btn-sm" onclick="switchTsrLobbyTab('systems')">命格盘</button>
            <button type="button" class="tsr-btn tsr-btn-safe tsr-btn-sm" onclick="switchTsrLobbyTab('combattrain')">战修</button>
            <button type="button" class="tsr-btn tsr-btn-safe tsr-btn-sm" onclick="switchTsrLobbyTab('legends')">时纹/通缉</button>
        </div>`;
}

function injectTsrExpressLobbyUI() {
    const adv = document.getElementById('tsrTabAdventure');
    if (!adv) return;
    const main = adv.querySelector('.tsr-adventure-main') || adv;
    if (!document.getElementById('tsrCultivationExpressPanel')) {
        const sec = document.createElement('section');
        sec.className = 'tsr-express-section';
        sec.innerHTML = `<div id="tsrCultivationExpressPanel"></div><div id="tsrEquipMemorialPanel" class="tsr-memorial-panel"></div>`;
        const buildWrap = document.getElementById('tsrBuildSummary')?.parentElement;
        if (buildWrap?.parentNode) buildWrap.parentNode.insertBefore(sec, buildWrap.nextSibling);
        else {
            const actions = main.querySelector('.tsr-lobby-actions');
            if (actions) main.insertBefore(sec, actions);
            else main.appendChild(sec);
        }
    }
}

function refreshTsrExpressPanels() {
    renderTsrCultivationExpressPanel();
    renderTsrEquipMemorialPanel();
}

function initTsrExpressExtensions() {
    ensureTsrExpressData();

    if (typeof TSR_LOBBY_TAB_REFRESH === 'object') {
        const prevAdv = TSR_LOBBY_TAB_REFRESH.adventure;
        TSR_LOBBY_TAB_REFRESH.adventure = function () {
            if (typeof prevAdv === 'function') prevAdv();
            refreshTsrExpressPanels();
        };
        const prevSpirit = TSR_LOBBY_TAB_REFRESH.spirit;
        TSR_LOBBY_TAB_REFRESH.spirit = function () {
            if (typeof prevSpirit === 'function') prevSpirit();
            // updateTsrSpiritDisplay already paints tree via patch
        };
    }

    if (typeof updateTsrSpiritDisplay === 'function' && !updateTsrSpiritDisplay.__tsrExpressPatched) {
        const _orig = updateTsrSpiritDisplay;
        updateTsrSpiritDisplay = function () {
            ensureTsrExpressData();
            const view = player.timeSecretRealm.express.skillTreeView || 'tree';
            if (view === 'list') {
                _orig();
            const wrap = document.querySelector('.tsr-spirit-skills-wrap');
            if (wrap && !wrap.querySelector('[data-tsr-tree-toggle]')) {
                const bar = document.createElement('div');
                bar.className = 'tsr-tree-toolbar';
                bar.innerHTML = `<button type="button" class="tsr-btn tsr-btn-ghost tsr-btn-sm" data-tsr-tree-toggle onclick="toggleTsrSpiritSkillView()">切换脉络图视图</button>`;
                const title = wrap.querySelector('.tsr-block-title');
                if (title && title.nextSibling) wrap.insertBefore(bar, title.nextSibling);
                else wrap.insertBefore(bar, wrap.firstChild);
            }
            return;
            }
            _orig();
            const wrap = document.querySelector('.tsr-spirit-skills-wrap');
            if (!wrap) return;
            const list = wrap.querySelector('.tsr-spirit-skills');
            if (list) list.style.display = 'none';
            let treeHost = wrap.querySelector('.tsr-spirit-tree-panel');
            if (treeHost) treeHost.remove();
            wrap.insertAdjacentHTML('beforeend', renderTsrSpiritSkillTreeHtml(player.timeSecretRealm.express.branchFilter));
        };
        updateTsrSpiritDisplay.__tsrExpressPatched = true;
    }

    if (typeof unlockTsrSpiritSkill === 'function' && !unlockTsrSpiritSkill.__tsrExpressPatched) {
        const _orig = unlockTsrSpiritSkill;
        unlockTsrSpiritSkill = function (id) {
            const r = _orig(id);
            // display refresh already called by buttons
            return r;
        };
        unlockTsrSpiritSkill.__tsrExpressPatched = true;
    }

    if (typeof endTimeSecretRealm === 'function' && !endTimeSecretRealm.__tsrExpressPatched) {
        const _orig = endTimeSecretRealm;
        endTimeSecretRealm = function (reason) {
            const flags = typeof resolveTsrEndClearFlags === 'function'
                ? resolveTsrEndClearFlags(reason)
                : { debriefAsCleared: false, countsAsClearCount: false };
            captureTsrEquipMemorial(!!(flags.countsAsClearCount || flags.debriefAsCleared || flags.metaClear), reason);
            _orig(reason);
            setTimeout(() => refreshTsrExpressPanels(), 350);
        };
        endTimeSecretRealm.__tsrExpressPatched = true;
    }

    if (typeof showTsrDebrief === 'function' && !showTsrDebrief.__tsrExpressPatched) {
        const _orig = showTsrDebrief;
        showTsrDebrief = function (debrief) {
            _orig(debrief);
            const memorial = player.timeSecretRealm?.equipMemorial?.[0];
            if (memorial && debrief && Math.abs((memorial.at || 0) - (debrief.at || 0)) < 5000) {
                appendTsrEquipMemorialToDebrief(debrief, memorial);
            }
        };
        showTsrDebrief.__tsrExpressPatched = true;
    }

    if (typeof updateTsrLobbyDashboard === 'function' && !updateTsrLobbyDashboard.__tsrExpressPatched) {
        const _orig = updateTsrLobbyDashboard;
        updateTsrLobbyDashboard = function () {
            _orig();
            refreshTsrExpressPanels();
            const side = document.getElementById('tsrDashboardContent');
            if (!side || side.querySelector('.tsr-dash-express')) return;
            const s = getTsrCultivationExpressSnapshot();
            const card = document.createElement('div');
            card.className = 'tsr-dash-card tsr-dash-express';
            card.innerHTML = `<div class="tsr-block-title">🌌 养成表达</div>
                <p>攻+${(s.atk * 100).toFixed(1)}% · 血+${(s.hp * 100).toFixed(1)}%</p>
                <p>精灵 Lv${s.spiritLv}/${s.spiritSkills}脉 · 展柜 ${s.memorials}</p>`;
            side.appendChild(card);
        };
        updateTsrLobbyDashboard.__tsrExpressPatched = true;
    }

    setTimeout(() => {
        injectTsrExpressLobbyUI();
        refreshTsrExpressPanels();
    }, 100);
}

initTsrExpressExtensions();

/**
 * 时光秘境 · 大厅 UI 收束层（须最后加载）
 * - 一级 Tab 收敛为 7 个，养成/活动/世界走二级子导航
 * - 冒险主栏：难度/契约渐进披露、构筑折叠、养成移出、CTA 粘底
 * - 玩法模式并入紧凑选择条
 * - 侧栏 dash-card 硬上限 5
 */
(function initTsrLayoutExtensions() {
    const TSR_LAYOUT_PRIMARY = [
        { id: 'adventure', label: '⚔️ 冒险', panel: null },
        { id: 'activity', label: '🎁 活动', hub: true },
        { id: 'shop', label: '🏪 商店', panel: null },
        { id: 'grow', label: '🌱 养成', hub: true },
        { id: 'codex', label: '📖 图鉴', panel: null },
        { id: 'realm', label: '🌐 世界', hub: true },
        { id: 'achievements', label: '🏆 成就', panel: null }
    ];

    const TSR_LAYOUT_HUBS = {
        activity: {
            label: '活动',
            default: 'welfare',
            children: [
                { id: 'welfare', label: '🎁 福利中心' },
                { id: 'quests', label: '📅 日常周常' },
                { id: 'season', label: '🏅 赛季' }
            ]
        },
        grow: {
            label: '养成',
            default: 'spirit',
            children: [
                { id: 'spirit', label: '🧚 精灵' },
                { id: 'systems', label: '🔮 命格' },
                { id: 'combattrain', label: '⚔️ 战修' },
                { id: 'badges', label: '🏅 徽章' }
            ]
        },
        realm: {
            label: '世界',
            default: 'faction',
            children: [
                { id: 'faction', label: '🏛️ 势力' },
                { id: 'endgame', label: '♾️ 终局' },
                { id: 'legends', label: '🚩 传说' }
            ]
        }
    };

    const TSR_NESTED_TAB_IDS = new Set(
        Object.values(TSR_LAYOUT_HUBS).flatMap(h => h.children.map(c => c.id))
    );

    const TSR_DIFF_PRIMARY = new Set([
        'easy', 'normal', 'hard', 'nightmare', 'hell'
    ]);

    let _layoutApplied = false;
    let _activeLeafTab = 'adventure';
    let _layoutOrigSwitch = null;

    function findHubForTab(tabId) {
        for (const [hubId, hub] of Object.entries(TSR_LAYOUT_HUBS)) {
            if (hub.children.some(c => c.id === tabId)) return hubId;
        }
        return null;
    }

    function ensureTsrSubnav() {
        const lobby = document.getElementById('tsrLobbyPanel');
        if (!lobby || document.getElementById('tsrLayoutSubnav')) return;
        const sub = document.createElement('div');
        sub.id = 'tsrLayoutSubnav';
        sub.className = 'tsr-layout-subnav';
        sub.hidden = true;
        const nav = lobby.querySelector('.tsr-tab-nav');
        if (nav?.parentNode) nav.parentNode.insertBefore(sub, nav.nextSibling);
        else lobby.insertBefore(sub, lobby.firstChild);
    }

    function renderTsrSubnav(hubId, activeLeaf) {
        const sub = document.getElementById('tsrLayoutSubnav');
        const hub = TSR_LAYOUT_HUBS[hubId];
        if (!sub || !hub) {
            if (sub) sub.hidden = true;
            return;
        }
        sub.hidden = false;
        sub.innerHTML = hub.children.map(c => `
            <button type="button" class="tsr-layout-subbtn${c.id === activeLeaf ? ' active' : ''}"
                data-tsr-sub="${c.id}" onclick="switchTsrLobbyTab('${c.id}')">${c.label}</button>`).join('');
    }

    function rebuildTsrPrimaryTabNav() {
        const nav = document.querySelector('#tsrLobbyPanel .tsr-tab-nav');
        if (!nav) return;

        const PRIMARY_IDS = new Set(TSR_LAYOUT_PRIMARY.map(t => t.id));
        const HIDE_LEAF = new Set(['welfare', 'quests', 'spirit', ...TSR_NESTED_TAB_IDS]);

        // 隐藏旧叶子一级按钮（含各 ext 注入）
        nav.querySelectorAll('.tsr-tab-btn').forEach(btn => {
            const id = btn.dataset.tsrTab;
            if (!id) return;
            if (PRIMARY_IDS.has(id)) {
                btn.classList.remove('tsr-tab-btn--nested');
                btn.hidden = false;
                return;
            }
            if (HIDE_LEAF.has(id) || !PRIMARY_IDS.has(id)) {
                btn.classList.add('tsr-tab-btn--nested');
                btn.hidden = true;
            }
        });

        // 确保枢纽按钮存在
        TSR_LAYOUT_PRIMARY.forEach(tab => {
            let btn = nav.querySelector(`.tsr-tab-btn[data-tsr-tab="${tab.id}"]`);
            if (!btn) {
                btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'tsr-tab-btn';
                btn.dataset.tsrTab = tab.id;
                nav.appendChild(btn);
            }
            btn.hidden = false;
            btn.classList.remove('tsr-tab-btn--nested');
            const keepBadges = [...btn.querySelectorAll('.tsr-tab-badge')];
            btn.textContent = tab.label;
            keepBadges.forEach(b => btn.appendChild(b));
            btn.onclick = () => switchTsrLobbyTab(tab.id);
        });

        // 福利/日常徽标挂到「活动」
        const activityBtn = nav.querySelector('[data-tsr-tab="activity"]');
        const welfareBadge = document.getElementById('tsrWelfareBadge');
        const questBadge = document.getElementById('tsrQuestBadge');
        if (activityBtn && welfareBadge && welfareBadge.parentElement !== activityBtn) {
            activityBtn.appendChild(welfareBadge);
        }
        if (activityBtn && questBadge && questBadge.parentElement !== activityBtn) {
            activityBtn.appendChild(questBadge);
        }

        // 稳定顺序
        TSR_LAYOUT_PRIMARY.forEach(tab => {
            const btn = nav.querySelector(`.tsr-tab-btn[data-tsr-tab="${tab.id}"]`);
            if (btn) nav.appendChild(btn);
        });
        nav.classList.add('tsr-tab-nav--layout');
    }

    function switchTsrLobbyTabLayout(tabId) {
        let leaf = tabId;
        let hubId = null;

        if (TSR_LAYOUT_HUBS[tabId]) {
            hubId = tabId;
            leaf = TSR_LAYOUT_HUBS[tabId].default;
            // 若上次停在该 hub 的子页，尽量还原
            const last = _activeLeafTab;
            if (findHubForTab(last) === hubId) leaf = last;
        } else {
            hubId = findHubForTab(tabId);
        }

        _activeLeafTab = leaf;

        // 一级高亮：叶子归属的 hub / 自身
        const primaryActive = hubId || leaf;
        document.querySelectorAll('#tsrLobbyPanel .tsr-tab-nav .tsr-tab-btn').forEach(btn => {
            if (btn.classList.contains('tsr-tab-btn--nested') || btn.hidden) {
                btn.classList.remove('active');
                return;
            }
            btn.classList.toggle('active', btn.dataset.tsrTab === primaryActive);
        });

        renderTsrSubnav(hubId, leaf);

        const panelMap = Object.assign({
            adventure: 'tsrTabAdventure',
            welfare: 'tsrTabWelfare',
            shop: 'tsrTabShop',
            spirit: 'tsrTabSpirit',
            codex: 'tsrTabCodex',
            achievements: 'tsrTabAchievements',
            quests: 'tsrTabQuests'
        }, typeof TSR_EXTRA_LOBBY_TABS === 'object' ? TSR_EXTRA_LOBBY_TABS : {});

        const targetId = panelMap[leaf];
        document.querySelectorAll('#tsrLobbyPanel .tsr-tab-panel').forEach(panel => {
            panel.classList.toggle('active', !!targetId && panel.id === targetId);
        });

        const refresher = typeof TSR_LOBBY_TAB_REFRESH === 'object' ? TSR_LOBBY_TAB_REFRESH[leaf] : null;
        if (typeof refresher === 'function') {
            try { refresher(); } catch (e) { /* ignore */ }
        }

        if (leaf === 'adventure') {
            try { polishTsrAdventureLayout(); } catch (e) { /* ignore */ }
        }
    }

    function wrapCollapsible(section, opts) {
        if (!section || section.closest('.tsr-layout-collapse')) return;
        const {
            title = '折叠区块',
            open = false,
            summaryId = '',
            className = ''
        } = opts || {};
        const wrap = document.createElement('details');
        wrap.className = `tsr-layout-collapse ${className}`.trim();
        if (open) wrap.open = true;
        const sum = document.createElement('summary');
        sum.className = 'tsr-layout-collapse-sum';
        sum.innerHTML = `<span class="tsr-layout-collapse-title">${title}</span>` +
            (summaryId ? `<span id="${summaryId}" class="tsr-layout-collapse-meta"></span>` : '');
        section.parentNode.insertBefore(wrap, section);
        wrap.appendChild(sum);
        wrap.appendChild(section);
        section.classList.add('tsr-layout-collapse-body');
        return wrap;
    }

    function updateContractCollapseMeta() {
        const meta = document.getElementById('tsrContractCollapseMeta');
        if (!meta) return;
        const primary = document.querySelector('.tsr-contract-card[data-role="primary"].active b')?.textContent || '无契约';
        const subSec = document.getElementById('tsrSubContractSection');
        const subVisible = subSec && subSec.style.display !== 'none';
        const sub = subVisible
            ? (document.querySelector('.tsr-contract-card[data-role="sub"].active b')?.textContent || '无副约')
            : '';
        meta.textContent = subVisible ? `${primary} · ${sub}` : primary;
    }

    function updateDiffCollapseMeta() {
        const meta = document.getElementById('tsrDiffCollapseMeta');
        if (!meta) return;
        const active = document.querySelector('.tsr-diff-card.active .tsr-diff-name')?.textContent
            || document.querySelector('.tsr-diff-card.active')?.dataset?.difficulty
            || '未选';
        meta.textContent = active;
    }

    function applyDifficultyProgressive() {
        const section = document.getElementById('tsrDifficultySelection');
        if (!section || section.dataset.layoutDiff === '1') return;
        section.dataset.layoutDiff = '1';

        const cards = section.querySelector('.tsr-diff-cards');
        if (!cards) return;

        cards.querySelectorAll('.tsr-diff-card').forEach(card => {
            const d = card.dataset.difficulty;
            if (d && !TSR_DIFF_PRIMARY.has(d)) {
                card.classList.add('tsr-diff-card--extra');
            }
        });

        if (!section.querySelector('.tsr-diff-more-btn')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'tsr-btn tsr-btn-ghost tsr-btn-sm tsr-diff-more-btn';
            btn.textContent = '展开更高难度';
            btn.onclick = () => {
                const open = cards.classList.toggle('tsr-diff-cards--expanded');
                btn.textContent = open ? '收起高难档' : '展开更高难度';
            };
            const info = section.querySelector('.tsr-diff-detail');
            if (info) section.insertBefore(btn, info);
            else section.appendChild(btn);
        }

        // 若已选高难，自动展开
        const active = cards.querySelector('.tsr-diff-card.active');
        if (active?.classList.contains('tsr-diff-card--extra')) {
            cards.classList.add('tsr-diff-cards--expanded');
            const btn = section.querySelector('.tsr-diff-more-btn');
            if (btn) btn.textContent = '收起高难档';
        }
    }

    function compactTsrModeBox() {
        const box = document.querySelector('#tsrTabAdventure .tsr-mode-box');
        if (!box || box.dataset.layoutMode === '1') return;
        box.classList.add('tsr-mode-box--compact');

        const titleEl = box.querySelector('.tsr-block-title');
        if (titleEl) titleEl.textContent = '玩法';
        const hintEl = box.querySelector('#tsrDailyModHint');

        const buttons = [...box.querySelectorAll(':scope > button.tsr-btn, :scope > .tsr-btn')];
        // 兼容已包裹过的情况
        const allBtns = buttons.length
            ? buttons
            : [...box.querySelectorAll('button.tsr-btn')].filter(b => !b.closest('.tsr-mode-park'));
        if (!allBtns.length || box.querySelector('.tsr-mode-compact')) return;
        box.dataset.layoutMode = '1';

        const isPrimary = (b) =>
            b.id === 'tsrTutorialBtn' ||
            b.id === 'tsrBossRushBtn' ||
            /startTsrBossRush|maybeShowTsrGuide|showTsrGuideFlow|startTsrTutorialRun/.test(b.getAttribute('onclick') || '');

        const primary = allBtns.filter(isPrimary);
        const rest = allBtns.filter(b => !isPrimary(b));

        const row = document.createElement('div');
        row.className = 'tsr-mode-compact';
        const mainRow = document.createElement('div');
        mainRow.className = 'tsr-mode-compact-main';
        primary.forEach(b => mainRow.appendChild(b));

        if (rest.length) {
            const park = document.createElement('div');
            park.className = 'tsr-mode-park';
            rest.forEach((b, i) => {
                b.dataset.modeExtraIdx = String(i);
                b.classList.add('tsr-mode-btn--parked');
                park.appendChild(b);
            });

            const sel = document.createElement('select');
            sel.className = 'tsr-mode-select';
            sel.id = 'tsrModeExtraSelect';
            sel.innerHTML = `<option value="">更多挑战…</option>` +
                rest.map((b, i) => `<option value="${i}">${(b.textContent || '').trim()}</option>`).join('');
            sel.onchange = () => {
                const idx = sel.value;
                if (idx === '') return;
                const btn = park.querySelector(`[data-mode-extra-idx="${idx}"]`);
                if (btn) btn.click();
                sel.value = '';
            };
            mainRow.appendChild(sel);
            row.appendChild(mainRow);
            row.appendChild(park);
        } else {
            row.appendChild(mainRow);
        }

        // 只保留标题 + 提示 + 紧凑行（不销毁已挪入的按钮）
        [...box.childNodes].forEach(node => {
            if (node === titleEl || node === hintEl) return;
            if (node.nodeType === 1 && (node.classList?.contains('tsr-block-title') || node.id === 'tsrDailyModHint')) return;
            box.removeChild(node);
        });
        if (titleEl && titleEl.parentNode !== box) box.insertBefore(titleEl, box.firstChild);
        if (hintEl && hintEl.parentNode !== box) box.appendChild(hintEl);
        box.appendChild(row);
    }

    function moveExpressOutOfAdventure() {
        const sec = document.querySelector('#tsrTabAdventure .tsr-express-section');
        if (!sec) return;
        const growHost = document.getElementById('tsrTabSpirit');
        if (!growHost) return;
        let dock = document.getElementById('tsrExpressGrowDock');
        if (!dock) {
            dock = document.createElement('div');
            dock.id = 'tsrExpressGrowDock';
            dock.className = 'tsr-express-grow-dock';
            growHost.insertBefore(dock, growHost.firstChild);
        }
        if (sec.parentElement !== dock) dock.appendChild(sec);
    }

    function ensureStickyStartDock() {
        const main = document.querySelector('#tsrTabAdventure .tsr-adventure-main');
        const actions = main?.querySelector('.tsr-lobby-actions');
        if (!main || !actions || actions.dataset.layoutSticky === '1') return;
        actions.dataset.layoutSticky = '1';
        actions.classList.add('tsr-lobby-actions--sticky');
        // 移到 main 末尾，保证永远在可粘区域
        main.appendChild(actions);
    }

    function collapseAdventureSections() {
        const diff = document.getElementById('tsrDifficultySelection');
        if (diff && !diff.closest('.tsr-layout-collapse')) {
            wrapCollapsible(diff, {
                title: '🎯 难度',
                open: true,
                summaryId: 'tsrDiffCollapseMeta',
                className: 'tsr-layout-collapse--diff'
            });
        }

        const primaryContract = document.querySelector('#tsrTabAdventure .tsr-contract-section:not(.tsr-sub-contract)');
        if (primaryContract && !primaryContract.closest('.tsr-layout-collapse')) {
            wrapCollapsible(primaryContract, {
                title: '📜 契约',
                open: false,
                summaryId: 'tsrContractCollapseMeta',
                className: 'tsr-layout-collapse--contract'
            });
        }

        const sub = document.getElementById('tsrSubContractSection');
        if (sub && !sub.closest('.tsr-layout-collapse')) {
            // 副契约并进主契约折叠体内
            const host = primaryContract?.closest('.tsr-layout-collapse');
            if (host && sub.parentElement !== host) {
                host.appendChild(sub);
            }
        }

        const fate = document.getElementById('tsrFateCardSection');
        if (fate && !fate.closest('.tsr-layout-collapse')) {
            wrapCollapsible(fate, {
                title: '🃏 命运卡牌',
                open: true,
                className: 'tsr-layout-collapse--fate'
            });
        }

        const buildWrap = document.querySelector('#tsrTabAdventure .tsr-build-wrap');
        if (buildWrap && !buildWrap.closest('.tsr-layout-collapse')) {
            wrapCollapsible(buildWrap, {
                title: '🧩 构筑摘要 · 预设',
                open: false,
                className: 'tsr-layout-collapse--build'
            });
        }

        // 弱化统计芯片（顶栏已有）
        const stats = document.querySelector('#tsrTabAdventure .tsr-stats-row');
        if (stats) stats.classList.add('tsr-stats-row--muted');
    }

    function slimTsrDashboard() {
        const side = document.getElementById('tsrDashboardContent');
        if (!side) return;

        // 排除折叠容器自身，否则二次收束会把自己 append 进自己 → HierarchyRequestError
        const cards = [...side.querySelectorAll(':scope > .tsr-dash-card')].filter(
            card => !card.classList.contains('tsr-dash-more')
        );
        if (!cards.length) {
            const orphanMore = side.querySelector(':scope > .tsr-dash-more');
            if (orphanMore && !orphanMore.querySelector('.tsr-dash-more-body')?.children?.length) {
                orphanMore.remove();
            }
            return;
        }

        const keep = [];
        const fold = [];

        cards.forEach(card => {
            if (card.classList.contains('tsr-dash-rank')) keep.push(card);
            else if (card.classList.contains('tsr-dash-fortune')) keep.push(card);
            else if (card.classList.contains('tsr-dash-spirit')) keep.push(card);
            else if (card.classList.contains('tsr-dash-challenge') && !card.classList.contains('tsr-dash-fortune')) {
                // 只保留「今日挑战」一张（用奖励文案识别）；周界词与星运已分别保留
                const title = card.querySelector('.tsr-block-title')?.textContent || '';
                if (/今日挑战/.test(title) && keep.filter(c => /今日挑战/.test(c.querySelector('.tsr-block-title')?.textContent || '')).length === 0) {
                    keep.push(card);
                } else if (/本周界词/.test(title) && !keep.some(c => /本周界词/.test(c.querySelector('.tsr-block-title')?.textContent || ''))) {
                    keep.push(card);
                } else {
                    fold.push(card);
                }
            } else {
                fold.push(card);
            }
        });

        // 硬上限 5：超出的 keep 也进 fold
        while (keep.length > 5) fold.unshift(keep.pop());

        let more = side.querySelector(':scope > .tsr-dash-more');
        if (fold.length) {
            if (!more) {
                more = document.createElement('details');
                more.className = 'tsr-dash-card tsr-dash-more';
                more.innerHTML = '<summary class="tsr-dash-more-sum">更多情报</summary><div class="tsr-dash-more-body"></div>';
            }
            let body = more.querySelector('.tsr-dash-more-body');
            if (!body) {
                body = document.createElement('div');
                body.className = 'tsr-dash-more-body';
                more.appendChild(body);
            }
            fold.forEach(card => {
                if (!card || card === more || card.contains(more)) return;
                card.classList.add('tsr-dash-card--folded');
                if (card.parentElement !== body) body.appendChild(card);
            });
            [...body.children].forEach(child => {
                if (!fold.includes(child)) child.remove();
            });
            if (!more.isConnected) side.appendChild(more);
            const sum = more.querySelector('.tsr-dash-more-sum');
            if (sum) sum.textContent = `更多情报（${fold.length}）`;
        } else if (more) {
            more.remove();
            more = null;
        }

        // 按序重排 keep
        keep.forEach(card => {
            if (card && card !== more) side.appendChild(card);
        });
        if (more) side.appendChild(more);
    }

    function polishTsrAdventureLayout() {
        ensureTsrSubnav();
        rebuildTsrPrimaryTabNav();
        applyDifficultyProgressive();
        collapseAdventureSections();
        compactTsrModeBox();
        moveExpressOutOfAdventure();
        ensureStickyStartDock();
        updateContractCollapseMeta();
        updateDiffCollapseMeta();
        _layoutApplied = true;
    }

    function patchSwitchTab() {
        _layoutOrigSwitch = typeof switchTsrLobbyTab === 'function' ? switchTsrLobbyTab : null;
        switchTsrLobbyTab = function (tabId) {
            switchTsrLobbyTabLayout(tabId);
        };
        switchTsrLobbyTab.__tsrLayoutPatched = true;
    }

    function patchDashboard() {
        if (typeof updateTsrLobbyDashboard !== 'function' || updateTsrLobbyDashboard.__tsrLayoutPatched) return;
        const _orig = updateTsrLobbyDashboard;
        updateTsrLobbyDashboard = function () {
            _orig();
            slimTsrDashboard();
            updateContractCollapseMeta();
            updateDiffCollapseMeta();
        };
        updateTsrLobbyDashboard.__tsrLayoutPatched = true;
    }

    function patchSelectors() {
        ['selectTsrDifficulty', 'selectTsrContract', 'selectTsrSubContract'].forEach(name => {
            if (typeof window[name] !== 'function' || window[name].__tsrLayoutMetaPatched) return;
            const _orig = window[name];
            window[name] = function (...args) {
                const r = _orig.apply(this, args);
                updateContractCollapseMeta();
                updateDiffCollapseMeta();
                // 选中高难时自动展开
                if (name === 'selectTsrDifficulty') {
                    const cards = document.querySelector('.tsr-diff-cards');
                    const active = cards?.querySelector('.tsr-diff-card.active');
                    if (active?.classList.contains('tsr-diff-card--extra') && cards) {
                        cards.classList.add('tsr-diff-cards--expanded');
                        const btn = document.querySelector('.tsr-diff-more-btn');
                        if (btn) btn.textContent = '收起高难档';
                    }
                }
                return r;
            };
            window[name].__tsrLayoutMetaPatched = true;
        });
    }

    function syncActivityBadges() {
        // 福利/日常 badge 已挂在活动按钮上，显示逻辑沿用原 id
        const activityBtn = document.querySelector('.tsr-tab-btn[data-tsr-tab="activity"]');
        if (!activityBtn) return;
        const badges = activityBtn.querySelectorAll('.tsr-tab-badge');
        let any = false;
        badges.forEach(b => {
            if (b.style.display === 'flex' || b.classList.contains('show') || (b.textContent || '').trim()) {
                any = true;
            }
        });
        // 不改动原 badge 刷新，只确保可见容器
    }

    // hub 刷新登记
    if (typeof TSR_LOBBY_TAB_REFRESH === 'object') {
        TSR_LOBBY_TAB_REFRESH.activity = function () {
            const fn = TSR_LOBBY_TAB_REFRESH.welfare;
            if (typeof fn === 'function') fn();
        };
        TSR_LOBBY_TAB_REFRESH.grow = function () {
            const fn = TSR_LOBBY_TAB_REFRESH.spirit;
            if (typeof fn === 'function') fn();
        };
        TSR_LOBBY_TAB_REFRESH.realm = function () {
            const fn = TSR_LOBBY_TAB_REFRESH.faction;
            if (typeof fn === 'function') fn();
        };
    }

    patchSwitchTab();
    patchDashboard();
    patchSelectors();

    // 等待各 ext inject 完成后再收束 DOM
    const boot = () => {
        polishTsrAdventureLayout();
        slimTsrDashboard();
        syncActivityBadges();
        // 保持当前页：若大厅已开在冒险
        if (document.getElementById('tsrTabAdventure')?.classList.contains('active')) {
            switchTsrLobbyTabLayout('adventure');
        }
    };

    setTimeout(boot, 220);
    setTimeout(boot, 600);

    if (typeof window !== 'undefined') {
        window.polishTsrAdventureLayout = polishTsrAdventureLayout;
        window.slimTsrDashboard = slimTsrDashboard;
    }
})();

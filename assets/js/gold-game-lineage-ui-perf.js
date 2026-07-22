/**
 * 家族传承 · UI 刷新性能
 * 按当前页签只刷新可见面板，切断「一次刷全家」级联。
 * 须在全部 lineage / descendants 脚本之后加载。
 */
(function () {
    'use strict';
    if (window.__lineageUiPerfInstalled) return;
    window.__lineageUiPerfInstalled = true;

    window.childTabIn = function (tabs) {
        if (window.__lineageForceFullRefresh) return true;
        var t = (typeof _childActiveTab !== 'undefined' && _childActiveTab) || '';
        if (!tabs || !tabs.length) return true;
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] === t) return true;
        }
        return false;
    };

    window.getChildActiveTab = function () {
        return (typeof _childActiveTab !== 'undefined' && _childActiveTab) || 'overview';
    };

    /** 仅刷新当前（或指定）页签相关面板 */
    window.refreshActiveChildTabPanels = function (tab) {
        tab = tab || window.getChildActiveTab();
        var ui = document.getElementById('childSystemUI');
        if (!ui) return;

        switch (tab) {
            case 'illness':
            case 'living':
            case 'marital':
            case 'eighteen':
            case 'realty':
                if (typeof updateLivingPanels === 'function') updateLivingPanels();
                if (tab === 'eighteen' && typeof updateEighteenLifePanels === 'function') updateEighteenLifePanels();
                if (tab === 'realty' && typeof updateRealLifePanels === 'function') updateRealLifePanels();
                break;
            case 'descendants':
                if (typeof updateDescendantPanels === 'function') updateDescendantPanels();
                break;
            case 'descplus':
                if (typeof updateDescPlusPanels === 'function') updateDescPlusPanels();
                break;
            case 'eightdepth':
                if (typeof updateEighteenDepthPanels === 'function') updateEighteenDepthPanels();
                break;
            case 'descnova':
                if (typeof updateDescNovaPanels === 'function') updateDescNovaPanels();
                break;
            case 'descsaga':
                if (typeof updateDescSagaPanels === 'function') updateDescSagaPanels();
                break;
            case 'descchro':
                if (typeof updateDescChroniclePanels === 'function') updateDescChroniclePanels();
                break;
            case 'descflow':
                if (typeof updateDescFlowPanels === 'function') updateDescFlowPanels();
                break;
            case 'descnpc':
                if (typeof updateDescNpcPanels === 'function') updateDescNpcPanels();
                break;
            case 'life':
            case 'estate':
            case 'festival':
            case 'feast':
            case 'precept':
            case 'trial':
                if (typeof updateLifeSimPanels === 'function') updateLifeSimPanels();
                break;
            case 'martial':
                if (typeof updateMartialPanels === 'function') updateMartialPanels();
                break;
            case 'talent':
            case 'business':
            case 'ancestral':
            case 'quests':
            case 'events':
            case 'glory':
                if (typeof updateLineageExtUI === 'function') {
                    window.__lineageExtOnly = true;
                    try { updateLineageExtUI(); } finally { window.__lineageExtOnly = false; }
                }
                break;
            case 'cultivate':
            case 'spiritroot':
            case 'dongfu':
            case 'alchemy':
            case 'artifact':
            case 'tribulation':
                if (typeof updateXianPanels === 'function') updateXianPanels();
                break;
            case 'lineage':
                if (typeof updateLineageOverview === 'function') updateLineageOverview();
                if (typeof updateLineageActionList === 'function') updateLineageActionList();
                if (typeof updateLineageMilestones === 'function') updateLineageMilestones();
                if (typeof enhanceLineageMarriageUI === 'function') enhanceLineageMarriageUI();
                if (typeof updateLivingPanels === 'function') updateLivingPanels();
                break;
            case 'tree':
                if (typeof updateFamilyTreeView === 'function') updateFamilyTreeView();
                break;
            case 'overview':
                if (typeof updateGrowthOverview === 'function') updateGrowthOverview();
                if (typeof updateLineageOverview === 'function') updateLineageOverview();
                if (typeof updatePregnancyStatus === 'function') updatePregnancyStatus();
                if (typeof updateConceptionButton === 'function') updateConceptionButton();
                if (typeof updateLivingPanels === 'function') updateLivingPanels();
                break;
            case 'birth':
                if (typeof updatePregnancyStatus === 'function') updatePregnancyStatus();
                if (typeof updateConceptionButton === 'function') updateConceptionButton();
                if (typeof updateLivingPanels === 'function') updateLivingPanels();
                break;
            case 'offspring':
                if (typeof updateChildrenList === 'function') updateChildrenList();
                break;
            case 'train':
                if (typeof updateTrainingSection === 'function') updateTrainingSection();
                break;
            case 'work':
                if (typeof updateChildWorkSystem === 'function') updateChildWorkSystem();
                break;
            case 'interact':
                if (typeof updateChildInteractionSystem === 'function') updateChildInteractionSystem();
                break;
            default:
                break;
        }
    };

    // 切断 updateLivingPanels 上挂的「刷全部子孙页」包装：只保留 living/deep/real 核心链
    // 做法：保存最终包装函数后，用按 tab 分发的版本替换；核心链通过临时 force 跑一遍不可行（仍会全刷）。
    // 因此各模块 wrap 已改为 childTabIn 门禁；此处再包一层总闸，非相关页签直接跳过。
    var _livingAll = window.updateLivingPanels;
    window.updateLivingPanels = function () {
        if (window.__lineageForceFullRefresh || window.childTabIn([
            'illness', 'living', 'marital', 'eighteen', 'realty', 'lineage', 'overview', 'birth'
        ])) {
            if (_livingAll) _livingAll();
        }
    };

    var _origSwitch = window.switchChildTab;
    window.switchChildTab = function (tab) {
        if (_origSwitch) _origSwitch(tab);
        // 切页时只刷目标页，避免连带重建
        try {
            window.refreshActiveChildTabPanels(tab || window.getChildActiveTab());
        } catch (e) { /* ignore */ }
        try {
            if (typeof window.applyChildSubTabForPrimary === 'function') {
                window.applyChildSubTabForPrimary(tab || window.getChildActiveTab());
            }
        } catch (e2) { /* ignore */ }
    };

    // —— 页内二级标签（并入本文件，避免旧版 boot 未加载 lineage-subtabs.js）——
    if (!window.__lineageSubTabsInstalled) {
        window.__lineageSubTabsInstalled = true;
        window.__childSubTabState = window.__childSubTabState || {};

        var SUBTAB_MAP = {
            childSectionDescendants: [
                { id: 'overview', label: '总览立嫡' },
                { id: 'study', label: '修业志向' },
                { id: 'social', label: '人情交际' }
            ],
            childSectionDescPlus: [
                { id: 'daily', label: '心境日课' },
                { id: 'out', label: '外出功名' },
                { id: 'advance', label: '切磋进阶' }
            ],
            childSectionDescNova: [
                { id: 'virtue', label: '德行作息' },
                { id: 'dream', label: '梦趣奇遇' },
                { id: 'misc', label: '纪念杂务' }
            ],
            childSectionDescSaga: [
                { id: 'build', label: '族建百艺' },
                { id: 'social', label: '社交誓约' },
                { id: 'life', label: '心事生计' }
            ],
            childSectionDescChronicle: [
                { id: 'clan', label: '族务编纂' },
                { id: 'market', label: '市井修习' },
                { id: 'wild', label: '山野日常' }
            ],
            childSectionDescFlow: [
                { id: 'clan', label: '台网时序' },
                { id: 'purse', label: '账闻结义' },
                { id: 'secret', label: '秘技传火' }
            ],
            childSectionDescNpc: [
                { id: 'hall', label: '会馆营生' },
                { id: 'social', label: '邻里深交' },
                { id: 'ai', label: '智策联动' }
            ],
            childSectionEighteen: [
                { id: 'tablet', label: '牌位共鸣' },
                { id: 'chronicle', label: '谱牒祭典' },
                { id: 'deep', label: '深挖遗泽' }
            ],
            childSectionEighteenDepth: [
                { id: 'altar', label: '族坛灵觉' },
                { id: 'personal', label: '个人修炼' },
                { id: 'pilgrim', label: '朝圣小课' }
            ],
            childSectionRealty: [
                { id: 'meals', label: '三餐市集' },
                { id: 'coming', label: '成人礼仪' },
                { id: 'letter', label: '家书赡养' }
            ],
            childSectionLife: [
                { id: 'diary', label: '日记起居' },
                { id: 'career', label: '志向羁绊' }
            ],
            childSectionLiving: [
                { id: 'chore', label: '烟火邻里' },
                { id: 'calamity', label: '灾害幼年' }
            ],
            childSectionMartial: [
                { id: 'hall', label: '堂席营' },
                { id: 'drill', label: '演武军功' }
            ]
        };

        var TAB_TO_SECTION = {
            descendants: 'childSectionDescendants',
            descplus: 'childSectionDescPlus',
            descnova: 'childSectionDescNova',
            descsaga: 'childSectionDescSaga',
            descchro: 'childSectionDescChronicle',
            descflow: 'childSectionDescFlow',
            descnpc: 'childSectionDescNpc',
            eighteen: 'childSectionEighteen',
            eightdepth: 'childSectionEighteenDepth',
            realty: 'childSectionRealty',
            life: 'childSectionLife',
            living: 'childSectionLiving',
            martial: 'childSectionMartial'
        };

        function sectionCards(section) {
            var out = [];
            var kids = section.children;
            for (var i = 0; i < kids.length; i++) {
                if (kids[i].classList && kids[i].classList.contains('c-card')) out.push(kids[i]);
            }
            return out;
        }

        function ensureNav(section) {
            var sid = section.id;
            var groups = SUBTAB_MAP[sid];
            if (!groups || !groups.length) return null;
            var nav = null;
            for (var i = 0; i < section.children.length; i++) {
                if (section.children[i].classList && section.children[i].classList.contains('c-subtabs')) {
                    nav = section.children[i];
                    break;
                }
            }
            if (nav) {
                // 已有静态导航时补齐点击
                var btns = nav.querySelectorAll('.c-subtab');
                for (var b = 0; b < btns.length; b++) {
                    (function (btn) {
                        if (btn.getAttribute('data-bound') === '1') return;
                        btn.setAttribute('data-bound', '1');
                        btn.onclick = function () {
                            window.switchChildSubTab(sid, btn.getAttribute('data-sub'));
                        };
                    })(btns[b]);
                }
                return nav;
            }
            nav = document.createElement('div');
            nav.className = 'c-subtabs';
            nav.setAttribute('role', 'tablist');
            nav.setAttribute('data-section', sid);
            groups.forEach(function (g, idx) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'c-subtab' + (idx === 0 ? ' active' : '');
                btn.setAttribute('data-sub', g.id);
                btn.setAttribute('role', 'tab');
                btn.setAttribute('data-bound', '1');
                btn.textContent = g.label;
                btn.onclick = function () {
                    window.switchChildSubTab(sid, g.id);
                };
                nav.appendChild(btn);
            });
            section.insertBefore(nav, section.firstChild);
            return nav;
        }

        window.switchChildSubTab = function (sectionId, subId) {
            var section = document.getElementById(sectionId);
            if (!section) return;
            var groups = SUBTAB_MAP[sectionId];
            if (!groups || !groups.length) return;
            if (!groups.some(function (g) { return g.id === subId; })) {
                subId = groups[0].id;
            }
            window.__childSubTabState[sectionId] = subId;
            ensureNav(section);
            var nav = null;
            for (var n = 0; n < section.children.length; n++) {
                if (section.children[n].classList && section.children[n].classList.contains('c-subtabs')) {
                    nav = section.children[n];
                    break;
                }
            }
            if (nav) {
                var btns = nav.querySelectorAll('.c-subtab');
                for (var i = 0; i < btns.length; i++) {
                    btns[i].classList.toggle('active', btns[i].getAttribute('data-sub') === subId);
                }
            }
            var cards = sectionCards(section);
            for (var j = 0; j < cards.length; j++) {
                var card = cards[j];
                var ds = card.getAttribute('data-sub') || '';
                var show = ds === subId;
                card.classList.toggle('c-sub-hidden', !show);
                card.style.display = show ? '' : 'none';
            }
        };

        window.initChildSubTabsForSection = function (sectionId) {
            var section = document.getElementById(sectionId);
            if (!section || !SUBTAB_MAP[sectionId]) return;
            ensureNav(section);
            var subId = window.__childSubTabState[sectionId] || SUBTAB_MAP[sectionId][0].id;
            window.switchChildSubTab(sectionId, subId);
        };

        window.initAllChildSubTabs = function () {
            Object.keys(SUBTAB_MAP).forEach(function (sid) {
                window.initChildSubTabsForSection(sid);
            });
        };

        window.applyChildSubTabForPrimary = function (tab) {
            var sid = TAB_TO_SECTION[tab];
            if (!sid) return;
            window.initChildSubTabsForSection(sid);
        };

        function bootSubTabs() {
            setTimeout(function () {
                window.initAllChildSubTabs();
                var tab = typeof _childActiveTab !== 'undefined' ? _childActiveTab : 'overview';
                window.applyChildSubTabForPrimary(tab);
            }, 80);
        }
        document.addEventListener('DOMContentLoaded', bootSubTabs);
        if (document.readyState !== 'loading') bootSubTabs();
    }

    // —— 刷新后保留下拉选中人物（避免点一次升级又要重选）——
    function snapshotChildSelects() {
        var ui = document.getElementById('childSystemUI');
        if (!ui || !ui.querySelectorAll) return null;
        var map = {};
        var list = ui.querySelectorAll('select');
        for (var i = 0; i < list.length; i++) {
            var s = list[i];
            if (!s.id) continue;
            map[s.id] = s.value;
        }
        return map;
    }

    function restoreChildSelects(map) {
        if (!map) return;
        Object.keys(map).forEach(function (id) {
            var s = document.getElementById(id);
            if (!s || !s.options || !s.options.length) return;
            var v = String(map[id]);
            var found = false;
            for (var i = 0; i < s.options.length; i++) {
                if (String(s.options[i].value) === v) { found = true; break; }
            }
            if (!found) return;
            if (String(s.value) === v) return;
            s.value = v;
            try {
                if (typeof s.onchange === 'function') s.onchange();
                else if (s.dispatchEvent) s.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (e) { /* ignore */ }
        });
    }

    var _preserveDepth = 0;
    function withPreservedChildSelects(fn) {
        if (typeof fn !== 'function') return fn;
        return function () {
            var snap = null;
            if (_preserveDepth === 0) snap = snapshotChildSelects();
            _preserveDepth++;
            try {
                return fn.apply(this, arguments);
            } finally {
                _preserveDepth--;
                if (_preserveDepth === 0) restoreChildSelects(snap);
            }
        };
    }

    window.refreshActiveChildTabPanels = withPreservedChildSelects(window.refreshActiveChildTabPanels);
    if (typeof window.updateChildSystemUI === 'function') {
        window.updateChildSystemUI = withPreservedChildSelects(window.updateChildSystemUI);
    }
})();

/**
 * 家族传承 · 页内二级标签
 * 长页按组显隐 .c-card，默认第一组；会话内记忆选择。
 * 在 lineage-ui-perf.js 之后加载。
 */
(function () {
    'use strict';
    if (window.__lineageSubTabsInstalled) return;
    window.__lineageSubTabsInstalled = true;

    window.__childSubTabState = window.__childSubTabState || {};

    /** sectionId → [{ id, label }]；卡片用 data-sub 匹配 id */
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
        if (nav) return nav;
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

    var _origSwitch = window.switchChildTab;
    window.switchChildTab = function (tab) {
        if (_origSwitch) _origSwitch(tab);
        try {
            window.applyChildSubTabForPrimary(tab || (typeof _childActiveTab !== 'undefined' ? _childActiveTab : ''));
        } catch (e) { /* ignore */ }
    };

    function boot() {
        setTimeout(function () {
            window.initAllChildSubTabs();
            var tab = typeof _childActiveTab !== 'undefined' ? _childActiveTab : 'overview';
            window.applyChildSubTabForPrimary(tab);
        }, 200);
    }
    document.addEventListener('DOMContentLoaded', boot);
    if (document.readyState !== 'loading') boot();
})();

/**
 * 时光秘境 · 图鉴 UI 优化
 * 分栏 / 搜索 / 解锁筛选 / 条目详情 / 统一进度总览
 * 覆盖扁平拼接式旧图鉴与 world-ext 二次拼贴。
 */
(function () {
    'use strict';

    const STATE = {
        tab: 'overview',
        filter: 'all', // all | unlocked | locked
        q: '',
        detailId: null,
        dataSig: ''
    };

    const TABS = [
        { id: 'overview', label: '总览', icon: '📊' },
        { id: 'rooms', label: '房间', icon: '🚪' },
        { id: 'relics', label: '遗物', icon: '🏺' },
        { id: 'equip', label: '装备', icon: '⚔️' },
        { id: 'monsters', label: '怪物', icon: '👾' },
        { id: 'affixes', label: '词条', icon: '🏷️' },
        { id: 'mutation', label: '变异', icon: '🧬' }
    ];

    function esc(s) {
        return String(s ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function getCodex() {
        const tsr = player?.timeSecretRealm;
        if (!tsr) return {};
        if (!tsr.codex) tsr.codex = { rooms: {}, relics: {} };
        return tsr.codex;
    }

    function gatherMonsters() {
        const all = [];
        if (typeof TSR_MONSTER_POOL === 'undefined') return all;
        ['battle', 'elite', 'boss'].forEach(k => (TSR_MONSTER_POOL[k] || []).forEach(m => {
            all.push({ ...m, pool: k });
        }));
        const seen = new Set();
        return all.filter(m => {
            if (!m.id || seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        });
    }

    function gatherRooms() {
        const map = new Map();
        (typeof TSR_CODEX_ROOMS !== 'undefined' ? TSR_CODEX_ROOMS : []).forEach(r => {
            map.set(r.key, { key: r.key, name: r.name, icon: r.icon || '🚪' });
        });
        const absorb = (list) => {
            (list || []).forEach(key => {
                if (map.has(key)) return;
                const meta = typeof getTsrRoomTypeMeta === 'function' ? getTsrRoomTypeMeta(key) : null;
                map.set(key, {
                    key,
                    name: meta?.name || key,
                    icon: meta?.icon || '🚪'
                });
            });
        };
        if (typeof TSR_SPECIAL_ROOM_TYPES !== 'undefined') absorb(TSR_SPECIAL_ROOM_TYPES);
        if (typeof TSR_MEME_ROOM_TYPES !== 'undefined') absorb(TSR_MEME_ROOM_TYPES);
        return Array.from(map.values());
    }

    function pct(n, d) {
        if (!d) return 0;
        return Math.min(100, Math.round((n / d) * 100));
    }

    function buildCatalog() {
        const codex = getCodex();
        const rooms = gatherRooms().map(r => {
            const count = codex.rooms?.[r.key] || 0;
            return {
                id: 'room:' + r.key,
                tab: 'rooms',
                icon: r.icon,
                name: r.name,
                unlocked: count > 0,
                count,
                sub: count ? ('遭遇 ' + count + ' 次') : '未发现',
                detail: count
                    ? `已探索该房间类型 ${count} 次。继续冒险可提升图鉴进度与里程碑奖励。`
                    : '在冒险中探索对应房间后解锁。',
                tags: ['房间', r.key]
            };
        });

        const relics = Object.entries(typeof TSR_RELIC_POOL !== 'undefined' ? TSR_RELIC_POOL : {}).map(([key, relic]) => {
            const count = codex.relics?.[key] || 0;
            return {
                id: 'relic:' + key,
                tab: 'relics',
                icon: relic.icon || '🏺',
                name: relic.name || key,
                unlocked: count > 0,
                count,
                sub: count ? ('获得 ' + count + ' 次') : '未获得',
                detail: count ? (relic.desc || '已收录遗物。') : '获得该遗物后解锁完整描述。',
                spoiler: !count,
                tags: ['遗物', key]
            };
        });

        const sets = Object.entries(typeof TSR_EQUIP_SETS !== 'undefined' ? TSR_EQUIP_SETS : {}).map(([key, set]) => {
            const isLegend = !!set.exclusive;
            const count = isLegend
                ? (codex.equipmentLegends?.[key] || 0)
                : (codex.equipmentSets?.[key] || 0);
            return {
                id: 'set:' + key,
                tab: 'equip',
                icon: set.icon || '⚔️',
                name: (set.name || key) + (isLegend ? ' ★' : ''),
                unlocked: count > 0,
                count,
                sub: count
                    ? (`获得 ${count} 件`)
                    : (isLegend ? (set.dropHint || '传说掉落') : '套装未收录'),
                detail: count
                    ? `2件：${set.desc2 || '-'}\n4件：${set.desc4 || '-'}`
                    : (isLegend
                        ? (set.dropHint || '击败特定首领有概率掉落传说套装。')
                        : '掉落任意该套件装备即可点亮。'),
                badge: isLegend ? '传说' : '套装',
                tags: ['装备', isLegend ? '传说' : '套装', key]
            };
        });

        const eqAffixes = (typeof TSR_EQUIP_AFFIX_POOL !== 'undefined' ? TSR_EQUIP_AFFIX_POOL : []).map(ax => {
            const count = codex.equipmentAffixes?.[ax.id] || 0;
            const statHint = Object.keys(ax.stats || {}).map(k =>
                (typeof TSR_EQUIP_STAT_META !== 'undefined' && TSR_EQUIP_STAT_META[k]?.short) || k
            ).join(' · ');
            return {
                id: 'eqax:' + ax.id,
                tab: 'equip',
                icon: '✨',
                name: ax.name || ax.id,
                unlocked: count > 0,
                count,
                sub: count ? (`获得 ${count} 次 · ${statHint}`) : (statHint || '装备词条'),
                detail: count
                    ? `已收录。属性倾向：${statHint || '—'}`
                    : '在掉落装备上见到该词条后解锁。',
                badge: '装词',
                tags: ['装备', '词条', ax.id]
            };
        });

        const monsters = gatherMonsters().map(m => {
            const count = codex.monsters?.[m.id] || 0;
            const role = m.pool === 'boss' ? '首领' : (m.pool === 'elite' ? '精英' : '普通');
            return {
                id: 'mon:' + m.id,
                tab: 'monsters',
                icon: m.icon || '👾',
                name: m.name || m.id,
                unlocked: count > 0,
                count,
                sub: count
                    ? (`击败 ${count} 次 · ${m.tier || role}`)
                    : `${role} · 未遭遇`,
                detail: count
                    ? `${m.intro || ''}\n${m.win ? '击破词：' + m.win : ''}`.trim()
                    : '击败该怪物后解锁介绍与击破台词。',
                badge: role,
                spoiler: !count,
                tags: ['怪物', role, m.tier || '', m.id]
            };
        });

        const monAffixes = Object.entries(typeof TSR_MONSTER_AFFIXES !== 'undefined' ? TSR_MONSTER_AFFIXES : {})
            .filter(([, ax]) => (ax.weight || 0) > 0 || ax.exclusiveMonster)
            .map(([key, ax]) => {
                const count = codex.monsterAffixes?.[key] || 0;
                return {
                    id: 'max:' + key,
                    tab: 'affixes',
                    icon: ax.icon || '🏷️',
                    name: ax.name || key,
                    unlocked: count > 0,
                    count,
                    sub: count ? (`遭遇 ${count} 次`) : '怪物词条',
                    detail: count ? (ax.desc || '已收录词条。') : '与携带该词条的怪物交战后解锁。',
                    spoiler: !count,
                    tags: ['词条', key]
                };
            });

        const mutations = Object.entries(typeof TSR_MONSTER_MUTATIONS !== 'undefined' ? TSR_MONSTER_MUTATIONS : {}).map(([key, mut]) => {
            const count = codex.mutations?.[key] || 0;
            return {
                id: 'mut:' + key,
                tab: 'mutation',
                icon: mut.icon || '🧬',
                name: mut.name || key,
                unlocked: count > 0,
                count,
                sub: count ? (`遭遇 ${count} 次`) : '变异形态',
                detail: count ? (mut.desc || '已收录变异。') : '遭遇对应变异后解锁说明。',
                spoiler: !count,
                tags: ['变异', key]
            };
        });

        const lives = Object.entries(typeof TSR_MONSTER_LIFE_PROFILES !== 'undefined' ? TSR_MONSTER_LIFE_PROFILES : {}).map(([key, life]) => {
            const count = codex.lifeProfiles?.[key] || 0;
            const labels = (life.labels || []).join(' / ');
            return {
                id: 'life:' + key,
                tab: 'mutation',
                icon: '❤️',
                name: `${key} · ${life.stages || '?'}段`,
                unlocked: count > 0,
                count,
                sub: count ? (`遭遇 ${count} 次`) : (labels || '多段命格'),
                detail: count
                    ? `命段：${labels || life.stages}\n${life.reviveLog || '生命重整'}`
                    : '击败多段生命怪物时收录。',
                badge: '命格',
                tags: ['命格', key]
            };
        });

        return {
            rooms, relics, equip: sets.concat(eqAffixes), monsters, affixes: monAffixes,
            mutation: mutations.concat(lives),
            all: rooms.concat(relics, sets, eqAffixes, monsters, monAffixes, mutations, lives)
        };
    }

    function summarize(cat) {
        const groups = [
            { key: 'rooms', label: '房间', icon: '🚪', list: cat.rooms },
            { key: 'relics', label: '遗物', icon: '🏺', list: cat.relics },
            { key: 'equip', label: '装备', icon: '⚔️', list: cat.equip },
            { key: 'monsters', label: '怪物', icon: '👾', list: cat.monsters },
            { key: 'affixes', label: '词条', icon: '🏷️', list: cat.affixes },
            { key: 'mutation', label: '变异/命格', icon: '🧬', list: cat.mutation }
        ];
        return groups.map(g => {
            const total = g.list.length;
            const got = g.list.filter(x => x.unlocked).length;
            return { ...g, total, got, pct: pct(got, total) };
        });
    }

    function matchQuery(item, q) {
        if (!q) return true;
        const hay = (item.name + ' ' + (item.tags || []).join(' ') + ' ' + (item.sub || '')).toLowerCase();
        return hay.includes(q);
    }

    function filterItems(list) {
        const q = (STATE.q || '').trim().toLowerCase();
        return list.filter(it => {
            if (STATE.filter === 'unlocked' && !it.unlocked) return false;
            if (STATE.filter === 'locked' && it.unlocked) return false;
            return matchQuery(it, q);
        });
    }

    function progressBar(p) {
        const cls = p >= 100 ? 'full' : (p >= 50 ? 'mid' : 'low');
        return `<div class="tsr-codex-bar"><i class="${cls}" style="width:${p}%"></i></div>`;
    }

    function renderCard(item) {
        const active = STATE.detailId === item.id ? ' active' : '';
        const badge = item.badge ? `<span class="tsr-codex-badge">${esc(item.badge)}</span>` : '';
        return `<button type="button" class="tsr-codex-card ${item.unlocked ? 'unlocked' : 'locked'}${active}" data-codex-id="${esc(item.id)}" onclick="tsrCodexSelect('${esc(item.id)}')">
            <span class="tsr-codex-card-icon">${item.icon || '❔'}</span>
            ${badge}
            <span class="tsr-codex-card-name">${esc(item.name)}</span>
            <span class="tsr-codex-card-sub">${esc(item.sub)}</span>
        </button>`;
    }

    function findItem(cat, id) {
        return cat.all.find(x => x.id === id) || null;
    }

    function renderDetail(item) {
        if (!item) {
            return `<div class="tsr-codex-detail empty">点选条目查看详情。未解锁内容会隐藏剧透信息。</div>`;
        }
        const status = item.unlocked
            ? `<span class="tsr-codex-pill on">已收录 · ${item.count || 1}</span>`
            : `<span class="tsr-codex-pill off">未解锁</span>`;
        const body = esc(item.detail || '').replace(/\n/g, '<br>');
        return `<div class="tsr-codex-detail">
            <div class="tsr-codex-detail-head">
                <span class="tsr-codex-detail-icon">${item.icon || ''}</span>
                <div>
                    <div class="tsr-codex-detail-name">${esc(item.name)}</div>
                    ${status}
                </div>
            </div>
            <div class="tsr-codex-detail-body">${body}</div>
        </div>`;
    }

    function renderOverview(sums, cat, codex) {
        const gotAll = sums.reduce((s, g) => s + g.got, 0);
        const totAll = sums.reduce((s, g) => s + g.total, 0);
        const overall = pct(gotAll, totAll);
        const ratioRooms = typeof getTsrCodexDiscoverRatio === 'function' ? getTsrCodexDiscoverRatio() : 0;
        const ms = (typeof TSR_CODEX_MILESTONES !== 'undefined' ? TSR_CODEX_MILESTONES : [])
            .map(m => {
                const done = !!(player.timeSecretRealm?.codexMilestones?.[m.id]);
                return `<span class="tsr-codex-ms ${done ? 'done' : ''}">${done ? '✓' : '○'} ${esc(m.label)} (${Math.round(m.ratio * 100)}%)</span>`;
            }).join('');

        const recentUnlocked = cat.all.filter(x => x.unlocked).sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 8);

        return `
            <div class="tsr-codex-overview">
                <div class="tsr-codex-overall">
                    <div class="tsr-codex-overall-num">${overall}%</div>
                    <div class="tsr-codex-overall-meta">
                        <div>综合收录 <b>${gotAll}</b> / ${totAll}</div>
                        ${progressBar(overall)}
                        <div class="tsr-codex-overall-sub">房间探索进度 ${Math.round(ratioRooms * 100)}% · 精英击杀 ${codex.elites || 0} · 赌局 ${codex.gambles || 0}</div>
                    </div>
                </div>
                <div class="tsr-codex-sum-grid">
                    ${sums.map(g => `
                        <button type="button" class="tsr-codex-sum-card" onclick="tsrCodexSwitchTab('${g.key}')">
                            <span class="tsr-codex-sum-icon">${g.icon}</span>
                            <span class="tsr-codex-sum-label">${g.label}</span>
                            <span class="tsr-codex-sum-count">${g.got}/${g.total}</span>
                            ${progressBar(g.pct)}
                        </button>
                    `).join('')}
                </div>
                <div class="tsr-codex-section-label">图鉴里程碑</div>
                <div class="tsr-codex-ms-row">${ms || '暂无里程碑数据'}</div>
                <div class="tsr-codex-section-label">常遇收录</div>
                <div class="tsr-codex-grid-cards">
                    ${recentUnlocked.length ? recentUnlocked.map(renderCard).join('') : '<div class="tsr-codex-empty">还没有收录条目，先去冒险探索吧。</div>'}
                </div>
            </div>`;
    }

    function renderTabBody(cat) {
        if (STATE.tab === 'overview') {
            return renderOverview(summarize(cat), cat, getCodex());
        }
        const list = filterItems(cat[STATE.tab] || []);
        // 已解锁优先
        list.sort((a, b) => (b.unlocked - a.unlocked) || String(a.name).localeCompare(String(b.name), 'zh'));
        const got = (cat[STATE.tab] || []).filter(x => x.unlocked).length;
        const total = (cat[STATE.tab] || []).length;
        return `
            <div class="tsr-codex-tab-meta">
                <span>本栏 ${got}/${total}</span>
                ${progressBar(pct(got, total))}
                <span class="tsr-codex-tab-meta-right">显示 ${list.length} 项</span>
            </div>
            <div class="tsr-codex-split">
                <div class="tsr-codex-grid-cards">
                    ${list.length ? list.map(renderCard).join('') : '<div class="tsr-codex-empty">没有匹配条目，试试清空搜索或切换筛选。</div>'}
                </div>
                ${renderDetail(findItem(cat, STATE.detailId))}
            </div>`;
    }

    function renderShell(force) {
        const container = document.getElementById('tsrCodexContent');
        if (!container) return;
        const cat = buildCatalog();
        const dataSig = JSON.stringify({
            rooms: Object.keys(getCodex().rooms || {}).length,
            relics: Object.keys(getCodex().relics || {}).length,
            monsters: Object.keys(getCodex().monsters || {}).length,
            mutations: Object.keys(getCodex().mutations || {}).length,
            life: Object.keys(getCodex().lifeProfiles || {}).length,
            sets: Object.keys(getCodex().equipmentSets || {}).length,
            legends: Object.keys(getCodex().equipmentLegends || {}).length,
            eqAx: Object.keys(getCodex().equipmentAffixes || {}).length,
            monAx: Object.keys(getCodex().monsterAffixes || {}).length,
            elites: getCodex().elites || 0
        });

        const uiSig = [STATE.tab, STATE.filter, STATE.q, STATE.detailId, dataSig].join('|');
        if (!force && container.dataset.tsrCodexUiSig === uiSig) return;
        container.dataset.tsrCodexUiSig = uiSig;
        STATE.dataSig = dataSig;

        const sums = summarize(cat);
        const tip = document.querySelector('#tsrTabCodex .tsr-tab-hint');
        if (tip) {
            tip.textContent = '分栏浏览房间、遗物、装备、怪物、词条与变异。支持搜索与筛选；点条目看详情，未解锁不剧透。';
        }

        container.className = 'tsr-codex-ui';
        container.innerHTML = `
            <div class="tsr-codex-toolbar">
                <div class="tsr-codex-tabs">
                    ${TABS.map(t => {
                        const g = sums.find(s => s.key === t.id);
                        const countHint = g ? ` ${g.got}/${g.total}` : '';
                        return `<button type="button" class="tsr-codex-tab ${STATE.tab === t.id ? 'active' : ''}" onclick="tsrCodexSwitchTab('${t.id}')">${t.icon} ${t.label}${t.id === 'overview' ? '' : `<small>${countHint}</small>`}</button>`;
                    }).join('')}
                </div>
                <div class="tsr-codex-tools">
                    <input type="search" class="tsr-codex-search" id="tsrCodexSearch" placeholder="搜索名称 / 标签…" value="${esc(STATE.q)}" oninput="tsrCodexSearch(this.value)" />
                    <div class="tsr-codex-filters">
                        <button type="button" class="tsr-codex-filter ${STATE.filter === 'all' ? 'active' : ''}" onclick="tsrCodexFilter('all')">全部</button>
                        <button type="button" class="tsr-codex-filter ${STATE.filter === 'unlocked' ? 'active' : ''}" onclick="tsrCodexFilter('unlocked')">已解锁</button>
                        <button type="button" class="tsr-codex-filter ${STATE.filter === 'locked' ? 'active' : ''}" onclick="tsrCodexFilter('locked')">未解锁</button>
                    </div>
                </div>
            </div>
            <div class="tsr-codex-body">${renderTabBody(cat)}</div>
        `;

        // 同步大厅顶部芯片
        const chip = document.getElementById('tsrCodexPct');
        if (chip) {
            const gotAll = sums.reduce((s, g) => s + g.got, 0);
            const totAll = sums.reduce((s, g) => s + g.total, 0);
            chip.textContent = pct(gotAll, totAll) + '%';
        }
    }

    window.tsrCodexSwitchTab = function (tab) {
        STATE.tab = tab || 'overview';
        if (STATE.tab === 'overview') STATE.detailId = null;
        renderShell(true);
    };

    window.tsrCodexFilter = function (f) {
        STATE.filter = f || 'all';
        renderShell(true);
    };

    window.tsrCodexSearch = function (q) {
        STATE.q = q || '';
        clearTimeout(window._tsrCodexSearchTimer);
        window._tsrCodexSearchTimer = setTimeout(() => renderShell(true), 80);
    };

    window.tsrCodexSelect = function (id) {
        STATE.detailId = STATE.detailId === id ? null : id;
        if (STATE.tab === 'overview' && id) {
            const cat = buildCatalog();
            const item = findItem(cat, id);
            if (item?.tab) STATE.tab = item.tab;
        }
        renderShell(true);
    };

    // 覆盖签名：纳入怪物/变异等，避免缓存卡住
    if (typeof getTsrCodexSignature === 'function') {
        const _sig = getTsrCodexSignature;
        getTsrCodexSignature = function () {
            const base = _sig();
            const c = player?.timeSecretRealm?.codex || {};
            return base + '|' + [
                Object.keys(c.monsters || {}).length,
                Object.keys(c.mutations || {}).length,
                Object.keys(c.lifeProfiles || {}).length
            ].join(':');
        };
    }

    // 全面替换图鉴渲染（消除旧扁平布局 + world 二次拼贴）
    updateTsrCodexDisplay = function () {
        renderShell(false);
    };
    updateTsrCodexDisplay.__tsrCodexUiPatched = true;
    updateTsrCodexDisplay.__tsrWorldPatched = true; // 阻止迟来的 world 再包一层

    // 若大厅正停留在图鉴页，开机后刷一次
    if (document.getElementById('tsrTabCodex')?.classList.contains('active')
        || document.getElementById('tsrCodexContent')) {
        try { updateTsrCodexDisplay(); } catch (e) { /* ignore */ }
    }
})();

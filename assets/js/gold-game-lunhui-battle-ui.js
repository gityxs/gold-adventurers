/**
 * 轮回副本战斗界面：修仙风壳层 + 血条/道场/飘字/震屏
 * 保留全部既有 DOM ID，运行时增强。
 */
(function () {
    'use strict';

    var THEME_BY_PREFIX = {
        lunhuiFuben: { accent: '#5ec8b8', mist: 'rgba(94,200,184,0.18)', glyph: '劫', boss: '混沌' },
        lunhuiPenglai: { accent: '#c9a0ff', mist: 'rgba(168,120,255,0.18)', glyph: '岛', boss: '玄冥' },
        lunhuiElite1: { accent: '#9fa8da', mist: 'rgba(92,107,192,0.2)', glyph: '星', boss: '星君' },
        lunhuiElite2: { accent: '#80cbc4', mist: 'rgba(38,166,154,0.2)', glyph: '瑶', boss: '云麒' },
        lunhuiElite3: { accent: '#bcaaa4', mist: 'rgba(141,110,99,0.2)', glyph: '墟', boss: '鸿蒙' },
        lunhuiElite4: { accent: '#b39ddb', mist: 'rgba(126,87,194,0.22)', glyph: '雷', boss: '雷狱' },
        lunhuiElite5: { accent: '#b0bec5', mist: 'rgba(120,144,156,0.2)', glyph: '寂', boss: '寂灭' },
        lunhuiElite6: { accent: '#ce93d8', mist: 'rgba(171,71,188,0.22)', glyph: '沌', boss: '混沌' },
        lunhuiElite7: { accent: '#ffe082', mist: 'rgba(255,179,0,0.18)', glyph: '陨', boss: '神陨' },
        lunhuiElite8: { accent: '#f48fb1', mist: 'rgba(236,64,122,0.2)', glyph: '终', boss: '终皇' },
        lunhuiElite9: { accent: '#ffab91', mist: 'rgba(255,112,67,0.2)', glyph: '火', boss: '劫火' },
        lunhuiElite10: { accent: '#81d4fa', mist: 'rgba(79,195,247,0.2)', glyph: '霜', boss: '玄霜' },
        lunhuiElite11: { accent: '#ce93d8', mist: 'rgba(186,104,200,0.22)', glyph: '霄', boss: '紫霄' },
        lunhuiElite12: { accent: '#b39ddb', mist: 'rgba(126,87,194,0.2)', glyph: '渊', boss: '归墟' },
        lunhuiElite13: { accent: '#ffe082', mist: 'rgba(255,213,79,0.22)', glyph: '圣', boss: '圣尊' },
        // 黑龙潭 / 圣兽岛 / 蓬莱（UI 前缀与属性 ID 前缀不一致）
        blackDragonAbyss: { accent: '#b388ff', mist: 'rgba(138,43,226,0.22)', glyph: '龙', boss: '黑龙王' },
        holyBeastIsland: { accent: '#ff8a65', mist: 'rgba(255,69,0,0.2)', glyph: '麒', boss: '上古火麒麟' },
        penglaiIsland: { accent: '#ce93d8', mist: 'rgba(148,0,211,0.2)', glyph: '蓬', boss: '太古饕鬄' }
    };

    /** 非标准 ID 映射（statPrefix / 按钮 / 奖励） */
    var PANEL_META = {
        blackDragonAbyss: {
            statPrefix: 'bda',
            battleLog: 'bdaBattleLog',
            startBtn: 'startBattleBtn',
            attackBtn: 'attackBossBtn',
            autoBtn: 'autoAttackBossBtn',
            fleeBtn: 'fleeBossBtn',
            rewardOverlay: 'bdaRewardOverlay',
            rewardUI: 'bdaRewardUI',
            rewardItems: 'rewardItems'
        },
        holyBeastIsland: {
            statPrefix: 'hbi',
            battleLog: 'hbiBattleLog',
            startBtn: 'startHbiBattleBtn',
            attackBtn: 'attackHbiBossBtn',
            autoBtn: 'autoAttackHbiBossBtn',
            fleeBtn: 'fleeHbiBossBtn',
            rewardPrefix: 'hbi'
        },
        penglaiIsland: {
            statPrefix: 'penglai',
            battleLog: 'penglaiBattleLog',
            startBtn: 'startPenglaiBattleBtn',
            attackBtn: 'attackPenglaiBossBtn',
            autoBtn: 'autoAttackPenglaiBossBtn',
            fleeBtn: 'fleePenglaiBossBtn',
            rewardPrefix: 'penglai'
        }
    };

    function getPanelMeta(prefix) {
        return PANEL_META[prefix] || null;
    }

    function resolveStatPrefix(prefix) {
        var meta = getPanelMeta(prefix);
        return (meta && meta.statPrefix) || prefix;
    }

    var FX_THROTTLE_MS = 70;
    var lastFxAt = Object.create(null);

    function parseSciParts(v) {
        if (v == null) return null;
        if (typeof v === 'number') {
            if (!Number.isFinite(v)) return null;
            if (v === 0) return { c: 0, e: 0 };
            var ae = Math.floor(Math.log10(Math.abs(v)));
            return { c: v / Math.pow(10, ae), e: ae };
        }
        var s = String(v).trim().toLowerCase().replace(/\+/g, '');
        var m = s.match(/^(-?\d+(?:\.\d+)?)e(-?\d+)$/);
        if (m) return { c: parseFloat(m[1]), e: parseInt(m[2], 10) };
        var n = Number(s);
        if (!Number.isFinite(n)) return null;
        if (n === 0) return { c: 0, e: 0 };
        var e2 = Math.floor(Math.log10(Math.abs(n)));
        return { c: n / Math.pow(10, e2), e: e2 };
    }

    function lunhuiBattleHpPct(cur, max) {
        try {
            if (typeof bLteZero === 'function') {
                if (bLteZero(max)) return 0;
                if (bLteZero(cur)) return 0;
            }
        } catch (e) { /* ignore */ }
        var c = Number(cur);
        var m = Number(max);
        if (Number.isFinite(c) && Number.isFinite(m) && m > 0) {
            return Math.max(0, Math.min(100, (c / m) * 100));
        }
        var a = parseSciParts(cur);
        var b = parseSciParts(max);
        if (!a || !b || b.c === 0) return 0;
        var diff = a.e - b.e;
        if (diff <= -12) return 0;
        if (diff >= 1) return 100;
        var ratio = (a.c / b.c) * Math.pow(10, diff);
        if (!Number.isFinite(ratio)) return 50;
        return Math.max(0, Math.min(100, ratio * 100));
    }

    function findDirectChildButton(root, id) {
        return document.getElementById(id);
    }

    function applyThemeVars(el, theme) {
        if (!el || !theme) return;
        el.style.setProperty('--lh-accent', theme.accent);
        el.style.setProperty('--lh-mist', theme.mist || 'rgba(126,200,176,0.16)');
    }

    function enhanceReward(prefix, theme) {
        var meta = getPanelMeta(prefix);
        var rewardRoot = (meta && meta.rewardPrefix) || prefix;
        var overlayId = (meta && meta.rewardOverlay) || (rewardRoot + 'RewardOverlay');
        var uiId = (meta && meta.rewardUI) || (rewardRoot + 'RewardUI');
        var itemsId = (meta && meta.rewardItems) || (rewardRoot + 'RewardItems');
        var overlay = document.getElementById(overlayId);
        var ui = document.getElementById(uiId);
        if (overlay) {
            overlay.classList.add('lh-battle-overlay', 'lh-reward-overlay');
            applyThemeVars(overlay, theme);
        }
        if (!ui || ui.getAttribute('data-lh-reward') === '1') {
            if (ui) applyThemeVars(ui, theme);
            return;
        }
        ui.setAttribute('data-lh-reward', '1');
        ui.classList.add('lh-reward-panel');
        applyThemeVars(ui, theme);
        var h2 = ui.querySelector('h2');
        if (h2) h2.classList.add('lh-reward-title');
        var items = document.getElementById(itemsId);
        if (items) items.classList.add('lh-reward-items');
        var btns = ui.querySelectorAll('button');
        for (var i = 0; i < btns.length; i++) btns[i].classList.add('lh-btn', 'lh-btn--confirm');
    }

    function wrapPanelChildren(ui) {
        var i;
        for (i = 0; i < ui.children.length; i++) {
            if (ui.children[i].classList && ui.children[i].classList.contains('lh-battle-shell')) {
                return ui.children[i];
            }
        }
        var shell = document.createElement('div');
        shell.className = 'lh-battle-shell';
        var mist = document.createElement('div');
        mist.className = 'lh-battle-mist';
        mist.setAttribute('aria-hidden', 'true');
        shell.appendChild(mist);
        var frame = document.createElement('div');
        frame.className = 'lh-battle-frame';
        while (ui.firstChild) frame.appendChild(ui.firstChild);
        shell.appendChild(frame);
        ui.appendChild(shell);
        return shell;
    }

    function decorateGrandChrome(shell, frame) {
        if (!shell || shell.getAttribute('data-lh-grand') === '1') return;
        shell.setAttribute('data-lh-grand', '1');
        var ornament = document.createElement('div');
        ornament.className = 'lh-ornament-layer';
        ornament.setAttribute('aria-hidden', 'true');
        ornament.innerHTML =
            '<i class="lh-corner lh-corner--tl"></i>' +
            '<i class="lh-corner lh-corner--tr"></i>' +
            '<i class="lh-corner lh-corner--bl"></i>' +
            '<i class="lh-corner lh-corner--br"></i>' +
            '<div class="lh-cloud lh-cloud--a"></div>' +
            '<div class="lh-cloud lh-cloud--b"></div>' +
            '<div class="lh-cloud lh-cloud--c"></div>' +
            '<div class="lh-rim"></div>' +
            '<div class="lh-jade-vein"></div>';
        shell.insertBefore(ornament, shell.firstChild);

        if (frame && !frame.querySelector('.lh-frame-caption')) {
            var cap = document.createElement('div');
            cap.className = 'lh-frame-caption';
            cap.setAttribute('aria-hidden', 'true');
            cap.innerHTML = '<span>轮回道场</span><em></em><span>天地为炉</span>';
            frame.insertBefore(cap, frame.firstChild);
        }
    }

    function enrichStage(stage, theme) {
        if (!stage) return;
        if (stage.getAttribute('data-lh-grand') !== '1') {
            stage.setAttribute('data-lh-grand', '1');
            if (!stage.querySelector('.lh-stage-sky')) {
                var sky = document.createElement('div');
                sky.className = 'lh-stage-sky';
                sky.setAttribute('aria-hidden', 'true');
                sky.innerHTML =
                    '<div class="lh-stage-stars"></div>' +
                    '<div class="lh-stage-mountains"></div>' +
                    '<div class="lh-stage-platform"></div>' +
                    '<div class="lh-stage-runes"></div>';
                stage.insertBefore(sky, stage.firstChild);
            }
        }
        var avatars = stage.querySelectorAll('.lh-avatar');
        for (var i = 0; i < avatars.length; i++) {
            var av = avatars[i];
            if (av.parentNode && av.parentNode.classList && av.parentNode.classList.contains('lh-avatar-wrap')) continue;
            var wrap = document.createElement('div');
            wrap.className = 'lh-avatar-wrap' + (av.classList.contains('lh-avatar--boss') ? ' lh-avatar-wrap--boss' : '');
            av.parentNode.insertBefore(wrap, av);
            var aura = document.createElement('div');
            aura.className = 'lh-aura';
            aura.setAttribute('aria-hidden', 'true');
            wrap.appendChild(aura);
            wrap.appendChild(av);
        }
        var vs = stage.querySelector('.lh-vs-ring');
        if (vs && !vs.querySelector('.lh-vs-core')) {
            vs.innerHTML = '<span class="lh-vs-core">战</span><i class="lh-vs-orbit"></i>';
        }
    }

    function styleExistingLayout(prefix, frame, theme) {
        var meta = getPanelMeta(prefix);
        var sp = resolveStatPrefix(prefix);
        var kids = Array.prototype.slice.call(frame.children);
        var header = null;
        var tokenBlock = null;
        var statsGrid = null;
        var actions = null;
        var logId = (meta && meta.battleLog) || (prefix + 'BattleLog');
        var log = document.getElementById(logId) || document.getElementById(sp + 'BattleLog');
        var attackId = (meta && meta.attackBtn) || ('attack' + prefix.replace('lunhui', 'Lunhui') + 'BossBtn');
        var startId = (meta && meta.startBtn) || ('start' + prefix.replace('lunhui', 'Lunhui') + 'BattleBtn');

        for (var i = 0; i < kids.length; i++) {
            var el = kids[i];
            if (el === log) continue;
            if (!header && el.querySelector && el.querySelector('h2')) {
                header = el;
                continue;
            }
            if (!tokenBlock && el.querySelector && (
                el.querySelector('#' + prefix + 'TokenCount') ||
                el.querySelector('#' + sp + 'TokenCount') ||
                el.querySelector('#dungeonTokenCount') ||
                /令牌/.test(el.textContent || '')
            )) {
                tokenBlock = el;
                continue;
            }
            if (!statsGrid && el.querySelector && (
                el.querySelector('#' + prefix + 'PlayerHealth') ||
                el.querySelector('#' + sp + 'PlayerHealth') ||
                el.querySelector('#' + prefix + 'BossHealth') ||
                el.querySelector('#' + sp + 'BossHealth')
            )) {
                statsGrid = el;
                continue;
            }
            if (!actions && el.querySelector && (
                el.querySelector('#' + attackId) ||
                el.querySelector('[id^="attack"][id$="BossBtn"]') ||
                el.querySelector('#attackBossBtn') ||
                (el.classList && (
                    el.classList.contains('battle-controls') ||
                    el.classList.contains('hbi-battle-controls') ||
                    el.classList.contains('penglai-battle-controls')
                ))
            )) {
                actions = el;
            }
        }

        if (header) {
            header.classList.add('lh-battle-header');
            var h2 = header.querySelector('h2');
            if (h2) h2.classList.add('lh-battle-title');
            var closeBtns = header.querySelectorAll('button');
            for (var c = 0; c < closeBtns.length; c++) closeBtns[c].classList.add('lh-btn', 'lh-btn--close');
        }
        if (tokenBlock) {
            tokenBlock.classList.add('lh-battle-token');
            var startBtn = findDirectChildButton(null, startId);
            if (startBtn) startBtn.classList.add('lh-btn', 'lh-btn--start');
        }
        if (statsGrid) {
            statsGrid.classList.add('lh-battle-stats');
            var cards = statsGrid.children;
            if (cards[0]) cards[0].classList.add('lh-battle-card', 'lh-battle-card--player');
            if (cards[1]) cards[1].classList.add('lh-battle-card', 'lh-battle-card--boss');
        }
        if (actions) {
            actions.classList.add('lh-battle-actions');
            var abs = actions.querySelectorAll('button');
            for (var a = 0; a < abs.length; a++) {
                var b = abs[a];
                b.classList.add('lh-btn');
                if (b.id && b.id.indexOf('attack') === 0) b.classList.add('lh-btn--attack');
                else if (b.id && b.id.indexOf('autoAttack') === 0) b.classList.add('lh-btn--auto');
                else if (b.id && b.id.indexOf('flee') === 0) b.classList.add('lh-btn--flee');
            }
        }
        if (log) log.classList.add('lh-battle-log');

        return { header: header, tokenBlock: tokenBlock, statsGrid: statsGrid, actions: actions, log: log };
    }

    function insertStage(prefix, frame, theme, insertBeforeEl) {
        var existing = frame.querySelector('.lh-battle-stage');
        if (existing) {
            enrichStage(existing, theme);
            return existing;
        }
        var stage = document.createElement('div');
        stage.className = 'lh-battle-stage';
        stage.id = prefix + 'Stage';
        stage.innerHTML =
            '<div class="lh-stage-sky" aria-hidden="true">' +
                '<div class="lh-stage-stars"></div>' +
                '<div class="lh-stage-mountains"></div>' +
                '<div class="lh-stage-platform"></div>' +
                '<div class="lh-stage-runes"></div>' +
            '</div>' +
            '<div class="lh-stage-glow" aria-hidden="true"></div>' +
            '<div class="lh-fighter lh-fighter--player" id="' + prefix + 'PlayerFighter">' +
                '<div class="lh-avatar-wrap">' +
                    '<div class="lh-aura" aria-hidden="true"></div>' +
                    '<div class="lh-avatar lh-avatar--player" aria-hidden="true"><span>道</span></div>' +
                '</div>' +
                '<div class="lh-fighter-name">修士</div>' +
                '<div class="lh-hp-track"><div class="lh-hp-fill lh-hp-fill--player" id="' + prefix + 'PlayerHpFill"></div></div>' +
                '<div class="lh-hp-label">气血 <span id="' + prefix + 'PlayerHpLabel">—</span></div>' +
            '</div>' +
            '<div class="lh-vs" aria-hidden="true"><span class="lh-vs-ring"><span class="lh-vs-core">战</span><i class="lh-vs-orbit"></i></span></div>' +
            '<div class="lh-fighter lh-fighter--boss" id="' + prefix + 'BossFighter">' +
                '<div class="lh-avatar-wrap lh-avatar-wrap--boss">' +
                    '<div class="lh-aura" aria-hidden="true"></div>' +
                    '<div class="lh-avatar lh-avatar--boss" aria-hidden="true"><span>' + (theme.glyph || '妖') + '</span></div>' +
                '</div>' +
                '<div class="lh-fighter-name" id="' + prefix + 'BossNameLabel">' + (theme.boss || '强敌') + '</div>' +
                '<div class="lh-hp-track"><div class="lh-hp-fill lh-hp-fill--boss" id="' + prefix + 'BossHpFill"></div></div>' +
                '<div class="lh-hp-label">妖息 <span id="' + prefix + 'BossHpLabel">—</span></div>' +
                '<div class="lh-rez-pips" id="' + prefix + 'RezPips" title="复活进度"></div>' +
            '</div>' +
            '<div class="lh-fx-layer" id="' + prefix + 'FxLayer"></div>' +
            '<div class="lh-combat-banner" id="' + prefix + 'CombatBanner" aria-live="polite"></div>';

        if (insertBeforeEl && insertBeforeEl.parentNode === frame) {
            frame.insertBefore(stage, insertBeforeEl);
        } else if (frame.firstChild) {
            frame.insertBefore(stage, frame.firstChild.nextSibling);
        } else {
            frame.appendChild(stage);
        }

        stage.setAttribute('data-lh-grand', '1');
        var rez = document.getElementById(prefix + 'RezPips');
        if (rez) {
            var html = '';
            for (var i = 0; i < 10; i++) html += '<i></i>';
            rez.innerHTML = html;
        }
        return stage;
    }

    function ensureLunhuiBattleChrome(prefix, opts) {
        opts = opts || {};
        var ui = document.getElementById(prefix + 'UI');
        var overlay = document.getElementById(prefix + 'Overlay');
        if (!ui) return null;
        var theme = THEME_BY_PREFIX[prefix] || { accent: '#7ec8b0', mist: 'rgba(126,200,176,0.16)', glyph: '劫', boss: '强敌' };
        if (opts.bossName) theme = Object.assign({}, theme, { boss: opts.bossName });
        if (opts.glyph) theme = Object.assign({}, theme, { glyph: opts.glyph });

        if (overlay) {
            overlay.classList.add('lh-battle-overlay');
            applyThemeVars(overlay, theme);
        }
        ui.classList.add('lh-battle-panel', 'lh-battle-panel--grand');
        applyThemeVars(ui, theme);

        // 面板从隐藏→显示时播一次入场；关闭时清标记，下次打开再播
        var panelVisible = ui.style.display === 'block' ||
            (ui.style.display !== 'none' && window.getComputedStyle(ui).display !== 'none');
        if (panelVisible) {
            if (ui.getAttribute('data-lh-entered') !== '1') {
                ui.setAttribute('data-lh-entered', '1');
                playPanelEnter(ui);
            }
        } else {
            ui.removeAttribute('data-lh-entered');
        }

        var shell;
        var frame;
        if (ui.getAttribute('data-lh-enhanced') !== '1') {
            ui.setAttribute('data-lh-enhanced', '1');
            shell = wrapPanelChildren(ui);
            frame = shell.querySelector('.lh-battle-frame') || shell;
            var layout = styleExistingLayout(prefix, frame, theme);
            var insertBefore = layout.statsGrid || layout.tokenBlock || layout.actions;
            insertStage(prefix, frame, theme, insertBefore);
            if (opts.bossName) {
                var bn = document.getElementById(prefix + 'BossNameLabel');
                if (bn) bn.textContent = opts.bossName;
            }
            var title = frame.querySelector('.lh-battle-title');
            if (title && !title.querySelector('.lh-seal')) {
                var seal = document.createElement('span');
                seal.className = 'lh-seal';
                seal.textContent = theme.glyph || '劫';
                title.appendChild(seal);
            }
        } else {
            shell = ui.querySelector('.lh-battle-shell');
            frame = shell ? shell.querySelector('.lh-battle-frame') : null;
            if (frame) {
                var stageEl = frame.querySelector('.lh-battle-stage');
                if (stageEl) enrichStage(stageEl, theme);
            }
        }
        if (shell && frame) decorateGrandChrome(shell, frame);
        enhanceReward(prefix, theme);
        return ui;
    }

    function setFill(el, pct) {
        if (!el) return;
        var p = Math.max(0, Math.min(100, pct));
        el.style.width = p.toFixed(2) + '%';
        el.classList.toggle('is-low', p <= 25);
        el.classList.toggle('is-crit', p <= 10);
    }

    function syncRezPips(prefix, count) {
        var wrap = document.getElementById(prefix + 'RezPips');
        if (!wrap) return;
        var n = Math.max(0, Math.min(10, Number(count) || 0));
        var pips = wrap.children;
        for (var i = 0; i < pips.length; i++) {
            pips[i].classList.toggle('is-on', i < n);
        }
    }

    function lunhuiBattleSync(prefix, state, playerStats) {
        if (!prefix) return;
        ensureLunhuiBattleChrome(prefix);
        var st = state || {};
        var stats = playerStats || {};
        var battling = !!(st.isBattling || st.isBattleActive);

        var playerCur = battling ? st.playerHealth : (stats.health != null ? stats.health : st.playerHealth);
        var playerMax = battling
            ? (st.playerMaxHealth != null ? st.playerMaxHealth : stats.health)
            : (stats.health != null ? stats.health : st.playerMaxHealth);
        var bossCur = st.bossHealth;
        var bossMax = st.bossMaxHealth;

        var pPct = lunhuiBattleHpPct(playerCur, playerMax);
        var bPct = lunhuiBattleHpPct(bossCur, bossMax);
        setFill(document.getElementById(prefix + 'PlayerHpFill'), playerMax == null ? 100 : pPct);
        setFill(document.getElementById(prefix + 'BossHpFill'), bossMax == null ? 0 : bPct);

        var pLabel = document.getElementById(prefix + 'PlayerHpLabel');
        var bLabel = document.getElementById(prefix + 'BossHpLabel');
        var fmt = typeof formatSci === 'function' ? formatSci : String;
        if (pLabel) {
            pLabel.textContent = playerCur != null ? fmt(playerCur) : '—';
        }
        if (bLabel) {
            if (bossCur != null && bossMax != null) bLabel.textContent = fmt(bossCur) + ' / ' + fmt(bossMax);
            else bLabel.textContent = '—';
        }
        syncRezPips(prefix, st.bossResurrections);

        var stage = document.getElementById(prefix + 'Stage');
        if (stage) stage.classList.toggle('is-battling', battling);

        var ui = document.getElementById(prefix + 'UI');
        if (ui) ui.classList.toggle('is-battling', battling);
    }

    function canFx(prefix, key) {
        var k = prefix + ':' + (key || 'hit');
        var now = Date.now();
        if ((lastFxAt[k] || 0) + FX_THROTTLE_MS > now) return false;
        lastFxAt[k] = now;
        return true;
    }

    function spawnFloat(layer, text, cls, xBias) {
        if (!layer) return;
        var el = document.createElement('div');
        el.className = 'lh-float ' + (cls || '');
        el.textContent = text;
        var x = 42 + (xBias || 0) + (Math.random() * 16 - 8);
        el.style.left = x + '%';
        el.style.top = (38 + Math.random() * 18) + '%';
        layer.appendChild(el);
        setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 900);
    }

    function flashFighter(prefix, side) {
        var id = side === 'boss' ? prefix + 'BossFighter' : prefix + 'PlayerFighter';
        var el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('is-hit', 'is-strike');
        void el.offsetWidth;
        el.classList.add(side === 'boss' ? 'is-hit' : 'is-hit');
        var other = document.getElementById(side === 'boss' ? prefix + 'PlayerFighter' : prefix + 'BossFighter');
        if (other) {
            other.classList.remove('is-strike');
            void other.offsetWidth;
            other.classList.add('is-strike');
        }
        setTimeout(function () {
            el.classList.remove('is-hit');
            if (other) other.classList.remove('is-strike');
        }, 320);
    }

    function playPanelEnter(ui) {
        if (!ui) return;
        ui.classList.remove('lh-panel-enter', 'lh-shake', 'lh-shake-hard');
        void ui.offsetWidth;
        ui.classList.add('lh-panel-enter');
        clearTimeout(ui._lhEnterTimer);
        ui._lhEnterTimer = setTimeout(function () {
            ui.classList.remove('lh-panel-enter');
        }, 520);
    }

    function shakePanel(prefix, hard) {
        var ui = document.getElementById(prefix + 'UI');
        if (!ui) return;
        // 震屏前清掉入场类，避免与 shake 抢 animation，结束后也不会回落到 lhPanelRise
        ui.classList.remove('lh-shake', 'lh-shake-hard', 'lh-panel-enter');
        void ui.offsetWidth;
        ui.classList.add(hard ? 'lh-shake-hard' : 'lh-shake');
        clearTimeout(ui._lhShakeTimer);
        ui._lhShakeTimer = setTimeout(function () {
            ui.classList.remove('lh-shake', 'lh-shake-hard');
        }, hard ? 420 : 280);
    }

    function showBanner(prefix, text, cls) {
        var el = document.getElementById(prefix + 'CombatBanner');
        if (!el || !text) return;
        el.textContent = text;
        el.className = 'lh-combat-banner is-show ' + (cls || '');
        clearTimeout(el._lhBannerTimer);
        el._lhBannerTimer = setTimeout(function () {
            el.classList.remove('is-show');
        }, 1400);
    }

    /**
     * @param {string} prefix
     * @param {{damage?:*, isCrit?:boolean, side?:'player'|'boss', kind?:string, text?:string}} opt
     */
    function lunhuiBattleFx(prefix, opt) {
        opt = opt || {};
        ensureLunhuiBattleChrome(prefix);
        var kind = opt.kind || 'hit';
        var layer = document.getElementById(prefix + 'FxLayer');
        var fmt = typeof formatSci === 'function' ? formatSci : String;

        if (kind === 'start') {
            showBanner(prefix, opt.text || '法阵开启', 'banner-start');
            shakePanel(prefix, false);
            return;
        }
        if (kind === 'revive') {
            showBanner(prefix, opt.text || '妖躯重生！', 'banner-revive');
            shakePanel(prefix, true);
            spawnFloat(layer, '重生', 'lh-float--revive', 20);
            return;
        }
        if (kind === 'levelup') {
            showBanner(prefix, opt.text || '境界晋升', 'banner-level');
            shakePanel(prefix, true);
            return;
        }
        if (kind === 'win' || kind === 'lose' || kind === 'flee') {
            showBanner(prefix, opt.text || (kind === 'flee' ? '抽身而退' : kind === 'win' ? '斩杀！' : '败北'), 'banner-' + kind);
            shakePanel(prefix, kind !== 'flee');
            return;
        }

        if (!canFx(prefix, kind + (opt.isCrit ? 'c' : ''))) {
            // 仍做轻量受击闪，但不刷飘字
            if (opt.side === 'boss') flashFighter(prefix, 'boss');
            else if (opt.side === 'player') flashFighter(prefix, 'player');
            return;
        }

        var side = opt.side || 'boss';
        flashFighter(prefix, side);
        if (opt.isCrit) shakePanel(prefix, true);
        else if (side === 'player') shakePanel(prefix, false);

        if (opt.damage != null) {
            var t = (opt.isCrit ? '暴击 ' : '-') + fmt(opt.damage);
            spawnFloat(layer, t, opt.isCrit ? 'lh-float--crit' : (side === 'player' ? 'lh-float--hurt' : 'lh-float--dmg'), side === 'boss' ? 18 : -18);
        } else if (opt.text) {
            spawnFloat(layer, opt.text, 'lh-float--info', 0);
        }
    }

    function styleBattleLogEntry(entry, message) {
        if (!entry) return;
        entry.classList.add('lh-log-line');
        if (message.indexOf('击败') !== -1 || message.indexOf('奖励') !== -1 || message.indexOf('开始') !== -1) {
            entry.classList.add('lh-log--good');
        } else if (message.indexOf('暴击') !== -1) {
            entry.classList.add('lh-log--crit');
        } else if (message.indexOf('伤害') !== -1) {
            entry.classList.add('lh-log--hit');
        } else if (message.indexOf('复活') !== -1 || message.indexOf('晋升') !== -1) {
            entry.classList.add('lh-log--warn');
        } else if (message.indexOf('逃离') !== -1 || message.indexOf('败') !== -1) {
            entry.classList.add('lh-log--bad');
        }
    }

    function initAllLunhuiBattlePanels() {
        var prefixes = Object.keys(THEME_BY_PREFIX);
        for (var i = 0; i < prefixes.length; i++) {
            try { ensureLunhuiBattleChrome(prefixes[i]); } catch (e) { /* ignore */ }
        }
        if (typeof LUNHUI_ELITE_DUNGEONS !== 'undefined' && LUNHUI_ELITE_DUNGEONS) {
            for (var j = 0; j < LUNHUI_ELITE_DUNGEONS.length; j++) {
                var c = LUNHUI_ELITE_DUNGEONS[j];
                if (!c || !c.dom) continue;
                try {
                    ensureLunhuiBattleChrome(c.dom, { bossName: c.boss, glyph: (c.tLabel || '').replace('T', '') || undefined });
                    var bn = document.getElementById(c.dom + 'BossNameLabel');
                    if (bn && c.boss) bn.textContent = c.boss;
                } catch (e2) { /* ignore */ }
            }
        }
    }

    window.lunhuiBattleHpPct = lunhuiBattleHpPct;
    window.ensureLunhuiBattleChrome = ensureLunhuiBattleChrome;
    window.lunhuiBattleSync = lunhuiBattleSync;
    window.lunhuiBattleFx = lunhuiBattleFx;
    window.styleLunhuiBattleLogEntry = styleBattleLogEntry;
    window.initAllLunhuiBattlePanels = initAllLunhuiBattlePanels;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(initAllLunhuiBattlePanels, 0);
        });
    } else {
        setTimeout(initAllLunhuiBattlePanels, 0);
    }
})();

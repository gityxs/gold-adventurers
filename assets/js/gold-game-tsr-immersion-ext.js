/**
 * 时光秘境 · 沉浸体验大批补强（feel-ext 之后加载）
 * - 跳过全路径解挂 / 演出期锁 UI
 * - 战利品开箱感 / 掉落延后
 * - 探索·换层节拍 / 数字闪动
 * - 音效分化·触感·静音
 * - 战后补给语义纠偏 / 结算卡战利品
 */
(function initTsrImmersion() {
    if (window.__tsrImmersionReady) return;
    window.__tsrImmersionReady = true;

    /* ========== 音效 / 触感 / 静音 ========== */
    try {
        if (localStorage.getItem('tsr_feel_fast') === '1' && player?.timeSecretRealm?.currentRun) {
            player.timeSecretRealm.currentRun.battleFeelFast = true;
        }
    } catch (e) { /* ignore */ }

    window.isTsrSfxMuted = function () {
        try { return localStorage.getItem('tsr_sfx_muted') === '1'; } catch (e) { return false; }
    };
    window.toggleTsrSfxMute = function () {
        try {
            localStorage.setItem('tsr_sfx_muted', isTsrSfxMuted() ? '0' : '1');
        } catch (e) { /* ignore */ }
        const btn = document.getElementById('tsrSfxMuteBtn');
        if (btn) btn.textContent = isTsrSfxMuted() ? '音效:关' : '音效:开';
        showTsrAmbientToast?.(isTsrSfxMuted() ? '音效已关闭' : '音效已开启', '', 'room');
    };
    window.tsrVibrate = function (pattern) {
        try {
            if (navigator.vibrate) navigator.vibrate(pattern);
        } catch (e) { /* ignore */ }
    };

    if (typeof playTsrCombatSfx === 'function') {
        playTsrCombatSfx = function (kind) {
            if (isTsrSfxMuted()) return;
            try {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return;
                if (!window._tsrAudioCtx) window._tsrAudioCtx = new AC();
                const ctx = window._tsrAudioCtx;
                if (ctx.state === 'suspended') ctx.resume();
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                const now = ctx.currentTime;
                const map = {
                    hit: { f: 220, t: 0.055, type: 'square', v: 0.032 },
                    crit: { f: 460, t: 0.12, type: 'sawtooth', v: 0.048 },
                    hurt: { f: 110, t: 0.1, type: 'triangle', v: 0.042 },
                    skill: { f: 540, t: 0.13, type: 'square', v: 0.038 },
                    win: { f: 700, t: 0.2, type: 'sine', v: 0.048 },
                    start: { f: 170, t: 0.14, type: 'sine', v: 0.03 },
                    tick: { f: 340, t: 0.035, type: 'sine', v: 0.018 },
                    loot: { f: 620, t: 0.16, type: 'triangle', v: 0.04 },
                    floor: { f: 260, t: 0.12, type: 'sine', v: 0.03 },
                    trap: { f: 90, t: 0.14, type: 'sawtooth', v: 0.04 },
                    heal: { f: 520, t: 0.15, type: 'sine', v: 0.035 },
                    explore: { f: 300, t: 0.08, type: 'triangle', v: 0.025 },
                    warn: { f: 150, t: 0.12, type: 'square', v: 0.035 }
                };
                const cfg = map[kind] || map.hit;
                o.type = cfg.type;
                o.frequency.setValueAtTime(cfg.f, now);
                if (kind === 'loot' || kind === 'win' || kind === 'crit') {
                    o.frequency.exponentialRampToValueAtTime(cfg.f * 1.45, now + cfg.t);
                }
                g.gain.setValueAtTime(cfg.v, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + cfg.t);
                o.start(now);
                o.stop(now + cfg.t + 0.02);
                o.onended = () => {
                    try { o.disconnect(); g.disconnect(); } catch (e2) { /* ignore */ }
                };
            } catch (e) { /* ignore */ }
            if (kind === 'crit') tsrVibrate([40, 30, 40]);
            else if (kind === 'hurt' || kind === 'trap' || kind === 'warn') tsrVibrate(28);
            else if (kind === 'win' || kind === 'loot') tsrVibrate([16, 30, 16]);
        };
    }

    /* ========== 战利品缓冲 ========== */
    window.pushTsrBattleLoot = function (entry) {
        const run = player.timeSecretRealm?.currentRun;
        if (!run || !entry) return;
        if (!run.collectBattleLoot && !run.battleInProgress) return;
        if (!run.battleLootBuffer) run.battleLootBuffer = [];
        run.battleLootBuffer.push(entry);
        if (run.lastBattleSummary) {
            run.lastBattleSummary.loot = run.battleLootBuffer.slice();
        }
    };

    if (typeof addTsrRelic === 'function') {
        const _relic = addTsrRelic;
        addTsrRelic = function (relicKey) {
            const ok = _relic(relicKey);
            if (ok) {
                const relic = TSR_RELIC_POOL?.[relicKey];
                pushTsrBattleLoot({
                    kind: 'relic',
                    icon: relic?.icon || '🏺',
                    name: relic?.name || relicKey
                });
                if (player.timeSecretRealm?.currentRun?.battleInProgress) {
                    appendTsrFeelTicker?.('遗物：' + (relic?.name || relicKey), 'loot');
                } else {
                    showTsrAmbientToast?.(relic?.icon + ' ' + (relic?.name || '遗物'), '获得遗物', 'elite');
                    playTsrCombatSfx?.('loot');
                }
            }
            return ok;
        };
    }

    if (typeof addTsrEquipment === 'function') {
        const _eq = addTsrEquipment;
        addTsrEquipment = function (item, sourceLabel) {
            const ok = _eq(item, sourceLabel);
            if (ok && item) {
                pushTsrBattleLoot({
                    kind: 'equip',
                    icon: item.icon || '🗡️',
                    name: item.name || '装备',
                    tier: item.tier
                });
                if (!player.timeSecretRealm?.currentRun?.battleInProgress) {
                    showTsrAmbientToast?.(item.icon + ' ' + item.name, sourceLabel || '获得装备', 'room');
                    playTsrCombatSfx?.('loot');
                    flashTsrStatEl?.('equipment');
                }
            }
            return ok;
        };
    }

    if (typeof showTsrEquipOverflowPanel === 'function') {
        const _ov = showTsrEquipOverflowPanel;
        showTsrEquipOverflowPanel = function (item) {
            const run = player.timeSecretRealm?.currentRun;
            if (run && (run.battleInProgress || run.collectBattleLoot)) {
                run.pendingOverflowItems = run.pendingOverflowItems || [];
                run.pendingOverflowItems.push(item);
                pushTsrBattleLoot({
                    kind: 'equip-pending',
                    icon: item?.icon || '🗡️',
                    name: (item?.name || '装备') + '（待处理）'
                });
                appendTsrFeelTicker?.('装备掉落待处理', 'loot');
                return;
            }
            return _ov(item);
        };
    }

    window.flushTsrPendingOverflow = function () {
        const run = player.timeSecretRealm?.currentRun;
        if (!run?.pendingOverflowItems?.length) return;
        const next = run.pendingOverflowItems.shift();
        if (next && typeof showTsrEquipOverflowPanel === 'function') {
            // 此时已不在 collect/battle，直接显示
            const panelFn = showTsrEquipOverflowPanel;
            // 若仍是包装函数且会再入队，临时清标志
            run.collectBattleLoot = false;
            run.battleInProgress = false;
            panelFn(next);
        }
    };

    /* ========== 数字闪动 ========== */
    window.flashTsrStatEl = function (kind) {
        const map = {
            currency: ['tsrCurrentCurrency', 'tsrCurrency'],
            time: ['tsrTimeLeft', 'tsrTimeDisplay'],
            spirit: ['tsrSpiritCharge', 'tsrCombatPower']
        };
        (map[kind] || []).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.classList.remove('tsr-stat-flash');
            void el.offsetWidth;
            el.classList.add('tsr-stat-flash');
        });
    };

    if (typeof addTsrRunCurrency === 'function') {
        const _cur = addTsrRunCurrency;
        addTsrRunCurrency = function (amount, options) {
            const gained = _cur(amount, options);
            if (gained > 0) flashTsrStatEl('currency');
            return gained;
        };
    }

    if (typeof chargeTsrSpirit === 'function') {
        const _ch = chargeTsrSpirit;
        chargeTsrSpirit = function (amount) {
            const r = _ch(amount);
            flashTsrStatEl('spirit');
            return r;
        };
    }

    /* ========== 跳过解挂 ========== */
    window.resolveTsrFeelModals = function () {
        const run = player.timeSecretRealm?.currentRun;
        if (run?._feelEmergencyResolve) run._feelEmergencyResolve('skip');
        if (run?._feelCinemaResolve) run._feelCinemaResolve('skip');
        if (run?._feelResultResolve) run._feelResultResolve('skip');
        const em = document.getElementById('tsrFeelEmergency');
        if (em) em.style.display = 'none';
        const cine = document.getElementById('tsrBossCinema');
        if (cine) cine.style.display = 'none';
    };

        if (typeof skipTsrBattleFeel === 'function') {
        const _skip = skipTsrBattleFeel;
        skipTsrBattleFeel = function (force) {
            resolveTsrFeelModals();
            _skip(force);
            resolveTsrFeelModals();
        };
    }

    /* ========== Boss 过场 / 结算卡 Promise 接入 skip ========== */
    if (typeof playTsrBossCinematic === 'function') {
        const _cine = playTsrBossCinematic;
        playTsrBossCinematic = function (opts) {
            const p = _cine(opts);
            const run = player.timeSecretRealm?.currentRun;
            if (!run) return p;
            return new Promise(resolve => {
                run._feelCinemaResolve = () => {
                    run._feelCinemaResolve = null;
                    const cine = document.getElementById('tsrBossCinema');
                    if (cine) cine.style.display = 'none';
                    resolve();
                };
                Promise.resolve(p).then(() => {
                    if (run._feelCinemaResolve) {
                        run._feelCinemaResolve = null;
                        resolve();
                    }
                });
            });
        };
    }

    if (typeof showTsrBattleResultCard === 'function') {
        const _card = showTsrBattleResultCard;
        showTsrBattleResultCard = function (summary) {
            const card = document.getElementById('tsrBattleResultCard');
            if (!card || !summary) return Promise.resolve();
            const title = summary.victory ? '战斗胜利' : '战斗受挫';
            const fmt = typeof formatTsrCombatNum === 'function' ? formatTsrCombatNum : String;
            const loot = summary.loot || [];
            // 币条目去重展示：保留遗物/装备，币用汇总
            const lootRows = loot.filter(l => l.kind !== 'currency').slice(0, 6);
            const lootHtml = lootRows.length
                ? `<div class="tsr-battle-loot">${lootRows.map(l =>
                    `<span class="tsr-battle-loot-item ${l.kind || ''}">${l.icon || ''} ${l.name || ''}</span>`
                ).join('')}</div>`
                : (summary.victory
                    ? '<div class="tsr-battle-loot empty">本场无遗物/装备掉落</div>'
                    : '<div class="tsr-battle-loot empty">建议休息或使用补给后再战</div>');
            card.style.display = 'block';
            card.className = 'tsr-battle-result' + (summary.victory ? ' win' : ' lose');
            card.innerHTML = `
                <div class="tsr-battle-result-title">${title}</div>
                <div class="tsr-battle-result-name">${summary.monsterIcon || ''} ${summary.monsterName || '敌人'}</div>
                <div class="tsr-battle-result-grid">
                    <span>回合 <b>${summary.rounds || 0}</b></span>
                    <span>输出 <b>${fmt(summary.damage || 0)}</b></span>
                    <span>承伤 <b>${fmt(summary.taken || 0)}</b></span>
                    <span>暴击 <b>${summary.crits || 0}</b></span>
                    <span>连胜 <b>×${summary.streak || 0}</b></span>
                    <span>获得 <b>${summary.currency || 0}</b>币</span>
                </div>
                ${lootHtml}
                <button type="button" class="tsr-btn tsr-btn-gold tsr-battle-result-ok" id="tsrBattleResultOk">领取并继续</button>`;
            playTsrCombatSfx?.(summary.victory ? 'win' : 'hurt');
            if (lootRows.length) playTsrCombatSfx?.('loot');
            const run = player.timeSecretRealm?.currentRun;
            return new Promise(resolve => {
                let settled = false;
                const done = () => {
                    if (settled) return;
                    settled = true;
                    card.style.display = 'none';
                    run && (run._feelResultResolve = null);
                    if (lootRows[0]) {
                        showTsrAmbientToast?.(lootRows[0].icon + ' ' + lootRows[0].name, lootRows.length > 1 ? ('等' + lootRows.length + '件战利品') : '战利品入库', 'elite');
                    }
                    resolve();
                };
                run && (run._feelResultResolve = done);
                const btn = document.getElementById('tsrBattleResultOk');
                if (btn) btn.onclick = done;
                const auto = setTimeout(done, summary.victory ? 2600 : 1600);
                if (run) {
                    run._battleFeelTimers = run._battleFeelTimers || [];
                    run._battleFeelTimers.push(auto);
                    run._battleFeelResolvers = run._battleFeelResolvers || [];
                    run._battleFeelResolvers.push(done);
                }
                if (run?.battleFeelSkip) done();
            });
        };
        void _card;
    }

    /* ========== 战后补给语义 ========== */
    if (typeof refreshTsrFeelQuickBar === 'function') {
        const _qb = refreshTsrFeelQuickBar;
        refreshTsrFeelQuickBar = function () {
            _qb();
            const bar = document.getElementById('tsrFeelQuickBar');
            if (!bar) return;
            const label = bar.querySelector('.tsr-feel-quick-label');
            if (label) {
                label.textContent = '战后补给';
                label.title = '战斗已结算，此处补充生命/精灵，不影响本场伤害结果';
            }
        };
    }

    /* ========== 快捷栏加静音按钮 ========== */
    if (typeof updateTsrMonsterBanner === 'function') {
        const _b = updateTsrMonsterBanner;
        updateTsrMonsterBanner = function (monster, stats, isBoss, isElite) {
            _b(monster, stats, isBoss, isElite);
            const wrap = document.querySelector('#tsrMonsterBanner .tsr-feel-btns');
            if (wrap && !document.getElementById('tsrSfxMuteBtn')) {
                const mute = document.createElement('button');
                mute.type = 'button';
                mute.id = 'tsrSfxMuteBtn';
                mute.className = 'tsr-battle-skip';
                mute.textContent = isTsrSfxMuted() ? '音效:关' : '音效:开';
                mute.onclick = function () { toggleTsrSfxMute(); };
                wrap.insertBefore(mute, wrap.firstChild);
            }
            // 倍速持久化钩子
            const speed = document.getElementById('tsrBattleSpeedBtn');
            if (speed && !speed.__immersionHook) {
                speed.__immersionHook = true;
                speed.addEventListener('click', () => {
                    try {
                        localStorage.setItem('tsr_feel_fast', player.timeSecretRealm?.currentRun?.battleFeelFast ? '1' : '0');
                    } catch (e) { /* ignore */ }
                });
            }
            // 清理粘滞特效 class
            const banner = document.getElementById('tsrMonsterBanner');
            if (banner) banner.classList.remove('tsr-hit-finisher', 'tsr-victory-flash');
        };
    }

    /* ========== 探索 / 换层节拍 ========== */
    if (typeof tsrExploreRoom === 'function') {
        const _ex = tsrExploreRoom;
        tsrExploreRoom = function () {
            const run = player.timeSecretRealm?.currentRun;
            const room = run?.currentRoom;
            if (!room || room.explored) return _ex();
            const meta = typeof getTsrRoomTypeMeta === 'function' ? getTsrRoomTypeMeta(room.type) : null;
            const kind = room.isBoss ? 'boss' : (room.isElite ? 'elite' : (room.hasTrap && !room.trapDisarmed ? 'warn' : 'room'));
            showTsrAmbientToast?.(
                (meta?.icon || '🚪') + ' 探索中…',
                meta?.name || room.name || '房间',
                kind
            );
            playTsrCombatSfx?.(room.hasTrap && !room.trapDisarmed ? 'trap' : 'explore');
            flashTsrStatEl('time');
            const isBattleRoom = room.type === 'battle' || room.type === 'elite' || room.type === 'boss' || room.isBoss || room.isElite;
            if (isBattleRoom) {
                // 开战预告：须在 sync 战斗开始前弹出（否则会被 battleInProgress 吞掉）
                const mon = room.monster;
                const threat = room.isBoss || room.type === 'boss' ? '首领压制' : (room.isElite || room.type === 'elite' ? '精英压迫' : '遭遇战');
                const name = mon ? ((typeof formatTsrMonsterNamePlain === 'function' ? formatTsrMonsterNamePlain(mon) : mon.name) || '未知妖异') : (meta?.name || '守关者');
                const icon = mon?.icon || (room.isBoss || room.type === 'boss' ? '👹' : (room.isElite || room.type === 'elite' ? '💀' : '⚔️'));
                showTsrAmbientToast?.(icon + ' ' + name, threat + '即将交锋', room.isBoss || room.type === 'boss' ? 'boss' : (room.isElite || room.type === 'elite' ? 'elite' : 'warn'));
            }
            const r = _ex();
            // 探索连击提示
            if (run?.exploreStreak >= 3 && run.exploreStreak % 3 === 0) {
                showTsrAmbientToast?.('探索连击 ×' + run.exploreStreak, '额外秘境币已入账', 'floor');
                playTsrCombatSfx?.('loot');
            }
            if (!isBattleRoom && (room.type === 'treasure' || room.type === 'rest' || room.type === 'shrine' || room.type === 'event')) {
                const tag = room.type === 'treasure' ? '战利品结算' : (room.type === 'rest' ? '休整完成' : (room.type === 'shrine' ? '神龛回应' : '事件落定'));
                showTsrAmbientToast?.(tag, meta?.name || room.name || '探索收获', 'floor');
                playTsrCombatSfx?.(room.type === 'treasure' ? 'loot' : 'explore');
            }
            updateActionButtons?.();
            return r;
        };
    }

    if (typeof tsrNextFloor === 'function') {
        const _nf = tsrNextFloor;
        tsrNextFloor = function () {
            const run = player.timeSecretRealm?.currentRun;
            const consec = run?.lastAction === 'nextFloor' ? (run.consecutiveFloors || 0) + 1 : 0;
            const before = run?.currentFloor;
            _nf();
            const after = player.timeSecretRealm?.currentRun;
            if (!after?.isActive) return;
            if (after.currentFloor !== before) {
                flashTsrStatEl('time');
                playTsrCombatSfx?.('floor');
                if (consec >= 1) {
                    showTsrAmbientToast?.('连续赶层 ×' + Math.min(4, consec), '时间与生命惩罚已生效', 'warn');
                    playTsrCombatSfx?.('warn');
                }
                if (after.currentFloor % 10 === 0) {
                    showTsrAmbientToast?.('里程碑 · 第' + after.currentFloor + '层', '时光祝福已触发', 'floor');
                    playTsrCombatSfx?.('loot');
                }
                const affix = typeof getTsrActiveAffix === 'function' ? getTsrActiveAffix() : null;
                if (affix && after.currentFloor % 7 === 0) {
                    showTsrAmbientToast?.('层间词缀', affix.name || affix.id || '新词缀降临', 'elite');
                }
            }
            updateActionButtons?.();
        };
    }

    /* ========== 战术选定过渡 ========== */
    if (typeof tsrChooseBattleTactic === 'function') {
        const _tac = tsrChooseBattleTactic;
        tsrChooseBattleTactic = function (key) {
            showTsrAmbientToast?.('战术就绪', key && key !== 'none' ? '战术已选定，开战！' : '直接开战！', 'elite');
            playTsrCombatSfx?.('start');
            return _tac(key);
        };
    }

    /* ========== 休息/宝箱高光 ========== */
    if (typeof handleRestRoom === 'function') {
        const _rest = handleRestRoom;
        handleRestRoom = function () {
            const r = _rest();
            showTsrAmbientToast?.('🛏️ 休息', '生命与精力有所恢复', 'room');
            playTsrCombatSfx?.('heal');
            flashTsrStatEl('time');
            return r;
        };
    }
    if (typeof handleTreasureRoom === 'function') {
        const _tr = handleTreasureRoom;
        handleTreasureRoom = function () {
            const r = _tr();
            showTsrAmbientToast?.('💎 宝箱', '财富的味道…', 'floor');
            playTsrCombatSfx?.('loot');
            flashTsrStatEl('currency');
            return r;
        };
    }

    /* ========== hide banner 清理 ========== */
    if (typeof hideTsrMonsterBanner === 'function') {
        const _hide = hideTsrMonsterBanner;
        hideTsrMonsterBanner = function (clearContent, opts) {
            opts = opts || {};
            const run = player.timeSecretRealm?.currentRun;
            // 探索结算刷新 UI 会误调 hide：演出中勿打断，否则卡在「准备开战」
            if (run?.battleInProgress && !opts.abort && !clearContent) {
                return;
            }
            resolveTsrFeelModals();
            if (run) {
                run.collectBattleLoot = false;
                // 仅明确中止（清内容/abort）时才打断演出
                if (run.battleInProgress && (opts.abort || clearContent) && typeof skipTsrBattleFeel === 'function') {
                    skipTsrBattleFeel(true);
                }
            }
            const banner = document.getElementById('tsrMonsterBanner');
            if (banner) {
                banner.classList.remove('tsr-hit-finisher', 'tsr-victory-flash', 'tsr-low-hp', 'tsr-hit-shake', 'tsr-hit-crit', 'tsr-hit-hurt', 'tsr-hit-skill');
            }
            hideTsrFeelQuickBar?.();
            return _hide(clearContent);
        };
    }

    /* ========== 持久倍速读入开局 ========== */
    if (typeof startTimeSecretRealm === 'function') {
        const _st = startTimeSecretRealm;
        startTimeSecretRealm = function () {
            const r = _st();
            try {
                if (localStorage.getItem('tsr_feel_fast') === '1' && player.timeSecretRealm?.currentRun) {
                    player.timeSecretRealm.currentRun.battleFeelFast = true;
                }
            } catch (e) { /* ignore */ }
            return r;
        };
    }
})();

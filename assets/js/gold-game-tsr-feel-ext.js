/**
 * 时光秘境 · 战斗/探索体验加深
 * - 连击、停顿、火花、现场战报、倍速/跳过、结算卡
 * - Boss/精英开场过场
 * - 战中急救（药水确认）与精灵呼唤
 * - 进房/换层氛围
 */
(function initTsrFeelDepth() {
    if (window.__tsrFeelDepthReady) return;
    window.__tsrFeelDepthReady = true;

    const TSR_FEEL_COMBAT_ITEM_EFFECTS = {
        heal: 1, coffee: 1, archonTear: 1, spiritCharge: 1, spiritAwaken: 1,
        spiritBond: 1, rage: 1, counterShield: 1, spiritSnack: 1, starEssence: 1,
        dominionElixir: 1
    };

    function ensureFeelHelpers() {
        if (typeof pushTsrFeelEvent !== 'function') {
            window.pushTsrFeelEvent = function (evt) {
                const run = player.timeSecretRealm?.currentRun;
                if (!run || !evt) return;
                if (!run.pendingFeelEvents) run.pendingFeelEvents = [];
                run.pendingFeelEvents.push(evt);
            };
        }
    }

    function ensureFeelExtraNodes(stage) {
        if (!stage) return;
        if (!document.getElementById('tsrFeelCombo')) {
            const combo = document.createElement('div');
            combo.id = 'tsrFeelCombo';
            combo.className = 'tsr-feel-combo';
            combo.style.display = 'none';
            stage.insertBefore(combo, stage.firstChild);
        }
        if (!document.getElementById('tsrFeelQuickBar')) {
            const bar = document.createElement('div');
            bar.id = 'tsrFeelQuickBar';
            bar.className = 'tsr-feel-quickbar';
            bar.style.display = 'none';
            stage.appendChild(bar);
        }
        if (!document.getElementById('tsrFeelEmergency')) {
            const em = document.createElement('div');
            em.id = 'tsrFeelEmergency';
            em.className = 'tsr-feel-emergency';
            em.style.display = 'none';
            stage.appendChild(em);
        }
        if (!document.getElementById('tsrBossCinema')) {
            const cine = document.createElement('div');
            cine.id = 'tsrBossCinema';
            cine.className = 'tsr-boss-cinema';
            cine.style.display = 'none';
            stage.appendChild(cine);
        }
        if (!document.getElementById('tsrFeelTicker')) {
            const ticker = document.createElement('div');
            ticker.id = 'tsrFeelTicker';
            ticker.className = 'tsr-feel-ticker';
            ticker.setAttribute('aria-live', 'polite');
            const fury = stage.querySelector('.tsr-fury-wrap');
            if (fury && fury.nextSibling) stage.insertBefore(ticker, fury.nextSibling);
            else stage.appendChild(ticker);
        }
        if (!document.getElementById('tsrBattleResultCard')) {
            const card = document.createElement('div');
            card.id = 'tsrBattleResultCard';
            card.className = 'tsr-battle-result';
            card.style.display = 'none';
            stage.appendChild(card);
        }
        const vs = stage.querySelector('.tsr-duel-vs');
        if (vs && !document.getElementById('tsrBattleSpeedBtn')) {
            const skip = document.getElementById('tsrBattleSkipBtn');
            const wrap = document.createElement('div');
            wrap.className = 'tsr-feel-btns';
            const fast = !!player.timeSecretRealm?.currentRun?.battleFeelFast;
            const speedBtn = document.createElement('button');
            speedBtn.type = 'button';
            speedBtn.id = 'tsrBattleSpeedBtn';
            speedBtn.className = 'tsr-battle-skip';
            speedBtn.textContent = fast ? '常速' : '倍速';
            speedBtn.onclick = function () { toggleTsrBattleFeelSpeed(); };
            wrap.appendChild(speedBtn);
            if (skip) {
                if (skip.parentNode) skip.parentNode.removeChild(skip);
                wrap.appendChild(skip);
            } else {
                const skipBtn = document.createElement('button');
                skipBtn.type = 'button';
                skipBtn.id = 'tsrBattleSkipBtn';
                skipBtn.className = 'tsr-battle-skip';
                skipBtn.textContent = '跳过';
                skipBtn.onclick = function () { skipTsrBattleFeel(); };
                wrap.appendChild(skipBtn);
            }
            vs.appendChild(wrap);
        }
    }

    window.setTsrFeelCombo = function (n) {
        const el = document.getElementById('tsrFeelCombo');
        if (!el) return;
        if (!n || n < 2) {
            el.style.display = 'none';
            return;
        }
        el.style.display = 'block';
        el.textContent = '连击 ×' + n;
        el.classList.remove('pop');
        void el.offsetWidth;
        el.classList.add('pop');
    };

    window.appendTsrFeelTicker = function (text, kind) {
        const box = document.getElementById('tsrFeelTicker');
        if (!box || !text) return;
        const row = document.createElement('div');
        row.className = 'tsr-feel-ticker-row' + (kind ? ' ' + kind : '');
        row.textContent = text;
        box.appendChild(row);
        while (box.children.length > 4) box.removeChild(box.firstChild);
        box.scrollTop = box.scrollHeight;
    };

    window.toggleTsrBattleFeelSpeed = function () {
        const run = player.timeSecretRealm?.currentRun;
        if (!run?.battleInProgress) return;
        run.battleFeelFast = !run.battleFeelFast;
        const btn = document.getElementById('tsrBattleSpeedBtn');
        if (btn) btn.textContent = run.battleFeelFast ? '常速' : '倍速';
        appendTsrFeelTicker(run.battleFeelFast ? '已切换倍速播放' : '已切换常速播放', 'info');
    };

    window.spawnTsrImpactSpark = function (opts) {
        opts = opts || {};
        const layer = document.getElementById('tsrCombatFxLayer');
        if (!layer) return;
        const n = opts.crit || opts.finisher ? 5 : 3;
        for (let i = 0; i < n; i++) {
            const spark = document.createElement('span');
            spark.className = 'tsr-impact-spark' + (opts.crit ? ' crit' : '') + (opts.hurt ? ' hurt' : '') + (opts.finisher ? ' finisher' : '');
            spark.style.left = (35 + Math.random() * 30) + '%';
            spark.style.top = (30 + Math.random() * 30) + '%';
            spark.style.setProperty('--dx', ((Math.random() - 0.5) * 60) + 'px');
            spark.style.setProperty('--dy', ((Math.random() - 0.8) * 50) + 'px');
            layer.appendChild(spark);
            trackTsrBattleFeelTimer?.(setTimeout(() => spark.remove(), 520));
        }
    };

    window.showTsrAmbientToast = function (title, desc, kind) {
        let host = document.getElementById('tsrAmbientToast');
        if (!host) {
            host = document.createElement('div');
            host.id = 'tsrAmbientToast';
            host.className = 'tsr-ambient-toast';
            const panel = document.getElementById('tsrAdventurePanel') || document.body;
            panel.appendChild(host);
        }
        host.className = 'tsr-ambient-toast' + (kind ? ' ' + kind : '');
        host.innerHTML = `<strong>${title || ''}</strong>${desc ? `<span>${desc}</span>` : ''}`;
        host.classList.remove('show');
        void host.offsetWidth;
        host.classList.add('show');
        clearTimeout(host._hideTimer);
        host._hideTimer = setTimeout(() => host.classList.remove('show'), 1600);
    };

    window.showTsrBattleResultCard = function (summary) {
        const card = document.getElementById('tsrBattleResultCard');
        if (!card || !summary) return Promise.resolve();
        const title = summary.victory ? '战斗胜利' : '战斗受挫';
        card.style.display = 'block';
        card.className = 'tsr-battle-result' + (summary.victory ? ' win' : ' lose');
        const fmt = typeof formatTsrCombatNum === 'function' ? formatTsrCombatNum : String;
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
            <button type="button" class="tsr-btn tsr-btn-gold tsr-battle-result-ok" id="tsrBattleResultOk">继续</button>`;
        if (typeof playTsrCombatSfx === 'function') playTsrCombatSfx(summary.victory ? 'win' : 'hurt');
        return new Promise(resolve => {
            let settled = false;
            let auto = null;
            const done = () => {
                if (settled) return;
                settled = true;
                if (auto) clearTimeout(auto);
                card.style.display = 'none';
                const runNow = player.timeSecretRealm?.currentRun;
                if (runNow) runNow._feelResultResolve = null;
                resolve();
            };
            const btn = document.getElementById('tsrBattleResultOk');
            if (btn) btn.onclick = done;
            const run = player.timeSecretRealm?.currentRun;
            auto = setTimeout(done, summary.victory ? 2200 : 1400);
            if (run) {
                run._battleFeelTimers = run._battleFeelTimers || [];
                run._battleFeelTimers.push(auto);
                run._battleFeelResolvers = run._battleFeelResolvers || [];
                run._battleFeelResolvers.push(done);
                run._feelResultResolve = done;
            }
            if (run?.battleFeelSkip) done();
        });
    };

    function listFeelCombatItems() {
        const list = player.timeSecretRealm?.currentRun?.consumables || [];
        const out = [];
        list.forEach((key, idx) => {
            const def = typeof TSR_RUN_CONSUMABLES !== 'undefined' ? TSR_RUN_CONSUMABLES[key] : null;
            if (!def || !TSR_FEEL_COMBAT_ITEM_EFFECTS[def.effect]) return;
            out.push({ idx, key, def });
        });
        return out;
    }

    window.refreshTsrFeelQuickBar = function () {
        const bar = document.getElementById('tsrFeelQuickBar');
        const run = player.timeSecretRealm?.currentRun;
        if (!bar || !run?.battleInProgress) return;
        const items = listFeelCombatItems().slice(0, 4);
        const charge = run.spiritCharge || 0;
        const canSpirit = charge >= 30 && (run.timeLeft || 0) > 18;
        let html = '<span class="tsr-feel-quick-label" title="战斗已结算，此处为战后补给">战后补给</span>';
        items.forEach(it => {
            html += `<button type="button" class="tsr-feel-quick-btn" onclick="tsrFeelUseConsumable(${it.idx})" title="${it.def.desc}">${it.def.icon} ${it.def.name}</button>`;
        });
        html += `<button type="button" class="tsr-feel-quick-btn spirit" onclick="tsrFeelInvokeSpirit()" ${canSpirit ? '' : 'disabled'} title="消耗30充能">🧚 呼唤(${Math.floor(charge)})</button>`;
        if (!items.length && !canSpirit) {
            html += '<span class="tsr-feel-quick-empty">暂无可用支援</span>';
        }
        bar.innerHTML = html;
        bar.style.display = 'flex';
    };

    window.hideTsrFeelQuickBar = function () {
        const bar = document.getElementById('tsrFeelQuickBar');
        if (bar) bar.style.display = 'none';
    };

    window.tsrFeelUseConsumable = function (index) {
        const run = player.timeSecretRealm?.currentRun;
        if (!run?.battleInProgress || !run.isActive) return;
        const list = run.consumables || [];
        const key = list[index];
        const def = typeof TSR_RUN_CONSUMABLES !== 'undefined' ? TSR_RUN_CONSUMABLES[key] : null;
        if (!def || !TSR_FEEL_COMBAT_ITEM_EFFECTS[def.effect]) {
            addTsrLog?.('这场战斗中不可使用该道具', 'warning');
            return;
        }
        if (typeof tsrUseConsumable === 'function') tsrUseConsumable(index);
        run.feelHpLocked = true;
        const maxHp = typeof calculateTsrPlayerHealth === 'function' ? calculateTsrPlayerHealth() : run.playerHealth;
        refreshTsrFeelPlayerHp(run.playerHealth, maxHp);
        showTsrCombatCue?.((def.icon || '') + ' ' + def.name, 'skill');
        appendTsrFeelTicker('使用 ' + def.name, 'skill');
        spawnTsrDamageFloater?.('支援!', { heal: true });
        if (typeof playTsrCombatSfx === 'function') playTsrCombatSfx('skill');
        refreshTsrFeelQuickBar();
        const em = document.getElementById('tsrFeelEmergency');
        if (em && em.style.display === 'block') {
            run._feelEmergencyResolve?.('used');
        }
        trackTsrBattleFeelTimer?.(setTimeout(() => hideTsrCombatCue?.(), 420));
    };

    window.tsrFeelInvokeSpirit = function () {
        const run = player.timeSecretRealm?.currentRun;
        if (!run?.battleInProgress || !run.isActive) return;
        if (typeof tsrInvokeSpirit !== 'function') return;
        const before = run.spiritCharge || 0;
        if (before < 30) {
            addTsrLog?.('精灵充能不足30%，无法呼唤', 'warning');
            return;
        }
        tsrInvokeSpirit();
        if ((run.spiritCharge || 0) >= before) return;
        run.feelHpLocked = true;
        const maxHp = typeof calculateTsrPlayerHealth === 'function' ? calculateTsrPlayerHealth() : run.playerHealth;
        refreshTsrFeelPlayerHp(run.playerHealth, maxHp);
        const name = typeof getTsrSpiritDisplayName === 'function' ? getTsrSpiritDisplayName() : '精灵';
        showTsrCombatCue?.('🧚 ' + name, 'spirit');
        appendTsrFeelTicker(name + '应援！', 'spirit');
        spawnTsrDamageFloater?.('灵援!', { heal: true });
        refreshTsrFeelQuickBar();
        const em = document.getElementById('tsrFeelEmergency');
        if (em && em.style.display === 'block') {
            run._feelEmergencyResolve?.('used');
        }
        trackTsrBattleFeelTimer?.(setTimeout(() => hideTsrCombatCue?.(), 480));
    };

    window.showTsrFeelEmergency = function (playerMax) {
        const run = player.timeSecretRealm?.currentRun;
        const panel = document.getElementById('tsrFeelEmergency');
        if (!run || !panel || run.battleFeelSkip || run.battleFeelEmergencyDone) return Promise.resolve();
        const pct = typeof getTsrHealthPercent === 'function'
            ? getTsrHealthPercent(run.feelDisplayHp != null ? run.feelDisplayHp : run.playerHealth, playerMax)
            : 100;
        if (pct > 35) return Promise.resolve();
        run.battleFeelEmergencyDone = true;
        const items = listFeelCombatItems().slice(0, 5);
        const charge = run.spiritCharge || 0;
        const canSpirit = charge >= 30 && (run.timeLeft || 0) > 18;
        let btns = items.map(it =>
            `<button type="button" class="tsr-btn tsr-btn-gold" onclick="tsrFeelUseConsumable(${it.idx})">${it.def.icon} ${it.def.name}</button>`
        ).join('');
        if (canSpirit) {
            btns += `<button type="button" class="tsr-btn tsr-btn-purple" onclick="tsrFeelInvokeSpirit()">🧚 呼唤精灵</button>`;
        }
        if (!btns) btns = '<span class="tsr-feel-quick-empty">没有可用急救手段</span>';
        panel.style.display = 'flex';
        panel.innerHTML = `
            <div class="tsr-feel-emergency-title">⚠ 战后补给 · 生命 ${pct.toFixed(0)}%</div>
            <div class="tsr-feel-emergency-desc">本场伤害已结算；现在补充可提升后续生存，不改写本场结果</div>
            <div class="tsr-feel-emergency-btns">${btns}</div>
            <button type="button" class="tsr-btn tsr-btn-ghost" id="tsrFeelEmergencyContinue">继续演绎</button>`;
        if (typeof playTsrCombatSfx === 'function') playTsrCombatSfx('hurt');
        appendTsrFeelTicker('危急支援触发', 'hurt');
        return new Promise(resolve => {
            let settled = false;
            const finishEm = (why) => {
                if (settled) return;
                settled = true;
                panel.style.display = 'none';
                run._feelEmergencyResolve = null;
                resolve(why || 'continue');
            };
            run._feelEmergencyResolve = finishEm;
            const cont = document.getElementById('tsrFeelEmergencyContinue');
            if (cont) cont.onclick = () => finishEm('continue');
            // 计时器与 delay 共用 clear 时也要通过 resolver 解挂
            const auto = setTimeout(() => finishEm('timeout'), 12000);
            run._battleFeelTimers = run._battleFeelTimers || [];
            run._battleFeelTimers.push(auto);
            run._battleFeelResolvers = run._battleFeelResolvers || [];
            run._battleFeelResolvers.push(() => finishEm('flushed'));
        });
    };

    window.playTsrBossCinematic = function (opts) {
        opts = opts || {};
        const cine = document.getElementById('tsrBossCinema');
        const run = player.timeSecretRealm?.currentRun;
        if (!cine || run?.battleFeelSkip) return Promise.resolve();
        const isBoss = !!opts.isBoss;
        const isElite = !!opts.isElite;
        if (!isBoss && !isElite) return Promise.resolve();
        const icon = opts.monsterIcon || '👾';
        const name = opts.monsterName || (isBoss ? '首领' : '精英');
        const intro = opts.monsterIntro || (isBoss ? '「有趣的挑战者……」' : '「挡路者退开！」');
        const role = isBoss ? '首领战' : '精英战';
        cine.style.display = 'flex';
        cine.className = 'tsr-boss-cinema' + (isBoss ? ' boss' : ' elite');
        cine.innerHTML = `
            <div class="tsr-boss-cinema-role">${role}</div>
            <div class="tsr-boss-cinema-icon">${icon}</div>
            <div class="tsr-boss-cinema-name">${name}</div>
            <div class="tsr-boss-cinema-line">${intro}</div>
            <button type="button" class="tsr-btn tsr-btn-gold" id="tsrBossCinemaGo">应战</button>`;
        if (typeof playTsrCombatSfx === 'function') playTsrCombatSfx(isBoss ? 'start' : 'skill');
        showTsrAmbientToast?.(role, name, isBoss ? 'boss' : 'elite');
        return new Promise(resolve => {
            let settled = false;
            const done = () => {
                if (settled) return;
                settled = true;
                cine.style.display = 'none';
                if (run) run._feelCinemaResolve = null;
                resolve();
            };
            const btn = document.getElementById('tsrBossCinemaGo');
            if (btn) btn.onclick = done;
            const wait = isBoss ? 2800 : 1800;
            const auto = setTimeout(done, wait);
            if (run) {
                run._battleFeelTimers = run._battleFeelTimers || [];
                run._battleFeelTimers.push(auto);
                run._battleFeelResolvers = run._battleFeelResolvers || [];
                run._battleFeelResolvers.push(done);
                run._feelCinemaResolve = done;
            }
            if (run?.battleFeelSkip) done();
        });
    };

    // 倍速缩放延迟
    if (typeof tsrCombatDelay === 'function') {
        const _delay = tsrCombatDelay;
        tsrCombatDelay = function (ms) {
            const run = player.timeSecretRealm?.currentRun;
            if (run?.battleFeelSkip) return Promise.resolve();
            // 急救面板打开时拉长等待会被 skip 清掉；正常加速
            const scale = run?.battleFeelFast ? 0.48 : 1;
            return _delay(Math.max(16, Math.floor((Number(ms) || 0) * scale)));
        };
    }

    if (typeof updateTsrMonsterBanner === 'function') {
        const _banner = updateTsrMonsterBanner;
        updateTsrMonsterBanner = function (monster, stats, isBoss, isElite) {
            _banner(monster, stats, isBoss, isElite);
            ensureFeelExtraNodes(document.querySelector('#tsrMonsterBanner .tsr-duel-stage'));
        };
    }

    if (typeof flashTsrCombatHit === 'function') {
        const _flash = flashTsrCombatHit;
        flashTsrCombatHit = function (opts) {
            opts = opts || {};
            _flash(opts);
            spawnTsrImpactSpark(opts);
            const banner = document.getElementById('tsrMonsterBanner');
            if (banner && opts.finisher) banner.classList.add('tsr-hit-finisher');
        };
    }

    if (typeof refreshTsrFeelPlayerHp === 'function') {
        const _php = refreshTsrFeelPlayerHp;
        refreshTsrFeelPlayerHp = function (hp, maxHp) {
            const run = player.timeSecretRealm?.currentRun;
            let showHp = hp;
            if (run?.feelHpLocked) showHp = run.playerHealth;
            run.feelDisplayHp = showHp;
            _php(showHp, maxHp);
            const pct = typeof getTsrHealthPercent === 'function' ? getTsrHealthPercent(showHp, maxHp) : 100;
            const banner = document.getElementById('tsrMonsterBanner');
            if (banner) banner.classList.toggle('tsr-low-hp', pct <= 30);
        };
    }

    presentTsrBattleFeel = async function (hits, opts) {
        opts = opts || {};
        ensureFeelHelpers();
        const run = player.timeSecretRealm?.currentRun;
        if (run) {
            // 开局 skip 仅由 queueTsrBattleFeel 置 false；此处勿强行清 skip，避免竞态
            run.battleFeelEmergencyDone = false;
            run.feelHpLocked = false;
            run.feelDisplayHp = null;
        }
        let maxHp = opts.monsterMaxHp || 1;
        const playerMax = opts.playerMaxHp || calculateTsrPlayerHealth();
        const startHp = opts.playerHpStart != null ? opts.playerHpStart : playerMax;
        const summary = opts.summary || run?.lastBattleSummary || {};
        const preLogs = opts.preLogs || [];
        const postLogs = opts.postLogs || [];
        let combo = 0;

        const flushFeelLogs = (list, clear) => {
            if (!list?.length) return;
            if (typeof flushTsrDeferredLogsNow === 'function') flushTsrDeferredLogsNow(list.slice());
            if (clear && Array.isArray(list)) list.splice(0, list.length);
        };
        const flushFeelLogsSlow = async (list) => {
            if (!list?.length) return;
            while (list.length) {
                if (run?.battleFeelSkip) {
                    flushFeelLogs(list, true);
                    break;
                }
                const L = list.shift();
                if (typeof writeTsrLogImmediate === 'function') writeTsrLogImmediate(L.message, L.type, L.theme);
                else if (typeof flushTsrDeferredLogsNow === 'function') flushTsrDeferredLogsNow([L]);
                await tsrCombatDelay(55);
            }
        };

        ensureFeelExtraNodes(document.querySelector('#tsrMonsterBanner .tsr-duel-stage'));
        refreshTsrMonsterHpBar(maxHp, maxHp);
        refreshTsrFeelPlayerHp(startHp, playerMax);
        refreshTsrFeelFury(opts.furyStart || 0);
        setTsrFeelCombo(0);
        refreshTsrFeelQuickBar();

        // Boss / 精英过场：只用本场 opts，避免旧 summary 精英标记污染普通战
        await playTsrBossCinematic({
            isBoss: !!opts.isBoss,
            isElite: !!opts.isElite,
            monsterName: summary.monsterName,
            monsterIcon: summary.monsterIcon,
            monsterIntro: summary.monsterIntro
        });
        if (run?.battleFeelSkip) {
            flushFeelLogs(preLogs, true);
            (hits || []).forEach(h => flushFeelLogs(h.logs, true));
            flushFeelLogs(postLogs, true);
            hideTsrFeelQuickBar();
            if (opts.summary) await showTsrBattleResultCard(opts.summary);
            if (typeof updateHealthBar === 'function') updateHealthBar();
            return;
        }

        const openLabel = opts.isBoss ? '首领战 · 交锋' : (opts.isElite ? '精英战 · 交锋' : '遭遇战 · 交锋');
        setTsrFeelRound(openLabel);
        showTsrCombatCue(opts.isBoss ? '⚔️ 开战!' : (opts.isElite ? '💀 开战!' : '⚔️ 战斗开始'), opts.isBoss ? 'boss' : (opts.isElite ? 'elite' : 'start'));
        appendTsrFeelTicker(opts.isBoss ? '与首领正面对决' : (opts.isElite ? '精英守卫交锋' : '战斗开始'), 'info');
        if (typeof playTsrCombatSfx === 'function') playTsrCombatSfx('start');
        await flushFeelLogsSlow(preLogs);
        await tsrCombatDelay(opts.isBoss ? 320 : (opts.isElite ? 260 : 200));
        hideTsrCombatCue();

        for (let i = 0; i < (hits || []).length; i++) {
            if (run?.battleFeelSkip) break;
            const h = hits[i];
            const isLast = i === hits.length - 1;
            const isFinisher = !!opts.victory && isLast && ((h.playerDmg || 0) > 0 || h.killed);
            setTsrFeelRound('第 ' + (h.round || (i + 1)) + ' 回合');
            refreshTsrFeelFury(h.fury != null ? h.fury : 0);

            // 本回合战报与演出同拍
            await flushFeelLogsSlow(h.logs || []);

            if (h.events && h.events.length) {
                for (const ev of h.events) {
                    if (run?.battleFeelSkip) break;
                    const isPhase = ev.type === 'phase' || ev.type === 'revive';
                    const isHeal = ev.type === 'heal' || /回血|吸血|再生/.test(String(ev.label || ''));
                    showTsrCombatCue(ev.label || ev.type, isPhase ? 'phase' : (ev.type || 'skill'));
                    flashTsrCombatHit({ skill: !isPhase, crit: isPhase });
                    spawnTsrDamageFloater(ev.label || '技能!', { skill: !isHeal && !isPhase, heal: isHeal, win: isPhase });
                    appendTsrFeelTicker(ev.label || '特殊触发', isPhase ? 'phase' : (ev.type || 'skill'));
                    if (ev.type === 'revive' && ev.monsterMaxHp) {
                        // 多命重整：血条回满（相对新段上限）
                        maxHp = ev.monsterMaxHp;
                        opts.monsterMaxHp = maxHp;
                        refreshTsrMonsterHpBar(ev.monsterHp != null ? ev.monsterHp : maxHp, maxHp);
                        const left = document.querySelector('#tsrMonsterBanner .tsr-monster-banner-left');
                        if (left && typeof formatTsrMonsterLifeHtml === 'function') {
                            const roomMon = player.timeSecretRealm?.currentRun?.currentRoom?.monster;
                            const old = left.querySelector('.tsr-monster-life-bar');
                            const html = formatTsrMonsterLifeHtml(roomMon || {});
                            if (html && old) old.outerHTML = html;
                            else if (html && !old) left.insertAdjacentHTML('beforeend', html);
                        } else if (left && typeof formatTsrMonsterPhaseHtml === 'function') {
                            const badge = left.querySelector('.tsr-monster-phase-badge');
                            const html = formatTsrMonsterPhaseHtml();
                            if (html && badge) badge.outerHTML = html;
                            else if (html && !badge) left.insertAdjacentHTML('beforeend', html);
                        }
                        if (typeof playTsrCombatSfx === 'function') playTsrCombatSfx('warn');
                        if (typeof tsrVibrate === 'function') tsrVibrate(40);
                        await tsrCombatDelay(520);
                    } else if (ev.type === 'phase') {
                        const left = document.querySelector('#tsrMonsterBanner .tsr-monster-banner-left');
                        if (left && typeof formatTsrMonsterPhaseHtml === 'function') {
                            const badge = left.querySelector('.tsr-monster-phase-badge');
                            const html = formatTsrMonsterPhaseHtml();
                            if (html && badge) badge.outerHTML = html;
                            else if (html && !badge) left.insertAdjacentHTML('beforeend', html);
                        }
                        const banner = document.getElementById('tsrMonsterBanner');
                        if (banner) {
                            banner.classList.add('tsr-phase-flash');
                            setTimeout(() => banner.classList.remove('tsr-phase-flash'), 520);
                        }
                        if (typeof playTsrCombatSfx === 'function') playTsrCombatSfx('warn');
                        if (typeof tsrVibrate === 'function') tsrVibrate(30);
                        await tsrCombatDelay(480);
                    } else {
                        await tsrCombatDelay(ev.type === 'fury' ? 460 : 320);
                    }
                    hideTsrCombatCue();
                }
            }

            if (h.dodged) {
                combo = 0;
                setTsrFeelCombo(0);
                showTsrCombatCue('闪避!', 'dodge');
                spawnTsrDamageFloater('MISS', { skill: true });
                appendTsrFeelTicker('成功闪避反击', 'dodge');
                await tsrCombatDelay(240);
                hideTsrCombatCue();
            }

            if ((h.playerDmg || 0) > 0) {
                combo += 1;
                setTsrFeelCombo(combo);
                const barMax = h.monsterMaxHp || maxHp;
                if (h.monsterMaxHp) maxHp = h.monsterMaxHp;
                refreshTsrMonsterHpBar(h.monsterHp, barMax);
                flashTsrCombatHit({ crit: !!h.crit, finisher: isFinisher });
                const dmgLabel = (isFinisher ? '终结 ' : (h.crit ? '暴击 ' : '-')) + formatTsrCombatNum(h.playerDmg);
                spawnTsrDamageFloater(dmgLabel, { crit: !!h.crit, win: isFinisher });
                if ((h.extraDmg || 0) > 0) {
                    await tsrCombatDelay(90);
                    spawnTsrDamageFloater('连击 -' + formatTsrCombatNum(h.extraDmg), { skill: true });
                    appendTsrFeelTicker('连击追加 ' + formatTsrCombatNum(h.extraDmg), 'skill');
                }
                appendTsrFeelTicker(
                    '你造成 ' + formatTsrCombatNum(h.playerDmg) + (h.crit ? '（暴击）' : '') + (isFinisher ? ' · 终结' : ''),
                    h.crit || isFinisher ? 'crit' : 'hit'
                );
                if (h.crit || isFinisher) showTsrCombatCue(isFinisher ? '终结一击!' : '暴击!', isFinisher ? 'win' : 'crit');
                await tsrCombatDelay(isFinisher ? 110 : (h.crit ? 80 : 45));
                await tsrCombatDelay(isFinisher ? 440 : (h.crit ? 300 : 200));
                if (h.crit || isFinisher) hideTsrCombatCue();
            } else if (!h.dodged && !(h.events || []).length) {
                await tsrCombatDelay(120);
            }

            if ((h.counter || 0) > 0 || (h.counterHits && h.counterHits.length)) {
                combo = 0;
                setTsrFeelCombo(0);
                const parts = (h.counterHits && h.counterHits.length)
                    ? h.counterHits
                    : [h.counter];
                for (let ci = 0; ci < parts.length; ci++) {
                    if (run?.battleFeelSkip) break;
                    const cAmt = parts[ci];
                    flashTsrCombatHit({ hurt: true });
                    spawnTsrDamageFloater((ci > 0 ? '连击 -' : '-') + formatTsrCombatNum(cAmt), { hurt: true });
                    appendTsrFeelTicker((ci > 0 ? '连击反击 ' : '受到反击 ') + formatTsrCombatNum(cAmt), 'hurt');
                    await tsrCombatDelay(ci > 0 ? 160 : 200);
                }
                if (!run.feelHpLocked) {
                    if (h.playerHp != null) refreshTsrFeelPlayerHp(h.playerHp, playerMax);
                    else if (h.playerHpPct != null) refreshTsrFeelPlayerHp(bMul(playerMax, (h.playerHpPct || 0) / 100), playerMax);
                } else {
                    refreshTsrFeelPlayerHp(run.playerHealth, playerMax);
                }
                await tsrCombatDelay(120);
                // 危急急救确认
                await showTsrFeelEmergency(playerMax);
                refreshTsrFeelQuickBar();
            } else if (h.playerHp != null && !run.feelHpLocked) {
                refreshTsrFeelPlayerHp(h.playerHp, playerMax);
            }
        }

        if (run?.battleFeelSkip) {
            flushFeelLogs(preLogs, true);
            (hits || []).forEach(h => flushFeelLogs(h.logs, true));
            flushFeelLogs(postLogs, true);
        } else {
            await flushFeelLogsSlow(postLogs);
        }

        if (opts.victory && !run?.battleFeelSkip) {
            const banner = document.getElementById('tsrMonsterBanner');
            if (banner) banner.classList.add('tsr-victory-flash');
            showTsrCombatCue('胜利!', 'win');
            spawnTsrDamageFloater('击败!', { win: true });
            appendTsrFeelTicker('战斗胜利', 'win');
            if (typeof playTsrCombatSfx === 'function') playTsrCombatSfx('win');
            setTsrFeelRound('战斗胜利');
            await tsrCombatDelay(360);
            const winLine = summary.winLine || opts.winLine;
            if (winLine) {
                showTsrCombatCue((summary.monsterIcon || '') + ' ' + winLine, 'win');
                appendTsrFeelTicker(winLine, 'win');
                await tsrCombatDelay(520);
            }
        } else if (!opts.victory) {
            showTsrCombatCue('未能击破', 'hurt');
            appendTsrFeelTicker('未能击破敌人', 'hurt');
            setTsrFeelRound('战斗受挫');
            await tsrCombatDelay(280);
            await showTsrFeelEmergency(playerMax);
        }
        hideTsrCombatCue();
        hideTsrFeelQuickBar();
        const em = document.getElementById('tsrFeelEmergency');
        if (em) em.style.display = 'none';
        const cine = document.getElementById('tsrBossCinema');
        if (cine) cine.style.display = 'none';
        if (opts.summary) await showTsrBattleResultCard(opts.summary);
        if (typeof updateHealthBar === 'function') updateHealthBar();
    };

    if (typeof queueTsrBattleFeel === 'function') {
        const _queue = queueTsrBattleFeel;
        queueTsrBattleFeel = function (hits, opts, done) {
            opts = opts || {};
            const run = player.timeSecretRealm?.currentRun;
            if (run?.lastBattleSummary && !opts.summary) opts.summary = run.lastBattleSummary;
            const finish = function () {
                hideTsrFeelQuickBar();
                const em = document.getElementById('tsrFeelEmergency');
                if (em) em.style.display = 'none';
                if (typeof done === 'function') done();
            };
            return _queue(hits, opts, finish);
        };
    }

    if (typeof updateCurrentRoomDisplay === 'function') {
        const _room = updateCurrentRoomDisplay;
        updateCurrentRoomDisplay = function () {
            _room();
            const run = player.timeSecretRealm?.currentRun;
            const room = run?.currentRoom;
            if (!room) return;
            const card = document.querySelector('#tsrCurrentRoom .tsr-room-card');
            const animKey = (run.currentFloor || 0) + ':' + (room.type || '') + ':' + (room.name || '');
            if (card && window._tsrLastRoomAnimKey !== animKey) {
                window._tsrLastRoomAnimKey = animKey;
                card.classList.remove('tsr-room-enter');
                void card.offsetWidth;
                card.classList.add('tsr-room-enter');
            }
            if (room.explored) return;
            if (window._tsrLastRoomToastKey === animKey) return;
            window._tsrLastRoomToastKey = animKey;
            const meta = typeof getTsrRoomTypeMeta === 'function' ? getTsrRoomTypeMeta(room.type) : null;
            if (meta) showTsrAmbientToast(meta.icon + ' ' + (meta.name || '新房间'), '点「探索」揭开这里的命运', room.isBoss ? 'boss' : (room.isElite ? 'elite' : 'room'));
        };
    }

    if (typeof tsrNextFloor === 'function') {
        const _next = tsrNextFloor;
        tsrNextFloor = function () {
            const before = player.timeSecretRealm?.currentRun?.currentFloor;
            _next();
            const run = player.timeSecretRealm?.currentRun;
            if (!run?.isActive) return;
            if (run.currentFloor !== before) {
                const clear = run.clearFloor || 0;
                showTsrAmbientToast('第 ' + run.currentFloor + ' 层', clear ? ('通关目标 ' + clear + ' 层') : '继续深入', 'floor');
            }
        };
    }
})();

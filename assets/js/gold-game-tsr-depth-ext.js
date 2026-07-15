/**
 * 时光秘境 · 体验加深（二段）
 * - Boss/精英过场威胁条（词缀·命段预告）
 * - 结算卡：币数滚动 + 战利品 stagger 揭晓
 * - phase cue 样式兜底
 */
(function () {
    'use strict';

    function tsrDepthDelay(ms) {
        if (typeof tsrCombatDelay === 'function') return tsrCombatDelay(ms);
        return new Promise(r => setTimeout(r, ms));
    }

    function buildThreatChips(opts) {
        const run = player?.timeSecretRealm?.currentRun;
        const room = run?.currentRoom;
        const monster = room?.monster;
        const chips = [];
        if (monster && typeof getTsrMonsterAffixList === 'function') {
            getTsrMonsterAffixList(monster).slice(0, 4).forEach(a => {
                chips.push(`<span class="tsr-threat-chip affix">${a.icon || '🏷️'}${a.name || ''}</span>`);
            });
        }
        if (monster && typeof getTsrMonsterLifeProfile === 'function') {
            const profile = getTsrMonsterLifeProfile(monster);
            if (profile && profile.stages > 1) {
                chips.push(`<span class="tsr-threat-chip life">命段 ×${profile.stages}</span>`);
            }
        }
        if (monster?.mutationKey && typeof getTsrMonsterMutationDef === 'function') {
            const m = getTsrMonsterMutationDef(monster);
            if (m) chips.push(`<span class="tsr-threat-chip mut">🧬${m.name || '变异'}</span>`);
        }
        if (opts.isBoss) chips.push('<span class="tsr-threat-chip boss">多段狂暴</span>');
        else if (opts.isElite) chips.push('<span class="tsr-threat-chip elite">高压交锋</span>');
        return chips;
    }

    if (typeof playTsrBossCinematic === 'function') {
        const _cine = playTsrBossCinematic;
        playTsrBossCinematic = function (opts) {
            opts = opts || {};
            const cine = document.getElementById('tsrBossCinema');
            const run = player.timeSecretRealm?.currentRun;
            if (!cine || run?.battleFeelSkip) return _cine(opts);
            const isBoss = !!opts.isBoss;
            const isElite = !!opts.isElite;
            if (!isBoss && !isElite) return _cine(opts);

            const icon = opts.monsterIcon || '👾';
            const name = opts.monsterName || (isBoss ? '首领' : '精英');
            const intro = opts.monsterIntro || (isBoss ? '「有趣的挑战者……」' : '「挡路者退开！」');
            const role = isBoss ? '首领战' : '精英战';
            const chips = buildThreatChips(opts);
            const chipHtml = chips.length
                ? `<div class="tsr-boss-threat">${chips.join('')}</div>`
                : '';

            cine.style.display = 'flex';
            cine.className = 'tsr-boss-cinema' + (isBoss ? ' boss' : ' elite') + ' depth';
            cine.innerHTML = `
                <div class="tsr-boss-cinema-role">${role}</div>
                <div class="tsr-boss-cinema-icon">${icon}</div>
                <div class="tsr-boss-cinema-name">${name}</div>
                ${chipHtml}
                <div class="tsr-boss-cinema-line">${intro}</div>
                <button type="button" class="tsr-btn tsr-btn-gold" id="tsrBossCinemaGo">应战</button>`;
            if (typeof playTsrCombatSfx === 'function') playTsrCombatSfx(isBoss ? 'start' : 'skill');
            if (typeof showTsrAmbientToast === 'function') showTsrAmbientToast(role, name, isBoss ? 'boss' : 'elite');

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
                const wait = isBoss ? 3000 : 1900;
                const auto = setTimeout(done, wait);
                if (run) {
                    run._battleFeelTimers = run._battleFeelTimers || [];
                    run._battleFeelTimers.push(auto);
                    run._battleFeelResolvers = run._battleFeelResolvers || [];
                    run._battleFeelResolvers.push(done);
                    const prev = run._feelCinemaResolve;
                    run._feelCinemaResolve = () => {
                        done();
                        if (typeof prev === 'function') prev();
                    };
                }
                if (run?.battleFeelSkip) done();
            });
        };
        void _cine;
    }

    function animateCurrencyCount(el, target, duration) {
        if (!el) return Promise.resolve();
        const goal = Math.max(0, Math.floor(Number(target) || 0));
        if (goal <= 0) {
            el.textContent = '0';
            return Promise.resolve();
        }
        const start = performance.now();
        const span = Math.max(280, duration || 700);
        return new Promise(resolve => {
            const tick = (now) => {
                const run = player.timeSecretRealm?.currentRun;
                if (run?.battleFeelSkip || !el.isConnected) {
                    el.textContent = String(goal);
                    resolve();
                    return;
                }
                const t = Math.min(1, (now - start) / span);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = String(Math.floor(goal * eased));
                if (t < 1) requestAnimationFrame(tick);
                else {
                    el.textContent = String(goal);
                    resolve();
                }
            };
            requestAnimationFrame(tick);
        });
    }

    if (typeof showTsrBattleResultCard === 'function') {
        showTsrBattleResultCard = function (summary) {
            const card = document.getElementById('tsrBattleResultCard');
            if (!card || !summary) return Promise.resolve();
            const title = summary.victory ? '战斗胜利' : '战斗受挫';
            const fmt = typeof formatTsrCombatNum === 'function' ? formatTsrCombatNum : String;
            const loot = summary.loot || [];
            const lootRows = loot.filter(l => l.kind !== 'currency').slice(0, 6);
            const winLine = summary.winLine
                ? `<div class="tsr-battle-result-quote">${summary.monsterIcon || ''} ${summary.winLine}</div>`
                : '';

            card.style.display = 'block';
            card.className = 'tsr-battle-result depth' + (summary.victory ? ' win' : ' lose');
            card.innerHTML = `
                <div class="tsr-battle-result-title">${title}</div>
                <div class="tsr-battle-result-name">${summary.monsterIcon || ''} ${summary.monsterName || '敌人'}</div>
                ${winLine}
                <div class="tsr-battle-result-grid">
                    <span>回合 <b>${summary.rounds || 0}</b></span>
                    <span>输出 <b>${fmt(summary.damage || 0)}</b></span>
                    <span>承伤 <b>${fmt(summary.taken || 0)}</b></span>
                    <span>暴击 <b>${summary.crits || 0}</b></span>
                    <span>连胜 <b>×${summary.streak || 0}</b></span>
                    <span>获得 <b id="tsrResultCurrency">0</b>币</span>
                </div>
                <div class="tsr-battle-loot" id="tsrResultLootBox"></div>
                <button type="button" class="tsr-btn tsr-btn-gold tsr-battle-result-ok" id="tsrBattleResultOk" disabled>揭晓中…</button>`;

            if (typeof playTsrCombatSfx === 'function') playTsrCombatSfx(summary.victory ? 'win' : 'hurt');

            const run = player.timeSecretRealm?.currentRun;
            const btn = document.getElementById('tsrBattleResultOk');
            const lootBox = document.getElementById('tsrResultLootBox');
            const curEl = document.getElementById('tsrResultCurrency');

            return new Promise(async resolve => {
                let settled = false;
                let auto = null;
                const done = () => {
                    if (settled) return;
                    settled = true;
                    if (auto) clearTimeout(auto);
                    card.style.display = 'none';
                    if (run) run._feelResultResolve = null;
                    if (typeof flashTsrStatEl === 'function') {
                        flashTsrStatEl('currency');
                        if (lootRows.some(l => l.kind === 'equipment' || l.kind === 'equip')) flashTsrStatEl('equipment');
                    }
                    if (lootRows[0] && typeof showTsrAmbientToast === 'function') {
                        showTsrAmbientToast(
                            (lootRows[0].icon || '') + ' ' + (lootRows[0].name || '战利品'),
                            lootRows.length > 1 ? ('等' + lootRows.length + '件入库') : '战利品入库',
                            'elite'
                        );
                    }
                    resolve();
                };
                if (run) run._feelResultResolve = done;

                try {
                    if (!run?.battleFeelSkip) {
                        await animateCurrencyCount(curEl, summary.currency || 0, summary.victory ? 720 : 420);
                        if ((summary.currency || 0) > 0 && typeof playTsrCombatSfx === 'function') playTsrCombatSfx('loot');
                        if (lootRows.length && lootBox) {
                            for (let i = 0; i < lootRows.length; i++) {
                                if (run?.battleFeelSkip) break;
                                const l = lootRows[i];
                                const span = document.createElement('span');
                                span.className = 'tsr-battle-loot-item reveal ' + (l.kind || '');
                                span.textContent = (l.icon || '') + ' ' + (l.name || '');
                                lootBox.appendChild(span);
                                if (typeof playTsrCombatSfx === 'function') playTsrCombatSfx(i === 0 ? 'loot' : 'tick');
                                await tsrDepthDelay(160);
                            }
                        } else if (lootBox) {
                            lootBox.className = 'tsr-battle-loot empty';
                            lootBox.textContent = summary.victory ? '本场无遗物/装备掉落' : '建议休息或使用补给后再战';
                        }
                    } else {
                        if (curEl) curEl.textContent = String(summary.currency || 0);
                        if (lootBox) {
                            if (lootRows.length) {
                                lootBox.innerHTML = lootRows.map(l =>
                                    `<span class="tsr-battle-loot-item ${l.kind || ''}">${l.icon || ''} ${l.name || ''}</span>`
                                ).join('');
                            } else {
                                lootBox.className = 'tsr-battle-loot empty';
                                lootBox.textContent = summary.victory ? '本场无遗物/装备掉落' : '建议休息或使用补给后再战';
                            }
                        }
                    }
                } catch (e) { /* ignore reveal errors */ }

                if (btn) {
                    btn.disabled = false;
                    btn.textContent = '领取并继续';
                    btn.onclick = done;
                }
                auto = setTimeout(done, summary.victory ? 3200 : 1800);
                if (run) {
                    run._battleFeelTimers = run._battleFeelTimers || [];
                    run._battleFeelTimers.push(auto);
                    run._battleFeelResolvers = run._battleFeelResolvers || [];
                    run._battleFeelResolvers.push(done);
                }
                if (run?.battleFeelSkip) done();
            });
        };
    }

    // 探索未揭开房间淡雾
    if (typeof updateCurrentRoomDisplay === 'function') {
        const _room = updateCurrentRoomDisplay;
        updateCurrentRoomDisplay = function () {
            _room();
            const run = player.timeSecretRealm?.currentRun;
            const room = run?.currentRoom;
            const card = document.querySelector('#tsrCurrentRoom .tsr-room-card');
            if (card) card.classList.toggle('tsr-room-fog', !!(room && !room.explored));
        };
    }
})();

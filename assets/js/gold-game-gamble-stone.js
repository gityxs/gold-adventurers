// 赌石系统
// 切换赌石界面
function toggleGambleStone() {
    const inv = player.investmentGame && player.investmentGame.userData;
    const totalAssets = inv && typeof inv.totalAssets === 'number' ? inv.totalAssets : 0;
    if (totalAssets < 5000) {
        alert("需要在投资游戏中拥有至少5000元资产才能开启赌石系统！");
        return;
    }
    
    const ui = document.getElementById('gambleStoneUI');
    if (ui.style.display === 'none') {
        // 初始化数据
        initGambleStone();
        
        // 同步资金
        syncGambleBalance();
        
        // 生成界面
        renderGambleStone();
        ui.style.display = 'block';
    } else {
        closeGambleStone();
    }
}

// 关闭赌石系统
function closeGambleStone() {
    if (player.gambleStone && player.gambleStone.gameState && player.gambleStone.gameState.isCutting) {
        showGambleNotification('正在切刀，请等这一刀走完再关闭', 'info');
        return;
    }
    const ui = document.getElementById('gambleStoneUI');
    ui.style.display = 'none';
    saveGame();
}

// 同步资金
function syncGambleBalance() {
    const gamble = player.gambleStone;
    if (!gamble) return;
    const inv = player.investmentGame && player.investmentGame.userData;
    if (!inv) return;
    
    // 可以从投资游戏转移资金
    if (gamble.userData.balance < 100) {
        const transfer = Math.min(1000, inv.availableFunds * 0.1);
        if (transfer > 10) {
            inv.availableFunds -= transfer;
            gamble.userData.balance += transfer;
            showGambleNotification(`从投资账户转入 ${transfer.toFixed(2)} 元`, 'info');
        }
    }
}

// 渲染赌石界面（标场双栏 · 高难度规则）
function renderGambleStone() {
    ensureGambleStoneExtras();
    syncGambleSessionDate(player.gambleStone);
    const content = document.getElementById('gambleStoneContent');
    const gamble = player.gambleStone;
    let currentStone = gamble.stones.find(s => s.id === gamble.currentStoneId);
    if (!currentStone && gamble.stones.length) {
        gamble.currentStoneId = gamble.stones[0].id;
        currentStone = gamble.stones[0];
    }
    if (!currentStone) {
        content.innerHTML = '<div style="padding:24px;color:#c97a8a;">标单为空，请刷新或重新读档。</div>';
        return;
    }
    ensureGambleActiveProfile(gamble, currentStone);
    const investAvail = (player.investmentGame && player.investmentGame.userData && typeof player.investmentGame.userData.availableFunds === 'number')
        ? player.investmentGame.userData.availableFunds : 0;
    const transferCap = typeof GAMBLE_TRANSFER_SINGLE_MAX !== 'undefined' ? GAMBLE_TRANSFER_SINGLE_MAX : 1e12;
    const transferInputMax = Math.min(transferCap, Math.max(investAvail, gamble.userData.balance));
    const heatMax = typeof GAMBLE_HEAT_FOR_FEVER !== 'undefined' ? GAMBLE_HEAT_FOR_FEVER : 130;
    const cutStyle = gamble.gameState.cutStyle || 'balanced';
    refreshGambleMarketWindIfNeeded(gamble);
    const wdef = getActiveGambleWind(gamble);
    const windName = wdef ? wdef.name : '—';
    const windTag = wdef ? wdef.tag : '';
    const windMins = gamble.gameState.marketWind && gamble.gameState.marketWind.until
        ? Math.max(0, Math.ceil((gamble.gameState.marketWind.until - Date.now()) / 60000))
        : 0;
    const qiMeterPct = Math.min(100, Math.max(0, gamble.userData.qiMeter || 0));
    const rumor = getGambleRumorLine();
    const codexPct = getGambleCodexProgressPct(gamble.codex || {});
    const spotIdx = (typeof gamble.gameState.spotIndex === 'number' ? gamble.gameState.spotIndex : 100).toFixed(1);
    const spotDel = typeof gamble.gameState.spotDelta === 'number' ? gamble.gameState.spotDelta : 0;
    const spotDelClass = spotDel > 0.04 ? 'up' : spotDel < -0.04 ? 'down' : 'flat';
    const spotDelTxt = spotDel > 0 ? '+' + spotDel.toFixed(1) : spotDel < 0 ? spotDel.toFixed(1) : '±0';
    const eyeRank = getGambleEyeRank(gamble.userData.eyeExp || 0);
    const eyeNextTxt = eyeRank.next != null ? ' · 距「下一阶」约 ' + Math.max(0, eyeRank.next - eyeRank.exp) + ' 点' : ' · 已满阶';
    const sessG = gamble.gameState.session || { cuts: 0, bestNet: 0, totalNet: 0 };
    const dayCuts = sessG.cuts || 0;
    const daySum = typeof sessG.totalNet === 'number' ? sessG.totalNet : 0;
    const dayBest = typeof sessG.bestNet === 'number' ? sessG.bestNet : 0;
    const scrapDone = gamble.userData.scrapRushDayKey === getGambleLocalDayKey();
    
    content.innerHTML = `
        <style>
            .gs-root.gamble-stone, .gs-root.gamble-stone * { margin: 0; padding: 0; box-sizing: border-box; }
            .gs-root.gamble-stone {
                font-family: "Microsoft YaHei", "PingFang SC", system-ui, sans-serif;
                background: #0a0d12;
                color: #e8dcc8;
                min-height: 100%;
                padding: 22px 22px 28px;
            }
            .gs-head {
                text-align: left;
                border-bottom: 1px solid #2c241c;
                padding-bottom: 16px;
                margin-bottom: 18px;
            }
            .gs-head h1 {
                font-size: 1.35rem;
                font-weight: 700;
                letter-spacing: 0.12em;
                color: #d4a853;
                text-transform: uppercase;
            }
            .gs-head .gs-sub {
                margin-top: 8px;
                font-size: 0.82rem;
                color: #8a7a66;
                line-height: 1.55;
                max-width: 52rem;
            }
            .gs-layout {
                display: grid;
                grid-template-columns: 1fr 300px;
                gap: 18px;
                align-items: start;
            }
            @media (max-width: 960px) {
                .gs-layout { grid-template-columns: 1fr; }
                .gs-side { order: -1; }
            }
            .gs-card {
                background: linear-gradient(165deg, #12161d 0%, #0e1117 100%);
                border: 1px solid #2a2f38;
                border-radius: 2px;
                padding: 16px 18px;
            }
            .gs-balance-row {
                display: flex;
                flex-wrap: wrap;
                align-items: flex-end;
                justify-content: space-between;
                gap: 14px;
            }
            #gs-balance-num {
                font-size: 1.85rem;
                font-weight: 700;
                color: #d4a853;
                letter-spacing: 0.04em;
            }
            .gs-transfer-inline {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                align-items: center;
            }
            .gs-transfer-inline input {
                width: 120px;
                padding: 8px 10px;
                background: #0c0f14;
                border: 1px solid #3d3428;
                border-radius: 2px;
                color: #e8dcc8;
                font-size: 0.88rem;
            }
            .gs-tbtn {
                padding: 8px 14px;
                font-size: 0.8rem;
                font-weight: 600;
                border: 1px solid #4a3f32;
                border-radius: 2px;
                cursor: pointer;
                background: #1a1510;
                color: #d4c4a8;
            }
            .gs-tbtn-in { border-color: #2d5a45; color: #7dccb0; }
            .gs-tbtn-out { border-color: #2a3f6b; color: #8ab4f8; }
            .gs-stats-row {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-top: 14px;
            }
            .gs-stat {
                padding: 10px;
                background: rgba(0,0,0,0.28);
                border: 1px solid #252a32;
                text-align: center;
            }
            .gs-stat-lab { font-size: 0.72rem; color: #7d7365; letter-spacing: 0.06em; }
            .gs-stat-num { font-size: 1.05rem; font-weight: 700; margin-top: 4px; color: #c4b5a0; }
            .gs-stat-num.pos { color: #5ecf9a; }
            .gs-stat-num.neg { color: #e07070; }
            .gs-meters {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-top: 14px;
            }
            @media (max-width: 600px) { .gs-meters { grid-template-columns: 1fr; } }
            .gs-meter {
                padding: 10px 12px;
                background: rgba(0,0,0,0.22);
                border: 1px solid #2a2f38;
                border-radius: 2px;
            }
            .gs-meter-h {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                color: #8a7d6e;
                margin-bottom: 6px;
            }
            .gs-meter-h span.fever-ready { color: #ff9f43; font-weight: 700; animation: gsBlink 1.1s ease infinite; }
            @keyframes gsBlink { 0%,100%{opacity:1} 50%{opacity:.55} }
            .gs-bar {
                height: 8px;
                background: #0c0f14;
                border: 1px solid #2c241c;
                border-radius: 1px;
                overflow: hidden;
            }
            #gs-heat-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #8b5a2b, #d4a853);
                transition: width 0.35s ease;
            }
            #gs-misfortune-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #4a2a3a, #a8556a);
                transition: width 0.35s ease;
            }
            .gs-play {
                margin-top: 16px;
                text-align: center;
                padding: 22px 16px 20px;
            }
            .gs-stone-orbit {
                width: 168px;
                height: 168px;
                margin: 0 auto 18px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.6rem;
                border: 2px solid rgba(212,168,83,0.35);
                background: radial-gradient(circle at 35% 25%, rgba(212,168,83,0.12), #0c0f14 55%);
                box-shadow: 0 0 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(212,168,83,0.06);
                transition: box-shadow 0.4s ease, transform 0.38s ease, filter 0.38s ease;
            }
            .gs-stone-orbit.cutting { animation: gsPulse 0.9s ease infinite; }
            @keyframes gsPulse {
                50% { box-shadow: 0 0 28px rgba(212,168,83,0.35); }
            }
            .gs-stone-orbit.result-win { animation: gsWin 0.8s ease 3; }
            .gs-stone-orbit.result-lose { animation: gsLose 0.8s ease 3; }
            @keyframes gsWin { 50% { box-shadow: 0 0 36px rgba(80,200,140,0.45); } }
            @keyframes gsLose { 50% { box-shadow: 0 0 36px rgba(200,80,80,0.45); } }
            #gs-current-name { font-size: 1.15rem; font-weight: 700; color: #f0ebe3; margin-bottom: 6px; }
            #gs-current-cost { font-size: 0.88rem; color: #8a7d6e; margin-bottom: 14px; }
            .gs-style-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 8px;
                margin-bottom: 14px;
            }
            .gs-style-btn {
                padding: 8px 12px;
                font-size: 0.78rem;
                border-radius: 2px;
                border: 1px solid #3d3428;
                background: #141820;
                color: #a89b88;
                cursor: pointer;
                text-align: left;
                max-width: 160px;
                line-height: 1.35;
            }
            .gs-style-btn:hover { border-color: #5c4a2a; color: #d4c4a8; }
            .gs-style-btn.on {
                border-color: #d4a853;
                color: #d4a853;
                background: rgba(212,168,83,0.08);
            }
            .gs-mode-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 8px;
                margin-bottom: 12px;
            }
            .gs-mode-btn {
                padding: 8px 12px;
                font-size: 0.78rem;
                border-radius: 2px;
                border: 1px solid #3d3428;
                background: #141820;
                color: #a89b88;
                cursor: pointer;
                text-align: left;
                max-width: 200px;
                line-height: 1.35;
            }
            .gs-mode-btn:hover { border-color: #4a6b8a; color: #8ab4f8; }
            .gs-mode-btn.on {
                border-color: #4a7c8f;
                color: #7dccb0;
                background: rgba(45,90,69,0.12);
            }
            .gs-cut-btn {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 14px 36px;
                font-size: 0.95rem;
                font-weight: 700;
                letter-spacing: 0.08em;
                border: none;
                border-radius: 2px;
                cursor: pointer;
                color: #1a1510;
                background: linear-gradient(180deg, #e8c066, #b8893a);
                box-shadow: 0 4px 0 #5c4a2a, 0 6px 18px rgba(0,0,0,0.45);
            }
            .gs-cut-btn:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-1px); }
            .gs-cut-btn:disabled {
                opacity: 0.45;
                cursor: not-allowed;
                box-shadow: none;
            }
            .gamble-seq-lock .gs-stone-item,
            .gamble-seq-lock .gs-style-btn,
            .gamble-seq-lock .transfer-input,
            .gamble-seq-lock .gs-tbtn {
                pointer-events: none !important;
                opacity: 0.52 !important;
            }
            #result-display.gs-result.gs-result-cutting {
                display: block !important;
                min-height: 120px;
                max-height: 220px;
                overflow-y: auto;
                font-size: 0.82rem;
            }
            .gs-cut-panel-hd {
                font-size: 0.72rem;
                letter-spacing: 0.12em;
                color: #8a7d6e;
                margin-bottom: 10px;
                padding-bottom: 8px;
                border-bottom: 1px solid #2a2f38;
            }
            .gs-cut-progress {
                height: 4px;
                background: #0c0f14;
                border: 1px solid #2c241c;
                border-radius: 2px;
                margin-bottom: 10px;
                overflow: hidden;
            }
            .gs-cut-progress > i {
                display: block;
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #5a4a2a, #d4a853);
                transition: width 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            .gs-cut-log-line {
                margin-bottom: 10px;
                padding-left: 8px;
                border-left: 2px solid rgba(212,168,83,0.35);
                animation: gsCutFade 0.35s ease;
            }
            .gs-cut-log-line.gs-cut-swing {
                border-left-color: rgba(220, 140, 90, 0.65);
                background: rgba(212,168,83,0.04);
                padding: 8px 8px 8px 10px;
                border-radius: 2px;
            }
            .gs-cut-log-line.gs-cut-swing .gs-cut-line-title {
                color: #e8b86a;
            }
            @keyframes gsCutFade {
                from { opacity: 0; transform: translateY(6px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .gs-cut-line-title {
                font-size: 0.68rem;
                color: #d4a853;
                letter-spacing: 0.06em;
                margin-bottom: 2px;
            }
            .gs-cut-line-txt {
                color: #c4b5a0;
                line-height: 1.5;
            }
            .gs-cut-log-line.gs-cut-aside {
                border-left-color: rgba(100, 140, 180, 0.45);
                opacity: 0.92;
            }
            .gs-cut-log-line.gs-cut-aside .gs-cut-line-title {
                color: #8ab4f8;
                font-size: 0.64rem;
            }
            .gs-cut-log-line.gs-cut-aside .gs-cut-line-txt {
                color: #9ca3af;
                font-size: 0.78rem;
                font-style: italic;
            }
            .gs-cut-meta-bar {
                display: flex;
                flex-wrap: wrap;
                gap: 10px 16px;
                font-size: 0.68rem;
                color: #6b6458;
                margin-bottom: 10px;
                padding: 8px 10px;
                background: rgba(0,0,0,0.28);
                border: 1px solid #2a2f38;
                border-radius: 2px;
            }
            .gs-cut-meta-bar span { letter-spacing: 0.04em; }
            .gs-cut-meta-bar .gs-crowd-aside {
                flex-basis: 100%;
                font-style: italic;
                color: #7d8aa0;
                font-size: 0.7rem;
                margin-top: 2px;
                line-height: 1.4;
            }
            .gs-prep-panel {
                margin-bottom: 14px;
                padding: 12px 14px;
                background: rgba(8,14,22,0.65);
                border: 1px solid #2a3544;
                border-radius: 2px;
                text-align: left;
            }
            .gs-profile-head { font-size: 0.82rem; color: #8ab4c9; margin-bottom: 10px; letter-spacing: 0.06em; }
            .gs-profile-head--sm { margin-top: 12px; font-size: 0.78rem; margin-bottom: 8px; }
            .gs-ph-ico { color: #5a8cba; margin-right: 4px; }
            .gs-ph-sub { font-size: 0.68rem; color: #5c6678; font-weight: 400; }
            .gs-profile-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px 12px;
                font-size: 0.76rem;
                color: #aeb6c4;
            }
            .gs-pg-wide { grid-column: 1 / -1; }
            .gs-pg-k { color: #6b7588; margin-right: 6px; }
            .gs-pg-v { color: #dcd6cb; }
            .gs-blade-block { margin-top: 12px; padding-top: 10px; border-top: 1px dashed #2a2f38; }
            .gs-blade-radios { display: flex; flex-direction: column; gap: 6px; font-size: 0.74rem; color: #a89b88; }
            .gs-br { cursor: pointer; display: flex; align-items: flex-start; gap: 6px; line-height: 1.45; }
            .gs-br input { margin-top: 3px; accent-color: #6a9cbd; flex-shrink: 0; }
            .gs-mentor-row { margin-top: 12px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
            .gs-mentor-btn {
                padding: 8px 14px;
                font-size: 0.76rem;
                border: 1px solid #3d5a4f;
                background: rgba(45,90,69,0.12);
                color: #8fd4b8;
                border-radius: 2px;
                cursor: pointer;
            }
            .gs-mentor-btn:hover { background: rgba(45,90,69,0.22); }
            .gs-mentor-pr { color: #d4a853; font-weight: 700; }
            .gs-mentor-tip { font-size: 0.7rem; color: #6b7588; max-width: 20rem; line-height: 1.4; }
            .gs-auction-strip {
                margin-bottom: 12px;
                padding: 10px 12px;
                background: linear-gradient(110deg, rgba(212,168,83,0.12), rgba(10,13,18,0.5));
                border: 1px solid #4a3f28;
                border-radius: 2px;
            }
            .gs-auction-strip--off { opacity: 0.75; font-size: 0.72rem; color: #6b7588; }
            .gs-auction-ttl { font-size: 0.82rem; color: #e8c97a; margin-bottom: 4px; }
            .gs-ah-tag { font-size: 0.62rem; padding: 2px 6px; background: rgba(212,168,83,0.2); border-radius: 2px; margin-right: 6px; color: #d4a853; }
            .gs-auction-sub { font-size: 0.72rem; color: #9ca3af; margin-bottom: 8px; }
            .gs-ah-fee { color: #d4a853; font-weight: 700; }
            .gs-auction-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
            .gs-auction-btn {
                padding: 7px 14px;
                font-size: 0.74rem;
                border: 1px solid #8b6914;
                background: rgba(212,168,83,0.12);
                color: #f5e6b8;
                border-radius: 2px;
                cursor: pointer;
            }
            .gs-auction-btn:hover { background: rgba(212,168,83,0.22); }
            .gs-auction-tip { font-size: 0.68rem; color: #6b7588; max-width: 18rem; line-height: 1.35; }
            .gs-appraisal-block { margin-top: 12px; padding-top: 10px; border-top: 1px dashed #2a3544; }
            .gs-appraisal-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 8px; }
            .gs-appraisal-btn {
                padding: 7px 14px;
                font-size: 0.74rem;
                border: 1px solid #4a5f8a;
                background: rgba(60,80,120,0.15);
                color: #a8c4e8;
                border-radius: 2px;
                cursor: pointer;
            }
            .gs-appraisal-btn:hover { background: rgba(60,80,120,0.28); }
            .gs-ap-pr { color: #93c5fd; font-weight: 700; }
            .gs-appraisal-tip { font-size: 0.68rem; color: #6b7588; max-width: 18rem; }
            .gs-appraisal-slip { font-size: 0.7rem; color: #9ca3af; line-height: 1.45; max-height: 6.5em; overflow-y: auto; }
            .gs-slip-paper {
                padding: 8px 10px;
                background: rgba(0,0,0,0.35);
                border: 1px dashed #4a5568;
                border-radius: 2px;
                color: #cbd5e1;
            }
            .gs-slip-empty { font-style: italic; color: #5c6678; }
            .gs-field-note {
                margin-top: 10px;
                padding-top: 8px;
                border-top: 1px dashed #2a2f38;
                font-size: 0.78rem;
                color: #7d7365;
                line-height: 1.45;
            }
            .gs-stone-orbit.cut-depth-0 { transform: scale(1); }
            .gs-stone-orbit.cut-depth-1 { transform: scale(0.985); filter: saturate(1.04); }
            .gs-stone-orbit.cut-depth-2 { transform: scale(0.97); filter: saturate(1.06); }
            .gs-stone-orbit.cut-depth-3 { transform: scale(0.955); filter: saturate(1.08); }
            .gs-stone-orbit.cut-depth-4 { transform: scale(0.94); filter: saturate(1.1); }
            .gs-stone-orbit.cut-depth-5 { transform: scale(0.925); filter: saturate(1.12); }
            .gs-stone-orbit.cut-depth-6 { transform: scale(0.91); filter: saturate(1.14); }
            .gs-stone-orbit.cut-depth-7 { transform: scale(0.895); filter: saturate(1.16); }
            .gs-stone-orbit.cut-depth-8 { transform: scale(0.88); filter: saturate(1.18); }
            #result-display.gs-result {
                margin-top: 18px;
                padding: 14px 16px;
                text-align: left;
                background: rgba(0,0,0,0.35);
                border: 1px solid #2a2f38;
                border-radius: 2px;
                display: none;
                min-height: 48px;
            }
            .result-title { font-size: 1rem; font-weight: 700; margin-bottom: 8px; color: #e8dcc8; }
            .result-amount { font-size: 1.65rem; font-weight: 800; margin: 6px 0; }
            .result-amount.win { color: #5ecf9a; }
            .result-amount.lose { color: #e07070; }
            .result-message { font-size: 0.88rem; color: #a89b88; line-height: 1.45; }
            .double-or-nothing-box {
                margin-top: 14px;
                padding: 12px 14px;
                border-radius: 2px;
                border: 1px dashed #6b542c;
                background: rgba(212,168,83,0.06);
            }
            .double-or-nothing-box p { color: #d4c4a8; font-size: 0.85rem; line-height: 1.5; margin-bottom: 10px; }
            .double-or-nothing-btns { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
            .double-or-nothing-btns button { padding: 8px 14px; font-size: 0.82rem; border-radius: 2px; border: none; font-weight: 600; cursor: pointer; }
            .double-btn-yes { background: #6b2a2a; color: #f0d0d0; }
            .double-btn-no { background: #2a3038; color: #b8b4a8; }
            .gs-side-title {
                font-size: 0.72rem;
                letter-spacing: 0.14em;
                color: #6b5d4e;
                margin-bottom: 10px;
                text-transform: uppercase;
            }
            .gs-stone-list {
                max-height: 480px;
                overflow-y: auto;
                padding-right: 4px;
            }
            .gs-stone-item {
                position: relative;
                padding: 12px 12px 10px;
                margin-bottom: 8px;
                border: 1px solid #2a2f38;
                border-radius: 2px;
                cursor: pointer;
                background: #10141a;
                transition: border-color 0.2s, background 0.2s;
            }
            .gs-stone-item:hover { border-color: #4a3f32; background: #141820; }
            .gs-stone-item.selected {
                border-color: #d4a853;
                background: rgba(212,168,83,0.07);
                box-shadow: inset 0 0 0 1px rgba(212,168,83,0.15);
            }
            .gs-stone-item .free-recut-tag {
                position: absolute;
                top: 6px;
                right: 6px;
                font-size: 0.62rem;
                padding: 2px 6px;
                background: linear-gradient(135deg, #5c3d6b, #8b4a6a);
                color: #fff;
                border-radius: 2px;
                font-weight: 700;
            }
            .gs-si-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
            .gs-si-name { font-weight: 700; font-size: 0.9rem; color: var(--stone-color, #d4a853); }
            .gs-si-tier { font-size: 0.65rem; color: #7d7365; letter-spacing: 0.06em; }
            .gs-si-cost { font-size: 0.85rem; color: #d4a853; font-weight: 600; }
            .gs-si-meta { font-size: 0.72rem; color: #6b6458; margin-top: 6px; display: flex; justify-content: space-between; }
            .gs-hist {
                max-height: 200px;
                overflow-y: auto;
                font-size: 0.8rem;
            }
            .history-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 10px;
                margin-bottom: 4px;
                background: rgba(0,0,0,0.25);
                border-left: 3px solid var(--history-color);
            }
            .history-stone { color: var(--history-color); font-weight: 600; }
            .history-result.win { color: #5ecf9a; font-weight: 700; }
            .history-result.lose { color: #c97a7a; font-weight: 700; }
            .history-result.neutral { color: #9ca3af; font-weight: 700; }
            .transfer-info { margin-top: 8px; font-size: 0.78rem; display: none; padding: 8px; border-radius: 2px; }
            .transfer-info.success { background: rgba(40,90,60,0.25); color: #7dccb0; border: 1px solid #2d5a45; }
            .transfer-info.error { background: rgba(90,40,40,0.25); color: #e8a0a0; border: 1px solid #6b2a2a; }
            .transfer-info.info { background: rgba(40,60,90,0.25); color: #8ab4f8; border: 1px solid #2a3f6b; }
            .gs-wind-panel {
                margin-bottom: 16px;
                padding: 12px 14px;
                background: linear-gradient(100deg, rgba(212,168,83,0.09), rgba(10,13,18,0.4));
                border: 1px solid #2c241c;
                border-radius: 2px;
            }
            .gs-wind-main { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px 14px; margin-bottom: 10px; }
            .gs-wind-ttl { font-size: 0.7rem; color: #7d7365; letter-spacing: 0.14em; }
            #gs-wind-name { color: #d4a853; font-size: 1rem; }
            .gs-wind-tag { font-size: 0.78rem; color: #8a7d6e; max-width: 36rem; }
            .gs-wind-time { font-size: 0.75rem; color: #5ecf9a; }
            .gs-qi-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; font-size: 0.78rem; }
            .gs-qi-lab { cursor: pointer; color: #c4b5a0; display: flex; align-items: center; gap: 6px; }
            .gs-qi-lab input { accent-color: #d4a853; }
            .gs-qi-pill, .gs-rep-pill { padding: 4px 10px; background: rgba(0,0,0,0.3); border: 1px solid #2a2f38; border-radius: 2px; color: #a89b88; }
            .gs-qi-meter-wrap { display: flex; align-items: center; gap: 10px; font-size: 0.75rem; color: #7d7365; margin-top: 8px; }
            .gs-qi-bar-bg { flex: 1; max-width: 240px; height: 6px; }
            #gs-qi-meter-fill { height: 100%; background: linear-gradient(90deg, #5c3d6b, #a78bfa); transition: width 0.3s ease; border-radius: 1px; }
            .gs-rumor { margin-top: 8px; font-size: 0.72rem; color: #5c6678; font-style: italic; border-top: 1px dashed #2a2f38; padding-top: 8px; line-height: 1.45; }
            .gs-codex-bar { margin-top: 12px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
            .gs-codex-btn {
                font-size: 0.78rem; padding: 6px 14px; border-radius: 2px; cursor: pointer;
                border: 1px solid #4a3f32; background: #1a1510; color: #d4a853; letter-spacing: 0.06em;
            }
            .gs-codex-btn:hover { border-color: #d4a853; color: #f5e6c8; }
            .gs-codex-btn #gs-codex-pct { color: #7dccb0; font-weight: 700; margin-left: 6px; }
            .gs-codex-drawer {
                display: none; margin-bottom: 16px; padding: 14px 16px;
                background: linear-gradient(165deg, #0f131a 0%, #0a0d12 100%);
                border: 1px solid #2c241c; border-radius: 2px; font-size: 0.78rem; color: #a89b88;
            }
            .gs-codex-drawer[data-open="1"] { display: block; }
            .gs-cx-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; margin-bottom: 8px; color: #d4a853; }
            .gs-cx-pct { font-size: 0.72rem; color: #7dccb0; font-weight: 600; }
            .gs-cx-sub { font-size: 0.72rem; color: #6b6458; margin-bottom: 12px; line-height: 1.5; }
            .gs-cx-sec { margin-bottom: 12px; }
            .gs-cx-ttl { display: block; font-size: 0.65rem; letter-spacing: 0.14em; color: #7d7365; margin-bottom: 6px; }
            .gs-cx-grid { display: flex; flex-wrap: wrap; gap: 6px; }
            .gs-cx-chip {
                display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 2px;
                font-size: 0.7rem; border: 1px solid #2a2f38; opacity: 0.38; color: #6b6458;
            }
            .gs-cx-chip.on { opacity: 1; color: #e8dcc8; border-color: var(--cx); background: rgba(0,0,0,0.22); }
            .gs-cx-chip small { font-size: 0.62rem; color: #7dccb0; margin-left: 2px; }
            .gs-cx-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cx); flex-shrink: 0; opacity: 0.9; }
            .gs-cx-foot { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #2a2f38; font-size: 0.72rem; color: #5c6678; }
            .gs-yield-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 12px; align-items: center; }
            .gs-yield-tag {
                padding: 4px 10px; border-radius: 2px; font-size: 0.78rem; font-weight: 600;
                border: 1px solid rgba(148, 163, 184, 0.45); background: rgba(0,0,0,0.28);
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            }
            .gs-yield-rub { font-size: 0.65rem; color: #7cb8d8; letter-spacing: 0.08em; }
            .gs-immersion-strip {
                margin-top: 12px; padding: 10px 12px; background: rgba(212,168,83,0.04);
                border: 1px solid #2c241c; border-radius: 2px; display: grid;
                grid-template-columns: 1fr 1fr; gap: 8px 14px; font-size: 0.74rem; color: #8a7d6e;
            }
            @media (max-width: 560px) { .gs-immersion-strip { grid-template-columns: 1fr; } }
            .gs-im-cell { min-width: 0; }
            .gs-im-wide { grid-column: 1 / -1; padding-top: 6px; border-top: 1px dashed #2a2f38; font-size: 0.72rem; color: #6b6458; }
            .gs-daily-quest {
                margin-top: 14px; padding: 12px 14px; background: rgba(45,90,69,0.08);
                border: 1px solid #2d4a3e; border-radius: 2px; font-size: 0.74rem; color: #a89b88;
            }
            .gs-dq-h { font-size: 0.72rem; letter-spacing: 0.12em; color: #7dccb0; margin-bottom: 8px; }
            .gs-dq-sub { font-size: 0.65rem; color: #5c6678; font-weight: 400; letter-spacing: 0; }
            .gs-dq-row { display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: baseline; padding: 4px 0; border-bottom: 1px dashed rgba(42,47,56,0.6); font-size: 0.72rem; }
            .gs-dq-row:last-child { border-bottom: none; }
            .gs-scrap-rush { margin-top: 10px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
            .gs-scrap-btn {
                padding: 7px 14px; font-size: 0.76rem; border: 1px solid #6b4f8a; border-radius: 2px;
                background: rgba(107,79,138,0.15); color: #c4b5fd; cursor: pointer; font-weight: 600;
            }
            .gs-scrap-btn:hover:not(:disabled) { background: rgba(107,79,138,0.28); }
            .gs-scrap-btn:disabled { opacity: 0.48; cursor: not-allowed; }
            .gs-scrap-tip { font-size: 0.68rem; color: #6b7588; max-width: 22rem; line-height: 1.4; }
            .gs-im-lab { display: block; font-size: 0.62rem; letter-spacing: 0.12em; color: #5c6678; margin-bottom: 2px; }
            .gs-im-cell strong { color: #d4a853; font-size: 0.88rem; }
            .gs-spot-updn { margin-left: 6px; font-weight: 700; font-size: 0.78rem; }
            .gs-spot-updn.up { color: #5ecf9a; }
            .gs-spot-updn.down { color: #e8a0a0; }
            .gs-spot-updn.flat { color: #7d7365; }
            .gs-present-card {
                margin: 12px 0; padding: 12px; background: rgba(0,0,0,0.28); border: 1px solid #2a3544;
                border-radius: 2px; font-size: 0.76rem; color: #a89b88;
            }
            .gs-pc-top { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; font-size: 0.68rem; color: #5c6678; }
            .gs-pc-spot b { color: #7cb8d8; }
            .gs-pc-pulse { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 0.72rem; }
            .gs-pc-pulse .gs-pc-bar { flex: 1; height: 5px; background: #0c0f14; border: 1px solid #2c241c; border-radius: 2px; overflow: hidden; max-width: 180px; }
            .gs-pc-pulse .gs-pc-bar > i { display: block; height: 100%; background: linear-gradient(90deg, #7f1d1d, #f59e0b, #d4a853); width: 40%; }
            .gs-pc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px; }
            .gs-pc-k { display: block; font-size: 0.62rem; color: #6b6458; }
            .gs-pc-v { color: #e8dcc8; font-weight: 600; }
            .gs-pc-wire { font-size: 0.68rem; color: #7d7365; line-height: 1.45; margin-bottom: 6px; }
            .gs-pc-hook { font-size: 0.68rem; color: #5c6678; font-style: italic; line-height: 1.4; }
            .gs-side-deal { color: #5ecf9a; font-size: 0.85rem; font-weight: 700; margin: 6px 0; letter-spacing: 0.04em; }
            .gamble-header { display: none; }
        </style>
        
        <div class="gamble-stone gs-root">
            <header class="gs-head">
                <h1>暗标场 · 赌石</h1>
                <p class="gs-sub">标单共 <strong>20 档</strong>（第 20 档标价 10 亿）；出绿率 <strong>1 档 35% → 20 档 5%</strong>。玩法含<strong>全切 / 开窗 / 引线切 / 擦皮 / 半明</strong>；每块有<strong>场口档案</strong>；可选<strong>限时公盘举牌</strong>、<strong>娱乐鉴定书</strong>；先选<strong>落刀位</strong>再落槌；可付<strong>茶水请教老师傅</strong>。<strong>本日悬赏</strong>与<strong>角料快局</strong>（每日一次）添彩头。擦皮压灯 → 数刀 → 终裁；连败「晦气」、狂热 ${heatMax} 点；风向换季；气运与声望照旧。每刀结算<strong>色·种·件级</strong>记入<strong>料性图鉴</strong>。</p>
                <div class="gs-codex-bar">
                    <button type="button" class="gs-codex-btn" id="gs-codex-toggle">料性图鉴 <span id="gs-codex-pct">${codexPct}%</span></button>
                </div>
            </header>
            <div class="gs-wind-panel" id="gs-wind-panel">
                <div class="gs-wind-main">
                    <span class="gs-wind-ttl">本场风向</span>
                    <strong id="gs-wind-name">${windName}</strong>
                    <span class="gs-wind-tag" id="gs-wind-tag">${windTag}</span>
                    <span class="gs-wind-time" id="gs-wind-time">约 ${windMins} 分钟后换季</span>
                </div>
                <div class="gs-qi-row">
                    <label class="gs-qi-lab"><input type="checkbox" id="gs-spend-qi" ${gamble.gameState.spendQiNextCut ? 'checked' : ''}> 气运护刀 · 下刀消耗 <b>1</b> 气运点（微演出绿/头奖）</label>
                    <span class="gs-qi-pill">气运点 <b id="gs-qi-points">${gamble.userData.qiPoints || 0}</b> / 12</span>
                    <span class="gs-rep-pill">声望 <b id="gs-rep-num">${Math.floor(gamble.userData.reputation || 0)}</b> · 幸运 Lv.<b id="gs-luck-lvl">${gamble.userData.luckyLevel || 1}</b></span>
                </div>
                <div class="gs-qi-meter-wrap">
                    <span>气运槽</span>
                    <div class="gs-bar gs-qi-bar-bg"><div id="gs-qi-meter-fill" style="width:${qiMeterPct}%;"></div></div>
                    <span id="gs-qi-meter-txt">${Math.round(gamble.userData.qiMeter || 0)}/100</span>
                </div>
                <div class="gs-rumor">${rumor}</div>
            </div>
            <div id="gs-codex-drawer" class="gs-codex-drawer" data-open="0"></div>
            <div class="gs-layout">
                <div class="gs-main">
                    <section class="gs-card">
                        <div class="gs-balance-row">
                            <div>
                                <div style="font-size:0.72rem;color:#7d7365;letter-spacing:0.1em;">本场余额</div>
                                <div id="gs-balance-num">¥ ${gamble.userData.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div class="gs-transfer-inline">
                                <input type="number" id="transfer-amount" class="transfer-input" placeholder="金额"
                                    min="0" max="${transferInputMax}">
                                <button type="button" class="gs-tbtn gs-tbtn-in" id="transfer-from-invest">转入</button>
                                <button type="button" class="gs-tbtn gs-tbtn-out" id="transfer-to-invest">转出</button>
                            </div>
                        </div>
                        <div id="transfer-info" class="transfer-info"></div>
                        <div class="gs-stats-row">
                            <div class="gs-stat">
                                <div class="gs-stat-lab">总盈亏</div>
                                <div id="gs-net-pl" class="gs-stat-num ${gamble.userData.totalWon - gamble.userData.totalLost >= 0 ? 'pos' : 'neg'}">${(gamble.userData.totalWon - gamble.userData.totalLost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div class="gs-stat">
                                <div class="gs-stat-lab">出绿率</div>
                                <div id="gs-winrate" class="gs-stat-num">${gamble.userData.gamesPlayed > 0 ? (gamble.userData.winRate * 100).toFixed(1) : 0}%</div>
                            </div>
                            <div class="gs-stat">
                                <div class="gs-stat-lab">连胜</div>
                                <div id="gs-streak" class="gs-stat-num ${gamble.userData.streak >= 0 ? 'pos' : 'neg'}">${gamble.userData.streak >= 0 ? '+' : ''}${gamble.userData.streak}</div>
                            </div>
                        </div>
                        <div class="gs-meters">
                            <div class="gs-meter">
                                <div class="gs-meter-h">
                                    <span>狂热</span>
                                    <span id="gs-heat-label" class="${gamble.gameState.nextCutFever ? 'fever-ready' : ''}">${gamble.gameState.nextCutFever ? '下一刀·狂热' : Math.round(gamble.userData.heat || 0) + '/' + heatMax}</span>
                                </div>
                                <div class="gs-bar"><div id="gs-heat-fill" style="width:${(Math.min(heatMax, gamble.userData.heat || 0) / heatMax) * 100}%;"></div></div>
                            </div>
                            <div class="gs-meter">
                                <div class="gs-meter-h">
                                    <span>晦气</span>
                                    <span id="gs-misfortune-label">${Math.round(gamble.userData.misfortune || 0)}/100</span>
                                </div>
                                <div class="gs-bar"><div id="gs-misfortune-fill" style="width:${Math.min(100, gamble.userData.misfortune || 0)}%;"></div></div>
                            </div>
                        </div>
                        <div class="gs-immersion-strip">
                            <div class="gs-im-cell">
                                <span class="gs-im-lab">公盘现货指数（氛围）</span>
                                <strong id="gs-spot-idx">${spotIdx}</strong><span id="gs-spot-delta" class="gs-spot-updn ${spotDelClass}">${spotDelTxt}</span>
                            </div>
                            <div class="gs-im-cell">
                                <span class="gs-im-lab">眼力成长</span>
                                <strong id="gs-eye-title">${eyeRank.title}</strong>
                                <span id="gs-eye-meta" style="font-size:0.72rem;color:#7d7365;"> Lv.${eyeRank.level} · ${Math.floor(eyeRank.exp)} 点${eyeNextTxt}</span>
                            </div>
                            <div class="gs-im-wide" id="gs-day-line">本日第 <b>${dayCuts}</b> 刀 · 今日累计净收 <b style="color:${daySum >= 0 ? '#5ecf9a' : '#e8a0a0'}">${daySum >= 0 ? '+' : ''}${daySum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</b> · 今日最佳单刀 <b style="color:#d4a853">${dayBest >= 0 ? '+' : ''}${dayBest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</b></div>
                        </div>
                        <div class="gs-daily-quest" id="gs-daily-quest-wrap">
                            <div class="gs-dq-h">本日悬赏 <span class="gs-dq-sub">（本地日重置 · 主刀不含擦皮）</span></div>
                            <div id="gs-daily-quest-body">${getGambleDailyQuestInnerHtml(gamble)}</div>
                            <div class="gs-scrap-rush">
                                <button type="button" class="gs-scrap-btn" id="gs-scrap-rush-btn" ${scrapDone ? 'disabled' : ''}>角料快局 ¥388</button>
                                <span class="gs-scrap-tip">${scrapDone ? '今日已参加过角料快局，明早摊见。' : '从废料堆随手拣一块角料估价：不计入悬赏进度，纯添彩头。'}</span>
                            </div>
                        </div>
                    </section>
                    <section class="gs-card gs-play">
                        <div class="gs-stone-orbit" id="stone-display"
                            style="border-color: rgba(${hexToRgb(currentStone.color)},0.45); color: ${currentStone.color};">
                            <i class="fas fa-gem"></i>
                        </div>
                        <div id="gs-current-name">${currentStone.name}</div>
                        <div id="gs-current-cost">${(function() {
                            var cm = gamble.gameState.cutMode || 'full';
                            var eff = getGambleEffectiveCost(currentStone, cm, false);
                            if (cm === 'window') return '开窗本刀 <span style="color:#d4a853;font-weight:700;">¥ ' + eff.toLocaleString() + '</span>（约半价）<span style="color:#6b6458;"> · 标价 ¥ ' + currentStone.cost.toLocaleString() + '</span> · ' + currentStone.quality + '档';
                            if (cm === 'rub') return '擦皮摸底 <span style="color:#7cb8d8;font-weight:700;">¥ ' + eff.toLocaleString() + '</span>（约18%）<span style="color:#6b6458;"> · 标价 ¥ ' + currentStone.cost.toLocaleString() + '</span> · 短刀程';
                            if (cm === 'half') return '半明料 <span style="color:#c9a86c;font-weight:700;">¥ ' + eff.toLocaleString() + '</span>（约75%）<span style="color:#6b6458;"> · 标价 ¥ ' + currentStone.cost.toLocaleString() + '</span> · 省刀程';
                            if (cm === 'line') return '引线切 <span style="color:#a78bfa;font-weight:700;">¥ ' + eff.toLocaleString() + '</span>（约32%）<span style="color:#6b6458;"> · 标价 ¥ ' + currentStone.cost.toLocaleString() + '</span> · 楔线探色';
                            return '全切本刀 <span style="color:#d4a853;font-weight:700;">¥ ' + currentStone.cost.toLocaleString() + '</span> · ' + currentStone.quality + '档';
                        })()}</div>
                        <div class="gs-prep-panel" id="gs-prep-panel">${getGamblePrepPanelInnerHtml(gamble, currentStone)}</div>
                        <div class="gs-style-row" id="gs-style-row">
                            <button type="button" class="gs-style-btn ${cutStyle === 'fast' ? 'on' : ''}" data-gs-style="fast" title="快刀">快刀<div style="font-size:0.65rem;opacity:.82;margin-top:3px;">胜率略↑ · 废料更碎</div></button>
                            <button type="button" class="gs-style-btn ${cutStyle === 'balanced' ? 'on' : ''}" data-gs-style="balanced" title="中庸">中庸<div style="font-size:0.65rem;opacity:.82;margin-top:3px;">无修正</div></button>
                            <button type="button" class="gs-style-btn ${cutStyle === 'slow' ? 'on' : ''}" data-gs-style="slow" title="慢刀">慢刀<div style="font-size:0.65rem;opacity:.82;margin-top:3px;">押头奖 · 胜率↓</div></button>
                        </div>
                        <div class="gs-mode-row" id="gs-mode-row">
                            <button type="button" class="gs-mode-btn ${(gamble.gameState.cutMode || 'full') === 'full' ? 'on' : ''}" data-gs-mode="full" title="全切">全切<div style="font-size:0.65rem;opacity:.82;margin-top:3px;">足额标价 · 刀程完整</div></button>
                            <button type="button" class="gs-mode-btn ${(gamble.gameState.cutMode || 'full') === 'window' ? 'on' : ''}" data-gs-mode="window" title="开窗">开窗<div style="font-size:0.65rem;opacity:.82;margin-top:3px;">约半价 · 进账减半</div></button>
                            <button type="button" class="gs-mode-btn ${(gamble.gameState.cutMode || 'full') === 'line' ? 'on' : ''}" data-gs-mode="line" title="引线切">引线<div style="font-size:0.65rem;opacity:.82;margin-top:3px;">~32%价 · 楔线探色 · 折中</div></button>
                            <button type="button" class="gs-mode-btn ${(gamble.gameState.cutMode || 'full') === 'rub' ? 'on' : ''}" data-gs-mode="rub" title="擦皮摸底">擦皮<div style="font-size:0.65rem;opacity:.82;margin-top:3px;">~18%价 · 短刀程 · 攒加成</div></button>
                            <button type="button" class="gs-mode-btn ${(gamble.gameState.cutMode || 'full') === 'half' ? 'on' : ''}" data-gs-mode="half" title="半明料">半明<div style="font-size:0.65rem;opacity:.82;margin-top:3px;">~75%价 · 省刀程 · 更稳</div></button>
                        </div>
                        <button type="button" class="gs-cut-btn" id="cut-btn" ${!gambleCanCutStone(currentStone) ? 'disabled' : ''}>
                            <i class="fas fa-cut"></i> ${gamble.userData.freeRecutStoneId === currentStone.id ? '裂隙 · 免费下刀' : '落槌下刀'}
                        </button>
                        <div id="result-display" class="gs-result"></div>
                    </section>
                </div>
                <aside class="gs-side">
                    <div class="gs-side-title">标单</div>
                    <div class="gs-stone-list">
                        ${gamble.stones.map(stone => `
                            <div class="gs-stone-item ${gamble.currentStoneId === stone.id ? 'selected' : ''}" data-id="${stone.id}"
                                 style="--stone-color: ${stone.color};">
                                ${gamble.userData.freeRecutStoneId === stone.id ? '<span class="free-recut-tag">免费</span>' : ''}
                                <div class="gs-si-top">
                                    <span class="gs-si-name">${stone.name}</span>
                                    <span class="gs-si-tier">${stone.quality}</span>
                                </div>
                                <div class="gs-si-cost">¥ ${stone.cost.toLocaleString()}</div>
                                <div class="gs-si-meta">
                                    <span>出料 ${(stone.winChance * 100).toFixed(1)}%</span>
                                    <span>头奖 ${(stone.jackpotChance * 100).toFixed(2)}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="gs-side-title" style="margin-top:14px">流水</div>
                    <div class="gs-hist" id="history-list">
                        ${renderHistoryList()}
                    </div>
                </aside>
            </div>
            <div class="gamble-notification" id="gamble-notification"></div>
        </div>
    `;
    
    // 初始化事件监听
    initGambleEventListeners();
    updateTransferLimits();
}
// 将十六进制颜色转为RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '150, 150, 150';
}

// 渲染历史记录
function renderHistoryList() {
    const gamble = player.gambleStone;
    const history = gamble.gameState.cutHistory.slice(-10).reverse(); // 只显示最近10条
    
    if (history.length === 0) {
        return '<div style="color:#6b6458;text-align:center;padding:16px;font-size:0.82rem;">暂无流水</div>';
    }
    
    return history.map(record => {
        const stone = gamble.stones.find(s => s.id === record.stoneId);
        const col = stone ? stone.color : '#8a7d6e';
        const nm = record.stoneName || (stone ? stone.name : '—');
        const resultClass = record.result > 0 ? 'win' : (record.result < 0 ? 'lose' : 'neutral');
        const resultSign = record.result >= 0 ? '+' : '';
        
        return `
            <div class="history-item" style="--history-color: ${col}">
                <div class="history-stone">${nm}</div>
                <div class="history-result ${resultClass}">
                    ${resultSign}¥ ${record.result.toLocaleString()}
                </div>
            </div>
        `;
    }).join('');
}

/** 本场料要跑几「程」：擦皮 + 若干刀 + 终裁（高档料刀程更长；开窗更短；±1 格抖动） */
function getGambleCutBeatCount(stone, cutMode) {
    const id = stone && stone.id != null ? stone.id : 1;
    var n;
    if (id <= 2) n = 5;
    else if (id <= 5) n = 6;
    else if (id <= 10) n = 7;
    else if (id <= 16) n = 8;
    else n = 9;
    if (cutMode === 'window') n = Math.max(3, n - 2);
    if (cutMode === 'line') n = Math.max(3, n - 2);
    if (cutMode === 'half') n = Math.max(3, n - 3);
    n += Math.floor(Math.random() * 3) - 1;
    if (cutMode === 'window') n = Math.max(3, n);
    else if (cutMode === 'half') n = Math.max(3, n);
    else n = Math.max(4, n);
    return n;
}

/** 档位：影响开场白、旁白密度（贴近公盘/戒面料等说法） */
function getGambleStoneTier(stone) {
    const id = stone && stone.id != null ? stone.id : 1;
    if (id <= 3) return 'entry';
    if (id <= 8) return 'mid';
    if (id <= 14) return 'high';
    return 'top';
}

function pickGamble(arr) {
    if (!arr || !arr.length) return '';
    return arr[Math.floor(Math.random() * arr.length)];
}

/** 图鉴：色（翡翠行话） */
var GAMBLE_CODEX_HUES = [
    { id: 'zhengyang', name: '正阳绿', hex: '#15803d' },
    { id: 'dizang', name: '帝王绿', hex: '#047857' },
    { id: 'bingyang', name: '冰阳绿', hex: '#34d399' },
    { id: 'apple', name: '苹果绿', hex: '#65a30d' },
    { id: 'qingshui', name: '晴水', hex: '#5eead4' },
    { id: 'youqing', name: '油青', hex: '#3f6212' },
    { id: 'huajing', name: '花青', hex: '#6b7280' },
    { id: 'piaohua', name: '飘花', hex: '#93c5fd' },
    { id: 'ziyan', name: '紫罗兰', hex: '#a855f7' },
    { id: 'chundai', name: '春带彩', hex: '#f472b6' },
    { id: 'mocui', name: '墨翠', hex: '#0f172a' },
    { id: 'huangfei', name: '黄翡', hex: '#eab308' },
    { id: 'hongwu', name: '红雾', hex: '#dc2626' },
    { id: 'qinghui', name: '青灰', hex: '#64748b' },
    { id: 'ganbai', name: '干白', hex: '#d6d3d1' },
    { id: 'songhua', name: '松花晕', hex: '#86efac' },
    { id: 'wusai', name: '乌色', hex: '#1e293b' },
    { id: 'paose', name: '跑色', hex: '#78716c' }
];
/** 图鉴：种水 */
var GAMBLE_CODEX_VARIETIES = [
    { id: 'boli', name: '玻璃种', hex: '#e0f2fe' },
    { id: 'gaobing', name: '高冰', hex: '#bae6fd' },
    { id: 'bing', name: '冰种', hex: '#93c5fd' },
    { id: 'nuogang', name: '糯刚', hex: '#a5b4fc' },
    { id: 'nuo', name: '糯种', hex: '#c4b5fd' },
    { id: 'xinu', name: '细糯', hex: '#ddd6fe' },
    { id: 'dou', name: '豆种', hex: '#a8a29e' },
    { id: 'youzhong', name: '油青种', hex: '#57534e' },
    { id: 'bainuo', name: '白糯', hex: '#f5f5f4' },
    { id: 'zhuantou', name: '砖头料', hex: '#78716c' },
    { id: 'shizhi', name: '石性重', hex: '#57534e' },
    { id: 'shacu', name: '砂粗种嫩', hex: '#a8a29e' },
    { id: 'pifuduan', name: '皮相水短', hex: '#94a3b8' },
    { id: 'wuxian', name: '雾线种', hex: '#cbd5e1' },
    { id: 'mianlao', name: '绵老', hex: '#9ca3af' },
    { id: 'xianzhong', name: '藓吃种', hex: '#44403c' }
];
/** 图鉴：件级 / 料性 */
var GAMBLE_CODEX_GRADES = [
    { id: 'zhenchang', name: '镇场级', hex: '#fbbf24' },
    { id: 'zhuowang', name: '镯王位', hex: '#f59e0b' },
    { id: 'manjie', name: '满色戒面级', hex: '#10b981' },
    { id: 'jie', name: '戒面级', hex: '#34d399' },
    { id: 'zhuo', name: '手镯胚', hex: '#6ee7b7' },
    { id: 'pai', name: '牌子料', hex: '#7dd3fc' },
    { id: 'gua', name: '挂件级', hex: '#93c5fd' },
    { id: 'bian', name: '边角件', hex: '#a8a29e' },
    { id: 'qingbao', name: '情报皮相', hex: '#7cb8d8' },
    { id: 'jizhuang', name: '记桩加成档', hex: '#c4b5fd' },
    { id: 'huishou', name: '公斤回购级', hex: '#78716c' },
    { id: 'feiliao', name: '废料颗粒', hex: '#57534e' },
    { id: 'gongyi', name: '工艺边角', hex: '#64748b' },
    { id: 'yuantu', name: '原石回囤', hex: '#94a3b8' }
];
function gambleCodexDefById(arr, id) {
    if (!id || !arr) return null;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) return arr[i];
    }
    return null;
}
function getGambleCodexTotalSlots() {
    return GAMBLE_CODEX_HUES.length + GAMBLE_CODEX_VARIETIES.length + GAMBLE_CODEX_GRADES.length;
}
function getGambleCodexUnlockedCount(codex) {
    if (!codex) return 0;
    const uh = Object.keys(codex.hues || {}).length;
    const uv = Object.keys(codex.varieties || {}).length;
    const ug = Object.keys(codex.grades || {}).length;
    return uh + uv + ug;
}
function getGambleCodexProgressPct(codex) {
    const t = getGambleCodexTotalSlots();
    if (t <= 0) return 0;
    return Math.min(100, Math.round((getGambleCodexUnlockedCount(codex) / t) * 1000) / 10);
}
/** 按本刀结果生成「色·种·件级」展示与图鉴键（不改变盈亏） */
function buildGambleYieldSpec(result, stone) {
    if (!result || !stone) return;
    const tier = getGambleStoneTier(stone);
    const mult = typeof result.multiplier === 'number' ? result.multiplier : 0;
    const rub = result.cutMode === 'rub' || result.isRubPeek;
    function pickHue(ids) { return gambleCodexDefById(GAMBLE_CODEX_HUES, pickGamble(ids)); }
    function pickVar(ids) { return gambleCodexDefById(GAMBLE_CODEX_VARIETIES, pickGamble(ids)); }
    function pickGr(ids) { return gambleCodexDefById(GAMBLE_CODEX_GRADES, pickGamble(ids)); }
    var hue, variety, grade;
    if (rub) {
        if (result.type === 'lose') {
            hue = pickHue(['qinghui', 'ganbai', 'paose', 'wusai', 'huajing']);
            variety = pickVar(['shizhi', 'zhuantou', 'shacu', 'pifuduan', 'xianzhong']);
            grade = pickGr(['feiliao', 'qingbao', 'huishou']);
        } else if (result.peekBuffJustGranted) {
            hue = pickHue(['songhua', 'bingyang', 'qingshui', 'huangfei']);
            variety = pickVar(['nuo', 'xinu', 'wuxian', 'pifuduan']);
            grade = pickGr(['jizhuang', 'qingbao', 'gua']);
        } else if (mult >= 1.15) {
            hue = pickHue(['bingyang', 'apple', 'songhua', 'qingshui', 'piaohua']);
            variety = pickVar(['nuogang', 'bing', 'gaobing', 'xinu']);
            grade = pickGr(['pai', 'gua', 'bian', 'qingbao']);
        } else {
            hue = pickHue(['youqing', 'huajing', 'qinghui', 'songhua']);
            variety = pickVar(['nuo', 'dou', 'youzhong', 'pifuduan']);
            grade = pickGr(['qingbao', 'gongyi', 'bian', 'yuantu']);
        }
        result.yieldSpec = { hue: hue, variety: variety, grade: grade, rub: true, tier: tier };
        return;
    }
    if (result.type === 'jackpot') {
        hue = pickHue(['dizang', 'zhengyang', 'bingyang', 'ziyan', 'chundai', 'mocui', 'hongwu']);
        if (tier === 'top' || tier === 'high') {
            variety = pickVar(['boli', 'gaobing', 'bing', 'nuogang']);
            grade = pickGr(['zhenchang', 'zhuowang', 'manjie']);
        } else {
            variety = pickVar(['gaobing', 'bing', 'nuogang', 'bing']);
            grade = pickGr(['zhuowang', 'manjie', 'jie']);
        }
    } else if (result.type === 'win') {
        if (mult >= 3.1) {
            hue = pickHue(['zhengyang', 'bingyang', 'apple', 'piaohua', 'qingshui']);
            variety = pickVar(['gaobing', 'bing', 'nuogang', 'boli']);
            grade = pickGr(['jie', 'zhuo', 'pai', 'manjie']);
        } else if (mult >= 2) {
            hue = pickHue(['bingyang', 'apple', 'qingshui', 'youqing', 'huangfei']);
            variety = pickVar(['bing', 'nuogang', 'nuo', 'xinu']);
            grade = pickGr(['pai', 'zhuo', 'jie', 'gua']);
        } else {
            hue = pickHue(['qingshui', 'youqing', 'huajing', 'piaohua', 'songhua', 'huangfei']);
            variety = pickVar(['nuo', 'xinu', 'dou', 'youzhong', 'bainuo']);
            grade = pickGr(['gua', 'bian', 'pai', 'yuantu']);
        }
    } else {
        hue = pickHue(['qinghui', 'ganbai', 'paose', 'huajing', 'wusai', 'youqing']);
        variety = pickVar(['zhuantou', 'shizhi', 'dou', 'mianlao', 'shacu']);
        if (mult <= 0.08) {
            grade = pickGr(['feiliao', 'huishou', 'gongyi']);
        } else {
            grade = pickGr(['bian', 'huishou', 'yuantu', 'gongyi']);
        }
    }
    result.yieldSpec = { hue: hue, variety: variety, grade: grade, rub: false, tier: tier };
}
function registerGambleCodexUnlocks(gamble, result, stone) {
    if (!gamble || !gamble.codex || !result || !result.yieldSpec) return;
    const y = result.yieldSpec;
    const c = gamble.codex;
    const firstNames = [];
    function bump(map, def, label) {
        if (!def || !def.id) return;
        const prev = map[def.id] || 0;
        map[def.id] = prev + 1;
        if (prev === 0) firstNames.push(label + '「' + def.name + '」');
    }
    bump(c.hues, y.hue, '色');
    bump(c.varieties, y.variety, '种');
    bump(c.grades, y.grade, '件级');
    if (stone && stone.id != null) {
        const sid = String(stone.id);
        c.stones[sid] = (c.stones[sid] || 0) + 1;
    }
    const md = result.cutMode || 'full';
    c.modes[md] = (c.modes[md] || 0) + 1;
    if (firstNames.length) {
        showGambleNotification('图鉴新录：' + firstNames.join(' · '), 'success');
    }
    refreshGambleCodexBar();
}
function getGambleCodexDrawerInnerHtml(gamble) {
    ensureGambleStoneExtras();
    const c = gamble.codex || { hues: {}, varieties: {}, grades: {}, stones: {}, modes: {} };
    const pct = getGambleCodexProgressPct(c);
    const mkChips = function (defs, unlockedMap) {
        return defs.map(function (d) {
            const n = unlockedMap[d.id] || 0;
            const on = n > 0;
            return '<span class="gs-cx-chip' + (on ? ' on' : '') + '" style="--cx:' + d.hex + '"><span class="gs-cx-dot"></span>' + d.name + (on ? '<small>×' + n + '</small>' : '') + '</span>';
        }).join('');
    };
    const modeTxt = ['full', 'window', 'rub', 'half'].map(function (m) {
        const lab = { full: '全切', window: '开窗', rub: '擦皮', half: '半明', line: '引线' };
        const n = c.modes[m] || 0;
        return '<span>' + (lab[m] || m) + ' <b>' + n + '</b> 刀</span>';
    }).join(' · ');
    return '<div class="gs-cx-head"><strong>料性图鉴</strong> <span class="gs-cx-pct">收集 ' + getGambleCodexUnlockedCount(c) + ' / ' + getGambleCodexTotalSlots() + '（' + pct + '%）</span></div>'
        + '<p class="gs-cx-sub">每刀结算随机生成色、种、件级；重复遇见会叠次数。标单档与倍率会影响高档货概率。</p>'
        + '<div class="gs-cx-sec"><span class="gs-cx-ttl">色</span><div class="gs-cx-grid">' + mkChips(GAMBLE_CODEX_HUES, c.hues) + '</div></div>'
        + '<div class="gs-cx-sec"><span class="gs-cx-ttl">种水</span><div class="gs-cx-grid">' + mkChips(GAMBLE_CODEX_VARIETIES, c.varieties) + '</div></div>'
        + '<div class="gs-cx-sec"><span class="gs-cx-ttl">件级</span><div class="gs-cx-grid">' + mkChips(GAMBLE_CODEX_GRADES, c.grades) + '</div></div>'
        + '<div class="gs-cx-foot">' + modeTxt + '</div>';
}
function refreshGambleCodexBar() {
    const el = document.getElementById('gs-codex-pct');
    const drawer = document.getElementById('gs-codex-drawer');
    if (!player.gambleStone || !player.gambleStone.codex) return;
    const pct = getGambleCodexProgressPct(player.gambleStone.codex);
    if (el) el.textContent = pct + '%';
    if (drawer && drawer.style.display !== 'none' && drawer.getAttribute('data-open') === '1') {
        drawer.innerHTML = getGambleCodexDrawerInnerHtml(player.gambleStone);
    }
}

function getGambleLocalDayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}
function syncGambleSessionDate(gamble) {
    if (!gamble || !gamble.gameState) return;
    const k = getGambleLocalDayKey();
    const s = gamble.gameState.session;
    if (!s || s.dayKey !== k) {
        gamble.gameState.session = { dayKey: k, cuts: 0, bestNet: 0, totalNet: 0 };
    }
}
/** 本日悬赏：按本地日重置；主刀=非擦皮的一刀（含免费全切） */
function ensureGambleDailyQuest(gamble) {
    if (!gamble || !gamble.gameState) return null;
    const k = getGambleLocalDayKey();
    var dq = gamble.gameState.dailyQuest;
    if (!dq || typeof dq !== 'object' || dq.dayKey !== k) {
        dq = {
            dayKey: k,
            mainCuts: 0,
            greens: 0,
            sawJackpot: false,
            claimed: { m1: false, m2: false, m3: false }
        };
        gamble.gameState.dailyQuest = dq;
    }
    return dq;
}
function processGambleDailyQuestAfterCut(gamble, result, opts) {
    const dq = ensureGambleDailyQuest(gamble);
    if (!dq) return;
    const isRub = opts && opts.isRubCut;
    if (!isRub) dq.mainCuts = (dq.mainCuts || 0) + 1;
    if (result && (result.type === 'win' || result.type === 'jackpot')) dq.greens = (dq.greens || 0) + 1;
    if (result && result.type === 'jackpot') dq.sawJackpot = true;
    const cl = dq.claimed || {};
    if (!cl.m1 && dq.mainCuts >= 6) {
        cl.m1 = true;
        gamble.userData.reputation = (gamble.userData.reputation || 0) + 65;
        showGambleNotification('本日悬赏①：主刀满 6 程 · 声望 +65', 'success');
    }
    if (!cl.m2 && dq.greens >= 3) {
        cl.m2 = true;
        const q0 = gamble.userData.qiPoints || 0;
        if (q0 < 12) {
            gamble.userData.qiPoints = q0 + 1;
            showGambleNotification('本日悬赏②：出绿满 3 次 · 气运点 +1', 'success');
        } else {
            gamble.userData.reputation = (gamble.userData.reputation || 0) + 120;
            showGambleNotification('本日悬赏②：气运已满 · 改赠声望 +120', 'success');
        }
    }
    if (!cl.m3 && (dq.sawJackpot || dq.mainCuts >= 15)) {
        cl.m3 = true;
        gamble.userData.reputation = (gamble.userData.reputation || 0) + 100;
        gamble.userData.eyeExp = (gamble.userData.eyeExp || 0) + 38;
        showGambleNotification('本日悬赏③：头奖或主刀 15 程 · 声望 +100 · 眼力 +38', 'success');
    }
    dq.claimed = cl;
}
function getGambleDailyQuestInnerHtml(gamble) {
    const dq = ensureGambleDailyQuest(gamble);
    if (!dq) return '';
    const cl = dq.claimed || {};
    const c1 = dq.mainCuts >= 6;
    const c2 = dq.greens >= 3;
    const c3 = dq.sawJackpot || dq.mainCuts >= 15;
    function row(done, claimed, progTxt, title, reward) {
        const st = claimed ? '已领' : done ? '达成' : '进行中';
        const col = claimed ? '#6b7588' : done ? '#5ecf9a' : '#a89b88';
        return '<div class="gs-dq-row" style="color:' + col + '"><span>' + title + '</span><span>' + progTxt + ' · ' + st + '</span><span style="opacity:.85">' + reward + '</span></div>';
    }
    const p3 = dq.sawJackpot ? '已见头奖' : (dq.mainCuts + '/15 主刀');
    return row(c1, cl.m1, dq.mainCuts + '/6 主刀', '① 主刀程数', '声望 +65')
        + row(c2, cl.m2, dq.greens + '/3 出绿', '② 出绿次数', '气运 +1（满则声望）')
        + row(c3, cl.m3, p3, '③ 硬指标', '声望 +100 · 眼力 +38');
}
/** 眼力等级（仅成长感，不改概率） */
function getGambleEyeRank(exp) {
    exp = Math.max(0, exp || 0);
    const tiers = [
        { min: 0, level: 1, title: '看热闹', next: 50 },
        { min: 50, level: 2, title: '搬货', next: 200 },
        { min: 200, level: 3, title: '跑货郎', next: 500 },
        { min: 500, level: 4, title: '掌眼学徒', next: 1200 },
        { min: 1200, level: 5, title: '标行伙计', next: 3000 },
        { min: 3000, level: 6, title: '掌眼', next: 8000 },
        { min: 8000, level: 7, title: '标行老手', next: 20000 },
        { min: 20000, level: 8, title: '镇场客', next: null }
    ];
    var cur = tiers[0];
    for (var i = 0; i < tiers.length; i++) {
        if (exp >= tiers[i].min) cur = tiers[i];
    }
    return { level: cur.level, title: cur.title, exp: exp, next: cur.next };
}
/** 临场结算卡：心跳、毛估分、电筒、工费话术、指数快照（纯沉浸 + 小额随机同行伸价在结算里处理） */
function buildGamblePresentCard(result, stone, gamble, stakePaid, isFreeCut, spotSnap) {
    const tier = getGambleStoneTier(stone);
    const mult = typeof result.multiplier === 'number' ? result.multiplier : 0;
    const bal = gamble.userData.balance || 0;
    const pressure = stakePaid / Math.max(stakePaid + bal + (result.amount || 0), 1);
    var pulse = 32 + Math.round(pressure * 38);
    if (tier === 'high' || tier === 'top') pulse += 10;
    if (tier === 'entry') pulse -= 6;
    pulse += Math.floor(Math.random() * 22);
    pulse = Math.max(12, Math.min(99, pulse));
    var appr = 40;
    if (result.type === 'jackpot') appr = 88 + Math.floor(Math.random() * 12);
    else if (result.type === 'win') appr = Math.min(94, 48 + Math.round(mult * 14) + Math.floor(Math.random() * 9));
    else appr = Math.max(3, Math.round(22 + mult * 35 + Math.random() * 12));
    const lights = [
        { k: '3000K', d: '暖黄' }, { k: '4000K', d: '中性白' }, { k: '5000K', d: '正白' }, { k: '6500K', d: '偏冷' }
    ];
    const L = pickGamble(lights);
    const wireBase = Math.max(88, Math.floor(stakePaid * (0.006 + Math.random() * 0.012)));
    const polish = Math.max(120, Math.floor(stone.cost * 0.004 * (0.8 + Math.random() * 0.4)));
    const wireLine = '线割/拆料 ¥' + wireBase.toLocaleString() + ' 起 · 抛光估价 ¥' + polish.toLocaleString() + '（起货后结算）';
    const tension = pulse >= 78 ? '心跳顶格' : pulse >= 55 ? '偏紧' : '尚可';
    const cert = 'YS-' + stone.id + '-' + String(Date.now()).slice(-6);
    const rub = result.cutMode === 'rub';
    const hook = rub
        ? pickGamble(['皮相情报：先看砂，再听价。', '短刀程：师傅不让上大锯。', '擦到位就收，别贪一口。'])
        : pickGamble(['公盘规矩：先落槌再吵价。', '起货前都是纸面，到手再扣棉裂。', '让桩价另议，这里只算刀口账。']);
    return {
        pulse: pulse,
        apprScore: appr,
        lightStr: L.k + ' · ' + L.d,
        wireLine: wireLine,
        tension: tension,
        certId: cert,
        spotSnap: typeof spotSnap === 'number' ? spotSnap.toFixed(1) : '100.0',
        hookLine: hook
    };
}

/** 单步等待：带人类节奏抖动（避免每格时间像定时器） */
function gambleJitterDelay(baseMs, styleMul) {
    styleMul = styleMul == null ? 1 : styleMul;
    var human = 0.72 + Math.random() * 0.56;
    return Math.max(260, Math.round(baseMs * styleMul * human));
}

/** 每一刀标题：更像现场喊法，略打乱顺序更不像模板 */
function getGambleMidCutTitle(index, totalMid) {
    var labels = ['开片', '见肉', '探裂', '跟色', '定型', '清粉', '抬眼', '楔一刀', '听响', '再找一刀'];
    var lab = labels[index % labels.length];
    if (Math.random() < 0.34 && index > 0) {
        lab = pickGamble(['跟一刀', '别停', '清出来再看', '换角', '压住别抖']);
    }
    return '第' + (index + 1) + '刀 · ' + lab;
}

function getGambleOpenPoolForTier(tier) {
    const ALL = [
        '先擦皮：蟒带勒在正中，打灯水短，赌的是内化不是皮相。',
        '皮壳老结翻砂有力，电筒一格一格扫——藓下有色花影子。',
        '砂刺手，顺纹找裂；对准色花走向，上锯，准备开第一刀。',
        '压灯走一圈：水头一般，但色根像要从缝里钻出来…',
        '松花点点散在皮上：像撒了把盐，真假要看进肉。',
        '癣喷在侧：行话「癣随绿走」，也可能癣吃干净。'
    ];
    const byTier = {
        entry: [
            '通货场口：公斤料气质，先找裂再找色，别指望一刀暴富。',
            '练手料：皮壳薄，灯一打就透——种嫩风险大。',
            '摊位料：老板喊「可赌内化」，先当故事听一半。'
        ],
        mid: [
            '半明料：已开一窗，价里含了期望值，剩下赌裂和色进深。',
            '花牌边料：色花爬在皮上，要看色根吃不吃进玉肉。',
            '对桩料：戒面方向已能估，赌的是棉和脏点。'
        ],
        high: [
            '公盘级：皮壳压手，翻砂如铁；这种料一刀下去，全场都停。',
            '手镯位已能圈：赌的是色匀不匀、裂穿不穿。',
            '高种水料：灯下水头长，赌内化——贵就贵在这几毫米。'
        ],
        top: [
            '标王口：皮壳上蟒带盘龙，这种料子讲「眼缘」也讲命。',
            '戒面级色根：一切一哆嗦，师傅手都在抖。',
            '馆藏口吹牛归吹牛，刀下去才是真公盘。'
        ]
    };
    return (byTier[tier] || []).concat(ALL);
}

/** 现场杂录：听声、喷水、换手电…纯氛围，不改变结果 */
function injectGambleFieldAsides(mainSteps, kind, mul) {
    const any = [
        '锯片喷水降温，水雾混着石粉呛人。',
        '师傅换窄片：说「这角度吃裂不吃色」。',
        '旁人递手电：白光、黄光各照一遍，嘴里念叨「见肉不见皮」。',
        '清粉：毛刷扫开切面，粉尘里藏着心跳。',
        '有人场外低声问：还能不能加一刀？师傅摆手。',
        '手机灯乱入，被喝止：别晃，眼看色根走向。',
        '师傅让徒弟递砂纸：「先别急着报数，把雾擦净。」',
        '有人小声背行话，背到一半卡壳，旁边人憋笑。',
        '风扇摇头晃过去，灯影跟着晃，全场齐声「别动风」。',
        '矿泉水瓶被踢倒，水流过脚边——有人说「财走水」，有人说「滑铁卢」。',
        '远处广播喊「清场倒计时」，师傅骂：催命呢。'
    ];
    const byKind = {
        lose: any.concat([
            '一声闷响，像敲在砖头上——心里先凉半截。',
            '切面起灰雾：行话叫「跑色」，色散了。',
            '裂像蜘蛛网爬开：再赌就是赌命。'
        ]),
        win: any.concat([
            '一声轻脆，围观有人「啧」了半声。',
            '切面反光不对：种老一档，灯一压更聚光。',
            '色根像钉子钉进肉里：这口稳了三分。'
        ]),
        jp: any.concat([
            '灯一压，荧光乱窜——有人往后退了半步。',
            '师傅不敢大声说话，怕惊了「色」。',
            '空气里像绷紧的弦：再一刀就是名场面。'
        ])
    };
    const pool = byKind[kind] || any;
    const out = [];
    let asideCount = 0;
    var asideCap = kind === 'slow' ? 4 : 3;
    var asideChance = kind === 'slow' ? 0.46 : 0.38;
    for (let i = 0; i < mainSteps.length; i++) {
        out.push(mainSteps[i]);
        if (i >= mainSteps.length - 1) break;
        if (asideCount >= asideCap) continue;
        if (Math.random() > asideChance) continue;
        asideCount++;
        const asideTitles = ['听声 · 杂录', '现场 · 换手电', '喷水 · 清粉', '围观 · 旁白', '划线 · 嘀咕', '手机收起来', '别跺脚'];
        out.push({
            title: pickGamble(asideTitles),
            text: pickGamble(pool),
            delayMs: gambleJitterDelay(380 + Math.random() * 260, mul),
            aside: true
        });
    }
    return out;
}

/** 主刀程：擦皮 → 数刀 → 终裁；forcedCutMode 用于免费刀强制走全切叙事 */
function buildGambleMainCutSteps(stone, result, gamble, forcedCutMode) {
    const style = gamble.gameState.cutStyle || 'balanced';
    const cutMode = forcedCutMode != null ? forcedCutMode : (gamble.gameState.cutMode || 'full');
    const mul = style === 'fast' ? 0.74 : style === 'slow' ? 1.26 : 1;
    const kind = result.type === 'jackpot' ? 'jp' : (result.type === 'win' ? 'win' : 'lose');
    const beats = getGambleCutBeatCount(stone, cutMode);
    const tier = getGambleStoneTier(stone);
    const OPEN = getGambleOpenPoolForTier(tier);
    const WINDOW_OPEN = [
        '先开小钱窗：皮上磨一方，只赌色进不进肉——行里叫「试胆」。',
        '擦窗：雾起雾落，先看种老种嫩，再谈全切。',
        '定位窗：照色根走向，大锯先不落，省一半胆钱。',
        '窗里闪一线活绿：够不够加钱全切，全看心跳。'
    ];
    const MID = {
        lose: [
            ['第一刀·顺纹开片：切面惨白，底张木讷，种嫩不立色。', '开片见白：颗粒粗、反光散，像新场口砖头料。', '顺纹下刀：皮壳欺骗性强，肉里没接住色。'],
            ['第二刀跟进：大裂横穿，色带被拦腰劈断。', '裂像刀切：色根在裂口处戛然而止。', '通天裂：从皮到心贯穿，神仙难救。'],
            ['第三刀见肉：灰雾卷棉，晶体颗粒粗亮刺眼。', '棉成团：吃色不吃种，抛光也救不回。', '黑癣入肉：脏点像墨点晕开。'],
            ['第四刀辨真伪：干僵占多半，癣吃玉，价难起。', '跑色：切面发乌，色花散了。', '空心声闷：沙眼化开，废料声脆。'],
            ['第五刀再探：龙到处只见裂，不见绿。', '色花在边：进不了镯位，只能做小件。', '底张发「生」：种嫩起货无刚性。'],
            ['第六刀收尾：师傅把锯提起——这口料认了。', '再切也是碎：同行摇头，散场。', '最后一眼：砖头气质坐实。']
        ],
        win: [
            ['第一刀·开片：细糯底泛青味，切面清爽，未见要命大裂。', '片下去声音脆：种老一分，心先稳一半。', '见肉细腻：颗粒匀，像糯米汤。'],
            ['第二刀：色根斜插入肉，阳绿探头，藓下有色。', '色随癣走：赌对了「癣下出高色」。', '阳绿成团：可做戒面方向。'],
            ['第三刀辨色：豆青转阳，团块成形，可做件。', '裂不挡色：行话「裂在边，色在心」。', '水头涨一寸：灯压更聚光。'],
            ['第四刀：棉化得开，种色开始相生。', '抛光面相已能估：起货不会难看。', '脏点可控：避一避能出件。'],
            ['第五刀跟色：师傅点头——这刀能交货。', '手镯位圈得到：前提是裂不穿。', '色匀：公盘好说话。'],
            ['第六刀：心里价往上抬了一档。', '起货前最后一眼：稳。', '同行递烟：问「让不让桩」。']
        ],
        jp: [
            ['第一刀·开片：一线阳绿扎眼，玻璃底泛荧光。', '爆色：色根粗得像指头，灯光下晃眼。', '刚性起：切面像镜子，不对劲的亮。'],
            ['第二刀：满色晕开，色根延伸未止。', '帝王相露头：再切就是名场面。', '团状绿翻滚：像要涌出来。'],
            ['第三刀：围观让开半步，怕挡财气。', '有人摸口袋：准备接电话筹钱。', '师傅不敢喘大气。'],
            ['第四刀：宝光内敛，有人倒吸气。', '荧光压不住：种水顶到顶。', '色阳：一眼公盘货。'],
            ['第五刀：再一刀定乾坤，全场安静。', '刀起刀落像慢动作。', '这种料，一辈子碰几回？'],
            ['第六刀：手都在抖——不是冷，是烫。', '报数之前，先沉默三秒。', '标场录音笔都举起来了。']
        ]
    };
    const FINAL = {
        lose: [
            '锯停。起货师傅摇头：认栽，废料回购价待估。',
            '终裁：只能走「公斤回购」或拆小件止损。',
            '报数出口，同行有人低声「收不收」——砍价开始。',
            '师傅把料推开：这口学费交得明明白白。'
        ],
        win: [
            '起报：种色就位，能出件——这一刀没白挨。',
            '终裁：可上公盘竞价，或当场有同行接盘。',
            '师傅拍灰：心里有底，起货能见到钱。',
            '报数落定：围观「嗯」了一声，算认可。'
        ],
        jp: [
            '师傅嗓子发紧报数：头奖料性坐实，标场都听见了。',
            '终裁：这种数要重复两遍，怕听错。',
            '有人当场问「让桩」——这就是现实。',
            '报完数，全场迟了半拍才出声。'
        ]
    };
    const steps = [];
    const bl = gamble.gameState.bladeLine || 'with';
    const blTail = bl === 'with' ? '落刀顺纹：先图心里稳。' : bl === 'against' ? '落刀逆楔：听响赌跳色。' : '落刀跟色带：咬住带进肉。';
    if (cutMode === 'half') {
        steps.push({
            title: Math.random() < 0.5 ? '半明验桩 · 已见一口' : '开窗料 · 再赌内化',
            text: pickGamble([
                '摊位上已开一小窗：赌的不是有没有色，是色进多深、裂穿不穿。',
                '半开口子料：价里吞了一半期望值，剩下看你要赌勇气还是赌手艺。',
                '师傅说「别全信窗」——窗里漂亮，锯下去可能见灾。',
                '对桩已能估个七八：再切一刀，赌的是手镯位圈不圈得到。'
            ]) + ' ' + blTail,
            delayMs: gambleJitterDelay(640 + Math.random() * 150, mul)
        });
    } else if (cutMode === 'window') {
        steps.push({
            title: Math.random() < 0.5 ? '开窗 · 擦窗定位' : '试胆窗 · 先磨一方',
            text: pickGamble(WINDOW_OPEN) + ' ' + blTail,
            delayMs: gambleJitterDelay(680 + Math.random() * 160, mul)
        });
    } else if (cutMode === 'line') {
        const LINE_OPEN = [
            '引线先楔一条浅线：不走满锯程，只赌色根有没有「活气」。',
            '行里叫「拉线」：像钓鱼，先试探深浅再决定要不要梭哈全切。',
            '刀口贴着蟒带走：不进镯位先见肉，省胆钱也省心跳。',
            '浅楔听声：脆得像有希望，闷得像在劝退。'
        ];
        steps.push({
            title: Math.random() < 0.5 ? '引线 · 浅楔定位' : '拉线 · 探色一口',
            text: pickGamble(LINE_OPEN) + ' ' + blTail,
            delayMs: gambleJitterDelay(700 + Math.random() * 170, mul)
        });
    } else {
        steps.push({
            title: Math.random() < 0.5 ? '擦皮 · 压灯 · 划线' : '上锯前 · 再压一圈灯',
            text: pickGamble(OPEN) + ' ' + blTail,
            delayMs: gambleJitterDelay(720 + Math.random() * 180, mul)
        });
    }
    const midCount = Math.max(0, beats - 2);
    const matrix = MID[kind];
    for (let i = 0; i < midCount; i++) {
        const variants = matrix[Math.min(i, matrix.length - 1)];
        steps.push({
            title: getGambleMidCutTitle(i, midCount),
            text: pickGamble(variants),
            delayMs: gambleJitterDelay(740 + i * 48 + Math.random() * 180, mul)
        });
    }
    steps.push({
        title: Math.random() < 0.55 ? '终裁 · 起货报数' : '落锤前 · 最后一眼',
        text: pickGamble(FINAL[kind]),
        delayMs: gambleJitterDelay(820 + Math.random() * 220, mul)
    });
    return steps;
}

/**
 * 叙事摆动：同一结果里插入一两下「反着来的现场感」——跨前先空欢喜一下，出绿前先吓半死，头奖前先不敢信。
 * 不改变结算，只改变刀程读起来像不像真人现场。
 */
function applyGambleNarrativeSwings(steps, stone, result, gamble) {
    const kind = result.type === 'jackpot' ? 'jp' : (result.type === 'win' ? 'win' : 'lose');
    const tier = getGambleStoneTier(stone);
    const style = gamble.gameState.cutStyle || 'balanced';
    const mul = style === 'fast' ? 0.74 : style === 'slow' ? 1.26 : 1;
    if (steps.length < 4) return steps;

    const LOSE_SWING = [
        '灯下一晃像绿……师傅凑近：「雾线，别高兴早。」',
        '切面泛青，围观哦了一声——清粉一看，是种嫩发灰。',
        '色花像在爬，第二眼发现是藓：心里咯噔一下。',
        '手电换黄光：刚才那道「绿」淡了——多半是皮相骗眼。',
        '有人已经掏手机了，师傅喝止：「先清粉，别急着发朋友圈。」'
    ];
    const WIN_SWING = [
        '裂声不对，师傅停锯三秒：好在是皮裂，心没裂。',
        '第一刀灰扑扑，心里凉半截；再跟一刀，色从缝里拱出来。',
        '棉团冒出来，旁人叹气——再擦半指，棉化了，色点头了。',
        '边角崩了一点，师傅骂了句粗话，下一片却见阳绿探头。',
        '水一喷，颜色「活」了一下：这才是玉肉，不是皮壳演戏。'
    ];
    const JP_SWING = [
        '全场先安静——太亮了，反而不敢信。',
        '有人喊「别嚷」：光一散，色就跑了；师傅手都在抖。',
        '灯一压，荧光乱窜，后排有人往后退了半步。',
        '这种亮不对……像把太阳塞进一条缝里。',
        '师傅不敢大声，只点头：「再看一眼，别眨眼。」'
    ];

    const out = steps.slice();
    const lo = 1;
    const hi = out.length - 2;
    if (hi < lo) return out;
    var insertAt = lo + Math.floor(Math.random() * (hi - lo + 1));

    var swingTitle = '再压灯 · 心里一紧';
    var swingText = pickGamble(WIN_SWING);
    var swingDelay = gambleJitterDelay(880 + Math.random() * 420, mul);
    if (kind === 'lose') {
        swingTitle = '再压灯 · 空欢喜';
        swingText = pickGamble(LOSE_SWING);
        swingDelay = gambleJitterDelay(900 + Math.random() * 380, mul);
    } else if (kind === 'jp') {
        swingTitle = '屏息 · 不敢喊';
        swingText = pickGamble(JP_SWING);
        swingDelay = gambleJitterDelay(1020 + Math.random() * 520, mul);
    }

    out.splice(insertAt, 0, {
        title: swingTitle,
        text: swingText,
        delayMs: swingDelay,
        swing: true
    });

    if ((tier === 'high' || tier === 'top') && out.length >= 7 && Math.random() < 0.42) {
        var insertAt2 = Math.min(out.length - 2, insertAt + 2 + Math.floor(Math.random() * 2));
        var beat2 = kind === 'lose'
            ? { title: '问一句 · 还能不能加', text: '同行试探：再擦半指？师傅摇头：「再擦也是学费，别给庄家送戏。」', delayMs: gambleJitterDelay(560 + Math.random() * 240, mul) }
            : { title: '场务扫水 · 扬尘落下', text: '水雾一落，颜色反而更真——有人低声骂了句好听。', delayMs: gambleJitterDelay(480 + Math.random() * 220, mul) };
        beat2.swing = true;
        out.splice(insertAt2, 0, beat2);
    }

    return out;
}

/** 按料性走向生成完整刀程（含现场杂录） */
function buildGambleCutSequence(stone, result, gamble, forcedCutMode) {
    const style = gamble.gameState.cutStyle || 'balanced';
    const mul = style === 'fast' ? 0.74 : style === 'slow' ? 1.26 : 1;
    const kind = result.type === 'jackpot' ? 'jp' : (result.type === 'win' ? 'win' : 'lose');
    const main = buildGambleMainCutSteps(stone, result, gamble, forcedCutMode);
    const swung = applyGambleNarrativeSwings(main, stone, result, gamble);
    return injectGambleFieldAsides(swung, kind, mul);
}

function setGambleStoneCutDepth(stoneEl, depthIdx) {
    if (!stoneEl) return;
    for (let d = 0; d <= 10; d++) stoneEl.classList.remove('cut-depth-' + d);
    stoneEl.classList.add('cut-depth-' + Math.min(Math.max(0, depthIdx), 8));
}

function finalizeGambleCutSession(stone, result, isFreeCut, cutBtn, stoneDisplay, resultDisplay, stakePaid) {
    const gamble = player.gambleStone;
    var stake = typeof stakePaid === 'number' ? stakePaid : stone.cost;
    const pend = gamble.gameState._pendingOpts || {};
    delete gamble.gameState._pendingOpts;
    const snapSpot = typeof gamble.gameState.spotIndex === 'number' ? gamble.gameState.spotIndex : 100;
    buildGambleYieldSpec(result, stone);
    result.presentCard = buildGamblePresentCard(result, stone, gamble, stake, isFreeCut, snapSpot);
    updateUserAfterCut(result, stone, { isFreeCut: isFreeCut, stakePaid: stake, useQi: !!pend.useQi, isRubCut: result.cutMode === 'rub' });
    showCutResult(result, stone);
    gamble.gameState.isCutting = false;
    const root = document.querySelector('.gamble-stone.gs-root');
    if (root) root.classList.remove('gamble-seq-lock');
    if (stoneDisplay) {
        stoneDisplay.classList.remove('cutting');
        setGambleStoneCutDepth(stoneDisplay, 0);
    }
    if (cutBtn) {
        const canCut = gambleCanCutStone(stone);
        cutBtn.disabled = !canCut;
        cutBtn.innerHTML = '<i class="fas fa-cut"></i> ' + (gamble.userData.freeRecutStoneId === stone.id ? '裂隙 · 免费下刀' : '落槌下刀');
    }
    if ((result.type === 'win' || result.type === 'jackpot') && result.amount > 0 && cutBtn && result.cutMode !== 'rub') {
        offerDoubleOrNothing(stone, result, cutBtn);
    }
    saveGame();
}

/** 擦皮摸底：低价短流程，偏情报与小回口，并可能给下一刀「记桩加成」 */
function calculateRubPeekResult(stone, gamble, stakePaid) {
    const r = Math.random();
    const modeTag = ' · 擦皮摸底';
    if (r < 0.26) {
        return {
            type: 'win',
            amount: stakePaid * (1.05 + Math.random() * 1.45),
            multiplier: 1.2 + Math.random() * 0.8,
            cutMode: 'rub',
            message: '🔎 松花透水、砂刺顺口 — 像能内化一口' + modeTag,
            isRubPeek: true
        };
    }
    if (r < 0.58) {
        return {
            type: 'win',
            amount: stakePaid * (0.28 + Math.random() * 0.48),
            multiplier: 0.55,
            cutMode: 'rub',
            message: '🔦 压灯两圈：水短但不死，先当情报钱' + modeTag,
            isRubPeek: true
        };
    }
    if (r < 0.82) {
        gamble.gameState.peekBuff = { stoneId: stone.id, winAdd: 0.052, jpAdd: 0.013 };
        return {
            type: 'win',
            amount: stakePaid * (0.1 + Math.random() * 0.22),
            multiplier: 0.2,
            cutMode: 'rub',
            message: '📌 皮上磨出一指宽：走向记死了！全切/半明/开窗下刀略加成' + modeTag,
            isRubPeek: true,
            peekBuffJustGranted: true
        };
    }
    return {
        type: 'lose',
        amount: stakePaid * (0.07 + Math.random() * 0.16),
        multiplier: 0.12,
        cutMode: 'rub',
        message: '🌫️ 砂发干、颗粒跳手 — 这口情报只值回点工费' + modeTag,
        isRubPeek: true
    };
}

function buildGambleRubPeekSequence(stone, result) {
    const mul = 0.82;
    const OPEN = [
        '拇指顶住皮壳顺一摸：砂立不立，先听这一步。',
        '窄锉先走一圈：不让大料吃锯，只赌「皮相露不露馅」。',
        '师傅把水珠弹在皮上：雾起雾散，眼睛比灯诚实。'
    ];
    const MID = result.type === 'lose'
        ? ['清粉：雾薄得像假——心里先矮半截。', '换角度压灯：刚才那点「青」更像返光。']
        : ['再擦半寸：色根像要从缝里探头。', '围观有人问「还让不让擦」——师傅不回话。'];
    const FIN = result.type === 'lose'
        ? ['收锉：这口擦到现在就够了，再擦就是给摊位送戏。']
        : ['收刀：情报到此为止，再大锯落不落你说了算。'];
    return [
        { title: '擦皮 · 听砂', text: pickGamble(OPEN), delayMs: gambleJitterDelay(400, mul) },
        { title: '对灯 · 过眼', text: pickGamble(MID), delayMs: gambleJitterDelay(430, mul) },
        { title: '定局 · 心里记账', text: pickGamble(FIN), delayMs: gambleJitterDelay(460, mul) }
    ];
}

// 切割石头的主要函数（一刀一刀割 → 终裁报数）
function cutStone() {
    ensureGambleStoneExtras();
    const gamble = player.gambleStone;
    const stone = gamble.stones.find(s => s.id === gamble.currentStoneId);
    if (!stone) {
        showGambleNotification('标单数据异常，请重新打开赌石界面', 'error');
        return;
    }
    ensureGambleActiveProfile(gamble, stone);
    const isFreeCut = gamble.userData.freeRecutStoneId === stone.id;
    const cutMode = isFreeCut ? 'full' : (gamble.gameState.cutMode || 'full');
    const stakePaid = getGambleEffectiveCost(stone, cutMode, isFreeCut);
    if (!isFreeCut && gamble.userData.balance < stakePaid) {
        showGambleNotification('余额不足！', 'error');
        return;
    }
    if (isFreeCut) {
        gamble.userData.freeRecutStoneId = null;
        gamble.gameState.spendQiNextCut = false;
        const sq = document.getElementById('gs-spend-qi');
        if (sq) sq.checked = false;
        showGambleNotification('裂隙显灵：本刀免费！', 'info');
    }

    var useQi = false;
    const isRubCut = cutMode === 'rub';
    if (!isFreeCut && !isRubCut && gamble.gameState.spendQiNextCut) {
        if ((gamble.userData.qiPoints || 0) < 1) {
            showGambleNotification('气运点不足，已取消气运护刀', 'error');
            gamble.gameState.spendQiNextCut = false;
            const sq = document.getElementById('gs-spend-qi');
            if (sq) sq.checked = false;
            return;
        }
        useQi = true;
        gamble.userData.qiPoints--;
        gamble.gameState.spendQiNextCut = false;
        const sq = document.getElementById('gs-spend-qi');
        if (sq) sq.checked = false;
        showGambleNotification('气运护刀：本刀概率微调', 'info');
    }
    gamble.gameState._pendingOpts = { useQi: useQi };
    
    gamble.gameState.isCutting = true;
    
    if (!isFreeCut) {
        gamble.userData.balance -= stakePaid;
        gamble.userData.totalBet += stakePaid;
    }
    
    const wasFeverCut = !!gamble.gameState.nextCutFever;
    var result;
    var steps;
    if (isRubCut) {
        result = calculateRubPeekResult(stone, gamble, stakePaid);
        steps = buildGambleRubPeekSequence(stone, result);
    } else {
        result = calculateStoneResult(stone, gamble, cutMode, useQi);
        steps = buildGambleCutSequence(stone, result, gamble, cutMode);
    }
    
    const cutBtn = document.getElementById('cut-btn');
    const stoneDisplay = document.getElementById('stone-display');
    const resultDisplay = document.getElementById('result-display');
    const root = document.querySelector('.gamble-stone.gs-root');
    if (root) root.classList.add('gamble-seq-lock');
    
    cutBtn.disabled = true;
    cutBtn.innerHTML = '<i class="fas fa-cut"></i> 准备下刀…';
    stoneDisplay.classList.add('cutting');
    setGambleStoneCutDepth(stoneDisplay, 0);
    
    resultDisplay.style.display = 'block';
    resultDisplay.className = 'gs-result gs-result-cutting';
    const cs = gamble.gameState.cutStyle || 'balanced';
    const styleBar = cs === 'fast' ? '快刀 · 片薄求快' : cs === 'slow' ? '慢刀 · 磨色押头奖' : '中庸 · 稳片';
    const batchNo = (Date.now() % 90000) + 10000;
    const tapeId = 'S' + stone.id + '-' + String(1000 + (batchNo % 899)).slice(-3);
    const misR = Math.round(gamble.userData.misfortune || 0);
    const heatHint = isRubCut ? '擦皮摸底 · 不耗狂热' : (wasFeverCut ? '本刀：狂热一刀（已计入概率）' : '狂热条 · 起货后结算');
    const prof = gamble.gameState.activeProfile;
    const venu = prof && prof.stoneId === stone.id ? prof.venue : '—';
    const bdl = ({ with: '顺纹', against: '逆楔', band: '跟色带' })[gamble.gameState.bladeLine || 'with'];
    const wdefCut = getActiveGambleWind(gamble);
    var crowdExtra = '';
    if (!isRubCut) {
        if (Math.random() < 0.175) crowdExtra = getGambleCrowdAsideLine();
        else if (wdefCut && Math.random() < 0.09) {
            const windAside = {
                zoushui: '走水场：围观都压着嗓子，怕把运气喊跑。',
                chaochang: '炒场：有人跟着灯影晃头，像在蹦迪。',
                menbao: '闷包口：赢了也没人敢嚷，怕惊庄。',
                jianlou: '捡漏日：大妈问能不能按斤称，摊主脸都绿了。',
                gongpan: '公盘夜：摄影师蹲低点，说怕挡「贵气镜头」。',
                sanpai: '散客盈门：有人第一次来，问能不能先试切虚拟石。',
                yuye: '雨夜：雨衣滴水落在料上，有人说这是「加戏」。',
                shifu: '顶班师傅手有点抖：小声说原师傅去挂急诊了。',
                hongbao: '红包口：有人真掏红包往石头上放，被笑着拿走。',
                dama: '大妈扫货：隔壁摊位在喊「最后三块」像在卖葱。',
                zaoshi: '早市清仓：摊主一边擦汗一边喊「再让最后五块」。',
                zhibo: '直播带货：灯架挡视线，师傅让你别看弹幕看切面。',
                fengkuang: '矿区封路：行里传高档料要捂一捂，谁先喊价谁像托。',
                yemen: '夜场关门：扫地声一起，晦气像也被扫走半截。'
            };
            crowdExtra = windAside[wdefCut.id] || getGambleCrowdAsideLine();
        }
    }
    const panelHd = isRubCut ? pickGamble([
        '手锉嚓嚓 · 先别上大锯',
        '皮壳现场 · 听砂比听故事真',
        '小擦三口 · 心里先有底'
    ]) : pickGamble([
        '现场切料 · 锯片没停少说话',
        '刀程回放 · 粉还没落心先悬',
        '上锯记录 · 谁喊价谁心跳',
        '切料中 · 别看手机看切面'
    ]);
    resultDisplay.innerHTML = `
        <div class="gs-cut-panel-hd">${panelHd}</div>
        <div class="gs-cut-meta-bar">
            <span>标的：${stone.name}（${stone.quality}）</span>
            <span>策略：${styleBar}</span>
            <span>落刀：${bdl}</span>
            <span>场口：${venu}</span>
            <span>留档 ${tapeId}</span>
            <span>晦气 ${misR}/100</span>
            <span>${heatHint}</span>
            ${crowdExtra ? '<span class="gs-crowd-aside">' + crowdExtra + '</span>' : ''}
        </div>
        <div class="gs-cut-progress"><i id="gs-cut-progress-fill"></i></div>
        <div id="gs-cut-log"></div>
    `;
    
    const logEl = document.getElementById('gs-cut-log');
    const progFill = document.getElementById('gs-cut-progress-fill');
    let si = 0;
    
    function appendStep() {
        if (si >= steps.length) {
            finalizeGambleCutSession(stone, result, isFreeCut, cutBtn, stoneDisplay, resultDisplay, stakePaid);
            return;
        }
        const st = steps[si];
        const row = document.createElement('div');
        row.className = 'gs-cut-log-line' + (st.aside ? ' gs-cut-aside' : '') + (st.swing ? ' gs-cut-swing' : '');
        row.innerHTML = '<div class="gs-cut-line-title">' + st.title + '</div><div class="gs-cut-line-txt">' + st.text + '</div>';
        logEl.appendChild(row);
        row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        cutBtn.innerHTML = '<i class="fas fa-cut"></i> 切刀中 ' + (si + 1) + '/' + steps.length;
        setGambleStoneCutDepth(stoneDisplay, si + 1);
        if (progFill) {
            var t = (si + 1) / steps.length;
            var ease = 1 - Math.pow(1 - t, 1.18);
            progFill.style.width = Math.min(100, ease * 100) + '%';
        }
        var delay = st.delayMs || 720;
        delay = delay * (0.78 + Math.random() * 0.44);
        if (st.swing) delay *= 1.05 + Math.random() * 0.14;
        if (st.aside) delay *= 0.85 + Math.random() * 0.2;
        var ttl = st.title ? String(st.title) : '';
        if (ttl.indexOf('终裁') >= 0 || ttl.indexOf('落锤') >= 0) delay *= 1.16 + Math.random() * 0.26;
        delay = Math.max(240, Math.round(delay));
        si++;
        setTimeout(appendStep, delay);
    }
    appendStep();
}

// 计算结果：晦气压制、切开策略、狂热一刀、本场风向、气运护刀；开窗/半明结算倍率不同；擦皮走单独函数
function calculateStoneResult(stone, gamble, cutMode, useQi) {
    cutMode = cutMode || gamble.gameState.cutMode || 'full';
    let payoutScale = 1;
    if (cutMode === 'window') payoutScale = 0.5;
    else if (cutMode === 'half') payoutScale = 0.84;
    else if (cutMode === 'line') payoutScale = 0.62;
    const modeTag = cutMode === 'window' ? ' · 开窗' : (cutMode === 'half' ? ' · 半明料' : (cutMode === 'line' ? ' · 引线切' : ' · 全切'));
    const random = Math.random();
    const style = gamble.gameState.cutStyle || 'balanced';
    const luckyBonus = Math.min(0.04, (Math.min(5, gamble.userData.luckyLevel || 1) - 1) * 0.014);
    let feverJp = 0;
    let feverWin = 0;
    let feverTag = '';
    if (gamble.gameState.nextCutFever) {
        gamble.gameState.nextCutFever = false;
        feverJp = 0.012;
        feverWin = 0.042;
        feverTag = '（狂热一刀）';
    }
    let winCh = stone.winChance;
    let jpCh = stone.jackpotChance;
    let loseCap = cutMode === 'half' ? 0.29 : (cutMode === 'line' ? 0.275 : 0.32);
    let styleNote = '';
    if (cutMode === 'half') {
        winCh += 0.048;
        jpCh += 0.004;
    } else if (cutMode === 'line') {
        winCh += 0.028;
        jpCh += 0.0012;
    }
    const pb = gamble.gameState.peekBuff;
    if (pb && pb.stoneId === stone.id && (cutMode === 'full' || cutMode === 'window' || cutMode === 'half' || cutMode === 'line')) {
        winCh += (pb.winAdd || 0);
        jpCh += (pb.jpAdd || 0);
        gamble.gameState.peekBuff = null;
        styleNote = (styleNote ? styleNote : '') + '『擦皮记桩』';
    }
    const mentorB = gamble.gameState.mentorBuff;
    if (mentorB && mentorB.stoneId === stone.id && (cutMode === 'full' || cutMode === 'window' || cutMode === 'half' || cutMode === 'line')) {
        winCh += (mentorB.winAdd || 0);
        jpCh += (mentorB.jpAdd || 0);
        gamble.gameState.mentorBuff = null;
        styleNote = (styleNote ? styleNote : '') + '『老师傅耳语』';
    }
    const apprB = gamble.gameState.appraisalBuff;
    if (apprB && apprB.stoneId === stone.id && (cutMode === 'full' || cutMode === 'window' || cutMode === 'half' || cutMode === 'line')) {
        winCh += (apprB.winAdd || 0);
        jpCh += (apprB.jpAdd || 0);
        gamble.gameState.appraisalBuff = null;
        styleNote = (styleNote ? styleNote : '') + '『娱乐鉴定书』';
    }
    const aucB = gamble.gameState.auctionBid;
    if (aucB && aucB.stoneId === stone.id && (!aucB.until || Date.now() <= aucB.until) && (cutMode === 'full' || cutMode === 'window' || cutMode === 'half' || cutMode === 'line')) {
        winCh += (aucB.winAdd || 0);
        jpCh += (aucB.jpAdd || 0);
        gamble.gameState.auctionBid = null;
        styleNote = (styleNote ? styleNote : '') + '『公盘举牌』';
    }
    const bladePos = gamble.gameState.bladeLine || 'with';
    if (cutMode === 'full' || cutMode === 'window' || cutMode === 'half' || cutMode === 'line') {
        if (bladePos === 'with') winCh += 0.009;
        else if (bladePos === 'against') {
            winCh -= 0.007;
            jpCh += 0.014;
        } else if (bladePos === 'band') {
            winCh += 0.016;
            jpCh = Math.max(0.0005, jpCh - 0.002);
        }
    }
    if (style === 'fast') {
        winCh += 0.011;
        jpCh = Math.max(0.0005, jpCh - 0.001);
        loseCap = 0.24;
        styleNote += '『快刀』';
    } else if (style === 'slow') {
        winCh = Math.max(0.02, winCh - 0.024);
        jpCh += 0.0042;
        loseCap = 0.44;
        styleNote += '『慢刀』';
    }
    const wind = getActiveGambleWind(gamble);
    if (wind) {
        if (wind.winMul) winCh *= wind.winMul;
        if (wind.jpMul) jpCh *= wind.jpMul;
        if (wind.loseCapMul) loseCap *= wind.loseCapMul;
        if (wind.tierMin && stone.id >= wind.tierMin && wind.highWinMul) winCh *= wind.highWinMul;
    }
    if (useQi) {
        winCh += 0.012;
        jpCh += 0.0025;
    }
    const mis = Math.min(100, gamble.userData.misfortune || 0);
    const misScale = Math.max(0.74, 1 - mis * 0.0026);
    winCh *= misScale;
    jpCh *= misScale;
    
    const jpTh = jpCh + luckyBonus + feverJp;
    const winTh = jpTh + winCh + feverWin;
    const windTag = wind ? ' · ' + wind.name : '';
    const qiTag = useQi ? ' · 气运护刀' : '';
    const flavor = windTag + qiTag;
    
    if (random < jpTh) {
        let jackpotMultiplier = 4.2 + Math.random() * 8.8;
        if (style === 'slow') jackpotMultiplier *= 1.11;
        return {
            type: 'jackpot',
            amount: stone.cost * jackpotMultiplier * payoutScale,
            multiplier: jackpotMultiplier,
            cutMode: cutMode,
            message: '🎉 绝世珍宝！' + styleNote + feverTag + modeTag + flavor
        };
    } else if (random < winTh) {
        let winMultiplier = 1.32 + Math.random() * 2.05;
        if (style === 'slow') winMultiplier *= 1.12;
        return {
            type: 'win',
            amount: stone.cost * winMultiplier * payoutScale,
            multiplier: winMultiplier,
            cutMode: cutMode,
            message: '🎊 出好料！' + styleNote + feverTag + modeTag + flavor
        };
    } else {
        const loseMultiplier = Math.random() * loseCap;
        return {
            type: 'lose',
            amount: stone.cost * loseMultiplier * payoutScale,
            multiplier: loseMultiplier,
            cutMode: cutMode,
            message: '😢 空包…' + styleNote + feverTag + modeTag + flavor
        };
    }
}

/** 盈利后再赌：50% 本轮盈利翻倍，50% 本轮盈利没收 */
function offerDoubleOrNothing(stone, result, cutBtn) {
    const gamble = player.gambleStone;
    const payout = result.amount;
    const resultDisplay = document.getElementById('result-display');
    if (!resultDisplay || payout <= 0) return;
    
    cutBtn.disabled = true;
    const box = document.createElement('div');
    box.className = 'double-or-nothing-box';
    box.innerHTML = `
        <p><strong>加码剖料</strong>：再赌本轮已入账盈利 <span style="color:#fbbf24">¥ ${payout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span><br>
        约 40% 翻倍 · 约 60% 全部没收（庄家略优）</p>
        <div class="double-or-nothing-btns">
            <button type="button" class="double-btn-yes" id="gamble-double-yes">再剖一刀（赌）</button>
            <button type="button" class="double-btn-no" id="gamble-double-no">落袋为安</button>
        </div>
    `;
    resultDisplay.appendChild(box);
    
    const finish = () => {
        box.remove();
        updateGambleStatsDisplay();
        updateGambleFreeRecutUi();
        saveGame();
    };
    
    box.querySelector('#gamble-double-no').addEventListener('click', finish);
    box.querySelector('#gamble-double-yes').addEventListener('click', () => {
        const win = Math.random() < 0.40;
        if (win) {
            gamble.userData.balance += payout;
            gamble.userData.totalWon += payout;
            showGambleNotification('剖料赌赢了！盈利翻倍入账', 'success');
            gamble.gameState.cutHistory.push({
                stoneId: stone.id,
                stoneName: stone.name + '·加码',
                cost: 0,
                result: payout,
                type: 'doubleWin',
                time: Date.now()
            });
        } else {
            gamble.userData.balance -= payout;
            gamble.userData.totalWon -= payout;
            showGambleNotification('裂纹炸开…本轮盈利全没了', 'error');
            gamble.gameState.cutHistory.push({
                stoneId: stone.id,
                stoneName: stone.name + '·加码爆',
                cost: 0,
                result: -payout,
                type: 'doubleLose',
                time: Date.now()
            });
        }
        while (gamble.gameState.cutHistory.length > 10) gamble.gameState.cutHistory.shift();
        updateHistoryList();
        finish();
    });
}

/** 结算页「现实向」旁白：公盘、让桩、工费、废料等 */
function getGambleResultFieldNote(result, stone) {
    const tier = getGambleStoneTier(stone);
    var pool = [];
    if (result.type === 'jackpot') {
        pool = [
            '现实向：头奖料多走密封投标或熟人让桩，落锤价只是故事开头。',
            '高货要谈保险、押运与扣点，到手价别按账面想当然。',
            '师傅报数后，常还有「二次议价」——这里已替你折进盈亏。',
            '趣闻：有人头奖当晚请客，第二天发现税单比酒席还厚。',
            '老话：这种数报出来，先别发朋友圈——同行比点赞先到。'
        ];
    } else if (result.type === 'win') {
        if (tier === 'entry' || tier === 'mid') {
            pool = [
                '现实向：小涨常回笼给同行，现金流比账面漂亮。',
                '起货还要扣工费、抛光与棉脏损耗，别当毛利等于净利。',
                '段子：小涨也算赢，至少今晚加鸡腿不用看老婆脸色。'
            ];
        } else {
            pool = [
                '现实向：好料先问桩价再决定上公盘，价从口出不算落袋。',
                '戒面/手镯位定型后，仍可能因细裂跌档。',
                '行话：这时候别飘，下一刀可能教你做人——见好就收是本事。'
            ];
        }
    } else {
        pool = [
            '现实向：切跨先想止损，能拆戒面、牌子已是回血。',
            '公斤回购专收「砖头料」，价比你心里底价还狠。',
            '裂穿色带时，神仙难救手镯位——只能改做小件。',
            '安慰：学费交足也是资历，下次吹牛有素材。',
            '黑色幽默：这刀切完，摊主默默把「镇摊之宝」牌子撤了。'
        ];
    }
    if (result.salvageAmount > 0) {
        pool.push('废料回购按公斤/议价，随行就市，别跟中标硬比。');
    }
    return pickGamble(pool);
}

/** 低概率：结算后一条场边短句（不占刀程，纯氛围） */
function rollGamblePostCutAmbientToast(gamble, result, stone) {
    if (!gamble || Math.random() > 0.031) return;
    const t = result.type;
    const msg = t === 'jackpot'
        ? pickGamble([
            '场记：有人已经打开通讯录找「能接盘的大哥」。',
            '耳语：庄家往你这边多看了两眼——记得低调离场。',
            '花絮：小孩问「是不是发财了」，你还没想好怎么答。'
        ])
        : t === 'win'
            ? pickGamble([
                '围观：有人递名片说「下次让桩喊我」——先别急着信。',
                '花絮：摊主假意叹气「卖早了」，手已经在数钱。',
                '闲话：隔壁切垮的那位默默点烟，离你远了两步。'
            ])
            : pickGamble([
                '安慰：老师傅拍拍肩：「这口学费，下块料找补。」',
                '花絮：有人小声说「还好不是我标的」，你假装没听见。',
                '现场：灰尘落定，只剩扫地声——比安慰更真实。'
            ]);
    showGambleNotification(msg, 'info');
}

// 显示切割结果
function showCutResult(result, stone) {
    const resultDisplay = document.getElementById('result-display');
    if (resultDisplay) resultDisplay.className = 'gs-result';
    const stoneDisplay = document.getElementById('stone-display');
    const misNow = player.gambleStone.userData.misfortune || 0;
    const fieldNote = getGambleResultFieldNote(result, stone);
    const netCh = typeof result.netChange === 'number' ? result.netChange : 0;
    const netUp = netCh > 0;
    const netDown = netCh < 0;
    if (netUp) {
        stoneDisplay.classList.add('result-win');
    } else if (netDown) {
        stoneDisplay.classList.add('result-lose');
    } else {
        stoneDisplay.classList.add('result-win');
    }
    
    const salvageLine = result.salvageAmount > 0
        ? `<div style="color:#5ecf9a;font-size:0.85rem;margin-top:8px;">废料回购 +¥ ${result.salvageAmount.toLocaleString()}</div>`
        : '';
    const recutLine = result.freeRecutGranted
        ? `<div style="color:#c4a5e8;font-size:0.85rem;margin-top:8px;">裂隙：本档下次一刀免费</div>`
        : '';
    const peddlerLine = result.peddlerBonus > 0
        ? `<div style="color:#a8c4e8;font-size:0.85rem;margin-top:8px;">边角料货郎 +¥ ${result.peddlerBonus.toLocaleString()}</div>`
        : '';
    const misLine = result.type === 'lose' && misNow >= 35
        ? `<div style="color:#c97a8a;font-size:0.82rem;margin-top:8px;">晦气 ${Math.round(misNow)}：继续连败会更难出绿</div>`
        : '';
    const ys = result.yieldSpec;
    const yieldLine = ys && ys.hue && ys.variety && ys.grade
        ? `<div class="gs-yield-row">
            <span class="gs-yield-tag" style="--yborder:${ys.hue.hex};color:${ys.hue.hex}">色 ${ys.hue.name}</span>
            <span class="gs-yield-tag" style="--yborder:${ys.variety.hex};color:${ys.variety.hex}">种 ${ys.variety.name}</span>
            <span class="gs-yield-tag" style="--yborder:${ys.grade.hex};color:${ys.grade.hex}">件 ${ys.grade.name}</span>
            ${ys.rub ? '<span class="gs-yield-rub">擦皮样</span>' : ''}
           </div>`
        : '';
    const pc = result.presentCard;
    const pulseW = pc && typeof pc.pulse === 'number' ? Math.min(100, Math.max(4, pc.pulse)) : 0;
    const presentBlock = pc
        ? `<div class="gs-present-card">
            <div class="gs-pc-top">
                <span class="gs-pc-cert">留档 ${pc.certId}</span>
                <span class="gs-pc-spot">开料前指数 <b>${pc.spotSnap}</b></span>
            </div>
            <div class="gs-pc-pulse"><span>临场心跳</span><div class="gs-pc-bar"><i style="width:${pulseW}%"></i></div><b>${pc.pulse}</b> · ${pc.tension}</div>
            <div class="gs-pc-grid">
                <div><span class="gs-pc-k">行内毛估分</span><span class="gs-pc-v">${pc.apprScore} / 100</span></div>
                <div><span class="gs-pc-k">电筒色温</span><span class="gs-pc-v">${pc.lightStr}</span></div>
            </div>
            <div class="gs-pc-wire">${pc.wireLine}</div>
            <div class="gs-pc-hook">${pc.hookLine}</div>
           </div>`
        : '';
    const sideDealLine = result.presentSideDeal > 0
        ? `<div class="gs-side-deal">同行伸价到账 +¥ ${result.presentSideDeal.toLocaleString()}</div>`
        : '';
    
    var resultTitle = '📌 平手';
    if (netDown) resultTitle = '😢 净亏';
    else if (netUp) resultTitle = result.type === 'jackpot' ? '🎉 头奖！' : '🎊 净赚';
    resultDisplay.innerHTML = `
        <div class="result-title">${resultTitle}</div>
        <div class="result-amount ${netDown ? 'lose' : 'win'}">
            ${netCh >= 0 ? '+' : '-'}¥ ${Math.abs(netCh).toLocaleString(undefined, {minimumFractionDigits: 2})}
        </div>
        ${sideDealLine}
        ${yieldLine}
        ${presentBlock}
        <div class="result-message">
            ${result.message}
        </div>
        ${salvageLine}
        ${peddlerLine}
        ${recutLine}
        ${misLine}
        <div style="color: #7d7365; font-size: 0.82rem; margin-top: 10px;">
            倍率: ${result.multiplier.toFixed(2)}x | 
            石头: ${stone.name}
        </div>
        <div class="gs-field-note">${fieldNote}</div>
    `;
    
    resultDisplay.style.display = 'block';
    
    setTimeout(() => {
        stoneDisplay.classList.remove('result-win', 'result-lose');
    }, 3000);
}

// 更新用户数据（狂热条、废料收购、裂隙免费刀、风向、气运槽、声望、边角料货郎）
function updateUserAfterCut(result, stone, opts) {
    const gamble = player.gambleStone;
    syncGambleSessionDate(gamble);
    const isFreeCut = opts && opts.isFreeCut;
    const usedQi = opts && opts.useQi;
    const isRubCut = opts && opts.isRubCut;
    var stake = stone.cost;
    if (opts && typeof opts.stakePaid === 'number') stake = opts.stakePaid;
    const wind = getActiveGambleWind(gamble);
    
    gamble.userData.balance += result.amount;
    
    result.salvageAmount = 0;
    result.freeRecutGranted = false;
    result.peddlerBonus = 0;
    
    if (result.type === 'lose') {
        if (!isFreeCut) gamble.userData.totalLost += stake;
        gamble.userData.totalWon += result.amount;
        if (gamble.userData.streak > 0) gamble.userData.streak = 0;
        gamble.userData.streak--;
        gamble.userData.minStreak = Math.min(gamble.userData.minStreak, gamble.userData.streak);
        
        if (!isRubCut && Math.random() < 0.11) {
            const salvage = Math.floor(stake * (0.075 + Math.random() * 0.16));
            if (salvage > 0) {
                result.salvageAmount = salvage;
                gamble.userData.balance += salvage;
                gamble.userData.totalWon += salvage;
            }
        }
        if (isRubCut && Math.random() < 0.14) {
            const salvage = Math.max(1, Math.floor(stake * (0.08 + Math.random() * 0.12)));
            result.salvageAmount = (result.salvageAmount || 0) + salvage;
            gamble.userData.balance += salvage;
            gamble.userData.totalWon += salvage;
        }
        if (!isFreeCut && !isRubCut && Math.random() < 0.045) {
            const tip = Math.max(1, Math.floor(stake * (0.02 + Math.random() * 0.05)));
            result.peddlerBonus = tip;
            gamble.userData.balance += tip;
            gamble.userData.totalWon += tip;
            showGambleNotification('边角料货郎收走碎渣，塞给你 ¥' + tip.toLocaleString(), 'info');
        }
        const misAdd = isRubCut ? 5 : ((wind && wind.misLoseAdd != null) ? wind.misLoseAdd : 7);
        gamble.userData.misfortune = Math.min(100, (gamble.userData.misfortune || 0) + misAdd);
    } else {
        if (!isFreeCut) gamble.userData.totalLost += stake;
        gamble.userData.totalWon += result.amount;
        if (gamble.userData.streak < 0) gamble.userData.streak = 0;
        gamble.userData.streak++;
        gamble.userData.maxStreak = Math.max(gamble.userData.maxStreak, gamble.userData.streak);
        
        if (result.type === 'jackpot') {
            if (gamble.achievements && !gamble.achievements.firstJackpot) {
                gamble.achievements.firstJackpot = true;
                showGambleNotification('标场成就：首次开出头奖', 'success');
            }
            gamble.statistics.biggestWin = Math.max(gamble.statistics.biggestWin, result.amount);
            gamble.userData.misfortune = 0;
        } else {
            const mf = (wind && wind.misWinFactor != null) ? wind.misWinFactor : 0.52;
            gamble.userData.misfortune = Math.floor((gamble.userData.misfortune || 0) * mf);
        }
        if (gamble.userData.streak === 3 && Math.random() < 0.45) {
            showGambleNotification(pickGamble([
                '手气发烫：围观开始跟你的灯影走。',
                '三连涨：摊主默默把「别切了」咽回去。',
                '行里嘀咕：这手今天像开了光。'
            ]), 'info');
        }
    }
    
    let h = Math.max(0, gamble.userData.heat || 0);
    var heatAdd = isRubCut
        ? (result.type === 'lose' ? 4 : 6)
        : (result.type === 'lose' ? 6 : (result.type === 'jackpot' ? 18 : 10));
    if (wind && wind.heatExtra != null) heatAdd += wind.heatExtra;
    h += heatAdd;
    const heatMax = typeof GAMBLE_HEAT_FOR_FEVER !== 'undefined' ? GAMBLE_HEAT_FOR_FEVER : 130;
    if (h >= heatMax) {
        gamble.gameState.nextCutFever = true;
        h = 0;
        showGambleNotification('狂热已满！下一刀「狂热一刀」', 'success');
    }
    gamble.userData.heat = h;

    var qm = (gamble.userData.qiMeter || 0) + (isRubCut ? 9 : 14);
    if (wind && wind.qiMeterBonus) qm += isRubCut ? Math.floor((wind.qiMeterBonus || 0) * 0.55) : wind.qiMeterBonus;
    if (usedQi) qm += 6;
    if (result.type === 'jackpot') qm += isRubCut ? 12 : 22;
    else if (result.type === 'win') qm += isRubCut ? 7 : 10;
    while (qm >= 100) {
        qm -= 100;
        gamble.userData.qiPoints = Math.min(12, (gamble.userData.qiPoints || 0) + 1);
        showGambleNotification('气运槽满：获得 1 气运点（可勾选「气运护刀」）', 'success');
    }
    gamble.userData.qiMeter = qm;

    var rep = (gamble.userData.reputation || 0) + (isRubCut ? (result.type === 'win' ? 5 : 2) : (result.type === 'jackpot' ? 48 : (result.type === 'win' ? 12 : 3)));
    if (!isFreeCut) rep += 2;
    gamble.userData.reputation = rep;
    var targetLuck = 1 + Math.min(4, Math.floor(rep / 450));
    if (targetLuck > (gamble.userData.luckyLevel || 1)) {
        gamble.userData.luckyLevel = targetLuck;
        showGambleNotification('声望提升：幸运等级 Lv.' + targetLuck + '（略提头奖权重）', 'success');
    }
    
    if (!isFreeCut && Math.random() < 0.012) {
        gamble.userData.freeRecutStoneId = stone.id;
        result.freeRecutGranted = true;
    }
    
    const wasFirstFinishedCut = gamble.userData.gamesPlayed === 0;
    gamble.userData.gamesPlayed++;
    if (result.type === 'win' || result.type === 'jackpot') {
        gamble.userData.winCuts = (gamble.userData.winCuts || 0) + 1;
    }
    gamble.userData.winRate = gamble.userData.gamesPlayed > 0
        ? (gamble.userData.winCuts || 0) / gamble.userData.gamesPlayed
        : 0;

    if (isRubCut && result.peekBuffJustGranted) {
        showGambleNotification('记桩已挂上：下一刀全切/开窗/引线/半明同档略加成', 'info');
    }

    if (gamble.achievements) {
        if (wasFirstFinishedCut && !gamble.achievements.firstCut) {
            gamble.achievements.firstCut = true;
            showGambleNotification('标场成就：初落槌', 'info');
        }
        if ((result.type === 'win' || result.type === 'jackpot') && !gamble.achievements.firstWin) {
            gamble.achievements.firstWin = true;
            showGambleNotification('标场成就：首次出绿', 'success');
        }
        if (gamble.userData.streak >= 5 && !gamble.achievements.streak5) {
            gamble.achievements.streak5 = true;
            showGambleNotification('标场成就：五连胜', 'success');
        }
        if (gamble.userData.streak >= 10 && !gamble.achievements.streak10) {
            gamble.achievements.streak10 = true;
            showGambleNotification('标场成就：十连胜', 'success');
        }
        if (gamble.userData.balance >= 1e6 && !gamble.achievements.millionaire) {
            gamble.achievements.millionaire = true;
            showGambleNotification('标场成就：百万身家（本场余额）', 'success');
        }
    }

    result.presentSideDeal = 0;
    if ((result.type === 'win' || result.type === 'jackpot') && !isRubCut && !isFreeCut && result.amount > 0 && Math.random() < 0.14) {
        const bonus = Math.max(1, Math.floor(result.amount * (0.005 + Math.random() * 0.038)));
        gamble.userData.balance += bonus;
        gamble.userData.totalWon += bonus;
        result.presentSideDeal = bonus;
        showGambleNotification('同行伸价：有人愿意当场多接 ¥' + bonus.toLocaleString() + '（点现，不算账面税）', 'success');
    }

    var eyeAdd = 0;
    if (isRubCut) eyeAdd = result.type === 'lose' ? 3 : 7;
    else if (result.type === 'jackpot') eyeAdd = 52;
    else if (result.type === 'win') eyeAdd = 15;
    else eyeAdd = 5;
    if (isFreeCut) eyeAdd = Math.max(1, Math.floor(eyeAdd * 0.45));
    gamble.userData.eyeExp = (gamble.userData.eyeExp || 0) + eyeAdd;
    const eyeR = getGambleEyeRank(gamble.userData.eyeExp);
    if (eyeR.level > (gamble.userData.eyeLevelSeen || 1)) {
        gamble.userData.eyeLevelSeen = eyeR.level;
        showGambleNotification('眼力进阶：「' + eyeR.title + '」 · 继续切石攒经验', 'success');
    }

    registerGambleCodexUnlocks(gamble, result, stone);
    processGambleDailyQuestAfterCut(gamble, result, { isRubCut: isRubCut });

    rollGamblePostCutAmbientToast(gamble, result, stone);
    
    var netLine = (isFreeCut ? 0 : -stake) + result.amount;
    if (result.salvageAmount > 0) netLine += result.salvageAmount;
    if (result.peddlerBonus > 0) netLine += result.peddlerBonus;
    if (result.presentSideDeal > 0) netLine += result.presentSideDeal;
    result.netChange = netLine;

    const sess = gamble.gameState.session || { dayKey: getGambleLocalDayKey(), cuts: 0, bestNet: 0, totalNet: 0 };
    sess.cuts = (sess.cuts || 0) + 1;
    sess.totalNet = (sess.totalNet || 0) + netLine;
    if (netLine > (sess.bestNet || 0)) sess.bestNet = netLine;
    gamble.gameState.session = sess;

    var si0 = typeof gamble.gameState.spotIndex === 'number' ? gamble.gameState.spotIndex : 100;
    var dMove = (Math.random() - 0.5) * 1.05;
    if (result.type === 'jackpot') dMove += 1.08;
    else if (result.type === 'win') dMove += 0.38;
    else dMove -= 0.26;
    if ((gamble.userData.streak || 0) >= 3) dMove += 0.16;
    if ((gamble.userData.streak || 0) <= -3) dMove -= 0.14;
    var si1 = Math.round((si0 + dMove) * 10) / 10;
    si1 = Math.max(91.5, Math.min(108.5, si1));
    gamble.gameState.spotIndex = si1;
    gamble.gameState.spotDelta = Math.round((si1 - si0) * 10) / 10;
    
    gamble.gameState.cutHistory.push({
        stoneId: stone.id,
        stoneName: stone.name + (isFreeCut ? '（免费）' : '') + (isRubCut ? '·擦皮' : ''),
        cost: isFreeCut ? 0 : stake,
        result: netLine,
        type: result.type,
        time: Date.now()
    });
    
    if (gamble.gameState.cutHistory.length > 10) {
        gamble.gameState.cutHistory.shift();
    }
    
    updateGambleStatsDisplay();
    updateHistoryList();
    updateGambleFreeRecutUi();
}

function updateGambleFreeRecutUi() {
    const gamble = player.gambleStone;
    if (!gamble) return;
    document.querySelectorAll('.gs-stone-item').forEach(card => {
        const id = parseInt(card.getAttribute('data-id'), 10);
        const tag = card.querySelector('.free-recut-tag');
        if (gamble.userData.freeRecutStoneId === id) {
            if (!tag) {
                const el = document.createElement('span');
                el.className = 'free-recut-tag';
                el.textContent = '免费';
                card.insertBefore(el, card.firstChild);
            }
        } else if (tag) {
            tag.remove();
        }
    });
    const cutBtn = document.getElementById('cut-btn');
    if (!cutBtn) return;
    const stone = gamble.stones.find(s => s.id === gamble.currentStoneId);
    if (!stone) return;
    cutBtn.disabled = !gambleCanCutStone(stone);
    cutBtn.innerHTML = '<i class="fas fa-cut"></i> ' + (gamble.userData.freeRecutStoneId === stone.id ? '裂隙 · 免费下刀' : '落槌下刀');
}
/** 角料快局：每日一次，小额随机回籠（不计入本日悬赏主刀） */
function gambleRunScrapRushMini() {
    ensureGambleStoneExtras();
    const gamble = player.gambleStone;
    if (!gamble || gamble.gameState.isCutting) return;
    const dk = getGambleLocalDayKey();
    if (gamble.userData.scrapRushDayKey === dk) {
        showGambleNotification('今日角料快局已玩过，明早赶摊再来。', 'info');
        return;
    }
    const cost = 388;
    if (gamble.userData.balance < cost) {
        showGambleNotification('本场余额不足 ¥388', 'error');
        return;
    }
    gamble.userData.balance -= cost;
    gamble.userData.totalBet += cost;
    gamble.userData.totalLost += cost;
    const r = Math.random();
    var back;
    if (r < 0.42) back = Math.floor(420 + Math.random() * 520);
    else if (r < 0.76) back = Math.floor(160 + Math.random() * 220);
    else back = Math.floor(45 + Math.random() * 115);
    gamble.userData.balance += back;
    gamble.userData.totalWon += back;
    gamble.userData.scrapRushDayKey = dk;
    const net = back - cost;
    showGambleNotification('角料快局：回籠 ¥' + back.toLocaleString() + '（' + (net >= 0 ? '小赚 ¥' + net.toLocaleString() : '小亏 ¥' + Math.abs(net).toLocaleString()) + '）', net >= 0 ? 'success' : 'info');
    gamble.gameState.cutHistory.push({
        stoneId: 0,
        stoneName: '角料快局',
        cost: cost,
        result: net,
        type: 'scrapRush',
        time: Date.now()
    });
    if (gamble.gameState.cutHistory.length > 10) gamble.gameState.cutHistory.shift();
    updateHistoryList();
    updateGambleStatsDisplay();
    saveGame();
}

// 初始化赌石事件监听
function initGambleEventListeners() {
    document.querySelectorAll('.gs-stone-item').forEach(card => {
        card.addEventListener('click', function() {
            const stoneId = parseInt(this.getAttribute('data-id'), 10);
            player.gambleStone.currentStoneId = stoneId;
            document.querySelectorAll('.gs-stone-item').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            const stone = player.gambleStone.stones.find(s => s.id === stoneId);
            if (!stone) return;
            const stoneDisplay = document.getElementById('stone-display');
            stoneDisplay.style.borderColor = 'rgba(' + hexToRgb(stone.color) + ',0.45)';
            stoneDisplay.style.color = stone.color;
            const nameEl = document.getElementById('gs-current-name');
            if (nameEl) nameEl.textContent = stone.name;
            refreshGambleCostLine();
            const prepEl = document.getElementById('gs-prep-panel');
            if (prepEl) {
                prepEl.innerHTML = getGamblePrepPanelInnerHtml(player.gambleStone, stone);
                bindGamblePrepPanelEvents();
            }
            const cutBtn = document.getElementById('cut-btn');
            cutBtn.disabled = !gambleCanCutStone(stone);
            cutBtn.innerHTML = '<i class="fas fa-cut"></i> ' + (player.gambleStone.userData.freeRecutStoneId === stone.id ? '裂隙 · 免费下刀' : '落槌下刀');
        });
    });
    const styleRow = document.getElementById('gs-style-row');
    if (styleRow) {
        styleRow.querySelectorAll('.gs-style-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const st = this.getAttribute('data-gs-style');
                if (!st) return;
                player.gambleStone.gameState.cutStyle = st;
                styleRow.querySelectorAll('.gs-style-btn').forEach(b => b.classList.remove('on'));
                this.classList.add('on');
                saveGame();
            });
        });
    }
    const spendQiEl = document.getElementById('gs-spend-qi');
    if (spendQiEl) {
        spendQiEl.addEventListener('change', function() {
            player.gambleStone.gameState.spendQiNextCut = !!this.checked;
            saveGame();
        });
    }
    const modeRow = document.getElementById('gs-mode-row');
    if (modeRow) {
        modeRow.querySelectorAll('.gs-mode-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const m = this.getAttribute('data-gs-mode');
                if (!m || !['full', 'window', 'rub', 'half', 'line'].includes(m)) return;
                player.gambleStone.gameState.cutMode = m;
                modeRow.querySelectorAll('.gs-mode-btn').forEach(b => b.classList.remove('on'));
                this.classList.add('on');
                refreshGambleCostLine();
                const curStone = player.gambleStone.stones.find(s => s.id === player.gambleStone.currentStoneId);
                const cb = document.getElementById('cut-btn');
                if (curStone && cb) {
                    cb.disabled = !gambleCanCutStone(curStone);
                }
                saveGame();
            });
        });
    }
    const cutBtn = document.getElementById('cut-btn');
    if (cutBtn) {
        cutBtn.addEventListener('click', cutStone);
    }
    bindGamblePrepPanelEvents();

    // 转账按钮
const transferInBtn = document.getElementById('transfer-from-invest');
const transferOutBtn = document.getElementById('transfer-to-invest');
const transferInput = document.getElementById('transfer-amount');
const transferInfo = document.getElementById('transfer-info');

// 从投资转入赌石（原有的）
if (transferInBtn && transferInput) {
    transferInBtn.addEventListener('click', function() {
        transferFunds('in');
    });
}

// 从赌石转出到投资（新增的）
if (transferOutBtn && transferInput) {
    transferOutBtn.addEventListener('click', function() {
        transferFunds('out');
    });
}

// 输入框监听，实时更新最大可转金额
if (transferInput) {
    transferInput.addEventListener('input', updateTransferLimits);
}

    const scrapR = document.getElementById('gs-scrap-rush-btn');
    if (scrapR) scrapR.addEventListener('click', gambleRunScrapRushMini);

    const codexBtn = document.getElementById('gs-codex-toggle');
    const codexDrawer = document.getElementById('gs-codex-drawer');
    if (codexBtn && codexDrawer && player.gambleStone) {
        codexBtn.addEventListener('click', function () {
            const open = codexDrawer.getAttribute('data-open') === '1';
            if (open) {
                codexDrawer.setAttribute('data-open', '0');
                codexDrawer.style.display = 'none';
            } else {
                codexDrawer.setAttribute('data-open', '1');
                codexDrawer.style.display = 'block';
                codexDrawer.innerHTML = getGambleCodexDrawerInnerHtml(player.gambleStone);
            }
        });
    }
}
function transferFunds(direction) {
    const gamble = player.gambleStone;
    const investment = player.investmentGame && player.investmentGame.userData;
    const amountInput = document.getElementById('transfer-amount');
    const amount = parseFloat(amountInput.value);
    
    // 验证输入
    if (!amount || amount <= 0) {
        showTransferInfo('请输入有效金额', 'error');
        return;
    }
    if (!investment) {
        showTransferInfo('投资账户不可用', 'error');
        return;
    }
    
    // 根据方向进行转账
    if (direction === 'in') {
        // 从投资转入赌石
        if (amount > investment.availableFunds) {
            showTransferInfo('投资账户余额不足', 'error');
            return;
        }
        
        if (amount > GAMBLE_TRANSFER_SINGLE_MAX) {
            showTransferInfo('单次转入不能超过10000亿元', 'error');
            return;
        }
        
        // 执行转账
        investment.availableFunds -= amount;
        gamble.userData.balance += amount;
        
        showTransferInfo(`成功转入 ¥${amount.toLocaleString()} 到赌石账户`, 'success');
        
    } else if (direction === 'out') {
        // 从赌石转出到投资
        if (amount > gamble.userData.balance) {
            showTransferInfo('赌石账户余额不足', 'error');
            return;
        }
        
        if (amount > GAMBLE_TRANSFER_SINGLE_MAX) {
            showTransferInfo('单次转出不能超过10000亿元', 'error');
            return;
        }
        
        
        // 执行转账
        gamble.userData.balance -= amount;
        investment.availableFunds += amount;
        
        showTransferInfo(`成功转出 ¥${amount.toLocaleString()} 到投资账户`, 'success');
    }
    
    // 更新显示
    updateTransferLimits();
    updateGambleStatsDisplay();
    
    const cutBtn = document.getElementById('cut-btn');
    if (cutBtn) {
        const stone = gamble.stones.find(s => s.id === gamble.currentStoneId);
        if (stone) cutBtn.disabled = !gambleCanCutStone(stone);
    }
    
    // 重置输入框
    amountInput.value = '';
    
    // 保存游戏
    saveGame();
}
function showTransferInfo(message, type) {
    const infoElement = document.getElementById('transfer-info');
    if (!infoElement) return;
    
    infoElement.textContent = message;
    infoElement.className = `transfer-info ${type}`;
    infoElement.style.display = 'block';
    
    // 3秒后隐藏
    setTimeout(() => {
        infoElement.style.display = 'none';
    }, 3000);
}

// 更新转账限制和显示
function updateTransferLimits() {
    const gamble = player.gambleStone;
    const inv = player.investmentGame && player.investmentGame.userData;
    const amountInput = document.getElementById('transfer-amount');
    const transferInfo = document.getElementById('transfer-info');
    
    if (!amountInput) return;
    
    // 获取当前余额
    const investBalance = inv && typeof inv.availableFunds === 'number' ? inv.availableFunds : 0;
    const gambleBalance = gamble.userData.balance;
    
    // 更新输入框的最大值（不超过单次转账上限）
    const cap = typeof GAMBLE_TRANSFER_SINGLE_MAX !== 'undefined' ? GAMBLE_TRANSFER_SINGLE_MAX : 1e12;
    amountInput.max = Math.min(cap, Math.max(investBalance, gambleBalance));
    
    // 实时显示可转金额提示
    const amount = parseFloat(amountInput.value) || 0;
    
    if (amount > 0) {
        if (amount > cap) {
            showTransferInfo('⚠️ 单次转入/转出限额10000亿元', 'error');
        } else if (amount > investBalance && amount > gambleBalance) {
            showTransferInfo('❌ 两个账户余额都不足', 'error');
        } else if (amount > investBalance) {
            showTransferInfo(`⚠️ 投资账户余额不足，最多可转 ¥${investBalance.toLocaleString()}`, 'error');
        } else if (amount > gambleBalance) {
            showTransferInfo(`⚠️ 赌石账户余额不足，最多可转 ¥${gambleBalance.toLocaleString()}`, 'error');
        } else {
            showTransferInfo(`✅ 可转金额: 转入最大 ¥${investBalance.toLocaleString()} | 转出最大 ¥${gambleBalance.toLocaleString()}`, 'info');
        }
    }
}
// 更新统计显示
function updateGambleStatsDisplay() {
    const gamble = player.gambleStone;
    const heatMax = typeof GAMBLE_HEAT_FOR_FEVER !== 'undefined' ? GAMBLE_HEAT_FOR_FEVER : 130;
    const bal = document.getElementById('gs-balance-num');
    if (bal) {
        bal.textContent = `¥ ${gamble.userData.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }
    const netEl = document.getElementById('gs-net-pl');
    if (netEl) {
        const net = gamble.userData.totalWon - gamble.userData.totalLost;
        netEl.textContent = net.toLocaleString(undefined, { minimumFractionDigits: 2 });
        netEl.className = 'gs-stat-num ' + (net >= 0 ? 'pos' : 'neg');
    }
    const wrEl = document.getElementById('gs-winrate');
    if (wrEl) {
        wrEl.textContent = `${(gamble.userData.winRate * 100).toFixed(1)}%`;
    }
    const stEl = document.getElementById('gs-streak');
    if (stEl) {
        stEl.textContent = `${gamble.userData.streak >= 0 ? '+' : ''}${gamble.userData.streak}`;
        stEl.className = 'gs-stat-num ' + (gamble.userData.streak >= 0 ? 'pos' : 'neg');
    }
    const heatFill = document.getElementById('gs-heat-fill');
    if (heatFill) {
        const h = Math.min(heatMax, gamble.userData.heat || 0);
        heatFill.style.width = `${(h / heatMax) * 100}%`;
    }
    const heatLab = document.getElementById('gs-heat-label');
    if (heatLab) {
        if (gamble.gameState.nextCutFever) {
            heatLab.textContent = '下一刀·狂热';
            heatLab.classList.add('fever-ready');
        } else {
            heatLab.textContent = `${Math.round(gamble.userData.heat || 0)}/${heatMax}`;
            heatLab.classList.remove('fever-ready');
        }
    }
    const misFill = document.getElementById('gs-misfortune-fill');
    if (misFill) {
        const m = gamble.userData.misfortune || 0;
        misFill.style.width = `${m}%`;
    }
    const misLab = document.getElementById('gs-misfortune-label');
    if (misLab) {
        misLab.textContent = `${Math.round(gamble.userData.misfortune || 0)}/100`;
    }
    ensureGambleStoneExtras();
    refreshGambleMarketWindIfNeeded(gamble);
    const wdef = getActiveGambleWind(gamble);
    const wn = document.getElementById('gs-wind-name');
    const wt = document.getElementById('gs-wind-tag');
    const wtime = document.getElementById('gs-wind-time');
    if (wn) wn.textContent = wdef ? wdef.name : '—';
    if (wt) wt.textContent = wdef ? wdef.tag : '';
    if (wtime && gamble.gameState.marketWind && gamble.gameState.marketWind.until) {
        const mins = Math.max(0, Math.ceil((gamble.gameState.marketWind.until - Date.now()) / 60000));
        wtime.textContent = '约 ' + mins + ' 分钟后换季';
    }
    const qiP = document.getElementById('gs-qi-points');
    const qiFill = document.getElementById('gs-qi-meter-fill');
    const qiTxt = document.getElementById('gs-qi-meter-txt');
    const repN = document.getElementById('gs-rep-num');
    const lk = document.getElementById('gs-luck-lvl');
    if (qiP) qiP.textContent = String(gamble.userData.qiPoints || 0);
    if (qiFill) qiFill.style.width = Math.min(100, Math.max(0, gamble.userData.qiMeter || 0)) + '%';
    if (qiTxt) qiTxt.textContent = Math.round(gamble.userData.qiMeter || 0) + '/100';
    if (repN) repN.textContent = String(Math.floor(gamble.userData.reputation || 0));
    if (lk) lk.textContent = String(gamble.userData.luckyLevel || 1);
    const sidx = document.getElementById('gs-spot-idx');
    const sd = document.getElementById('gs-spot-delta');
    const si = typeof gamble.gameState.spotIndex === 'number' ? gamble.gameState.spotIndex : 100;
    const sdel = typeof gamble.gameState.spotDelta === 'number' ? gamble.gameState.spotDelta : 0;
    if (sidx) sidx.textContent = si.toFixed(1);
    if (sd) {
        sd.textContent = sdel > 0 ? '+' + sdel.toFixed(1) : sdel < 0 ? sdel.toFixed(1) : '±0';
        sd.className = 'gs-spot-updn ' + (sdel > 0.04 ? 'up' : sdel < -0.04 ? 'down' : 'flat');
    }
    const et = document.getElementById('gs-eye-title');
    const em = document.getElementById('gs-eye-meta');
    const er = getGambleEyeRank(gamble.userData.eyeExp || 0);
    if (et) et.textContent = er.title;
    if (em) {
        const nx = er.next != null ? ' · 距「下一阶」约 ' + Math.max(0, er.next - er.exp) + ' 点' : ' · 已满阶';
        em.textContent = ' Lv.' + er.level + ' · ' + Math.floor(er.exp) + ' 点' + nx;
    }
    const dl = document.getElementById('gs-day-line');
    if (dl) {
        const sg = gamble.gameState.session || { cuts: 0, totalNet: 0, bestNet: 0 };
        const dc = sg.cuts || 0;
        const dn = typeof sg.totalNet === 'number' ? sg.totalNet : 0;
        const db = typeof sg.bestNet === 'number' ? sg.bestNet : 0;
        dl.innerHTML = '本日第 <b>' + dc + '</b> 刀 · 今日累计净收 <b style="color:' + (dn >= 0 ? '#5ecf9a' : '#e8a0a0') + '">' + (dn >= 0 ? '+' : '') + dn.toLocaleString(undefined, { minimumFractionDigits: 2 }) + '</b> · 今日最佳单刀 <b style="color:#d4a853">' + (db >= 0 ? '+' : '') + db.toLocaleString(undefined, { minimumFractionDigits: 2 }) + '</b>';
    }
    const dqb = document.getElementById('gs-daily-quest-body');
    if (dqb) dqb.innerHTML = getGambleDailyQuestInnerHtml(gamble);
    const scrapBtn = document.getElementById('gs-scrap-rush-btn');
    const scrapTip = document.querySelector('.gs-scrap-tip');
    if (scrapBtn && gamble.userData) {
        const done = gamble.userData.scrapRushDayKey === getGambleLocalDayKey();
        scrapBtn.disabled = !!done;
        if (scrapTip) scrapTip.textContent = done ? '今日已参加过角料快局，明早摊见。' : '从废料堆随手拣一块角料估价：不计入悬赏进度，纯添彩头。';
    }
}

// 更新历史记录
function updateHistoryList() {
    const historyList = document.getElementById('history-list');
    if (historyList) {
        historyList.innerHTML = renderHistoryList();
    }
}

// 显示赌石通知
function showGambleNotification(message, type) {
    let notification = document.getElementById('gamble-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'gamble-notification';
        notification.className = 'gamble-notification';
        document.querySelector('.gamble-stone').appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `gamble-notification ${type}`;
    notification.style.display = 'block';
    
    // 添加通知样式
    if (!document.querySelector('#gamble-notification-style')) {
        const style = document.createElement('style');
        style.id = 'gamble-notification-style';
        style.textContent = `
            .gamble-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                color: white;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                display: none;
                z-index: 1004;
                animation: gambleSlideIn 0.3s ease;
                font-weight: bold;
            }
            
            .gamble-notification.success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border: 2px solid #34d399;
            }
            
            .gamble-notification.error {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                border: 2px solid #fca5a5;
            }
            
            .gamble-notification.info {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                border: 2px solid #93c5fd;
            }
            
            @keyframes gambleSlideIn {
                from {transform: translateX(100%); opacity: 0;}
                to {transform: translateX(0); opacity: 1;}
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}
// 年兽副本全局变量
let nianBeastGame = {
    isInBattle: false,
    playerHp: 0,
    playerMaxHp: 0,
    playerAtk: 0,
    playerCrit: 0,
    playerCritRate: 0.3,
    
    beastLevel: 1,
    beastMaxHp: 1e5,
    beastCurrentHp: 1e5,
    beastAtk: 1e2,
    beastReviveCount: 3,
    beastDefense: 50000,
    beastMultiplier: 1,
    
    isDefending: false,
    hasTokenCost: false,
    
    // 年兽技能相关
   lastSkill: '',
    skillCombo: 0,
    lastComboSkill: '',
    skillTriggeredDeath: false,
    totalDamageDealt: 0
};
function hasChaosCauldron() {
    if (!player.magicTools || !player.magicTools.equipped) {
        return false;
    }
    
   
    return player.magicTools.equipped === 'yin_yang_mirrorbaab';
}

function getChaosCauldronBonus() {
    return hasChaosCauldron() ? 20 : 1; 
}
// 年兽技能配置
let nianBeastSkills = [
    {
        name: '普通爪击',
        description: '普通的攻击',
        multiplier: 1.0,
        chance: 0.40, // 40%几率
        message: '🐅 年兽挥爪攻击',
        color: '#aaa',
        icon: '🐾'
    },
    {
        name: '愤怒咆哮',
        description: '发出震耳欲聋的咆哮',
        multiplier: 1.2,
        chance: 0.25, // 25%几率
        message: '😤 年兽愤怒咆哮！造成1.2倍伤害',
        color: '#FF9800',
        icon: '😤'
    },
    {
        name: '猛虎扑击',
        description: '全力扑向敌人',
        multiplier: 1.5,
        chance: 0.20, // 20%几率
        message: '🐯 年兽猛虎扑击！造成1.5倍伤害',
        color: '#FF5722',
        icon: '🐯'
    },
    {
        name: '年兽冲撞',
        description: '以身体猛烈冲撞',
        multiplier: 2.0,
        chance: 0.10, // 10%几率
        message: '💥 年兽冲撞！造成2倍伤害',
        color: '#f44336',
        icon: '💥'
    },
    {
        name: '除夕灾厄',
        description: '传说中的年兽最强技能',
        multiplier: 5.0,
        chance: 0.05, // 5%几率
        message: '🌪️ 除夕灾厄！！！造成5倍毁灭性打击',
        color: '#FFD700',
        icon: '🌪️'
    }
];

// 基础技能配置（用于重置）
const baseNianBeastSkills = [
    {
        name: '普通爪击',
        description: '普通的攻击',
        multiplier: 1.0,
        chance: 0.40,
        message: '🐅 年兽挥爪攻击',
        color: '#aaa',
        icon: '🐾'
    },
    {
        name: '愤怒咆哮',
        description: '发出震耳欲聋的咆哮',
        multiplier: 1.2,
        chance: 0.25,
        message: '😤 年兽愤怒咆哮！造成1.2倍伤害',
        color: '#FF9800',
        icon: '😤'
    },
    {
        name: '猛虎扑击',
        description: '全力扑向敌人',
        multiplier: 1.5,
        chance: 0.20,
        message: '🐯 年兽猛虎扑击！造成1.5倍伤害',
        color: '#FF5722',
        icon: '🐯'
    },
    {
        name: '年兽冲撞',
        description: '以身体猛烈冲撞',
        multiplier: 2.0,
        chance: 0.10,
        message: '💥 年兽冲撞！造成2倍伤害',
        color: '#f44336',
        icon: '💥'
    },
    {
        name: '除夕灾厄',
        description: '传说中的年兽最强技能',
        multiplier: 5.0,
        chance: 0.05,
        message: '🌪️ 除夕灾厄！！！造成5倍毁灭性打击',
        color: '#FFD700',
        icon: '🌪️'
    }
];

// 年兽特殊状态技能（低血量时触发）
const nianBeastSpecialSkills = [
    {
        name: '垂死挣扎',
        description: '濒死时的疯狂反击',
        multiplier: 3.0,
        hpThreshold: 0.20, // 血量低于20%触发
        message: '⚡ 年兽垂死挣扎！造成3倍伤害',
        color: '#9C27B0',
        icon: '⚡'
    },
    {
        name: '新年祝福',
        description: '吸收新年气息恢复力量',
        multiplier: 0.5, // 伤害减半
        hpThreshold: 0.50, // 血量低于50%概率触发
        chance: 0.15, // 15%几率触发
        message: '🧧 年兽吸收新年气息，伤害减半',
        color: '#4CAF50',
        icon: '🧧'
    }
];
function resetNianBeastSkills() {
    // 深拷贝基础技能配置
    nianBeastSkills = JSON.parse(JSON.stringify(baseNianBeastSkills));
    
    // 重置技能相关变量
    nianBeastGame.skillTriggeredDeath = false;
    nianBeastGame.lastComboSkill = '';
    nianBeastGame.skillCombo = 0;
    nianBeastGame.lastSkill = '';
    
    console.log('年兽技能已重置到初始状态');
}


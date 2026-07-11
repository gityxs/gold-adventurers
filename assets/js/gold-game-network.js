// 联网/市场/家族
/** 与无限深渊聊天相同：锁定主页面 viewport，避免聚焦输入框时整页被缩放；多来源（聊天 / 洞天劫修仙市场等）用引用计数叠加，避免互相 unlock 错乱 */
window._mobileViewportNoZoomLockCount = window._mobileViewportNoZoomLockCount || 0;
window._extractViewportInitialScale = window._extractViewportInitialScale || function(content) {
    var m = String(content || '').match(/initial-scale\s*=\s*([0-9.]+)/i);
    if (m && m[1] != null) {
        var n = Number(m[1]);
        if (Number.isFinite(n) && n > 0) return n;
    }
    if (window.visualViewport && Number.isFinite(window.visualViewport.scale) && window.visualViewport.scale > 0) return Number(window.visualViewport.scale);
    return 1;
};
window.lockMobileViewportNoZoom = window.lockMobileViewportNoZoom || function() {
    var meta = document.getElementById('viewportMeta');
    if (!meta) return;
    if (window._mobileViewportNoZoomLockCount === 0) {
        window._abyssChatViewportPrevContent = meta.getAttribute('content') || '';
        var prev = window._abyssChatViewportPrevContent || '';
        var initialScale = window._extractViewportInitialScale(prev);
        var base = prev || 'width=device-width, initial-scale=' + initialScale + ', maximum-scale=2, user-scalable=yes';
        var content = base;
        if (!/initial-scale\s*=/i.test(content)) content += ', initial-scale=' + initialScale;
        if (!/maximum-scale\s*=/i.test(content)) content += ', maximum-scale=' + initialScale;
        content = content.replace(/initial-scale\s*=\s*[0-9.]+/ig, 'initial-scale=' + initialScale);
        content = content.replace(/maximum-scale\s*=\s*[0-9.]+/ig, 'maximum-scale=' + initialScale);
        if (/minimum-scale\s*=/i.test(content)) content = content.replace(/minimum-scale\s*=\s*[0-9.]+/ig, 'minimum-scale=' + initialScale);
        else content += ', minimum-scale=' + initialScale;
        if (/user-scalable\s*=/i.test(content)) content = content.replace(/user-scalable\s*=\s*[a-z]+/ig, 'user-scalable=no');
        else content += ', user-scalable=no';
        if (!/interactive-widget\s*=/i.test(content)) content += ', interactive-widget=overlays-content';
        meta.setAttribute('content', content);
    }
    window._mobileViewportNoZoomLockCount++;
};
window.unlockMobileViewportNoZoom = window.unlockMobileViewportNoZoom || function() {
    if (window._mobileViewportNoZoomLockCount <= 0) return;
    window._mobileViewportNoZoomLockCount--;
    if (window._mobileViewportNoZoomLockCount > 0) return;
    var meta = document.getElementById('viewportMeta');
    if (!meta) return;
    var prev = window._abyssChatViewportPrevContent || '';
    if (prev) meta.setAttribute('content', prev);
};
window.lockAbyssChatViewportNoZoom = function() {
    window.lockMobileViewportNoZoom();
};
window.unlockAbyssChatViewportNoZoom = function() {
    window.unlockMobileViewportNoZoom();
};
/** 是否为主游戏手机版视口（与 head 内 gold-game-mobile-viewport 判定一致） */
window.isGoldGameMobileViewport = window.isGoldGameMobileViewport || function() {
    if (document.documentElement && document.documentElement.classList.contains('gold-game-mobile-viewport')) return true;
    var w = window.screen && window.screen.width ? Number(window.screen.width) : 0;
    return w > 0 && w <= 1024;
};
/** 主游戏全局：手机版在点按输入框/下拉/文本域之前锁定 viewport（与深渊聊天一致，避免 focusin 过晚导致整页缩放） */
(function initMainGameMobileInputViewportLock() {
    if (window._mainGameInputViewportHooked) return;
    window._mainGameInputViewportHooked = true;
    window._mobileFormFieldPointerLockAt = 0;
    function isMainGameFormField(el) {
        if (!el || !el.matches) return false;
        return el.matches(
            'input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]):not([type=button]):not([type=submit]):not([type=reset]), select, textarea'
        );
    }
    function maybeLockViewportForFormField(el) {
        if (!window.isGoldGameMobileViewport()) return;
        if (!isMainGameFormField(el)) return;
        if (typeof window.lockMobileViewportNoZoom === 'function') window.lockMobileViewportNoZoom();
    }
    function onFormFieldBeforeFocus(e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var field = t.closest(
            'input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]):not([type=button]):not([type=submit]):not([type=reset]), select, textarea'
        );
        window._mobileFormFieldPointerLockAt = Date.now();
        maybeLockViewportForFormField(field || t);
    }
    if (!window._mainGameInputViewportEarlyHooked) {
        document.addEventListener('pointerdown', onFormFieldBeforeFocus, true);
        document.addEventListener('touchstart', onFormFieldBeforeFocus, { capture: true, passive: true });
    }
    document.addEventListener(
        'focusin',
        function (e) {
            if (Date.now() - (window._mobileFormFieldPointerLockAt || 0) < 500) return;
            maybeLockViewportForFormField(e.target);
        },
        true
    );
    document.addEventListener(
        'focusout',
        function () {
            setTimeout(function () {
                var ae = document.activeElement;
                if (ae && isMainGameFormField(ae)) return;
                if (typeof window.unlockMobileViewportNoZoom === 'function') window.unlockMobileViewportNoZoom();
                if (
                    window.isGoldGameMobileViewport() &&
                    (window._mobileViewportNoZoomLockCount || 0) <= 0 &&
                    typeof window.forceRestoreMobileViewportAfterChatSend === 'function'
                ) {
                    window.forceRestoreMobileViewportAfterChatSend();
                }
            }, 80);
        },
        true
    );
})();
window.forceRestoreMobileViewportAfterChatSend = function() {
    if (window._mobileViewportNoZoomLockCount > 0) {
        // 聊天或其它锁定方仍持有引用时保持当前比例，避免二次切换导致抖动
        return;
    }
    var meta = document.getElementById('viewportMeta');
    if (!meta) return;
    var w = window.screen && window.screen.width ? Number(window.screen.width) : 0;
    var baseContent = 'width=device-width, initial-scale=1.0, maximum-scale=2, user-scalable=yes';
    if (w > 0 && w <= 1024) {
        var scale = Math.max(0.3, Math.min(1, w / 1280));
        baseContent = 'width=1280, initial-scale=' + scale + ', maximum-scale=2, user-scalable=yes, interactive-widget=overlays-content';
    }
    // iOS 某些机型输入后会保持放大，这里短暂锁缩放再恢复，强制回到原视图
    meta.setAttribute('content', baseContent.replace('maximum-scale=2, user-scalable=yes', 'maximum-scale=1, user-scalable=no'));
    setTimeout(function() {
        meta.setAttribute('content', baseContent);
        try { window.scrollTo(window.scrollX || 0, window.scrollY || 0); } catch (e) {}
    }, 220);
};
window.formatAbyssOnlineChatTime = function(ts) {
    var t = Number(ts || 0);
    if (!Number.isFinite(t) || t <= 0) return '--';
    var d = new Date(t);
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    var h = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    var mm = m < 10 ? ('0' + m) : String(m);
    var dd = day < 10 ? ('0' + day) : String(day);
    var hh = h < 10 ? ('0' + h) : String(h);
    var mi = min < 10 ? ('0' + min) : String(min);
    var ss = sec < 10 ? ('0' + sec) : String(sec);
    return y + '-' + mm + '-' + dd + ' ' + hh + ':' + mi + ':' + ss;
};
window.renderAbyssOnlineChat = function(list) {
    var box = document.getElementById('abyssOnlineChatList');
    if (!box) return;
    var arr = Array.isArray(list) ? list : [];
    if (arr.length <= 0) {
        box.innerHTML = '<div style="color:#9e9e9e;padding:8px 2px;">暂无聊天消息</div>';
        return;
    }
    var html = [];
    var maxId = window._abyssOnlineChatLastRenderedId || 0;
    for (var i = 0; i < arr.length; i++) {
        var row = arr[i] || {};
        var idNum = Number(row.id || 0);
        if (idNum > maxId) maxId = idNum;
        var timeText = window._networkFloatEscapeHtml(window.formatAbyssOnlineChatTime(row.ts));
        var playerName = window._networkFloatEscapeHtml((row.playerName != null && String(row.playerName).trim()) ? String(row.playerName).trim() : '神秘玩家');
        var familyName = (row.familyName != null && String(row.familyName).trim()) ? String(row.familyName).trim() : '';
        var familyPart = familyName ? (' <span style="color:#80cbc4;">[' + window._networkFloatEscapeHtml(familyName) + ']</span>') : '';
        var msg = window._networkFloatEscapeHtml((row.message != null) ? String(row.message) : '');
        html.push('<div style="margin-bottom:6px;border-bottom:1px dashed rgba(179,157,219,.18);padding-bottom:5px;">'
            + '<div style="font-size:11px;color:#b39ddb;">[' + timeText + '] <span style="color:#ce93d8;">' + playerName + '</span>' + familyPart + '</div>'
            + '<div style="color:#f3e5f5;word-break:break-all;">' + msg + '</div>'
            + '</div>');
    }
    window._abyssOnlineChatLastRenderedId = maxId;
    box.innerHTML = html.join('');
    box.scrollTop = box.scrollHeight;
};
window.pollAbyssOnlineChat = function() {
    if (typeof goldGameGetAbyssChat !== 'function') return;
    goldGameGetAbyssChat().then(function(res) {
        if (!res || !res.ok) return;
        window.renderAbyssOnlineChat(res.list || []);
    }).catch(function() {});
};
window.sendAbyssOnlineChat = function() {
    var input = document.getElementById('abyssOnlineChatInput');
    if (!input) return;
    var text = String(input.value || '').trim();
    if (!text) return;
    if (typeof goldGameSendAbyssChat !== 'function') return;
    goldGameSendAbyssChat(text).then(function(res) {
        input.value = '';
        input.blur();
        if (typeof window.forceRestoreMobileViewportAfterChatSend === 'function') window.forceRestoreMobileViewportAfterChatSend();
        setTimeout(function() { try { window.scrollTo(window.scrollX || 0, window.scrollY || 0); } catch (e) {} }, 50);
        if (res && res.ok && Array.isArray(res.list)) window.renderAbyssOnlineChat(res.list);
    }).catch(function(e) {
        input.blur();
        if (typeof window.forceRestoreMobileViewportAfterChatSend === 'function') window.forceRestoreMobileViewportAfterChatSend();
        alert((e && e.message) || '发送失败');
    });
};
window.updateAbyssOnlineChatVisibility = function() {
    var panel = document.getElementById('abyssOnlineChatPanel');
    var codexBtn = document.getElementById('abyssRunSpeciesCodexBtn');
    var isNetworking = (typeof getGoldGameAuthToken === 'function' && !!getGoldGameAuthToken());
    var inAbyssBattle = !!(window.abyssRun && window.abyssRun.active);
    var abyssUiVisible = false;
    var abyssUi = document.getElementById('abyssTowerUI');
    if (abyssUi && abyssUi.style && abyssUi.style.display !== 'none') abyssUiVisible = true;
    var shouldShow = isNetworking && inAbyssBattle && abyssUiVisible;
    if (codexBtn) codexBtn.style.display = shouldShow ? '' : 'none';
    if (!panel) return;
    if (shouldShow) {
        if (!window._abyssOnlineChatVisible) {
            panel.style.display = 'block';
            window._abyssOnlineChatVisible = true;
            if (typeof window.initAbyssOnlineChatDraggable === 'function') window.initAbyssOnlineChatDraggable();
            if (typeof window.applyAbyssOnlineChatPanelPos === 'function') window.applyAbyssOnlineChatPanelPos();
            window.applyAbyssOnlineChatCollapsed();
            if (typeof window.lockAbyssChatViewportNoZoom === 'function') window.lockAbyssChatViewportNoZoom();
            window.pollAbyssOnlineChat();
            if (!window._abyssOnlineChatLoopTimer) {
                window._abyssOnlineChatLoopTimer = setInterval(function() { window.pollAbyssOnlineChat(); }, 4000);
            }
        }
    } else if (window._abyssOnlineChatVisible) {
        panel.style.display = 'none';
        window._abyssOnlineChatVisible = false;
        if (typeof window.unlockAbyssChatViewportNoZoom === 'function') window.unlockAbyssChatViewportNoZoom();
        if (window._abyssOnlineChatLoopTimer) {
            clearInterval(window._abyssOnlineChatLoopTimer);
            window._abyssOnlineChatLoopTimer = null;
        }
    }
};
// 纳入 registerInterval，与 beforeunload 中 _gameIntervals 统一清理，避免与其它裸 setInterval 一样遗漏
if (typeof registerInterval === 'function') {
    registerInterval(function() { window.updateAbyssOnlineChatVisibility(); }, 1000);
} else {
    window._abyssOnlineChatVisibilityTimer = setInterval(function() { window.updateAbyssOnlineChatVisibility(); }, 1000);
}
document.addEventListener('keydown', function(e) {
    if (!window._abyssOnlineChatVisible) return;
    if (e.key !== 'Enter') return;
    var input = document.getElementById('abyssOnlineChatInput');
    if (!input || document.activeElement !== input) return;
    e.preventDefault();
    if (typeof window.sendAbyssOnlineChat === 'function') window.sendAbyssOnlineChat();
});

function abyssRunResolveBeastSpeciesId(beast, catalog) {
    if (!beast || !catalog || !catalog.length) return null;
    if (beast.speciesId) return String(beast.speciesId);
    if (beast.speciesName) {
        for (var ci = 0; ci < catalog.length; ci++) { if (catalog[ci].name === beast.speciesName) return String(catalog[ci].id); }
    }
    if (beast.name) {
        for (var cj = 0; cj < catalog.length; cj++) { if (catalog[cj].name === beast.name) return String(catalog[cj].id); }
    }
    return null;
}
function closeAbyssRunSpeciesCodexView() {
    var ov = document.getElementById('abyssRunSpeciesCodexOverlay');
    var dlg = document.getElementById('abyssRunSpeciesCodexDialog');
    if (ov) ov.style.display = 'none';
    if (dlg) dlg.style.display = 'none';
    window._abyssRunSpeciesCodexSelectedId = null;
}
function renderAbyssRunSpeciesCodexView() {
    var cache = window._networkAbyssDivineCache;
    var listEl = document.getElementById('abyssRunSpeciesCodexList');
    var detailEl = document.getElementById('abyssRunSpeciesCodexDetail');
    var headEl = document.getElementById('abyssRunSpeciesCodexListHead');
    if (!listEl || !detailEl || !cache) return;
    var catalog = (cache.speciesCatalog || []).slice();
    var codexArr = cache.speciesCodex || [];
    var codexMap = {};
    for (var cx = 0; cx < codexArr.length; cx++) {
        if (codexArr[cx] && codexArr[cx].speciesId) codexMap[String(codexArr[cx].speciesId)] = true;
    }
    var uncatalogued = catalog.filter(function(sp) { return !codexMap[String(sp.id || '')]; });
    uncatalogued.sort(function(a, b) {
        var fa = Number(a.minFloor) || 0, fb = Number(b.minFloor) || 0;
        if (fa !== fb) return fa - fb;
        return String(a.name || '').localeCompare(String(b.name || ''));
    });
    if (headEl) headEl.textContent = '未登记品种（' + uncatalogued.length + '）';
    if (!uncatalogued.length) {
        listEl.innerHTML = '<div style="color:#888;padding:8px;font-size:12px;">已全部登记图鉴</div>';
        detailEl.innerHTML = '<div style="color:#a5d6a7;text-align:center;padding:32px;">恭喜！所有神兽品种均已登记图鉴。</div>';
        return;
    }
    var selId = window._abyssRunSpeciesCodexSelectedId;
    if (!selId || !uncatalogued.some(function(sp) { return String(sp.id) === String(selId); })) {
        selId = String(uncatalogued[0].id || '');
        window._abyssRunSpeciesCodexSelectedId = selId;
    }
    var listHtml = '';
    for (var li = 0; li < uncatalogued.length; li++) {
        var sp = uncatalogued[li];
        var sid = String(sp.id || '');
        var selSp = selId === sid;
        listHtml += '<div style="padding:6px 8px;margin-bottom:3px;background:' + (selSp ? 'rgba(106,27,154,0.45)' : 'rgba(0,0,0,0.28)') + ';border-radius:6px;border-left:3px solid ' + (selSp ? '#ce93d8' : 'transparent') + ';cursor:pointer;font-size:12px;" onclick="window._abyssRunSpeciesCodexSelectedId=\'' + sid.replace(/'/g, "\\'") + '\';renderAbyssRunSpeciesCodexView();">' +
            '<span style="color:#ffcc80;">○</span> <span style="color:#e0e0e0;">' + (sp.name || sid) + '</span>' +
            '<span style="color:#666;font-size:11px;margin-left:4px;">' + (sp.minFloor != null ? sp.minFloor + '层+' : '') + '</span></div>';
    }
    listEl.innerHTML = listHtml;
    var spInfo = null;
    for (var sk = 0; sk < uncatalogued.length; sk++) {
        if (String(uncatalogued[sk].id) === String(selId)) { spInfo = uncatalogued[sk]; break; }
    }
    if (!spInfo) {
        detailEl.innerHTML = '<div style="color:#888;text-align:center;padding:24px;">请选择左侧品种</div>';
        return;
    }
    var beasts = cache.beasts || [];
    var vaultList = (cache.beastVault && cache.beastVault.list) ? cache.beastVault.list : [];
    var owned = beasts.concat(vaultList).filter(function(b) {
        return abyssRunResolveBeastSpeciesId(b, catalog) === String(selId);
    });
    var desc = spInfo.desc || spInfo.speciesDesc || '';
    if (!desc && owned.length && owned[0].speciesDesc) desc = owned[0].speciesDesc;
    if (!desc) desc = '该品种暂未配置说明。';
    var ownedHtml = '';
    if (owned.length) {
        ownedHtml = '<div style="margin-top:14px;border-top:1px solid #4a1942;padding-top:10px;"><div style="font-size:12px;color:#ffb74d;margin-bottom:8px;">你拥有的该品种神兽（' + owned.length + ' 只，仅浏览）</div>';
        for (var oi = 0; oi < owned.length; oi++) {
            ownedHtml += '<div style="margin-bottom:10px;padding:10px;background:rgba(0,0,0,0.25);border-radius:8px;border:1px solid #555;text-align:left;">' + formatAbyssBeastInfo(owned[oi]) + '</div>';
        }
        ownedHtml += '</div>';
    } else {
        ownedHtml = '<div style="margin-top:14px;font-size:12px;color:#f48fb1;">你尚未获得该品种神兽。</div>';
    }
    detailEl.innerHTML = '<div style="text-align:left;">' +
        '<div style="color:#ffcc80;font-size:16px;font-weight:bold;margin-bottom:6px;">' + (spInfo.name || selId) + ' <span style="font-size:12px;color:#888;font-weight:normal;">（未登记）</span></div>' +
        '<div style="font-size:12px;color:#aaa;margin-bottom:8px;">解锁层数：' + (spInfo.minFloor != null ? spInfo.minFloor + ' 层以上可掉落' : '—') + '</div>' +
        '<div style="font-size:12px;color:#b388ff;line-height:1.55;">品种特色：' + desc + '</div>' +
        ownedHtml + '</div>';
}
function openAbyssRunSpeciesCodexView() {
    if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) {
        alert('请先联网登录后查看神兽图鉴。');
        return;
    }
    var showPanel = function() {
        document.getElementById('abyssRunSpeciesCodexOverlay').style.display = 'block';
        document.getElementById('abyssRunSpeciesCodexDialog').style.display = 'block';
        renderAbyssRunSpeciesCodexView();
    };
    if (window._networkAbyssDivineCache && window._networkAbyssDivineCache.speciesCatalog) {
        showPanel();
        return;
    }
    if (typeof goldGameGetNetworkAbyssDivine === 'function') {
        goldGameGetNetworkAbyssDivine().then(showPanel).catch(function(e) {
            alert((e && e.message) || '加载神兽图鉴失败');
        });
    } else {
        alert('联网功能未就绪');
    }
}

var NETWORK_ARTIFACT_SLOT_NAMES_UI = { necklace: '项链', ring: '戒指', bracelet: '手镯' };
var NETWORK_ARTIFACT_ATTR_NAMES = { atk: '攻击', def: '防御', hp: '生命', critRate: '暴击率', critDmg: '暴击伤害', petAtk: '宠物攻击', petDef: '宠物防御', petHp: '宠物生命', petCritRate: '宠物暴击率', petCritDmg: '宠物暴击伤害' };
var NETWORK_ARTIFACT_ENHANCE_RATES = [100, 80, 60, 40, 20, 15, 10, 8, 5, 1];
function formatNetworkArtifactDropTime(ts) {
    if (ts == null || !Number.isFinite(ts)) return '—';
    var d = new Date(ts);
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    var h = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    return y + '年' + m + '月' + day + '日 ' + (h < 10 ? '0' : '') + h + ':' + (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
}
function getNetworkArtifactExtraInfo(item) {
    if (!item) return '';
    var name = (item.dropPlayerName != null && item.dropPlayerName !== '') ? item.dropPlayerName : '未知';
    var time = formatNetworkArtifactDropTime(item.dropTime);
    return '<div style="font-size:11px;color:#888;margin-top:4px;">玩家名字: ' + name + ' · 掉落时间: ' + time + '</div>';
}
function openNetworkArtifactPanel() {
    if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) {
        alert('请先登录账号，深渊神器数据存于服务器。');
        return;
    }
    if (typeof abyssTowerExitFullscreenIfNeeded === 'function') {
        abyssTowerExitFullscreenIfNeeded(document.getElementById('abyssTowerFullscreenRoot'));
    }
    document.getElementById('networkArtifactOverlay').style.display = 'block';
    document.getElementById('networkArtifactDialog').style.display = 'block';
    refreshNetworkArtifactPanel();
}
function closeNetworkArtifactPanel() {
    document.getElementById('networkArtifactOverlay').style.display = 'none';
    document.getElementById('networkArtifactDialog').style.display = 'none';
    document.getElementById('networkArtifactEnhanceConfirm').style.display = 'none';
    document.getElementById('networkArtifactRefineConfirm').style.display = 'none';
}
function openNetworkAbyssDivinePanel() {
    if (typeof abyssTowerExitFullscreenIfNeeded === 'function') {
        abyssTowerExitFullscreenIfNeeded(document.getElementById('abyssTowerFullscreenRoot'));
    }
    var noNet = document.getElementById('networkAbyssDivineNoNetwork');
    var content = document.getElementById('networkAbyssDivineContent');
    window._networkAbyssDivinePanelOpen = true;
    if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) {
        document.getElementById('networkAbyssDivineOverlay').style.display = 'block';
        document.getElementById('networkAbyssDivineDialog').style.display = 'block';
        if (noNet) noNet.style.display = 'block';
        if (content) content.style.display = 'none';
        return;
    }
    if (noNet) noNet.style.display = 'none';
    if (content) content.style.display = 'block';
    document.getElementById('networkAbyssDivineOverlay').style.display = 'block';
    document.getElementById('networkAbyssDivineDialog').style.display = 'block';
    if (typeof goldGameGetNetworkAbyssDivine === 'function') goldGameGetNetworkAbyssDivine().then(function() { refreshNetworkAbyssDivinePanel(); });
}
function closeNetworkAbyssDivinePanel() {
    window._networkAbyssDivinePanelOpen = false;
    document.getElementById('networkAbyssDivineOverlay').style.display = 'none';
    document.getElementById('networkAbyssDivineDialog').style.display = 'none';
}
function openNetworkAbyssDivineVaultDialog() {
    document.getElementById('networkAbyssDivineVaultOverlay').style.display = 'block';
    document.getElementById('networkAbyssDivineVaultDialog').style.display = 'block';
    renderNetworkAbyssDivineVaultDialog();
}
function closeNetworkAbyssDivineVaultDialog() {
    document.getElementById('networkAbyssDivineVaultOverlay').style.display = 'none';
    document.getElementById('networkAbyssDivineVaultDialog').style.display = 'none';
}
function renderNetworkAbyssDivineVaultDialog() {
    var cache = window._networkAbyssDivineCache || {};
    var vault = cache.beastVault || { list: [], capacity: 5, expandCount: 0 };
    var list = Array.isArray(vault.list) ? vault.list : [];
    var cap = Number.isFinite(Number(vault.capacity)) ? Number(vault.capacity) : 5;
    var expandCount = Number.isFinite(Number(vault.expandCount)) ? Number(vault.expandCount) : 0;
    var infoEl = document.getElementById('networkAbyssDivineVaultInfo');
    var listEl = document.getElementById('networkAbyssDivineVaultList');
    var expandBtn = document.getElementById('networkAbyssDivineVaultExpandBtn');
    if (infoEl) infoEl.textContent = '容量：' + list.length + '/' + cap + '（上限100）';
    if (expandBtn) {
        var nextCost = 100 + expandCount * 50;
        expandBtn.textContent = (cap >= 100) ? '容量已满（100）' : ('扩容 +5（' + nextCost + '联网币）');
        expandBtn.disabled = cap >= 100;
        expandBtn.style.opacity = cap >= 100 ? '0.6' : '1';
        expandBtn.style.cursor = cap >= 100 ? 'not-allowed' : 'pointer';
    }
    if (!listEl) return;
    if (list.length <= 0) {
        listEl.innerHTML = '<div style="color:#8aa; padding:8px;">仓库为空</div>';
        return;
    }
    var html = '';
    list.forEach(function(b) {
        var name = (b && b.name) ? b.name : '神兽';
        var g = b && b.growth ? b.growth : {};
        html += '<div style="padding:8px;margin-bottom:6px;background:rgba(0,0,0,0.3);border-radius:6px;border:1px solid #2f6d69;">'
            + '<div style="color:#b2dfdb;font-weight:bold;">' + name + '</div>'
            + '<div style="font-size:11px;color:#9bd;">攻' + (g.atk || 0) + ' 防' + (g.def || 0) + ' 体' + (g.hp || 0) + ' 速' + (g.speed || 0) + '</div>'
            + '<div style="margin-top:6px;"><button type="button" onclick="withdrawNetworkAbyssDivineBeast(\'' + (b.id || '') + '\')" style="padding:4px 10px;background:#26a69a;color:#fff;border:none;border-radius:5px;cursor:pointer;">取出到神兽列表</button></div>'
            + '</div>';
    });
    listEl.innerHTML = html;
}
function withdrawNetworkAbyssDivineBeast(beastId) {
    if (!beastId || typeof goldGameAbyssDivineWithdrawBeast !== 'function') return;
    goldGameAbyssDivineWithdrawBeast(beastId).then(function(res) {
        if (!res || !res.ok) throw new Error((res && res.message) || '取出失败');
        return goldGameGetNetworkAbyssDivine();
    }).then(function() {
        refreshNetworkAbyssDivinePanel();
        renderNetworkAbyssDivineVaultDialog();
    }).catch(function(e) { alert((e && e.message) || '取出失败'); });
}
function expandNetworkAbyssDivineVault() {
    if (typeof goldGameAbyssDivineExpandVault !== 'function') return;
    goldGameAbyssDivineExpandVault().then(function(res) {
        if (!res || !res.ok) throw new Error((res && res.message) || '扩容失败');
        return Promise.all([
            (typeof goldGameGetNetworkCoin === 'function' ? goldGameGetNetworkCoin().catch(function(){}) : Promise.resolve()),
            goldGameGetNetworkAbyssDivine()
        ]);
    }).then(function() {
        refreshNetworkAbyssDivinePanel();
        renderNetworkAbyssDivineVaultDialog();
    }).catch(function(e) { alert((e && e.message) || '扩容失败'); });
}
function switchNetworkAbyssDivineTab(tab) {
    window._networkAbyssDivineTab = tab;
    window._networkAbyssDivineSelectedBeastId = null;
    window._networkAbyssDivineSelectedEquipId = null;
    window._networkAbyssDivineSelectedNeidanId = null;
    window._networkAbyssDivineSelectedShoujueId = null;
    if (tab !== 'speciesCodex') window._networkAbyssDivineSelectedSpeciesId = null;
    var btnIds = ['tabAbyssBeast','tabAbyssPetEquip','tabAbyssPetNeidan','tabAbyssPetShoujue','tabAbyssSpeciesCodex'];
    var tabs = ['beast','petEquip','petNeidan','petShoujue','speciesCodex'];
    for (var i = 0; i < 5; i++) {
        var b = document.getElementById(btnIds[i]);
        if (b) { b.style.background = (tabs[i] === tab) ? '#6a1b9a' : '#444'; b.style.color = (tabs[i] === tab) ? '#fff' : '#ccc'; }
    }
    var headText = { beast: '已出战神兽 · 神兽列表', petEquip: '深渊宠物装备', petNeidan: '深渊宠物内丹', petShoujue: '深渊宠物兽决', speciesCodex: '神兽图鉴（每品种一格）' };
    var headEl = document.getElementById('networkAbyssDivineListHead');
    if (headEl) headEl.textContent = headText[tab] || '列表';
    refreshNetworkAbyssDivinePanel();
}
function selectNetworkAbyssDivineBeast(id) { window._networkAbyssDivineSelectedBeastId = id; refreshNetworkAbyssDivinePanel(); }
function selectNetworkAbyssDivineSpeciesCodex(sid) { window._networkAbyssDivineSelectedSpeciesId = sid; refreshNetworkAbyssDivinePanel(); }
function selectNetworkAbyssDivineEquip(id) { window._networkAbyssDivineSelectedEquipId = id; refreshNetworkAbyssDivinePanel(); }
function selectNetworkAbyssDivineNeidan(id) { window._networkAbyssDivineSelectedNeidanId = id; refreshNetworkAbyssDivinePanel(); }
function selectNetworkAbyssDivineShoujue(id) { window._networkAbyssDivineSelectedShoujueId = id; refreshNetworkAbyssDivinePanel(); }
function formatAbyssBeastInfo(beast) {
    if (!beast) return '<div style="color:#888;">无数据</div>';
    var g = beast.growth || {};
    var speciesName = beast.speciesName || '未知品种';
    var displayName = beast.name || speciesName || '神兽';
    var speciesDesc = beast.speciesDesc || '该品种暂未配置说明。';
    var typeName = (beast.type === 'atk' ? '攻击型' : beast.type === 'def' ? '防御型' : beast.type === 'hp' ? '体力型' : '平衡型');
    var rareHtml = beast.wild ? '<span style="color:#90a4ae;font-size:11px;">野生</span> ' : (beast.super ? '<span style="color:#ff5722;font-size:11px;">超级</span> ' : (beast.shiny ? '<span style="color:#ffeb3b;font-size:11px;">闪光</span> ' : (beast.variant ? '<span style="color:#ffd700;font-size:11px;">变异</span> ' : '<span style="color:#b0bec5;font-size:11px;">宝宝</span> ')));
    var eqq = beast.equippedEquip || { '项圈': null, '护腕': null, '铠甲': null };
    var slotNames = ['项圈', '护腕', '铠甲'];
    var eqLines = slotNames.map(function(s) {
        var o = eqq[s];
        var txt = s + ': ' + (o ? (o.prefix || '') + (o.name || '') + (o.atkPct ? ' 攻+' + o.atkPct + '%' : '') + (o.defPct ? ' 防+' + o.defPct + '%' : '') + (o.hpPct ? ' 体+' + o.hpPct + '%' : '') + (o.skill ? ' [' + (o.skill.name || o.skill.id) + ']' : '') : '空');
        return '<div style="padding:4px 8px;background:rgba(0,0,0,0.25);border-radius:4px;border:1px solid #555;font-size:12px;"><span style="color:#aaa;">' + s + '</span><span style="color:#e0e0e0;margin-left:8px;">' + (o ? (o.prefix || '') + (o.name || '') + (o.atkPct ? ' 攻+' + o.atkPct + '%' : '') + (o.defPct ? ' 防+' + o.defPct + '%' : '') + (o.hpPct ? ' 体+' + o.hpPct + '%' : '') + (o.skill ? ' [' + (o.skill.name || o.skill.id) + ']' : '') : '空') + '</span></div>';
    }).join('');
    var neidanText = beast.equippedNeidan ? (beast.equippedNeidan.name || '内丹') + (beast.equippedNeidan.tier ? '（' + (beast.equippedNeidan.tier === 'high' ? '高阶' : beast.equippedNeidan.tier === 'mid' ? '中阶' : '初阶') + '）' : '') + (beast.equippedNeidan.level ? ' Lv.' + beast.equippedNeidan.level + '/5' : '') : '未装备';
    return '<div style="margin-bottom:8px;"><span style="color:#ce93d8;font-size:16px;font-weight:bold;">' + displayName + '</span> <span style="color:#ffeb3b;font-size:12px;">[' + speciesName + ']</span> ' + rareHtml + '<span style="color:#81c784;font-size:11px;">' + typeName + '</span> <span style="color:#b388ff;font-size:11px;">入场Lv.1</span></div>' +
        '<div style="font-size:11px;color:#b388ff;margin-bottom:10px;">品种特色：' + speciesDesc + '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;font-size:13px;"><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">攻击资质 <span style="color:#ff9800">' + (g.atk || 0) + '</span></div><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">防御资质 <span style="color:#2196f3">' + (g.def || 0) + '</span></div><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">体力资质 <span style="color:#4caf50">' + (g.hp || 0) + '</span></div><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">速度资质 <span style="color:#9c27b0">' + (g.speed || 0) + '</span></div></div>' +
        '<div style="font-size:12px;color:#b388ff;margin-bottom:10px;">技能: ' + ((beast.skills && beast.skills.length) ? beast.skills.map(function(s){ return s.name || s.id; }).join('、') : '无') + '</div>' +
        '<div style="margin-top:10px;border-top:1px solid #333;padding-top:8px;"><div style="font-size:12px;color:#ffb74d;margin-bottom:6px;">宠物装备</div><div style="display:flex;flex-direction:column;gap:4px;">' + eqLines + '</div></div>' +
        '<div style="margin-top:10px;border-top:1px solid #333;padding-top:8px;"><div style="font-size:12px;color:#ffb74d;margin-bottom:4px;">宠物内丹</div><div style="font-size:12px;color:#e0e0e0;">' + neidanText + '</div></div>';
}
function showNetworkAbyssBeastInfo(beast) {
    var el = document.getElementById('networkAbyssBeastInfoContent');
    if (el) el.innerHTML = formatAbyssBeastInfo(beast);
    document.getElementById('networkAbyssBeastInfoOverlay').style.display = 'block';
    document.getElementById('networkAbyssBeastInfoDialog').style.display = 'block';
}
function showNetworkAbyssBeastInfoById(beastId) {
    var cache = window._networkAbyssDivineCache;
    if (!cache || !cache.beasts) return;
    var beast = cache.beasts.filter(function(b){ return b.id === beastId; })[0];
    if (beast) showNetworkAbyssBeastInfo(beast);
}
function refreshNetworkAbyssDivinePanel() {
    var cache = window._networkAbyssDivineCache;
    if (!cache) return;
    var tab = window._networkAbyssDivineTab || 'beast';
    var beasts = cache.beasts || [];
    var headText = { beast: '已出战神兽 · 神兽列表', petEquip: '深渊宠物装备', petNeidan: '深渊宠物内丹', petShoujue: '深渊宠物兽决', speciesCodex: '神兽图鉴（每品种一格）' };
    var headEl = document.getElementById('networkAbyssDivineListHead');
    if (headEl) {
        if (tab === 'beast') headEl.innerHTML = (headText[tab] || '列表') + ' <span id="networkAbyssDivineBeastCount" style="color:#ce93d8;">' + beasts.length + '/10</span>';
        else if (tab === 'speciesCodex') {
            var ccn = (cache.speciesCodex || []).length;
            headEl.innerHTML = (headText[tab] || '列表') + ' <span style="color:#ce93d8;">' + ccn + ' 品种</span>';
        } else headEl.textContent = headText[tab] || '列表';
    }
    var equippedId = cache.equippedId;
    var petEquip = cache.petEquip || [];
    var petNeidan = cache.petNeidan || [];
    var petShoujue = cache.petShoujue || [];
    var listEl = document.getElementById('networkAbyssDivineList');
    var detailEl = document.getElementById('networkAbyssDivineDetail');
    var actionsEl = document.getElementById('networkAbyssDivineDetailActions');
    if (!listEl || !detailEl) return;

    function resolveClientAbyssBeastSpeciesId(beast, catalog) {
        if (!beast || !catalog || !catalog.length) return null;
        if (beast.speciesId) return String(beast.speciesId);
        if (beast.speciesName) {
            for (var ci = 0; ci < catalog.length; ci++) { if (catalog[ci].name === beast.speciesName) return String(catalog[ci].id); }
        }
        if (beast.name) {
            for (var cj = 0; cj < catalog.length; cj++) { if (catalog[cj].name === beast.name) return String(catalog[cj].id); }
        }
        return null;
    }

    if (tab === 'speciesCodex') {
        var catalog = (cache.speciesCatalog || []).slice();
        catalog.sort(function(a, b) {
            var fa = Number(a.minFloor) || 0, fb = Number(b.minFloor) || 0;
            if (fa !== fb) return fa - fb;
            return String(a.name || '').localeCompare(String(b.name || ''));
        });
        var codexArr = cache.speciesCodex || [];
        var codexMap = {};
        for (var cx = 0; cx < codexArr.length; cx++) {
            if (codexArr[cx] && codexArr[cx].speciesId) codexMap[String(codexArr[cx].speciesId)] = codexArr[cx];
        }
        var listHtml = '';
        for (var li = 0; li < catalog.length; li++) {
            var sp = catalog[li];
            var sid = String(sp.id || '');
            var has = !!codexMap[sid];
            var selSp = window._networkAbyssDivineSelectedSpeciesId === sid;
            listHtml += '<div style="padding:6px 8px;margin-bottom:3px;background:' + (selSp ? 'rgba(106,27,154,0.45)' : 'rgba(0,0,0,0.28)') + ';border-radius:6px;border-left:3px solid ' + (selSp ? '#ce93d8' : (has ? '#81c784' : 'transparent')) + ';cursor:pointer;font-size:12px;" onclick="selectNetworkAbyssDivineSpeciesCodex(\'' + sid.replace(/'/g, "\\'") + '\')">' +
                '<span style="color:' + (has ? '#a5d6a7' : '#888') + ';">' + (has ? '●' : '○') + '</span> ' +
                '<span style="color:#e0e0e0;">' + (sp.name || sid) + '</span>' +
                '<span style="color:#666;font-size:11px;margin-left:4px;">' + (sp.minFloor != null ? sp.minFloor + '层+' : '') + '</span></div>';
        }
        listEl.innerHTML = listHtml || '<div style="color:#888;padding:8px;">暂无品种配置（请重新打开面板同步）</div>';

        var selSpecies = window._networkAbyssDivineSelectedSpeciesId;
        if (!selSpecies && catalog.length) selSpecies = String(catalog[0].id || '');
        window._networkAbyssDivineSelectedSpeciesId = selSpecies;
        var nCodex = codexArr.length;
        var growBonus = nCodex * 30;
        var wmAdd = 0;
        var sortedC = codexArr.slice().sort(function(a, b) { return (Number(a.placedAt) || 0) - (Number(b.placedAt) || 0); });
        for (var wi = 0; wi < sortedC.length; wi++) { wmAdd += abyssDivineCodexTierWeight(wi + 1); }
        var wmMul = 1 + wmAdd;
        var summaryExtra = '<div style="font-size:11px;color:#b388ff;margin-top:10px;line-height:1.55;border-top:1px solid #4a1942;padding-top:8px;">' +
            '<strong>图鉴效果</strong><br/>' +
            '· 无限深渊：出战「深渊神兽」入场时，攻/防/体/速资质各 <strong style="color:#ffb74d;">+' + growBonus + '</strong>（按当前已登记 <strong>' + nCodex + '</strong> 品种 ×30）。<br/>' +
            '· 世界地图：生命、攻击、爆伤额外乘区 <strong style="color:#81d4fa;">×' + wmMul.toFixed(0) + '</strong>（累加档 +' + wmAdd + '；按登记先后顺序：1–5 各+1，6–10 各+5，11–15 各+10，16–20 各+50，21–25 各+100，26–30 各+500，31–35 各+1000，36–40 各+5000，41–45 各+10000，46–50 各+50000，51–55 各+100000，56–60 各+500000，61–65 各+1000000，66–70 各+5000000，71–75 各+10000000，76+20000000，77+40000000，78+50000000，79+70000000，80+100000000，81 起各+1000000000）。<br/>' +
            '· 每品种仅可登记一只；登记后从神兽列表移入图鉴，取下后回到列表。需先卸下出战再登记。</div>';

        if (!selSpecies || !catalog.length) {
            detailEl.innerHTML = '<div style="color:#888;text-align:center;padding:24px;">请选择左侧品种' + summaryExtra + '</div>';
            if (actionsEl) actionsEl.innerHTML = '';
            return;
        }
        var spInfo = null;
        for (var sk = 0; sk < catalog.length; sk++) { if (String(catalog[sk].id) === String(selSpecies)) { spInfo = catalog[sk]; break; } }
        var entry = codexMap[String(selSpecies)];
        if (entry && entry.beast) {
            var eb = entry.beast;
            var g0 = eb.growth || {};
            detailEl.innerHTML = '<div style="color:#ce93d8;font-size:15px;margin-bottom:6px;">已登记：' + (spInfo && spInfo.name ? spInfo.name : selSpecies) + '</div>' +
                '<div style="font-size:12px;color:#aaa;">登记于图鉴的神兽：' + (eb.name || '—') + '</div>' +
                '<div style="font-size:12px;color:#e0e0e0;margin-top:8px;">资质 攻' + (g0.atk || 0) + ' 防' + (g0.def || 0) + ' 体' + (g0.hp || 0) + ' 速' + (g0.speed || 0) + '</div>' + summaryExtra;
            if (actionsEl) {
                actionsEl.innerHTML = '<button type="button" onclick="goldGameAbyssDivineSpeciesCodexRemove(\'' + String(selSpecies).replace(/'/g, "\\'") + '\').then(function(r){ if(!r||!r.ok) throw new Error((r&&r.message)||\'失败\'); return goldGameGetNetworkAbyssDivine(); }).then(function(){ refreshNetworkAbyssDivinePanel(); if(typeof updatePlayerBattleStats===\'function\') updatePlayerBattleStats(); }).catch(function(e){ alert(e.message||\'失败\'); });" style="padding:8px 14px;font-size:12px;background:#00796b;color:#fff;border:none;border-radius:6px;cursor:pointer;">取下回到神兽列表</button>';
            }
            return;
        }
        var candidates = beasts.filter(function(b) { return resolveClientAbyssBeastSpeciesId(b, catalog) === String(selSpecies); });
        var opts = '<option value="">选择要登记的神兽…</option>';
        for (var oi = 0; oi < candidates.length; oi++) {
            var cb = candidates[oi];
            var g1 = cb.growth || {};
            opts += '<option value="' + (cb.id || '').replace(/"/g, '') + '">' + (cb.name || '神兽') + '（攻' + (g1.atk || 0) + '）</option>';
        }
        detailEl.innerHTML = '<div style="color:#ffcc80;font-size:15px;margin-bottom:6px;">未登记：' + (spInfo && spInfo.name ? spInfo.name : selSpecies) + '</div>' +
            '<div style="font-size:12px;color:#aaa;">解锁层数：' + (spInfo && spInfo.minFloor != null ? spInfo.minFloor + ' 层以上可掉落该品种' : '—') + '</div>' +
            '<div style="margin-top:12px;"><label style="font-size:12px;color:#b388ff;">从神兽列表放入</label><br/>' +
            '<select id="networkAbyssSpeciesCodexPickBeast" style="width:100%;margin-top:6px;padding:8px;background:#1a0a2e;color:#fff;border:1px solid #b388ff;border-radius:6px;">' + opts + '</select></div>' +
            (candidates.length ? '' : '<div style="font-size:12px;color:#f48fb1;margin-top:8px;">列表中暂无该品种神兽（请从无限深渊获取或从仓库取出）。</div>') +
            summaryExtra;
        if (actionsEl) {
            if (candidates.length) {
                actionsEl.innerHTML = '<button type="button" onclick="(function(){ var el=document.getElementById(\'networkAbyssSpeciesCodexPickBeast\'); var bid=el&&el.value; if(!bid){ alert(\'请选择神兽\'); return; } goldGameAbyssDivineSpeciesCodexPlace(bid).then(function(r){ if(!r||!r.ok) throw new Error((r&&r.message)||\'失败\'); return goldGameGetNetworkAbyssDivine(); }).then(function(){ refreshNetworkAbyssDivinePanel(); if(typeof updatePlayerBattleStats===\'function\') updatePlayerBattleStats(); }).catch(function(e){ alert(e.message||\'失败\'); }); })();" style="padding:8px 14px;font-size:12px;background:#6a1b9a;color:#fff;border:none;border-radius:6px;cursor:pointer;">放入图鉴</button>';
            } else actionsEl.innerHTML = '';
        }
        return;
    }

    if (tab === 'beast') {
        var eqBeast = beasts.filter(function(b){ return b.id === equippedId; })[0];
        var selectedId = window._networkAbyssDivineSelectedBeastId;
        var html = '';
        if (eqBeast) {
            html += '<div style="padding:6px 8px;margin-bottom:6px;background:rgba(106,27,154,0.35);border-radius:6px;border:1px solid #ce93d8;cursor:pointer;" onclick="selectNetworkAbyssDivineBeast(\'' + (eqBeast.id || '') + '\')" data-id="' + (eqBeast.id || '') + '"><span style="color:#ce93d8;font-size:12px;">★ 出战</span><br/><span style="color:#fff;">' + (eqBeast.name || '神兽') + '</span></div>';
        }
        beasts.forEach(function(b) {
            var isEquipped = b.id === equippedId;
            var sel = b.id === selectedId;
            html += '<div style="padding:8px;margin-bottom:4px;background:' + (sel ? 'rgba(106,27,154,0.5)' : 'rgba(0,0,0,0.3)') + ';border-radius:6px;border-left:3px solid ' + (sel ? '#ce93d8' : 'transparent') + ';cursor:pointer;" onclick="selectNetworkAbyssDivineBeast(\'' + (b.id || '') + '\')" data-id="' + (b.id || '') + '"><span style="color:#e0e0e0;font-size:13px;">' + (b.name || '神兽') + '</span></div>';
        });
        listEl.innerHTML = html || '<div style="color:#888;padding:8px;">暂无神兽</div>';

        if (selectedId) {
            var beast = beasts.filter(function(b){ return b.id === selectedId; })[0];
            if (beast) {
                var g = beast.growth || {};
                var typeName = (beast.type === 'atk' ? '攻击型' : beast.type === 'def' ? '防御型' : beast.type === 'hp' ? '体力型' : '平衡型');
                var rareHtml = beast.wild ? '<span style="color:#90a4ae;font-size:11px;">野生</span> ' : (beast.super ? '<span style="color:#ff5722;font-size:11px;">超级</span> ' : (beast.shiny ? '<span style="color:#ffeb3b;font-size:11px;">闪光</span> ' : (beast.variant ? '<span style="color:#ffd700;font-size:11px;">变异</span> ' : '<span style="color:#b0bec5;font-size:11px;">宝宝</span> ')));
                var eqq = beast.equippedEquip || { '项圈': null, '护腕': null, '铠甲': null };
                var slotNames = ['项圈', '护腕', '铠甲'];
                var bid = beast.id || '';
                var eqSlotHtml = slotNames.map(function(s) {
                    var o = eqq[s];
                    var nameStr = o ? (o.prefix || '') + (o.name || '') + (o.atkPct ? ' 攻+' + o.atkPct + '%' : '') + (o.defPct ? ' 防+' + o.defPct + '%' : '') + (o.hpPct ? ' 体+' + o.hpPct + '%' : '') + (o.skill ? ' [' + (o.skill.name || o.skill.id) + ']' : '') : '空';
                    var btn = o ? '<button type="button" onclick="goldGameAbyssDivineUnequipPetEquip(\'' + bid + '\', \'' + s + '\').then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ refreshNetworkAbyssDivinePanel(); }); }).catch(function(e){ alert(e.message); });" style="margin-left:8px;padding:2px 8px;font-size:11px;background:#555;color:#fff;border:none;border-radius:4px;cursor:pointer;">卸下</button>' : '';
                    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 8px;background:rgba(0,0,0,0.25);border-radius:4px;border:1px solid #555;"><span style="color:#aaa;">' + s + '</span><span style="display:flex;align-items:center;"><span style="color:#e0e0e0;font-size:12px;">' + nameStr + '</span>' + btn + '</span></div>';
                }).join('');
                var neidanText = '未装备';
                if (beast.equippedNeidan) {
                    var nd = beast.equippedNeidan;
                    var ndLvCur = Math.max(1, nd.level || 1);
                    var baseText = (nd.name || '内丹')
                        + (nd.tier ? '（' + (nd.tier === 'high' ? '高阶' : nd.tier === 'mid' ? '中阶' : '初阶') + '）' : '')
                        + ' Lv.' + ndLvCur + '/15';
                    var ndMult = 1 + (ndLvCur - 1) * 0.2;
                    var ndLabels = { atkPct: '攻', defPct: '防', hpPct: '体', critRate: '暴击率', critDmg: '暴伤', lifestealPct: '吸血', dodge: '闪避', damageReduction: '减伤', reduceMonsterDef: '破防', vulnerablePct: '易伤', goldPct: '金币', expPct: '经验' };
                    function fmtNdLine(obj, mult) {
                        if (!obj || typeof obj !== 'object') return '';
                        mult = mult != null && mult > 0 ? mult : 1;
                        var parts = [];
                        for (var k in obj) if (obj.hasOwnProperty(k) && typeof obj[k] === 'number') {
                            var v = mult !== 1 ? Math.round(obj[k] * mult) : obj[k];
                            parts.push((ndLabels[k] || k) + '+' + v + '%');
                        }
                        return parts.join(' ');
                    }
                    var effPet = fmtNdLine(nd.pet, ndMult);
                    var effPlayer = fmtNdLine(nd.player, ndMult);
                    var effGlobal = fmtNdLine(nd.global, ndMult);
                    var effParts = [];
                    if (effPet) effParts.push('宠物: ' + effPet);
                    if (effPlayer) effParts.push('玩家: ' + effPlayer);
                    if (effGlobal) effParts.push('全局: ' + effGlobal);
                    neidanText = baseText + (effParts.length ? ' - ' + effParts.join('；') : '');
                }
                var speciesName = beast.speciesName || '未知品种';
                var displayName = beast.name || speciesName || '神兽';
                var speciesDesc = beast.speciesDesc || '该品种暂未配置说明。';
                var neidanBtn = beast.equippedNeidan ? '<button type="button" onclick="goldGameAbyssDivineUnequipNeidan(\'' + bid + '\').then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ refreshNetworkAbyssDivinePanel(); }); }).catch(function(e){ alert(e.message); });" style="margin-top:6px;padding:4px 10px;font-size:11px;background:#5d4037;color:#ffccbc;border:none;border-radius:4px;cursor:pointer;">卸下内丹</button>' : '';
                detailEl.innerHTML = '<div style="margin-bottom:8px;"><span style="color:#ce93d8;font-size:16px;font-weight:bold;">' + displayName + '</span> <span style="color:#ffeb3b;font-size:12px;">[' + speciesName + ']</span> ' + rareHtml + '<span style="color:#81c784;font-size:11px;">' + typeName + '</span> <span style="color:#b388ff;font-size:11px;">入场Lv.1</span></div>' +
                    '<div style="font-size:11px;color:#b388ff;margin-bottom:10px;">品种特色：' + speciesDesc + '</div>' +
                    '<div style="margin-bottom:6px;"><div style="font-size:11px;color:#aaa;">气血</div><div style="height:18px;background:#333;border-radius:4px;overflow:hidden;"><div style="height:100%;width:100%;background:linear-gradient(90deg,#333,#444);border-radius:4px;"></div></div><div style="font-size:11px;color:#888;">入场后根据层数计算</div></div>' +
                    '<div style="margin-bottom:12px;"><div style="font-size:11px;color:#aaa;">经验</div><div style="height:12px;background:#333;border-radius:3px;overflow:hidden;"><div style="height:100%;width:0%;background:linear-gradient(90deg,#ffa726,#ffd54f);border-radius:3px;"></div></div><div style="font-size:11px;color:#888;">入场后获得</div></div>' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;font-size:13px;"><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">攻击资质 <span style="color:#ff9800">' + (g.atk || 0) + '</span></div><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">防御资质 <span style="color:#2196f3">' + (g.def || 0) + '</span></div><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">体力资质 <span style="color:#4caf50">' + (g.hp || 0) + '</span></div><div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;">速度资质 <span style="color:#9c27b0">' + (g.speed || 0) + '</span></div></div>' +
                    '<div style="font-size:11px;color:#aaa;margin-bottom:4px;">属性 入场后根据资质与等级计算</div>' +
                    '<div style="font-size:11px;color:#b388ff;margin-bottom:8px;">技能: ' + ((beast.skills && beast.skills.length) ? beast.skills.map(function(s){ return s.name || s.id; }).join('、') : '无') + '</div>' +
                    '<div style="margin-top:10px;border-top:1px solid #333;padding-top:8px;"><div style="font-size:12px;color:#ffb74d;margin-bottom:6px;">宠物装备</div><div style="display:flex;flex-direction:column;gap:4px;">' + eqSlotHtml + '</div></div>' +
                    '<div style="margin-top:10px;border-top:1px solid #333;padding-top:8px;"><div style="font-size:12px;color:#ffb74d;margin-bottom:4px;">宠物内丹</div><div style="font-size:11px;color:#e0e0e0;">' + neidanText + '</div>' + neidanBtn + '</div>';
                if (actionsEl) {
                    var isEquipped = beast.id === equippedId;
                    actionsEl.innerHTML =
                        (isEquipped ? '<button type="button" onclick="goldGameAbyssDivineUnequipBeast().then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ refreshNetworkAbyssDivinePanel(); }); }).catch(function(e){ alert(e.message); });" style="padding:6px 12px;font-size:12px;background:#c62828;color:#fff;border:none;border-radius:6px;cursor:pointer;">卸下</button>' :
                        '<button type="button" onclick="goldGameAbyssDivineEquipBeast(\'' + (beast.id || '') + '\').then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ refreshNetworkAbyssDivinePanel(); }); }).catch(function(e){ alert(e.message); });" style="padding:6px 12px;font-size:12px;background:#6a1b9a;color:#fff;border:none;border-radius:6px;cursor:pointer;">出战</button>') +
                        '<button type="button" onclick="openNetworkAbyssDivineShoujueBag(\'' + (beast.id || '') + '\')" style="padding:6px 12px;font-size:12px;background:#e91e63;color:#fff;border:none;border-radius:6px;cursor:pointer;">深渊宠物兽决打书</button>' +
                        '<button type="button" onclick="openNetworkAbyssDivineEquipBag(\'' + (beast.id || '') + '\')" style="padding:6px 12px;font-size:12px;background:#ff9800;color:#fff;border:none;border-radius:6px;cursor:pointer;">装备背包</button>' +
                        '<button type="button" onclick="openNetworkAbyssDivineNeidanBag(\'' + (beast.id || '') + '\')" style="padding:6px 12px;font-size:12px;background:#ffb74d;color:#1a1a1a;border:none;border-radius:6px;cursor:pointer;">内丹背包</button>' +
                        '<button type="button" onclick="goldGameAbyssDivineStoreBeast(\'' + (beast.id || '') + '\').then(function(r){ if(!r||!r.ok) throw new Error((r&&r.message)||\'存入失败\'); return goldGameGetNetworkAbyssDivine(); }).then(function(){ window._networkAbyssDivineSelectedBeastId=null; refreshNetworkAbyssDivinePanel(); renderNetworkAbyssDivineVaultDialog(); }).catch(function(e){ alert(e.message); });" style="padding:6px 12px;font-size:12px;background:#00796b;color:#fff;border:none;border-radius:6px;cursor:pointer;">存仓库</button>' +
                        '<button type="button" onclick="openNetworkAbyssDivineRenameBeast(\'' + (beast.id || '') + '\', \'' + (beast.name || speciesName || '神兽').replace(/'/g, "\\'") + '\')" style="padding:6px 12px;font-size:12px;background:#7b1fa2;color:#fff;border:none;border-radius:6px;cursor:pointer;">改名</button>' +
                        '<button type="button" onclick="openNetworkAbyssDivineSellDialog(\'abyssBeast\', \'' + (beast.id || '') + '\', \'' + (beast.name || '神兽').replace(/'/g, "\\'") + '\');" style="padding:6px 12px;font-size:12px;background:#2196f3;color:#fff;border:none;border-radius:6px;cursor:pointer;">上架</button>' +
                        '<button type="button" onclick="if(confirm(\'放生后装备与内丹将退回背包，确定放生？\')) goldGameAbyssDivineReleaseBeast(\'' + (beast.id || '') + '\').then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ window._networkAbyssDivineSelectedBeastId=null; refreshNetworkAbyssDivinePanel(); }); }).catch(function(e){ alert(e.message); });" style="padding:6px 12px;font-size:12px;background:#5d4037;color:#fff;border:none;border-radius:6px;cursor:pointer;">放生</button>';
                }
                return;
            }
        }
        detailEl.innerHTML = '<div style="color:#888;text-align:center;padding:40px 20px;">选择左侧神兽查看详情</div>';
        if (actionsEl) actionsEl.innerHTML = '';
        return;
    }

    if (tab === 'petEquip') {
        var html = '';
        petEquip.forEach(function(e) {
            var sel = e.id === window._networkAbyssDivineSelectedEquipId;
            var skillTag = e.skill ? ' <span style="color:#b388ff;font-size:11px;">[' + (e.skill.name || e.skill.id) + ']</span>' : '';
            html += '<div style="padding:8px;margin-bottom:4px;background:' + (sel ? 'rgba(255,183,77,0.25)' : 'rgba(0,0,0,0.3)') + ';border-radius:6px;border-left:3px solid ' + (sel ? '#ffb74d' : 'transparent') + ';cursor:pointer;" onclick="selectNetworkAbyssDivineEquip(\'' + (e.id || '') + '\')">' + (e.name || '装备') + skillTag + '</div>';
        });
        listEl.innerHTML = html || '<div style="color:#888;padding:8px;">暂无</div>';
        var selEquip = petEquip.filter(function(e){ return e.id === window._networkAbyssDivineSelectedEquipId; })[0];
        if (selEquip) {
            var skillName = selEquip.skill ? (selEquip.skill.name || selEquip.skill.id) : '';
            var skillEffect = (selEquip.skill && typeof getAbyssPetSkillEffect === 'function') ? getAbyssPetSkillEffect(selEquip.skill.id || selEquip.skillId) : '';
            var skillHtml = '';
            if (selEquip.skill) {
                skillHtml = '<div style="font-size:12px;color:#b388ff;margin-top:4px;">技能: ' + skillName + (skillEffect ? ' <span style="color:#ce93d8;">- ' + skillEffect + '</span>' : '') + '</div>';
            }
            detailEl.innerHTML = '<div style="color:#ffb74d;font-size:15px;margin-bottom:8px;">' + (selEquip.name || '装备') + '</div>' +
                '<div style="font-size:12px;">槽位: ' + (selEquip.slotType || '—') + '</div>' +
                '<div style="font-size:12px;">' + (selEquip.atkPct ? '攻+' + selEquip.atkPct + '% ' : '') + (selEquip.defPct ? '防+' + selEquip.defPct + '% ' : '') + (selEquip.hpPct ? '体+' + selEquip.hpPct + '%' : '') + '</div>' +
                skillHtml;
            if (actionsEl) actionsEl.innerHTML = '<button type="button" onclick="openNetworkAbyssDivineSellDialog(\'abyssPetEquip\', \'' + (selEquip.id || '') + '\', \'' + (selEquip.name || '装备').replace(/'/g, "\\'") + '\');" style="padding:6px 12px;font-size:12px;background:#2196f3;color:#fff;border:none;border-radius:6px;cursor:pointer;">上架</button><button type="button" onclick="if(confirm(\'确定丢弃？不可恢复。\')) goldGameAbyssDivineDiscardPetEquip(\'' + (selEquip.id || '') + '\').then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ window._networkAbyssDivineSelectedEquipId=null; refreshNetworkAbyssDivinePanel(); }); }).catch(function(e){ alert(e.message); });" style="padding:6px 12px;font-size:12px;background:#c62828;color:#fff;border:none;border-radius:6px;cursor:pointer;">丢弃</button>';
        } else { detailEl.innerHTML = '<div style="color:#888;text-align:center;padding:40px 20px;">选择左侧装备查看详情</div>'; if (actionsEl) actionsEl.innerHTML = ''; }
        return;
    }

    if (tab === 'petNeidan') {
        var html = '';
        petNeidan.forEach(function(n) {
            var sel = n.id === window._networkAbyssDivineSelectedNeidanId;
            var lv = n.level || 1;
            html += '<div style="padding:8px;margin-bottom:4px;background:' + (sel ? 'rgba(255,204,128,0.25)' : 'rgba(0,0,0,0.3)') + ';border-radius:6px;border-left:3px solid ' + (sel ? '#ffcc80' : 'transparent') + ';cursor:pointer;" onclick="selectNetworkAbyssDivineNeidan(\'' + (n.id || '') + '\')">' + (n.name || '内丹') + ' Lv.' + lv + '</div>';
        });
        listEl.innerHTML = html || '<div style="color:#888;padding:8px;">暂无</div>';
        var selN = petNeidan.filter(function(n){ return n.id === window._networkAbyssDivineSelectedNeidanId; })[0];
        if (selN) {
            var ndLv = Math.max(1, selN.level || 1);
            var sameNameLevelCount = petNeidan.filter(function(n){ return (n.name || '') === (selN.name || '') && Math.max(1, n.level || 1) === ndLv; }).length;
            var canUpgrade = ndLv < 15 && sameNameLevelCount >= 3;
            function fmtNeidanBonus(obj, mult) {
                if (!obj || typeof obj !== 'object') return '';
                mult = mult != null && mult > 0 ? mult : 1;
                var labels = { atkPct: '攻', defPct: '防', hpPct: '体', critRate: '暴击率', critDmg: '暴伤', lifestealPct: '吸血', dodge: '闪避', damageReduction: '减伤', reduceMonsterDef: '破防', vulnerablePct: '易伤', goldPct: '金币', expPct: '经验' };
                var parts = [];
                for (var k in obj) if (obj.hasOwnProperty(k) && typeof obj[k] === 'number') { var v = mult !== 1 ? Math.round(obj[k] * mult) : obj[k]; parts.push((labels[k] || k) + '+' + v + '%'); }
                return parts.join(' ');
            }
            var currentMult = 1 + (ndLv - 1) * 0.2;
            var currentPet = fmtNeidanBonus(selN.pet, currentMult);
            var currentPlayer = fmtNeidanBonus(selN.player, currentMult);
            var currentGlobal = fmtNeidanBonus(selN.global, currentMult);
            var nextLv = ndLv + 1;
            var nextMult = 1 + ndLv * 0.2;
            var nextPet = ndLv < 15 ? fmtNeidanBonus(selN.pet, nextMult) : '';
            var nextPlayer = ndLv < 15 ? fmtNeidanBonus(selN.player, nextMult) : '';
            var nextGlobal = ndLv < 15 ? fmtNeidanBonus(selN.global, nextMult) : '';
            var currentBlock = '<div style="margin-bottom:8px;padding:8px;background:rgba(0,0,0,0.25);border-radius:6px;border:1px solid #555;"><div style="font-size:11px;color:#ffcc80;margin-bottom:4px;">当前等级（Lv.' + ndLv + '）加成</div>' + (currentPet ? '<div style="font-size:12px;">宠物: ' + currentPet + '</div>' : '') + (currentPlayer ? '<div style="font-size:12px;">玩家: ' + currentPlayer + '</div>' : '') + (currentGlobal ? '<div style="font-size:12px;">全局: ' + currentGlobal + '</div>' : '') + '</div>';
            var nextBlock = ndLv >= 15 ? '<div style="margin-bottom:8px;padding:8px;background:rgba(0,0,0,0.2);border-radius:6px;border:1px solid #444;"><div style="font-size:11px;color:#888;">升级后加成</div><div style="font-size:12px;color:#666;">已满级（Lv.15）</div></div>' : '<div style="margin-bottom:8px;padding:8px;background:rgba(106,27,154,0.2);border-radius:6px;border:1px solid #7b1fa2;"><div style="font-size:11px;color:#ce93d8;margin-bottom:4px;">升级后（Lv.' + nextLv + '）加成（每级+20%）</div>' + (nextPet ? '<div style="font-size:12px;">宠物: ' + nextPet + '</div>' : '') + (nextPlayer ? '<div style="font-size:12px;">玩家: ' + nextPlayer + '</div>' : '') + (nextGlobal ? '<div style="font-size:12px;">全局: ' + nextGlobal + '</div>' : '') + '</div>';
            detailEl.innerHTML = '<div style="color:#ffcc80;font-size:15px;margin-bottom:8px;">' + (selN.name || '内丹') + '</div>' +
                '<div style="font-size:12px;">等阶: ' + (selN.tier === 'high' ? '高阶' : selN.tier === 'mid' ? '中阶' : '初阶') + ' · 等级 ' + ndLv + '/15</div>' +
                '<div style="font-size:11px;color:#aaa;margin-bottom:6px;">同名同等级 3 个可升级（当前同类 ' + sameNameLevelCount + ' 个）</div>' +
                currentBlock + nextBlock;
            var upgradeBtn = canUpgrade ? '<button type="button" onclick="goldGameAbyssDivineUpgradeNeidan(\'' + (selN.id || '') + '\').then(function(r){ if(r&&r.ok){ goldGameGetNetworkAbyssDivine().then(function(){ window._networkAbyssDivineSelectedNeidanId=(r.neidan&&r.neidan.id)||null; refreshNetworkAbyssDivinePanel(); }); alert(\'升级成功，获得 Lv.' + (ndLv + 1) + ' 内丹\'); } }).catch(function(e){ alert(e.message||\'升级失败\'); });" style="padding:6px 12px;font-size:12px;background:#6a1b9a;color:#ffeb3b;border:none;border-radius:6px;cursor:pointer;">升级（消耗3个同名同等级）</button>' : '';
            if (actionsEl) actionsEl.innerHTML = upgradeBtn + '<button type="button" onclick="openNetworkAbyssDivineSellDialog(\'abyssPetNeidan\', \'' + (selN.id || '') + '\', \'' + (selN.name || '内丹').replace(/'/g, "\\'") + '\');" style="padding:6px 12px;font-size:12px;background:#2196f3;color:#fff;border:none;border-radius:6px;cursor:pointer;">上架</button><button type="button" onclick="if(confirm(\'确定丢弃？不可恢复。\')) goldGameAbyssDivineDiscardPetNeidan(\'' + (selN.id || '') + '\').then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ window._networkAbyssDivineSelectedNeidanId=null; refreshNetworkAbyssDivinePanel(); }); }).catch(function(e){ alert(e.message); });" style="padding:6px 12px;font-size:12px;background:#c62828;color:#fff;border:none;border-radius:6px;cursor:pointer;">丢弃</button>';
        } else { detailEl.innerHTML = '<div style="color:#888;text-align:center;padding:40px 20px;">选择左侧内丹查看详情</div>'; if (actionsEl) actionsEl.innerHTML = ''; }
        return;
    }

    if (tab === 'petShoujue') {
        var html = '';
        petShoujue.forEach(function(s) {
            var sel = s.id === window._networkAbyssDivineSelectedShoujueId;
            html += '<div style="padding:8px;margin-bottom:4px;background:' + (sel ? 'rgba(255,128,171,0.25)' : 'rgba(0,0,0,0.3)') + ';border-radius:6px;border-left:3px solid ' + (sel ? '#ff80ab' : 'transparent') + ';cursor:pointer;" onclick="selectNetworkAbyssDivineShoujue(\'' + (s.id || '') + '\')">' + (s.skillName || s.skillId || '兽决') + '</div>';
        });
        listEl.innerHTML = html || '<div style="color:#888;padding:8px;">暂无</div>';
        var selS = petShoujue.filter(function(s){ return s.id === window._networkAbyssDivineSelectedShoujueId; })[0];
        if (selS) {
            var shoujueEffect = typeof getAbyssPetSkillEffect === 'function' ? getAbyssPetSkillEffect(selS.skillId || selS.skillid) : '';
            detailEl.innerHTML = '<div style="color:#ff80ab;font-size:15px;margin-bottom:8px;">' + (selS.skillName || selS.skillId || '兽决') + '</div>' +
                (shoujueEffect ? '<div style="font-size:12px;color:#b388ff;margin-bottom:8px;">效果：' + shoujueEffect + '</div>' : '') +
                '<div style="font-size:12px;">使用后为深渊神兽增加该技能。请在「深渊神兽」分页选择要打书的神兽后，再点使用。</div>';
            if (actionsEl) {
                var bid = window._networkAbyssDivineSelectedBeastId || (cache.equippedId && beasts.some(function(b){ return b.id === cache.equippedId; }) ? cache.equippedId : (beasts[0] && beasts[0].id));
                var shoujueName = (selS.skillName || selS.skillId || '兽决').replace(/'/g, "\\'");
                actionsEl.innerHTML = '<button type="button" onclick="goldGameAbyssDivineUseShoujue(\'' + (bid || '') + '\', \'' + (selS.id || '') + '\').then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ refreshNetworkAbyssDivinePanel(); }); }).catch(function(e){ alert(e.message); });" style="padding:6px 12px;font-size:12px;background:#6a1b9a;color:#fff;border:none;border-radius:6px;cursor:pointer;">使用（对当前选中/出战神兽）</button><button type="button" onclick="openNetworkAbyssDivineSellDialog(\'abyssPetShoujue\', \'' + (selS.id || '') + '\', \'' + shoujueName + '\');" style="padding:6px 12px;font-size:12px;background:#2196f3;color:#fff;border:none;border-radius:6px;cursor:pointer;">上架</button><button type="button" onclick="if(confirm(\'确定丢弃？不可恢复。\')) goldGameAbyssDivineDiscardPetShoujue(\'' + (selS.id || '') + '\').then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ window._networkAbyssDivineSelectedShoujueId=null; refreshNetworkAbyssDivinePanel(); }); }).catch(function(e){ alert(e.message); });" style="padding:6px 12px;font-size:12px;background:#c62828;color:#fff;border:none;border-radius:6px;cursor:pointer;">丢弃</button>';
            }
        } else { detailEl.innerHTML = '<div style="color:#888;text-align:center;padding:40px 20px;">选择左侧兽决查看详情</div>'; if (actionsEl) actionsEl.innerHTML = ''; }
    }
}
function updateNetworkAbyssDivineSynthesisSkillPool() {
    var el = document.getElementById('networkAbyssDivineSynthesisSkillPool');
    if (!el) return;
    var cache = window._networkAbyssDivineCache;
    var beasts = (cache && cache.beasts) || [];
    var id1 = document.getElementById('networkAbyssDivineSynthesisBeast1') && document.getElementById('networkAbyssDivineSynthesisBeast1').value;
    var id2 = document.getElementById('networkAbyssDivineSynthesisBeast2') && document.getElementById('networkAbyssDivineSynthesisBeast2').value;
    var g1El = document.getElementById('networkAbyssDivineSynthesisBeast1Growth');
    var g2El = document.getElementById('networkAbyssDivineSynthesisBeast2Growth');
    if (g1El) g1El.textContent = '资质：—';
    if (g2El) g2El.textContent = '资质：—';
    if (!id1 || !id2 || id1 === id2) {
        el.textContent = id1 && id2 && id1 === id2 ? '请选择两只不同的神兽' : '请选择两只神兽';
        return;
    }
    var b1 = beasts.filter(function(b) { return b.id === id1; })[0];
    var b2 = beasts.filter(function(b) { return b.id === id2; })[0];
    if (!b1 || !b2) { el.textContent = '未找到所选神兽'; return; }
    function formatGrowth(b) {
        var g = b && b.growth ? b.growth : {};
        var atk = g.atk != null ? g.atk : '-';
        var def = g.def != null ? g.def : '-';
        var hp = g.hp != null ? g.hp : '-';
        var speed = g.speed != null ? g.speed : '-';
        return '资质：攻' + atk + ' 防' + def + ' 体' + hp + ' 速' + speed;
    }
    if (g1El) g1El.textContent = formatGrowth(b1);
    if (g2El) g2El.textContent = formatGrowth(b2);
    var seen = {};
    var pool = [];
    (b1.skills || []).forEach(function(s) { if (!seen[s.id]) { seen[s.id] = true; pool.push({ id: s.id, name: s.name || s.id }); } });
    (b2.skills || []).forEach(function(s) { if (!seen[s.id]) { seen[s.id] = true; pool.push({ id: s.id, name: s.name || s.id }); } });
    if (pool.length === 0) { el.textContent = '两只神兽均无技能，合成后新神兽将无技能。'; return; }
    el.innerHTML = pool.map(function(s) { return '<span style="display:inline-block; margin:2px 4px 2px 0; padding:2px 6px; background:rgba(106,27,154,0.4); border-radius:4px;">' + (s.name || s.id) + '</span>'; }).join('');
}
function openNetworkAbyssDivineSynthesisDialog() {
    var cache = window._networkAbyssDivineCache;
    var beasts = (cache && cache.beasts) || [];
    var s1 = document.getElementById('networkAbyssDivineSynthesisBeast1');
    var s2 = document.getElementById('networkAbyssDivineSynthesisBeast2');
    if (!s1 || !s2) return;
    s1.innerHTML = ''; s2.innerHTML = '';
    beasts.forEach(function(b) {
        s1.appendChild(new Option(b.name || '神兽', b.id));
        s2.appendChild(new Option(b.name || '神兽', b.id));
    });
    if (beasts.length >= 2) { s1.value = beasts[0].id; s2.value = beasts[1].id; }
    s1.onchange = updateNetworkAbyssDivineSynthesisSkillPool;
    s2.onchange = updateNetworkAbyssDivineSynthesisSkillPool;
    updateNetworkAbyssDivineSynthesisSkillPool();
    document.getElementById('networkAbyssDivineSynthesisOverlay').style.display = 'block';
    document.getElementById('networkAbyssDivineSynthesisDialog').style.display = 'block';
}
function closeNetworkAbyssDivineSynthesisDialog() {
    document.getElementById('networkAbyssDivineSynthesisOverlay').style.display = 'none';
    document.getElementById('networkAbyssDivineSynthesisDialog').style.display = 'none';
}
function doNetworkAbyssDivineSynthesis() {
    var id1 = document.getElementById('networkAbyssDivineSynthesisBeast1') && document.getElementById('networkAbyssDivineSynthesisBeast1').value;
    var id2 = document.getElementById('networkAbyssDivineSynthesisBeast2') && document.getElementById('networkAbyssDivineSynthesisBeast2').value;
    if (!id1 || !id2 || id1 === id2) { alert('请选择两只不同的神兽'); return; }
    closeNetworkAbyssDivineSynthesisDialog();
    goldGameAbyssDivineSynthesize(id1, id2).then(function(res) {
        if (res.ok && res.beast) {
            goldGameGetNetworkAbyssDivine().then(function() {
                window._networkAbyssDivineSelectedBeastId = res.beast.id;
                refreshNetworkAbyssDivinePanel();
                alert('合成成功！获得：' + (res.beast.name || '神兽'));
            });
        }
    }).catch(function(e) { alert(e.message || '合成失败'); });
}
function syncNetworkAbyssDivineSellModeUI() {
    var auction = document.getElementById('networkAbyssDivineSellModeAuction') && document.getElementById('networkAbyssDivineSellModeAuction').checked;
    var af = document.getElementById('networkAbyssDivineSellAuctionFields');
    var fr = document.getElementById('networkAbyssDivineSellFixedPriceRow');
    if (af) af.style.display = auction ? 'block' : 'none';
    if (fr) fr.style.display = auction ? 'none' : 'block';
}
function openNetworkAbyssDivineSellDialog(itemType, itemId, displayName) {
    window._networkAbyssDivineSellType = itemType;
    window._networkAbyssDivineSellId = itemId;
    var nameEl = document.getElementById('networkAbyssDivineSellName');
    var priceEl = document.getElementById('networkAbyssDivineSellPrice');
    var minBidEl = document.getElementById('networkAbyssDivineSellMinBid');
    var buyNowEl = document.getElementById('networkAbyssDivineSellBuyNow');
    var fixedR = document.getElementById('networkAbyssDivineSellModeFixed');
    var auctionR = document.getElementById('networkAbyssDivineSellModeAuction');
    if (nameEl) nameEl.textContent = displayName || itemId || '—';
    if (priceEl) priceEl.value = '';
    if (minBidEl) minBidEl.value = '1';
    if (buyNowEl) buyNowEl.value = '';
    if (fixedR) fixedR.checked = true;
    if (auctionR) auctionR.checked = false;
    if (fixedR && !fixedR._abyssNmBound) {
        fixedR._abyssNmBound = true;
        fixedR.addEventListener('change', syncNetworkAbyssDivineSellModeUI);
        if (auctionR) auctionR.addEventListener('change', syncNetworkAbyssDivineSellModeUI);
    }
    syncNetworkAbyssDivineSellModeUI();
    document.getElementById('networkAbyssDivineSellOverlay').style.display = 'block';
    document.getElementById('networkAbyssDivineSellDialog').style.display = 'block';
}
function closeNetworkAbyssDivineSellDialog() {
    document.getElementById('networkAbyssDivineSellOverlay').style.display = 'none';
    document.getElementById('networkAbyssDivineSellDialog').style.display = 'none';
}
function submitNetworkAbyssDivineSell() {
    var priceEl = document.getElementById('networkAbyssDivineSellPrice');
    var price = priceEl && priceEl.value !== '' && !isNaN(parseInt(priceEl.value, 10)) ? parseInt(priceEl.value, 10) : NaN;
    var isAuction = document.getElementById('networkAbyssDivineSellModeAuction') && document.getElementById('networkAbyssDivineSellModeAuction').checked;
    var sellOpts = {};
    if (isAuction) {
        var minBidEl = document.getElementById('networkAbyssDivineSellMinBid');
        var buyNowEl = document.getElementById('networkAbyssDivineSellBuyNow');
        var minBid = minBidEl && minBidEl.value !== '' ? parseInt(minBidEl.value, 10) : NaN;
        if (!Number.isFinite(minBid) || minBid < 1) { alert('请输入有效的起拍价（至少1联网币）'); return; }
        sellOpts.saleMode = 'auction';
        sellOpts.minBid = minBid;
        if (buyNowEl && String(buyNowEl.value || '').trim() !== '') {
            var bn = parseInt(buyNowEl.value, 10);
            if (!Number.isFinite(bn) || bn < minBid) { alert('一口价不能低于起拍价'); return; }
            sellOpts.buyNowPrice = bn;
        }
        price = 0;
    } else {
        if (!Number.isFinite(price) || price < 0) { alert('请输入有效的售价（联网币）'); return; }
    }
    var itemType = window._networkAbyssDivineSellType;
    var itemId = window._networkAbyssDivineSellId;
    if (!itemType || !itemId) { alert('参数错误'); return; }
    closeNetworkAbyssDivineSellDialog();
    goldGameMarketSellAbyssDivine(itemType, itemId, price, sellOpts).then(function() {
        goldGameGetNetworkAbyssDivine().then(function() {
            window._networkAbyssDivineSelectedBeastId = null;
            window._networkAbyssDivineSelectedEquipId = null;
            window._networkAbyssDivineSelectedNeidanId = null;
            window._networkAbyssDivineSelectedShoujueId = null;
            refreshNetworkAbyssDivinePanel();
        });
        alert('已上架');
    }).catch(function(e) { alert(e.message || '上架失败'); });
}
function openNetworkAbyssDivineEquipBag(beastId) {
    window._networkAbyssDivineEquipBagBeastId = beastId;
    document.getElementById('networkAbyssDivineEquipBagOverlay').style.display = 'block';
    document.getElementById('networkAbyssDivineEquipBagUI').style.display = 'block';
    refreshNetworkAbyssDivineEquipBagList();
}
function closeNetworkAbyssDivineEquipBag() {
    document.getElementById('networkAbyssDivineEquipBagOverlay').style.display = 'none';
    document.getElementById('networkAbyssDivineEquipBagUI').style.display = 'none';
}
function refreshNetworkAbyssDivineEquipBagList() {
    var listEl = document.getElementById('networkAbyssDivineEquipBagList');
    var beastId = window._networkAbyssDivineEquipBagBeastId;
    if (!listEl || !beastId) return;
    var cache = window._networkAbyssDivineCache;
    var petEquip = (cache && cache.petEquip) || [];
    if (petEquip.length === 0) { listEl.innerHTML = '<div style="color:#888;padding:12px;">暂无深渊宠物装备</div>'; return; }
    var html = '';
    petEquip.forEach(function(e) {
        var slot = e.slotType || '项圈';
        var attrs = (e.atkPct ? '攻+' + e.atkPct + '% ' : '') + (e.defPct ? '防+' + e.defPct + '% ' : '') + (e.hpPct ? '体+' + e.hpPct + '%' : '');
        var skillName = e.skill ? (e.skill.name || e.skill.id) : '';
        var skillEffect = (e.skill && typeof getAbyssPetSkillEffect === 'function') ? getAbyssPetSkillEffect(e.skill.id || e.skillId) : '';
        var skillHtml = e.skill ? '<div style="font-size:11px;color:#b388ff;margin-top:2px;">技能: ' + skillName + (skillEffect ? ' <span style="color:#ce93d8;">- ' + skillEffect + '</span>' : '') + '</div>' : '';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px;margin-bottom:6px;background:rgba(0,0,0,0.3);border-radius:6px;"><div><span style="color:#ffb74d;">' + (e.name || '装备') + '</span> <span style="color:#aaa;font-size:12px;">' + slot + ' ' + attrs + '</span>' + skillHtml + '</div><button type="button" onclick="goldGameAbyssDivineEquipPetEquip(\'' + beastId + '\', \'' + (e.id || '') + '\', \'' + slot + '\').then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ refreshNetworkAbyssDivinePanel(); refreshNetworkAbyssDivineEquipBagList(); }); }).catch(function(err){ alert(err.message); });" style="padding:4px 10px;font-size:12px;background:#6a1b9a;color:#fff;border:none;border-radius:4px;cursor:pointer;">装备</button></div>';
    });
    listEl.innerHTML = html;
}
function openNetworkAbyssDivineNeidanBag(beastId) {
    window._networkAbyssDivineNeidanBagBeastId = beastId;
    document.getElementById('networkAbyssDivineNeidanBagOverlay').style.display = 'block';
    document.getElementById('networkAbyssDivineNeidanBagUI').style.display = 'block';
    refreshNetworkAbyssDivineNeidanBagList();
}
function closeNetworkAbyssDivineNeidanBag() {
    document.getElementById('networkAbyssDivineNeidanBagOverlay').style.display = 'none';
    document.getElementById('networkAbyssDivineNeidanBagUI').style.display = 'none';
}
function refreshNetworkAbyssDivineNeidanBagList() {
    var listEl = document.getElementById('networkAbyssDivineNeidanBagList');
    var beastId = window._networkAbyssDivineNeidanBagBeastId;
    if (!listEl || !beastId) return;
    var cache = window._networkAbyssDivineCache;
    var petNeidan = (cache && cache.petNeidan) || [];
    if (petNeidan.length === 0) { listEl.innerHTML = '<div style="color:#888;padding:12px;">暂无深渊宠物内丹</div>'; return; }
    var html = '';
    petNeidan.forEach(function(n) {
        var ndLv = Math.max(1, n.level || 1);
        var ndName = (n.name || '内丹') + ' Lv.' + ndLv;
        var mult = 1 + (ndLv - 1) * 0.2;
        var labels = { atkPct: '攻', defPct: '防', hpPct: '体', critRate: '暴击率', critDmg: '暴伤', lifestealPct: '吸血', dodge: '闪避', damageReduction: '减伤', reduceMonsterDef: '破防', vulnerablePct: '易伤', goldPct: '金币', expPct: '经验' };
        function fmtLine(obj, m) {
            if (!obj || typeof obj !== 'object') return '';
            m = m != null && m > 0 ? m : 1;
            var parts = [];
            for (var k in obj) if (obj.hasOwnProperty(k) && typeof obj[k] === 'number') {
                var v = m !== 1 ? Math.round(obj[k] * m) : obj[k];
                parts.push((labels[k] || k) + '+' + v + '%');
            }
            return parts.join(' ');
        }
        var effPet = fmtLine(n.pet, mult);
        var effPlayer = fmtLine(n.player, mult);
        var effGlobal = fmtLine(n.global, mult);
        var effParts = [];
        if (effPet) effParts.push('宠物: ' + effPet);
        if (effPlayer) effParts.push('玩家: ' + effPlayer);
        if (effGlobal) effParts.push('全局: ' + effGlobal);
        var effText = effParts.join('；');
        var textHtml = effText
            ? '<div><div style="color:#ffcc80;">' + ndName + '</div><div style="font-size:11px;color:#b388ff;margin-top:2px;">' + effText + '</div></div>'
            : '<div><span style="color:#ffcc80;">' + ndName + '</span></div>';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px;margin-bottom:6px;background:rgba(0,0,0,0.3);border-radius:6px;">' + textHtml + '<button type="button" onclick="goldGameAbyssDivineEquipNeidan(\'' + beastId + '\', \'' + (n.id || '') + '\').then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ refreshNetworkAbyssDivinePanel(); refreshNetworkAbyssDivineNeidanBagList(); }); }).catch(function(err){ alert(err.message); });" style="padding:4px 10px;font-size:12px;background:#6a1b9a;color:#fff;border:none;border-radius:4px;cursor:pointer;">装备</button></div>';
    });
    listEl.innerHTML = html;
}
function openNetworkAbyssDivineShoujueBag(beastId) {
    window._networkAbyssDivineShoujueBagBeastId = beastId;
    document.getElementById('networkAbyssDivineShoujueBagOverlay').style.display = 'block';
    document.getElementById('networkAbyssDivineShoujueBagUI').style.display = 'block';
    refreshNetworkAbyssDivineShoujueBagList();
}
function closeNetworkAbyssDivineShoujueBag() {
    document.getElementById('networkAbyssDivineShoujueBagOverlay').style.display = 'none';
    document.getElementById('networkAbyssDivineShoujueBagUI').style.display = 'none';
}
function refreshNetworkAbyssDivineShoujueBagList() {
    var listEl = document.getElementById('networkAbyssDivineShoujueBagList');
    var skillsEl = document.getElementById('networkAbyssDivineShoujueBagBeastSkills');
    var beastId = window._networkAbyssDivineShoujueBagBeastId;
    if (!listEl || !beastId) return;
    var cache = window._networkAbyssDivineCache;
    var beasts = (cache && cache.beasts) || [];
    var beast = beasts.filter(function(b){ return b.id === beastId; })[0];
    if (skillsEl) {
        if (beast && beast.skills && beast.skills.length > 0) skillsEl.textContent = '当前神兽技能：' + beast.skills.map(function(s){ return s.name || s.id; }).join('、');
        else skillsEl.textContent = '当前神兽技能：暂无';
    }
    var petShoujue = (cache && cache.petShoujue) || [];
    if (petShoujue.length === 0) { listEl.innerHTML = '<div style="color:#888;padding:12px;">暂无深渊宠物兽决</div>'; return; }
    var html = '';
    petShoujue.forEach(function(s) {
        var eff = typeof getAbyssPetSkillEffect === 'function' ? getAbyssPetSkillEffect(s.skillId || s.skillid) : '';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px;margin-bottom:6px;background:rgba(0,0,0,0.3);border-radius:6px;"><div style="flex:1;min-width:0;"><div style="color:#ff80ab;">' + (s.skillName || s.skillId || '兽决') + '</div>' + (eff ? '<div style="font-size:11px;color:#b388ff;margin-top:4px;">' + eff + '</div>' : '') + '</div><button type="button" onclick="goldGameAbyssDivineUseShoujue(\'' + beastId + '\', \'' + (s.id || '') + '\').then(function(){ goldGameGetNetworkAbyssDivine().then(function(){ refreshNetworkAbyssDivinePanel(); refreshNetworkAbyssDivineShoujueBagList(); }); }).catch(function(err){ alert(err.message); });" style="padding:4px 10px;font-size:12px;background:#6a1b9a;color:#fff;border:none;border-radius:4px;cursor:pointer;flex-shrink:0;">使用</button></div>';
    });
    listEl.innerHTML = html;
}
function syncNetworkArtifactSellModeUI() {
    var auction = document.getElementById('networkArtifactSellModeAuction') && document.getElementById('networkArtifactSellModeAuction').checked;
    var af = document.getElementById('networkArtifactSellAuctionFields');
    var fr = document.getElementById('networkArtifactSellFixedPriceRow');
    if (af) af.style.display = auction ? 'block' : 'none';
    if (fr) fr.style.display = auction ? 'none' : 'block';
}
function openNetworkArtifactSellDialog(mode, opts) {
    opts = opts || {};
    window._networkArtifactSellMode = mode;
    window._networkArtifactSellOpts = opts;
    var amountRow = document.getElementById('networkArtifactSellAmountRow');
    var amountInput = document.getElementById('networkArtifactSellAmount');
    var priceInput = document.getElementById('networkArtifactSellPrice');
    var minBidInput = document.getElementById('networkArtifactSellMinBid');
    var buyNowInput = document.getElementById('networkArtifactSellBuyNow');
    var modeRow = document.getElementById('networkArtifactSellModeRow');
    var showAuction = (mode === 'artifact' || mode === 'stone' || mode === 'refineStone' || mode === 'supremeArtifact');
    if (modeRow) modeRow.style.display = showAuction ? 'block' : 'none';
    if (amountRow) amountRow.style.display = (mode === 'artifact' || mode === 'supremeArtifact') ? 'none' : 'block';
    if (amountInput) { amountInput.value = '1'; amountInput.min = 1; }
    if (priceInput) { priceInput.value = ''; priceInput.placeholder = '请输入'; }
    if (minBidInput) { minBidInput.value = '1'; }
    if (buyNowInput) { buyNowInput.value = ''; }
    if (showAuction) {
        var fixedR = document.getElementById('networkArtifactSellModeFixed');
        var auctionR = document.getElementById('networkArtifactSellModeAuction');
        if (fixedR) fixedR.checked = true;
        if (auctionR) auctionR.checked = false;
        if (fixedR && !fixedR._nmBound) {
            fixedR._nmBound = true;
            fixedR.addEventListener('change', syncNetworkArtifactSellModeUI);
            if (auctionR) auctionR.addEventListener('change', syncNetworkArtifactSellModeUI);
        }
        syncNetworkArtifactSellModeUI();
    } else {
        var af = document.getElementById('networkArtifactSellAuctionFields');
        if (af) af.style.display = 'none';
        var fr = document.getElementById('networkArtifactSellFixedPriceRow');
        if (fr) fr.style.display = 'block';
    }
    document.getElementById('networkArtifactSellOverlay').style.display = 'block';
    document.getElementById('networkArtifactSellDialog').style.display = 'block';
}
function closeNetworkArtifactSellDialog() {
    document.getElementById('networkArtifactSellOverlay').style.display = 'none';
    document.getElementById('networkArtifactSellDialog').style.display = 'none';
}
function submitNetworkArtifactSell() {
    var mode = window._networkArtifactSellMode;
    var opts = window._networkArtifactSellOpts || {};
    var priceEl = document.getElementById('networkArtifactSellPrice');
    var price = priceEl && priceEl.value !== '' && !isNaN(parseInt(priceEl.value, 10)) ? parseInt(priceEl.value, 10) : NaN;
    var isAuction = document.getElementById('networkArtifactSellModeAuction') && document.getElementById('networkArtifactSellModeAuction').checked;
    var sellOpts = {};
    if (isAuction) {
        var minBidEl = document.getElementById('networkArtifactSellMinBid');
        var buyNowEl = document.getElementById('networkArtifactSellBuyNow');
        var minBid = minBidEl && minBidEl.value !== '' ? parseInt(minBidEl.value, 10) : NaN;
        if (!Number.isFinite(minBid) || minBid < 1) { alert('请输入有效的起拍价（至少1联网币）'); return; }
        sellOpts.saleMode = 'auction';
        sellOpts.minBid = minBid;
        if (buyNowEl && String(buyNowEl.value || '').trim() !== '') {
            var bn = parseInt(buyNowEl.value, 10);
            if (!Number.isFinite(bn) || bn < minBid) { alert('一口价不能低于起拍价'); return; }
            sellOpts.buyNowPrice = bn;
        }
        price = 0;
    } else {
        if (!Number.isFinite(price) || price < 0) { alert('请输入有效的售价'); return; }
    }
    if (mode === 'artifact') {
        var artifactId = opts.artifactId;
        if (!artifactId) { alert('参数错误'); return; }
        closeNetworkArtifactSellDialog();
        goldGameMarketSell(artifactId, price, sellOpts).then(function() { refreshNetworkArtifactPanel(); alert('已上架'); }).catch(function(e) { alert(e.message); });
        return;
    }
    if (mode === 'supremeArtifact') {
        var sAid = opts.artifactId;
        if (!sAid) { alert('参数错误'); return; }
        if (typeof goldGameMarketSellSupremeArtifact !== 'function') { alert('未联网'); return; }
        closeNetworkArtifactSellDialog();
        goldGameMarketSellSupremeArtifact(sAid, price, sellOpts).then(function() {
            if (typeof refreshSupremeArtifactUI === 'function') refreshSupremeArtifactUI();
            if (typeof updatePlayerBattleStats === 'function') updatePlayerBattleStats();
            alert('已上架');
        }).catch(function(e) { alert(e.message || '上架失败'); });
        return;
    }
    var amountEl = document.getElementById('networkArtifactSellAmount');
    var amount = amountEl && amountEl.value !== '' && !isNaN(parseInt(amountEl.value, 10)) ? parseInt(amountEl.value, 10) : NaN;
    if (!Number.isFinite(amount) || amount < 1) { alert('请输入有效的数量'); return; }
    closeNetworkArtifactSellDialog();
    if (mode === 'stone') {
        goldGameMarketSellStone(amount, price, sellOpts).then(function() { refreshNetworkArtifactPanel(); alert('已上架'); }).catch(function(e) { alert(e.message); });
    } else if (mode === 'refineStone') {
        goldGameMarketSellRefineStone(amount, price, sellOpts).then(function() { refreshNetworkArtifactPanel(); alert('已上架'); }).catch(function(e) { alert(e.message); });
    }
}
(function() {
    var overlay = document.getElementById('networkArtifactSellOverlay');
    var submitBtn = document.getElementById('networkArtifactSellSubmit');
    if (overlay) overlay.addEventListener('click', closeNetworkArtifactSellDialog);
    if (submitBtn) submitBtn.addEventListener('click', submitNetworkArtifactSell);
})();
function switchNetworkArtifactBagTab(tab) {
    window._networkArtifactBagTab = tab;
    var equipPanel = document.getElementById('networkArtifactBagEquipPanel');
    var materialPanel = document.getElementById('networkArtifactBagMaterialPanel');
    var btnEquip = document.getElementById('networkArtifactTabEquip');
    var btnMaterial = document.getElementById('networkArtifactTabMaterial');
    if (tab === 'material') {
        if (equipPanel) equipPanel.style.display = 'none';
        if (materialPanel) materialPanel.style.display = 'block';
        if (btnEquip) { btnEquip.style.background = '#444'; btnEquip.style.color = '#ccc'; }
        if (btnMaterial) { btnMaterial.style.background = '#6a0dad'; btnMaterial.style.color = '#fff'; }
    } else {
        if (equipPanel) equipPanel.style.display = 'block';
        if (materialPanel) materialPanel.style.display = 'none';
        if (btnEquip) { btnEquip.style.background = '#6a0dad'; btnEquip.style.color = '#fff'; }
        if (btnMaterial) { btnMaterial.style.background = '#444'; btnMaterial.style.color = '#ccc'; }
    }
}
function showNetworkArtifactEnhanceConfirm(artifactId, cost, rate, penalty, displayName) {
    document.getElementById('networkArtifactEnhanceText').innerHTML = '装备：' + (displayName || '') + '<br>下一级消耗 <b>' + cost + '</b> 个深渊升级石，成功率 <b>' + rate + '%</b>。失败掉 <b>' + penalty + '</b> 级。确认强化？';
    var okBtn = document.getElementById('networkArtifactEnhanceOk');
    okBtn.onclick = function() {
        document.getElementById('networkArtifactEnhanceConfirm').style.display = 'none';
        goldGameArtifactEnhance(artifactId).then(function(r) {
            refreshNetworkArtifactPanel();
            alert(r.success ? '强化成功！' : '强化失败，当前+' + (r.newLevel != null ? r.newLevel : 0) + '级');
        }).catch(function(e) { alert(e.message); });
    };
    document.getElementById('networkArtifactEnhanceConfirm').style.display = 'block';
}
function showNetworkArtifactRefineConfirm(artifactId, displayName) {
    document.getElementById('networkArtifactRefineText').innerHTML = '装备：' + (displayName || '') + '<br>消耗 <b>1</b> 个深渊洗练石，在当前品质范围内重新随机属性（类型与数值）。确认洗练？';
    var okBtn = document.getElementById('networkArtifactRefineOk');
    okBtn.onclick = function() {
        document.getElementById('networkArtifactRefineConfirm').style.display = 'none';
        goldGameArtifactRefine(artifactId).then(function(r) {
            refreshNetworkArtifactPanel();
            alert('洗练成功！新属性：' + (r.artifact && (NETWORK_ARTIFACT_ATTR_NAMES[r.artifact.attrType] || r.artifact.attrType) + '+' + r.artifact.attrPct + '%' || ''));
        }).catch(function(e) { alert(e.message); });
    };
    document.getElementById('networkArtifactRefineConfirm').style.display = 'block';
}
function refreshNetworkArtifactPanel() {
    if (typeof goldGameGetUpgradeStones === 'function') {
        goldGameGetUpgradeStones().then(function(r) {
            var el = document.getElementById('networkArtifactStoneCount');
            if (el) el.textContent = (r && r.ok && typeof r.amount === 'number') ? r.amount : '--';
        });
    }
    if (typeof goldGameGetRefineStones === 'function') {
        goldGameGetRefineStones().then(function(r) {
            var el = document.getElementById('networkArtifactRefineStoneCount');
            if (el) el.textContent = (r && r.ok && typeof r.amount === 'number') ? r.amount : '--';
            var el2 = document.getElementById('networkArtifactMaterialRefineCount');
            if (el2) el2.textContent = (r && r.ok && typeof r.amount === 'number') ? r.amount : '--';
        });
    }
    if (typeof goldGameGetUpgradeStones === 'function') {
        goldGameGetUpgradeStones().then(function(r) {
            var el2 = document.getElementById('networkArtifactMaterialStoneCount');
            if (el2) el2.textContent = (r && r.ok && typeof r.amount === 'number') ? r.amount : '--';
        });
    }
    if (typeof goldGameGetNetworkArtifacts !== 'function') return;
    goldGameGetNetworkArtifacts().then(function(res) {
        var equipped = res.equipped || {};
        var bag = res.bag || [];
        var eqEl = document.getElementById('networkArtifactEquipped');
        var bagEl = document.getElementById('networkArtifactBag');
        if (!eqEl || !bagEl) return;
        eqEl.innerHTML = '';
        ['necklace', 'ring', 'bracelet'].forEach(function(slot) {
            var name = NETWORK_ARTIFACT_SLOT_NAMES_UI[slot] || slot;
            var eq = equipped[slot];
            var html = '<div style="padding: 10px 12px; background: linear-gradient(90deg, #2a2a4a, #1e1e3a); border-radius: 8px; margin-bottom: 6px; border-left: 4px solid #6a0dad;">' + name + ': ';
            if (eq) {
                var lv = eq.enhanceLevel != null ? eq.enhanceLevel : 0;
                html += (eq.displayName || eq.name || '') + (lv > 0 ? ' <span style="color:#ffd700">+' + lv + '</span>' : '') + ' ' + (eq.attrType ? (NETWORK_ARTIFACT_ATTR_NAMES[eq.attrType] || eq.attrType) + '+' + eq.attrPct + '%' : '') + (eq.skillName ? ' [' + eq.skillName + ']' : '');
                html += (typeof getNetworkArtifactExtraInfo === 'function' ? getNetworkArtifactExtraInfo(eq) : '');
                html += ' <button type="button" onclick="goldGameUnequipNetworkArtifact(\'' + slot + '\').then(function(){ refreshNetworkArtifactPanel(); });" style="margin-left: 8px; padding: 4px 10px; font-size: 12px; background: #555; color: #fff; border: none; border-radius: 6px; cursor: pointer;">卸下</button>';
                if (lv < 10) html += ' <button type="button" onclick="showNetworkArtifactEnhanceConfirm(\'' + (eq.id || '') + '\', ' + (lv + 1) + ', ' + (NETWORK_ARTIFACT_ENHANCE_RATES[lv] != null ? NETWORK_ARTIFACT_ENHANCE_RATES[lv] : 0) + ', ' + (lv >= 8 ? 3 : (lv >= 6 ? 2 : (lv >= 3 ? 1 : 0))) + ', \'' + (eq.displayName || eq.name || '').replace(/'/g, '\\\'') + '\');" style="margin-left: 4px; padding: 4px 10px; font-size: 12px; background: #6a1b9a; color: #fff; border: none; border-radius: 6px; cursor: pointer;">升级</button>';
                html += ' <button type="button" onclick="showNetworkArtifactRefineConfirm(\'' + (eq.id || '') + '\', \'' + (eq.displayName || eq.name || '').replace(/'/g, '\\\'') + '\');" style="margin-left: 4px; padding: 4px 10px; font-size: 12px; background: #0277bd; color: #fff; border: none; border-radius: 6px; cursor: pointer;">洗练</button>';
            } else {
                html += '空';
            }
            html += '</div>';
            eqEl.innerHTML += html;
        });
        var qualityFilterEl = document.getElementById('networkArtifactBagQualityFilter');
        var qualityFilter = (qualityFilterEl && qualityFilterEl.value !== undefined) ? qualityFilterEl.value : '';
        var filteredBag = bag;
        if (qualityFilter !== '') {
            var q = parseInt(qualityFilter, 10);
            if (!isNaN(q)) filteredBag = bag.filter(function(item) { return (item.quality != null ? item.quality : 0) === q; });
        }
        bagEl.innerHTML = '';
        filteredBag.forEach(function(item) {
            var div = document.createElement('div');
            var lv = item.enhanceLevel != null ? item.enhanceLevel : 0;
            div.style.cssText = 'padding: 10px 12px; background: linear-gradient(90deg, #2a2a4a, #1e1e3a); border-radius: 8px; margin-bottom: 6px; font-size: 13px; border-left: 4px solid #555;';
            var namePart = (item.displayName || item.name || '') + (lv > 0 ? ' <span style="color:#ffd700">+' + lv + '</span>' : '') + ' ' + (item.attrType ? (NETWORK_ARTIFACT_ATTR_NAMES[item.attrType] || item.attrType) + '+' + item.attrPct + '%' : '') + (item.skillName ? ' [' + item.skillName + ']' : '');
            var extraInfo = (typeof getNetworkArtifactExtraInfo === 'function' ? getNetworkArtifactExtraInfo(item) : '');
            var btns = '<button type="button" onclick="goldGameEquipNetworkArtifact(\'' + item.slot + '\', \'' + (item.id || '') + '\').then(function(){ refreshNetworkArtifactPanel(); }).catch(function(e){ alert(e.message); });" style="margin-left: 6px; padding: 4px 10px; font-size: 12px; background: #4caf50; color: #fff; border: none; border-radius: 6px; cursor: pointer;">装备</button>';
            btns += ' <button type="button" onclick="openNetworkArtifactSellDialog(\'artifact\', { artifactId: \'' + (item.id || '').replace(/\\/g, '\\\\').replace(/'/g, '\\\'') + '\' });" style="margin-left: 4px; padding: 4px 10px; font-size: 12px; background: #2196f3; color: #fff; border: none; border-radius: 6px; cursor: pointer;">上架</button>';
            btns += ' <button type="button" onclick="if(confirm(\'确定丢弃？\')) goldGameArtifactDiscard(\'' + (item.id || '') + '\').then(function(){ refreshNetworkArtifactPanel(); }).catch(function(e){ alert(e.message); });" style="margin-left: 4px; padding: 4px 10px; font-size: 12px; background: #d32f2f; color: #fff; border: none; border-radius: 6px; cursor: pointer;">丢弃</button>';
            if (lv < 10) btns += ' <button type="button" onclick="showNetworkArtifactEnhanceConfirm(\'' + (item.id || '') + '\', ' + (lv + 1) + ', ' + (NETWORK_ARTIFACT_ENHANCE_RATES[lv] != null ? NETWORK_ARTIFACT_ENHANCE_RATES[lv] : 0) + ', ' + (lv >= 8 ? 3 : (lv >= 6 ? 2 : (lv >= 3 ? 1 : 0))) + ', \'' + (item.displayName || item.name || '').replace(/'/g, '\\\'') + '\');" style="margin-left: 4px; padding: 4px 10px; font-size: 12px; background: #6a1b9a; color: #fff; border: none; border-radius: 6px; cursor: pointer;">升级</button>';
            btns += ' <button type="button" onclick="showNetworkArtifactRefineConfirm(\'' + (item.id || '') + '\', \'' + (item.displayName || item.name || '').replace(/'/g, '\\\'') + '\');" style="margin-left: 4px; padding: 4px 10px; font-size: 12px; background: #0277bd; color: #fff; border: none; border-radius: 6px; cursor: pointer;">洗练</button>';
            div.innerHTML = namePart + extraInfo + btns;
            bagEl.appendChild(div);
        });
        if (filteredBag.length === 0) bagEl.innerHTML = '<div style="color: #888; padding: 20px; text-align: center;">' + (qualityFilter !== '' ? '该品质暂无背包神器' : '暂无背包神器') + '</div>';
    });
}
function syncNetworkMarketFilterRows() {
    var catEl = document.getElementById('networkMarketCategory');
    var cat = catEl ? String(catEl.value || '').trim() : '';
    var ra = document.getElementById('nmRowArtifact');
    var rm = document.getElementById('nmRowMaterials');
    var rs = document.getElementById('nmRowSupreme');
    function flexShow(el, on) { if (el) el.style.display = on ? 'flex' : 'none'; }
    flexShow(ra, cat === 'artifact');
    flexShow(rm, cat === 'abyssMaterials');
    flexShow(rs, cat === 'supremeArtifact');
}
function openNetworkMarketDialog() {
    if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) {
        alert('请先登录账号。');
        return;
    }
    document.getElementById('networkMarketOverlay').style.display = 'block';
    document.getElementById('networkMarketDialog').style.display = 'block';
    window._networkMarketPage = 1;
    if (typeof syncNetworkMarketFilterRows === 'function') syncNetworkMarketFilterRows();
    refreshNetworkMarketDialog();
}
function closeNetworkMarketDialog() {
    document.getElementById('networkMarketOverlay').style.display = 'none';
    document.getElementById('networkMarketDialog').style.display = 'none';
    if (typeof window._networkMarketCountdownTimer !== 'undefined' && window._networkMarketCountdownTimer) {
        clearInterval(window._networkMarketCountdownTimer);
        window._networkMarketCountdownTimer = null;
    }
}
/** 市场挂单自动下架倒计时：按小时、分钟显示，剩余不足1分钟显示「不足1分钟」 */
function formatMarketCountdown(expiresAtMs) {
    if (expiresAtMs == null || isNaN(expiresAtMs)) return '';
    var now = Date.now();
    var rem = Number(expiresAtMs) - now;
    if (rem <= 0) return '即将下架';
    var h = Math.floor(rem / 3600000);
    var m = Math.floor((rem % 3600000) / 60000);
    if (h > 0) return '剩余 ' + h + ' 小时 ' + m + ' 分钟';
    if (m > 0) return '剩余 ' + m + ' 分钟';
    return '不足1分钟';
}
function updateNetworkMarketCountdowns() {
    var nodes = document.querySelectorAll('#networkMarketList [data-market-expires]');
    for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var t = el.getAttribute('data-market-expires');
        if (t == null || t === '') continue;
        var text = formatMarketCountdown(parseInt(t, 10));
        if (text) el.textContent = text;
    }
}
function networkMarketAuctionTag(row) {
    if (row.saleMode !== 'auction') return '';
    var minP = row.minBid != null ? row.minBid : row.price;
    var cur = row.currentBid || 0;
    var s = ' <span style="color:#ffa726;">[竞拍]</span> 起拍' + minP + ' 当前' + cur;
    if (row.buyNowPrice != null && row.buyNowPrice !== '') s += ' 买断' + row.buyNowPrice;
    return s;
}
function networkMarketRowButtons(row, isMine) {
    var lid = String(row.listingId || '');
    var esc = lid.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    if (row.saleMode === 'auction') {
        if (isMine) return '<span style="margin-left:auto;color:#888;font-size:12px;">竞拍中不可下架</span>';
        var bidBtn = '<button type="button" onclick="networkMarketDoBid(\'' + esc + '\')" style="margin-left:auto;padding:4px 12px;background:#ff9800;color:#fff;border:none;border-radius:6px;cursor:pointer;">出价</button>';
        var buyNowBtn = '';
        if (row.buyNowPrice != null && row.buyNowPrice !== '') {
            buyNowBtn = '<button type="button" onclick="networkMarketDoBuyNow(\'' + esc + '\',' + Number(row.buyNowPrice) + ')" style="margin-left:8px;padding:4px 12px;background:#4caf50;color:#fff;border:none;border-radius:6px;cursor:pointer;">一口价 ' + row.buyNowPrice + '</button>';
        }
        return bidBtn + buyNowBtn;
    }
    if (isMine) return '<button type="button" onclick="goldGameMarketDelist(\'' + esc + '\').then(function(){ refreshNetworkMarketDialog(); }).catch(function(e){ alert(e.message); });" style="margin-left:auto;padding:4px 12px;background:#d32f2f;color:#fff;border:none;border-radius:6px;cursor:pointer;">下架</button>';
    return '<button type="button" onclick="goldGameMarketBuy(\'' + esc + '\').then(function(){ refreshNetworkMarketDialog(); }).catch(function(e){ alert(e.message); });" style="margin-left:auto;padding:4px 12px;background:#4caf50;color:#fff;border:none;border-radius:6px;cursor:pointer;">购买</button>';
}
function networkMarketDoBid(listingId) {
    var v = prompt('请输入出价（联网币，须高于当前最高价且不低于起拍价）', '');
    if (v == null || String(v).trim() === '') return;
    var n = parseInt(v, 10);
    if (!isFinite(n) || n < 1) { alert('请输入有效数字'); return; }
    if (typeof goldGameMarketBid !== 'function') { alert('未联网'); return; }
    goldGameMarketBid(listingId, n).then(function(){ refreshNetworkMarketDialog(); }).catch(function(e){ alert(e.message || '出价失败'); });
}
function networkMarketDoBuyNow(listingId, price) {
    if (!confirm('确认以 ' + price + ' 联网币一口价买断？')) return;
    goldGameMarketBuy(listingId).then(function(){ refreshNetworkMarketDialog(); }).catch(function(e){ alert(e.message); });
}
function refreshNetworkMarketDialog() {
    if (!window._networkMarketViewMode) window._networkMarketViewMode = 'all';
    if (typeof window._networkMarketPage !== 'number' || window._networkMarketPage < 1) window._networkMarketPage = 1;
    if (typeof syncNetworkMarketFilterRows === 'function') syncNetworkMarketFilterRows();
    if (typeof goldGameGetNetworkCoin === 'function') {
        goldGameGetNetworkCoin().then(function(r) {
            var el = document.getElementById('networkMarketMyCoin');
            if (el) el.textContent = (r && r.ok && typeof r.amount === 'number') ? r.amount : '--';
        });
    }
    if (typeof goldGameMarketList !== 'function') return;
    var priceMinEl = document.getElementById('networkMarketPriceMin');
    var priceMaxEl = document.getElementById('networkMarketPriceMax');
    var artQualityEl = document.getElementById('networkMarketArtifactQuality');
    var supQualityEl = document.getElementById('networkMarketSupremeQuality');
    var catEl = document.getElementById('networkMarketCategory');
    var cat = catEl ? String(catEl.value || '').trim() : '';
    var serverFilters = {};
    if (priceMinEl && priceMinEl.value !== '' && !isNaN(parseFloat(priceMinEl.value))) serverFilters.minPrice = parseFloat(priceMinEl.value);
    if (priceMaxEl && priceMaxEl.value !== '' && !isNaN(parseFloat(priceMaxEl.value))) serverFilters.maxPrice = parseFloat(priceMaxEl.value);
    if (cat === 'artifact') {
        serverFilters.itemType = 'artifact';
        if (artQualityEl && artQualityEl.value !== '') serverFilters.minQuality = artQualityEl.value;
        var asl = document.getElementById('networkMarketArtifactSlot');
        if (asl && asl.value !== '') serverFilters.slot = asl.value;
        var attrTypeEl = document.getElementById('networkMarketAttrType');
        if (attrTypeEl && attrTypeEl.value !== '') serverFilters.attrType = attrTypeEl.value;
    } else if (cat === 'abyssMaterials') {
        var mk = document.getElementById('networkMarketMaterialKind');
        var mkv = mk ? String(mk.value || '').trim() : '';
        if (mkv === 'stone') serverFilters.itemType = 'stone';
        else if (mkv === 'refineStone') serverFilters.itemType = 'refineStone';
        else serverFilters.itemType = 'abyssMaterials';
    } else if (cat === 'abyssBeast') {
        serverFilters.itemType = 'abyssBeast';
    } else if (cat === 'abyssPetEquip') {
        serverFilters.itemType = 'abyssPetEquip';
    } else if (cat === 'abyssPetNeidan') {
        serverFilters.itemType = 'abyssPetNeidan';
    } else if (cat === 'abyssPetShoujue') {
        serverFilters.itemType = 'abyssPetShoujue';
    } else if (cat === 'supremeArtifact') {
        serverFilters.itemType = 'supremeArtifact';
        if (supQualityEl && supQualityEl.value !== '') serverFilters.minQuality = supQualityEl.value;
        var ssl = document.getElementById('networkMarketSupremeSlot');
        if (ssl && ssl.value !== '') serverFilters.slot = ssl.value;
        var ssv = document.getElementById('networkMarketSupremeSLevel');
        if (ssv && ssv.value !== '') serverFilters.sLevel = ssv.value;
        var saf = document.getElementById('networkMarketSupremeAffix');
        if (saf && saf.value !== '') serverFilters.supremeAffixType = saf.value;
    }
    goldGameMarketList(window._networkMarketPage, serverFilters).then(function(res) {
        var listEl = document.getElementById('networkMarketList');
        var soldEl = document.getElementById('networkMarketSoldHistory');
        if (!listEl) return;
        var list = (res && res.list) ? res.list : [];
        var myName = (typeof getGoldGameAuthUsername === 'function' && getGoldGameAuthUsername()) ? getGoldGameAuthUsername() : '';
        var myId = (typeof getGoldGameAccountId === 'function') ? String(getGoldGameAccountId() || '').trim().toLowerCase() : '';
        var tabAll = document.getElementById('networkMarketTabAll');
        var tabMine = document.getElementById('networkMarketTabMine');
        if (tabAll && tabMine) {
            if (window._networkMarketViewMode === 'mine') {
                tabAll.style.background = 'rgba(0,0,0,0.3)';
                tabAll.style.color = '#ddd';
                tabMine.style.background = '#ffd700';
                tabMine.style.color = '#1a1a2e';
            } else {
                tabAll.style.background = '#ffd700';
                tabAll.style.color = '#1a1a2e';
                tabMine.style.background = 'rgba(0,0,0,0.3)';
                tabMine.style.color = '#ddd';
            }
        }
        var slotNames = { necklace: '项链', ring: '戒指', bracelet: '手镯' };
        var qualityNames = ['灰','绿','蓝','紫','橙','红','金'];
        listEl.innerHTML = '';
        list.forEach(function(row) {
            var div = document.createElement('div');
            div.style.cssText = 'padding: 10px 12px; background: #2a2a4a; border-radius: 8px; margin-bottom: 6px; font-size: 13px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px;';
            var sellerNameStr = (row.sellerPlayerName != null ? row.sellerPlayerName : (row.sellerName || '未知'));
            var autoDelistHtml = '';
            if (row.autoDelistAt != null && !isNaN(row.autoDelistAt)) {
                var expiresAt = parseInt(row.autoDelistAt, 10);
                var countdownText = formatMarketCountdown(expiresAt);
                if (countdownText) autoDelistHtml = ' <span style="color:#9e9e9e;font-size:12px;">(</span><span class="network-market-countdown" data-market-expires="' + expiresAt + '" style="color:#b388ff;font-size:12px;">' + countdownText + '</span><span style="color:#9e9e9e;font-size:12px;"> ' + (row.saleMode === 'auction' ? '后截止竞拍)' : '后自动下架)') + '</span>';
            }
            var namePart; var slotName = ''; var qualityName = '';
            if (row.itemType === 'abyssBeast') {
                namePart = (row.displayName || row.name || '深渊神兽');
                window._marketBeastCache = window._marketBeastCache || {};
                if (row.beast) window._marketBeastCache[row.listingId] = row.beast;
                var infoBtn = row.beast ? '<button type="button" onclick="var b=(window._marketBeastCache&&window._marketBeastCache[\'' + (row.listingId || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\']);if(b)showNetworkAbyssBeastInfo(b);" style="margin-right:6px;padding:4px 10px;background:#6a1b9a;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;">信息</button>' : '';
                var pricePart = (row.saleMode === 'auction') ? (networkMarketAuctionTag(row) + ' 币') : (' <span style="color:#ffd700">' + (row.price != null ? row.price : 0) + ' 币</span>');
                var info = '<span style="color:#ddd">' + namePart + '</span>' + pricePart + ' 玩家: <span style="color:#81c784">' + sellerNameStr + '</span>' + autoDelistHtml;
                var isMine = (myId && row.sellerId && String(row.sellerId).trim().toLowerCase() === myId) || (row.sellerName && myName && row.sellerName === myName);
                var btn = infoBtn + networkMarketRowButtons(row, isMine);
                div.innerHTML = info + btn;
                listEl.appendChild(div);
                return;
            }
            if (row.itemType === 'abyssPetEquip' || row.itemType === 'abyssPetNeidan' || row.itemType === 'abyssPetShoujue') {
                var baseItem = row.item || row;
                namePart = (row.displayName || baseItem.name || (row.itemType === 'abyssPetShoujue' ? '深渊兽决' : (row.itemType === 'abyssPetNeidan' ? '深渊宠物内丹' : '深渊宠物装备')));
                var extra = '';
                if (row.itemType === 'abyssPetEquip') {
                    var partsEq = [];
                    var slotText = baseItem.slotType || baseItem.slot || '';
                    if (slotText) partsEq.push('槽位: ' + slotText);
                    var attrLine = (baseItem.atkPct ? '攻+' + baseItem.atkPct + '% ' : '') + (baseItem.defPct ? '防+' + baseItem.defPct + '% ' : '') + (baseItem.hpPct ? '体+' + baseItem.hpPct + '%' : '');
                    if (attrLine) partsEq.push(attrLine.trim());
                    var skillNameEq = baseItem.skillName || (baseItem.skill && (baseItem.skill.name || baseItem.skill.id));
                    if (skillNameEq) partsEq.push('技能: [' + skillNameEq + ']');
                    if (partsEq.length) extra = ' <span style="color:#b388ff;font-size:12px;">(' + partsEq.join('，') + ')</span>';
                } else if (row.itemType === 'abyssPetNeidan') {
                    var ndLv = Math.max(1, baseItem.level || 1);
                    var mult = 1 + (ndLv - 1) * 0.2;
                    var labelsNd = { atkPct: '攻', defPct: '防', hpPct: '体', critRate: '暴击率', critDmg: '暴伤', lifestealPct: '吸血', dodge: '闪避', damageReduction: '减伤', reduceMonsterDef: '破防', vulnerablePct: '易伤', goldPct: '金币', expPct: '经验' };
                    function fmtLineNd(obj, m) {
                        if (!obj || typeof obj !== 'object') return '';
                        m = m != null && m > 0 ? m : 1;
                        var ps = [];
                        for (var k in obj) if (obj.hasOwnProperty(k) && typeof obj[k] === 'number') {
                            var v = m !== 1 ? Math.round(obj[k] * m) : obj[k];
                            ps.push((labelsNd[k] || k) + '+' + v + '%');
                        }
                        return ps.join(' ');
                    }
                    var ePet = fmtLineNd(baseItem.pet, mult);
                    var ePlayer = fmtLineNd(baseItem.player, mult);
                    var eGlobal = fmtLineNd(baseItem.global, mult);
                    var segs = [];
                    segs.push('Lv.' + ndLv + '/15');
                    if (!ePet && !ePlayer && !eGlobal && baseItem.desc) {
                        // 只有描述时，至少展示 Lv + 描述
                        segs.push(baseItem.desc);
                    } else {
                    if (ePet) segs.push('宠物: ' + ePet);
                    if (ePlayer) segs.push('玩家: ' + ePlayer);
                    if (eGlobal) segs.push('全局: ' + eGlobal);
                    }
                    if (segs.length) extra = ' <span style="color:#b388ff;font-size:12px;">(' + segs.join('；') + ')</span>';
                } else if (row.itemType === 'abyssPetShoujue') {
                    var sjName = row.skillName || (baseItem.skillName || baseItem.skillId);
                    if (sjName) extra = ' <span style="color:#b388ff;font-size:12px;">[' + sjName + ']</span>';
                }
                var pricePartA = (row.saleMode === 'auction') ? (networkMarketAuctionTag(row) + ' 币') : (' <span style="color:#ffd700">' + (row.price != null ? row.price : 0) + ' 币</span>');
                var info = '<span style="color:#ddd">' + namePart + '</span>' + extra + pricePartA + ' 玩家: <span style="color:#81c784">' + sellerNameStr + '</span>' + autoDelistHtml;
                var isMine = (myId && row.sellerId && String(row.sellerId).trim().toLowerCase() === myId) || (row.sellerName && myName && row.sellerName === myName);
                var btn = networkMarketRowButtons(row, isMine);
                div.innerHTML = info + btn;
                listEl.appendChild(div);
                return;
            }
            if (row.itemType === 'supremeArtifact') {
                var sa = row.supremeArtifact || {};
                window._marketSupremeArtifactCache = window._marketSupremeArtifactCache || {};
                window._marketSupremeArtifactCache[row.listingId] = sa;
                var lidEsc = String(row.listingId || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                var infoBtnSup = '<button type="button" onclick="openNetworkMarketSupremeArtifactInfoDialog(\'' + lidEsc + '\')" style="margin-right:6px;padding:4px 10px;background:linear-gradient(180deg,#5e35b1,#4527a0);color:#fff;border:1px solid rgba(255,213,128,0.35);border-radius:6px;cursor:pointer;font-size:12px;">信息</button>';
                var aff = '';
                if (Array.isArray(sa.affixes)) {
                    aff = sa.affixes.map(function(a) {
                        var pct = (typeof formatSupremeAffixPct === 'function') ? formatSupremeAffixPct(a) : ('+' + (a.value != null ? a.value : '') + '%');
                        return ((a.type || '') + ' ' + pct).trim();
                    }).join(' · ');
                }
                namePart = row.displayName || sa.displayName || sa.name || '至尊神器';
                var extraS = aff ? (' <span style="color:#ffe082;font-size:12px;">(' + aff + ')</span>') : '';
                var pricePartS = (row.saleMode === 'auction') ? (networkMarketAuctionTag(row) + ' 币') : (' <span style="color:#ffd700">' + (row.price != null ? row.price : 0) + ' 币</span>');
                var infoS = '<span style="color:#fff3e0">' + namePart + '</span>' + extraS + ' <span style="color:#b39ddb;font-size:12px;">' + (sa.sLevel || '') + ' · ' + (sa.qualityName || '') + ' · ' + (sa.partLabel || '') + '</span>' + pricePartS + ' 玩家: <span style="color:#81c784">' + sellerNameStr + '</span>' + autoDelistHtml;
                var isMineS = (myId && row.sellerId && String(row.sellerId).trim().toLowerCase() === myId) || (row.sellerName && myName && row.sellerName === myName);
                var btnS = infoBtnSup + networkMarketRowButtons(row, isMineS);
                div.innerHTML = infoS + btnS;
                listEl.appendChild(div);
                return;
            }
            slotName = slotNames[row.slot] || row.slot || '';
            qualityName = qualityNames[row.quality] != null ? qualityNames[row.quality] : '';
            var baseName = (row.displayName || row.name || '');
            var enhanceLv = (row.enhanceLevel != null ? row.enhanceLevel : row.enhance_level != null ? row.enhance_level : row.enhance != null ? row.enhance : (row.artifact && row.artifact.enhanceLevel != null) ? row.artifact.enhanceLevel : (row.itemType === 'artifact' && row.level != null) ? row.level : null);
            if (enhanceLv == null || enhanceLv < 0) {
                var match = (baseName || '').match(/强化\s*\+?\s*(\d+)/);
                if (match) { enhanceLv = parseInt(match[1], 10); baseName = (baseName.replace(/\s*强化\s*\+?\s*\d+\s*/g, ' ').trim()); }
            }
            if (enhanceLv != null) enhanceLv = parseInt(enhanceLv, 10);
            var enhanceSuffix = (enhanceLv != null && !isNaN(enhanceLv) && enhanceLv > 0) ? '+' + enhanceLv : '';
            namePart = baseName + enhanceSuffix + (row.attrType ? ' ' + (NETWORK_ARTIFACT_ATTR_NAMES[row.attrType] || row.attrType) + '+' + row.attrPct + '%' : '') + (row.skillName ? ' [' + row.skillName + ']' : '');
            var pricePartArt = (row.saleMode === 'auction') ? (networkMarketAuctionTag(row) + ' 币') : (' <span style="color:#ffd700">' + (row.price != null ? row.price : 0) + ' 币</span>');
            var info = '<span style="color:#ddd">' + namePart + '</span> <span style="color:#888">|</span> <span>' + slotName + '</span> <span style="color:#b388ff">' + qualityName + '</span>' + pricePartArt + ' 玩家名字: <span style="color:#81c784">' + sellerNameStr + '</span>' + autoDelistHtml;
            var isMine = (myId && row.sellerId && String(row.sellerId).trim().toLowerCase() === myId) || (row.sellerName && myName && row.sellerName === myName);
            var btn = networkMarketRowButtons(row, isMine);
            div.innerHTML = info + btn;
            listEl.appendChild(div);
        });
        if (list.length === 0) listEl.innerHTML = '<div style="color: #888; padding: 16px; text-align: center;">暂无符合条件的挂单</div>';
        var pagEl = document.getElementById('networkMarketPagination');
        if (pagEl) {
            var totalSrv = res && res.total != null ? Number(res.total) : 0;
            var pageSizeSrv = res && res.pageSize != null ? Math.max(1, Number(res.pageSize)) : 20;
            var curPageSrv = res && res.page != null ? Math.max(1, Number(res.page)) : 1;
            window._networkMarketPage = curPageSrv;
            var totalPagesSrv = Math.max(1, Math.ceil(totalSrv / pageSizeSrv));
            if (curPageSrv > totalPagesSrv) {
                window._networkMarketPage = totalPagesSrv;
                refreshNetworkMarketDialog();
                return;
            }
            var btnOn = 'padding:6px 14px;background:#444;color:#fff;border:1px solid #666;border-radius:6px;cursor:pointer;';
            var btnOff = 'padding:6px 14px;background:#333;color:#888;border:1px solid #444;border-radius:6px;cursor:not-allowed;';
            pagEl.innerHTML = '<button type="button" style="' + (curPageSrv <= 1 ? btnOff : btnOn) + '" ' + (curPageSrv <= 1 ? 'disabled' : '') + ' onclick="window._networkMarketPage=' + (curPageSrv - 1) + ';refreshNetworkMarketDialog();">上一页</button>' +
                '<span style="color:#ddd;padding:0 12px;">第 ' + curPageSrv + ' / ' + totalPagesSrv + ' 页（每页 ' + pageSizeSrv + ' 条，共 ' + totalSrv + ' 条）</span>' +
                '<button type="button" style="' + (curPageSrv >= totalPagesSrv ? btnOff : btnOn) + '" ' + (curPageSrv >= totalPagesSrv ? 'disabled' : '') + ' onclick="window._networkMarketPage=' + (curPageSrv + 1) + ';refreshNetworkMarketDialog();">下一页</button>';
        }
        if (list.length > 0) {
            updateNetworkMarketCountdowns();
            if (window._networkMarketCountdownTimer) clearInterval(window._networkMarketCountdownTimer);
            window._networkMarketCountdownTimer = setInterval(updateNetworkMarketCountdowns, 30000);
        }
        if (soldEl) {
            var soldHistory = (res && res.soldHistory) ? res.soldHistory : [];
            soldEl.innerHTML = '';
            for (var i = soldHistory.length - 1; i >= 0; i--) {
                var s = soldHistory[i];
                var line = document.createElement('div');
                line.style.cssText = 'padding: 6px 10px; margin-bottom: 4px; background: rgba(0,0,0,0.2); border-radius: 6px;';
                var buyerDisplay = (s.buyerPlayerName != null ? s.buyerPlayerName : (s.buyerName || '某玩家'));
                var sellerDisplay = (s.sellerPlayerName != null ? s.sellerPlayerName : (s.sellerName || '某玩家'));
                var soldBase = (s.displayName || '');
                var soldLv = (s.enhanceLevel != null ? s.enhanceLevel : s.enhance_level);
                if (soldLv == null || soldLv < 0) { var m = soldBase.match(/强化\s*(\d+)/); if (m) { soldLv = parseInt(m[1], 10); soldBase = soldBase.replace(/\s*强化\s*\d+\s*/g, ' ').trim(); } }
                var soldName = soldBase + ((soldLv != null && soldLv > 0) ? '+' + soldLv : '');
                line.textContent = buyerDisplay + ' 购买了 ' + sellerDisplay + ' 的 【' + soldName + '】，' + (s.price != null ? s.price : 0) + ' 联网币';
                soldEl.appendChild(line);
            }
            if (soldHistory.length === 0) soldEl.innerHTML = '<div style="color: #888; padding: 12px; text-align: center;">暂无成交记录</div>';
        }
    });
}
function closeNetworkMarketSupremeArtifactInfoDialog() {
    var ov = document.getElementById('networkMarketSupremeInfoOverlay');
    var dlg = document.getElementById('networkMarketSupremeInfoDialog');
    if (ov) ov.style.display = 'none';
    if (dlg) dlg.style.display = 'none';
}
/** 市场挂单：打开至尊神器详情，并尽量拉取已穿戴用于生命/攻击/爆伤 ±% 对比 */
function openNetworkMarketSupremeArtifactInfoDialog(listingId) {
    var lid = String(listingId || '');
    var cacheMap = window._marketSupremeArtifactCache || {};
    var sa = cacheMap[lid];
    if (!sa || typeof sa !== 'object') {
        alert('暂无该挂单神器数据，请刷新市场后再试');
        return;
    }
    function fillAndShow() {
        var equipped = (window._supremeArtifactsCache && window._supremeArtifactsCache.equipped) || {};
        var title = typeof supremeEscapeHtml === 'function' ? supremeEscapeHtml(String(sa.displayName || sa.name || '至尊神器')) : String(sa.displayName || sa.name || '至尊神器');
        var sub = (typeof supremeEscapeHtml === 'function')
            ? (supremeEscapeHtml(String(sa.partLabel || '')) + ' · ' + supremeEscapeHtml(String(sa.sLevel || '')) + ' · ' + supremeEscapeHtml(String(sa.qualityName || '')))
            : String([sa.partLabel, sa.sLevel, sa.qualityName].filter(Boolean).join(' · '));
        var affHtml = typeof supremeAffixPillsHtml === 'function' ? supremeAffixPillsHtml(sa.affixes) : '';
        var cmpHtml = typeof supremeBagCompareVsEquippedHtml === 'function' ? supremeBagCompareVsEquippedHtml(sa, equipped) : '';
        var dropHtml = typeof supremeDropMetaHtml === 'function' ? supremeDropMetaHtml(sa) : '';
        var tip = '';
        if (!window._supremeArtifactsCache || !window._supremeArtifactsCache.equipped) {
            tip = '<div style="margin-top:10px;font-size:11px;color:#ffcc80;line-height:1.5;">提示：身上已穿戴对比依赖账号至尊神器数据；若从未同步，请先打开游戏内「至尊神器」界面或保持已登录后重试。</div>';
        }
        var html = '<div style="font-weight:800;color:#ffe082;font-size:15px;line-height:1.35;margin-bottom:6px;">' + title + '</div>' +
            '<div style="font-size:12px;color:#b39ddb;margin-bottom:10px;">' + sub + '</div>' +
            affHtml + cmpHtml + dropHtml + tip;
        var content = document.getElementById('networkMarketSupremeInfoContent');
        var ov = document.getElementById('networkMarketSupremeInfoOverlay');
        var dlg = document.getElementById('networkMarketSupremeInfoDialog');
        if (content) content.innerHTML = html;
        if (ov) ov.style.display = 'block';
        if (dlg) dlg.style.display = 'block';
    }
    if (typeof goldGameGetSupremeArtifacts === 'function' && typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken()) {
        goldGameGetSupremeArtifacts().then(function() {
            fillAndShow();
        }).catch(function() {
            fillAndShow();
        });
    } else {
        fillAndShow();
    }
}
function openNetworkShopDialog() {
    if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) {
        alert('请先登录账号。');
        return;
    }
    var overlay = document.getElementById('networkShopOverlay');
    var dialog = document.getElementById('networkShopDialog');
    if (overlay) overlay.style.display = 'block';
    if (dialog) dialog.style.display = 'block';
    refreshNetworkShopDialog();
}
function closeNetworkShopDialog() {
    var overlay = document.getElementById('networkShopOverlay');
    var dialog = document.getElementById('networkShopDialog');
    if (overlay) overlay.style.display = 'none';
    if (dialog) dialog.style.display = 'none';
}
function refreshNetworkShopDialog() {
    if (typeof hasApi !== 'function' || !hasApi()) return;
    var msgEl = document.getElementById('networkShopMessage');
    if (msgEl) { msgEl.textContent = ''; msgEl.style.color = '#c5e1a5'; }
    window.goldGameApiRequest('POST', '/api/network-shop/enter', { cloudSave: typeof getCloudSavePayload === 'function' ? getCloudSavePayload() : undefined }, true).then(function(res) {
        var coinEl = document.getElementById('networkShopCoin');
        if (coinEl) {
            if (res && res.ok && typeof res.coinAmount === 'number') {
                coinEl.textContent = res.coinAmount;
            } else {
                coinEl.textContent = '--';
            }
        }
        // 同步刷新设置面板里的“联网币”显示
        if (typeof goldGameGetNetworkCoin === 'function') {
            goldGameGetNetworkCoin().then(function(r) {
                var display = document.getElementById('goldGameNetworkCoinDisplay');
                if (display) display.textContent = (r && r.ok && typeof r.amount === 'number') ? r.amount : '--';
            });
        }
        if (res && !res.ok && res.message && msgEl) {
            msgEl.style.color = '#ef9a9a';
            msgEl.textContent = res.message;
        }
    }).catch(function(e) {
        var coinEl = document.getElementById('networkShopCoin');
        if (coinEl) coinEl.textContent = '--';
        if (msgEl) { msgEl.style.color = '#ef9a9a'; msgEl.textContent = (e && e.message) ? e.message : '加载失败'; }
    });
}
function fillNetworkShopMax() {
    var coinEl = document.getElementById('networkShopCoin');
    var amountEl = document.getElementById('networkShopAmount');
    if (!coinEl || !amountEl) return;
    var v = parseInt(coinEl.textContent, 10);
    if (!isNaN(v) && v > 0) {
        amountEl.value = v;
    }
}
function submitNetworkShopBuy() {
    if (typeof hasApi !== 'function' || !hasApi()) { alert('未联网'); return; }
    var amountEl = document.getElementById('networkShopAmount');
    var msgEl = document.getElementById('networkShopMessage');
    if (!amountEl) return;
    var v = parseInt(amountEl.value, 10);
    if (isNaN(v) || v <= 0) {
        if (msgEl) { msgEl.style.color = '#ef9a9a'; msgEl.textContent = '请输入正确的购买数量'; }
        return;
    }
    if (msgEl) { msgEl.style.color = '#c5e1a5'; msgEl.textContent = '正在提交购买，请稍候…'; }
    window.goldGameApiRequest('POST', '/api/network-shop/buy-gold', { amount: v }, true).then(function(res) {
        if (!res || !res.ok) {
            if (msgEl) { msgEl.style.color = '#ef9a9a'; msgEl.textContent = (res && res.message) ? res.message : '购买失败'; }
            return;
        }
        var coinEl = document.getElementById('networkShopCoin');
        if (coinEl && typeof res.coinAmount === 'number') {
            coinEl.textContent = res.coinAmount;
        }
        if (typeof goldGameGetNetworkCoin === 'function') {
            goldGameGetNetworkCoin().then(function(r) {
                var display = document.getElementById('goldGameNetworkCoinDisplay');
                if (display) display.textContent = (r && r.ok && typeof r.amount === 'number') ? r.amount : '--';
            });
        }
        var afterLoad = function() {
            if (msgEl) {
                var added = res.addedTreasure != null ? res.addedTreasure : v;
                msgEl.style.color = '#c5e1a5';
                msgEl.textContent = '购买成功，宝藏金币已增加 ' + added + '，已自动从云端加载到本地。';
            }
        };
        if (typeof goldGameDownloadSaveNoCooldown === 'function') {
            goldGameDownloadSaveNoCooldown().then(afterLoad).catch(function(e) {
                if (msgEl) {
                    msgEl.style.color = '#ef9a9a';
                    msgEl.textContent = (e && e.message) ? ('购买成功，但加载云存档失败：' + e.message) : '购买成功，但加载云存档失败';
                }
            });
        } else if (msgEl) {
            var added2 = res.addedTreasure != null ? res.addedTreasure : v;
            msgEl.style.color = '#c5e1a5';
            msgEl.textContent = '购买成功，宝藏金币已增加 ' + added2 + '。';
        }
    }).catch(function(e) {
        if (msgEl) { msgEl.style.color = '#ef9a9a'; msgEl.textContent = (e && e.message) ? e.message : '购买失败'; }
    });
}
function openGoldGameFamilyDialog() {
    if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) {
        alert('请先登录账号。');
        return;
    }
    document.getElementById('goldGameFamilyOverlay').style.display = 'block';
    document.getElementById('goldGameFamilyDialog').style.display = 'block';
    document.getElementById('goldGameFamilyMinePanel').style.display = 'none';
    document.getElementById('goldGameFamilyListPanel').style.display = 'none';
    document.getElementById('goldGameFamilyLoading').style.display = 'block';
    if (typeof goldGameFamilyMine !== 'function') {
        document.getElementById('goldGameFamilyLoading').style.display = 'none';
        document.getElementById('goldGameFamilyListPanel').style.display = 'block';
        refreshGoldGameFamilyList();
        return;
    }
    goldGameFamilyMine().then(function(res) {
        document.getElementById('goldGameFamilyLoading').style.display = 'none';
        if (res.ok && res.family) {
            window._goldGameFamilyName = (res.family.name != null && res.family.name !== '') ? String(res.family.name) : null;
            if (typeof updateGoldGameFamilyNameDisplay === 'function') updateGoldGameFamilyNameDisplay();
            document.getElementById('goldGameFamilyMinePanel').style.display = 'block';
            var f = res.family;
            var infoEl = document.getElementById('goldGameFamilyMineInfo');
            infoEl.innerHTML = '<strong>' + (f.name || '') + '</strong> Lv.' + (f.level || 1) + ' 人数 ' + (f.memberCount || 0) + '/' + (f.maxMembers || 10) + ' 经验 ' + (f.exp || 0) + '/' + (f.expToNextLevel || 50) + ' 世界地图经验+' + (f.worldExpBonusPercent || 0) + '% 家族总贡献 ' + (f.totalContribution != null ? f.totalContribution : 0) + ' 族长: ' + (f.leaderName || '');
            var currentUserId = res.currentUserId || '';
            var isCurrentUserLeader = (currentUserId && f.leaderId === currentUserId);
            var viceLeaderIds = f.viceLeaderIds || [];
            var isCurrentUserViceLeader = viceLeaderIds.indexOf(currentUserId) !== -1;
            var maxViceLeaders = typeof f.maxViceLeaders === 'number' ? f.maxViceLeaders : 1;
            var disbandBtn = document.getElementById('goldGameFamilyDisbandBtn');
            if (disbandBtn) disbandBtn.style.display = isCurrentUserLeader ? '' : 'none';
            var applicationsBtn = document.getElementById('goldGameFamilyApplicationsBtn');
            if (applicationsBtn) applicationsBtn.style.display = (isCurrentUserLeader || isCurrentUserViceLeader) ? '' : 'none';
            var shopBtn = document.getElementById('goldGameFamilyShopBtn');
            if (shopBtn) shopBtn.style.display = (isCurrentUserLeader || isCurrentUserViceLeader) ? '' : 'none';
            var membersEl = document.getElementById('goldGameFamilyMembers');
            var rows = (f.members || []).map(function(m) {
                var roleText = m.isLeader ? '族长' : (m.isViceLeader ? '副族长' : '');
                var canKick = !m.isLeader && m.userId !== currentUserId && (isCurrentUserLeader || (isCurrentUserViceLeader && !m.isViceLeader));
                var kickBtn = canKick
                    ? ' <button type="button" onclick="goldGameFamilyKickConfirm(\'' + (m.userId || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\');" style="padding: 2px 8px; font-size: 11px; background: #c62828; color: #fff; border: none; border-radius: 4px; cursor: pointer;">踢出</button>'
                    : '';
                var transferLeaderBtn = isCurrentUserLeader && !m.isLeader
                    ? ' <button type="button" onclick="goldGameFamilyTransferLeaderConfirm(\'' + (m.userId || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\');" style="padding: 2px 8px; font-size: 11px; background: #7b1fa2; color: #fff; border: none; border-radius: 4px; cursor: pointer;">转让族长</button>'
                    : '';
                var appointViceBtn = isCurrentUserLeader && !m.isLeader && !m.isViceLeader && viceLeaderIds.length < maxViceLeaders
                    ? ' <button type="button" onclick="goldGameFamilyAppointViceConfirm(\'' + (m.userId || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\');" style="padding: 2px 8px; font-size: 11px; background: #5e35b1; color: #fff; border: none; border-radius: 4px; cursor: pointer;">任命副族长</button>'
                    : '';
                var removeViceBtn = isCurrentUserLeader && m.isViceLeader
                    ? ' <button type="button" onclick="goldGameFamilyRemoveViceConfirm(\'' + (m.userId || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\');" style="padding: 2px 8px; font-size: 11px; background: #455a64; color: #fff; border: none; border-radius: 4px; cursor: pointer;">撤销副族长</button>'
                    : '';
                var lastOnlineText = '';
                if (m.lastSaveAt != null && typeof m.lastSaveAt === 'number') {
                    var d = new Date(m.lastSaveAt);
                    var now = Date.now();
                    var diff = Math.floor((now - m.lastSaveAt) / 1000);
                    if (diff < 60) lastOnlineText = '在线';
                    else if (diff < 3600) lastOnlineText = Math.floor(diff / 60) + '分钟前';
                    else if (diff < 86400) lastOnlineText = Math.floor(diff / 3600) + '小时前';
                    else if (diff < 604800) lastOnlineText = Math.floor(diff / 86400) + '天前';
                    else lastOnlineText = (d.getMonth() + 1) + '/' + d.getDate();
                } else lastOnlineText = '--';
                return '<tr><td>' + (m.playerName || m.userId || '') + '</td><td>' + (m.huaShengCount != null ? Number(m.huaShengCount) : 0) + '</td><td>' + (m.cycleLevel != null ? m.cycleLevel : 0) + '</td><td>' + (m.bestFloor != null ? m.bestFloor : 0) + '</td><td>' + (m.reincarnationCount != null ? m.reincarnationCount : 0) + '</td><td>' + (m.towerFloor != null ? m.towerFloor : 0) + '</td><td>' + (m.maxStage != null ? m.maxStage : 0) + '</td><td>' + (m.contribution != null ? m.contribution : 0) + '</td><td>' + lastOnlineText + '</td><td>' + roleText + kickBtn + transferLeaderBtn + appointViceBtn + removeViceBtn + '</td></tr>';
            });
            membersEl.innerHTML = '<table style="width:100%; border-collapse: collapse; font-size: 12px;"><thead><tr style="background: rgba(156,39,176,0.3);"><th style="padding:6px;">玩家名</th><th>化圣</th><th>轮回</th><th>深渊层</th><th>转生</th><th>通天塔</th><th>关卡</th><th>贡献</th><th>最后在线</th><th></th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
            if (typeof goldGameFamilyDailyProgress === 'function') {
                goldGameFamilyDailyProgress().then(function(prog) {
                    var progEl = document.getElementById('goldGameFamilyDailyProgress');
                    if (!progEl || !prog.ok) return;
                    var layers = (prog.layers || []).filter(function(l) { return l.done; }).map(function(l) { return l.floor; });
                    var arts = (prog.artifactDrops || []).filter(function(a) { return a.done; }).map(function(a) { return a.floor; });
                    var coinFloors = (prog.milestoneNetworkCoins || []).filter(function(a) { return a.done; }).map(function(a) { return a.floor; });
                    progEl.textContent = '今日家族任务: 已通过层数 ' + (layers.length ? layers.join(', ') : '无') + '；神器已领: ' + (arts.length ? arts.join(', ') : '无') + '；联网币已领(各5): ' + (coinFloors.length ? coinFloors.join(', ') : '无');
                });
            }
            if (typeof goldGameFamilyShopStatus === 'function') {
                goldGameFamilyShopStatus().catch(function() {});
            }
        } else {
            window._goldGameFamilyName = null;
            if (typeof updateGoldGameFamilyNameDisplay === 'function') updateGoldGameFamilyNameDisplay();
            document.getElementById('goldGameFamilyListPanel').style.display = 'block';
            refreshGoldGameFamilyList();
        }
    }).catch(function() {
        document.getElementById('goldGameFamilyLoading').style.display = 'none';
        document.getElementById('goldGameFamilyListPanel').style.display = 'block';
        refreshGoldGameFamilyList();
    });
}
function refreshGoldGameFamilyList() {
    if (typeof goldGameFamilyList !== 'function') return;
    goldGameFamilyList().then(function(res) {
        var listEl = document.getElementById('goldGameFamilyListContainer');
        if (!listEl) return;
        var list = (res && res.list) ? res.list : [];
        listEl.innerHTML = '';
        list.forEach(function(f) {
            var div = document.createElement('div');
            div.style.cssText = 'padding: 10px 12px; background: #2a2a4a; border-radius: 8px; margin-bottom: 6px; font-size: 13px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;';
            div.innerHTML = '<span><strong>' + (f.name || '') + '</strong> Lv.' + (f.level || 1) + ' ' + (f.memberCount || 0) + '/' + (f.maxMembers || 10) + ' 族长: ' + (f.leaderName || '') + '</span><button type="button" onclick="goldGameFamilyApplyConfirm(\'' + (f.id || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\');" style="padding: 4px 12px; background: #9c27b0; color: #fff; border: none; border-radius: 6px; cursor: pointer;">申请加入</button>';
            listEl.appendChild(div);
        });
        if (list.length === 0) listEl.innerHTML = '<div style="color: #888; padding: 16px; text-align: center;">暂无家族，可创建新家族</div>';
    });
}
function goldGameFamilyCreateSubmit() {
    var nameEl = document.getElementById('goldGameFamilyCreateName');
    var name = nameEl ? nameEl.value.trim() : '';
    if (!name) { alert('请输入家族名字'); return; }
    if (typeof goldGameFamilyCreate !== 'function') return;
    goldGameFamilyCreate(name).then(function(res) {
        alert('创建成功');
        openGoldGameFamilyDialog();
    }).catch(function(e) { alert(e.message || '创建失败'); });
}
function openGoldGameFamilyShopDialog() {
    if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) {
        alert('请先登录账号。');
        return;
    }
    var overlay = document.getElementById('goldGameFamilyShopOverlay');
    var dialog = document.getElementById('goldGameFamilyShopDialog');
    if (!overlay || !dialog) {
        alert('家族商店界面未加载，请刷新页面后重试');
        return;
    }
    overlay.style.display = 'block';
    dialog.style.display = 'block';
    if (typeof goldGameFamilyShopStatus === 'function') {
        goldGameFamilyShopStatus().catch(function() {});
    }
}
function closeGoldGameFamilyShopDialog() {
    var overlay = document.getElementById('goldGameFamilyShopOverlay');
    var dialog = document.getElementById('goldGameFamilyShopDialog');
    if (overlay) overlay.style.display = 'none';
    if (dialog) dialog.style.display = 'none';
}
function goldGameConfirm(message, onConfirm, onCancel) {
    var msgEl = document.getElementById('goldGameConfirmMessage');
    var overlay = document.getElementById('goldGameConfirmOverlay');
    var dialog = document.getElementById('goldGameConfirmDialog');
    var okBtn = document.getElementById('goldGameConfirmOk');
    var cancelBtn = document.getElementById('goldGameConfirmCancel');
    if (!msgEl || !overlay || !dialog) return;
    msgEl.textContent = message || '';
    overlay.style.display = 'block';
    dialog.style.display = 'block';
    function closeConfirm() {
        overlay.style.display = 'none';
        dialog.style.display = 'none';
    }
    function doOk() {
        closeConfirm();
        if (typeof onConfirm === 'function') onConfirm();
    }
    function doCancel() {
        closeConfirm();
        if (typeof onCancel === 'function') onCancel();
    }
    okBtn.onclick = doOk;
    cancelBtn.onclick = doCancel;
    overlay.onclick = function(e) {
        if (e.target === overlay) doCancel();
    };
}
function goldGameFamilyApplyConfirm(familyId) {
    if (!familyId) return;
    goldGameConfirm('确定向该家族提交申请？等待族长或副族长同意后即可加入。', function() {
        if (typeof goldGameFamilyApply !== 'function') return;
        goldGameFamilyApply(familyId).then(function(res) {
            alert(res.message || '申请已提交，请等待族长或副族长同意');
            openGoldGameFamilyDialog();
        }).catch(function(e) { alert(e.message || '申请失败'); });
    });
}
function openGoldGameFamilyApplicationsDialog() {
    document.getElementById('goldGameFamilyApplicationsOverlay').style.display = 'block';
    document.getElementById('goldGameFamilyApplicationsDialog').style.display = 'block';
    document.getElementById('goldGameFamilyApplicationsList').innerHTML = '<p style="color:#888;">加载中…</p>';
    if (typeof goldGameFamilyApplications !== 'function') {
        document.getElementById('goldGameFamilyApplicationsList').innerHTML = '<p style="color:#888;">无法加载</p>';
        return;
    }
    goldGameFamilyApplications().then(function(res) {
        var listEl = document.getElementById('goldGameFamilyApplicationsList');
        if (!listEl) return;
        var list = (res && res.list) ? res.list : [];
        var canManage = res && res.canManage;
        if (list.length === 0) {
            listEl.innerHTML = '<p style="color:#888; padding: 20px; text-align: center;">暂无申请</p>';
            return;
        }
        var rows = list.map(function(a) {
            var playerName = (a.playerName != null && a.playerName !== '--') ? a.playerName : '--';
            var cycleLevel = a.cycleLevel != null ? a.cycleLevel : 0;
            var bestFloor = a.bestFloor != null ? a.bestFloor : 0;
            var reinc = a.reincarnationCount != null ? a.reincarnationCount : 0;
            var tower = a.towerFloor != null ? a.towerFloor : 0;
            var maxStage = a.maxStage != null ? a.maxStage : 0;
            var btns = canManage ? ' <button type="button" onclick="goldGameFamilyApproveApplicationConfirm(\'' + (a.userId || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\');" style="padding: 4px 10px; font-size: 12px; background: #4caf50; color: #fff; border: none; border-radius: 6px; cursor: pointer;">同意</button> <button type="button" onclick="goldGameFamilyRejectApplicationConfirm(\'' + (a.userId || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\');" style="padding: 4px 10px; font-size: 12px; background: #c62828; color: #fff; border: none; border-radius: 6px; cursor: pointer;">拒绝</button>' : '';
            return '<tr><td>' + playerName + '</td><td>' + cycleLevel + '</td><td>' + bestFloor + '</td><td>' + reinc + '</td><td>' + tower + '</td><td>' + maxStage + '</td><td>' + btns + '</td></tr>';
        });
        listEl.innerHTML = '<table style="width:100%; border-collapse: collapse; font-size: 12px;"><thead><tr style="background: rgba(94,53,177,0.3);"><th style="padding:6px;">玩家名</th><th>轮回</th><th>深渊层</th><th>转生</th><th>通天塔</th><th>关卡</th><th></th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
    });
}
function closeGoldGameFamilyApplicationsDialog() {
    document.getElementById('goldGameFamilyApplicationsOverlay').style.display = 'none';
    document.getElementById('goldGameFamilyApplicationsDialog').style.display = 'none';
}
function openGoldGameFamilyDailyTaskDialog() {
    var overlay = document.getElementById('goldGameFamilyDailyTaskOverlay');
    var dialog = document.getElementById('goldGameFamilyDailyTaskDialog');
    if (!overlay || !dialog) return;
    overlay.style.display = 'block';
    dialog.style.display = 'block';
}
function closeGoldGameFamilyDailyTaskDialog() {
    var overlay = document.getElementById('goldGameFamilyDailyTaskOverlay');
    var dialog = document.getElementById('goldGameFamilyDailyTaskDialog');
    if (!overlay || !dialog) return;
    overlay.style.display = 'none';
    dialog.style.display = 'none';
}
function goldGameFamilyApproveApplicationConfirm(applicantId) {
    if (!applicantId) return;
    goldGameConfirm('确定同意该玩家加入家族？', function() {
        if (typeof goldGameFamilyApproveApplication !== 'function') return;
        goldGameFamilyApproveApplication(applicantId).then(function() {
            openGoldGameFamilyApplicationsDialog();
        }).catch(function(e) { alert(e.message || '操作失败'); });
    });
}
function goldGameFamilyRejectApplicationConfirm(applicantId) {
    if (!applicantId) return;
    goldGameConfirm('确定拒绝该申请？', function() {
        if (typeof goldGameFamilyRejectApplication !== 'function') return;
        goldGameFamilyRejectApplication(applicantId).then(function() {
            openGoldGameFamilyApplicationsDialog();
        }).catch(function(e) { alert(e.message || '操作失败'); });
    });
}
function goldGameFamilyLeaveConfirm() {
    if (!confirm('确定退出当前家族？')) return;
    if (typeof goldGameFamilyLeave !== 'function') return;
    goldGameFamilyLeave().then(function(res) {
        window._goldGameFamilyName = null;
        if (typeof updateGoldGameFamilyNameDisplay === 'function') updateGoldGameFamilyNameDisplay();
        alert('已退出家族');
        closeGoldGameFamilyDialog();
    }).catch(function(e) { alert(e.message || '退出失败'); });
}
function goldGameFamilyKickConfirm(memberId) {
    if (!memberId || !confirm('确定踢出该成员？')) return;
    if (typeof goldGameFamilyKick !== 'function') return;
    goldGameFamilyKick(memberId).then(function(res) {
        openGoldGameFamilyDialog();
    }).catch(function(e) { alert(e.message || '操作失败'); });
}
function goldGameFamilyTransferLeaderConfirm(memberId) {
    if (!memberId || !confirm('确定将族长转让给该成员？转让后您将变为普通成员。')) return;
    if (typeof goldGameFamilyTransferLeader !== 'function') return;
    goldGameFamilyTransferLeader(memberId).then(function(res) {
        alert('转让成功');
        openGoldGameFamilyDialog();
    }).catch(function(e) { alert(e.message || '操作失败'); });
}
function goldGameFamilyAppointViceConfirm(memberId) {
    if (!memberId || !confirm('确定任命该成员为副族长？')) return;
    if (typeof goldGameFamilyAppointVice !== 'function') return;
    goldGameFamilyAppointVice(memberId).then(function(res) {
        alert('任命成功');
        openGoldGameFamilyDialog();
    }).catch(function(e) { alert(e.message || '操作失败'); });
}
function goldGameFamilyRemoveViceConfirm(memberId) {
    if (!memberId || !confirm('确定撤销该成员的副族长？')) return;
    if (typeof goldGameFamilyRemoveVice !== 'function') return;
    goldGameFamilyRemoveVice(memberId).then(function(res) {
        alert('已撤销');
        openGoldGameFamilyDialog();
    }).catch(function(e) { alert(e.message || '操作失败'); });
}
function goldGameFamilyDisbandConfirm() {
    if (!confirm('确定解散家族？解散后所有成员将退出，且无法恢复。')) return;
    if (typeof goldGameFamilyDisband !== 'function') return;
    goldGameFamilyDisband().then(function(res) {
        window._goldGameFamilyName = null;
        if (typeof updateGoldGameFamilyNameDisplay === 'function') updateGoldGameFamilyNameDisplay();
        alert('家族已解散');
        closeGoldGameFamilyDialog();
    }).catch(function(e) { alert(e.message || '操作失败'); });
}
function closeGoldGameFamilyDialog() {
    document.getElementById('goldGameFamilyOverlay').style.display = 'none';
    document.getElementById('goldGameFamilyDialog').style.display = 'none';
}
(function(){ var o=document.getElementById('networkArtifactOverlay'); if(o) o.addEventListener('click', closeNetworkArtifactPanel); var ad=document.getElementById('networkAbyssDivineOverlay'); if(ad) ad.addEventListener('click', closeNetworkAbyssDivinePanel); var m=document.getElementById('networkMarketOverlay'); if(m) m.addEventListener('click', closeNetworkMarketDialog); var fm=document.getElementById('goldGameFamilyOverlay'); if(fm) fm.addEventListener('click', closeGoldGameFamilyDialog); var fa=document.getElementById('goldGameFamilyApplicationsOverlay'); if(fa) fa.addEventListener('click', closeGoldGameFamilyApplicationsDialog); })();


        (function() {
            var w = window.screen.width;
            if (!(w <= 1024 && w > 0)) return;
            document.documentElement.classList.add('gold-game-mobile-viewport');
            var meta = document.getElementById('viewportMeta');
            var scale = Math.max(0.3, Math.min(1, w / 1280));
            if (meta) meta.setAttribute('content', 'width=1280, initial-scale=' + scale + ', maximum-scale=2, user-scalable=yes, interactive-widget=overlays-content');
            window._mobileViewportNoZoomLockCount = window._mobileViewportNoZoomLockCount || 0;
            window._abyssChatViewportPrevContent = window._abyssChatViewportPrevContent || '';
            window._extractViewportInitialScale = window._extractViewportInitialScale || function(content) {
                var m = String(content || '').match(/initial-scale\s*=\s*([0-9.]+)/i);
                if (m && m[1] != null) {
                    var n = Number(m[1]);
                    if (Number.isFinite(n) && n > 0) return n;
                }
                if (window.visualViewport && Number.isFinite(window.visualViewport.scale) && window.visualViewport.scale > 0) return Number(window.visualViewport.scale);
                return scale;
            };
            window.lockMobileViewportNoZoom = window.lockMobileViewportNoZoom || function() {
                var m = document.getElementById('viewportMeta');
                if (!m) return;
                if (window._mobileViewportNoZoomLockCount === 0) {
                    window._abyssChatViewportPrevContent = m.getAttribute('content') || '';
                    var prev = window._abyssChatViewportPrevContent || '';
                    var initialScale = window._extractViewportInitialScale(prev);
                    var base = prev || ('width=1280, initial-scale=' + initialScale + ', maximum-scale=2, user-scalable=yes');
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
                    m.setAttribute('content', content);
                }
                window._mobileViewportNoZoomLockCount++;
            };
            window.unlockMobileViewportNoZoom = window.unlockMobileViewportNoZoom || function() {
                if (window._mobileViewportNoZoomLockCount <= 0) return;
                window._mobileViewportNoZoomLockCount--;
                if (window._mobileViewportNoZoomLockCount > 0) return;
                var m = document.getElementById('viewportMeta');
                if (!m) return;
                var prev = window._abyssChatViewportPrevContent || '';
                if (prev) m.setAttribute('content', prev);
            };
            window.isGoldGameMobileViewport = window.isGoldGameMobileViewport || function() {
                return !!(document.documentElement && document.documentElement.classList.contains('gold-game-mobile-viewport'));
            };
            window._mobileFormFieldPointerLockAt = 0;
            function _headIsMainGameFormField(el) {
                if (!el || !el.matches) return false;
                return el.matches(
                    'input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]):not([type=button]):not([type=submit]):not([type=reset]), select, textarea'
                );
            }
            function _headOnFormFieldBeforeFocus(e) {
                var t = e.target;
                if (!t || !t.closest) return;
                var field = t.closest(
                    'input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]):not([type=button]):not([type=submit]):not([type=reset]), select, textarea'
                );
                if (!field || !_headIsMainGameFormField(field)) return;
                window._mobileFormFieldPointerLockAt = Date.now();
                if (typeof window.lockMobileViewportNoZoom === 'function') window.lockMobileViewportNoZoom();
            }
            if (!window._mainGameInputViewportEarlyHooked) {
                window._mainGameInputViewportEarlyHooked = true;
                document.addEventListener('pointerdown', _headOnFormFieldBeforeFocus, true);
                document.addEventListener('touchstart', _headOnFormFieldBeforeFocus, { capture: true, passive: true });
            }
        })();
        
        (function() {
            var lastTouchEnd = 0;
            function isInteractive(el) {
                if (!el || !el.tagName) return false;
                var tag = el.tagName.toLowerCase();
                if (tag === 'button' || tag === 'a' || tag === 'input' || tag === 'select' || tag === 'textarea') return true;
                if (el.getAttribute && el.getAttribute('onclick')) return true;
                if (el.closest && el.closest('button, a, input, select, textarea')) return true;
                return false;
            }
            function shouldPreventDoubleTap(ev) {
                var now = Date.now();
                return (now - lastTouchEnd <= 400) && !isInteractive(ev.target);
            }
            document.addEventListener('touchstart', function(ev) {
                if (ev.touches && ev.touches.length > 1) return;
                if (shouldPreventDoubleTap(ev)) ev.preventDefault();
            }, { passive: false });
            document.addEventListener('touchend', function(ev) {
                if (ev.touches && ev.touches.length > 0) return;
                if (shouldPreventDoubleTap(ev)) ev.preventDefault();
                lastTouchEnd = Date.now();
            }, { passive: false });
        })();

        (function() {
            try {
                var raw = localStorage.getItem('goldGameSave');
                if (raw) {
                    var save = JSON.parse(raw);
                    if (save && save.lastUpdate != null)
                        window.__goldGameSaveLastUpdate = save.lastUpdate;
                }
            } catch (e) {}
        })();
        (function() {
            try {
                var u = localStorage.getItem('goldGameMainBackgroundUrl');
                if (u && u.length > 0) {
                    document.documentElement.style.setProperty('--page-bg-image', 'url("' + String(u).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '")');
                    document.documentElement.classList.add('gold-game-has-page-bg');
                    var op = localStorage.getItem('goldGamePanelOpacity');
                    var p = parseInt(op != null && op !== '' ? op : '74', 10);
                    if (!isFinite(p)) p = 74;
                    p = Math.min(100, Math.max(1, p));
                    document.documentElement.style.setProperty('--panel-alpha', String((p - 1) / 99));
                    var tc = localStorage.getItem('goldGameUiTextColor');
                    if (tc && /^#[0-9A-Fa-f]{6}$/.test(String(tc).trim())) {
                        document.documentElement.style.setProperty('--page-text-custom', String(tc).trim());
                    }
                }
            } catch (e) {}
        })();

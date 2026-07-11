// 洞天劫
        function toggleDongtianJie() {
            if (player.reincarnationCount < 50) {
                alert("需要达到50转才能开启洞天劫！");
                return;
            }
            if (typeof hasApi !== 'function' || !hasApi()) {
                alert("洞天劫需联网：请先在设置中配置服务器地址并登录账号。");
                return;
            }
            if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) {
                alert("请先登录账号后再进入洞天劫（存档仅保存在服务器账号上，不存本地）。");
                return;
            }
            /** 打开洞天劫时若已断网：整页刷新，恢复后重新进入（避免 iframe 卡在半初始化状态） */
            if (typeof navigator !== 'undefined' && navigator.onLine === false) {
                location.reload();
                return;
            }
            var ui = document.getElementById('dongtianJieUI');
            var iframe = document.getElementById('dongtianJieIframe');
            if (!ui || !iframe) return;
            var dongtianPanelVisible =
                ui.classList.contains('dongtian-open') ||
                ui.classList.contains('dongtian-mobile-fullscreen') ||
                ui.classList.contains('dongtian-maximized');
            if (dongtianPanelVisible) {
                closeDongtianJie();
                return;
            }
            var openEpoch = ++__dongtianPanelEpoch;
            var pname = (player && player.name) ? String(player.name) : '';
            __dongtianBuildWatchParentName = pname;
            function openDongtianIframe() {
                if (openEpoch !== __dongtianPanelEpoch) return;
                iframe.src = buildDongtianIframeSrc(pname, window.__goldGameClientBuild);
                ui.classList.add('dongtian-open');
                startDongtianBuildWatch(pname);
                iframe.addEventListener('load', function onDongtianIframeLoad() {
                    iframe.removeEventListener('load', onDongtianIframeLoad);
                    if (openEpoch !== __dongtianPanelEpoch) return;
                    try {
                        if (ui.classList.contains('dongtian-mobile-fullscreen')) {
                            notifyDongtianIframeParentMobileFs(true);
                        }
                    } catch (eLoad) {}
                });
            }
            /** 每次打开都向 API 拉最新 client-build，避免父页会话内一直用登录时的旧 ?v= */
            var buildP =
                typeof goldGameRefreshClientBuild === 'function'
                    ? goldGameRefreshClientBuild()
                    : Promise.resolve(null);
            Promise.resolve(buildP).then(openDongtianIframe);
        }

        function notifyDongtianIframeParentMobileFs(active) {
            var iframe = document.getElementById('dongtianJieIframe');
            if (!iframe || !iframe.contentWindow) return;
            try {
                iframe.contentWindow.postMessage({ type: 'dongtianParentMobileFullscreen', active: !!active }, '*');
            } catch (e) {}
        }


        function isDongtianJiePanelOpenGlobal() {
            try {
                var ui = document.getElementById('dongtianJieUI');
                return !!(ui && ui.classList.contains('dongtian-open'));
            } catch (eDt) {
                return false;
            }
        }

        /** 关主游戏页/切后台时：洞天劫仍开着则冲整包档（iframe 销毁会中断子页 fetch） */
        function parentKeepaliveDongtianSavePostBody(postBody) {
            if (!postBody || typeof hasApi !== 'function' || !hasApi()) return false;
            var token = typeof getGoldGameAuthToken === 'function' ? getGoldGameAuthToken() : null;
            if (!token) return false;
            var base = (window.GOLD_GAME_API_BASE || '').replace(/\/$/, '');
            if (!base) return false;
            try {
                var bodyStr = JSON.stringify(postBody);
                if (bodyStr.length > 60000) return false;
                fetch(base + '/api/dongtian-jie/save', {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                    body: bodyStr,
                    keepalive: true
                }).catch(function () {});
                return true;
            } catch (eKa) {
                return false;
            }
        }

        function flushDongtianCloudSaveKeepalive() {
            if (!isDongtianJiePanelOpenGlobal()) return false;
            if (typeof getGoldGameAuthToken !== 'function' || !getGoldGameAuthToken()) return false;
            var iframe = document.getElementById('dongtianJieIframe');
            var dtWin = iframe && iframe.contentWindow;
            if (!dtWin) return false;
            try {
                if (typeof dtWin.dongtianFlushCloudSaveImmediate === 'function') {
                    dtWin.dongtianFlushCloudSaveImmediate();
                } else if (typeof dtWin.__dongtianCloudFlushSave === 'function') {
                    dtWin.__dongtianCloudFlushSave({ immediate: true, forceCloud: true, playerMutation: true });
                }
            } catch (eIframe) {}
            return true;
        }
        window.flushDongtianCloudSaveKeepalive = flushDongtianCloudSaveKeepalive;
        if (!window.__dongtianParentUnloadHooked) {
            window.__dongtianParentUnloadHooked = true;
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === 'hidden' && typeof window.flushDongtianCloudSaveKeepalive === 'function') {
                    window.flushDongtianCloudSaveKeepalive();
                }
            });
            window.addEventListener('pagehide', function () {
                if (typeof window.flushDongtianCloudSaveKeepalive === 'function') {
                    window.flushDongtianCloudSaveKeepalive();
                }
            });
        }

        /** 换号/登出前：在仍持有旧 token 时关闭洞天 iframe 并冲档，避免旧账号内存写入新账号 */
        function dongtianEnsureClosedBeforeAuthChange() {
            var ui = document.getElementById('dongtianJieUI');
            var iframe = document.getElementById('dongtianJieIframe');
            var wasOpen =
                ui &&
                (ui.classList.contains('dongtian-open') ||
                    ui.classList.contains('dongtian-mobile-fullscreen') ||
                    ui.classList.contains('dongtian-maximized'));
            if (wasOpen && typeof closeDongtianJie === 'function') {
                return Promise.resolve(closeDongtianJie());
            }
            try {
                var dtWin = iframe && iframe.contentWindow;
                if (dtWin && dtWin.__dongtianCloudHydrated) {
                    var flushP = Promise.resolve(true);
                    if (typeof dtWin.dongtianPrepareCloseFlush === 'function') {
                        flushP = dtWin.dongtianPrepareCloseFlush();
                    } else if (typeof dtWin.__dongtianCloudFlushSave === 'function') {
                        dtWin.__dongtianCloudFlushSave({ immediate: true, forceCloud: true, playerMutation: true });
                        flushP = new Promise(function (resolve) {
                            setTimeout(resolve, 1200);
                        });
                    }
                    return Promise.resolve(flushP).then(function () {
                        if (iframe) iframe.src = 'about:blank';
                    });
                }
            } catch (ePre) {}
            if (iframe && iframe.src && iframe.src !== 'about:blank') {
                iframe.src = 'about:blank';
            }
            return Promise.resolve();
        }
        window.dongtianEnsureClosedBeforeAuthChange = dongtianEnsureClosedBeforeAuthChange;

        function closeDongtianJie() {
            var closeEpoch = ++__dongtianPanelEpoch;
            var ui = document.getElementById('dongtianJieUI');
            var iframe = document.getElementById('dongtianJieIframe');
            var fsBtn = document.getElementById('dongtianJieFullscreenBtn');
            var dtWin = iframe && iframe.contentWindow;
            /** 立即收起面板，避免 flush 期间仍显示为「已打开」导致连点 toggle 状态错乱 */
            if (ui) {
                ui.classList.remove('dongtian-open');
                ui.classList.remove('dongtian-maximized');
                ui.classList.remove('dongtian-mobile-fullscreen');
            }
            if (fsBtn) fsBtn.textContent = '全屏';

            function finishCloseDongtianJie() {
                if (closeEpoch !== __dongtianPanelEpoch) return;
                try {
                    notifyDongtianIframeParentMobileFs(false);
                } catch (e0) {}
                try {
                    if (iframe && iframe.contentWindow && typeof iframe.contentWindow.dongtianTeardownTransientTimers === 'function') {
                        iframe.contentWindow.dongtianTeardownTransientTimers();
                    } else if (iframe && iframe.contentWindow && typeof iframe.contentWindow.stopDongtianInboxPoll === 'function') {
                        iframe.contentWindow.stopDongtianInboxPoll();
                    }
                } catch (eInbox) {}
                try {
                    if (iframe && iframe.contentWindow && typeof iframe.contentWindow.__releaseXiuMarketParentViewport === 'function') {
                        iframe.contentWindow.__releaseXiuMarketParentViewport();
                    }
                } catch (e3) {}
                try {
                    if (typeof stopDongtianBuildWatch === 'function') stopDongtianBuildWatch();
                } catch (eWatch) {}
                try {
                    if (document.fullscreenElement === ui && document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                } catch (e4) {}
                if (ui) ui.classList.remove('dongtian-maximized');
                if (ui) ui.classList.remove('dongtian-mobile-fullscreen');
                if (fsBtn) fsBtn.textContent = '全屏';
                if (iframe) iframe.src = 'about:blank';
                try {
                    if (typeof syncDongtianProfileToMainPlayer === 'function') syncDongtianProfileToMainPlayer();
                } catch (e2) {}
            }

            try {
                if (dtWin && typeof dtWin.dongtianPrepareCloseUiCleanup === 'function') {
                    dtWin.dongtianPrepareCloseUiCleanup();
                }
            } catch (eUiPre) {}
            /** 勿在冲档前 keepalive：旧 POST 体可能早于 flush，iframe 销毁后只剩 keepalive 会严重回档 */
            var flushP = Promise.resolve(true);
            try {
                if (dtWin && typeof dtWin.dongtianPrepareCloseFlush === 'function') {
                    flushP = dtWin.dongtianPrepareCloseFlush();
                } else if (dtWin && typeof dtWin.__dongtianCloudFlushSave === 'function') {
                    dtWin.__dongtianCloudFlushSave({ immediate: true, forceCloud: true, playerMutation: true });
                    flushP = new Promise(function (resolve) {
                        setTimeout(resolve, 1200);
                    });
                }
            } catch (eFlush) {}

            var closeAborted = false;
            return Promise.resolve(flushP)
                .then(function (flushResult) {
                    var pending =
                        flushResult &&
                        typeof flushResult === "object" &&
                        !!flushResult.pending;
                    try {
                        if (
                            dtWin &&
                            typeof dtWin.dongtianCloudSavePending === "function" &&
                            dtWin.dongtianCloudSavePending()
                        ) {
                            pending = true;
                        }
                    } catch (ePen) {}
                    if (!pending) return flushResult;
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(flushResult);
                        }, 2000);
                    });
                })
                .then(function (flushResult) {
                    var pending =
                        flushResult &&
                        typeof flushResult === "object" &&
                        !!flushResult.pending;
                    try {
                        if (
                            dtWin &&
                            typeof dtWin.dongtianCloudSavePending === "function" &&
                            dtWin.dongtianCloudSavePending()
                        ) {
                            pending = true;
                        }
                    } catch (ePen2) {}
                    if (!pending) return flushResult;
                    try {
                        if (typeof dtWin.dongtianFlushCloudSaveImmediate === "function") {
                            dtWin.dongtianFlushCloudSaveImmediate();
                        } else if (typeof dtWin.__dongtianCloudFlushSave === "function") {
                            dtWin.__dongtianCloudFlushSave({
                                immediate: true,
                                forceCloud: true,
                                playerMutation: true,
                            });
                        }
                    } catch (eForce) {}
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            try {
                                if (dtWin && typeof dtWin.dongtianExportCloudSavePostBody === "function") {
                                    var kbForce = dtWin.dongtianExportCloudSavePostBody();
                                    if (kbForce) parentKeepaliveDongtianSavePostBody(kbForce);
                                }
                            } catch (eKbForce) {}
                            resolve(flushResult);
                        }, 2800);
                    });
                })
                .finally(function () {
                    if (closeAborted) return;
                    try {
                        if (dtWin && typeof dtWin.dongtianExportCloudSavePostBody === 'function') {
                            var kbClose = dtWin.dongtianExportCloudSavePostBody();
                            if (kbClose) parentKeepaliveDongtianSavePostBody(kbClose);
                        }
                    } catch (eKbClose) {}
                    finishCloseDongtianJie();
                });
        }

        function setDongtianFullscreenButtonText(isFullscreen) {
            var fsBtn = document.getElementById('dongtianJieFullscreenBtn');
            if (!fsBtn) return;
            fsBtn.textContent = isFullscreen ? '退出全屏' : '全屏';
        }

        function isDongtianMobileMode() {
            var smallViewport = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 900px)').matches;
            var ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
            var mobileUA = /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(ua);
            return !!(smallViewport || mobileUA);
        }

        function toggleDongtianJieFullscreen() {
            var ui = document.getElementById('dongtianJieUI');
            if (!ui) return;
            var isMobile = isDongtianMobileMode();
            var shouldEnter = isMobile
                ? !ui.classList.contains('dongtian-mobile-fullscreen')
                : !ui.classList.contains('dongtian-maximized');
            if (shouldEnter) {
                if (isMobile) {
                    ui.classList.add('dongtian-mobile-fullscreen');
                    ui.classList.remove('dongtian-maximized');
                } else {
                    ui.classList.add('dongtian-maximized');
                    ui.classList.remove('dongtian-mobile-fullscreen');
                }
            } else {
                ui.classList.remove('dongtian-maximized');
                ui.classList.remove('dongtian-mobile-fullscreen');
            }
            setDongtianFullscreenButtonText(shouldEnter);
            notifyDongtianIframeParentMobileFs(!!(isMobile && shouldEnter));
            if (isMobile || !document.fullscreenEnabled) return;
            try {
                if (shouldEnter) {
                    if (ui.requestFullscreen) ui.requestFullscreen();
                } else if (document.fullscreenElement === ui && document.exitFullscreen) {
                    document.exitFullscreen();
                }
            } catch (e) {}
        }

        document.addEventListener('fullscreenchange', function () {
            var ui = document.getElementById('dongtianJieUI');
            if (!ui) return;
            var isFullscreen = document.fullscreenElement === ui;
            if (!isFullscreen) ui.classList.remove('dongtian-maximized');
            setDongtianFullscreenButtonText(
                isFullscreen ||
                ui.classList.contains('dongtian-maximized') ||
                ui.classList.contains('dongtian-mobile-fullscreen')
            );
        });

        /** 洞天劫面板打开时断网：经数秒确认后再刷新整页，避免移动网络抖动误重载（体感像被踢出秘境） */
        (function () {
            var offlineReloadTimer = null;
            var DONGTIAN_PARENT_OFFLINE_RELOAD_MS = 2800;
            window.addEventListener('offline', function () {
                var ui = document.getElementById('dongtianJieUI');
                if (!ui || !ui.classList.contains('dongtian-open')) return;
                if (offlineReloadTimer) clearTimeout(offlineReloadTimer);
                offlineReloadTimer = setTimeout(function () {
                    offlineReloadTimer = null;
                    try {
                        if (typeof navigator !== 'undefined' && navigator.onLine) return;
                    } catch (e) {}
                    location.reload();
                }, DONGTIAN_PARENT_OFFLINE_RELOAD_MS);
            });
            window.addEventListener('online', function () {
                if (offlineReloadTimer) {
                    clearTimeout(offlineReloadTimer);
                    offlineReloadTimer = null;
                }
            });
        })();

        /** 供洞天劫 iframe 读取主游戏头像（player 为 let，不能依赖 window.parent.player） */
        window.getGoldGamePlayerAvatarForDongtian = function () {
            try {
                if (typeof player !== "undefined" && player && player.avatar) return String(player.avatar);
            } catch (e) {}
            return "";
        };

        // 初始化疯狂地主游戏

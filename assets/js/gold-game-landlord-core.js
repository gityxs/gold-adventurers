// 地主入口
// 疯狂地主
        // 疯狂地主游戏控制函数
        function toggleLandlordGame() {
        if (player.battle.maxStage < 2) {
        alert("需要打怪模式达到第3层才能开启疯狂地主！");
        return;
    }
            const ui = document.getElementById('landlordUI');
            if (ui.style.display !== 'none' && ui.style.display !== '') {
                closeLandlordGame();
            } else {
                openLandlordGame();
            }
        }

        function openLandlordGame() {
            const ui = document.getElementById('landlordUI');
            ui.style.display = 'flex';
            initLandlordGame();
        }

        function toggleLandlordFullscreen() {
            var el = document.getElementById('landlordUI');
            var btn = document.getElementById('landlordFullscreenBtn');
            if (!el) return;
            try {
                if (document.fullscreenElement === el) {
                    if (document.exitFullscreen) document.exitFullscreen();
                } else {
                    var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
                    if (req) req.call(el);
                }
            } catch (eFs) {}
            setTimeout(function () {
                if (!btn) return;
                btn.textContent = (document.fullscreenElement === el) ? '退出全屏' : '全屏';
            }, 0);
        }

        document.addEventListener('fullscreenchange', function () {
            var el = document.getElementById('landlordUI');
            var btn = document.getElementById('landlordFullscreenBtn');
            if (!btn || !el) return;
            btn.textContent = (document.fullscreenElement === el) ? '退出全屏' : '全屏';
        });
        document.addEventListener('webkitfullscreenchange', function () {
            var el = document.getElementById('landlordUI');
            var btn = document.getElementById('landlordFullscreenBtn');
            if (!btn || !el) return;
            btn.textContent = (document.webkitFullscreenElement === el) ? '退出全屏' : '全屏';
        });

        function closeLandlordGame() {
            const ui = document.getElementById('landlordUI');
            try {
                if (document.fullscreenElement === ui && document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitFullscreenElement === ui && document.webkitExitFullscreen) document.webkitExitFullscreen();
            } catch (eX) {}
            ui.style.display = 'none';
            var fsb = document.getElementById('landlordFullscreenBtn');
            if (fsb) fsb.textContent = '全屏';
            // 不再关闭地主主定时器，否则不点进界面时天气/作物不会更新，只生效「进去那一刻」一次；主定时器保持运行才能在线看摊每10分钟刷天气
            // 关闭时清理海洋钓鱼所有定时器，防止内存泄漏与后台持续执行导致卡顿
            if (player.landlord && player.landlord.seaFishing) {
                var sf = player.landlord.seaFishing;
                if (sf.ambientInterval) { clearInterval(sf.ambientInterval); sf.ambientInterval = null; }
                if (sf.biteTimer) { clearTimeout(sf.biteTimer); sf.biteTimer = null; }
                if (sf.biteWindow) { clearTimeout(sf.biteWindow); sf.biteWindow = null; }
                if (sf.struggleTimer) { clearTimeout(sf.struggleTimer); sf.struggleTimer = null; }
                if (sf.nibbleTimers && sf.nibbleTimers.length) {
                    sf.nibbleTimers.forEach(function(t) { clearTimeout(t); });
                    sf.nibbleTimers = [];
                }
                sf.fishingState = 'idle';
            }
            saveGame(); // 关闭时保存游戏
        }

        function buildDongtianIframeSrc(parentName, buildId) {
            var build =
                buildId != null && buildId !== ''
                    ? String(buildId)
                    : window.__goldGameClientBuild != null && window.__goldGameClientBuild !== ''
                      ? String(window.__goldGameClientBuild)
                      : 'local-' + String(Date.now());
            return (
                'dilao/index.html?embedded=1&parentName=' +
                encodeURIComponent(parentName || '') +
                '&v=' +
                encodeURIComponent(build) +
                '&_entry=' +
                encodeURIComponent(String(Date.now()))
            );
        }

        function getDongtianIframeLoadedAssetBuild() {
            var iframe = document.getElementById('dongtianJieIframe');
            if (!iframe || !iframe.contentWindow) return null;
            try {
                var w = iframe.contentWindow;
                var b =
                    w.__DONGTIAN_SERVER_BUILD != null && w.__DONGTIAN_SERVER_BUILD !== ''
                        ? w.__DONGTIAN_SERVER_BUILD
                        : w.__DONGTIAN_ASSET_BUILD;
                return b != null && b !== '' ? String(b) : null;
            } catch (eB) {
                return null;
            }
        }

        var __dongtianBuildWatchTimer = null;
        var __dongtianBuildWatchParentName = '';
        /** 洞天开关代次：关闭 flush 未完成时快速重开，旧 finishClose 不得再把 iframe 置 about:blank */
        var __dongtianPanelEpoch = 0;
        function stopDongtianBuildWatch() {
            if (__dongtianBuildWatchTimer) {
                clearInterval(__dongtianBuildWatchTimer);
                __dongtianBuildWatchTimer = null;
            }
        }
        function startDongtianBuildWatch(parentName) {
            stopDongtianBuildWatch();
            __dongtianBuildWatchParentName = parentName || '';
            __dongtianBuildWatchTimer = setInterval(function () {
                var ui = document.getElementById('dongtianJieUI');
                if (!ui || !ui.classList.contains('dongtian-open')) {
                    stopDongtianBuildWatch();
                    return;
                }
                if (typeof goldGameRefreshClientBuild !== 'function') return;
                goldGameRefreshClientBuild().then(function (serverBuild) {
                    if (!serverBuild) return;
                    var loaded = getDongtianIframeLoadedAssetBuild();
                    if (loaded && String(serverBuild) !== String(loaded)) {
                        dongtianReloadIframeForStaleAssets(__dongtianBuildWatchParentName);
                    }
                });
            }, 60000);
        }

        var __dongtianIframeReloadInProgress = false;
        function dongtianReloadIframeForStaleAssets(parentName) {
            if (__dongtianIframeReloadInProgress) return;
            var ui = document.getElementById('dongtianJieUI');
            var iframe = document.getElementById('dongtianJieIframe');
            if (!ui || !iframe || !ui.classList.contains('dongtian-open')) return;
            __dongtianIframeReloadInProgress = true;
            var flushPromise = Promise.resolve(true);
            try {
                var dtWin = iframe.contentWindow;
                if (dtWin && typeof dtWin.__dongtianCloudFlushSave === 'function') {
                    dtWin.__dongtianCloudFlushSave({ immediate: true, forceCloud: true, playerMutation: true });
                    flushPromise = new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(true);
                        }, 1200);
                    });
                }
            } catch (eFlush) {}
            Promise.race([
                flushPromise.catch(function () {
                    return false;
                }),
                new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve(false);
                    }, 6500);
                }),
            ])
                .then(function () {
                    var buildP =
                        typeof goldGameRefreshClientBuild === 'function'
                            ? goldGameRefreshClientBuild()
                            : Promise.resolve(null);
                    return Promise.resolve(buildP);
                })
                .then(function () {
                    iframe.src = buildDongtianIframeSrc(parentName, window.__goldGameClientBuild);
                })
                .finally(function () {
                    __dongtianIframeReloadInProgress = false;
                });
        }

        if (!window.__dongtianBuildVisibilityHooked) {
            window.__dongtianBuildVisibilityHooked = true;
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState !== 'visible') return;
                var ui = document.getElementById('dongtianJieUI');
                if (!ui || !ui.classList.contains('dongtian-open')) return;
                if (typeof goldGameRefreshClientBuild !== 'function') return;
                goldGameRefreshClientBuild().then(function (serverBuild) {
                    if (!serverBuild) return;
                    var loaded = getDongtianIframeLoadedAssetBuild();
                    if (loaded && String(serverBuild) !== String(loaded)) {
                        dongtianReloadIframeForStaleAssets(__dongtianBuildWatchParentName);
                    }
                });
            });
        }


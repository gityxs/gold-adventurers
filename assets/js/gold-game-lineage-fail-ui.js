/**
 * 家族传承 · 条件不足失败弹窗 + 消耗文案工具
 * 在子嗣面板打开时，资金/冷却/条件类失败会弹出说明；并提供统一耗资格式化。
 */
(function () {
    'use strict';
    if (window.__lineageFailUiInstalled) return;
    window.__lineageFailUiInstalled = true;

    var HOUR_MS = 60 * 60 * 1000;
    var _queue = [];
    var _flushTimer = null;
    var _lastShown = '';
    var _lastShownAt = 0;

    window.lineageFmtCost = function (n) {
        if (n == null || n === '' || isNaN(Number(n))) return '—';
        n = Number(n);
        if (n <= 0) return '免费';
        if (typeof formatSci === 'function') return formatSci(n);
        if (typeof formatNumber === 'function') return formatNumber(n);
        return String(Math.floor(n));
    };

    /** 按钮后缀：耗资 xxx · 12h */
    window.lineageCostTag = function (cost, extras) {
        var parts = [];
        if (cost != null && cost !== '') parts.push('耗资 ' + window.lineageFmtCost(cost));
        if (extras) {
            if (Array.isArray(extras)) parts = parts.concat(extras.filter(Boolean));
            else parts.push(String(extras));
        }
        return parts.length ? '（' + parts.join(' · ') + '）' : '';
    };

    window.lineageMsCost = function (cost, extras) {
        var parts = [];
        if (cost != null && Number(cost) > 0) parts.push('耗资 ' + window.lineageFmtCost(cost));
        else if (cost === 0) parts.push('免费');
        if (extras) {
            if (Array.isArray(extras)) parts = parts.concat(extras.filter(Boolean));
            else parts.push(String(extras));
        }
        return parts.join(' · ');
    };

    function ensureDom() {
        if (document.getElementById('lineageFailDialog')) return;
        var overlay = document.createElement('div');
        overlay.id = 'lineageFailOverlay';
        overlay.className = 'lineage-fail-overlay';
        overlay.onclick = function () { window.hideLineageFailTip(); };

        var dialog = document.createElement('div');
        dialog.id = 'lineageFailDialog';
        dialog.className = 'lineage-fail-dialog';
        dialog.innerHTML =
            '<div class="lineage-fail-head">' +
            '<span class="lineage-fail-icon" aria-hidden="true">!</span>' +
            '<div class="lineage-fail-titles">' +
            '<div class="lineage-fail-title" id="lineageFailTitle">无法完成</div>' +
            '<div class="lineage-fail-sub">请核对消耗与条件后重试</div>' +
            '</div></div>' +
            '<ul class="lineage-fail-list" id="lineageFailList"></ul>' +
            '<div class="lineage-fail-tip">资金不足时可先打工、收取产业或完成其它收益玩法。</div>' +
            '<button type="button" class="c-btn c-btn-gold lineage-fail-ok" id="lineageFailOk">知道了</button>';

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
        document.getElementById('lineageFailOk').onclick = function () { window.hideLineageFailTip(); };
    }

    window.hideLineageFailTip = function () {
        var d = document.getElementById('lineageFailDialog');
        var o = document.getElementById('lineageFailOverlay');
        if (d) d.classList.remove('show');
        if (o) o.classList.remove('show');
    };

    /**
     * @param {string} title
     * @param {string|string[]} reasons
     */
    window.showLineageFailTip = function (title, reasons) {
        ensureDom();
        var list = Array.isArray(reasons) ? reasons : [reasons];
        list = list.map(function (r) { return String(r || '').trim(); }).filter(Boolean);
        if (!list.length) list = ['条件未满足'];

        var key = title + '|' + list.join('|');
        var now = Date.now();
        if (key === _lastShown && now - _lastShownAt < 800) return;
        _lastShown = key;
        _lastShownAt = now;

        document.getElementById('lineageFailTitle').textContent = title || '无法完成操作';
        var ul = document.getElementById('lineageFailList');
        ul.innerHTML = list.map(function (r) {
            return '<li>' + escapeHtml(r) + '</li>';
        }).join('');

        document.getElementById('lineageFailOverlay').classList.add('show');
        document.getElementById('lineageFailDialog').classList.add('show');
    };

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function childUiOpen() {
        var ui = document.getElementById('childSystemUI');
        return !!(ui && ui.style.display === 'block');
    }

    function looksLikeGateFail(msg, type) {
        var s = String(msg || '');
        if (!s) return false;
        if (type === 'error') {
            return /不足|冷却|须|需|无法|暂无|已满|未|不能|不可|先|不够|达到|触及|成年|成婚|好感|声望|条件/.test(s)
                || s.length < 80;
        }
        if (type === 'info') {
            return /冷却|不足|须|需要|无法|暂无|已满级|先|不够|未及|未完成|不满足/.test(s);
        }
        return false;
    }

    function enqueueFail(msg) {
        _queue.push(String(msg));
        if (_flushTimer) clearTimeout(_flushTimer);
        _flushTimer = setTimeout(function () {
            _flushTimer = null;
            var uniq = [];
            var seen = {};
            _queue.forEach(function (m) {
                if (seen[m]) return;
                seen[m] = true;
                uniq.push(m);
            });
            _queue = [];
            if (!uniq.length) return;
            window.showLineageFailTip(uniq.length > 1 ? '多项条件未满足' : '无法完成操作', uniq);
        }, 40);
    }

    // 挂接日志：子嗣面板打开时，失败类提示同步弹窗
    function installLogHook() {
        if (window.__lineageFailLogHooked) return;
        if (typeof window.logAction !== 'function') {
            setTimeout(installLogHook, 500);
            return;
        }
        window.__lineageFailLogHooked = true;
        var _orig = window.logAction;
        window.logAction = function (msg, type) {
            var t = type || 'info';
            try {
                if (childUiOpen() && looksLikeGateFail(msg, t)) enqueueFail(msg);
            } catch (e) { /* ignore */ }
            return _orig.apply(this, arguments);
        };
    }

    /** 统一资金检查（可选弹窗） */
    window.lineageNeedFunds = function (cost, silentLog) {
        cost = Number(cost) || 0;
        if (cost <= 0) return true;
        var ud = player && player.investmentGame && player.investmentGame.userData;
        var bal = ud && (ud.availableFunds != null ? ud.availableFunds : 0);
        if ((bal || 0) >= cost) return true;
        var tip = '资金不足（需 ' + window.lineageFmtCost(cost) + '，当前 ' + window.lineageFmtCost(bal || 0) + '）';
        if (!silentLog && typeof logAction === 'function') logAction(tip, 'error');
        else window.showLineageFailTip('资金不足', [tip]);
        return false;
    };

    document.addEventListener('DOMContentLoaded', function () {
        ensureDom();
        installLogHook();
    });
    if (document.readyState !== 'loading') {
        ensureDom();
        installLogHook();
    }
})();

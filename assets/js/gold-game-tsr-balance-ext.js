/**
 * 时光秘境 · 平衡护栏（最后加载）
 * - 秘境内永恒符文：仍不写主世界
 * - 主世界地图秘卷：允许写入 attributes（用户显式购买）
 * - 存档超额永恒攻/血压回封顶
 */
(function initTsrBalanceGuard() {
    if (typeof applyTsrEternalRuneBonuses === 'function') {
        applyTsrEternalRuneBonuses = function () {
            if (typeof applyTsrMainWorldShopBonuses === 'function') applyTsrMainWorldShopBonuses();
            else if (typeof applyTsrBadgeMainWorldBonuses === 'function') applyTsrBadgeMainWorldBonuses();
        };
        applyTsrEternalRuneBonuses.__tsrBalanceMainWorld = true;
    }

    if (typeof sanitizeTsrEternalBonuses === 'function') {
        try { sanitizeTsrEternalBonuses(); } catch (e) { /* ignore */ }
    }

    if (typeof ensureTimeSecretRealmData === 'function' && !ensureTimeSecretRealmData.__tsrBalancePatched) {
        const _orig = ensureTimeSecretRealmData;
        ensureTimeSecretRealmData = function () {
            const r = _orig.apply(this, arguments);
            try { sanitizeTsrEternalBonuses?.(); } catch (e) { /* ignore */ }
            return r;
        };
        ensureTimeSecretRealmData.__tsrBalancePatched = true;
    }

    if (typeof window !== 'undefined') {
        window.TSR_BALANCE_NOTES = {
            eternalMax: typeof TSR_ETERNAL_BONUS_MAX === 'number' ? TSR_ETERNAL_BONUS_MAX : 0.35,
            eternalPerShop: typeof TSR_ETERNAL_BONUS_PER_PURCHASE === 'number' ? TSR_ETERNAL_BONUS_PER_PURCHASE : 0.02,
            mainWorldMaxPercent: typeof TSR_MAINWORLD_BONUS_MAX_PERCENT === 'number' ? TSR_MAINWORLD_BONUS_MAX_PERCENT : 100000,
            mainWorldPerPurchasePercent: 100
        };
    }
})();

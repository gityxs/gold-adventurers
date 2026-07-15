/**
 * 按顺序加载主游戏脚本；版本号来自 window.__GOLD_GAME_ASSET_BUILD（URL ?v= / API client-build / localStorage）。
 * 勿再手改 index.html 里每个 script 标签。
 */
(function () {
    var build = window.__GOLD_GAME_ASSET_BUILD;
    if (build == null || build === "") build = "dev";
    var loadNonce = String(Date.now());

    function assetUrl(path) {
        var sep = path.indexOf("?") >= 0 ? "&" : "?";
        return path + sep + "b=" + encodeURIComponent(String(build)) + "&_t=" + loadNonce;
    }

    var scripts = [
        "assets/js/gold-game-core.js",
        "assets/js/gold-game-bignum.js",
        "assets/js/gold-game-systems.js",
        "assets/js/gold-game-save.js",
        "assets/js/gold-game-network.js",
        "assets/js/gold-game-combat.js",
        "assets/js/gold-game-promo.js",
        "assets/js/gold-game-minigames.js",
        "assets/js/gold-game-xiuxian-sect.js",
        "assets/js/gold-game-nightclub.js",
        "assets/js/gold-game-groceries.js",
        "assets/js/gold-game-level.js",
        "assets/js/gold-game-wing.js",
        "assets/js/gold-game-mount.js",
        "assets/js/gold-game-gem-treasure.js",
        "assets/js/gold-game-cultivation.js",
        "assets/js/gold-game-companion.js",
        "assets/js/gold-game-tower-official.js",
        "assets/js/gold-game-trading-base.js",
        "assets/js/gold-game-trading-ui.js",
        "assets/js/gold-game-trading-trade.js",
        "assets/js/gold-game-trading-auto.js",
        "assets/js/gold-game-trading-init.js",
        "assets/js/gold-game-rune-class.js",
        "assets/js/gold-game-dungeon-islands.js",
        "assets/js/gold-game-lunhui-islands.js",
        "assets/js/gold-game-tsr-equip-ext.js",
        "assets/js/gold-game-time-secret.js",
        "assets/js/gold-game-tsr-monster-ext.js",
        "assets/js/gold-game-tsr-monster-play-ext.js",
        "assets/js/gold-game-tsr-monster-mutation-ext.js",
        "assets/js/gold-game-tsr-monster-codex-ext.js",
        "assets/js/gold-game-tsr-content-ext.js",
        "assets/js/gold-game-tsr-content-ext2.js",
        "assets/js/gold-game-tsr-content-ext3.js",
        "assets/js/gold-game-tsr-content-ext4.js",
        "assets/js/gold-game-tsr-systems-ext.js",
        "assets/js/gold-game-tsr-content-ext5.js",
        "assets/js/gold-game-tsr-world-ext.js",
        "assets/js/gold-game-tsr-endgame-ext.js",
        "assets/js/gold-game-tsr-legends-ext.js",
        "assets/js/gold-game-tsr-combat-train-ext.js",
        "assets/js/gold-game-tsr-unify-ext.js",
        "assets/js/gold-game-tsr-guide-ext.js",
        "assets/js/gold-game-tsr-express-ext.js",
        "assets/js/gold-game-tsr-layout-ext.js",
        "assets/js/gold-game-tsr-badge-ext.js",
        "assets/js/gold-game-tsr-feel-ext.js",
        "assets/js/gold-game-tsr-immersion-ext.js",
        "assets/js/gold-game-tsr-depth-ext.js",
        "assets/js/gold-game-tsr-codex-ui-ext.js",
        "assets/js/gold-game-tsr-balance-ext.js",
        "assets/js/gold-game-landlord-seeds.js",
        "assets/js/gold-game-landlord-core.js",
        "assets/js/gold-game-dongtian-jie.js",
        "assets/js/gold-game-landlord-farm.js",
        "assets/js/gold-game-landlord-storage.js",
        "assets/js/gold-game-landlord-seafish.js",
        "assets/js/gold-game-landlord-fields.js",
        "assets/js/gold-game-mining.js",
        "assets/js/gold-game-investment-stock.js",
        "assets/js/gold-game-investment.js",
        "assets/js/gold-game-marriage-base.js",
        "assets/js/gold-game-marriage.js",
        "assets/js/gold-game-beast.js",
        "assets/js/gold-game-magic-tool.js",
        "assets/js/gold-game-gamble-stone.js",
        "assets/js/gold-game-nian-beast.js",
        "assets/js/gold-game-pill-trial.js",
        "assets/js/gold-game-abyss-core.js",
        "assets/js/gold-game-abyss-cards-data.js",
        "assets/js/gold-game-abyss-cards-ui.js",
        "assets/js/gold-game-abyss-cards-config.js",
        "assets/js/gold-game-abyss-cards-combat.js",
        "assets/js/gold-game-abyss-features.js",
        "assets/js/gold-game-bootstrap.js",
    ];

    function loadAt(i) {
        if (i >= scripts.length) {
            window.__GOLD_GAME_ASSETS_READY = true;
            return;
        }
        var s = document.createElement("script");
        s.src = assetUrl(scripts[i]);
        s.async = false;
        s.onload = function () {
            loadAt(i + 1);
        };
        s.onerror = function () {
            if (typeof console !== "undefined" && console.error) {
                console.error("[gold-game-asset-boot] script load failed:", scripts[i]);
            }
            loadAt(i + 1);
        };
        document.body.appendChild(s);
    }

    window.__GOLD_GAME_ASSETS_READY = false;
    loadAt(0);
})();

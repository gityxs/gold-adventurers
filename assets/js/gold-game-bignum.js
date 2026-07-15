// 大数运算
// ---- Gold Big Number helpers (supports > 1e308) ----
function parseBigSci(value) {
    if (value == null) return { m: 0, e: 0n };
    if (typeof value === 'object' && value && typeof value.m === 'number' && typeof value.e === 'bigint') {
        return normalizeBigSci(value.m, value.e);
    }
    if (typeof value === 'number') {
        if (!Number.isFinite(value)) return value > 0 ? { m: 1, e: 309n } : (value < 0 ? { m: -1, e: 309n } : { m: 0, e: 0n });
        if (value === 0) return { m: 0, e: 0n };
        const s = value.toExponential(15);
        const m = s.match(/^([+-]?\d+(?:\.\d+)?)e([+-]?\d+)$/i);
        if (!m) return { m: 0, e: 0n };
        return normalizeBigSci(Number(m[1]), BigInt(m[2]));
    }
    const text = String(value).trim();
    if (text === '-' || text === '--' || text.toLowerCase() === 'nan') return { m: 0, e: 0n };
    if (!text) return { m: 0, e: 0n };
    const normalizedText = text.replace(/[,_，\s]/g, '');
    // 含小数点或科学计数法的普通数值走 Number，修复 "0.003" 被当成 3 的 bug（原先用 int+frac 拼数字会吃掉小数点前的占位 0）
    if (/[.]|[eE]/.test(normalizedText)) {
        const n = Number(normalizedText);
        if (Number.isFinite(n)) return parseBigSci(n);
    }
    const m = normalizedText.match(/^([+-]?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i);
    if (!m) return { m: 0, e: 0n };
    const sign = m[1] === '-' ? -1 : 1;
    let intPart = m[2] || '0';
    let fracPart = m[3] || '';
    const sciExp = m[4] ? BigInt(m[4]) : 0n;
    intPart = intPart.replace(/^0+/, '') || '0';
    fracPart = fracPart.replace(/0+$/, '');
    const digits = (intPart + fracPart).replace(/^0+/, '');
    if (!digits) return { m: 0, e: 0n };
    const e = sciExp + BigInt(intPart.length - 1);
    const head = digits.slice(0, 16);
    const mantissa = sign * Number(head[0] + (head.length > 1 ? '.' + head.slice(1) : ''));
    return normalizeBigSci(mantissa, e);
}
function normalizeBigSci(m, e) {
    if (!m || !Number.isFinite(m)) return { m: 0, e: 0n };
    let mm = m;
    let ee = BigInt(e);
    while (Math.abs(mm) >= 10) { mm /= 10; ee += 1n; }
    while (Math.abs(mm) < 1 && mm !== 0) { mm *= 10; ee -= 1n; }
    return mm === 0 ? { m: 0, e: 0n } : { m: mm, e: ee };
}
function addBigSci(a, b) {
    const x = parseBigSci(a);
    const y = parseBigSci(b);
    if (x.m === 0) return y;
    if (y.m === 0) return x;
    const diff = x.e - y.e;
    if (diff > 20n) return x;
    if (diff < -20n) return y;
    if (diff >= 0n) return normalizeBigSci(x.m + y.m * Math.pow(10, -Number(diff)), x.e);
    return normalizeBigSci(x.m * Math.pow(10, -Number(-diff)) + y.m, y.e);
}
function mulBigSci(a, factor) {
    const x = parseBigSci(a);
    const y = parseBigSci(factor);
    if (x.m === 0 || y.m === 0) return { m: 0, e: 0n };
    return normalizeBigSci(x.m * y.m, x.e + y.e);
}
function mulBigSciValues(a, b) {
    const x = parseBigSci(a);
    const y = parseBigSci(b);
    if (x.m === 0 || y.m === 0) return { m: 0, e: 0n };
    return normalizeBigSci(x.m * y.m, x.e + y.e);
}
function subBigSci(a, b) {
    const y = parseBigSci(b);
    return addBigSci(a, { m: -y.m, e: y.e });
}
function cmpBigSci(a, b) {
    const x = parseBigSci(a);
    const y = parseBigSci(b);
    if (x.m === 0 && y.m === 0) return 0;
    // 一侧为 0 时必须先返回，否则仅比指数会把 0 误判为大于大正数（导致模拟投资「清零」立刻被钳回最大）
    if (x.m === 0) return y.m < 0 ? 1 : -1;
    if (y.m === 0) return x.m < 0 ? -1 : 1;
    if (x.m >= 0 && y.m < 0) return 1;
    if (x.m < 0 && y.m >= 0) return -1;
    if (x.e > y.e) return x.m > 0 ? 1 : -1;
    if (x.e < y.e) return x.m > 0 ? -1 : 1;
    if (x.m > y.m) return 1;
    if (x.m < y.m) return -1;
    return 0;
}
// 持仓碎股/浮点误差阈值（须在 loadSave 之前定义，供读档时 normalizeInvestmentGamePrices 使用）
const INVESTMENT_HOLDINGS_DUST = { m: 1, e: -10n };
function toBigSciString(value, digits) {
    const x = parseBigSci(value);
    if (x.m === 0) return '0';
    const fracDigits = typeof digits === 'number' ? Math.max(0, Math.floor(digits)) : 3;
    let m = x.m.toFixed(fracDigits).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    return m + 'e' + x.e.toString();
}
// 资产详情大数格式化，避免界面被撑破（≥1e12 用科学计数法）
// zeroMode: 'money' 显示 0.000；'shares' 股数显示 0（避免持仓/数量像金额）
function formatInvestmentNumber(val, zeroMode) {
    const x = parseBigSci(val);
    if (x.m === 0) return zeroMode === 'shares' ? '0' : '0.000';
    if (x.e >= 12n || x.e <= -6n) return toBigSciString(x, zeroMode === 'shares' ? 6 : 3);
    const n = Number(x.m + 'e' + x.e.toString());
    if (Number.isFinite(n)) {
        if (zeroMode === 'shares') {
            if (Math.abs(n) < 1e-6) return n.toExponential(4);
            if (Number.isInteger(n)) {
                return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
            }
            let s = n.toLocaleString(undefined, { maximumFractionDigits: 12, useGrouping: true });
            if (s.includes('.')) s = s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
            return s;
        }
        return n.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    }
    return toBigSciString(x, zeroMode === 'shares' ? 6 : 3);
}
function bigSciToStorageValue(value) {
    const x = parseBigSci(value);
    if (x.m === 0) return 0;
    if (x.e <= 308n && x.e >= -300n) {
        const n = Number(x.m + 'e' + x.e.toString());
        if (Number.isFinite(n)) return n;
    }
    return toBigSciString(x, 6);
}
function isZeroLike(value) {
    const x = parseBigSci(value);
    return x.m === 0;
}
const MAIN_CURRENCIES = ['gold', 'diamond', 'titanium', 'starstone', 'cosmicstone', 'superstone', 'otherworldstone', 'xingjiestone', 'hundunstone', 'lingtone', 'huangtone', 'mingtone', 'xutong', 'shitone', 'weitone', 'yongtone', 'wujitone', 'daotone'];
function isMainCurrency(name) {
    return MAIN_CURRENCIES.indexOf(name) !== -1;
}
function normalizeMainCurrencies() {
    if (!player || typeof player !== 'object') return;
    for (let i = 0; i < MAIN_CURRENCIES.length; i++) {
        const key = MAIN_CURRENCIES[i];
        player[key] = bigSciToStorageValue(player[key]);
    }
}
function addCurrency(name, value) {
    if (!isMainCurrency(name)) {
        player[name] = (Number(player[name]) || 0) + (Number(value) || 0);
        return;
    }
    player[name] = bigSciToStorageValue(addBigSci(player[name], value));
}
function spendCurrency(name, cost) {
    if (!isMainCurrency(name)) {
        if ((Number(player[name]) || 0) < (Number(cost) || 0)) return false;
        player[name] = (Number(player[name]) || 0) - (Number(cost) || 0);
        return true;
    }
    if (cmpBigSci(player[name], cost) < 0) return false;
    player[name] = bigSciToStorageValue(subBigSci(player[name], cost));
    return true;
}
function cmpCurrency(name, value) {
    if (!isMainCurrency(name)) return (Number(player[name]) || 0) - (Number(value) || 0);
    return cmpBigSci(player[name], value);
}
function divFloorCurrencyByRate(name, rate) {
    if (!isMainCurrency(name)) return Math.floor((Number(player[name]) || 0) / rate);
    const n = Number(player[name]);
    if (Number.isFinite(n) && Math.abs(n) < 1e15) return Math.floor(n / rate);
    return floorDivByPow10(player[name], rateToPow10(rate));
}
function deductCurrencyBatch(name, unitCost, count) {
    if (!isMainCurrency(name)) {
        player[name] -= unitCost * count;
        return;
    }
    const total = mulBigSciValues(unitCost, count);
    player[name] = bigSciToStorageValue(subBigSci(player[name], total));
}
function rateToPow10(rate) {
    const raw = String(rate == null ? '' : rate).trim().replace(/[,_，\s]/g, '');
    if (!raw) return 0;
    const m = raw.match(/^([+-]?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i);
    if (!m || m[1] === '-') return 0;
    const intPart = m[2] || '0';
    const fracPart = m[3] || '';
    const sciExp = m[4] ? parseInt(m[4], 10) : 0;
    const digitsRaw = (intPart + fracPart).replace(/^0+/, '');
    if (!digitsRaw) return 0;
    const exp = sciExp - fracPart.length;
    const trailingZeros = (digitsRaw.match(/0+$/) || [''])[0].length;
    return Math.max(0, exp + trailingZeros);
}
function floorDivByPow10(value, pow10) {
    pow10 = Math.max(0, Math.floor(Number(pow10) || 0));
    const raw = String(value == null ? '' : value).trim().replace(/[,_，\s]/g, '');
    if (!raw || raw === '-' || raw === '--') return 0;
    const m = raw.match(/^([+-]?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i);
    if (!m) {
        const n = Number(value) || 0;
        if (!Number.isFinite(n) || n <= 0) return 0;
        const q = Math.floor(n / Math.pow(10, pow10));
        if (q <= 0) return 0;
        return bigSciToStorageValue(String(q));
    }
    if (m[1] === '-') return 0;
    const intPart = m[2] || '0';
    const fracPart = m[3] || '';
    const sciExp = m[4] ? parseInt(m[4], 10) : 0;
    const digitsRaw = (intPart + fracPart).replace(/^0+/, '');
    if (!digitsRaw) return 0;
    const exp = sciExp - fracPart.length;
    const qExp = exp - pow10;
    let qDigits = '';
    if (qExp >= 0) qDigits = digitsRaw + '0'.repeat(qExp);
    else {
        const cut = -qExp;
        if (cut >= digitsRaw.length) return 0;
        qDigits = digitsRaw.slice(0, digitsRaw.length - cut);
    }
    qDigits = qDigits.replace(/^0+/, '');
    if (!qDigits) return 0;
    const out = qDigits[0] + (qDigits.length > 1 ? '.' + qDigits.slice(1, 16) : '') + 'e' + String(qDigits.length - 1);
    return bigSciToStorageValue(out);
}
function divFloorValueByRate(value, rate, mainCurrency) {
    if (!mainCurrency) return Math.floor((Number(value) || 0) / rate);
    const n = Number(value);
    if (Number.isFinite(n) && Math.abs(n) < 1e15) return Math.floor(n / rate);
    return floorDivByPow10(value, rateToPow10(rate));
}
function convertAllCurrencyByRate(from, to, rate, sourceValue) {
    const isMain = isMainCurrency(from);
    const base = sourceValue != null ? sourceValue : player[from];
    let converted = 0;
    if (isMain) {
        const baseNorm = bigSciToStorageValue(base);
        const possible = divFloorValueByRate(baseNorm, rate, true);
        converted = subBigSci(possible, 1); // 永远保留最后 1 档
        if (cmpBigSci(converted, 0) <= 0) return null;
        const reserveNorm = bigSciToStorageValue(rate);
        // 强约束：发生兑换后，原货币直接固定保留 1 档，避免大数精度导致显示 0 或保留值漂移
        player[from] = reserveNorm;
        addCurrency(to, converted);
        return { from, to, converted, remain: player[from] };
    } else {
        const n = Number(base) || 0;
        converted = Math.floor(n / rate) - 1; // 永远保留最后 1 档
        if (!Number.isFinite(converted) || converted <= 0) return null;
    }
    deductCurrencyBatch(from, rate, converted);
    addCurrency(to, converted);
    return { from, to, converted, remain: player[from] };
}
function bAdd(cur, delta) {
    return bigSciToStorageValue(addBigSci(cur, delta));
}
function bSub(cur, delta) {
    return bigSciToStorageValue(subBigSci(cur, delta));
}
function bMul(cur, factor) {
    return bigSciToStorageValue(mulBigSci(cur, factor));
}
function bLteZero(v) {
    return cmpBigSci(v, 0) <= 0;
}
function addGold(value) {
    player.gold = bigSciToStorageValue(addBigSci(player.gold, value));
}
function spendGold(cost) {
    if (cmpBigSci(player.gold, cost) < 0) return false;
    player.gold = bigSciToStorageValue(subBigSci(player.gold, cost));
    return true;
}
        // 成就检查

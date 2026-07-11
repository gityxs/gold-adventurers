// 深渊卡牌数据
// 深渊灵魂卡牌
// ==================== 无限深渊·灵魂卡牌系统 ====================

var ABYSS_SOUL_CARD_RARITY_STYLES = {
    common:    { name: '普通',  border: '#9e9e9e', bg: 'rgba(158,158,158,0.15)',  title: '#e0e0e0' },
    rare:      { name: '稀有',  border: '#42a5f5', bg: 'rgba(66,165,245,0.18)',  title: '#90caf9' },
    epic:      { name: '史诗',  border: '#ab47bc', bg: 'rgba(171,71,188,0.20)',  title: '#e1bee7' },
    legendary: { name: '传说',  border: '#ffb300', bg: 'rgba(255,179,0,0.22)',   title: '#ffe082' }
};


var ABYSS_SOUL_CARDS = [];


(function initAbyssSoulCardPool() {
    if (window._abyssSoulCardsInited) return;
    window._abyssSoulCardsInited = true;
    var idSeq = 1;
    function pushCard(group, rarity, name, desc, effect) {
        ABYSS_SOUL_CARDS.push({
            id: 'soul_' + (idSeq++),
            group: group,
            rarity: rarity,
            maxStack: 5,
            name: name,
            desc: desc,
            effect: effect
        });
    }
    // 攻击流 30 张
    for (var i = 1; i <= 10; i++) {
        var v = 3 + i; // 4~13
        pushCard('atk', 'common', '战意锋刃·' + i, '攻击 +' + v + '%', { atkPct: v });
    }
    for (var j = 1; j <= 10; j++) {
        var v2 = 5 + j; // 6~15
        pushCard('atk', 'rare', '嗜血之锋·' + j, '攻击 +' + v2 + '%，爆伤 +10%', { atkPct: v2, critDmgPct: 10 });
    }
    for (var k = 1; k <= 10; k++) {
        var v3 = 7 + k; // 8~17
        pushCard('atk', 'epic', '狂战战意·' + k, '攻击 +' + v3 + '%，吸血 +3%', { atkPct: v3, lifestealPct: 3 });
    }
    
    for (var i2 = 1; i2 <= 10; i2++) {
        var c1 = 1.5 + i2 * 0.3;
        pushCard('crit', 'common', '精准打击·' + i2, '暴击率 +' + c1.toFixed(1) + '%', { critRatePct: c1 });
    }
    for (var j2 = 1; j2 <= 10; j2++) {
        var c2 = 3 + j2 * 0.4;
        pushCard('crit', 'rare', '致命连锁·' + j2, '暴击率 +' + c2.toFixed(1) + '%，爆伤 +15%', { critRatePct: c2, critDmgPct: 15 });
    }
    for (var k2 = 1; k2 <= 10; k2++) {
        var c3 = 4 + k2 * 0.4;
        pushCard('crit', 'epic', '终结猎杀·' + k2, '暴击率 +' + c3.toFixed(1) + '%，攻击 +6%', { critRatePct: c3, atkPct: 6 });
    }
    
    for (var i3 = 1; i3 <= 10; i3++) {
        var hp1 = 5 + i3; // 6~15
        var df1 = 3 + i3; // 4~13
        pushCard('def', 'common', '钢铁之躯·' + i3, '生命 +' + hp1 + '%，防御 +' + df1 + '%', { hpPct: hp1, defPct: df1 });
    }
    for (var j3 = 1; j3 <= 10; j3++) {
        var hp2 = 7 + j3;
        pushCard('def', 'rare', '不屈堡垒·' + j3, '生命 +' + hp2 + '%，闪避 +4%', { hpPct: hp2, dodgePct: 4 });
    }
    for (var k3 = 1; k3 <= 10; k3++) {
        var hp3 = 9 + k3;
        pushCard('def', 'epic', '永恒壁垒·' + k3, '生命 +' + hp3 + '%，吸血 +2%', { hpPct: hp3, lifestealPct: 2 });
    }
    
    for (var i4 = 1; i4 <= 10; i4++) {
        var s1 = 4 + i4; // 5~14
        pushCard('skill', 'common', '奥术残响·' + i4, '技能伤害 +' + s1 + '%', { skillDmgPct: s1 });
    }
    for (var j4 = 1; j4 <= 10; j4++) {
        var s2 = 6 + j4;
        pushCard('skill', 'rare', '虚空聚能·' + j4, '技能伤害 +' + s2 + '%，无视怪物防御 +4%', { skillDmgPct: s2, reduceMonsterDefPct: 4 });
    }
    for (var k4 = 1; k4 <= 10; k4++) {
        var s3 = 8 + k4;
        pushCard('skill', 'epic', '世界终结式·' + k4, '技能伤害 +' + s3 + '%，爆伤 +10%', { skillDmgPct: s3, critDmgPct: 10 });
    }
    
    for (var i5 = 1; i5 <= 10; i5++) {
        var l1 = 1 + i5 * 0.6;
        pushCard('life', 'common', '渴血追猎·' + i5, '吸血 +' + l1.toFixed(1) + '%', { lifestealPct: l1 });
    }
    for (var j5 = 1; j5 <= 10; j5++) {
        var d1 = 2 + j5 * 0.5;
        pushCard('life', 'rare', '疾影残身·' + j5, '闪避 +' + d1.toFixed(1) + '%，生命 +5%', { dodgePct: d1, hpPct: 5 });
    }
    for (var k5 = 1; k5 <= 10; k5++) {
        var l2 = 2 + k5 * 0.6;
        pushCard('life', 'epic', '血影不灭·' + k5, '吸血 +' + l2.toFixed(1) + '%，防御 +6%', { lifestealPct: l2, defPct: 6 });
    }
    
    for (var i6 = 1; i6 <= 10; i6++) {
        var g1 = 4 + i6; // 5~14
        pushCard('econ', 'rare', '贪婪之心·' + i6, '本局闯关金币获取 +' + g1 + '%', { goldPct: g1 });
    }
    for (var j6 = 1; j6 <= 10; j6++) {
        var e1 = Math.floor((4 + j6) / 2);  
        pushCard('econ', 'epic', '智慧之环·' + j6, '本局经验获取 +' + e1 + '%', { expPct: e1 });
    }
    
    for (var p1 = 1; p1 <= 10; p1++) {
        var pa1 = 6 + p1; // 宠物攻 7~16
        var ph1 = 4 + p1; // 宠物血 5~14
        pushCard('pet', 'rare', '御兽契约·' + p1, '宠物攻击 +' + pa1 + '%，宠物生命 +' + ph1 + '%', {
            petAtkPct: pa1,
            petHpPct: ph1
        });
    }
    for (var p2 = 1; p2 <= 10; p2++) {
        var pa2 = 8 + p2;
        pushCard('pet', 'epic', '兽群咆哮·' + p2, '宠物攻击 +' + pa2 + '%，玩家攻击 +4%', {
            petAtkPct: pa2,
            atkPct: 4
        });
    }
    // 新增宠物系卡牌 30 张：强度与现有宠物系同档
    for (var p3 = 1; p3 <= 10; p3++) {
        var pa3 = 7 + p3; // 8~17
        var pd3 = 5 + p3; // 6~15
        pushCard('pet', 'rare', '兽甲协同·' + p3, '宠物攻击 +' + pa3 + '%，宠物防御 +' + pd3 + '%', {
            petAtkPct: pa3,
            petDefPct: pd3
        });
    }
    for (var p4 = 1; p4 <= 10; p4++) {
        var ph4 = 8 + p4; // 9~18
        var pd4 = 6 + p4; // 7~16
        pushCard('pet', 'epic', '灵宠庇护·' + p4, '宠物生命 +' + ph4 + '%，宠物防御 +' + pd4 + '%', {
            petHpPct: ph4,
            petDefPct: pd4
        });
    }
    for (var p5 = 1; p5 <= 10; p5++) {
        var pa5 = (10 + p5) * 2; // 传说翻倍：22~40
        var ph5 = (7 + p5) * 2;  // 16~34
        var pd5 = (4 + p5) * 2;  // 10~28
        pushCard('pet', 'legendary', '万兽主宰·' + p5, '宠物攻击 +' + pa5 + '%，宠物生命 +' + ph5 + '%，宠物防御 +' + pd5 + '%', {
            petAtkPct: pa5,
            petHpPct: ph5,
            petDefPct: pd5
        });
    }

    
    for (var s1 = 1; s1 <= 10; s1++) {
        var sa1 = 5 + s1; // 召唤攻 6~15
        pushCard('summon', 'rare', '召唤增幅·' + s1, '召唤物攻击 +' + sa1 + '%，召唤物生命 +6%', {
            summonAtkPct: sa1,
            summonHpPct: 6
        });
    }
    for (var s2 = 1; s2 <= 10; s2++) {
        var sa2 = 7 + s2;
        pushCard('summon', 'epic', '契灵同调·' + s2, '召唤物攻击 +' + sa2 + '%，每存在1只召唤物玩家攻击 +3%', {
            summonAtkPct: sa2,
            atkPerSummonPct: 3
        });
    }

    
    for (var u1 = 1; u1 <= 5; u1++) {
        pushCard('unique', 'epic', '背水一战·' + u1, '最大生命 -8%，攻击 +15%，暴击率 +4%', {
            hpPct: -8,
            atkPct: 15,
            critRatePct: 4
        });
    }
    for (var u2 = 1; u2 <= 5; u2++) {
        pushCard('unique', 'epic', '纯粹之力·' + u2, '技能伤害 +18%，闪避 -5%', {
            skillDmgPct: 18,
            dodgePct: -5
        });
    }

    
    
    for (var u3 = 1; u3 <= 3; u3++) {
        pushCard('unique', 'legendary', '玻璃法炮·' + u3, '技能伤害 +70%，防御 -40%，生命 -20%', {
            skillDmgPct: 70,
            defPct: -40,
            hpPct: -20
        });
    }
    
    for (var u4 = 1; u4 <= 3; u4++) {
        pushCard('unique', 'legendary', '永不后退·' + u4, '攻击 +56%，闪避 -100%（无法闪避）', {
            atkPct: 56,
            dodgePct: -100
        });
    }
    
    for (var u5 = 1; u5 <= 4; u5++) {
        var g2 = 18 + u5 * 2;
        pushCard('unique', 'epic', '诅咒贪婪·' + u5, '本局金币获取 +' + g2 + '%，生命 -12%', {
            goldPct: g2,
            hpPct: -12
        });
    }

    
    for (var u6 = 1; u6 <= 3; u6++) {
        var va = 10 + u6 * 2;
        var vh = 10 + u6 * 2;
        pushCard('unique', 'epic', '朴素之力·' + u6, '若本局未获得任何传说卡牌，则攻击 +' + va + '%，生命 +' + vh + '%', {
            synergyNoLegendAtkPct: va,
            synergyNoLegendHpPct: vh
        });
    }
    
    pushCard('unique', 'legendary', '一念成魔', '当你仅拥有 1 张独特流派卡牌时，攻击 +60%，暴击率 +20%；若拥有 ≥3 张独特卡牌，则生命 -40%', {
        synergySoloUniqueAtkPct: 60,
        synergySoloUniqueCritPct: 20,
        synergyManyUniqueHpPct: -40
    });

    
    
    for (var w1 = 1; w1 <= 5; w1++) {
        var wa = 6 + w1 * 2;
        pushCard('warrior', 'rare', '战士·血战之心·' + w1, '战士职业时攻击 +' + wa + '%，其他职业时攻击 +' + Math.floor(wa / 2) + '%', {
            atkPct: wa,
            warriorOnly: true,
            fallbackAtkPct: Math.floor(wa / 2)
        });
    }
    for (var w2 = 1; w2 <= 5; w2++) {
        var wl = 3 + w2;
        pushCard('warrior', 'epic', '战士·不灭意志·' + w2, '战士职业时吸血 +' + wl + '%，生命 +8%', {
            lifestealPct: wl,
            hpPct: 8,
            warriorOnly: true
        });
    }

    
    for (var m1 = 1; m1 <= 5; m1++) {
        var ms = 8 + m1;
        pushCard('mage', 'rare', '法师·奥术回响·' + m1, '法师职业时技能伤害 +' + ms + '%，其他职业时技能伤害 +' + Math.floor(ms / 2) + '%', {
            skillDmgPct: ms,
            mageOnly: true,
            fallbackSkillDmgPct: Math.floor(ms / 2)
        });
    }
    for (var m2 = 1; m2 <= 5; m2++) {
        var mc = 4 + m2;
        pushCard('mage', 'epic', '法师·虚空穿刺·' + m2, '法师职业时技能伤害 +' + mc + '%，无视怪物防御 +6%', {
            skillDmgPct: mc,
            reduceMonsterDefPct: 6,
            mageOnly: true
        });
    }

    
    for (var a1 = 1; a1 <= 5; a1++) {
        var ac1 = 3 + a1 * 0.6;
        pushCard('archer', 'rare', '射手·神射本能·' + a1, '射手职业时暴击率 +' + ac1.toFixed(1) + '%，其他职业时暴击率 +' + (ac1 / 2).toFixed(1) + '%', {
            critRatePct: ac1,
            archerOnly: true,
            fallbackCritRatePct: ac1 / 2
        });
    }
    for (var a2 = 1; a2 <= 5; a2++) {
        var ac2 = 5 + a2;
        pushCard('archer', 'epic', '射手·穿心一击·' + a2, '射手职业时暴击伤害 +' + (ac2 * 2) + '%，无视怪物防御 +5%', {
            critDmgPct: ac2 * 2,
            reduceMonsterDefPct: 5,
            archerOnly: true
        });
    }

   
    for (var t1 = 1; t1 <= 5; t1++) {
        var ta = 7 + t1;
        pushCard('tamer', 'rare', '驯兽师·群兽之王·' + t1, '驯兽师职业时宠物攻击 +' + ta + '%，其他职业时宠物攻击 +' + Math.floor(ta / 2) + '%', {
            petAtkPct: ta,
            tamerOnly: true,
            fallbackPetAtkPct: Math.floor(ta / 2)
        });
    }
    for (var t2 = 1; t2 <= 5; t2++) {
        var th = 5 + t2;
        pushCard('tamer', 'epic', '驯兽师·御兽同心·' + t2, '驯兽师职业时宠物攻击 +' + th + '%、玩家攻击 +6%', {
            petAtkPct: th,
            atkPct: 6,
            tamerOnly: true
        });
    }

    
    for (var o1 = 1; o1 <= 5; o1++) {
        var os = 6 + o1;
        pushCard('onmyoji', 'rare', '阴阳师·式神同调·' + o1, '阴阳师职业时召唤物攻击 +' + os + '%，其他职业时召唤物攻击 +' + Math.floor(os / 2) + '%', {
            summonAtkPct: os,
            onmyojiOnly: true,
            fallbackSummonAtkPct: Math.floor(os / 2)
        });
    }
    for (var o2 = 1; o2 <= 5; o2++) {
        var od = 4 + o2;
        pushCard('onmyoji', 'epic', '阴阳师·符咒侵蚀·' + o2, '阴阳师职业时技能伤害 +' + od + '%，无视怪物防御 +6%', {
            skillDmgPct: od,
            reduceMonsterDefPct: 6,
            onmyojiOnly: true
        });
    }

    // 机械师：偏减少怪物防御 / 技能流
    for (var me1 = 1; me1 <= 5; me1++) {
        var md = 4 + me1;
        pushCard('mechanic', 'rare', '机械师·战地运算·' + me1, '机械师职业时减少怪物防御 +' + md + '%，技能伤害 +6%', {
            reduceMonsterDefPct: md,
            skillDmgPct: 6,
            mechanicOnly: true
        });
    }
    for (var me2 = 1; me2 <= 5; me2++) {
        var ms2 = 7 + me2;
        pushCard('mechanic', 'epic', '机械师·机甲过载·' + me2, '机械师职业时攻击 +' + ms2 + '%，生命 +8%', {
            atkPct: ms2,
            hpPct: 8,
            mechanicOnly: true
        });
    }
    // 戏命师：赌狗上限卡组（高收益 + 可控风险）
    for (var j1 = 1; j1 <= 5; j1++) {
        var ja = 9 + j1;
        pushCard('jester', 'rare', '戏命师·欧皇开局·' + j1, '戏命师职业时攻击 +' + ja + '%、暴击率 +3%，其他职业时攻击 +' + Math.floor(ja / 2) + '%', {
            atkPct: ja,
            critRatePct: 3,
            jesterOnly: true,
            fallbackAtkPct: Math.floor(ja / 2)
        });
    }
    for (var j2 = 1; j2 <= 5; j2++) {
        var js = 8 + j2;
        pushCard('jester', 'epic', '戏命师·赔率暴走·' + j2, '戏命师职业时技能伤害 +' + js + '%、暴伤 +18%', {
            skillDmgPct: js,
            critDmgPct: 18,
            jesterOnly: true
        });
    }
    for (var j3 = 1; j3 <= 3; j3++) {
        var jj = 16 + j3 * 2;
        var jj2 = jj * 2;
        pushCard('jester', 'legendary', '戏命师·命运偏向·' + j3, '戏命师职业时攻击 +' + jj2 + '%、技能伤害 +' + (jj2 - 8) + '%、减伤 +12%', {
            atkPct: jj2,
            skillDmgPct: jj2 - 8,
            damageReduction: 12,
            jesterOnly: true
        });
    }
    // 异界御灵：宠物/深渊神兽同调卡组（不走召唤，强调宠物攻防血与护盾）
    for (var r1 = 1; r1 <= 5; r1++) {
        var ra = 8 + r1;
        var rf = Math.floor(ra / 2);
        pushCard('riftbinder', 'rare', '异界御灵·界兽同律·' + r1, '异界御灵职业时宠物攻击 +' + ra + '%、宠物防御 +6%，其他职业时宠物攻击 +' + rf + '%', {
            petAtkPct: ra,
            petDefPct: 6,
            riftbinderOnly: true,
            fallbackPetAtkPct: rf
        });
    }
    for (var r2 = 1; r2 <= 5; r2++) {
        var rh = 9 + r2;
        pushCard('riftbinder', 'epic', '异界御灵·渊甲镜域·' + r2, '异界御灵职业时宠物生命 +' + rh + '%、宠物防御 +8%，并获得减伤 +8%', {
            petHpPct: rh,
            petDefPct: 8,
            damageReduction: 8,
            riftbinderOnly: true
        });
    }
    for (var r3 = 1; r3 <= 3; r3++) {
        var rr = 14 + r3 * 2;
        pushCard('riftbinder', 'legendary', '异界御灵·终界谐鸣·' + r3, '异界御灵职业时宠物攻防生命 +' + rr + '%、技能伤害 +' + (rr - 4) + '%；其他职业时宠物攻击 +' + Math.floor(rr / 2) + '%', {
            petAtkPct: rr,
            petDefPct: rr,
            petHpPct: rr,
            skillDmgPct: rr - 4,
            riftbinderOnly: true,
            fallbackPetAtkPct: Math.floor(rr / 2)
        });
    }

    
    for (var i7 = 1; i7 <= 4; i7++) {
        pushCard('legend', 'legendary', '灵魂共鸣·' + i7, '攻击 +12%，生命 +12%，暴击率 +6%，若拥有至少3种不同流派灵魂卡再额外攻击 +8%', {
            atkPct: 12,
            hpPct: 12,
            critRatePct: 6,
            needGroupDiversity: 3,
            extraAtkPctIfDiverse: 8
        });
    }
    
    pushCard('legend', 'legendary', '万兽朝圣', '每存在1只宠物或召唤物，玩家攻击 +8%、防御 +6%（最多加成 5 只）', {
        atkPerBeastOrSummonPct: 8,
        defPerBeastOrSummonPct: 6,
        beastOrSummonCap: 5
    });
    pushCard('legend', 'legendary', '灵契回响', '每回合开始时，回复所有宠物与召唤物 24% 最大生命，玩家额外回复 8% 最大生命', {
        petSummonRegenPct: 24,
        selfRegenPct: 8
    });
    
    pushCard('legend', 'legendary', '连击究极', '每回合手动普攻一次，本局攻击 +3%（最多叠加 40 次）', {
        manualAttackStackAtkPct: 3,
        manualAttackStackCap: 40
    });
    pushCard('legend', 'legendary', '极限闪避', '每成功闪避一次攻击，闪避 +1.6%、攻击 +1.6%（最多叠加 30 次）', {
        onDodgeStackDodgePct: 1.6,
        onDodgeStackAtkPct: 1.6,
        onDodgeStackCap: 30
    });
})();


function abyssPickSoulCardChoices() {
    var pool = ABYSS_SOUL_CARDS.slice();
    if (pool.length < 3) return [];
    var result = [];
    function weight(card) {
        if (card.rarity === 'common') return 60;
        if (card.rarity === 'rare') return 30;
        if (card.rarity === 'epic') return 9;
        if (card.rarity === 'legendary') return 1;
        return 10;
    }
    for (var n = 0; n < 3; n++) {
        var total = 0;
        for (var i = 0; i < pool.length; i++) total += weight(pool[i]);
        var r = Math.random() * total;
        var acc = 0, idx = 0;
        for (var j = 0; j < pool.length; j++) {
            acc += weight(pool[j]);
            if (r <= acc) { idx = j; break; }
        }
        result.push(pool[idx]);
        pool.splice(idx, 1);
    }
    return result;
}
function abyssSoulCardDescForDisplay(card) {
    if (!card) return '';
    var desc = card.desc || '';
    if (card.group !== 'pet') return desc;
    // 宠物流灵魂卡当前实际为 x2 生效，描述也同步显示翻倍后的百分比
    return desc.replace(/([+-]?\d+(?:\.\d+)?)%/g, function(_, n){
        var v = parseFloat(n);
        if (isNaN(v)) return _;
        var dv = v * 2;
        var out = (Math.floor(dv * 10) % 10 === 0) ? String(Math.floor(dv)) : dv.toFixed(1);
        return out + '%';
    });
}


function abyssOpenSoulCardChoice() {
    if (!abyssRun || !abyssRun.active) return;
    var overlay = document.getElementById('abyssSoulCardOverlay');
    var box = document.getElementById('abyssSoulCardUI');
    var listDiv = document.getElementById('abyssSoulCardOptions');
    if (!overlay || !box || !listDiv) return;
    var choices = abyssPickSoulCardChoices();
    if (!choices || !choices.length) return;
    abyssRun.pendingSoulChoice = true;
    abyssRun.autoAttack = false;
    if (typeof stopAbyssAutoAttack === 'function') stopAbyssAutoAttack();
    var groupNameMap = {
        atk: '攻击流', crit: '暴击流', def: '防御流', skill: '技能流', life: '生存流',
        econ: '经济流', pet: '宠物流', summon: '召唤流', unique: '独特流',
        warrior: '战士专属', mage: '法师专属', archer: '射手专属', tamer: '驯兽师专属',
        onmyoji: '阴阳师专属', mechanic: '机械师专属', jester: '戏命师专属', riftbinder: '异界御灵专属', legend: '传说羁绊'
    };
    listDiv.innerHTML = '';
    choices.forEach(function(card){
        var style = ABYSS_SOUL_CARD_RARITY_STYLES[card.rarity] || ABYSS_SOUL_CARD_RARITY_STYLES.common;
        var gName = groupNameMap[card.group] || '其他流派';
        var div = document.createElement('div');
        div.style.cssText = 'padding:10px;border-radius:10px;border:2px solid '+style.border+';background:'+style.bg+';cursor:pointer;font-size:12px;box-shadow:0 0 10px rgba(0,0,0,0.4);transition:transform 0.1s,box-shadow 0.1s;';
        div.innerHTML =
            '<div style="font-weight:bold;font-size:14px;color:'+style.title+';margin-bottom:4px;">['+ style.name +'] '+ card.name +'</div>'+
            '<div style="font-size:11px;color:#ce93d8;margin-bottom:4px;">流派：'+ gName +'</div>'+
            '<div style="color:#e0e0e0;min-height:32px;margin-bottom:4px;">'+ abyssSoulCardDescForDisplay(card) +'</div>'+
            '<div style="font-size:11px;color:#b0bec5;">同名最多叠加 5 层</div>';
        div.onmouseenter = function(){ this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 14px rgba(255,255,255,0.3)'; };
        div.onmouseleave = function(){ this.style.transform=''; this.style.boxShadow='0 0 10px rgba(0,0,0,0.4)'; };
        div.onclick = function(){ abyssChooseSoulCard(card); };
        listDiv.appendChild(div);
    });
    overlay.style.display = 'block';
    box.style.display = 'block';
    if (typeof abyssRenderSoulSummary === 'function') abyssRenderSoulSummary();
}


function openAbyssSoulCardPanel() {
    if (!abyssRun || !abyssRun.active) return;
    var ov = document.getElementById('abyssSoulPanelOverlay');
    var ui = document.getElementById('abyssSoulPanelUI');
    if (!ov || !ui) return;
    ov.style.display = 'block';
    ui.style.display = 'flex';
    ui.style.flexDirection = 'column';
    renderAbyssSoulCardPanel();
}
function closeAbyssSoulCardPanel() {
    var ov = document.getElementById('abyssSoulPanelOverlay');
    var ui = document.getElementById('abyssSoulPanelUI');
    if (ov) ov.style.display = 'none';
    if (ui) ui.style.display = 'none';
}


// 根据职业解析灵魂卡「专属/非专属」数值（用于统一重算）
function abyssSoulCardResolvedEffect(eff, cls) {
    if (!eff) return {};
    var o = {};
    function set(k, v) { if (v != null && v !== 0) o[k] = (o[k] || 0) + v; }
    if (eff.warriorOnly) {
        set('atkPct', cls === 'warrior' ? eff.atkPct : (eff.fallbackAtkPct || 0));
        if (cls === 'warrior') {
            set('lifestealPct', eff.lifestealPct);
            set('hpPct', eff.hpPct);
        }
        return o;
    }
    if (eff.mageOnly) {
        set('skillDmg', cls === 'mage' ? eff.skillDmgPct : (eff.fallbackSkillDmgPct || 0));
        set('reduceMonsterDef', cls === 'mage' ? eff.reduceMonsterDefPct : 0);
        return o;
    }
    if (eff.archerOnly) {
        set('critRatePct', cls === 'archer' ? eff.critRatePct : (eff.fallbackCritRatePct || 0));
        set('critDmgPct', cls === 'archer' ? eff.critDmgPct : 0);
        set('reduceMonsterDef', cls === 'archer' ? eff.reduceMonsterDefPct : 0);
        return o;
    }
    if (eff.tamerOnly) {
        set('petAtkPct', cls === 'tamer' ? eff.petAtkPct : (eff.fallbackPetAtkPct || 0));
        set('atkPct', cls === 'tamer' ? eff.atkPct : 0);
        return o;
    }
    if (eff.onmyojiOnly) {
        set('summonAtkPctSoul', cls === 'onmyoji' ? eff.summonAtkPct : (eff.fallbackSummonAtkPct || 0));
        set('skillDmg', cls === 'onmyoji' ? eff.skillDmgPct : 0);
        set('reduceMonsterDef', cls === 'onmyoji' ? eff.reduceMonsterDefPct : 0);
        return o;
    }
    if (eff.mechanicOnly) {
        set('reduceMonsterDef', cls === 'mechanic' ? eff.reduceMonsterDefPct : 0);
        set('skillDmg', cls === 'mechanic' ? eff.skillDmgPct : 0);
        set('atkPct', cls === 'mechanic' ? eff.atkPct : 0);
        set('hpPct', cls === 'mechanic' ? eff.hpPct : 0);
        return o;
    }
    if (eff.jesterOnly) {
        set('atkPct', cls === 'jester' ? eff.atkPct : (eff.fallbackAtkPct || 0));
        set('critRatePct', cls === 'jester' ? eff.critRatePct : 0);
        set('skillDmg', cls === 'jester' ? eff.skillDmgPct : 0);
        set('critDmgPct', cls === 'jester' ? eff.critDmgPct : 0);
        if (eff.damageReduction != null && cls === 'jester') set('soulDamageReductionPct', eff.damageReduction);
        return o;
    }
    if (eff.riftbinderOnly) {
        set('petAtkPct', cls === 'riftbinder' ? eff.petAtkPct : (eff.fallbackPetAtkPct || 0));
        set('petDefPct', cls === 'riftbinder' ? eff.petDefPct : 0);
        set('petHpPct', cls === 'riftbinder' ? eff.petHpPct : 0);
        set('skillDmg', cls === 'riftbinder' ? eff.skillDmgPct : 0);
        if (eff.damageReduction != null && cls === 'riftbinder') set('soulDamageReductionPct', eff.damageReduction);
        return o;
    }
    set('atkPct', eff.atkPct);
    set('hpPct', eff.hpPct);
    set('defPct', eff.defPct);
    set('critRatePct', eff.critRatePct);
    set('critDmgPct', eff.critDmgPct);
    set('skillDmg', eff.skillDmgPct);
    set('reduceMonsterDef', eff.reduceMonsterDefPct);
    set('dodgePct', eff.dodgePct);
    set('lifestealPct', eff.lifestealPct);
    set('goldPct', eff.goldPct);
    set('expPct', eff.expPct);
    set('petAtkPct', eff.petAtkPct);
    set('petHpPct', eff.petHpPct);
    set('petDefPct', eff.petDefPct);
    set('summonAtkPctSoul', eff.summonAtkPct);
    set('summonHpPctSoul', eff.summonHpPct);
    return o;
}


function abyssRebuildSoulCardBuffs() {
    if (!abyssRun || !abyssRun.active) return;
    abyssRun.buffs = abyssRun.buffs || {};
    var oldSnap = abyssRun._soulCardBuffSnap;
    if (oldSnap) {
        for (var ok in oldSnap) {
            if (!oldSnap.hasOwnProperty(ok)) continue;
            abyssRun.buffs[ok] = (abyssRun.buffs[ok] || 0) - oldSnap[ok];
            if (abyssRun.buffs[ok] === 0) delete abyssRun.buffs[ok];
        }
    }
    var newSnap = {};
    function snapAdd(key, val) {
        if (val == null || val === 0) return;
        newSnap[key] = (newSnap[key] || 0) + val;
    }
    var petScale = 2;
    var list = abyssRun.soulCards || [];
    var cls = abyssRun.playerClass || 'warrior';
    var legendaryStacks = 0;
    var uniqueStacks = 0;
    var groups = {};
    for (var gi = 0; gi < list.length; gi++) {
        var ent = list[gi];
        if (!ent || !ent.card) continue;
        var c = ent.card;
        var st = ent.stack || 1;
        if (c.rarity === 'legendary') legendaryStacks += st;
        if (c.group === 'unique') uniqueStacks += st;
        groups[c.group] = (groups[c.group] || 0) + st;
    }
    var distinctGroupCount = Object.keys(groups).length;

    for (var i = 0; i < list.length; i++) {
        var entry = list[i];
        if (!entry || !entry.card || !entry.card.effect) continue;
        var card = entry.card;
        var eff = card.effect;
        var st = entry.stack || 1;

        if (eff.synergyNoLegendAtkPct != null) {
            if (legendaryStacks === 0) {
                snapAdd('atkPct', eff.synergyNoLegendAtkPct * st);
                snapAdd('hpPct', (eff.synergyNoLegendHpPct || 0) * st);
            }
            continue;
        }
        if (eff.synergySoloUniqueAtkPct != null) {
            if (uniqueStacks === 1) {
                snapAdd('atkPct', eff.synergySoloUniqueAtkPct * st);
                snapAdd('critRatePct', (eff.synergySoloUniqueCritPct || 0) * st);
            } else if (uniqueStacks >= 3) {
                snapAdd('hpPct', (eff.synergyManyUniqueHpPct || 0) * st);
            }
            continue;
        }
        if (eff.needGroupDiversity != null) {
            snapAdd('atkPct', (eff.atkPct || 0) * st);
            snapAdd('hpPct', (eff.hpPct || 0) * st);
            snapAdd('critRatePct', (eff.critRatePct || 0) * st);
            if (distinctGroupCount >= (eff.needGroupDiversity || 0)) {
                snapAdd('atkPct', (eff.extraAtkPctIfDiverse || 0) * st);
            }
            continue;
        }

        var r = abyssSoulCardResolvedEffect(eff, cls);
        for (var rk in r) {
            if (!r.hasOwnProperty(rk)) continue;
            var val = r[rk] * st;
            if (rk === 'petAtkPct' || rk === 'petHpPct' || rk === 'petDefPct') val *= petScale;
            snapAdd(rk, val);
        }
    }
    abyssRun._soulCardBuffSnap = newSnap;
    for (var nk in newSnap) {
        if (!newSnap.hasOwnProperty(nk)) continue;
        abyssRun.buffs[nk] = (abyssRun.buffs[nk] || 0) + newSnap[nk];
        if (abyssRun.buffs[nk] === 0) delete abyssRun.buffs[nk];
    }
}

function abyssSoulCardRoundStartRegen(stats) {
    if (!abyssRun || !stats) return;
    var list = abyssRun.soulCards || [];
    var petPct = 0, selfPct = 0;
    for (var ri = 0; ri < list.length; ri++) {
        var ent = list[ri];
        if (!ent || !ent.card || !ent.card.effect) continue;
        var ef = ent.card.effect;
        var st = ent.stack || 1;
        if (ef.petSummonRegenPct != null) petPct += ef.petSummonRegenPct * st;
        if (ef.selfRegenPct != null) selfPct += ef.selfRegenPct * st;
    }
    if (petPct > 0 && typeof abyssGetDeployedPets === 'function') {
        var pets = abyssGetDeployedPets();
        for (var pi = 0; pi < pets.length; pi++) {
            var pt = pets[pi];
            if (!pt || (pt.hp != null && pt.hp <= 0)) continue;
            var ps = abyssCalcPetStats(pt);
            if (!ps || !ps.maxHp) continue;
            if (pt.hp == null) pt.hp = ps.maxHp;
            var healP = Math.floor(ps.maxHp * petPct / 100);
            pt.hp = Math.min(ps.maxHp, (pt.hp || 0) + healP);
            if (healP > 0) abyssLog('灵契回响：宠物【' + (pt.name || '') + '】回复 ' + formatNumber(healP) + ' 生命');
        }
    }
    if (selfPct > 0 && stats.maxHp) {
        var healS = Math.floor(stats.maxHp * selfPct / 100);
        abyssRun.player.hp = Math.min(stats.maxHp, (abyssRun.player.hp || 0) + healS);
        if (healS > 0) abyssLog('灵契回响：玩家回复 ' + formatNumber(healS) + ' 生命');
    }
}

function abyssSoulCardOnManualAttack() {
    if (!abyssRun || !abyssRun.soulCards) return;
    var list = abyssRun.soulCards;
    var pct = 0, cap = 40;
    for (var mi = 0; mi < list.length; mi++) {
        var ef = list[mi].card && list[mi].card.effect;
        if (ef && ef.manualAttackStackAtkPct != null) {
            pct = ef.manualAttackStackAtkPct;
            cap = ef.manualAttackStackCap != null ? ef.manualAttackStackCap : 40;
            break;
        }
    }
    if (!pct) return;
    abyssRun.soulManualAtkStacks = Math.min(cap, (abyssRun.soulManualAtkStacks || 0) + 1);
    abyssLog('连击究极：本局普攻叠加 ' + abyssRun.soulManualAtkStacks + ' 层（每层 +' + pct + '% 攻击）');
}

function abyssSoulCardOnDodgeSuccess() {
    if (!abyssRun || !abyssRun.soulCards) return;
    var list = abyssRun.soulCards;
    var dd = 0, cap = 30;
    for (var di = 0; di < list.length; di++) {
        var ef = list[di].card && list[di].card.effect;
        if (ef && ef.onDodgeStackDodgePct != null) {
            dd = ef.onDodgeStackDodgePct;
            cap = ef.onDodgeStackCap != null ? ef.onDodgeStackCap : 30;
            break;
        }
    }
    if (!dd) return;
    abyssRun.soulDodgeStacks = Math.min(cap, (abyssRun.soulDodgeStacks || 0) + 1);
    abyssLog('极限闪避：闪避叠加 ' + abyssRun.soulDodgeStacks + ' 层');
}

function abyssChooseSoulCard(card) {
    if (!abyssRun || !abyssRun.active || !card) return;
    abyssRun.soulCards = abyssRun.soulCards || [];
    var existed = null;
    for (var i = 0; i < abyssRun.soulCards.length; i++) {
        if (abyssRun.soulCards[i].card && abyssRun.soulCards[i].card.id === card.id) {
            existed = abyssRun.soulCards[i];
            break;
        }
    }
    var stackDelta = 1;
    if (existed) {
        var before = existed.stack || 1;
        var after = Math.min(before + 1, card.maxStack || 5);
        stackDelta = after - before;
        existed.stack = after;
        if (stackDelta <= 0) stackDelta = 0;
    } else {
        abyssRun.soulCards.push({ card: card, stack: 1 });
    }
    if (stackDelta > 0) {
        abyssRebuildSoulCardBuffs();
    }
    abyssApplySoulSynergies();
    abyssRenderSoulSummary();
    var overlay = document.getElementById('abyssSoulCardOverlay');
    var box = document.getElementById('abyssSoulCardUI');
    if (overlay) overlay.style.display = 'none';
    if (box) box.style.display = 'none';
    abyssRun.pendingSoulChoice = false;
    if (typeof abyssDeferUpdate === 'function') abyssDeferUpdate();
}

// 左下角汇总文本
function abyssRenderSoulSummary() {
    var el = document.getElementById('abyssSoulCardSummary');
    if (!el || !abyssRun || !abyssRun.active) return;
    var need = 10;
    var cur = abyssRun.soulKillsSinceLastCard || 0;
    var remain = need - cur;
    if (remain <= 0 && !abyssRun.pendingSoulChoice) {
        el.textContent = '灵魂卡牌击杀倒计数：已就绪，可触发 3 选 1';
        return;
    }
    if (abyssRun.pendingSoulChoice) {
        el.textContent = '灵魂卡牌击杀倒计数：已弹出选择，请先选卡';
        return;
    }
    var totalCards = 0;
    var list = abyssRun.soulCards || [];
    for (var i = 0; i < list.length; i++) totalCards += (list[i].stack || 1);
    el.textContent = '灵魂卡牌击杀倒计数：还需 ' + Math.max(0, remain) + ' 次击杀触发（本局已获得 ' + totalCards + ' 张）';
}

// 渲染灵魂卡牌总览面板
function renderAbyssSoulCardPanel() {
    var listWrap = document.getElementById('abyssSoulPanelList');
    var metaEl = document.getElementById('abyssSoulPanelMeta');
    var synEl = document.getElementById('abyssSoulPanelSynergy');
    if (!listWrap || !metaEl || !synEl) return;
    if (!abyssRun || !abyssRun.active) {
        listWrap.innerHTML = '';
        metaEl.textContent = '当前未在进行中的无限深渊局内';
        synEl.textContent = '';
        return;
    }
    var list = abyssRun.soulCards || [];
    var total = 0;
    var groups = {};
    var legendaryCount = 0;
    listWrap.innerHTML = '';
    if (!list.length) {
        metaEl.textContent = '当前局尚未获得灵魂卡牌';
    } else {
        var groupNameMap = {
            atk: '攻击流',
            crit: '暴击流',
            def: '防御流',
            skill: '技能流',
            life: '生存流',
            econ: '经济流',
            pet: '宠物流',
            summon: '召唤流',
            unique: '独特流',
            warrior: '战士专属',
            mage: '法师专属',
            archer: '射手专属',
            tamer: '驯兽师专属',
            onmyoji: '阴阳师专属',
            mechanic: '机械师专属',
            jester: '戏命师专属',
            riftbinder: '异界御灵专属',
            legend: '传说羁绊'
        };
        for (var i = 0; i < list.length; i++) {
            var entry = list[i];
            if (!entry.card) continue;
            var card = entry.card;
            var st = entry.stack || 1;
            total += st;
            groups[card.group] = (groups[card.group] || 0) + st;
            if (card.rarity === 'legendary') legendaryCount += st;
            var style = ABYSS_SOUL_CARD_RARITY_STYLES[card.rarity] || ABYSS_SOUL_CARD_RARITY_STYLES.common;
            var cardDiv = document.createElement('div');
            var baseBg = 'background:' + style.bg + ';';
            if (card.rarity === 'legendary') {
                baseBg = 'background:linear-gradient(135deg,rgba(255,235,59,0.15),rgba(156,39,176,0.25));';
            }
            cardDiv.style.cssText = baseBg + 'border-radius:10px;border:2px solid '+style.border+';padding:8px 8px 6px 8px;font-size:11px;box-shadow:0 0 10px rgba(0,0,0,0.5);position:relative;overflow:hidden;';
            if (card.rarity === 'legendary') {
                cardDiv.style.boxShadow = '0 0 18px rgba(255,235,59,0.6)';
            }
            var gName = groupNameMap[card.group] || '其他流派';
            cardDiv.innerHTML =
                '<div style="font-weight:bold;font-size:13px;color:'+style.title+';margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">['+ style.name +'] '+ card.name +' x'+ st +'</div>'+
                '<div style="color:#eceff1;min-height:30px;margin-bottom:4px;">'+ abyssSoulCardDescForDisplay(card) +'</div>'+
                '<div style="font-size:10px;color:#b0bec5;">流派：'+ gName +'</div>';
            listWrap.appendChild(cardDiv);
        }
        metaEl.textContent = '当前局共获得 '+ total +' 张灵魂卡牌，涉及流派 '+ Object.keys(groups).length +' 种，传说卡数量 '+ legendaryCount;
    }
    // 羁绊展示：从 abyssRun.soulSynergyBuffs 里读
    synEl.innerHTML = '';
    var sy = abyssRun.soulSynergyBuffs || {};
    var lines = [];
    function addLine(label, key) {
        var v = sy[key] || 0;
        if (!v) return;
        var sign = v > 0 ? '+' : '';
        lines.push('<div>· '+ label +'：<span style="color:'+(v>0?'#81c784':'#ff8a80')+';">'+ sign + v +'%</span></div>');
    }
    addLine('攻击加成', 'atkPct');
    addLine('生命加成', 'hpPct');
    addLine('防御加成', 'defPct');
    addLine('暴击率加成', 'critRatePct');
    addLine('爆伤加成', 'critDmgPct');
    addLine('金币加成', 'goldPct');
    addLine('经验加成', 'expPct');
    if (!lines.length) {
        synEl.innerHTML = '<div style="color:#b0bec5;">当前尚未触发额外羁绊加成，可以多尝试不同流派/职业卡牌的组合。</div>';
    } else {
        synEl.innerHTML = lines.join('');
    }
}


function abyssApplySoulSynergies() {
    if (!abyssRun || !abyssRun.active) return;
    abyssRun.buffs = abyssRun.buffs || {};
    var list = abyssRun.soulCards || [];
    var groupCount = {};
    var rarityCount = { legendary: 0 };
    var uniqueCount = 0;
    var econCount = 0;
    var petCount = 0;
    var summonCount = 0;
    var professionCount = { warrior:0, mage:0, archer:0, tamer:0, onmyoji:0, mechanic:0, jester:0, riftbinder:0 };

    for (var i = 0; i < list.length; i++) {
        var entry = list[i];
        if (!entry.card) continue;
        var c = entry.card;
        var st = entry.stack || 1;
        groupCount[c.group] = (groupCount[c.group] || 0) + st;
        if (c.rarity === 'legendary') rarityCount.legendary += st;
        if (c.group === 'unique') uniqueCount += st;
        if (c.group === 'econ') econCount += st;
        if (c.group === 'pet') petCount += st;
        if (c.group === 'summon') summonCount += st;
        if (professionCount.hasOwnProperty(c.group)) {
            professionCount[c.group] += st;
        }
    }

    
    if (abyssRun.soulSynergyBuffs) {
        var old = abyssRun.soulSynergyBuffs;
        for (var k in old) {
            if (!old.hasOwnProperty(k)) continue;
            abyssRun.buffs[k] = (abyssRun.buffs[k] || 0) - old[k];
        }
    }
    // 羁绊：普通类最终 ×2（+100%）；宠物+召唤联动类 ×3（+200%）；金币/经验类不翻倍
    var syR = { atkPct:0, hpPct:0, defPct:0, critRatePct:0, critDmgPct:0, goldPct:0, expPct:0 };
    var syP = { atkPct:0, hpPct:0, defPct:0, critRatePct:0, critDmgPct:0 };

    
    var distinctGroups = Object.keys(groupCount).length;
    if (distinctGroups >= 4) {
        syR.atkPct += 6;
        syR.hpPct  += 6;
        syR.defPct += 6;
        syR.critRatePct += 3;
    }

   
    if (uniqueCount === 1) {
        syR.atkPct += 8;
        syR.critRatePct += 4;
    } else if (uniqueCount >= 4) {
        syR.atkPct += 12;
        syR.hpPct  -= 10;
    }

    
    if (econCount >= 3) {
        syR.goldPct += 20;
        syR.expPct  += 6;  // 经验卡牌收益减半：原12→6（羁绊倍率不作用于金币/经验）
    }

    
    if (petCount >= 2 && summonCount >= 2) {
        syP.atkPct += 8;
        syP.hpPct  += 6;
    }

    
    var cls = abyssRun.playerClass || 'warrior';
    if (professionCount[cls] >= 3) {
        syR.atkPct += 10;
        syR.critDmgPct += 12;
    }

    
    if (rarityCount.legendary === 0 && groupCount.unique && groupCount.unique >= 2) {
        syR.defPct += 6;
    }

   
    if ((groupCount.atk || 0) >= 2 && (groupCount.crit || 0) >= 2) {
        syR.atkPct += 10;
        syR.critDmgPct += 10;
    }

    
    if ((groupCount.def || 0) >= 2 && ((groupCount.life || 0) + (groupCount.pet || 0) >= 2)) {
        syR.hpPct  += 10;
        syR.defPct += 10;
    }

    
    if ((groupCount.skill || 0) >= 3 && (groupCount.mage || 0) >= 1) {
        syR.atkPct += 6;
        syR.critDmgPct += 14;
    }

    
    if ((groupCount.summon || 0) >= 3 &&
        ((groupCount.onmyoji || 0) >= 2 || (groupCount.archer || 0) >= 2)) {
        syR.atkPct += 8;
        syR.hpPct  += 8;
    }
    // 戏命师联动：赌狗流卡越多，爆发与暴伤越高
    if ((groupCount.jester || 0) >= 2) {
        syR.atkPct += 10;
        syR.critDmgPct += 16;
    }
    if ((groupCount.jester || 0) >= 4) {
        syR.atkPct += 12;
        syR.critRatePct += 6;
    }

    
    if ((groupCount.atk || 0) >= 3 && econCount >= 2 && uniqueCount >= 1) {
        syR.atkPct += 14;
        syR.hpPct  -= 8;
    }

    
    if (distinctGroups >= 6 && rarityCount.legendary >= 2) {
        syR.atkPct += 8;
        syR.hpPct  += 8;
        syR.critRatePct += 4;
    }

    
    if (professionCount[cls] >= 5 && uniqueCount === 0) {
        syR.atkPct += 10;
        syR.defPct += 8;
    }
    if (cls === 'jester' && professionCount.jester >= 3) {
        syR.atkPct += 14;
        syR.critDmgPct += 20;
        syR.hpPct += 8;
    }
    if (cls === 'riftbinder' && professionCount.riftbinder >= 3) {
        syR.hpPct += 10;
        syR.defPct += 10;
        syP.atkPct += 8;
        syP.hpPct += 8;
    }

    var sy = {
        atkPct: syR.atkPct * 2 + syP.atkPct * 3,
        hpPct: syR.hpPct * 2 + syP.hpPct * 3,
        defPct: syR.defPct * 2 + syP.defPct * 3,
        critRatePct: syR.critRatePct * 2 + syP.critRatePct * 3,
        critDmgPct: syR.critDmgPct * 2 + syP.critDmgPct * 3,
        goldPct: syR.goldPct,
        expPct: syR.expPct
    };

    
    for (var k2 in sy) {
        if (!sy.hasOwnProperty(k2)) continue;
        if (!sy[k2]) continue;
        abyssRun.buffs[k2] = (abyssRun.buffs[k2] || 0) + sy[k2];
    }
    abyssRun.soulSynergyBuffs = sy;
}


var ABYSS_MECHANIC_SUMMON_CAP = 4;

function abyssZhuan(level) {
    if (level >= 100) return 4;
    if (level >= 50) return 3;
    if (level >= 20) return 2;
    return 1;
}
function abyssMaxMpForLevel(runLevel) {
    var z = abyssZhuan(runLevel || 0);
    return 60 + (runLevel || 0) * 2.5 + z * 30;
}
function abyssMpRegenForLevel(runLevel) {
    var z = abyssZhuan(runLevel || 0);
    return 6 + z * 4;
}

// 射手召唤物场上总上限（任意召唤技能共用）
var ABYSS_ARCHER_SUMMON_CAP = 4;
// 阴阳师召唤物场上总上限（妖怪+式神共用，最多4只）
var ABYSS_ONMYOJI_SUMMON_CAP = 4;
// 技能：1转通用；2转选择分支后解锁 branchA/B/C/D 的 2/3/4 转技能
function abyssGetSkillList(classId, branch) {
    var c = ABYSS_CLASS_SKILLS[classId];
    if (!c) return [];
    if (Array.isArray(c)) return c;
    var list = (c.base || []).slice();
    if (branch && c[branch]) { for (var i = 0; i < c[branch].length; i++) list.push(c[branch][i]); }
    return list;
}
var ABYSS_CLASS_SKILLS = {
    warrior: {
        base: [
            { id: 'war_heavy', name: '重击', desc: '本次伤害200%', cooldown: 2, dmgMult: 2, mpCost: 14, zhuan: 1 },
            { id: 'war_armorBreak', name: '破甲一击', desc: '本次无视怪物50%防御，伤害140%', cooldown: 3, ignoreDefPct: 50, dmgMult: 1.4, mpCost: 18, zhuan: 1 },
            { id: 'war_roar', name: '战吼', desc: '本次伤害150%，3回合攻击+40%', cooldown: 4, dmgMult: 1.5, buffAtkPct: 40, buffRounds: 3, mpCost: 22, zhuan: 1 },
            { id: 'war_slam', name: '猛击', desc: '本次伤害250%', cooldown: 5, dmgMult: 2.5, mpCost: 26, zhuan: 1 },
            { id: 'war_iron', name: '铁壁', desc: '本回合受到伤害减少45%', cooldown: 4, reduceDmgPct: 45, mpCost: 20, zhuan: 1 },
            { id: 'war_blood', name: '嗜血斩', desc: '本次伤害170%，回复35%伤害生命', cooldown: 3, dmgMult: 1.7, lifestealPct: 0.35, mpCost: 16, zhuan: 1 },
            { id: 'war_cleave', name: '裂地斩', desc: '群体110%伤害', cooldown: 4, aoe: true, aoePct: 1.1, mpCost: 24, zhuan: 1 },
            { id: 'war_summon_wangcai', name: '召唤旺财', desc: '战士专属·召唤旺财(100%玩家属性)，场上最多1只，冷却5回合（绑定技能，不可卸下）', cooldown: 5, summonBeast: true, summonPct: 1, summonMax: 1, summonName: '旺财', mpCost: 28, zhuan: 1, boundSkill: true }
        ],
        // 破军：爆发/破甲/单体高伤
        branchA: [
            { id: 'war_quake', name: '震地波', desc: '2转·群体125%伤害', cooldown: 5, aoe: true, aoePct: 1.25, mpCost: 30, zhuan: 2 },
            { id: 'war_berserk', name: '狂暴', desc: '2转·本次伤害270%', cooldown: 6, dmgMult: 2.7, mpCost: 34, zhuan: 2 },
            { id: 'war_battlewill', name: '战意燃烧', desc: '2转·本回合攻击+50%', cooldown: 4, buffAtkPct: 50, buffRounds: 1, mpCost: 24, zhuan: 2 },
            { id: 'war_sunderarmor', name: '裂甲', desc: '2转·本次伤害165%，无视25%防御', cooldown: 4, dmgMult: 1.65, ignoreDefPct: 25, mpCost: 28, zhuan: 2 },
            { id: 'war_bloodthirst', name: '破军·嗜血', desc: '2转·伤害190%，回复40%伤害生命', cooldown: 3, dmgMult: 1.9, lifestealPct: 0.4, mpCost: 26, zhuan: 2 },
            { id: 'war_crush', name: '破军·碎骨', desc: '2转·本次伤害210%，无视20%防御', cooldown: 4, dmgMult: 2.1, ignoreDefPct: 20, mpCost: 28, zhuan: 2 },
            { id: 'war_onslaught', name: '破军·冲锋', desc: '2转·本次伤害200%，下回合攻击+40%', cooldown: 5, dmgMult: 2, buffAtkPct: 40, buffRounds: 1, mpCost: 30, zhuan: 2 },
            { id: 'war_skyfall', name: '天崩斩', desc: '3转·本次伤害310%', cooldown: 6, dmgMult: 3.1, mpCost: 38, zhuan: 3 },
            { id: 'war_sunder', name: '破灭斩', desc: '3转·无视70%防御，伤害200%', cooldown: 5, ignoreDefPct: 70, dmgMult: 2, mpCost: 36, zhuan: 3 },
            { id: 'war_bloodlust', name: '血怒', desc: '3转·伤害180%，回复50%伤害生命', cooldown: 4, dmgMult: 1.8, lifestealPct: 0.5, mpCost: 30, zhuan: 3 },
            { id: 'war_warlord', name: '战神附体', desc: '3转·3回合攻击+75%、减伤10%', cooldown: 8, buffAtkPct: 75, buffRounds: 3, reduceDmgPct: 15, mpCost: 42, zhuan: 3 },
            { id: 'war_warspirit', name: '战魂', desc: '3转·3回合暴击率+20%、爆伤+80%', cooldown: 7, buffCritRate: 20, buffCritDmg: 20, buffRounds: 3, mpCost: 80, zhuan: 3 },
            { id: 'war_break', name: '破军', desc: '3转·本次伤害220%，目标生命>70%时额外+25%', cooldown: 5, dmgMult: 2.2, mpCost: 36, zhuan: 3 },
            { id: 'war_bloodbath', name: '浴血', desc: '3转·本次伤害200%，自身生命低于50%时伤害+40%', cooldown: 5, dmgMult: 2, mpCost: 38, zhuan: 3 },
            { id: 'war_apocalypse', name: '末日审判', desc: '4转·群体150%伤害', cooldown: 7, aoe: true, aoePct: 1.5, mpCost: 48, zhuan: 4 },
            { id: 'war_titan', name: '泰坦之握', desc: '4转·本次伤害380%', cooldown: 8, dmgMult: 3.8, mpCost: 52, zhuan: 4 },
            { id: 'war_immortal', name: '不灭战意', desc: '4转·4回合攻击+100%、减伤10%', cooldown: 10, buffAtkPct: 100, buffRounds: 4, reduceDmgPct: 10, mpCost: 50, zhuan: 4 },
            { id: 'war_heaven', name: '天罚', desc: '4转·群体100%伤害', cooldown: 7, aoe: true, aoePct: 1, dmgMult: 1, mpCost: 46, zhuan: 4 },
            { id: 'war_fortress', name: '霸体', desc: '4转·本回合免疫眩晕且减伤20%', cooldown: 6, reduceDmgPct: 20, immuneStun: true, mpCost: 44, zhuan: 4 },
            { id: 'war_doomsday', name: '灭世斩', desc: '4转·本次伤害430%', cooldown: 10, dmgMult: 4.3, mpCost: 58, zhuan: 4 }
        ],
        // 铁壁：生存/反伤/群体减伤
        branchB: [
            { id: 'war_guard', name: '不屈', desc: '2转·本回合减伤60%', cooldown: 5, reduceDmgPct: 60, mpCost: 26, zhuan: 2 },
            { id: 'war_revenge', name: '反击架势', desc: '2转·本回合受击反弹30%伤害', cooldown: 5, counterPct: 30, mpCost: 28, zhuan: 2 },
            { id: 'war_stomp', name: '践踏', desc: '2转·群体60%伤害，20%眩晕1回合', cooldown: 5, aoe: true, aoePct: 0.6, stunChance: 0.20, stunTurns: 1, mpCost: 30, zhuan: 2 },
            { id: 'war_ironwall', name: '铁壁·铜墙', desc: '2转·本回合减伤30%，反伤15%', cooldown: 5, reduceDmgPct: 30, counterPct: 15, mpCost: 28, zhuan: 2 },
            { id: 'war_taunt', name: '铁壁·嘲讽', desc: '2转·本回合减伤25%，受击反伤25%', cooldown: 4, reduceDmgPct: 25, counterPct: 25, mpCost: 24, zhuan: 2 },
            { id: 'war_groundslam', name: '铁壁·地动', desc: '2转·群体55%伤害，30%眩晕1回合', cooldown: 5, aoe: true, aoePct: 0.55, stunChance: 0.3, stunTurns: 1, mpCost: 32, zhuan: 2 },
            { id: 'war_endure', name: '铁壁·坚韧', desc: '2转·2回合减伤15%', cooldown: 6, reduceDmgPct: 15, buffRounds: 2, mpCost: 26, zhuan: 2 },
            { id: 'war_bulwark', name: '铁壁·壁垒', desc: '3转·本回合减伤70%，反伤20%', cooldown: 6, reduceDmgPct: 70, counterPct: 20, mpCost: 36, zhuan: 3 },
            { id: 'war_thorns', name: '荆棘反甲', desc: '3转·3回合受击反弹35%伤害', cooldown: 8, counterPct: 35, buffRounds: 3, mpCost: 40, zhuan: 3 },
            { id: 'war_quake2', name: '铁壁·震波', desc: '3转·群体75%伤害，40%眩晕1回合', cooldown: 6, aoe: true, aoePct: 0.75, stunChance: 0.4, stunTurns: 1, mpCost: 38, zhuan: 3 },
            { id: 'war_steadfast', name: '岿然不动', desc: '3转·本回合免疫眩晕，减伤45%', cooldown: 5, reduceDmgPct: 45, immuneStun: true, mpCost: 34, zhuan: 3 },
            { id: 'war_legion', name: '铁壁·军阵', desc: '3转·2回合减伤10%、攻击+80%', cooldown: 7, reduceDmgPct: 10, buffAtkPct: 80, buffRounds: 2, mpCost: 42, zhuan: 3 },
            { id: 'war_rampart', name: '铁壁·城垣', desc: '3转·获得生命上限25%护盾', cooldown: 5, shieldPct: 0.25, mpCost: 32, zhuan: 3 },
            { id: 'war_laststand', name: '背水一战', desc: '3转·生命低于40%时本回合减伤50%、反伤30%', cooldown: 6, reduceDmgPct: 50, counterPct: 30, mpCost: 40, zhuan: 3 },
            { id: 'war_immortalwall', name: '不破壁垒', desc: '4转·本回合减伤40%，反伤40%', cooldown: 8, reduceDmgPct: 40, counterPct: 40, mpCost: 50, zhuan: 4 },
            { id: 'war_judgment', name: '铁壁·天谴', desc: '4转·群体90%伤害，眩晕目标受伤+30%', cooldown: 7, aoe: true, aoePct: 0.9, mpCost: 48, zhuan: 4 },
            { id: 'war_eternalguard', name: '永恒守护', desc: '4转·4回合减伤35%、反伤25%', cooldown: 10, reduceDmgPct: 35, counterPct: 25, buffRounds: 4, mpCost: 54, zhuan: 4 },
            { id: 'war_colossus', name: '泰坦壁垒', desc: '4转·获得40%生命护盾，本回合减伤30%', cooldown: 8, shieldPct: 0.4, reduceDmgPct: 30, mpCost: 52, zhuan: 4 },
            { id: 'war_worldshield', name: '世界之壁', desc: '4转·本回合免疫眩晕且减伤60%', cooldown: 9, reduceDmgPct: 60, immuneStun: true, mpCost: 56, zhuan: 4 },
            { id: 'war_apocalypse_b', name: '铁壁·末日', desc: '4转·群体100%伤害，50%眩晕1回合', cooldown: 8, aoe: true, aoePct: 1, stunChance: 0.5, stunTurns: 1, mpCost: 58, zhuan: 4 }
        ],
        branchC: [
            { id: 'war_frenzy_c1', name: '狂战·狂怒', desc: '2转·本次伤害220%，回复35%伤害生命', cooldown: 3, dmgMult: 2.2, lifestealPct: 0.35, mpCost: 26, zhuan: 2 },
            { id: 'war_frenzy_c2', name: '狂战·连斩', desc: '2转·2次100%伤害', cooldown: 4, multiHit: 2, multiHitPct: 1, mpCost: 28, zhuan: 2 },
            { id: 'war_frenzy_c3', name: '狂战·嗜血', desc: '2转·伤害190%，回复45%伤害生命', cooldown: 3, dmgMult: 1.9, lifestealPct: 0.45, mpCost: 24, zhuan: 2 },
            { id: 'war_frenzy_c4', name: '狂战·暴走', desc: '2转·本回合攻击+50%', cooldown: 5, buffAtkPct: 50, buffRounds: 1, mpCost: 30, zhuan: 2 },
            { id: 'war_frenzy_c5', name: '狂战·血刃', desc: '2转·伤害200%，吸血40%', cooldown: 4, dmgMult: 2, lifestealPct: 0.4, mpCost: 32, zhuan: 2 },
            { id: 'war_frenzy_c6', name: '狂战·三连', desc: '2转·3次75%伤害', cooldown: 4, multiHit: 3, multiHitPct: 0.75, mpCost: 30, zhuan: 2 },
            { id: 'war_frenzy_c7', name: '狂战·渴血', desc: '2转·伤害180%，回复50%伤害生命', cooldown: 3, dmgMult: 1.8, lifestealPct: 0.5, mpCost: 28, zhuan: 2 },
            { id: 'war_frenzy_c8', name: '狂战·血性', desc: '3转·4回合攻击+25%、吸血+15%', cooldown: 8, buffAtkPct: 25, buffRounds: 4, mpCost: 42, zhuan: 3 },
            { id: 'war_frenzy_c9', name: '狂战·裂魂', desc: '3转·伤害260%，回复50%伤害生命', cooldown: 5, dmgMult: 2.6, lifestealPct: 0.5, mpCost: 40, zhuan: 3 },
            { id: 'war_frenzy_c10', name: '狂战·四连', desc: '3转·4次80%伤害', cooldown: 5, multiHit: 4, multiHitPct: 0.8, mpCost: 38, zhuan: 3 },
            { id: 'war_frenzy_c11', name: '狂战·血祭', desc: '3转·伤害240%，吸血55%', cooldown: 5, dmgMult: 2.4, lifestealPct: 0.55, mpCost: 44, zhuan: 3 },
            { id: 'war_frenzy_c12', name: '狂战·战狂', desc: '3转·本回合攻击+60%、连击+20%', cooldown: 6, buffAtkPct: 60, buffRounds: 1, mpCost: 42, zhuan: 3 },
            { id: 'war_frenzy_c13', name: '狂战·饮血', desc: '3转·伤害220%，回复60%伤害生命', cooldown: 4, dmgMult: 2.2, lifestealPct: 0.6, mpCost: 40, zhuan: 3 },
            { id: 'war_frenzy_c14', name: '狂战·五连', desc: '3转·5次70%伤害', cooldown: 6, multiHit: 5, multiHitPct: 0.7, mpCost: 46, zhuan: 3 },
            { id: 'war_frenzy_c15', name: '狂战·血神', desc: '4转·伤害380%，回复70%伤害生命', cooldown: 9, dmgMult: 3.8, lifestealPct: 0.7, mpCost: 56, zhuan: 4 },
            { id: 'war_frenzy_c16', name: '狂战·灭魂', desc: '4转·6次65%伤害', cooldown: 8, multiHit: 6, multiHitPct: 0.65, mpCost: 54, zhuan: 4 },
            { id: 'war_frenzy_c17', name: '狂战·天嗜', desc: '4转·4回合攻击+60%、吸血+20%', cooldown: 10, buffAtkPct: 60, buffRounds: 4, mpCost: 58, zhuan: 4 },
            { id: 'war_frenzy_c18', name: '狂战·血海', desc: '4转·伤害350%，回复65%伤害生命', cooldown: 8, dmgMult: 3.5, lifestealPct: 0.65, mpCost: 52, zhuan: 4 },
            { id: 'war_frenzy_c19', name: '狂战·弑神', desc: '4转·本次伤害450%', cooldown: 10, dmgMult: 4.5, mpCost: 60, zhuan: 4 },
            { id: 'war_frenzy_c20', name: '狂战·无尽', desc: '4转·群体120%伤害，回复30%伤害生命', cooldown: 8, aoe: true, aoePct: 1.2, lifestealPct: 0.3, mpCost: 55, zhuan: 4 }
        ],
        branchD: [
            { id: 'war_cc_d1', name: '控场·震击', desc: '2转·群体85%伤害，30%眩晕1回合', cooldown: 4, aoe: true, aoePct: 0.85, stunChance: 0.3, stunTurns: 1, mpCost: 28, zhuan: 2 },
            { id: 'war_cc_d2', name: '控场·践踏', desc: '2转·群体80%伤害，25%眩晕1回合', cooldown: 5, aoe: true, aoePct: 0.8, stunChance: 0.25, stunTurns: 1, mpCost: 30, zhuan: 2 },
            { id: 'war_cc_d3', name: '控场·怒吼', desc: '2转·群体75%伤害，40%眩晕1回合', cooldown: 5, aoe: true, aoePct: 0.75, stunChance: 0.4, stunTurns: 1, mpCost: 32, zhuan: 2 },
            { id: 'war_cc_d4', name: '控场·震慑', desc: '2转·本次伤害180%，50%眩晕1回合', cooldown: 4, dmgMult: 1.8, stunChance: 0.5, stunTurns: 1, mpCost: 26, zhuan: 2 },
            { id: 'war_cc_d5', name: '控场·地裂', desc: '2转·群体90%伤害，10%眩晕2回合', cooldown: 5, aoe: true, aoePct: 0.9, stunChance: 0.1, stunTurns: 2, mpCost: 34, zhuan: 2 },
            { id: 'war_cc_d6', name: '控场·压制', desc: '2转·伤害200%，35%眩晕1回合', cooldown: 4, dmgMult: 2.0, stunChance: 0.35, stunTurns: 1, mpCost: 28, zhuan: 2 },
            { id: 'war_cc_d7', name: '控场·锁足', desc: '2转·群体70%伤害，35%眩晕1回合', cooldown: 5, aoe: true, aoePct: 0.7, stunChance: 0.35, stunTurns: 1, mpCost: 30, zhuan: 2 },
            { id: 'war_cc_d8', name: '控场·天崩', desc: '3转·群体105%伤害，30%眩晕1回合', cooldown: 6, aoe: true, aoePct: 1.05, stunChance: 0.3, stunTurns: 1, mpCost: 40, zhuan: 3 },
            { id: 'war_cc_d9', name: '控场·山崩', desc: '3转·群体100%伤害，40%眩晕1回合', cooldown: 6, aoe: true, aoePct: 1.0, stunChance: 0.4, stunTurns: 1, mpCost: 42, zhuan: 3 },
            { id: 'war_cc_d10', name: '控场·定身', desc: '3转·伤害250%，30%眩晕2回合', cooldown: 5, dmgMult: 2.5, stunChance: 0.3, stunTurns: 2, mpCost: 38, zhuan: 3 },
            { id: 'war_cc_d11', name: '控场·震晕', desc: '3转·群体105%伤害，45%眩晕1回合', cooldown: 6, aoe: true, aoePct: 1.05, stunChance: 0.45, stunTurns: 1, mpCost: 44, zhuan: 3 },
            { id: 'war_cc_d12', name: '控场·镇压', desc: '3转·伤害230%，45%眩晕2回合', cooldown: 5, dmgMult: 2.3, stunChance: 0.45, stunTurns: 2, mpCost: 40, zhuan: 3 },
            { id: 'war_cc_d13', name: '控场·崩裂', desc: '3转·群体110%伤害，40%眩晕2回合', cooldown: 7, aoe: true, aoePct: 1.1, stunChance: 0.4, stunTurns: 2, mpCost: 46, zhuan: 3 },
            { id: 'war_cc_d14', name: '控场·囚笼', desc: '3转·本次伤害270%，60%眩晕1回合', cooldown: 6, dmgMult: 2.7, stunChance: 0.6, stunTurns: 1, mpCost: 42, zhuan: 3 },
            { id: 'war_cc_d15', name: '控场·末日波', desc: '4转·群体150%伤害，50%眩晕1回合', cooldown: 8, aoe: true, aoePct: 1.5, stunChance: 0.5, stunTurns: 1, mpCost: 52, zhuan: 4 },
            { id: 'war_cc_d16', name: '控场·天罚波', desc: '4转·群体130%伤害，45%眩晕2回合', cooldown: 8, aoe: true, aoePct: 1.3, stunChance: 0.45, stunTurns: 2, mpCost: 54, zhuan: 4 },
            { id: 'war_cc_d17', name: '控场·永锢', desc: '4转·伤害350%，60%眩晕2回合', cooldown: 9, dmgMult: 3.5, stunChance: 0.6, stunTurns: 2, mpCost: 56, zhuan: 4 },
            { id: 'war_cc_d18', name: '控场·灭世波', desc: '4转·群体160%伤害，30%眩晕2回合', cooldown: 9, aoe: true, aoePct: 1.6, stunChance: 0.3, stunTurns: 2, mpCost: 58, zhuan: 4 },
            { id: 'war_cc_d19', name: '控场·神罚', desc: '4转·群体25%伤害，60%眩晕2回合', cooldown: 8, aoe: true, aoePct: 0.25, stunChance: 0.70, stunTurns: 2, mpCost: 55, zhuan: 4 },
            { id: 'war_cc_d20', name: '控场·终焉', desc: '4转·群体170%伤害，35%眩晕1回合', cooldown: 10, aoe: true, aoePct: 1.7, stunChance: 0.35, stunTurns: 1, mpCost: 60, zhuan: 4 }
        ]
    },
    mage: {
        base: [
            { id: 'mage_fireball', name: '火球术', desc: '本次伤害215%（受技能伤害加成）', cooldown: 3, dmgMult: 2.15, useSkillDmg: true, mpCost: 16, zhuan: 1 },
            { id: 'mage_ice', name: '冰锥', desc: '本次伤害140%，50%眩晕1回合', cooldown: 3, dmgMult: 1.4, stunChance: 0.5, stunTurns: 1, mpCost: 14, zhuan: 1 },
            { id: 'mage_arcane', name: '奥术涌动', desc: '本次伤害170%，技能伤害+40%', cooldown: 4, dmgMult: 1.7, skillDmgBonus: 40, mpCost: 24, zhuan: 1 },
            { id: 'mage_meteor', name: '陨石', desc: '本次伤害250%', cooldown: 5, dmgMult: 2.5, mpCost: 30, zhuan: 1 },
            { id: 'mage_shield', name: '法力护盾', desc: '获得生命上限20%护盾', cooldown: 4, shieldPct: 0.2, mpCost: 22, zhuan: 1 },
            { id: 'mage_drain', name: '生命汲取', desc: '本次伤害120%，回复50%伤害生命', cooldown: 3, dmgMult: 1.2, lifestealPct: 0.5, mpCost: 20, zhuan: 1 },
            { id: 'mage_blizzard', name: '暴风雪', desc: '群体65%伤害', cooldown: 5, aoe: true, aoePct: 0.65, mpCost: 28, zhuan: 1 },
            { id: 'mage_mystery_transform', name: '奥秘变身', desc: '法师专属·临时增加3回合自身50%攻击、生命、防御（绑定技能，不可卸下）', cooldown: 6, buffAtkPct: 50, buffDefPct: 50, buffHpPct: 50, buffRounds: 3, mpCost: 30, zhuan: 1, boundSkill: true },
            { id: 'mage_tempt_light', name: '诱惑之光', desc: '法师专属·复制当前目标怪物为25%属性召唤兽（BOSS无法复制，场上仅能存在1只召唤兽，绑定技能不可卸下）', cooldown: 6, summonBeast: true, summonPct: 0.25, summonMax: 1, mpCost: 30, zhuan: 1, boundSkill: true, copyMonster: true }
        ],
        branchA: [
            { id: 'mage_chain', name: '闪电链', desc: '2转·群体90%伤害', cooldown: 4, aoe: true, aoePct: 0.9, mpCost: 28, zhuan: 2 },
            { id: 'mage_tide', name: '法力潮汐', desc: '2转·回复30%最大魔法，2回合技能伤害+25%', cooldown: 6, mpRegenPct: 0.3, skillDmgBonus: 25, mpCost: 8, zhuan: 2 },
            { id: 'mage_frost', name: '极寒新星', desc: '2转·伤害200%，55%眩晕1回合', cooldown: 5, dmgMult: 2, stunChance: 0.55, stunTurns: 1, mpCost: 32, zhuan: 2 },
            { id: 'mage_flamewave', name: '元素·烈焰波', desc: '2转·群体75%伤害', cooldown: 4, aoe: true, aoePct: 0.75, mpCost: 26, zhuan: 2 },
            { id: 'mage_icebind', name: '元素·冰缚', desc: '2转·伤害180%，60%眩晕1回合', cooldown: 4, dmgMult: 1.8, stunChance: 0.6, stunTurns: 1, mpCost: 28, zhuan: 2 },
            { id: 'mage_arcaneburst', name: '元素·奥术爆发', desc: '2转·伤害190%，技能伤害+30%', cooldown: 5, dmgMult: 1.9, skillDmgBonus: 30, mpCost: 30, zhuan: 2 },
            { id: 'mage_manashield', name: '元素·法力护壁', desc: '2转·获得25%生命护盾', cooldown: 5, shieldPct: 0.25, mpCost: 24, zhuan: 2 },
            { id: 'mage_golem', name: '奥术傀儡', desc: '3转·召唤傀儡(15%属性)协助作战，最多1个', cooldown: 10, summonBeast: true, summonPct: 0.15, summonMax: 1, summonName: '奥术傀儡', mpCost: 42, zhuan: 3 },
            { id: 'mage_inferno', name: '炼狱火', desc: '3转·群体80%伤害', cooldown: 6, aoe: true, aoePct: 0.8, dmgMult: 1.2, mpCost: 40, zhuan: 3 },
            { id: 'mage_mana', name: '奥术洪流', desc: '3转·伤害300%，技能伤害+50%', cooldown: 5, dmgMult: 3, skillDmgBonus: 50, mpCost: 38, zhuan: 3 },
            { id: 'mage_barrier', name: '元素护盾', desc: '3转·获得30%生命护盾', cooldown: 5, shieldPct: 0.3, mpCost: 32, zhuan: 3 },
            { id: 'mage_beam', name: '奥术光束', desc: '3转·本次伤害270%，无视20%魔抗', cooldown: 5, dmgMult: 2.7, ignoreDefPct: 20, mpCost: 40, zhuan: 3 },
            { id: 'mage_curse', name: '虚弱诅咒', desc: '3转·本次伤害150%，目标下回合受到伤害+20%', cooldown: 6, dmgMult: 1.5, mpCost: 34, zhuan: 3 },
            { id: 'mage_icewall', name: '冰墙', desc: '3转·获得25%生命护盾，50%眩晕攻击者1回合', cooldown: 6, shieldPct: 0.25, mpCost: 36, zhuan: 3 },
            { id: 'mage_nexus', name: '虚空裂隙', desc: '4转·群体130%伤害，40%眩晕1回合', cooldown: 8, aoe: true, aoePct: 1.3, stunChance: 0.4, stunTurns: 1, mpCost: 56, zhuan: 4 },
            { id: 'mage_blackhole', name: '黑洞', desc: '4转·群体110%伤害', cooldown: 8, aoe: true, aoePct: 1.1, dmgMult: 1.2, mpCost: 52, zhuan: 4 },
            { id: 'mage_world', name: '世界终结', desc: '4转·本次伤害400%', cooldown: 9, dmgMult: 4, mpCost: 58, zhuan: 4 },
            { id: 'mage_starfall', name: '星陨', desc: '4转·群体95%伤害，每命中一目标回复5%最大魔法', cooldown: 7, aoe: true, aoePct: 0.95, mpRegenPct: 0.05, mpCost: 50, zhuan: 4 },
            { id: 'mage_voidburst', name: '虚空爆裂', desc: '4转·本次伤害350%，无视40%魔抗', cooldown: 8, dmgMult: 3.5, ignoreDefPct: 40, mpCost: 54, zhuan: 4 },
            { id: 'mage_timestop', name: '时停', desc: '4转·群体80%伤害，60%眩晕2回合', cooldown: 9, aoe: true, aoePct: 0.8, stunChance: 0.6, stunTurns: 2, mpCost: 56, zhuan: 4 }
        ],
        branchB: [
            { id: 'mage_void', name: '虚空箭', desc: '2转·无视30%魔抗，伤害260%', cooldown: 4, dmgMult: 2.6, ignoreDefPct: 30, mpCost: 30, zhuan: 2 },
            { id: 'mage_missile', name: '奥术飞弹', desc: '2转·3次50%伤害', cooldown: 4, multiHit: 3, multiHitPct: 0.5, mpCost: 26, zhuan: 2 },
            { id: 'mage_flux', name: '奥术脉动', desc: '2转·本次伤害160%，下回合魔法回复+15点', cooldown: 5, dmgMult: 1.6, mpRegenFlat: 15, mpCost: 24, zhuan: 2 },
            { id: 'mage_voidtouch', name: '虚空·触须', desc: '2转·无视25%魔抗，伤害240%', cooldown: 4, dmgMult: 2.4, ignoreDefPct: 25, mpCost: 28, zhuan: 2 },
            { id: 'mage_abyssbolt', name: '虚空·深渊箭', desc: '2转·本次伤害220%，无视20%魔抗', cooldown: 3, dmgMult: 2.2, ignoreDefPct: 20, mpCost: 26, zhuan: 2 },
            { id: 'mage_rupture', name: '虚空·裂隙', desc: '2转·伤害200%，无视15%魔抗', cooldown: 4, dmgMult: 2, ignoreDefPct: 15, mpCost: 30, zhuan: 2 },
            { id: 'mage_darkbeam', name: '虚空·暗束', desc: '2转·本次伤害280%', cooldown: 5, dmgMult: 2.8, mpCost: 34, zhuan: 2 },
            { id: 'mage_voidgrasp', name: '虚空·握杀', desc: '3转·无视40%魔抗，伤害320%', cooldown: 5, dmgMult: 3.2, ignoreDefPct: 40, mpCost: 42, zhuan: 3 },
            { id: 'mage_oblivion', name: '虚空·湮灭', desc: '3转·本次伤害350%', cooldown: 6, dmgMult: 3.5, mpCost: 44, zhuan: 3 },
            { id: 'mage_entropy', name: '虚空·熵增', desc: '3转·伤害270%，无视35%魔抗', cooldown: 5, dmgMult: 2.7, ignoreDefPct: 35, mpCost: 40, zhuan: 3 },
            { id: 'mage_consumption', name: '虚空·吞噬', desc: '3转·伤害250%，回复40%伤害生命', cooldown: 5, dmgMult: 2.5, lifestealPct: 0.4, mpCost: 38, zhuan: 3 },
            { id: 'mage_nullify', name: '虚空·虚无', desc: '3转·本次伤害300%，技能伤害+40%', cooldown: 6, dmgMult: 3, skillDmgBonus: 40, mpCost: 46, zhuan: 3 },
            { id: 'mage_voidshield', name: '虚空·护膜', desc: '3转·获得20%生命护盾，下回合技能伤害+30%', cooldown: 6, shieldPct: 0.2, mpCost: 36, zhuan: 3 },
            { id: 'mage_collapse', name: '虚空·坍缩', desc: '3转·无视50%魔抗，伤害290%', cooldown: 6, dmgMult: 2.9, ignoreDefPct: 50, mpCost: 48, zhuan: 3 },
            { id: 'mage_voidend', name: '虚空终结', desc: '4转·本次伤害420%，无视45%魔抗', cooldown: 9, dmgMult: 4.2, ignoreDefPct: 45, mpCost: 60, zhuan: 4 },
            { id: 'mage_abyssal', name: '虚空·深渊', desc: '4转·伤害380%，无视50%魔抗', cooldown: 8, dmgMult: 3.8, ignoreDefPct: 50, mpCost: 56, zhuan: 4 },
            { id: 'mage_antimatter', name: '虚空·反物质', desc: '4转·本次伤害400%', cooldown: 9, dmgMult: 4, mpCost: 58, zhuan: 4 },
            { id: 'mage_voidstorm', name: '虚空风暴', desc: '4转·群体70%伤害，无视30%魔抗', cooldown: 8, aoe: true, aoePct: 0.7, ignoreDefPct: 30, mpCost: 54, zhuan: 4 },
            { id: 'mage_rift', name: '虚空·裂界', desc: '4转·本次伤害360%，无视55%魔抗', cooldown: 8, dmgMult: 3.6, ignoreDefPct: 55, mpCost: 52, zhuan: 4 },
            { id: 'mage_zeropoint', name: '虚空·奇点', desc: '4转·本次伤害450%', cooldown: 10, dmgMult: 4.5, mpCost: 62, zhuan: 4 }
        ],
        branchC: [
            { id: 'mage_heal_c1', name: '圣愈·治愈', desc: '2转·回复生命上限25%', cooldown: 4, healPct: 0.25, mpCost: 22, zhuan: 2 },
            { id: 'mage_heal_c2', name: '圣愈·护盾', desc: '2转·获得30%生命护盾', cooldown: 5, shieldPct: 0.3, mpCost: 26, zhuan: 2 },
            { id: 'mage_heal_c3', name: '圣愈·祝福', desc: '2转·2回合技能伤害+30%', cooldown: 6, skillDmgBonus: 30, buffRounds: 2, mpCost: 20, zhuan: 2 },
            { id: 'mage_heal_c4', name: '圣愈·疗伤', desc: '2转·伤害150%，回复40%伤害生命', cooldown: 4, dmgMult: 1.5, lifestealPct: 0.4, mpCost: 28, zhuan: 2 },
            { id: 'mage_heal_c5', name: '圣愈·圣盾', desc: '2转·获得28%生命护盾', cooldown: 4, shieldPct: 0.28, mpCost: 24, zhuan: 2 },
            { id: 'mage_heal_c6', name: '圣愈·复苏', desc: '2转·回复生命上限20%，2回合减伤15%', cooldown: 6, healPct: 0.2, reduceDmgPct: 15, buffRounds: 2, mpCost: 30, zhuan: 2 },
            { id: 'mage_heal_c7', name: '圣愈·光辉', desc: '2转·本次伤害170%，获得15%护盾', cooldown: 4, dmgMult: 1.7, shieldPct: 0.15, mpCost: 26, zhuan: 2 },
            { id: 'mage_heal_c8', name: '圣愈·大疗', desc: '3转·回复生命上限35%', cooldown: 6, healPct: 0.35, mpCost: 38, zhuan: 3 },
            { id: 'mage_heal_c9', name: '圣愈·圣域', desc: '3转·获得40%生命护盾', cooldown: 6, shieldPct: 0.4, mpCost: 42, zhuan: 3 },
            { id: 'mage_heal_c10', name: '圣愈·神恩', desc: '3转·3回合技能伤害+40%', cooldown: 8, skillDmgBonus: 40, buffRounds: 3, mpCost: 36, zhuan: 3 },
            { id: 'mage_heal_c11', name: '圣愈·救赎', desc: '3转·伤害200%，回复50%伤害生命', cooldown: 5, dmgMult: 2, lifestealPct: 0.5, mpCost: 40, zhuan: 3 },
            { id: 'mage_heal_c12', name: '圣愈·天护', desc: '3转·获得35%护盾，本回合减伤20%', cooldown: 6, shieldPct: 0.35, reduceDmgPct: 20, mpCost: 44, zhuan: 3 },
            { id: 'mage_heal_c13', name: '圣愈·圣光', desc: '3转·回复30%生命，2回合攻击+20%', cooldown: 7, healPct: 0.3, buffAtkPct: 20, buffRounds: 2, mpCost: 42, zhuan: 3 },
            { id: 'mage_heal_c14', name: '圣愈·庇佑', desc: '3转·获得38%生命护盾', cooldown: 5, shieldPct: 0.38, mpCost: 40, zhuan: 3 },
            { id: 'mage_heal_c15', name: '圣愈·神愈', desc: '4转·回复生命上限50%', cooldown: 9, healPct: 0.5, mpCost: 54, zhuan: 4 },
            { id: 'mage_heal_c16', name: '圣愈·神盾', desc: '4转·获得50%生命护盾', cooldown: 9, shieldPct: 0.5, mpCost: 56, zhuan: 4 },
            { id: 'mage_heal_c17', name: '圣愈·天恩', desc: '4转·4回合技能伤害+50%', cooldown: 10, skillDmgBonus: 50, buffRounds: 4, mpCost: 52, zhuan: 4 },
            { id: 'mage_heal_c18', name: '圣愈·涅槃', desc: '4转·伤害280%，回复60%伤害生命', cooldown: 8, dmgMult: 2.8, lifestealPct: 0.6, mpCost: 58, zhuan: 4 },
            { id: 'mage_heal_c19', name: '圣愈·永恒', desc: '4转·获得45%护盾，3回合减伤25%', cooldown: 10, shieldPct: 0.45, reduceDmgPct: 25, buffRounds: 3, mpCost: 60, zhuan: 4 },
            { id: 'mage_heal_c20', name: '圣愈·神迹', desc: '4转·回复45%生命并获得30%护盾', cooldown: 10, healPct: 0.45, shieldPct: 0.3, mpCost: 62, zhuan: 4 }
        ],
        branchD: [
            { id: 'mage_curse_d1', name: '诅咒·虚弱', desc: '2转·伤害170%，目标下回合受伤+25%', cooldown: 4, dmgMult: 1.7, mpCost: 26, zhuan: 2 },
            { id: 'mage_curse_d2', name: '诅咒·侵蚀', desc: '2转·伤害180%，无视20%魔抗', cooldown: 4, dmgMult: 1.8, ignoreDefPct: 20, mpCost: 28, zhuan: 2 },
            { id: 'mage_curse_d3', name: '诅咒·腐化', desc: '2转·伤害160%，目标受伤+20%', cooldown: 5, dmgMult: 1.6, mpCost: 24, zhuan: 2 },
            { id: 'mage_curse_d4', name: '诅咒·噬魂', desc: '2转·伤害200%，回复30%伤害生命', cooldown: 4, dmgMult: 2, lifestealPct: 0.3, mpCost: 30, zhuan: 2 },
            { id: 'mage_curse_d5', name: '诅咒·破魔', desc: '2转·无视25%魔抗，伤害220%', cooldown: 4, dmgMult: 2.2, ignoreDefPct: 25, mpCost: 32, zhuan: 2 },
            { id: 'mage_curse_d6', name: '诅咒·凋零', desc: '2转·伤害190%，目标受伤+15%', cooldown: 5, dmgMult: 1.9, mpCost: 28, zhuan: 2 },
            { id: 'mage_curse_d7', name: '诅咒·暗蚀', desc: '2转·群体60%伤害', cooldown: 5, aoe: true, aoePct: 0.6, mpCost: 30, zhuan: 2 },
            { id: 'mage_curse_d8', name: '诅咒·魂灭', desc: '3转·伤害260%，目标受伤+25%', cooldown: 5, dmgMult: 2.6, mpCost: 40, zhuan: 3 },
            { id: 'mage_curse_d9', name: '诅咒·破抗', desc: '3转·无视40%魔抗，伤害280%', cooldown: 5, dmgMult: 2.8, ignoreDefPct: 40, mpCost: 42, zhuan: 3 },
            { id: 'mage_curse_d10', name: '诅咒·噬灵', desc: '3转·伤害240%，回复45%伤害生命', cooldown: 5, dmgMult: 2.4, lifestealPct: 0.45, mpCost: 44, zhuan: 3 },
            { id: 'mage_curse_d11', name: '诅咒·群蚀', desc: '3转·群体75%伤害', cooldown: 6, aoe: true, aoePct: 0.75, mpCost: 38, zhuan: 3 },
            { id: 'mage_curse_d12', name: '诅咒·崩解', desc: '3转·伤害270%，无视35%魔抗', cooldown: 6, dmgMult: 2.7, ignoreDefPct: 35, mpCost: 46, zhuan: 3 },
            { id: 'mage_curse_d13', name: '诅咒·死咒', desc: '3转·伤害250%，目标受伤+30%', cooldown: 6, dmgMult: 2.5, mpCost: 42, zhuan: 3 },
            { id: 'mage_curse_d14', name: '诅咒·暗潮', desc: '3转·群体70%伤害，无视15%魔抗', cooldown: 6, aoe: true, aoePct: 0.7, ignoreDefPct: 15, mpCost: 40, zhuan: 3 },
            { id: 'mage_curse_d15', name: '诅咒·灭魂', desc: '4转·伤害350%，目标受伤+35%', cooldown: 8, dmgMult: 3.5, mpCost: 56, zhuan: 4 },
            { id: 'mage_curse_d16', name: '诅咒·破界', desc: '4转·无视50%魔抗，伤害320%', cooldown: 8, dmgMult: 3.2, ignoreDefPct: 50, mpCost: 58, zhuan: 4 },
            { id: 'mage_curse_d17', name: '诅咒·终焉', desc: '4转·群体90%伤害', cooldown: 8, aoe: true, aoePct: 0.9, mpCost: 54, zhuan: 4 },
            { id: 'mage_curse_d18', name: '诅咒·噬神', desc: '4转·伤害380%，回复50%伤害生命', cooldown: 9, dmgMult: 3.8, lifestealPct: 0.5, mpCost: 60, zhuan: 4 },
            { id: 'mage_curse_d19', name: '诅咒·虚空蚀', desc: '4转·无视55%魔抗，伤害340%', cooldown: 9, dmgMult: 3.4, ignoreDefPct: 55, mpCost: 62, zhuan: 4 },
            { id: 'mage_curse_d20', name: '诅咒·灭世', desc: '4转·群体100%伤害，无视30%魔抗', cooldown: 10, aoe: true, aoePct: 1, ignoreDefPct: 30, mpCost: 60, zhuan: 4 }
        ]
    },
    archer: {
        base: [
            { id: 'archer_precise', name: '精准射击', desc: '必暴击，本次伤害140%', cooldown: 2, forceCrit: true, dmgMult: 1.4, mpCost: 12, zhuan: 1 },
            { id: 'archer_multi', name: '多重箭', desc: '2次85%伤害（独立暴击/连击）', cooldown: 3, multiHit: 2, multiHitPct: 0.85, mpCost: 18, zhuan: 1 },
            { id: 'archer_wind', name: '疾风步', desc: '本回合闪避+30%', cooldown: 4, dodgeBonus: 30, mpCost: 20, zhuan: 1 },
            { id: 'archer_poison', name: '毒箭', desc: '本次伤害130%，50%眩晕1回合', cooldown: 3, dmgMult: 1.3, stunChance: 0.5, stunTurns: 1, mpCost: 16, zhuan: 1 },
            { id: 'archer_rain', name: '箭雨', desc: '3次60%伤害', cooldown: 4, multiHit: 3, multiHitPct: 0.6, mpCost: 24, zhuan: 1 },
            { id: 'archer_aim', name: '弱点射击', desc: '必暴击，本次伤害180%', cooldown: 5, forceCrit: true, dmgMult: 1.8, mpCost: 28, zhuan: 1 },
            { id: 'archer_scatter', name: '散射', desc: '群体60%伤害', cooldown: 4, aoe: true, aoePct: 0.6, mpCost: 22, zhuan: 1 },
            { id: 'archer_wolf', name: '召唤·狩魂灵狼', desc: '1转·召唤灵狼(92%属性)，场上召唤物最多4只', cooldown: 4, summonBeast: true, summonPct: 0.9152, summonName: '狩魂灵狼', archerSummon: true, mpCost: 20, zhuan: 1 },
            { id: 'archer_trap_bind', name: '捕兽夹', desc: '射手专属·释放技能有50%几率眩晕敌人2回合，冷却6回合（绑定技能，不可卸下）', cooldown: 6, dmgMult: 0, stunChance: 0.5, stunTurns: 2, mpCost: 20, zhuan: 1, boundSkill: true }
        ],
        branchA: [
            { id: 'archer_storm', name: '风暴箭', desc: '2转·群体75%伤害', cooldown: 5, aoe: true, aoePct: 0.75, mpCost: 28, zhuan: 2 },
            { id: 'archer_pierce', name: '穿透箭', desc: '2转·无视50%防御，伤害160%', cooldown: 4, ignoreDefPct: 50, dmgMult: 1.6, mpCost: 26, zhuan: 2 },
            { id: 'archer_shadow', name: '暗影步', desc: '2转·本回合闪避+50%', cooldown: 5, dodgeBonus: 50, mpCost: 26, zhuan: 2 },
            { id: 'archer_beast', name: '召唤·幽冥战兽', desc: '2转·召唤战兽(116%属性)，场上最多4只', cooldown: 5, summonBeast: true, summonPct: 1.1648, summonName: '幽冥战兽', archerSummon: true, mpCost: 30, zhuan: 2 },
            { id: 'archer_windarrow', name: '风之箭', desc: '2转·群体65%伤害，本回合闪避+15%', cooldown: 5, aoe: true, aoePct: 0.65, dodgeBonus: 15, mpCost: 28, zhuan: 2 },
            { id: 'archer_ambush', name: '伏击', desc: '2转·本次伤害190%，50%眩晕1回合', cooldown: 4, dmgMult: 1.9, stunChance: 0.5, stunTurns: 1, mpCost: 30, zhuan: 2 },
            { id: 'archer_soularrow', name: '狩魂·魂箭', desc: '2转·群体70%伤害', cooldown: 4, aoe: true, aoePct: 0.7, mpCost: 26, zhuan: 2 },
            { id: 'archer_snipe', name: '狙杀', desc: '3转·必暴击，伤害250%', cooldown: 6, forceCrit: true, dmgMult: 2.5, mpCost: 38, zhuan: 3 },
            { id: 'archer_barrage', name: '弹幕', desc: '3转·4次70%伤害', cooldown: 5, multiHit: 4, multiHitPct: 0.7, mpCost: 36, zhuan: 3 },
            { id: 'archer_trap', name: '冰霜陷阱', desc: '3转·伤害180%，60%眩晕2回合', cooldown: 5, dmgMult: 1.8, stunChance: 0.6, stunTurns: 2, mpCost: 34, zhuan: 3 },
            { id: 'archer_phantom', name: '召唤·寂灭影狩', desc: '3转·召唤影狩(146%属性)，场上最多4只', cooldown: 6, summonBeast: true, summonPct: 1.456, summonName: '寂灭影狩', archerSummon: true, mpCost: 38, zhuan: 3 },
            { id: 'archer_heartseeker', name: '穿心', desc: '3转·无视40%防御，伤害230%', cooldown: 5, ignoreDefPct: 40, dmgMult: 2.3, mpCost: 40, zhuan: 3 },
            { id: 'archer_ghost', name: '鬼步', desc: '3转·本回合闪避+60%', cooldown: 6, dodgeBonus: 60, mpCost: 32, zhuan: 3 },
            { id: 'archer_rapid', name: '疾射', desc: '3转·5次55%伤害', cooldown: 5, multiHit: 5, multiHitPct: 0.55, mpCost: 38, zhuan: 3 },
            { id: 'archer_rainstorm', name: '箭雨风暴', desc: '4转·群体100%伤害', cooldown: 7, aoe: true, aoePct: 1, dmgMult: 1.1, mpCost: 46, zhuan: 4 },
            { id: 'archer_death', name: '死亡标记', desc: '4转·必暴击，伤害320%', cooldown: 8, forceCrit: true, dmgMult: 3.2, mpCost: 50, zhuan: 4 },
            { id: 'archer_eternal', name: '召唤·万兽朝宗', desc: '4转·召唤至尊兽灵(175%属性)，场上最多4只', cooldown: 8, summonBeast: true, summonPct: 1.7472, summonName: '万兽朝宗', archerSummon: true, mpCost: 48, zhuan: 4 },
            { id: 'archer_typhoon', name: '飓风箭', desc: '4转·群体110%伤害', cooldown: 7, aoe: true, aoePct: 1.1, dmgMult: 1, mpCost: 48, zhuan: 4 },
            { id: 'archer_phantomrain', name: '幻影箭雨', desc: '4转·6次55%伤害', cooldown: 8, multiHit: 6, multiHitPct: 0.55, mpCost: 52, zhuan: 4 }
        ],
        branchB: [
            { id: 'archer_marksman', name: '神射', desc: '2转·必暴击，本次伤害200%', cooldown: 5, forceCrit: true, dmgMult: 2, mpCost: 30, zhuan: 2 },
            { id: 'archer_precision', name: '神射·精准', desc: '2转·必暴击，伤害185%', cooldown: 4, forceCrit: true, dmgMult: 1.85, mpCost: 26, zhuan: 2 },
            { id: 'archer_armorbreak', name: '神射·破甲', desc: '2转·无视40%防御，伤害170%', cooldown: 4, ignoreDefPct: 40, dmgMult: 1.7, mpCost: 28, zhuan: 2 },
            { id: 'archer_critstrike', name: '神射·致命', desc: '2转·必暴击，伤害210%', cooldown: 5, forceCrit: true, dmgMult: 2.1, mpCost: 32, zhuan: 2 },
            { id: 'archer_steady', name: '神射·稳射', desc: '2转·本次伤害195%，无视25%防御', cooldown: 4, dmgMult: 1.95, ignoreDefPct: 25, mpCost: 28, zhuan: 2 },
            { id: 'archer_quickdraw', name: '神射·快拔', desc: '2转·必暴击，伤害175%', cooldown: 3, forceCrit: true, dmgMult: 1.75, mpCost: 24, zhuan: 2 },
            { id: 'archer_piercing', name: '神射·贯穿', desc: '2转·无视35%防御，伤害190%', cooldown: 4, ignoreDefPct: 35, dmgMult: 1.9, mpCost: 30, zhuan: 2 },
            { id: 'archer_headshot', name: '神射·爆头', desc: '3转·必暴击，伤害280%', cooldown: 6, forceCrit: true, dmgMult: 2.8, mpCost: 40, zhuan: 3 },
            { id: 'archer_sunder', name: '神射·裂甲', desc: '3转·无视55%防御，伤害250%', cooldown: 5, ignoreDefPct: 55, dmgMult: 2.5, mpCost: 42, zhuan: 3 },
            { id: 'archer_truehit', name: '神射·真击', desc: '3转·必暴击，伤害260%', cooldown: 5, forceCrit: true, dmgMult: 2.6, mpCost: 38, zhuan: 3 },
            { id: 'archer_weakpoint', name: '神射·弱点', desc: '3转·无视45%防御，伤害270%', cooldown: 6, ignoreDefPct: 45, dmgMult: 2.7, mpCost: 44, zhuan: 3 },
            { id: 'archer_deadeye', name: '神射·死眼', desc: '3转·必暴击，伤害290%', cooldown: 6, forceCrit: true, dmgMult: 2.9, mpCost: 46, zhuan: 3 },
            { id: 'archer_penetrate', name: '神射·穿透', desc: '3转·无视50%防御，伤害240%', cooldown: 5, ignoreDefPct: 50, dmgMult: 2.4, mpCost: 40, zhuan: 3 },
            { id: 'archer_finisher', name: '神射·终结', desc: '3转·必暴击，目标生命低于50%时伤害+30%', cooldown: 6, forceCrit: true, dmgMult: 2.5, mpCost: 44, zhuan: 3 },
            { id: 'archer_execute', name: '处决', desc: '4转·必暴击，伤害360%，目标生命低于30%时+50%', cooldown: 9, forceCrit: true, dmgMult: 3.6, mpCost: 54, zhuan: 4 },
            { id: 'archer_apocalypse', name: '神射·天罚', desc: '4转·必暴击，伤害340%', cooldown: 8, forceCrit: true, dmgMult: 3.4, mpCost: 52, zhuan: 4 },
            { id: 'archer_armorshatter', name: '神射·碎甲', desc: '4转·无视60%防御，伤害320%', cooldown: 8, ignoreDefPct: 60, dmgMult: 3.2, mpCost: 54, zhuan: 4 },
            { id: 'archer_judgment', name: '神射·审判', desc: '4转·必暴击，伤害380%', cooldown: 9, forceCrit: true, dmgMult: 3.8, mpCost: 58, zhuan: 4 },
            { id: 'archer_obliterate', name: '神射·湮灭', desc: '4转·无视65%防御，伤害350%', cooldown: 9, ignoreDefPct: 65, dmgMult: 3.5, mpCost: 56, zhuan: 4 },
            { id: 'archer_godshot', name: '神射·天诛', desc: '4转·必暴击，伤害400%', cooldown: 10, forceCrit: true, dmgMult: 4, mpCost: 60, zhuan: 4 }
        ],
        branchC: [
            { id: 'archer_trap_c1', name: '陷阱·冰刺', desc: '2转·伤害170%，42%眩晕1回合', cooldown: 4, dmgMult: 1.7, stunChance: 0.42, stunTurns: 1, mpCost: 26, zhuan: 2 },
            { id: 'archer_trap_c2', name: '陷阱·毒', desc: '2转·伤害160%，45%眩晕1回合', cooldown: 4, dmgMult: 1.6, stunChance: 0.45, stunTurns: 1, mpCost: 24, zhuan: 2 },
            { id: 'archer_trap_c3', name: '陷阱·雷', desc: '2转·伤害180%，35%眩晕2回合', cooldown: 5, dmgMult: 1.8, stunChance: 0.35, stunTurns: 2, mpCost: 30, zhuan: 2 },
            { id: 'archer_trap_c4', name: '陷阱·定身', desc: '2转·伤害150%，50%眩晕1回合', cooldown: 4, dmgMult: 1.5, stunChance: 0.5, stunTurns: 1, mpCost: 28, zhuan: 2 },
            { id: 'archer_trap_c5', name: '陷阱·缚足', desc: '2转·群体55%伤害，30%眩晕1回合', cooldown: 5, aoe: true, aoePct: 0.55, stunChance: 0.3, stunTurns: 1, mpCost: 32, zhuan: 2 },
            { id: 'archer_trap_c6', name: '陷阱·麻痹', desc: '2转·伤害190%，40%眩晕2回合', cooldown: 5, dmgMult: 1.9, stunChance: 0.4, stunTurns: 2, mpCost: 34, zhuan: 2 },
            { id: 'archer_trap_c7', name: '陷阱·刺网', desc: '2转·群体60%伤害，25%眩晕1回合', cooldown: 5, aoe: true, aoePct: 0.6, stunChance: 0.25, stunTurns: 1, mpCost: 30, zhuan: 2 },
            { id: 'archer_trap_c8', name: '陷阱·冰牢', desc: '3转·伤害220%，50%眩晕2回合', cooldown: 6, dmgMult: 2.2, stunChance: 0.50, stunTurns: 2, mpCost: 40, zhuan: 3 },
            { id: 'archer_trap_c9', name: '陷阱·毒沼', desc: '3转·群体70%伤害，35%眩晕1回合', cooldown: 6, aoe: true, aoePct: 0.7, stunChance: 0.35, stunTurns: 1, mpCost: 42, zhuan: 3 },
            { id: 'archer_trap_c10', name: '陷阱·雷域', desc: '3转·伤害200%，40%眩晕2回合', cooldown: 6, dmgMult: 2, stunChance: 0.40, stunTurns: 2, mpCost: 44, zhuan: 3 },
            { id: 'archer_trap_c11', name: '陷阱·锁魂', desc: '3转·伤害230%，55%眩晕1回合', cooldown: 5, dmgMult: 2.3, stunChance: 0.55, stunTurns: 1, mpCost: 46, zhuan: 3 },
            { id: 'archer_trap_c12', name: '陷阱·冰霜', desc: '3转·群体65%伤害，35%眩晕1回合', cooldown: 6, aoe: true, aoePct: 0.65, stunChance: 0.35, stunTurns: 1, mpCost: 40, zhuan: 3 },
            { id: 'archer_trap_c13', name: '陷阱·缚灵', desc: '3转·伤害210%，45%眩晕2回合', cooldown: 6, dmgMult: 2.1, stunChance: 0.45, stunTurns: 2, mpCost: 42, zhuan: 3 },
            { id: 'archer_trap_c14', name: '陷阱·震爆', desc: '3转·群体80%伤害，35%眩晕2回合', cooldown: 7, aoe: true, aoePct: 0.8, stunChance: 0.35, stunTurns: 2, mpCost: 48, zhuan: 3 },
            { id: 'archer_trap_c15', name: '陷阱·永冻', desc: '4转·伤害280%，65%眩晕2回合', cooldown: 8, dmgMult: 2.8, stunChance: 0.65, stunTurns: 2, mpCost: 54, zhuan: 4 },
            { id: 'archer_trap_c16', name: '陷阱·天罗', desc: '4转·群体90%伤害，55%眩晕1回合', cooldown: 8, aoe: true, aoePct: 0.9, stunChance: 0.55, stunTurns: 1, mpCost: 56, zhuan: 4 },
            { id: 'archer_trap_c17', name: '陷阱·灭魂', desc: '4转·伤害300%，60%眩晕2回合', cooldown: 9, dmgMult: 3, stunChance: 0.60, stunTurns: 2, mpCost: 58, zhuan: 4 },
            { id: 'archer_trap_c18', name: '陷阱·神缚', desc: '4转·群体85%伤害，60%眩晕2回合', cooldown: 9, aoe: true, aoePct: 0.60, stunChance: 0.7, stunTurns: 2, mpCost: 60, zhuan: 4 },
            { id: 'archer_trap_c19', name: '陷阱·绝境', desc: '4转·伤害260%，70%眩晕2回合', cooldown: 8, dmgMult: 2.6, stunChance: 0.70, stunTurns: 2, mpCost: 55, zhuan: 4 },
            { id: 'archer_trap_c20', name: '陷阱·终焉', desc: '4转·群体100%伤害，50%眩晕2回合', cooldown: 10, aoe: true, aoePct: 1, stunChance: 0.50, stunTurns: 2, mpCost: 62, zhuan: 4 }
        ],
        branchD: [
            { id: 'archer_wind_d1', name: '疾风·双箭', desc: '2转·2次90%伤害', cooldown: 3, multiHit: 2, multiHitPct: 0.9, mpCost: 22, zhuan: 2 },
            { id: 'archer_wind_d2', name: '疾风·闪避', desc: '2转·本回合闪避+45%', cooldown: 4, dodgeBonus: 45, mpCost: 24, zhuan: 2 },
            { id: 'archer_wind_d3', name: '疾风·三连', desc: '2转·3次70%伤害', cooldown: 4, multiHit: 3, multiHitPct: 0.7, mpCost: 26, zhuan: 2 },
            { id: 'archer_wind_d4', name: '疾风·影步', desc: '2转·本回合闪避+55%', cooldown: 5, dodgeBonus: 55, mpCost: 28, zhuan: 2 },
            { id: 'archer_wind_d5', name: '疾风·四连', desc: '2转·4次65%伤害', cooldown: 5, multiHit: 4, multiHitPct: 0.65, mpCost: 30, zhuan: 2 },
            { id: 'archer_wind_d6', name: '疾风·瞬射', desc: '2转·2次95%伤害', cooldown: 3, multiHit: 2, multiHitPct: 0.95, mpCost: 28, zhuan: 2 },
            { id: 'archer_wind_d7', name: '疾风·风步', desc: '2转·本回合闪避+50%，下次攻击+15%', cooldown: 5, dodgeBonus: 50, mpCost: 26, zhuan: 2 },
            { id: 'archer_wind_d8', name: '疾风·五连', desc: '3转·5次60%伤害', cooldown: 5, multiHit: 5, multiHitPct: 0.6, mpCost: 38, zhuan: 3 },
            { id: 'archer_wind_d9', name: '疾风·幻步', desc: '3转·本回合闪避+65%', cooldown: 6, dodgeBonus: 65, mpCost: 36, zhuan: 3 },
            { id: 'archer_wind_d10', name: '疾风·六连', desc: '3转·6次55%伤害', cooldown: 6, multiHit: 6, multiHitPct: 0.55, mpCost: 42, zhuan: 3 },
            { id: 'archer_wind_d11', name: '疾风·神行', desc: '3转·本回合闪避+70%', cooldown: 6, dodgeBonus: 70, mpCost: 40, zhuan: 3 },
            { id: 'archer_wind_d12', name: '疾风·七连', desc: '3转·7次50%伤害', cooldown: 6, multiHit: 7, multiHitPct: 0.5, mpCost: 44, zhuan: 3 },
            { id: 'archer_wind_d13', name: '疾风·无影', desc: '3转·3次85%伤害', cooldown: 4, multiHit: 3, multiHitPct: 0.85, mpCost: 40, zhuan: 3 },
            { id: 'archer_wind_d14', name: '疾风·鬼步', desc: '3转·本回合闪避+75%', cooldown: 7, dodgeBonus: 75, mpCost: 46, zhuan: 3 },
            { id: 'archer_wind_d15', name: '疾风·八连', desc: '4转·8次55%伤害', cooldown: 8, multiHit: 8, multiHitPct: 0.55, mpCost: 52, zhuan: 4 },
            { id: 'archer_wind_d16', name: '疾风·九天', desc: '4转·本回合闪避+80%', cooldown: 8, dodgeBonus: 80, mpCost: 50, zhuan: 4 },
            { id: 'archer_wind_d17', name: '疾风·十连', desc: '4转·10次45%伤害', cooldown: 9, multiHit: 10, multiHitPct: 0.45, mpCost: 56, zhuan: 4 },
            { id: 'archer_wind_d18', name: '疾风·神影', desc: '4转·本回合闪避+85%', cooldown: 9, dodgeBonus: 85, mpCost: 54, zhuan: 4 },
            { id: 'archer_wind_d19', name: '疾风·万箭', desc: '4转·群体80%伤害', cooldown: 8, aoe: true, aoePct: 0.8, mpCost: 55, zhuan: 4 },
            { id: 'archer_wind_d20', name: '疾风·无极', desc: '4转·12次40%伤害', cooldown: 10, multiHit: 12, multiHitPct: 0.4, mpCost: 60, zhuan: 4 }
        ]
    },
    tamer: {
        base: [
            { id: 'tamer_fury', name: '野兽之怒', desc: '宠物攻击+18%，持续3回合', cooldown: 3, petAtkPct: 18, buffRounds: 3, mpCost: 14, zhuan: 1 },
            { id: 'tamer_pact', name: '坚韧契约', desc: '宠物生命+16%，持续3回合', cooldown: 3, petHpPct: 16, buffRounds: 3, mpCost: 14, zhuan: 1 },
            { id: 'tamer_claw', name: '利爪', desc: '本次伤害150%，宠物攻击+14%持续2回合', cooldown: 2, dmgMult: 1.5, petAtkPct: 14, buffRounds: 2, mpCost: 12, zhuan: 1 },
            { id: 'tamer_call', name: '野性呼唤', desc: '宠物攻击+16%、防御+12%，持续3回合', cooldown: 4, petAtkPct: 16, petDefPct: 12, buffRounds: 3, mpCost: 20, zhuan: 1 },
            { id: 'tamer_heal', name: '治疗宠物', desc: '回复出战宠物22%最大生命', cooldown: 4, healPetPct: 0.22, mpCost: 18, zhuan: 1 },
            { id: 'tamer_lead', name: '兽群领袖', desc: '宠物攻击+22%，持续2回合', cooldown: 3, petAtkPct: 22, buffRounds: 2, mpCost: 16, zhuan: 1 },
            { id: 'tamer_guard', name: '护主', desc: '宠物防御+18%，持续3回合', cooldown: 3, petDefPct: 18, buffRounds: 3, mpCost: 14, zhuan: 1 },
            { id: 'tamer_aura', name: '兽威', desc: '本次伤害140%，宠物攻击+20%持续2回合', cooldown: 3, dmgMult: 1.4, petAtkPct: 20, buffRounds: 2, mpCost: 16, zhuan: 1 },
            { id: 'tamer_revive_pet', name: '复活宠物', desc: '驯兽师专属·复活一只已出战的死亡宠物（绑定技能，冷却6回合）', cooldown: 6, reviveDeployedPet: true, mpCost: 0, zhuan: 1, boundSkill: true }
        ],
        branchA: [
            { id: 'tamer_a_slash', name: '御兽·撕咬', desc: '2转·伤害165%，宠物攻击+26%持续2回合', cooldown: 3, dmgMult: 1.65, petAtkPct: 26, buffRounds: 2, mpCost: 22, zhuan: 2 },
            { id: 'tamer_a_ferocity', name: '御兽·凶性', desc: '2转·宠物攻击+30%，持续3回合', cooldown: 4, petAtkPct: 30, buffRounds: 3, mpCost: 26, zhuan: 2 },
            { id: 'tamer_a_break', name: '御兽·破甲', desc: '2转·本次无视35%防御，宠物攻击+18%持续2回合', cooldown: 4, ignoreDefPct: 35, petAtkPct: 18, buffRounds: 2, mpCost: 24, zhuan: 2 },
            { id: 'tamer_a_roar', name: '御兽·咆哮', desc: '2转·伤害175%，宠物攻击+28%持续3回合', cooldown: 5, dmgMult: 1.75, petAtkPct: 28, buffRounds: 3, mpCost: 28, zhuan: 2 },
            { id: 'tamer_a_fang', name: '御兽·利齿', desc: '2转·宠物攻击+32%，持续2回合', cooldown: 3, petAtkPct: 32, buffRounds: 2, mpCost: 24, zhuan: 2 },
            { id: 'tamer_a_blood', name: '御兽·嗜血', desc: '2转·伤害190%+宠物攻击+22%持续3回合', cooldown: 4, dmgMult: 1.9, petAtkPct: 22, buffRounds: 3, mpCost: 26, zhuan: 2 },
            { id: 'tamer_a_savage', name: '御兽·野蛮', desc: '2转·宠物攻击+36%，持续3回合', cooldown: 5, petAtkPct: 36, buffRounds: 3, mpCost: 30, zhuan: 2 },
            { id: 'tamer_a_maul', name: '御兽·猛扑', desc: '3转·伤害250%，宠物攻击+35%持续3回合', cooldown: 5, dmgMult: 2.5, petAtkPct: 35, buffRounds: 3, mpCost: 36, zhuan: 3 },
            { id: 'tamer_a_rage', name: '御兽·狂怒', desc: '3转·宠物攻击+46%，持续3回合', cooldown: 6, petAtkPct: 46, buffRounds: 3, mpCost: 40, zhuan: 3 },
            { id: 'tamer_a_rend', name: '御兽·撕裂', desc: '3转·无视45%防御，宠物攻击+30%持续2回合', cooldown: 4, ignoreDefPct: 45, petAtkPct: 30, buffRounds: 2, mpCost: 34, zhuan: 3 },
            { id: 'tamer_a_alpha', name: '御兽·兽王', desc: '3转·伤害230%，宠物攻击+42%持续4回合', cooldown: 6, dmgMult: 2.3, petAtkPct: 42, buffRounds: 4, mpCost: 42, zhuan: 3 },
            { id: 'tamer_a_titan', name: '御兽·泰坦', desc: '3转·宠物攻击+52%，持续4回合', cooldown: 7, petAtkPct: 52, buffRounds: 4, mpCost: 44, zhuan: 3 },
            { id: 'tamer_a_onslaught', name: '御兽·碾压', desc: '4转·伤害310%，宠物攻击+50%持续3回合', cooldown: 7, dmgMult: 3.1, petAtkPct: 50, buffRounds: 3, mpCost: 48, zhuan: 4 },
            { id: 'tamer_a_tyrant', name: '御兽·暴君', desc: '4转·宠物攻击+62%，持续4回合', cooldown: 8, petAtkPct: 62, buffRounds: 4, mpCost: 52, zhuan: 4 },
            { id: 'tamer_a_apocalypse', name: '御兽·万兽朝宗', desc: '4转·伤害280%，宠物攻击+58%持续5回合', cooldown: 9, dmgMult: 2.8, petAtkPct: 58, buffRounds: 5, mpCost: 56, zhuan: 4 }
        ],
        branchB: [
            { id: 'tamer_b_shell', name: '护主·龟甲', desc: '2转·宠物防御+26%，持续3回合', cooldown: 3, petDefPct: 26, buffRounds: 3, mpCost: 22, zhuan: 2 },
            { id: 'tamer_b_vital', name: '护主·生机', desc: '2转·宠物生命+22%，持续3回合', cooldown: 3, petHpPct: 22, buffRounds: 3, mpCost: 22, zhuan: 2 },
            { id: 'tamer_b_ward', name: '护主·护盾', desc: '2转·宠物防御+22%、生命+16%，持续3回合', cooldown: 4, petDefPct: 22, petHpPct: 16, buffRounds: 3, mpCost: 26, zhuan: 2 },
            { id: 'tamer_b_heal2', name: '护主·治愈', desc: '2转·回复出战宠物32%最大生命', cooldown: 4, healPetPct: 0.32, mpCost: 24, zhuan: 2 },
            { id: 'tamer_b_fortress', name: '护主·壁垒', desc: '2转·宠物防御+30%，持续3回合', cooldown: 4, petDefPct: 30, buffRounds: 3, mpCost: 28, zhuan: 2 },
            { id: 'tamer_b_life', name: '护主·生命', desc: '2转·宠物生命+26%，持续3回合', cooldown: 4, petHpPct: 26, buffRounds: 3, mpCost: 26, zhuan: 2 },
            { id: 'tamer_b_guardian', name: '护主·守护', desc: '2转·宠物防御+18%、生命+22%，持续4回合', cooldown: 5, petDefPct: 18, petHpPct: 22, buffRounds: 4, mpCost: 30, zhuan: 2 },
            { id: 'tamer_b_bulwark', name: '护主·铁壁', desc: '3转·宠物防御+38%，持续4回合', cooldown: 5, petDefPct: 38, buffRounds: 4, mpCost: 36, zhuan: 3 },
            { id: 'tamer_b_vigor', name: '护主·活力', desc: '3转·宠物生命+34%，持续4回合', cooldown: 5, petHpPct: 34, buffRounds: 4, mpCost: 36, zhuan: 3 },
            { id: 'tamer_b_heal3', name: '护主·大治愈', desc: '3转·回复出战宠物45%最大生命', cooldown: 5, healPetPct: 0.45, mpCost: 34, zhuan: 3 },
            { id: 'tamer_b_tower', name: '护主·坚城', desc: '3转·宠物防御+28%、生命+28%，持续4回合', cooldown: 6, petDefPct: 28, petHpPct: 28, buffRounds: 4, mpCost: 40, zhuan: 3 },
            { id: 'tamer_b_immortal', name: '护主·不灭', desc: '3转·宠物防御+42%、生命+26%，持续4回合', cooldown: 6, petDefPct: 42, petHpPct: 26, buffRounds: 4, mpCost: 42, zhuan: 3 },
            { id: 'tamer_b_sanctuary', name: '护主·圣所', desc: '4转·宠物防御+50%、生命+38%，持续5回合', cooldown: 7, petDefPct: 50, petHpPct: 38, buffRounds: 5, mpCost: 48, zhuan: 4 },
            { id: 'tamer_b_heal4', name: '护主·神愈', desc: '4转·回复出战宠物60%最大生命', cooldown: 6, healPetPct: 0.6, mpCost: 46, zhuan: 4 },
            { id: 'tamer_b_eternal', name: '护主·永恒', desc: '4转·宠物防御+58%、生命+46%，持续5回合', cooldown: 8, petDefPct: 58, petHpPct: 46, buffRounds: 5, mpCost: 54, zhuan: 4 }
        ],
        branchC: [
            { id: 'tamer_c_pack', name: '兽群·集结', desc: '2转·宠物攻+16%、防+16%、生命+16%持续3回合', cooldown: 4, petAtkPct: 16, petDefPct: 16, petHpPct: 16, buffRounds: 3, mpCost: 26, zhuan: 2 },
            { id: 'tamer_c_chorus', name: '兽群·共鸣', desc: '2转·宠物攻击+18%、防御+18%持续3回合', cooldown: 4, petAtkPct: 18, petDefPct: 18, buffRounds: 3, mpCost: 28, zhuan: 2 },
            { id: 'tamer_c_chain', name: '兽群·连携', desc: '2转·伤害165%，宠物攻防+14%持续3回合', cooldown: 3, dmgMult: 1.65, petAtkPct: 14, petDefPct: 14, buffRounds: 3, mpCost: 24, zhuan: 2 },
            { id: 'tamer_c_howl', name: '兽群·群嚎', desc: '2转·宠物攻击+22%、生命+18%持续3回合', cooldown: 5, petAtkPct: 22, petHpPct: 18, buffRounds: 3, mpCost: 30, zhuan: 2 },
            { id: 'tamer_c_swarm', name: '兽群·蜂拥', desc: '2转·宠物攻+20%、防+20%持续3回合', cooldown: 4, petAtkPct: 20, petDefPct: 20, buffRounds: 3, mpCost: 28, zhuan: 2 },
            { id: 'tamer_c_bond', name: '兽群·羁绊', desc: '2转·宠物生命+22%、防御+18%持续4回合', cooldown: 5, petHpPct: 22, petDefPct: 18, buffRounds: 4, mpCost: 30, zhuan: 2 },
            { id: 'tamer_c_legion', name: '兽群·军团', desc: '2转·宠物攻防生命各+18%持续4回合', cooldown: 6, petAtkPct: 18, petDefPct: 18, petHpPct: 18, buffRounds: 4, mpCost: 34, zhuan: 2 },
            { id: 'tamer_c_unity', name: '兽群·一心', desc: '3转·宠物攻+26%、防+26%、生命+22%持续4回合', cooldown: 5, petAtkPct: 26, petDefPct: 26, petHpPct: 22, buffRounds: 4, mpCost: 38, zhuan: 3 },
            { id: 'tamer_c_heal', name: '兽群·群疗', desc: '3转·回复出战宠物38%最大生命，宠物生命+16%持续2回合', cooldown: 5, healPetPct: 0.38, petHpPct: 16, buffRounds: 2, mpCost: 36, zhuan: 3 },
            { id: 'tamer_c_synergy', name: '兽群·协同', desc: '3转·伤害205%，宠物攻防+22%持续4回合', cooldown: 5, dmgMult: 2.05, petAtkPct: 22, petDefPct: 22, buffRounds: 4, mpCost: 40, zhuan: 3 },
            { id: 'tamer_c_phalanx', name: '兽群·方阵', desc: '3转·宠物防御+32%、生命+30%持续4回合', cooldown: 6, petDefPct: 32, petHpPct: 30, buffRounds: 4, mpCost: 42, zhuan: 3 },
            { id: 'tamer_c_convoy', name: '兽群·护卫', desc: '3转·宠物攻+28%、防+28%、生命+26%持续4回合', cooldown: 6, petAtkPct: 28, petDefPct: 28, petHpPct: 26, buffRounds: 4, mpCost: 44, zhuan: 3 },
            { id: 'tamer_c_legion2', name: '兽群·万兽', desc: '4转·宠物攻防生命各+30%持续5回合', cooldown: 7, petAtkPct: 30, petDefPct: 30, petHpPct: 30, buffRounds: 5, mpCost: 50, zhuan: 4 },
            { id: 'tamer_c_harmony', name: '兽群·和谐', desc: '4转·宠物攻+34%、防+34%、生命+34%持续5回合', cooldown: 8, petAtkPct: 34, petDefPct: 34, petHpPct: 34, buffRounds: 5, mpCost: 54, zhuan: 4 },
            { id: 'tamer_c_sovereign', name: '兽群·兽皇', desc: '4转·伤害260%，宠物全属性+28%持续5回合', cooldown: 8, dmgMult: 2.6, petAtkPct: 28, petDefPct: 28, petHpPct: 28, buffRounds: 5, mpCost: 56, zhuan: 4 }
        ],
        branchD: [
            { id: 'tamer_d_soul', name: '兽魂·觉醒', desc: '2转·宠物攻击+28%持续2回合', cooldown: 2, petAtkPct: 28, buffRounds: 2, mpCost: 20, zhuan: 2 },
            { id: 'tamer_d_burst', name: '兽魂·爆发', desc: '2转·伤害190%，宠物攻击+26%持续1回合', cooldown: 3, dmgMult: 1.9, petAtkPct: 26, buffRounds: 1, mpCost: 24, zhuan: 2 },
            { id: 'tamer_d_frenzy', name: '兽魂·狂乱', desc: '2转·宠物攻击+34%持续2回合', cooldown: 3, petAtkPct: 34, buffRounds: 2, mpCost: 26, zhuan: 2 },
            { id: 'tamer_d_strike', name: '兽魂·猛击', desc: '2转·伤害220%，宠物攻击+22%持续2回合', cooldown: 4, dmgMult: 2.2, petAtkPct: 22, buffRounds: 2, mpCost: 28, zhuan: 2 },
            { id: 'tamer_d_rage', name: '兽魂·暴怒', desc: '2转·宠物攻击+38%持续2回合', cooldown: 3, petAtkPct: 38, buffRounds: 2, mpCost: 28, zhuan: 2 },
            { id: 'tamer_d_execute', name: '兽魂·斩杀', desc: '2转·伤害200%，目标生命<50%时+25%伤害，宠物攻击+20%持续2回合', cooldown: 4, dmgMult: 2, lowHpThreshold: 0.5, dmgBonus: 0.25, petAtkPct: 20, buffRounds: 2, mpCost: 26, zhuan: 2 },
            { id: 'tamer_d_spirit', name: '兽魂·魂力', desc: '2转·宠物攻击+42%持续2回合', cooldown: 4, petAtkPct: 42, buffRounds: 2, mpCost: 30, zhuan: 2 },
            { id: 'tamer_d_overdrive', name: '兽魂·过载', desc: '3转·宠物攻击+50%持续2回合', cooldown: 3, petAtkPct: 50, buffRounds: 2, mpCost: 36, zhuan: 3 },
            { id: 'tamer_d_annihilate', name: '兽魂·湮灭', desc: '3转·伤害280%，宠物攻击+36%持续2回合', cooldown: 5, dmgMult: 2.8, petAtkPct: 36, buffRounds: 2, mpCost: 40, zhuan: 3 },
            { id: 'tamer_d_vengeance', name: '兽魂·复仇', desc: '3转·宠物攻击+54%持续2回合', cooldown: 4, petAtkPct: 54, buffRounds: 2, mpCost: 42, zhuan: 3 },
            { id: 'tamer_d_finisher', name: '兽魂·终结', desc: '3转·伤害310%，目标生命<40%时+30%，宠物攻击+30%持续2回合', cooldown: 5, dmgMult: 3.1, lowHpThreshold: 0.4, dmgBonus: 0.3, petAtkPct: 30, buffRounds: 2, mpCost: 44, zhuan: 3 },
            { id: 'tamer_d_apotheosis', name: '兽魂·神化', desc: '3转·宠物攻击+62%持续3回合', cooldown: 6, petAtkPct: 62, buffRounds: 3, mpCost: 46, zhuan: 3 },
            { id: 'tamer_d_doom', name: '兽魂·末日', desc: '4转·伤害350%，宠物攻击+58%持续3回合', cooldown: 6, dmgMult: 3.5, petAtkPct: 58, buffRounds: 3, mpCost: 52, zhuan: 4 },
            { id: 'tamer_d_avatar', name: '兽魂·化身', desc: '4转·宠物攻击+68%持续3回合', cooldown: 7, petAtkPct: 68, buffRounds: 3, mpCost: 54, zhuan: 4 },
            { id: 'tamer_d_judgment', name: '兽魂·天罚', desc: '4转·伤害380%，目标生命<30%时+40%，宠物攻击+62%持续3回合', cooldown: 8, dmgMult: 3.8, lowHpThreshold: 0.3, dmgBonus: 0.4, petAtkPct: 62, buffRounds: 3, mpCost: 58, zhuan: 4 }
        ]
    },
    onmyoji: {
        base: [
            { id: 'onmyo_paper', name: '召唤·小纸人', desc: '1转·召唤小纸人(137%属性)，场上最多1只', cooldown: 3, summonBeast: true, summonPct: 1.3608, summonName: '小纸人', onmyojiSummon: true, mpCost: 14, zhuan: 1 },
            { id: 'onmyo_kuda', name: '召唤·管狐', desc: '1转·召唤管狐(166%属性)，场上最多1只', cooldown: 4, summonBeast: true, summonPct: 1.6632, summonName: '管狐', onmyojiSummon: true, mpCost: 18, zhuan: 1 },
            { id: 'onmyo_fu_break', name: '符咒·破', desc: '本次伤害165%（受技能伤害加成）', cooldown: 2, dmgMult: 1.65, useSkillDmg: true, mpCost: 12, zhuan: 1 },
            { id: 'onmyo_fu_bind', name: '符咒·缚', desc: '本次伤害120%，50%眩晕1回合', cooldown: 3, dmgMult: 1.2, stunChance: 0.5, stunTurns: 1, mpCost: 16, zhuan: 1 },
            { id: 'onmyo_enhance', name: '强化·式神', desc: '召唤兽攻击+23%、防御+15%，持续2回合', cooldown: 4, summonAtkPct: 23, summonDefPct: 15, buffRounds: 2, mpCost: 20, zhuan: 1 },
            { id: 'onmyo_yin_yang', name: '阴阳术·伤', desc: '本次伤害190%（受技能伤害加成）', cooldown: 3, dmgMult: 1.9, useSkillDmg: true, mpCost: 22, zhuan: 1 },
            { id: 'onmyo_shikigami', name: '召唤·帚神', desc: '1转·召唤帚神(151%属性)，场上最多1只', cooldown: 4, summonBeast: true, summonPct: 1.512, summonName: '帚神', onmyojiSummon: true, mpCost: 16, zhuan: 1 },
            { id: 'onmyo_heal_summon', name: '治疗式神', desc: '阴阳师专属·回复所有召唤兽25%最大生命（绑定技能，不可卸下）', cooldown: 5, healSummonPct: 0.25, mpCost: 20, zhuan: 1, boundSkill: true },
            { id: 'onmyo_shield_summon', name: '护盾式神', desc: '阴阳师专属·玩家与所有召唤兽获得20%最大生命护盾（绑定技能，不可卸下）', cooldown: 6, shieldPct: 0.2, shieldSummonPct: 0.2, mpCost: 24, zhuan: 1, boundSkill: true },
            { id: 'onmyo_sacrifice_summon', name: '牺牲式神', desc: '阴阳师专属·牺牲场上随机一只召唤兽，根据其最大生命为玩家提供护盾，冷却6回合（绑定技能，不可卸下）', cooldown: 6, sacrificeSummon: true, mpCost: 24, zhuan: 1, boundSkill: true }
        ],
        branchA: [
            { id: 'onmyo_a_nue', name: '式神·鵺', desc: '2转·召唤鵺(197%属性)，场上最多1只', cooldown: 4, summonBeast: true, summonPct: 1.9656, summonName: '式神·鵺', onmyojiSummon: true, mpCost: 24, zhuan: 2 },
            { id: 'onmyo_a_enhance2', name: '式神·强化', desc: '2转·召唤兽攻击+33%、防御+21%，持续3回合', cooldown: 5, summonAtkPct: 33, summonDefPct: 21, buffRounds: 3, mpCost: 26, zhuan: 2 },
            { id: 'onmyo_a_fire', name: '式神·火', desc: '2转·伤害200%（受技能伤害加成）', cooldown: 3, dmgMult: 2, useSkillDmg: true, mpCost: 28, zhuan: 2 },
            { id: 'onmyo_a_shadow', name: '召唤·影式神', desc: '2转·召唤影式神(141%属性)，场上最多1只', cooldown: 5, summonBeast: true, summonPct: 1.4112, summonName: '影式神', onmyojiSummon: true, mpCost: 30, zhuan: 2 },
            { id: 'onmyo_a_bless', name: '式神·祝福', desc: '2转·召唤兽攻击+42%、生命+23%，持续3回合', cooldown: 5, summonAtkPct: 42, summonHpPct: 23, buffRounds: 3, mpCost: 32, zhuan: 2 },
            { id: 'onmyo_a_water', name: '式神·水', desc: '2转·伤害180%，回复30%伤害生命', cooldown: 4, dmgMult: 1.8, lifestealPct: 0.3, mpCost: 26, zhuan: 2 },
            { id: 'onmyo_a_wind', name: '式神·风', desc: '2转·群体70%伤害', cooldown: 4, aoe: true, aoePct: 0.7, mpCost: 28, zhuan: 2 },
            { id: 'onmyo_a_susano', name: '式神·荒', desc: '3转·召唤荒(257%属性)，场上最多1只', cooldown: 6, summonBeast: true, summonPct: 2.5704, summonName: '式神·荒', onmyojiSummon: true, mpCost: 38, zhuan: 3 },
            { id: 'onmyo_a_enhance3', name: '式神·神助', desc: '3转·召唤兽攻击+53%、防御+33%，持续4回合', cooldown: 6, summonAtkPct: 53, summonDefPct: 33, buffRounds: 4, mpCost: 40, zhuan: 3 },
            { id: 'onmyo_a_lightning', name: '式神·雷', desc: '3转·伤害260%（受技能伤害加成）', cooldown: 5, dmgMult: 2.6, useSkillDmg: true, mpCost: 42, zhuan: 3 },
            { id: 'onmyo_a_orb', name: '式神·球', desc: '3转·群体85%伤害', cooldown: 5, aoe: true, aoePct: 0.85, mpCost: 36, zhuan: 3 },
            { id: 'onmyo_a_guardian', name: '式神·守', desc: '3转·召唤兽攻击+45%、防御+38%、生命+30%，持续4回合', cooldown: 7, summonAtkPct: 45, summonDefPct: 38, summonHpPct: 30, buffRounds: 4, mpCost: 44, zhuan: 3 },
            { id: 'onmyo_a_ibaraki', name: '式神·茨木', desc: '4转·召唤茨木虚影(302%属性)，场上最多1只', cooldown: 8, summonBeast: true, summonPct: 3.024, summonName: '茨木虚影', onmyojiSummon: true, mpCost: 50, zhuan: 4 },
            { id: 'onmyo_a_enhance4', name: '式神·神威', desc: '4转·召唤兽攻击+68%、防御+45%，持续5回合', cooldown: 8, summonAtkPct: 68, summonDefPct: 45, buffRounds: 5, mpCost: 52, zhuan: 4 },
            { id: 'onmyo_a_judgment', name: '式神·审判', desc: '4转·伤害350%（受技能伤害加成）', cooldown: 7, dmgMult: 3.5, useSkillDmg: true, mpCost: 54, zhuan: 4 },
            { id: 'onmyo_a_storm', name: '式神·风暴', desc: '4转·群体110%伤害', cooldown: 7, aoe: true, aoePct: 1.1, mpCost: 56, zhuan: 4 }
        ],
        branchB: [
            { id: 'onmyo_b_tengu', name: '妖怪·天狗', desc: '2转·召唤天狗(204%属性)，场上最多1只', cooldown: 4, summonBeast: true, summonPct: 2.0412, summonName: '天狗', onmyojiSummon: true, mpCost: 26, zhuan: 2 },
            { id: 'onmyo_b_oni', name: '妖怪·鬼', desc: '2转·本次伤害220%', cooldown: 3, dmgMult: 2.2, mpCost: 28, zhuan: 2 },
            { id: 'onmyo_b_nue', name: '妖怪·鵺击', desc: '2转·群体75%伤害', cooldown: 4, aoe: true, aoePct: 0.75, mpCost: 30, zhuan: 2 },
            { id: 'onmyo_b_kappa', name: '召唤·河童', desc: '2转·召唤河童(219%属性)，场上最多1只', cooldown: 5, summonBeast: true, summonPct: 2.1924, summonName: '河童', onmyojiSummon: true, mpCost: 32, zhuan: 2 },
            { id: 'onmyo_b_rage', name: '妖怪·暴怒', desc: '2转·伤害240%，技能伤害+20%', cooldown: 4, dmgMult: 2.4, skillDmgBonus: 20, mpCost: 34, zhuan: 2 },
            { id: 'onmyo_b_yokai', name: '妖怪·群袭', desc: '2转·群体80%伤害', cooldown: 5, aoe: true, aoePct: 0.8, mpCost: 32, zhuan: 2 },
            { id: 'onmyo_b_fire', name: '妖怪·业火', desc: '2转·伤害200%，无视15%魔抗', cooldown: 4, dmgMult: 2, ignoreDefPct: 15, mpCost: 30, zhuan: 2 },
            { id: 'onmyo_b_nurari', name: '妖怪·滑头鬼', desc: '3转·召唤滑头鬼(272%属性)，场上最多1只', cooldown: 6, summonBeast: true, summonPct: 2.7216, summonName: '滑头鬼', onmyojiSummon: true, mpCost: 42, zhuan: 3 },
            { id: 'onmyo_b_oni2', name: '妖怪·大鬼', desc: '3转·本次伤害300%', cooldown: 5, dmgMult: 3, mpCost: 44, zhuan: 3 },
            { id: 'onmyo_b_swarm', name: '妖怪·百鬼', desc: '3转·群体95%伤害', cooldown: 6, aoe: true, aoePct: 0.95, mpCost: 46, zhuan: 3 },
            { id: 'onmyo_b_enhance', name: '妖怪·妖力', desc: '3转·召唤兽攻击+48%，持续3回合', cooldown: 5, summonAtkPct: 48, buffRounds: 3, mpCost: 40, zhuan: 3 },
            { id: 'onmyo_b_void', name: '妖怪·虚空', desc: '3转·伤害280%，无视25%魔抗', cooldown: 5, dmgMult: 2.8, ignoreDefPct: 25, mpCost: 48, zhuan: 3 },
            { id: 'onmyo_b_chaos', name: '妖怪·混沌', desc: '3转·群体90%伤害，50%眩晕1回合', cooldown: 6, aoe: true, aoePct: 0.9, stunChance: 0.5, stunTurns: 1, mpCost: 44, zhuan: 3 },
            { id: 'onmyo_b_orochi', name: '妖怪·大蛇', desc: '4转·召唤大蛇虚影(317%属性)，场上最多4只', cooldown: 8, summonBeast: true, summonPct: 3.1752, summonName: '大蛇虚影', onmyojiSummon: true, mpCost: 54, zhuan: 4 },
            { id: 'onmyo_b_apocalypse', name: '妖怪·灭世', desc: '4转·本次伤害400%', cooldown: 8, dmgMult: 4, mpCost: 58, zhuan: 4 },
            { id: 'onmyo_b_night', name: '妖怪·百鬼夜行', desc: '4转·群体120%伤害', cooldown: 8, aoe: true, aoePct: 1.2, mpCost: 56, zhuan: 4 }
        ],
        branchC: [
            { id: 'onmyo_c_curse', name: '咒术·诅咒', desc: '2转·伤害190%，目标下回合受伤+20%', cooldown: 3, dmgMult: 1.9, mpCost: 24, zhuan: 2 },
            { id: 'onmyo_c_break', name: '咒术·破魔', desc: '2转·无视30%魔抗，伤害210%', cooldown: 4, dmgMult: 2.1, ignoreDefPct: 30, mpCost: 28, zhuan: 2 },
            { id: 'onmyo_c_soul', name: '咒术·噬魂', desc: '2转·伤害200%，回复25%伤害生命', cooldown: 4, dmgMult: 2, lifestealPct: 0.25, mpCost: 26, zhuan: 2 },
            { id: 'onmyo_c_seal', name: '咒术·封印', desc: '2转·伤害175%，60%眩晕1回合', cooldown: 4, dmgMult: 1.75, stunChance: 0.6, stunTurns: 1, mpCost: 30, zhuan: 2 },
            { id: 'onmyo_c_erode', name: '咒术·侵蚀', desc: '2转·伤害180%，无视20%魔抗', cooldown: 3, dmgMult: 1.8, ignoreDefPct: 20, mpCost: 28, zhuan: 2 },
            { id: 'onmyo_c_blast', name: '咒术·爆', desc: '2转·群体65%伤害', cooldown: 5, aoe: true, aoePct: 0.65, mpCost: 32, zhuan: 2 },
            { id: 'onmyo_c_weaken', name: '咒术·虚弱', desc: '2转·伤害220%，目标受伤+15%', cooldown: 4, dmgMult: 2.2, mpCost: 30, zhuan: 2 },
            { id: 'onmyo_c_death', name: '咒术·死咒', desc: '3转·伤害280%，无视35%魔抗', cooldown: 5, dmgMult: 2.8, ignoreDefPct: 35, mpCost: 42, zhuan: 3 },
            { id: 'onmyo_c_doom', name: '咒术·厄运', desc: '3转·伤害260%，目标下回合受伤+25%', cooldown: 5, dmgMult: 2.6, mpCost: 44, zhuan: 3 },
            { id: 'onmyo_c_void', name: '咒术·虚空', desc: '3转·无视40%魔抗，伤害270%', cooldown: 5, dmgMult: 2.7, ignoreDefPct: 40, mpCost: 46, zhuan: 3 },
            { id: 'onmyo_c_chain', name: '咒术·链', desc: '3转·群体80%伤害', cooldown: 6, aoe: true, aoePct: 0.8, mpCost: 40, zhuan: 3 },
            { id: 'onmyo_c_drain', name: '咒术·汲取', desc: '3转·伤害240%，回复40%伤害生命', cooldown: 5, dmgMult: 2.4, lifestealPct: 0.4, mpCost: 42, zhuan: 3 },
            { id: 'onmyo_c_bind', name: '咒术·缚魂', desc: '3转·伤害250%，70%眩晕1回合', cooldown: 5, dmgMult: 2.5, stunChance: 0.7, stunTurns: 1, mpCost: 48, zhuan: 3 },
            { id: 'onmyo_c_annihilate', name: '咒术·湮灭', desc: '4转·伤害380%，无视50%魔抗', cooldown: 8, dmgMult: 3.8, ignoreDefPct: 50, mpCost: 58, zhuan: 4 },
            { id: 'onmyo_c_final', name: '咒术·终焉', desc: '4转·群体100%伤害', cooldown: 8, aoe: true, aoePct: 1, mpCost: 56, zhuan: 4 },
            { id: 'onmyo_c_ruin', name: '咒术·崩解', desc: '4转·伤害350%，目标受伤+30%', cooldown: 7, dmgMult: 3.5, mpCost: 60, zhuan: 4 }
        ],
        branchD: [
            { id: 'onmyo_d_barrier', name: '结界·护', desc: '2转·获得生命上限25%护盾', cooldown: 4, shieldPct: 0.25, mpCost: 22, zhuan: 2 },
            { id: 'onmyo_d_wall', name: '结界·壁', desc: '2转·本回合减伤35%', cooldown: 4, reduceDmgPct: 35, mpCost: 24, zhuan: 2 },
            { id: 'onmyo_d_heal', name: '结界·愈', desc: '2转·回复生命上限20%', cooldown: 5, healPct: 0.2, mpCost: 26, zhuan: 2 },
            { id: 'onmyo_d_summon_guard', name: '结界·护召', desc: '2转·召唤兽防御+30%、生命+27%，持续3回合', cooldown: 5, summonDefPct: 30, summonHpPct: 27, buffRounds: 3, mpCost: 28, zhuan: 2 },
            { id: 'onmyo_d_sanctuary', name: '结界·圣域', desc: '2转·获得28%生命护盾，本回合减伤20%', cooldown: 5, shieldPct: 0.28, reduceDmgPct: 20, mpCost: 30, zhuan: 2 },
            { id: 'onmyo_d_ward', name: '结界·御', desc: '2转·2回合减伤15%', cooldown: 5, reduceDmgPct: 15, buffRounds: 2, mpCost: 26, zhuan: 2 },
            { id: 'onmyo_d_spirit', name: '召唤·灵狐', desc: '2转·召唤灵狐(197%属性)，场上最多1只', cooldown: 4, summonBeast: true, summonPct: 1.9656, summonName: '灵狐', onmyojiSummon: true, mpCost: 24, zhuan: 2 },
            { id: 'onmyo_d_fortress', name: '结界·城', desc: '3转·获得35%生命护盾', cooldown: 6, shieldPct: 0.35, mpCost: 38, zhuan: 3 },
            { id: 'onmyo_d_guard', name: '结界·守', desc: '3转·本回合减伤45%', cooldown: 5, reduceDmgPct: 45, mpCost: 40, zhuan: 3 },
            { id: 'onmyo_d_summon_fort', name: '结界·坚召', desc: '3转·召唤兽防御+42%、生命+38%，持续4回合', cooldown: 6, summonDefPct: 42, summonHpPct: 38, buffRounds: 4, mpCost: 42, zhuan: 3 },
            { id: 'onmyo_d_regen', name: '结界·生', desc: '3转·回复生命上限30%', cooldown: 6, healPct: 0.3, mpCost: 44, zhuan: 3 },
            { id: 'onmyo_d_immune', name: '结界·御魔', desc: '3转·获得30%护盾，本回合减伤30%', cooldown: 6, shieldPct: 0.3, reduceDmgPct: 30, mpCost: 46, zhuan: 3 },
            { id: 'onmyo_d_turtle', name: '召唤·龟灵', desc: '3转·召唤龟灵(242%属性)，场上最多1只', cooldown: 6, summonBeast: true, summonPct: 2.4192, summonName: '龟灵', onmyojiSummon: true, mpCost: 36, zhuan: 3 },
            { id: 'onmyo_d_world', name: '结界·天盖', desc: '4转·获得45%生命护盾，3回合减伤20%', cooldown: 8, shieldPct: 0.45, reduceDmgPct: 20, buffRounds: 3, mpCost: 52, zhuan: 4 },
            { id: 'onmyo_d_divine', name: '结界·神护', desc: '4转·召唤兽防御+60%、生命+53%，持续5回合', cooldown: 8, summonDefPct: 60, summonHpPct: 53, buffRounds: 5, mpCost: 54, zhuan: 4 },
            { id: 'onmyo_d_eternal', name: '结界·不灭', desc: '4转·本回合减伤55%，获得25%护盾', cooldown: 8, reduceDmgPct: 55, shieldPct: 0.25, mpCost: 56, zhuan: 4 }
        ]
    },
    mechanic: {
        // 机械师基础技能：偏机甲形态、机器人召唤与工程强化
        base: [
            { id: 'mech_laser', name: '聚能激光', desc: '本次伤害210%（受技能伤害加成），额外无视15%防御', cooldown: 3, dmgMult: 2.1, useSkillDmg: true, ignoreDefPct: 15, mpCost: 18, zhuan: 1 },
            { id: 'mech_shield_pulse', name: '纳米护盾', desc: '获得生命上限18%护盾，2回合内减少10%所受伤害', cooldown: 4, shieldPct: 0.18, reduceDmgPct: 10, buffRounds: 2, mpCost: 20, zhuan: 1 },
            { id: 'mech_overclock', name: '临时过载', desc: '本回合攻击+45%、技能伤害+25%，下回合生命扣除当前最大生命10%', cooldown: 5, buffAtkPct: 45, skillDmgBonus: 25, buffRounds: 1, selfHpLoseMaxPctNext: 0.10, mpCost: 24, zhuan: 1 },
            // 特色一转技能1：临时强化全部机器人攻防
            { id: 'mech_field_tuning', name: '战地·场校调试', desc: '1转·2回合内所有战斗机器人攻击+20%、防御+15%', cooldown: 4, summonAtkPct: 20, summonDefPct: 15, buffRounds: 2, mpCost: 20, zhuan: 1 },
            // 特色一转技能2：牺牲残血机器人换取自身护盾
            { id: 'mech_scrap_recover', name: '战地·残骸回收', desc: '1转·牺牲所有生命低于30%的战斗机器人，每牺牲1台为你提供12%最大生命护盾', cooldown: 6, sacrificeLowHpBots: true, lowHpThreshold: 0.3, shieldPctPerBot: 0.12, mpCost: 22, zhuan: 1 },
            { id: 'mech_summon_bot', name: '召唤战斗机器人', desc: '机械师专属·召唤战斗机器人(126%玩家属性)，总召唤上限4台，同名机器人最多4台（绑定技能，不可卸下）', cooldown: 4, summonBeast: true, summonPct: 1.26, summonName: '战斗机器人', mechanicSummon: true, mpCost: 22, zhuan: 1, boundSkill: true },
            { id: 'mech_transform', name: '机甲形态', desc: '机械师专属·3回合内攻击+40%、防御+30%、生命上限+25%（绑定技能，不可卸下）', cooldown: 7, buffAtkPct: 40, buffDefPct: 30, buffHpPct: 25, buffRounds: 3, mpCost: 30, zhuan: 1, boundSkill: true },
            { id: 'mech_self_destruct', name: '自爆指令', desc: '机械师专属·牺牲一台当前存活的战斗机器人，对目标造成该机器人最大生命100%伤害（不受减伤影响，绑定技能，不可卸下）', cooldown: 5, sacrificeRobot: true, mpCost: 26, zhuan: 1, boundSkill: true }
        ],
        // 战地工程：强化机械铠甲，偏护盾与层数成长
        branchA: [
            // 2转：5 个技能
            { id: 'mech_a_autorepair', name: '战地·自修模块', desc: '2转·3回合内每回合回复最大生命8%', cooldown: 5, healPctPerRound: 0.08, buffRounds: 3, mpCost: 26, zhuan: 2 },
            { id: 'mech_a_armorfield', name: '战地·装甲场', desc: '2转·3回合内防御+30%，减伤12%', cooldown: 6, buffDefPct: 30, reduceDmgPct: 12, buffRounds: 3, mpCost: 30, zhuan: 2 },
            { id: 'mech_a_growth', name: '战地·层数同步', desc: '2转·本次伤害190%，本局中每10层额外+3%伤害', cooldown: 4, dmgMult: 1.9, floorScalingPct: 0.03, floorStep: 10, mpCost: 24, zhuan: 2 },
            { id: 'mech_a_plating', name: '战地·重型装甲', desc: '2转·2回合内防御+40%，生命上限+12%', cooldown: 5, buffDefPct: 40, buffHpPct: 12, buffRounds: 2, mpCost: 28, zhuan: 2 },
            { id: 'mech_a_hardpoint', name: '战地·固定火力点', desc: '2转·本次伤害210%，本回合减伤15%', cooldown: 4, dmgMult: 2.1, reduceDmgPct: 15, buffRounds: 1, mpCost: 26, zhuan: 2 },
            // 3转：再补到 5 个
            { id: 'mech_a_barrier', name: '战地·能量壁垒', desc: '3转·获得30%生命护盾，2回合内减少20%所受伤害', cooldown: 6, shieldPct: 0.3, reduceDmgPct: 20, buffRounds: 2, mpCost: 34, zhuan: 3 },
            { id: 'mech_a_resist', name: '战地·抗性涂层', desc: '3转·3回合内受到持续伤害与灼烧/中毒/流血伤害降低40%', cooldown: 7, dotReducePct: 40, buffRounds: 3, mpCost: 32, zhuan: 3 },
            { id: 'mech_a_reboot', name: '战地·紧急重启', desc: '3转·立即回复35%最大生命，清除本回合自损效果', cooldown: 8, healPct: 0.35, clearSelfLoseEffects: true, mpCost: 38, zhuan: 3 },
            { id: 'mech_a_cover', name: '战地·战壕掩护', desc: '3转·本回合减伤30%，下回合减伤20%', cooldown: 6, reduceDmgPct: 30, buffRounds: 2, nextRoundReduceDmgPct: 20, mpCost: 34, zhuan: 3 },
            { id: 'mech_a_amp', name: '战地·放大矩阵', desc: '3转·2回合内生命上限+20%，攻击+15%', cooldown: 7, buffHpPct: 20, buffAtkPct: 15, buffRounds: 2, mpCost: 36, zhuan: 3 },
            // 4转：5 个技能
            { id: 'mech_a_fortress', name: '战地·前线堡垒', desc: '4转·获得45%生命护盾，3回合内减伤25%', cooldown: 8, shieldPct: 0.45, reduceDmgPct: 25, buffRounds: 3, mpCost: 40, zhuan: 4 },
            { id: 'mech_a_sync_core', name: '战地·同步核心', desc: '4转·本局中每10层额外伤害加成上限提升到+5%，并立刻触发一次层数同步伤害（不叠加冷却）', cooldown: 8, floorScalingPct: 0.05, floorStep: 10, dmgMult: 2.2, mpCost: 42, zhuan: 4 },
            { id: 'mech_a_bastion', name: '战地·绝对防线', desc: '4转·本回合减伤50%，并获得20%生命护盾', cooldown: 9, reduceDmgPct: 50, shieldPct: 0.2, buffRounds: 1, mpCost: 44, zhuan: 4 },
            { id: 'mech_a_repairfield', name: '战地·自动维修场', desc: '4转·3回合内每回合回复最大生命10%，并额外赋予5%减伤', cooldown: 9, healPctPerRound: 0.10, reduceDmgPct: 5, buffRounds: 3, mpCost: 46, zhuan: 4 },
            { id: 'mech_a_supercore', name: '战地·超导主核', desc: '4转·2回合内生命上限+30%，防御+35%，并将已有护盾值提升50%', cooldown: 10, buffHpPct: 30, buffDefPct: 35, shieldAmpPct: 50, buffRounds: 2, mpCost: 50, zhuan: 4 }
        ],
        // 机器人军团：集中提升召唤机器人能力
        branchB: [
            // 2转：5 个技能
            { id: 'mech_b_overhaul', name: '机仆·全面检修', desc: '2转·3回合内所有机器人攻击+28%、生命+22%', cooldown: 5, summonAtkPct: 28, summonHpPct: 22, buffRounds: 3, mpCost: 28, zhuan: 2 },
            { id: 'mech_b_formation', name: '机仆·集群阵列', desc: '2转·2回合内机器人攻击+22%，每存在1台机器人玩家攻击+6%(最多4层)', cooldown: 5, summonAtkPct: 22, mechPlayerAtkPerBotPct: 6, mechPlayerAtkPerBotMaxStacks: 4, buffRounds: 2, mpCost: 30, zhuan: 2 },
            { id: 'mech_b_repairdrone', name: '机仆·维修无人机', desc: '2转·2回合内每回合为所有机器人回复最大生命10%', cooldown: 5, summonHealPctPerRound: 0.10, buffRounds: 2, mpCost: 28, zhuan: 2 },
            { id: 'mech_b_armorlink', name: '机仆·装甲链接', desc: '2转·3回合内机器人防御+24%、生命+18%', cooldown: 6, summonDefPct: 24, summonHpPct: 18, buffRounds: 3, mpCost: 30, zhuan: 2 },
            { id: 'mech_b_battery', name: '机仆·能量电池', desc: '2转·3回合内机器人攻击+18%，玩家攻击+10%', cooldown: 6, summonAtkPct: 18, buffAtkPct: 10, buffRounds: 3, mpCost: 32, zhuan: 2 },
            // 3转：5 个技能
            { id: 'mech_b_support', name: '机仆·支援无人机', desc: '3转·召唤支援无人机(72%属性)，存在期间每回合为玩家回复8%最大生命', cooldown: 7, summonBeast: true, summonPct: 0.72, summonName: '支援无人机', mechanicSummon: true, healPctPerRound: 0.08, buffRounds: 3, mpCost: 34, zhuan: 3 },
            { id: 'mech_b_shielddrone', name: '机仆·护盾无人机', desc: '3转·2回合内每回合为所有机器人与玩家提供10%最大生命护盾', cooldown: 7, summonShieldPctPerRound: 0.10, shieldPctPerRound: 0.10, buffRounds: 2, mpCost: 36, zhuan: 3 },
            { id: 'mech_b_syncai', name: '机仆·智能协同', desc: '3转·3回合内机器人攻击+26%、暴击率+8%', cooldown: 7, summonAtkPct: 26, summonCritRatePct: 8, buffRounds: 3, mpCost: 38, zhuan: 3 },
            { id: 'mech_b_overclockbots', name: '机仆·机器人过载', desc: '3转·本回合机器人攻击+40%，本回合结束时所有机器人损失当前生命15%', cooldown: 8, summonAtkPct: 40, summonSelfLoseCurPct: 15, buffRounds: 1, mpCost: 40, zhuan: 3 },
            { id: 'mech_b_focusfire', name: '机仆·集中火力', desc: '3转·本次伤害220%，额外根据场上机器人数量每台+5%伤害(最多+20%)', cooldown: 6, dmgMult: 2.2, mechBotsDmgPerBotPct: 5, mechBotsDmgPerBotMaxPct: 20, mpCost: 36, zhuan: 3 },
            // 4转：5 个技能
            { id: 'mech_b_command', name: '机仆·总指挥', desc: '4转·3回合内所有机器人攻击+40%、生命+30%、防御+25%', cooldown: 8, summonAtkPct: 40, summonHpPct: 30, summonDefPct: 25, buffRounds: 3, mpCost: 42, zhuan: 4 },
            { id: 'mech_b_sync_fire', name: '机仆·同步火力', desc: '4转·本回合所有机器人额外进行一次攻击，造成其攻击力120%的总伤害', cooldown: 9, mechRobotExtraAttackPct: 1.2, mpCost: 44, zhuan: 4 },
            { id: 'mech_b_legion', name: '机仆·钢铁军团', desc: '4转·3回合内机器人攻击+32%、生命+28%、防御+22%', cooldown: 9, summonAtkPct: 32, summonHpPct: 28, summonDefPct: 22, buffRounds: 3, mpCost: 46, zhuan: 4 },
            { id: 'mech_b_alpha', name: '机仆·旗舰机体', desc: '4转·召唤旗舰机器人(160%属性)，总召唤上限4台，同名仅1台', cooldown: 10, summonBeast: true, summonPct: 1.6, summonName: '旗舰机体', mechanicSummon: true, summonMax: 1, mpCost: 48, zhuan: 4 },
            { id: 'mech_b_hivemind', name: '机仆·蜂巢意志', desc: '4转·2回合内机器人每次攻击额外造成其攻击力30%的群体溅射伤害', cooldown: 10, summonSplashPct: 0.30, buffRounds: 2, mpCost: 50, zhuan: 4 }
        ],
        // 干扰黑客：控制与削弱怪物
        branchC: [
            // 2转：5 个技能
            { id: 'mech_c_jam', name: '干扰·信号噪声', desc: '2转·本次伤害160%，2回合内怪物攻击-18%', cooldown: 4, dmgMult: 1.6, debuffMonsterAtkPct: -18, debuffRounds: 2, mpCost: 24, zhuan: 2 },
            { id: 'mech_c_hack', name: '干扰·入侵协议', desc: '2转·伤害180%，无视25%防御，怪物本回合命中-20%', cooldown: 4, dmgMult: 1.8, ignoreDefPct: 25, debuffMonsterHitPct: -20, debuffRounds: 1, mpCost: 28, zhuan: 2 },
            { id: 'mech_c_blur', name: '干扰·视觉模糊', desc: '2转·2回合内怪物命中-25%，暴击率-10%', cooldown: 5, debuffMonsterHitPct: -25, debuffMonsterCritRatePct: -10, debuffRounds: 2, mpCost: 24, zhuan: 2 },
            { id: 'mech_c_slow', name: '干扰·动作延迟', desc: '2转·本次伤害150%，2回合内怪物攻击-12%、速度降低(闪避-10%)', cooldown: 5, dmgMult: 1.5, debuffMonsterAtkPct: -12, debuffMonsterDodgePct: -10, debuffRounds: 2, mpCost: 26, zhuan: 2 },
            { id: 'mech_c_trace', name: '干扰·追踪标记', desc: '2转·2回合内怪物受到的技能伤害+18%', cooldown: 5, debuffMonsterTakenSkillDmgPct: 18, debuffRounds: 2, mpCost: 26, zhuan: 2 },
            // 3转：5 个技能
            { id: 'mech_c_overload', name: '干扰·系统过载', desc: '3转·群体80%伤害，50%几率眩晕1回合', cooldown: 6, aoe: true, aoePct: 0.8, stunChance: 0.5, stunTurns: 1, mpCost: 36, zhuan: 3 },
            { id: 'mech_c_corebreak', name: '干扰·核心紊乱', desc: '3转·伤害220%，2回合内怪物攻击-22%，技能冷却效果降低(自身技能冷却-1回合，不含本技能)', cooldown: 7, dmgMult: 2.2, debuffMonsterAtkPct: -22, selfSkillCdReduce: 1, mpCost: 38, zhuan: 3 },
            { id: 'mech_c_disrupt', name: '干扰·指令错乱', desc: '3转·群体70%伤害，40%几率使怪物本回合无法行动', cooldown: 7, aoe: true, aoePct: 0.7, stunChance: 0.4, stunTurns: 1, mpCost: 38, zhuan: 3 },
            { id: 'mech_c_leak', name: '干扰·能量泄露', desc: '3转·2回合内怪物每回合损失最大生命6%，并使其受到伤害+12%', cooldown: 8, dotMonsterMaxHpPctPerRound: 0.06, debuffMonsterTakenDmgPct: 12, debuffRounds: 2, mpCost: 40, zhuan: 3 },
            { id: 'mech_c_shieldbreak', name: '干扰·护盾破坏', desc: '3转·本次伤害180%，并清除怪物护盾，2回合内怪物护盾获得效果减半', cooldown: 7, dmgMult: 1.8, stripShield: true, debuffMonsterShieldEffPct: -50, debuffRounds: 2, mpCost: 36, zhuan: 3 },
            // 4转：5 个技能
            { id: 'mech_c_blackout', name: '干扰·全域断电', desc: '4转·群体90%伤害，2回合内怪物攻击-25%、命中-25%', cooldown: 8, aoe: true, aoePct: 0.9, debuffMonsterAtkPct: -25, debuffMonsterHitPct: -25, debuffRounds: 2, mpCost: 44, zhuan: 4 },
            { id: 'mech_c_lockdown', name: '干扰·系统封锁', desc: '4转·本回合单体伤害260%，60%几率眩晕2回合，并额外降低20%暴击率', cooldown: 8, dmgMult: 2.6, stunChance: 0.6, stunTurns: 2, debuffMonsterCritRatePct: -20, debuffRounds: 2, mpCost: 40, zhuan: 4 },
            { id: 'mech_c_nullfield', name: '干扰·静默领域', desc: '4转·2回合内怪物无法触发被动效果，持续伤害与反伤无效', cooldown: 9, silencePassive: true, disableDotThorns: true, debuffRounds: 2, mpCost: 48, zhuan: 4 },
            { id: 'mech_c_matrix', name: '干扰·矩阵入侵', desc: '4转·群体85%伤害，2回合内怪物攻击-18%、受到伤害+18%', cooldown: 9, aoe: true, aoePct: 0.85, debuffMonsterAtkPct: -18, debuffMonsterTakenDmgPct: 18, debuffRounds: 2, mpCost: 46, zhuan: 4 },
            { id: 'mech_c_rebootlock', name: '干扰·重启锁死', desc: '4转·伤害280%，若目标生命低于40%，则额外眩晕1回合并移除其所有增益', cooldown: 10, dmgMult: 2.8, lowHpThreshold: 0.4, extraStunTurns: 1, dispelBuffs: true, mpCost: 50, zhuan: 4 }
        ],
        // 过载爆破：自损换爆发，自爆机器人强化版
        branchD: [
            // 2转 · 共 5 个：围绕“掉血换爆发”
            { id: 'mech_d_redline', name: '过载·红线', desc: '2转·3回合内攻击+35%，每回合结束自身损失当前生命5%', cooldown: 6, buffAtkPct: 35, buffRounds: 3, selfHpLoseCurPctPerRound: 0.05, mpCost: 30, zhuan: 2 },
            { id: 'mech_d_burn_circuit', name: '过载·燃烧回路', desc: '2转·本次伤害210%，2回合内每回合损失当前生命5%换取额外15%攻击', cooldown: 5, dmgMult: 2.1, buffAtkPct: 15, buffRounds: 2, selfHpLoseCurPctPerRound: 0.05, mpCost: 28, zhuan: 2 },
            { id: 'mech_d_overload_strike', name: '过载·过载一击', desc: '2转·本次伤害240%，若当前生命≥60%则额外+25%伤害', cooldown: 5, dmgMult: 2.4, highHpThreshold: 0.6, dmgBonus: 0.25, mpCost: 30, zhuan: 2 },
            { id: 'mech_d_blood_core', name: '过载·血能核心', desc: '2转·3回合内每次造成伤害额外回复10%本次伤害的生命', cooldown: 6, lifestealPct: 0.10, buffRounds: 3, mpCost: 30, zhuan: 2 },
            { id: 'mech_d_frag', name: '过载·破片冲击', desc: '2转·群体70%伤害，你生命越低伤害越高(生命≤30%时额外+40%)', cooldown: 5, aoe: true, aoePct: 0.7, lowHpThreshold: 0.3, dmgBonus: 0.4, mpCost: 30, zhuan: 2 },
            // 3转 · 共 5 个：机器人自爆+低血强化
            { id: 'mech_d_chainboom', name: '过载·连锁爆破', desc: '3转·牺牲一台战斗机器人，对所有怪物造成其最大生命60%伤害', cooldown: 7, sacrificeRobotAoe: true, sacrificePctMaxHp: 0.6, mpCost: 34, zhuan: 3 },
            { id: 'mech_d_bloodstorm', name: '过载·血潮风暴', desc: '3转·群体85%伤害，你生命越低伤害越高(生命≤20%时额外+60%伤害)', cooldown: 7, aoe: true, aoePct: 0.85, lowHpThreshold: 0.2, dmgBonus: 0.6, mpCost: 38, zhuan: 3 },
            { id: 'mech_d_last_guard', name: '过载·绝境护盾', desc: '3转·立即获得40%生命护盾，若释放时生命≤30%再额外获得20%减伤(2回合)', cooldown: 7, shieldPct: 0.4, lowHpThreshold: 0.3, reduceDmgPct: 20, buffRounds: 2, mpCost: 36, zhuan: 3 },
            { id: 'mech_d_core_crack', name: '过载·核心裂解', desc: '3转·本次伤害260%，自损当前生命10%，并无视35%防御', cooldown: 6, dmgMult: 2.6, ignoreDefPct: 35, selfHpLoseCurPct: 0.10, mpCost: 36, zhuan: 3 },
            { id: 'mech_d_burst_array', name: '过载·爆裂阵列', desc: '3转·本次伤害230%，场上每存在1台机器人额外+10%伤害(最多+40%)', cooldown: 6, dmgMult: 2.3, mechBotCountThreshold: 1, mechBotsDmgPerBotPct: 10, mechBotsDmgPerBotMaxPct: 40, mpCost: 38, zhuan: 3 },
            // 4转 · 共 5 个：终极爆发/收割+救命
            { id: 'mech_d_berserk_core', name: '过载·狂暴核心', desc: '4转·3回合内攻击+55%，技能伤害+35%，每回合结束自身损失当前生命8%', cooldown: 9, buffAtkPct: 55, skillDmgBonus: 35, buffRounds: 3, selfHpLoseCurPctPerRound: 0.08, mpCost: 44, zhuan: 4 },
            { id: 'mech_d_ultimate_boom', name: '过载·终极清场', desc: '4转·牺牲一台战斗机器人，对所有怪物造成其最大生命100%伤害，并额外结算一次玩家当前攻击200%伤害', cooldown: 10, sacrificeRobotAoe: true, sacrificePctMaxHp: 1.0, extraPlayerAtkMult: 2.0, mpCost: 50, zhuan: 4 },
            { id: 'mech_d_last_wall', name: '过载·绝境壁垒', desc: '4转·立即获得60%生命护盾，2回合内减伤25%，释放时若生命≤30%额外回复30%生命', cooldown: 10, shieldPct: 0.6, reduceDmgPct: 25, buffRounds: 2, lowHpThreshold: 0.3, healPct: 0.3, mpCost: 46, zhuan: 4 },
            { id: 'mech_d_zero_hour', name: '过载·零点爆发', desc: '4转·本次伤害320%，若击杀目标则立刻回复50%最大生命', cooldown: 9, dmgMult: 3.2, killHealPct: 0.5, mpCost: 48, zhuan: 4 },
            { id: 'mech_d_final_protocol', name: '过载·最终协议', desc: '4转·3回合内造成伤害+30%，受到伤害+15%，生命首次跌到20%以下时自动回复40%生命', cooldown: 10, damageIncreasePct: 30, vulnerablePct: 15, lowHpThreshold: 0.2, healPct: 0.4, buffRounds: 3, mpCost: 52, zhuan: 4 }
        ]
    },
    jester: {
        base: [
            { id: 'jester_coin', name: '抛硬币', desc: '戏命师基础技·50%攻击+35%持续2回合，50%攻击-20%持续2回合', cooldown: 4, mpCost: 18, zhuan: 1, gambleEffects: [ { label: '攻势', up: { buffAtkPct: 35, buffRounds: 2 }, down: { buffAtkPct: -20, buffRounds: 2 } } ] },
            { id: 'jester_dice', name: '命运骰', desc: '戏命师基础技·50%本次伤害220%，50%本次伤害110%', cooldown: 4, mpCost: 20, zhuan: 1, gambleEffects: [ { label: '伤害倍率', up: { dmgMult: 2.2 }, down: { dmgMult: 1.1 } } ] },
            { id: 'jester_flip', name: '逆命翻牌', desc: '戏命师基础技·50%获得20%护盾，50%失去当前生命8%', cooldown: 5, mpCost: 22, zhuan: 1, gambleEffects: [ { label: '生存', up: { shieldPct: 0.2 }, down: { selfHpLoseCurPct: 0.08 } } ] },
            { id: 'jester_roulette', name: '命运轮盘', desc: '戏命师基础技·50%本回合伤害+30%，50%本回合伤害-18%', cooldown: 5, mpCost: 24, zhuan: 1, gambleEffects: [ { label: '伤害轮盘', up: { damageIncreasePct: 30, buffRounds: 1 }, down: { damageIncreasePct: -18, buffRounds: 1 } } ] },
            { id: 'jester_bet_guard', name: '押注护体', desc: '戏命师基础技·50%获得22%护盾并减伤12%，50%防御-18%持续2回合', cooldown: 6, mpCost: 24, zhuan: 1, gambleEffects: [ { label: '护体押注', up: { shieldPct: 0.22, reduceDmgPct: 12, buffRounds: 2 }, down: { buffDefPct: -18, buffRounds: 2 } } ] },
            { id: 'exclusive_jester_fate_play', name: '戏命运', desc: '戏命师专属·60%戏弄成功：攻击与防御+100%持续5回合；40%失败：攻击与防御-50%持续5回合。冷却6回合（绑定，不可卸下）', cooldown: 6, mpCost: 26, zhuan: 1, boundSkill: true, gambleEffects: [ { label: '戏弄', gambleWinChance: 0.6, up: { buffAtkPct: 100, buffDefPct: 100, buffRounds: 5 }, down: { buffAtkPct: -50, buffDefPct: -50, buffRounds: 5 } } ] },
            { id: 'exclusive_jester_fate_puppet', name: '命运傀儡', desc: '戏命师专属·召唤命运傀儡：生命为玩家200%，其余属性为玩家70%；场上仅能存在1只（再次召唤替换旧傀儡）。冷却4回合（绑定，不可卸下）', cooldown: 4, mpCost: 22, zhuan: 1, boundSkill: true, summonBeast: true, summonPct: 0.7, summonHpMult: 2, summonMax: 1, summonName: '命运傀儡', jesterPuppetSummon: true }
        ],
        branchA: [
            { id: 'jes_a_2_1', name: '红桃·搏杀签', desc: '2转·50%攻击+45%，50%攻击-30%（2回合）', cooldown: 5, mpCost: 24, zhuan: 2, gambleEffects: [ { label: '攻击波动', up: { buffAtkPct: 45, buffRounds: 2 }, down: { buffAtkPct: -30, buffRounds: 2 } } ] },
            { id: 'jes_a_2_2', name: '红桃·裂命刺', desc: '2转·50%伤害250%，50%伤害130%', cooldown: 5, mpCost: 26, zhuan: 2, gambleEffects: [ { label: '倍率波动', up: { dmgMult: 2.5 }, down: { dmgMult: 1.3 } } ] },
            { id: 'jes_a_2_3', name: '红桃·狂喜', desc: '2转·50%暴击率+25%，50%暴击率-15%（3回合）', cooldown: 6, mpCost: 24, zhuan: 2, gambleEffects: [ { label: '暴击率', up: { critRateBonus: 25, buffRounds: 3 }, down: { critRateBonus: -15, buffRounds: 3 } } ] },
            { id: 'jes_a_2_4', name: '红桃·断念', desc: '2转·50%技能伤害+40%，50%技能伤害-20%（2回合）', cooldown: 6, mpCost: 26, zhuan: 2, gambleEffects: [ { label: '技能增幅', up: { skillDmgBonus: 40, buffRounds: 2 }, down: { skillDmgBonus: -20, buffRounds: 2 } } ] },
            { id: 'jes_a_2_5', name: '红桃·血契', desc: '2转·50%吸血+18%，50%本回合自损10%当前生命', cooldown: 6, mpCost: 28, zhuan: 2, gambleEffects: [ { label: '血量交易', up: { lifestealPct: 0.18, buffRounds: 2 }, down: { selfHpLoseCurPct: 0.1 } } ] },
            { id: 'jes_a_3_1', name: '红桃·梭哈', desc: '3转·50%伤害300%，50%伤害140%', cooldown: 6, mpCost: 32, zhuan: 3, gambleEffects: [ { label: '梭哈倍率', up: { dmgMult: 3.0 }, down: { dmgMult: 1.4 } } ] },
            { id: 'jes_a_3_2', name: '红桃·刃舞', desc: '3转·50%攻击+65%，50%攻击-35%（2回合）', cooldown: 7, mpCost: 34, zhuan: 3, gambleEffects: [ { label: '攻势', up: { buffAtkPct: 65, buffRounds: 2 }, down: { buffAtkPct: -35, buffRounds: 2 } } ] },
            { id: 'jes_a_3_3', name: '红桃·断命', desc: '3转·50%无视防御40%，50%无视防御-20%', cooldown: 6, mpCost: 30, zhuan: 3, gambleEffects: [ { label: '穿透', up: { ignoreDefPct: 40 }, down: { ignoreDefPct: -20 } } ] },
            { id: 'jes_a_3_4', name: '红桃·血怒', desc: '3转·50%连击率+22%，50%连击率-12%（3回合）', cooldown: 7, mpCost: 34, zhuan: 3, gambleEffects: [ { label: '连击率', up: { comboBonus: 22, buffRounds: 3 }, down: { comboBonus: -12, buffRounds: 3 } } ] },
            { id: 'jes_a_3_5', name: '红桃·豪赌', desc: '3转·50%暴伤+90%，50%暴伤-35%（3回合）', cooldown: 8, mpCost: 36, zhuan: 3, gambleEffects: [ { label: '暴伤', up: { critDmgBonus: 90, buffRounds: 3 }, down: { critDmgBonus: -35, buffRounds: 3 } } ] },
            { id: 'jes_a_4_1', name: '红桃·天命屠戮', desc: '4转·50%伤害360%，50%伤害150%', cooldown: 8, mpCost: 44, zhuan: 4, gambleEffects: [ { label: '终极倍率', up: { dmgMult: 3.6 }, down: { dmgMult: 1.5 } } ] },
            { id: 'jes_a_4_2', name: '红桃·王炸', desc: '4转·50%攻击+100%，50%攻击-50%（2回合）', cooldown: 9, mpCost: 46, zhuan: 4, gambleEffects: [ { label: '攻击', up: { buffAtkPct: 100, buffRounds: 2 }, down: { buffAtkPct: -50, buffRounds: 2 } } ] },
            { id: 'jes_a_4_3', name: '红桃·终局', desc: '4转·50%无视防御60%，50%受到伤害+20%（2回合）', cooldown: 9, mpCost: 48, zhuan: 4, gambleEffects: [ { label: '攻防博弈', up: { ignoreDefPct: 60 }, down: { vulnerablePct: 20, buffRounds: 2 } } ] },
            { id: 'jes_a_4_4', name: '红桃·血色轮盘', desc: '4转·50%吸血+30%，50%损失当前生命15%', cooldown: 9, mpCost: 50, zhuan: 4, gambleEffects: [ { label: '血量轮盘', up: { lifestealPct: 0.3, buffRounds: 3 }, down: { selfHpLoseCurPct: 0.15 } } ] },
            { id: 'jes_a_4_5', name: '红桃·孤注一掷', desc: '4转·50%本回合额外伤害+45%，50%本回合伤害-25%', cooldown: 10, mpCost: 52, zhuan: 4, gambleEffects: [ { label: '伤害振幅', up: { damageIncreasePct: 45, buffRounds: 1 }, down: { damageIncreasePct: -25, buffRounds: 1 } } ] }
        ],
        branchB: [
            { id: 'jes_b_2_1', name: '黑桃·生死签', desc: '2转·50%回复30%生命，50%损失12%当前生命', cooldown: 5, mpCost: 24, zhuan: 2, gambleEffects: [ { label: '生命波动', up: { healPct: 0.3 }, down: { selfHpLoseCurPct: 0.12 } } ] },
            { id: 'jes_b_2_2', name: '黑桃·赌盾', desc: '2转·50%获得35%护盾，50%护盾失效且减伤-10%（2回合）', cooldown: 6, mpCost: 26, zhuan: 2, gambleEffects: [ { label: '护盾判定', up: { shieldPct: 0.35 }, down: { reduceDmgPct: -10, buffRounds: 2 } } ] },
            { id: 'jes_b_2_3', name: '黑桃·续命注', desc: '2转·50%每回合回血8%持续3回合，50%每回合失血4%持续3回合', cooldown: 6, mpCost: 28, zhuan: 2, gambleEffects: [ { label: '持续恢复', up: { healPctPerRound: 0.08, buffRounds: 3 }, down: { selfHpLoseCurPctPerRound: 0.04, buffRounds: 3 } } ] },
            { id: 'jes_b_2_4', name: '黑桃·铁命', desc: '2转·50%防御+50%，50%防御-25%（2回合）', cooldown: 5, mpCost: 24, zhuan: 2, gambleEffects: [ { label: '防御', up: { buffDefPct: 50, buffRounds: 2 }, down: { buffDefPct: -25, buffRounds: 2 } } ] },
            { id: 'jes_b_2_5', name: '黑桃·护体诈术', desc: '2转·50%减伤25%，50%易伤+18%（2回合）', cooldown: 6, mpCost: 28, zhuan: 2, gambleEffects: [ { label: '减伤', up: { reduceDmgPct: 25, buffRounds: 2 }, down: { vulnerablePct: 18, buffRounds: 2 } } ] },
            { id: 'jes_b_3_1', name: '黑桃·不死局', desc: '3转·50%回复45%生命，50%损失18%当前生命', cooldown: 7, mpCost: 34, zhuan: 3, gambleEffects: [ { label: '生命', up: { healPct: 0.45 }, down: { selfHpLoseCurPct: 0.18 } } ] },
            { id: 'jes_b_3_2', name: '黑桃·双重护幕', desc: '3转·50%获得50%护盾，50%获得15%护盾', cooldown: 7, mpCost: 36, zhuan: 3, gambleEffects: [ { label: '护盾量', up: { shieldPct: 0.5 }, down: { shieldPct: 0.15 } } ] },
            { id: 'jes_b_3_3', name: '黑桃·逆境韧化', desc: '3转·50%生命上限+35%，50%生命上限-18%（3回合）', cooldown: 7, mpCost: 36, zhuan: 3, gambleEffects: [ { label: '生命上限', up: { buffHpPct: 35, buffRounds: 3 }, down: { buffHpPct: -18, buffRounds: 3 } } ] },
            { id: 'jes_b_3_4', name: '黑桃·赌命墙', desc: '3转·50%减伤40%，50%减伤-20%（2回合）', cooldown: 8, mpCost: 38, zhuan: 3, gambleEffects: [ { label: '护甲', up: { reduceDmgPct: 40, buffRounds: 2 }, down: { reduceDmgPct: -20, buffRounds: 2 } } ] },
            { id: 'jes_b_3_5', name: '黑桃·回光返照', desc: '3转·50%回血35%并护盾20%，50%损失10%当前生命并易伤+10%', cooldown: 8, mpCost: 40, zhuan: 3, gambleEffects: [ { label: '生死逆转', up: { healPct: 0.35, shieldPct: 0.2 }, down: { selfHpLoseCurPct: 0.1, vulnerablePct: 10, buffRounds: 2 } } ] },
            { id: 'jes_b_4_1', name: '黑桃·阎王点名', desc: '4转·50%回复60%生命，50%损失25%当前生命', cooldown: 9, mpCost: 46, zhuan: 4, gambleEffects: [ { label: '生命剧变', up: { healPct: 0.6 }, down: { selfHpLoseCurPct: 0.25 } } ] },
            { id: 'jes_b_4_2', name: '黑桃·终极护命', desc: '4转·50%获得65%护盾，50%仅获得20%护盾并防御-20%', cooldown: 9, mpCost: 48, zhuan: 4, gambleEffects: [ { label: '护盾/防御', up: { shieldPct: 0.65 }, down: { shieldPct: 0.2, buffDefPct: -20, buffRounds: 2 } } ] },
            { id: 'jes_b_4_3', name: '黑桃·冥河契约', desc: '4转·50%每回合回血12%持续3回合，50%每回合失血6%持续3回合', cooldown: 10, mpCost: 50, zhuan: 4, gambleEffects: [ { label: '持续血量', up: { healPctPerRound: 0.12, buffRounds: 3 }, down: { selfHpLoseCurPctPerRound: 0.06, buffRounds: 3 } } ] },
            { id: 'jes_b_4_4', name: '黑桃·绝地壁垒', desc: '4转·50%减伤55%，50%易伤+25%（2回合）', cooldown: 10, mpCost: 52, zhuan: 4, gambleEffects: [ { label: '承伤', up: { reduceDmgPct: 55, buffRounds: 2 }, down: { vulnerablePct: 25, buffRounds: 2 } } ] },
            { id: 'jes_b_4_5', name: '黑桃·命硬赌徒', desc: '4转·50%生命上限+55%，50%生命上限-28%（3回合）', cooldown: 10, mpCost: 54, zhuan: 4, gambleEffects: [ { label: '体质', up: { buffHpPct: 55, buffRounds: 3 }, down: { buffHpPct: -28, buffRounds: 3 } } ] }
        ],
        branchC: [
            { id: 'jes_c_2_1', name: '方块·赔率斩', desc: '2转·50%伤害240%，50%伤害120%', cooldown: 5, mpCost: 24, zhuan: 2, gambleEffects: [ { label: '伤害', up: { dmgMult: 2.4 }, down: { dmgMult: 1.2 } } ] },
            { id: 'jes_c_2_2', name: '方块·开盘破甲', desc: '2转·50%无视防御35%，50%无视防御-15%', cooldown: 5, mpCost: 26, zhuan: 2, gambleEffects: [ { label: '破甲', up: { ignoreDefPct: 35 }, down: { ignoreDefPct: -15 } } ] },
            { id: 'jes_c_2_3', name: '方块·赔率修正', desc: '2转·50%技能伤害+35%，50%技能伤害-18%（2回合）', cooldown: 6, mpCost: 28, zhuan: 2, gambleEffects: [ { label: '技伤', up: { skillDmgBonus: 35, buffRounds: 2 }, down: { skillDmgBonus: -18, buffRounds: 2 } } ] },
            { id: 'jes_c_2_4', name: '方块·暴率标注', desc: '2转·50%暴击率+20%，50%暴击率-10%（3回合）', cooldown: 6, mpCost: 24, zhuan: 2, gambleEffects: [ { label: '暴击', up: { critRateBonus: 20, buffRounds: 3 }, down: { critRateBonus: -10, buffRounds: 3 } } ] },
            { id: 'jes_c_2_5', name: '方块·庄家抽水', desc: '2转·50%伤害+28%，50%伤害-16%（2回合）', cooldown: 6, mpCost: 30, zhuan: 2, gambleEffects: [ { label: '增伤', up: { damageIncreasePct: 28, buffRounds: 2 }, down: { damageIncreasePct: -16, buffRounds: 2 } } ] },
            { id: 'jes_c_3_1', name: '方块·赔率爆仓', desc: '3转·50%伤害320%，50%伤害145%', cooldown: 7, mpCost: 34, zhuan: 3, gambleEffects: [ { label: '倍率', up: { dmgMult: 3.2 }, down: { dmgMult: 1.45 } } ] },
            { id: 'jes_c_3_2', name: '方块·极限穿透', desc: '3转·50%无视防御50%，50%无视防御-25%', cooldown: 7, mpCost: 36, zhuan: 3, gambleEffects: [ { label: '穿透', up: { ignoreDefPct: 50 }, down: { ignoreDefPct: -25 } } ] },
            { id: 'jes_c_3_3', name: '方块·高赔率术', desc: '3转·50%技能伤害+55%，50%技能伤害-28%（2回合）', cooldown: 8, mpCost: 38, zhuan: 3, gambleEffects: [ { label: '技能波动', up: { skillDmgBonus: 55, buffRounds: 2 }, down: { skillDmgBonus: -28, buffRounds: 2 } } ] },
            { id: 'jes_c_3_4', name: '方块·红黑选择', desc: '3转·50%暴伤+80%，50%暴伤-30%（3回合）', cooldown: 8, mpCost: 40, zhuan: 3, gambleEffects: [ { label: '暴伤', up: { critDmgBonus: 80, buffRounds: 3 }, down: { critDmgBonus: -30, buffRounds: 3 } } ] },
            { id: 'jes_c_3_5', name: '方块·抬价砍价', desc: '3转·50%伤害+35%，50%受到伤害+15%（2回合）', cooldown: 8, mpCost: 40, zhuan: 3, gambleEffects: [ { label: '风险收益', up: { damageIncreasePct: 35, buffRounds: 2 }, down: { vulnerablePct: 15, buffRounds: 2 } } ] },
            { id: 'jes_c_4_1', name: '方块·终盘赔率', desc: '4转·50%伤害380%，50%伤害160%', cooldown: 9, mpCost: 46, zhuan: 4, gambleEffects: [ { label: '终盘倍率', up: { dmgMult: 3.8 }, down: { dmgMult: 1.6 } } ] },
            { id: 'jes_c_4_2', name: '方块·庄家封盘', desc: '4转·50%无视防御70%，50%伤害-25%（2回合）', cooldown: 9, mpCost: 48, zhuan: 4, gambleEffects: [ { label: '破甲结算', up: { ignoreDefPct: 70 }, down: { damageIncreasePct: -25, buffRounds: 2 } } ] },
            { id: 'jes_c_4_3', name: '方块·胜率操控', desc: '4转·50%技能伤害+80%，50%技能伤害-35%（2回合）', cooldown: 10, mpCost: 50, zhuan: 4, gambleEffects: [ { label: '技伤操控', up: { skillDmgBonus: 80, buffRounds: 2 }, down: { skillDmgBonus: -35, buffRounds: 2 } } ] },
            { id: 'jes_c_4_4', name: '方块·暴利回合', desc: '4转·50%本回合伤害+55%，50%本回合伤害-30%', cooldown: 10, mpCost: 52, zhuan: 4, gambleEffects: [ { label: '回合收益', up: { damageIncreasePct: 55, buffRounds: 1 }, down: { damageIncreasePct: -30, buffRounds: 1 } } ] },
            { id: 'jes_c_4_5', name: '方块·反向止损', desc: '4转·50%回复25%生命并伤害300%，50%损失10%当前生命并伤害170%', cooldown: 10, mpCost: 54, zhuan: 4, gambleEffects: [ { label: '止损', up: { healPct: 0.25, dmgMult: 3.0 }, down: { selfHpLoseCurPct: 0.1, dmgMult: 1.7 } } ] }
        ],
        branchD: [
            { id: 'jes_d_2_1', name: '梅花·乱序打击', desc: '2转·50%群体95%伤害，50%群体55%伤害', cooldown: 5, mpCost: 26, zhuan: 2, gambleEffects: [ { label: '群攻倍率', up: { aoe: true, aoePct: 0.95 }, down: { aoe: true, aoePct: 0.55 } } ] },
            { id: 'jes_d_2_2', name: '梅花·混沌护体', desc: '2转·50%减伤30%，50%减伤-12%（2回合）', cooldown: 6, mpCost: 24, zhuan: 2, gambleEffects: [ { label: '减伤', up: { reduceDmgPct: 30, buffRounds: 2 }, down: { reduceDmgPct: -12, buffRounds: 2 } } ] },
            { id: 'jes_d_2_3', name: '梅花·狂乱祝福', desc: '2转·50%攻击/防御+30%，50%攻击/防御-18%（2回合）', cooldown: 6, mpCost: 28, zhuan: 2, gambleEffects: [ { label: '双属性', up: { buffAtkPct: 30, buffDefPct: 30, buffRounds: 2 }, down: { buffAtkPct: -18, buffDefPct: -18, buffRounds: 2 } } ] },
            { id: 'jes_d_2_4', name: '梅花·惊惧牌', desc: '2转·50%眩晕1回合，50%自己下回合伤害-20%', cooldown: 6, mpCost: 26, zhuan: 2, gambleEffects: [ { label: '控制判定', up: { stunChance: 1, stunTurns: 1 }, down: { damageIncreasePct: -20, buffRounds: 1 } } ] },
            { id: 'jes_d_2_5', name: '梅花·乱流', desc: '2转·50%技能伤害+30%，50%受到伤害+12%（2回合）', cooldown: 6, mpCost: 30, zhuan: 2, gambleEffects: [ { label: '混沌收益', up: { skillDmgBonus: 30, buffRounds: 2 }, down: { vulnerablePct: 12, buffRounds: 2 } } ] },
            { id: 'jes_d_3_1', name: '梅花·噩运风暴', desc: '3转·50%群体120%伤害，50%群体65%伤害', cooldown: 7, mpCost: 34, zhuan: 3, gambleEffects: [ { label: 'AOE', up: { aoe: true, aoePct: 1.2 }, down: { aoe: true, aoePct: 0.65 } } ] },
            { id: 'jes_d_3_2', name: '梅花·混沌壁', desc: '3转·50%获得40%护盾，50%获得10%护盾', cooldown: 7, mpCost: 34, zhuan: 3, gambleEffects: [ { label: '护盾', up: { shieldPct: 0.4 }, down: { shieldPct: 0.1 } } ] },
            { id: 'jes_d_3_3', name: '梅花·命轮偏转', desc: '3转·50%攻击/防御/生命+40%，50%三维-20%（2回合）', cooldown: 8, mpCost: 38, zhuan: 3, gambleEffects: [ { label: '三维', up: { buffAtkPct: 40, buffDefPct: 40, buffHpPct: 40, buffRounds: 2 }, down: { buffAtkPct: -20, buffDefPct: -20, buffHpPct: -20, buffRounds: 2 } } ] },
            { id: 'jes_d_3_4', name: '梅花·福祸相依', desc: '3转·50%回血25%并减伤20%，50%失血8%并易伤+10%', cooldown: 8, mpCost: 40, zhuan: 3, gambleEffects: [ { label: '福祸', up: { healPct: 0.25, reduceDmgPct: 20, buffRounds: 2 }, down: { selfHpLoseCurPct: 0.08, vulnerablePct: 10, buffRounds: 2 } } ] },
            { id: 'jes_d_3_5', name: '梅花·不可测', desc: '3转·50%伤害290%，50%伤害150%并自损6%当前生命', cooldown: 8, mpCost: 40, zhuan: 3, gambleEffects: [ { label: '不可测倍率', up: { dmgMult: 2.9 }, down: { dmgMult: 1.5, selfHpLoseCurPct: 0.06 } } ] },
            { id: 'jes_d_4_1', name: '梅花·终焉洗牌', desc: '4转·50%群体150%伤害并眩晕1回合，50%群体75%伤害', cooldown: 9, mpCost: 48, zhuan: 4, gambleEffects: [ { label: '终焉判定', up: { aoe: true, aoePct: 1.5, stunChance: 1, stunTurns: 1 }, down: { aoe: true, aoePct: 0.75 } } ] },
            { id: 'jes_d_4_2', name: '梅花·天命乱流', desc: '4转·50%全属性+60%，50%全属性-30%（2回合）', cooldown: 10, mpCost: 50, zhuan: 4, gambleEffects: [ { label: '全属性', up: { buffAtkPct: 60, buffDefPct: 60, buffHpPct: 60, skillDmgBonus: 45, buffRounds: 2 }, down: { buffAtkPct: -30, buffDefPct: -30, buffHpPct: -30, skillDmgBonus: -20, buffRounds: 2 } } ] },
            { id: 'jes_d_4_3', name: '梅花·生死同契', desc: '4转·50%回血50%并护盾35%，50%失血20%并易伤+20%', cooldown: 10, mpCost: 52, zhuan: 4, gambleEffects: [ { label: '生死', up: { healPct: 0.5, shieldPct: 0.35 }, down: { selfHpLoseCurPct: 0.2, vulnerablePct: 20, buffRounds: 2 } } ] },
            { id: 'jes_d_4_4', name: '梅花·万象崩盘', desc: '4转·50%伤害360%且无视50%防御，50%伤害170%', cooldown: 10, mpCost: 54, zhuan: 4, gambleEffects: [ { label: '万象倍率', up: { dmgMult: 3.6, ignoreDefPct: 50 }, down: { dmgMult: 1.7 } } ] },
            { id: 'jes_d_4_5', name: '梅花·命轮审判', desc: '4转·50%本回合伤害+60%，50%本回合伤害-35%且自损10%当前生命', cooldown: 10, mpCost: 56, zhuan: 4, gambleEffects: [ { label: '审判', up: { damageIncreasePct: 60, buffRounds: 1 }, down: { damageIncreasePct: -35, buffRounds: 1, selfHpLoseCurPct: 0.1 } } ] }
        ]
    },
    riftbinder: {
        base: [
            { id: 'rift_base_sync', name: '界印同频', desc: '1转·宠物/深渊神兽攻击+22%、防御+16%，持续3回合', cooldown: 3, petAtkPct: 22, petDefPct: 16, buffRounds: 3, mpCost: 18, zhuan: 1 },
            { id: 'rift_base_vital', name: '渊核滋养', desc: '1转·回复出战宠物30%最大生命，宠物生命+20%持续2回合', cooldown: 4, healPetPct: 0.3, petHpPct: 20, buffRounds: 2, mpCost: 22, zhuan: 1 },
            { id: 'rift_base_edge', name: '异界锋回', desc: '1转·本次伤害180%，宠物攻击+18%持续2回合', cooldown: 4, dmgMult: 1.8, petAtkPct: 18, buffRounds: 2, mpCost: 24, zhuan: 1 },
            { id: 'rift_base_barrier', name: '灵幕回响', desc: '1转·获得22%生命护盾，宠物防御+20%持续2回合', cooldown: 5, shieldPct: 0.22, petDefPct: 20, buffRounds: 2, mpCost: 24, zhuan: 1 },
            { id: 'rift_base_focus', name: '深渊同调', desc: '1转·技能伤害+24%持续2回合，宠物攻击+16%', cooldown: 5, skillDmgBonus: 24, petAtkPct: 16, buffRounds: 2, mpCost: 26, zhuan: 1 },
            { id: 'rift_bound_oath', name: '界兽誓约', desc: '异界御灵专属·宠物/深渊神兽攻击+30%、生命+24%持续3回合（绑定技能，不可卸下）', cooldown: 5, petAtkPct: 30, petHpPct: 24, buffRounds: 3, mpCost: 28, zhuan: 1, boundSkill: true },
            { id: 'rift_bound_armor', name: '深渊兽甲', desc: '异界御灵专属·获得26%生命护盾，宠物/深渊神兽防御+30%、生命+16%持续3回合（绑定技能，不可卸下）', cooldown: 6, shieldPct: 0.26, petDefPct: 30, petHpPct: 16, buffRounds: 3, mpCost: 30, zhuan: 1, boundSkill: true },
            { id: 'rift_bound_mirror', name: '灵宠镜盾', desc: '异界御灵专属·回复出战宠物35%最大生命并获得20%生命护盾，2回合减伤12%（绑定技能，不可卸下）', cooldown: 6, healPetPct: 0.35, shieldPct: 0.2, reduceDmgPct: 12, buffRounds: 2, mpCost: 30, zhuan: 1, boundSkill: true }
        ],
        branchA: [
            { id: 'rift_a_2_1', name: '虚界·裂纹增幅', desc: '2转·宠物/深渊神兽攻击+36%持续3回合', cooldown: 4, petAtkPct: 36, buffRounds: 3, mpCost: 30, zhuan: 2 },
            { id: 'rift_a_2_2', name: '虚界·双相锋', desc: '2转·本次伤害210%，宠物攻击+24%持续2回合', cooldown: 4, dmgMult: 2.1, petAtkPct: 24, buffRounds: 2, mpCost: 32, zhuan: 2 },
            { id: 'rift_a_2_3', name: '虚界·狂链', desc: '2转·技能伤害+28%持续2回合，宠物防御+18%', cooldown: 5, skillDmgBonus: 28, petDefPct: 18, buffRounds: 2, mpCost: 32, zhuan: 2 },
            { id: 'rift_a_2_4', name: '虚界·侵蚀印', desc: '2转·本次伤害190%，无视25%防御', cooldown: 4, dmgMult: 1.9, ignoreDefPct: 25, mpCost: 30, zhuan: 2 },
            { id: 'rift_a_2_5', name: '虚界·兽怒', desc: '2转·宠物攻击+28%、生命+18%持续3回合', cooldown: 5, petAtkPct: 28, petHpPct: 18, buffRounds: 3, mpCost: 34, zhuan: 2 },
            { id: 'rift_a_3_1', name: '虚界·灾锋', desc: '3转·本次伤害260%，宠物攻击+30%持续3回合', cooldown: 5, dmgMult: 2.6, petAtkPct: 30, buffRounds: 3, mpCost: 40, zhuan: 3 },
            { id: 'rift_a_3_2', name: '虚界·终端谐振', desc: '3转·技能伤害+40%持续3回合，攻击+18%', cooldown: 6, skillDmgBonus: 40, buffAtkPct: 18, buffRounds: 3, mpCost: 42, zhuan: 3 },
            { id: 'rift_a_3_3', name: '虚界·裂界追杀', desc: '3转·本次伤害250%，无视40%防御', cooldown: 5, dmgMult: 2.5, ignoreDefPct: 40, mpCost: 40, zhuan: 3 },
            { id: 'rift_a_3_4', name: '虚界·同频过载', desc: '3转·本回合伤害+30%，宠物攻击+32%', cooldown: 6, damageIncreasePct: 30, petAtkPct: 32, buffRounds: 2, mpCost: 42, zhuan: 3 },
            { id: 'rift_a_3_5', name: '虚界·界律断层', desc: '3转·本次伤害280%，宠物/深渊神兽攻击+26%持续2回合', cooldown: 6, dmgMult: 2.8, petAtkPct: 26, buffRounds: 2, mpCost: 44, zhuan: 3 },
            { id: 'rift_a_4_1', name: '虚界·终律崩灭', desc: '4转·本次伤害340%，无视50%防御', cooldown: 8, dmgMult: 3.4, ignoreDefPct: 50, mpCost: 54, zhuan: 4 },
            { id: 'rift_a_4_2', name: '虚界·神兽共振', desc: '4转·宠物/深渊神兽攻击+52%、生命+28%持续4回合', cooldown: 8, petAtkPct: 52, petHpPct: 28, buffRounds: 4, mpCost: 52, zhuan: 4 },
            { id: 'rift_a_4_3', name: '虚界·裂空轰印', desc: '4转·本次伤害320%，技能伤害+35%持续2回合', cooldown: 8, dmgMult: 3.2, skillDmgBonus: 35, buffRounds: 2, mpCost: 56, zhuan: 4 },
            { id: 'rift_a_4_4', name: '虚界·极限谐鸣', desc: '4转·本回合伤害+45%，宠物攻击+36%', cooldown: 9, damageIncreasePct: 45, petAtkPct: 36, buffRounds: 2, mpCost: 58, zhuan: 4 },
            { id: 'rift_a_4_5', name: '虚界·终幕裁断', desc: '4转·本次伤害380%，宠物/深渊神兽攻击+40%持续3回合', cooldown: 10, dmgMult: 3.8, petAtkPct: 40, buffRounds: 3, mpCost: 60, zhuan: 4 }
        ],
        branchB: [
            { id: 'rift_b_2_1', name: '渊甲·外覆层', desc: '2转·宠物/深渊神兽防御+34%，持续3回合', cooldown: 4, petDefPct: 34, buffRounds: 3, mpCost: 28, zhuan: 2 },
            { id: 'rift_b_2_2', name: '渊甲·护灵壁', desc: '2转·获得30%生命护盾，宠物生命+24%持续3回合', cooldown: 5, shieldPct: 0.3, petHpPct: 24, buffRounds: 3, mpCost: 32, zhuan: 2 },
            { id: 'rift_b_2_3', name: '渊甲·反震膜', desc: '2转·本回合减伤20%，宠物防御+22%持续2回合', cooldown: 5, reduceDmgPct: 20, petDefPct: 22, buffRounds: 2, mpCost: 30, zhuan: 2 },
            { id: 'rift_b_2_4', name: '渊甲·回息', desc: '2转·回复出战宠物38%最大生命', cooldown: 4, healPetPct: 0.38, mpCost: 30, zhuan: 2 },
            { id: 'rift_b_2_5', name: '渊甲·固垒', desc: '2转·获得24%生命护盾，宠物防御+28%、生命+16%持续3回合', cooldown: 5, shieldPct: 0.24, petDefPct: 28, petHpPct: 16, buffRounds: 3, mpCost: 32, zhuan: 2 },
            { id: 'rift_b_3_1', name: '渊甲·重壁', desc: '3转·获得38%生命护盾，2回合减伤22%', cooldown: 6, shieldPct: 0.38, reduceDmgPct: 22, buffRounds: 2, mpCost: 40, zhuan: 3 },
            { id: 'rift_b_3_2', name: '渊甲·神兽壁垒', desc: '3转·宠物/深渊神兽防御+46%、生命+26%持续4回合', cooldown: 6, petDefPct: 46, petHpPct: 26, buffRounds: 4, mpCost: 42, zhuan: 3 },
            { id: 'rift_b_3_3', name: '渊甲·镜面护体', desc: '3转·获得34%生命护盾，宠物防御+30%持续3回合', cooldown: 6, shieldPct: 0.34, petDefPct: 30, buffRounds: 3, mpCost: 40, zhuan: 3 },
            { id: 'rift_b_3_4', name: '渊甲·回生刻印', desc: '3转·回复出战宠物48%最大生命，并获得16%生命护盾', cooldown: 6, healPetPct: 0.48, shieldPct: 0.16, mpCost: 42, zhuan: 3 },
            { id: 'rift_b_3_5', name: '渊甲·坚守誓环', desc: '3转·3回合减伤18%，宠物生命+30%', cooldown: 7, reduceDmgPct: 18, petHpPct: 30, buffRounds: 3, mpCost: 44, zhuan: 3 },
            { id: 'rift_b_4_1', name: '渊甲·不坠之墙', desc: '4转·获得52%生命护盾，3回合减伤25%', cooldown: 8, shieldPct: 0.52, reduceDmgPct: 25, buffRounds: 3, mpCost: 54, zhuan: 4 },
            { id: 'rift_b_4_2', name: '渊甲·永固神躯', desc: '4转·宠物/深渊神兽防御+62%、生命+36%持续5回合', cooldown: 8, petDefPct: 62, petHpPct: 36, buffRounds: 5, mpCost: 56, zhuan: 4 },
            { id: 'rift_b_4_3', name: '渊甲·界面偏折', desc: '4转·本回合减伤35%，获得28%生命护盾', cooldown: 8, reduceDmgPct: 35, shieldPct: 0.28, mpCost: 52, zhuan: 4 },
            { id: 'rift_b_4_4', name: '渊甲·誓卫回响', desc: '4转·回复出战宠物60%最大生命，宠物防御+34%持续4回合', cooldown: 8, healPetPct: 0.6, petDefPct: 34, buffRounds: 4, mpCost: 58, zhuan: 4 },
            { id: 'rift_b_4_5', name: '渊甲·终界护城', desc: '4转·获得45%生命护盾，宠物/深渊神兽生命+42%持续4回合', cooldown: 9, shieldPct: 0.45, petHpPct: 42, buffRounds: 4, mpCost: 60, zhuan: 4 }
        ],
        branchC: [
            { id: 'rift_c_2_1', name: '星蚀·衰印', desc: '2转·本次伤害195%，目标下回合受伤+18%', cooldown: 4, dmgMult: 1.95, targetDamageTakenPctNext: 18, mpCost: 30, zhuan: 2 },
            { id: 'rift_c_2_2', name: '星蚀·穿界咒', desc: '2转·本次伤害205%，无视28%防御', cooldown: 4, dmgMult: 2.05, ignoreDefPct: 28, mpCost: 32, zhuan: 2 },
            { id: 'rift_c_2_3', name: '星蚀·禁链', desc: '2转·本次伤害180%，宠物攻击+20%持续2回合', cooldown: 4, dmgMult: 1.8, petAtkPct: 20, buffRounds: 2, mpCost: 30, zhuan: 2 },
            { id: 'rift_c_2_4', name: '星蚀·弱界', desc: '2转·技能伤害+26%持续2回合，目标防御被压制', cooldown: 5, skillDmgBonus: 26, ignoreDefPct: 15, buffRounds: 2, mpCost: 32, zhuan: 2 },
            { id: 'rift_c_2_5', name: '星蚀·噬域', desc: '2转·本次伤害200%，宠物防御+18%持续2回合', cooldown: 4, dmgMult: 2, petDefPct: 18, buffRounds: 2, mpCost: 30, zhuan: 2 },
            { id: 'rift_c_3_1', name: '星蚀·断咒', desc: '3转·本次伤害260%，无视38%防御', cooldown: 5, dmgMult: 2.6, ignoreDefPct: 38, mpCost: 40, zhuan: 3 },
            { id: 'rift_c_3_2', name: '星蚀·灾变刻印', desc: '3转·技能伤害+38%持续3回合，宠物攻击+22%', cooldown: 6, skillDmgBonus: 38, petAtkPct: 22, buffRounds: 3, mpCost: 42, zhuan: 3 },
            { id: 'rift_c_3_3', name: '星蚀·虚损', desc: '3转·本次伤害240%，目标下回合受伤+24%', cooldown: 5, dmgMult: 2.4, targetDamageTakenPctNext: 24, mpCost: 40, zhuan: 3 },
            { id: 'rift_c_3_4', name: '星蚀·缚域链', desc: '3转·本次伤害230%，无视32%防御，宠物防御+20%', cooldown: 5, dmgMult: 2.3, ignoreDefPct: 32, petDefPct: 20, buffRounds: 2, mpCost: 42, zhuan: 3 },
            { id: 'rift_c_3_5', name: '星蚀·异律侵袭', desc: '3转·本回合伤害+28%，技能伤害+20%持续2回合', cooldown: 6, damageIncreasePct: 28, skillDmgBonus: 20, buffRounds: 2, mpCost: 44, zhuan: 3 },
            { id: 'rift_c_4_1', name: '星蚀·寂灭裁决', desc: '4转·本次伤害350%，无视48%防御', cooldown: 8, dmgMult: 3.5, ignoreDefPct: 48, mpCost: 56, zhuan: 4 },
            { id: 'rift_c_4_2', name: '星蚀·黑域咒缚', desc: '4转·本次伤害320%，目标下回合受伤+32%', cooldown: 8, dmgMult: 3.2, targetDamageTakenPctNext: 32, mpCost: 54, zhuan: 4 },
            { id: 'rift_c_4_3', name: '星蚀·界蚀协律', desc: '4转·技能伤害+52%持续3回合，宠物攻击+30%', cooldown: 9, skillDmgBonus: 52, petAtkPct: 30, buffRounds: 3, mpCost: 58, zhuan: 4 },
            { id: 'rift_c_4_4', name: '星蚀·崩界符阵', desc: '4转·本次伤害330%，无视42%防御，宠物防御+24%', cooldown: 8, dmgMult: 3.3, ignoreDefPct: 42, petDefPct: 24, buffRounds: 2, mpCost: 56, zhuan: 4 },
            { id: 'rift_c_4_5', name: '星蚀·终咒裂响', desc: '4转·本回合伤害+42%，技能伤害+28%持续2回合', cooldown: 10, damageIncreasePct: 42, skillDmgBonus: 28, buffRounds: 2, mpCost: 60, zhuan: 4 }
        ],
        branchD: [
            { id: 'rift_d_2_1', name: '终焉·同律', desc: '2转·宠物/深渊神兽攻防生命各+18%持续3回合', cooldown: 5, petAtkPct: 18, petDefPct: 18, petHpPct: 18, buffRounds: 3, mpCost: 30, zhuan: 2 },
            { id: 'rift_d_2_2', name: '终焉·镜域盾', desc: '2转·获得24%生命护盾，宠物防御+22%持续3回合', cooldown: 5, shieldPct: 0.24, petDefPct: 22, buffRounds: 3, mpCost: 32, zhuan: 2 },
            { id: 'rift_d_2_3', name: '终焉·双核共鸣', desc: '2转·本次伤害205%，宠物攻击+20%、生命+16%持续2回合', cooldown: 5, dmgMult: 2.05, petAtkPct: 20, petHpPct: 16, buffRounds: 2, mpCost: 34, zhuan: 2 },
            { id: 'rift_d_2_4', name: '终焉·回声疗愈', desc: '2转·回复出战宠物40%最大生命，获得14%生命护盾', cooldown: 5, healPetPct: 0.4, shieldPct: 0.14, mpCost: 32, zhuan: 2 },
            { id: 'rift_d_2_5', name: '终焉·命印增幅', desc: '2转·技能伤害+22%持续2回合，宠物攻击+16%', cooldown: 5, skillDmgBonus: 22, petAtkPct: 16, buffRounds: 2, mpCost: 32, zhuan: 2 },
            { id: 'rift_d_3_1', name: '终焉·共律升华', desc: '3转·宠物/深渊神兽攻防生命各+28%持续4回合', cooldown: 6, petAtkPct: 28, petDefPct: 28, petHpPct: 28, buffRounds: 4, mpCost: 42, zhuan: 3 },
            { id: 'rift_d_3_2', name: '终焉·界轮护持', desc: '3转·获得32%生命护盾，2回合减伤18%，宠物防御+24%', cooldown: 6, shieldPct: 0.32, reduceDmgPct: 18, petDefPct: 24, buffRounds: 2, mpCost: 44, zhuan: 3 },
            { id: 'rift_d_3_3', name: '终焉·同调破界', desc: '3转·本次伤害270%，无视35%防御，宠物攻击+24%', cooldown: 6, dmgMult: 2.7, ignoreDefPct: 35, petAtkPct: 24, buffRounds: 2, mpCost: 44, zhuan: 3 },
            { id: 'rift_d_3_4', name: '终焉·镜像回生', desc: '3转·回复出战宠物52%最大生命并获得20%生命护盾', cooldown: 6, healPetPct: 0.52, shieldPct: 0.2, mpCost: 42, zhuan: 3 },
            { id: 'rift_d_3_5', name: '终焉·律动增伤', desc: '3转·本回合伤害+26%，技能伤害+22%持续2回合', cooldown: 6, damageIncreasePct: 26, skillDmgBonus: 22, buffRounds: 2, mpCost: 44, zhuan: 3 },
            { id: 'rift_d_4_1', name: '终焉·万相同调', desc: '4转·宠物/深渊神兽攻防生命各+40%持续5回合', cooldown: 8, petAtkPct: 40, petDefPct: 40, petHpPct: 40, buffRounds: 5, mpCost: 56, zhuan: 4 },
            { id: 'rift_d_4_2', name: '终焉·界轮绝护', desc: '4转·获得46%生命护盾，3回合减伤22%，宠物防御+30%', cooldown: 8, shieldPct: 0.46, reduceDmgPct: 22, petDefPct: 30, buffRounds: 3, mpCost: 58, zhuan: 4 },
            { id: 'rift_d_4_3', name: '终焉·虚渊裁断', desc: '4转·本次伤害360%，无视45%防御，宠物攻击+30%', cooldown: 9, dmgMult: 3.6, ignoreDefPct: 45, petAtkPct: 30, buffRounds: 2, mpCost: 60, zhuan: 4 },
            { id: 'rift_d_4_4', name: '终焉·镜盾归元', desc: '4转·回复出战宠物65%最大生命并获得28%生命护盾，2回合减伤12%', cooldown: 8, healPetPct: 0.65, shieldPct: 0.28, reduceDmgPct: 12, buffRounds: 2, mpCost: 58, zhuan: 4 },
            { id: 'rift_d_4_5', name: '终焉·异界王律', desc: '4转·本回合伤害+40%，技能伤害+30%持续3回合，宠物生命+26%', cooldown: 10, damageIncreasePct: 40, skillDmgBonus: 30, petHpPct: 26, buffRounds: 3, mpCost: 62, zhuan: 4 }
        ]
    }
};
// 异界御灵平衡（首轮）：下调中后期过高的综合收益，保留职业特色
(function balanceRiftbinderSkills() {
    var cfg = ABYSS_CLASS_SKILLS && ABYSS_CLASS_SKILLS.riftbinder;
    if (!cfg) return;
    function tuneList(arr) {
        for (var i = 0; i < arr.length; i++) {
            var sk = arr[i];
            if (!sk) continue;
            var z = sk.zhuan || 1;
            if (z >= 3) {
                if (sk.dmgMult != null) sk.dmgMult = Math.max(1, +(sk.dmgMult * 0.92).toFixed(2));
                if (sk.petAtkPct != null) sk.petAtkPct = Math.round(sk.petAtkPct * 0.88);
                if (sk.petDefPct != null) sk.petDefPct = Math.round(sk.petDefPct * 0.9);
                if (sk.petHpPct != null) sk.petHpPct = Math.round(sk.petHpPct * 0.9);
                if (sk.shieldPct != null) sk.shieldPct = +(sk.shieldPct * 0.9).toFixed(3);
                if (sk.healPetPct != null) sk.healPetPct = +(sk.healPetPct * 0.9).toFixed(3);
                if (sk.skillDmgBonus != null) sk.skillDmgBonus = Math.round(sk.skillDmgBonus * 0.9);
                if (sk.damageIncreasePct != null) sk.damageIncreasePct = Math.round(sk.damageIncreasePct * 0.9);
                if (sk.targetDamageTakenPctNext != null) sk.targetDamageTakenPctNext = Math.round(sk.targetDamageTakenPctNext * 0.9);
                if (sk.mpCost != null) sk.mpCost += 2;
            } else if (z === 2) {
                if (sk.petAtkPct != null) sk.petAtkPct = Math.round(sk.petAtkPct * 0.94);
                if (sk.shieldPct != null) sk.shieldPct = +(sk.shieldPct * 0.95).toFixed(3);
            }
        }
    }
    tuneList(cfg.base || []);
    tuneList(cfg.branchA || []);
    tuneList(cfg.branchB || []);
    tuneList(cfg.branchC || []);
    tuneList(cfg.branchD || []);
})();
function abyssGetSkillById(classId, skillId) {
    var branch = (abyssRun && abyssRun.active) ? abyssRun.classBranch : null;
    var list = abyssGetSkillList(classId, branch);
    if (!list) return null;
    for (var i = 0; i < list.length; i++) if (list[i].id === skillId) return list[i];
    return null;
}
function abyssGetSkillDescForDisplay(sk) {
    if (!sk) return '';
    var d = sk.desc || '';
    var isJesterSkill = !!(sk.id && (String(sk.id).indexOf('jes_') === 0 || String(sk.id).indexOf('jester_') === 0));
    if (isJesterSkill) return d + '（已强化：正负效果均提升100%）';
    return d;
}

var ABYSS_QUALITIES = ['灰', '绿', '蓝', '紫', '橙'];
var ABYSS_QUALITY_COLOR = { 0: '#888', 1: '#4caf50', 2: '#2196f3', 3: '#9c27b0', 4: '#ff9800' };
// 五行：金木水火土，克制关系 金克木、木克土、土克水、水克火、火克金
var ABYSS_ELEMENTS = ['metal', 'wood', 'water', 'fire', 'earth'];
var ABYSS_ELEMENT_NAMES = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
var ABYSS_ELEMENT_COLORS = { metal: '#ffd700', wood: '#228b22', water: '#1e90ff', fire: '#ff4500', earth: '#8b4513' };
var ABYSS_ELEMENT_RESTRAIN = { metal: 'wood', wood: 'earth', earth: 'water', water: 'fire', fire: 'metal' };
var ABYSS_ELEMENT_RESTRAINED_BY = { metal: 'fire', wood: 'metal', earth: 'wood', water: 'earth', fire: 'water' };
function abyssElementRestrainMultiplier(attackerElement, defenderElement) {
    if (!attackerElement || !defenderElement) return 1;
    if (ABYSS_ELEMENT_RESTRAIN[attackerElement] === defenderElement) return 1.35;
    if (ABYSS_ELEMENT_RESTRAINED_BY[attackerElement] === defenderElement) return 0.7;
    return 1;
}
function abyssFmt1(v) {
    var n = Number(v);
    if (isNaN(n)) return '0';
    return (Math.floor(n * 10) / 10).toFixed(1);
}
var ABYSS_SLOTS = ['helmet','chest','pants','shoes','necklace','ring','weapon'];
var ABYSS_SLOT_NAMES = { helmet:'头盔', chest:'衣服', pants:'裤子', shoes:'鞋子', necklace:'项链', ring:'戒指', weapon:'武器' };
var ABYSS_SET_NAMES = ['无', '勇者', '暗影', '龙心', '虚空', '永恒', '修罗', '天罡', '幽冥', '神罚', '破灭'];
var ABYSS_EQUIP_NAMES = {
    helmet: ['龙鳞盔','荆棘冠','暗影帽','冰霜头箍','炎魔角','雷霆冠','幽魂面甲','圣光护额','噬魂帽','破军盔'],
    chest: ['龙心甲','影舞衣','寒铁胸甲','烈焰袍','雷纹战衣','幽影长袍','圣裁外衣','血怒战甲','虚空法袍','不屈之铠'],
    pants: ['龙鳞护腿','暗流腿甲','霜冻护腿','炎魔腿甲','雷鸣护腿','幽步长裤','圣行护腿','噬魂腿甲','破军护腿','虚空步甲'],
    shoes: ['龙行靴','暗影步靴','冰霜履','烈焰之足','雷霆战靴','幽魂靴','圣光之履','血行靴','虚空步靴','不屈战靴'],
    necklace: ['龙魂链','暗影之坠','冰心项链','炎玉坠','雷神链','幽魂吊坠','圣光护符','噬魂链','破军坠','虚空之眼'],
    ring: ['龙炎戒','暗影指环','冰霜戒','烈焰戒','雷霆戒','幽魂戒','圣光戒','噬魂指环','破军戒','虚空戒'],
    weapon: ['龙牙刃','暗影之锋','冰霜斩','烈焰裁决','雷霆之怒','幽魂镰','圣裁剑','噬魂刃','破军枪','虚空杖']
};
var ABYSS_EQUIP_SKILLS = [
    { id: 'eq1', name: '破甲', effect: { atk: 24, reduceMonsterDef: 8 } },
    { id: 'eq2', name: '致命', effect: { critRate: 5, critDmg: 38 } },
    { id: 'eq3', name: '嗜血', effect: { lifesteal: 5, atk: 16 } },
    { id: 'eq4', name: '神速', effect: { combo: 10, dodge: 5 } },
    { id: 'eq5', name: '强击', effect: { atk: 36, skillDmg: 14 } },
    { id: 'eq6', name: '铁壁', effect: { def: 45, hp: 240 } },
    { id: 'eq7', name: '穿云', effect: { reduceMonsterDef: 12, critDmg: 26 } },
    { id: 'eq8', name: '狂战', effect: { atk: 28, critRate: 7 } },
    { id: 'eq9', name: '灵巧', effect: { dodge: 10, combo: 8 } },
    { id: 'eq10', name: '法能', effect: { skillDmg: 30, atk: 12 } },
    { id: 'eq11', name: '坚韧', effect: { hp: 360, def: 24 } },
    { id: 'eq12', name: '碎甲', effect: { reduceMonsterDef: 15, atk: 18 } },
    { id: 'eq13', name: '暴虐', effect: { critDmg: 50, critRate: 3 } },
    { id: 'eq14', name: '吸血', effect: { lifesteal: 10, hp: 150 } },
    { id: 'eq15', name: '连打', effect: { combo: 15, atk: 12 } },
    { id: 'eq16', name: '奥术', effect: { skillDmg: 38 } },
    { id: 'eq17', name: '洞察', effect: { reduceMonsterDef: 10, critRate: 5 } },
    { id: 'eq18', name: '战意', effect: { atk: 45, hp: 180 } },
    { id: 'eq19', name: '幻步', effect: { dodge: 12, lifesteal: 3 } },
    { id: 'eq20', name: '毁灭', effect: { skillDmg: 20, critDmg: 45, reduceMonsterDef: 6 } },
    { id: 'eq21', name: '晕击', effect: { stunChance: 0.04, stunTurns: 1 } },
    { id: 'eq22', name: '重晕', effect: { stunChance: 0.1, stunTurns: 1 } },
    { id: 'eq23', name: '护盾术', effect: { shieldChance: 0.04, shieldPct: 0.18 } },
    { id: 'eq24', name: '坚甲', effect: { damageReduction: 0.1 } },
    { id: 'eq25', name: '破势', effect: { reduceMonsterDef: 24 } },
    { id: 'eq26', name: '冰封', effect: { stunChance: 0.06, stunTurns: 1 } },
    { id: 'eq27', name: '神佑', effect: { shieldChance: 0.1, shieldPct: 0.2 } },
    { id: 'eq28', name: '铁躯', effect: { damageReduction: 0.15 } },
    { id: 'eq29', name: '穿甲', effect: { reduceMonsterDef: 28 } },
    { id: 'eq30', name: '雷击', effect: { stunChance: 0.15, stunTurns: 1 } },
    { id: 'eq31', name: '灵盾', effect: { shieldChance: 0.05, shieldPct: 0.35 } },
    { id: 'eq32', name: '韧体', effect: { damageReduction: 0.08 } },
    { id: 'eq33', name: '卸甲', effect: { reduceMonsterDef: 20 } },
    { id: 'eq34', name: '震击', effect: { stunChance: 0.08, stunTurns: 1 } },
    { id: 'eq35', name: '壁垒', effect: { shieldChance: 0.06, shieldPct: 0.28 } },
    { id: 'eq36', name: '御敌', effect: { damageReduction: 0.18 } },
    { id: 'eq37', name: '碎防', effect: { reduceMonsterDef: 36 } },
    { id: 'eq38', name: '回春', effect: { healChance: 0.06, healPct: 0.1 } },
    { id: 'eq39', name: '噬魂', effect: { extraDmgChance: 0.1, extraDmgPct: 0.22 } },
    { id: 'eq40', name: '凝神', effect: { damageReduction: 0.05, shieldChance: 0.04, shieldPct: 0.12 } },
    { id: 'eq41', name: '防反', effect: { extraDmgFromDef: 0.22 } },
    { id: 'eq42', name: '生命打击', effect: { extraDmgFromMaxHp: 0.05 } },
    { id: 'eq43', name: '夺命', effect: { directPctMonsterHp: 0.025 } },
    { id: 'eq44', name: '铁壁击', effect: { extraDmgFromDef: 0.28 } },
    { id: 'eq45', name: '血气', effect: { extraDmgFromMaxHp: 0.07 } },
    { id: 'eq46', name: '斩魂', effect: { directPctMonsterHp: 0.05 } },
    { id: 'eq47', name: '破军', effect: { extraDmgFromAtk: 0.12 } },
    { id: 'eq48', name: '重甲', effect: { extraDmgFromDef: 0.38 } },
    { id: 'eq49', name: '生命燃烧', effect: { extraDmgFromMaxHp: 0.12 } },
    { id: 'eq50', name: '诛心', effect: { directPctMonsterHp: 0.07 } },
    { id: 'eq51', name: '锋芒', effect: { atk: 52, critRate: 5 } },
    { id: 'eq52', name: '固守', effect: { def: 72, hp: 300 } },
    { id: 'eq53', name: '疾风', effect: { dodge: 14, combo: 12 } },
    { id: 'eq54', name: '破军斩', effect: { reduceMonsterDef: 18, atk: 26 } },
    { id: 'eq55', name: '爆裂', effect: { critDmg: 62, skillDmg: 20 } },
    { id: 'eq56', name: '血怒', effect: { lifesteal: 8, atk: 20 } },
    { id: 'eq57', name: '洞察', effect: { reduceMonsterDef: 22, critRate: 7 } },
    { id: 'eq58', name: '雷霆', effect: { stunChance: 0.08, stunTurns: 1 } },
    { id: 'eq59', name: '神盾', effect: { shieldChance: 0.08, shieldPct: 0.28 } },
    { id: 'eq60', name: '金刚', effect: { damageReduction: 0.14 } },
    { id: 'eq61', name: '裂甲', effect: { extraDmgFromDef: 0.28 } },
    { id: 'eq62', name: '夺魂', effect: { directPctMonsterHp: 0.04 } },
    { id: 'eq63', name: '狂潮', effect: { extraDmgFromMaxHp: 0.06 } },
    { id: 'eq64', name: '战吼', effect: { atk: 42, hp: 240 } },
    { id: 'eq65', name: '鬼步', effect: { dodge: 16, lifesteal: 5 } },
    { id: 'eq66', name: '破魔', effect: { skillDmg: 45, reduceMonsterDef: 10 } },
    { id: 'eq67', name: '崩山', effect: { extraDmgFromAtk: 0.18 } },
    { id: 'eq68', name: '冰棘', effect: { stunChance: 0.12, stunTurns: 1 } },
    { id: 'eq69', name: '圣盾', effect: { shieldChance: 0.10, shieldPct: 0.30 } },
    { id: 'eq70', name: '不灭', effect: { damageReduction: 0.1, healChance: 0.05, healPct: 0.1 } },
    { id: 'eq71', name: '穿心', effect: { directPctMonsterHp: 0.01 } },
    { id: 'eq72', name: '铁骨', effect: { extraDmgFromDef: 0.38 } },
    { id: 'eq73', name: '血沸', effect: { extraDmgFromMaxHp: 0.1 } },
    { id: 'eq74', name: '暴风', effect: { combo: 20, atk: 18 } },
    { id: 'eq75', name: '魔能', effect: { skillDmg: 50, critDmg: 30 } },
    { id: 'eq76', name: '震魂', effect: { stunChance: 0.14, stunTurns: 1 } },
    { id: 'eq77', name: '龙鳞', effect: { shieldChance: 0.05, shieldPct: 0.45 } },
    { id: 'eq78', name: '坚毅', effect: { damageReduction: 0.16 } },
    { id: 'eq79', name: '碎魂', effect: { extraDmgChance: 0.16, extraDmgPct: 0.35 } },
    { id: 'eq80', name: '回生', effect: { healChance: 0.1, healPct: 0.18 } },
    { id: 'eq81', name: '斩龙', effect: { directPctMonsterMaxHp: 0.015 } },
    { id: 'eq82', name: '破势', effect: { reduceMonsterDef: 26, critDmg: 38 } },
    { id: 'eq83', name: '战魂', effect: { atk: 58, critRate: 10 } },
    { id: 'eq84', name: '玄甲', effect: { def: 100, damageReduction: 0.08 } },
    { id: 'eq85', name: '噬血', effect: { lifesteal: 12, hp: 180 } },
    { id: 'eq86', name: '雷域', effect: { stunChance: 0.18, stunTurns: 1 } },
    { id: 'eq87', name: '天护', effect: { shieldChance: 0.20, shieldPct: 0.10 } },
    { id: 'eq88', name: '崩防', effect: { extraDmgFromDef: 0.48 } },
    { id: 'eq89', name: '诛邪', effect: { directPctMonsterHp: 0.02 } },
    { id: 'eq90', name: '焚心', effect: { extraDmgFromMaxHp: 0.14 } },
    { id: 'eq91', name: '无双', effect: { atk: 64, combo: 10 } },
    { id: 'eq92', name: '神行', effect: { dodge: 20, combo: 18 } },
    { id: 'eq93', name: '破界', effect: { skillDmg: 55, reduceMonsterDef: 20 } },
    { id: 'eq94', name: '天罚', effect: { extraDmgFromAtk: 0.28 } },
    { id: 'eq95', name: '冰狱', effect: { stunChance: 0.2, stunTurns: 2 } },
    { id: 'eq96', name: '神佑', effect: { shieldChance: 0.3, shieldPct: 0.15 } },
    { id: 'eq97', name: '霸体', effect: { damageReduction: 0.24 } },
    { id: 'eq98', name: '噬魂', effect: { extraDmgChance: 0.24, extraDmgPct: 0.4 } },
    { id: 'eq99', name: '涅槃', effect: { healChance: 0.13, healPct: 0.22 } },
    { id: 'eq100', name: '灭世', effect: { directPctMonsterMaxHp: 0.025, extraDmgFromAtk: 0.24 } },
    { id: 'eq101', name: '分裂·微光', effect: { splitChance: 0.08, splitPct: 0.15 } },
    { id: 'eq102', name: '分裂·涟漪', effect: { splitChance: 0.1, splitPct: 0.18 } },
    { id: 'eq103', name: '分裂·溅射', effect: { splitChance: 0.12, splitPct: 0.22 } },
    { id: 'eq104', name: '分裂·扩散', effect: { splitChance: 0.14, splitPct: 0.26 } },
    { id: 'eq105', name: '分裂·震荡', effect: { splitChance: 0.16, splitPct: 0.3 } },
    { id: 'eq106', name: '分裂·冲击波', effect: { splitChance: 0.18, splitPct: 0.35 } },
    { id: 'eq107', name: '分裂·余波', effect: { splitChance: 0.2, splitPct: 0.4 } },
    { id: 'eq108', name: '分裂·崩裂', effect: { splitChance: 0.22, splitPct: 0.45 } },
    { id: 'eq109', name: '分裂·天崩', effect: { splitChance: 0.25, splitPct: 0.5 } },
    { id: 'eq110', name: '分裂·灭世', effect: { splitChance: 0.28, splitPct: 0.55 } },
    { id: 'eq111', name: '灵宠·攻', effect: { petAtk: 142 } },
    { id: 'eq112', name: '灵宠·守', effect: { petDef: 136, petHp: 1280 } },
    { id: 'eq113', name: '灵宠·命', effect: { petHp: 2480 } },
    { id: 'eq114', name: '灵宠·嗜', effect: { petLifesteal: 6, petAtk: 122 } },
    { id: 'eq115', name: '灵宠·闪', effect: { petDodge: 9 } },
    { id: 'eq116', name: '灵宠·暴', effect: { petCritRate: 7, petCritDmg: 55 } },
    { id: 'eq117', name: '灵宠·韧', effect: { petDamageReduction: 0.11, petHp: 2260 } },
    { id: 'eq118', name: '灵宠·锋', effect: { petAtk: 98, petCritRate: 5 } },
    { id: 'eq119', name: '灵宠·甲', effect: { petDef: 162, petDamageReduction: 0.07 } },
    { id: 'eq120', name: '灵宠·血', effect: { petHp: 1680, petLifesteal: 5 } },
    { id: 'eq121', name: '灵宠·影', effect: { petDodge: 14, petAtk: 128 } },
    { id: 'eq122', name: '灵宠·狂', effect: { petCritRate: 11, petCritDmg: 75 } },
    { id: 'eq123', name: '灵宠·壁', effect: { petDef: 182, petHp: 2420, petDamageReduction: 0.09 } },
    { id: 'eq124', name: '灵宠·噬', effect: { petLifesteal: 9, petAtk: 148, petHp: 1280 } },
    { id: 'eq125', name: '灵宠·幻', effect: { petDodge: 19, petCritRate: 6 } },
    { id: 'eq126', name: '灵宠·戮', effect: { petAtk: 95, petCritDmg: 68 } },
    { id: 'eq127', name: '灵宠·圣', effect: { petHp: 2950, petDamageReduction: 0.14, petLifesteal: 6 } },
    { id: 'eq128', name: '灵宠·神行', effect: { petDodge: 24, petAtk: 125, petDef: 72 } },
    { id: 'eq129', name: '灵宠·战神', effect: { petAtk: 150, petCritRate: 14, petCritDmg: 82 } },
    { id: 'eq130', name: '灵宠·至尊', effect: { petAtk: 282, petDef: 268, petHp: 4520, petLifesteal: 17, petDodge: 26, petCritRate: 18, petCritDmg: 58, petDamageReduction: 0.26 } },
    { id: 'eq131', name: '灵宠·分裂·微', effect: { petSplitChance: 0.1, petSplitPct: 0.28 } },
    { id: 'eq132', name: '灵宠·分裂·波', effect: { petSplitChance: 0.14, petSplitPct: 0.35 } },
    { id: 'eq133', name: '灵宠·分裂·震', effect: { petSplitChance: 0.18, petSplitPct: 0.42 } },
    { id: 'eq134', name: '灵宠·分裂·灭', effect: { petSplitChance: 0.22, petSplitPct: 0.60 } },
    { id: 'eq135', name: '灵宠·吸血·噬', effect: { petLifesteal: 10, petAtk: 1200 } },
    { id: 'eq136', name: '灵宠·吸血·渴', effect: { petLifesteal: 14, petHp: 1550 } },
    { id: 'eq137', name: '灵宠·吸血·魂', effect: { petLifesteal: 18, petAtk: 80, petHp: 2500 } },
    { id: 'eq138', name: '灵宠·吸血·王', effect: { petLifesteal: 22, petAtk: 150, petHp: 3000 } },
    // === 属性攻击与各类Buff扩展（200个）===
    { id: 'eq139', name: '灼烧', effect: { fireAtk: 25 } },
    { id: 'eq140', name: '冰冻', effect: { waterAtk: 22, stunChance: 0.05, stunTurns: 1 } },
    { id: 'eq141', name: '电伤', effect: { metalAtk: 28 } },
    { id: 'eq142', name: '中毒', effect: { poisonChance: 0.12, poisonDmgPct: 0.01, poisonTurns: 2 } },
    { id: 'eq143', name: '流血', effect: { bleedChance: 0.1, bleedDmgPct: 0.01, bleedTurns: 2 } },
    { id: 'eq144', name: '减防加攻', effect: { atk: 32, def: -15 } },
    { id: 'eq145', name: '减攻加防', effect: { atk: -18, def: 42 } },
    { id: 'eq146', name: '减生命加攻', effect: { atk: 38, hp: -250 } },
    { id: 'eq147', name: '减生命加防', effect: { def: 48, hp: -220 } },
    { id: 'eq148', name: '焚焰', effect: { fireAtk: 38, atk: 12 } },
    { id: 'eq149', name: '霜冻', effect: { waterAtk: 35, stunChance: 0.08, stunTurns: 1 } },
    { id: 'eq150', name: '雷域', effect: { metalAtk: 40, stunChance: 0.06, stunTurns: 1 } },
    { id: 'eq151', name: '剧毒', effect: { poisonChance: 0.12, poisonDmgPct: 0.015, poisonTurns: 2 } },
    { id: 'eq152', name: '撕裂', effect: { bleedChance: 0.12, bleedDmgPct: 0.015, bleedTurns: 2 } },
    { id: 'eq153', name: '破势·攻', effect: { atk: 45, def: -20 } },
    { id: 'eq154', name: '铁壁·守', effect: { atk: -22, def: 55 } },
    { id: 'eq155', name: '血气·锋', effect: { atk: 42, hp: -280 } },
    { id: 'eq156', name: '舍命·盾', effect: { def: 52, hp: -260 } },
    { id: 'eq157', name: '炎爆', effect: { fireAtk: 48, reduceMonsterDef: 6 } },
    { id: 'eq158', name: '寒狱', effect: { waterAtk: 42, stunChance: 0.05, stunTurns: 2 } },
    { id: 'eq159', name: '雷霆', effect: { metalAtk: 45, critRate: 3 } },
    { id: 'eq160', name: '腐毒', effect: { poisonChance: 0.2, poisonDmgPct: 0.02, poisonTurns: 2 } },
    { id: 'eq161', name: '血崩', effect: { bleedChance: 0.2, bleedDmgPct: 0.02, bleedTurns: 2 } },
    { id: 'eq162', name: '狂战·弃防', effect: { atk: 55, def: -25 } },
    { id: 'eq163', name: '龟甲·钝刃', effect: { atk: -28, def: 68 } },
    { id: 'eq164', name: '燃命·斩', effect: { atk: 50, hp: -320 } },
    { id: 'eq165', name: '献祭·壁', effect: { def: 62, hp: -300 } },
    { id: 'eq166', name: '赤炎', effect: { fireAtk: 55, critDmg: 20 } },
    { id: 'eq167', name: '极寒', effect: { waterAtk: 50, stunChance: 0.06, stunTurns: 2 } },
    { id: 'eq168', name: '电弧', effect: { metalAtk: 52, extraDmgChance: 0.08, extraDmgPct: 0.2 } },
    { id: 'eq169', name: '毒蚀', effect: { poisonChance: 0.20, poisonDmgPct: 0.025, poisonTurns: 3 } },
    { id: 'eq170', name: '创伤', effect: { bleedChance: 0.20, bleedDmgPct: 0.025, bleedTurns: 3 } },
    { id: 'eq171', name: '减暴加攻', effect: { atk: 48, critRate: -4 } },
    { id: 'eq172', name: '减爆伤加生命', effect: { critDmg: -30, hp: 400 } },
    { id: 'eq173', name: '加攻减闪', effect: { atk: 44, dodge: -6 } },
    { id: 'eq174', name: '加防减连', effect: { def: 58, combo: -10 } },
    { id: 'eq175', name: '易伤·破', effect: { vulnerablePct: 10, atk: 18 } },
    { id: 'eq176', name: '增伤·锋', effect: { damageIncreasePct: 12, atk: 15 } },
    { id: 'eq177', name: '反伤·刺', effect: { thornsPct: 18, def: 10 } },
    { id: 'eq178', name: '回春·续', effect: { hpRegenPerRound: 100, hp: 200 } },
    { id: 'eq179', name: '暴怒', effect: { atkPctWhenLowHp: 25, lowHpThreshold: 0.4, atk: 20 } },
    { id: 'eq180', name: '坚韧', effect: { defPctWhenLowHp: 30, lowHpThreshold: 0.35, def: 30 } },
    { id: 'eq181', name: '业火', effect: { fireAtk: 62, burnChance: 0.1, burnDmgPct: 0.01, burnTurns: 2 } },
    { id: 'eq182', name: '冰封', effect: { waterAtk: 58, stunChance: 0.05, stunTurns: 2 } },
    { id: 'eq183', name: '雷怒', effect: { metalAtk: 60, stunChance: 0.08, stunTurns: 1 } },
    { id: 'eq184', name: '瘴气', effect: { poisonChance: 0.06, poisonDmgPct: 0.035, poisonTurns: 3 } },
    { id: 'eq185', name: '割裂', effect: { bleedChance: 0.06, bleedDmgPct: 0.03, bleedTurns: 3 } },
    { id: 'eq186', name: '木煞', effect: { woodAtk: 35 } },
    { id: 'eq187', name: '土崩', effect: { earthAtk: 38 } },
    { id: 'eq188', name: '五行·火', effect: { fireAtk: 45, fireRes: 8 } },
    { id: 'eq189', name: '五行·水', effect: { waterAtk: 42, waterRes: 8 } },
    { id: 'eq190', name: '五行·雷', effect: { metalAtk: 48, metalRes: 8 } },
    { id: 'eq191', name: '五行·木', effect: { woodAtk: 40, woodRes: 8 } },
    { id: 'eq192', name: '五行·土', effect: { earthAtk: 44, earthRes: 8 } },
    { id: 'eq193', name: '双元·火雷', effect: { fireAtk: 28, metalAtk: 28 } },
    { id: 'eq194', name: '双元·冰雷', effect: { waterAtk: 28, metalAtk: 28 } },
    { id: 'eq195', name: '双元·火毒', effect: { fireAtk: 25, poisonChance: 0.12, poisonDmgPct: 0.02, poisonTurns: 3 } },
    { id: 'eq196', name: '双元·冰血', effect: { waterAtk: 25, bleedChance: 0.12, bleedDmgPct: 0.02, bleedTurns: 3 } },
    { id: 'eq197', name: '舍防·狂攻', effect: { atk: 58, def: -28 } },
    { id: 'eq198', name: '舍攻·铁壁', effect: { atk: -32, def: 75 } },
    { id: 'eq199', name: '血祭·攻', effect: { atk: 55, hp: -350 } },
    { id: 'eq200', name: '血祭·防', effect: { def: 68, hp: -340 } },
    { id: 'eq201', name: '灼烧·延', effect: { burnChance: 0.10, burnDmgPct: 0.01, burnTurns: 3 } },
    { id: 'eq202', name: '灼烧·烈', effect: { burnChance: 0.15, burnDmgPct: 0.015, burnTurns: 3 } },
    { id: 'eq203', name: '中毒·深', effect: { poisonChance: 0.10, poisonDmgPct: 0.02, poisonTurns: 3 } },
    { id: 'eq204', name: '中毒·剧', effect: { poisonChance: 0.15, poisonDmgPct: 0.025, poisonTurns: 3 } },
    { id: 'eq205', name: '流血·重', effect: { bleedChance: 0.10, bleedDmgPct: 0.03, bleedTurns: 3 } },
    { id: 'eq206', name: '流血·崩', effect: { bleedChance: 0.15, bleedDmgPct: 0.035, bleedTurns: 3 } },
    { id: 'eq207', name: '易伤·痕', effect: { vulnerablePct: 15 } },
    { id: 'eq208', name: '易伤·裂', effect: { vulnerablePct: 20, reduceMonsterDef: 8 } },
    { id: 'eq209', name: '增伤·破', effect: { damageIncreasePct: 15 } },
    { id: 'eq210', name: '增伤·灭', effect: { damageIncreasePct: 22, critDmg: 25 } },
    { id: 'eq211', name: '反伤·甲', effect: { thornsPct: 12, damageReduction: 0.05 } },
    { id: 'eq212', name: '反伤·刃', effect: { thornsPct: 15, atk: 15 } },
    { id: 'eq213', name: '回春·泉', effect: { hpRegenPerRound: 150 } },
    { id: 'eq214', name: '回春·涌', effect: { hpRegenPerRound: 220, healChance: 0.06, healPct: 0.08 } },
    { id: 'eq215', name: '暴怒·狂', effect: { atkPctWhenLowHp: 35, lowHpThreshold: 0.35 } },
    { id: 'eq216', name: '暴怒·绝', effect: { atkPctWhenLowHp: 50, lowHpThreshold: 0.3, atk: 25 } },
    { id: 'eq217', name: '坚韧·守', effect: { defPctWhenLowHp: 40, lowHpThreshold: 0.3 } },
    { id: 'eq218', name: '坚韧·固', effect: { defPctWhenLowHp: 55, lowHpThreshold: 0.25, damageReduction: 0.05 } },
    { id: 'eq219', name: '破魔·锋', effect: { reduceMonsterDef: 18, skillDmg: 25 } },
    { id: 'eq220', name: '破魔·崩', effect: { reduceMonsterDef: 25, skillDmg: 35 } },
    { id: 'eq221', name: '致盲·光', effect: { blindChance: 0.05, blindRounds: 1, atk: 18 } },
    { id: 'eq222', name: '致盲·暗', effect: { blindChance: 0.06, blindRounds: 2 } },
    { id: 'eq223', name: '沉默·封', effect: { silenceChance: 0.05, silenceRounds: 1, skillDmg: 20 } },
    { id: 'eq224', name: '沉默·禁', effect: { silenceChance: 0.06, silenceRounds: 2 } },
    { id: 'eq225', name: '减速·缚', effect: { slowChance: 0.10, slowPct: 15 } },
    { id: 'eq226', name: '减速·滞', effect: { slowChance: 0.12, slowPct: 25 } },
    { id: 'eq227', name: '加速·风', effect: { combo: 18, dodge: 5 } },
    { id: 'eq228', name: '加速·疾', effect: { combo: 25, atk: 12 } },
    { id: 'eq229', name: '吸血·噬', effect: { lifesteal: 12, atk: 22 } },
    { id: 'eq230', name: '吸血·渴', effect: { lifesteal: 18, hp: 250 } },
    { id: 'eq231', name: '护盾·凝', effect: { shieldChance: 0.12, shieldPct: 0.25 } },
    { id: 'eq232', name: '护盾·固', effect: { shieldChance: 0.15, shieldPct: 0.35 } },
    { id: 'eq233', name: '减伤·皮', effect: { damageReduction: 0.12 } },
    { id: 'eq234', name: '减伤·骨', effect: { damageReduction: 0.2, def: 30 } },
    { id: 'eq235', name: '暴击·锐', effect: { critRate: 10, critDmg: 40 } },
    { id: 'eq236', name: '暴击·戮', effect: { critRate: 14, critDmg: 55 } },
    { id: 'eq237', name: '连击·雨', effect: { combo: 22, atk: 18 } },
    { id: 'eq238', name: '连击·崩', effect: { combo: 30, critRate: 5 } },
    { id: 'eq239', name: '闪避·影', effect: { dodge: 18, lifesteal: 4 } },
    { id: 'eq240', name: '闪避·幻', effect: { dodge: 24, atk: 15 } },
    { id: 'eq241', name: '火攻·焰', effect: { fireAtk: 68, atk: 20 } },
    { id: 'eq242', name: '冰攻·霜', effect: { waterAtk: 62, stunChance: 0.1, stunTurns: 2 } },
    { id: 'eq243', name: '雷攻·霆', effect: { metalAtk: 65, critRate: 5 } },
    { id: 'eq244', name: '毒攻·蚀', effect: { poisonChance: 0.2, poisonDmgPct: 0.035, poisonTurns: 2 } },
    { id: 'eq245', name: '血攻·裂', effect: { bleedChance: 0.2, bleedDmgPct: 0.035, bleedTurns: 2 } },
    { id: 'eq246', name: '均衡·攻防', effect: { atk: 35, def: 35 } },
    { id: 'eq247', name: '均衡·命攻', effect: { atk: 40, hp: 300 } },
    { id: 'eq248', name: '偏锋·攻', effect: { atk: 72, def: -30, hp: -200 } },
    { id: 'eq249', name: '偏锋·守', effect: { def: 85, atk: -35, hp: -200 } },
    { id: 'eq250', name: '诅咒·弱攻', effect: { atk: -20, def: 50, damageReduction: 0.1 } },
    { id: 'eq251', name: '诅咒·弱防', effect: { def: -25, atk: 55, critRate: 8 } },
    { id: 'eq252', name: '祝福·攻', effect: { atk: 50, hp: 200 } },
    { id: 'eq253', name: '祝福·守', effect: { def: 60, hp: 250 } },
    { id: 'eq254', name: '祝福·命', effect: { hp: 450, lifesteal: 5 } },
    { id: 'eq255', name: '狂化·一', effect: { atk: 65, dodge: -8, def: -15 } },
    { id: 'eq256', name: '狂化·二', effect: { atk: 80, lifesteal: -3, def: -20 } },
    { id: 'eq257', name: '稳守·一', effect: { def: 90, atk: -40, combo: -12 } },
    { id: 'eq258', name: '稳守·二', effect: { def: 110, damageReduction: 0.1, atk: -50 } },
    { id: 'eq259', name: '灼烧·爆', effect: { fireAtk: 55, burnChance: 0.18, burnDmgPct: 0.02, burnTurns: 3 } },
    { id: 'eq260', name: '冰冻·封', effect: { waterAtk: 52, stunChance: 0.15, stunTurns: 2 } },
    { id: 'eq261', name: '电伤·链', effect: { metalAtk: 58, stunChance: 0.12, stunTurns: 1 } },
    { id: 'eq262', name: '中毒·亡', effect: { poisonChance: 0.20, poisonDmgPct: 0.035, poisonTurns: 3 } },
    { id: 'eq263', name: '流血·亡', effect: { bleedChance: 0.20, bleedDmgPct: 0.035, bleedTurns: 3 } },
    { id: 'eq264', name: '三元·火冰雷', effect: { fireAtk: 22, waterAtk: 22, metalAtk: 22 } },
    { id: 'eq265', name: '三元·毒血灼', effect: { poisonChance: 0.1, poisonDmgPct: 0.02, bleedChance: 0.1, bleedDmgPct: 0.02, fireAtk: 25 } },
    { id: 'eq266', name: '破甲·穿', effect: { reduceMonsterDef: 35, atk: 25 } },
    { id: 'eq267', name: '破甲·碎', effect: { reduceMonsterDef: 45, critDmg: 30 } },
    { id: 'eq268', name: '生命·燃', effect: { extraDmgFromMaxHp: 0.08, hp: 200 } },
    { id: 'eq269', name: '生命·沸', effect: { extraDmgFromMaxHp: 0.12, hp: 150 } },
    { id: 'eq270', name: '防御·击', effect: { extraDmgFromDef: 0.35, def: 40 } },
    { id: 'eq271', name: '防御·崩', effect: { extraDmgFromDef: 0.48, def: 30 } },
    { id: 'eq272', name: '斩杀·残', effect: { directPctMonsterHp: 0.03, atk: 20 } },
    { id: 'eq273', name: '斩杀·灭', effect: { directPctMonsterMaxHp: 0.03, directPctMonsterHp: 0.03 } },
    { id: 'eq274', name: '眩晕·震', effect: { stunChance: 0.12, stunTurns: 2 } },
    { id: 'eq275', name: '眩晕·锁', effect: { stunChance: 0.15, stunTurns: 2 } },
    { id: 'eq276', name: '治疗·润', effect: { healChance: 0.10, healPct: 0.15 } },
    { id: 'eq277', name: '治疗·涌', effect: { healChance: 0.15, healPct: 0.22 } },
    { id: 'eq278', name: '额外·伤', effect: { extraDmgChance: 0.2, extraDmgPct: 0.35 } },
    { id: 'eq279', name: '额外·崩', effect: { extraDmgChance: 0.28, extraDmgPct: 0.45 } },
    { id: 'eq280', name: '分裂·散', effect: { splitChance: 0.18, splitPct: 0.35 } },
    { id: 'eq281', name: '分裂·爆', effect: { splitChance: 0.25, splitPct: 0.45 } },
    { id: 'eq282', name: '火抗·焰', effect: { fireRes: 15, fireAtk: 30 } },
    { id: 'eq283', name: '冰抗·霜', effect: { waterRes: 15, waterAtk: 28 } },
    { id: 'eq284', name: '雷抗·霆', effect: { metalRes: 15, metalAtk: 30 } },
    { id: 'eq285', name: '全抗·微', effect: { metalRes: 6, woodRes: 6, waterRes: 6, fireRes: 6, earthRes: 6 } },
    { id: 'eq286', name: '全抗·中', effect: { metalRes: 10, woodRes: 10, waterRes: 10, fireRes: 10, earthRes: 10 } },
    { id: 'eq287', name: '全攻·微', effect: { metalAtk: 18, woodAtk: 18, waterAtk: 18, fireAtk: 18, earthAtk: 18 } },
    { id: 'eq288', name: '全攻·中', effect: { metalAtk: 25, woodAtk: 25, waterAtk: 25, fireAtk: 25, earthAtk: 25 } },
    { id: 'eq289', name: '灼烧·王', effect: { fireAtk: 75, burnChance: 0.15, burnDmgPct: 0.025, burnTurns: 3 } },
    { id: 'eq290', name: '冰冻·王', effect: { waterAtk: 70, stunChance: 0.08, stunTurns: 3 } },
    { id: 'eq291', name: '电伤·王', effect: { metalAtk: 72, stunChance: 0.15, stunTurns: 2 } },
    { id: 'eq292', name: '中毒·王', effect: { poisonChance: 0.25, poisonDmgPct: 0.04, poisonTurns: 2 } },
    { id: 'eq293', name: '流血·王', effect: { bleedChance: 0.22, bleedDmgPct: 0.04, bleedTurns: 2 } },
    { id: 'eq294', name: '易伤·王', effect: { vulnerablePct: 25, damageIncreasePct: 15 } },
    { id: 'eq295', name: '增伤·王', effect: { damageIncreasePct: 28, atk: 30 } },
    { id: 'eq296', name: '反伤·王', effect: { thornsPct: 17, damageReduction: 0.08 } },
    { id: 'eq297', name: '回春·王', effect: { hpRegenPerRound: 280, healChance: 0.1, healPct: 0.12 } },
    { id: 'eq298', name: '暴怒·王', effect: { atkPctWhenLowHp: 60, lowHpThreshold: 0.3, atk: 35 } },
    { id: 'eq299', name: '坚韧·王', effect: { defPctWhenLowHp: 65, lowHpThreshold: 0.25, def: 45 } },
    { id: 'eq300', name: '破防·极', effect: { atk: 78, def: -35 } },
    { id: 'eq301', name: '铁壁·极', effect: { def: 95, atk: -42 } },
    { id: 'eq302', name: '燃命·极', effect: { atk: 72, hp: -500 } },
    { id: 'eq303', name: '献祭·极', effect: { def: 82, hp: -580 } },
    { id: 'eq304', name: '混元·火', effect: { fireAtk: 58, waterAtk: 20, metalAtk: 20 } },
    { id: 'eq305', name: '混元·冰', effect: { waterAtk: 55, fireAtk: 20, metalAtk: 20 } },
    { id: 'eq306', name: '混元·雷', effect: { metalAtk: 58, fireAtk: 20, waterAtk: 20 } },
    { id: 'eq307', name: '混元·毒', effect: { poisonChance: 0.1, poisonDmgPct: 0.025, bleedChance: 0.1, bleedDmgPct: 0.025 } },
    { id: 'eq308', name: '混元·血', effect: { bleedChance: 0.1, bleedDmgPct: 0.025, burnChance: 0.1, burnDmgPct: 0.025 } },
    { id: 'eq309', name: '深渊·灼', effect: { fireAtk: 80, burnChance: 0.20, burnDmgPct: 0.025, burnTurns: 3 } },
    { id: 'eq310', name: '深渊·冻', effect: { waterAtk: 75, stunChance: 0.25, stunTurns: 3 } },
    { id: 'eq311', name: '深渊·雷', effect: { metalAtk: 78, stunChance: 0.18, stunTurns: 2 } },
    { id: 'eq312', name: '深渊·毒', effect: { poisonChance: 0.20, poisonDmgPct: 0.055, poisonTurns: 2 } },
    { id: 'eq313', name: '深渊·血', effect: { bleedChance: 0.20, bleedDmgPct: 0.055, bleedTurns: 2 } },
    { id: 'eq314', name: '深渊·破', effect: { atk: 185, def: -138 } },
    { id: 'eq315', name: '深渊·壁', effect: { def: 175, atk: -148 } },
    { id: 'eq316', name: '深渊·命攻', effect: { atk: 100, hp: -650 } },
    { id: 'eq317', name: '深渊·命防', effect: { def: 102, hp: -620 } },
    { id: 'eq318', name: '深渊·易伤', effect: { vulnerablePct: 30, reduceMonsterDef: 15 } },
    { id: 'eq319', name: '深渊·增伤', effect: { damageIncreasePct: 32, critDmg: 40 } },
    { id: 'eq320', name: '深渊·反伤', effect: { thornsPct: 20, def: 35 } },
    { id: 'eq321', name: '深渊·回春', effect: { hpRegenPerRound: 320, healChance: 0.12, healPct: 0.15 } },
    { id: 'eq322', name: '深渊·暴怒', effect: { atkPctWhenLowHp: 70, lowHpThreshold: 0.28 } },
    { id: 'eq323', name: '深渊·坚韧', effect: { defPctWhenLowHp: 75, lowHpThreshold: 0.22, damageReduction: 0.1 } },
    { id: 'eq324', name: '全能·攻', effect: { atk: 55, critRate: 8, critDmg: 35 } },
    { id: 'eq325', name: '全能·守', effect: { def: 70, hp: 400, damageReduction: 0.12 } },
    { id: 'eq326', name: '全能·命', effect: { hp: 550, lifesteal: 10, healChance: 0.08, healPct: 0.1 } },
    { id: 'eq327', name: '全能·元', effect: { fireAtk: 35, waterAtk: 35, metalAtk: 35 } },
    { id: 'eq328', name: '全能·咒', effect: { vulnerablePct: 12, damageIncreasePct: 12, atk: 25 } },
    { id: 'eq329', name: '全能·反', effect: { thornsPct: 15, damageReduction: 0.1, def: 40 } },
    { id: 'eq330', name: '全能·复', effect: { hpRegenPerRound: 200, healChance: 0.1, healPct: 0.12 } },
    { id: 'eq331', name: '全能·怒', effect: { atkPctWhenLowHp: 40, defPctWhenLowHp: 35, lowHpThreshold: 0.35 } },
    { id: 'eq332', name: '全能·毒血', effect: { poisonChance: 0.18, poisonDmgPct: 0.01, bleedChance: 0.18, bleedDmgPct: 0.01 } },
    { id: 'eq333', name: '全能·灼冻', effect: { fireAtk: 42, waterAtk: 42, stunChance: 0.08, stunTurns: 1 } },
    { id: 'eq334', name: '全能·破甲', effect: { reduceMonsterDef: 40, atk: 35, critDmg: 30 } },
    { id: 'eq335', name: '全能·护盾', effect: { shieldChance: 0.15, shieldPct: 0.4, damageReduction: 0.08 } },
    { id: 'eq336', name: '全能·眩晕', effect: { stunChance: 0.15, stunTurns: 2, atk: 28 } },
    { id: 'eq337', name: '全能·分裂', effect: { splitChance: 0.22, splitPct: 0.7, atk: 22 } },
    { id: 'eq338', name: '全能·至尊', effect: { atk: 145, def: 150, hp: 1350, fireAtk: 25, waterAtk: 25, metalAtk: 25, vulnerablePct: 8, damageIncreasePct: 10, thornsPct: 12, hpRegenPerRound: 80 } }
];
var ABYSS_EQUIP_SKILL_TIER_RANGES = [
    { start: 0, end: 94 },    
    { start: 95, end: 249 },  
    { start: 250, end: 337 }   
];
var ABYSS_EQUIP_SKILL_TIER_PROBS = [0.85, 0.10, 0.05];
function getAbyssEquipSkillById(id) {
    if (!id) return null;
    if (!window._abyssEquipSkillById) {
        window._abyssEquipSkillById = {};
        for (var i = 0; i < ABYSS_EQUIP_SKILLS.length; i++) window._abyssEquipSkillById[ABYSS_EQUIP_SKILLS[i].id] = ABYSS_EQUIP_SKILLS[i];
    }
    return window._abyssEquipSkillById[id] || null;
}

function abyssEquipSkillDedupeKey(esk) {
    if (!esk) return '';
    if (esk.id != null && esk.id !== '') return String(esk.id);
    return 'n:' + String(esk.name || '');
}
function abyssPickEquipSkillByTier() {
    var r = Math.random();
    var cum = 0;
    for (var t = 0; t < ABYSS_EQUIP_SKILL_TIER_PROBS.length; t++) {
        cum += ABYSS_EQUIP_SKILL_TIER_PROBS[t];
        if (r < cum) {
            var rng = ABYSS_EQUIP_SKILL_TIER_RANGES[t];
            var idx = rng.start + Math.floor(Math.random() * (rng.end - rng.start + 1));
            return ABYSS_EQUIP_SKILLS[idx];
        }
    }
    return ABYSS_EQUIP_SKILLS[0];
}

function abyssPickEquipSkillForStartGear() {
    var rng = ABYSS_EQUIP_SKILL_TIER_RANGES[0];
    var idx = rng.start + Math.floor(Math.random() * (rng.end - rng.start + 1));
    return ABYSS_EQUIP_SKILLS[idx];
}

// 无限深渊-装备符文（每件装备最多3个符文槽）
var ABYSS_RUNES = [
    { id: 'rune_atk', name: '攻击符文', effect: { atk: 38 } },
    { id: 'rune_hp', name: '生命符文', effect: { hp: 320 } },
    { id: 'rune_def', name: '护甲符文', effect: { def: 26 } },
    { id: 'rune_crit', name: '暴击符文', effect: { critRate: 3, critDmg: 20 } },
    { id: 'rune_dodge', name: '闪避符文', effect: { dodge: 4 } },
    { id: 'rune_life', name: '吸血符文', effect: { lifesteal: 7 } },
    { id: 'rune_combo', name: '连击符文', effect: { combo: 5 } },
    { id: 'rune_skill', name: '法强符文', effect: { skillDmg: 12 } },
    { id: 'rune_break', name: '破甲符文', effect: { reduceMonsterDef: 6 } },
    { id: 'rune_str', name: '力量符文', effect: { str: 9 } },
    { id: 'rune_agi', name: '敏捷符文', effect: { agi: 9 } },
    { id: 'rune_int', name: '智力符文', effect: { int: 9 } },
    { id: 'rune_sta', name: '体力符文', effect: { sta: 9 } },
    { id: 'rune_fire', name: '火攻符文', effect: { fireAtk: 8 } },
    { id: 'rune_ice', name: '冰攻符文', effect: { waterAtk: 8 } },
    { id: 'rune_metal', name: '金攻符文', effect: { metalAtk: 8 } }
];
var ABYSS_MAX_RUNE_SLOTS = 3;

// 无限深渊-装备宝石（每件装备最多3个宝石槽）
var ABYSS_GEMS = [
    { id: 'gem_hp', name: '生命宝石', effect: { hp: 260 } },
    { id: 'gem_atk', name: '攻击宝石', effect: { atk: 32 } },
    { id: 'gem_def', name: '防御宝石', effect: { def: 22 } },
    { id: 'gem_crit', name: '暴击宝石', effect: { critRate: 2, critDmg: 15 } },
    { id: 'gem_dodge', name: '闪避宝石', effect: { dodge: 6 } },
    { id: 'gem_life', name: '吸血宝石', effect: { lifesteal: 5 } },
    { id: 'gem_combo', name: '连击宝石', effect: { combo: 4 } },
    { id: 'gem_skill', name: '法强宝石', effect: { skillDmg: 10 } },
    { id: 'gem_break', name: '破甲宝石', effect: { reduceMonsterDef: 5 } },
    { id: 'gem_str', name: '力量宝石', effect: { str: 7 } },
    { id: 'gem_agi', name: '敏捷宝石', effect: { agi: 7 } },
    { id: 'gem_int', name: '智力宝石', effect: { int: 7 } },
    { id: 'gem_sta', name: '体力宝石', effect: { sta: 7 } },
    { id: 'gem_exp', name: '经验宝石', effect: { expGainPct: 5 } },
    { id: 'gem_gold', name: '金币宝石', effect: { goldGainPct: 5 } }
];
var ABYSS_MAX_GEM_SLOTS = 3;

// 统计当前出战宠物内丹带来的整体加成（人物/怪物/经验金币）
function abyssGetNeidanBonuses() {
    var res = {
        atkPct: 0,
        hpPct: 0,
        defPct: 0,
        critRate: 0,
        critDmg: 0,
        lifestealPct: 0,
        damageReduction: 0,
        reduceMonsterDef: 0,
        vulnerablePct: 0,
        expPct: 0,
        goldPct: 0
    };
    if (!abyssRun || !abyssRun.pets || !abyssRun.deployedPetIds) return res;
    var activeIds = abyssRun.deployedPetIds.slice();
    for (var i = 0; i < abyssRun.pets.length; i++) {
        var pet = abyssRun.pets[i];
        if (!pet || !pet.neidan) continue;
        if (activeIds.indexOf(pet.id) < 0 && !abyssRun.petGuard) continue;
        var lvl = pet.neidan.level || 1;
        var mult = 1 + 0.2 * (Math.max(1, Math.min(5, lvl)) - 1);
        var pl = pet.neidan.player || {};
        var gl = pet.neidan.global || {};
        if (pl.atkPct) res.atkPct += pl.atkPct * mult;
        if (pl.hpPct) res.hpPct += pl.hpPct * mult;
        if (pl.defPct) res.defPct += pl.defPct * mult;
        if (pl.critRate) res.critRate += pl.critRate * mult;
        if (pl.critDmg) res.critDmg += pl.critDmg * mult;
        if (pl.lifestealPct) res.lifestealPct += pl.lifestealPct * mult;
        if (pl.damageReduction) res.damageReduction += pl.damageReduction * mult;
        if (gl.reduceMonsterDef) res.reduceMonsterDef += gl.reduceMonsterDef * mult;
        if (gl.vulnerablePct) res.vulnerablePct += gl.vulnerablePct * mult;
        if (gl.expPct) res.expPct += gl.expPct * mult;
        if (gl.goldPct) res.goldPct += gl.goldPct * mult;
    }
    return res;
}

// 深渊装备（符文+宝石）提供的经验/金币获得加成（百分比），以及升级选择的加成
function abyssGetExpGoldBonus() {
    var expPct = 0, goldPct = 0;
    if (!abyssRun) return { expPct: expPct, goldPct: goldPct };
    if (abyssRun.equipped) {
        for (var ek in abyssRun.equipped) {
            var eq = abyssRun.equipped[ek];
            if (!eq) continue;
            var runes = eq.runes || [];
            for (var ri = 0; ri < runes.length; ri++) {
                var r = runes[ri] ? getAbyssRuneById(runes[ri]) : null;
                if (r && r.effect) { expPct += r.effect.expGainPct || 0; goldPct += r.effect.goldGainPct || 0; }
            }
            var gems = eq.gems || [];
            for (var gi = 0; gi < gems.length; gi++) {
                var g = gems[gi] ? getAbyssGemById(gems[gi]) : null;
                if (g && g.effect) { expPct += g.effect.expGainPct || 0; goldPct += g.effect.goldGainPct || 0; }
            }
        }
    }
    if (abyssRun.buffs) {
        expPct += abyssRun.buffs.expPct || 0;
        goldPct += abyssRun.buffs.goldPct || 0;
    }
    if (abyssRun.curseRounds > 0 && abyssRun.rewardEffects) {
        expPct += abyssRun.rewardEffects.expPct || 0;
        goldPct += abyssRun.rewardEffects.goldPct || 0;
    }
    // 内丹额外经验/金币加成
    var nd = abyssGetNeidanBonuses();
    if (nd.expPct) expPct += nd.expPct;
    if (nd.goldPct) goldPct += nd.goldPct;
    return { expPct: expPct, goldPct: goldPct };
}
function abyssApplyExpGoldBonus(baseExp, baseGold) {
    var b = abyssGetExpGoldBonus();
    return {
        exp: Math.floor((baseExp || 0) * (1 + (b.expPct || 0) / 100)),
        gold: Math.floor((baseGold || 0) * (1 + (b.goldPct || 0) / 100))
    };
}

function getAbyssRuneById(runeId) {
    for (var i = 0; i < ABYSS_RUNES.length; i++) if (ABYSS_RUNES[i].id === runeId) return ABYSS_RUNES[i];
    return null;
}
function getAbyssGemById(gemId) {
    for (var i = 0; i < ABYSS_GEMS.length; i++) if (ABYSS_GEMS[i].id === gemId) return ABYSS_GEMS[i];
    return null;
}

function abyssRollRuneSlotCount() {
    var r = Math.random();
    if (r < 0.80) return 0;
    if (r < 0.95) return 1;
    return 2;
}

function abyssRollGemSlotCount() {
    var r = Math.random();
    if (r < 0.75) return 0;
    if (r < 0.90) return 1;
    if (r < 0.95) return 2;
    return 3;
}

function getAbyssTower() {
    if (!player.abyssTower) {
        player.abyssTower = { exclusiveCurrency: 0, bestFloor: 0, level: 0, startGearCount: 0, startGearPurchaseCount: 0, startGoldBonus: 0, startPetCount: 0, deployedSlotsPurchases: 0, permanentBonuses: { hp: 0, atk: 0, def: 0, critRate: 0, critDmg: 0, dodge: 0, lifesteal: 0, combo: 0 }, abyssVault: {} };
    }
    if (!player.abyssTower.abyssVault) player.abyssTower.abyssVault = {};
    return player.abyssTower;
}


// 深渊战斗逻辑
var ABYSS_ATTACK_MIN_INTERVAL_MS = 700;
var abyssAutoAttackInterval = null;
function abyssIsTowerPanelOpen() {
    var overlay = document.getElementById('abyssTowerOverlay');
    return !!(overlay && overlay.style.display !== 'none' && overlay.style.display);
}
function toggleAbyssAutoAttack() {
    if (!abyssRun || !abyssRun.active) return;
    abyssRun.autoAttack = !abyssRun.autoAttack;
    var statusEl = document.getElementById('abyssAutoAttackStatus');
    if (statusEl) statusEl.textContent = abyssRun.autoAttack ? '开' : '关';
    if (abyssRun.autoAttack) {
        if (abyssAutoAttackInterval) {
            if (typeof window.unregisterInterval === 'function') window.unregisterInterval(abyssAutoAttackInterval);
            else clearInterval(abyssAutoAttackInterval);
            abyssAutoAttackInterval = null;
        }
        abyssAutoAttackInterval = (typeof window.registerInterval === 'function' ? window.registerInterval : registerInterval)(function() {
            if (!abyssRun || !abyssRun.active || !abyssIsTowerPanelOpen()) {
                stopAbyssAutoAttack();
                return;
            }
            if (abyssRun.pendingChoice || abyssRun.pendingUpgradeChoice || abyssRun.pendingSoulChoice) return;
            if (typeof abyssGetAliveMonsters === 'function' && abyssGetAliveMonsters().length === 0) return;
            abyssAttack();
        }, ABYSS_ATTACK_MIN_INTERVAL_MS);
    } else {
        stopAbyssAutoAttack();
    }
}
function stopAbyssAutoAttack() {
    if (abyssRun) abyssRun.autoAttack = false;
    var statusEl = document.getElementById('abyssAutoAttackStatus');
    if (statusEl) statusEl.textContent = '关';
    if (abyssAutoAttackInterval) {
        if (typeof window.unregisterInterval === 'function') window.unregisterInterval(abyssAutoAttackInterval);
        else clearInterval(abyssAutoAttackInterval);
        abyssAutoAttackInterval = null;
    }
}
/** 场上仅剩 hp<=0 的尸体、无存活怪时推进关卡（群秒/AOE 漏删怪物会导致 abyssAttack 开头直接 return 而卡死） */
function abyssRecoverDeadMonsterWave() {
    if (!abyssRun || !abyssRun.active || abyssRun.pendingChoice || abyssRun.pendingUpgradeChoice || abyssRun.pendingSoulChoice) return false;
    if (!abyssRun.monsters || abyssRun.monsters.length === 0) return false;
    if (abyssGetAliveMonsters().length > 0) return false;
    abyssRun.monsters = [];
    abyssRun.monster = null;
    stopAbyssAutoAttack();
    abyssOnKillMonster();
    return true;
}
function abyssAttackReleaseLock() {
    abyssAttack._inProgress = false;
    abyssAttack._deferredRun = false;
    abyssAttack._rafRunning = false;
    var attackBtn = document.getElementById('abyssManualAttackBtn');
    if (!attackBtn) return;
    var elapsed = Date.now() - (abyssAttack._lastStart || 0);
    var remain = ABYSS_ATTACK_MIN_INTERVAL_MS - elapsed;
    if (remain > 0) {
        attackBtn.disabled = true;
        attackBtn.style.pointerEvents = 'none';
        attackBtn.style.opacity = '0.55';
        if (abyssAttackReleaseLock._timer) clearTimeout(abyssAttackReleaseLock._timer);
        abyssAttackReleaseLock._timer = setTimeout(function() {
            var btn = document.getElementById('abyssManualAttackBtn');
            if (btn) {
                btn.disabled = false;
                btn.style.pointerEvents = '';
                btn.style.opacity = '';
            }
        }, remain);
        return;
    }
    attackBtn.disabled = false;
    attackBtn.style.pointerEvents = '';
    attackBtn.style.opacity = '';
}
/** 无限深渊：装备技能「击中后概率触发」（护盾、回复、眩晕、DOT、分裂等）。原实现写在单体分支内，群体技能（aoe）整段未执行，导致护盾等永不触发。返回 true 表示需中断 abyssAttack（与内联 return 一致）。 */
function abyssApplyEquipSkillProcEffects(stats, m, finalDmgForProcs, equipSkillOnceThisHit) {
    if (!abyssRun || !abyssRun.active || !stats || !m) return false;
    if (!equipSkillOnceThisHit) equipSkillOnceThisHit = {};
    for (var _sei2 = 0; _sei2 < ABYSS_SLOTS.length; _sei2++) {
        var ek = ABYSS_SLOTS[_sei2];
        var eq = abyssRun.equipped[ek];
        if (!eq) continue;
        var skillList = [eq.equipSkill, eq.skillSlot].filter(Boolean);
        for (var skIdx = 0; skIdx < skillList.length; skIdx++) {
            var esk = skillList[skIdx];
            if (!esk || !esk.effect) continue;
            var _hdK2 = abyssEquipSkillDedupeKey(esk);
            if (_hdK2 && equipSkillOnceThisHit[_hdK2]) continue;
            if (_hdK2) equipSkillOnceThisHit[_hdK2] = true;
            var eff = esk.effect;
            var skillName = esk.name || '';
            if (eff.stunChance && Math.random() < eff.stunChance) {
                m.stunned = (m.stunned || 0) + (eff.stunTurns || 1);
                abyssLog('【' + skillName + '】眩晕怪物 ' + (eff.stunTurns || 1) + ' 回合！');
                abyssPushTriggeredBuff(skillName, '眩晕怪物 ' + (eff.stunTurns || 1) + ' 回合');
            }
            if (eff.shieldChance && Math.random() < eff.shieldChance) {
                var sh = Math.floor(stats.maxHp * (eff.shieldPct || 0.1));
                abyssRun.player.shield = (abyssRun.player.shield || 0) + sh;
                abyssLog('【' + skillName + '】获得护盾 ' + formatNumber(sh));
                abyssPushTriggeredBuff(skillName, '获得护盾 ' + formatNumber(sh));
            }
            if (eff.healChance && Math.random() < eff.healChance) {
                var healAmt = Math.floor(stats.maxHp * (eff.healPct || 0.05));
                abyssRun.player.hp = Math.min(stats.maxHp, abyssRun.player.hp + healAmt);
                abyssLog('【' + skillName + '】回复 ' + formatNumber(healAmt) + ' 生命');
                abyssPushTriggeredBuff(skillName, '回复 ' + formatNumber(healAmt) + ' 生命');
            }
            if (eff.extraDmgChance && Math.random() < eff.extraDmgChance) {
                var extraTotal = Math.max(1, Math.floor(finalDmgForProcs * (eff.extraDmgPct || 0.1)));
                var remainExtra = extraTotal;
                if (m.shield > 0) {
                    var toSh = Math.min(m.shield, remainExtra);
                    m.shield -= toSh;
                    remainExtra -= toSh;
                }
                if (remainExtra > 0) m.hp -= remainExtra;
                abyssLog('【' + skillName + '】额外造成 ' + formatNumber(extraTotal) + ' 伤害');
                abyssPushTriggeredBuff(skillName, '额外造成 ' + formatNumber(extraTotal) + ' 伤害');
            }
            if (eff.burnChance != null && Math.random() < eff.burnChance) {
                m.burnTurns = Math.max(m.burnTurns || 0, eff.burnTurns || 3);
                m.burnDmgPct = (m.burnDmgPct || 0) + (eff.burnDmgPct || 0.02);
                abyssLog('【' + skillName + '】施加灼烧 ' + (eff.burnTurns || 3) + ' 回合');
                abyssPushTriggeredBuff(skillName, '施加灼烧');
            }
            if (eff.poisonChance != null && Math.random() < eff.poisonChance) {
                m.poisonTurns = Math.max(m.poisonTurns || 0, eff.poisonTurns || 3);
                m.poisonDmgPct = (m.poisonDmgPct || 0) + (eff.poisonDmgPct || 0.02);
                abyssLog('【' + skillName + '】施加中毒 ' + (eff.poisonTurns || 3) + ' 回合');
                abyssPushTriggeredBuff(skillName, '施加中毒');
            }
            if (eff.bleedChance != null && Math.random() < eff.bleedChance) {
                m.bleedTurns = Math.max(m.bleedTurns || 0, eff.bleedTurns || 3);
                m.bleedDmgPct = (m.bleedDmgPct || 0) + (eff.bleedDmgPct || 0.02);
                abyssLog('【' + skillName + '】施加流血 ' + (eff.bleedTurns || 3) + ' 回合');
                abyssPushTriggeredBuff(skillName, '施加流血');
            }
            if (eff.splitChance != null && eff.splitPct != null && Math.random() < eff.splitChance) {
                var aliveAll = abyssGetAliveMonsters();
                var others = [];
                for (var oi = 0; oi < aliveAll.length; oi++) { if (aliveAll[oi] !== m) others.push(aliveAll[oi]); }
                if (others.length > 0) {
                    var splitDmg = Math.max(1, Math.floor(finalDmgForProcs * eff.splitPct));
                    var splitTotal = 0;
                    for (var si = 0; si < others.length; si++) {
                        var tm = others[si];
                        var sd = Math.floor(splitDmg * (1 - (tm.halfDamage || 0)));
                        sd = Math.max(1, sd);
                        var srem = sd;
                        if (tm.shield > 0) { var ts = Math.min(tm.shield, srem); tm.shield -= ts; srem -= ts; }
                        if (srem > 0) tm.hp -= srem;
                        splitTotal += sd;
                    }
                    abyssLog('【' + skillName + '】分裂攻击！对其它 ' + others.length + ' 个目标共造成 ' + formatNumber(splitTotal) + ' 伤害');
                for (var di = abyssRun.monsters.length - 1; di >= 0; di--) {
                    var dm = abyssRun.monsters[di];
                    if (!dm || dm.hp > 0 || dm === m) continue;
                    var hasRev = false;
                    if (dm.skills && dm.skills.length && !dm.revived) for (var rvi = 0; rvi < dm.skills.length; rvi++) { if (dm.skills[rvi].id === 'revive') { hasRev = true; break; } }
                    if (hasRev) { var revSk2 = null; for (var rvx2 = 0; rvx2 < dm.skills.length; rvx2++) if (dm.skills[rvx2].id === 'revive') { revSk2 = dm.skills[rvx2]; break; } dm.revived = true; dm.hp = Math.floor(dm.maxHp * (revSk2 && revSk2.revivePct != null ? revSk2.revivePct : 0.25)); abyssLog(dm.name + ' 发动复活！'); }
                    else {
                        abyssPetGainExp(dm.isBoss ? 35 : (12 + Math.floor(Math.random() * 5)));
                        if (!dm.isBoss) {
                            var welf = dm.welfareReward || 1;
                            var rewardM = dm.rewardMult || 1;
                            var normExp = (10 + Math.floor(Math.random() * 6)) * welf * rewardM;
                            var normGold = (21 + Math.floor(Math.random() * 11)) * welf * rewardM;
                            var applied = abyssApplyExpGoldBonus(normExp, normGold);
                            abyssRun.exp = (abyssRun.exp || 0) + applied.exp;
                            abyssRun.gold = (abyssRun.gold || 0) + applied.gold;
                            abyssLog('获得经验 ' + applied.exp + '，闯关金币 ' + applied.gold);
                            if (abyssCheckLevelUp()) { if (abyssGetAliveMonsters().length === 0) abyssOnKillMonster(); else abyssRun.monsters.splice(di, 1); return true; }
                            if (Math.random() < 0.1) { abyssRun.materials.potion = (abyssRun.materials.potion || 0) + 1; abyssLog('获得生命药剂 x1'); }
                            if (Math.random() < 0.1) { abyssRun.materials.upgradeStone = (abyssRun.materials.upgradeStone || 0) + 1; abyssLog('获得升级石 x1'); }
                        }
                        abyssRun.monsters.splice(di, 1);
                    }
                }
                if (abyssGetAliveMonsters().length === 0) { stopAbyssAutoAttack(); abyssOnKillMonster(); return true; }
                abyssEnsurePlayerTarget();
            }
        }
        }
    }
    return false;
}
function abyssAttack() {
    if (!abyssRun || !abyssRun.active || abyssRun.pendingChoice || abyssRun.pendingUpgradeChoice || abyssRun.pendingSoulChoice) {
        abyssAttackReleaseLock();
        return;
    }
    // 防止快速连点：只有来自 requestAnimationFrame 的回调才允许执行攻击体，否则直接忽略（避免多击同步执行整段战斗逻辑导致卡死）
    if (abyssAttack._inProgress && !abyssAttack._rafRunning) return;
    var now = Date.now();
    if (!abyssAttack._deferredRun && (now - (abyssAttack._lastStart || 0) < ABYSS_ATTACK_MIN_INTERVAL_MS)) return;
    if (!abyssAttack._deferredRun) {
        abyssAttack._lastStart = now;
        abyssAttack._inProgress = true;
        abyssAttack._deferredRun = true;
        var attackBtn = document.getElementById('abyssManualAttackBtn');
        if (attackBtn) { attackBtn.disabled = true; attackBtn.style.pointerEvents = 'none'; }
        var self = abyssAttack;
        requestAnimationFrame(function() {
            self._deferredRun = true;
            self._rafRunning = true;
            try { abyssAttack(); } finally {
                self._rafRunning = false;
                abyssAttackReleaseLock();
            }
        });
        return;
    }
    abyssAttack._deferredRun = false;
    if (abyssRun) abyssRun._petStatsCache = {};
    var attackBtn = document.getElementById('abyssManualAttackBtn');
    try {
    if (abyssRecoverDeadMonsterWave()) return;
    if (!abyssRun.monsters || abyssGetAliveMonsters().length === 0) return;
    abyssEnsurePlayerTarget();
    if (!abyssRun.monster) return;
    var runLevel = Math.floor((abyssRun.exp || 0) / 100);
    var maxMp = abyssMaxMpForLevel(runLevel);
    for (var sid in abyssRun.skillCooldowns) {
        abyssRun.skillCooldowns[sid]--;
        if (abyssRun.skillCooldowns[sid] <= 0) delete abyssRun.skillCooldowns[sid];
    }
    abyssRun.roundCount = (abyssRun.roundCount || 0) + 1;
    var _statsRoundStart = abyssCalcPlayerStats();
    if (_statsRoundStart) abyssSoulCardRoundStartRegen(_statsRoundStart);
    var deployedPets = abyssGetDeployedPets();
    for (var rv = 0; rv < deployedPets.length; rv++) {
        var rp = deployedPets[rv];
        if (rp.isDivine && rp.hp !== null && rp.hp <= 0 && rp.deathRound != null && (abyssRun.roundCount - rp.deathRound) >= 4) {
            var rpStats = abyssCalcPetStats(rp);
            if (rpStats) { rp.hp = rpStats.maxHp; rp.deathRound = null; abyssLog('深渊神兽【' + rp.name + '】4回合后自动复活！'); }
        }
    }
    if (abyssRun.buffs && abyssRun.buffs.petTemp && abyssRun.buffs.petTemp.roundsLeft != null) {
        abyssRun.buffs.petTemp.roundsLeft--;
        if (abyssRun.buffs.petTemp.roundsLeft <= 0) abyssRun.buffs.petTemp = { atkPct: 0, defPct: 0, hpPct: 0, roundsLeft: 0 };
    }
    if (abyssRun.buffs && abyssRun.buffs.summonTemp && abyssRun.buffs.summonTemp.roundsLeft != null) {
        abyssRun.buffs.summonTemp.roundsLeft--;
        if (abyssRun.buffs.summonTemp.roundsLeft <= 0) abyssRun.buffs.summonTemp = { atkPct: 0, defPct: 0, hpPct: 0, roundsLeft: 0 };
    }
    abyssRun._skipThisTurn = false;
    if (abyssRun.skipPlayerTurn > 0) { abyssRun.skipPlayerTurn--; abyssRun._skipThisTurn = true; abyssLog('时空凝滞！你本回合无法行动'); }
    abyssRun.thisRoundDodgeBonus = 0;
    abyssRun.thisRoundReduceDmg = 0;
    abyssRun.thisRoundCounterPct = 0;
    if (abyssRun.buffs && abyssRun.buffs.roundsLeft > 0 && abyssRun.buffs.reduceDmgPct != null) abyssRun.thisRoundReduceDmg = abyssRun.buffs.reduceDmgPct;
    var classId = abyssRun.playerClass || 'warrior';
    if (classId === 'mage') {
        var stMage = abyssCalcPlayerStats();
        var maxMpMage = abyssMaxMpForLevel(Math.floor((abyssRun.exp || 0) / 100));
        if (stMage && (abyssRun.player.mp != null ? abyssRun.player.mp : 50) >= maxMpMage * 0.5) {
            var shieldGain = Math.floor(stMage.maxHp * 0.06);
            abyssRun.player.shield = (abyssRun.player.shield || 0) + shieldGain;
            if (shieldGain > 0) abyssLog('法师·法力护盾 获得 ' + formatNumber(shieldGain) + ' 护盾');
        }
    }
    if (classId === 'mechanic') {
        var stMech = _statsRoundStart || abyssCalcPlayerStats();
        var aliveSummonsMech = (abyssRun.beastSummons || []).filter(function(b) { return b && b.hp > 0; }).length;
        if (aliveSummonsMech > 0 && stMech && stMech.maxHp > 0) {
            var healMech = Math.floor(stMech.maxHp * 0.05 * aliveSummonsMech);
            if (healMech > 0) {
                abyssRun.player.hp = Math.min(stMech.maxHp, (abyssRun.player.hp || 0) + healMech);
                abyssLog('机械师被动：召唤兽共' + aliveSummonsMech + '个，本回合回复 ' + formatNumber(healMech) + ' 生命');
            }
        }
    }
    var useSkill = null;
    var skillList = abyssGetSkillList(classId, abyssRun.classBranch);
    var currentMp = abyssRun.player.mp != null ? abyssRun.player.mp : 50;
    var equipped = abyssRun.equippedSkillIds || [null, null, null];
    var learned = abyssRun.learnedSkillIds || [];
    var nextId = abyssRun.nextSkillId;
    if (abyssRun.playerSilenced > 0) { nextId = null; abyssRun.playerSilenced--; abyssLog('静默中，本回合无法使用技能'); }
    if (abyssRun.trialId === 'normalAtk' && abyssRun.trialRoundsLeft > 0) { nextId = null; if (abyssRun.nextSkillId) { abyssRun.nextSkillId = null; abyssLog('纯武试炼：本回合无法使用技能'); } }
    var isEquipped = nextId && (equipped.indexOf(nextId) >= 0);
    var isLearned = nextId && (learned.indexOf(nextId) >= 0);
    if (abyssRun.nextSkillId && nextId && skillList && isEquipped && isLearned) {
        for (var si = 0; si < skillList.length; si++) {
            if (skillList[si].id === abyssRun.nextSkillId) {
                var sk = skillList[si];
                var cd = abyssRun.skillCooldowns[abyssRun.nextSkillId];
                var mpCost = sk.mpCost || 0;
                if ((cd === undefined || cd <= 0) && currentMp >= mpCost) {
                    useSkill = sk;
                    useSkill = abyssApplyGambleSkill(useSkill);
                    abyssRun.skillCooldowns[useSkill.id] = useSkill.cooldown;
                    abyssRun.nextSkillId = null;
                    abyssRun.player.mp = Math.max(0, currentMp - mpCost);
                    abyssLog('【' + useSkill.name + '】消耗' + (mpCost || 0) + '魔法');
                    if (useSkill.summonBeast && useSkill.summonPct != null) {
                        var baseStats = null;
                        var summonNameOverride = null;
                        if (useSkill.copyMonster) {
                            var mon = abyssEnsurePlayerTarget();
                            if (!mon) {
                                abyssLog('没有可复制的目标怪物');
                            } else if (mon.isBoss) {
                                abyssLog('BOSS无法被【' + useSkill.name + '】复制');
                            } else {
                                baseStats = { maxHp: mon.maxHp, atk: mon.atk, def: mon.def };
                                summonNameOverride = '魅惑·' + (mon.name || '怪物');
                            }
                        } else {
                            var stPlayer = abyssCalcPlayerStats();
                            if (stPlayer) baseStats = { maxHp: stPlayer.maxHp, atk: stPlayer.atk, def: stPlayer.def };
                        }
                        if (baseStats) {
                            abyssRun.beastSummons = abyssRun.beastSummons || [];
                            var name_ = summonNameOverride || useSkill.summonName || '战兽';
                            if (useSkill.jesterPuppetSummon) {
                                abyssRun.beastSummons = abyssRun.beastSummons.filter(function(b) { return !b || b.name !== name_; });
                            }
                            var cap = (useSkill.onmyojiSummon || classId === 'onmyoji') ? ABYSS_ONMYOJI_SUMMON_CAP : (useSkill.archerSummon || classId === 'archer') ? ABYSS_ARCHER_SUMMON_CAP : (useSkill.mechanicSummon || classId === 'mechanic') ? ABYSS_MECHANIC_SUMMON_CAP : (useSkill.summonMax || 1);
                            var currentAlive = abyssRun.beastSummons.filter(function(b) { return b && b.hp > 0; }).length;
                            var pct = useSkill.summonPct || 0.2;
                            var hpMult = (useSkill.summonHpMult != null && !isNaN(useSkill.summonHpMult)) ? useSkill.summonHpMult : pct;
                            var summonTempNow = (abyssRun.buffs && abyssRun.buffs.summonTemp && (abyssRun.buffs.summonTemp.roundsLeft || 0) > 0) ? abyssRun.buffs.summonTemp : null;
                            var soulSummonHpNow = (abyssRun.buffs && abyssRun.buffs.summonHpPctSoul) ? abyssRun.buffs.summonHpPctSoul : 0;
                            var summonHpPctNow = ((summonTempNow ? (summonTempNow.hpPct || 0) : 0) + soulSummonHpNow);
                            if (summonHpPctNow) hpMult = hpMult * (1 + summonHpPctNow / 100);
                            
                            var sameAlive = false;
                            if (!(useSkill.archerSummon || classId === 'archer' || useSkill.mechanicSummon || classId === 'mechanic')) {
                                sameAlive = abyssRun.beastSummons.some(function(b) { return b && b.hp > 0 && b.name === name_; });
                            }
                            if (currentAlive < cap && !sameAlive) {
                                abyssRun.beastSummons.push({
                                    name: name_,
                                    hp: Math.max(1, Math.floor(baseStats.maxHp * hpMult)),
                                    maxHp: Math.max(1, Math.floor(baseStats.maxHp * hpMult)),
                                    atk: Math.max(1, Math.floor(baseStats.atk * pct)),
                                    def: Math.floor(baseStats.def * pct)
                                });
                                abyssLog('召唤【' + name_ + '】');
                            }
                        }
                    }
                    // 机械师：自爆指令与连锁爆破在此处理牺牲机器人伤害
                    if (useSkill.sacrificeRobot || useSkill.sacrificeRobotAoe) {
                        abyssRun.beastSummons = abyssRun.beastSummons || [];
                        var idxBot = -1;
                        for (var bi = 0; bi < abyssRun.beastSummons.length; bi++) {
                            if (abyssRun.beastSummons[bi] && abyssRun.beastSummons[bi].hp > 0) { idxBot = bi; break; }
                        }
                        if (idxBot >= 0) {
                            var bot = abyssRun.beastSummons[idxBot];
                            var extraDmg = Math.max(1, bot.maxHp || bot.hp || 0);
                            abyssRun.beastSummons[idxBot].hp = 0;
                            abyssRun._mechanicExtraDmg = abyssRun._mechanicExtraDmg || 0;
                            if (useSkill.sacrificeRobotAoe) {
                                abyssRun._mechanicExtraDmgAoe = (abyssRun._mechanicExtraDmgAoe || 0) + Math.floor(extraDmg * (useSkill.sacrificePctMaxHp || 1));
                            } else {
                                abyssRun._mechanicExtraDmg = (abyssRun._mechanicExtraDmg || 0) + extraDmg;
                            }
                            abyssLog('牺牲【' + (bot.name || '战斗机器人') + '】引爆造成额外伤害');
                        } else {
                            abyssLog('没有可牺牲的机器人，自爆指令无效');
                        }
                    }
                    // 机械师：战地·残骸回收，在此处理牺牲低生命值机器人并按数量获得护盾
                    if (useSkill.sacrificeLowHpBots && useSkill.shieldPctPerBot && useSkill.lowHpThreshold != null) {
                        abyssRun.beastSummons = abyssRun.beastSummons || [];
                        var threshold = useSkill.lowHpThreshold;
                        var countSac = 0;
                        for (var bi2 = 0; bi2 < abyssRun.beastSummons.length; bi2++) {
                            var rb = abyssRun.beastSummons[bi2];
                            if (!rb || rb.hp <= 0 || !rb.maxHp) continue;
                            var ratio = rb.hp / rb.maxHp;
                            if (ratio <= threshold) {
                                abyssRun.beastSummons[bi2].hp = 0;
                                countSac++;
                                abyssLog('牺牲残血机器人【' + (rb.name || '战斗机器人') + '】');
                            }
                        }
                        if (countSac > 0) {
                            var statsMech = abyssCalcPlayerStats();
                            if (statsMech && statsMech.maxHp > 0) {
                                var totalPct = useSkill.shieldPctPerBot * countSac;
                                var shMech = Math.floor(statsMech.maxHp * totalPct);
                                abyssRun.player.shield = (abyssRun.player.shield || 0) + shMech;
                                abyssLog('战地·残骸回收：牺牲 ' + countSac + ' 台残血机器人，获得护盾 ' + formatNumber(shMech));
                            }
                        } else {
                            abyssLog('战地·残骸回收：没有生命低于阈值的机器人，技能无效');
                        }
                    }
                    if (useSkill.mpRegenPct != null) {
                        var maxMp0 = abyssMaxMpForLevel(runLevel);
                        abyssRun.player.mp = Math.min(maxMp0, (abyssRun.player.mp || 0) + Math.floor(maxMp0 * useSkill.mpRegenPct));
                        // 法力潮汐的技伤持续：回合末再写入 buffs，避免与本击 skillDmgBonus 重复叠乘
                        if (useSkill.skillDmgBonus != null || useSkill.buffRounds != null) {
                            abyssRun._pendingSkillDmgBuffAfterTurn = {
                                skillDmgBonus: useSkill.skillDmgBonus || 0,
                                buffRounds: (useSkill.buffRounds != null ? useSkill.buffRounds : 2)
                            };
                        }
                    }
                    // 持续技伤（非法力潮汐类）：圣愈、异界御灵等 skillDmgBonus + buffRounds（回合末写入，避免与本击重复）
                    if (useSkill.skillDmgBonus != null && useSkill.buffRounds != null && useSkill.mpRegenPct == null) {
                        abyssRun._pendingSkillDmgBuffAfterTurn = { skillDmgBonus: useSkill.skillDmgBonus, buffRounds: useSkill.buffRounds };
                    }
                    // 技能持续：造成伤害增加 / 易伤（过载协议、戏命师判定后、异界御灵本回合增伤等）
                    if ((useSkill.damageIncreasePct != null || useSkill.vulnerablePct != null) && useSkill.buffRounds != null) {
                        abyssRun.buffs = abyssRun.buffs || {};
                        if (useSkill.damageIncreasePct != null) abyssRun.buffs.damageIncreasePct = useSkill.damageIncreasePct;
                        if (useSkill.vulnerablePct != null) abyssRun.buffs.vulnerablePct = useSkill.vulnerablePct;
                        abyssRun.buffs.roundsLeft = Math.max(abyssRun.buffs.roundsLeft || 0, useSkill.buffRounds);
                    }
                    if (useSkill.counterPct != null) abyssRun.thisRoundCounterPct = useSkill.counterPct;
                    if (useSkill.reduceDmgPct != null && useSkill.buffRounds != null) {
                        abyssRun.buffs = abyssRun.buffs || {};
                        abyssRun.buffs.reduceDmgPct = useSkill.reduceDmgPct;
                        abyssRun.buffs.roundsLeft = Math.max(abyssRun.buffs.roundsLeft || 0, useSkill.buffRounds);
                    }
                    if (useSkill.petAtkPct != null || useSkill.petDefPct != null || useSkill.petHpPct != null) {
                        abyssRun.buffs = abyssRun.buffs || {};
                        abyssRun.buffs.petTemp = abyssRun.buffs.petTemp || { atkPct: 0, defPct: 0, hpPct: 0, roundsLeft: 0 };
                        var pt = abyssRun.buffs.petTemp;
                        if (useSkill.petAtkPct != null) pt.atkPct = (pt.atkPct || 0) + useSkill.petAtkPct;
                        if (useSkill.petDefPct != null) pt.defPct = (pt.defPct || 0) + useSkill.petDefPct;
                        if (useSkill.petHpPct != null) pt.hpPct = (pt.hpPct || 0) + useSkill.petHpPct;
                        if (useSkill.buffRounds != null) pt.roundsLeft = Math.max(pt.roundsLeft || 0, useSkill.buffRounds);
                    }
                    if (useSkill.summonAtkPct != null || useSkill.summonDefPct != null || useSkill.summonHpPct != null) {
                        abyssRun.buffs = abyssRun.buffs || {};
                        abyssRun.buffs.summonTemp = abyssRun.buffs.summonTemp || { atkPct: 0, defPct: 0, hpPct: 0, roundsLeft: 0 };
                        var st = abyssRun.buffs.summonTemp;
                        if (useSkill.summonAtkPct != null) st.atkPct = (st.atkPct || 0) + useSkill.summonAtkPct;
                        if (useSkill.summonDefPct != null) st.defPct = (st.defPct || 0) + useSkill.summonDefPct;
                        if (useSkill.summonHpPct != null) st.hpPct = (st.hpPct || 0) + useSkill.summonHpPct;
                        if (useSkill.buffRounds != null) st.roundsLeft = Math.max(st.roundsLeft || 0, useSkill.buffRounds);
                    }
                    if (useSkill.healPetPct != null) {
                        var deployed = abyssGetDeployedPets();
                        for (var hpi = 0; hpi < deployed.length; hpi++) {
                            var hpPet = deployed[hpi];
                            if (hpPet && hpPet.hp != null && hpPet.hp > 0) {
                                var hpSt = abyssCalcPetStats(hpPet);
                                if (hpSt && hpSt.maxHp > 0) {
                                    var healAmt = Math.floor(hpSt.maxHp * useSkill.healPetPct);
                                    hpPet.hp = Math.min(hpSt.maxHp, (hpPet.hp || 0) + healAmt);
                                    abyssLog('宠物【' + (hpPet.name || '') + '】恢复 ' + formatNumber(healAmt) + ' 生命');
                                }
                            }
                        }
                    }
                    if (useSkill.healSummonPct != null) {
                        var summons = abyssRun.beastSummons || [];
                        for (var si = 0; si < summons.length; si++) {
                            var b = summons[si];
                            if (b && b.hp > 0 && b.maxHp > 0) {
                                var healAmt = Math.floor(b.maxHp * useSkill.healSummonPct);
                                b.hp = Math.min(b.maxHp, (b.hp || 0) + healAmt);
                                abyssLog('召唤兽【' + (b.name || '') + '】恢复 ' + formatNumber(healAmt) + ' 生命');
                            }
                        }
                    }
                    if (useSkill.sacrificeSummon) {
                        var summonsSac = abyssRun.beastSummons || [];
                        var alive = [];
                        for (var saci = 0; saci < summonsSac.length; saci++) {
                            if (summonsSac[saci] && summonsSac[saci].hp > 0) alive.push({ i: saci, b: summonsSac[saci] });
                        }
                        if (alive.length > 0) {
                            var idx = Math.floor(Math.random() * alive.length);
                            var chosen = alive[idx].b;
                            var shieldAmt = chosen.maxHp || 0;
                            abyssRun.beastSummons.splice(alive[idx].i, 1);
                            abyssRun.player.shield = (abyssRun.player.shield || 0) + shieldAmt;
                            abyssLog('牺牲式神·牺牲【' + (chosen.name || '召唤兽') + '】，获得护盾 ' + formatNumber(shieldAmt));
                        } else {
                            abyssLog('没有可牺牲的召唤兽');
                        }
                    }
                    if (useSkill.reviveDeployedPet) {
                        abyssRun._skipThisTurn = true;
                        var deployed = abyssGetDeployedPets();
                        var revived = false;
                        for (var rvi = 0; rvi < deployed.length; rvi++) {
                            var rp = deployed[rvi];
                            if (rp && (rp.hp == null || rp.hp <= 0)) {
                                var rpSt = abyssCalcPetStats(rp);
                                if (rpSt && rpSt.maxHp > 0) {
                                    rp.hp = rpSt.maxHp;
                                    abyssLog('【复活宠物】' + (rp.name || '') + ' 已复活！');
                                    revived = true;
                                    break;
                                }
                            }
                        }
                        if (!revived) abyssLog('【复活宠物】没有已死亡的出战宠物可复活');
                    }
                } else if (currentMp < mpCost) {
                    abyssLog('魔法值不足，需要' + mpCost + '点');
                }
                if (!useSkill) abyssRun.nextSkillId = null;
                break;
            }
        }
    }
    // 回合类人物增益：在计算本轮伤害前结算「上一轮延续」的 buff 倒计时。
    // 若放在本轮攻击末尾递减，则刚释放的技能会在同一轮末尾被立刻扣 1 回合（持续异常变短）；AOE 提前 return 时还可能完全跳过递减。
    if (abyssRun.buffSources && abyssRun.buffSources.length) {
        for (var _bsDec = 0; _bsDec < abyssRun.buffSources.length; _bsDec++) {
            var _bs = abyssRun.buffSources[_bsDec];
            if (!_bs || _bs.roundsLeft == null || _bs.roundsLeft <= 0) continue;
            _bs.roundsLeft--;
        }
        abyssRun.buffSources = abyssRun.buffSources.filter(function(bs) { return bs && bs.roundsLeft != null && bs.roundsLeft > 0; });
        abyssRecalcBuffsFromSources();
    }
    var stats = abyssCalcPlayerStats();
    if (!stats) return;
    if (!useSkill && !abyssRun._skipThisTurn) abyssSoulCardOnManualAttack();
    if (abyssRun.playerBurning && abyssRun.playerBurning.rounds > 0) {
        var dotDmg = Math.floor(stats.maxHp * (abyssRun.playerBurning.rate || 0.05));
        abyssRun.player.hp = bSub(abyssRun.player.hp || 0, dotDmg);
        abyssRun.playerBurning.rounds--;
        abyssLog('灼烧造成 ' + formatNumber(dotDmg) + ' 伤害' + (abyssRun.playerBurning.rounds > 0 ? '（剩余' + abyssRun.playerBurning.rounds + '回合）' : ''));
        if (abyssRun.playerBurning.rounds <= 0) abyssRun.playerBurning = null;
        if (bLteZero(abyssRun.player.hp)) {
            abyssRun.deathInfo = abyssRun.deathInfo || ('被灼烧击败（持续伤害，' + formatNumber(dotDmg) + '伤害）');
            stopAbyssAutoAttack(); abyssOnPlayerDeath(); return;
        }
    }
    if (abyssRun.playerSoulDrain && abyssRun.playerSoulDrain.rounds > 0) {
        var soulDmg = Math.floor(stats.maxHp * (abyssRun.playerSoulDrain.rate || 0.04));
        abyssRun.player.hp = bSub(abyssRun.player.hp || 0, soulDmg);
        abyssRun.playerSoulDrain.rounds--;
        abyssLog('魂噬造成 ' + formatNumber(soulDmg) + ' 伤害' + (abyssRun.playerSoulDrain.rounds > 0 ? '（剩余' + abyssRun.playerSoulDrain.rounds + '回合）' : ''));
        if (abyssRun.playerSoulDrain.rounds <= 0) abyssRun.playerSoulDrain = null;
        if (bLteZero(abyssRun.player.hp)) {
            abyssRun.deathInfo = abyssRun.deathInfo || ('被魂噬击败（持续伤害，' + formatNumber(soulDmg) + '伤害）');
            stopAbyssAutoAttack(); abyssOnPlayerDeath(); return;
        }
    }
    var m = abyssRun.monster;
    var effDef = m.def * (1 - (stats.reduceMonsterDef || 0) / 100);
    if ((abyssRun.playerClass || 'warrior') === 'mage' && useSkill) effDef = effDef * 0.88;
    if (useSkill && useSkill.ignoreDefPct) effDef = effDef * (1 - useSkill.ignoreDefPct / 100);
    if ((abyssRun.playerClass || 'warrior') === 'archer' && !useSkill) effDef = effDef * 0.9;
    var baseDmg = abyssRun._skipThisTurn ? (abyssRun._skipThisTurn = false, 0) : Math.max(1, stats.atk - Math.floor(effDef * 0.5));
    // 战士职业被动：战意(普攻+15%)、怒战(半血以下伤害+25%/吸血+8%)
    if ((abyssRun.playerClass || 'warrior') === 'warrior' && stats.maxHp > 0) {
        if (!useSkill) baseDmg = Math.floor(baseDmg * 1.15);  // 战意：普攻伤害+15%
        var curHpRatio = (abyssRun.player.hp || stats.maxHp) / stats.maxHp;
        if (curHpRatio <= 0.5) {
            baseDmg = Math.floor(baseDmg * 1.25);      // 怒战：半血以下伤害+25%
            stats.lifesteal = (stats.lifesteal || 0) + 8; // 怒战：吸血+8%
        }
    }
    var abyssFloorForHidden = abyssRun.floor || 1;
    
    var abyssAntiCritPct = Math.min(80, abyssFloorForHidden * 0.4);
    var effectiveCritRate = Math.max(0, (stats.critRate || 0) - abyssAntiCritPct);
    var crit = (useSkill && useSkill.forceCrit) || (Math.random() * 100 < effectiveCritRate);
    if (crit) baseDmg = Math.floor(baseDmg * (1 + stats.critDmg / 100));
    if ((abyssRun.playerClass || 'warrior') === 'archer' && crit) baseDmg = Math.floor(baseDmg * 1.12);
    var combo = Math.random() * 100 < stats.combo;
    if (combo) baseDmg = Math.floor(baseDmg * 1.5);
    var _buffSkillDmg = (abyssRun.buffs && abyssRun.buffs.skillDmgBonus) ? abyssRun.buffs.skillDmgBonus : 0;
    var skillBonus = 1 + ((stats.skillDmg || 0) + _buffSkillDmg) / 100;
    if (useSkill && useSkill.skillDmgBonus != null) skillBonus = 1 + ((stats.skillDmg || 0) + _buffSkillDmg + useSkill.skillDmgBonus) / 100;
    if ((abyssRun.playerClass || 'warrior') === 'mage' && useSkill) skillBonus = skillBonus * 1.15;
    baseDmg = Math.floor(baseDmg * skillBonus);
    if (useSkill && useSkill.dmgMult && !useSkill.multiHit && !(useSkill.aoe)) baseDmg = Math.floor(baseDmg * useSkill.dmgMult);
    if (useSkill && useSkill.lowHpThreshold != null && m && m.maxHp > 0 && (m.hp / m.maxHp) < useSkill.lowHpThreshold) baseDmg = Math.floor(baseDmg * (1 + (useSkill.dmgBonus || 0)));
    var playerMainElement = null;
    if (stats.elementAtk) {
        var maxAtk = 0;
        for (var ex = 0; ex < ABYSS_ELEMENTS.length; ex++) {
            var el = ABYSS_ELEMENTS[ex];
            if ((stats.elementAtk[el] || 0) > maxAtk) { maxAtk = stats.elementAtk[el]; playerMainElement = el; }
        }
    }
    if (useSkill && useSkill.aoe) {
        if (useSkill.dodgeBonus) abyssRun.thisRoundDodgeBonus = useSkill.dodgeBonus;
        var aoePct = useSkill.aoePct || 0.7;
        if (useSkill.dmgMult) baseDmg = Math.floor(baseDmg * useSkill.dmgMult);
        abyssLog('【' + useSkill.name + '】群体攻击！');
        var aliveAoe = abyssGetAliveMonsters();
        var totalAoeDmg = 0;
        for (var ai = 0; ai < aliveAoe.length; ai++) {
            var tm = aliveAoe[ai];
            var fd = Math.floor(baseDmg * aoePct * (1 - (tm.halfDamage || 0)));
            if (playerMainElement && tm.element) {
                fd = Math.floor(fd * abyssElementRestrainMultiplier(playerMainElement, tm.element));
                var tr = (tm.elementRes && tm.elementRes[playerMainElement]) ? tm.elementRes[playerMainElement] : 0;
                fd = Math.floor(fd * (1 - Math.min(75, tr) / 100));
            }
            fd = Math.max(1, fd);
            if (useSkill && (tm.magicRes || 0) > 0) { fd = Math.floor(fd * (1 - Math.min(75, tm.magicRes) / 100)); fd = Math.max(1, fd); }
            if (tm.skills && tm.skills.length) { for (var si = 0; si < tm.skills.length; si++) { if (tm.skills[si].id === 'intimidate') { fd = Math.floor(fd * (1 - (tm.skills[si].dmgReduce || 0.15))); fd = Math.max(1, fd); break; } } }
            var rem = fd;
            if (tm.shield > 0) { var ts = Math.min(tm.shield, rem); tm.shield -= ts; rem -= ts; }
            if (rem > 0) tm.hp -= rem;
            if (tm.isBoss && tm.hp > 0 && tm.hp < tm.maxHp * 0.5 && !tm.secondPhase) {
                tm.secondPhase = true;
                tm.atk = Math.floor((tm.atk || 0) * 1.28);
                tm.def = Math.floor((tm.def || 0) * 1.22);
                tm.dodge = Math.min(45, (tm.dodge || 0) + 18);
                abyssLog(tm.name + ' 进入第二阶段！实力与闪避大幅提升');
            }
            if (useSkill.stunChance && Math.random() < useSkill.stunChance) { tm.stunned = (tm.stunned || 0) + (useSkill.stunTurns || 1); }
            totalAoeDmg += fd;
        }
        // 机械师：连锁爆破额外AOE伤害
        if (useSkill && useSkill.sacrificeRobotAoe && abyssRun._mechanicExtraDmgAoe) {
            var extraA = abyssRun._mechanicExtraDmgAoe;
            abyssRun._mechanicExtraDmgAoe = 0;
            for (var ai2 = 0; ai2 < aliveAoe.length; ai2++) {
                var tm2 = aliveAoe[ai2];
                if (!tm2) continue;
                var rem2 = extraA;
                if (tm2.shield > 0) { var ts2 = Math.min(tm2.shield, rem2); tm2.shield -= ts2; rem2 -= ts2; }
                if (rem2 > 0) tm2.hp -= rem2;
            }
            totalAoeDmg += extraA * aliveAoe.length;
            abyssLog('连锁爆破额外造成 ' + formatNumber(extraA * aliveAoe.length) + ' 范围伤害');
        }
        abyssLog('对全部怪物共造成 ' + formatNumber(totalAoeDmg) + ' 伤害');
        if ((abyssRun.playerClass || 'warrior') === 'archer' && totalAoeDmg > 0) abyssRun.thisRoundDodgeBonus = (abyssRun.thisRoundDodgeBonus || 0) + 10;
        for (var di = abyssRun.monsters.length - 1; di >= 0; di--) {
            var dm = abyssRun.monsters[di];
            if (dm && dm.hp <= 0) {
                var usedSurviveAoe = false;
                if (dm.skills && !dm.surviveOneDeathUsed) for (var sod2 = 0; sod2 < dm.skills.length; sod2++) { if (dm.skills[sod2].id === 'surviveOneDeath') { dm.hp = 1; dm.surviveOneDeathUsed = true; usedSurviveAoe = true; abyssLog(dm.name + ' 不溃！保留1点生命'); break; } }
                if (usedSurviveAoe) continue;
                var hasRev = false;
                if (dm.skills && dm.skills.length && !dm.revived) for (var rvi = 0; rvi < dm.skills.length; rvi++) { if (dm.skills[rvi].id === 'revive') { hasRev = true; break; } }
                if (hasRev) { var revSk = null; for (var rvx = 0; rvx < dm.skills.length; rvx++) if (dm.skills[rvx].id === 'revive') { revSk = dm.skills[rvx]; break; } dm.revived = true; dm.hp = Math.floor(dm.maxHp * (revSk && revSk.revivePct != null ? revSk.revivePct : 0.25)); abyssLog(dm.name + ' 发动复活！恢复' + ((revSk && revSk.revivePct != null ? revSk.revivePct : 0.25) * 100).toFixed(0) + '%生命'); }
                else {
                    abyssPetGainExp(dm.isBoss ? 35 : (12 + Math.floor(Math.random() * 5)));
                    if (!dm.isBoss) {
                        var welf = dm.welfareReward || 1;
                        var rewardM = dm.rewardMult || 1;
                        var normExp = (10 + Math.floor(Math.random() * 6)) * welf * rewardM;
                        var normGold = (21 + Math.floor(Math.random() * 11)) * welf * rewardM;
                        var applied = abyssApplyExpGoldBonus(normExp, normGold);
                        abyssRun.exp = (abyssRun.exp || 0) + applied.exp;
                        abyssRun.gold = (abyssRun.gold || 0) + applied.gold;
                        abyssLog('获得经验 ' + applied.exp + '，闯关金币 ' + applied.gold);
                        if (abyssCheckLevelUp()) { if (abyssGetAliveMonsters().length === 0) abyssOnKillMonster(); else abyssRun.monsters.splice(di, 1); return; }
                        if (Math.random() < 0.1) {
                            abyssRun.materials.potion = (abyssRun.materials.potion || 0) + 1;
                            abyssLog('获得生命药剂 x1');
                        }
                        if (Math.random() < 0.1) {
                            abyssRun.materials.upgradeStone = (abyssRun.materials.upgradeStone || 0) + 1;
                            abyssLog('获得升级石 x1');
                        }
                        if (Math.random() < 0.08) {
                            var runeId = ABYSS_RUNES[Math.floor(Math.random() * ABYSS_RUNES.length)].id;
                            abyssRun.runeInventory = abyssRun.runeInventory || [];
                            abyssRun.runeInventory.push(runeId);
                            abyssLog('获得符文【' + (getAbyssRuneById(runeId) || {}).name + '】');
                        }
                        if (Math.random() < 0.08) {
                            var gemId = ABYSS_GEMS[Math.floor(Math.random() * ABYSS_GEMS.length)].id;
                            abyssRun.gemInventory = abyssRun.gemInventory || [];
                            abyssRun.gemInventory.push(gemId);
                            abyssLog('获得宝石【' + (getAbyssGemById(gemId) || {}).name + '】');
                        }
                    }
                    abyssRun.monsters.splice(di, 1);
                }
            }
        }
        if (abyssGetAliveMonsters().length === 0) { stopAbyssAutoAttack(); abyssOnKillMonster(); return; }
        abyssEnsurePlayerTarget();
        if (useSkill.lifestealPct && totalAoeDmg > 0) {
            // 技能吸血 * (1 + 面板吸血%)，例如：30% * (1 + 100%) = 60%
            var totalLifestealPct = useSkill.lifestealPct * (1 + (stats.lifesteal || 0) / 100);
            var aoeHeal = Math.floor(totalAoeDmg * totalLifestealPct);
            if (aoeHeal > 0) {
                abyssRun.player.hp = Math.min(stats.maxHp, abyssRun.player.hp + aoeHeal);
                abyssLog('技能回复 ' + formatNumber(aoeHeal) + ' 生命');
            }
        }
        if (abyssRun.monster && abyssApplyEquipSkillProcEffects(stats, abyssRun.monster, totalAoeDmg, {})) return;
    } else {
    var finalDmg = Math.floor(baseDmg * (1 - m.halfDamage));
    if (playerMainElement && m.element) {
        finalDmg = Math.floor(finalDmg * abyssElementRestrainMultiplier(playerMainElement, m.element));
        var monRes = (m.elementRes && m.elementRes[playerMainElement]) ? m.elementRes[playerMainElement] : 0;
        finalDmg = Math.floor(finalDmg * (1 - Math.min(75, monRes) / 100));
    }
    finalDmg = Math.max(1, finalDmg);
    if (useSkill && useSkill.multiHit) {
        var pct = useSkill.multiHitPct || 0.85;
        var nHit = useSkill.multiHit || 2;
        finalDmg = 0;
        var effectiveCritRateMulti = Math.max(0, (stats.critRate || 0) - Math.min(75, (abyssRun.floor || 1) * 0.5));
        for (var hi = 0; hi < nHit; hi++) {
            var hit = Math.max(1, Math.floor(baseDmg * pct * (1 - m.halfDamage)));
            if (Math.random() * 100 < effectiveCritRateMulti) hit = Math.floor(hit * (1 + stats.critDmg / 100));
            if (Math.random() * 100 < stats.combo) hit = Math.floor(hit * 1.5);
            finalDmg += hit;
        }
        if (playerMainElement && m.element) {
            finalDmg = Math.floor(finalDmg * abyssElementRestrainMultiplier(playerMainElement, m.element));
            var monResMulti = (m.elementRes && m.elementRes[playerMainElement]) ? m.elementRes[playerMainElement] : 0;
            finalDmg = Math.floor(finalDmg * (1 - Math.min(75, monResMulti) / 100));
        }
        finalDmg = Math.max(1, finalDmg);
    }
    if (m.skills && m.skills.length) {
        for (var si = 0; si < m.skills.length; si++) {
            if (m.skills[si].id === 'intimidate') { finalDmg = Math.floor(finalDmg * (1 - (m.skills[si].dmgReduce || 0.15))); finalDmg = Math.max(1, finalDmg); break; }
        }
    }
    // 机械师：自爆指令额外单体伤害（不受减伤影响）
    if (useSkill && useSkill.sacrificeRobot && abyssRun._mechanicExtraDmg) {
        finalDmg += abyssRun._mechanicExtraDmg;
        abyssRun._mechanicExtraDmg = 0;
        abyssLog('自爆指令额外造成 ' + formatNumber(finalDmg) + ' 伤害');
    }
    if (useSkill && (m.magicRes || 0) > 0) { finalDmg = Math.floor(finalDmg * (1 - Math.min(75, m.magicRes) / 100)); finalDmg = Math.max(1, finalDmg); }
    // 仅「附加伤害类」去重；勿与触发类（护盾/眩晕等）共用同一套 key，否则第一段会提前占满 key，导致 abyssApplyEquipSkillProcEffects 全部 continue。
    var equipSkillBonusOnce = {};
    for (var _sei = 0; _sei < ABYSS_SLOTS.length; _sei++) {
        var _ek = ABYSS_SLOTS[_sei];
        var _eq = abyssRun.equipped[_ek];
        if (!_eq) continue;
        var _skillList = [_eq.equipSkill, _eq.skillSlot].filter(Boolean);
        for (var _ski = 0; _ski < _skillList.length; _ski++) {
            var _esk = _skillList[_ski];
            if (!_esk || !_esk.effect) continue;
            var _hdK = abyssEquipSkillDedupeKey(_esk);
            if (_hdK && equipSkillBonusOnce[_hdK]) continue;
            var _eff = _esk.effect;
            var bonusApplied = false;
            if (_eff.extraDmgFromDef) { finalDmg += Math.floor(stats.def * _eff.extraDmgFromDef); bonusApplied = true; }
            if (_eff.extraDmgFromMaxHp) { finalDmg += Math.floor(stats.maxHp * _eff.extraDmgFromMaxHp); bonusApplied = true; }
            if (_eff.directPctMonsterHp) { finalDmg += Math.floor(m.hp * _eff.directPctMonsterHp); bonusApplied = true; }
            if (_eff.extraDmgFromAtk) { finalDmg += Math.floor(stats.atk * _eff.extraDmgFromAtk); bonusApplied = true; }
            if (_eff.directPctMonsterMaxHp) { finalDmg += Math.floor(m.maxHp * _eff.directPctMonsterMaxHp); bonusApplied = true; }
            if (_hdK && bonusApplied) equipSkillBonusOnce[_hdK] = true;
        }
    }
    finalDmg = Math.max(1, finalDmg);
    if (m.damageTakenBonusNextPct) {
        finalDmg = Math.floor(finalDmg * (1 + (m.damageTakenBonusNextPct || 0) / 100));
        delete m.damageTakenBonusNextPct;
    }
    if (stats.damageIncreasePct) finalDmg = Math.floor(finalDmg * (1 + (stats.damageIncreasePct || 0) / 100));
    if (stats.vulnerablePct) finalDmg = Math.floor(finalDmg * (1 + (stats.vulnerablePct || 0) / 100));
    finalDmg = Math.max(1, finalDmg);
    if (m.skills && m.skills.length) {
        for (var lssi = 0; lssi < m.skills.length; lssi++) {
            if (m.skills[lssi].id === 'lastStand' && m.hp < m.maxHp * (m.skills[lssi].lastStandThreshold || 0.15)) { finalDmg = Math.floor(finalDmg * 0.5); finalDmg = Math.max(1, finalDmg); break; }
        }
        for (var foi = 0; foi < m.skills.length; foi++) {
            if (m.skills[foi].id === 'foresight' && Math.random() * 100 < (m.skills[foi].dodgeBonus || 0)) { finalDmg = 0; abyssLog(m.name + ' 预知！闪避了攻击'); break; }
        }
    }
    if (finalDmg > 0 && (m.dodge || 0) > 0 && Math.random() * 100 < (m.dodge || 0)) { finalDmg = 0; abyssLog(m.name + ' 闪避了攻击'); }
    if (abyssRun.playerBlinded > 0) { finalDmg = 0; abyssRun.playerBlinded--; abyssLog('致盲中，本回合攻击落空'); }
    var remain = finalDmg;
    if (m.skills && m.skills.length) {
        for (var mii = 0; mii < m.skills.length; mii++) {
            if (m.skills[mii].id === 'mirrorImage' && Math.random() < (m.skills[mii].chance || 0.18)) {
                remain = Math.floor(remain * (1 - (m.skills[mii].imagePct || 0.2)));
                abyssLog(m.name + ' 幻身！减免部分伤害');
                break;
            }
        }
    }
    if (m.shield > 0) {
        var toShield = Math.min(m.shield, remain);
        m.shield -= toShield;
        remain -= toShield;
    }
    if (remain > 0) {
        if (m.skills && m.skills.length) {
            for (var bai = 0; bai < m.skills.length; bai++) {
                if (m.skills[bai].id === 'boneArmor') {
                    var boneRed = Math.min(remain, m.boneArmor || 0);
                    remain -= boneRed;
                    m.boneArmor = Math.max(0, (m.boneArmor || 0) - boneRed);
                    if (boneRed > 0) abyssLog(m.name + ' 骨甲吸收 ' + formatNumber(boneRed) + ' 伤害');
                    break;
                }
            }
        }
        m.hp -= remain;
        if (m.isBoss && m.hp > 0 && m.hp < m.maxHp * 0.5 && !m.secondPhase) {
            m.secondPhase = true;
            m.atk = Math.floor((m.atk || 0) * 1.28);
            m.def = Math.floor((m.def || 0) * 1.22);
            m.dodge = Math.min(45, (m.dodge || 0) + 18);
            abyssLog(m.name + ' 进入第二阶段！实力与闪避大幅提升');
        }
        if (m.skills && m.skills.length && remain > 0) {
            for (var sli = 0; sli < m.skills.length; sli++) {
                if (m.skills[sli].id === 'soulLink') {
                    var sharePct = m.skills[sli].damageSharePct || 0.15;
                    var linkDmg = Math.floor(remain * sharePct);
                    var others = abyssGetAliveMonsters().filter(function(x) { return x !== m && x.hp > 0; });
                    for (var oi = 0; oi < others.length && linkDmg > 0; oi++) {
                        var tm = others[oi];
                        tm.hp = bLteZero(bSub(tm.hp || 0, linkDmg)) ? 0 : bSub(tm.hp || 0, linkDmg);
                        abyssLog(m.name + ' 魂链！' + tm.name + ' 分担 ' + formatNumber(linkDmg) + ' 伤害');
                    }
                    break;
                }
            }
        }
        if ((m.isSummon || (m.name && m.name.indexOf('仆从') >= 0)) && remain > 0) {
            var bossA = abyssGetAliveMonsters().filter(function(x) { return x.isBoss && x !== m && x.hp > 0; })[0];
            if (bossA && bossA.skills) for (var dai = 0; dai < bossA.skills.length; dai++) {
                if (bossA.skills[dai].id === 'deathAura') {
                    var healA = Math.floor(remain * (bossA.skills[dai].healOnAllyHitPct || 0.03));
                    if (healA > 0) { bossA.hp = Math.min(bossA.maxHp, (bossA.hp || 0) + healA); abyssLog(bossA.name + ' 死域！仆从受伤恢复 ' + formatNumber(healA)); }
                    break;
                }
            }
        }
        if (m.skills && m.skills.length) {
            for (var bai2 = 0; bai2 < m.skills.length; bai2++) {
                if (m.skills[bai2].id === 'boneArmor') {
                    var cap = m.skills[bai2].armorCap || 80;
                    m.boneArmor = Math.min(cap, (m.boneArmor || 0) + (m.skills[bai2].armorPerHit || 5));
                    break;
                }
            }
            for (var shi = 0; shi < m.skills.length; shi++) {
                if (m.skills[shi].id === 'shieldOnHit') {
                    var shAdd = Math.floor(remain * (m.skills[shi].shieldOnHitPct || 0.12));
                    if (shAdd > 0) { m.shield = (m.shield || 0) + shAdd; abyssLog(m.name + ' 噬能护甲！获得 ' + formatNumber(shAdd) + ' 护盾'); }
                    break;
                }
            }
            for (var csi = 0; csi < m.skills.length; csi++) {
                if (m.skills[csi].id === 'counterStrike') {
                    var refDmg = Math.floor((stats && stats.maxHp) ? stats.maxHp * (m.skills[csi].counterMaxHpPct != null ? m.skills[csi].counterMaxHpPct : 0.1) : 0);
                    if (refDmg > 0) {
                        abyssRun.player.hp = bLteZero(bSub(abyssRun.player.hp || 0, refDmg)) ? 0 : bSub(abyssRun.player.hp || 0, refDmg);
                        abyssLog(m.name + ' 复仇！你受到最大生命 ' + Math.round((m.skills[csi].counterMaxHpPct != null ? m.skills[csi].counterMaxHpPct : 0.1) * 100) + '% 的反噬，共 ' + formatNumber(refDmg) + ' 伤害');
                        if (bLteZero(abyssRun.player.hp)) {
                            abyssRun.deathInfo = abyssRun.deathInfo || ('被' + m.name + '【' + (m.skills[csi].name || '复仇反击') + '】造成 ' + formatNumber(refDmg) + ' 伤害击败');
                            stopAbyssAutoAttack(); abyssOnPlayerDeath(); return;
                        }
                    }
                    break;
                }
            }
        }
    }
    if (m.skills && m.skills.length) {
        for (var csti = 0; csti < m.skills.length; csti++) { if (m.skills[csti].id === 'counterStrike') { m.counterStrikeNext = true; break; } }
    }
    if (m.skills && m.skills.length && m.hp < m.maxHp * 0.5) {
        for (var phi = 0; phi < m.skills.length; phi++) {
            var phs = m.skills[phi];
            if (phs.id === 'phaseAtHp' && !m.phaseTriggered) { m.phaseTriggered = true; m.atk = Math.floor(m.atk * (1 + (phs.phaseAtkBonus || 0.3))); abyssLog(m.name + ' 蜕皮！进入二阶段，攻击力提升'); break; }
        }
    }
    var logMsg = (crit ? '暴击 ' : '') + (combo ? '连击 ' : '') + '造成 ' + formatNumber(finalDmg) + ' 伤害';
    if (playerMainElement && m.element) {
        var mul = abyssElementRestrainMultiplier(playerMainElement, m.element);
        if (mul > 1) logMsg += ' [属性克制+35%]';
        else if (mul < 1) logMsg += ' [被克制-30%]';
    }
    abyssLog(logMsg);
    // 星蚀衰印等：本击结算后再挂上「下次受伤增加」，避免加成到当前这一击
    if (useSkill && useSkill.targetDamageTakenPctNext != null && m && m.hp > 0) {
        m.damageTakenBonusNextPct = useSkill.targetDamageTakenPctNext;
    }
    if (useSkill && useSkill.stunChance && Math.random() < useSkill.stunChance) {
        m.stunned = (m.stunned || 0) + (useSkill.stunTurns || 1);
        abyssLog('怪物被眩晕 ' + (useSkill.stunTurns || 1) + ' 回合！');
    }
    if (useSkill && (useSkill.buffAtkPct != null || useSkill.buffDefPct != null || useSkill.buffHpPct != null || useSkill.buffCritRate != null || useSkill.buffCritDmg != null || useSkill.critRateBonus != null || useSkill.critDmgBonus != null || useSkill.comboBonus != null || (useSkill.buffRounds != null && useSkill.lifestealPct != null))) {
        var __critRateBuff = (useSkill.buffCritRate != null ? useSkill.buffCritRate : useSkill.critRateBonus);
        var __critDmgBuff = (useSkill.buffCritDmg != null ? useSkill.buffCritDmg : useSkill.critDmgBonus);
        var __comboBuff = (useSkill.buffCombo != null ? useSkill.buffCombo : useSkill.comboBonus);
        var __lifestealBuff = 0;
        if (useSkill.buffRounds != null && useSkill.lifestealPct != null) {
            var __lsRaw = Number(useSkill.lifestealPct) || 0;
            __lifestealBuff = Math.abs(__lsRaw) <= 1 ? (__lsRaw * 100) : __lsRaw;
        }
        abyssRun.buffSources = abyssRun.buffSources || [];
        abyssRun.buffSources.push({
            atkPct:    useSkill.buffAtkPct   || 0,
            defPct:    useSkill.buffDefPct   || 0,
            hpPct:     useSkill.buffHpPct    || 0,
            critRate:  __critRateBuff || 0,
            critDmg:   __critDmgBuff  || 0,
            combo:     __comboBuff || 0,
            lifestealPct: __lifestealBuff || 0,
            roundsLeft: useSkill.buffRounds || 2
        });
        abyssRecalcBuffsFromSources();
    }
    if (useSkill && useSkill.dodgeBonus) abyssRun.thisRoundDodgeBonus = useSkill.dodgeBonus;
    if ((abyssRun.playerClass || 'warrior') === 'archer' && finalDmg > 0) abyssRun.thisRoundDodgeBonus = (abyssRun.thisRoundDodgeBonus || 0) + 10;
    if (useSkill && useSkill.reduceDmgPct) abyssRun.thisRoundReduceDmg = useSkill.reduceDmgPct;
    if (useSkill && useSkill.lifestealPct && finalDmg > 0) {
        // 技能吸血 * (1 + 面板吸血%)，例如：50% * (1 + 150%) = 125%
        var totalLifestealPct = useSkill.lifestealPct * (1 + (stats.lifesteal || 0) / 100);
        var healAmt = Math.floor(finalDmg * totalLifestealPct);
        if (healAmt > 0) {
            abyssRun.player.hp = Math.min(stats.maxHp, abyssRun.player.hp + healAmt);
            abyssLog('技能回复 ' + formatNumber(healAmt) + ' 生命');
        }
    }
    if (useSkill && useSkill.shieldPct) {
        var sh = Math.floor(stats.maxHp * useSkill.shieldPct);
        abyssRun.player.shield = (abyssRun.player.shield || 0) + sh;
        abyssLog('获得护盾 ' + formatNumber(sh));
    }
    if (useSkill && useSkill.shieldSummonPct != null) {
        var summons = abyssRun.beastSummons || [];
        for (var ssi = 0; ssi < summons.length; ssi++) {
            var sb = summons[ssi];
            if (sb && sb.hp > 0 && sb.maxHp > 0) {
                var shSummon = Math.floor(sb.maxHp * useSkill.shieldSummonPct);
                sb.shield = (sb.shield || 0) + shSummon;
                abyssLog('召唤兽【' + (sb.name || '') + '】获得护盾 ' + formatNumber(shSummon));
            }
        }
    }
    var equipSkillProcOnce = {};
    if (abyssApplyEquipSkillProcEffects(stats, m, finalDmg, equipSkillProcOnce)) return;
    var deployedPets = abyssGetDeployedPets();
    var abyssPetPhaseEquipSkillOnce = {};
    for (var pidx = 0; pidx < deployedPets.length && m.hp > 0; pidx++) {
        var pet = deployedPets[pidx];
        if (!abyssIsPetCombatAlive(pet)) continue;
        if (pet.hp === null) {
            var _ps = abyssCalcPetStats(pet);
            if (_ps) pet.hp = _ps.maxHp;
        }
        var pstats = abyssCalcPetStats(pet);
        if (pstats) {
            var petDmg = Math.max(1, pstats.atk - Math.floor(m.def * (1 - (stats.reduceMonsterDef || 0) / 100) * 0.4));
            petDmg = Math.floor(petDmg * (1 - m.halfDamage));
            var critDone = false, comboDone = false;
            for (var psi = 0; psi < (pet.skills || []).length; psi++) {
                var psk = null;
                for (var pk = 0; pk < ABYSS_PET_SKILLS.length; pk++) {
                    if (ABYSS_PET_SKILLS[pk].id === pet.skills[psi].id) { psk = ABYSS_PET_SKILLS[pk]; break; }
                }
                if (!psk) continue;
                if (psk.critRate && !critDone && Math.random() * 100 < psk.critRate) {
                    petDmg = Math.floor(petDmg * (1 + (psk.critDmg || 50) / 100));
                    critDone = true;
                }
                if (psk.chance && !comboDone && Math.random() < psk.chance) {
                    petDmg = Math.floor(petDmg * (psk.multi || 2));
                    comboDone = true;
                }
                if (psk.dmgBonus) petDmg = Math.floor(petDmg * (1 + psk.dmgBonus));
            }
            
            var petEffectiveCritRate = Math.max(0, (pstats.critRate || 0) - Math.min(80, (abyssRun.floor || 1) * 0.4));
            if (!critDone && (pstats.critRate || 0) > 0 && Math.random() * 100 < petEffectiveCritRate) {
                petDmg = Math.floor(petDmg * (1 + (pstats.critDmg || 50) / 100));
                critDone = true;
            }
            petDmg = Math.max(1, petDmg);
            var premain = petDmg;
            if (m.shield > 0) {
                var toPs = Math.min(m.shield, premain);
                m.shield -= toPs;
                premain -= toPs;
            }
            if (m.skills && m.skills.length) { for (var lsp = 0; lsp < m.skills.length; lsp++) { if (m.skills[lsp].id === 'lastStand' && m.hp < m.maxHp * (m.skills[lsp].lastStandThreshold || 0.15)) { premain = Math.floor(premain * 0.5); premain = Math.max(1, premain); break; } } }
            if (premain > 0 && (m.dodge || 0) > 0 && Math.random() * 100 < (m.dodge || 0)) { premain = 0; abyssLog(m.name + ' 闪避了宠物攻击'); }
            if (premain > 0) m.hp -= premain;
            if (m.isBoss && m.hp > 0 && m.hp < m.maxHp * 0.5 && !m.secondPhase) {
                m.secondPhase = true;
                m.atk = Math.floor((m.atk || 0) * 1.28);
                m.def = Math.floor((m.def || 0) * 1.22);
                m.dodge = Math.min(45, (m.dodge || 0) + 18);
                abyssLog(m.name + ' 进入第二阶段！实力与闪避大幅提升');
            }
            if (m.skills) for (var csp = 0; csp < m.skills.length; csp++) { if (m.skills[csp].id === 'counterStrike') { m.counterStrikeNext = true; break; } }
            if ((pstats.lifesteal || 0) > 0 && petDmg > 0) {
                var petHeal = Math.floor(petDmg * (pstats.lifesteal || 0) / 100);
                if (petHeal > 0) {
                    var curHp = pet.hp != null ? pet.hp : pstats.maxHp;
                    pet.hp = Math.min(pstats.maxHp, curHp + petHeal);
                    abyssLog('宠物【' + pet.name + '】吸血回复 ' + formatNumber(petHeal));
                }
            }
            abyssLog('宠物【' + pet.name + '】造成 ' + formatNumber(petDmg) + ' 伤害');
            for (var _psei = 0; _psei < ABYSS_SLOTS.length; _psei++) {
                var ek = ABYSS_SLOTS[_psei];
                var eq = abyssRun.equipped[ek];
                if (!eq) continue;
                var petSkillList = [eq.equipSkill, eq.skillSlot].filter(Boolean);
                for (var pskIdx = 0; pskIdx < petSkillList.length; pskIdx++) {
                    var esk = petSkillList[pskIdx];
                    if (!esk || !esk.effect) continue;
                    var _pspk = abyssEquipSkillDedupeKey(esk);
                    if (_pspk && abyssPetPhaseEquipSkillOnce[_pspk]) continue;
                    if (_pspk) abyssPetPhaseEquipSkillOnce[_pspk] = true;
                    var eff = esk.effect;
                    if (eff.petSplitChance == null || eff.petSplitPct == null || Math.random() >= eff.petSplitChance) continue;
                    var aliveAll = abyssGetAliveMonsters();
                    var others = [];
                    for (var oi = 0; oi < aliveAll.length; oi++) { if (aliveAll[oi] !== m) others.push(aliveAll[oi]); }
                    if (others.length > 0) {
                        var petSplitDmg = Math.max(1, Math.floor(petDmg * eff.petSplitPct));
                        var petSplitTotal = 0;
                        for (var si = 0; si < others.length; si++) {
                            var tm = others[si];
                            var sd = Math.floor(petSplitDmg * (1 - (tm.halfDamage || 0)));
                            sd = Math.max(1, sd);
                            var srem = sd;
                            if (tm.shield > 0) { var ts = Math.min(tm.shield, srem); tm.shield -= ts; srem -= ts; }
                            if (srem > 0) tm.hp -= srem;
                            petSplitTotal += sd;
                        }
                        abyssLog('【' + (esk.name || '') + '】宠物分裂！对其它 ' + others.length + ' 个目标共造成 ' + formatNumber(petSplitTotal) + ' 伤害');
                    for (var di = abyssRun.monsters.length - 1; di >= 0; di--) {
                        var dm = abyssRun.monsters[di];
                        if (!dm || dm.hp > 0 || dm === m) continue;
                        var hasRev = false;
                        if (dm.skills && dm.skills.length && !dm.revived) for (var rvi = 0; rvi < dm.skills.length; rvi++) { if (dm.skills[rvi].id === 'revive') { hasRev = true; break; } }
                        if (hasRev) { var revSk3 = null; for (var rvx3 = 0; rvx3 < dm.skills.length; rvx3++) if (dm.skills[rvx3].id === 'revive') { revSk3 = dm.skills[rvx3]; break; } dm.revived = true; dm.hp = Math.floor(dm.maxHp * (revSk3 && revSk3.revivePct != null ? revSk3.revivePct : 0.25)); abyssLog(dm.name + ' 发动复活！'); }
                        else {
                            abyssPetGainExp(dm.isBoss ? 35 : (12 + Math.floor(Math.random() * 5)));
                            if (!dm.isBoss) {
                                var welf = dm.welfareReward || 1;
                                var normExp = (10 + Math.floor(Math.random() * 6)) * welf;
                                var normGold = (21 + Math.floor(Math.random() * 11)) * welf;
                                var applied = abyssApplyExpGoldBonus(normExp, normGold);
                                abyssRun.exp = (abyssRun.exp || 0) + applied.exp;
                                abyssRun.gold = (abyssRun.gold || 0) + applied.gold;
                                abyssLog('获得经验 ' + applied.exp + '，闯关金币 ' + applied.gold);
                                if (abyssCheckLevelUp()) { if (abyssGetAliveMonsters().length === 0) abyssOnKillMonster(); else abyssRun.monsters.splice(di, 1); return; }
                                if (Math.random() < 0.1) { abyssRun.materials.potion = (abyssRun.materials.potion || 0) + 1; abyssLog('获得生命药剂 x1'); }
                                if (Math.random() < 0.1) { abyssRun.materials.upgradeStone = (abyssRun.materials.upgradeStone || 0) + 1; abyssLog('获得升级石 x1'); }
                            }
                            abyssRun.monsters.splice(di, 1);
                        }
                    }
                    if (abyssGetAliveMonsters().length === 0) { stopAbyssAutoAttack(); abyssOnKillMonster(); return; }
                    abyssEnsurePlayerTarget();
                }
                }
            }
            // 宠物多目标技能：对其它存活怪物造成额外伤害
            var aliveAll = abyssGetAliveMonsters();
            var others = [];
            for (var oi = 0; oi < aliveAll.length; oi++) { if (aliveAll[oi] !== m) others.push(aliveAll[oi]); }
            if (others.length > 0 && (pet.skills || []).length > 0) {
                for (var aoeSi = 0; aoeSi < pet.skills.length; aoeSi++) {
                    var aoeSk = null;
                    for (var ask = 0; ask < ABYSS_PET_SKILLS.length; ask++) {
                        if (ABYSS_PET_SKILLS[ask].id === pet.skills[aoeSi].id) { aoeSk = ABYSS_PET_SKILLS[ask]; break; }
                    }
                    if (!aoeSk || aoeSk.petAoeChance == null || aoeSk.petAoePct == null || Math.random() >= aoeSk.petAoeChance) continue;
                    var aoeDmg = Math.max(1, Math.floor(petDmg * aoeSk.petAoePct));
                    var aoeTotal = 0;
                    for (var ai = 0; ai < others.length; ai++) {
                        var am = others[ai];
                        if (!am || am.hp <= 0) continue;
                        var ad = Math.floor(aoeDmg * (1 - (am.halfDamage || 0)));
                        ad = Math.max(1, ad);
                        var arem = ad;
                        if (am.shield > 0) { var as = Math.min(am.shield, arem); am.shield -= as; arem -= as; }
                        if (arem > 0) am.hp -= arem;
                        aoeTotal += ad;
                    }
                    if (aoeTotal > 0) abyssLog('宠物【' + pet.name + '】' + aoeSk.name + '！对其它 ' + others.length + ' 个目标共造成 ' + formatNumber(aoeTotal) + ' 伤害');
                }
                for (var di = abyssRun.monsters.length - 1; di >= 0; di--) {
                    var dm = abyssRun.monsters[di];
                    if (!dm || dm.hp > 0 || dm === m) continue;
                    var hasRev = false;
                    if (dm.skills && dm.skills.length && !dm.revived) for (var rvi = 0; rvi < dm.skills.length; rvi++) { if (dm.skills[rvi].id === 'revive') { hasRev = true; break; } }
                    if (hasRev) { var revSk4 = null; for (var rvx4 = 0; rvx4 < dm.skills.length; rvx4++) if (dm.skills[rvx4].id === 'revive') { revSk4 = dm.skills[rvx4]; break; } dm.revived = true; dm.hp = Math.floor(dm.maxHp * (revSk4 && revSk4.revivePct != null ? revSk4.revivePct : 0.25)); abyssLog(dm.name + ' 发动复活！'); }
                    else {
                        abyssPetGainExp(dm.isBoss ? 35 : (12 + Math.floor(Math.random() * 5)));
                        if (!dm.isBoss) {
                            var welf = dm.welfareReward || 1;
                            var rewardM = dm.rewardMult || 1;
                            var normExp = (10 + Math.floor(Math.random() * 6)) * welf * rewardM;
                            var normGold = (21 + Math.floor(Math.random() * 11)) * welf * rewardM;
                            var applied = abyssApplyExpGoldBonus(normExp, normGold);
                            abyssRun.exp = (abyssRun.exp || 0) + applied.exp;
                            abyssRun.gold = (abyssRun.gold || 0) + applied.gold;
                            abyssLog('获得经验 ' + applied.exp + '，闯关金币 ' + applied.gold);
                            if (abyssCheckLevelUp()) { if (abyssGetAliveMonsters().length === 0) abyssOnKillMonster(); else abyssRun.monsters.splice(di, 1); return; }
                            if (Math.random() < 0.1) { abyssRun.materials.potion = (abyssRun.materials.potion || 0) + 1; abyssLog('获得生命药剂 x1'); }
                            if (Math.random() < 0.1) { abyssRun.materials.upgradeStone = (abyssRun.materials.upgradeStone || 0) + 1; abyssLog('获得升级石 x1'); }
                        }
                        abyssRun.monsters.splice(di, 1);
                    }
                }
                if (abyssGetAliveMonsters().length === 0) { stopAbyssAutoAttack(); abyssOnKillMonster(); return; }
                abyssEnsurePlayerTarget();
            }
        }
    }
    var beasts = abyssRun.beastSummons || [];
    var summonTemp = (abyssRun.buffs && abyssRun.buffs.summonTemp && (abyssRun.buffs.summonTemp.roundsLeft || 0) > 0) ? abyssRun.buffs.summonTemp : null;
    var soulSummonAtk = (abyssRun.buffs && abyssRun.buffs.summonAtkPctSoul) ? abyssRun.buffs.summonAtkPctSoul : 0;
    for (var bi = 0; bi < beasts.length; bi++) {
        var beast = beasts[bi];
        if (!beast || beast.hp <= 0) continue;
        var beastAtk = (beast.atk || 0) * (1 + ((summonTemp ? (summonTemp.atkPct || 0) : 0) + soulSummonAtk) / 100);
        var beastDmg = Math.max(1, Math.floor(beastAtk) - Math.floor((m.def || 0) * 0.5));
        beastDmg = Math.floor(beastDmg * (1 - (m.halfDamage || 0)));
        var bremain = beastDmg;
        if (m.shield > 0) {
            var toSh = Math.min(m.shield, bremain);
            m.shield -= toSh;
            bremain -= toSh;
        }
        if (bremain > 0) m.hp -= bremain;
        abyssLog('【' + (beast.name || '战兽') + '】造成 ' + formatNumber(beastDmg) + ' 伤害');
    }
    for (var bj = beasts.length - 1; bj >= 0; bj--) {
        if (beasts[bj] && beasts[bj].hp <= 0) beasts.splice(bj, 1);
    }
    if (m.hp <= 0) {
        var usedSurvive = false;
        if (m.skills && m.skills.length && !m.surviveOneDeathUsed) {
            for (var sodi = 0; sodi < m.skills.length; sodi++) {
                if (m.skills[sodi].id === 'surviveOneDeath') { m.hp = 1; m.surviveOneDeathUsed = true; usedSurvive = true; abyssLog(m.name + ' 不溃！保留1点生命'); break; }
            }
        }
        if (usedSurvive) { /* 本回合不死亡 */ } else if (m.hp <= 0) {
        var hasRevive = false;
        if (m.skills && m.skills.length && !m.revived) {
            for (var si = 0; si < m.skills.length; si++) {
                if (m.skills[si].id === 'revive') { hasRevive = true; break; }
            }
        }
        if (hasRevive) {
            var revSkM = null; for (var rvxm = 0; rvxm < m.skills.length; rvxm++) if (m.skills[rvxm].id === 'revive') { revSkM = m.skills[rvxm]; break; }
            m.revived = true;
            m.hp = Math.floor(m.maxHp * (revSkM && revSkM.revivePct != null ? revSkM.revivePct : 0.25));
            abyssLog('BOSS发动复活！恢复' + ((revSkM && revSkM.revivePct != null ? revSkM.revivePct : 0.25) * 100).toFixed(0) + '%生命');
        } else {
            if (m.skills && m.skills.length) {
                for (var dci = 0; dci < m.skills.length; dci++) {
                    if (m.skills[dci].id === 'deathCurse') {
                        var deathDmg = Math.floor(stats.maxHp * (m.skills[dci].deathDmgMaxHpPct || 0.14));
                        abyssRun.player.hp = bLteZero(bSub(abyssRun.player.hp || 0, deathDmg)) ? 0 : bSub(abyssRun.player.hp || 0, deathDmg);
                        abyssLog(m.name + ' 怨念！对你造成 ' + formatNumber(deathDmg) + ' 伤害');
                        if (bLteZero(abyssRun.player.hp)) {
                            abyssRun.deathInfo = abyssRun.deathInfo || ('被' + m.name + '【' + (m.skills[dci].name || '怨念') + '】造成 ' + formatNumber(deathDmg) + ' 伤害击败');
                            stopAbyssAutoAttack(); abyssOnPlayerDeath(); return;
                        }
                        break;
                    }
                }
            }
            var expGain = m.isBoss ? 35 : (12 + Math.floor(Math.random() * 5));
            abyssPetGainExp(Math.floor(expGain));
            if (!m.isBoss) {
                var welf = m.welfareReward || 1;
                var rewardM = m.rewardMult || 1;
                var normExp = (10 + Math.floor(Math.random() * 6)) * welf * rewardM;
                var normGold = (21 + Math.floor(Math.random() * 11)) * welf * rewardM;
                var applied = abyssApplyExpGoldBonus(normExp, normGold);
                abyssRun.exp = (abyssRun.exp || 0) + applied.exp;
                abyssRun.gold = (abyssRun.gold || 0) + applied.gold;
                abyssLog('获得经验 ' + applied.exp + '，闯关金币 ' + applied.gold);
                if (abyssCheckLevelUp()) {
                    if (abyssGetAliveMonsters().length === 0) abyssOnKillMonster();
                    else { var deadIdx = abyssRun.monsters.indexOf(m); if (deadIdx >= 0) abyssRun.monsters.splice(deadIdx, 1); }
                    return;
                }
                if (Math.random() < 0.1) {
                    abyssRun.materials.potion = (abyssRun.materials.potion || 0) + 1;
                    abyssLog('获得生命药剂 x1');
                }
                if (Math.random() < 0.1) {
                    abyssRun.materials.upgradeStone = (abyssRun.materials.upgradeStone || 0) + 1;
                    abyssLog('获得升级石 x1');
                }
            }
            abyssLog('击败 ' + (m ? m.name : '') + '！');
            var deadIdx = abyssRun.monsters.indexOf(m);
            if (deadIdx >= 0) abyssRun.monsters.splice(deadIdx, 1);
            if (abyssGetAliveMonsters().length === 0) {
                stopAbyssAutoAttack();
                abyssOnKillMonster();
                return;
            }
            abyssEnsurePlayerTarget();
        }
        }
    }
    if (m.skills && m.skills.length) {
        for (var si = 0; si < m.skills.length; si++) {
            if (m.skills[si].id === 'thorns' && finalDmg > 0) {
                // 无限深渊已去掉怪物反伤，此处不再造成反伤伤害
                break;
            }
        }
    }
    }
    var allMonsters = abyssGetAliveMonsters();
    for (var mi = 0; mi < allMonsters.length; mi++) {
        var m = allMonsters[mi];
        if (m.hp <= 0) continue;
        if ((m.burnTurns || 0) > 0) {
            var burnDmg = Math.max(1, Math.floor(m.maxHp * (m.burnDmgPct || 0.02)));
            m.hp -= burnDmg;
            m.burnTurns--;
            abyssLog(m.name + ' 灼烧造成 ' + formatNumber(burnDmg) + ' 伤害（剩余' + m.burnTurns + '回合）');
            abyssPushTriggeredBuff('灼烧', m.name + ' 受到 ' + formatNumber(burnDmg) + ' 灼烧伤害');
            if (m.hp <= 0) { if (abyssProcessMonsterDeath(m)) return; continue; }
        }
        if (m.hp > 0 && (m.poisonTurns || 0) > 0) {
            var poisonDmg = Math.max(1, Math.floor(m.maxHp * (m.poisonDmgPct || 0.02)));
            m.hp -= poisonDmg;
            m.poisonTurns--;
            abyssLog(m.name + ' 中毒造成 ' + formatNumber(poisonDmg) + ' 伤害（剩余' + m.poisonTurns + '回合）');
            abyssPushTriggeredBuff('中毒', m.name + ' 受到 ' + formatNumber(poisonDmg) + ' 中毒伤害');
            if (m.hp <= 0) { if (abyssProcessMonsterDeath(m)) return; continue; }
        }
        if (m.hp > 0 && (m.bleedTurns || 0) > 0) {
            var bleedDmg = Math.max(1, Math.floor(m.maxHp * (m.bleedDmgPct || 0.02)));
            m.hp -= bleedDmg;
            m.bleedTurns--;
            abyssLog(m.name + ' 流血造成 ' + formatNumber(bleedDmg) + ' 伤害（剩余' + m.bleedTurns + '回合）');
            abyssPushTriggeredBuff('流血', m.name + ' 受到 ' + formatNumber(bleedDmg) + ' 流血伤害');
            if (m.hp <= 0) { if (abyssProcessMonsterDeath(m)) return; continue; }
        }
        if (m.hp <= 0) { if (abyssProcessMonsterDeath(m)) return; continue; }
        if ((m.stunned || 0) > 0) {
            m.stunned--;
            abyssLog(m.name + ' 被眩晕，本回合无法行动');
            continue;
        }
        if (m.isBoss && m.hp > 0 && m.hp < m.maxHp * 0.1 && Math.random() < 0.12) {
            var healAmt = Math.floor(m.maxHp * 0.1);
            m.hp = Math.min(m.maxHp, m.hp + healAmt);
            abyssLog('「蝼蚁安能伤吾！——回天续命！」' + m.name + ' 恢复10%最大生命 +' + formatNumber(healAmt) + '！');
            continue;
        }
        if (m.skills) for (var fsi = 0; fsi < m.skills.length; fsi++) {
            var fsk = m.skills[fsi];
            if (fsk.id === 'firstStrike' && Math.random() < (fsk.chance || 0.25)) {
                var firstDmg = fsk.firstStrikeMult ? Math.max(1, Math.floor(m.atk * fsk.firstStrikeMult) - Math.floor(stats.def * 0.2)) : Math.max(1, Math.floor(m.atk * (fsk.firstStrikePct || 0.6)) - Math.floor(stats.def * 0.2));
                var fsGuard = abyssResolveGuardDamageTargets(firstDmg, m);
                var fsLabel = fsk.name || '先制';
                if (fsGuard.takenPet > 0 && fsGuard.pet2) {
                    var fsPet = fsGuard.pet2;
                    if (fsPet.hp === null) { var _fsPs = abyssCalcPetStats(fsPet); if (_fsPs) fsPet.hp = _fsPs.maxHp; }
                    fsPet.hp = Math.max(0, (fsPet.hp || 0) - fsGuard.takenPet);
                    if (fsPet.hp <= 0 && fsPet.isDivine) fsPet.deathRound = abyssRun.roundCount || 0;
                    abyssLog(m.name + ' 先制！造成 ' + formatNumber(fsGuard.takenPet) + ' 伤害 → 宠物【' + fsPet.name + '】');
                } else if (fsGuard.takenBeast > 0 && fsGuard.aliveBeasts.length > 0) {
                    var fsBeast = fsGuard.aliveBeasts[0];
                    fsBeast.hp = bLteZero(bSub(fsBeast.hp || 0, fsGuard.takenBeast)) ? 0 : bSub(fsBeast.hp || 0, fsGuard.takenBeast);
                    abyssLog(m.name + ' 先制！造成 ' + formatNumber(fsGuard.takenBeast) + ' 伤害 → 【' + (fsBeast.name || '战兽') + '】');
                } else if (fsGuard.takenPlayer > 0) {
                    abyssRun.player.hp = bLteZero(bSub(abyssRun.player.hp || 0, fsGuard.takenPlayer)) ? 0 : bSub(abyssRun.player.hp || 0, fsGuard.takenPlayer);
                    abyssLog(m.name + ' 先制！造成 ' + formatNumber(fsGuard.takenPlayer) + ' 伤害 → 玩家');
                    if (bLteZero(abyssRun.player.hp)) {
                        abyssRun.deathInfo = abyssRun.deathInfo || ('被' + m.name + '【' + fsLabel + '】造成 ' + formatNumber(fsGuard.takenPlayer) + ' 伤害击败');
                        stopAbyssAutoAttack(); abyssOnPlayerDeath(); return;
                    }
                } else {
                    abyssLog(m.name + ' 先制！被闪避');
                }
                break;
            }
        }
        if (m.skills) for (var saci = 0; saci < m.skills.length; saci++) {
            var sask = m.skills[saci];
            if (sask.id === 'sacrifice' && Math.random() < (sask.chance || 0.2)) {
                m.hp = Math.max(1, (m.hp || 0) - Math.floor(m.maxHp * (sask.sacrificeHpPct || 0.1)));
                m._sacrificeDmgBonus = sask.dmgBonus || 0.35;
                abyssLog(m.name + ' 献祭生命，本回合伤害提升！');
                break;
            }
        }
        var monsterAtk = m.atk;
        if (m.skills && m.skills.length) {
            for (var bpi = 0; bpi < m.skills.length; bpi++) {
                if (m.skills[bpi].id === 'bloodPrice' && Math.random() < 0.25) {
                    var cost = Math.floor(m.maxHp * (m.skills[bpi].selfHpCostPct || 0.08));
                    m.hp = Math.max(1, (m.hp || 0) - cost);
                    m._bloodPriceAtk = m.skills[bpi].atkBonus || 0.5;
                    abyssLog(m.name + ' 血偿！消耗生命提升攻击');
                    break;
                }
            }
        }
        var playerDef = stats.def;
        if (m.skills && m.skills.length) {
            for (var si = 0; si < m.skills.length; si++) {
                var sk = m.skills[si];
                if (sk.id === 'armorBreak') playerDef *= (1 - (sk.defIgnore || 0.3));
                if (sk.id === 'curse') playerDef *= (1 - (sk.defIgnore || 0.1));
                if (sk.id === 'overwhelm') playerDef *= (1 - (sk.overwhelmDefIgnore || 0.4));
                if (sk.id === 'rage') { var rageTh = sk.rageThreshold != null ? sk.rageThreshold : 0.4; if (m.hp / m.maxHp < rageTh) monsterAtk = Math.floor(monsterAtk * (1 + (sk.atkBonus || 0.4))); }
                if (sk.id === 'bloodthirst') monsterAtk = Math.floor(monsterAtk * (1 + (1 - m.hp / m.maxHp) * (sk.atkBonusPerMissing || 0.5)));
                if (sk.id === 'enrageTimer' && (m._enrageTurns || 0) >= (sk.turnsToEnrage || 4)) monsterAtk = Math.floor(monsterAtk * (1 + (sk.enrageAtkBonus || 0.3)));
                if (sk.id === 'enrageAtRounds' && (abyssRun.roundCount || 0) >= (sk.enrageRound || 3)) monsterAtk = Math.floor(monsterAtk * (sk.enrageMult || 1.5));
            }
        }
        monsterAtk = Math.max(1, monsterAtk - Math.floor(playerDef * 0.3));
        if (m.element) monsterAtk = Math.floor(monsterAtk * 1.1);
        var multi = 1;
        if (m.skills && m.skills.length) {
            for (var si = 0; si < m.skills.length; si++) {
                var sk = m.skills[si];
                if ((sk.id === 'quadrupleStrike' && Math.random() < (sk.chance || 0.1)) || (sk.id === 'tripleStrike' && Math.random() < (sk.chance || 0.12)) || (sk.id === 'doubleStrike' && Math.random() < (sk.chance || 0.2)) || (sk.id === 'multiHit' && Math.random() < (sk.chance || 0.25)) || (sk.id === 'freeze' && Math.random() < (sk.chance || 0.12))) {
                    var mul = sk.multi || 2;
                    if (mul > multi) multi = mul;
                }
                if (sk.id === 'heavyStrike' && Math.random() < (sk.chance || 0.25)) multi = Math.max(multi, 1.5);
            }
        } else if (Math.random() < m.multiHit) multi = 2;
        if (m._bloodPriceAtk != null) { monsterAtk = Math.floor(monsterAtk * (1 + m._bloodPriceAtk)); m._bloodPriceAtk = null; }
        var taken = Math.floor(monsterAtk * multi);
        if (m._sacrificeDmgBonus != null) { taken = Math.floor(taken * (1 + m._sacrificeDmgBonus)); m._sacrificeDmgBonus = null; }
        if (abyssRun.markedTarget === 'player' && abyssRun.markedByIndex === mi) { taken = Math.floor(taken * (1 + (m.skills && m.skills.length ? (function(){ for (var mki = 0; mki < m.skills.length; mki++) if (m.skills[mki].id === 'mark') return m.skills[mki].markDmgBonus || 0.45; return 0.45; })() : 0.45))); abyssRun.markedTarget = null; abyssRun.markedByIndex = null; abyssLog(m.name + ' 点名命中！'); }
        if (m.skills && m.skills.length) {
            for (var si = 0; si < m.skills.length; si++) {
                var sk = m.skills[si];
                if (sk.id === 'execute' && abyssRun.player.hp / stats.maxHp < (sk.lowHpThreshold || 0.3)) taken = Math.floor(taken * (1 + (sk.dmgBonus || 0.5)));
                if (sk.id === 'crush') taken = Math.floor(taken * (1 + (sk.dmgBonus || 0.25)));
                if (sk.id === 'bleed') taken = Math.floor(taken * (1 + (sk.extraDmg || 0.05)));
                if (sk.id === 'venom') taken = Math.floor(taken * (1 + (sk.dmgBonus || 0.1)));
                if (sk.id === 'voidTouch') { var missingHp = Math.max(0, stats.maxHp - (abyssRun.player.hp || 0)); taken += Math.floor(missingHp * (sk.missingHpDmgPct || 0.2)); }
                if (sk.id === 'curseMark') { m.curseMarkStacks = (m.curseMarkStacks || 0) + 1; var cmBonus = Math.min(sk.stackMax || 0.3, (m.curseMarkStacks || 0) * (sk.stackDmgPerHit || 0.06)); taken = Math.floor(taken * (1 + cmBonus)); }
                if (sk.id === 'entropy' && Math.random() < (sk.chaosChance || 0.25)) taken = Math.floor(taken * (Math.random() < 0.5 ? 1.5 : 0.5));
            }
        }
        var minionCount = 0;
        for (var rci = 0; rci < allMonsters.length; rci++) if (allMonsters[rci].isSummon || (allMonsters[rci].name && allMonsters[rci].name.indexOf('仆从') >= 0)) minionCount++;
        if (m.skills) for (var rsi = 0; rsi < m.skills.length; rsi++) if (m.skills[rsi].id === 'resonance' && minionCount > 0) { taken = Math.floor(taken * (1 + minionCount * (m.skills[rsi].dmgPerMinion || 0.1))); break; }
        var totalDR = 0;
        var drEquipSkillSeen = {};
        for (var _dri = 0; _dri < ABYSS_SLOTS.length; _dri++) {
            var ek2 = ABYSS_SLOTS[_dri];
            var eq2 = abyssRun.equipped[ek2];
            if (!eq2) continue;
            var drList = [eq2.equipSkill, eq2.skillSlot].filter(Boolean);
            for (var dri = 0; dri < drList.length; dri++) {
                var drSk = drList[dri];
                if (!drSk || !drSk.effect || drSk.effect.damageReduction == null) continue;
                var _drk = abyssEquipSkillDedupeKey(drSk);
                if (_drk && drEquipSkillSeen[_drk]) continue;
                if (_drk) drEquipSkillSeen[_drk] = true;
                totalDR += drSk.effect.damageReduction;
            }
        }
        var soulDrFrac = (stats.soulDamageReductionPct || 0) / 100;
        totalDR += soulDrFrac;
        var takenBase = taken;
        taken = Math.floor(taken * (1 - Math.min(0.6, totalDR)));
        if (m.element && stats.elementRes && stats.elementRes[m.element]) {
            var myRes = Math.min(75, stats.elementRes[m.element]);
            taken = Math.floor(taken * (1 - myRes / 100));
        }
        taken = Math.max(1, taken);
        if ((abyssRun.playerClass || 'warrior') === 'warrior' && stats.maxHp > 0 && taken > Math.floor(stats.maxHp * 0.2)) taken = Math.floor(taken * 0.85);
        if (abyssRun.thisRoundReduceDmg) taken = Math.floor(taken * (1 - (abyssRun.thisRoundReduceDmg || 0) / 100));
        // 全局减伤上限：不论职业与来源，总减伤最高 99.9%（至少承受 0.1% 原始伤害）
        if (takenBase > 0) {
            var minRemainFactor = 0.001; // 剩余至少 0.1% 伤害
            var minTaken = Math.max(1, Math.floor(takenBase * minRemainFactor));
            if (taken < minTaken) taken = minTaken;
        }
        var abyssFloorForHit = abyssRun.floor || 1;
        
        var abyssMonsterHitPct = Math.min(60, abyssFloorForHit * 0.3);
        var dodgeCheck = Math.max(0, (stats.dodge || 0) + (abyssRun.thisRoundDodgeBonus || 0) - abyssMonsterHitPct);
        if (Math.random() * 100 < dodgeCheck) { taken = 0; abyssSoulCardOnDodgeSuccess(); abyssLog(m.name + ' 攻击被闪避！'); continue; }
        var guardHit = abyssResolveGuardDamageTargets(taken, m);
        var deployedForHit = guardHit.deployedForHit;
        var aliveBeasts = guardHit.aliveBeasts;
        var pet2 = guardHit.pet2;
        var takenPlayer = guardHit.takenPlayer;
        var takenPet = guardHit.takenPet;
        var takenBeast = guardHit.takenBeast;
        var hitAllUsed = false;
        if (m.skills) for (var hai = 0; hai < m.skills.length; hai++) {
            if (m.skills[hai].id === 'hitAll') {
                var haPct = m.skills[hai].hitAllPct || 0.55;
                var hitAllDmg = Math.max(1, Math.floor(taken * haPct));
                abyssRun.player.hp = bSub(abyssRun.player.hp, hitAllDmg);
                abyssLog(m.name + ' 崩裂！玩家受到 ' + formatNumber(hitAllDmg) + ' 伤害');
                for (var pi = 0; pi < deployedForHit.length; pi++) {
                    var pt = deployedForHit[pi];
                    if (pt && (pt.hp === null || pt.hp > 0)) {
                        if (pt.hp === null) { var _ps2 = abyssCalcPetStats(pt); if (_ps2) pt.hp = _ps2.maxHp; }
                        pt.hp = bLteZero(bSub(pt.hp || 0, hitAllDmg)) ? 0 : bSub(pt.hp || 0, hitAllDmg);
                        if (pt.hp < 0) pt.hp = 0;
                        abyssLog(m.name + ' 崩裂！宠物【' + pt.name + '】受到 ' + formatNumber(hitAllDmg) + ' 伤害');
                    }
                }
                for (var bi = 0; bi < aliveBeasts.length; bi++) {
                    var b = aliveBeasts[bi];
                    var dmgLeft = hitAllDmg;
                    if ((b.shield || 0) > 0) {
                        var toSh = Math.min(b.shield, dmgLeft);
                        b.shield = (b.shield || 0) - toSh;
                        dmgLeft -= toSh;
                    }
                    b.hp = bLteZero(bSub(b.hp || 0, dmgLeft)) ? 0 : bSub(b.hp || 0, dmgLeft);
                    abyssLog(m.name + ' 崩裂！【' + (b.name || '战兽') + '】受到 ' + formatNumber(hitAllDmg) + ' 伤害');
                }
                takenPlayer = hitAllDmg; takenPet = 0; takenBeast = 0;
                hitAllUsed = true;
                break;
            }
        }
        if (!hitAllUsed && takenBeast > 0 && aliveBeasts.length > 0) {
            var targBeast = aliveBeasts[0];
            var summonTemp2 = (abyssRun.buffs && abyssRun.buffs.summonTemp && (abyssRun.buffs.summonTemp.roundsLeft || 0) > 0) ? abyssRun.buffs.summonTemp : null;
            if (summonTemp2 && (summonTemp2.defPct || 0) > 0) {
                var beastDef = (targBeast.def || 0) * (1 + (summonTemp2.defPct || 0) / 100);
                takenBeast = Math.max(1, takenBeast - Math.floor(beastDef * 0.3));
            }
            var toShieldB = 0;
            if ((targBeast.shield || 0) > 0) {
                toShieldB = Math.min(targBeast.shield, takenBeast);
                targBeast.shield = (targBeast.shield || 0) - toShieldB;
                takenBeast -= toShieldB;
            }
            targBeast.hp = bLteZero(bSub(targBeast.hp || 0, takenBeast)) ? 0 : bSub(targBeast.hp || 0, takenBeast);
            abyssLog(m.name + ' 造成 ' + formatNumber(toShieldB + takenBeast) + ' 伤害 → 【' + (targBeast.name || '战兽') + '】' + (targBeast.hp <= 0 ? ' 已消散' : ''));
            if (abyssRun.thisRoundCounterPct && takenBeast > 0) {
                var refDmg = Math.floor(takenBeast * abyssRun.thisRoundCounterPct / 100);
                m.hp = bLteZero(bSub(m.hp || 0, refDmg)) ? 0 : bSub(m.hp || 0, refDmg);
                abyssLog('反击造成 ' + formatNumber(refDmg) + ' 伤害 → ' + m.name);
                if (m.hp <= 0 && abyssProcessMonsterDeath(m)) return;
            }
        }
        if (!hitAllUsed && takenPet > 0 && pet2) {
            if (pet2.hp === null) { var _ps = abyssCalcPetStats(pet2); if (_ps) pet2.hp = _ps.maxHp; }
            var pst = abyssCalcPetStats(pet2);
            if (pst && m.skills) for (var epi = 0; epi < m.skills.length; epi++) if (m.skills[epi].id === 'executePet') { var petHpPct = (pet2.hp != null ? pet2.hp : pst.maxHp) / (pst.maxHp || 1); if (petHpPct < (m.skills[epi].executePetThreshold || 0.35)) { takenPet = Math.floor(takenPet * (1 + (m.skills[epi].executePetBonus || 0.6))); abyssLog(m.name + ' 屠宠！'); } break; }
            
            var petEffDodge = Math.max(0, ((pst && pst.dodge) || 0) - abyssMonsterHitPct);
            if (petEffDodge > 0 && Math.random() * 100 < petEffDodge) {
                takenPet = 0;
                abyssLog('宠物【' + pet2.name + '】闪避了攻击');
            } else {
                var takenPetBase = takenPet;
                if (pst) takenPet = Math.max(1, takenPet - Math.floor((pst.def || 0) * 0.3));
                if (pst && (pst.damageReduction || 0) > 0) takenPet = Math.max(1, Math.floor(takenPet * (1 - Math.min(0.999, pst.damageReduction))));
                // 宠物与深渊神兽全局减伤上限：总减伤最高 99.9%（至少承受 0.1% 原始宠物伤害）
                if (takenPetBase > 0) {
                    var petMinRemainFactor = 0.001;
                    var minTakenPet = Math.max(1, Math.floor(takenPetBase * petMinRemainFactor));
                    if (takenPet < minTakenPet) takenPet = minTakenPet;
                }
                pet2.hp = (pet2.hp || 0) - takenPet;
                if (pet2.hp < 0) pet2.hp = 0;
                if (pet2.hp <= 0 && pet2.isDivine) pet2.deathRound = abyssRun.roundCount || 0;
                abyssLog(m.name + ' 造成 ' + formatNumber(takenPet) + ' 伤害 → 宠物【' + pet2.name + '】' + (pet2.hp <= 0 ? (pet2.isDivine ? ' 已死亡，4回合后自动复活' : ' 已死亡，可使用复活药水复活') : ''));
            }
        }
        if (!hitAllUsed && takenPlayer > 0) {
            if (abyssRun.player.shield > 0) {
                var toShield = Math.min(abyssRun.player.shield, takenPlayer);
                abyssRun.player.shield -= toShield;
                takenPlayer -= toShield;
            }
            abyssRun.player.hp = bSub(abyssRun.player.hp, takenPlayer);
            abyssLog(m.name + ' 造成 ' + formatNumber(takenPlayer) + ' 伤害 → 玩家');
            if (abyssRun.thisRoundCounterPct && takenPlayer > 0) {
                var refDmg2 = Math.floor(takenPlayer * abyssRun.thisRoundCounterPct / 100);
                m.hp = bLteZero(bSub(m.hp || 0, refDmg2)) ? 0 : bSub(m.hp || 0, refDmg2);
                abyssLog('反击造成 ' + formatNumber(refDmg2) + ' 伤害 → ' + m.name);
                if (m.hp <= 0 && abyssProcessMonsterDeath(m)) return;
            }
            if (stats.thornsPct && takenPlayer > 0) {
                var thornsDmg = Math.floor(takenPlayer * (stats.thornsPct || 0) / 100);
                if (thornsDmg > 0) {
                    m.hp = bLteZero(bSub(m.hp || 0, thornsDmg)) ? 0 : bSub(m.hp || 0, thornsDmg);
                    abyssLog('反伤造成 ' + formatNumber(thornsDmg) + ' 伤害 → ' + m.name);
                    abyssPushTriggeredBuff('反伤', '反伤 ' + formatNumber(thornsDmg) + ' → ' + m.name);
                    if (m.hp <= 0 && abyssProcessMonsterDeath(m)) return;
                }
            }
        }
        var heal = Math.floor((takenPlayer + takenPet) * (stats.lifesteal || 0) / 100);
        if (heal > 0) {
            var healReducePct = 0;
            var aliveForHeal = abyssGetAliveMonsters();
            for (var hri = 0; hri < aliveForHeal.length; hri++) {
                var monHeal = aliveForHeal[hri];
                if (monHeal.skills) for (var hrii = 0; hrii < monHeal.skills.length; hrii++) {
                    if (monHeal.skills[hrii].id === 'healReduce') healReducePct = Math.max(healReducePct, monHeal.skills[hrii].healReducePct || 0);
                    if (monHeal.skills[hrii].id === 'corrupt') healReducePct = Math.max(healReducePct, monHeal.skills[hrii].corruptHealPct || 0);
                }
            }
            heal = Math.floor(heal * (1 - healReducePct));
            if (heal > 0) { abyssRun.player.hp = bAdd(abyssRun.player.hp, heal); abyssRun.player.hp = cmpBigSci(abyssRun.player.hp, stats.maxHp) > 0 ? stats.maxHp : abyssRun.player.hp; }
        }
        if (m.skills && m.skills.length && (takenPlayer + takenPet) > 0) {
            for (var lsi = 0; lsi < m.skills.length; lsi++) {
                if (m.skills[lsi].id === 'lifesteal') {
                    var healB = Math.floor((takenPlayer + takenPet) * (m.skills[lsi].rate || 0.1));
                    if (healB > 0) { m.hp = Math.min(m.maxHp, (m.hp || 0) + healB); abyssLog(m.name + ' 吸血恢复 ' + formatNumber(healB)); }
                    break;
                }
            }
        }
        if (taken > 0 && m.skills && m.skills.length) {
            for (var igi = 0; igi < m.skills.length; igi++) {
                if (m.skills[igi].id === 'ignite' && Math.random() < 0.5) {
                    abyssRun.playerBurning = { rate: m.skills[igi].dotRate || 0.05, rounds: 3 };
                    abyssLog(m.name + ' 施加灼烧！');
                    break;
                }
            }
            for (var sdi = 0; sdi < m.skills.length; sdi++) {
                if (m.skills[sdi].id === 'soulDrain' && (takenPlayer + takenPet) > 0 && Math.random() < 0.5) {
                    abyssRun.playerSoulDrain = { rate: m.skills[sdi].dotMaxHpPct || 0.04, rounds: m.skills[sdi].dotRounds || 2 };
                    abyssLog(m.name + ' 魂噬！对你施加生命侵蚀');
                    break;
                }
            }
        }
        if (m.skills && m.skills.length && (takenPlayer + takenPet) > 0) {
            for (var sili = 0; sili < m.skills.length; sili++) {
                if (m.skills[sili].id === 'silence' && Math.random() < (m.skills[sili].silenceChance || 0.3)) {
                    abyssRun.playerSilenced = m.skills[sili].silenceRounds || 1;
                    abyssLog(m.name + ' 静默！你' + abyssRun.playerSilenced + '回合无法使用技能');
                    break;
                }
                if (m.skills[sili].id === 'timeStop' && Math.random() < (m.skills[sili].chance || 0.2)) {
                    abyssRun.skipPlayerTurn = m.skills[sili].skipTurns || 1;
                    abyssLog(m.name + ' 时空凝滞！你' + abyssRun.skipPlayerTurn + '回合无法行动');
                    break;
                }
            }
            for (var mpsi = 0; mpsi < m.skills.length; mpsi++) {
                if (m.skills[mpsi].id === 'mpSteal') {
                    var maxMpVal = abyssMaxMpForLevel(runLevel);
                    var stealMp = Math.floor(maxMpVal * (m.skills[mpsi].mpStealPct || 0.2));
                    abyssRun.player.mp = Math.max(0, (abyssRun.player.mp || 0) - stealMp);
                    if (stealMp > 0) abyssLog(m.name + ' 夺魂！失去 ' + stealMp + ' 魔法');
                    break;
                }
                if (m.skills[mpsi].id === 'manaBurn') {
                    var maxMpVal2 = abyssMaxMpForLevel(runLevel);
                    var burnMp = Math.floor(maxMpVal2 * (m.skills[mpsi].burnPct || 0.18));
                    abyssRun.player.mp = Math.max(0, (abyssRun.player.mp || 0) - burnMp);
                    if (burnMp > 0) abyssLog(m.name + ' 燃魔！失去 ' + burnMp + ' 魔法');
                    break;
                }
            }
            // 已禁用怪物“掠夺”增益清除效果（保留代码以便后续需要时恢复）
            for (var sbi = 0; sbi < m.skills.length; sbi++) {
                if (false && m.skills[sbi].id === 'stealBuff' && Math.random() < (m.skills[sbi].stealBuffChance || 0.35)) {
                    if (abyssRun.buffs && (abyssRun.buffs.roundsLeft > 0 || abyssRun.buffs.atkPct || abyssRun.buffs.reduceDmgPct)) {
                        abyssRun.buffs = {}; abyssRun.thisRoundCounterPct = 0; abyssRun.thisRoundReduceDmg = 0;
                        abyssRun.buffSources = []; abyssRun.baseBuffs = {}; // 掠夺时同步清空技能来源与基准，避免回合末重新叠回
                        abyssLog(m.name + ' 掠夺！清除了你的增益');
                    }
                    break;
                }
            }
            for (var abi = 0; abi < m.skills.length; abi++) {
                if (m.skills[abi].id === 'abyssGaze' && Math.random() < (m.skills[abi].blindChance || 0.2)) {
                    abyssRun.playerBlinded = m.skills[abi].blindRounds || 1;
                    abyssLog(m.name + ' 深渊凝视！你被致盲 ' + abyssRun.playerBlinded + ' 回合');
                    break;
                }
            }
            for (var fei = 0; fei < m.skills.length; fei++) {
                if (m.skills[fei].id === 'fear' && Math.random() < (m.skills[fei].fearChance || 0.15) && Math.random() < (m.skills[fei].skipAttackChance || 0.5)) {
                    abyssRun.skipPlayerTurn = 1;
                    abyssLog(m.name + ' 恐惧！你下回合无法行动');
                    break;
                }
            }
        }
        if (bLteZero(abyssRun.player.hp)) {
            abyssRun.deathInfo = abyssRun.deathInfo || ('被' + m.name + '【普通攻击】造成 ' + formatNumber(takenPlayer) + ' 伤害击败');
            stopAbyssAutoAttack(); abyssOnPlayerDeath(); return;
        }
    }
    if (stats.hpRegenPerRound && stats.hpRegenPerRound > 0) {
        var regenAmt = Math.min(stats.maxHp - (abyssRun.player.hp || 0), stats.hpRegenPerRound);
        if (regenAmt > 0) {
            abyssRun.player.hp = bAdd(abyssRun.player.hp || 0, regenAmt);
            abyssLog('回合回春回复 ' + formatNumber(regenAmt) + ' 生命');
            abyssPushTriggeredBuff('回春', '回复 ' + formatNumber(regenAmt) + ' 生命');
        }
    }
    // 仍保留基于 buffs.roundsLeft 的减伤/技能伤害类持续效果（如铁壁、回春类技能）
    if (abyssRun.buffs && abyssRun.buffs.roundsLeft) {
        abyssRun.buffs.roundsLeft--;
        if (abyssRun.buffs.roundsLeft <= 0) {
            delete abyssRun.buffs.reduceDmgPct;
            delete abyssRun.buffs.skillDmgBonus;
            delete abyssRun.buffs.damageIncreasePct;
            delete abyssRun.buffs.vulnerablePct;
            delete abyssRun.buffs.roundsLeft;
        }
    }
    // 本回合释放的「持续技伤」在递减后再写入 buffs（避免与本击 skillDmgBonus 双算，且本回合不扣新 buff 回合数）
    if (abyssRun._pendingSkillDmgBuffAfterTurn) {
        var pbd = abyssRun._pendingSkillDmgBuffAfterTurn;
        abyssRun._pendingSkillDmgBuffAfterTurn = null;
        abyssRun.buffs = abyssRun.buffs || {};
        abyssRun.buffs.skillDmgBonus = pbd.skillDmgBonus;
        // 若本击已写入 damageIncreasePct 等并设过 roundsLeft，不再用 pending 抬高回合数
        if (abyssRun.buffs.roundsLeft == null || abyssRun.buffs.roundsLeft <= 0) {
            abyssRun.buffs.roundsLeft = pbd.buffRounds;
        }
    }
    var bossForSummon = abyssGetAliveMonsters().filter(function(x) { return x.isBoss; })[0];
    if (bossForSummon && bossForSummon.hp > 0 && bossForSummon.skills && bossForSummon.skills.length) {
        for (var si = 0; si < bossForSummon.skills.length; si++) {
            var sk = bossForSummon.skills[si];
            var maxSummon = sk.summonCount != null ? sk.summonCount : 2;
            if (sk.id === 'bossSummon' && (bossForSummon.summonCount || 0) < maxSummon && Math.random() < (sk.chance || 0.2)) {
                var toSummon = Math.min(maxSummon - (bossForSummon.summonCount || 0), 1 + Math.floor(Math.random() * Math.min(2, maxSummon)));
                if (toSummon <= 0) break;
                for (var sumi = 0; sumi < toSummon; sumi++) {
                    var minionHp = Math.max(1, Math.floor(bossForSummon.maxHp * (sk.summonPct || 0.1)));
                    var minionAtk = Math.max(1, Math.floor(bossForSummon.atk * (sk.summonPct || 0.1)));
                    var minionDef = Math.max(0, Math.floor(bossForSummon.def * (sk.summonPct || 0.1)));
                    var minion = {
                        name: '深渊仆从·' + bossForSummon.name,
                        hp: minionHp, maxHp: minionHp, atk: minionAtk, def: minionDef,
                        critRate: bossForSummon.critRate, critDmg: bossForSummon.critDmg, dodge: bossForSummon.dodge, lifesteal: bossForSummon.lifesteal, combo: bossForSummon.combo,
                        isBoss: false, multiHit: 0.15, halfDamage: 0, skills: [],
                        element: bossForSummon.element, elementRes: bossForSummon.elementRes ? JSON.parse(JSON.stringify(bossForSummon.elementRes)) : { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 },
                        shield: 0, isSummon: true
                    };
                    abyssRun.monsters.push(minion);
                    bossForSummon.summonCount = (bossForSummon.summonCount || 0) + 1;
                }
                abyssLog('「深渊之力，听吾号令！」' + bossForSummon.name + ' 召唤 ' + toSummon + ' 只仆从！');
                break;
            }
        }
    }
    var regen = abyssMpRegenForLevel(runLevel);
    abyssRun.player.mp = Math.min(maxMp, (abyssRun.player.mp || 0) + regen);
    updateAbyssRunUI();
    } finally {
        abyssAttackReleaseLock();
    }
}

/** 统一处理单只怪物死亡（装备/技能BUFF、灼烧中毒流血、反击反伤等造成的击杀）。返回 true 表示 abyssAttack 应 return。 */
function abyssProcessMonsterDeath(m) {
    if (!m || (m.hp != null && m.hp > 0)) return false;
    var stats = abyssCalcPlayerStats();
    var usedSurvive = false;
    if (m.skills && m.skills.length && !m.surviveOneDeathUsed) {
        for (var sodi = 0; sodi < m.skills.length; sodi++) {
            if (m.skills[sodi].id === 'surviveOneDeath') { m.hp = 1; m.surviveOneDeathUsed = true; usedSurvive = true; abyssLog(m.name + ' 不溃！保留1点生命'); break; }
        }
    }
    if (usedSurvive) return false;
    if (m.hp != null && m.hp > 0) return false;
    if (m.wildAbyssDivineEncounterId && typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken()) {
        var ggApiCancel = (typeof window !== 'undefined' && typeof window.goldGameApiRequest === 'function') ? window.goldGameApiRequest : null;
        if (ggApiCancel) ggApiCancel('POST', '/api/network-abyss-divine/wild-encounter-cancel', { encounterId: m.wildAbyssDivineEncounterId }, true).catch(function() {});
        m.wildAbyssDivineEncounterId = null;
    }
    var hasRevive = false;
    if (m.skills && m.skills.length && !m.revived) {
        for (var si = 0; si < m.skills.length; si++) { if (m.skills[si].id === 'revive') { hasRevive = true; break; } }
    }
    if (hasRevive) {
        var revSkM = null; for (var rvxm = 0; rvxm < m.skills.length; rvxm++) if (m.skills[rvxm].id === 'revive') { revSkM = m.skills[rvxm]; break; }
        m.revived = true;
        m.hp = Math.floor(m.maxHp * (revSkM && revSkM.revivePct != null ? revSkM.revivePct : 0.25));
        abyssLog('BOSS发动复活！恢复' + ((revSkM && revSkM.revivePct != null ? revSkM.revivePct : 0.25) * 100).toFixed(0) + '%生命');
        return false;
    }
    if (m.skills && m.skills.length) {
        for (var dci = 0; dci < m.skills.length; dci++) {
            if (m.skills[dci].id === 'deathCurse') {
                var deathDmg = Math.floor((stats && stats.maxHp) ? stats.maxHp * (m.skills[dci].deathDmgMaxHpPct || 0.14) : 0);
                abyssRun.player.hp = bLteZero(bSub(abyssRun.player.hp || 0, deathDmg)) ? 0 : bSub(abyssRun.player.hp || 0, deathDmg);
                abyssLog(m.name + ' 怨念！对你造成 ' + formatNumber(deathDmg) + ' 伤害');
                if (bLteZero(abyssRun.player.hp)) {
                    abyssRun.deathInfo = abyssRun.deathInfo || ('被' + m.name + '【' + (m.skills[dci].name || '怨念') + '】造成 ' + formatNumber(deathDmg) + ' 伤害击败');
                    stopAbyssAutoAttack(); abyssOnPlayerDeath(); return true;
                }
                break;
            }
        }
    }
    if ((abyssRun.playerClass || 'warrior') === 'warrior' && stats && stats.maxHp > 0) {
        var healKill = Math.floor(stats.maxHp * 0.06);
        abyssRun.player.hp = cmpBigSci(bAdd(abyssRun.player.hp || 0, healKill), stats.maxHp) > 0 ? stats.maxHp : bAdd(abyssRun.player.hp || 0, healKill);
        if (healKill > 0) abyssLog('战士·斩杀回血 恢复 ' + formatNumber(healKill) + ' 生命');
    }
    if ((abyssRun.playerClass || 'warrior') === 'mage' && stats && stats.maxMp > 0) {
        var mpRestore = Math.floor(stats.maxMp * 0.2);
        var maxMpCur = abyssMaxMpForLevel(Math.floor((abyssRun.exp || 0) / 100));
        abyssRun.player.mp = Math.min(maxMpCur, (abyssRun.player.mp != null ? abyssRun.player.mp : 50) + mpRestore);
        if (mpRestore > 0) abyssLog('法师·回响 恢复 ' + formatNumber(mpRestore) + ' 魔法');
    }
    if ((abyssRun.playerClass || 'warrior') === 'archer') {
        var maxMpCurA = abyssMaxMpForLevel(Math.floor((abyssRun.exp || 0) / 100));
        var mpRestoreA = Math.floor(maxMpCurA * 0.15);
        abyssRun.player.mp = Math.min(maxMpCurA, (abyssRun.player.mp != null ? abyssRun.player.mp : 50) + mpRestoreA);
        if (mpRestoreA > 0) abyssLog('射手·追猎 恢复 ' + formatNumber(mpRestoreA) + ' 魔法');
    }
    if ((abyssRun.playerClass || 'warrior') === 'mechanic' && stats && stats.maxHp > 0) {
        // 机械师·战地回收：每击杀1只怪物，当前局内永久攻击+4、防御+3、生命+30
        abyssRun.mechanicKillStacks = (abyssRun.mechanicKillStacks || 0) + 1;
        abyssRun.tempStats = abyssRun.tempStats || {};
        abyssRun.tempStats.atk = (abyssRun.tempStats.atk || 0) + 4;
        abyssRun.tempStats.def = (abyssRun.tempStats.def || 0) + 3;
        abyssRun.tempStats.hp = (abyssRun.tempStats.hp || 0) + 30;
        abyssLog('机械师·战地回收：本局累计击杀 ' + abyssRun.mechanicKillStacks + ' 次，额外获得少量全属性加成');
    }
    var expGain = m.isBoss ? 35 : (12 + Math.floor(Math.random() * 5));
    abyssPetGainExp(Math.floor(expGain));
    if (!m.isBoss) {
        var welf = m.welfareReward || 1;
        var rewardM = m.rewardMult || 1;
        var normExp = (10 + Math.floor(Math.random() * 6)) * welf * rewardM;
        var normGold = (21 + Math.floor(Math.random() * 11)) * welf * rewardM;
        var applied = abyssApplyExpGoldBonus(normExp, normGold);
        abyssRun.exp = (abyssRun.exp || 0) + applied.exp;
        abyssRun.gold = (abyssRun.gold || 0) + applied.gold;
        abyssLog('获得经验 ' + applied.exp + '，闯关金币 ' + applied.gold);
        if (abyssCheckLevelUp()) {
            if (abyssGetAliveMonsters().length === 0) { abyssRun.monster = m; abyssOnKillMonster(); return true; }
            var deadIdx = abyssRun.monsters.indexOf(m); if (deadIdx >= 0) abyssRun.monsters.splice(deadIdx, 1);
            abyssEnsurePlayerTarget(); return true;
        }
        if (Math.random() < 0.1) { abyssRun.materials.potion = (abyssRun.materials.potion || 0) + 1; abyssLog('获得生命药剂 x1'); }
        if (Math.random() < 0.1) { abyssRun.materials.upgradeStone = (abyssRun.materials.upgradeStone || 0) + 1; abyssLog('获得升级石 x1'); }
    }
    abyssLog('击败 ' + (m ? m.name : '') + '！');
    var deadIdx = abyssRun.monsters.indexOf(m);
    if (deadIdx >= 0) abyssRun.monsters.splice(deadIdx, 1);
    abyssRun.monster = m;
    if (abyssGetAliveMonsters().length === 0) { stopAbyssAutoAttack(); abyssOnKillMonster(); return true; }
    abyssEnsurePlayerTarget();
    return true;
}

function abyssOnKillMonster() {
    var m = abyssRun.monster;
    var isBoss = (abyssRun.floor % 10 === 0);
    var f = abyssRun.floor;
    
    var waveKills = abyssRun.lastWaveMonsterCount || 1;
    abyssRun.soulKillCount = (abyssRun.soulKillCount || 0) + waveKills;
    abyssRun.soulKillsSinceLastCard = (abyssRun.soulKillsSinceLastCard || 0) + waveKills;
    if (typeof abyssRenderSoulSummary === 'function') abyssRenderSoulSummary();
    if (!isBoss && !abyssRun.pendingSoulChoice && abyssRun.soulKillsSinceLastCard >= 10) {
        abyssRun.soulKillsSinceLastCard -= 10;
        abyssOpenSoulCardChoice();
    }
    if (Math.random() < 0.2) {
        if ((abyssRun.pets || []).length < 10) {
            var newPet = abyssGenPet(m ? m.name : '未知', abyssRun.floor);
            abyssRun.pets.push(newPet);
            var typeName = (ABYSS_PET_TYPES.find(function(t){ return t.id === newPet.type; }) || {}).name || '';
            var rareTag = newPet.super ? '超级 ' : (newPet.shiny ? '闪光 ' : (newPet.variant ? '变异 ' : ''));
            abyssLog('获得宠物【' + newPet.name + '】' + rareTag + typeName + ' 资质 攻' + newPet.growth.atk + ' 防' + newPet.growth.def + ' 体' + newPet.growth.hp + ' 速' + newPet.growth.speed);
        } else {
            abyssLog('宠物已达上限(10只)，未获得新宠物');
        }
    }
    if (Math.random() < 0.2) {
        abyssRun.materials.petSkillBook = (abyssRun.materials.petSkillBook || 0) + 1;
        abyssLog('获得 宠物兽决 x1');
    }
    if (Math.random() < 0.2) {
        abyssRun.petEquipmentInventory = abyssRun.petEquipmentInventory || [];
        var peq = abyssGenPetEquipment();
        abyssRun.petEquipmentInventory.push(peq);
        var tag = peq.prefix ? peq.prefix : '';
        var attr = (peq.atkPct ? ' 攻+' + peq.atkPct + '%' : '') + (peq.defPct ? ' 防+' + peq.defPct + '%' : '') + (peq.hpPct ? ' 体+' + peq.hpPct + '%' : '');
        abyssLog('获得宠物装备 ' + tag + peq.name + attr + (peq.skill ? ' [' + peq.skill.name + ']' : ''));
    }
    // 宠物内丹掉落（10 层以上开始，概率与宠物装备相近）
    if (abyssRun.floor >= 10 && Math.random() < 0.2) {
        var nd = abyssGenPetNeidan(abyssRun.floor);
        if (nd) {
            abyssRun.petNeidanInventory = abyssRun.petNeidanInventory || [];
            abyssRun.petNeidanInventory.push(nd);
            abyssLog('获得宠物内丹 ' + nd.name + '：' + nd.desc);
        }
    }
    var stats = abyssCalcPlayerStats();
    if (stats) {
        var healAmt = Math.floor(stats.maxHp * 0.25);
        abyssRun.player.hp = Math.min(stats.maxHp, abyssRun.player.hp + healAmt);
        abyssLog('回复25%生命 +' + formatNumber(healAmt));
    }
    if (isBoss) {
        abyssBossDrops();
        abyssRun.justKilledBoss = true;
        abyssRun.monster = null;
        // 群秒/AOE 等路径可能在调用本函数前未从 monsters 中移除尸体；若不清空，abyssGetAliveMonsters() 恒为 0 而 monsters 非空，会导致 abyssAttack 开头直接 return，界面卡住无法进商店或下一层
        abyssRun.monsters = [];
        updateAbyssRunUI();
        openAbyssTempShop();
        return;
    }
    abyssRun.monsters = [];
    abyssNormalDrops();
    if (abyssRun.curseRounds > 0) abyssRun.curseRounds--;
    if (abyssRun.trialRoundsLeft > 0) abyssRun.trialRoundsLeft--;
    abyssRun.floor++;
    var clearedFloor = abyssRun.floor - 1;
    if (typeof goldGameFamilyDailyReport === 'function' && [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150].indexOf(clearedFloor) !== -1) {
        goldGameFamilyDailyReport(clearedFloor).then(function(r) {
            if (r && r.ok && !r.alreadyDone) {
                if (r.exp) abyssLog('家族任务：通过' + clearedFloor + '层，获得家族经验+1');
                if (r.artifactDropped && r.artifact) {
                    abyssLog('家族任务：获得深渊神器 ' + (r.artifact.displayName || r.artifact.name));
                    if (typeof logAction === 'function') logAction('家族任务获得深渊神器 ' + (r.artifact.displayName || r.artifact.name), 'success');
                }
                if (r.networkCoinGranted > 0) {
                    abyssLog('家族任务：获得联网币 ×' + r.networkCoinGranted);
                    if (typeof logAction === 'function') logAction('家族任务获得联网币 ×' + r.networkCoinGranted, 'success');
                }
            }
        }).catch(function() {});
    }
    abyssRun.monster = null;
    // 机械师：每通关一层后更新机械铠甲成长
    abyssUpdateMechanicGearByFloor(abyssRun.floor);
    abyssRun.pendingChoice = true;
    if (abyssRun.pendingUpgradeChoice) {
        abyssRun.afterUpgradeDoFloorClear = true;
        abyssRun.needSpawnAfterUpgrade = true;
        return;
    }
    var runLevel = Math.floor((abyssRun.exp || 0) / 100);
    if (runLevel > (abyssRun.lastUpgradeChoiceLevel || 0)) {
        abyssRun.pendingUpgradeChoice = true;
        abyssRun.pendingUpgradeLevel = (abyssRun.lastUpgradeChoiceLevel || 0) + 1;
        abyssShowUpgradeChoice();
        return;
    }
    if (abyssTrySpecialEvents(f)) return;
    if (f % 5 === 0 && Math.random() < ABYSS_ENCOUNTER_CHANCE) {
        abyssLog('奇遇·闫闫出现！');
        abyssShowEncounter();
        return;
    }
    abyssShowChoice();
}

function abyssGenEquipmentQuality(floor, minQuality) {
    var q = minQuality !== undefined ? (minQuality + Math.floor(Math.random() * (5 - minQuality))) : Math.floor(Math.random() * 5);
    if (minQuality !== undefined && q > 4) q = 4;
    var slot = ABYSS_SLOTS[Math.floor(Math.random() * ABYSS_SLOTS.length)];
    var setIdx = q >= 2 ? Math.floor(Math.random() * (ABYSS_SET_NAMES.length - 1)) + 1 : 0;
    var willHaveEquipSkill = Math.random() < 0.28;
    var baseQualityForStats = (setIdx || willHaveEquipSkill) ? 0 : q;
    var base = { hp: 0, atk: 0, def: 0, critRate: 0, critDmg: 0, dodge: 0, lifesteal: 0, combo: 0, skillDmg: 0, reduceMonsterDef: 0, str: 0, agi: 0, int: 0, sta: 0, metalAtk: 0, woodAtk: 0, waterAtk: 0, fireAtk: 0, earthAtk: 0, metalRes: 0, woodRes: 0, waterRes: 0, fireRes: 0, earthRes: 0 };
    var f = Math.max(1, floor || 1);
    var scale = Math.floor(Math.sqrt(f * 1.15) * (1 + baseQualityForStats * 0.1));
    var roll = Math.floor(Math.random() * 3) + 1;
    base.hp += Math.floor(scale * 9 * roll);
    base.atk += Math.floor(scale * 2.4 * roll);
    base.def += Math.floor(scale * 1.2 * roll);
    if (Math.random() < 0.3) base.critRate += 1 + baseQualityForStats;
    if (Math.random() < 0.3) base.critDmg += 5 + baseQualityForStats * 5;
    if (Math.random() < 0.2) base.dodge += 0.5 + baseQualityForStats * 0.5;
    if (Math.random() < 0.2) base.lifesteal += 1 + baseQualityForStats;
    if (Math.random() < 0.2) base.combo += 2 + baseQualityForStats;
    if (Math.random() < 0.15) base.skillDmg += 10 + baseQualityForStats * 10;
    if (Math.random() < 0.25) base.str += 2 + baseQualityForStats * 2;
    if (Math.random() < 0.25) base.agi += 2 + baseQualityForStats * 2;
    if (Math.random() < 0.25) base.int += 2 + baseQualityForStats * 2;
    if (Math.random() < 0.25) base.sta += 2 + baseQualityForStats * 2;
    for (var ei = 0; ei < ABYSS_ELEMENTS.length; ei++) {
        var el = ABYSS_ELEMENTS[ei];
        if (Math.random() < 0.22) base[el + 'Atk'] = (base[el + 'Atk'] || 0) + (2 + baseQualityForStats + Math.floor(Math.random() * 5));
        if (Math.random() < 0.22) base[el + 'Res'] = (base[el + 'Res'] || 0) + (1 + baseQualityForStats + Math.floor(Math.random() * 4));
    }
    var equipLevel = 2 + Math.floor((floor || 1) / 4) + Math.floor(Math.random() * 3);
    var names = ABYSS_EQUIP_NAMES[slot] || ['未知'];
    var equipName = names[Math.floor(Math.random() * names.length)];
    var equipSkill = null;
    if (willHaveEquipSkill) {
        var sk = abyssPickEquipSkillByTier();
        equipSkill = { id: sk.id, name: sk.name, effect: JSON.parse(JSON.stringify(sk.effect)) };
    }
    var displayName = ABYSS_QUALITIES[q] + '·' + equipName + (setIdx ? '(' + ABYSS_SET_NAMES[setIdx] + ')' : '') + (equipSkill ? '[' + equipSkill.name + ']' : '');
    var runeSlotsQ = abyssRollRuneSlotCount();
    var gemSlotsQ = abyssRollGemSlotCount();
    var runesArrQ = [];
    for (var rsq = 0; rsq < runeSlotsQ; rsq++) runesArrQ.push(null);
    var gemsArrQ = [];
    for (var gsq = 0; gsq < gemSlotsQ; gsq++) gemsArrQ.push(null);
    return {
        id: abyssGenId(), slot: slot, quality: q, set: ABYSS_SET_NAMES[setIdx], equipLevel: equipLevel, level: 0, enchant: null,
        stats: base, name: displayName, equipSkill: equipSkill,
        runes: runesArrQ,
        gems: gemsArrQ,
        skillSlot: null
    };
}

function abyssBossDrops() {
    var f = abyssRun.floor;
    if (Math.random() < 0.03) {
        var pool = ABYSS_VAULT_TREASURES.filter(function(t) { return f >= t.minFloor && !t.noBossDrop; });
        if (pool.length > 0) {
            var t = pool[Math.floor(Math.random() * pool.length)];
            var at = getAbyssTower();
            at.abyssVault[t.id] = (at.abyssVault[t.id] || 0) + 1;
            if (typeof goldGameCheckAbyssVault === 'function' && typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken()) {
                var vaultTotal = Object.keys(at.abyssVault || {}).reduce(function(s, id) { return s + (parseInt(at.abyssVault[id], 10) || 0); }, 0);
                goldGameCheckAbyssVault(vaultTotal);
            }
            var eff = t.effect;
            var effText = eff.type === 'atkVaultPct' ? (eff.value + '%攻击总加成') : eff.type === 'hpVaultPct' ? (eff.value + '%生命总加成') : eff.type === 'defVaultPct' ? (eff.value + '%防御总加成') : eff.type === 'critDmgVaultPct' ? (eff.value + '%爆伤总加成') : eff.type === 'atkVaultFlat' ? ('+' + eff.value + '攻击') : eff.type === 'defVaultFlat' ? ('+' + eff.value + '防御') : eff.type === 'hpVaultFlat' ? ('+' + eff.value + '生命') : eff.type === 'petAtkVaultPct' ? (eff.value + '%宠物攻击总加成') : eff.type === 'petHpVaultPct' ? (eff.value + '%宠物生命总加成') : eff.type === 'petDefVaultPct' ? (eff.value + '%宠物防御总加成') : eff.type === 'petAtkVaultFlat' ? ('+' + eff.value + '宠物攻击') : eff.type === 'petDefVaultFlat' ? ('+' + eff.value + '宠物防御') : eff.type === 'petHpVaultFlat' ? ('+' + eff.value + '宠物生命') : eff.type === 'petGrowthAll' ? ('宠物资质全部+' + eff.value) : '';
            abyssLog('深渊宝库：获得【' + t.name + '】永久' + effText + '！');
            abyssShowTreasureDropPopup(t.name, effText);
        }
    }
    var bossExp = 55 + Math.floor(Math.random() * 25);
    var appliedBoss = abyssApplyExpGoldBonus(bossExp, 220);
    abyssRun.exp = (abyssRun.exp || 0) + appliedBoss.exp;
    abyssRun.gold = (abyssRun.gold || 0) + appliedBoss.gold;
    abyssLog('获得闯关金币 ' + appliedBoss.gold + '，经验 ' + appliedBoss.exp);
    abyssCheckLevelUp();
    var eqCount = 1 + Math.floor(Math.random() * 3);
    for (var i = 0; i < eqCount; i++) {
        var eq = abyssGenEquipmentQuality(f, 3);
        abyssRun.inventory.push(eq);
        abyssLog('获得装备: ' + eq.name);
    }
    abyssRun.materials.enhanceStone += 3;
    abyssRun.materials.enchantBook += 3;
    abyssLog('获得 强化石 x3，附魔书 x3');
    var runeId = ABYSS_RUNES[Math.floor(Math.random() * ABYSS_RUNES.length)].id;
    abyssRun.runeInventory = abyssRun.runeInventory || [];
    abyssRun.runeInventory.push(runeId);
    abyssRun.runeInventory.push(ABYSS_RUNES[Math.floor(Math.random() * ABYSS_RUNES.length)].id);
    abyssLog('获得符文 x2');
    var gemId = ABYSS_GEMS[Math.floor(Math.random() * ABYSS_GEMS.length)].id;
    abyssRun.gemInventory = abyssRun.gemInventory || [];
    abyssRun.gemInventory.push(gemId);
    abyssRun.gemInventory.push(ABYSS_GEMS[Math.floor(Math.random() * ABYSS_GEMS.length)].id);
    abyssLog('获得宝石 x2');
    abyssRun.materials.runeSlotOpener = (abyssRun.materials.runeSlotOpener || 0) + 1;
    abyssRun.materials.gemSlotOpener = (abyssRun.materials.gemSlotOpener || 0) + 1;
    abyssLog('获得 符文开孔器 x1，宝石开孔器 x1');
    if (Math.random() < 0.3) {
        abyssRun.materials.skillExtractStone = (abyssRun.materials.skillExtractStone || 0) + 1;
        abyssLog('获得 技能提取石 x1');
    }
    
    if (f >= 20 && typeof getGoldGameAuthToken === 'function' && getGoldGameAuthToken()) {
        var artifactPromise = typeof goldGameTryDropNetworkArtifact === 'function' ? goldGameTryDropNetworkArtifact(f) : Promise.resolve({ ok: false, dropped: false });
        var stonePromise = typeof goldGameTryDropUpgradeStone === 'function' ? goldGameTryDropUpgradeStone(f) : Promise.resolve({ ok: false, dropped: false });
        var refineStonePromise = typeof goldGameTryDropRefineStone === 'function' ? goldGameTryDropRefineStone(f) : Promise.resolve({ ok: false, dropped: false });
        var abyssDivinePromise = (f >= 40 && typeof goldGameTryDropAbyssDivine === 'function') ? goldGameTryDropAbyssDivine(f) : Promise.resolve({ ok: true, dropped: false });
        Promise.all([artifactPromise, stonePromise, refineStonePromise, abyssDivinePromise]).then(function(results) {
            var artifactRes = results[0], stoneRes = results[1], refineStoneRes = results[2], divineRes = results[3];
            var dropLines = [];
            if (artifactRes && artifactRes.ok && artifactRes.dropped && artifactRes.artifact) {
                var aname = artifactRes.artifact.displayName || artifactRes.artifact.name || '未知';
                abyssLog('【联网】获得深渊神器: ' + aname + '（已存入账号）');
                if (typeof goldGameGetNetworkArtifacts === 'function') goldGameGetNetworkArtifacts();
                dropLines.push('深渊神器：' + aname);
            }
            if (stoneRes && stoneRes.ok && stoneRes.dropped) {
                abyssLog('【联网】获得深渊升级石 x1（已存入账号）');
                if (typeof goldGameGetUpgradeStones === 'function') goldGameGetUpgradeStones();
                dropLines.push('深渊升级石 x1');
            }
            if (refineStoneRes && refineStoneRes.ok && refineStoneRes.dropped) {
                abyssLog('【联网】获得深渊洗练石 x1（已存入账号）');
                if (typeof goldGameGetRefineStones === 'function') goldGameGetRefineStones();
                dropLines.push('深渊洗练石 x1');
            }
            if (divineRes && divineRes.ok && divineRes.dropped) {
                if (divineRes.dropType === 'abyssBeast' && divineRes.beast) {
                    abyssLog('【联网】获得深渊神兽: ' + (divineRes.beast.name || '神兽') + '（已存入账号）');
                    dropLines.push('深渊神兽：' + (divineRes.beast.name || '神兽'));
                } else if (divineRes.dropType === 'abyssPetEquip' && divineRes.item) {
                    abyssLog('【联网】获得深渊宠物装备（已存入账号）');
                    dropLines.push('深渊宠物装备');
                } else if (divineRes.dropType === 'abyssPetNeidan' && divineRes.item) {
                    abyssLog('【联网】获得深渊宠物内丹（已存入账号）');
                    dropLines.push('深渊宠物内丹');
                } else if (divineRes.dropType === 'abyssPetShoujue' && divineRes.item) {
                    abyssLog('【联网】获得深渊宠物兽决（已存入账号）');
                    dropLines.push('深渊宠物兽决');
                }
                // 仅在玩家打开深渊神兽面板时，才刷新一次联网数据，避免刷深渊时频繁联网导致卡顿
                if (window._networkAbyssDivinePanelOpen && typeof goldGameGetNetworkAbyssDivine === 'function') {
                    setTimeout(function() { goldGameGetNetworkAbyssDivine().catch(function() {}); }, 0);
                }
            }
            if (dropLines.length > 0 && typeof abyssShowNetworkDropPopup === 'function') {
                abyssShowNetworkDropPopup(dropLines);
            }
        }).catch(function() {});
    }
}

function abyssNormalDrops() {
   
    if (Math.random() < 0.35) {
        var r = Math.random();
        var dropQuality = r < 0.5 ? 0 : (r < 0.75 ? 1 : (r < 0.85 ? 2 : 3));
        var eq = abyssGenEquipment(abyssRun.floor, false, 3, dropQuality);
        abyssRun.inventory.push(eq);
        abyssLog('获得装备: ' + eq.name);
    }
    if (Math.random() < 0.15) {
        abyssRun.materials.enhanceStone++;
        abyssLog('获得 强化石 x1');
    }
    if (Math.random() < 0.08) {
        abyssRun.materials.enchantBook++;
        abyssLog('获得 附魔书 x1');
    }
    if (Math.random() < 0.12) {
        abyssRun.runeInventory = abyssRun.runeInventory || [];
        abyssRun.runeInventory.push(ABYSS_RUNES[Math.floor(Math.random() * ABYSS_RUNES.length)].id);
        abyssLog('获得 符文 x1');
    }
    if (Math.random() < 0.12) {
        abyssRun.gemInventory = abyssRun.gemInventory || [];
        abyssRun.gemInventory.push(ABYSS_GEMS[Math.floor(Math.random() * ABYSS_GEMS.length)].id);
        abyssLog('获得 宝石 x1');
    }
    if (Math.random() < 0.05) {
        abyssRun.materials.runeSlotOpener = (abyssRun.materials.runeSlotOpener || 0) + 1;
        abyssLog('获得 符文开孔器 x1');
    }
    if (Math.random() < 0.05) {
        abyssRun.materials.gemSlotOpener = (abyssRun.materials.gemSlotOpener || 0) + 1;
        abyssLog('获得 宝石开孔器 x1');
    }
}


var ABYSS_VAULT_TREASURES = [
    { id: 'vault_1', name: '裁决之刃', minFloor: 9, effect: { type: 'atkVaultPct', value: 1 } },
    { id: 'vault_2', name: '星辰之泪', minFloor: 9, effect: { type: 'hpVaultPct', value: 1 } },
    { id: 'vault_3', name: '破晓之矛', minFloor: 9, effect: { type: 'defVaultPct', value: 1 } },
    { id: 'vault_4', name: '永恒之枪', minFloor: 9, effect: { type: 'critDmgVaultPct', value: 1 } },
    { id: 'vault_5', name: '终焉之杖', minFloor: 9, effect: { type: 'atkVaultFlat', value: 10 } },
    { id: 'vault_6', name: '龙魂之牙', minFloor: 9, effect: { type: 'defVaultFlat', value: 5 } },
    { id: 'vault_7', name: '圣光权杖', minFloor: 9, effect: { type: 'hpVaultFlat', value: 50 } },
    { id: 'vault_8', name: '暗影之镰', minFloor: 19, effect: { type: 'atkVaultPct', value: 1.5 } },
    { id: 'vault_9', name: '断钢圣剑', minFloor: 19, effect: { type: 'hpVaultPct', value: 1.5 } },
    { id: 'vault_10', name: '月神之弓', minFloor: 19, effect: { type: 'defVaultPct', value: 1.5 } },
    { id: 'vault_11', name: '雷神之锤', minFloor: 19, effect: { type: 'critDmgVaultPct', value: 1.5 } },
    { id: 'vault_12', name: '霜寒之握', minFloor: 19, effect: { type: 'atkVaultFlat', value: 15 } },
    { id: 'vault_13', name: '烈焰之心', minFloor: 19, effect: { type: 'defVaultFlat', value: 10 } },
    { id: 'vault_14', name: '虚空之眼', minFloor: 19, effect: { type: 'hpVaultFlat', value: 100 } },
    { id: 'vault_15', name: '秩序法典', minFloor: 29, effect: { type: 'atkVaultPct', value: 2 } },
    { id: 'vault_16', name: '混沌之核', minFloor: 29, effect: { type: 'hpVaultPct', value: 2 } },
    { id: 'vault_17', name: '命运纺锤', minFloor: 29, effect: { type: 'defVaultPct', value: 2 } },
    { id: 'vault_18', name: '灵魂收割者', minFloor: 29, effect: { type: 'critDmgVaultPct', value: 2 } },
    { id: 'vault_19', name: '黎明使者', minFloor: 29, effect: { type: 'atkVaultFlat', value: 20 } },
    { id: 'vault_20', name: '黄昏挽歌', minFloor: 29, effect: { type: 'defVaultFlat', value: 15 } },
    { id: 'vault_21', name: '天启之书', minFloor: 29, effect: { type: 'hpVaultFlat', value: 200 } },
    { id: 'vault_22', name: '深渊低语', minFloor: 39, effect: { type: 'atkVaultPct', value: 2.5 } },
    { id: 'vault_23', name: '凤凰之羽', minFloor: 39, effect: { type: 'hpVaultPct', value: 2.5 } },
    { id: 'vault_24', name: '泰坦之拳', minFloor: 39, effect: { type: 'defVaultPct', value: 2.5 } },
    { id: 'vault_25', name: '守护者之盾', minFloor: 39, effect: { type: 'critDmgVaultPct', value: 2.5 } },
    { id: 'vault_26', name: '精灵王冠', minFloor: 39, effect: { type: 'atkVaultFlat', value: 25 } },
    { id: 'vault_27', name: '矮人王斧', minFloor: 39, effect: { type: 'defVaultFlat', value: 20 } },
    { id: 'vault_28', name: '海神三叉戟', minFloor: 39, effect: { type: 'hpVaultFlat', value: 250 } },
    { id: 'vault_29', name: '冥河摆渡', minFloor: 49, effect: { type: 'atkVaultPct', value: 3 } },
    { id: 'vault_30', name: '太阳金轮', minFloor: 49, effect: { type: 'hpVaultPct', value: 3 } },
    { id: 'vault_31', name: '月光碎片', minFloor: 49, effect: { type: 'defVaultPct', value: 3 } },
    { id: 'vault_32', name: '寂静之刃', minFloor: 49, effect: { type: 'critDmgVaultPct', value: 3 } },
    { id: 'vault_33', name: '狂怒战鼓', minFloor: 49, effect: { type: 'atkVaultFlat', value: 30 } },
    { id: 'vault_34', name: '治愈圣杯', minFloor: 49, effect: { type: 'defVaultFlat', value: 25 } },
    { id: 'vault_35', name: '诅咒匕首', minFloor: 49, effect: { type: 'hpVaultFlat', value: 300 } },
    { id: 'vault_36', name: '真理之镜', minFloor: 59, effect: { type: 'atkVaultPct', value: 3.5 } },
    { id: 'vault_37', name: '欺诈面具', minFloor: 59, effect: { type: 'hpVaultPct', value: 3.5 } },
    { id: 'vault_38', name: '破法者之眼', minFloor: 59, effect: { type: 'defVaultPct', value: 3.5 } },
    { id: 'vault_39', name: '时间沙漏', minFloor: 59, effect: { type: 'critDmgVaultPct', value: 3.5 } },
    { id: 'vault_40', name: '空间锚点', minFloor: 59, effect: { type: 'atkVaultFlat', value: 35 } },
    { id: 'vault_41', name: '先知头骨', minFloor: 59, effect: { type: 'defVaultFlat', value: 30 } },
    { id: 'vault_42', name: '圣徒之心', minFloor: 59, effect: { type: 'hpVaultFlat', value: 350 } },
    { id: 'vault_43', name: '巨龙之眼', minFloor: 69, effect: { type: 'atkVaultPct', value: 4 } },
    { id: 'vault_44', name: '天使之羽', minFloor: 69, effect: { type: 'hpVaultPct', value: 4 } },
    { id: 'vault_45', name: '恶魔角杯', minFloor: 69, effect: { type: 'defVaultPct', value: 4 } },
    { id: 'vault_46', name: '不朽者之血', minFloor: 69, effect: { type: 'critDmgVaultPct', value: 4 } },
    { id: 'vault_47', name: '贤者之石', minFloor: 69, effect: { type: 'atkVaultFlat', value: 40 } },
    { id: 'vault_48', name: '创世者指骨', minFloor: 69, effect: { type: 'defVaultFlat', value: 35 } },
    { id: 'vault_49', name: '殉道者裹尸布', minFloor: 69, effect: { type: 'hpVaultFlat', value: 400 } },
    { id: 'vault_50', name: '初代教皇冠冕', minFloor: 79, effect: { type: 'atkVaultPct', value: 4.5 } },
    { id: 'vault_51', name: '凤凰涅槃灰烬', minFloor: 79, effect: { type: 'hpVaultPct', value: 4.5 } },
    { id: 'vault_52', name: '泰坦脊骨', minFloor: 79, effect: { type: 'defVaultPct', value: 4.5 } },
    { id: 'vault_53', name: '古神触须', minFloor: 79, effect: { type: 'critDmgVaultPct', value: 4.5 } },
    { id: 'vault_54', name: '精灵祖树之种', minFloor: 79, effect: { type: 'atkVaultFlat', value: 45 } },
    { id: 'vault_55', name: '矮人先祖之锤', minFloor: 79, effect: { type: 'defVaultFlat', value: 40 } },
    { id: 'vault_56', name: '兽人战神獠牙', minFloor: 79, effect: { type: 'hpVaultFlat', value: 450 } },
    { id: 'vault_57', name: '海妖塞壬之喉', minFloor: 89, effect: { type: 'atkVaultPct', value: 5 } },
    { id: 'vault_58', name: '独角兽断角', minFloor: 89, effect: { type: 'hpVaultPct', value: 5 } },
    { id: 'vault_59', name: '狼人之心', minFloor: 89, effect: { type: 'defVaultPct', value: 5 } },
    { id: 'vault_60', name: '吸血鬼始祖之牙', minFloor: 89, effect: { type: 'critDmgVaultPct', value: 5 } },
    { id: 'vault_61', name: '石像鬼核心', minFloor: 89, effect: { type: 'atkVaultFlat', value: 50 } },
    { id: 'vault_62', name: '元素领主晶核', minFloor: 89, effect: { type: 'defVaultFlat', value: 45 } },
    { id: 'vault_63', name: '深渊魔龙逆鳞', minFloor: 89, effect: { type: 'hpVaultFlat', value: 500 } },
    { id: 'vault_64', name: '光明天使光环', minFloor: 99, effect: { type: 'atkVaultPct', value: 5.5 } },
    { id: 'vault_65', name: '堕天使之翼', minFloor: 99, effect: { type: 'hpVaultPct', value: 5.5 } },
    { id: 'vault_66', name: '冥王哈迪斯头盔', minFloor: 99, effect: { type: 'defVaultPct', value: 5.5 } },
    { id: 'vault_67', name: '宙斯雷霆碎片', minFloor: 99, effect: { type: 'critDmgVaultPct', value: 5.5 } },
    { id: 'vault_68', name: '奥丁独眼', minFloor: 99, effect: { type: 'atkVaultFlat', value: 55 } },
    { id: 'vault_69', name: '洛基的谎言', minFloor: 99, effect: { type: 'defVaultFlat', value: 50 } },
    { id: 'vault_70', name: '雅典娜的猫头鹰', minFloor: 99, effect: { type: 'hpVaultFlat', value: 550 } },
    { id: 'vault_71', name: '阿努比斯的天平', minFloor: 109, effect: { type: 'atkVaultPct', value: 6 } },
    { id: 'vault_72', name: '荷鲁斯之眼', minFloor: 109, effect: { type: 'hpVaultPct', value: 6 } },
    { id: 'vault_73', name: '湿婆的第三只眼', minFloor: 109, effect: { type: 'defVaultPct', value: 6 } },
    { id: 'vault_74', name: '佛陀舍利', minFloor: 109, effect: { type: 'critDmgVaultPct', value: 6 } },
    { id: 'vault_75', name: '传道者手稿', minFloor: 109, effect: { type: 'atkVaultFlat', value: 60 } },
    { id: 'vault_76', name: '异端审判烙印', minFloor: 109, effect: { type: 'defVaultFlat', value: 55 } },
    { id: 'vault_77', name: '圣殿骑士团圣印', minFloor: 109, effect: { type: 'hpVaultFlat', value: 600 } },
    { id: 'vault_78', name: '女巫审判火刑柱', minFloor: 119, effect: { type: 'atkVaultPct', value: 6.5 } },
    { id: 'vault_79', name: '海盗王藏宝图', minFloor: 119, effect: { type: 'hpVaultPct', value: 6.5 } },
    { id: 'vault_80', name: '失落文明石板', minFloor: 119, effect: { type: 'defVaultPct', value: 6.5 } },
    { id: 'vault_81', name: '世界树嫩枝', minFloor: 119, effect: { type: 'critDmgVaultPct', value: 6.5 } },
    { id: 'vault_82', name: '永恒之火', minFloor: 119, effect: { type: 'atkVaultFlat', value: 65 } },
    { id: 'vault_83', name: '不灭之冰', minFloor: 119, effect: { type: 'defVaultFlat', value: 60 } },
    { id: 'vault_84', name: '风暴之眼', minFloor: 119, effect: { type: 'hpVaultFlat', value: 650 } },
    { id: 'vault_85', name: '大地之心', minFloor: 129, effect: { type: 'atkVaultPct', value: 7 } },
    { id: 'vault_86', name: '生命之泉', minFloor: 129, effect: { type: 'hpVaultPct', value: 7 } },
    { id: 'vault_87', name: '死亡之息', minFloor: 129, effect: { type: 'defVaultPct', value: 7 } },
    { id: 'vault_88', name: '虚空裂隙', minFloor: 129, effect: { type: 'critDmgVaultPct', value: 7 } },
    { id: 'vault_89', name: '彩虹桥碎片', minFloor: 129, effect: { type: 'atkVaultFlat', value: 70 } },
    { id: 'vault_90', name: '极光帷幕', minFloor: 129, effect: { type: 'defVaultFlat', value: 65 } },
    { id: 'vault_91', name: '流星泪', minFloor: 129, effect: { type: 'hpVaultFlat', value: 700 } },
    { id: 'vault_92', name: '日曜石', minFloor: 139, effect: { type: 'atkVaultPct', value: 7.5 } },
    { id: 'vault_93', name: '月长石', minFloor: 139, effect: { type: 'hpVaultPct', value: 7.5 } },
    { id: 'vault_94', name: '星辰沙', minFloor: 139, effect: { type: 'defVaultPct', value: 7.5 } },
    { id: 'vault_95', name: '深渊珍珠', minFloor: 139, effect: { type: 'critDmgVaultPct', value: 7.5 } },
    { id: 'vault_96', name: '龙晶', minFloor: 139, effect: { type: 'atkVaultFlat', value: 75 } },
    { id: 'vault_97', name: '凤凰蛋', minFloor: 139, effect: { type: 'defVaultFlat', value: 70 } },
    { id: 'vault_98', name: '元素王冠', minFloor: 139, effect: { type: 'hpVaultFlat', value: 750 } },
    { id: 'vault_99', name: '潮汐宝珠', minFloor: 149, effect: { type: 'atkVaultPct', value: 8 } },
    { id: 'vault_100', name: '熔岩核心', minFloor: 149, effect: { type: 'hpVaultPct', value: 8 } },
    { id: 'vault_101', name: '雷霆之种', minFloor: 149, effect: { type: 'defVaultPct', value: 8 } },
    { id: 'vault_102', name: '暗影之种', minFloor: 149, effect: { type: 'critDmgVaultPct', value: 8 } },
    { id: 'vault_103', name: '光明圣晶', minFloor: 149, effect: { type: 'atkVaultFlat', value: 80 } },
    { id: 'vault_104', name: '混沌原石', minFloor: 149, effect: { type: 'defVaultFlat', value: 75 } },
    { id: 'vault_105', name: '秩序锁链', minFloor: 149, effect: { type: 'hpVaultFlat', value: 800 } },
    { id: 'vault_106', name: '时间之花', minFloor: 159, effect: { type: 'atkVaultPct', value: 8.5 } },
    { id: 'vault_107', name: '空间褶皱', minFloor: 159, effect: { type: 'hpVaultPct', value: 8.5 } },
    { id: 'vault_108', name: '梦境结晶', minFloor: 159, effect: { type: 'defVaultPct', value: 8.5 } },
    { id: 'vault_109', name: '记忆水晶', minFloor: 159, effect: { type: 'critDmgVaultPct', value: 8.5 } },
    { id: 'vault_110', name: '命运丝线', minFloor: 159, effect: { type: 'atkVaultFlat', value: 85 } },
    { id: 'vault_111', name: '希望之光', minFloor: 159, effect: { type: 'defVaultFlat', value: 80 } },
    { id: 'vault_112', name: '绝望之种', minFloor: 159, effect: { type: 'hpVaultFlat', value: 850 } },
    { id: 'vault_113', name: '爱之泪', minFloor: 169, effect: { type: 'atkVaultPct', value: 9 } },
    { id: 'vault_114', name: '恨之血', minFloor: 169, effect: { type: 'hpVaultPct', value: 9 } },
    { id: 'vault_115', name: '智慧果', minFloor: 169, effect: { type: 'defVaultPct', value: 9 } },
    { id: 'vault_116', name: '愚者之金', minFloor: 169, effect: { type: 'critDmgVaultPct', value: 9 } },
    { id: 'vault_117', name: '幸运四叶草', minFloor: 169, effect: { type: 'atkVaultFlat', value: 90 } },
    { id: 'vault_118', name: '厄运黑猫', minFloor: 169, effect: { type: 'defVaultFlat', value: 85 } },
    { id: 'vault_119', name: '丰饶之角', minFloor: 169, effect: { type: 'hpVaultFlat', value: 900 } },
    { id: 'vault_120', name: '饥荒之釜', minFloor: 179, effect: { type: 'atkVaultPct', value: 9.5 } },
    { id: 'vault_121', name: '创世石板', minFloor: 179, effect: { type: 'hpVaultPct', value: 9.5 } },
    { id: 'vault_122', name: '命运之书', minFloor: 179, effect: { type: 'defVaultPct', value: 9.5 } },
    { id: 'vault_123', name: '死海古卷', minFloor: 179, effect: { type: 'critDmgVaultPct', value: 9.5 } },
    { id: 'vault_124', name: '所罗门之钥', minFloor: 179, effect: { type: 'atkVaultFlat', value: 95 } },
    { id: 'vault_125', name: '亡灵黑经', minFloor: 179, effect: { type: 'defVaultFlat', value: 90 } },
    { id: 'vault_126', name: '太阳金经', minFloor: 179, effect: { type: 'hpVaultFlat', value: 950 } },
    { id: 'vault_127', name: '伏尼契手稿', minFloor: 189, effect: { type: 'atkVaultPct', value: 10 } },
    { id: 'vault_128', name: '预言之池', minFloor: 189, effect: { type: 'hpVaultPct', value: 10 } },
    { id: 'vault_129', name: '禁忌法典', minFloor: 189, effect: { type: 'defVaultPct', value: 10 } },
    { id: 'vault_130', name: '恶魔契约', minFloor: 189, effect: { type: 'critDmgVaultPct', value: 10 } },
    { id: 'vault_131', name: '天使盟约', minFloor: 189, effect: { type: 'atkVaultFlat', value: 100 } },
    { id: 'vault_132', name: '神之遗嘱', minFloor: 189, effect: { type: 'defVaultFlat', value: 95 } },
    { id: 'vault_133', name: '龙语卷轴', minFloor: 189, effect: { type: 'hpVaultFlat', value: 1000 } },
    { id: 'vault_134', name: '精灵诗篇', minFloor: 199, effect: { type: 'atkVaultPct', value: 10.5 } },
    { id: 'vault_135', name: '矮人锻造图', minFloor: 199, effect: { type: 'hpVaultPct', value: 10.5 } },
    { id: 'vault_136', name: '航海日志', minFloor: 199, effect: { type: 'defVaultPct', value: 10.5 } },
    { id: 'vault_137', name: '星象图', minFloor: 199, effect: { type: 'critDmgVaultPct', value: 10.5 } },
    { id: 'vault_138', name: '炼金术笔记', minFloor: 199, effect: { type: 'atkVaultFlat', value: 105 } },
    { id: 'vault_139', name: '巫术咒文', minFloor: 199, effect: { type: 'defVaultFlat', value: 100 } },
    { id: 'vault_140', name: '圣歌集', minFloor: 199, effect: { type: 'hpVaultFlat', value: 1050 } },
    { id: 'vault_141', name: '潘多拉魔盒', minFloor: 209, effect: { type: 'atkVaultPct', value: 11 } },
    { id: 'vault_142', name: '该隐的印记', minFloor: 209, effect: { type: 'hpVaultPct', value: 11 } },
    { id: 'vault_143', name: '犹大银币', minFloor: 209, effect: { type: 'defVaultPct', value: 11 } },
    { id: 'vault_144', name: '美杜莎之首', minFloor: 209, effect: { type: 'critDmgVaultPct', value: 11 } },
    { id: 'vault_145', name: '诅咒金币', minFloor: 209, effect: { type: 'atkVaultFlat', value: 110 } },
    { id: 'vault_146', name: '灾厄之壶', minFloor: 209, effect: { type: 'defVaultFlat', value: 105 } },
    { id: 'vault_147', name: '瘟疫之源', minFloor: 209, effect: { type: 'hpVaultFlat', value: 1100 } },
    { id: 'vault_148', name: '战争号角', minFloor: 219, effect: { type: 'atkVaultPct', value: 11.5 } },
    { id: 'vault_149', name: '饥荒之镰', minFloor: 219, effect: { type: 'hpVaultPct', value: 11.5 } },
    { id: 'vault_150', name: '死亡之钟', minFloor: 219, effect: { type: 'defVaultPct', value: 11.5 } },
    { id: 'vault_151', name: '七宗罪面具', minFloor: 219, effect: { type: 'critDmgVaultPct', value: 11.5 } },
    { id: 'vault_152', name: '深渊低语者', minFloor: 219, effect: { type: 'atkVaultFlat', value: 115 } },
    { id: 'vault_153', name: '旧神雕像', minFloor: 219, effect: { type: 'defVaultFlat', value: 110 } },
    { id: 'vault_154', name: '邪神祭坛', minFloor: 219, effect: { type: 'hpVaultFlat', value: 1150 } },
    { id: 'vault_155', name: '血祭匕首', minFloor: 229, effect: { type: 'atkVaultPct', value: 12 } },
    { id: 'vault_156', name: '缚魂瓶', minFloor: 229, effect: { type: 'hpVaultPct', value: 12 } },
    { id: 'vault_157', name: '摄魂怪之吻', minFloor: 229, effect: { type: 'defVaultPct', value: 12 } },
    { id: 'vault_158', name: '永世诅咒的戒指', minFloor: 229, effect: { type: 'critDmgVaultPct', value: 12 } },
    { id: 'vault_159', name: '背叛者之刃', minFloor: 229, effect: { type: 'atkVaultFlat', value: 120 } },
    { id: 'vault_160', name: '虚无之核', minFloor: 229, effect: { type: 'defVaultFlat', value: 115 } },
    { id: 'vault_161', name: '王权之证', minFloor: 229, effect: { type: 'hpVaultFlat', value: 1200 } },
    { id: 'vault_162', name: '神格碎片', minFloor: 239, effect: { type: 'atkVaultPct', value: 12.5 } },
    { id: 'vault_163', name: '人性之锚', minFloor: 239, effect: { type: 'hpVaultPct', value: 12.5 } },
    { id: 'vault_164', name: '自由意志', minFloor: 239, effect: { type: 'defVaultPct', value: 12.5 } },
    { id: 'vault_165', name: '因果律武器', minFloor: 239, effect: { type: 'critDmgVaultPct', value: 12.5 } },
    { id: 'vault_166', name: '存在证明', minFloor: 239, effect: { type: 'atkVaultFlat', value: 125 } },
    { id: 'vault_167', name: '虚无之证', minFloor: 239, effect: { type: 'defVaultFlat', value: 120 } },
    { id: 'vault_168', name: '真理之门', minFloor: 239, effect: { type: 'hpVaultFlat', value: 1250 } },
    { id: 'vault_169', name: '轮回之印', minFloor: 249, effect: { type: 'atkVaultPct', value: 13 } },
    { id: 'vault_170', name: '救赎之证', minFloor: 249, effect: { type: 'hpVaultPct', value: 13 } },
    { id: 'vault_171', name: '原罪之核', minFloor: 249, effect: { type: 'defVaultPct', value: 13 } },
    { id: 'vault_172', name: '美德之冠', minFloor: 249, effect: { type: 'critDmgVaultPct', value: 13 } },
    { id: 'vault_173', name: '信仰结晶', minFloor: 249, effect: { type: 'atkVaultFlat', value: 130 } },
    { id: 'vault_174', name: '希望火种', minFloor: 249, effect: { type: 'defVaultFlat', value: 125 } },
    { id: 'vault_175', name: '绝望之核', minFloor: 249, effect: { type: 'hpVaultFlat', value: 1300 } },
    { id: 'vault_176', name: '爱之契约', minFloor: 259, effect: { type: 'atkVaultPct', value: 13.5 } },
    { id: 'vault_177', name: '恨之根源', minFloor: 259, effect: { type: 'hpVaultPct', value: 13.5 } },
    { id: 'vault_178', name: '记忆宫殿', minFloor: 259, effect: { type: 'defVaultPct', value: 13.5 } },
    { id: 'vault_179', name: '梦境之钥', minFloor: 259, effect: { type: 'critDmgVaultPct', value: 13.5 } },
    { id: 'vault_m1', name: '萌芽兽', minFloor: 9, effect: { type: 'petAtkVaultPct', value: 1 } },
    { id: 'vault_m2', name: '脉冲兽', minFloor: 9, effect: { type: 'petHpVaultPct', value: 1 } },
    { id: 'vault_m3', name: '铠石兽', minFloor: 9, effect: { type: 'petDefVaultPct', value: 1 } },
    { id: 'vault_m4', name: '灵狐兽', minFloor: 9, effect: { type: 'petAtkVaultFlat', value: 10 } },
    { id: 'vault_m5', name: '电光兽', minFloor: 9, effect: { type: 'petDefVaultFlat', value: 5 } },
    { id: 'vault_m6', name: '叶隐兽', minFloor: 9, effect: { type: 'petHpVaultFlat', value: 50 } },
    { id: 'vault_m7', name: '盾甲兽', minFloor: 19, effect: { type: 'petAtkVaultPct', value: 1.5 } },
    { id: 'vault_m8', name: '音波兽', minFloor: 19, effect: { type: 'petHpVaultPct', value: 1.5 } },
    { id: 'vault_m9', name: '浮游兽', minFloor: 19, effect: { type: 'petDefVaultPct', value: 1.5 } },
    { id: 'vault_m10', name: '利爪兽', minFloor: 19, effect: { type: 'petAtkVaultFlat', value: 15 } },
    { id: 'vault_m11', name: '灼眼兽', minFloor: 19, effect: { type: 'petDefVaultFlat', value: 10 } },
    { id: 'vault_m12', name: '寒羽兽', minFloor: 19, effect: { type: 'petHpVaultFlat', value: 100 } },
    { id: 'vault_m13', name: '钢尾兽', minFloor: 29, effect: { type: 'petAtkVaultPct', value: 2 } },
    { id: 'vault_m14', name: '幻影兽', minFloor: 29, effect: { type: 'petHpVaultPct', value: 2 } },
    { id: 'vault_m15', name: '齿轮兽', minFloor: 29, effect: { type: 'petDefVaultPct', value: 2 } },
    { id: 'vault_m16', name: '藤蔓兽', minFloor: 29, effect: { type: 'petAtkVaultFlat', value: 20 } },
    { id: 'vault_m17', name: '爆裂兽', minFloor: 29, effect: { type: 'petDefVaultFlat', value: 15 } },
    { id: 'vault_m18', name: '深潜兽', minFloor: 29, effect: { type: 'petHpVaultFlat', value: 200 } },
    { id: 'vault_m19', name: '夜行兽', minFloor: 39, effect: { type: 'petAtkVaultPct', value: 2.5 } },
    { id: 'vault_m20', name: '晶体兽', minFloor: 39, effect: { type: 'petHpVaultPct', value: 2.5 } },
    { id: 'vault_m21', name: '旋风兽', minFloor: 39, effect: { type: 'petDefVaultPct', value: 2.5 } },
    { id: 'vault_m22', name: '熔核兽', minFloor: 39, effect: { type: 'petAtkVaultFlat', value: 25 } },
    { id: 'vault_m23', name: '磁力兽', minFloor: 39, effect: { type: 'petDefVaultFlat', value: 20 } },
    { id: 'vault_m24', name: '雾影兽', minFloor: 39, effect: { type: 'petHpVaultFlat', value: 250 } },
    { id: 'vault_m25', name: '铁喙兽', minFloor: 49, effect: { type: 'petAtkVaultPct', value: 3 } },
    { id: 'vault_m26', name: '念力兽', minFloor: 49, effect: { type: 'petHpVaultPct', value: 3 } },
    { id: 'vault_m27', name: '迅雷兽', minFloor: 49, effect: { type: 'petDefVaultPct', value: 3 } },
    { id: 'vault_m28', name: '珊瑚兽', minFloor: 49, effect: { type: 'petAtkVaultFlat', value: 30 } },
    { id: 'vault_m29', name: '孢子兽', minFloor: 49, effect: { type: 'petDefVaultFlat', value: 25 } },
    { id: 'vault_m30', name: '光刃兽', minFloor: 49, effect: { type: 'petHpVaultFlat', value: 300 } },
    { id: 'vault_m31', name: '圣剑骑士兽', minFloor: 59, effect: { type: 'petAtkVaultPct', value: 3.5 } },
    { id: 'vault_m32', name: '暗影巫师兽', minFloor: 59, effect: { type: 'petHpVaultPct', value: 3.5 } },
    { id: 'vault_m33', name: '天翔羽蛇兽', minFloor: 59, effect: { type: 'petDefVaultPct', value: 3.5 } },
    { id: 'vault_m34', name: '雷霆狮鹫兽', minFloor: 59, effect: { type: 'petAtkVaultFlat', value: 35 } },
    { id: 'vault_m35', name: '寒霜剑齿兽', minFloor: 59, effect: { type: 'petDefVaultFlat', value: 30 } },
    { id: 'vault_m36', name: '炽焰武神兽', minFloor: 59, effect: { type: 'petHpVaultFlat', value: 350 } },
    { id: 'vault_m37', name: '岩铁巨像兽', minFloor: 69, effect: { type: 'petAtkVaultPct', value: 4 } },
    { id: 'vault_m38', name: '深渊海龙兽', minFloor: 69, effect: { type: 'petHpVaultPct', value: 4 } },
    { id: 'vault_m39', name: '幻光蝶兽', minFloor: 69, effect: { type: 'petDefVaultPct', value: 4 } },
    { id: 'vault_m40', name: '脉冲星兽', minFloor: 69, effect: { type: 'petAtkVaultFlat', value: 40 } },
    { id: 'vault_m41', name: '荆棘女王兽', minFloor: 69, effect: { type: 'petDefVaultFlat', value: 35 } },
    { id: 'vault_m42', name: '合金猛犸兽', minFloor: 69, effect: { type: 'petHpVaultFlat', value: 400 } },
    { id: 'vault_m43', name: '虚空猎手兽', minFloor: 79, effect: { type: 'petAtkVaultPct', value: 4.5 } },
    { id: 'vault_m44', name: '圣光独角兽', minFloor: 79, effect: { type: 'petHpVaultPct', value: 4.5 } },
    { id: 'vault_m45', name: '剧毒狼蛛兽', minFloor: 79, effect: { type: 'petDefVaultPct', value: 4.5 } },
    { id: 'vault_m46', name: '风暴鹰身兽', minFloor: 79, effect: { type: 'petAtkVaultFlat', value: 45 } },
    { id: 'vault_m47', name: '冥府判官兽', minFloor: 79, effect: { type: 'petDefVaultFlat', value: 40 } },
    { id: 'vault_m48', name: '数据守卫兽', minFloor: 79, effect: { type: 'petHpVaultFlat', value: 450 } },
    { id: 'vault_m49', name: '破城犀甲兽', minFloor: 89, effect: { type: 'petAtkVaultPct', value: 5 } },
    { id: 'vault_m50', name: '潮汐领主兽', minFloor: 89, effect: { type: 'petHpVaultPct', value: 5 } },
    { id: 'vault_m51', name: '电磁公爵兽', minFloor: 89, effect: { type: 'petDefVaultPct', value: 5 } },
    { id: 'vault_m52', name: '森之贤者兽', minFloor: 89, effect: { type: 'petAtkVaultFlat', value: 50 } },
    { id: 'vault_m53', name: '爆岩金刚兽', minFloor: 89, effect: { type: 'petDefVaultFlat', value: 45 } },
    { id: 'vault_m54', name: '影舞忍者兽', minFloor: 89, effect: { type: 'petHpVaultFlat', value: 500 } },
    { id: 'vault_m55', name: '光棱圣堂兽', minFloor: 99, effect: { type: 'petAtkVaultPct', value: 5.5 } },
    { id: 'vault_m56', name: '蚀刻魔像兽', minFloor: 99, effect: { type: 'petHpVaultPct', value: 5.5 } },
    { id: 'vault_m57', name: '啸天战狼兽', minFloor: 99, effect: { type: 'petDefVaultPct', value: 5.5 } },
    { id: 'vault_m58', name: '等离子凤凰兽', minFloor: 99, effect: { type: 'petAtkVaultFlat', value: 55 } },
    { id: 'vault_m59', name: '陨铁霸王龙兽', minFloor: 99, effect: { type: 'petDefVaultFlat', value: 50 } },
    { id: 'vault_m60', name: '梦境编织兽', minFloor: 99, effect: { type: 'petHpVaultFlat', value: 550 } },
    { id: 'vault_m61', name: '要塞龟兽', minFloor: 109, effect: { type: 'petAtkVaultPct', value: 6 } },
    { id: 'vault_m62', name: '逐日天马兽', minFloor: 109, effect: { type: 'petHpVaultPct', value: 6 } },
    { id: 'vault_m63', name: '裂地鳌钳兽', minFloor: 109, effect: { type: 'petDefVaultPct', value: 6 } },
    { id: 'vault_m64', name: '诡术幻影兽', minFloor: 109, effect: { type: 'petAtkVaultFlat', value: 60 } },
    { id: 'vault_m65', name: '治愈灵鹿兽', minFloor: 109, effect: { type: 'petDefVaultFlat', value: 55 } },
    { id: 'vault_m66', name: '水晶蝎王兽', minFloor: 109, effect: { type: 'petHpVaultFlat', value: 600 } },
    { id: 'vault_m67', name: '咒文祭祀兽', minFloor: 119, effect: { type: 'petAtkVaultPct', value: 6.5 } },
    { id: 'vault_m68', name: '裁决天使兽', minFloor: 119, effect: { type: 'petHpVaultPct', value: 6.5 } },
    { id: 'vault_m69', name: '湮灭魔龙兽', minFloor: 119, effect: { type: 'petDefVaultPct', value: 6.5 } },
    { id: 'vault_m70', name: '永恒圣枪兽', minFloor: 119, effect: { type: 'petAtkVaultFlat', value: 65 } },
    { id: 'vault_m71', name: '混沌领主兽', minFloor: 119, effect: { type: 'petDefVaultFlat', value: 60 } },
    { id: 'vault_m72', name: '银河骑士兽', minFloor: 119, effect: { type: 'petHpVaultFlat', value: 650 } },
    { id: 'vault_m73', name: '深渊吞噬兽', minFloor: 129, effect: { type: 'petAtkVaultPct', value: 7 } },
    { id: 'vault_m74', name: '神罚雷霆兽', minFloor: 129, effect: { type: 'petHpVaultPct', value: 7 } },
    { id: 'vault_m75', name: '不朽战神兽', minFloor: 129, effect: { type: 'petDefVaultPct', value: 7 } },
    { id: 'vault_m76', name: '虚空观测者兽', minFloor: 129, effect: { type: 'petAtkVaultFlat', value: 70 } },
    { id: 'vault_m77', name: '元素统御者兽', minFloor: 129, effect: { type: 'petDefVaultFlat', value: 65 } },
    { id: 'vault_m78', name: '太阳神翼神龙兽', minFloor: 129, effect: { type: 'petHpVaultFlat', value: 700 } },
    { id: 'vault_m79', name: '月神阿尔忒弥斯兽', minFloor: 139, effect: { type: 'petAtkVaultPct', value: 7.5 } },
    { id: 'vault_m80', name: '冥王哈迪斯兽', minFloor: 139, effect: { type: 'petHpVaultPct', value: 7.5 } },
    { id: 'vault_m81', name: '海皇波塞冬兽', minFloor: 139, effect: { type: 'petDefVaultPct', value: 7.5 } },
    { id: 'vault_m82', name: '智慧雅典娜兽', minFloor: 139, effect: { type: 'petAtkVaultFlat', value: 75 } },
    { id: 'vault_m83', name: '战神阿瑞斯兽', minFloor: 139, effect: { type: 'petDefVaultFlat', value: 70 } },
    { id: 'vault_m84', name: '泰坦巨神兽', minFloor: 139, effect: { type: 'petHpVaultFlat', value: 750 } },
    { id: 'vault_m85', name: '世界树守护兽', minFloor: 149, effect: { type: 'petAtkVaultPct', value: 8 } },
    { id: 'vault_m86', name: '方舟诺亚兽', minFloor: 149, effect: { type: 'petHpVaultPct', value: 8 } },
    { id: 'vault_m87', name: '魔神巴尔兽', minFloor: 149, effect: { type: 'petDefVaultPct', value: 8 } },
    { id: 'vault_m88', name: '圣凰涅槃兽', minFloor: 149, effect: { type: 'petAtkVaultFlat', value: 80 } },
    { id: 'vault_m89', name: '暗黑邪神兽', minFloor: 149, effect: { type: 'petDefVaultFlat', value: 75 } },
    { id: 'vault_m90', name: '机械降神兽', minFloor: 149, effect: { type: 'petHpVaultFlat', value: 800 } },
    { id: 'vault_m91', name: '基因原体兽', minFloor: 159, effect: { type: 'atkVaultPct', value: 8.5 } },
    { id: 'vault_m92', name: '时空巡警兽', minFloor: 159, effect: { type: 'hpVaultPct', value: 8.5 } },
    { id: 'vault_m93', name: '因果律兵器兽', minFloor: 159, effect: { type: 'defVaultPct', value: 8.5 } },
    { id: 'vault_m94', name: '宇宙大帝兽', minFloor: 159, effect: { type: 'atkVaultFlat', value: 85 } },
    { id: 'vault_m95', name: '数据删除者兽', minFloor: 159, effect: { type: 'defVaultFlat', value: 80 } },
    { id: 'vault_m96', name: '网络防火墙兽', minFloor: 159, effect: { type: 'hpVaultFlat', value: 850 } },
    { id: 'vault_m97', name: '量子幽灵兽', minFloor: 169, effect: { type: 'atkVaultPct', value: 9 } },
    { id: 'vault_m98', name: '模因感染源兽', minFloor: 169, effect: { type: 'petHpVaultPct', value: 9 } },
    { id: 'vault_m99', name: '集体潜意识兽', minFloor: 169, effect: { type: 'petDefVaultPct', value: 9 } },
    { id: 'vault_m100', name: '文明观测者兽', minFloor: 169, effect: { type: 'petAtkVaultFlat', value: 90 } },
    { id: 'vault_m101', name: '生态化身盖亚兽', minFloor: 169, effect: { type: 'petDefVaultFlat', value: 85 } },
    { id: 'vault_m102', name: '熵增终结者兽', minFloor: 169, effect: { type: 'petHpVaultFlat', value: 900 } },
    { id: 'vault_m103', name: '维度旅行者兽', minFloor: 179, effect: { type: 'petAtkVaultPct', value: 9.5 } },
    { id: 'vault_m104', name: '符文君王兽', minFloor: 179, effect: { type: 'petHpVaultPct', value: 9.5 } },
    { id: 'vault_m105', name: '咒缚之王兽', minFloor: 179, effect: { type: 'petDefVaultPct', value: 9.5 } },
    { id: 'vault_m106', name: '英灵殿战神兽', minFloor: 179, effect: { type: 'petAtkVaultFlat', value: 95 } },
    { id: 'vault_m107', name: '至高天神兽', minFloor: 179, effect: { type: 'petDefVaultFlat', value: 90 } },
    { id: 'vault_m108', name: '终焉灭世魔兽', minFloor: 179, effect: { type: 'petHpVaultFlat', value: 950 } },
    { id: 'vault_m109', name: '归零虚无兽', minFloor: 189, effect: { type: 'petAtkVaultPct', value: 10 } },
    { id: 'vault_m110', name: '起源圣皇兽', minFloor: 189, effect: { type: 'petHpVaultPct', value: 10 } },
    { id: 'vault_m111', name: '永恒轮回兽', minFloor: 189, effect: { type: 'petDefVaultPct', value: 10 } },
    { id: 'vault_m112', name: '超脱次元兽', minFloor: 189, effect: { type: 'petAtkVaultFlat', value: 100 } },
    { id: 'vault_m113', name: '万象记录者兽', minFloor: 189, effect: { type: 'petDefVaultFlat', value: 95 } },
    { id: 'vault_m114', name: '可能性收束者兽', minFloor: 189, effect: { type: 'petHpVaultFlat', value: 1000 } },
    { id: 'vault_m115', name: '龙帝艾可萨兽', minFloor: 199, effect: { type: 'petAtkVaultPct', value: 10.5 } },
    { id: 'vault_m116', name: '奥米加兽·慈悲形态', minFloor: 199, effect: { type: 'petHpVaultPct', value: 10.5 } },
    { id: 'vault_m117', name: '阿尔法兽·起源裁决', minFloor: 199, effect: { type: 'petDefVaultPct', value: 10.5 } },
    { id: 'vault_m118', name: '红莲骑士兽·真红莲', minFloor: 199, effect: { type: 'petAtkVaultFlat', value: 105 } },
    { id: 'vault_m119', name: '公爵兽·深红形态', minFloor: 199, effect: { type: 'petDefVaultFlat', value: 100 } },
    { id: 'vault_m120', name: '金甲龙兽·光辉壁垒', minFloor: 199, effect: { type: 'petHpVaultFlat', value: 1050 } },
    { id: 'vault_m121', name: '八足马兽·神速', minFloor: 209, effect: { type: 'petAtkVaultPct', value: 11 } },
    { id: 'vault_m122', name: '剑皇兽·决意', minFloor: 209, effect: { type: 'petHpVaultPct', value: 11 } },
    { id: 'vault_m123', name: '杜纳斯兽·天龙', minFloor: 209, effect: { type: 'petDefVaultPct', value: 11 } },
    { id: 'vault_m124', name: '蔷薇兽·绽放', minFloor: 209, effect: { type: 'petAtkVaultFlat', value: 110 } },
    { id: 'vault_m125', name: '芳香兽·静谧', minFloor: 209, effect: { type: 'petDefVaultFlat', value: 105 } },
    { id: 'vault_m126', name: '领主骑士兽·王权', minFloor: 209, effect: { type: 'petHpVaultFlat', value: 1100 } },
    { id: 'vault_m127', name: '颅骨兽·铁壁', minFloor: 219, effect: { type: 'petAtkVaultPct', value: 11.5 } },
    { id: 'vault_m128', name: '斯雷普兽·驰骋', minFloor: 219, effect: { type: 'petHpVaultPct', value: 11.5 } },
    { id: 'vault_m129', name: '艾可萨兽·龙魂', minFloor: 219, effect: { type: 'petDefVaultPct', value: 11.5 } },
    { id: 'vault_m130', name: '顽固兽·锻冶', minFloor: 219, effect: { type: 'petAtkVaultFlat', value: 115 } },
    { id: 'vault_m131', name: '优雅新星兽', minFloor: 219, effect: { type: 'petDefVaultFlat', value: 110 } },
    { id: 'vault_m132', name: '闪光暴龙兽·爆裂', minFloor: 219, effect: { type: 'petHpVaultFlat', value: 1150 } },
    { id: 'vault_m133', name: '幻影加奥加兽', minFloor: 229, effect: { type: 'petAtkVaultPct', value: 12 } },
    { id: 'vault_m134', name: '渡鸦兽·暮光', minFloor: 229, effect: { type: 'petHpVaultPct', value: 12 } },
    { id: 'vault_m135', name: '咲耶兽·巫女', minFloor: 229, effect: { type: 'petDefVaultPct', value: 12 } },
    { id: 'vault_m136', name: '海天使兽·圣歌', minFloor: 229, effect: { type: 'petAtkVaultFlat', value: 120 } },
    { id: 'vault_m137', name: '神圣天女兽·圣弓', minFloor: 229, effect: { type: 'petDefVaultFlat', value: 115 } },
    { id: 'vault_m138', name: '神圣天使兽·神启', minFloor: 229, effect: { type: 'petHpVaultFlat', value: 1200 } },
    { id: 'vault_m139', name: '丧尸撒旦兽·绝望', minFloor: 239, effect: { type: 'petAtkVaultPct', value: 12.5 } },
    { id: 'vault_m140', name: '黑暗战斗暴龙兽', minFloor: 239, effect: { type: 'petHpVaultPct', value: 12.5 } },
    { id: 'vault_m141', name: '法老王兽·魂石', minFloor: 239, effect: { type: 'petDefVaultPct', value: 12.5 } },
    { id: 'vault_m142', name: '贝尔斯塔兽·慈悲', minFloor: 239, effect: { type: 'petAtkVaultFlat', value: 125 } },
    { id: 'vault_m143', name: '弩炮兽·要塞', minFloor: 239, effect: { type: 'petDefVaultFlat', value: 120 } },
    { id: 'vault_m144', name: '高吼兽·交响', minFloor: 239, effect: { type: 'petHpVaultFlat', value: 1250 } },
    { id: 'vault_m145', name: '杰斯兽·青锋', minFloor: 249, effect: { type: 'petAtkVaultPct', value: 13 } },
    { id: 'vault_m146', name: '超弦编织者兽', minFloor: 249, effect: { type: 'petHpVaultPct', value: 13 } },
    { id: 'vault_m147', name: '逻辑天道兽', minFloor: 249, effect: { type: 'petDefVaultPct', value: 13 } },
    { id: 'vault_m148', name: '叙事层观测者兽', minFloor: 249, effect: { type: 'petAtkVaultFlat', value: 130 } },
    { id: 'vault_m149', name: '大寂静化身兽', minFloor: 249, effect: { type: 'petDefVaultFlat', value: 125 } },
    { id: 'vault_m150', name: '第一因追溯者兽', minFloor: 249, effect: { type: 'petHpVaultFlat', value: 1300 } },
    { id: 'vault_m151', name: '可能性之海鲸兽', minFloor: 259, effect: { type: 'petAtkVaultPct', value: 13.5 } },
    { id: 'vault_m152', name: '文明墓碑兽', minFloor: 259, effect: { type: 'petHpVaultPct', value: 13.5 } },
    { id: 'vault_m153', name: '万物归一者兽', minFloor: 259, effect: { type: 'petDefVaultPct', value: 13.5 } },
    { id: 'vault_sea_turtle', name: '大海龟', minFloor: 21, noBossDrop: true, effect: { type: 'petGrowthAll', value: 10 } }
];

// 升级奖励池（3选1）：百分比加成，选后累加到 abyssRun.buffs
var ABYSS_UPGRADE_POOL = [
    { key: 'atkPct', name: '攻击加成', value: 5, unit: '%' },
    { key: 'hpPct', name: '生命加成', value: 10, unit: '%' },
    { key: 'defPct', name: '防御加成', value: 5, unit: '%' },
    { key: 'lifestealPct', name: '吸血加成', value: 2, unit: '%' },
    { key: 'critRatePct', name: '暴击率加成', value: 2, unit: '%' },
    { key: 'dodgePct', name: '闪避加成', value: 2, unit: '%' },
    { key: 'critDmgPct', name: '爆伤加成', value: 5, unit: '%' },
    { key: 'petAtkPct', name: '宠物攻击加成', value: 10, unit: '%' },
    { key: 'petDefPct', name: '宠物防御加成', value: 10, unit: '%' },
    { key: 'petHpPct', name: '宠物生命加成', value: 16, unit: '%' },
    { key: 'goldPct', name: '金币加成', value: 3, unit: '%' },
    { key: 'expPct', name: '经验加成', value: 3, unit: '%' }
];

var ABYSS_CHOICE_POOL = [
    { key: 'hp', name: '生命', value: 80, valueScale: 5 },
    { key: 'atk', name: '攻击', value: 15, valueScale: 1 },
    { key: 'def', name: '防御', value: 8, valueScale: 0.5 },
    { key: 'lifesteal', name: '吸血', value: 0.5, valueScale: 0 },
    { key: 'dodge', name: '闪避', value: 0.5, valueScale: 0 },
    { key: 'critRate', name: '暴击率', value: 1, valueScale: 0 },
    { key: 'critDmg', name: '爆伤', value: 5, valueScale: 0 },
    { key: 'skillDmg', name: '技能伤害加成', value: 2, valueScale: 0 },
    { key: 'reduceMonsterDef', name: '减少怪物防御', value: 2, valueScale: 0 },
    { key: 'level', name: '增加25经验', value: 25, valueScale: 0 }
];


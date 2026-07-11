// 年兽副本
// 初始化年兽副本系统
function initNianBeastSystem() {
    if (!player.nianBeast) {
        player.nianBeast = {
            dungeonToken: 0, // 副本令牌
            highestLevel: 0, // 最高通关层数
            totalKills: 0, // 总击杀次数
            rewardsCollected: 0 // 总奖励数量
        };
    }
}
const artifactCritConfig = {
    // 法宝加成区间对应的触发几率和倍率
    thresholds: [
        { maxBonus: 1.1, chance: 0.05, multiplier: 1, message: '💫 法宝共鸣！造成1倍额外伤害' },
        { maxBonus: 1.3, chance: 0.05, multiplier: 2, message: '⚡ 法宝觉醒！造成2倍暴伤' },
        { maxBonus: 1.4, chance: 0.05, multiplier: 3, message: '✨ 法宝通灵！造成3倍毁灭打击' },
        { maxBonus: 1.5, chance: 0.05, multiplier: 4, message: '🌟 法宝化形！造成4倍天道之力' },
        { maxBonus: 1.6, chance: 0.05, multiplier: 5, message: '🌪️ 法宝混沌！造成5倍洪荒之力' },
        { maxBonus: 1.8, chance: 0.10, multiplier: 6, message: '🔥 法宝焚天！造成6倍寂灭之威' },
        { maxBonus: 2.0, chance: 0.10, multiplier: 7, message: '❄️ 法宝冰封！造成7倍时空冻结' },
        { maxBonus: 2.5, chance: 0.10, multiplier: 8, message: '⚡ 法宝雷动！造成8倍天劫之力' },
        { maxBonus: 3.0, chance: 0.10, multiplier: 9, message: '🌌 法宝虚空！造成9倍混沌之怒' },
        { maxBonus: 3.5, chance: 0.15, multiplier: 10, message: '👑 法宝帝王！造成10倍君临天下' },
        { maxBonus: 4.0, chance: 0.15, multiplier: 15, message: '🐉 法宝神龙！造成15倍龙威震天' },
        { maxBonus: 4.5, chance: 0.15, multiplier: 20, message: '🌍 法宝创世！造成20倍开天辟地' },
        { maxBonus: 5.0, chance: 0.15, multiplier: 25, message: '☯️ 法宝大道！造成25倍道法自然' },
        { maxBonus: Infinity, chance: 0.20, multiplier: 30, message: '∞ 法宝永恒！造成30倍无尽轮回' }
    ],
    
    // 霸气语录（根据不同倍数触发不同台词）
    quotes: {
        1: [
            '「区区年兽，也敢放肆！」',
            '「看我的法宝神威！」',
            '「这一击，只是开胃菜！」',
            '「法宝初显，年兽受死！」'
        ],
        2: [
            '「二倍之力，破你防御！」',
            '「法宝觉醒，年兽颤栗！」',
            '「这一击，让你知道厉害！」',
            '「年兽，尝尝法宝的厉害！」'
        ],
        3: [
            '「三界震动，法宝显圣！」',
            '「年兽，还不伏诛！」',
            '「法宝通灵，诛杀邪祟！」',
            '「这一击，送你归西！」'
        ],
        4: [
            '「四海之内，法宝为尊！」',
            '「年兽，你的死期到了！」',
            '「四倍暴击，荡平年兽！」',
            '「法宝化形，毁天灭地！」'
        ],
        5: [
            '「五雷轰顶，法宝天威！」',
            '「年兽，还不束手就擒！」',
            '「五倍之力，横扫千军！」',
            '「法宝混沌，破碎虚空！」'
        ],
        6: [
            '「六道轮回，法宝超度！」',
            '「年兽，让你魂飞魄散！」',
            '「六倍暴击，诛杀年兽！」',
            '「法宝焚天，烧尽邪魔！」'
        ],
        7: [
            '「七星伴月，法宝无敌！」',
            '「年兽，这一击送你上路！」',
            '「七倍之力，天地变色！」',
            '「法宝冰封，冻结时空！」'
        ],
        8: [
            '「八方来朝，法宝称尊！」',
            '「年兽，受死吧！」',
            '「八倍暴击，毁天灭地！」',
            '「法宝雷动，天劫降临！」'
        ],
        9: [
            '「九霄云外，法宝纵横！」',
            '「年兽，让你永世不得超生！」',
            '「九倍之力，破碎虚空！」',
            '「法宝虚空，吞噬一切！」'
        ],
        10: [
            '「十方俱灭，法宝无敌！」',
            '「年兽，见识真正的力量！」',
            '「十倍暴击，君临天下！」',
            '「法宝帝王，统御万界！」'
        ],
        15: [
            '「十五倍龙威，年兽颤栗！」',
            '「神龙降世，诛杀年兽！」',
            '「法宝神龙，毁天灭地！」',
            '「龙威震天，年兽伏诛！」'
        ],
        20: [
            '「二十倍创世，开天辟地！」',
            '「法宝创世，重演混沌！」',
            '「创世之力，年兽化为虚无！」',
            '「开天辟地，年兽湮灭！」'
        ],
        25: [
            '「二十五倍大道，道法自然！」',
            '「大道至简，一击必杀！」',
            '「法宝大道，年兽超度！」',
            '「道法自然，年兽归西！」'
        ],
        30: [
            '「三十倍永恒，无尽轮回！」',
            '「永恒法宝，超越时空！」',
            '「无尽轮回，年兽永世不得超生！」',
            '「法宝永恒，与天地同寿！」'
        ]
    },
// 特殊触发台词（极低概率触发）
    specialQuotes: [
        { chance: 0.001, quote: '👑 「吾之法宝，可破苍穹！」' },
        { chance: 0.001, quote: '🌌 「这一击，蕴含宇宙真理！」' },
        { chance: 0.001, quote: '⚡ 「天大地大，法宝最大！」' },
        { chance: 0.001, quote: '🔥 「年兽，不过如此！」' },
        { chance: 0.001, quote: '❄️ 「法宝一出，谁与争锋！」' },
        { chance: 0.001, quote: '💫 「让你见识真正的法宝之力！」' }
    ]
};
function getEquippedArtifactBonus() {
    if (!player.magicTools || !player.magicTools.equipped) {
        return 1.0; // 没有装备法宝，基础加成1.0
    }
    
    const tool = magicToolConfig.tools.find(t => t.id === player.magicTools.equipped);
    return tool ? tool.bonus : 1.0;
}
function triggerArtifactCrit() {
    const artifactBonus = getEquippedArtifactBonus();
    
    // 找到对应的加成区间
    let config = artifactCritConfig.thresholds.find(t => artifactBonus <= t.maxBonus);
    if (!config) {
        config = artifactCritConfig.thresholds[artifactCritConfig.thresholds.length - 1];
    }
    
    // 5%几率触发
    if (Math.random() < config.chance) {
        // 随机选择霸气语录
        let quotes = artifactCritConfig.quotes[config.multiplier] || artifactCritConfig.quotes[1];
        let quote = quotes[Math.floor(Math.random() * quotes.length)];
        
        // 极低概率触发特殊台词
        for (let special of artifactCritConfig.specialQuotes) {
            if (Math.random() < special.chance) {
                quote = special.quote;
                break;
            }
        }
        
        return {
            triggered: true,
            multiplier: config.multiplier,
            quote: quote,
            message: config.message
        };
    }
    
    return { triggered: false };
}
function updateArtifactCritPreview() {
    const artifactBonus = getEquippedArtifactBonus();
    const config = artifactCritConfig.thresholds.find(t => artifactBonus <= t.maxBonus) || artifactCritConfig.thresholds[0];
    
    const previewSpan = document.getElementById('currentArtifactBonus');
    const multiplierSpan = document.getElementById('currentArtifactMultiplier');
    const previewDiv = document.getElementById('artifactCritPreview');
    
    if (previewSpan) previewSpan.innerHTML = artifactBonus.toFixed(2);
    if (multiplierSpan) multiplierSpan.innerHTML = config.multiplier;
    
    if (previewDiv) {
        previewDiv.innerHTML = `当前法宝加成: ${artifactBonus.toFixed(2)}倍 → 触发 ${config.multiplier}倍暴伤 `;
    }
}

// 打开年兽副本
function openNianBeastDungeon() {
   if (player.cultivation.stage < 20) {
        alert("需要达到修仙20级才能开启新年年兽副本！");
        return;
    }

    initNianBeastSystem();
    toggleAutoBuyShopb();
    // 计算玩家属性
    updateNianPlayerStats();
    
    // 重置BOSS状态
    resetNianBeastBattle();
    
    // 显示UI
    document.getElementById('nianBeastOverlay').style.display = 'block';
    document.getElementById('nianBeastUI').style.display = 'block';
    
    // 禁用攻击、防御、逃跑按钮，直到消耗令牌
    document.getElementById('nianAttackBtn').disabled = true;
    document.getElementById('nianAttackBtn').style.background = '#666';
    document.getElementById('nianAttackBtn').style.cursor = 'not-allowed';
    document.getElementById('nianDefendBtn').disabled = true;
    document.getElementById('nianDefendBtn').style.background = '#666';
    document.getElementById('nianDefendBtn').style.cursor = 'not-allowed';
    document.getElementById('nianEscapeBtn').disabled = true;
    document.getElementById('nianEscapeBtn').style.background = '#666';
    document.getElementById('nianEscapeBtn').style.cursor = 'not-allowed';
    
    // 启用挑战按钮
    document.getElementById('challengeNianBtn').disabled = false;
    document.getElementById('challengeNianBtn').style.background = 'linear-gradient(145deg, #FFD700, #FFA500)';
    document.getElementById('challengeNianBtn').style.cursor = 'pointer';
  const hasChaos = hasChaosCauldron();
    if (hasChaos) {
        addNianBattleLog('🧨 检测到驱年爆竹！对年兽造成20倍克制伤害！', 'artifact', '#FF4500');
    }
     addNianBattleLog('🧧 欢迎来到年兽副本！', 'success');
    addNianBattleLog('🎫 消耗1个令牌开始挑战', 'info');
    addNianBattleLog('📢 第一层是试炼阶段，无奖励', 'info');
    addNianBattleLog('🎯 从第二层开始才有丰厚奖励！', 'warning');
    addNianBattleLog('🐅 年兽拥有多种强力技能', 'warning');
    addNianBattleLog('⚡ 击败年兽获得丰厚奖励', 'skill', '#FFD700');
    addNianBattleLog('🏃 逃跑按钮可立即结束战斗并结算奖励', 'info', '#f44336');
    addNianBattleLog('════════════ 年兽技能 ════════════', 'skill', '#FFD700');
    
    const sortedSkills = [...nianBeastSkills].sort((a, b) => b.chance - a.chance);
    sortedSkills.forEach(skill => {
        if (skill.chance > 0) {
            addNianBattleLog(`${skill.icon} ${skill.name}: ${(skill.chance * 100).toFixed(0)}%几率 | ${skill.multiplier}倍伤害`, 'skill', skill.color);
        }
    });
    
    addNianBattleLog('══════════════════════════════', 'skill', '#FFD700');
    
    // 更新显示
    updateNianBeastUI();
}

// 关闭年兽副本
function closeNianBeastDungeon() {
    // 如果正在战斗中，不重置令牌消耗状态，但可以关闭界面
    document.getElementById('nianBeastOverlay').style.display = 'none';
    document.getElementById('nianBeastUI').style.display = 'none';
}

// 计算玩家属性（转生数*10000）*当前灵根*当前血脉，宗门藏经阁传承加成修仙副本属性
function updateNianPlayerStats() {
    const sectLib = typeof getSectLibraryBonus === 'function' ? getSectLibraryBonus() : {};
    const libHealth = 1 + (sectLib.dungeonHealth || 0);
    const libAttack = 1 + (sectLib.dungeonAttack || 0);
    const libCritRate = sectLib.dungeonCritRate || 0;
    const libCritDmg = 1 + (sectLib.dungeonCritDamage || 0);
    if (!player.cultivation || !player.cultivation.root || !player.cultivation.bloodline) {
        nianBeastGame.playerMaxHp = player.reincarnationCount * 10000 * libHealth;
        nianBeastGame.playerHp = nianBeastGame.playerMaxHp;
        nianBeastGame.playerAtk = player.reincarnationCount * 100 * libAttack;
        nianBeastGame.playerCritRate = 0.3 + libCritRate;
        nianBeastGame.playerCrit = 1.5 * libCritDmg;
    } else {
        // 生命值 = (转生数 * 10000) * 灵根加成 * 血脉加成 * 藏经阁
        nianBeastGame.playerMaxHp = player.reincarnationCount * 10000 * 
                                    (player.cultivation.root.bonus || 1) * 
                                    (player.cultivation.bloodline.bonus || 1) * (1+player.fiveElements.metal.level * 0.2) * libHealth;
        nianBeastGame.playerHp = nianBeastGame.playerMaxHp;
        
        // 攻击力 = 阶段加成 * 装备法宝加成 * 藏经阁
        let stageMultiplier = 1;
        if (player.cultivation && player.cultivation.bonus) {
            stageMultiplier = player.cultivation.bonus;
        }
        
        let toolBonus = 1;
        if (player.magicTools && player.magicTools.equipped) {
            const tool = magicToolConfig.tools.find(t => t.id === player.magicTools.equipped);
            if (tool) toolBonus = tool.bonus;
        }
        
        nianBeastGame.playerAtk = stageMultiplier * toolBonus * 1000 * (1+player.fiveElements.wood.level * 0.05) * (1+player.fiveElements.earth.level * 0.05) * libAttack;
        
        // 爆伤 = 当前境界等级 * 藏经阁
        nianBeastGame.playerCrit = ((player.cultivation.stage || 0) * 0.5 * (1+player.fiveElements.water.level * 0.05) * (1+player.fiveElements.fire.level * 0.05) + 1.5) * libCritDmg;
        nianBeastGame.playerCritRate = 0.3 + libCritRate;
    }
 const chaosTipDiv = document.getElementById('yin_yang_mirrorbaab');
    if (chaosTipDiv) {
        const hasChaos = hasChaosCauldron();
        if (hasChaos) {
            chaosTipDiv.style.display = 'block';
            chaosTipDiv.innerHTML = `
                <div style="background: linear-gradient(145deg, #FF4500, #8B0000); padding: 10px; border-radius: 10px; margin-top: 10px; border: 2px solid #FFD700; animation: pulse-orange 2s infinite;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 24px;">🧨</span>
                        <div>
                            <div style="color: #FFD700; font-weight: bold; font-size: 16px;">驱年爆竹觉醒！</div>
                            <div style="color: white; font-size: 14px;">对年兽造成 <span style="color: #FFD700; font-weight: bold;">20倍</span> 克制伤害</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            chaosTipDiv.style.display = 'none';
        }
    }
updateArtifactCritPreview();
}

// 重置年兽战斗
function resetNianBeastBattle() {
    nianBeastGame.beastLevel = 1;
    nianBeastGame.beastMultiplier = 1;
    nianBeastGame.beastMaxHp = 1e5;
    nianBeastGame.beastCurrentHp = 1e5;
    nianBeastGame.beastAtk = 1e2;
    nianBeastGame.beastReviveCount = 2;
    nianBeastGame.isDefending = false;
    nianBeastGame.isInBattle = false;
    nianBeastGame.hasTokenCost = false;
    
    // 重置技能状态
    nianBeastGame.lastSkill = '';
    nianBeastGame.skillCombo = 0;
    nianBeastGame.lastComboSkill = '';
    nianBeastGame.skillTriggeredDeath = false;
    nianBeastGame.totalDamageDealt = 0;
     resetNianBeastSkills();
    // 清空战斗日志
    clearNianBattleLog();
}

// 更新年兽UI
function updateNianBeastUI() {
    // 更新玩家属性显示
    document.getElementById('nianPlayerHp').innerHTML = formatNumber(nianBeastGame.playerMaxHp);
    document.getElementById('nianPlayerAtk').innerHTML = formatNumber(nianBeastGame.playerAtk);
    document.getElementById('nianPlayerCrit').innerHTML = (nianBeastGame.playerCrit * 100 - 100).toFixed(0) + '%';
    document.getElementById('nianPlayerCritRate').innerHTML = '30%';
    
    // 更新BOSS信息
    document.getElementById('nianBeastLevel').innerHTML = nianBeastGame.beastLevel;
    document.getElementById('nianBeastReviveCount').innerHTML = nianBeastGame.beastReviveCount;
    document.getElementById('nianBeastHpText').innerHTML = formatNumber(nianBeastGame.beastCurrentHp) + ' / ' + formatNumber(nianBeastGame.beastMaxHp);
    document.getElementById('nianBeastAtk').innerHTML = formatNumber(nianBeastGame.beastAtk);
    document.getElementById('nianBeastMultiplier').innerHTML = nianBeastGame.beastMultiplier.toFixed(0) + '倍';
    
    // 更新血条
    let hpPercent = (nianBeastGame.beastCurrentHp / nianBeastGame.beastMaxHp) * 100;
    document.getElementById('nianBeastHpBar').style.width = hpPercent + '%';
    
    // 更新战斗中的玩家血条
    document.getElementById('nianBattlePlayerHp').innerHTML = formatNumber(nianBeastGame.playerHp) + ' / ' + formatNumber(nianBeastGame.playerMaxHp);
    let playerHpPercent = (nianBeastGame.playerHp / nianBeastGame.playerMaxHp) * 100;
    document.getElementById('nianBattlePlayerHpBar').style.width = playerHpPercent + '%';
    
    // 更新令牌显示
    document.getElementById('nianDungeonToken').innerHTML = player.nianBeast?.dungeonToken || 0;
     // 更新令牌显示
    const tokenDisplay = document.getElementById('nianTokenDisplay');
    if (tokenDisplay) {
        tokenDisplay.innerHTML = player.nianBeast?.dungeonToken || 0;
    }
    
    // 更新按钮状态
    const challengeBtn = document.getElementById('challengeNianBtn');
    if (challengeBtn) {
        if (nianBeastGame.isInBattle) {
            challengeBtn.disabled = true;
            challengeBtn.style.background = '#666';
            challengeBtn.style.cursor = 'not-allowed';
        } else {
            challengeBtn.disabled = false;
            challengeBtn.style.background = 'linear-gradient(145deg, #FFD700, #FFA500)';
            challengeBtn.style.cursor = 'pointer';
        }
    }
 let skillInfoDiv = document.getElementById('nianBeastSkillInfo');
    if (!skillInfoDiv) {
        // 在BOSS信息区域添加技能显示
        const bossInfoDiv = document.querySelector('#nianBeastUI [style*="background: linear-gradient(145deg, #C41E3A, #8B0000)"]');
        if (bossInfoDiv) {
            skillInfoDiv = document.createElement('div');
            skillInfoDiv.id = 'nianBeastSkillInfo';
            skillInfoDiv.style.marginTop = '15px';
            skillInfoDiv.style.padding = '10px';
            skillInfoDiv.style.background = 'rgba(0,0,0,0.5)';
            skillInfoDiv.style.borderRadius = '15px';
            skillInfoDiv.style.border = '1px solid #FFD700';
            bossInfoDiv.appendChild(skillInfoDiv);
        }
    }
    
    if (skillInfoDiv) {
        let lastSkill = nianBeastGame.lastSkill || '无';
        let combo = nianBeastGame.skillCombo || 0;
        
        // 随机显示一个技能预览
        const randomSkill = nianBeastSkills[Math.floor(Math.random() * nianBeastSkills.length)];
        
        skillInfoDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="color: #FFD700; font-size: 14px; font-weight: bold;">🎯 年兽技能</span>
                <span style="color: #aaa; font-size: 12px;">连击: ${combo}x</span>
            </div>
            <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                <div style="background: rgba(255,215,0,0.2); padding: 3px 8px; border-radius: 12px; font-size: 11px; color: #FFD700;">
                    上次: ${lastSkill}
                </div>
                <div style="background: rgba(156,39,176,0.2); padding: 3px 8px; border-radius: 12px; font-size: 11px; color: #9C27B0;">
                    预览: ${randomSkill.name} (${randomSkill.multiplier}x)
                </div>
            </div>
            <div style="margin-top: 8px;">
                <div style="font-size: 11px; color: #aaa; margin-bottom: 3px;">技能几率:</div>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    ${nianBeastSkills.map(skill => `
                        <div style="display: flex; align-items: center; gap: 2px;">
                            <span style="color: ${skill.color};">${skill.icon}</span>
                            <span style="color: #aaa; font-size: 10px;">${(skill.chance * 100).toFixed(0)}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
 const hasChaos = hasChaosCauldron();
    
    // 在玩家信息区域添加驱年爆竹提示
    const chaosTipDiv = document.getElementById('chaosCauldronTip');
    if (chaosTipDiv) {
        if (hasChaos) {
            chaosTipDiv.style.display = 'block';
            chaosTipDiv.innerHTML = `
                <div style="background: linear-gradient(145deg, #FF4500, #8B0000); padding: 10px; border-radius: 10px; margin-top: 10px; border: 2px solid #FFD700; animation: pulse-orange 2s infinite;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 24px;">🧨</span>
                        <div>
                            <div style="color: #FFD700; font-weight: bold; font-size: 16px;">驱年爆竹觉醒！</div>
                            <div style="color: white; font-size: 14px;">对年兽造成 <span style="color: #FFD700; font-weight: bold;">20倍</span> 克制伤害</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            chaosTipDiv.style.display = 'none';
        }
    }
    
    // 更新法宝暴伤预览
    updateArtifactCritPreview();
    // 更新奖励预览
    updateRewardPreview();
}

// 更新奖励预览
function updateRewardPreview() {
    let level = nianBeastGame.beastLevel;
    document.getElementById('previewRewardLevel').innerHTML = level;
    
    const previewContainer = document.getElementById('rewardPreviewContent');
    if (!previewContainer) return;
    
    let previewHtml = '';
    
    // 奖励配置
    const rewardConfig = [
        { key: 'danyao1', name: '蕴灵筑基丹', min: 1, max: 8, unlock: 1, color: '#4CAF50', icon: '💊' },
        { key: 'danyao2', name: '凝元固窍丹', min: 1, max: 6, unlock: 4, color: '#2196F3', icon: '💊' },
        { key: 'rootDetector', name: '灵根检测器', min: 1, max: 2, unlock: 6, color: '#9C27B0', icon: '🌿' },
        { key: 'danyao3', name: '渡厄金还丹', min: 1, max: 4, unlock: 8, color: '#FF5722', icon: '💊' },
        { key: 'bloodlineDetector', name: '血脉检测剂', min: 1, max: 2, unlock: 10, color: '#FFD700', icon: '💉' },
        { key: 'danyao4', name: '九转轮回丹', min: 1, max: 3, unlock: 12, color: '#673AB7', icon: '💊' },
        { key: 'advanceStone', name: '进阶神石', min: 1, max: 2, unlock: 15, color: '#00BCD4', icon: '🌑' },
        { key: 'danyao5', name: '混元道果丹', min: 1, max: 2, unlock: 20, color: '#E91E63', icon: '💊' }
    ];
    
    rewardConfig.forEach(config => {
        if (level >= config.unlock) {
            previewHtml += `
                <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 10px; border-left: 5px solid ${config.color};">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <span style="font-size: 16px;">${config.icon}</span>
                        <span style="color: #aaa; font-size: 11px; flex: 1;">${config.name}</span>
                        <span style="color: #FFD700; font-weight: bold;">${config.min * level}-${config.max * level}</span>
                    </div>
                    <div style="font-size: 9px; color: ${config.color}; margin-top: 2px;">第${config.unlock}层解锁 ✓</div>
                </div>
            `;
        } else {
            previewHtml += `
                <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 10px; border-left: 5px solid #666; opacity: 0.5;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <span style="font-size: 16px;">❓</span>
                        <span style="color: #666; font-size: 11px; flex: 1;">${config.name}</span>
                        <span style="color: #666;">???</span>
                    </div>
                    <div style="font-size: 9px; color: #666; margin-top: 2px;">第${config.unlock}层解锁</div>
                </div>
            `;
        }
    });
    
    previewContainer.innerHTML = previewHtml;
    
    // 更新试炼提示
    const tipDiv = document.getElementById('firstLevelTip');
    if (tipDiv) {
        if (level <= 1) {
            tipDiv.style.display = 'block';
            tipDiv.innerHTML = `
                <span style="color: #FF6B6B; font-weight: bold;">⚠️ 试炼阶段</span>
                <span style="color: #aaa; font-size: 12px; margin-left: 10px;">第一层只有蕴灵筑基丹</span>
            `;
        } else {
            tipDiv.style.display = 'none';
        }
    }
}
function buyNianToken() {
    if (!player.nianBeast) initNianBeastSystem();
    
    // 检查宝藏金币是否足够
    if (player.items && player.items.primaryGemq >= 3) {
        player.items.primaryGemq -= 3;
        player.nianBeast.dungeonToken = (player.nianBeast.dungeonToken || 0) + 1;
        
        updateNianBeastUI();
        addNianBattleLog('🎫 成功购买1个修仙令牌！消耗3枚宝藏金币', 'success');
    } else {
        addNianBattleLog('❌ 宝藏金币不足！需要3枚宝藏金币', 'error');
    }
}



// 挑战年兽（消耗令牌）
function challengeNianBeast() {
    initNianBeastSystem();
    
    // 检查令牌数量
    if (player.nianBeast.dungeonToken < 1) {
        addNianBattleLog('❌ 修仙令牌不足！', 'error');
        return;
    }
    
    // 消耗令牌
    player.nianBeast.dungeonToken--;
    nianBeastGame.hasTokenCost = true;
    nianBeastGame.isInBattle = true;
    
    // 重置战斗状态
    resetNianBeastBattle();
    nianBeastGame.isInBattle = true;
    nianBeastGame.hasTokenCost = true;
    
    // 更新玩家属性
    updateNianPlayerStats();
    nianBeastGame.playerHp = nianBeastGame.playerMaxHp;
    
    // 启用攻击按钮
    document.getElementById('nianAttackBtn').disabled = false;
    document.getElementById('nianAttackBtn').style.background = 'linear-gradient(145deg, #FFD700, #FFA500)';
    document.getElementById('nianAttackBtn').style.cursor = 'pointer';
    document.getElementById('nianDefendBtn').disabled = false;
    document.getElementById('nianDefendBtn').style.background = 'linear-gradient(145deg, #4CAF50, #2E7D32)';
    document.getElementById('nianDefendBtn').style.cursor = 'pointer';
    document.getElementById('nianEscapeBtn').disabled = false;
    document.getElementById('nianEscapeBtn').style.background = 'linear-gradient(145deg, #f44336, #c62828)';
    document.getElementById('nianEscapeBtn').style.cursor = 'pointer';
    
    // 禁用挑战按钮
    document.getElementById('challengeNianBtn').disabled = true;
    document.getElementById('challengeNianBtn').style.background = '#666';
    document.getElementById('challengeNianBtn').style.cursor = 'not-allowed';
    
    // 清空战斗日志
    clearNianBattleLog();
    
    addNianBattleLog('🎫 消耗1个修仙令牌，开始讨伐年兽！', 'success');
    addNianBattleLog('🐅 新年年兽 Lv.1 出现了！', 'warning');
   const hasChaos = hasChaosCauldron();
    if (hasChaos) {
        addNianBattleLog('🧨 驱年爆竹觉醒！对年兽造成20倍克制伤害！', 'artifact', '#FF4500');
        addNianBattleLog('⚡ 这将是一场碾压级的战斗！', 'artifact', '#FFD700');
    }
    addNianBattleLog('📢 第一层是试炼阶段，无奖励', 'info');
    addNianBattleLog('🎯 从第二层开始才有丰厚奖励！', 'warning');
    addNianBattleLog('📊 年兽拥有多种技能，小心它的强力攻击！', 'skill', '#9C27B0');
    
    // 显示技能列表
     addNianBattleLog('════════════ 年兽技能 ════════════', 'skill', '#FFD700');
    
    const sortedSkills = [...nianBeastSkills].sort((a, b) => b.chance - a.chance);
    sortedSkills.forEach(skill => {
        if (skill.chance > 0) {
            addNianBattleLog(`${skill.icon} ${skill.name}: ${(skill.chance * 100).toFixed(0)}%几率 | ${skill.multiplier}倍伤害`, 'skill', skill.color);
        }
    });
    
    addNianBattleLog('══════════════════════════════', 'skill', '#FFD700');
    
    updateNianBeastUI();
}


// 攻击年兽
function nianBeastAttack() {
    // 检查是否在战斗中且已消耗令牌
    if (!nianBeastGame.isInBattle) {
        addNianBattleLog('请先消耗令牌挑战年兽！', 'error');
        return;
    }
    
    if (!nianBeastGame.hasTokenCost) {
        addNianBattleLog('需要消耗1个修仙令牌才能攻击！', 'error');
        return;
    }
    
    if (bLteZero(nianBeastGame.playerHp)) {
        addNianBattleLog('你已战败，战斗结束', 'error');
        endNianBeastBattle(false);
        return;
    }
    
    
    const hasChaos = hasChaosCauldron();
    let damage = nianBeastGame.playerAtk;
    let isCrit = Math.random() < nianBeastGame.playerCritRate;
    let critMultiplier = 1;
    let artifactEffect = null;
    let chaosBonus = 1;
    
   
    if (hasChaos) {
        chaosBonus = 20;
        addNianBattleLog('🧨 驱年爆竹感应到年兽气息！', 'artifact', '#FF6B6B');
        addNianBattleLog('⚡ 驱年爆竹对年兽造成20倍克制伤害！', 'artifact', '#FFD700');
    }
    
    // 暴击判定
    if (isCrit) {
        critMultiplier = nianBeastGame.playerCrit;
        addNianBattleLog(`⚡ 基础暴击！造成 ${(critMultiplier * 100 - 100).toFixed(0)}% 伤害`, 'crit');
    }
    
    // 触发法宝暴伤效果（5%几率）
    artifactEffect = triggerArtifactCrit();
    
    if (artifactEffect.triggered) {
        // 应用法宝暴伤倍率
        let totalMultiplier = critMultiplier * artifactEffect.multiplier * chaosBonus;
        damage = Math.floor(damage * totalMultiplier);
        
        // 霸气语录显示
        addNianBattleLog(`🌟 ${artifactEffect.quote}`, 'skill', '#FFD700');
        addNianBattleLog(`💫 ${artifactEffect.message} (${artifactEffect.multiplier}倍)`, 'artifact', '#FF6B6B');
        
        if (hasChaos) {
            addNianBattleLog(`🧨 驱年爆竹额外加成: 20倍`, 'artifact', '#FF4500');
        }
        
        addNianBattleLog(`⚔️ 总伤害倍率: ${critMultiplier.toFixed(1)} × ${artifactEffect.multiplier} × ${chaosBonus} = ${totalMultiplier.toFixed(1)}倍`, 'info', '#4CAF50');
    } else {
        
        damage = Math.floor(damage * critMultiplier * chaosBonus);
        
        if (hasChaos && !isCrit) {
            addNianBattleLog(`🧨 驱年爆竹造成 ${chaosBonus}倍克制伤害！`, 'artifact', '#FF4500');
            addNianBattleLog(`⚔️ 总伤害倍率: 1 × ${chaosBonus} = ${chaosBonus}倍`, 'info', '#4CAF50');
        } else if (hasChaos && isCrit) {
            addNianBattleLog(`⚔️ 总伤害倍率: ${critMultiplier.toFixed(1)} × ${chaosBonus} = ${(critMultiplier * chaosBonus).toFixed(1)}倍`, 'info', '#4CAF50');
        }
    }
    
    // 显示最终伤害
    if (artifactEffect.triggered) {
        addNianBattleLog(`💥 法宝神威！造成 ${formatSci(damage)} 点伤害！`, 'crit');
    } else if (hasChaos) {
        addNianBattleLog(`🧨 驱年爆竹之力！造成 ${formatSci(damage)} 点伤害！`, 'crit');
    } else if (isCrit) {
        addNianBattleLog(`⚔️ 暴击造成 ${formatSci(damage)} 点伤害`, 'crit');
    } else {
        addNianBattleLog(`⚔️ 造成 ${formatSci(damage)} 点伤害`, 'normal');
    }
    
    // 减少BOSS血量
    nianBeastGame.beastCurrentHp -= damage;
    
    // 检查BOSS是否死亡
    if (nianBeastGame.beastCurrentHp <= 0) {
        handleNianBeastDeath();
    } else {
        // BOSS反击
        nianBeastCounterAttack();
    }
    
    updateNianBeastUI();
}

// 防御
function nianBeastDefend() {
    // 检查是否在战斗中且已消耗令牌
    if (!nianBeastGame.isInBattle) {
        addNianBattleLog('请先消耗令牌挑战年兽！', 'error');
        return;
    }
    
    if (!nianBeastGame.hasTokenCost) {
        addNianBattleLog('需要消耗1个修仙令牌才能防御！', 'error');
        return;
    }
    
    if (bLteZero(nianBeastGame.playerHp)) {
        addNianBattleLog('你已战败，战斗结束', 'error');
        endNianBeastBattle(false);
        return;
    }
    
    nianBeastGame.isDefending = true;
    addNianBattleLog('🛡️ 进入防御状态，受到的伤害减半', 'defend');
    
    // BOSS攻击，但伤害减半
    nianBeastCounterAttack(true);
}

function nianBeastEscape() {
    // 检查是否在战斗中
    if (!nianBeastGame.isInBattle) {
        addNianBattleLog('❌ 现在无法逃跑！', 'error');
        return;
    }
    
    if (!nianBeastGame.hasTokenCost) {
        addNianBattleLog('❌ 请先消耗令牌挑战年兽！', 'error');
        return;
    }
    
    // 更新当前层数显示
    document.getElementById('escapeCurrentLevel').innerHTML = nianBeastGame.beastLevel;
    
    // 显示确认弹窗
    document.getElementById('escapeConfirmOverlay').style.display = 'block';
    document.getElementById('escapeConfirmDialog').style.display = 'block';
}

// 确认逃跑
function confirmEscape() {
    // 关闭弹窗
    closeEscapeDialog();
    
    // 添加逃跑日志
    addNianBattleLog('🏃 你选择了逃跑！', 'warning');
    addNianBattleLog('💀 逃跑导致战败...', 'error');
    
    // 记录当前层数用于奖励结算
    const escapeLevel = nianBeastGame.beastLevel;
    
    // 设置玩家血量为0（死亡）
    nianBeastGame.playerHp = 0;
    
    // 更新UI显示
    updateNianBeastUI();
    
    // 结束战斗（死亡结算）
    setTimeout(() => {
        endNianBeastBattle(false);
        
        // 添加逃跑特殊提示
        if (escapeLevel > 1) {
            addNianBattleLog(`🏃 你在第 ${escapeLevel} 层选择了逃跑`, 'info');
            addNianBattleLog(`💰 获得第 ${escapeLevel} 层奖励`, 'success');
        } else {
            addNianBattleLog('📢 第一层逃跑无奖励', 'info');
        }
    }, 500);
}

// 取消逃跑
function cancelEscape() {
    closeEscapeDialog();
    addNianBattleLog('✨ 继续战斗！', 'success');
}

// 关闭逃跑弹窗
function closeEscapeDialog() {
    document.getElementById('escapeConfirmOverlay').style.display = 'none';
    document.getElementById('escapeConfirmDialog').style.display = 'none';
}
// BOSS反击
function nianBeastCounterAttack(isDefending = false) {
    if (nianBeastGame.beastCurrentHp <= 0) return;
    
    // 基础伤害
    let bossDamage = nianBeastGame.beastAtk;
    let skillMultiplier = 1.0;
    let skillName = '普通攻击';
    let skillMessage = '';
    let skillColor = '#aaa';
    let skillIcon = '🐾';
    
    // 随机选择技能
    const rand = Math.random();
    let cumulativeChance = 0;
    
    // 先检查是否触发特殊技能
    let isSpecialSkill = false;
    let hpPercent = nianBeastGame.beastCurrentHp / nianBeastGame.beastMaxHp;
    
    // 垂死挣扎 - 血量低于20%时必触发一次
    if (hpPercent < 0.2 && !nianBeastGame.skillTriggeredDeath) {
        nianBeastGame.skillTriggeredDeath = true;
        skillMultiplier = 3.0;
        skillName = '垂死挣扎';
        skillMessage = '⚡ 年兽垂死挣扎！造成3倍毁灭性打击！';
        skillColor = '#9C27B0';
        skillIcon = '⚡';
        isSpecialSkill = true;
        addNianBattleLog(`💀 年兽进入濒死状态！发动垂死挣扎！`, 'warning');
    }
    // 新年祝福 - 血量低于50%且有15%几率触发
    else if (hpPercent < 0.5 && Math.random() < 0.15) {
        skillMultiplier = 0.5;
        skillName = '新年祝福';
        skillMessage = '🧧 年兽吸收新年气息，攻击伤害减半！';
        skillColor = '#4CAF50';
        skillIcon = '🧧';
        isSpecialSkill = true;
    }
    // 普通技能随机
    else {
        for (const skill of nianBeastSkills) {
            cumulativeChance += skill.chance;
            if (rand < cumulativeChance) {
                skillMultiplier = skill.multiplier;
                skillName = skill.name;
                skillMessage = skill.message;
                skillColor = skill.color;
                skillIcon = skill.icon;
                break;
            }
        }
    }
    
    // 应用技能倍率
    bossDamage = Math.floor(bossDamage * skillMultiplier);
    
    // 记录本次技能
    nianBeastGame.lastSkill = skillName;
    
    // 连击系统 - 连续使用相同技能增加伤害
    if (nianBeastGame.lastComboSkill === skillName) {
        nianBeastGame.skillCombo++;
        if (nianBeastGame.skillCombo > 1) {
            let comboBonus = 1 + (nianBeastGame.skillCombo * 0.1);
            bossDamage = Math.floor(bossDamage * comboBonus);
            skillMessage += ` 🔥 连击x${nianBeastGame.skillCombo}！伤害提升${(comboBonus * 100 - 100).toFixed(0)}%`;
        }
    } else {
        nianBeastGame.lastComboSkill = skillName;
        nianBeastGame.skillCombo = 1;
    }
    
    // 防御减伤
    if (isDefending || nianBeastGame.isDefending) {
        bossDamage = Math.floor(bossDamage / 2);
        nianBeastGame.isDefending = false;
        addNianBattleLog(`🛡️ 防御成功！`, 'defend');
    }
    
    // 显示技能信息
    addNianBattleLog(`${skillIcon} ${skillMessage}`, 'skill', skillColor);
    addNianBattleLog(`💢 受到 ${formatNumber(bossDamage)} 点伤害`, 'damage');
    
    // 减少玩家血量
    nianBeastGame.playerHp = bSub(nianBeastGame.playerHp, bossDamage);
    nianBeastGame.totalDamageDealt += bossDamage;
    
    // 检查玩家是否死亡
    if (bLteZero(nianBeastGame.playerHp)) {
        nianBeastGame.playerHp = 0;
        addNianBattleLog('💀 你被年兽击败了...', 'error');
        endNianBeastBattle(false);
    }
}

// 处理年兽死亡
function handleNianBeastDeath() {
    nianBeastGame.beastReviveCount--;
    
    if (nianBeastGame.beastReviveCount > 0) {
        // 复活，属性提升1.25倍
        nianBeastGame.beastMaxHp *= 1.25;
        nianBeastGame.beastCurrentHp = nianBeastGame.beastMaxHp;
        nianBeastGame.beastAtk *= 1.25;
        nianBeastGame.beastMultiplier *= 1.25;
        
        // 重置技能状态
        nianBeastGame.skillTriggeredDeath = false;
        nianBeastGame.lastComboSkill = '';
        nianBeastGame.skillCombo = 0;
        
        // 随机获得一个复活技能
        const reviveSkills = [
            { name: '怨念重生', multiplier: 1.5, message: '👻 年兽带着怨念复活，攻击提升50%' },
            { name: '新春复苏', multiplier: 1.2, message: '🌸 年兽吸收新春气息复活，攻击提升20%' },
            { name: '狂暴觉醒', multiplier: 2.0, message: '🔥 年兽狂暴觉醒！攻击提升100%' }
        ];
        
        const reviveSkill = reviveSkills[Math.floor(Math.random() * reviveSkills.length)];
        nianBeastGame.beastAtk *= reviveSkill.multiplier;
        
        addNianBattleLog(`✨ 年兽复活！剩余复活次数: ${nianBeastGame.beastReviveCount}`, 'warning');
        addNianBattleLog(`${reviveSkill.message}`, 'skill', '#FFD700');
        addNianBattleLog(`⚡ 年兽属性提升${(reviveSkill.multiplier * 2 * 100).toFixed(0)}%！`, 'warning');
        
        // 复活后立即发动一次攻击
        setTimeout(() => {
            if (nianBeastGame.isInBattle) {
                addNianBattleLog(`⚠️ 复活后的年兽立即发动攻击！`, 'warning');
                nianBeastCounterAttack();
            }
        }, 100);
        
    } else {
        // 没有复活次数了，进入下一级
        nianBeastGame.beastReviveCount = 2;
        nianBeastGame.beastLevel++;
        
        // 每级提升：血量1e5倍，攻击1e6倍
         nianBeastGame.beastMultiplier = Math.pow(5, nianBeastGame.beastLevel - 1);
        nianBeastGame.beastMaxHp = 1e5 * Math.pow(6, nianBeastGame.beastLevel - 1);
        nianBeastGame.beastCurrentHp = nianBeastGame.beastMaxHp;
        nianBeastGame.beastAtk = 1e2 * Math.pow(3, nianBeastGame.beastLevel - 1);
        
        // 重置技能状态
        nianBeastGame.skillTriggeredDeath = false;
        nianBeastGame.lastComboSkill = '';
        nianBeastGame.skillCombo = 0;
        
        // 每2级解锁新技能
        if (nianBeastGame.beastLevel % 2 === 0) {
            unlockNianBeastSkill(nianBeastGame.beastLevel);
        }
        
        addNianBattleLog(`🎉 成功击败年兽！进入第 ${nianBeastGame.beastLevel} 级！`, 'success');
        
        // 第一层进入第二层时的特殊提示
        if (nianBeastGame.beastLevel === 2) {
            addNianBattleLog(`🎯 恭喜通过试炼！从第2层开始有丰厚奖励！`, 'success');
            addNianBattleLog(`💰 奖励预览已更新！`, 'warning');
        }
        
        // 每2级提示
        if (nianBeastGame.beastLevel % 2 === 0) {
            addNianBattleLog(`🌟 年兽学习了新的技能！`, 'skill', '#FFD700');
        }
        
        // 给予少量回血奖励
        nianBeastGame.playerHp = Math.min(nianBeastGame.playerHp + nianBeastGame.playerMaxHp * 0.5, nianBeastGame.playerMaxHp);
        addNianBattleLog(`❤️ 恢复50%生命值`, 'heal');
    }
}
function unlockNianBeastSkill(level) {
    const newSkills = [
        { level: 2, name: '雷霆一击', multiplier: 5.0, chance: 0.03, message: '⚡ 年兽领悟雷霆一击！5.0倍伤害', color: '#8A2BE2', icon: '⚡' },
        { level: 4, name: '地震践踏', multiplier: 7.5, chance: 0.03, message: '🌋 年兽领悟地震践踏！7.5倍伤害', color: '#8A2BE2', icon: '🌋' },
        { level: 6, name: '冰霜吐息', multiplier: 10.0, chance: 0.03, message: '❄️ 年兽领悟冰霜吐息！10倍伤害', color: '#8A2BE2', icon: '❄️' },
        { level: 8, name: '烈火焚天', multiplier: 12.5, chance: 0.03, message: '🔥 年兽领悟烈火焚天！12.5倍伤害', color: '#8A2BE2', icon: '🔥' },
        { level: 10, name: '时空撕裂', multiplier: 15.0, chance: 0.03, message: '⏰ 年兽领悟时空撕裂！15倍伤害', color: '#8A2BE2', icon: '⏰' },
        { level: 12, name: '混沌灾厄', multiplier: 20.0, chance: 0.03, message: '🌪️ 年兽领悟混沌灾厄！20倍伤害', color: '#8A2BE2', icon: '🌪️' },
        { level: 14, name: '神兽降临', multiplier: 30.0, chance: 0.03, message: '🐉 年兽领悟神兽降临！30倍伤害', color: '#8A2BE2', icon: '🐉' },
        { level: 16, name: '天道制裁', multiplier: 40.0, chance: 0.03, message: '⚖️ 年兽领悟天道制裁！40倍伤害', color: '#8A2BE2', icon: '⚖️' },
        { level: 18, name: '洪荒之力', multiplier: 50.0, chance: 0.03, message: '🌍 年兽领悟洪荒之力！50倍伤害', color: '#8A2BE2', icon: '🌍' },
        { level: 20, name: '创世毁灭', multiplier: 100.0, chance: 0.03, message: '💫 年兽领悟创世毁灭！100倍毁灭打击', color: '#8A2BE2', icon: '💫' }
    ];
    
   const unlockedSkill = newSkills.find(skill => skill.level === level);
    if (unlockedSkill) {
        // 添加到当前战斗的技能池（不修改基础配置）
        nianBeastSkills.push({
            name: unlockedSkill.name,
            description: `Lv.${level}解锁的强力技能`,
            multiplier: unlockedSkill.multiplier,
            chance: unlockedSkill.chance,
            message: unlockedSkill.message,
            color: unlockedSkill.color,
            icon: unlockedSkill.icon
        });
        
        addNianBattleLog(`🎯 年兽解锁新技能: ${unlockedSkill.name}！`, 'skill', '#8A2BE2');
    }
}


// 结束战斗
function endNianBeastBattle(isVictory) {
    nianBeastGame.isInBattle = false;
    nianBeastGame.hasTokenCost = false;
    
    // 启用挑战按钮
    document.getElementById('challengeNianBtn').disabled = false;
    document.getElementById('challengeNianBtn').style.background = 'linear-gradient(145deg, #FFD700, #FFA500)';
    document.getElementById('challengeNianBtn').style.cursor = 'pointer';
    
    // 禁用攻击、防御、逃跑按钮
    document.getElementById('nianAttackBtn').disabled = true;
    document.getElementById('nianAttackBtn').style.background = '#666';
    document.getElementById('nianAttackBtn').style.cursor = 'not-allowed';
    document.getElementById('nianDefendBtn').disabled = true;
    document.getElementById('nianDefendBtn').style.background = '#666';
    document.getElementById('nianDefendBtn').style.cursor = 'not-allowed';
    document.getElementById('nianEscapeBtn').disabled = true;
    document.getElementById('nianEscapeBtn').style.background = '#666';
    document.getElementById('nianEscapeBtn').style.cursor = 'not-allowed';
    
    // 战斗结束后不立即重置技能，等待下次挑战时重置
    
    if (!isVictory) {
        // 玩家死亡或逃跑，结算奖励
        let defeatedLevel = nianBeastGame.beastLevel;
        
        // 更新最高记录
        if (defeatedLevel > (player.nianBeast.highestLevel || 0)) {
            player.nianBeast.highestLevel = defeatedLevel;
        }
        
        player.nianBeast.totalKills++;
        
        // 第一层没有奖励提示
        if (defeatedLevel <= 1) {
            addNianBattleLog('📢 第一层试炼结束，无奖励', 'info');
            addNianBattleLog('🎯 继续挑战第二层获取奖励！', 'warning');
            
            // 自动关闭副本（可选）
            setTimeout(() => {
                closeNianBeastDungeon();
            }, 2000);
        } else {
            // 显示奖励弹窗
            showNianRewards(defeatedLevel);
        }
    }
}

// 显示奖励弹窗
function showNianRewards(level) {
    // 第一层没有奖励
    if (level <= 1) {
        closeNianBeastDungeon();
        alert('🎯 第一层是试炼阶段，从第二层开始才有奖励！\n\n继续挑战吧！');
        addNianBattleLog('📢 第一层是试炼阶段，无奖励', 'info');
        addNianBattleLog('🎯 从第二层开始才有丰厚奖励！', 'warning');
        return;
    }
    
    // 生成奖励
    let rewards = generateNianRewards(level);
    
    document.getElementById('rewardBeastLevel').innerHTML = level;
    
    // 添加解锁层数显示
    let unlockInfo = '';
    if (level >= 20) unlockInfo = '✨ 全部奖励已解锁！';
    else if (level >= 15) unlockInfo = '🔓 下一解锁: 混元道果丹(20层)';
    else if (level >= 12) unlockInfo = '🔓 下一解锁: 进阶神石(15层)';
    else if (level >= 10) unlockInfo = '🔓 下一解锁: 九转轮回丹(12层)';
    else if (level >= 8) unlockInfo = '🔓 下一解锁: 血脉检测剂(10层)';
    else if (level >= 6) unlockInfo = '🔓 下一解锁: 渡厄金还丹(8层)';
    else if (level >= 4) unlockInfo = '🔓 下一解锁: 灵根检测器(6层)';
    else if (level >= 1) unlockInfo = '🔓 下一解锁: 凝元固窍丹(4层)';
    
    let rewardsHtml = `
        <div style="margin-bottom: 15px; padding: 8px; background: rgba(255,215,0,0.2); border-radius: 10px; text-align: center; color: #FFD700; font-size: 13px;">
            ${unlockInfo}
        </div>
    `;
    
    // 奖励名称映射
    const rewardNames = {
        'danyao1': '蕴灵筑基丹',
        'danyao2': '凝元固窍丹',
        'danyao3': '渡厄金还丹',
        'danyao4': '九转轮回丹',
        'danyao5': '混元道果丹',
        'rootDetector': '灵根检测器',
        'bloodlineDetector': '血脉检测剂',
        'advanceStone': '进阶神石'
    };
    
    // 奖励图标映射
    const rewardIcons = {
        'danyao1': '💊',
        'danyao2': '💊',
        'danyao3': '💊',
        'danyao4': '💊',
        'danyao5': '💊',
        'advanceStone': '🌑',
        'bloodlineDetector': '💉',
        'rootDetector': '🌿'
    };
    
    // 奖励颜色映射
    const rewardColors = {
        'danyao1': '#4CAF50',
        'danyao2': '#2196F3',
        'rootDetector': '#9C27B0',
        'danyao3': '#FF5722',
        'bloodlineDetector': '#FFD700',
        'danyao4': '#673AB7',
        'advanceStone': '#00BCD4',
        'danyao5': '#E91E63'
    };
    
    for (let [itemKey, amount] of Object.entries(rewards)) {
        let name = rewardNames[itemKey] || itemKey;
        let icon = rewardIcons[itemKey] || '🎁';
        let color = rewardColors[itemKey] || '#FFD700';
        
        rewardsHtml += `
            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 15px; display: flex; align-items: center; gap: 10px; border-left: 5px solid ${color};">
                <span style="font-size: 24px;">${icon}</span>
                <div style="flex: 1;">
                    <div style="font-size: 14px; color: #FFD700;">${name}</div>
                    <div style="font-size: 20px; font-weight: bold; color: white;">+${amount}</div>
                </div>
            </div>
        `;
    }
    
    document.getElementById('nianRewardItems').innerHTML = rewardsHtml;
    
    // 显示奖励弹窗
    document.getElementById('nianRewardOverlay').style.display = 'block';
    document.getElementById('nianRewardUI').style.display = 'block';
    
    // 保存当前奖励到临时变量，等待领取
    window.currentNianRewards = rewards;
}

// 生成年兽奖励
function generateNianRewards(level) {
    let rewards = {};
    
 
    if (level >= 1) {
        rewards['danyao1'] = Math.floor(Math.random() * (8 * level - 3 * level + 1) + 3 * level);
    }
    
    
    if (level >= 4) {
        rewards['danyao2'] = Math.floor(Math.random() * (6 * level - 3 * level + 1) + 3 * level);
    }
    
   
    if (level >= 6) {
        rewards['rootDetector'] = Math.floor(Math.random() * (2 * level - 1 * level + 1) + 1 * level);
    }
    
    
    if (level >= 8) {
        rewards['danyao3'] = Math.floor(Math.random() * (4 * level - 1 * level + 1) + 1 * level);
    }
    

    if (level >= 10) {

        rewards['bloodlineDetector'] = Math.floor(Math.random() * (2 * level - 1 * level + 1) + 1 * level);
    }
    

    if (level >= 12) {

        rewards['danyao4'] = Math.floor(Math.random() * (3 * level - 1 * level + 1) + 1 * level);
    }
    

    if (level >= 15) {

        rewards['advanceStone'] = Math.floor(Math.random() * (2 * level - 1 * level + 1) + 1 * level);
    }
    

    if (level >= 20) {

        rewards['danyao5'] = Math.floor(Math.random() * (2 * level - 1 * level + 1) + 1 * level);
    }
    
    return rewards;
}


// 领取奖励
function claimNianRewards() {
    if (!window.currentNianRewards) {
        alert('没有可领取的奖励！');
        return;
    }
    
    // 确保items对象存在
    if (!player.items) {
        player.items = {};
    }
    
    // 添加奖励到玩家背包
    for (let [itemKey, amount] of Object.entries(window.currentNianRewards)) {
        player.items[itemKey] = (player.items[itemKey] || 0) + amount;
    }
    
    // 更新记录
    player.nianBeast.rewardsCollected += Object.values(window.currentNianRewards).reduce((a,b) => a + b, 0);
    
    // 关闭奖励弹窗
    closeNianRewards();
    
    // 显示成功提示
    alert(`🎉 成功领取讨伐奖励！`);
    
    // 更新显示
    updateDisplay();
    if (typeof updatePillSystemUI === 'function') {
        updatePillSystemUI();
    }
}

// 关闭奖励弹窗
function closeNianRewards() {
    document.getElementById('nianRewardOverlay').style.display = 'none';
    document.getElementById('nianRewardUI').style.display = 'none';
}


// 添加战斗日志
function addNianBattleLog(message, type = 'normal', color = null) {
    let logDiv = document.getElementById('nianBattleLog');
    let newLog = document.createElement('div');
    
    let textColor = '#aaa';
    let prefix = '•';
    
    switch(type) {
        case 'success': 
            textColor = '#4CAF50'; 
            prefix = '✅'; 
            break;
        case 'error': 
            textColor = '#f44336'; 
            prefix = '❌'; 
            break;
        case 'warning': 
            textColor = '#FFD700'; 
            prefix = '⚠️'; 
            break;
        case 'crit': 
            textColor = '#FFD700'; 
            prefix = '⚡'; 
            break;
        case 'damage': 
            textColor = '#FF6B6B'; 
            prefix = '💢'; 
            break;
        case 'defend': 
            textColor = '#4CAF50'; 
            prefix = '🛡️'; 
            break;
        case 'heal': 
            textColor = '#4CAF50'; 
            prefix = '❤️'; 
            break;
        case 'skill': 
            textColor = color || '#9C27B0'; 
            prefix = '🎯'; 
            break;
        case 'artifact':
            textColor = '#FF6B6B';
            prefix = '🌟';
            break;
        case 'info':
            textColor = '#aaa';
            prefix = '📌';
            break;
        case 'quote':
            textColor = '#FFD700';
            prefix = '💬';
            break;
    }
    
    // 添加时间戳
    let timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    newLog.style.marginBottom = '4px';
    newLog.style.padding = '4px 0';
    newLog.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    newLog.style.fontSize = '12px';
    newLog.style.display = 'flex';
    newLog.style.alignItems = 'center';
    newLog.style.gap = '5px';
    newLog.style.animation = 'fadeIn 0.3s';
    
    newLog.innerHTML = `
        <span style="color: #666; font-size: 10px; min-width: 55px;">[${timestamp}]</span>
        <span style="color: ${textColor}; font-weight: ${type === 'skill' || type === 'artifact' ? 'bold' : 'normal'}; min-width: 20px;">${prefix}</span>
        <span style="color: ${textColor}; flex: 1;">${message}</span>
    `;
    
    // 将新日志插入到最前面
    logDiv.insertBefore(newLog, logDiv.firstChild);
    
    // 限制日志条数
    while (logDiv.children.length > 50) {
        logDiv.removeChild(logDiv.lastChild);
    }
}

function clearNianBattleLog() {
    let logDiv = document.getElementById('nianBattleLog');
    logDiv.innerHTML = '';
    
    // 添加默认提示信息
    let defaultLog = document.createElement('div');
    defaultLog.style.marginBottom = '4px';
    defaultLog.style.padding = '4px 0';
    defaultLog.style.fontSize = '12px';
    defaultLog.style.color = '#666';
    defaultLog.style.textAlign = 'center';
    defaultLog.style.width = '100%';
    defaultLog.innerHTML = '✨ 战斗即将开始...';
    logDiv.appendChild(defaultLog);
}

// 更新战斗UI
function updateNianBattleUI() {
    // 更新令牌
    if (document.getElementById('nianDungeonToken')) {
        document.getElementById('nianDungeonToken').innerHTML = player.nianBeast?.dungeonToken || 0;
    }
}

// 获取奖励图标
function getRewardIcon(item) {
    const icons = {
        '蕴灵筑基丹': '💊',
        '凝元固窍丹': '💊',
        '渡厄金还丹': '💊',
        '九转轮回丹': '💊',
        '混元道果丹': '💊',
        '灵根检测器': '🌿',
        '血脉检测剂': '💉',
        '进阶神石': '🌑'
    };
    return icons[item] || '🎁';
}

// 获取奖励颜色
function getRewardColor(item) {
    const colors = {
        '蕴灵筑基丹': '#4CAF50',
        '凝元固窍丹': '#2196F3',
        '灵根检测器': '#9C27B0',
        '渡厄金还丹': '#FF5722',
        '血脉检测剂': '#FFD700',
        '九转轮回丹': '#673AB7',
        '进阶神石': '#00BCD4',
        '混元道果丹': '#E91E63'
    };
    return colors[item] || '#FFD700';
}

// 格式化数字
function formatNumber(num) {
    return formatSci(num);
}
const pillConfig = {
    danyao1: {
        name: '蕴灵筑基丹',
        exp: 10000,
        color: '#4CAF50',
        icon: '💊',
        itemKey: 'danyao1'
    },
    danyao2: {
        name: '凝元固窍丹',
        exp: 100000,
        color: '#2196F3',
        icon: '💊',
        itemKey: 'danyao2'
    },
    danyao3: {
        name: '渡厄金还丹',
        exp: 1000000,
        color: '#9C27B0',
        icon: '💊',
        itemKey: 'danyao3'
    },
    danyao4: {
        name: '九转轮回丹',
        exp: 10000000,
        color: '#FF5722',
        icon: '💊',
        itemKey: 'danyao4'
    },
    danyao5: {
        name: '混元道果丹',
        exp: 100000000,
        color: '#FFD700',
        icon: '💊',
        itemKey: 'danyao5'
    }
};


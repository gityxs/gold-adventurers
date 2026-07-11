// 丹药与试练塔
// 切换丹药系统界面
function togglePillSystem() {
    const ui = document.getElementById('pillSystemUI');
    const overlay = document.getElementById('pillSystemOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updatePillSystemUI();
    }
}

// 更新丹药系统UI
function updatePillSystemUI() {
    if (!player.items) player.items = {};
    
    // 更新经验显示
    if (player.cultivation) {
        document.getElementById('pillCurrentExp').textContent = formatNumber(player.cultivation.exp);
        
        const nextStage = cultivationStages[player.cultivation.stage + 1];
        if (nextStage) {
            document.getElementById('pillNextExp').textContent = formatNumber(nextStage.expRequired);
            
            const progress = Math.min(100, (player.cultivation.exp / nextStage.expRequired) * 100);
            document.getElementById('pillExpProgress').style.width = `${progress}%`;
        }
    }
    
    // 更新各道具数量
    document.getElementById('pillSoulCount').textContent = player.items['danyao1'] || 0;
    document.getElementById('pillGemCount').textContent = player.items['danyao2'] || 0;
    document.getElementById('pillPillCount').textContent = player.items['danyao3'] || 0;
    document.getElementById('pillPouchCount').textContent = player.items['danyao4'] || 0;
    document.getElementById('pillStarBillCount').textContent = player.items['danyao5'] || 0;
    
    // 更新按钮状态
    updatePillButtons();
}


// 更新按钮状态
function updatePillButtons() {
    const buttons = [
        { id: 'useSoulBtn', count: player.items['danyao1'] || 0 },
        { id: 'useGemBtn', count: player.items['danyao2'] || 0 },
        { id: 'usePillBtn', count: player.items['danyao3'] || 0 },
        { id: 'usePouchBtn', count: player.items['danyao4'] || 0 },
        { id: 'useStarBillBtn', count: player.items['danyao5'] || 0 },
        { id: 'useSoulMaxBtn', count: player.items['danyao1'] || 0 },
        { id: 'useGemMaxBtn', count: player.items['danyao2'] || 0 },
        { id: 'usePillMaxBtn', count: player.items['danyao3'] || 0 },
        { id: 'usePouchMaxBtn', count: player.items['danyao4'] || 0 },
        { id: 'useStarBillMaxBtn', count: player.items['danyao5'] || 0 }
    ];
    
    buttons.forEach(btn => {
        const element = document.getElementById(btn.id);
        if (element) {
            if (btn.count <= 0) {
                element.disabled = true;
                element.style.background = '#666';
                element.style.cursor = 'not-allowed';
                element.style.opacity = '0.5';
            } else {
                element.disabled = false;
                element.style.opacity = '1';
                // 恢复原来的渐变背景
                if (btn.id.includes('Max')) {
                    element.style.background = 'linear-gradient(45deg, #FF69B4, #C71585)';
                } else if (btn.id.includes('Soul')) {
                    element.style.background = 'linear-gradient(45deg, #4CAF50, #2E7D32)';
                } else if (btn.id.includes('Gem')) {
                    element.style.background = 'linear-gradient(45deg, #2196F3, #0D47A1)';
                } else if (btn.id.includes('Pill')) {
                    element.style.background = 'linear-gradient(45deg, #9C27B0, #6A1B9A)';
                } else if (btn.id.includes('Pouch')) {
                    element.style.background = 'linear-gradient(45deg, #FF5722, #D84315)';
                } else if (btn.id.includes('StarBill')) {
                    element.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
                }
                element.style.cursor = 'pointer';
            }
        }
    });
}

// 使用丹药
function usePill(type, amount) {
    if (!player.items) player.items = {};
    if (!player.cultivation) {
        alert('请先开启修仙系统！');
        return;
    }
    
    const config = pillConfig[type];
    if (!config) return;
    
    let count = player.items[config.itemKey] || 0;
    
    if (count <= 0) {
        alert(`❌ 没有足够的${config.name}！`);
        return;
    }
    
    let useCount = amount === 'max' ? count : Math.min(amount, count);
    
    // 计算获得经验（洞府聚灵阵加成）
    const grottoBonus = typeof getGrottoCultivationExpBonus === 'function' ? getGrottoCultivationExpBonus() : 1;
    let expGain = useCount * config.exp * grottoBonus;
    
    // 扣除道具
    player.items[config.itemKey] -= useCount;
    
    // 增加修仙经验
    player.cultivation.exp += expGain;
    
    // 显示成功信息
    let message = `✨ 使用 ${useCount} 个${config.name}，获得 ${formatNumber(expGain)} 点修仙经验！`;
    showPillNotification(message, config.color);
    
    // 更新显示
    updatePillSystemUI();
    updateCultivationUI();
    updateDisplay();
}


// 一键使用所有丹药
function useAllPills() {
    if (!player.items) player.items = {};
    if (!player.cultivation) {
        alert('请先开启修仙系统！');
        return;
    }
    
    let totalExp = 0;
    let usedItems = [];
    
    // 洞府聚灵阵加成
    const grottoBonus = typeof getGrottoCultivationExpBonus === 'function' ? getGrottoCultivationExpBonus() : 1;
    // 检查每种道具
    for (let [type, config] of Object.entries(pillConfig)) {
        let count = player.items[config.itemKey] || 0;
        if (count > 0) {
            let expGain = count * config.exp * grottoBonus;
            totalExp += expGain;
            usedItems.push(`${config.name}×${count}`);
            
            // 扣除道具
            player.items[config.itemKey] = 0;
        }
    }
    
    if (totalExp > 0) {
        // 增加修仙经验
        player.cultivation.exp += totalExp;
        
        // 显示成功信息
        let message = `✨ 一键使用: ${usedItems.join('、')}\n获得 ${formatNumber(totalExp)} 点修仙经验！`;
        showPillNotification(message, '#FF69B4');
        
        // 更新显示
        updatePillSystemUI();
        updateCultivationUI();
        updateDisplay();
    } else {
        alert('❌ 没有可使用的丹药！');
    }
}


// 显示丹药使用提示
function showPillNotification(message, color) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = `linear-gradient(145deg, ${color}40, ${color}20)`;
    notification.style.color = 'white';
    notification.style.padding = '20px';
    notification.style.borderRadius = '15px';
    notification.style.borderLeft = `5px solid ${color}`;
    notification.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '250px';
    notification.style.maxWidth = '350px';
    notification.style.transform = 'translateX(400px)';
    notification.style.transition = 'transform 0.5s ease-out';
    notification.style.fontSize = '14px';
    notification.style.lineHeight = '1.5';
    notification.style.whiteSpace = 'pre-line';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">💊</span>
            <div>
                <div style="font-weight: bold; color: ${color}; margin-bottom: 5px;">丹药使用成功</div>
                <div style="color: #FFD700;">${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 5000);
}

// 在打开修仙系统时确保丹药系统数据存在
function initCultivationSystem() {
    if (!player.cultivation) {
        player.cultivation = {
            stage: 0,
            exp: 0,
            root: null,
            bloodline: null,
            bonus: 1
        };
    }
    
    // 确保物品系统存在
    if (!player.items) {
        player.items = {};
    }
}
const trialMonsterSkills = [
    {
        name: '普通攻击',
        multiplier: 1.0,
        chance: 0.40, // 40%几率
        message: '👾 怪物普通攻击',
        color: '#aaa',
        icon: '👾'
    },
    {
        name: '重击',
        multiplier: 1.5,
        chance: 0.25, // 25%几率
        message: '💪 怪物发动重击！造成1.5倍伤害',
        color: '#FF9800',
        icon: '💪'
    },
    {
        name: '狂暴一击',
        multiplier: 2.0,
        chance: 0.15, // 15%几率
        message: '⚡ 怪物狂暴一击！造成2倍伤害',
        color: '#FF5722',
        icon: '⚡'
    },
    {
        name: '致命连击',
        multiplier: 2.5,
        chance: 0.10, // 10%几率
        message: '💥 怪物致命连击！造成2.5倍伤害',
        color: '#f44336',
        icon: '💥'
    },
    {
        name: '毁灭打击',
        multiplier: 3.0,
        chance: 0.05, // 5%几率
        message: '🌋 怪物毁灭打击！造成3倍伤害',
        color: '#9C27B0',
        icon: '🌋'
    },
    {
        name: '末日审判',
        multiplier: 4.0,
        chance: 0.03, // 3%几率
        message: '🔥 末日审判！造成5倍毁灭性伤害',
        color: '#FFD700',
        icon: '🔥'
    },
    {
        name: '时空撕裂',
        multiplier: 5.0,
        chance: 0.015, // 1.5%几率
        message: '⏰ 时空撕裂！造成5倍伤害',
        color: '#00BCD4',
        icon: '⏰'
    },
    {
        name: '混沌降临',
        multiplier: 10.0,
        chance: 0.005, // 0.5%几率
        message: '🌌 混沌降临！造成10倍毁灭打击',
        color: '#8A2BE2',
        icon: '🌌'
    }
];
let trialTowerGame = {
    currentFloor: 1,
    highestFloor: 0,
    totalChallenges: 0,
    totalWins: 0,
    
    playerHp: 0,
    playerMaxHp: 0,
    playerAtk: 0,
    playerCrit: 0,
    playerCritRate: 0.3,
    
    monsterHp: 0,
    monsterMaxHp: 0,
    monsterAtk: 0,
    
    isDefending: false,
    isInBattle: false,
   lastMonsterSkill: '',
    monsterSkillCombo: 0,
    lastComboSkill: '',
    totalDamageTaken: 0,
  defenseHealCount: 0, 
    defenseTotalHeal: 0, 
  artifactCritCount: 0,
    artifactTotalBonus: 0  
};
const trialArtifactCritConfig = {
    thresholds: [
        { maxBonus: 1.1, chance: 0.05, multiplier: 1, message: '💫 法宝共鸣！造成1倍额外伤害' },
        { maxBonus: 1.3, chance: 0.05, multiplier: 2, message: '⚡ 法宝觉醒！造成2倍暴伤' },
        { maxBonus: 1.4, chance: 0.05, multiplier: 3, message: '✨ 法宝通灵！造成3倍毁灭打击' },
        { maxBonus: 1.5, chance: 0.05, multiplier: 4, message: '🌟 法宝化形！造成4倍天道之力' },
        { maxBonus: 1.6, chance: 0.06, multiplier: 5, message: '🌪️ 法宝混沌！造成5倍洪荒之力' },
        { maxBonus: 1.8, chance: 0.07, multiplier: 6, message: '🔥 法宝焚天！造成6倍寂灭之威' },
        { maxBonus: 2.0, chance: 0.08, multiplier: 7, message: '❄️ 法宝冰封！造成7倍时空冻结' },
        { maxBonus: 2.5, chance: 0.09, multiplier: 8, message: '⚡ 法宝雷动！造成8倍天劫之力' },
        { maxBonus: 3.0, chance: 0.10, multiplier: 9, message: '🌌 法宝虚空！造成9倍混沌之怒' },
        { maxBonus: 3.5, chance: 0.11, multiplier: 10, message: '👑 法宝帝王！造成10倍君临天下' },
        { maxBonus: 4.0, chance: 0.12, multiplier: 15, message: '🐉 法宝神龙！造成15倍龙威震天' },
        { maxBonus: 4.5, chance: 0.13, multiplier: 20, message: '🌍 法宝创世！造成20倍开天辟地' },
        { maxBonus: 5.0, chance: 0.14, multiplier: 25, message: '☯️ 法宝大道！造成25倍道法自然' },
        { maxBonus: Infinity, chance: 0.15, multiplier: 30, message: '∞ 法宝永恒！造成30倍无尽轮回' }
    ],
    
    quotes: {
        1: [
            '「区区怪物，也敢放肆！」',
            '「看我的法宝神威！」',
            '「这一击，只是开胃菜！」',
            '「法宝初显，怪物受死！」'
        ],
        2: [
            '「二倍之力，破你防御！」',
            '「法宝觉醒，怪物颤栗！」',
            '「这一击，让你知道厉害！」',
            '「怪物，尝尝法宝的厉害！」'
        ],
        3: [
            '「三界震动，法宝显圣！」',
            '「怪物，还不伏诛！」',
            '「法宝通灵，诛杀邪祟！」',
            '「这一击，送你归西！」'
        ],
        4: [
            '「四海之内，法宝为尊！」',
            '「怪物，你的死期到了！」',
            '「四倍暴击，荡平怪物！」',
            '「法宝化形，毁天灭地！」'
        ],
        5: [
            '「五雷轰顶，法宝天威！」',
            '「怪物，还不束手就擒！」',
            '「五倍之力，横扫千军！」',
            '「法宝混沌，破碎虚空！」'
        ],
        6: [
            '「六道轮回，法宝超度！」',
            '「怪物，让你魂飞魄散！」',
            '「六倍暴击，诛杀怪物！」',
            '「法宝焚天，烧尽邪魔！」'
        ],
        7: [
            '「七星伴月，法宝无敌！」',
            '「怪物，这一击送你上路！」',
            '「七倍之力，天地变色！」',
            '「法宝冰封，冻结时空！」'
        ],
        8: [
            '「八方来朝，法宝称尊！」',
            '「怪物，受死吧！」',
            '「八倍暴击，毁天灭地！」',
            '「法宝雷动，天劫降临！」'
        ],
        9: [
            '「九霄云外，法宝纵横！」',
            '「怪物，让你永世不得超生！」',
            '「九倍之力，破碎虚空！」',
            '「法宝虚空，吞噬一切！」'
        ],
        10: [
            '「十方俱灭，法宝无敌！」',
            '「怪物，见识真正的力量！」',
            '「十倍暴击，君临天下！」',
            '「法宝帝王，统御万界！」'
        ],
        15: [
            '「十五倍龙威，怪物颤栗！」',
            '「神龙降世，诛杀怪物！」',
            '「法宝神龙，毁天灭地！」',
            '「龙威震天，怪物伏诛！」'
        ],
        20: [
            '「二十倍创世，开天辟地！」',
            '「法宝创世，重演混沌！」',
            '「创世之力，怪物化为虚无！」',
            '「开天辟地，怪物湮灭！」'
        ],
        25: [
            '「二十五倍大道，道法自然！」',
            '「大道至简，一击必杀！」',
            '「法宝大道，怪物超度！」',
            '「道法自然，怪物归西！」'
        ],
        30: [
            '「三十倍永恒，无尽轮回！」',
            '「永恒法宝，超越时空！」',
            '「无尽轮回，怪物永世不得超生！」',
            '「法宝永恒，与天地同寿！」'
        ]
    },
    
    specialQuotes: [
        { chance: 0.001, quote: '👑 「吾之法宝，可破苍穹！」' },
        { chance: 0.001, quote: '🌌 「这一击，蕴含宇宙真理！」' },
        { chance: 0.001, quote: '⚡ 「天大地大，法宝最大！」' },
        { chance: 0.001, quote: '🔥 「怪物，不过如此！」' },
        { chance: 0.001, quote: '❄️ 「法宝一出，谁与争锋！」' },
        { chance: 0.001, quote: '💫 「让你见识真正的法宝之力！」' }
    ]
};
function getTrialEquippedArtifactBonus() {
    if (!player.magicTools || !player.magicTools.equipped) {
        return 1.0;
    }
    
    const tool = magicToolConfig.tools.find(t => t.id === player.magicTools.equipped);
    return tool ? tool.bonus : 1.0;
}
function triggerTrialArtifactCrit() {
    const artifactBonus = getTrialEquippedArtifactBonus();
    
    // 找到对应的加成区间
    let config = trialArtifactCritConfig.thresholds.find(t => artifactBonus <= t.maxBonus);
    if (!config) {
        config = trialArtifactCritConfig.thresholds[trialArtifactCritConfig.thresholds.length - 1];
    }
    
    // 5%几率触发
    if (Math.random() < config.chance) {
        // 随机选择霸气语录
        let quotes = trialArtifactCritConfig.quotes[config.multiplier] || trialArtifactCritConfig.quotes[1];
        let quote = quotes[Math.floor(Math.random() * quotes.length)];
        
        // 极低概率触发特殊台词
        for (let special of trialArtifactCritConfig.specialQuotes) {
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

function getMonsterSkillsForFloor(floor) {
    let skills = JSON.parse(JSON.stringify(trialMonsterSkills));
    
    // 根据层数调整技能几率
    if (floor >= 60) {
        
        skills[4].chance = 0.08; // 毁灭打击 8%
        skills[5].chance = 0.05; // 末日审判 5%
    }
    if (floor >= 120) {
        skills[5].chance = 0.07; // 末日审判 7%
        skills[6].chance = 0.03; // 时空撕裂 3%
    }
    if (floor >= 200) {
        skills[6].chance = 0.05; // 时空撕裂 5%
        skills[7].chance = 0.02; // 混沌降临 2%
    }
    if (floor >= 300) {
        skills[7].chance = 0.05; // 混沌降临 5%
    }
    if (floor >= 400) {        
        skills.forEach(skill => {
            if (skill.multiplier >= 3.0) {
                skill.chance = Math.min(skill.chance * 1.5, 0.15);
            }
        });
    }
    
    return skills;
}
// 初始化试练塔系统
function initTrialTower() {
    if (!player.trialTower) {
        player.trialTower = {
            currentFloor: 1,
            highestFloor: 0,
            totalChallenges: 0,
            totalWins: 0
        };
    }
    
    // 同步玩家数据
    trialTowerGame.currentFloor = player.trialTower.currentFloor || 1;
    trialTowerGame.highestFloor = player.trialTower.highestFloor || 0;
    trialTowerGame.totalChallenges = player.trialTower.totalChallenges || 0;
    trialTowerGame.totalWins = player.trialTower.totalWins || 0;
}

// 计算怪物属性（每层提升）
function calculateMonsterStats(floor) {
    // 基础属性
    let baseHp = 100000; // 10万基础血量
    let baseAtk = 5000;   // 5000基础攻击
    
    // 每层提升：血量增加10%，攻击增加10%
    let hpMultiplier = Math.pow(1.1, floor - 1);
    let atkMultiplier = Math.pow(1.05, floor - 1);
    
    return {
        hp: Math.floor(baseHp * hpMultiplier),
        atk: Math.floor(baseAtk * atkMultiplier)
    };
}

// 获取怪物名称
function getMonsterName(floor) {
    const names = [
        '试练守卫', '暗影战士', '火焰魔像', '冰霜巨人', '雷霆使者',
        '地狱守卫', '天使战士', '恶魔领主', '混沌魔龙', '虚空吞噬者',
        '时空主宰', '命运编织者', '永恒守护者', '创世神使', '毁灭使者'
    ];
    
    if (floor <= 15) {
        return names[floor - 1] || `试练怪物·${floor}层`;
    } else {
        return `试练尊者·${floor}层`;
    }
}

// 打开试练塔
function openTrialTower() {
     if (player.cultivation.stage < 10) {
        alert("需要达到修仙10级才能开启试练塔！");
        return;
    }
    initTrialTower();
    toggleAutoBuyShopb();
    // 计算玩家属性
    updateTrialPlayerStats();
    
    // 重置当前怪物
    resetTrialMonster();
    
    // 设置战斗状态
    trialTowerGame.isInBattle = true;
    trialTowerGame.isDefending = false;
    
    // 重置技能相关
    trialTowerGame.monsterSkillCombo = 0;
    trialTowerGame.lastComboSkill = '';
    trialTowerGame.lastMonsterSkill = '';
    
    // 重置防御回复统计
    trialTowerGame.defenseHealCount = 0;
    trialTowerGame.defenseTotalHeal = 0;
    
    // 重置法宝暴伤统计
    trialTowerGame.artifactCritCount = 0;
    trialTowerGame.artifactTotalBonus = 0;
    
    // 显示UI
    document.getElementById('trialTowerOverlay').style.display = 'block';
    document.getElementById('trialTowerUI').style.display = 'block';
    
    // 启用攻击防御按钮
    document.getElementById('trialAttackBtn').disabled = false;
    document.getElementById('trialDefendBtn').disabled = false;
    document.getElementById('trialRestartBtn').disabled = false;
    
    // 更新显示（会同时更新奖励预览）
    updateTrialTowerUI();
    
    // 清空并添加欢迎日志
    clearTrialBattleLog();
    addTrialBattleLog('🗼 欢迎来到无限试练塔！', 'success');
    addTrialBattleLog(`📊 当前第 ${trialTowerGame.currentFloor} 层`, 'info');
    addTrialBattleLog(`👾 怪物: ${getMonsterName(trialTowerGame.currentFloor)}`, 'warning');
    addTrialBattleLog('🛡️ 防御有20%几率回复25%生命值', 'info', '#4CAF50');
    
    // 检查是否有法宝
    const artifactBonus = getTrialEquippedArtifactBonus();
    if (artifactBonus > 1.0) {
        const config = trialArtifactCritConfig.thresholds.find(t => artifactBonus <= t.maxBonus) || trialArtifactCritConfig.thresholds[0];
        addTrialBattleLog(`🌟 法宝暴伤: ${(config.chance * 100).toFixed(0)}%几率触发${config.multiplier}倍伤害`, 'info', '#FF6B6B');
    }
    
    // 显示怪物技能信息
    const skills = getMonsterSkillsForFloor(trialTowerGame.currentFloor);
    addTrialBattleLog('════════ 怪物技能 ════════', 'info', '#9C27B0');
    skills.forEach(skill => {
        if (skill.chance > 0.01) {
            addTrialBattleLog(`${skill.icon} ${skill.name}: ${(skill.chance * 100).toFixed(1)}% | ${skill.multiplier}倍`, 'info', skill.color);
        }
    });
    addTrialBattleLog('════════════════════════', 'info', '#9C27B0');
    
    // 显示当前层奖励信息
    let currentReward = getRewardForFloor(trialTowerGame.currentFloor);
    if (currentReward.amount > 0) {
        addTrialBattleLog(`🎁 当前层奖励: ${currentReward.name}×${currentReward.amount}`, 'success');
    }
}
function updateRewardDescriptions() {
    let floor1 = parseInt(document.getElementById('trialNextRewardFloor').innerHTML);
    let floor2 = parseInt(document.getElementById('trialNextRewardFloor2').innerHTML);
    
    let reward1 = getRewardForFloor(floor1);
    let reward2 = getRewardForFloor(floor2);
    
    document.getElementById('trialNextRewardDesc1').innerHTML = reward1.amount > 0 ? `${reward1.name}×${reward1.amount}` : '无奖励';
    document.getElementById('trialNextRewardDesc2').innerHTML = reward2.amount > 0 ? `${reward2.name}×${reward2.amount}` : '无奖励';
}
// 关闭试练塔
function closeTrialTower() {
    document.getElementById('trialTowerOverlay').style.display = 'none';
    document.getElementById('trialTowerUI').style.display = 'none';
}

// 计算玩家属性，宗门藏经阁传承加成修仙副本属性
function updateTrialPlayerStats() {
    const sectLib = typeof getSectLibraryBonus === 'function' ? getSectLibraryBonus() : {};
    const libHealth = 1 + (sectLib.dungeonHealth || 0);
    const libAttack = 1 + (sectLib.dungeonAttack || 0);
    const libCritRate = sectLib.dungeonCritRate || 0;
    const libCritDmg = 1 + (sectLib.dungeonCritDamage || 0);
    if (!player.cultivation || !player.cultivation.root || !player.cultivation.bloodline) {
        trialTowerGame.playerMaxHp = player.reincarnationCount * 10000 * libHealth;
        trialTowerGame.playerHp = trialTowerGame.playerMaxHp;
        trialTowerGame.playerAtk = player.reincarnationCount * 1000 * libAttack;
        trialTowerGame.playerCritRate = 0.3 + libCritRate;
        trialTowerGame.playerCrit = 1.5 * libCritDmg;
    } else {
        // 生命值 = (转生数 * 10000) * 灵根加成 * 血脉加成 * 藏经阁
        trialTowerGame.playerMaxHp = player.reincarnationCount * 10000 * 
                                    (player.cultivation.root.bonus || 1) * 
                                    (player.cultivation.bloodline.bonus || 1) * (1+player.fiveElements.metal.level * 0.2) * libHealth;
        trialTowerGame.playerHp = trialTowerGame.playerMaxHp;
        
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
        
        trialTowerGame.playerAtk = stageMultiplier * toolBonus * 1000 * (1+player.fiveElements.wood.level * 0.05) * (1+player.fiveElements.earth.level * 0.05) * libAttack;
        
        // 爆伤 = 当前境界等级 * 藏经阁
        trialTowerGame.playerCrit = ((player.cultivation.stage || 0) * 0.5 * (1+player.fiveElements.water.level * 0.05) * (1+player.fiveElements.fire.level * 0.05) + 1.5) * libCritDmg;
        trialTowerGame.playerCritRate = 0.3 + libCritRate;
    }
}

// 重置当前层怪物
function resetTrialMonster() {
    const stats = calculateMonsterStats(trialTowerGame.currentFloor);
    trialTowerGame.monsterMaxHp = stats.hp;
    trialTowerGame.monsterHp = stats.hp;
    trialTowerGame.monsterAtk = stats.atk;
}

// 更新试练塔UI
function updateTrialTowerUI() {
    // 更新玩家信息
    document.getElementById('trialPlayerHp').innerHTML = formatNumber(trialTowerGame.playerMaxHp);
    document.getElementById('trialPlayerAtk').innerHTML = formatNumber(trialTowerGame.playerAtk);
    document.getElementById('trialPlayerCrit').innerHTML = ((trialTowerGame.playerCrit - 1) * 100).toFixed(0) + '%';
    
    // 更新怪物信息
    document.getElementById('trialMonsterName').innerHTML = getMonsterName(trialTowerGame.currentFloor);
    document.getElementById('trialMonsterHp').innerHTML = formatNumber(trialTowerGame.monsterMaxHp);
    document.getElementById('trialMonsterAtk').innerHTML = formatNumber(trialTowerGame.monsterAtk);
    document.getElementById('trialMonsterHpText').innerHTML = `${formatNumber(trialTowerGame.monsterHp)} / ${formatNumber(trialTowerGame.monsterMaxHp)}`;
    
    // 更新血条
    let hpPercent = (Number(trialTowerGame.monsterHp) / Number(trialTowerGame.monsterMaxHp)) * 100;
    document.getElementById('trialMonsterHpBar').style.width = hpPercent + '%';
    
    // 更新战斗中的玩家血条
    document.getElementById('trialBattlePlayerHp').innerHTML = `${formatNumber(trialTowerGame.playerHp)} / ${formatNumber(trialTowerGame.playerMaxHp)}`;
    let playerHpPercent = (Number(trialTowerGame.playerHp) / Number(trialTowerGame.playerMaxHp)) * 100;
    document.getElementById('trialBattlePlayerHpBar').style.width = playerHpPercent + '%';
    
    // 更新层数信息
    document.getElementById('trialCurrentFloor').innerHTML = trialTowerGame.currentFloor;
    document.getElementById('trialFloorDisplay').innerHTML = trialTowerGame.currentFloor;
    document.getElementById('trialHighestFloor').innerHTML = trialTowerGame.highestFloor;
    document.getElementById('trialTotalChallenges').innerHTML = trialTowerGame.totalChallenges;
    document.getElementById('trialTotalWins').innerHTML = trialTowerGame.totalWins;
    
   updateTrialRewardPreview();
    let nextReward = Math.ceil(trialTowerGame.currentFloor / 10) * 10;
    document.getElementById('trialNextRewardFloor').innerHTML = nextReward;
    document.getElementById('trialNextRewardFloor2').innerHTML = nextReward + 10;
  let skillInfoDiv = document.getElementById('trialMonsterSkillInfo');
    if (!skillInfoDiv) {
        const monsterInfoDiv = document.getElementById('trialMonsterInfo');
        if (monsterInfoDiv) {
            skillInfoDiv = document.createElement('div');
            skillInfoDiv.id = 'trialMonsterSkillInfo';
            skillInfoDiv.style.marginTop = '15px';
            skillInfoDiv.style.padding = '10px';
            skillInfoDiv.style.background = 'rgba(0,0,0,0.3)';
            skillInfoDiv.style.borderRadius = '10px';
            skillInfoDiv.style.border = '1px solid #9C27B0';
            monsterInfoDiv.appendChild(skillInfoDiv);
        }
    }
    if (skillInfoDiv) {
        const skills = getMonsterSkillsForFloor(trialTowerGame.currentFloor);
        const lastSkill = trialTowerGame.lastMonsterSkill || '无';
        const combo = trialTowerGame.monsterSkillCombo || 0;
        
        // 获取最高倍率技能
        const maxSkill = skills.reduce((max, skill) => skill.multiplier > max.multiplier ? skill : max, skills[0]);
        
        skillInfoDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="color: #9C27B0; font-size: 14px; font-weight: bold;">🎯 怪物技能</span>
                <span style="color: #aaa; font-size: 12px;">连击: ${combo}x</span>
            </div>
            <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 8px;">
                <div style="background: rgba(156,39,176,0.2); padding: 3px 8px; border-radius: 12px; font-size: 11px; color: #FFD700;">
                    上次: ${lastSkill}
                </div>
                <div style="background: rgba(244,67,54,0.2); padding: 3px 8px; border-radius: 12px; font-size: 11px; color: #f44336;">
                    最高: ${maxSkill.name} (${maxSkill.multiplier}x)
                </div>
            </div>
            <div style="font-size: 11px; color: #aaa; margin-top: 5px;">
                技能几率: ${skills.map(s => `${s.icon} ${(s.chance * 100).toFixed(0)}%`).join(' ')}
            </div>
        `;
    }
 let defenseStatsDiv = document.getElementById('trialDefenseStats');
    if (!defenseStatsDiv) {
        const playerInfoDiv = document.querySelector('#trialTowerUI [style*="background: rgba(156,39,176,0.1)"]');
        if (playerInfoDiv) {
            defenseStatsDiv = document.createElement('div');
            defenseStatsDiv.id = 'trialDefenseStats';
            defenseStatsDiv.style.marginTop = '15px';
            defenseStatsDiv.style.padding = '10px';
            defenseStatsDiv.style.background = 'rgba(76,175,80,0.1)';
            defenseStatsDiv.style.borderRadius = '10px';
            defenseStatsDiv.style.border = '1px solid #4CAF50';
            playerInfoDiv.appendChild(defenseStatsDiv);
        }
    }
    
    if (defenseStatsDiv) {
        defenseStatsDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                <span style="font-size: 18px;">🛡️</span>
                <span style="color: #4CAF50; font-weight: bold;">防御回复效果</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
                <div>
                    <div style="color: #aaa;">触发几率</div>
                    <div style="color: #FFD700; font-weight: bold;">20%</div>
                </div>
                <div>
                    <div style="color: #aaa;">回复量</div>
                    <div style="color: #4CAF50; font-weight: bold;">15%</div>
                </div>
                <div>
                    <div style="color: #aaa;">触发次数</div>
                    <div style="color: #FFD700; font-weight: bold;">${trialTowerGame.defenseHealCount}</div>
                </div>
                <div>
                    <div style="color: #aaa;">总回复量</div>
                    <div style="color: #4CAF50; font-weight: bold;">${formatNumber(trialTowerGame.defenseTotalHeal)}</div>
                </div>
            </div>
        `;
    }
 let artifactStatsDiv = document.getElementById('trialArtifactStats');
    if (!artifactStatsDiv) {
        const playerInfoDiv = document.querySelector('#trialTowerUI [style*="background: rgba(156,39,176,0.1)"]');
        if (playerInfoDiv) {
            artifactStatsDiv = document.createElement('div');
            artifactStatsDiv.id = 'trialArtifactStats';
            artifactStatsDiv.style.marginTop = '15px';
            artifactStatsDiv.style.padding = '10px';
            artifactStatsDiv.style.background = 'rgba(255,107,107,0.1)';
            artifactStatsDiv.style.borderRadius = '10px';
            artifactStatsDiv.style.border = '1px solid #FF6B6B';
            playerInfoDiv.appendChild(artifactStatsDiv);
        }
    }
    
    if (artifactStatsDiv) {
        const artifactBonus = getTrialEquippedArtifactBonus();
        const config = trialArtifactCritConfig.thresholds.find(t => artifactBonus <= t.maxBonus) || trialArtifactCritConfig.thresholds[0];
        
        artifactStatsDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                <span style="font-size: 18px;">🌟</span>
                <span style="color: #FF6B6B; font-weight: bold;">法宝暴伤效果</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
                <div>
                    <div style="color: #aaa;">当前法宝加成</div>
                    <div style="color: #FFD700; font-weight: bold;">${artifactBonus.toFixed(2)}倍</div>
                </div>
                <div>
                    <div style="color: #aaa;">触发倍率</div>
                    <div style="color: #4CAF50; font-weight: bold;">${config.multiplier}倍</div>
                </div>
                <div>
                    <div style="color: #aaa;">触发几率</div>
                    <div style="color: #FFD700; font-weight: bold;">${(config.chance * 100).toFixed(0)}%</div>
                </div>
                <div>
                    <div style="color: #aaa;">触发次数</div>
                    <div style="color: #FF6B6B; font-weight: bold;">${trialTowerGame.artifactCritCount}</div>
                </div>
            </div>
        `;
    }
}
function updateTrialRewardPreview() {
    let currentFloor = trialTowerGame.currentFloor;
    
    // 计算下一个10层奖励
    let nextReward10 = Math.ceil(currentFloor / 10) * 10;
    let nextReward20 = nextReward10 + 10;
    
    // 根据层数显示不同的奖励内容
    let reward10 = getRewardForFloor(nextReward10);
    let reward20 = getRewardForFloor(nextReward20);
    
    // 更新显示
    document.getElementById('trialNextRewardFloor').innerHTML = nextReward10;
    document.getElementById('trialNextRewardFloor2').innerHTML = nextReward20;
    document.getElementById('trialNextRewardDesc1').innerHTML = reward10.amount > 0 ? `${reward10.name}×${reward10.amount}` : '无奖励';
    document.getElementById('trialNextRewardDesc2').innerHTML = reward20.amount > 0 ? `${reward20.name}×${reward20.amount}` : '无奖励';
    
    // 更新详细奖励预览
    let detailDiv = document.getElementById('trialRewardDetail');
    if (detailDiv) {
        let detailHtml = '<div style="font-size: 13px; color: #FFD700; margin-bottom: 8px;">📋 详细奖励预览</div>';
        
        // 显示最近3个10层奖励
        for (let i = 1; i <= 50; i++) {
            let floor = i * 10;
            if (floor >= currentFloor - 10 && floor <= currentFloor + 20) {
                let reward = getRewardForFloor(floor);
                let status = floor < currentFloor ? '✅' : (floor === currentFloor ? '🎯 当前' : '🔜');
                let color = floor <= currentFloor ? '#4CAF50' : '#FFD700';
                
                if (reward.amount > 0) {
                    detailHtml += `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding: 5px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                            <div>
                                <span style="color: ${color};">第${floor}层</span>
                                <span style="color: #aaa; margin-left: 10px;">${reward.name}×${reward.amount}</span>
                            </div>
                            <span style="color: ${color};">${status}</span>
                        </div>
                    `;
                }
            }
        }
        
        detailDiv.innerHTML = detailHtml;
    }
}
function getRewardForFloor(floor) {
    let reward = { name: '', amount: 0 };
    
    if (floor === 10) {
        reward = { name: '伴侣钥匙', amount: 10, itemKey: 'companionKey' };
    } else if (floor === 20) {
        reward = { name: '鱼饵', amount: 100, itemKey: 'baitCount' };
    } else if (floor === 30) {
        reward = { name: '宇宙晶体发票', amount: 1000, itemKey: 'yuzhou3' };
    } else if (floor === 40) {
        reward = { name: '神器碎片发票', amount: 200, itemKey: 'yuzhou4' };
    } else if (floor === 50) {
        reward = { name: '普通伴侣灵魂', amount: 1000, itemKey: 'banlv1' };
    } else if (floor === 60) {
        reward = { name: '蕴灵筑基丹', amount: 1000, itemKey: 'danyao1' };
    } else if (floor === 70) {
        reward = { name: '宝藏金币', amount: 10, itemKey: 'primaryGemq' };
    } else if (floor === 80) {
        reward = { name: '灵根检测器', amount: 100, itemKey: 'rootDetector' };
    } else if (floor === 90) {
        reward = { name: '血脉检测剂', amount: 100, itemKey: 'bloodlineDetector' };
    } else if (floor === 100) {
        reward = { name: '进阶神石', amount: 20, itemKey: 'advanceStone' };
    } else if (floor === 110) {
        reward = { name: '神器碎片发票', amount: 1000, itemKey: 'yuzhou4' };
    } else if (floor === 120) {
        reward = { name: '黑龙王翅膀', amount: 100, itemKey: 'chiban1' };
    } else if (floor === 130) {
        reward = { name: '远古圣兽精魄', amount: 100, itemKey: 'zuoqi1' };
    } else if (floor === 140) {
        reward = { name: '宝藏金币', amount: 20, itemKey: 'primaryGemq' };
    } else if (floor === 150) {
        reward = { name: '秘法符文', amount: 100, itemKey: 'fuwen1' };
    } else if (floor === 160) {
        reward = { name: '神兽蛋', amount: 100, itemKey: 'shenshou1' };
    } else if (floor === 170) {
        reward = { name: 'VIP能力值', amount: 50000, itemKey: 'vipPower' };
    } else if (floor === 180) {
        reward = { name: '普通伴侣灵魂', amount: 5000, itemKey: 'banlv1' };
    } else if (floor === 190) {
        reward = { name: '凝元固窍丹', amount: 10000, itemKey: 'danyao2' };
    } else if (floor === 200) {
        reward = { name: '灵根检测器', amount: 200, itemKey: 'rootDetector' };
    } else if (floor === 210) {
        reward = { name: '血脉检测剂', amount: 200, itemKey: 'bloodlineDetector' };
    } else if (floor === 220) {
        reward = { name: '进阶神石', amount: 30, itemKey: 'advanceStone' };
    } else if (floor === 230) {
        reward = { name: '宝藏金币', amount: 50, itemKey: 'primaryGemq' };
    } else if (floor === 240) {
        reward = { name: '鱼饵', amount: 1000, itemKey: 'baitCount' };
    } else if (floor === 250) {
        reward = { name: '宇宙晶体发票', amount: 10000, itemKey: 'yuzhou3' };
    } else if (floor === 260) {
        reward = { name: '神器碎片发票', amount: 2000, itemKey: 'yuzhou4' };
    } else if (floor === 270) {
        reward = { name: '普通伴侣灵魂', amount: 10000, itemKey: 'banlv1' };
    } else if (floor === 280) {
        reward = { name: '黑龙王翅膀', amount: 200, itemKey: 'chiban1' };
    } else if (floor === 290) {
        reward = { name: '远古圣兽精魄', amount: 200, itemKey: 'zuoqi1' };
    } else if (floor === 300) {
        reward = { name: '神兽蛋', amount: 200, itemKey: 'shenshou1' };
    } else if (floor === 310) {
        reward = { name: '秘法符文', amount: 200, itemKey: 'fuwen1' };
    } else if (floor === 320) {
        reward = { name: '宝藏金币', amount: 100, itemKey: 'primaryGemq' };
    } else if (floor === 330) {
        reward = { name: '灵根检测器', amount: 300, itemKey: 'rootDetector' };
    } else if (floor === 340) {
        reward = { name: '血脉检测剂', amount: 300, itemKey: 'bloodlineDetector' };
    } else if (floor === 350) {
        reward = { name: '进阶神石', amount: 50, itemKey: 'advanceStone' };
    } else if (floor === 360) {
        reward = { name: '渡厄金还丹', amount: 10000, itemKey: 'danyao3' };
    } else if (floor === 370) {
        reward = { name: '副本令牌', amount: 50, itemKey: 'fuben1' };
    } else if (floor === 380) {
        reward = { name: '黑龙王翅膀', amount: 300, itemKey: 'chiban1' };
    } else if (floor === 390) {
        reward = { name: '远古圣兽精魄', amount: 300, itemKey: 'zuoqi1' };
    } else if (floor === 400) {
        reward = { name: '神兽蛋', amount: 300, itemKey: 'shenshou1' };
    } else if (floor === 410) {
        reward = { name: '秘法符文', amount: 300, itemKey: 'fuwen1' };
    } else if (floor === 420) {
        reward = { name: '宝藏金币', amount: 100, itemKey: 'primaryGemq' };
    } else if (floor === 430) {
        reward = { name: '普通伴侣灵魂', amount: 20000, itemKey: 'banlv1' };
    } else if (floor === 440) {
        reward = { name: '宇宙晶体发票', amount: 100000, itemKey: 'yuzhou3' };
    } else if (floor === 450) {
        reward = { name: '神器碎片发票', amount: 10000, itemKey: 'yuzhou4' };
    } else if (floor === 460) {
        reward = { name: '灵根检测器', amount: 400, itemKey: 'rootDetector' };
    } else if (floor === 470) {
        reward = { name: '血脉检测剂', amount: 400, itemKey: 'bloodlineDetector' };
    } else if (floor === 480) {
        reward = { name: '宝藏金币', amount: 200, itemKey: 'primaryGemq' };
    } else if (floor === 490) {
        reward = { name: '进阶神石', amount: 100, itemKey: 'advanceStone' };
    } else if (floor === 500) {
        reward = { name: '九转轮回丹', amount: 10000, itemKey: 'danyao4' };
    } else if (floor % 10 === 0) {
        // 其他10的倍数层给递增奖励
        let multiplier = Math.floor(floor / 10);
        reward = { name: '蕴灵筑基丹', amount: 10 * multiplier, itemKey: 'danyao1' };
    }
    
    return reward;
}
function resetTrialTowerState() {
    trialTowerGame.playerHp = trialTowerGame.playerMaxHp;
    trialTowerGame.isDefending = false;
    trialTowerGame.monsterSkillCombo = 0;
    trialTowerGame.lastComboSkill = '';
    trialTowerGame.lastMonsterSkill = '';
    trialTowerGame.defenseHealCount = 0;
    trialTowerGame.defenseTotalHeal = 0;
    trialTowerGame.artifactCritCount = 0;
    trialTowerGame.artifactTotalBonus = 0;
}
// 攻击怪物
function trialTowerAttack() {
    if (!trialTowerGame.isInBattle) {
        addTrialBattleLog('❌ 战斗已结束，请重新挑战', 'error');
        return;
    }
    
    if (bLteZero(trialTowerGame.playerHp)) {
        addTrialBattleLog('💀 你已经死亡，请重新挑战', 'error');
        return;
    }
    
    // 计算玩家基础伤害
    let damage = trialTowerGame.playerAtk;
    let isCrit = Math.random() < trialTowerGame.playerCritRate;
    let critMultiplier = 1;
    let artifactEffect = null;
    
    // 暴击判定
    if (isCrit) {
        critMultiplier = trialTowerGame.playerCrit;
        addTrialBattleLog(`⚡ 基础暴击！造成 ${(critMultiplier * 100 - 100).toFixed(0)}% 伤害`, 'crit');
    }
    
    // 触发法宝暴伤效果（5%几率）
    artifactEffect = triggerTrialArtifactCrit();
    
    if (artifactEffect.triggered) {
        // 应用法宝暴伤倍率
        let totalMultiplier = critMultiplier * artifactEffect.multiplier;
        damage = Math.floor(damage * totalMultiplier);
        
        // 霸气语录显示
        addTrialBattleLog(`🌟 ${artifactEffect.quote}`, 'skill', '#FFD700');
        addTrialBattleLog(`💫 ${artifactEffect.message} (${artifactEffect.multiplier}倍)`, 'artifact', '#FF6B6B');
        addTrialBattleLog(`⚔️ 总伤害倍率: ${critMultiplier.toFixed(1)} × ${artifactEffect.multiplier} = ${totalMultiplier.toFixed(1)}倍`, 'info', '#4CAF50');
        
        // 统计
        trialTowerGame.artifactCritCount++;
        trialTowerGame.artifactTotalBonus += artifactEffect.multiplier;
    } else {
        // 只有基础暴击
        damage = Math.floor(damage * critMultiplier);
    }
    
    // 显示最终伤害
    if (artifactEffect.triggered) {
        addTrialBattleLog(`💥 法宝神威！造成 ${formatSci(damage)} 点伤害！`, 'crit');
    } else if (isCrit) {
        addTrialBattleLog(`⚔️ 暴击造成 ${formatSci(damage)} 点伤害`, 'crit');
    } else {
        addTrialBattleLog(`⚔️ 造成 ${formatSci(damage)} 点伤害`, 'normal');
    }
    
    // 减少怪物血量
    trialTowerGame.monsterHp = bSub(trialTowerGame.monsterHp, damage);
    
    // 检查怪物是否死亡
    if (bLteZero(trialTowerGame.monsterHp)) {
        handleTrialMonsterDeath();
    } else {
        // 怪物反击
        trialTowerCounterAttack();
    }
    
    updateTrialTowerUI();
}

// 防御
function trialTowerDefend() {
    if (!trialTowerGame.isInBattle) {
        addTrialBattleLog('❌ 战斗已结束，请重新挑战', 'error');
        return;
    }
    
    if (bLteZero(trialTowerGame.playerHp)) {
        addTrialBattleLog('💀 你已经死亡，请重新挑战', 'error');
        return;
    }
    
    // 进入防御状态
    trialTowerGame.isDefending = true;
    addTrialBattleLog('🛡️ 进入防御状态，受到的伤害减半', 'defend');
    
    // 20%几率触发回复效果
    if (Math.random() < 0.2) {
        let healAmount = Math.floor(trialTowerGame.playerMaxHp * 0.15);
        let oldHp = trialTowerGame.playerHp;
        trialTowerGame.playerHp = cmpBigSci(bAdd(trialTowerGame.playerHp, healAmount), trialTowerGame.playerMaxHp) > 0 ? trialTowerGame.playerMaxHp : bAdd(trialTowerGame.playerHp, healAmount);
        let actualHeal = Number(trialTowerGame.playerHp) - Number(oldHp);
        
        // 记录统计
        trialTowerGame.defenseHealCount++;
        trialTowerGame.defenseTotalHeal += actualHeal;
        
        // 显示回复效果
        addTrialBattleLog(`✨ 防御触发回复效果！恢复15%生命值 (+${formatNumber(actualHeal)})`, 'heal');
        addTrialBattleLog(`❤️ 当前生命值: ${formatNumber(trialTowerGame.playerHp)}/${formatNumber(trialTowerGame.playerMaxHp)}`, 'heal');
        
        // 添加特效提示
        showDefenseHealEffect(actualHeal);
    }
    
    // 怪物反击（带技能，但防御减伤）
    trialTowerCounterAttack(true);
    
    updateTrialTowerUI();
}
function showDefenseHealEffect(healAmount) {
    // 创建浮动文字效果
    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.top = '50%';
    effect.style.left = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.color = '#4CAF50';
    effect.style.fontSize = '48px';
    effect.style.fontWeight = 'bold';
    effect.style.textShadow = '0 0 20px #4CAF50';
    effect.style.zIndex = '10000';
    effect.style.animation = 'healFloat 1.5s ease-out';
    effect.style.pointerEvents = 'none';
    effect.innerHTML = `❤️ +${formatNumber(healAmount)}`;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 1500);
}
// 怪物反击
function trialTowerCounterAttack(isDefending = false) {
    if (bLteZero(trialTowerGame.monsterHp)) return;
    
    // 获取当前层数的技能配置
    const skills = getMonsterSkillsForFloor(trialTowerGame.currentFloor);
    
    // 随机选择技能
    const rand = Math.random();
    let cumulativeChance = 0;
    let selectedSkill = skills[0]; // 默认普通攻击
    
    for (const skill of skills) {
        cumulativeChance += skill.chance;
        if (rand < cumulativeChance) {
            selectedSkill = skill;
            break;
        }
    }
    
    // 计算伤害（基础攻击 × 技能倍率）
    let damage = Math.floor(trialTowerGame.monsterAtk * selectedSkill.multiplier);
    
    // 连击系统 - 连续使用相同技能增加伤害
    if (trialTowerGame.lastComboSkill === selectedSkill.name) {
        trialTowerGame.monsterSkillCombo++;
        let comboBonus = 1 + (trialTowerGame.monsterSkillCombo * 0.1); // 每连击一次增加10%伤害
        damage = Math.floor(damage * comboBonus);
    } else {
        trialTowerGame.lastComboSkill = selectedSkill.name;
        trialTowerGame.monsterSkillCombo = 1;
    }
    
    // 记录本次技能
    trialTowerGame.lastMonsterSkill = selectedSkill.name;
    
    // 防御减伤
    if (isDefending || trialTowerGame.isDefending) {
        damage = Math.floor(damage / 2);
        trialTowerGame.isDefending = false;
        addTrialBattleLog(`🛡️ 防御成功！`, 'defend');
    }
    
    // 显示技能信息
    let skillMessage = selectedSkill.message;
    if (trialTowerGame.monsterSkillCombo > 1) {
        skillMessage += ` 🔥 连击x${trialTowerGame.monsterSkillCombo}！`;
    }
    addTrialBattleLog(`${selectedSkill.icon} ${skillMessage}`, 'skill', selectedSkill.color);
    addTrialBattleLog(`💢 受到 ${formatNumber(damage)} 点伤害`, 'damage');
    
    // 减少玩家血量
    trialTowerGame.playerHp = bSub(trialTowerGame.playerHp, damage);
    trialTowerGame.totalDamageTaken += damage;
    
    // 检查玩家是否死亡
    if (bLteZero(trialTowerGame.playerHp)) {
        trialTowerGame.playerHp = 0;
        addTrialBattleLog('💀 你被击败了...', 'error');
        handleTrialPlayerDeath();
    }
}


// 处理怪物死亡
function handleTrialMonsterDeath() {
    trialTowerGame.totalWins++;
    trialTowerGame.totalChallenges++;
    
    // 更新最高层数
    if (trialTowerGame.currentFloor > trialTowerGame.highestFloor) {
        trialTowerGame.highestFloor = trialTowerGame.currentFloor;
    }
    
    // 显示击败信息
    addTrialBattleLog(`🎉 恭喜！击败第 ${trialTowerGame.currentFloor} 层怪物！`, 'success');
    
    // 根据层数显示特殊信息
    if (trialTowerGame.currentFloor % 10 === 0) {
        addTrialBattleLog(`🌟 达到第 ${trialTowerGame.currentFloor} 层！获得特殊奖励！`, 'skill', '#FFD700');
        giveTrialTowerReward(trialTowerGame.currentFloor);
    }
    
    // 进入下一层
    trialTowerGame.currentFloor++;
    
    // 重置怪物
    resetTrialMonster();
    
    // 重置技能连击
    trialTowerGame.monsterSkillCombo = 0;
    trialTowerGame.lastComboSkill = '';
    
    // 恢复部分生命值（胜利奖励）
    let healAmount = Math.floor(trialTowerGame.playerMaxHp * 0.3);
    trialTowerGame.playerHp = Math.min(trialTowerGame.playerHp + healAmount, trialTowerGame.playerMaxHp);
    addTrialBattleLog(`❤️ 进入第 ${trialTowerGame.currentFloor} 层，恢复30%生命值 (+${formatNumber(healAmount)})`, 'heal');
    
    // 显示下一层怪物信息
    const nextMonsterSkills = getMonsterSkillsForFloor(trialTowerGame.currentFloor);
    const highSkills = nextMonsterSkills.filter(s => s.multiplier >= 3.0);
    if (highSkills.length > 0) {
        addTrialBattleLog(`⚠️ 第 ${trialTowerGame.currentFloor} 层怪物拥有 ${highSkills.length} 种强力技能！`, 'warning');
    }
    
    // 保存进度
    saveTrialTowerProgress();
    
    updateTrialTowerUI();
}

// 处理玩家死亡
function handleTrialPlayerDeath() {
    trialTowerGame.isInBattle = false;
    trialTowerGame.totalChallenges++;
    
    addTrialBattleLog('💀 挑战失败！', 'error');
    addTrialBattleLog(`📊 当前停留在第 ${trialTowerGame.currentFloor} 层`, 'info');
    
    // 禁用攻击防御按钮
    document.getElementById('trialAttackBtn').disabled = true;
    document.getElementById('trialDefendBtn').disabled = true;
    
    // 保存进度
    saveTrialTowerProgress();
    
    updateTrialTowerUI();
}

// 重新挑战当前层
function trialTowerRestart() {
    // 重置玩家血量
    trialTowerGame.playerHp = trialTowerGame.playerMaxHp;
    
    // 重置当前层怪物
    resetTrialMonster();
    
    // 重置战斗状态
    trialTowerGame.isInBattle = true;
    trialTowerGame.isDefending = false;
    
    // 重置技能相关
    trialTowerGame.monsterSkillCombo = 0;
    trialTowerGame.lastComboSkill = '';
    trialTowerGame.lastMonsterSkill = '';
    trialTowerGame.defenseHealCount = 0;
    trialTowerGame.defenseTotalHeal = 0;
    trialTowerGame.artifactCritCount = 0;
    trialTowerGame.artifactTotalBonus = 0;
    // 启用攻击防御按钮
    document.getElementById('trialAttackBtn').disabled = false;
    document.getElementById('trialDefendBtn').disabled = false;
    
    // 清空日志
    clearTrialBattleLog();
    
    addTrialBattleLog('🔄 重新挑战当前层！', 'warning');
    addTrialBattleLog(`👾 第 ${trialTowerGame.currentFloor} 层怪物重生`, 'info');
     addTrialBattleLog('🛡️ 防御有20%几率回复15%生命值', 'info', '#4CAF50');
    // 显示当前层怪物技能信息
    const skills = getMonsterSkillsForFloor(trialTowerGame.currentFloor);
    const powerfulSkills = skills.filter(s => s.multiplier >= 2.0);
    addTrialBattleLog(`📊 怪物拥有 ${powerfulSkills.length} 种强力技能`, 'info', '#9C27B0');
    
    updateTrialTowerUI();
}

// 给予试练塔奖励
function giveTrialTowerReward(floor) {
    let reward = getRewardForFloor(floor);
    
    if (reward.amount > 0) {
        // 添加奖励到玩家背包
        if (!player.items) player.items = {};
        player.items[reward.itemKey] = (player.items[reward.itemKey] || 0) + reward.amount;
        
        addTrialBattleLog(`🎁 第${floor}层奖励: ${reward.name}×${reward.amount}`, 'success');
    } else {
        // 其他层数给少量随机奖励
        let randomReward = Math.floor(floor / 5);
        if (randomReward > 0) {
            player.items['danyao1'] = (player.items['danyao1'] || 0) + randomReward;
            addTrialBattleLog(`🎁 第${floor}层奖励: 蕴灵筑基丹×${randomReward}`, 'success');
        }
    }
}

// 保存试练塔进度
function saveTrialTowerProgress() {
    if (!player.trialTower) {
        player.trialTower = {};
    }
    
    player.trialTower.currentFloor = trialTowerGame.currentFloor;
    player.trialTower.highestFloor = trialTowerGame.highestFloor;
    player.trialTower.totalChallenges = trialTowerGame.totalChallenges;
    player.trialTower.totalWins = trialTowerGame.totalWins;
}

// 添加试练塔战斗日志
function addTrialBattleLog(message, type = 'normal', color = null) {
    let logDiv = document.getElementById('trialBattleLog');
    let newLog = document.createElement('div');
    
    let textColor = '#aaa';
    let prefix = '•';
    
    switch(type) {
        case 'success': textColor = '#4CAF50'; prefix = '✅'; break;
        case 'error': textColor = '#f44336'; prefix = '❌'; break;
        case 'warning': textColor = '#FFD700'; prefix = '⚠️'; break;
        case 'crit': textColor = '#FFD700'; prefix = '⚡'; break;
        case 'damage': textColor = '#FF6B6B'; prefix = '💢'; break;
        case 'defend': textColor = '#4CAF50'; prefix = '🛡️'; break;
        case 'heal': textColor = '#4CAF50'; prefix = '❤️'; break;
        case 'skill': textColor = color || '#9C27B0'; prefix = '🎯'; break;
        case 'info': textColor = '#9C27B0'; prefix = '📌'; break;
    }
    
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
        <span style="color: #666; font-size: 10px;">[${timestamp}]</span>
        <span style="color: ${textColor}; font-weight: ${type === 'skill' ? 'bold' : 'normal'};">${prefix}</span>
        <span style="color: ${textColor};">${message}</span>
    `;
    
    logDiv.insertBefore(newLog, logDiv.firstChild);
    
    while (logDiv.children.length > 50) {
        logDiv.removeChild(logDiv.lastChild);
    }
}

// 清空试练塔战斗日志
function clearTrialBattleLog() {
    document.getElementById('trialBattleLog').innerHTML = '';
}


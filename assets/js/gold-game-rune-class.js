// 符文与职业
// 切换符文系统界面
function toggleRuneSystem() {
     if (player.level.ascentionCounta < 3) {
        alert("需要达到轮回3转才能开启符文系统！");
        return;
    }
    const overlay = document.getElementById('runeSystemOverlay');
    const ui = document.getElementById('runeSystemUI');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateRuneSystemUI();
    }
}

// 更新符文系统界面
function updateRuneSystemUI() {
    // 更新材料数量显示
    Object.keys(player.runes.materials).forEach(material => {
        document.getElementById(`runeMaterial${material.charAt(0).toUpperCase() + material.slice(1)}`).textContent = 
            player.runes.materials[material];
    });
    
    // 更新材料选择界面
    updateMaterialSelection();
    
    // 更新已选材料显示
    updateSelectedMaterials();
    
    // 更新装备的符文显示
    updateEquippedRune();
    
    // 更新符文背包显示
    updateRuneInventory();
    
    // 更新符文升级信息
    updateRuneUpgradeInfo();
}

// 更新材料选择界面
function updateMaterialSelection() {
    const container = document.getElementById('runeMaterialSelection');
    container.innerHTML = '';
    
    // 材料掉落概率配置
    const materialDropRates = {
        gold: 0.50,
        wood: 0.25,
        water: 0.125,
        fire: 0.0625,
        earth: 0.03125,
        light: 0.015625,
        dark: 0.0078125,
        wind: 0.00390625,
        ice: 0.001953125,
        electric: 0.0009765625
    };
    
    Object.keys(player.runes.materials).forEach(material => {
        const count = player.runes.materials[material];
        const selectedCount = player.runes.selectedMaterials.filter(m => m === material).length;
        const remainingCount = count - selectedCount;
        const dropRate = materialDropRates[material] * 100; // 转换为百分比
        
        const button = document.createElement('button');
        button.innerHTML = `
            <div>${materialNames[material]}</div>
            <div>拥有: ${remainingCount}</div>
            <div style="font-size: 10px; color: #d8bfd8;">掉落率: ${dropRate.toFixed(4)}%</div>
        `;
        button.style.cssText = `
            padding: 5px;
            border: 1px solid #9370db;
            background: ${remainingCount > 0 ? 'rgba(147, 112, 219, 0.3)' : 'rgba(128, 128, 128, 0.3)'};
            color: ${remainingCount > 0 ? '#e6e6fa' : '#888'};
            border-radius: 3px;
            cursor: ${remainingCount > 0 ? 'pointer' : 'not-allowed'};
            width: 80px;
            height: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        `;
        
        if (remainingCount > 0) {
            button.onclick = () => selectMaterial(material);
        }
        
        container.appendChild(button);
    });
}


// 选择材料
function selectMaterial(material) {
    if (player.runes.selectedMaterials.length >= 5) {
        logAction('最多只能选择5个材料！', 'error');
        return;
    }
    
    // 检查该材料是否还有剩余
    const selectedCount = player.runes.selectedMaterials.filter(m => m === material).length;
    const totalCount = player.runes.materials[material];
    
    if (selectedCount >= totalCount) {
        logAction(`${materialNames[material]}材料不足！`, 'error');
        return;
    }
    
    player.runes.selectedMaterials.push(material);
    updateSelectedMaterials();
    updateMaterialSelection();
}

// 更新已选材料显示
function updateSelectedMaterials() {
    const container = document.getElementById('selectedMaterials');
    
    if (player.runes.selectedMaterials.length === 0) {
        container.innerHTML = '<div style="color: #888; text-align: center;">请选择5个材料</div>';
        return;
    }
    
    // 统计每种材料的数量
    const materialCounts = {};
    player.runes.selectedMaterials.forEach(material => {
        materialCounts[material] = (materialCounts[material] || 0) + 1;
    });
    
    container.innerHTML = Object.entries(materialCounts).map(([material, count]) => `
        <div style="display: inline-block; background: rgba(147, 112, 219, 0.5); padding: 5px 10px; margin: 2px; border-radius: 3px; border: 1px solid #9370db;">
            ${materialNames[material]} ×${count}
            <button onclick="removeMaterial('${material}')" style="background: none; border: none; color: #ff6b6b; cursor: pointer; margin-left: 5px;">×</button>
        </div>
    `).join('');
    addClearMaterialsButton();
    // 显示可能的属性预览（隐藏具体数值）
    if (player.runes.selectedMaterials.length === 5) {
        const preview = generateRunePreview(player.runes.selectedMaterials);
        container.innerHTML += `
            <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px; border: 1px dashed #9370db;">
                <div style="color: #ffd700; font-weight: bold;">符文预览: ${preview.name}</div>
                ${preview.attributes.map(attr => `
                    <div style="font-size: 12px;">${attr.name}: ${attr.displayValue}</div>
                `).join('')}
                <div style="font-size: 10px; color: #d8bfd8; margin-top: 5px;">
                    合成后显示具体数值
                </div>
            </div>
        `;
    }
}

// 移除已选材料
function removeMaterial(material) {
    // 找到最后一个该材料的索引
    const lastIndex = player.runes.selectedMaterials.lastIndexOf(material);
    if (lastIndex !== -1) {
        player.runes.selectedMaterials.splice(lastIndex, 1);
        updateSelectedMaterials();
        updateMaterialSelection();
    }
}
// 生成符文预览（不实际创建符文）
function generateRunePreview(materials) {
    const seed = materials.sort().join('');
    const hash = stringHash(seed);
    const random = seededRandom(hash);
    
    // 确保属性类型数组不为空
    const attributeTypes = [...runeAttributes.types];
    if (attributeTypes.length === 0) {
        console.error("属性类型数组为空！");
        return { name: "未知符文", attributes: [] };
    }
    
    const selectedAttributes = [];
    
    // 确保总是生成5种属性类型
    for (let i = 0; i < 5; i++) {
        const index = Math.floor(random() * attributeTypes.length);
        // 确保索引在有效范围内
        const safeIndex = Math.max(0, Math.min(index, attributeTypes.length - 1));
        selectedAttributes.push(attributeTypes[safeIndex]);
    }
    
    const attributes = selectedAttributes.map(type => {
        return {
            type: type,
            name: runeAttributes.names[type],
            // 预览时不显示具体数值，只显示属性类型
            displayValue: '???'
        };
    });
    
    // 生成预览名称
    const previewName = generateRuneName(materials, hash);
    
    return {
        name: previewName,
        attributes: attributes
    };
}

// 合成符文
function synthesizeRune() {
    if (player.runes.selectedMaterials.length !== 5) {
        logAction('需要选择5个材料才能合成符文！', 'error');
        return;
    }
    
    // 验证材料组合
    if (!validateMaterialCombination(player.runes.selectedMaterials)) {
        logAction('无效的材料组合！', 'error');
        return;
    }
    
    // 检查材料是否足够（考虑重复材料）
    const materialCounts = {};
    player.runes.selectedMaterials.forEach(material => {
        materialCounts[material] = (materialCounts[material] || 0) + 1;
    });
    
    for (const [material, needed] of Object.entries(materialCounts)) {
        if (player.runes.materials[material] < needed) {
            logAction(`${materialNames[material]}材料不足！需要${needed}个，只有${player.runes.materials[material]}个`, 'error');
            return;
        }
    }
    
    // 消耗材料（考虑重复材料）
    for (const [material, needed] of Object.entries(materialCounts)) {
        player.runes.materials[material] -= needed;
    }
    
    // 生成符文
    const newRune = generateRune(player.runes.selectedMaterials);
    
    // 检查符文是否生成成功
    if (!newRune) {
        logAction('符文生成失败！', 'error');
        return;
    }
    
    player.runes.inventory.push(newRune);
    
    // 清空已选材料
    player.runes.selectedMaterials = [];
    
    logAction(`成功合成符文: ${newRune.name}`, 'success');
    updateRuneSystemUI();
    saveGame();
}
function generateRune(materials) {
    // 根据材料组合生成种子
    const seed = materials.sort().join('');
    const hash = stringHash(seed);
    
    // 使用种子生成确定性随机属性类型
    const random = seededRandom(hash);
    
    // 确保属性类型数组不为空
    const attributeTypes = [...runeAttributes.types];
    if (attributeTypes.length === 0) {
        console.error("属性类型数组为空！");
        return null;
    }
    
    const selectedAttributes = [];
    
    // 确保总是生成5种属性类型
    for (let i = 0; i < 5; i++) {
        const index = Math.floor(random() * attributeTypes.length);
        // 确保索引在有效范围内
        const safeIndex = Math.max(0, Math.min(index, attributeTypes.length - 1));
        selectedAttributes.push(attributeTypes[safeIndex]);
    }
    
    // 生成属性值（保持类型固定，数值有随机幅度）
    const attributes = selectedAttributes.map(type => {
        const range = runeAttributes.ranges[type];
        let value;
        
        if (type === 'combo') {
            // 连击次数为整数，确保在范围内
            value = Math.floor(range.min + Math.random() * (range.max - range.min + 1));
            value = Math.max(range.min, Math.min(range.max, value));
        } else {
            // 其他属性为百分比，确保在范围内
            value = range.min + Math.random() * (range.max - range.min);
            value = Math.max(range.min, Math.min(range.max, value));
            value = Math.round(value * 100) / 100; // 保留两位小数
        }
        
        return {
            type: type,
            value: value,
            displayValue: type === 'combo' ? `${value}次` : `${(value * 100).toFixed(1)}%`,
            name: runeAttributes.names[type]
        };
    });
    
    // 生成符文名称（基于材料组合）
    const runeName = generateRuneName(materials, hash);
    
    // 创建符文对象
    return {
        id: 'rune_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: runeName,
        materials: [...materials],
        attributes: attributes,
        level: player.runes.level,
        isLocked: false,
        createdAt: Date.now()
    };
}

// 生成符文名称
function generateRuneName(materials, hash) {
    // 神秘符文前缀
    const mysticalPrefixes = [
        '虚空', '混沌', '永恒', '不朽', '星辰', '命运', '时空', '创世', '灭世', '轮回',
        '天界', '冥界', '神域', '魔域', '圣光', '暗影', '元素', '本源', '真理', '法则',
        '秩序', '混沌', '起源', '终焉', '无限', '绝对', '至高', '无上', '至尊', '究极',
        '洪荒', '太古', '鸿蒙', '太初', '元始', '造化', '玄黄', '阴阳', '五行', '八卦',
        '天道', '地道', '人道', '神道', '魔道', '仙道', '佛道', '妖道', '鬼道', '圣道'
    ];
    
    // 神秘符文中缀
    const mysticalInfixes = [
        '吞噬', '湮灭', '创造', '毁灭', '平衡', '秩序', '混沌', '时间', '空间', '命运',
        '生命', '死亡', '光明', '黑暗', '火焰', '寒冰', '风暴', '大地', '雷霆', '海洋',
        '灵魂', '精神', '意志', '力量', '智慧', '勇气', '荣耀', '信仰', '希望', '绝望',
        '真理', '谎言', '现实', '虚幻', '过去', '未来', '现在', '因果', '轮回', '宿命',
        '天命', '劫难', '造化', '机缘', '气运', '功德', '业力', '报应', '涅槃', '超脱'
    ];
    
    // 神秘符文后缀
    const mysticalSuffixes = [
        '符文', '印记', '徽记', '圣印', '咒文', '法印', '图腾', '刻印', '符石', '神印',
        '宝珠', '晶石', '灵珠', '魂石', '魔印', '道符', '灵符', '神符', '天符', '地符',
        '龙符', '凤印', '麒麟印', '白虎符', '朱雀印', '玄武符', '青龙印', '白虎印',
        '之眼', '之心', '之魂', '之灵', '之源', '之核', '之种', '之泪', '之血', '之骨',
        '圣典', '秘典', '天书', '地书', '人书', '神书', '魔书', '仙书', '佛书', '妖书'
    ];
    
    // 使用哈希值选择前缀、中缀和后缀
    const prefixIndex = Math.abs(hash % mysticalPrefixes.length);
    const infixIndex = Math.abs((hash >> 8) % mysticalInfixes.length);
    const suffixIndex = Math.abs((hash >> 16) % mysticalSuffixes.length);
    
    // 根据重复材料的数量决定是否使用中缀
    const materialCounts = {};
    materials.forEach(material => {
        materialCounts[material] = (materialCounts[material] || 0) + 1;
    });
    
    const maxRepeat = Math.max(...Object.values(materialCounts));
    const useInfix = maxRepeat >= 3; // 如果有材料重复3次或以上，使用中缀
    
    if (useInfix) {
        return `${mysticalPrefixes[prefixIndex]}${mysticalInfixes[infixIndex]}${mysticalSuffixes[suffixIndex]}`;
    } else {
        return `${mysticalPrefixes[prefixIndex]}${mysticalSuffixes[suffixIndex]}`;
    }
}

// 字符串哈希函数
function stringHash(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    
    // 确保哈希值不为0
    if (hash === 0) hash = 1;
    
    return hash;
}

// 种子随机数生成器
function seededRandom(seed) {
    // 确保种子不为0
    if (seed === 0) seed = 1;
    
    return function() {
        seed = (seed * 9301 + 49297) % 233280;
        // 确保返回值不为0
        return Math.max(0.0001, seed / 233280);
    };
}  
// 添加符文品质颜色系统
function getRuneQualityColor(rune) {
    // 根据符文等级和属性数量决定品质颜色
    const totalValue = rune.attributes.reduce((sum, attr) => {
        if (attr.type === 'combo') {
            return sum + attr.value * 10; // 连击次数价值较高
        } else {
            return sum + attr.value * 100; // 百分比属性价值
        }
    }, 0);
    
    const averageValue = totalValue / rune.attributes.length;
    
    if (averageValue > 80) {
        return '#ffd700'; // 传说品质（金色）
    } else if (averageValue > 60) {
        return '#9370db'; // 史诗品质（紫色）
    } else if (averageValue > 40) {
        return '#1e90ff'; // 稀有品质（蓝色）
    } else if (averageValue > 20) {
        return '#32cd32'; // 优秀品质（绿色）
    } else {
        return '#ffffff'; // 普通品质（白色）
    }
}
// 添加材料组合验证函数
function validateMaterialCombination(materials) {
    if (!materials || materials.length !== 5) {
        console.error("无效的材料组合：材料数量不正确");
        return false;
    }
    
    // 检查所有材料是否有效
    for (const material of materials) {
        if (!player.runes.materials.hasOwnProperty(material)) {
            console.error("无效的材料：", material);
            return false;
        }
    }
    
    return true;
}
// 更新装备的符文显示
function updateEquippedRune() {
    const container = document.getElementById('equippedRune');
    
    if (!player.runes.equipped) {
        container.innerHTML = '<div style="color: #888; text-align: center;">未装备符文</div>';
        return;
    }
    
    const rune = player.runes.equipped;
    const runeBonuses = calculateRuneBonuses();
    const qualityColor = getRuneQualityColor(rune);
    
    // 统计属性重复次数
    const attributeCounts = {};
    rune.attributes.forEach(attr => {
        attributeCounts[attr.type] = (attributeCounts[attr.type] || 0) + 1;
    });
    
    container.innerHTML = `
        <div style="font-size: 18px; font-weight: bold; color: ${qualityColor}; margin-bottom: 10px; text-shadow: 0 0 5px ${qualityColor};">${rune.name}</div>
        <div style="margin-bottom: 10px; max-height: 120px; overflow-y: auto;">
            ${rune.attributes.map((attr, index) => {
                const count = attributeCounts[attr.type];
                const countText = count > 1 ? ` (x${count})` : '';
                return `<div>${attr.name}: ${attr.displayValue}${countText}</div>`;
            }).join('')}
        </div>
        <div style="font-size: 12px; color: #d8bfd8; margin-bottom: 5px;">
            等级: ${rune.level} (${(rune.level * 100).toFixed(0)}%加成)
        </div>
        <div style="font-size: 11px; color: #90ee90; margin-bottom: 10px;">
            当前总加成:<br>
            ${runeBonuses.attack > 0 ? `攻击: +${(runeBonuses.attack * 100).toFixed(1)}%<br>` : ''}
            ${runeBonuses.health > 0 ? `生命: +${(runeBonuses.health * 100).toFixed(1)}%<br>` : ''}
            ${runeBonuses.critRate > 0 ? `暴击率: +${(runeBonuses.critRate * 100).toFixed(2)}%<br>` : ''}
            ${runeBonuses.critDamage > 0 ? `爆伤: +${(runeBonuses.critDamage * 100).toFixed(1)}%<br>` : ''}
            ${runeBonuses.combo > 0 ? `连击: +${runeBonuses.combo.toFixed(0)}次<br>` : ''}
            ${runeBonuses.worldExp > 0 ? `世界经验: +${(runeBonuses.worldExp * 100).toFixed(1)}%<br>` : ''}
        </div>
        <button onclick="unequipRune()" style="background: linear-gradient(to bottom, #dc143c, #8b0000); color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px;">卸下</button>
    `;
}
function showRuneSynthesisHelp() {
    showCustomConfirm(`
        <div style="text-align: left;">
            <h3 style="color: #ffd700;">符文合成说明</h3>
            <p><strong>材料选择:</strong> 选择5个材料（可以重复使用同一种材料）</p>
            <p><strong>重复材料:</strong> 使用重复材料会影响符文属性和名称</p>
            <ul>
                <li>重复材料会增加符文分解价值</li>
                <li>重复3次以上的材料会生成更复杂的符文名称</li>
                <li>重复材料组合会生成独特的符文属性</li>
            </ul>
            <p><strong>属性生成:</strong> 每个符文有5条属性，可能重复</p>
            <p><strong>符文命名:</strong> 使用神秘词汇组合，不包含材料名称</p>
            <p><strong>属性范围:</strong></p>
            <ul>
                <li>攻击/生命/爆伤/暴击率: 1% - 100%</li>
                <li>连击次数: 1-10次</li>
                <li>世界经验: 1% - 10%</li>
            </ul>
            <p><strong>符文升级:</strong> 使用秘法符文升级，每级提升100%属性</p>
            <p><strong>重复属性:</strong> 相同属性会叠加，分解时价值更高</p>
            <p><strong>预览隐藏:</strong> 合成前只显示属性类型，不显示具体数值</p>
        </div>
    `, () => {});
}
function addClearMaterialsButton() {
    const container = document.getElementById('selectedMaterials');
    if (player.runes.selectedMaterials.length > 0) {
        container.innerHTML += `
            <div style="margin-top: 10px;">
                <button onclick="clearSelectedMaterials()" style="background: #dc143c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;">清空已选材料</button>
            </div>
        `;
    }
}

// 清空已选材料函数
function clearSelectedMaterials() {
    player.runes.selectedMaterials = [];
    updateSelectedMaterials();
    updateMaterialSelection();
}

// 更新符文背包显示
function updateRuneInventory() {
    const container = document.getElementById('runeInventory');
    container.innerHTML = '';
    
    let filteredRunes = player.runes.inventory;
    
    // 应用过滤器
    if (player.runes.currentFilter !== 'all') {
        filteredRunes = filteredRunes.filter(rune => {
            return rune.attributes.some(attr => attr.type === player.runes.currentFilter);
        });
    }
    
    if (filteredRunes.length === 0) {
        container.innerHTML = '<div style="color: #888; text-align: center; grid-column: 1 / -1;">符文背包为空</div>';
        return;
    }
    
    filteredRunes.forEach(rune => {
        const runeElement = document.createElement('div');
        runeElement.style.cssText = `
            background: rgba(0,0,0,0.3);
            padding: 10px;
            border-radius: 5px;
            border: 2px solid ${rune.isLocked ? '#ffd700' : '#9370db'};
            position: relative;
            box-shadow: 0 0 10px ${rune.isLocked ? '#ffd700' : '#9370db'};
        `;
        
        // 统计属性重复次数
        const attributeCounts = {};
        rune.attributes.forEach(attr => {
            attributeCounts[attr.type] = (attributeCounts[attr.type] || 0) + 1;
        });
        
        runeElement.innerHTML = `
            <div style="font-weight: bold; color: ${rune.isLocked ? '#ffd700' : '#e6e6fa'}; margin-bottom: 5px; text-shadow: 0 0 5px ${rune.isLocked ? '#ffd700' : '#9370db'};">${rune.name}</div>
            <div style="font-size: 12px; margin-bottom: 5px; max-height: 100px; overflow-y: auto;">
                ${rune.attributes.map((attr, index) => {
                    const count = attributeCounts[attr.type];
                    const countText = count > 1 ? ` (x${count})` : '';
                    return `<div>${attr.name}: ${attr.displayValue}${countText}</div>`;
                }).join('')}
            </div>
            <div style="font-size: 11px; color: #d8bfd8;">
                等级: ${rune.level} (${(rune.level * 100).toFixed(0)}%加成)
            </div>
            <div style="margin-top: 10px; display: flex; justify-content: space-between;">
                <button onclick="equipRune('${rune.id}')" style="background: #9370db; color: white; border: none; padding: 3px 8px; border-radius: 2px; cursor: pointer; font-size: 11px;">装备</button>
                <button onclick="toggleLockRune('${rune.id}')" style="background: ${rune.isLocked ? '#ffd700' : '#6a5acd'}; color: white; border: none; padding: 3px 8px; border-radius: 2px; cursor: pointer; font-size: 11px;">
                    ${rune.isLocked ? '解锁' : '锁定'}
                </button>
                <button onclick="decomposeRune('${rune.id}')" style="background: #dc143c; color: white; border: none; padding: 3px 8px; border-radius: 2px; cursor: pointer; font-size: 11px;">分解</button>
            </div>
        `;
        
        container.appendChild(runeElement);
    });
}

// 装备符文
function equipRune(runeId) {
    const runeIndex = player.runes.inventory.findIndex(r => r.id === runeId);
    if (runeIndex === -1) return;
    
    player.runes.equipped = player.runes.inventory[runeIndex];
    logAction(`装备了符文: ${player.runes.equipped.name}`, 'success');
    updatePlayerBattleStats();
    updateRuneSystemUI();
    saveGame();
}

// 卸下符文
function unequipRune() {
    if (!player.runes.equipped) return;
    
    logAction(`卸下了符文: ${player.runes.equipped.name}`, 'info');
    player.runes.equipped = null;
    updatePlayerBattleStats();
    updateRuneSystemUI();
    saveGame();
}

// 切换符文锁定状态
function toggleLockRune(runeId) {
    const runeIndex = player.runes.inventory.findIndex(r => r.id === runeId);
    if (runeIndex === -1) return;
    
    player.runes.inventory[runeIndex].isLocked = !player.runes.inventory[runeIndex].isLocked;
    logAction(`${player.runes.inventory[runeIndex].isLocked ? '锁定' : '解锁'}了符文: ${player.runes.inventory[runeIndex].name}`, 'info');
    updateRuneSystemUI();
    saveGame();
}

// 分解符文
function decomposeRune(runeId) {
    const runeIndex = player.runes.inventory.findIndex(r => r.id === runeId);
    if (runeIndex === -1) return;
    
    const rune = player.runes.inventory[runeIndex];
    
    if (rune.isLocked) {
        logAction('无法分解已锁定的符文！', 'error');
        return;
    }
    
    // 计算分解奖励（星币）
    const starCoins = calculateRuneDecomposeValue(rune);
    // 分解符文获得的星币同样不能超过总上限
    addStarCoins(starCoins);
    
    // 从背包中移除
    player.runes.inventory.splice(runeIndex, 1);
    
    logAction(`分解了符文: ${rune.name}，获得${starCoins}星币`, 'success');
    updateRuneSystemUI();
    updateDisplay();
    saveGame();
}

// 计算符文分解价值
function calculateRuneDecomposeValue(rune) {
    // 基础价值 + 属性价值 + 等级价值 + 重复材料奖励
    let value = 1; // 基础价值
    
    // 统计材料重复次数
    const materialCounts = {};
    rune.materials.forEach(material => {
        materialCounts[material] = (materialCounts[material] || 0) + 1;
    });
    
    // 材料重复奖励
    const maxRepeat = Math.max(...Object.values(materialCounts));
    if (maxRepeat > 1) {
        value *= Math.pow(1.2, maxRepeat - 1); // 每重复一次增加20%基础价值
    }
    
    // 统计属性重复次数
    const attributeCounts = {};
    rune.attributes.forEach(attr => {
        attributeCounts[attr.type] = (attributeCounts[attr.type] || 0) + 1;
    });
    
    // 属性价值
    rune.attributes.forEach(attr => {
        let attrValue;
        
        if (attr.type === 'combo') {
            attrValue = attr.value * 5; // 每次连击价值5星币
        } else {
            attrValue = attr.value * 1; // 每1%属性价值1星币
        }
        
        // 重复属性奖励
        const count = attributeCounts[attr.type];
        if (count > 1) {
            attrValue *= Math.pow(1.5, count - 1); // 每重复一次增加50%价值
        }
        
        value += attrValue;
    });
    
    // 等级价值
    value *= rune.level;
    
    return Math.floor(value);
}


// 一键分解所有未锁定的符文
function decomposeAllRunes() {
    const unlockedRunes = player.runes.inventory.filter(rune => !rune.isLocked);
    
    if (unlockedRunes.length === 0) {
        logAction('没有可分解的符文！', 'error');
        return;
    }
    
    showCustomConfirm(`确定要分解所有未锁定的符文吗？共${unlockedRunes.length}个，将获得大量星币！`, (confirmed) => {
        if (confirmed) {
            let totalStarCoins = 0;
            
            // 分解所有未锁定的符文
            player.runes.inventory = player.runes.inventory.filter(rune => {
                if (rune.isLocked) {
                    return true; // 保留锁定的符文
                }
                
                totalStarCoins += calculateRuneDecomposeValue(rune);
                return false; // 移除未锁定的符文
            });
            
            player.nightClub.starCoins += totalStarCoins;
            
            logAction(`一键分解了${unlockedRunes.length}个符文，获得${totalStarCoins}星币`, 'success');
            updateRuneSystemUI();
            updateDisplay();
            saveGame();
        }
    });
}

// 切换符文过滤器
function toggleRuneFilter() {
    const filterBtn = document.getElementById('runeFilterBtn');
    const filters = ['all', 'attack', 'health', 'critDamage', 'combo', 'critRate', 'worldExp'];
    const filterNames = {
        all: '显示全部',
        attack: '攻击加成',
        health: '生命加成',
        critDamage: '爆伤加成',
        combo: '连击次数',
        critRate: '暴击率',
        worldExp: '世界经验'
    };
    
    const currentIndex = filters.indexOf(player.runes.currentFilter);
    const nextIndex = (currentIndex + 1) % filters.length;
    player.runes.currentFilter = filters[nextIndex];
    
    filterBtn.textContent = filterNames[player.runes.currentFilter];
    updateRuneInventory();
}

// 更新符文升级信息
function updateRuneUpgradeInfo() {
    document.getElementById('runeLevel').textContent = player.runes.level;
    document.getElementById('runeUpgradeCost').textContent = player.runes.upgradeCost;
    
    // 检查是否有足够的秘法符文
    const upgradeBtn = document.getElementById('upgradeRuneBtn');
    if (player.items.fuwen1 >= player.runes.upgradeCost) {
        upgradeBtn.disabled = false;
        upgradeBtn.style.opacity = '1';
    } else {
        upgradeBtn.disabled = true;
        upgradeBtn.style.opacity = '0.5';
    }
}

// 升级符文
function upgradeRune() {
    if (player.items.fuwen1 < player.runes.upgradeCost) {
        logAction('秘法符文不足！', 'error');
        return;
    }
    
    player.items.fuwen1 -= player.runes.upgradeCost;
    player.runes.level++;
    player.runes.upgradeCost += 10;
    
    // 更新所有符文的等级
    player.runes.inventory.forEach(rune => {
        rune.level = player.runes.level;
    });
    
    if (player.runes.equipped) {
        player.runes.equipped.level = player.runes.level;
    }
    
    logAction(`符文等级提升至 ${player.runes.level}级，所有符文属性提升100%！`, 'success');
     updatePlayerBattleStats();
    updateRuneSystemUI();
    updateDisplay();
    saveGame();
}

// 在次元4以上掉落材料
function dropRuneMaterials() {
    if (!player.runes || !player.runes.materials || typeof player.runes.materials !== 'object') return;
    if (player.dimensionLevel < 4) return;
    
    // 只有1%的几率触发材料掉落
    if (Math.random() >= 0.001) return;
    
    // 材料掉落概率配置（从50%到0.01%）
    const materialDropRates = {
        gold: 0.50,      // 50%
        wood: 0.25,      // 25%
        water: 0.125,    // 12.5%
        fire: 0.0625,    // 6.25%
        earth: 0.03125,  // 3.125%
        light: 0.015625, // 1.5625%
        dark: 0.0078125, // 0.78125%
        wind: 0.00390625, // 0.390625%
        ice: 0.001953125, // 0.1953125%
        electric: 0.0009765625 // 0.09765625% (约0.1%)
    };
    
    // 计算总概率（用于归一化）
    const totalRate = Object.values(materialDropRates).reduce((sum, rate) => sum + rate, 0);
    
    // 生成随机数决定掉落哪个材料
    const rand = Math.random() * totalRate;
    let cumulativeRate = 0;
    let droppedMaterial = null;
    
    // 选择掉落的材料
    for (const [material, rate] of Object.entries(materialDropRates)) {
        cumulativeRate += rate;
        if (rand <= cumulativeRate) {
            droppedMaterial = material;
            break;
        }
    }
    
    // 增加材料数量
    if (droppedMaterial) {
        if (!Number.isFinite(Number(player.runes.materials[droppedMaterial]))) player.runes.materials[droppedMaterial] = 0;
        player.runes.materials[droppedMaterial]++;
        
        // 记录掉落日志
        const materialName = (typeof materialNames === 'object' && materialNames && materialNames[droppedMaterial]) ? materialNames[droppedMaterial] : droppedMaterial;
        logAction(`获得了符文材料: ${materialName}`, 'success');
        
        // 更新界面显示
        safePanelUpdate(updateRuneSystemUI);
    }
}
function calculateRuneBonuses() {
    const bonuses = {
        attack: 0,
        health: 0,
        critDamage: 0,
        combo: 0,
        critRate: 0,
        worldExp: 0
    };
    
    if (player.runes.equipped) {
        const rune = player.runes.equipped;
        const levelMultiplier = Number(rune.level) || 1;
        if (!Array.isArray(rune.attributes)) return bonuses;
        
        rune.attributes.forEach(attr => {
            if (!attr || !attr.type) return;
            // 应用等级加成
            const baseValue = Math.max(0, Number(attr.value) || 0);
            const finalValue = baseValue * levelMultiplier;
            
            switch(attr.type) {
                case 'attack':
                    bonuses.attack += finalValue;
                    break;
                case 'health':
                    bonuses.health += finalValue;
                    break;
                case 'critDamage':
                    bonuses.critDamage += finalValue;
                    break;
                case 'combo':
                    bonuses.combo +=  Math.floor(finalValue);
                    break;
                case 'critRate':
                    bonuses.critRate += finalValue;
                    break;
                case 'worldExp':
                    bonuses.worldExp += finalValue;
                    break;
            }
        });
    }
    
    return bonuses;
}
// 职业配置
const classConfig = {
    warrior: {
        name: "战士",
        branches: [
            {
                requiredStage: 20,
                options: [
                    {desc: "玩家攻击加成总和提升2倍", type: "attackMultiplier", value: 2},
                    {desc: "玩家爆伤总和提升2倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 2}},
                    {desc: "玩家生命加成总和提升1.1倍", type: "healthMultiplier", value: 1.1}
                ]
            },
            {
                requiredStage: 200,
                options: [
                    {desc: "玩家攻击加成总和提升5倍", type: "attackMultiplier", value: 5},
                    {desc: "玩家爆伤总和提升5倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 5}},
                    {desc: "玩家生命加成总和提升1.5倍", type: "healthMultiplier", value: 1.5}
                ]
            },
            {
                requiredStage: 500,
                options: [
                    {desc: "玩家攻击加成总和提升10倍", type: "attackMultiplier", value: 10},
                    {desc: "玩家爆伤总和提升10倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 10}},
                    {desc: "玩家生命加成总和提升3倍", type: "healthMultiplier", value: 3}
                ]
            },
            {
                requiredStage: 1000,
                options: [
                    {desc: "玩家攻击加成总和提升20倍", type: "attackMultiplier", value: 20},
                    {desc: "玩家爆伤总和提升20倍伤害", type: "critMultiplier", value: {chance: 0.01, multiplier: 20}},
                    {desc: "玩家生命加成总和提升5倍", type: "healthMultiplier", value: 5}
                ]
            },
            {
                requiredStage: 1500,
                options: [
                    {desc: "玩家攻击加成总和提升30倍", type: "attackMultiplier", value: 30},
                    {desc: "玩家爆伤总和提升40倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 40}},
                    {desc: "玩家生命加成总和提升7倍", type: "healthMultiplier", value: 7}
                ]
            },
            {
                requiredStage: 2000,
                options: [
                    {desc: "玩家攻击加成总和提升80倍", type: "attackMultiplier", value: 80},
                    {desc: "玩家爆伤总和提升100倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 100}},
                    {desc: "玩家生命加成总和提升10倍", type: "healthMultiplier", value: 10}
                ]
            },
            {
                requiredStage: 2500,
                options: [
                    {desc: "玩家攻击加成总和提升150倍", type: "attackMultiplier", value: 150},
                    {desc: "玩家爆伤总和提升180倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 180}},
                    {desc: "玩家生命加成总和提升14倍", type: "healthMultiplier", value: 13}
               ]
            },
            {
                requiredStage: 3000,
                options: [
                    {desc: "玩家攻击加成总和提升300倍", type: "attackMultiplier", value: 300},
                    {desc: "玩家爆伤总和提升330倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 330}},
                    {desc: "玩家生命加成总和提升18倍", type: "healthMultiplier", value: 18}
               ]
            },
            {
                requiredStage: 3500,
                options: [
                    {desc: "玩家攻击加成总和提升600倍", type: "attackMultiplier", value: 600},
                    {desc: "玩家爆伤总和提升620倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 620}},
                    {desc: "玩家生命加成总和提升25倍", type: "healthMultiplier", value: 25}
             ]
            },
            {
                requiredStage: 4000,
                options: [
                    {desc: "玩家攻击加成总和提升1200倍", type: "attackMultiplier", value: 1200},
                    {desc: "玩家爆伤总和提升1300倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 1300}},
                    {desc: "玩家生命加成总和提升30倍", type: "healthMultiplier", value: 30}
               ]
            },
            {
                requiredStage: 4500,
                options: [
                    {desc: "玩家攻击加成总和提升2200倍", type: "attackMultiplier", value: 2200},
                    {desc: "玩家爆伤总和提升2500倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 2500}},
                    {desc: "玩家生命加成总和提升35倍", type: "healthMultiplier", value: 35}
                ]
            },
            {
                requiredStage: 5000,
                options: [
                    {desc: "玩家攻击加成总和提升4000倍", type: "attackMultiplier", value: 4000},
                    {desc: "玩家爆伤总和提升4500倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 4500}},
                    {desc: "玩家生命加成总和提升42倍", type: "healthMultiplier", value: 42}
                ]
            },
            {
                requiredStage: 5500,
                options: [
                    {desc: "玩家攻击加成总和提升7000倍", type: "attackMultiplier", value: 7000},
                    {desc: "玩家爆伤总和提升8000倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 8000}},
                    {desc: "玩家生命加成总和提升50倍", type: "healthMultiplier", value: 50}
                ]
            },
            {
                requiredStage: 6000,
                options: [
                    {desc: "玩家攻击加成总和提升12000倍", type: "attackMultiplier", value: 12000},
                    {desc: "玩家爆伤总和提升14000倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 14000}},
                    {desc: "玩家生命加成总和提升60倍", type: "healthMultiplier", value: 60}
                ]
            },
            {
                requiredStage: 6500,
                options: [
                    {desc: "玩家攻击加成总和提升22000倍", type: "attackMultiplier", value: 22000},
                    {desc: "玩家爆伤总和提升25000倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 25000}},
                    {desc: "玩家生命加成总和提升72倍", type: "healthMultiplier", value: 72}
                ]
            },
            {
                requiredStage: 7000,
                options: [
                    {desc: "玩家攻击加成总和提升40000倍", type: "attackMultiplier", value: 40000},
                    {desc: "玩家爆伤总和提升45000倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 45000}},
                    {desc: "玩家生命加成总和提升85倍", type: "healthMultiplier", value: 85}
                ]
            },
            {
                requiredStage: 7500,
                options: [
                    {desc: "玩家攻击加成总和提升70000倍", type: "attackMultiplier", value: 70000},
                    {desc: "玩家爆伤总和提升80000倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 80000}},
                    {desc: "玩家生命加成总和提升100倍", type: "healthMultiplier", value: 100}
                ]
            },
            {
                requiredStage: 8000,
                options: [
                    {desc: "玩家攻击加成总和提升120000倍", type: "attackMultiplier", value: 120000},
                    {desc: "玩家爆伤总和提升140000倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 140000}},
                    {desc: "玩家生命加成总和提升120倍", type: "healthMultiplier", value: 120}
                ]
            },
            {
                requiredStage: 8500,
                options: [
                    {desc: "玩家攻击加成总和提升220000倍", type: "attackMultiplier", value: 220000},
                    {desc: "玩家爆伤总和提升250000倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 250000}},
                    {desc: "玩家生命加成总和提升145倍", type: "healthMultiplier", value: 145}
                ]
            },
            {
                requiredStage: 9000,
                options: [
                    {desc: "玩家攻击加成总和提升400000倍", type: "attackMultiplier", value: 400000},
                    {desc: "玩家爆伤总和提升450000倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 450000}},
                    {desc: "玩家生命加成总和提升175倍", type: "healthMultiplier", value: 175}
                ]
            },
            {
                requiredStage: 9500,
                options: [
                    {desc: "玩家攻击加成总和提升700000倍", type: "attackMultiplier", value: 700000},
                    {desc: "玩家爆伤总和提升800000倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 800000}},
                    {desc: "玩家生命加成总和提升210倍", type: "healthMultiplier", value: 210}
                ]
            },
            {
                requiredStage: 10000,
                options: [
                    {desc: "玩家攻击加成总和提升1200000倍", type: "attackMultiplier", value: 1200000},
                    {desc: "玩家爆伤总和提升1400000倍", type: "critMultiplier", value: {chance: 0.01, multiplier: 1400000}},
                    {desc: "玩家生命加成总和提升250倍", type: "healthMultiplier", value: 250}
                ]
            }
        ],
        // 二转职业配置
        secondJobs: {
            berserker: {
                name: "狂战士",
                requiredTower: 150000,
                bonus: { attackMultiplier: 10 }
            },
            swordSoul: {
                name: "剑魂", 
                requiredTower: 150000,
                bonus: { critMultiplier: 10 }
            },
            asura: {
                name: "阿修罗",
                requiredTower: 150000, 
                bonus: { healthMultiplier: 5 }
            }
        },
        // 三转职业配置
        thirdJobs: {
            bloodGod: {
                name: "狱血魔神",
                requiredTower: 300000,
                baseJob: "berserker",
                bonus: { attackMultiplier: 100 }
            },
            swordSaint: {
                name: "剑圣",
                requiredTower: 300000,
                baseJob: "swordSoul", 
                bonus: { critMultiplier: 100 }
            },
            darkLord: {
                name: "大暗黑天",
                requiredTower: 300000,
                baseJob: "asura",
                bonus: { healthMultiplier: 25 }
            }
        },
        // 四转职业配置
        fourthJobs: {
            bloodEmperor: {
                name: "帝血弑天",
                requiredTower: 400000,
                baseJob: "bloodGod",
                bonus: { attackMultiplier: 1000 }
            },
            swordGod: {
                name: "剑神",
                requiredTower: 400000,
                baseJob: "swordSaint",
                bonus: { critMultiplier: 1000 }
            },
            heavenlyEmperor: {
                name: "天帝",
                requiredTower: 300000,
                baseJob: "darkLord",
                bonus: { healthMultiplier: 50 }
            }
        },
        fifthJobs: {
            bloodHeavenLord: {
                name: "血弑天尊",
                requiredTower: 400000,
                baseJob: "bloodEmperor",
                bonus: { attackMultiplier: 10000 }
            },
            supremeSwordLord: {
                name: "无上剑尊",
                requiredTower: 400000,
                baseJob: "swordGod",
                bonus: { critMultiplier: 10000 }
            },
            nineHeavenLord: {
                name: "九霄天君",
                requiredTower: 400000,
                baseJob: "heavenlyEmperor",
                bonus: { healthMultiplier: 100 }
            }
        },
        sixthJobs: {
            bloodWorldSovereign: {
                name: "万界血主",
                requiredTower: 500000,
                baseJob: "bloodHeavenLord",
                bonus: { attackMultiplier: 100000 }
            },
            primordialSwordSaint: {
                name: "太初剑圣",
                requiredTower: 500000,
                baseJob: "supremeSwordLord",
                bonus: { critMultiplier: 100000 }
            },
            infiniteHeavenEmperor: {
                name: "无极天帝",
                requiredTower: 500000,
                baseJob: "nineHeavenLord",
                bonus: { healthMultiplier: 200 }
            }
        },
        seventhJobs: {
            chaosBloodEmperor: {
                name: "混沌血帝",
                requiredTower: 600000,
                baseJob: "bloodWorldSovereign",
                bonus: { attackMultiplier: 1000000 }
            },
            chaosSwordAncestor: {
                name: "鸿蒙剑祖",
                requiredTower: 600000,
                baseJob: "primordialSwordSaint",
                bonus: { critMultiplier: 1000000 }
            },
            supremeHeavenLord: {
                name: "太上天尊",
                requiredTower: 600000,
                baseJob: "infiniteHeavenEmperor",
                bonus: { healthMultiplier: 500 }
            }
        }
    },
    mage: {
        name: "法师",
        branches: [
            {
                requiredStage: 20,
                options: [
                    {desc: "玩家生命加成总和提升1.1倍", type: "healthMultiplier", value: 1.1},
                    {desc: "副本装备加成总和提升1.2倍", type: "dungeonEquipMultiplier", value: 1.2},
                    {desc: "魂环加成总和提升1.5倍", type: "soulRingMultiplier", value: 1.5}
                ]
            },
            {
                requiredStage: 200,
                options: [
                    {desc: "玩家生命加成总和提升1.3倍", type: "healthMultiplier", value: 1.3},
                    {desc: "副本装备加成总和提升1.8倍", type: "dungeonEquipMultiplier", value: 1.8},
                    {desc: "魂环加成总和提升2倍", type: "soulRingMultiplier", value: 2}
                ]
            },
            {
                requiredStage: 500,
                options: [
                    {desc: "玩家生命加成总和提升2.5倍", type: "healthMultiplier", value: 2.5},
                    {desc: "副本装备加成总和提升3倍", type: "dungeonEquipMultiplier", value: 3},
                    {desc: "魂环加成总和提升4倍", type: "soulRingMultiplier", value: 4}
                ]
            },
            {
                requiredStage: 1000,
                options: [
                    {desc: "玩家生命加成总和提升4倍", type: "healthMultiplier", value: 4},
                    {desc: "副本装备加成总和提升4倍", type: "dungeonEquipMultiplier", value: 4},
                    {desc: "魂环加成总和提升5倍", type: "soulRingMultiplier", value: 5}
                ]
            },
            {
                requiredStage: 1500,
                options: [
                    {desc: "玩家生命加成总和提升5倍", type: "healthMultiplier", value: 5},
                    {desc: "副本装备加成总和提升8倍", type: "dungeonEquipMultiplier", value: 8},
                    {desc: "魂环加成总和提升10倍", type: "soulRingMultiplier", value: 10}
                ]
            },
            {
                requiredStage: 2000,
                options: [
                    {desc: "玩家生命加成总和提升9倍", type: "healthMultiplier", value: 9},
                    {desc: "副本装备加成总和提升15倍", type: "dungeonEquipMultiplier", value: 15},
                    {desc: "魂环加成总和提升20倍", type: "soulRingMultiplier", value: 20}
                ]
            },
            {
                requiredStage: 2500,
                options: [
                    {desc: "玩家生命加成总和提升12倍", type: "healthMultiplier", value: 12},
                    {desc: "副本装备加成总和提升20倍", type: "dungeonEquipMultiplier", value: 20},
                    {desc: "魂环加成总和提升30倍", type: "soulRingMultiplier", value: 30}
                ]
            },
            {
                requiredStage: 3000,
                options: [
                    {desc: "玩家生命加成总和提升15倍", type: "healthMultiplier", value: 15},
                    {desc: "副本装备加成总和提升30倍", type: "dungeonEquipMultiplier", value: 30},
                    {desc: "魂环加成总和提升50倍", type: "soulRingMultiplier", value: 50}
                ]
            },
            {
                requiredStage: 3500,
                options: [
                    {desc: "玩家生命加成总和提升18倍", type: "healthMultiplier", value: 18},
                    {desc: "副本装备加成总和提升50倍", type: "dungeonEquipMultiplier", value: 50},
                    {desc: "魂环加成总和提升60倍", type: "soulRingMultiplier", value: 60}
                ]
            },
            {
                requiredStage: 4000,
                options: [
                    {desc: "玩家生命加成总和提升20倍", type: "healthMultiplier", value: 20},
                    {desc: "副本装备加成总和提升70倍", type: "dungeonEquipMultiplier", value: 70},
                    {desc: "魂环加成总和提升80倍", type: "soulRingMultiplier", value: 80}
                ]
            },
            {
                requiredStage: 4500,
                options: [
                    {desc: "玩家生命加成总和提升25倍", type: "healthMultiplier", value: 25},
                    {desc: "副本装备加成总和提升80倍", type: "dungeonEquipMultiplier", value: 80},
                    {desc: "魂环加成总和提升100倍", type: "soulRingMultiplier", value: 100}
                ]
            },
            {
                requiredStage: 5000,
                options: [
                    {desc: "玩家生命加成总和提升30倍", type: "healthMultiplier", value: 30},
                    {desc: "副本装备加成总和提升100倍", type: "dungeonEquipMultiplier", value: 100},
                    {desc: "魂环加成总和提升130倍", type: "soulRingMultiplier", value: 130}
                ]
            },
            {
                requiredStage: 5500,
                options: [
                    {desc: "玩家生命加成总和提升36倍", type: "healthMultiplier", value: 36},
                    {desc: "副本装备加成总和提升130倍", type: "dungeonEquipMultiplier", value: 130},
                    {desc: "魂环加成总和提升170倍", type: "soulRingMultiplier", value: 170}
                ]
            },
            {
                requiredStage: 6000,
                options: [
                    {desc: "玩家生命加成总和提升42倍", type: "healthMultiplier", value: 42},
                    {desc: "副本装备加成总和提升170倍", type: "dungeonEquipMultiplier", value: 170},
                    {desc: "魂环加成总和提升220倍", type: "soulRingMultiplier", value: 220}
                ]
            },
            {
                requiredStage: 6500,
                options: [
                    {desc: "玩家生命加成总和提升50倍", type: "healthMultiplier", value: 50},
                    {desc: "副本装备加成总和提升220倍", type: "dungeonEquipMultiplier", value: 220},
                    {desc: "魂环加成总和提升280倍", type: "soulRingMultiplier", value: 280}
                ]
            },
            {
                requiredStage: 7000,
                options: [
                    {desc: "玩家生命加成总和提升60倍", type: "healthMultiplier", value: 60},
                    {desc: "副本装备加成总和提升280倍", type: "dungeonEquipMultiplier", value: 280},
                    {desc: "魂环加成总和提升360倍", type: "soulRingMultiplier", value: 360}
                ]
            },
            {
                requiredStage: 7500,
                options: [
                    {desc: "玩家生命加成总和提升72倍", type: "healthMultiplier", value: 72},
                    {desc: "副本装备加成总和提升360倍", type: "dungeonEquipMultiplier", value: 360},
                    {desc: "魂环加成总和提升460倍", type: "soulRingMultiplier", value: 460}
                ]
            },
            {
                requiredStage: 8000,
                options: [
                    {desc: "玩家生命加成总和提升85倍", type: "healthMultiplier", value: 85},
                    {desc: "副本装备加成总和提升460倍", type: "dungeonEquipMultiplier", value: 460},
                    {desc: "魂环加成总和提升600倍", type: "soulRingMultiplier", value: 600}
                ]
            },
            {
                requiredStage: 8500,
                options: [
                    {desc: "玩家生命加成总和提升100倍", type: "healthMultiplier", value: 100},
                    {desc: "副本装备加成总和提升600倍", type: "dungeonEquipMultiplier", value: 600},
                    {desc: "魂环加成总和提升780倍", type: "soulRingMultiplier", value: 780}
                ]
            },
            {
                requiredStage: 9000,
                options: [
                    {desc: "玩家生命加成总和提升120倍", type: "healthMultiplier", value: 120},
                    {desc: "副本装备加成总和提升780倍", type: "dungeonEquipMultiplier", value: 780},
                    {desc: "魂环加成总和提升1000倍", type: "soulRingMultiplier", value: 1000}
                ]
            },
            {
                requiredStage: 9500,
                options: [
                    {desc: "玩家生命加成总和提升145倍", type: "healthMultiplier", value: 145},
                    {desc: "副本装备加成总和提升1000倍", type: "dungeonEquipMultiplier", value: 1000},
                    {desc: "魂环加成总和提升1300倍", type: "soulRingMultiplier", value: 1300}
                ]
            },
            {
                requiredStage: 10000,
                options: [
                    {desc: "玩家生命加成总和提升175倍", type: "healthMultiplier", value: 175},
                    {desc: "副本装备加成总和提升1300倍", type: "dungeonEquipMultiplier", value: 1300},
                    {desc: "魂环加成总和提升1700倍", type: "soulRingMultiplier", value: 1700}
                ]
            }
        ],
        // 二转职业配置
        secondJobs: {
            elementalist: {
                name: "元素师",
                requiredTower: 100000,
                bonus: { dungeonEquipMultiplier: 3 }
            },
            magicScholar: {
                name: "魔道学者",
                requiredTower: 100000,
                bonus: { soulRingMultiplier: 5 }
            },
            battleMage: {
                name: "战斗法师",
                requiredTower: 100000,
                bonus: { healthMultiplier: 4 }
            }
        },
        // 三转职业配置
        thirdJobs: {
            archmage: {
                name: "大魔导师",
                requiredTower: 200000,
                baseJob: "elementalist",
                bonus: { dungeonEquipMultiplier: 10 }
            },
            magician: {
                name: "魔术师",
                requiredTower: 200000,
                baseJob: "magicScholar",
                bonus: { soulRingMultiplier: 15 }
            },
            battleGoddess: {
                name: "贝亚娜斗神",
                requiredTower: 200000,
                baseJob: "battleMage",
                bonus: { healthMultiplier: 15 }
            }
        },
        // 四转职业配置
        fourthJobs: {
            darkGod: {
                name: "黑暗之神",
                requiredTower: 300000,
                baseJob: "archmage",
                bonus: { dungeonEquipMultiplier: 50 }
            },
            magicSovereign: {
                name: "魔道至尊",
                requiredTower: 300000,
                baseJob: "magician",
                bonus: { soulRingMultiplier: 50 }
            },
            lightGod: {
                name: "光明之神",
                requiredTower: 300000,
                baseJob: "battleGoddess",
                bonus: { healthMultiplier: 30 }
            }
        },
        fifthJobs: {
            abyssArchmage: {
                name: "深渊魔神",
                requiredTower: 400000,
                baseJob: "darkGod",
                bonus: { dungeonEquipMultiplier: 250 }
            },
            soulSovereign: {
                name: "灵魂至尊",
                requiredTower: 400000,
                baseJob: "magicSovereign",
                bonus: { soulRingMultiplier: 250 }
            },
            warDeity: {
                name: "战争女神",
                requiredTower: 400000,
                baseJob: "lightGod",
                bonus: { healthMultiplier: 50 }
            }
        },
        sixthJobs: {
            chaosDarkGod: {
                name: "混沌魔神",
                requiredTower: 500000,
                baseJob: "abyssArchmage",
                bonus: { dungeonEquipMultiplier: 2500 }
            },
            eternalMagician: {
                name: "永恒魔术师",
                requiredTower: 500000,
                baseJob: "soulSovereign",
                bonus: { soulRingMultiplier: 2500 }
            },
            radiantDeity: {
                name: "光辉神祇",
                requiredTower: 500000,
                baseJob: "warDeity",
                bonus: { healthMultiplier: 100 }
            }
        },
        seventhJobs: {
            primordialDarkLord: {
                name: "原初暗主",
                requiredTower: 600000,
                baseJob: "chaosDarkGod",
                bonus: { dungeonEquipMultiplier: 21500 }
            },
            omniscientMagician: {
                name: "全知魔术师",
                requiredTower: 600000,
                baseJob: "eternalMagician",
                bonus: { soulRingMultiplier: 21500 }
            },
            ultimateLightGod: {
                name: "究极光明神",
                requiredTower: 600000,
                baseJob: "radiantDeity",
                bonus: { healthMultiplier: 300 }
            }
        }
    },
 explorer: {
        name: "探险家",
        branches: [
            {
                requiredStage: 20,
                options: [
                    {desc: "世界地图经验获取提升2.5%", type: "worldExpMultiplier", value: 0.025},
                    {desc: "修仙系统经验获取提升2.5%", type: "cultivationExpMultiplier", value: 0.025},
                    {desc: "奥秘系统经验获取提升2.5%", type: "mysteryExpMultiplier", value: 0.025}
                ]
            },
            {
                requiredStage: 200,
                options: [
                    {desc: "世界地图经验获取提升5%", type: "worldExpMultiplier", value: 0.05},
                    {desc: "修仙系统经验获取提升5%", type: "cultivationExpMultiplier", value: 0.05},
                    {desc: "奥秘系统经验获取提升5%", type: "mysteryExpMultiplier", value: 0.05}
                ]
            },
            {
                requiredStage: 500,
                options: [
                    {desc: "世界地图经验获取提升7.5%", type: "worldExpMultiplier", value: 0.075},
                    {desc: "修仙系统经验获取提升7.5%", type: "cultivationExpMultiplier", value: 0.075},
                    {desc: "奥秘系统经验获取提升7.5%", type: "mysteryExpMultiplier", value: 0.075}
                ]
            },
            {
                requiredStage: 1000,
                options: [
                    {desc: "世界地图经验获取提升10%", type: "worldExpMultiplier", value: 0.10},
                    {desc: "修仙系统经验获取提升10%", type: "cultivationExpMultiplier", value: 0.10},
                    {desc: "奥秘系统经验获取提升10%", type: "mysteryExpMultiplier", value: 0.10}
                ]
            },
            {
                requiredStage: 1500,
                options: [
                    {desc: "世界地图经验获取提升12.5%", type: "worldExpMultiplier", value: 0.125},
                    {desc: "修仙系统经验获取提升12.5%", type: "cultivationExpMultiplier", value: 0.125},
                    {desc: "奥秘系统经验获取提升12.5%", type: "mysteryExpMultiplier", value: 0.125}
                ]
            },
            {
                requiredStage: 2000,
                options: [
                    {desc: "世界地图经验获取提升15%", type: "worldExpMultiplier", value: 0.15},
                    {desc: "修仙系统经验获取提升15%", type: "cultivationExpMultiplier", value: 0.15},
                    {desc: "奥秘系统经验获取提升15%", type: "mysteryExpMultiplier", value: 0.15}
                ]
            },
            {
                requiredStage: 2500,
                options: [
                    {desc: "世界地图经验获取提升17.5%", type: "worldExpMultiplier", value: 0.175},
                    {desc: "修仙系统经验获取提升17.5%", type: "cultivationExpMultiplier", value: 0.175},
                    {desc: "奥秘系统经验获取提升17.5%", type: "mysteryExpMultiplier", value: 0.175}
                ]
            },
            {
                requiredStage: 3000,
                options: [
                    {desc: "世界地图经验获取提升20%", type: "worldExpMultiplier", value: 0.20},
                    {desc: "修仙系统经验获取提升20%", type: "cultivationExpMultiplier", value: 0.20},
                    {desc: "奥秘系统经验获取提升20%", type: "mysteryExpMultiplier", value: 0.20}
                ]
            },
            {
                requiredStage: 3500,
                options: [
                    {desc: "世界地图经验获取提升22.5%", type: "worldExpMultiplier", value: 0.225},
                    {desc: "修仙系统经验获取提升22.5%", type: "cultivationExpMultiplier", value: 0.225},
                    {desc: "奥秘系统经验获取提升22.5%", type: "mysteryExpMultiplier", value: 0.225}
                ]
            },
            {
                requiredStage: 4000,
                options: [
                    {desc: "世界地图经验获取提升25%", type: "worldExpMultiplier", value: 0.25},
                    {desc: "修仙系统经验获取提升25%", type: "cultivationExpMultiplier", value: 0.25},
                    {desc: "奥秘系统经验获取提升25%", type: "mysteryExpMultiplier", value: 0.25}
                ]
            },
            {
                requiredStage: 4500,
                options: [
                    {desc: "世界地图经验获取提升30%", type: "worldExpMultiplier", value: 0.30},
                    {desc: "修仙系统经验获取提升30%", type: "cultivationExpMultiplier", value: 0.30},
                    {desc: "奥秘系统经验获取提升30%", type: "mysteryExpMultiplier", value: 0.30}
                ]
            },
            {
                requiredStage: 5000,
                options: [
                    {desc: "世界地图经验获取提升35%", type: "worldExpMultiplier", value: 0.35},
                    {desc: "修仙系统经验获取提升35%", type: "cultivationExpMultiplier", value: 0.35},
                    {desc: "奥秘系统经验获取提升35%", type: "mysteryExpMultiplier", value: 0.35}
                ]
            },
            {
                requiredStage: 5500,
                options: [
                    {desc: "世界地图经验获取提升40%", type: "worldExpMultiplier", value: 0.40},
                    {desc: "修仙系统经验获取提升40%", type: "cultivationExpMultiplier", value: 0.40},
                    {desc: "奥秘系统经验获取提升40%", type: "mysteryExpMultiplier", value: 0.40}
                ]
            },
            {
                requiredStage: 6000,
                options: [
                    {desc: "世界地图经验获取提升45%", type: "worldExpMultiplier", value: 0.45},
                    {desc: "修仙系统经验获取提升45%", type: "cultivationExpMultiplier", value: 0.45},
                    {desc: "奥秘系统经验获取提升45%", type: "mysteryExpMultiplier", value: 0.45}
                ]
            },
            {
                requiredStage: 6500,
                options: [
                    {desc: "世界地图经验获取提升50%", type: "worldExpMultiplier", value: 0.50},
                    {desc: "修仙系统经验获取提升50%", type: "cultivationExpMultiplier", value: 0.50},
                    {desc: "奥秘系统经验获取提升50%", type: "mysteryExpMultiplier", value: 0.50}
                ]
            },
            {
                requiredStage: 7000,
                options: [
                    {desc: "世界地图经验获取提升55%", type: "worldExpMultiplier", value: 0.55},
                    {desc: "修仙系统经验获取提升55%", type: "cultivationExpMultiplier", value: 0.55},
                    {desc: "奥秘系统经验获取提升55%", type: "mysteryExpMultiplier", value: 0.55}
                ]
            },
            {
                requiredStage: 7500,
                options: [
                    {desc: "世界地图经验获取提升60%", type: "worldExpMultiplier", value: 0.60},
                    {desc: "修仙系统经验获取提升60%", type: "cultivationExpMultiplier", value: 0.60},
                    {desc: "奥秘系统经验获取提升60%", type: "mysteryExpMultiplier", value: 0.60}
                ]
            },
            {
                requiredStage: 8000,
                options: [
                    {desc: "世界地图经验获取提升65%", type: "worldExpMultiplier", value: 0.65},
                    {desc: "修仙系统经验获取提升65%", type: "cultivationExpMultiplier", value: 0.65},
                    {desc: "奥秘系统经验获取提升65%", type: "mysteryExpMultiplier", value: 0.65}
                ]
            },
            {
                requiredStage: 8500,
                options: [
                    {desc: "世界地图经验获取提升70%", type: "worldExpMultiplier", value: 0.70},
                    {desc: "修仙系统经验获取提升70%", type: "cultivationExpMultiplier", value: 0.70},
                    {desc: "奥秘系统经验获取提升70%", type: "mysteryExpMultiplier", value: 0.70}
                ]
            },
            {
                requiredStage: 9000,
                options: [
                    {desc: "世界地图经验获取提升75%", type: "worldExpMultiplier", value: 0.75},
                    {desc: "修仙系统经验获取提升75%", type: "cultivationExpMultiplier", value: 0.75},
                    {desc: "奥秘系统经验获取提升75%", type: "mysteryExpMultiplier", value: 0.75}
                ]
            },
            {
                requiredStage: 9500,
                options: [
                    {desc: "世界地图经验获取提升80%", type: "worldExpMultiplier", value: 0.80},
                    {desc: "修仙系统经验获取提升80%", type: "cultivationExpMultiplier", value: 0.80},
                    {desc: "奥秘系统经验获取提升80%", type: "mysteryExpMultiplier", value: 0.80}
                ]
            },
            {
                requiredStage: 10000,
                options: [
                    {desc: "世界地图经验获取提升90%", type: "worldExpMultiplier", value: 0.90},
                    {desc: "修仙系统经验获取提升90%", type: "cultivationExpMultiplier", value: 0.90},
                    {desc: "奥秘系统经验获取提升90%", type: "mysteryExpMultiplier", value: 0.90}
                ]
            }
        ],
        // 二转职业配置
        secondJobs: {
            pathfinder: {
                name: "堪舆师",
                requiredTower: 100000,
                bonus: { worldExpMultiplier: 1.1 }
            },
            adventurer: {
                name: "问道客",
                requiredTower: 100000,
                bonus: { cultivationExpMultiplier: 1.1 }
            },
            scholar: {
                name: "解律者",
                requiredTower: 100000,
                bonus: { mysteryExpMultiplier: 1.1 }
            }
        },
        // 三转职业配置
        thirdJobs: {
            explorerKing: {
                name: "山河司命",
                requiredTower: 200000,
                baseJob: "pathfinder",
                bonus: { worldExpMultiplier: 1.2 }
            },
            legendAdventurer: {
                name: "归墟引渡人",
                requiredTower: 200000,
                baseJob: "adventurer",
                bonus: { cultivationExpMultiplier: 1.2 }
            },
            mysteryMaster: {
                name: "御法真君",
                requiredTower: 200000,
                baseJob: "scholar",
                bonus: { mysteryExpMultiplier: 1.2 }
            }
        },
        // 四转职业配置
        fourthJobs: {
            worldWalker: {
                name: "造化寰宇主",
                requiredTower: 300000,
                baseJob: "explorerKing",
                bonus: { worldExpMultiplier: 1.3 }
            },
            immortalExplorer: {
                name: "天命窥秘师",
                requiredTower: 300000,
                baseJob: "legendAdventurer",
                bonus: { cultivationExpMultiplier: 1.3 }
            },
            mysteryGod: {
                name: "万法道主",
                requiredTower: 300000,
                baseJob: "mysteryMaster",
                bonus: { mysteryExpMultiplier: 1.3 }
            }
        },
        fifthJobs: {
            cosmicWalker: {
                name: "寰宇行者",
                requiredTower: 400000,
                baseJob: "worldWalker",
                bonus: { worldExpMultiplier: 1.4 }
            },
            fateSeeker: {
                name: "天命探寻者",
                requiredTower: 400000,
                baseJob: "immortalExplorer",
                bonus: { cultivationExpMultiplier: 1.4 }
            },
            lawSovereign: {
                name: "万法至尊",
                requiredTower: 400000,
                baseJob: "mysteryGod",
                bonus: { mysteryExpMultiplier: 1.4 }
            }
        },
        sixthJobs: {
            voidWalker: {
                name: "虚空行者",
                requiredTower: 500000,
                baseJob: "cosmicWalker",
                bonus: { worldExpMultiplier: 1.5 }
            },
            destinyGuide: {
                name: "天命引路人",
                requiredTower: 500000,
                baseJob: "fateSeeker",
                bonus: { cultivationExpMultiplier: 1.5 }
            },
            supremeLawLord: {
                name: "至高法主",
                requiredTower: 500000,
                baseJob: "lawSovereign",
                bonus: { mysteryExpMultiplier: 1.5 }
            }
        },
        seventhJobs: {
            chaosWalker: {
                name: "混沌行者",
                requiredTower: 600000,
                baseJob: "voidWalker",
                bonus: { worldExpMultiplier: 1.6 }
            },
            eternalSeeker: {
                name: "永恒问道者",
                requiredTower: 600000,
                baseJob: "destinyGuide",
                bonus: { cultivationExpMultiplier: 1.6 }
            },
            primordialLawGod: {
                name: "原初法神",
                requiredTower: 600000,
                baseJob: "supremeLawLord",
                bonus: { mysteryExpMultiplier: 1.6 }
            }
        }
    }
};

// 切换职业系统界面显示
function toggleClassSystem() {
    if (player.reincarnationCount < 20) {
        alert("需要达到20转才能开启职业系统！");
        return;
    }
    const ui = document.getElementById('classSystemUI');
    const overlay = document.getElementById('classSystemOverlay');
    const isOpen = ui && (ui.style.display === 'flex' || ui.style.display === 'block');

    if (isOpen) {
        if (ui) ui.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
    } else {
        if (typeof window.__classBranchTab !== 'string') window.__classBranchTab = 'all';
        updateClassSystemDisplay();
        if (ui) ui.style.display = 'flex';
        if (overlay) overlay.style.display = 'block';
    }
}

function switchClassBranchTab(branchKey) {
    window.__classBranchTab = branchKey || 'all';
    document.querySelectorAll('#classBranchTabs .title-tab').forEach((tab) => {
        tab.classList.toggle('active', tab.getAttribute('data-branch') === window.__classBranchTab);
    });
    document.querySelectorAll('#classBranchesBody .titleBranch, #classBranchesBody .class-section').forEach((section) => {
        const key = section.getAttribute('data-branch');
        const show = window.__classBranchTab === 'all' || window.__classBranchTab === key;
        section.classList.toggle('is-hidden', !show);
    });
}

function getFullClassDisplayName() {
    if (!player.class) return '';
    let fullClassName = classConfig[player.class].name;
    if (player.classSeventh) {
        fullClassName += `·${classConfig[player.class].seventhJobs[player.classSeventh].name}`;
    } else if (player.classSixth) {
        fullClassName += `·${classConfig[player.class].sixthJobs[player.classSixth].name}`;
    } else if (player.classFifth) {
        fullClassName += `·${classConfig[player.class].fifthJobs[player.classFifth].name}`;
    } else if (player.classFourth) {
        fullClassName += `·${classConfig[player.class].fourthJobs[player.classFourth].name}`;
    } else if (player.classThird) {
        fullClassName += `·${classConfig[player.class].thirdJobs[player.classThird].name}`;
    } else if (player.classSecond) {
        fullClassName += `·${classConfig[player.class].secondJobs[player.classSecond].name}`;
    }
    return fullClassName;
}

function getClassBranchCounts() {
    if (!player.class) return { selected: 0, total: 0 };
    const branches = classConfig[player.class].branches;
    const total = branches.length;
    let selected = 0;
    branches.forEach((branch, index) => {
        const opt = player.classBranches[index];
        if (opt !== undefined && opt !== -1) selected += 1;
    });
    return { selected, total };
}

function updateClassModalSummary() {
    const tier = getClassAdvancementTier();
    const nameEl = document.getElementById('currentClassName');
    if (nameEl) {
        if (!player.class) {
            nameEl.className = 'title-hero-name is-empty';
            nameEl.textContent = '未选择职业';
        } else {
            nameEl.className = 'title-hero-name ' + getClassNameTierClass(tier);
            nameEl.textContent = getFullClassDisplayName();
        }
    }
    const branchCounts = getClassBranchCounts();
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    setText('classTierStat', `${tier}/7`);
    setText('classBranchStat', `${branchCounts.selected}/${branchCounts.total}`);
    setText('classStageStat', String(player.battle.maxStage || 0));
    setText('classTowerStat', String(player.tower.currentFloor || 0));
    setText('classBookStat', String((player.items && player.items.zhiye1) || 0));
    setText('classBranchCountBadge', `${branchCounts.selected}/${branchCounts.total}`);
    setText('classJobsCountBadge', `${tier}/7`);
}

// 选择职业（更换职业需确认后消耗职业转换书）
function openClassChangeConfirmDialog(classType) {
    var overlay = document.getElementById('classChangeConfirmOverlay');
    var dialog = document.getElementById('classChangeConfirmDialog');
    var msg = document.getElementById('classChangeConfirmMessage');
    var yesBtn = document.getElementById('classChangeConfirmYes');
    var noBtn = document.getElementById('classChangeConfirmNo');
    if (!overlay || !dialog || !msg || !yesBtn || !noBtn) {
        if (confirm('更换职业将消耗1本职业转换书，所有职业加成将重置，确定是否使用？')) {
            performSelectClass(classType, true);
        }
        return;
    }
    function close() {
        overlay.style.display = 'none';
        dialog.style.display = 'none';
        yesBtn.onclick = null;
        noBtn.onclick = null;
        overlay.onclick = null;
    }
    msg.textContent = '更换职业将消耗1本职业转换书，所有职业加成将重置，确定是否使用？';
    overlay.style.display = 'block';
    dialog.style.display = 'block';
    yesBtn.onclick = function () {
        close();
        performSelectClass(classType, true);
    };
    noBtn.onclick = function () {
        close();
    };
    overlay.onclick = function () {
        close();
    };
}

function performSelectClass(classType, consumeBook) {
    if (consumeBook) {
        player.items.zhiye1 -= 1;
        player.classBranches = [];
        player.classSecond = null;
        player.classThird = null;
        player.classFourth = null;
        player.classFifth = null;
        player.classSixth = null;
        player.classSeventh = null;
        logAction('消耗1职业转换书，更换职业为' + classConfig[classType].name + '，所有转职状态已重置', 'success');
    }
    player.class = classType;
    updateClassSystemDisplay();
    updatePlayerClassNameDisplay();
    updateDisplay();
}

function selectClass(classType) {
    if (player.class && player.class !== classType) {
        if (player.items.zhiye1 < 1) {
            alert('职业转换书不足，更换职业需要1本职业转换书！');
            return;
        }
        openClassChangeConfirmDialog(classType);
        return;
    }
    performSelectClass(classType, false);
}

function getClassAdvancementTier() {
    if (player.classSeventh) return 7;
    if (player.classSixth) return 6;
    if (player.classFifth) return 5;
    if (player.classFourth) return 4;
    if (player.classThird) return 3;
    if (player.classSecond) return 2;
    if (player.class) return 1;
    return 0;
}

/** 转职阶数越高，职业名渐变彩字越炫（0~7，对齐称号品阶观感） */
function getClassNameTierClass(tier) {
    var t = Math.max(0, Math.min(7, Number(tier) || 0));
    return 'class-name-tier-' + t;
}

function updateClassPathTrack() {
    const track = document.getElementById('classPathTrack');
    if (!track) return;
    const tier = getClassAdvancementTier();
    const labels = ['一转', '二转', '三转', '四转', '五转', '六转', '七转'];
    let html = '';
    for (let i = 1; i <= 7; i++) {
        let state = 'is-locked';
        if (tier > i) state = 'is-done';
        else if (tier === i) state = 'is-current';
        else if (!player.class && i === 1) state = 'is-locked';
        const mark = tier > i ? '✓' : String(i);
        html += `<div class="class-path-step ${state}">
            <span class="class-path-dot">${mark}</span>
            <span class="class-path-label">${labels[i - 1]}</span>
        </div>`;
    }
    track.innerHTML = html;
}

function updateClassSelectionActive() {
    const map = { warrior: 'class-btn-warrior', mage: 'class-btn-mage', explorer: 'class-btn-explorer' };
    Object.keys(map).forEach(function (key) {
        const btn = document.querySelector('#classSelection .' + map[key]);
        if (!btn) return;
        if (player.class === key) btn.classList.add('is-active');
        else btn.classList.remove('is-active');
    });
}

function buildDoneJobBox(tierLabel, jobName, bonusText, jobTier) {
    const nameTierClass = getClassNameTierClass(jobTier || 1);
    return `<div class="class-job-box class-job-box-done">
        <div class="class-job-box-head">
            <h4>${tierLabel}</h4>
            <span class="class-job-tier">已完成</span>
        </div>
        <div class="class-job-box-body">
            <div class="class-job-cards class-job-cards-single">
                <div class="class-job-card is-done">
                    <div class="class-job-card-name ${nameTierClass}">${jobName}</div>
                    <div class="class-job-card-desc">加成：${bonusText}</div>
                </div>
            </div>
        </div>
    </div>`;
}

function buildPromoteJobBox(boxClass, title, tierBadge, jobName, bonusText, btnClass, btnLabel, onclickAttr, jobTier) {
    const nameTierClass = getClassNameTierClass(jobTier || 1);
    return `<div class="class-job-box ${boxClass}">
        <div class="class-job-box-head">
            <h4>${title}</h4>
            <span class="class-job-tier">${tierBadge}</span>
        </div>
        <div class="class-job-box-body">
            <div class="class-job-cards class-job-cards-single">
                <div class="class-job-card">
                    <div class="class-job-card-name ${nameTierClass}">${jobName}</div>
                    <div class="class-job-card-desc">${bonusText}</div>
                    <button type="button" class="class-job-btn ${btnClass}" onclick="${onclickAttr}">${btnLabel}</button>
                </div>
            </div>
        </div>
    </div>`;
}

function findJobByBase(jobs, baseKey) {
    for (const [key, job] of Object.entries(jobs)) {
        if (job.baseJob === baseKey) return { key: key, job: job };
    }
    return null;
}

// 更新职业系统界面显示
function updateClassSystemDisplay() {
    updateClassModalSummary();
    updateClassPathTrack();
    updateClassSelectionActive();

    const branchPointsContainer = document.getElementById('branchPointsContainer');
    const jobsContainer = document.getElementById('classJobsContainer');

    if (!branchPointsContainer || !jobsContainer) {
        updatePlayerClassNameDisplay();
        return;
    }

    if (!player.class) {
        branchPointsContainer.innerHTML = '<div class="class-branch-empty">请先选择本命职业，一转后可在此加点分支</div>';
        jobsContainer.innerHTML = '<div class="class-jobs-empty">请先选择本命职业，通天塔达标后可逐阶转职晋升</div>';
        switchClassBranchTab(window.__classBranchTab || 'all');
        updatePlayerClassNameDisplay();
        return;
    }

    branchPointsContainer.innerHTML = '';
    jobsContainer.innerHTML = '';

    const branches = classConfig[player.class].branches;
    // 已解锁全显示；未解锁只显示紧挨着的下一档，更后面的隐藏
    for (let index = 0; index < branches.length; index++) {
        const branch = branches[index];
        const isUnlocked = player.battle.maxStage >= branch.requiredStage;
        const selectedOption = player.classBranches[index] !== undefined ? player.classBranches[index] : -1;

        const rowClass = isUnlocked ? 'class-branch-row' : 'class-branch-row class-branch-locked';
        let branchHtml = `<div class="${rowClass}">`;
        branchHtml += `<div class="class-branch-title">
            <span class="class-branch-index">${index + 1}</span>
            <span>第${index + 1}排加点</span>
            <span class="class-branch-req">关卡 ${branch.requiredStage}</span>
        </div>`;

        if (!isUnlocked) {
            branchHtml += `<div class="class-branch-locked-msg">未解锁，需最高关卡达到 ${branch.requiredStage}</div>`;
        } else {
            branchHtml += `<div class="class-branch-options">`;
            branch.options.forEach((option, optIndex) => {
                const isSelected = selectedOption === optIndex;
                const optClass = isSelected ? 'class-branch-option class-branch-selected' : 'class-branch-option';
                branchHtml += `
                    <div class="${optClass}" onclick="selectBranch(${index}, ${optIndex})" role="button" tabindex="0">
                        <span>${option.desc}</span>
                        <button type="button" onclick="event.stopPropagation(); selectBranch(${index}, ${optIndex})">${isSelected ? '✓ 已选' : '选择'}</button>
                    </div>
                `;
            });
            branchHtml += `</div>`;
        }

        branchHtml += `</div>`;
        branchPointsContainer.innerHTML += branchHtml;

        if (!isUnlocked) break;
    }

    let jobsHtml = '';

    if (player.tower.currentFloor >= 100000 && !player.classSecond) {
        const entries = Object.entries(classConfig[player.class].secondJobs);
        let cards = '';
        entries.forEach(([key, job]) => {
            cards += `
                <div class="class-job-card" onclick="selectSecondJob('${key}')" role="button" tabindex="0">
                    <div class="class-job-card-name ${getClassNameTierClass(2)}">${job.name}</div>
                    <div class="class-job-card-desc">${getJobBonusDescription(job.bonus)}</div>
                    <button type="button" class="class-job-btn class-job-btn-2" onclick="event.stopPropagation(); selectSecondJob('${key}')">选择此职业</button>
                </div>
            `;
        });
        jobsHtml += `<div class="class-job-box class-job-box-2">
            <div class="class-job-box-head">
                <h4>二转职业选择</h4>
                <span class="class-job-tier">通天塔 10万层</span>
            </div>
            <div class="class-job-box-body">
                <div class="class-job-cards">${cards}</div>
            </div>
        </div>`;
    }

    if (player.classSecond) {
        const job = classConfig[player.class].secondJobs[player.classSecond];
        jobsHtml += buildDoneJobBox('二转职业', job.name, getJobBonusDescription(job.bonus), 2);
    }

    if (player.tower.currentFloor >= 200000 && player.classSecond && !player.classThird) {
        const found = findJobByBase(classConfig[player.class].thirdJobs, player.classSecond);
        if (found) {
            jobsHtml += buildPromoteJobBox(
                'class-job-box-3', '三转职业晋升', '通天塔 20万层',
                found.job.name, getJobBonusDescription(found.job.bonus),
                'class-job-btn-3', '晋升为三转', 'selectThirdJob()', 3
            );
        }
    }

    if (player.classThird) {
        const job = classConfig[player.class].thirdJobs[player.classThird];
        jobsHtml += buildDoneJobBox('三转职业', job.name, getJobBonusDescription(job.bonus), 3);
    }

    if (player.tower.currentFloor >= 300000 && player.classThird && !player.classFourth) {
        const found = findJobByBase(classConfig[player.class].fourthJobs, player.classThird);
        if (found) {
            jobsHtml += buildPromoteJobBox(
                'class-job-box-4', '四转职业晋升', '通天塔 30万层',
                found.job.name, getJobBonusDescription(found.job.bonus),
                'class-job-btn-4', '晋升为四转', 'selectFourthJob()', 4
            );
        }
    }

    if (player.classFourth) {
        const job = classConfig[player.class].fourthJobs[player.classFourth];
        jobsHtml += buildDoneJobBox('四转职业', job.name, getJobBonusDescription(job.bonus), 4);
    }

    if (player.tower.currentFloor >= 400000 && player.classFourth && !player.classFifth) {
        const found = findJobByBase(classConfig[player.class].fifthJobs, player.classFourth);
        if (found) {
            jobsHtml += buildPromoteJobBox(
                'class-job-box-5', '五转职业晋升', '通天塔 40万层',
                found.job.name, getJobBonusDescription(found.job.bonus),
                'class-job-btn-5', '晋升为五转', 'selectFifthJob()', 5
            );
        }
    }

    if (player.classFifth) {
        const job = classConfig[player.class].fifthJobs[player.classFifth];
        jobsHtml += buildDoneJobBox('五转职业', job.name, getJobBonusDescription(job.bonus), 5);
    }

    if (player.tower.currentFloor >= 500000 && player.classFifth && !player.classSixth) {
        const found = findJobByBase(classConfig[player.class].sixthJobs, player.classFifth);
        if (found) {
            jobsHtml += buildPromoteJobBox(
                'class-job-box-6', '六转职业晋升', '通天塔 50万层',
                found.job.name, getJobBonusDescription(found.job.bonus),
                'class-job-btn-6', '晋升为六转', 'selectSixthJob()', 6
            );
        }
    }

    if (player.classSixth) {
        const job = classConfig[player.class].sixthJobs[player.classSixth];
        jobsHtml += buildDoneJobBox('六转职业', job.name, getJobBonusDescription(job.bonus), 6);
    }

    if (player.tower.currentFloor >= 600000 && player.classSixth && !player.classSeventh) {
        const found = findJobByBase(classConfig[player.class].seventhJobs, player.classSixth);
        if (found) {
            jobsHtml += buildPromoteJobBox(
                'class-job-box-7', '七转职业晋升', '通天塔 60万层',
                found.job.name, getJobBonusDescription(found.job.bonus),
                'class-job-btn-7', '晋升为七转', 'selectSeventhJob()', 7
            );
        }
    }

    if (player.classSeventh) {
        const job = classConfig[player.class].seventhJobs[player.classSeventh];
        jobsHtml += buildDoneJobBox('七转职业', job.name, getJobBonusDescription(job.bonus), 7);
    }

    if (!jobsHtml) {
        jobsHtml = '<div class="class-jobs-empty">通天塔达到 10万层后开放二转选择</div>';
    }
    jobsContainer.innerHTML = jobsHtml;

    updateClassModalSummary();
    switchClassBranchTab(window.__classBranchTab || 'all');
    updatePlayerClassNameDisplay();
}
// 辅助函数：获取职业加成描述
function getJobBonusDescription(bonus) {
    const descriptions = [];
    if (bonus.attackMultiplier) descriptions.push(`攻击加成${bonus.attackMultiplier}倍`);
    if (bonus.critMultiplier) descriptions.push(`爆伤加成${bonus.critMultiplier}倍`);
    if (bonus.healthMultiplier) descriptions.push(`生命加成${bonus.healthMultiplier}倍`);
    if (bonus.dungeonEquipMultiplier) descriptions.push(`副本装备加成${bonus.dungeonEquipMultiplier}倍`);
    if (bonus.soulRingMultiplier) descriptions.push(`魂环加成${bonus.soulRingMultiplier}倍`);
    if (bonus.worldExpMultiplier) descriptions.push(`世界地图经验${bonus.worldExpMultiplier}倍`);
    if (bonus.cultivationExpMultiplier) descriptions.push(`修仙经验${bonus.cultivationExpMultiplier}倍`);
    if (bonus.mysteryExpMultiplier) descriptions.push(`奥秘经验${bonus.mysteryExpMultiplier}倍`);
    return descriptions.join('，');
}
// 选择二转职业
function selectSecondJob(jobKey) {
    if (player.tower.currentFloor < 100000) {
        alert("需要通天塔达到10万层才能进行二转！");
        return;
    }
    
    player.classSecond = jobKey;
    logAction(`成功转职为${classConfig[player.class].secondJobs[jobKey].name}！`, 'success');
    updateClassSystemDisplay();
    updatePlayerBattleStats();
}

// 选择三转职业
function selectThirdJob() {
    if (player.tower.currentFloor < 200000) {
        alert("需要通天塔达到20万层才能进行三转！");
        return;
    }
    
    if (!player.classSecond) {
        alert("需要先完成二转才能进行三转！");
        return;
    }
    
    // 自动确定三转职业
    const thirdJobs = classConfig[player.class].thirdJobs;
    for (const [key, job] of Object.entries(thirdJobs)) {
        if (job.baseJob === player.classSecond) {
            player.classThird = key;
            logAction(`成功晋升为三转${job.name}！`, 'success');
            break;
        }
    }
    
    updateClassSystemDisplay();
    updatePlayerBattleStats();
}

// 选择四转职业
function selectFourthJob() {
    if (player.tower.currentFloor < 300000) {
        alert("需要通天塔达到30万层才能进行四转！");
        return;
    }
    
    if (!player.classThird) {
        alert("需要先完成三转才能进行四转！");
        return;
    }
    
    // 自动确定四转职业
    const fourthJobs = classConfig[player.class].fourthJobs;
    for (const [key, job] of Object.entries(fourthJobs)) {
        if (job.baseJob === player.classThird) {
            player.classFourth = key;
            logAction(`成功晋升为四转${job.name}！`, 'success');
            break;
        }
    }
    
    updateClassSystemDisplay();
    updatePlayerBattleStats();
}

// 选择五转职业
function selectFifthJob() {
    if (player.tower.currentFloor < 400000) {
        alert("需要通天塔达到40万层才能进行五转！");
        return;
    }
    if (!player.classFourth) {
        alert("需要先完成四转才能进行五转！");
        return;
    }
    const fifthJobs = classConfig[player.class].fifthJobs;
    for (const [key, job] of Object.entries(fifthJobs)) {
        if (job.baseJob === player.classFourth) {
            player.classFifth = key;
            logAction(`成功晋升为五转${job.name}！`, 'success');
            break;
        }
    }
    updateClassSystemDisplay();
    updatePlayerBattleStats();
}

// 选择六转职业
function selectSixthJob() {
    if (player.tower.currentFloor < 500000) {
        alert("需要通天塔达到50万层才能进行六转！");
        return;
    }
    if (!player.classFifth) {
        alert("需要先完成五转才能进行六转！");
        return;
    }
    const sixthJobs = classConfig[player.class].sixthJobs;
    for (const [key, job] of Object.entries(sixthJobs)) {
        if (job.baseJob === player.classFifth) {
            player.classSixth = key;
            logAction(`成功晋升为六转${job.name}！`, 'success');
            break;
        }
    }
    updateClassSystemDisplay();
    updatePlayerBattleStats();
}

// 选择七转职业
function selectSeventhJob() {
    if (player.tower.currentFloor < 600000) {
        alert("需要通天塔达到60万层才能进行七转！");
        return;
    }
    if (!player.classSixth) {
        alert("需要先完成六转才能进行七转！");
        return;
    }
    const seventhJobs = classConfig[player.class].seventhJobs;
    for (const [key, job] of Object.entries(seventhJobs)) {
        if (job.baseJob === player.classSixth) {
            player.classSeventh = key;
            logAction(`成功晋升为七转${job.name}！`, 'success');
            break;
        }
    }
    updateClassSystemDisplay();
    updatePlayerBattleStats();
}
// 选择分支选项
function selectBranch(branchIndex, optionIndex) {
    // 检查是否解锁
    const branch = classConfig[player.class].branches[branchIndex];
    if (player.battle.maxStage < branch.requiredStage) {
        alert(`需要达到${branch.requiredStage}关才能解锁此分支！`);
        return;
    }
    
    // 保存选择
    player.classBranches[branchIndex] = optionIndex;
    logAction(`选择了${classConfig[player.class].name}第${branchIndex + 1}排第${optionIndex + 1}个分支`, 'success');
    
    // 更新显示
    updateClassSystemDisplay();
    updatePlayerBattleStats();
}

 
// 更新玩家名字旁的职业显示
function updatePlayerClassNameDisplay() {
    const classNameElement = document.getElementById('playerClassName');
    if (!classNameElement) return;
    classNameElement.className = 'player-class-display';
    if (player.class) {
        let displayName = classConfig[player.class].name;
        
        // 添加转职后缀
        if (player.classSeventh) {
            displayName += `·${classConfig[player.class].seventhJobs[player.classSeventh].name}`;
        } else if (player.classSixth) {
            displayName += `·${classConfig[player.class].sixthJobs[player.classSixth].name}`;
        } else if (player.classFifth) {
            displayName += `·${classConfig[player.class].fifthJobs[player.classFifth].name}`;
        } else if (player.classFourth) {
            displayName += `·${classConfig[player.class].fourthJobs[player.classFourth].name}`;
        } else if (player.classThird) {
            displayName += `·${classConfig[player.class].thirdJobs[player.classThird].name}`;
        } else if (player.classSecond) {
            displayName += `·${classConfig[player.class].secondJobs[player.classSecond].name}`;
        }
        
        // 外层保留胶囊底色，内层再套渐变彩字（避免 background 冲突导致空白）
        const tierClass = getClassNameTierClass(getClassAdvancementTier());
        classNameElement.innerHTML = `<span class="class-name-text ${tierClass}">[${displayName}]</span>`;
    } else {
        classNameElement.textContent = '';
    }
}
// 计算职业加成 (需要在战斗计算相关函数中调用)
function calculateClassBonuses() {
    const bonuses = {
        attackMultiplier: 1,
        healthMultiplier: 1,
        critChance: 0,
        critMultiplier: 1,
        collectionMultiplier: 1,
        dungeonEquipMultiplier: 1,
        soulRingMultiplier: 1,
        worldExpMultiplier: 1,
        cultivationExpMultiplier: 1,
        mysteryExpMultiplier: 1
    };
    
    if (!player.class) return bonuses;
    
    const classData = classConfig[player.class];
    if (!classData) return bonuses;
    
    // 累加一转分支加成（原有逻辑）
    const branches = Array.isArray(player.classBranches) ? player.classBranches : [];
    branches.forEach((optionIndex, branchIndex) => {
        if (optionIndex === undefined || optionIndex === null) return;
        
        const branch = classData.branches && classData.branches[branchIndex];
        if (!branch || !Array.isArray(branch.options)) return;
        const option = branch.options[optionIndex];
        if (!option || !option.type) return;
        
        switch (option.type) {
            case 'attackMultiplier':
                bonuses.attackMultiplier *= (1 + option.value);
                break;
            case 'healthMultiplier':
                bonuses.healthMultiplier *= (1 + option.value);
                break;
            case 'critMultiplier':
                if (option.value.multiplier) {
                    bonuses.critMultiplier *= (1 + option.value.multiplier);
                } else {
                    bonuses.critMultiplier *= (1 + option.value);
                }
                break;
            case 'dungeonEquipMultiplier':
                bonuses.dungeonEquipMultiplier *= (1 + option.value);
                break;
            case 'soulRingMultiplier':
                bonuses.soulRingMultiplier *= (1 + option.value);
                break;
          case 'worldExpMultiplier':
                bonuses.worldExpMultiplier *= (1 + option.value);
                break;
            case 'cultivationExpMultiplier':
                bonuses.cultivationExpMultiplier *= (1 + option.value);
                break;
            case 'mysteryExpMultiplier':
                bonuses.mysteryExpMultiplier *= (1 + option.value);
                break;
        }
    });
    
    // 新增：应用二转职业加成
    if (player.classSecond) {
        const secondJob = classData.secondJobs[player.classSecond];
        if (secondJob && secondJob.bonus) {
            for (const [key, value] of Object.entries(secondJob.bonus)) {
                if (bonuses[key] !== undefined) {
                    bonuses[key] *= value;
                }
            }
        }
    }
    
    // 新增：应用三转职业加成
    if (player.classThird) {
        const thirdJob = classData.thirdJobs[player.classThird];
        if (thirdJob && thirdJob.bonus) {
            for (const [key, value] of Object.entries(thirdJob.bonus)) {
                if (bonuses[key] !== undefined) {
                    bonuses[key] *= value;
                }
            }
        }
    }
    
    // 新增：应用四转职业加成
    if (player.classFourth) {
        const fourthJob = classData.fourthJobs[player.classFourth];
        if (fourthJob && fourthJob.bonus) {
            for (const [key, value] of Object.entries(fourthJob.bonus)) {
                if (bonuses[key] !== undefined) {
                    bonuses[key] *= value;
                }
            }
        }
    }

    // 新增：应用五转职业加成
    if (player.classFifth) {
        const fifthJob = classData.fifthJobs[player.classFifth];
        if (fifthJob && fifthJob.bonus) {
            for (const [key, value] of Object.entries(fifthJob.bonus)) {
                if (bonuses[key] !== undefined) {
                    bonuses[key] *= value;
                }
            }
        }
    }

    // 新增：应用六转职业加成
    if (player.classSixth) {
        const sixthJob = classData.sixthJobs[player.classSixth];
        if (sixthJob && sixthJob.bonus) {
            for (const [key, value] of Object.entries(sixthJob.bonus)) {
                if (bonuses[key] !== undefined) {
                    bonuses[key] *= value;
                }
            }
        }
    }

    // 新增：应用七转职业加成
    if (player.classSeventh) {
        const seventhJob = classData.seventhJobs[player.classSeventh];
        if (seventhJob && seventhJob.bonus) {
            for (const [key, value] of Object.entries(seventhJob.bonus)) {
                if (bonuses[key] !== undefined) {
                    bonuses[key] *= value;
                }
            }
        }
    }
    
    return bonuses;
}
// 黑龙潭副本数据
const blackDragonAbyss = {
    bossLevel: 1,
    bossHealth: 1e50,
    bossMaxHealth: 1e50,
    bossAttack: 1e5,
    bossResurrections: 0,
    isBattleActive: false,
    playerHealth: 0,
    playerMaxHealth: 0,
    playerAttack: 0,
    playerCritRate: 0,
    playerCritDamage: 0
};

// 初始化黑龙潭副本
function initBlackDragonAbyss() {
    // 确保玩家数据中有副本令牌
    if (player.items.fuben1 === undefined) {
        player.items.fuben1 = 0;
    }
}


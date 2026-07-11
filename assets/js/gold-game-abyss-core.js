// 无限深渊核心
// 无限深渊
// ==================== 无限深渊系统 ====================
var abyssRun = null;
var abyssSelectedClass = 'warrior';

var ABYSS_CLASSES = [
    { id: 'warrior', name: '战士', desc: '攻击+30，生命+450，防御+28；力量转化攻击+50%，体力转化生命/防御+40%。专属被动：战意(普攻+15%伤害)、坚韧(单次伤害>20%最大生命时减伤15%)、怒战(半血以下伤害+25%/吸血+8%)、斩杀回血(击杀回复6%最大生命)、召唤旺财(可以召唤一只旺财)', bonus: { atk: 30, hp: 450, def: 28 }, strConversionMult: 1.5, staConversionMult: 1.4 },
    { id: 'mage', name: '法师', desc: '攻击+22，生命+340，防御+18，技能伤害+38%；智力转化技能伤害+55%。专属被动：奥术专注(技能伤害+15%)、法力护盾(魔法≥50%时每回合获得6%最大生命护盾)、法术穿透(技能无视12%怪物防御)、回响(击杀回复20%最大魔法)、诱惑之光(可以复制一个怪物为召唤兽)', bonus: { atk: 22, hp: 340, def: 18, skillDmg: 38 }, intToSkillDmgMult: 1.55 },
    { id: 'archer', name: '射手', desc: '攻击+20，生命+260，防御+12，暴击率+10%，闪避+8%；敏捷转化暴击/闪避+30%。专属被动：神射(暴击伤害+12%)、破甲箭(普攻无视10%怪物防御)、疾风步(造成伤害后本回合闪避+10%)、追猎(击杀回复15%最大魔法)', bonus: { atk: 20, hp: 260, def: 12, critRate: 10, dodge: 8 }, agiMult: 1.3 },
    { id: 'tamer', name: '驯兽师', desc: '生命+320，防御+18；宠物攻击+15%、宠物生命+12%、宠物防御+10%；出战宠物属性额外+8%；出战宠物+1；初始宠物+1；复活宠物(可以复活宠物)', bonus: { hp: 320, def: 18 }, petAtkPct: 15, petHpPct: 12, petDefPct: 10, petBonusMult: 1.08 },
    { id: 'onmyoji', name: '阴阳师', desc: '攻击+18，生命+280，防御+14，技能伤害+25%；可召唤妖怪与式神，总召唤上限4只；专属：式神强化(可强化召唤兽攻防)、符咒伤害、结界护盾', bonus: { atk: 18, hp: 280, def: 14, skillDmg: 25 }, intToSkillDmgMult: 1.3 },
    { id: 'mechanic', name: '机械师', desc: '攻击+24，生命+320，防御+22，技能伤害+30%，减少怪物防御+10%；专属：机械铠甲(出场自带6件机械铠甲，无法卸下与更换，自动成长)、战地回收(每击杀数层小幅强化自身)、机甲形态(短时间提升全属性)、机械飞升(每存在一个召唤兽玩家每回合回复生命5%攻击10%防御10%)', bonus: { atk: 24, hp: 320, def: 22, skillDmg: 30, reduceMonsterDef: 10 } },
    { id: 'jester', name: '戏命师', desc: '攻击+34，生命+360，防御+22，技能伤害+30%；专属：所有核心技能都带50%概率正收益/50%概率负收益，并附带赌徒增幅（欧皇更高上限，非酋也有保底）；绑定技能「戏命运」「命运傀儡」固定在第4/5技能槽。', bonus: { atk: 34, hp: 360, def: 22, skillDmg: 30 } },
    { id: 'riftbinder', name: '异界御灵', desc: '攻击+20，生命+340，防御+24，技能伤害+24%；宠物攻击+18%、宠物生命+18%、宠物防御+18%；专精深渊神兽与宠物流护盾，不含召唤技能。绑定技能「界兽誓约」「深渊兽甲」「灵宠镜盾」固定在第4/5/6技能槽。', bonus: { atk: 20, hp: 340, def: 24, skillDmg: 24 }, petAtkPct: 18, petHpPct: 18, petDefPct: 18, petBonusMult: 1.12 }
];
// 每职业1转通用称号，2~4转按分支（共4个分支）
var ABYSS_ZHUAN_TITLES = {
    warrior: { 1: '战士', branchA: { 2: '破军·战将', 3: '破军·战神', 4: '破军·武帝' }, branchB: { 2: '铁壁·战将', 3: '铁壁·战神', 4: '铁壁·武帝' }, branchC: { 2: '狂战·战将', 3: '狂战·战神', 4: '狂战·武帝' }, branchD: { 2: '控场·战将', 3: '控场·战神', 4: '控场·武帝' } },
    mage: { 1: '法师', branchA: { 2: '元素·魔导师', 3: '元素·大魔导', 4: '元素·法圣' }, branchB: { 2: '虚空·魔导师', 3: '虚空·大魔导', 4: '虚空·法圣' }, branchC: { 2: '圣愈·魔导师', 3: '圣愈·大魔导', 4: '圣愈·法圣' }, branchD: { 2: '诅咒·魔导师', 3: '诅咒·大魔导', 4: '诅咒·法圣' } },
    archer: { 1: '射手', branchA: { 2: '狩魂·神射', 3: '狩魂·箭神', 4: '狩魂·狩天' }, branchB: { 2: '神射·神射', 3: '神射·箭神', 4: '神射·狩天' }, branchC: { 2: '陷阱·神射', 3: '陷阱·箭神', 4: '陷阱·狩天' }, branchD: { 2: '疾风·神射', 3: '疾风·箭神', 4: '疾风·狩天' } },
    tamer: { 1: '驯兽师', branchA: { 2: '御兽·驯兽使', 3: '御兽·兽王', 4: '御兽·万兽尊' }, branchB: { 2: '护主·驯兽使', 3: '护主·兽王', 4: '护主·万兽尊' }, branchC: { 2: '兽群·驯兽使', 3: '兽群·兽王', 4: '兽群·万兽尊' }, branchD: { 2: '兽魂·驯兽使', 3: '兽魂·兽王', 4: '兽魂·万兽尊' } },
    onmyoji: { 1: '阴阳师', branchA: { 2: '式神·阴阳使', 3: '式神·阴阳师', 4: '式神·大阴阳师' }, branchB: { 2: '妖怪·阴阳使', 3: '妖怪·阴阳师', 4: '妖怪·大阴阳师' }, branchC: { 2: '咒术·阴阳使', 3: '咒术·阴阳师', 4: '咒术·大阴阳师' }, branchD: { 2: '结界·阴阳使', 3: '结界·阴阳师', 4: '结界·大阴阳师' } },
    mechanic: { 1: '机械师', branchA: { 2: '战地·技师', 3: '战地·机甲师', 4: '战地·统筹者' }, branchB: { 2: '机仆·设计师', 3: '机仆·统率者', 4: '机仆·集群指挥' }, branchC: { 2: '干扰·黑客', 3: '干扰·控制师', 4: '干扰·战术中枢' }, branchD: { 2: '过载·实验者', 3: '过载·爆破师', 4: '过载·终端意志' } },
    jester: { 1: '戏命师', branchA: { 2: '红桃·弄命者', 3: '红桃·改命者', 4: '红桃·天命主' }, branchB: { 2: '黑桃·噬运者', 3: '黑桃·断运者', 4: '黑桃·绝运主' }, branchC: { 2: '方块·博弈者', 3: '方块·赔率师', 4: '方块·庄家王' }, branchD: { 2: '梅花·混沌者', 3: '梅花·灾福师', 4: '梅花·命轮皇' } },
    riftbinder: { 1: '异界御灵', branchA: { 2: '虚界·契灵者', 3: '虚界·谐律师', 4: '虚界·终律主' }, branchB: { 2: '渊甲·守誓者', 3: '渊甲·壁垒师', 4: '渊甲·不坠主' }, branchC: { 2: '星蚀·缚咒者', 3: '星蚀·灾相师', 4: '星蚀·寂灭主' }, branchD: { 2: '终焉·同调者', 3: '终焉·命印师', 4: '终焉·界轮主' } }
};
// 二转分支名称与描述（用于选择弹窗，共4个分支）
var ABYSS_BRANCH_INFO = {
    warrior: { branchA: { name: '破军', desc: '偏爆发与破甲，单体高伤、破防与吸血' }, branchB: { name: '铁壁', desc: '偏生存与反伤，减伤、反伤与群体控场' }, branchC: { name: '狂战', desc: '偏嗜血与连击，高攻、吸血与多段打击' }, branchD: { name: '控场', desc: '偏眩晕与群体，控场、AOE与减速' } },
    mage: { branchA: { name: '元素', desc: '偏元素与AOE，群体伤害、控制与护盾' }, branchB: { name: '虚空', desc: '偏虚空与穿透，无视魔抗、单体爆发' }, branchC: { name: '圣愈', desc: '偏治疗与护盾，回复、增益与生存' }, branchD: { name: '诅咒', desc: '偏减益与持续伤害，虚弱、侵蚀与削弱' } },
    archer: { branchA: { name: '狩魂', desc: '偏召唤与多目标，召唤兽、箭雨与持续输出' }, branchB: { name: '神射', desc: '偏暴击与单体，必暴、穿甲与斩杀' }, branchC: { name: '陷阱', desc: '偏陷阱与控场，定身、眩晕与持续伤' }, branchD: { name: '疾风', desc: '偏连击与闪避，多段、疾射与身法' } },
    tamer: { branchA: { name: '御兽', desc: '偏宠物攻击，宠物攻加成、破甲与爆发' }, branchB: { name: '护主', desc: '偏宠物生存，宠物血防、减伤与回复' }, branchC: { name: '兽群', desc: '偏多宠协同，群体宠物增益与连携' }, branchD: { name: '兽魂', desc: '偏宠物爆发，暴击、斩杀与短时强化' } },
    onmyoji: { branchA: { name: '式神', desc: '偏式神召唤与增益，式神强化与多召唤' }, branchB: { name: '妖怪', desc: '偏妖怪召唤与爆发，高伤与群攻' }, branchC: { name: '咒术', desc: '偏符咒伤害与减益，诅咒与穿透' }, branchD: { name: '结界', desc: '偏结界生存，护盾、减伤与召唤物存活' } },
    mechanic: { branchA: { name: '战地工程', desc: '偏持续强化机械铠甲，自修·护盾与层数成长' }, branchB: { name: '机器人军团', desc: '偏多机器人协同作战，召唤与群体增益' }, branchC: { name: '干扰黑客', desc: '偏控制与削弱，降低怪物输出并减少所受伤害' }, branchD: { name: '过载爆破', desc: '偏自损换爆发，自爆机器人与短时高额增伤' } },
    jester: { branchA: { name: '红桃赌命', desc: '偏攻击与暴击，50%狂暴增益 / 50%自废武功' }, branchB: { name: '黑桃献祭', desc: '偏生命与护盾，50%续航暴涨 / 50%血线崩盘' }, branchC: { name: '方块赔率', desc: '偏技能与破甲，50%高爆发 / 50%刮痧反噬' }, branchD: { name: '梅花混沌', desc: '偏控场与全能，50%神技 / 50%负面翻车' } },
    riftbinder: { branchA: { name: '虚界契灵', desc: '偏深渊神兽与宠物输出同调，爆发型增益' }, branchB: { name: '渊甲守望', desc: '偏宠物护盾与承伤联动，高生存反打' }, branchC: { name: '星蚀咒缚', desc: '偏减益与易伤扩散，宠物流持续压制' }, branchD: { name: '终焉同调', desc: '偏全属性协同，宠物与神兽共同抬升上限' } }
};
function abyssZhuanTitle(classId, zhuan, branch) {
    var t = ABYSS_ZHUAN_TITLES[classId || 'warrior'];
    if (!t) return zhuan + '转';
    if (zhuan === 1) return (t[1] || '') + '·1转';
    var b = (branch && t[branch]) ? t[branch] : null;
    return (b && b[zhuan]) ? b[zhuan] + '·' + zhuan + '转' : (zhuan + '转');
}
function abyssApplyGambleSkill(skill) {
    if (!skill || !skill.gambleEffects || !skill.gambleEffects.length) return skill;
    var resolved = JSON.parse(JSON.stringify(skill));
    var isJesterSkill = !!(resolved.id && (String(resolved.id).indexOf('jes_') === 0 || String(resolved.id).indexOf('jester_') === 0));
    function scalePatchNumbers(patch, factor) {
        if (!patch || factor === 1) return;
        for (var key in patch) {
            if (!Object.prototype.hasOwnProperty.call(patch, key)) continue;
            if (typeof patch[key] === 'number') patch[key] = patch[key] * factor;
        }
    }
    function merge(target, patch) {
        if (!patch) return;
        for (var k in patch) {
            if (!Object.prototype.hasOwnProperty.call(patch, k)) continue;
            var v = patch[k];
            if (typeof v === 'number') target[k] = (typeof target[k] === 'number') ? (target[k] + v) : v;
            else target[k] = v;
        }
    }
    for (var gi = 0; gi < resolved.gambleEffects.length; gi++) {
        var g = resolved.gambleEffects[gi];
        if (isJesterSkill) {
            // 戏命师技能统一强化：正负效果都提升100%（x2）
            scalePatchNumbers(g.up, 2);
            scalePatchNumbers(g.down, 2);
        }
        var winChance = (g.gambleWinChance != null && !isNaN(g.gambleWinChance)) ? g.gambleWinChance : 0.5;
        var ok = Math.random() < winChance;
        merge(resolved, ok ? g.up : g.down);
        if (isJesterSkill) {
            if (ok) {
                // 欧皇额外加码：让戏命师上限更高
                merge(resolved, { damageIncreasePct: 12, critDmgBonus: 25, buffRounds: 1 });
            } else {
                // 非酋保底：负面触发时补一点生存，避免过度暴毙
                merge(resolved, { shieldPct: 0.12, reduceDmgPct: 12, buffRounds: 1 });
            }
        }
        if (typeof abyssLog === 'function') abyssLog('【' + (resolved.name || '赌技') + '】' + (g.label || '命运判定') + '：' + (ok ? '欧皇触发' : '非酋触发'));
    }
    delete resolved.gambleEffects;
    return resolved;
}

var ABYSS_TALENTS = [
    { id: 'tal_hp', name: '生命强化', maxLevel: 8, effect: { hp: 130 }, parent: null },
    { id: 'tal_atk', name: '攻击强化', maxLevel: 8, effect: { atk: 24 }, parent: null },
    { id: 'tal_def', name: '护甲强化', maxLevel: 8, effect: { def: 16 }, parent: null },
    { id: 'tal_crit', name: '致命一击', maxLevel: 5, effect: { critRate: 3, critDmg: 12 }, parent: 'tal_atk' },
    { id: 'tal_skill', name: '法术精通', maxLevel: 6, effect: { skillDmg: 8 }, parent: null },
    { id: 'tal_dodge', name: '身轻如燕', maxLevel: 6, effect: { dodge: 5 }, parent: null },
    { id: 'tal_life', name: '吸血', maxLevel: 5, effect: { lifesteal: 2.5 }, parent: 'tal_hp' },
    { id: 'tal_combo', name: '连击', maxLevel: 5, effect: { combo: 3.5 }, parent: 'tal_dodge' },
    { id: 'tal_armor', name: '破甲', maxLevel: 5, effect: { reduceMonsterDef: 5 }, parent: 'tal_atk' },
    { id: 'tal_str', name: '力量专精', maxLevel: 4, effect: { atk: 20 }, effectDesc: '按力量加成攻击（每级约500攻/100力）', parent: 'tal_atk' },
    { id: 'tal_int', name: '智力专精', maxLevel: 4, effect: { skillDmg: 6 }, effectDesc: '按智力加成技能伤害（每级约150%/100智）', parent: 'tal_skill' },
    { id: 'tal_agi', name: '敏捷专精', maxLevel: 4, effect: { critRate: 2.5, dodge: 2 }, effectDesc: '按敏捷加成暴击与闪避（每级约42%暴击、33%闪避/100敏）', parent: 'tal_dodge' },
    { id: 'tal_sta', name: '体力专精', maxLevel: 4, effect: { hp: 110, def: 8 }, effectDesc: '按体力加成生命与防御（每级约2750血、200防/100体）', parent: 'tal_hp' }
];


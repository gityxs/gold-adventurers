// 法宝系统
// 法宝系统配置
const magicToolConfig = {
    // 法宝列表（每个法宝只能获得一个）
    tools: [
        // 初级法宝
     { 
            id: "spirit_gathering_flagaa", 
            name: "青锋剑", 
            description: "<p>后天灵宝<p><p>描述：百炼精钢掺杂微量“青铁”铸成，剑身泛着黯淡的青光，凡俗眼中的神兵利器，但在修士眼中仅是勉强能灌注灵力、比凡铁锋利些的制式兵器。易卷刃，遇强大护体罡气或坚硬妖兽甲壳难以破防。<p><p>神威：①灵力传导：可灌注微薄灵力，使剑身更锋锐、坚固。②青光微闪：夜间舞剑有微弱青光，聊胜于无。<p>",
            bonus: 1.1,
            materials: { spirit_stone: 100, wood: 50, metal_crystal: 5 },
            tier: 1,
            color: "#4CAF50",
            unique: true  // 唯一性标识
        },
     { 
            id: "spirit_gathering_flagab", 
            name: "清心玉佩", 
            description: "<p>后天灵宝<p><p>描述：由普通“静心玉”雕琢而成，长期佩戴能让人心绪稍感平和，对初入打坐者避免杂念有微弱辅助。效果极易被外界干扰或自身强烈情绪覆盖，对心魔几乎无效。<p><p>神威：①微弱宁神：略微提升入定速度。②示警温凉：当佩戴者情绪剧烈波动或遭遇阴邪之气时，玉佩会微微发凉。<p>",
            bonus: 1.1,
            materials: { spirit_stone: 100, water_crystal: 40, yin_stone: 10 },
            tier: 1,
            color: "#4CAF50",
            unique: true  // 唯一性标识
        },
     { 
            id: "spirit_gathering_flagac", 
            name: "避尘袍", 
            description: "<p>后天灵宝<p><p>描述：以“蚕丝蛛网”混织的法袍，刻有最基础的避尘阵法。可自动弹开灰尘、雨水、普通污渍，保持洁净。无任何防御力，穿着舒适，为低阶修士彰显身份的常见服饰。<p><p>神威：①洁净自身：不染尘埃污垢。②微光：在灵力灌注下，衣袍有非常黯淡的流光，外观尚可。<p>",
            bonus: 1.1,
            materials: { spirit_stone: 100, water_crystal: 30, earth_crystal: 15 },
            tier: 1,
            color: "#4CAF50",
            unique: true  // 唯一性标识
        },
        { 
            id: "spirit_gathering_flag", 
            name: "青龙偃月刀", 
            description: "<p>后天灵宝<p><p>描述：关羽神兵，刀身青龙盘绕。刀重八十二斤，挥舞时青龙显化，更可引动忠义之力。<p><p>神威：①青龙显化：召唤青龙助战 ②忠义之力：对不忠不义者伤害翻倍 ③刀气如龙：刀气化青龙攻击<p>",
            bonus: 1.2,
            materials: { spirit_stone: 250, fire_crystal: 50 },
            tier: 1,
            color: "#4CAF50",
            unique: true  // 唯一性标识
        },
      { 
            id: "spirit_gathering_flaga", 
            name: "丈八蛇矛", 
            description: "<p>后天灵宝<p><p>描述：张飞神兵，矛身如蛇扭曲。矛出如毒蛇吐信，诡异刁钻，更可引动狂暴之力。<p><p>神威：①毒蛇之噬：攻击带剧毒 ②狂暴之力：受伤越重威力越强 ③蛇影重重：矛影化万蛇<p>",
            bonus: 1.2,
            materials: { spirit_stone: 50, wood: 100, water_crystal: 30, fire_crystal: 30 },
            tier: 1,
            color: "#4CAF40",
            unique: true  // 唯一性标识
        },
             { 
            id: "spirit_gathering_flagb", 
            name: "龙渊剑", 
            description: "<p>后天灵宝<p><p>描述：欧冶子所铸，剑成引龙渊之灵。剑身如秋水，锋利无双，更可召唤渊龙。<p><p>神威：①龙渊剑气：剑气如水连绵不绝 ②渊龙召唤：召唤渊龙助战 ③剑心通明：持剑时心境澄明<p>",
            bonus: 1.2,
            materials: { spirit_stone: 50, wood: 30, water_crystal: 100, fire_crystal: 200 },
            tier: 1,
            color: "#4CAF60",
            unique: true  // 唯一性标识
        },
        { 
            id: "moonlight_pearl", 
            name: "太阿剑", 
            description: "<p>后天灵宝<p><p>描述：威道之剑，剑气存于天地。剑未出鞘，剑气已至，更可引动天地威压。<p><p>神威：①威道剑气：剑气蕴含天地威严 ②未出先至：剑气先于剑至 ③威压领域：展开领域压制敌人<p>",
            bonus: 1.3,
            materials: { spirit_stone: 300, wood: 200, water_crystal: 140, fire_crystal: 200 },
            tier: 1,
            color: "#2196F5",
            unique: true
        },
        { 
            id: "moonlight_pearla", 
            name: "赤霄剑", 
            description: "<p>后天灵宝<p><p>描述：帝道之剑，剑身赤红如霞。剑出斩白蛇，更可引动帝王紫气。<p><p>神威：①斩白蛇：对妖邪伤害翻倍 ②帝王紫气：紫气护体万邪不侵 ③赤霄剑气：剑气如霞绚烂夺目<p>",
            bonus: 1.3,
            materials: { spirit_stone: 100, wood: 200, water_crystal: 340, fire_crystal: 100 },
            tier: 1,
            color: "#2196F5",
            unique: true
        },
        { 
            id: "moonlight_pearlb", 
            name: "湛卢剑", 
            description: "<p>后天灵宝<p><p>描述：仁道之剑，剑身湛蓝如水。剑出无血，只斩因果，更可引动仁者之力。<p><p>神威：①因果之斩：斩断因果联系 ②仁者无敌：对邪恶者伤害翻倍 ③湛蓝剑气：剑气如水净化一切<p>",
            bonus: 1.3,
            materials: { spirit_stone: 50, wood: 330, water_crystal: 540, fire_crystal: 120 },
            tier: 1,
            color: "#2196F5",
            unique: true
        },
        { 
            id: "moonlight_pearlc", 
            name: "纯钧剑", 
            description: "<p>后天灵宝<p><p>描述：尊贵之剑，剑身尊贵无双。剑出如君子，更可引动贵族气运。<p><p>神威：①尊贵之气：压制一切凡俗兵器 ②君子之剑：剑法堂堂正正 ③贵族气运：持剑者气运提升<p>",
            bonus: 1.2,
            materials: { spirit_stone: 100, wood: 130, water_crystal: 140, fire_crystal: 220 },
            tier: 1,
            color: "#2196F1",
            unique: true
        },
       { 
            id: "moonlight_pearld", 
            name: "鱼肠剑", 
            description: "<p>后天灵宝<p><p>描述：勇绝之剑，剑身短小精悍。专诸刺王僚，更可引动刺客之道。<p><p>神威：①一击必杀：第一击威力提升十倍 ②隐身刺杀：持剑时可隐身 ③勇绝之气：不成功便成仁<p>",
            bonus: 1.3,
            materials: { spirit_stone: 110, wood: 130, water_crystal: 140, fire_crystal: 620 },
            tier: 1,
            color: "#2196F1",
            unique: true
        },
       { 
            id: "moonlight_pearle", 
            name: "承影剑", 
            description: "<p>后天灵宝<p><p>描述：优雅之剑，剑身无形无影。剑出无影，杀人无形，更可引动优雅之道。<p><p>神威：①无形无影：剑身隐形 ②优雅之击：攻击如艺术 ③影遁术：可在影子中穿梭<p>",
            bonus: 1.4,
            materials: { spirit_stone: 510, wood: 530, water_crystal: 540, fire_crystal: 520 },
            tier: 1,
            color: "#2196F1",
            unique: true
        },
       { 
            id: "moonlight_pearlf", 
            name: "七星龙渊", 
            description: "<p>后天灵宝<p><p>描述：诚信之剑，剑身七星龙渊。剑出如龙吟，更可引动诚信之力。<p><p>神威：①龙吟震慑：剑鸣震慑敌人 ②诚信之力：对背信者伤害翻倍 ③七星指引：可指引方向<p>",
            bonus: 1.3,
            materials: { spirit_stone: 810, wood: 230, water_crystal: 240},
            tier: 1,
            color: "#2196F1",
            unique: true
        },
       { 
            id: "moonlight_pearlg", 
            name: "泰阿剑", 
            description: "<p>后天灵宝<p><p>描述：威道之剑，剑气存于天地。剑未出鞘，剑气已至，更可引动天地威压。<p><p>神威：①天地威压：借天地威压攻击 ②剑气自生：剑气自动护主 ③泰阿领域：展开领域压制敌人<p>",
            bonus: 1.4,
            materials: { spirit_stone: 810, wood: 830, water_crystal: 540, fire_crystal: 820 },
            tier: 1,
            color: "#2196F1",
            unique: true
        },
      { 
            id: "moonlight_pearlh", 
            name: "巨阙剑", 
            description: "<p>后天灵宝<p><p>描述:巨剑无锋，大巧不工。剑身厚重，更可引动厚重之力。<p><p>神威：①厚重之力：攻击势大力沉 ②无锋之剑：专破防御 ③巨阙镇压：可镇压敌人<p>",
            bonus: 1.1,
            materials: { spirit_stone: 30, wood: 30, water_crystal: 50, fire_crystal: 20 },
            tier: 1,
            color: "#2196F1",
            unique: true
        },
      { 
            id: "moonlight_pearll", 
            name: "胜邪剑", 
            description: "<p>后天灵宝<p><p>描述：邪恶之剑，剑身邪气凛然。剑出邪恶，更可引动邪恶之力。<p><p>神威：①邪恶之力：攻击带邪恶属性 ②邪气侵蚀：侵蚀敌人心智 ③胜邪领域：展开领域增强邪恶<p>",
            bonus: 1.2,
            materials: { spirit_stone: 110, wood: 210, water_crystal: 110, fire_crystal: 210 },
            tier: 1,
            color: "#2196F2",
            unique: true
        },
      { 
            id: "moonlight_pearlm", 
            name: "工布剑", 
            description: "<p>后天灵宝<p><p>描述：霸道之剑，剑身霸道无双。剑出霸道，更可引动霸道之气。<p><p>神威：①霸道之气：压制一切软弱 ②霸道剑法：剑法霸道无双 ③工布领域：展开领域强制单挑<p>",
            bonus: 1.1,
            materials: { spirit_stone: 50, wood: 50, water_crystal: 50, fire_crystal: 50 },
            tier: 1,
            color: "#2196F2",
            unique: true
        },
      { 
            id: "moonlight_pearln", 
            name: "方天画戟", 
            description: "<p>后天灵宝<p><p>描述：吕布神兵，戟身刻画日月山河。戟重如山，挥舞时天地变色，更可引动山河之力。<p><p>神威：①山河之力：借山河之力攻击 ②无双战意：战意越强威力越强 ③画戟领域：展开领域压制敌人<p>",
            bonus: 1.2,
            materials: { spirit_stone: 150, wood: 150, water_crystal: 250, fire_crystal: 150 },
            tier: 1,
            color: "#2196F6",
            unique: true
        },
      { 
            id: "moonlight_pearlo", 
            name: "龙胆亮银枪", 
            description: "<p>后天灵宝<p><p>描述：赵云佩枪，枪身银白，龙胆为魂。枪出如龙，勇猛无双，更可召唤龙魂助战。<p><p>神威：①龙胆威压：压制一切坐骑 ②枪出如龙：枪法威力倍增 ③龙魂召唤：召唤银龙虚影<p>",
            bonus: 1.2,
            materials: { spirit_stone: 450, wood: 150, water_crystal: 150},
            tier: 1,
            color: "#2196F6",
            unique: true
        },
      { 
            id: "moonlight_pearlp", 
            name: "虎魄刀", 
            description: "<p>后天灵宝<p><p>描述：蚩尤以坐骑战虎魂魄炼制，刀身血红，虎啸阵阵。刀出必饮血，煞气冲天，持之易入魔。<p><p>神威：①虎魄噬魂：吞噬敌人魂魄 ②煞气领域：展开领域削弱敌人 ③战虎召唤：召唤战虎虚影助战<p>",
            bonus: 1.3,
            materials: { spirit_stone: 450, wood: 880},
            tier: 1,
            color: "#2196F6",
            unique: true
        },
      { 
            id: "moonlight_pearlq", 
            name: "画影剑", 
            description: "<p>后天灵宝<p><p>描述：影之剑，剑出如画。剑招优美如画，更可引动画中世界。<p><p>神威：①画中世界：可将敌人摄入画中 ②画影剑气：剑气如画绚丽 ③影遁术：可在画影中穿梭<p>",
            bonus: 1.3,
            materials: { spirit_stone: 250,fire_crystal: 880},
            tier: 1,
            color: "#2196F6",
            unique: true
        },
     { 
            id: "moonlight_pearlr", 
            name: "宵练剑", 
            description: "<p>后天灵宝<p><p>描述：光之剑，剑出如光。剑速如光，更可引动光之力。<p><p>神威：①光速剑：剑速达到光速 ②光之剑：剑身发光耀眼 ③宵练领域：展开领域加速一切<p>",
            bonus: 1.2,
            materials: { spirit_stone: 250,fire_crystal: 180},
            tier: 1,
            color: "#2196F2",
            unique: true
        },
     { 
            id: "moonlight_pearls", 
            name: "含光剑", 
            description: "<p>后天灵宝<p><p>描述：无形之剑，剑身无形。剑出无形，更可引动无形之力。<p><p>神威：①无形剑：剑身完全隐形 ②无形剑气：剑气无形 ③含光领域：展开领域隐藏一切<p>",
            bonus: 1.3,
            materials: { wood: 150, water_crystal: 250, fire_crystal: 1050},
            tier: 1,
            color: "#2196F2",
            unique: true
        },
     { 
            id: "moonlight_pearlt", 
            name: "龙雀刀", 
            description: "<p>后天灵宝<p><p>描述：刀身龙雀交缠，刀出龙雀齐鸣。刀法霸道，更可召唤龙雀。<p><p>神威：①龙雀齐鸣：刀鸣震慑敌人 ②龙雀召唤：召唤龙雀虚影 ③霸道刀法：刀法霸道无双<p>",
            bonus: 1.1,
            materials: { wood: 50, water_crystal: 50, fire_crystal: 110},
            tier: 1,
            color: "#2196F1",
            unique: true
        },
     { 
            id: "moonlight_pearlu", 
            name: "落宝金钱", 
            description: "<p>后天灵宝<p><p>描述：金钱有翅，可落宝物。专落先天至宝之下一切宝物，但无法落兵器。<p><p>神威：①落宝：可落一切法宝 ②金钱领域：展开领域禁止使用法宝 ③财运加持：持之财运亨通<p>",
            bonus: 1.4,
            materials: { wood: 1500, water_crystal: 530, fire_crystal: 110},
            tier: 1,
            color: "#2196F1",
            unique: true
        },
     { 
            id: "moonlight_pearlv", 
            name: "钉头七箭书", 
            description: "<p>后天灵宝<p><p>描述：诅咒至宝，书草人，射七箭。拜射草人，可咒杀大罗金仙，但需付出巨大代价。<p><p>神威：①咒杀：拜射二十一日可咒杀敌人 ②诅咒转移：可转移自身诅咒 ③钉头七箭：七箭齐发威力倍增<p>",
            bonus: 1.4,
            materials: { wood: 1500, water_crystal: 530, fire_crystal: 110},
            tier: 1,
            color: "#2196F1",
            unique: true
        },
        { 
            id: "flame_ringaa", 
            name: "化血神刀", 
            description: "<p>后天灵宝<p><p>描述：中者立时化为脓血，歹毒无比。刀出必饮血，更可诅咒敌人。<p><p>神威：①化血神刀：中刀即化血 ②血咒：刀带诅咒 ③饮血增强：饮血越多威力越强<p>",
            bonus: 1.1,
            materials: { spirit_stone: 100, fire_crystal: 300 },
            tier: 1,
            color: "#FF5732",
            unique: true
        },
        
        // 中级法宝
        { 
            id: "yin_yang_mirror", 
            name: "戮魂幡", 
            description: "<p>先天灵宝<p><p>描述：魔道至宝，摇动可收人魂魄。防不胜防，更可炼制魂兵。<p><p>神威：①收人魂魄：摇动即收魂 ②魂兵炼制：用魂魄炼制魂兵 ③戮魂领域：展开领域削弱神魂<p>",
            bonus: 1.5,
            materials: { spirit_stone: 2000, yin_stone: 100, yang_stone: 100 },
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
        { 
            id: "yin_yang_mirrora", 
            name: "火尖枪", 
            description: "<p>先天灵宝<p><p>描述：双轮转动，风火之势。上天入地，速度无双，更可释放风火攻击。<p><p>神威：①风火轮速：速度冠绝三界 ②风火攻击：释放风火 ③轮影重重：化出无数轮影<p>",
            bonus: 1.5,
            materials: { spirit_stone: 1500, fire_crystal: 500, yang_stone: 100 },
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
        { 
            id: "yin_yang_mirrorb", 
            name: "风火轮", 
            description: "<p>先天灵宝<p><p>描述：双轮转动，风火之势。上天入地，速度无双，更可释放风火攻击。<p><p>神威：①风火轮速：速度冠绝三界 ②风火攻击：释放风火 ③轮影重重：化出无数轮影<p>",
            bonus: 1.5,
            materials: { water_crystal: 1500, fire_crystal: 500, yang_stone: 88 },
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
        { 
            id: "yin_yang_mirrorc", 
            name: "六魂幡", 
            description: "<p>先天灵宝<p><p>描述：魔道至宝，幡有六尾。摇动可伤圣人，但需以自身魂魄为引。<p><p>神威：①伤圣：可伤圣人魂魄 ②六魂幡动：摇动即攻击 ③魂魄献祭：献祭魂魄增强威力<p>",
            bonus: 1.5,
            materials: { metal_crystal: 200, yin_stone: 200},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
        { 
            id: "yin_yang_mirrord", 
            name: "斩仙飞刀", 
            description: "<p>先天灵宝<p><p>描述：陆压道人法宝，葫芦内有一线毫光。白光一转，取人首级，连元神都逃不掉。<p><p>神威：①斩仙：专斩仙人 ②飞刀必中：必中要害 ③元神锁定：锁定敌人元神<p>",
            bonus: 1.6,
            materials: { metal_crystal: 200, yang_stone: 300, fire_crystal: 1200, spirit_stone: 2000},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
        { 
            id: "yin_yang_mirrore", 
            name: "干将莫邪", 
            description: "<p>先天灵宝<p><p>描述：挚情之剑，雌雄双生。干将炽热如火，莫邪清冷如冰。双剑合璧，引动天地至情之力，威力倍增<p><p>神威：①双剑合璧：威力提升十倍 ②至情之力：情感越深威力越强 ③心意相通：双剑之主可心灵感应<p>",
            bonus: 1.7,
            materials: { yin_stone: 500, yang_stone: 400, fire_crystal: 2200, spirit_stone: 2000},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
        { 
            id: "yin_yang_mirrorf", 
            name: "金灵珠", 
            description: "<p>先天灵宝<p><p>描述：先天金灵凝聚，持之可操控金属。可强化金属宝物，更可召唤金灵。<p><p>神威：①金属操控：操控一切金属 ②宝物强化：强化金属宝物 ③金灵召唤：可召唤金灵助战<p>",
            bonus: 1.5,
            materials: { spirit_stone: 1200, metal_crystal: 200, yang_stone: 200},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
        { 
            id: "yin_yang_mirrorj", 
            name: "土灵珠", 
            description: "<p>先天灵宝<p><p>描述：先天土灵凝聚，持之可操控大地。可召唤地震，更可召唤土灵。<p><p>神威：①大地操控：操控地形地貌 ②地震术：召唤地震攻击 ③土灵召唤：可召唤土灵助战<p>",
            bonus: 1.5,
            materials: { spirit_stone: 1200, wood_crystal: 200, yin_stone: 200},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
        { 
            id: "yin_yang_mirrorh", 
            name: "火灵珠", 
            description: "<p>先天灵宝<p><p>描述：先天火灵凝聚，持之可操控火焰。可召唤天火，更可召唤火灵。<p><p>神威：①火焰操控：操控一切火焰 ②天火降临：召唤天火攻击 ③火灵召唤：可召唤火灵助战<p>",
            bonus: 1.5,
            materials: { water_crystal: 2000, yang_stone: 300, yin_stone: 200},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirrorg", 
            name: "水灵珠", 
            description: "<p>先天灵宝<p><p>描述：先天水灵凝聚，持之可操控水流。可召唤降雨，更可召唤水灵。<p><p>神威：①水流操控：操控一切水流 ②呼风唤雨：召唤降雨 ③水灵召唤：可召唤水灵助战<p>",
            bonus: 1.5,
            materials: { water_crystal: 2000, spirit_stone: 3000, yin_stone: 100},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirrorm", 
            name: "木灵珠", 
            description: "<p>先天灵宝<p><p>描述：先天木灵凝聚，持之可操控植物。可加速植物生长，更可召唤木灵。<p><p>神威：①植物操控：操控一切植物 ②生长加速：加速灵植生长 ③木灵召唤：可召唤木灵助战<p>",
            bonus: 1.5,
            materials: { wood: 2000, wood_crystal: 300, yin_stone: 150},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirrorl", 
            name: "芭蕉扇", 
            description: "<p>先天灵宝<p><p>描述：昆仑山先天灵根芭蕉叶所化，分阴阳二扇。阳扇扇出火，阴扇扇出风，更可扇飞敌人。<p><p>神威：①煽风点火：阳扇出火，阴扇出风 ②扇飞敌人：一扇将人扇飞八万四千里 ③灭火克风：可灭天下火，定天下风<p>",
            bonus: 1.7,
            materials: { wood: 1500, metal_crystal: 500, yin_stone: 150},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirroro", 
            name: "金刚琢", 
            description: "<p>先天灵宝<p><p>描述：太上老君锟钢炼成，被还丹点成，善能变化。可套取天下万物，水火不侵。<p><p>神威：①套取万物：可套一切宝物兵器 ②变化大小：大小如意 ③金刚不坏：坚硬无比<p>",
            bonus: 1.7,
            materials: { spirit_stone: 1500, metal_crystal: 300, yang_stone: 250},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirrorp", 
            name: "羊脂玉净瓶", 
            description: "<p>先天灵宝<p><p>描述：观音菩萨另一法宝，瓶插杨柳枝。内盛三光神水，更可收人宝物，妙用无穷。<p><p>神威：①收人宝物：可收一切宝物 ②杨柳回春：柳枝有疗伤奇效 ③瓶中世界：内蕴小千世界<p>",
            bonus: 1.6,
            materials: { wood: 2500, water_crystal: 2300, wood_crystal: 200},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirrorpa", 
            name: "摄心铃", 
            description: "<p>先天灵宝<p><p>描述：一只银色铃铛，摇动时发出清脆铃声。铃声可扰乱敌人心神，制造幻听，对心志不坚者甚至可短暂操控其行动。但对神识强大者效果甚微。<p><p>神威：①心神扰乱：干扰敌人注意力与施法 ②幻听制造：制造虚假的声音指令 ③短暂操控：操控低阶或心神失守的敌人<p>",
            bonus: 1.6,
            materials: { wood: 2000, water_crystal: 3000, wood_crystal: 150},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirrorpb", 
            name: "养魂木", 
            description: "<p>先天灵宝<p><p>描述：一段温润如玉的黑色神木，可温养魂魄，治疗神魂创伤。将残魂寄养其中，有几率使其逐渐恢复，甚至重聚魂体。对鬼修、魂体而言是无上至宝。<p><p>神威：①神魂疗愈：加速神魂伤势恢复 ②魂体滋养：增强魂体强度 ③避劫之所：可助神魂躲避天劫、风劫<p>",
            bonus: 1.6,
            materials: { wood: 2000, water_crystal: 3000, wood_crystal: 150, yin_stone: 200},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirrorpc", 
            name: "北斗七星剑", 
            description: "<p>先天灵宝<p><p>描述：七剑一套，对应天枢至摇光七星。布成剑阵，引动北斗星力，杀伐无双，更可借星力续命延寿。<p><p>神威：①七星连珠：七剑合一，威力暴增 ②北斗续命：逆转生死，续命延寿 ③星陨剑阵：引动星辰坠落攻击<p>",
            bonus: 1.6,
            materials: { spirit_stone: 2000, fire_crystal: 3000, yang_stone: 150, metal_crystal: 200},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirrorpd", 
            name: "万魂棺", 
            description: "<p>先天灵宝<p><p>描述：一具以养魂木为主材打造的棺椁。活人躺入可滋养神魂，治疗魂伤；将敌人封印其中，可缓慢炼化其神魂；也可作为鬼修的本命法宝，修行事半功倍。<p><p>神威：①炼魂化魄：炼化棺内敌人的魂魄 ②养魂圣地：加速神魂修炼与恢复 ③鬼域空间：棺内自成小型鬼域<p>",
            bonus: 1.7,
            materials: { spirit_stone: 2000, wood: 2000, wood_crystal: 450, yin_stone: 500},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirrorq", 
            name: "九宫图", 
            description: "<p>先天灵宝<p><p>描述：图分九宫，演化天地。布九宫大阵，困杀一体，更可推演天机。<p><p>神威：①九宫大阵：困杀非圣人修士 ②天机推演：推演阵法变化 ③九宫遁术：可在阵内瞬移<p>",
            bonus: 1.8,
            materials: { wood: 1500, yin_stone: 200, yang_stone: 200, metal_crystal: 300, wood_crystal: 200, earth_crystal: 300},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirrorr", 
            name: "万兽谱", 
            description: "<p>先天灵宝<p><p>描述：一本金色典籍，可收录妖兽精魄。收录后，可消耗法力召唤其精魄虚影助战，虚影拥有本体部分实力与天赋神通。收录的妖兽越强、血脉越高，召唤消耗越大。<p><p>神威：①万兽召唤：召唤收录妖兽的精魄 ②血脉压制：对兽类敌人产生威压 ③兽魂融合：暂时与某兽魂融合，获得其特性<p>",
            bonus: 1.6,
            materials: { yin_stone: 200, yang_stone: 300, wood_crystal: 200, earth_crystal: 300},
            tier: 2,
            color: "#9C27B2",
            unique: true
        },
       { 
            id: "yin_yang_mirrors", 
            name: "摄魂幡", 
            description: "<p>先天灵宝<p><p>描述：一杆漆黑魂幡，摇动时可摄取无主游魂或重伤敌人的魂魄。魂幡内自成空间，可炼化魂魄为魂力补充自身，或炼制为幡中阴兵。<p><p>神威：①摄魂夺魄：摄取魂魄 ②阴兵借道：驱使幡中阴兵作战 ③魂力吞噬：炼化魂魄补充神识消耗<p>",
            bonus: 1.7,
            materials: { yin_stone: 600, wood: 3000},
            tier: 2,
            color: "#9C27B1",
            unique: true
        },
       { 
            id: "yin_yang_mirrort", 
            name: "同心蛊", 
            description: "<p>先天灵宝<p><p>描述：一对子母奇蛊，分别植入两人体内（通常为道侣或生死兄弟）。双方可模糊感知对方情绪、方位与安危，一方重伤时另一方可分担部分伤害，距离过远时感应减弱。<p><p>神威：①心灵感应：模糊感知对方状态 ②伤害分担：分担部分伤害 ③同心协力：联手时默契度大增<p>",
            bonus: 1.7,
            materials: { yin_stone: 600, yang_stone: 600},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirroru", 
            name: "百灵朝凤簪", 
            description: "<p>先天灵宝<p><p>描述：一支凤首玉簪，对一切禽类妖兽有天然的统御力。佩戴者所过之处，百鸟来朝，可命禽类妖兽为己所用，但对凤凰、金乌等顶级神禽效果有限。<p><p>神威：①百鸟听令：统御普通禽类妖兽 ②凤威震慑：对禽类产生血脉压制 ③翱翔九天：大幅提升飞行速度与能力<p>",
            bonus: 1.6,
            materials: { wood: 3000, spirit_stone: 3000},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
       { 
            id: "yin_yang_mirrorv", 
            name: "命运赌桌", 
            description: "<p>先天灵宝<p><p>描述：一张虚幻的赌桌，可邀请一位敌人进行“命运赌局”。赌注可以是修为、寿元、气运、法宝等。赌局形式随机（猜拳、掷骰、比大小等），结果由冥冥中的命运裁定，作弊无效。<p><p>神威：①强制赌局：邀请敌人进行赌斗 ②命运裁决：结果公正，实力无法影响 ③高风险高回报：可能瞬间获得巨大收益或损失<p>",
            bonus: 1.8,
            materials: { wood: 3000, wood_crystal: 1000},
            tier: 2,
            color: "#9C27B0",
            unique: true
        },
        { 
            id: "five_elements_pan", 
            name: "五行炉", 
            description: "<p>先天灵宝<p><p>描述：内蕴五行之火，可炼化万物。炼丹炼器，更可炼化敌人。<p><p>神威：①五行炼化：可炼化一切 ②炼丹炼器：提升成功率 ③炉火攻击：释放五行之火<p>",
            bonus: 1.6,
            materials: { metal_crystal: 300, wood_crystal: 300, water_crystal: 300, fire_crystal: 300, earth_crystal: 300 },
            tier: 2,
            color: "#FFD700",
            unique: true
        },
        
        // 高级法宝
        { 
            id: "immortal_fan", 
            name: "阴阳二气瓶", 
            description: "<p>通天灵宝​<p><p>描述：内蕴阴阳二气，瓶收万物。收入瓶中，一时三刻化为脓水，更可炼化万物。<p><p>神威：①收人炼化：收入即炼化 ②阴阳二气：可化阴阳攻击 ③瓶内世界：内蕴小千世界<p>",
            bonus: 1.8,
            materials: { yin_stone: 300, yang_stone: 301, chaos_fragment: 150, time_sand: 50  },
            tier: 2,
            color: "#00BCD4",
            unique: true
        },
        { 
            id: "immortal_fana", 
            name: "八卦炉", 
            description: "<p>通天灵宝​<p><p>描述：太上老君炼丹炉，内蕴六丁神火。可炼九转金丹，更可炼化万物。<p><p>神威：①炼化万物：六丁神火炼化一切 ②九转金丹：可炼九转金丹 ③炉内世界：内蕴八卦空间<p>",
            bonus: 1.8,
            materials: { spirit_stone: 5000, fire_crystal: 5000, yang_stone: 350, immortal_feather: 150  },
            tier: 2,
            color: "#00BCD4",
            unique: true
        },
        { 
            id: "immortal_fanb", 
            name: "清净琉璃瓶", 
            description: "<p>通天灵宝​<p><p>描述：观音菩萨法宝，瓶内盛甘露水。洒出可活死人肉白骨，更可净化一切邪祟。<p><p>神威：①起死回生：可复活死亡不超过七日者 ②净化魔气：净化一切魔道修士 ③甘露疗伤：治疗一切伤势<p>",
            bonus: 1.9,
            materials: { water_crystal: 5000, fire_crystal: 5000, space_stone: 250, immortal_feather: 250  },
            tier: 2,
            color: "#00BCD4",
            unique: true
        },
        { 
            id: "immortal_fanc", 
            name: "乾坤鼎", 
            description: "<p>通天灵宝​<p><p>描述：太上老君炼丹至宝，可返本归元，转化后天为先天。炼丹炼器，成功率百分之百，更可提升宝物品质。<p><p>神威：①后天返先天：转化后天宝物为先天 ②百分成功：炼丹炼器必成 ③鼎镇乾坤：可镇压一方世界<p>",
            bonus: 1.9,
            materials: { spirit_stone: 5000, fire_crystal: 3000, metal_crystal: 550, time_sand: 50, space_stone: 50, chaos_fragment: 50},
            tier: 2,
            color: "#00BCD4",
            unique: true
        },
        { 
            id: "immortal_fand", 
            name: "阴阳生死镜", 
            description: "<p>通天灵宝​<p><p>描述：镜分阴阳两面，阴面照死，阳面照生。照人神魂，判人生死，更可逆转阴阳，颠倒生死。<p><p>神威：①判人生死：照之即定生死 ②逆转阴阳：短暂逆转生死规则 ③阴阳领域：展开领域压制敌人<p>",
            bonus: 1.9,
            materials: { spirit_stone: 5000, yin_stone: 500, yang_stone: 550, space_stone: 100, chaos_fragment: 50},
            tier: 2,
            color: "#00BCD4",
            unique: true
        },
        { 
            id: "immortal_fane", 
            name: "五色神光扇", 
            description: "<p>通天灵宝​<p><p>描述：孔宣本命神通所化，扇分青、黄、赤、黑、白五色。一扇之下，五行之内无物不刷，无宝不落。<p><p>神威：①五行归元：刷落一切五行宝物 ②五色护体：五行攻击无效 ③神光遁术：五行之内任意穿梭<p>",
            bonus: 2,
            materials: { water_crystal: 5000, fire_crystal: 5000, metal_crystal: 500, wood_crystal: 500, earth_crystal: 500},
            tier: 2,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "immortal_fanf", 
            name: "通灵宝玉", 
            description: "<p>玄天灵宝​​<p><p>描述：一块天生有灵性的美玉，长期佩戴可与万物之灵（山灵、水灵、草木之精等）进行简单沟通，更容易获得天地精灵的好感与帮助。<p><p>神威：①万物通灵：与非人灵体沟通 ②自然亲和：提升在自然环境中运气 ③精灵召唤：召唤附近弱小的自然精灵<p>",
            bonus: 2.1,
            materials: { spirit_stone: 5000, wood: 5000, wood_crystal: 500, chaos_fragment: 200, immortal_feather: 200},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "immortal_fanfa", 
            name: "时空涟漪琴", 
            description: "<p>玄天灵宝​​<p><p>描述：一架古琴，弹奏时琴音会引起微小时空涟漪。熟练者可通过琴音轻微干扰局部时间流速，或制造空间褶皱隐藏自身，琴道至高者可拨动“世界之弦”。<p><p>神威：①涟漪干扰：干扰敌人时空感知 ②褶皱隐身：藏身于空间褶皱 ③弦音共振：与天地法则短暂共振<p>",
            bonus: 2.2,
            materials: { spirit_stone: 4000, wood: 6000, wood_crystal: 700, celestial_silk: 400, immortal_feather: 300},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "immortal_fanfb", 
            name: "岁月长河图卷", 
            description: "<p>玄天灵宝​​<p><p>描述：图卷展开，可见一条奔流不息的光阴长河虚影。持之可短暂跳出现有时间线，窥探过去未来片段，但每次使用都会损耗自身寿元，且可能迷失在时间乱流中。<p><p>神威：①时间跳跃：短暂前往过去或未来 ②光阴回溯：让局部区域时间倒流 ③因果显化：可看见事物间的因果连线<p>",
            bonus: 2.1,
            materials: { yang_stone: 1000, yin_stone: 1000, space_stone: 600, time_sand: 300, immortal_feather: 400},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "immortal_fanfe", 
            name: "番天印", 
            description: "<p>玄天灵宝​​<p><p>描述：元始天尊取半截不周山炼制。一印压下，犹如不周山倒，威力无穷。<p><p>神威：①不周山压：如山压顶 ②番天印法：印法威力巨大 ③印镇乾坤：可镇压敌人<p>",
            bonus: 2.0,
            materials: { yang_stone: 1000, yin_stone: 1000, space_stone: 300, time_sand: 200, chaos_fragment: 200},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanfo", 
            name: "九龙神火罩", 
            description: "<p>玄天灵宝​​<p><p>描述：内藏九条火龙，放出三昧真火。焚烧一切，更可困敌炼化。<p><p>神威：①九龙神火：九条火龙喷火 ②神火罩体：困敌炼化 ③三昧真火：火焰为三昧真火<p>",
            bonus: 2.2,
            materials: { water_crystal: 5000, yang_stone: 2000, space_stone: 500, chaos_fragment: 500},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanfp", 
            name: "星陨铁重剑", 
            description: "<p>玄天灵宝​​<p><p>描述：天外陨铁炼制，重达十万八千斤。剑身刻有星辰符文，挥动时引动星辰重力，一剑出，星辰陨。<p><p>神威：①星辰重力：可改变局部重力 ②陨星坠落：召唤陨石攻击 ③破法特性：克制一切法术防御<p>",
            bonus: 2.1,
            materials: { water_crystal: 5000, metal_crystal: 2500, time_sand: 500, star_dust: 50},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanfq", 
            name: "彗尾拂尘", 
            description: "<p>玄天灵宝​​<p><p>描述：彗星之尾炼制，尘丝银白。挥动时彗尾扫过，净化邪祟，更可借彗星之力推演天机。<p><p>神威：①净化万物：可净化一切污秽 ②彗星预警：彗星现世前会有感应 ③扫尘除垢：拂去心魔尘埃<p>",
            bonus: 2.3,
            materials: { wood: 10000, yang_stone: 2500,celestial_silk: 500, immortal_feather: 500, space_stone: 500, star_dust: 50},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanfu", 
            name: "星辰棋盘", 
            description: "<p>玄天灵宝​​<p><p>描述：棋盘如星空，棋子为星辰。对弈可推演天机，布阵困敌，更可将敌人摄入棋盘世界。<p><p>神威：①星空棋局：布阵困杀敌人 ②天机推演：对弈推演未来 ③棋子化星：棋子可化为真实星辰攻击<p>",
            bonus: 2.3,
            materials: { yang_stone: 2500, yang_stone: 2500,chaos_fragment: 500, space_stone: 500, law_crystal: 50, star_dust: 50},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanfv", 
            name: "日冕神冠", 
            description: "<p>玄天灵宝​​<p><p>描述：日冕精华凝聚，冠冕璀璨。戴之可得太阳星眷顾，化身大日神君，执掌太阳真火。<p><p>神威：①大日化身：短暂化身大日金乌 ②真火领域：展开领域，焚烧一切 ③日冕护体：免疫火系攻击<p>",
            bonus: 2.4,
            materials: { fire_crystal: 5000,yang_stone: 2500, yang_stone: 2500,chaos_fragment: 500, space_stone: 800, law_crystal: 100, destiny_fragment: 50},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanfw", 
            name: "月宫桂树杖", 
            description: "<p>玄天灵宝​​<p><p>描述：月宫桂树枝干炼制，清香扑鼻。杖出时月桂飘香，令人沉醉，更可沟通太阴星力，施展月宫秘法。<p><p>神威：①月桂飘香：香气有迷魂之效 ②太阴召唤：召唤月宫投影 ③不死特性：如月宫桂树般难以摧毁<p>",
            bonus: 2.5,
            materials: { wood: 10000,wood_crystal: 5000, yang_stone: 5000,immortal_feather: 1000, chaos_fragment: 1000, law_crystal: 50, destiny_fragment: 50},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanfs", 
            name: "流星逐日弓", 
            description: "<p>玄天灵宝​​<p><p>描述：弓身如流星，弓弦为日光凝聚。箭出如流星逐日，速度冠绝三界，可射日诛神。<p><p>神威：①逐日之速：箭速超越光速 ②诛神之威：对神道修士伤害翻倍 ③流星雨：可一次性射出万箭<p>",
            bonus: 2.6,
            materials: { spirit_stone: 10000,metal_crystal: 5000, yang_stone: 5000,immortal_feather: 800, chaos_fragment: 1200, law_crystal: 100, destiny_fragment: 100},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanfy", 
            name: "九曜星宫灯", 
            description: "<p>玄天灵宝​​<p><p>描述：九盏宫灯，对应九曜星君。点燃后星光璀璨，布成九曜大阵，困杀一体，更可借星光推演天机。<p><p>神威：①九曜困杀：九灯成阵，非大罗不可破 ②星光推演：借星光推演吉凶 ③星君投影：短暂召唤星君分身助战<p>",
            bonus: 2.5,
            materials: { spirit_stone: 8000,metal_crystal: 4000, yang_stone: 5000,time_sand: 300, chaos_fragment: 1100, star_dust: 100, destiny_fragment: 100},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanfz", 
            name: "紫微帝印", 
            description: "<p>玄天灵宝​​<p><p>描述：紫微星核炼制，帝气缭绕。执掌此印，可得紫微帝星认可，掌帝王命格，镇压国运气数。<p><p>神威：①帝王威压：压制一切非帝王命格者 ②国运加持：借一国气运修炼 ③紫微护体：帝星投影，万法不侵<p>",
            bonus: 2.5,
            materials: { spirit_stone: 8000,earth_crystal: 9000, yang_stone: 3000,time_sand: 900, chaos_fragment: 700, star_dust: 50, destiny_fragment: 150},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "immortal_fang", 
            name: "龙之逆鳞", 
            description: "<p>玄天灵宝​​<p><p>描述：一片真正巨龙颈下最珍贵的逆鳞。持之可获得真龙的部分威压与气运，对水族有绝对命令权，但也会吸引龙族敌视与追杀。<p><p>神威：①真龙威压：散发龙威震慑万灵 ②统御水族：命令一切水中妖族 ③龙气护体：获得一丝真龙气运加持<p>",
            bonus: 2.1,
            materials: { chaos_fragment: 1000},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "immortal_fanh", 
            name: "涅槃羽", 
            description: "<p>玄天灵宝​​<p><p>描述：一根真正的凤凰涅槃后遗留的本命真羽。蕴含一丝涅槃法则，持有者在濒死时，羽毛会自动燃烧，为其争取一次涅槃重生的机会。<p><p>神威：①涅槃重生：提供一次复活机会 ②凤凰真火：可释放一缕真火护体或攻敌 ③百鸟朝宗：对飞禽吸引力大增<p>",
            bonus: 2.1,
            materials: { immortal_feather: 1000},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "immortal_fanm", 
            name: "因果反噬甲", 
            description: "<p>玄天灵宝​​<p><p>描述：一件半透明的铠甲，由因果丝线编织而成。当敌人对穿戴者发动攻击时，铠甲会自动记录攻击所蕴含的“因”，并在之后将其部分“果”反弹给攻击者。<p><p>神威：①伤害记录：记录攻击来源与强度 ②因果反弹：将部分伤害/负面效果返还 ③业力屏蔽：削弱业力带来的影响<p>",
            bonus: 2.2,
            materials: { yin_stone: 1000, yang_stone: 1000, chaos_fragment: 200, immortal_feather: 200, celestial_silk: 200},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "immortal_fanl", 
            name: "弑神枪", 
            description: "<p>玄天灵宝​​<p><p>描述：魔祖罗睺伴生至宝，混沌青莲根茎所化。可伤圣人元神，杀伐无双。<p><p>神威：①伤圣：可伤圣人 ②杀伐之气：杀气冲天 ③弑神枪法：枪法专为杀戮<p>",
            bonus: 2.3,
            materials: { yin_stone: 1000, yang_stone: 1000, chaos_fragment: 300, immortal_feather: 300, metal_crystal: 1000},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "immortal_fann", 
            name: "量天尺", 
            description: "<p>玄天灵宝​​<p><p>描述：后天功德至宝，可丈量天地。攻击无双，更可度量因果。<p><p>神威：①丈量天地：可测量一切 ②功德攻击：攻击带功德之力 ③量天尺法：尺法威力巨大<p>",
            bonus: 2.0,
            materials: { wood: 10000, yang_stone: 1000, metal_crystal: 1000, chaos_fragment: 300},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "immortal_fano", 
            name: "清净竹", 
            description: "<p>玄天灵宝​​<p><p>描述：六根清净竹，可打人元神。令人昏迷，更可净化心灵。<p><p>神威：①打人元神：专打神魂 ②清净之力：净化心灵 ③竹影重重：化出无数竹影<p>",
            bonus: 2.2,
            materials: { wood: 10000, water_crystal: 10000, wood_crystal: 10000, chaos_fragment: 500},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "immortal_fanp", 
            name: "诛仙四剑", 
            description: "<p>玄天灵宝​​<p><p>描述：诛仙剑、戮仙剑、陷仙剑、绝仙剑，每一把都是先天杀伐至宝。诛仙利，戮仙亡，陷仙四处起红光，绝仙变化无穷妙。<p><p>神威：①诛仙斩神：对神道修士伤害翻倍 ②戮仙灭魂：专斩神魂 ③陷仙困敌：剑气成阵困敌 ④绝仙变化：剑气千变万化<p>",
            bonus: 2.4,
            materials: { space_stone: 1000, time_sand: 1000, destiny_fragment: 100, star_dust: 100},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanq", 
            name: "轩辕剑", 
            description: "<p>玄天灵宝​​<p><p>描述：圣道之剑，剑身一面刻日月星辰，一面刻山川草木；剑柄一面书农耕畜养之术，一面书四海一统之策。金色剑光，帝王之气。<p><p>神威：①圣道威压：压制一切邪魔外道 ②人道之剑：对人族伤害翻倍 ③轩辕剑气：剑气蕴含人道气运<p>",
            bonus: 2.5,
            materials: { chaos_fragment: 1000, destiny_fragment: 100, law_crystal: 100, star_dust: 200},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanr", 
            name: "星辰羽衣", 
            description: "<p>玄天灵宝​​<p><p>描述：以星辰之光织就，衣上星辰流转。穿之可隐身星空，更可借星辰之力防御。<p><p>神威：①星空隐身：在星空下完全隐身 ②星辰护体：星光自动防御 ③星移斗转：可短距离瞬移<p>",
            bonus: 2.6,
            materials: {  yang_stone: 1500, chaos_fragment: 300, space_stone: 300, time_sand: 300, star_dust: 300},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fans", 
            name: "周天星辰图", 
            description: "<p>玄天灵宝​​<p><p>描述：图卷展开，三百六十五颗主星、一万四千八百辅星具现，演化周天星斗大阵。持图者可借星辰之力，改天换地。<p><p>神威：①星力灌注：借周天星辰之力修炼 ②星辰坠落：召唤星辰虚影攻击 ③星空领域：展开领域，压制一切非星辰法则<p>",
            bonus: 2.7,
            materials: {  chaos_fragment: 600, space_stone: 600, destiny_fragment: 300, law_crystal: 500, star_dust: 300},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fant", 
            name: "河图洛书", 
            description: "<p>玄天灵宝​​<p><p>描述：帝俊、伏羲推演至宝，内含周天星斗大阵与混元河洛大阵奥秘。推演天机，阵法极致，包罗万象。<p><p>神威：①周天星斗：可布天道第一杀阵 ②混元河洛：演化洪荒山川地理 ③天机推演：圣人之下推演第一<p>",
            bonus: 2.8,
            materials: {  chaos_fragment: 1000, time_sand: 500, space_stone: 500, destiny_fragment: 400, law_crystal: 800, star_dust: 200},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanta", 
            name: "太阴灭绝神轮", 
            description: "<p>玄天灵宝​​<p><p>描述：月华凝聚，呈银白色轮盘。转动时太阴神光洒落，冻结时空，灭绝生机。月圆之夜威力倍增。<p><p>神威：①时空冻结：神光所及，时空凝滞 ②生机灭绝：剥夺敌人生命本源 ③月华灌注：吸收月华无限续航<p>",
            bonus: 2.9,
            materials: {  chaos_fragment: 1500, time_sand: 900, space_stone: 600, destiny_fragment: 800, law_crystal: 800, star_dust: 200, law_crystal: 200},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fantb", 
            name: "银河九天带", 
            description: "<p>玄天灵宝​​<p><p>描述：九天银河炼制，银光璀璨，柔软如绸。展开可化银河天堑，困敌防御，更可引动星辰之力。<p><p>神威：①银河天堑：化出银河阻挡一切 ②星辰锁链：可捆缚大罗金仙 ③星光疗愈：星光有疗伤奇效<p>",
            bonus: 3.1,
            materials: {  chaos_fragment: 1500, time_sand: 1500, space_stone: 1500, destiny_fragment: 1000, law_crystal: 1000, star_dust: 200, law_crystal: 300},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanu", 
            name: "十二品业火红莲", 
            description: "<p>玄天灵宝​​<p><p>描述：冥河老祖伴生至宝，莲台血红，业火熊熊。端坐莲台，防御无双，更可焚烧业力，业力越深，焚烧越烈。<p><p>神威：①业火焚身：引动敌人业力焚烧 ②红莲护体：免疫一切火系攻击 ③血海不枯：连接血海，法力无尽<p>",
            bonus: 2.9,
            materials: {  fire_crystal: 10000, yang_stone: 2000, space_stone: 600, destiny_fragment: 500, law_crystal: 500},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanv", 
            name: "七宝妙树", 
            description: "<p>玄天灵宝​​<p><p>描述：准提道人证道之宝，乃菩提树所化。树上悬七宝：金、银、琉璃、玻瓈、砗磲、赤珠、玛瑙。七彩光华，无物不刷。<p><p>神威：①万宝归宗：可刷落一切法宝 ②菩提悟道：树下悟道速度千倍 ③七宝护体：七色光华防御无双<p>",
            bonus: 2.9,
            materials: {  wood: 10000, wood_crystal: 2000, chaos_fragment: 500, star_dust: 300, law_crystal: 700},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanw", 
            name: "盘古幡", 
            description: "<p>玄天灵宝​​<p><p>描述：元始天尊至宝，幡面混沌色，挥动时撕裂鸿蒙，粉碎时空。拥有开辟天地之能，为一切防御法宝克星。<p><p>神威：①混沌剑气：撕裂一切防御 ②开天辟地：可短暂开辟小千世界 ③定地水火风：平息一切能量暴动<p>",
            bonus: 3.1,
            materials: {  yang_stone: 3000, chaos_fragment: 700, space_stone: 700, destiny_fragment: 500, law_crystal: 1000},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fany", 
            name: "混沌珠", 
            description: "<p>玄天灵宝​​<p><p>描述：内含一方未开混沌，可遮掩天机，躲避天道探查。更可借混沌之气修炼，为无上悟道之宝。<p><p>神威：①混沌世界：内蕴完整世界雏形 ②遮掩天机：圣人难算 ③混沌之气：可转化一切能量<p>",
            bonus: 3.3,
            materials: {  spirit_stone: 20000, chaos_fragment: 5000, destiny_fragment: 2000},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
       { 
            id: "immortal_fanz", 
            name: "山河社稷图", 
            description: "<p>玄天灵宝​​<p><p>描述：女娲圣人之宝，图内自生大千寰宇，山川河岳。一图一世界，生灵无尽，可因生因灭，尽在掌中。<p><p>神威：①世界囚笼：将敌人摄入图中世界 ②造化生灵：图内可演化真实生灵 ③山河镇压：借图中世界之力镇压敌人<p>",
            bonus: 3.2,
            materials: {  chaos_fragment: 5000, star_dust: 1000, law_crystal: 1000, destiny_fragment: 1000},
            tier: 3,
            color: "#00BCD1",
            unique: true
        },
        { 
            id: "chaos_cauldron", 
            name: "天地玄黄玲珑塔", 
            description: "<p>玄天灵宝​​<p><p>描述：开天功德玄黄之气凝聚，后天第一功德至宝。立于头顶则先天不败，玄黄之气垂落，万法不侵，立于不败之地。<p><p>神威：①功德护体：玄黄之气免疫一切攻击 ②镇压气运：可保一方势力气运不衰 ③万法不侵：圣人之下攻击无效<p>",
            bonus: 3.4,
            materials: { chaos_fragment: 3000, yang_stone: 6000, eternity_core: 50, law_crystal: 1200, destiny_fragment: 1000},
            tier: 3,
            color: "#E91E63",
            unique: true
        },
        
        // 传说法宝
        { 
            id: "yin_yang_mirrorbaab", 
            name: "驱年爆竹", 
            description: "<p>年俗圣物(绝版)<p><p>描述：以朱砂、赤铜与雷音木炼制而成，专为驱逐年兽所造。燃放时声震百里，红光冲天，对年兽有极强的克制之效。<p><p>神威：① 爆竹惊邪：巨响与红光对年兽造成巨额伤害与恐惧 ② 红绸漫天：释放范围红光，削弱邪祟 ③ 爆竹齐鸣：可连环引爆，造成大范围爆炸伤害<p>",
            bonus: 1.6,
            materials: { water_crystal: 999999, fire_crystal: 999999, yang_stone: 999999, space_crystal: 999999 },
            tier: 4,
            color: "#FF0000",
            unique: true
        },
        { 
            id: "heavens_will_compass", 
            name: "东皇钟", 
            description: "<p>混沌灵宝​​<p><p>描述：东皇太一伴生至宝，钟体呈混沌玄黄色，钟身刻日月星辰、地水火风。钟响时时空凝固，镇压鸿蒙，演化天道玄机。内蕴一方混沌世界，可演化万物。<p><p>神威：①时空禁锢：钟声所及，时间停滞，空间冻结 ②镇压鸿蒙：可镇压一方世界气运 ③演化混沌：钟内自成世界，可困圣人<p>",
            bonus: 3.7,
            materials: { chaos_fragment: 2000, space_stone: 2000, destiny_fragment: 500, time_essence: 200, eternity_core: 200},
            tier: 4,
            color: "#8A2BE2",
            unique: true
        },
        { 
            id: "heavens_will_compassa", 
            name: "鸿蒙量天尺", 
            description: "<p>混沌灵宝<p><p>描述：开天功德凝聚，与天地玄黄玲珑塔一攻一防。尺量天地，划分阴阳，一尺之下可丈量因果，削人气运。通体紫金，刻有鸿蒙符文，挥动时引动混沌之气，有开天辟地之威。<p><p>神威：①丈量天地：可测量空间距离，破除一切空间禁制 ②削运斩命：直接攻击敌人气运与寿命 ③功德护体：万邪不侵，因果不沾<p>",
            bonus: 3.6,
            materials: { chaos_fragment: 1500, space_stone: 1500, destiny_fragment: 500, law_crystal: 500, eternity_core: 500},
            tier: 4,
            color: "#8A2BE2",
            unique: true
        },
        { 
            id: "heavens_will_compassb", 
            name: "造化笔", 
            description: "<p>混沌灵宝<p><p>描述：可书写法则，画虚为实。一笔出，法则现，天地从。但每书写一字，消耗万年寿元。<p><p>神威：①言出法随：书写即成法则 ②造化生灵：可创造真实生灵 ③修改现实：短暂修改局部天道规则<p>",
            bonus: 3.8,
            materials: { star_dust: 1500, law_crystal: 1500, eternity_core: 600, time_essence: 700, space_crystal: 400},
            tier: 4,
            color: "#8A2BE2",
            unique: true
        },
        { 
            id: "heavens_will_compassc", 
            name: "黑洞之瞳", 
            description: "<p>混沌灵宝<p><p>描述：模拟黑洞炼制，呈纯黑色球体。催动可产生吞噬之力，吞噬万物，连光都无法逃脱。<p><p>神威：①万物吞噬：可吞噬一切攻击 ②空间扭曲：扭曲周围空间 ③引力奇点：产生超强引力场<p>",
            bonus: 3.9,
            materials: { yin_stone: 5000, space_stone: 2500, star_dust: 1500, law_crystal: 1500,  time_essence: 300, space_crystal: 1000},
            tier: 4,
            color: "#8A2BE2",
            unique: true
        },
        { 
            id: "heavens_will_compassd", 
            name: "平行世界门扉", 
            description: "<p>混沌灵宝<p><p>描述：一扇看似普通的木门，打开后可能连接其他平行世界。门后世界随机，可能富饶，可能危险，可能相似，可能截然不同。每次开门消耗巨大，且无法控制目的地。<p><p>神威：①世界穿越：随机进入平行世界 ②资源获取：从其他世界获取特有资源 ③危机转嫁：将强敌引入危险世界<p>",
            bonus: 4.2,
            materials: { chaos_fragment: 4000, space_stone: 4000, star_dust: 1500, law_crystal: 1500,  eternity_core: 1000, space_crystal: 1400},
            tier: 4,
            color: "#8A2BE2",
            unique: true
        },
        { 
            id: "heavens_will_compasse", 
            name: "因果轮回盘", 
            description: "<p>混沌灵宝<p><p>描述：盘分六道，缓缓旋转。可追查一切因果来源，将自身业力暂时转移，或将敌人打入畜生道虚影受百世轮回之苦。<p><p>神威：①因果追溯：查找事件根源 ②业力转移：转移部分业力 ③六道轮回：精神层面施加轮回折磨<p>",
            bonus: 4.4,
            materials: { yang_stone: 10000, chaos_fragment: 4000, time_sand: 5000, destiny_fragment: 3000,  eternity_core: 3000},
            tier: 4,
            color: "#8A2BE2",
            unique: true
        },
        { 
            id: "heavens_will_compassf", 
            name: "虚空古镜", 
            description: "<p>混沌灵宝<p><p>描述：镜面漆黑如深渊，可映照诸天万界任意地点。持镜者可穿透空间阻隔，观察亿万里外景象，更可开辟临时空间通道。<p><p>神威：①万界洞察：观察任意已知坐标地点 ②虚空通道：开辟临时空间门 ③镜面反射：反弹空间类攻击<p>",
            bonus: 4,
            materials: { spirit_stone: 20000, chaos_fragment: 2000, space_stone: 2000, star_dust: 3000,  space_crystal: 500},
            tier: 4,
            color: "#8A2BE2",
            unique: true
        },
        { 
            id: "heavens_will_compassg", 
            name: "大道之种", 
            description: "<p>混沌灵宝<p><p>描述：开天辟地前，鸿蒙中孕育的第一粒“概念”。无形无质，存在于真实与虚幻之间。它不是法宝，而是一粒包含“道”之终极可能的种子。<p><p>神威：①道之起源：可于体内或身外开辟一条从未存在过的“道”的雏形。②规则定义：在自身“道”的覆盖范围内，可暂时重写或否定现有天地法则。③概念化身：自身存在逐渐升华为一种“概念”，难以被任何形式的攻击彻底抹除。<p>",
            bonus: 4.5,
            materials: { chaos_fragment: 5000, space_stone: 4000, law_crystal: 1000, eternity_core: 2000, time_essence: 3000,  space_crystal: 5000},
            tier: 4,
            color: "#8A2BE2",
            unique: true
        },
        { 
            id: "heavens_will_compassga", 
            name: "诸果之因", 
            description: "<p>混沌灵宝<p><p>描述：一株生长于因果长河源头的虚无之树，其上每一片叶子都是一段“起因”，而每一条根须都连接着一个“结果”。它不决定因果，而是因果本身的一种“具象化投影”。<p><p>神威：①因果洞察：看穿万物（包括圣人）的因果线。②因果嫁接：在微小事件上，替换或添加一个有利于自己的“因”，从而改变“果”。③因果绝缘：短暂将自身或某物从当前因果网中“摘除”，避开基于因果的推演、诅咒或攻击。<p>",
            bonus: 4.6,
            materials: { chaos_fragment: 8000, space_stone: 7000, law_crystal: 1500, eternity_core: 3000, time_essence: 1500,  space_crystal: 5000},
            tier: 4,
            color: "#8A2BE2",
            unique: true
        },
        { 
            id: "eternity_pagoda", 
            name: "万物归零剑", 
            description: "<p>混沌灵宝<p><p>描述：并非一把剑，而是一个“将万物归于虚无”的终极指令的具象化。它没有剑招，没有剑气，只有“斩出”这个动作。被其“斩中”的概念（如生命、时间、空间、法则），将从根源上被判定为“从未存在过”。<p><p>神威：①概念抹杀：指定一个“概念”进行斩杀，该概念将从当前宇宙信息中被彻底删除。②存在否定：使一个目标（无论其实力多强）的“存在”本身被暂时否定，陷入“非有非无”的彻底静止状态。<p>",
            bonus: 5.0,
            materials: { law_crystal: 10000, destiny_fragment: 10000,eternity_core: 5000, time_essence: 5000, space_crystal: 5000 },
            tier: 4,
            color: "#FF9800",
            unique: true
        }
    ],
    
    // 材料列表
    materials: [
        // 常见材料 - 70%几率
        { id: "spirit_stone", name: "灵石", color: "#4CAF50", dropChance: 0.80, tier: 1 },
        { id: "wood", name: "灵木", color: "#8BC34A", dropChance: 0.80, tier: 1 },
        { id: "water_crystal", name: "水晶", color: "#2196F3", dropChance: 0.80, tier: 1 },
        { id: "fire_crystal", name: "火晶", color: "#FF5722", dropChance: 0.80, tier: 1 },
        
        // 稀有材料 - 5%几率
        { id: "metal_crystal", name: "金晶", color: "#FFD700", dropChance: 0.05, tier: 2 },
        { id: "wood_crystal", name: "木晶", color: "#8BC34A", dropChance: 0.05, tier: 2 },
        { id: "earth_crystal", name: "土晶", color: "#795548", dropChance: 0.05, tier: 2 },
        { id: "yin_stone", name: "阴石", color: "#9C27B0", dropChance: 0.05, tier: 2 },
        { id: "yang_stone", name: "阳石", color: "#FF9800", dropChance: 0.05, tier: 2 },
        
        // 珍贵材料 - 1%几率
        { id: "immortal_feather", name: "仙羽", color: "#00BCD4", dropChance: 0.01, tier: 3 },
        { id: "celestial_silk", name: "天蚕丝", color: "#E91E63", dropChance: 0.01, tier: 3 },
        { id: "chaos_fragment", name: "混沌碎片", color: "#673AB7", dropChance: 0.01, tier: 3 },
        { id: "space_stone", name: "空间石", color: "#3F51B5", dropChance: 0.01, tier: 3 },
        { id: "time_sand", name: "时光砂", color: "#009688", dropChance: 0.01, tier: 3 },
        
        // 传奇材料 - 0.1%几率
        { id: "destiny_fragment", name: "命运碎片", color: "#8A2BE2", dropChance: 0.001, tier: 4 },
        { id: "star_dust", name: "星辰尘", color: "#FFD700", dropChance: 0.001, tier: 4 },
        { id: "law_crystal", name: "法则水晶", color: "#4CAF50", dropChance: 0.001, tier: 4 },
        
        // 神话材料 - 0.01%几率
        { id: "eternity_core", name: "永恒核心", color: "#FF5722", dropChance: 0.0001, tier: 5 },
        { id: "time_essence", name: "时光精华", color: "#2196F3", dropChance: 0.0001, tier: 5 },
        { id: "space_crystal", name: "空间水晶", color: "#9C27B0", dropChance: 0.0001, tier: 5 }
    ],
    
    
    baseDropChance: 0.02 
};

// 初始化法宝系统
function initMagicToolSystem() {
    if (!player.magicTools) {
        player.magicTools = {
            equipped: null,
            inventory: [],
            materials: {}
        };
        
        // 初始化所有材料为0
        magicToolConfig.materials.forEach(material => {
            player.magicTools.materials[material.id] = 0;
        });
    }
    
    // 更新UI后显示可合成的法宝
    setTimeout(() => {
        updateMagicToolUI();
        // 默认显示可合成的法宝
        showAllCraftableTools();
    }, 100);
}
function showCollectionBonusInfo() {
    const ownedCount = player.magicTools?.inventory?.length || 0;
    const collectionBonus = 1 + (ownedCount * 0.02);
    
    const info = document.createElement('div');
    info.style.position = 'fixed';
    info.style.top = '100px';
    info.style.right = '20px';
    info.style.background = 'linear-gradient(145deg, #4CAF5040, #4CAF5020)';
    info.style.color = 'white';
    info.style.padding = '15px';
    info.style.borderRadius = '10px';
    info.style.borderLeft = '5px solid #4CAF50';
    info.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    info.style.zIndex = '9999';
    info.style.minWidth = '200px';
    info.style.maxWidth = '250px';
    info.style.transform = 'translateX(400px)';
    info.style.transition = 'transform 0.5s ease-out';
    
    info.innerHTML = `
        <div style="font-weight: bold; color: #4CAF50; margin-bottom: 10px;">法宝收集加成</div>
        <div style="font-size: 18px; font-weight: bold; color: #FFD700; margin-bottom: 5px;">+${ownedCount}%</div>
        <div style="font-size: 12px; color: #aaa;">已收集: ${ownedCount}/${magicToolConfig.tools.length} 个法宝</div>
        <div style="font-size: 11px; color: #666; margin-top: 10px;">每收集一个法宝额外提升1%修炼速度</div>
    `;
    
    document.body.appendChild(info);
    
    // 动画显示
    setTimeout(() => {
        info.style.transform = 'translateX(0)';
    }, 10);
    
    // 动画隐藏
    setTimeout(() => {
        info.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (info.parentNode) {
                document.body.removeChild(info);
            }
        }, 500);
    }, 3000);
}

// 当获得新法宝时调用显示收集加成
function onNewMagicToolObtained(toolId) {
    // 显示合成成功提示后，再显示收集加成
    setTimeout(showCollectionBonusInfo, 3500);
}
// 打开法宝系统
function openMagicToolSystem() {
    initMagicToolSystem();
    
    const ui = document.getElementById('magicToolUI');
    const overlay = document.getElementById('magicToolOverlay');
    
    if (ui.style.display === 'block') {
        ui.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        ui.style.display = 'block';
        overlay.style.display = 'block';
        updateMagicToolUI();
    }
}

// 关闭法宝系统
function closeMagicToolSystem() {
    document.getElementById('magicToolUI').style.display = 'none';
    document.getElementById('magicToolOverlay').style.display = 'none';
}

// 更新法宝系统界面
function updateMagicToolUI() {
    updateEquippedTool();
    updateMaterialsDisplay();
    updateMagicToolInventory();
    
    // 初始化时清空选择
    if (!selectedToolForCrafting) {
        const previewDiv = document.getElementById('magicToolPreview');
        if (previewDiv && previewDiv.innerHTML.includes("法宝合成工坊")) {
            // 已经初始化了，不需要重复设置
        } else {
            clearSelection();
        }
    }
    
    // 更新收集加成显示
    updateCultivationExpUI();
}
function showAllCraftableTools() {
    const recipesDiv = document.getElementById('craftingRecipes');
    
    // 查找所有可合成且未拥有的法宝
    const craftableTools = magicToolConfig.tools.filter(tool => 
        checkCanCraftTool(tool.id) && 
        !player.magicTools.inventory.includes(tool.id)  // 不显示已拥有的
    );
    
    if (craftableTools.length === 0) {
        // 检查是否有已经拥有的法宝
        const ownedToolsCount = player.magicTools.inventory.length;
        const totalToolsCount = magicToolConfig.tools.length;
        
        if (ownedToolsCount >= totalToolsCount) {
            recipesDiv.innerHTML = `
                <div style="text-align: center; padding: 30px; color: #4CAF50;">
                    <div style="font-size: 36px; margin-bottom: 20px;">🎉</div>
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">恭喜！</div>
                    <div style="font-size: 14px; margin-bottom: 5px;">你已经收集了所有法宝！</div>
                    <div style="font-size: 12px; color: #aaa; margin-top: 10px;">
                        获得 ${ownedToolsCount}% 的永久修炼加成
                    </div>
                </div>
            `;
        } else {
            recipesDiv.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
                    <div style="font-size: 14px; margin-bottom: 5px;">当前没有可合成的法宝</div>
                    <div style="font-size: 12px; color: #aaa; margin-top: 10px;">
                        已收集: ${ownedToolsCount}/${totalToolsCount} 个法宝
                        <div style="height: 4px; background: #444; border-radius: 2px; margin-top: 5px; overflow: hidden;">
                            <div style="height: 100%; width: ${(ownedToolsCount / totalToolsCount) * 100}%; background: #4CAF50;"></div>
                        </div>
                    </div>
                </div>
            `;
        }
        return;
    }
    
    let recipesHTML = `
        <div style="margin-bottom: 10px; font-size: 12px; color: #4CAF50; font-weight: bold;">
            可合成的法宝 (${craftableTools.length}个):
        </div>
    `;
    
    craftableTools.forEach(tool => {
        recipesHTML += `
            <div style="background: rgba(76, 175, 80, 0.1); padding: 10px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #4CAF50; cursor: pointer;"
                 onclick="selectToolForCrafting('${tool.id}')"
                 onmouseenter="this.style.background='rgba(76,175,80,0.2)'"
                 onmouseleave="this.style.background='rgba(76,175,80,0.1)'">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 14px; font-weight: bold; color: ${tool.color};">${tool.name}</div>
                        <div style="font-size: 11px; color: #aaa; margin-top: 2px;">T${tool.tier} 法宝 • ${tool.bonus.toFixed(1)}倍加成</div>
                    </div>
                    <div style="font-size: 20px; color: #4CAF50;">➜</div>
                </div>
            </div>
        `;
    });
    
    // 添加收集进度信息
    const ownedToolsCount = player.magicTools.inventory.length;
    const totalToolsCount = magicToolConfig.tools.length;
    const remainingTools = totalToolsCount - ownedToolsCount;
    
    recipesHTML += `
        <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 6px; font-size: 11px; color: #aaa;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>收集进度:</span>
                <span>${ownedToolsCount}/${totalToolsCount}</span>
            </div>
            <div style="height: 4px; background: #444; border-radius: 2px; overflow: hidden; margin-bottom: 5px;">
                <div style="height: 100%; width: ${(ownedToolsCount / totalToolsCount) * 100}%; background: #4CAF50;"></div>
            </div>
            <div style="text-align: center;">
                剩余可合成: <span style="color: #FFD700;">${remainingTools}</span> 个法宝
            </div>
        </div>
    `;
    
    recipesDiv.innerHTML = recipesHTML;
}

// 显示所有法宝配方
function showAllRecipes() {
    const recipesDiv = document.getElementById('craftingRecipes');
    
    const ownedToolsCount = player.magicTools.inventory.length;
    const totalToolsCount = magicToolConfig.tools.length;
    const unownedTools = magicToolConfig.tools.filter(tool => 
        !player.magicTools.inventory.includes(tool.id)
    );
    
    if (unownedTools.length === 0) {
        recipesDiv.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #4CAF50;">
                <div style="font-size: 36px; margin-bottom: 20px;">🏆</div>
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">全收集达成！</div>
                <div style="font-size: 14px; margin-bottom: 5px;">你已经获得了所有法宝</div>
                <div style="font-size: 12px; color: #aaa; margin-top: 15px;">
                    享受 ${ownedToolsCount}% 的永久修炼加成吧！
                </div>
            </div>
        `;
        return;
    }
    
    let recipesHTML = `
        <div style="margin-bottom: 10px; font-size: 12px; color: #FFD700; font-weight: bold;">
            未获得的法宝配方 (${unownedTools.length}/${totalToolsCount}):
        </div>
    `;
    
    // 按品级分组
    const toolsByTier = {};
    unownedTools.forEach(tool => {
        if (!toolsByTier[tool.tier]) {
            toolsByTier[tool.tier] = [];
        }
        toolsByTier[tool.tier].push(tool);
    });
    
    Object.keys(toolsByTier).sort((a, b) => a - b).forEach(tier => {
        const tierColor = getTierColor(tier);
        recipesHTML += `
            <div style="margin-bottom: 10px;">
                <div style="font-size: 11px; color: ${tierColor}; margin-bottom: 5px; padding-bottom: 3px; border-bottom: 1px solid ${tierColor}40; display: flex; justify-content: space-between;">
                    <span>T${tier} 法宝</span>
                    <span>${toolsByTier[tier].length}个</span>
                </div>
        `;
        
        toolsByTier[tier].forEach(tool => {
            const canCraft = checkCanCraftTool(tool.id);
            const missingMaterials = getMissingMaterials(tool.id);
            
            recipesHTML += `
                <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 5px; margin-bottom: 5px; cursor: pointer;"
                     onclick="selectToolForCrafting('${tool.id}')"
                     onmouseenter="this.style.background='rgba(255,255,255,0.1)'"
                     onmouseleave="this.style.background='rgba(255,255,255,0.05)'">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="color: ${tool.color}; font-size: 12px; font-weight: bold;">${tool.name}</div>
                            <div style="font-size: 9px; color: ${canCraft ? '#4CAF50' : '#666'}; background: ${canCraft ? 'rgba(76,175,80,0.2)' : 'rgba(102,102,102,0.2)'}; padding: 1px 4px; border-radius: 2px;">
                                ${canCraft ? '可合成' : '材料不足'}
                            </div>
                        </div>
                        <div style="font-size: 10px; color: #FFD700; font-weight: bold;">${tool.bonus.toFixed(1)}×</div>
                    </div>
                    ${missingMaterials.length > 0 ? `
                        <div style="font-size: 9px; color: #666; margin-top: 3px;">
                            缺少: ${missingMaterials.map(m => `<span style="color: ${m.color};">${m.name}</span>`).join(', ')}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        recipesHTML += `</div>`;
    });
    
    // 添加收集进度
    recipesHTML += `
        <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #aaa; margin-bottom: 5px;">
                <span>法宝收集进度</span>
                <span>${ownedToolsCount}/${totalToolsCount}</span>
            </div>
            <div style="height: 6px; background: #444; border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
                <div style="height: 100%; width: ${(ownedToolsCount / totalToolsCount) * 100}%; background: linear-gradient(90deg, #4CAF50, #8BC34A);"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #666;">
                <span>加成: ${ownedToolsCount}%</span>
                <span>剩余: ${unownedTools.length}个</span>
            </div>
        </div>
    `;
    
    // 添加快捷按钮
    recipesHTML += `
        <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
            <button onclick="showAllCraftableTools()" style="background: rgba(76,175,80,0.2); color: #4CAF50; border: 1px solid #4CAF50; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 10px;">
                只看可合成
            </button>
            <button onclick="clearSelection()" style="background: rgba(255,255,255,0.1); color: #aaa; border: 1px solid #666; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 10px;">
                清空选择
            </button>
        </div>
    `;
    
    recipesDiv.innerHTML = recipesHTML;
}
function getMissingMaterials(toolId) {
    const tool = magicToolConfig.tools.find(t => t.id === toolId);
    if (!tool) return [];
    
    const missing = [];
    for (const [materialId, required] of Object.entries(tool.materials)) {
        const have = player.magicTools.materials[materialId] || 0;
        if (have < required) {
            const material = magicToolConfig.materials.find(m => m.id === materialId);
            missing.push({
                id: materialId,
                name: material.name,
                color: material.color,
                have: have,
                need: required
            });
        }
    }
    
    return missing;
}
// 更新装备的法宝显示
function updateEquippedTool() {
    const equippedDiv = document.getElementById('equippedMagicTool');
    const bonusInfo = document.getElementById('magicToolBonusInfo');
    const multiplier = document.getElementById('magicToolMultiplier');
    
    if (player.magicTools.equipped) {
        const tool = magicToolConfig.tools.find(t => t.id === player.magicTools.equipped);
        if (tool) {
            equippedDiv.innerHTML = `
                <div style="width: 100%;">
                    <div style="font-size: 20px; font-weight: bold; color: ${tool.color}; margin-bottom: 5px;">${tool.name}</div>
                    <div style="color: #aaa; margin-bottom: 10px;">${tool.description}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>加成: <span style="color: #FFD700; font-weight: bold;">${tool.bonus * 100}%</span></span>
                        <button onclick="unequipMagicTool()" style="background: #f44336; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;">卸下</button>
                    </div>
                </div>
            `;
            
            multiplier.textContent = tool.bonus.toFixed(1);
        }
    } else {
        equippedDiv.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <div style="font-size: 18px; color: #aaa; margin-bottom: 10px;">未装备任何法宝</div>
                <div style="color: #666;">装备法宝可提升修炼速度</div>
            </div>
        `;
        multiplier.textContent = "1";
    }
    
    // 更新主界面的法宝信息
    const mainToolInfo = document.getElementById('currentMagicToolInfo');
    if (player.magicTools.equipped) {
        const tool = magicToolConfig.tools.find(t => t.id === player.magicTools.equipped);
        mainToolInfo.innerHTML = `
            <div style="color: ${tool.color}; font-weight: bold;">${tool.name}</div>
            <div style="font-size: 12px; color: #aaa;">${tool.bonus.toFixed(1)}倍修炼</div>
        `;
    } else {
        mainToolInfo.textContent = "无装备法宝";
    }
}
// 添加全局变量来跟踪选择
let selectedToolForCrafting = null; // 当前选择的要合成的法宝ID
let selectedMaterialsForPreview = {}; // 用于预览的材料选择
// 更新材料显示
function updateMaterialsDisplay() {
    const materialsDiv = document.getElementById('magicMaterials');
    materialsDiv.innerHTML = '';
    
    // 计算每个材料相关的未获得法宝数量
    const materialToolCounts = {};
    magicToolConfig.materials.forEach(material => {
        const unownedToolsUsingMaterial = magicToolConfig.tools.filter(tool => 
            Object.keys(tool.materials).includes(material.id) && 
            !player.magicTools.inventory.includes(tool.id)
        );
        materialToolCounts[material.id] = unownedToolsUsingMaterial.length;
    });
    
    // 按品级分组显示
    const tiers = {};
    magicToolConfig.materials.forEach(material => {
        if (!tiers[material.tier]) {
            tiers[material.tier] = [];
        }
        tiers[material.tier].push(material);
    });
    
    // 按品级从低到高显示
    Object.keys(tiers).sort((a, b) => a - b).forEach(tier => {
        // 添加品级标题
        const tierHeader = document.createElement('div');
        tierHeader.style.gridColumn = '1 / -1';
        tierHeader.style.color = getTierColor(tier);
        tierHeader.style.fontSize = '14px';
        tierHeader.style.fontWeight = 'bold';
        tierHeader.style.marginTop = tier > 1 ? '10px' : '0';
        tierHeader.style.marginBottom = '8px';
        tierHeader.style.paddingBottom = '5px';
        tierHeader.style.borderBottom = `1px solid ${getTierColor(tier)}40`;
        tierHeader.textContent = getTierName(tier);
        materialsDiv.appendChild(tierHeader);
        
        // 显示该品级的材料
        tiers[tier].forEach(material => {
            const count = player.magicTools.materials[material.id] || 0;
            const toolCount = materialToolCounts[material.id] || 0;
            const materialDiv = document.createElement('div');
            materialDiv.style.padding = '10px';
            materialDiv.style.background = 'rgba(255,255,255,0.05)';
            materialDiv.style.borderRadius = '6px';
            materialDiv.style.textAlign = 'center';
            materialDiv.style.border = `2px solid ${material.color}`;
            materialDiv.style.cursor = 'pointer';
            materialDiv.style.position = 'relative';
            materialDiv.style.overflow = 'hidden';
            materialDiv.style.transition = 'all 0.2s';
            
            // 如果该材料没有未获得的配方，变灰显示
            if (toolCount === 0) {
                materialDiv.style.opacity = '0.6';
                materialDiv.style.filter = 'grayscale(0.3)';
            }
            
            // 悬停效果
            materialDiv.onmouseenter = () => {
                if (toolCount > 0) {
                    materialDiv.style.transform = 'translateY(-2px)';
                    materialDiv.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                }
            };
            materialDiv.onmouseleave = () => {
                materialDiv.style.transform = 'translateY(0)';
                materialDiv.style.boxShadow = 'none';
            };
            
            // 点击查看可合成的法宝
            materialDiv.onclick = () => {
                if (toolCount > 0) {
                    showRecipesForMaterial(material.id);
                }
            };
            
            // 添加材料品级背景
            const tierIndicator = document.createElement('div');
            tierIndicator.style.position = 'absolute';
            tierIndicator.style.top = '0';
            tierIndicator.style.right = '0';
            tierIndicator.style.width = '0';
            tierIndicator.style.height = '0';
            tierIndicator.style.borderLeft = '15px solid transparent';
            tierIndicator.style.borderRight = '15px solid transparent';
            tierIndicator.style.borderBottom = `15px solid ${material.color}`;
            tierIndicator.style.transform = 'rotate(45deg)';
            tierIndicator.style.opacity = '0.3';
            materialDiv.appendChild(tierIndicator);
            
            // 添加配方数量提示
            if (toolCount > 0) {
                const recipeCount = document.createElement('div');
                recipeCount.style.position = 'absolute';
                recipeCount.style.top = '3px';
                recipeCount.style.left = '3px';
                recipeCount.style.fontSize = '9px';
                recipeCount.style.color = '#4CAF50';
                recipeCount.style.background = 'rgba(0,0,0,0.5)';
                recipeCount.style.padding = '1px 4px';
                recipeCount.style.borderRadius = '3px';
                recipeCount.style.fontWeight = 'bold';
                recipeCount.textContent = `${toolCount}配方`;
                materialDiv.appendChild(recipeCount);
            }
            
            materialDiv.innerHTML += `
                <div style="font-size: 12px; color: ${material.color}; margin-bottom: 3px; position: relative; z-index: 1;">${material.name}</div>
                <div style="font-size: 18px; font-weight: bold; color: ${count > 0 ? '#FFD700' : '#666'}; position: relative; z-index: 1;">${count}</div>
                <div style="font-size: 10px; color: #666; position: relative; z-index: 1; margin-top: 2px;">${(material.dropChance * 100).toFixed(2)}%</div>
                ${toolCount === 0 ? 
                    '<div style="font-size: 9px; color: #4CAF50; position: relative; z-index: 1; margin-top: 3px; background: rgba(76,175,80,0.2); padding: 1px 4px; border-radius: 3px;">已全部获得</div>' : 
                    ''
                }
            `;
            materialsDiv.appendChild(materialDiv);
        });
    });
    
    // 添加统计信息
    const statsDiv = document.createElement('div');
    statsDiv.style.gridColumn = '1 / -1';
    statsDiv.style.marginTop = '15px';
    statsDiv.style.padding = '10px';
    statsDiv.style.background = 'rgba(255,255,255,0.05)';
    statsDiv.style.borderRadius = '8px';
    statsDiv.style.fontSize = '11px';
    statsDiv.style.color = '#aaa';
    
    const ownedToolsCount = player.magicTools.inventory.length;
    const totalToolsCount = magicToolConfig.tools.length;
    const remainingTools = totalToolsCount - ownedToolsCount;
    
    statsDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>法宝收集:</span>
            <span><span style="color: #4CAF50;">${ownedToolsCount}</span>/${totalToolsCount}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span>剩余可合成:</span>
            <span style="color: ${remainingTools > 0 ? '#FFD700' : '#4CAF50'}">${remainingTools}个</span>
        </div>
    `;
    
    materialsDiv.appendChild(statsDiv);
    
    // 在材料显示底部添加按钮
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.gridColumn = '1 / -1';
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.gap = '10px';
    buttonsDiv.style.marginTop = '10px';
    buttonsDiv.style.justifyContent = 'center';
    
    buttonsDiv.innerHTML = `
        <button onclick="showAllCraftableTools()" style="background: linear-gradient(45deg, #4CAF50, #2E7D32); color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; flex: 1;">
            可合成法宝
        </button>
        <button onclick="showAllRecipes()" style="background: rgba(255,255,255,0.1); color: #aaa; border: 1px solid #666; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-size: 12px; flex: 1;">
            所有配方
        </button>
    `;
    
    materialsDiv.appendChild(buttonsDiv);
}
// 获取品级颜色
function getTierColor(tier) {
    const colors = {
        1: '#4CAF50', // 绿色 - 常见
        2: '#2196F3', // 蓝色 - 稀有
        3: '#9C27B0', // 紫色 - 珍贵
        4: '#FF9800', // 橙色 - 传奇
        5: '#FF5722'  // 红色 - 神话
    };
    return colors[tier] || '#FFFFFF';
}

// 获取品级名称
function getTierName(tier) {
    const names = {
        1: '常见材料 (80%掉落几率)',
        2: '稀有材料 (5%掉落几率)',
        3: '珍贵材料 (1%掉落几率)',
        4: '传奇材料 (0.1%掉落几率)',
        5: '神话材料 (0.01%掉落几率)'
    };
    return names[tier] || `品级 ${tier}`;
}

function showRecipesForMaterial(materialId) {
    const recipesDiv = document.getElementById('craftingRecipes');
    const material = magicToolConfig.materials.find(m => m.id === materialId);
    
    if (!material) return;
    
    // 查找使用该材料且未拥有的法宝
    const toolsUsingMaterial = magicToolConfig.tools.filter(tool => 
        Object.keys(tool.materials).includes(materialId) && 
        !player.magicTools.inventory.includes(tool.id)  // 不显示已拥有的
    );
    
    if (toolsUsingMaterial.length === 0) {
        recipesDiv.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #666;">
                <div style="font-size: 24px; margin-bottom: 10px;">📭</div>
                <div style="font-size: 14px; margin-bottom: 5px;">没有新的配方</div>
                <div style="font-size: 12px; color: #aaa;">
                    使用 <span style="color: ${material.color};">${material.name}</span> 的法宝已经全部获得了
                </div>
            </div>
        `;
        return;
    }
    
    // 显示配方列表
    let recipesHTML = `
        <div style="margin-bottom: 10px; font-size: 12px; color: #aaa;">
            使用 <span style="color: ${material.color}; font-weight: bold;">${material.name}</span> 的配方 (${toolsUsingMaterial.length}个):
        </div>
    `;
    
    toolsUsingMaterial.forEach(tool => {
        const requiredCount = tool.materials[materialId];
        const hasCount = player.magicTools.materials[materialId] || 0;
        const canCraft = checkCanCraftTool(tool.id);
        
        recipesHTML += `
            <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid ${tool.color}; cursor: pointer;"
                 onclick="selectToolForCrafting('${tool.id}')"
                 onmouseenter="this.style.background='rgba(255,255,255,0.1)'"
                 onmouseleave="this.style.background='rgba(255,255,255,0.05)'">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <div style="font-size: 14px; font-weight: bold; color: ${tool.color};">${tool.name}</div>
                        <div style="font-size: 11px; color: #aaa; margin-top: 2px;">${tool.description}</div>
                    </div>
                    <div style="font-size: 10px; color: ${canCraft ? '#4CAF50' : '#f44336'}; background: ${canCraft ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)'}; padding: 2px 6px; border-radius: 3px;">
                        ${canCraft ? '可合成' : '材料不足'}
                    </div>
                </div>
                <div style="margin-top: 8px;">
                    <div style="font-size: 11px; color: #666; margin-bottom: 4px;">需要${material.name}:</div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="color: ${hasCount >= requiredCount ? '#4CAF50' : '#f44336'}; font-weight: bold;">
                            ${hasCount}/${requiredCount}
                        </div>
                        <div style="flex: 1; height: 4px; background: #444; border-radius: 2px; overflow: hidden;">
                            <div style="height: 100%; width: ${Math.min(100, (hasCount / requiredCount) * 100)}%; background: ${hasCount >= requiredCount ? '#4CAF50' : '#f44336'};"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    recipesDiv.innerHTML = recipesHTML;
    
    // 默认选择第一个可合成的法宝
    const firstCraftableTool = toolsUsingMaterial.find(tool => checkCanCraftTool(tool.id));
    if (firstCraftableTool) {
        selectToolForCrafting(firstCraftableTool.id);
    } else if (toolsUsingMaterial.length > 0) {
        // 如果没有可合成的，至少显示第一个
        selectToolForCrafting(toolsUsingMaterial[0].id);
    }
}
function checkCanCraftTool(toolId) {
    const tool = magicToolConfig.tools.find(t => t.id === toolId);
    if (!tool) return false;
    
    // 检查是否已经拥有（如果已拥有，不能合成）
    if (player.magicTools.inventory.includes(toolId)) {
        return false;
    }
    
    // 检查材料是否足够
    for (const [materialId, required] of Object.entries(tool.materials)) {
        const have = player.magicTools.materials[materialId] || 0;
        if (have < required) {
            return false;
        }
    }
    
    return true;
}
function selectToolForCrafting(toolId) {
    selectedToolForCrafting = toolId;
    const tool = magicToolConfig.tools.find(t => t.id === toolId);
    
    if (!tool) return;
    
    // 更新预览显示
    updateToolPreview(tool);
    
    // 更新材料选择信息
    updateSelectedMaterialsInfo(tool);
    
    // 更新合成按钮状态
    updateCraftButton(tool);
}
// 更新法宝预览
function updateToolPreview(tool) {
    const previewDiv = document.getElementById('magicToolPreview');
    const alreadyOwned = player.magicTools.inventory.includes(tool.id);
    const canCraft = checkCanCraftTool(tool.id);
    const tierColor = getTierColor(tool.tier);
    
    // 如果已拥有，显示不同的预览
    if (alreadyOwned) {
        previewDiv.innerHTML = `
            <div style="width: 100%;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="font-size: 40px; color: #4CAF50;">✅</div>
                    <div>
                        <div style="font-size: 24px; font-weight: bold; color: ${tool.color};">${tool.name}</div>
                        <div style="font-size: 12px; color: ${tierColor}; background: ${tierColor}20; padding: 2px 10px; border-radius: 10px; display: inline-block; margin-top: 5px;">已拥有 • T${tool.tier} 法宝</div>
                    </div>
                </div>
                
                <div style="color: #aaa; margin-bottom: 15px; font-size: 14px; line-height: 1.4;">${tool.description}</div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div style="background: rgba(255, 215, 0, 0.1); padding: 10px; border-radius: 8px;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">基础加成</div>
                        <div style="font-size: 20px; color: #FFD700; font-weight: bold;">${tool.bonus.toFixed(1)}倍</div>
                    </div>
                    <div style="background: rgba(76, 175, 80, 0.1); padding: 10px; border-radius: 8px;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">收集加成</div>
                        <div style="font-size: 20px; color: #4CAF50; font-weight: bold;">+1%</div>
                    </div>
                </div>
                
                <div style="background: rgba(76, 175, 80, 0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #4CAF50;">
                    <div style="font-size: 14px; color: #4CAF50; font-weight: bold; margin-bottom: 5px;">已添加到法宝库</div>
                    <div style="font-size: 12px; color: #aaa;">这个法宝正在为你的修炼提供加成</div>
                </div>
            </div>
        `;
        
        // 如果已拥有，禁用合成按钮
        const craftButton = document.getElementById('craftButton');
        craftButton.disabled = true;
        craftButton.style.background = '#666';
        craftButton.style.color = '#aaa';
        craftButton.textContent = '已拥有';
        
        return;
    }
    
    // 未拥有的法宝预览
    const missingMaterials = getMissingMaterials(tool.id);
    
    previewDiv.innerHTML = `
        <div style="width: 100%;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                <div style="font-size: 40px;">${canCraft ? '🔮' : '⏳'}</div>
                <div>
                    <div style="font-size: 24px; font-weight: bold; color: ${tool.color};">${tool.name}</div>
                    <div style="font-size: 12px; color: ${tierColor}; background: ${tierColor}20; padding: 2px 10px; border-radius: 10px; display: inline-block; margin-top: 5px;">T${tool.tier} 法宝</div>
                </div>
            </div>
            
            <div style="color: #aaa; margin-bottom: 15px; font-size: 14px; line-height: 1.4;">${tool.description}</div>
            
            ${missingMaterials.length > 0 ? `
                <div style="color: #f44336; margin-bottom: 15px; font-size: 14px; background: rgba(244, 67, 54, 0.1); padding: 10px; border-radius: 8px; border-left: 3px solid #f44336;">
                    <div style="font-weight: bold; margin-bottom: 5px;">缺少材料:</div>
                    ${missingMaterials.map(m => `
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 3px;">
                            <span style="color: ${m.color};">${m.name}</span>
                            <span>${m.have}/${m.need}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: rgba(255, 215, 0, 0.1); padding: 10px; border-radius: 8px;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">修炼加成</div>
                    <div style="font-size: 20px; color: #FFD700; font-weight: bold;">${tool.bonus.toFixed(1)}倍</div>
                </div>
                <div style="background: rgba(76, 175, 80, 0.1); padding: 10px; border-radius: 8px;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">收集加成</div>
                    <div style="font-size: 20px; color: #4CAF50; font-weight: bold;">+1%</div>
                </div>
            </div>
            
            <div style="margin-top: 15px;">
                <div style="font-size: 12px; color: #666; margin-bottom: 8px;">合成状态:</div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="font-size: 14px; color: ${canCraft ? '#4CAF50' : '#f44336'}; font-weight: bold;">
                        ${canCraft ? '可合成' : '材料不足'}
                    </div>
                    ${canCraft ? 
                        '<div style="font-size: 12px; color: #4CAF50; background: rgba(76,175,80,0.2); padding: 2px 8px; border-radius: 3px;">✓ 材料充足</div>' : 
                        '<div style="font-size: 12px; color: #f44336; background: rgba(244,67,54,0.2); padding: 2px 8px; border-radius: 3px;">✗ 缺少材料</div>'
                    }
                </div>
            </div>
        </div>
    `;
}
function updateSelectedMaterialsInfo(tool) {
    const infoDiv = document.getElementById('selectedMaterialsInfo');
    
    if (!tool) {
        infoDiv.innerHTML = "未选择法宝";
        return;
    }
    
    let materialsHTML = `
        <div style="font-size: 12px; color: #aaa; margin-bottom: 5px;">合成 ${tool.name} 所需材料:</div>
    `;
    
    let allMaterialsAvailable = true;
    let totalRequired = 0;
    let totalHave = 0;
    
    for (const [materialId, required] of Object.entries(tool.materials)) {
        const material = magicToolConfig.materials.find(m => m.id === materialId);
        const have = player.magicTools.materials[materialId] || 0;
        const isAvailable = have >= required;
        
        if (!isAvailable) allMaterialsAvailable = false;
        
        totalRequired += required;
        totalHave += Math.min(have, required);
        
        materialsHTML += `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px; font-size: 11px;">
                <span style="color: ${material.color};">${material.name}</span>
                <span style="color: ${isAvailable ? '#4CAF50' : '#f44336'}; font-weight: bold;">
                    ${have}/${required}
                </span>
            </div>
        `;
    }
    
    // 添加进度条
    const progressPercent = totalRequired > 0 ? (totalHave / totalRequired) * 100 : 0;
    materialsHTML += `
        <div style="margin-top: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #666; margin-bottom: 3px;">
                <span>材料收集进度</span>
                <span>${totalHave}/${totalRequired}</span>
            </div>
            <div style="height: 4px; background: #444; border-radius: 2px; overflow: hidden;">
                <div style="height: 100%; width: ${progressPercent}%; background: ${allMaterialsAvailable ? '#4CAF50' : '#f44336'};"></div>
            </div>
        </div>
    `;
    
    infoDiv.innerHTML = materialsHTML;
}
function updateCraftButton(tool) {
    const craftButton = document.getElementById('craftButton');
    const alreadyOwned = player.magicTools.inventory.includes(tool.id);
    const canCraft = checkCanCraftTool(tool.id);
    
    if (alreadyOwned) {
        craftButton.disabled = true;
        craftButton.style.background = '#666';
        craftButton.style.color = '#aaa';
        craftButton.textContent = '已拥有该法宝';
    } else if (canCraft) {
        craftButton.disabled = false;
        craftButton.style.background = `linear-gradient(45deg, ${tool.color}, ${tool.color}80)`;
        craftButton.style.color = 'white';
        craftButton.textContent = `合成 ${tool.name}`;
        craftButton.onclick = () => craftSelectedTool();
    } else {
        craftButton.disabled = true;
        craftButton.style.background = '#555';
        craftButton.style.color = '#888';
        craftButton.textContent = '材料不足';
    }
}
function craftSelectedTool() {
    if (!selectedToolForCrafting) {
        logAction("请先选择要合成的法宝", "error");
        return;
    }
    
    craftMagicTool(selectedToolForCrafting);
}
function clearSelection() {
    selectedToolForCrafting = null;
    selectedMaterialsForPreview = {};
    
    // 重置显示
    const previewDiv = document.getElementById('magicToolPreview');
    previewDiv.innerHTML = `
        <div style="width: 100%;">
            <div style="font-size: 48px; margin-bottom: 20px;">🔮</div>
            <div style="font-size: 18px; color: #aaa; margin-bottom: 10px;">法宝合成工坊</div>
            <div style="color: #666; font-size: 14px;">点击材料查看配方或使用下方按钮</div>
        </div>
    `;
    
    document.getElementById('selectedMaterialsInfo').innerHTML = "未选择材料";
    
    // 默认显示可合成的法宝
    showAllCraftableTools();
    
    const craftButton = document.getElementById('craftButton');
    craftButton.disabled = true;
    craftButton.style.background = '#555';
    craftButton.style.color = '#888';
    craftButton.textContent = '请选择要合成的法宝';
}

// 更新法宝库存显示
function updateMagicToolInventory() {
    const inventoryDiv = document.getElementById('magicToolInventory');
    inventoryDiv.innerHTML = '';
    
    if (player.magicTools.inventory.length === 0) {
        inventoryDiv.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">📦</div>
                <div style="font-size: 18px; margin-bottom: 10px;">法宝库空空如也</div>
                <div style="color: #aaa;">快去合成你的第一个法宝吧！</div>
            </div>
        `;
        return;
    }
    
    // 添加收集进度条
    const progressContainer = document.createElement('div');
    progressContainer.style.gridColumn = '1 / -1';
    progressContainer.style.marginBottom = '20px';
    progressContainer.id = 'magicToolCollectionProgress';
    inventoryDiv.appendChild(progressContainer);
    
    // 更新收集进度
    updateCollectionProgress();
    
    // 按品级排序显示法宝
    const sortedTools = [...player.magicTools.inventory]
        .map(id => magicToolConfig.tools.find(t => t.id === id))
        .filter(tool => tool) // 过滤掉可能为null的值
        .sort((a, b) => a.tier - b.tier); // 按品级排序
    
    sortedTools.forEach(tool => {
        const isEquipped = player.magicTools.equipped === tool.id;
        const toolDiv = document.createElement('div');
        toolDiv.style.padding = '15px';
        toolDiv.style.background = isEquipped 
            ? `linear-gradient(145deg, ${tool.color}40, ${tool.color}20)` 
            : 'rgba(255,255,255,0.05)';
        toolDiv.style.borderRadius = '8px';
        toolDiv.style.border = `2px solid ${tool.color}`;
        toolDiv.style.position = 'relative';
        toolDiv.style.overflow = 'hidden';
        
        // 添加品级角标
        const tierBadge = document.createElement('div');
        tierBadge.style.position = 'absolute';
        tierBadge.style.top = '5px';
        tierBadge.style.right = '5px';
        tierBadge.style.background = tool.color;
        tierBadge.style.color = 'white';
        tierBadge.style.fontSize = '10px';
        tierBadge.style.padding = '2px 6px';
        tierBadge.style.borderRadius = '3px';
        tierBadge.style.fontWeight = 'bold';
        tierBadge.textContent = `T${tool.tier}`;
        toolDiv.appendChild(tierBadge);
        
        toolDiv.innerHTML += `
            <div style="font-size: 16px; font-weight: bold; color: ${tool.color}; margin-bottom: 5px; padding-right: 30px;">${tool.name}</div>
            <div style="font-size: 12px; color: #aaa; margin-bottom: 10px; min-height: 40px;">${tool.description}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="color: #FFD700; font-weight: bold;">${tool.bonus.toFixed(1)}倍</span>
                <span style="font-size: 12px; color: #666;">
                    <span style="color: #4CAF50;">+1%</span> 收集加成
                </span>
            </div>
            ${isEquipped 
                ? '<button style="width: 100%; background: #f44336; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer;" onclick="unequipMagicTool()">卸下</button>'
                : '<button style="width: 100%; background: #4CAF50; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer;" onclick="equipMagicTool(\'' + tool.id + '\')">装备</button>'
            }
        `;
        inventoryDiv.appendChild(toolDiv);
    });
}
// 选择材料（用于合成预览）
let selectedMagicMaterials = {};

function selectMagicMaterial(materialId) {
    const material = magicToolConfig.materials.find(m => m.id === materialId);
    if (!material) return;
    
    if (!selectedMagicMaterials[materialId]) {
        selectedMagicMaterials[materialId] = 0;
    }
    selectedMagicMaterials[materialId]++;
    
    updateMagicToolPreview();
}


// 更新合成预览
function updateMagicToolPreview() {
    const previewDiv = document.getElementById('magicToolPreview');
    const materialsInfo = document.getElementById('selectedMaterialsInfo');
    const craftButton = document.getElementById('craftButton');
    
    // 清空预览
    previewDiv.innerHTML = "选择材料查看可合成的法宝";
    craftButton.disabled = true;
    craftButton.style.background = '#555';
    craftButton.style.color = '#888';
    craftButton.textContent = '选择材料';
    
    if (Object.keys(selectedMagicMaterials).length === 0) {
        materialsInfo.textContent = "未选择材料";
        return;
    }
    
    // 显示已选择的材料
    let materialsText = "已选择材料: ";
    for (const [materialId, count] of Object.entries(selectedMagicMaterials)) {
        const material = magicToolConfig.materials.find(m => m.id === materialId);
        if (material) {
            const tierColor = getTierColor(material.tier);
            materialsText += `<span style="color: ${tierColor}">${material.name}×${count}</span> `;
        }
    }
    materialsInfo.innerHTML = materialsText;
    
    // 检查可以合成的法宝
    for (const tool of magicToolConfig.tools) {
        let canCraft = true;
        
        // 检查材料是否足够
        for (const [materialId, required] of Object.entries(tool.materials)) {
            const have = selectedMagicMaterials[materialId] || 0;
            if (have < required) {
                canCraft = false;
                break;
            }
        }
        
        if (canCraft) {
            // 检查是否已经拥有该法宝
            const alreadyOwned = player.magicTools.inventory.includes(tool.id);
            
            // 显示可以合成的法宝
            const tierColor = getTierColor(tool.tier);
            previewDiv.innerHTML = `
                <div style="width: 100%;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <div style="font-size: 30px;">${alreadyOwned ? '✅' : '🔮'}</div>
                        <div>
                            <div style="font-size: 22px; font-weight: bold; color: ${tool.color};">${alreadyOwned ? '已拥有' : '可以合成'}: ${tool.name}</div>
                            <div style="font-size: 12px; color: ${tierColor}; background: ${tierColor}20; padding: 2px 8px; border-radius: 10px; display: inline-block;">T${tool.tier} 法宝</div>
                        </div>
                    </div>
                    ${alreadyOwned ? 
                        '<div style="color: #f44336; margin-bottom: 15px; font-size: 14px; background: rgba(244, 67, 54, 0.1); padding: 8px; border-radius: 5px;">⚠️ 已拥有该法宝，无法重复获得</div>' : 
                        `<div style="color: #aaa; margin-bottom: 15px; font-size: 14px;">${tool.description}</div>`
                    }
                    <div style="color: #FFD700; font-weight: bold; font-size: 18px; margin-bottom: 10px;">修炼加成: ${tool.bonus.toFixed(1)}倍</div>
                    <div style="color: #4CAF50; font-size: 14px; margin-bottom: 15px;">收集加成: +1% 修炼速度</div>
                    <div style="margin-top: 10px;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">所需材料:</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px;">${Object.entries(tool.materials).map(([id, required]) => {
                            const material = magicToolConfig.materials.find(m => m.id === id);
                            const hasMaterial = (player.magicTools.materials[id] || 0) >= required;
                            const isSelected = (selectedMagicMaterials[id] || 0) >= required;
                            return `<div style="background: ${isSelected ? (hasMaterial ? '#4CAF5040' : '#f4433640') : '#555'}; 
                                    color: ${isSelected ? (hasMaterial ? '#4CAF50' : '#f44336') : '#888'}; 
                                    padding: 3px 8px; border-radius: 5px; font-size: 11px;">
                                    ${material?.name}×${required} ${!hasMaterial ? '❌' : '✅'}
                                </div>`;
                        }).join('')}</div>
                    </div>
                </div>
            `;
            
            // 检查玩家是否已有足够材料且未拥有该法宝
            let hasAllMaterials = true;
            if (!alreadyOwned) {
                for (const [materialId, required] of Object.entries(tool.materials)) {
                    const have = player.magicTools.materials[materialId] || 0;
                    if (have < required) {
                        hasAllMaterials = false;
                        break;
                    }
                }
            }
            
            if (!alreadyOwned && hasAllMaterials) {
                craftButton.disabled = false;
                craftButton.style.background = `linear-gradient(45deg, ${tool.color}, ${tool.color}80)`;
                craftButton.style.color = 'white';
                craftButton.textContent = `合成 ${tool.name}`;
                craftButton.onclick = () => craftMagicTool(tool.id);
            } else if (alreadyOwned) {
                craftButton.textContent = '已拥有';
                craftButton.style.background = '#666';
                craftButton.style.color = '#aaa';
            } else {
                craftButton.textContent = '材料不足';
                craftButton.style.background = '#555';
                craftButton.style.color = '#888';
            }
            
            return;
        }
    }
    
    // 如果没有找到可合成的法宝
    previewDiv.innerHTML = `
        <div style="text-align: center; width: 100%;">
            <div style="font-size: 24px; margin-bottom: 10px;">❓</div>
            <div style="font-size: 18px; color: #aaa; margin-bottom: 10px;">无法合成法宝</div>
            <div style="color: #666; font-size: 14px;">当前材料组合无法合成任何法宝</div>
            <div style="color: #aaa; font-size: 12px; margin-top: 15px;">请尝试不同的材料组合</div>
        </div>
    `;
}


// 合成法宝
function craftMagicTool(toolId) {
    const tool = magicToolConfig.tools.find(t => t.id === toolId);
    if (!tool) return;
    
    // 检查是否已经拥有该法宝
    if (player.magicTools.inventory.includes(toolId)) {
        const errorMsg = `你已经拥有${tool.name}了！每个法宝只能获得一个。`;
        logAction(errorMsg, "error");
        showAlreadyOwnedNotification(tool);
        return;
    }
    
    // 检查材料是否足够
    let missingMaterials = [];
    for (const [materialId, required] of Object.entries(tool.materials)) {
        const have = player.magicTools.materials[materialId] || 0;
        if (have < required) {
            const material = magicToolConfig.materials.find(m => m.id === materialId);
            missingMaterials.push(`${material.name} (需要${required}个，只有${have}个)`);
        }
    }
    
    if (missingMaterials.length > 0) {
        const errorMsg = `材料不足！缺少: ${missingMaterials.join(', ')}`;
        logAction(errorMsg, "error");
        alert(`合成失败！\n\n缺少以下材料:\n${missingMaterials.join('\n')}`);
        return;
    }
    
    // 扣除材料
    for (const [materialId, required] of Object.entries(tool.materials)) {
        player.magicTools.materials[materialId] -= required;
    }
    
    // 添加法宝到库存
    player.magicTools.inventory.push(toolId);
    
    // 显示合成成功提示
    showCraftSuccessNotification(tool);
    
    // 更新收集加成显示
    updateCollectionProgress();
    
    // 重置选择
    clearSelection();
    
    logAction(`成功合成法宝: ${tool.name}！`, "success");
    updateMagicToolUI();
    updateDisplay();
    
    // 延迟显示收集加成信息
    setTimeout(showCollectionBonusInfo, 3500);
}
function showCraftSuccessNotification(tool) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%) scale(0.5)';
    notification.style.background = `linear-gradient(145deg, ${tool.color}40, ${tool.color}20)`;
    notification.style.color = 'white';
    notification.style.padding = '30px';
    notification.style.borderRadius = '20px';
    notification.style.border = `3px solid ${tool.color}`;
    notification.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.maxWidth = '400px';
    notification.style.textAlign = 'center';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.5s ease-out';
    
    notification.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">✨</div>
        <div style="font-size: 28px; font-weight: bold; color: ${tool.color}; margin-bottom: 10px;">合成成功！</div>
        <div style="font-size: 22px; font-weight: bold; margin-bottom: 15px;">${tool.name}</div>
        <div style="color: #aaa; margin-bottom: 20px;">${tool.description}</div>
        <div style="background: rgba(255, 215, 0, 0.2); padding: 10px; border-radius: 10px; margin-bottom: 20px;">
            <div style="font-size: 18px; color: #FFD700;">修炼加成: ${tool.bonus.toFixed(1)}倍</div>
        </div>
        <div style="color: #666; font-size: 14px;">该法宝已添加到你的法宝库中</div>
    `;
    
    document.body.appendChild(notification);
    
    // 动画显示
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // 动画隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.5)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 3000);
}
function showAlreadyOwnedNotification(tool) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%) scale(0.5)';
    notification.style.background = `linear-gradient(145deg, #f4433640, #f4433620)`;
    notification.style.color = 'white';
    notification.style.padding = '30px';
    notification.style.borderRadius = '20px';
    notification.style.border = `3px solid #f44336`;
    notification.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.maxWidth = '400px';
    notification.style.textAlign = 'center';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.5s ease-out';
    
    notification.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <div style="font-size: 28px; font-weight: bold; color: #f44336; margin-bottom: 10px;">已拥有该法宝</div>
        <div style="font-size: 22px; font-weight: bold; margin-bottom: 15px;">${tool.name}</div>
        <div style="color: #aaa; margin-bottom: 20px;">每个法宝只能拥有一个</div>
        <div style="background: rgba(244, 67, 54, 0.2); padding: 10px; border-radius: 10px; margin-bottom: 20px;">
            <div style="font-size: 16px; color: #FFD700;">法宝收集加成已生效: +1%修炼速度</div>
        </div>
        <div style="color: #666; font-size: 14px;">继续收集其他法宝来获得更多加成！</div>
    `;
    
    document.body.appendChild(notification);
    
    // 动画显示
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // 动画隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.5)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 3000);
}
function updateCollectionProgress() {
    const totalTools = magicToolConfig.tools.length;
    const ownedTools = player.magicTools.inventory.length;
    const progress = totalTools > 0 ? (ownedTools / totalTools) * 100 : 0;
    
    // 更新法宝收集进度显示
    const collectionProgressElement = document.getElementById('magicToolCollectionProgress');
    if (collectionProgressElement) {
        collectionProgressElement.innerHTML = `
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #FFD700;">法宝收集进度</span>
                    <span style="color: #4CAF50;">${ownedTools}/${totalTools}</span>
                </div>
                <div style="background: #444; height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="height: 100%; background: linear-gradient(90deg, #4CAF50, #8BC34A); width: ${progress}%; transition: width 0.5s;"></div>
                </div>
            </div>
            <div style="color: #aaa; font-size: 12px; text-align: center;">
                每收集一个法宝获得1%修炼加成，当前加成: <span style="color: #FFD700;">${ownedTools}%</span>
            </div>
        `;
    }
}
// 装备法宝
function equipMagicTool(toolId) {
    if (!player.magicTools.inventory.includes(toolId)) {
        logAction("未拥有该法宝", "error");
        return;
    }
    
    player.magicTools.equipped = toolId;
    
    const tool = magicToolConfig.tools.find(t => t.id === toolId);
    if (tool) {
        logAction(`装备法宝: ${tool.name}`, "success");
    }
    
    updateMagicToolUI();
    updateCultivationExpUI();
}



// 卸下法宝
function unequipMagicTool() {
    player.magicTools.equipped = null;
    logAction("已卸下法宝", "info");
    updateMagicToolUI();
    updateCultivationExpUI();
}

// 材料掉落函数（在其他地方调用，掉落几率为1%）
function dropMagicMaterial() {
    if (typeof magicToolConfig !== 'object' || !magicToolConfig || !Array.isArray(magicToolConfig.materials)) return false;
    if (!player.magicTools || !player.magicTools.materials || typeof player.magicTools.materials !== 'object') return false;
    // 基础掉落判定
    if (Math.random() > magicToolConfig.baseDropChance) {
        return false;
    }
    
    // 计算总权重
    let totalWeight = 0;
    magicToolConfig.materials.forEach(material => {
        totalWeight += material.dropChance;
    });
    
    // 随机选择材料
    let random = Math.random() * totalWeight;
    let selectedMaterial = null;
    
    for (const material of magicToolConfig.materials) {
        random -= material.dropChance;
        if (random <= 0) {
            selectedMaterial = material;
            break;
        }
    }
    
    if (selectedMaterial) {
        // 获得材料
        player.magicTools.materials[selectedMaterial.id] = (player.magicTools.materials[selectedMaterial.id] || 0) + 1;
        
        // 显示掉落提示
        showMaterialDropNotification(selectedMaterial);
        
        // 更新显示
        safePanelUpdate(updateMagicToolUI);
        safePanelUpdate(updateDisplay);
        
        return true;
    }
    
    return false;
}
function showMaterialDropNotification(material) {
    // 创建掉落提示元素（半透明 + 不拦截点击，避免挡住界面按钮）
    const notification = document.createElement('div');
    const c = (material.color && material.color.length === 7) ? material.color : '#888888';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = `linear-gradient(145deg, ${c}28, ${c}12), rgba(15,12,10,0.35)`;
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '10px';
    notification.style.borderLeft = `3px solid ${c}`;
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.style.pointerEvents = 'none';
    notification.style.minWidth = '200px';
    notification.style.maxWidth = '300px';
    notification.style.transform = 'translateX(400px)';
    notification.style.transition = 'transform 0.5s ease-out';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.textShadow = '0 1px 3px rgba(0,0,0,0.75)';
    notification.style.webkitBackdropFilter = 'blur(4px)';
    notification.style.backdropFilter = 'blur(4px)';
    
    // 添加图标
    const icon = document.createElement('div');
    icon.style.fontSize = '24px';
    icon.textContent = '✨';
    notification.appendChild(icon);
    
    // 添加内容
    const content = document.createElement('div');
    content.innerHTML = `
        <div style="font-weight: bold; color: ${material.color}; margin-bottom: 5px;">获得材料</div>
        <div style="font-size: 18px; font-weight: bold;">${material.name}</div>
        <div style="font-size: 12px; color: #FFD700; margin-top: 5px;">掉落几率: ${(material.dropChance * 100).toFixed(1)}%</div>
    `;
    notification.appendChild(content);
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 动画显示
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // 动画隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 3000);
    
    // 同时记录到日志
    logAction(`获得材料: ${material.name} (${(material.dropChance * 100).toFixed(1)}%几率)`, "success");
}
function initGambleStone() {
    if (!player.gambleStone) {
        player.gambleStone = {
            // 用户数据
            userData: {
                balance: 1000.00,                    // 赌石专用余额
                totalBet: 0,                         // 总下注金额
                totalWon: 0,                         // 总赢得金额
                totalLost: 0,                        // 总输掉金额
                winRate: 0,                          // 胜率
                streak: 0,                           // 当前连胜/连败
                maxStreak: 0,                        // 最大连胜
                minStreak: 0,                        // 最大连败
                gamesPlayed: 0,                      // 总游戏次数
                winCuts: 0,                          // 出绿/头奖次数（用于真实胜率）
                lastGameTime: 0,                     // 上次游戏时间
                luckyLevel: 1,                       // 幸运等级（随声望提升，最高 5）
                heat: 0,                             // 狂热条，满 HEAT_FOR_FEVER 触发「狂热一刀」
                misfortune: 0,                       // 晦气 0–100，连败累积，压制胜率
                freeRecutStoneId: null,              // 石纹裂隙：下次指定档位免费切一刀
                reputation: 0,                       // 场口声望（影响幸运等级）
                qiPoints: 0,                         // 气运点（下刀可消耗，微演出绿/头奖）
                qiMeter: 0,                          // 气运槽 0–99，满 100 得 1 气运点
                eyeExp: 0,                           // 眼力经验（称号成长，不改概率）
                eyeLevelSeen: 1                      // 已提示过的眼力等级
            },
            
            // 石头数据
           stones: [
                // 等级1：普通石头
                {
                    id: 1,
                    name: "普通原石",
                    cost: 100,
                    color: "#94a3b8",
                    quality: "普通",
                    minReward: 50,
                    maxReward: 300,
                    winChance: 0.25,      //25%胜率
                    jackpotChance: 0.01, // 1%大奖
                    description: "普通的石头，风险较低但回报有限"
                },
                // 等级2：中等石头
                {
                    id: 2,
                    name: "翡翠原石",
                    cost: 500,
                    color: "#10b981",
                    quality: "良好",
                    minReward: 200,
                    maxReward: 1500,
                    winChance: 0.20,      // 20%胜率
                    jackpotChance: 0.02, // 2%大奖
                    description: "有翡翠纹理的石头，中等风险"
                },
                // 等级3：高级石头
                {
                    id: 3,
                    name: "玛瑙原石",
                    cost: 2000,
                    color: "#8b5cf6",
                    quality: "优秀",
                    minReward: 800,
                    maxReward: 8000,
                    winChance: 0.15,     // 15%胜率
                    jackpotChance: 0.03, // 3%大奖
                    description: "色泽鲜艳的玛瑙原石，高风险高回报"
                },
                // 等级4：稀有石头
                {
                    id: 4,
                    name: "帝王翡翠",
                    cost: 10000,
                    color: "#f59e0b",
                    quality: "稀有",
                    minReward: 4000,
                    maxReward: 50000,
                    winChance: 0.13,     // 13%胜率
                    jackpotChance: 0.04, // 4%大奖
                    description: "帝王级别的翡翠，一刀天堂一刀地狱"
                },
                // 等级5：传说石头
                {
                    id: 5,
                    name: "龙血石",
                    cost: 50000,
                    color: "#ef4444",
                    quality: "传说",
                    minReward: 20000,
                    maxReward: 500000,
                    winChance: 0.07,     // 7%胜率
                    jackpotChance: 0.05, // 5%大奖
                    description: "传说中的龙血石，沾染龙血的神秘宝石"
                },
                // 等级6–10：神话及以上（更高级标单）
                {
                    id: 6,
                    name: "龙髓宝岩",
                    cost: 120000,
                    color: "#f97316",
                    quality: "神话",
                    minReward: 60000,
                    maxReward: 1500000,
                    winChance: 0.034,
                    jackpotChance: 0.024,
                    description: "龙髓浸染的岩芯，色带如活物游走，一刀可登天亦可坠渊"
                },
                {
                    id: 7,
                    name: "凰泪血珀",
                    cost: 280000,
                    color: "#ec4899",
                    quality: "神话+",
                    minReward: 140000,
                    maxReward: 3500000,
                    winChance: 0.028,
                    jackpotChance: 0.020,
                    description: "封存凰泪的琥珀原石，流光内蕴，庄家亦不敢轻估"
                },
                {
                    id: 8,
                    name: "星核陨石",
                    cost: 650000,
                    color: "#22d3ee",
                    quality: "星界",
                    minReward: 320000,
                    maxReward: 8000000,
                    winChance: 0.022,
                    jackpotChance: 0.016,
                    description: "坠星核心碎片，辐射微光，剖开可能见星尘矿脉"
                },
                {
                    id: 9,
                    name: "虚空灵髓",
                    cost: 1500000,
                    color: "#a78bfa",
                    quality: "虚空",
                    minReward: 750000,
                    maxReward: 20000000,
                    winChance: 0.017,
                    jackpotChance: 0.012,
                    description: "虚空褶皱中凝结的灵髓，重量飘忽，切感如切雾"
                },
                {
                    id: 10,
                    name: "鸿蒙造化石",
                    cost: 3800000,
                    color: "#fde047",
                    quality: "鸿蒙",
                    minReward: 1800000,
                    maxReward: 50000000,
                    winChance: 0.011,
                    jackpotChance: 0.008,
                    description: "天地未分时的一缕造化，标场镇场之物，头奖可改命"
                }
            ],
            
            // 当前选择的石头
            currentStoneId: 1,
            
            // 游戏状态
            gameState: {
                isCutting: false,
                lastResult: null,
                animationStep: 0,
                cutHistory: [],
                nextCutFever: false,                  // 下一刀为狂热
                cutStyle: 'balanced',                // balanced | fast | slow 切开策略
                cutMode: 'full',                     // full | window | rub | half | line 引线切
                dailyQuest: null,                     // 本日悬赏进度（按本地日重置）
                marketWind: null,                    // { id, until } 本场风向，换季自动刷新
                spendQiNextCut: false,                // 是否在下刀消耗气运点
                spotIndex: 100,                       // 公盘现货指数（氛围，微波动）
                spotDelta: 0,
                session: { dayKey: '', cuts: 0, bestNet: 0, totalNet: 0 }
            },
            
            // 统计信息
            statistics: {
                biggestWin: 0,
                biggestLoss: 0,
                dailyBest: 0,
                luckyStones: [],
                unluckyStones: []
            },
            
            // 成就系统
            achievements: {
                firstCut: false,
                firstWin: false,
                firstJackpot: false,
                streak5: false,
                streak10: false,
                millionaire: false
            },
            
            // 设置
            settings: {
                soundEnabled: true,
                animationEnabled: true,
                autoCut: false,
                confirmCut: true
            }
        };
    }

    // 强制使用最新赌石数值表（高难度：整体胜率与头奖下调）
    if (player.gambleStone && Array.isArray(player.gambleStone.stones)) {
        applyGambleStoneDifficultyPatch(player.gambleStone.stones);
    }
    mergeGambleStoneCatalog();
    ensureGambleStoneExtras();
}

/** 各档石头平衡后的出绿率 / 头奖率（与 init 内初始值会被覆盖为一致）
 * 出绿：1 档 35% → 20 档 5%，线性递减；头奖：1 档约 1.1% → 20 档 0.5%。 */
function getGambleStoneDifficultyTable() {
    const round4 = function (x) { return Math.round(x * 10000) / 10000; };
    const tbl = {};
    for (let n = 1; n <= 20; n++) {
        tbl[n] = {
            winChance: round4(0.35 - 0.30 * ((n - 1) / 19)),
            jackpotChance: round4(0.011 - 0.006 * ((n - 1) / 19))
        };
    }
    return tbl;
}

function applyGambleStoneDifficultyPatch(stones) {
    const tbl = getGambleStoneDifficultyTable();
    stones.forEach(stone => {
        const row = tbl[stone.id];
        if (row) {
            stone.winChance = row.winChance;
            stone.jackpotChance = row.jackpotChance;
        }
    });
}

/** 高阶标单 6–10（与 init 中定义一致，供旧存档合并） */
function getGambleHighTierStonesOnly() {
    return [
        { id: 6, name: "龙髓宝岩", cost: 120000, color: "#f97316", quality: "神话", minReward: 60000, maxReward: 1500000, winChance: 0.034, jackpotChance: 0.024, description: "龙髓浸染的岩芯，色带如活物游走，一刀可登天亦可坠渊" },
        { id: 7, name: "凰泪血珀", cost: 280000, color: "#ec4899", quality: "神话+", minReward: 140000, maxReward: 3500000, winChance: 0.028, jackpotChance: 0.020, description: "封存凰泪的琥珀原石，流光内蕴，庄家亦不敢轻估" },
        { id: 8, name: "星核陨石", cost: 650000, color: "#22d3ee", quality: "星界", minReward: 320000, maxReward: 8000000, winChance: 0.022, jackpotChance: 0.016, description: "坠星核心碎片，辐射微光，剖开可能见星尘矿脉" },
        { id: 9, name: "虚空灵髓", cost: 1500000, color: "#a78bfa", quality: "虚空", minReward: 750000, maxReward: 20000000, winChance: 0.017, jackpotChance: 0.012, description: "虚空褶皱中凝结的灵髓，重量飘忽，切感如切雾" },
        { id: 10, name: "鸿蒙造化石", cost: 3800000, color: "#fde047", quality: "鸿蒙", minReward: 1800000, maxReward: 50000000, winChance: 0.011, jackpotChance: 0.008, description: "天地未分时的一缕造化，标场镇场之物，头奖可改命" }
    ];
}

/** 顶阶标单 11–20：标价由 10 档按指数爬升至 20 档 10 亿（数值表仍由难度补丁覆盖） */
function getGambleTier11to20StonesOnly() {
    const c10 = 3800000;
    const c20 = 1000000000;
    const defs = [
        { id: 11, name: '太初原璞', quality: '天工①', color: '#f472b6', desc: '混沌初开凝结的璞体，色根若隐若现，公盘亦罕有人问津。' },
        { id: 12, name: '归墟岩心', quality: '天工②', color: '#c084fc', desc: '渊底逆流冲成的岩芯，切开声闷，却可能藏深海绿。' },
        { id: 13, name: '北辰母岩', quality: '天工③', color: '#93c5fd', desc: '借星斗方位摆过桩，纹路若星轨盘绕，全凭胆大心细。' },
        { id: 14, name: '渊海髓胎', quality: '天工④', color: '#67e8f9', desc: '潮湿矿脉深处起货的裹髓料，水气足、风险亦足。' },
        { id: 15, name: '烛月片料', quality: '天工⑤', color: '#fcd34d', desc: '月圆夜入袋的片料，切面反光似月色，赌内化够不够。' },
        { id: 16, name: '洪荒胚料', quality: '天工⑥', color: '#fdba74', desc: '老坑杂糅的洪荒胚，皮老裂多，一刀天堂一刀笑话。' },
        { id: 17, name: '万相混元', quality: '天工⑦', color: '#a5b4fc', desc: '多股色流交缠，师傅摇头说切哪都得罪另一边。' },
        { id: 18, name: '界碑母矿', quality: '天工⑧', color: '#f9a8d4', desc: '界标矿带挖至见桩，重量压手，价亦压心跳。' },
        { id: 19, name: '终焉角料', quality: '天工⑨', color: '#bef264', desc: '压轴场次凑来的角料，传说多过肉，适合听响。' },
        { id: 20, name: '宙心天标', quality: '天工⑩', color: '#fde047', desc: '十亿天价镇场之石，见一眼算开眼界，切一刀算改命。' }
    ];
    return defs.map(function (d) {
        const cost = Math.round(c10 * Math.pow(c20 / c10, (d.id - 10) / 10));
        return {
            id: d.id,
            name: d.name,
            cost: cost,
            color: d.color,
            quality: d.quality,
            minReward: Math.floor(cost * 0.42),
            maxReward: Math.floor(cost * 14),
            winChance: 0.05,
            jackpotChance: 0.005,
            description: d.desc
        };
    });
}

/** 旧存档补全：合并高阶标单（6–20），并修正无效的当前选中档 */
function mergeGambleStoneCatalog() {
    const g = player.gambleStone;
    if (!g || !Array.isArray(g.stones)) return;
    const byId = {};
    g.stones.forEach(s => { if (s && s.id != null) byId[s.id] = true; });
    getGambleHighTierStonesOnly().concat(getGambleTier11to20StonesOnly()).forEach(def => {
        if (!byId[def.id]) {
            g.stones.push(JSON.parse(JSON.stringify(def)));
            byId[def.id] = true;
        }
    });
    g.stones.sort((a, b) => (a.id || 0) - (b.id || 0));
    applyGambleStoneDifficultyPatch(g.stones);
    if (!g.stones.some(s => s.id === g.currentStoneId)) {
        g.currentStoneId = g.stones[0] ? g.stones[0].id : 1;
    }
}
/** 狂热条满值（越高越难触发狂热一刀） */
var GAMBLE_HEAT_FOR_FEVER = 98;
/** 赌石 ↔ 投资 单次转入/转出金额上限：10000亿（1e12） */
var GAMBLE_TRANSFER_SINGLE_MAX = 1e12;

/** 本场风向配置（影响概率/晦气/标价等，约 40–75 分钟换季） */
function getGambleMarketWindsCatalog() {
    return [
        { id: 'zoushui', name: '走水场', tag: '晦气涨得慢，清清再走刀', misLoseAdd: 7, misWinFactor: 0.6 },
        { id: 'chaochang', name: '炒场', tag: '看客多 · 狂热条蹿得快', heatExtra: 5 },
        { id: 'menbao', name: '闷包口', tag: '头奖更脆 · 出绿略闷', winMul: 0.91, jpMul: 1.14 },
        { id: 'jianlou', name: '捡漏日', tag: '低档货主好说话（本刀议价）', tierMax: 3, costMul: 0.87 },
        { id: 'gongpan', name: '公盘夜', tag: '高档料灯更聚 · 见绿略容易', tierMin: 11, highWinMul: 1.08 },
        { id: 'sanpai', name: '散客盈门', tag: '气运槽攒得更快', qiMeterBonus: 12 },
        { id: 'yuye', name: '雨夜标场', tag: '水花混石粉 · 心跳更响', winMul: 1.025, jpMul: 1.025, loseCapMul: 0.93 },
        { id: 'shifu', name: '师傅请假', tag: '临时顶班手生 · 晦气易涨难消', misLoseAdd: 9, misWinFactor: 0.45 },
        { id: 'hongbao', name: '红包口', tag: '围观起哄多 · 狂热条额外 +3', heatExtra: 3, winMul: 1.01 },
        { id: 'dama', name: '大妈扫货', tag: '低档料被扫 · 议价失效', tierMax: 4, costMul: 1.06 },
        { id: 'zaoshi', name: '早市清仓', tag: '低档标价再让一口', tierMax: 5, costMul: 0.91 },
        { id: 'zhibo', name: '直播带货', tag: '围观起哄 · 狂热略涨', heatExtra: 4, winMul: 0.98 },
        { id: 'fengkuang', name: '矿区封路', tag: '高档料惜售 · 头奖略脆', tierMin: 6, jpMul: 1.07, highWinMul: 1.03 },
        { id: 'yemen', name: '夜场关门', tag: '晦气消得快 · 狂热攒得慢', misWinFactor: 0.62, heatExtra: -2 }
    ];
}
function getGambleWindDef(id) {
    if (!id) return null;
    return getGambleMarketWindsCatalog().find(w => w.id === id) || null;
}
function getActiveGambleWind(gamble) {
    if (!gamble || !gamble.gameState || !gamble.gameState.marketWind) return null;
    const mw = gamble.gameState.marketWind;
    if (!mw.until || Date.now() > mw.until) return null;
    return getGambleWindDef(mw.id);
}
function refreshGambleMarketWindIfNeeded(gamble) {
    if (!gamble.gameState) return;
    const mw = gamble.gameState.marketWind;
    if (!mw || !mw.until || Date.now() > mw.until || !getGambleWindDef(mw.id)) {
        const list = getGambleMarketWindsCatalog();
        const picked = list[Math.floor(Math.random() * list.length)];
        gamble.gameState.marketWind = {
            id: picked.id,
            until: Date.now() + (40 + Math.floor(Math.random() * 35)) * 60 * 1000
        };
    }
}
function getGambleRumorLine() {
    const lines = [
        '旧闻：上次标王切开，老板三天没合眼。',
        '小道：东头摊位新到一批水石，真假掺着卖。',
        '传闻：有人开窗连绿三刀，出门被同行堵着问桩。',
        '行话：今夜灯影晃，多半是炒场——别跟心跳较劲。',
        '嘀咕：西角老缅只收现金，说「电子钱不聚气」。',
        '耳语：有人的半明料窗里漂亮，锯下去裂像蜘蛛开会。',
        '闲话：庄家今日脸色好，多半是昨夜没亏——你仍得当心。',
        '段子：新手第一刀出绿，老师傅只笑不说话，第二刀才教做人。',
        '提醒：捡漏日也有「漏的是心情」——标价便宜不等于肉多。',
        '怪谈：雨夜标场有人说听见石头里叹气，师傅骂别瞎编故事。',
        '八卦：隔壁直播间喊「稳了」，现场师傅翻了个白眼。',
        '老话：一刀穷一刀富，中间还有一刀「凑合能回个盒饭」。',
        '传闻：公盘夜灯太聚，有人把藓看成色，当场社死。',
        '小道：免费刀不是慈善，是裂隙营销——下刀仍看命。',
        '闲话：引线切像相亲第一面——好看未必过门，难看也未必没戏。',
        '提醒：早市清仓别贪便宜连扫，摊主可能把学费匀进标价。',
        '耳语：矿区封路那周，高档料报价像心电图，围观比买家多。',
        '段子：有人把「半明」当必胜，师傅只说窗里漂亮不算嫁妆。'
    ];
    return lines[Math.floor(Date.now() / 200000) % lines.length];
}

/** 旧存档补全：狂热条、免费再切、狂热一刀标记 */
function ensureGambleStoneExtras() {
    const g = player.gambleStone;
    if (!g || !g.userData) return;
    if (g.userData.heat == null || isNaN(g.userData.heat)) g.userData.heat = 0;
    g.userData.heat = Math.max(0, Math.min(200, g.userData.heat));
    if (g.userData.freeRecutStoneId === undefined) g.userData.freeRecutStoneId = null;
    if (g.userData.misfortune == null || isNaN(g.userData.misfortune)) g.userData.misfortune = 0;
    g.userData.misfortune = Math.max(0, Math.min(100, g.userData.misfortune));
    if (g.userData.winCuts == null || isNaN(g.userData.winCuts)) g.userData.winCuts = 0;
    g.userData.winCuts = Math.max(0, g.userData.winCuts);
    if (!g.gameState) g.gameState = { isCutting: false, lastResult: null, animationStep: 0, cutHistory: [] };
    if (g.gameState.nextCutFever == null) g.gameState.nextCutFever = false;
    if (!g.gameState.cutStyle) g.gameState.cutStyle = 'balanced';
    if (!g.gameState.cutMode) g.gameState.cutMode = 'full';
    if (!['full', 'window', 'rub', 'half', 'line'].includes(g.gameState.cutMode)) g.gameState.cutMode = 'full';
    if (g.gameState.peekBuff && typeof g.gameState.peekBuff.stoneId !== 'number') g.gameState.peekBuff = null;
    if (!Array.isArray(g.gameState.cutHistory)) g.gameState.cutHistory = [];
    if (g.gameState.marketWind === undefined) g.gameState.marketWind = null;
    if (g.gameState.spendQiNextCut == null) g.gameState.spendQiNextCut = false;
    if (g.userData.reputation == null || isNaN(g.userData.reputation)) g.userData.reputation = 0;
    g.userData.reputation = Math.max(0, g.userData.reputation);
    if (g.userData.qiPoints == null || isNaN(g.userData.qiPoints)) g.userData.qiPoints = 0;
    g.userData.qiPoints = Math.max(0, Math.min(12, g.userData.qiPoints));
    if (g.userData.qiMeter == null || isNaN(g.userData.qiMeter)) g.userData.qiMeter = 0;
    g.userData.qiMeter = Math.max(0, Math.min(99, g.userData.qiMeter));
    if (g.userData.luckyLevel == null || isNaN(g.userData.luckyLevel)) g.userData.luckyLevel = 1;
    g.userData.luckyLevel = Math.max(1, Math.min(5, g.userData.luckyLevel));
    if (!g.achievements) {
        g.achievements = {
            firstCut: false,
            firstWin: false,
            firstJackpot: false,
            streak5: false,
            streak10: false,
            millionaire: false
        };
    }
    if (!g.gameState.bladeLine || !['with', 'against', 'band'].includes(g.gameState.bladeLine)) g.gameState.bladeLine = 'with';
    if (g.gameState.mentorBuff != null && (typeof g.gameState.mentorBuff !== 'object' || g.gameState.mentorBuff.stoneId == null)) g.gameState.mentorBuff = null;
    if (g.gameState.appraisalBuff != null && (typeof g.gameState.appraisalBuff !== 'object' || g.gameState.appraisalBuff.stoneId == null)) g.gameState.appraisalBuff = null;
    if (g.gameState.auctionBid != null && (typeof g.gameState.auctionBid !== 'object' || g.gameState.auctionBid.stoneId == null)) g.gameState.auctionBid = null;
    if (g.gameState.publicAuctionLot != null && typeof g.gameState.publicAuctionLot !== 'object') g.gameState.publicAuctionLot = null;
    if (g.userData.lastAppraisalSlip != null && typeof g.userData.lastAppraisalSlip !== 'object') g.userData.lastAppraisalSlip = null;
    if (!g.codex || typeof g.codex !== 'object') {
        g.codex = { hues: {}, varieties: {}, grades: {}, stones: {}, modes: {} };
    } else {
        ['hues', 'varieties', 'grades', 'stones', 'modes'].forEach(function (k) {
            if (!g.codex[k] || typeof g.codex[k] !== 'object') g.codex[k] = {};
        });
    }
    if (g.userData.eyeExp == null || isNaN(g.userData.eyeExp)) g.userData.eyeExp = 0;
    g.userData.eyeExp = Math.max(0, g.userData.eyeExp);
    if (g.userData.eyeLevelSeen == null || isNaN(g.userData.eyeLevelSeen)) g.userData.eyeLevelSeen = 1;
    if (g.userData.scrapRushDayKey == null) g.userData.scrapRushDayKey = '';
    if (g.gameState.spotIndex == null || isNaN(g.gameState.spotIndex)) g.gameState.spotIndex = 100;
    g.gameState.spotIndex = Math.max(91, Math.min(109, Math.round(g.gameState.spotIndex * 10) / 10));
    if (g.gameState.spotDelta == null || isNaN(g.gameState.spotDelta)) g.gameState.spotDelta = 0;
    if (!g.gameState.session || typeof g.gameState.session !== 'object') {
        g.gameState.session = { dayKey: '', cuts: 0, bestNet: 0, totalNet: 0 };
    } else {
        ['dayKey', 'cuts', 'bestNet', 'totalNet'].forEach(function (k) {
            if (g.gameState.session[k] == null && k === 'dayKey') g.gameState.session.dayKey = '';
            if (g.gameState.session[k] == null && k !== 'dayKey') g.gameState.session[k] = 0;
        });
    }
    ensureGambleDailyQuest(g);
}

function getGambleStoneVenues() {
    return ['莫西沙', '会卡', '木那', '后江', '大马坎', '南齐', '莫湾基', '格应角', '莫莫亮', '包浆混场'];
}
function getGambleStoneSkins() {
    return ['细砂翻绵', '铁锈包浆', '荔枝皮壳', '杨梅沙皮', '大象皮', '脱砂老皮', '水泥油皮', '黄白盐沙'];
}
function rollGambleStoneProfile(stone) {
    return {
        stoneId: stone.id,
        venue: pickGamble(getGambleStoneVenues()),
        skin: pickGamble(getGambleStoneSkins()),
        heft: Math.random() < 0.5 ? '压手沉' : '上手飘',
        stallHeat: pickGamble(['燥', '闷', '平']),
        tavernLine: pickGamble([
            '摊主咬死不降价，说昨天有人盯了一下午。',
            '隔壁喊「色带像活的」——你听一半就够。',
            '皮壳上有道旧擦口，像是退货回流。',
            '行里传这包是拆标碎凑的，别全信。',
            '老板递烟：先擦再谈，别一上来就上大锯。',
            '有人场外嘀咕：这口像公斤料气质，别当戒面料赌。',
            '熟客低声：这石头昨天还在别家摊位，今天换张纸当新货。',
            '摊主老婆插话：别信他吹牛，上月同皮壳切垮三刀。',
            '有人手机外放《好运来》，被全场瞪到关静音。',
            '小孩问爸「绿不绿」，爸捂嘴：在这儿绿字不吉利，说「阳」。',
            '保安路过嘟囔：再堵通道收摊位费——师傅笑说那比切垮便宜。'
        ]),
        riskWord: pickGamble(['裂影隐约', '色花散', '棉未化', '癣靠边', '水头短一截', '翻砂顶手'])
    };
}
function ensureGambleActiveProfile(gamble, stone) {
    if (!stone) return null;
    ensureGambleStoneExtras();
    if (!gamble.gameState.activeProfile || gamble.gameState.activeProfile.stoneId !== stone.id) {
        gamble.gameState.activeProfile = rollGambleStoneProfile(stone);
    }
    return gamble.gameState.activeProfile;
}
function getGambleMentorPrice(stone) {
    return Math.min(12000, Math.max(66, Math.floor(stone.cost * 0.0055)));
}
function getGamblePrepPanelInnerHtml(gamble, stone) {
    refreshGamblePublicAuctionLotIfNeeded(gamble);
    const p = ensureGambleActiveProfile(gamble, stone);
    if (!p) return '';
    const bladeLine = gamble.gameState.bladeLine || 'with';
    const price = getGambleMentorPrice(stone);
    const mentorOn = !!(gamble.gameState.mentorBuff && gamble.gameState.mentorBuff.stoneId === stone.id);
    const lot = gamble.gameState.publicAuctionLot;
    const now = Date.now();
    const hasLot = lot && lot.until && now <= lot.until;
    const secLeft = hasLot ? Math.max(0, Math.ceil((lot.until - now) / 1000)) : 0;
    const mm = Math.floor(secLeft / 60);
    const ss = secLeft % 60;
    const bidFee = getGambleAuctionBidFee(stone);
    const apprFee = getGambleAppraisalFee(stone);
    const apprOn = !!(gamble.gameState.appraisalBuff && gamble.gameState.appraisalBuff.stoneId === stone.id);
    const slip = gamble.userData.lastAppraisalSlip && gamble.userData.lastAppraisalSlip.stoneId === stone.id
        ? gamble.userData.lastAppraisalSlip.text
        : '';
    const auctionHtml = hasLot
        ? `<div class="gs-auction-strip">
            <div class="gs-auction-ttl"><span class="gs-ah-tag">限时公盘</span> ${lot.tag}</div>
            <div class="gs-auction-sub">截拍剩 <b>${mm}</b> 分 <b>${String(ss).padStart(2, '0')}</b> 秒 · 举牌费 <span class="gs-ah-fee">¥ ${bidFee.toLocaleString()}</span></div>
            <div class="gs-auction-row">
                <button type="button" class="gs-auction-btn" id="gs-auction-bid-btn">举牌参拍</button>
                <span class="gs-auction-tip" id="gs-auction-bid-status">${gamble.gameState.auctionBid && gamble.gameState.auctionBid.stoneId === stone.id ? '已举牌 · 本轮截拍前一次有效' : '付举牌费，截拍前下刀吃加成（全切/开窗/引线/半明）'}</span>
            </div>
        </div>`
        : '<div class="gs-auction-strip gs-auction-strip--off">公盘举牌：当前无场次，进出界面或稍后会刷新。</div>';
    const slipHtml = slip
        ? '<div class="gs-slip-paper">' + slip + '</div>'
        : '<span class="gs-slip-empty">未办理 · 与档案联动生成玩笑证书</span>';
    return `
        ${auctionHtml}
        <div class="gs-profile-head"><span class="gs-ph-ico">▣</span> 标的档案 <span class="gs-ph-sub">换标刷新 · 场口沉浸</span></div>
        <div class="gs-profile-grid">
            <div class="gs-pg-cell"><span class="gs-pg-k">场口</span><span class="gs-pg-v">${p.venue}</span></div>
            <div class="gs-pg-cell"><span class="gs-pg-k">皮壳</span><span class="gs-pg-v">${p.skin}</span></div>
            <div class="gs-pg-cell"><span class="gs-pg-k">手感</span><span class="gs-pg-v">${p.heft}</span></div>
            <div class="gs-pg-cell"><span class="gs-pg-k">场火</span><span class="gs-pg-v">${p.stallHeat}</span></div>
            <div class="gs-pg-wide"><span class="gs-pg-k">行里一句</span><span class="gs-pg-v">${p.tavernLine}</span></div>
            <div class="gs-pg-wide"><span class="gs-pg-k">肉眼词</span><span class="gs-pg-v">${p.riskWord}</span></div>
        </div>
        <div class="gs-appraisal-block">
            <div class="gs-profile-head gs-profile-head--sm"><span class="gs-ph-ico">📜</span> 娱乐鉴定书 <span class="gs-ph-sub">假任务 · 与档案联动</span></div>
            <div class="gs-appraisal-row">
                <button type="button" class="gs-appraisal-btn" id="gs-appraisal-btn">办一张（娱乐） <span class="gs-ap-pr">¥ ${apprFee.toLocaleString()}</span></button>
                <span class="gs-appraisal-tip" id="gs-appraisal-status">${apprOn ? '鉴定章已盖 · 下刀全切/开窗/引线/半明生效一次' : '盖章后略抬出绿/头奖，擦皮不吃'}</span>
            </div>
            <div class="gs-appraisal-slip" id="gs-appraisal-slip">${slipHtml}</div>
        </div>
        <div class="gs-blade-block">
            <div class="gs-profile-head gs-profile-head--sm"><span class="gs-ph-ico">◇</span> 落刀位 <span class="gs-ph-sub">影响概率与刀程台词</span></div>
            <div class="gs-blade-radios">
                <label class="gs-br"><input type="radio" name="gs-blade-line" value="with" ${bladeLine === 'with' ? 'checked' : ''}> <b>顺纹开</b> · 稳一刀，出绿略稳</label>
                <label class="gs-br"><input type="radio" name="gs-blade-line" value="against" ${bladeLine === 'against' ? 'checked' : ''}> <b>逆纹楔</b> · 赌爆色，头奖↑胜率略↓</label>
                <label class="gs-br"><input type="radio" name="gs-blade-line" value="band" ${bladeLine === 'band' ? 'checked' : ''}> <b>跟色带</b> · 咬色进肉，出绿↑</label>
            </div>
        </div>
        <div class="gs-mentor-row">
            <button type="button" class="gs-mentor-btn" id="gs-mentor-btn">请教老师傅（茶水） <span class="gs-mentor-pr">¥ ${price.toLocaleString()}</span></button>
            <span class="gs-mentor-tip" id="gs-mentor-status">${mentorOn ? '耳语已备 · 下刀「全切/开窗/引线/半明」生效一次' : '付茶钱听真话，略抬出绿/头奖（擦皮不吃此加成）'}</span>
        </div>`;
}
function gambleMentorConsult() {
    ensureGambleStoneExtras();
    const gamble = player.gambleStone;
    if (!gamble || gamble.gameState.isCutting) return;
    const stone = gamble.stones.find(s => s.id === gamble.currentStoneId);
    if (!stone) return;
    const price = getGambleMentorPrice(stone);
    if (gamble.userData.balance < price) {
        showGambleNotification('茶水钱不够，先转点余额到场内', 'error');
        return;
    }
    if (gamble.gameState.mentorBuff && gamble.gameState.mentorBuff.stoneId === stone.id) {
        showGambleNotification('老师傅摆手：「刚才那句够你用一刀。」', 'info');
        return;
    }
    gamble.userData.balance -= price;
    gamble.userData.totalBet += price;
    gamble.userData.totalLost += price;
    gamble.gameState.mentorBuff = { stoneId: stone.id, winAdd: 0.024, jpAdd: 0.005 };
    showGambleNotification(pickGamble([
        '老师傅附耳：顺着蟒带走刀，别怕丢人。',
        '老师傅敲了敲皮壳：先看裂走向，再谈色。',
        '老师傅递回你茶杯：这口料，稳字当头。',
        '老师傅压低嗓子：灯压别晃，色会跑。',
        '老师傅笑：「行里话听三分，剩下七分靠命。」'
    ]), 'success');
    updateGambleStatsDisplay();
    const st = document.getElementById('gs-mentor-status');
    if (st) st.textContent = '耳语已备 · 下刀（全切/开窗/引线/半明）生效一次';
    saveGame();
}
function bindGamblePrepPanelEvents() {
    document.querySelectorAll('input[name="gs-blade-line"]').forEach(function (r) {
        r.addEventListener('change', function () {
            if (!player.gambleStone) return;
            player.gambleStone.gameState.bladeLine = this.value;
            saveGame();
        });
    });
    const mb = document.getElementById('gs-mentor-btn');
    if (mb) mb.addEventListener('click', gambleMentorConsult);
    const ab = document.getElementById('gs-auction-bid-btn');
    if (ab) ab.addEventListener('click', gamblePublicAuctionBid);
    const ap = document.getElementById('gs-appraisal-btn');
    if (ap) ap.addEventListener('click', gambleOrderFakeAppraisal);
}
function getGambleCrowdAsideLine() {
    return pickGamble([
        '人群里有人借火，师傅抬头骂了句方言。',
        '保安吹哨：别堵通道，要看上台阶。',
        '摊主老婆端来一壶茶，说是「压惊水」。',
        '隔壁摊位突然起哄：有人开窗见绿了！',
        '飞虫撞在灯上，师傅说别拍，怕晃色。',
        '手机外放行话直播，被喝止：别晃灯！',
        '有人踩了脚，骂声里夹杂着「别挡财气」。',
        '收废品的大爷探头看一眼，摇头走了——比你还干脆。',
        '两个同行打赌这刀涨垮，输的请夜宵，现场先赊账。',
        '空调滴水正好落在料上，有人说「天降财」有人说「晦气」。',
        '远处鞭炮响了一声，师傅愣了半秒才继续推锯。'
    ]);
}

/** 限时公盘：过期清空；约 45% 概率刷新一场 4～10 分钟的小举牌 */
function refreshGamblePublicAuctionLotIfNeeded(gamble) {
    if (!gamble || !gamble.gameState) return;
    const now = Date.now();
    let lot = gamble.gameState.publicAuctionLot;
    if (lot && lot.until && now > lot.until) {
        gamble.gameState.publicAuctionLot = null;
        gamble.gameState.auctionBid = null;
    }
    lot = gamble.gameState.publicAuctionLot;
    if (!lot || !lot.until || now > lot.until) {
        if (Math.random() < 0.45) {
            const mins = 4 + Math.floor(Math.random() * 7);
            gamble.gameState.publicAuctionLot = {
                until: now + mins * 60 * 1000,
                winAdd: 0.014 + Math.random() * 0.014,
                jpAdd: 0.003 + Math.random() * 0.005,
                tag: pickGamble(['缅甸口急单回流', '公盘夜临时加拍', '拆标户凑车', '押金切片集中进场', '口岸到货压场', '熟人让桩代举牌'])
            };
        }
    }
}
function getGambleAuctionBidFee(stone) {
    return Math.min(80000, Math.max(500, Math.floor(stone.cost * 0.0045)));
}
function getGambleAppraisalFee(stone) {
    return Math.min(25000, Math.max(88, Math.floor(stone.cost * 0.0028)));
}
function buildFakeAppraisalVerdict(profile, stone) {
    const grade = pickGamble(['B+娱乐向', '目测结论·不作价', '非实验室报告', '师父手写版', '仅供现场气氛']);
    const tail = pickGamble([
        '可赌内化，但别当证书维权。',
        '故事大于料性，建议听锯响。',
        '色带走向尚可，裂风险各自心里有数。',
        '水头表述仅供参考，成交靠眼力。',
        '本档标价高，先把心跳稳住再谈色。'
    ]);
    return '【娱乐鉴定·' + grade + '】关联档案：场口「' + profile.venue + '」·皮壳「' + profile.skin + '」·肉眼词「' + profile.riskWord + '」。' + tail + '（与档案联动，玩笑向。）';
}
function gamblePublicAuctionBid() {
    ensureGambleStoneExtras();
    const gamble = player.gambleStone;
    if (!gamble || gamble.gameState.isCutting) return;
    refreshGamblePublicAuctionLotIfNeeded(gamble);
    const lot = gamble.gameState.publicAuctionLot;
    if (!lot || !lot.until || Date.now() > lot.until) {
        showGambleNotification('本轮公盘未开场或已截拍，稍后再看。', 'info');
        return;
    }
    if (gamble.gameState.auctionBid && gamble.gameState.auctionBid.stoneId != null) {
        showGambleNotification('你已举牌，等本轮截拍落槌后再来。', 'info');
        return;
    }
    const stone = gamble.stones.find(s => s.id === gamble.currentStoneId);
    if (!stone) return;
    const fee = getGambleAuctionBidFee(stone);
    if (gamble.userData.balance < fee) {
        showGambleNotification('举牌费不足，先转资到场内', 'error');
        return;
    }
    gamble.userData.balance -= fee;
    gamble.userData.totalBet += fee;
    gamble.userData.totalLost += fee;
    gamble.gameState.auctionBid = {
        stoneId: stone.id,
        winAdd: lot.winAdd,
        jpAdd: lot.jpAdd,
        until: lot.until
    };
    showGambleNotification('举牌成功：截拍前下刀「全切/开窗/引线/半明」吃公盘加成（擦皮不吃）', 'success');
    updateGambleStatsDisplay();
    const st = document.getElementById('gs-auction-bid-status');
    if (st) st.textContent = '已举牌 · 本轮截拍前一次有效';
    saveGame();
}
function gambleOrderFakeAppraisal() {
    ensureGambleStoneExtras();
    const gamble = player.gambleStone;
    if (!gamble || gamble.gameState.isCutting) return;
    const stone = gamble.stones.find(s => s.id === gamble.currentStoneId);
    if (!stone) return;
    if (gamble.gameState.appraisalBuff && gamble.gameState.appraisalBuff.stoneId === stone.id) {
        showGambleNotification('本档已盖过娱乐鉴定章，下刀后再来办新的。', 'info');
        return;
    }
    const fee = getGambleAppraisalFee(stone);
    if (gamble.userData.balance < fee) {
        showGambleNotification('办证书钱不够', 'error');
        return;
    }
    const p = ensureGambleActiveProfile(gamble, stone);
    const verdict = buildFakeAppraisalVerdict(p, stone);
    gamble.userData.balance -= fee;
    gamble.userData.totalBet += fee;
    gamble.userData.totalLost += fee;
    gamble.gameState.appraisalBuff = { stoneId: stone.id, winAdd: 0.01, jpAdd: 0.0025, verdict: verdict };
    gamble.userData.lastAppraisalSlip = { stoneId: stone.id, text: verdict, at: Date.now() };
    showGambleNotification('「鉴定书」已出章——娱乐向，下刀略加成一次', 'success');
    updateGambleStatsDisplay();
    const slip = document.getElementById('gs-appraisal-slip');
    if (slip) slip.innerHTML = '<div class="gs-slip-paper">' + verdict + '</div>';
    const apSt = document.getElementById('gs-appraisal-status');
    if (apSt) apSt.textContent = '鉴定章已盖 · 下刀全切/开窗/引线/半明生效一次';
    saveGame();
}

/** 本刀应付：全切=标价；开窗≈半价；擦皮≈18%；半明≈75%；免费刀=0；捡漏日低档再议价 */
function getGambleEffectiveCost(stone, cutMode, isFreeCut) {
    if (isFreeCut) return 0;
    let base;
    if (cutMode === 'window') base = Math.max(1, Math.floor(stone.cost * 0.5));
    else if (cutMode === 'rub') base = Math.max(1, Math.floor(stone.cost * 0.18));
    else if (cutMode === 'half') base = Math.max(1, Math.floor(stone.cost * 0.75));
    else if (cutMode === 'line') base = Math.max(1, Math.floor(stone.cost * 0.32));
    else base = stone.cost;
    const g = player.gambleStone;
    const w = g && getActiveGambleWind(g);
    if (w && w.tierMax != null && stone.id <= w.tierMax && w.costMul != null) {
        base = Math.max(1, Math.floor(base * w.costMul));
    }
    return base;
}

/** 更新标价行（随全切/开窗切换） */
function refreshGambleCostLine() {
    const gamble = player.gambleStone;
    if (!gamble) return;
    const stone = gamble.stones.find(s => s.id === gamble.currentStoneId);
    const el = document.getElementById('gs-current-cost');
    if (!el || !stone) return;
    const cm = gamble.gameState.cutMode || 'full';
    const eff = getGambleEffectiveCost(stone, cm, false);
    if (cm === 'window') {
        el.innerHTML = '开窗本刀 <span style="color:#d4a853;font-weight:700;">¥ ' + eff.toLocaleString() + '</span>（约半价）<span style="color:#6b6458;"> · 标价 ¥ ' + stone.cost.toLocaleString() + '</span> · ' + stone.quality + '档';
    } else if (cm === 'rub') {
        el.innerHTML = '擦皮摸底 <span style="color:#7cb8d8;font-weight:700;">¥ ' + eff.toLocaleString() + '</span>（约18%）<span style="color:#6b6458;"> · 标价 ¥ ' + stone.cost.toLocaleString() + '</span> · 短刀程 · 可攒下刀加成';
    } else if (cm === 'half') {
        el.innerHTML = '半明料 <span style="color:#c9a86c;font-weight:700;">¥ ' + eff.toLocaleString() + '</span>（约75%）<span style="color:#6b6458;"> · 标价 ¥ ' + stone.cost.toLocaleString() + '</span> · 省刀程 · 波动更稳';
    } else if (cm === 'line') {
        el.innerHTML = '引线切 <span style="color:#a78bfa;font-weight:700;">¥ ' + eff.toLocaleString() + '</span>（约32%）<span style="color:#6b6458;"> · 标价 ¥ ' + stone.cost.toLocaleString() + '</span> · 楔线探色 · 进账适中';
    } else {
        el.innerHTML = '全切本刀 <span style="color:#d4a853;font-weight:700;">¥ ' + stone.cost.toLocaleString() + '</span> · ' + stone.quality + '档';
    }
}

function gambleCanCutStone(stone) {
    ensureGambleStoneExtras();
    const g = player.gambleStone;
    if (g.userData.freeRecutStoneId === stone.id) return true;
    const mode = g.gameState.cutMode || 'full';
    const need = getGambleEffectiveCost(stone, mode, false);
    return g.userData.balance >= need;
}

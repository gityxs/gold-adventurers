// 地主海钓与牧场
        // ========== 地主海钓：7 场地（含河里、江里）、鱼类数据库（含名字/价格/种类/稀有度/重量/长度/钓场/栖息地/介绍）、按概率出鱼 ==========
        var SEA_VENUES = [
            { id: 0, name: '近海码头', desc: '平静近海，鱼种丰富', icon: '🏗️' },
            { id: 1, name: '珊瑚礁', desc: '热带珊瑚，色彩斑斓', icon: '🪸' },
            { id: 2, name: '深海区', desc: '幽暗深海，大物出没', icon: '🌊' },
            { id: 3, name: '极地冰海', desc: '冰洋寒水，稀有鱼种', icon: '❄️' },
            { id: 4, name: '沉船遗迹', desc: '神秘沉船，珍奇聚集', icon: '🚢' },
            { id: 5, name: '河里', desc: '河流溪水，淡水鱼多', icon: '🏞️' },
            { id: 6, name: '江里', desc: '大江深水，大物出没', icon: '🛶' }
        ];
        // 稀有度与钓到概率（%），越稀有概率越低，最低 0.01%
        var SEA_RARITY_CONFIG = [
            { rarity: 'trash', label: '海洋垃圾', prob: 8 },
            { rarity: 'common', label: '普通', prob: 48 },
            { rarity: 'uncommon', label: '优良', prob: 20 },
            { rarity: 'rare', label: '稀有', prob: 12 },
            { rarity: 'precious', label: '珍奇', prob: 5 },
            { rarity: 'legendary', label: '传说', prob: 2 },
            { rarity: 'mythic', label: '神话', prob: 0.5 },
            { rarity: 'ancient', label: '远古', prob: 0.09 },
            { rarity: 'unique', label: '唯一', prob: 0.01 }
        ];
        
        function buildSeaFishList() {
            var venueNames = ['近海码头','珊瑚礁','深海区','极地冰海','沉船遗迹'];
            var list = [
                { name: '小黄鱼', basePrice: 12, category: '海水鱼', rarity: 'common', lengthMin: 10, lengthMax: 22, weightMin: 0.02, weightMax: 0.15, venues: [0,1], habitat: '近海沿岸、河口', desc: '我国重要经济鱼类，肉质细嫩，多用于晒制鱼干。' },
                { name: '带鱼', basePrice: 18, category: '海水鱼', rarity: 'common', lengthMin: 40, lengthMax: 120, weightMin: 0.2, weightMax: 1.2, venues: [0,1], habitat: '近海中下层', desc: '银白色带形身体，肉厚少刺，沿海常见。' },
                { name: '鲳鱼', basePrice: 25, category: '海水鱼', rarity: 'common', lengthMin: 15, lengthMax: 35, weightMin: 0.2, weightMax: 1.0, venues: [0,1], habitat: '近海、礁石区', desc: '体侧扁呈菱形，肉质鲜美。' },
                { name: '马鲛', basePrice: 28, category: '海水鱼', rarity: 'common', lengthMin: 35, lengthMax: 80, weightMin: 0.5, weightMax: 4, venues: [0,1], habitat: '近海上层', desc: '游速快，肉紧实，适合煎烤。' },
                { name: '秋刀鱼', basePrice: 15, category: '海水鱼', rarity: 'common', lengthMin: 25, lengthMax: 40, weightMin: 0.1, weightMax: 0.35, venues: [0,1], habitat: '温带近海', desc: '秋季洄游，油脂丰富，日料常见。' },
                { name: '沙丁鱼', basePrice: 10, category: '海水鱼', rarity: 'common', lengthMin: 12, lengthMax: 25, weightMin: 0.02, weightMax: 0.12, venues: [0,1], habitat: '近海群游', desc: '小型群居鱼类，常做罐头。' },
                { name: '鲱鱼', basePrice: 11, category: '海水鱼', rarity: 'common', lengthMin: 20, lengthMax: 38, weightMin: 0.15, weightMax: 0.5, venues: [0,1], habitat: '北大西洋、北海', desc: '北大西洋重要经济鱼，腌渍后风味独特。' },
                { name: '竹荚鱼', basePrice: 16, category: '海水鱼', rarity: 'common', lengthMin: 25, lengthMax: 50, weightMin: 0.2, weightMax: 0.8, venues: [0,1], habitat: '温带近海', desc: '体侧有棱鳞，刺身与烤制皆宜。' },
                { name: '鲭鱼', basePrice: 14, category: '海水鱼', rarity: 'common', lengthMin: 30, lengthMax: 50, weightMin: 0.3, weightMax: 1.2, venues: [0,1], habitat: '近海上层', desc: '背部青绿，腹部银白，油脂适中。' },
                { name: '鱿鱼', basePrice: 22, category: '头足类', rarity: 'common', lengthMin: 15, lengthMax: 45, weightMin: 0.1, weightMax: 0.8, venues: [0,1], habitat: '近海至深海', desc: '头足纲软体动物，烧烤与爆炒常用。' },
                { name: '乌贼', basePrice: 24, category: '头足类', rarity: 'common', lengthMin: 12, lengthMax: 35, weightMin: 0.15, weightMax: 0.6, venues: [0,1], habitat: '沿岸至大陆架', desc: '体内有墨囊，可制墨鱼丸。' },
                { name: '章鱼', basePrice: 35, category: '头足类', rarity: 'uncommon', lengthMin: 20, lengthMax: 80, weightMin: 0.3, weightMax: 3, venues: [0,1,2], habitat: '礁石、洞穴', desc: '八腕柔软，智力较高，口感弹牙。' },
                { name: '对虾', basePrice: 45, category: '甲壳类', rarity: 'common', lengthMin: 12, lengthMax: 22, weightMin: 0.02, weightMax: 0.08, venues: [0,1], habitat: '沿岸浅海、河口', desc: '养殖与野生均有，鲜甜可口。' },
                { name: '基围虾', basePrice: 38, category: '甲壳类', rarity: 'common', lengthMin: 8, lengthMax: 18, weightMin: 0.01, weightMax: 0.05, venues: [0,1], habitat: '咸淡水交界', desc: '壳薄肉嫩，白灼最宜。' },
                { name: '梭子蟹', basePrice: 42, category: '甲壳类', rarity: 'common', lengthMin: 8, lengthMax: 18, weightMin: 0.15, weightMax: 0.5, venues: [0,1], habitat: '近海沙泥底', desc: '蟹壳梭形，膏黄饱满。' },
                { name: '花蟹', basePrice: 48, category: '甲壳类', rarity: 'uncommon', lengthMin: 10, lengthMax: 20, weightMin: 0.2, weightMax: 0.6, venues: [0,1], habitat: '珊瑚礁、岩礁', desc: '壳面花纹艳丽，肉细嫩。' },
                { name: '青蟹', basePrice: 55, category: '甲壳类', rarity: 'uncommon', lengthMin: 10, lengthMax: 22, weightMin: 0.2, weightMax: 0.8, venues: [0,1], habitat: '河口、红树林', desc: '青壳白肚，膏多肉厚。' },
                { name: '扇贝', basePrice: 28, category: '贝类', rarity: 'common', lengthMin: 5, lengthMax: 12, weightMin: 0.02, weightMax: 0.12, venues: [0,1], habitat: '浅海砂底', desc: '闭壳肌即带子，鲜甜。' },
                { name: '蛤蜊', basePrice: 12, category: '贝类', rarity: 'common', lengthMin: 3, lengthMax: 8, weightMin: 0.01, weightMax: 0.05, venues: [0,1], habitat: '潮间带、泥沙', desc: '煮汤或炒制，价廉物美。' },
                { name: '牡蛎', basePrice: 32, category: '贝类', rarity: 'common', lengthMin: 5, lengthMax: 15, weightMin: 0.03, weightMax: 0.2, venues: [0,1], habitat: '礁石、滩涂', desc: '生蚝，可生食，锌含量高。' },
                { name: '海螺', basePrice: 25, category: '贝类', rarity: 'common', lengthMin: 4, lengthMax: 12, weightMin: 0.02, weightMax: 0.15, venues: [0,1], habitat: '礁石缝隙', desc: '螺肉紧实，白灼或爆炒。' },
                { name: '多宝鱼', basePrice: 65, category: '海水鱼', rarity: 'uncommon', lengthMin: 25, lengthMax: 55, weightMin: 0.5, weightMax: 2.5, venues: [0,1], habitat: '近海砂泥底', desc: '比目鱼一种，肉质细嫩无小刺。' },
                { name: '石斑鱼', basePrice: 88, category: '海水鱼', rarity: 'uncommon', lengthMin: 30, lengthMax: 80, weightMin: 0.8, weightMax: 8, venues: [0,1], habitat: '礁石区、洞穴', desc: '高档海水鱼，清蒸最佳。' },
                { name: '鲈鱼', basePrice: 38, category: '海水鱼', rarity: 'common', lengthMin: 25, lengthMax: 60, weightMin: 0.3, weightMax: 2.5, venues: [0,1], habitat: '近海、河口', desc: '淡水海水均有，刺少肉嫩。' },
                { name: '黑鲷', basePrice: 52, category: '海水鱼', rarity: 'uncommon', lengthMin: 25, lengthMax: 50, weightMin: 0.4, weightMax: 2, venues: [0,1], habitat: '岩礁、防波堤', desc: '矶钓名鱼，肉质紧实。' },
                { name: '真鲷', basePrice: 95, category: '海水鱼', rarity: 'rare', lengthMin: 30, lengthMax: 60, weightMin: 0.5, weightMax: 3, venues: [0,1], habitat: '岩礁、珊瑚礁', desc: '红鲷，喜庆宴席常用。' },
                { name: '比目鱼', basePrice: 48, category: '海水鱼', rarity: 'common', lengthMin: 20, lengthMax: 50, weightMin: 0.3, weightMax: 1.5, venues: [0,1], habitat: '砂泥底', desc: '两眼同侧，扁平身体。' },
                { name: '河豚', basePrice: 120, category: '海水鱼', rarity: 'rare', lengthMin: 15, lengthMax: 45, weightMin: 0.2, weightMax: 1.5, venues: [0,1], habitat: '沿岸、河口', desc: '需专业处理去毒，味极鲜。' },
                { name: '金线鱼', basePrice: 22, category: '海水鱼', rarity: 'common', lengthMin: 18, lengthMax: 35, weightMin: 0.15, weightMax: 0.5, venues: [0,1], habitat: '近海底层', desc: '体侧有金色纵带。' },
                { name: '马头鱼', basePrice: 35, category: '海水鱼', rarity: 'common', lengthMin: 20, lengthMax: 45, weightMin: 0.2, weightMax: 0.8, venues: [0,1], habitat: '砂泥底', desc: '头形似马，肉细。' },
                { name: '白姑鱼', basePrice: 20, category: '海水鱼', rarity: 'common', lengthMin: 18, lengthMax: 40, weightMin: 0.15, weightMax: 0.6, venues: [0,1], habitat: '近海底层', desc: '石首科，肉嫩。' },
                { name: '凤尾鱼', basePrice: 15, category: '海水鱼', rarity: 'common', lengthMin: 10, lengthMax: 22, weightMin: 0.02, weightMax: 0.1, venues: [0,1], habitat: '近海、河口', desc: '尾鳍分叉如凤尾，多制罐头。' },
                { name: '银鱼', basePrice: 28, category: '海水鱼', rarity: 'common', lengthMin: 5, lengthMax: 12, weightMin: 0.005, weightMax: 0.02, venues: [0,1], habitat: '淡水河口、近海', desc: '通体透明小银鱼，炒蛋或做羹。' },
                { name: '飞鱼', basePrice: 32, category: '海水鱼', rarity: 'uncommon', lengthMin: 25, lengthMax: 45, weightMin: 0.2, weightMax: 0.6, venues: [0,1], habitat: '热带亚热带海面', desc: '胸鳍发达可滑翔。' },
                { name: '鲻鱼', basePrice: 26, category: '海水鱼', rarity: 'common', lengthMin: 25, lengthMax: 55, weightMin: 0.3, weightMax: 1.5, venues: [0,1], habitat: '河口、沿岸', desc: '咸淡水均可生活。' },
                { name: '油甘鱼', basePrice: 75, category: '海水鱼', rarity: 'uncommon', lengthMin: 40, lengthMax: 90, weightMin: 1, weightMax: 8, venues: [0,1], habitat: '温带近海', desc: '青甘，油脂丰富，刺身佳品。' },
                { name: '鲣鱼', basePrice: 42, category: '海水鱼', rarity: 'common', lengthMin: 45, lengthMax: 100, weightMin: 1.5, weightMax: 25, venues: [0,1,2], habitat: '热带温带大洋', desc: '金枪鱼近亲，柴鱼片原料。' },
                { name: '三文鱼', basePrice: 85, category: '洄游鱼', rarity: 'uncommon', lengthMin: 50, lengthMax: 120, weightMin: 2, weightMax: 15, venues: [0,1,3], habitat: '冷水海域、溯河洄游', desc: '橙红肉质，生食与烟熏均宜。' },
                { name: '鳕鱼', basePrice: 55, category: '海水鱼', rarity: 'common', lengthMin: 40, lengthMax: 100, weightMin: 1, weightMax: 12, venues: [0,2,3], habitat: '冷水底层', desc: '北大西洋名产，肉白少脂。' },
                { name: '龙利鱼', basePrice: 48, category: '海水鱼', rarity: 'common', lengthMin: 25, lengthMax: 55, weightMin: 0.4, weightMax: 2, venues: [0,1], habitat: '近海砂底', desc: '舌鳎类，无小刺。' },
                { name: '海胆', basePrice: 68, category: '其他', rarity: 'uncommon', lengthMin: 5, lengthMax: 12, weightMin: 0.05, weightMax: 0.25, venues: [1], habitat: '礁石、海藻区', desc: '生殖腺为食，鲜甜。' },
                { name: '海参', basePrice: 180, category: '其他', rarity: 'rare', lengthMin: 15, lengthMax: 40, weightMin: 0.1, weightMax: 0.5, venues: [1,2], habitat: '礁石底、砂底', desc: '滋补海味，需发制。' },
                { name: '鲍鱼', basePrice: 220, category: '贝类', rarity: 'rare', lengthMin: 8, lengthMax: 25, weightMin: 0.08, weightMax: 0.5, venues: [1,2], habitat: '礁石缝隙', desc: '名贵贝类，鲜鲍或干鲍。' },
                { name: '龙虾', basePrice: 280, category: '甲壳类', rarity: 'rare', lengthMin: 25, lengthMax: 55, weightMin: 0.4, weightMax: 2, venues: [1,2], habitat: '珊瑚礁、岩洞', desc: '大螯龙虾，宴席高档食材。' },
                { name: '东星斑', basePrice: 320, category: '海水鱼', rarity: 'rare', lengthMin: 35, lengthMax: 70, weightMin: 1, weightMax: 5, venues: [1], habitat: '热带珊瑚礁', desc: '体色红艳带蓝点，石斑上品。' },
                { name: '老鼠斑', basePrice: 450, category: '海水鱼', rarity: 'precious', lengthMin: 40, lengthMax: 80, weightMin: 1.5, weightMax: 8, venues: [1], habitat: '珊瑚礁深穴', desc: '头小身肥似老鼠，名贵石斑。' },
                { name: '苏眉', basePrice: 580, category: '海水鱼', rarity: 'precious', lengthMin: 50, lengthMax: 120, weightMin: 2, weightMax: 25, venues: [1], habitat: '热带珊瑚礁', desc: '隆头鱼科大型种，肉质细腻。' },
                { name: '蓝唇鱼', basePrice: 680, category: '海水鱼', rarity: 'precious', lengthMin: 60, lengthMax: 130, weightMin: 3, weightMax: 30, venues: [1], habitat: '热带珊瑚礁', desc: '唇部蓝色，体型大，稀少。' },
                { name: '鲸鲨', basePrice: 9999, category: '软骨鱼', rarity: 'unique', lengthMin: 800, lengthMax: 1200, weightMin: 15000, weightMax: 34000, venues: [1,2], habitat: '热带温带大洋', desc: '世界最大鱼类，温和滤食，极难一见。' },
                { name: '大白鲨', basePrice: 8888, category: '软骨鱼', rarity: 'ancient', lengthMin: 350, lengthMax: 600, weightMin: 500, weightMax: 2000, venues: [2], habitat: '大洋、近海', desc: '顶级掠食者，传说中的海霸。' },
                { name: '蓝鳍金枪鱼', basePrice: 6666, category: '海水鱼', rarity: 'mythic', lengthMin: 200, lengthMax: 350, weightMin: 150, weightMax: 600, venues: [2], habitat: '温带大洋', desc: '金枪鱼之王，大腹油脂丰腴。' },
                { name: '皇带鱼', basePrice: 3500, category: '深海鱼', rarity: 'legendary', lengthMin: 300, lengthMax: 800, weightMin: 50, weightMax: 200, venues: [2,4], habitat: '深海偶上浮', desc: '传说中「海龙王」，银带修长。' },
                { name: '腔棘鱼', basePrice: 99999, category: '海水鱼', rarity: 'unique', lengthMin: 150, lengthMax: 200, weightMin: 50, weightMax: 90, venues: [2,4], habitat: '深海岩洞', desc: '活化石，曾以为灭绝，极罕有。' },
                { name: '大王乌贼', basePrice: 5200, category: '头足类', rarity: 'legendary', lengthMin: 400, lengthMax: 1200, weightMin: 100, weightMax: 275, venues: [2], habitat: '深海', desc: '巨型头足类，传说与鲸搏斗。' },
                { name: '南极冰鱼', basePrice: 128, category: '海水鱼', rarity: 'rare', lengthMin: 25, lengthMax: 45, weightMin: 0.3, weightMax: 1, venues: [3], habitat: '南极冰冷海域', desc: '血液透明，适应极寒。' },
                { name: '南极鳕', basePrice: 95, category: '海水鱼', rarity: 'uncommon', lengthMin: 35, lengthMax: 70, weightMin: 0.5, weightMax: 3, venues: [3], habitat: '南极大陆架', desc: '南极重要经济鱼。' },
                { name: '北极红点鲑', basePrice: 158, category: '洄游鱼', rarity: 'rare', lengthMin: 40, lengthMax: 90, weightMin: 0.8, weightMax: 6, venues: [3], habitat: '北极圈冷水', desc: '冷水鲑科，肉质鲜美。' },
                { name: '雪蟹', basePrice: 135, category: '甲壳类', rarity: 'uncommon', lengthMin: 12, lengthMax: 25, weightMin: 0.3, weightMax: 1.2, venues: [3], habitat: '北太平洋冷水', desc: '长脚雪蟹，蟹肉饱满。' },
                { name: '帝王蟹', basePrice: 380, category: '甲壳类', rarity: 'precious', lengthMin: 22, lengthMax: 45, weightMin: 2, weightMax: 12, venues: [3], habitat: '北太平洋深海', desc: '体型巨大，多产自阿拉斯加。' },
                { name: '沉船锈箱', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 20, lengthMax: 60, weightMin: 2, weightMax: 15, venues: [4], habitat: '沉船内部', desc: '沉船中的旧铁箱，锈迹斑斑。' },
                { name: '塑料瓶', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 20, lengthMax: 28, weightMin: 0.02, weightMax: 0.05, venues: [0,1,2,3,4], habitat: '全海域漂浮', desc: '人类丢弃的塑料瓶。' },
                { name: '破渔网', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 100, lengthMax: 500, weightMin: 0.5, weightMax: 3, venues: [0,1,2], habitat: '沿岸至近海', desc: '废弃渔网，缠住海洋生物。' },
                { name: '易拉罐', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 10, lengthMax: 15, weightMin: 0.01, weightMax: 0.03, venues: [0,1,2,3,4], habitat: '全海域', desc: '铝制饮料罐。' },
                { name: '旧轮胎', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 50, lengthMax: 70, weightMin: 5, weightMax: 12, venues: [0,1,4], habitat: '近海、沉船周边', desc: '被丢弃的汽车轮胎。' }
            ];
            var moreFish = [
                { name: '黄姑鱼', basePrice: 24, category: '海水鱼', rarity: 'common', lengthMin: 18, lengthMax: 42, weightMin: 0.2, weightMax: 0.7, venues: [0,1], habitat: '近海底层', desc: '石首科，鳔可制鱼胶。' },
                { name: '梅童', basePrice: 18, category: '海水鱼', rarity: 'common', lengthMin: 12, lengthMax: 28, weightMin: 0.05, weightMax: 0.25, venues: [0,1], habitat: '河口近海', desc: '小型石首鱼，头大身小。' },
                { name: '龙头鱼', basePrice: 14, category: '海水鱼', rarity: 'common', lengthMin: 18, lengthMax: 35, weightMin: 0.05, weightMax: 0.2, venues: [0,1], habitat: '近海泥沙底', desc: '俗称鼻涕鱼，体软。' },
                { name: '玉筋鱼', basePrice: 8, category: '海水鱼', rarity: 'common', lengthMin: 8, lengthMax: 18, weightMin: 0.01, weightMax: 0.05, venues: [0,1], habitat: '近海砂底', desc: '细长如筋，多作饵料。' },
                { name: '针鱼', basePrice: 22, category: '海水鱼', rarity: 'common', lengthMin: 25, lengthMax: 45, weightMin: 0.1, weightMax: 0.35, venues: [0,1], habitat: '近海表层', desc: '吻尖长，善跳跃。' },
                { name: '遮目鱼', basePrice: 30, category: '海水鱼', rarity: 'common', lengthMin: 35, lengthMax: 80, weightMin: 0.5, weightMax: 3, venues: [0,1], habitat: '沿岸、河口', desc: '热带亚热带养殖对象。' },
                { name: '鲤鱼', basePrice: 16, category: '淡水鱼', rarity: 'common', lengthMin: 25, lengthMax: 80, weightMin: 0.5, weightMax: 8, venues: [0], habitat: '江河湖泊', desc: '淡水四大家鱼之一。' },
                { name: '鲫鱼', basePrice: 18, category: '淡水鱼', rarity: 'common', lengthMin: 15, lengthMax: 45, weightMin: 0.2, weightMax: 1.5, venues: [0], habitat: '淡水静水', desc: '常见淡水鱼，炖汤鲜美。' },
                { name: '草鱼', basePrice: 20, category: '淡水鱼', rarity: 'common', lengthMin: 40, lengthMax: 100, weightMin: 1, weightMax: 15, venues: [0], habitat: '江河湖泊', desc: '四大家鱼，食草。' },
                { name: '青鱼', basePrice: 22, category: '淡水鱼', rarity: 'common', lengthMin: 45, lengthMax: 120, weightMin: 1.5, weightMax: 25, venues: [0], habitat: '大江大河', desc: '四大家鱼，底层栖。' },
                { name: '鲶鱼', basePrice: 26, category: '淡水鱼', rarity: 'common', lengthMin: 30, lengthMax: 80, weightMin: 0.5, weightMax: 10, venues: [0], habitat: '江河缓流', desc: '须多，无鳞，肉嫩。' },
                { name: '乌鳢', basePrice: 42, category: '淡水鱼', rarity: 'uncommon', lengthMin: 35, lengthMax: 80, weightMin: 0.8, weightMax: 5, venues: [0], habitat: '湖泊沼泽', desc: '黑鱼，生鱼片原料之一。' },
                { name: '鳜鱼', basePrice: 88, category: '淡水鱼', rarity: 'rare', lengthMin: 25, lengthMax: 55, weightMin: 0.5, weightMax: 4, venues: [0], habitat: '清水石底', desc: '桃花流水鳜鱼肥，名贵淡水鱼。' },
                { name: '虹鳟', basePrice: 58, category: '淡水鱼', rarity: 'uncommon', lengthMin: 30, lengthMax: 60, weightMin: 0.5, weightMax: 3, venues: [0,3], habitat: '冷水溪流', desc: '养殖虹鳟，可生食。' },
                { name: '海鳗', basePrice: 48, category: '海水鱼', rarity: 'uncommon', lengthMin: 60, lengthMax: 150, weightMin: 0.5, weightMax: 6, venues: [0,1,2], habitat: '礁石缝隙', desc: '长体蛇形，夜行捕食。' },
                { name: '海马', basePrice: 320, category: '海水鱼', rarity: 'rare', lengthMin: 8, lengthMax: 25, weightMin: 0.005, weightMax: 0.03, venues: [1], habitat: '海藻丛', desc: '雄性育儿，药用与观赏。' },
                { name: '海龙', basePrice: 280, category: '海水鱼', rarity: 'rare', lengthMin: 20, lengthMax: 45, weightMin: 0.02, weightMax: 0.08, venues: [1], habitat: '海草床', desc: '细长如龙，与海马近亲。' },
                { name: '狮子鱼', basePrice: 65, category: '海水鱼', rarity: 'uncommon', lengthMin: 25, lengthMax: 45, weightMin: 0.3, weightMax: 1.2, venues: [1], habitat: '珊瑚礁', desc: '鳍棘有毒，观赏与食用需谨慎。' },
                { name: '石头鱼', basePrice: 95, category: '海水鱼', rarity: 'rare', lengthMin: 25, lengthMax: 50, weightMin: 0.5, weightMax: 2, venues: [1], habitat: '礁石拟态', desc: '背鳍毒刺极毒，肉质鲜美。' },
                { name: '鮟鱇', basePrice: 72, category: '海水鱼', rarity: 'uncommon', lengthMin: 40, lengthMax: 120, weightMin: 0.5, weightMax: 25, venues: [1,2], habitat: '深海海底', desc: '头大嘴大，头前有拟饵。' },
                { name: '蝠鲼', basePrice: 420, category: '软骨鱼', rarity: 'precious', lengthMin: 300, lengthMax: 700, weightMin: 100, weightMax: 1400, venues: [1,2], habitat: '热带亚热带大洋', desc: '魔鬼鱼，胸鳍如翼。' },
                { name: '双髻鲨', basePrice: 380, category: '软骨鱼', rarity: 'rare', lengthMin: 200, lengthMax: 400, weightMin: 50, weightMax: 400, venues: [1,2], habitat: '热带温带海域', desc: '头呈锤形，感应灵敏。' },
                { name: '黄鳍金枪鱼', basePrice: 320, category: '海水鱼', rarity: 'rare', lengthMin: 100, lengthMax: 220, weightMin: 20, weightMax: 200, venues: [0,1,2], habitat: '热带温带大洋', desc: '胸鳍黄色，刺身常用。' },
                { name: '剑鱼', basePrice: 280, category: '海水鱼', rarity: 'rare', lengthMin: 200, lengthMax: 450, weightMin: 50, weightMax: 650, venues: [2], habitat: '大洋上层', desc: '上颌延长成剑，游速极快。' },
                { name: '旗鱼', basePrice: 260, category: '海水鱼', rarity: 'rare', lengthMin: 200, lengthMax: 350, weightMin: 30, weightMax: 100, venues: [0,1,2], habitat: '热带亚热带大洋', desc: '背鳍如帆，速游。' },
                { name: '翻车鱼', basePrice: 180, category: '海水鱼', rarity: 'precious', lengthMin: 180, lengthMax: 330, weightMin: 250, weightMax: 2300, venues: [1,2], habitat: '热带温带大洋', desc: '体高侧扁如盘，喜晒背。' },
                { name: '月亮鱼', basePrice: 220, category: '海水鱼', rarity: 'precious', lengthMin: 100, lengthMax: 200, weightMin: 30, weightMax: 200, venues: [2], habitat: '大洋中深层', desc: '体圆如月，温血鱼类。' },
                { name: '灯笼鱼', basePrice: 35, category: '深海鱼', rarity: 'uncommon', lengthMin: 8, lengthMax: 25, weightMin: 0.02, weightMax: 0.15, venues: [2], habitat: '深海', desc: '体侧有发光器。' },
                { name: '巨口鱼', basePrice: 85, category: '深海鱼', rarity: 'rare', lengthMin: 15, lengthMax: 50, weightMin: 0.1, weightMax: 2, venues: [2], habitat: '深海', desc: '口大，深海掠食者。' },
                { name: '沉船宝箱', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 40, lengthMax: 80, weightMin: 5, weightMax: 25, venues: [4], habitat: '沉船舱室', desc: '朽木与铁钉的旧箱。' },
                { name: '泡沫箱', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 40, lengthMax: 60, weightMin: 0.2, weightMax: 0.8, venues: [0,1,2,3,4], habitat: '全海域', desc: '白色泡沫塑料箱。' },
                { name: '塑料袋', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 20, lengthMax: 60, weightMin: 0.01, weightMax: 0.05, venues: [0,1,2,3,4], habitat: '全海域', desc: '漂浮的塑料袋。' },
                { name: '烂木板', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 50, lengthMax: 150, weightMin: 2, weightMax: 15, venues: [0,4], habitat: '近海、沉船', desc: '腐朽的船板或木料。' },
                { name: '锈铁桶', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 30, lengthMax: 50, weightMin: 3, weightMax: 10, venues: [2,4], habitat: '深海、沉船', desc: '锈蚀的铁桶。' }
            ];
            var evenMoreFish = [
                { name: '黄鱼', basePrice: 35, category: '海水鱼', rarity: 'common', lengthMin: 20, lengthMax: 45, weightMin: 0.2, weightMax: 0.9, venues: [0,1], habitat: '近海', desc: '大黄鱼小黄鱼统称，石首科。' },
                { name: '鳀鱼', basePrice: 9, category: '海水鱼', rarity: 'common', lengthMin: 10, lengthMax: 20, weightMin: 0.01, weightMax: 0.08, venues: [0,1], habitat: '近海群游', desc: '小型鱼，制鱼露或饵料。' },
                { name: '鲳鲹', basePrice: 19, category: '海水鱼', rarity: 'common', lengthMin: 22, lengthMax: 48, weightMin: 0.2, weightMax: 0.9, venues: [0,1], habitat: '近海', desc: '体侧扁，银白色。' },
                { name: '牙鲆', basePrice: 52, category: '海水鱼', rarity: 'uncommon', lengthMin: 30, lengthMax: 70, weightMin: 0.5, weightMax: 4, venues: [0,1], habitat: '砂泥底', desc: '比目鱼一种，左眼侧。' },
                { name: '舌鳎', basePrice: 38, category: '海水鱼', rarity: 'common', lengthMin: 20, lengthMax: 50, weightMin: 0.2, weightMax: 1.2, venues: [0,1], habitat: '沿岸砂底', desc: '长舌形，肉质细。' },
                { name: '马面鲀', basePrice: 22, category: '海水鱼', rarity: 'common', lengthMin: 18, lengthMax: 40, weightMin: 0.15, weightMax: 0.6, venues: [0,1], habitat: '近海', desc: '剥皮鱼，皮粗需剥。' },
                { name: '红杉鱼', basePrice: 26, category: '海水鱼', rarity: 'common', lengthMin: 20, lengthMax: 42, weightMin: 0.2, weightMax: 0.7, venues: [0,1], habitat: '近海底层', desc: '体色淡红。' },
                { name: '方头鱼', basePrice: 44, category: '海水鱼', rarity: 'uncommon', lengthMin: 30, lengthMax: 65, weightMin: 0.4, weightMax: 2, venues: [0,1], habitat: '岩礁', desc: '头方，肉嫩。' },
                { name: '罗非鱼', basePrice: 18, category: '淡水鱼', rarity: 'common', lengthMin: 20, lengthMax: 45, weightMin: 0.3, weightMax: 2, venues: [0], habitat: '淡水、咸淡水', desc: '非洲鲫鱼，养殖广。' },
                { name: '泥鳅', basePrice: 28, category: '淡水鱼', rarity: 'common', lengthMin: 10, lengthMax: 28, weightMin: 0.02, weightMax: 0.15, venues: [0], habitat: '稻田沟渠', desc: '可钻泥，滋补。' },
                { name: '黄鳝', basePrice: 48, category: '淡水鱼', rarity: 'uncommon', lengthMin: 35, lengthMax: 80, weightMin: 0.15, weightMax: 0.8, venues: [0], habitat: '稻田河沟', desc: '无鳞蛇形，补血。' },
                { name: '鲢鱼', basePrice: 14, category: '淡水鱼', rarity: 'common', lengthMin: 35, lengthMax: 80, weightMin: 0.5, weightMax: 8, venues: [0], habitat: '江河湖泊', desc: '白鲢，滤食浮游生物。' },
                { name: '鳙鱼', basePrice: 20, category: '淡水鱼', rarity: 'common', lengthMin: 40, lengthMax: 100, weightMin: 1, weightMax: 20, venues: [0], habitat: '江河湖泊', desc: '花鲢胖头，头大。' },
                { name: '鳊鱼', basePrice: 24, category: '淡水鱼', rarity: 'common', lengthMin: 25, lengthMax: 55, weightMin: 0.4, weightMax: 3, venues: [0], habitat: '静水缓流', desc: '体侧扁。' },
                { name: '香鱼', basePrice: 95, category: '洄游鱼', rarity: 'rare', lengthMin: 18, lengthMax: 30, weightMin: 0.08, weightMax: 0.25, venues: [0], habitat: '清澈溪流', desc: '有瓜香，名贵。' },
                { name: '池沼公鱼', basePrice: 32, category: '淡水鱼', rarity: 'common', lengthMin: 8, lengthMax: 18, weightMin: 0.01, weightMax: 0.06, venues: [0,3], habitat: '冷水湖', desc: '小型冷水鱼。' },
                { name: '胡瓜鱼', basePrice: 28, category: '海水鱼', rarity: 'common', lengthMin: 15, lengthMax: 28, weightMin: 0.03, weightMax: 0.15, venues: [0,1,3], habitat: '冷水近海', desc: '有黄瓜清香。' },
                { name: '多春鱼', basePrice: 42, category: '海水鱼', rarity: 'uncommon', lengthMin: 15, lengthMax: 22, weightMin: 0.02, weightMax: 0.08, venues: [0,1,3], habitat: '北太平洋', desc: '满腹鱼子，烤食。' },
                { name: '柳叶鱼', basePrice: 38, category: '海水鱼', rarity: 'common', lengthMin: 18, lengthMax: 28, weightMin: 0.03, weightMax: 0.12, venues: [0,3], habitat: '北太平洋', desc: '与多春鱼近缘。' },
                { name: '青甘鰤', basePrice: 88, category: '海水鱼', rarity: 'uncommon', lengthMin: 50, lengthMax: 120, weightMin: 2, weightMax: 15, venues: [0,1], habitat: '温带近海', desc: '青物代表，刺身用。' },
                { name: '章红', basePrice: 98, category: '海水鱼', rarity: 'uncommon', lengthMin: 55, lengthMax: 130, weightMin: 2.5, weightMax: 20, venues: [0,1], habitat: '温带亚热带', desc: '鰤鱼一种，油脂丰。' },
                { name: '黄条鰤', basePrice: 78, category: '海水鱼', rarity: 'uncommon', lengthMin: 45, lengthMax: 100, weightMin: 1.5, weightMax: 12, venues: [0,1], habitat: '近海外洋', desc: '体侧黄带。' },
                { name: '鬼头刀', basePrice: 62, category: '海水鱼', rarity: 'uncommon', lengthMin: 100, lengthMax: 220, weightMin: 5, weightMax: 40, venues: [0,1,2], habitat: '热带温带大洋', desc: '鲯鳅，色艳。' },
                { name: '鲔鱼', basePrice: 55, category: '海水鱼', rarity: 'common', lengthMin: 60, lengthMax: 180, weightMin: 5, weightMax: 80, venues: [0,1,2], habitat: '大洋', desc: '金枪鱼属，罐头常用。' },
                { name: '马林鱼', basePrice: 380, category: '海水鱼', rarity: 'legendary', lengthMin: 250, lengthMax: 450, weightMin: 100, weightMax: 600, venues: [2], habitat: '热带大洋', desc: '大型旗鱼科，上颌长矛。' },
                { name: '银鳕', basePrice: 125, category: '海水鱼', rarity: 'rare', lengthMin: 50, lengthMax: 120, weightMin: 2, weightMax: 25, venues: [2,3], habitat: '冷水深海', desc: '不是真鳕，油脂高。' },
                { name: '狭鳕', basePrice: 28, category: '海水鱼', rarity: 'common', lengthMin: 35, lengthMax: 75, weightMin: 0.5, weightMax: 4, venues: [0,2,3], habitat: '北太平洋', desc: '明太鱼原料。' },
                { name: '明太鱼', basePrice: 25, category: '海水鱼', rarity: 'common', lengthMin: 30, lengthMax: 65, weightMin: 0.3, weightMax: 3, venues: [0,2,3], habitat: '北太平洋', desc: '狭鳕加工品原料。' },
                { name: '无须鳕', basePrice: 42, category: '海水鱼', rarity: 'common', lengthMin: 45, lengthMax: 110, weightMin: 1, weightMax: 15, venues: [2,3], habitat: '冷水底层', desc: '欧洲常见食用鳕。' },
                { name: '大比目鱼', basePrice: 95, category: '海水鱼', rarity: 'rare', lengthMin: 80, lengthMax: 250, weightMin: 5, weightMax: 200, venues: [2,3], habitat: '冷水底层', desc: '大型鲆鲽类。' },
                { name: '鲎', basePrice: 65, category: '其他', rarity: 'uncommon', lengthMin: 35, lengthMax: 60, weightMin: 0.5, weightMax: 2, venues: [0,1], habitat: '沙滩浅海', desc: '活化石，蓝血。' },
                { name: '水母', basePrice: 18, category: '其他', rarity: 'common', lengthMin: 10, lengthMax: 50, weightMin: 0.05, weightMax: 0.5, venues: [0,1], habitat: '全海域', desc: '腔肠动物，凉拌。' },
                { name: '海葵', basePrice: 22, category: '其他', rarity: 'common', lengthMin: 5, lengthMax: 25, weightMin: 0.02, weightMax: 0.2, venues: [1], habitat: '礁石', desc: '触手有毒，观赏多。' },
                { name: '藤壶', basePrice: 35, category: '其他', rarity: 'common', lengthMin: 2, lengthMax: 8, weightMin: 0.01, weightMax: 0.05, venues: [0,1], habitat: '礁石船底', desc: '附着甲壳类。' },
                { name: '寄居蟹', basePrice: 28, category: '甲壳类', rarity: 'common', lengthMin: 3, lengthMax: 15, weightMin: 0.02, weightMax: 0.2, venues: [0,1], habitat: '潮间带', desc: '背螺壳居住。' },
                { name: '螯龙虾', basePrice: 350, category: '甲壳类', rarity: 'precious', lengthMin: 30, lengthMax: 60, weightMin: 0.5, weightMax: 4, venues: [1,2], habitat: '冷水岩礁', desc: '无大螯龙虾，北美名产。' },
                { name: '面包蟹', basePrice: 88, category: '甲壳类', rarity: 'uncommon', lengthMin: 12, lengthMax: 25, weightMin: 0.4, weightMax: 1.5, venues: [0,1,3], habitat: '冷水砂泥', desc: '蟹壳圆如面包。' },
                { name: '蜘蛛蟹', basePrice: 180, category: '甲壳类', rarity: 'rare', lengthMin: 25, lengthMax: 45, weightMin: 1, weightMax: 5, venues: [1,2], habitat: '深海礁石', desc: '长脚如蜘蛛。' },
                { name: '日本蜘蛛蟹', basePrice: 880, category: '甲壳类', rarity: 'mythic', lengthMin: 350, lengthMax: 450, weightMin: 15, weightMax: 20, venues: [2], habitat: '日本深海', desc: '脚展最大节肢动物。' },
                { name: '中华鲟', basePrice: 8888, category: '淡水鱼', rarity: 'ancient', lengthMin: 200, lengthMax: 500, weightMin: 50, weightMax: 500, venues: [0], habitat: '长江洄游', desc: '活化石，国家一级保护。' },
                { name: '黄唇鱼', basePrice: 18888, category: '海水鱼', rarity: 'unique', lengthMin: 120, lengthMax: 180, weightMin: 15, weightMax: 50, venues: [0,1], habitat: '东南近海', desc: '鳔极贵，濒危。' },
                { name: '金钱鳘', basePrice: 12888, category: '海水鱼', rarity: 'unique', lengthMin: 100, lengthMax: 160, weightMin: 10, weightMax: 40, venues: [1], habitat: '热带珊瑚礁', desc: '黄唇鱼别称，天价鱼鳔。' },
                { name: '野生大黄鱼', basePrice: 2888, category: '海水鱼', rarity: 'legendary', lengthMin: 40, lengthMax: 80, weightMin: 1, weightMax: 5, venues: [0,1], habitat: '东海近海', desc: '野生已极少，价高。' },
                { name: '长江刀鱼', basePrice: 3688, category: '洄游鱼', rarity: 'legendary', lengthMin: 25, lengthMax: 45, weightMin: 0.1, weightMax: 0.35, venues: [0], habitat: '长江洄游', desc: '清明前最贵，细刺多。' },
                { name: '鲥鱼', basePrice: 1580, category: '洄游鱼', rarity: 'mythic', lengthMin: 35, lengthMax: 60, weightMin: 0.5, weightMax: 2, venues: [0], habitat: '长江珠江洄游', desc: '初夏时令，鳞可食。' },
                { name: '松江鲈', basePrice: 680, category: '淡水鱼', rarity: 'precious', lengthMin: 12, lengthMax: 18, weightMin: 0.05, weightMax: 0.15, venues: [0], habitat: '河口淡水', desc: '四鳃鲈，江南名鱼。' },
                { name: '胭脂鱼', basePrice: 420, category: '淡水鱼', rarity: 'rare', lengthMin: 50, lengthMax: 100, weightMin: 1, weightMax: 8, venues: [0], habitat: '长江上游', desc: '一帆风顺，观赏与食用。' },
                { name: '巨骨舌鱼', basePrice: 2580, category: '淡水鱼', rarity: 'legendary', lengthMin: 200, lengthMax: 450, weightMin: 80, weightMax: 200, venues: [0], habitat: '亚马孙河', desc: '远古巨鱼，鳞硬。' },
                { name: '金龙鱼', basePrice: 1880, category: '淡水鱼', rarity: 'precious', lengthMin: 60, lengthMax: 90, weightMin: 2, weightMax: 7, venues: [0], habitat: '东南亚河流', desc: '观赏龙鱼，过背金。' },
                { name: '红龙鱼', basePrice: 2280, category: '淡水鱼', rarity: 'precious', lengthMin: 50, lengthMax: 80, weightMin: 1.5, weightMax: 5, venues: [0], habitat: '东南亚', desc: '血红龙，风水名鱼。' },
                { name: '电鳐', basePrice: 95, category: '软骨鱼', rarity: 'rare', lengthMin: 40, lengthMax: 120, weightMin: 0.5, weightMax: 15, venues: [0,1,2], habitat: '砂泥底', desc: '可放电，慎触。' },
                { name: '黄貂鱼', basePrice: 78, category: '软骨鱼', rarity: 'uncommon', lengthMin: 50, lengthMax: 150, weightMin: 0.5, weightMax: 20, venues: [0,1], habitat: '沿岸砂底', desc: '尾刺有毒。' },
                { name: '姥鲨', basePrice: 6666, category: '软骨鱼', rarity: 'mythic', lengthMin: 600, lengthMax: 1000, weightMin: 4000, weightMax: 7000, venues: [1,2], habitat: '温带大洋', desc: '第二大鱼，滤食。' },
                { name: '灰鲭鲨', basePrice: 420, category: '软骨鱼', rarity: 'rare', lengthMin: 200, lengthMax: 400, weightMin: 60, weightMax: 500, venues: [1,2], habitat: '大洋', desc: '游速极快。' },
                { name: '锤头鲨', basePrice: 380, category: '软骨鱼', rarity: 'rare', lengthMin: 250, lengthMax: 600, weightMin: 100, weightMax: 450, venues: [1,2], habitat: '热带温带', desc: '双髻鲨一种。' },
                { name: '康吉鳗', basePrice: 72, category: '海水鱼', rarity: 'uncommon', lengthMin: 80, lengthMax: 250, weightMin: 0.5, weightMax: 30, venues: [0,1,2], habitat: '礁石缝隙', desc: '长体穴居。' },
                { name: '裸胸鳝', basePrice: 68, category: '海水鱼', rarity: 'uncommon', lengthMin: 60, lengthMax: 150, weightMin: 0.3, weightMax: 15, venues: [1], habitat: '珊瑚礁', desc: '无胸鳍，穴居。' },
                { name: '蝎子鱼', basePrice: 82, category: '海水鱼', rarity: 'uncommon', lengthMin: 25, lengthMax: 45, weightMin: 0.3, weightMax: 1.5, venues: [1], habitat: '礁石', desc: '鳍棘有毒。' },
                { name: '青衣', basePrice: 125, category: '海水鱼', rarity: 'rare', lengthMin: 35, lengthMax: 70, weightMin: 0.8, weightMax: 6, venues: [1], habitat: '热带珊瑚礁', desc: '隆头鱼，体色青蓝。' },
                { name: '拿破仑鱼', basePrice: 888, category: '海水鱼', rarity: 'precious', lengthMin: 150, lengthMax: 230, weightMin: 80, weightMax: 190, venues: [1], habitat: '热带珊瑚礁', desc: '巨型隆头鱼，唇厚。' },
                { name: '龙趸', basePrice: 580, category: '海水鱼', rarity: 'precious', lengthMin: 120, lengthMax: 270, weightMin: 100, weightMax: 400, venues: [1], habitat: '珊瑚礁洞穴', desc: '巨型石斑，可长数百斤。' },
                { name: '珍珠魟', basePrice: 320, category: '软骨鱼', rarity: 'rare', lengthMin: 80, lengthMax: 150, weightMin: 5, weightMax: 25, venues: [0], habitat: '淡水河流', desc: '体盘有珠纹。' },
                { name: '虎纹魟', basePrice: 280, category: '软骨鱼', rarity: 'rare', lengthMin: 70, lengthMax: 120, weightMin: 3, weightMax: 15, venues: [0], habitat: '淡水', desc: '虎斑纹。' },
                { name: '矛尾鱼', basePrice: 99999, category: '海水鱼', rarity: 'unique', lengthMin: 150, lengthMax: 200, weightMin: 50, weightMax: 90, venues: [2,4], habitat: '深海', desc: '腔棘鱼同属，活化石。' },
                { name: '巨型乌贼', basePrice: 1888, category: '头足类', rarity: 'legendary', lengthMin: 500, lengthMax: 1300, weightMin: 50, weightMax: 275, venues: [2], habitat: '深海', desc: '与大王乌贼近缘。' },
                { name: '破救生衣', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 40, lengthMax: 60, weightMin: 0.5, weightMax: 1.5, venues: [0,1,2,4], habitat: '海面', desc: '破损的救生衣。' },
                { name: '废电池', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 3, lengthMax: 15, weightMin: 0.02, weightMax: 0.3, venues: [0,1,2,3,4], habitat: '全海域', desc: '废弃电池，污染大。' },
                { name: '一次性餐具', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 15, lengthMax: 25, weightMin: 0.01, weightMax: 0.05, venues: [0,1,2,3,4], habitat: '全海域', desc: '塑料勺筷盒。' },
                { name: '泡沫浮球', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 15, lengthMax: 30, weightMin: 0.05, weightMax: 0.2, venues: [0,1], habitat: '近海', desc: '渔网浮标。' },
                { name: '绳索', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 100, lengthMax: 300, weightMin: 0.2, weightMax: 2, venues: [0,1,2,4], habitat: '全海域', desc: '断裂的缆绳或网绳。' },
                { name: '破布条', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 30, lengthMax: 100, weightMin: 0.05, weightMax: 0.3, venues: [0,1,2,3,4], habitat: '全海域', desc: '破烂布片。' },
                { name: '玻璃渣', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 2, lengthMax: 15, weightMin: 0.01, weightMax: 0.1, venues: [0,1,4], habitat: '沿岸', desc: '碎玻璃。' },
                { name: '破拖鞋', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 22, lengthMax: 30, weightMin: 0.1, weightMax: 0.3, venues: [0,1,2,3,4], habitat: '全海域', desc: '单只拖鞋。' }
            ];
            var extraFish = [
                { name: '刺鲀', basePrice: 35, category: '海水鱼', rarity: 'common', lengthMin: 15, lengthMax: 45, weightMin: 0.2, weightMax: 1.2, venues: [0,1], habitat: '珊瑚礁', desc: '遇敌充气竖刺。' },
                { name: '箱鲀', basePrice: 48, category: '海水鱼', rarity: 'uncommon', lengthMin: 20, lengthMax: 45, weightMin: 0.3, weightMax: 1.5, venues: [1], habitat: '热带珊瑚礁', desc: '体如方箱，游泳笨拙。' },
                { name: '狮子鱼', basePrice: 62, category: '海水鱼', rarity: 'uncommon', lengthMin: 28, lengthMax: 48, weightMin: 0.25, weightMax: 1, venues: [1], habitat: '珊瑚礁', desc: '鳍棘有毒，观赏。' },
                { name: '小丑鱼', basePrice: 55, category: '海水鱼', rarity: 'uncommon', lengthMin: 8, lengthMax: 18, weightMin: 0.02, weightMax: 0.08, venues: [1], habitat: '海葵中', desc: '与海葵共生。' },
                { name: '神仙鱼', basePrice: 72, category: '海水鱼', rarity: 'uncommon', lengthMin: 25, lengthMax: 45, weightMin: 0.3, weightMax: 1.2, venues: [1], habitat: '珊瑚礁', desc: '体高侧扁，条纹艳丽。' },
                { name: '蝴蝶鱼', basePrice: 68, category: '海水鱼', rarity: 'uncommon', lengthMin: 15, lengthMax: 30, weightMin: 0.1, weightMax: 0.5, venues: [1], habitat: '热带珊瑚礁', desc: '吻尖，体色斑斓。' },
                { name: '隆头鱼', basePrice: 45, category: '海水鱼', rarity: 'common', lengthMin: 20, lengthMax: 55, weightMin: 0.2, weightMax: 2, venues: [0,1], habitat: '礁石区', desc: '唇厚，多色彩。' },
                { name: '雀鲷', basePrice: 32, category: '海水鱼', rarity: 'common', lengthMin: 8, lengthMax: 22, weightMin: 0.02, weightMax: 0.15, venues: [1], habitat: '珊瑚礁', desc: '小型群游。' },
                { name: '石鲷', basePrice: 95, category: '海水鱼', rarity: 'rare', lengthMin: 40, lengthMax: 80, weightMin: 1, weightMax: 6, venues: [1], habitat: '岩礁', desc: '牙可咬碎贝类。' },
                { name: '剥皮鱼', basePrice: 28, category: '海水鱼', rarity: 'common', lengthMin: 20, lengthMax: 45, weightMin: 0.2, weightMax: 1, venues: [0,1], habitat: '近海', desc: '皮粗需剥后食。' },
                { name: '金枪鱼幼体', basePrice: 35, category: '海水鱼', rarity: 'common', lengthMin: 30, lengthMax: 70, weightMin: 0.5, weightMax: 5, venues: [0,1,2], habitat: '大洋', desc: '未成年的金枪鱼。' },
                { name: '鬼鲉', basePrice: 58, category: '海水鱼', rarity: 'uncommon', lengthMin: 25, lengthMax: 45, weightMin: 0.3, weightMax: 1.5, venues: [0,1], habitat: '礁石拟态', desc: '背鳍毒刺。' },
                { name: '褐菖鲉', basePrice: 42, category: '海水鱼', rarity: 'common', lengthMin: 22, lengthMax: 45, weightMin: 0.3, weightMax: 1.2, venues: [0,1], habitat: '岩礁', desc: '红褐色，鳍棘有毒。' },
                { name: '鲬', basePrice: 38, category: '海水鱼', rarity: 'common', lengthMin: 30, lengthMax: 55, weightMin: 0.4, weightMax: 1.5, venues: [0,1], habitat: '砂泥底', desc: '头扁平。' },
                { name: '绿鳍马面鲀', basePrice: 24, category: '海水鱼', rarity: 'common', lengthMin: 22, lengthMax: 42, weightMin: 0.2, weightMax: 0.8, venues: [0,1], habitat: '近海', desc: '绿鳍，剥皮食用。' },
                { name: '黄鲷', basePrice: 52, category: '海水鱼', rarity: 'uncommon', lengthMin: 28, lengthMax: 55, weightMin: 0.4, weightMax: 2.5, venues: [0,1], habitat: '岩礁', desc: '体色金黄。' },
                { name: '蓝子鱼', basePrice: 35, category: '海水鱼', rarity: 'common', lengthMin: 25, lengthMax: 50, weightMin: 0.3, weightMax: 1.2, venues: [0,1], habitat: '礁石海藻', desc: '背鳍臀鳍有刺。' },
                { name: '军曹鱼', basePrice: 65, category: '海水鱼', rarity: 'uncommon', lengthMin: 80, lengthMax: 180, weightMin: 5, weightMax: 70, venues: [0,1,2], habitat: '热带亚热带', desc: '幼体有斑纹。' },
                { name: '海鲡', basePrice: 78, category: '海水鱼', rarity: 'uncommon', lengthMin: 100, lengthMax: 200, weightMin: 8, weightMax: 80, venues: [0,1,2], habitat: '沿岸至外海', desc: '大型鲹科。' },
                { name: '牛港鲹', basePrice: 95, category: '海水鱼', rarity: 'rare', lengthMin: 120, lengthMax: 180, weightMin: 20, weightMax: 80, venues: [0,1], habitat: '礁区外缘', desc: '力大，钓友目标。' },
                { name: '红甘', basePrice: 85, category: '海水鱼', rarity: 'uncommon', lengthMin: 55, lengthMax: 120, weightMin: 2, weightMax: 25, venues: [0,1], habitat: '温带近海', desc: '鰤鱼一种。' },
                { name: '白带鱼', basePrice: 22, category: '海水鱼', rarity: 'common', lengthMin: 50, lengthMax: 130, weightMin: 0.3, weightMax: 1.5, venues: [0,1], habitat: '近海中下层', desc: '银白带形。' },
                { name: '乌鲂', basePrice: 48, category: '海水鱼', rarity: 'uncommon', lengthMin: 35, lengthMax: 75, weightMin: 0.5, weightMax: 4, venues: [0,1], habitat: '近海', desc: '体高侧扁。' },
                { name: '鲯鳅', basePrice: 55, category: '海水鱼', rarity: 'uncommon', lengthMin: 90, lengthMax: 200, weightMin: 4, weightMax: 35, venues: [0,1,2], habitat: '热带温带海面', desc: '鬼头刀，色艳。' },
                { name: '白鲳', basePrice: 42, category: '海水鱼', rarity: 'common', lengthMin: 25, lengthMax: 55, weightMin: 0.4, weightMax: 2, venues: [0,1], habitat: '近海', desc: '银白鲳。' },
                { name: '黑鲳', basePrice: 38, category: '海水鱼', rarity: 'common', lengthMin: 22, lengthMax: 48, weightMin: 0.3, weightMax: 1.5, venues: [0,1], habitat: '近海', desc: '体色深。' },
                { name: '刺鲷', basePrice: 65, category: '海水鱼', rarity: 'uncommon', lengthMin: 35, lengthMax: 65, weightMin: 0.6, weightMax: 3, venues: [0,1], habitat: '岩礁', desc: '背鳍棘长。' },
                { name: '金目鲷', basePrice: 128, category: '海水鱼', rarity: 'rare', lengthMin: 35, lengthMax: 65, weightMin: 0.8, weightMax: 4, venues: [1,2], habitat: '深海礁', desc: '眼大红色，高档。' },
                { name: '红鲉', basePrice: 48, category: '海水鱼', rarity: 'common', lengthMin: 25, lengthMax: 50, weightMin: 0.3, weightMax: 1.5, venues: [0,1], habitat: '岩礁', desc: '体红。' },
                { name: '角鱼', basePrice: 35, category: '海水鱼', rarity: 'common', lengthMin: 22, lengthMax: 45, weightMin: 0.2, weightMax: 1, venues: [0,1], habitat: '砂泥底', desc: '头有角状突起。' },
                { name: '鲻', basePrice: 28, category: '海水鱼', rarity: 'common', lengthMin: 30, lengthMax: 60, weightMin: 0.4, weightMax: 2, venues: [0,1], habitat: '河口沿岸', desc: '咸淡水均可。' },
                { name: '鲑', basePrice: 75, category: '洄游鱼', rarity: 'uncommon', lengthMin: 45, lengthMax: 100, weightMin: 1.5, weightMax: 12, venues: [0,3], habitat: '冷水洄游', desc: '大西洋鲑。' },
                { name: '北极鲑', basePrice: 98, category: '海水鱼', rarity: 'rare', lengthMin: 40, lengthMax: 80, weightMin: 0.8, weightMax: 5, venues: [3], habitat: '北极海域', desc: '极地冷水鱼。' },
                { name: '毛鳞鱼', basePrice: 25, category: '海水鱼', rarity: 'common', lengthMin: 15, lengthMax: 25, weightMin: 0.03, weightMax: 0.12, venues: [0,3], habitat: '北太平洋', desc: '小型，多春鱼近亲。' },
                { name: '格陵兰鳕', basePrice: 68, category: '海水鱼', rarity: 'uncommon', lengthMin: 50, lengthMax: 120, weightMin: 1.5, weightMax: 20, venues: [3], habitat: '北冰洋', desc: '极地鳕。' },
                { name: '北极鳕', basePrice: 55, category: '海水鱼', rarity: 'common', lengthMin: 35, lengthMax: 80, weightMin: 0.5, weightMax: 5, venues: [3], habitat: '北极冷水', desc: '小型冷水鳕。' },
                { name: '深海龙鱼', basePrice: 158, category: '深海鱼', rarity: 'rare', lengthMin: 15, lengthMax: 40, weightMin: 0.05, weightMax: 0.5, venues: [2], habitat: '深海', desc: '下颌发光拟饵。' },
                { name: '斧头鱼', basePrice: 42, category: '深海鱼', rarity: 'uncommon', lengthMin: 5, lengthMax: 15, weightMin: 0.01, weightMax: 0.08, venues: [2], habitat: '深海', desc: '体侧扁如斧。' },
                { name: '管眼鱼', basePrice: 88, category: '深海鱼', rarity: 'rare', lengthMin: 12, lengthMax: 35, weightMin: 0.02, weightMax: 0.2, venues: [2], habitat: '深海', desc: '头部透明。' },
                { name: '毒蛇鱼', basePrice: 95, category: '深海鱼', rarity: 'rare', lengthMin: 35, lengthMax: 60, weightMin: 0.2, weightMax: 1, venues: [2], habitat: '深海', desc: '长牙，发光器。' },
                { name: '沉船金币', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 2, lengthMax: 4, weightMin: 0.02, weightMax: 0.05, venues: [4], habitat: '沉船内', desc: '锈蚀的旧币。' },
                { name: '陶罐', basePrice: 0, category: '海洋垃圾', rarity: 'trash', lengthMin: 15, lengthMax: 35, weightMin: 0.3, weightMax: 1.5, venues: [4], habitat: '沉船', desc: '古代陶器残片。' }
            ];
            var riverJiangFish = [
                { name: '溪石斑', basePrice: 32, category: '淡水鱼', rarity: 'common', lengthMin: 8, lengthMax: 18, weightMin: 0.02, weightMax: 0.12, venues: [5], habitat: '山溪石缝', desc: '小型溪流鱼，斑纹似石斑。' },
                { name: '宽鳍鱲', basePrice: 28, category: '淡水鱼', rarity: 'common', lengthMin: 10, lengthMax: 22, weightMin: 0.03, weightMax: 0.15, venues: [5], habitat: '清澈溪流', desc: '体侧彩虹纹，喜急流。' },
                { name: '马口鱼', basePrice: 35, category: '淡水鱼', rarity: 'common', lengthMin: 12, lengthMax: 25, weightMin: 0.05, weightMax: 0.25, venues: [5], habitat: '山溪、河川', desc: '口大，善跃水面。' },
                { name: '棒花鱼', basePrice: 18, category: '淡水鱼', rarity: 'common', lengthMin: 6, lengthMax: 14, weightMin: 0.01, weightMax: 0.06, venues: [5], habitat: '河底砂石', desc: '吻部突出，底栖。' },
                { name: '麦穗鱼', basePrice: 12, category: '淡水鱼', rarity: 'common', lengthMin: 5, lengthMax: 12, weightMin: 0.005, weightMax: 0.04, venues: [5], habitat: '河流浅水', desc: '小型，群游，常作饵料。' },
                { name: '华鳈', basePrice: 22, category: '淡水鱼', rarity: 'common', lengthMin: 8, lengthMax: 18, weightMin: 0.02, weightMax: 0.1, venues: [5], habitat: '河溪缓流', desc: '体侧有横纹。' },
                { name: '高体鳑鲏', basePrice: 25, category: '淡水鱼', rarity: 'common', lengthMin: 5, lengthMax: 12, weightMin: 0.01, weightMax: 0.05, venues: [5], habitat: '河湖静水', desc: '体高侧扁，繁殖需河蚌。' },
                { name: '中华鳑鲏', basePrice: 20, category: '淡水鱼', rarity: 'common', lengthMin: 4, lengthMax: 10, weightMin: 0.008, weightMax: 0.04, venues: [5], habitat: '河流、池塘', desc: '小型鳑鲏，色彩淡雅。' },
                { name: '河川沙塘鳢', basePrice: 38, category: '淡水鱼', rarity: 'uncommon', lengthMin: 6, lengthMax: 14, weightMin: 0.02, weightMax: 0.08, venues: [5], habitat: '溪流石底', desc: '头大身短，伏击捕食。' },
                { name: '小黄黝鱼', basePrice: 15, category: '淡水鱼', rarity: 'common', lengthMin: 4, lengthMax: 10, weightMin: 0.005, weightMax: 0.03, venues: [5], habitat: '河溪浅水', desc: '体黄褐色，善藏石缝。' },
                { name: '褐吻虾虎', basePrice: 22, category: '淡水鱼', rarity: 'common', lengthMin: 5, lengthMax: 12, weightMin: 0.01, weightMax: 0.05, venues: [5], habitat: '河底石隙', desc: '腹鳍吸盘，贴底爬行。' },
                { name: '子陵吻虾虎', basePrice: 18, category: '淡水鱼', rarity: 'common', lengthMin: 4, lengthMax: 11, weightMin: 0.008, weightMax: 0.04, venues: [5], habitat: '河流、河口', desc: '常见虾虎，分布广。' },
                { name: '河鲶', basePrice: 28, category: '淡水鱼', rarity: 'common', lengthMin: 25, lengthMax: 55, weightMin: 0.2, weightMax: 1.5, venues: [5], habitat: '河流缓流', desc: '须多无鳞，夜行。' },
                { name: '黄颡鱼', basePrice: 42, category: '淡水鱼', rarity: 'uncommon', lengthMin: 12, lengthMax: 28, weightMin: 0.05, weightMax: 0.35, venues: [5], habitat: '河湖底层', desc: '胸鳍刺有毒，黄颡炖豆腐。' },
                { name: '瓦氏黄颡', basePrice: 48, category: '淡水鱼', rarity: 'uncommon', lengthMin: 15, lengthMax: 35, weightMin: 0.08, weightMax: 0.5, venues: [5,6], habitat: '江河底层', desc: '体型较大黄颡。' },
                { name: '大鳍鳠', basePrice: 55, category: '淡水鱼', rarity: 'uncommon', lengthMin: 20, lengthMax: 45, weightMin: 0.2, weightMax: 1.2, venues: [5,6], habitat: '江河深潭', desc: '鳍大，肉嫩。' },
                { name: '长吻鮠', basePrice: 88, category: '淡水鱼', rarity: 'rare', lengthMin: 25, lengthMax: 60, weightMin: 0.3, weightMax: 2.5, venues: [6], habitat: '大江深水', desc: '吻长，江团、肥沱，名贵。' },
                { name: '岩原鲤', basePrice: 72, category: '淡水鱼', rarity: 'uncommon', lengthMin: 25, lengthMax: 55, weightMin: 0.4, weightMax: 2.5, venues: [6], habitat: '长江上游礁石', desc: '体青黑，岩鲤。' },
                { name: '三角鲂', basePrice: 45, category: '淡水鱼', rarity: 'common', lengthMin: 25, lengthMax: 50, weightMin: 0.3, weightMax: 1.8, venues: [5,6], habitat: '江河中下层', desc: '体菱形，三角鲂。' },
                { name: '团头鲂', basePrice: 42, category: '淡水鱼', rarity: 'common', lengthMin: 22, lengthMax: 45, weightMin: 0.25, weightMax: 1.5, venues: [5,6], habitat: '湖泊、缓流', desc: '武昌鱼，团头鲂。' },
                { name: '银鲴', basePrice: 32, category: '淡水鱼', rarity: 'common', lengthMin: 18, lengthMax: 40, weightMin: 0.15, weightMax: 0.8, venues: [5,6], habitat: '江河中下层', desc: '口下位，刮食藻类。' },
                { name: '赤眼鳟', basePrice: 38, category: '淡水鱼', rarity: 'common', lengthMin: 22, lengthMax: 48, weightMin: 0.2, weightMax: 1.2, venues: [5,6], habitat: '江河中上层', desc: '眼上缘红，赤眼鳟。' },
                { name: '青梢红鲌', basePrice: 48, category: '淡水鱼', rarity: 'uncommon', lengthMin: 25, lengthMax: 55, weightMin: 0.3, weightMax: 2, venues: [5,6], habitat: '河湖中上层', desc: '翘嘴近亲，青梢。' },
                { name: '蒙古红鲌', basePrice: 52, category: '淡水鱼', rarity: 'uncommon', lengthMin: 28, lengthMax: 58, weightMin: 0.35, weightMax: 2.2, venues: [6], habitat: '大江大湖', desc: '红尾，肉食性。' },
                { name: '翘嘴鲌', basePrice: 65, category: '淡水鱼', rarity: 'uncommon', lengthMin: 35, lengthMax: 85, weightMin: 0.5, weightMax: 5, venues: [6], habitat: '江河开阔水面', desc: '翘嘴，善跃，路亚目标。' },
                { name: '蛇鮈', basePrice: 25, category: '淡水鱼', rarity: 'common', lengthMin: 12, lengthMax: 28, weightMin: 0.05, weightMax: 0.25, venues: [5], habitat: '河底泥沙', desc: '体细长如蛇。' },
                { name: '铜鱼', basePrice: 42, category: '淡水鱼', rarity: 'uncommon', lengthMin: 20, lengthMax: 45, weightMin: 0.2, weightMax: 1.2, venues: [6], habitat: '长江中上游', desc: '体铜色，底栖。' },
                { name: '圆口铜鱼', basePrice: 58, category: '淡水鱼', rarity: 'uncommon', lengthMin: 25, lengthMax: 55, weightMin: 0.3, weightMax: 2, venues: [6], habitat: '长江上游', desc: '口圆，金沙江名鱼。' },
                { name: '中华沙鳅', basePrice: 35, category: '淡水鱼', rarity: 'common', lengthMin: 10, lengthMax: 22, weightMin: 0.03, weightMax: 0.15, venues: [5], habitat: '山溪石底', desc: '体有斑纹，沙鳅。' },
                { name: '薄鳅', basePrice: 48, category: '淡水鱼', rarity: 'uncommon', lengthMin: 15, lengthMax: 35, weightMin: 0.08, weightMax: 0.4, venues: [5,6], habitat: '江河急流', desc: '体侧扁，善钻石缝。' },
                { name: '花鳅', basePrice: 22, category: '淡水鱼', rarity: 'common', lengthMin: 8, lengthMax: 18, weightMin: 0.02, weightMax: 0.1, venues: [5], habitat: '河溪泥底', desc: '体有花斑。' },
                { name: '河蚌', basePrice: 15, category: '贝类', rarity: 'common', lengthMin: 6, lengthMax: 18, weightMin: 0.02, weightMax: 0.2, venues: [5,6], habitat: '河底泥沙', desc: '淡水蚌，可育珠。' },
                { name: '田螺', basePrice: 12, category: '贝类', rarity: 'common', lengthMin: 3, lengthMax: 8, weightMin: 0.01, weightMax: 0.05, venues: [5], habitat: '稻田、河沟', desc: '炒田螺，夜宵常见。' },
                { name: '石螺', basePrice: 18, category: '贝类', rarity: 'common', lengthMin: 2, lengthMax: 6, weightMin: 0.005, weightMax: 0.03, venues: [5], habitat: '溪流石头', desc: '小型螺，山溪常见。' },
                { name: '河蚬', basePrice: 10, category: '贝类', rarity: 'common', lengthMin: 2, lengthMax: 5, weightMin: 0.005, weightMax: 0.02, venues: [5,6], habitat: '河湖底', desc: '小蚬，煮汤鲜。' },
                { name: '河蟹', basePrice: 55, category: '甲壳类', rarity: 'uncommon', lengthMin: 5, lengthMax: 12, weightMin: 0.05, weightMax: 0.25, venues: [5,6], habitat: '河岸洞穴', desc: '大闸蟹同科，河蟹。' },
                { name: '溪蟹', basePrice: 28, category: '甲壳类', rarity: 'common', lengthMin: 3, lengthMax: 8, weightMin: 0.02, weightMax: 0.08, venues: [5], habitat: '山溪石下', desc: '小型淡水蟹。' },
                { name: '河虾', basePrice: 35, category: '甲壳类', rarity: 'common', lengthMin: 4, lengthMax: 12, weightMin: 0.01, weightMax: 0.06, venues: [5,6], habitat: '河湖草区', desc: '青虾、草虾，鲜甜。' },
                { name: '白条', basePrice: 20, category: '淡水鱼', rarity: 'common', lengthMin: 10, lengthMax: 25, weightMin: 0.03, weightMax: 0.2, venues: [5,6], habitat: '河湖表层', desc: '餐条，群游，易钓。' },
                { name: '溪哥', basePrice: 32, category: '淡水鱼', rarity: 'common', lengthMin: 12, lengthMax: 28, weightMin: 0.05, weightMax: 0.3, venues: [5], habitat: '山溪', desc: '宽鳍鱲俗称之一。' },
                { name: '鳡鱼', basePrice: 95, category: '淡水鱼', rarity: 'rare', lengthMin: 60, lengthMax: 180, weightMin: 2, weightMax: 35, venues: [6], habitat: '大江中上层', desc: '水老虎，凶猛肉食。' },
                { name: '鳤', basePrice: 78, category: '淡水鱼', rarity: 'uncommon', lengthMin: 35, lengthMax: 80, weightMin: 0.5, weightMax: 5, venues: [6], habitat: '长江中游', desc: '刁子，细长善游。' },
                { name: '胭脂鱼', basePrice: 125, category: '淡水鱼', rarity: 'rare', lengthMin: 35, lengthMax: 80, weightMin: 0.5, weightMax: 4, venues: [6], habitat: '长江上游', desc: '一帆风顺，幼体艳丽。' },
                { name: '鲮鱼', basePrice: 38, category: '淡水鱼', rarity: 'common', lengthMin: 22, lengthMax: 50, weightMin: 0.2, weightMax: 1.2, venues: [5,6], habitat: '南方江河', desc: '土鲮，耐热。' },
                { name: '卷口鱼', basePrice: 65, category: '淡水鱼', rarity: 'uncommon', lengthMin: 25, lengthMax: 55, weightMin: 0.3, weightMax: 2, venues: [6], habitat: '西江、珠江水系', desc: '唇厚，卷口。' },
                { name: '唇鱼', basePrice: 88, category: '淡水鱼', rarity: 'rare', lengthMin: 30, lengthMax: 70, weightMin: 0.5, weightMax: 4, venues: [6], habitat: '珠江上游', desc: '大唇鱼，珍稀。' },
                { name: '刀鲚', basePrice: 180, category: '洄游鱼', rarity: 'rare', lengthMin: 18, lengthMax: 40, weightMin: 0.05, weightMax: 0.25, venues: [6], habitat: '长江洄游', desc: '刀鱼，清明前最贵。' },
                { name: '凤鲚', basePrice: 45, category: '洄游鱼', rarity: 'common', lengthMin: 12, lengthMax: 28, weightMin: 0.02, weightMax: 0.12, venues: [5,6], habitat: '河口洄游', desc: '凤尾鱼，籽多。' },
                { name: '暗纹东方鲀', basePrice: 68, category: '淡水鱼', rarity: 'uncommon', lengthMin: 15, lengthMax: 35, weightMin: 0.1, weightMax: 0.6, venues: [5,6], habitat: '江河下游', desc: '河豚一种，需去毒。' },
                { name: '弓斑东方鲀', basePrice: 72, category: '淡水鱼', rarity: 'uncommon', lengthMin: 15, lengthMax: 38, weightMin: 0.12, weightMax: 0.7, venues: [6], habitat: '长江下游', desc: '背有弓形斑。' },
                { name: '大眼鳜', basePrice: 92, category: '淡水鱼', rarity: 'rare', lengthMin: 25, lengthMax: 55, weightMin: 0.4, weightMax: 3, venues: [5,6], habitat: '河湖礁石', desc: '眼大，鳜鱼一种。' },
                { name: '斑鳜', basePrice: 98, category: '淡水鱼', rarity: 'rare', lengthMin: 22, lengthMax: 50, weightMin: 0.3, weightMax: 2.5, venues: [6], habitat: '江河石缝', desc: '体有黑斑。' },
                { name: '大口鲶', basePrice: 75, category: '淡水鱼', rarity: 'uncommon', lengthMin: 40, lengthMax: 120, weightMin: 0.8, weightMax: 15, venues: [6], habitat: '大江深水', desc: '口大，可长数十斤。' },
                { name: '怀头鲶', basePrice: 88, category: '淡水鱼', rarity: 'uncommon', lengthMin: 50, lengthMax: 150, weightMin: 1, weightMax: 25, venues: [6], habitat: '东北江河', desc: '六须鲶，大型鲶。' },
                { name: '鳇', basePrice: 688, category: '淡水鱼', rarity: 'legendary', lengthMin: 150, lengthMax: 400, weightMin: 50, weightMax: 500, venues: [6], habitat: '黑龙江', desc: '鲟科巨物，鳇鱼。' },
                { name: '达氏鳇', basePrice: 588, category: '淡水鱼', rarity: 'legendary', lengthMin: 120, lengthMax: 350, weightMin: 30, weightMax: 300, venues: [6], habitat: '黑龙江', desc: '与鳇同域。' },
                { name: '施氏鲟', basePrice: 388, category: '淡水鱼', rarity: 'precious', lengthMin: 80, lengthMax: 200, weightMin: 5, weightMax: 80, venues: [6], habitat: '黑龙江', desc: '东北鲟，养殖多。' },
                { name: '银鲳', basePrice: 35, category: '淡水鱼', rarity: 'common', lengthMin: 18, lengthMax: 40, weightMin: 0.15, weightMax: 0.8, venues: [5,6], habitat: '河湖中下层', desc: '淡水鲴类，银鲳。' },
                { name: '细鳞鲴', basePrice: 42, category: '淡水鱼', rarity: 'uncommon', lengthMin: 20, lengthMax: 45, weightMin: 0.2, weightMax: 1.2, venues: [6], habitat: '江河', desc: '鳞细，刮食。' },
                { name: '圆吻鲴', basePrice: 38, category: '淡水鱼', rarity: 'common', lengthMin: 18, lengthMax: 42, weightMin: 0.15, weightMax: 0.9, venues: [5,6], habitat: '江河', desc: '吻圆，鲴鱼。' },
                { name: '似刺鳊鮈', basePrice: 28, category: '淡水鱼', rarity: 'common', lengthMin: 12, lengthMax: 28, weightMin: 0.05, weightMax: 0.25, venues: [5], habitat: '河底', desc: '似刺鳊。' },
                { name: '长蛇鮈', basePrice: 25, category: '淡水鱼', rarity: 'common', lengthMin: 14, lengthMax: 32, weightMin: 0.06, weightMax: 0.3, venues: [5,6], habitat: '江河底', desc: '体细长。' },
                { name: '嘉陵江鳅', basePrice: 32, category: '淡水鱼', rarity: 'uncommon', lengthMin: 10, lengthMax: 24, weightMin: 0.03, weightMax: 0.18, venues: [5], habitat: '嘉陵江支流', desc: '地方特有种。' },
                { name: '红尾副鳅', basePrice: 35, category: '淡水鱼', rarity: 'uncommon', lengthMin: 8, lengthMax: 20, weightMin: 0.02, weightMax: 0.12, venues: [5], habitat: '山溪', desc: '尾鳍红。' },
                { name: '平鳍鳅', basePrice: 28, category: '淡水鱼', rarity: 'common', lengthMin: 8, lengthMax: 22, weightMin: 0.02, weightMax: 0.15, venues: [5], habitat: '急流石底', desc: '腹平，吸盘状。' },
                { name: '达氏鲌', basePrice: 55, category: '淡水鱼', rarity: 'uncommon', lengthMin: 28, lengthMax: 60, weightMin: 0.35, weightMax: 2.5, venues: [6], habitat: '长江中下游', desc: '青梢红鲌一种。' },
                { name: '花鲴', basePrice: 38, category: '淡水鱼', rarity: 'common', lengthMin: 18, lengthMax: 42, weightMin: 0.15, weightMax: 0.9, venues: [5,6], habitat: '江河', desc: '体侧有斑。' },
                { name: '河鳗', basePrice: 95, category: '淡水鱼', rarity: 'rare', lengthMin: 45, lengthMax: 120, weightMin: 0.3, weightMax: 3, venues: [5,6], habitat: '江河、洄游', desc: '日本鳗鲡，蒲烧。' },
                { name: '中华花鳅', basePrice: 22, category: '淡水鱼', rarity: 'common', lengthMin: 8, lengthMax: 18, weightMin: 0.02, weightMax: 0.09, venues: [5], habitat: '河溪', desc: '花鳅一种，体有斑纹。' },
                { name: '大鳞副泥鳅', basePrice: 30, category: '淡水鱼', rarity: 'common', lengthMin: 12, lengthMax: 28, weightMin: 0.05, weightMax: 0.2, venues: [5,6], habitat: '河湖泥底', desc: '鳞大，泥鳅一种。' },
                { name: '北方泥鳅', basePrice: 22, category: '淡水鱼', rarity: 'common', lengthMin: 10, lengthMax: 22, weightMin: 0.03, weightMax: 0.15, venues: [5], habitat: '北方河流', desc: '耐寒泥鳅。' },
                { name: '短身鳅', basePrice: 18, category: '淡水鱼', rarity: 'common', lengthMin: 6, lengthMax: 14, weightMin: 0.01, weightMax: 0.06, venues: [5], habitat: '山溪', desc: '体短圆。' },
                { name: '山鳅', basePrice: 25, category: '淡水鱼', rarity: 'common', lengthMin: 8, lengthMax: 20, weightMin: 0.02, weightMax: 0.12, venues: [5], habitat: '山区溪流', desc: '山溪鳅类。' },
                { name: '吻鮈', basePrice: 28, category: '淡水鱼', rarity: 'common', lengthMin: 14, lengthMax: 32, weightMin: 0.06, weightMax: 0.35, venues: [5,6], habitat: '河底', desc: '吻突出。' },
                { name: '河豚', basePrice: 65, category: '淡水鱼', rarity: 'uncommon', lengthMin: 14, lengthMax: 32, weightMin: 0.08, weightMax: 0.5, venues: [5,6], habitat: '江河下游', desc: '淡水河豚，需专业处理。' },
                { name: '江黄颡', basePrice: 52, category: '淡水鱼', rarity: 'uncommon', lengthMin: 18, lengthMax: 38, weightMin: 0.1, weightMax: 0.6, venues: [6], habitat: '大江', desc: '江中黄颡。' },
                { name: '光泽黄颡', basePrice: 45, category: '淡水鱼', rarity: 'uncommon', lengthMin: 14, lengthMax: 30, weightMin: 0.06, weightMax: 0.4, venues: [5,6], habitat: '江河', desc: '体有光泽。' },
                { name: '江团', basePrice: 128, category: '淡水鱼', rarity: 'rare', lengthMin: 30, lengthMax: 70, weightMin: 0.5, weightMax: 4, venues: [6], habitat: '长江深潭', desc: '长吻鮠俗称，肥沱。' },
                { name: '白鲟', basePrice: 8888, category: '淡水鱼', rarity: 'unique', lengthMin: 200, lengthMax: 700, weightMin: 50, weightMax: 500, venues: [6], habitat: '长江', desc: '中国淡水鱼王，已宣布灭绝。' },
                { name: '中华鲟', basePrice: 3688, category: '淡水鱼', rarity: 'legendary', lengthMin: 150, lengthMax: 400, weightMin: 25, weightMax: 300, venues: [6], habitat: '长江洄游', desc: '活化石，国家一级保护。' },
                { name: '塑料瓶', basePrice: 0, category: '河流垃圾', rarity: 'trash', lengthMin: 20, lengthMax: 28, weightMin: 0.02, weightMax: 0.05, venues: [5,6], habitat: '河面漂浮', desc: '被丢弃的塑料瓶。' },
                { name: '易拉罐', basePrice: 0, category: '河流垃圾', rarity: 'trash', lengthMin: 10, lengthMax: 15, weightMin: 0.01, weightMax: 0.03, venues: [5,6], habitat: '河底', desc: '铝制饮料罐。' },
                { name: '破拖鞋', basePrice: 0, category: '河流垃圾', rarity: 'trash', lengthMin: 22, lengthMax: 30, weightMin: 0.1, weightMax: 0.3, venues: [5,6], habitat: '河边', desc: '单只拖鞋。' },
                { name: '烂木板', basePrice: 0, category: '河流垃圾', rarity: 'trash', lengthMin: 40, lengthMax: 120, weightMin: 1, weightMax: 8, venues: [5,6], habitat: '河面', desc: '腐朽木板。' },
                { name: '破渔网', basePrice: 0, category: '河流垃圾', rarity: 'trash', lengthMin: 80, lengthMax: 300, weightMin: 0.3, weightMax: 2, venues: [5,6], habitat: '河中', desc: '废弃渔网。' },
                { name: '青梢鲌', basePrice: 48, category: '淡水鱼', rarity: 'uncommon', lengthMin: 24, lengthMax: 52, weightMin: 0.28, weightMax: 1.8, venues: [5,6], habitat: '河湖', desc: '青梢红鲌别称。' },
                { name: '蒙古鲌', basePrice: 50, category: '淡水鱼', rarity: 'uncommon', lengthMin: 26, lengthMax: 56, weightMin: 0.3, weightMax: 2, venues: [6], habitat: '大江大湖', desc: '蒙古红鲌别称。' },
                { name: '鳊鱼', basePrice: 36, category: '淡水鱼', rarity: 'common', lengthMin: 22, lengthMax: 48, weightMin: 0.25, weightMax: 1.5, venues: [5,6], habitat: '江河湖泊', desc: '体侧扁，鳊。' },
                { name: '鲂鱼', basePrice: 40, category: '淡水鱼', rarity: 'common', lengthMin: 24, lengthMax: 50, weightMin: 0.3, weightMax: 1.8, venues: [5,6], habitat: '江河', desc: '三角鲂、团头鲂统称。' },
                { name: '鲴鱼', basePrice: 35, category: '淡水鱼', rarity: 'common', lengthMin: 18, lengthMax: 42, weightMin: 0.15, weightMax: 0.85, venues: [5,6], habitat: '江河', desc: '银鲴、细鳞鲴等统称。' },
                { name: '溪流鲤', basePrice: 42, category: '淡水鱼', rarity: 'common', lengthMin: 22, lengthMax: 55, weightMin: 0.3, weightMax: 2.5, venues: [5], habitat: '山溪、小河', desc: '溪流中的鲤鱼。' },
                { name: '江鲤', basePrice: 48, category: '淡水鱼', rarity: 'common', lengthMin: 30, lengthMax: 75, weightMin: 0.5, weightMax: 6, venues: [6], habitat: '大江', desc: '江河大鲤。' },
                { name: '河鲫', basePrice: 28, category: '淡水鱼', rarity: 'common', lengthMin: 14, lengthMax: 38, weightMin: 0.1, weightMax: 0.8, venues: [5,6], habitat: '河湖', desc: '河里的鲫鱼。' },
                { name: '江草鱼', basePrice: 38, category: '淡水鱼', rarity: 'common', lengthMin: 35, lengthMax: 90, weightMin: 0.6, weightMax: 10, venues: [6], habitat: '大江', desc: '江中草鱼。' },
                { name: '河鲢', basePrice: 25, category: '淡水鱼', rarity: 'common', lengthMin: 30, lengthMax: 70, weightMin: 0.4, weightMax: 6, venues: [5,6], habitat: '河湖', desc: '白鲢，滤食。' },
                { name: '江鳙', basePrice: 32, category: '淡水鱼', rarity: 'common', lengthMin: 38, lengthMax: 95, weightMin: 0.8, weightMax: 15, venues: [6], habitat: '大江', desc: '花鲢，头大。' },
                { name: '河青鱼', basePrice: 45, category: '淡水鱼', rarity: 'uncommon', lengthMin: 40, lengthMax: 110, weightMin: 1, weightMax: 20, venues: [6], habitat: '大江深水', desc: '青鱼，底层。' },
                { name: '乌鳢', basePrice: 58, category: '淡水鱼', rarity: 'uncommon', lengthMin: 30, lengthMax: 70, weightMin: 0.5, weightMax: 4, venues: [5,6], habitat: '河湖草区', desc: '黑鱼，生鱼片原料。' },
                { name: '斑鳢', basePrice: 62, category: '淡水鱼', rarity: 'uncommon', lengthMin: 28, lengthMax: 65, weightMin: 0.4, weightMax: 3.5, venues: [5,6], habitat: '南方河湖', desc: '斑乌鳢。' },
                { name: '鳜鱼', basePrice: 98, category: '淡水鱼', rarity: 'rare', lengthMin: 25, lengthMax: 58, weightMin: 0.4, weightMax: 3.5, venues: [5,6], habitat: '河湖石缝', desc: '桂鱼，桃花流水鳜鱼肥。' },
                { name: '长身鳜', basePrice: 85, category: '淡水鱼', rarity: 'uncommon', lengthMin: 22, lengthMax: 50, weightMin: 0.3, weightMax: 2.5, venues: [6], habitat: '江河', desc: '体细长鳜。' },
                { name: '河鲶', basePrice: 32, category: '淡水鱼', rarity: 'common', lengthMin: 28, lengthMax: 60, weightMin: 0.25, weightMax: 2, venues: [5,6], habitat: '河流', desc: '土鲶，常见。' },
                { name: '塑料袋', basePrice: 0, category: '河流垃圾', rarity: 'trash', lengthMin: 25, lengthMax: 55, weightMin: 0.01, weightMax: 0.04, venues: [5,6], habitat: '河面', desc: '漂浮塑料袋。' }
            ];
            var id = 0;
            list.forEach(function(f) { f.id = id++; });
            moreFish.forEach(function(f) { f.id = id++; list.push(f); });
            evenMoreFish.forEach(function(f) { f.id = id++; list.push(f); });
            extraFish.forEach(function(f) { f.id = id++; list.push(f); });
            riverJiangFish.forEach(function(f) { f.id = id++; list.push(f); });
            return list;
        }
        var SEA_FISH_LIST = buildSeaFishList();
        
        var SEA_CUSTOMER_TYPES = [
            { name: '家庭主妇', maxPriceMul: 0.7, preferRarity: 'common', preferCategory: '海水鱼' },
            { name: '餐厅老板', maxPriceMul: 1.2, preferRarity: 'rare', preferCategory: '海水鱼' },
            { name: '海鲜贩子', maxPriceMul: 0.9, preferRarity: 'common', preferCategory: '海水鱼' },
            { name: '土豪食客', maxPriceMul: 2.0, preferRarity: 'precious', preferCategory: '' },
            { name: '学生党', maxPriceMul: 0.5, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '老渔民', maxPriceMul: 1.0, preferRarity: 'rare', preferCategory: '' },
            { name: '寿司师傅', maxPriceMul: 1.5, preferRarity: 'rare', preferCategory: '海水鱼' },
            { name: '酒店采购', maxPriceMul: 1.3, preferRarity: 'precious', preferCategory: '海水鱼' },
            { name: '路边摊主', maxPriceMul: 0.6, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '收藏家', maxPriceMul: 1.8, preferRarity: 'precious', preferCategory: '' },
            { name: '健身达人', maxPriceMul: 1.0, preferRarity: 'common', preferCategory: '海水鱼' },
            { name: '网红主播', maxPriceMul: 1.4, preferRarity: 'rare', preferCategory: '' },
            { name: '退休大爷', maxPriceMul: 0.8, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '外国游客', maxPriceMul: 1.3, preferRarity: 'rare', preferCategory: '海水鱼' },
            { name: '厨师长', maxPriceMul: 1.2, preferRarity: 'rare', preferCategory: '' },
            { name: '超市经理', maxPriceMul: 0.95, preferRarity: 'common', preferCategory: '' },
            { name: '美食博主', maxPriceMul: 1.6, preferRarity: 'precious', preferCategory: '' },
            { name: '渔村大妈', maxPriceMul: 0.65, preferRarity: 'common', preferCategory: '贝类' },
            { name: '公司白领', maxPriceMul: 1.1, preferRarity: 'rare', preferCategory: '海水鱼' },
            { name: '夜宵摊主', maxPriceMul: 0.75, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '水产批发商', maxPriceMul: 0.85, preferRarity: 'common', preferCategory: '' },
            { name: '高端会所', maxPriceMul: 1.9, preferRarity: 'precious', preferCategory: '海水鱼' },
            { name: '渔民协会', maxPriceMul: 1.0, preferRarity: 'rare', preferCategory: '淡水鱼' },
            { name: '幼儿园食堂', maxPriceMul: 0.55, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '度假村', maxPriceMul: 1.4, preferRarity: 'rare', preferCategory: '海水鱼' },
            { name: '渔具店老板', maxPriceMul: 0.9, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '海鲜市场摊主', maxPriceMul: 0.8, preferRarity: 'common', preferCategory: '甲壳类' },
            { name: '网红餐厅', maxPriceMul: 1.5, preferRarity: 'precious', preferCategory: '海水鱼' },
            { name: '渔船船长', maxPriceMul: 1.0, preferRarity: 'rare', preferCategory: '海水鱼' },
            { name: '潜水教练', maxPriceMul: 1.2, preferRarity: 'rare', preferCategory: '海水鱼' },
            { name: '海洋研究员', maxPriceMul: 1.1, preferRarity: 'rare', preferCategory: '' },
            { name: '游艇主人', maxPriceMul: 1.7, preferRarity: 'precious', preferCategory: '海水鱼' },
            { name: '博物馆', maxPriceMul: 2.5, preferRarity: 'unique', preferCategory: '' },
            { name: '皇室御厨', maxPriceMul: 2.2, preferRarity: 'legendary', preferCategory: '' },
            { name: '河鲜馆老板', maxPriceMul: 1.15, preferRarity: 'uncommon', preferCategory: '淡水鱼' },
            { name: '江浙食客', maxPriceMul: 1.25, preferRarity: 'rare', preferCategory: '淡水鱼' },
            { name: '刺身店长', maxPriceMul: 1.6, preferRarity: 'rare', preferCategory: '海水鱼' },
            { name: '煲汤阿姨', maxPriceMul: 0.85, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '烧烤摊主', maxPriceMul: 0.9, preferRarity: 'common', preferCategory: '贝类' },
            { name: '日料学徒', maxPriceMul: 1.0, preferRarity: 'uncommon', preferCategory: '海水鱼' },
            { name: '农家乐老板', maxPriceMul: 0.95, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '河豚料理师', maxPriceMul: 1.8, preferRarity: 'rare', preferCategory: '淡水鱼' },
            { name: '海鲜大排档', maxPriceMul: 1.05, preferRarity: 'uncommon', preferCategory: '甲壳类' },
            { name: '鱼生爱好者', maxPriceMul: 1.45, preferRarity: 'rare', preferCategory: '海水鱼' },
            { name: '养生达人', maxPriceMul: 1.1, preferRarity: 'uncommon', preferCategory: '淡水鱼' },
            { name: '钓友', maxPriceMul: 0.75, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '宴席采购', maxPriceMul: 1.55, preferRarity: 'precious', preferCategory: '海水鱼' },
            { name: '食堂大厨', maxPriceMul: 0.7, preferRarity: 'common', preferCategory: '' },
            { name: '鲜味研究所', maxPriceMul: 1.35, preferRarity: 'rare', preferCategory: '头足类' },
            { name: '码头工人', maxPriceMul: 0.6, preferRarity: 'common', preferCategory: '海水鱼' },
            { name: '民宿老板娘', maxPriceMul: 0.88, preferRarity: 'uncommon', preferCategory: '淡水鱼' },
            { name: '鲜鱼贩', maxPriceMul: 0.82, preferRarity: 'common', preferCategory: '' },
            { name: '料理铁人', maxPriceMul: 1.9, preferRarity: 'legendary', preferCategory: '' },
            { name: '赶海达人', maxPriceMul: 0.9, preferRarity: 'uncommon', preferCategory: '贝类' },
            { name: '抠门大叔', maxPriceMul: 0.55, preferRarity: 'common', preferCategory: '' },
            { name: '阔太太', maxPriceMul: 2.2, preferRarity: 'precious', preferCategory: '海水鱼' },
            { name: '钓鱼佬', maxPriceMul: 0.85, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '菜场大妈', maxPriceMul: 0.65, preferRarity: 'common', preferCategory: '' },
            { name: '宅男', maxPriceMul: 0.9, preferRarity: 'uncommon', preferCategory: '' },
            { name: '代购', maxPriceMul: 1.1, preferRarity: 'rare', preferCategory: '海水鱼' },
            { name: '外地游客', maxPriceMul: 1.25, preferRarity: 'uncommon', preferCategory: '' },
            { name: '本地大爷', maxPriceMul: 0.75, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '小情侣', maxPriceMul: 1.15, preferRarity: 'uncommon', preferCategory: '' },
            { name: '带娃的', maxPriceMul: 0.8, preferRarity: 'common', preferCategory: '' },
            { name: '加班党', maxPriceMul: 0.95, preferRarity: 'common', preferCategory: '' },
            { name: '退休干部', maxPriceMul: 1.2, preferRarity: 'rare', preferCategory: '淡水鱼' },
            { name: '包工头', maxPriceMul: 1.35, preferRarity: 'uncommon', preferCategory: '' },
            { name: '路人甲', maxPriceMul: 0.7, preferRarity: 'common', preferCategory: '' },
            { name: '直播带货的', maxPriceMul: 1.0, preferRarity: 'uncommon', preferCategory: '' },
            { name: '养生大爷', maxPriceMul: 0.9, preferRarity: 'common', preferCategory: '淡水鱼' },
            { name: '猫奴', maxPriceMul: 0.6, preferRarity: 'common', preferCategory: '' },
            { name: '酒鬼', maxPriceMul: 0.85, preferRarity: 'common', preferCategory: '贝类' }
        ];
        
        function getSeaFishForVenue(venueId) {
            return SEA_FISH_LIST.filter(function(f) {
                return f.venues.indexOf(venueId) >= 0;
            });
        }
        
        function getSeaFishingDexSpeciesMapForVenue(venueId) {
            var map = {};
            getSeaFishForVenue(venueId).forEach(function(f) {
                if (f && f.name && !map[f.name]) map[f.name] = f;
            });
            return map;
        }
        
        function isSeaFishingFishBetter(a, b) {
            var al = Number(a && a.length) || 0;
            var bl = Number(b && b.length) || 0;
            if (al !== bl) return al > bl;
            var aw = Number(a && a.weight) || 0;
            var bw = Number(b && b.weight) || 0;
            if (aw !== bw) return aw > bw;
            var ap = Number(a && a.basePrice) || 0;
            var bp = Number(b && b.basePrice) || 0;
            return ap > bp;
        }
        
        function cloneSeaFishingFish(f) {
            return JSON.parse(JSON.stringify(f || {}));
        }
        
        function getSeaFishingDexWorldExpMultiplier() {
            var sf = player && player.landlord && player.landlord.seaFishing;
            if (!sf || !sf.fishDex || typeof sf.fishDex !== 'object') return 1;
            return 1 + Object.keys(sf.fishDex).length * 0.01;
        }
        if (typeof window !== 'undefined') {
            window.getSeaFishingDexWorldExpMultiplier = getSeaFishingDexWorldExpMultiplier;
        }
        
        function rollSeaCatch(venueId) {
            var venuePool = getSeaFishForVenue(venueId);
            var totalProb = 0;
            SEA_RARITY_CONFIG.forEach(function(r) { totalProb += r.prob; });
            var r = Math.random() * totalProb;
            var chosenRarity = SEA_RARITY_CONFIG[0].rarity;
            for (var i = 0; i < SEA_RARITY_CONFIG.length; i++) {
                if (r < SEA_RARITY_CONFIG[i].prob) {
                    chosenRarity = SEA_RARITY_CONFIG[i].rarity;
                    break;
                }
                r -= SEA_RARITY_CONFIG[i].prob;
            }
            var pool = venuePool.filter(function(f) { return f.rarity === chosenRarity; });
            if (!pool.length) pool = venuePool;
            var f = pool[Math.floor(Math.random() * pool.length)];
            var len = f.lengthMin + Math.random() * (f.lengthMax - f.lengthMin);
            var w = f.weightMin + Math.random() * (f.weightMax - f.weightMin);
            var venueName = (SEA_VENUES[venueId] && SEA_VENUES[venueId].name) ? SEA_VENUES[venueId].name : ('钓场' + venueId);
            return {
                id: f.id,
                name: f.name,
                rarity: f.rarity,
                basePrice: f.basePrice,
                category: f.category || '海水鱼',
                habitat: f.habitat || '',
                desc: f.desc || '',
                venueName: venueName,
                length: Math.round(len * 10) / 10,
                weight: Math.round(w * 10) / 10,
                uid: Date.now() + '-' + Math.random().toString(36).slice(2)
            };
        }
        
        function getSeaFishingRarityLabel(rarity) {
            var map = { common: '普通', uncommon: '优良', rare: '稀有', precious: '珍奇', legendary: '传说', mythic: '神话', ancient: '远古', unique: '唯一', trash: '海洋垃圾' };
            return map[rarity] || rarity;
        }
        /** 稀有度对应的难度权重 0~1，越稀有越难 */
        var SEA_RARITY_DIFFICULTY = { trash: 0, common: 0.05, uncommon: 0.12, rare: 0.22, precious: 0.38, legendary: 0.55, mythic: 0.72, ancient: 0.85, unique: 1 };
        /** 综合鱼价+稀有度得到难度系数 0~1 */
        function getSeaFishingDifficulty(basePrice, rarity) {
            var p = Math.max(0, (basePrice || 10));
            var priceD = Math.min(1, Math.log(1 + p / 40) / Math.log(1 + 5000 / 40));
            var rarityD = SEA_RARITY_DIFFICULTY[rarity] != null ? SEA_RARITY_DIFFICULTY[rarity] : 0.1;
            return Math.min(1, priceD * 0.55 + rarityD * 0.45);
        }
        /** 返回 { safeMin, safeMax, struggleDurationMs, tensionSpeedMul, biteWindowMs, burstRatio } 供拉扯阶段使用（已整体降低难度） */
        function getSeaFishingDifficultyParams(basePrice, rarity) {
            var d = getSeaFishingDifficulty(basePrice, rarity);
            var halfWidth = 0.30 - 0.10 * d;
            halfWidth = Math.max(0.10, halfWidth);
            var safeMin = 0.5 - halfWidth, safeMax = 0.5 + halfWidth;
            var p = Math.max(1, Number(basePrice) || 1);
            var priceScale = Math.min(1, Math.log10(1 + p) / Math.log10(1 + 50000)); // 越贵越接近1
            var minDuration = 8000 + 6000 * d + 10000 * priceScale;
            var maxDuration = 16000 + 14000 * d + 26000 * priceScale;
            var struggleDurationMs = minDuration + Math.random() * Math.max(0, maxDuration - minDuration);
            struggleDurationMs = Math.min(60000, struggleDurationMs); // 最长1分钟（时长公式未改，仅降拉扯强度）
            var tensionSpeedMul = 1 + 0.52 * d;
            var biteWindowMs = 3200 - 1000 * d;
            biteWindowMs = Math.max(1600, biteWindowMs);
            var burstRatio = 0.34 + 0.22 * d;
            return { safeMin: safeMin, safeMax: safeMax, struggleDurationMs: struggleDurationMs, tensionSpeedMul: tensionSpeedMul, biteWindowMs: biteWindowMs, burstRatio: burstRatio };
        }
        
        function getSeaFishingCatchProbPercent(rarity) {
            var r = SEA_RARITY_CONFIG.filter(function(x) { return x.rarity === rarity; })[0];
            return r ? r.prob : 0;
        }
        
        /** 牧场仓库·待售产出 / 动物库存：滚轮优先滚动本区域，避免被外层 .landlord-ranch-root 抢走 */
        function bindRanchWarehouseWheelScroll() {
            function onWheel(e) {
                var el = e.currentTarget;
                if (!el || el.scrollHeight <= el.clientHeight + 1) return;
                var dy = e.deltaY;
                var st = el.scrollTop;
                var max = Math.max(0, el.scrollHeight - el.clientHeight);
                var atTop = st <= 0;
                var atBot = st >= max - 1;
                if ((dy < 0 && !atTop) || (dy > 0 && !atBot)) e.stopPropagation();
            }
            var produce = document.getElementById('ranchWarehouseProduceGrid');
            var inv = document.getElementById('ranchWarehouseInvGrid');
            if (produce) produce.addEventListener('wheel', onWheel, { passive: true });
            if (inv) inv.addEventListener('wheel', onWheel, { passive: true });
        }

        /** 鱼舱、市场列表：滚轮优先滚动本区域，避免被外层 .landlord-tab-content 抢走 */
        function bindSeaFishingPanelWheelScroll() {
            function onWheel(e) {
                var el = e.currentTarget;
                if (!el || el.scrollHeight <= el.clientHeight + 1) return;
                var dy = e.deltaY;
                var st = el.scrollTop;
                var max = Math.max(0, el.scrollHeight - el.clientHeight);
                var atTop = st <= 0;
                var atBot = st >= max - 1;
                if ((dy < 0 && !atTop) || (dy > 0 && !atBot)) e.stopPropagation();
            }
            var tank = document.getElementById('seaFishingTankList');
            var market = document.getElementById('seaFishingMarketList');
            if (tank && tank.dataset.seaWheelBound !== '1') {
                tank.dataset.seaWheelBound = '1';
                tank.addEventListener('wheel', onWheel, { passive: true });
            }
            if (market && market.dataset.seaWheelBound !== '1') {
                market.dataset.seaWheelBound = '1';
                market.addEventListener('wheel', onWheel, { passive: true });
            }
        }

        function initSeaFishingUI() {
            if (!player.landlord) return;
            if (!player.landlord.seaFishing) {
                player.landlord.seaFishing = {
                    currentVenue: 0,
                    dexVenue: 0,
                    fishTank: [],
                    marketListings: [],
                    fishDex: {},
                    lastCustomerTime: 0,
                    lastMarketTime: Date.now(),
                    fishingState: 'idle',
                    tension: 0.5,
                    tensionDir: 1,
                    struggleTimer: null,
                    biteTimer: null,
                    selectedIds: {},
                    marketSelectedIds: {},
                    rightTab: 'market'
                };
            }
            var sf = player.landlord.seaFishing;
            if (!sf.fishDex || typeof sf.fishDex !== 'object') sf.fishDex = {};
            if (!Array.isArray(sf.fishTank)) sf.fishTank = [];
            if (!Number.isFinite(Number(sf.dexVenue))) sf.dexVenue = parseInt(sf.currentVenue, 10) || 0;
            if (sf.rightTab !== 'dex' && sf.rightTab !== 'market') sf.rightTab = 'market';
            var listEl = document.getElementById('seaFishingVenueList');
            if (!listEl) return;
            var currentVenue = parseInt(sf.currentVenue, 10) || 0;
            var btns = listEl.querySelectorAll('.sea-fishing-venue-btn');
            if (btns.length >= 5) {
                btns.forEach(function(btn, i) {
                    var vid = parseInt(btn.getAttribute('data-venue-id'), 10);
                    if (isNaN(vid)) vid = i;
                    btn.className = 'sea-fishing-venue-btn' + (currentVenue === vid ? ' active' : '');
                    btn.onclick = function() { seaFishingSelectVenue(vid); };
                });
            } else {
                listEl.innerHTML = '';
                SEA_VENUES.forEach(function(v) {
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'sea-fishing-venue-btn' + (sf.currentVenue === v.id ? ' active' : '');
                    btn.textContent = v.icon + ' ' + v.name;
                    btn.dataset.venueId = String(v.id);
                    btn.addEventListener('click', function() {
                        var id = parseInt(btn.dataset.venueId, 10);
                        if (!isNaN(id)) seaFishingSelectVenue(id);
                    });
                    listEl.appendChild(btn);
                });
            }
            var scene = document.getElementById('seaFishingScene');
            if (scene) scene.className = 'sea-fishing-scene sea-venue-' + sf.currentVenue;
            var venueNameEl = document.getElementById('seaFishingCurrentVenueName');
            if (venueNameEl && SEA_VENUES[sf.currentVenue]) venueNameEl.textContent = '（' + SEA_VENUES[sf.currentVenue].name + '）';
            seaFishingUpdateTensionUI(0.5);
            var statusEl = document.getElementById('seaFishingStatusText');
            var castBtn = document.getElementById('seaFishingCastBtn');
            var reelBtn = document.getElementById('seaFishingReelBtn');
            var holdBtn = document.getElementById('seaFishingHoldBtn');
            var rod = document.getElementById('seaFishingRodLine');
            var bob = document.getElementById('seaFishingBobber');
            if (statusEl) statusEl.textContent = '选择钓场后点击「下竿」开始海钓';
            if (castBtn) castBtn.style.display = 'inline-block';
            if (reelBtn) reelBtn.style.display = 'none';
            if (holdBtn) holdBtn.style.display = 'none';
            if (rod) rod.style.display = 'none';
            if (bob) bob.style.display = 'none';
            if (sf.fishingState === 'waiting') {
                if (statusEl) statusEl.textContent = '下竿中……等待鱼上钩';
                if (castBtn) castBtn.style.display = 'none';
                if (rod) rod.style.display = 'block';
                if (bob) bob.style.display = 'block';
            } else if (sf.fishingState === 'bite') {
                if (statusEl) statusEl.textContent = '有鱼咬钩！快点击「拉钩」！';
                if (castBtn) castBtn.style.display = 'none';
                if (reelBtn) reelBtn.style.display = 'inline-block';
                if (rod) rod.style.display = 'block';
                if (bob) bob.style.display = 'block';
            } else if (sf.fishingState === 'struggle') {
                if (statusEl) statusEl.textContent = '鱼在反抗！按住「收线」保持张力在绿色区内';
                if (castBtn) castBtn.style.display = 'none';
                if (reelBtn) reelBtn.style.display = 'none';
                if (holdBtn) holdBtn.style.display = 'inline-block';
                if (rod) rod.style.display = 'block';
                if (bob) bob.style.display = 'block';
                if (sf.struggleTimer) clearTimeout(sf.struggleTimer);
                sf.struggleTimer = null;
                startSeaFishingStruggleLoop();
            }
            renderSeaFishingTank();
            renderSeaFishingMarket();
            bindSeaFishingPanelWheelScroll();
            syncSeaFishingDexVenueUI();
            tickSeaFishingCustomer();
        }
        
        /** 鱼图鉴顶栏标签：同步钓场按钮与高亮（独立于海钓 currentVenue） */
        function syncSeaFishingDexVenueUI() {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            var currentVenue = parseInt(sf.dexVenue, 10);
            if (isNaN(currentVenue) || currentVenue < 0 || currentVenue >= SEA_VENUES.length) currentVenue = parseInt(sf.currentVenue, 10) || 0;
            var listEl = document.getElementById('seaFishingDexVenueList');
            if (listEl) {
                var btns = listEl.querySelectorAll('.sea-fishing-venue-btn');
                btns.forEach(function(btn, i) {
                    var vid = parseInt(btn.getAttribute('data-venue-id'), 10);
                    if (isNaN(vid)) vid = i;
                    btn.className = 'sea-fishing-venue-btn' + (currentVenue === vid ? ' active' : '');
                    btn.onclick = function() { seaFishingSelectDexVenue(vid); };
                });
            }
            var nameEl = document.getElementById('seaFishingDexCurrentVenueName');
            if (nameEl && SEA_VENUES[currentVenue]) nameEl.textContent = '（' + SEA_VENUES[currentVenue].name + '）';
        }
        
        function initSeaFishingDexTab() {
            if (!player.landlord) return;
            if (!player.landlord.seaFishing) initSeaFishingUI();
            if (!player.landlord.seaFishing) return;
            if (!player.landlord.seaFishing.fishDex || typeof player.landlord.seaFishing.fishDex !== 'object') player.landlord.seaFishing.fishDex = {};
            syncSeaFishingDexVenueUI();
            renderSeaFishingDex();
        }
        if (typeof window !== 'undefined') {
            window.initSeaFishingDexTab = initSeaFishingDexTab;
        }
        
        function seaFishingSelectDexVenue(venueId) {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            var id = parseInt(venueId, 10);
            if (isNaN(id) || id < 0 || id >= SEA_VENUES.length) return;
            sf.dexVenue = id;
            syncSeaFishingDexVenueUI();
            renderSeaFishingDex();
        }
        if (typeof window !== 'undefined') {
            window.seaFishingSelectDexVenue = seaFishingSelectDexVenue;
        }
        
        function seaFishingSelectVenue(venueId) {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            if (sf.fishingState !== 'idle') return;
            var id = parseInt(venueId, 10);
            if (isNaN(id) || id < 0 || id >= SEA_VENUES.length) return;
            sf.currentVenue = id;
            initSeaFishingUI();
        }
        if (typeof window !== 'undefined') {
            window.seaFishingSelectVenue = seaFishingSelectVenue;
        }
        
        function seaFishingCast() {
            var sf = player.landlord.seaFishing;
            if (!sf || sf.fishingState !== 'idle') return;
            if ((sf.fishTank || []).length >= 50) {
                showLandlordNotification('鱼舱已满，请先上架或清理再钓！', 'error');
                return;
            }
            if (sf.biteTimer) { clearTimeout(sf.biteTimer); sf.biteTimer = null; }
            sf.fishingState = 'waiting';
            if (sf.ambientInterval) { clearInterval(sf.ambientInterval); sf.ambientInterval = null; }
            var st = document.getElementById('seaFishingStatusText');
            var cb = document.getElementById('seaFishingCastBtn');
            var rl = document.getElementById('seaFishingRodLine');
            var bb = document.getElementById('seaFishingBobber');
            var ambientMsgs = ['水面平静…', '有鱼影在附近游动…', '线绷得紧紧的…', '浮标轻轻晃动…', '耐心等待…', '风吹过水面…', '远处有涟漪…', '盯着浮标…', '感觉有鱼在试探…', '水波不兴…', '水面下有大鱼阴影掠过…', '浮标微微一顿…'];
            if (st) st.textContent = '下竿中……等待鱼上钩';
            if (cb) cb.style.display = 'none';
            if (rl) rl.style.display = 'block';
            if (bb) { bb.style.display = 'block'; bb.classList.add('bobber-waiting'); }
            sf.ambientInterval = setInterval(function() {
                if (!player.landlord || !player.landlord.seaFishing || player.landlord.seaFishing.fishingState !== 'waiting') {
                    if (player.landlord && player.landlord.seaFishing && player.landlord.seaFishing.ambientInterval) {
                        clearInterval(player.landlord.seaFishing.ambientInterval);
                        player.landlord.seaFishing.ambientInterval = null;
                    }
                    return;
                }
                var el = document.getElementById('seaFishingStatusText');
                if (el) el.textContent = ambientMsgs[Math.floor(Math.random() * ambientMsgs.length)];
            }, 2800 + Math.random() * 1200);
            var delay = 2000 + Math.random() * 5000;
            sf.nibbleTimers = [];
            var nibbleAt = function(ratio) {
                var t = setTimeout(function() {
                    if (!player.landlord || !player.landlord.seaFishing || player.landlord.seaFishing.fishingState !== 'waiting') return;
                    var stN = document.getElementById('seaFishingStatusText');
                    if (stN) stN.textContent = '浮标动了一下…';
                    setTimeout(function() {
                        if (!player.landlord || !player.landlord.seaFishing || player.landlord.seaFishing.fishingState !== 'waiting') return;
                        var stR = document.getElementById('seaFishingStatusText');
                        if (stR) stR.textContent = '下竿中……等待鱼上钩';
                    }, 900);
                }, delay * ratio);
                sf.nibbleTimers.push(t);
            };
            if (delay > 3500) { nibbleAt(0.35); nibbleAt(0.65); }
            function doBiteAttempt() {
                if (!player.landlord || !player.landlord.seaFishing || player.landlord.seaFishing.fishingState !== 'waiting') return;
                var sfb = player.landlord.seaFishing;
                if (sfb.nibbleTimers) sfb.nibbleTimers.forEach(function(t) { clearTimeout(t); });
                sfb.nibbleTimers = [];
                sfb.biteTimer = null;
                if (Math.random() < 0.08) {
                    var stF = document.getElementById('seaFishingStatusText');
                    if (stF) stF.textContent = '浮标沉了一下又浮起来…是假咬！';
                    seaFishingElectricEffect('fail');
                    showLandlordNotification('假咬！再等等…', 'warn');
                    sfb.biteTimer = setTimeout(doBiteAttempt, 1500 + Math.random() * 2500);
                    return;
                }
                if (sfb.ambientInterval) { clearInterval(sfb.ambientInterval); sfb.ambientInterval = null; }
                var bobEl = document.getElementById('seaFishingBobber');
                if (bobEl) bobEl.classList.remove('bobber-waiting');
                if (Math.random() < 0.0045) {
                    sfb.fishingState = 'idle';
                    var stDrag = document.getElementById('seaFishingStatusText');
                    var cb2 = document.getElementById('seaFishingCastBtn');
                    var rl2 = document.getElementById('seaFishingRodLine');
                    var bb2 = document.getElementById('seaFishingBobber');
                    if (stDrag) stDrag.textContent = '浮标被拖走了……';
                    if (cb2) cb2.style.display = 'inline-block';
                    if (rl2) rl2.style.display = 'none';
                    if (bb2) { bb2.style.display = 'none'; bb2.classList.remove('bobber-waiting'); }
                    showLandlordNotification('浮标被拖走了', 'warn');
                    return;
                }
                sfb.fishingState = 'bite';
                sfb.currentCatch = rollSeaCatch(sfb.currentVenue);
                if (Math.random() < 0.04) {
                    sfb.currentCatch = rollSeaCatch(sfb.currentVenue);
                    showLandlordNotification('饵被抢了，换了一条鱼！', 'warn');
                }
                if (Math.random() < 0.03) {
                    var otherFish = rollSeaCatch(sfb.currentVenue);
                    sfb.currentCatch = Math.random() < 0.5 ? sfb.currentCatch : otherFish;
                    showLandlordNotification('两条鱼同时咬钩！只能留一条…', 'info');
                }
                if (Math.random() < 0.003) {
                    sfb.currentCatch = { name: '漂流瓶', basePrice: 66, category: '特殊', rarity: 'precious', length: 25, weight: 0.3, venueName: (SEA_VENUES[sfb.currentVenue] && SEA_VENUES[sfb.currentVenue].name) || '钓场', habitat: '海面', desc: '瓶中有张纸条，写着：愿钓友天天爆护。', uid: Date.now() + '-' + Math.random().toString(36).slice(2) };
                    showLandlordNotification('钓到漂流瓶！', 'success');
                }
                if (Math.random() < 0.002) {
                    sfb.currentCatch = { name: '沉船小宝箱', basePrice: 188, category: '特殊', rarity: 'legendary', length: 30, weight: 2, venueName: (SEA_VENUES[sfb.currentVenue] && SEA_VENUES[sfb.currentVenue].name) || '钓场', habitat: '海底', desc: '锈蚀的小箱子，打开是几枚旧币。', uid: Date.now() + '-' + Math.random().toString(36).slice(2) };
                    showLandlordNotification('钓到沉船小宝箱！', 'success');
                }
                var biteParams = getSeaFishingDifficultyParams(sfb.currentCatch.basePrice, sfb.currentCatch.rarity);
                sfb.biteWindowMs = biteParams.biteWindowMs;
                var st2 = document.getElementById('seaFishingStatusText');
                var reelBtn = document.getElementById('seaFishingReelBtn');
                var splash = document.getElementById('seaFishingSplash');
                var w = (sfb.currentCatch.weight || 0.5);
                var biteFeel = w >= 5 ? '好沉！大家伙！快拉钩！' : (w >= 1 ? '有分量！线被拉紧了！快拉钩！' : '浮标沉了！快点击「拉钩」！');
                if (st2) st2.textContent = biteFeel;
                if (reelBtn) reelBtn.style.display = 'inline-block';
                if (splash) { splash.style.display = 'block'; setTimeout(function() { if (splash) splash.style.display = 'none'; }, 600); }
                seaFishingElectricEffect('bite');
                sfb.biteWindow = setTimeout(function() {
                    if (player.landlord && player.landlord.seaFishing && player.landlord.seaFishing.fishingState === 'bite') {
                        var sfr = player.landlord.seaFishing;
                        if (sfr.ambientInterval) { clearInterval(sfr.ambientInterval); sfr.ambientInterval = null; }
                        sfr.fishingState = 'idle';
                        var a = document.getElementById('seaFishingStatusText');
                        var b = document.getElementById('seaFishingReelBtn');
                        var c = document.getElementById('seaFishingCastBtn');
                        var d = document.getElementById('seaFishingRodLine');
                        var e = document.getElementById('seaFishingBobber');
                        var runMsg = ['鱼跑掉了……', '鱼吐钩了……', '反应慢了，鱼跑了……'][Math.floor(Math.random() * 3)];
                        if (a) a.textContent = runMsg;
                        if (b) b.style.display = 'none';
                        if (c) c.style.display = 'inline-block';
                        if (d) d.style.display = 'none';
                        if (e) { e.style.display = 'none'; e.classList.remove('bobber-waiting'); }
                    }
                }, sfb.biteWindowMs);
            }
            sf.biteTimer = setTimeout(doBiteAttempt, delay);
        }
        
        function seaFishingReel() {
            var sf = player.landlord && player.landlord.seaFishing;
            if (!sf || sf.fishingState !== 'bite') return;
            if (sf.biteWindow) clearTimeout(sf.biteWindow);
            sf.biteWindow = null;
            var catch_ = sf.currentCatch;
            if (!catch_) catch_ = rollSeaCatch(sf.currentVenue);
            sf.currentCatch = catch_;
            var params = getSeaFishingDifficultyParams(catch_.basePrice, catch_.rarity);
            var d = getSeaFishingDifficulty(catch_.basePrice, catch_.rarity);
            if (Math.random() < 0.011 + 0.008 * d) {
                seaFishingLoseFish('鱼没咬牢，脱钩了……');
                showLandlordNotification('鱼没咬牢脱钩了', 'error');
                return;
            }
            sf.fishingState = 'struggle';
            var reelBtn = document.getElementById('seaFishingReelBtn');
            var holdBtn = document.getElementById('seaFishingHoldBtn');
            var st = document.getElementById('seaFishingStatusText');
            if (reelBtn) reelBtn.style.display = 'none';
            if (holdBtn) holdBtn.style.display = 'inline-block';
            if (st) st.textContent = '鱼在反抗！按住「收线」保持张力在绿色区内';
            sf.safeMin = params.safeMin;
            sf.safeMax = params.safeMax;
            sf.tensionSpeedMul = params.tensionSpeedMul;
            sf.struggleEndTime = Date.now() + params.struggleDurationMs;
            sf.burstRatio = params.burstRatio != null ? params.burstRatio : 0.5;
            sf.tension = 0.5;
            sf.tensionTarget = 0.5;
            sf.tensionDir = 1;
            sf.runEnd = Date.now() + 280 + Math.random() * 420;
            sf.phase = Math.random() < sf.burstRatio ? 'burst' : 'rest';
            sf.phaseEnd = Date.now() + (sf.phase === 'burst' ? 350 + Math.random() * 650 : 400 + Math.random() * 900);
            sf.reelJamEnd = 0;
            var wrap = document.getElementById('seaFishingTensionWrap');
            if (wrap) {
                wrap.style.setProperty('--tension-safe-left', (params.safeMin * 100) + '%');
                wrap.style.setProperty('--tension-safe-width', ((params.safeMax - params.safeMin) * 100) + '%');
            }
            if (st) st.textContent = '鱼在反抗！按住「收线」保持张力在绿色区内';
            seaFishingElectricEffect('reel');
            startSeaFishingStruggleLoop();
        }
        
        var seaFishingHoldActive = false;
        function seaFishingHoldStart() { seaFishingHoldActive = true; }
        function seaFishingHoldEnd() { seaFishingHoldActive = false; }
        
        /** 电鱼感：震动+闪光效果 */
        function seaFishingElectricEffect(type) {
            var scene = document.getElementById('seaFishingScene');
            var overlay = document.getElementById('seaFishingFlashOverlay');
            var bob = document.getElementById('seaFishingBobber');
            if (scene) {
                scene.classList.remove('sea-shake', 'sea-shake-strong');
                scene.offsetHeight;
                if (type === 'bite' || type === 'danger') scene.classList.add('sea-shake');
                if (type === 'reel' || type === 'success') scene.classList.add('sea-shake-strong');
                if (type === 'fail') scene.classList.add('sea-shake');
                var dur = (type === 'reel' || type === 'success') ? 450 : 380;
                setTimeout(function() { if (scene) scene.classList.remove('sea-shake', 'sea-shake-strong'); }, dur);
            }
            if (overlay) {
                overlay.className = 'sea-fishing-flash-overlay';
                if (type === 'bite') overlay.classList.add('flash-bite');
                if (type === 'reel') overlay.classList.add('flash-reel');
                if (type === 'danger') overlay.classList.add('flash-danger');
                if (type === 'success') overlay.classList.add('flash-success');
                if (type === 'fail') overlay.classList.add('flash-fail');
                overlay.offsetHeight;
                setTimeout(function() {
                    if (overlay) overlay.className = 'sea-fishing-flash-overlay';
                }, type === 'danger' ? 350 : 550);
            }
            if (bob && type === 'bite') {
                bob.classList.remove('bobber-bite');
                bob.offsetHeight;
                bob.classList.add('bobber-bite');
                setTimeout(function() { if (bob) bob.classList.remove('bobber-bite'); }, 1600);
            }
        }
        
        /** 统一处理「跑鱼」：重置为 idle 并显示原因（含拉钩/收线按钮与竿、浮标） */
        function seaFishingLoseFish(msg) {
            var sf = player.landlord && player.landlord.seaFishing;
            if (!sf) return;
            sf.fishingState = 'idle';
            var wrap = document.getElementById('seaFishingTensionWrap');
            if (wrap) { wrap.style.removeProperty('--tension-safe-left'); wrap.style.removeProperty('--tension-safe-width'); wrap.classList.remove('tension-danger'); }
            var st = document.getElementById('seaFishingStatusText');
            var rb = document.getElementById('seaFishingReelBtn');
            var hb = document.getElementById('seaFishingHoldBtn');
            var cb = document.getElementById('seaFishingCastBtn');
            var rl = document.getElementById('seaFishingRodLine');
            var bb = document.getElementById('seaFishingBobber');
            if (st) st.textContent = msg;
            if (rb) rb.style.display = 'none';
            if (hb) hb.style.display = 'none';
            if (cb) cb.style.display = 'inline-block';
            if (rl) { rl.style.display = 'none'; rl.style.transform = ''; rl.classList.remove('rod-struggle-hard'); }
            if (bb) { bb.style.display = 'none'; bb.style.animation = ''; bb.style.transform = ''; bb.classList.remove('bobber-struggle-hard'); }
            var scene = document.getElementById('seaFishingScene');
            if (scene) scene.classList.remove('sea-scene-struggle');
            seaFishingElectricEffect('fail');
        }
        
        function startSeaFishingStruggleLoop() {
            var sf = player.landlord && player.landlord.seaFishing;
            if (!sf || sf.fishingState !== 'struggle') return;
            if (sf.struggleTimer) { clearTimeout(sf.struggleTimer); sf.struggleTimer = null; }
            function tick() {
                sf = player.landlord && player.landlord.seaFishing;
                if (!sf || sf.fishingState !== 'struggle') { if (sf) sf.struggleTimer = null; return; }
                sf.struggleTimer = null;
                if (Date.now() >= sf.struggleEndTime) {
                    sf.fishingState = 'idle';
                    if (!sf.fishTank) sf.fishTank = [];
                    sf.fishTank.push(sf.currentCatch);
                    if (sf.fishTank.length > 50) sf.fishTank = sf.fishTank.slice(0, 50);
                    seaFishingElectricEffect('success');
                    var st = document.getElementById('seaFishingStatusText');
                    var hb = document.getElementById('seaFishingHoldBtn');
                    var cb = document.getElementById('seaFishingCastBtn');
                    var rl = document.getElementById('seaFishingRodLine');
                    var bb = document.getElementById('seaFishingBobber');
                    var wrap = document.getElementById('seaFishingTensionWrap');
                    if (wrap) { wrap.style.removeProperty('--tension-safe-left'); wrap.style.removeProperty('--tension-safe-width'); wrap.classList.remove('tension-danger'); }
                    var weight = sf.currentCatch.weight || 0;
                    var weightDesc = weight >= 10 ? '，沉甸甸的！' : (weight >= 2 ? '，约 ' + weight.toFixed(1) + ' 斤！' : '');
                    if (st) st.textContent = '钓到了！' + sf.currentCatch.name + '（' + getSeaFishingRarityLabel(sf.currentCatch.rarity) + '）' + weightDesc;
                    if (hb) hb.style.display = 'none';
                    if (cb) cb.style.display = 'inline-block';
                    if (rl) { rl.style.display = 'none'; rl.style.transform = ''; rl.classList.remove('rod-struggle-hard'); }
                    if (bb) { bb.style.display = 'none'; bb.style.animation = ''; bb.style.transform = ''; bb.classList.remove('bobber-struggle-hard'); }
                    var sceneDone = document.getElementById('seaFishingScene');
                    if (sceneDone) sceneDone.classList.remove('sea-scene-struggle');
                    renderSeaFishingTank();
                    showLandlordNotification('钓到 ' + sf.currentCatch.name + '！', 'success');
                    saveGame();
                    return;
                }
                var now = Date.now();
                var safeMin = sf.safeMin != null ? sf.safeMin : 0.25, safeMax = sf.safeMax != null ? sf.safeMax : 0.75;
                var nearEdge = (sf.tension < safeMin + 0.08) || (sf.tension > safeMax - 0.08);
                var difficulty = getSeaFishingDifficulty(sf.currentCatch.basePrice, sf.currentCatch.rarity);
                var venue = sf.currentVenue;
                var isRiverJiang = (venue === 5 || venue === 6);
                if (Math.random() < (0.0009 + 0.0006 * difficulty) * 0.275) {
                    seaFishingLoseFish('鱼咬断线跑了！');
                    showLandlordNotification('鱼咬断线跑了……', 'error');
                    return;
                }
                if (Math.random() < (0.0005 + (nearEdge ? 0.0004 : 0)) * 0.275) {
                    seaFishingLoseFish('鱼脱钩跑了！');
                    showLandlordNotification('鱼脱钩跑了', 'error');
                    return;
                }
                if (Math.random() < (isRiverJiang ? 0.0009 : 0.0005) * 0.3) {
                    var msgObstacle = Math.random() < 0.5 ? '鱼钻入障碍物，线缠住跑了！' : '挂底了！线断了……';
                    seaFishingLoseFish(msgObstacle);
                    showLandlordNotification(msgObstacle.indexOf('挂底') >= 0 ? '挂底断线' : '鱼钻障碍物跑了', 'error');
                    return;
                }
                if (!sf.reelJamEnd || now > sf.reelJamEnd) sf.reelJamEnd = 0;
                if (!sf.weedJamEnd || now > sf.weedJamEnd) sf.weedJamEnd = 0;
                if (sf.reelJamEnd === 0 && Math.random() < 0.00055) {
                    sf.reelJamEnd = now + 450 + Math.random() * 350;
                    var jamMsg = Math.random() < 0.5 ? '轮子卡了一下！收线暂时不顺…' : '什么东西夹住线了！收线不顺…';
                    var stJ = document.getElementById('seaFishingStatusText');
                    if (stJ) stJ.textContent = jamMsg;
                    setTimeout(function() {
                        if (player.landlord && player.landlord.seaFishing && player.landlord.seaFishing.fishingState === 'struggle') {
                            var stR = document.getElementById('seaFishingStatusText');
                            if (stR) stR.textContent = '鱼在反抗！按住「收线」保持张力在绿色区内';
                        }
                    }, 800);
                }
                if (sf.weedJamEnd === 0 && Math.random() < 0.00044) {
                    sf.weedJamEnd = now + 550 + Math.random() * 400;
                    var stWeed = document.getElementById('seaFishingStatusText');
                    if (stWeed) stWeed.textContent = '缠到水草了！收线变慢…';
                    setTimeout(function() {
                        if (player.landlord && player.landlord.seaFishing && player.landlord.seaFishing.fishingState === 'struggle') {
                            var stR = document.getElementById('seaFishingStatusText');
                            if (stR) stR.textContent = '鱼在反抗！按住「收线」保持张力在绿色区内';
                        }
                    }, 750);
                }
                if (Math.random() < 0.0011) {
                    sf.tension = Math.max(0.1, Math.min(0.9, sf.tension + sf.tensionDir * 0.26));
                    var stJump = document.getElementById('seaFishingStatusText');
                    if (stJump) stJump.textContent = '鱼打挺！小心！';
                    seaFishingElectricEffect('danger');
                }
                if (sf.currentCatch.rarity === 'trash' && Math.random() < 0.00066) {
                    sf.tension = Math.max(0.1, Math.min(0.9, sf.tension + sf.tensionDir * 0.2));
                    var stTrash = document.getElementById('seaFishingStatusText');
                    if (stTrash) stTrash.textContent = '挂到杂物，线绷紧了！';
                }
                if (!sf.waveEffectEnd || now > sf.waveEffectEnd) sf.waveEffectEnd = 0;
                if (sf.waveEffectEnd === 0 && Math.random() < 0.00055) {
                    sf.waveEffectEnd = now + 1600 + Math.random() * 700;
                    sf.waveEffectMul = 1.32;
                    var stWave = document.getElementById('seaFishingStatusText');
                    if (stWave) stWave.textContent = '一阵大浪！浮标晃得厉害…';
                }
                if (!sf.jumpFishEnd || now > sf.jumpFishEnd) sf.jumpFishEnd = 0;
                if (sf.jumpFishEnd === 0 && Math.random() < 0.000825) {
                    sf.jumpFishEnd = now + 300;
                    sf.tension = Math.max(0.1, Math.min(0.9, sf.tension + sf.tensionDir * 0.24));
                    var stJump2 = document.getElementById('seaFishingStatusText');
                    if (stJump2) stJump2.textContent = '鱼跃出水面！';
                    seaFishingElectricEffect('danger');
                }
                if (!sf.gillEnd || now > sf.gillEnd) sf.gillEnd = 0;
                if (sf.gillEnd === 0 && Math.random() < 0.00066) {
                    sf.gillEnd = now + 250;
                    sf.tension = Math.max(0.1, Math.min(0.9, sf.tension + sf.tensionDir * 0.22));
                    var stGill = document.getElementById('seaFishingStatusText');
                    if (stGill) stGill.textContent = '鱼洗鳃！甩头挣扎！';
                }
                if (!sf.seagullEnd || now > sf.seagullEnd) sf.seagullEnd = 0;
                if (sf.seagullEnd === 0 && Math.random() < 0.000495) {
                    sf.seagullEnd = now + 1300 + Math.random() * 400;
                    var stSeagull = document.getElementById('seaFishingStatusText');
                    if (stSeagull) stSeagull.textContent = '海鸥啄线！线乱晃…';
                }
                if (!sf.knotEnd || now > sf.knotEnd) sf.knotEnd = 0;
                if (sf.knotEnd === 0 && Math.random() < 0.00055) {
                    sf.knotEnd = now + 800 + Math.random() * 500;
                    var stKnot = document.getElementById('seaFishingStatusText');
                    if (stKnot) stKnot.textContent = '线打结了！收线不顺…';
                }
                if (!sf.luckyEnd || now > sf.luckyEnd) sf.luckyEnd = 0;
                if (sf.luckyEnd === 0 && Math.random() < 0.0008) {
                    sf.luckyEnd = now + 2000 + Math.random() * 800;
                    sf.luckyMul = 0.8;
                    var stLucky = document.getElementById('seaFishingStatusText');
                    if (stLucky) stLucky.textContent = '手感顺了！趁现在稳住！';
                }
                if (!sf.mudEnd || now > sf.mudEnd) sf.mudEnd = 0;
                if (sf.mudEnd === 0 && Math.random() < 0.000715) {
                    sf.mudEnd = now + 200;
                    sf.tension = Math.max(0.1, Math.min(0.9, sf.tension + sf.tensionDir * 0.28));
                    var stMud = document.getElementById('seaFishingStatusText');
                    if (stMud) stMud.textContent = '鱼往泥里钻！线绷紧了！';
                }
                if (!sf.rockEnd || now > sf.rockEnd) sf.rockEnd = 0;
                if (sf.rockEnd === 0 && Math.random() < 0.00055) {
                    if (Math.random() < 0.22) {
                        seaFishingLoseFish('线缠到礁石，断了……');
                        showLandlordNotification('线缠礁石断了', 'error');
                        return;
                    }
                    sf.rockEnd = now + 600;
                    var stRock = document.getElementById('seaFishingStatusText');
                    if (stRock) stRock.textContent = '线刮到礁石！小心！';
                }
                if (!sf.sprintEnd || now > sf.sprintEnd) sf.sprintEnd = 0;
                if (sf.sprintEnd === 0 && Math.random() < 0.00077) {
                    sf.sprintEnd = now + 250;
                    sf.tension = Math.max(0.1, Math.min(0.9, sf.tension + sf.tensionDir * 0.32));
                    var stSprint = document.getElementById('seaFishingStatusText');
                    if (stSprint) stSprint.textContent = '鱼突然冲刺！拉紧了！';
                    seaFishingElectricEffect('danger');
                }
                if (!sf.tipShakeEnd || now > sf.tipShakeEnd) sf.tipShakeEnd = 0;
                if (sf.tipShakeEnd === 0 && Math.random() < 0.000605) {
                    sf.tipShakeEnd = now + 400;
                    sf.tension += (Math.random() - 0.5) * 0.08;
                    sf.tension = Math.max(0.1, Math.min(0.9, sf.tension));
                    var stTip = document.getElementById('seaFishingStatusText');
                    if (stTip) stTip.textContent = '竿头抖得厉害！';
                }
                if (!sf.lineSlackEnd || now > sf.lineSlackEnd) sf.lineSlackEnd = 0;
                if (sf.lineSlackEnd === 0 && Math.random() < 0.000495) {
                    sf.lineSlackEnd = now + 600;
                    sf.tension = 0.4 + Math.random() * 0.2;
                    var stSlack = document.getElementById('seaFishingStatusText');
                    if (stSlack) stSlack.textContent = '线松了一下…鱼又拉紧了！';
                }
                if (!sf.currentEnd || now > sf.currentEnd) sf.currentEnd = 0;
                if (sf.currentEnd === 0 && Math.random() < 0.00055) {
                    sf.currentEnd = now + 1100 + Math.random() * 500;
                    sf.currentMul = 0.3;
                    var stCur = document.getElementById('seaFishingStatusText');
                    if (stCur) stCur.textContent = '逆流！收线吃力…';
                }
                if (!sf.schoolEnd || now > sf.schoolEnd) sf.schoolEnd = 0;
                if (sf.schoolEnd === 0 && Math.random() < 0.00044) {
                    sf.schoolEnd = now + 900;
                    var stSchool = document.getElementById('seaFishingStatusText');
                    if (stSchool) stSchool.textContent = '鱼群搅水！线乱晃…';
                }
                if (!sf.branchEnd || now > sf.branchEnd) sf.branchEnd = 0;
                if (sf.branchEnd === 0 && Math.random() < 0.00055) {
                    if (Math.random() < 0.25) {
                        seaFishingLoseFish('钩挂到树枝，线断了……');
                        showLandlordNotification('挂树枝断线', 'error');
                        return;
                    }
                    sf.branchEnd = now + 700;
                    var stBranch = document.getElementById('seaFishingStatusText');
                    if (stBranch) stBranch.textContent = '挂到树枝了！小心扯…';
                }
                if (Math.random() < 0.00008) {
                    seaFishingLoseFish('竿梢断了！鱼带着线跑了……');
                    showLandlordNotification('竿梢断了', 'error');
                    return;
                }
                if (!sf.tangleEnd || now > sf.tangleEnd) sf.tangleEnd = 0;
                if (sf.tangleEnd === 0 && Math.random() < 0.000385) {
                    sf.tangleEnd = now + 650 + Math.random() * 400;
                    var stTang = document.getElementById('seaFishingStatusText');
                    if (stTang) stTang.textContent = '线缠到竿上了！先理线…';
                }
                if (!sf.glareEnd || now > sf.glareEnd) sf.glareEnd = 0;
                if (sf.glareEnd === 0 && Math.random() < 0.000275) {
                    sf.glareEnd = now + 500;
                    var stGlare = document.getElementById('seaFishingStatusText');
                    if (stGlare) stGlare.textContent = '太阳晃眼…看不清浮标！';
                }
                if (!sf.snakeEnd || now > sf.snakeEnd) sf.snakeEnd = 0;
                if (sf.snakeEnd === 0 && Math.random() < 0.00022) {
                    sf.tension += (Math.random() - 0.5) * 0.15;
                    sf.tension = Math.max(0.1, Math.min(0.9, sf.tension));
                    sf.snakeEnd = now + 300;
                    var stSnake = document.getElementById('seaFishingStatusText');
                    if (stSnake) stSnake.textContent = '水面上有蛇！手一抖…';
                }
                if (now >= sf.runEnd) {
                    sf.runEnd = now + 250 + Math.random() * 450;
                    var safeBandFlip = Math.max(0.028, (safeMax - safeMin) * 0.11);
                    var nearGreenTop = sf.tension >= safeMax - safeBandFlip;
                    var nearGreenBot = sf.tension <= safeMin + safeBandFlip;
                    if (!nearGreenTop && !nearGreenBot) {
                        var flipProb = (sf.tensionSpeedMul || 1) > 1.3 ? 0.26 : (sf.tensionSpeedMul || 1) > 1.1 ? 0.17 : 0.075;
                        if (Math.random() < flipProb) sf.tensionDir = -sf.tensionDir;
                    }
                }
                if (now >= sf.phaseEnd) {
                    sf.phase = sf.phase === 'burst' ? 'rest' : 'burst';
                    var burstLen = 300 + Math.random() * (700 * (sf.burstRatio || 0.5));
                    var restLen = 350 + Math.random() * (950 * (1 - (sf.burstRatio || 0.5)));
                    sf.phaseEnd = now + (sf.phase === 'burst' ? burstLen : restLen);
                }
                var phaseMul = sf.phase === 'burst' ? (1.28 + Math.random() * 0.32) : 0.38;
                if (sf.waveEffectEnd && now < sf.waveEffectEnd) phaseMul *= (sf.waveEffectMul || 1.3);
                var speed = (0.012 + Math.random() * 0.011) * (sf.tensionSpeedMul || 1) * phaseMul * (0.9 + Math.random() * 0.2);
                if (sf.luckyEnd && now < sf.luckyEnd) speed *= (sf.luckyMul != null ? sf.luckyMul : 0.8);
                var safeBand = Math.max(0.032, (safeMax - safeMin) * 0.13);
                var nearGreenEdgePre = (sf.tension >= safeMax - safeBand) || (sf.tension <= safeMin + safeBand);
                if (!seaFishingHoldActive) {
                    if (sf.tension >= safeMax - safeBand) sf.tensionDir = 1;
                    else if (sf.tension <= safeMin + safeBand) sf.tensionDir = -1;
                }
                var rawNext;
                if (seaFishingHoldActive) {
                    var gain = 0.022;
                    if (now < sf.reelJamEnd) gain *= 0.15;
                    else if (now < (sf.weedJamEnd || 0)) gain *= 0.22;
                    else if (now < (sf.knotEnd || 0)) gain *= 0.28;
                    else if (now < (sf.currentEnd || 0)) gain *= (sf.currentMul != null ? sf.currentMul : 0.35);
                    else if (now < (sf.tangleEnd || 0)) gain *= 0.26;
                    else if (sf.tension > 0.68) gain *= Math.max(0.5, 1.2 - (sf.tension - 0.68) / 0.2);
                    rawNext = Math.min(0.92, sf.tension + gain);
                } else {
                    rawNext = sf.tension - speed * sf.tensionDir;
                }
                if (sf.seagullEnd && now < sf.seagullEnd) {
                    if (Math.random() < 0.24 && !nearGreenEdgePre) sf.tensionDir = -sf.tensionDir;
                    rawNext += (Math.random() - 0.5) * 0.12;
                }
                if (sf.schoolEnd && now < sf.schoolEnd) {
                    if (Math.random() < 0.2 && !nearGreenEdgePre) sf.tensionDir = -sf.tensionDir;
                    rawNext += (Math.random() - 0.5) * 0.09;
                }
                rawNext = Math.max(0.1, Math.min(0.9, rawNext));
                // rawNext = tension - speed*tensionDir：dir=1 向左减张力，dir=-1 向右加张力。贴边时应把张力往中间推，故左边缘用 -1、右边缘用 1（原先写反会导致指针卡在两侧）
                if (rawNext <= 0.1) sf.tensionDir = -1;
                if (rawNext >= 0.9) sf.tensionDir = 1;
                var lerpT = seaFishingHoldActive ? 0.14 : 0.22;
                sf.tension += (rawNext - sf.tension) * lerpT;
                sf.tension = Math.max(0.1, Math.min(0.9, sf.tension));
                nearEdge = (sf.tension < safeMin + 0.08) || (sf.tension > safeMax - 0.08);
                var nearGreenEdge = (sf.tension >= safeMax - safeBand) || (sf.tension <= safeMin + safeBand);
                var flipChance = nearGreenEdge ? 0 : ((sf.tensionSpeedMul || 1) > 1.2 ? (nearEdge ? 0.028 : 0.012) : 0.005);
                if (Math.random() < flipChance) sf.tensionDir = -sf.tensionDir;
                seaFishingUpdateTensionUI(sf.tension);
                if (nearEdge && (!sf.lastDangerFlash || now - sf.lastDangerFlash > 420)) {
                    sf.lastDangerFlash = now;
                    seaFishingElectricEffect('danger');
                }
                if (sf.tension < safeMin || sf.tension > safeMax) {
                    seaFishingLoseFish('线断了！鱼逃走了……');
                    showLandlordNotification('线断了，鱼跑了', 'error');
                    return;
                }
                sf.struggleTimer = setTimeout(tick, 50);
            }
            tick();
        }
        
        function seaFishingUpdateTensionUI(v) {
            var fill = document.getElementById('seaFishingTensionFill');
            var marker = document.getElementById('seaFishingTensionMarker');
            var bob = document.getElementById('seaFishingBobber');
            var wrap = document.getElementById('seaFishingTensionWrap');
            if (fill) fill.style.width = (v * 100) + '%';
            if (marker) marker.style.left = (v * 100) + '%';
            var sf = player.landlord && player.landlord.seaFishing;
            var rod = document.getElementById('seaFishingRodLine');
            var inStruggle = sf && sf.fishingState === 'struggle';
            var nearEdge = sf && sf.safeMin != null && (v < sf.safeMin + 0.1 || v > sf.safeMax - 0.1);
            var isBurst = sf && sf.phase === 'burst';
            var violent = inStruggle && (nearEdge || isBurst);
            if (bob && inStruggle) {
                bob.style.animation = 'none';
                var bobX = (v - 0.5) * 52;
                if (violent) bobX += (Math.random() - 0.5) * 18;
                bob.style.transform = 'translateX(' + bobX + 'px)';
                if (violent) bob.classList.add('bobber-struggle-hard'); else bob.classList.remove('bobber-struggle-hard');
            } else if (bob) {
                bob.style.animation = '';
                bob.style.transform = '';
                bob.classList.remove('bobber-struggle-hard');
            }
            if (rod && inStruggle) {
                var rodAngle = -32 + (v - 0.5) * 38;
                if (violent) rodAngle += (Math.random() - 0.5) * 10;
                rod.style.transform = 'rotate(' + rodAngle + 'deg)';
                if (violent) rod.classList.add('rod-struggle-hard'); else rod.classList.remove('rod-struggle-hard');
            } else if (rod) {
                rod.style.transform = '';
                rod.classList.remove('rod-struggle-hard');
            }
            if (wrap && sf && sf.safeMin != null && (v < sf.safeMin || v > sf.safeMax)) wrap.classList.add('tension-danger');
            else if (wrap) wrap.classList.remove('tension-danger');
            var scene = document.getElementById('seaFishingScene');
            if (scene && inStruggle) scene.classList.add('sea-scene-struggle');
            else if (scene) scene.classList.remove('sea-scene-struggle');
        }
        
        function renderSeaFishingTank() {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            var list = document.getElementById('seaFishingTankList');
            var countEl = document.getElementById('seaFishingTankCount');
            if (!list) return;
            if (!Array.isArray(sf.fishTank)) sf.fishTank = [];
            var tank = sf.fishTank;
            if (countEl) countEl.textContent = tank.length;
            if (tank.length === 0) {
                list.innerHTML = '<div style="color:#999;font-size:12px;">鱼舱空空如也，点击「下竿」开始钓</div>';
                return;
            }
            list.innerHTML = tank.map(function(f) {
                var selected = sf.selectedIds && sf.selectedIds[f.uid];
                var uidEsc = (f.uid || '').replace(/'/g, "\\'");
                var name = (f.name || '?').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                var category = (f.category || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                var habitat = (f.habitat || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                var desc = (f.desc || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                var venueName = (f.venueName || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                var rarityLabel = getSeaFishingRarityLabel(f.rarity);
                var html = '<div class="sea-fishing-fish-card ' + (f.rarity || 'common') + (selected ? ' selected' : '') + '" data-uid="' + (f.uid || '') + '" onclick="seaFishingToggleSelect(\'' + uidEsc + '\')">';
                html += '<div class="fish-card-name">' + name + '</div>';
                html += '<div class="fish-card-row"><span>参考价:</span>' + (f.basePrice != null ? f.basePrice : 0) + ' 地主币</div>';
                html += '<div class="fish-card-row"><span>种类:</span>' + category + '</div>';
                html += '<div class="fish-card-row"><span>稀有度:</span>' + rarityLabel + '</div>';
                html += '<div class="fish-card-row"><span>长度:</span>' + (f.length != null ? f.length : 0) + ' cm</div>';
                html += '<div class="fish-card-row"><span>重量:</span>' + (f.weight != null ? f.weight : 0) + ' kg</div>';
                html += '<div class="fish-card-row"><span>钓场:</span>' + (venueName || '-') + '</div>';
                html += '<div class="fish-card-row"><span>栖息地:</span>' + (habitat || '-') + '</div>';
                html += '<div class="fish-card-desc">' + (desc || '') + '</div>';
                html += '<div class="fish-card-actions"><button type="button" class="sea-fishing-btn-discard" onclick="event.stopPropagation(); seaFishingDiscardFish(\'' + uidEsc + '\')">丢弃</button></div>';
                html += '</div>';
                return html;
            }).join('');
        }
        
        function seaFishingToggleSelect(uid) {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            if (!sf.selectedIds) sf.selectedIds = {};
            sf.selectedIds[uid] = !sf.selectedIds[uid];
            renderSeaFishingTank();
        }
        
        function seaFishingDiscardFish(uid) {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            var tank = sf.fishTank || [];
            var idx = tank.findIndex(function(f) { return (f.uid || '') === uid; });
            if (idx < 0) return;
            tank.splice(idx, 1);
            if (sf.selectedIds) delete sf.selectedIds[uid];
            renderSeaFishingTank();
            showLandlordNotification('已丢弃该条鱼', 'success');
        }
        
        function seaFishingSellSelected() {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            var priceInput = document.getElementById('seaFishingPriceInput');
            var price = priceInput ? (parseInt(priceInput.value, 10) || 1) : 1;
            if (price < 0) price = 0;
            var tank = sf.fishTank || [];
            var selected = [];
            for (var i = tank.length - 1; i >= 0; i--) {
                if (sf.selectedIds && sf.selectedIds[tank[i].uid]) {
                    selected.push(tank[i]);
                    tank.splice(i, 1);
                }
            }
            if (selected.length === 0) {
                showLandlordNotification('请先在鱼舱中勾选要上架的鱼（点击鱼块即可勾选）', 'error');
                return;
            }
            if (!sf.marketListings) sf.marketListings = [];
            sf.selectedIds = {};
            selected.forEach(function(f) {
                sf.marketListings.push({ listingId: Date.now() + '-' + Math.random().toString(36).slice(2), fish: f, price: price, listTime: Date.now() });
            });
            renderSeaFishingTank();
            renderSeaFishingMarket();
            showLandlordNotification('已上架 ' + selected.length + ' 条，定价 ' + price + ' 地主币/条', 'success');
            saveGame();
        }
        
        function seaFishingSelectAllTank(select) {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            if (!sf.selectedIds) sf.selectedIds = {};
            (sf.fishTank || []).forEach(function(f) {
                if (f.uid) sf.selectedIds[f.uid] = select;
            });
            renderSeaFishingTank();
        }
        
        if (typeof window !== 'undefined') {
            window.seaFishingCast = seaFishingCast;
            window.seaFishingReel = seaFishingReel;
            window.seaFishingHoldStart = seaFishingHoldStart;
            window.seaFishingHoldEnd = seaFishingHoldEnd;
            window.seaFishingSelectAllTank = seaFishingSelectAllTank;
            window.seaFishingDiscardFish = seaFishingDiscardFish;
            window.seaFishingSellSelected = seaFishingSellSelected;
            window.seaFishingToggleMarketSelect = seaFishingToggleMarketSelect;
            window.seaFishingSelectAllMarket = seaFishingSelectAllMarket;
            window.seaFishingDelistSelected = seaFishingDelistSelected;
            window.seaFishingSubmitBestToDex = seaFishingSubmitBestToDex;
        }
        
        function seaFishingToggleMarketSelect(listingId) {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            if (!sf.marketSelectedIds) sf.marketSelectedIds = {};
            sf.marketSelectedIds[listingId] = !sf.marketSelectedIds[listingId];
            renderSeaFishingMarket();
        }
        function seaFishingSelectAllMarket(select) {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            if (!sf.marketSelectedIds) sf.marketSelectedIds = {};
            (sf.marketListings || []).forEach(function(l) {
                var id = l.listingId || (l.listTime + '-' + (l.fish && l.fish.uid));
                l.listingId = l.listingId || id;
                sf.marketSelectedIds[id] = select;
            });
            renderSeaFishingMarket();
        }
        function seaFishingDelistSelected() {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            var listings = sf.marketListings || [];
            var selectedIds = sf.marketSelectedIds || {};
            var toRemove = [];
            var newListings = [];
            listings.forEach(function(l) {
                var id = l.listingId || (l.listTime + '-' + (l.fish && l.fish.uid));
                if (selectedIds[id]) {
                    toRemove.push(l.fish);
                } else {
                    newListings.push(l);
                }
            });
            if (toRemove.length === 0) {
                showLandlordNotification('请先在市场中勾选要下架的商品（点击条目即可勾选）', 'error');
                return;
            }
            if (!sf.fishTank) sf.fishTank = [];
            toRemove.forEach(function(f) {
                if (sf.fishTank.length < 50) sf.fishTank.push(f);
            });
            sf.marketListings = newListings;
            sf.marketSelectedIds = {};
            renderSeaFishingTank();
            renderSeaFishingMarket();
            showLandlordNotification('已下架 ' + toRemove.length + ' 件，已退回鱼舱', 'success');
            saveGame();
        }
        function renderSeaFishingMarket() {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            var list = document.getElementById('seaFishingMarketList');
            var listings = (sf.marketListings || []);
            if (!list) return;
            if (listings.length === 0) {
                list.innerHTML = '<div style="color:#999;font-size:12px;">暂无上架</div>';
                return;
            }
            if (!sf.marketSelectedIds) sf.marketSelectedIds = {};
            list.innerHTML = listings.map(function(l) {
                var lid = l.listingId || (l.listTime + '-' + (l.fish && l.fish.uid));
                if (!l.listingId) l.listingId = lid;
                var f = l.fish;
                var selected = sf.marketSelectedIds[lid];
                var tip = (f.name || '') + ' | ' + (f.category || '') + ' | ' + getSeaFishingRarityLabel(f.rarity) + ' | ' + (f.length || 0) + 'cm/' + (f.weight || 0) + 'kg | ' + (f.desc || '');
                tip = tip.replace(/"/g, '&quot;');
                var lidEsc = (lid + '').replace(/'/g, "\\'");
                return '<div class="sea-fishing-market-item' + (selected ? ' sea-fishing-market-item-selected' : '') + '" data-listing-id="' + (lid + '').replace(/"/g, '&quot;') + '" onclick="seaFishingToggleMarketSelect(\'' + lidEsc + '\')" title="' + tip + '（点击勾选，下架选中可批量下架）"><span>' + (f.name || '?') + ' ' + getSeaFishingRarityLabel(f.rarity) + ' (' + (f.category || '') + ')</span><span>' + l.price + ' 地主币</span></div>';
            }).join('');
        }
        
        function renderSeaFishingDex() {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            if (!sf.fishDex || typeof sf.fishDex !== 'object') sf.fishDex = {};
            var summaryEl = document.getElementById('seaFishingDexSummary');
            var listEl = document.getElementById('seaFishingDexList');
            if (!summaryEl || !listEl) return;
            var venueId = parseInt(sf.dexVenue, 10);
            if (isNaN(venueId) || venueId < 0 || venueId >= SEA_VENUES.length) venueId = parseInt(sf.currentVenue, 10) || 0;
            var speciesMap = getSeaFishingDexSpeciesMapForVenue(venueId);
            var speciesNames = Object.keys(speciesMap);
            speciesNames.sort();
            var unlockedInVenue = 0;
            speciesNames.forEach(function(name) { if (sf.fishDex[name]) unlockedInVenue += 1; });
            var totalUnlocked = Object.keys(sf.fishDex).length;
            var totalBonusPct = totalUnlocked;
            summaryEl.innerHTML = '当前钓场图鉴：<strong>' + unlockedInVenue + '/' + speciesNames.length + '</strong>，全图鉴解锁：<strong>' + totalUnlocked + '</strong> 种。<br>图鉴加成：世界地图经验 <strong>+' + totalBonusPct + '%</strong>（每解锁1种 +1%）';
            if (speciesNames.length <= 0) {
                listEl.innerHTML = '<div class="sea-fishing-dex-card locked sea-fishing-dex-empty">当前钓场暂无图鉴数据</div>';
                return;
            }
            listEl.innerHTML = speciesNames.map(function(name) {
                var base = speciesMap[name] || {};
                var lit = sf.fishDex[name];
                var rarityLabel = getSeaFishingRarityLabel(base.rarity);
                if (!lit) {
                    return '<div class="sea-fishing-dex-card locked"><div class="sea-fishing-dex-name">🔒 ' + name + '</div><div class="sea-fishing-dex-meta">类型：' + (base.category || '-') + '｜稀有度：' + rarityLabel + '</div><div class="sea-fishing-dex-tip">未点亮，使用鱼舱中的同名鱼可点亮。</div></div>';
                }
                return '<div class="sea-fishing-dex-card"><div class="sea-fishing-dex-name">✅ ' + name + '</div><div class="sea-fishing-dex-meta">类型：' + (lit.category || base.category || '-') + '｜稀有度：' + getSeaFishingRarityLabel(lit.rarity || base.rarity) + '</div><div class="sea-fishing-dex-meta">图鉴样本：' + (Number(lit.length) || 0) + ' cm / ' + (Number(lit.weight) || 0) + ' kg</div><div class="sea-fishing-dex-tip">' + (lit.desc || base.desc || '') + '</div></div>';
            }).join('');
        }
        
        function seaFishingSubmitBestToDex() {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            if (!sf.fishDex || typeof sf.fishDex !== 'object') sf.fishDex = {};
            var venueId = parseInt(sf.dexVenue, 10);
            if (isNaN(venueId) || venueId < 0 || venueId >= SEA_VENUES.length) venueId = parseInt(sf.currentVenue, 10) || 0;
            var speciesMap = getSeaFishingDexSpeciesMapForVenue(venueId);
            var speciesNames = Object.keys(speciesMap);
            if (speciesNames.length <= 0) {
                showLandlordNotification('当前钓场没有可点亮的鱼图鉴', 'error');
                return;
            }
            var tank = Array.isArray(sf.fishTank) ? sf.fishTank : [];
            var bestByName = {};
            for (var i = 0; i < tank.length; i++) {
                var fish = tank[i];
                if (!fish || !fish.name || !speciesMap[fish.name]) continue;
                var cur = bestByName[fish.name];
                if (!cur || isSeaFishingFishBetter(fish, cur.fish)) bestByName[fish.name] = { fish: fish, idx: i };
            }
            var removeIdxMap = {};
            var unlocked = 0;
            var upgraded = 0;
            var downgradedToTank = 0;
            var dropped = 0;
            speciesNames.forEach(function(name) {
                var best = bestByName[name];
                if (!best || !best.fish) return;
                var oldFish = sf.fishDex[name];
                if (!oldFish) {
                    sf.fishDex[name] = cloneSeaFishingFish(best.fish);
                    removeIdxMap[best.idx] = true;
                    unlocked += 1;
                    return;
                }
                if (isSeaFishingFishBetter(best.fish, oldFish)) {
                    sf.fishDex[name] = cloneSeaFishingFish(best.fish);
                    removeIdxMap[best.idx] = true;
                    upgraded += 1;
                    if (tank.length < 50) {
                        tank.push(cloneSeaFishingFish(oldFish));
                        downgradedToTank += 1;
                    } else {
                        dropped += 1;
                    }
                }
            });
            if (Object.keys(removeIdxMap).length > 0) {
                sf.fishTank = tank.filter(function(_f, idx) { return !removeIdxMap[idx]; });
                if (sf.selectedIds && typeof sf.selectedIds === 'object') {
                    Object.keys(sf.selectedIds).forEach(function(uid) {
                        var stillExists = (sf.fishTank || []).some(function(x) { return x && x.uid === uid; });
                        if (!stillExists) delete sf.selectedIds[uid];
                    });
                }
            }
            renderSeaFishingTank();
            renderSeaFishingDex();
            if (unlocked <= 0 && upgraded <= 0) {
                showLandlordNotification('鱼舱中没有可用于点亮或优化图鉴的鱼', 'error');
                return;
            }
            var msg = '图鉴处理完成：新点亮 ' + unlocked + ' 种，优化 ' + upgraded + ' 种';
            if (downgradedToTank > 0) msg += '，已替换下来的鱼回舱 ' + downgradedToTank + ' 条';
            if (dropped > 0) msg += '，鱼舱已满丢弃 ' + dropped + ' 条旧样本';
            msg += '。世界地图经验图鉴加成 +' + Object.keys(sf.fishDex).length + '%';
            showLandlordNotification(msg, 'success');
            saveGame();
        }
        
        var SEA_CUSTOMER_MOODS = [
            { id: 'picky', label: '挑剔', bargainChance: 0.35, strictMatch: true },
            { id: 'easy', label: '随和', bargainChance: 0.08, strictMatch: false },
            { id: 'rush', label: '赶时间', bargainChance: 0.05, strictMatch: false },
            { id: 'generous', label: '大方', bargainChance: 0.02, strictMatch: false },
            { id: 'bargain', label: '砍价', bargainChance: 0.55, strictMatch: false },
            { id: 'chatty', label: '话多', bargainChance: 0.15, strictMatch: false },
            { id: 'quiet', label: '寡言', bargainChance: 0.12, strictMatch: false },
            { id: 'regular', label: '熟客', bargainChance: 0.25, strictMatch: false },
            { id: 'first', label: '头回来', bargainChance: 0.18, strictMatch: false },
            { id: 'curious', label: '好奇', bargainChance: 0.1, strictMatch: false }
        ];
        var SEA_LEAVE_REASONS = [
            '看了看价牌，摇摇头走了。',
            '「太贵了，下次再说吧。」',
            '「没有我想找的那种，去别家看看。」',
            '掂量了一下钱包，先不买了。',
            '「品相没看上，老板下次进点好的。」',
            '问了两句就走了。',
            '「今天先不买，改天再来。」',
            '逛了一圈，没挑到合眼的。',
            '「预算不够啊，便宜点就好了。」',
            '比了比别家，觉得不划算。',
            '「这鱼是野生的吗？……那算了。」',
            '接了个电话，匆匆走了。',
            '「老婆只给这么多预算，不够啊。」',
            '闻了闻，说味儿不对，走了。',
            '「老板你这价写错了吧？太吓人了。」',
            '跟同伴嘀咕两句，摇摇头一起走了。',
            '「我再去隔壁转转比较比较。」',
            '摸了摸口袋，尴尬地笑了笑走了。',
            '「今天没带够钱，下次一定。」',
            '「有没有更小一点的？没有啊，那算了。」',
            '「我只吃海鱼，你这淡水鱼多，算了。」',
            '小孩拽着要走，只好跟着走了。',
            '「网上说这家贵，果然。」',
            '看了一眼手机上的比价软件，扭头走了。',
            '「老板你这鱼眼睛都凹了，不新鲜吧。」',
            '「我过敏，好多鱼吃不了，不敢乱买。」',
            '「今天忌口，改天再来。」',
            '「有没有无刺的？没有啊……」',
            '「我就随便看看，不买。」',
            '「刚在别家买过了，下次吧。」',
            '「你这儿能刷卡吗？不能啊……」',
            '「微信余额不够了，下次。」',
            '「老板态度不行啊，不买了。」',
            '打了个喷嚏，说对海鲜过敏走了。',
            '「这鱼叫什么？没听过，不敢吃。」',
            '「我减肥，今天不买荤的。」',
            '「老婆说今天吃素。」',
            '「赶着接孩子，改天慢慢挑。」',
            '「你这有发票吗？没有啊，单位报销要的。」',
            '「太腥了，受不了。」',
            '「我就路过看看行情。」',
            '「老板，你这鱼鳞没刮干净啊，不要了。」',
            '「听说前面那家更便宜，我去看看。」',
            '「今天黄历说不宜买鱼。」',
            '「我属猫的，不能吃鱼，开玩笑的哈哈。」笑着走了。',
            '「买回去老婆又要骂乱花钱。」叹气走了。',
            '「算了，回家吃泡面吧。」',
            '「老板你长得不像会骗人的，但价太像了。」笑着走了。',
            '「鱼是好鱼，价不是好价。」摆摆手走了。',
            '「等打折再来吧。」',
            '「家里冰箱满了，下次。」',
            '「今天不宜破费，撤了。」',
            '「老板你这秤准吗？……算了不买了。」',
            '「我再去问问老婆要买啥品种。」',
            '「刚想起来对某种鱼过敏，不敢乱买。」',
            '「你这儿没我要的规格。」',
            '「赶火车，来不及了。」',
            '「同事说另一家更新鲜，我去看看。」',
            '「今天先记个价，改天来。」',
            '「老板能送货吗？不能啊那算了。」',
            '「你这氧气泵声太大，鱼怕是受惊了，不要了。」',
            '「我只看不买，别介意啊。」笑着走了。',
            '「钱包忘带了，尴尬。」',
            '「老婆说必须她来挑，改天带她来。」',
            '「你这价跟网上差太多，我再比比。」',
            '「鱼尾有点伤，算了。」',
            '「今天忌海鲜，路过看看。」',
            '「老板，你这冰不够多啊，怕不新鲜。」',
            '「有没有活的？没有啊……」',
            '「我吃素三天了，今天破戒不合适。」',
            '「刚体检完医生让少吃海鲜。」',
            '「小孩说不吃鱼，买了也白买。」',
            '「算了，改天带懂行的朋友一起来看。」'
        ];
        var SEA_LEAVE_CHEAP = [
            '「太贵了，下次再说吧。」', '「预算不够啊，便宜点就好了。」', '掂量了一下钱包，先不买了。',
            '「老婆只给这么多预算，不够啊。」', '摸了摸口袋，尴尬地笑了笑走了。', '「今天没带够钱，下次一定。」',
            '「老板你这价写错了吧？太吓人了。」', '比了比别家，觉得不划算。', '「网上说这家贵，果然。」',
            '看了一眼手机上的比价软件，扭头走了。', '「我再去隔壁转转比较比较。」', '「听说前面那家更便宜，我去看看。」',
            '「老板态度不行啊，不买了。」', '「微信余额不够了，下次。」', '「你这儿能刷卡吗？不能啊……」',
            '「老板你这价有点虚啊。」', '「便宜点我就要了，算了。」', '「学生党伤不起，撤了。」',
            '「等打折再来吧。」', '「你这价跟网上差太多。」', '「钱包忘带了。」',
            '「家里冰箱满了，下次。」', '「今天不宜破费，撤了。」', '「鱼是好鱼，价不是好价。」',
            '「零头抹了我就买，不抹走了。」', '「最后一口价，不行拉倒。」', '「老板太硬了，换一家。」'
        ];
        /** 大方/土豪型顾客购买时的感言（更热情、不砍价） */
        var SEA_BUY_GENEROUS = [
            '「老板你这鱼真不错，值这个价。」',
            '「品相一流，就它了，不用找零。」',
            '「这条我要了，多少钱都行。」',
            '「难得碰到这么好的，包起来。」',
            '「老板实在人，下次还来你这买。」',
            '「好鱼不嫌贵，就这条。」',
            '「送人就要拿得出手，就它。」',
            '「今晚宴客，这条撑场面够了。」',
            '「看着就新鲜，信得过你。」',
            '「老板会挑，我放心。」',
            '「这条够大够鲜，值。」',
            '「不差这点，要了。」',
            '「你家鱼我认，就它。」',
            '「买条好的犒劳自己。」',
            '「老板生意兴隆啊。」',
            '「这条做刺身绝了，要了。」',
            '「送老丈人就得这种。」',
            '「难得一见，收了。」',
            '「老板人好鱼也好。」',
            '「就这条，不用抹零。」',
            '「这条够档次，宴请用。」',
            '「老板进的货靠谱，我认。」',
            '「鲜度没得说，要了。」',
            '「送客户就得这种品质。」',
            '「不还价了，就这个价。」',
            '「你家鱼我吃惯了，就它。」',
            '「做寿司用，这条刚好。」',
            '「老板痛快，我也痛快。」',
            '「好货不等人，收了。」',
            '「这条绝对值，包好。」',
            '「招待贵宾用，就这条。」',
            '「老板记得常进这种。」'
        ];
        var SEA_BUY_COMMENTS = [
            '「这条不错，就它了。」',
            '「正好想炖汤，包一下。」',
            '「品相可以，老板会挑。」',
            '「就这条吧，多少钱？」',
            '「多买能便宜吗？……那先来一条。」',
            '「新鲜就行，给我包好。」',
            '「上次在你这买过，这次再带一条。」',
            '「家里孩子爱吃，就这条。」',
            '「老板实诚，下次还来。」',
            '「行，就它，帮我装一下。」',
            '「今晚请客，就这条撑场面了。」',
            '「我妈就爱吃这种，给她带一条。」',
            '「做刺身正好，包一下。」',
            '「看着就新鲜，信你。」',
            '「不挑了，就这条，赶时间。」',
            '「老板你这鱼养得精神，我放心。」',
            '「我家猫……不是，我吃，就这条。」',
            '「媳妇点名要的，就它了。」',
            '「炖豆腐去，这条合适。」',
            '「清蒸，这条大小刚好。」',
            '「老板包漂亮点，送人的。」',
            '「今天运气不错，碰到好的了。」',
            '「我就爱你这摊的鱼，新鲜。」',
            '「别家都看过了，还是你这儿靠谱。」',
            '「买回去发个朋友圈，哈哈。」',
            '「减肥吃鱼，就它了。」',
            '「给孩子加餐，这条没小刺吧？那就好。」',
            '「老板记得下次还进这种。」',
            '「不废话了，就这条，装。」',
            '「看着顺眼，买了。」',
            '「今天心情好，买条鱼庆祝。」',
            '「老婆给的任务，完成。」',
            '「听说这鱼补脑，买条试试。」',
            '「老板你这人实在，我信你。」',
            '「做酸菜鱼，这条够大。」',
            '「家里来客，得买条像样的。」',
            '「就这条了，别给我换啊。」',
            '「买回去显摆显摆。」',
            '「老板，下次还来你这。」',
            '「这条眼睛亮，新鲜。」',
            '「懒得挑了，就它。」',
            '「老板生意兴隆啊，我也沾沾喜气。」',
            '「今天必须吃鱼，就这条。」',
            '「网上学的菜谱，就差这条鱼了。」',
            '「老板你挑的准没错。」',
            '「送老丈人，就这条了。」',
            '「我家狗……开玩笑的，我吃。」',
            '「这条长得喜庆，买了。」',
            '「老板记得给我挑条好的啊，就信你。」',
            '「买完收工，回家做饭。」',
            '「这条肥，炖汤出味。」',
            '「老板你这摊我认准了。」',
            '「今天发工资，犒劳自己一条。」',
            '「就这条，不用袋子，我拎着走。」',
            '「老板人好，鱼也好。」',
            '「买条鱼压压惊。」',
            '「这条顺眼，缘分。」',
            '「蒸着吃，这条合适。」',
            '「老板给挑条没病的啊。」',
            '「烤鱼用，就它了。」',
            '「加班加得累，买条鱼补补。」',
            '「同事推荐你家，试试。」',
            '「这条红烧正好。」',
            '「买回去给爸妈。」',
            '「周末聚餐，就这条了。」',
            '「老板你这儿鱼种类多啊。」',
            '「先来一条吃着，好吃再来。」',
            '「这条做水煮鱼够吗？够就它。」',
            '「家里猫……咳，我吃。」',
            '「老板帮忙杀一下呗？谢了。」',
            '「就它，扫码是吧。」',
            '「今天改善伙食。」',
            '「这条煎着吃不错。」',
            '「买条小的练手。」',
            '「老板下次多进点这种。」',
            '「朋友聚会，带条鱼去。」',
            '「这条炖汤够一家人了。」',
            '「看着就有食欲，买了。」',
            '「老板称准一点啊。」',
            '「就这条，别换。」',
            '「买完去接孩子。」',
            '「这条做酸菜鱼正合适。」',
            '「老板人不错，下次还来。」',
            '「随便买条，今晚加菜。」',
            '「这条大小合适，就它。」'
        ];
        var SEA_BARGAIN_SAY = [
            '「便宜点呗。」',
            '「抹个零吧。」',
            '「老主顾了，少点。」',
            '「能打折吗？」',
            '「老板给个实惠价。」',
            '「零头去了吧。」',
            '「凑个整，我多难听。」',
            '「老板，我常来的，便宜点。」',
            '「这样吧，各让一步。」',
            '「太贵了，少点我就要。」',
            '「学生党，老板照顾照顾。」',
            '「现金付，能少点不？」',
            '「下次还来你这买，这次便宜点。」',
            '「老板你这价有点虚啊。」',
            '「我诚心要，给个诚心价。」',
            '「别家都比你便宜……」',
            '「老板你看我像大款吗？便宜点。」',
            '「打个折呗，八折行不。」',
            '「老板发发善心，少点。」',
            '「我就带这么多，你看着办。」',
            '「便宜五块，我立马要。」',
            '「老板，薄利多销嘛。」',
            '「我买两条能便宜吗？……那一条少点。」',
            '「微信转你，少收点呗。」',
            '「老板你这价我接受不了，让让。」',
            '「少十块成不？成就要。」',
            '「老板咱都实在人，让让。」',
            '「我多买一条，两条便宜点？」',
            '「老顾客了，给个面子呗。」',
            '「零头抹了呗，好算账。」',
            '「老板你这价能商量不？」',
            '「便宜点，我帮你宣传。」',
            '「就这个数，行不行？」',
            '「少一点嘛，下次还来。」',
            '「老板你看我都站半天了。」',
            '「给个会员价呗。」',
            '「凑整少点，大家都方便。」',
            '「最后一单了，便宜点收了吧。」',
            '「老板大方点，少五块。」',
            '「我介绍朋友来，这次少点。」',
            '「现金给你，少收点。」'
        ];
        var SEA_BARGAIN_AGGRESSIVE = [
            '「别家都比你便宜……」', '「老板你这价有点虚啊。」', '「我就带这么多，你看着办。」',
            '「便宜五块，我立马要。」', '「太贵了，少点我就要。」', '「老板你看我像大款吗？便宜点。」',
            '「老板发发善心，少点。」', '「学生党，老板照顾照顾。」', '「能打折吗？八折！」',
            '「不便宜不要了，走了啊。」', '「老板你这价我接受不了，让让。」', '「抹个零，再少十块。」',
            '「我诚心要，给个诚心价。」', '「现金付，能少点不？不能就算了。」', '「最后一口价，行就行不行拉倒。」',
            '「少十块，不卖我就走。」', '「老板你这价咬死不松口啊。」', '「半价行不？不行啊……那八折。」',
            '「我诚心要，你别让我白来。」', '「两条一起买，一条便宜五块。」', '「抹零再少五块，成交不？」',
            '「老板太硬了，让一步呗。」', '「就带这么多钱，你看着办。」'
        ];
        var SEA_BROWSE_PHRASES = [
            '在摊前比了比几条鱼…',
            '看了看价牌又看了看鱼…',
            '挑了一会儿…',
            '蹲下来仔细瞧了瞧…',
            '拿起一条掂了掂分量…',
            '跟老板打听了几句…',
            '翻来覆去看了好几条…',
            '对着鱼比划了一下大小…',
            '闻了闻，又看了看…',
            '指着几条问东问西…',
            '掏出手机查了查这种鱼…',
            '跟同伴商量买哪条…',
            '嘴里念叨「这条大那条小」…',
            '犹豫了半天…',
            '左看右看拿不定主意…',
            '问「这条新鲜吗」又问「那条呢」…',
            '摸了摸鱼身又看了看眼睛…',
            '「这条多少钱？那条呢？」比了半天…',
            '跟老板唠了两句才看鱼…',
            '先看价牌再看鱼，又看价牌…',
            '拿起手机对着鱼拍了张照…',
            '问老板「这鱼咋做最好吃」…',
            '翻翻这条又翻翻那条…',
            '跟身边人小声说「这条好像便宜点」…',
            '盯着价牌算了半天…',
            '戳了戳鱼身看弹性…',
            '「有没有再大点的？」问了句…',
            '翻开鳃盖看了看…',
            '拎起来对着光瞧了瞧…',
            '问「能放多久？今天不吃。」…',
            '比划了一下「够几个人吃？」…',
            '看看鱼又看看钱包…',
            '「这跟那条有啥区别？」问老板…',
            '蹲在那儿挑了半天…',
            '跟同伴说「你看这条怎么样」…',
            '掏出小本本记了记价格…',
            '闻了闻手指头「腥不腥？」…',
            '「老板这鱼哪进的？」唠上了…',
            '左挑右拣嘀咕「这条瘦那条肥」…',
            '看了看时间又继续挑…',
            '「能便宜点吗？」先试探了一句…',
            '翻完一遍又翻一遍…',
            '跟老板说「我常来的，认得我吧」…',
            '盯着鱼眼睛看了半天…',
            '「新鲜吗？昨天剩的不要。」…',
            '拎起一条掂了掂又放下…',
            '问「杀好能放多久？」…',
            '先逛了一圈再回来看这条…'
        ];
        
        /** 智能顾客：带心情与拟人化对白（silent=true 时不写 UI，用于离线） */
        function runOneSeaFishingCustomer(silent) {
            if (!player.landlord || !player.landlord.seaFishing) return 0;
            if (typeof SEA_CUSTOMER_TYPES === 'undefined' || !SEA_CUSTOMER_TYPES || !SEA_CUSTOMER_TYPES.length) return 0;
            if (typeof SEA_CUSTOMER_MOODS === 'undefined' || !SEA_CUSTOMER_MOODS || !SEA_CUSTOMER_MOODS.length) return 0;
            var sf = player.landlord.seaFishing;
            var listings = (sf.marketListings || []).slice();
            if (listings.length === 0) return 0;
            var customer = SEA_CUSTOMER_TYPES[Math.floor(Math.random() * SEA_CUSTOMER_TYPES.length)];
            var mood = SEA_CUSTOMER_MOODS[Math.floor(Math.random() * SEA_CUSTOMER_MOODS.length)];
            var maxPriceMul = customer.maxPriceMul || 1;
            var preferRarity = customer.preferRarity || 'common';
            var preferCategory = customer.preferCategory || '';
            var affordable = listings.map(function(l) {
                var basePrice = (l.fish && l.fish.basePrice) || 0;
                var maxPay = Math.max(1, Math.floor(basePrice * maxPriceMul));
                if (l.price > maxPay) return null;
                if (mood.strictMatch) {
                    if (preferCategory && (!l.fish || l.fish.category !== preferCategory)) return null;
                    if (preferRarity && l.fish && l.fish.rarity !== preferRarity) return null;
                }
                var score = 1;
                if (l.fish && l.fish.rarity === preferRarity) score += 3;
                else if (['precious','legendary','mythic','unique','ancient'].indexOf(preferRarity) >= 0 && l.fish && ['rare','precious','legendary','mythic','unique','ancient'].indexOf(l.fish.rarity) >= 0) score += 1.5;
                if (preferCategory && l.fish && l.fish.category === preferCategory) score += 2;
                if (basePrice > 0 && l.price <= basePrice * 0.9) score += 0.8;
                if (mood.id === 'rush' && score > 2) score += 0.5;
                if (mood.id === 'generous' && l.fish && l.fish.rarity !== 'trash') score += 0.6;
                return { listing: l, score: score };
            }).filter(function(x) { return x != null; });
            if (affordable.length === 0) {
                if (!silent) {
                    var logEl = document.getElementById('seaFishingCustomerLog');
                    var customerTag = customer.tag || (maxPriceMul < 0.75 ? 'cheap' : (maxPriceMul > 1.5 ? 'generous' : 'casual'));
                    var leavePool = (customerTag === 'cheap' && typeof SEA_LEAVE_CHEAP !== 'undefined' && Math.random() < 0.55) ? SEA_LEAVE_CHEAP : SEA_LEAVE_REASONS;
                    var leaveMsg = leavePool[Math.floor(Math.random() * leavePool.length)];
                    if (logEl) logEl.innerHTML = '<div style="color:#888;">' + customer.name + ' ' + leaveMsg + '</div>' + (logEl.innerHTML || '').slice(0, 1200);
                }
                return 0;
            }
            affordable.sort(function(a, b) { return b.score - a.score; });
            var top = affordable.slice(0, Math.min(5, affordable.length));
            var totalScore = top.reduce(function(s, x) { return s + x.score; }, 0);
            var r = Math.random() * totalScore;
            var chosen = top[0];
            for (var i = 0; i < top.length; i++) {
                r -= top[i].score;
                if (r <= 0) { chosen = top[i]; break; }
            }
            var listing = chosen.listing;
            var idx = sf.marketListings.indexOf(listing);
            if (idx < 0) return 0;
            var pay = listing.price;
            var didBargain = false;
            if (Math.random() < (mood.bargainChance || 0.2) && listing.fish && (listing.fish.basePrice || 0) > 0) {
                var offer = Math.max(1, Math.floor(listing.price * (0.82 + Math.random() * 0.12)));
                if (offer < pay) { pay = offer; didBargain = true; }
            }
            player.landlord.coins += pay;
            if (player.landlord.stats) player.landlord.stats.marketFishCoinsEarned = (player.landlord.stats.marketFishCoinsEarned || 0) + pay;
            sf.marketListings.splice(idx, 1);
            sf.lastMarketTime = Date.now();
            if (!silent) {
                var logEl = document.getElementById('seaFishingCustomerLog');
                if (logEl && top.length > 1 && Math.random() < 0.32) {
                    var browse = SEA_BROWSE_PHRASES[Math.floor(Math.random() * SEA_BROWSE_PHRASES.length)];
                    logEl.innerHTML = '<div style="color:#aaa;">' + customer.name + ' ' + browse + '</div>' + (logEl.innerHTML || '').slice(0, 1100);
                }
                var customerTag = customer.tag || (maxPriceMul < 0.75 ? 'cheap' : (maxPriceMul > 1.5 ? 'generous' : 'casual'));
                var bargainPool = (customerTag === 'cheap' && typeof SEA_BARGAIN_AGGRESSIVE !== 'undefined' && Math.random() < 0.55) ? SEA_BARGAIN_AGGRESSIVE : SEA_BARGAIN_SAY;
                var buyPool = (customerTag === 'generous' && typeof SEA_BUY_GENEROUS !== 'undefined' && Math.random() < 0.6) ? SEA_BUY_GENEROUS : SEA_BUY_COMMENTS;
                var comment = didBargain ? (bargainPool[Math.floor(Math.random() * bargainPool.length)] + ' 最后 ' + pay + ' 地主币成交。') : (buyPool[Math.floor(Math.random() * buyPool.length)] + ' ' + customer.name + ' 付了 ' + pay + ' 地主币。');
                if (logEl) logEl.innerHTML = '<div style="color:#2ecc71;">' + customer.name + ' 买走 ' + (listing.fish.name || '') + '。' + comment + '</div>' + (logEl.innerHTML || '').slice(0, 1200);
                if (typeof updateLandlordCoinDisplay === 'function') updateLandlordCoinDisplay();
                renderSeaFishingMarket();
                showLandlordNotification(customer.name + ' 购买了 ' + (listing.fish.name || '') + '，+' + pay + ' 地主币', 'success');
                saveGame();
            }
            return pay;
        }
        
        function tickSeaFishingCustomer() {
            if (!player.landlord || !player.landlord.seaFishing) return;
            var sf = player.landlord.seaFishing;
            var logEl = document.getElementById('seaFishingCustomerLog');
            if (!logEl) return;
            var listings = sf.marketListings || [];
            if (listings.length === 0) return;
            var now = Date.now();
            if (now - (sf.lastCustomerTime || 0) < 14000) return;
            sf.lastCustomerTime = now;
            runOneSeaFishingCustomer(false);
            if (listings.length > 3 && Math.random() < 0.22) runOneSeaFishingCustomer(false);
            if (listings.length > 5 && Math.random() < 0.08) runOneSeaFishingCustomer(false);
        }
        
        /** 离线期间模拟顾客购买（在 loadSave 中调用） */
        function processSeaFishingMarketOffline(offlineMs) {
            if (!player.landlord || !player.landlord.seaFishing) return;
            if (typeof SEA_CUSTOMER_TYPES === 'undefined' || !SEA_CUSTOMER_TYPES || !SEA_CUSTOMER_TYPES.length) return;
            if (typeof SEA_CUSTOMER_MOODS === 'undefined' || !SEA_CUSTOMER_MOODS || !SEA_CUSTOMER_MOODS.length) return;
            var sf = player.landlord.seaFishing;
            var listings = sf.marketListings || [];
            if (listings.length === 0) return;
            var interval = 12000;
            var ticks = Math.min(Math.floor(offlineMs / interval), 350);
            var totalEarned = 0;
            for (var i = 0; i < ticks && (sf.marketListings || []).length > 0; i++) {
                totalEarned += runOneSeaFishingCustomer(true);
            }
            sf.lastMarketTime = Date.now();
            if (totalEarned > 0 && typeof logAction === 'function' && typeof formatTime === 'function') {
                var fm = totalEarned >= 1e8 ? totalEarned.toExponential(2) : totalEarned.toLocaleString();
                logAction('离线期间鱼市售出：+' + fm + ' 地主币（' + formatTime(offlineMs) + '）', 'offline-reward');
            }
        }
        if (window.__pendingSeaFishingMarketOfflineMs > 0 && typeof processSeaFishingMarketOffline === 'function') {
            try {
                processSeaFishingMarketOffline(window.__pendingSeaFishingMarketOfflineMs);
            } catch (e) { console.warn('processSeaFishingMarketOffline deferred', e); }
            window.__pendingSeaFishingMarketOfflineMs = 0;
        }
        
        // 顾客逻辑不依赖当前是否在看海钓标签：只要已开启海钓就定时跑，这样切到其他子标签时顾客也会来，切回海钓即可看到最新记录（使用 registerInterval 便于页面卸载时统一清理，避免定时器泄漏）
        if (typeof registerInterval === 'function') {
            registerInterval(function() {
                if (typeof player === 'undefined' || !player.landlord || !player.landlord.seaFishing) return;
                var listings = (player.landlord.seaFishing.marketListings || []);
                if (listings.length === 0) return;
                tickSeaFishingCustomer();
            }, 5000);
        } else {
            setInterval(function() {
                if (typeof player === 'undefined' || !player.landlord || !player.landlord.seaFishing) return;
                var listings = (player.landlord.seaFishing.marketListings || []);
                if (listings.length === 0) return;
                tickSeaFishingCustomer();
            }, 5000);
        }

        // 渲染单个地块
        function renderLandlordField(fieldIndex) {
            const fieldsContainer = document.getElementById('landlordFieldsContainer');
            if (!fieldsContainer) return;
            
            const fieldDiv = fieldsContainer.children[fieldIndex];
            if (!fieldDiv) return;
            
            const plant = player.landlord.fields[fieldIndex];
             const isLocked = player.landlord.lockedFields[fieldIndex];
           if (!plant) {
        fieldDiv.className = `landlord-field empty ${player.landlord.lockedFields[fieldIndex] ? 'locked' : ''}`;
        fieldDiv.innerHTML = `
            <div class="landlord-field-header">
                <div class="landlord-field-status">空闲${player.landlord.lockedFields[fieldIndex] ? ' 🔒' : ''}</div>
                <label class="field-lock-toggle">
                    <input type="checkbox" ${player.landlord.lockedFields[fieldIndex] ? 'checked' : ''} 
                           onchange="toggleFieldLock(${fieldIndex})">
                    <span class="lock-icon">🔒</span>
                </label>
            </div>
            <div style="font-size: 3em; color: rgba(0,0,0,0.1); margin: 20px 0;">+</div>
            <button class="landlord-plant-button" onclick="selectLandlordSeedForPlanting(${fieldIndex})">种植</button>
        `;
            } else {
                const timeLeft = plant.isMature ? 0 : 
                    Math.max(0, Math.ceil(plant.growTime - (Date.now() - plant.plantedAt) / (1000 * 60)));
                
                const progress = plant.isMature ? 100 : 
                    Math.min(100, Math.floor(((Date.now() - plant.plantedAt) / (1000 * 60)) / plant.growTime * 100));
                
                // 突变标签
                let mutationTags = '';
                
                // 基础突变标签
                plant.mutations.forEach(mutation => {
                    const colorClass = getLandlordMutationColorClass(mutation);
                    mutationTags += `<span class="landlord-mutation-tag ${colorClass}">${mutation}</span>`;
                });
                
                // 天气突变标签
                plant.weatherMutations.forEach(mutation => {
                    const colorClass = getLandlordMutationColorClass(mutation);
                    mutationTags += `<span class="landlord-mutation-tag ${colorClass}">${mutation}</span>`;
                });
                
                // 特殊突变标签
                if (plant.specialMutation) {
                    const specialName = specialMutations[getLandlordSeedBaseName(plant.type)] || '特殊突变';
                    mutationTags += `<span class="landlord-mutation-tag landlord-mutation-rainbow">${specialName}</span>`;
                }
                
                fieldDiv.className = `landlord-field ${player.landlord.lockedFields[fieldIndex] ? 'locked' : ''}`;
                fieldDiv.innerHTML = `
            <div class="landlord-field-header">
                <div class="landlord-field-status">${getLandlordGeneVariantLabelHtml(plant.type)}${player.landlord.lockedFields[fieldIndex] ? ' 🔒' : ''}</div>
                <label class="field-lock-toggle">
                    <input type="checkbox" ${player.landlord.lockedFields[fieldIndex] ? 'checked' : ''} 
                           onchange="toggleFieldLock(${fieldIndex})">
                    <span class="lock-icon">🔒</span>
                </label>
            </div>
                    <div class="landlord-plant-info">
                        <div>重量: ${plant.weight.toFixed(2)}kg</div>
                        <div>${plant.isMature ? '已成熟' : `成长中... ${timeLeft}分钟`}</div>
                        ${mutationTags ? `<div class="landlord-mutations-list">${mutationTags}</div>` : ''}
                    </div>
                    <div class="landlord-field-actions">
                        <div class="landlord-action-row">
                            ${plant.isMature ? 
                                `<button class="landlord-harvest-button" onclick="harvestLandlordPlant(${fieldIndex})">收获</button>` : 
                                `<button class="landlord-action-button" style="background: #7f8c8d; color: white;" disabled>${progress}%</button>`
                            }
                            <button class="landlord-remove-button" onclick="removeLandlordPlant(${fieldIndex})">铲除</button>
                        </div>
                        <div class="landlord-action-row">
                            <button class="landlord-item-button" onclick="selectLandlordItemForUsing(${fieldIndex})">使用道具</button>
                        </div>
                    </div>
                `;
                
                // 添加生长进度条
                if (!plant.isMature) {
                    const progressBar = document.createElement('div');
                    progressBar.className = 'landlord-progress-bar';
                    progressBar.style.marginTop = '10px';
                    progressBar.innerHTML = `<div class="landlord-progress-fill" style="width: ${progress}%"></div>`;
                    fieldDiv.querySelector('.landlord-plant-info').appendChild(progressBar);
                }
            }
 if (isLocked) {
        // 为锁定的田地添加额外的装饰元素
        if (!fieldDiv.querySelector('.lock-decoration')) {
            const lockDecoration = document.createElement('div');
            lockDecoration.className = 'lock-decoration';
            lockDecoration.style.position = 'absolute';
            lockDecoration.style.top = '5px';
            lockDecoration.style.right = '5px';
            lockDecoration.style.fontSize = '0.8em';
            lockDecoration.style.color = 'rgba(212, 212, 170, 0.5)';
            lockDecoration.style.zIndex = '1';
            lockDecoration.textContent = '🔒 已锁定';
            fieldDiv.appendChild(lockDecoration);
            
            // 添加角标
            const cornerLock = document.createElement('div');
            cornerLock.className = 'corner-lock';
            cornerLock.style.position = 'absolute';
            cornerLock.style.top = '0';
            cornerLock.style.left = '0';
            cornerLock.style.width = '0';
            cornerLock.style.height = '0';
            cornerLock.style.borderTop = '20px solid #556b2f';
            cornerLock.style.borderRight = '20px solid transparent';
            cornerLock.style.zIndex = '2';
            fieldDiv.appendChild(cornerLock);
            
            const lockIcon = document.createElement('div');
            lockIcon.className = 'corner-lock-icon';
            lockIcon.style.position = 'absolute';
            lockIcon.style.top = '2px';
            lockIcon.style.left = '2px';
            lockIcon.style.color = '#d4d4aa';
            lockIcon.style.fontSize = '0.8em';
            lockIcon.style.zIndex = '3';
            lockIcon.textContent = '🔒';
            fieldDiv.appendChild(lockIcon);
        }
    }
       }

        // 启动定时器（避免每次打开界面重复创建导致定时器泄漏）
        function startLandlordTimers() {
            if (player.landlord._timerId) {
                clearInterval(player.landlord._timerId);
                player.landlord._timerId = null;
            }
            player.landlord._timerId = registerInterval(() => {
                checkLandlordPlantGrowth();
                updateLandlordSeedRefreshTimer();
                updateLandlordItemRefreshTimer();
                updateLandlordWeather();
                if (typeof landlordRanchSimulateToNow === 'function') landlordRanchSimulateToNow();
                if (typeof updateLandlordRanchPenTimers === 'function') updateLandlordRanchPenTimers();
                
                // 每60秒自动保存一次
                if (Date.now() - (player.landlord.lastSaveTime || 0) > 60000) {
                    saveGame();
                }
            }, 1000);
        }

        // 渲染所有UI
        function renderAllLandlordUI() {
            updateLandlordCoinDisplay();
            renderLandlordStore();
            renderLandlordItemStore();
            renderLandlordFields();
            renderLandlordSeedStorage();
            renderLandlordFruitStorage();
            renderLandlordItemStorage();
            updateLandlordStats();
        }

        // 显示通知
        function showLandlordNotification(message, type) {
            const notificationArea = document.getElementById('landlordNotificationArea');
            if (!notificationArea) return;
            
            const notification = document.createElement('div');
            notification.className = `landlord-notification ${type}`;
            notification.textContent = message;
            notificationArea.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }

        // 格式化数字
        function formatNumber(num) {
            return formatSci(num);
        }

        // 初始化游戏数据
        function initLandlordGameData() {
            if (!player.landlord) {
                player.landlord = {
                    coins: 10000,
                    unlockedFields: 5,
                    fields: Array(50).fill(null),
                    lockedFields: Array(50).fill(false),
                    fieldTiers: Array(50).fill(0),
                    skyVineLevel: 0,
                    skyVineProgress: 0,
                    geneTrees: {
                        '彩光': { level: 0, progress: 0 },
                        '炫彩': { level: 0, progress: 0 },
                        '琉璃': { level: 0, progress: 0 },
                        '琥珀': { level: 0, progress: 0 }
                    },
                    bars: { silver: 0, gold: 0, diamond: 0, flow: 0 },
                    seedStorage: {},
                    fruitStorage: [],
                    itemStorage: {},
                    storeItems: {},
                    itemStoreItems: {},
                    lastSeedRefreshTime: Date.now(),
                    lastItemRefreshTime: Date.now(),
                    weather: "晴朗",
                    lastWeatherChange: Date.now(),
                    stats: {
                        totalPlants: 0,
                        totalHarvests: 0,
                        totalCoinsEarned: 0,
                        marketFishCoinsEarned: 0,
                        ranchCoinsEarned: 0,
                        ranchHarvests: 0,
                        ranchVisitorArrivals: 0,
                        ranchTickleCount: 0,
                        ranchLuckyGrassCount: 0,
                        ranchRingGames: 0,
                        ranchStarSpins: 0,
                        basicMutations: 0,
                        weatherMutations: 0,
                        specialMutations: 0,
                        highestMultiplier: 1,
                        itemsUsed: 0
                    },
                    selectedFieldIndex: null,
                    lastSaveTime: Date.now(),
                    ranch: {
                        unlockedSlots: 2,
                        slots: Array(40).fill(null),
                        dexSeen: {},
                        animalInventory: {},
                        ranchProduceWarehouse: [],
                        lastLuckyGrassAt: 0,
                        lastRingAt: 0,
                        dailyFortune: {},
                        starBuffUntil: 0,
                        starBuffMult: 1,
                        visitorBuffUntil: 0,
                        visitorYieldMult: 1,
                        visitorName: '',
                        visitorIcon: ''
                    },
                    seaFishing: {
                        currentVenue: 0,
                        dexVenue: 0,
                        fishTank: [],
                        marketListings: [],
                        fishDex: {},
                        lastCustomerTime: 0,
                        fishingState: 'idle',
                        tension: 0.5,
                        tensionDir: 1,
                        struggleTimer: null,
                        biteTimer: null,
                        selectedIds: {},
                        marketSelectedIds: {},
                        rightTab: 'market'
                    }
                };
            }
            if (!player.landlord.lockedFields) {
        player.landlord.lockedFields = Array(50).fill(false);
    }
    while (player.landlord.lockedFields.length < player.landlord.unlockedFields) {
        player.landlord.lockedFields.push(false);
    }
            // 确保fields数组长度正确
            while (player.landlord.fields.length < player.landlord.unlockedFields) {
                player.landlord.fields.push(null);
            }
            
            // 确保所有必要的对象都存在
            if (!player.landlord.seedStorage) player.landlord.seedStorage = {};
            if (!player.landlord.fruitStorage) player.landlord.fruitStorage = [];
            if (!player.landlord.itemStorage) player.landlord.itemStorage = {};
            if (!player.landlord.storeItems) player.landlord.storeItems = {};
            if (!player.landlord.itemStoreItems) player.landlord.itemStoreItems = {};
            if (!player.landlord.stats) player.landlord.stats = {
                totalPlants: 0,
                totalHarvests: 0,
                totalCoinsEarned: 0,
                marketFishCoinsEarned: 0,
                ranchCoinsEarned: 0,
                ranchHarvests: 0,
                ranchVisitorArrivals: 0,
                ranchTickleCount: 0,
                ranchLuckyGrassCount: 0,
                ranchRingGames: 0,
                ranchStarSpins: 0,
                basicMutations: 0,
                weatherMutations: 0,
                specialMutations: 0,
                highestMultiplier: 1,
                itemsUsed: 0
            };
            if (player.landlord.stats.marketFishCoinsEarned == null) player.landlord.stats.marketFishCoinsEarned = 0;
            if (player.landlord.stats.ranchCoinsEarned == null) player.landlord.stats.ranchCoinsEarned = 0;
            if (player.landlord.stats.ranchHarvests == null) player.landlord.stats.ranchHarvests = 0;
            if (player.landlord.stats.ranchVisitorArrivals == null) player.landlord.stats.ranchVisitorArrivals = 0;
            if (player.landlord.stats.ranchTickleCount == null) player.landlord.stats.ranchTickleCount = 0;
            if (player.landlord.stats.ranchLuckyGrassCount == null) player.landlord.stats.ranchLuckyGrassCount = 0;
            if (player.landlord.stats.ranchRingGames == null) player.landlord.stats.ranchRingGames = 0;
            if (player.landlord.stats.ranchStarSpins == null) player.landlord.stats.ranchStarSpins = 0;
            ensureLandlordFieldTiers(player.landlord);
            ensureLandlordBars(player.landlord);
            ensureLandlordSkyVine(player.landlord);
            ensureLandlordGeneTrees(player.landlord);
            ensureLandlordRanch(player.landlord);
            for (let _fi = 0; _fi < player.landlord.unlockedFields; _fi++) {
                const _pl = player.landlord.fields[_fi];
                if (_pl) syncLandlordPlantFieldTierFromFieldIndex(_fi, _pl);
            }
            if (player.landlord.seaFishing && !Array.isArray(player.landlord.seaFishing.fishTank)) {
                player.landlord.seaFishing.fishTank = [];
            }
        }

        // 在游戏加载时初始化疯狂地主数据
        function loadLandlordGameData() {
            initLandlordGameData();
            if (player.landlord && player.landlord._timerId != null) {
                delete player.landlord._timerId;
            }
            if (!player.landlord.lockedFields || player.landlord.lockedFields.length < player.landlord.unlockedFields) {
        player.landlord.lockedFields = Array(50).fill(false);
    }
            if (!player.landlord.seaFishing) {
                player.landlord.seaFishing = {
                    currentVenue: 0,
                    dexVenue: 0,
                    fishTank: [],
                    marketListings: [],
                    fishDex: {},
                    lastCustomerTime: 0,
                    fishingState: 'idle',
                    tension: 0.5,
                    tensionDir: 1,
                    struggleTimer: null,
                    biteTimer: null,
                    selectedIds: {},
                    marketSelectedIds: {},
                    rightTab: 'market'
                };
            }
            if (!player.landlord.seaFishing.fishDex || typeof player.landlord.seaFishing.fishDex !== 'object') player.landlord.seaFishing.fishDex = {};
            if (!Array.isArray(player.landlord.seaFishing.fishTank)) player.landlord.seaFishing.fishTank = [];
            if (!Number.isFinite(Number(player.landlord.seaFishing.dexVenue))) player.landlord.seaFishing.dexVenue = parseInt(player.landlord.seaFishing.currentVenue, 10) || 0;
            if (player.landlord.seaFishing.rightTab !== 'dex' && player.landlord.seaFishing.rightTab !== 'market') player.landlord.seaFishing.rightTab = 'market';
            // 检查离线收益
            checkLandlordOfflineEarnings();
            // 在线「看摊」：加载后即启动地主定时器，这样不打开疯狂地主界面也会刷新天气、作物生长、商店
            if (player.landlord && player.battle && player.battle.maxStage >= 2 && typeof startLandlordTimers === 'function') {
                startLandlordTimers();
            }
        }
        function runPendingLandlordGameDataInit() {
            if (!window.__pendingLandlordGameDataInit) return;
            if (!window.__landlordSkyVineConstantsReady) return;
            window.__pendingLandlordGameDataInit = false;
            try {
                loadLandlordGameData();
            } catch (e) {
                window.__pendingLandlordGameDataInit = true;
                console.warn('loadLandlordGameData deferred init failed', e);
            }
        }
        runPendingLandlordGameDataInit();

        // 在游戏保存时保存疯狂地主数据
        function saveLandlordGameData() {
            if (player.landlord) {
                player.landlord.lastSaveTime = Date.now();
            }
        }

        // 修改原有的loadGame函数（地主数据已在 loadSave 末尾 loadLandlordGameData 统一初始化）
        const originalLoadGame = loadGame;
        loadGame = function(opts) {
            originalLoadGame(opts);
        };

        // 修改原有的saveGame函数，添加疯狂地主数据保存（保存前移除定时器 id 避免写入存档）
        const originalSaveGame = saveGame;
        saveGame = function(opts) {
            const landlordTimerId = player.landlord && player.landlord._timerId;
            if (player.landlord && player.landlord.hasOwnProperty('_timerId')) {
                delete player.landlord._timerId;
            }
            saveLandlordGameData();
            originalSaveGame(opts);
            if (player.landlord != null) player.landlord._timerId = landlordTimerId;
        };

        // 页面 load 时仅刷新 UI；结构初始化由 loadSave/loadLandlordGameData 负责，避免在读档前写入默认地主数据
        window.addEventListener('load', function() {
            var _lu = document.getElementById('landlordUI');
            if (_lu && _lu.style.display !== 'none' && _lu.style.display !== '') {
                if (typeof initLandlordGame === 'function') initLandlordGame();
            }
        });

        // 添加测试数据函数（仅无任意本地/账号存档时注入，勿用 legacy goldGameSave 判断以免登录账号后误覆盖）
        function addTestLandlordData() {
            var hasSave = false;
            try {
                if (typeof window.readGoldGameSaveRawFromStorage === 'function') {
                    hasSave = !!window.readGoldGameSaveRawFromStorage();
                } else {
                    hasSave = !!localStorage.getItem('goldGameSave');
                }
            } catch (e) {}
            if (hasSave) return;
            if (!player.landlord) return;
            player.landlord.coins = 10000;
            player.landlord.seedStorage = {
                "土豆": 5,
                "牵牛花": 3,
                "黄瓜": 2
            };
            player.landlord.itemStorage = {
                "普通浇水器": 2
            };
            if (typeof refreshLandlordStore === 'function') refreshLandlordStore();
            if (typeof refreshLandlordItemStore === 'function') refreshLandlordItemStore();
        }

        // 添加一些辅助函数
        function getLandlordMutationColor(mutation) {
            const colorMap = {
                "银": "#c0c0c0",
                "金": "#ffd700", 
                "水晶": "#a7d8de",
                "流光": "#ff6b6b",
                "潮湿": "#87ceeb",
                "颤栗": "#d8bfd8",
                "生机": "#90ee90",
                "覆雪": "#f0f8ff",
                "迷雾": "#d3d3d3",
                "灼热": "#ff4500",
                "沙尘": "#f4a460",
                "结霜": "#b0e0e6",
                "落雷": "#9370db",
                "荧光": "#adff2f",
                "彩虹": "linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0099ff, #6600ff)",
                "星环": "#8a2be2",
                "瓷化": "#f5f5dc",
                "亮晶晶": "#e6e6fa",
                "红月": "#dc143c",
                "霓虹": "linear-gradient(45deg, #ff00ff, #00ffff, #ffff00)"
            };
            
            return colorMap[mutation] || "#bdc3c7";
        }

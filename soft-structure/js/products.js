// 軟構造 Soft Structure - Products Database
// 72 products across 4 themes and 3 spaces

const THEMES = {
  khaki: { name: '寂靜的卡其色', color: '#B6A696', label: 'Warm Minimalism' },
  red: { name: '紅色的中國元素', color: '#352123', label: 'Modern Oriental' },
  blue: { name: '藍色的海邊別墅', color: '#1F2A33', label: 'Coastal Serenity' },
  green: { name: '綠色森林裡的寧靜別墅', color: '#263328', label: 'Forest Cabin Retreat' }
};

const SPACES = {
  living: { name: '客廳空間', label: 'LIVING AREA' },
  bedroom: { name: '臥室空間', label: 'BEDROOM' },
  kitchen: { name: '餐廚空間', label: 'KITCHEN & DINING' }
};

const MATERIALS = {
  khaki: ['水洗粗亞麻', '未經打磨的生陶', '素色紙纖', '保留木節的老橡木', '霧面石泥', '粗織棉麻'],
  red: ['暗紅漆木', '手工紅釉陶', '帶有歲月痕跡的深色原木', '紫砂素燒', '暗紅色天然大理石', '古銅與實木'],
  blue: ['冷灰藍色岩板', '厚磅亞麻', '海風侵蝕感的漂流木', '手工吹製霧玻璃', '低彩度藍色釉面', '深邃藍調鐵件'],
  green: ['墨綠色天然蛇紋石', '深色胡桃木', '墨綠粗陶', '苔綠色手工亞麻', '深綠色霧面玻璃', '手工植鞣草木染']
};

const TYPES = {
  living: ['落地燈', '不規則手工地毯', '大尺寸陶製器皿', '無接縫沙發墊', '實木茶几邊桌', '手工屏風'],
  bedroom: ['床頭低光源吊燈', '水洗床單組', '天然擴香石座', '實木床邊几', '粗針織披毯', '霧面首飾盤'],
  kitchen: ['不規則邊緣陶盤組', '實木刀具收納座', '天然石材餐墊', '手工燒製杯具', '黃銅調味罐', '厚磅桌巾']
};

window.productsDb = [];
let idCounter = 1;

Object.keys(THEMES).forEach(themeKey => {
  Object.keys(SPACES).forEach(spaceKey => {
    for (let i = 0; i < 6; i++) {
      const mat = MATERIALS[themeKey][i % MATERIALS[themeKey].length];
      const type = TYPES[spaceKey][i];
      const name = `${mat}${type}`;
      const price = Math.floor(Math.random() * 60 + 30) * 100; // NT$ 3,000 to 9,000

      productsDb.push({
        id: `prod_${themeKey}_${spaceKey}_${idCounter++}`,
        theme: themeKey,
        space: spaceKey,
        name: name,
        price: price,
        desc: `以建築師的視角切入日常，這款${type}刻意保留了${mat}最原始的觸感與重量。不做過多的打磨與雕飾，讓材質在不同的光線下展現自然的陰影層次。這不只是一件家飾，而是定格空間氣質的介質。完全遵循加減設計的減法美學，讓物件退居次位，成就空間的安寧。`,
        image: `assets/images/placeholder_${themeKey}.jpg`
      });
    }
  });
});

function getProducts(theme, space) {
  return productsDb.filter(p => p.theme === theme && p.space === space);
}

function getProductById(id) {
  return productsDb.find(p => p.id === id);
}

// Ensure dummy placeholder images exists logically by falling back
// In reality, these will be replaced by AI generated images

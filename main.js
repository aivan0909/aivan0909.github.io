const defaultCases = [
  {
    title: "範本: 咖啡愛好者 (Energy)",
    en: "POV camera angle of a hand holding a clear small medicine capsule labeled 'Energy' with coffee beans inside, opening the capsule and pouring its contents into a cup of hot water, a home kitchen, warm kitchen lighting, hyper-realistic, photorealistic, Unreal Engine 5 render, 8k resolution, cinematic composition. --ar 1:1",
    zh: "咖啡愛好者：第一人稱視角，手持寫著 'Energy' 的透明膠囊，露出咖啡豆。將內容物倒入熱水中，瞬間變成完美的焦糖瑪奇朵。居家廚房背景。"
  },
  {
    title: "範本: 雨中幼貓 (極致寫實)",
    en: "A macro photograph of adorable fluffy White baby cat, with bright orange beak and black eyes, wearing a clear transparent plastic raincoat with white trim and buttons, tiny clear rubber boots on its feet, standing on wet dark asphalt pavement, during heavy rain, rain streaks visible, hyper-realistic, photorealistic, Unreal Engine 5 render, 8k resolution, cinematic composition. --ar 1:1",
    zh: "極致寫實範本：微距拍攝一隻毛茸茸的白色幼貓，穿著透明雨衣和雨靴，站在潮濕的柏油路上。特寫、淺景深、8K畫質、UE5渲染。"
  },
  {
    title: "Case 1: 旅館美模 - 寫實人像",
    en: "A medium shot of young Korean woman in a light blue dress, pulling a yellow suitcase, warm smile, stylish modern hotel lobby, soft sunlight streaming through window, photorealistic style, pastel tones, relaxed vacation mood. --ar 1:1",
    zh: "寫實人像：年輕韓國女性身穿水藍色連身裙，拉著黃色行李箱。場景在現代旅館大廳，柔和窗光，日系雜誌感，放鬆度假氛圍。"
  },
  {
    title: "Case 2: 品牌 Logo - 美式燒烤",
    en: "BBQ-style logo with text 'HUN' in bold Calibri sans-serif font, horizontal layout, red flame element surrounding the word, hamburger integrated into the U letter, solid background, yellow and red color scheme, flat graphic design, bold hot and delicious mood. --ar 1:1",
    zh: "美式 Logo：'HUN' 粗體無襯線字體，紅色火焰包圍，U字母融入漢堡圖案。黃紅色系，平面化設計風格。"
  },
  {
    title: "Case 8: 3D 爆炸圖 - 機械解構",
    en: "A wide-angle 3D cross-sectional design to depict mechanical parts, meticulously depicting internal structure, disassembled and arranged in sequence, clear English labels indicating structure, high fidelity, technologically advanced analytical diagram. --ar 16:9",
    zh: "3D 爆炸圖：機械零件內部結構剖面圖，有序拆解排列，附帶清晰英文標籤，專業視覺邏輯。"
  }
];

let customCases = JSON.parse(localStorage.getItem('my_prompts') || '[]');
let cases = [...defaultCases, ...customCases];

const lockedFields = new Set();

const dict = {
  "adorable fluffy White baby cat": "可愛白色幼貓", "male": "男性", "female": "女性", "child": "小孩", "baby": "嬰兒",
  "macro photograph": "微距攝影", "POV camera angle": "第一人稱視角", "close-up portrait": "特寫肖像",
  "Taiwan": "在台灣", "Japan": "在日本", "USA": "在美國", "Europe": "在歐洲",
  "heavy rain, rain streaks visible": "暴雨且有雨絲", "warm sunlight": "溫暖陽光", "peaceful snowy": "寧靜雪景",
  "hyper-realistic, photorealistic, Unreal Engine 5 render": "超寫實 UE5 渲染",
  "Cyberpunk style, neon aesthetic": "賽博龐克霓虹",
  "Anime illustration style, clean lines": "乾淨動漫插畫",
  "Ukiyo-e traditional Japanese art": "日本傳統浮世繪"
};

const translate = (text) => dict[text] || text;

const renderCases = () => {
  const list = document.getElementById('caseList');
  list.innerHTML = '';
  cases.forEach((c, index) => {
    const el = document.createElement('div');
    el.className = 'case-item';
    if (index >= defaultCases.length) el.classList.add('custom-case');
    el.innerHTML = `<div class="case-title">${c.title}</div><div class="case-desc">${c.zh.substring(0, 30)}...</div>`;
    el.onclick = () => {
      document.querySelectorAll('.case-item').forEach(i => i.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('promptResultEn').textContent = c.en;
      document.getElementById('promptResultZh').textContent = c.zh;
    };
    list.appendChild(el);
  });
};

const generate = () => {
  const sb = document.getElementById('f_subject').value;
  const w = document.getElementById('f_weather').value;
  const l = document.getElementById('f_location').value;
  const i = document.getElementById('f_item').value;
  const v = document.getElementById('f_view').value;
  const st = document.getElementById('f_style').value;

  const enPrompt = `A ${v} of ${sb}, ${i !== 'none' ? i + ', ' : ''}standing in ${l}, with ${w}, ${st}, 8k resolution, cinematic composition. --ar 1:1`;
  const zhPrompt = `${translate(v)}視角：${translate(sb)}，${i !== 'none' ? translate(i) + '，' : ''}位於${translate(l)}，環境為${translate(w)}。風格為${translate(st)}。`;

  document.getElementById('promptResultEn').textContent = enPrompt;
  document.getElementById('promptResultZh').textContent = zhPrompt;
};

const setup = () => {
  renderCases();

  document.querySelectorAll('.lock-btn').forEach(btn => {
    btn.onclick = () => {
      const fieldId = btn.dataset.lock;
      if (lockedFields.has(fieldId)) {
        lockedFields.delete(fieldId);
        btn.classList.remove('active'); btn.textContent = "🔓 鎖定";
      } else {
        lockedFields.add(fieldId);
        btn.classList.add('active'); btn.textContent = "🔒 已鎖定";
      }
    };
  });

  document.getElementById('generateBtn').onclick = generate;
  document.getElementById('randomBtn').onclick = () => {
    ['f_subject', 'f_weather', 'f_location', 'f_item', 'f_view', 'f_style'].forEach(id => {
      if (!lockedFields.has(id)) {
        const sel = document.getElementById(id);
        sel.selectedIndex = Math.floor(Math.random() * sel.options.length);
      }
    });
    generate();
  };

  document.getElementById('saveTemplateBtn').onclick = () => {
    const en = document.getElementById('promptResultEn').textContent;
    const zh = document.getElementById('promptResultZh').textContent;
    const title = prompt("請輸入範本名稱：", "我的個人範本");
    if (title) {
      const nc = { title, en, zh };
      customCases.unshift(nc);
      localStorage.setItem('my_prompts', JSON.stringify(customCases));
      cases = [...defaultCases, ...customCases];
      renderCases();
    }
  };

  const fileInput = document.getElementById('fileInput');
  const imgPreview = document.getElementById('imgPreview');
  const uploadLabel = document.getElementById('uploadLabel');

  document.getElementById('dropZone').onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        imgPreview.src = re.target.result;
        imgPreview.style.display = 'block'; uploadLabel.style.display = 'none';
        document.getElementById('analysisModal').style.display = 'flex';
        document.getElementById('analyzedPrompt').value = "A hyper-realistic photograph analyzed from image, photorealistic style, professional lighting, 8k resolution.";
      };
      reader.readAsDataURL(file);
    }
  };

  document.getElementById('applyAnalysisBtn').onclick = () => {
    const analyzed = document.getElementById('analyzedPrompt').value;
    document.getElementById('promptResultEn').textContent = analyzed;
    document.getElementById('promptResultZh').textContent = "圖片分析範本：(已自動保存至範本清單)";
    const nc = { title: "分析範本: " + new Date().toLocaleTimeString(), en: analyzed, zh: "基於圖片分析。" };
    customCases.unshift(nc);
    localStorage.setItem('my_prompts', JSON.stringify(customCases));
    cases = [...defaultCases, ...customCases];
    renderCases();
    document.getElementById('analysisModal').style.display = 'none';
  };

  const copy = (id, sId) => {
    navigator.clipboard.writeText(document.getElementById(id).textContent).then(() => {
      const s = document.getElementById(sId);
      const old = s.textContent; s.textContent = "✅ 已複製";
      setTimeout(() => s.textContent = old, 2000);
    });
  };
  document.getElementById('promptResultEn').onclick = () => copy('promptResultEn', 'copyStatusEn');
  document.getElementById('promptResultZh').onclick = () => copy('promptResultZh', 'copyStatusZh');

  window.closeModal = () => document.getElementById('analysisModal').style.display = 'none';
  generate();
};

setup();

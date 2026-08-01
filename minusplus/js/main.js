/* Minusplus 加減設計 — site behaviour
   No frameworks, no localStorage/sessionStorage — everything runs in memory
   for the lifetime of the page view, per project constraints. */

(function () {
  "use strict";

  var BASE = "assets/portfolio/";

  /* ---------- nav ---------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      toggle.textContent = links.classList.contains("open") ? "✕" : "☰";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.textContent = "☰";
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- footer year ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

    /* ---------- project english titles ---------- */
  var EN_TITLES = {
    "minusplus-studio": "MINUSPLUS STUDIO",
    "tai-yu-gong-fang": "TAIYU STUDIO",
    "wen-sha-bao": "WINDSOR CASTLE",
    "ai-mei-cheng-pin": "AIMEI CHENGPIN",
    "yu-zhi-yuan": "THE SILENT HOUSE",
    "zui-shang-shi": "STONE MONOLITH",
    "guo-yan": "URBAN SANCTUARY",
    "shi-shang-di-bao": "MODERN DYNASTY",
    "sen-qing-dao": "FOREST PATH",
    "chun-fu-tian-yu": "SPRING HAVEN",
    "xin-min-quan": "MINIMALIST ABODE",
    "mei-shu-bai-tian-e": "ARTISAN SWAN",
    "xin-yue-wan-8f": "LUNAR BAY VIII",
    "xin-yue-wan-7f": "LUNAR BAY VII",
    "zun-yi-pu-zhen": "PURE ESSENCE",
    "chun-fu-tian-shi": "CELESTIAL DRIVE",
    "tai-jun-jian-she": "CORPORATE TOWER",
    "ci-yi-men-shi": "PORCELAIN BOUTIQUE",
    "chun-jing-shi-shang-fa": "PURE SALON",
    "zhong-yi-zhen-suo": "HOLISTIC CLINIC",
    "du-hui-zhan": "METRO BLOSSOM"
  };

  /* ---------- portfolio card markup ---------- */
  function projectCard(p, index) {
    var img = p.cover ? BASE + p.slug + "/" + p.cover : "";
    var loc = p.location ? p.location : "TAIWAN";
    var enTitle = EN_TITLES[p.slug] || "PROJECT GALLERY";
    
    // Keep original ratio for all images so nothing is cropped
    var ratioScript = "this.parentElement.style.aspectRatio = this.naturalWidth + '/' + this.naturalHeight;";
    
    return (
      '<a class="magazine-card reveal" href="project.html?p=' + p.slug + '" data-type="' + p.type + '">' +
      (img ? '<img src="' + img + '" alt="' + p.name + ' 室內設計案例" loading="lazy" class="mc-bg" onload="' + ratioScript + '">' : '') +
      '<div class="mc-overlay"></div>' +
      '<div class="mc-grid">' +
        
        '<div class="mc-col mc-col-main">' +
          '<div class="mc-row mc-row-top">' +
            '<div class="mc-cell"><span>LOCATION</span><br>' + loc + '</div>' +
            '<div class="mc-cell"><span>TYPE</span><br>' + (p.typeLabel || p.type || "空間") + '</div>' +
            '<div class="mc-cell"><span>SCALE</span><br>' + (p.scale || "—") + '</div>' +
            ((p.houseType || p.propertyAttr || p.occupants) ? 
              '<div class="mc-cell"><span>INFO</span><br>' + [p.houseType, p.propertyAttr, p.occupants].filter(Boolean).join(' · ') + '</div>' : 
              '<div class="mc-cell"><span>INFO</span><br>—</div>') +
          '</div>' +
          '<div class="mc-row mc-row-mid"></div>' +
          '<div class="mc-row mc-row-bottom">' +
             '<div class="mc-cell mc-cell-huge">' +
               '<div class="zh-name">' + p.name + '</div>' +
               '<div class="en-desc">' + enTitle + '</div>' +
             '</div>' +
             '<div class="mc-cell mc-cell-arrow">EXPLORE PROJECT →</div>' +
          '</div>' +
        '</div>' +
        
      '</div>' +
      '</a>'
    );
  }

  /* ---------- home page: featured grid ---------- */
  function initFeatured() {
    var el = document.getElementById("featuredGrid");
    if (!el || typeof PORTFOLIO === "undefined") return;
    var picks = PORTFOLIO.filter(function (p) { return p.images && p.images.length && !p.isPrivate; }).slice(0, 5);
    el.innerHTML = picks.map(projectCard).join("");
  }

  /* ---------- portfolio page: full grid + filters ---------- */
  function initPortfolioGrid() {
    var grid = document.getElementById("portfolioGrid");
    if (!grid || typeof PORTFOLIO === "undefined") return;

    var types = [];
    PORTFOLIO.forEach(function (p) {
      if (p.type && types.indexOf(p.type) === -1) types.push(p.type);
    });

    var filterBar = document.getElementById("filterBar");
    if (filterBar) {
      var html = '<button class="filter-btn active" data-filter="all">全部作品</button>';
      types.forEach(function (t) {
        html += '<button class="filter-btn" data-filter="' + t + '">' + t + '</button>';
      });
      filterBar.innerHTML = html;
    }

    function render(filter) {
      var list = PORTFOLIO.filter(function (p) { return p.images && !p.isPrivate; });
      if (filter && filter !== "all") list = list.filter(function (p) { return p.type === filter; });
      grid.innerHTML = list.map(projectCard).join("");
      initReveal();
    }

    render("all");

    if (filterBar) {
      filterBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter-btn");
        if (!btn) return;
        filterBar.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        render(btn.getAttribute("data-filter"));
      });
    }
  }

  function conceptText(p) {
    if (p.concept) return p.concept;
    var loc = p.location ? p.location + "的" : "";
    var scale = p.scale ? "（" + p.scale + "）" : "";
    var typeLabel = p.typeLabel || p.type || "空間";
    return (
      "本案為" + loc + typeLabel + scale + "。設計從「加法」與「減法」的張力出發：" +
      "以材質的疊加賦予空間溫度與敘事層次，再以量體、線條與陰影的收斂還原純粹，" +
      "讓光線、比例與留白共同定義居住的節奏。"
    );
  }

  /* ---------- VERSION B: Concept Presentation ---------- */
  function initProjectDetailVersionB(root, project, galleryImgs) {
    var metaBits = [];
    if (project.location) metaBits.push('<span><b>地點</b>' + project.location + '</span>');
    metaBits.push('<span><b>空間類型</b>' + (project.typeLabel || project.type || "—") + '</span>');
    if (project.houseType) metaBits.push('<span><b>案類型</b>' + project.houseType + '</span>');
    if (project.propertyAttr) metaBits.push('<span><b>案屬性</b>' + project.propertyAttr + '</span>');
    if (project.occupants) metaBits.push('<span><b>居住人數</b>' + project.occupants + '</span>');
    if (project.scale) metaBits.push('<span><b>空間規模</b>' + project.scale + '</span>');

    var heroImg = project.cover ? BASE + project.slug + "/" + project.cover : "";

    var heroHtml =
      '<section class="project-hero">' +
      (heroImg ? '<img src="' + heroImg + '" alt="' + project.name + '">' : '') +
      '<div class="wrap content">' +
      '<a class="breadcrumb" href="portfolio.html">← 返回作品集</a>' +
      '<h1>' + project.name + '</h1>' +
      '<div class="project-meta">' + metaBits.join("") + '</div>' +
      '</div>' +
      '</section>';

    var featuresHtml = '';
    if (project.features && project.features.length) {
      featuresHtml = '<div style="margin-top:28px; display:flex; flex-wrap:wrap; gap:12px;">' +
        project.features.map(function(f) {
          return '<span style="background:rgba(201,156,134,0.15); border:1px solid rgba(201,156,134,0.35); color:#C99C86; padding:8px 16px; border-radius:20px; font-size:13.5px; font-weight:500;">✦ ' + f + '</span>';
        }).join('') +
        '</div>';
    }

    var floorplansList = project.floorplans || [];
    var floorplanHtml = ''; // Squeezed completely into right-side presentation, nothing rendered below

    var swatchesHtml =
      '<div class="swatches-row" style="display:flex; gap:16px; margin-top:20px; justify-content:center;">' +
      '<div class="swatch" style="width:50px; height:50px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); background:' + (project.colors && project.colors[0] ? project.colors[0] : '#C99C86') + '; position:relative;"><span class="swatch-label" style="font-family:var(--f-utility); font-size:9px; position:absolute; bottom:4px; left:4px; color:rgba(255,255,255,0.7); background:rgba(0,0,0,0.4); padding:2px 4px; border-radius:2px;">主色</span></div>' +
      '<div class="swatch" style="width:50px; height:50px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); background:' + (project.colors && project.colors[1] ? project.colors[1] : '#DDD7CC') + '; position:relative;"><span class="swatch-label" style="font-family:var(--f-utility); font-size:9px; position:absolute; bottom:4px; left:4px; color:rgba(255,255,255,0.7); background:rgba(0,0,0,0.4); padding:2px 4px; border-radius:2px;">輔色</span></div>' +
      '<div class="swatch" style="width:50px; height:50px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); background:' + (project.colors && project.colors[2] ? project.colors[2] : '#6B6459') + '; position:relative;"><span class="swatch-label" style="font-family:var(--f-utility); font-size:9px; position:absolute; bottom:4px; left:4px; color:rgba(255,255,255,0.7); background:rgba(0,0,0,0.4); padding:2px 4px; border-radius:2px;">深色</span></div>' +
      '<div class="swatch" style="width:50px; height:50px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); background:' + (project.colors && project.colors[3] ? project.colors[3] : '#E6E2DB') + '; position:relative;"><span class="swatch-label" style="font-family:var(--f-utility); font-size:9px; position:absolute; bottom:4px; left:4px; color:rgba(255,255,255,0.7); background:rgba(0,0,0,0.4); padding:2px 4px; border-radius:2px;">淺色</span></div>' +
      '</div>';

    var floorTabsHtml = '';
    if (floorplansList.length > 1) {
      floorTabsHtml = '<div class="floor-tabs" style="display:flex; justify-content:center; gap:8px; margin-bottom:12px; flex-wrap:wrap;">' +
        floorplansList.map(function(fp, idx) {
          // Attempt to extract floor label from filename or default to Floor X
          var label = 'Floor ' + (idx + 1);
          if (fp.indexOf('_1') !== -1 || fp.indexOf('-1') !== -1) label = '1F';
          if (fp.indexOf('_2') !== -1 || fp.indexOf('-2') !== -1) label = '2F';
          if (fp.indexOf('_3') !== -1 || fp.indexOf('-3') !== -1) label = '3F';
          if (fp.indexOf('_4') !== -1 || fp.indexOf('-4') !== -1) label = '4F';
          if (fp.indexOf('raw') !== -1) label = 'CAD';
          return '<button class="floor-tab-btn' + (idx === 0 ? ' active' : '') + '" data-idx="' + idx + '" style="padding:6px 12px; font-family:var(--f-utility); font-size:11px; letter-spacing:0.1em; text-transform:uppercase; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.2); color:#FFF; border-radius:4px; cursor:pointer; transition:all 0.2s ease;">' + label + '</button>';
        }).join('') +
        '</div>';
    }

    var defaultPlan = floorplansList.length > 0 ? floorplansList[0] : 'floorplan.jpg';

    var conceptPresentationHtml =
      '<section class="concept-presentation">' +
      '<div class="wrap">' +
      '<div class="concept-presentation-grid" style="display:grid; grid-template-columns:1fr 1.2fr; gap:var(--s6); align-items:center;">' +
      
      // Left side: Visual (floorplans list slideshow + swatches)
      '<div class="concept-visual" style="display:flex; flex-direction:column; gap:16px;">' +
      floorTabsHtml +
      '<div class="floorplan-container" style="background:transparent; padding:20px; aspect-ratio:4/3; display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative;">' +
      floorplansList.map(function(fp, idx) {
        var fpUrl = BASE + project.slug + '/' + fp;
        var isPng = fp.toLowerCase().indexOf('.png') !== -1;
        var imgStyle = 'max-width:100%; max-height:100%; object-fit:contain; transition:opacity 0.3s ease; position:absolute; opacity:' + (idx === 0 ? '1' : '0') + '; z-index:' + (idx === 0 ? '2' : '1') + ';';
        if (!isPng) {
          imgStyle += ' mix-blend-mode:multiply;';
        }
        return '<img class="floorplan-img" data-idx="' + idx + '" src="' + fpUrl + '" alt="' + project.name + ' 平面圖" style="' + imgStyle + '">';
      }).join('') +
      (floorplansList.length === 0 ? '<img class="floorplan-img" data-idx="0" src="' + BASE + project.slug + '/floorplan.jpg" alt="' + project.name + ' 平面圖" style="max-width:100%; max-height:100%; object-fit:contain; mix-blend-mode:multiply; transition:opacity 0.3s ease; position:absolute; opacity:1; z-index:2;" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'block\';">' + '<div style="color:#5C594F; text-align:center; display:none;"><p style="font-family:var(--f-serif-tc); font-size:15px; margin:0;">平面配置圖</p><p style="font-family:var(--f-utility); font-size:11px; margin:4px 0 0 0; opacity:0.6;">手繪平面配置圖準備中</p></div>' : '') +
      '</div>' +
      swatchesHtml +
      '</div>' +
      
      // Right side: Text details (project name + specification grid + concept + features)
      '<div class="concept-content" style="padding:0;">' +
      '<span class="eyebrow">Case Study —</span>' +
      '<h2 style="font-size:clamp(28px, 4vw, 38px); font-family:var(--f-serif-tc); font-weight:900; margin-bottom:6px; color:#FFF; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">' + project.name + '</h2>' +
      '<h3 style="font-family:var(--f-utility); font-size:13.5px; color:var(--orange); font-weight:500; letter-spacing:0.12em; margin-bottom:24px; text-transform:uppercase;">' + (EN_TITLES[project.slug] || "") + '</h3>' +
      
      // Structured metadata spec grid
      '<div class="project-spec-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px 24px; border-top:1px solid rgba(255,255,255,0.1); border-bottom:1px solid rgba(255,255,255,0.1); padding:18px 0; margin-bottom:24px; font-size:13.5px; color:#C7CCC3;">' +
      (project.location ? '<div><b style="color:#FFF; display:block; margin-bottom:4px; font-size:11px; text-transform:uppercase; letter-spacing:0.05em;">地點 / Location</b>' + project.location + '</div>' : '') +
      '<div><b style="color:#FFF; display:block; margin-bottom:4px; font-size:11px; text-transform:uppercase; letter-spacing:0.05em;">空間類型 / Type</b>' + (project.typeLabel || project.type || "—") + '</div>' +
      (project.houseType ? '<div><b style="color:#FFF; display:block; margin-bottom:4px; font-size:11px; text-transform:uppercase; letter-spacing:0.05em;">建築類型 / Structure</b>' + project.houseType + '</div>' : '') +
      (project.propertyAttr ? '<div><b style="color:#FFF; display:block; margin-bottom:4px; font-size:11px; text-transform:uppercase; letter-spacing:0.05em;">屋況屬性 / Condition</b>' + project.propertyAttr + '</div>' : '') +
      (project.occupants ? '<div><b style="color:#FFF; display:block; margin-bottom:4px; font-size:11px; text-transform:uppercase; letter-spacing:0.05em;">居住人數 / Occupants</b>' + project.occupants + '</div>' : '') +
      (project.scale ? '<div><b style="color:#FFF; display:block; margin-bottom:4px; font-size:11px; text-transform:uppercase; letter-spacing:0.05em;">空間規模 / Scale</b>' + project.scale + '</div>' : '') +
      '</div>' +
      
      '<span class="eyebrow" style="margin-bottom:10px;">Design Philosophy —</span>' +
      '<p style="font-size:16px; line-height:2.05; color:#DDD7CC; margin-bottom:24px;">' + conceptText(project) + '</p>' +
      featuresHtml +
      '</div>' +
      
      '</div>' +
      '</div>' +
      '</section>';

    // Set up floor switcher interactivity
    setTimeout(function() {
      var container = document.getElementById("projectDetail");
      if (!container) return;
      var tabs = container.querySelectorAll(".floor-tab-btn");
      var imgs = container.querySelectorAll(".floorplan-img");
      tabs.forEach(function(tab) {
        tab.addEventListener("click", function() {
          var targetIdx = parseInt(this.getAttribute("data-idx"), 10);
          tabs.forEach(function(t) { t.classList.remove("active"); t.style.background = "rgba(0,0,0,0.2)"; t.style.borderColor = "rgba(255,255,255,0.2)"; });
          this.classList.add("active");
          this.style.background = "#C99C86";
          this.style.borderColor = "#C99C86";
          imgs.forEach(function(img) {
            var imgIdx = parseInt(img.getAttribute("data-idx"), 10);
            if (imgIdx === targetIdx) {
              img.style.opacity = "1";
              img.style.zIndex = "2";
            } else {
              img.style.opacity = "0";
              img.style.zIndex = "1";
            }
          });
        });
      });
      // Initial tab style
      var activeTab = container.querySelector(".floor-tab-btn.active");
      if (activeTab) {
        activeTab.style.background = "#C99C86";
        activeTab.style.borderColor = "#C99C86";
      }
    }, 100);

    var fullGalleryHtml = galleryImgs.length ? 
      '<section class="full-gallery-section" style="background:var(--paper); padding:var(--s6) 0"><div class="wrap">' +
      '<div style="display:flex; flex-direction:column; gap:var(--s5);" id="galleryGrid">' +
      galleryImgs.map(function (src, i) {
        return '<figure data-idx="' + i + '" style="margin:0"><img src="' + src + '" alt="' + project.name + ' 空間實景 ' + (i + 1) + '" loading="lazy" style="width:100%; height:auto; display:block; border-radius:4px; cursor:zoom-in;"></figure>';
      }).join("") +
      '</div></div></section>' : '';

    var ctaHtml =
      '<section class="section-navy"><div class="wrap-narrow center">' +
      '<span class="eyebrow on-dark">Start A Project</span>' +
      '<h2>想為自己的空間，定格這樣的詩意？</h2>' +
      '<p class="lead" style="color:#DEE2D8;margin:0 auto var(--s4)">無論是全案私宅設計、商業空間規劃，或僅是軟裝陳設的諮詢，歡迎預約一次面對面的討論。</p>' +
      '<a class="btn btn-outline on-dark" href="contact.html#booking">預約諮詢 →</a>' +
      '</div></section>';

    root.innerHTML = heroHtml + conceptPresentationHtml + floorplanHtml + fullGalleryHtml + ctaHtml;
    initLightbox(galleryImgs, project.name);
    initReveal();
  }

  /* ---------- project detail page ---------- */
  function initProjectDetail() {
    var root = document.getElementById("projectDetail");
    if (!root || typeof PORTFOLIO === "undefined") return;

    var params = new URLSearchParams(window.location.search);
    var slug = params.get("p");
    var project = PORTFOLIO.filter(function (p) { return p.slug === slug; })[0];

    if (!project) {
      root.innerHTML =
        '<div class="wrap" style="padding:80px 0"><p class="lead">找不到這個作品案例。</p>' +
        '<p style="margin-top:20px"><a class="btn btn-primary" href="portfolio.html">返回作品集</a></p></div>';
      document.title = "找不到此作品 — Minusplus 加減設計";
      return;
    }

    document.title = project.name + " — 作品集 — Minusplus 加減設計";

    var galleryImgs = project.images.map(function (fn, i) {
      return BASE + project.slug + "/" + fn;
    });

    /* 根據項目的 layoutVersion 選擇要使用的版本 */
    if (project.layoutVersion === "B") {
      root.classList.add("version-b");
      initProjectDetailVersionB(root, project, galleryImgs);
    } else {
      /* VERSION A: 默認簡潔展示型 */
      var heroImg = project.cover ? BASE + project.slug + "/" + project.cover : "";
      var metaBits = [];
      if (project.location) metaBits.push('<span><b>地點</b>' + project.location + '</span>');
      metaBits.push('<span><b>類型</b>' + (project.typeLabel || project.type || "—") + '</span>');
      if (project.scale) metaBits.push('<span><b>規模</b>' + project.scale + '</span>');

      var heroHtml =
        '<section class="project-hero">' +
        (heroImg ? '<img src="' + heroImg + '" alt="' + project.name + '">' : '') +
        '<div class="wrap content">' +
        '<a class="breadcrumb" href="portfolio.html">← 返回作品集</a>' +
        (project.isRendering ? '<span class="eyebrow on-dark" style="margin:0 0 10px;display:block">設計提案 · 3D 效果圖 Concept Rendering</span>' : '<span class="eyebrow on-dark" style="margin:0 0 10px;display:block">Case Study</span>') +
        '<h1>' + project.name + '</h1>' +
        '<div class="project-meta">' + metaBits.join("") + '</div>' +
        '</div>' +
        '</section>';

      var conceptHtml =
        '<section class="concept-section"><div class="wrap"><div class="concept-grid">' +
        '<div class="concept-ring"></div>' +
        '<div class="concept-body">' +
        '<span class="eyebrow on-dark">Concept —</span>' +
        '<h2>設計概念</h2>' +
        '<p>' + conceptText(project) + '</p>' +
        '</div></div></div></section>';

      var panoramaImg = galleryImgs[0];
      var detailImgs = galleryImgs.slice(1);

      var galleryHtml = galleryImgs.length ?
        '<section style="background:var(--paper); padding:var(--s6) 0"><div class="wrap">' +
        (project.isRendering
          ? '<p class="lead" style="margin-bottom:var(--s5)">本案目前以設計提案 3D 效果圖呈現，尚未附上完工實景照片。若您希望進一步了解本案的設計邏輯與工程進度，歡迎與我們聯繫。</p>'
          : '') +
        '<div style="display:flex; flex-direction:column; gap:var(--s5);" id="galleryGrid">' +
        galleryImgs.map(function (src, i) {
          return '<figure data-idx="' + i + '" style="margin:0"><img src="' + src + '" alt="' + project.name + ' 空間實景 ' + (i + 1) + '" loading="lazy" style="width:100%; height:auto; display:block; border-radius:4px; cursor:zoom-in;"></figure>';
        }).join("") +
        '</div></div></section>' : '';

      var ctaHtml =
        '<section class="section-navy"><div class="wrap-narrow center">' +
        '<span class="eyebrow on-dark">Start A Project</span>' +
        '<h2>想為自己的空間，定格這樣的詩意？</h2>' +
        '<p class="lead" style="color:#DEE2D8;margin:0 auto var(--s4)">無論是全案私宅設計、商業空間規劃，或僅是軟裝陳設的諮詢，歡迎預約一次面對面的討論。</p>' +
        '<a class="btn btn-outline on-dark" href="contact.html#booking">預約諮詢 →</a>' +
        '</div></section>';

      root.innerHTML = heroHtml + conceptHtml + floorplanHtml + galleryHtml + ctaHtml;
      initLightbox(galleryImgs, project.name);
      initReveal();
    }
  }

  /* ---------- lightbox ---------- */
  function initLightbox(images, name) {
    var grid = document.getElementById("galleryGrid");
    if (!grid || !images.length) return;

    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lb-close" aria-label="關閉">✕</button>' +
      '<button class="lb-prev" aria-label="上一張">←</button>' +
      '<img src="" alt="">' +
      '<button class="lb-next" aria-label="下一張">→</button>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);

    var img = lb.querySelector("img");
    var count = lb.querySelector(".lb-count");
    var idx = 0;

    function show(i) {
      idx = (i + images.length) % images.length;
      img.src = images[idx];
      img.alt = name + " 空間照片 " + (idx + 1);
      count.textContent = (idx + 1) + " / " + images.length;
    }
    function open(i) {
      show(i);
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }

    grid.addEventListener("click", function (e) {
      var fig = e.target.closest("figure");
      if (!fig) return;
      open(parseInt(fig.getAttribute("data-idx"), 10) || 0);
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- booking form ----------
     TODO (後端串接): 目前為純前端展示，尚未串接送出功能。
     建議做法：
     1) Formspree（最快）：至 https://formspree.io 免費註冊取得表單 ID，
        將下方 <form id="bookingForm"> 的 action 改為
        https://formspree.io/f/xxxxxxx、method="POST"，
        並移除 handleSubmit 內的 e.preventDefault() 與展示用的成功訊息區塊，
        改用表單原生送出即可（Formspree 會自動寄信到 erek.feng@gmail.com）。
     2) 或改接您自己的後端 / Google Apps Script / LINE Notify API，
        在 handleSubmit 中以 fetch() 呼叫該端點。
  ------------------------------------------------------------ */
  function initBookingForm() {
    var form = document.getElementById("bookingForm");
    if (!form) return;
    var successEl = document.getElementById("bookingSuccess");

    function setError(field, msg) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.add("invalid");
      var err = wrap.querySelector(".field-error");
      if (err) err.textContent = msg;
    }
    function clearError(field) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.remove("invalid");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // see TODO above — remove this line once a real backend/Formspree endpoint is wired up
      var valid = true;
      var required = form.querySelectorAll("[required]");
      required.forEach(function (field) {
        clearError(field);
        if (!field.value.trim()) {
          setError(field, "請填寫此欄位");
          valid = false;
        } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          setError(field, "請輸入正確的 Email 格式");
          valid = false;
        } else if (field.type === "tel" && field.value.replace(/[^0-9]/g, "").length < 8) {
          setError(field, "請輸入正確的聯絡電話");
          valid = false;
        }
      });
      if (!valid) {
        var firstInvalid = form.querySelector(".invalid input, .invalid select, .invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      form.style.display = "none";
      if (successEl) successEl.classList.add("show");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initYear();
    initFeatured();
    initPortfolioGrid();
    initProjectDetail();
    initBookingForm();
    initReveal();
  });
})();

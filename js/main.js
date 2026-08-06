/* ═══════════════════════════════════════════
   MARKEN × Pink Run — main.js
═══════════════════════════════════════════ */
(function () {
  "use strict";
  const D = window.PINKRUN;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const HAS_GSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  const ANIM = HAS_GSAP && !reduced;
  const revealAll = () => { document.documentElement.classList.add("static"); };

  /* ---------- 신청 버튼 ---------- */
  (function applyBtn() {
    const btn = $("#applyBtn");
    const url = ((window.PINKRUN_CONFIG || {}).applyUrl || "").trim();
    [btn, $("#applyBtn2"), $("#floatCta")].forEach(el => {
      if (!el) return;
      if (url) el.href = url; else el.hidden = true;
    });
  })();

  /* ---------- Build Acts ---------- */
  const actsWrap = $("#acts");
  const byYear = y => D.photos.filter(p => p.year === y);

  D.acts.forEach((act, ai) => {
    const list = byYear(act.year);
    const section = document.createElement("section");
    section.className = "act";
    section.id = "act-" + act.year;
    section.dataset.year = act.year;

    const chapter = document.createElement("div");
    chapter.className = "chapter";
    chapter.innerHTML =
      `<div class="chapter__inner">
         ${act.date ? `<span class="chapter__date reveal">${act.date}</span>` : ""}
         <span class="chapter__num reveal">${act.year}</span>
         <p class="chapter__sub reveal">${act.sub}</p>
       </div>`;
    section.appendChild(chapter);

    const grid = document.createElement("div");
    grid.className = "grid";

    list.forEach((ph, i) => {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.id = ph.id;
      const ar = (ph.w / ph.h).toFixed(4);
      const arStyle = ` style="aspect-ratio:${ar}"`;
      tile.innerHTML =
        `<span class="tile__zoom">VIEW +</span>
         <img class="tile__img"${arStyle} src="assets/thumb/${ph.id}.jpg" alt="${ph.caption}" loading="lazy" />
         <div class="tile__overlay"><p class="tile__cap">${ph.caption}</p></div>`;
      grid.appendChild(tile);
    });
    section.appendChild(grid);
    actsWrap.appendChild(section);
  });

  /* ---------- Memory wall ----------
     메시지는 Google Sheets(Apps Script 웹앱)에 저장됩니다.
     아래 comments() 에서 불러오고 렌더링합니다. */

  /* ---------- Hero slideshow (crossfade several photos) ---------- */
  (function heroSlideshow() {
    const media = $(".hero__media"), baseImg = $(".hero__img");
    if (!media) return;
    const srcs = ["assets/hero/hero.jpg", "assets/large/y2025-09.jpg", "assets/large/y2024-06.jpg", "assets/large/y2023-01.jpg", "assets/large/y2025-05.jpg"];
    if (baseImg) baseImg.style.display = "none";
    const slides = srcs.map((s, i) => {
      const im = document.createElement("img");
      im.className = "hero__slide" + (i === 0 ? " active" : "");
      im.src = s; im.alt = "MARKEN Pink Run";
      media.appendChild(im);
      return im;
    });
    if (slides.length < 2 || reduced) return;
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove("active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("active");
    }, 4500);
  })();

  /* ---------- Lenis + GSAP ---------- */
  if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);
  let lenis;
  if (ANIM && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = (target, offset = 0) => {
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.2 });
    else (typeof target === "string" ? $(target) : target)?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------- Hero intro ---------- */
  function introHero() {
    if (!ANIM) { revealAll(); return; }
    gsap.to("[data-hero]", { opacity: 1, y: 0, duration: 1.1, stagger: .12, ease: "power3.out",
      startAt: { y: 40 } });
    gsap.fromTo(".hero__media", { yPercent: 0 }, {
      yPercent: -8, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }
  introHero();

  /* ---------- Reveals ---------- */
  if (!ANIM) {
    revealAll();
  } else {
    $$(".reveal").forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 34 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });
    // tiles fade + scale (per-tile trigger, reliable on jumps)
    $$(".tile").forEach(t => {
      gsap.fromTo(t, { opacity: 0, scale: .92, y: 26 }, {
        opacity: 1, scale: 1, y: 0, duration: .9, ease: "power3.out",
        scrollTrigger: { trigger: t, start: "top 90%", once: true }
      });
    });
  }

  /* ---------- Nav scrolled ---------- */
  const floatCta = $("#floatCta"), finaleEl = $("#finale");
  window.addEventListener("scroll", () => {
    const y = window.scrollY, vh = window.innerHeight;
    if (floatCta) {
      const finTop = finaleEl ? finaleEl.offsetTop : Infinity;
      floatCta.classList.toggle("show", y > vh * 0.7 && (y + vh < finTop + 140));
    }
  }, { passive: true });

  /* ---------- Lightbox ---------- */
  const lb = $("#lb"), lbImg = $("#lbImg"), lbYear = $("#lbYear"), lbText = $("#lbText");
  const lbDl = $("#lbDownload");
  let viewList = [], viewIdx = 0, current = null;

  function visiblePhotos() {
    return $$(".act .tile").map(t => D.photos.find(p => p.id === t.dataset.id));
  }
  function openLB(id, list) {
    viewList = list || visiblePhotos();
    viewIdx = Math.max(0, viewList.findIndex(p => p.id === id));
    renderLB();
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("lb-open");
    if (lenis) lenis.stop();
  }
  function closeLB() {
    lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lb-open");
    if (lenis) lenis.start();
  }
  function renderLB() {
    current = viewList[viewIdx]; if (!current) return;
    const shown = current;
    lbImg.style.opacity = 0;
    const im = new Image();
    im.onload = () => {
      if (current !== shown) return;          // 빠르게 넘기면 지난 이미지는 버립니다
      lbImg.src = im.src; lbImg.alt = shown.caption; lbImg.style.opacity = 1;
    };
    im.onerror = () => { if (current === shown) lbImg.style.opacity = 1; };
    im.src = `assets/large/${shown.id}.jpg`;
    lbYear.textContent = current.year;
    lbText.textContent = current.caption;
    lbDl.href = `assets/large/${current.id}.jpg`;
    lbDl.setAttribute("download", `pinkrun-${current.id}.jpg`);
  }
  function step(d) { viewIdx = (viewIdx + d + viewList.length) % viewList.length; renderLB(); }

  document.addEventListener("click", e => {
    if (!lb) return;
    const tile = e.target.closest(".tile");
    if (tile) openLB(tile.dataset.id);
  });
  const lbNextBtn = $("#lbNext"), lbPrevBtn = $("#lbPrev");
  if (lbNextBtn) lbNextBtn.addEventListener("click", () => step(1));
  if (lbPrevBtn) lbPrevBtn.addEventListener("click", () => step(-1));
  $$("[data-close]").forEach(el => el.addEventListener("click", closeLB));
  document.addEventListener("keydown", e => {
    if (!lb || !lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  // swipe
  let sx = 0;
  lb.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ---------- Memory wall (Google Sheets) ----------
     · 시트에 행을 추가해도 되고, 사이트에서 직접 남겨도 됩니다.
     · 주소는 js/config.js 의 apiUrl 에서 설정합니다. */
  (function memoryWall() {
    const API = ((window.PINKRUN_CONFIG || {}).apiUrl || "").trim();
    const wall = $("#wall"), statusEl = $("#wallStatus"), finale = $("#finale");
    const addBtn = $("#addComment"), modal = $("#cmodal"), form = $("#cform");
    const nameI = $("#cName"), msgI = $("#cMsg"), etcI = $("#cRoleEtc");
    const chips = $$(".chip", $("#cRole") || document);
    if (!wall) return;

    const setStatus = t => { if (statusEl) { statusEl.textContent = t || ""; statusEl.hidden = !t; } };
    if (!API) { setStatus("메시지를 준비 중이에요."); return; }

    function render(items) {
      if (!items.length) { wall.innerHTML = ""; setStatus("아직 등록된 메시지가 없어요. 첫 이야기를 들려주세요."); return; }
      wall.innerHTML = items.map(c =>
        `<div class="wall__card">
           <p class="wall__msg">“${esc(c.msg)}”</p>
           <p class="wall__by">${esc(c.name || "참가자")}${c.role ? ` · <em>${esc(c.role)}</em>` : ""}</p>
         </div>`).join("");
      setStatus("");
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }

    function load() {
      return fetch(API + (API.indexOf("?") === -1 ? "?" : "&") + "t=" + Date.now(), { cache: "no-store" })
        .then(res => { if (!res.ok) throw 0; return res.json(); })
        .then(data => { render((data && data.items) || []); if (addBtn) addBtn.hidden = false; })
        .catch(() => { setStatus(""); if (finale) finale.classList.add("finale--nowall"); });
    }
    load();

    if (!modal || !form || !addBtn) return;
    let role = "", busy = false;

    const setRole = r => {
      role = r;
      chips.forEach(c => c.classList.toggle("active", c.dataset.role === r));
      const etc = r === "__etc";
      if (etcI) { etcI.hidden = !etc; if (!etc) etcI.value = ""; else setTimeout(() => etcI.focus(), 60); }
    };
    const roleValue = () => role === "__etc" ? ((etcI && etcI.value.trim()) || "기타") : role;
    chips.forEach(c => c.addEventListener("click", () => setRole(role === c.dataset.role ? "" : c.dataset.role)));

    const open = () => {
      nameI.value = ""; msgI.value = ""; setRole("");
      modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("lb-open"); if (lenis) lenis.stop();
      setTimeout(() => nameI.focus(), 120);
    };
    const close = () => {
      modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lb-open"); if (lenis) lenis.start();
    };
    addBtn.addEventListener("click", open);
    $$("[data-cclose]").forEach(el => el.addEventListener("click", close));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && modal.classList.contains("open")) close();
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (busy) return;
      const name = nameI.value.trim(), msg = msgI.value.trim();
      if (!name || !msg) { toast("이름과 메시지를 입력해 주세요"); return; }

      const btn = $(".cform__submit");
      busy = true; if (btn) { btn.disabled = true; btn.textContent = "저장 중…"; }
      try {
        const res = await fetch(API, {
          method: "POST", cache: "no-store",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ name, role: roleValue(), msg })
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "저장하지 못했어요");
        close();
        toast("메시지를 남겼어요 ♥");
        await load();
      } catch (err) {
        toast(err.message || "서버에 연결하지 못했어요");
      } finally {
        busy = false;
        if (btn) { btn.disabled = false; btn.textContent = "남기기"; }
      }
    });
  })();

  /* ---------- Smooth anchors ---------- */
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const el = $(id);
    if (el) { e.preventDefault(); scrollTo(el, -70); }
  });

  /* ---------- Toast ---------- */
  let tTimer;
  const toastEl = $("#toast");
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(tTimer); tTimer = setTimeout(() => toastEl.classList.remove("show"), 2000);
  }

  window.addEventListener("load", () => setTimeout(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 400));
})();

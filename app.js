/* 投资理财底层逻辑 · 静态学习站
 * 读取 content/manifest.json，渲染日期列表与 Markdown 学习文档。
 * 支持：URL hash 深链、嵌入式交互脚本执行、MathJax 公式、进度条。
 */
(function () {
  "use strict";

  const TOTAL_TOPICS = 100;
  const els = {
    list: document.getElementById("topicList"),
    article: document.getElementById("article"),
    progressFill: document.getElementById("progressFill"),
    progressText: document.getElementById("progressText"),
    sidebar: document.getElementById("sidebar"),
    backdrop: document.getElementById("backdrop"),
    menuBtn: document.getElementById("menuBtn"),
  };

  let manifest = [];

  // marked 配置：换行即换行，开启 GFM。
  if (window.marked) {
    marked.setOptions({ gfm: true, breaks: false });
  }

  // 从标题中解析 Topic 编号，例如 "Topic 4：复利效应"。
  function topicNumber(title) {
    const m = /topic\s*#?\s*(\d+)/i.exec(title || "");
    return m ? parseInt(m[1], 10) : null;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  async function init() {
    bindUI();
    try {
      const res = await fetch("content/manifest.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("manifest " + res.status);
      manifest = await res.json();
    } catch (e) {
      manifest = [];
    }
    renderList();
    updateProgress();
    routeFromHash();
  }

  function bindUI() {
    els.menuBtn.addEventListener("click", () => toggleSidebar());
    els.backdrop.addEventListener("click", () => toggleSidebar(false));
    window.addEventListener("hashchange", routeFromHash);
  }

  function toggleSidebar(force) {
    const open = force === undefined ? !els.sidebar.classList.contains("open") : force;
    els.sidebar.classList.toggle("open", open);
    els.backdrop.classList.toggle("show", open);
  }

  function renderList() {
    if (!manifest.length) {
      els.list.innerHTML =
        '<div class="topic-empty">还没有学习文档。<br>每天通过 Claude routine 生成一篇，' +
        "push 到 GitHub 后会自动出现在这里。</div>";
      return;
    }
    els.list.innerHTML = manifest.map((e) => {
      const n = topicNumber(e.title);
      const numTag = n ? `<span class="ti-num">#${n}</span>` : "";
      const cleanTitle = (e.title || e.date).replace(/^topic\s*#?\s*\d+\s*[：:．.\-]\s*/i, "");
      return (
        `<a class="topic-item" data-date="${e.date}" href="#${e.date}">` +
        `<span class="ti-meta">${numTag}<span>${e.date}</span></span>` +
        `<span class="ti-title">${escapeHtml(cleanTitle)}</span>` +
        `</a>`
      );
    }).join("");
  }

  function updateProgress() {
    const nums = manifest.map((e) => topicNumber(e.title)).filter((n) => n);
    const done = nums.length ? Math.max(...nums) : 0;
    const pct = Math.min(100, Math.round((done / TOTAL_TOPICS) * 100));
    els.progressFill.style.width = pct + "%";
    els.progressText.textContent = `${done} / ${TOTAL_TOPICS}`;
  }

  function routeFromHash() {
    const date = decodeURIComponent(location.hash.replace(/^#/, "")).trim();
    if (date && manifest.some((e) => e.date === date)) {
      loadEntry(manifest.find((e) => e.date === date));
    } else if (manifest.length) {
      loadEntry(manifest[0]); // 默认最新
    } else {
      renderWelcome();
    }
  }

  function setActive(date) {
    els.list.querySelectorAll(".topic-item").forEach((a) => {
      a.classList.toggle("active", a.dataset.date === date);
    });
  }

  function renderWelcome() {
    els.article.innerHTML =
      '<div class="welcome">' +
      '<div class="big">📈</div>' +
      "<h1>投资理财底层逻辑 · 100 天</h1>" +
      "<p>从「钱是什么」开始，循序渐进建立属于自己的投资认知框架。</p>" +
      "<p>每天一个 Topic，共 100 篇。学习文档会逐日出现在左侧目录中。</p>" +
      "</div>";
  }

  async function loadEntry(entry) {
    setActive(entry.date);
    toggleSidebar(false);
    els.article.innerHTML = '<div class="loading">加载中…</div>';
    window.scrollTo({ top: 0 });
    try {
      const res = await fetch("content/" + entry.file, { cache: "no-cache" });
      if (!res.ok) throw new Error("content " + res.status);
      const md = await res.text();
      renderMarkdown(md, entry);
    } catch (e) {
      els.article.innerHTML =
        '<div class="loading">无法加载该文档（' + escapeHtml(entry.file) + "）。</div>";
    }
  }

  function renderMarkdown(md, entry) {
    const n = topicNumber(entry.title);
    const dateBadge =
      '<div class="article-date">' +
      (n ? `<span class="badge">Topic ${n}</span>` : "") +
      `<span>📅 ${entry.date}</span></div>`;

    const html = window.marked ? marked.parse(md) : "<pre>" + escapeHtml(md) + "</pre>";
    els.article.innerHTML = dateBadge + html;

    runEmbeddedScripts(els.article);
    typesetMath();
  }

  // 让内容文档里嵌入的 <script>（交互组件）真正执行。
  function runEmbeddedScripts(root) {
    root.querySelectorAll("script").forEach((old) => {
      const s = document.createElement("script");
      for (const attr of old.attributes) s.setAttribute(attr.name, attr.value);
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  }

  function typesetMath() {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([els.article]).catch(() => {});
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

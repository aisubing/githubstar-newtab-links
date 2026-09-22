// ==UserScript==
// @name         GitHub stars新标签页打开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 GitHub stars 相关页面把已 star 的仓库链接在新标签页打开，其余页面与链接保持默认。
// @match        https://github.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/aisubing/githubstar-newtab-links
// @downloadURL  https://raw.githubusercontent.com/aisubing/githubstar-newtab-links/main/githubstars_links_new_tab.user.js
// @updateURL    https://raw.githubusercontent.com/aisubing/githubstar-newtab-links/main/githubstars_links_new_tab.user.js
// ==/UserScript==

(function () {
  'use strict';

  // -------------------- Link handling --------------------
  const isModifiedClick = (e) =>
    e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

  const closestAnchor = (el) => (el && el.closest ? el.closest('a[href]') : null);

  // -------------------- Scope: stars views only --------------------
  // 覆盖两种"看 star 收藏"的入口：
  //   1. 自己的 stars 页：'/stars'、'/stars/' 以及公开的 '/stars/<user>'
  //   2. 个人主页的 Stars 标签：'/<user>?tab=stars'（查看他人或自己的公开收藏）
  // 用分段/URLSearchParams 而非正则判断，避免 Tampermonkey 内置解析器对正则字面量误分词。
  // 在点击那一刻读取 location，因此 Turbo/SPA 跳转后无需重新初始化即可生效。
  const pathSegs = (p) => p.split('/').filter(Boolean);

  const isStarsPage = () => {
    const s = pathSegs(window.location.pathname);
    if (s[0] === 'stars' && s.length <= 2) return true;
    if (s.length === 1) {
      try {
        if (new URLSearchParams(window.location.search).get('tab') === 'stars') return true;
      } catch (_) {}
    }
    return false;
  };

  // 已 star 的项目链接必然是仓库地址：恰好两段 '/owner/repo'。
  // '/stars'、'/stars/<user>'、'/login'、tag 筛选、分页段数不同，保持默认行为。
  // 排除页脚/导航，避免 '/features/xxx' 这类同样是两段的营销链接被误判。
  const isRepoLink = (a) => pathSegs(a.pathname).length === 2 && !a.closest('footer, header, nav');

  const shouldIgnoreLink = (a) => {
    if (!a) return true;

    const href = a.getAttribute('href');
    if (!href || href.startsWith('javascript:')) return true;
    if (a.hasAttribute('download')) return true;

    const role = a.getAttribute('role');
    if (role === 'button') return true;

    // 纯锚点（仅 # 或 #xxx）：当前页内跳转，不新开标签
    if (href.startsWith('#')) return true;

    const normalizePath = (p) => (p || '').replace(/\/+$/, '');

    // 同页锚点：目标 URL 与当前页同 origin、同 path（忽略尾部 /），仅 hash 不同 → 不新开标签（如 README 里「简体中文 | English」）
    try {
      const u = new URL(a.href);
      const cur = window.location;
      if (u.origin === cur.origin && normalizePath(u.pathname) === normalizePath(cur.pathname)) return true;
    } catch (_) {}

    return false;
  };

  window.addEventListener(
    'click',
    (e) => {
      if (!isStarsPage()) return;
      if (isModifiedClick(e)) return;

      const a = closestAnchor(e.target);
      if (shouldIgnoreLink(a)) return;
      if (!isRepoLink(a)) return;

      const url = a.href;
      if (!url) return;

      e.preventDefault();
      e.stopPropagation();
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    true
  );
})();

# GitHub stars新标签页打开

一个 Tampermonkey 油猴脚本：在 GitHub 的 stars 收藏页面点击已 star 的仓库链接时，自动在**新标签页**打开；其余所有页面和链接保持 GitHub 默认行为。

## 安装

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展。
2. 打开 GitHub 的 stars 页面即可生效，无需任何配置。

## 生效范围

只在以下"查看 star 收藏"的入口生效：

| 页面 | 示例地址 |
| --- | --- |
| 自己的 Stars 页 | `https://github.com/stars` |
| 公开的用户 Stars 页 | `https://github.com/stars/<用户名>` |
| 个人主页的 Stars 标签 | `https://github.com/<用户名>?tab=stars` |

## 拦截规则

仅当满足全部条件时才改为新标签打开：

- 当前处于上述 stars 页面之一；
- 普通鼠标左键点击（按住 `Ctrl` / `⌘` / `Shift` / `Alt` 或使用鼠标中键时**不干预**，保留浏览器原生行为）；
- 目标链接是干净的仓库地址，即两段式 `/作者/仓库`；
- 链接不在页头 / 导航 / 页脚中，避免误伤同类两段式营销链接；
- 排除以下情况：`javascript:` 链接、带 `download` 属性的链接、`role="button"` 元素、纯锚点 `#xxx`、以及仅 hash 不同的同页链接（例如 README 里的「简体中文 | English」切换）。

其余链接（tag 筛选、分页、其它任意 GitHub 页面）均走默认行为。

## 技术说明

- `@run-at document-start`，点击时实时读取 `location`，因此在 GitHub 的 Turbo / SPA 跳转后无需重新初始化即可生效。
- 作用域判断用路径分段与 `URLSearchParams` 而非正则字面量，规避 Tampermonkey 内置解析器对正则的误分词问题。
- `@grant none`：不使用任何 GM 接口，脚本无外部依赖、无持久化状态。

## 版本

当前 `1.0`。

## 仓库

https://github.com/aisubing/githubstar-newtab-links

## 许可

MIT

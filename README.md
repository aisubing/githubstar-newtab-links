# GitHub stars新标签页打开

**README和脚本为AI生成**

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

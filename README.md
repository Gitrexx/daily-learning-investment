# 投资理财底层逻辑 · 100 天学习计划

> 从「钱是什么」出发，循序渐进地建立一套**属于自己的、可持续执行的投资认知框架**。
> 本项目是一个托管在 GitHub Pages 上的静态学习站：每天新增一篇深入、可交互的学习文档，
> 顺着精心编排的 100 个 Topic 逐日推进。

📖 **完整路线图**：见 [`投资理财学习100Topics.md`](投资理财学习100Topics.md)（17 个模块，100 个 Topic）

---

## 这个项目是干嘛的？

这不是「速成炒股」教程，而是一条**从底层逻辑搭起认知地基**的学习路径：

```
认知地基 → 市场与资产认知 → 分析与组合理论 → 策略与宏观
   → 心理与风险控制 → 落地个人规划 → 进阶与体系化
```

核心原则：**理解「为什么」永远比知道「怎么做」更重要。**

每天的学习文档不是干巴巴的笔记，而是**可交互的网页**——内嵌计算器、滑块、小测验等，
帮助把抽象概念变成可以「亲手拨弄」的直觉。

---

## 它是怎么运作的？

1. **每天生成一篇内容。** 通过 Claude Code 的 routine（定时任务），按 `CLAUDE.md` 的规则，
   顺着 1 → 100 的顺序，每天针对**一个** Topic 生成一篇中文学习文档，存为
   `content/YYYY-MM-DD.md`。
2. **自动构建索引。** `scripts/build_manifest.py` 扫描 `content/` 下的日期文档，
   生成 `content/manifest.json`（站点的目录数据）。
3. **自动部署。** push 到 `main` 分支后，[GitHub Actions](.github/workflows/static.yml)
   会重建 manifest 并把整个仓库作为静态站点部署到 GitHub Pages。
4. **浏览阅读。** `index.html` + `app.js` 读取 manifest，在浏览器里渲染 Markdown
   （支持公式、表格、以及内嵌的交互组件），并展示学习进度（`N / 100`）。

```
content/2026-06-17.md  ──┐
content/2026-06-18.md  ──┼──►  build_manifest.py  ──►  content/manifest.json
content/...            ──┘                                      │
                                                                ▼
                              index.html + app.js  ──►  浏览器渲染 + 进度条
```

---

## 项目结构

| 文件 / 目录 | 作用 |
|---|---|
| `index.html` | 站点外壳：顶栏、侧边目录、内容区 |
| `app.js` | 读取 manifest、渲染 Markdown、执行内嵌交互脚本、进度计算、深链路由 |
| `styles.css` | 全部样式（含浅色/深色自适应、移动端适配、`.widget` 组件样式） |
| `content/` | 每日学习文档 `YYYY-MM-DD.md` + 自动生成的 `manifest.json` |
| `scripts/build_manifest.py` | 扫描 `content/` 重建 `manifest.json` |
| `投资理财学习100Topics.md` | 100 个 Topic 的完整路线图 |
| `CLAUDE.md` | 给每日 routine 的指令：判断该做第几个 Topic、内容格式规范 |
| `.github/workflows/static.yml` | GitHub Actions：构建 manifest 并部署到 Pages |

---

## 本地预览

站点是纯静态的，但 `app.js` 用 `fetch` 读取文件，需要通过本地 HTTP 服务器打开
（直接双击 `index.html` 会因浏览器的 `file://` 限制而无法加载内容）：

```bash
# 1. 若新增/修改了 content，先重建索引
python3 scripts/build_manifest.py

# 2. 起一个本地服务器
python3 -m http.server 8000

# 3. 浏览器打开
open http://localhost:8000
```

---

## 开启 GitHub Pages

在仓库的 **Settings → Pages → Build and deployment** 中，将 **Source** 设为
**GitHub Actions** 即可。之后每次 push 到 `main`，站点都会自动更新。

---

> ⚠️ **免责声明**：本站全部内容仅为个人学习笔记，**不构成任何投资建议**。
> 投资有风险，决策需独立判断。

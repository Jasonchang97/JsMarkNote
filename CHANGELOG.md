# Changelog

## v1.0.2 (2026-05-20)

### Bug Fixes

- 修复 CI/CD 工作流中残留的 marktext 引用，解决 GitHub Actions 构建报错
- 修复 `.github/` 下 Issue 模板、FUNDING、CONTRIBUTING 等配置文件中的旧名称引用
- 修复 README.md 中 license badge 指向旧仓库地址
- 调整应用图标尺寸，替换为更高分辨率的 jsmarknote 图标

### Branding

- CI/CD 工作流名称、artifact 命名统一更新为 jsmarknote
- GitHub Issue 模板、讨论链接、文档链接统一指向 jsmarknote/jsmarknote 仓库
- macOS 构建产物路径从 `/Applications/marktext.app` 更新为 `/Applications/jsmarknote.app`

---

## v1.0.1 (2026-05-19)

### Features

- 初代改造版本，基于 MarkText fork 并完成品牌重命名
- 项目名称由 marktext 更改为 jsmarknote / JsMarkNote
- 更新 `package.json` 中的 name、description、homepage
- 更新 `electron-builder.yml` 中的 appId、productName、所有构建产物名称
- 更新 `electron.vite.config.js` 中的版本变量为 `JSMARKNOTE_VERSION`
- 更新 `eslint.config.js` 中的全局变量声明
- 重写 `README.md` 为中文版本
- 替换所有应用图标（icon.ico、icon.png、各尺寸 PNG）
- 新增 `docs/assets/jsmarknote.png` 截图

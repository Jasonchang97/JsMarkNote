<p align="center"><img src="static/icon.png" alt="JsMarkNote" width="100" height="100"></p>

<h1 align="center">JsMarkNote</h1>

<div align="center">
  <strong>新一代 Markdown 编辑器</strong><br>
  一款简洁优雅的开源 Markdown 编辑器，专注于速度与易用性。<br>
  <sub>支持 Linux、macOS 和 Windows。</sub>
</div>

<br>

<div align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/jsmarknote/jsmarknote.svg" alt="LICENSE">
  </a>
</div>

<div align="center">
  <h3>
    <a href="#功能特性">功能特性</a>
    <span> | </span>
    <a href="#项目架构">项目架构</a>
    <span> | </span>
    <a href="#开发指南">开发指南</a>
  </h3>
</div>

<br />

## 截图

![](docs/assets/jsmarknote.png?raw=true)

## 功能特性

- 实时预览（所见即所得），界面简洁，提供无干扰的写作体验。
- 支持 [CommonMark 规范](https://spec.commonmark.org/0.29/)、[GitHub Flavored Markdown 规范](https://github.github.com/gfm/)，并选择性支持 [Pandoc Markdown](https://pandoc.org/MANUAL.html#pandocs-markdown)。
- 支持 Markdown 扩展语法，包括数学公式（KaTeX）、前置元数据（Front Matter）和表情符号。
- 支持段落和内联样式快捷操作，提升写作效率。
- 导出 **HTML** 和 **PDF** 文件。
- 多种主题：**Cadmium Light**、**Material Dark** 等。
- 多种编辑模式：**源码模式**、**打字机模式**、**专注模式**。
- 直接从剪贴板粘贴图片。
- 多语言支持（英语、简体中文、繁体中文、日语、韩语、西班牙语、法语、德语、葡萄牙语）。

## 项目架构

JsMarkNote 基于 Electron 构建，采用三进程架构：

```
┌─────────────────────────────────────────────────────┐
│                    主进程 (Main)                      │
│  (Node.js / Electron)                                │
│  - 应用生命周期管理                                    │
│  - 原生菜单 & 右键菜单（国际化）                       │
│  - 窗口管理                                           │
│  - 文件系统操作                                        │
│  - 用户偏好设置 & 快捷键                               │
│  - 自动更新 & IPC 通信协调                              │
├─────────────────────────────────────────────────────┤
│                 预加载脚本 (Preload)                   │
│  (主进程与渲染进程的安全桥梁)                           │
│  - 通过 contextBridge 安全暴露 API                    │
│  - IPC 通道注册                                        │
├─────────────────────────────────────────────────────┤
│                  渲染进程 (Renderer)                   │
│  (Vue 3 + Pinia / Chromium)                          │
│  - UI 组件（侧边栏、标签栏、标题栏等）                  │
│  - 状态管理（Pinia Store）                             │
│  - vue-i18n 界面国际化                                 │
│  - 命令面板 & 快捷键                                   │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│                  Muya 编辑器引擎                      │
│  (自研 Markdown 编辑核心)                             │
│  - 实时 Markdown 解析与渲染                           │
│  - 基于 ContentEditable 的编辑                       │
│  - 行内 & 块级格式化                                  │
│  - 代码围栏、数学公式、图表支持                        │
│  - 图片预览 & 拖拽上传                                │
│  - 表格编辑                                           │
└─────────────────────────────────────────────────────┘
```

### 核心技术栈

| 组件 | 技术 |
|------|------|
| 桌面框架 | Electron 42 |
| 构建工具 | electron-vite（基于 Vite） |
| 打包工具 | electron-builder（NSIS / DMG / AppImage） |
| UI 框架 | Vue 3 + Pinia |
| 编辑器引擎 | Muya（自研 Markdown 引擎） |
| 国际化 | vue-i18n（渲染进程）+ 自定义 i18n 模块（主进程） |
| Markdown 解析 | markdown-it + 自定义扩展 |
| 数学公式渲染 | KaTeX |
| 图表支持 | Mermaid + Vegalite |
| 语法高亮 | PrismJS |
| 编码检测 | compact_enc_det（原生模块） |
| 密钥管理 | Keytar（原生模块，系统钥匙串集成） |

### 目录结构

```
JsMarkNote/
├── src/
│   ├── main/                    # 主进程
│   │   ├── app/                 # 应用启动 & 生命周期
│   │   ├── menu/                # 原生菜单 & 右键菜单
│   │   │   ├── templates/       # 菜单定义（文件、编辑、段落等）
│   │   │   └── actions/         # 菜单动作处理器
│   │   ├── windows/             # 窗口创建 & 管理
│   │   ├── preferences/         # 用户设置持久化
│   │   ├── keybindings/         # 快捷键管理
│   │   ├── i18n.js              # 主进程国际化
│   │   └── commands/            # 命令注册
│   ├── renderer/                # 渲染进程（Vue 3）
│   │   └── src/
│   │       ├── components/      # Vue 组件
│   │       ├── stores/          # Pinia 状态管理
│   │       ├── i18n/            # vue-i18n 配置
│   │       ├── commands/        # 命令面板
│   │       └── contextMenu/     # 渲染进程右键菜单
│   ├── muya/                    # Markdown 编辑器引擎
│   │   ├── lib/
│   │   │   ├── contentState/    # 文档状态管理
│   │   │   ├── parser/          # Markdown 解析器
│   │   │   ├── renderers/       # 块级 & 行内渲染器
│   │   │   ├── eventHandler/    # 输入、点击、键盘事件
│   │   │   └── selection/       # 光标 & 选区管理
│   │   └── assets/              # 编辑器样式 & 图标
│   ├── common/                  # 共享模块（i18n、文件系统等）
│   └── preload/                 # 预加载脚本
├── static/                      # 静态资源
│   ├── locales/                 # 国际化 JSON 文件（9 种语言）
│   └── themes/                  # 编辑器主题
├── build/                       # 构建资源
│   ├── icons/                   # 应用图标（ico、png、icns）
│   └── windows/                 # NSIS 安装器自定义
├── electron-builder.yml         # 打包配置
├── electron.vite.config.js      # Vite 构建配置
└── scripts/                     # 构建脚本（locale 压缩等）
```

## 开发指南

### 环境要求

- Node.js >= 18
- npm >= 9
- Visual Studio 2019（Windows 上编译原生模块所需）

### 快速开始

```bash
# 安装依赖
npm install

# 重新编译原生模块（keytar、native-keymap、ced）
npm run rebuild-native

# 启动开发服务器
npm run dev
```

### 构建与打包

```bash
# 生产环境构建
npm run build

# 打包 Windows 安装包
npm run build:win

# 打包 macOS 安装包
npm run build:mac

# 打包 Linux 安装包
npm run build:linux
```

打包产物输出在 `dist/` 目录。

### 国际化开发

语言文件位于 `static/locales/`。编辑后执行：

```bash
npm run minify-locales
```

生成主进程 i18n 模块使用的 `.min.json` 压缩文件。

## 许可证

[**MIT**](LICENSE)。

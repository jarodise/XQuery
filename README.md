# X Query Search 🚀 (中文版)

高级 X.com 搜索查询构建器和管理器。此 Chrome 扩展程序通过强大的搜索模板和自定义查询构建器，帮助您在 X.com 上发现高质量内容。

## 功能特点

- **🔍 搜索模板**: 针对不同地区（中文、英文、日文等）和话题的预设搜索模式。
- **🛠️ 自定义查询构建器**: 使用关键词、语言、时间范围和最小点赞数轻松构建复杂查询。
- **⚡ 高级设置**: 可选过滤媒体类型（图片/视频）和排除项（转推、回复、链接）。
- **🔖 收藏夹管理器**: 保存您常用的搜索查询，点击即可快速触发。
- **🔗 深度 X 集成**: 直接跳转到 X.com 的实时搜索结果页面。
- **💻 优质设计**: 采用简洁、原生的 Twitter/X 风格美学设计。

## 技术栈

- **框架**: React 18
- **构建工具**: Vite + @crxjs/vite-plugin
- **样式**: Tailwind CSS
- **状态管理**: Zustand (结合 chrome.storage 持久化)
- **开发语言**: TypeScript
- **测试**: Vitest + React Testing Library

## 安装步骤

1. **克隆仓库**:
   ```bash
   git clone https://github.com/jarodise/XQuery.git
   cd XQuery
   ```

2. **安装依赖**:
   ```bash
   pnpm install
   ```

3. **构建扩展**:
   ```bash
   pnpm build
   ```

4. **在 Chrome 中加载**:
   - 打开 Chrome 浏览器，访问 `chrome://extensions`。
   - 开启 **开发者模式**。
   - 点击 **加载已解压的扩展程序**，选择本仓库中的 `dist` 文件夹。

## 使用说明

1. 打开 [x.com](https://x.com)。
2. 点击 Chrome 工具栏中的扩展图标打开搜索侧板。
3. 在 **模板**、**自定义** 和 **收藏** 标签页之间切换以管理您的搜索。

## 开发调试

- **开发服务器**: `pnpm dev`
- **运行测试**: `pnpm test`
- **类型检查**: `npx tsc`

---

# X Query Search 🚀 (English)

Advanced X.com search query builder and manager. This Chrome extension helps you find high-quality content on X.com using powerful search templates and a custom query builder.

![Extension Preview](public/icons/icon128.png)

## Features

- **🔍 Search Templates**: Predefined search patterns for different regions (Chinese, English, Japanese, etc.) and topics.
- **🛠️ Custom Query Builder**: Easily build complex queries using keywords, languages, time ranges, and minimum like counts.
- **⚡ Advanced Filters**: Toggle filters for media types (images/videos) and exclusions (retweets, replies, links).
- **🔖 Favorites Manager**: Save your frequently used search queries and trigger them with a single click.
- **🔗 Deep X Integration**: Navigates directly to the live search results on X.com.
- **💻 Premium Design**: Built with a sleek, Twitter/X-native aesthetic.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite + @crxjs/vite-plugin
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with chrome.storage persistence)
- **Language**: TypeScript
- **Testing**: Vitest + React Testing Library

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jarodise/XQuery.git
   cd XQuery
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Build the extension**:
   ```bash
   pnpm build
   ```

4. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions`.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the `dist` folder in this repository.

## Usage

1. Open [x.com](https://x.com).
2. Click the extension icon in your Chrome toolbar to open the search sidebar.
3. Switch between **Templates**, **Custom**, and **Favorites** tabs to manage your searches.

## Development

- **Development server**: `pnpm dev`
- **Run tests**: `pnpm test`
- **Type check**: `npx tsc`

## License

MIT

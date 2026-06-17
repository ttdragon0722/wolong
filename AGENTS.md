# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

**YCT Precision** - 數控加工製造業企業展示網站，包含電商功能（購物車、結帳）。靜態 HTML/CSS/JavaScript 網站，使用 Tailwind CSS v4.2.1。

本專案為**復刻目標網站**，整體布局與視覺風格應貼近原始設計。

## Build Commands

```bash
# 開發時監視 CSS 變更（主要使用）
npm run build-current
# 等同於：tailwindcss -i css/input.css -o css/output.css --watch

# 自訂目錄構建（build.js 支援目錄參數）
node build.js [dir-path]
```

**重要**：修改任何 HTML 中的 Tailwind class 後，必須執行 `npm run build-current` 重新編譯 `css/output.css`。

## Development Workflow

每次開發一個 component 的標準流程：

1. **確認 component** — 明確要做什麼區塊（如 hero banner、card grid、footer 等）
2. **修改 `css/input.css`** — 在 `@layer components` 新增自訂 class，或視需要調整 `@theme` 設計 token
3. **Build** — 執行 `npm run build-current` 重新編譯 `css/output.css`

## Constraints

以下操作**禁止主動執行**，除非使用者明確指示：

- **不修改整體布局** — 不移動或重構現有頁面的主要區塊排列
- **不修改 `@theme` 設計 token** — 主色 `--color-primary` 等全域變數不主動更改
- **不新增 HTML 頁面** — 不在未被要求的情況下建立新的 `.html` 檔案
- **不修改 JavaScript 邏輯** — `javascript/` 目錄下的 JS 只在明確被要求時才動

## Architecture

### CSS 設計系統 (`css/input.css`)

使用 Tailwind v4 的 `@theme` 語法定義自訂 CSS 變數，所有頁面共享：

- **主色**：`--color-primary: #0070e6`
- **背景**：`--color-surface: #181818`（深色主題為預設）
- **容器**：`--color-container: #1f1f1f`
- **前景文字**：`--color-on-surface: #f1f5f9`
- **最大寬度**：`--spacing-pc: 1540px`（用於 `.custom-container`）
- **字體**：Noto Sans TC（Google Fonts）

直接使用 Tailwind utility class，如 `text-primary`、`bg-surface`、`bg-container`。

### JavaScript 模組（`javascript/`）

每個 JS 檔案對應獨立功能，直接以 `<script src="...">` 引入 HTML：

| 檔案 | 負責功能 |
|------|---------|
| `navbar.js` | 捲動時導覽列變色、手機漢堡選單、多層下拉手風琴 |
| `carousel.js` | 首頁橫幅輪播（自動播放、圓點指示器） |
| `product-item.js` | 商品頁縮圖切換、數量增減、Lightbox 放大鏡 |
| `backToTop.js` | 返回頂部按鈕（捲動 > 400px 顯示） |

### 頁面結構

12 個 HTML 頁面，每頁獨立引入所需 JS 和共用 `css/output.css`：

- `home.html` — 首頁（含輪播）
- `product.html` / `product-item.html` — 產品列表／詳細
- `cart.html` / `pay.html` — 購物車／結帳
- `member.html`, `contact.html`, `add-message.html`, `q&a.html` — 資訊頁
- `movie.html` / `movie-item.html` — 影片頁

## Component Documentation

`readme.md` 包含完整的 UI 元件 HTML 範本，新增頁面區塊時請先查閱此文件複用現有元件結構。

## Version History

`/v1/`、`/v2/` 目錄為舊版存檔，開發時勿修改。

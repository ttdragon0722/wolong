# 產品分類選單（Product Category Menu）

統一管理產品內頁「桌面側欄」與「手機折疊選單」的資料驅動元件，支援第二層子分類 toggle 與展開動畫。

> 檔案：`javascript/product-menu.js`　首次套用頁面：`product-item.html`

---

## 1. 這次更新做了什麼

過去 `product-item.html` 的分類選單是**兩段各自手寫的清單**：手機一份 `.accordion-container`、桌面一份 `.sidebar-container`，內容彼此重複（當時手機 4 項、桌面 5 項還不一致），且都只有單層、沒有子分類。

本次改為**單一資料來源 + 兩種版型渲染**：

- 只維護一份巢狀資料 `productCategories`
- 由同一支腳本分別產生「桌面側欄」與「手機手風琴」的 DOM，內容只需改一處
- 新增**第二層子分類 toggle**（點擊展開／收合，帶高度過渡動畫）
- 所有箭頭圖示統一為三角形（葉節點指右；可展開項展開時旋轉 90 度指下）
- 桌面子選單以專用色彩 token `--color-sidebar-sub` 與父層做出層級區別

### 變更檔案

| 檔案 | 變更 |
|------|------|
| `javascript/product-menu.js` | 新增：資料 `productCategories` + 渲染與 toggle 邏輯（IIFE 包裹） |
| `product-item.html` | accordion／sidebar 硬編碼 → 兩個空容器；body 末端引入 `product-menu.js` |
| `css/input.css` | 新增 `.submenu-panel`／`.toggle-chevron`／`.sidebar-sub-item`／`.accordion-sub-item`，新增 token `--color-sidebar-sub`；手機 accordion 箭頭旋轉由 `rotate-180` 改為 `rotate-90`（配合三角形） |

---

## 2. 運作原理

```
productCategories (一份巢狀資料)
        │
        ├── renderSidebar()   ──→ 寫入 #product-sidebar    （桌面側欄）
        └── renderAccordion() ──→ 寫入 #product-accordion  （手機手風琴）
                                       │
                                       └── setupToggles()  綁定第二層 toggle
```

整支腳本以 **IIFE** 包裹，置於 `<body>` 末端。渲染與事件綁定都在腳本內完成、自成一體，**不依賴其他 script 的載入順序**（與 `menu.js` 必須排在 `navbar.js` 之前不同）。IIFE 也避免變數外洩、與 `menu.js` 的同名變數（如 `hasChildren`）衝突。

第二層的展開靠 **max-height 動畫**：

- 初始收合：渲染時就在面板加上 inline `max-height: 0; overflow: hidden;`（不依賴 CSS 是否載入，避免快取舊 `output.css` 時子項全部露出）
- 展開：JS 量測 `scrollHeight` 並設為 inline `max-height`
- 過渡：由 `.submenu-panel { transition: max-height 0.3s ease }` 提供

---

## 3. 安裝（在新頁面套用）

任何產品頁要使用這套分類選單，只需 3 步：

### 步驟 1 — 手機版放空容器

把原本手寫的 `.accordion-container` 整段，改成一個空容器：

```html
<div
    id="product-accordion"
    class="accordion-container min-[1000px]:hidden"
></div>
```

### 步驟 2 — 桌面版放空容器

把原本手寫的 `.sidebar-container` 區塊（含 `PRODUCTS` 標題），改成一個空容器：

```html
<div
    id="product-sidebar"
    class="w-68 max-[1000px]:hidden"
></div>
```

> `PRODUCTS` 標題（`.sidebar-title`）由 `renderSidebar()` 自動產生，不需自己寫。

### 步驟 3 — 引入 script

在頁面底部引入（順序不限）：

```html
<script src="./javascript/product-menu.js"></script>
```

完成。腳本內含 null 檢查，找不到容器的頁面會自動略過、不報錯。

---

## 4. 使用（維護選單內容）

只改 `javascript/product-menu.js` 最上方的 `productCategories`，桌面與手機會同步更新。

### 資料結構

```js
{
    label: "顯示文字",   // 必填
    href: "連結網址",    // 必填
    children: [ ... ],   // 選填：有子分類就放陣列（目前支援一層子分類）
}
```

### 範例

```js
const productCategories = [
    {
        label: "CNC Machining Parts",
        href: "product_CNC_Machining_Parts.php",
        children: [
            { label: "Milling Parts", href: "#" },
            { label: "Turning Parts", href: "#" },
            { label: "Drilling Parts", href: "#" },
        ],
    },
    { label: "Aluminum Parts", href: "product_Aluminum_parts.php" },
    { label: "Lighting Parts", href: "#" },
];
```

- **新增一個分類** → 在陣列加一個 `{ label, href }`
- **讓分類可展開子項** → 給該項目加 `children: [...]`（變成第二層 toggle）

---

## 5. 圖示、層級與配色

| 位置 | 圖示 | 樣式 class |
|------|------|-----------|
| 葉節點（純連結） | 三角形，固定指右 ▶ | 桌面 `sidebar-item`／手機 `accordion-link` |
| 可展開項（toggle） | 三角形，加 `.toggle-chevron`，展開時 `rotate-90` 指下 ▼ | 同上 + `submenu-toggle` |
| 第二層子項 | 三角形（桌面）／無（手機） | 桌面 `sidebar-sub-item`／手機 `accordion-sub-item` |

**桌面子選單的層級區別**：`.sidebar-sub-item` 與父層 `.sidebar-item` 維持同一套設計（同樣 `border-b-2 border-border-strong`、hover 黑底白字），只用「縮排 `px-8` + 專用背景色 + 字號 `text-sm`」做一點點區別。

背景色集中於 `css/input.css` 的 `@theme`：

```css
--color-bg-muted: #dedede;     /* 父層 sidebar 背景 */
--color-sidebar-sub: #d6d6d6;  /* 第二層子項背景（稍深，凸顯層級） */
```

要調整子選單配色，只改這一行 token 即可，套用 `bg-sidebar-sub` 的地方會全部跟著變。

---

## 6. 注意事項

- **修改 class 後要重新編譯 CSS**：若調整了 `product-menu.js` 產生的 Tailwind class 或 `input.css` 樣式，執行 `npm run build-current`（或 `npx tailwindcss -i css/input.css -o css/output.css`）。
- **改了樣式但頁面沒變 → 多半是 `output.css` 瀏覽器快取**：用 `Ctrl + Shift + R` 強制刷新；本元件已用 inline style 固化「初始收合」，即使快取舊 CSS 子項也不會露出，但動畫需載入新 CSS 才會生效。
- **目前支援到第二層**：`children` 再往下巢狀的第三層尚未實作渲染與樣式，需要時要另外擴充。
- **頂層手機 accordion 仍是純 CSS**：「Product Categories」主開關用 checkbox hack（`#accordion-trigger`），與第二層 toggle（JS 控制）是兩套機制。
- **目前僅 `product-item.html` 套用**：其他產品頁可依第 3 節逐頁切換。

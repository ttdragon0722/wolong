# 選單系統（Menu System）

統一管理 header（桌面下拉）與手機選單多層級項目的資料驅動元件。

> 檔案：`javascript/menu.js`　首次套用頁面：`index.html`

---

## 1. 這次更新做了什麼

過去每個頁面的 header 與手機選單都是**手寫的巢狀 HTML**，桌面與手機各維護一份、彼此重複，新增或修改一個選單項目要改很多地方，也容易出錯（`index.html` 原本就有兩個重複的 Products 下拉、id 重複）。

本次改為**單一資料來源 + 遞迴渲染**：

- 只維護一份巢狀資料 `menuConfig`
- 由兩個遞迴函式分別產生「桌面下拉」與「手機手風琴」的 DOM
- 產生的結構、class 與 `css/input.css`、`navbar.js` 既有設計完全一致
- 順手移除了 `index.html` 重複的 Products 下拉與重複 id

### 變更檔案

| 檔案 | 變更 |
|------|------|
| `javascript/menu.js` | 新增：資料 `menuConfig` + 渲染演算法 |
| `index.html` | header 與手機選單硬編碼 → 改成兩個空容器；引入 `menu.js` |

---

## 2. 運作原理

```
menuConfig (一份巢狀資料)
        │
        ├── renderDesktop() ──→ 寫入 #desktop-nav      （桌面多層下拉）
        └── renderMobile()  ──→ 寫入 #mobile-nav-list  （手機手風琴）
```

`menu.js` 置於 `<body>` 末端、且**排在 `navbar.js` 之前**。
渲染為同步執行，因此 `navbar.js` 在 `DOMContentLoaded` 綁定事件時，
`.mobile-toggle-btn`、`.desktop-sub-trigger` 等元素都已存在。

> ⚠️ 載入順序很重要：`menu.js` 必須在 `navbar.js` 之前，否則事件綁不到。

---

## 3. 安裝（在新頁面套用）

任何頁面要使用這套選單，只需 3 步：

### 步驟 1 — 在桌面 nav 放空容器

把 header 裡原本手寫的桌面選單，改成一個空容器：

```html
<div
    id="desktop-nav"
    class="hidden space-x-8 md:flex md:items-center"
></div>
```

### 步驟 2 — 在手機選單放空容器

把 `#mobile-menu` 裡原本手寫的項目，改成一個空容器
（保留外層 `#mobile-menu`、關閉按鈕不動）：

```html
<div id="mobile-nav-list"></div>
```

### 步驟 3 — 引入 script（順序固定）

在頁面底部，`navbar.js` **之前**引入 `menu.js`：

```html
<script src="./javascript/menu.js"></script>
<script src="./javascript/navbar.js"></script>
```

完成。`menu.js` 內含 null 檢查，找不到容器的頁面會自動略過、不報錯。

---

## 4. 使用（維護選單內容）

只改 `javascript/menu.js` 最上方的 `menuConfig`，桌面與手機會同步更新。

### 資料結構

```js
{
    label: "顯示文字",   // 必填
    href: "連結網址",    // 必填
    children: [ ... ],   // 選填：有子項目就放陣列，可再巢狀
}
```

### 範例

```js
const menuConfig = [
    { label: "Home", href: "index.html" },
    { label: "Company", href: "about.html" },
    {
        label: "Products",
        href: "product.html",
        children: [
            { label: "All Products", href: "product.html" },
            {
                label: "CNC Machining",
                href: "#",
                children: [
                    { label: "Milling", href: "#" },
                    { label: "Turning", href: "#" },
                    { label: "Drilling", href: "#" },
                ],
            },
            { label: "Surface Finish", href: "#" },
        ],
    },
    { label: "News", href: "news.html" },
    { label: "Contact", href: "contact.html" },
];
```

- **新增一個頂層連結** → 在陣列加一個 `{ label, href }`
- **新增下拉** → 給該項目加 `children: [...]`
- **新增第二層子選單** → 在 `children` 的某項再加 `children: [...]`

---

## 5. 層級與樣式對照

渲染器依「深度（depth）」自動套用對應 class（定義於 `css/input.css`）：

| depth | 桌面 | 手機 |
|:---:|------|------|
| 0（頂層） | `nav-item`／有子則 `dropdown-btn` | `mobile-nav-item` |
| 1 | `dropdown-item`／有子則 `desktop-sub-trigger` | `mobile-nav-second-item` |
| 2 | `dropdown-item` | `mobile-nav-third-item` |

> CSS 目前僅定義到**第三層（depth 2）**。資料若放更深的 `children`，
> 桌面第三層以後會被攤平成平面連結、手機不再展開下一層。
> 需要更深層級時，要先在 `css/input.css` 補對應樣式。

---

## 6. 注意事項

- **載入順序**：`menu.js` 一定要在 `navbar.js` 之前。
- **互動邏輯仍在 `navbar.js`**：手風琴開合（`.mobile-toggle-btn`）、桌面子選單防超出視窗（`.desktop-sub-trigger` 的 `open-left`）都由 `navbar.js` 負責，本元件只負責「產生 DOM」。
- **修改 class 後要重新編譯 CSS**：若調整了 `menu.js` 產生的 Tailwind class，執行 `npm run build-current`（或 `npx tailwindcss -i css/input.css -o css/output.css`）讓 Tailwind 掃描到新 class。
- **目前僅 `index.html` 套用**：其他頁面（`home.html` 等）header 仍為各自硬編碼，可依第 3 節逐頁切換。

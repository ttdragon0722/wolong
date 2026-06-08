/**
 * 統一管理 header（桌面）與手機選單的多層級項目。
 *
 * 只需維護下面這份 `menuConfig` 巢狀資料，桌面下拉與手機手風琴會
 * 由同一套遞迴演算法產生，class 沿用 css/input.css 既有設計，
 * 產生的 DOM 與 navbar.js 期望的結構一致（.mobile-toggle-btn /
 * .desktop-sub-trigger / .dropdown-sub-container ...）。
 *
 * 資料結構：
 *   { label: 顯示文字, href: 連結, children?: 子項目[] }
 *
 * 層級對應：
 *   桌面 depth 0 → nav-item / dropdown-btn
 *        depth 1 → dropdown-item / desktop-sub-trigger
 *        depth 2 → dropdown-item（CSS 僅定義到第三層）
 *   手機 depth 0 → mobile-nav-item
 *        depth 1 → mobile-nav-second-item
 *        depth 2 → mobile-nav-third-item
 */

const menuConfig = [
    { label: "Home", href: "#" },
    { label: "Company", href: "#" },
    {
        label: "Products",
        href: "#",
        children: [
            { label: "All Products", href: "#" },
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
    { label: "News", href: "#" },
    { label: "Contact", href: "#" },
];

// 共用的向下箭頭 SVG，依不同位置套用不同 class
const chevron = (cls) =>
    `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;

const hasChildren = (item) =>
    Array.isArray(item.children) && item.children.length > 0;

/* ---------- 桌面：遞迴產生多層下拉 ---------- */
function renderDesktop(items, depth = 0) {
    return items
        .map((item) => {
            if (depth === 0) {
                if (!hasChildren(item)) {
                    return `<a href="${item.href}" class="nav-item">${item.label}</a>`;
                }
                return `
<div class="group dropdown-btn">
    <button class="nav-item dropdown-text">${item.label}${chevron("dropdown-icon group-hover:rotate-180")}</button>
    <div class="dropdown-container group-hover:block">
        <div class="dropdown-banner"></div>
        ${renderDesktop(item.children, 1)}
    </div>
</div>`;
            }

            if (depth === 1 && hasChildren(item)) {
                return `
<div class="group/sub relative desktop-sub-trigger">
    <button class="dropdown-item w-full flex items-center justify-between">${item.label}${chevron("w-4 h-4 -rotate-90 text-gray-400")}</button>
    <div class="dropdown-sub-container group-hover/sub:block">
        <div class="dropdown-sub-banner"></div>
        ${renderDesktop(item.children, 2)}
    </div>
</div>`;
            }

            // depth 1 無子 / depth 2：一律平面連結
            return `<a href="${item.href}" class="dropdown-item">${item.label}</a>`;
        })
        .join("");
}

/* ---------- 手機：遞迴產生手風琴 ---------- */
function renderMobile(items, depth = 0) {
    const itemClass = [
        "mobile-nav-item",
        "mobile-nav-second-item",
        "mobile-nav-third-item",
    ][Math.min(depth, 2)];
    const panelBg = depth === 0 ? "bg-container" : "bg-black/20";
    const arrowRight = depth === 0 ? "right-2" : "right-4";

    return items
        .map((item, i) => {
            // 第二層起，項目之間加分隔線
            const sep = depth === 1 && i > 0 ? " border-t border-white/5" : "";

            if (!hasChildren(item) || depth >= 2) {
                return `<a href="${item.href}" class="${itemClass}${sep}">${item.label}</a>`;
            }

            return `
<div>
    <button class="${itemClass} relative w-full mobile-toggle-btn${sep}">
        ${item.label}
        <div class="absolute top-0 ${arrowRight} h-full flex items-center">
            ${chevron("w-4 h-4 transition-transform duration-200 rotate-180 toggle-icon")}
        </div>
    </button>
    <div class="hidden flex-col ${panelBg}">
        ${renderMobile(item.children, depth + 1)}
    </div>
</div>`;
        })
        .join("");
}

// 在 navbar.js 之前先把選單渲染進容器（此 script 置於 body 末端，DOM 已就緒）
(function mountMenu() {
    const desktop = document.getElementById("desktop-nav");
    const mobile = document.getElementById("mobile-nav-list");
    if (desktop) desktop.innerHTML = renderDesktop(menuConfig);
    if (mobile) mobile.innerHTML = renderMobile(menuConfig);
})();

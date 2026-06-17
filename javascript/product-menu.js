/**
 * 產品分類選單 — 統一管理「桌面側欄」與「手機手風琴」。
 *
 * 只需維護下方這份 `productCategories` 巢狀資料，兩種版型會由同一套渲染
 * 邏輯產生，並支援第二層 toggle 展開／收合（含高度動畫）。class 沿用
 * css/input.css 既有的 sidebar / accordion 設計。
 *
 * 資料結構： { label: 顯示文字, href: 連結, children?: 子項目[] }
 *
 * 整支腳本以 IIFE 包裹，避免變數外洩或與 menu.js 的同名變數衝突。
 */
(function () {
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
        {
            label: "Aluminum Parts",
            href: "product_Aluminum_parts.php",
            children: [
                { label: "Motorcycle Components", href: "#" },
                { label: "Bicycle Components", href: "#" },
            ],
        },
        {
            label: "Automotive │ Motorcycle",
            href: "product_Automotive_Motorcycle.php",
        },
        {
            label: "Special Bolts and Screws",
            href: "product_Special_Bolts_and_Screws.php",
        },
        { label: "Bicycle Parts", href: "#" },
        { label: "Lighting Parts", href: "#" },
    ];

    const hasChildren = (item) =>
        Array.isArray(item.children) && item.children.length > 0;

    // 統一的實心小三角 icon。葉節點固定指向右側；toggle 額外加上
    // .toggle-chevron，展開時由 JS 旋轉 90 度改為指向下方。
    const triangle = (cls) =>
        `<svg class="${cls}" viewBox="0 0 10 16" fill="currentColor"><path d="M10 8L0 16V0L10 8Z" /></svg>`;

    /* ---------- 桌面：sidebar ---------- */
    function renderSidebar(items) {
        const body = items
            .map((item) => {
                if (!hasChildren(item)) {
                    return `
<a href="${item.href}" class="sidebar-item group">
    <span>${item.label}</span>
    ${triangle("icon-svg w-3 h-3")}
</a>`;
                }
                const subs = item.children
                    .map(
                        (c) =>
                            `<a href="${c.href}" class="sidebar-sub-item">${c.label}</a>`,
                    )
                    .join("");
                return `
<div class="sidebar-group">
    <button class="sidebar-item group w-full text-left submenu-toggle">
        <span>${item.label}</span>
        ${triangle("icon-svg w-3 h-3 toggle-chevron")}
    </button>
    <div class="submenu-panel" style="max-height: 0; overflow: hidden;">${subs}</div>
</div>`;
            })
            .join("");

        return `
<h1 class="sidebar-title mb-8">PRODUCTS</h1>
<div class="sidebar-container">${body}</div>`;
    }

    /* ---------- 手機：accordion ---------- */
    function renderAccordion(items) {
        const body = items
            .map((item) => {
                if (!hasChildren(item)) {
                    return `
<a href="${item.href}" class="accordion-link group">
    <span>${item.label}</span>
    ${triangle("w-2 h-2 text-black")}
</a>`;
                }
                const subs = item.children
                    .map(
                        (c) =>
                            `<a href="${c.href}" class="accordion-sub-item">${c.label}</a>`,
                    )
                    .join("");
                return `
<div class="accordion-group">
    <button class="accordion-link group w-full text-left submenu-toggle">
        <span>${item.label}</span>
        ${triangle("w-2 h-2 text-black toggle-chevron")}
    </button>
    <div class="submenu-panel" style="max-height: 0; overflow: hidden;">${subs}</div>
</div>`;
            })
            .join("");

        return `
<input type="checkbox" id="accordion-trigger" class="hidden" />
<label for="accordion-trigger" class="accordion-head">
    <span>Product Categories</span>
    ${triangle("arrow-icon w-3 h-4")}
</label>
<div class="accordion-body">${body}</div>`;
    }

    /* ---------- 第二層 toggle：以 max-height 做高度動畫 ---------- */
    function setupToggles(root) {
        root.querySelectorAll(".submenu-toggle").forEach((btn) => {
            const panel = btn.nextElementSibling; // .submenu-panel
            const icon = btn.querySelector(".toggle-chevron");
            if (!panel) return;

            btn.addEventListener("click", function (e) {
                e.preventDefault();
                const isOpen = panel.classList.contains("is-open");

                if (isOpen) {
                    panel.style.maxHeight = "0px";
                    panel.classList.remove("is-open");
                    if (icon) icon.classList.remove("rotate-90");
                } else {
                    panel.classList.add("is-open");
                    panel.style.maxHeight = panel.scrollHeight + "px";
                    if (icon) icon.classList.add("rotate-90");
                }
            });
        });
    }

    /* ---------- 掛載（此 script 置於 body 末端，DOM 已就緒） ---------- */
    const sidebar = document.getElementById("product-sidebar");
    const accordion = document.getElementById("product-accordion");

    if (sidebar) {
        sidebar.innerHTML = renderSidebar(productCategories);
        setupToggles(sidebar);
    }
    if (accordion) {
        accordion.innerHTML = renderAccordion(productCategories);
        setupToggles(accordion);
    }
})();

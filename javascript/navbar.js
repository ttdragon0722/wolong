document.addEventListener("DOMContentLoaded", function () {
    // --- 1. Navbar Scroll 變色邏輯 ---
    const navbar = document.getElementById("navbar");
    function updateNavbar() {
        if (window.scrollY > 15) {
            navbar.classList.add("nav-bar-scrolling");
        } else {
            navbar.classList.remove("nav-bar-scrolling");
        }
    }
    window.addEventListener("scroll", updateNavbar);
    updateNavbar(); // 初始化執行一次

    // --- 2. Mobile Menu 主開關 ---
    const menuBtn = document.getElementById("mobile-menu-btn");
    const closeBtn = document.getElementById("mobile-menu-close-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    function openMenu() {
        mobileMenu.classList.remove("opacity-0", "pointer-events-none");
        mobileMenu.classList.add("opacity-100", "pointer-events-auto");
        document.body.classList.add("overflow-hidden");
    }

    function closeMenu() {
        mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
        mobileMenu.classList.add("opacity-0", "pointer-events-none");
        document.body.classList.remove("overflow-hidden");
    }

    if(menuBtn && closeBtn) {
        menuBtn.addEventListener("click", openMenu);
        closeBtn.addEventListener("click", closeMenu);
    }

    // --- 3. Mobile Menu 多層級下拉選單 (手風琴邏輯) ---
    // 抓取所有具有 .mobile-toggle-btn 的按鈕
    const toggleBtns = document.querySelectorAll(".mobile-toggle-btn");

    toggleBtns.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            // 取得該按鈕正下方的選單容器
            const subMenu = this.nextElementSibling;
            // 取得按鈕內的箭頭 Icon
            const icon = this.querySelector(".toggle-icon");

            if (subMenu) {
                subMenu.classList.toggle("hidden");
                subMenu.classList.toggle("flex");
            }
            if (icon) {
                icon.classList.toggle("rotate-180");
            }
        });
    });

    // --- 4. Desktop Menu 多層級下拉選單 (hover 顯示) ---
    // 第一層、第二層的展開改由 CSS :hover 處理（見 input.css）。
    // JS 僅在滑入第二層觸發項時，量測第三層下拉是否超出視窗右緣，
    // 必要時套用 .open-left 改為向左展開。
    const desktopNav = document.getElementById("desktop-nav");

    if (desktopNav) {
        desktopNav.querySelectorAll(".desktop-sub-trigger").forEach((trigger) => {
            const subContainer = trigger.querySelector(".dropdown-sub-container");
            if (!subContainer) return;

            trigger.addEventListener("mouseenter", function () {
                // 先還原預設向右狀態，hover 已使其顯示，可正確量測是否超界
                subContainer.classList.remove("open-left");

                const rect = subContainer.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    subContainer.classList.add("open-left");
                }
            });
        });
    }
});
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

    const desktopSubTriggers = document.querySelectorAll(".desktop-sub-trigger");

    desktopSubTriggers.forEach(trigger => {
        trigger.addEventListener("mouseenter", function () {
            // 找到該項目底下的子選單
            const subContainer = this.querySelector(".dropdown-sub-container");
            if (!subContainer) return;

            // 每次移入時先移除 open-left，以還原預設的向右狀態來重新計算
            subContainer.classList.remove("open-left");

            // 取得子選單在畫面上的位置與尺寸資訊
            const rect = subContainer.getBoundingClientRect();
            
            // 判斷：如果子選單的右側邊界 超出 視窗的可用寬度
            if (rect.right > window.innerWidth) {
                // 就替它加上 open-left class，使其往左展開
                subContainer.classList.add("open-left");
            }
        });
    });
});
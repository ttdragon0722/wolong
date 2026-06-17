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

    // --- 4. Desktop Menu 多層級下拉選單 (點擊 toggle 開關) ---
    const desktopNav = document.getElementById("desktop-nav");

    if (desktopNav) {
        // 關閉所有桌面下拉（第二層 + 第三層），並還原箭頭方向
        function closeAllDesktopDropdowns() {
            desktopNav
                .querySelectorAll(".dropdown-container, .dropdown-sub-container")
                .forEach((panel) => panel.classList.remove("block"));
            desktopNav
                .querySelectorAll(".desktop-dropdown-trigger .dropdown-icon")
                .forEach((icon) => icon.classList.remove("rotate-180"));
        }

        // 第一層：點擊頂層按鈕開關第二層（同層互斥）
        desktopNav.querySelectorAll(".desktop-dropdown-trigger").forEach((btn) => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                const container = this.nextElementSibling; // .dropdown-container
                const icon = this.querySelector(".dropdown-icon");
                const willOpen = !container.classList.contains("block");

                closeAllDesktopDropdowns();

                if (willOpen) {
                    container.classList.add("block");
                    if (icon) icon.classList.add("rotate-180");
                }
            });
        });

        // 第二層：點擊子觸發按鈕開關第三層
        desktopNav.querySelectorAll(".desktop-sub-toggle").forEach((btn) => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                const subContainer = this.nextElementSibling; // .dropdown-sub-container
                if (!subContainer) return;

                const willOpen = !subContainer.classList.contains("block");

                // 關閉同一個下拉內其他已展開的第三層
                const parent = this.closest(".dropdown-container");
                if (parent) {
                    parent
                        .querySelectorAll(".dropdown-sub-container")
                        .forEach((p) => p.classList.remove("block"));
                }

                if (willOpen) {
                    // 先還原預設向右狀態再顯示，才能正確量測是否超界
                    subContainer.classList.remove("open-left");
                    subContainer.classList.add("block");

                    const rect = subContainer.getBoundingClientRect();
                    if (rect.right > window.innerWidth) {
                        subContainer.classList.add("open-left");
                    }
                }
            });
        });

        // 點擊選單以外區域時，關閉所有桌面下拉
        document.addEventListener("click", function (e) {
            if (!desktopNav.contains(e.target)) {
                closeAllDesktopDropdowns();
            }
        });
    }
});
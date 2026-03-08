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

    // --- 2. Mobile Menu 主開關 (淡入淡出與鎖定背景滾動) ---
    const menuBtn = document.getElementById("mobile-menu-btn");
    const closeBtn = document.getElementById("mobile-menu-close-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    function openMenu() {
        // 顯示 Menu (淡入)
        mobileMenu.classList.remove("opacity-0", "pointer-events-none");
        mobileMenu.classList.add("opacity-100", "pointer-events-auto");
        // 鎖住背後頁面的 Scroll bar
        document.body.classList.add("overflow-hidden");
    }

    function closeMenu() {
        // 隱藏 Menu (淡出)
        mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
        mobileMenu.classList.add("opacity-0", "pointer-events-none");
        // 釋放背後頁面的 Scroll bar
        document.body.classList.remove("overflow-hidden");
    }

    menuBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);

    // --- 3. Mobile Menu 內 Products 子選單邏輯 ---
    const productsBtn = document.getElementById("mobile-products-btn");
    const productsIcon = document.getElementById("mobile-products-icon");
    const subMenu = productsBtn.nextElementSibling; // 取得下一個兄弟元素 (子選單容器)

    productsBtn.addEventListener("click", function (e) {
        e.preventDefault();
        // 切換子選單的顯示狀態
        subMenu.classList.toggle("hidden");
        subMenu.classList.toggle("flex");
        // 切換箭頭圖示動畫
        productsIcon.classList.toggle("rotate-180");
    });
});

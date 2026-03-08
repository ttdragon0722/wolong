document.addEventListener("DOMContentLoaded", function () {
    const backToTopBtn = document.getElementById("backToTop");

    // 監聽滾動事件
    window.addEventListener("scroll", () => {
        // 當頁面下滑超過 400px 時顯示，否則隱藏
        if (window.scrollY > 400) {
            backToTopBtn.classList.remove(
                "opacity-0",
                "invisible",
                "translate-y-10",
            );
            backToTopBtn.classList.add(
                "opacity-100",
                "visible",
                "translate-y-0",
            );
        } else {
            backToTopBtn.classList.add(
                "opacity-0",
                "invisible",
                "translate-y-10",
            );
            backToTopBtn.classList.remove(
                "opacity-100",
                "visible",
                "translate-y-0",
            );
        }
    });

    // 點擊事件：平滑回頂
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
});

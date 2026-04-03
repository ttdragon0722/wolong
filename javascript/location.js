document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".location-tab");
    const cards = document.querySelectorAll(".location-card");

    if (!tabs.length || !cards.length) return;

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            const region = this.dataset.region;

            // 更新 active tab
            tabs.forEach(function (t) {
                t.classList.remove("is-active");
            });
            this.classList.add("is-active");

            // 顯示 / 隱藏 cards
            cards.forEach(function (card) {
                if (region === "all" || card.dataset.region === region) {
                    card.classList.remove("is-hidden");
                } else {
                    card.classList.add("is-hidden");
                }
            });
        });
    });
});

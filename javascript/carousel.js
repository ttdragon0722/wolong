document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carousel-track");
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const indicatorsContainer = document.getElementById("indicators");

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    // 1. 初始化圓點
    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = `w-12 h-1 rounded-full transition-all duration-300 bg-white/30 hover:bg-white/60`;
        dot.addEventListener("click", () => {
            goToSlide(i);
            resetAutoPlay();
        });
        indicatorsContainer.appendChild(dot);
    });
    const dots = Array.from(indicatorsContainer.children);

    // 2. 更新輪播畫面
    function updateCarousel() {
        // 計算移動距離
        const amountToMove = currentIndex * 100;
        track.style.transform = `translateX(-${amountToMove}%)`;

        // 更新圓點顏色
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.remove("bg-white/30");
                dot.classList.add("bg-primary");
            } else {
                dot.classList.add("bg-white/30");
                dot.classList.remove("bg-primary");
            }
        });
    }

    // 3. 切換邏輯 (包含邊界檢查)
    function goToSlide(index) {
        if (index < 0) {
            // 如果在第一張按上一頁，跳到最後一張
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            // 如果在最後一張按下一頁，跳回第一張
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        updateCarousel();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // 4. 自動播放
    function startAutoPlay() {
        // 避免重複啟動
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 5. 事件綁定
    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoPlay();
    });

    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoPlay();
    });

    // 滑鼠懸停時暫停
    const carouselContainer = document.getElementById("carousel");
    carouselContainer.addEventListener("mouseenter", stopAutoPlay);
    carouselContainer.addEventListener("mouseleave", startAutoPlay);

    // 啟動
    updateCarousel();
    startAutoPlay();
});

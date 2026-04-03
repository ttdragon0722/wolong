document.addEventListener("DOMContentLoaded", function () {
    // ===== 圖片資料 =====
    const images = [
        { src: "https://placehold.co/800x600/d1d5db/6b7280?text=Photo+01", alt: "Photo 01" },
        { src: "https://placehold.co/800x600/e2e8f0/64748b?text=Photo+02", alt: "Photo 02" },
        { src: "https://placehold.co/800x600/dbeafe/3b82f6?text=Photo+03", alt: "Photo 03" },
        { src: "https://placehold.co/800x600/dcfce7/16a34a?text=Photo+04", alt: "Photo 04" },
        { src: "https://placehold.co/800x600/fef9c3/ca8a04?text=Photo+05", alt: "Photo 05" },
        { src: "https://placehold.co/800x600/fee2e2/ef4444?text=Photo+06", alt: "Photo 06" },
        { src: "https://placehold.co/800x600/f3e8ff/9333ea?text=Photo+07", alt: "Photo 07" },
        { src: "https://placehold.co/800x600/d1fae5/059669?text=Photo+08", alt: "Photo 08" },
        { src: "https://placehold.co/800x600/ffedd5/ea580c?text=Photo+09", alt: "Photo 09" },
        { src: "https://placehold.co/800x600/cffafe/0891b2?text=Photo+10", alt: "Photo 10" },
        { src: "https://placehold.co/800x600/fce7f3/db2777?text=Photo+11", alt: "Photo 11" },
        { src: "https://placehold.co/800x600/e0e7ff/4f46e5?text=Photo+12", alt: "Photo 12" },
    ];

    const grid = document.getElementById("gallery-grid");
    const overlay = document.getElementById("gallery-lb-overlay");
    const lbImg = document.getElementById("gallery-lb-img");
    const lbThumbsContainer = document.getElementById("gallery-lb-thumbs");
    const lbClose = document.getElementById("gallery-lb-close");
    const lbPrev = document.getElementById("gallery-lb-prev");
    const lbNext = document.getElementById("gallery-lb-next");

    let currentIndex = 0;
    let isOpen = false;

    // ===== 1. 建立 Grid =====
    images.forEach(function (image, index) {
        const item = document.createElement("div");
        item.className = "group relative aspect-square overflow-hidden cursor-zoom-in";

        const img = document.createElement("img");
        img.src = image.src;
        img.alt = image.alt;
        img.className = "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110";

        item.appendChild(img);
        item.addEventListener("click", function () {
            openLightbox(index, img);
        });
        grid.appendChild(item);
    });

    // ===== 2. 建立 Lightbox 縮圖列 =====
    images.forEach(function (image, index) {
        const thumb = document.createElement("img");
        thumb.src = image.src;
        thumb.alt = image.alt;
        thumb.className = "lb-thumb";
        thumb.addEventListener("click", function () {
            navigateTo(index);
        });
        lbThumbsContainer.appendChild(thumb);
    });

    // ===== 3. 開啟 Lightbox（含縮放動畫）=====
    function openLightbox(index, clickedImg) {
        if (isOpen) return;
        isOpen = true;
        currentIndex = index;
        document.body.style.overflow = "hidden";

        // 從點擊位置縮放動畫
        const rect = clickedImg.getBoundingClientRect();
        const clone = clickedImg.cloneNode();
        Object.assign(clone.style, {
            position: "fixed",
            top: rect.top + "px",
            left: rect.left + "px",
            width: rect.width + "px",
            height: rect.height + "px",
            zIndex: "10001",
            objectFit: "cover",
            transition: "all 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
            margin: "0",
            borderRadius: "0",
        });
        document.body.appendChild(clone);

        overlay.classList.add("active");
        updateLbImg();
        updateThumbs();

        // 強制 reflow 後觸發動畫
        clone.offsetWidth;
        Object.assign(clone.style, {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(85vw, 1200px)",
            height: "80vh",
            objectFit: "contain",
        });

        setTimeout(function () {
            if (clone.parentNode) clone.parentNode.removeChild(clone);
            lbImg.classList.add("visible");
        }, 450);
    }

    // ===== 4. 關閉 Lightbox =====
    function closeLightbox() {
        if (!isOpen) return;
        overlay.classList.remove("active");
        lbImg.classList.remove("visible");
        document.body.style.overflow = "";
        isOpen = false;
    }

    // ===== 5. 切換圖片 =====
    function navigateTo(index) {
        currentIndex = (index + images.length) % images.length;
        lbImg.classList.remove("visible");
        setTimeout(function () {
            updateLbImg();
            updateThumbs();
            lbImg.classList.add("visible");
        }, 150);
    }

    function updateLbImg() {
        lbImg.src = images[currentIndex].src;
        lbImg.alt = images[currentIndex].alt;
    }

    function updateThumbs() {
        lbThumbsContainer.querySelectorAll(".lb-thumb").forEach(function (t, i) {
            t.classList.toggle("active", i === currentIndex);
        });
        const activThumb = lbThumbsContainer.querySelectorAll(".lb-thumb")[currentIndex];
        if (activThumb) {
            activThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }

    // ===== 6. 事件綁定 =====
    lbClose.addEventListener("click", closeLightbox);

    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeLightbox();
    });

    lbPrev.addEventListener("click", function (e) {
        e.stopPropagation();
        navigateTo(currentIndex - 1);
    });

    lbNext.addEventListener("click", function (e) {
        e.stopPropagation();
        navigateTo(currentIndex + 1);
    });

    document.addEventListener("keydown", function (e) {
        if (!isOpen) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") navigateTo(currentIndex - 1);
        if (e.key === "ArrowRight") navigateTo(currentIndex + 1);
    });
});

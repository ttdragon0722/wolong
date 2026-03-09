document.addEventListener("DOMContentLoaded", function () {
    // ================= 1. 數量增減功能 =================
    const qtyMinus = document.getElementById("qty-minus");
    const qtyPlus = document.getElementById("qty-plus");
    const qtyInput = document.getElementById("qty-input");

    qtyMinus.addEventListener("click", () => {
        let currentValue = parseInt(qtyInput.value) || 1;
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });

    qtyPlus.addEventListener("click", () => {
        let currentValue = parseInt(qtyInput.value) || 1;
        qtyInput.value = currentValue + 1;
    });

    // 避免手動輸入負數或非數字
    qtyInput.addEventListener("change", () => {
        let currentValue = parseInt(qtyInput.value);
        if (isNaN(currentValue) || currentValue < 1) {
            qtyInput.value = 1;
        }
    });

    // ================= 2. 多圖片切換功能 =================
    const mainImg = document.getElementById("product-img");
    const thumbnails = document.querySelectorAll(".thumbnail");

    thumbnails.forEach((thumb) => {
        thumb.addEventListener("click", function () {
            // 更換主圖的 src
            mainImg.src = this.src;

            // 更新縮圖的邊框樣式 (標示當前選中)
            thumbnails.forEach((t) => {
                t.classList.remove("border-primary");
                t.classList.add("border-transparent");
            });
            this.classList.remove("border-transparent");
            this.classList.add("border-primary");
        });
    });

    // ================= 3. 您原本的 Lightbox 功能 =================
    const productImg = document.getElementById("product-img");
    const lightboxBg = document.getElementById("lightbox-bg");
    let isLightboxOpen = false;
    let cloneImg = null;

    productImg.addEventListener("click", () => {
        if (isLightboxOpen) return;
        isLightboxOpen = true;

        document.body.style.overflow = "hidden";

        const rect = productImg.getBoundingClientRect();
        cloneImg = productImg.cloneNode();

        cloneImg.style.position = "fixed";
        cloneImg.style.top = rect.top + "px";
        cloneImg.style.left = rect.left + "px";
        cloneImg.style.width = rect.width + "px";
        cloneImg.style.height = rect.height + "px";
        cloneImg.style.zIndex = "51";
        cloneImg.style.borderRadius = "0.5rem";
        cloneImg.style.objectFit = "contain";
        cloneImg.style.cursor = "zoom-out";
        cloneImg.style.transition = "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
        cloneImg.classList.remove("hover:opacity-90");

        document.body.appendChild(cloneImg);
        productImg.style.opacity = "0";
        lightboxBg.classList.add("active");

        cloneImg.offsetWidth;

        cloneImg.style.top = "50%";
        cloneImg.style.left = "50%";
        cloneImg.style.transform = "translate(-50%, -50%)";
        cloneImg.style.width = "85vw";
        cloneImg.style.height = "85vh";

        const closeLightbox = () => {
            document.body.style.overflow = "";

            const newRect = productImg.getBoundingClientRect();
            lightboxBg.classList.remove("active");

            cloneImg.style.transform = "translate(0, 0)";
            cloneImg.style.top = newRect.top + "px";
            cloneImg.style.left = newRect.left + "px";
            cloneImg.style.width = newRect.width + "px";
            cloneImg.style.height = newRect.height + "px";

            setTimeout(() => {
                if (cloneImg && cloneImg.parentNode) {
                    cloneImg.parentNode.removeChild(cloneImg);
                }
                productImg.style.opacity = "1";
                isLightboxOpen = false;
            }, 500);
        };

        lightboxBg.addEventListener("click", closeLightbox, { once: true });
        cloneImg.addEventListener("click", closeLightbox, { once: true });
    });
});

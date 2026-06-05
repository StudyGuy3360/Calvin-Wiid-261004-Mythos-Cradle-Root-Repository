document.addEventListener("DOMContentLoaded", () => {
    console.log("eee");

    // ----------variables
    // search
    const searchInputField = document.querySelector(".searchInput .input");

    // cards
    const firstProductCard = document.querySelector(".productCard1, .productCard2");
    const productListContainer = firstProductCard?.parentElement;

    // sorting
    const sortDropdownSelect = document.querySelector(".sort-select");

    // cart
    const taskSubmissionForm = document.getElementById("taskForm");
    const openCartModalButton = document.getElementById("openCartModalBtn");
    const petCartModal = document.getElementById("petModal");
    const continueSearchingButton = document.getElementById("continueSearchingBtn");
    const clearAllTasksButton = document.getElementById("clearTasks");
    let cradleNotesCollection = JSON.parse(localStorage.getItem("cradleNotes")) || [];

    // Modal
    const taskItemsContainer = document.getElementById("taskContainer");

    // -------------------------------------------------------functions 1
    // cart
    const renderNotes = () => {
        if (!taskItemsContainer) return;
        
        if (!cradleNotesCollection.length) {
            taskItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 60px 0; color: #a1a1aa; font-size: 18px;">
                    Your cradle is currently empty.
                </div>`;
            return;
        }

        taskItemsContainer.innerHTML = cradleNotesCollection.map((item, index) => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#f4f4f5; padding:16px; margin-bottom:12px; border-radius:6px; border:1px solid #e4e4e7;">
                <span style="font-size:16px; font-weight:600; color:#18181b;">${item.name || item}</span>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="display: flex; align-items: center; background: white; border: 1px solid #d4d4d8; border-radius: 4px; overflow: hidden;">
                        <button data-index="${index}" class="cart-qty-minus" style="background: none; border: none; padding: 8px 12px; font-weight: bold; cursor: pointer;">-</button>
                        <span style="padding: 0 4px; min-width: 24px; text-align: center; font-size: 14px; font-weight: 600;">${item.qty || 1}</span>
                        <button data-index="${index}" class="cart-qty-plus" style="background: none; border: none; padding: 8px 12px; font-weight: bold; cursor: pointer;">+</button>
                    </div>
                    <button data-index="${index}" class="delete-note-btn" style="background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer; padding:8px 14px;">Remove</button>
                </div>
            </div>
        `).join("");
    };

    // ----------------------------------------------------- functions 2
    // search
    searchInputField?.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll(".productCard1, .productCard2").forEach(card => {
            const name = card.querySelector("h2")?.textContent.toLowerCase() || "";
            card.style.display = name.includes(query) ? "" : "none";
        });
    });

    // cards
    productListContainer && document.body.addEventListener("click", (e) => {
        const btn = e.target;
        if (btn.tagName === "BUTTON" && (btn.textContent === "+" || btn.textContent === "-")) {
            const qtySpan = btn.closest("[class^='quantitySelector']")?.querySelector("span");
            if (qtySpan) {
                let current = parseInt(qtySpan.textContent, 10) || 1;
                qtySpan.textContent = btn.textContent === "+" ? current + 1 : Math.max(1, current - 1);
            }
        }
    });

    // sorting
    sortDropdownSelect && productListContainer && sortDropdownSelect.addEventListener("change", (e) => {
        const cards = Array.from(document.querySelectorAll(".productCard1, .productCard2"));
        const getPrice = card => parseFloat(card.querySelector("[class^='currentPrice']")?.textContent.replace(/[^\d.]/g, '')) || 0;

        cards.sort((a, b) => e.target.value.includes("Low to High") ? getPrice(a) - getPrice(b) : getPrice(b) - getPrice(a))
             .forEach(card => productListContainer.appendChild(card));
    });

    // Modal
    openCartModalButton && petCartModal && openCartModalButton.addEventListener("click", () => {
        petCartModal.style.display = "block";
        renderNotes();
    });

    // Modal
    continueSearchingButton && petCartModal && continueSearchingButton.addEventListener("click", () => {
        petCartModal.style.display = "none";
    });

    // Modal
    taskSubmissionForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("taskInput");
        const value = input?.value.trim();
        if (value) {
            cradleNotesCollection.push(value);
            localStorage.setItem("cradleNotes", JSON.stringify(cradleNotesCollection));
            input.value = "";
            renderNotes();
        }
    });

    // Modal
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cradle")) {
            const card = e.target.closest(".productCard1, .productCard2");
            if (card) {
                const name = card.querySelector("h2")?.textContent.trim() || "Unknown Creature";
                const qty = card.querySelector("[class^='quantitySelector'] span")?.textContent.trim() || "1";
                const item = `${name} (x${qty})`;

                cradleNotesCollection.push(item);
                localStorage.setItem("cradleNotes", JSON.stringify(cradleNotesCollection));
                alert(`${item} has been added to your cradle`);
                renderNotes();
            }
        }
    });

    // Modal
    taskItemsContainer?.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-note-btn")) {
            cradleNotesCollection.splice(e.target.getAttribute("data-index"), 1);
            localStorage.setItem("cradleNotes", JSON.stringify(cradleNotesCollection));
            renderNotes();
        }
    });

    // Modal
    clearAllTasksButton?.addEventListener("click", () => {
        cradleNotesCollection = [];
        localStorage.removeItem("cradleNotes");
        renderNotes();
    });

    // modal
    taskItemsContainer?.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"), 10);
        if (isNaN(index)) return;

        if (e.target.classList.contains("cart-qty-plus")) {
            cradleNotesCollection[index].qty = (cradleNotesCollection[index].qty || 1) + 1;
        } else if (e.target.classList.contains("cart-qty-minus")) {
            if ((cradleNotesCollection[index].qty || 1) > 1) {
                cradleNotesCollection[index].qty -= 1;
            } else {
                cradleNotesCollection.splice(index, 1);
            }
        } else {
            return;
        }
        localStorage.setItem("cradleNotes", JSON.stringify(cradleNotesCollection));
        renderNotes();
    });
});


// ////////////////////////////////////////////
// modal2
const openCartModalButton2 = document.getElementById("submit"); 
const petCartModal2 = document.getElementById("petCartModal2");
const continueSearchingButton2 = document.getElementById("continueSearchingButton2");
const taskSubmissionForm2 = document.getElementById("taskSubmissionForm2");
const taskItemsContainer2 = document.getElementById("taskItemsContainer2");
const clearAllTasksButton2 = document.getElementById("clearAllTasksButton2");

// modal2

openCartModalButton2 && petCartModal2 && openCartModalButton2.addEventListener("click", () => {
    const nameInput = document.getElementById("name");
    const modalNamePlaceholder = document.getElementById("userNameSpan2");

    if (nameInput && modalNamePlaceholder) {
        const enteredName = nameInput.value.trim();
        modalNamePlaceholder.textContent = enteredName;
    }

    petCartModal2.style.display = "flex";
    renderNotes2();
});
continueSearchingButton2 && petCartModal2 && continueSearchingButton2.addEventListener("click", () => {
    petCartModal2.style.display = "none"; 
});

// modal2
clearAllTasksButton2?.addEventListener("click", () => {
    cradleNotesCollection2 = [];
    localStorage.removeItem("cradleNotes2");
    renderNotes2();
});

// /////////////////////////////////////////////////////////////////
// slider
const sliderTrack2 = document.getElementById("sliderTrack2");
const prevBtn2 = document.getElementById("prevSlideBtn2");
const nextBtn2 = document.getElementById("nextSlideBtn2");

let currentSlideIndex2 = 0;

if (sliderTrack2 && prevBtn2 && nextBtn2) {
    const totalSlides2 = sliderTrack2.querySelectorAll("img").length;

  
    const updateSliderPosition2 = () => {
        sliderTrack2.style.transform = `translateX(-${currentSlideIndex2 * 100}%)`;
    };

    // Next Button Click Listener
    nextBtn2.addEventListener("click", () => {
        if (currentSlideIndex2 < totalSlides2 - 1) {
            currentSlideIndex2++;
        } else {
            currentSlideIndex2 = 0;
        }
        updateSliderPosition2();
    });

    // slider
    prevBtn2.addEventListener("click", () => {
        if (currentSlideIndex2 > 0) {
            currentSlideIndex2--;
        } else {
            currentSlideIndex2 = totalSlides2 - 1;
        }
        updateSliderPosition2();
    });
}
document.addEventListener("DOMContentLoaded", () => {
    console.log("eee");

    // ----------variables
    // search
    const searchInputField = document.querySelector(".searchInput .input");

    // cards
    const firstProductCard = document.querySelector(".productCard1, .productCard2");
    const productListContainer = firstProductCard ? firstProductCard.parentElement : null;

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

        taskItemsContainer.innerHTML = "";

        cradleNotesCollection.forEach((noteText, index) => {
            const itemWrapper = document.createElement("div");
            itemWrapper.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:#f4f4f5; padding:10px; margin-bottom:8px; border-radius:4px;";
            
            itemWrapper.innerHTML = `
                <span style="font-size:14px; color:#27272a;">${noteText}</span>
                <button data-index="${index}" class="delete-note-btn" style="background:#dc3545; color:white; border:none; border-radius:3px; cursor:pointer; padding:4px 8px; font-size:12px;">Delete</button>
            `;
            
            taskItemsContainer.appendChild(itemWrapper);
        });
    };

    // ----------------------------------------------------- functions 2
    // search
    if (searchInputField) {
        searchInputField.addEventListener("input", (event) => {
            const searchQuery = event.target.value.toLowerCase().trim();
            const productCardItems = document.querySelectorAll(".productCard1, .productCard2");
            
            productCardItems.forEach((cardItem) => {
                const headingElement = cardItem.querySelector("h2");
                const productName = headingElement ? headingElement.textContent.toLowerCase() : "";
                
                cardItem.style.display = productName.includes(searchQuery) ? "" : "none";
            });
        });
    }

    // cards
    if (productListContainer) {
        document.body.addEventListener("click", (event) => {
            const clickedElement = event.target;
            const isPlusOrMinus = clickedElement.textContent === "+" || clickedElement.textContent === "-";

            if (clickedElement.tagName === "BUTTON" && isPlusOrMinus) {
                const quantityWrapper = clickedElement.closest("[class^='quantitySelector']");
                const quantityValueElement = quantityWrapper?.querySelector("span");

                if (quantityValueElement) {
                    let currentQuantity = parseInt(quantityValueElement.textContent, 10) || 1;
                    
                    if (clickedElement.textContent === "+") {
                        currentQuantity++;
                    } else if (clickedElement.textContent === "-" && currentQuantity > 1) {
                        currentQuantity--;
                    }
                    
                    quantityValueElement.textContent = currentQuantity;
                }
            }
        });

        // sorting
        if (sortDropdownSelect) {
            sortDropdownSelect.addEventListener("change", (event) => {
                const chosenSortOption = event.target.value;
                const unsortedCardsArray = Array.from(document.querySelectorAll(".productCard1, .productCard2"));
                
                const parseNumericPrice = (cardElement) => {
                    const priceSpanElement = cardElement.querySelector("[class^='currentPrice']");
                    return parseFloat(priceSpanElement?.textContent.replace(/[^\d.]/g, '')) || 0;
                };

                unsortedCardsArray.sort((cardA, cardB) => {
                    const priceA = parseNumericPrice(cardA);
                    const priceB = parseNumericPrice(cardB);
                    return chosenSortOption.includes("Low to High") ? priceA - priceB : priceB - priceA;
                });
                
                unsortedCardsArray.forEach((sortedCardItem) => {
                    productListContainer.appendChild(sortedCardItem);
                });
            });
        }
    }

    // Modal
    if (openCartModalButton && petCartModal) {
        openCartModalButton.addEventListener("click", () => {
            petCartModal.style.display = "block";
            renderNotes();
        });
    }

    // Modal
    if (continueSearchingButton && petCartModal) {
        continueSearchingButton.addEventListener("click", () => {
            petCartModal.style.display = "none";
        });
    }

    // Modal
    if (taskSubmissionForm) {
        taskSubmissionForm.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const textInputElement = document.getElementById("taskInput");
            const cleanInputValue = textInputElement?.value.trim();

            if (cleanInputValue) {
                cradleNotesCollection.push(cleanInputValue);
                localStorage.setItem("cradleNotes", JSON.stringify(cradleNotesCollection));
                textInputElement.value = "";
                renderNotes();
            }
        });
    }

    // Modal
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cradle")) {
            const parentProductCard = e.target.closest(".productCard1, .productCard2");
            
            if (parentProductCard) {
                const headingElement = parentProductCard.querySelector("h2");
                const quantityElement = parentProductCard.querySelector("[class^='quantitySelector'] span");
                
                const creatureName = headingElement ? headingElement.textContent.trim() : "Unknown Creature";
                const currentQuantity = quantityElement ? quantityElement.textContent.trim() : "1";
                const formattedItemString = `${creatureName} (x${currentQuantity})`;

                cradleNotesCollection.push(formattedItemString);
                localStorage.setItem("cradleNotes", JSON.stringify(cradleNotesCollection));
                
                alert(`${formattedItemString} has been added to your cradle cart allocation!`);
                renderNotes();
            }
        }
    });

    // Modal
    if (taskItemsContainer) {
        taskItemsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-note-btn")) {
                const selectedTargetIndex = e.target.getAttribute("data-index");
                
                cradleNotesCollection.splice(selectedTargetIndex, 1);
                localStorage.setItem("cradleNotes", JSON.stringify(cradleNotesCollection));
                
                renderNotes();
            }
        });
    }

    // Modal
    if (clearAllTasksButton) {
        clearAllTasksButton.addEventListener("click", () => {
            cradleNotesCollection = [];
            localStorage.removeItem("cradleNotes");
            renderNotes();
        });
    }
});
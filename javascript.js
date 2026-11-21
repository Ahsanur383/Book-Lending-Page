/* -------------------- Select required navbar elements -------------------- */
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-links a");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#book-search");

/* -------------------- Open/close mobile menu -------------------- */
menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

/* -------------------- Active menu link and mobile menu close -------------------- */
navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");

        if (window.innerWidth <= 960) {
            navMenu.classList.remove("open");
            menuToggle.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open menu");
        }
    });
});

/* -------------------- Search form submission -------------------- */
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    applyBookFilters();
    document.querySelector("#all-books").scrollIntoView({ behavior: "smooth" });
});

/* -------------------- Featured book cart and details actions -------------------- */
const cartCount = document.querySelector(".cart-count");
const addToCartButtons = document.querySelectorAll(".add-cart-button");
const detailsButtons = document.querySelectorAll(".details-button");
const cartButton = document.querySelector(".cart-button");
const cartPanel = document.querySelector(".cart-panel");
const closeCartButton = document.querySelector(".close-cart");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total strong");
const checkoutButton = document.querySelector(".checkout-button");

let cartItems = JSON.parse(localStorage.getItem("bookLendingCart") || "[]");

const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const actionDivider = document.querySelector(".action-divider");

if (sessionStorage.getItem("bookLendingLoggedIn") === "true") {
    loginLink.textContent = "My Account";
    loginLink.href = "account.html#profile";
    registerLink.hidden = true;
    actionDivider.hidden = true;
}

function openCart(open) {
    cartPanel.classList.toggle("open", open);
    cartPanel.setAttribute("aria-hidden", String(!open));
    cartButton.setAttribute("aria-expanded", String(open));
}

function updateCart() {
    localStorage.setItem("bookLendingCart", JSON.stringify(cartItems));
    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartCount.textContent = "0";
        cartButton.setAttribute("aria-label", "Shopping cart with 0 items");
        cartTotal.textContent = "$0.00";
        return;
    }

    let itemCount = 0;
    let total = 0;

    cartItems.forEach((item, index) => {
        itemCount += item.quantity;
        total += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title} cover">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                <div class="quantity-controls">
                    <button type="button" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
                </div>
            </div>
            <button class="remove-cart-item" type="button" data-index="${index}" aria-label="Remove ${item.title}">&times;</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartCount.textContent = String(itemCount);
    cartButton.setAttribute("aria-label", `Shopping cart with ${itemCount} items`);
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("bump");
}

addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".book-card");
        const title = button.dataset.title;
        const image = card.querySelector(".book-card-image img").getAttribute("src");
        const price = Number(card.querySelector(".book-price strong").textContent.replace("$", ""));
        const existingItem = cartItems.find((item) => item.title === title);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ title, image, price, quantity: 1 });
        }

        updateCart();
        openCart(true);

        const originalText = button.lastChild.textContent;
        button.lastChild.textContent = " Added";
        button.disabled = true;

        setTimeout(() => {
            button.lastChild.textContent = originalText;
            button.disabled = false;
        }, 900);
    });
});

cartItemsContainer.addEventListener("click", (event) => {
    const quantityButton = event.target.closest("[data-action]");
    if (quantityButton) {
        const index = Number(quantityButton.dataset.index);
        const item = cartItems[index];

        if (quantityButton.dataset.action === "increase") item.quantity += 1;
        if (quantityButton.dataset.action === "decrease") item.quantity -= 1;
        if (item.quantity < 1) cartItems.splice(index, 1);

        updateCart();
        return;
    }

    const removeButton = event.target.closest(".remove-cart-item");
    if (!removeButton) return;

    const item = removeButton.closest(".cart-item");
    item.classList.add("removing");
    setTimeout(() => {
        cartItems.splice(Number(removeButton.dataset.index), 1);
        updateCart();
    }, 220);
});

cartButton.addEventListener("click", () => {
    openCart(!cartPanel.classList.contains("open"));
});

closeCartButton.addEventListener("click", () => openCart(false));

document.addEventListener("click", (event) => {
    if (!event.target.closest(".cart-wrapper")) {
        openCart(false);
    }
});

checkoutButton.addEventListener("click", () => {
    if (cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    openCart(false);
    document.querySelector("#checkout").scrollIntoView({ behavior: "smooth" });
});

detailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
        alert(`${button.dataset.title} details`);
    });
});

/* -------------------- Buy Now actions -------------------- */
const buyNowButtons = document.querySelectorAll(".buy-now-button");

buyNowButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const matchingButton = Array.from(addToCartButtons).find(
            (cartButtonItem) => cartButtonItem.dataset.title === button.dataset.title
        );

        if (matchingButton) {
            matchingButton.click();
        }
    });
});

/* -------------------- Book category selection -------------------- */
const categoryCards = document.querySelectorAll(".category-card");

categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
        categoryCards.forEach((item) => item.classList.remove("selected"));
        card.classList.add("selected");
        const category = card.dataset.category;
        if (Array.from(categoryFilter.options).some((option) => option.value === category)) {
            categoryFilter.value = category;
            currentPage = 1;
            applyBookFilters();
        }
    });
});

/* -------------------- Customer review form -------------------- */
const reviewButton = document.querySelector(".write-review-button");
const reviewForm = document.querySelector(".review-form");
reviewButton.addEventListener("click", () => reviewForm.classList.toggle("open"));
reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = reviewForm.elements.name.value.trim();
    const rating = Number(reviewForm.elements.rating.value);
    const comment = reviewForm.elements.comment.value.trim();
    const initials = name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpper();
    const card = document.createElement("article");
    card.className = "review-card";
    card.innerHTML = `<span class="customer-avatar">${initials}</span><h3>${name}</h3><p class="review-stars">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p><p class="review-comment">${comment}</p>`;
    document.querySelector(".review-grid").prepend(card);
    reviewForm.reset();
    reviewForm.classList.remove("open");
});

/* -------------------- Checkout confirmation -------------------- */
const checkoutForm = document.querySelector("#checkout-form");
const orderModal = document.querySelector("#order-modal");
const closeOrderModal = document.querySelector(".close-order-modal");
const continueShoppingButton = document.querySelector(".continue-shopping-button");

checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    document.querySelector("#order-number").textContent =
        `Order #BL-${Math.floor(1000 + Math.random() * 9000)}`;
    orderModal.classList.add("open");
    orderModal.setAttribute("aria-hidden", "false");
});

function closeOrder() {
    orderModal.classList.remove("open");
    orderModal.setAttribute("aria-hidden", "true");
}

closeOrderModal.addEventListener("click", closeOrder);
continueShoppingButton.addEventListener("click", closeOrder);
orderModal.addEventListener("click", (event) => {
    if (event.target === orderModal) closeOrder();
});

/* -------------------- Wishlist, search, filter, sorting and pagination -------------------- */
const bookGrid = document.querySelector(".book-grid");
const bookCards = Array.from(document.querySelectorAll(".featured-books .book-card"));
const categoryFilter = document.querySelector("#book-category-filter");
const sortSelect = document.querySelector("#book-sort");
const pagination = document.querySelector(".pagination");
let wishlist = JSON.parse(localStorage.getItem("bookLendingWishlist") || "[]");
let currentPage = 1;
const booksPerPage = 4;

function syncWishlistButtons() {
    document.querySelectorAll(".wishlist-button").forEach((button) => {
        const active = wishlist.includes(button.dataset.title);
        button.classList.toggle("active", active);
        button.textContent = active ? "♥" : "♡";
        button.setAttribute("aria-label", `${active ? "Remove" : "Add"} ${button.dataset.title} ${active ? "from" : "to"} wishlist`);
    });
}

function applyBookFilters() {
    const query = searchInput.value.trim().toLower();
    const category = categoryFilter.value;
    let visibleCards = bookCards.filter((card) => {
        const title = card.querySelector("h3").textContent.toLower();
        const author = card.querySelector(".book-author").textContent.toLower();
        const categoryMatches = category === "all" || card.dataset.category === category;
        return categoryMatches && (!query || title.includes(query) || author.includes(query));
    });

    visibleCards.sort((a, b) => {
        if (sortSelect.value === "price-low" || sortSelect.value === "price-high") {
            const priceA = Number(a.querySelector(".book-price strong").textContent.replace("$", ""));
            const priceB = Number(b.querySelector(".book-price strong").textContent.replace("$", ""));
            return sortSelect.value === "price-low" ? priceA - priceB : priceB - priceA;
        }
        if (sortSelect.value === "name") {
            return a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent);
        }
        return bookCards.indexOf(a) - bookCards.indexOf(b);
    });

    visibleCards.forEach((card) => bookGrid.appendChild(card));
    bookCards.forEach((card) => { card.hidden = true; });

    const pageCount = Math.max(1, Math.ceil(visibleCards.length / booksPerPage));
    currentPage = Math.min(currentPage, pageCount);
    const start = (currentPage - 1) * booksPerPage;
    const pagedCards = visibleCards.slice(start, start + booksPerPage);
    pagedCards.forEach((card) => { card.hidden = false; });

    const existingMessage = bookGrid.querySelector(".no-results");
    if (existingMessage) existingMessage.remove();
    if (visibleCards.length === 0) {
        const message = document.createElement("p");
        message.className = "no-results";
        message.textContent = "No books match your search.";
        bookGrid.appendChild(message);
    }

    pagination.innerHTML = "";
    for (let page = 1; page <= pageCount; page += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = String(page);
        button.classList.toggle("active", page === currentPage);
        button.setAttribute("aria-label", `Go to page ${page}`);
        button.addEventListener("click", () => {
            currentPage = page;
            applyBookFilters();
        });
        pagination.appendChild(button);
    }

    syncWishlistButtons();
}

document.querySelectorAll(".wishlist-button").forEach((button) => {
    button.addEventListener("click", () => {
        if (wishlist.includes(button.dataset.title)) {
            wishlist = wishlist.filter((title) => title !== button.dataset.title);
        } else {
            wishlist.push(button.dataset.title);
        }
        localStorage.setItem("bookLendingWishlist", JSON.stringify(wishlist));
        syncWishlistButtons();
    });
});

searchInput.addEventListener("input", () => {
    currentPage = 1;
    applyBookFilters();
});
categoryFilter.addEventListener("change", () => {
    currentPage = 1;
    applyBookFilters();
});
sortSelect.addEventListener("change", () => {
    currentPage = 1;
    applyBookFilters();
});

const newsletterForm = document.querySelector(".newsletter-form");
newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.querySelector(".newsletter-message");
    message.textContent = "Thank you for subscribing!";
    newsletterForm.reset();
});

/* -------------------- Scroll reveal animations -------------------- */
const revealItems = document.querySelectorAll(
    ".section-heading,.featured-books,.best-sellers,.book-categories,.special-offers,.customer-reviews,.checkout-section"
);
revealItems.forEach((item) => item.classList.add("reveal"));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

updateCart();
syncWishlistButtons();
applyBookFilters();
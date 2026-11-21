const defaultBooks = [
    { id: 1, title: "The Blind Justice", author: "SEYYIDALI", category: "Fiction", price: 18.40, stock: 28, image: "../image/1st.jpg" },
    { id: 2, title: "The Positive Mind", author: "Designalle", category: "Self-help", price: 20.40, stock: 7, image: "../image/2end.jpg" },
    { id: 3, title: "Deep Work", author: "Cal Newport", category: "Business", price: 24.00, stock: 42, image: "../image/3rd.jpg" },
    { id: 4, title: "Master Your Emotions", author: "Thibaut Meurisse", category: "Self-help", price: 16.50, stock: 3, image: "../image/4th.jpg" }
];
const defaultCategories = ["Fiction", "Self-help", "Business", "Biography"];
const defaultOrders = [
    { id: "BL-2401", customer: "Ayesha Rahman", date: "Nov 20, 2026", total: 64.80, status: "Processing" },
    { id: "BL-2400", customer: "Tanvir Hasan", date: "Nov 20, 2026", total: 42.40, status: "Shipped" },
    { id: "BL-2399", customer: "Nusrat Jahan", date: "Nov 19, 2026", total: 18.40, status: "Delivered" },
    { id: "BL-2398", customer: "Samiul Islam", date: "Nov 18, 2026", total: 76.00, status: "Completed" }
];
const customers = [
    { name: "Ayesha Rahman", email: "ayesha@example.com", phone: "+880 1712-345678", orders: 8, joined: "Jan 12, 2026" },
    { name: "Tanvir Hasan", email: "tanvir@example.com", phone: "+880 1811-224466", orders: 5, joined: "Mar 04, 2026" },
    { name: "Nusrat Jahan", email: "nusrat@example.com", phone: "+880 1910-119922", orders: 12, joined: "Sep 18, 2025" },
    { name: "Samiul Islam", email: "samiul@example.com", phone: "+880 1612-778899", orders: 3, joined: "Aug 22, 2026" }
];
const reviews = [
    { name: "Ayesha R.", book: "The Blind Justice", stars: "★★★★★", text: "Excellent book and very fast delivery. The cover quality is beautiful.", date: "2 hours ago" },
    { name: "Tanvir H.", book: "Deep Work", stars: "★★★★☆", text: "Very useful ideas. I wish the print was a little larger.", date: "Yesterday" },
    { name: "Nusrat J.", book: "Master Your Emotions", stars: "★★★★★", text: "Simple, practical and inspiring. I would recommend it to everyone.", date: "Nov 18, 2026" }
];

let books = JSON.parse(localStorage.getItem("adminBooks") || "null") || defaultBooks;
let categories = JSON.parse(localStorage.getItem("adminCategories") || "null") || defaultCategories;
let orders = JSON.parse(localStorage.getItem("adminOrders") || "null") || defaultOrders;

const loginScreen = document.querySelector("#loginScreen");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
if (sessionStorage.getItem("adminLoggedIn") === "true") loginScreen.classList.add("hidden");
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#adminEmail").value.trim();
    const password = document.querySelector("#adminPassword").value;
    if (email === "admin@booklending.com" && password === "admin123") {
        sessionStorage.setItem("adminLoggedIn", "true");
        loginScreen.classList.add("hidden");
    } else {
        loginError.textContent = "Invalid email or password.";
    }
});

document.querySelector("#logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("adminLoggedIn");
    loginScreen.classList.remove("hidden");
});

const pageTitles = {
    overview: "Dashboard Overview",
    books: "Manage Books",
    categories: "Manage Categories",
    orders: "Manage Orders",
    customers: "Manage Customers",
    reviews: "Manage Reviews",
    sales: "Sales Report"
};

function showPage(pageName) {
    document.querySelectorAll(".page").forEach(page => page.classList.toggle("active", page.id === pageName));
    document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.page === pageName));
    document.querySelector("#pageTitle").textContent = pageTitles[pageName];
    document.querySelector("#sidebar").classList.remove("open");
}

document.querySelectorAll(".nav-item").forEach(item => item.addEventListener("click", () => showPage(item.dataset.page)));
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => showPage(button.dataset.go)));
document.querySelector("#menuBtn").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));

function saveBooks() {
    localStorage.setItem("adminBooks", JSON.stringify(books));
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function renderBooks() {
    const table = document.querySelector("#bookTable");
    table.innerHTML = books.map(book => `
        <tr>
            <td><div class="book-cell"><img class="book-thumb" src="${escapeHtml(book.image || "../image/1st.jpg")}" alt=""><div><strong>${escapeHtml(book.title)}</strong><br><small>${escapeHtml(book.author)}</small></div></div></td>
            <td>${escapeHtml(book.category)}</td>
            <td><strong>$${Number(book.price).toFixed(2)}</strong></td>
            <td class="${book.stock <= 5 ? "stock-low" : ""}">${book.stock} in stock</td>
            <td><span class="status ${book.stock > 0 ? "completed" : "cancelled"}">${book.stock > 0 ? "In Stock" : "Out of Stock"}</span></td>
            <td><button class="action-btn edit" type="button" data-edit-book="${book.id}" aria-label="Edit ${escapeHtml(book.title)}">✎</button><button class="action-btn delete" type="button" data-delete-book="${book.id}" aria-label="Delete ${escapeHtml(book.title)}">×</button></td>
        </tr>
    `).join("");
    document.querySelector("#booksStat").textContent = books.length;
}

function renderCategories() {
    const list = document.querySelector("#categoryList");
    list.innerHTML = categories.map((category, index) => `
        <div class="category-item"><div><span>${escapeHtml(category)}</span><br><small class="category-count">${books.filter(book => book.category === category).length} books</small></div><button class="action-btn delete" type="button" data-delete-category="${index}" aria-label="Delete category">×</button></div>
    `).join("");
    const select = document.querySelector("#bookCategory");
    select.innerHTML = categories.map(category => `<option>${escapeHtml(category)}</option>`).join("");
}

function renderOrders() {
    document.querySelector("#orderTable").innerHTML = orders.map((order, index) => `
        <tr><td><strong>${escapeHtml(order.id)}</strong></td><td>${escapeHtml(order.customer)}</td><td>${escapeHtml(order.date)}</td><td><strong>$${order.total.toFixed(2)}</strong></td><td><select class="order-status-select" data-order-index="${index}" aria-label="Update status">${["Pending","Processing","Shipped","Delivered","Completed","Cancelled"].map(status => `<option ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}</select></td></tr>
    `).join("");
    document.querySelector("#recentOrders").innerHTML = orders.slice(0, 4).map(order => `
        <div class="recent-order"><span class="order-avatar">${escapeHtml(order.customer.split(" ").map(part => part[0]).join("").slice(0, 2))}</span><div><strong>${escapeHtml(order.customer)}</strong><small>${escapeHtml(order.id)} · $${order.total.toFixed(2)}</small></div><span class="status ${order.status.toLowerCase()}">${escapeHtml(order.status)}</span></div>
    `).join("");
    document.querySelector("#ordersStat").textContent = orders.length + 244;
}

function renderCustomers() {
    document.querySelector("#customerTable").innerHTML = customers.map(customer => `
        <tr><td><strong>${escapeHtml(customer.name)}</strong></td><td>${escapeHtml(customer.email)}</td><td>${escapeHtml(customer.phone)}</td><td>${customer.orders}</td><td>${escapeHtml(customer.joined)}</td></tr>
    `).join("");
}

function renderReviews() {
    document.querySelector("#reviewGrid").innerHTML = reviews.map(review => `
        <article class="review-card"><div class="stars">${review.stars}</div><p>${escapeHtml(review.text)}</p><strong>${escapeHtml(review.name)}</strong><small>${escapeHtml(review.book)} · ${escapeHtml(review.date)}</small></article>
    `).join("");
}

function renderReport() {
    const values = [52, 68, 46, 84, 71, 92, 78];
    const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
    document.querySelector("#reportBars").innerHTML = values.map((value, index) => `<div><i style="height:${value}%"></i><span>${months[index]}</span></div>`).join("");
}

renderBooks();
renderCategories();
renderOrders();
renderCustomers();
renderReviews();
renderReport();

const bookModal = document.querySelector("#bookModal");
const bookForm = document.querySelector("#bookForm");

function openBookModal(book) {
    document.querySelector("#bookModalTitle").textContent = book ? "Edit Book" : "Add New Book";
    document.querySelector("#bookId").value = book ? book.id : "";
    document.querySelector("#bookTitle").value = book?.title || "";
    document.querySelector("#bookAuthor").value = book?.author || "";
    document.querySelector("#bookPrice").value = book?.price || "";
    document.querySelector("#bookStock").value = book?.stock ?? "";
    document.querySelector("#bookCategory").value = book?.category || categories[0] || "";
    document.querySelector("#bookImage").value = "";
    bookModal.showModal();
}

document.querySelector("#addBookBtn").addEventListener("click", () => openBookModal());
document.querySelectorAll("[data-close-modal]").forEach(button => button.addEventListener("click", () => bookModal.close()));

document.querySelector("#bookTable").addEventListener("click", event => {
    const editButton = event.target.closest("[data-edit-book]");
    const deleteButton = event.target.closest("[data-delete-book]");
    if (editButton) openBookModal(books.find(book => book.id === Number(editButton.dataset.editBook)));
    if (deleteButton && confirm("Delete this book?")) {
        books = books.filter(book => book.id !== Number(deleteButton.dataset.deleteBook));
        saveBooks();
        renderBooks();
        renderCategories();
    }
});

bookForm.addEventListener("submit", event => {
    event.preventDefault();
    const id = document.querySelector("#bookId").value;
    const file = document.querySelector("#bookImage").files[0];
    const finishSave = image => {
        const data = {
            id: id ? Number(id) : Date.now(),
            title: document.querySelector("#bookTitle").value.trim(),
            author: document.querySelector("#bookAuthor").value.trim(),
            category: document.querySelector("#bookCategory").value,
            price: Number(document.querySelector("#bookPrice").value),
            stock: Number(document.querySelector("#bookStock").value),
            image: image || (id ? books.find(book => book.id === Number(id))?.image : "../image/1st.jpg")
        };
        if (id) books = books.map(book => book.id === Number(id) ? data : book);
        else books.unshift(data);
        saveBooks();
        renderBooks();
        renderCategories();
        bookModal.close();
    };
    if (file) {
        const reader = new FileReader();
        reader.onload = () => finishSave(reader.result);
        reader.readAsDataURL(file);
    } else finishSave();
});

document.querySelector("#categoryForm").addEventListener("submit", event => {
    event.preventDefault();
    const input = document.querySelector("#categoryName");
    const name = input.value.trim();
    if (!name) return;
    if (!categories.some(category => category.toLowerCase() === name.toLowerCase())) {
        categories.push(name);
        localStorage.setItem("adminCategories", JSON.stringify(categories));
        renderCategories();
    }
    input.value = "";
});

document.querySelector("#categoryList").addEventListener("click", event => {
    const button = event.target.closest("[data-delete-category]");
    if (!button) return;
    const index = Number(button.dataset.deleteCategory);
    if (confirm(`Delete the ${categories[index]} category?`)) {
        categories.splice(index, 1);
        localStorage.setItem("adminCategories", JSON.stringify(categories));
        renderCategories();
    }
});

document.querySelector("#orderTable").addEventListener("change", event => {
    const select = event.target.closest("[data-order-index]");
    if (!select) return;
    orders[Number(select.dataset.orderIndex)].status = select.value;
    localStorage.setItem("adminOrders", JSON.stringify(orders));
    renderOrders();
});

document.querySelector("#exportBtn").addEventListener("click", () => {
    const rows = [["Month", "Sales"], ["May", "$6200"], ["Jun", "$7600"], ["Jul", "$5400"], ["Aug", "$9400"], ["Sep", "$8200"], ["Oct", "$10400"], ["Nov", "$12480"]];
    const csv = rows.map(row => row.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "book-lending-sales-report.csv";
    link.click();
    URL.revokeObjectURL(url);
});
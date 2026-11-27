const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const searchInput = document.querySelector("#book-search");
const filterButtons = document.querySelectorAll(".filter-button");
const bookCards = document.querySelectorAll(".book-card");
const emptyState = document.querySelector("#empty-state");
const resultsCount = document.querySelector("#results-count");
const cartCount = document.querySelector("#cart-count");
const cartButton = document.querySelector("#cart-button");
const toast = document.querySelector("#toast");
const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

let activeCategory = "All";
let cartTotal = 0;
let toastTimeout;

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
  });
});

function filterBooks() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  bookCards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLocaleLowerCase();
    const matchesCategory = activeCategory === "All" || card.dataset.category === activeCategory;
    const matchesSearch = title.includes(query);
    const isVisible = matchesCategory && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
  resultsCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "lovely read" : "lovely reads"}`;
}

searchInput.addEventListener("input", filterBooks);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    filterBooks();
  });
});

function showToast(message) {
  window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    cartTotal += 1;
    cartCount.textContent = String(cartTotal);
    cartButton.setAttribute("aria-label", `Shopping cart, ${cartTotal} ${cartTotal === 1 ? "book" : "books"}`);
    const bookTitle = button.closest(".book-card").querySelector("h3").textContent;
    showToast(`${bookTitle} added to your cart.`);
  });
});

cartButton.addEventListener("click", () => {
  showToast(cartTotal === 0
    ? "Your cart is waiting for a good book."
    : `Your cart has ${cartTotal} ${cartTotal === 1 ? "book" : "books"}.`);
});

document.querySelector("#year").textContent = new Date().getFullYear();

contactForm.addEventListener("input", (event) => {
  event.target.setCustomValidity("");
  formFeedback.textContent = "";
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formFeedback.textContent = "";

  for (const field of contactForm.querySelectorAll("input[required], textarea[required]")) {
    if (!field.value.trim()) {
      field.setCustomValidity("Please fill out this field.");
      field.reportValidity();
      return;
    }
  }

  if (!contactForm.reportValidity()) return;

  formFeedback.textContent = "Thanks for your note! This demo form is ready to connect to an email service.";
  contactForm.reset();
});

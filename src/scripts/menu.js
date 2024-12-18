const burger = document.querySelector("[data-hamburger]");
const navLinks = document.querySelector("[data-nav-links]");

if (burger && navLinks) {
    burger.addEventListener("click", () => {
        navLinks.classList.toggle("hidden");

        if (!navLinks.classList.contains("block")) {
            burger.setAttribute("aria-expanded", "false");
        } else {
            navLinks.classList.remove("hidden");
            burger.setAttribute("aria-expanded", "true");
        }
    });
}
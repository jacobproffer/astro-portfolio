const burger = document.querySelector("[data-hamburger]");
const navLinks = document.querySelector("[data-nav-links]");
if (burger && navLinks) {
    burger.addEventListener("click", () => {
        navLinks.classList.toggle("nav-links--expanded");

        if (navLinks.classList.contains("nav-links--expanded")) {
            burger.setAttribute("aria-expanded", "true");
        } else {
            navLinks.classList.remove("nav-links--expanded");
            burger.setAttribute("aria-expanded", "false");
        }
    });
}
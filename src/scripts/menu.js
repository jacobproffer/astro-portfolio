const burger = document.querySelector("[data-hamburger]");
const navLinks = document.querySelector("[data-nav-links]");

if (burger && navLinks) {
    burger.addEventListener("click", () => {
        navLinks.classList.toggle("hidden");

        if (navLinks.classList.contains("hidden")) {
            burger.setAttribute("aria-expanded", "false");
            burger.innerHTML = "Open Menu";
        } else {
            navLinks.classList.remove("hidden");
            burger.setAttribute("aria-expanded", "true");
            burger.innerHTML = "Close Menu";
        }
    });
}
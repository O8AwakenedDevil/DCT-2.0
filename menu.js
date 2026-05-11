"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("open");

        toggle.textContent = isOpen ? "✕" : "☰";
        toggle.setAttribute("aria-expanded", isOpen);
    });

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("open");
            toggle.textContent = "☰";
            toggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target)) {
            menu.classList.remove("open");
            toggle.textContent = "☰";
            toggle.setAttribute("aria-expanded", "false");
        }
    });
});
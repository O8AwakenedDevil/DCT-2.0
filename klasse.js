"use strict";

// Handle clicks on League links (kl1..kl8) and toggle visibility of panes (k1..k8)
document.addEventListener("DOMContentLoaded", () => {
    const paneIds = ["k1", "k2", "k3", "k4", "k5", "k6", "k7", "k8"]; // valid panes
    const linkIds = ["kl1", "kl2", "kl3", "kl4", "kl5", "kl6", "kl7", "kl8"]; // corresponding links

    const panes = paneIds
        .map((id) => document.getElementById(id))
        .filter((el) => el);
    const links = linkIds
        .map((id) => document.getElementById(id))
        .filter((el) => el);

    const showPane = (targetId) => {
        // Toggle the visibility of content panes
        panes.forEach((p) => {
            p.hidden = p.id !== targetId;
        });
        // Update active state on the side links (optional, for styling)
        links.forEach((lnk) => {
            if (!lnk) return;
            if (lnk.id.replace("kl", "k") === targetId) {
                lnk.classList.add("active");
                lnk.setAttribute("aria-current", "true");
            } else {
                lnk.classList.remove("active");
                lnk.removeAttribute("aria-current");
            }
        });
    };

    // Wire up click handlers for each side link
    links.forEach((lnk) => {
        lnk.addEventListener("click", (e) => {
            e.preventDefault();
            const targetPane = lnk.id.replace("kl", "k");
            showPane(targetPane);
        });
    });

    // Optional: If none is visible initially, you can set a default
    // Uncomment to default to League 1
    if (panes.every(p => p.hidden)) {
    showPane("k1");
    }
});
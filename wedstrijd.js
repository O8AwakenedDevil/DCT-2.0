"use strict";

// Handle clicks on League links (kl1..kl8) and toggle visibility of panes (k1..k8)
document.addEventListener("DOMContentLoaded", () => {
    const paneIds = ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9"]; // valid panes
    const linkIds = ["wk1", "wk2", "wk3", "wk4", "wk5", "wk6", "wk7", "wk8", "wk9"]; // corresponding links

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
            if (lnk.id.replace("wk", "w") === targetId) {
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
            const targetPane = lnk.id.replace("wk", "w");
            showPane(targetPane);
        });
    });

    // Optional: If none is visible initially, you can set a default
    // Uncomment to default to League 1
    if (panes.every(p => p.hidden)) {
    showPane("w1");
    }
});
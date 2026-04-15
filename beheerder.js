"use strict";
// Handle clicks on League links
document.addEventListener("DOMContentLoaded", () => {
    const paneIds = ["b1", "b2", "b3", "b4", "b5"]; // valid panes
    const linkIds = ["bd1", "bd2", "bd3", "bd4", "bd5"]; // corresponding links

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
            if (lnk.id.replace("bd", "b") === targetId) {
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
            const targetPane = lnk.id.replace("bd", "b");
            showPane(targetPane);
        });
    });

    // Optional: If none is visible initially, you can set a default
    // Uncomment to default to League 1
    if (panes.every(p => p.hidden)) {
    showPane("b1");
    }
});
"use strict";

export function initPaneToggle(paneIds, linkIds) {
    document.addEventListener("DOMContentLoaded", () => {
        const panes = paneIds.map(id => document.getElementById(id)).filter(Boolean);
        const links = linkIds.map(id => document.getElementById(id)).filter(Boolean);

        const showPane = (index) => {
            panes.forEach((p, i) => { p.hidden = i !== index; });
            links.forEach((lnk, i) => {
                lnk.classList.toggle("active", i === index);
                if (i === index) lnk.setAttribute("aria-current", "true");
                else lnk.removeAttribute("aria-current");
            });
        };

        links.forEach((lnk, index) => {
            lnk.addEventListener("click", e => {
                e.preventDefault();
                showPane(index);
            });
        });

        if (panes.every(p => p.hidden)) showPane(0);
    });
}
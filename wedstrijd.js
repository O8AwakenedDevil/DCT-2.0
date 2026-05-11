"use strict";

import { db } from "./firebase-config.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const weekDates = {
    1: "23/03 - 29/03",
    2: "30/03 - 05/04",
    3: "06/04 - 12/04",
    4: "13/04 - 19/04",
    5: "20/04 - 26/04",
    6: "27/04 - 03/05",
    7: "04/05 - 10/05",
    8: "11/05 - 17/05",
    9: "18/05 - 24/05",
};

let activeWeek = 1;

function formatDatumTijd(datumString) {
    const datum = new Date(datumString);
    const dag = String(datum.getDate()).padStart(2, '0');
    const maand = String(datum.getMonth() + 1).padStart(2, '0');
    const jaar = datum.getFullYear();

    return `${dag}-${maand}-${jaar}`;
}

function checkWedstrijdVerlopen(datumTijd, uur) {
    if (!datumTijd || !uur) return "❌";

    const wedstrijdDatum = new Date(`${datumTijd}T${uur}:00`);

    return wedstrijdDatum.getTime() < new Date().getTime() ? "✔" : "❌";
}

async function haalWedstrijdenOp() {
    const container = document.getElementById("tablesContainer");
    container.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, `W${activeWeek}`));

        if (querySnapshot.empty) {
            container.innerHTML = "<p>Geen wedstrijden gevonden.</p>";
            return;
        }

        const perKlasse = {};
        querySnapshot.forEach((docSnap) => {
            const w = docSnap.data();
        
            if (!perKlasse[w.klasse]) perKlasse[w.klasse] = [];
            perKlasse[w.klasse].push({ id: docSnap.id, ...w, status: checkWedstrijdVerlopen(w.datumTijd, w.uur)});
        });

        Object.keys(perKlasse).sort().forEach(klasse => {
            let html = `<h3>${klasse}</h3><table border='1'><tr><th>Speler 1</th><th>Speler 2</th><th>Datum</th><th>Uur</th><th>Status</th></tr>`;
            perKlasse[klasse].forEach(w => {
                html += `<tr>
                <td>${w.speler1}</td><td>${w.speler2}</td>
                <td>${formatDatumTijd(w.datumTijd)}</td><td>${w.uur}</td><td>${w.status}</td></tr>`;
            });
            html += "</table>";
            container.innerHTML += html;
        });
    } catch (error) {
        console.error("Fout bij het ophalen van wedstrijden: ", error);
    }
}

function setActiveWeek(week) {
    activeWeek = week;
    document.getElementById("weekLegend").textContent = `Wedstrijden: week ${week} (${weekDates[week]})`;

    for (let i = 1; i <= 9; i++) {
        const lnk = document.getElementById(`wk${i}`);
        
        if (!lnk) continue;
        lnk.classList.toggle("active", i === week);

        if (i === week) lnk.setAttribute("aria-current", "true");
        else lnk.removeAttribute("aria-current");
    }
    haalWedstrijdenOp();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("dataForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, `W${activeWeek}`), {
                speler1: document.getElementById("speler1").value,
                speler2: document.getElementById("speler2").value,
                datumTijd: document.getElementById("datumTijd").value,
                uur: document.getElementById("uur").value,
                klasse: document.getElementById("klasse").value,
            });
            alert("Wedstrijd toegevoegd");
            document.getElementById("dataForm").reset();
            await haalWedstrijdenOp();
        } catch (error) {
            console.error("Fout bij opslaan:", error);
        }
    });

    for (let i = 1; i <= 9; i++) {
        const lnk = document.getElementById(`wk${i}`);
        if (lnk) lnk.addEventListener("click", (e) => { e.preventDefault(); setActiveWeek(i); });
    }

    setActiveWeek(1);
});
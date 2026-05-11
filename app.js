"use strict";

import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Functie om de datum te formatteren naar dd-mm-yyyy
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
}

// Functie om wedstrijden op te halen en weer te geven
async function haalWedstrijdenOp() {
    const wedstrijdenContainer = document.getElementById("games-container"); 
    wedstrijdenContainer.innerHTML = ""; // Leegmaken voordat we opnieuw laden
  
    try {
      const wedstrijden = [];
  
      // Haal wedstrijden op uit W1 tot W9
      for (let i = 1; i <= 9; i++) {
        const querySnapshot = await getDocs(collection(db, `W${i}`));
  
        querySnapshot.forEach(doc => {
          const wedstrijd = doc.data();
          const datumTijd = wedstrijd.datumTijd; // Zorg ervoor dat dit de string is
          const uur = wedstrijd.uur; // Zorg ervoor dat dit de string is
  
          // Combineer datum en uur om een volledige datum/tijd te krijgen
          const volledigeDatumTijd = new Date(`${datumTijd}T${uur}:00`);
  
          // Vergelijk de wedstrijddatum met de huidige datum
          const huidigeDatum = new Date();
  
          // Controleer of de wedstrijd aankomend is
          if (volledigeDatumTijd > huidigeDatum) {
            wedstrijden.push({ ...wedstrijd, id: doc.id, formattedDatum: formatDate(datumTijd) }); // Voeg de geformatteerde datum toe
          }
        });
      }
  
      // Sorteer wedstrijden op datum en tijd (alleen de 4 meest recente)
      wedstrijden.sort((a, b) => new Date(`${a.datumTijd}T${a.uur}:00`) - new Date(`${b.datumTijd}T${b.uur}:00`));
      const aankomendeWedstrijden = wedstrijden.slice(0, 3); // Alleen de 4 meest recente
  
      if (aankomendeWedstrijden.length > 0) {
        // Toon wedstrijden in een mooie weergave
        aankomendeWedstrijden.forEach(wedstrijd => {
          const wedstrijdHTML = `
            <div class="game-card">
              <h4>${wedstrijd.klasse}</h4>
              <p><strong>Speler 1:</strong> ${wedstrijd.speler1}</p>
              <p><strong>Speler 2:</strong> ${wedstrijd.speler2}</p>
              <p><strong>Datum:</strong> ${wedstrijd.formattedDatum}</p> <!-- Gebruik de geformatteerde datum -->
              <p><strong>Tijd:</strong> ${wedstrijd.uur}</p>
            </div>
          `;
          wedstrijdenContainer.innerHTML += wedstrijdHTML;
        });
      } else {
        wedstrijdenContainer.innerHTML = "<p>Geen aankomende wedstrijden gevonden.</p>";
      }
  
    } catch (error) {
      console.error("Fout bij ophalen van wedstrijden: ", error);
    }
  }
  
  // Functie oproepen bij het laden van de pagina
  document.addEventListener("DOMContentLoaded", haalWedstrijdenOp);

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Firebase configuratie
const firebaseConfig = {
  apiKey: "AIzaSyBh69I9WATUhZ1pdbjZo58ELONSWNRQzBg",
  authDomain: "dct-dart.firebaseapp.com",
  projectId: "dct-dart",
  storageBucket: "dct-dart.firebasestorage.app",
  messagingSenderId: "291022570503",
  appId: "1:291022570503:web:632ad275b92bcb04cc56a2",
  measurementId: "G-0ENPQD91XD"
};

// Firebase initialiseren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Functie om datum en tijd te formatteren naar dd-mm-jjjj
function formatDatumTijd(datumString) {
  const datum = new Date(datumString);
  const dag = String(datum.getDate()).padStart(2, '0');
  const maand = String(datum.getMonth() + 1).padStart(2, '0'); // Maanden beginnen bij 0
  const jaar = datum.getFullYear();

  return `${dag}-${maand}-${jaar}`;
}

// Functie om te checken of de wedstrijd al gespeeld is
function checkWedstrijdVerlopen(datumTijd, uur) {
  if (!datumTijd || !uur) return "❌"; // Als er iets ontbreekt, beschouw het als niet verlopen

  // Datum en tijd samenvoegen in een geldig ISO-formaat
  const wedstrijdDatum = new Date(`${datumTijd}T${uur}:00`);
  const huidigeDatum = new Date();

  // Controle of wedstrijd al voorbij is
  return wedstrijdDatum.getTime() < huidigeDatum.getTime() ? "✔" : "❌";
}


// Functie om wedstrijden op te halen en weer te geven per klasse
async function haalWedstrijdenOp() {
  const wedstrijdenContainer = document.getElementById("tablesContainer"); 
  wedstrijdenContainer.innerHTML = ""; // Leegmaken voordat we opnieuw laden

  try {
    const querySnapshot = await getDocs(collection(db, "W8"));
    if (querySnapshot.empty) {
      wedstrijdenContainer.innerHTML = "<p>Geen wedstrijden gevonden.</p>";
      return;
    }

    const wedstrijdenPerKlasse = {};
    
    querySnapshot.forEach((doc) => {
      const wedstrijd = doc.data();
      if (!wedstrijdenPerKlasse[wedstrijd.klasse]) {
        wedstrijdenPerKlasse[wedstrijd.klasse] = [];
      }
      
      const status = checkWedstrijdVerlopen(wedstrijd.datumTijd, wedstrijd.Uur);
      
      wedstrijdenPerKlasse[wedstrijd.klasse].push({ id: doc.id, ...wedstrijd, status });
    });

    // Maak tabellen per klasse
    Object.keys(wedstrijdenPerKlasse).sort().forEach(klasse => {
      let tableHTML = `<h3>${klasse}</h3><table border='1'><tr><th>Speler 1</th><th>Speler 2</th><th>Datum</th><th>Uur</th><th>Status</th><th>Acties</th></tr>`;
      wedstrijdenPerKlasse[klasse].forEach(wedstrijd => {
        tableHTML += `<tr>
                        <td>${wedstrijd.speler1}</td>
                        <td>${wedstrijd.speler2}</td>
                        <td>${formatDatumTijd(wedstrijd.datumTijd)}</td>
                        <td>${wedstrijd.Uur}</td>
                        <td>${wedstrijd.status}</td>
                        <td><button onclick="bewerkWedstrijd('${wedstrijd.id}', '${wedstrijd.speler1}', '${wedstrijd.speler2}', '${wedstrijd.datumTijd}', '${wedstrijd.Uur}', '${wedstrijd.klasse}')">Bewerk</button></td>
                      </tr>`;
      });
      tableHTML += "</table>";
      wedstrijdenContainer.innerHTML += tableHTML;
    });
  } catch (error) {
    console.error("Fout bij ophalen van wedstrijden: ", error);
  }
}

// Functie oproepen bij het laden van de pagina
document.addEventListener("DOMContentLoaded", haalWedstrijdenOp);

// Formulier ophalen en submit-functie toevoegen
const form = document.getElementById("dataForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const speler1 = document.getElementById("speler1").value;
  const speler2 = document.getElementById("speler2").value;
  const datumTijd = document.getElementById("datumTijd").value;
  const Uur = document.getElementById("Uur").value;
  const klasse = document.getElementById("klasse").value;

  try {
    await addDoc(collection(db, "W8"), {
      speler1,
      speler2,
      datumTijd,
      Uur,
      klasse
    });

    alert("Wedstrijd toegevoegd!");
    form.reset();
    await haalWedstrijdenOp();
  } catch (error) {
    console.error("Fout bij opslaan:", error);
  }
});

// Functie om een wedstrijd te bewerken
window.bewerkWedstrijd = function(id, speler1, speler2, datumTijd, Uur, klasse) {
  const nieuweSpeler1 = prompt("Nieuwe Speler 1:", speler1);
  const nieuweSpeler2 = prompt("Nieuwe Speler 2:", speler2);
  const nieuweDatumTijd = prompt("Nieuwe datum:", datumTijd);
  const nieuweUur = prompt("Nieuwe Uur:", Uur);
  const nieuweKlasse = prompt("Nieuwe klasse:", klasse);

  if (nieuweSpeler1 && nieuweSpeler2 && nieuweDatumTijd && nieuweUur && nieuweKlasse) {
    const wedstrijdRef = doc(db, "W8", id);
    updateDoc(wedstrijdRef, {
      speler1: nieuweSpeler1,
      speler2: nieuweSpeler2,
      datumTijd: nieuweDatumTijd,
      Uur: nieuweUur,
      klasse: nieuweKlasse
    }).then(() => {
      alert("Wedstrijd bijgewerkt!");
      haalWedstrijdenOp();
    }).catch(error => console.error("Fout bij updaten:", error));
  }
};

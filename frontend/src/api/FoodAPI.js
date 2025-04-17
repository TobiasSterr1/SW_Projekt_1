// Importieren der notwendigen Klassen
import PersonBO from './PersonBO' // Importiert die Klasse PersonBO für die Verwendung in der API
import RezeptBO from './RezeptBO'
import MengeBO from './MengeBO'
import MasseinheitBO from './MasseinheitBO'
import LebensmitteleintragBO from './LebensmitteleintragBO'
import LebensmittelBO from './LebensmittelBO'
import KuehlschrankBO from './KuehlschrankBO'
import HaushaltsmitgliedBO from './HaushaltsmitgliedBO'
import HaushaltBO from './HaushaltBO'
import EinkaufslisteBO from './EinkaufslisteBO'
/**
 * Abstrahiert das REST-Interface des Python-Backends mit bequemen Zugriffsmethoden.
 * Die Klasse ist als Singleton implementiert.
 */
export default class FoodAPI {

    // Singleton-Instanz
    static #api = null; // Statische Variable zur Speicherung der Singleton-Instanz der Klasse

    // Basis-URL für den FoodManager-Server
    #FoodManagerServerBaseURL = '/foodmanager';

    // Definiert die Routen für Person
    // Gibt die URL zurück, um eine Person anhand der GUID abzurufen
    #getPersonByGuidURL = (guid) => `${this.#FoodManagerServerBaseURL}/person/${guid}`;
    // Gibt die URL zurück, um eine Person anhand der ID abzurufen
    #getPersonByIdURL = (id) => `${this.#FoodManagerServerBaseURL}/person/${id}`;
    // Gibt die URL zurück, um alle Personen eines Haushalts abzurufen
    #getAllPersonURL = (haushaltId) => `${this.#FoodManagerServerBaseURL}/person-all/${haushaltId}`;
    // Gibt die URL zurück, um eine Person anhand der ID zu löschen
    #deletePersonURL = (id) => `${this.#FoodManagerServerBaseURL}/person/${id}`;
    // Gibt die URL zurück, um eine Person anhand der ID zu aktualisieren
    #updatePersonURL = (id) => `${this.#FoodManagerServerBaseURL}/person/${id}`;

    // Definiert die Routen für Rezept
    #createRezeptURL = () => `${this.#FoodManagerServerBaseURL}/rezept`;
    #getAllRezepteURL = (haushaltId) => `${this.#FoodManagerServerBaseURL}/alle-rezepte/${haushaltId}`;
    #getAllRezepteHaushaltURL = (haushaltId) => `${this.#FoodManagerServerBaseURL}/alle-rezepte-haushalt/${haushaltId}`;
    #getRezeptByIdURL = (id) => `${this.#FoodManagerServerBaseURL}/rezept/${id}`;
    #deleteRezeptURL = (id) => `${this.#FoodManagerServerBaseURL}/rezept/${id}`;
    #updateRezeptURL = (id) => `${this.#FoodManagerServerBaseURL}/rezept/${id}`;
    #cookRezeptURL = (rezeptId, haushaltId) => `${this.#FoodManagerServerBaseURL}/cookRezept/${rezeptId}/${haushaltId}`;

    // Definiert die Routen für Menge
    #createMengeURL = () => `${this.#FoodManagerServerBaseURL}/menge`;
    #getMengeByIdURL = (id) => `${this.#FoodManagerServerBaseURL}/menge/${id}`;
    #deleteMengeURL = (id) => `${this.#FoodManagerServerBaseURL}/menge/${id}`;
    #updateMengeURL = (id) => `${this.#FoodManagerServerBaseURL}/menge/${id}`;

    // Definiert die Routen für Maßeinheit
    #createMasseinheitURL = () => `${this.#FoodManagerServerBaseURL}/masseinheit`;
    #getAllMasseinheitURL = () => `${this.#FoodManagerServerBaseURL}/masseinheit`; 
    #getMasseinheitByIdURL = (id) => `${this.#FoodManagerServerBaseURL}/masseinheit/${id}`;
    #deleteMasseinheitURL = (id) => `${this.#FoodManagerServerBaseURL}/masseinheit/${id}`;
    #updateMasseinheitURL = (id) => `${this.#FoodManagerServerBaseURL}/masseinheit/${id}`;

    // Definiert die Routen für Lebensmitteleintrag
    #createLebensmitteleintragURL = () => `${this.#FoodManagerServerBaseURL}/lebensmitteleintrag`;
    #getLebensmitteleintragByIdURL = (id) => `${this.#FoodManagerServerBaseURL}/lebensmitteleintrag/${id}`;
    #getLebensmitteleintragByAufbewahrOrtURL = (aufbewahrId, aufbewahrOrt) => `${this.#FoodManagerServerBaseURL}/lebensmitteleintrag/${aufbewahrId}/${aufbewahrOrt}`;
    #deleteLebensmitteleintragURL = (id, isEinkaufsliste) => `${this.#FoodManagerServerBaseURL}/lebensmitteleintrag-delete/${id}/${isEinkaufsliste}`;
    #updateLebensmitteleintragURL = (id) => `${this.#FoodManagerServerBaseURL}/lebensmitteleintrag/${id}`;

    // Definiert die Routen für Lebensmittel
    #createLebensmittelURL = () => `${this.#FoodManagerServerBaseURL}/lebensmittel`;
    #getAllLebensmittelURL = () => `${this.#FoodManagerServerBaseURL}/lebensmittel`;
    #getLebensmittelByIdURL = (id) => `${this.#FoodManagerServerBaseURL}/lebensmittel/${id}`;
    #deleteLebensmittelURL = (id) => `${this.#FoodManagerServerBaseURL}/lebensmittel/${id}`;
    #updateLebensmittelURL = (id) => `${this.#FoodManagerServerBaseURL}/lebensmittel/${id}`;

    // Definiert die Routen für Kuehlschrank
    #createKuehlschrankURL = () => `${this.#FoodManagerServerBaseURL}/kuehlschrank`;
    #getKuehlschrankByIdURL = (id) => `${this.#FoodManagerServerBaseURL}/kuehlschrank/${id}`;
    #deleteKuehlschrankURL = (id) => `${this.#FoodManagerServerBaseURL}/kuehlschrank/${id}`;
    #updateKuehlschrankURL = (id) => `${this.#FoodManagerServerBaseURL}/kuehlschrank/${id}`;

    // Definiert die Routen für Haushaltsmitglied
    #createHaushaltsmitgliedURL = () => `${this.#FoodManagerServerBaseURL}/haushaltsmitglied`;
    #getHaushaltsmitgliedByIdURL = (id) => `${this.#FoodManagerServerBaseURL}/haushaltsmitglied/${id}`;
    #getHaushaltsmitgliedByPersonIdURL = (personId) => `${this.#FoodManagerServerBaseURL}/haushaltsmitglied/person/${personId}`;
    #getHaushaltsmitgliedByHaushaltIdURL = (haushaltId) => `${this.#FoodManagerServerBaseURL}/haushaltsmitglied/haushalt/${haushaltId}`;
    #deleteHaushaltsmitgliedURL = (id) => `${this.#FoodManagerServerBaseURL}/haushaltsmitglied/${id}`;
    #updateHaushaltsmitgliedURL = (id) => `${this.#FoodManagerServerBaseURL}/haushaltsmitglied/${id}`;

    // Definiert die Routen für Haushalt
    #createHaushaltURL = () => `${this.#FoodManagerServerBaseURL}/haushalt`;
    #getAllHaushaltURL = (personId) => `${this.#FoodManagerServerBaseURL}/haushalt-alle/${personId}`;  
    #getHaushaltByIdURL = (id) => `${this.#FoodManagerServerBaseURL}/haushalt/${id}`;
    #deleteHaushaltURL = (id) => `${this.#FoodManagerServerBaseURL}/haushalt/${id}`;
    #updateHaushaltURL = (id) => `${this.#FoodManagerServerBaseURL}/haushalt/${id}`;

    // Definiert die Routen für Einkaufsliste
    #createEinkaufslisteURL = () => `${this.#FoodManagerServerBaseURL}/einkaufsliste`;
    #getEinkaufslisteByHaushaltIdURL = (haushaltId) => `${this.#FoodManagerServerBaseURL}/einkaufsliste/${haushaltId}`;
    #deleteEinkaufslisteURL = (id) => `${this.#FoodManagerServerBaseURL}/einkaufsliste/${id}`;
    #updateEinkaufslisteURL = (id) => `${this.#FoodManagerServerBaseURL}/einkaufsliste/${id}`;
    // Singleton-Methode zum Abrufen der API-Instanz
    static getAPI() {
      if (this.#api == null) {
        this.#api = new FoodAPI(); // Erstellt eine neue Instanz von FoodAPI, falls diese noch nicht existiert
      }
      return this.#api; // Gibt die Singleton-Instanz von FoodAPI zurück
    }

    // Methode für erweiterten Fetch mit Fehlerbehandlung
    #fetchAdvanced = (url, init) => fetch(url, { credentials: "include", ...init })
    .then(res => {
      // Das Promise von fetch() wird nicht bei HTTP-Fehlerstatus abgelehnt, selbst wenn die Antwort ein HTTP 404 oder 500 ist. 
      if (!res.ok) {
        throw Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    }
    )

    // ALLE METHODEN FÜR PERSON

    // Holt eine Person anhand der GUID ab
    getPersonByGuid(guid){
        return this.#fetchAdvanced(this.#getPersonByGuidURL(guid)).then((responseJSON) => {
          // Konvertiert die JSON-Antwort in ein PersonBO-Objekt
          let personBOs = PersonBO.fromJSON(responseJSON);
          // console.info(personBOs);  // Konsolenausgabe für Debugging
          return new Promise(function (resolve) {
            resolve(personBOs);
          })
        })
      }

    // Holt eine Person anhand der ID ab
    getPersonById(id){
        return this.#fetchAdvanced(this.#getPersonByIdURL(id)).then((responseJSON) => {
          // Konvertiert die JSON-Antwort in ein PersonBO-Objekt
          let personBOs = PersonBO.fromJSON(responseJSON);
          // console.info(personBOs);  // Konsolenausgabe für Debugging
          return new Promise(function (resolve) {
            resolve(personBOs);
          })
        })
      }

    // Holt alle Personen eines Haushalts ab
    getAllPerson(id){
        return this.#fetchAdvanced(this.#getAllPersonURL(id)).then((responseJSON) => {
          let personBOs = PersonBO.fromJSON(responseJSON);
          // console.info(personBOs);
          return new Promise(function (resolve) {
            resolve(personBOs);
          })
        })
      }
      // Aktualisiert eine Person
      updatePerson(personBO) {
        return this.#fetchAdvanced(this.#updatePersonURL(personBO.getID()), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(personBO)
        }).then((responseJSON) => {
          // Konvertiert die JSON-Antwort in ein PersonBO-Objekt
          let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);  // Konsolenausgabe für Debugging
          return new Promise(function (resolve) {
            resolve(responsePersonBO);
          })
        })
      }

      // Löscht eine Person anhand ihrer ID
      deletePerson(personID) {
        return this.#fetchAdvanced(this.#deletePersonURL(personID), {
          method: 'DELETE'
        }).then((responseJSON) => {
          // Konvertiert die JSON-Antwort in ein PersonBO-Objekt
          let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);  // Konsolenausgabe für Debugging
          return new Promise(function (resolve) {
            resolve(responsePersonBO);
          })
        })
      }
    

    // ALLE METHODEN FÜR REZEPT
    createRezept(rezeptBO) {
        return this.#fetchAdvanced(this.#createRezeptURL(), {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(rezeptBO)
        }).then((responseJSON) => {
          // Konvertiert die JSON-Antwort in ein RezeptBO-Objekt
          let responseRezeptBO = RezeptBO.fromJSON(responseJSON)[0];
          return new Promise(function (resolve) {
            resolve(responseRezeptBO);
          })
        })
      }
    // Holt ein Rezept anhand der ID ab      
    getRezeptById(id){
        return this.#fetchAdvanced(this.#getRezeptByIdURL(id)).then((responseJSON) => {
          let rezeptBOs = RezeptBO.fromJSON(responseJSON);
          return new Promise(function (resolve) {
            resolve(rezeptBOs);
          })
        })
      }
// Holt alle Rezepte eines Haushalts ab
    getAllRezepte(haushaltId){
        return this.#fetchAdvanced(this.#getAllRezepteURL(haushaltId)).then((responseJSON) => {
          let rezeptBOs = RezeptBO.fromJSON(responseJSON);
          return new Promise(function (resolve) {
            resolve(rezeptBOs);
          })
        })
      }
// Holt alle Rezepte eines Haushalts ab
getAllRezepteHaushalt(haushaltId){
        return this.#fetchAdvanced(this.#getAllRezepteHaushaltURL(haushaltId)).then((responseJSON) => {
          let rezeptBOs = RezeptBO.fromJSON(responseJSON);
          return new Promise(function (resolve) {
            resolve(rezeptBOs);
          })
        })
      }
    // Kocht ein Rezept für einen bestimmten Haushalt
    cookRezept(rezeptId, haushaltId){
        return this.#fetchAdvanced(this.#cookRezeptURL(rezeptId, haushaltId)).then((responseJSON) => {
          let rezeptBOs = RezeptBO.fromJSON(responseJSON);
          return new Promise(function (resolve) {
            resolve(rezeptBOs);
          })
        })
      }
      // Löscht ein Rezept anhand seiner ID
      deleteRezept(rezeptID) {
        return this.#fetchAdvanced(this.#deleteRezeptURL(rezeptID), {
          method: 'DELETE'
        }).then((responseJSON) => {
          let responseRezeptBO = RezeptBO.fromJSON(responseJSON)[0];
          return new Promise(function (resolve) {
            resolve(responseRezeptBO);
          })
        })
      }
    // Aktualisiert ein Rezept
    updateRezept(rezeptBO) {
        return this.#fetchAdvanced(this.#updateRezeptURL(rezeptBO.getID()), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(rezeptBO)
        }).then((responseJSON) => {
          // Konvertiert die JSON-Antwort in ein RezeptBO-Objekt
          let responseRezeptBO = RezeptBO.fromJSON(responseJSON)[0];
          return new Promise(function (resolve) {
            resolve(responseRezeptBO);
          })
        })
      }

      // ALLE METHODEN FÜR MENGE

      // Erstellt eine neue Menge
      createMenge(mengeBO) {
        return this.#fetchAdvanced(this.#createMengeURL(), {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(mengeBO)
        }).then((responseJSON) => {
          let responseMengeBO = MengeBO.fromJSON(responseJSON)[0];
          return new Promise(function (resolve) {
            resolve(responseMengeBO);
          })
        })
      }
      // Holt eine Menge anhand der ID ab      
      getMengeById(id){
        return this.#fetchAdvanced(this.#getMengeByIdURL(id)).then((responseJSON) => {
          let mengeBOs = MengeBO.fromJSON(responseJSON);
          return new Promise(function (resolve) {
            resolve(mengeBOs);
          })
        })
      }
      // Löscht eine Menge anhand ihrer ID
      deleteMenge(mengeID) {
        return this.#fetchAdvanced(this.#deleteMengeURL(mengeID), {
          method: 'DELETE'
        }).then((responseJSON) => {
          let responseMengeBO = MengeBO.fromJSON(responseJSON)[0];
          return new Promise(function (resolve) {
            resolve(responseMengeBO);
          })
        })
      }
    // Aktualisiert eine Menge
      updateMenge(mengeBO) {
        return this.#fetchAdvanced(this.#updateMengeURL(mengeBO.getID()), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(mengeBO)
        }).then((responseJSON) => {
          let responseMengeBO = MengeBO.fromJSON(responseJSON)[0];
          return new Promise(function (resolve) {
            resolve(responseMengeBO);
          })
        })
      }

      // ALLE METHODEN FÜR MASSEINHEIT

      // Erstellt eine neue Maßeinheit
      createMasseinheit(masseinheitBO) {
        return this.#fetchAdvanced(this.#createMasseinheitURL(), {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(masseinheitBO)
        }).then((responseJSON) => {
          let responseMasseinheitBO = MasseinheitBO.fromJSON(responseJSON)[0];
          return new Promise(function (resolve) {
            resolve(responseMasseinheitBO);
          })
        })
      }
      // Holt alle Maßeinheiten    
      getAllMasseinheit(){
        return this.#fetchAdvanced(this.#getAllMasseinheitURL()).then((responseJSON) => {
          let masseinheitBOs = MasseinheitBO.fromJSON(responseJSON);
          // console.info(masseinheitBOs);
          return new Promise(function (resolve) {
            resolve(masseinheitBOs);
          })
        })
      }
    // Holt eine Maßeinheit anhand der ID ab      
    getMasseinheitById(id){
        return this.#fetchAdvanced(this.#getMasseinheitByIdURL(id)).then((responseJSON) => {
          let masseinheitBOs = MasseinheitBO.fromJSON(responseJSON);
          // console.info(masseinheitBOs);
          return new Promise(function (resolve) {
            resolve(masseinheitBOs);
          })
        })
      }
      // Löscht eine Maßeinheit anhand ihrer ID
      deleteMasseinheit(masseinheitID) {
        return this.#fetchAdvanced(this.#deleteMasseinheitURL(masseinheitID), {
          method: 'DELETE'
        }).then((responseJSON) => {
          // We always get an array of MasseinheitBOs.fromJSON
          let responseMasseinheitBO = MasseinheitBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseMasseinheitBO);
          })
        })
      }
      // Aktualisiert eine Maßeinheit
      updateMasseinheit(masseinheitBO) {
        console.log("updateMasseinheit", masseinheitBO)
        return this.#fetchAdvanced(this.#updateMasseinheitURL(masseinheitBO.getID()), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(masseinheitBO)
        }).then((responseJSON) => {
          // We always get an array of MasseinheitBOs.fromJSON
          let responseMasseinheitBO = MasseinheitBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseMasseinheitBO);
          })
        })
      }

      // ALLE METHODEN FÜR LEBENSMITTELEINTRAG

      // Erstellt einen neuen Lebensmitteleintrag
      createLebensmitteleintrag(lebensmitteleintragBO) {
        return this.#fetchAdvanced(this.#createLebensmitteleintragURL(), {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(lebensmitteleintragBO)
        }).then((responseJSON) => {
          let responseLebensmitteleintragBO = LebensmitteleintragBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseLebensmitteleintragBO);
          })
        })
      }
    // Holt einen Lebensmitteleintrag anhand der ID ab      
    getLebensmitteleintragById(id){
        return this.#fetchAdvanced(this.#getLebensmitteleintragByIdURL(id)).then((responseJSON) => {
          let lebensmitteleintragBOs = LebensmitteleintragBO.fromJSON(responseJSON);
          // console.info(lebensmitteleintragBOs);
          return new Promise(function (resolve) {
            resolve(lebensmitteleintragBOs);
          })
        })
      }
    // Holt Lebensmitteleinträge anhand von Aufbewahrungs-ID und Aufbewahrungsort ab      
    getLebensmitteleintragByAufbewahrOrt(aufbewahrId, aufbewahrOrt){
        return this.#fetchAdvanced(this.#getLebensmitteleintragByAufbewahrOrtURL(aufbewahrOrt, aufbewahrId)).then((responseJSON) => {
          let lebensmitteleintragBOs = LebensmitteleintragBO.fromJSON(responseJSON);
          // console.info(lebensmitteleintragBOs);
          return new Promise(function (resolve) {
            resolve(lebensmitteleintragBOs);
          })
        })
      }
      // Löscht einen Lebensmitteleintrag anhand seiner ID
      deleteLebensmitteleintrag(lebensmitteleintragID, isEinkaufsliste) {
        return this.#fetchAdvanced(this.#deleteLebensmitteleintragURL(lebensmitteleintragID, isEinkaufsliste), {
          method: 'DELETE'
        }).then((responseJSON) => {
          let responseLebensmitteleintragBO = LebensmitteleintragBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseLebensmitteleintragBO);
          })
        })
      }
      // Aktualisiert einen Lebensmitteleintrag
      updateLebensmitteleintrag(lebensmitteleintragBO) {
        return this.#fetchAdvanced(this.#updateLebensmitteleintragURL(lebensmitteleintragBO.getID()), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(lebensmitteleintragBO)
        }).then((responseJSON) => {
          let responseLebensmitteleintragBO = LebensmitteleintragBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseLebensmitteleintragBO);
          })
        })
      }

      // ALLE METHODEN FÜR LEBENSMITTEL

      // Erstellt ein neues Lebensmittel
      createLebensmittel(lebensmittelBO) {
        return this.#fetchAdvanced(this.#createLebensmittelURL(), {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(lebensmittelBO)
        }).then((responseJSON) => {
          let responseLebensmittelBO = LebensmittelBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseLebensmittelBO);
          })
        })
      }
    // Holt ein Lebensmittel anhand der ID ab      
    getLebensmittelById(id){
        return this.#fetchAdvanced(this.#getLebensmittelByIdURL(id)).then((responseJSON) => {
          let lebensmittelBOs = LebensmittelBO.fromJSON(responseJSON);
          // console.info(lebensmittelBOs);
          return new Promise(function (resolve) {
            resolve(lebensmittelBOs);
          })
        })
      }
    // Holt alle Lebensmittel      
    getAllLebensmittel(){
        return this.#fetchAdvanced(this.#getAllLebensmittelURL()).then((responseJSON) => {
          let lebensmittelBOs = LebensmittelBO.fromJSON(responseJSON);
          // console.info(lebensmittelBOs);
          return new Promise(function (resolve) {
            resolve(lebensmittelBOs);
          })
        })
      }
      // Löscht ein Lebensmittel anhand seiner ID
      deleteLebensmittel(lebensmittelID) {
        return this.#fetchAdvanced(this.#deleteLebensmittelURL(lebensmittelID), {
          method: 'DELETE'
        }).then((responseJSON) => {
          let responseLebensmittelBO = LebensmittelBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseLebensmittelBO);
          })
        })
      }
      // Aktualisiert ein Lebensmittel
      updateLebensmittel(lebensmittelBO) {
        return this.#fetchAdvanced(this.#updateLebensmittelURL(lebensmittelBO.getID()), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(lebensmittelBO)
        }).then((responseJSON) => {
          let responseLebensmittelBO = LebensmittelBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseLebensmittelBO);
          })
        })
      }

      // ALLE METHODEN FÜR KÜHLSCHRANK

      // Erstellt einen neuen Kühlschrank
      createKuehlschrank(kuehlschrankBO) {
        return this.#fetchAdvanced(this.#createKuehlschrankURL(), {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(kuehlschrankBO)
        }).then((responseJSON) => {
          let responseKuehlschrankBO = KuehlschrankBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseKuehlschrankBO);
          })
        })
      }
    // Holt einen Kühlschrank anhand der ID ab      
    getKuehlschrankById(id){
        return this.#fetchAdvanced(this.#getKuehlschrankByIdURL(id)).then((responseJSON) => {
          let kuehlschrankBOs = KuehlschrankBO.fromJSON(responseJSON);
          // console.info(kuehlschrankBOs);
          return new Promise(function (resolve) {
            resolve(kuehlschrankBOs);
          })
        })
      }

      // Löscht einen Kühlschrank anhand seiner ID
      deleteKuehlschrank(kuehlschrankID) {
        return this.#fetchAdvanced(this.#deleteKuehlschrankURL(kuehlschrankID), {
          method: 'DELETE'
        }).then((responseJSON) => {
          let responseKuehlschrankBO = KuehlschrankBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseKuehlschrankBO);
          })
        })
      }
      // Aktualisiert einen Kühlschrank
      updateKuehlschrank(kuehlschrankBO) {
        return this.#fetchAdvanced(this.#updateKuehlschrankURL(kuehlschrankBO.getID()), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(kuehlschrankBO)
        }).then((responseJSON) => {
          // We always get an array of KuehlschrankBOs.fromJSON
          let responseKuehlschrankBO = KuehlschrankBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseKuehlschrankBO);
          })
        })
      }

      // ALLE METHODEN FÜR HAUSHALTSMITGLIEDER

      // Erstellt ein neues Haushaltsmitglied
      createHaushaltsmitglied(haushaltsmitgliedBO) {
        return this.#fetchAdvanced(this.#createHaushaltsmitgliedURL(), {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(haushaltsmitgliedBO)
        }).then((responseJSON) => {
          let responseHaushaltsmitgliedBO = HaushaltsmitgliedBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseHaushaltsmitgliedBO);
          })
        })
      }
      // Holt ein Haushaltsmitglied anhand der ID ab      
      getHaushaltsmitgliedById(id){
        return this.#fetchAdvanced(this.#getHaushaltsmitgliedByIdURL(id)).then((responseJSON) => {
          let haushaltsmitgliedBOs = HaushaltsmitgliedBO.fromJSON(responseJSON);
          // console.info(haushaltsmitgliedBOs);
          return new Promise(function (resolve) {
            resolve(haushaltsmitgliedBOs);
          })
        })
      }
      // Holt Haushaltsmitglieder anhand der Person ID ab  
      getHaushaltsmitgliedByPersonId(personId){
        return this.#fetchAdvanced(this.#getHaushaltsmitgliedByPersonIdURL(personId)).then((responseJSON) => {
          let haushaltsmitgliedBOs = HaushaltsmitgliedBO.fromJSON(responseJSON);
          // console.info(haushaltsmitgliedBOs);
          return new Promise(function (resolve) {
            resolve(haushaltsmitgliedBOs);
          })
        })
      }
      // Holt Haushaltsmitglieder anhand der Haushalt ID ab
      getHaushaltsmitgliedByHaushaltId(haushaltId){
        return this.#fetchAdvanced(this.#getHaushaltsmitgliedByHaushaltIdURL(haushaltId)).then((responseJSON) => {
          let haushaltsmitgliedBOs = HaushaltsmitgliedBO.fromJSON(responseJSON);
          // console.info(haushaltsmitgliedBOs);
          return new Promise(function (resolve) {
            resolve(haushaltsmitgliedBOs);
          })
        })
      }
      // Löscht ein Haushaltsmitglied anhand seiner ID
      deleteHaushaltsmitglied(haushaltsmitgliedID) {
        return this.#fetchAdvanced(this.#deleteHaushaltsmitgliedURL(haushaltsmitgliedID), {
          method: 'DELETE'
        }).then((responseJSON) => {
          let responseHaushaltsmitgliedBO = HaushaltsmitgliedBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseHaushaltsmitgliedBO);
          })
        })
      }
      // Aktualisiert ein Haushaltsmitglied
      updateHaushaltsmitglied(haushaltsmitgliedBO) {
        return this.#fetchAdvanced(this.#updateHaushaltsmitgliedURL(haushaltsmitgliedBO.getID()), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(haushaltsmitgliedBO)
        }).then((responseJSON) => {
          // We always get an array of HaushaltsmitgliedBOs.fromJSON
          let responseHaushaltsmitgliedBO = HaushaltsmitgliedBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseHaushaltsmitgliedBO);
          })
        })
      }

        // ALLE METHODEN FÜR HAUSHALT

        // Erstellt einen neuen Haushalt
      createHaushalt(haushaltBO) {
        return this.#fetchAdvanced(this.#createHaushaltURL(), {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(haushaltBO)
        }).then((responseJSON) => {
          let responseHaushaltBO = HaushaltBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseHaushaltBO);
          })
        })
      }
      // Holt einen Haushalt anhand der ID ab      
      getHaushaltById(id){
        return this.#fetchAdvanced(this.#getHaushaltByIdURL(id)).then((responseJSON) => {
          let haushaltBOs = HaushaltBO.fromJSON(responseJSON);
          // console.info(haushaltBOs);
          return new Promise(function (resolve) {
            resolve(haushaltBOs);
          })
        })
      }
      
      // Holt alle Haushalte für eine Person ab    
      getAllHaushalt(personId){
        return this.#fetchAdvanced(this.#getAllHaushaltURL(personId)).then((responseJSON) => {
          let haushaltBOs = HaushaltBO.fromJSON(responseJSON);
          // console.info(haushaltBOs);
          return new Promise(function (resolve) {
            resolve(haushaltBOs);
          })
        })
      }
      // Löscht einen Haushalt anhand seiner ID
      deleteHaushalt(haushaltID) {
        return this.#fetchAdvanced(this.#deleteHaushaltURL(haushaltID), {
          method: 'DELETE'
        }).then((responseJSON) => {
          let responseHaushaltBO = HaushaltBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseHaushaltBO);
          })
        })
      }
      // Aktualisiert einen Haushalt
      updateHaushalt(haushaltBO) {
        return this.#fetchAdvanced(this.#updateHaushaltURL(haushaltBO.getID()), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(haushaltBO)
        }).then((responseJSON) => {
          let responseHaushaltBO = HaushaltBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseHaushaltBO);
          })
        })
      }

      // ALLE METHODEN FÜR EINKAUFSLISTE

      // Erstellt eine neue Einkaufsliste
      createEinkaufsliste(einkaufslisteBO) {
        return this.#fetchAdvanced(this.#createEinkaufslisteURL(), {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(einkaufslisteBO)
        }).then((responseJSON) => {
          let responseEinkaufslisteBO = EinkaufslisteBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseEinkaufslisteBO);
          })
        })
      }
      // Holt Einkaufslisten anhand der Haushalt ID ab    
      getEinkaufslisteByHaushaltId(id){
        return this.#fetchAdvanced(this.#getEinkaufslisteByHaushaltIdURL(id)).then((responseJSON) => {
          let einkaufslisteBOs = EinkaufslisteBO.fromJSON(responseJSON);
          // console.info(einkaufslisteBOs);
          return new Promise(function (resolve) {
            resolve(einkaufslisteBOs);
          })
        })
      }
      // Löscht eine Einkaufsliste anhand ihrer ID    
      deleteEinkaufsliste(einkaufslisteID) {
        return this.#fetchAdvanced(this.#deleteEinkaufslisteURL(einkaufslisteID), {
          method: 'DELETE'
        }).then((responseJSON) => {
          let responseEinkaufslisteBO = EinkaufslisteBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseEinkaufslisteBO);
          })
        })
      }
      // Aktualisiert eine Einkaufsliste      
      updateEinkaufsliste(einkaufslisteBO) {
        return this.#fetchAdvanced(this.#updateEinkaufslisteURL(einkaufslisteBO.getID()), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(einkaufslisteBO)
        }).then((responseJSON) => {
          let responseEinkaufslisteBO = EinkaufslisteBO.fromJSON(responseJSON)[0];
          // console.info(accountBOs);
          return new Promise(function (resolve) {
            resolve(responseEinkaufslisteBO);
          })
        })
      }

     
  }
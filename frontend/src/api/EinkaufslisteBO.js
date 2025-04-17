// Importiert die Basisklasse BusinessObject aus der Datei BusinessObject
import BusinessObject from "./BusinessObject";

  /**
 * Repräsentiert eine Einkaufsliste
 */
export default class EinkaufslisteBO extends BusinessObject {
  /**
   * Konstruktor für ein EinkaufslisteBO-Objekt.
   *    *
   * @param {String} aHaushaltId -Attribut of EinkaufslisteBO.
   */
  constructor(aHaushaltId) {
    super(); // Ruft den Konstruktor der Basisklasse BusinessObject auf
    this.haushalt_id = aHaushaltId; // Setzt die haushalt_id auf den übergebenen Wert
  }
  /**
   * Setzt die Haushalt-ID dieses EinkaufslisteBO.
   *
   * @param {String} aHaushaltId - Die neue Haushalt-ID
   */
  
  setHaushaltId(aHaushaltId) {
    this.haushalt_id = aHaushaltId; // Setzt die haushalt_id auf den übergebenen Wert
  }
  /**
   * Gibt die Haushalt-ID dieses EinkaufslisteBO zurück.
   */
  getHaushaltId() {
    return this.haushalt_id; // Gibt die aktuelle haushalt_id zurück
  }

  /**
   * Gibt ein Array von EinkaufslisteBOs aus einer gegebenen JSON-Struktur zurück.
   *
   * @param {Object} Einkaufslistes - Die JSON-Struktur
   * @return {Array} Ein Array von EinkaufslisteBO-Objekten
   */
  static fromJSON(Einkaufslistes) {
    let result = []; // Initialisiert ein leeres Array für die Ergebnisse

    if (Array.isArray(Einkaufslistes)) {
      // Prüft, ob Einkaufslistes ein Array ist
      Einkaufslistes.forEach((u) => {
        Object.setPrototypeOf(u, EinkaufslisteBO.prototype); // Setzt das Prototyp von u auf EinkaufslisteBO
        result.push(u); // Fügt u zum Ergebnis-Array hinzu
      });
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let u = Einkaufslistes;
      Object.setPrototypeOf(u, EinkaufslisteBO.prototype); // Setzt das Prototyp von u auf EinkaufslisteBO
      result.push(u); // Fügt u zum Ergebnis-Array hinzu
    }

    return result;  // Gibt das Ergebnis-Array zurück
  }
}
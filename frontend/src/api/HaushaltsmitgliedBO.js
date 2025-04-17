/**
 * Stellt ein Haushaltsmitglied dar und verwaltet die Umwandlung von JSON-Daten in HaushaltsmitgliedBO-Objekte.
 * Implementiert die BusinessObject-Klasse für die Datenverwaltung.
 * 
 * Diese Klasse unterstützt die 3-Tier-Architektur, indem sie die Datenzugriffslogik für Haushaltsmitglieder bereitstellt
 * und JSON-Daten in Objekte umwandelt.
 */
import BusinessObject from "./BusinessObject";

/**
 * Repräsentiert eine Haushaltsmitglied
 */
export default class HaushaltsmitgliedBO extends BusinessObject {
  /**
   * Constructs a HaushaltsmitgliedBO object.
   *
   * @param {String} aPersonId -Attribut des HaushaltsmitgliedBO.
   * @param {String} aHaushaltId -Attribut des HaushaltsmitgliedBO.
   */
  constructor(aPersonId, aHaushaltId) {
    super(); // Ruft den Konstruktor der Elternklasse auf, um deren Initialisierung durchzuführen.
    this.person_id = aPersonId; // Setzt die Person-ID des Haushaltsmitglieds auf den übergebenen Wert.
    this.haushalt_id = aHaushaltId; // Setzt die Haushalts-ID des Haushaltsmitglieds auf den übergebenen Wert.
  }
  /**
   * Setzt die Person ID des Haushaltsmitglieds.
   * @param {String} aPersonId - Die ID der Person.
   */
  setPersonId(aPersonId) {
    this.person_id = aPersonId;
  }
  /**
   * Gibt die Person ID des Haushaltsmitglieds zurück.
   * @returns {String} - Die ID der Person.
   */
  getPersonId() {
    return this.person_id;
  }
  /**
   * Setzt die Haushalt ID, dem das Mitglied angehört.
   * @param {String} aHaushaltId - Die ID des Haushalts.
   */
  setHaushaltId(aHaushaltId) {
    this.haushalt_id = aHaushaltId;
  }
  /**
   * Gibt die Haushalt ID zurück, dem das Mitglied angehört.
   * @returns {String} - Die ID des Haushalts.
   */
  getHaushaltId() {
    return this.haushalt_id;
  }

  /**
   * Konvertiert JSON-Daten oder ein JSON-Array in ein Array von HaushaltsmitgliedBO-Objekten.
   *
   * @param {Object | Array} Haushaltsmitglieds - Die JSON-Daten oder das JSON-Array, das umgewandelt werden soll.
   * @returns {Array} - Ein Array von HaushaltsmitgliedBO-Objekten.
   */
  static fromJSON(Haushaltsmitglieds) {
    let result = [];

    if (Array.isArray(Haushaltsmitglieds)) {
      Haushaltsmitglieds.forEach((u) => {
        Object.setPrototypeOf(u, HaushaltsmitgliedBO.prototype);
        result.push(u);
      });
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let u = Haushaltsmitglieds;
      Object.setPrototypeOf(u, HaushaltsmitgliedBO.prototype);
      result.push(u);
    }

    return result;
  }
}
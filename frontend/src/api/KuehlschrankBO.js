import BusinessObject from "./BusinessObject";

/**
 * Repräsentiert einen Kuehlschrank
 */
export default class KuehlschrankBO extends BusinessObject {
   /**
   * Konstruktor für ein KuehlschrankBO-Objekt.
   *
   * @param {String} aHaushaltId - Attribut des KuehlschrankBO.
   */
  constructor(aHaushaltId) {
    super();
    this.haushalt_id = aHaushaltId;
  }
  // Setzt die Haushalt-ID
  setHaushaltId(aHaushaltId) {
    this.haushalt_id = aHaushaltId;
  }
  // Gibt die Haushalt-ID zurück
  getHaushaltId() {
    return this.haushalt_id;
  }

  /**
   * Gibt ein Array von KuehlschrankBOs aus einer gegebenen JSON-Struktur zurück.
   */
  static fromJSON(Kuehlschranks) {
    let result = [];

    if (Array.isArray(Kuehlschranks)) {
      Kuehlschranks.forEach((u) => {
        Object.setPrototypeOf(u, KuehlschrankBO.prototype);
        result.push(u);
      });
    } else {
      // Die JSON-Daten repräsentieren ein einzelnes Objekt, kein Array
      let u = Kuehlschranks;
      Object.setPrototypeOf(u, KuehlschrankBO.prototype);
      result.push(u);
    }

    return result;
  }
}
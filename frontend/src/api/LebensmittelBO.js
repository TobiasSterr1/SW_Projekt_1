import BusinessObject from "./BusinessObject";

/**
 * Repräsentiert ein Lebensmittel
 */
export default class LebensmittelBO extends BusinessObject {
  /**
   * Konstruktion eines LebensmittelBO Objekts.
   *
   * @param {String} aBezeichnung - Attribut des LebensmittelBO.
   * @param {String} aErstellerId - Attribut des LebensmittelBO.
   */
  constructor(aBezeichnung, aErstellerId) {
    super();
    this.bezeichnung = aBezeichnung;
    this.ersteller_id = aErstellerId;
  }
  // Setzt die Bezeichnung des Lebensmittels
  setBezeichnung(aBezeichnung) {
    this.bezeichnung = aBezeichnung;
  }
  // Gibt die Bezeichnung des Lebensmittels zurück
  getBezeichnung() {
    return this.bezeichnung;
  }
  // Setzt die Ersteller-ID des Lebensmittels
  setErstellerId(aErstellerId) {
    this.ersteller_id = aErstellerId;
  }
  // Gibt die Ersteller-ID des Lebensmittels zurück
  getErstellerId() {
    return this.ersteller_id;
  }

  /**
   * Gibt ein Array von LebensmittelBOs aus einer gegebenen JSON-Struktur zurück.
   */
  static fromJSON(Lebensmittels) {
    let result = [];
    // Überprüfen, ob es sich um ein Array handelt
    if (Array.isArray(Lebensmittels)) {
      Lebensmittels.forEach((u) => {
        Object.setPrototypeOf(u, LebensmittelBO.prototype);
        result.push(u);
      });
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let u = Lebensmittels;
      Object.setPrototypeOf(u, LebensmittelBO.prototype);
      result.push(u);
    }

    return result;
  }
}
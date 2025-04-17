import BusinessObject from "./BusinessObject";

/**
 * Repräsentiert einen Lebensmitteleintrag
 */
export default class LebensmitteleintragBO extends BusinessObject {
  /**
   * Konstruktion eines LebensmitteleintragBO Objekts.
   *
   * @param {String} aAufbewahrId - Attribut des LebensmitteleintragBO.
   * @param {String} aAufbewahrOrt - Attribut des LebensmitteleintragBO.
   * @param {String} aLebensmittelId - Attribut des LebensmitteleintragBO.
   * @param {String} aMengeId - Attribut des LebensmitteleintragBO.
   */
  constructor(aAufbewahrId, aAufbewahrOrt, aLebensmittelId, aMengeId) {
    super();
    this.aufbewahr_id = aAufbewahrId;
    this.aufbewahr_ort = aAufbewahrOrt;
    this.lebensmittel_id = aLebensmittelId;
    this.menge_id = aMengeId;
  }

  // Setzt die Aufbewahrungs-ID des Lebensmitteleintrags
  setAufbewahrId(aAufbewahrId) {
    this.aufbewahr_id = aAufbewahrId;
  }
  // Gibt die Aufbewahrungs-ID des Lebensmitteleintrags zurück
  getAufbewahrId() {
    return this.aufbewahr_id;
  }

  // Setzt den Aufbewahrungsort des Lebensmitteleintrags
  setAufbewahrOrt(aAufbewahrOrt) {
    this.aufbewahr_ort = aAufbewahrOrt;
  }

  // Gibt den Aufbewahrungsort des Lebensmitteleintrags zurück
  getAufbewahrOrt() {
    return this.aufbewahr_ort;
  }

  // Setzt die Lebensmittel-ID des Lebensmitteleintrags
  setLebensmittelId(aLebensmittelId) {
    this.lebensmittel_id = aLebensmittelId;
  }

  // Gibt die Lebensmittel-ID des Lebensmitteleintrags zurück
  getLebensmittelId() {
    return this.lebensmittel_id;
  }

  // Setzt die Mengen-ID des Lebensmitteleintrags
  setMengeId(aMengeId) {
    this.menge_id = aMengeId;
  }

  // Gibt die Mengen-ID des Lebensmitteleintrags zurück
  getMengeId() {
    return this.menge_id;
  }

  /**
   * Gibt ein Array von LebensmitteleintragBOs aus einer gegebenen JSON-Struktur zurück.
   */
  static fromJSON(Lebensmitteleintrags) {
    let result = [];
    
    // Überprüfen, ob es sich um ein Array handelt
    if (Array.isArray(Lebensmitteleintrags)) {
      Lebensmitteleintrags.forEach((u) => {
        Object.setPrototypeOf(u, LebensmitteleintragBO.prototype);
        result.push(u);
      });
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let u = Lebensmitteleintrags;
      Object.setPrototypeOf(u, LebensmitteleintragBO.prototype);
      result.push(u);
    }

    return result;
  }
}
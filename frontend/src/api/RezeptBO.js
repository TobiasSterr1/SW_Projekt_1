import BusinessObject from "./BusinessObject";

/**
 * Repräsentiert eine Rezept
 */
export default class RezeptBO extends BusinessObject {
  /**
   * Konstruiert ein RezeptBO-Objekt.
   *
   * @param {String} aEigentuemerId - Attribut von RezeptBO.
   * @param {String} aHaushaltId - Attribut von RezeptBO.
   * @param {String} aName - Attribut von RezeptBO.
   * @param {String} aAnzahlPersonen - Attribut von RezeptBO.
   * @param {String} aZubereitung - Attribut von RezeptBO.
   */
  constructor(aEigentuemerId, aName, aAnzahlPersonen, aZubereitung, aHaushaltId) {
    super();
    this.eigentuemer_id = aEigentuemerId;
    this.name= aName;
    this.anzahl_personen = aAnzahlPersonen;
    this.zubereitung = aZubereitung;
    this.haushalt_id = aHaushaltId;
  }

  setEigentuemerId(aEigentuemerId) {
    this.eigentuemer_id = aEigentuemerId;
  }

  getEigentuemerId() {
    return this.eigentuemer_id;
  }

  setName(aName) {
    this.name= aName;
  }

  getName() {
    return this.haushalt_id;
  }

  setAnzahlPersonen(aAnzahlPersonen) {
    this.anzahl_personen = aAnzahlPersonen;
  }

  getAnzahlPersonen() {
    return this.anzahl_personen;
  }

  setZubereitung(aZubereitung) {
    this.zubereitung = aZubereitung;
  }

  getZubereitung() {
    return this.zubereitung;
  }

  setHaushaltId(aHaushaltId) {
    this.haushalt_id = aHaushaltId;
  }

  getHaushaltId() {
    return this.haushalt_id;
  }

  /**
   * Wandelt eine JSON-Struktur in ein Array von RezeptBO-Objekten um.
   * @param {Object | Object[]} Rezepts - Die JSON-Struktur oder das Array davon.
   * @returns {RezeptBO[]} - Ein Array von RezeptBO-Objekten.
   */
  static fromJSON(Rezepts) {
    let result = [];

    if (Array.isArray(Rezepts)) {
      Rezepts.forEach((u) => {
        Object.setPrototypeOf(u, RezeptBO.prototype);
        result.push(u);
      });
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let u = Rezepts;
      Object.setPrototypeOf(u, RezeptBO.prototype);
      result.push(u);
    }

    return result;
  }
}
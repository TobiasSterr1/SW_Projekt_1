import BusinessObject from "./BusinessObject";

/**
 * Repräsentiert eine Menge
 */
export default class MengeBO extends BusinessObject {
  /**
   * Konstruiert ein MengeBO Objekt.
   *
   * @param {String} aMengenAnzahl - Attribut von MengeBO.
   * @param {String} aMasseinheitId - Attribut von MengeBO.
   */
  constructor(aMengenAnzahl, aMasseinheitId) {
    super();
    this.mengenanzahl = aMengenAnzahl;
    this.masseinheit_id = aMasseinheitId;
  }

  setMengenAnzahl(aMengenAnzahl) {
    this.mengenanzahl = aMengenAnzahl;
  }

  getMengenAnzahl() {
    return this.mengenanzahl;
  }

  setMasseinheitId(aMasseinheitId) {
    this.masseinheit_id = aMasseinheitId;
  }

  getMasseinheitId() {
    return this.masseinheit_id;
  }

  /**
   * Returns an Array of MengeBOs from a given JSON structure.
   */
  static fromJSON(Menges) {
    let result = [];

    if (Array.isArray(Menges)) {
      Menges.forEach((u) => {
        Object.setPrototypeOf(u, MengeBO.prototype);
        result.push(u);
      });
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let u = Menges;
      Object.setPrototypeOf(u, MengeBO.prototype);
      result.push(u);
    }

    return result;
  }
}
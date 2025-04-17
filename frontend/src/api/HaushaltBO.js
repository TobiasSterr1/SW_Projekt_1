// Import der BusinessObject-Klasse, die als Basis für HaushaltBO verwendet wird
import BusinessObject from "./BusinessObject";

/**
 * Repräsentiert eine Haushalt
 */
export default class HaushaltBO extends BusinessObject {
  /**
   * Konstruiert ein HaushaltBO-Objekt.
   *
   * @param {String} aName -Attribut des HaushaltBO.
   * @param {String} aOwnerId -Attribut des HaushaltBO.
   */
  constructor(aName, aOwnerId) {
    super();
    this.name = aName;
    this.owner_id = aOwnerId;
  }
  /**
   * Setzt den Namen des Haushalts.
   *
   * @param {String} aName - Der neue Name des Haushalts.
   */
  setName(aName) {
    this.name = aName;
  }
  /**
   * Gibt den Namen des Haushalts zurück.
   *
   * @returns {String} - Der Name des Haushalts.
   */
  getName() {
    return this.name;
  }
  /**
   * Setzt die Owner-ID des Haushalts.
   *
   * @param {String} aOwnerId - Die neue Owner-ID des Haushalts.
   */
  setOwnerId(aOwnerId) {
    this.owner_id = aOwnerId;
  }
  /**
   * Gibt die Owner-ID des Haushalts zurück.
   *
   * @returns {String} - Die Owner-ID des Haushalts.
   */
  getOwnerId() {
    return this.owner_id;
  }


  /**
   * Wandelt eine gegebene JSON-Struktur in ein Array von HaushaltBO-Objekten um.
   *
   * @param {Object|Object[]} Haushalts - Die JSON-Daten, die in HaushaltBOs umgewandelt werden sollen.
   * @returns {HaushaltBO[]} - Ein Array von HaushaltBO-Objekten.
   */
  static fromJSON(Haushalts) {
    let result = [];

    if (Array.isArray(Haushalts)) {
      Haushalts.forEach((u) => {
        Object.setPrototypeOf(u, HaushaltBO.prototype);
        result.push(u);
      });
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let u = Haushalts;
      Object.setPrototypeOf(u, HaushaltBO.prototype);
      result.push(u);
    }

    return result;
  }
}
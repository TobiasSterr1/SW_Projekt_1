import BusinessObject from "./BusinessObject";

/**
 * Repräsentiert eine Masseinheit
 */
export default class MasseinheitBO extends BusinessObject {
  /**
   * Konstruktion eines MasseinheitBO Objekts.
   *
   * @param {String} aBezeichnung - Attribut des MasseinheitBO.
   * @param {Float} aUmrechnungsWert - Attribut des MasseinheitBO.
   * @param {String} aIstVolumen - Attribut des MasseinheitBO.
   * @param {String} aEigentuemerId - Attribut des MasseinheitBO.
   */
  constructor(aBezeichnung, aUmrechnungsWert, aIstVolumen, aEigentuemerId) {
    super();
    this.bezeichnung = aBezeichnung;
    this.umrechnungs_wert = aUmrechnungsWert;
    this.ist_volumen = aIstVolumen;
    this.eigentuemer_id = aEigentuemerId;
  }

  setBezeichnung(aBezeichnung) {
    this.bezeichnung = aBezeichnung;
  }

  getBezeichnung() {
    return this.bezeichnung;
  }

  setUmrechnungsWert(aUmrechnungsWert) {
    this.umrechnungs_wert = aUmrechnungsWert;
  }

  getUmrechnungsWert() {
    return this.umrechnungs_wert;
  }

  setIstVolumen(aIstVolumen) {
    this.ist_volumen = aIstVolumen;
  }

  getIstVolumen() {
    return this.ist_volumen;
  }

  setEigentuemerId(aEigentuemerId) {
    this.eigentuemer_id = aEigentuemerId;
  }

  getEigentuemerId() {
    return this.eigentuemer_id;
  }

  /**
   * Gibt ein Array von MasseinheitBOs aus einer gegebenen JSON-Struktur zurück.
   */
  static fromJSON(Masseinheits) {
    let result = [];

    if (Array.isArray(Masseinheits)) {
      Masseinheits.forEach((u) => {
        Object.setPrototypeOf(u, MasseinheitBO.prototype);
        result.push(u);
      });
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let u = Masseinheits;
      Object.setPrototypeOf(u, MasseinheitBO.prototype);
      result.push(u);
    }

    return result;
  }
}
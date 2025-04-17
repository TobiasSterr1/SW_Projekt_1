import BusinessObject from "./BusinessObject";

/**
 * Repräsentiert eine Person
 */
export default class PersonBO extends BusinessObject {
   /**
   * Konstruiert ein PersonBO-Objekt.
   *
   * @param {String} aBenutzername - Attribut von PersonBO.
   * @param {String} aEmail - Attribut von PersonBO.
   * @param {String} aGoogleuserId - Attribut von PersonBO.
   * @param {String} aHaushaltId - Attribut von PersonBO.
   * @param {String} aFirstname - Attribut von PersonBO.
   * @param {String} aLastname - Attribut von PersonBO.
   */
  constructor(aBenutzername,  aEmail, aGoogleuserId, aHaushaltId, aFirstname, aLastname) {
    super();
    this.benutzername = aBenutzername;
    this.email = aEmail;
    this.google_user_id = aGoogleuserId;
    this.haushalt_id = aHaushaltId;
    this.firstname = aFirstname;
    this.lastname = aLastname;
  }

  setBenutzername(aBenutzername) {
    this.benutzername = aBenutzername;
  }

  getBenutzername() {
    return this.benutzername;
  }

  setEmail(aEmail) {
    this.email = aEmail;
  }

  getEmail() {
    return this.email;
  }

  setGoogleuserId(aGoogleuserId) {
    this.google_user_id = aGoogleuserId;
  }

  getGoogleuserId() {
    return this.google_user_id;
  }

  setHaushaltId(aHaushaltId) {
    this.haushalt_id = aHaushaltId;
  }

  getHaushaltId() {
    return this.haushalt_id;
  }
  
  getFirstname() {
    return this.firstname;
  }
  
  setFirstname(aFirstname) {
    this.firstname = aFirstname;
  }
  
  setLastname(aLastname) {
    this.lastname = aLastname;
  }
  
  getLastname() {
    return this.lastname;
  }

  /**
   * Wandelt eine JSON-Struktur in ein Array von PersonBO-Objekten um.
   * @param {Object | Object[]} Persons - Die JSON-Struktur oder das Array davon.
   * @returns {PersonBO[]} - Ein Array von PersonBO-Objekten.
   */
  static fromJSON(Persons) {
    let result = [];
    if (Array.isArray(Persons)) {
      Persons.forEach((u) => {
        Object.setPrototypeOf(u, PersonBO.prototype);
        result.push(u);
      });
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let u = Persons;
      Object.setPrototypeOf(u, PersonBO.prototype);
      result.push(u);
    }
    return result;
  }
}
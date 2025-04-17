/**
  * Basisklasse für alle BusinessObjects, die standardmäßig ein ID-Feld hat.
 */
export default class BusinessObject {
    /**
      * Der Null-Konstruktor.
     * Initialisiert das BusinessObject mit einer ID von 0 und dem aktuellen Zeitstempel.
     */
    constructor() {
      this.id = 0;
      this.zeitstempel = new Date();
    }
  
    /**
     * Setzt die ID dieses BusinessObjects.
     *
     * @param {*} aId - die neue ID dieses BusinessObjects
     */
    setID(aId) {
      this.id = aId;  // Setzt die ID auf den übergebenen Wert
    }
  
    /**
     * Gibt die ID dieses BusinessObjects zurück.
     */
    getID() {
      return this.id;  // Gibt die aktuelle ID zurück
    }
  
        /**
     * Setzt den Zeitstempel dieses BusinessObjects.
     */
    setZeitstempel(aZeitstempel) {
      this.zeitstempel = aZeitstempel;  // Setzt den Zeitstempel auf den übergebenen Wert
    }
  
    /**
     * Gibt den Zeitstempel dieses BusinessObjects zurück.
     */
    getZeitstempel() {
      return this.zeitstempel;  // Gibt den aktuellen Zeitstempel zurück
    }
  
    /**
     * Gibt eine Zeichenkettenrepräsentation dieses Objekts zurück. Dies ist nützlich für Debugging-Zwecke.
     */
    toString() {
      let result = ""; // Initialisiert die Ergebniszeichenkette
      for (var prop in this) {
        result += prop + ": " + this[prop] + " ";  // Fügt jede Eigenschaft und ihren Wert der Ergebniszeichenkette hinzu
      }
      return result;  // Gibt die Ergebniszeichenkette zurück
    }
  }
  
  
# Importiere die Klasse 'BusinessObject' aus dem Modul 'server.bo.BusinessObject'
from server.bo.BusinessObject import BusinessObject

"""
Die Klasse Einkaufsliste repräsentiert ein Objekt, das eine Liste von Einkäufen für einen Haushalt darstellt.
Sie erweitert die abstrakte Basisklasse BusinessObject und enthält spezifische Attribute und Methoden
zur Verwaltung von Einkaufslisten.
"""

class Einkaufsliste(BusinessObject):
    """Klasse Einkaufsliste"""  

    def __init__(self):
        super().__init__()      # Ruft den Initialisierer der Basisklasse auf
        self._haushalt_id = 0   # Initialisiert die haushalt_id mit 0

    def set_haushalt_id(self, haushalt_id):
        """Setzen der haushalt_id der Einkaufsliste."""
        self._haushalt_id = haushalt_id

    def get_haushalt_id(self):
        """Auslesen der haushalt_id der Einkaufsliste."""
        return self._haushalt_id

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Einkaufsliste: {}, {}, {}".format(
            self.get_id(),          # ID des Einkaufslistenobjekts
            self.get_zeitstempel(), # Zeitstempel des Einkaufslistenobjekts
            self.get_haushalt_id(), # haushalt_id des Einkaufslistenobjekts
        )

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Einkaufsliste-Objekt."""
        obj = Einkaufsliste()                           # Erstellen einer neuen Instanz von Einkaufsliste
        obj.set_id(dictionary["id"])                    # Setzen der ID aus dem Dictionary
        obj.set_zeitstempel(dictionary["zeitstempel"])  # Setzen des Zeitstempels aus dem Dictionary
        obj.set_haushalt_id(dictionary["haushalt_id"])  # Setzen der haushalt_id aus dem Dictionary
        return obj                                      # Rückgabe des erstellten Objekts
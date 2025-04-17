# Importiere die Basisklasse BusinessObject aus dem Modul server.bo.BusinessObject
from server.bo.BusinessObject import BusinessObject

"""
Diese Klasse repräsentiert ein Haushaltsmitglied innerhalb eines Haushalts und 
erweitert die Funktionalitäten der BusinessObject-Basisklasse. 
Sie enthält Attribute für die Identifikation der Person und des Haushalts sowie 
Methoden zum Setzen und Auslesen dieser Attribute.
"""

class Haushaltsmitglied(BusinessObject):
    """Klasse Haushaltsmitglied"""  

    def __init__(self):
        super().__init__()
        self._person_id = 0
        self._haushalt_id = 0

    def set_person_id(self, person_id):
        """Setzen der person_id des Haushaltsmitglieds."""
        self._person_id = person_id

    def get_person_id(self):
        """Auslesen der person_id des Haushaltsmitglieds."""
        return self._person_id

    def set_haushalt_id(self, haushalt_id):
        """Setzen der haushalt_id des Haushaltsmitglieds."""
        self._haushalt_id = haushalt_id

    def get_haushalt_id(self):
        """Auslesen der haushalt_id des Haushaltsmitglieds."""
        return self._haushalt_id

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Haushaltsmitglied: {}, {}, {}, {}".format(
            self.get_id(),          # ID des Haushaltsmitglied-Objekts
            self.get_zeitstempel(), # Zeitstempel des Haushaltsmitglied-Objekts
            self.get_person_id(),   # person_id des Haushaltsmitglied-Objekts
            self.get_haushalt_id(), # haushalt_id des Haushaltsmitglied-Objekts
        )

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Haushaltsmitglied-Objekt."""
        obj = Haushaltsmitglied()                       # Erstellen einer neuen Instanz von Haushaltsmitglied
        obj.set_id(dictionary["id"])                    # Setzen der ID aus dem Dictionary
        obj.set_zeitstempel(dictionary["zeitstempel"])  # Setzen des Zeitstempels aus dem Dictionary
        obj.set_person_id(dictionary["person_id"])      # Setzen der person_id aus dem Dictionary
        obj.set_haushalt_id(dictionary["haushalt_id"])  # Setzen der haushalt_id aus dem Dictionary
        return obj                                      # Rückgabe des erstellten Objekts
# Importiere die Basisklasse BusinessObject aus dem Modul server.bo.BusinessObject
from server.bo.BusinessObject import BusinessObject

"""
Diese Klasse repräsentiert einen Haushalt und erweitert die Funktionalitäten der 
BusinessObject-Basisklasse. Sie enthält Attribute für den Namen des Haushalts und die 
Owner-ID sowie Methoden zum Setzen und Auslesen dieser Attribute."""

class Haushalt(BusinessObject):
    """Klasse Haushalt"""  

    def __init__(self):
        super().__init__()  # Ruft den Initialisierer der Basisklasse auf
        self._name = ""     # Initialisiert den Namen des Haushalts mit einem leeren String
        self._owner_id = "" # Initialisiert das Passwort des Haushalts mit einem leeren String

    def set_name(self, name):
        """Setzen der Name des Haushalts."""
        self._name = name

    def get_name(self):
        """Auslesen der Name des Haushalts."""
        return self._name
    
    def set_owner_id(self, owner_id):
        """Setzen der owner_id des Haushalts."""
        self._owner_id = owner_id

    def get_owner_id(self):
        """Auslesen der owner_id des Haushalts."""
        return self._owner_id

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Haushalt: {}, {}, {}, {}".format(
            self.get_id(),          # ID des Haushaltsobjekts
            self.get_zeitstempel(), # Zeitstempel des Haushaltsobjekts
            self.get_name(),        # Name des Haushalts
            self.get_owner_id(),    # Passwort des Haushalts
        )

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Haushalt-Objekt."""
        obj = Haushalt()                                # Erstellen einer neuen Instanz von Haushalt
        obj.set_id(dictionary["id"])                    # Setzen der ID aus dem Dictionary
        obj.set_zeitstempel(dictionary["zeitstempel"])  # Setzen des Zeitstempels aus dem Dictionary
        obj.set_name(dictionary["name"])                # Setzen des Namens aus dem Dictionary
        obj.set_owner_id(dictionary["owner_id"])        # Setzen des Passworts aus dem Dictionary
        return obj                                      # Rückgabe des erstellten Objekts
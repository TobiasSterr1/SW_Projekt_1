# Importiere die Basisklasse BusinessObject aus dem Modul server.bo.BusinessObject
from server.bo.BusinessObject import BusinessObject

"""
Klasse, die eine Menge repräsentiert. Diese Klasse erbt von BusinessObject
und enthält spezifische Attribute und Methoden, die eine Menge beschreiben.
Eine Menge hat eine Mengenanzahl und eine zugehörige Masseinheit.
"""

class Menge(BusinessObject):
    """Klasse Menge"""  

    def __init__(self):
        super().__init__()          # Ruft den Initialisierer der Basisklasse auf
        self._mengenanzahl = 0,0    # Initialisiert die Mengenanzahl der Menge mit (0, 0)
        self._masseinheit_id = 0    # Initialisiert die Masseinheit_id der Menge mit 0

    def set_mengenanzahl(self, mengenanzahl):
        """Setzen der Mengenanzahl des Menge."""
        self._mengenanzahl = mengenanzahl

    def get_mengenanzahl(self):
        """Auslesen der Mengenanzahl des Menge."""
        return self._mengenanzahl

    def set_masseinheit_id(self, masseinheit_id):
        """Setzen der Masseinheit_id des Menge."""
        self._masseinheit_id = masseinheit_id

    def get_masseinheit_id(self):
        """Auslesen der Masseinheit_id des Menge."""
        return self._masseinheit_id

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Menge: {}, {}, {}, {}".format(
            self.get_id(),                  # ID der Menge
            self.get_zeitstempel(),         # Zeitstempel der Menge
            self.get_mengenanzahl(),        # Mengenanzahl der Menge
            self.get_masseinheit_id(),      # Masseinheit_id der Menge
        )

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Menge-Objekt."""
        obj = Menge()                                       # Erstellen einer neuen Instanz von Menge
        obj.set_id(dictionary["id"])                        # Setzen der ID aus dem Dictionary
        obj.set_zeitstempel(dictionary["zeitstempel"])      # Setzen des Zeitstempels aus dem Dictionary
        obj.set_mengenanzahl(dictionary["mengenanzahl"])    # Setzen der Mengenanzahl aus dem Dictionary
        obj.set_masseinheit_id(dictionary["masseinheit_id"])  # Setzen der Masseinheit_id aus dem Dictionary
        return obj                                          # Rückgabe des erstellten Objekts
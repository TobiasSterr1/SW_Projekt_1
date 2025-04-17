# Importiere die Basisklasse BusinessObject aus dem Modul server.bo.BusinessObject
from server.bo.BusinessObject import BusinessObject

"""
Klasse, die einen Kühlschrank repräsentiert. Diese Klasse erbt von BusinessObject
und enthält spezifische Attribute und Methoden, die einen Kühlschrank in einem Haushalt
beschreiben. Ein Kühlschrank ist durch eine haushalt_id eindeutig einem Haushalt zugeordnet.
"""

class Kuehlschrank(BusinessObject):
    """Klasse Kuehlschrank"""  

    def __init__(self):
        super().__init__()      # Ruft den Initialisierer der Basisklasse auf
        self._haushalt_id = 0   # Initialisiert die haushalt_id des Kuehlschranks mit 0

    def set_haushalt_id(self, haushalt_id):
        """Setzen der haushalt_id des Kuehlschrank."""
        self._haushalt_id = haushalt_id

    def get_haushalt_id(self):
        """Auslesen der haushalt_id des Kuehlschrank."""
        return self._haushalt_id

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Kuehlschrank: {}, {}, {}".format(
            self.get_id(),          # ID des Kuehlschrankobjekts
            self.get_zeitstempel(), # Zeitstempel des Kuehlschrankobjekts
            self.get_haushalt_id(), # haushalt_id des Kuehlschrankobjekts
        )

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Kuehlschrank-Objekt."""
        obj = Kuehlschrank()                            # Erstellen einer neuen Instanz von Kuehlschrank
        obj.set_id(dictionary["id"])                    # Setzen der ID aus dem Dictionary
        obj.set_zeitstempel(dictionary["zeitstempel"])  # Setzen des Zeitstempels aus dem Dictionary
        obj.set_haushalt_id(dictionary["haushalt_id"])  # Setzen der haushalt_id aus dem Dictionary
        return obj
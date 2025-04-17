# Importiere die Basisklasse BusinessObject aus dem Modul server.bo.BusinessObject
from server.bo.BusinessObject import BusinessObject

"""
Klasse, die ein Lebensmittel repräsentiert. Diese Klasse erbt von BusinessObject
und enthält spezifische Attribute und Methoden, die ein Lebensmittel beschreiben. 
Ein Lebensmittel hat eine Bezeichnung und ist durch eine ersteller_id einem Ersteller zugeordnet.
"""

class Lebensmittel(BusinessObject):
    """Klasse Lebensmittel"""  

    def __init__(self):
        super().__init__()  # Ruft den Initialisierer der Basisklasse auf
        self._bezeichnung = ""  # Initialisiert die Bezeichnung des Lebensmittels mit einem leeren String
        self._ersteller_id = 0  # Initialisiert die ersteller_id des Lebensmittels mit 0

    def set_bezeichnung(self, bezeichnung):
        """Setzen der Bezeichnung des Lebensmittel."""
        self._bezeichnung = bezeichnung

    def get_bezeichnung(self):
        """Auslesen der Bezeichnung des Lebensmittel."""
        return self._bezeichnung

    def set_ersteller_id(self, ersteller_id):
        """Setzen der Ersteller_id des Lebensmittel."""
        self._ersteller_id = ersteller_id

    def get_ersteller_id(self):
        """Auslesen der Ersteller_id des Lebensmittel."""
        return self._ersteller_id

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Lebensmittel: {}, {}, {}, {}".format(
            self.get_id(),            # ID des Lebensmittels
            self.get_zeitstempel(),   # Zeitstempel des Lebensmittels
            self.get_bezeichnung(),   # Bezeichnung des Lebensmittels
            self.get_ersteller_id(),  # Ersteller_id des Lebensmittels
        )

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Lebensmittel-Objekt."""
        obj = Lebensmittel()  # Erstellen einer neuen Instanz von Lebensmittel
        obj.set_id(dictionary["id"])  # Setzen der ID aus dem Dictionary
        obj.set_zeitstempel(dictionary["zeitstempel"])  # Setzen des Zeitstempels aus dem Dictionary
        obj.set_bezeichnung(dictionary["bezeichnung"])  # Setzen der Bezeichnung aus dem Dictionary
        obj.set_ersteller_id(dictionary["ersteller_id"])  # Setzen der ersteller_id aus dem Dictionary
        return obj  # Rückgabe des erstellten Objekts
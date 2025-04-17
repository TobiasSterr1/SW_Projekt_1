# Importiere die Basisklasse BusinessObject aus dem Modul server.bo.BusinessObject
from server.bo.BusinessObject import BusinessObject

"""
Klasse, die einen Lebensmitteleintrag repräsentiert. Diese Klasse erbt von BusinessObject
und enthält spezifische Attribute und Methoden, die einen Lebensmitteleintrag beschreiben. 
Ein Lebensmitteleintrag hat eine aufbewahr_id, aufbewahr_ort, lebensmittel_id und menge_id.
"""

class Lebensmitteleintrag(BusinessObject):
    """Klasse Lebensmitteleintrag"""  

    def __init__(self):
        super().__init__()          # Ruft den Initialisierer der Basisklasse auf
        self._aufbewahr_id = 0      # Initialisiert die aufbewahr_id des Lebensmitteleintrags mit 0
        self._aufbewahr_ort = ""    # Initialisiert den aufbewahr_ort des Lebensmitteleintrags mit einem leeren String
        self._lebensmittel_id = 0   # Initialisiert die lebensmittel_id des Lebensmitteleintrags mit 0
        self._menge_id = 0          # Initialisiert die menge_id des Lebensmitteleintrags mit 0

    def set_aufbewahr_id(self, aufbewahr_id):
        """Setzen der Aufbewahr_id des Lebensmitteleintrag."""
        self._aufbewahr_id = aufbewahr_id

    def get_aufbewahr_id(self):
        """Auslesen der Aufbewahr_id des Lebensmitteleintrag."""
        return self._aufbewahr_id
    
    def set_menge_id(self, menge_id):
        """Setzen der Menge_id des Lebensmitteleintrag."""
        self._menge_id = menge_id

    def get_menge_id(self):
        """Auslesen der Menge_id des Lebensmitteleintrag."""
        return self._menge_id
    
    def set_lebensmittel_id(self, lebensmittel_id):
        """Setzen der Lebensmittel_id des Lebensmitteleintrag."""
        self._lebensmittel_id = lebensmittel_id

    def get_lebensmittel_id(self):
        """Auslesen der Lebensmittel_id des Lebensmitteleintrag."""
        return self._lebensmittel_id
    
    def set_aufbewahr_ort(self, aufbewahr_ort):
        """Setzen der Aufbewahr_ort des Lebensmitteleintrag."""
        self._aufbewahr_ort = aufbewahr_ort

    def get_aufbewahr_ort(self):
        """Auslesen der Aufbewahr_ort des Lebensmitteleintrag."""
        return self._aufbewahr_ort

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Lebensmitteleintrag: {}, {}, {}, {}, {}, {}".format(
            self.get_id(),              # ID des Lebensmitteleintrags
            self.get_zeitstempel(),     # Zeitstempel des Lebensmitteleintrags
            self.get_aufbewahr_id(),    # aufbewahr_id des Lebensmitteleintrags
            self.get_aufbewahr_ort(),   # aufbewahr_ort des Lebensmitteleintrags
            self.get_menge_id(),        # menge_id des Lebensmitteleintrags
            self.get_lebensmittel_id(), # lebensmittel_id des Lebensmitteleintrags
        )

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Lebensmitteleintrag-Objekt."""
        obj = Lebensmitteleintrag()                             # Erstellen einer neuen Instanz von Lebensmitteleintrag
        obj.set_id(dictionary["id"])                            # Setzen der ID aus dem Dictionary
        obj.set_zeitstempel(dictionary["zeitstempel"])          # Setzen des Zeitstempels aus dem Dictionary
        obj.set_aufbewahr_id(dictionary["aufbewahr_id"])        # Setzen der aufbewahr_id aus dem Dictionary
        obj.set_aufbewahr_ort(dictionary["aufbewahr_ort"])      # Setzen des aufbewahr_orts aus dem Dictionary
        obj.set_menge_id(dictionary["menge_id"])                # Setzen der menge_id aus dem Dictionary
        obj.set_lebensmittel_id(dictionary["lebensmittel_id"])  # Setzen der lebensmittel_id aus dem Dictionary
        return obj
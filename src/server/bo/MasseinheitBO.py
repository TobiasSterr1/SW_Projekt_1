# Importiere die Basisklasse BusinessObject aus dem Modul server.bo.BusinessObject
from server.bo.BusinessObject import BusinessObject

"""
Klasse, die eine Masseinheit repräsentiert. Diese Klasse erbt von BusinessObject
und enthält spezifische Attribute und Methoden, die eine Masseinheit beschreiben.
Eine Masseinheit hat eine Bezeichnung, einen Umrechnungs_wert und ein Attribut, das angibt,
ob es sich um ein Volumenmaß handelt.
"""

class Masseinheit(BusinessObject):
    """Klasse Masseinheit"""  

    def __init__(self):
        super().__init__()          # Ruft den Initialisierer der Basisklasse auf
        self._bezeichnung = ""      # Initialisiert die Bezeichnung der Masseinheit mit einem leeren String
        self._umrechnungs_wert = "" # Initialisiert den Umrechnungs_wert der Masseinheit mit einem leeren String
        self._ist_volumen = ""      # Initialisiert das Volumen-Flag der Masseinheit mit einem leeren String
        self._eigentuemer_id = 0      # Initialisiert das eigentuemer_id der Masseinheit mit einer 0. 

    def set_bezeichnung(self, bezeichnung):
        """Setzen der Bezeichnung des Masseinheit."""
        self._bezeichnung = bezeichnung

    def get_bezeichnung(self):
        """Auslesen der Bezeichnung des Masseinheit."""
        return self._bezeichnung

    def set_ist_volumen(self, ist_volumen):
        """Setzen der Ist_volumen des Masseinheit."""
        self._ist_volumen = ist_volumen

    def get_ist_volumen(self):
        """Auslesen der Ist_volumen des Masseinheit."""
        return self._ist_volumen

    def set_umrechnungs_wert(self, umrechnungs_wert):
        """Setzen der Umrechnungs_wert des Masseinheit."""
        self._umrechnungs_wert = umrechnungs_wert

    def get_umrechnungs_wert(self):
        """Auslesen der Umrechnungs_wert des Masseinheit."""
        return self._umrechnungs_wert

    def set_eigentuemer_id(self, eigentuemer_id):
        """Setzen der Eigentuemer_id des Masseinheit."""
        self._eigentuemer_id = eigentuemer_id

    def get_eigentuemer_id(self):
        """Auslesen der Eigentuemer_id des Masseinheit."""
        return self._eigentuemer_id

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Masseinheit: {}, {}, {}, {}, {}, {}".format(
            self.get_id(),                  # ID der Masseinheit
            self.get_zeitstempel(),         # Zeitstempel der Masseinheit
            self.get_bezeichnung(),         # Bezeichnung der Masseinheit
            self.get_ist_volumen(),         # Volumen-Flag der Masseinheit
            self.get_umrechnungs_wert(),    # Umrechnungs_wert der Masseinheit
            self.get_eigentuemer_id(),    # Eigentuemer_id der Masseinheit
        )

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Masseinheit-Objekt."""
        obj = Masseinheit()                                         # Erstellen einer neuen Instanz von Masseinheit
        obj.set_id(dictionary["id"])                                # Setzen der ID aus dem Dictionary
        obj.set_zeitstempel(dictionary["zeitstempel"])              # Setzen des Zeitstempels aus dem Dictionary
        obj.set_bezeichnung(dictionary["bezeichnung"])              # Setzen der Bezeichnung aus dem Dictionary
        obj.set_umrechnungs_wert(dictionary["umrechnungs_wert"])    # Setzen des Umrechnungs_werts aus dem Dictionary
        obj.set_ist_volumen(dictionary["ist_volumen"])              # Setzen des Volumen-Flags aus dem Dictionary
        obj.set_eigentuemer_id(dictionary["eigentuemer_id"])        # Setzen des eigentuemer_id aus dem Dictionary
        return obj                                                  # Rückgabe des erstellten Objekts
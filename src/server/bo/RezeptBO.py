from server.bo.BusinessObject import BusinessObject

"""
Klasse, die ein Rezept repräsentiert. Diese Klasse erbt von BusinessObject
und enthält spezifische Attribute und Methoden, die ein Rezept beschreiben. 
Ein Rezept hat Eigenschaften wie eigentuemer_id, anzahl_personen, zubereitung und name.
"""

class Rezept(BusinessObject):
    """Klasse Rezept"""  

    def __init__(self):
        super().__init__() #Konstruktor für ein Rezept-Objekt. Initialisiert ein neues Rezept-Objekt mit Standardwerten für die Attribute: _eigentuemer_id, _anzahl_personen, _zubereitung, _name.
        self._eigentuemer_id = 0    # Initialisierung der Eigentuemer_id mit 0
        self._haushalt_id = 0    # Initialisierung der Eigentuemer_id mit 0
        self._anzahl_personen = 0   # Initialisierung der Anzahl_personen mit 0
        self._zubereitung = ""      # Initialisierung der Zubereitung mit einem leeren String
        self._name = ""             # Initialisierung des Namens mit einem leeren String

    def set_eigentuemer_id(self, eigentuemer_id):
        """Setzen der Eigentuemer_id des Rezepts."""
        self._eigentuemer_id = eigentuemer_id

    def get_eigentuemer_id(self):
        """Auslesen der Eigentuemer_id des Rezepts."""
        return self._eigentuemer_id

    def set_haushalt_id(self, haushalt_id):
        """Setzen der Haushalt_id des Rezepts."""
        self._haushalt_id = haushalt_id

    def get_haushalt_id(self):
        """Auslesen der Haushalt_id des Rezepts."""
        return self._haushalt_id

    def set_anzahl_personen(self, anzahl_personen):
        """Setzen der Anzahl_personen des Rezepts."""
        self._anzahl_personen = anzahl_personen

    def get_anzahl_personen(self):
        """Auslesen der Anzahl_personen des Rezepts."""
        return self._anzahl_personen

    def set_zubereitung(self, zubereitung):
        """Setzen der Zubereitung des Rezepts."""
        self._zubereitung = zubereitung

    def get_zubereitung(self):
        """Auslesen der Zubereitung des Rezepts."""
        return self._zubereitung

    def set_name(self, name):
        """Setzen der Name des Rezepts."""
        self._name = name

    def get_name(self):
        """Auslesen der Name des Rezepts."""
        return self._name

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Rezept: {}, {}, {}, {}, {}, {}, {}".format(
            self.get_id(),                # ID des Rezepts
            self.get_zeitstempel(),       # Zeitstempel der letzten Änderung
            self.get_eigentuemer_id(),    # Eigentümer-ID des Rezepts
            self.get_anzahl_personen(),   # Anzahl der Personen für das Rezept
            self.get_zubereitung(),       # Zubereitungsanweisungen des Rezepts
            self.get_name(),              # Name des Rezepts
            self.get_haushalt_id(),              # Haushalt_id des Rezepts
        )

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Rezept-Objekt."""
        obj = Rezept()                                          # Neues Rezept-Objekt erstellen
        obj.set_id(dictionary["id"])                            # ID setzen
        obj.set_zeitstempel(dictionary["zeitstempel"])          # Zeitstempel setzen
        obj.set_eigentuemer_id(dictionary["eigentuemer_id"])    # Eigentümer-ID setzen
        obj.set_anzahl_personen(dictionary["anzahl_personen"])  # Anzahl Personen setzen
        obj.set_zubereitung(dictionary["zubereitung"])          # Zubereitung setzen
        obj.set_name(dictionary["name"])                        # Name setzen
        obj.set_haushalt_id(dictionary["haushalt_id"])                        # Name setzen
        return obj                                              # Fertiges Rezept-Objekt zurückgeben
        
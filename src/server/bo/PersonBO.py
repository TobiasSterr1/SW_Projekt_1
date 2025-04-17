# Importiere die Basisklasse BusinessObject aus dem Modul server.bo.BusinessObject
from server.bo.BusinessObject import BusinessObject

"""
Diese Klasse repräsentiert eine Person innerhalb eines Haushalts und 
erweitert die Funktionalitäten der BusinessObject-Basisklasse.
Sie enthält Attribute für die Identifikation des Haushalts, der Google User ID, 
der E-Mail und des Benutzernamens sowie Methoden zum Setzen und Auslesen dieser Attribute.
"""

class Person(BusinessObject):
    """Klasse Person"""  

    def __init__(self):
        super().__init__()          # Ruft den Initialisierer der Basisklasse BusinessObject auf
        self._haushalt_id = 0       # Ruft den Initialisierer der Basisklasse BusinessObject auf
        self._google_user_id = ""   # Initialisiert die Google User ID der Person als leeren String
        self._email = ""            # Initialisiert die E-Mail der Person als leeren String
        self._benutzername = ""     # Initialisiert den Benutzernamen der Person als leeren String
        self._firstname = ""
        self._lastname = ""
    def set_google_user_id(self, google_user_id):
        """Setzen des Google_user_id des Persons."""
        self._google_user_id = google_user_id

    def get_google_user_id(self):
        """Auslesen des Google_user_id des Persons."""
        return self._google_user_id

    def set_haushalt_id(self, haushalt_id):
        """Setzen des Haushalt_id des Persons."""
        self._haushalt_id = haushalt_id

    def get_haushalt_id(self):
        """Auslesen des Haushalt_id des Persons."""
        return self._haushalt_id

    def set_email(self, email):
        """Setzen der Email von der Person."""
        self._email = email

    def get_email(self):
        """Auslesen der Email von der Person."""
        return self._email

    def set_benutzername(self, benutzername):
        """Setzen des Benutzernamens der Persons."""
        self._benutzername = benutzername

    def get_benutzername(self):
        """Auslesen des Benutzernamens der Person"""
        return self._benutzername

    def set_firstname(self, firstname):
        """Setzen des Vornamens der Persons."""
        self._firstname = firstname

    def get_firstname(self):
        """Auslesen des Vornamens der Person"""
        return self._firstname

    def set_lastname(self, lastname):
        """Setzen des Nachnamens der Persons."""
        self._lastname = lastname

    def get_lastname(self):
        """Auslesen des Nachnamens der Person"""
        return self._lastname

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Person: {}, {}, {}, {}, {}, {}, {}, {}".format(
            self.get_id(),
            self.get_zeitstempel(),
            self.get_haushalt_id(),
            self.get_google_user_id(),
            self.get_email(),
            self.get_benutzername(),
            self.get_firstname(),
            self.get_lastname(),
        )

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Person-Objekt."""
        obj = Person()
        obj.set_id(dictionary["id"])
        obj.set_zeitstempel(dictionary["zeitstempel"])
        obj.set_haushalt_id(dictionary["haushalt_id"])
        obj.set_google_user_id(dictionary["google_user_id"])
        obj.set_email(dictionary["email"])
        obj.set_benutzername(dictionary["benutzername"])
        obj.set_firstname(dictionary["firstname"])
        obj.set_lastname(dictionary["lastname"])
        return obj
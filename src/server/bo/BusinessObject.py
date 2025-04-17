# Importiert die ABC-Klasse und abstractmethod-Funktion aus dem abc-Modul
from abc import ABC, abstractmethod

# Importiert die datetime-Klasse aus dem datetime-Modul
from datetime import datetime

"""
Die Klasse BusinessObject dient als abstrakte Basisklasse für Geschäftsobjekte.
Sie enthält grundlegende Attribute wie ID und Zeitstempel und definiert deren Getter und Setter.
Zudem kann sie durch abstrakte Methoden erweitert werden, die von Unterklassen implementiert werden müssen.
"""

# Definiert eine abstrakte Basisklasse für Business-Objekte
class BusinessObject(ABC):
    def __init__(self):
        # Initialisiert die ID des Objekts auf 0
        self._id = 0         

        # Setze den Zeitstempel auf die aktuelle Zeit
        self._zeitstempel = datetime.now()   
        
    def get_id(self):
    # Gibt die ID des Objekts zurück
        return self._id

    def set_id(self,value):
    # Setzt die ID des Objekts auf den angegebenen Wert
        self._id = value

    def get_zeitstempel(self):
    # Gibt den Zeitstempel des Objekts zurück
        return self._zeitstempel

    def set_zeitstempel(self,value):
    # Setzt den Zeitstempel des Objekts auf den angegebenen Wert   
        self._zeitstempel = value

    '''
    @abstractmethod
    def do_something(self):
        pass
    '''
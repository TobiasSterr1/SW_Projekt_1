# Importiert die Einkaufsliste Business Object Klasse
from server.bo.EinkaufslisteBO import Einkaufsliste
# Importiert die Mapper Basisklasse
from server.db.Mapper import Mapper
# Importiert den spezifischen Mapper für Einkaufsliste
from server.db.EinkaufslisteMapper import EinkaufslisteMapper

class EinkaufslisteAdministration(Mapper):
    def __init__(self):
        # Initialisiert die Basisklasse Mapper
        super().__init__()

    """
    Einkaufsliste-spezifische Methoden
    """

    def create_einkaufsliste(self, haushalt_id):
        """Erstellt eine neue Einkaufsliste für einen Haushalt."""
        einkaufsliste = Einkaufsliste()  # Erstellt eine neue Instanz von Einkaufsliste
        einkaufsliste.set_haushalt_id(haushalt_id)  # Setzt die Haushalt-ID
        with EinkaufslisteMapper() as mapper:
            # Fügt die neue Einkaufsliste in die Datenbank ein und gibt das Ergebnis zurück
            return mapper.insert(einkaufsliste)

    def get_einkaufsliste_by_haushalt_id(self, haushalt_id):
        """Holt eine Einkaufsliste anhand der ID."""
        with EinkaufslisteMapper() as mapper:
            # Sucht und gibt die Einkaufsliste anhand der Haushalt-ID zurück
            return mapper.find_by_haushalt_id(haushalt_id)

    def update_einkaufsliste(self, einkaufsliste):
        """Aktualisiert eine vorhandene Einkaufsliste."""
        with EinkaufslisteMapper() as mapper:
            # Aktualisiert die Einkaufsliste in der Datenbank
            mapper.update(einkaufsliste)

    def delete_einkaufsliste(self, einkaufsliste):
        """Löscht eine Einkaufsliste aus der Datenbank."""
        with EinkaufslisteMapper() as mapper:
            # Löscht die Einkaufsliste aus der Datenbank
            mapper.delete(einkaufsliste)

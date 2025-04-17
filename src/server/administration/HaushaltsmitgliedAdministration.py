# Importiert die Haushaltsmitglied Business Object Klasse
from server.bo.HaushaltsmitgliedBO import Haushaltsmitglied
# Importiert die Mapper Basisklasse
from server.db.Mapper import Mapper
# Importiert den spezifischen Mapper für Haushaltsmitglied
from server.db.HaushaltsmitgliedMapper import HaushaltsmitgliedMapper
from server.administration.RezeptAdministration import RezeptAdministration
from server.administration.MasseinheitAdministration import MasseinheitAdministration
from server.administration.LebensmittelAdministration import LebensmittelAdministration
class HaushaltsmitgliedAdministration(Mapper):
    def __init__(self):
        # Initialisiert die Basisklasse Mapper
        super().__init__()

    """
    Haushaltsmitglied-spezifische Methoden
    """
    
    def create_haushaltsmitglied(self, person_id, haushalt_id):
        """Erstellt ein neues Haushaltsmitglied."""
        haushaltsmitglied = Haushaltsmitglied()  # Erstellt eine neue Instanz von Haushaltsmitglied
        haushaltsmitglied.set_person_id(person_id)  # Setzt die Personen-ID
        haushaltsmitglied.set_haushalt_id(haushalt_id)  # Setzt die Haushalt-ID

        with HaushaltsmitgliedMapper() as mapper:
            # Fügt das neue Haushaltsmitglied in die Datenbank ein und gibt das Ergebnis zurück
            return mapper.insert(haushaltsmitglied)
        
    def get_haushaltsmitglied_by_id(self, id):
        """Holt ein Haushaltsmitglied anhand der ID."""
        with HaushaltsmitgliedMapper() as mapper:
            # Sucht und gibt das Haushaltsmitglied anhand der ID zurück
            return mapper.find_by_id(id)

    def update_haushaltsmitglied(self, haushaltsmitglied):
        """Aktualisiert ein vorhandenes Haushaltsmitglied."""
        with HaushaltsmitgliedMapper() as mapper:
            # Aktualisiert das Haushaltsmitglied in der Datenbank
            mapper.update(haushaltsmitglied)
            

    def delete_haushaltsmitglied(self, haushaltsmitglied):
        from server.administration.HaushaltAdministration import HaushaltAdministration
        haushalt_adm = HaushaltAdministration()
        self.delete_single_haushaltsmitglied(haushaltsmitglied)
        haushaltsmitglied_list = self.get_haushaltsmitglied_by_haushalt_id(haushaltsmitglied.get_haushalt_id())
        haushalt = haushalt_adm.get_haushalt_by_id(haushaltsmitglied.get_haushalt_id())
        if(len(haushaltsmitglied_list) == 0):
            return haushalt_adm.delete_haushalt(haushalt)
        if haushaltsmitglied.get_person_id() == haushalt.get_owner_id():
            haushalt.set_owner_id(haushaltsmitglied_list[0].get_person_id())
            haushalt_adm.update_haushalt(haushalt)

    def delete_single_haushaltsmitglied(self, haushaltsmitglied):
        """Löscht ein einzelnes Haushaltsmitglied aus der Datenbank."""
        rezept_adm = RezeptAdministration()
        rezept_list = rezept_adm.get_rezept_by_eigentuemer_id(haushaltsmitglied.get_person_id())
        for r in rezept_list:
            rezept_adm.delete_rezept(r)
        massienheit_adm = MasseinheitAdministration()
        massienheit_list = massienheit_adm.get_masseinheit_by_eigentuemer_id(haushaltsmitglied.get_person_id())
        for m in massienheit_list:
            massienheit_adm.delete_masseinheit(m)
        lebensmittel_adm = LebensmittelAdministration()
        lebensmittel_list = lebensmittel_adm.get_lebensmittel_by_eigentuemer_id(haushaltsmitglied.get_person_id())
        for l in lebensmittel_list:
            lebensmittel_adm.delete_lebensmittel(l)
        with HaushaltsmitgliedMapper() as mapper:
            # Löscht das Haushaltsmitglied in der Datenbank
            mapper.delete(haushaltsmitglied)

    def get_haushaltsmitglied_by_person_id(self, person_id):
        """Holt ein Haushaltsmitglied anhand der Personen-ID."""
        with HaushaltsmitgliedMapper() as mapper:
            # Sucht und gibt das Haushaltsmitglied anhand der Personen-ID zurück
            return mapper.find_by_person_id(person_id)
    
    def get_haushaltsmitglied_by_haushalt_id(self, haushalt_id):
        """Holt alle Haushaltsmitglieder eines Haushalts anhand der Haushalts-ID."""
        with HaushaltsmitgliedMapper() as mapper:
            # Sucht und gibt alle Haushaltsmitglieder eines Haushalts anhand der Haushalts-ID zurück
            return mapper.find_by_haushalt_id(haushalt_id)

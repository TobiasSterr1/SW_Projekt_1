from server.bo.PersonBO import Person
from server.db.Mapper import Mapper
from server.db.PersonMapper import PersonMapper
from server.administration.HaushaltsmitgliedAdministration import HaushaltsmitgliedAdministration
from server.administration.HaushaltAdministration import HaushaltAdministration

class PersonAdministration (Mapper):

    def __init__(self):
        super().__init__()

    """
    Person-spezifische Methoden
    """
    def create_person(self, benutzername, email, google_user_id, haushalt_id, firstname, lastname):
        """Erstellt eine neue Person."""
        person = Person()
        person.set_benutzername(benutzername)
        person.set_email(email)
        person.set_google_user_id(google_user_id)
        person.set_haushalt_id(haushalt_id)
        person.set_firstname(firstname)
        person.set_lastname(lastname)

        with PersonMapper() as mapper:
            return mapper.insert(person)
        
    def get_person_by_guid(self, guid):
        """Sucht eine Person anhand der Google User ID (GUID)."""
        with PersonMapper() as mapper:
            return mapper.find_by_guid(guid)
        
        
    def get_all_person(self, haushalt_id):
        """Holt alle Personen eines bestimmten Haushalts."""
        with PersonMapper() as mapper:
            return mapper.find_all(haushalt_id)
        
    def get_person_by_id(self, id):
        """Sucht eine Person anhand der ID."""
        with PersonMapper() as mapper:
            return mapper.find_by_id(id)

    def update_person(self, person):
        """Aktualisiert eine vorhandene Person."""
        with PersonMapper() as mapper:
            mapper.update(person)

    def delete_person(self, person):
        """Löscht eine Person aus der Datenbank."""
        haushaltmitglied_adm = HaushaltsmitgliedAdministration()
        haushaltsmitglied_list = haushaltmitglied_adm.get_haushaltsmitglied_by_person_id(person.get_id())
        if(len(haushaltsmitglied_list) == 0):
            with PersonMapper() as mapper:
                return mapper.delete(person)
        for h in haushaltsmitglied_list:
            haushaltmitglied_adm.delete_haushaltsmitglied(h)

        with PersonMapper() as mapper:
            return mapper.delete(person)
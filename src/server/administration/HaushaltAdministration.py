from server.bo.HaushaltBO import Haushalt
from server.db.Mapper import Mapper
from server.db.HaushaltMapper import HaushaltMapper
from server.administration.HaushaltsmitgliedAdministration import HaushaltsmitgliedAdministration
from server.administration.KuehlschrankAdministration import KuehlschrankAdministration
from server.administration.EinkaufslisteAdministration import EinkaufslisteAdministration
from server.administration.LebensmitteleintragAdministration import LebensmitteleintragAdministration

class HaushaltAdministration(Mapper):

    def __init__(self):
        super().__init__()

    """
    Haushalt-spezifische Methoden
    """

    def create_haushalt(self, haushalt):
        """Einen Haushalt anlegen."""
        with HaushaltMapper() as mapper:
            return mapper.insert(haushalt)

    def create_haushalt_with_pantry(self, name, owner_id):
        """Einen Haushalt anlegen und einen Kühlschrank hinzufügen."""
        h = Haushalt()
        h.set_name(name)
        h.set_owner_id(owner_id)
        haushalt = self.create_haushalt(h)
        KuehlschrankAdministration().create_kuehlschrank(haushalt.get_id())
        EinkaufslisteAdministration().create_einkaufsliste(haushalt.get_id())
        return haushalt

    def get_haushalt_by_id(self, id):
        """Den Haushalt mit der gegebenen ID auslesen."""
        with HaushaltMapper() as mapper:
            return mapper.find_by_id(id)

    def get_alle_haushalt(self, person_id):
        """Alle Haushalte einer Person auslesen."""
        with HaushaltMapper() as mapper:
            return mapper.find_all(person_id)

    def update_haushalt(self, haushalt):
        """Den gegebenen Haushalt speichern."""
        with HaushaltMapper() as mapper:
            mapper.update(haushalt)

    def delete_haushalt(self, haushalt):
        """Den gegebenen Haushalt aus unserem System löschen."""
        # Lösche den Haushalt selbst aus der Datenbank
        kuehlschrank_adm = KuehlschrankAdministration()
        einkaufsliste_adm = EinkaufslisteAdministration()
        lebensmittel_eintrag_adm = LebensmitteleintragAdministration()
        kuehlschrank = kuehlschrank_adm.get_kuehlschrank_by_haushalt_id(haushalt.get_id())
        einkaufsliste = einkaufsliste_adm.get_einkaufsliste_by_haushalt_id(haushalt.get_id())
        einkaufsliste_list = lebensmittel_eintrag_adm.get_lebensmittel_eingtrag_by_aufbewahr_ort(einkaufsliste.get_id(), "Einkaufsliste")
        kuehlschrank_list = lebensmittel_eintrag_adm.get_lebensmittel_eingtrag_by_aufbewahr_ort( kuehlschrank.get_id(),"Kuehlschrank")
        for k in kuehlschrank_list:
            lebensmittel_eintrag_adm.delete_lebensmitteleintrag(k, False)
        for e in einkaufsliste_list:
            lebensmittel_eintrag_adm.delete_lebensmitteleintrag(e, False)
        einkaufsliste_adm.delete_einkaufsliste(einkaufsliste)
        kuehlschrank_adm.delete_kuehlschrank(kuehlschrank)
        with HaushaltMapper() as mapper:
            mapper.delete(haushalt)
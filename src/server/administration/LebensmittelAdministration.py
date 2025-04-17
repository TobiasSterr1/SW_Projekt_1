from server.bo.LebensmittelBO import Lebensmittel
from server.db.Mapper import Mapper
from server.db.LebensmittelMapper import LebensmittelMapper
from server.administration.LebensmitteleintragAdministration import LebensmitteleintragAdministration
from server.administration.MengeAdministration import MengeAdministration

class LebensmittelAdministration(Mapper):

    def __init__(self):
        super().__init__()

    """
    Lebensmittel-spezifische Methoden
    """

    def create_lebensmittel(self, bezeichnung, ersteller_id):
        """Ein Lebensmittel anlegen."""
        lebensmittel = Lebensmittel()
        lebensmittel.set_bezeichnung(bezeichnung)
        lebensmittel.set_ersteller_id(ersteller_id)
        with LebensmittelMapper() as mapper:
            return mapper.insert(lebensmittel)

    def get_lebensmittel_by_id(self, id):
        """Das Lebensmittel mit der gegebenen ID auslesen."""
        with LebensmittelMapper() as mapper:
            return mapper.find_by_id(id)

    def get_all_lebensmittel(self):
        """Alle Lebensmittel auslesen."""
        with LebensmittelMapper() as mapper:
            return mapper.find_all()

    def get_lebensmittel_by_eigentuemer_id(self, eigentuemer_id):
        """Sucht alle Lebensmittel anhand der ID."""
        with LebensmittelMapper() as mapper:
            return mapper.find_by_eigentuemer_id(eigentuemer_id)

    def update_lebensmittel(self, lebensmittel):
        """Das gegebene Lebensmittel aktualisieren."""
        with LebensmittelMapper() as mapper:
            mapper.update(lebensmittel)

    def delete_lebensmittel(self, lebensmittel):
        """Das gegebene Lebensmittel aus der Datenbank löschen."""
        lebensmitteleintrag_adm = LebensmitteleintragAdministration()
        lebensmitteleintrag_list = lebensmitteleintrag_adm.get_lebensmittel_eingtrag_by_lebensmittel_id(lebensmittel.get_id())
        for l in lebensmitteleintrag_list:
            lebensmitteleintrag_adm.delete_lebensmitteleintrag(l, False)
        with LebensmittelMapper() as mapper:
            mapper.delete(lebensmittel)
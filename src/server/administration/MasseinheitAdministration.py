from server.bo.MasseinheitBO import Masseinheit
from server.db.Mapper import Mapper
from server.db.MasseinheitMapper import MasseinheitMapper
from server.administration.LebensmitteleintragAdministration import LebensmitteleintragAdministration
from server.administration.MengeAdministration import MengeAdministration

class MasseinheitAdministration(Mapper):

    def __init__(self):
        super().__init__()

    """
    Masseinheit-spezifische Methoden
    """

    def create_masseinheit(self, bezeichnung, umrechnungs_wert, ist_volumen, eigentuemer_id):
        """Erstellt eine neue Maßeinheit."""
        masseinheit = Masseinheit()
        masseinheit.set_bezeichnung(bezeichnung)
        masseinheit.set_umrechnungs_wert(umrechnungs_wert)
        masseinheit.set_ist_volumen(ist_volumen)
        masseinheit.set_eigentuemer_id(eigentuemer_id)
        with MasseinheitMapper() as mapper:
            return mapper.insert(masseinheit)

    def get_masseinheit_by_id(self, id):
        """Sucht eine Maßeinheit anhand der ID."""
        with MasseinheitMapper() as mapper:
            return mapper.find_by_id(id)

    def get_all_masseinheit(self):
        """Holt alle Maßeinheiten."""
        with MasseinheitMapper() as mapper:
            return mapper.find_all()

    def get_masseinheit_by_eigentuemer_id(self, eigentuemer_id):
        """Holt alle Maßeinheiten."""
        with MasseinheitMapper() as mapper:
            return mapper.find_by_eigentuemer_id(eigentuemer_id)

    def update_masseinheit(self, masseinheit):
        """Aktualisiert eine vorhandene Maßeinheit."""
        with MasseinheitMapper() as mapper:
            mapper.update(masseinheit)

    def delete_masseinheit(self, masseinheit):
        """Löscht eine Maßeinheit aus der Datenbank."""
        lebensmittel_eintrag_adm = LebensmitteleintragAdministration()
        menge_adm = MengeAdministration()
        menge_list = menge_adm.get_menge_by_masseinheit_id(masseinheit.get_id())
        for m in menge_list:
            lebensmittel_eintrag_list = lebensmittel_eintrag_adm.get_lebensmittel_eingtrag_by_menge_id(m.get_id())
            for l in lebensmittel_eintrag_list:
                lebensmittel_eintrag_adm.delete_lebensmitteleintrag(l, False)
        with MasseinheitMapper() as mapper:
            mapper.delete(masseinheit)
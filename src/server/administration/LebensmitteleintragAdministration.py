from server.bo.LebensmitteleintragBO import Lebensmitteleintrag
from server.db.Mapper import Mapper
from server.db.LebensmitteleintragMapper import LebensmitteleintragMapper
from server.administration.MengeAdministration import MengeAdministration

class LebensmitteleintragAdministration(Mapper):

    def __init__(self):
        super().__init__()

    """
    Lebensmitteleintrag-spezifische Methoden
    """

    def create_lebensmitteleintrag(self, aufbewahr_id, aufbewahr_ort, lebensmittel_id, menge_id):
        """
        Erstellt einen neuen Lebensmitteleintrag.

        - Überprüft, ob ein ähnlicher Eintrag bereits existiert.
        - Wenn ja, wird die Menge des vorhandenen Eintrags aktualisiert.
        - Wenn nein, wird ein neuer Eintrag in die Datenbank eingefügt.
        """
        # Initialisiere die Administration für Mengen
        menge_adm = MengeAdministration()

        # Erstelle eine neue Instanz von Lebensmitteleintrag und setze die Attribute
        l_eintrag = Lebensmitteleintrag()
        l_eintrag.set_aufbewahr_id(aufbewahr_id)
        l_eintrag.set_aufbewahr_ort(aufbewahr_ort)
        l_eintrag.set_lebensmittel_id(lebensmittel_id)
        l_eintrag.set_menge_id(menge_id)

        # Hole alle Lebensmitteleinträge für den gegebenen Aufbewahrungsort
        lebensmitteleintrag_list = self.get_lebensmittel_eingtrag_by_aufbewahr_ort(aufbewahr_id, aufbewahr_ort)

        # Suche nach einem existierenden Lebensmitteleintrag mit der gleichen Lebensmittel-ID
        matching_lebensmitteleintrag = next((lebensmitteleintrag for lebensmitteleintrag in lebensmitteleintrag_list if lebensmitteleintrag.get_lebensmittel_id() == l_eintrag.get_lebensmittel_id()), None)

        # Wenn ein passender Eintrag gefunden wird
        if matching_lebensmitteleintrag is not None:
            # Hole die Mengeninformationen für den neuen und den vorhandenen Eintrag
            lebensmitteleintrag_menge = menge_adm.get_menge_by_id(l_eintrag.get_menge_id())
            matching_lebensmitteleintrag_menge = menge_adm.get_menge_by_id(matching_lebensmitteleintrag.get_menge_id())

            # Addiere die Menge des neuen Eintrags zur Menge des vorhandenen Eintrags
            matching_lebensmitteleintrag_menge.set_mengenanzahl(float(matching_lebensmitteleintrag_menge.get_mengenanzahl()) + float(lebensmitteleintrag_menge.get_mengenanzahl()))

            # Aktualisiere die Menge in der Datenbank
            menge_adm.update_menge(matching_lebensmitteleintrag_menge)

            # Gib den vorhandenen Eintrag zurück
            return matching_lebensmitteleintrag

        # Wenn kein passender Eintrag gefunden wird, füge den neuen Eintrag in die Datenbank ein
        with LebensmitteleintragMapper() as mapper:
            return mapper.insert(l_eintrag)

    def get_lebensmitteleintrag_by_id(self, id):
        """Sucht einen Lebensmitteleintrag anhand der ID."""
        with LebensmitteleintragMapper() as mapper:
            return mapper.find_by_id(id)

    def get_lebensmittel_eingtrag_by_aufbewahr_ort(self, aufbewahr_id, aufbewahr_ort):
        """Sucht Lebensmitteleinträge anhand von Aufbewahrungs-ID und -Ort."""
        with LebensmitteleintragMapper() as mapper:
            return mapper.find_by_aufbewahr_ort(aufbewahr_id, aufbewahr_ort)

    def get_lebensmittel_eingtrag_by_lebensmittel_id(self, lebensmittel_id):
        """Sucht Lebensmitteleinträge anhand von Aufbewahrungs-ID und -Ort."""
        with LebensmitteleintragMapper() as mapper:
            return mapper.find_by_lebensmittel_id(lebensmittel_id)

    def get_lebensmittel_eingtrag_by_menge_id(self, menge_id):
        """Sucht Lebensmitteleinträge anhand von Aufbewahrungs-ID und -Ort."""
        with LebensmitteleintragMapper() as mapper:
            return mapper.find_by_menge_id(menge_id)

    def update_lebensmitteleintrag(self, lebensmitteleintrag):
        """Aktualisiert einen Lebensmitteleintrag."""
        with LebensmitteleintragMapper() as mapper:
            return mapper.update(lebensmitteleintrag)

    def delete_lebensmitteleintrag(self, lebensmitteleintrag, is_einkaufsliste):
        """Löscht einen Lebensmitteleintrag aus der Datenbank."""
        if not (is_einkaufsliste):
            menge_adm = MengeAdministration()
            menge = menge_adm.get_menge_by_id(lebensmitteleintrag.get_menge_id())
            menge_adm.delete_menge(menge)
        with LebensmitteleintragMapper() as mapper:
            mapper.delete(lebensmitteleintrag)
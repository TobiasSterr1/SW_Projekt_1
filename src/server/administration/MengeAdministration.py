from server.bo.MengeBO import Menge
from server.db.Mapper import Mapper
from server.db.MengeMapper import MengeMapper


class MengeAdministration(Mapper):

    def __init__(self):
        super().__init__()

    """
    Menge-spezifische Methoden
    """

    def create_menge(self, mengenanzahl, masseinheit_id):
        """Erstellt eine neue Menge."""
        menge = Menge()
        menge.set_mengenanzahl(mengenanzahl)
        menge.set_masseinheit_id(masseinheit_id)
        with MengeMapper() as mapper:
            return mapper.insert(menge)

    def get_menge_by_id(self, id):
        """Sucht eine Menge anhand der ID."""
        with MengeMapper() as mapper:
            return mapper.find_by_id(id)

    def get_menge_by_masseinheit_id(self, masseinheit_id):
        """Sucht eine Menge anhand der MASSEINHEIT_ID."""
        with MengeMapper() as mapper:
            return mapper.find_by_masseinheit_id(masseinheit_id)

    def update_menge(self, menge):
        """Aktualisiert eine vorhandene Menge."""
        with MengeMapper() as mapper:
            return mapper.update(menge)

    def delete_menge(self, menge):
        """Löscht eine Menge aus der Datenbank."""
        with MengeMapper() as mapper:
            mapper.delete(menge)
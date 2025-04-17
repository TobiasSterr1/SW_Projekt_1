from server.bo.KuehlschrankBO import Kuehlschrank
from server.db.Mapper import Mapper
from server.db.KuehlschrankMapper import KuehlschrankMapper


class KuehlschrankAdministration(Mapper):

    def __init__(self):
        super().__init__()

    """
    Kuehlschrank-spezifische Methoden
    """

    def create_kuehlschrank(self, haushalt_id):
        """Erstellt einen neuen Kühlschrank für einen Haushalt."""
        kuehlschrank = Kuehlschrank()
        kuehlschrank.set_haushalt_id(haushalt_id)
        with KuehlschrankMapper() as mapper:
            return mapper.insert(kuehlschrank)

    def get_kuehlschrank_by_haushalt_id(self, haushalt_id):
        """Sucht einen Kühlschrank anhand der Haushalt-ID."""
        with KuehlschrankMapper() as mapper:
            return mapper.find_by_haushalt_id(haushalt_id)

    def update_kuehlschrank(self, kuehlschrank):
        """Aktualisiert einen bestehenden Kühlschrank."""
        with KuehlschrankMapper() as mapper:
            mapper.update(kuehlschrank)

    def delete_kuehlschrank(self, kuehlschrank):
        """Löscht einen bestehenden Kühlschrank."""
        with KuehlschrankMapper() as mapper:
            mapper.delete(kuehlschrank)
from server.bo.EinkaufslisteBO import Einkaufsliste
from server.db.Mapper import Mapper


class EinkaufslisteMapper(Mapper):

    def __init__(self):
        super().__init__()
        """
        Fügt eine neue Einkaufsliste in die Datenbank ein.

        :param einkaufsliste: Das zu speichernde Einkaufsliste-Objekt
        :return: Das eingefügte Einkaufsliste-Objekt mit aktualisierter ID
        """

    def insert(self, einkaufsliste):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM einkaufsliste ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Einkaufsliste-Objekt zu."""
                einkaufsliste.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                einkaufsliste.set_id(1)

        command = "INSERT INTO einkaufsliste (id, zeitstempel, haushalt_id) VALUES (%s,%s,%s)"
        data = (einkaufsliste.get_id(), einkaufsliste.get_zeitstempel(), einkaufsliste.get_haushalt_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return einkaufsliste

    def find_by_haushalt_id(self, haushalt_id):
        """
        Sucht eine Einkaufsliste anhand der ID.

        :param id: Die ID der Einkaufsliste
        :return: Das gefundene Einkaufsliste-Objekt oder None, falls nicht gefunden
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, haushalt_id FROM einkaufsliste WHERE haushalt_id='{}'".format(haushalt_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, zeitstempel, haushalt_id) = tuples[0]
            e = Einkaufsliste()
            e.set_id(id)
            e.set_zeitstempel(zeitstempel)
            e.set_haushalt_id(haushalt_id)
            result = e
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def delete(self, einkaufsliste):
        """
        Löscht eine Einkaufsliste aus der Datenbank.

        :param einkaufsliste: Das zu löschende Einkaufsliste-Objekt
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM einkaufsliste WHERE id={}".format(einkaufsliste.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def update(self, einkaufsliste):
        """
        Aktualisiert die Daten einer bestehenden Einkaufsliste in der Datenbank.

        :param einkaufsliste: Das zu aktualisierende Einkaufsliste-Objekt
        """
        cursor = self._cnx.cursor()

        command = "UPDATE einkaufsliste " + "haushalt_id=%s WHERE id=%s"
        data = (einkaufsliste.get_haushalt_id(), einkaufsliste.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
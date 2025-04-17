from server.bo.KuehlschrankBO import Kuehlschrank
from server.db.Mapper import Mapper


class KuehlschrankMapper (Mapper):

    def __init__(self):
        super().__init__()

    def insert(self, kuehlschrank):
        """
        Fügt einen neuen Kühlschrank in die Datenbank ein.

        :param kuehlschrank: Das zu speichernde Kuehlschrank-Objekt
        :return: Das eingefügte Kuehlschrank-Objekt mit aktualisierter ID
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM kuehlschrank ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Kuehlschrank-Objekt zu."""
                kuehlschrank.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                kuehlschrank.set_id(1)

        command = "INSERT INTO kuehlschrank (id, zeitstempel, haushalt_id) VALUES (%s,%s,%s)"
        data = (kuehlschrank.get_id(), kuehlschrank.get_zeitstempel(), kuehlschrank.get_haushalt_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return kuehlschrank

    def find_by_haushalt_id(self, haushalt_id):
        """
        Sucht einen Kühlschrank anhand der Haushalt-ID.

        :param haushalt_id: Die ID des Haushalts
        :return: Das gefundene Kuehlschrank-Objekt oder None, falls nicht gefunden
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, haushalt_id FROM kuehlschrank WHERE haushalt_id={}".format(haushalt_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, zeitstempel, haushalt_id) = tuples[0]
            k = Kuehlschrank()
            k.set_id(id)
            k.set_zeitstempel(zeitstempel)
            k.set_haushalt_id(haushalt_id)
            result = k
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def update(self, kuehlschrank):
        """
        Aktualisiert die Daten eines bestehenden Kühlschranks in der Datenbank.

        :param kuehlschrank: Das zu aktualisierende Kuehlschrank-Objekt
        """
        cursor = self._cnx.cursor()

        command = "UPDATE kuehlschrank " + "haushalt_id=%s WHERE id=%s"
        data = ( kuehlschrank.get_haushalt_id(), kuehlschrank.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, kuehlschrank):
        """
        Löscht einen Kühlschrank aus der Datenbank.

        :param kuehlschrank: Das zu löschende Kuehlschrank-Objekt
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM kuehlschrank WHERE id={}".format(kuehlschrank.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
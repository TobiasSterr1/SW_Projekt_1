from server.bo.MengeBO import Menge
from server.db.Mapper import Mapper


class MengeMapper(Mapper):
    """
    Mapper-Klasse für das Mapping von Menge-Objekten auf eine relationale Datenbank.
    Diese Klasse bietet Methoden zum Einfügen, Finden, Aktualisieren und Löschen von Menge-Datensätzen.
    """
    def __init__(self):
        super().__init__()

    def insert(self, menge):
        """
        Fügt eine neue Menge in die Datenbank ein.

        :param menge: Das zu speichernde Menge-Objekt
        :return: Das eingefügte Menge-Objekt mit aktualisierter ID
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM menge ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Menge-Objekt zu."""
                menge.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                menge.set_id(1)

        command = "INSERT INTO menge (id, zeitstempel, mengenanzahl, masseinheit_id) VALUES (%s,%s,%s,%s)"
        data = (menge.get_id(), menge.get_zeitstempel(), menge.get_mengenanzahl(), menge.get_masseinheit_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return menge

    def find_by_id(self, id):
        """
        Sucht eine Menge anhand ihrer ID.

        :param id: Die ID der gesuchten Menge
        :return: Das gefundene Menge-Objekt oder None, falls nicht gefunden
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, mengenanzahl, masseinheit_id FROM menge WHERE id='{}'".format(id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, zeitstempel, mengenanzahl, masseinheit_id) = tuples[0]
            h = Menge()
            h.set_id(id)
            h.set_zeitstempel(zeitstempel)
            h.set_mengenanzahl(mengenanzahl)
            h.set_masseinheit_id(masseinheit_id)
            result = h
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_masseinheit_id(self, masseinheit_id):
        """
        Sucht eine Menge anhand ihrer ID.

        :param id: Die ID der gesuchten Menge
        :return: Das gefundene Menge-Objekt oder None, falls nicht gefunden
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, mengenanzahl, masseinheit_id FROM menge WHERE masseinheit_id='{}'".format(masseinheit_id)
        cursor.execute(command)
        tuples = cursor.fetchall()
        
        for (id, zeitstempel, mengenanzahl, masseinheit_id) in tuples:
            h = Menge()
            h.set_id(id)
            h.set_zeitstempel(zeitstempel)
            h.set_mengenanzahl(mengenanzahl)
            h.set_masseinheit_id(masseinheit_id)
            result.append(h)

        self._cnx.commit()
        cursor.close()

        return result

    def update(self, menge):
        """
        Aktualisiert die Daten einer bestehenden Menge in der Datenbank.

        :param menge: Das zu aktualisierende Menge-Objekt
        :return: Das aktualisierte Menge-Objekt
        """
        cursor = self._cnx.cursor()

        command = "UPDATE menge " + "SET mengenanzahl=%s, masseinheit_id=%s WHERE id=%s"
        data = (menge.get_mengenanzahl(), menge.get_masseinheit_id(), menge.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return menge

    def delete(self, menge):
        """
        Löscht eine Menge aus der Datenbank.

        :param menge: Das zu löschende Menge-Objekt
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM menge WHERE id={}".format(menge.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
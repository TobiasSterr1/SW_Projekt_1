from server.bo.LebensmitteleintragBO import Lebensmitteleintrag
from server.db.Mapper import Mapper


class LebensmitteleintragMapper (Mapper):
    """
    Mapper-Klasse für das Mapping von Lebensmitteleintrag-Objekten auf eine relationale Datenbank.
    Diese Klasse bietet Methoden zum Einfügen, Finden, Aktualisieren und Löschen von Lebensmitteleintrag-Datensätzen.
    """
    def __init__(self):
        super().__init__()

    def insert(self, lebensmitteleintrag):
        """
        Fügt einen neuen Lebensmitteleintrag in die Datenbank ein.

        :param lebensmitteleintrag: Das zu speichernde Lebensmitteleintrag-Objekt
        :return: Das eingefügte Lebensmitteleintrag-Objekt mit aktualisierter ID
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM lebensmittel_eintrag ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Lebensmitteleintrag-Objekt zu."""
                lebensmitteleintrag.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                lebensmitteleintrag.set_id(1)

        command = "INSERT INTO lebensmittel_eintrag (id, zeitstempel, aufbewahr_id, aufbewahr_ort, lebensmittel_id, menge_id) VALUES (%s,%s,%s,%s,%s,%s)"
        data = (lebensmitteleintrag.get_id(), lebensmitteleintrag.get_zeitstempel(), lebensmitteleintrag.get_aufbewahr_id(), lebensmitteleintrag.get_aufbewahr_ort(), lebensmitteleintrag.get_lebensmittel_id(), lebensmitteleintrag.get_menge_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return lebensmitteleintrag

    def find_by_id(self, id):
        """
        Sucht einen Lebensmitteleintrag anhand seiner ID.

        :param id: Die ID des gesuchten Lebensmitteleintrags
        :return: Das gefundene Lebensmitteleintrag-Objekt oder None, falls nicht gefunden
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, aufbewahr_id, aufbewahr_ort, lebensmittel_id, menge_id FROM lebensmittel_eintrag WHERE id='{}'".format(id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, zeitstempel, aufbewahr_id, aufbewahr_ort, lebensmittel_id, menge_id) = tuples[0]
            l = Lebensmitteleintrag()
            l.set_id(id)
            l.set_zeitstempel(zeitstempel)
            l.set_aufbewahr_id(aufbewahr_id)
            l.set_aufbewahr_ort(aufbewahr_ort)
            l.set_lebensmittel_id(lebensmittel_id)
            l.set_menge_id(menge_id)
            result = l
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_lebensmittel_id(self, lebensmittel_id):
        """
        Sucht einen Lebensmitteleintrag anhand seiner ID.

        :param id: Die ID des gesuchten Lebensmitteleintrags
        :return: Das gefundene Lebensmitteleintrag-Objekt oder None, falls nicht gefunden
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, aufbewahr_id, aufbewahr_ort, lebensmittel_id, menge_id FROM lebensmittel_eintrag WHERE lebensmittel_id='{}'".format(lebensmittel_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, zeitstempel, aufbewahr_id, aufbewahr_ort, lebensmittel_id, menge_id) in tuples:
            l = Lebensmitteleintrag()
            l.set_id(id)
            l.set_zeitstempel(zeitstempel)
            l.set_aufbewahr_id(aufbewahr_id)
            l.set_aufbewahr_ort(aufbewahr_ort)
            l.set_lebensmittel_id(lebensmittel_id)
            l.set_menge_id(menge_id)
            result.append(l)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_menge_id(self, menge_id):
        """
        Sucht einen Lebensmitteleintrag anhand seiner ID.

        :param id: Die ID des gesuchten Lebensmitteleintrags
        :return: Das gefundene Lebensmitteleintrag-Objekt oder None, falls nicht gefunden
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, aufbewahr_id, aufbewahr_ort, lebensmittel_id, menge_id FROM lebensmittel_eintrag WHERE menge_id='{}'".format(menge_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, zeitstempel, aufbewahr_id, aufbewahr_ort, lebensmittel_id, menge_id) in tuples:
            l = Lebensmitteleintrag()
            l.set_id(id)
            l.set_zeitstempel(zeitstempel)
            l.set_aufbewahr_id(aufbewahr_id)
            l.set_aufbewahr_ort(aufbewahr_ort)
            l.set_lebensmittel_id(lebensmittel_id)
            l.set_menge_id(menge_id)
            result.append(l)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_aufbewahr_ort(self, aufbewahr_id, aufbewahr_ort):
        """
        Sucht Lebensmitteleinträge anhand ihres Aufbewahrungsorts.

        :param aufbewahr_id: Die ID des Aufbewahrungsorts
        :param aufbewahr_ort: Der Name des Aufbewahrungsorts
        :return: Eine Liste von Lebensmitteleintrag-Objekten, die den Suchkriterien entsprechen
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, aufbewahr_id, aufbewahr_ort, lebensmittel_id, menge_id FROM lebensmittel_eintrag WHERE aufbewahr_id={} AND aufbewahr_ort='{}'".format(aufbewahr_id, aufbewahr_ort)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, zeitstempel, aufbewahr_id, aufbewahr_ort, lebensmittel_id, menge_id) in tuples:
            l = Lebensmitteleintrag()
            l.set_id(id)
            l.set_zeitstempel(zeitstempel)
            l.set_aufbewahr_id(aufbewahr_id)
            l.set_aufbewahr_ort(aufbewahr_ort)
            l.set_lebensmittel_id(lebensmittel_id)
            l.set_menge_id(menge_id)
            result.append(l)

        self._cnx.commit()
        cursor.close()

        return result

    def update(self, lebensmittel_eintrag):
        """
        Aktualisiert die Daten eines bestehenden Lebensmitteleintrags in der Datenbank.

        :param lebensmittel_eintrag: Das zu aktualisierende Lebensmitteleintrag-Objekt
        :return: Das aktualisierte Lebensmitteleintrag-Objekt
        """
        cursor = self._cnx.cursor()

        command = "UPDATE lebensmittel_eintrag " + "SET aufbewahr_id=%s, aufbewahr_ort=%s, lebensmittel_id=%s, menge_id=%s WHERE id=%s"
        data = ( lebensmittel_eintrag.get_aufbewahr_id(),lebensmittel_eintrag.get_aufbewahr_ort(),lebensmittel_eintrag.get_lebensmittel_id(),lebensmittel_eintrag.get_menge_id(), lebensmittel_eintrag.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return lebensmittel_eintrag

    def delete(self, lebensmittel_eintrag):
        """
        Löscht einen Lebensmitteleintrag aus der Datenbank.

        :param lebensmittel_eintrag: Das zu löschende Lebensmitteleintrag-Objekt
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM lebensmittel_eintrag WHERE id={}".format(lebensmittel_eintrag.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
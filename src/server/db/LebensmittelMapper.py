from server.bo.LebensmittelBO import Lebensmittel
from server.db.Mapper import Mapper


class LebensmittelMapper (Mapper):

    def __init__(self):
        super().__init__()

    def insert(self, lebensmittel):
        """
       Fügt ein neues Lebensmittel in die Datenbank ein.

       :param lebensmittel: Das zu speichernde Lebensmittel-Objekt
       :return: Das eingefügte Lebensmittel-Objekt mit aktualisierter ID
       """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM lebensmittel ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Lebensmittel-Objekt zu."""
                lebensmittel.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                lebensmittel.set_id(1)

        command = "INSERT INTO lebensmittel (id, zeitstempel, bezeichnung, ersteller_id) VALUES (%s,%s,%s,%s)"
        data = (lebensmittel.get_id(), lebensmittel.get_zeitstempel(), lebensmittel.get_bezeichnung(), lebensmittel.get_ersteller_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return lebensmittel

    def find_by_id(self, id):
        """
        Sucht ein Lebensmittel anhand seiner ID.

        :param id: Die ID des gesuchten Lebensmittels
        :return: Das gefundene Lebensmittel-Objekt oder None, falls nicht gefunden
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, bezeichnung, ersteller_id FROM lebensmittel WHERE id='{}'".format(id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, zeitstempel, bezeichnung, ersteller_id) = tuples[0]
            l = Lebensmittel()
            l.set_id(id)
            l.set_zeitstempel(zeitstempel)
            l.set_bezeichnung(bezeichnung)
            l.set_ersteller_id(ersteller_id)
            result = l
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """
        Gibt alle Lebensmittel aus der Datenbank zurück.

        :return: Eine Liste von Lebensmittel-Objekten
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, bezeichnung, ersteller_id FROM lebensmittel"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for(id, zeitstempel, bezeichnung, ersteller_id) in tuples:
            l = Lebensmittel()
            l.set_id(id)
            l.set_zeitstempel(zeitstempel)
            l.set_bezeichnung(bezeichnung)
            l.set_ersteller_id(ersteller_id)
            result.append(l)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_eigentuemer_id(self, eigentuemer_id):
        """
        Gibt alle Lebensmittel aus der Datenbank zurück.

        :return: Eine Liste von Lebensmittel-Objekten
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, bezeichnung, ersteller_id FROM lebensmittel WHERE ersteller_id='{}'".format(eigentuemer_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for(id, zeitstempel, bezeichnung, ersteller_id) in tuples:
            l = Lebensmittel()
            l.set_id(id)
            l.set_zeitstempel(zeitstempel)
            l.set_bezeichnung(bezeichnung)
            l.set_ersteller_id(ersteller_id)
            result.append(l)

        self._cnx.commit()
        cursor.close()

        return result

    def update(self, lebensmittel):
        """
        Aktualisiert die Daten eines bestehenden Lebensmittels in der Datenbank.

        :param lebensmittel: Das zu aktualisierende Lebensmittel-Objekt
        """
        cursor = self._cnx.cursor()

        command = "UPDATE lebensmittel " + "SET bezeichnung=%s, ersteller_id=%s WHERE id=%s"
        data = ( lebensmittel.get_bezeichnung(), lebensmittel.get_ersteller_id(), lebensmittel.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, lebensmittel):
        """
        Löscht ein Lebensmittel aus der Datenbank.

        :param lebensmittel: Das zu löschende Lebensmittel-Objekt
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM lebensmittel WHERE id={}".format(lebensmittel.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
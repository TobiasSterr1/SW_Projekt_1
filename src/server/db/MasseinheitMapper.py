from server.bo.MasseinheitBO import Masseinheit
from server.db.Mapper import Mapper


class MasseinheitMapper(Mapper):
    """
    Mapper-Klasse für das Mapping von Masseinheit-Objekten auf eine relationale Datenbank.
    Diese Klasse bietet Methoden zum Einfügen, Finden, Aktualisieren und Löschen von Masseinheit-Datensätzen.
    """
    def __init__(self):
        super().__init__()

    def insert(self, masseinheit):
        """
        Fügt eine neue Masseinheit in die Datenbank ein.

        :param masseinheit: Das zu speichernde Masseinheit-Objekt
        :return: Das eingefügte Masseinheit-Objekt mit aktualisierter ID
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM masseinheit ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Masseinheit-Objekt zu."""
                masseinheit.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                masseinheit.set_id(1)

        command = "INSERT INTO masseinheit (id, zeitstempel, bezeichnung, umrechnungs_wert, ist_volumen, eigentuemer_id) VALUES (%s,%s,%s,%s,%s,%s)"
        data = (masseinheit.get_id(), masseinheit.get_zeitstempel(), masseinheit.get_bezeichnung(),
                masseinheit.get_umrechnungs_wert(), masseinheit.get_ist_volumen(), masseinheit.get_eigentuemer_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return masseinheit

    def find_by_id(self, id):
        """
        Sucht eine Masseinheit anhand ihrer ID.

        :param id: Die ID der gesuchten Masseinheit
        :return: Das gefundene Masseinheit-Objekt oder None, falls nicht gefunden
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, bezeichnung, umrechnungs_wert, ist_volumen, eigentuemer_id FROM masseinheit WHERE id='{}'".format(
            id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, zeitstempel, bezeichnung, umrechnungs_wert, ist_volumen, eigentuemer_id) = tuples[0]
            m = Masseinheit()
            m.set_id(id)
            m.set_zeitstempel(zeitstempel)
            m.set_bezeichnung(bezeichnung)
            m.set_umrechnungs_wert(umrechnungs_wert)
            m.set_ist_volumen(ist_volumen)
            m.set_eigentuemer_id(eigentuemer_id)
            result = m
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """
        Gibt alle Masseinheiten aus der Datenbank zurück.

        :return: Eine Liste von Masseinheit-Objekten
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, bezeichnung, umrechnungs_wert, ist_volumen, eigentuemer_id FROM masseinheit"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, zeitstempel, bezeichnung, umrechnungs_wert, ist_volumen, eigentuemer_id) in tuples:
            m = Masseinheit()
            m.set_id(id)
            m.set_zeitstempel(zeitstempel)
            m.set_bezeichnung(bezeichnung)
            m.set_umrechnungs_wert(umrechnungs_wert)
            m.set_ist_volumen(ist_volumen)
            m.set_eigentuemer_id(eigentuemer_id)
            result.append(m)

        self._cnx.commit()
        cursor.close()

        return result
    
    def find_by_eigentuemer_id(self, eigentuemer_id):
        """
        Gibt alle Masseinheiten aus der Datenbank zurück.

        :return: Eine Liste von Masseinheit-Objekten
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, bezeichnung, umrechnungs_wert, ist_volumen, eigentuemer_id FROM masseinheit WHERE eigentuemer_id='{}'".format(eigentuemer_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, zeitstempel, bezeichnung, umrechnungs_wert, ist_volumen, eigentuemer_id) in tuples:
            m = Masseinheit()
            m.set_id(id)
            m.set_zeitstempel(zeitstempel)
            m.set_bezeichnung(bezeichnung)
            m.set_umrechnungs_wert(umrechnungs_wert)
            m.set_ist_volumen(ist_volumen)
            m.set_eigentuemer_id(eigentuemer_id)
            result.append(m)

        self._cnx.commit()
        cursor.close()

        return result

    def update(self, masseinheit):
        """
        Aktualisiert die Daten einer bestehenden Masseinheit in der Datenbank.

        :param masseinheit: Das zu aktualisierende Masseinheit-Objekt
        """
        cursor = self._cnx.cursor()

        command = "UPDATE masseinheit " + " SET bezeichnung=%s, umrechnungs_wert=%s, ist_volumen=%s, eigentuemer_id=%s WHERE id=%s"
        data = (masseinheit.get_bezeichnung(), masseinheit.get_umrechnungs_wert(), masseinheit.get_ist_volumen(), masseinheit.get_eigentuemer_id(),
                masseinheit.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, masseinheit):
        """
        Löscht eine Masseinheit aus der Datenbank.

        :param masseinheit: Das zu löschende Masseinheit-Objekt
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM masseinheit WHERE id={}".format(masseinheit.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
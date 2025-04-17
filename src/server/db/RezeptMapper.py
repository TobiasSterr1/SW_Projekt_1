from server.bo.RezeptBO import Rezept
from server.db.Mapper import Mapper


class RezeptMapper(Mapper):

    def __init__(self):
        super().__init__()

    def insert(self, rezept):
        """
        Fügt ein neues Rezept in die Datenbank ein.

        :param rezept: Das zu speichernde Rezept-Objekt
        :return: Das eingefügte Rezept-Objekt mit aktualisierter ID
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM rezept ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Rezept-Objekt zu."""
                rezept.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                rezept.set_id(1)

        command = "INSERT INTO rezept (id, zeitstempel, eigentuemer_id, anzahl_personen, zubereitung, name, haushalt_id) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        data = (rezept.get_id(), rezept.get_zeitstempel(), rezept.get_eigentuemer_id(), rezept.get_anzahl_personen(),
                rezept.get_zubereitung(), rezept.get_name(), rezept.get_haushalt_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return rezept

    def find_by_id(self, id):
        """
        Sucht ein Rezept anhand seiner ID.

        :param id: Die ID des gesuchten Rezepts
        :return: Das gefundene Rezept-Objekt oder None, falls nicht gefunden
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, eigentuemer_id, anzahl_personen, zubereitung, name, haushalt_id FROM rezept WHERE id='{}'".format(
            id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, zeitstempel, eigentuemer_id, anzahl_personen, zubereitung, name, haushalt_id) = tuples[0]
            r = Rezept()
            r.set_id(id)
            r.set_zeitstempel(zeitstempel)
            r.set_eigentuemer_id(eigentuemer_id)
            r.set_anzahl_personen(anzahl_personen)
            r.set_zubereitung(zubereitung)
            r.set_name(name)
            r.set_haushalt_id(haushalt_id)
            result = r
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self, haushalt_id):
        """
        Liefert alle Rezepte aus der Datenbank.

        :return: Eine Liste von Rezept-Objekten
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, eigentuemer_id, anzahl_personen, zubereitung, name, haushalt_id FROM rezept WHERE haushalt_id='{}'".format(haushalt_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, zeitstempel, eigentuemer_id, anzahl_personen, zubereitung, name, haushalt_id) in tuples:
            r = Rezept()
            r.set_id(id)
            r.set_zeitstempel(zeitstempel)
            r.set_eigentuemer_id(eigentuemer_id)
            r.set_anzahl_personen(anzahl_personen)
            r.set_zubereitung(zubereitung)
            r.set_name(name)
            r.set_haushalt_id(haushalt_id)
            result.append(r)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_eigentuemer_id(self, eigentuemer_id):
        """
        Liefert alle Rezepte aus der Datenbank.

        :return: Eine Liste von Rezept-Objekten
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, eigentuemer_id, anzahl_personen, zubereitung, name, haushalt_id FROM rezept WHERE eigentuemer_id='{}'".format(eigentuemer_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, zeitstempel, eigentuemer_id, anzahl_personen, zubereitung, name, haushalt_id) in tuples:
            r = Rezept()
            r.set_id(id)
            r.set_zeitstempel(zeitstempel)
            r.set_eigentuemer_id(eigentuemer_id)
            r.set_anzahl_personen(anzahl_personen)
            r.set_zubereitung(zubereitung)
            r.set_name(name)
            r.set_haushalt_id(haushalt_id)
            result.append(r)

        self._cnx.commit()
        cursor.close()

        return result

    def update(self, rezept):
        """
        Aktualisiert die Daten eines bestehenden Rezepts in der Datenbank.

        :param rezept: Das zu aktualisierende Rezept-Objekt
        :return: Das aktualisierte Rezept-Objekt
        """
        cursor = self._cnx.cursor()

        command = "UPDATE rezept " + "SET eigentuemer_id=%s, anzahl_personen=%s, zubereitung=%s, name=%s, haushalt_id=%s WHERE id=%s"
        data = (rezept.get_eigentuemer_id(), rezept.get_anzahl_personen(), rezept.get_zubereitung(), rezept.get_name(), rezept.get_haushalt_id(), rezept.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, rezept):
        """
        Löscht ein Rezept aus der Datenbank.

        :param rezept: Das zu löschende Rezept-Objekt
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM rezept WHERE id={}".format(rezept.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
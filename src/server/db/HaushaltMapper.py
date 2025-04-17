from server.bo.HaushaltBO import Haushalt
from server.db.Mapper import Mapper


class HaushaltMapper(Mapper):

    def __init__(self):
        super().__init__()

    def insert(self, haushalt):
        """
        Fügt einen neuen Haushalt in die Datenbank ein.

        :param haushalt: Das zu speichernde Haushalt-Objekt
        :return: Das eingefügte Haushalt-Objekt mit aktualisierter ID
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM haushalt ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Haushalt-Objekt zu."""
                haushalt.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                haushalt.set_id(1)

        command = "INSERT INTO haushalt (id, zeitstempel, name, owner_id) VALUES (%s,%s,%s,%s)"
        data = (haushalt.get_id(), haushalt.get_zeitstempel(), haushalt.get_name(), haushalt.get_owner_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return haushalt

    def find_by_id(self, id):
        """
        Sucht einen Haushalt anhand der ID.

        :param id: Die ID des Haushalts
        :return: Das gefundene Haushalt-Objekt oder eine leere Liste, falls nicht gefunden
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, name, owner_id FROM haushalt WHERE id='{}'".format(id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, zeitstempel, name, owner_id) = tuples[0]
            p = Haushalt()
            p.set_id(id)
            p.set_zeitstempel(zeitstempel)
            p.set_name(name)
            p.set_owner_id(owner_id)
            result = p
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = []

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self, person_id):
        """
        Sucht alle Haushalte, deren Besitzer nicht die angegebene Person ist.

        :param person_id: Die ID der Person
        :return: Eine Liste der gefundenen Haushalt-Objekte
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, name, owner_id FROM haushalt WHERE id NOT IN (SELECT haushalt_id FROM haushalts_mitglied WHERE person_id={})".format(person_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, zeitstempel, name, owner_id) in tuples:
            p = Haushalt()
            p.set_id(id)
            p.set_zeitstempel(zeitstempel)
            p.set_name(name)
            p.set_owner_id(owner_id)
            result.append(p)

        self._cnx.commit()
        cursor.close()

        return result

    def update(self, haushalt):
        """
        Aktualisiert die Daten eines bestehenden Haushalts in der Datenbank.

        :param haushalt: Das zu aktualisierende Haushalt-Objekt
        """
        cursor = self._cnx.cursor()

        command = "UPDATE haushalt " + "SET name=%s, owner_id=%s WHERE id=%s"
        data = (haushalt.get_name(), haushalt.get_owner_id(), haushalt.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, haushalt):
        """
        Löscht einen Haushalt aus der Datenbank.

        :param haushalt: Das zu löschende Haushalt-Objekt
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM haushalt WHERE id={}".format(haushalt.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
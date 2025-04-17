from server.bo.PersonBO import Person
from server.db.Mapper import Mapper


class PersonMapper(Mapper):
    """
    Mapper-Klasse für das Mapping von Person-Objekten auf eine relationale Datenbank.
    Diese Klasse bietet Methoden zum Einfügen, Finden, Aktualisieren und Löschen von Person-Datensätzen.
    """

    def __init__(self):
        super().__init__()

    def insert(self, user):
        """
        Fügt ein neues Person-Objekt in die Datenbank ein.

        :param user: Das zu speichernde Person-Objekt
        :return: Das eingefügte Person-Objekt mit aktualisierter ID
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM person ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                user.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                user.set_id(1)

        command = "INSERT INTO person (id, zeitstempel, benutzername, email, google_user_id, haushalt_id, firstname, lastname) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
        data = (user.get_id(), user.get_zeitstempel(), user.get_benutzername(), user.get_email(), user.get_google_user_id(), user.get_haushalt_id(), user.get_firstname(), user.get_lastname())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return user

    def find_by_guid(self, google_user_id):
        """
        Findet eine Person in der Datenbank anhand der Google User ID.

        :param google_user_id: Die Google User ID der gesuchten Person
        :return: Das gefundene Person-Objekt oder None, falls nicht gefunden
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, benutzername, email, google_user_id, haushalt_id, firstname, lastname FROM person WHERE google_user_id='{}'".format(google_user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, zeitstempel, benutzername, email, google_user_id, haushalt_id, firstname, lastname) = tuples[0]
            p = Person()
            p.set_id(id)
            p.set_zeitstempel(zeitstempel)
            p.set_benutzername(benutzername)
            p.set_email(email)
            p.set_google_user_id(google_user_id)
            p.set_haushalt_id(haushalt_id)
            p.set_firstname(firstname)
            p.set_lastname(lastname)
            result = p
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self, haushalt_id):
        """
        Findet alle Personen, die nicht Mitglied des angegebenen Haushalts sind.

        :param haushalt_id: Die ID des Haushalts
        :return: Eine Liste von Person-Objekten, die nicht Mitglied des angegebenen Haushalts sind
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, benutzername, email, google_user_id, haushalt_id, firstname, lastname FROM person WHERE id NOT IN (SELECT person_id FROM haushalts_mitglied WHERE haushalt_id={})".format(haushalt_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for(id, zeitstempel, benutzername, email, google_user_id, haushalt_id, firstname, lastname) in tuples:
            p = Person()
            p.set_id(id)
            p.set_zeitstempel(zeitstempel)
            p.set_benutzername(benutzername)
            p.set_email(email)
            p.set_google_user_id(google_user_id)
            p.set_haushalt_id(haushalt_id)
            p.set_firstname(firstname)
            p.set_lastname(lastname)
            result.append(p)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_id(self, id):
        """
        Findet eine Person in der Datenbank anhand der ID.

        :param id: Die ID der gesuchten Person
        :return: Das gefundene Person-Objekt oder None, falls nicht gefunden
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, zeitstempel, benutzername, email, google_user_id, haushalt_id, firstname, lastname FROM person WHERE id='{}'".format(id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, zeitstempel, benutzername, email, google_user_id, haushalt_id, firstname, lastname) = tuples[0]
            p = Person()
            p.set_id(id)
            p.set_zeitstempel(zeitstempel)
            p.set_benutzername(benutzername)
            p.set_email(email)
            p.set_google_user_id(google_user_id)
            p.set_haushalt_id(haushalt_id)
            p.set_firstname(firstname)
            p.set_lastname(lastname)
            result = p
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result
    
    def update(self, person):
        """
        Aktualisiert die Daten einer bestehenden Person in der Datenbank.

        :param person: Das zu aktualisierende Person-Objekt
        """
        cursor = self._cnx.cursor()

        command = "UPDATE person " + "SET benutzername=%s, email=%s, haushalt_id=%s, firstname=%s, lastname=%s WHERE google_user_id=%s"
        data = (person.get_benutzername(), person.get_email(), person.get_haushalt_id(), person.get_firstname(), person.get_lastname(), person.get_google_user_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, person):
        """
        Löscht eine Person aus der Datenbank.

        :param person: Das zu löschende Person-Objekt
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM person WHERE id={}".format(person.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
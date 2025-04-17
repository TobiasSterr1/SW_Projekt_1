# Importiert die Haushaltsmitglied Business Object Klasse
from server.bo.HaushaltsmitgliedBO import Haushaltsmitglied
# Importiert die Mapper Basisklasse
from server.db.Mapper import Mapper

# Definiert die Klasse HaushaltsmitgliedMapper, die von der Basisklasse Mapper erbt
class HaushaltsmitgliedMapper (Mapper):

    def __init__(self):
        # Initialisiert die Basisklasse Mapper
        super().__init__()

    # Methode zum Einfügen eines neuen Haushaltsmitglieds in die Datenbank
    def insert(self, haushaltsmitglied):
        """
        Fügt ein neues Haushaltsmitglied in die Datenbank ein.

        :param haushaltsmitglied: Das zu speichernde Haushaltsmitglied-Objekt
        :return: Das eingefügte Haushaltsmitglied-Objekt mit aktualisierter ID
        """
        # Erstellt einen Cursor für die Datenbankoperationen
        cursor = self._cnx.cursor()
        # Führt eine SQL-Abfrage aus, um die höchste vorhandene ID in der Tabelle 'haushalts_mitglied' zu ermitteln
        cursor.execute("SELECT MAX(id) AS maxid FROM haushalts_mitglied ")
        # Ruft alle Ergebnisse der Abfrage ab
        tuples = cursor.fetchall()

        # Iteriert über die Ergebnisse der Abfrage
        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Haushaltsmitglied-Objekt zu."""
                haushaltsmitglied.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                haushaltsmitglied.set_id(1)

        
        # Definiert den SQL-Befehl zum Einfügen eines neuen Haushaltsmitglieds in die Datenbank
        command = "INSERT INTO haushalts_mitglied (id, zeitstempel, person_id, haushalt_id) VALUES (%s,%s,%s,%s)"
        # Bereitet die Daten vor, die in die Datenbank eingefügt werden sollen
        data = (haushaltsmitglied.get_id(), haushaltsmitglied.get_zeitstempel(), haushaltsmitglied.get_person_id(), haushaltsmitglied.get_haushalt_id())
        # Führt den SQL-Befehl mit den vorbereiteten Daten aus
        cursor.execute(command, data)

        # Bestätigt die Transaktion
        self._cnx.commit()
        # Schließt den Cursor
        cursor.close()

        # Gibt das eingefügte Haushaltsmitglied-Objekt zurück
        return haushaltsmitglied

    # Methode zum Suchen eines Haushaltsmitglieds anhand der ID
    def find_by_id(self, id):
        """
        Sucht ein Haushaltsmitglied anhand der ID.

        :param id: Die ID des Haushaltsmitglieds
        :return: Das gefundene Haushaltsmitglied-Objekt oder None, falls nicht gefunden
        """
        result = None

        # Erstellt einen Cursor für die Datenbankoperationen
        cursor = self._cnx.cursor()
        # Definiert den SQL-Befehl zum Suchen eines Haushaltsmitglieds anhand der ID
        command = "SELECT id, zeitstempel, person_id, haushalt_id FROM haushalts_mitglied WHERE id='{}'".format(id)
        # Führt den SQL-Befehl aus
        cursor.execute(command)
        # Ruft alle Ergebnisse der Abfrage ab
        tuples = cursor.fetchall()

        # Versucht, das erste Ergebnis der Abfrage zu extrahieren und zu einem Haushaltsmitglied-Objekt zu machen
        try:
            (id, zeitstempel, person_id, haushalt_id) = tuples[0]
            h = Haushaltsmitglied()
            h.set_id(id)
            h.set_zeitstempel(zeitstempel)
            h.set_person_id(person_id)
            h.set_haushalt_id(haushalt_id)
            result = h
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        # Bestätigt die Transaktion
        self._cnx.commit()
        # Schließt den Cursor
        cursor.close()

        # Gibt das gefundene Haushaltsmitglied-Objekt oder None zurück
        return result

    # Methode zum Suchen von Haushaltsmitgliedern anhand der Personen-ID
    def find_by_person_id(self, person_id):
        """
        Sucht Haushaltsmitglieder anhand der Person-ID.

        :param person_id: Die ID der Person
        :return: Eine Liste der gefundenen Haushaltsmitglied-Objekte
        """
        result = []

        # Erstellt einen Cursor für die Datenbankoperationen
        cursor = self._cnx.cursor()
        # Definiert den SQL-Befehl zum Suchen von Haushaltsmitgliedern anhand der Personen-ID
        command = "SELECT id, zeitstempel, person_id, haushalt_id FROM haushalts_mitglied WHERE person_id='{}'".format(person_id)
         # Führt den SQL-Befehl aus
        cursor.execute(command)
        # Ruft alle Ergebnisse der Abfrage ab
        tuples = cursor.fetchall()

         # Iteriert über die Ergebnisse der Abfrage und erstellt Haushaltsmitglied-Objekte
        for (id, zeitstempel, person_id, haushalt_id) in tuples:
            h = Haushaltsmitglied()
            h.set_id(id)
            h.set_zeitstempel(zeitstempel)
            h.set_person_id(person_id)
            h.set_haushalt_id(haushalt_id)
            result.append(h)

        # Bestätigt die Transaktion
        self._cnx.commit()
        # Schließt den Cursor
        cursor.close()

        # Gibt die Liste der gefundenen Haushaltsmitglied-Objekte zurück
        return result

    # Methode zum Suchen von Haushaltsmitgliedern anhand der Haushalt-ID
    def find_by_haushalt_id(self, haushalt_id):
        """
        Sucht Haushaltsmitglieder anhand der Haushalt-ID.

        :param haushalt_id: Die ID des Haushalts
        :return: Eine Liste der gefundenen Haushaltsmitglied-Objekte
        """
        result = []

        # Erstellt einen Cursor für die Datenbankoperationen
        cursor = self._cnx.cursor()
        # Definiert den SQL-Befehl zum Suchen von Haushaltsmitgliedern anhand der Haushalt-ID
        command = "SELECT id, zeitstempel, person_id, haushalt_id FROM haushalts_mitglied WHERE haushalt_id='{}'".format(haushalt_id)
        # Führt den SQL-Befehl aus
        cursor.execute(command)
        # Ruft alle Ergebnisse der Abfrage ab
        tuples = cursor.fetchall()

        # Iteriert über die Ergebnisse der Abfrage und erstellt Haushaltsmitglied-Objekte
        for (id, zeitstempel, person_id, haushalt_id) in tuples:
            h = Haushaltsmitglied()
            h.set_id(id)
            h.set_zeitstempel(zeitstempel)
            h.set_person_id(person_id)
            h.set_haushalt_id(haushalt_id)
            result.append(h)

        # Bestätigt die Transaktion
        self._cnx.commit()
        # Schließt den Cursor
        cursor.close()

        
        # Gibt die Liste der gefundenen Haushaltsmitglied-Objekte zurück
        return result

    def update(self, haushalts_mitglied):
        """
        Aktualisiert die Daten eines bestehenden Haushaltsmitglieds in der Datenbank.

        :param haushaltsmitglied: Das zu aktualisierende Haushaltsmitglied-Objekt
        """
        # Erstellt einen Cursor für die Datenbankoperationen
        cursor = self._cnx.cursor()

        # Definiert den SQL-Befehl zum Aktualisieren des Haushaltsmitglied-Daten
        command = "UPDATE haushalts_mitglied " + "SET person_id=%s, haushalt_id=%s WHERE id=%s"
         # Bereitet die Daten vor, die aktualisiert werden sollen
        data = (haushalts_mitglied.get_person_id(), haushalts_mitglied.get_haushalt_id(), haushalts_mitglied.get_id())
        # Führt den SQL-Befehl mit den vorbereiteten Daten aus
        cursor.execute(command, data)

        # Bestätigt die Transaktion
        self._cnx.commit()
        # Schließt den Cursor
        cursor.close()

    # Methode zum Löschen eines Haushaltsmitglieds aus der Datenbank
    def delete(self, haushalts_mitglied):
        """
        Löscht ein Haushaltsmitglied aus der Datenbank.

        :param haushaltsmitglied: Das zu löschende Haushaltsmitglied-Objekt
        """
        # Erstellt einen Cursor für die Datenbankoperationen
        cursor = self._cnx.cursor()

        # Definiert den SQL-Befehl zum Löschen eines Haushaltsmitglieds anhand der ID
        command = "DELETE FROM haushalts_mitglied WHERE id={}".format(haushalts_mitglied.get_id())
        # Führt den SQL-Befehl aus
        cursor.execute(command)

        # Bestätigt die Transaktion
        self._cnx.commit()
        cursor.close()
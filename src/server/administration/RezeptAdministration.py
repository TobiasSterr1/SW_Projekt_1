from server.bo.RezeptBO import Rezept
from server.db.Mapper import Mapper
from server.db.RezeptMapper import RezeptMapper
from server.administration.KuehlschrankAdministration import KuehlschrankAdministration
from server.administration.LebensmitteleintragAdministration import LebensmitteleintragAdministration
from server.administration.MasseinheitAdministration import MasseinheitAdministration
from server.administration.MengeAdministration import MengeAdministration


class RezeptAdministration(Mapper):

    def __init__(self):
        super().__init__()

    """
    Rezept-spezifische Methoden
    """

    def create_rezept(self, eigentuemer_id, anzahl_personen, zubereitung, name, haushalt_id):
        """Erstellt ein neues Rezept."""
        rezept = Rezept()
        rezept.set_eigentuemer_id(eigentuemer_id)
        rezept.set_anzahl_personen(anzahl_personen)
        rezept.set_zubereitung(zubereitung)
        rezept.set_name(name)
        rezept.set_haushalt_id(haushalt_id)

        with RezeptMapper() as mapper:
            return mapper.insert(rezept)

    def get_rezept_by_id(self, id):
        """Sucht ein Rezept anhand der ID."""
        with RezeptMapper() as mapper:
            return mapper.find_by_id(id)

    def get_rezept_by_eigentuemer_id(self, id):
        """Sucht ein Rezept anhand der ID."""
        with RezeptMapper() as mapper:
            return mapper.find_by_eigentuemer_id(id)

    def rezept_kochen(self, rezept_id, haushalt_id):
        """
        Bereitet ein Rezept zu und aktualisiert die Bestände im Kühlschrank.

        Das Rezept wird anhand seiner ID gesucht, die benötigten Zutaten werden aus dem Kühlschrank des
        Haushalts entnommen und der Bestand entsprechend angepasst.
        """

        # Initialisiere die benötigten Administrationen
        lebensmitteleintrag_adm = LebensmitteleintragAdministration()
        masseinheit_adm = MasseinheitAdministration()
        menge_adm = MengeAdministration()
        kuehlschrank_adm = KuehlschrankAdministration()

        # Hole das Rezept basierend auf der ID
        rezept = self.get_rezept_by_id(rezept_id)

        # Hole alle Lebensmitteleinträge, die für das Rezept benötigt werden
        lebensmitteleintrag_list_rezept = lebensmitteleintrag_adm.get_lebensmittel_eingtrag_by_aufbewahr_ort(
            aufbewahr_id=rezept.get_id(), aufbewahr_ort="Rezept"
        )

        # Hole den Kühlschrank des Haushalts basierend auf der Haushalt-ID
        kuehlschrank = kuehlschrank_adm.get_kuehlschrank_by_haushalt_id(haushalt_id)

        # Hole alle Lebensmitteleinträge, die im Kühlschrank des Haushalts vorhanden sind
        lebensmitteleintrag_list_kuehlschrank = lebensmitteleintrag_adm.get_lebensmittel_eingtrag_by_aufbewahr_ort(
            aufbewahr_id=kuehlschrank.get_id(), aufbewahr_ort="Kuehlschrank"
        )

        # Überprüfe jedes Lebensmittel, das im Rezept benötigt wird
        for rezept_lebensmitteleintrag in lebensmitteleintrag_list_rezept:
            # Suche das entsprechende Lebensmittel im Kühlschrank
            matching_eintrag = next((eintrag for eintrag in lebensmitteleintrag_list_kuehlschrank if
                                     eintrag.get_lebensmittel_id() == rezept_lebensmitteleintrag.get_lebensmittel_id()),
                                    None)

            if matching_eintrag:
                # Menge und Maßeinheit des Rezept-Lebensmitteleintrags
                rezept_menge = menge_adm.get_menge_by_id(rezept_lebensmitteleintrag.get_menge_id())
                rezept_masseinheit = masseinheit_adm.get_masseinheit_by_id(rezept_menge.get_masseinheit_id())
                rezept_umgerechnete_menge = rezept_menge.get_mengenanzahl() * rezept_masseinheit.get_umrechnungs_wert()

                # Menge und Maßeinheit des Kühlschrank-Lebensmitteleintrags
                kuehlschrank_menge = menge_adm.get_menge_by_id(matching_eintrag.get_menge_id())
                kuehlschrank_masseinheit = masseinheit_adm.get_masseinheit_by_id(
                    kuehlschrank_menge.get_masseinheit_id())
                kuehlschrank_umgerechnete_menge = kuehlschrank_menge.get_mengenanzahl() * kuehlschrank_masseinheit.get_umrechnungs_wert()

                # Berechnen der verbleibenden Menge im Kühlschrank
                verbleibende_menge = kuehlschrank_umgerechnete_menge - rezept_umgerechnete_menge

                # Berechne die verbleibende Menge im Kühlschrank nach Abzug der benötigten Menge
                if verbleibende_menge <= 0:
                    # Wenn nichts mehr übrig bleibt, lösche den Eintrag aus dem Kühlschrank
                    lebensmitteleintrag_adm.delete_lebensmitteleintrag(matching_eintrag, False)
                else:
                    # Wenn etwas übrig bleibt, konvertiere die verbleibende Menge zurück in die ursprüngliche Einheit
                    neue_menge = verbleibende_menge / kuehlschrank_masseinheit.get_umrechnungs_wert()
                    kuehlschrank_menge.set_mengenanzahl(neue_menge)
                    menge_adm.update_menge(kuehlschrank_menge)

    def get_matching_rezepte(self, haushalt_id):
        """
        Holt alle passenden Rezepte basierend auf dem Kühlschrankinhalt.

        Es wird überprüft, welche Rezepte mit den vorhandenen Lebensmitteln im Kühlschrank des
        Haushalts zubereitet werden können.
        """

        # Initialisiere die benötigten Administrationen
        kuehlschrank_adm = KuehlschrankAdministration()
        masseinheit_adm = MasseinheitAdministration()
        menge_adm = MengeAdministration()
        lebensmitteleintrag_adm = LebensmitteleintragAdministration()

        # Hole den Kühlschrank des Haushalts basierend auf der Haushalt-ID
        kuehlschrank = kuehlschrank_adm.get_kuehlschrank_by_haushalt_id(haushalt_id)
        lebensmitteleintrag_list_kuehlschrank = lebensmitteleintrag_adm.get_lebensmittel_eingtrag_by_aufbewahr_ort(
            aufbewahr_id=kuehlschrank.get_id(), aufbewahr_ort="Kuehlschrank"
        )

        # Erstelle ein Dictionary für schnellen Zugriff auf Lebensmitteleinträge im Kühlschrank
        kuehlschrank_dict = {entry.get_lebensmittel_id(): entry for entry in lebensmitteleintrag_list_kuehlschrank}

        # Überprüfe jedes Rezept
        rezept_list = self.get_alle_rezepte(haushalt_id)
        matching_rezepte = []
        for rezept in rezept_list:
            matching_score = 0 # Initialisiere den Matching-Score für das Rezept
            # Hole alle Lebensmitteleinträge, die für das Rezept benötigt werden
            lebensmitteleintrag_list_rezept = lebensmitteleintrag_adm.get_lebensmittel_eingtrag_by_aufbewahr_ort(
                aufbewahr_id=rezept.get_id(), aufbewahr_ort="Rezept"
            )

            # Überprüfe jeden Lebensmitteleintrag im Rezept
            for rezept_lebensmitteleintrag in lebensmitteleintrag_list_rezept:
                rezept_lebensmittel_id = rezept_lebensmitteleintrag.get_lebensmittel_id()

                if rezept_lebensmittel_id in kuehlschrank_dict:
                    # Erhöhe den Matching-Score, wenn das Lebensmittel im Kühlschrank vorhanden ist
                    kuehlschrank_lebensmitteleintrag = kuehlschrank_dict[rezept_lebensmittel_id]
                    matching_score += 0.5

                    # Hole die Menge und Maßeinheit des Rezept-Lebensmitteleintrags
                    rezept_lebensmitteleintrag_menge = menge_adm.get_menge_by_id(
                        rezept_lebensmitteleintrag.get_menge_id())
                    rezept_lebensmitteleintrag_masseinheit = masseinheit_adm.get_masseinheit_by_id(
                        rezept_lebensmitteleintrag_menge.get_masseinheit_id()
                    )
                    umgerechnete_rezept_menge = (
                            rezept_lebensmitteleintrag_menge.get_mengenanzahl()
                            * rezept_lebensmitteleintrag_masseinheit.get_umrechnungs_wert()
                    )

                    # Hole die Menge und Maßeinheit des Kühlschrank-Lebensmitteleintrags
                    kuehlschrank_lebensmitteleintrag_menge = menge_adm.get_menge_by_id(
                        kuehlschrank_lebensmitteleintrag.get_menge_id()
                    )
                    kuehlschrank_lebensmitteleintrag_masseinheit = masseinheit_adm.get_masseinheit_by_id(
                        kuehlschrank_lebensmitteleintrag_menge.get_masseinheit_id()
                    )
                    umgerechnete_kuehlschrank_menge = (
                            kuehlschrank_lebensmitteleintrag_menge.get_mengenanzahl()
                            * kuehlschrank_lebensmitteleintrag_masseinheit.get_umrechnungs_wert()
                    )

                    # Vergleiche die Mengen
                    if umgerechnete_rezept_menge <= umgerechnete_kuehlschrank_menge:
                        matching_score += 0.5

            # Berechne den Gesamt-Matching-Score als Verhältnis des erreichten Scores zur maximal möglichen Punktzahl
            max_score = len(lebensmitteleintrag_list_rezept) or 1
            overall_score = matching_score / max_score
            if overall_score >= 0.5: # Alle Zutaten in ausreichender Menge vorhanden
                print(f'Rezept: {rezept.get_name()} is a match!')
                matching_rezepte.append(rezept)
            print(f'Rezept: {rezept.get_name()} has a matching score of {overall_score}')
        return matching_rezepte

    def get_alle_rezepte(self, haushalt_id):
        """Holt alle Rezepte."""
        with RezeptMapper() as mapper:
            return mapper.find_all(haushalt_id)

    def update_rezept(self, rezept):
        """Aktualisiert ein vorhandenes Rezept."""
        with RezeptMapper() as mapper:
            mapper.update(rezept)

    def delete_rezept(self, rezept):
        """Löscht ein Rezept aus der Datenbank."""
        lebensmitteleintrag_adm = LebensmitteleintragAdministration()
        menge_adm = MengeAdministration()

        # Hole alle Lebensmitteleinträge für das Rezept
        lebensmitteleintrag_list_rezept = lebensmitteleintrag_adm.get_lebensmittel_eingtrag_by_aufbewahr_ort(
            aufbewahr_id=rezept.get_id(), aufbewahr_ort="Rezept"
        )
        # Lösche jeden Lebensmitteleintrag und die zugehörigen Mengen
        for rezept_lebensmitteleintrag in lebensmitteleintrag_list_rezept:
            lebensmitteleintrag_adm.delete_lebensmitteleintrag(rezept_lebensmitteleintrag, False)

        # Lösche das Rezept selbst
        with RezeptMapper() as mapper:
            mapper.delete(rezept)
"""A. Allgemeine Hinweise zu diesem Module:

Normalerweise würde man eine Datei dieser Länge bzw. ein Module
dieser Größe in mehrere Dateien bzw. Modules untergliedern. So könnte
man z.B. pro Resource Class ein eigenes Module anlegen. Dadurch
ergäben sich erhebliche Vorteile bzgl. der Wartungsfreundlichkeit
dieses Modules. Es ergäben sich aber auch Nachteile! So haben Sie
etwa mit einer Reihe von Abhängigkeiten z.B. zwischen der API-Definition
und den Decorators zu tun. Außerdem verschlechtert sich aufgrund der Länge
der Datei die Übersichtlichkeit der Inhalte und Strukturen.

Abgesehen von Lehrbüchern und Vorlesungen müssen Sie in realen Projekten
häufig die Vor- und Nachteile von Entscheidungen abwägen und sich dann
bewusst für einen Weg entscheiden. Hier wurde die Entscheidung getroffen,
die Einfachheit und Verständlichkeit des Source Codes höher zu werten als
die Optimierung des Kopplungsgrads und damit der Wartbarkeit des Modules.

B. Konventionen für dieses Module:

    B.1. HTTP response status codes:

        Folgende Codes werden verwendet:
        200 OK           :      bei erfolgreichen requests. AUf die Verwendung von weiter differenzierenden
                                Statusmeldungen wie etwa '204 No Content' für erfolgreiche requests, die außer evtl.
                                im Header keine weiteren Daten zurückliefern, wird in dieser Fallstudie auch aus Gründen
                                einer möglichst einfachen Umsetzung verzichtet.
        401 Unauthorized :      falls der User sich nicht gegenüber dem System
                                authentisiert hat und daher keinen Zugriff erhält.
        404 Not Found    :      falls eine angefragte Resource nicht verfügbar ist
        500 Internal Server Error : falls der Server einen Fehler erkennt,
                                diesen aber nicht genauer zu bearbeiten weiß.

    B.2. Name des Moduls:
        Der Name dieses Moduls lautet main.py. Grund hierfür ist, dass Google App Engine, diesen Namen bevorzugt und
        sich dadurch das Deployment einfacher gestaltet. Natürlich wären auch andere Namen möglich. Dies wäre aber mit
        zusätzlichem Konfigurationsaufwand in der Datei app.yaml verbunden.
"""

# Unser Service basiert auf Flask
from flask import request, redirect, url_for, Flask
# Auf Flask aufbauend nutzen wir RestX
from flask_restx import Api, Resource, fields
# Wir benutzen noch eine Flask-Erweiterung für Cross-Origin Resource Sharing
from flask_cors import CORS
from server.administration.PersonAdministration import PersonAdministration
from server.administration.RezeptAdministration import RezeptAdministration
from server.administration.MengeAdministration import MengeAdministration
from server.administration.MasseinheitAdministration import MasseinheitAdministration
from server.administration.LebensmitteleintragAdministration import LebensmitteleintragAdministration
from server.administration.LebensmittelAdministration import LebensmittelAdministration
from server.administration.KuehlschrankAdministration import KuehlschrankAdministration
from server.administration.HaushaltsmitgliedAdministration import HaushaltsmitgliedAdministration
from server.administration.HaushaltAdministration import HaushaltAdministration
from server.administration.EinkaufslisteAdministration import EinkaufslisteAdministration
from server.bo.EinkaufslisteBO import Einkaufsliste
from server.bo.HaushaltBO import Haushalt
from server.bo.HaushaltsmitgliedBO import Haushaltsmitglied
from server.bo.KuehlschrankBO import Kuehlschrank
from server.bo.LebensmittelBO import Lebensmittel
from server.bo.LebensmitteleintragBO import Lebensmitteleintrag
from server.bo.MasseinheitBO import Masseinheit
from server.bo.MengeBO import Menge
from server.bo.RezeptBO import Rezept
from server.bo.PersonBO import Person

# Wir greifen natürlich auf unsere Applikationslogik inkl. BusinessObject-Klassen zurück
#from server.FoodmanagerAdministration import FoodmanagerAdministration
#from server.bo.Person import Person

# Außerdem nutzen wir einen selbstgeschriebenen Decorator, der die Authentifikation übernimmt
from SecurityDecorator import secured

"""
Instanzieren von Flask. Am Ende dieser Datei erfolgt dann erst der 'Start' von Flask.
"""
app = Flask(__name__, static_folder='./build', static_url_path='/')
"""
Alle Ressourcen mit dem Präfix /foodmanager für **Cross-Origin Resource Sharing** (CORS) freigeben.
Diese eine Zeile setzt die Installation des Package flask-cors voraus.
"""
CORS(app, resources=r'/foodmanager/*', supports_credentials=True)

app.config['ERROR_404_HELP'] = False

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def handle_404(e):
    if request.path.startswith('/foodmanager'):
        return "Fehler", 404
    else:
        return redirect(url_for('index'))

"""
In dem folgenden Abschnitt bauen wir ein Modell auf, das die Datenstruktur beschreibt, 
auf deren Basis Clients und Server Daten austauschen. Grundlage hierfür ist das Package flask-restx.
"""
api = Api(app, version='1.0', title='Foodmanager API',
          description='Eine API für die Daten des Foodmanagers.')

"""Anlegen eines Namespace

Namespaces erlauben uns die Strukturierung von APIs. In diesem Fall fasst dieser Namespace alle
Foodmanager-relevanten Operationen unter dem Präfix /foodmanager zusammen. Eine alternative bzw. ergänzende Nutzung
von Namespace könnte etwa sein, unterschiedliche API-Version voneinander zu trennen, um etwa 
Abwärtskompatibilität (vgl. Lehrveranstaltungen zu Software Engineering) zu gewährleisten. Dies ließe
sich z.B. umsetzen durch /foodmanager/v1, /foodmanager/v2 usw."""
foodmanager = api.namespace('foodmanager', description='Funktionen des FoodmanagerBeispiels')

"""Nachfolgend werden analog zu unseren BusinessObject-Klassen transferierbare Strukturen angelegt.

BusinessObject dient als Basisklasse, auf der die weiteren Strukturen Person, Account und Transaction aufsetzen."""
bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='unique identifier eines business object'),
    'zeitstempel': fields.String(attribute='_zeitstempel', description='zeitstempel eines business objects'),
})

"""person marshalling"""
person = api.inherit('Person', bo, {
    'benutzername': fields.String(attribute='_benutzername', description='name eines person'),
    'email': fields.String(attribute='_email', description='email eines person'),
    'google_user_id': fields.String(attribute='_google_user_id', description='Google User ID eines person'),
    'haushalt_id': fields.Integer(attribute='_haushalt_id', description='Haushalt ID eines person'),
    'firstname': fields.String(attribute='_firstname', description='Vorname eines person'),
    'lastname': fields.String(attribute='_lastname', description='Nachname eines person'),
})

"""haushaltsmitglied marshalling"""
haushaltsmitglied = api.inherit('Haushaltsmitglied', bo, {
    'person_id': fields.Integer(attribute='_person_id', description='person_id eines haushaltsmitglied'),
    'haushalt_id': fields.Integer(attribute='_haushalt_id', description='haushalt_id eines haushaltsmitglied'),
    })

"""haushalt marshalling"""
haushalt = api.inherit('Haushalt', bo, {
    'name': fields.String(attribute='_name', description='name eines haushalts'),
    'owner_id': fields.Integer(attribute='_owner_id', description='owner_id eines haushalts'),
    })

"""rezept marshalling"""
rezept = api.inherit('Rezept', bo, {
    'name': fields.String(attribute='_name', description='name eines rezepts'),
    'zubereitung': fields.String(attribute='_zubereitung', description='zubereitung eines rezepts'),
    'eigentuemer_id': fields.Integer(attribute='_eigentuemer_id', description='eigentuemer_id eines rezepts'),
    'anzahl_personen': fields.Integer(attribute='_anzahl_personen', description='anzahl_personen eines rezepts'),
    'haushalt_id': fields.Integer(attribute='_haushalt_id', description='haushalt_id eines rezepts'),
    })

"""einkaufsliste marshalling"""
einkaufsliste = api.inherit('Einkaufsliste', bo, {
    'haushalt_id': fields.Integer(attribute='_haushalt_id', description='haushalt_id einer Einkaufsliste'),
    })

"""kuehlschrank marshalling"""
kuehlschrank = api.inherit('Kuehlschrank', bo, {
    'haushalt_id': fields.Integer(attribute='_haushalt_id', description='haushalt_id eines Kühlschranks'),
    })

"""lebensmittel_eintrag marshalling"""
lebensmitteleintrag = api.inherit('Lebensmittel_eintrag', bo, {
    'aufbewahr_id': fields.Integer(attribute='_aufbewahr_id', description='aufbewahr_id eines Lebensmitteleintrags'),
    'aufbewahr_ort': fields.String(attribute='_aufbewahr_ort', description='aufbewahr_ort eines Lebensmitteleintrags'),
    'lebensmittel_id': fields.Integer(attribute='_lebensmittel_id', description='lebensmittel_id eines Lebensmitteleintrags'),
    'menge_id': fields.Integer(attribute='_menge_id', description='menge_id eines Lebensmitteleintrags'),
    })

"""lebensmittel marshalling"""
lebensmittel = api.inherit('Lebensmittel', bo, {
    'bezeichnung': fields.String(attribute='_bezeichnung', description='bezeichnung eines Lebensmittel'),
    'ersteller_id': fields.Integer(attribute='_ersteller_id', description='ersteller_id eines Lebensmittel'),
    })

"""menge marshalling"""
menge = api.inherit('Menge', bo, {
    'mengenanzahl': fields.Float(attribute='_mengenanzahl', description='mengenanzahl einer Menge'),
    'masseinheit_id': fields.Integer(attribute='_masseinheit_id', description='masseinheit_id einer Menge'),
    })

"""masseinheit marshalling"""
masseinheit = api.inherit('Masseinheit', bo, {
    'bezeichnung': fields.String(attribute='_bezeichnung', description='bezeichnung einer Masseinheit'),
    'umrechnungs_wert': fields.Float(attribute='_umrechnungs_wert', description='umrechnungswert einer Masseinheit'),
    'ist_volumen': fields.Integer(attribute='_ist_volumen', description='ist_volumen einer Masseinheit'),
    'eigentuemer_id': fields.Integer(attribute='_eigentuemer_id', description='eigentuemer_id einer Masseinheit'),
    })


"""PERSON ROUTEN"""

@foodmanager.route('/person/<string:guid>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PersonenOperationen(Resource):
    @foodmanager.marshal_list_with(person)
    @secured
    def get(self, guid):
        """Auslesen aller Person-Objekte.

        Sollten keine Person-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = PersonAdministration()
        person = adm.get_person_by_guid(guid)
        return person
    
@foodmanager.route('/person-all/<int:haushalt_id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PersonenOperationen(Resource):
    @foodmanager.marshal_list_with(person)
    @secured
    def get(self, haushalt_id):
        """Auslesen aller Person-Objekte.

        Sollten keine Person-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = PersonAdministration()
        person = adm.get_all_person(haushalt_id)
        return person

@foodmanager.route('/person/<int:id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PersonenOperationen(Resource):
    @foodmanager.marshal_list_with(person)
    #@secured
    def get(self, id):
        """Auslesen aller Person-Objekte.

        Sollten keine Person-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = PersonAdministration()
        person = adm.get_person_by_id(id)
        return person
    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Person-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = PersonAdministration()
        person = adm.get_person_by_id(id)
        adm.delete_person(person)
        return '', 200
    
    @foodmanager.marshal_with(person)
    @foodmanager.expect(person, validate=True)
    #@secured
    def put(self, id):
        """Update eines bestimmten Person-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Person-Objekts.
        """
        adm = PersonAdministration()
        p = Person.from_dict(api.payload)

        if p is not None:
            """Hierdurch wird die id des zu überschreibenden (vgl. Update) Person-Objekts gesetzt.
            Siehe Hinweise oben.
            """
            p.set_id(id)
            adm.update_person(p)
            return '', 200
        else:
            return '', 500

@foodmanager.route('/person')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PersonenOperationen(Resource):
    @foodmanager.marshal_with(person, code=200)
    # Wir erwarten ein Person-Objekt von Client-Seite.
    @foodmanager.expect(person)
    #@secured
    def post(self):
        """Anlegen eines neuen Person-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        So ist zum Beispiel die Vergabe der ID nicht Aufgabe des Clients.
        Selbst wenn der Client eine ID in dem Proposal vergeben sollte, so
        liegt es an der PersonAdministration (Businesslogik), eine korrekte ID
        zu vergeben. *Das korrigierte Objekt wird schließlich zurückgegeben.*
        """
        adm = PersonAdministration()

        proposal = Person.from_dict(api.payload)

        """RATSCHLAG: Prüfen Sie stets die Referenzen auf valide Werte, bevor Sie diese verwenden!"""
        if proposal is not None:
            """ Wir verwenden lediglich Vor- und Nachnamen des Proposals für die Erzeugung
            eines Person-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird auch dem Client zurückgegeben. 
            """
            p = adm.create_person(
                proposal.get_benutzername(), proposal.get_email(), proposal.get_google_user_id(), proposal.get_haushalt_id(), proposal.get_firstname(), proposal.get_lastname() )
            return p, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


"""REZEPTE ROUTEN"""
@foodmanager.route('/rezept')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class RezeptenOperationen(Resource):
    @foodmanager.marshal_with(rezept, code=200)
    # Wir erwarten ein Rezept-Objekt von Client-Seite.
    @foodmanager.expect(rezept)
    #@secured
    def post(self):
        """Anlegen eines neuen Rezept-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        So ist zum Beispiel die Vergabe der ID nicht Aufgabe des Clients.
        Selbst wenn der Client eine ID in dem Proposal vergeben sollte, so
        liegt es an der RezeptAdministration (Businesslogik), eine korrekte ID
        zu vergeben. *Das korrigierte Objekt wird schließlich zurückgegeben.*
        """
        adm = RezeptAdministration()

        proposal = Rezept.from_dict(api.payload)

        """RATSCHLAG: Prüfen Sie stets die Referenzen auf valide Werte, bevor Sie diese verwenden!"""
        if proposal is not None:
            """ Wir verwenden lediglich Vor- und Nachnamen des Proposals für die Erzeugung
            eines Rezept-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird auch dem Client zurückgegeben. 
            """
            r = adm.create_rezept(
                proposal.get_eigentuemer_id(), proposal.get_anzahl_personen(), proposal.get_zubereitung(), proposal.get_name(), proposal.get_haushalt_id())
            return r, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500
@foodmanager.route('/alle-rezepte/<int:haushalt_id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class RezeptenOperationen(Resource):
    @foodmanager.marshal_list_with(rezept)
    #@secured
    def get(self, haushalt_id ):
        """Auslesen aller Rezept-Objekte.

        Sollten keine Rezept-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = RezeptAdministration()
        rezept = adm.get_matching_rezepte(haushalt_id)
        return rezept
@foodmanager.route('/alle-rezepte-haushalt/<int:haushalt_id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class RezeptenOperationen(Resource):
    @foodmanager.marshal_list_with(rezept)
    #@secured
    def get(self, haushalt_id ):
        """Auslesen aller Rezept-Objekte.

        Sollten keine Rezept-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = RezeptAdministration()
        rezept = adm.get_alle_rezepte(haushalt_id)
        return rezept
@foodmanager.route('/cookRezept/<int:rezept_id>/<int:haushalt_id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class RezeptenOperationen(Resource):
    @foodmanager.marshal_list_with(rezept)
    #@secured
    def get(self, rezept_id, haushalt_id):
        """Auslesen aller Rezept-Objekte.

        Sollten keine Rezept-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = RezeptAdministration()
        rezept = adm.rezept_kochen(rezept_id, haushalt_id)
        return rezept
@foodmanager.route('/rezept/<int:id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class RezeptenOperationen(Resource):
    @foodmanager.marshal_list_with(rezept)
    #@secured
    def get(self, id):
        """Auslesen aller Rezept-Objekte.

        Sollten keine Rezept-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = RezeptAdministration()
        rezept = adm.get_rezept_by_id(id)
        return rezept
    
    @foodmanager.marshal_with(rezept)
    @foodmanager.expect(rezept)
    #@secured
    def put(self, id):
        """Update eines bestimmten Rezept-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Rezept-Objekts.
        """
        adm = RezeptAdministration()
        r = Rezept.from_dict(api.payload)

        if r is not None:
            """Hierdurch wird die id des zu überschreibenden (vgl. Update) Rezept-Objekts gesetzt.
            Siehe Hinweise oben.
            """
            r.set_id(id)
            adm.update_rezept(r)
            return '', 200
        else:
            return '', 500
    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Rezept-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = RezeptAdministration()
        rezept = adm.get_rezept_by_id(id)
        adm.delete_rezept(rezept)
        return '', 200

"""MENGE ROUTEN"""
@foodmanager.route('/menge')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class MengenOperationen(Resource):
    @foodmanager.marshal_with(menge, code=200)
    # Wir erwarten ein Menge-Objekt von Client-Seite.
    @foodmanager.expect(menge)
    #@secured
    def post(self):
        """Anlegen eines neuen Menge-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        So ist zum Beispiel die Vergabe der ID nicht Aufgabe des Clients.
        Selbst wenn der Client eine ID in dem Proposal vergeben sollte, so
        liegt es an der MengeAdministration (Businesslogik), eine korrekte ID
        zu vergeben. *Das korrigierte Objekt wird schließlich zurückgegeben.*
        """
        adm = MengeAdministration()

        proposal = Menge.from_dict(api.payload)

        """RATSCHLAG: Prüfen Sie stets die Referenzen auf valide Werte, bevor Sie diese verwenden!"""
        if proposal is not None:
            """ Wir verwenden lediglich Vor- und Nachnamen des Proposals für die Erzeugung
            eines Menge-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird auch dem Client zurückgegeben. 
            """
            m = adm.create_menge(
                proposal.get_mengenanzahl(), proposal.get_masseinheit_id())
            return m, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

@foodmanager.route('/menge/<int:id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class MengeenOperationen(Resource):
    @foodmanager.marshal_list_with(menge)
    #@secured
    def get(self, id):
        """Auslesen aller Menge-Objekte.

        Sollten keine Menge-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = MengeAdministration()
        menge = adm.get_menge_by_id(id)
        return menge
        
    @foodmanager.marshal_with(menge)
    @foodmanager.expect(menge, validate=True)
    #@secured
    def put(self, id):
        """Update eines bestimmten Menge-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Menge-Objekts.
        """
        adm = MengeAdministration()
        m = Menge.from_dict(api.payload)

        if m is not None:
            """Hierdurch wird die id des zu überschreibenden (vgl. Update) Menge-Objekts gesetzt.
            Siehe Hinweise oben.
            """
            m.set_id(id)
            menge = adm.update_menge(m)
            return menge, 200
        else:
            return '', 500
    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Menge-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = MengeAdministration()
        menge = adm.get_menge_by_id(id)
        adm.delete_menge(menge)
        return '', 200
"""MASSEINHEIT ROUTEN"""
@foodmanager.route('/masseinheit')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class MasseinheitnOperationen(Resource):
    @foodmanager.marshal_with(masseinheit, code=200)
    # Wir erwarten ein Masseinheit-Objekt von Client-Seite.
    @foodmanager.expect(masseinheit)
    #@secured
    def post(self):
        """Anlegen eines neuen Masseinheit-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        So ist zum Beispiel die Vergabe der ID nicht Aufgabe des Clients.
        Selbst wenn der Client eine ID in dem Proposal vergeben sollte, so
        liegt es an der MasseinheitAdministration (Businesslogik), eine korrekte ID
        zu vergeben. *Das korrigierte Objekt wird schließlich zurückgegeben.*
        """
        adm = MasseinheitAdministration()

        proposal = Masseinheit.from_dict(api.payload)

        """RATSCHLAG: Prüfen Sie stets die Referenzen auf valide Werte, bevor Sie diese verwenden!"""
        if proposal is not None:
            """ Wir verwenden lediglich Vor- und Nachnamen des Proposals für die Erzeugung
            eines Masseinheit-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird auch dem Client zurückgegeben. 
            """
            m = adm.create_masseinheit(
                proposal.get_bezeichnung(), proposal.get_umrechnungs_wert(), proposal.get_ist_volumen(), proposal.get_eigentuemer_id())
            return m, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500
    @foodmanager.marshal_list_with(masseinheit)
    #@secured
    def get(self):
        """Auslesen aller Masseinheit-Objekte.

        Sollten keine Masseinheit-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = MasseinheitAdministration()
        masseinheit = adm.get_all_masseinheit()
        return masseinheit
@foodmanager.route('/masseinheit/<int:id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class MasseinheitenOperationen(Resource):
    @foodmanager.marshal_list_with(masseinheit)
    #@secured
    def get(self, id):
        """Auslesen aller Masseinheit-Objekte.

        Sollten keine Masseinheit-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = MasseinheitAdministration()
        masseinheit = adm.get_masseinheit_by_id(id)
        return masseinheit
        
    @foodmanager.marshal_with(masseinheit)
    @foodmanager.expect(masseinheit)
    #@secured
    def put(self, id):
        """Update eines bestimmten Masseinheit-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Masseinheit-Objekts.
        """
        adm = MasseinheitAdministration()
        m = Masseinheit.from_dict(api.payload)

        if m is not None:
            """Hierdurch wird die id des zu überschreibenden (vgl. Update) Masseinheit-Objekts gesetzt.
            Siehe Hinweise oben.
            """
            m.set_id(id)
            adm.update_masseinheit(m)
            return '', 200
        else:
            return '', 500
    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Masseinheit-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = MasseinheitAdministration()
        masseinheit = adm.get_masseinheit_by_id(id)
        adm.delete_masseinheit(masseinheit)
        return '', 200
    """LEBENSMITTELEINTRAG ROUTEN"""
@foodmanager.route('/lebensmitteleintrag')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class LebensmitteleintragnOperationen(Resource):
    @foodmanager.marshal_with(lebensmitteleintrag, code=200)
    # Wir erwarten ein Lebensmitteleintrag-Objekt von Client-Seite.
    @foodmanager.expect(lebensmitteleintrag)
    #@secured
    def post(self):
        """Anlegen eines neuen Lebensmitteleintrag-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        So ist zum Beispiel die Vergabe der ID nicht Aufgabe des Clients.
        Selbst wenn der Client eine ID in dem Proposal vergeben sollte, so
        liegt es an der LebensmitteleintragAdministration (Businesslogik), eine korrekte ID
        zu vergeben. *Das korrigierte Objekt wird schließlich zurückgegeben.*
        """
        adm = LebensmitteleintragAdministration()

        proposal = Lebensmitteleintrag.from_dict(api.payload)

        """RATSCHLAG: Prüfen Sie stets die Referenzen auf valide Werte, bevor Sie diese verwenden!"""
        if proposal is not None:
            """ Wir verwenden lediglich Vor- und Nachnamen des Proposals für die Erzeugung
            eines Lebensmitteleintrag-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird auch dem Client zurückgegeben. 
            """
            l = adm.create_lebensmitteleintrag(
                proposal.get_aufbewahr_id(), proposal.get_aufbewahr_ort(), proposal.get_lebensmittel_id(), proposal.get_menge_id())
            return l, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500
@foodmanager.route('/lebensmitteleintrag/<int:id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class LebensmitteleintragenOperationen(Resource):
    @foodmanager.marshal_list_with(lebensmitteleintrag)
    #@secured
    def get(self, id):
        """Auslesen aller Lebensmitteleintrag-Objekte.

        Sollten keine Lebensmitteleintrag-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = LebensmitteleintragAdministration()
        lebensmitteleintrag = adm.get_lebensmitteleintrag_by_id(id)
        return lebensmitteleintrag
            
    @foodmanager.marshal_with(lebensmitteleintrag)
    @foodmanager.expect(lebensmitteleintrag, validate=True)
    #@secured
    def put(self, id):
        """Update eines bestimmten Lebensmitteleintrag-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Lebensmitteleintrag-Objekts.
        """
        adm = LebensmitteleintragAdministration()
        l = Lebensmitteleintrag.from_dict(api.payload)

        if l is not None:
            """Hierdurch wird die id des zu überschreibenden (vgl. Update) Lebensmitteleintrag-Objekts gesetzt.
            Siehe Hinweise oben.
            """
            l.set_id(id)
            l = adm.update_lebensmitteleintrag(l)
            return l, 200
        else:
            return '', 500
@foodmanager.route('/lebensmitteleintrag-delete/<int:id>/<string:is_einkaufsliste>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class LebensmitteleintragenOperationen(Resource):
    #@secured
    def delete(self, id, is_einkaufsliste):
        """Löschen eines bestimmten Lebensmitteleintrag-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = LebensmitteleintragAdministration()
        lebensmitteleintrag = adm.get_lebensmitteleintrag_by_id(id)
        adm.delete_lebensmitteleintrag(lebensmitteleintrag, is_einkaufsliste)
        return '', 200
@foodmanager.route('/lebensmitteleintrag/<int:aufbewahr_id>/<string:aufbewahr_ort>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class LebensmitteleintragenOperationen(Resource):
    @foodmanager.marshal_list_with(lebensmitteleintrag)
    #@secured
    def get(self, aufbewahr_id, aufbewahr_ort):
        """Auslesen aller Lebensmitteleintrag-Objekte.

        Sollten keine Lebensmitteleintrag-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = LebensmitteleintragAdministration()
        lebensmitteleintrag = adm.get_lebensmittel_eingtrag_by_aufbewahr_ort( aufbewahr_id, aufbewahr_ort)
        return lebensmitteleintrag
        """LEBENSMITTEL ROUTEN"""
@foodmanager.route('/lebensmittel')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class LebensmittelnOperationen(Resource):
    @foodmanager.marshal_with(lebensmittel, code=200)
    # Wir erwarten ein Lebensmittel-Objekt von Client-Seite.
    @foodmanager.expect(lebensmittel)
    #@secured
    def post(self):
        """Anlegen eines neuen Lebensmittel-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        So ist zum Beispiel die Vergabe der ID nicht Aufgabe des Clients.
        Selbst wenn der Client eine ID in dem Proposal vergeben sollte, so
        liegt es an der LebensmittelAdministration (Businesslogik), eine korrekte ID
        zu vergeben. *Das korrigierte Objekt wird schließlich zurückgegeben.*
        """
        adm = LebensmittelAdministration()

        proposal = Lebensmittel.from_dict(api.payload)

        """RATSCHLAG: Prüfen Sie stets die Referenzen auf valide Werte, bevor Sie diese verwenden!"""
        if proposal is not None:
            """ Wir verwenden lediglich Vor- und Nachnamen des Proposals für die Erzeugung
            eines Lebensmittel-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird auch dem Client zurückgegeben. 
            """
            l = adm.create_lebensmittel(
                proposal.get_bezeichnung(), proposal.get_ersteller_id())
            return l, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500
    @foodmanager.marshal_list_with(lebensmittel)
    #@secured
    def get(self):
        """Auslesen aller Lebensmittel-Objekte.

        Sollten keine Lebensmittel-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = LebensmittelAdministration()
        lebensmittel = adm.get_all_lebensmittel()
        return lebensmittel
@foodmanager.route('/lebensmittel/<int:id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class LebensmittelenOperationen(Resource):
    @foodmanager.marshal_list_with(lebensmittel)
    #@secured
    def get(self, id):
        """Auslesen aller Lebensmittel-Objekte.

        Sollten keine Lebensmittel-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = LebensmittelAdministration()
        lebensmittel = adm.get_lebensmittel_by_id(id)
        return lebensmittel
                        
    @foodmanager.marshal_with(lebensmittel)
    @foodmanager.expect(lebensmittel, validate=True)
    #@secured
    def put(self, id):
        """Update eines bestimmten Lebensmittel-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Lebensmittel-Objekts.
        """
        adm = LebensmittelAdministration()
        l = Lebensmittel.from_dict(api.payload)

        if l is not None:
            """Hierdurch wird die id des zu überschreibenden (vgl. Update) Lebensmittel-Objekts gesetzt.
            Siehe Hinweise oben.
            """
            l.set_id(id)
            adm.update_lebensmittel(l)
            return '', 200
        else:
            return '', 500
    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Lebensmittel-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = LebensmittelAdministration()
        lebensmittel = adm.get_lebensmittel_by_id(id)
        adm.delete_lebensmittel(lebensmittel)
        return '', 200
"""KUEHLSCHRANK ROUTEN"""
@foodmanager.route('/kuehlschrank')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class KuehlschranknOperationen(Resource):
    @foodmanager.marshal_with(kuehlschrank, code=200)
    # Wir erwarten ein Kuehlschrank-Objekt von Client-Seite.
    @foodmanager.expect(kuehlschrank)
    #@secured
    def post(self):
        """Anlegen eines neuen Kuehlschrank-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        So ist zum Beispiel die Vergabe der ID nicht Aufgabe des Clients.
        Selbst wenn der Client eine ID in dem Proposal vergeben sollte, so
        liegt es an der KuehlschrankAdministration (Businesslogik), eine korrekte ID
        zu vergeben. *Das korrigierte Objekt wird schließlich zurückgegeben.*
        """
        adm = KuehlschrankAdministration()

        proposal = Kuehlschrank.from_dict(api.payload)

        """RATSCHLAG: Prüfen Sie stets die Referenzen auf valide Werte, bevor Sie diese verwenden!"""
        if proposal is not None:
            """ Wir verwenden lediglich Vor- und Nachnamen des Proposals für die Erzeugung
            eines Kuehlschrank-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird auch dem Client zurückgegeben. 
            """
            k = adm.create_kuehlschrank(
                proposal.get_haushalt_id())
            return k, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500
@foodmanager.route('/kuehlschrank/<int:haushalt_id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class KuehlschrankenOperationen(Resource):
    @foodmanager.marshal_list_with(kuehlschrank)
    #@secured
    def get(self, haushalt_id):
        """Auslesen aller Kuehlschrank-Objekte.

        Sollten keine Kuehlschrank-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = KuehlschrankAdministration()
        kuehlschrank = adm.get_kuehlschrank_by_haushalt_id(haushalt_id)
        return kuehlschrank
                                                
    @foodmanager.marshal_with(kuehlschrank)
    @foodmanager.expect(kuehlschrank, validate=True)
    #@secured
    def put(self, id):
        """Update eines bestimmten Kuehlschrank-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Kuehlschrank-Objekts.
        """
        adm = KuehlschrankAdministration()
        k = Kuehlschrank.from_dict(api.payload)

        if k is not None:
            """Hierdurch wird die id des zu überschreibenden (vgl. Update) Kuehlschrank-Objekts gesetzt.
            Siehe Hinweise oben.
            """
            k.set_id(id)
            adm.update_kuehlschrank(k)
            return '', 200
        else:
            return '', 500
    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Kuehlschrank-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = KuehlschrankAdministration()
        kuehlschrank = adm.get_kuehlschrank_by_id(id)
        adm.delete_kuehlschrank(kuehlschrank)
        return '', 200
   
    """HAUSHALTSMITGLIED ROUTEN"""
# Definiere die Route '/haushaltsmitglied' für den Food Manager mit möglichen 500er Fehlerantworten.
@foodmanager.route('/haushaltsmitglied')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class HaushaltsmitgliednOperationen(Resource):
    # Definiere die POST-Methode für das Anlegen eines neuen Haushaltsmitglied-Objekts.
    @foodmanager.marshal_with(haushaltsmitglied, code=200)
    # Wir erwarten ein Haushaltsmitglied-Objekt von Client-Seite.
    @foodmanager.expect(haushaltsmitglied)
    #@secured
    def post(self):
        """Anlegen eines neuen Haushaltsmitglied-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        So ist zum Beispiel die Vergabe der ID nicht Aufgabe des Clients.
        Selbst wenn der Client eine ID in dem Proposal vergeben sollte, so
        liegt es an der HaushaltsmitgliedAdministration (Businesslogik), eine korrekte ID
        zu vergeben. *Das korrigierte Objekt wird schließlich zurückgegeben.*
        """
        # Erzeuge eine Instanz der HaushaltsmitgliedAdministration.
        adm = HaushaltsmitgliedAdministration()

        # Extrahiere das Haushaltsmitglied-Objekt aus den Daten, die der Client gesendet hat.
        proposal = Haushaltsmitglied.from_dict(api.payload)

        """RATSCHLAG: Prüfen Sie stets die Referenzen auf valide Werte, bevor Sie diese verwenden!"""
        if proposal is not None:
            """ Wir verwenden lediglich Vor- und Nachnamen des Proposals für die Erzeugung
            eines Haushaltsmitglied-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird auch dem Client zurückgegeben. 
            """
            # Erzeuge ein Haushaltsmitglied-Objekt mit Vor- und Nachnamen aus dem Proposal.
            h = adm.create_haushaltsmitglied(
                proposal.get_person_id(), proposal.get_haushalt_id())
            return h, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500
@foodmanager.route('/haushaltsmitglied/<int:id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class HaushaltsmitgliedenOperationen(Resource):
    @foodmanager.marshal_list_with(haushaltsmitglied)
    #@secured
    def get(self, id):
        """Auslesen aller Haushaltsmitglied-Objekte.

        Sollten keine Haushaltsmitglied-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = HaushaltsmitgliedAdministration()
        haushaltsmitglied = adm.get_haushaltsmitglied_by_id(id)
        return haushaltsmitglied
                                                
    @foodmanager.marshal_with(haushaltsmitglied)
    @foodmanager.expect(haushaltsmitglied, validate=True)
    #@secured
    def put(self, id):
        """Update eines bestimmten Haushaltsmitglied-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Haushaltsmitglied-Objekts.
        """
        adm = HaushaltsmitgliedAdministration()
        h = Haushaltsmitglied.from_dict(api.payload)

        if h is not None:
            """Hierdurch wird die id des zu überschreibenden (vgl. Update) Haushaltsmitglied-Objekts gesetzt.
            Siehe Hinweise oben.
            """
            h.set_id(id)
            adm.update_haushaltsmitglied(h)
            return '', 200
        else:
            return '', 500
    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Haushaltsmitglied-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = HaushaltsmitgliedAdministration()
        haushaltsmitglied = adm.get_haushaltsmitglied_by_id(id)
        adm.delete_haushaltsmitglied(haushaltsmitglied)
        return '', 200
    
@foodmanager.route('/haushaltsmitglied/person/<int:person_id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class HaushaltsmitgliedenOperationen(Resource):
    @foodmanager.marshal_list_with(haushaltsmitglied)
    #@secured
    def get(self, person_id):
        """Auslesen aller Haushaltsmitglied-Objekte.

        Sollten keine Haushaltsmitglied-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = HaushaltsmitgliedAdministration()
        haushaltsmitglied = adm.get_haushaltsmitglied_by_person_id(person_id)
        return haushaltsmitglied
                      
    
@foodmanager.route('/haushaltsmitglied/haushalt/<int:haushalt_id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class HaushaltsmitgliedenOperationen(Resource):
    @foodmanager.marshal_list_with(haushaltsmitglied)
    #@secured
    def get(self, haushalt_id):
        """Auslesen aller Haushaltsmitglied-Objekte.

        Sollten keine Haushaltsmitglied-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = HaushaltsmitgliedAdministration()
        haushaltsmitglied = adm.get_haushaltsmitglied_by_haushalt_id(haushalt_id)
        return haushaltsmitglied

@foodmanager.route('/haushalt')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class HaushaltnOperationen(Resource):
    @foodmanager.marshal_with(haushalt, code=200)
    # Wir erwarten ein Haushalt-Objekt von Client-Seite.
    @foodmanager.expect(haushalt)
    #@secured
    def post(self):
        """Anlegen eines neuen Haushalt-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        So ist zum Beispiel die Vergabe der ID nicht Aufgabe des Clients.
        Selbst wenn der Client eine ID in dem Proposal vergeben sollte, so
        liegt es an der HaushaltAdministration (Businesslogik), eine korrekte ID
        zu vergeben. *Das korrigierte Objekt wird schließlich zurückgegeben.*
        """
        adm = HaushaltAdministration()

        proposal = Haushalt.from_dict(api.payload)

        """RATSCHLAG: Prüfen Sie stets die Referenzen auf valide Werte, bevor Sie diese verwenden!"""
        if proposal is not None:
            """ Wir verwenden lediglich Vor- und Nachnamen des Proposals für die Erzeugung
            eines Haushalt-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird auch dem Client zurückgegeben. 
            """
            h = adm.create_haushalt_with_pantry(
                proposal.get_name(), proposal.get_owner_id())
            return h, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500
    
@foodmanager.route('/haushalt-alle/<int:person_id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class HaushaltenOperationen(Resource):

    @foodmanager.marshal_list_with(haushalt)
    #@secured
    def get(self, person_id):
        """Auslesen aller Haushalt-Objekte.

        Sollten keine Haushalt-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = HaushaltAdministration()
        haushalt = adm.get_alle_haushalt(person_id)
        return haushalt
            
@foodmanager.route('/haushalt/<int:id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class HaushaltenOperationen(Resource):
    @foodmanager.marshal_list_with(haushalt)
    #@secured
    def get(self, id):
        """Auslesen aller Haushalt-Objekte.

        Sollten keine Haushalt-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = HaushaltAdministration()
        haushalt = adm.get_haushalt_by_id(id)
        return haushalt
                                                    
    @foodmanager.marshal_with(haushalt)
    @foodmanager.expect(haushalt, validate=True)
    #@secured
    def put(self, id):
        """Update eines bestimmten Haushalt-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Haushalt-Objekts.
        """
        adm = HaushaltAdministration()
        h = Haushalt.from_dict(api.payload)

        if h is not None:
            """Hierdurch wird die id des zu überschreibenden (vgl. Update) Haushalt-Objekts gesetzt.
            Siehe Hinweise oben.
            """
            h.set_id(id)
            adm.update_haushalt(h)
            return '', 200
        else:
            return '', 500
    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Haushalt-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = HaushaltAdministration()
        haushalt = adm.get_haushalt_by_id(id)
        adm.delete_haushalt(haushalt)
        return '', 200
@foodmanager.route('/einkaufsliste')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class EinkaufslistenOperationen(Resource):
    @foodmanager.marshal_with(einkaufsliste, code=200)
    # Wir erwarten ein Einkaufsliste-Objekt von Client-Seite.
    @foodmanager.expect(einkaufsliste)
    #@secured
    def post(self):
        """Anlegen eines neuen Einkaufsliste-Objekts.

        **ACHTUNG:** Wir fassen die vom Client gesendeten Daten als Vorschlag auf.
        So ist zum Beispiel die Vergabe der ID nicht Aufgabe des Clients.
        Selbst wenn der Client eine ID in dem Proposal vergeben sollte, so
        liegt es an der EinkaufslisteAdministration (Businesslogik), eine korrekte ID
        zu vergeben. *Das korrigierte Objekt wird schließlich zurückgegeben.*
        """
        adm = EinkaufslisteAdministration()

        proposal = Einkaufsliste.from_dict(api.payload)

        """RATSCHLAG: Prüfen Sie stets die Referenzen auf valide Werte, bevor Sie diese verwenden!"""
        if proposal is not None:
            """ Wir verwenden lediglich Vor- und Nachnamen des Proposals für die Erzeugung
            eines Einkaufsliste-Objekts. Das serverseitig erzeugte Objekt ist das maßgebliche und 
            wird auch dem Client zurückgegeben. 
            """
            e = adm.create_einkaufsliste(
                proposal.get_haushalt_id())
            return e, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500
@foodmanager.route('/einkaufsliste/<int:haushalt_id>')
@foodmanager.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class EinkaufslisteenOperationen(Resource):
    @foodmanager.marshal_list_with(einkaufsliste)
    #@secured
    def get(self, haushalt_id):
        """Auslesen aller Einkaufsliste-Objekte.

        Sollten keine Einkaufsliste-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = EinkaufslisteAdministration()
        einkaufsliste = adm.get_einkaufsliste_by_haushalt_id(haushalt_id)
        return einkaufsliste
                                                    
    @foodmanager.marshal_with(einkaufsliste)
    @foodmanager.expect(einkaufsliste, validate=True)
    #@secured
    def put(self, id):
        """Update eines bestimmten Einkaufsliste-Objekts.

        **ACHTUNG:** Relevante id ist die id, die mittels URI bereitgestellt und somit als Methodenparameter
        verwendet wird. Dieser Parameter überschreibt das ID-Attribut des im Payload der Anfrage übermittelten
        Einkaufsliste-Objekts.
        """
        adm = EinkaufslisteAdministration()
        e = Einkaufsliste.from_dict(api.payload)

        if e is not None:
            """Hierdurch wird die id des zu überschreibenden (vgl. Update) Einkaufsliste-Objekts gesetzt.
            Siehe Hinweise oben.
            """
            e.set_id(id)
            adm.update_einkaufsliste(e)
            return '', 200
        else:
            return '', 500
    #@secured
    def delete(self, id):
        """Löschen eines bestimmten Einkaufsliste-Objekts.

        Das zu löschende Objekt wird durch die ```id``` in dem URI bestimmt.
        """
        adm = EinkaufslisteAdministration()
        einkaufsliste = adm.get_einkaufsliste_by_id(id)
        adm.delete_einkaufsliste(einkaufsliste)
        return '', 200

if __name__ == '__main__':
    app.run(debug=True)
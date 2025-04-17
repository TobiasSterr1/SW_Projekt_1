import mysql.connector as connector
import os
from contextlib import AbstractContextManager
from abc import ABC, abstractmethod
from dotenv import load_dotenv

load_dotenv() # take environment variables from .env.

'''
Abstrakte Basisklasse aller Mapper-Klassen
'''
class  Mapper (AbstractContextManager,ABC):


    def __init__(self):
        self._cnx = None

    '''Was soll geschehen, wenn wir beginnen, mit dem Mapper zu arbeiten?'''
    def __enter__(self):

        """Wir testen, ob der Code im Kontext der lokalen Entwicklungsumgebung oder in der Cloud ausgeführt wird.
        Dies ist erforderlich, da die Modalitäten für den Verbindungsaufbau mit der Datenbank kontextabhängig sind."""

        if os.getenv('GAE_ENV', '').startswith('standard'):
            """Landen wir in diesem Zweig, so haben wir festgestellt, dass der Code in der Cloud abläuft.
            Die App befindet sich somit im **Production Mode** und zwar im *Standard Environment*.
            Hierbei handelt es sich also um die Verbindung zwischen Google App Engine und Cloud SQL."""

            self._cnx = connector.connect(user='root', password='root',
                                          unix_socket='/cloudsql/python-foodmanager:europe-west3:foodmanager-db',
                                          database='foodmanager')
        else:
            """Wenn wir hier ankommen, dann handelt sich offenbar um die Ausführung des Codes in einer lokalen Umgebung,
            also auf einem Local Development Server. Hierbei stellen wir eine einfache Verbindung zu einer lokal
            installierten mySQL-Datenbank her."""

            self._cnx = connector.connect(user='root', password="root",
                                  host='127.0.0.1',
                                  database='foodmanager')

        return self

    '''Was soll geschehen, wenn wir (evtl. vorübergehend) aufhören, mit dem Mapper zu arbeiten?'''
    def __exit__(self, exc_type, exc_val, exc_tb):
        self._cnx.close()
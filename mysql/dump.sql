-- Erstelle die Datenbank, falls sie noch nicht existiert
CREATE DATABASE  IF NOT EXISTS `foodmanager` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `foodmanager`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: foodmanager
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@SQL_NOTES, SQL_NOTES=0 */;

--
-- Tabellenstruktur für Tabelle `person`
--
DROP TABLE IF EXISTS `person`;                                -- Löscht die Tabelle `person`, falls sie bereits existiert
/*!40101 SET @saved_cs_client     = @character_set_client */; -- Setzt die Variable @saved_cs_client auf den Wert von @character_set_client
/*!40101 SET character_set_client = utf8 */;                  -- Setzt den Client-Zeichensatz auf UTF-8
CREATE TABLE `person` (
  `id` int(11) NOT NULL DEFAULT '0',                          -- Spalte für die ID mit Standardwert 0
  `haushalt_id` int(11) NOT NULL DEFAULT '0',                 -- Spalte für die Haushalts-ID mit Standardwert 0
  `zeitstempel` varchar(45) NOT NULL DEFAULT '',              -- Spalte für den Zeitstempel als VARCHAR mit Leerstandardwert
  `google_user_id` varchar(45) NOT NULL DEFAULT '',           -- Spalte für die Google-Benutzer-ID als VARCHAR mit Leerstandardwert
  `email` varchar(45) NOT NULL DEFAULT '',                    -- Spalte für die E-Mail-Adresse als VARCHAR mit Leerstandardwert
  `benutzername` varchar(70) NOT NULL DEFAULT '',             -- Spalte für den Benutzernamen als VARCHAR mit Leerstandardwert
  `firstname` varchar(70) NOT NULL DEFAULT '',                -- Spalte für den Vornamen als VARCHAR mit Leerstandardwert
  `lastname` varchar(70) NOT NULL DEFAULT '',                 -- Spalte für den Nachnamen als VARCHAR mit Leerstandardwert
  PRIMARY KEY (`id`)                                          -- Definiert die ID-Spalte als Primärschlüssel
) ENGINE=InnoDB DEFAULT CHARSET=utf8;                         -- Verwendet InnoDB als Storage Engine und UTF-8 als Zeichensatz

--
-- Daten für Tabelle `person` werden gedumpt
--
LOCK TABLES `person` WRITE;                                   -- Sperrt die Tabelle `person` für Schreibvorgänge, um Datenkonsistenz zu gewährleisten
/*!40000 ALTER TABLE `person` DISABLE KEYS */;                -- Deaktiviert temporär die Indizes für die Tabelle `person`, um schnellere Massenoperationen zu ermöglichen
/*!40000 ALTER TABLE `person` ENABLE KEYS */;                 -- Reaktiviert die Indizes für die Tabelle `person`
UNLOCK TABLES;                                                -- Hebt die Sperre für die Tabelle `person` auf
-- Tabellenstruktur für Tabelle `haushalts_mitglied`
DROP TABLE IF EXISTS `haushalts_mitglied`;  -- Löscht die Tabelle `haushalts_mitglied`, falls sie bereits existiert
/*!40101 SET @saved_cs_client     = @character_set_client */;  -- Setzt die Variable @saved_cs_client auf den aktuellen Wert von @character_set_client
/*!40101 SET character_set_client = utf8 */;  -- Setzt den Client-Zeichensatz auf UTF-8

--
-- Tabellenstruktur für Tabelle `haushalts_mitglied`
--
CREATE TABLE `haushalts_mitglied` (
  `id` int(11) NOT NULL DEFAULT '0',                      -- Spalte für die ID mit Standardwert 0
  `zeitstempel` varchar(45) NOT NULL DEFAULT '',          -- Spalte für den Zeitstempel als VARCHAR mit Leerstandardwert
  `person_id` int(11) NOT NULL DEFAULT '0',               -- Spalte für die Personen-ID mit Standardwert 0
  `haushalt_id` int(11) NOT NULL DEFAULT '0',             -- Spalte für die Haushalt-ID mit Standardwert 0
  PRIMARY KEY (`id`)                                      -- Definiert die ID-Spalte als Primärschlüssel
) ENGINE=InnoDB DEFAULT CHARSET=utf8;                     -- Verwendet InnoDB als Storage Engine und UTF-8 als Zeichensatz
--
-- Daten für Tabelle `haushalts_mitglied` werden gedumpt
--
LOCK TABLES `haushalts_mitglied` WRITE;                     -- Sperrt die Tabelle `haushalts_mitglied` für Schreibvorgänge, um Datenkonsistenz zu gewährleisten
/*!40000 ALTER TABLE `haushalts_mitglied` DISABLE KEYS */;  -- Deaktiviert temporär die Indizes für die Tabelle `haushalts_mitglied`, um schnellere Massenoperationen zu ermöglichen
/*!40000 ALTER TABLE `haushalts_mitglied` ENABLE KEYS */;   -- Reaktiviert die Indizes für die Tabelle `haushalts_mitglied`
UNLOCK TABLES;                                              -- Hebt die Sperre für die Tabelle `haushalts_mitglied` auf

--
-- Tabellenstruktur für Tabelle `haushalt`
--
DROP TABLE IF EXISTS `haushalt`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `haushalt` (
  `id` int(11) NOT NULL DEFAULT '0',
  `zeitstempel` varchar(45) NOT NULL DEFAULT '',
  `name` varchar(70) NOT NULL DEFAULT '',
  `owner_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `haushalt` werden gedumpt
--
LOCK TABLES `haushalt` WRITE;
/*!40000 ALTER TABLE `haushalt` DISABLE KEYS */;
/*!40000 ALTER TABLE `haushalt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Tabellenstruktur für Tabelle `rezept`
--
DROP TABLE IF EXISTS `rezept`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rezept` (
  `id` int(11) NOT NULL DEFAULT '0',
  `zeitstempel` varchar(45) NOT NULL DEFAULT '',
  `eigentuemer_id` int(11) NOT NULL DEFAULT '0',
  `haushalt_id` int(11) NOT NULL DEFAULT '0',
  `anzahl_personen` int(11) NOT NULL DEFAULT '0',
  `zubereitung` varchar(2000) NOT NULL DEFAULT '',
  `name` varchar(555) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `rezept` werden gedumpt
--
LOCK TABLES `rezept` WRITE;
/*!40000 ALTER TABLE `rezept` DISABLE KEYS */;
/*!40000 ALTER TABLE `rezept` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Tabellenstruktur für Tabelle `einkaufsliste`
--
DROP TABLE IF EXISTS `einkaufsliste`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `einkaufsliste` (
  `id` int(11) NOT NULL DEFAULT '0',
  `zeitstempel` varchar(45) NOT NULL DEFAULT '',
  `haushalt_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `einkaufsliste` werden gedumpt
--
LOCK TABLES `einkaufsliste` WRITE;
/*!40000 ALTER TABLE `einkaufsliste` DISABLE KEYS */;
/*!40000 ALTER TABLE `einkaufsliste` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Tabellenstruktur für Tabelle `kuehlschrank`
--
DROP TABLE IF EXISTS `kuehlschrank`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kuehlschrank` (
  `id` int(11) NOT NULL DEFAULT '0',
  `zeitstempel` varchar(45) NOT NULL DEFAULT '',
  `haushalt_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `kuehlschrank` werden gedumpt
--
LOCK TABLES `kuehlschrank` WRITE;
/*!40000 ALTER TABLE `kuehlschrank` DISABLE KEYS */;
/*!40000 ALTER TABLE `kuehlschrank` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Tabellenstruktur für Tabelle `lebensmittel_eintrag`
--
DROP TABLE IF EXISTS `lebensmittel_eintrag`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lebensmittel_eintrag` (
  `id` int(11) NOT NULL DEFAULT '0',
  `zeitstempel` varchar(45) NOT NULL DEFAULT '',
  `aufbewahr_id` int(11) NOT NULL DEFAULT '0',
  `aufbewahr_ort` varchar(70) NOT NULL DEFAULT '',
  `lebensmittel_id` int(11) NOT NULL DEFAULT '0',
  `menge_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `lebensmittel_eintrag` werden gedumpt
--
LOCK TABLES `lebensmittel_eintrag` WRITE;
/*!40000 ALTER TABLE `lebensmittel_eintrag` DISABLE KEYS */;
/*!40000 ALTER TABLE `lebensmittel_eintrag` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Tabellenstruktur für Tabelle `lebensmittel`
--
DROP TABLE IF EXISTS `lebensmittel`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lebensmittel` (
  `id` int(11) NOT NULL DEFAULT '0',
  `zeitstempel` varchar(45) NOT NULL DEFAULT '',
  `bezeichnung` varchar(140) NOT NULL DEFAULT '',
  `ersteller_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `lebensmittel` werden gedumpt
--
LOCK TABLES `lebensmittel` WRITE;
/*!40000 ALTER TABLE `lebensmittel` DISABLE KEYS */;
/*!40000 ALTER TABLE `lebensmittel` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Tabellenstruktur für Tabelle `menge`
--
DROP TABLE IF EXISTS `menge`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menge` (
  `id` int(11) NOT NULL DEFAULT '0',
  `zeitstempel` varchar(45) NOT NULL DEFAULT '',
  `mengenanzahl` float(11) NOT NULL DEFAULT '0',
  `masseinheit_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `menge` werden gedumpt
--
LOCK TABLES `menge` WRITE;
/*!40000 ALTER TABLE `menge` DISABLE KEYS */;
/*!40000 ALTER TABLE `menge` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Tabellenstruktur für Tabelle `masseinheit`
--
DROP TABLE IF EXISTS `masseinheit`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `masseinheit` (
  `id` int(11) NOT NULL DEFAULT '0',
  `zeitstempel` varchar(45) NOT NULL DEFAULT '',
  `bezeichnung` varchar(70) NOT NULL DEFAULT '',
  `umrechnungs_wert` float(11) NOT NULL DEFAULT '0',
  `ist_volumen` tinyint(1) NOT NULL DEFAULT '0',
  `eigentuemer_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `masseinheit` werden gedumpt
--
LOCK TABLES `masseinheit` WRITE;
/*!40000 ALTER TABLE `masseinheit` DISABLE KEYS */;
/*!40000 ALTER TABLE `masseinheit` ENABLE KEYS */;
UNLOCK TABLES;
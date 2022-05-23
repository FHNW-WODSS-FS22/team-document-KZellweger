# Google Docs Light : Schmucki, Villing, Zellweger
Dieses Projekt ist das Resultat des Workshop Web der FHNW. 

Die Umsetzung aller Projektartefakte wurden kollaborativ erstellt und alle Teammitglieder hatten einen Anteil an den Teilresultaten. 

Die Hauptverantwortlichkeiten wurden wie folgt aufgeteilt:

* Peter Schmucki: Lead Frontend, Frontend & E2E Tests
* Kevin Zellweger: Lead Redux Integration, Infrastruktur
* Joshua Villing: Lead Backend, Backend Tests

## Öffentlicher Server Zugang
Der Lösungsstand der Applikation ist öffentlich erreichbar. 

* URL: https://test-pebs.ch
* Username: User
* Password: FHNW-woweb

## Lokale Umgebung
Die Lokale Entwicklungsumgebung muss in der untenstehenden Reihenfolge gestartet werden.

### Voraussetzungen 
Die lokale Umgebung benötigt folgenden Abhängigkeiten:

* Java JDK 11
* Node JS >= 16
* Yarn >= 1.22.10
* Docker >= 20.10.14
* Docker-Compose >= 1.29.2

### Starten der lokalen Datenbank
Navigieren Sie zu `backend/TeamDocumentServer/docker/local` und starten Sie den DB-Container mit `docker-compose up -d`

### Starten des lokalen Backends
Navigieren Sie zu `backend/TeamDocumentServer/` und starten Sie den Server mit `./gradlew bootRun --args='--spring.profiles.active=local'`

### Starten des lokalen Frontends
Navigieren Sie zu `/frontend/teamdocument` und laden Sie die Dependencies mit `yarn install`
Anschliessend starten sie das Frontend mit `yarn start`

## Tests Ausführen

### Backend Tests
Die Backend Unit- und Integration Tests können mit `./gradlew test` im directory `backend/TeamDocumentServer/` gestartet werden. 
Der Result-Report wird unter `backend/TeamDocumentServer/build/reports/tests/test/index.html` gespeichert. 


### Frontend Tests
Die Frontend Unit-Tests können mit `yarn test` gestartet werden. 

### End to End Tests
Um die End to End Tests auszuführen, muss die gesamte lokale Entwicklungsumgebung gestartet werden. 
Sind alle 3 Komponenten bereit, kann mit `yarn e2e` Cypress gestartet werden. 

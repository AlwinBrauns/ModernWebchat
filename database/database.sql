-- psql
-- Datenbank für Webchat erstellen
CREATE DATABASE Webchat WITH ENCODING 'UTF8';
-- mit "\c webchat" zur Datenbank navigieren

-- Tabelle Accounts erstellen
CREATE TABLE Accounts (
    ID SERIAL PRIMARY KEY,
    Username VARCHAR(256) NOT NULL,
    pw VARCHAR(256) NOT NULL,
    bildpfad TEXT
);

-- Testeintrag
INSERT INTO Accounts (Username, pw, bildpfad)
VALUES ('Mustermann', '123', './imgs/default-avatar.png');

-- Testabfrage
SELECT * FROM Accounts;
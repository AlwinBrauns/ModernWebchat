-- psql
-- Datenbank für Webchat erstellen
CREATE DATABASE Webchat WITH ENCODING 'UTF8';
-- mit "\c webchat" zur Datenbank navigieren
\c webchat

-- Tabelle Accounts erstellen
CREATE TABLE Accounts (
    ID SERIAL PRIMARY KEY,
    Username VARCHAR(256) NOT NULL,
    pw VARCHAR(256) NOT NULL,
    bildpfad TEXT
);

-- Tabelle Groups erstellen
CREATE TABLE Groups (
    ID SERIAL PRIMARY KEY,
    groupname VARCHAR(256) NOT NULL
);

-- Defaultgruppe erstellen
INSERT INTO Groups (groupname)
VALUES ('default');

-- Zuweisungstabelle Groups <=> Accounts "Gruppenteilnehmer"
CREATE TABLE Gruppenteilnehmer (
    ID SERIAL PRIMARY KEY,

    Group_ID INTEGER NOT NULL,
    FOREIGN KEY(Group_ID) 
    REFERENCES Groups(ID),

    Account_ID INTEGER NOT NULL,
    FOREIGN KEY(Account_ID) 
    REFERENCES Accounts(ID)
);

-- Tabelle "Messages" erstellen
CREATE TABLE Messages (
    ID SERIAL PRIMARY KEY,
    msg TEXT NOT NULL,
    datum TIMESTAMP WITH TIME ZONE NOT NULL,
    ToGroup_ID INTEGER NOT NULL,
    FOREIGN KEY(ToGroup_ID) 
    REFERENCES Groups(ID),

    FROM_ID INTEGER NOT NULL,
    FOREIGN KEY(FROM_ID) 
    REFERENCES Accounts(ID)
);




-- Testnutzer mit sha256 pw (a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3)
INSERT INTO Accounts (Username, pw, bildpfad)
VALUES ('Gast', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', './imgs/default-avatar.png');
INSERT INTO Gruppenteilnehmer (
    Group_ID,
    Account_ID
) VALUES (
    1,
    1
);

-- Testeintrag in Messages UTC+2
INSERT INTO Messages (msg, datum, ToGroup_ID, FROM_ID)
VALUES (
    'Die erste Nachricht der DB!',
    '2021-05-15 21:50:00+02',
    1,
    1
);


-- Testabfrage Alle
SELECT * FROM Accounts;
SELECT * FROM Groups;
SELECT * FROM Gruppenteilnehmer;
SELECT * FROM Messages;


-- Nachrichten löschen:
-- DELETE FROM messages;
-- ALTER SEQUENCE messages_id_seq RESTART WITH 1;

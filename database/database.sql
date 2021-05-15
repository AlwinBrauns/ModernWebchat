-- psql
-- Datenbank für Webchat erstellen
CREATE DATABASE Webchat WITH ENCODING 'UTF8';
-- mit "\c webchat" zur Datenbank navigieren
-- \c webchat

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

-- Testabfrage Accounts
SELECT * FROM Accounts;

-- Tabelle Groups erstellen
CREATE TABLE Groups (
    ID SERIAL PRIMARY KEY,
    groupname VARCHAR(256) NOT NULL
);

-- Defaultgruppe erstellen
INSERT INTO Groups (groupname)
VALUES ('default');

-- Testabfrage Groups
SELECT * FROM Groups;

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

-- Testnutzer mit default-gruppe verbinden
INSERT INTO Gruppenteilnehmer (
    Group_ID,
    Account_ID
) VALUES (
    1,
    1
);

-- Testabfrage Gruppenteilnehmer
SELECT * FROM Gruppenteilnehmer;

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

-- Testeintrag in Messages UTC+2
INSERT INTO Messages (msg, datum, ToGroup_ID, FROM_ID)
VALUES (
    'Die erste Nachricht der DB!',
    '2021-05-15 21:50:00+02',
    1,
    1
);

-- Testabfrage Messages
SELECT * FROM Messages;


-- Weitere Testeinträge
INSERT INTO Accounts (Username, pw, bildpfad)
VALUES ('Musterfrau', '321', './imgs/default-avatar.png');
INSERT INTO Groups (groupname)
VALUES ('geheim');
INSERT INTO Gruppenteilnehmer (
    Group_ID,
    Account_ID
) VALUES (
    2,
    2
);
INSERT INTO Gruppenteilnehmer (
    Group_ID,
    Account_ID
) VALUES (
    1,
    2
);
INSERT INTO Messages (msg, datum, ToGroup_ID, FROM_ID)
VALUES (
    'Die zweite Nachricht der DB!',
    '2021-05-15 21:50:05+02',
    2,
    2
);


-- Testabfrage Alle
SELECT * FROM Accounts;
SELECT * FROM Groups;
SELECT * FROM Gruppenteilnehmer;
SELECT * FROM Messages;

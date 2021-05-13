--Erstellen von Account-Tabelle
CREATE TABLE Accounts (
    accountID INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    profilbildpfad TEXT,
    userpasswort TEXT NOT NULL
);

--Erster Testaccount einfügen
INSERT INTO Accounts VALUES (0, "Mustermann", "./imgs/default-acatar.png", "123456");

--Abfrage aller Elemente in Accounts
SELECT * FROM Accounts;
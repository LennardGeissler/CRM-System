CREATE DATABASE [CRM-System]
GO

USE [CRM-System]
GO

CREATE TABLE Adressen (
    AdresseID INT PRIMARY KEY IDENTITY(1,1),
    Straße NVARCHAR(255),
    Stadt NVARCHAR(255),
    Region NVARCHAR(255),
    Postleitzahl NVARCHAR(10),
    Land NVARCHAR(255)
);
GO

CREATE TABLE Kunden (
    KundenID INT PRIMARY KEY IDENTITY(1,1),
    Kundenname NVARCHAR(255),
    AdresseID INT,
    Zahlungsinformationen NVARCHAR(255),
    FOREIGN KEY (AdresseID) REFERENCES Adressen(AdresseID)
);
GO

CREATE TABLE Mitarbeiter (
    MitarbeiterID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(255),
    HashedPasswort NVARCHAR(255),
    ProfilbildURL NVARCHAR(255),
    AdminRolle BIT
);
GO

CREATE TABLE Projekte (
    ProjektID INT PRIMARY KEY IDENTITY(1,1),
    Matchcode NVARCHAR(255),
    Status NVARCHAR(255),
    Projektnummer NVARCHAR(255),
    VerantwortlicherMitarbeiterID INT,
    RechnungsempfängerKundeID INT,
    FOREIGN KEY (VerantwortlicherMitarbeiterID) REFERENCES Mitarbeiter(MitarbeiterID),
    FOREIGN KEY (RechnungsempfängerKundeID) REFERENCES Kunden(KundenID)
);
GO

CREATE TABLE Software (
    SoftwareID INT PRIMARY KEY IDENTITY(1,1),
    KundeID INT,
    Beschreibung NVARCHAR(255),
    Version NVARCHAR(255),
    AusstehendeHotfixes NVARCHAR(255),
    SelfService BIT,
    AnsprechpartnerKundeID INT,
    MitarbeiterID INT,
    FOREIGN KEY (KundeID) REFERENCES Kunden(KundenID),
    FOREIGN KEY (AnsprechpartnerKundeID) REFERENCES Kunden(KundenID),
    FOREIGN KEY (MitarbeiterID) REFERENCES Mitarbeiter(MitarbeiterID)
);
GO

CREATE TABLE Bestellungen (
    BestellungsID INT PRIMARY KEY IDENTITY(1,1),
    Produkt NVARCHAR(255),
    Anzahl INT,
    Lieferdatum DATE,
    Lieferant NVARCHAR(255)
);
GO

CREATE TABLE Fahrtenbuch (
    FahrtID INT PRIMARY KEY IDENTITY(1,1),
    MitarbeiterID INT,
    Datum DATE,
    StartadresseID INT,
    ZieladresseID INT,
    Kilometer INT,
    FOREIGN KEY (MitarbeiterID) REFERENCES Mitarbeiter(MitarbeiterID),
    FOREIGN KEY (StartadresseID) REFERENCES Adressen(AdresseID),
    FOREIGN KEY (ZieladresseID) REFERENCES Adressen(AdresseID)
);
GO

CREATE TABLE Urlaub (
    UrlaubID INT PRIMARY KEY IDENTITY(1,1),
    MitarbeiterID INT,
    Beginn DATE,
    Ende DATE,
    Status NVARCHAR(255),
    FOREIGN KEY (MitarbeiterID) REFERENCES Mitarbeiter(MitarbeiterID)
);
GO
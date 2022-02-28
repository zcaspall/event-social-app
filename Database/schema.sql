CREATE TABLE IF NOT EXISTS Users (
    userID int PRIMARY KEY IDENTITY(1,1) NOT NULL,
    userName text NOT NULL,
    userPassword text NOT NULL UNIQUE,
    userEmail text NOT NULL,
    userPhone int,
);
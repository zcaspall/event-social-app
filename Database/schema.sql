-- Tables
CREATE TABLE IF NOT EXISTS Users (
    userID INTEGER PRIMARY KEY IDENTITY(1,1) NOT NULL,
    userName TEXT(20) NOT NULL,
    userPassword TEXT(20) NOT NULL UNIQUE,
    userEmail TEXT(20) NOT NULL,
    userPhone INTEGER
);

CREATE TABLE IF NOT EXISTS Locations (
    locationName TEXT(20) NOT NULL,
    zip INTEGER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    CONSTRAINT actualLocation PRIMARY KEY (locationName, zip)
);

CREATE TABLE IF NOT EXISTS Events (
    eventName TEXT(20) NOT NULL,
    eventDate TEXT(20) NOT NULL,
    eventLocation TEXT(20) FOREIGN KEY REFERENCES Locations(actualLocation),
    PRIMARY KEY (eventName, eventDate)
);

-- Relations

CREATE TABLE UsersGoingTo (
   userID INTEGER,
   eventName  TEXT(30),
   PRIMARY KEY (userID, eventName)
  );

CREATE TABLE FriendsWith (
   userID INTEGER,
   friendID  INTEGER,
   PRIMARY KEY (userID, friendID)
  );

CREATE TABLE StrikedUsers (
   userID INTEGER,
   strikedID  INTEGER,
   strikeNumber INTEGER,
   PRIMARY KEY (userID, friendID)
  );
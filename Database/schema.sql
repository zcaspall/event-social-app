-- Tables
CREATE TABLE IF NOT EXISTS Users (
    userID TEXT PRIMARY KEY NOT NULL,
    userName TEXT(20) UNIQUE NOT NULL,
    userPasswordHash TEXT(50) NOT NULL UNIQUE,
    userEmail TEXT(20) NOT NULL,
    userPhone INTEGER,
    strikes INTEGER DEFAULT 0
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
    eventLocation TEXT(20),
    FOREIGN KEY (eventLocation) REFERENCES Locations(actualLocation),
    PRIMARY KEY (eventName, eventDate)
);

-- Relations

CREATE TABLE IF NOT EXISTS UsersGoingTo (
   userID TEXT,
   eventName  TEXT(30),
   PRIMARY KEY (userID, eventName)
  );

CREATE TABLE IF NOT EXISTS FriendsWith (
   userID TEXT,
   friendID  TEXT,
   PRIMARY KEY (userID, friendID)
  );

CREATE TABLE IF NOT EXISTS StrikedUsers (
   userID TEXT,
   strikedID  TEXT,
   PRIMARY KEY (userID, strikedID)
  );
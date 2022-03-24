-- Tables
CREATE TABLE IF NOT EXISTS Users (
    userID TEXT PRIMARY KEY NOT NULL,
    userName TEXT(20) UNIQUE NOT NULL,
    userPasswordHash TEXT(50) NOT NULL UNIQUE,
    userEmail TEXT(20) NOT NULL,
    userPhone INTEGER
);

CREATE TABLE IF NOT EXISTS Locations (
    locationName TEXT(20) NOT NULL,
    zip INTEGER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    CONSTRAINT coordinates PRIMARY KEY (latitude, longitude)
);

CREATE TABLE IF NOT EXISTS Events (
    eventId TEXT PRIMARY KEY,
    eventName TEXT(20) NOT NULL,
    eventDate TEXT(20) NOT NULL,
    eventLocation TEXT(20),
    latitude INT NOT NULL,
    longitude INT NOT NULL,
    FOREIGN KEY (latitude) REFERENCES Locations(latitude),
    FOREIGN KEY (longitude) REFERENCES Locations(longitude)
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
   strikeNumber INTEGER,
   PRIMARY KEY (userID, strikedID)
  );
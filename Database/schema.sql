-- User tables
CREATE TABLE IF NOT EXISTS Users (
    userID TEXT PRIMARY KEY NOT NULL,
    userName TEXT(20) UNIQUE NOT NULL,
    userPasswordHash TEXT(50) NOT NULL UNIQUE,
    userEmail TEXT(20) NOT NULL,
    userPhone INTEGER,
    strikes INTEGER DEFAULT 0
);


-- Event tables
CREATE TABLE IF NOT EXISTS Events (
    eventId TEXT UNIQUE PRIMARY KEY,
    hostId TEXT NOT NULL UNIQUE REFERENCES Users(userID),
    eventName TEXT(20) NOT NULL,
    eventDescription TEXT(200),
    eventDate TEXT(20) NOT NULL,
    locationName TEXT(20),
    zipcode INT NOT NULL,
    latitude INT NOT NULL,
    longitude INT NOT NULL
);

-- Relations

CREATE TABLE IF NOT EXISTS UsersGoingTo (
   userID TEXT,
   eventName  TEXT(30),
   PRIMARY KEY (userID, eventName)
  );

CREATE TABLE IF NOT EXISTS Friends (
   userName TEXT,
   friendName  TEXT,
   accepted BOOLEAN DEFAULT FALSE,
   PRIMARY KEY (userName, friendName)
  );

CREATE TABLE IF NOT EXISTS ReportedUsers (
   userID TEXT,
   reportedID  TEXT,
   PRIMARY KEY (userID, reportedID)
  );
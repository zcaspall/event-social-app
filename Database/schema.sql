-- User tables
CREATE TABLE IF NOT EXISTS Users (
    userID TEXT PRIMARY KEY NOT NULL,
    userName TEXT(20) UNIQUE NOT NULL,
    userPasswordHash TEXT(50) NOT NULL UNIQUE,
    userEmail TEXT(20) NOT NULL,
    userPhone INTEGER,
    strikes INTEGER DEFAULT 0
);

-- User Image Tables
CREATE TABLE IF NOT EXISTS UserImages (
  imageID TEXT UNIQUE PRIMARY KEY,
  imageOwner TEXT NOT NULL REFERENCES Users(userID),
  pfpPath TEXT NOT NULL
)

-- Event tables
CREATE TABLE IF NOT EXISTS Events (
    eventId TEXT UNIQUE PRIMARY KEY,
    hostId TEXT NOT NULL REFERENCES Users(userID),
    eventName TEXT(20) NOT NULL,
    eventDescription TEXT(200),
    eventDate TEXT(20) NOT NULL,
    locationName TEXT(100) NOT NULL,
    latitude INT NOT NULL,
    longitude INT NOT NULL
);

-- Event Image Table
CREATE TABLE IF NOT EXISTS EventImages (
    imageId TEXT UNIQUE PRIMARY KEY,
    parentEventId TEXT NOT NULL REFERENCES Events(eventId),
    imagePath TEXT NOT NULL
);

-- Relations
CREATE TABLE IF NOT EXISTS UsersGoingTo (
   userID TEXT,
   eventId TEXT,
   PRIMARY KEY (userID, eventId)
);

CREATE TABLE IF NOT EXISTS Friends (
   userID TEXT,
   friendID  TEXT,
   accepted BOOLEAN DEFAULT FALSE,
   PRIMARY KEY (userID, friendID)
  );

CREATE TABLE IF NOT EXISTS ReportedUsers (
   userID TEXT,
   reportedID  TEXT,
   PRIMARY KEY (userID, reportedID)
  );

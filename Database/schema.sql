-- User tables
CREATE TABLE IF NOT EXISTS Users (
    userId TEXT PRIMARY KEY NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT(20) NOT NULL,
    username TEXT(20) UNIQUE NOT NULL,
    passwordHash TEXT(50) NOT NULL UNIQUE
);

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
   eventID TEXT,
   PRIMARY KEY (userID, eventID)
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

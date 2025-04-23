DROP SCHEMA IF EXISTS homeownerApp;
CREATE DATABASE homeownerApp;
USE homeownerApp;

DROP TABLE IF EXISTS household_details;
CREATE TABLE household_details (
	householdid INT PRIMARY KEY AUTO_INCREMENT,
    street_addr VARCHAR(45),
    apt VARCHAR(45),
    city VARCHAR(45),
    state VARCHAR(2),
	zip INT
);

DROP TABLE IF EXISTS login;
CREATE TABLE login (
	uid INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    password VARCHAR(45),
    CHECK (CHAR_LENGTH(password) >= 8),
    email VARCHAR(45) UNIQUE
);

DROP TABLE IF EXISTS household_users;
CREATE TABLE household_users (
	householdid INT PRIMARY KEY,
    FOREIGN KEY (householdid) REFERENCES household_details(householdid),
    uid INT UNIQUE NOT NULL,
    FOREIGN KEY (uid) REFERENCES login(uid)
);

DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
	roomid INT PRIMARY KEY,
    room VARCHAR(45),
	householdid INT,
	FOREIGN KEY (householdid) REFERENCES household_users(householdid)
);

DROP TABLE IF EXISTS appliances;
CREATE TABLE appliances (
	name VARCHAR(45) PRIMARY KEY,
    make VARCHAR(45),
    model VARCHAR(45),
    maintenance_period INT,
    last_maintenance DATE,
    next_maintenance DATE GENERATED ALWAYS AS (DATE_ADD(last_maintenance, INTERVAL maintenance_period DAY)) STORED,
    location VARCHAR(45)
);

DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
	taskid INT PRIMARY KEY,
    title VARCHAR(45),
    location VARCHAR(45),
    dueDate VARCHAR(45),
    notes VARCHAR(256),
    frequency VARCHAR(45),
    completed BOOLEAN,
    householdid INT,
	FOREIGN KEY (householdid) REFERENCES household_users(householdid)
);
    
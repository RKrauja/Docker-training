-- Migration: Create and seed Auth, VerificationTokens, and Viesi tables
-- Date: 2025-06-30

USE db;

-- Drop tables if they exist (for clean migration)
DROP TABLE IF EXISTS VerificationTokens;
DROP TABLE IF EXISTS Viesi;
DROP TABLE IF EXISTS Auth;

-- Create Auth table
CREATE TABLE Auth (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsVerified TINYINT(1) DEFAULT 0,
    PRIMARY KEY (id)
);

-- Create Viesi table
CREATE TABLE Viesi (
    id INT NOT NULL AUTO_INCREMENT,
    Autors VARCHAR(255) NOT NULL,
    Komentars TEXT NOT NULL,
    Datums DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Create VerificationTokens table
CREATE TABLE VerificationTokens (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    validUntil DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES Auth(id) ON DELETE CASCADE
);

-- Seed Auth table with sample users
INSERT INTO Auth (username, email, password, IsVerified) VALUES
('admin', 'admin@example.com', '$2b$12$fcXRRPiq1maCnK1ZrFpQj.uN8yLxtQ/tDxoNA2zwKxdJMIygSnM.y ', 1),
('testuser1', 'test1@example.com', '$2b$12$fcXRRPiq1maCnK1ZrFpQj.uN8yLxtQ/tDxoNA2zwKxdJMIygSnM.y ', 1),
('testuser2', 'test2@example.com', '$2b$12$fcXRRPiq1maCnK1ZrFpQj.uN8yLxtQ/tDxoNA2zwKxdJMIygSnM.y ', 0),
('demouser', 'demo@example.com', '$2b$12$fcXRRPiq1maCnK1ZrFpQj.uN8yLxtQ/tDxoNA2zwKxdJMIygSnM.y ', 1);

-- Seed Viesi table with sample comments
INSERT INTO Viesi (Autors, Komentars) VALUES
('John Doe', 'This is a great website!'),
('Jane Smith', 'Thanks for sharing this information.'),
('Admin', 'Welcome to our guest book!');

-- Seed VerificationTokens table with sample tokens for unverified users
INSERT INTO VerificationTokens (token, userId, validUntil) VALUES
('abcdefghijklmnopqrst', 3, DATE_ADD(NOW(), INTERVAL 2 WEEK)),
('uvwxyzabcdefghijklmn', 3, DATE_ADD(NOW(), INTERVAL 1 WEEK));
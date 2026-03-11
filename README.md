SkillSwap – Peer Skill Exchange Platform

SkillSwap is a web application where users can share and exchange skills with each other.
Users can add the skills they can teach and the skills they want to learn.
The system automatically finds users with matching skills and connects them so they can learn from each other.

Features

User Registration

User Login

Add Skills (Teach / Learn)

View Skills

Skill Matching System

Contact matched users

Tech Stack
Frontend

React.js

CSS

Axios

Backend

Node.js

Express.js

Database

MySQL

Server

XAMPP (Apache + MySQL)

Project Structure
skillswap-project
│
├── backend
│   ├── server.js
│   ├── db.js
│   ├── package.json
│
└── frontend
    ├── src
    ├── public
    ├── package.json
How to Run the Project

Follow the steps below to run the project locally.

Step 1: Install Required Software

Make sure the following software is installed on your system:

Node.js

XAMPP

MySQL Workbench

Git

VS Code (recommended)

Step 2: Start XAMPP Server

Open XAMPP Control Panel

Start the following services:

Apache
MySQL
Step 3: Setup Database (MySQL Workbench)

Open MySQL Workbench and run the following queries.

Create Database
CREATE DATABASE skillswap;
USE skillswap;
Create Users Table
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100),
password VARCHAR(100)
);
Create Skills Table
CREATE TABLE skills (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
skill_name VARCHAR(100),
skill_type VARCHAR(50),
learn_skill VARCHAR(100)
);
Step 4: Configure Database Connection

Inside the backend folder, open db.js.

Example configuration:

const mysql = require("mysql");

const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "skillswap"
});

module.exports = db;

Note:
Default XAMPP MySQL password is empty.

Step 5: Install Backend Dependencies

Open terminal inside the project folder and run:

cd backend
npm install
Step 6: Run Backend Server

Start the backend server:

node server.js

If successful, you will see:

Server running on port 5000

Backend will run at:

http://localhost:5000
Step 7: Install Frontend Dependencies

Open another terminal and run:

cd frontend
npm install
Step 8: Run React Frontend

Start the frontend application:

npm start

The app will open automatically at:

http://localhost:3000
API Endpoints
Register User
POST /register

Registers a new user.

Login User
POST /login

Logs in an existing user.

Add Skill
POST /addSkill

Adds a skill that the user can teach or wants to learn.

View Skills
GET /skills

Displays all skills added by users.

Skill Matching
GET /match

Finds users who can teach the skill someone wants to learn.

Example Skill Matching Logic

The system matches users when:

User A wants to learn Music
User B can teach Music

Then the platform automatically connects them.

Example output:

🎉 Hurray Sriraksha!
Swathi can teach you Music
Contact: swathi@email.com
Future Improvements

Chat system between matched users

Skill rating system

User profile page

Notifications for new matches

SkillSwap – Peer Skill Exchange Platform
MERN Stack Project

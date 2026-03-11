# SkillSwap – Peer Skill Exchange Platform

SkillSwap is a web application where users can share and exchange skills with each other.
Users can add the skills they can teach and the skills they want to learn.
The system automatically finds users with matching skills and connects them so they can learn from each other.

---

# Features

* User Registration
* User Login
* Add Skills (Teach / Learn)
* View Skills
* Skill Matching System
* Contact matched users

---

# Tech Stack

## Frontend

* React.js
* CSS
* Axios

## Backend

* Node.js
* Express.js

## Database

* MySQL

## Server

* XAMPP (Apache + MySQL)

---

# Project Structure

```
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
```

---

# How to Run the Project

Follow these steps to run the project locally.

---

# Step 1: Install Required Software

Make sure the following are installed:

* Node.js
* XAMPP
* MySQL Workbench
* Git
* VS Code (recommended)

---

# Step 2: Start XAMPP Server

Open **XAMPP Control Panel**

Start the following services:

```
Apache
MySQL
```

---

# Step 3: Setup Database (MySQL Workbench)

Open **MySQL Workbench** and run the following queries.

## Create Database

```sql
CREATE DATABASE skillswap;
USE skillswap;
```

---

## Create Users Table

```sql
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100),
password VARCHAR(100)
);
```

---

## Create Skills Table

```sql
CREATE TABLE skills (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
skill_name VARCHAR(100),
skill_type VARCHAR(50),
learn_skill VARCHAR(100)
);
```

---

# Step 4: Configure Database Connection

Inside the backend folder open **db.js**

Example configuration:

```javascript
const mysql = require("mysql");

const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "skillswap"
});

module.exports = db;
```

Default **XAMPP MySQL password is empty**.

---

# Step 5: Run Backend Server

Open terminal inside the project folder and run:

```
cd backend
npm install
```







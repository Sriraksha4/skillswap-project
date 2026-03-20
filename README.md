# SkillSwap – Peer Skill Exchange Platform

SkillSwap is a full-stack web application where users can share and exchange skills with each other. Users add the skills they can teach and the skills they want to learn. The system automatically finds and connects users with matching skills — and now includes real-time messaging, editable user profiles, skill deletion, search, and a polished UI with toast notifications.

---

## Features

- User Registration (with email format and password strength validation)
- User Login with session stored in localStorage
- Add Skills (what you teach + what you want to learn)
- Skills Marketplace — browse all skills with search and tab filtering
- Bidirectional Skill Matching (both users must complement each other)
- User Profile Page (view, edit bio, phone, and avatar)
- View Other Users' Profiles
- Delete Your Own Skills
- In-App Messaging (send, receive, conversation history)
- Mark Messages as Read
- Favorite Skills (UI-side)
- Animated Dashboard with quick-action cards
- Sidebar Navigation with active state highlighting
- Toast Notification System (success, error, info)
- Responsive design for mobile and desktop

---

## Tech Stack

### Frontend
- React.js (with React Router v6)
- CSS (custom per-page stylesheets)
- react-icons (Feather Icons via `react-icons/fi`)

### Backend
- Node.js
- Express.js

### Database
- MySQL (`mysql2` driver)

### Server
- XAMPP (Apache + MySQL)

---

## Project Structure

```
skillswap-project
│
├── backend
│   ├── server.js          # All API routes and business logic
│   ├── db.js              # MySQL connection setup
│   └── package.json
│
└── frontend
    ├── public
    └── src
        ├── App.js                    # Routes and app entry point
        ├── pages
        │   ├── Login.js              # Login page
        │   ├── Register.js           # Registration page
        │   ├── Dashboard.js          # Home dashboard with quick actions
        │   ├── AddSkill.js           # Add a teach/learn skill
        │   ├── ViewSkills.js         # Browse all skills (with search + tabs)
        │   ├── SkillMatch.js         # View skill matches
        │   ├── Profile.js            # View and edit user profile
        │   └── Messages.js           # In-app chat with another user
        └── components
            ├── Navbar.js             # Sidebar navigation
            ├── Layout.js             # Page wrapper with navbar
            └── Toast.js              # Toast notification system
```

---

## How to Run the Project

### Step 1 – Install Required Software

Make sure the following are installed:

- Node.js
- XAMPP
- MySQL Workbench
- Git
- VS Code (recommended)

---

### Step 2 – Start XAMPP Server

Open **XAMPP Control Panel** and start:

```
Apache
MySQL
```

---

### Step 3 – Setup Database (MySQL Workbench)

Open **MySQL Workbench** and run the following queries.

#### Create Database

```sql
CREATE DATABASE skillswap;
USE skillswap;
```

#### Create Users Table

```sql
CREATE TABLE users (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(100),
  email    VARCHAR(100),
  password VARCHAR(100),
  bio      TEXT,
  phone    VARCHAR(20),
  avatar   LONGTEXT
);
```

> `avatar` stores the profile image as a base64 string uploaded from the browser.

#### Create Skills Table

```sql
CREATE TABLE skills (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT,
  skill_name  VARCHAR(100),
  skill_type  VARCHAR(50),
  learn_skill VARCHAR(100)
);
```

#### Create Messages Table

```sql
CREATE TABLE messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  sender_id   INT,
  receiver_id INT,
  message     TEXT,
  timestamp   DATETIME,
  read_status BOOLEAN DEFAULT false
);
```

---

### Step 4 – Configure Database Connection

Inside the `backend` folder, open `db.js` and update with your MySQL credentials:

```javascript
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",           // Default XAMPP MySQL password is empty
  database: "skillswap"
});

module.exports = db;
```

> ⚠️ Never commit your real password to GitHub. Use a `.env` file to store credentials securely.

---

### Step 5 – Install Backend Dependencies

```bash
cd backend
npm install
```

Make sure these packages are installed:

```bash
npm install express mysql2 cors
```

---

### Step 6 – Run Backend Server

```bash
node server.js
```

If successful, you will see:

```
MySQL Connected
Server running on port 5000
```

Backend runs at: `http://localhost:5000`

Verify it's working: `http://localhost:5000/test`

---

### Step 7 – Install Frontend Dependencies

```bash
cd frontend
npm install
```

Install required packages if not already present:

```bash
npm install axios react-router-dom react-icons
```

---

### Step 8 – Run React Frontend

```bash
npm start
```

The app will open at: `http://localhost:3000`

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Login | Sign in to your account |
| `/register` | Register | Create a new account |
| `/dashboard` | Dashboard | Quick action cards and stats |
| `/addskill` | Add Skill | Submit a skill to teach and one to learn |
| `/skills` | View Skills | Browse all skills with search and tab filters |
| `/match` | Skill Match | See bidirectional skill matches |
| `/profile` | Profile | View and edit your own profile |
| `/profile/:userId` | Profile | View another user's profile |
| `/messages/:userId` | Messages | Chat with a specific user |

> All routes except `/` and `/register` are wrapped in the `Layout` component which renders the sidebar Navbar.

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user (validates email format + password strength) |
| POST | `/login` | Log in an existing user, returns full user object |

#### Registration Validation Rules
- Email must be a valid format (e.g. `user@example.com`)
- Password must be **at least 8 characters** and contain **at least one special character** from `!@#$%^&*`

---

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/:id` | Get a user's details by ID |
| PUT | `/user/:id` | Update profile fields: `bio`, `phone`, `avatar` (partial update supported) |

---

### Skills

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/addSkill` | Add a skill with `user_id`, `skill_name`, `learn_skill` |
| GET | `/skills` | Get all skills joined with user name and email |
| GET | `/userSkills/:userId` | Get all skills for a specific user |
| DELETE | `/skill/:id` | Delete a skill by its ID |

---

### Skill Matching

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/match` | Find bidirectional skill matches using a self-join |

---

### Messaging

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sendMessage` | Send a message (`sender_id`, `receiver_id`, `message`) |
| GET | `/messages/:userId/:otherUserId` | Get full conversation between two users |
| GET | `/conversations/:userId` | List all conversations for a user with last message preview |
| PUT | `/message/:messageId/read` | Mark a specific message as read |

---

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/test` | Check if the backend is running |

---

## Skill Matching Logic

The matching system uses a **bidirectional self-join** on the skills table. Both users must complement each other — what one teaches must be what the other wants to learn, and vice versa.

```
User A: Can teach Python   |  Wants to learn Music
User B: Can teach Music    |  Wants to learn Python
→ MATCH FOUND ✅
```

From the match page, you can:
- Click **View Profile** to visit the matched user's profile
- Click **Message** to open a direct chat with them

---

## Frontend Components

### Toast Notification System
A global `ToastProvider` wraps the entire app in `App.js`. Any page can call `useToast()` to trigger a notification:

```javascript
const { showToast } = useToast()
showToast("Skill added successfully!", "success", 3000)
showToast("Something went wrong", "error")
```

Supported types: `success`, `error`, `info`

### Navbar (Sidebar)
- Highlights the currently active route
- Shows logged-in user's name and avatar
- Listens for `userDataUpdated` event to refresh avatar live after profile edits
- Logout clears localStorage and redirects to login

### Layout
Wraps all protected pages with the Navbar sidebar. Auth pages (Login, Register) do not use the Layout.

---

## Future Improvements

- Real-time messaging with WebSockets (Socket.io)
- Unread message badge in the navbar
- Skill rating and review system
- Notifications for new matches
- Password hashing with bcrypt
- JWT-based authentication and protected routes
- Environment variable support with `.env`
- Pagination for skills and messages
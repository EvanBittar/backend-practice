# User Management API — Full-Stack Auth & CRUD App

A full-stack application featuring a secure Node.js/Express REST API and a React frontend, with JWT authentication, role-based route protection, and full CRUD operations on user records.

Built as a hands-on project to practice backend architecture, authentication, database design, testing, and containerization.

## Features

- 🔐 **Authentication** — Signup/login with bcrypt password hashing and JWT tokens
- 🛡️ **Protected Routes** — Middleware-based route protection using JWT verification
- 📦 **Full CRUD** — Create, read, update, and delete user records
- ✅ **Input Validation** — Server-side validation with `express-validator`
- 🗄️ **MySQL Database** — Parameterized queries to prevent SQL injection
- ⚛️ **React Frontend** — Login, signup, and a protected dashboard with inline editing
- 🧭 **Client-side Routing** — React Router with protected route guards
- 🎨 **Styled UI** — Tailwind CSS
- 🧪 **Automated Tests** — 18 Jest/Supertest tests covering auth, validation, and CRUD flows
- 🐳 **Dockerized** — Full stack (API + MySQL) runs with a single `docker compose up`

## Tech Stack

**Backend:** Node.js, Express, MySQL (mysql2), JWT, bcrypt, express-validator, Jest, Supertest
**Frontend:** React (Vite), React Router, Tailwind CSS
**DevOps:** Docker, Docker Compose

## Screenshots

> _Add 2-3 screenshots or a short GIF here showing the login page, the users dashboard, and inline editing. This is one of the highest-impact additions you can make — visitors decide whether to read further in seconds._

## Architecture

```
backend/
├── config/         # Database connection (pool)
├── controllers/    # Route handler logic (auth, users)
├── middleware/     # JWT authentication middleware
├── routes/         # Express route definitions
├── tests/          # Jest/Supertest test suite
├── app.js          # Express app definition (testable)
├── index.js        # Server entry point
├── Dockerfile
└── docker-compose.yml

frontend/
├── src/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── UsersList.jsx
│   └── App.jsx      # Route definitions
```

## Getting Started

### Prerequisites
- Node.js 20+
- MySQL, **or** Docker + Docker Compose (recommended)

### Option 1: Run with Docker (recommended)
```bash
git clone https://github.com/EvanBittar/backend-practice.git
cd backend-practice
docker compose up --build
```
This starts both the API (port 3000) and a MySQL instance together — no local database setup needed.

### Option 2: Run locally
```bash
git clone https://github.com/EvanBittar/backend-practice.git
cd backend-practice
npm install
```
Create a `.env` file:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=js_practice
JWT_SECRET=your_secret_key
PORT=3000
```
Create the database table:
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT,
  password VARCHAR(255) NOT NULL DEFAULT ''
);
```
Then run:
```bash
node index.js
```

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173`.

## Running Tests
```bash
npm test
```
18 tests covering login/signup validation, JWT auth guards, and full CRUD flows.

## API Endpoints

| Method | Endpoint         | Auth Required | Description              |
|--------|------------------|:--------------:|---------------------------|
| POST   | `/signup`        | No             | Create a new account      |
| POST   | `/login`         | No             | Log in, receive a JWT     |
| GET    | `/users`         | Yes            | List all users            |
| GET    | `/users/:id`     | Yes            | Get a single user         |
| POST   | `/users`         | Yes            | Create a user record      |
| PUT    | `/users/:id`     | Yes            | Update a user record      |
| DELETE | `/users/:id`     | Yes            | Delete a user record      |

Protected routes require an `Authorization: Bearer <token>` header.

## What I Learned Building This

- Designing a REST API with proper separation of concerns (routes/controllers/middleware)
- Implementing authentication securely: password hashing, JWT issuance/verification, and route guards
- Preventing SQL injection with parameterized queries
- Handling CORS and building a consistent JSON error contract between frontend and backend
- Writing automated tests with realistic setup/teardown (including database cleanup)
- Containerizing a multi-service application with Docker Compose

## Author

**Evan** — [GitHub](https://github.com/EvanBittar)

# Full-Stack Employee Management System

A full-stack web application for managing employees, built with React (Vite) on the frontend and Node.js/Express with MongoDB on the backend. It has separate Admin and Employee portals with JWT-based authentication, role-based access, and background jobs (reminders and automatic attendance handling) powered by Inngest.

## Features

- **Admin and Employee portals** with role-based access (JWT)
- **Employee management**: create, update, delete, filter by department
- **Attendance**: check-in / check-out tracking
- **Leave management**: employees apply, admins approve or reject
- **Payslips**: generated from salary, allowances and deductions
- **Background jobs (Inngest)**:
  - Auto check-out reminder if an employee forgets to check out (after 9 hours), then the attendance is marked `LATE` after 10 hours
  - Reminder email to the admin if a leave application is still `PENDING` after 24 hours
  - Daily cron that reminds employees who haven't checked in
- **Email notifications** with Nodemailer

## Tech Stack

**Frontend**
- React (Vite)
- React Router (`react-router-dom`)
- Tailwind CSS
- lucide-react (icons)
- react-hot-toast (notifications)

**Backend**
- Node.js / Express 5
- MongoDB with Mongoose
- JWT (`jsonwebtoken`) for authentication
- bcrypt for password hashing
- multer for file uploads
- Inngest for background jobs and scheduled tasks
- Nodemailer for sending emails
- cors, dotenv

## Progress

### Frontend (client side)
- [x] Create React (Vite) app
- [x] Add dependencies (react-router-dom, lucide-react, react-hot-toast)
- [x] Set up pages and React Router routes
- [x] Add landing page and Admin/Employee login portals
- [x] Add sidebar navigation
- [x] Add dashboard with separate Admin and Employee views
- [x] Implement the pages (Employees, Attendance, Leave, Payslips, Settings) and filter input functionality

### Backend (server side)
- [x] Initialize Node.js server with Express
- [x] Add dependencies (express, cors, dotenv, multer, jsonwebtoken, bcrypt, mongoose)
- [x] Configure dev tooling (nodemon)
- [x] Connect to MongoDB with Mongoose
- [x] Define User model (email, hashed password, role: ADMIN / EMPLOYEE)
- [x] Define Employee model (profile info, position, department, salary, allowances, deductions, status)
- [x] Build authentication: JWT login, session lookup, and change-password endpoints
- [x] Add JWT auth middleware to protect private routes
- [x] Build Employee CRUD API (list with department filter, create, update, delete)
- [x] Standardize all API responses to a consistent JSON format (`{ success, data, message }`)
- [x] Define Attendance and Leave models with their controllers and routes
- [x] Create Payslip model and its controllers
- [ ] Set up Inngest and register the functions (auto check-out, leave reminder, attendance cron)
- [ ] Configure Nodemailer and send the reminder emails
- [ ] Trigger the Inngest events from the check-in and leave controllers

## Project Structure

```
// To be added once the project layout is final
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended, v20.6+ if you use `node --env-file`)
- A MongoDB database (local or MongoDB Atlas)
- An email account for sending emails (a Gmail account with an app password works for development)
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/Full-Stack-Employee-Management-System.git
cd Full-Stack-Employee-Management-System
```

**2. Set up the backend**

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.address@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM="Employee System <your.address@gmail.com>"
ADMIN_EMAIL=admin@example.com
```

> **Gmail users:** enable 2-step verification on your Google account, then create an **app password** and use it as `SMTP_PASS`. Do not use your regular password. `SMTP_FROM` should use the same address as `SMTP_USER`.

> Never commit your `.env` file. Make sure it is listed in `.gitignore`.

Run the server:

```bash
npm run server   # runs with nodemon (dev)
# or
npm start        # runs with node
```

**3. Run the Inngest dev server (background jobs)**

In a separate terminal, start the local Inngest dev server and point it at your Express app:

```bash
npx inngest-cli@latest dev -u http://localhost:4000/api/inngest
```

The dashboard is available at <http://localhost:8288>, where you can see events, trigger functions manually and inspect runs.

For production, create an app in Inngest Cloud and add `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` to your environment.

**4. Set up the frontend**

```bash
cd ../client
npm install
npm run dev
```

## Background Jobs (Inngest)

Functions live in the server's Inngest folder and are served at `/api/inngest`.

| Function | Trigger | What it does |
|----------|---------|--------------|
| `auto-check-out` | Event `employee/check-in` | Waits 9 hours. If the employee hasn't checked out, sends a reminder email, waits 1 more hour, then marks the attendance as `LATE` |
| `leave-application-reminder` | Event `leave/pending` | Waits 24 hours. If the leave is still `PENDING`, emails the admin |
| `attendance-reminder` | Cron (weekdays) | Emails employees who haven't checked in and aren't on approved leave |

Events are sent from the controllers, for example after a check-in:

```javascript
await inngest.send({
  name: "employee/check-in",
  data: { employeeId, attendanceId },
});
```

## API Reference

Protected routes require an `Authorization: Bearer <token>` header, using the JWT returned by `/login`.

### Auth: `/api/auth`

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/login` | Log in as Admin or Employee | No |
| GET | `/session` | Get the currently authenticated user | Yes |
| POST | `/change-password` | Change the logged-in user's password | Yes |

### Employees: `/api/employees`

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/` | List employees (optional `?department=`) | Yes |
| POST | `/` | Create a new employee | Yes |
| PUT | `/:id` | Update an employee | Yes |
| DELETE | `/:id` | Delete an employee | Yes |

### Attendance: `/api/attendance`

> Update this table to match your actual routes.

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/` | Get attendance records | Yes |
| POST | `/` | Check in / check out | Yes |

### Leave: `/api/leave`

> Update this table to match your actual routes.

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/` | List leave applications | Yes |
| POST | `/` | Create a leave application | Yes |
| PATCH | `/:id` | Approve or reject a leave application (admin) | Yes |

### Payslips: `/api/payslips`

> Update this table to match your actual routes.

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/` | List payslips | Yes |
| POST | `/` | Generate a payslip (admin) | Yes |

### Response format

All responses follow the same shape:

```jsonc
// Success
{ "success": true, "data": { }, "message": "optional" }

// Error
{ "success": false, "message": "..." }
```

## License

This project is licensed under the ISC License.

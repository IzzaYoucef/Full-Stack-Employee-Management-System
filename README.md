
# Employee Management System [full-stack-employee-management-syst-pi.vercel.app](https://full-stack-employee-management-system-nws9-3tygumzo7.vercel.app/login)

A full-stack web app that helps a small company keep track of its people: who works there, who showed up today, who asked for time off, and who got paid what.

There are two sides to it:

- **Admins** manage the team. They add employees, approve or reject leave requests, and create payslips.
- **Employees** look after their own stuff. They check in and out, ask for leave, read their payslips, and update their bio.

Built with React + Vite on the front, and Node, Express and MongoDB on the back.

---

## What you can do

**As an admin**

- See a dashboard with the company at a glance
- Add employees (this also creates their login)
- Approve or reject leave requests
- Create monthly payslips (salary, allowances and deductions are pre-filled from the employee's record)
- Change your own password

**As an employee**

- Check in when you arrive and check out when you leave. Arriving after 9:30 counts as late, and the day type (full day, half day, etc.) is worked out from your hours
- Apply for sick, casual or annual leave and follow its status
- View and print your payslips
- Edit your bio and change your password

---

## Project layout

```
.
├── client/          React app (Vite + Tailwind)
│   └── src/         <- all the front-end code lives here
└── server/          Express API
    ├── controlers/  request handlers
    ├── models/      MongoDB (Mongoose) models
    ├── routes/      API routes
    ├── middleware/  login / admin checks
    ├── inngest/     background jobs (reminder emails)
    └── seed.js      creates the first admin account
```

> **Heads up:** Vite only reads `client/src/`. If you edit a file anywhere else in `client/`, nothing will change in the app.

---

## Getting started

### What you need

- Node.js 22
- A MongoDB database (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works great)

### 1. Set up the server

```bash
cd server
npm install
```

Create a file called `.env` inside `server/`:

```env
PORT=4000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET_KEY=any-long-random-string

# The first admin account (used by the seed script)
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=pick-a-strong-password

# Only needed for reminder emails (optional)
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

Then create the admin account (you only need to do this once):

```bash
npm run seed
```

If the admin already exists, running it again simply resets their password to whatever is in `ADMIN_PASSWORD`. That makes it handy if you ever get locked out.

Start the server:

```bash
npm run server
```

You should see `Database connected` and `Server running on http://localhost:4000/`. Leave this terminal open.

### 2. Set up the client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

If your API isn't on `http://localhost:4000`, create `client/.env` with:

```env
VITE_BACKEND_BASE_URL=http://your-api-address
```

### 3. Log in

1. On the login page, pick **Admin Portal** and sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
2. Go to **Employees → Add Employee** and create someone.
3. Log out, then sign in on the **Employee Portal** with that person's email and password to see the employee side.

---

## Troubleshooting

| What you see | What's usually going on |
|---|---|
| **Network Error** on login | The server isn't running, or it can't reach MongoDB. Check the server terminal. |
| **Invalid credentials** | The admin doesn't exist yet or the password differs. Run `npm run seed` and use the password from `.env`, without the quotes. |
| **Not authorized as Admin / Employee** | You picked the wrong portal for that account. |
| The server prints *Cannot reach MongoDB* | Check `MONGODB_URI`, your internet connection, and that your IP is allowed under Network Access in Atlas. |
| Attendance, leave or profile show errors for the admin | Expected. Those features belong to employees, and the admin account has no employee profile. |
| You get sent back to the login page | Your session expired (tokens last one day). Just log in again. |

---

## API at a glance

All routes start with `/api` and (except login) need a login token.

| Area | Routes |
|---|---|
| Auth | `POST /auth/login`, `POST /auth/change-password`, `GET /auth/session` |
| Employees (admin) | `GET /employees`, `POST /employees`, `PUT /employees/:id`, `DELETE /employees/:id` |
| Profile | `GET /profile`, `POST /profile` (bio only) |
| Attendance | `POST /attendances` (check in, then check out), `GET /attendances` |
| Leave | `POST /leave`, `GET /leave`, `GET /leave/all` (admin), `PATCH /leave/:id/status` (admin) |
| Payslips | `POST /payslips` (admin), `GET /payslips`, `GET /payslips/:id` |
| Dashboard | `GET /dashboard` (admin) |

# Full-Stack Employee Management System

A full-stack web application for managing employees, built with React (Vite) on the frontend and Node.js/Express with MongoDB on the backend. Supports separate Admin and Employee portals with JWT-based authentication and role-based access.

## Tech Stack

**Frontend**
- React (Vite)
- React Router (`react-router-dom`)
- Tailwind CSS
- `lucide-react` (icons)
- `react-hot-toast` (notifications)

**Backend**
- Node.js / Express 5
- MongoDB with Mongoose
- JWT (`jsonwebtoken`) for authentication
- `bcrypt` for password hashing
- `multer` for file uploads
- `cors`, `dotenv`

## Progress

### Frontend (client side)
- [x] Create React (Vite) app
- [x] Add dependencies (`react-router-dom`, `lucide-react`, `react-hot-toast`)
- [x] Set up pages and React Router routes
- [x] Add landing page and Admin/Employee login portals
- [x] Add sidebar navigation
- [x] Add dashboard with separate Admin and Employee views
- [x] Implement the pages [Employees, Attendance, Leave, Payslips, Settings] and filter input functionality

### Backend (server side)
- [x] Initialize Node.js server with Express
- [x] Add dependencies (`express`, `cors`, `dotenv`, `multer`, `jsonwebtoken`, `bcrypt`, `mongoose`)
- [x] Configure dev tooling (`nodemon`)
- [x] Connect to MongoDB with Mongoose
- [x] Define `User` model (email, hashed password, role: `ADMIN` / `EMPLOYEE`)
- [x] Define `Employee` model (profile info, position, department, salary, allowances, deductions, status)
- [x] Build authentication: JWT login, session lookup, and change-password endpoints
- [x] Add JWT auth middleware to protect private routes
- [x] Build Employee CRUD API (list with department filter, create, update, delete)
- [x] Standardize all API responses to a consistent JSON format (`{ success, data, message }`)

## Project Structure

```
Full-Stack-Employee-Management-System/
├── client/                 # React (Vite) frontend
│   └── src/
│       ├── assets/
│       ├── components/     # Loading, ChangePassword, Sidebar, etc.
│       └── pages/          # Settings, Employees, Attendance, Leave, Payslips
└── server/                 # Express backend
    ├── constants/
    ├── controllers/        # employeeController.js, authController.js
    ├── middleware/          # authMiddleware.js
    ├── models/              # Employee.js, User.js
    ├── routes/
    └── server.js
```

> Adjust this tree to match your actual folder layout if it differs.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB database (local or MongoDB Atlas)

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
```

Run the server:
```bash
npm run server   # runs with nodemon (dev)
# or
npm start        # runs with node
```

**3. Set up the frontend**
```bash
cd ../client
npm install
npm run dev
```

## API Reference

### Auth — `/api/auth`
| Method | Endpoint            | Description                          | Protected |
|--------|----------------------|---------------------------------------|-----------|
| POST   | `/login`             | Log in as Admin or Employee           | No        |
| GET    | `/session`           | Get the currently authenticated user  | Yes       |
| POST   | `/change-password`   | Change the logged-in user's password  | Yes       |

### Employees — `/api/employees`
| Method | Endpoint       | Description                              | Protected |
|--------|----------------|-------------------------------------------|-----------|
| GET    | `/`            | List employees (optional `?department=`) | Yes       |
| POST   | `/`            | Create a new employee                     | Yes       |
| PUT    | `/:id`         | Update an employee                        | Yes       |
| DELETE | `/:id`         | Delete an employee                        | Yes       |

Protected routes require an `Authorization: Bearer <token>` header, using the JWT returned by `/login`.

All responses follow the same shape:
```json
// Success
{ "success": true, "data": { }, "message": "optional" }

// Error
{ "success": false, "message": "..." }
```

## License

This project is licensed under the ISC License.

import express from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";
import { connectDb } from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import employeeRouter from "./routes/employeeRoute.js";
import profileRouter from "./routes/profileRoute.js";
import attendanceRouter from "./routes/attendancesRoute.js";
import leaveRouter from "./routes/leavesRouter.js";
import payslipRoute from "./routes/payslipsRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(multer().none()); // parses multipart/form-data text fields

// Database connection
await connectDb();

app.get("/", (req, res) => {
    res.send("SERVER RUNNING");
});

// Routes (routers must be mounted on the app, not on each other)
app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendances", attendanceRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/payslips", payslipRoute);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (malformed JSON, multer errors, ...)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

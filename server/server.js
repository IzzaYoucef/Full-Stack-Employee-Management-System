import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { serve } from "inngest/express";
import { connectDb } from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import employeeRouter from "./routes/employeeRoute.js";
import profileRouter from "./routes/profileRoute.js";
import attendanceRouter from "./routes/attendancesRoute.js";
import leaveRouter from "./routes/leavesRouter.js";
import payslipRoute from "./routes/payslipsRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import { inngest, functions } from "./inngest/inngest.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(multer().none()); // parses multipart/form-data text fields

await connectDb();
app.get("/", (req, res) => {
    res.send("SERVER RUNNING");
});

// Inngest (background jobs). Mounted before the DB middleware: syncing/introspection
// must not depend on the database, and each function connects by itself when it needs to.
app.use("/api/inngest", serve({ client: inngest, functions }));

// Routes 
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendances", attendanceRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/payslips", payslipRoute);
app.use("/api/dashboard", dashboardRoute);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found"});
});

// Global error handler (malformed JSON, multer errors, ...)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
});

// Local development only: Vercel imports the exported app and handles the HTTP server itself.
if (!process.env.VERCEL) {
    connectDb()
        .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`)))
        .catch(() => process.exit(1));
}

export default app;

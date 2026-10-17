import { Router } from "express";
import { createLeave, getLeaves, getAllLeaves, updateLeaveStatus } from "../controlers/LeaveController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const leaveRouter = Router();

leaveRouter.post("/", protect, createLeave);
leaveRouter.get("/", protect, getLeaves); // my requests (employee)
leaveRouter.get("/all", protect, protectAdmin, getAllLeaves); // all requests (admin)
leaveRouter.patch("/:id/status", protect, protectAdmin, updateLeaveStatus); // approve / reject (admin)

export default leaveRouter;

import express from "express";
import { createLeave, getLeaves, getAllLeaves, updateLeaveStatus } from "../controllers/leaveController.js";

const leaveRouter = express.Router();

leaveRouter.post("/", createLeave);
leaveRouter.get("/", getLeaves);                    // mes demandes (employé)
leaveRouter.get("/all", getAllLeaves);              // toutes les demandes (admin)
leaveRouter.patch("/:id/status", updateLeaveStatus); // approuver / rejeter (admin)

export default leaveRouter;
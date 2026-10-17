import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controlers/profileController.js";

const profileRouter = Router();

profileRouter.get("/", protect, getProfile);
profileRouter.post("/", protect, updateProfile);

export default profileRouter;

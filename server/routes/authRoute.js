import { Router } from "express";
import { login, changePassword, session } from "../controlers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/login", login); // public: you can't require a token to obtain a token
authRouter.get("/session", protect, session);
authRouter.post("/change-password", protect, changePassword);

export default authRouter;

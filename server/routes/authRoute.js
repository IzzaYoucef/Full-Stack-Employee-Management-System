import { Router } from "express"; 
import { login , changePassword, session } from "../controlers/authController"; 
import { protect, protectAdmin } from "../middleware/authMiddleware";


const authRouter = Router() ; 
 
authRouter.post("/login" , protect , protectAdmin , login);   
authRouter("/session" , protect , session); 
authRouter.post("/change-password" , protect , changePassword) ;  

export default authRouter  ; 


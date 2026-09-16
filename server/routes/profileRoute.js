import { Router } from "express"; 
import { protect } from "../middleware/authMiddleware";
import { getProfile } from "../controlers/profileController";
import { updateEmployee } from "../controlers/employeeController";


const profileRouter = Router()  ;


profileRouter.get("/" , protect ,  getProfile) ; 
profileRouter.post("/" , protect , updateEmployee) ; 

export default profileRouter ; 
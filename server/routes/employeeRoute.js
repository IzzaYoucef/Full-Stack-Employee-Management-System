import {Router} from "express" ; 
import {createEmployee, deleteEmployee, getEmployees, updateEmployee} from "../controlers/employeeController.js" ; 
import { protect, protectAdmin } from "../middleware/authMiddleware.js";


const employeeRouter  = Router() ; 


employeeRouter.get("/" , protect , protectAdmin ,   getEmployees) ;  
employeeRouter.post("/" , protect , protectAdmin , createEmployee) ; 
employeeRouter.put("/:id" , protect , protect ,   updateEmployee); 
employeeRouter.delete("/:id", protect  , protect , protectAdmin , deleteEmployee) ;  


export default employeeRouter ; 

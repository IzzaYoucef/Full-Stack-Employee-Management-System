import {Router} from "express" ; 
import {createEmployee, deleteEmployee, getEmployees, updateEmployee} from "../controlers/employeeController.js" ; 


const employeeRouter  = Router() ; 


employeeRouter.get("/" , getEmployees) ;  
employeeRouter.post("/" , createEmployee) ; 
employeeRouter.put("/:id" , updateEmployee); 
employeeRouter.delete("/:id" , deleteEmployee) ;  




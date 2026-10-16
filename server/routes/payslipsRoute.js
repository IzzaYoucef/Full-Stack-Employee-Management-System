import { Router } from "express";
import { createPayslip, getPayslipById, getPayslips } from "../controlers/payslipsController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const payslipRoute = Router() ; 

payslipRoute.post("/", protect , protectAdmin ,  createPayslip) ;  
payslipRoute.get("/" , protect ,  getPayslips);  
payslipRoute.get("/:id" , protect ,  getPayslipById);  

export default payslipRoute; 
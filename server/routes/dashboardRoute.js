import {Router}  from 'express'
import { protect, protectAdmin } from '../middleware/authMiddleware.js';
import { getDashboard } from '../controlers/dashboardController.js';
const dashboardRoute = Router() ;  

dashboardRoute.get("/" , protect , protectAdmin , getDashboard) ; 

export default dashboardRoute ; 

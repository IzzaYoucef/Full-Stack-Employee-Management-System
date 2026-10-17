import {Router}  from 'express'
import { protect, protectAdmin } from '../middleware/authMiddleware';
import { getDashboard } from '../controlers/dashboardController';
const dashboardRoute = Router() ;  

dashboardRoute.get("/" , protect , protectAdmin , getDashboard) ; 

export default dashboardRoute ; 

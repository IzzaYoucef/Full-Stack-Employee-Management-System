import {Router} from 'express' ; 
import { protect } from '../middleware/authMiddleware';
import { clockInOut } from '../controlers/attendancesController';
const attendanceRouter = Router() ; 


attendanceRouter.post("/" , protect , clockInOut ) ; 

export default attendanceRouter ; 
import {Router} from 'express' ; 
import { protect } from '../middleware/authMiddleware';
import { clockInOut, getAttendance } from '../controlers/attendancesController';
const attendanceRouter = Router() ; 


attendanceRouter.post("/" , protect , clockInOut ) ; 
attendanceRouter.get("/" , protect , getAttendance) ;

export default attendanceRouter ; 
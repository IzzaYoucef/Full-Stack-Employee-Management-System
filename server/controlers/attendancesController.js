import Attendance from "../models/Attendances";
import employeeModel from "../models/Employee";


// POST /api/attendance 
export const clockInOut = async (req , res) => {
    try {
            const session = req.session ; 

    const employee = await employeeModel.findOne({userId:session.userId})  ;  

    if(!employee){
        return res.status(404).json({success:false , message:"User Not Found"}) ; 
    }

    if(!employee.isDeleted){
        return res.json({success:false , message:"Your account us desactivated , You can not do this action"}) ; 
    }
    const today = new Date() ; 
    today.setHoures(0,0,0,0);
    const existing = await Attendance.findOne({
        employeeId:employee._id , 
        date:today
    }) ;  

    const now = new Date() ; 

    if(!existing){
        const isLate = now.getHours() > 0 && now.getMinutes() > 0  ; 
        const attendance = await Attendance.create({
            employeeId:employee._id,
            date:now , 
            checkIn:now , 
            status:isLate ? "LATE" : "PRESENT"
        })
        return res.json({success:true , type:"CHECK_IN" , message:data}); 
    }else if(!existing.checkOut) {
        const checkInTime = new Date(existing.checkIn).getTime() ; 
        const deffMs = now.getTime() - checkInTime ; 
        const diffHours = deffMs / (1000 * 60 * 60) ; 
        
        existing.checkOut = now ; 

        const workingHoures = parseFloat(diffHours.toFixed(2)) ; 

        let dayType = "Short Day" ; 
        if(workingHoures >= 8) dayType = "Full Day" ; 
        else if(workingHoures >= 6) dayType = "Three Quarters Day"
        else if(workingHoures >= 4) dayType = "Half Day" 

        existing.dayType = dayType ; 
        existing.workingHoures = workingHoures ;  

        return res.json({success:true , message:attendance}) ; 
    }
    } catch (error) {
        return res.json({success:false , message:error.message}) ;    
    }
}
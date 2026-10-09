import Employee from "../models/Employee.js"
import leaveApplication from "../models/LeaveApplication.js";
// Create Leave  
// POST api/leave 

export const createLeave = async(req , res) => { 

    try {

        const session = req.session ;  

        const employee = await Employee.findOne({userId:session.userId}) ; 

        if(!employee) return res.status(404).json({success:flase , message:"Employee Not found"}) 

        if(employee.isDeleted) return res.status(403).json({success:false , message:"Accound is Deactivated"}) ; 
        
        const {type , startDate , endDate , reason} = req.body ; 

        if(!type || !startDate || !endDate || !reason){
            res.status(400).json({error:"Missing feilds"})
        } 

        const today = new Date() ; 
        today.setHours(0 , 0 , 0 , 0) ; 

        if(new Date(startDate) < today || new Date(endDate) <= today){
        res.status(400).json({error:"The date must be in the future"}) ; 
        }

        if(new Date(endDate) < new Date(startDate)){
            res.status(400).json({error:"End date must be grater thean start day"})
        } 

        const leave = await leaveApplication.create({
            employeeId:employee._id ,
            type , 
            startDate : new Date(startDate) , 
            endDate : new Date(endDate) , 
            reason , 
            status:"PENDING"
        }) ; 
        return res.json({success:true , data:leave}) ;
    } catch (error) {
        res.status(500).json({success:false , message:error.message()})
    }

}


// GET
// Get Leaves 


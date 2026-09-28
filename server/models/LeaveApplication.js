import mongoose from "mongoose"; 

const leaveApplicationSchema = new mongoose.Schema({
    employeeId:{type:mongoose.Schema.Types.ObjectId , ref:"Employee" , required:true} , 
    startDate:{type:date , require:true} ,
    endDay:{type:date , required:true} ,  
    reason:{type:String , required:true} , 
    status:{type:String , enum:["PENDING" , "APPROVED" , "REJECTED"] , default:"PENDING"}
} , {timestamps:true}) ; 

const leaveApplication = mongoose.model.leaveApplication || mongoose.model("leaveApplication" , leaveApplicationSchema) ;

export default leaveApplication ; 
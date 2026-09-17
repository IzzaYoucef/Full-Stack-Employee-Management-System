import mongoose from "mongoose"; 
import employeeModel from "./Employee";

const attendanceSchema = mongoose.Schema({
    employeeId:{type:mongoose.Schema.Types.ObjectId , ref:"Employee" , required:true} , 
    date:{type:Date , required:true} , 
    checkIn:{type:Date , default:null} , 
    checkOut:{type:Date , default:null}, 
    status:{type:String , enum:["PRESENT" , "ABSENT" , "LATE"] , default:"LATE"} , 
    workingHoures:{type:Number , default:null},
    dayType:{type:String , enum:["Full Day" , "Three Quarter Day" , "Half day" , "Short Day" , "null"] , default:null}
} ,{timestamps:true}) ;  


const Attendance = mongoose.model.Attendance || mongoose.model("Attendances" ,  attendanceSchema) ; 


export default Attendance ; 

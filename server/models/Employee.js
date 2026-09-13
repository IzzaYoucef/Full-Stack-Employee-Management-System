import mongoose from "mongoose"; 
import { DEPARTMENTS } from "../constants/departemets";

const employeeSchema = mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId , ref:"User" , required:true , unique:true} , 
    firstName:{type:String , required:true} , 
    lastName:{type:String , required:true} , 
    email:{type:String , required:true} , 
    phone:{type:String , required:true} , 
    position:{type:String , required:true} ,   
    basicSalary:{type:Number , default:0 } ,
    allownaces:{type:Number , default:0 } , 
    deductions:{type:Number , default:0 } ,
    employeeStatus:{type:String , enum:["ACTIVE" , "INACTIVE"] ,default:"ACTIVE"}, 
    joinDate:{type:Date , required:true} ,   
    departement:{type:String , enum:DEPARTMENTS} , 
    isDeleted:false
})

const employeeModel = mongoose.model.Employee || mongoose.model(employeeSchema) ; 

export default employeeModel ; 
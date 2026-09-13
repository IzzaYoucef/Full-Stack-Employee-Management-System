import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema({
    email:{type:String , required:true , unique:true} , 
    password:{type:String , required:true}, 
    role:{type:String , enum:["ADMIN" , "EMPLOYEE"] , default:"EMPLOYEE"}
} , {timestamps:true}) 

const userModel = mongoose.model.User || mongoose.model("User" , userSchema) ; 

export default userModel ; 

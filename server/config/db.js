import mongoose from 'mongoose' ;  
import dns from "dns" ;  
dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectDb = async ()=>{
    try {
       await mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("Data Base Connected")) ; 
    }catch(error){
        console.log("ERROR PROCESSED IN DATA BASE CONNECTION :" , error.message) ; 
    }   
}


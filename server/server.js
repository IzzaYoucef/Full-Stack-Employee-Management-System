import express from "express" ; 
import cors from "cors" ;  
import multer from "multer" ;    
import 'dotenv/config' ; 
import { connectDb } from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import employeeModel from "./models/Employee.js";
import employeeRouter from "./routes/employeeRoute.js";
import profileRouter from "./routes/profileRoute.js";

//  Instance of express
const app  = express() ; 
// Create a port for the server 
const PORT = process.env.PORT || 4000 ;   

// Middleware 
app.use(cors()) ; 
app.use(express.json()) ; 
app.use(multer().none()) ;  

// Data Base Connection 
await connectDb()

// create a home route 
app.get("/" , (req , res) => {
    res.send("SERVER RINNING") ; 
})

app.use("/api/auth" , authRouter) ; 
app.use("/api/employees" , employeeRouter) ;  
profileRouter.use("/api/profile"); 
// running the server 
app.listen(PORT , () => console.log(`Server runing in http://localhost:${PORT}/`))

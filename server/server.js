import express from "express" ; 
import cors from "cors" ;  
import multer from "multer" ;    
import 'dotenv/config' ; 

//  Instance of express
const app  = express() ; 
// Create a port for the server 
const PORT = process.env.PORT || 4000 ; 

// Middleware 
app.use(cors()) ; 
app.use(express.json()) ; 
app.use(multer().none) ; 

// create a home route 
app.get("/" , (req , res) => {
    res.send("SERVER RINNING") ; 
})

// running the server 
app.listen(PORT , () => console.log(`Server runing in http://localhost:${PORT}/`))

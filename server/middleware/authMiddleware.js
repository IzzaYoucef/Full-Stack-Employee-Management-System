import jwt from 'jsonwebtoken';

export const protect = (req , res ,  next) => {
    try {
        const authHeader = req.headers.authorization ; 
        if(!authHeader || !authHeader.startWith("Bearer ")){
            res.status(401).json({success:false , message:"Unauthorized"});
        } 

        const token = authHeader.split(" ")[1] ; 
        const session = jwt.verify(token , precess.env.JWT_SECRET_KEY);
        if(!session){
            return res.status(401).json({success:false , message:"Unauthorized"})
        } 
        next(); 
    } catch (error) {
        return res.status(401).json({success:false , message:error.message})
    }
}  

export const protectAdmin = (req,res,next) => {
    if(req?.session?.role !== "ADMIN"){
        return res.status(403).json({success:false , message:"Admin Access Required"})
    } 
    next() ; 
}
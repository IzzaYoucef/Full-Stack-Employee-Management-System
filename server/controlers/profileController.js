import employeeModel from "../models/Employee.js";

// GET the logged-in user's own profile
// GET /api/profile
// Nécessite le middleware "protect" en amont (fournit req.user)
export const getProfile = async (req, res) => {
    try {
        const { user_id } = req.user;

        // req.user.user_id est l'id du User (issu du JWT), pas celui de l'Employee.
        // Il faut donc chercher l'employé PAR son userId, pas par son propre _id.
        const employee = await employeeModel
            .findOne({ userId: user_id })
            .populate("userId", "email role")
            .lean();

        if (!employee) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        return res.json({
            success: true,
            data: {
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                phone: employee.phone,
                position: employee.position,
                department: employee.department,
                bio: employee.bio,
                role: employee.userId?.role,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
}; 

const updateEmployee = async (req , res) => {
  
    try {
        const {user_id} = req.user ; 
        const employee = await employeeModel.findById(user_id) ; 

        if(!employee) {
            return res.status(404).json({success:false , message:"User Not Found"}) ; 
        }

        if(!employee.isDeleted) {
            return res.status(404).json({success:false , message:"User Deleted"}) ; 
        }  

        await employeeModel.findByIdAndUpdate(user_id , {
            bio:req.body.bio
        }) ; 

        return res.status(201).json({success:false , message:"User Profile Updated"}) ; 
    } catch (error) {
        return res.status(500).json({success:false , message:error.message});
    }

}
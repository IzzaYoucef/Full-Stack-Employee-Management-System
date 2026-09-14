import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

// Login the Users : Admin and Employee
// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password, user_role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Compare le mot de passe reçu avec le hash stocké (et non l'inverse)
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        // Rejette si le rôle demandé ne correspond PAS au rôle réel
        if (user_role === "admin" && user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Not authorized as Admin" });
        }

        if (user_role === "employee" && user.role !== "EMPLOYEE") {
            return res.status(403).json({ success: false, message: "Not authorized as Employee" });
        }

        const payload = {
            user_id: user._id,
            email: user.email,
            user_role,
        };

        const token = createToken(payload);

        return res.json({
            success: true,
            data: { token, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Login failed" });
    }
}; 

// Cretae Session for the Admin/Employee 
// GET /api/auth/session

export const session = async (req , res) => {
    const session = req.session ; 
    res.json({user:session}) ;
}

// change password Admin / Employee  
// POST /api/auth/change-password 
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
 
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
 
        // req.user vient du JWT décodé par authMiddleware, pas de req.session
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
 
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }
 
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
 
        return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
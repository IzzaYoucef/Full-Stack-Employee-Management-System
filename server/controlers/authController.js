import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/User.js";
import employeeModel from "../models/Employee.js";

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

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        if (user_role === "admin" && user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Not authorized as Admin" });
        }

        if (user_role === "employee" && user.role !== "EMPLOYEE") {
            return res.status(403).json({ success: false, message: "Not authorized as Employee" });
        }

        // Bloque l'accès si le profil employé lié a été supprimé (soft-delete)
        if (user.role === "EMPLOYEE") {
            const employeeRecord = await employeeModel.findOne({ userId: user._id });
            if (employeeRecord?.isDeleted) {
                return res.status(403).json({ success: false, message: "This account has been deactivated" });
            }
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

// Renvoie l'identité de l'utilisateur connecté, déduite du JWT
// (nécessite que la route applique le middleware "protect" avant ce handler)
// GET /api/auth/session
export const session = async (req, res) => {
    return res.json({ success: true, data: req.user });
};

// change password Admin / Employee
// POST /api/auth/change-password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // req.user.user_id vient du JWT décodé par le middleware "protect"
        const user = await userModel.findById(req.user.user_id);
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
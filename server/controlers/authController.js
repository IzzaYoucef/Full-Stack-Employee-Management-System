import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/User.js";
import employeeModel from "../models/Employee.js";

const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

// Login the Users : Admin and Employee
// POST /api/auth/login   (public)
export const login = async (req, res) => {
    try {
        const { email, password, user_role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email: String(email).toLowerCase().trim() });
        // Same message for unknown email and wrong password, so accounts can't be enumerated
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Optional: the login form says which portal the person is using
        if (user_role === "admin" && user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Not authorized as Admin" });
        }
        if (user_role === "employee" && user.role !== "EMPLOYEE") {
            return res.status(403).json({ success: false, message: "Not authorized as Employee" });
        }

        // Block access if the linked employee profile was soft-deleted
        if (user.role === "EMPLOYEE") {
            const employeeRecord = await employeeModel.findOne({ userId: user._id });
            if (employeeRecord?.isDeleted) {
                return res.status(403).json({ success: false, message: "This account has been deactivated" });
            }
        }

        // The role in the token comes from the DB, never from the request body
        const payload = {
            user_id: user._id,
            email: user.email,
            user_role: user.role.toLowerCase(), // "admin" | "employee"
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

// GET /api/auth/session
export const session = async (req, res) => {
    return res.json({ success: true, data: req.user });
};

// POST /api/auth/change-password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        if (String(newPassword).length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
        }

        const user = await userModel.findById(req.user.user_id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to update password" });
    }
};

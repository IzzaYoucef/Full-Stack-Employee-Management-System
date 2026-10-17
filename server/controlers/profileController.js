import employeeModel from "../models/Employee.js";

// GET /api/profile  — the logged-in user's own profile
export const getProfile = async (req, res) => {
    try {
        const { user_id } = req.user;

        // user_id is the User's id (from the JWT), not the Employee's _id
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

// POST /api/profile  — an employee can only update their own bio
export const updateProfile = async (req, res) => {
    try {
        const { user_id } = req.user;
        const employee = await employeeModel.findOne({ userId: user_id });

        if (!employee) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (employee.isDeleted) {
            return res.status(403).json({ success: false, message: "Account is deactivated" });
        }

        employee.bio = req.body.bio ?? employee.bio;
        await employee.save();

        return res.json({ success: true, message: "Profile updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

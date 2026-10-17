import Employee from "../models/Employee.js";
import userModel from "../models/User.js";
import bcrypt from "bcrypt";

const ROLES = ["ADMIN", "EMPLOYEE"];

// GET /api/employees
export const getEmployees = async (req, res) => {
    try {
        const { department } = req.query;
        const where = { isDeleted: false }; // soft-deleted employees are hidden
        if (department) where.department = department;

        const employees = await Employee.find(where)
            .sort({ createdAt: -1 })
            .populate("userId", "email role")
            .lean();

        const result = employees.map((emp) => ({
            ...emp,
            id: emp._id.toString(),
            user: emp.userId ? { email: emp.userId.email, role: emp.userId.role } : null,
        }));

        return res.json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch employees" });
    }
};

// POST /api/employees
export const createEmployee = async (req, res) => {
    let user = null;
    try {
        const {
            firstName, lastName, email, phone, position, department,
            basicSalary, allowances, deductions, joinDate, password, role, bio,
        } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const userRole = role ? String(role).toUpperCase() : "EMPLOYEE";
        if (!ROLES.includes(userRole)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the User first so its id can be linked to the Employee
        user = await userModel.create({ email, password: hashedPassword, role: userRole });

        const employee = await Employee.create({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate: joinDate ? new Date(joinDate) : new Date(),
            bio: bio || "",
        });

        return res
            .status(201)
            .json({ success: true, data: employee, message: "Employee created successfully" });
    } catch (error) {
        // Don't leave an orphan User behind if the Employee couldn't be created
        if (user) await userModel.findByIdAndDelete(user._id).catch(() => {});

        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: error.message });
        }
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to create employee" });
    }
};

// PUT /api/employees/:id   (admin)
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, role, ...fields } = req.body;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // Only update the fields that were actually sent (don't reset the others)
        const editable = [
            "firstName", "lastName", "email", "phone", "position", "department",
            "employeeStatus", "bio",
        ];
        for (const key of editable) {
            if (fields[key] !== undefined) employee[key] = fields[key];
        }
        for (const key of ["basicSalary", "allowances", "deductions"]) {
            if (fields[key] !== undefined) employee[key] = Number(fields[key]) || 0;
        }
        if (fields.joinDate) employee.joinDate = new Date(fields.joinDate);

        await employee.save();

        // Sync the linked User account (email, role, password)
        const userUpdate = {};
        if (fields.email) userUpdate.email = fields.email;
        if (role) {
            const userRole = String(role).toUpperCase();
            if (!ROLES.includes(userRole)) {
                return res.status(400).json({ success: false, message: "Invalid role" });
            }
            userUpdate.role = userRole;
        }
        if (password) userUpdate.password = await bcrypt.hash(password, 10);

        if (Object.keys(userUpdate).length > 0) {
            await userModel.findByIdAndUpdate(employee.userId, userUpdate);
        }

        return res.json({ success: true, data: employee, message: "Employee updated successfully" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ success: false, message: error.message });
        }
        console.error(error);
        return res.status(500).json({ success: false, message: "Error updating employee" });
    }
};

// DELETE /api/employees/:id   (soft delete)
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        employee.isDeleted = true;
        employee.employeeStatus = "INACTIVE";
        await employee.save();

        return res.json({ success: true, message: "Employee has been deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

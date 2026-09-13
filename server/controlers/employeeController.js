import Employee from "../models/Employee.js"; // adaptez le chemin à votre structure de dossiers
import userModel from "../models/User.js";
import bcrypt from "bcrypt";

// GET the employees from the database
// /api/employees
export const getEmployees = async (req, res) => {
    try {
        const { department } = req.query;
        const where = {};
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

// POST Add an Employee
// /api/employees
export const createEmployee = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            position,
            department,
            basicSalary,
            allowances,
            deductions,
            joinDate,
            password,
            role,
            bio,
        } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Crée d'abord le compte User, pour pouvoir lier son id à l'employé
        const user = await userModel.create({
            email,
            password: hashedPassword,
            role: role || "EMPLOYEE",
        });

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
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to create employee" });
    }
};

// PUT Update an employee in the database
// /api/employees/:id
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            firstName,
            lastName,
            email,
            phone,
            position,
            department,
            basicSalary,
            allowances,
            deductions,
            employeeStatus,
            password,
            role,
            bio,
        } = req.body;

        // On vérifie l'existence via l'id des params
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // Met à jour l'employé — on garde l'ancienne valeur si le champ n'est pas envoyé
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                firstName,
                lastName,
                email,
                phone,
                position,
                department: department || employee.department || "Engineering",
                basicSalary: basicSalary !== undefined ? Number(basicSalary) : employee.basicSalary,
                allowances: Number(allowances) || 0,
                deductions: Number(deductions) || 0,
                employeeStatus: employeeStatus || "ACTIVE",
                bio: bio || "", 
                isDeleted: false
            },
            { new: true } // renvoie le document mis à jour, pas l'ancien
        );

        // Met à jour le compte User lié (email, rôle, mot de passe)
        const userUpdate = {};
        if (email) userUpdate.email = email;
        if (role) userUpdate.role = role;
        if (password) userUpdate.password = await bcrypt.hash(password, 10);

        if (Object.keys(userUpdate).length > 0) {
            await userModel.findByIdAndUpdate(employee.userId, userUpdate);
        }

        return res.json({
            success: true,
            data: updatedEmployee,
            message: "Employee updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Error in User/Employee update function" });
    }
};

// DELETE Delete an employee from the database
// /api/employees/:id
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifie que l'employé existe (avec await, sinon on teste une Promise, toujours truthy)
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        employee.isDeleted = true ;  
        employee.employeeStatus = "INACTIVE" , 
        await employee.svae(); 

        return res.json({ success: true, message: "Employee has been deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
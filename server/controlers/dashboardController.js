import Employee from "../models/Employee.js";
import Attendance from "../models/Attendances.js";
import LeaveApplication from "../models/LeaveApplication.js";
import Payslip from "../models/Payslip.js";

// GET /api/dashboard  (admin and employee)
export const getDashboard = async (req, res) => {
    try {
        const { user_role, user_id } = req.user;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // ---------- ADMIN ----------
        if (user_role === "admin") {
            const [totalEmployees, todayAttendances, pendingLeaves] = await Promise.all([
                Employee.countDocuments({ isDeleted: false }),
                Attendance.countDocuments({ date: today }),
                LeaveApplication.countDocuments({ status: "PENDING" }),
            ]);

            return res.json({
                success: true,
                data: { role: "ADMIN", totalEmployees, todayAttendances, pendingLeaves },
            });
        }

        // ---------- EMPLOYEE ----------
        const employee = await Employee.findOne({ userId: user_id }).lean();

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        if (employee.isDeleted) {
            return res.status(403).json({ success: false, message: "Account is deactivated" });
        }

        const [todayAttendance, pendingLeaves, payslipsCount] = await Promise.all([
            Attendance.findOne({ employeeId: employee._id, date: today }).lean(),
            LeaveApplication.countDocuments({ employeeId: employee._id, status: "PENDING" }),
            Payslip.countDocuments({ employeeId: employee._id }),
        ]);

        return res.json({
            success: true,
            data: {
                role: "EMPLOYEE",
                employee: {
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    position: employee.position,
                    department: employee.department,
                },
                todayAttendance, // null if not checked in yet
                pendingLeaves,
                payslipsCount,
            },
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
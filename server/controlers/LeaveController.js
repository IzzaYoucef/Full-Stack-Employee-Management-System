import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";

// POST /api/leave
export const createLeave = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.session.userId });

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    if (employee.isDeleted) {
      return res.status(403).json({ success: false, message: "Account is deactivated" });
    }

    const { type, startDate, endDate, reason } = req.body;

    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today || end < today) {
      return res.status(400).json({ success: false, message: "Dates must be in the future" });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after or equal to start date",
      });
    }

    const leave = await LeaveApplication.create({
      employeeId: employee._id,
      type,
      startDate: start,
      endDate: end,
      reason,
      status: "PENDING",
    });

    return res.status(201).json({ success: true, data: leave });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/leave
export const getLeaves = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.session.userId });

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const leaves = await LeaveApplication.find({ employeeId: employee._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
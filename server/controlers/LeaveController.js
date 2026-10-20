import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import { inngest } from "../inngest/inngest.js";

// POST /api/leave
export const createLeave = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.user_id });

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

    // Start the background job (admin reminder after 24h). A failure here must not break the request.
    try {
      await inngest.send({
        name: "leave/pending",
        data: { leaveApplicationId: leave._id.toString() },
      });
    } catch (err) {
      console.error("Inngest send failed (leave/pending):", err.message);
    }

    return res.status(201).json({ success: true, data: leave });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/leave
export const getLeaves = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.user_id });

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
// GET /api/leave/all?status=PENDING   (admin)
export const getAllLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status filter" });
      }
      filter.status = status;
    }

    const leaves = await LeaveApplication.find(filter)
      .populate("employeeId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/leave/:id/status   (admin)   body: { "status": "APPROVED" }
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be APPROVED or REJECTED",
      });
    }

    const leave = await LeaveApplication.findById(id);

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    if (leave.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Leave already ${leave.status.toLowerCase()}`,
      });
    }

    leave.status = status;
    await leave.save();

    return res.status(200).json({ success: true, data: leave });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
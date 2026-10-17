import Payslip from "../models/Payslip.js";
import Employee from "../models/Employee.js";

const format = (p) => ({
  ...p,
  id: p._id.toString(),
  employee: p.employeeId,
  employeeId: p.employeeId?._id?.toString(),
});

const isAdmin = (req) => req.user?.user_role === "admin";

// POST /api/payslips   (admin)
export const createPayslip = async (req, res) => {
  try {
    const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;

    if (!employeeId || !month || !year || basicSalary === undefined || basicSalary === "") {
      return res.status(400).json({ success: false, message: "Missing field" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);
    if (netSalary < 0) {
      return res.status(400).json({ success: false, message: "Deductions cannot exceed salary + allowances" });
    }

    const payslip = await Payslip.create({
      employeeId,
      month: Number(month),
      year: Number(year),
      basicSalary: Number(basicSalary),
      allowances: Number(allowances || 0),
      deductions: Number(deductions || 0),
      netSalary,
    });

    return res.status(201).json({ success: true, data: payslip });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "A payslip already exists for this employee and month" });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/payslips   (admin: all, employee: own)
export const getPayslips = async (req, res) => {
  try {
    let filter = {};

    if (!isAdmin(req)) {
      const employee = await Employee.findOne({ userId: req.user.user_id });
      if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
      filter = { employeeId: employee._id };
    }

    const payslips = await Payslip.find(filter)
      .populate("employeeId")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, data: payslips.map(format) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/payslips/:id   (admin: any, employee: only their own)
export const getPayslipById = async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id).populate("employeeId").lean();
    if (!payslip) return res.status(404).json({ success: false, message: "Not found" });

    if (!isAdmin(req) && payslip.employeeId?.userId?.toString() !== String(req.user.user_id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.json({ success: true, data: format(payslip) });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

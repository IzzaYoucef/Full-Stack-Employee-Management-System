import Payslip from "../models/Payslip.js";
import Employee from "../models/Employee.js"; // ADAPTE : ton modèle Employee

const format = (p) => ({
  ...p,
  id: p._id.toString(),
  employee: p.employeeId,
  employeeId: p.employeeId?._id?.toString(),
});

// POST /api/payslips
export const createPayslip = async (req, res) => {
  try {
    const { employeeId, month, year, basicSalary, allownces, deductions } = req.body;

    if (!employeeId || !month || !year || !basicSalary) {
      return res.status(400).json({ success: false, message: "Missing field" });
    }

    const netSalary = Number(basicSalary) + Number(allownces || 0) - Number(deductions || 0);

    const payslip = await Payslip.create({
      employeeId,
      month: Number(month),
      year: Number(year),
      basicSalary: Number(basicSalary),
      allownces: Number(allownces || 0),
      deductions: Number(deductions || 0),
      netSalary,
    });

    return res.status(201).json({ success: true, data: payslip });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/payslips
export const getPayslips = async (req, res) => {
  try {
    const session = req.user; 
    let filter = {};

    if (session.role !== "ADMIN") {
      const employee = await Employee.findOne({ userId: session.id }); // ADAPTE
      if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
      filter = { employeeId: employee._id };
    }

    const payslips = await Payslip.find(filter)
      .populate("employeeId")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, data: payslips.map(format) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/payslips/:id
export const getPayslipById = async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id).populate("employeeId").lean();
    if (!payslip) return res.status(404).json({ success: false, message: "Not found" });

    return res.json({ success: true, data: format(payslip) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
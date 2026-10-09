import mongoose from "mongoose";

const payslipSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2000 },
    basicSalary: { type: Number, required: true, min: 0 },
    allowances: { type: Number, default: 0, min: 0 },
    deductions: { type: Number, default: 0, min: 0 },
    netSalary: { type: Number, min: 0 },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Payslip = mongoose.models.Payslip || mongoose.model("Payslip", payslipSchema);

export default Payslip;
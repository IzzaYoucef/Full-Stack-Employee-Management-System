import mongoose from "mongoose";
import { DEPARTMENTS } from "../constants/departments"; // vérifiez l'orthographe réelle du fichier

const employeeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    basicSalary: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    employeeStatus: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    joinDate: { type: Date, required: true },
    department: { type: String, enum: DEPARTMENTS },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const employeeModel = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default employeeModel;
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
        date: { type: Date, required: true }, // normalised to midnight (local time) of the day
        checkIn: { type: Date, default: null },
        checkOut: { type: Date, default: null },
        status: { type: String, enum: ["PRESENT", "ABSENT", "LATE"], default: "PRESENT" },
        workingHours: { type: Number, default: null },
        dayType: { type: String, enum: ["Full Day", "Three Quarters Day", "Half Day", "Short Day"] },
    },
    { timestamps: true }
);

// One attendance record per employee per day (also prevents double check-in races)
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);

export default Attendance;

import Attendance from "../models/Attendances.js";
import employeeModel from "../models/Employee.js";

// An employee arriving after this time is marked LATE
const WORK_START_HOUR = 9;
const WORK_START_MINUTE = 30;

// POST /api/attendances  — first call = check-in, second call = check-out
export const clockInOut = async (req, res) => {
    try {
        const employee = await employeeModel.findOne({ userId: req.user.user_id });

        if (!employee) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (employee.isDeleted) {
            return res
                .status(403)
                .json({ success: false, message: "Your account is deactivated, you cannot do this action" });
        }

        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const existing = await Attendance.findOne({ employeeId: employee._id, date: today });

        // ---- Check-in ----
        if (!existing) {
            const isLate =
                now.getHours() > WORK_START_HOUR ||
                (now.getHours() === WORK_START_HOUR && now.getMinutes() > WORK_START_MINUTE);

            const attendance = await Attendance.create({
                employeeId: employee._id,
                date: today,
                checkIn: now,
                status: isLate ? "LATE" : "PRESENT",
            });
            return res.status(201).json({ success: true, type: "CHECK_IN", data: attendance });
        }

        // ---- Check-out ----
        if (!existing.checkOut) {
            const diffHours = (now.getTime() - new Date(existing.checkIn).getTime()) / (1000 * 60 * 60);
            const workingHours = parseFloat(diffHours.toFixed(2));

            let dayType = "Short Day";
            if (workingHours >= 8) dayType = "Full Day";
            else if (workingHours >= 6) dayType = "Three Quarters Day";
            else if (workingHours >= 4) dayType = "Half Day";

            existing.checkOut = now;
            existing.workingHours = workingHours;
            existing.dayType = dayType;
            await existing.save();

            return res.json({ success: true, type: "CHECK_OUT", data: existing });
        }

        // ---- Already checked in and out today ----
        return res
            .status(400)
            .json({ success: false, message: "You have already checked in and out today" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/attendances?limit=30
export const getAttendance = async (req, res) => {
    try {
        const employee = await employeeModel.findOne({ userId: req.user.user_id });
        if (!employee) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 30, 1), 365);
        const history = await Attendance.find({ employeeId: employee._id })
            .sort({ date: -1 })
            .limit(limit);

        return res.json({
            success: true,
            data: history,
            employee: { isDeleted: employee.isDeleted },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

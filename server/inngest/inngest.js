import { Inngest } from "inngest";
import nodemailer from "nodemailer";
import Attendance from "../models/Attendances.js";
import employeeModel from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import transporter from "../config/nodemailer.js"
export const inngest = new Inngest({ id: "full-stack-employee-management-system" });



const autoCheckOut = inngest.createFunction(
  { id: "auto-check-out" , triggers:[{event: "employee/check-in"}] },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    // Wait 9 hours after check-in
    await step.sleep("wait-for-9-hours", "9h");

    // Has the employee checked out yet
    const attendance = await step.run("get-attendance", () =>
      Attendance.findById(attendanceId).lean()
    );

    if (!attendance || attendance.checkOut) return { status: "already-checked-out" };

    // Send a reminder email
    const employee = await step.run("get-employee", () =>
      employeeModel.findById(employeeId).lean()
    );

    await step.run("send-reminder-email", () =>
      transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: employee.email,
        subject: "Reminder: please check out",
        text: `Hi ${employee.name}, you've been checked in for 9 hours. Please remember to check out.`,
      })
    );

    //  Wait 1 more hour (10 hours total)
    await step.sleep("wait-1-more-hour", "1h");

    // Re-check, then mark as LATE if still not checked out
    await step.run("mark-late-if-needed", async () => {
      const latest = await Attendance.findById(attendanceId);
      if (latest && !latest.checkOut) {
        latest.status = "LATE";
        await latest.save();
        return { marked: true };
      }
      return { marked: false };
    });
  }
); 
 

// Remind the admin if a leave application is still pending after 24 hours
const leaveApplicationReminder = inngest.createFunction(
  { id: "leave-application-reminder" , triggers:[{event: "leave/pending" }] },
  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    // Wait 24 hours
    await step.sleep("wait-for-24-hours", "24h");

    //  Is the application still pending
    const leaveApplication = await step.run("get-leave-application", () =>
      LeaveApplication.findById(leaveApplicationId).lean()
    );

    if (!leaveApplication) return { status: "leave-application-not-found" };
    if (leaveApplication.status !== "PENDING") {
      return { status: `already-${leaveApplication.status.toLowerCase()}` };
    }

    // Get the employee who applied (for the email content)
    const employee = await step.run("get-employee", () =>
      employeeModel.findById(leaveApplication.employeeId).lean()
    );

    // Remind the admin
    await step.run("send-admin-reminder", () =>
      transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: "Reminder: leave application awaiting your action",
        text: `${employee?.name ?? "An employee"}'s leave application has been pending for 24 hours. Please approve or reject it`,
      })
    );

    return { status: "reminder-sent" };
  }
); 

const attendanceReminderCron = inngest.createFunction(
  { id: "attendance-reminder" , triggers:[{cron: "TZ=Europe/Paris 0 9 * * 1-5"}] },
  async ({ step }) => {
    // Start of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Who already checked in today?
    const checkedInIds = await step.run("get-checked-in", async () => {
      const records = await Attendance.find({ date: { $gte: startOfDay } })
        .select("employeeId")
        .lean();
      return records.map((r) => r.employeeId.toString());
    });

    // Employees who haven't (skip anyone on approved leave)
    const missing = await step.run("get-missing-employees", async () => {
      const onLeave = await LeaveApplication.find({
        status: "APPROVED",
        startDate: { $lte: new Date() },
        endDate: { $gte: startOfDay },
      })
        .select("employeeId")
        .lean();

      const excluded = [...checkedInIds, ...onLeave.map((l) => l.employeeId.toString())];

      return employeeModel
        .find({ _id: { $nin: excluded } })
        .select("name email")
        .lean();
    });

    //  Send reminders
    await step.run("send-reminders", () =>
      Promise.all(
        missing.map((emp) =>
          transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: emp.email,
            subject: "Reminder: you haven't checked in today",
            text: `Hi ${emp.name}, you haven't checked in yet today. Please check in.`,
          })
        )
      )
    );

    return { reminded: missing.length };
  }
);

export const functions = [autoCheckOut, leaveApplicationReminder, attendanceReminderCron];

import "dotenv/config";              
import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDb } from "./config/db.js";
import userModel from "./models/User.js";

async function createAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();

    if (!adminEmail) {
        console.error("ADMIN_EMAIL is missing in the .env file");
        process.exit(1);
    }
    const password = process.env.ADMIN_PASSWORD ; 
    if(!password){
        console.log("Password does not exist in .env file"); 
        process.exit(1) ;  
    } 
    let exitCode = 0;

    try {
        await connectDb();                                 

        const existingAdmin = await userModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            // Account already exists: reset its password to ADMIN_PASSWORD from .env and make sure it is ADMIN
            existingAdmin.password = await bcrypt.hash(password, 10);
            existingAdmin.role = "ADMIN";
            await existingAdmin.save();
            console.log("Admin already existed: password reset to ADMIN_PASSWORD from .env");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
        });

        console.log("Admin created successfully");
        console.log("admin_email    :", adminEmail); 
        console.log("Password : " , hashedPassword) ; 
        console.log("Change the password after the first login");
    } catch (error) {
        console.error("ERROR:", error.message);
        exitCode = 1;
    } finally {
        await mongoose.disconnect();                         
        process.exit(exitCode);
    }
}

createAdmin(); // run the script with the commande npm run seed , I added this script in package.json scripts phase 
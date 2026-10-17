import mongoose from "mongoose";
import dns from "dns";

// Workaround for networks where SRV lookups (mongodb+srv://) fail with the default resolver
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected");
    } catch (error) {
        console.error("DATABASE CONNECTION ERROR:", error.message);
        process.exit(1); // no point running the API without a database
    }
};

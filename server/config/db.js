import mongoose from "mongoose";
import dns from "dns";

// Local-only workaround for networks where SRV lookups (mongodb+srv://) fail with the default resolver.
// Skipped on Vercel, where DNS works out of the box.
if (!process.env.VERCEL) {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

// On serverless platforms the module stays in memory between invocations,
// so we cache the connection promise and reuse it instead of reconnecting on every request.
let connectionPromise = null;

export const connectDb = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
    }

    // Already connected
    if (mongoose.connection.readyState === 1) return mongoose.connection;

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
            .then((m) => {
                console.log("Database connected");
                return m.connection;
            })
            .catch((error) => {
                connectionPromise = null; // allow a retry on the next request
                console.error("DATABASE CONNECTION ERROR:", error.message);
                throw error; // never process.exit() on serverless
            });
    }

    return connectionPromise;
};

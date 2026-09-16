import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = decoded; // { user_id, email, user_role }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

// À utiliser après "protect" — s'appuie sur req.user déjà renseigné
export const protectAdmin = (req, res, next) => {
    if (req.user?.user_role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
};
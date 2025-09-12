import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("decoded -"+JSON.stringify(decoded));

        const user = await User.findOne({ email: decoded.email }).select("_id email name");
        if (!user) {
            return res.status(401).json({ error: "Invalid token: user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("AuthMiddleware error:", error.message);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;

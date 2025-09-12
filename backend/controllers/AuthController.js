import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'
import UserBroswer from '../models/UserBroswer.js';

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("(regsiter)req.body -",JSON.stringify(req.body));
        console.log("name -",name);
        console.log("email -",email);
        console.log("password -",password);
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        console.log("existingUser -",JSON.stringify(existingUser));
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const newUser = new User({ name, email, password });
        console.log("newUser -",JSON.stringify(newUser));
        await newUser.save();

        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const broswerId = req.headers['x-broswer-id'];
        const broswerName = req.headers['user-agent'] || "Unknown";

        console.log("req.body -",JSON.stringify(req.body));
        console.log("email -",email);
        console.log("password -",password);

        const user = await User.findOne({ email });
        console.log("user exit-", JSON.stringify(user));
        if (!user) return res.status(400).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        console.log("user validPassword-", JSON.stringify(validPassword));
        if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

        // Check broswer already linked to user
        let userBroswer = await UserBroswer.findOne({ user_id: user._id, broswer_id: broswerId });
        if (!userBroswer) {
            userBroswer = new UserBroswer({
                user_id: user._id,
                broswer_id: broswerId,
                broswer_name: broswerName,
            });
            await userBroswer.save();
            console.log("New broswer registered for user:", user.email);
        }

        // Generate JWT
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        console.log("user token-", JSON.stringify(token));
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const Profile = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findOne({ email: decoded.email }).select("_id, email, name");
        return res.json(user);
    } catch (err) {
        if (err) return res.status(403).json({ error: "Invalid token" });
    }
}

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token required"});
    }

    try {
        const decoded = jwt.sign(refreshToken, processs.env.JWT_SECRET);
        const accessToken = jwt.sign( userId, decoded.user_id )
        return res.json({ accessToken});
    } catch (error) {
        return res.status(401).json({ error: "Invalid refresh token."});
    }
}

export const AppLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("req.body -",JSON.stringify(req.body));
        console.log("email -",email);
        console.log("password -",password);

        const user = await User.findOne({ email });
        console.log("user exit-", JSON.stringify(user));
        if (!user) return res.status(400).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        console.log("user validPassword-", JSON.stringify(validPassword));
        if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1d" });
        console.log("user token-", JSON.stringify(token));
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const validateToken = async (req, res) => {
  return res.json({ valid: true, user: req.user });
}

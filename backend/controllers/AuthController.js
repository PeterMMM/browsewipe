import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'
import UserBrowser from '../models/UserBrowser.js';

export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const browserId = req.headers['x-browser-id'];
        const profileUuid = req.headers['x-profile-uuid'];
        const profileLabel = req.headers['x-profile-label'] || null;
        const browserName = req.headers['user-agent'] || "Unknown";
        const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
        const EXPIRE_TIME = process.env.EXPIRE_TIME || "7d";

        // Validate required headers
        if (!browserId) {
            return res.status(400).json({ error: "Browser ID is required" });
        }
        if (!profileUuid) {
            return res.status(400).json({ error: "Profile UUID is required" });
        }

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(profileUuid)) {
            return res.status(400).json({ error: "Invalid profile UUID format" });
        }

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

        // Sanitize profile label
        const sanitizedLabel = profileLabel ?
            profileLabel.replace(/[<>\"'&]/g, '').substring(0, 100) : null;

        // Upsert browser profile with profile UUID
        await UserBrowser.findOneAndUpdate(
            {
                user_id: user._id,
                browser_id: browserId,
                profile_uuid: profileUuid
            },
            {
                $set: {
                    browser_name: browserName,
                    profile_label: sanitizedLabel
                }
            },
            {
                upsert: true,
                new: true
            }
        );

        console.log("Profile login successful:", {
            user: user.email,
            browserId: browserId,
            profileUuid: profileUuid,
            profileLabel: sanitizedLabel
        });

        // Generate JWT
        console.log("EXPIRE_TIME(login) - " + EXPIRE_TIME);
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: EXPIRE_TIME });

        res.json({
            token,
            user,
            profile: {
                uuid: profileUuid,
                label: sanitizedLabel
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const Profile = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

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
        const decoded = jwt.sign(refreshToken, process.env.JWT_SECRET);
        const accessToken = jwt.sign(userId, decoded.user_id);
        return res.json({ accessToken });
    } catch (error) {
        return res.status(401).json({ error: "Invalid refresh token."});
    }
}

export const AppLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
        const EXPIRE_TIME = process.env.EXPIRE_TIME || "7d";

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

        // Generate JWT
        console.log("EXPIRE_TIME(app login) - " + EXPIRE_TIME);
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: EXPIRE_TIME });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const validateToken = async (req, res) => {
    if (req.token && req.user) {
        return res.status(200).json({ token: req.token, user: req.user });
    }
}

export const updateProfileLabel = async (req, res) => {
    try {
        const { profileLabel } = req.body;
        const userId = req.user._id;
        const browserId = req.headers['x-browser-id'];
        const profileUuid = req.headers['x-profile-uuid'];

        if (!browserId || !profileUuid) {
            return res.status(400).json({ error: "Browser ID and Profile UUID are required" });
        }

        // Sanitize profile label
        const sanitizedLabel = profileLabel ?
            profileLabel.replace(/[<>\"'&]/g, '').substring(0, 100) : null;

        const userBrowser = await UserBrowser.findOneAndUpdate(
            {
                user_id: userId,
                browser_id: browserId,
                profile_uuid: profileUuid
            },
            {
                $set: { profile_label: sanitizedLabel }
            },
            { new: true }
        );

        if (!userBrowser) {
            return res.status(404).json({ error: "Browser profile not found" });
        }

        res.json({
            success: true,
            profile: {
                browser_id: userBrowser.browser_id,
                uuid: userBrowser.profile_uuid,
                label: userBrowser.profile_label
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const Logout = async (req, res) => {
    try {
        const userId = req.user._id;
        const browserId = req.headers['x-browser-id'];
        const profileUuid = req.headers['x-profile-uuid'];

        // Validate required headers
        if (!browserId) {
            return res.status(400).json({ error: "Browser ID is required" });
        }
        if (!profileUuid) {
            return res.status(400).json({ error: "Profile UUID is required" });
        }

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(profileUuid)) {
            return res.status(400).json({ error: "Invalid profile UUID format" });
        }

        // Find and delete the browser profile record
        const deletedBrowser = await UserBrowser.findOneAndDelete({
            user_id: userId,
            browser_id: browserId,
            profile_uuid: profileUuid
        });

        if (!deletedBrowser) {
            return res.status(404).json({ error: "Browser profile not found" });
        }

        console.log("Browser profile deleted on logout:", {
            user_id: userId,
            browser_id: browserId,
            profile_uuid: profileUuid,
            profile_label: deletedBrowser.profile_label
        });

        res.json({
            success: true,
            message: "Logged out successfully and browser data removed",
            deletedProfile: {
                browser_id: deletedBrowser.browser_id,
                profile_uuid: deletedBrowser.profile_uuid,
                profile_label: deletedBrowser.profile_label
            }
        });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Server error during logout" });
    }
};

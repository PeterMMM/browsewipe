import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'
import UserBroswer from '../models/UserBroswer.js';

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

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
        const broswerId = req.headers['x-broswer-id'];
        const profileUuid = req.headers['x-profile-uuid'];
        const profileLabel = req.headers['x-profile-label'] || null;
        const broswerName = req.headers['user-agent'] || "Unknown";

        // Validate required headers
        if (!broswerId) {
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
        await UserBroswer.findOneAndUpdate(
            {
                user_id: user._id,
                broswer_id: broswerId,
                profile_uuid: profileUuid
            },
            {
                $set: {
                    broswer_name: broswerName,
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
            broswerId: broswerId,
            profileUuid: profileUuid,
            profileLabel: sanitizedLabel
        });

        // Generate JWT
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });

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

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1d" });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const validateToken = async (req, res) => {
  return res.json({ valid: true, user: req.user });
}

export const updateProfileLabel = async (req, res) => {
    try {
        const { profileLabel } = req.body;
        const userId = req.user._id;
        const broswerId = req.headers['x-broswer-id'];
        const profileUuid = req.headers['x-profile-uuid'];

        if (!broswerId || !profileUuid) {
            return res.status(400).json({ error: "Browser ID and Profile UUID are required" });
        }

        // Sanitize profile label
        const sanitizedLabel = profileLabel ?
            profileLabel.replace(/[<>\"'&]/g, '').substring(0, 100) : null;

        const userBroswer = await UserBroswer.findOneAndUpdate(
            {
                user_id: userId,
                broswer_id: broswerId,
                profile_uuid: profileUuid
            },
            {
                $set: { profile_label: sanitizedLabel }
            },
            { new: true }
        );

        if (!userBroswer) {
            return res.status(404).json({ error: "Browser profile not found" });
        }

        res.json({
            success: true,
            profile: {
                broswer_id: userBroswer.broswer_id,
                uuid: userBroswer.profile_uuid,
                label: userBroswer.profile_label
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const Logout = async (req, res) => {
    try {
        const userId = req.user._id;
        const broswerId = req.headers['x-broswer-id'];
        const profileUuid = req.headers['x-profile-uuid'];

        // Validate required headers
        if (!broswerId) {
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
        const deletedBrowser = await UserBroswer.findOneAndDelete({
            user_id: userId,
            broswer_id: broswerId,
            profile_uuid: profileUuid
        });

        if (!deletedBrowser) {
            return res.status(404).json({ error: "Browser profile not found" });
        }

        console.log("Browser profile deleted on logout:", {
            user_id: userId,
            broswer_id: broswerId,
            profile_uuid: profileUuid,
            profile_label: deletedBrowser.profile_label
        });

        res.json({
            success: true,
            message: "Logged out successfully and browser data removed",
            deletedProfile: {
                broswer_id: deletedBrowser.broswer_id,
                profile_uuid: deletedBrowser.profile_uuid,
                profile_label: deletedBrowser.profile_label
            }
        });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Server error during logout" });
    }
};

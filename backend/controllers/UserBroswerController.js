import UserBroswer from "../models/UserBroswer.js";

export const broswersList = async (req, res) => {
    console.log("Hit broswerUser list  check api");
    try {
        const userId = req.user._id; // from JWT payload

        const browsers = await UserBroswer.find({ user_id: userId }).sort({ createdAt: -1 });

        return res.json(browsers);
    } catch (err) {
        console.error("Get browsers error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

export const updateBroswerEmergencyAction = async (req, res) => {
    console.log("Hit broswerUser Enable  check api");
    console.log("req.method:", req.method);
    console.log("req.originalUrl:", req.originalUrl);
    console.log("req.headers:", req.headers);
    console.log("req.user:", req.user);

    console.log("req.user"+JSON.stringify(req.user));
    try {
        const browserId = req.params.id;
        const userId = req.user._id; // from auth middleware

        const browser = await UserBroswer.findOne({
        _id: browserId,
        user_id: userId,
        });

        if (!browser) {
        return res.status(404).json({ message: "Browser not found" });
        }

        browser.emergency_action = !browser.emergency_action;
        await browser.save();

        return res.json({
        success: true,
        message: "Emergency action triggered!",
        browser,
        });
    } catch (err) {
        console.error("Emergency action error:", err);
        res.status(500).json({ message: "Server error" });
    }

}

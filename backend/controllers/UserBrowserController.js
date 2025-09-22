import UserBrowser from "../models/UserBrowser.js";

export const browsersList = async (req, res) => {
    console.log("Hit browserUser list check api");
    try {
        const userId = req.user._id;
        const browsers = await UserBrowser.find({ user_id: userId }).sort({ createdAt: -1 });

        // Format response to include profile information
        const profileList = browsers.map(browser => ({
            _id: browser._id,
            browser_id: browser.browser_id,
            browser_name: browser.browser_name,
            profile_uuid: browser.profile_uuid,
            profile_label: browser.profile_label || `Profile ${browser.profile_uuid?.slice(0, 8) || 'Unknown'}`,
            emergency_action: browser.emergency_action,
            createdAt: browser.createdAt,
            updatedAt: browser.updatedAt
        }));

        return res.json(profileList);
    } catch (err) {
        console.error("Get browsers error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

export const updateBrowserEmergencyAction = async (req, res) => {
    try {
        const browserId = req.params.id;
        const userId = req.user._id;

        const browser = await UserBrowser.findOne({
            _id: browserId,
            user_id: userId,
        });

        if (!browser) {
            return res.status(404).json({ message: "Browser profile not found" });
        }

        browser.emergency_action = !browser.emergency_action;
        await browser.save();

        return res.json({
            success: true,
            message: `Emergency action ${browser.emergency_action ? 'enabled' : 'disabled'} for profile`,
            browser: {
                _id: browser._id,
                browser_id: browser.browser_id,
                profile_uuid: browser.profile_uuid,
                profile_label: browser.profile_label,
                emergency_action: browser.emergency_action
            }
        });
    } catch (err) {
        console.error("Emergency action error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

import UserBroswer from "../models/UserBroswer.js";

export const checkEmergencyAction = async (req, res) => {
    console.log("Hit emergency check api");
    console.log("req.method:", req.method);
    console.log("req.originalUrl:", req.originalUrl);
    console.log("req.headers:", req.headers);
    console.log("req.user:", req.user);

    console.log("req.user"+JSON.stringify(req.user));
    const broswerId = req.headers['x-broswer-id'];
    console.log("Received broswerId:", broswerId);
    if (!broswerId) {
        return res.json({
            message: "Something wrong! Broswer Id not exit! Contact to developer.",
            emergency_action: false
        });
    }
    const broswerName = req.headers['user-agent'] || "Unknown";

    console.log("Authenticated call to emergency endpoint from:", req.user.email);
    console.log("Authenticated call to emergency endpoint from req.user._id:", req.user._id);
    console.log("Authenticated call to emergency endpoint, broswerId:", broswerId);
    console.log("Authenticated call to emergency endpoint, broswerName:", broswerName);

    try {
        const record = await UserBroswer.findOne({
            broswer_id: broswerId,
            user_id: req.user._id
        }).select("emergency_action");
        console.log("record: ",JSON.stringify(record));
        return res.status(200).json({
            message: record?.emergency_action ? "Clear all data!" : "No emergency action required.",
            emergency_action: record?.emergency_action
        });
    } catch (err) {
        if (err) return res.status(403).json({ error: "Fail to call Emergency Action!" });
    }
}

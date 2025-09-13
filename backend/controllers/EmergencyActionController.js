import UserBroswer from "../models/UserBroswer.js";

export const checkEmergencyAction = async (req, res) => {
    const browserId = req.headers['x-broswer-id'];
    const profileUuid = req.headers['x-profile-uuid'];
    
    console.log("Received browserId:", browserId);
    console.log("Received profileUuid:", profileUuid);
    
    if (!browserId) {
        return res.json({
            message: "Something wrong! Browser Id not exit! Contact to developer.",
            emergency_action: false
        });
    }
    
    if (!profileUuid) {
        return res.json({
            message: "Something wrong! Profile UUID not exit! Contact to developer.",
            emergency_action: false
        });
    }
    const browserName = req.headers['user-agent'] || "Unknown";
    console.log("Authenticated call to emergency endpoint, browserName:", browserName);

    try {
        const record = await UserBroswer.findOne({
            broswer_id: browserId,
            profile_uuid: profileUuid,
            user_id: req.user._id
        }).select("emergency_action profile_uuid profile_label");
        console.log("record: ", JSON.stringify(record));
        
        return res.status(200).json({
            message: record?.emergency_action ? "Clear all data!" : "No emergency action required.",
            emergency_action: record?.emergency_action || false,
            profile_uuid: record?.profile_uuid,
            profile_label: record?.profile_label
        });
    } catch (err) {
        if (err) return res.status(403).json({ error: "Fail to call Emergency Action!" });
    }
}

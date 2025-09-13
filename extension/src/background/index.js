/**
 * Life Cycle of server worker
 *
 * 1) Installation
 * 2) Startup
 * 3) Shutdown idle
 */
const API_URL = process.env.REACT_APP_API_URL;

const emergencyActionUrl = `${API_URL}/check-emergency-action`;
console.log("emergencyActionUrl-"+emergencyActionUrl);
/**
 * Handles the logic for checking the emergency action API and clearing data.
 */
const checkEmergencyAction = async () => {
    console.log("Service Worker: Checking for emergency action status...");

    try {
        const result = await chrome.storage.local.get(['authToken']);
        const token = result.authToken ?? null;

        const resultBroswerId = await chrome.storage.local.get("broswerId");
        const broswerId = resultBroswerId.broswerId;

        console.log("result- "+JSON.stringify(result));
        console.log("token- "+JSON.stringify(token));
        console.log("broswerId before call- "+JSON.stringify(broswerId));
        if (!token) {
            console.error('Service Worker: No token available. Cannot call API.');
            return;
        }

        const response = await fetch(emergencyActionUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Broswer-Id': broswerId,
            },
        });

        const data = await response.json();
        console.log("Service Worker: API response data:", JSON.stringify(data));

        if (response.ok && data.emergency_action) {
            console.warn("Service Worker: Emergency action triggered! Clearing browser data...");

            // Clear cache, cookies, and history
            const yesterday = (new Date()).getTime() - (24 * 60 * 60 * 1000);
            chrome.browsingData.remove({
                "since": yesterday // clear from the beginning of time , 0 => for forever, yesterday => for yesterday
            }, {
                "cache": true,
                "cookies": true,
                "history": true
            }, () => {
                console.log("Service Worker: Browser cache, cookies, and history have been cleared.");
            });

        } else {
            console.log("Service Worker: No emergency action required.");
        }
    } catch (error) {
        console.error("Service Worker: Failed to fetch emergency action status. Error:", error.message);
    }
};

// Listen for when the browser starts up
chrome.runtime.onStartup.addListener(() => {
    console.log("Service Worker: Browser startup detected.");
    updateBroswerId();
    checkEmergencyAction();
});

// Listen for when the extension is installed or updated (which acts like a reload)
chrome.runtime.onInstalled.addListener(() => {
    console.log("Service Worker: Extension installed or reloaded.");
    updateBroswerId();
    checkEmergencyAction();
});

const updateBroswerId = async () => {
    let { broswerId } = await chrome.storage.local.get("broswerId");
    if (!broswerId) {
        broswerId = chrome.runtime.id;
        await chrome.storage.local.set({ broswerId });
        console.log("Generated new broswerId:", broswerId);
    } else {
        console.log("Exiting broswerId:",broswerId);
    }
}

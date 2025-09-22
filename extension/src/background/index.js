/**
 * Life Cycle of server worker
 *
 * 1) Installation
 * 2) Startup
 * 3) Shutdown idle
 */
const API_URL = process.env.REACT_APP_API_URL;

const emergencyActionUrl = `${API_URL}/check-emergency-action`;
const validateTokenUrl = `${API_URL}/auth/validate-token`;
console.log("emergencyActionUrl-"+emergencyActionUrl);
console.log("validateTokenUrl-"+validateTokenUrl);

/**
 * Generate or retrieve profile UUID
 */
const getOrCreateProfileUuid = async () => {
    const result = await chrome.storage.local.get('profileUuid');
    if (!result.profileUuid) {
        const profileUuid = crypto.randomUUID();
        await chrome.storage.local.set({ profileUuid });
        console.log('Generated new profile UUID:', profileUuid);
        return profileUuid;
    }
    console.log('Using existing profile UUID:', result.profileUuid);
    return result.profileUuid;
};

/**
 * Get profile label
 */
const getProfileLabel = async () => {
    const result = await chrome.storage.local.get('profileLabel');
    return result.profileLabel || null;
};

/**
 * Get complete profile information
 */
const getProfileInfo = async () => {
    const profileUuid = await getOrCreateProfileUuid();
    const profileLabel = await getProfileLabel();

    // Get browser ID from localStorage
    const browserIdResult = await chrome.storage.local.get('browserId');
    const browserId = browserIdResult.browserId || chrome.runtime.id;

    return {
        profileUuid,
        profileLabel,
        browserId
    };
};

/**
 * Handles the logic for checking the emergency action API and clearing data.
 */
const checkEmergencyAction = async () => {
    console.log("Service Worker: Checking emergency action status...");

    try {
        const result = await chrome.storage.local.get(['authToken']);
        const token = result.authToken ?? null;

        if (!token) {
            console.error('Service Worker: No auth token available. Cannot call API.');
            return;
        }

        // Get profile information
        const profileInfo = await getProfileInfo();

        console.log("Profile info for emergency check:", {
            browserId: profileInfo.browserId,
            profileUuid: profileInfo.profileUuid,
            profileLabel: profileInfo.profileLabel
        });

        const response = await fetch(emergencyActionUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Browser-Id': profileInfo.browserId,
                'X-Profile-Uuid': profileInfo.profileUuid,
            },
        });

        const data = await response.json();
        console.log("Service Worker: Emergency action API response:", JSON.stringify(data));

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
        console.error("Service Worker: Failed to check emergency action status. Error:", error.message);
    }
};

// Listen for when the browser starts up
chrome.runtime.onStartup.addListener(() => {
    console.log("Service Worker: Browser startup detected.");
    updateBrowserBackgroundProcess();
});

// Listen for when the extension is installed or updated (which acts like a reload)
chrome.runtime.onInstalled.addListener(() => {
    console.log("Service Worker: Extension installed or reloaded.");
    updateBrowserBackgroundProcess();
});

const updateBrowserBackgroundProcess = async () => {
    let isTokenValid = await checkTokenValidation();
    console.log("isTokenValid -"+isTokenValid);
    if (!isTokenValid) {
        console.log("Service Worker: Invalid token detected. Logging out...");
        await chrome.storage.local.remove(['profileUuid', 'profileLabel', 'browserId', 'authToken', 'username']);
        return;
    }

    let { browserId } = await chrome.storage.local.get("browserId");
    if (!browserId) {
        browserId = chrome.runtime.id;
        await chrome.storage.local.set({ browserId });
        console.log("Generated new browser ID:", browserId);
    } else {
        console.log("Using existing browser ID:", browserId);
    }

    // Initialize profile UUID as well
    await getOrCreateProfileUuid();
    await checkEmergencyAction();
}

// Check Token Validation and logout if token expire
const checkTokenValidation = async () => {
    console.log("Service Worker: Start token check");
    const result = await chrome.storage.local.get(['authToken']);
    const token = result.authToken ?? null;
    console.log("Service Worker: client token", token);

    if (!token) {
        console.error('Service Worker: No auth token available. Cannot call Token validation API.');
        return false;
    }
    try {
        const response = await fetch(validateTokenUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error("Service Worker: Token validation failed with status:", response.status);
            return false;
        }

        const data = await response.json();
        console.log("Service Worker: Check Token Validation response:", JSON.stringify(data));
        console.log("Service Worker: data.token response:", data.token);

        return data.token === true;
    } catch (error) {
        console.error("Service Worker: Network or server error during token validation:", error);
        return false;
    }
}

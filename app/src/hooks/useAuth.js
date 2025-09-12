import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../api/auth";

export const useAuth = () => {
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [user, setUser] = useState(null);
const [token, setToken] = useState(null);

// Restore token & user from storage
useEffect(() => {
    const loadStoredAuth = async () => {
    try {
        const savedToken = await AsyncStorage.getItem("authToken");
        const savedUser = await AsyncStorage.getItem("authUser");

        if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        }
    } catch (err) {
        console.error("Failed to load stored auth:", err);
    }
    };

    loadStoredAuth();
}, []);

const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
        const data = await login(email, password);
        console.log("data(login)-"+JSON.stringify(data));
        // expected response: { token, user }

        setUser(data.user);
        setToken(data.token);

        await AsyncStorage.setItem("authToken", data.token);
        await AsyncStorage.setItem("authUser", JSON.stringify(data.user));

        return data.user;
    } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Login failed");
    } finally {
        setLoading(false);
    }
};

const handleLogout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("authUser");
};

return { user, token, error, loading, handleLogin, handleLogout };
};

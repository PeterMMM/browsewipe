import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/homeScreen';
import LoginScreen from './src/screens/loginScreen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const API_URL = "http://192.168.43.147:5001/api";

export default function App() {
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
            setIsLoggedIn(false);
            } else {
            // validate token with API
            const res = await axios.get(`${API_URL}/validate-token`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.valid) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            }
        } catch (err) {
            console.log("Token validation failed:", err);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
        };

        checkToken();
    }, []);

    if (loading) {
        return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color="blue" />
        </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Welcome" }} />
                <Stack.Screen name='Login' component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

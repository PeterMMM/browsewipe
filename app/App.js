import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/homeScreen';
import LoginScreen from './src/screens/loginScreen';

const Stack = createNativeStackNavigator();

export default function App() {

    return (
        <SafeAreaView style={styles.container}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Welcome", headerBackVisible: false }} />
                <Stack.Screen name='Login' component={LoginScreen} options={{ headerBackVisible: false }} />
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

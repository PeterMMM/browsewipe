import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, error, loading, handleLogin } = useAuth();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const loggedInUser = await handleLogin(email, password);
    if (loggedInUser) {
      navigation.replace("Home"); // redirect after login
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>

      <TextInput
        style={styles.inputField}
        value={email}
        placeholder="Email"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.inputField}
        value={password}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Button title="Login" onPress={handleSubmit} />
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      {user && <Text style={{ color: "green" }}>Welcome {user.name}!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 20,
  },
  error: {
    color: Colors.warning,
    padding: 10,
    backgroundColor: "#f5c1c8",
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 10,
  },
  inputField: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
});

export default LoginScreen;

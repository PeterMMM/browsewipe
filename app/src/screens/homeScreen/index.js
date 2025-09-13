import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { getBrowsers, toggleEmergency } from "../../api/broswer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, token, handleLogout } = useAuth();
  const [browsers, setBrowsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkToken = async () => {
      try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
              handleLogout();
          } else {
              // validate token with API
              const res = await axios.get(`${API_URL}/validate-token`, {
                  headers: { Authorization: `Bearer ${token}` }
              });

              if (res.data.valid) {
                setLoading(false);
              } else {
                handleLogout();
              }
          }
      } catch (err) {
          console.error("Token validation failed:", err);
          handleLogout();
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      checkToken();
  }, []);

  useEffect(() => {
    if (token) {
      loadBrowsers();
    }
  }, [token]);

  const loadBrowsers = async () => {
    setLoading(true);
    try {
      const data = await getBrowsers(token);
      setBrowsers(data);
    } catch (err) {
      console.error("Failed to fetch browsers:", err);
      checkToken();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEmergency = async (id) => {
    try {
      await toggleEmergency(id, token);
      // refresh list after update
      loadBrowsers();
    } catch (err) {
      console.error("Failed to toggle emergency:", err);
    }
  };

  if (loading) {
      return (
        <View style={styles.container}>
          <View style={styles.loading}>
              <ActivityIndicator size="large" color="blue" />
          </View>
        </View>
      );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browsewipe</Text>
      <Text style={styles.subtitle}>Wiping Data, Saving People</Text>
      <Text style={styles.description}>
        Browsewipe helps you remotely clear cookies, history, and other sensitive
        data from your browsers. Stay private and secure anytime, anywhere.
      </Text>

      {!token ? (
        <>
          <Text style={styles.info}>You’re not logged in.</Text>
          <Button title="Login Account" onPress={() => navigation.navigate("Login")} />
        </>
      ) : (
        <>
          <Text style={styles.info}>Welcome back, {user?.name || "User"} 👋</Text>

          <View style={styles.buttonContainer}>
            <Button
              title={loading ? "Refreshing..." : "Refresh Browser List"}
              onPress={loadBrowsers}
              disabled={loading}
              color="#3d5afe"
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <FlatList
              data={browsers}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.profileInfo}>{item.profile_label || 'Unnamed Profile'}</Text>
                  <Text style={styles.profileUuid}>UUID: {item.profile_uuid?.slice(0, 8)}...</Text>
                  <Text style={styles.browserName}>{item.broswer_name}</Text>
                  <Text style={styles.browserInfo}>Emergency Action: {item.emergency_action ? "Yes" : "No"}</Text>
                  <Button
                    title={item.emergency_action ? "Disable Emergency" : "Enable Emergency"}
                    onPress={() => handleToggleEmergency(item._id)}
                  />
                </View>
              )}
            />
          )}

          <View style={styles.logoutContainer}>
            <Button title="Logout" onPress={handleLogout} color="red" />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    color: "#2a3d66",
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 5,
  },
  subtitle: {
    color: "#3d5afe",
    fontSize: 18,
    marginBottom: 15,
  },
  description: {
    color: "#444",
    fontSize: 16,
    marginBottom: 25,
    lineHeight: 22,
  },
  info: {
    fontSize: 16,
    marginBottom: 15,
    fontStyle: "italic",
    color: "#666",
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f0f4ff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  browserName: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  browserInfo: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  profileInfo: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#2a3d66",
    marginBottom: 4,
  },
  profileUuid: {
    fontSize: 11,
    color: "#888",
    fontFamily: "monospace",
    marginBottom: 6,
  },
  buttonContainer: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  logoutContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});

export default HomeScreen;

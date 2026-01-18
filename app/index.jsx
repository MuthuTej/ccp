// app/index.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
// import * as Notifications from "expo-notifications";
// import { usePushNotifications } from "../usePushNotification";

export default function HomeScreen() {
  const { expoPushToken } = usePushNotifications();

  const testSOS = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚨 SOS ALERT",
        body: "This is a test SOS notification!",
        sound: "default",
        priority: "max",
      },
      trigger: null,
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>
        Push Notifications Setup ✅
      </Text>

      <Text style={{ marginTop: 10 }}>Expo Push Token:</Text>
      <Text style={{ marginTop: 5, fontSize: 12 }}>
        {expoPushToken || "Getting token... (check console)"}
      </Text>

      <TouchableOpacity
        onPress={testSOS}
        style={{
          marginTop: 25,
          padding: 15,
          backgroundColor: "red",
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          TEST SOS NOTIFICATION 🚨
        </Text>
      </TouchableOpacity>
    </View>
  );
}

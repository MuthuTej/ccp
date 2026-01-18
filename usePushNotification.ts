// hooks/usePushNotifications.ts
import { useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
  expoPushToken?: string;
  notification?: Notifications.Notification;
}

// ✅ Handler (latest expo-notifications)
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,

    // ✅ required in latest versions
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  async function registerForPushNotificationsAsync() {
    try {
      if (!Device.isDevice) {
        alert("Must be using a physical device for Push notifications");
        return;
      }

      // ✅ Permission
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push notification permission");
        return;
      }

      // ✅ Android channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("sos", {
          name: "SOS Alerts",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 500, 500, 500],
          enableVibrate: true,
          sound: "default",
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
        });
      }

      // ✅ Push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      console.log("✅ EXPO PUSH TOKEN:", token.data);
      setExpoPushToken(token.data);
    } catch (err) {
      console.log("❌ Push Notification Register Error:", err);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync();

    // ✅ When notification received (foreground)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log("📩 Notification Received:", notification);
      });

    // ✅ When user taps notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👉 Notification Response Clicked:", response);
      });

    return () => {
      // ✅ correct cleanup (new API)
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { expoPushToken, notification };
};

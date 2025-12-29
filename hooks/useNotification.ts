"use client";

import { useState, useEffect } from "react";
import { getFirebaseMessaging } from "@/lib/firebase/config";

export interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
  data?: Record<string, string>;
}

export const useNotification = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch FCM token
  const fetchToken = async () => {
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        throw new Error("Firebase Messaging is not supported");
      }

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        throw new Error("VAPID key is not configured");
      }

      // Ensure service worker is registered
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration("/");

        if (!registration) {
          // Register if not already registered
          await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
            scope: "/",
          });
          console.log("Service Worker registered");
        }

        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;
      }

      // Dynamically import getToken to avoid build issues
      const { getToken } = await import("firebase/messaging");
      const currentToken = await getToken(messaging, { vapidKey });

      if (currentToken) {
        setToken(currentToken);
        console.log("FCM Token fetched:", currentToken);
        return currentToken;
      } else {
        console.log("No registration token available");
        return null;
      }
    } catch (err) {
      console.error("Error fetching token:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch token";
      setError(errorMessage);
      return null;
    }
  };

  // Check permission and fetch token on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const currentPermission = Notification.permission;
      setNotificationPermission(currentPermission);

      // If permission is already granted, fetch the token automatically
      if (currentPermission === "granted") {
        fetchToken();
      }
    }
  }, []);

  const requestPermission = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if browser supports notifications
      if (!("Notification" in window)) {
        throw new Error("This browser does not support notifications");
      }

      // Request notification permission
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }

      // Fetch the FCM token
      const currentToken = await fetchToken();
      return currentToken;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to get notification permission";
      setError(errorMessage);
      console.error("Error getting notification permission:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const setupForegroundListener = async () => {
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      // Dynamically import onMessage to avoid build issues
      const { onMessage } = await import("firebase/messaging");

      // Handle foreground messages
      onMessage(messaging, (payload: NotificationPayload) => {
        console.log("Foreground message received:", payload);

        const notificationTitle =
          payload.notification?.title || "New Notification";
        const notificationOptions = {
          body: payload.notification?.body || "You have a new message",
          icon: payload.notification?.image || "/firebase-logo.png",
          tag: "foreground-notification",
        };

        // Show notification even when app is in foreground
        if (Notification.permission === "granted") {
          new Notification(notificationTitle, notificationOptions);
        }
      });
    } catch (error) {
      console.error("Error setting up foreground listener:", error);
    }
  };

  return {
    token,
    notificationPermission,
    isLoading,
    error,
    requestPermission,
    setupForegroundListener,
  };
};

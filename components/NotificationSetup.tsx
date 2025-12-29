"use client";

import React, { useEffect, useState } from "react";
import { useNotification } from "@/hooks/useNotification";
import { Bell, Copy, Check, AlertCircle } from "@/components/icons";

export const NotificationSetup: React.FC = () => {
  const {
    token,
    notificationPermission,
    isLoading,
    error,
    requestPermission,
    setupForegroundListener,
  } = useNotification();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token) {
      setupForegroundListener();
    }
  }, [token]);

  const handleCopyToken = async () => {
    if (token) {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPermissionStatus = () => {
    switch (notificationPermission) {
      case "granted":
        return {
          text: "Granted",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "denied":
        return { text: "Denied", color: "text-red-600", bgColor: "bg-red-50" };
      default:
        return {
          text: "Not Requested",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
        };
    }
  };

  const permissionStatus = getPermissionStatus();

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Push Notifications Setup
          </h2>
        </div>

        <div className="space-y-4">
          {/* Permission Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">
              Permission Status:
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${permissionStatus.color} ${permissionStatus.bgColor}`}
            >
              {permissionStatus.text}
            </span>
          </div>

          {/* Request Permission Button */}
          {notificationPermission !== "granted" && (
            <button
              onClick={requestPermission}
              disabled={isLoading || notificationPermission === "denied"}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Requesting Permission...
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  Request Notification Permission
                </>
              )}
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* FCM Token Display */}
          {token && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Your FCM Token:
              </label>
              <div className="relative">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 break-all text-sm font-mono text-gray-800">
                  {token}
                </div>
                <button
                  onClick={handleCopyToken}
                  className="absolute top-2 right-2 p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                  title="Copy token"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Save this token to send notifications to this device
              </p>
            </div>
          )}

          {/* Instructions */}
          {notificationPermission === "denied" && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Permission Denied:</strong> Please enable notifications
                in your browser settings to receive push notifications.
              </p>
            </div>
          )}

          {token && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Success!</strong> You can now receive push
                notifications. Use the token above to send test notifications.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Test Notification Section */}
      {token && <TestNotificationForm token={token} />}
    </div>
  );
};

// Test Notification Form Component
const TestNotificationForm: React.FC<{ token: string }> = ({ token }) => {
  const [title, setTitle] = useState("Test Notification");
  const [body, setBody] = useState(
    "This is a test notification from your app!"
  );
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title,
          body,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: "Notification sent successfully!",
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to send notification",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Send Test Notification
      </h3>
      <form onSubmit={handleSendNotification} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter notification title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Body
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter notification message"
            rows={3}
            required
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {sending ? "Sending..." : "Send Test Notification"}
        </button>

        {result && (
          <div
            className={`p-4 rounded-lg border ${
              result.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                result.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {result.message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

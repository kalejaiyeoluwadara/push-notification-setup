import React from "react";
import { NotificationSetup } from "@/components/NotificationSetup";

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Firebase Push Notifications
          </h1>
          <p className="text-gray-600">
            Setup and test push notifications for Android and iOS
          </p>
        </div>
        <NotificationSetup />
      </div>
    </main>
  );
}

export default Home;

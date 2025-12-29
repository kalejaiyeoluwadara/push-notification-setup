# Firebase Push Notifications Web App

A complete Next.js application for sending push notifications to both Android and iOS using Firebase Cloud Messaging (FCM).

## Features

- **Push Notifications** - Send notifications to web, Android, and iOS
- **Cross-Platform** - Works on all modern browsers
- **Firebase Cloud Messaging** - Powered by Firebase FCM
- **Next.js 15** - Built with the latest Next.js App Router
- **Beautiful UI** - Modern, responsive design with Tailwind CSS
- **Secure** - Proper handling of Firebase credentials
- **Progressive** - Service worker for background notifications
- **Test Interface** - Built-in notification testing

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Cloud Messaging
3. Get your credentials (see [QUICK_START.md](./QUICK_START.md))

### 3. Configure Environment

Create a `.env.local` file using `ENVIRONMENT_TEMPLATE.txt` as a reference:

```bash
cp ENVIRONMENT_TEMPLATE.txt .env.local
```

Fill in your Firebase credentials in `.env.local`

### 4. Update Service Worker

Edit `public/firebase-messaging-sw.js` with your Firebase config

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get started in 5 minutes
- **[Setup Guide](./SETUP_GUIDE.md)** - Comprehensive setup documentation
- **[Environment Template](./ENVIRONMENT_TEMPLATE.txt)** - Environment variables reference

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── notifications/
│   │       ├── send/
│   │       │   └── route.ts          # Send single notification
│   │       └── send-multiple/
│   │           └── route.ts          # Send to multiple devices
│   ├── page.tsx                      # Main page
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
├── components/
│   ├── NotificationSetup.tsx         # Main notification component
│   └── icons.tsx                     # SVG icons
├── hooks/
│   └── useNotification.ts            # Notification hook
├── lib/
│   └── firebase/
│       ├── config.ts                 # Firebase client config
│       └── admin.ts                  # Firebase admin config
├── public/
│   └── firebase-messaging-sw.js      # Service worker
├── SETUP_GUIDE.md                    # Detailed setup guide
├── QUICK_START.md                    # Quick start guide
└── ENVIRONMENT_TEMPLATE.txt          # Environment variables template
```

## 🔌 API Endpoints

### Send Single Notification

**POST** `/api/notifications/send`

```json
{
  "token": "fcm_token_here",
  "title": "Hello!",
  "body": "This is a notification",
  "imageUrl": "https://example.com/image.png",
  "data": {
    "url": "https://your-app.com/page"
  }
}
```

### Send to Multiple Devices

**POST** `/api/notifications/send-multiple`

```json
{
  "tokens": ["token1", "token2", "token3"],
  "title": "Hello Everyone!",
  "body": "This is a broadcast notification"
}
```

## Testing

1. Open the app and click "Request Notification Permission"
2. Copy your FCM token
3. Use the built-in test form to send notifications
4. Try with browser in foreground and background

## Author
### Dara.tsx

Built with ❤️ using Next.js and Firebase


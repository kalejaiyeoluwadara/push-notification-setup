import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminMessaging } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, title, body: messageBody, data, imageUrl } = body;

    // Validate required fields
    if (!token) {
      return NextResponse.json(
        { error: 'FCM token is required' },
        { status: 400 }
      );
    }

    if (!title || !messageBody) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    // Get Firebase Admin Messaging instance
    const messaging = getFirebaseAdminMessaging();

    // Prepare the message payload
    const message: any = {
      token,
      notification: {
        title,
        body: messageBody,
      },
      webpush: {
        notification: {
          title,
          body: messageBody,
          icon: '/firebase-logo.png',
          badge: '/firebase-logo.png',
          requireInteraction: false,
        },
        fcmOptions: {
          link: data?.url || '/',
        },
      },
    };

    // Add image if provided
    if (imageUrl) {
      message.notification.image = imageUrl;
      message.webpush.notification.image = imageUrl;
    }

    // Add custom data if provided
    if (data) {
      message.data = data;
    }

    // Send the notification
    const response = await messaging.send(message);
    
    console.log('Successfully sent message:', response);

    return NextResponse.json(
      { 
        success: true, 
        messageId: response,
        message: 'Notification sent successfully' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending notification:', error);
    
    let errorMessage = 'Failed to send notification';
    let statusCode = 500;

    // Handle specific Firebase errors
    if (error.code === 'messaging/invalid-registration-token') {
      errorMessage = 'Invalid FCM token';
      statusCode = 400;
    } else if (error.code === 'messaging/registration-token-not-registered') {
      errorMessage = 'Token is not registered';
      statusCode = 404;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage, details: error.code || 'unknown_error' },
      { status: statusCode }
    );
  }
}

// Optional: Add a GET endpoint to check API health
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok', 
      message: 'Notification API is running',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}


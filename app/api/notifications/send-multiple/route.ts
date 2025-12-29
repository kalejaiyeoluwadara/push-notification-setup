import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminMessaging } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokens, title, body: messageBody, data, imageUrl } = body;

    // Validate required fields
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return NextResponse.json(
        { error: 'An array of FCM tokens is required' },
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

    // Send to multiple tokens
    const response = await messaging.sendEachForMulticast({
      ...message,
      tokens,
    });

    console.log('Successfully sent messages:', {
      successCount: response.successCount,
      failureCount: response.failureCount,
    });

    // Collect failed tokens for debugging
    const failedTokens = response.responses
      .map((resp, idx) => (!resp.success ? { token: tokens[idx], error: resp.error } : null))
      .filter(Boolean);

    return NextResponse.json(
      {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        failedTokens,
        message: `Sent ${response.successCount} notifications successfully`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending notifications:', error);

    return NextResponse.json(
      { 
        error: 'Failed to send notifications', 
        details: error.message || 'Unknown error' 
      },
      { status: 500 }
    );
  }
}


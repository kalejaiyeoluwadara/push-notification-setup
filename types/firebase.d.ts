// Type declarations for Firebase modules
// This file provides type support until firebase packages are installed

declare module 'firebase/messaging' {
  export interface Messaging {}
  export interface MessagePayload {
    notification?: {
      title?: string;
      body?: string;
      image?: string;
    };
    data?: Record<string, string>;
  }
  
  export function getToken(
    messaging: Messaging,
    options?: { vapidKey?: string }
  ): Promise<string>;
  
  export function onMessage(
    messaging: Messaging,
    callback: (payload: MessagePayload) => void
  ): () => void;
  
  export function isSupported(): Promise<boolean>;
}

declare module 'firebase/app' {
  export interface FirebaseApp {}
  export interface FirebaseOptions {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
  }
  
  export function initializeApp(options: FirebaseOptions): FirebaseApp;
  export function getApps(): FirebaseApp[];
}


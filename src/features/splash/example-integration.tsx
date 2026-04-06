/**
 * Example: How to integrate SplashScreen into your app
 * 
 * This file demonstrates the splash screen integration
 * in the app's root layout or index file.
 */

import React, { useState, useEffect } from 'react';
import { SplashScreen } from '@features/splash';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
    // Continue with app initialization
    // e.g., check auth state, load resources, etc.
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Your main app component/navigation goes here
  return (
    <YourMainApp />
  );
}

// Example with async initialization:
export function RootLayoutWithAsyncInit() {
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Simulate async initialization (auth check, data loading, etc.)
    const initialize = async () => {
      // Your initialization logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsReady(true);
    };
    
    initialize();
  }, []);

  const handleSplashFinish = () => {
    // Only hide splash when both animation is done AND app is ready
    if (isReady) {
      setShowSplash(false);
    }
  };

  if (showSplash || !isReady) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return <YourMainApp />;
}

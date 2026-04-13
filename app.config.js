/**
 * Expo App Configuration
 * Uses environment variables for Firebase and RevenueCat config
 */

export default {
  expo: {
    name: "Sprout",
    slug: "sprout-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "sprout",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#FFFDF9"
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.sprout.babytracker",
      usesAppleSignIn: true,
      buildNumber: "1",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.sprout.babytracker"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      "expo-apple-authentication",
      "@react-native-community/datetimepicker",
      "expo-font"
    ],
    extra: {
      eas: {
        projectId: "01795e86-9f64-4f73-98c2-7f80ce7cfc1b"
      },
      // Firebase configuration - read from environment variables
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      // RevenueCat configuration
      revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
      revenueCatIosTestKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_TEST_KEY,
    }
  }
};

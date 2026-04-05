# 12 — Privacy Manifest

← [11_Performance](./11_Performance.md) | Next → [13_Account_Deletion](./13_Account_Deletion.md)

---

## Overview

Starting Spring 2024, Apple requires all iOS apps to include a **Privacy Manifest** (`PrivacyInfo.xcprivacy`) that declares:

1. **Privacy Nutrition Labels** — What data types the app collects
2. **Required Reason APIs** — Why the app uses certain iOS APIs
3. **Tracking Domains** — Any domains used for tracking (none for Sprout MVP)

---

## Required Entries for Sprout

### Data Types Collected

| Data Type | Usage | Linked to Identity |
|---|---|---|
| Email Address | Account creation | Yes |
| User ID | Firebase Auth | Yes |
| Photos | Baby milestone photos | No |
| Health - Baby Growth | Height, weight, head circumference | No |

### Required Reason APIs Used

| API | Reason Code | Justification |
|---|---|---|
| `NSPrivacyAccessedAPICategoryUserDefaults` | `CA92.1` | App settings and state persistence |
| `NSPrivacyAccessedAPICategoryFileTimestamp` | `C617.1` | Photo file management |
| `NSPrivacyAccessedAPICategorySystemBootTime` | `35F9.1` | Analytics event ordering (if analytics added) |
| `NSPrivacyAccessedAPICategoryDiskSpace` | `85F4.1` | Storage management for photos |

---

## PrivacyInfo.xcprivacy File

Create this file in the iOS project directory.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Privacy Tracking -->
    <key>NSPrivacyTracking</key>
    <false/>
    
    <!-- No Tracking Domains -->
    <key>NSPrivacyTrackingDomains</key>
    <array/>
    
    <!-- Required Reason APIs -->
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <!-- UserDefaults (AsyncStorage, Zustand persistence) -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>
            </array>
        </dict>
        
        <!-- File Timestamp (expo-file-system for photos) -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>C617.1</string>
            </array>
        </dict>
        
        <!-- Disk Space (storage management) -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryDiskSpace</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>85F4.1</string>
            </array>
        </dict>
    </array>
    
    <!-- Data Collection -->
    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <!-- Email Address -->
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeEmailAddress</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
        
        <!-- User ID -->
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeUserID</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
        
        <!-- Photos -->
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypePhotosorVideos</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
        
        <!-- Health Data (Baby Growth) -->
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeHealth</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

---

## EAS Integration

### Plugin Configuration

Add the privacy manifest plugin to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "privacyManifestPath": "./ios/PrivacyInfo.xcprivacy"
          }
        }
      ]
    ]
  }
}
```

### Alternative: EAS Config Plugin

Create a config plugin to automatically add the manifest:

```javascript
// plugins/withPrivacyManifest.js
const { withXcodeProject } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withPrivacyManifest(config) {
  return withXcodeProject(config, async (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const manifestPath = path.join(projectRoot, 'ios', 'PrivacyInfo.xcprivacy');
    
    // Copy manifest if it doesn't exist
    if (!fs.existsSync(manifestPath)) {
      const templatePath = path.join(projectRoot, 'PrivacyInfo.xcprivacy');
      if (fs.existsSync(templatePath)) {
        fs.copyFileSync(templatePath, manifestPath);
      }
    }
    
    return config;
  });
};
```

---

## Info.plist Permissions

These are separate from the privacy manifest but required for iOS:

```xml
<!-- Photo Library Access -->
<key>NSPhotoLibraryUsageDescription</key>
<string>Sprout needs access to your photos to add milestone memories.</string>

<!-- Camera Access -->
<key>NSCameraUsageDescription</key>
<string>Sprout needs camera access to capture milestone moments.</string>

<!-- Face ID (if using biometric auth in future) -->
<key>NSFaceIDUsageDescription</key>
<string>Sprout can use Face ID for quick, secure access.</string>
```

---

## App Store Privacy Details

When submitting to App Store Connect, declare these privacy details:

### Data Types

| Category | Data Type | Collection | Purpose |
|---|---|---|---|
| Contact Info | Email Address | Collected | App Functionality |
| Identifiers | User ID | Collected | App Functionality |
| Photos or Videos | Photos | Collected | App Functionality |
| Health & Fitness | Health | Collected | App Functionality |

### Data Use Declarations

For each data type:

- **Used for Tracking:** No
- **Linked to User:** Yes (Email, User ID) / No (Photos, Health)
- **Purpose:** App Functionality

---

## Verification Checklist

Before App Store submission:

- [ ] `PrivacyInfo.xcprivacy` file exists in iOS directory
- [ ] All required reason APIs are declared
- [ ] All collected data types are listed
- [ ] `NSPrivacyTracking` is set to `false`
- [ ] Info.plist has all required usage descriptions
- [ ] App Store Connect privacy details match manifest
- [ ] No tracking domains used

---

## Third-Party SDKs

If adding SDKs later, verify their privacy manifests:

| SDK | Has Privacy Manifest | Notes |
|---|---|---|
| Firebase Auth | Yes (bundled) | Included automatically |
| expo-image | Yes (bundled) | Included automatically |
| expo-secure-store | Yes (bundled) | Included automatically |
| expo-image-picker | Yes (bundled) | Included automatically |

Run `npx expo prebuild` to verify all manifests are included in the final build.

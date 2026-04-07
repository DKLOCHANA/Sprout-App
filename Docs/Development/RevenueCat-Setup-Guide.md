# RevenueCat Setup Guide - Step by Step

## 📋 Overview
This guide walks you through setting up RevenueCat for the Sprout app's subscription system.

---

## Step 1: Create RevenueCat Account

1. Go to [https://www.revenuecat.com/](https://www.revenuecat.com/)
2. Click **"Get Started"** or **"Sign Up"**
3. Choose your sign-up method:
   - Sign up with Email
   - Sign up with GitHub
   - Sign up with Google
4. Complete the registration process
5. Verify your email if required

---

## Step 2: Create Your First Project

1. After logging in, you'll see the **"Create a Project"** screen
2. Click **"Create New Project"**
3. Fill in the project details:
   - **Project Name**: `Sprout` (or your preferred name)
   - **Platform**: Select **iOS** (you can add Android later)
4. Click **"Create Project"**

---

## Step 3: Configure iOS App

### 3.1 Add iOS App

1. In your project dashboard, click **"Add App"**
2. Select **iOS** platform
3. Fill in the app details:
   - **App Name**: `Sprout`
   - **Bundle ID**: Your iOS app bundle identifier
     - Find this in your `app.json` → `expo.ios.bundleIdentifier`
     - Example: `com.yourcompany.sprout`
4. Click **"Create App"**

### 3.2 Get iOS API Key

1. After creating the app, you'll see your **API Keys**
2. Copy the **Public iOS SDK Key** (starts with `appl_...`)
3. Save this key - you'll need it for Step 6

---

## Step 4: Set Up App Store Connect (Required for iOS)

### 4.1 Prerequisites

Before continuing, you need:
- An Apple Developer Account ($99/year)
- Your app created in App Store Connect
- In-App Purchase products created in App Store Connect

### 4.2 Create In-App Purchase Products in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Log in with your Apple Developer account
3. Click **"My Apps"** → Select your app (or create it if needed)
4. In the sidebar, click **"In-App Purchases"**
5. Click the **"+"** button to create a new in-app purchase

#### Create Monthly Subscription:
1. Select **"Auto-Renewable Subscription"**
2. Click **"Create"**
3. Fill in the details:
   - **Reference Name**: `Premium Monthly`
   - **Product ID**: `sprout_premium_monthly` ⚠️ **Must match exactly**
   - **Subscription Group**: Create new group called `Sprout Premium`
4. Add subscription details:
   - **Subscription Duration**: 1 month
   - **Price**: Select your monthly price tier (e.g., $6.99)
5. Add localized information:
   - **Display Name**: `Premium Monthly`
   - **Description**: `Access all premium features with monthly billing`
6. Click **"Save"**

#### Create Annual Subscription:
1. Click the **"+"** button again
2. Select **"Auto-Renewable Subscription"**
3. Fill in the details:
   - **Reference Name**: `Premium Annual`
   - **Product ID**: `sprout_premium_annual` ⚠️ **Must match exactly**
   - **Subscription Group**: Select `Sprout Premium` (same group)
4. Add subscription details:
   - **Subscription Duration**: 1 year
   - **Price**: Select your annual price tier (e.g., $49.99)
5. Add localized information:
   - **Display Name**: `Premium Annual`
   - **Description**: `Access all premium features - best value!`
6. Click **"Save"**

### 4.3 Submit Products for Review

⚠️ **Important**: In-app purchases must be approved by Apple before you can test them (except in sandbox).

1. Make sure each product status shows **"Ready to Submit"**
2. Products will be reviewed when you submit your app
3. For testing, you can use **Sandbox Testing** (no approval needed)

### 4.4 Link App Store Connect to RevenueCat

1. Go back to your RevenueCat dashboard
2. Navigate to your iOS app settings
3. Look for **"App Store Connect Integration"** section
4. Click **"Connect"** or **"Set Up"**
5. You have two options:

   **Option A: App Store Connect API Key (Recommended)**
   - In App Store Connect, go to **Users and Access** → **Keys** → **App Store Connect API**
   - Click **"+"** to create a new key
   - Name: `RevenueCat Integration`
   - Access: Select **"Admin"** or **"App Manager"**
   - Download the API key file (`.p8` file)
   - Copy the **Issuer ID** and **Key ID**
   - In RevenueCat, upload the `.p8` file and enter Issuer ID and Key ID
   
   **Option B: Shared Secret (Legacy)**
   - In App Store Connect, go to your app → **App Information**
   - Scroll to **"App-Specific Shared Secret"**
   - Click **"Generate"** if not already created
   - Copy the shared secret
   - Paste it in RevenueCat

6. Click **"Save"** or **"Connect"**

---

## Step 5: Create Entitlements and Offerings in RevenueCat

### 5.1 Create Entitlement

Entitlements represent what users get access to.

1. In RevenueCat dashboard, go to **"Entitlements"** in the left sidebar
2. Click **"New Entitlement"**
3. Fill in:
   - **Identifier**: `premium` ⚠️ **Must match exactly**
   - **Display Name**: `Premium`
4. Click **"Create"**

### 5.2 Create Products in RevenueCat

1. Go to **"Products"** in the left sidebar
2. Click **"New Product"**
3. For the monthly subscription:
   - **Identifier**: `sprout_premium_monthly` (same as App Store Connect)
   - **Platform**: iOS
   - **Store Product ID**: `sprout_premium_monthly`
   - **Type**: Auto-renewable subscription
4. Click **"Create"**
5. Repeat for annual:
   - **Identifier**: `sprout_premium_annual`
   - **Platform**: iOS
   - **Store Product ID**: `sprout_premium_annual`
   - **Type**: Auto-renewable subscription

### 5.3 Create Offering

Offerings are the packages you show to users (what they see in the paywall).

1. Go to **"Offerings"** in the left sidebar
2. Click **"New Offering"**
3. Fill in:
   - **Identifier**: `default` ⚠️ **Must match exactly**
   - **Description**: `Default Premium Offering`
4. Click **"Create"**
5. In the offering, click **"Add Package"**
6. Add **Annual Package**:
   - **Package Type**: Select **"Annual"**
   - **Product**: Select `sprout_premium_annual`
   - Click **"Add"**
7. Click **"Add Package"** again
8. Add **Monthly Package**:
   - **Package Type**: Select **"Monthly"**
   - **Product**: Select `sprout_premium_monthly`
   - Click **"Add"**
9. Make sure this offering is set as **"Current"** (there's usually a toggle or button)

### 5.4 Link Products to Entitlement

1. Go back to **"Entitlements"**
2. Click on your **"premium"** entitlement
3. Click **"Attach Products"** or **"Add Products"**
4. Select both products:
   - `sprout_premium_monthly`
   - `sprout_premium_annual`
5. Click **"Save"**

---

## Step 6: Add API Keys to Your App

Now you need to add the RevenueCat API keys to your app environment variables.

### 6.1 Create/Edit .env file

1. In your Sprout app root directory, create or edit `.env` file
2. Add the following lines:

```env
# RevenueCat Configuration
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxxxx
```

3. Replace `appl_xxxxxxxxxxxxxxx` with your actual iOS API key from Step 3.2
4. For Android (when you set it up later), you'll add the Android key

### 6.2 Important Security Notes

- ✅ The `.env` file should be in your `.gitignore` (already is in most projects)
- ✅ These keys are **public** keys - they're safe to use in client-side code
- ⚠️ Never commit actual API keys to version control if using public repositories
- ℹ️ For team members, share keys securely (1Password, LastPass, etc.)

---

## Step 7: Set Up Sandbox Testing

To test subscriptions without real charges, use Apple's Sandbox environment.

### 7.1 Create Sandbox Test Users

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click **"Users and Access"** in the top navigation
3. Click **"Sandbox Testers"** tab
4. Click the **"+"** button
5. Fill in the test user details:
   - **First Name**: Test
   - **Last Name**: User
   - **Email**: Create a new email (e.g., `testuser1@example.com`)
     - This email doesn't need to be real
     - Don't use your actual Apple ID
   - **Password**: Create a secure password (save it!)
   - **Country/Region**: Select your testing region
6. Click **"Invite"**
7. Create 2-3 test users for thorough testing

### 7.2 Enable Sandbox Mode on Device/Simulator

1. On your iOS device or simulator, go to **Settings**
2. Scroll down and tap **"App Store"**
3. Scroll to bottom and tap **"Sandbox Account"**
4. Sign in with one of your sandbox test users
5. Now all in-app purchases will use sandbox (no real charges)

### 7.3 Configure RevenueCat for Testing

1. In RevenueCat dashboard, you can view sandbox transactions
2. Go to **"Customer View"** to see test purchases
3. RevenueCat automatically handles sandbox vs production

---

## Step 8: Test Your Implementation

### 8.1 Build and Run Your App

```bash
# Start development server
npx expo start

# Run on iOS simulator
press 'i'

# Or run on physical device (scan QR code with Expo Go)
```

### 8.2 Test the Flow

1. **Test Free Tier Limits**:
   - Add 1 child ✅
   - Try to add 2nd child → Should see alert
   - Generate 1 report ✅
   - Try to generate 2nd report → Should see alert
   - Add 3 memories ✅
   - Try to add 4th memory → Should see alert

2. **Test Paywall**:
   - Tap "Upgrade Now" on any alert
   - Paywall should open
   - Verify all features are displayed
   - Verify pricing is showing correctly

3. **Test Purchase Flow**:
   - Select Annual plan
   - Tap "Continue"
   - Sign in with Sandbox test account if prompted
   - Confirm purchase
   - Should see "Subscribe" or price (no real charge)
   - Complete purchase
   - App should recognize premium status

4. **Test Premium Features**:
   - After purchase, try adding 2nd child → Should work
   - Generate multiple reports → Should work
   - Add more than 3 memories → Should work

5. **Test Subscription Card**:
   - Go to Profile screen
   - Should see "Premium Active" card with gradient
   - Should show "Annual Plan" or "Monthly Plan"

6. **Test Restore Purchases**:
   - Delete and reinstall app
   - Go to paywall
   - Tap "Restore Purchase"
   - Should restore premium status

---

## Step 9: Verify in RevenueCat Dashboard

1. Go to RevenueCat dashboard
2. Click **"Customer View"** or **"Overview"**
3. You should see your test transactions
4. Check that:
   - Transactions are recorded
   - Entitlements are granted
   - User has "premium" entitlement active

---

## Step 10: Common Issues & Troubleshooting

### Issue: Products not loading in app

**Solution:**
- Make sure Bundle ID matches exactly in App Store Connect and RevenueCat
- Verify product IDs match exactly: `sprout_premium_monthly`, `sprout_premium_annual`
- Check that products are in "Ready to Submit" status in App Store Connect
- Wait a few minutes after creating products (can take 5-30 minutes to propagate)
- Try clearing app data and restarting

### Issue: "Cannot connect to iTunes Store"

**Solution:**
- Make sure you're signed in with a Sandbox test account
- Sign out of real App Store account in Settings → App Store
- Restart device/simulator
- Check internet connection

### Issue: RevenueCat API key invalid

**Solution:**
- Verify the API key is copied correctly (no extra spaces)
- Make sure using the correct key (iOS key for iOS app)
- Restart your development server after adding .env file
- Verify environment variable is using `EXPO_PUBLIC_` prefix

### Issue: "No offerings found"

**Solution:**
- Make sure offering is set as "Current" in RevenueCat dashboard
- Verify offering identifier is exactly `default`
- Check that products are attached to the offering
- Wait a few minutes for RevenueCat to sync

### Issue: Purchase completes but premium not activated

**Solution:**
- Check that products are attached to "premium" entitlement
- Verify entitlement identifier is exactly `premium`
- Check RevenueCat dashboard for the transaction
- Look at app logs for RevenueCat errors

---

## Step 11: Prepare for Production

### Before Launching to App Store:

1. **App Store Connect Review**:
   - Submit your app with in-app purchases for review
   - Apple will review both the app and the subscriptions
   - Provide clear subscription terms and privacy policy

2. **Test with Real Account** (Optional but Recommended):
   - Create a new Apple ID (not your main one)
   - Test one real purchase to verify everything works
   - Cancel immediately if you don't want to keep it

3. **Set Up Webhooks** (Advanced):
   - In RevenueCat dashboard, go to **"Integrations"**
   - Set up webhooks if you want server-side notifications
   - Not required for basic functionality

4. **Monitor Analytics**:
   - RevenueCat provides built-in analytics
   - Track conversion rates, churn, MRR, etc.
   - Available in dashboard after launch

---

## 📚 Additional Resources

- **RevenueCat Documentation**: https://docs.revenuecat.com/
- **iOS Sandbox Testing Guide**: https://docs.revenuecat.com/docs/apple-app-store#sandbox-testing
- **App Store Connect Guide**: https://developer.apple.com/app-store-connect/
- **In-App Purchase Guide**: https://developer.apple.com/in-app-purchase/

---

## ✅ Final Checklist

Before launching, verify:

- [ ] RevenueCat account created
- [ ] iOS app configured in RevenueCat
- [ ] Products created in App Store Connect (`sprout_premium_monthly`, `sprout_premium_annual`)
- [ ] App Store Connect linked to RevenueCat
- [ ] Entitlement `premium` created
- [ ] Offering `default` created with both packages
- [ ] Products attached to entitlement
- [ ] API keys added to `.env` file
- [ ] Sandbox test users created
- [ ] All limits tested (1 child, 1 report, 3 memories)
- [ ] Alert prompts working
- [ ] Paywall UI displaying correctly
- [ ] Purchase flow working in sandbox
- [ ] Restore purchases working
- [ ] Premium features unlocked after purchase
- [ ] Subscription card showing correct status
- [ ] Transactions visible in RevenueCat dashboard

---

## 🎉 You're All Set!

Once you've completed all these steps, your subscription system is ready to test. After thorough testing, you can submit to the App Store for review.

Good luck with your launch! 🚀

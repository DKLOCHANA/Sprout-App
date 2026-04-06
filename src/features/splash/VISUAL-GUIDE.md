# 🎨 Visual Component Structure

## Standard Splash Screen Layout

```
┌─────────────────────────────────────┐
│                                     │
│         [Gradient Background]       │
│       Cream → Green → Blue          │
│                                     │
│    🍃 Leaf                          │
│    (rotated -20°)                   │
│                                     │
│                                     │
│           ┌───────────┐             │
│           │           │             │
│           │  🌱 Logo  │  ← Gradient │
│           │  (Sprout) │    Circle   │
│           │           │             │
│           └───────────┘             │
│                                     │
│            Sprout                   │
│          (App Name)                 │
│                                     │
│       Track milestones,             │
│      nurture confidence             │
│           (Slogan)                  │
│                                     │
│   ❤️ Clinically accurate •          │
│      Parent approved                │
│         (Tagline)                   │
│                                     │
│                                     │
│                          🍃 Leaf    │
│                          (rotated   │
│                           45°)      │
│                                     │
└─────────────────────────────────────┘
```

## Enhanced Splash Screen Layout

```
┌─────────────────────────────────────┐
│  ⭕ Circle (decorative)             │
│    🌊 Gradient Background           │
│       Multi-layer                   │
│    🍃 Leaf (swaying)                │
│         ✨ Particle 1               │
│                                     │
│              ✨ Particle 2          │
│                                     │
│           ┌───────────┐             │
│           │  ╭─────╮  │             │
│           │  │ 🌱  │  │  ← Gradient │
│           │  │Logo │  │    + Glow   │
│           │  ╰─────╯  │             │
│           └───────────┘             │
│          (Pulse effect)             │
│                                     │
│            Sprout                   │
│            ─────                    │
│         (+ Underline)               │
│                                     │
│       Track milestones,             │
│      nurture confidence             │
│                                     │
│  🛡️ Clinically accurate •           │
│  ❤️ Parent approved                 │
│         ✨ Particle 3               │
│                                     │
│                ✨ Particle 4        │
│                          🍃 Leaf    │
│                          (swaying)  │
│                                     │
│                   ⭕ Circle (bg)    │
└─────────────────────────────────────┘
```

## Animation Flow Diagram

### Standard Version (3 seconds)

```
Time     │ Animation
─────────┼──────────────────────────────────
0ms      │ ▶ Logo fade in + scale up
         │ ▶ Logo rotation starts (0° → 360°)
         │
300ms    │ ▶ Leaves float in (scale)
         │
600ms    │ ▶ App name slides up
         │ ▶ App name fades in
         │
800ms    │ ✓ Logo rotation complete
         │
900ms    │ ▶ Slogan slides up
         │ ▶ Tagline fades in
         │
1500ms   │ [All animations complete]
         │ [Visual holds steady]
         │
3000ms   │ ⚡ onFinish() called
         │ → Navigate to main app
```

### Enhanced Version (3.5 seconds)

```
Time     │ Animation
─────────┼──────────────────────────────────
0ms      │ ▶ Logo fade + scale + rotate
         │
200ms    │ ▶ Background circles expand
         │
300ms    │ ▶ Leaves start swaying (infinite)
         │
400ms    │ ▶ Leaf 2 rotation begins
         │
600ms    │ ▶ Leaf rotation phase sync
         │
700ms    │ ▶ App name slides up + fades
         │
800ms    │ ▶ Particle 1 floats up
         │ ✓ Logo rotation complete
         │
900ms    │ ▶ Particle 4 floats up
         │
1000ms   │ ▶ Slogan + tagline reveal
         │ ▶ Particle 2 floats up
         │ ▶ Logo pulse begins (2x repeat)
         │
1200ms   │ ▶ Particle 3 floats up
         │
2000ms   │ [Core animations complete]
         │ [Ambient loops continue]
         │ [Leaves sway, logo pulses]
         │
3500ms   │ ⚡ onFinish() called
         │ → Navigate to main app
```

## Component Hierarchy

### SplashScreen.tsx

```
<LinearGradient>                    ← Full screen gradient
  │
  ├─ <View> Decorative Container
  │   ├─ <Animated.View> Leaf Top Left
  │   └─ <Animated.View> Leaf Bottom Right
  │
  └─ <View> Main Content
      ├─ <Animated.View> Logo Container
      │   └─ <View> Logo Circle
      │       └─ <LinearGradient> Logo Background
      │           └─ <Icon> Sprout
      │
      ├─ <Animated.View> App Name Container
      │   └─ <Text> "Sprout"
      │
      ├─ <Animated.View> Slogan Container
      │   └─ <Text> "Track milestones..."
      │
      └─ <Animated.View> Tagline Container
          ├─ <Icon> Heart
          └─ <Text> "Clinically accurate..."
```

### EnhancedSplashScreen.tsx

```
<LinearGradient>                    ← Full screen gradient
  │
  ├─ <Animated.View> Background Circle 1
  ├─ <Animated.View> Background Circle 2
  │
  ├─ <FloatingParticle> × 4         ← Particle components
  │
  ├─ <Animated.View> Leaf 1 (swaying)
  ├─ <Animated.View> Leaf 2 (swaying)
  │
  └─ <View> Main Content (z-index: 1)
      ├─ <Animated.View> Logo Container
      │   └─ <View> Logo Circle (shadow)
      │       └─ <LinearGradient>
      │           └─ <View> Icon Container
      │               ├─ <Icon> Sprout
      │               └─ <View> Glow Circle
      │
      ├─ <Animated.View> App Name + Underline
      │   ├─ <Text> "Sprout"
      │   └─ <View> Accent Underline
      │
      ├─ <Animated.View> Slogan
      │
      └─ <Animated.View> Tagline
          ├─ <Icon> Shield + <Text>
          ├─ <View> Divider Dot
          └─ <Icon> Heart + <Text>
```

## Color Application Map

```
Element              │ Color Used              │ Hex
─────────────────────┼─────────────────────────┼──────────
Gradient Top         │ background              │ #FFFDF9
Gradient Mid         │ primaryDim (30%)        │ rgba(...)
Gradient Bottom      │ secondaryGradientStart  │ #5B9FE3
─────────────────────┼─────────────────────────┼──────────
Logo Gradient Top    │ secondaryGradientStart  │ #5B9FE3
Logo Gradient Bottom │ secondaryGradientEnd    │ #3A7FC9
Logo Icon            │ textOnPrimary           │ #FFFFFF
─────────────────────┼─────────────────────────┼──────────
App Name             │ textPrimary             │ #2D3436
Slogan               │ textSecondary           │ #636E72
Tagline              │ textMuted               │ #B2BEC3
─────────────────────┼─────────────────────────┼──────────
Leaf 1               │ success (30% opacity)   │ #7CB899
Leaf 2               │ primaryLight (20%)      │ #6BA5E7
Particles            │ primaryLight            │ #6BA5E7
─────────────────────┼─────────────────────────┼──────────
Heart Icon           │ error                   │ #E57373
Shield Icon          │ success                 │ #7CB899
Underline Accent     │ secondaryGradientStart  │ #5B9FE3
```

## Animation Curve Reference

```
Animation Type       │ Timing Function         │ Duration
─────────────────────┼─────────────────────────┼──────────
Logo Scale           │ Spring                  │ ~800ms
                     │ damping: 12             │
                     │ stiffness: 250          │
─────────────────────┼─────────────────────────┼──────────
Logo Rotation        │ Easing.out(cubic)       │ 800ms
─────────────────────┼─────────────────────────┼──────────
Text Fade In         │ Easing.out(quad)        │ 500ms
─────────────────────┼─────────────────────────┼──────────
Text Slide Up        │ Spring                  │ ~500ms
                     │ damping: 16             │
                     │ stiffness: 300          │
─────────────────────┼─────────────────────────┼──────────
Leaf Scale           │ Spring                  │ ~600ms
                     │ damping: 15             │
                     │ stiffness: 200          │
─────────────────────┼─────────────────────────┼──────────
Particle Float       │ Easing.out(quad)        │ 1800-2200ms
─────────────────────┼─────────────────────────┼──────────
Leaf Sway            │ Easing.inOut(ease)      │ 2000-2500ms
                     │ (Infinite repeat)       │
─────────────────────┼─────────────────────────┼──────────
Logo Pulse           │ Easing.inOut(ease)      │ 1000ms
                     │ (Repeat 2x)             │
```

## Responsive Behavior

Both splash screens are fully responsive and adapt to:

- ✅ **Screen sizes**: iPhone SE to iPad Pro
- ✅ **Safe areas**: Notch, home indicator
- ✅ **Orientations**: Portrait (primary), landscape (works)
- ✅ **Pixel densities**: @1x to @3x

### Key Measurements

```
Element          │ Size (px)  │ Spacing
─────────────────┼────────────┼──────────
Logo Circle      │ 140×140    │ mb: 32
Enhanced Logo    │ 160×160    │ mb: 40
App Name         │ 56-64pt    │ mb: 16-20
Slogan           │ 18-19pt    │ mb: 24-28
Leaf (Small)     │ 60pt       │ -
Leaf (Large)     │ 80-90pt    │ -
Particles        │ 8pt        │ -
```

---

## Quick Reference

**Files to use:**
```
import { SplashScreen } from '@/features/splash';           // Standard
import { EnhancedSplashScreen } from '@/features/splash';  // Enhanced
```

**Duration:**
- Standard: 3000ms (3s)
- Enhanced: 3500ms (3.5s)

**Callback:**
```tsx
<SplashScreen onFinish={() => {
  // App is ready, hide splash
}} />
```

**Theme dependency:**
- Pulls colors from `@/core/theme/colors`
- Pulls typography from `@/core/theme/typography`

---

Built for **Sprout** 🌱 — Beautiful first impressions matter!

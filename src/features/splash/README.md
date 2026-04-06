# Sprout App - Splash Screens 🌱

This folder contains two beautiful, animated splash screen implementations for the Sprout baby tracking app.

## 📱 Available Versions

### 1. **SplashScreen** (Standard)
A clean, elegant splash screen with smooth animations.

**Features:**
- ✨ Gradient background (cream → soft green → blue)
- 🎨 Animated logo with rotation and bounce
- 📝 App name with slide-up animation
- 💬 Slogan with fade-in effect
- 🍃 Decorative floating leaves
- ⏱️ 3-second duration

**Use when:** You want a polished, professional look without overwhelming effects.

### 2. **EnhancedSplashScreen** (Premium)
A more sophisticated version with particles and advanced effects.

**Features:**
- ✨ Multi-layer gradient background
- 🎨 Animated logo with pulse effect
- 🌊 Floating particle animations
- 🍃 Swaying leaf decorations
- ⭕ Background decorative circles
- 📝 App name with underline accent
- 💎 Enhanced shadows and glow effects
- ⏱️ 3.5-second duration

**Use when:** You want to make a strong first impression with premium visuals.

## 🎨 Design Details

### Color Palette
Both screens use colors from the Sprout theme system:
- **Primary**: `#4A90D9` (Soft Blue)
- **Success**: `#7CB899` (Sage Green)
- **Background**: `#FFFDF9` (Warm Cream)
- **Gradients**: Blue to deeper blue (`#5B9FE3` → `#3A7FC9`)

### Animations
- **Logo**: Scale + rotation entrance with bounce spring
- **Text**: Slide-up + fade-in with smooth easing
- **Leaves**: Gentle rotation for organic feel
- **Particles**: Upward float with fade (Enhanced version)

### Typography
- **App Name**: "Sprout" - 56-64px, extra bold
- **Slogan**: "Track milestones, nurture confidence"
- **Tagline**: "Clinically accurate • Parent approved"

## 🚀 Usage

### Basic Integration

```tsx
import { SplashScreen } from '@/features/splash';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <YourMainApp />;
}
```

### With Async Initialization

```tsx
import { EnhancedSplashScreen } from '@/features/splash';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Load resources, check auth, etc.
      await initializeApp();
      setIsReady(true);
    };
    init();
  }, []);

  const handleFinish = () => {
    if (isReady) setShowSplash(false);
  };

  if (showSplash || !isReady) {
    return <EnhancedSplashScreen onFinish={handleFinish} />;
  }

  return <YourMainApp />;
}
```

## 📐 Specifications

| Aspect | Standard | Enhanced |
|--------|----------|----------|
| Duration | 3.0s | 3.5s |
| File Size | ~7KB | ~11KB |
| Animations | 6 | 12+ |
| Performance | Excellent | Very Good |
| Visual Impact | Professional | Premium |

## 🎯 Recommendation

**Use Standard** for:
- Production builds where performance is critical
- Simple, elegant first impression
- Faster app launches

**Use Enhanced** for:
- Marketing demos and presentations
- Premium feel to match subscription model
- Showcasing app quality

## 🔧 Customization

Both screens accept an `onFinish` callback that fires when animations complete:

```tsx
<SplashScreen 
  onFinish={() => {
    // Navigate to main app
    // or perform post-splash actions
  }} 
/>
```

To adjust duration, modify the `setTimeout` value in each component:
```tsx
setTimeout(() => {
  onFinish();
}, 3000); // Change this value (milliseconds)
```

## 📦 Dependencies

- ✅ `react-native-reanimated` - For smooth animations
- ✅ `expo-linear-gradient` - For gradient backgrounds
- ✅ `@expo/vector-icons` - For icons (sprout, leaf, heart)

All dependencies are already included in the project.

## 🎨 Theming

Colors are pulled from `@/core/theme/colors`, so updating the theme will automatically update the splash screens. To customize:

1. Edit `/src/core/theme/colors.ts`
2. Modify the gradient colors in the component
3. Adjust animation timings in component

## 📱 Preview

The splash screens are designed for:
- ✅ iOS (iPhone, iPad)
- ✅ Android (Phone, Tablet)
- ✅ Portrait orientation
- ✅ Safe area compatible

---

Built with ❤️ for new parents everywhere.

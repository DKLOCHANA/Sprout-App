# 05 — Theme System

← [04_Navigation](./04_Navigation.md) | Next → [06_Error_Handling](./06_Error_Handling.md)

---

## Single Source of Truth

**Rule:** One import point. Never use raw hex values, pixel numbers, or font names in component files.

```typescript
// ✅ Correct
import { theme } from '@/core/theme';
backgroundColor: theme.colors.cardBackground
paddingHorizontal: theme.spacing.screen

// ❌ Wrong
backgroundColor: '#FFF8F0'
paddingHorizontal: 20
```

All theme files export from `src/core/theme/index.ts`:
```typescript
export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { radii } from './radii';
export { shadows } from './shadows';
export { springs, durations } from './animations';

// Convenience re-export
export const theme = { colors, typography, spacing, radii, shadows, springs, durations };
```

---

## `colors.ts` — Soft Pastel Palette

Baby-friendly, warm color scheme optimized for a nurturing app experience.

```typescript
export const colors = {
  // Brand - Sage Green
  primary:               '#7CB899',               // Sage Green (primary)
  primaryLight:          '#A8D4B8',
  primaryDim:            'rgba(124,184,153,0.15)',

  // Secondary - Soft Pink
  secondary:             '#F5B5C8',               // Soft Pink
  secondaryDim:          'rgba(245,181,200,0.15)',

  // Tertiary - Warm Peach
  tertiary:              '#FFD4A3',               // Warm Peach
  tertiaryDim:           'rgba(255,212,163,0.15)',

  // Backgrounds
  backgroundPrimary:     '#FFFDF9',               // Warm cream
  backgroundSecondary:   '#FFF8F0',               // Lighter cream
  backgroundTertiary:    '#FFF3E6',               // Peachy tint

  // Cards & Surfaces
  cardBackground:        '#FFFFFF',
  cardBorder:            'rgba(0,0,0,0.06)',
  cardShadow:            'rgba(0,0,0,0.05)',

  // Text
  textPrimary:           '#3D3D3D',               // Dark gray (not pure black)
  textSecondary:         '#6B6B6B',
  textTertiary:          '#9B9B9B',
  textDisabled:          '#C5C5C5',
  textOnPrimary:         '#FFFFFF',

  // Semantic
  success:               '#4CAF50',
  successDim:            'rgba(76,175,80,0.15)',
  warning:               '#FFC107',
  warningDim:            'rgba(255,193,7,0.15)',
  error:                 '#E57373',               // Softer red for baby app
  errorDim:              'rgba(229,115,115,0.15)',
  info:                  '#64B5F6',
  infoDim:               'rgba(100,181,246,0.15)',

  // Category Colors (for milestones)
  motor:                 '#81C784',               // Green
  cognitive:             '#64B5F6',               // Blue
  social:                '#FFB74D',               // Orange
  language:              '#BA68C8',               // Purple

  // Gender Colors (optional, subtle)
  genderBoy:             '#90CAF9',               // Light blue
  genderGirl:            '#F48FB1',               // Light pink
  genderNeutral:         '#C5E1A5',               // Light green

  // Activity Colors
  feeding:               '#FFB74D',               // Orange
  sleep:                 '#7986CB',               // Indigo
  diaper:                '#4DD0E1',               // Cyan

  // Tab bar & Navigation
  tabBarBackground:      '#FFFFFF',
  tabBarBorder:          'rgba(0,0,0,0.06)',
  tabBarActive:          '#7CB899',
  tabBarInactive:        '#9B9B9B',

  // Border
  border:                'rgba(0,0,0,0.08)',
  borderLight:           'rgba(0,0,0,0.04)',

  // Overlay
  overlay:               'rgba(0,0,0,0.4)',
} as const;
```

---

## `typography.ts` — SF Pro Scale

SF Pro is the iOS system font — **no bundling required**. Uses the iOS Human Interface Guidelines font size scale.

```typescript
export const typography = {
  fontWeight: {
    regular:  '400' as const,
    medium:   '500' as const,
    semiBold: '600' as const,
    bold:     '700' as const,
  },
  fontSize: {
    largeTitle:   34,
    title1:       28,
    title2:       22,
    title3:       20,
    headline:     17,
    body:         17,
    callout:      16,
    subheadline:  15,
    footnote:     13,
    caption1:     12,
    caption2:     11,
  },
  lineHeight: {
    largeTitle:   41,
    title1:       34,
    title2:       28,
    title3:       25,
    headline:     22,
    body:         22,
    callout:      21,
    subheadline:  20,
    footnote:     18,
    caption1:     16,
    caption2:     13,
  },
} as const;
```

---

## `spacing.ts` — 8-Point Grid

Consistent with iOS Human Interface Guidelines.

```typescript
export const spacing = {
  xxs:    4,
  xs:     8,
  sm:     12,
  md:     16,
  lg:     20,
  xl:     24,
  xxl:    32,
  xxxl:   48,
  screen: 20,   // standard horizontal screen padding
} as const;
```

---

## `radii.ts` — Border Radii

Soft, rounded corners for a friendly, baby-app feel.

```typescript
export const radii = {
  xs:     8,
  sm:     12,
  md:     16,
  lg:     20,
  xl:     24,
  xxl:    32,
  card:   20,    // Standard card radius
  button: 12,    // Button radius
  input:  12,    // Input field radius
  avatar: 9999,  // Fully rounded (pills, avatars)
  full:   9999,
} as const;
```

---

## `shadows.ts` — Soft Shadows

Subtle shadows for card elevation without harsh edges.

```typescript
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
```

---

## `animations.ts` — Reanimated Spring Presets

Consistent physics across the app. Pass these configs to `withSpring()`.

```typescript
export const springs = {
  gentle:  { damping: 20, stiffness: 180 },  // Subtle transitions
  snappy:  { damping: 16, stiffness: 300 },  // Quick responses
  bouncy:  { damping: 12, stiffness: 250 },  // Playful interactions
} as const;

export const durations = {
  fast:   150,   // Micro-interactions
  normal: 250,   // Standard transitions
  slow:   400,   // Entrance/exit animations
} as const;
```

---

## SoftCard Component

The primary card component for the app. Used for all card-like surfaces.

**Implementation** (`src/shared/components/ui/SoftCard/SoftCard.tsx`):

```typescript
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/core/theme';

interface SoftCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const SoftCard = ({
  children,
  style,
  variant = 'default',
}: SoftCardProps) => (
  <View style={[styles.card, styles[variant], style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radii.card,
    padding: theme.spacing.md,
  },
  default: {
    ...theme.shadows.sm,
  },
  elevated: {
    ...theme.shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
});
```

---

## Typography Component

All text in the app goes through the `Typography` component — never raw `<Text>`.

```typescript
type TypographyVariant =
  | 'largeTitle' | 'title1' | 'title2' | 'title3'
  | 'headline' | 'body' | 'callout' | 'subheadline'
  | 'footnote' | 'caption1' | 'caption2';

type TypographyColor = keyof typeof theme.colors;

interface TypographyProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: keyof typeof theme.typography.fontWeight;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
}

export const Typography = ({
  variant = 'body',
  color = 'textPrimary',
  weight = 'regular',
  align = 'left',
  children,
  style,
  numberOfLines,
}: TypographyProps) => (
  <Text
    style={[
      {
        fontSize: theme.typography.fontSize[variant],
        lineHeight: theme.typography.lineHeight[variant],
        fontWeight: theme.typography.fontWeight[weight],
        color: theme.colors[color],
        textAlign: align,
      },
      style,
    ]}
    numberOfLines={numberOfLines}
  >
    {children}
  </Text>
);
```

---

## Button Component

Variants map directly to use cases:

| Variant | Use case |
|---|---|
| `primary` | Main CTA (Sage Green fill) |
| `secondary` | Alternative action (outlined) |
| `ghost` | Text-only action |
| `destructive` | Delete / dangerous action (soft red) |

States: `loading` (shows spinner, disables press), `disabled` (reduced opacity).

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}
```

---

## Avatar Component

For baby photos and user profile pictures.

```typescript
interface AvatarProps {
  uri?: string | null;
  name: string;           // Used for initials fallback
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  gender?: 'male' | 'female' | 'other';  // For background color
}
```

Sizes:
- `small`: 32px
- `medium`: 48px
- `large`: 64px
- `xlarge`: 96px

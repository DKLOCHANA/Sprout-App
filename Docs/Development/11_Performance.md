# 11 — Performance

← [10_Screens](./10_Screens.md) | Next → [12_Privacy_Manifest](./12_Privacy_Manifest.md)

---

## Performance Goals

| Metric | Target | Measurement |
|---|---|---|
| App launch | < 2s | Time to interactive |
| Screen transition | < 100ms | Animation smoothness |
| List scrolling | 60fps | No dropped frames |
| Image loading | < 500ms | First meaningful paint |
| Memory usage | < 150MB | Normal operation |

---

## React Native Optimizations

### Memoization

Use `React.memo` for all list item components to prevent unnecessary re-renders.

```typescript
// ✅ Correct
export const BabyCard = React.memo(({ baby, onPress }: BabyCardProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <SoftCard>
        <BabyAvatar uri={baby.photoUri} name={baby.name} />
        <Typography>{baby.name}</Typography>
      </SoftCard>
    </TouchableOpacity>
  );
});

// ❌ Wrong - will re-render on every parent update
export const BabyCard = ({ baby, onPress }: BabyCardProps) => {
  // ...
};
```

### useCallback for Event Handlers

Wrap event handlers in `useCallback` to prevent creating new function references.

```typescript
// In view-model or parent component
const handleBabyPress = useCallback((babyId: string) => {
  router.push(`/babies/${babyId}`);
}, [router]);

// Pass to memoized component
<BabyCard baby={baby} onPress={() => handleBabyPress(baby.id)} />

// Even better - pass the handler and let component call it
<BabyCard baby={baby} onPress={handleBabyPress} />
```

### useMemo for Computed Values

Memoize expensive computations and derived data.

```typescript
const sortedActivities = useMemo(() => {
  return activities
    .filter(a => a.babyId === selectedBabyId)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}, [activities, selectedBabyId]);

const milestoneProgress = useMemo(() => {
  const completed = completions.filter(c => c.babyId === babyId).length;
  const total = MILESTONES.filter(m => m.ageRangeMonths.max >= ageMonths).length;
  return { completed, total, percentage: (completed / total) * 100 };
}, [completions, babyId, ageMonths]);
```

---

## FlatList Optimization

### Configuration

```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  
  // Performance optimizations
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  windowSize={5}
  initialNumToRender={10}
  
  // Estimated item height for faster layout
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Key Extractor

Always use a stable, unique key.

```typescript
// ✅ Correct - stable unique ID
const keyExtractor = useCallback((item: Baby) => item.id, []);

// ❌ Wrong - index can change
const keyExtractor = useCallback((item: Baby, index: number) => index.toString(), []);
```

### Render Item

Use `useCallback` and return memoized components.

```typescript
const renderItem = useCallback(({ item }: { item: Baby }) => (
  <BabyCard baby={item} onPress={handlePress} />
), [handlePress]);
```

---

## Image Optimization

### expo-image Configuration

```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: photo.uri }}
  style={styles.image}
  
  // Performance options
  cachePolicy="disk"           // Cache to disk
  contentFit="cover"           // Aspect ratio handling
  transition={200}             // Fade-in transition
  placeholder={blurhash}       // Blurhash placeholder
  
  // Memory management
  recyclingKey={photo.id}      // Help with recycling in lists
/>
```

### Image Sizes

Resize images before saving to reduce storage and memory.

```typescript
import * as ImageManipulator from 'expo-image-manipulator';

async function resizeImage(uri: string, maxSize: number = 1024): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxSize } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}
```

### Thumbnail Generation

Create thumbnails for gallery views.

```typescript
const THUMBNAIL_SIZE = 300;

async function createThumbnail(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: THUMBNAIL_SIZE } }],
    { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}
```

---

## Animation Performance

### Use Reanimated Worklets

All animations run on the UI thread, not JS thread.

```typescript
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '@/core/theme';

const CardPressAnimation = ({ children, onPress }) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.97, theme.springs.snappy);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, theme.springs.gentle);
  };
  
  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Pressable>
  );
};
```

### Avoid Animated in JS Thread

```typescript
// ❌ Wrong - runs on JS thread, will jank
import { Animated } from 'react-native';

// ✅ Correct - runs on UI thread
import Animated from 'react-native-reanimated';
```

---

## State Management Performance

### Zustand Selectors

Use selectors to prevent unnecessary re-renders.

```typescript
// ✅ Correct - only re-renders when selectedBabyId changes
const selectedBabyId = useBabyStore((state) => state.selectedBabyId);

// ❌ Wrong - re-renders on ANY store change
const { selectedBabyId } = useBabyStore();
```

### Shallow Comparison

For object selections, use shallow comparison.

```typescript
import { shallow } from 'zustand/shallow';

const { babies, selectedBabyId } = useBabyStore(
  (state) => ({ babies: state.babies, selectedBabyId: state.selectedBabyId }),
  shallow
);
```

---

## AsyncStorage Performance

### Batch Operations

Minimize storage operations by batching.

```typescript
// ✅ Correct - single write
await AsyncStorage.multiSet([
  ['key1', value1],
  ['key2', value2],
]);

// ❌ Wrong - multiple writes
await AsyncStorage.setItem('key1', value1);
await AsyncStorage.setItem('key2', value2);
```

### Zustand Persistence

Zustand's persist middleware handles batching automatically, but configure debounce for frequent updates.

```typescript
persist(
  (set) => ({ ... }),
  {
    name: 'activity-storage',
    storage: createJSONStorage(() => AsyncStorage),
    // Debounce writes for frequently updated stores
    partialize: (state) => ({ activities: state.activities }),
  }
)
```

---

## Memory Management

### Photo Cleanup

Delete unused photos when entries are removed.

```typescript
const deleteActivity = async (id: string) => {
  const activity = activities.find(a => a.id === id);
  
  // Delete associated photo if exists
  if (activity?.photoUri) {
    await deletePhoto(activity.photoUri);
  }
  
  // Remove from store
  set((state) => ({
    activities: state.activities.filter(a => a.id !== id),
  }));
};
```

### Baby Deletion Cascade

When deleting a baby, clean up all associated data.

```typescript
const deleteBaby = async (babyId: string) => {
  // Delete baby's photos from file system
  const photos = usePhotoStore.getState().getPhotosForBaby(babyId);
  await Promise.all(photos.map(p => deletePhoto(p.uri)));
  
  // Clear baby's data from all stores
  useGrowthStore.getState().deleteEntriesForBaby(babyId);
  useMilestoneStore.getState().deleteCompletionsForBaby(babyId);
  useActivityStore.getState().deleteActivitiesForBaby(babyId);
  usePhotoStore.getState().deletePhotosForBaby(babyId);
  
  // Remove baby
  set((state) => ({
    babies: state.babies.filter(b => b.id !== babyId),
    selectedBabyId: state.selectedBabyId === babyId ? null : state.selectedBabyId,
  }));
};
```

---

## Startup Performance

### Splash Screen Control

Keep splash visible until app is ready.

```typescript
// app/_layout.tsx
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isHydrated } = useAuthStore();
  const [fontsLoaded] = useFonts({});
  
  useEffect(() => {
    if (fontsLoaded && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isHydrated]);
  
  if (!fontsLoaded || !isHydrated) return null;
  
  return <Stack />;
}
```

### Lazy Loading

Load features on demand with React.lazy (when appropriate).

```typescript
// For large screens that aren't immediately needed
const GrowthChartsScreen = React.lazy(
  () => import('@/features/growth/screens/GrowthChartsScreen')
);
```

---

## Performance Checklist

Before release:

- [ ] All list items wrapped in `React.memo`
- [ ] All event handlers use `useCallback`
- [ ] All derived data uses `useMemo`
- [ ] FlatList has proper optimization props
- [ ] Images use `expo-image` with disk caching
- [ ] Animations use Reanimated, not Animated
- [ ] Zustand selectors are granular
- [ ] Photos are resized before storage
- [ ] Deleted entries clean up associated photos
- [ ] Splash screen stays visible until ready
- [ ] No console.log in production

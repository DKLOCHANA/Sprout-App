/**
 * CelebrationBurst
 * A confetti-style particle burst rendered with Reanimated.
 *
 * Drop this anywhere as an absolute-positioned overlay; call `play()`
 * via the imperative ref to fire a burst from a given origin.
 */

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const PARTICLE_COUNT = 18;
const PARTICLE_SIZE = 8;
const SPREAD_DISTANCE = 110;
const DURATION_MS = 850;

const COLORS = [
  '#FFD166', // yellow
  '#06D6A0', // green
  '#118AB2', // blue
  '#EF476F', // pink
  '#F78C6B', // orange
  '#7C3AED', // purple
];

export interface CelebrationBurstHandle {
  play: (originX: number, originY: number) => void;
}

interface ParticleProps {
  color: string;
  angle: number;
  distance: number;
  delay: number;
  shape: 'circle' | 'square';
  originX: number;
  originY: number;
  trigger: number;
}

function Particle({
  color,
  angle,
  distance,
  delay,
  shape,
  originX,
  originY,
  trigger,
}: ParticleProps) {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  React.useEffect(() => {
    if (trigger === 0) return;
    progress.value = 0;
    opacity.value = 0;
    rotate.value = 0;
    progress.value = withTiming(1, {
      duration: DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withSequence(
      withTiming(1, { duration: 80 }),
      withTiming(1, { duration: DURATION_MS - 360 }),
      withTiming(0, { duration: 280 })
    );
    rotate.value = withTiming(Math.random() * 720 - 360, {
      duration: DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => {
    const dx = Math.cos(angle) * distance * progress.value;
    const dy = Math.sin(angle) * distance * progress.value;
    // Add a gravity-like fall to dy at the end of the trajectory
    const gravity = 60 * progress.value * progress.value;
    return {
      opacity: opacity.value,
      transform: [
        { translateX: originX + dx },
        { translateY: originY + dy + gravity },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          backgroundColor: color,
          borderRadius: shape === 'circle' ? PARTICLE_SIZE : 2,
          width: shape === 'circle' ? PARTICLE_SIZE : PARTICLE_SIZE * 0.6,
          height: PARTICLE_SIZE,
        },
        animatedStyle,
      ]}
    />
  );
}

export const CelebrationBurst = forwardRef<CelebrationBurstHandle, {}>(
  function CelebrationBurst(_props, ref) {
    const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
    const [trigger, setTrigger] = React.useState(0);

    useImperativeHandle(ref, () => ({
      play(x: number, y: number) {
        setOrigin({ x, y });
        setTrigger((t) => t + 1);
      },
    }));

    if (trigger === 0) return null;

    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      // Spread evenly with slight randomness
      const baseAngle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * 0.3;
      const angle = baseAngle + jitter;
      const distance = SPREAD_DISTANCE * (0.65 + Math.random() * 0.4);
      const color = COLORS[i % COLORS.length];
      const delay = Math.random() * 60;
      const shape: 'circle' | 'square' = Math.random() > 0.5 ? 'circle' : 'square';
      return (
        <Particle
          key={`${trigger}-${i}`}
          color={color}
          angle={angle}
          distance={distance}
          delay={delay}
          shape={shape}
          originX={origin.x}
          originY={origin.y}
          trigger={trigger}
        />
      );
    });

    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {particles}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PARTICLE_SIZE,
    height: PARTICLE_SIZE,
  },
});

/**
 * Root Index
 * Initial route - AuthGate handles proper redirection based on auth state
 */

import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@core/theme';

export default function Index() {
  // AuthGate in _layout.tsx handles routing based on auth state
  // This just shows a loading indicator while the redirect happens
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
